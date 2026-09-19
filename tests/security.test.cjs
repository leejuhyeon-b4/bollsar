const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'data.js'), 'utf8');
const pwaSource = fs.readFileSync(path.join(__dirname, '..', 'pwa-install.js'), 'utf8');
const settlementSource = fs.readFileSync(path.join(__dirname, '..', 'settlement-app.js'), 'utf8');
const swSource = fs.readFileSync(path.join(__dirname, '..', 'sw.js'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'manifest.json'), 'utf8'));

const legacyUserARecords = JSON.stringify([{ key: 'legacy-user-a', seat: '1-A-1' }]);
const legacyUserBRecords = JSON.stringify([{ key: 'legacy-user-b', seat: '1-A-2' }]);
const currentUserBRecords = JSON.stringify([{ key: 'current-user-b', seat: '1-A-3' }]);

const values = new Map([
  ['aebaeryeok.records.v1', JSON.stringify([{ key: 'legacy-global', seat: '1-A-9' }])],
  ['aebaeryeok.records.v2.user.user-a', legacyUserARecords],
  ['aebaeryeok.records.v2.user.user-b', legacyUserBRecords],
  ['bollsar.records.v2.user.user-b', currentUserBRecords],
  ['hongcal.test.copy', 'legacy-copy'],
  ['bollsar.test.preferred', 'current-value'],
  ['hongcal.test.preferred', 'legacy-value']
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
    userARecords: JSON.stringify(loadLocalRecords({ id: 'user-a' })),
    userBRecords: JSON.stringify(loadLocalRecords({ id: 'user-b' })),
    copiedLegacyValue: migrateStorageValue(localStorage, 'bollsar.test.copy', ['hongcal.test.copy']),
    preferredCurrentValue: migrateStorageValue(localStorage, 'bollsar.test.preferred', ['hongcal.test.preferred']),
    validPassword: PASSWORD_PATTERN.test('music12!'),
    missingSymbol: PASSWORD_PATTERN.test('music123'),
    missingNumber: PASSWORD_PATTERN.test('musical!'),
    missingLetter: PASSWORD_PATTERN.test('1234567!')
  };
  track('record_event', { perf: '2026|1|1|19:00', seat: '1-A-1', pair: 'x', source: 'test' });
`, context);

assert.equal(context.securityResult.guestKey, 'bollsar.records.v2.guest');
assert.equal(context.securityResult.userAKey, 'bollsar.records.v2.user.user-a');
assert.equal(context.securityResult.userBKey, 'bollsar.records.v2.user.user-b');
assert.notEqual(context.securityResult.userAKey, context.securityResult.userBKey);
assert.notEqual(context.securityResult.guestKey, context.securityResult.userAKey);
assert.equal(context.securityResult.initialRecords, '[]', 'legacy global records must stay quarantined');
assert.equal(context.securityResult.userARecords, legacyUserARecords, 'same-user legacy records should migrate');
assert.equal(values.get('bollsar.records.v2.user.user-a'), legacyUserARecords);
assert.equal(context.securityResult.userBRecords, currentUserBRecords, 'new key must win over legacy data');
assert.equal(values.has('aebaeryeok.records.v1'), true, 'global legacy record remains quarantined');
assert.equal(context.securityResult.copiedLegacyValue, 'legacy-copy');
assert.equal(values.get('bollsar.test.copy'), 'legacy-copy');
assert.equal(context.securityResult.preferredCurrentValue, 'current-value');
assert.equal(context.securityResult.validPassword, true);
assert.equal(context.securityResult.missingSymbol, false);
assert.equal(context.securityResult.missingNumber, false);
assert.equal(context.securityResult.missingLetter, false);
assert.equal(JSON.stringify(analytics), JSON.stringify([['event', 'record_event', { source: 'test' }]]));

assert.equal(manifest.name, '볼살씨');
assert.equal(manifest.short_name, '볼살씨');
assert.ok(source.includes("const REC_KEY = 'bollsar.records.v2';"));
assert.ok(source.includes("const LEGACY_REC_KEYS = ['aebaeryeok.records.v2'];"));
assert.ok(settlementSource.includes("const VISIT_COLOR_STORAGE_KEY = 'bollsar.visit-colors.v1';"));
assert.ok(settlementSource.includes("const LEGACY_VISIT_COLOR_STORAGE_KEYS = ['hongcal.visit-colors.v1'];"));
assert.ok(settlementSource.includes("const FAVORITE_PAIR_STORAGE_KEY = 'bollsar.favorite-pairs.v1';"));
assert.ok(settlementSource.includes("const LEGACY_FAVORITE_PAIR_STORAGE_KEYS = ['hongcal.favorite-pairs.v1'];"));
assert.ok(pwaSource.includes("const NEVER_KEY = 'bollsar.install.never.v1';"));
assert.ok(pwaSource.includes("const LEGACY_NEVER_KEYS = ['hongcal.install.never.v1'];"));
assert.ok(pwaSource.includes("const STANDALONE_SESSION_KEY = 'bollsar.analytics.standalone-session.v1';"));
assert.ok(pwaSource.includes("const LEGACY_STANDALONE_SESSION_KEYS = ['hongcal.analytics.standalone-session.v1'];"));
assert.ok(pwaSource.includes("const REBRAND_NOTICE_KEY = 'bollsar.rebrand-notice.v2';"));
assert.ok(pwaSource.includes("if (isStandalone && readStorage(localStorage, REBRAND_NOTICE_KEY) !== '1')"));
assert.equal(pwaSource.includes('???'), false);
assert.ok(pwaSource.includes("if (modalMode === 'rebrand')"));
assert.ok(pwaSource.includes("writeStorage(localStorage, REBRAND_NOTICE_KEY, '1');"));
assert.ok(pwaSource.includes('볼살씨 설치'));
assert.ok(swSource.includes("const CACHE_VERSION = 'v45';"));
assert.ok(swSource.includes("const CACHE_PREFIX = 'bollsar-';"));
assert.ok(swSource.includes("const LEGACY_CACHE_PREFIXES = ['hongcal-', 'aebaeryeok-'];"));

for (const eventName of [
  'settlement_view',
  'settlement_image_save_attempt',
  'pwa_install_prompt_shown',
  'pwa_install_accepted',
  'pwa_install_success',
  'pwa_standalone_launch'
]) {
  assert.ok(pwaSource.includes(`trackUsage('${eventName}'`), `${eventName} tracking is missing`);
}

console.log('security tests passed');
