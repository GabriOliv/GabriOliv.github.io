/* @ds-bundle: {"format":4,"namespace":"Dossier","components":[{"name":"DataHeader"},{"name":"SectionTitle"},{"name":"Readout"},{"name":"Tag"},{"name":"DataTable"},{"name":"FieldList"},{"name":"Meter"},{"name":"BarChart"},{"name":"Timeline"},{"name":"Schematic"},{"name":"Hierarchy"},{"name":"Dimension"},{"name":"Quote"},{"name":"Transcript"},{"name":"Redacted"},{"name":"Footnotes"},{"name":"Contents"},{"name":"Comparison"},{"name":"LineChart"},{"name":"ProportionDial"},{"name":"Connector"},{"name":"StatusFlag"},{"name":"ErrorNotice"},{"name":"CheckLog"},{"name":"Assertion"},{"name":"ToleranceBar"},{"name":"TextField"}]} */
(function () {
  var React = window.React;
  var h = React.createElement;

  function cls() {
    return Array.prototype.filter.call(arguments, Boolean).join(' ');
  }
  function up(s) {
    return typeof s === 'string' ? s.toUpperCase() : s;
  }

  /* DataHeader: inverse band with the page title and file code, then a meta row closed by a rule. */
  function DataHeader(props) {
    var p = props || {};
    if (p.variant === 'running') {
      return h('header', { className: cls('ds-running', p.className) },
        h('span', { className: 'ds-index', 'aria-hidden': 'true' }),
        h('span', { className: 'label ds-running-title' }, up(p.title)),
        p.code ? h('span', { className: 'label ds-running-code' }, up(p.code)) : null,
        h('span', { className: 'ds-spacer' }),
        p.kicker ? h('span', { className: 'label ds-running-kicker' }, up(p.kicker)) : null,
        p.meta ? h('span', { className: 'label ds-running-meta' }, up(p.meta)) : null
      );
    }
    return h('header', { className: cls('ds-header', p.className) },
      h('div', { className: 'ds-header-band' },
        h('h1', { className: 'display ds-header-title' }, up(p.title)),
        p.code ? h('span', { className: 'label ds-header-code' }, up(p.code)) : null
      ),
      (p.kicker || p.meta) ? h('div', { className: 'ds-header-meta' },
        h('span', { className: 'ds-index', 'aria-hidden': 'true' }),
        p.kicker ? h('span', { className: 'label ds-header-kicker' }, up(p.kicker)) : null,
        h('span', { className: 'ds-spacer' }),
        p.meta ? h('span', { className: 'label ds-header-metatext' }, up(p.meta)) : null
      ) : null
    );
  }

  /* Triangle pointer used by trends and connectors. */
  var TRI = { up: '5,1 9,9 1,9', down: '1,1 9,1 5,9', flat: '1,1 9,5 1,9' };
  function trendMark(dir) {
    return h('svg', { className: 'ds-trend-mark', viewBox: '0 0 10 10', width: 10, height: 10, role: 'img', 'aria-label': dir === 'flat' ? 'no change' : dir },
      h('polygon', { points: TRI[dir] }));
  }

  /* Readout: one labelled figure, optionally hero-sized, with an optional trend. */
  function Readout(props) {
    var p = props || {};
    var tone = p.tone === 'signal' ? 'signal' : 'ink';
    var hero = p.size === 'hero';
    var trend = TRI[p.trend] ? p.trend : null;
    return h('div', { className: cls('ds-readout', 'ds-readout-' + tone, hero && 'ds-readout-hero', p.className) },
      h('div', { className: 'label ds-readout-label' }, up(p.label)),
      h('div', { className: 'ds-readout-value' },
        h('span', { className: cls(hero ? 'figure-xl' : 'figure', 'ds-readout-figure') }, p.value),
        p.unit ? h('span', { className: 'label ds-readout-unit' }, p.unit) : null
      ),
      (trend || p.delta) ? h('div', { className: 'datum ds-readout-trend' },
        trend ? trendMark(trend) : null,
        p.delta ? h('span', null, p.delta) : null
      ) : null,
      p.note ? h('div', { className: 'caption ds-readout-note' }, p.note) : null
    );
  }

  /* Tag: a square label. */
  function Tag(props) {
    var p = props || {};
    var v = p.variant === 'solid' || p.variant === 'inverse' ? p.variant : 'outline';
    return h('span', { className: cls('label', 'ds-tag', 'ds-tag-' + v, p.className) }, up(p.children));
  }

  /* DataTable: ruled table; numeric columns in mono, right-aligned. */
  function DataTable(props) {
    var p = props || {};
    var cols = p.columns || [];
    var rows = p.rows || [];
    var hl = p.highlightRows || [];
    return h('table', { className: cls('ds-table', p.className) },
      p.caption ? h('caption', { className: 'heading ds-table-caption' }, up(p.caption)) : null,
      h('thead', null,
        h('tr', null, cols.map(function (c) {
          return h('th', { key: c.key, scope: 'col', className: cls('label', c.numeric && 'ds-num') }, up(c.label));
        }))
      ),
      h('tbody', null, rows.map(function (r, i) {
        return h('tr', { key: i, className: hl.indexOf(i) >= 0 ? 'ds-row-hl' : null },
          cols.map(function (c) {
            return h('td', { key: c.key, className: c.numeric ? 'datum ds-num' : 'body' }, r[c.key]);
          })
        );
      }))
    );
  }

  /* Schematic: concentric rings with nodes and 45-degree leader lines to callouts. */
  function Schematic(props) {
    var p = props || {};
    var size = p.size || 240;
    var rings = p.rings || 4;
    var nodes = p.nodes || [];
    var margin = p.labelWidth || 120;
    var W = size + margin * 2;
    var H = size + 32;
    var cx = W / 2;
    var cy = H / 2;
    var R = size / 2;
    var parts = [];

    parts.push(h('line', { key: 'hx', className: 'ds-sch-cross', x1: cx - R - 8, y1: cy, x2: cx + R + 8, y2: cy }));
    parts.push(h('line', { key: 'vx', className: 'ds-sch-cross', x1: cx, y1: cy - R - 8, x2: cx, y2: cy + R + 8 }));
    for (var i = 1; i <= rings; i++) {
      parts.push(h('circle', { key: 'r' + i, className: i === rings ? 'ds-sch-ring' : 'ds-sch-ring ds-sch-ring-inner', cx: cx, cy: cy, r: R * i / rings }));
    }
    if (p.ticks !== false) {
      for (var t = 0; t < 36; t++) {
        var a = t * Math.PI / 18;
        var len = t % 9 === 0 ? 8 : 4;
        parts.push(h('line', { key: 't' + t, className: 'ds-sch-tick',
          x1: cx + Math.cos(a) * R, y1: cy + Math.sin(a) * R,
          x2: cx + Math.cos(a) * (R + len), y2: cy + Math.sin(a) * (R + len) }));
      }
    }
    parts.push(h('circle', { key: 'c', className: 'ds-sch-core', cx: cx, cy: cy, r: 3 }));

    nodes.forEach(function (n, k) {
      var rr = R * Math.min(Math.max(n.ring || 1, 1), rings) / rings;
      var ang = (n.angle || 0) * Math.PI / 180;
      var x = cx + Math.cos(ang) * rr;
      var y = cy + Math.sin(ang) * rr;
      var right = x >= cx;
      var sx = right ? 1 : -1;
      var sy = y < cy ? -1 : 1;
      var qx = x + sx * 14;
      var qy = y + sy * 14;
      var ex = right ? cx + R + 16 : cx - R - 16;
      if ((right && qx > ex) || (!right && qx < ex)) ex = qx + sx * 12;
      parts.push(h('polyline', { key: 'l' + k, className: n.active ? 'ds-sch-leader ds-sch-on' : 'ds-sch-leader', points: x + ',' + y + ' ' + qx + ',' + qy + ' ' + ex + ',' + qy }));
      parts.push(h('circle', { key: 'n' + k, className: n.active ? 'ds-sch-node ds-sch-node-on' : 'ds-sch-node', cx: x, cy: y, r: n.active ? 6 : 5 }));
      parts.push(h('text', { key: 'x' + k, className: n.active ? 'label ds-sch-text ds-sch-on-text' : 'label ds-sch-text', x: ex + sx * 6, y: qy + 4, textAnchor: right ? 'start' : 'end' }, up(n.label)));
    });

    return h('svg', { className: cls('ds-schematic', p.className), viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, role: 'img', 'aria-label': p.title || 'Schematic' }, parts);
  }

  /* SectionTitle: signal bar and section number over an uppercase title, closed by a rule. */
  function SectionTitle(props) {
    var p = props || {};
    return h('div', { className: cls('ds-section', p.className) },
      h('div', { className: 'ds-section-top' },
        h('span', { className: 'ds-section-bar', 'aria-hidden': 'true' }),
        p.index != null ? h('span', { className: 'label ds-section-index' }, 'SECTION ' + up(String(p.index))) : null
      ),
      h('div', { className: 'ds-section-row' },
        h('h2', { className: 'title ds-section-title' }, up(p.title)),
        p.meta ? h('span', { className: 'label ds-section-meta' }, up(p.meta)) : null
      )
    );
  }

  /* FieldList: label/value record rows, one or two columns. */
  function FieldList(props) {
    var p = props || {};
    var def = p.variant === 'definition';
    return h('dl', { className: cls('ds-fields', def && 'ds-fields-def', !def && p.columns === 2 && 'ds-fields-2', p.className) },
      (p.fields || []).map(function (f, i) {
        return h('div', { key: i, className: 'ds-field' },
          def ? h('dt', { className: 'body ds-field-term' }, f.label) : h('dt', { className: 'label ds-field-label' }, up(f.label)),
          h('dd', { className: cls(f.mono ? 'datum' : 'body', 'ds-field-value', f.active && 'ds-field-on') }, f.value)
        );
      })
    );
  }

  /* Meter: a segmented scale of square cells. */
  function Meter(props) {
    var p = props || {};
    var max = p.max || 10;
    var val = Math.max(0, Math.min(max, Math.round(p.value || 0)));
    var cells = [];
    for (var i = 0; i < max; i++) cells.push(h('span', { key: i, className: i < val ? 'ds-cell ds-cell-on' : 'ds-cell' }));
    return h('div', { className: cls('ds-meter', p.tone === 'signal' && 'ds-meter-signal', p.className), role: 'meter', 'aria-valuemin': 0, 'aria-valuemax': max, 'aria-valuenow': val, 'aria-label': p.label },
      h('span', { className: 'label ds-meter-label' }, up(p.label)),
      h('span', { className: 'ds-meter-cells', 'aria-hidden': 'true' }, cells),
      h('span', { className: 'datum ds-meter-value' }, val + '/' + max)
    );
  }

  /* BarChart: horizontal bars on one axis, one bar in signal. */
  function BarChart(props) {
    var p = props || {};
    var data = p.data || [];
    var max = p.max || Math.max.apply(null, data.map(function (d) { return d.value; }).concat([1]));
    var fmt = p.format || function (v) { return String(v); };
    var rows = data.map(function (d, i) {
      var pct = Math.max(0, Math.min(100, d.value / max * 100));
      return h('div', { key: i, role: 'listitem', className: cls('ds-bar', d.active && 'ds-bar-on') },
        h('span', { className: 'label ds-bar-label' }, up(d.label)),
        h('span', { className: 'ds-bar-track' }, h('span', { className: 'ds-bar-fill', style: { width: pct + '%' } })),
        h('span', { className: 'datum ds-bar-value' }, fmt(d.value) + (p.unit ? ' ' + p.unit : ''))
      );
    });
    if (p.scale !== false) {
      rows.push(h('div', { key: 'scale', className: 'ds-bar ds-bar-scale', 'aria-hidden': 'true' },
        h('span', null),
        h('span', { className: 'label ds-bar-ticks' }, h('span', null, '0'), h('span', null, fmt(max / 2)), h('span', null, fmt(max))),
        h('span', null)
      ));
    }
    return h('div', { className: cls('ds-bars', p.className), role: 'list', 'aria-label': p.title || 'Bar chart' }, rows);
  }

  /* Timeline: evenly spaced events on one axis ending in a pointer. */
  function Timeline(props) {
    var p = props || {};
    return h('ol', { className: cls('ds-timeline', p.className) },
      (p.events || []).map(function (e, i) {
        return h('li', { key: i, className: cls('ds-tl-item', e.active && 'ds-tl-on') },
          h('span', { className: 'label ds-tl-at' }, up(e.at)),
          h('span', { className: 'ds-tl-axis', 'aria-hidden': 'true' }, h('span', { className: 'ds-tl-mark' })),
          h('span', { className: 'body ds-tl-label' }, e.label),
          e.note ? h('span', { className: 'caption ds-tl-note' }, e.note) : null
        );
      })
    );
  }

  /* Hierarchy: a top-down tree of square nodes with orthogonal connectors. */
  function treeNode(n, depth, key) {
    var kids = n.children || [];
    return h('li', { key: key },
      h('div', { className: cls('ds-tree-node', depth === 0 && 'ds-tree-root', n.active && 'ds-tree-on') },
        n.code ? h('span', { className: 'label ds-tree-code' }, up(n.code)) : null,
        h('span', { className: 'body ds-tree-label' }, n.label)
      ),
      kids.length ? h('ul', null, kids.map(function (c, i) { return treeNode(c, depth + 1, i); })) : null
    );
  }
  function Hierarchy(props) {
    var p = props || {};
    if (!p.root) return null;
    return h('div', { className: cls('ds-tree', p.className), 'aria-label': p.title || 'Hierarchy' }, h('ul', null, treeNode(p.root, 0, 'root')));
  }

  /* Dimension: a blueprint measure line with end ticks and a centred value. */
  function Dimension(props) {
    var p = props || {};
    var L = p.length || 240;
    var H = 28;
    var y = 20;
    var text = up(p.label != null ? String(p.label) : L + ' px');
    return h('svg', { className: cls('ds-dim', p.active && 'ds-dim-on', p.className), viewBox: '-6 0 ' + (L + 12) + ' ' + H, width: L + 12, height: H, role: 'img', 'aria-label': text },
      h('line', { className: 'ds-dim-line', x1: 0, y1: y + 0.5, x2: L, y2: y + 0.5 }),
      h('line', { className: 'ds-dim-line', x1: 0.5, y1: y - 8, x2: 0.5, y2: H }),
      h('line', { className: 'ds-dim-line', x1: L - 0.5, y1: y - 8, x2: L - 0.5, y2: H }),
      h('line', { className: 'ds-dim-tick', x1: -4, y1: y + 4, x2: 4, y2: y - 4 }),
      h('line', { className: 'ds-dim-tick', x1: L - 4, y1: y + 4, x2: L + 4, y2: y - 4 }),
      h('text', { className: 'label ds-dim-text', x: L / 2, y: 11, textAnchor: 'middle' }, text)
    );
  }

  /* Quote: an uppercase pull quote with a hanging signal mark and a ruled source line. */
  function Quote(props) {
    var p = props || {};
    var st = p.variant === 'statement';
    return h('figure', { className: cls('ds-quote', st && 'ds-statement', p.className) },
      st && p.kicker ? h('div', { className: 'label ds-statement-kicker' },
        h('span', { className: 'ds-quote-dash', 'aria-hidden': 'true' }), h('span', null, up(p.kicker))) : null,
      st ? h('p', { className: 'title ds-quote-text' }, up(p.children)) :
        h('blockquote', { className: 'title ds-quote-text' },
          h('span', { className: 'ds-quote-mark', 'aria-hidden': 'true' }, '“'), up(p.children)),
      st && p.note ? h('p', { className: 'body ds-statement-note' }, p.note) : null,
      (p.source || p.code) ? h('figcaption', { className: 'label ds-quote-source' },
        h('span', { className: 'ds-quote-dash', 'aria-hidden': 'true' }),
        h('span', null, up(p.source)),
        p.code ? h('span', { className: 'ds-quote-code' }, up(p.code)) : null
      ) : null
    );
  }

  /* Transcript: time-coded dialogue log. */
  function Transcript(props) {
    var p = props || {};
    return h('div', { className: cls('ds-transcript', p.className) },
      p.title ? h('div', { className: 'heading ds-tr-title' }, up(p.title)) : null,
      h('ol', { className: 'ds-tr-lines' }, (p.lines || []).map(function (l, i) {
        return h('li', { key: i, className: cls('ds-tr-line', l.active && 'ds-tr-on') },
          h('span', { className: 'label ds-tr-time' }, l.time || ''),
          h('span', { className: 'label ds-tr-speaker' }, up(l.speaker)),
          h('span', { className: 'body ds-tr-text' }, l.text)
        );
      }))
    );
  }

  /* Redacted: an inline black bar. Takes a length, never the hidden text. */
  function Redacted(props) {
    var p = props || {};
    var n = Math.max(2, Math.min(40, p.length || 8));
    return h('span', { className: cls('ds-redact', p.className), role: 'img', 'aria-label': 'Redacted', style: { width: n * 0.6 + 'em' } });
  }

  /* Footnotes: numbered notes under a short rule. */
  function Footnotes(props) {
    var p = props || {};
    return h('ol', { className: cls('ds-notes', p.className) }, (p.notes || []).map(function (n, i) {
      var id = n.id != null ? String(n.id) : (i < 9 ? '0' : '') + (i + 1);
      return h('li', { key: i, className: 'ds-note' },
        h('span', { className: 'label ds-note-id' }, id),
        h('span', { className: 'caption ds-note-text' }, n.text)
      );
    }));
  }

  function pad2(i) {
    return (i < 9 ? '0' : '') + (i + 1);
  }

  /* Contents: numbered table of contents. */
  function Contents(props) {
    var p = props || {};
    return h('ol', { className: cls('ds-contents', p.className) }, (p.items || []).map(function (it, i) {
      return h('li', { key: i, className: cls('ds-toc-item', it.active && 'ds-toc-on') },
        h('span', { className: 'figure ds-toc-index' }, it.index != null ? String(it.index) : pad2(i)),
        h('span', { className: 'title ds-toc-title' }, up(it.title)),
        h('span', { className: 'body ds-toc-desc' }, it.description || ''),
        h('span', { className: 'label ds-toc-page' }, it.page != null ? 'P. ' + it.page : '')
      );
    }));
  }

  /* Comparison: two or three parallel criteria columns. */
  function Comparison(props) {
    var p = props || {};
    var cols = (p.columns || []).slice(0, 3);
    return h('div', { className: cls('ds-compare', p.className), style: { gridTemplateColumns: 'repeat(' + Math.max(cols.length, 1) + ', minmax(0, 1fr))' } },
      cols.map(function (c, i) {
        return h('section', { key: i, className: cls('ds-cmp-col', c.active && 'ds-cmp-on') },
          h('span', { className: 'label ds-cmp-code' }, up(c.code || String.fromCharCode(65 + i))),
          h('h3', { className: 'title ds-cmp-title' }, up(c.title)),
          c.lead ? h('p', { className: 'body ds-cmp-lead' }, c.lead) : null,
          (c.items && c.items.length) ? h('ul', { className: 'ds-cmp-list' }, c.items.map(function (t, k) {
            return h('li', { key: k, className: 'body ds-cmp-item' }, t);
          })) : null
        );
      })
    );
  }

  var uid = 0;
  function useUid(prefix) {
    var ref = React.useRef(null);
    if (ref.current == null) ref.current = prefix + (++uid);
    return ref.current;
  }

  /* LineChart: one trend line over a hatched area, evenly spaced x labels, value callouts on chosen points. */
  function LineChart(props) {
    var p = props || {};
    var hid = useUid('ds-hatch-');
    var data = p.data || [];
    var n = data.length;
    var W = p.width || 720;
    var H = p.height || 240;
    var padT = 64, padB = 32, padX = 48;
    var baseY = H - padB;
    var ys = data.map(function (d) { return d.y; });
    var yMin = p.yMin != null ? p.yMin : 0;
    var yMax = p.yMax != null ? p.yMax : Math.max.apply(null, ys.concat([yMin + 1]));
    var fmt = p.format || function (v) { return String(v); };
    var unit = p.unit || '';
    function X(i) { return n > 1 ? padX + i * (W - padX * 2) / (n - 1) : W / 2; }
    function Y(v) { return baseY - (v - yMin) / ((yMax - yMin) || 1) * (baseY - padT); }
    var pts = data.map(function (d, i) { return [X(i), Y(d.y)]; });
    var line = pts.map(function (q) { return q[0] + ',' + q[1]; }).join(' ');
    var parts = [];
    parts.push(h('defs', { key: 'defs' },
      h('pattern', { id: hid, width: 6, height: 6, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' },
        h('line', { className: 'ds-lc-hatch', x1: 0, y1: 0, x2: 0, y2: 6 }))));
    if (p.area !== false && n > 1) {
      parts.push(h('polygon', { key: 'area', fill: 'url(#' + hid + ')', points: line + ' ' + X(n - 1) + ',' + baseY + ' ' + X(0) + ',' + baseY }));
    }
    parts.push(h('line', { key: 'base', className: 'ds-lc-base', x1: 0, y1: baseY + 0.5, x2: W, y2: baseY + 0.5 }));
    data.forEach(function (d, i) {
      var x = Math.round(X(i)) + 0.5;
      parts.push(h('line', { key: 'tk' + i, className: 'ds-lc-tick', x1: x, y1: baseY, x2: x, y2: baseY + 6 }));
      parts.push(h('text', { key: 'xl' + i, className: cls('label ds-lc-xlabel', d.active && 'ds-lc-on-text'), x: X(i), y: baseY + 22, textAnchor: 'middle' }, up(d.x)));
    });
    if (n > 1) parts.push(h('polyline', { key: 'line', className: 'ds-lc-line', points: line }));
    data.forEach(function (d, i) {
      var x = pts[i][0], y = pts[i][1];
      if (d.callout || d.active) {
        parts.push(h('line', { key: 'cl' + i, className: cls('ds-lc-leader', d.active && 'ds-lc-on'), x1: x, y1: y - (d.active ? 14 : 8), x2: x, y2: y - 30 }));
        parts.push(h('text', { key: 'ct' + i, className: d.active ? 'title ds-lc-callout ds-lc-callout-on' : 'heading ds-lc-callout', x: x, y: y - 36, textAnchor: 'middle' }, fmt(d.y) + unit));
      }
      if (d.active) parts.push(h('circle', { key: 'halo' + i, className: 'ds-lc-halo', cx: x, cy: y, r: 12 }));
      parts.push(h('circle', { key: 'p' + i, className: d.active ? 'ds-lc-node ds-lc-node-on' : 'ds-lc-node', cx: x, cy: y, r: d.active ? 5 : 4 }));
    });
    return h('svg', { className: cls('ds-linechart', p.className), viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, role: 'img', 'aria-label': p.title || 'Line chart' }, parts);
  }

  /* 45-degree leader from a point on a ring out to a callout beside the figure. */
  function leader(x, y, cx, cy, R, gap) {
    var right = x >= cx;
    var sx = right ? 1 : -1;
    var sy = y < cy ? -1 : 1;
    var qx = x + sx * 16;
    var qy = y + sy * 16;
    var ex = cx + sx * (R + gap);
    if ((right && qx > ex) || (!right && qx < ex)) ex = qx + sx * 12;
    return { points: x + ',' + y + ' ' + qx + ',' + qy + ' ' + ex + ',' + qy, tx: ex + sx * 6, ty: qy, anchor: right ? 'start' : 'end' };
  }

  /* ProportionDial: one share of a whole as a signal arc and a sector of dots. */
  function ProportionDial(props) {
    var p = props || {};
    var v = Math.max(0, Math.min(100, Number(p.value) || 0));
    var size = p.size || 240;
    var margin = p.labelWidth || 180;
    var W = size + margin * 2;
    var H = size + 96;
    var cx = W / 2, cy = H / 2, R = size / 2;
    var theta = v / 100 * Math.PI * 2;
    var parts = [];
    parts.push(h('circle', { key: 'outer', className: 'ds-pd-ring', cx: cx, cy: cy, r: R }));
    parts.push(h('circle', { key: 'inner', className: 'ds-pd-ring ds-pd-ring-inner', cx: cx, cy: cy, r: R * 0.8 }));
    var ex = cx + R * Math.sin(theta), ey = cy - R * Math.cos(theta);
    if (v >= 100) {
      parts.push(h('circle', { key: 'arc', className: 'ds-pd-arc', cx: cx, cy: cy, r: R }));
    } else if (v > 0) {
      parts.push(h('path', { key: 'arc', className: 'ds-pd-arc', d: 'M ' + cx + ' ' + (cy - R) + ' A ' + R + ' ' + R + ' 0 ' + (theta > Math.PI ? 1 : 0) + ' 1 ' + ex + ' ' + ey }));
    }
    parts.push(h('line', { key: 'zero', className: 'ds-pd-zero', x1: cx, y1: cy - R - 6, x2: cx, y2: cy - R + 6 }));
    var step = p.dotStep || 12;
    var k = Math.floor(R * 0.68 / step);
    var lim = R * 0.68;
    for (var gy = -k; gy <= k; gy++) {
      for (var gx = -k; gx <= k; gx++) {
        var dx = gx * step, dy = gy * step;
        if (dx * dx + dy * dy > lim * lim) continue;
        var a = Math.atan2(dx, -dy);
        if (a < 0) a += Math.PI * 2;
        var on = a < theta || (dx === 0 && dy === 0 && v > 0);
        parts.push(h('circle', { key: 'd' + gx + '_' + gy, className: on ? 'ds-pd-dot ds-pd-dot-on' : 'ds-pd-dot', cx: cx + dx, cy: cy + dy, r: on ? 3 : 2.5 }));
      }
    }
    var L = leader(ex, ey, cx, cy, R, 24);
    parts.push(h('polyline', { key: 'vl', className: 'ds-pd-leader ds-pd-on', points: L.points }));
    parts.push(h('circle', { key: 'vn', className: 'ds-pd-node', cx: ex, cy: ey, r: 4 }));
    parts.push(h('text', { key: 'vt', className: 'figure ds-pd-value', x: L.tx, y: L.ty + 16, textAnchor: L.anchor }, Math.round(v) + '%'));
    if (p.label) parts.push(h('text', { key: 'vlab', className: 'label ds-pd-label', x: L.tx, y: L.ty + 36, textAnchor: L.anchor }, up(p.label)));
    (p.segments || []).forEach(function (s, i) {
      var ang = (s.angle || 0) * Math.PI / 180;
      var x = cx + Math.cos(ang) * R, y = cy + Math.sin(ang) * R;
      var S = leader(x, y, cx, cy, R, 24);
      parts.push(h('polyline', { key: 'sl' + i, className: 'ds-pd-leader', points: S.points }));
      parts.push(h('circle', { key: 'sn' + i, className: 'ds-pd-seg', cx: x, cy: y, r: 3 }));
      parts.push(h('text', { key: 'st' + i, className: 'label ds-pd-text', x: S.tx, y: S.ty + 4, textAnchor: S.anchor }, up(s.label)));
    });
    return h('svg', { className: cls('ds-dial', p.className), viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, role: 'img', 'aria-label': (p.title || p.label || 'Share') + ': ' + Math.round(v) + '%' }, parts);
  }

  /* Connector: an orthogonal arrow from one corner of its box to the opposite corner. */
  function Connector(props) {
    var p = props || {};
    var w = p.width != null ? p.width : 160;
    var hh = p.height != null ? p.height : 64;
    var from = p.from || 'bottom-right';
    var vertFirst = p.first !== 'horizontal';
    var pad = 6;
    var sx = from.indexOf('right') >= 0 ? w : 0;
    var sy = from.indexOf('bottom') >= 0 ? hh : 0;
    var tx = w - sx, ty = hh - sy;
    var mx = vertFirst ? sx : tx;
    var my = vertFirst ? ty : sy;
    var dx = tx - mx, dy = ty - my;
    if (dx === 0 && dy === 0) { mx = sx; my = sy; dx = tx - sx; dy = ty - sy; }
    var len = Math.sqrt(dx * dx + dy * dy) || 1;
    var ux = dx / len, uy = dy / len;
    var bx = tx - ux * 9, by = ty - uy * 9;
    var head = [tx + ',' + ty, (bx - uy * 4.5) + ',' + (by + ux * 4.5), (bx + uy * 4.5) + ',' + (by - ux * 4.5)].join(' ');
    return h('svg', { className: cls('ds-connector', p.active && 'ds-conn-on', p.className), viewBox: (-pad) + ' ' + (-pad) + ' ' + (w + pad * 2) + ' ' + (hh + pad * 2), width: w + pad * 2, height: hh + pad * 2, 'aria-hidden': 'true' },
      h('g', { transform: 'translate(0.5 0.5)' },
        h('polyline', { className: 'ds-conn-line', points: [sx + ',' + sy, mx + ',' + my, bx + ',' + by].join(' ') }),
        h('polygon', { className: 'ds-conn-head', points: head })
      )
    );
  }

  window.Dossier = Object.assign(window.Dossier || {}, {
    DataHeader: DataHeader,
    SectionTitle: SectionTitle,
    Readout: Readout,
    Tag: Tag,
    DataTable: DataTable,
    FieldList: FieldList,
    Meter: Meter,
    BarChart: BarChart,
    Timeline: Timeline,
    Schematic: Schematic,
    Hierarchy: Hierarchy,
    Dimension: Dimension,
    Quote: Quote,
    Transcript: Transcript,
    Redacted: Redacted,
    Footnotes: Footnotes,
    Contents: Contents,
    Comparison: Comparison,
    LineChart: LineChart,
    ProportionDial: ProportionDial,
    Connector: Connector
  });
  /* ---- Status and error components: the only ones that use contrast-error ---- */

  function errorMark(size) {
    var n = size || 14;
    return h('svg', { className: 'ds-err-mark', viewBox: '0 0 14 14', width: n, height: n, 'aria-hidden': 'true' },
      h('rect', { className: 'ds-err-mark-box', x: 0, y: 0, width: 14, height: 14 }),
      h('path', { className: 'ds-err-mark-x', d: 'M4 4 L10 10 M10 4 L4 10' }));
  }
  function pointer() {
    return h('svg', { className: 'ds-pointer', viewBox: '0 0 10 10', width: 8, height: 8, 'aria-hidden': 'true' }, h('polygon', { points: '1,1 9,5 1,9' }));
  }
  var STATUS = { pass: 'Pass', fail: 'Fail', skip: 'Skipped', pending: 'Pending' };
  function roundTo(v) { return Math.round(v * 1000) / 1000; }

  /* StatusFlag: pass / fail / skipped / pending, with a mark and a word. */
  function StatusFlag(props) {
    var p = props || {};
    var st = STATUS[p.status] ? p.status : 'pending';
    return h('span', { className: cls('label', 'ds-flag', 'ds-flag-' + st, p.className) },
      st === 'fail'
        ? h('svg', { className: 'ds-flag-x', viewBox: '0 0 8 8', width: 8, height: 8, 'aria-hidden': 'true' }, h('path', { d: 'M1 1 L7 7 M7 1 L1 7' }))
        : h('span', { className: 'ds-flag-dot', 'aria-hidden': 'true' }),
      up(p.children || STATUS[st]));
  }

  /* ErrorNotice: a blocking error at the top of a page or module. */
  function ErrorNotice(props) {
    var p = props || {};
    return h('section', { className: cls('ds-errnote', p.className), role: p.live ? 'alert' : null, 'aria-label': 'Error' },
      h('div', { className: 'ds-errnote-head' },
        errorMark(16),
        h('span', { className: 'label ds-errnote-code' }, 'ERROR' + (p.code ? ' · ' + up(p.code) : '')),
        p.meta ? h('span', { className: 'label ds-errnote-meta' }, up(p.meta)) : null),
      h('h3', { className: 'heading ds-errnote-title' }, up(p.title)),
      p.children ? h('div', { className: 'body ds-errnote-body' }, p.children) : null,
      (p.items && p.items.length) ? h('ul', { className: 'ds-errnote-list' }, p.items.map(function (t, i) {
        return h('li', { key: i, className: 'body ds-errnote-item' }, t);
      })) : null,
      p.action ? h('div', { className: 'label ds-errnote-action' }, pointer(), h('span', null, up(p.action))) : null);
  }

  /* CheckLog: a list of checks with results and a pass/fail summary. */
  function CheckLog(props) {
    var p = props || {};
    var checks = p.checks || [];
    var n = { pass: 0, fail: 0, skip: 0, pending: 0 };
    checks.forEach(function (c) { if (n[c.result] != null) n[c.result]++; });
    var sum = [];
    ['pass', 'fail', 'skip', 'pending'].forEach(function (k) {
      if (!n[k]) return;
      if (sum.length) sum.push(h('span', { key: 'sep' + k, 'aria-hidden': 'true' }, ' · '));
      sum.push(h('span', { key: k, className: k === 'fail' ? 'ds-log-sum-fail' : null }, n[k] + ' ' + STATUS[k].toUpperCase()));
    });
    return h('div', { className: cls('ds-checklog', p.className) },
      h('div', { className: 'ds-log-head' },
        h('span', { className: 'heading ds-log-title' }, up(p.title || 'Checks')),
        h('span', { className: 'label ds-log-sum' }, sum)),
      h('ol', { className: 'ds-log-rows' }, checks.map(function (c, i) {
        return h('li', { key: i, className: cls('ds-log-row', c.result === 'fail' && 'ds-log-fail') },
          h('span', { className: 'label ds-log-id' }, up(c.id || '')),
          h('span', { className: 'body ds-log-label' }, c.label),
          h('span', { className: 'caption ds-log-detail' }, c.detail || ''),
          h('span', { className: 'datum ds-log-time' }, c.duration || ''),
          h('span', { className: 'ds-log-flag' }, h(StatusFlag, { status: c.result })));
      })));
  }

  /* Assertion: expected vs actual for one check. */
  function Assertion(props) {
    var p = props || {};
    var pass = p.pass != null ? !!p.pass : String(p.expected) === String(p.actual);
    return h('div', { className: cls('ds-assert', !pass && 'ds-assert-fail', p.className) },
      h('div', { className: 'ds-assert-head' },
        h('span', { className: 'label ds-assert-label' }, up(p.label || 'Assertion')),
        h(StatusFlag, { status: pass ? 'pass' : 'fail' })),
      h('dl', { className: 'ds-assert-rows' },
        h('div', { className: 'ds-assert-row' },
          h('dt', { className: 'label' }, 'EXPECTED'),
          h('dd', { className: 'datum' }, p.expected)),
        h('div', { className: 'ds-assert-row ds-assert-actual' },
          h('dt', { className: 'label' }, 'ACTUAL'),
          h('dd', { className: 'datum' }, pass ? null : errorMark(12), h('span', null, p.actual)))),
      p.location ? h('div', { className: 'caption ds-assert-loc' }, p.location) : null);
  }

  /* ToleranceBar: one measured value against its allowed range. */
  function ToleranceBar(props) {
    var p = props || {};
    var val = Number(p.value) || 0;
    var hasMin = p.min != null, hasMax = p.max != null;
    var lo = p.scaleMin != null ? p.scaleMin : 0;
    var hi = p.scaleMax != null ? p.scaleMax : (Math.max(hasMax ? p.max : 0, val) * 1.25 || 1);
    var fmt = p.format || function (v) { return String(v); };
    var unit = p.unit ? ' ' + p.unit : '';
    var above = hasMax && val > p.max;
    var below = hasMin && val < p.min;
    var ok = !above && !below;
    function pct(v) { return Math.max(0, Math.min(100, (v - lo) / ((hi - lo) || 1) * 100)); }
    var a = pct(hasMin ? p.min : lo), b = pct(hasMax ? p.max : hi), v = pct(val);
    var state = ok ? 'WITHIN LIMIT' : 'OUT OF RANGE ' + (above ? '+' + fmt(roundTo(val - p.max)) : '−' + fmt(roundTo(p.min - val))) + unit;
    var limit = hasMin && hasMax ? fmt(p.min) + '–' + fmt(p.max) : hasMax ? '≤ ' + fmt(p.max) : '≥ ' + fmt(p.min);
    var ticks = [h('span', { key: 'lo', className: 'ds-tol-tick ds-tol-tick-start', style: { left: '0%' } }, fmt(lo))];
    if (hasMin && a > 0) ticks.push(h('span', { key: 'min', className: 'ds-tol-tick ds-tol-lim', style: { left: a + '%' } }, fmt(p.min)));
    if (hasMax && b < 100) ticks.push(h('span', { key: 'max', className: 'ds-tol-tick ds-tol-lim', style: { left: b + '%' } }, fmt(p.max)));
    ticks.push(h('span', { key: 'hi', className: 'ds-tol-tick ds-tol-tick-end', style: { left: '100%' } }, fmt(hi) + unit));
    return h('div', { className: cls('ds-tol', !ok && 'ds-tol-out', p.className) },
      h('div', { className: 'ds-tol-head' },
        h('span', { className: 'label ds-tol-label' }, up(p.label)),
        h('span', { className: 'ds-tol-read' },
          h('span', { className: 'datum ds-tol-value' }, fmt(val) + unit),
          h('span', { className: 'label ds-tol-state' }, ok ? null : errorMark(10), state))),
      h('div', { className: 'ds-tol-track', role: 'img', 'aria-label': (p.label || 'Value') + ': ' + fmt(val) + unit + ', limit ' + limit + unit + ', ' + (ok ? 'within limit' : 'out of range') },
        h('span', { className: 'ds-tol-band', style: { left: a + '%', width: (b - a) + '%' } }),
        h('span', { className: 'ds-tol-marker', style: { left: v + '%' } })),
      h('div', { className: 'label ds-tol-scale', 'aria-hidden': 'true' }, ticks),
      h('div', { className: 'caption ds-tol-limit' }, 'Limit ' + limit + unit));
  }

  /* TextField: a square text input with label, hint and error state. */
  function TextField(props) {
    var p = props || {};
    var id = useUid('ds-tf-');
    var msgId = id + '-msg';
    var invalid = !!p.error;
    var ip = { id: id, className: 'body ds-tf-input', name: p.name, placeholder: p.placeholder, required: p.required, disabled: p.disabled,
      'aria-invalid': invalid ? 'true' : null, 'aria-describedby': (invalid || p.hint) ? msgId : null, onChange: p.onChange };
    if (p.value !== undefined) ip.value = p.value; else if (p.defaultValue !== undefined) ip.defaultValue = p.defaultValue;
    if (p.multiline) ip.rows = p.rows || 3; else ip.type = p.type || 'text';
    return h('div', { className: cls('ds-textfield', invalid && 'ds-tf-invalid', p.className) },
      h('label', { className: 'label ds-tf-label', htmlFor: id }, up(p.label), p.required ? h('span', { className: 'ds-tf-req' }, ' · REQUIRED') : null),
      h(p.multiline ? 'textarea' : 'input', ip),
      invalid ? h('div', { id: msgId, className: 'caption ds-tf-msg ds-tf-error' }, errorMark(12), h('span', null, p.error))
        : (p.hint ? h('div', { id: msgId, className: 'caption ds-tf-msg' }, p.hint) : null));
  }

  window.Dossier = Object.assign(window.Dossier || {}, {
    StatusFlag: StatusFlag,
    ErrorNotice: ErrorNotice,
    CheckLog: CheckLog,
    Assertion: Assertion,
    ToleranceBar: ToleranceBar,
    TextField: TextField
  });
})();
