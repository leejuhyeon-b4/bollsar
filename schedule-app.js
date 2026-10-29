
/* ═══════════════════════════════════════════════════════════
   모션 — GSAP 3.15 (settlement.html과 같은 값)
   ═══════════════════════════════════════════════════════════ */
const $$ = s => document.querySelectorAll(s);
const mq = q => !!(window.matchMedia && window.matchMedia(q).matches);
const MOTION = typeof gsap !== 'undefined' && !mq('(prefers-reduced-motion: reduce)');

if (!MOTION) console.warn('[볼살씨] 모션 꺼짐 — ' + (typeof gsap === 'undefined'
  ? 'GSAP을 불러오지 못했습니다 (CDN 차단 · 오프라인)'
  : '브라우저가 prefers-reduced-motion: reduce 를 요청했습니다'));

const EASE = { out:'expo.out', in:'power2.out', pop:'back.out(1.5)' };
if (MOTION) gsap.defaults({ ease:EASE.out, duration:.36 });

const MONTH_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WD_NAME = ['일','월','화','수','목','금','토'];   // getDay() 인덱스용
const WD = ['월','화','수','목','금','토','일']; // 달력 표시 순서 — 월요일 시작
const wcol = d => (d + 6) % 7; // getDay() → 달력 열 위치 (0=월 … 6=일)
const dowShort = p => WD_NAME[new Date(p.y, p.m - 1, p.d).getDay()];

/* ═══════════════════════════════════════════════════════════
   상태
   ═══════════════════════════════════════════════════════════ */
let view = 'calendar';                 // 'calendar' | 'list' — 달력형이 이 탭의 중심
const todayMonthIndex = TODAY.y * 12 + TODAY.m;
const rangeMinIndex = RANGE.min.y * 12 + RANGE.min.m;
const rangeMaxIndex = Math.max(idx(RANGE.max), ...specialEventsForActiveProduction().map(idx));

let ym =
  todayMonthIndex >= rangeMinIndex &&
  todayMonthIndex <= rangeMaxIndex
    ? { y:TODAY.y, m:TODAY.m }
    : { ...RANGE.min };
let showPast = false;                   // 목록형에서 지난 회차 펼침 여부
let sheetKey = null;                    // 열린 상세 시트의 perfKey
/* 로그인 상태는 Supabase 세션이 결정한다 (data.js mountAuth). 시작은 로그아웃. */
let loggedIn = false;
let skipAnim = false;
let gridFrom = 'start';

const inMonth = p => p.y === ym.y && p.m === ym.m;
const monthPerfs = () => hongPerfs().filter(inMonth).sort(cmpPerf);

/* 달력 셀 안에 넣는 배우 사진 (강홍석 · 엘리자벳 루케니 공식 프로필).
   관리자 업로드 사진으로 교체 시 이 경로만 바꾸면 된다 (PRD_v3 3.1 / 3.2). */
const SCHEDULE_THEME = window.BollsarScheduleTheme;

if (
  !SCHEDULE_THEME ||
  !SCHEDULE_THEME.assets ||
  !SCHEDULE_THEME.render
) {
  throw new Error('Schedule theme is not loaded');
}

const SCHEDULE_VIEW = SCHEDULE_THEME.render;
const PHOTO = SCHEDULE_THEME.assets.calendarPhoto;
const SPECIAL_CALENDAR_PHOTO = SCHEDULE_THEME.assets.specialCalendarPhoto || PHOTO;

/* 헤드라인 옆 컷 사진 — 루케니 무대컷. 송곳 실루엣이 이 위를 뚫고 지나간다. */
const LEAD_PHOTO = SCHEDULE_THEME.assets.leadPhoto;

/* ═══════════════════════════════════════════════════════════
   렌더
   ═══════════════════════════════════════════════════════════ */
function render () {
  document.body.classList.toggle('logged-in', loggedIn);
  $('#loginBtn').textContent = loggedIn ? '로그아웃' : '로그인';
  const tabs = viewTabsHTML();
  const content = view === 'calendar' ? calendarHTML() : listHTML();
  $('#wrap').innerHTML = SCHEDULE_VIEW.pageHTML
    ? SCHEDULE_VIEW.pageHTML({ tabs, lead: leadHTML(), content })
    : tabs + content;
  bind();
  animateBody();
}

function viewTabsHTML () {
  return SCHEDULE_VIEW.viewTabsHTML({ view });
}

/* ── 다가오는 회차 (지면 헤드라인) ── */
function leadHTML () {
  const up = hongPerfs().filter(p => !isPast(p)).sort(cmpPerf);
  const ended = up.length === 0;
  const p = up[0] || hongPerfs().sort(cmpPerf).slice(-1)[0];
  if (!p) return '';
  const diff = Math.round((new Date(p.y, p.m - 1, p.d) - new Date(TODAY.y, TODAY.m - 1, TODAY.d)) / 86400000);
  const dday = diff === 0 ? 'D-DAY' : diff > 0 ? 'D-' + diff : 'D+' + Math.abs(diff);
  const special = p.special === true;
  const role = special ? '' : (hongRole(p) || {}).name || '';

  let deck;
  if (special) deck = `${p.castLabel || ACTORS[HONG].name + ' 외'} 출연 예정입니다.`;
  else if ((p.events || []).length) deck = `${p.events.map(e => e.label).join(' · ')} 등 회차 이벤트가 예정돼 있습니다.`;
  else if (p.history) deck = `직전 캐스팅 변경이 반영된 회차입니다.`;
  else deck = `${ACTORS[HONG].name} 배우의 출연이 예정된 회차입니다.`;

  /* KINKY_ENDED_DECK_V8 */
  if (ended) {
    deck = `${ACTORS[HONG].name} \ubc30\uc6b0\uc758 \ub9c8\uc9c0\ub9c9 \ucd9c\uc5f0 \ud68c\ucc28\uc785\ub2c8\ub2e4.`;
  }

  return SCHEDULE_VIEW.leadHTML({
    p,
    dday,
    role,
    deck,
    ended,
    WORK,
    LEAD_PHOTO,
    ACTORS,
    HONG,
    dowShort,
    special,
    displayTitle: special ? p.title : WORK.title,
    displayVenue: (p.venue || WORK.venue || '')
  });
}

/* ── 지면 기사 한 줄 (목록형) ── */
function entryHTML (p, extra) {
  const key = perfKey(p);
  const special = p.special === true;
  const role = special ? '' : (hongRole(p) || {}).name || '';
  const went = !special && loggedIn && !!recordFor(p);

  const badges = [
    ...(p.events || []).map(e => `<em class="np-mini${e.verified ? '' : ' unv'}">${e.label}${e.verified ? '' : ' · 미검증'}</em>`),
    p.history ? `<em class="np-mini hist">캐스팅 변경</em>` : '',
    went ? `<em class="np-mini went">✓ 담음</em>` : ''
  ].filter(Boolean).join('');

  return SCHEDULE_VIEW.entryHTML({
    p,
    extra,
    key,
    role,
    went,
    badges,
    PHOTO: special ? SPECIAL_CALENDAR_PHOTO : PHOTO,
    WORK,
    dowShort,
    special,
    displayTitle: special ? p.title : WORK.title,
    displayVenue: (p.venue || WORK.venue || '')
  });
}

