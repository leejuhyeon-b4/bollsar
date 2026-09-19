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

  window.BollsarScheduleTheme = Object.freeze({
    id: 'elisabeth-2026-6th-lucheni',

    assets: Object.freeze({
      calendarPhoto: 'themes/elisabeth-2026-6th-lucheni/assets/schedule/calendar-photo.jpg',
      leadPhoto: 'themes/elisabeth-2026-6th-lucheni/assets/schedule/lead-photo.jpg'
    }),

    render: Object.freeze({
      viewTabsHTML: themeViewTabsHTML,
      leadHTML: themeLeadHTML,
      entryHTML: themeEntryHTML
    })
  });
})();
