/* ═══════════════════════════════════════════════════════════
   모션 — GSAP 3.15 (index.html과 같은 값)
   ═══════════════════════════════════════════════════════════ */
const $$ = s => document.querySelectorAll(s);
const mq = q => !!(window.matchMedia && window.matchMedia(q).matches);
const MOTION = typeof gsap !== 'undefined' && !mq('(prefers-reduced-motion: reduce)');

if (!MOTION) console.warn('[볼살씨] 모션 꺼짐 — ' + (typeof gsap === 'undefined'
  ? 'GSAP을 불러오지 못했습니다 (CDN 차단 · 오프라인)'
  : '브라우저가 prefers-reduced-motion: reduce 를 요청했습니다'));

const EASE = { out:'expo.out', in:'power2.out', pop:'back.out(1.5)' };
if (MOTION) gsap.defaults({ ease:EASE.out, duration:.36 });

const WD_NAME = ['일','월','화','수','목','금','토'];

function popSwatch (elm) {
  if (!MOTION) return;
  gsap.fromTo(elm, { scale:.7 }, { scale:1, duration:.4, ease:EASE.pop });
}
function enter () {
  document.documentElement.classList.remove('pre-anim');
  if (!MOTION) return;
  gsap.timeline()
    .from('.np-mast > *', { opacity:0, y:-8, duration:.5, stagger:.07 })
    .from('.np-nav > *',  { opacity:0, y:-6, duration:.4, stagger:.05 }, .12)
    .from('.np-main > *', { opacity:0, y:16, duration:.5, stagger:.1, clearProps:'all' }, .2);
}

/* ═══════════════════════════════════════════════════════════
   상태
   ═══════════════════════════════════════════════════════════ */
/* 로그인 상태는 Supabase 세션이 결정한다 (data.js mountAuth). 시작은 로그아웃 → 게이트. */
let loggedIn    = false;
let hongOnly    = true;    // 📌 기본값 — 강홍석 회차만. 한 번 더 누르면 전 회차.
let completedOnly = true;  // 기본값 — 오늘 이전에 끝난 회차만 정산한다.
let visitColors = { ...DEFAULT_VISIT_COLORS };  // { 앉은횟수: 색id }
let heldColor   = null;                         // 터치용 — 팔레트에서 눌러 '들고 있는' 색
let seatMapCentered = false;                    // 로그인 재렌더 전에도 최초 중앙 위치를 보장한다
let overviewZoom = 1;
const VISIT_COLOR_STORAGE_KEY = 'bollsar.visit-colors.v1';
const LEGACY_VISIT_COLOR_STORAGE_KEYS = ['hongcal.visit-colors.v1'];
const FAVORITE_PAIR_STORAGE_KEY = 'bollsar.favorite-pairs.v1';
const LEGACY_FAVORITE_PAIR_STORAGE_KEYS = ['hongcal.favorite-pairs.v1'];
let delMode     = false;      // 관극 기록 삭제 모드 — 켜면 각 칸 오른쪽 위에 ✕
let newRecKey   = null;        // 기록 추가 폼 — 회차
let newFloor    = '1';         //              — 층
let newRow      = null;        //              — 열
let newNo       = null;        //              — 번호
let pairFix     = {};         // { roleId: actorId }
let favoritePairs = [];
const FAVORITE_MAX = 4;

const scopedUserStorageSuffix = () =>
  authUserId() || 'local';

const productionScopedUserStorageKey =
  prefix =>
    `${prefix}.production.${ACTIVE_PRODUCTION_ID}.${scopedUserStorageSuffix()}`;

const legacyScopedUserStorageKey =
  prefix =>
    `${prefix}.${scopedUserStorageSuffix()}`;

const migratedScopedUserStorageKey = (
  prefix,
  legacyPrefixes
) => {
  const currentKey =
    productionScopedUserStorageKey(
      prefix
    );

  migrateStorageValue(
    localStorage,
    currentKey,
    [
      legacyScopedUserStorageKey(prefix),
      ...legacyPrefixes.map(
        legacyPrefix =>
          legacyScopedUserStorageKey(
            legacyPrefix
          )
      )
    ]
  );

  return currentKey;
};
const favoritePairStorageKey = () =>
  migratedScopedUserStorageKey(FAVORITE_PAIR_STORAGE_KEY, LEGACY_FAVORITE_PAIR_STORAGE_KEYS);