/* ═══ 달력형 ═══ */
function calendarHTML () {
  const list = monthPerfs();
  const byDay = {};
  list.forEach(p => (byDay[p.d] = byDay[p.d] || []).push(p));

  const first = wcol(firstDow(ym.y, ym.m));   // 월요일 시작 기준 앞 여백
  const dim = daysIn(ym.y, ym.m);
  const totalCells = Math.ceil((first + dim) / 7) * 7;

  let cells = '';
  for (let i = 0; i < totalCells; i++) {
    const day = i - first + 1;
    if (day < 1 || day > dim) {
      cells += SCHEDULE_VIEW.calendarCellHTML({
        pad: true
      });
      continue;
    }
    const dItems = (byDay[day] || []).sort((a, b) => a.t.localeCompare(b.t));
    const isToday = ym.y === TODAY.y && ym.m === TODAY.m && day === TODAY.d;
    const isSun = (i % 7) === 6;   // 일요일 = 마지막 열
    const dWent = loggedIn && dItems.some(p => !p.special && recordFor(p));   // 담은 회차가 있는 날
    const cls = ['np-cell', isToday ? 'today' : '', isSun ? 'sun' : '', dWent ? 'went' : ''].join(' ').replace(/\s+/g, ' ').trim();
    const dEvents = dItems.flatMap(p => p.events || []);
    const eventLabel = dEvents[0]?.label || '';
    const eventText = (dEvents.some(e => e.label === '막공') && dEvents.some(e => e.label === '무대인사'))
    ? '막공/무인'
    : eventLabel === '커튼콜데이'
      ? '<span class="full">커튼콜데이</span><span class="short">커튼콜</span>'
      : eventLabel === '오리지널 티켓 증정' ? '오리지널 티켓' : eventLabel === '아코디언 엽서 증정' ? '엽서' : eventLabel;
    cells += SCHEDULE_VIEW.calendarCellHTML({
      cls,
      day,
      items: dItems,
      times: dItems.map(p => p.t),
      eventText,
      eventCount: dEvents.length - (dEvents.some(e => e.label === '막공') && dEvents.some(e => e.label === '무대인사') ? 1 : 0),
      hasOtherPerf: dItems.length === 0 && PERFS.some(p => p.y === ym.y && p.m === ym.m && p.d === day),
      PHOTO: dItems.some(p => p.special) ? SPECIAL_CALENDAR_PHOTO : PHOTO,
      actorName: ACTORS[HONG].name
    });
  }

  const dow = WD.map((w, i) => `<div class="${i === 6 ? 'sun' : ''}">${w}</div>`).join('');

  return SCHEDULE_VIEW.calendarFrameHTML({
    lead: SCHEDULE_VIEW.pageHTML ? '' : leadHTML(),
    year: ym.y,
    month: ym.m,
    monthEnglish: MONTH_EN[ym.m - 1],
    actorName: ACTORS[HONG].name,
    count: list.length,
    canPrev: idx(ym) > idx(RANGE.min),
    canNext: idx(ym) < rangeMaxIndex,
    dow,
    cells
  });
}

/* ═══ 목록형 ═══ */
function listHTML () {
  const all = hongPerfs().sort(cmpPerf);
  const upcoming = all.filter(p => !isPast(p));
  const past = all.filter(p => isPast(p));

  const ended =
    upcoming.length === 0 &&
    past.length > 0;

  /*
   * ??? ?? ?? ???
   * ? ?? ?? / ??? / ?? ?? ??? ??? ???.
   * ?? ??? ?? ?? ????.
   */
  if (ended) {
    return SCHEDULE_VIEW.listHTML({
      actorName: ACTORS[HONG].name,
      upcomingCount: 0,
      pastCount: past.length,
      rows: past
        .map(p => entryHTML(p, 'past'))
        .join(''),
      pastBlock: '',
      ended: true
    });
  }

  const rows = upcoming.length
    ? upcoming.map(p => entryHTML(p)).join('')
    : SCHEDULE_VIEW.emptyListHTML();

  const pastRows = showPast
    ? past.map(p => entryHTML(p, 'past')).join('')
    : '';

  const pastBlock = past.length
    ? SCHEDULE_VIEW.pastToggleHTML({
        showPast,
        count: past.length,
        rows: pastRows
      })
    : '';

  return SCHEDULE_VIEW.listHTML({
    actorName: ACTORS[HONG].name,
    upcomingCount: upcoming.length,
    pastCount: past.length,
    rows,
    pastBlock,
    ended: false
  });
}

/* ═══════════════════════════════════════════════════════════
   회차 상세 (하단 시트)
   ═══════════════════════════════════════════════════════════ */
function sheetHTML (p) {
  const diff = Math.round((new Date(p.y, p.m - 1, p.d) - new Date(TODAY.y, TODAY.m - 1, TODAY.d)) / 86400000);
  const dday = diff === 0 ? 'D-DAY' : diff > 0 ? 'D-' + diff : 'D+' + Math.abs(diff);
  const special = p.special === true;

  const sameDay = hongPerfs().filter(q => q.y === p.y && q.m === p.m && q.d === p.d).sort(cmpPerf);
  const dayNav = sameDay.length > 1
    ? `<div class="np-sheet-switch">${sameDay.map(q => {
        const k = perfKey(q);
        return `<button type="button" class="np-sw js-sw${k === perfKey(p) ? ' on' : ''}" data-key="${k}">${q.t}</button>`;
      }).join('')}</div>`
    : '';

  const role = special ? '' : (hongRole(p) || {}).name || '';
  const went = !special && loggedIn && !!recordFor(p);
  const kicker = [
    special ? '<em class="cat">어트랙션</em>' : '<em class="cat">뮤지컬 회차</em>',
    p.history ? '<em class="np-mini hist">캐스팅 변경</em>' : '',
    went ? '<em class="np-mini went">✓ 담음</em>' : ''
  ].filter(Boolean).join('');

  const rows = special
    ? `<tr><th>출연</th><td><span class="on">${p.castLabel || '강홍석 외'}</span></td></tr>`
    : ROLES.map(r => {
    const a = p.cast[r.id];
    if (!a) return '';
    const alts = r.actors.filter(x => x !== a);
    const altHTML = alts.length ? `<span class="alt">${alts.map(actorName).join(' · ')}</span>` : '';
    return `<tr><th>${r.name}</th><td><span class="on">${actorName(a)}</span>${altHTML}</td></tr>`;
  }).join('');

  const events = p.events || [];
  const evHTML = events.length
    ? `<div class="np-badges">${events.map(e => `<span class="np-badge${e.verified ? '' : ' unv'}">${e.label}${e.verified ? '' : ' · 미검증'}</span>`).join('')}</div>`
    : `<p class="np-noev">이벤트 정보 없음</p>`;

  const hist = p.history
    ? `<div class="np-hist"><b>캐스팅 변경</b>${p.history.role} 역 ${p.history.from} → ${p.history.to}
        <span>${p.history.when} 반영 · 예정 캐스팅은 이력에 보관됩니다</span></div>`
    : '';

  const rec = special ? null : recordFor(p);
  const check = special
    ? `<div class="np-check">
        <a class="np-btn solid"
           href="${p.detailUrl}"
           target="_blank"
           rel="noopener noreferrer">전체 캐스트 &amp; 상세정보</a>
      </div>`
    : loggedIn
    ? `<div class="np-check">
        <button type="button" class="np-btn ${rec ? 'solid' : ''} js-check" aria-pressed="${!!rec}">${rec ? '✓ 이 회차 담음' : '이 회차 담기'}</button>
        ${rec ? '' : `<span class="hint">눌러서 관극 기록을 남기세요</span>`}
      </div>
      ${rec ? seatSelectHTML(rec, p) : ''}`
    : `<div class="np-check">
        <button type="button" class="np-btn ghost" disabled>이 회차 담기</button>
        <span class="hint">로그인하면 관극 기록과 좌석을 남길 수 있습니다</span>
      </div>`;

  return SCHEDULE_VIEW.sheetFrameHTML({
    p,
    dday,
    dowLabel: dowShort(p),
    kicker,
    role,
    dayNav,
    rows,
    evHTML,
    hist,
    check,
    workTitle: special ? p.title : WORK.title,
    venue: (p.venue || WORK.venue || '')
  });
}

