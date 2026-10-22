const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {test}=require('node:test');
const source=fs.readFileSync('themes/kinky-boots-2025-2026-7th-lola/scheduletab/view.js','utf8');
function counter(readResult,client=true){
 const output={textContent:'------'},listeners={},timers=[],calls=[];
 const button={disabled:false};
 class Element{closest(){return button;}}
 const query={select(){return this;},eq(){return this;},async maybeSingle(){return readResult;}};
 const context={Element,console:{warn(){}},window:{setTimeout(fn,delay){if(delay===0)timers.push(fn);else fn();}},MutationObserver:class{observe(){}},requestAnimationFrame(){},document:{readyState:'loading',addEventListener(type,fn){listeners[type]=fn;},querySelector(){return {};},querySelectorAll(selector){return selector==='[data-kb-bell-count]'?[output]:[];}},SB:client?{from(name){assert.equal(name,'kinky_bell_counter');return query;},async rpc(name){calls.push(name);return {data:13,error:null};}}:null};
 vm.runInNewContext(source,context);
 context.window.BollsarScheduleTheme.render.leadHTML({p:{y:2026,m:5,d:3,t:'14:00'},WORK:{period:{start:'2025-11-01',end:'2026-05-03'}},dowShort:()=>''});
 return {output,calls,sync:()=>timers[0](),click:()=>listeners.click({target:new Element()})};
}
test('missing client, missing row and failed server reads stay unknown rather than zero',async()=>{
 for(const [result,client]of [[null,false],[{data:null,error:null},true],[{data:null,error:{code:'PGRST205'}},true]]){
  const c=counter(result,client);await c.sync();assert.equal(c.output.textContent,'------');
 }
});
test('a real zero is displayed and a successful ring uses the server total',async()=>{
 const c=counter({data:{count:0},error:null});await c.sync();assert.equal(c.output.textContent,'000000');
 await c.click();assert.deepEqual(c.calls,['ring_kinky_bell']);assert.equal(c.output.textContent,'000013');
});
