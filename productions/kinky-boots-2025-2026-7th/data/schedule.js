/* bollsar production schedule data
   production_id: kinky-boots-2025-2026-7th
   Seoul schedule first; regional performances can be added later.
   Published casting changes are stored as the final cast. */

const WORK = {
  id:     'kinky-boots-2025-2026-7th',
  title:  "킹키부츠",
  run:    "7연",
  venue:  "샤롯데씨어터",
  period: { start: '2025-11-01', end: '2026-05-03' },
  poster: ''
};

const ACTORS = {
  hong: { name: "강홍석", photo: '' },
  jaehwan: { name: "이재환", photo: '' },
  jaebeom: { name: "신재범", photo: '' },
  hoyoung: { name: "김호영", photo: '' },
  seokyung: { name: "서경수", photo: '' },
  hyunghoon: { name: "백형훈", photo: '' },
  yoonsul: { name: "허윤슬", photo: '' },
  jaea: { name: "한재아", photo: '' },
  donghyun: { name: "김동현", photo: '' },
  jaehyun: { name: "심재현", photo: '' },
  seunghwan: { name: "신승환", photo: '' },
  juyeon: { name: "유주연", photo: '' },
  ruwon: { name: "이루원", photo: '' }
};

const ROLES = [
  { id: 'charlie', name: "찰리", actors: ['jaehwan', 'jaebeom', 'hoyoung'] },
  { id: 'lola', name: "롤라", actors: ['seokyung', 'hyunghoon', 'hong'] },
  { id: 'lauren', name: "로렌", actors: ['yoonsul', 'jaea'] },
  { id: 'don', name: "돈", actors: ['donghyun', 'jaehyun', 'seunghwan'] },
  { id: 'nicola', name: "니콜라", actors: ['juyeon', 'ruwon'] }
];

