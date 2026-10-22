/* Neutral preparation view using the shared schedule renderer contract. */
(() => {
  const empty = () => '<section class="np-empty"><h2>스케줄 준비 중</h2><p>공식 일정·캐스팅 자료를 확인한 뒤 회차를 연결합니다.</p></section>';
  window.BollsarScheduleTheme = Object.freeze({
    id: 'aladdin-2024-2025-1st-genie',
    assets: Object.freeze({ calendarPhoto: '', leadPhoto: '' }),
    render: Object.freeze({
      viewTabsHTML: ({ view }) => `<div class="np-vt" role="tablist" aria-label="보기 전환">${['calendar', 'list'].map(value => `<button type="button" role="tab" data-view="${value}" aria-selected="${view === value}" aria-pressed="${view === value}">${value === 'calendar' ? '달력' : '목록'}</button>`).join('')}</div>`,
      // Real performance rendering and artwork are added together once source data is ready.
      leadHTML: () => '',
      entryHTML: () => '',
      calendarCellHTML: () => '',
      emptyListHTML: empty,
      pastToggleHTML: () => '',
      listHTML: empty,
      calendarFrameHTML: empty,
      sheetFrameHTML: () => ''
    })
  });
})();
