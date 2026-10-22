/* Aladdin-only venue switch; shared seat geometry/SVG and PNG confirmation stay in the common engine. */
(() => {
  const storageKey = 'bollsar.venue.v1.production.aladdin-2024-2025-1st';
  let selected = 'seoul';
  try { if (localStorage.getItem(storageKey) === 'busan') selected = 'busan'; } catch (_) {}
  const label = key => key === 'seoul' ? '서울 · 샤롯데씨어터' : '부산 · 드림씨어터';
  function select(key) {
    if (!Object.hasOwn(ALADDIN_SEAT_MAPS, key)) return false;
    selected = key;
    Object.assign(SEAT_MAP, ALADDIN_SEAT_MAPS[key]);
    try { localStorage.setItem(storageKey, key); } catch (_) {}
    return true;
  }
  // Restore only this theme's venue choice; do not alter record keys or stored seats.
  Object.assign(SEAT_MAP, ALADDIN_SEAT_MAPS[selected]);
  const venueOf = perf => perf.venue || WORK.venue;
  function summary(records, performances, key = selected) {
    const venue = ALADDIN_SEAT_MAPS[key].venue;
    return {
      watched: records.filter(({perf}) => venueOf(perf) === venue).length,
      total: performances.filter(perf => venueOf(perf) === venue).length
    };
  }
  function mapRecords(records) {
    if (selected !== 'busan') return records;
    return records.map(item => {
      const match = /^TV:BSN:([1-3]):(REG|WC):(\d+):(\d+)$/.exec(item.rec.seat || '');
      return match ? {...item, rec:{...item.rec, seat:`${match[1]}-${match[3]}-${match[2] === 'WC' ? 'W' : ''}${match[4]}`}} : item;
    });
  }
  function boardHTML({records, performances, seatMapHTML}) {
    const other = selected === 'seoul' ? 'busan' : 'seoul';
    const current = summary(records, performances), alternate = summary(records, performances, other);
    const map = ALADDIN_SEAT_MAPS[selected];
    return `<section class="aladdin-board" data-venue="${selected}"><h2>${label(selected)}</h2>
      <p>관람 횟수 <strong>${current.watched} / ${current.total}</strong></p>
      <p class="aladdin-other-count" data-other-venue="${other}">${label(other)} · ${alternate.watched} / ${alternate.total}회</p>
      ${map.floors.length ? seatMapHTML(mapRecords(records)) : '<p>공식 좌석배치도를 확인하고 있습니다.</p>'}</section>`;
  }
  window.BollsarSettlementTheme = Object.freeze({
    selectedVenue: () => selected,
    selectVenue: select,
    mapRecords,
    summary,
    bodyHTML(args) {
      return `<section class="aladdin-venues" aria-label="정산판 극장 선택">
        <div class="aladdin-venue-labels"><span>서울 · 샤롯데</span><span>부산 · 드림</span></div>
        <input class="aladdin-venue-switch" type="range" min="0" max="1" step="1" value="${selected === 'busan' ? 1 : 0}" aria-label="좌석도 극장 전환" aria-valuetext="${label(selected)}">
        <p>좌우로 밀어서 극장을 바꿀 수 있습니다.</p></section>
        ${boardHTML(args)}${args.paletteHTML()}
        <button type="button" class="js-map-overview">좌석도 확대해서 보기</button>
        <button type="button" class="js-save">이미지로 저장하기</button>
        <p class="aladdin-preparing">디자인·회차 자료 준비 중입니다. 로그인과 원격 저장은 비활성 상태입니다.</p>`;
    },
    bind(render) {
      document.querySelector('.aladdin-venue-switch').addEventListener('change', event => {
        select(event.target.value === '1' ? 'busan' : 'seoul');
        render();
      });
    },
    async exportPng(args) {
      const board = document.createElement('div');
      board.className = 'aladdin-export';
      board.setAttribute('data-seat-export', '');
      board.innerHTML = `<h1>지니 · 알라딘 초연</h1>${boardHTML(args)}`;
      document.body.append(board);
      try {
        await document.fonts.ready;
        board.style.width = `${Math.max(900, board.scrollWidth + 64)}px`;
        window.SeatLines.renderAll();
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const canvas = await html2canvas(board, {scale:2, backgroundColor:'#ffffff', logging:false});
        return await new Promise((resolve,reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(Error('PNG 생성 실패')), 'image/png'));
      } finally { board.remove(); }
    }
  });
})();