function loadFavoritePairs () {
  try {
    const saved = JSON.parse(
      localStorage.getItem(favoritePairStorageKey()) || '[]'
    );

    if (!Array.isArray(saved)) return [];

    const valid = new Map(
      ROLES.map(role => [role.id, new Set(role.actors)])
    );

    const result = [];
    const seen = new Set();

    for (const raw of saved) {
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) continue;

      const fix = Object.fromEntries(
        Object.entries(raw).filter(
          ([role, actor]) => valid.get(role)?.has(actor)
        )
      );

      if (!Object.keys(fix).length) continue;

      const key = Object.entries(fix)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([role, actor]) => `${role}:${actor}`)
        .join(',');

      if (seen.has(key)) continue;

      seen.add(key);
      result.push(fix);

      if (result.length >= FAVORITE_MAX) break;
    }

    return result;
  } catch (_) {
    return [];
  }
}

function saveFavoritePairs () {
  try {
    localStorage.setItem(
      favoritePairStorageKey(),
      JSON.stringify(favoritePairs)
    );
  } catch (_) {}
}


/* ═══ 집계 ═══ */
function myRecords () {
  return MY_RECORDS
    .map(rec => ({ rec, perf: perfFromKey(rec.key) }))
    .filter(x => x.perf
      && (!hongOnly || isHongPerf(x.perf))
      && (!completedOnly || isPast(x.perf)))
    .sort((a, b) => cmpPerf(a.perf, b.perf));
}
const denominator = () => PERFS.filter(perf =>
  (!hongOnly || isHongPerf(perf))
  && (!completedOnly || isPast(perf))
).length;

function seatVisitCounts (list) {
  const map = new Map();
  list.forEach(({ rec }) => {
    if (!rec.seat) return;
    map.set(rec.seat, (map.get(rec.seat) || 0) + 1);
  });
  return map;
}

/* 앉은 횟수 → 색. 진하기 대신 아예 다른 색을 써서 떨어진 좌석끼리도 바로 구분된다.
   유저가 그 횟수 칸에 색을 안 골랐으면 null (좌석은 회색으로, 색 칸은 점선 빈칸으로). */
const colorHex = id => (SEAT_COLORS.find(c => c.id === id) || SEAT_COLORS[0]).hex;
const visitColorStorageKey = () =>
  migratedScopedUserStorageKey(VISIT_COLOR_STORAGE_KEY, LEGACY_VISIT_COLOR_STORAGE_KEYS);
function loadVisitColors () {
  try {
    const saved = JSON.parse(localStorage.getItem(visitColorStorageKey()) || '{}');
    const validIds = new Set(SEAT_COLORS.map(c => c.id));
    return Object.fromEntries(
      VISIT_LEVELS.filter(level => validIds.has(saved[level])).map(level => [level, saved[level]])
    );
  } catch (_) {
    return { ...DEFAULT_VISIT_COLORS };
  }
}
function saveVisitColors () {
  try {
    localStorage.setItem(visitColorStorageKey(), JSON.stringify(visitColors));
  } catch (_) {}
}
const visitHex = n => {
  const id = visitColors[Math.min(n, 4)];
  return id ? colorHex(id) : null;
};

/* 배역별 고정 조합 헬퍼 */
const doubleRoles = () => ROLES.filter(r => r.actors.length > 1);
const pairLabel   = fix => ROLES.filter(r => fix[r.id]).map(r => actorName(fix[r.id])).join(' · ');
const pairFixKey  = fix => Object.entries(fix).sort(([a], [b]) => a.localeCompare(b)).map(([r, a]) => `${r}:${a}`).join(',');
const recordsMatchingFix = (list, fix) => {
  const rids = Object.keys(fix);
  return list.filter(({ perf }) => rids.every(rid => perf.cast[rid] === fix[rid]));
};

/* ═══════════════════════════════════════════════════════════
   렌더
   ═══════════════════════════════════════════════════════════ */