function openSheet (p) {
  const wasOpen = !$('#sheet').hidden;   // 재바인딩(회차 전환·체크 갱신)이면 등장 애니메이션 생략
  sheetKey = perfKey(p);
  const wrap = $('#sheet');
  const body = $('#sheetBody');
  body.innerHTML = sheetHTML(p);
  wrap.hidden = false;

  body.querySelector('.js-close').addEventListener('click', closeSheet);
  body.querySelectorAll('.js-sw').forEach(b => b.addEventListener('click', () => {
    const np = perfFromKey(b.dataset.key);
    if (np) openSheet(np);          // 같은 날 다른 회차로 전환
  }));
  const c = body.querySelector('.js-check');
  if (c) c.addEventListener('click', () => {
    toggleCheck(p);
    const np = perfFromKey(sheetKey);
    if (np) openSheet(np);          // 시트 안 체크 상태 갱신
  });
  const tourSave = body.querySelector('.js-tour-save');
  if (tourSave) {
    const floorEl = body.querySelector('.js-tour-floor');
    const zoneEl = body.querySelector('.js-tour-zone');
    const meta = TOUR_SEAT_VENUES[p.venue || WORK.venue];

    if (meta.code === 'GOY') {
      floorEl.addEventListener('change', () => {
        const zones = floorEl.value === '1'
          ? ['A','B','C','OP'] : ['A','B','C'];
        zoneEl.innerHTML = zones.map(z =>
          `<option value="${z}">${z}</option>`
        ).join('');
      });
    }

    if (meta.code === 'SNM') {
      const rowEl = body.querySelector('.js-tour-row');
      const noEl = body.querySelector('.js-tour-no');

      const fill = (el, values, suffix = '') => {
        el.innerHTML = values.map(v =>
          `<option value="${v}">${v}${suffix}</option>`
        ).join('');
      };

      floorEl.addEventListener('change', () => {
        fill(zoneEl, snmZones(floorEl.value));
        fill(rowEl, snmRows(floorEl.value, zoneEl.value), '열');
        fill(noEl, snmSeatNumbers(floorEl.value, zoneEl.value, rowEl.value), '번');
      });

      zoneEl.addEventListener('change', () => {
        fill(rowEl, snmRows(floorEl.value, zoneEl.value), '열');
        fill(noEl, snmSeatNumbers(floorEl.value, zoneEl.value, rowEl.value), '번');
      });

      rowEl.addEventListener('change', () => {
        fill(noEl, snmSeatNumbers(floorEl.value, zoneEl.value, rowEl.value), '번');
      });
    }
    if (meta.code === 'YSU') {
      const rowEl = body.querySelector('.js-tour-row');
      const noEl = body.querySelector('.js-tour-no');

      const fill = (el, values, suffix = '') => {
        el.innerHTML = values.map(v =>
          `<option value="${v}">${v}${suffix}</option>`
        ).join('');
      };

      floorEl.addEventListener('change', () => {
        const zones = ysuZones(floorEl.value);

        fill(zoneEl, zones);

        const rows = ysuRows(
          floorEl.value,
          zoneEl.value
        );

        fill(rowEl, rows, '열');

        fill(
          noEl,
          ysuSeatNumbers(
            floorEl.value,
            zoneEl.value,
            rowEl.value
          ),
          '번'
        );
      });

      zoneEl.addEventListener('change', () => {
        const rows = ysuRows(
          floorEl.value,
          zoneEl.value
        );

        fill(rowEl, rows, '열');

        fill(
          noEl,
          ysuSeatNumbers(
            floorEl.value,
            zoneEl.value,
            rowEl.value
          ),
          '번'
        );
      });

      rowEl.addEventListener('change', () => {
        fill(
          noEl,
          ysuSeatNumbers(
            floorEl.value,
            zoneEl.value,
            rowEl.value
          ),
          '번'
        );
      });
    }
    if (meta.code === 'JJO') {
      const noEl = body.querySelector('.js-tour-no');

      const refreshNumbers = () => {
        const numbers = jjoSeatNumbers(floorEl.value, zoneEl.value);
        noEl.innerHTML = numbers.map(n =>
          `<option value="${n}">${n}번</option>`
        ).join('');
      };

      floorEl.addEventListener('change', refreshNumbers);
      zoneEl.addEventListener('change', refreshNumbers);
    }
    if (meta.code === 'YIN') {
      const rowEl = body.querySelector('.js-tour-row');
      const noEl = body.querySelector('.js-tour-no');

      const fill = (el, values, suffix = '') => {
        el.innerHTML = values.map(v =>
          `<option value="${v}">${v}${suffix}</option>`
        ).join('');
      };

      const refreshNumber = () => {
        fill(
          noEl,
          yinSeatNumbers(
            floorEl.value,
            zoneEl.value,
            rowEl.value
          ),
          '번'
        );
      };

      const refreshRows = () => {
        fill(
          rowEl,
          yinRows(floorEl.value, zoneEl.value),
          '열'
        );
        refreshNumber();
      };

      floorEl.addEventListener('change', () => {
        fill(zoneEl, yinZones(floorEl.value));
        refreshRows();
      });

      zoneEl.addEventListener('change', refreshRows);
      rowEl.addEventListener('change', refreshNumber);
    }
    if (meta.code === 'DGU') {
      const rowEl = body.querySelector('.js-tour-row');
      const noEl = body.querySelector('.js-tour-no');

      const fill = (el, values, suffix = '') => {
        el.innerHTML = values.map(v =>
          `<option value="${v}">${v}${suffix}</option>`
        ).join('');
      };

      const refreshNumber = () => {
        fill(
          noEl,
          dguSeatNumbers(
            floorEl.value,
            zoneEl.value,
            rowEl.value
          ),
          '번'
        );
      };

      const refreshRows = () => {
        fill(
          rowEl,
          dguRows(floorEl.value, zoneEl.value),
          '열'
        );
        refreshNumber();
      };

      floorEl.addEventListener('change', () => {
        fill(zoneEl, dguZones(floorEl.value), '블록');
        refreshRows();
      });

      zoneEl.addEventListener('change', refreshRows);
      rowEl.addEventListener('change', refreshNumber);
    }
    if (meta.code === 'GWJ') {
      const noEl = body.querySelector('.js-tour-no');

      const fill = (el, values, suffix = '') => {
        el.innerHTML = values.map(v =>
          `<option value="${v}">${v}${suffix}</option>`
        ).join('');
      };

      const refreshNumbers = () => {
        fill(
          noEl,
          gwjSeatNumbers(floorEl.value, zoneEl.value),
          '번'
        );
      };

      floorEl.addEventListener('change', () => {
        fill(zoneEl, gwjZones(floorEl.value), '열');
        refreshNumbers();
      });

      zoneEl.addEventListener('change', refreshNumbers);
    }
    if (meta.code === 'BSN') {
      const rowEl = body.querySelector('.js-tour-row');
      const noEl = body.querySelector('.js-tour-no');

      const refreshNumbers = () => {
        const wheelchair = zoneEl.value === 'WC';
        const numbers = bsnSeatNumbers(
          floorEl.value,
          zoneEl.value,
          rowEl.value
        );

        noEl.innerHTML =
          '<option value="">번호 선택</option>' +
          numbers.map(n =>
            `<option value="${n}">${wheelchair ? 'W' : ''}${n}${wheelchair ? '' : '번'}</option>`
          ).join('');
      };

      const refreshRows = () => {
        const rows = bsnRows(
          floorEl.value,
          zoneEl.value
        );

        rowEl.innerHTML = rows.map(r =>
          `<option value="${r}">${r}열</option>`
        ).join('');

        refreshNumbers();
      };

      floorEl.addEventListener('change', () => {
        const zones = bsnZones(floorEl.value);

        zoneEl.innerHTML = zones.map(z =>
          `<option value="${z}">${z === 'WC' ? '휠체어석' : '일반석'}</option>`
        ).join('');

        refreshRows();
      });

      zoneEl.addEventListener('change', refreshRows);
      rowEl.addEventListener('change', refreshNumbers);
    }
    tourSave.addEventListener('click', () => {
      const floor = Number(floorEl.value);
      const zone = zoneEl.value.trim();
      const row = Number(body.querySelector('.js-tour-row').value);
      const no = Number(body.querySelector('.js-tour-no').value);

      const numberOK = n => Number.isSafeInteger(n) && n >= 1 && n <= 99;
      if (
        meta.code === 'DGU' &&
        !dguSeatNumbers(floor, zone, row).includes(Number(no))
      ) return;

      if (
        meta.code === 'BSN' &&
        !bsnSeatNumbers(floor, zone, row).includes(no)
      ) return;

      const zoneOK = /^[A-Za-z0-9가-힣_-]{1,12}$/.test(zone);
      const jjoValid = meta.code !== 'JJO' ||
        (row === 1 && jjoSeatNumbers(floor, zone).includes(no));
      const validSeatNo = meta.code === 'JJO'
        ? jjoSeatNumbers(floor, zone).includes(no)
        : meta.code === 'GWJ'
          ? row === 1 && gwjSeatNumbers(floor, zone).includes(no)
          : numberOK(no);

      const goyangOK = meta.code !== 'GOY' ||
        (floor <= 4 &&
          (['A','B','C'].includes(zone) ||
           (floor === 1 && zone === 'OP')));

      const ysuOK = meta.code !== 'YSU' ||
        ysuSeatNumbers(floor, zone, row).includes(no);

      const snmOK = meta.code !== 'SNM' ||
        snmSeatNumbers(floor, zone, row).includes(no);

      if (!Number.isSafeInteger(floor) || floor < 1 || floor > 9 ||
          !zoneOK || !numberOK(row) || !validSeatNo || !jjoValid || !goyangOK || !snmOK || !ysuOK) {
        alert('층·구역·열·번호를 확인해 주세요.');
        return;
      }

      setSeatForPerf(
        p,
        `TV:${meta.code}:${floor}:${zone}:${row}:${no}`
      );

      const updated = perfFromKey(sheetKey);
      if (updated) openSheet(updated);
    });
  }
  [['.js-sf', 'floor'], ['.js-sr', 'row'], ['.js-sn', 'no']].forEach(([sel, which]) => {
    const el = body.querySelector(sel);
    if (el) el.addEventListener('change', () => applySeatSelect(p, which));
  });

  document.removeEventListener('keydown', escCloseSheet);
  document.addEventListener('keydown', escCloseSheet);

  if (!MOTION || wasOpen) return;
  gsap.fromTo('#sheetBack', { opacity:0 }, { opacity:1, duration:.18, ease:EASE.out });
  gsap.fromTo('#sheetBody', { yPercent:100 }, { yPercent:0, duration:.34, ease:EASE.out });
}

