(function(root){
'use strict';
function split(cents,shares){
 if(!Number.isSafeInteger(cents)||cents<=0||cents>1e10)throw Error('Enter an amount between 0.01 and 100,000,000.');
 if(!Array.isArray(shares)||!shares.length||shares.some(x=>!Number.isFinite(x)||x<0)||shares.reduce((a,b)=>a+b,0)<=0)throw Error('Choose at least one positive share.');
 const total=shares.reduce((a,b)=>a+b,0),raw=shares.map(x=>cents*x/total),out=raw.map(Math.floor);
 let left=cents-out.reduce((a,b)=>a+b,0);const order=raw.map((x,i)=>({i,r:x-out[i]})).sort((a,b)=>b.r-a.r||a.i-b.i);
 for(let k=0;k<left;k++)out[order[k%order.length].i]++;return out;
}
function validate(s){
 if(!s||s.version!==1||!Array.isArray(s.people)||s.people.length>10||!Array.isArray(s.expenses)||s.expenses.length>500)throw Error('Invalid backup (maximum 10 people / 500 expenses).');
 if(s.people.some(p=>typeof p!=='string'||!p.trim()||p.length>40)||new Set(s.people).size!==s.people.length)throw Error('Invalid people.');
 for(const e of s.expenses){if(!e||typeof e.title!=='string'||e.title.length>80||!Number.isInteger(e.payer)||e.payer<0||e.payer>=s.people.length||!Array.isArray(e.shares)||e.shares.length!==s.people.length)throw Error('Invalid expense.');split(e.cents,e.shares);}
 return {version:1,people:s.people,expenses:s.expenses.map(e=>({title:e.title,payer:e.payer,cents:e.cents,shares:e.shares}))};
}
function balances(s){let b=s.people.map(()=>0);for(const e of s.expenses){const parts=split(e.cents,e.shares);b[e.payer]+=e.cents;parts.forEach((p,i)=>b[i]-=p);}return b;}
function settle(input){
 const b=input.slice(),memo=new Map();
 function solve(){let i=b.findIndex(x=>x!==0);if(i<0)return [];const key=b.join(',');if(memo.has(key))return memo.get(key);
 let best=null;const seen=new Set();for(let j=i+1;j<b.length;j++){if(b[i]*b[j]>=0||seen.has(b[j]))continue;seen.add(b[j]);const a=b[i],c=b[j],n=Math.min(Math.abs(a),Math.abs(c));b[i]+=a<0?n:-n;b[j]+=c<0?n:-n;const tail=solve();const step={from:a<0?i:j,to:a>0?i:j,cents:n};const result=[step,...tail];if(!best||result.length<best.length)best=result;b[i]=a;b[j]=c;if(a+c===0)break;}memo.set(key,best||[]);return best||[];
 }return solve();
}
const api={split,validate,balances,settle};if(typeof module!=='undefined')module.exports=api;else root.SplitMath=api;
})(typeof window!=='undefined'?window:globalThis);
