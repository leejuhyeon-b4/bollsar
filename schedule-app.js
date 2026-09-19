
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
const WD = ['월','화','수','목','금','토','일'];        // 달력 표시 순서 — 월요일 시작
const wcol = d => (d + 6) % 7;                          // getDay() → 달력 열 위치 (0=월 … 6=일)
const dowShort = p => WD_NAME[new Date(p.y, p.m - 1, p.d).getDay()];

/* ═══════════════════════════════════════════════════════════
   상태
   ═══════════════════════════════════════════════════════════ */
let view = 'calendar';                 // 'calendar' | 'list' — 달력형이 이 탭의 중심
let ym = { y:TODAY.y, m:TODAY.m };      // 달력형에서 보고 있는 달
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

/* 헤드라인 옆 컷 사진 — 루케니 무대컷. 송곳 실루엣이 이 위를 뚫고 지나간다. */
const LEAD_PHOTO = SCHEDULE_THEME.assets.leadPhoto;

/* ═══════════════════════════════════════════════════════════
   렌더
   ═══════════════════════════════════════════════════════════ */
function render () {
  document.body.classList.toggle('logged-in', loggedIn);
  $('#loginBtn').textContent = loggedIn ? '로그아웃' : '로그인';
  $('#wrap').innerHTML = viewTabsHTML() + (view === 'calendar' ? calendarHTML() : listHTML());
  bind();
  animateBody();
}

function viewTabsHTML () {
  return SCHEDULE_VIEW.viewTabsHTML({ view });
}

/* ── 다가오는 회차 (지면 헤드라인) ── */
function leadHTML () {
  const up = hongPerfs().filter(p => !isPast(p)).sort(cmpPerf);
  const p = up[0] || hongPerfs().sort(cmpPerf).slice(-1)[0];
  if (!p) return '';
  const diff = Math.round((new Date(p.y, p.m - 1, p.d) - new Date(TODAY.y, TODAY.m - 1, TODAY.d)) / 86400000);
  const dday = diff === 0 ? 'D-DAY' : diff > 0 ? 'D-' + diff : 'D+' + Math.abs(diff);
  const role = (hongRole(p) || {}).name || '';

  let deck;
  if ((p.events || []).length) deck = `${p.events.map(e => e.label).join(' · ')} 등 회차 이벤트가 예정돼 있습니다.`;
  else if (p.history) deck = `직전 캐스팅 변경이 반영된 회차입니다.`;
  else deck = `${ACTORS[HONG].name} 배우의 출연이 예정된 회차입니다.`;

  return SCHEDULE_VIEW.leadHTML({
    p,
    dday,
    role,
    deck,
    WORK,
    LEAD_PHOTO,
    ACTORS,
    HONG,
    dowShort
  });
}

/* ── 지면 기사 한 줄 (목록형) ── */
function entryHTML (p, extra) {
  const key = perfKey(p);
  const role = (hongRole(p) || {}).name || '';
  const went = loggedIn && !!recordFor(p);

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
    PHOTO,
    WORK,
    dowShort
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
    const dWent = loggedIn && dItems.some(p => recordFor(p));   // 담은 회차가 있는 날
    const cls = ['np-cell', isToday ? 'today' : '', isSun ? 'sun' : '', dWent ? 'went' : ''].join(' ').replace(/\s+/g, ' ').trim();
    const dEvents = dItems.flatMap(p => p.events || []);
    const eventLabel = dEvents[0]?.label || '';
    const eventText = eventLabel === '커튼콜데이'
      ? '<span class="full">커튼콜데이</span><span class="short">커튼콜</span>'
      : eventLabel;
    cells += SCHEDULE_VIEW.calendarCellHTML({
      cls,
      day,
      times: dItems.map(p => p.t),
      eventText,
      eventCount: dEvents.length,
      PHOTO,
      actorName: ACTORS[HONG].name
    });
  }

  const dow = WD.map((w, i) => `<div class="${i === 6 ? 'sun' : ''}">${w}</div>`).join('');

  return SCHEDULE_VIEW.calendarFrameHTML({
    lead: leadHTML(),
    year: ym.y,
    month: ym.m,
    monthEnglish: MONTH_EN[ym.m - 1],
    actorName: ACTORS[HONG].name,
    count: list.length,
    canPrev: idx(ym) > idx(RANGE.min),
    canNext: idx(ym) < idx(RANGE.max),
    dow,
    cells
  });
}

/* ═══ 목록형 ═══ */
function listHTML () {
  const all = hongPerfs().sort(cmpPerf);
  const upcoming = all.filter(p => !isPast(p));
  const past = all.filter(p => isPast(p));

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
    pastBlock
  });
}

/* ═══════════════════════════════════════════════════════════
   회차 상세 (하단 시트)
   ═══════════════════════════════════════════════════════════ */
function sheetHTML (p) {
  const diff = Math.round((new Date(p.y, p.m - 1, p.d) - new Date(TODAY.y, TODAY.m - 1, TODAY.d)) / 86400000);
  const dday = diff === 0 ? 'D-DAY' : diff > 0 ? 'D-' + diff : 'D+' + Math.abs(diff);

  const sameDay = hongPerfs().filter(q => q.y === p.y && q.m === p.m && q.d === p.d).sort(cmpPerf);
  const dayNav = sameDay.length > 1
    ? `<div class="np-sheet-switch">${sameDay.map(q => {
        const k = perfKey(q);
        return `<button type="button" class="np-sw js-sw${k === perfKey(p) ? ' on' : ''}" data-key="${k}">${q.t}</button>`;
      }).join('')}</div>`
    : '';

  const role = (hongRole(p) || {}).name || '';
  const went = loggedIn && !!recordFor(p);
  const kicker = [
    '<em class="cat">뮤지컬 회차</em>',
    p.history ? '<em class="np-mini hist">캐스팅 변경</em>' : '',
    went ? '<em class="np-mini went">✓ 담음</em>' : ''
  ].filter(Boolean).join('');

  const rows = ROLES.map(r => {
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

  const rec = recordFor(p);
  const check = loggedIn
    ? `<div class="np-check">
        <button type="button" class="np-btn ${rec ? 'solid' : ''} js-check" aria-pressed="${!!rec}">${rec ? '✓ 이 회차 담음' : '이 회차 담기'}</button>
        ${rec ? '' : `<span class="hint">눌러서 관극 기록을 남기세요</span>`}
      </div>
      ${rec ? seatSelectHTML(rec) : ''}`
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
    workTitle: WORK.title,
    venue: WORK.venue || ''
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
function seatSelectHTML (rec) {
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
  if (idx(n) < idx(RANGE.min) || idx(n) > idx(RANGE.max)) return;
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
