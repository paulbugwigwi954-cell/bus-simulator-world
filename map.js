// Ramani ya Afrika Mashariki: chagua unakotoka na unakoenda; njia inatafutwa kiotomatiki (mipaka, feri, barabara za vumbi).
window.MAP = (function () {
  const W = WORLD, P = (lo, la) => [((lo - 28.5) * 55).toFixed(1), ((5.0 - la) * 55).toFixed(1)];
  const pts = a => a.map(p => P(p[0], p[1]).join(',')).join(' ');
  const POLY = {
    KE: { c: '#3b4a2c', n: 'KENYA', p: [[34.0, 4.2], [35.9, 4.6], [38.1, 3.6], [39.8, 3.9], [41.0, 3.2], [41.0, -1.6], [40.2, -2.9], [39.2, -4.7], [37.8, -3.1], [37.7, -3.0], [34.0, -1.0], [34.1, 0.3], [34.4, 1.1]], t: [37.5, 1.5] },
    UG: { c: '#4a3d2a', n: 'UGANDA', p: [[29.6, -1.3], [30.5, -1.1], [31.0, -1.0], [31.9, -1.0], [34.0, -1.0], [34.1, 0.3], [34.4, 1.1], [34.0, 4.2], [31.8, 3.8], [30.9, 3.6], [30.4, 2.0]], t: [32.2, 2.3] },
    TZ: { c: '#3d4f35', n: 'TANZANIA', p: [[29.5, -4.5], [30.4, -2.4], [30.8, -1.0], [31.9, -1.0], [34.0, -1.0], [37.7, -3.0], [39.2, -4.7], [39.2, -5.2], [39.5, -6.5], [39.3, -8.0], [40.4, -10.4], [39.0, -11.5], [37.0, -11.6], [34.6, -11.5], [34.0, -9.6], [33.0, -9.4], [32.0, -8.3], [30.5, -8.2], [30.0, -7.3], [29.3, -6.0]], t: [34.8, -8.2] },
    RW: { c: '#4a3a45', n: 'RWANDA', p: [[28.9, -1.1], [29.6, -1.4], [30.5, -1.1], [30.9, -1.4], [30.8, -2.0], [30.5, -2.4], [29.9, -2.8], [29.3, -2.7], [28.9, -2.4]], t: null },
    BI: { c: '#40403a', n: 'BURUNDI', p: [[29.0, -2.8], [29.3, -2.7], [29.9, -2.8], [30.5, -2.4], [30.8, -3.2], [30.4, -4.0], [29.5, -4.5], [29.3, -3.6]], t: null }
  };
  const LAKE = [[31.7, -0.3], [33.0, 0.2], [34.0, 0.0], [34.2, -0.5], [34.0, -1.4], [33.0, -2.3], [32.5, -2.7], [32.0, -2.6], [31.7, -1.5]];
  let ov = null, from = null, to = null;
  function open() {
    if (ov) ov.remove(); ov = document.createElement('div'); ov.id = 'mp';
    ov.style.cssText = 'position:fixed;inset:0;z-index:9;background:#0b1118f5;color:#fff;font:13px system-ui,sans-serif;overflow:auto;padding:10px;box-sizing:border-box';
    const ids = Object.keys(W.N).sort((a, b) => W.N[a].name.localeCompare(W.N[b].name)), opt = k => ids.map(i => '<option value="' + i + '"' + (i == k ? ' selected' : '') + '>' + W.N[i].name + '</option>').join('');
    ov.innerHTML = '<div style="max-width:760px;margin:0 auto"><b style="color:#f5c518;font-size:16px">Ramani ya Afrika Mashariki</b><span style="color:#aaa"> · gusa mji wa kuanzia kisha wa kuishia</span>' +
      '<svg id="mpsvg" viewBox="0 150 700 740" style="width:100%;max-height:56vh;background:#123a5a;border-radius:10px;margin:8px 0"></svg>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">Kutoka: <select id="mpf" style="padding:8px;border-radius:8px">' + opt(from) + '</select> Hadi: <select id="mpt" style="padding:8px;border-radius:8px">' + opt(to) + '</select></div>' +
      '<div id="mpi" style="margin:8px 0;min-height:36px;color:#cfe"></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button id="mpg" style="padding:10px 16px;border:0;border-radius:8px;background:#f5c518;font-weight:700">Anza safari hii</button><button id="mpc" style="padding:10px 16px;border:0;border-radius:8px">Funga</button></div>' +
      '<div style="margin-top:10px;color:#aaa">Njia za haraka: <a href="#" data-q="dar,dodoma" style="color:#8ef0a0">Dar–Dodoma</a> · <a href="#" data-q="nairobi,mombasa" style="color:#8ef0a0">Nairobi–Mombasa</a> · <a href="#" data-q="kampala,mbale" style="color:#8ef0a0">Kampala–Mbale</a> · <a href="#" data-q="arusha,nairobi" style="color:#8ef0a0">Arusha–Nairobi</a> · <a href="#" data-q="dar,mtwara" style="color:#8ef0a0">Dar–Mtwara (feri, vumbi)</a> · <a href="#" data-q="mombasa,dar" style="color:#8ef0a0">Mombasa–Dar (feri, mpaka)</a></div></div>';
    document.body.appendChild(ov); draw();
    ov.querySelector('#mpf').onchange = e => { from = e.target.value; draw() }; ov.querySelector('#mpt').onchange = e => { to = e.target.value; draw() };
    ov.querySelector('#mpc').onclick = () => { ov.remove(); ov = null };
    ov.querySelector('#mpg').onclick = go;
    ov.addEventListener('click', e => { const q = e.target.dataset && e.target.dataset.q; if (q) { e.preventDefault(); const a = q.split(','); from = a[0]; to = a[1]; sync(); draw() } });
  }
  function sync() { ov.querySelector('#mpf').value = from || ids0(); ov.querySelector('#mpt').value = to || ids0() }
  const ids0 = () => Object.keys(W.N)[0];
  function go() { if (!from || !to || from === to) return; const b = (window.GAME && GAME.BS && GAME.BS.id) || 'scania'; location.search = '?from=' + from + '&to=' + to + '&b=' + b }
  function draw() {
    const svg = ov.querySelector('#mpsvg'), r = (from && to && from !== to) ? W.route(from, to) : null, on = {}; let pl = '';
    if (r) { const p = W.path(from, to); p.links.forEach(l => on[l.a + '|' + l.b] = 1); pl = '<polyline points="' + pts(p.nodes.map(i => [W.N[i].lon, W.N[i].lat])) + '" fill="none" stroke="#f5c518" stroke-width="4" stroke-linejoin="round" opacity=".95"/>' }
    let h = Object.keys(POLY).map(k => '<polygon points="' + pts(POLY[k].p) + '" fill="' + POLY[k].c + '" stroke="#6a7a5a" stroke-width="1"/>').join('') + '<polygon points="' + pts(LAKE) + '" fill="#2a6f9a" stroke="#4a8fba"/>';
    h += Object.keys(POLY).filter(k => POLY[k].t).map(k => { const q = P(POLY[k].t[0], POLY[k].t[1]); return '<text x="' + q[0] + '" y="' + q[1] + '" fill="#9fb38f" font-size="13" text-anchor="middle" opacity=".7">' + POLY[k].n + '</text>' }).join('');
    h += W.LK.map(l => { const a = P(W.N[l.a].lon, W.N[l.a].lat), b = P(W.N[l.b].lon, W.N[l.b].lat); return '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" stroke="' + (l.dirt > .3 ? '#b08a55' : '#d8d0b0') + '" stroke-width="1.6"' + (l.dirt > .3 ? ' stroke-dasharray="4 2"' : '') + '/>' + (l.ferry ? '<text x="' + ((+a[0] + +b[0]) / 2) + '" y="' + ((+a[1] + +b[1]) / 2 - 3) + '" font-size="9" fill="#7fd0ff">⛴</text>' : '') }).join('') + pl;
    h += Object.keys(W.N).map(k => { const n = W.N[k], q = P(n.lon, n.lat), col = k == from ? '#43d17a' : k == to ? '#ff5252' : n.border ? '#ffb74d' : '#fff'; return '<g data-n="' + k + '" style="cursor:pointer"><circle cx="' + q[0] + '" cy="' + q[1] + '" r="9" fill="transparent"/><circle cx="' + q[0] + '" cy="' + q[1] + '" r="' + (k == from || k == to ? 6 : 3.5) + '" fill="' + col + '" stroke="#000" stroke-width=".8"/><text x="' + (+q[0] + 6) + '" y="' + (+q[1] + 3) + '" font-size="8.5" fill="#fff" stroke="#000" stroke-width=".25">' + n.name.replace(' (Mpaka)', '') + '</text></g>' }).join('');
    svg.innerHTML = h;
    svg.querySelectorAll('g[data-n]').forEach(g => g.addEventListener('click', () => { const k = g.dataset.n; if (!from || (from && to)) { from = k; to = null } else if (k !== from) to = k; sync(); draw() }));
    ov.querySelector('#mpi').innerHTML = r ? '<b>' + r.name + '</b>: ' + r.km + ' km (~' + Math.round(r.km * 20 / 26 / 60) + ' dakika) · nchi: ' + r.countries.join(', ') + ' · mipaka ' + r.borders + ' · feri ' + r.ferries.length + (r.ferries.length ? ' (' + r.ferries.map(f => f.name).join(', ') + ')' : '') + ' · barabara za vumbi ~' + Math.round(r.dirtKm) + ' km · sarafu ' + r.cur : 'Chagua miji miwili.';
  }
  return { open, get from() { return from }, get to() { return to } };
})();
