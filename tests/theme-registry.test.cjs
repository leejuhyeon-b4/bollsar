const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root =
  path.join(__dirname, '..');

const registry =
  fs.readFileSync(
    path.join(
      root,
      'theme-registry.js'
    ),
    'utf8'
  );

const index =
  fs.readFileSync(
    path.join(root, 'index.html'),
    'utf8'
  );

const settlement =
  fs.readFileSync(
    path.join(
      root,
      'settlement.html'
    ),
    'utf8'
  );

const sw =
  fs.readFileSync(
    path.join(root, 'sw.js'),
    'utf8'
  );

assert.ok(
  registry.includes(
    "'elisabeth-2026-6th-lucheni'"
  )
);

assert.ok(
  registry.includes(
    "productionId: 'elisabeth-2026-6th'"
  )
);

assert.ok(
  registry.includes(
    "'bollsar.theme.v1.production'"
  )
);

assert.ok(
  registry.includes(
    'window.BollsarThemeRegistry'
  )
);

assert.ok(
  registry.includes(
    "document.getElementById('loginBtn')"
  )
);

assert.match(
  index,
  /data\.js"><\/script>\s*<script src="theme-registry\.js"><\/script>\s*<script src="themes\/elisabeth-2026-6th-lucheni\/schedule\/view\.js"/
);

assert.match(
  settlement,
  /data\.js"><\/script>\s*<script src="theme-registry\.js"><\/script>\s*<script src="settlement-app\.js"/
);

assert.ok(
  sw.includes(
    "'./theme-registry.js'"
  )
);

assert.ok(
  sw.includes(
    "const CACHE_VERSION = 'v57';"
  )
);


const settlementExportHtml =
  fs.readFileSync(
    path.join(
      root,
      'settlement-export.html'
    ),
    'utf8'
  );

const settlementExportApp =
  fs.readFileSync(
    path.join(
      root,
      'settlement-export.js'
    ),
    'utf8'
  );

const settlementBackgroundPath =
  'themes/elisabeth-2026-6th-lucheni/assets/settlement/settlement-export-background.png';

assert.ok(
  registry.includes(
    'settlementExportBackground'
  )
);

assert.ok(
  registry.includes(
    settlementBackgroundPath
  )
);

assert.ok(
  settlementExportHtml.includes(
    'src="theme-registry.js"'
  )
);

assert.equal(
  settlementExportHtml.includes(
    settlementBackgroundPath
  ),
  false
);

assert.equal(
  settlementExportApp.includes(
    settlementBackgroundPath
  ),
  false
);

assert.ok(
  settlementExportApp.includes(
    'settlementExportBackground'
  )
);


assert.ok(
  registry.includes(
    'settlementExportStylesheet'
  )
);

assert.ok(
  registry.includes(
    'themes/elisabeth-2026-6th-lucheni/settlement/export.css'
  )
);

assert.ok(
  settlementExportHtml.includes(
    'id="settlementExportThemeStylesheet"'
  )
);

assert.equal(
  settlementExportHtml.includes(
    'themes/elisabeth-2026-6th-lucheni/settlement/export.css'
  ),
  false
);

assert.ok(
  settlementExportApp.includes(
    'settlementExportStylesheet'
  )
);

assert.ok(
  settlementExportApp.includes(
    'exportThemeStylesheet.href'
  )
);

assert.equal(
  settlementExportApp.includes(
    'themes/elisabeth-2026-6th-lucheni/settlement/export.css'
  ),
  false
);


assert.ok(
  registry.includes(
    "fonts:"
  )
);

assert.ok(
  registry.includes(
    'themes/elisabeth-2026-6th-lucheni/fonts/fonts.css'
  )
);

assert.ok(
  settlementExportHtml.includes(
    'id="settlementExportThemeFonts"'
  )
);

assert.equal(
  settlementExportHtml.includes(
    'themes/elisabeth-2026-6th-lucheni/fonts/fonts.css'
  ),
  false
);

assert.ok(
  settlementExportApp.includes(
    'exportTheme?.fonts'
  )
);

assert.ok(
  settlementExportApp.includes(
    'exportThemeFonts.href'
  )
);

assert.equal(
  settlementExportApp.includes(
    'themes/elisabeth-2026-6th-lucheni/fonts/fonts.css'
  ),
  false
);


const settlementThemeCss =
  fs.readFileSync(
    path.join(
      root,
      'themes',
      'elisabeth-2026-6th-lucheni',
      'settlement',
      'theme.css'
    ),
    'utf8'
  );

assert.ok(
  settlement.includes(
    'themes/elisabeth-2026-6th-lucheni/settlement/theme.css'
  )
);

for (const selector of [
  '.np-mast',
  '.st-title',
  '.st-tally',
  '.rec-card',
  '.gate-cta'
]) {
  assert.ok(
    settlementThemeCss.includes(selector)
  );
}

for (const geometry of [
  '--seat:11px',
  '--seat:15px',
  '.seatrow {',
  '.map-overview .is-fit .seatmap'
]) {
  assert.equal(
    settlementThemeCss.includes(geometry),
    false
  );

  assert.ok(
    settlement.includes(geometry)
  );
}

assert.ok(
  settlement.includes(
    '.seat { border:0 !important; box-shadow:none !important; }'
  )
);

assert.ok(
  sw.includes(
    "'./themes/elisabeth-2026-6th-lucheni/settlement/theme.css'"
  )
);


assert.ok(
  settlementThemeCss.includes(
    '/* Settlement seat presentation */'
  )
);

for (const selector of [
  '.st-floor-lbl',
  '.stage-bar',
  '.seatmap',
  '.seat.strong-l',
  '.is-fit .seat.on',
  '.map-overview::backdrop'
]) {
  assert.ok(
    settlementThemeCss.includes(selector)
  );
}

for (const geometry of [
  '--seat:11px',
  '--seat:15px',
  '--aisle:round(',
  '.seatrow {'
]) {
  assert.ok(
    settlement.includes(geometry)
  );
}

assert.equal(
  settlementThemeCss.includes(
    '--seat:11px'
  ),
  false
);

assert.equal(
  settlementThemeCss.includes(
    '--seat:15px'
  ),
  false
);

assert.ok(
  settlement.includes(
    '.seat { border:0 !important; box-shadow:none !important; }'
  )
);


assert.ok(
  registry.includes(
    'position: absolute;'
  )
);

assert.ok(
  registry.includes(
    'left: 0;'
  )
);

assert.ok(
  registry.includes(
    'top: 14px;'
  )
);

assert.ok(
  registry.includes(
    '@media (max-width:600px)'
  )
);

assert.ok(
  registry.includes(
    'top: 6px;'
  )
);

console.log(
  'theme registry tests passed'
);