function render () {
  // 통째로 다시 그리므로 배치도의 가로 스크롤·페이지 위치를 그대로 되돌려 놓는다
  const oldScroller = $('.seatmap-scroll');
  const keepX = oldScroller ? oldScroller.scrollLeft : null;
  const keepY = window.scrollY;
  const shouldCenterSeatMap = !seatMapCentered;

  document.body.classList.toggle('logged-in', loggedIn);
  $('#loginBtn').textContent = loggedIn ? '로그아웃' : '로그인';
  $('#wrap').innerHTML = headHTML() + bodyHTML();
  bind();

  requestAnimationFrame(() => {
    const scroller = $('.seatmap-scroll');
    if (!scroller) return;
    scroller.scrollLeft = shouldCenterSeatMap
      ? Math.round((scroller.scrollWidth - scroller.clientWidth) / 2)
      : keepX;
    seatMapCentered = true;
  });
  if (window.scrollY !== keepY) window.scrollTo(0, keepY);
}

/* ── 지면 헤드: 포스터 + 엘리자벳 6연 정산판 ── */
function headHTML () {
  const { start, end } = WORK.period;
  const fmt = s => s ? s.replace(/-/g, '.') : '미정';
  const poster = WORK.poster
    ? `<span class="st-poster" style="background-image:url('${WORK.poster}')" role="img" aria-label="${WORK.title} 포스터"></span>`
    : `<span class="st-poster" aria-hidden="true"></span>`;

  return `<section class="st-head">
    ${poster}
    <div>
      <div class="st-kick">정산판</div>
      <h1 class="st-title">${WORK.title} ${WORK.run} 정산판</h1>
      <p class="st-meta">${fmt(start)} – ${fmt(end)}<br>${WORK.venue}</p>
    </div>
  </section>`;
}

function bodyHTML () {
  const list  = myRecords();
  const numer = list.length;

  const pin = `<div class="st-pin">
    <span class="pin" aria-hidden="true">📌</span>
    <button type="button" class="st-toggle js-pin" aria-pressed="${hongOnly}">${ACTORS[HONG].name}</button>
  </div>`;

  const tally = `<div class="st-tally">
    <div class="st-tally-main">
      <span class="who">${hongOnly ? ACTORS[HONG].name : '전 회차'} · ${WORK.title}</span>
      <span class="n">${numer}<small> / ${denominator()}회</small></span>
    </div>
    <label class="st-period-filter">
      <input type="checkbox" class="js-completed-only" ${completedOnly ? 'checked' : ''}>
      <b>지난 회차만 정산</b><small>해제하면 예정 회차도 포함</small>
    </label>
    ${hongOnly ? '' : '<p class="st-all-note">아래 기록 추가에서 모든 회차를 담을 수 있습니다.</p>'}
  </div>`;

  const live = `
    ${pin}
    ${tally}
    <div class="st-sec">
      <div class="st-sec-head st-map-head">
        <span class="cnt">${SEAT_MAP.venue}</span>
        ${paletteHTML()}
        <button type="button" class="np-btn sm js-map-overview">확대해서 보기</button>
      </div>
      ${slotsHTML()}
      ${seatMapHTML(list)}
    </div>
    ${recordsHTML(list)}
    ${favoritePairsHTML(list)}
    <div class="st-save">
      <button type="button" class="np-btn solid js-save">이미지로 저장하기</button>
      <span class="cap">PNG · 3172 × 1984</span>
    </div>`;

  return `<section class="st-sec">
    <div class="st-sec-head"><h2>정산판</h2></div>
    <div class="gate" style="margin-top:14px">
      <div class="gate-locked">${live}</div>
      <div class="gate-cta">
        <p>로그인하면 내가 실제로 본 회차 기준으로<br>관람 횟수와 좌석 기록을 볼 수 있습니다</p>
        <button type="button" class="np-btn solid js-login-cta">로그인하고 정산판 보기</button>
      </div>
    </div>
  </section>`;
}

/* ── 색 팔레트 (좌석배치도 헤더 · 장소명 옆 여백에) ── */
function paletteHTML () {
  return `<div class="palette" role="group" aria-label="좌석 색 팔레트">${
    SEAT_COLORS.map(c => `<button type="button" class="pal js-pal" draggable="true" data-color="${c.id}"
      style="background:${c.hex}" title="${c.label}" aria-label="${c.label}"
      aria-pressed="${c.id === heldColor}"></button>`).join('')}</div>`;
}

