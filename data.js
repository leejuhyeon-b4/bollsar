/* ═══════════════════════════════════════════════════════════
   애배력 — 공용 데이터 · 헬퍼 (PRD_v3)
   ───────────────────────────────────────────────────────────
   스케줄 탭(index.html)과 정산판 탭(settlement.html)이 같은 회차·기록
   데이터를 쓰므로 한 파일로 분리한다. 각 페이지는 이 파일을 먼저 로드한 뒤
   자기 화면 스크립트를 실행한다.

   데이터 출처: 운영자 제공 〈캐스팅 스케줄〉 4장 (ref/KakaoTalk_20260909_*.jpg).
     프리뷰 2026-08-16 ~ 현재까지 공개된 마지막 회차 2026-10-23.
     후속 스케줄이 올라오면 이 파일의 PERFS(및 필요 시 RANGE.max)만 교체한다 —
     화면 코드는 손대지 않는다.

   ⚠️ 아직 미확인: 실제 막공일(폐막 ~2026-11-15 예정, 마지막 회차 미발표), 배우 사진.
   ═══════════════════════════════════════════════════════════ */

/* ── 작품 ── */
const WORK = {
  title:  '엘리자벳',
  run:    '6연',                                     // 한국 초연부터 세어 여섯 번째 시즌
  venue:  '블루스퀘어 우리은행홀',
  period: { start: '2026-08-16', end: '2026-11-15' },  // 폐막 2026.11.15
  poster: ''                                         // TODO: 2026 엘리자벳 공식 포스터를 ref/에 넣고 경로만 적기
};

/* ── 고정 주체 ── 정산판 기본값. "고정 해제" 시에만 공동출연 배우로 전환된다.
   강홍석은 '루케니' 역. cast 값이 이 상수와 일치할 때 강홍석 회차로 친다. */
const HONG = 'hong';

/* ── 배우 ── 배역별 캐스팅 풀. photo: 관리자 업로드 자리(비면 이니셜 플레이스홀더). */
const ACTORS = {
  hong: { name: '강홍석', photo: '' },
  // 엘리자벳
  rina: { name: '린아',   photo: '' },
  ljh:  { name: '이지혜', photo: '' },
  ljs:  { name: '이지수', photo: '' },
  pjy:  { name: '박지연', photo: '' },
  // 토드
  kjs:  { name: '김준수', photo: '' },
  kai:  { name: '카이',   photo: '' },
  kes:  { name: '고은성', photo: '' },
  sgs:  { name: '서경수', photo: '' },
  // 루케니
  pet:  { name: '박은태', photo: '' },
  ny:   { name: '노윤',   photo: '' },
  // 요제프
  myg:  { name: '민영기', photo: '' },
  pms:  { name: '박민성', photo: '' },
  // 소피
  sjy:  { name: '서지영', photo: '' },
  ja:   { name: '주아',   photo: '' },
  // 루돌프
  kws:  { name: '김우성', photo: '' },
  jys:  { name: '장윤석', photo: '' }
};

/* ── 배역 ── 엘리자벳 주요 6배역. actors = 더블/트리플 캐스팅 풀.
   id는 회차 cast 키와 맞물린다. */
const ROLES = [
  { id: 'eli',     name: '엘리자벳', actors: ['rina', 'ljh', 'ljs', 'pjy'] },
  { id: 'tod',     name: '토드',     actors: ['kjs', 'kai', 'kes', 'sgs'] },
  { id: 'lucheni', name: '루케니',   actors: ['pet', 'ny', 'hong'] },
  { id: 'josef',   name: '요제프',   actors: ['myg', 'pms'] },
  { id: 'sophie',  name: '소피',     actors: ['sjy', 'ja'] },
  { id: 'rudolf',  name: '루돌프',   actors: ['kws', 'jys'] }
];

