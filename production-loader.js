(() => {
  const page = document.currentScript.dataset.page;
  const themes = {
    'elisabeth-2026-6th': 'elisabeth-2026-6th-lucheni',
    'kinky-boots-2025-2026-7th': 'kinky-boots-2025-2026-7th-lola'
  };
  const requested = new URLSearchParams(location.search).get('production');
  let saved;
  try { saved = localStorage.getItem('bollsar.production.v1'); } catch (_) {}
  const id = Object.hasOwn(themes, requested) ? requested
    : Object.hasOwn(themes, saved) ? saved : 'kinky-boots-2025-2026-7th';
  const theme = `themes/${themes[id]}`;
  const kinky = id === 'kinky-boots-2025-2026-7th';
  try { localStorage.setItem('bollsar.production.v1', id); } catch (_) {}

  window.BollsarProduction = {
    id,
    select(productionId) {
      if (!Object.hasOwn(themes, productionId)) return false;
      const url = new URL(location.href);
      url.searchParams.set('production', productionId);
      location.assign(url.href);
      return true;
    }
  };
  for (const link of document.querySelectorAll('.np-nav a')) {
    const url = new URL(link.href);
    url.searchParams.set('production', id);
    link.href = url.href;
  }

  function load(src, stylesheet = false, module = false) {
    return new Promise((resolve, reject) => {
      const element = document.createElement(stylesheet ? 'link' : 'script');
      if (stylesheet) { element.rel = 'stylesheet'; element.href = src; }
      else { element.src = src; if (module) element.type = 'module'; }
      element.onload = resolve;
      element.onerror = () => reject(Error(`Failed to load ${src}`));
      document.head.append(element);
    });
  }
  window.productionReady = (async () => {
    await load('themes/elisabeth-2026-6th-lucheni/fonts/fonts.css', true);
    if (kinky) await load(`${theme}/schedule/theme.css`, true);
    if (page === 'settlement') {
      await load('themes/elisabeth-2026-6th-lucheni/settlement/theme.css', true);
      if (kinky) await load(`${theme}/settlement/theme.css`, true);
    }
    if (page === 'schedule' && kinky) await load(`${theme}/schedule/lola-viewer.css`, true);
    await load(`productions/${id}/data/schedule.js`);
    await load(`productions/${id}/data/seat-map.js`);
    await load('data.js');
    await load('theme-registry.js');
    if (page === 'schedule') await load(`${theme}/schedule/view.js`);
    await load(page === 'schedule' ? 'schedule-app.js' : 'settlement-app.js');
    if (page === 'schedule' && kinky) await load(`${theme}/schedule/lola-viewer.js`, false, true);
    await load('pwa-install.js');
  })();
})();
