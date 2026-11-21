// Ardhi ya milima na mabonde inayotengenezwa vipande vipande (chunks) kuzunguka basi: barabara ya lami au vumbi, miti, mashimo, watu njiani, maji ya feri.
window.TERR = (function () {
  const T = THREE, CH = 300, STEP = 6;
  const COLS = [-600, -420, -300, -220, -160, -120, -90, -68, -50, -38, -28, -20, -14, -9, -6, -3, 0, 3, 6, 9, 14, 20, 28, 38, 50, 68, 90, 120, 160, 220, 300, 420, 600];
  let X, RT, cx, stopS = [], maxIdx = 0; const chunks = new Map(), hz = [], people = [], trees = [], matCache = {};
  const sm = t => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t) };
  const hashi = n => { n = Math.imul(n ^ (n >>> 15), 2246822507); n = Math.imul(n ^ (n >>> 13), 3266489909); return (n ^ (n >>> 16)) >>> 0 };
  const rng = seed => { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 } };
  function amp(s) { const a = RT.hillPts; if (s <= a[0][0]) return a[0][1]; for (let i = 1; i < a.length; i++) if (s <= a[i][0]) { const t = (s - a[i - 1][0]) / (a[i][0] - a[i - 1][0]); return a[i - 1][1] * (1 - t) + a[i][1] * t } return a[a.length - 1][1] }
  function fw(s) { let m = 1; for (const f of RT.ferries) { const d = s < f.s0 ? f.s0 - s : s > f.s1 ? s - f.s1 : 0; m = Math.min(m, sm(d / 160)) } return m }
  function town(s) { let m = 1; for (const p of stopS) m = Math.min(m, sm(Math.abs(s - p) / 90)); return m }
  function chan(s) { for (const f of RT.ferries) if (s > f.s0 && s < f.s1) return sm(Math.min(s - f.s0, f.s1 - s) / 18); return 0 }
  const dirt = s => { for (const d of RT.dirt) if (s >= d[0] && s <= d[1]) return true; return false };
  const inGap = (s, pad) => { for (const f of RT.ferries) if (s > f.s0 - pad && s < f.s1 + pad) return true; return false };
  function row(s) { const m = amp(s) * .55 * fw(s) * (.25 + .75 * town(s)), P = 14 * Math.sin(s / 520 + RT.ph[0]) + 6 * Math.sin(s / 210 + RT.ph[1]) + 2 * Math.sin(s / 90 + RT.ph[2]); return { E: m * P, mt: m, c: chan(s), s } }
  function hRow(r, x) {
    const s = r.s, ad = Math.abs(x - cx(s)), k = sm((ad - 12) / 70); let h = r.E;
    if (k > 0) { const n1 = Math.sin(x * .013 + s * .008 + RT.ph[0]) * Math.cos(s * .012 - x * .007 + RT.ph[1]), n2 = Math.sin(x * .05 + RT.ph[2]) * Math.sin(s * .043 + x * .02); h += k * (r.mt * 36 * (n1 * .7 + .2) + 2.4 * n2 * (.3 + r.mt)) }
    if (r.c > 0) h = h * (1 - r.c) - 7 * r.c; return h;
  }
  const H = (x, z) => hRow(row(-z), x), E = s => row(s).E;
  function bio(s) { const a = RT.bioPts; let i = 1; if (s <= a[0][0]) i = 0; else { while (i < a.length - 1 && s > a[i][0]) i++ } const p = a[i - 1] || a[0], q = a[i], t = q[0] > p[0] ? Math.max(0, Math.min(1, (s - p[0]) / (q[0] - p[0]))) : 0; const c = h => [(h >> 16) / 255, ((h >> 8) & 255) / 255, (h & 255) / 255], g1 = c(p[1]), g2 = c(q[1]), l1 = c(p[2]), l2 = c(q[2]); return { g: g1.map((v, k) => v + (g2[k] - v) * t), l: l1.map((v, k) => v + (l2[k] - v) * t) } }
  const mat = (hex) => matCache[hex] || (matCache[hex] = new T.MeshLambertMaterial({ color: hex }));
  let tg, cg, tm, hm, pm, roadMat, dirtMat, terrMat, pMat;
  function mkTex(fn, w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.anisotropy = 4; return t }
  function init(ctx) {
    X = ctx; RT = X.RT; cx = X.cx; stopS = X.STOPS.map(p => p.s); maxIdx = Math.floor(X.L / CH) + 1;
    tg = new T.CylinderGeometry(.3, .5, 5); cg = new T.SphereGeometry(1, 8, 6); tm = mat(0x5a4030); hm = new T.CircleGeometry(.85, 12); pm = new T.MeshBasicMaterial({ color: 0x151515 });
    roadMat = new T.MeshLambertMaterial({ map: mkTex((x, w, h) => { x.fillStyle = '#3b3b40'; x.fillRect(0, 0, w, h); x.fillStyle = '#fff'; x.fillRect(2, 0, 3, h); x.fillRect(w - 5, 0, 3, h); x.fillStyle = '#f5c518'; x.fillRect(w / 2 - 2, 0, 4, h / 2) }, 64, 128), side: 2, polygonOffset: true, polygonOffsetFactor: -2 });
    dirtMat = new T.MeshLambertMaterial({ map: mkTex((x, w, h) => { x.fillStyle = '#a07c4e'; x.fillRect(0, 0, w, h); x.fillStyle = '#7d5f3a'; x.fillRect(18, 0, 8, h); x.fillRect(38, 0, 8, h); for (let i = 0; i < 40; i++) { x.fillStyle = 'rgba(70,50,30,.25)'; x.fillRect(Math.random() * w, Math.random() * h, 3, 2) } }, 64, 64), side: 2, polygonOffset: true, polygonOffsetFactor: -2 });
    terrMat = new T.MeshLambertMaterial({ vertexColors: true, side: 2 });
    const wm = new T.MeshLambertMaterial({ color: 0x2a6f9a, transparent: true, opacity: .88 });
    RT.ferries.forEach(f => { const mid = (f.s0 + f.s1) / 2, w = new T.Mesh(new T.PlaneGeometry(1300, f.s1 - f.s0 + 80), wm); w.rotation.x = -Math.PI / 2; w.position.set(cx(mid), -2.2, -mid); X.scene.add(w) });
  }
  function build(idx) {
    const s0 = idx * CH, rows = CH / STEP + 1, nc = COLS.length, pos = new Float32Array(rows * nc * 3), col = new Float32Array(rows * nc * 3), ind = [], grp = new T.Group(), geoms = [];
    for (let i = 0; i < rows; i++) {
      const s = s0 + i * STEP, r = row(s), b = bio(s), dS = dirt(s), cxs = cx(s);
      for (let j = 0; j < nc; j++) {
        const d = COLS[j], x = cxs + d, h = hRow(r, x), k = (i * nc + j) * 3; pos[k] = x; pos[k + 1] = h; pos[k + 2] = -s;
        let cr = b.g[0], cg_ = b.g[1], cb = b.g[2]; if (Math.abs(d) < 12) { if (dS) { cr = .69; cg_ = .55; cb = .34 } else { cr = .55; cg_ = .52; cb = .42 } }
        const rk = sm((h - r.E - 14) / 25); if (rk > 0) { cr += (.48 - cr) * rk; cg_ += (.45 - cg_) * rk; cb += (.40 - cb) * rk }
        const sh = .92 + .16 * ((hashi(i * 31 + j * 7 + idx * 13) % 100) / 100); col[k] = cr * sh; col[k + 1] = cg_ * sh; col[k + 2] = cb * sh;
      }
    }
    for (let i = 0; i < rows - 1; i++)for (let j = 0; j < nc - 1; j++) { const a = i * nc + j, b = a + 1, c = a + nc, d = c + 1; ind.push(a, b, c, b, d, c) }
    const tgm = new T.BufferGeometry(); tgm.setAttribute('position', new T.BufferAttribute(pos, 3)); tgm.setAttribute('color', new T.BufferAttribute(col, 3)); tgm.setIndex(ind); tgm.computeVertexNormals(); grp.add(new T.Mesh(tgm, terrMat)); geoms.push(tgm);
    const rib = (list, w, vs, material) => {
      if (!list.length) return; const p = [], u = [], ix = []; list.forEach((q, n) => { const s = q[0], e = q[1], x = cx(s); p.push(x - w, e + .05, -s, x + w, e + .05, -s); u.push(0, s / vs, 1, s / vs) });
      for (let n = 0; n < list.length - 1; n++) { if (list[n][2]) ix.push(2 * n, 2 * n + 1, 2 * n + 2, 2 * n + 1, 2 * n + 3, 2 * n + 2) }
      const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(p, 3)); g.setAttribute('uv', new T.Float32BufferAttribute(u, 2)); g.setIndex(ix); g.computeVertexNormals(); grp.add(new T.Mesh(g, material)); geoms.push(g);
    };
    const pv = [], dr = []; let dirtRows = 0;
    for (let i = 0; i < rows; i++) { const s = s0 + i * STEP, mid = s + STEP / 2, e = row(s).E, ok = !inGap(mid, 0), dd = dirt(mid); if (dd) dirtRows++; pv.push([s, e, ok && !dd]); dr.push([s, e, ok && dd]) }
    rib(pv, 6, 12, roadMat); rib(dr, 3.8, 10, dirtMat);
    const R = rng(idx * 7919 + RT.ph[0] * 1000 | 0), bc = bio(s0 + CH / 2), leaf = ((bc.l[0] * 255 | 0) << 16) | ((bc.l[1] * 255 | 0) << 8) | (bc.l[2] * 255 | 0), lm = mat(leaf);
    for (let n = 0; n < 14; n++) {
      const s = s0 + R() * CH, sd = R() < .5 ? -1 : 1, d = 14 + R() * 110, x = cx(s) + sd * d, z = -s, y = H(x, z), kk = 2 + R() * 3; if (y < -.8 || inGap(s, 30)) continue;
      const g = new T.Group(), t = new T.Mesh(tg, tm), c = new T.Mesh(cg, lm); t.position.y = 2.5; c.scale.set(kk * 1.6, kk * .5, kk * 1.6); c.position.y = 5 + kk * .2; g.add(t, c); g.position.set(x, y, z); grp.add(g); trees.push({ x, z, idx });
    }
    const nh = Math.floor(R() * (dirtRows > 5 ? 5 : 2.2));
    for (let n = 0; n < nh; n++) {
      const s = s0 + R() * CH; if (stopS.some(p => Math.abs(p - s) < 90) || inGap(s, 40)) continue; const dd = dirt(s), d = dd ? (R() < .5 ? -1.6 : 1.6) : (R() < .5 ? -3 : 3), m = new T.Mesh(hm, pm);
      m.rotation.x = -Math.PI / 2; m.position.set(cx(s) + d, row(s).E + .08, -s); grp.add(m); hz.push({ s, d, type: 'hole', hit: false, warn: false, idx });
    }
    if (R() < .4) {
      const s = s0 + R() * CH; if (!stopS.some(p => Math.abs(p - s) < 60) && !inGap(s, 60) && s > 200) {
        const g = new T.Group(), n = 1 + Math.floor(R() * 4), pc = [0xd33, 0x39c, 0xe9b, 0x3a5, 0xfc3];
        for (let k = 0; k < n; k++) { const b = new T.Mesh(new T.CylinderGeometry(.3, .3, 1.3), mat(pc[k % 5])), h = new T.Mesh(new T.SphereGeometry(.25), mat(0x5a3a28)); b.position.set(k * .8, .65, 0); h.position.set(k * .8, 1.5, 0); g.add(b, h) }
        g.position.set(cx(s) - 8, H(cx(s) - 8, -s), -s); grp.add(g); people.push({ s, n, g, taken: false, idx, parent: grp });
      }
    }
    X.scene.add(grp); chunks.set(idx, { grp, geoms });
  }
  function remove(idx) {
    const c = chunks.get(idx); if (!c) return; X.scene.remove(c.grp); c.geoms.forEach(g => g.dispose && g.dispose()); chunks.delete(idx);
    for (let i = hz.length - 1; i >= 0; i--) if (hz[i].idx === idx) hz.splice(i, 1);
    for (let i = people.length - 1; i >= 0; i--) if (people[i].idx === idx) people.splice(i, 1);
    for (let i = trees.length - 1; i >= 0; i--) if (trees[i].idx === idx) trees.splice(i, 1);
  }
  function update(s) { const c = Math.floor(s / CH); for (let i = Math.max(0, c - 1); i <= Math.min(maxIdx, c + 3); i++) if (!chunks.has(i)) { build(i); break } chunks.forEach((v, k) => { if (k < c - 2 || k > c + 4) remove(k) }) }
  function prime(s) { const c = Math.floor(s / CH); for (let i = Math.max(0, c - 1); i <= Math.min(maxIdx, c + 3); i++) if (!chunks.has(i)) build(i) }
  function treeHit(x, z, r) { for (const t of trees) { const dx = t.x - x, dz = t.z - z; if (dx * dx + dz * dz < (r + .6) * (r + .6)) return t } return null }
  return { init, update, prime, H, E, dirt, inGap, treeHit, get hz() { return hz }, get people() { return people }, get trees() { return trees }, get chunkCount() { return chunks.size } };
})();
