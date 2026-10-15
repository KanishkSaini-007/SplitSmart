const assert=require('node:assert/strict');const {split,validate,balances,settle}=require('./logic.js');let n=0;function test(name,fn){fn();n++;console.log('✓',name);}
test('equal split allocates every paisa deterministically',()=>assert.deepEqual(split(100,[1,1,1]),[34,33,33]));
test('custom weights and exclusions',()=>assert.deepEqual(split(10000,[1,2,0,1]),[2500,5000,0,2500]));
test('reject zero total shares',()=>assert.throws(()=>split(100,[0,0])));
test('reject nonfinite shares',()=>assert.throws(()=>split(100,[Infinity,1])));
test('reject invalid amount',()=>assert.throws(()=>split(-10,[1])));
test('expense ledger balances to zero',()=>{const s={people:['A','B','C'],expenses:[{payer:0,cents:100,shares:[1,1,1]}]};assert.deepEqual(balances(s),[66,-33,-33]);});
test('exact cancellation uses minimum 2 transfers',()=>assert.equal(settle([-5,-10,5,10]).length,2));
test('non-greedy counterexample finds 3 not 4 moves',()=>assert.equal(settle([-6,-4,-4,6,8]).length,3));
test('all settled has no moves',()=>assert.deepEqual(settle([0,0,0]),[]));
test('backup validation rejects oversized and malformed groups',()=>{assert.throws(()=>validate({version:1,people:['A','A'],expenses:[]}));assert.throws(()=>validate({version:1,people:['A'],expenses:[{payer:1,title:'bad',cents:100,shares:[1]}]}));});
test('500 seeded ledgers settle exactly and conserve each expense',()=>{let seed=13;const rnd=()=>((seed=(seed*1664525+1013904223)>>>0)/2**32);for(let k=0;k<500;k++){const people=Array.from({length:2+Math.floor(rnd()*6)},(_,i)=>''+i);let expenses=[];for(let j=0;j<8;j++){const cents=1+Math.floor(rnd()*100000),shares=people.map(()=>Math.floor(rnd()*4));if(!shares.some(Boolean))shares[0]=1;assert.equal(split(cents,shares).reduce((a,b)=>a+b,0),cents);expenses.push({payer:Math.floor(rnd()*people.length),cents,shares});}const b=balances({people,expenses});assert.equal(b.reduce((a,b)=>a+b,0),0);for(const t of settle(b)){assert(t.cents>0);b[t.from]+=t.cents;b[t.to]-=t.cents;}assert(b.every(x=>x===0));}});
console.log(`${n} tests passed`);
