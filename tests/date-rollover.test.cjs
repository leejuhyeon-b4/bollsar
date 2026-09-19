const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');

function todayAt (iso) {
  const source = fs.readFileSync(path.join(root, 'data.js'), 'utf8');
  const block = source.match(
    /const KOREA_DATE_FORMATTER[\s\S]*?(?=const RANGE)/
  )[0];

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
    document: {
      hidden: false,
      addEventListener () {}
    },
    window: {
      dispatchEvent () {}
    },
    CustomEvent: class CustomEvent {}
  };

  vm.runInNewContext(
    `${block}; globalThis.result = { ...TODAY };`,
    context
  );

  return JSON.parse(JSON.stringify(context.result));
}

function normalizeInlineScript (script) {
  return script.replace(/\r\n?/g, '\n');
}

function inlineScripts (html) {
  return [
    ...html.matchAll(
      /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi
    )
  ];
}

test('today rolls over at midnight in Korea', () => {
  assert.deepEqual(
    todayAt('2026-09-13T14:59:59Z'),
    { y: 2026, m: 9, d: 13 }
  );

  assert.deepEqual(
    todayAt('2026-09-13T15:00:00Z'),
    { y: 2026, m: 9, d: 14 }
  );
});

test('a performance becomes past at its Korea start time', () => {
  const source = fs.readFileSync(
    path.join(root, 'data.js'),
    'utf8'
  );

  const block = source.match(
    /const performanceStartMs[\s\S]*?const isPast =[^;]+;/
  )[0];

  const context = {};

  vm.runInNewContext(
    `${block}; globalThis.check = isPast;`,
    context
  );

  const performance = {
    y: 2026,
    m: 9,
    d: 13,
    t: '15:00'
  };

  assert.equal(
    context.check(
      performance,
      Date.parse('2026-09-13T05:59:59Z')
    ),
    false
  );

  assert.equal(
    context.check(
      performance,
      Date.parse('2026-09-13T06:00:00Z')
    ),
    true
  );
});

test('inline scripts compile and are allowed by the deployed CSP', () => {
  const config = JSON.parse(
    fs.readFileSync(
      path.join(root, 'vercel.json'),
      'utf8'
    )
  );

  const policy = config.headers[0].headers
    .find(
      header =>
        header.key === 'Content-Security-Policy'
    )
    .value;

  for (const filename of ['index.html', 'settlement.html']) {
    const html = fs.readFileSync(
      path.join(root, filename),
      'utf8'
    );

    const metaMatch = html.match(
      /<meta http-equiv="Content-Security-Policy" content="([^"]+)">/
    );

    assert.ok(
      metaMatch,
      `${filename} is missing its CSP meta tag`
    );

    const metaPolicy = metaMatch[1];

    for (const [, rawScript] of inlineScripts(html)) {
      const script = normalizeInlineScript(rawScript);

      assert.doesNotThrow(
        () => new vm.Script(script),
        `${filename} has invalid inline JavaScript`
      );

      const hash =
        `sha256-${
          crypto
            .createHash('sha256')
            .update(script, 'utf8')
            .digest('base64')
        }`;

      assert.ok(
        policy.includes(`'${hash}'`),
        `${filename} deployed CSP is missing ${hash}`
      );

      assert.ok(
        metaPolicy.includes(`'${hash}'`),
        `${filename} meta CSP is missing ${hash}`
      );
    }
  }

  const exportHtml = fs.readFileSync(
    path.join(root, 'settlement-export.html'),
    'utf8'
  );

  for (const [, rawScript] of inlineScripts(exportHtml)) {
    const script = normalizeInlineScript(rawScript);

    assert.doesNotThrow(
      () => new vm.Script(script),
      'settlement-export.html has invalid inline JavaScript'
    );

    const hash =
      `sha256-${
        crypto
          .createHash('sha256')
          .update(script, 'utf8')
          .digest('base64')
      }`;

    assert.ok(
      policy.includes(`'${hash}'`),
      `settlement-export.html CSP is missing ${hash}`
    );
  }
});

test(
  'settlement defaults to past performances and can include upcoming ones',
  () => {
    const app = fs.readFileSync(
      path.join(root, 'settlement-app.js'),
      'utf8'
    );

    assert.match(
      app,
      /let completedOnly\s*=\s*true;/
    );

    assert.match(
      app,
      /\.filter\(x => x\.perf[\s\S]*?&& \(!completedOnly \|\| isPast\(x\.perf\)\)\)/
    );

    assert.match(
      app,
      /const denominator = \(\) => PERFS\.filter\(perf =>[\s\S]*?\(!completedOnly \|\| isPast\(perf\)\)[\s\S]*?\)\.length;/
    );

    assert.match(
      app,
      /class="js-completed-only" \$\{completedOnly \? 'checked' : ''\}/
    );

    assert.match(
      app,
      /지난 회차만 정산/
    );

    assert.match(
      app,
      /해제하면 예정 회차도 포함/
    );

    assert.match(
      app,
      /completedOnly = completed\.checked;/
    );
  }
);

