const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {test}=require('node:test');

test('Aladdin has a stable ID and no invented performances, remote client or legacy record import',()=>{
 const values=new Map([['bollsar.records.v2.user.existing','[{"key":"old-performance"}]']]);
 const button={disabled:false},analytics=[];
 const context={console:{warn(){},error(){}},Intl,Date,
  localStorage:{getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)},
  document:{addEventListener(){},getElementById:()=>button},
  supabase:{createClient(){throw Error('Preparation must not create a remote client');}},
  gtag:(...args)=>analytics.push(args)};
 vm.createContext(context);
 vm.runInContext(fs.readFileSync('productions/aladdin-2024-2025-1st/data/schedule.js','utf8')+'\n'+fs.readFileSync('productions/aladdin-2024-2025-1st/data/seat-map.js','utf8')+'\n'+fs.readFileSync('data.js','utf8')+`
  globalThis.result={id:WORK.id,preparing:WORK.preparing,perfs:PERFS.length,floors:SEAT_MAP.floors.length,
   period:WORK.period,role:ROLES[0].id,records:loadLocalRecords({id:'existing'}),key:recordsStorageKey({id:'existing'}),remote:SB};
  mountAuth(value=>globalThis.authenticated=value);
  track('preview_event',{});
 `,context);
 assert.equal(context.result.id,'aladdin-2024-2025-1st');assert.equal(context.result.preparing,true);
 assert.equal(context.result.perfs,0);assert.equal(context.result.floors,2);assert.equal(context.result.role,'genie');
 assert.equal(context.result.period.start,'');assert.equal(context.result.period.end,'');
 assert.equal(context.result.records.length,0);assert.equal(context.result.remote,null);assert.equal(context.authenticated,false);
 assert.equal(button.disabled,true);assert.equal(analytics.length,0);
 assert.equal(context.result.key,'bollsar.records.v2.production.aladdin-2024-2025-1st.user.existing');
 assert.equal(values.size,1,'opening the preview must not copy old records');
 assert.equal(values.get('bollsar.records.v2.user.existing'),'[{"key":"old-performance"}]');
});

test('preparation entry points deny network connections, omit analytics and use shared applications',()=>{
 for(const [file,page] of [['index.html','schedule'],['settlement.html','settlement']]){
  const html=fs.readFileSync('aladdin/'+file,'utf8');
  assert.match(html,/connect-src 'none'/);assert.match(html,/name="robots" content="noindex,nofollow"/);
  assert.doesNotMatch(html,/supabase-js|googletagmanager|gtag\(/);
  assert(html.includes(`data-page="${page}" data-production="aladdin-2024-2025-1st"`));
 }
 const config=JSON.parse(fs.readFileSync('vercel.json','utf8'));
 assert.deepEqual(config.redirects,[{source:'/',destination:'/aladdin/',permanent:false}]);
});
