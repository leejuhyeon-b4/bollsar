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

  const exportHtml = fs.readFileSync(path.join(root, 'settlement-export.html'), 'utf8');
  const exportScripts = [...exportHtml.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)];
  for (const [, script] of exportScripts) {
    assert.doesNotThrow(() => new vm.Script(script), 'settlement-export.html has invalid inline JavaScript');
    const hash = `sha256-${crypto.createHash('sha256').update(script).digest('base64')}`;
    assert.ok(policy.includes(`'${hash}'`), `settlement-export.html CSP is missing ${hash}`);
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
  assert.match(html, /--seat:12px;/);
  assert.match(html, /\.map-overview \.is-fit \.seatmap \{ --seat:15px; --seat-h:15px; --aisle:10px; \}/);
  assert.match(html, /--aisle:round\(down, calc\(\(var\(--map-w\) - var\(--map-seats\) \* var\(--seat\)\) \/ var\(--map-aisles\)\), 1px\)/);
  assert.match(html, /border:0; border-top:1px solid var\(--ink-55\); border-left:1px solid var\(--ink-55\)/);
  assert.match(html, /\.seat\.edge-r \{ border-right:1px solid var\(--ink-55\); \}/);
  assert.match(html, /\.seat\.edge-b \{ border-bottom:1px solid var\(--ink-55\); \}/);
  assert.doesNotMatch(html, /\.map-overview \.is-fit \.seat\.on \{ border:2px/);
  assert.doesNotMatch(html, /\.is-fit \.seat\.on[^}]*box-shadow/s);
  assert.match(html, /--map-seats:\$\{mapSeats\};--map-aisles:\$\{mapAisles\}/);
  assert.match(html, /content\.style\.zoom = overviewZoom/);
  assert.match(html, /aisleScale = \.35/);
  assert.match(html, /font-family:var\(--mono\); line-height:1; padding:0; grid-row:1;/);
  assert.match(html, /align-self:center; grid-row:1;/);
  assert.match(html, /class="np-btn sm js-map-zoom-in"/);
  assert.match(html, /class="np-btn sm js-map-zoom-out"/);
  assert.doesNotMatch(html, /overflow-x:scroll/);
  assert.doesNotMatch(html, /\.seatmap-scroll::after/);

  const exportHtml = fs.readFileSync(path.join(root, 'settlement-export.html'), 'utf8');
  assert.match(exportHtml, /\.seat-cell\{width:16px;height:16px;border:1px/);
  assert.match(exportHtml, /\.seat-floors\{display:flex;flex-direction:column;gap:18px\}/);
  assert.match(exportHtml, /\.seat-cell\.on\{border:2px solid #f1e5cf;box-shadow:none\}/);
  assert.match(exportHtml, /\.legend\{left:1091px;top:162px/);
});

test('schedule keeps past toggle and shortens curtain call on mobile', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /const past = all\.filter\(p => isPast\(p\)\)/);
  assert.match(html, /<span class="full">커튼콜데이<\/span><span class="short">커튼콜<\/span>/);
  assert.match(html, /\.np-cell-ev \.short \{ display:inline; \}/);
});