function closeSheet () {
  const wrap = $('#sheet');
  if (wrap.hidden) return;
  document.removeEventListener('keydown', escCloseSheet);
  sheetKey = null;
  const done = () => { wrap.hidden = true; };
  if (!MOTION) return done();
  gsap.to('#sheetBack', { opacity:0, duration:.16 });
  gsap.to('#sheetBody', { yPercent:100, duration:.24, ease:EASE.in, onComplete:done });
}
function escCloseSheet (e) { if (e.key === 'Escape') closeSheet(); }

/* ═══ 관극 기록 ═══ */
function toggleCheck (p) {
  const key = perfKey(p);
  const existing = MY_RECORDS.find(r => r.key === key);
  if (existing) { MY_RECORDS = MY_RECORDS.filter(r => r.key !== key); removeRecordRemote(key); }
  else MY_RECORDS.push({ key, seat:null });
  track(existing ? 'unsave_perf' : 'save_perf', { had_existing:!!existing });
  saveRecords();
  skipAnim = true;
  render();
}

function setSeatForPerf (p, seatId) {
  const rec = MY_RECORDS.find(r => r.key === perfKey(p));
  if (!rec) return;
  rec.seat = seatId;
  track('set_seat', { has_seat:!!seatId });
  saveRecords();
  skipAnim = true;
  render();
}

/* ═══ 좌석 선택 — 층 · 열 · 번호 세 개의 선택지.
   층을 바꾸면 열 목록이, 열을 바꾸면 번호 목록이 그 층·열의 실제 좌석으로 갱신된다.
   여기서 고른 id가 정산판 배치도에 그대로 칠해진다. ═══ */
/* 성남아트센터 오페라하우스 공식 층별 좌석도 기준.
   OP석 미운영. 개별 공연 판매보류 여부는 포함하지 않음. */
function snmZones(floor) {
  const main = ['A', 'B', 'C'];
  if (String(floor) === '1') return main;
  return [
    ...main,
    ...Array.from({length:6}, (_, i) => `L${i + 1}`),
    ...Array.from({length:6}, (_, i) => `R${i + 1}`)
  ];
}

function snmRows(floor, zone) {
  const f = String(floor);
  if (!['1', '2', '3'].includes(f)) return [];
  if (!snmZones(f).includes(zone)) return [];

  if (/^[LR][1-6]$/.test(zone)) return [1];

  const max = f === '1' ? 24 : f === '2' ? 10 : 7;

  if (f === '3') {
    if (zone === 'B') return [1, 2, 3, 4];
    return [1, 2, 5, 6, 7];
  }

  return Array.from({length:max}, (_, i) => i + 1);
}

function snmSeatNumbers(floor, zone, row) {
  const f = String(floor);
  const r = Number(row);
  if (!snmRows(f, zone).includes(r)) return [];

  let start = 0, end = -1;

  if (/^[LR][1-6]$/.test(zone)) {
    start = 1;
    end = f === '2' && /1$/.test(zone) ? 7 : 3;
  }
  else if (f === '1') {
    const aStarts = [6,5,4,4,3,3,2,2];
    const cEnds = [43,44,45,45,46,46,47,47];

    if (zone === 'A') {
      start = aStarts[r - 1] || 1;
      end = 16;
    }
    if (zone === 'B') {
      start = 17;
      end = 32;
    }
    if (zone === 'C') {
      start = 33;
      end = cEnds[r - 1] || 48;
    }
  }
  else if (f === '2') {
    const ranges = r <= 4
      ? { A:[1,15], B:[16,33], C:[34,48] }
      : r <= 8
        ? { A:[1,7], B:[16,33], C:[42,48] }
        : { A:[1,6], B:[16,31], C:[43,48] };

    [start, end] = ranges[zone] || [0, -1];
  }
  else if (f === '3') {
    const ranges = r <= 2
      ? { A:[1,15], B:[16,33], C:[34,48] }
      : r <= 4
        ? { B:[16,33] }
        : { A:[1,7], C:[42,48] };

    [start, end] = ranges[zone] || [0, -1];
  }

  return start > 0 && end >= start
    ? Array.from({length:end-start+1}, (_, i) => start+i)
    : [];
}

