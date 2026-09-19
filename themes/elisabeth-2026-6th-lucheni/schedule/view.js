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
      listHTML: themeListHTML
    })
  });
})();
