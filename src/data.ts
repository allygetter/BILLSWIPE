import {Bill} from './types'
export const CATS=['Electricity','Water','Rent','Internet','School fees','Medical','Groceries']
export const EM:Record<string,string>={Electricity:'💡',Water:'🚰',Rent:'🏠',Internet:'📶','School fees':'🎒',Medical:'💊',Groceries:'🛒'}
export const K=(n:number)=>'KSh '+Math.round(n).toLocaleString('en-KE')
const m=(id:string,name:string,age:number,city:string,cat:string,amt:number,funded:number,due:number,story:string,status:Bill['status']='verified',flag?:string):Bill=>({id,name,age,city,cat,amt,funded,due,story,status,flag,owner:'seed',anon:name.startsWith('Anonymous')})
export const SEED:Bill[]=[
m('b1','Alex',24,'Nairobi','Electricity',4850,1200,3,'I recently lost my job, and I’m trying to keep the electricity connected while getting back on my feet.'),
m('b2','Wanjiru',31,'Mlolongo','Rent',18000,6000,5,'Single mum of two. My salary was delayed and my landlord has been patient, but not forever.'),
m('b3','Anonymous Otter',19,'Kisumu','School fees',22500,15000,9,'First in my family at university. Fees are the last hurdle before exams.'),
m('b4','Brian',28,'Mombasa','Internet',2999,0,2,'I freelance as a developer. No Wi-Fi means no clients.'),
m('b5','Amina',45,'Nakuru','Medical',12400,3100,4,'Follow-up treatment for my diabetes. The pharmacy bill came in higher than expected.'),
m('b6','Anonymous Fox',36,'Eldoret','Water',1350,900,1,'Water is disconnected tomorrow. We have a newborn at home.'),
m('p1','Grace',27,'Nairobi','Electricity',3200,0,5,'Meter reads low and payday is a week away.','pending','Document metadata looks edited'),
m('p2','Sam',33,'Kisumu','Rent',9000,0,8,'Behind on rent after a medical emergency.','pending','Possible duplicate of an earlier bill')]
