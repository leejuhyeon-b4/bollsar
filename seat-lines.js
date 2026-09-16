(() => {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const EPS = 0.01;
  let scheduled = false;

  const round = value => Math.round(value * 1000) / 1000;

  function rectWithin(element, root) {
    const rootRect = root.getBoundingClientRect();
    const rect = element.getBoundingClientRect();

    const sx = root.offsetWidth
      ? rootRect.width / root.offsetWidth
      : 1;

    const sy = root.offsetHeight
      ? rootRect.height / root.offsetHeight
      : 1;

    return {
      x: round((rect.left - rootRect.left) / (sx || 1)),
      y: round((rect.top - rootRect.top) / (sy || 1)),
      w: round(rect.width / (sx || 1)),
      h: round(rect.height / (sy || 1))
    };
  }

  function addEdges(target, rect) {
    const x1 = rect.x;
    const y1 = rect.y;
    const x2 = round(rect.x + rect.w);
    const y2 = round(rect.y + rect.h);

    target.push(['H', y1, x1, x2]);
    target.push(['H', y2, x1, x2]);
    target.push(['V', x1, y1, y2]);
    target.push(['V', x2, y1, y2]);
  }

  /*
   * Adjacent seat edges are merged into ONE continuous segment.
   * This is the important part:
   * no double borders and no per-seat diagonal corner joins.
   */
  function mergeSegments(segments) {
    const groups = new Map();

    for (const [axis, fixed, start, end] of segments) {
      const a = Math.min(start, end);
      const b = Math.max(start, end);
      const key = `${axis}:${round(fixed)}`;

      if (!groups.has(key)) {
        groups.set(key, {
          axis,
          fixed: round(fixed),
          ranges: []
        });
      }

      groups.get(key).ranges.push([
        round(a),
        round(b)
      ]);
    }

    const merged = [];

    for (const group of groups.values()) {
      group.ranges.sort(
        (a, b) => a[0] - b[0] || a[1] - b[1]
      );

      let current = null;

      for (const range of group.ranges) {
        if (!current) {
          current = range.slice();
          continue;
        }

        if (range[0] <= current[1] + EPS) {
          current[1] = Math.max(
            current[1],
            range[1]
          );
        } else {
          merged.push([
            group.axis,
            group.fixed,
            current[0],
            current[1]
          ]);

          current = range.slice();
        }
      }

      if (current) {
        merged.push([
          group.axis,
          group.fixed,
          current[0],
          current[1]
        ]);
      }
    }

    return merged;
  }

  function pathData(segments) {
    return mergeSegments(segments)
      .map(([axis, fixed, start, end]) =>
        axis === 'H'
          ? `M ${start} ${fixed} H ${end}`
          : `M ${fixed} ${start} V ${end}`
      )
      .join(' ');
  }

  function addPath(svg, segments, color, width) {
    if (!segments.length) return;

    const path = document.createElementNS(
      SVG_NS,
      'path'
    );

    path.setAttribute(
      'd',
      pathData(segments)
    );

    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', color);

    path.setAttribute(
      'stroke-width',
      String(width)
    );

    /*
     * Square cap + miter join:
     * every vertex ends as a true right angle.
     */
    path.setAttribute(
      'stroke-linecap',
      'square'
    );

    path.setAttribute(
      'stroke-linejoin',
      'miter'
    );

    svg.append(path);
  }

  function renderOne(root, selector, kind) {
    const seats = [
      ...root.querySelectorAll(selector)
    ];

    if (
      !seats.length ||
      !root.offsetWidth ||
      !root.offsetHeight
    ) {
      return;
    }

    const items = seats.map(seat => ({
      seat,
      rect: rectWithin(seat, root),
      on: seat.classList.contains('on')
    }));

    const signature = [
      root.offsetWidth,
      root.offsetHeight,

      ...items.flatMap(item => [
        item.rect.x,
        item.rect.y,
        item.rect.w,
        item.rect.h,
        item.on ? 1 : 0
      ])
    ].join('|');

    const existing = root.querySelector(
      ':scope > svg.seat-line-overlay'
    );

    if (
      existing &&
      root.dataset.seatLinesSignature === signature
    ) {
      return;
    }

    if (existing) existing.remove();

    if (
      getComputedStyle(root).position === 'static'
    ) {
      root.style.position = 'relative';
    }

    const svg = document.createElementNS(
      SVG_NS,
      'svg'
    );

    svg.classList.add(
      'seat-line-overlay'
    );

    svg.setAttribute(
      'width',
      String(root.offsetWidth)
    );

    svg.setAttribute(
      'height',
      String(root.offsetHeight)
    );

    svg.setAttribute(
      'viewBox',
      `0 0 ${root.offsetWidth} ${root.offsetHeight}`
    );

    svg.setAttribute(
      'aria-hidden',
      'true'
    );

    Object.assign(svg.style, {
      position: 'absolute',
      left: '0',
      top: '0',
      width: `${root.offsetWidth}px`,
      height: `${root.offsetHeight}px`,
      overflow: 'visible',
      pointerEvents: 'none',
      zIndex: '4'
    });

    const base = [];
    const strong = [];

    /*
     * Every seat contributes its geometry.
     * Shared coordinates are merged later,
     * so an internal border is painted only once.
     */
    for (const item of items) {
      addEdges(base, item.rect);

      if (item.on) {
        addEdges(strong, item.rect);
      }
    }

    if (kind === 'export') {
      addPath(
        svg,
        base,
        'rgba(232,220,201,.78)',
        1
      );

      addPath(
        svg,
        strong,
        '#f1e5cf',
        1
      );
    } else {
      const styles =
        getComputedStyle(root);

      const normal =
        styles
          .getPropertyValue('--ink-40')
          .trim() ||
        'rgba(23,21,15,.40)';

      const selected =
        styles
          .getPropertyValue('--ink-55')
          .trim() ||
        'rgba(23,21,15,.55)';

      /*
       * Settlement tab = 0.5px.
       * Expanded map = 1px.
       */
      const width =
        root.closest('.map-overview')
          ? 1
          : 0.5;

      addPath(
        svg,
        base,
        normal,
        width
      );

      addPath(
        svg,
        strong,
        selected,
        width
      );
    }

    root.append(svg);

    root.dataset.seatLinesSignature =
      signature;
  }

  function renderSettlement(
    scope = document
  ) {
    scope
      .querySelectorAll('.seatmap')
      .forEach(root =>
        renderOne(
          root,
          '.seat',
          'settlement'
        )
      );
  }

  function renderExport(
    scope = document
  ) {
    scope
      .querySelectorAll('.seat-rows')
      .forEach(root =>
        renderOne(
          root,
          '.seat-cell',
          'export'
        )
      );
  }

  function renderAll() {
    renderSettlement(document);
    renderExport(document);
  }

  function schedule() {
    if (scheduled) return;

    scheduled = true;

    requestAnimationFrame(() => {
      scheduled = false;
      renderAll();
    });
  }

  function start() {
    schedule();

    const observer =
      new MutationObserver(schedule);

    observer.observe(
      document.body,
      {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: [
          'class',
          'style'
        ]
      }
    );

    window.addEventListener(
      'resize',
      schedule,
      { passive: true }
    );
  }

  window.SeatLines = {
    renderAll,
    renderSettlement,
    renderExport
  };

  if (
    document.readyState === 'loading'
  ) {
    document.addEventListener(
      'DOMContentLoaded',
      start,
      { once: true }
    );
  } else {
    start();
  }
})();