/* bollsar schedule theme
   theme_id: elisabeth-2026-6th-lucheni

   Transitional theme rendering API. */
(() => {
  function themeViewTabsHTML ({ view }) {
    return `<div class="np-vt" role="tablist" aria-label="보기 전환">
      <button type="button" role="tab" data-view="calendar" aria-pressed="${view === 'calendar'}">달력</button>
      <button type="button" role="tab" data-view="list" aria-pressed="${view === 'list'}">목록</button>
    </div>`;
  }

  function themeLeadHTML ({
    p, dday, role, deck,
    WORK, LEAD_PHOTO,
    ACTORS, HONG, dowShort
  }) {
    return `<section class="np-lead">
      <div class="np-lead-text">
        <div class="np-lead-kick">다가오는 회차</div>
        <h2 class="np-lead-ttl">뮤지컬 &lsquo;${WORK.title}&rsquo;${role ? ` ${role} 역` : ''}</h2>
        <p class="np-lead-deck">${deck}</p>
        <div class="np-lead-meta">
          <span class="dday">${dday}</span>
          <span>${p.m}월 ${p.d}일 ${dowShort(p)} · ${p.t}${WORK.venue ? ' · ' + WORK.venue : ''}</span>
        </div>
      </div>
      <figure class="np-lead-fig">
        <div class="np-cut">
          <img src="${LEAD_PHOTO}" alt="${ACTORS[HONG].name} — ${role || '루케니'} 무대컷" loading="lazy">
        </div>
        <figcaption>Luigi Lucheni · ${ACTORS[HONG].name}</figcaption>
      </figure>
    </section>`;
  }

  function themeEntryHTML ({
    p, extra, key, role, went, badges,
    PHOTO, WORK, dowShort
  }) {
    return `<button type="button" class="np-entry${went ? ' went' : ''}${extra ? ' ' + extra : ''}" data-key="${key}">
      <div class="lc"><div class="big">${p.d}</div><div class="sm">${p.m}월 ${dowShort(p)}</div></div>
      <img class="np-entry-photo" src="${PHOTO}" alt="" loading="lazy">
      <div>
        <div class="tags"><em class="cat">뮤지컬 회차</em>${badges}</div>
        <span class="ttl">${WORK.title}${role ? ` — ${role} 역` : ''}</span>
        <span class="place">${WORK.venue || '극장 미정 · 공식 공지 예정'}</span>
      </div>
    </button>`;
  }
  function themeCalendarCellHTML ({
    pad = false,
    cls,
    day,
    times = [],
    eventText = '',
    eventCount = 0,
    PHOTO,
    actorName
  }) {
    if (pad) {
      return `<div class="np-cell pad"></div>`;
    }

    const inner = times.length
      ? `<img class="np-cell-photo" src="${PHOTO}" alt="${actorName}" loading="lazy">
         <span class="np-cell-t">${times.join('·')}</span>
         ${eventCount
           ? `<span class="np-cell-ev">${eventText}${eventCount > 1 ? ' +' + (eventCount - 1) : ''}</span>`
           : ''}`
      : '';

    return `<div class="${cls}" data-day="${day}">
      <span class="n">${day}</span>
      ${inner}
    </div>`;
  }

  function themeEmptyListHTML () {
    return `<div class="np-empty"><div class="h">No upcoming entries.</div><div class="s">새 캐스팅표가 공개되면 반영됩니다</div></div>`;
  }

  function themePastToggleHTML ({
    showPast,
    count,
    rows
  }) {
    return `<button type="button" class="np-past" id="pastToggle">${showPast ? '▲ 지난 회차 접기' : `▼ 지난 회차 ${count}건`}</button>${rows}`;
  }

  function themeListHTML ({
    actorName,
    upcomingCount,
    pastCount,
    rows,
    pastBlock
  }) {
    return `<section>
      <div class="np-listhead">
        <h3>${actorName} 출연 회차</h3>
        <span class="cnt">예정 ${upcomingCount} · 지난 ${pastCount}</span>
      </div>
      <div class="np-sec-body">${rows}${pastBlock}</div>
    </section>`;
  }
  function themeCalendarFrameHTML ({
    lead,
    year,
    month,
    monthEnglish,
    actorName,
    count,
    canPrev,
    canNext,
    dow,
    cells
  }) {
    return `
  ${lead}
  <section>
    <div class="np-month">
      <button type="button" class="js-month" data-step="-1" aria-label="이전 달" ${canPrev ? '' : 'disabled'}>‹</button>
      <div class="m-mid">
        <div class="m-ttl">${monthEnglish} ${year}</div>
        <div class="m-sub">${year}년 ${month}월 · ${actorName} ${count}회차</div>
      </div>
      <button type="button" class="js-month" data-step="1" aria-label="다음 달" ${canNext ? '' : 'disabled'}>›</button>
    </div>
    <div class="np-cal">
      <div class="np-dow">${dow}</div>
      <div class="np-grid">${cells}</div>
    </div>
  </section>

  <section class="np-book">
    <a class="np-book-btn" href="https://ticket.melon.com/performance/index.htm?prodId=213480" target="_blank" rel="noopener">
      <span class="lbl">엘리자벳 예매</span><b>멜론티켓</b>
    </a>
    <a class="np-book-btn" href="https://tickets.interpark.com/goods/26009314" target="_blank" rel="noopener">
      <span class="lbl">엘리자벳 예매</span><b>NOL 티켓</b>
    </a>
  </section>

  <section class="np-links">
    <a class="np-book-btn" href="https://www.instagram.com/bollsar0211" target="_blank" rel="noopener" data-ext="actor-instagram">
      <span class="lbl">배우님 공식</span><b>인스타</b>
    </a>
    <a class="np-book-btn" href="https://cafe.daum.net/Bollsar" target="_blank" rel="noopener" data-ext="actor-fancafe">
      <span class="lbl">배우님 공식</span><b>팬카페</b>
    </a>
    <a class="np-book-btn" href="https://www.instagram.com/emk_musical" target="_blank" rel="noopener" data-ext="emk-instagram">
      <span class="lbl">제작사 EMK</span><b>인스타</b>
    </a>
  </section>`;
  }

  function themeSheetFrameHTML ({
    p,
    dday,
    dowLabel,
    kicker,
    role,
    dayNav,
    rows,
    evHTML,
    hist,
    check,
    workTitle,
    venue
  }) {
    return `
    <div class="np-sheet-head">
      <span>${dowLabel}요일 · ${dday}</span>
      <button type="button" class="np-x js-close" aria-label="닫기">✕</button>
    </div>
    <h3 class="np-sheet-ttl">${p.m}월 ${p.d}일 ${dowLabel}요일의 지면</h3>
    <div class="np-sheet-kicker">${kicker}</div>
    <p class="np-sheet-show">${workTitle}${role ? ` <span>— ${role} 역</span>` : ''}</p>
    <p class="np-sheet-sub">${p.t} 시작${venue ? ' · ' + venue : ''}</p>
    ${dayNav}
    <div class="np-hr"></div>
    <table class="np-cast">
      <caption>이 회차 캐스팅</caption>
      <tbody>${rows}</tbody>
    </table>
    ${evHTML}${hist}${check}`;
  }

  window.BollsarScheduleTheme = Object.freeze({
    id: 'elisabeth-2026-6th-lucheni',

    assets: Object.freeze({
      calendarPhoto: 'themes/elisabeth-2026-6th-lucheni/assets/schedule/calendar-photo.jpg',
      leadPhoto: 'themes/elisabeth-2026-6th-lucheni/assets/schedule/lead-photo.jpg'
    }),

    render: Object.freeze({
      viewTabsHTML: themeViewTabsHTML,
      leadHTML: themeLeadHTML,
      entryHTML: themeEntryHTML,
      calendarCellHTML: themeCalendarCellHTML,
      emptyListHTML: themeEmptyListHTML,
      pastToggleHTML: themePastToggleHTML,
      listHTML: themeListHTML,
      calendarFrameHTML: themeCalendarFrameHTML,
      sheetFrameHTML: themeSheetFrameHTML
    })
  });
})();
