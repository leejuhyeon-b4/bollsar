/* Kinky Boots — one printed season record. Functional hooks belong to schedule-app.js. */
(() => {
  const KINKY_BELL_COUNTER_ID =
    'kinky-boots-2025-2026-7th-lola';

  let kinkyBellBusy = false;


  function formatKinkyBellCount (value) {
    if (value == null) return '------';
    const n = Number(value);

    if (!Number.isFinite(n)) {
      return '------';
    }

    return String(Math.max(0, Math.trunc(n)))
      .padStart(6, '0');
  }


  function setKinkyBellCount (value) {
    const text =
      formatKinkyBellCount(value);

    document
      .querySelectorAll('[data-kb-bell-count]')
      .forEach(el => {
        el.textContent = text;
      });
  }


  async function syncKinkyBellCounter () {
    if (
      typeof SB === 'undefined' ||
      !SB
    ) {
      setKinkyBellCount(null);
      return;
    }

    const { data, error } =
      await SB
        .from('kinky_bell_counter')
        .select('count')
        .eq('id', KINKY_BELL_COUNTER_ID)
        .maybeSingle();

    if (error || !data) {
      setKinkyBellCount(null);
      return;
    }

    setKinkyBellCount(data.count);
  }


  async function incrementKinkyBellCounter () {
    if (
      typeof SB === 'undefined' ||
      !SB
    ) {
      return;
    }

    const { data, error } =
      await SB.rpc('ring_kinky_bell');

    if (error) {
      console.warn(
        '[bollsar] bell counter:',
        error.message
      );
      return;
    }

    setKinkyBellCount(data);
  }


  function playKinkyBellSound () {
    const AudioContextClass =
      window.AudioContext ||
      window.webkitAudioContext;

    if (!AudioContextClass) return;

    const ctx =
      new AudioContextClass();

    const now =
      ctx.currentTime;

    const master =
      ctx.createGain();

    master.gain.setValueAtTime(
      0.0001,
      now
    );

    master.gain.exponentialRampToValueAtTime(
      0.24,
      now + 0.008
    );

    master.gain.exponentialRampToValueAtTime(
      0.0001,
      now + 1.25
    );

    master.connect(
      ctx.destination
    );

    [
      [690, 'triangle', 1],
      [1035, 'sine', .52],
      [1380, 'sine', .24]
    ].forEach(
      ([frequency, type, volume]) => {
        const osc =
          ctx.createOscillator();

        const gain =
          ctx.createGain();

        osc.type =
          type;

        osc.frequency.setValueAtTime(
          frequency,
          now
        );

        gain.gain.setValueAtTime(
          volume,
          now
        );

        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          now + 1.18
        );

        osc.connect(gain);
        gain.connect(master);

        osc.start(now);
        osc.stop(now + 1.25);
      }
    );

    window.setTimeout(
      () => ctx.close(),
      1400
    );
  }


  document.addEventListener(
    'click',
    async event => {
      const target =
        event.target;

      if (
        !(target instanceof Element)
      ) return;

      const button =
        target.closest(
          '[data-kb-bell]'
        );

      if (!button) return;

      playKinkyBellSound();

      if (kinkyBellBusy) return;

      kinkyBellBusy = true;
      button.disabled = true;

      try {
        await incrementKinkyBellCounter();
      } finally {
        window.setTimeout(
          () => {
            kinkyBellBusy = false;
            button.disabled = false;
          },
          650
        );
      }
    }
  );



  const ASSETS = 'themes/kinky-boots-2025-2026-7th-lola/assets/scheduletab/';
  function pageHTML({tabs,lead,content}) {
    return `<section class="kb-top-layout"><div class="kb-top-left">${tabs}${lead}</div><aside class="kb-empty-frame" role="region" aria-label="롤라 3D 모델, 좌우로 드래그하거나 방향키로 회전"><span class="kb-lola-hint">↻ 드래그해서 돌려보세요</span><span class="kb-lola-fallback" role="status">3D 모델을 불러오지 못했습니다.</span></aside></section>${content}`;
  }
  function viewTabsHTML({view}) {
    return `<div class="kb-view-rail"><div class="np-vt" role="tablist" aria-label="보기 전환">
      ${[['calendar','달력'],['list','목록']].map(([value,label]) => `<button type="button" role="tab" data-view="${value}" aria-selected="${view === value}" aria-pressed="${view === value}">${label}</button>`).join('')}
    </div></div>`;
  }
  function leadHTML({p, WORK, role, deck, ended, dowShort}) {
    window.setTimeout(syncKinkyBellCounter, 0);
    return `<section class="kb-main-event" aria-label="공연 기록">
      <article class="kb-main-copy">
        <header class="kb-event-head"><h2>★ MAIN EVENT ★</h2><span>KINKY BOOTS<br>SEASON RECORD</span></header>
        <h1 class="kb-show-title">KINKY BOOTS — LOLA</h1>
        <blockquote class="kb-quote"><span>한번은 너무 중요한 시합날<br>왠지 내가 이길 것 같더라?<br>그래서 시상식 드레스 입고 갔어. 등 파인 거. 띠뚜루.</span></blockquote>
        <table class="kb-record"><tbody>
          <tr><th>PLACE</th><td>${WORK.venue || ''}</td></tr>
          <tr><th>PERIOD</th><td>${WORK.period.start.replaceAll('-','. ')} — ${WORK.period.end.replaceAll('-','. ')}</td></tr>
          <tr><th>${ended ? 'LAST ROUND' : 'NEXT ROUND'}</th><td>${p.y}. ${p.m}. ${p.d} (${dowShort(p)}) · ${p.t}</td></tr>
          <tr><th>ROLE / RUN</th><td>${role} · ${WORK.run} · 강홍석</td></tr>
        </tbody></table>
        <div class="kb-record-foot"><p>${deck}</p><div class="kb-bell"><button type="button" data-kb-bell aria-label="복싱 벨 울리기"><span>RING</span></button><output data-kb-bell-count aria-label="벨 누적 횟수">------</output></div></div>
      </article>
    </section>`;
  }
  function calendarCellHTML({pad=false,cls='',day,times=[],hasOtherPerf=false,PHOTO='',actorName='',eventText='',eventCount=0}) {
    if(pad) return '<div class="np-cell pad"></div>';
    const hong=times.length>0, perf=hong||hasOtherPerf;
    return `<div class="${cls} ${hong?'is-hong':hasOtherPerf?'is-other':''}" data-day="${day}" ${hong ? `role="button" tabindex="0" aria-label="${day}일 ${times.join(', ')} ${actorName} 회차 상세"` : ''}>
      <span class="n">${day}</span>
      ${perf ? `<img class="kb-box" src="${ASSETS}price-${hong?'simon-box-vivid':'son-box'}.png" alt="PRICE &amp; ${hong?'SIMON':'SON'}" decoding="async">` : ''}
      ${hong ? `<div class="kb-perf-meta"><span class="kb-times">${times.map(time=>`<span>${time}</span>`).join('')}</span>${PHOTO ? `<img class="kb-actor" src="${PHOTO}" alt="${actorName}">` : ''}</div>` : ''}
      ${eventCount ? `<div class="kb-event-label">${eventText}${eventCount>1?` +${eventCount-1}`:''}</div>` : ''}
    </div>`;
  }
  function calendarFrameHTML({lead,year,month,monthEnglish,canPrev,canNext,dow,cells}) {
    return `${lead}<section class="kb-calendar-section" aria-label="${year}년 ${month}월 달력">
      <div class="np-month"><button type="button" class="js-month" data-step="-1" aria-label="이전 달" ${canPrev?'':'disabled'}>‹</button>
      <h2 class="m-ttl"><span>★</span> ${monthEnglish.toUpperCase()} ${year} <span>★</span></h2>
      <button type="button" class="js-month" data-step="1" aria-label="다음 달" ${canNext?'':'disabled'}>›</button></div>
      <div class="np-cal"><div class="np-dow">${dow}</div><div class="np-grid">${cells}</div></div>
      <div class="kb-print-details" aria-hidden="true"><span class="kb-watermark">Kinky<span>BOOTS</span></span><span class="kb-print-motto">The Most Beautiful Thing<br>in the World.</span></div>
      <div class="kb-colophon">★ &nbsp; SHOES CHANGE LIVES &nbsp; ★</div>
    </section>`;
  }
  function entryHTML({p,extra,key,role,went,badges,WORK,dowShort}) {
    return `<button type="button" class="np-entry kb-entry${went?' went':''}${extra?' '+extra:''}" data-key="${key}">
      <span class="lc"><span class="big">${p.d}</span><span class="sm">${p.y}.${p.m} · ${dowShort(p)}</span></span>
      <span class="kb-entry-copy"><span class="tags"><em class="cat">ROUND RECORD</em>${badges}</span><span class="ttl">${WORK.title} — ${role}</span><span class="place">${WORK.venue}</span></span>
      <span class="kb-entry-time">${p.t}</span></button>`;
  }
  function listHTML({actorName,upcomingCount,pastCount,rows,pastBlock,ended=false}) {
    return `<section class="kb-list"><header class="np-listhead"><h2>★ SEASON RECORD ★</h2><p>${actorName} ${ended?'지난 회차':'출연 회차'}</p>${ended?'':`<span class="cnt">예정 ${upcomingCount} · 지난 ${pastCount}</span>`}</header><div class="np-sec-body">${rows}${ended?'':pastBlock}</div></section>`;
  }
  function emptyListHTML(){return '<div class="np-empty">예정된 회차가 없습니다.</div>';}
  function pastToggleHTML({showPast,count,rows}) {return `<button type="button" class="np-past" id="pastToggle">${showPast?'▲ 지난 회차 접기':`▼ 지난 회차 ${count}건`}</button>${rows}`;}
  function sheetFrameHTML({p,dday,dowLabel,kicker,role,dayNav,rows,evHTML,hist,check,workTitle,venue}) {
    return `<article class="kb-bout-card">
      <header class="kb-bout-head"><div><div class="kb-bout-label">★ OFFICIAL ROUND CARD ★</div><h2 class="np-sheet-ttl">${p.y}. ${p.m}. ${p.d} <span>${dowLabel}요일</span></h2><p>${workTitle} — ${role || ''}</p></div><button type="button" class="np-x js-close" aria-label="닫기">×</button></header>
      <table class="kb-record kb-bout-meta"><tbody><tr><th>TIME</th><td>${p.t}</td><th>STATUS</th><td>${dday}</td></tr><tr><th>PLACE</th><td colspan="3">${venue}</td></tr><tr><th>ROLE</th><td colspan="3">${role || '출연'}</td></tr></tbody></table>
      ${dayNav}<div class="np-sheet-kicker">${kicker}</div>
      <table class="np-cast"><caption>CASTING / 출연진</caption><tbody>${rows}</tbody></table>
      <section class="kb-bout-events"><h3>SPECIAL EVENT</h3>${evHTML}${(p.events || []).filter(e => e.description).map(e => `<p class="kb-bout-event-description">${String(e.description).replace(/[&<>]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[ch]))}</p>`).join("")}</section>
      ${hist?`<section class="kb-bout-history"><h3>CHANGE RECORD</h3>${hist}</section>`:''}
      ${check}<footer class="kb-bout-footer">KINKY BOOTS · SEASON RECORD</footer>
    </article>`;
  }
  document.addEventListener('keydown',event=>{
    if((event.key==='Enter'||event.key===' ') && event.target.matches('.np-cell[role="button"]')) {event.preventDefault();event.target.click();}
  });
  document.querySelector('.np-wordmark').textContent='';
  document.querySelector('.np-mast-slug').textContent='KINKY BOOTS · LOLA · SEASON RECORD';
  document.title='볼살씨 — 킹키부츠 롤라 스케줄';
  window.BollsarScheduleTheme=Object.freeze({
    id:'kinky-boots-2025-2026-7th-lola',
    assets:Object.freeze({calendarPhoto:'',leadPhoto:''}),
    render:Object.freeze({pageHTML,viewTabsHTML,leadHTML,entryHTML,calendarCellHTML,emptyListHTML,pastToggleHTML,listHTML,calendarFrameHTML,sheetFrameHTML})
  });

})();

