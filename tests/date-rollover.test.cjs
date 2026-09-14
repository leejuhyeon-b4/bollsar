const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');

function todayAt (iso) {
  const source = fs.readFileSync(path.join(root, 'data.js'), 'utf8');
  const block = source.match(/const KOREA_DATE_FORMATTER[\s\S]*?(?=const RANGE)/)[0];
  const RealDate = Date;

  class MockDate extends RealDate {
    constructor (...args) {
      super(...(args.length ? args : [iso]));
    }
  }

  const context = {
    Intl,
    Date: MockDate,
    setInterval () {},
    document: { hidden: false, addEventListener () {} },
    window: { dispatchEvent () {} },
    CustomEvent: class CustomEvent {}
  };
  vm.runInNewContext(`${block}; globalThis.result = { ...TODAY };`, context);
  return JSON.parse(JSON.stringify(context.result));
}

test('today rolls over at midnight in Korea', () => {
  assert.deepEqual(todayAt('2026-09-13T14:59:59Z'), { y: 2026, m: 9, d: 13 });
  assert.deepEqual(todayAt('2026-09-13T15:00:00Z'), { y: 2026, m: 9, d: 14 });
});

test('a performance becomes past at its Korea start time', () => {
  const source = fs.readFileSync(path.join(root, 'data.js'), 'utf8');
  const block = source.match(/const performanceStartMs[\s\S]*?const isPast =[^;]+;/)[0];
  const context = {};
  vm.runInNewContext(`${block}; globalThis.check = isPast;`, context);
  const performance = { y: 2026, m: 9, d: 13, t: '15:00' };

  assert.equal(context.check(performance, Date.parse('2026-09-13T05:59:59Z')), false);
  assert.equal(context.check(performance, Date.parse('2026-09-13T06:00:00Z')), true);
});

test('inline scripts compile and are allowed by the deployed CSP', () => {
  const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
  const policy = config.headers[0].headers
    .find(header => header.key === 'Content-Security-Policy').value;

  for (const filename of ['index.html', 'settlement.html']) {
    const html = fs.readFileSync(path.join(root, filename), 'utf8');
    const metaPolicy = html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)">/)[1];
    const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)];

    for (const [, script] of scripts) {
      assert.doesNotThrow(() => new vm.Script(script), `${filename} has invalid inline JavaScript`);
      const hash = `sha256-${crypto.createHash('sha256').update(script).digest('base64')}`;
      assert.ok(policy.includes(`'${hash}'`), `${filename} CSP is missing ${hash}`);
      assert.ok(metaPolicy.includes(`'${hash}'`), `${filename} meta CSP is missing ${hash}`);
    }
  }
});

test('settlement defaults to past performances and can include upcoming ones', () => {
  const html = fs.readFileSync(path.join(root, 'settlement.html'), 'utf8');
  assert.match(html, /let completedOnly = true;/);
  assert.match(html, /!completedOnly \|\| isPast\(x\.perf\)/);
  assert.match(html, /!completedOnly \|\| isPast\(perf\)/);
  assert.match(html, /class="js-completed-only"[^>]*\$\{completedOnly \? 'checked' : ''\}/);
  assert.match(html, /지난 회차만 정산/);
  assert.match(html, /해제하면 예정 회차도 포함/);
});

test('settlement shares one seat-map scroller and unlocks every performance', () => {
  const html = fs.readFileSync(path.join(root, 'settlement.html'), 'utf8');
  assert.match(html, /<div class="seatmap-scroll"><div class="seatmaps">\$\{floors\}<\/div><\/div>/);
  assert.match(html, /\.filter\(p => !hongOnly \|\| isHongPerf\(p\)\)/);
  assert.doesNotMatch(html, /\.filter\(p => !taken\.has\(perfKey\(p\)\)\)/);
  assert.match(html, /isTaken \? ' disabled' : ''/);
  assert.match(html, /아래 기록 추가에서 모든 회차를 담을 수 있습니다/);
  assert.match(html, /class="np-btn sm js-map-overview">확대해서 보기<\/button>/);
  const mast = html.match(/<header class="np-mast"[\s\S]*?<\/header>/)?.[0] || '';
  assert.doesNotMatch(mast, /np-preview/);
  assert.match(html, /<dialog class="map-overview"/);
  assert.match(html, /\.map-overview \.is-fit \{ --map-w:780px; \}/);
  assert.match(html, /content\.style\.zoom = overviewZoom/);
  assert.match(html, /aisleScale = \.35/);
  assert.match(html, /class="np-btn sm js-map-zoom-in"/);
  assert.match(html, /class="np-btn sm js-map-zoom-out"/);
  assert.doesNotMatch(html, /overflow-x:scroll/);
  assert.doesNotMatch(html, /\.seatmap-scroll::after/);
});