const PERFS = [
  // 2025 지방투어 (서울 개막 전)
  { y:2025, m:11, d:1, t:'14:00', venue:'고양아람누리 아람극장', cast:{ charlie:'hoyoung', lola:'hong', lauren:'jaea', don:'donghyun', nicola:'ruwon' }, events:[{ label:'오리지널 티켓 증정', verified:true }] },
  { y:2025, m:11, d:1, t:'19:00', venue:'고양아람누리 아람극장', cast:{ charlie:'jaebeom', lola:'hyunghoon', lauren:'yoonsul', don:'seunghwan', nicola:'juyeon' }, events:[{ label:'오리지널 티켓 증정', verified:true }] },
  { y:2025, m:11, d:2, t:'14:00', venue:'고양아람누리 아람극장', cast:{ charlie:'jaehwan', lola:'seokyung', lauren:'jaea', don:'donghyun', nicola:'ruwon' }, events:[{ label:'오리지널 티켓 증정', verified:true }] },
  { y:2025, m:11, d:2, t:'19:00', venue:'고양아람누리 아람극장', cast:{ charlie:'hoyoung', lola:'hong', lauren:'yoonsul', don:'jaehyun', nicola:'juyeon' }, events:[{ label:'오리지널 티켓 증정', verified:true }] },
  { y:2025, m:11, d:8, t:'14:00', venue:'고양아람누리 아람극장', cast:{ charlie:'jaebeom', lola:'seokyung', lauren:'yoonsul', don:'donghyun', nicola:'juyeon' }, events:[{ label:'커튼콜데이', verified:true }] },
  { y:2025, m:11, d:8, t:'19:00', venue:'고양아람누리 아람극장', cast:{ charlie:'jaehwan', lola:'hong', lauren:'jaea', don:'jaehyun', nicola:'juyeon' }, events:[{ label:'커튼콜데이', verified:true }] },
  { y:2025, m:11, d:9, t:'14:00', venue:'고양아람누리 아람극장', cast:{ charlie:'jaebeom', lola:'seokyung', lauren:'yoonsul', don:'donghyun', nicola:'ruwon' }, events:[{ label:'커튼콜데이', verified:true }] },
  { y:2025, m:11, d:9, t:'19:00', venue:'고양아람누리 아람극장', cast:{ charlie:'hoyoung', lola:'hyunghoon', lauren:'jaea', don:'seunghwan', nicola:'ruwon' }, events:[{ label:'커튼콜데이', verified:true }] },
  { y:2025, m:11, d:15, t:'14:00', venue:'성남아트센터 오페라하우스', cast:{ charlie:'jaebeom', lola:'hong', lauren:'yoonsul', don:'seunghwan', nicola:'ruwon' }, events:[{ label:'커튼콜데이', verified:true }] },
  { y:2025, m:11, d:15, t:'19:00', venue:'성남아트센터 오페라하우스', cast:{ charlie:'hoyoung', lola:'seokyung', lauren:'jaea', don:'donghyun', nicola:'ruwon' }, events:[{ label:'커튼콜데이', verified:true }] },
  { y:2025, m:11, d:16, t:'14:00', venue:'성남아트센터 오페라하우스', cast:{ charlie:'jaehwan', lola:'hong', lauren:'jaea', don:'seunghwan', nicola:'juyeon' }, events:[{ label:'커튼콜데이', verified:true }] },
  { y:2025, m:11, d:16, t:'19:00', venue:'성남아트센터 오페라하우스', cast:{ charlie:'hoyoung', lola:'hyunghoon', lauren:'yoonsul', don:'jaehyun', nicola:'juyeon' }, events:[{ label:'커튼콜데이', verified:true }] },
  { y:2025, m:11, d:22, t:'14:00', venue:'GS칼텍스 예울마루 대극장', cast:{ charlie:'jaebeom', lola:'hyunghoon', lauren:'jaea', don:'donghyun', nicola:'juyeon' } },
  { y:2025, m:11, d:22, t:'19:00', venue:'GS칼텍스 예울마루 대극장', cast:{ charlie:'jaehwan', lola:'seokyung', lauren:'jaea', don:'seunghwan', nicola:'juyeon' } },
  { y:2025, m:11, d:23, t:'14:00', venue:'GS칼텍스 예울마루 대극장', cast:{ charlie:'hoyoung', lola:'hong', lauren:'yoonsul', don:'jaehyun', nicola:'ruwon' } },
  { y:2025, m:11, d:23, t:'19:00', venue:'GS칼텍스 예울마루 대극장', cast:{ charlie:'jaehwan', lola:'hyunghoon', lauren:'yoonsul', don:'jaehyun', nicola:'ruwon' } },
  { y:2025, m:11, d:29, t:'14:00', venue:'한국소리문화의전당 모악당', cast:{ charlie:'jaebeom', lola:'hong', lauren:'yoonsul', don:'seunghwan', nicola:'juyeon' } },
  { y:2025, m:11, d:29, t:'19:00', venue:'한국소리문화의전당 모악당', cast:{ charlie:'jaehwan', lola:'hong', lauren:'yoonsul', don:'donghyun', nicola:'juyeon' } },
  { y:2025, m:11, d:30, t:'14:00', venue:'한국소리문화의전당 모악당', cast:{ charlie:'hoyoung', lola:'hyunghoon', lauren:'jaea', don:'jaehyun', nicola:'ruwon' } },
  { y:2025, m:11, d:30, t:'19:00', venue:'한국소리문화의전당 모악당', cast:{ charlie:'jaehwan', lola:'seokyung', lauren:'jaea', don:'seunghwan', nicola:'ruwon' } },
  { y:2025, m:12, d:6, t:'14:00', venue:'용인포은아트홀', cast:{ charlie:'jaebeom', lola:'seokyung', lauren:'yoonsul', don:'jaehyun', nicola:'ruwon' }, events:[{ label:'커튼콜데이', verified:true }] },
  { y:2025, m:12, d:6, t:'19:00', venue:'용인포은아트홀', cast:{ charlie:'hoyoung', lola:'hong', lauren:'jaea', don:'seunghwan', nicola:'juyeon' }, events:[{ label:'커튼콜데이', verified:true }] },
  { y:2025, m:12, d:7, t:'14:00', venue:'용인포은아트홀', cast:{ charlie:'jaehwan', lola:'hyunghoon', lauren:'jaea', don:'donghyun', nicola:'ruwon' }, events:[{ label:'커튼콜데이', verified:true }] },
  { y:2025, m:12, d:7, t:'19:00', venue:'용인포은아트홀', cast:{ charlie:'jaebeom', lola:'hong', lauren:'yoonsul', don:'jaehyun', nicola:'juyeon' }, events:[{ label:'커튼콜데이', verified:true }] },
  // 2025-12
  { y:2025, m:12, d:17, t:'19:30', cast:{ charlie:'jaehwan', lola:'seokyung', lauren:'yoonsul', don:'donghyun', nicola:'juyeon' } },
  { y:2025, m:12, d:18, t:'19:30', cast:{ charlie:'jaebeom', lola:'hyunghoon', lauren:'jaea', don:'jaehyun', nicola:'ruwon' } },
  { y:2025, m:12, d:19, t:'19:30', cast:{ charlie:'hoyoung', lola:'hong', lauren:'yoonsul', don:'seunghwan', nicola:'juyeon' } },
  { y:2025, m:12, d:20, t:'14:00', cast:{ charlie:'jaehwan', lola:'hyunghoon', lauren:'jaea', don:'donghyun', nicola:'ruwon' } },
  { y:2025, m:12, d:20, t:'19:00', cast:{ charlie:'hoyoung', lola:'seokyung', lauren:'jaea', don:'donghyun', nicola:'ruwon' } },
  { y:2025, m:12, d:21, t:'14:00', cast:{ charlie:'jaehwan', lola:'hong', lauren:'jaea', don:'jaehyun', nicola:'juyeon' } },
  { y:2025, m:12, d:21, t:'19:00', cast:{ charlie:'jaebeom', lola:'hyunghoon', lauren:'jaea', don:'seunghwan', nicola:'juyeon' } },
  { y:2025, m:12, d:23, t:'19:30', cast:{ charlie:'hoyoung', lola:'seokyung', lauren:'jaea', don:'jaehyun', nicola:'ruwon' } },
  { y:2025, m:12, d:24, t:'14:30', cast:{ charlie:'jaebeom', lola:'hong', lauren:'yoonsul', don:'seunghwan', nicola:'juyeon' } },
  { y:2025, m:12, d:24, t:'19:30', cast:{ charlie:'jaehwan', lola:'hyunghoon', lauren:'yoonsul', don:'seunghwan', nicola:'juyeon' } },
  { y:2025, m:12, d:25, t:'14:00', cast:{ charlie:'hoyoung', lola:'hong', lauren:'jaea', don:'jaehyun', nicola:'ruwon' } },
  { y:2025, m:12, d:25, t:'19:00', cast:{ charlie:'jaebeom', lola:'seokyung', lauren:'jaea', don:'jaehyun', nicola:'ruwon' } },
  { y:2025, m:12, d:26, t:'19:30', cast:{ charlie:'jaehwan', lola:'seokyung', lauren:'yoonsul', don:'donghyun', nicola:'ruwon' } },
  { y:2025, m:12, d:27, t:'14:00', cast:{ charlie:'hoyoung', lola:'hyunghoon', lauren:'jaea', don:'donghyun', nicola:'juyeon' } },
  { y:2025, m:12, d:27, t:'19:00', cast:{ charlie:'jaebeom', lola:'hong', lauren:'yoonsul', don:'jaehyun', nicola:'juyeon' } },
  { y:2025, m:12, d:28, t:'14:00', cast:{ charlie:'jaehwan', lola:'hyunghoon', lauren:'jaea', don:'seunghwan', nicola:'ruwon' } },
  { y:2025, m:12, d:30, t:'19:30', cast:{ charlie:'jaebeom', lola:'seokyung', lauren:'yoonsul', don:'jaehyun', nicola:'ruwon' } },
  { y:2025, m:12, d:31, t:'19:30', cast:{ charlie:'jaehwan', lola:'hong', lauren:'jaea', don:'donghyun', nicola:'juyeon' } },

  // 2026-01
  { y:2026, m:1, d:1, t:'14:00', cast:{ charlie:'jaebeom', lola:'seokyung', lauren:'yoonsul', don:'seunghwan', nicola:'ruwon' } },
  { y:2026, m:1, d:1, t:'19:00', cast:{ charlie:'jaehwan', lola:'hong', lauren:'yoonsul', don:'seunghwan', nicola:'ruwon' } },
  { y:2026, m:1, d:2, t:'19:30', cast:{ charlie:'hoyoung', lola:'hyunghoon', lauren:'jaea', don:'donghyun', nicola:'juyeon' } },
  { y:2026, m:1, d:3, t:'14:00', cast:{ charlie:'jaebeom', lola:'hong', lauren:'yoonsul', don:'jaehyun', nicola:'juyeon' } },
  { y:2026, m:1, d:3, t:'19:00', cast:{ charlie:'jaehwan', lola:'seokyung', lauren:'yoonsul', don:'jaehyun', nicola:'juyeon' } },
  { y:2026, m:1, d:4, t:'14:00', cast:{ charlie:'jaebeom', lola:'hyunghoon', lauren:'jaea', don:'seunghwan', nicola:'ruwon' } },
  { y:2026, m:1, d:4, t:'19:00', cast:{ charlie:'hoyoung', lola:'hong', lauren:'jaea', don:'donghyun', nicola:'ruwon' } },
  { y:2026, m:1, d:6, t:'19:30', cast:{ charlie:'jaehwan', lola:'seokyung', lauren:'yoonsul', don:'jaehyun', nicola:'ruwon' } },
  { y:2026, m:1, d:7, t:'19:30', cast:{ charlie:'jaebeom', lola:'hong', lauren:'jaea', don:'donghyun', nicola:'juyeon' } },
  { y:2026, m:1, d:8, t:'19:30', cast:{ charlie:'jaehwan', lola:'hyunghoon', lauren:'jaea', don:'jaehyun', nicola:'ruwon' } },
  { y:2026, m:1, d:9, t:'19:30', cast:{ charlie:'hoyoung', lola:'hong', lauren:'yoonsul', don:'seunghwan', nicola:'juyeon' } },
  { y:2026, m:1, d:10, t:'14:00', cast:{ charlie:'jaebeom', lola:'seokyung', lauren:'jaea', don:'donghyun', nicola:'ruwon' } },
  { y:2026, m:1, d:10, t:'19:00', cast:{ charlie:'jaehwan', lola:'seokyung', lauren:'jaea', don:'donghyun', nicola:'ruwon' } },
  { y:2026, m:1, d:11, t:'14:00', cast:{ charlie:'hoyoung', lola:'hyunghoon', lauren:'yoonsul', don:'seunghwan', nicola:'juyeon' } },
  { y:2026, m:1, d:11, t:'19:00', cast:{ charlie:'jaebeom', lola:'hong', lauren:'yoonsul', don:'seunghwan', nicola:'juyeon' } },
  { y:2026, m:1, d:13, t:'19:30', cast:{ charlie:'hoyoung', lola:'seokyung', lauren:'yoonsul', don:'jaehyun', nicola:'ruwon' } },
  { y:2026, m:1, d:14, t:'14:30', cast:{ charlie:'jaebeom', lola:'hyunghoon', lauren:'jaea', don:'donghyun', nicola:'juyeon' } },
  { y:2026, m:1, d:14, t:'19:30', cast:{ charlie:'jaehwan', lola:'hong', lauren:'jaea', don:'donghyun', nicola:'juyeon' } },
  { y:2026, m:1, d:15, t:'19:30', cast:{ charlie:'jaebeom', lola:'seokyung', lauren:'yoonsul', don:'seunghwan', nicola:'ruwon' } },
  { y:2026, m:1, d:16, t:'19:30', cast:{ charlie:'hoyoung', lola:'hong', lauren:'jaea', don:'donghyun', nicola:'ruwon' } },
  { y:2026, m:1, d:17, t:'14:00', cast:{ charlie:'jaehwan', lola:'hyunghoon', lauren:'yoonsul', don:'seunghwan', nicola:'juyeon' } },
  { y:2026, m:1, d:17, t:'19:00', cast:{ charlie:'jaebeom', lola:'seokyung', lauren:'yoonsul', don:'seunghwan', nicola:'juyeon' } },
  { y:2026, m:1, d:18, t:'14:00', cast:{ charlie:'jaehwan', lola:'hong', lauren:'jaea', don:'jaehyun', nicola:'ruwon' } },
  { y:2026, m:1, d:18, t:'19:00', cast:{ charlie:'hoyoung', lola:'hyunghoon', lauren:'jaea', don:'jaehyun', nicola:'ruwon' } },
  { y:2026, m:1, d:20, t:'19:30', cast:{ charlie:'jaehwan', lola:'seokyung', lauren:'yoonsul', don:'jaehyun', nicola:'juyeon' } },
  { y:2026, m:1, d:21, t:'19:30', cast:{ charlie:'hoyoung', lola:'hong', lauren:'jaea', don:'seunghwan', nicola:'ruwon' } },
  { y:2026, m:1, d:22, t:'19:30', cast:{ charlie:'jaebeom', lola:'hyunghoon', lauren:'yoonsul', don:'donghyun', nicola:'juyeon' } },
  { y:2026, m:1, d:23, t:'19:30', cast:{ charlie:'jaehwan', lola:'hong', lauren:'yoonsul', don:'donghyun', nicola:'juyeon' } },
  { y:2026, m:1, d:24, t:'14:00', cast:{ charlie:'jaebeom', lola:'seokyung', lauren:'jaea', don:'jaehyun', nicola:'ruwon' } },
  { y:2026, m:1, d:24, t:'19:00', cast:{ charlie:'hoyoung', lola:'hyunghoon', lauren:'jaea', don:'jaehyun', nicola:'ruwon' } },
  { y:2026, m:1, d:25, t:'14:00', cast:{ charlie:'jaehwan', lola:'seokyung', lauren:'yoonsul', don:'seunghwan', nicola:'juyeon' } },
  { y:2026, m:1, d:25, t:'19:00', cast:{ charlie:'jaebeom', lola:'hong', lauren:'yoonsul', don:'seunghwan', nicola:'juyeon' } },
  { y:2026, m:1, d:27, t:'19:30', cast:{ charlie:'jaehwan', lola:'hyunghoon', lauren:'jaea', don:'donghyun', nicola:'juyeon' }, events:[{ label:'커튼콜데이', verified:true }] },
  { y:2026, m:1, d:28, t:'14:30', cast:{ charlie:'hoyoung', lola:'seokyung', lauren:'yoonsul', don:'donghyun', nicola:'ruwon' }, events:[{ label:'커튼콜데이', verified:true }] },
  { y:2026, m:1, d:28, t:'19:30', cast:{ charlie:'jaebeom', lola:'hong', lauren:'jaea', don:'seunghwan', nicola:'ruwon' }, events:[{ label:'커튼콜데이', verified:true }] },
  { y:2026, m:1, d:29, t:'19:30', cast:{ charlie:'jaehwan', lola:'seokyung', lauren:'yoonsul', don:'jaehyun', nicola:'juyeon' }, events:[{ label:'커튼콜데이', verified:true }] },
  { y:2026, m:1, d:30, t:'19:30', cast:{ charlie:'hoyoung', lola:'hyunghoon', lauren:'jaea', don:'donghyun', nicola:'ruwon' }, events:[{ label:'커튼콜데이', verified:true }] },
  { y:2026, m:1, d:31, t:'14:00', cast:{ charlie:'jaehwan', lola:'hong', lauren:'yoonsul', don:'seunghwan', nicola:'juyeon' }, events:[{ label:'커튼콜데이', verified:true }] },
  { y:2026, m:1, d:31, t:'19:00', cast:{ charlie:'jaebeom', lola:'hyunghoon', lauren:'yoonsul', don:'seunghwan', nicola:'juyeon' }, events:[{ label:'커튼콜데이', verified:true }] },

  // 2026-02
  { y:2026, m:2, d:1, t:'14:00', cast:{ charlie:'hoyoung', lola:'seokyung', lauren:'jaea', don:'jaehyun', nicola:'ruwon' }, events:[{ label:'커튼콜데이', verified:true }] },
  { y:2026, m:2, d:1, t:'19:00', cast:{ charlie:'jaebeom', lola:'hong', lauren:'jaea', don:'jaehyun', nicola:'ruwon' }, events:[{ label:'커튼콜데이', verified:true }] },
  { y:2026, m:2, d:3, t:'19:30', cast:{ charlie:'jaehwan', lola:'hyunghoon', lauren:'yoonsul', don:'seunghwan', nicola:'ruwon' } },
  { y:2026, m:2, d:4, t:'19:30', cast:{ charlie:'jaebeom', lola:'hong', lauren:'jaea', don:'jaehyun', nicola:'juyeon' } },
  { y:2026, m:2, d:5, t:'19:30', cast:{ charlie:'jaebeom', lola:'seokyung', lauren:'yoonsul', don:'donghyun', nicola:'ruwon' } },
  { y:2026, m:2, d:6, t:'19:30', cast:{ charlie:'jaehwan', lola:'hong', lauren:'jaea', don:'seunghwan', nicola:'juyeon' } },
  { y:2026, m:2, d:7, t:'14:00', cast:{ charlie:'hoyoung', lola:'hyunghoon', lauren:'jaea', don:'jaehyun', nicola:'juyeon' } },
  { y:2026, m:2, d:7, t:'19:00', cast:{ charlie:'jaehwan', lola:'hong', lauren:'jaea', don:'jaehyun', nicola:'juyeon' } },
  { y:2026, m:2, d:8, t:'14:00', cast:{ charlie:'jaebeom', lola:'seokyung', lauren:'yoonsul', don:'donghyun', nicola:'ruwon' } },
  { y:2026, m:2, d:8, t:'19:00', cast:{ charlie:'hoyoung', lola:'hyunghoon', lauren:'yoonsul', don:'donghyun', nicola:'ruwon' } },
  { y:2026, m:2, d:10, t:'19:30', cast:{ charlie:'hoyoung', lola:'hong', lauren:'jaea', don:'seunghwan', nicola:'juyeon' } },
  { y:2026, m:2, d:11, t:'19:30', cast:{ charlie:'jaebeom', lola:'hyunghoon', lauren:'yoonsul', don:'jaehyun', nicola:'juyeon' } },
  { y:2026, m:2, d:12, t:'19:30', cast:{ charlie:'jaehwan', lola:'seokyung', lauren:'jaea', don:'donghyun', nicola:'ruwon' } },
  { y:2026, m:2, d:13, t:'19:30', cast:{ charlie:'hoyoung', lola:'hyunghoon', lauren:'yoonsul', don:'jaehyun', nicola:'juyeon' } },
  { y:2026, m:2, d:14, t:'14:00', cast:{ charlie:'jaehwan', lola:'hong', lauren:'jaea', don:'donghyun', nicola:'ruwon' } },
  { y:2026, m:2, d:14, t:'19:00', cast:{ charlie:'jaebeom', lola:'seokyung', lauren:'jaea', don:'donghyun', nicola:'ruwon' } },
  { y:2026, m:2, d:15, t:'14:00', cast:{ charlie:'jaehwan', lola:'hyunghoon', lauren:'yoonsul', don:'seunghwan', nicola:'juyeon' } },
  { y:2026, m:2, d:15, t:'19:00', cast:{ charlie:'hoyoung', lola:'hong', lauren:'yoonsul', don:'jaehyun', nicola:'juyeon' } },
  { y:2026, m:2, d:17, t:'14:00', cast:{ charlie:'jaebeom', lola:'hong', lauren:'jaea', don:'jaehyun', nicola:'ruwon' }, events:[{ label:'아코디언 엽서 증정', verified:true, description:'2025-26 PRICE&SON 사원증을 이용해 당일 회차 적립을 완료한 임직원에게 미공개 포토 아코디언 엽서를 증정합니다.' }] },
  { y:2026, m:2, d:17, t:'19:00', cast:{ charlie:'jaehwan', lola:'hyunghoon', lauren:'jaea', don:'jaehyun', nicola:'ruwon' }, events:[{ label:'아코디언 엽서 증정', verified:true, description:'2025-26 PRICE&SON 사원증을 이용해 당일 회차 적립을 완료한 임직원에게 미공개 포토 아코디언 엽서를 증정합니다.' }] },
  { y:2026, m:2, d:18, t:'14:00', cast:{ charlie:'hoyoung', lola:'seokyung', lauren:'yoonsul', don:'seunghwan', nicola:'juyeon' }, events:[{ label:'아코디언 엽서 증정', verified:true, description:'2025-26 PRICE&SON 사원증을 이용해 당일 회차 적립을 완료한 임직원에게 미공개 포토 아코디언 엽서를 증정합니다.' }] },
  { y:2026, m:2, d:18, t:'19:00', cast:{ charlie:'jaehwan', lola:'hong', lauren:'yoonsul', don:'seunghwan', nicola:'juyeon' }, events:[{ label:'아코디언 엽서 증정', verified:true, description:'2025-26 PRICE&SON 사원증을 이용해 당일 회차 적립을 완료한 임직원에게 미공개 포토 아코디언 엽서를 증정합니다.' }] },
  { y:2026, m:2, d:19, t:'19:30', cast:{ charlie:'jaehwan', lola:'hong', lauren:'jaea', don:'donghyun', nicola:'ruwon' }, events:[{ label:'아코디언 엽서 증정', verified:true, description:'2025-26 PRICE&SON 사원증을 이용해 당일 회차 적립을 완료한 임직원에게 미공개 포토 아코디언 엽서를 증정합니다.' }] },
  { y:2026, m:2, d:20, t:'19:30', cast:{ charlie:'jaebeom', lola:'hyunghoon', lauren:'yoonsul', don:'jaehyun', nicola:'juyeon' }, events:[{ label:'아코디언 엽서 증정', verified:true, description:'2025-26 PRICE&SON 사원증을 이용해 당일 회차 적립을 완료한 임직원에게 미공개 포토 아코디언 엽서를 증정합니다.' }] },
  { y:2026, m:2, d:21, t:'14:00', cast:{ charlie:'hoyoung', lola:'seokyung', lauren:'jaea', don:'seunghwan', nicola:'ruwon' }, events:[{ label:'아코디언 엽서 증정', verified:true, description:'2025-26 PRICE&SON 사원증을 이용해 당일 회차 적립을 완료한 임직원에게 미공개 포토 아코디언 엽서를 증정합니다.' }] },
  { y:2026, m:2, d:21, t:'19:00', cast:{ charlie:'jaebeom', lola:'hyunghoon', lauren:'jaea', don:'seunghwan', nicola:'ruwon' }, events:[{ label:'아코디언 엽서 증정', verified:true, description:'2025-26 PRICE&SON 사원증을 이용해 당일 회차 적립을 완료한 임직원에게 미공개 포토 아코디언 엽서를 증정합니다.' }] },
  { y:2026, m:2, d:22, t:'14:00', cast:{ charlie:'hoyoung', lola:'hong', lauren:'yoonsul', don:'donghyun', nicola:'juyeon' }, events:[{ label:'아코디언 엽서 증정', verified:true, description:'2025-26 PRICE&SON 사원증을 이용해 당일 회차 적립을 완료한 임직원에게 미공개 포토 아코디언 엽서를 증정합니다.' }] },
  { y:2026, m:2, d:24, t:'19:30', cast:{ charlie:'jaebeom', lola:'seokyung', lauren:'yoonsul', don:'donghyun', nicola:'juyeon' } },
  { y:2026, m:2, d:25, t:'19:30', cast:{ charlie:'jaebeom', lola:'hong', lauren:'jaea', don:'seunghwan', nicola:'ruwon' } },
  { y:2026, m:2, d:26, t:'19:30', cast:{ charlie:'hoyoung', lola:'hyunghoon', lauren:'yoonsul', don:'jaehyun', nicola:'juyeon' } },
  { y:2026, m:2, d:27, t:'19:30', cast:{ charlie:'jaebeom', lola:'hong', lauren:'jaea', don:'seunghwan', nicola:'ruwon' } },
  { y:2026, m:2, d:28, t:'14:00', cast:{ charlie:'hoyoung', lola:'seokyung', lauren:'yoonsul', don:'jaehyun', nicola:'juyeon' } },
  { y:2026, m:2, d:28, t:'19:00', cast:{ charlie:'jaebeom', lola:'hyunghoon', lauren:'yoonsul', don:'jaehyun', nicola:'juyeon' } },

  // 2026-03
  { y:2026, m:3, d:1, t:'14:00', cast:{ charlie:'jaebeom', lola:'seokyung', lauren:'jaea', don:'donghyun', nicola:'ruwon' } },
  { y:2026, m:3, d:1, t:'19:00', cast:{ charlie:'hoyoung', lola:'hong', lauren:'jaea', don:'donghyun', nicola:'juyeon' } },
  { y:2026, m:3, d:2, t:'14:00', cast:{ charlie:'jaebeom', lola:'hyunghoon', lauren:'yoonsul', don:'seunghwan', nicola:'ruwon' } },
  { y:2026, m:3, d:4, t:'19:30', cast:{ charlie:'jaehwan', lola:'seokyung', lauren:'jaea', don:'donghyun', nicola:'ruwon' } },
  { y:2026, m:3, d:5, t:'19:30', cast:{ charlie:'hoyoung', lola:'hyunghoon', lauren:'yoonsul', don:'jaehyun', nicola:'ruwon' } },
  { y:2026, m:3, d:6, t:'19:30', cast:{ charlie:'jaebeom', lola:'hong', lauren:'jaea', don:'seunghwan', nicola:'juyeon' } },
  { y:2026, m:3, d:7, t:'14:00', cast:{ charlie:'hoyoung', lola:'seokyung', lauren:'yoonsul', don:'donghyun', nicola:'ruwon' } },
  { y:2026, m:3, d:7, t:'19:00', cast:{ charlie:'jaehwan', lola:'hyunghoon', lauren:'yoonsul', don:'jaehyun', nicola:'ruwon' } },
  { y:2026, m:3, d:8, t:'14:00', cast:{ charlie:'jaebeom', lola:'seokyung', lauren:'jaea', don:'seunghwan', nicola:'juyeon' } },
  { y:2026, m:3, d:8, t:'19:00', cast:{ charlie:'hoyoung', lola:'hong', lauren:'jaea', don:'seunghwan', nicola:'juyeon' } },
  { y:2026, m:3, d:10, t:'19:30', cast:{ charlie:'jaehwan', lola:'hong', lauren:'yoonsul', don:'donghyun', nicola:'ruwon' } },
  { y:2026, m:3, d:11, t:'19:30', cast:{ charlie:'hoyoung', lola:'seokyung', lauren:'jaea', don:'seunghwan', nicola:'juyeon' } },
  { y:2026, m:3, d:12, t:'19:30', cast:{ charlie:'hoyoung', lola:'hong', lauren:'jaea', don:'jaehyun', nicola:'ruwon' } },
  { y:2026, m:3, d:13, t:'19:30', cast:{ charlie:'jaebeom', lola:'seokyung', lauren:'yoonsul', don:'seunghwan', nicola:'ruwon' } },
  { y:2026, m:3, d:14, t:'14:00', cast:{ charlie:'hoyoung', lola:'hyunghoon', lauren:'jaea', don:'jaehyun', nicola:'juyeon' } },
  { y:2026, m:3, d:14, t:'19:00', cast:{ charlie:'jaebeom', lola:'hong', lauren:'jaea', don:'jaehyun', nicola:'juyeon' } },
  { y:2026, m:3, d:15, t:'14:00', cast:{ charlie:'jaehwan', lola:'seokyung', lauren:'yoonsul', don:'donghyun', nicola:'ruwon' } },
  { y:2026, m:3, d:15, t:'19:00', cast:{ charlie:'hoyoung', lola:'hyunghoon', lauren:'yoonsul', don:'donghyun', nicola:'ruwon' } },
  { y:2026, m:3, d:17, t:'19:30', cast:{ charlie:'jaebeom', lola:'hong', lauren:'jaea', don:'donghyun', nicola:'ruwon' } },
  { y:2026, m:3, d:18, t:'14:30', cast:{ charlie:'hoyoung', lola:'hyunghoon', lauren:'yoonsul', don:'jaehyun', nicola:'juyeon' } },
  { y:2026, m:3, d:18, t:'19:30', cast:{ charlie:'hoyoung', lola:'seokyung', lauren:'yoonsul', don:'seunghwan', nicola:'juyeon' } },
  { y:2026, m:3, d:19, t:'19:30', cast:{ charlie:'jaebeom', lola:'hyunghoon', lauren:'jaea', don:'donghyun', nicola:'ruwon' } },
  { y:2026, m:3, d:20, t:'19:30', cast:{ charlie:'hoyoung', lola:'seokyung', lauren:'yoonsul', don:'seunghwan', nicola:'ruwon' } },
  { y:2026, m:3, d:21, t:'14:00', cast:{ charlie:'jaehwan', lola:'hong', lauren:'jaea', don:'jaehyun', nicola:'juyeon' } },
  { y:2026, m:3, d:21, t:'19:00', cast:{ charlie:'jaebeom', lola:'hyunghoon', lauren:'jaea', don:'jaehyun', nicola:'juyeon' } },
  { y:2026, m:3, d:22, t:'14:00', cast:{ charlie:'jaehwan', lola:'seokyung', lauren:'yoonsul', don:'donghyun', nicola:'ruwon' } },
  { y:2026, m:3, d:22, t:'19:00', cast:{ charlie:'jaebeom', lola:'hyunghoon', lauren:'yoonsul', don:'donghyun', nicola:'ruwon' } },
  { y:2026, m:3, d:24, t:'19:30', cast:{ charlie:'jaebeom', lola:'seokyung', lauren:'yoonsul', don:'seunghwan', nicola:'ruwon' } },
  { y:2026, m:3, d:25, t:'14:30', cast:{ charlie:'jaehwan', lola:'hyunghoon', lauren:'jaea', don:'donghyun', nicola:'juyeon' } },
  { y:2026, m:3, d:25, t:'19:30', cast:{ charlie:'jaebeom', lola:'hong', lauren:'jaea', don:'donghyun', nicola:'ruwon' } },
  { y:2026, m:3, d:26, t:'19:30', cast:{ charlie:'hoyoung', lola:'seokyung', lauren:'yoonsul', don:'jaehyun', nicola:'juyeon' } },
  { y:2026, m:3, d:27, t:'19:30', cast:{ charlie:'jaehwan', lola:'hong', lauren:'yoonsul', don:'donghyun', nicola:'ruwon' } },
  { y:2026, m:3, d:28, t:'14:00', cast:{ charlie:'jaebeom', lola:'seokyung', lauren:'jaea', don:'donghyun', nicola:'juyeon' } },
  { y:2026, m:3, d:28, t:'19:00', cast:{ charlie:'jaehwan', lola:'hong', lauren:'yoonsul', don:'jaehyun', nicola:'juyeon' }, events:[{ label:'막공', verified:true }, { label:'무대인사', verified:true }] },
  { y:2026, m:3, d:29, t:'14:00', cast:{ charlie:'jaebeom', lola:'hyunghoon', lauren:'jaea', don:'seunghwan', nicola:'ruwon' } },
  // 2026 지방투어 (서울 종료 후)
  { y:2026, m:4, d:4, t:'14:00', venue:'광주예술의전당 대극장', cast:{ charlie:'jaebeom', lola:'seokyung', lauren:'yoonsul', don:'seunghwan', nicola:'ruwon' } },
  { y:2026, m:4, d:4, t:'19:00', venue:'광주예술의전당 대극장', cast:{ charlie:'jaebeom', lola:'hong', lauren:'yoonsul', don:'donghyun', nicola:'juyeon' } },
  { y:2026, m:4, d:5, t:'14:00', venue:'광주예술의전당 대극장', cast:{ charlie:'jaehwan', lola:'hyunghoon', lauren:'jaea', don:'jaehyun', nicola:'ruwon' } },
  { y:2026, m:4, d:5, t:'19:00', venue:'광주예술의전당 대극장', cast:{ charlie:'hoyoung', lola:'hong', lauren:'jaea', don:'donghyun', nicola:'juyeon' } },
  { y:2026, m:4, d:11, t:'14:00', venue:'계명아트센터', cast:{ charlie:'jaehwan', lola:'hyunghoon', lauren:'jaea', don:'seunghwan', nicola:'ruwon' } },
  { y:2026, m:4, d:11, t:'19:00', venue:'계명아트센터', cast:{ charlie:'jaebeom', lola:'hong', lauren:'jaea', don:'jaehyun', nicola:'ruwon' } },
  { y:2026, m:4, d:12, t:'14:00', venue:'계명아트센터', cast:{ charlie:'jaehwan', lola:'seokyung', lauren:'yoonsul', don:'donghyun', nicola:'juyeon' } },
  { y:2026, m:4, d:12, t:'19:00', venue:'계명아트센터', cast:{ charlie:'hoyoung', lola:'hyunghoon', lauren:'yoonsul', don:'jaehyun', nicola:'juyeon' } },
  { y:2026, m:4, d:17, t:'19:30', venue:'계명아트센터', cast:{ charlie:'hoyoung', lola:'hong', lauren:'yoonsul', don:'donghyun', nicola:'juyeon' } },
  { y:2026, m:4, d:18, t:'14:00', venue:'계명아트센터', cast:{ charlie:'jaebeom', lola:'seokyung', lauren:'yoonsul', don:'jaehyun', nicola:'ruwon' } },
  { y:2026, m:4, d:18, t:'19:00', venue:'계명아트센터', cast:{ charlie:'jaehwan', lola:'hong', lauren:'jaea', don:'donghyun', nicola:'juyeon' } },
  { y:2026, m:4, d:19, t:'14:00', venue:'계명아트센터', cast:{ charlie:'jaebeom', lola:'hyunghoon', lauren:'jaea', don:'seunghwan', nicola:'ruwon' } },
  { y:2026, m:4, d:25, t:'14:00', venue:'부산 드림씨어터', cast:{ charlie:'jaebeom', lola:'seokyung', lauren:'yoonsul', don:'seunghwan', nicola:'ruwon' } },
  { y:2026, m:4, d:25, t:'19:00', venue:'부산 드림씨어터', cast:{ charlie:'jaehwan', lola:'hong', lauren:'yoonsul', don:'jaehyun', nicola:'ruwon' } },
  { y:2026, m:4, d:26, t:'14:00', venue:'부산 드림씨어터', cast:{ charlie:'hoyoung', lola:'hyunghoon', lauren:'jaea', don:'donghyun', nicola:'juyeon' } },
  { y:2026, m:4, d:26, t:'19:00', venue:'부산 드림씨어터', cast:{ charlie:'jaebeom', lola:'seokyung', lauren:'jaea', don:'seunghwan', nicola:'juyeon' } },
  { y:2026, m:5, d:1, t:'19:00', venue:'부산 드림씨어터', cast:{ charlie:'jaehwan', lola:'hong', lauren:'jaea', don:'jaehyun', nicola:'ruwon' } },
  { y:2026, m:5, d:2, t:'14:00', venue:'부산 드림씨어터', cast:{ charlie:'jaebeom', lola:'seokyung', lauren:'yoonsul', don:'seunghwan', nicola:'juyeon' } },
  { y:2026, m:5, d:2, t:'19:00', venue:'부산 드림씨어터', cast:{ charlie:'jaehwan', lola:'hyunghoon', lauren:'jaea', don:'donghyun', nicola:'ruwon' } },
  { y:2026, m:5, d:3, t:'14:00', venue:'부산 드림씨어터', cast:{ charlie:'hoyoung', lola:'hong', lauren:'yoonsul', don:'jaehyun', nicola:'juyeon' } },
];

