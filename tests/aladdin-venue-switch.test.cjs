const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {test}=require('node:test');
const source=fs.readFileSync('themes/aladdin-2024-2025-1st-genie/settlement/view.js','utf8');
const storageKey='bollsar.venue.v1.production.aladdin-2024-2025-1st';

function fixture(saved){
 const values=new Map([['unrelated.records','preserve me']]);
 if(saved!==undefined) values.set(storageKey,saved);
 const maps={
  seoul:{venue:'샤롯데씨어터',floors:[{id:'seoul-floor'}]},
  busan:{venue:'드림씨어터',floors:[{id:'busan-floor'}]}
 };
 const seatMap={},context=vm.createContext({window:{},Object,ALADDIN_SEAT_MAPS:maps,SEAT_MAP:seatMap,
  WORK:{venue:maps.seoul.venue},localStorage:{getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)}});
 vm.runInContext(source,context);
 const performances=[
  {id:'seoul-1'}, {id:'seoul-2',venue:maps.seoul.venue},
  {id:'busan-1',venue:maps.busan.venue}, {id:'busan-2',venue:maps.busan.venue},
  {id:'busan-3',venue:maps.busan.venue}
 ];
 const records=[
  {perf:performances[0],rec:{seat:'1-1-1'}},
  {perf:performances[2],rec:{seat:'TV:BSN:1:REG:2:3'}},
  {perf:performances[3],rec:{seat:'TV:BSN:2:WC:4:5'}}
 ];
 const rendered=[];
 const args={records,performances,paletteHTML:()=>'<i>palette</i>',seatMapHTML(list){
  rendered.push({venue:seatMap.venue,records:list});
  return `<div data-seat-map="${seatMap.venue}"></div>`;
 }};
 return {theme:context.window.BollsarSettlementTheme,context,values,maps,seatMap,records,performances,args,rendered};
}

test('Aladdin defaults to Seoul and restores only a valid theme-scoped venue',()=>{
 for(const [saved,expected] of [[undefined,'seoul'],['busan','busan'],['seoul','seoul'],['other','seoul'],['__proto__','seoul']]){
  const f=fixture(saved);
  assert.equal(f.theme.selectedVenue(),expected);
  assert.equal(f.seatMap.venue,f.maps[expected].venue);
  assert.equal(f.seatMap.floors,f.maps[expected].floors);
  assert.equal(f.values.get('unrelated.records'),'preserve me');
 }
});

test('venue selection validates the map key and does not change stored records',()=>{
 const f=fixture(),before=JSON.stringify(f.records);
 for(const record of f.records){Object.freeze(record.rec);Object.freeze(record.perf);Object.freeze(record);}
 Object.freeze(f.records);
 for(const key of ['invalid','__proto__','constructor','toString']){
  assert.equal(f.theme.selectVenue(key),false);
  assert.equal(f.theme.selectedVenue(),'seoul');
 }
 assert.equal(f.theme.selectVenue('busan'),true);
 assert.equal(f.theme.selectedVenue(),'busan');
 assert.equal(f.seatMap.venue,f.maps.busan.venue);
 assert.equal(f.values.get(storageKey),'busan');
 assert.equal(f.theme.selectVenue('seoul'),true);
 assert.equal(f.seatMap.venue,f.maps.seoul.venue);
 assert.equal(f.values.get(storageKey),'seoul');
 assert.equal(JSON.stringify(f.records),before);
 assert.equal(f.values.get('unrelated.records'),'preserve me');
});

test('summary follows the selected city while the opposite city retains its own count',()=>{
 const f=fixture();
 const counts=key=>JSON.parse(JSON.stringify(f.theme.summary(f.records,f.performances,key)));
 assert.deepEqual(counts(),{watched:1,total:2});
 assert.deepEqual(counts('busan'),{watched:2,total:3});
 f.theme.selectVenue('busan');
 assert.deepEqual(counts(),{watched:2,total:3});
 assert.deepEqual(counts('seoul'),{watched:1,total:2});
});

test('the slider renders one selected map and a count-only row for the other city',()=>{
 const f=fixture();
 for(const [key,other,currentCount,otherCount] of [['seoul','busan','1 / 2','2 / 3'],['busan','seoul','2 / 3','1 / 2']]){
  f.theme.selectVenue(key);
  const html=f.theme.bodyHTML(f.args);
  assert.match(html,new RegExp(`data-venue="${key}"`));
  assert.match(html,new RegExp(`<strong>${currentCount}</strong>`));
  assert.match(html,new RegExp(`data-other-venue="${other}">[^<]*${otherCount}회</p>`));
  assert.equal((html.match(/data-seat-map=/g)||[]).length,1);
  assert(html.includes(`data-seat-map="${f.maps[key].venue}"`));
  assert(!html.includes(`data-seat-map="${f.maps[other].venue}"`));
  assert.match(html,new RegExp(`type="range" min="0" max="1" step="1" value="${key==='busan'?1:0}"`));
  assert.equal(f.rendered.at(-1).venue,f.maps[key].venue);
 }
});

test('Busan regional and wheelchair seat IDs are normalized for rendering without rewriting records',()=>{
 const f=fixture(),before=JSON.stringify(f.records);
 f.theme.bodyHTML(f.args);
 assert.equal(f.rendered.at(-1).records,f.records,'Seoul needs no record conversion');
 f.theme.selectVenue('busan');
 f.theme.bodyHTML(f.args);
 const normalized=f.rendered.at(-1).records;
 assert.equal(normalized[0],f.records[0]);
 assert.equal(normalized[1].rec.seat,'1-2-3');
 assert.equal(normalized[2].rec.seat,'2-4-W5');
 assert.notEqual(normalized[1].rec,f.records[1].rec);
 assert.equal(normalized[1].perf,f.records[1].perf);
 assert.equal(JSON.stringify(f.records),before);
});

test('PNG export has only the selected map and the opposite count, then removes its temporary board',async()=>{
 const f=fixture(),boards=[];
 Object.assign(f.context,{
  document:{fonts:{ready:Promise.resolve()},body:{append:board=>boards.push(board)},createElement:()=>({style:{},scrollWidth:0,setAttribute(){},remove(){this.removed=true;}})},
  requestAnimationFrame:callback=>callback(),
  html2canvas:async board=>{assert.equal(board,boards.at(-1));return {toBlob:callback=>callback('png-blob')};}
 });
 f.context.window.SeatLines={renderAll(){}};
 for(const [key,other,otherCount] of [['seoul','busan','2 / 3'],['busan','seoul','1 / 2']]){
  f.theme.selectVenue(key);
  assert.equal(await f.theme.exportPng(f.args),'png-blob');
  const board=boards.at(-1);
  assert.equal((board.innerHTML.match(/data-seat-map=/g)||[]).length,1);
  assert(board.innerHTML.includes(`data-seat-map="${f.maps[key].venue}"`));
  assert.match(board.innerHTML,new RegExp(`data-other-venue="${other}">[^<]*${otherCount}회</p>`));
  assert(!board.innerHTML.includes('type="range"'));
  assert.equal(board.removed,true);
 }
});