/* ── 앉은 횟수별 색 칸 ── */
function slotsHTML () {
  const slots = VISIT_LEVELS.map(n => {
    const hex = visitHex(n);
    return `
    <div class="lv-slot js-slot${hex ? '' : ' empty'}" data-lv="${n}"${hex ? ` style="--c:${hex}"` : ''}>
      <span class="chip"${hex ? ` style="background:${hex}"` : ''}></span>
      <span class="lv">${visitLabel(n)}</span>
    </div>`;
  }).join('');

  return `<div class="lv-picker">
    <p class="field-lbl">앉은 횟수별 색 ${heldColor
      ? `<b class="held">— ${(SEAT_COLORS.find(c => c.id === heldColor) || {}).label} 들고 있음 · 칸을 누르세요.</b>`
      : '— 위에서 색을 선택하고, 아래 관람 횟수 칸을 눌러 지정하세요.'}</p>
    <div class="lv-slots">${slots}</div>
  </div>`;
}

/* ── 좌석 배치도 — 1·2·3층 전부, 읽기 전용.
   색은 관극 기록에서만 채워진다 (앉은 횟수마다 다른 색). ── */
function seatMapHTML (list) {
  const counts = seatVisitCounts(list);
  const aisleScale = .35;
  const floorGrids = SEAT_MAP.floors.map(floor => {
    const g = floorGrid(floor);
    const occupied = new Set(floor.rows.flatMap(row => seatRowCells(floor, row).map(c => c.gc)));
    const aisleCols = new Set(g.labelGc.slice(1, -1)
      .flatMap(gc => Array.from({ length:AISLE_W }, (_, i) => gc + i)));
    const units = Array.from({ length:g.cols }, (_, i) =>
      occupied.has(i + 1) ? 1 : aisleCols.has(i + 1) ? aisleScale : 0)
      .reduce((sum, n) => sum + n, 0);
    return { floor, g, occupied, aisleCols, units };
  });
  const mapCols = Math.max(...floorGrids.map(({ units }) => units));
  const mapSeats = Math.max(...floorGrids.map(({ occupied }) => occupied.size));
  const mapAisles = Math.max(...floorGrids.map(({ aisleCols }) => aisleCols.size));

  const floors = floorGrids.map(({ floor, g, occupied, aisleCols }) => {
    const tracks = Array.from({ length:g.cols }, (_, i) =>
      occupied.has(i + 1) ? 'var(--seat)' : aisleCols.has(i + 1) ? 'var(--aisle)' : '0px').join(' ');

    // 열번호는 좌·우 통로 두 곳에만 인쇄한다 (양 끝 열번호는 없앰 — 좌석을 폭에 꽉 채우려고)
    const labelsFor = r => g.labelGc.map((gc, i) => {
      if (i === 0 || i === g.labelGc.length - 1) return '';
      return `<span class="rl" style="grid-column:${gc}/span ${AISLE_W}">${r}</span>`;
    }).join('');

    const floorRows = floor.rows.map(row => seatRowCells(floor, row));
    const rowCounts = floorRows.map(cells => new Map(cells.map(c => [c.gc, counts.get(c.id) || 0])));
    const rows = floor.rows.map((row, ri) => {
      const current = rowCounts[ri], above = rowCounts[ri - 1], below = rowCounts[ri + 1];
      const cells = floorRows[ri].map(c => {
        const n = counts.get(c.id) || 0;
        const fill = n ? visitHex(n) : null;
        const style = `grid-column:${c.gc}` + (fill ? `;background-color:${fill}` : '');
        const label = `${seatLabel(c.id)}${n ? ' · ' + n + '회' : ''}`;
        const edges = [
          !current.has(c.gc + 1) && 'edge-r',
          !below?.has(c.gc) && 'edge-b',
          !n && current.get(c.gc - 1) && 'strong-l',
          !n && above?.get(c.gc) && 'strong-t'
        ].filter(Boolean).join(' ');
        // 방문 좌석은 항상 번호를, 나머지는 5의 배수만 옅게 (칸이 작아 다 넣으면 못 읽는다)
        return `<span class="seat${n ? ' on' : ''}${n && !fill ? ' nofill' : ''}${edges ? ' ' + edges : ''}" style="${style}"
                  role="img" aria-label="${label}"
                >${(n || +c.no % 5 === 0) ? c.no : ''}</span>`;
      }).join('');
      return `<div class="seatrow" style="grid-template-columns:${tracks}">${labelsFor(row.r)}${cells}</div>`;
    }).join('');

    return `<div class="st-floor">
      <span class="st-floor-lbl">${floor.label}</span>
      ${floor.id === '1' ? '<div class="stage-bar">S T A G E</div>' : ''}
      <div class="seatmap-wrap"><div class="seatmap">${rows}</div></div>
    </div>`;
  }).join('');

  return `<div class="is-fit" style="--map-cols:${mapCols};--map-seats:${mapSeats};--map-aisles:${mapAisles}"><p class="map-hint">← 좌우로 밀어서 전체 보기 →</p><div class="seatmap-scroll"><div class="seatmaps">${floors}</div></div></div>`;
}