/* Calendar navigation range for this production. */
const RANGE = { min:{ y:2025, m:11 }, max:{ y:2026, m:5 } };

/* === KINKY CAST ORDER V19 START === */
;(() => {
  const roleOrder = [
    '찰리',
    '롤라',
    '로렌',
    '돈',
    '니콜라'
  ];

  const actorOrder = {
    '찰리': ['김호영','이재환','신재범'],
    '롤라': ['강홍석','백형훈','서경수'],
    '로렌': ['한재아','허윤슬'],
    '돈': ['신승환','심재현','김동현'],
    '니콜라': ['이루원','유주연']
  };

  const actorNameOf = id => {
    if (ACTORS && ACTORS[id]) {
      return ACTORS[id].name || id;
    }

    if (Array.isArray(ACTORS)) {
      const actor = ACTORS.find(item => item.id === id);
      return actor ? actor.name : id;
    }

    return id;
  };

  const roleRank = role => {
    const i = roleOrder.indexOf(role.name);
    return i < 0 ? 999 : i;
  };

  ROLES.sort((a,b) => roleRank(a) - roleRank(b));

  ROLES.forEach(role => {
    const wanted = actorOrder[role.name];
    if (!wanted || !Array.isArray(role.actors)) return;

    role.actors.sort((a,b) => {
      const ai = wanted.indexOf(actorNameOf(a));
      const bi = wanted.indexOf(actorNameOf(b));

      return (ai < 0 ? 999 : ai) -
             (bi < 0 ? 999 : bi);
    });
  });
})();
/* === KINKY CAST ORDER V19 END === */
