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
    "const CACHE_VERSION = 'v53';"
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

console.log(
  'theme registry tests passed'
);
