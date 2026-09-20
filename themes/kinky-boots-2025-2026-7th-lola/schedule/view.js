/* bollsar schedule theme
   theme_id: kinky-boots-2025-2026-7th-lola

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
    const roleName =
      role || '\ub864\ub77c';

    return `<section class="np-lead kb-hero">
      <div class="np-lead-text kb-hero-info">
        <div class="kb-match-label">
          IN THIS CORNER
        </div>

        <div class="np-lead-kick">
          \ub2e4\uac00\uc624\ub294 \ud68c\ucc28
        </div>

        <h2 class="np-lead-ttl">
          ${WORK.title}
          <span class="kb-title-dot">\u00b7</span>
          ${roleName}
        </h2>

        <p class="np-lead-deck">
          ${deck}
        </p>

        <div class="np-lead-meta kb-next-meta">
          <span class="dday">${dday}</span>
          <span>
            ${p.m}\uc6d4 ${p.d}\uc77c
            ${dowShort(p)}
            \u00b7 ${p.t}
          </span>
        </div>

        <dl class="kb-facts">
          <div>
            <dt>ROLE</dt>
            <dd>${roleName}</dd>
          </div>

          <div>
            <dt>VENUE</dt>
            <dd>${WORK.venue || '-'}</dd>
          </div>

          <div>
            <dt>RUN</dt>
            <dd>${WORK.run || '-'}</dd>
          </div>
        </dl>
      </div>

      <div
        class="kb-angel-art"
        aria-hidden="true"
      ><img src="${LEAD_PHOTO}" alt="" width="1024" height="1536"></div>
    </section>`;
  }

  function themeEntryHTML ({
    p, extra, key, role, went, badges,
    PHOTO, WORK, dowShort
  }) {
    return `<button
      type="button"
      class="np-entry kb-entry${went ? ' went' : ''}${extra ? ' ' + extra : ''}"
      data-key="${key}"
    >
      <div class="lc">
        <div class="big">${p.d}</div>
        <div class="sm">
          ${p.m}\uc6d4 ${dowShort(p)}
        </div>
      </div>

      <div class="kb-entry-copy">
        <div class="tags">
          <em class="cat">MATCH</em>
          ${badges}
        </div>

        <span class="ttl">
          ${WORK.title}${role ? ` \u00b7 ${role}` : ''}
        </span>

        <span class="place">
          ${WORK.venue || ''}
        </span>
      </div>

      <span class="kb-entry-time">
        ${p.t}
      </span>
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

    const active =
      times.length
        ? ' kb-perf'
        : '';

    const inner =
      times.length
        ? `<span class="kb-cell-mark"></span>
           <span class="np-cell-t">
             ${times.join('\u00b7')}
           </span>
           ${eventCount
             ? `<span class="np-cell-ev">
                  ${eventText}${eventCount > 1
                    ? ' +' + (eventCount - 1)
                    : ''}
                </span>`
             : ''}`
        : '';

    return `<div
      class="${cls}${active}"
      data-day="${day}"
    >
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

      <section class="kb-calendar-section">
        <div class="np-month">
          <button
            type="button"
            class="js-month"
            data-step="-1"
            aria-label="\uc774\uc804 \ub2ec"
            ${canPrev ? '' : 'disabled'}
          >\u2039</button>

          <div class="m-mid">
            <div class="kb-round-label">
              ROUND ${month}
            </div>

            <div class="m-ttl">
              ${monthEnglish} ${year}
            </div>

            <div class="m-sub">
              ${year}\ub144 ${month}\uc6d4
              \u00b7 ${actorName} ${count}\ud68c\ucc28
            </div>
          </div>

          <button
            type="button"
            class="js-month"
            data-step="1"
            aria-label="\ub2e4\uc74c \ub2ec"
            ${canNext ? '' : 'disabled'}
          >\u203a</button>
        </div>

        <div class="np-cal">
          <div class="np-dow">${dow}</div>
          <div class="np-grid">${cells}</div>
        </div>
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
    id: 'kinky-boots-2025-2026-7th-lola',

    assets: Object.freeze({
      calendarPhoto: '',
      leadPhoto: 'themes/kinky-boots-2025-2026-7th-lola/assets/schedule/hero-boot.png'
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
