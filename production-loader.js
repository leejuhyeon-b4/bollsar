(() => {
  const page = document.currentScript.dataset.page;
  const themes = {
    'elisabeth-2026-6th': 'elisabeth-2026-6th-lucheni',
    'kinky-boots-2025-2026-7th': 'kinky-boots-2025-2026-7th-lola',
    'aladdin-2024-2025-1st': 'aladdin-2024-2025-1st-genie'
  };
  const requested = new URLSearchParams(location.search).get('production') || document.currentScript.dataset.production;
  let saved;
  try { saved = localStorage.getItem('bollsar.production.v1'); } catch (_) {}
  const id = Object.hasOwn(themes, requested) ? requested
    : Object.hasOwn(themes, saved) ? saved : 'elisabeth-2026-6th';
  const theme = `themes/${themes[id]}`;
  const kinky = id === 'kinky-boots-2025-2026-7th';
  const aladdin = id === 'aladdin-2024-2025-1st';
  try { localStorage.setItem('bollsar.production.v1', id); } catch (_) {}

  window.BollsarProduction = {
    id,
    select(productionId) {
      if (!Object.hasOwn(themes, productionId)) return false;
      const url = new URL(location.href);
      if (aladdin || productionId === 'aladdin-2024-2025-1st') {
        url.pathname = `${productionId === 'aladdin-2024-2025-1st' ? '/aladdin/' : '/'}${page === 'settlement' ? 'settlement.html' : 'index.html'}`;
      }
      url.searchParams.set('production', productionId);
      location.assign(url.href);
      return true;
    }
  };
  if (new URL(location.href).pathname.startsWith('/aladdin/') !== aladdin) {
    const url = new URL(location.href);
    url.pathname = `${aladdin ? '/aladdin/' : '/'}${page === 'settlement' ? 'settlement.html' : 'index.html'}`;
    url.searchParams.set('production', id);
    location.replace(url.href);
    return;
  }
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
    if (page === 'settlement' && !aladdin) await load('themes/elisabeth-2026-6th-lucheni/settlement/theme.css', true);
    if (kinky) await load(`${theme}/scheduletab/theme.css`, true);
    if (page === 'settlement' && kinky) await load(`${theme}/settlement/theme.css`, true);
    if (page === 'schedule' && kinky) await load(`${theme}/scheduletab/lola-viewer.css`, true);
    if (aladdin) {
      await load(`${theme}/shared/base.css`, true);
      await load(`${theme}/${page === 'schedule' ? 'scheduletab' : 'settlement'}/theme.css`, true);
    }
    await load(`productions/${id}/data/schedule.js`);
    await load(`productions/${id}/data/seat-map.js`);
    await load('data.js');
    await load('theme-registry.js');
    if (aladdin && page === 'settlement') {
      await load('assets/common/html2canvas-1.4.1.min.js');
      await load(`${theme}/settlement/view.js`);
    }
    if (page === 'schedule') await load(`${theme}/scheduletab/view.js`);
    await load(page === 'schedule' ? 'schedule-app.js' : 'settlement-app.js');
    if (page === 'schedule' && kinky) await load(`${theme}/scheduletab/lola-viewer.js`, false, true);
    if (!aladdin) await load('pwa-install.js');
  })();
})();
