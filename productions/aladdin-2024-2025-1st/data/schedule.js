/* Preparation metadata only. Add verified performances after receiving source schedules. */
const WORK = {
  id: 'aladdin-2024-2025-1st',
  title: '알라딘',
  run: '초연',
  venue: '샤롯데씨어터',
  period: { start: '', end: '' },
  poster: '',
  preparing: true
};
const ACTORS = { hong: { name: '강홍석', photo: '' } };
const ROLES = [{ id: 'genie', name: '지니', actors: ['hong'] }];
const PERFS = [];
// The empty preview opens this month; this is not the production's performance period.
const [previewYear, previewMonth] = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit'
}).format(new Date()).split('-').map(Number);
const RANGE = { min: { y: previewYear, m: previewMonth }, max: { y: previewYear, m: previewMonth } };
