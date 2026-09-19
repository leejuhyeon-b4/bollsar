import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';

if (!process.argv.includes('--live')) {
  throw new Error('Live Supabase test requires --live');
}

const source = fs.readFileSync(new URL('../data.js', import.meta.url), 'utf8');
const valueOf = name => {
  const match = source.match(new RegExp(`const ${name}\\s*=\\s*'([^']+)'`));
  if (!match) throw new Error(`${name} not found in data.js`);
  return match[1];
};

const baseUrl = valueOf('SUPABASE_URL');
const publishableKey = valueOf('SUPABASE_ANON');
const emailDomain = valueOf('ID_EMAIL_DOMAIN');
const productionSource = fs.readFileSync(
  new URL(
    '../productions/elisabeth-2026-6th/data/schedule.js',
    import.meta.url
  ),
  'utf8'
);
const productionMatch = productionSource.match(
  /const WORK\s*=\s*\{\s*id:\s*'([^']+)'/
);
assert.ok(productionMatch, 'production id missing');
const productionId = productionMatch[1];
const runId = `${Date.now().toString(36)}${crypto.randomBytes(3).toString('hex')}`;
const performanceKey = `rls-test|${runId}`;
const accounts = [];

async function jsonResponse(response) {
  const text = await response.text();
  let body = null;
  if (text) {
    try { body = JSON.parse(text); } catch { body = text; }
  }
  return { response, body };
}

async function createAccount(label) {
  const username = `rls${runId.slice(-10)}${label}`;
  const password = `Aa1!${crypto.randomBytes(12).toString('base64url')}`;
  const { response, body } = await jsonResponse(await fetch(`${baseUrl}/auth/v1/signup`, {
    method: 'POST',
    headers: { apikey: publishableKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: `${username}@${emailDomain}`, password })
  }));
  assert.equal(response.ok, true, `signup ${label} failed (${response.status})`);
  assert.ok(body.user?.id, `signup ${label} returned no user`);
  assert.ok(body.access_token, `signup ${label} returned no session; email confirmation may be enabled`);
  const account = { id: body.user.id, token: body.access_token, label };
  accounts.push(account);
  return account;
}

async function records(account, method, query = '', body) {
  const headers = {
    apikey: publishableKey,
    Authorization: `Bearer ${account.token}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation'
  };
  return jsonResponse(await fetch(`${baseUrl}/rest/v1/records${query}`, {
    method, headers, body: body === undefined ? undefined : JSON.stringify(body)
  }));
}

async function deleteAccount(account) {
  const response = await fetch(`${baseUrl}/rest/v1/rpc/delete_account`, {
    method: 'POST',
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${account.token}`,
      'Content-Type': 'application/json'
    },
    body: '{}'
  });
  assert.equal(response.ok, true, `cleanup ${account.label} failed (${response.status})`);
}

let testError = null;
const cleanupErrors = [];
try {
  const userA = await createAccount('a');
  const userB = await createAccount('b');

  let result = await records(userA, 'POST', '', {
    user_id: userA.id,
    production_id: productionId,
    perf_key: performanceKey,
    seat: '1-A-1'
  });
  assert.equal(result.response.ok, true, 'A could not insert its own record');

  result = await records(userB, 'GET', `?user_id=eq.${userA.id}&production_id=eq.${encodeURIComponent(productionId)}&perf_key=eq.${encodeURIComponent(performanceKey)}`);
  assert.equal(result.response.ok, true, 'B cross-select request failed unexpectedly');
  assert.deepEqual(result.body, [], 'B could read A record');

  result = await records(userB, 'POST', '', {
    user_id: userA.id,
    production_id: productionId,
    perf_key: `${performanceKey}|forged`,
    seat: '1-A-2'
  });
  assert.equal(result.response.ok, false, 'B could insert a record owned by A');

  result = await records(userB, 'PATCH', `?user_id=eq.${userA.id}&production_id=eq.${encodeURIComponent(productionId)}&perf_key=eq.${encodeURIComponent(performanceKey)}`, { seat: '2-B-2' });
  assert.equal(result.response.ok, true, 'B cross-update request failed unexpectedly');
  assert.deepEqual(result.body, [], 'B could update A record');

  result = await records(userB, 'DELETE', `?user_id=eq.${userA.id}&production_id=eq.${encodeURIComponent(productionId)}&perf_key=eq.${encodeURIComponent(performanceKey)}`);
  assert.equal(result.response.ok, true, 'B cross-delete request failed unexpectedly');
  assert.deepEqual(result.body, [], 'B could delete A record');

  result = await records(userA, 'GET', `?production_id=eq.${encodeURIComponent(productionId)}&perf_key=eq.${encodeURIComponent(performanceKey)}`);
  assert.equal(result.response.ok, true, 'A could not read its own record');
  assert.equal(result.body.length, 1, 'A record disappeared after B operations');
  assert.equal(result.body[0].seat, '1-A-1', 'A record was modified by B');

  result = await records(userA, 'DELETE', `?production_id=eq.${encodeURIComponent(productionId)}&perf_key=eq.${encodeURIComponent(performanceKey)}`);
  assert.equal(result.response.ok, true, 'A could not delete its own record');
  assert.equal(result.body.length, 1, 'A own-delete affected no rows');

  console.log('RLS cross-access tests passed: select/insert/update/delete isolated');
} catch (error) {
  testError = error;
} finally {
  for (const account of accounts) {
    try { await deleteAccount(account); } catch (error) { cleanupErrors.push(error); }
  }
}

if (cleanupErrors.length) {
  throw new AggregateError([...(testError ? [testError] : []), ...cleanupErrors], 'RLS test or cleanup failed');
}
if (testError) throw testError;
console.log(`Temporary accounts removed: ${accounts.length}`);
