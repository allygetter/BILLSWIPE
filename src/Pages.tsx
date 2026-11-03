import {useState} from 'react'
import {motion} from 'framer-motion'
import {useApp} from './store'
import {Bill} from './types'
import {CATS,EM,K} from './data'
import {BillCard} from './SwipeDeck'
const pct=(b:Bill)=>Math.round(b.funded/b.amt*100)
const Stat=({v,l}:{v:any;l:string})=><div className="box"><div className="font-display text-3xl text-peach">{v}</div><div className="text-sm opacity-70">{l}</div></div>
const Bar=({b}:{b:Bill})=><div className="h-2 rounded bg-white/10 overflow-hidden my-1"><div className="h-full bg-gradient-to-r from-coral to-peach" style={{width:pct(b)+'%'}}/></div>
const Hist=({t,empty}:{t:any[];empty:string})=>t.length?<div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left opacity-60"><th className="p-2">Receipt</th><th>Bill</th><th>Amount</th><th>Status</th></tr></thead><tbody>{t.map(x=><tr key={x.id} className="border-t border-line"><td className="p-2">{x.id}</td><td>{x.cat} · {x.to}</td><td>{K(x.amt)}</td><td>Simulated · reconciled</td></tr>)}</tbody></table></div>:<p className="opacity-60">{empty}</p>
const How=()=><div className="grid sm:grid-cols-3 gap-4">{[['Upload','Add a bill and a short story. We verify it and hide private details.'],['Swipe','Sponsors browse anonymized, verified bill cards.'],['Match','Pay in full or chip in. Get a receipt and a thank-you.']].map(([t,d],i)=><div key={t} className="box"><h3 className="font-display text-xl">{i+1}. {t}</h3><p className="opacity-70">{d}</p></div>)}</div>
export function Home(){const {setView,bills,tx}=useApp()
 return <div><section className="grid md:grid-cols-[1.2fr_1fr] gap-8 items-center py-8">
  <div><h1 className="font-display text-5xl md:text-7xl tracking-tighter leading-none">Your Bills Are Someone Else’s Good Deed.</h1><p className="text-xl opacity-70 my-4">Upload your bills. Meet someone who wants to pay them.</p>
   <div className="flex flex-wrap gap-3"><button className="btn-pri text-lg" onClick={()=>setView('auth')}>I Need My Bills Paid</button><button className="btn text-lg" onClick={()=>setView('auth')}>I Want to Pay Bills</button></div>
   <p className="opacity-60 mt-5">Finally, a dating app where getting ghosted means your electricity stays off.</p></div>
  <div className="relative h-[400px] max-w-xs mx-auto w-full"><div className="absolute inset-0 rotate-6 scale-90 opacity-60"><BillCard b={bills[1]}/></div>
   <motion.div className="absolute inset-0" animate={{x:[0,30,0],rotate:[0,6,0]}} transition={{repeat:Infinity,duration:3.5}}><BillCard b={bills[0]}/></motion.div></div></section>
  <div className="grid sm:grid-cols-3 gap-4 my-6"><Stat v={1284+bills.filter((b:Bill)=>b.funded>=b.amt).length} l="bills paid"/><Stat v={K(3920000+tx.reduce((s:number,t:any)=>s+t.amt,0))} l="total sponsored (demo figures)"/><Stat v="612" l="active sponsors"/></div>
  <h2 className="font-display text-3xl my-4">How it works</h2><How/>
  <h2 className="font-display text-3xl mt-8 mb-4">Featured bills</h2><div className="grid sm:grid-cols-3 gap-4">{bills.filter((b:Bill)=>b.status==='verified').slice(0,3).map((b:Bill)=><div key={b.id} className="box"><h3 className="font-display">{b.anon?b.name:`${b.name}, ${b.age}`}</h3>{EM[b.cat]} {b.cat} · {K(b.amt)}<Bar b={b}/><small>{pct(b)}% sponsored</small></div>)}</div>
  <h2 className="font-display text-3xl mt-8 mb-4">Success stories</h2><div className="grid sm:grid-cols-3 gap-4">{['“Someone paid my power bill while I was interviewing. I got the job the next day.” – Mercy, Nairobi','“KSh 500 towards someone’s water feels great.” – Anonymous sponsor','“The thank-you note made my week. Rent sorted.” – Joseph, Kisumu'].map(t=><div key={t} className="box">{t}</div>)}</div></div>}