function seongnamSeatSelectHTML(rec) {
  const saved = String(rec.seat || '').match(
    /^TV:SNM:([1-3]):([A-Z0-9]+):(\d+):(\d+)$/
  );

  const floor = saved ? saved[1] : '1';
  const zones = snmZones(floor);
  const zone = saved && zones.includes(saved[2]) ? saved[2] : 'B';

  const rows = snmRows(floor, zone);
  const row = saved && rows.includes(Number(saved[3]))
    ? Number(saved[3]) : rows[0];

  const numbers = snmSeatNumbers(floor, zone, row);
  const no = saved && numbers.includes(Number(saved[4]))
    ? Number(saved[4]) : numbers[0];

  const options = (items, selected, suffix = '') =>
    items.map(v => `<option value="${v}"${v === selected ? ' selected' : ''}>${v}${suffix}</option>`).join('');

  return `<div class="np-seatsel">
    <span class="lbl">성남 좌석</span>
    <select class="js-tour-floor" aria-label="층">
      ${options(['1','2','3'], floor, '층')}
    </select>
    <select class="js-tour-zone" aria-label="구역">
      ${options(zones, zone)}
    </select>
    <select class="js-tour-row" aria-label="열">
      ${options(rows, row, '열')}
    </select>
    <select class="js-tour-no" aria-label="번호">
      ${options(numbers, no, '번')}
    </select>
    <button type="button" class="np-btn solid js-tour-save">저장</button>
  </div>`;
}
/* GS칼텍스 예울마루 대극장.
   1층 OA/OB/OC 포함.
   판매 여부와 관계없이 좌석 선택을 제한하지 않는다.
   일반석 번호 범위는 기존 여수 작업 기준을 사용한다. */

function ysuZones(floor) {
  const f = String(floor);

  if (f === '1') {
    return ['OA','OB','OC','A','B','C'];
  }

  if (f === '2') {
    return ['A','B','C'];
  }

  return [];
}

function ysuRows(floor, zone) {
  const f = String(floor);

  if (!ysuZones(f).includes(zone)) return [];

  // OP석: OA / OB / OC 모두 1~3열
  if (f === '1' && ['OA','OB','OC'].includes(zone)) {
    return [1,2,3];
  }

  const max = f === '1'
    ? (zone === 'B' ? 19 : 18)
    : 14;

  return Array.from(
    {length:max},
    (_, i) => i + 1
  );
}

function ysuSeatNumbers(floor, zone, row) {
  const f = String(floor);
  const r = Number(row);

  if (!ysuRows(f, zone).includes(r)) return [];

  // =====================================
  // OP석 총 73석
  //
  // OA: 3 + 6 + 7 = 16석
  // OB: 14 + 13 + 14 = 41석
  // OC: 3 + 6 + 7 = 16석
  // =====================================

  if (f === '1' && ['OA','OB','OC'].includes(zone)) {
    const limits = zone === 'OB'
      ? [14,13,14]
      : [3,6,7];

    const max = limits[r - 1];

    return Array.from(
      {length:max},
      (_, i) => i + 1
    );
  }

  // 1층 일반석 좌우 구역
  const side1 = [
    8,8,9,9,10,10,10,11,11,
    12,12,12,12,12,12,12,12,12
  ];

  // 2층 일반석 좌우 구역
  const side2 = [
    5,6,6,5,5,6,5,5,6,6,6,5,6,5
  ];

  if (f === '1' && zone === 'B' && r === 19) {
    return [1,2,13,14];
  }

  const max = zone === 'B'
    ? (f === '1' ? 14 : 10)
    : (f === '1' ? side1[r - 1] : side2[r - 1]);

  if (!max) return [];

  // 판매보류 여부로 좌석을 제거하지 않음
  return Array.from(
    {length:max},
    (_, i) => i + 1
  );
}

function yeosuSeatSelectHTML(rec) {
  const saved = String(rec.seat || '').match(
    /^TV:YSU:([12]):(OA|OB|OC|[ABC]):(\d+):(\d+)$/
  );

  const floor = saved ? saved[1] : '1';

  const zone = saved &&
    ysuZones(floor).includes(saved[2])
      ? saved[2]
      : 'B';

  const rows = ysuRows(floor, zone);

  const row = saved &&
    rows.includes(Number(saved[3]))
      ? Number(saved[3])
      : rows[0];

  const numbers = ysuSeatNumbers(floor, zone, row);

  const no = saved &&
    numbers.includes(Number(saved[4]))
      ? Number(saved[4])
      : numbers[0];

  const options = (values, selected, suffix = '') =>
    values.map(v =>
      `<option value="${v}"${String(v) === String(selected) ? ' selected' : ''}>${v}${suffix}</option>`
    ).join('');

  return `<div class="np-seatsel">
    <span class="lbl">여수 좌석</span>

    <select class="js-tour-floor" aria-label="층">
      ${options(['1','2'], floor, '층')}
    </select>

    <select class="js-tour-zone" aria-label="구역">
      ${options(ysuZones(floor), zone)}
    </select>

    <select class="js-tour-row" aria-label="열">
      ${options(rows, row, '열')}
    </select>

    <select class="js-tour-no" aria-label="번호">
      ${options(numbers, no, '번')}
    </select>

    <button type="button"
      class="np-btn solid js-tour-save">저장</button>

  </div>`;
}
/* 한국소리문화의전당 모악당 — 전주.
   OP석 제외.
   좌석번호는 블록 내 연속 번호를 사용한다.
   저장 ID의 row=1은 호환용이며 실제 1열을 뜻하지 않는다.
   판매등급과 공연별 판매보류 여부는 적용하지 않는다. */

const JJO_SEAT_MAX = Object.freeze({
  '1': { A:192, B:219, C:219, D:219, E:192 },
  '2': { A:129, B:94,  C:129, D:94,  E:129 },
  '3': { A:82,  B:64,  C:82,  D:58,  E:84  }
});

function jjoSeatNumbers(floor, block) {
  const max = JJO_SEAT_MAX[String(floor)]?.[block] || 0;
  return Array.from({length:max}, (_, i) => i + 1);
}

