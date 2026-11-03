import {useApp} from './store'
import SwipeDeck from './SwipeDeck'
import {Home,Auth,Dash,Upload,Admin,Notes,How} from './Pages'
export default function App(){
 const {user,view,setView,logout,notes,toast}=useApp()
 const guarded=['swipe','dash','upload','notes','admin'].includes(view)&&!user
 const v=guarded?'auth':view
 const V:any={home:<Home/>,how:<div><h2 className="font-display text-3xl mb-4">How it works</h2><How/></div>,auth:<Auth/>,swipe:<SwipeDeck/>,dash:user&&<Dash/>,upload:<Upload/>,admin:<Admin/>,notes:<Notes/>}
 return <div className="min-h-screen" style={{paddingTop:'env(safe-area-inset-top)',paddingBottom:'env(safe-area-inset-bottom)'}}>
  <nav className="sticky top-0 z-40 flex flex-wrap items-center gap-2 px-4 py-3 bg-ink/90 backdrop-blur border-b border-line">
   <button className="mr-auto font-display text-xl text-coral" onClick={()=>setView('home')}>BILLFLIRT ❤️</button>
   {!user?<><button className="btn !py-1.5" onClick={()=>setView('how')}>How it works</button><button className="btn-pri !py-1.5" onClick={()=>setView('auth')}>Log in</button></>
   :<>{user.role==='sponsor'&&<button className="btn !py-1.5" onClick={()=>setView('swipe')}>Swipe</button>}{user.role==='seeker'&&<button className="btn !py-1.5" onClick={()=>setView('upload')}>Upload</button>}
    <button className="btn !py-1.5" onClick={()=>setView(user.role==='admin'?'admin':'dash')}>Dashboard</button><button className="btn !py-1.5" aria-label="Notifications" onClick={()=>setView('notes')}>🔔 {notes.length}</button><button className="btn !py-1.5" onClick={logout}>Log out</button></>}</nav>
  <main className="max-w-4xl mx-auto px-4 py-6 pb-20">{V[v]}</main>
  {toast&&<div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-coral text-white font-bold px-5 py-3 rounded-full z-[60]">{toast}</div>}</div>}