test(
  'settlement shares one seat-map scroller and unlocks every performance',
  () => {
    const html = fs.readFileSync(
      path.join(root, 'settlement.html'),
      'utf8'
    );

    const app = fs.readFileSync(
      path.join(root, 'settlement-app.js'),
      'utf8'
    );

    const seatLines = fs.readFileSync(
      path.join(root, 'seat-lines.js'),
      'utf8'
    );

    const exportHtml = fs.readFileSync(
      path.join(root, 'settlement-export.html'),
      'utf8'
    );

    const exportApp = fs.readFileSync(
      path.join(root, 'settlement-export.js'),
      'utf8'
    );

    assert.match(
      app,
      /<div class="seatmap-scroll"><div class="seatmaps">\$\{floors\}<\/div><\/div>/
    );

    assert.match(
      app,
      /\.filter\(p => !hongOnly \|\| isHongPerf\(p\)\)/
    );

    assert.doesNotMatch(
      app,
      /\.filter\(p => !taken\.has\(perfKey\(p\)\)\)/
    );

    assert.match(
      app,
      /isTaken \? ' disabled' : ''/
    );

    assert.match(
      app,
      /아래 기록 추가에서 모든 회차를 담을 수 있습니다/
    );

    assert.match(
      app,
      /class="np-btn sm js-map-overview">확대해서 보기<\/button>/
    );

    const mast =
      html.match(
        /<header class="np-mast"[\s\S]*?<\/header>/
      )?.[0] || '';

    assert.doesNotMatch(
      mast,
      /np-preview/
    );

    assert.match(
      html,
      /<dialog class="map-overview"/
    );

    assert.match(
      html,
      /\.is-fit \.seatmap \{[\s\S]*?--seat:11px;[\s\S]*?--seat-h:calc\(var\(--seat\) \+ 1px\);/
    );

    assert.match(
      html,
      /\.map-overview \.is-fit \{ --map-w:780px; \}/
    );

    assert.match(
      html,
      /\.map-overview \.is-fit \.seatmap \{ --seat:15px; --seat-h:15px; --aisle:10px; \}/
    );

    assert.match(
      app,
      /const aisleScale = \.35;/
    );

    assert.match(
      app,
      /--map-seats:\$\{mapSeats\};--map-aisles:\$\{mapAisles\}/
    );

    assert.match(
      app,
      /content\.style\.zoom = overviewZoom/
    );

    /*
     * 확대/축소 버튼은 settlement-app.js가 아니라
     * settlement.html의 dialog markup에 있다.
     */
    assert.match(
      html,
      /class="np-btn sm js-map-zoom-in"/
    );

    assert.match(
      html,
      /class="np-btn sm js-map-zoom-out"/
    );

    /*
     * 좌석 자체는 border를 그리지 않는다.
     * seat-lines.js가 공유 SVG 선을 한 번만 그린다.
     */
    assert.match(
      html,
      /\.seat \{ border:0 !important; box-shadow:none !important; \}/
    );

    assert.doesNotMatch(
      html,
      /\.seat\.edge-r\.edge-b \{ box-shadow:/
    );

    assert.match(
      seatLines,
      /function mergeSegments\(segments\)/
    );

    assert.match(
      seatLines,
      /path\.setAttribute\(\s*'stroke-linecap',\s*'square'\s*\)/
    );

    assert.match(
      seatLines,
      /path\.setAttribute\(\s*'stroke-linejoin',\s*'miter'\s*\)/
    );

    /*
     * 정산판 기본 0.5px, 확대판 1px.
     */
    assert.match(
      seatLines,
      /root\.closest\('\.map-overview'\)\s*\?\s*1\s*:\s*0\.5/
    );

    assert.match(
      seatLines,
      /renderOne\(\s*root,\s*'\.seat',\s*'settlement'\s*\)/
    );

    assert.match(
      seatLines,
      /renderOne\(\s*root,\s*'\.seat-cell',\s*'export'\s*\)/
    );

    /*
     * Export도 같은 shared-line 원칙.
     */
    assert.match(
      exportHtml,
      /\.seat-cell, \.seat-cell\.on \{ border:0 !important; box-shadow:none !important; \}/
    );

    assert.match(
      exportHtml,
      /\.seat-rows \{ position:relative; \}/
    );

    assert.match(
      exportHtml,
      /\.seat-row \{[\s\S]*?height:16px;[\s\S]*?align-items:stretch;/
    );

    assert.match(
      exportHtml,
      /\.seat-cell \{[\s\S]*?width:16px;[\s\S]*?height:16px;/
    );

    assert.match(
      exportHtml,
      /\.seat-floors\{display:flex;flex-direction:column;gap:18px\}/
    );

    assert.match(
      exportHtml,
      /\.legend\{left:1091px;top:162px/
    );

    assert.match(
      exportApp,
      /occupied\.has\(i\+1\)\?'16px':aisleCols\.has\(i\+1\)\?'10px':'0px'/
    );

    assert.match(
      exportApp,
      /window\.SeatLines\?\.renderExport\(document\)/
    );
  }
);

test(
  'schedule keeps past toggle and shortens curtain call on mobile',
  () => {
    const html = fs.readFileSync(
      path.join(root, 'index.html'),
      'utf8'
    );

    assert.match(
      html,
      /const past = all\.filter\(p => isPast\(p\)\)/
    );

    assert.match(
      html,
      /<span class="full">커튼콜데이<\/span><span class="short">커튼콜<\/span>/
    );

    assert.match(
      html,
      /\.np-cell-ev \.short \{ display:inline; \}/
    );
  }
);