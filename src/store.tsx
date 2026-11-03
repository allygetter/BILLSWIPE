import {createContext,useContext,useState,ReactNode} from 'react'
import {Bill,Role,Tx,User} from './types'
import {SEED} from './data'
const Ctx=createContext<any>(null)
export const useApp=()=>useContext(Ctx)
export function Provider({children}:{children:ReactNode}){
 const [user,setUser]=useState<User|null>(null)
 const [bills,setBills]=useState<Bill[]>(SEED)
 const [tx,setTx]=useState<Tx[]>([])
 const [notes,setNotes]=useState<string[]>([])
 const [audit,setAudit]=useState<string[]>([])
 const [view,setView]=useState('home')
 const [toast,setToast]=useState('')
 const say=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),2600)}
 const note=(m:string)=>setNotes(n=>[m,...n])
 const login=(role:Role,name?:string)=>{
  const n=name||({seeker:'Demo Seeker',sponsor:'Demo Sponsor',admin:'Admin'} as any)[role]
  setUser({role,name:n})
  if(role==='seeker')setBills(b=>[...b,{id:'mine',name:n,age:26,city:'Nairobi',cat:'Water',amt:2100,funded:0,due:6,story:'Demo bill so you can see your dashboard.',status:'verified',owner:'me',anon:false}])
  note(role==='seeker'?'Welcome! Upload a bill to get started.':'Welcome to BILLFLIRT.')
  setView(role==='seeker'?'dash':role==='sponsor'?'swipe':'admin')}
 const logout=()=>{setUser(null);setBills(SEED);setTx([]);setNotes([]);setAudit([]);setView('home')}
 const sponsor=(b:Bill,amt:number,anon:boolean,method:string)=>{
  const f=b.funded+amt
  setBills(a=>a.map(x=>x.id===b.id?{...x,funded:f}:x))
  setTx(t=>[{id:'SIM-'+(1001+t.length),billId:b.id,to:b.name,cat:b.cat,amt,by:anon?'Anonymous':user!.name,method},...t])
  note(f>=b.amt?`${b.name}’s bill is fully sponsored!`:`You paid KSh ${amt} (simulated) towards ${b.name}’s bill.`)}
 const addBill=(x:Omit<Bill,'id'|'status'|'owner'|'funded'>)=>{setBills(b=>[...b,{...x,id:'u'+b.length,funded:0,status:'pending',owner:'me'}]);note('Bill submitted. An admin will verify it shortly.')}
 const decide=(id:string,s:'verified'|'rejected')=>{const b=bills.find(x=>x.id===id)!
  setBills(a=>a.map(x=>x.id===id?{...x,status:s}:x))
  setAudit(a=>[`${new Date().toLocaleTimeString()} · Admin ${s==='verified'?'approved':'rejected'} ${b.cat} bill from ${b.name}`,...a])
  if(b.owner==='me')note(s==='verified'?'Your bill is verified and live!':'Your bill was rejected. Check the document and resubmit.')}
 const simSponsor=(id:string)=>{const b=bills.find(x=>x.id===id)!,a=Math.min(1000,b.amt-b.funded)
  setBills(l=>l.map(x=>x.id===id?{...x,funded:x.funded+a}:x))
  setTx(t=>[{id:'SIM-'+(2001+t.length),billId:id,to:b.name,cat:b.cat,amt:a,by:'Anonymous',method:'M-Pesa'},...t])
  note(b.funded+a>=b.amt?'Congratulations! Your bill is fully sponsored.':`Someone just swiped right on your ${b.cat.toLowerCase()} bill!`)}
 return <Ctx.Provider value={{user,bills,tx,notes,audit,view,setView,toast,say,login,logout,sponsor,addBill,decide,simSponsor,setNotes}}>{children}</Ctx.Provider>}
