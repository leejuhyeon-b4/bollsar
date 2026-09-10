(function () {
  'use strict';

  const NEVER_KEY = 'hongcal.install.never.v1';
  const SESSION_KEY = 'hongcal.install.hidden';
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true;
  let installPrompt = null;
  let wrap = null;
  let previousFocus = null;
  let fallbackTimer = null;

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./sw.js').catch(function (error) {
        console.warn('[홍캘] 서비스 워커 등록 실패:', error);
      });
    });
  }

  if (isStandalone || readStorage(localStorage, NEVER_KEY) === '1') return;

  injectModal();

  window.addEventListener('beforeinstallprompt', function (event) {
    if (isIOS) return;
    event.preventDefault();
    installPrompt = event;
    setMode('install');
    showModal();
  });

  window.addEventListener('appinstalled', function () {
    installPrompt = null;
    hideModal(false);
  });

  window.addEventListener('load', function () {
    if (readStorage(sessionStorage, SESSION_KEY) === '1') return;
    fallbackTimer = window.setTimeout(function () {
      setMode(isIOS ? 'ios' : 'manual');
      showModal();
    }, isIOS ? 700 : 1800);
  });

  function injectModal () {
    const style = document.createElement('style');
    style.id = 'pwaInstallCSS';
    style.textContent = `
      html.pwa-modal-open, html.pwa-modal-open body { overflow:hidden; }
      #pwaInstallWrap {
        position:fixed; inset:0; z-index:80; display:grid; place-items:end center;
        padding:max(14px, env(safe-area-inset-top)) 14px max(14px, env(safe-area-inset-bottom));
      }
      #pwaInstallWrap[hidden] { display:none; }
      .pwa-install-back { position:absolute; inset:0; background:rgba(15,14,10,.58); }
      .pwa-install-box {
        position:relative; width:100%; max-width:390px; min-width:0;
        max-height:calc(100dvh - 28px); overflow-y:auto;
        background:var(--paper, #e9e3d5); color:var(--ink, #17150f);
        border:1px solid var(--ink, #17150f); border-top:3px double var(--ink, #17150f);
        border-bottom:3px double var(--ink, #17150f); padding:22px 20px 18px;
        box-shadow:0 12px 36px rgba(15,14,10,.25); overscroll-behavior:contain;
      }
      .pwa-install-x {
        position:absolute; top:8px; right:9px; width:32px; height:32px;
        border:0; background:none; color:inherit; cursor:pointer;
        font:16px/1 var(--mono, monospace);
      }
      .pwa-install-kicker {
        margin:0 36px 6px 0; color:var(--accent, #8f2e22);
        font:600 11px/1.4 var(--mono, monospace); letter-spacing:.12em;
      }
      .pwa-install-title {
        margin:0 32px 8px 0; font:900 25px/1.15 var(--display, serif); letter-spacing:0;
      }
      .pwa-install-copy {
        margin:0 0 16px; color:var(--ink-72, rgba(23,21,15,.75));
        font:13px/1.7 var(--body, sans-serif); word-break:keep-all;
      }
      .pwa-install-guide {
        margin:0 0 16px; padding:13px 14px; border-block:1px solid var(--ink-28, rgba(23,21,15,.28));
        background:rgba(255,255,255,.22);
      }
      .pwa-install-guide strong {
        display:block; margin-bottom:7px; font:700 13px/1.4 var(--display, serif);
      }
      .pwa-install-guide ol { margin:0; padding-left:20px; }
      .pwa-install-guide li {
        padding:2px 0 2px 3px; color:var(--ink-72, rgba(23,21,15,.75));
        font:12px/1.6 var(--mono, monospace);
      }
      .pwa-install-actions { display:grid; gap:8px; }
      .pwa-install-primary, .pwa-install-never {
        width:100%; min-height:44px; cursor:pointer;
        font:600 12px/1.3 var(--mono, monospace); letter-spacing:.06em;
      }
      .pwa-install-primary {
        border:1px solid var(--ink, #17150f); background:var(--ink, #17150f);
        color:var(--paper, #e9e3d5);
      }
      .pwa-install-never {
        border:0; background:none; color:var(--ink-60, rgba(23,21,15,.66));
        text-decoration:underline; text-underline-offset:3px;
      }
      @media (min-width:601px) {
        #pwaInstallWrap { place-items:center; }
      }
    `;
    document.head.appendChild(style);

    wrap = document.createElement('div');
    wrap.id = 'pwaInstallWrap';
    wrap.hidden = true;
    wrap.innerHTML = `
      <div class="pwa-install-back" data-pwa-close></div>
      <section class="pwa-install-box" role="dialog" aria-modal="true" aria-labelledby="pwaInstallTitle" aria-describedby="pwaInstallCopy">
        <button type="button" class="pwa-install-x" data-pwa-close aria-label="닫기">&#10005;</button>
        <p class="pwa-install-kicker">HOME SCREEN</p>
        <h2 class="pwa-install-title" id="pwaInstallTitle">홍캘을 홈 화면에</h2>
        <p class="pwa-install-copy" id="pwaInstallCopy">공연 일정과 정산판을 앱처럼 빠르게 열고, 저장된 화면은 오프라인에서도 확인할 수 있습니다.</p>
        <div class="pwa-install-guide" data-pwa-guide hidden></div>
        <div class="pwa-install-actions">
          <button type="button" class="pwa-install-primary" data-pwa-install>홍캘 설치</button>
          <button type="button" class="pwa-install-never" data-pwa-never>이 디바이스에서 다시 보지 않기</button>
        </div>
      </section>`;
    document.body.appendChild(wrap);

    wrap.querySelectorAll('[data-pwa-close]').forEach(function (button) {
      button.addEventListener('click', function () { hideModal(true); });
    });
    wrap.querySelector('[data-pwa-never]').addEventListener('click', function () {
      writeStorage(localStorage, NEVER_KEY, '1');
      hideModal(false);
    });
    wrap.querySelector('[data-pwa-install]').addEventListener('click', installApp);
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && wrap && !wrap.hidden) hideModal(true);
    });
  }

  function setMode (mode) {
    if (!wrap) return;
    const guide = wrap.querySelector('[data-pwa-guide]');
    const button = wrap.querySelector('[data-pwa-install]');

    if (mode === 'install') {
      guide.hidden = true;
      button.hidden = false;
      button.textContent = '홍캘 설치';
      return;
    }

    guide.hidden = false;
    button.hidden = true;
    if (mode === 'ios') {
      guide.innerHTML = '<strong>iPhone Safari에서 설치하기</strong><ol><li>Safari의 공유 버튼을 누릅니다.</li><li>홈 화면에 추가를 선택합니다.</li><li>웹 앱으로 열기를 켜고 추가를 누릅니다.</li></ol>';
    } else {
      guide.innerHTML = '<strong>브라우저 메뉴에서 설치하기</strong><ol><li>Chrome 또는 Edge의 메뉴를 엽니다.</li><li>앱 설치 또는 홈 화면에 추가를 선택합니다.</li></ol>';
    }
  }

  async function installApp () {
    if (!installPrompt) {
      setMode(isIOS ? 'ios' : 'manual');
      return;
    }
    const prompt = installPrompt;
    installPrompt = null;
    await prompt.prompt();
    const choice = await prompt.userChoice;
    if (choice.outcome === 'accepted') hideModal(false);
    else setMode('manual');
  }

  function showModal () {
    if (!wrap || !wrap.hidden || isStandalone || readStorage(localStorage, NEVER_KEY) === '1'
      || readStorage(sessionStorage, SESSION_KEY) === '1') return;
    if (fallbackTimer) window.clearTimeout(fallbackTimer);
    previousFocus = document.activeElement;
    wrap.hidden = false;
    document.documentElement.classList.add('pwa-modal-open');
    window.setTimeout(function () {
      const target = wrap.querySelector('[data-pwa-install]:not([hidden]), .pwa-install-x');
      if (target) target.focus();
    }, 0);
  }

  function hideModal (forSession) {
    if (!wrap) return;
    wrap.hidden = true;
    document.documentElement.classList.remove('pwa-modal-open');
    if (forSession) writeStorage(sessionStorage, SESSION_KEY, '1');
    if (previousFocus && previousFocus.focus) previousFocus.focus();
  }

  function readStorage (storage, key) {
    try { return storage.getItem(key); } catch (error) { return null; }
  }

  function writeStorage (storage, key, value) {
    try { storage.setItem(key, value); } catch (error) {}
  }
})();
