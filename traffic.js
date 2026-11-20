// Trafiki yenye akili: magari yanafuata njia, yanaweka umbali (IDM), yanasimama kwenye taa nyekundu,
// yanapita magari polepole kukiwa wazi, pamoja na taa za barabarani, vivuko vya watembea kwa miguu, pikipiki na bajaj.
window.TRF = (function () {
  const T = THREE, M = (c, o) => new T.MeshLambertMaterial(Object.assign({ color: c }, o || {})), B = (w, h, d, m) => new T.Mesh(new T.BoxGeometry(w, h, d), m), BM = c => new T.MeshBasicMaterial({ color: c });
  const CYC = 26, GRN = 13, RED = 16, WALK = 6.5, pick = a => a[Math.random() * a.length | 0], clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const WID = { sedan: 1.8, suv: 1.95, pickup: 1.9, matatu: 1.95, lorry: 2.3, semi: 2.55 };
  let X, veh = [], lights = [], cd = 0;
  function small(kind) {
    const g = new T.Group(), add = (m, x, y, z) => { m.position.set(x, y, z); g.add(m); return m };
    const wh = (x, z, r) => { const w = new T.Mesh(new T.CylinderGeometry(r, r, .14, 12), M(0x111111)); w.rotation.z = Math.PI / 2; add(w, x, r, z) };
    if (kind == 'boda') {
      wh(0, -.75, .32); wh(0, .75, .32); add(B(.22, .35, 1.5, M(pick([0xc62828, 0x1565c0, 0x222222]))), 0, .55, 0); add(B(.3, .22, .5, M(0x333333)), 0, .85, -.2); add(B(.28, .1, .7, M(0x111111)), 0, .85, .45);
      add(new T.Mesh(new T.CylinderGeometry(.18, .2, .7, 8), M(pick([0xf5c518, 0x2e7d32, 0xe0e0e0]))), 0, 1.25, .2); add(new T.Mesh(new T.SphereGeometry(.17, 8, 6), M(0x5a3a28)), 0, 1.75, .2);
      return { g, len: 2.0, w: .8 };
    }
    wh(0, -1.0, .27); wh(-.6, .8, .27); wh(.6, .8, .27); add(B(1.25, .8, 1.9, M(pick([0xf5c518, 0x2e7d32, 0x1565c0]))), 0, .85, .1); add(B(1.3, .08, 2.0, M(0x222222)), 0, 1.85, .1);
    add(B(1.2, .6, .06, M(0x101c26, { side: 2 })), 0, 1.45, -.9); add(B(.5, .5, .6, M(0x333333)), 0, .6, -1.0);
    return { g, len: 2.6, w: 1.4 };
  }
  function spawn(kind, lane, opp, vt) {
    const small_ = kind == 'boda' || kind == 'bajaj', V = small_ ? small(kind) : X.makeVeh(kind), dir = opp ? -1 : 1;
    let s = 0; for (let n = 0; n < 60; n++) { s = 260 + Math.random() * (X.L - 420); if (!veh.some(o => Math.abs(o.d - lane) < 2 && Math.abs(o.s - s) < 45)) break }
    const me = { g: V.g, len: V.len, w: V.w || WID[kind] || 2, kind, small: small_, dir, s, d: lane, td: lane, v: dir * vt * .9, vt, ov: 0, ref: null, cdw: 0 };
    X.scene.add(V.g); veh.push(me);
  }
  function init(ctx) {
    X = ctx; veh = []; lights = [];
    const wm = BM(0xf0f0f0), pole = M(0x333333), pcol = [0xd33, 0x39c, 0xe9b, 0x3a5, 0xfc3];
    X.STOPS.forEach((p, i) => {
      const sl = p.s + 110; if (i == X.STOPS.length - 1 || sl > X.L - 140) return;
      const li = { s: sl, off: Math.random() * CYC, mr: BM(0x401010), my: BM(0x403000), mg: BM(0x083010), peds: [], pf: -1e9, cyc: -1 }, xc = X.cx(sl);
      for (let k = 0; k < 10; k++) { const z = B(.5, .03, 3.2, wm); z.position.set(xc - 5 + k * 1.1, .05, -sl); X.scene.add(z) }
      [-1, 1].forEach(sd => {
        const pl = B(.25, 5, .25, pole); pl.position.set(xc + sd * 7.5, 2.5, -sl); X.scene.add(pl);
        const hd = B(.6, 1.7, .5, M(0x111111)); hd.position.set(xc + sd * 7.5, 5.2, -sl); X.scene.add(hd);
        [[li.mr, 5.7], [li.my, 5.2], [li.mg, 4.7]].forEach(a => { const l = new T.Mesh(new T.SphereGeometry(.22, 8, 6), a[0]); l.position.set(xc + sd * 7.5, a[1], -sl + .3); X.scene.add(l) });
      });
      for (let k = 0; k < 3; k++) { const g = new T.Group(), b = new T.Mesh(new T.CylinderGeometry(.25, .28, 1.2, 8), M(pick(pcol))), h = new T.Mesh(new T.SphereGeometry(.22, 8, 6), M(0x5a3a28)); b.position.y = .6; h.position.y = 1.45; g.add(b, h); X.scene.add(g); li.peds.push({ g, k, hit: false, x: 9 }) }
      lights.push(li);
    });
    const cars = ['sedan', 'suv', 'pickup', 'matatu'], all = cars.concat(['lorry', 'semi']);
    for (let i = 0; i < 10; i++) spawn(pick(all), 3, true, 14 + Math.random() * 5);
    for (let i = 0; i < 5; i++) spawn(pick(['lorry', 'semi']), -3, false, 7 + Math.random() * 2);
    for (let i = 0; i < 8; i++) spawn(pick(cars), -3, false, 13 + Math.random() * 4);
    for (let i = 0; i < 4; i++) spawn(pick(['boda', 'bajaj']), -5.4, false, 9 + Math.random() * 3);
    veh.forEach(me => { me.g.position.set(X.cx(me.s) + me.d, 0, -me.s); me.g.rotation.y = -Math.atan(X.dxs(me.s)) + (me.dir < 0 ? Math.PI : 0) });
  }
  function update(dt, P) {
    cd -= dt; const ev = {}, pl = { s: P.s, d: P.d, v: P.v, len: P.len, w: 2.55 };
    lights.forEach(li => {
      const ph = (P.t + li.off) % CYC, n = Math.floor((P.t + li.off) / CYC), side = n % 2 ? 1 : -1, xc = X.cx(li.s);
      li.mr.color.setHex(ph >= RED ? 0xff2020 : 0x401010); li.my.color.setHex(ph >= GRN && ph < RED ? 0xffc400 : 0x403000); li.mg.color.setHex(ph < GRN ? 0x22dd44 : 0x083010);
      if (n !== li.cyc) { li.cyc = n; li.peds.forEach(p => p.hit = false) }
      li.peds.forEach(p => { const f = clamp((ph - RED - p.k * .8) / WALK, 0, 1); p.x = -side * 9 + side * 18 * f; p.g.position.set(xc + p.x, 0, -(li.s + (p.k - 1) * .9)) });
      const front = P.s + P.len / 2, line = li.s - 6;
      if (li.pf > -1e8 && li.pf < line && front >= line && ph >= RED && P.v > 2) ev.red = true;
      li.pf = front;
      if (cd <= 0 && Math.abs(P.v) > 1.5) li.peds.forEach(p => { const sp = li.s + (p.k - 1) * .9;
        if (!p.hit && Math.abs(p.x) < 6.8 && Math.abs(P.s - sp) < P.len / 2 + .3 && Math.abs(xc + p.x - (X.cx(P.s) + P.d)) < 1.7) { p.hit = true; ev.ped = true; cd = 1.5 } });
    });
    veh.forEach(me => {
      const dir = me.dir, sp = Math.abs(me.v), front = me.s + dir * me.len / 2; let gap = 1e9, vl = me.vt * dir, ref = null;
      const cand = (o, isP) => { if (o === me || Math.abs(o.d - me.d) > 1.9) return; if (me.ov == 1 && (o === me.ref || (isP && me.ref === 'P'))) return;
        const ds = (o.s - me.s) * dir; if (ds <= 0) return; const g = ds - (o.len + me.len) / 2; if (g < gap) { gap = g; vl = o.v * dir; ref = isP ? 'P' : o } };
      veh.forEach(o => cand(o, false)); cand(pl, true);
      let stopGap = 1e9;
      lights.forEach(li => { const ph = (P.t + li.off) % CYC; if (ph < GRN) return; const line = dir > 0 ? li.s - 6 : li.s + 6, g = (line - front) * dir;
        if (g > -1 && g < 90 && (ph >= RED || g > sp * sp / 8 + 2) && g < stopGap) stopGap = g });
      if (stopGap < gap) { gap = stopGap; vl = 0; ref = null }
      let vt = me.vt;
      if (dir > 0 && !me.small) {
        me.cdw -= dt;
        if (me.ov == 0 && me.cdw <= 0 && ref && gap < 26 && vl > -1 && me.vt - vl > 3 && stopGap > 1e8) {
          const clear = !veh.some(o => (o.dir < 0 && o.s > me.s - 30 && o.s < me.s + 170) || (o !== me && o.dir > 0 && o.d > 0 && Math.abs(o.s - me.s) < 30)) && !(pl.d > .5 && pl.s > me.s - 20 && pl.s < me.s + 170) && !lights.some(li => li.s > me.s - 10 && li.s < me.s + 170);
          if (clear) { me.ov = 1; me.ref = ref; me.td = 3 }
        }
        if (me.ov == 1) { vt = Math.min(20, me.vt * 1.35); const rs = me.ref === 'P' ? pl.s : me.ref.s, rl = me.ref === 'P' ? pl.len : me.ref.len; if (me.s - me.len / 2 > rs + rl / 2 + 8) { me.ov = 2; me.td = -3 } }
        if (me.ov == 2 && me.d < -2.6) { me.ov = 0; me.cdw = 8; me.ref = null }
      }
      const dv = sp - vl, ss = 6 + Math.max(0, sp * 1.3 + sp * dv / (2 * Math.sqrt(2.5 * 3.5)));
      let acc = clamp(2.5 * (1 - Math.pow(sp / vt, 4) - (gap < 1e8 ? Math.pow(ss / Math.max(gap, .3), 2) : 0)), -9, 2.5), nsp = Math.max(0, sp + acc * dt); if (gap < .4) nsp = 0;
      me.v = dir * nsp; me.s += me.v * dt; me.d += clamp(me.td - me.d, -2.5 * dt, 2.5 * dt);
      if (me.s < 30) { me.s = X.L - 100; me.ov = 0 } if (me.s > X.L - 50) { me.s = 130; me.ov = 0 }
      if (cd <= 0 && Math.abs(me.s - pl.s) < (me.len + pl.len) / 2 && Math.abs(me.d - pl.d) < (me.w + 2.55) / 2 - .1) { ev.crash = true; cd = 1.5; me.s -= 90; me.v = dir * me.vt * .5 }
      me.g.position.set(X.cx(me.s) + me.d, 0, -me.s); me.g.rotation.y = -Math.atan(X.dxs(me.s)) + (dir < 0 ? Math.PI : 0);
    });
    return ev;
  }
  return { init, update, get vehicles() { return veh }, get lights() { return lights } };
})();