/* === KINKY TARGETED V8 START === */
;(() => {
  'use strict';

  const STAMP_HTML =
    'KINKY BOOTS<br>' +
    'NORTHAMPTON · ENGLAND<br>' +
    '<b>SEASON RECORD</b><br>' +
    '★ EST. 1890 ★';


  function applyKinkyV8() {

    /*
     * 오른쪽 드레스 frame에 stamp 하나만.
     * 중앙 원본은 renderer에서 이미 삭제됨.
     */
    const frame =
      document.querySelector(
        '.kb-empty-frame'
      );


    if (frame) {

      frame
        .querySelectorAll(
          ':scope > .kb-record-stamp'
        )
        .forEach((el, index) => {
          if (index > 0) {
            el.remove();
          }
        });


      if (
        !frame.querySelector(
          ':scope > .kb-record-stamp'
        )
      ) {

        const stamp =
          document.createElement(
            'span'
          );

        stamp.className =
          'kb-record-stamp';

        stamp.innerHTML =
          STAMP_HTML;

        stamp.setAttribute(
          'aria-hidden',
          'true'
        );

        frame.appendChild(
          stamp
        );
      }
    }



  }


  let queued =
    false;


  const queueApply =
    () => {

      if (queued) {
        return;
      }


      queued =
        true;


      requestAnimationFrame(
        () => {

          queued =
            false;

          applyKinkyV8();
        }
      );
    };


  if (
    document.readyState ===
    'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      applyKinkyV8,
      {
        once:true
      }
    );

  } else {

    applyKinkyV8();
  }


  new MutationObserver(
    queueApply
  )
  .observe(
    document.body,
    {
      childList:true,
      subtree:true
    }
  );

})();
 /* === KINKY TARGETED V8 END === */