/* ── 회차 ── 엘리자벳 전체 회차(강홍석 포함/미포함 섞임).
   스케줄 탭은 hongPerfs()로 강홍석 회차만 걸러 보여준다.
   cast = { 배역id: 배우id },  t = 'HH:MM',  events? 선택.
   시간 표기 변환: 2시→14:00 · 3시→15:00 · 7시→19:00 · 2시30분→14:30 · 7시30분→19:30
   이벤트: 현재 확정된 건 9/9·9/12·9/13 커튼콜데이(강홍석 회차)뿐. */
const PERFS = [
  // ── 2026년 8월 ──
  { y:2026, m:8, d:16, t:'19:00', cast:{ eli:'rina', tod:'kai', lucheni:'hong', josef:'pms', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:8, d:17, t:'15:00', cast:{ eli:'ljh',  tod:'sgs', lucheni:'pet',  josef:'myg', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:8, d:19, t:'14:30', cast:{ eli:'ljs',  tod:'kes', lucheni:'ny',   josef:'myg', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:8, d:19, t:'19:30', cast:{ eli:'ljh',  tod:'kai', lucheni:'pet',  josef:'myg', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:8, d:20, t:'19:30', cast:{ eli:'rina', tod:'sgs', lucheni:'hong', josef:'pms', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:8, d:21, t:'14:30', cast:{ eli:'ljh',  tod:'kes', lucheni:'pet',  josef:'myg', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:8, d:21, t:'19:30', cast:{ eli:'ljs',  tod:'kai', lucheni:'ny',   josef:'myg', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:8, d:22, t:'14:00', cast:{ eli:'rina', tod:'sgs', lucheni:'hong', josef:'pms', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:8, d:22, t:'19:00', cast:{ eli:'ljh',  tod:'kes', lucheni:'pet',  josef:'pms', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:8, d:23, t:'15:00', cast:{ eli:'rina', tod:'kai', lucheni:'ny',   josef:'myg', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:8, d:25, t:'19:30', cast:{ eli:'ljs',  tod:'sgs', lucheni:'hong', josef:'pms', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:8, d:26, t:'14:30', cast:{ eli:'rina', tod:'kai', lucheni:'pet',  josef:'pms', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:8, d:26, t:'19:30', cast:{ eli:'ljs',  tod:'kes', lucheni:'ny',   josef:'pms', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:8, d:27, t:'19:30', cast:{ eli:'ljh',  tod:'sgs', lucheni:'hong', josef:'myg', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:8, d:28, t:'14:30', cast:{ eli:'ljs',  tod:'kes', lucheni:'ny',   josef:'myg', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:8, d:28, t:'19:30', cast:{ eli:'rina', tod:'kai', lucheni:'pet',  josef:'myg', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:8, d:29, t:'14:00', cast:{ eli:'ljh',  tod:'sgs', lucheni:'ny',   josef:'pms', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:8, d:29, t:'19:00', cast:{ eli:'rina', tod:'kai', lucheni:'hong', josef:'pms', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:8, d:30, t:'15:00', cast:{ eli:'ljs',  tod:'kes', lucheni:'pet',  josef:'myg', sophie:'sjy', rudolf:'jys' } },

  // ── 2026년 9월 ──
  { y:2026, m:9, d:1,  t:'19:30', cast:{ eli:'ljs',  tod:'kai', lucheni:'hong', josef:'pms', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:9, d:2,  t:'14:30', cast:{ eli:'rina', tod:'kes', lucheni:'ny',   josef:'myg', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:9, d:2,  t:'19:30', cast:{ eli:'ljh',  tod:'sgs', lucheni:'pet',  josef:'myg', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:9, d:3,  t:'19:30', cast:{ eli:'rina', tod:'kes', lucheni:'ny',   josef:'pms', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:9, d:4,  t:'14:30', cast:{ eli:'ljs',  tod:'kai', lucheni:'hong', josef:'myg', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:9, d:4,  t:'19:30', cast:{ eli:'ljh',  tod:'sgs', lucheni:'pet',  josef:'myg', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:9, d:5,  t:'14:00', cast:{ eli:'ljs',  tod:'kes', lucheni:'ny',   josef:'pms', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:9, d:5,  t:'19:00', cast:{ eli:'rina', tod:'kai', lucheni:'pet',  josef:'pms', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:9, d:6,  t:'15:00', cast:{ eli:'ljh',  tod:'sgs', lucheni:'hong', josef:'myg', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:9, d:8,  t:'19:30', cast:{ eli:'ljs',  tod:'kai', lucheni:'pet',  josef:'pms', sophie:'sjy', rudolf:'kws' } },
  { y:2026, m:9, d:9,  t:'14:30', cast:{ eli:'ljh',  tod:'kes', lucheni:'ny',   josef:'myg', sophie:'ja',  rudolf:'jys' } },
  { y:2026, m:9, d:9,  t:'19:30', cast:{ eli:'rina', tod:'sgs', lucheni:'hong', josef:'myg', sophie:'ja',  rudolf:'jys' }, events:[{ label:'커튼콜데이', verified:true }] },
  { y:2026, m:9, d:10, t:'19:30', cast:{ eli:'ljh',  tod:'kai', lucheni:'pet',  josef:'pms', sophie:'sjy', rudolf:'kws' } },
  { y:2026, m:9, d:11, t:'14:30', cast:{ eli:'ljs',  tod:'sgs', lucheni:'ny',   josef:'myg', sophie:'ja',  rudolf:'jys' } },
  { y:2026, m:9, d:11, t:'19:30', cast:{ eli:'rina', tod:'kes', lucheni:'pet',  josef:'myg', sophie:'ja',  rudolf:'jys' } },
  { y:2026, m:9, d:12, t:'14:00', cast:{ eli:'ljs',  tod:'kai', lucheni:'hong', josef:'pms', sophie:'sjy', rudolf:'kws' }, events:[{ label:'커튼콜데이', verified:true }] },
  { y:2026, m:9, d:12, t:'19:00', cast:{ eli:'rina', tod:'kes', lucheni:'ny',   josef:'pms', sophie:'sjy', rudolf:'kws' } },
  { y:2026, m:9, d:13, t:'15:00', cast:{ eli:'ljh',  tod:'sgs', lucheni:'hong', josef:'myg', sophie:'ja',  rudolf:'jys' }, events:[{ label:'커튼콜데이', verified:true }] },
  { y:2026, m:9, d:15, t:'19:30', cast:{ eli:'ljs',  tod:'kes', lucheni:'pet',  josef:'myg', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:9, d:16, t:'14:30', cast:{ eli:'rina', tod:'kai', lucheni:'ny',   josef:'pms', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:9, d:16, t:'19:30', cast:{ eli:'ljs',  tod:'sgs', lucheni:'pet',  josef:'pms', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:9, d:17, t:'19:30', cast:{ eli:'ljh',  tod:'kai', lucheni:'ny',   josef:'myg', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:9, d:18, t:'14:30', cast:{ eli:'rina', tod:'sgs', lucheni:'pet',  josef:'pms', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:9, d:18, t:'19:30', cast:{ eli:'ljh',  tod:'kes', lucheni:'ny',   josef:'pms', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:9, d:19, t:'14:00', cast:{ eli:'ljs',  tod:'kai', lucheni:'pet',  josef:'myg', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:9, d:19, t:'19:00', cast:{ eli:'rina', tod:'sgs', lucheni:'ny',   josef:'myg', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:9, d:20, t:'15:00', cast:{ eli:'ljh',  tod:'kes', lucheni:'pet',  josef:'pms', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:9, d:22, t:'19:30', cast:{ eli:'ljs',  tod:'sgs', lucheni:'ny',   josef:'myg', sophie:'sjy', rudolf:'kws' } },
  { y:2026, m:9, d:23, t:'14:00', cast:{ eli:'ljh',  tod:'kai', lucheni:'pet',  josef:'pms', sophie:'ja',  rudolf:'jys' } },
  { y:2026, m:9, d:23, t:'19:00', cast:{ eli:'ljs',  tod:'kes', lucheni:'ny',   josef:'pms', sophie:'ja',  rudolf:'jys' } },
  { y:2026, m:9, d:24, t:'15:00', cast:{ eli:'rina', tod:'sgs', lucheni:'pet',  josef:'myg', sophie:'sjy', rudolf:'kws' } },
  { y:2026, m:9, d:25, t:'14:00', cast:{ eli:'ljh',  tod:'kes', lucheni:'ny',   josef:'pms', sophie:'ja',  rudolf:'jys' } },
  { y:2026, m:9, d:25, t:'19:00', cast:{ eli:'ljs',  tod:'kai', lucheni:'hong', josef:'pms', sophie:'ja',  rudolf:'jys' } },
  { y:2026, m:9, d:26, t:'14:00', cast:{ eli:'ljh',  tod:'sgs', lucheni:'pet',  josef:'myg', sophie:'sjy', rudolf:'kws' } },
  { y:2026, m:9, d:26, t:'19:00', cast:{ eli:'rina', tod:'kes', lucheni:'hong', josef:'myg', sophie:'sjy', rudolf:'kws' } },
  { y:2026, m:9, d:27, t:'14:00', cast:{ eli:'ljs',  tod:'kai', lucheni:'pet',  josef:'pms', sophie:'ja',  rudolf:'jys' } },
  { y:2026, m:9, d:27, t:'19:00', cast:{ eli:'rina', tod:'kes', lucheni:'hong', josef:'pms', sophie:'ja',  rudolf:'jys' } },
  { y:2026, m:9, d:29, t:'19:30', cast:{ eli:'ljh',  tod:'kes', lucheni:'ny',   josef:'myg', sophie:'sjy', rudolf:'kws' } },
  { y:2026, m:9, d:30, t:'14:30', cast:{ eli:'ljs',  tod:'sgs', lucheni:'pet',  josef:'pms', sophie:'ja',  rudolf:'jys' } },
  { y:2026, m:9, d:30, t:'19:30', cast:{ eli:'rina', tod:'kai', lucheni:'hong', josef:'pms', sophie:'ja',  rudolf:'jys' } },

  // ── 2026년 10월 ──
  { y:2026, m:10, d:1,  t:'19:30', cast:{ eli:'ljh',  tod:'kes', lucheni:'pet',  josef:'myg', sophie:'sjy', rudolf:'kws' } },
  { y:2026, m:10, d:2,  t:'19:30', cast:{ eli:'ljs',  tod:'sgs', lucheni:'ny',   josef:'pms', sophie:'ja',  rudolf:'jys' } },
  { y:2026, m:10, d:3,  t:'14:00', cast:{ eli:'rina', tod:'kjs', lucheni:'pet',  josef:'myg', sophie:'sjy', rudolf:'kws' } },
  { y:2026, m:10, d:3,  t:'19:00', cast:{ eli:'ljh',  tod:'kai', lucheni:'ny',   josef:'myg', sophie:'sjy', rudolf:'kws' } },
  { y:2026, m:10, d:4,  t:'14:00', cast:{ eli:'ljs',  tod:'kes', lucheni:'hong', josef:'pms', sophie:'ja',  rudolf:'jys' } },
  { y:2026, m:10, d:4,  t:'19:00', cast:{ eli:'rina', tod:'sgs', lucheni:'pet',  josef:'pms', sophie:'ja',  rudolf:'jys' } },
  { y:2026, m:10, d:5,  t:'14:00', cast:{ eli:'ljh',  tod:'kes', lucheni:'ny',   josef:'myg', sophie:'sjy', rudolf:'kws' } },
  { y:2026, m:10, d:5,  t:'19:00', cast:{ eli:'ljs',  tod:'kai', lucheni:'hong', josef:'myg', sophie:'sjy', rudolf:'kws' } },
  { y:2026, m:10, d:7,  t:'14:30', cast:{ eli:'ljh',  tod:'sgs', lucheni:'ny',   josef:'pms', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:10, d:7,  t:'19:30', cast:{ eli:'rina', tod:'kes', lucheni:'pet',  josef:'pms', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:10, d:8,  t:'19:30', cast:{ eli:'ljh',  tod:'sgs', lucheni:'hong', josef:'myg', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:10, d:9,  t:'14:00', cast:{ eli:'ljs',  tod:'kai', lucheni:'ny',   josef:'myg', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:10, d:9,  t:'19:00', cast:{ eli:'ljh',  tod:'kes', lucheni:'hong', josef:'myg', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:10, d:10, t:'14:00', cast:{ eli:'rina', tod:'sgs', lucheni:'pet',  josef:'pms', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:10, d:10, t:'19:00', cast:{ eli:'ljs',  tod:'kes', lucheni:'ny',   josef:'pms', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:10, d:11, t:'15:00', cast:{ eli:'ljh',  tod:'kai', lucheni:'pet',  josef:'pms', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:10, d:13, t:'19:30', cast:{ eli:'rina', tod:'kes', lucheni:'hong', josef:'pms', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:10, d:14, t:'14:30', cast:{ eli:'ljs',  tod:'sgs', lucheni:'pet',  josef:'myg', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:10, d:14, t:'19:30', cast:{ eli:'ljh',  tod:'kjs', lucheni:'ny',   josef:'myg', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:10, d:15, t:'19:30', cast:{ eli:'rina', tod:'kai', lucheni:'pet',  josef:'pms', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:10, d:16, t:'14:30', cast:{ eli:'ljh',  tod:'kes', lucheni:'ny',   josef:'myg', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:10, d:16, t:'19:00', cast:{ eli:'ljs',  tod:'sgs', lucheni:'hong', josef:'myg', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:10, d:17, t:'14:00', cast:{ eli:'rina', tod:'kes', lucheni:'ny',   josef:'pms', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:10, d:17, t:'19:00', cast:{ eli:'ljs',  tod:'sgs', lucheni:'hong', josef:'pms', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:10, d:18, t:'15:00', cast:{ eli:'ljh',  tod:'kai', lucheni:'pet',  josef:'myg', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:10, d:20, t:'19:30', cast:{ eli:'rina', tod:'kjs', lucheni:'hong', josef:'myg', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:10, d:21, t:'14:30', cast:{ eli:'ljh',  tod:'kes', lucheni:'pet',  josef:'pms', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:10, d:21, t:'19:30', cast:{ eli:'pjy',  tod:'kjs', lucheni:'ny',   josef:'pms', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:10, d:22, t:'19:30', cast:{ eli:'rina', tod:'kai', lucheni:'hong', josef:'myg', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:10, d:23, t:'14:30', cast:{ eli:'ljh',  tod:'kjs', lucheni:'pet',  josef:'pms', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:10, d:23, t:'19:30', cast:{ eli:'pjy',  tod:'sgs', lucheni:'ny',   josef:'pms', sophie:'sjy', rudolf:'jys' } }
];

const TODAY = { y:2026, m:9, d:9 };
const RANGE = { min:{ y:2026, m:8 }, max:{ y:2026, m:10 } };

/* ── 좌석 배치도 ── 블루스퀘어 우리은행홀 (ref/seat.jpg 〈등급별 좌석배치도〉 기준).
   등급색(VIP/R/S/A)은 쓰지 않는다 — 좌석 색은 유저가 고르고 방문 횟수로 진해진다
   (PRD_v3 4.1 / v2 7.2). 여기 담는 건 "어느 자리가 존재하는가" 뿐이다.

   좌석번호는 층 전체에서 이어진다(좌측→중앙→우측). 블록은 번호로 갈린다.
     L/C/R = [첫번호, 끝번호] 또는 [첫번호, 끝번호, 시작칸]  (없으면 null)
     aisles = 통로가 들어가는 좌석번호 (그 번호 뒤에 AISLE_W칸 비움)
     시작칸을 직접 주면 그 블록만 좌우로 밀 수 있다 — 뒤쪽 열이 안으로 들어오는 배열용.
   좌석 id = `${층}-${열}-${번호}`  (예: '1-12-20' = 1층 12열 20번) */
const AISLE_W = 3;   // 통로 폭(칸). 열번호를 넣고도 블록을 2칸까지 밀 수 있어야 한다
const SEAT_MAP = {
  venue: '블루스퀘어 우리은행홀',
  floors: [
    { id:'1', label:'1층', aisles:[15, 33], cols:50, rows:[
      { r:'1',  L:[8,15], C:[16,31], R:[34,41] },
      { r:'2',  L:[7,15], C:[16,32], R:[34,42] },
      { r:'3',  L:[6,15], C:[16,31], R:[34,43] },
      { r:'4',  L:[6,15], C:[16,32], R:[34,43] },
      { r:'5',  L:[5,15], C:[16,31], R:[34,44] },
      { r:'6',  L:[4,15], C:[16,32], R:[34,45] },
      { r:'7',  L:[3,15], C:[16,31], R:[34,46] },
      { r:'8',  L:[1,15], C:[16,31], R:[34,48] },
      { r:'9',  L:[1,15], C:[16,32], R:[34,48] },
      { r:'10', L:[1,15], C:[16,31], R:[34,48] },
      // 11열부터 22열까지 중앙 32번이 한 열 걸러 있다 (홀수열에만)
      { r:'11', L:[1,15], C:[16,32], R:[34,48] },
      { r:'12', L:[1,15], C:[16,31], R:[34,48] },
      { r:'13', L:[1,15], C:[16,32], R:[34,48] },
      { r:'14', L:[1,15], C:[16,31], R:[34,48] },
      { r:'15', L:[1,15], C:[16,32], R:[34,48] },
      { r:'16', L:[1,15], C:[16,31], R:[34,48] },
      { r:'17', L:[1,15], C:[16,32], R:[34,48] },
      { r:'18', L:[1,15], C:[16,31], R:[34,48] },
      { r:'19', L:[1,15], C:[16,32], R:[34,48] },
      { r:'20', L:[1,15], C:[16,31], R:[34,48] },
      { r:'21', L:[1,15], C:[16,32], R:[34,48] },
      { r:'22', L:[1,15], C:[16,31], R:[34,48] },
      { r:'23', L:['D2','D9',2], C:null, R:['D10','D17',43] }   // 휠체어석
    ]},
    // 2층 중앙은 뒤로 갈수록 왼쪽에서 한 칸씩 안으로 들어온다
    //   1~5열 기준칸 19 · 6~7열 20 · 8~10열 21
    { id:'2', label:'2층', aisles:[15, 31], cols:48, rows:[
      { r:'1',  L:[1,15], C:[16,31],     R:[32,46] },
      { r:'2',  L:[1,15], C:[16,31],     R:[32,46] },
      { r:'3',  L:[1,15], C:[16,31],     R:[32,46] },
      { r:'4',  L:[1,15], C:[16,31],     R:[32,46] },
      { r:'5',  L:[1,15], C:[16,31],     R:[32,46] },
      { r:'6',  L:[3,15], C:[16,29, 20], R:[32,44] },
      { r:'7',  L:[3,15], C:[16,28, 20], R:[32,44] },
      { r:'8',  L:[3,15], C:[16,28, 21], R:[32,44] },
      { r:'9',  L:[3,15], C:[16,28, 21], R:[32,44] },
      { r:'10', L:[1,15], C:[16,28, 21], R:[32,46] }
    ]},
    // 3층 6열은 중앙이 23번과 24번 사이에서 두 칸 갈라진다 (C / C2)
    { id:'3', label:'3층', aisles:[16, 32], cols:50, rows:[
      { r:'1', L:[2,16], C:[17,32], R:[33,47] },
      { r:'2', L:[2,16], C:[17,32], R:[33,47] },
      { r:'3', L:[5,16], C:[17,32], R:[33,44] },
      { r:'4', L:[2,16], C:[17,32], R:[33,47] },
      { r:'5', L:[2,16], C:[17,32], R:[33,47] },
      { r:'6', L:[1,16], C:[17,23], C2:[24,30, 29], R:[33,48] }
    ]}
  ]
};

/* 좌석 색 — 유저가 정산판에서 고르는 색 (PRD_v3 4.1 / v2 7.2).
   앉은 횟수를 "같은 색의 진하기"가 아니라 "아예 다른 색"으로 구분한다.
   떨어져 있는 좌석끼리는 진하기 차이를 눈으로 못 재기 때문이다.
   빨주노초파남보 무지개 순 파스텔 8색을 두고, 유저가 횟수 칸마다 하나씩 끌어다 놓는다. */
const SEAT_COLORS = [
  { id:'rose',   hex:'#EBA0A6', label:'빨강' },
  { id:'amber',  hex:'#F0BE93', label:'주황' },
  { id:'gold',   hex:'#EFDD97', label:'노랑' },
  { id:'moss',   hex:'#B4D49E', label:'초록' },
  { id:'teal',   hex:'#9BD7C8', label:'청록' },
  { id:'slate',  hex:'#A6C3E6', label:'파랑' },
  { id:'indigo', hex:'#A9ABDF', label:'남색' },
  { id:'plum',   hex:'#CBABDD', label:'보라' }
];

/* 앉은 횟수 → 색. 기본값은 비워 둔다 — 유저가 팔레트에서 칸으로 끌어다 놓기 전엔
   색 칸이 점선 원형(빈칸)으로 남는다. */
const VISIT_LEVELS = [1, 2, 3, 4];
const DEFAULT_VISIT_COLORS = {};
const visitLabel = n => n >= 4 ? '4회+' : n + '회';

/* ── 개인 관극 기록 ── my_records 테이블의 자리 (PRD_v3 5장).
   백엔드(Supabase 등)가 붙기 전까지는 브라우저 localStorage 에 담는다.
   스케줄 탭에서 담은 기록이 정산판에서도 보이려면 이 저장이 반드시 필요하다
   (두 탭은 별개 페이지라 메모리 배열은 이동하면 사라진다).
   ⚠️ file:// 로 열면 브라우저가 저장을 막을 수 있다 — 로컬 서버로 열 것. */
const REC_KEY = 'aebaeryeok.records.v1';

function loadRecords () {
  try {
    const list = JSON.parse(localStorage.getItem(REC_KEY) || '[]');
    return Array.isArray(list) ? list.filter(r => r && r.key) : [];
  } catch { return []; }
}
function saveRecords () {
  try { localStorage.setItem(REC_KEY, JSON.stringify(MY_RECORDS)); } catch {}
}

let MY_RECORDS = loadRecords();

/* ═══ 공용 헬퍼 ═══ */
const $  = s => document.querySelector(s);
const el = h => { const t = document.createElement('template'); t.innerHTML = h.trim(); return t.content.firstChild; };

const perfKey  = p => [p.y, p.m, p.d, p.t].join('|');
const daysIn   = (y, m) => new Date(y, m, 0).getDate();
const firstDow = (y, m) => new Date(y, m - 1, 1).getDay();
const idx      = o => o.y * 12 + o.m;

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

/* ═══ 좌석 헬퍼 ═══ */

/* [첫번호, 끝번호, 시작칸?] → [{ no, col }]. 'D2'~'D9'처럼 접두 문자도 편다. */
function seatRun (spec, aisles) {
  if (!spec) return [];
  const [from, to, at] = spec;
  const m = String(from).match(/^([A-Za-z]*)(\d+)$/);
  const prefix = m[1], start = +m[2];
  const end = +String(to).match(/(\d+)$/)[1];
  return Array.from({ length: end - start + 1 }, (_, i) => {
    const n = start + i;
    return {
      no: prefix + n,
      col: at ? at + i : n + aisles.filter(a => n > a).length * AISLE_W
    };
  });
}

/* 구역 → 블록 키. C2는 중앙이 갈라진 열의 뒷 토막이다 (3층 6열). */
const ZONE_KEYS = { L:['L'], C:['C', 'C2'], R:['R'] };

/* 한 열의 좌석 전체 (좌·중앙·우 순) */
const seatsInRow = (floor, row) =>
  ['L', 'C', 'C2', 'R'].flatMap(b => seatRun(row[b], floor.aisles));

const floorById = id => SEAT_MAP.floors.find(f => f.id === id);

/* 좌석 id ↔ 사람이 읽는 이름 */
const seatId    = (floorId, row, no) => `${floorId}-${row}-${no}`;
const seatLabel = id => {
  const [f, r, no] = String(id).split('-');
  return `${f}층 ${r}열 ${no}번`;
};

/* ── 배치도 렌더 메타 ──
   좌석 col(1-indexed, 통로에서 AISLE_W칸 빔) → 그리드 칸 gc = col + LABEL_W.
   양 끝 열번호는 없앴다(LABEL_W=0) — 좌석을 지면 폭에 꽉 채우기 위해.
   열번호는 좌·우 통로 자리에만 인쇄한다.
   labelGc = [왼끝(미사용), 통로1, 통로2, 오른끝(미사용)] — 통로는 AISLE_W칸을 걸친다. */
const LABEL_W = 0;

function floorGrid (floor) {
  let maxCol = 0;
  floor.rows.forEach(row =>
    seatsInRow(floor, row).forEach(s => { if (s.col > maxCol) maxCol = s.col; }));
  // 통로 첫 칸 (블록이 최대 2칸 안으로 밀려도 겹치지 않는 자리)
  const aisleGc = floor.aisles.map(a =>
    a + floor.aisles.filter(x => x < a).length * AISLE_W + 1 + LABEL_W);
  return {
    cols: maxCol + LABEL_W * 2,
    labelGc: [1, ...aisleGc, maxCol + LABEL_W + 1]
  };
}

/* 한 열을 그리드 셀 목록으로. no = 표시용 숫자(D2 → '2'), gc = grid-column */
const seatRowCells = (floor, row) =>
  seatsInRow(floor, row).map(s => ({
    id: seatId(floor.id, row.r, s.no),
    no: String(s.no).match(/(\d+)$/)[1],
    gc: s.col + LABEL_W
  }));

/* ── 구역 드릴다운 (스케줄 탭 좌석 선택) ── */
const SEAT_ZONES = [{ k:'L', label:'좌측' }, { k:'C', label:'중앙' }, { k:'R', label:'우측' }];
const zoneLabel  = k => (SEAT_ZONES.find(z => z.k === k) || {}).label || k;
const seatNum    = v => +String(v).match(/(\d+)$/)[1];

/* 특정 층·구역·열의 좌석들 */
const seatsAt = (floor, zoneKey, row) =>
  ZONE_KEYS[zoneKey].flatMap(k => seatRun(row[k], floor.aisles)).map(s => ({
    id: seatId(floor.id, row.r, s.no),
    no: String(s.no).match(/(\d+)$/)[1]
  }));

/* 좌석 id → { floor, row, zone } (기존 기록 자리로 바로 이동할 때) */
function seatWhere (id) {
  const [fid, rlab, no] = String(id).split('-');
  const floor = floorById(fid);
  const row = floor && floor.rows.find(r => r.r === rlab);
  if (!row) return null;
  const n = seatNum(no);
  for (const zone of ['L', 'C', 'R']) {
    for (const k of ZONE_KEYS[zone]) {
      const spec = row[k];
      if (spec && n >= seatNum(spec[0]) && n <= seatNum(spec[1])) return { fid, rlab, zone };
    }
  }
  return { fid, rlab, zone: 'C' };
}

const isPast = p => (p.y * 10000 + p.m * 100 + p.d) < (TODAY.y * 10000 + TODAY.m * 100 + TODAY.d);