/* ── 관극 기록 (실제로 본 회차 목록) ── */
function recordsHTML (list) {
  const rows = list.length
    ? list.map(({ rec, perf }) => `<div class="rec-card">
        <div class="top">
          <span class="when">${perf.m}.${perf.d} ${perf.t}</span>
          <span class="seatinfo">${rec.seat ? seatLabel(rec.seat) : '좌석 미정'}</span>
        </div>
        <div class="cast">${castLine(perf)}</div>
        ${delMode ? `<button type="button" class="rec-x js-rec-del" data-key="${rec.key}" aria-label="이 기록 삭제">✕</button>` : ''}
      </div>`).join('')
    : `<p class="rec-empty">아직 담은 회차가 없습니다. 아래 &ldquo;기록 추가&rdquo;에서 회차와 좌석을 넣거나, 스케줄 탭에서 &ldquo;이 회차 담기&rdquo;를 눌러보세요.</p>`;

  return `<div class="st-sec" id="records">
    <div class="st-sec-head">
      <h3>관극 기록</h3>
      <div class="head-tools">
        <span class="cnt">${list.length}건</span>
        ${list.length ? `<button type="button" class="np-btn ghost sm js-del-mode" aria-pressed="${delMode}">${delMode ? '완료' : '삭제'}</button>` : ''}
      </div>
    </div>
    <div>${rows}</div>
    ${addRecordHTML()}
  </div>`;
}

/* ── 페어 조합 즐겨찾기 (배역별 상대 배우 조합을 골라 담아 둔다) ── */
function favoritePairsHTML (list) {
  const picker = doubleRoles().map(r => {
    const chips = r.actors.map(aId => {
      const on = pairFix[r.id] === aId;
      return `<button type="button" class="chip js-pair-fix" data-role="${r.id}" data-actor="${aId}" aria-pressed="${on}">${actorName(aId)}</button>`;
    }).join('');
    return `<div class="role-row"><span class="role-name">${r.name}</span><div class="chips">${chips}</div></div>`;
  }).join('');

  const hasFix    = Object.keys(pairFix).length > 0;
  const alreadyFav = favoritePairs.some(f => pairFixKey(f) === pairFixKey(pairFix));
  const canFav     = hasFix && !alreadyFav && favoritePairs.length < FAVORITE_MAX;

  const composer = `<div class="pair-fix">
    <p class="field-lbl">배역별 상대 배우 고르기</p>
    ${picker}
    <div class="pair-foot">
      ${hasFix ? `<button type="button" class="np-btn ghost sm js-pair-clear">선택 해제</button>` : ''}
      <button type="button" class="np-btn ghost sm js-fav-add" ${canFav ? '' : 'disabled'}>
        ${alreadyFav ? '★ 이미 담음' : '☆ 이 조합 담기'}
      </button>
    </div>
  </div>`;

  const saved = favoritePairs.length
    ? favoritePairs.map((fix, i) => `<div class="rec-row">
        <span class="pair">${pairLabel(fix)}</span>
        <span class="num">${recordsMatchingFix(list, fix).length}회</span>
        <button type="button" class="np-btn ghost sm js-fav-remove" data-i="${i}">빼기</button>
      </div>`).join('')
    : `<p class="rec-empty">위에서 배역별로 상대 배우를 고르고 ☆ 로 담으세요 (최대 ${FAVORITE_MAX}개). 담은 조합만 정산판 이미지에 들어갑니다.</p>`;

  return `<div class="st-sec">
    <div class="st-sec-head">
      <h3>페어 조합 즐겨찾기</h3>
      <span class="cnt">${favoritePairs.length}/${FAVORITE_MAX}</span>
    </div>
    ${composer}
    ${saved}
  </div>`;
}

/* 그 회차 캐스팅 한 줄 — 강홍석은 굵게 */
const castLine = perf => ROLES
  .filter(r => perf.cast[r.id])
  .map(r => perf.cast[r.id] === HONG
    ? `<b>${actorName(perf.cast[r.id])}</b>`
    : actorName(perf.cast[r.id]))
  .join(' · ');