/* === LOLA CIRCLE PHOTO V3 START === */
;(() => {
  'use strict';

  const PHOTO =
    'themes/kinky-boots-2025-2026-7th-lola/assets/boots/강홍석.jpg';

  function applyLolaCircleV3() {

    document
      .querySelectorAll('.np-cell[data-day]')
      .forEach(cell => {

        const times =
          cell.querySelector(
            '.kb-times'
          );

        const hasHongPerformance =
          !!times &&
          String(
            times.textContent || ''
          ).trim() !== '';

        let actor =
          cell.querySelector(
            '.kb-actor'
          );

        /*
         * 강홍석 회차가 아니면
         * 우리가 만든 사진만 제거.
         */
        if (!hasHongPerformance) {

          const ours =
            cell.querySelector(
              '.kb-actor[data-lola-photo-v3]'
            );

          if (ours) {
            ours.remove();
          }

          return;
        }


        /*
         * 기존 actor가 없으면 새로 생성.
         */
        if (!actor) {

          actor =
            document.createElement(
              'span'
            );

          actor.className =
            'kb-actor kb-lola-circle-v3';

          actor.setAttribute(
            'data-lola-photo-v3',
            '1'
          );

          const img =
            document.createElement(
              'img'
            );

          img.alt =
            '강홍석';

          img.src =
            PHOTO;

          actor.appendChild(
            img
          );


          /*
           * 날짜 바로 뒤에 삽입.
           */
          const day =
            cell.querySelector(
              '.n'
            );

          if (day) {

            day.insertAdjacentElement(
              'afterend',
              actor
            );

          } else {

            cell.prepend(
              actor
            );
          }

        } else {

          actor.classList.add(
            'kb-lola-circle-v3'
          );


          let img =
            actor.querySelector(
              'img'
            );


          if (!img) {

            actor.textContent =
              '';

            img =
              document.createElement(
                'img'
              );

            img.alt =
              '강홍석';

            actor.appendChild(
              img
            );
          }


          if (
            img.getAttribute('src')
            !== PHOTO
          ) {

            img.src =
              PHOTO;

            img.removeAttribute(
              'srcset'
            );
          }
        }
      });
  }


  let queued =
    false;


  function queueLolaCircleV3() {

    if (queued) {
      return;
    }

    queued =
      true;

    requestAnimationFrame(
      () => {

        queued =
          false;

        applyLolaCircleV3();
      }
    );
  }


  if (
    document.readyState ===
    'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      applyLolaCircleV3,
      {
        once:true
      }
    );

  } else {

    applyLolaCircleV3();
  }


  /*
   * 월 이동/달력 재렌더 때만 대응.
   */
  const observer =
    new MutationObserver(
      queueLolaCircleV3
    );

  observer.observe(
    document.body,
    {
      childList:true,
      subtree:true
    }
  );

})();
 /* === LOLA CIRCLE PHOTO V3 END === */

