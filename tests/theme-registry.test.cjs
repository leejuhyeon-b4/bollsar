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
    "const CACHE_VERSION = 'v49';"
  )
);

console.log(
  'theme registry tests passed'
);
