const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {test}=require('node:test');
const app=fs.readFileSync('settlement-app.js','utf8');
const exporter=fs.readFileSync('settlement-export.js','utf8');
const fixtures=[
  {id:'seoul-hong',hong:true,tour:false,past:true},
  {id:'seoul-other',hong:false,tour:false,past:true},
  {id:'tour-hong',hong:true,tour:true,past:true},
  {id:'tour-other',hong:false,tour:true,past:true},
  {id:'future-hong',hong:true,tour:false,past:false}
];
test('the image and tab use the same Hong, venue and completed-performance selection',()=>{
  const context=vm.createContext({PERFS:fixtures,isHongPerf:p=>p.hong,isTourPerf:p=>p.tour,isPast:p=>p.past});
  vm.runInContext(app.slice(app.indexOf('const settlementPerformances ='),app.indexOf('function seatVisitCounts')),context);
  for(const [hongOnly,includeTour,completedOnly,expected]of [
    [true,true,true,['seoul-hong','tour-hong']],
    [true,false,true,['seoul-hong']],
    [false,true,true,['seoul-hong','seoul-other','tour-hong','tour-other']],
    [false,false,true,['seoul-hong','seoul-other']],
    [true,true,false,['seoul-hong','tour-hong','future-hong']],
    [true,false,false,['seoul-hong','future-hong']],
    [false,true,false,fixtures.map(p=>p.id)],
    [false,false,false,['seoul-hong','seoul-other','future-hong']]
  ]){
    Object.assign(context,{hongOnly,includeTour,completedOnly});
    assert.deepEqual(Array.from(vm.runInContext('settlementPerformances().map(p=>p.id)',context)),expected);
    assert.equal(vm.runInContext('denominator()',context),expected.length);
  }
});
test('the image displays the supplied total and hides regional rows only when tours are excluded',()=>{
  const total={textContent:''},regionalStats={hidden:false,querySelectorAll(){return [];}};
  const context=vm.createContext({window:{},regionalStats,PERFS:[],SEAT_COLORS:[],WORK:{venue:'서울'},SEAT_MAP:{venue:'서울'},document:{querySelectorAll(){return [];},getElementById(){return total;}}});
  const start=exporter.indexOf('window.setSettlementPreview=');
  vm.runInContext(exporter.slice(start,exporter.indexOf('window.setSettlementPreview({',start)),context);
  context.window.setSettlementPreview({performances:[{},{}],records:[{}],includeTour:false});
  assert.equal(total.textContent,'1 / 2');assert.equal(regionalStats.hidden,true);
  context.window.setSettlementPreview({performances:[{},{},{},{}],includeTour:true});
  assert.equal(total.textContent,'0 / 4');assert.equal(regionalStats.hidden,false);
});

test('Elisabeth records render without a regional venue registry',()=>{
  const context=vm.createContext({WORK:{venue:'서울'},seatLabel:id=>id});
  vm.runInContext(app.slice(app.indexOf('function tourSeatsHTML ('),app.indexOf('function seatMapHTML (')),context);
  const records=[{perf:{venue:'서울'},rec:{seat:'1-A-1'}}];
  assert.equal(context.tourSeatsHTML(records),'');
  assert.equal(context.tourSeatsHTML([]),'');
});
