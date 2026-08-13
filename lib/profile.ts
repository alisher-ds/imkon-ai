export type UserProfile={location:string;category:string;experience:string;mode:string;type:string};
export function saveProfile(profile:UserProfile){if(typeof window!=='undefined') localStorage.setItem('imkon-profile',JSON.stringify(profile));}
export function loadProfile():UserProfile|null{if(typeof window==='undefined') return null;try{return JSON.parse(localStorage.getItem('imkon-profile')||'null')}catch{return null}}