/* ── 기록 추가 — 회차 + 층·열·번호를 골라 담는다 ── */
function addRecordHTML () {
  const taken = new Set(MY_RECORDS.map(r => r.key));
  const opts = PERFS
    .filter(p => !hongOnly || isHongPerf(p))
    .sort(cmpPerf);

  if (!opts.length) return `<div class="rec-add"><p class="rec-empty">담을 수 있는 회차가 더 없습니다.</p></div>`;

  const perfSel = opts.map(p => {
    const k = perfKey(p);
    const isTaken = taken.has(k);
    return `<option value="${k}"${isTaken ? ' disabled' : ''}${k === newRecKey ? ' selected' : ''}>${p.m}월 ${p.d}일 ${p.t}${isTaken ? ' · 기록 있음' : ''}</option>`;
  }).join('');

  const floor = floorById(newFloor) || SEAT_MAP.floors[0];
  const row   = floor.rows.find(r => r.r === newRow) || floor.rows[0];
  const seats = seatsInRow(floor, row);

  const opt = (v, label, on) => `<option value="${v}"${on ? ' selected' : ''}>${label}</option>`;

  return `<div class="rec-add">
    <p class="field-lbl">기록 추가</p>
    <div class="rec-add-row">
      <select class="js-rec-perf" aria-label="회차">${perfSel}</select>
      <select class="js-nf" aria-label="층">${SEAT_MAP.floors.map(f => opt(f.id, f.label, f.id === floor.id)).join('')}</select>
      <select class="js-nr" aria-label="열">${floor.rows.map(r => opt(r.r, r.r + '열', r.r === row.r)).join('')}</select>
      <select class="js-nn" aria-label="번호">${seats.map(s => opt(s.no, s.no + '번', String(s.no) === String(newNo))).join('')}</select>
      <button type="button" class="np-btn sm js-rec-add">＋ 담기</button>
    </div>
  </div>`;
}

function setMapOverviewZoom (zoom, reset = false) {
  const dialog = $('#mapOverview');
  const stage = dialog.querySelector('.map-overview-stage');
  const content = dialog.querySelector('.map-overview-content');
  const centerX = reset ? .5 : (stage.scrollLeft + stage.clientWidth / 2) / Math.max(stage.scrollWidth, 1);
  const centerY = reset ? 0 : (stage.scrollTop + stage.clientHeight / 2) / Math.max(stage.scrollHeight, 1);
  overviewZoom = Math.max(.5, Math.min(3, zoom));
  content.style.zoom = overviewZoom;
  dialog.querySelector('.map-overview-zoom').textContent = `${Math.round(overviewZoom * 100)}%`;
  dialog.querySelector('.js-map-zoom-out').disabled = overviewZoom <= .5;
  dialog.querySelector('.js-map-zoom-in').disabled = overviewZoom >= 3;
  requestAnimationFrame(() => {
    stage.scrollLeft = stage.scrollWidth * centerX - stage.clientWidth / 2;
    stage.scrollTop = reset ? 0 : stage.scrollHeight * centerY - stage.clientHeight / 2;
  });
}

function fitMapOverview () {
  const dialog = $('#mapOverview');
  if (!dialog.open) return;
  setMapOverviewZoom(overviewZoom);
}

let settlementExportFramePromise;
function settlementExportFrame () {
  if (settlementExportFramePromise) return settlementExportFramePromise;
  settlementExportFramePromise = new Promise((resolve, reject) => {
    const frame = document.createElement('iframe');
    frame.src = 'settlement-export.html';
    frame.title = '정산판 이미지 생성';
    frame.setAttribute('aria-hidden', 'true');
    Object.assign(frame.style, {
      position:'fixed', left:'-20000px', top:'0', width:'1586px', height:'992px',
      border:'0', pointerEvents:'none'
    });
    frame.onload = async () => {
      try {
        await frame.contentWindow.previewReady;
        resolve(frame);
      } catch (error) {
        settlementExportFramePromise = null;
        frame.remove();
        reject(error);
      }
    };
    frame.onerror = () => {
      settlementExportFramePromise = null;
      frame.remove();
      reject(Error('정산판 이미지 템플릿을 불러오지 못했습니다.'));
    };
    document.body.append(frame);
  });
  return settlementExportFramePromise;
}