export function Auth(){const {login,say}=useApp(),[n,setN]=useState(''),[e,setE]=useState(''),[r,setR]=useState('seeker')
 return <div className="box max-w-md mx-auto"><h2 className="font-display text-3xl mb-3">Join BILLFLIRT</h2>
  <input className="inp" placeholder="Name" value={n} onChange={x=>setN(x.target.value)}/><input className="inp" type="email" placeholder="Email" value={e} onChange={x=>setE(x.target.value)}/><input className="inp" type="password" placeholder="Password"/>
  <select className="inp" value={r} onChange={x=>setR(x.target.value)}><option value="seeker">I’m a bill seeker</option><option value="sponsor">I’m a sponsor</option></select>
  <button className="btn-pri w-full" onClick={()=>n.trim()&&e.includes('@')?login(r,n.trim()):say('Enter your name and a valid email')}>Create account</button>
  <p className="opacity-60 my-3">Or try a demo account:</p><div className="flex gap-2">{['seeker','sponsor','admin'].map(x=><button key={x} className="btn capitalize" onClick={()=>login(x)}>{x}</button>)}</div></div>}
export function Dash(){const {user,bills,tx,setView,simSponsor}=useApp(),mine=bills.filter((b:Bill)=>b.owner==='me')
 if(user.role==='seeker')return <div><h2 className="font-display text-3xl mb-4">Hi {user.name} 👋</h2>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3"><Stat v={mine.length} l="bills uploaded"/><Stat v={mine.filter((b:Bill)=>b.status==='verified'&&!b.funded).length} l="awaiting sponsor"/><Stat v={mine.filter((b:Bill)=>b.funded>0&&b.funded<b.amt).length} l="partially funded"/><Stat v={mine.filter((b:Bill)=>b.funded>=b.amt).length} l="fully sponsored"/></div>
  <button className="btn-pri my-4" onClick={()=>setView('upload')}>Upload a bill</button>
  <h3 className="font-display text-xl mb-2">Your bills</h3>{mine.map((b:Bill)=><div key={b.id} className="box mb-2 flex flex-wrap items-center gap-3"><div className="flex-1 min-w-40"><b>{EM[b.cat]} {b.cat}</b> · {K(b.amt)}<Bar b={b}/><small>{pct(b)}% sponsored</small></div>
   <span className={`pill ${b.status==='verified'?'bg-emerald-400 text-black':b.status==='pending'?'bg-yellow-400 text-black':'bg-coral'}`}>{b.status}</span>{b.status==='verified'&&b.funded<b.amt&&<button className="btn" onClick={()=>simSponsor(b.id)}>Simulate a sponsor</button>}</div>)}
  <h3 className="font-display text-xl mt-6 mb-2">Sponsorship history</h3><Hist t={tx.filter((t:any)=>mine.some((b:Bill)=>b.id===t.billId))} empty="Nothing yet. Sponsors appear here after they pay."/></div>
 const tot=tx.reduce((s:number,t:any)=>s+t.amt,0),lb=[['Anonymous Whale',482000],['Njeri K.',215000],['Dennis O.',98000],[user.name,tot]].sort((a:any,b:any)=>b[1]-a[1])
 return <div><h2 className="font-display text-3xl mb-4">Sponsor dashboard</h2><div className="grid grid-cols-2 md:grid-cols-4 gap-3"><Stat v={K(tot)} l="sponsored (simulated)"/><Stat v={tx.length} l="payments"/><Stat v={bills.filter((b:Bill)=>b.status==='verified'&&b.funded>=b.amt).length} l="bills fully paid"/><Stat v={tx.length>=3?'🏅 Bill Hero':tx.length?'🌱 First Match':'–'} l="achievement"/></div>
  <button className="btn-pri my-4" onClick={()=>setView('swipe')}>Keep swiping</button><h3 className="font-display text-xl mb-2">History</h3><Hist t={tx} empty="No sponsorships yet. Swipe right on a bill."/>
  <h3 className="font-display text-xl mt-6 mb-2">Leaderboard</h3>{lb.map((r:any,i:number)=><div key={r[0]} className="box mb-2 flex justify-between"><span>#{i+1} {r[0]}</span><b>{K(r[1])}</b></div>)}</div>}
export function Upload(){const {user,addBill,say,setView}=useApp(),[d,setD]=useState<any>({cat:CATS[0],cur:'KES',pref:'Full or partial'}),[file,setFile]=useState<File|null>(null),[ok,setOk]=useState(false),[agree,setAgree]=useState(false)
 const set=(k:string)=>(e:any)=>setD({...d,[k]:e.target.value})
 const pick=(f?:File)=>{if(!f)return;if(f.size>10e6){say('File must be under 10 MB');return}setFile(f);setOk(false);setTimeout(()=>setOk(true),900)}
 const send=()=>{if(!d.prov||!d.amt||!d.date||!file||(d.story||'').length<20||!agree){say('Complete every field, add a document and a 20+ character story, and give consent');return}
  addBill({name:d.anon?'Anonymous Heron':user.name,age:26,city:'Nairobi',cat:d.cat,amt:+d.amt,due:Math.max(1,Math.ceil((+new Date(d.date)-Date.now())/864e5)),story:d.story,anon:!!d.anon});say('Submitted for verification');setView('dash')}
 return <div className="box max-w-xl mx-auto"><h2 className="font-display text-3xl mb-3">Upload a bill</h2>
  <select className="inp" value={d.cat} onChange={set('cat')}>{CATS.map(c=><option key={c}>{c}</option>)}</select><input className="inp" placeholder="Bill provider" onChange={set('prov')}/>
  <div className="flex gap-2"><input className="inp" type="number" placeholder="Amount" onChange={set('amt')}/><select className="inp !w-28" value={d.cur} onChange={set('cur')}><option>KES</option><option>USD</option></select></div>
  <label className="text-sm opacity-70">Payment deadline</label><input className="inp" type="date" onChange={set('date')}/><input className="inp" placeholder="Reference number (stored privately)" onChange={set('ref')}/>
  <select className="inp" value={d.pref} onChange={set('pref')}><option>Full or partial</option><option>Full only</option></select>
  <input className="inp" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e=>pick(e.target.files?.[0])}/>
  {file&&(file.type.startsWith('image/')?<img className="rounded-2xl mb-2" src={URL.createObjectURL(file)} alt="Bill preview"/>:<div className="box mb-2">📄 {file.name}</div>)}
  {file&&<p className="text-sm opacity-70 mb-3">{ok?`✔ OCR (simulated) read provider “${d.prov||'?'}”. ✔ No duplicate found.`:'Reading document…'}</p>}
  <textarea className="inp" rows={4} maxLength={240} placeholder="Why do you need help? (shown on your card)" onChange={set('story')}/>
  <label className="flex gap-2 mb-2"><input type="checkbox" onChange={e=>setD({...d,anon:e.target.checked})}/>Use an anonymous username</label>
  <label className="flex gap-2 mb-4"><input type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)}/>I consent to admin review. Sponsors never see my document.</label>
  <button className="btn-pri" onClick={send}>Submit for verification</button></div>}
