/* ═══════════════════════════════════════════════════════════
   애배력 — 공용 데이터 · 헬퍼 (PRD_v3)
   ───────────────────────────────────────────────────────────
   스케줄 탭(index.html)과 정산판 탭(settlement.html)이 같은 회차·기록
   데이터를 쓰므로 한 파일로 분리한다. 각 페이지는 이 파일을 먼저 로드한 뒤
   자기 화면 스크립트를 실행한다.

   ⚠️ 이 파일의 값은 전부 플레이스홀더다.
      강홍석을 제외한 배우 이름, 회차 일정, 배역별 캐스팅, 이벤트, 극장·기간은
      모두 가상이며 실제 공연 정보가 아니다. 운영자가 캐스팅표/스케줄을
      (이미지·텍스트로) 제공하면 이 파일만 교체한다 — 화면 코드는 손대지 않는다.
   ═══════════════════════════════════════════════════════════ */

/* ── 작품 ──  TODO: 실데이터 (극장명, 공연 기간, 포스터) */
const WORK = {
  title:  '엘리자벳',
  venue:  '',                                        // TODO: 예) 블루스퀘어 신한카드홀
  period: { start: '2026-08-01', end: '2026-10-31' } // TODO: 실제 공연 기간
};

/* ── 고정 주체 ── 정산판 기본값. "고정 해제" 시에만 공동출연 배우로 전환된다. */
const HONG = 'hong';

/* ── 배우 ── hong 외에는 전부 가상 이름.  TODO: 실제 공동출연진으로 교체
   photo: 강홍석 썸네일 자리. 비어 있으면 이니셜 플레이스홀더로 그린다.
          배치·스타일은 디자인 단계에서 결정 (PRD_v3 3.2). */
const ACTORS = {
  hong: { name: '강홍석', photo: '' },
  c1:   { name: '서은우', photo: '' },
  c2:   { name: '한도현', photo: '' },
  c3:   { name: '유지안', photo: '' },
  c4:   { name: '노가람', photo: '' },
  c5:   { name: '임세라', photo: '' },
  c6:   { name: '백주원', photo: '' }
};

/* ── 배역 ── 엘리자벳 주요 배역. actors = 더블/트리플 캐스팅 풀.
   강홍석 배역은 '루케니'로 가정해 심는다.  TODO: 실캐스팅 확인
   (id는 회차 cast 키와 맞물려 있어 그대로 두고, 표시 이름만 배정한다) */
const ROLES = [
  { id: 'tod',     name: '루케니',   actors: ['hong', 'c1'] },
  { id: 'eli',     name: '엘리자벳', actors: ['c2', 'c3'] },
  { id: 'lucheni', name: '죽음',     actors: ['c4', 'c5'] },
  { id: 'rudolf',  name: '루돌프',   actors: ['c6'] }
];

/* ── 회차 ── 엘리자벳 전체 회차(강홍석 포함/미포함 섞임).
   스케줄 탭은 hongPerfs()로 강홍석 회차만 걸러 보여준다.
   cast = { 배역id: 배우id },  t = 'HH:MM',  events?/history? 선택.
   TODO: 실제 회차 일정·캐스팅·이벤트로 교체 */
const PERFS = [
  // ── 2026년 8월 ──
  { y:2026, m:8,  d:12, t:'19:30', cast:{ tod:'hong', eli:'c2', lucheni:'c4', rudolf:'c6' },
    events:[{ label:'첫공 무대인사', verified:true }] },
  { y:2026, m:8,  d:15, t:'14:00', cast:{ tod:'c1',   eli:'c3', lucheni:'c5', rudolf:'c6' } },
  { y:2026, m:8,  d:15, t:'19:00', cast:{ tod:'hong', eli:'c2', lucheni:'c4', rudolf:'c6' } },
  { y:2026, m:8,  d:22, t:'14:00', cast:{ tod:'hong', eli:'c3', lucheni:'c5', rudolf:'c6' },
    events:[{ label:'포토타임', verified:true }] },
  { y:2026, m:8,  d:29, t:'19:00', cast:{ tod:'hong', eli:'c2', lucheni:'c4', rudolf:'c6' } },

  // ── 2026년 9월 ──
  { y:2026, m:9,  d:2,  t:'19:30', cast:{ tod:'hong', eli:'c3', lucheni:'c5', rudolf:'c6' } },
  { y:2026, m:9,  d:5,  t:'14:00', cast:{ tod:'c1',   eli:'c2', lucheni:'c4', rudolf:'c6' } },
  { y:2026, m:9,  d:6,  t:'14:00', cast:{ tod:'hong', eli:'c2', lucheni:'c4', rudolf:'c6' },
    history:{ role:'루케니', from:'서은우', to:'강홍석', when:'09.04 18:00' } },
  { y:2026, m:9,  d:12, t:'19:00', cast:{ tod:'hong', eli:'c3', lucheni:'c5', rudolf:'c6' } },
  { y:2026, m:9,  d:19, t:'14:00', cast:{ tod:'hong', eli:'c2', lucheni:'c4', rudolf:'c6' },
    events:[{ label:'커튼콜 촬영', verified:false }] },
  { y:2026, m:9,  d:23, t:'19:30', cast:{ tod:'c1',   eli:'c3', lucheni:'c5', rudolf:'c6' } },
  { y:2026, m:9,  d:26, t:'19:00', cast:{ tod:'hong', eli:'c3', lucheni:'c5', rudolf:'c6' } },

  // ── 2026년 10월 ──
  { y:2026, m:10, d:3,  t:'14:00', cast:{ tod:'hong', eli:'c2', lucheni:'c4', rudolf:'c6' } },
  { y:2026, m:10, d:10, t:'19:00', cast:{ tod:'hong', eli:'c3', lucheni:'c4', rudolf:'c6' } },
  { y:2026, m:10, d:17, t:'14:00', cast:{ tod:'c1',   eli:'c2', lucheni:'c5', rudolf:'c6' } },
  { y:2026, m:10, d:25, t:'19:00', cast:{ tod:'hong', eli:'c2', lucheni:'c5', rudolf:'c6' },
    events:[{ label:'막공', verified:true }, { label:'커튼콜 촬영', verified:true }] }
];

