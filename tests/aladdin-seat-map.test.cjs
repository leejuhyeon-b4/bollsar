const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { test } = require('node:test');

function readMap (file) {
  const context = {};
  vm.runInNewContext(fs.readFileSync(file, 'utf8') + '\nglobalThis.result = { AISLE_W, SEAT_MAP };', context);
  return JSON.parse(JSON.stringify(context.result));
}

test('Aladdin Charlotte preserves every verified seat and aisle except the closed OP row', () => {
  const original = readMap('productions/kinky-boots-2025-2026-7th/data/seat-map.js');
  const aladdin = readMap('productions/aladdin-2024-2025-1st/data/seat-map.js');
  assert.equal(original.SEAT_MAP.floors.flatMap(floor => floor.rows.filter(row => row.r === 'OP')).length, 1);
  for (const floor of original.SEAT_MAP.floors) floor.rows = floor.rows.filter(row => row.r !== 'OP');
  assert.equal(aladdin.AISLE_W, original.AISLE_W);
  assert.deepEqual(aladdin.SEAT_MAP, original.SEAT_MAP);
});

test('Dream official inventories preserve missing seats and all wheelchair IDs without overlapping cells', () => {
  const context = { Intl, Date, console: { warn () {}, error () {} }, localStorage: { getItem () { return null; } } };
  vm.runInNewContext([
    'productions/aladdin-2024-2025-1st/data/schedule.js',
    'productions/aladdin-2024-2025-1st/data/seat-map.js', 'data.js'
  ].map(file => fs.readFileSync(file, 'utf8')).join('\n') + `
    globalThis.result = {
      independentActiveMap: SEAT_MAP !== ALADDIN_SEAT_MAPS.seoul,
      venue: ALADDIN_SEAT_MAPS.busan.venue,
      tours: TOUR_SEAT_VENUES,
      floors: ALADDIN_SEAT_MAPS.busan.floors.map(floor => ({
        id: floor.id, grid: floorGrid(floor),
        rows: floor.rows.map(row => ({ id: row.r, seats: seatsInRow(floor, row), cells: seatRowCells(floor, row) }))
      }))
    };`, context);
  const result = JSON.parse(JSON.stringify(context.result));
  assert.equal(result.independentActiveMap, true);
  assert.equal(result.venue, '부산 드림씨어터');
  assert.deepEqual(result.tours, { '부산 드림씨어터': { code: 'BSN' } });
  assert.deepEqual(result.floors.map(floor => floor.rows.reduce((sum, row) => sum + row.seats.length, 0)), [1028, 398, 280]);
  const ids = new Set();
  for (const floor of result.floors) {
    const aisleColumns = floor.grid.labelGc.slice(1, -1).flatMap(start => [start, start + 1, start + 2]);
    for (const row of floor.rows) {
      const columns = new Set();
      for (const cell of row.cells) {
        assert(!ids.has(cell.id), `duplicate seat ${cell.id}`);
        ids.add(cell.id);
        assert(Number.isInteger(cell.gc) && cell.gc > 0);
        assert(!columns.has(cell.gc), `overlapping seats on ${floor.id}-${row.id}`);
        assert(!aisleColumns.includes(cell.gc), `seat overlaps aisle on ${floor.id}-${row.id}`);
        columns.add(cell.gc);
      }
    }
  }
  const row = (floor, number) => result.floors.find(item => item.id === floor).rows.find(item => item.id === number).seats;
  assert.equal(row('1', '1').some(seat => seat.no === '37'), false);
  assert.equal(row('1', '2').some(seat => seat.no === '37'), true);
  assert.equal(row('1', '12').filter(seat => String(seat.no).startsWith('W')).length, 4);
  assert.equal(row('1', '25').filter(seat => String(seat.no).startsWith('W')).length, 8);
  assert.equal(row('1', '25').some(seat => Number(seat.no) >= 17 && Number(seat.no) <= 33), false, 'central sound booth stays empty');
  assert.equal(row('2', '7').filter(seat => String(seat.no).startsWith('W')).length, 6);
  assert.equal(row('2', '7').filter(seat => !String(seat.no).startsWith('W')).length, 34, 'regular seats exist beside wheelchair seats');
  assert.equal(row('2', '9').some(seat => seat.no === '51'), true);
});
