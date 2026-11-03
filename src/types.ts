export type Role='seeker'|'sponsor'|'admin'
export type Status='pending'|'verified'|'rejected'
export interface User{name:string;role:Role}
export interface Bill{id:string;name:string;age:number;city:string;cat:string;amt:number;funded:number;due:number;story:string;status:Status;owner:string;anon:boolean;flag?:string}
export interface Tx{id:string;billId:string;to:string;cat:string;amt:number;by:string;method:string}
