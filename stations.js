// Stendi (majengo, milango ya kuingia/kutoka, wauzaji), sheli ya mafuta (lita kwa lita + malipo) na gereji za barabarani.
window.STN = (function () {
  const T = THREE, mats = {}, geos = {};
  const M = c => mats[c] || (mats[c] = new T.MeshLambertMaterial({ color: c }));
  const BM = c => mats['b' + c] || (mats['b' + c] = new T.MeshBasicMaterial({ color: c }));
  const GB = (w, h, d) => { const k = w + '_' + h + '_' + d; return geos[k] || (geos[k] = new T.BoxGeometry(w, h, d)) };
  const rnd = (a, b) => a + Math.random() * (b - a), pick = a => a[Math.random() * a.length | 0];
  let X = null; const stands = [], fuels = [], garages = [], groups = [], people = [], hoses = [];
  const fz = { phase: 'idle', f: null, pump: null, lit: 0, acc: 0, pumping: false, tip: null }, gz = { t: 0, g: null, back: false };
  let zone = '', warned = false, clock = 0;
  function bx(g, w, h, d, m, x, y, z) { const o = new T.Mesh(GB(w, h, d), m); o.position.set(x, y, z); g.add(o); return o }
  function cy(g, r, h, m, x, y, z, n) { const o = new T.Mesh(new T.CylinderGeometry(r, r, h, n || 12), m); o.position.set(x, y, z); g.add(o); return o }
  function plate(w, h, lines, bg, fg, ry) {
    const cv = document.createElement('canvas'); cv.width = 256; cv.height = Math.max(32, Math.round(256 * h / w)); const c = cv.getContext('2d');
    c.fillStyle = bg; c.fillRect(0, 0, cv.width, cv.height); c.fillStyle = fg; c.textAlign = 'center'; const n = lines.length;
    lines.forEach((t, i) => { c.font = 'bold ' + Math.round(cv.height / (n + .6)) + 'px sans-serif'; c.fillText(t, 128, (i + 1) * cv.height / (n + .3) - 4) });
    const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ map: new T.CanvasTexture(cv) })); m.rotation.y = ry || 0; return m;
  }
  function spr(g, t, col, w, x, y, z) { const s = X.label(t, col); s.scale.set(w, w * .19, 1); s.position.set(x, y, z); g.add(s); return s }
  function mk(s, side) { const g = new T.Group(), x0 = X.cx(s); g.position.set(x0, X.H(x0 + side * 12, -s), -s); g.rotation.y = -Math.atan(X.dxs(s)); g.userData.s = s; X.scene.add(g); groups.push(g); return g }

  // ---- watu ----
  const SK = [0x8d5a3b, 0x6b4226, 0x4a2c17, 0xb9794a, 0x3b2314], CL = [0xdd3333, 0x3399cc, 0xeebb99, 0x33aa55, 0xffcc33, 0x8e44ad, 0xe67e22, 0x1abc9c, 0xecf0f1, 0x2c3e50];
  const HG = new T.SphereGeometry(.13, 8, 6);
  function person(g, x, z, o) {
    o = o || {}; const p = new T.Group(), sk = M(pick(SK)), tr = M(o.pants || 0x2b2f3a);
    bx(p, .46, .62, .26, M(o.shirt || pick(CL)), 0, 1.12, 0); const h = new T.Mesh(HG, sk); h.position.y = 1.58; p.add(h);
    const lim = (mat, w, hh, y, xx) => { const q = new T.Group(); q.position.set(xx, y, 0); const m = bx(q, w, hh, w, mat, 0, -hh / 2, 0); p.add(q); return q };
    const q = { p, legL: lim(tr, .17, .8, .8, -.12), legR: lim(tr, .17, .8, .8, .12), armL: lim(sk, .11, .55, 1.4, -.29), armR: lim(sk, .11, .55, 1.4, .29), kind: o.kind || 'idle', x, z, wait: rnd(0, 3), route: o.route || null, ri: 0, ph: rnd(0, 6), sp: o.sp || 1.1, face: o.face || 0, moving: false };
    p.position.set(x, .1, z); p.rotation.y = q.face; g.add(p); people.push(q); return q;
  }
  function anim(q, dt) {
    q.ph += dt; q.moving = false;
    if (q.kind === 'walk' && q.route) {
      if (q.wait > 0) q.wait -= dt;
      else { const t = q.route[q.ri], dx = t[0] - q.x, dz = t[1] - q.z, d = Math.hypot(dx, dz); if (d < .15) { q.ri = (q.ri + 1) % q.route.length; q.wait = rnd(.5, 4) } else { const st = Math.min(d, q.sp * dt); q.x += dx / d * st; q.z += dz / d * st; q.p.rotation.y = Math.atan2(dx, dz); q.moving = true } }
    } else if (q.kind === 'vend') { const on = Math.sin(q.ph * .7) > .2; q.armR.rotation.x = on ? -2.2 + Math.sin(q.ph * 5) * .35 : 0; q.p.rotation.y = q.face + Math.sin(q.ph * .5) * .15 }
    else if (q.kind === 'work') { q.armR.rotation.x = -1 + Math.sin(q.ph * 9) * .5; q.armL.rotation.x = -.6; q.p.rotation.y = q.face }
    else if (q.kind === 'idle') { q.p.rotation.y = q.face + Math.sin(q.ph * .4) * .25 }
    if (q.moving) { const w = Math.sin(q.ph * 7) * .6; q.legL.rotation.x = w; q.legR.rotation.x = -w; q.armL.rotation.x = -w * .8; q.armR.rotation.x = w * .8 }
    else if (q.kind !== 'vend' && q.kind !== 'work') { q.legL.rotation.x = q.legR.rotation.x = 0; q.armL.rotation.x = q.armR.rotation.x = 0 }
    q.p.position.set(q.x, .1, q.z);
  }
  function walkTo(q, tx, tz, dt, sp) {
    const dx = tx - q.x, dz = tz - q.z, d = Math.hypot(dx, dz); if (d < .1) return true;
    const st = Math.min(d, (sp || 2.4) * dt); q.x += dx / d * st; q.z += dz / d * st; q.p.rotation.y = Math.atan2(dx, dz); q.ph += dt; const w = Math.sin(q.ph * 12) * .6; q.legL.rotation.x = w; q.legR.rotation.x = -w; q.p.position.set(q.x, .1, q.z); return false;
  }
  function stall(g, x, z, ry, name, vend) {
    const t = new T.Group(); t.position.set(x, .1, z); t.rotation.y = ry; g.add(t);
    bx(t, 1.8, .9, .8, M(0x8a6a44), 0, .45, 0); const gc = [0xe53935, 0xfbc02d, 0x43a047, 0xff9800, 0x8e24aa];
    for (let i = 0; i < 6; i++) { const f = new T.Mesh(new T.SphereGeometry(.12, 6, 5), M(gc[i % 5])); f.position.set(-.7 + i * .28, 1.02, rnd(-.15, .15)); t.add(f) }
    cy(t, .04, 2.4, M(0x555555), 0, 1.3, -.4, 6); const um = new T.Mesh(new T.ConeGeometry(1.5, .5, 10), M(pick([0xd32f2f, 0x1976d2, 0xf9a825, 0x388e3c]))); um.position.set(0, 2.6, -.4); t.add(um);
    if (name) spr(t, name, '#7a3b00', 2.2, 0, 3.3, -.4);
    if (vend !== false) { const q = person(g, x + Math.sin(ry) * -.9, z + Math.cos(ry) * -.9, { kind: 'vend', face: ry }); q.home = true }
    return t;
  }

  // ---- STENDI ----
  function stand(p, i) {
    const g = mk(p.s, -1), wall = M(0xe9dfcb), acc = M([0xc62828, 0x1565c0, 0x2e7d32, 0xef6c00][i % 4]), conc = M(0x9aa0a6), dark = M(0x2a2f36), glass = M(0x1b3b52);
    bx(g, 10.4, 1.4, 54, conc, -11.8, -.6, 0); bx(g, 4.7, .06, 32, M(0xb9bdc2), -14.65, .12, 0);                    // uwanja na njia ya watembea kwa miguu
    bx(g, .3, .3, 40, M(0xd0d0d0), -6.7, .25, 0); for (let z = -18; z <= 18; z += 4) bx(g, .08, 1, .08, M(0xeeeeee), -6.7, .7, z); bx(g, .05, .05, 40, M(0xeeeeee), -6.7, 1.15, 0);   // kingo na uzio
    bx(g, .18, .02, 16, BM(0xf5d142), -8.0, .13, 0);                                                                  // mstari wa eneo la basi
    [[24, 'INGIA', '#1b7a2b'], [-24, 'TOKA', '#b71c1c']].forEach(([z, t, c]) => {                                       // milango ya kuingia na kutoka kwa magari
      [-3.5, 3.5].forEach(o => bx(g, .4, 4.6, .4, M(0xf5f5f5), -6.7, 2.3, z + o)); bx(g, .45, .35, 7.6, M(0xffffff), -6.7, 4.6, z); spr(g, t, c, 3.6, -6.7, 5.5, z);
      const arm = new T.Group(); arm.position.set(-6.7, 1.1, z + (z > 0 ? 3.5 : -3.5)); arm.rotation.x = z > 0 ? 1.25 : -1.25; bx(arm, .12, .12, 3.4, M(0xd32f2f), 0, 0, z > 0 ? -1.7 : 1.7); bx(arm, .13, .13, .6, M(0xffffff), 0, 0, z > 0 ? -.6 : .6); g.add(arm) });
    // jengo kuu
    bx(g, 14.8, 1.4, 31.2, conc, -24, -.6, 0); bx(g, 14.2, .05, 30.4, M(0xcfc8b8), -24, .13, 0);
    const WX = -17.2, ws = (z0, z1) => bx(g, .4, 5, z1 - z0, wall, WX, 2.6, (z0 + z1) / 2);
    ws(9, 15.2); ws(-5.5, 5.5); ws(-15.2, -9);
    [[7.25, 'KUINGIA', '#1b7a2b'], [-7.25, 'KUTOKA', '#b71c1c']].forEach(([z, t, c]) => { bx(g, .4, 1.6, 3.5, wall, WX, 4.2, z); [-1.8, 1.8].forEach(o => bx(g, .3, 3.4, .22, dark, WX + .05, 1.8, z + o)); spr(g, t, c, 3.4, WX + .5, 4.5, z) });
    [[12, 3.6], [-2.6, 3.4], [2.6, 3.4], [-12, 3.6]].forEach(([z, l]) => bx(g, .14, 1.5, l, glass, WX + .22, 2.5, z));
    bx(g, 14.2, 5, .4, wall, -24, 2.6, 15.1); bx(g, 14.2, 5, .4, wall, -24, 2.6, -15.1); bx(g, .4, 5, 30.6, wall, -31, 2.6, 0);
    [-9, 0, 9].forEach(z => bx(g, .14, 1.5, 4, glass, -30.75, 2.5, z));
    bx(g, 19.2, .45, 32.4, M(0x6d7278), -21.9, 5.4, 0); bx(g, .5, .7, 32.4, acc, -12.4, 5.2, 0);                       // paa na bendi ya rangi
    for (let z = -16; z <= 16; z += 8) cy(g, .14, 5.3, M(0x555a60), -12.6, 2.75, z, 8);
    [-9, 0, 9].forEach(z => bx(g, 4, .06, .7, BM(0xfff4d0), -24, 5.1, z));
    const sg = spr(g, p.n.toUpperCase(), '#0b3d62', 12, -17, 7.4, 0);
    // ndani: madawati ya tiketi, viti, vibanda
    [-6, 6].forEach(z => { bx(g, 1.1, 1.1, 4.4, M(0x8a6a44), -29.3, .65, z); bx(g, .1, .9, 4.4, glass, -29.8, 1.65, z); person(g, -30.2, z, { kind: 'vend', face: Math.PI / 2, shirt: 0x1565c0 }) });
    spr(g, 'TIKETI', '#1565c0', 3, -30.6, 3.6, 0);
    [-21, -25].forEach(x => [-10, 0, 10].forEach(z => { bx(g, .6, .5, 2.6, M(0x37474f), x, .4, z); bx(g, .1, .6, 2.6, M(0x37474f), x - .3, .9, z) }));
    [[-20, 'MAJI'], [-25, 'CHAKULA'], [-28.5, 'SIMU']].forEach(([x, t]) => { bx(g, 2.4, 1, .9, M(0x8a6a44), x, .6, 14); bx(g, 2.6, .1, 1.1, acc, x, 2.4, 14.3); cy(g, .04, 2.3, M(0x555555), x, 1.3, 14.9, 6); spr(g, t, '#7a3b00', 2.2, x, 3, 13.6); person(g, x, 14.9, { kind: 'vend', face: Math.PI }) });
    // nje: vibanda, wauzaji wanaotembea, abiria
    stall(g, -14.8, 11, Math.PI / 2, 'MATUNDA'); stall(g, -14.8, -11, Math.PI / 2, 'VINYWAJI');
    [[-22, -22, 'NDIZI'], [-26, -22, 'MAHINDI'], [-22, -27, 'MAJI'], [-26, -27, 'ZAWADI']].forEach(([x, z, t]) => stall(g, x, z, Math.PI, t));
    for (let k = 0; k < 3; k++) person(g, -7.4, rnd(-14, 14), { kind: 'walk', sp: 1.0, route: [[-7.4, -15], [-7.4, 15]], shirt: pick([0xf9a825, 0xd32f2f, 0x1976d2]) });
    const pts = [[-17.8, 7.25], [-17.8, -7.25], [-11.2, 3], [-11.2, -3], [-14.6, 0], [-22, 8], [-22, -8], [-11.2, 10], [-11.2, -10]];
    for (let k = 0; k < 9; k++) { const r = []; for (let j = 0; j < 4; j++) r.push(pick(pts)); person(g, r[0][0], r[0][1], { kind: 'walk', sp: rnd(.8, 1.3), route: r }) }
    for (let k = 0; k < 3; k++) person(g, rnd(-22, -14), rnd(-9, 9), { kind: 'idle', face: rnd(0, 6) });
    g.updateMatrixWorld(true); stands.push({ p, g }); return g;
  }

  // ---- SHELI ----
  function fuelStation(s) {
    const g = mk(s, -1), conc = M(0x8d9297), wh = M(0xf4f4f4), red = M(0xd32f2f);
    bx(g, 12.2, 1.4, 38, conc, -12.9, -.6, 0); [-8, 8].forEach(z => bx(g, .2, .02, 6, BM(0xf5d142), -9.6, .13, z));
    bx(g, 10.4, .5, 20, wh, -13.1, 5.7, 0); bx(g, .4, .9, 20.2, red, -8.1, 5.7, 0); bx(g, 10.4, .12, 20, BM(0xfff4d0), -13.1, 5.4, 0);
    [-8.5, 8.5].forEach(z => cy(g, .28, 5.4, wh, -14.8, 2.8, z, 10));
    bx(g, 1.6, .25, 12, M(0x6b7075), -14.8, .25, 0);                                                                     // kisiwa cha pampu
    const pumps = [];
    [-3.8, 3.8].forEach(z => {
      bx(g, .5, 1.6, .9, wh, -14.8, 1.05, z); bx(g, .52, .25, .92, red, -14.8, 1.9, z); const dp = plate(.7, .4, ['DIZELI'], '#102a10', '#7CFC00', Math.PI / 2); dp.position.set(-14.53, 1.5, z); g.add(dp);
      bx(g, .12, .35, .2, dark3(), -14.5, 1.1, z + .4);
      const top = new T.Vector3(-14.5, 1.5, z - .3), home = new T.Vector3(-14.45, 1.15, z + .4);
      const att = person(g, -13.3, z + 1.3, { kind: 'idle', shirt: 0xff6d00, pants: 0x263238, face: -Math.PI / 2 });
      const h = new T.Mesh(new T.BoxGeometry(.02, .02, .02), M(0x111111)); h.userData.g = g; X.scene.add(h); hoses.push(h);
      pumps.push({ z, top, home, att, h, ax: -13.3, az: z + 1.3 });
    });
    bx(g, 7, 3.6, 16, wall3(), -24, 1.8, 0); bx(g, 7.6, .3, 16.6, red, -24, 3.75, 0); bx(g, .12, 1.8, 11, M(0x1b3b52), -20.42, 1.8, 0);
    const bd = plate(7, 1.4, ['SHELI YA MAFUTA'], '#b71c1c', '#ffffff', Math.PI / 2); bd.position.set(-20.43, 3.1, 0); g.add(bd);
    cy(g, .12, 6, M(0x666666), -7.6, 3, -16, 8); const pb = plate(3.2, 2.6, ['DIZELI', X.fmt(X.RT.fuelPrice), X.RT.cur + '/L'], '#0d2a4a', '#ffd400', Math.PI / 2); pb.position.set(-7.4, 5.8, -16); g.add(pb);
    spr(g, 'KITUO CHA MAFUTA', '#b71c1c', 10, -8.1, 7.2, 0);
    person(g, -21.5, 6, { kind: 'idle', face: Math.PI / 2 }); person(g, -9, 16, { kind: 'vend', face: Math.PI }); bx(g, 1, .8, .7, M(0x1976d2), -9, .5, 17);
    g.updateMatrixWorld(true);
    const f = { s, g, pumps }; fuels.push(f); pumps.forEach(pp => setHose(pp.h, g.localToWorld(pp.top.clone()), g.localToWorld(pp.home.clone()))); return f;
  }
  const dark3 = () => M(0x222222), wall3 = () => M(0xefe6d2);
  function setHose(h, a, b) {
    const m = a.clone().add(b).multiplyScalar(.5); m.y -= .3 + a.distanceTo(b) * .12; const c = new T.CatmullRomCurve3([a, m, b]), gm = new T.TubeGeometry(c, 10, .035, 5, false); h.geometry.dispose(); h.geometry = gm;
  }

  // ---- GEREJI ----
  function garage(s) {
    const g = mk(s, 1), conc = M(0x8d9297), wall = M(0xc9c2b2), rust = M(0x8a3b2a), dk = M(0x3b3f44);
    bx(g, 12.2, 1.4, 30, conc, 12.9, -.6, 0); [-5.75, 5.75].forEach(z => bx(g, .2, .02, 9, BM(0xf5d142), 9, .13, z));
    bx(g, 12.4, 1.4, 27, dk, 25.4, -.6, 0);
    const wx = 19.2, ws = (z0, z1) => bx(g, .4, 6, z1 - z0, wall, wx, 3.1, (z0 + z1) / 2); ws(10, 13.2); ws(-1.5, 1.5); ws(-13.2, -10);
    [-5.75, 5.75].forEach(z => bx(g, .4, 1.8, 8.6, wall, wx, 5.2, z)); bx(g, .4, 6, 26.8, wall, 31.4, 3.1, 0); bx(g, 12.4, 6, .4, wall, 25.4, 3.1, 13.2); bx(g, 12.4, 6, .4, wall, 25.4, 3.1, -13.2);
    bx(g, 13.4, .5, 27.6, rust, 25, 6.3, 0); [-8, 0, 8].forEach(z => bx(g, 4, .06, .7, BM(0xfff4d0), 25, 6, z));
    const sg = plate(7, 1.5, ['GEREJI'], '#f9a825', '#1a1a1a', -Math.PI / 2); sg.position.set(18.9, 7.4, 0); g.add(sg);
    // bay A: gari juu ya lift; bay B: gari chini na fundi
    [-1.4, 1.4].forEach(o => bx(g, .25, 2, .25, M(0xf9a825), 25, 1.1, -5.75 + o)); [-1, 1].forEach(o => bx(g, 5.4, .22, .5, M(0xf9a825), 25, 1.9, -5.75 + o * .9));
    if (window.makeVeh) { const a = window.makeVeh('pickup'); a.rotation.y = -Math.PI / 2; a.position.set(25, 2.0, -5.75); g.add(a); const b = window.makeVeh('sedan'); b.rotation.y = -Math.PI / 2; b.position.set(25, .1, 5.75); g.add(b) }
    const mech = person(g, 22, -5.75, { kind: 'work', face: Math.PI / 2, shirt: 0x1565c0, pants: 0x1565c0 }); person(g, 25, 4.2, { kind: 'work', face: Math.PI, shirt: 0x1565c0, pants: 0x1565c0 });
    bx(g, 3, 1, .8, M(0x8a6a44), 31, .6, -9); bx(g, .6, .1, .3, M(0xcccccc), 30.8, 1.15, -8.8); person(g, 30, -9, { kind: 'idle', shirt: 0x1565c0, face: Math.PI / 2 });
    [[17.4, -9], [17.4, 9], [17.4, 11]].forEach(([x, z]) => { for (let k = 0; k < 4; k++) cy(g, .5, .28, M(0x151515), x, .3 + k * .29, z, 14) });
    [[17.8, -7.2, 0x1565c0], [18.5, -7.4, 0xc62828], [17.9, 7.6, 0x2e7d32]].forEach(([x, z, c]) => cy(g, .3, .9, M(c), x, .55, z, 10));
    person(g, 13, 8, { kind: 'idle', shirt: 0xff6d00, face: Math.PI / 2 }); spr(g, 'GEREJI · MATAIRI', '#6d3b00', 6, 14, 3, 12.5);
    g.updateMatrixWorld(true); const o = { s, g, mech, hx: 22, hz: -5.75 }; garages.push(o); return o;
  }

  // ---- kiolesura cha kujaza mafuta ----
  let P = {};
  function ui() {
    const st = document.createElement('style');
    st.textContent = '#fp{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(110px + env(safe-area-inset-bottom,0px));background:rgba(10,14,20,.86);border:2px solid #f5c518;border-radius:12px;padding:10px 14px;min-width:240px;text-align:center;display:none;z-index:4;color:#fff;font-size:14px}#fp b{color:#f5c518}#fpL{font-size:34px;font-weight:700;color:#7CFC00;font-family:monospace}#fpB{height:8px;background:#444;border-radius:4px;margin:6px 0}#fpI{display:block;height:100%;background:#f5c518;border-radius:4px;width:0}#fp button{margin:4px;padding:12px 14px;border:0;border-radius:8px;font-weight:700;font-size:14px;touch-action:none}#fpP{background:#7CFC00}#fpD{background:#f5c518}';
    document.head.appendChild(st);
    const d = document.createElement('div'); d.id = 'fp'; d.innerHTML = '<b id="fpT"></b><div id="fpL">0.0 L</div><div id="fpC"></div><div id="fpB"><i id="fpI"></i></div><button id="fpP">JAZA (shikilia)</button><button id="fpD">MALIZA &amp; LIPA</button>';
    document.body.appendChild(d); ['fp', 'fpT', 'fpL', 'fpC', 'fpI', 'fpP', 'fpD'].forEach(k => P[k] = document.getElementById(k));
    const on = e => { e.preventDefault(); fz.pumping = fz.phase === 'pump' }, off = () => fz.pumping = false;
    P.fpP.addEventListener('pointerdown', on); ['pointerup', 'pointerleave', 'pointercancel'].forEach(v => P.fpP.addEventListener(v, off));
    P.fpD.addEventListener('click', () => finishFuel());
    addEventListener('keydown', e => { if (e.code === 'KeyJ' && fz.phase === 'pump') fz.pumping = true }); addEventListener('keyup', e => { if (e.code === 'KeyJ') fz.pumping = false });
  }
  if (document.body) ui(); else addEventListener('DOMContentLoaded', ui);

  const cost = () => Math.round(fz.lit * X.RT.fuelPrice / X.RT.round) * X.RT.round;
  const wpos = (g, q, y) => g.localToWorld(new T.Vector3(q.x, y, q.z));
  function tick() { try { const a = typeof AC !== 'undefined' ? AC : null; if (!a) return; const o = a.createOscillator(), gg = a.createGain(), t = a.currentTime; o.type = 'square'; o.frequency.value = 1500; gg.gain.setValueAtTime(.02, t); gg.gain.exponentialRampToValueAtTime(.001, t + .04); o.connect(gg); gg.connect(a.destination); o.start(t); o.stop(t + .05) } catch (e) {} }

  function startFuel(f) {
    const S = X.S(), BS = X.BS(); if (S.fuel > BS.tank - 1) return X.say('Tangi lako tayari limejaa.');
    const cap = X.player().localToWorld(new T.Vector3(-1.3, 1.1, BS.len * .15)); let best = null, bd = 1e9;
    f.pumps.forEach(pp => { const d = f.g.localToWorld(pp.top.clone()).distanceTo(cap); if (d < bd) { bd = d; best = pp } });
    Object.assign(fz, { phase: 'go', f, pump: best, lit: 0, acc: 0, pumping: false });
    X.say('Mhudumu anakuja na mpira wa mafuta...');
  }
  function finishFuel() { if (fz.phase !== 'pump') return; fz.pumping = false; fz.phase = 'back'; X.say('Mhudumu anatoa mpira wa mafuta...') }
  function startRepair(o) {
    const S = X.S(); if (S.dmg < 1) return X.say('Basi lako liko salama. Hakuna cha kutengeneza.');
    gz.g = o; gz.t = 3.5; gz.back = false; X.say('Mafundi wanatengeneza basi lako...');
  }

  function nearFuel() { const S = X.S(); return fuels.find(f => Math.abs(S.s - f.s) < 14 && S.d < -5.5 && S.d > -17) }
  function nearGarage() { const S = X.S(); return garages.find(o => Math.abs(S.s - o.s) < 14 && S.d > 5.5 && S.d < 17) }
  function interact() {
    if (fz.phase === 'pump') { finishFuel(); return true } if (fz.phase !== 'idle') { X.say('Subiri mhudumu...'); return true } if (gz.t > 0) return true;
    const f = nearFuel(); if (f) { startFuel(f); return true } const o = nearGarage(); if (o) { startRepair(o); return true } return false;
  }
  const busy = () => fz.phase !== 'idle' || gz.t > 0;

  function update(dt) {
    if (!X) return; const S = X.S(), BS = X.BS(); clock += dt;
    groups.forEach(g => g.visible = Math.abs(S.s - g.userData.s) < 430); hoses.forEach(h => h.visible = h.userData.g.visible);
    people.forEach(q => { if (q.p.parent && q.p.parent.visible) anim(q, dt) });
    if (busy()) { S.v = 0 }
    // kujaza mafuta
    if (fz.phase !== 'idle') {
      const f = fz.f, pp = fz.pump, q = pp.att, cap = X.player().localToWorld(new T.Vector3(-1.3, 1.1, BS.len * .15)), stand = f.g.worldToLocal(X.player().localToWorld(new T.Vector3(-2.2, 0, BS.len * .15)));
      const goTo = (tx, tz) => walkTo(q, tx, tz, dt);
      q.kind = 'ctl'; const a = f.g.localToWorld(pp.top.clone());
      if (fz.phase === 'go') { if (goTo(stand.x, stand.z)) { fz.phase = 'pump'; X.say('Shikilia JAZA (au J) kujaza lita kwa lita. Ukimaliza bonyeza MALIZA & LIPA (E).') } setHose(pp.h, a, wpos(f.g, q, 1.0)) }
      else if (fz.phase === 'pump') {
        q.p.rotation.y = Math.PI / 2; setHose(pp.h, a, cap);
        if (fz.pumping) { if (S.fuel >= BS.tank - .001) { fz.pumping = false; X.say('Tangi limejaa! Bonyeza MALIZA & LIPA.') } else { const dl = Math.min(5 * dt, BS.tank - S.fuel); S.fuel += dl; fz.lit += dl; fz.acc += dl; if (fz.acc >= 1) { fz.acc -= 1; tick() } } }
      } else if (fz.phase === 'back') {
        const home = goTo(pp.ax, pp.az); setHose(pp.h, a, home ? f.g.localToWorld(pp.home.clone()) : wpos(f.g, q, 1.0));
        if (home) { const c = cost(); X.S().money -= c; X.say('Umejaza lita ' + fz.lit.toFixed(1) + ' · Umelipa ' + X.fmt(c) + ' ' + X.RT.cur + '. Asante!'); q.kind = 'idle'; q.face = -Math.PI / 2; fz.phase = 'idle'; fz.f = null }
      }
      P.fp.style.display = fz.phase === 'idle' ? 'none' : 'block';
      if (fz.phase !== 'idle') { P.fpT.textContent = 'Dizeli · ' + X.fmt(X.RT.fuelPrice) + ' ' + X.RT.cur + '/L'; P.fpL.textContent = fz.lit.toFixed(1) + ' L'; P.fpC.textContent = 'Jumla: ' + X.fmt(cost()) + ' ' + X.RT.cur + ' · Tangi: ' + Math.round(S.fuel) + '/' + BS.tank + ' L'; P.fpI.style.width = (S.fuel / BS.tank * 100) + '%'; P.fpP.style.opacity = fz.phase === 'pump' ? 1 : .4 }
    } else if (P.fp) P.fp.style.display = 'none';
    // gereji
    if (gz.t > 0 || gz.back) {
      const m = gz.g.mech, bl = gz.g.g.worldToLocal(X.player().localToWorld(new T.Vector3(0, 0, -BS.len / 2 - 1.2)));
      if (gz.t > 0) {
        m.kind = 'ctl';
        if (walkTo(m, bl.x, bl.z, dt)) {
          m.p.rotation.y = 0; m.ph += dt; m.armR.rotation.x = -1 + Math.sin(m.ph * 9) * .5; gz.t -= dt;
          if (gz.t <= 0) { gz.t = 0; gz.back = true; const c = Math.round(S.dmg * X.RT.washCost * .3 / X.RT.round) * X.RT.round; S.money -= c; X.say('Basi limetengenezwa kikamilifu! Gharama ' + X.fmt(c) + ' ' + X.RT.cur); S.dmg = 0 }
        }
      } else if (walkTo(m, gz.g.hx, gz.g.hz, dt)) { m.kind = 'work'; gz.back = false }
    }
    // vidokezo
    const z = busy() ? '' : nearFuel() ? 'f' : nearGarage() ? 'g' : '';
    if (z && z !== zone && Math.abs(S.v) < 4) X.say(z === 'f' ? 'Kituo cha mafuta: simama kando ya pampu na bonyeza E.' : 'Gereji: simama na bonyeza E kutengeneza basi (gharama kulingana na uharibifu).');
    zone = z;
    if (S.run && !S.done) { if (S.fuel < BS.tank * .15 && !warned) { warned = true; X.say('Mafuta yanaisha! Tafuta kituo cha mafuta (sheli) mbele.') } if (S.fuel > BS.tank * .3) warned = false }
  }
  function paved(s, d) {
    for (const x of stands) if (Math.abs(s - x.p.s) < 29 && d < -5.8 && d > -17.5) return true;
    for (const f of fuels) if (Math.abs(s - f.s) < 20 && d < -5.8 && d > -19) return true;
    for (const o of garages) if (Math.abs(s - o.s) < 18 && d > 5.8 && d < 19) return true; return false;
  }
  function init(o) {
    X = o; const STOPS = o.STOPS;
    STOPS.forEach((p, i) => {
      stand(p, i); if (p.border || i === STOPS.length - 1) return;
      const ok = s => s > 60 && s < o.L - 80 && !o.inGap(s, 50) && !STOPS.some(q => Math.abs(q.s - s) < 70);
      if (ok(p.s + 120)) fuelStation(p.s + 120); if (ok(p.s + 185)) garage(p.s + 185);
    });
  }
  function reset() { fz.phase = 'idle'; fz.pumping = false; gz.t = 0; gz.back = false; warned = false }
  return { init, update, interact, busy, paved, reset, bay: p => ({ s: p.s, d: -9.4 }) };
})();
