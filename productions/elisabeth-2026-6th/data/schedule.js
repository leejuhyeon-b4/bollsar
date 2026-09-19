/* bollsar production schedule data
   production_id: elisabeth-2026-6th
   Loaded before the shared data/helpers file. */

/* ── 작품 ── */
const WORK = {
  id:     'elisabeth-2026-6th',
  title:  '엘리자벳',
  run:    '6연',                                     // 한국 초연부터 세어 여섯 번째 시즌
  venue:  '블루스퀘어 우리은행홀',
  period: { start: '2026-08-16', end: '2026-11-15' },  // 폐막 2026.11.15
  poster: ''                                         // TODO: 2026 엘리자벳 공식 포스터를 assets/에 넣고 경로만 적기
};

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
  { y:2026, m:11, d:14, t:'14:00', cast:{ eli:'pjy',  tod:'sgs', lucheni:'hong', josef:'pms', sophie:'ja',  rudolf:'kws' }, events:[{ label:'막공', verified:true }] },
  { y:2026, m:11, d:14, t:'19:00', cast:{ eli:'rina', tod:'kes', lucheni:'ny',   josef:'pms', sophie:'ja',  rudolf:'jys' } },
  { y:2026, m:11, d:15, t:'15:00', cast:{ eli:'ljh',  tod:'sgs', lucheni:'pet',  josef:'myg', sophie:'sjy', rudolf:'jys' } }
];

/* Calendar navigation range for this production. */
const RANGE = { min:{ y:2026, m:8 }, max:{ y:2026, m:11 } };
