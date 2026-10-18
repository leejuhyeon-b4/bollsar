const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {test}=require('node:test');
const source=fs.readFileSync('settlement-export.js','utf8');
test('background text patches follow the original crop transform in previews and PNGs',()=>{
  const start=source.indexOf('          const draw=(adjustment,target=canvas)=>{');
  const drawSource=source.slice(start,source.indexOf('          portraitDrawers.set',start));
  for(const [width,height,zoom] of [[180,240,1],[720,960,3.2]]){
    const calls=[];
    const context=vm.createContext({img:{width:1152,height:1440},textAtlas:{width:2304,height:1024},
      canvas:{width,height,getContext(){return {clearRect(){},drawImage(...args){calls.push(args);}};}},
      portraitTextPatches:{'actor.jpg':[874,143,164,91,8,8]},item:{file:'actor.jpg'}});
    vm.runInContext(drawSource+'\ndraw({x:.35,y:.1,zoom:'+zoom+'});',context);
    const factor=Math.max(width/1152,height/1440)*zoom;
    assert.equal(calls.length,2);
    assert.deepEqual(calls[1].slice(1,5),[16,16,352,224]);
    assert.deepEqual(calls[1].slice(5),[874*factor-(1152*factor-width)*.35,
      143*factor-(1440*factor-height)*.1,164*factor,91*factor]);
    context.item.file='unpatched.jpg';
    vm.runInContext('draw({x:.35,y:.1,zoom:1});',context);
    assert.equal(calls.length,3);
  }
});
function api(hostname='localhost',search='?editPhotos=1'){
  const context=vm.createContext({window:{},calls:[],location:{hostname,search},URLSearchParams});
  vm.runInContext(source.slice(source.indexOf('const portraitDrawers='),source.indexOf('for(const group of groups)')),context);
  vm.runInContext("portraitDrawers.set('actor.jpg',{name:'배우',defaults:{x:.4,y:.2,zoom:1.5},draw(value){calls.push(value);}})",context);
  return context;
}
test('fixed photo settings reject non-finite, out-of-range and malformed values',()=>{
  for(const value of [null,{}, {x:'0.5',y:.2,zoom:2},{x:NaN,y:.2,zoom:2},{x:.5,y:Infinity,zoom:2},{x:-.1,y:.2,zoom:2},{x:.5,y:1.1,zoom:2},{x:.5,y:.2,zoom:.5},{x:.5,y:.2,zoom:9}]){
    const c=api();c.window.setSettlementPortraits({'actor.jpg':value});
    assert.deepEqual(JSON.parse(JSON.stringify(c.calls[0])),{x:.4,y:.2,zoom:1.5});
  }
});
test('successfully saved settings become the new fixed defaults and expose a separate preview',()=>{
  const c=api(),setting={x:.65,y:.18,zoom:2.4};
  c.window.setSettlementPortraits({'actor.jpg':setting,'unknown.jpg':setting});
  assert.equal(c.calls.length,1);assert.deepEqual(JSON.parse(JSON.stringify(c.calls[0])),setting);
  c.window.setSettlementPortraits();
  assert.deepEqual(JSON.parse(JSON.stringify(c.calls[1])),setting);
  const list=c.window.getSettlementPortraits();list[0].defaults.zoom=8;
  assert.equal(c.window.getSettlementPortraits()[0].defaults.zoom,2.4);
  assert.throws(()=>c.window.drawSettlementPortrait('unknown.jpg',setting,{}),/사진을 찾을 수 없습니다/);
});
test('photo edit APIs exist only on loopback hosts with the explicit developer flag',()=>{
  for(const host of ['localhost','127.0.0.1','[::1]'])assert.equal(typeof api(host).window.setSettlementPortraits,'function');
  for(const [host,search] of [['localhost',''],['localhost','?editPhotos=0'],['example.com','?editPhotos=1'],['localhost.example.com','?editPhotos=1'],['192.168.0.2','?editPhotos=1']]){
    const c=api(host,search);
    for(const name of ['getSettlementPortraits','setSettlementPortraits','drawSettlementPortrait'])assert.equal(c.window[name],undefined);
  }
});
test('the original ID image finishes decoding before the export is ready',async()=>{
  const html=fs.readFileSync('settlement-export.html','utf8');
  const frame=html.match(/<div class="resume-photo">([\s\S]*?)<\/div>/)[1];
  assert.match(frame,/<img src="[^"]*\/kinky-id-photo\.jpg"/);
  assert(!frame.includes('<canvas'));
  let resolvePhoto;
  const pending=[],photoReady=new Promise(resolve=>{resolvePhoto=resolve;});
  const c=vm.createContext({loads:pending,document:{querySelectorAll(selector){
    assert(selector.includes('.resume-photo img'));
    return [{decode:()=>photoReady}];
  }}});
  const start=source.indexOf('for (const image of document.querySelectorAll(');
  vm.runInContext(source.slice(start,source.indexOf('\nloads.push(',start)),c);
  let ready=false;
  const complete=Promise.all(pending).then(()=>{ready=true;});
  await Promise.resolve();assert.equal(ready,false);
  resolvePhoto();await complete;assert.equal(ready,true);
});
function pngPreview(){
  const app=fs.readFileSync('settlement-app.js','utf8'),events=[],handlers=new Map();
  const context=vm.createContext({
    URL:{revokeObjectURL:url=>events.push(['revoke',url])},
    WORK:{title:'킹키부츠',run:'7연'},
    $(selector){return {
      addEventListener(type,handler){handlers.set(selector+':'+type,handler);},
      removeAttribute(name){events.push(['clear',name]);},
      close(){events.push(['close']);handlers.get('#savePreview:close')();}
    };},
    document:{
      createElement(tag){
        assert.equal(tag,'a');
        return {click(){events.push(['download',this.href,this.download]);},remove(){events.push(['remove']);}};
      },
      body:{append(){events.push(['append']);}}
    }
  });
  const start=app.indexOf('let pendingSettlementImage;');
  vm.runInContext(app.slice(start,app.indexOf('async function previewSettlementImage',start)),context);
  const bind=app.indexOf("$('#savePreview').addEventListener('close'");
  vm.runInContext(app.slice(bind,app.indexOf("if ('serviceWorker' in navigator)",bind)),context);
  return {context,events,click:selector=>handlers.get(selector+':click')()};
}

