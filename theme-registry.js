(() => {
  'use strict';

  const STORAGE_PREFIX =
    'bollsar.theme.v1.production';

  const THEMES = Object.freeze([
    Object.freeze({
      id: 'elisabeth-2026-6th-lucheni',
      productionId: 'elisabeth-2026-6th',
      shortLabel: '\ub8e8\ucf00\ub2c8 6\uc5f0',
      fullLabel:
        '\uc5d8\ub9ac\uc790\ubcb3 2026 6\uc5f0 \u00b7 \ub8e8\ucf00\ub2c8',
      scheduleView:
        'themes/elisabeth-2026-6th-lucheni/schedule/view.js',
      fonts:
        'themes/elisabeth-2026-6th-lucheni/fonts/fonts.css'
    })
  ]);

  const storageKey = productionId =>
    `${STORAGE_PREFIX}.${productionId}`;

  const listForProduction = productionId =>
    THEMES.filter(
      theme =>
        theme.productionId === productionId
    );

  const findTheme = (
    productionId,
    themeId
  ) =>
    listForProduction(productionId)
      .find(theme => theme.id === themeId) ||
    null;

  function selectedThemeId (productionId) {
    const available =
      listForProduction(productionId);

    if (!available.length) return null;

    let saved = null;

    try {
      saved = localStorage.getItem(
        storageKey(productionId)
      );
    } catch (_) {}

    return findTheme(
      productionId,
      saved
    )
      ? saved
      : available[0].id;
  }

  function selectTheme (
    productionId,
    themeId
  ) {
    const theme =
      findTheme(productionId, themeId);

    if (!theme) return false;

    try {
      localStorage.setItem(
        storageKey(productionId),
        theme.id
      );
    } catch (_) {}

    window.dispatchEvent(
      new CustomEvent(
        'bollsarthemechange',
        {
          detail: {
            productionId,
            themeId: theme.id
          }
        }
      )
    );

    return true;
  }

  function ensureStyle () {
    if (
      document.getElementById(
        'bollsarThemePickerStyle'
      )
    ) return;

    const style =
      document.createElement('style');

    style.id =
      'bollsarThemePickerStyle';

    style.textContent = `
      .bollsar-theme-picker {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        font: inherit;
      }

      .bollsar-theme-picker > summary {
        cursor: pointer;
        list-style: none;
        white-space: nowrap;
        font: inherit;
        color: inherit;
        background: transparent;
        border: 0;
        padding: 4px 0;
        user-select: none;
      }

      .bollsar-theme-picker > summary::-webkit-details-marker {
        display: none;
      }

      .bollsar-theme-menu {
        position: absolute;
        z-index: 1000;
        top: calc(100% + 6px);
        left: 0;
        min-width: 220px;
        padding: 5px;
        border: 1px solid currentColor;
        background: Canvas;
        color: CanvasText;
        box-shadow: 0 5px 18px rgba(0,0,0,.12);
      }

      .bollsar-theme-option {
        display: block;
        width: 100%;
        padding: 8px 9px;
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        text-align: left;
        cursor: pointer;
        white-space: nowrap;
      }

      .bollsar-theme-option[aria-current="true"] {
        font-weight: 700;
      }
    `;

    document.head.appendChild(style);
  }

  function activeProductionId () {
    if (
      typeof WORK !== 'undefined' &&
      WORK &&
      WORK.id
    ) {
      return WORK.id;
    }

    return null;
  }

  function mountThemePicker () {
    const productionId =
      activeProductionId();

    if (!productionId) return;

    const loginButton =
      document.getElementById('loginBtn');

    if (
      !loginButton ||
      document.getElementById(
        'themePicker'
      )
    ) {
      return;
    }

    const available =
      listForProduction(productionId);

    if (!available.length) return;

    ensureStyle();

    const selectedId =
      selectedThemeId(productionId);

    const selected =
      findTheme(
        productionId,
        selectedId
      ) || available[0];

    const picker =
      document.createElement('details');

    picker.id = 'themePicker';
    picker.className =
      'bollsar-theme-picker';

    const summary =
      document.createElement('summary');

    summary.textContent =
      `${selected.shortLabel} \u25be`;

    summary.setAttribute(
      'aria-label',
      '\ud14c\ub9c8 \uc120\ud0dd'
    );

    const menu =
      document.createElement('div');

    menu.className =
      'bollsar-theme-menu';

    for (const theme of available) {
      const button =
        document.createElement('button');

      button.type = 'button';
      button.className =
        'bollsar-theme-option';

      button.textContent =
        theme.fullLabel;

      button.dataset.themeId =
        theme.id;

      button.setAttribute(
        'aria-current',
        String(theme.id === selected.id)
      );

      button.addEventListener(
        'click',
        () => {
          picker.open = false;

          if (
            theme.id ===
            selectedThemeId(
              productionId
            )
          ) {
            return;
          }

          if (
            selectTheme(
              productionId,
              theme.id
            )
          ) {
            window.location.reload();
          }
        }
      );

      menu.appendChild(button);
    }

    picker.append(
      summary,
      menu
    );

    loginButton.insertAdjacentElement(
      'beforebegin',
      picker
    );

    const parent =
      loginButton.parentElement;

    if (
      parent &&
      typeof getComputedStyle ===
        'function'
    ) {
      const display =
        getComputedStyle(parent)
          .display;

      if (
        display === 'flex' ||
        display === 'inline-flex'
      ) {
        picker.style.marginRight =
          'auto';
      } else {
        picker.style.marginRight =
          '10px';
      }
    }
  }

  window.BollsarThemeRegistry =
    Object.freeze({
      themes: THEMES,
      listForProduction,
      selectedThemeId,
      selectTheme,
      mountThemePicker
    });

  if (
    document.readyState ===
    'loading'
  ) {
    document.addEventListener(
      'DOMContentLoaded',
      mountThemePicker
    );
  } else {
    mountThemePicker();
  }
})();
