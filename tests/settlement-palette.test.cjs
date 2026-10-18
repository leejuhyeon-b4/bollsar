const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {test} = require('node:test');

const root = path.join(__dirname, '..');
const data = fs.readFileSync(path.join(root, 'data.js'), 'utf8');
const app = fs.readFileSync(path.join(root, 'settlement-app.js'), 'utf8');
function section(source, start, end) {
  const first = source.indexOf(start), last = source.indexOf(end, first);
  assert(first >= 0 && last > first, `missing source section: ${start}`);
  return source.slice(first, last);
}
const source = [
  section(data, 'const SEAT_COLORS =', 'const visitLabel ='),
  section(data, 'function migrateStorageValue ', 'const recordOwnerSuffix ='),
  section(app, 'const VISIT_COLOR_STORAGE_KEY =', 'let delMode'),
  section(app, 'const scopedUserStorageSuffix =', 'const favoritePairStorageKey ='),
  'let visitColors = {...DEFAULT_VISIT_COLORS};',
  section(app, 'const visitColorStorageKey =', 'const visitHex =')
].join('\n');
const elisabeth = 'elisabeth-2026-6th', kinky = 'kinky-boots-2025-2026-7th';
const prefix = 'bollsar.visit-colors.v1';
const paletteKey = (production, theme, user = 'user-a') =>
  `${prefix}.production.${production}.theme.${theme}.${user}`;
const productionKey = (production, user = 'user-a') => `${prefix}.production.${production}.${user}`;

function palette(values = new Map(), production = elisabeth, theme = `${production}-lucheni`, user = 'user-a') {
  const writes = [];
  const context = vm.createContext({
    ACTIVE_PRODUCTION_ID: production,
    authUserId: () => user,
    window: {BollsarThemeRegistry: {selectedThemeId(id) {assert.equal(id, production); return theme;}}},
    localStorage: {
      getItem: key => values.get(key) ?? null,
      setItem: (key, value) => {writes.push(key); values.set(key, value);}
    }
  });
  vm.runInContext(source, context);
  return {
    key: () => vm.runInContext('visitColorStorageKey()', context),
    load: () => JSON.parse(vm.runInContext('JSON.stringify(loadVisitColors())', context)),
    save(colors) {context.nextColors = colors; vm.runInContext('visitColors = nextColors; saveVisitColors();', context);},
    writes
  };
}

test('existing production palette is copied once and a saved theme palette wins', () => {
  for (const production of [elisabeth, kinky]) {
    const theme = `${production}-current`, oldKey = productionKey(production);
    const oldValue = JSON.stringify({1: 'rose', 4: 'plum'});
    const values = new Map([[oldKey, oldValue], [`${prefix}.user-a`, '{"1":"gold"}']]);
    const current = palette(values, production, theme);
    assert.equal(current.key(), paletteKey(production, theme));
    assert.deepEqual(current.load(), {1: 'rose', 4: 'plum'});
    assert.equal(values.get(oldKey), oldValue);
    values.set(oldKey, '{"1":"teal"}');
    assert.deepEqual(current.load(), {1: 'rose', 4: 'plum'});
    assert.deepEqual(current.writes, [paletteKey(production, theme)]);
    current.save({2: 'indigo'});
    assert.deepEqual(palette(values, production, theme).load(), {2: 'indigo'});
    assert.equal(values.get(oldKey), '{"1":"teal"}');
  }
});

test('palette writes remain isolated by theme, production and user', () => {
  const values = new Map();
  const variants = [
    [elisabeth, 'lucheni', 'user-a'], [elisabeth, 'other-theme', 'user-a'],
    [elisabeth, 'lucheni', 'user-b'], [elisabeth, 'lucheni', ''],
    [kinky, 'lucheni', 'user-a']
  ];
  const colors = ['rose', 'gold', 'moss', 'teal', 'plum'];
  for (const [index, args] of variants.entries()) palette(values, ...args).save({1: colors[index]});
  assert.equal(values.size, variants.length);
  for (const [index, args] of variants.entries()) assert.deepEqual(palette(values, ...args).load(), {1: colors[index]});
});

test('old shared palette keys migrate only into Elisabeth and remain unchanged', () => {
  for (const legacyPrefix of [prefix, 'hongcal.visit-colors.v1']) {
    const oldKey = `${legacyPrefix}.user-a`, oldValue = '{"2":"amber"}';
    const values = new Map([[oldKey, oldValue]]);
    const unrelated = palette(values, kinky, 'lola');
    assert.deepEqual(unrelated.load(), {});
    assert.equal(values.has(paletteKey(kinky, 'lola')), false);
    assert.equal(values.has(productionKey(kinky)), false);
    assert.deepEqual(unrelated.writes, []);
    const original = palette(values, elisabeth, 'lucheni');
    assert.deepEqual(original.load(), {2: 'amber'});
    assert.equal(values.get(oldKey), oldValue);
    assert.deepEqual(palette(values, elisabeth, 'lucheni', 'user-b').load(), {});
  }
});

test('saving a palette preserves records, favorites, selected theme and all source keys', () => {
  const values = new Map([
    ['bollsar.records.v2.production.elisabeth-2026-6th.user.user-a', '[{"key":"show","seat":"1-A-1"}]'],
    ['bollsar.favorite-pairs.v1.production.elisabeth-2026-6th.user-a', '[{"role":"actor"}]'],
    ['bollsar.theme.v1.production.elisabeth-2026-6th', 'lucheni'],
    ['bollsar.production.v1', elisabeth],
    [productionKey(elisabeth), '{"1":"rose"}'],
    [`${prefix}.user-a`, '{"1":"gold"}'],
    ['hongcal.visit-colors.v1.user-a', '{"1":"teal"}']
  ]);
  const before = new Map(values), current = palette(values, elisabeth, 'lucheni');
  current.load(); current.save({3: 'indigo'});
  assert.deepEqual(current.load(), {3: 'indigo'});
  for (const [key, value] of before) assert.equal(values.get(key), value, `${key} must stay unchanged`);
  assert.deepEqual([...new Set(current.writes)], [paletteKey(elisabeth, 'lucheni')]);
});

test('loading palettes filters invalid levels and colors and tolerates malformed storage', () => {
  const key = paletteKey(elisabeth, 'lucheni');
  for (const [raw, expected] of [
    ['{"1":"rose","2":"not-a-color","3":null,"4":"teal","5":"plum"}', {1: 'rose', 4: 'teal'}],
    ['{invalid', {}], ['null', {}], ['"rose"', {}], ['[]', {}]
  ]) {
    const values = new Map([[key, raw]]);
    const current = palette(values, elisabeth, 'lucheni');
    assert.deepEqual(current.load(), expected);
    assert.equal(values.get(key), raw);
    assert.deepEqual(current.writes, []);
  }
});
