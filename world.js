// Mtandao wa barabara wa Afrika Mashariki: miji, barabara, mipaka, vivuko (feri), na kijenzi cha njia kutoka mji A hadi B.
window.WORLD = (function () {
  const CC = {
    TZ: { n: 'Tanzania', cur: 'TZS', fx: 1, round: 100, fuel: 1900, rain: .25 },
    KE: { n: 'Kenya', cur: 'KES', fx: 20, round: 10, fuel: 190, rain: .3 },
    UG: { n: 'Uganda', cur: 'UGX', fx: .7, round: 500, fuel: 5200, rain: .55 },
    RW: { n: 'Rwanda', cur: 'RWF', fx: 1.8, round: 10, fuel: 1900, rain: .5 },
    BI: { n: 'Burundi', cur: 'BIF', fx: .9, round: 100, fuel: 4200, rain: .5 }
  };
  const BIO = { c: [0x8a9a48, 0x3f7a35], s: [0x9a8a45, 0x6b7f2f], h: [0x4f8a3a, 0x2f6b2a], d: [0xa89060, 0x7a8a3a], l: [0x5f8a3a, 0x3a7a2a] };
  const N = {}, LK = [], ADJ = {};
  const nd = (id, name, cc, lon, lat, bio, border) => { N[id] = { id, name, cc, lon, lat, bio, border: !!border } };
  nd('dar', 'Dar es Salaam', 'TZ', 39.27, -6.80, 'c'); nd('chalinze', 'Chalinze', 'TZ', 38.35, -6.65, 'c'); nd('morogoro', 'Morogoro', 'TZ', 37.66, -6.82, 's');
  nd('gairo', 'Gairo', 'TZ', 36.87, -6.14, 'd'); nd('kibaigwa', 'Kibaigwa', 'TZ', 36.45, -6.15, 'd'); nd('dodoma', 'Dodoma', 'TZ', 35.74, -6.17, 'd');
  nd('babati', 'Babati', 'TZ', 35.75, -4.21, 'h'); nd('arusha', 'Arusha', 'TZ', 36.68, -3.37, 'h'); nd('moshi', 'Moshi', 'TZ', 37.34, -3.35, 'h');
  nd('segera', 'Segera', 'TZ', 38.52, -5.35, 'c'); nd('tanga', 'Tanga', 'TZ', 39.10, -5.07, 'c'); nd('singida', 'Singida', 'TZ', 34.76, -4.82, 'd');
  nd('shinyanga', 'Shinyanga', 'TZ', 33.42, -3.66, 's'); nd('kahama', 'Kahama', 'TZ', 32.60, -3.84, 's'); nd('nyakanazi', 'Nyakanazi', 'TZ', 31.35, -3.00, 's');
  nd('mwanza', 'Mwanza', 'TZ', 32.90, -2.52, 'l'); nd('geita', 'Geita', 'TZ', 32.23, -2.87, 'l'); nd('musoma', 'Musoma', 'TZ', 33.80, -1.50, 'l');
  nd('iringa', 'Iringa', 'TZ', 35.69, -7.77, 'h'); nd('mbeya', 'Mbeya', 'TZ', 33.45, -8.90, 'h'); nd('kibiti', 'Kibiti', 'TZ', 38.95, -7.73, 'c');
  nd('lindi', 'Lindi', 'TZ', 39.71, -9.99, 'c'); nd('mtwara', 'Mtwara', 'TZ', 40.17, -10.27, 'c');
  nd('namanga', 'Namanga (Mpaka)', 'KE', 36.79, -2.55, 's', 1); nd('kajiado', 'Kajiado', 'KE', 36.78, -1.85, 's'); nd('nairobi', 'Nairobi', 'KE', 36.82, -1.29, 'h');
  nd('emali', 'Emali', 'KE', 37.48, -2.08, 's'); nd('mtito', 'Mtito Andei', 'KE', 38.17, -2.69, 'd'); nd('voi', 'Voi', 'KE', 38.56, -3.40, 'd');
  nd('mariakani', 'Mariakani', 'KE', 39.46, -3.86, 'c'); nd('mombasa', 'Mombasa', 'KE', 39.67, -4.05, 'c'); nd('taveta', 'Taveta (Mpaka)', 'KE', 37.68, -3.40, 's', 1);
  nd('horohoro', 'Horohoro (Mpaka)', 'KE', 39.08, -4.64, 'c', 1); nd('nakuru', 'Nakuru', 'KE', 36.07, -0.30, 'h'); nd('kisumu', 'Kisumu', 'KE', 34.76, -0.09, 'l');
  nd('kisii', 'Kisii', 'KE', 34.77, -0.68, 'h'); nd('isebania', 'Isebania (Mpaka)', 'KE', 34.47, -1.24, 'h', 1); nd('busia', 'Busia (Mpaka)', 'KE', 34.11, 0.46, 'l', 1);
  nd('tororo', 'Tororo', 'UG', 34.18, 0.69, 'l'); nd('mbale', 'Mbale', 'UG', 34.17, 1.08, 'h'); nd('iganga', 'Iganga', 'UG', 33.47, 0.61, 'l');
  nd('jinja', 'Jinja', 'UG', 33.20, 0.42, 'l'); nd('kampala', 'Kampala', 'UG', 32.58, 0.35, 'l'); nd('masaka', 'Masaka', 'UG', 31.73, -0.33, 'l');
  nd('mbarara', 'Mbarara', 'UG', 30.66, -0.61, 'h'); nd('kabale', 'Kabale', 'UG', 29.99, -1.25, 'h'); nd('katuna', 'Katuna (Mpaka)', 'UG', 29.95, -1.37, 'h', 1);
  nd('kigali', 'Kigali', 'RW', 30.06, -1.95, 'h'); nd('huye', 'Huye', 'RW', 29.74, -2.60, 'h'); nd('rusumo', 'Rusumo (Mpaka)', 'RW', 30.78, -2.38, 'h', 1);
  nd('kanyaru', 'Kanyaru (Mpaka)', 'BI', 29.64, -2.77, 'h', 1); nd('gitega', 'Gitega', 'BI', 29.93, -3.43, 'h'); nd('bujumbura', 'Bujumbura', 'BI', 29.36, -3.38, 'h');
  const lk = (a, b, km, hill, dirt, o) => { const l = { a, b, km, hill, dirt: dirt || 0, ferry: (o && o.ferry) || null }; LK.push(l); (ADJ[a] = ADJ[a] || []).push({ to: b, l }); (ADJ[b] = ADJ[b] || []).push({ to: a, l }) };
  [['dar', 'chalinze', 100, 1, 0], ['chalinze', 'morogoro', 95, 1.5, 0], ['morogoro', 'gairo', 110, 2.5, .15], ['gairo', 'kibaigwa', 80, 2, .3], ['kibaigwa', 'dodoma', 65, 1.5, 0],
  ['dodoma', 'babati', 260, 2, .2], ['babati', 'arusha', 170, 2.5, 0], ['arusha', 'moshi', 80, 1.5, 0], ['moshi', 'segera', 270, 1.5, 0], ['chalinze', 'segera', 130, 1, 0], ['segera', 'tanga', 100, 1, 0],
  ['dodoma', 'singida', 250, 1.5, .2], ['singida', 'shinyanga', 300, 1, .3], ['shinyanga', 'mwanza', 160, 1, 0], ['shinyanga', 'kahama', 100, 1, .2], ['kahama', 'nyakanazi', 190, 1, .5], ['nyakanazi', 'rusumo', 100, 2, .6],
  ['mwanza', 'geita', 130, 1, .1, { ferry: [.18, 'Busisi'] }], ['mwanza', 'musoma', 220, 1, .2], ['musoma', 'isebania', 85, 1.5, 0],
  ['dodoma', 'iringa', 270, 3, .1], ['iringa', 'mbeya', 330, 3, .1],
  ['dar', 'kibiti', 140, .5, 0, { ferry: [.06, 'Kigamboni'] }], ['kibiti', 'lindi', 340, 1, .5], ['lindi', 'mtwara', 110, .5, .6],
  ['arusha', 'namanga', 110, 1.5, 0], ['namanga', 'kajiado', 80, 1, .2], ['kajiado', 'nairobi', 80, 1, 0],
  ['nairobi', 'emali', 150, 1.5, 0], ['emali', 'mtito', 85, 1, 0], ['mtito', 'voi', 90, 1, 0], ['voi', 'mariakani', 125, 1, 0], ['mariakani', 'mombasa', 35, .5, 0],
  ['voi', 'taveta', 100, 1, .15], ['taveta', 'moshi', 100, 1, .3],
  ['mombasa', 'horohoro', 100, 1, 0, { ferry: [.05, 'Likoni'] }], ['horohoro', 'tanga', 80, 1, .3],
  ['nairobi', 'nakuru', 160, 2, 0], ['nakuru', 'kisumu', 190, 2.5, 0], ['kisumu', 'busia', 100, 1, 0], ['kisumu', 'kisii', 110, 2, 0], ['kisii', 'isebania', 85, 2, .1],
  ['busia', 'tororo', 30, .5, 0], ['tororo', 'mbale', 40, 1, 0], ['tororo', 'iganga', 85, 1, 0], ['iganga', 'jinja', 45, 1, 0], ['jinja', 'kampala', 80, 1.5, 0],
  ['kampala', 'masaka', 130, 1.5, 0], ['masaka', 'mbarara', 150, 1.5, 0], ['mbarara', 'kabale', 150, 2.5, .1], ['kabale', 'katuna', 80, 2.5, 0],
  ['katuna', 'kigali', 80, 3, 0], ['kigali', 'huye', 130, 3, 0], ['kigali', 'rusumo', 140, 2.5, .15], ['huye', 'kanyaru', 70, 3, 0], ['kanyaru', 'gitega', 90, 3, .2], ['gitega', 'bujumbura', 100, 3, 0]
  ].forEach(a => lk.apply(null, a));
  function path(f, t) {
    const dist = {}, prev = {}, done = {}; Object.keys(N).forEach(k => dist[k] = 1e9); dist[f] = 0;
    for (; ;) {
      let u = null; for (const k in dist) if (!done[k] && (u === null || dist[k] < dist[u])) u = k;
      if (u === null || dist[u] >= 1e9) return null; if (u === t) break; done[u] = 1;
      (ADJ[u] || []).forEach(e => { const d = dist[u] + e.l.km; if (d < dist[e.to]) { dist[e.to] = d; prev[e.to] = [u, e.l] } });
    }
    const nodes = [t], links = []; let c = t; while (c !== f) { const p = prev[c]; links.unshift(p[1]); c = p[0]; nodes.unshift(c) } return { nodes, links };
  }
  const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) } return h >>> 0 };
  const fee = (o, tzs) => Math.max(o.round, Math.round(tzs / o.fx / o.round) * o.round);
  function route(f, t) {
    if (f === t || !N[f] || !N[t]) return null; const P = path(f, t); if (!P) return null;
    const id = f + '-' + t, hs = hash(id), r = k => (hash(id + k) % 1000) / 1000, o = CC[N[f].cc];
    let km = 0, k0 = 0, rain = 0; const stops = [], hillPts = [], bioPts = [], dirt = [], ferries = [], ccs = [];
    P.nodes.forEach((nid, i) => {
      if (i > 0) km += P.links[i - 1].km; const nn = N[nid];
      stops.push(i > 0 && i < P.nodes.length - 1 && nn.border ? [nn.name, km, 'border'] : [nn.name, km]);
      bioPts.push([100 + km * 20, BIO[nn.bio][0], BIO[nn.bio][1]]); rain += CC[nn.cc].rain; if (ccs.indexOf(nn.cc) < 0) ccs.push(nn.cc);
    });
    P.links.forEach((l, i) => {
      const s0 = 100 + k0 * 20, s1 = 100 + (k0 + l.km) * 20; if (i == 0) hillPts.push([s0, l.hill]); hillPts.push([(s0 + s1) / 2, l.hill]); if (i == P.links.length - 1) hillPts.push([s1, l.hill]);
      if (l.dirt > 0) { const len = l.dirt * l.km, st = k0 + r('d' + i) * (l.km - len); dirt.push([100 + st * 20, 100 + (st + len) * 20]) }
      if (l.ferry) { const fwd = P.nodes[i] === l.a, at = fwd ? l.ferry[0] : 1 - l.ferry[0]; let fs = s0 + at * (s1 - s0); fs = Math.max(s0 + 260, Math.min(s1 - 310, fs)); ferries.push({ s0: fs, s1: fs + 150, name: l.ferry[1], fee: fee(o, 20000) }) }
      k0 += l.km;
    });
    const dirtKm = dirt.reduce((a, d) => a + (d[1] - d[0]) / 20, 0), strip = s => s.replace(' (Mpaka)', '');
    return {
      id, name: strip(N[f].name) + ' → ' + strip(N[t].name), km, cur: o.cur, fx: o.fx, rate: Math.round(78 / o.fx * 10) / 10, round: o.round, fuelPrice: o.fuel,
      fine: fee(o, 30000), borderFee: fee(o, 40000), washCost: fee(o, 15000), rain: Math.min(.7, rain / P.nodes.length + r('r') * .1), hour: 7 + hs % 9,
      curve: [50 + r('a') * 22, 430 + r('b') * 120, 22 + r('c') * 10, 170 + r('d') * 50, 9 + r('e') * 4, 75 + r('f') * 25], ph: [r('p1') * 6.28, r('p2') * 6.28, r('p3') * 6.28],
      hillPts, bioPts, dirt, dirtKm, ferries, stops, countries: ccs.map(c => CC[c].n), borders: stops.filter(s => s[2]).length
    };
  }
  return { CC, N, LK, path, route, nodes: () => N, links: () => LK, hash };
})();