function jeonjuSeatSelectHTML(rec) {
  const saved = String(rec.seat || '').match(
    /^TV:JJO:([1-3]):([A-E]):1:(\d{1,3})$/
  );

  const floor = saved ? saved[1] : '1';
  const block = saved ? saved[2] : 'C';
  const numbers = jjoSeatNumbers(floor, block);
  const number = saved && numbers.includes(Number(saved[3]))
    ? Number(saved[3]) : numbers[0];

  const options = (items, selected, suffix = '') =>
    items.map(v =>
      `<option value="${v}"${String(v) === String(selected) ? ' selected' : ''}>${v}${suffix}</option>`
    ).join('');

  return `<div class="np-seatsel">
    <span class="lbl">전주 좌석</span>

    <select class="js-tour-floor" aria-label="층">
      ${options(['1','2','3'], floor, '층')}
    </select>

    <select class="js-tour-zone" aria-label="블록">
      ${options(['A','B','C','D','E'], block, '블록')}
    </select>

    <input type="hidden" class="js-tour-row" value="1">

    <select class="js-tour-no" aria-label="좌석번호">
      ${options(numbers, number, '번')}
    </select>

    <button type="button" class="np-btn solid js-tour-save">저장</button>

  </div>`;
}
/* 용인포은아트홀 2025년 이후 구역 구조.
   일반석 열/번호 범위는 임시 입력 범위이며
   실제 개별 좌석번호와 1:1 대조되지는 않았다.
   공연별 판매 상태는 좌석 선택을 제한하지 않는다. */

function yinZones(floor) {
  if (String(floor) === '1') {
    return ['OP', 'A', 'B', 'C'];
  }
  if (String(floor) === '2') {
    return ['L1', 'L2', 'D', 'E', 'F', 'R1', 'R2'];
  }
  return [];
}

function yinRows(floor, zone) {
  const f = String(floor);
  if (!yinZones(f).includes(zone)) return [];

  if (zone === 'OP') return [1, 2, 3];

  // 측면석은 저장 형식 호환을 위해 row=1 사용
  if (/^[LR][12]$/.test(zone)) return [1];

  // 일반석 임시 입력 범위
  const max = f === '1' ? 24 : 14;
  return Array.from({length:max}, (_, i) => i + 1);
}

function yinSeatNumbers(floor, zone, row) {
  const f = String(floor);
  const r = Number(row);

  if (!yinRows(f, zone).includes(r)) return [];

  // OP 74석: 3개 열
  if (f === '1' && zone === 'OP') {
    const max = [23, 24, 27][r - 1];
    return Array.from({length:max}, (_, i) => i + 1);
  }

  // 측면석은 현재 개별 번호 도면 검증 전
  if (f === '2' && /^[LR][12]$/.test(zone)) {
    return Array.from({length:16}, (_, i) => i + 1);
  }

  // 일반석은 넓은 임시 선택 범위
  return Array.from({length:50}, (_, i) => i + 1);
}

function yonginSeatSelectHTML(rec) {
  const saved = String(rec.seat || '').match(
    /^TV:YIN:([12]):(OP|[A-F]|L1|L2|R1|R2):(\d+):(\d+)$/
  );

  const floor = saved ? saved[1] : '1';

  const zone = saved && yinZones(floor).includes(saved[2])
    ? saved[2] : 'B';

  const rows = yinRows(floor, zone);

  const row = saved && rows.includes(Number(saved[3]))
    ? Number(saved[3]) : rows[0];

  const numbers = yinSeatNumbers(floor, zone, row);

  const no = saved && numbers.includes(Number(saved[4]))
    ? Number(saved[4]) : numbers[0];

  const options = (values, current, suffix = '') =>
    values.map(v =>
      `<option value="${v}"${String(v) === String(current) ? ' selected' : ''}>${v}${suffix}</option>`
    ).join('');

  return `<div class="np-seatsel">
    <span class="lbl">용인 좌석</span>

    <select class="js-tour-floor" aria-label="층">
      ${options(['1','2'], floor, '층')}
    </select>

    <select class="js-tour-zone" aria-label="구역">
      ${options(yinZones(floor), zone)}
    </select>

    <select class="js-tour-row" aria-label="열">
      ${options(rows, row, '열')}
    </select>

    <select class="js-tour-no" aria-label="번호">
      ${options(numbers, no, '번')}
    </select>

    <button type="button"
      class="np-btn solid js-tour-save">저장</button>

  </div>`;
}
/* 계명아트센터 — 대구.
   1층 O/A/B/C/D/E, 2~3층 A/B/C/D/E/L/R.
   공식 객석 구성을 바탕으로 한 임시 열별 번호 범위.
   킹키부츠 대구 공지:
   1층 C블록 짝수열 2/4/6/8/10열에는 13번 없음.
   판매보류 여부로 선택을 제한하지 않는다. */

function dguZones(floor) {
  const f = String(floor);

  if (f === '1') {
    return ['O','A','B','C','D','E'];
  }

  if (f === '2' || f === '3') {
    return ['L','A','B','C','D','E','R'];
  }

  return [];
}

function dguRows(floor, zone) {
  const f = String(floor);

  if (!dguZones(f).includes(zone)) return [];

  const max = f === '1'
    ? (zone === 'O' ? 4 : 24)
    : (zone === 'L' || zone === 'R' ? 2 : 7);

  return Array.from(
    {length:max},
    (_, i) => i + 1
  );
}

function dguSeatNumbers(floor, zone, row) {
  const f = String(floor);
  const r = Number(row);

  if (!dguRows(f, zone).includes(r)) return [];

  let max;

  if (f === '1' && zone === 'O') {
    max = 28;
  }
  else if (zone === 'L' || zone === 'R') {
    max = 12;
  }
  else if (zone === 'C') {
    max = 13;
  }
  else if (zone === 'A' || zone === 'E') {
    max = 10;
  }
  else {
    max = 11;
  }

  let numbers = Array.from(
    {length:max},
    (_, i) => i + 1
  );

  // 공연 공지에서 확인된 실제 미존재 좌석
  if (
    f === '1' &&
    zone === 'C' &&
    [2,4,6,8,10].includes(r)
  ) {
    numbers = numbers.filter(n => n !== 13);
  }

  return numbers;
}

function daeguSeatSelectHTML(rec) {
  const saved = String(rec.seat || '').match(
    /^TV:DGU:([1-3]):(O|L|R|[A-E]):(\d+):(\d+)$/
  );

  const floor = saved ? saved[1] : '1';

  const zone = saved && dguZones(floor).includes(saved[2])
    ? saved[2] : 'C';

  const rows = dguRows(floor, zone);

  const row = saved && rows.includes(Number(saved[3]))
    ? Number(saved[3]) : rows[0];

  const numbers = dguSeatNumbers(floor, zone, row);

  const no = saved && numbers.includes(Number(saved[4]))
    ? Number(saved[4]) : numbers[0];

  const options = (values, selected, suffix = '') =>
    values.map(v =>
      `<option value="${v}"${String(v) === String(selected) ? ' selected' : ''}>${v}${suffix}</option>`
    ).join('');

  return `<div class="np-seatsel">
    <span class="lbl">대구 좌석</span>

    <select class="js-tour-floor" aria-label="층">
      ${options(['1','2','3'], floor, '층')}
    </select>

    <select class="js-tour-zone" aria-label="블록">
      ${options(dguZones(floor), zone, '블록')}
    </select>

    <select class="js-tour-row" aria-label="열">
      ${options(rows, row, '열')}
    </select>

    <select class="js-tour-no" aria-label="번호">
      ${options(numbers, no, '번')}
    </select>

    <button type="button"
      class="np-btn solid js-tour-save">저장</button>

  </div>`;
}
/* 광주예술의전당 대극장.
   공식 구역: 1층 가~마열 / 2층 바~아열.
   블록별 정확한 번호 목록 대조 전이므로
   좌석번호 범위는 임시 입력용이다.
   공연별 판매 여부는 선택을 제한하지 않는다. */

function gwjZones(floor) {
  if (String(floor) === '1') {
    return ['가','나','다','라','마'];
  }

  if (String(floor) === '2') {
    return ['바','사','아'];
  }

  return [];
}