const TODAY = { y:2026, m:9, d:3 };
const RANGE = { min:{ y:2026, m:8 }, max:{ y:2026, m:10 } };

/* ── 좌석 ── 실좌표 에디터가 아니라 단순화한 대표 격자 (PRD_v3 4.1, 8장 오픈이슈).
   실제 배치도는 작품마다 별도 준비. */
const SEAT_ROWS = ['가', '나', '다', '라', '마'];
const SEAT_COLS = 8;

/* 좌석 색 — 유저가 정산판에서 자유롭게 고르는 색 (PRD_v3 4.1 / v2 7.2).
   DESIGN2.md의 구분색 --cat-*와는 별개(구분색은 버튼·개인선택 UI에 쓰지 않는다). */
const SEAT_COLORS = [
  { id:'plum',  hex:'#7A3E73', label:'자두' },
  { id:'teal',  hex:'#1F7A6C', label:'청록' },
  { id:'amber', hex:'#9C6B10', label:'호박' },
  { id:'slate', hex:'#3D5A80', label:'남색' },
  { id:'moss',  hex:'#556B2F', label:'이끼' },
  { id:'rose',  hex:'#A6415A', label:'장미' }
];

/* ── 개인 관극 기록 ── my_records 테이블의 목업 (PRD_v3 5장).
   전부 강홍석(죽음) 회차. 새로고침하면 초기화된다. */
let MY_RECORDS = [
  { key:'2026|8|12|19:30', seat:'가-3' },
  { key:'2026|8|22|14:00', seat:'가-3' },
  { key:'2026|8|29|19:00', seat:'나-5' },
  { key:'2026|9|6|14:00',  seat:'나-5' },
  { key:'2026|9|12|19:00', seat:'다-2' },
  { key:'2026|9|19|14:00', seat:'다-2' }
];

/* ═══ 공용 헬퍼 ═══ */
const $  = s => document.querySelector(s);
const el = h => { const t = document.createElement('template'); t.innerHTML = h.trim(); return t.content.firstChild; };
const catVar = i => `--cat-${(i % 8) + 1}`;

const perfKey  = p => [p.y, p.m, p.d, p.t].join('|');
const daysIn   = (y, m) => new Date(y, m, 0).getDate();
const firstDow = (y, m) => new Date(y, m - 1, 1).getDay();
const idx      = o => o.y * 12 + o.m;
const sameP    = (a, b) => a.y === b.y && a.m === b.m && a.d === b.d && a.t === b.t;
const dow      = p => ['일','월','화','수','목','금','토'][new Date(p.y, p.m - 1, p.d).getDay()] + '요일';

const roleOf     = id => ROLES.find(r => r.id === id);
const actorName  = id => (ACTORS[id] || {}).name || '—';
const perfFromKey = key => {
  const [y, m, d, t] = key.split('|');
  return PERFS.find(p => p.y === +y && p.m === +m && p.d === +d && p.t === t);
};

/* 강홍석이 오르는 회차만 */
const isHongPerf = p => Object.values(p.cast).includes(HONG);
const hongPerfs  = () => PERFS.filter(isHongPerf);

/* 강홍석이 맡은 배역 (이 회차 기준) */
const hongRole = p => ROLES.find(r => p.cast[r.id] === HONG) || null;

const recordFor = p => MY_RECORDS.find(r => r.key === perfKey(p));

/* 특정 배우가 오르는 회차 수 (정산판 분모) */
const assignedCount = actorId => PERFS.filter(p => Object.values(p.cast).includes(actorId)).length;

const cmpPerf = (a, b) =>
  (a.y - b.y) || (a.m - b.m) || (a.d - b.d) || a.t.localeCompare(b.t);

const isPast = p => (p.y * 10000 + p.m * 100 + p.d) < (TODAY.y * 10000 + TODAY.m * 100 + TODAY.d);
