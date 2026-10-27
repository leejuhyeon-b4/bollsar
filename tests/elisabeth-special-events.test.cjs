const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { test } = require('node:test');

const data = fs.readFileSync('data.js', 'utf8');
const schedule = fs.readFileSync('schedule-app.js', 'utf8');
const settlement = fs.readFileSync('settlement-app.js', 'utf8');
const plain = value => JSON.parse(JSON.stringify(value));

function fixture () {
  const context = vm.createContext({ window:{}, TODAY:{ y:2026, m:11, d:1 }, loggedIn:true,
    dowShort:() => '목', isPast:() => true, includeTour:true, hongOnly:false, completedOnly:false });
  vm.runInContext(fs.readFileSync('productions/elisabeth-2026-6th/data/schedule.js', 'utf8'), context);
  vm.runInContext("var MY_RECORDS = []; const HONG = 'hong'; const SEAT_MAP = { venue:WORK.venue };", context);
  vm.runInContext(data.slice(data.indexOf('const SPECIAL_EVENTS ='), data.indexOf('/* ═══ 좌석 헬퍼')), context);
  vm.runInContext(fs.readFileSync('themes/elisabeth-2026-6th-lucheni/scheduletab/view.js', 'utf8'), context);
  vm.runInContext('var SCHEDULE_VIEW = window.BollsarScheduleTheme.render;', context);
  vm.runInContext(schedule.slice(schedule.indexOf('function sheetHTML ('), schedule.indexOf('function openSheet (')), context);
  vm.runInContext(settlement.slice(settlement.indexOf('function isTourPerf ('), settlement.indexOf('/* 앉은 횟수')), context);
  return { context, run:source => vm.runInContext(source, context) };
}

test('the drama and unchanged universe show appear only with Elisabeth', () => {
  const { run } = fixture();
  const drama = plain(run("perfFromKey('2026|11|19|22:00')"));
  assert.deepEqual(drama, {
    y:2026, m:11, d:19, t:'22:00', special:true, displayWithProductionId:'elisabeth-2026-6th',
    category:'방송 / 드라마', hidePhoto:true, title:'KBS 드라마스페셜 2026 《사운드:트랙》 — 연극이 끝난 후',
    venue:'KBS 2TV', cast:{}, castLabel:'강홍석(기봉석 역) · 표예진 · 이기택',
    events:[{ label:'연극이 끝난 후', verified:true }]
  });
  assert.equal(new Date(drama.y, drama.m - 1, drama.d).getDay(), 4);
  assert.deepEqual(plain(run("perfFromKey('2026|11|28|16:00')")), {
    y:2026, m:11, d:28, t:'16:00', special:true, displayWithProductionId:'elisabeth-2026-6th',
    title:'2026 우주최강쇼 - 길리버셜 스튜디오', venue:'경희대학교 평화의전당', cast:{},
    castLabel:'강홍석 & 킹키부츠 엔젤 외', detailUrl:'https://m.ticketlink.co.kr/product/65916',
    events:[{ label:'우주최강쇼', verified:true }]
  });
  assert.equal(run('hongPerfs().filter(p => p.special).length'), 2);
  for (const production of ['kinky-boots-2025-2026-7th', 'aladdin-2024-2025-1st']) {
    run(`WORK.id = '${production}'`);
    assert.equal(run('specialEventsForActiveProduction().length'), 0);
    assert.equal(run('hongPerfs().some(p => p.special)'), false);
    assert.equal(run("perfFromKey('2026|11|19|22:00')"), undefined);
  }
});

test('the real theme renders drama details without record or seat controls and keeps the universe link', () => {
  const { run } = fixture();
  const html = run("sheetHTML(perfFromKey('2026|11|19|22:00'))");
  for (const text of ['방송 / 드라마', 'KBS 드라마스페셜 2026 《사운드:트랙》 — 연극이 끝난 후', '강홍석(기봉석 역) · 표예진 · 이기택', '22:00', 'KBS 2TV']) assert.ok(html.includes(text), text);
  assert.doesNotMatch(html, /js-check|js-seat|이 회차 담기|undefined|킹키부츠 퍼레이드|어트랙션/);
  const entry = run("SCHEDULE_VIEW.entryHTML({p:perfFromKey('2026|11|19|22:00'),key:'2026|11|19|22:00',special:true,displayTitle:SPECIAL_EVENTS[0].title,displayVenue:SPECIAL_EVENTS[0].venue,WORK,dowShort,PHOTO:'',badges:''})");
  assert.match(entry, /방송 \/ 드라마/);
  assert.match(entry, /연극이 끝난 후/);
  assert.match(entry, /KBS 2TV/);
  assert.doesNotMatch(entry, /<img/);
  assert.match(entry, /강홍석\(기봉석 역\) · 표예진 · 이기택/);
  assert.match(entry, /22:00/);
  const cell = run("SCHEDULE_VIEW.calendarCellHTML({day:19,items:[SPECIAL_EVENTS[0]],times:['22:00'],eventText:'연극이 끝난 후',eventCount:1,PHOTO:'universe.jpg'})");
  assert.doesNotMatch(cell, /<img/);
  assert.match(cell, /white-space:normal/);
  const universeCell = run("SCHEDULE_VIEW.calendarCellHTML({day:28,items:[SPECIAL_EVENTS[1]],times:['16:00'],PHOTO:'universe.jpg'})");
  assert.match(universeCell, /universe.jpg/);
  const lead = run("SCHEDULE_VIEW.leadHTML({p:SPECIAL_EVENTS[0],special:true,displayTitle:SPECIAL_EVENTS[0].title,displayVenue:SPECIAL_EVENTS[0].venue,WORK,ACTORS,HONG,dowShort,deck:SPECIAL_EVENTS[0].castLabel})");
  assert.doesNotMatch(lead, /<img|<figure/);
  assert.match(lead, /grid-template-columns:minmax\(0,1fr\)/);
  const universe = run("sheetHTML(perfFromKey('2026|11|28|16:00'))");
  assert.match(universe, /킹키부츠 퍼레이드/);
  assert.match(universe, /https:\/\/m.ticketlink.co.kr\/product\/65916/);
  assert.doesNotMatch(universe, /js-check|js-seat|이 회차 담기/);
});

test('special schedule display leaves performances, records, actor counts, seats and PNG inputs unchanged', () => {
  const { run } = fixture();
  run("MY_RECORDS.push({key:perfKey(PERFS.find(isHongPerf)),seat:'1-A-1'})");
  const snapshot = () => plain(run(`({
    performances:PERFS, records:MY_RECORDS, assigned:assignedCount(HONG),
    denominator:denominator(), pngPerformances:settlementPerformances(), pngRecords:myRecords(),
    seats:Array.from(seatVisitCounts(myRecords()))
  })`));
  run("WORK.id = 'aladdin-2024-2025-1st'");
  const before = snapshot();
  run("WORK.id = 'elisabeth-2026-6th'; hongPerfs().forEach(p => { if(p.special) sheetHTML(p); })");
  assert.deepEqual(snapshot(), before);
  assert.equal(run('PERFS.some(p => p.special)'), false);
  assert.match(settlement, /const performances = settlementPerformances\(\);\s*const records = myRecords\(\);/);
});