function gwjSeatNumbers(floor, zone) {
  const f = String(floor);

  if (!gwjZones(f).includes(zone)) return [];

  const max = f === '1' ? 300 : 200;

  return Array.from(
    {length:max},
    (_, i) => i + 1
  );
}

function gwjSeatSelectHTML(rec) {
  // row=1은 기존 지방 좌석 ID 호환용.
  // 광주의 실제 '1열'을 의미하지 않는다.
  const saved = String(rec.seat || '').match(
    /^TV:GWJ:([12]):([가나다라마바사아]):1:(\d{1,3})$/
  );

  const floor = saved ? saved[1] : '1';
  const zones = gwjZones(floor);

  const zone = saved && zones.includes(saved[2])
    ? saved[2]
    : '다';

  const numbers = gwjSeatNumbers(floor, zone);

  const no = saved && numbers.includes(Number(saved[3]))
    ? Number(saved[3])
    : 1;

  const options = (values, selected, suffix = '') =>
    values.map(v =>
      `<option value="${v}"${String(v) === String(selected) ? ' selected' : ''}>${v}${suffix}</option>`
    ).join('');

  return `<div class="np-seatsel">
    <span class="lbl">광주 좌석</span>

    <select class="js-tour-floor" aria-label="층">
      ${options(['1','2'], floor, '층')}
    </select>

    <select class="js-tour-zone" aria-label="구역">
      ${options(zones, zone, '열')}
    </select>

    <input type="hidden" class="js-tour-row" value="1">

    <select class="js-tour-no" aria-label="좌석번호">
      ${options(numbers, no, '번')}
    </select>

    <button type="button"
      class="np-btn solid js-tour-save">저장</button>

  </div>`;
}
/* 부산 드림씨어터.
   공식 층별 좌석도 기준.
   A/B/C 블록이 아니라 층·열·번호로 표기한다.

   일반석 개별 누락 번호는 미검증이므로 번호 범위는
   입력용 상한이며 완전한 실좌석 목록은 아니다.

   휠체어석:
   1층 12열 W1~W4, 25열 W5~W12
   2층 7열 W1~W6

   판매등급 및 공연별 판매 여부는 제한하지 않는다.
*/

function bsnZones(floor) {
  const f = String(floor);

  if (f === '1' || f === '2') {
    return ['REG', 'WC'];
  }

  if (f === '3') {
    return ['REG'];
  }

  return [];
}

function bsnRows(floor, zone) {
  const f = String(floor);

  if (!bsnZones(f).includes(zone)) return [];

  if (zone === 'WC') {
    return f === '1' ? [12,25] : [7];
  }

  if (f === '1') {
    return Array.from({length:24}, (_, i) => i + 1);
  }

  if (f === '2') {
    return [1,2,3,4,5,6,8,9];
  }

  return [1,2,3,4,5,6];
}

function bsnSeatNumbers(floor, zone, row) {
  const f = String(floor);
  const r = Number(row);

  if (!bsnRows(f, zone).includes(r)) return [];

  if (zone === 'WC') {
    if (f === '1' && r === 12) {
      return [1,2,3,4];
    }

    if (f === '1' && r === 25) {
      return [5,6,7,8,9,10,11,12];
    }

    if (f === '2' && r === 7) {
      return [1,2,3,4,5,6];
    }

    return [];
  }

  // 공식 도면에서 확인된 층별 번호 상한.
  // 열별 누락 번호는 아직 필터링하지 않는다.
  const max = f === '2' ? 51 : 49;

  return Array.from({length:max}, (_, i) => i + 1);
}

function busanSeatSelectHTML(rec) {
  const saved = String(rec.seat || '').match(
    /^TV:BSN:([1-3]):(REG|WC):(\d{1,2}):(\d{1,2})$/
  );

  const floor = saved ? saved[1] : '1';

  const zone = 'REG';

  const rows = bsnRows(floor, zone);

  const row = saved && rows.includes(Number(saved[3]))
    ? Number(saved[3]) : rows[0];

  const numbers = bsnSeatNumbers(floor, zone, row);

  const no = saved && numbers.includes(Number(saved[4]))
    ? Number(saved[4]) : null;

  const options = (values, current, suffix = '') =>
    values.map(v =>
      `<option value="${v}"${String(v) === String(current) ? ' selected' : ''}>${v}${suffix}</option>`
    ).join('');

  const numberOptions = (values, current, wheelchair) =>
    `<option value="">번호 선택</option>` +
    values.map(v =>
      `<option value="${v}"${v === current ? ' selected' : ''}>${wheelchair ? 'W' : ''}${v}${wheelchair ? '' : '번'}</option>`
    ).join('');

  const zoneOptions = (items, current) =>
    items.map(v =>
      `<option value="${v}"${v === current ? ' selected' : ''}>${v === 'WC' ? '휠체어석' : '일반석'}</option>`
    ).join('');

  return `<div class="np-seatsel">
    <span class="lbl">부산 좌석</span>

    <select class="js-tour-floor" aria-label="층">
      ${options(['1','2','3'], floor, '층')}
    </select>

    <input type="hidden" class="js-tour-zone" value="REG">

    <select class="js-tour-row" aria-label="열">
      ${options(rows, row, '열')}
    </select>

    <select class="js-tour-no" aria-label="번호">
      ${numberOptions(numbers, no, zone === 'WC')}
    </select>

    <button type="button"
      class="np-btn solid js-tour-save">저장</button>

  </div>`;
}
function tourSeatSelectHTML (rec, p) {
  const venue = p.venue || WORK.venue;
  const meta = TOUR_SEAT_VENUES[venue];
  if (!meta) return '';

  const code = meta.code;
  if (code === 'BSN') return busanSeatSelectHTML(rec);
  if (code === 'GWJ') return gwjSeatSelectHTML(rec);
  if (code === 'DGU') return daeguSeatSelectHTML(rec);
  if (code === 'YIN') return yonginSeatSelectHTML(rec);
  if (code === 'JJO') return jeonjuSeatSelectHTML(rec);
  if (code === 'SNM') return seongnamSeatSelectHTML(rec);
  if (code === 'YSU') return yeosuSeatSelectHTML(rec);
  const saved = String(rec.seat || '');
  let found = saved.match(/^TV:([A-Z]{3}):([1-9]):([A-Za-z0-9가-힣_-]{1,12}):(\d{1,2}):(\d{1,2})$/);

  if (!found && code === 'GOY') {
    const old = saved.match(/^GY:([1-4]):([A-Z0-9]+):(\d+):(\d+)$/);
    if (old) found = ['', code, old[1], old[2], old[3], old[4]];
  }

  if (found && found[1] !== code) found = null;

  const floor = found ? found[2] : '1';
  const zone = found ? found[3] : (code === 'GOY' ? 'B' : '일반');
  const row = found ? found[4] : '';
  const no = found ? found[5] : '';

  const floorInput = code === 'GOY'
    ? `<select class="js-tour-floor" aria-label="층">
        ${[1,2,3,4].map(n => `<option value="${n}"${String(n) === floor ? ' selected' : ''}>${n}층</option>`).join('')}
       </select>`
    : `<input class="js-tour-floor" aria-label="층" type="number" min="1" max="9" value="${floor}" style="width:58px">`;

  const zones = code === 'GOY'
    ? (floor === '1' ? ['A','B','C','OP'] : ['A','B','C'])
    : null;

  const zoneInput = zones
    ? `<select class="js-tour-zone" aria-label="구역">
        ${zones.map(z => `<option value="${z}"${z === zone ? ' selected' : ''}>${z}</option>`).join('')}
       </select>`
    : `<input class="js-tour-zone" aria-label="구역" value="${zone}" maxlength="12" placeholder="구역" style="width:72px">`;

  return `<div class="np-seatsel">
    <span class="lbl">좌석</span>
    ${floorInput}
    ${zoneInput}
    <select class="js-tour-row" aria-label="열">
  <option value="">열 선택</option>
  ${Array.from({ length:99 }, (_, i) => i + 1)
    .map(n => `<option value="${n}"${row && Number(row) === n ? ' selected' : ''}>${n}열</option>`)
    .join('')}
</select>
    <select class="js-tour-no" aria-label="번호">
  <option value="">번호 선택</option>
  ${Array.from({ length:99 }, (_, i) => i + 1)
    .map(n => `<option value="${n}"${no && Number(no) === n ? ' selected' : ''}>${n}번</option>`)
    .join('')}
</select>
    <button type="button" class="np-btn solid js-tour-save">저장</button>
  </div>`;
}

