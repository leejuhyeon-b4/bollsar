const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
  const source=fs.readFileSync('data.js','utf8');
  const url=source.match(/const SUPABASE_URL\s*=\s*'([^']+)'/)[1];
  const key=source.match(/const SUPABASE_ANON\s*=\s*'([^']+)'/)[1];
  const headers={apikey:key,Authorization:`Bearer ${key}`};
  const get=async path=>{const r=await fetch(url+'/rest/v1/'+path,{headers});return{status:r.status,body:await r.json()};};
  const before=await get('kinky_bell_counter?select=id,count');
  assert.equal(before.status,200);assert.equal(before.body.length,1);assert.equal(before.body[0].id,'kinky-boots-2025-2026-7th-lola');
  // PostgREST GET transactions are READ ONLY, including RPCs: this cannot increment the bell.
  const rpc=await get('rpc/ring_kinky_bell');
  assert.equal(rpc.status,405);assert.equal(rpc.body.code,'25006');
  assert.match(rpc.body.message,/cannot execute UPDATE in a read-only transaction/);
  const after=await get('kinky_bell_counter?select=count&id=eq.kinky-boots-2025-2026-7th-lola');
  assert.equal(after.body[0].count,before.body[0].count);
  const records=await get('records?select=production_id&limit=1');
  assert([200,401,403].includes(records.status));
  if(records.status===200)assert.deepEqual(records.body,[],'Anonymous records must be hidden');
  const result={tablePresent:true,expectedRow:true,bellCountUnchanged:true,anonymousRpcExecuteReachesUpdate:true,readOnlyRpc:{status:rpc.status,code:rpc.body.code},anonymousRecordsHidden:true,recordsStatus:records.status,sqlExecuted:false,newSqlRequired:false,administrativeCatalogVerified:false};
  fs.mkdirSync('artifacts',{recursive:true});
  fs.writeFileSync('artifacts/kinky-db-check.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
})().catch(e=>{console.error(e.message);process.exitCode=1;});