let pendingSettlementImage;
function clearSettlementPreview () {
  if (pendingSettlementImage?.url) URL.revokeObjectURL(pendingSettlementImage.url);
  pendingSettlementImage = null;
  $('#savePreviewImage').removeAttribute('src');
}

async function previewSettlementImage (button) {
  const original = button.textContent;
  button.disabled = true;
  button.textContent = '미리보기 만드는 중…';
  try {
    const frame = await settlementExportFrame();
    const target = frame.contentWindow;
    const performances = PERFS.filter(perf =>
      (!hongOnly || isHongPerf(perf)) && (!completedOnly || isPast(perf))
    );
    const records = myRecords();
    const pairs = favoritePairs.slice(0, FAVORITE_MAX).map(fix => ({
      names:ROLES.filter(role => fix[role.id]).map(role => actorName(fix[role.id])).slice(0, 4),
      watched:recordsMatchingFix(records, fix).length,
      total:performances.filter(perf => Object.entries(fix).every(([role, actor]) => perf.cast[role] === actor)).length
    }));
    target.setSettlementPreview({ visitColors:{ ...visitColors }, records, performances });
    target.setPairCombinations(pairs);
    await new Promise(resolve => target.requestAnimationFrame(() => target.requestAnimationFrame(resolve)));
    const blob = await target.exportSettlementPng();
    const url = URL.createObjectURL(blob);
    clearSettlementPreview();
    pendingSettlementImage = { blob, url };
    $('#savePreviewImage').src = url;
    $('#savePreview').showModal();
    button.textContent = original;
  } catch (error) {
    console.error('[정산판 이미지 저장]', error);
    alert('이미지를 만드는 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.');
    button.textContent = original;
  } finally {
    button.disabled = false;
  }
}

/* ═══════════════════════════════════════════════════════════
   이벤트 바인딩
   ═══════════════════════════════════════════════════════════ */