test('cancelling the PNG preview releases its URL without downloading or changing fixed photos',()=>{
  const before=fs.readFileSync('themes/kinky-boots-2025-2026-7th-lola/assets/settlement/portrait-crops.js','utf8');
  const p=pngPreview();
  vm.runInContext("pendingSettlementImage={blob:{},url:'blob:preview'}",p.context);
  p.click('.js-save-later');
  assert.deepEqual(p.events,[['close'],['revoke','blob:preview'],['clear','src']]);
  assert.equal(vm.runInContext('pendingSettlementImage',p.context),null);
  assert.equal(fs.readFileSync('themes/kinky-boots-2025-2026-7th-lola/assets/settlement/portrait-crops.js','utf8'),before);
});

test('PNG confirmation downloads the prepared image and cleans up only after download',()=>{
  const p=pngPreview();
  p.click('.js-save-confirm');assert.deepEqual(p.events,[]);
  vm.runInContext("pendingSettlementImage={blob:{},url:'blob:preview'}",p.context);
  p.click('.js-save-confirm');
  assert.deepEqual(p.events.map(([type])=>type),['append','download','remove','close','revoke','clear']);
  assert.equal(p.events[1][1],'blob:preview');
  assert.match(p.events[1][2],/^킹키부츠-7연-정산판-\d{4}-\d{2}-\d{2}\.png$/);
  assert.equal(vm.runInContext('pendingSettlementImage',p.context),null);
});
