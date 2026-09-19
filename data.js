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
  { y:2026, m:10, d:23, t:'19:30', cast:{ eli:'pjy',  tod:'sgs', lucheni:'ny',   josef:'pms', sophie:'sjy', rudolf:'jys' } },

  { y:2026, m:10, d:24, t:'14:00', cast:{ eli:'ljs',  tod:'kjs', lucheni:'hong', josef:'myg', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:10, d:24, t:'19:00', cast:{ eli:'ljh',  tod:'kes', lucheni:'pet',  josef:'myg', sophie:'ja',  rudolf:'jys' } },
  { y:2026, m:10, d:25, t:'15:00', cast:{ eli:'pjy',  tod:'kai', lucheni:'ny',   josef:'pms', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:10, d:27, t:'19:30', cast:{ eli:'ljh',  tod:'kjs', lucheni:'ny',   josef:'pms', sophie:'ja',  rudolf:'jys' } },
  { y:2026, m:10, d:28, t:'14:30', cast:{ eli:'pjy',  tod:'sgs', lucheni:'hong', josef:'myg', sophie:'sjy', rudolf:'kws' } },
  { y:2026, m:10, d:28, t:'19:30', cast:{ eli:'rina', tod:'kjs', lucheni:'pet',  josef:'myg', sophie:'sjy', rudolf:'kws' } },
  { y:2026, m:10, d:29, t:'19:30', cast:{ eli:'ljh',  tod:'kjs', lucheni:'ny',   josef:'pms', sophie:'ja',  rudolf:'jys' } },
  { y:2026, m:10, d:30, t:'14:30', cast:{ eli:'rina', tod:'kai', lucheni:'pet',  josef:'myg', sophie:'sjy', rudolf:'kws' } },
  { y:2026, m:10, d:30, t:'19:30', cast:{ eli:'pjy',  tod:'kes', lucheni:'hong', josef:'myg', sophie:'sjy', rudolf:'kws' } },
  { y:2026, m:10, d:31, t:'14:00', cast:{ eli:'ljh',  tod:'sgs', lucheni:'ny',   josef:'pms', sophie:'ja',  rudolf:'jys' } },
  { y:2026, m:10, d:31, t:'19:00', cast:{ eli:'rina', tod:'kes', lucheni:'hong', josef:'pms', sophie:'ja',  rudolf:'jys' } },

  { y:2026, m:11, d:1,  t:'14:00', cast:{ eli:'ljh',  tod:'sgs', lucheni:'pet',  josef:'myg', sophie:'sjy', rudolf:'kws' } },
  { y:2026, m:11, d:1,  t:'19:00', cast:{ eli:'pjy',  tod:'kai', lucheni:'hong', josef:'myg', sophie:'sjy', rudolf:'kws' } },
  { y:2026, m:11, d:3,  t:'19:30', cast:{ eli:'pjy',  tod:'kes', lucheni:'pet',  josef:'pms', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:11, d:4,  t:'14:30', cast:{ eli:'ljh',  tod:'sgs', lucheni:'hong', josef:'myg', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:11, d:4,  t:'19:30', cast:{ eli:'rina', tod:'sgs', lucheni:'ny',   josef:'myg', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:11, d:5,  t:'19:30', cast:{ eli:'ljh',  tod:'kes', lucheni:'pet',  josef:'pms', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:11, d:6,  t:'14:30', cast:{ eli:'pjy',  tod:'sgs', lucheni:'ny',   josef:'myg', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:11, d:6,  t:'19:30', cast:{ eli:'rina', tod:'sgs', lucheni:'pet',  josef:'myg', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:11, d:7,  t:'14:00', cast:{ eli:'ljh',  tod:'kes', lucheni:'hong', josef:'pms', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:11, d:7,  t:'19:00', cast:{ eli:'pjy',  tod:'kes', lucheni:'ny',   josef:'pms', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:11, d:8,  t:'15:00', cast:{ eli:'rina', tod:'sgs', lucheni:'pet',  josef:'myg', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:11, d:10, t:'14:30', cast:{ eli:'pjy',  tod:'kjs', lucheni:'ny',   josef:'pms', sophie:'sjy', rudolf:'kws' } },
  { y:2026, m:11, d:11, t:'14:30', cast:{ eli:'ljh',  tod:'kes', lucheni:'ny',   josef:'myg', sophie:'ja',  rudolf:'jys' } },
  { y:2026, m:11, d:12, t:'19:30', cast:{ eli:'pjy',  tod:'kjs', lucheni:'pet',  josef:'pms', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:11, d:13, t:'14:30', cast:{ eli:'rina', tod:'sgs', lucheni:'hong', josef:'myg', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:11, d:13, t:'19:30', cast:{ eli:'ljh',  tod:'kes', lucheni:'pet',  josef:'myg', sophie:'sjy', rudolf:'jys' } },
  { y:2026, m:11, d:14, t:'14:00', cast:{ eli:'pjy',  tod:'sgs', lucheni:'hong', josef:'pms', sophie:'ja',  rudolf:'kws' } },
  { y:2026, m:11, d:14, t:'19:00', cast:{ eli:'rina', tod:'kes', lucheni:'ny',   josef:'pms', sophie:'ja',  rudolf:'jys' } },
  { y:2026, m:11, d:15, t:'15:00', cast:{ eli:'ljh',  tod:'sgs', lucheni:'pet',  josef:'myg', sophie:'sjy', rudolf:'jys' } }
];

/* 공연 일정의 기준일은 관객과 공연장이 있는 한국 시간으로 계산한다.
   브라우저를 자정 너머 계속 열어둔 경우에도 아래 감시기가 TODAY를 갱신한다. */
const KOREA_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric'
});
const koreaDateParts = (date = new Date()) => {
  const parts = Object.fromEntries(
    KOREA_DATE_FORMATTER.formatToParts(date)
      .filter(part => part.type !== 'literal')
      .map(part => [part.type, Number(part.value)])
  );
  return { y: parts.year, m: parts.month, d: parts.day };
};
const TODAY = koreaDateParts();

function refreshToday () {
  const next = koreaDateParts();
  if (next.y === TODAY.y && next.m === TODAY.m && next.d === TODAY.d) return false;

  const previous = { ...TODAY };
  Object.assign(TODAY, next);
  window.dispatchEvent(new CustomEvent('todaychange', {
    detail: { previous, current: { ...TODAY } }
  }));
  return true;
}

if (typeof setInterval === 'function') setInterval(refreshToday, 60 * 1000);
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !refreshToday()) refreshPerformanceState();
  });
}
const RANGE = { min:{ y:2026, m:8 }, max:{ y:2026, m:11 } };

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

/* ═══════════════════════════════════════════════════════════
   Supabase — 아이디/비번 로그인 + 관극 기록 동기화

   ⚠️ Supabase 대시보드에서 먼저 해둘 것:
   1) Authentication → Providers → Email → "Confirm email" 끄기 (필수).
      아이디를 `<id>@bollsar.local` 가짜 이메일로 저장하므로 확인 메일이 안 감.
   2) "Allow new users to sign up" 켜져 있어야 함 (기본값).
   3) SQL Editor 에서 아래 실행:

      create table if not exists public.records (
        user_id    uuid not null references auth.users(id) on delete cascade,
        perf_key   text not null,
        seat       text,
        updated_at timestamptz not null default now(),
        primary key (user_id, perf_key)
      );
      alter table public.records enable row level security;
      create policy "records private to owner" on public.records
        for all to authenticated
        using (auth.uid() = user_id) with check (auth.uid() = user_id);
   ═══════════════════════════════════════════════════════════ */
const SUPABASE_URL  = 'https://ymzxbfyupsnyaqqawoyc.supabase.co';
const SUPABASE_ANON = 'sb_publishable_bx73KKDi7lZkeaDoGnndrA_GySTgosF';
/* 아이디를 `<id>@ID_EMAIL_DOMAIN` 가짜 이메일로 만들어 Supabase Auth 에 넣는다.
   Supabase 가 "email invalid" 를 뱉으면 이 도메인만 바꾸면 된다 (MX 있는 도메인 필요할 수 있음). */
const ID_EMAIL_DOMAIN = 'bollsar.app';
const REC_KEY      = 'aebaeryeok.records.v2';
const REMEMBER_KEY = 'bollsar.auth.remember';
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
const PASSWORD_RULE_TEXT = '8자 이상이며 영문·숫자·특수문자를 모두 포함해야 합니다.';

/* 자동 로그인 체크박스: 켜짐 = localStorage(영구), 꺼짐 = sessionStorage(탭 닫으면 끝) */
const authStorage = {
  getItem (k) { try { return localStorage.getItem(k) ?? sessionStorage.getItem(k); } catch { return null; } },
  setItem (k, v) {
    try {
      const keep = localStorage.getItem(REMEMBER_KEY) === '1';
      (keep ? localStorage : sessionStorage).setItem(k, v);
      (keep ? sessionStorage : localStorage).removeItem(k);
    } catch {}
  },
  removeItem (k) { try { localStorage.removeItem(k); sessionStorage.removeItem(k); } catch {} }
};

let SB = null;
try {
  if (typeof supabase !== 'undefined' && supabase.createClient) {
    SB = supabase.createClient(SUPABASE_URL, SUPABASE_ANON, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storage: authStorage }
    });
  } else {
    console.warn('[auth] supabase-js 를 불러오지 못했습니다 — 로그인 비활성, 로컬 저장만.');
  }
} catch (e) {
  console.error('[auth] Supabase 클라이언트 생성 실패:', e);
  SB = null;
}

let AUTH_USER = null;   // Supabase user or null

const idToEmail = id => `${String(id).trim().toLowerCase()}@${ID_EMAIL_DOMAIN}`;
const idOk = id => /^[a-z0-9][a-z0-9._-]{2,19}$/i.test(String(id || '').trim());

function authMsg (e) {
  const m = ((e && e.message) || '').toLowerCase();
  if (m.includes('invalid login')) return '아이디 또는 비밀번호가 맞지 않습니다.';
  if (m.includes('already') && m.includes('regist')) return '이미 있는 아이디입니다.';
  if (m.includes('user already')) return '이미 있는 아이디입니다.';
  if (m.includes('password')) return PASSWORD_RULE_TEXT;
  if (m.includes('rate') && m.includes('limit')) return '잠시 후 다시 시도해 주세요.';
  if (m.includes('signups not allowed')) return '지금은 회원가입을 받지 않습니다.';
  return (e && e.message) || '알 수 없는 오류가 났어요.';
}

async function authSignIn (id, pw, remember) {
  if (!SB) return { message: '서버에 연결할 수 없습니다.' };
  localStorage.setItem(REMEMBER_KEY, remember ? '1' : '0');
  const { error } = await SB.auth.signInWithPassword({ email: idToEmail(id), password: pw });
  if (error) return { message: authMsg(error) };
  return null;
}
async function authSignUp (id, pw, remember) {
  if (!SB) return { message: '서버에 연결할 수 없습니다.' };
  localStorage.setItem(REMEMBER_KEY, remember ? '1' : '0');
  const { data, error } = await SB.auth.signUp({ email: idToEmail(id), password: pw });
  if (error) return { message: authMsg(error) };
  if (!data.session) return { message: '가입은 됐지만 자동 로그인이 안 됐어요. 로그인 탭에서 다시 시도해 주세요. (대시보드에서 이메일 확인을 껐는지 확인)' };
  return null;
}
async function authSignOut () { if (SB) await SB.auth.signOut(); }

/* ── 관극 기록 저장소 ──
   캐시 키를 Supabase user UUID별로 격리한다. 소유자를 판별할 수 없는 예전 전역 캐시는
   보존하되 앱에서 읽거나 자동 병합하지 않는다. 계정 전환 시 다른 사용자의 기록이
   섞이는 일을 막기 위해 로그인 상태에서는 절대 게스트 키를 조회하지 않는다. */
const recordsStorageKey = user => `${REC_KEY}.${user && user.id ? `user.${user.id}` : 'guest'}`;
function loadLocalRecords (user = AUTH_USER) {
  try {
    const list = JSON.parse(localStorage.getItem(recordsStorageKey(user)) || '[]');
    return Array.isArray(list) ? list.filter(r => r && r.key) : [];
  } catch { return []; }
}
function loadRecords () { return loadLocalRecords(); }   // 하위 호환

let MY_RECORDS = loadLocalRecords();

async function pullRecords () {
  if (!SB || !AUTH_USER) return;
  const { data, error } = await SB.from('records').select('perf_key, seat');
  if (error) { console.warn('[records] pull:', error.message); return; }
  MY_RECORDS = (data || []).map(r => ({ key: r.perf_key, seat: r.seat }));
}

/* 로그인 직후: 이 사용자 UUID로 격리된 오프라인 캐시만 클라우드에 합친다. */
async function mergeLocalIntoCloud () {
  if (!SB || !AUTH_USER) return;
  const local = loadLocalRecords(AUTH_USER);
  if (!local.length) return;
  const have = new Set(MY_RECORDS.map(r => r.key));
  const add = local.filter(r => !have.has(r.key));
  if (!add.length) return;
  MY_RECORDS = MY_RECORDS.concat(add);
  await saveRecords();
}

async function saveRecords () {
  try { localStorage.setItem(recordsStorageKey(AUTH_USER), JSON.stringify(MY_RECORDS)); } catch {}
  if (!SB || !AUTH_USER) return;
  const rows = MY_RECORDS.map(r => ({ user_id: AUTH_USER.id, perf_key: r.key, seat: r.seat }));
  if (!rows.length) return;
  const { error } = await SB.from('records').upsert(rows, { onConflict: 'user_id,perf_key' });
  if (error) console.warn('[records] save:', error.message);
}
async function removeRecordRemote (key) {
  if (!SB || !AUTH_USER) return;
  const { error } = await SB.from('records').delete().eq('user_id', AUTH_USER.id).eq('perf_key', key);
  if (error) console.warn('[records] delete:', error.message);
}

/* ═══ 공용 헬퍼 ═══ */
const $  = s => document.querySelector(s);
const el = h => { const t = document.createElement('template'); t.innerHTML = h.trim(); return t.content.firstChild; };

/* GA4 커스텀 이벤트 안전 래퍼. 회차·좌석·배우 조합 등 관람 내역을 재구성할 수
   있는 값은 호출부에서 실수로 넘겨도 여기서 폐기한다. */
const ANALYTICS_PARAM_ALLOWLIST = new Set([
  'source', 'view', 'from', 'target', 'vendor', 'hong_only', 'level', 'color',
  'has_seat', 'had_existing'
]);
function track (name, params) {
  try {
    if (typeof gtag !== 'function') return;
    const safe = {};
    Object.entries(params || {}).forEach(([key, value]) => {
      if (ANALYTICS_PARAM_ALLOWLIST.has(key)) safe[key] = value;
    });
    gtag('event', name, safe);
  } catch (e) {}
}

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

/* 공연 시작 시각부터 정산 완료 회차로 본다. 일정 시각은 모두 한국 시간(KST)이다. */
const performanceStartMs = p => {
  const [hour, minute] = p.t.split(':').map(Number);
  return Date.UTC(p.y, p.m - 1, p.d, hour - 9, minute);
};
const isPast = (p, now = Date.now()) => now >= performanceStartMs(p);

let performanceChangeTimer = null;
function schedulePerformanceChange () {
  if (typeof setTimeout !== 'function' || typeof window === 'undefined') return;
  if (performanceChangeTimer && typeof clearTimeout === 'function') clearTimeout(performanceChangeTimer);

  const now = Date.now();
  const next = PERFS.map(performanceStartMs).filter(time => time > now).sort((a, b) => a - b)[0];
  if (!next) return;

  const delay = Math.min(next - now + 100, 12 * 60 * 60 * 1000);
  performanceChangeTimer = setTimeout(() => {
    if (Date.now() >= next) window.dispatchEvent(new CustomEvent('performancechange'));
    schedulePerformanceChange();
  }, delay);
}
function refreshPerformanceState () {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('performancechange'));
  schedulePerformanceChange();
}
schedulePerformanceChange();


/* ═══════════════════════════════════════════════════════════
   로그인 / 회원가입 모달 (스케줄·정산판 공용)
   각 페이지에서 mountAuth(onAuth) 한 번 호출.
   onAuth(true|false) 로 로그인 상태 변화를 페이지에 알린다.
   ═══════════════════════════════════════════════════════════ */
let _openAuth = null;
function openAuthModal () { if (_openAuth) _openAuth(); }

function authFormHTML (mode) {
  const signup = mode === 'signup';
  return `
    <div class="auth-tabs">
      <button type="button" class="auth-tab${signup ? '' : ' on'}" data-mode="login">로그인</button>
      <button type="button" class="auth-tab${signup ? ' on' : ''}" data-mode="signup">회원가입</button>
    </div>
    <form id="authForm" autocomplete="on">
      <label class="auth-f"><span>아이디</span>
        <input name="username" type="text" autocomplete="username" autocapitalize="none"
               spellcheck="false" placeholder="영문·숫자 3~20자" required></label>
      <label class="auth-f"><span>비밀번호</span>
        <input name="pw" type="password" minlength="${signup ? PASSWORD_MIN_LENGTH : 6}"
               autocomplete="${signup ? 'new-password' : 'current-password'}" placeholder="${signup ? '8자 이상 · 영문+숫자+특수문자' : '비밀번호'}" required></label>
      ${signup ? `<label class="auth-f"><span>비밀번호 확인</span>
        <input name="pw2" type="password" minlength="${PASSWORD_MIN_LENGTH}" autocomplete="new-password"
               placeholder="한 번 더" required></label>` : ''}
      <label class="auth-remember"><input name="remember" type="checkbox"><span>이 기기에서 자동 로그인</span></label>
      <p class="auth-err" id="authErr" role="alert"></p>
      <button type="submit" class="auth-submit">${signup ? '가입하고 시작' : '로그인'}</button>
      ${signup ? `<p class="auth-note">영문·숫자·특수문자를 모두 포함한 고유한 비밀번호를 사용해 주세요.</p>` : ''}
    </form>`;
}

function injectAuthCSS () {
  if (document.getElementById('authCSS')) return;
  const s = document.createElement('style');
  s.id = 'authCSS';
  s.textContent = `
    #authWrap { position:fixed; inset:0; z-index:60; display:flex; align-items:center; justify-content:center; padding:20px; }
    .auth-back { position:absolute; inset:0; background:rgba(15,14,10,.55); }
    .auth-box {
      position:relative; width:100%; max-width:320px;
      background:var(--paper); border:1px solid var(--ink);
      border-top:3px double var(--ink); border-bottom:3px double var(--ink);
      padding:22px 22px 20px;
    }
    .auth-x {
      position:absolute; right:10px; top:8px; border:0; background:none; cursor:pointer;
      font-family:var(--mono); font-size:14px; color:var(--ink);
    }
    .auth-tabs { display:flex; gap:0; margin-bottom:16px; border:1px solid var(--ink-40); }
    .auth-tab {
      flex:1; border:0; background:none; cursor:pointer; padding:8px 0;
      font-family:var(--mono); font-size:12px; letter-spacing:.06em; color:var(--ink-55);
    }
    .auth-tab + .auth-tab { border-left:1px solid var(--ink-40); }
    .auth-tab.on { background:var(--ink); color:var(--paper); }
    .auth-f { display:block; margin-bottom:11px; }
    .auth-f span {
      display:block; margin-bottom:4px;
      font-family:var(--mono); font-size:12px; letter-spacing:.06em; color:var(--ink-60);
    }
    .auth-f input {
      width:100%; box-sizing:border-box; padding:9px 10px;
      border:1px solid var(--ink-40); background:var(--paper-3); color:var(--ink);
      font-family:var(--mono); font-size:14px; border-radius:0;
    }
    .auth-f input:focus { outline:2px solid var(--accent); outline-offset:-1px; }
    .auth-remember {
      display:flex; align-items:center; gap:7px; margin:4px 0 12px; cursor:pointer;
      font-family:var(--mono); font-size:12px; color:var(--ink-72);
    }
    .auth-remember input { width:15px; height:15px; accent-color:var(--ink); }
    .auth-err { min-height:15px; margin-bottom:8px; font-family:var(--mono); font-size:12px; color:var(--accent); line-height:1.4; }
    .auth-submit {
      width:100%; padding:11px; border:1px solid var(--ink); background:var(--ink); color:var(--paper);
      cursor:pointer; font-family:var(--mono); font-size:12px; letter-spacing:.1em;
    }
    .auth-submit:disabled { opacity:.5; cursor:progress; }
    .auth-note { margin-top:10px; font-family:var(--mono); font-size:12px; line-height:1.6; color:var(--ink-55); }
    .auth-actions { display:grid; gap:8px; }
    .auth-actions button { width:100%; padding:9px; border:1px solid var(--ink-40); background:var(--paper-3); color:var(--ink); cursor:pointer; font-family:var(--mono); font-size:12px; }
    .auth-actions .danger { color:var(--accent); border-color:var(--accent); }
    .auth-mfa-qr { display:block; width:180px; height:180px; margin:10px auto; background:#fff; }
    .auth-secret { overflow-wrap:anywhere; user-select:all; }`;
  document.head.appendChild(s);
}

function downloadAccountData () {
  const payload = {
    exported_at: new Date().toISOString(),
    account: authUserId(),
    records: MY_RECORDS.map(r => ({ performance_key: r.key, seat: r.seat || null }))
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `hongcal-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

function mountAuth (onAuth) {
  const btn = document.getElementById('loginBtn');

  /* 로그인 버튼 핸들러부터 건다 — 아래에서 뭐가 터져도 버튼은 항상 반응하게 */
  if (btn) btn.addEventListener('click', async () => {
    try {
      if (!SB) { alert('로그인 서버에 연결하지 못했어요.\n새로고침하거나 잠시 후 다시 시도해 주세요.'); return; }
      if (AUTH_USER) openAccount();
      else openAuthModal();
    } catch (e) { console.error('[auth] login button:', e); }
  });

  if (!SB) { onAuth(false); return; }   // 서버 연결 불가 — 로컬 저장만
  injectAuthCSS();

  const wrap = document.createElement('div');
  wrap.id = 'authWrap'; wrap.hidden = true;
  wrap.innerHTML = `<div class="auth-back"></div>
    <div class="auth-box" role="dialog" aria-modal="true" aria-label="로그인">
      <button type="button" class="auth-x" aria-label="닫기">✕</button>
      <div id="authBody"></div>
    </div>`;
  document.body.appendChild(wrap);

  let mode = 'login';
  const close = () => { wrap.hidden = true; };
  const openTo = m => {
    mode = m || 'login';
    wrap.hidden = false;
    wrap.querySelector('#authBody').innerHTML = authFormHTML(mode);
    bindForm();
    const first = wrap.querySelector('input[name=username]');
    if (first) setTimeout(() => first.focus(), 30);
  };
  _openAuth = () => openTo('login');

  const openAccount = () => {
    wrap.hidden = false;
    wrap.querySelector('#authBody').innerHTML = `
      <h2 class="auth-account-title">계정 관리</h2>
      <p class="auth-note"><span data-account-id></span> 계정과 데이터를 관리합니다.</p>
      <div class="auth-actions">
        <button type="button" data-account="logout">로그아웃</button>
        <button type="button" data-account="export">내 기록 내보내기</button>
        <button type="button" class="danger" data-account="delete">계정 삭제</button>
      </div>
      <p class="auth-err" id="authErr" role="alert"></p>`;
    wrap.querySelector('[data-account-id]').textContent = authUserId();
    const err = wrap.querySelector('#authErr');
    wrap.querySelector('[data-account="export"]').addEventListener('click', downloadAccountData);
    wrap.querySelector('[data-account="logout"]').addEventListener('click', async () => { await authSignOut(); close(); });
    wrap.querySelector('[data-account="delete"]').addEventListener('click', async () => {
      if (!window.confirm('계정과 모든 관극 기록을 영구 삭제할까요? 먼저 기록 내보내기를 권장합니다.')) return;
      const key = recordsStorageKey(AUTH_USER);
      const { error } = await SB.rpc('delete_account');
      if (error) { err.textContent = '계정 삭제 기능을 준비하지 못했습니다. Supabase 보안 SQL 적용 여부를 확인해 주세요.'; return; }
      try { localStorage.removeItem(key); } catch (_) {}
      await authSignOut(); close();
    });
  };

  function bindForm () {
    wrap.querySelectorAll('.auth-tab').forEach(b =>
      b.addEventListener('click', () => openTo(b.dataset.mode)));
    const form = wrap.querySelector('#authForm');
    const err  = wrap.querySelector('#authErr');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const id  = form.username.value.trim();
      const pw  = form.pw.value;
      const pw2 = form.pw2 ? form.pw2.value : pw;
      const remember = form.remember.checked;
      err.textContent = '';
      if (!idOk(id))  { err.textContent = '아이디는 영문·숫자로 시작하는 3~20자예요. (. _ - 사용 가능)'; return; }
      if (mode === 'signup' && !PASSWORD_PATTERN.test(pw)) { err.textContent = PASSWORD_RULE_TEXT; return; }
      if (mode === 'signup' && pw !== pw2) { err.textContent = '비밀번호 확인이 일치하지 않아요.'; return; }
      const sub = form.querySelector('.auth-submit');
      const label = sub.textContent;
      sub.disabled = true; sub.textContent = '처리 중…';
      const r = mode === 'login'
        ? await authSignIn(id, pw, remember)
        : await authSignUp(id, pw, remember);
      sub.disabled = false; sub.textContent = label;
      if (r) { err.textContent = r.message; return; }
      track(mode === 'login' ? 'login' : 'signup', {});
      close();
    });
  }

  wrap.querySelector('.auth-back').addEventListener('click', close);
  wrap.querySelector('.auth-x').addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !wrap.hidden) close(); });

  async function handle (session) {
    AUTH_USER = session ? session.user : null;
    try {
      if (AUTH_USER) { await pullRecords(); await mergeLocalIntoCloud(); }
      else { MY_RECORDS = loadLocalRecords(); }
    } catch (e) { console.warn('[auth] record sync:', e); }
    onAuth(!!AUTH_USER);
  }
  SB.auth.getSession().then(({ data }) => handle(data.session)).catch(e => { console.warn('[auth] getSession:', e); onAuth(false); });
  SB.auth.onAuthStateChange((_evt, session) => handle(session));
}

/* 아이디 표시용 — user.email 의 @앞부분 */
const authUserId = () => (AUTH_USER && AUTH_USER.email || '').split('@')[0] || '';