export function Admin(){const {bills,tx,audit,decide}=useApp(),p=bills.filter((b:Bill)=>b.status==='pending')
 return <div><h2 className="font-display text-3xl mb-4">Admin console</h2><div className="grid grid-cols-2 md:grid-cols-3 gap-3"><Stat v={1840+bills.length} l="registered users"/><Stat v={bills.length} l="bills uploaded"/><Stat v={bills.filter((b:Bill)=>b.status==='verified').length} l="verified"/><Stat v={p.length} l="pending"/><Stat v={K(tx.reduce((s:number,t:any)=>s+t.amt,0))} l="simulated volume"/><Stat v={p.filter((b:Bill)=>b.flag).length} l="fraud alerts"/></div>
  <h3 className="font-display text-xl mt-6 mb-2">Verification queue</h3>{p.map((b:Bill)=><div key={b.id} className="box mb-2 flex flex-wrap gap-3 items-center"><div className="flex-1 min-w-48"><b>{b.name}</b> · {b.cat} · {K(b.amt)}<br/><small className="opacity-70">“{b.story}”</small>{b.flag&&<div><span className="pill bg-coral">⚠ {b.flag}</span></div>}</div><button className="btn-pri" onClick={()=>decide(b.id,'verified')}>Approve</button><button className="btn" onClick={()=>decide(b.id,'rejected')}>Reject</button></div>)}{!p.length&&<p className="opacity-60">Queue is clear.</p>}
  <h3 className="font-display text-xl mt-6 mb-2">Transactions (simulated)</h3><Hist t={tx} empty="No transactions yet."/><h3 className="font-display text-xl mt-6 mb-2">Audit log</h3>{audit.map((a:string)=><div key={a} className="border-b border-line py-2 text-sm">{a}</div>)}{!audit.length&&<p className="opacity-60">No actions yet.</p>}</div>}
export function Notes(){const {notes,setNotes}=useApp()
 return <div><h2 className="font-display text-3xl mb-4">Notifications</h2>{notes.map((n:string,i:number)=><div key={i} className="box mb-2">{n}</div>)}{!notes.length&&<p className="opacity-60">Nothing new.</p>}<button className="btn mt-3" onClick={()=>setNotes([])}>Clear all</button></div>}
export {How}
