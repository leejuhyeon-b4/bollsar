const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const {test} = require('node:test');
const source = fs.readFileSync('themes/kinky-boots-2025-2026-7th-lola/schedule/view.js','utf8');
const context = {window:{setTimeout(){}},MutationObserver:class {observe(){}},requestAnimationFrame(){},document:{readyState:'loading',addEventListener(){},querySelector(){return {}},querySelectorAll(){return []}}};
vm.runInNewContext(source,context);
const render = context.window.BollsarScheduleTheme.render;

test('active view follows the real view value',()=>{
 for(const value of ['calendar','list']) {
  const html=render.viewTabsHTML({view:value});
  assert.match(html,new RegExp(`data-view="${value}" aria-selected="true" aria-pressed="true"`));
  assert.equal((html.match(/aria-selected="true"/g)||[]).length,1);
 }
});
test('single shoebox image, time and event stay outside the box, portrait supported',()=>{
 const common={cls:'np-cell',day:25,eventText:'CHRISTMAS SPECIAL',eventCount:1};
 const red=render.calendarCellHTML({...common,times:['14:00','19:00'],PHOTO:'actor.png',actorName:'강홍석'});
 const green=render.calendarCellHTML({...common,times:[],hasOtherPerf:true});
 assert.match(red,/price-simon-box-vivid.png/);assert.match(green,/price-son-box.png/);
 assert.equal((red.match(/class="kb-box"/g)||[]).length,1);
 assert.match(red,/kb-actor/);assert.match(red,/14:00/);assert.match(red,/19:00/);
 assert(red.indexOf('kb-perf-meta')>red.indexOf('class="kb-box"'));
 assert(red.indexOf('kb-event-label')>red.indexOf('kb-perf-meta'));
 assert.doesNotMatch(red,/mask|redwash|logo-overlay|hue-rotate/);
 assert.doesNotMatch(green,/kb-perf-meta/);
 for(const brand of ['son','simon']) {
  const asset=fs.readFileSync(`tests/fixtures/kinky/price-${brand}-box.svg`,'utf8');
  assert.match(asset,/x="72" y="120" width="336" height="132"/);
  assert.equal((asset.match(/<image /g)||[]).length,2); // blank box and one complete oval
  const png=fs.readFileSync(`themes/kinky-boots-2025-2026-7th-lola/assets/schedule/price-${brand}-box${brand==='simon'?'-vivid':''}.png`);
  assert.equal(png.subarray(1,4).toString(),'PNG');assert.equal(png.readUInt32BE(16),480);assert.equal(png.readUInt32BE(20),280);
 }
});

test('vivid red box preserves the original gold label and filters only the box image',()=>{
 const root='tests/fixtures/kinky/';
 const original=fs.readFileSync(root+'price-simon-box.svg','utf8');
 const vivid=fs.readFileSync(root+'price-simon-box-vivid.svg','utf8');
 const images=text=>text.match(/<image\b[^>]*>/g);
 const originalImages=images(original),vividImages=images(vivid);
 assert.equal(vividImages.length,2);
 assert.equal(vividImages[1],originalImages[1],'gold label must remain byte-identical');
 assert.match(vividImages[0],/filter="url\(#.+\)"/);
 assert.doesNotMatch(vividImages[1],/filter=/);
});
test('outer two-column layout spans tabs and main event, including list view',()=>{
 const html=render.pageHTML({tabs:'TABS',lead:'MAIN EVENT',content:'CALENDAR OR LIST'});
 assert.match(html,/<section class="kb-top-layout"><div class="kb-top-left">TABSMAIN EVENT<\/div><aside class="kb-empty-frame" role="region" aria-label="롤라 3D 모델, 좌우로 드래그하거나 방향키로 회전">/);
 assert.match(html,/<img class="kb-lola-fallback" src="[^"]+\/hero-boot-54d0\.png" alt="킨키부츠 무대 의상 이미지"><\/aside><\/section>CALENDAR OR LIST$/);
 assert.doesNotMatch(html,/aria-hidden="true"/);
});

test('main event preserves the requested opening quote',()=>{
 const html=render.leadHTML({p:{y:2025,m:12,d:19,t:'19:30'},WORK:{period:{start:'2025-12-01',end:'2026-03-01'}},dowShort:()=> '금'});
 assert.match(html,/<blockquote class="kb-quote"><span>한번은 너무 중요한 시합날<br>/);
});
test('ended season displays all supplied rows without collapsed past/upcoming UI',()=>{
 const html=render.listHTML({actorName:'강홍석',ended:true,rows:'<button>ALL PAST ROWS</button>',pastBlock:'HIDDEN TOGGLE'});
 assert.match(html,/ALL PAST ROWS/);
 assert.doesNotMatch(html,/HIDDEN TOGGLE|예정|No upcoming|pastToggle|접기/);
});
test('bout card keeps casting table and functional navigation/record hooks',()=>{
 const html=render.sheetFrameHTML({p:{y:2025,m:12,d:19,t:'19:30'},rows:'<tr><th>롤라</th><td>강홍석</td></tr>',dayNav:'<button class="js-sw">19:30</button>',check:'<button class="js-check">담기</button>',hist:'CAST CHANGE',evHTML:'EVENT',venue:'샤롯데씨어터'});
 assert.match(html,/<table class="np-cast">[\s\S]*<tbody><tr><th>롤라/);
 for(const hook of ['js-sw','js-check','js-close']) assert(html.includes(hook));
 assert.match(html,/CAST CHANGE/);assert.match(html,/EVENT/);
});
test('real calendar renderer maps Monday first across month boundaries and leap day',()=>{
 const app=fs.readFileSync('schedule-app.js','utf8');
 const calendar=app.slice(app.indexOf('function calendarHTML ()'),app.indexOf('/* ═══ 목록형'));
 const weekdays=app.match(/const WD = [^;]+;/)[0];
 const offset=app.match(/const wcol = [^;]+;/)[0];
 const state={ym:{y:2025,m:12},SCHEDULE_VIEW:{...render,calendarCellHTML:args=>args.pad?'PAD,':`${args.day},`,calendarFrameHTML:args=>args},monthPerfs:()=>[],firstDow:(y,m)=>new Date(y,m-1,1).getDay(),daysIn:(y,m)=>new Date(y,m,0).getDate(),TODAY:{},loggedIn:false,PERFS:[],leadHTML:()=>'',MONTH_EN:Array(12).fill('month'),ACTORS:{hong:{name:'강홍석'}},HONG:'hong',idx:({y,m})=>y*12+m,RANGE:{min:{y:2025,m:12},max:{y:2026,m:3}},PHOTO:'',SPECIAL_CALENDAR_PHOTO:''};
 vm.createContext(state);vm.runInContext(`${weekdays}${offset}${calendar}`,state);
 let result=state.calendarHTML();assert(result.cells.startsWith('1,2,3,4,5,6,7,'));assert.match(result.dow,/월<\/div>.*화<\/div>.*일<\/div>/);
 state.ym={y:2026,m:3};result=state.calendarHTML();assert(result.cells.startsWith('PAD,PAD,PAD,PAD,PAD,PAD,1,'));
 state.ym={y:2024,m:2};result=state.calendarHTML();assert(result.cells.startsWith('PAD,PAD,PAD,1,'));assert(result.cells.includes('29,'));assert(!result.cells.includes('30,'));
});
