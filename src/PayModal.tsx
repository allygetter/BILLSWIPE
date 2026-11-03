import {useState} from 'react'
import {useApp} from './store'
import {Bill} from './types'
import {K} from './data'
export default function PayModal({b,full,onClose}:{b:Bill;full:boolean;onClose:(paid:boolean)=>void}){
 const {sponsor,say}=useApp(),rem=b.amt-b.funded
 const [amt,setAmt]=useState(full?rem:Math.min(rem,2000)),[anon,setAnon]=useState(false),[m,setM]=useState('M-Pesa (Daraja)'),[done,setDone]=useState(false)
 const go=()=>{if(!amt||amt<100||amt>rem){say(`Enter an amount from KSh 100 to ${K(rem)}`);return}sponsor(b,amt,anon,m);setDone(true)}
 return <div className="fixed inset-0 bg-black/70 grid place-items-center p-4 z-50"><div className="box max-w-md w-full max-h-[90vh] overflow-auto">
  {done?<div className="text-center"><div className="text-5xl">🎉</div><h2 className="font-display text-3xl my-2">It’s a match!</h2><p>You sponsored {b.name}’s {b.cat.toLowerCase()} bill with {K(amt)}{anon?' anonymously':''}.</p>
   <div className="bg-yellow-400 text-black font-bold text-sm rounded-xl p-2 my-3">Simulated transaction. No real money moved.</div>
   <div className="flex gap-2 justify-center"><button className="btn" onClick={()=>{navigator.clipboard?.writeText('I just sponsored a bill on BILLFLIRT 💸 Swipe right. Make someone’s day.');say('Share card text copied')}}>Share success card</button><button className="btn-pri" onClick={()=>onClose(true)}>Keep swiping</button></div></div>
  :<><h2 className="font-display text-2xl">{full?'⭐ Super like':'❤️ Sponsor'} {b.name}</h2><p className="opacity-70 mb-3">{b.cat} · {K(rem)} remaining</p>
   <label className="text-sm opacity-70">Amount (KSh)</label><input className="inp" type="number" value={amt} min={100} max={rem} onChange={e=>setAmt(+e.target.value)}/>
   <div className="flex gap-2 mb-3"><button className="btn" onClick={()=>setAmt(rem)}>Cover the rest</button><button className="btn" onClick={()=>setAmt(Math.round(rem/2))}>Half</button></div>
   <select className="inp" value={m} onChange={e=>setM(e.target.value)}><option>M-Pesa (Daraja)</option><option>Debit / credit card</option><option>Stripe</option><option>PayPal</option></select>
   <label className="flex gap-2 mb-3"><input type="checkbox" checked={anon} onChange={e=>setAnon(e.target.checked)}/>Sponsor anonymously</label>
   <div className="bg-yellow-400 text-black font-bold text-sm rounded-xl p-2 mb-3">⚠ SIMULATED PAYMENT. No real money moves in this demo.</div>
   <div className="flex gap-2"><button className="btn-pri" onClick={go}>Pay (simulated)</button><button className="btn" onClick={()=>onClose(false)}>Not now</button></div></>}</div></div>}