function bind () {
  const pin = $('.js-pin');
  if (pin) pin.addEventListener('click', () => {
    hongOnly = !hongOnly; pairFix = {};
    track('toggle_pin', { hong_only:hongOnly });
    render();
  });

  const completed = $('.js-completed-only');
  if (completed) completed.addEventListener('change', () => {
    completedOnly = completed.checked;
    pairFix = {};
    render();
  });

  const overview = $('#mapOverview');
  const overviewOpen = $('.js-map-overview');
  if (overviewOpen) overviewOpen.addEventListener('click', () => {
    overview.querySelector('.map-overview-content').innerHTML = seatMapHTML(myRecords());
    overview.showModal();
    requestAnimationFrame(() => setMapOverviewZoom(1, true));
  });
  overview.querySelector('.js-map-zoom-out').onclick = () => setMapOverviewZoom(overviewZoom - .25);
  overview.querySelector('.js-map-zoom-in').onclick = () => setMapOverviewZoom(overviewZoom + .25);
  overview.querySelector('.js-map-overview-close').onclick = () => overview.close();
  overview.onclose = () => { overview.querySelector('.map-overview-content').innerHTML = ''; };

  // 팔레트: 끌거나(데스크톱) 눌러서 들기(터치)
  $$('.js-pal').forEach(b => {
    b.addEventListener('dragstart', e => {
      heldColor = b.dataset.color;
      e.dataTransfer.setData('text/plain', heldColor);
      e.dataTransfer.effectAllowed = 'copy';
    });
    b.addEventListener('click', () => {
      heldColor = heldColor === b.dataset.color ? null : b.dataset.color;
      popSwatch(b);
      render();
    });
  });

  // 횟수 칸: 놓거나(드롭) 들고 있는 색으로 눌러서 지정
  $$('.js-slot').forEach(slot => {
    const assign = id => {
      if (!id) return;
      visitColors[+slot.dataset.lv] = id;
      saveVisitColors();
      track('set_visit_color', { level:+slot.dataset.lv, color:id });
      heldColor = null;
      render();
    };
    slot.addEventListener('dragover', e => { e.preventDefault(); slot.classList.add('over'); });
    slot.addEventListener('dragleave', () => slot.classList.remove('over'));
    slot.addEventListener('drop', e => {
      e.preventDefault(); slot.classList.remove('over');
      assign(e.dataTransfer.getData('text/plain'));
    });
    slot.addEventListener('click', () => assign(heldColor));
  });

  const recPerf = $('.js-rec-perf');
  if (recPerf) recPerf.addEventListener('change', e => { newRecKey = e.target.value; });

  const nf = $('.js-nf');
  if (nf) nf.addEventListener('change', e => { newFloor = e.target.value; newRow = null; newNo = null; render(); });
  const nr = $('.js-nr');
  if (nr) nr.addEventListener('change', e => { newRow = e.target.value; newNo = null; render(); });
  const nn = $('.js-nn');
  if (nn) nn.addEventListener('change', e => { newNo = e.target.value; });

  const recAdd = $('.js-rec-add');
  if (recAdd) recAdd.addEventListener('click', () => {
    const key = ($('.js-rec-perf') || {}).value || newRecKey;
    const f = ($('.js-nf') || {}).value, r = ($('.js-nr') || {}).value, n = ($('.js-nn') || {}).value;
    if (!key || MY_RECORDS.some(x => x.key === key)) return;
    const seat = (f && r && n) ? seatId(f, r, n) : null;
    MY_RECORDS.push({ key, seat });
    track('add_record', { has_seat:!!seat, source:'settlement' });
    saveRecords();
    newRecKey = null;
    render();
  });

  const delBtn = $('.js-del-mode');
  if (delBtn) delBtn.addEventListener('click', () => { delMode = !delMode; render(); });

  $$('.js-rec-del').forEach(b => b.addEventListener('click', () => {
    MY_RECORDS = MY_RECORDS.filter(r => r.key !== b.dataset.key);
    removeRecordRemote(b.dataset.key);
    track('delete_record', {});
    saveRecords();
    if (!MY_RECORDS.length) delMode = false;
    render();
  }));

  const cta = $('.js-login-cta');
  if (cta) cta.addEventListener('click', () => openAuthModal());

  $$('.js-pair-fix').forEach(b => b.addEventListener('click', () => {
    const { role, actor } = b.dataset;
    if (pairFix[role] === actor) delete pairFix[role]; else pairFix[role] = actor;
    render();
  }));

  const clear = $('.js-pair-clear');
  if (clear) clear.addEventListener('click', () => { pairFix = {}; render(); });

  const favAdd = $('.js-fav-add');
  if (favAdd) favAdd.addEventListener('click', () => {
    if (!Object.keys(pairFix).length) return;
    const key = pairFixKey(pairFix);
    if (favoritePairs.length >= FAVORITE_MAX || favoritePairs.some(f => pairFixKey(f) === key)) return;
    favoritePairs.push({ ...pairFix });
    saveFavoritePairs();
    track('add_favorite_pair', {});
    render();
  });

  $$('.js-fav-remove').forEach(b =>
    b.addEventListener('click', () => { favoritePairs.splice(+b.dataset.i, 1); saveFavoritePairs(); render(); }));

  const save = $('.js-save');
  if (save) save.addEventListener('click', () => previewSettlementImage(save));
}

/* ═══ 초기화 ═══ */
function updateTodayStamp () {
  $('#todayStamp').textContent =
    `${TODAY.y}.${String(TODAY.m).padStart(2,'0')}.${String(TODAY.d).padStart(2,'0')} (${WD_NAME[new Date(TODAY.y, TODAY.m - 1, TODAY.d).getDay()]})`;
}

updateTodayStamp();
window.addEventListener('todaychange', () => {
  updateTodayStamp();
  render();
});
window.addEventListener('performancechange', render);
window.addEventListener('resize', fitMapOverview);

$('#savePreview').addEventListener('close', clearSettlementPreview);
$('.js-save-later').addEventListener('click', () => $('#savePreview').close());
$('.js-save-confirm').addEventListener('click', () => {
  if (!pendingSettlementImage) return;
  const link = document.createElement('a');
  const stamp = new Date().toLocaleDateString('sv-SE', { timeZone:'Asia/Seoul' });
  link.href = pendingSettlementImage.url;
  link.download = `엘리자벳-2026-6연-정산판-${stamp}.png`;
  document.body.append(link);
  link.click();
  link.remove();
  $('#savePreview').close();
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

render();
enter();

/* Supabase 로그인 — 세션 확인되면 콜백으로 재렌더 (게이트 열림/닫힘) */
mountAuth(isIn => {
  loggedIn = isIn;
  visitColors = loadVisitColors();
  favoritePairs = loadFavoritePairs();
  render();
});