function seatSelectHTML (rec, p) {
  const venue = p.venue || WORK.venue;
  if (venue !== SEAT_MAP.venue) return tourSeatSelectHTML(rec, p);
  const w = rec.seat ? seatWhere(rec.seat) : null;
  const floor = floorById(w ? w.fid : '1') || SEAT_MAP.floors[0];
  const row   = floor.rows.find(r => r.r === (w && w.rlab)) || floor.rows[0];
  const seats = seatsInRow(floor, row);
  const curNo = rec.seat ? String(rec.seat).split('-')[2] : null;

  const opt = (v, label, on) => `<option value="${v}"${on ? ' selected' : ''}>${label}</option>`;

  return `<div class="np-seatsel">
    <span class="lbl">좌석</span>
    <select class="js-sf" aria-label="층">${
      SEAT_MAP.floors.map(f => opt(f.id, f.label, f.id === floor.id)).join('')}</select>
    <select class="js-sr" aria-label="열">${
      floor.rows.map(r => opt(r.r, r.r + '열', r.r === row.r)).join('')}</select>
    <select class="js-sn" aria-label="번호">${
      seats.map(s => opt(s.no, s.no + '번', String(s.no) === curNo)).join('')}</select>
  </div>`;
}

/* 선택이 바뀌면 그 자리를 기록에 바로 반영하고 시트를 다시 그린다.
   floor/row 가 바뀌면 하위 목록이 달라지므로 첫 좌석으로 맞춰 준다. */
function applySeatSelect (perf, changed) {
  if ((perf.venue || WORK.venue) !== SEAT_MAP.venue) return;
  const fid = $('.js-sf').value;
  const floor = floorById(fid);
  let rlab = $('.js-sr').value;
  if (changed === 'floor' || !floor.rows.some(r => r.r === rlab)) rlab = floor.rows[0].r;
  const row = floor.rows.find(r => r.r === rlab);
  const seats = seatsInRow(floor, row);
  let no = $('.js-sn').value;
  if (changed !== 'no' || !seats.some(s => String(s.no) === no)) no = seats[0].no;
  setSeatForPerf(perf, seatId(fid, rlab, no));
  const np = perfFromKey(sheetKey);
  if (np) openSheet(np);
}

/* ═══════════════════════════════════════════════════════════
   이벤트 바인딩
   ═══════════════════════════════════════════════════════════ */
function moveMonth (step) {
  const n = { y:ym.y, m:ym.m + step };
  if (n.m > 12) { n.m = 1; n.y++; }
  if (n.m < 1)  { n.m = 12; n.y--; }
  if (idx(n) < idx(RANGE.min) || idx(n) > rangeMaxIndex) return;
  ym = n;
  sheetKey = null;
  closeSheet();
  gridFrom = step < 0 ? 'end' : 'start';
  render();
}

function bind () {
  $$('.np-vt button').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.view === view) return;
    view = b.dataset.view;
    track('switch_view', { view });
    sheetKey = null;
    closeSheet();
    render();
  }));

  $$('.np-cell[data-day]').forEach(c => c.addEventListener('click', () => {
    const day = +c.dataset.day;
    const dPerfs = monthPerfs().filter(p => p.d === day).sort(cmpPerf);
    if (!dPerfs.length) return;
    track('open_perf', { from:'calendar' });
    openSheet(dPerfs[0]);   // 회차 있는 날 → 상세 모달 (같은 날 여러 회차면 모달 안에서 전환)
  }));

  $$('.np-entry').forEach(e => e.addEventListener('click', () => {
    const p = perfFromKey(e.dataset.key);
    if (!p) return;
    track('open_perf', { from:'list' });
    openSheet(p);
  }));

  $$('.np-book-btn').forEach(a => a.addEventListener('click', () => {
    if (a.dataset.ext) track('click_link', { target:a.dataset.ext });
    else track('click_booking', { vendor:(a.querySelector('b') || {}).textContent || '' });
  }));

  $$('.js-month').forEach(b => b.addEventListener('click', () => moveMonth(+b.dataset.step)));

  const pastToggle = $('#pastToggle');
  if (pastToggle) pastToggle.addEventListener('click', () => { showPast = !showPast; skipAnim = true; render(); });
}

/* ═══ 등장 · 재렌더 애니메이션 ═══ */
function enter () {
  document.documentElement.classList.remove('pre-anim');
  if (!MOTION) return;
  gsap.timeline()
    .from('.np-mast > *', { opacity:0, y:-8, duration:.5, stagger:.07 })
    .from('.np-nav > *',  { opacity:0, y:-6, duration:.4, stagger:.05 }, .12)
    .from('.np-main > *', { opacity:0, y:16, duration:.5, stagger:.1, clearProps:'all' }, .2);
}

function animateBody () {
  if (!MOTION || skipAnim) { skipAnim = false; return; }
  const items = $('#wrap').querySelectorAll('.np-cell[data-day], .np-entry');
  if (!items.length) return;
  gsap.from(items, {
    opacity:0, y:-4, duration:.28,
    stagger:{ amount:Math.min(items.length * .012, .35), from:gridFrom }
  });
  gridFrom = 'start';
}

$('#sheetBack').addEventListener('click', closeSheet);

/* ═══ 초기화 ═══ */
function updateTodayStamp () {
  $('#todayStamp').textContent =
    `${TODAY.y}.${String(TODAY.m).padStart(2,'0')}.${String(TODAY.d).padStart(2,'0')} (${WD_NAME[new Date(TODAY.y, TODAY.m - 1, TODAY.d).getDay()]})`;
}

updateTodayStamp();

window.addEventListener('todaychange', event => {
  const { previous, current } = event.detail;
  if (ym.y === previous.y && ym.m === previous.m) ym = { y:current.y, m:current.m };
  updateTodayStamp();
  skipAnim = true;
  render();
});
window.addEventListener('performancechange', () => {
  skipAnim = true;
  render();
});

if ('serviceWorker' in navigator) {
  const hadServiceWorker = !!navigator.serviceWorker.controller;
  let reloadingForUpdate = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadServiceWorker || reloadingForUpdate) return;
    reloadingForUpdate = true;
    window.location.reload();
  });
}

skipAnim = true;
render();
enter();

/* Supabase 로그인 — 세션이 확인되면 콜백으로 재렌더 */
mountAuth(isIn => { loggedIn = isIn; skipAnim = true; render(); });