/* === LOLA LIST PHOTO V16 START === */
;(() => {
  'use strict';

  const PHOTO = 'themes/kinky-boots-2025-2026-7th-lola/assets/boots/강홍석.jpg';

  function applyListPhotoV16() {
    document
      .querySelectorAll('.np-entry.kb-entry')
      .forEach(entry => {
        const title = entry.querySelector('.ttl');
        if (!title) return;

        /* 이전 날짜 영역용 클래스 제거 */
        entry
          .querySelectorAll('.kb-list-date-v10')
          .forEach(el => el.classList.remove('kb-list-date-v10'));

        /* 이전 사진 제거 */
        entry
          .querySelectorAll('.kb-list-actor-v10')
          .forEach(el => el.remove());

        let row = entry.querySelector('.kb-list-title-row-v16');

        if (!row) {
          row = document.createElement('div');
          row.className = 'kb-list-title-row-v16';

          title.parentNode.insertBefore(row, title);
          row.appendChild(title);
        } else if (title.parentNode !== row) {
          row.insertBefore(title, row.firstChild);
        }

        if (!row.querySelector('.kb-list-actor-v16')) {
          const actor = document.createElement('span');
          actor.className = 'kb-list-actor-v16';

          const img = document.createElement('img');
          img.src = PHOTO;
          img.alt = '강홍석';

          actor.appendChild(img);
          row.appendChild(actor);
        }
      });
  }

  let queued = false;

  function queue() {
    if (queued) return;

    queued = true;

    requestAnimationFrame(() => {
      queued = false;
      applyListPhotoV16();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      applyListPhotoV16,
      { once:true }
    );
  } else {
    applyListPhotoV16();
  }

  new MutationObserver(queue).observe(
    document.body,
    {
      childList:true,
      subtree:true
    }
  );
})();
/* === LOLA LIST PHOTO V16 END === */

/* === KINKY HEADER OFFSET V18 START === */
;(() => {
  function markThemeControlV18() {
    const controls = [
      ...document.querySelectorAll(
        '.np-mast button, .np-mast a, .np-mast select'
      )
    ];

    const target = controls.find(el => {
      if (el.id === 'loginBtn') return false;

      const text =
        el.tagName === 'SELECT'
          ? [...el.options].map(o => o.textContent).join(' ')
          : el.textContent || '';

      return /루케니|킹키|6연|7연/.test(text);
    });

    if (!target) return false;

    target.classList.add('kb-theme-offset-v18');
    return true;
  }

  if (!markThemeControlV18()) {
    const obs = new MutationObserver(() => {
      if (markThemeControlV18()) obs.disconnect();
    });

    obs.observe(document.body,{
      childList:true,
      subtree:true
    });
  }
})();
/* === KINKY HEADER OFFSET V18 END === */
