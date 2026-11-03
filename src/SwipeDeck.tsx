import {useMemo,useState} from 'react'
import {motion,useMotionValue,useTransform,AnimatePresence} from 'framer-motion'
import {useApp} from './store'
import {Bill} from './types'
import {CATS,EM,K} from './data'
import PayModal from './PayModal'
const pct=(b:Bill)=>Math.round(b.funded/b.amt*100)
export function BillCard({b}:{b:Bill}){return <div className="h-full bg-paper text-[#1c1719] rounded-[28px] p-5 flex flex-col shadow-2xl select-none">
 <div className="flex items-center gap-3"><div className="w-14 h-14 rounded-full bg-[#ffe3df] grid place-items-center text-3xl">{b.anon?'🦦':EM[b.cat]}</div><div><div className="font-display text-lg">{b.anon?b.name:`Meet ${b.name}, ${b.age}`}</div><div className="text-sm opacity-70">📍 {b.city}</div></div></div>
 <div className="mt-3 flex flex-wrap gap-1"><span className="pill bg-[#eee4da]">{EM[b.cat]} {b.cat}</span><span className="pill bg-[#d3f5e4] text-[#0d6b43]">✔ Verified bill</span>{b.due<=3&&<span className="pill bg-[#ffd9d9] text-[#a3151f]">Urgent</span>}</div>
 <div className="font-display text-4xl mt-2 tracking-tight">{K(b.amt)}</div><div className="text-sm opacity-70">Due in {b.due} day{b.due>1?'s':''} · private details hidden</div>
 <p className="italic flex-1 overflow-auto my-3">“{b.story}”</p>
 <div className="h-2 rounded bg-black/10 overflow-hidden"><div className="h-full bg-gradient-to-r from-coral to-peach" style={{width:pct(b)+'%'}}/></div><div className="text-sm opacity-70 mt-1">{pct(b)}% sponsored · {K(b.amt-b.funded)} to go</div></div>}
function Top({b,onSwipe}:{b:Bill;onSwipe:(d:'L'|'R')=>void}){
 const x=useMotionValue(0),rot=useTransform(x,[-200,200],[-18,18]),r=useTransform(x,[20,120],[0,1]),l=useTransform(x,[-120,-20],[1,0])
 return <motion.div className="absolute inset-0 cursor-grab touch-none" style={{x,rotate:rot}} drag="x" dragConstraints={{left:0,right:0}} dragElastic={.9}
  onDragEnd={(_,i)=>{if(i.offset.x>110)onSwipe('R');else if(i.offset.x<-110)onSwipe('L')}}
  exit={{x:(x.get()||1)>0?500:-500,opacity:0,transition:{duration:.25}}}>
  <BillCard b={b}/><motion.div style={{opacity:r}} className="absolute top-5 right-5 font-display text-2xl border-4 border-coral text-coral rounded-xl px-2 rotate-12">SPONSOR</motion.div>
  <motion.div style={{opacity:l}} className="absolute top-5 left-5 font-display text-2xl border-4 border-gray-500 text-gray-500 rounded-xl px-2 -rotate-12">PASS</motion.div></motion.div>}
export default function SwipeDeck(){
 const {bills,say}=useApp()
 const [f,setF]=useState({cat:'',max:'',urg:false}),[skip,setSkip]=useState<string[]>([]),[pay,setPay]=useState<{b:Bill;full:boolean}|null>(null)
 const deck=useMemo(()=>bills.filter((b:Bill)=>b.status==='verified'&&b.owner!=='me'&&b.funded<b.amt&&!skip.includes(b.id)&&(!f.cat||b.cat===f.cat)&&(!f.max||b.amt<=+f.max)&&(!f.urg||b.due<=3)),[bills,skip,f])
 const top=deck[0]
 const act=(d:'L'|'R'|'S')=>{if(!top)return;if(d==='L')setSkip(s=>[...s,top.id]);else setPay({b:top,full:d==='S'})}
 return <div><div className="flex gap-2 flex-wrap">
  <select aria-label="Category" className="inp !w-auto !mb-0" value={f.cat} onChange={e=>setF({...f,cat:e.target.value})}><option value="">All categories</option>{CATS.map(c=><option key={c}>{c}</option>)}</select>
  <select aria-label="Amount" className="inp !w-auto !mb-0" value={f.max} onChange={e=>setF({...f,max:e.target.value})}><option value="">Any amount</option><option value="5000">Under KSh 5,000</option><option value="15000">Under KSh 15,000</option></select>
  <label className="btn flex items-center gap-2"><input type="checkbox" checked={f.urg} onChange={e=>setF({...f,urg:e.target.checked})}/>Due in 3 days</label></div>
  <div className="relative mx-auto mt-6 h-[min(520px,68vh)] max-w-sm">
   {deck[2]&&<div className="absolute inset-0 scale-90 translate-y-7 opacity-60"><BillCard b={deck[2]}/></div>}
   {deck[1]&&<div className="absolute inset-0 scale-95 translate-y-3.5"><BillCard b={deck[1]}/></div>}
   <AnimatePresence>{top&&<Top key={top.id} b={top} onSwipe={d=>act(d)}/>}</AnimatePresence>
   {!top&&<div className="box text-center"><h2 className="font-display text-2xl">You’re all caught up</h2><p className="opacity-70 my-2">No more bills match your filters.</p><button className="btn-pri" onClick={()=>{setSkip([]);setF({cat:'',max:'',urg:false})}}>Reset</button></div>}</div>
  {top&&<div className="flex justify-center gap-4 mt-10"><button aria-label="Pass" className="btn !w-16 !h-16 !p-0 text-2xl" onClick={()=>act('L')}>❌</button><button aria-label="Sponsor" className="btn-pri !w-16 !h-16 !p-0 text-2xl" onClick={()=>act('R')}>❤️</button><button aria-label="Super like" className="btn !w-16 !h-16 !p-0 text-2xl" onClick={()=>act('S')}>⭐</button></div>}
  {pay&&<PayModal b={pay.b} full={pay.full} onClose={(paid:boolean)=>{setPay(null);if(paid){setSkip(s=>[...s,pay.b.id]);say('Match! Simulated payment complete.')}}}/>}</div>}
