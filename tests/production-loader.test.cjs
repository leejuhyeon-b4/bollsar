const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const {test} = require('node:test');

const source = fs.readFileSync('production-loader.js', 'utf8');
const productions = {
  'elisabeth-2026-6th': 'elisabeth-2026-6th-lucheni',
  'kinky-boots-2025-2026-7th': 'kinky-boots-2025-2026-7th-lola'
};

async function boot(page, query = '', saved, failPath) {
  const recordsKey = 'bollsar.records.v2.production.elisabeth-2026-6th.user.test';
  const values = new Map([[recordsKey, '[{"seat":"1-A-1"}]']]);
  if (saved !== undefined) values.set('bollsar.production.v1', saved);
  const writes = [], loaded = [], navigations = [];
  const links = [{href:'https://example.test/index.html?keep=1'}, {href:'https://example.test/settlement.html'}];
  const context = {
    window: {}, URL, URLSearchParams,
    location: {search:query, href:`https://example.test/index.html${query}`, assign:href => navigations.push(href)},
    localStorage: {
      getItem:key => values.get(key) ?? null,
      setItem:(key,value) => {writes.push(key); values.set(key,value);}
    },
    document: {
      currentScript:{dataset:{page}},
      querySelectorAll:() => links,
      createElement:tag => ({tag}),
      head:{append(element) {
        loaded.push(element);
        queueMicrotask(() => (failPath && element.src === failPath ? element.onerror : element.onload)());
      }}
    }
  };
  vm.runInNewContext(source, context);
  await context.window.productionReady;
  assert.equal(values.get(recordsKey), '[{"seat":"1-A-1"}]');
  assert.deepEqual(writes, ['bollsar.production.v1'], 'boot must only save production selection');
  return {context, loaded, links, navigations, values};
}

for (const [production, theme] of Object.entries(productions)) {
  for (const page of ['schedule', 'settlement']) {
    test(`${production} ${page} loads isolated assets and data before application`, async () => {
      const {loaded, links, context} = await boot(page, `?production=${production}`);
      const kinky = production.startsWith('kinky');
      const base = `themes/${theme}`;
      const styles = ['themes/elisabeth-2026-6th-lucheni/fonts/fonts.css'];
      if (page === 'settlement') styles.push('themes/elisabeth-2026-6th-lucheni/settlement/theme.css');
      if (kinky) styles.push(`${base}/schedule/theme.css`);
      if (page === 'settlement' && kinky) styles.push(`${base}/settlement/theme.css`);
      if (page === 'schedule' && kinky) styles.push(`${base}/schedule/lola-viewer.css`);
      assert.deepEqual(loaded.filter(x => x.tag === 'link').map(x => x.href), styles);
      const scripts = [
        `productions/${production}/data/schedule.js`,
        `productions/${production}/data/seat-map.js`, 'data.js', 'theme-registry.js'
      ];
      if (page === 'schedule') scripts.push(`${base}/schedule/view.js`);
      scripts.push(`${page}-app.js`);
      if (page === 'schedule' && kinky) scripts.push(`${base}/schedule/lola-viewer.js`);
      scripts.push('pwa-install.js');
      assert.deepEqual(loaded.filter(x => x.tag === 'script').map(x => x.src), scripts);
      const viewer = loaded.find(x => x.src === `${base}/schedule/lola-viewer.js`);
      if (viewer) assert.equal(viewer.type, 'module');
      assert.equal(context.window.BollsarProduction.id, production);
      for (const link of links) assert.equal(new URL(link.href).searchParams.get('production'), production);
      assert.equal(new URL(links[0].href).searchParams.get('keep'), '1');
    });
  }
}

test('first visit defaults to Lucheni and preserves an explicit saved production', async () => {
  for (const page of ['schedule', 'settlement']) {
    const fresh = await boot(page);
    assert.equal(fresh.context.window.BollsarProduction.id, 'elisabeth-2026-6th');
    assert.equal(fresh.values.get('bollsar.production.v1'), 'elisabeth-2026-6th');
    const saved = await boot(page, '', 'kinky-boots-2025-2026-7th');
    assert.equal(saved.context.window.BollsarProduction.id, 'kinky-boots-2025-2026-7th');
  }
});

test('validated query overrides saved selection; invalid query falls back safely', async () => {
  const kinky = 'kinky-boots-2025-2026-7th', elisabeth = 'elisabeth-2026-6th';
  assert.equal((await boot('schedule', `?production=${elisabeth}`, kinky)).context.window.BollsarProduction.id, elisabeth);
  for (const invalid of ['../../evil', 'https://evil.test/code', '__proto__', 'constructor']) {
    const result = await boot('schedule', `?production=${encodeURIComponent(invalid)}`, elisabeth);
    assert.equal(result.context.window.BollsarProduction.id, elisabeth);
    const fallback = await boot('settlement', `?production=${encodeURIComponent(invalid)}`, invalid);
    assert.equal(fallback.context.window.BollsarProduction.id, elisabeth);
    assert.equal(fallback.loaded.some(x => (x.src || x.href).includes(invalid)), false);
  }
});

test('explicit selection validates production and preserves the current URL', async () => {
  const {context, navigations} = await boot('schedule', '?keep=1');
  for (const invalid of ['../evil', '__proto__', 'constructor', '']) {
    assert.equal(context.window.BollsarProduction.select(invalid), false);
  }
  assert.equal(navigations.length, 0);
  assert.equal(context.window.BollsarProduction.select('elisabeth-2026-6th'), true);
  const url = new URL(navigations[0]);
  assert.equal(url.pathname, '/index.html');
  assert.equal(url.searchParams.get('keep'), '1');
  assert.equal(url.searchParams.get('production'), 'elisabeth-2026-6th');
});

test('a failed data script rejects boot before application execution', async () => {
  await assert.rejects(boot('schedule', '', undefined, 'data.js'), /Failed to load data\.js/);
});
