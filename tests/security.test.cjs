const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'data.js'), 'utf8');
const values = new Map([
  ['aebaeryeok.records.v1', JSON.stringify([{ key: 'legacy-record', seat: '1-A-1' }])]
]);
const storage = {
  getItem: key => values.has(key) ? values.get(key) : null,
  setItem: (key, value) => values.set(key, value),
  removeItem: key => values.delete(key)
};
const analytics = [];
const context = {
  console: { warn () {}, error () {} },
  localStorage: storage,
  sessionStorage: storage,
  gtag: (...args) => analytics.push(args)
};

vm.createContext(context);
vm.runInContext(`${source}
  globalThis.securityResult = {
    guestKey: recordsStorageKey(null),
    userAKey: recordsStorageKey({ id: 'user-a' }),
    userBKey: recordsStorageKey({ id: 'user-b' }),
    initialRecords: JSON.stringify(MY_RECORDS),
    validPassword: PASSWORD_PATTERN.test('music12!'),
    missingSymbol: PASSWORD_PATTERN.test('music123'),
    missingNumber: PASSWORD_PATTERN.test('musical!'),
    missingLetter: PASSWORD_PATTERN.test('1234567!')
  };
  track('record_event', { perf: '2026|1|1|19:00', seat: '1-A-1', pair: 'x', source: 'test' });
`, context);

assert.notEqual(context.securityResult.userAKey, context.securityResult.userBKey);
assert.notEqual(context.securityResult.guestKey, context.securityResult.userAKey);
assert.equal(context.securityResult.initialRecords, '[]', 'legacy global records must stay quarantined');
assert.equal(context.securityResult.validPassword, true);
assert.equal(context.securityResult.missingSymbol, false);
assert.equal(context.securityResult.missingNumber, false);
assert.equal(context.securityResult.missingLetter, false);
assert.equal(JSON.stringify(analytics), JSON.stringify([['event', 'record_event', { source: 'test' }]]));

console.log('security tests passed');
