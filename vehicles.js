// Magari ya kujengwa kwa msimbo: basi (makeBus) na magari ya barabarani (makeVeh). Modeli za .glb zinaweza kuchukua nafasi yake (useGlb).
(function () {
const T = THREE, M = (c, o) => new T.MeshLambertMaterial(Object.assign({ color: c }, o || {})), B = (w, h, d, m) => new T.Mesh(new T.BoxGeometry(w, h, d), m);
const css = n => '#' + ('000000' + n.toString(16)).slice(-6), pick = a => a[Math.random() * a.length | 0];
const glass = () => M(0x101c26, { side: 2 }), dark = () => M(0x1a1a1a);
function tex(w, h, fn) { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); t.anisotropy = 4; return t }
function ext(sh, len, W, bt) { bt = bt || .06; const d = W - 2 * bt, g = new T.ExtrudeGeometry(sh, { depth: d, bevelEnabled: true, bevelThickness: bt, bevelSize: bt, bevelSegments: 2, curveSegments: 8 }); g.rotateY(Math.PI / 2); g.translate(-d / 2, 0, len / 2); return g }
function shp(a) { const s = new T.Shape(); a.forEach((p, i) => { if (!i) s.moveTo(p[0], p[1]); else if (p.length == 4) s.quadraticCurveTo(p[0], p[1], p[2], p[3]); else s.lineTo(p[0], p[1]) }); return s }
function wheel(g, x, y, z, r, w) { const a = [new T.Mesh(new T.CylinderGeometry(r, r, w, 18), M(0x111111)), new T.Mesh(new T.CylinderGeometry(r * .6, r * .6, w + .03, 14), M(0xc4c8cc)), new T.Mesh(new T.CylinderGeometry(r * .18, r * .18, w + .06, 8), M(0x555555))]; a.forEach(m => { m.rotation.z = Math.PI / 2; m.position.set(x, y, z); g.add(m) }) }
function wsPlane(g, W, y0, y1, zf, dz, mat) { const th = Math.atan2(dz, y1 - y0), m = new T.Mesh(new T.PlaneGeometry(W, Math.hypot(dz, y1 - y0)), mat); m.rotation.order = 'YXZ'; m.rotation.y = Math.PI; m.rotation.x = -th; m.position.set(0, (y0 + y1) / 2 + Math.sin(th) * .09, zf + dz / 2 - Math.cos(th) * .09); g.add(m) }

function sideTex(BS, side, dest) {
  const Lb = BS.len, H = 3.6, PX = 100, w = Math.round(Lb * PX), h = Math.round((H - .45) * PX), X = u => side > 0 ? u * PX : (Lb - u) * PX, Y = y => (H - y) * PX;
  const c1 = css(BS.stripes[0][0]), c2 = css(BS.stripes[1][0]), paint = css(BS.col);
  return tex(w, h, g => {
    const poly = (p, col) => { g.fillStyle = col; g.beginPath(); p.forEach((q, i) => i ? g.lineTo(X(q[0]), Y(q[1])) : g.moveTo(X(q[0]), Y(q[1]))); g.closePath(); g.fill() };
    const gl = (u0, u1, y0, y1) => { const x0 = Math.min(X(u0), X(u1)), ww = Math.abs(X(u1) - X(u0)), gr = g.createLinearGradient(0, Y(y1), 0, Y(y0)); gr.addColorStop(0, '#3a5266'); gr.addColorStop(1, '#0c1721'); g.fillStyle = gr; g.fillRect(x0, Y(y1), ww, Y(y0) - Y(y1)); g.fillStyle = 'rgba(255,255,255,.08)'; g.beginPath(); g.moveTo(x0 + ww * .2, Y(y1)); g.lineTo(x0 + ww * .35, Y(y1)); g.lineTo(x0 + ww * .2, Y(y0)); g.lineTo(x0 + ww * .05, Y(y0)); g.fill() };
    poly([[0, 1.8], [0, 3.3], [1.7, 1.8]], c1); poly([[0, 3.3], [.25, 3.3], [1.95, 1.8], [1.7, 1.8]], c2);
    poly([[.1, 1.42], [Lb - .1, 1.42], [Lb - .1, 1.78], [.1, 1.78]], c1); poly([[.1, 1.34], [Lb - .1, 1.34], [Lb - .1, 1.4], [.1, 1.4]], c2);
    const w0 = 1.9, w1 = side > 0 ? Lb - 1.9 : Lb - 3.25; gl(w0, w1, 1.9, 3.2);
    g.fillStyle = paint; for (let u = w0 + 1.2; u < w1 - .3; u += 1.25) g.fillRect(X(u) - 6, Y(3.2), 12, Y(1.9) - Y(3.2));
    if (side < 0) { gl(Lb - 3.15, Lb - 2.5, 1.3, 3.15); gl(Lb - 2.45, Lb - 1.8, 1.3, 3.15); g.strokeStyle = '#222'; g.lineWidth = 3; g.strokeRect(X(Lb - 1.75), Y(3.2), X(Lb - 3.2) - X(Lb - 1.75), Y(.5) - Y(3.2)); for (let i = 0; i < 3; i++) { g.fillStyle = '#333'; g.fillRect(X(Lb - 3.1), Y(1.2 - i * .25), X(Lb - 1.85) - X(Lb - 3.1), 3) } }
    g.fillStyle = '#fff'; g.font = 'italic 800 28px Arial,sans-serif'; g.textAlign = 'center'; g.fillText(BS.brand || 'MKOANI EXPRESS', X(Lb * .45), Y(1.49));
    const ua = BS.axles.map(z => Lb / 2 - z), d0 = ua[1] + 1.1, d1 = ua[0] - 1.1, dw = (d1 - d0 - .15) / 2; g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = 3;
    for (let i = 0; i < 2; i++) { const a = d0 + i * (dw + .15); g.strokeRect(Math.min(X(a), X(a + dw)), Y(1.28), dw * PX, Y(.62) - Y(1.28)); g.fillStyle = '#444'; g.fillRect(X(a + dw / 2) - 10, Y(.95), 20, 5) }
    g.fillStyle = '#0a0a0a'; ua.forEach(u => { g.beginPath(); g.arc(X(u), Y(.55), .66 * PX, 0, Math.PI * 2); g.fill() });
  });
}
function frontTex(BS) {
  return tex(510, 210, (g, w, h) => {
    g.fillStyle = css(BS.col); g.fillRect(0, 0, w, h); g.fillStyle = css(BS.stripes[0][0]); g.fillRect(0, 0, w, 16);
    g.fillStyle = '#1c1c1c'; g.fillRect(0, 160, w, 50); g.fillStyle = '#f4f4f4'; g.fillRect(205, 168, 100, 34); g.fillStyle = '#111'; g.font = 'bold 22px Arial'; g.textAlign = 'center'; g.fillText('T 482 DKR', 255, 193);
    g.fillStyle = '#15191d'; g.fillRect(145, 60, 220, 80); g.strokeStyle = '#333'; g.lineWidth = 2; for (let y = 70; y < 140; y += 12) { g.beginPath(); g.moveTo(145, y); g.lineTo(365, y); g.stroke() }
    g.fillStyle = '#c9ced2'; g.beginPath(); g.arc(255, 40, 17, 0, 7); g.fill();
    [30, 370].forEach(x => { g.fillStyle = '#e8ecef'; g.fillRect(x, 78, 110, 46); g.fillStyle = '#ffe9a0'; g.beginPath(); g.arc(x + 40, 101, 17, 0, 7); g.fill(); g.fillStyle = '#ff9800'; g.fillRect(x + 75, 88, 28, 24) });
  });
}
function wsTex(BS, dest) {
  return tex(500, 300, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#46627a'); gr.addColorStop(1, '#0b141c'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#111'; g.lineWidth = 4; g.beginPath(); g.moveTo(120, h - 6); g.lineTo(300, h - 70); g.moveTo(330, h - 6); g.lineTo(440, h - 80); g.stroke();
    g.fillStyle = 'rgba(255,255,255,.07)'; g.beginPath(); g.moveTo(60, 0); g.lineTo(160, 0); g.lineTo(60, h); g.lineTo(0, h); g.fill();
    g.fillStyle = '#000'; g.fillRect(110, 10, 280, 44); g.fillStyle = '#ffb300'; g.font = 'bold 30px Arial'; g.textAlign = 'center'; g.fillText(dest, 250, 44);
  });
}
function rearTex(BS) {
  return tex(235, 220, (g, w, h) => {
    g.fillStyle = css(BS.col); g.fillRect(0, 0, w, h); g.fillStyle = '#101c26'; g.fillRect(25, 10, 185, 80);
    g.fillStyle = css(BS.stripes[0][0]); g.fillRect(0, 96, w, 14); g.fillStyle = '#15191d'; g.fillRect(55, 118, 125, 50); g.strokeStyle = '#333'; for (let y = 126; y < 168; y += 9) { g.beginPath(); g.moveTo(55, y); g.lineTo(180, y); g.stroke() }
    g.fillStyle = '#c62828'; g.fillRect(10, 165, 46, 28); g.fillRect(179, 165, 46, 28); g.fillStyle = '#1c1c1c'; g.fillRect(0, 198, w, 22); g.fillStyle = '#f4f4f4'; g.fillRect(70, 200, 95, 18); g.fillStyle = '#111'; g.font = 'bold 15px Arial'; g.textAlign = 'center'; g.fillText('T 482 DKR', 117, 214);
  });
}
function makeBus(BS, dest) {
  const g = new T.Group(), Lb = BS.len, W = 2.55, H = 3.6, rk = BS.rake * 2.5, add = (m, x, y, z) => { m.position.set(x, y, z); g.add(m); return m };
  g.add(new T.Mesh(ext(shp([[.7, .45], [Lb - .8, .45], [Lb, .45, Lb, 1.15], [Lb, 1.55], [Lb - rk, 3.1], [Lb - rk - .1, H, Lb - rk - 1.1, H], [1.2, H], [0, H, 0, 3.0], [0, 1.0], [0, .45, .7, .45]]), Lb, W, .07), M(BS.col)));
  add(B(W - .5, .05, Lb - rk - 2.3, M(0xdcdcdc)), 0, H + .03, (rk - .1) / 2); add(B(W - .3, .3, Lb - 1.2, dark()), 0, .32, 0);
  [1, -1].forEach(sd => { const m = new T.Mesh(new T.PlaneGeometry(Lb, H - .45), M(0xffffff, { map: sideTex(BS, sd, dest), transparent: true, polygonOffset: true, polygonOffsetFactor: -2 })); m.rotation.y = sd > 0 ? Math.PI / 2 : -Math.PI / 2; m.position.set(sd * (W / 2 + .012), (H + .45) / 2, 0); g.add(m) });
  const fm = new T.Mesh(new T.PlaneGeometry(W, 1.05), M(0xffffff, { map: frontTex(BS) })); fm.rotation.y = Math.PI; fm.position.set(0, 1.025, -Lb / 2 - .08); g.add(fm);
  wsPlane(g, W - .3, 1.55, 3.1, -Lb / 2, rk, M(0xffffff, { map: wsTex(BS, dest), side: 2 }));
  const rm = new T.Mesh(new T.PlaneGeometry(W - .2, 2.2), M(0xffffff, { map: rearTex(BS) })); rm.position.set(0, 1.9, Lb / 2 + .08); g.add(rm);
  [-1, 1].forEach(sx => { add(B(.55, .2, .05, M(0xffffcc, { emissive: 0xffffaa })), sx * .8, 1.05, -Lb / 2 - .1); add(B(.5, .22, .05, M(0xff2222, { emissive: 0x771111 })), sx * .85, 1.2, Lb / 2 + .1);
    add(B(.35, .05, .05, dark()), sx * (W / 2 + .18), 2.9, -Lb / 2 + .8); add(B(.1, .45, .22, dark()), sx * (W / 2 + .35), 2.9, -Lb / 2 + .8); add(B(.4, .06, .06, dark()), sx * (W / 2 - .3), 3.45, -Lb / 2 + .3) });
  add(B(W + .06, .16, .22, dark()), 0, .5, -Lb / 2 - .1); add(B(W + .06, .16, .22, dark()), 0, .5, Lb / 2 + .1);
  BS.axles.forEach((z, i) => [-1, 1].forEach(sx => { wheel(g, sx * (W / 2 - .02), .55, z, .55, .36); if (i == 1) wheel(g, sx * (W / 2 - .42), .55, z, .55, .3) }));
  if (BS.ac) add(B(1.5, .28, 1.4, M(0xe8e8e8)), 0, H + .17, -4.4); add(B(.7, .08, .7, M(0xcfcfcf)), 0, H + .08, 2.6); add(B(.7, .08, .7, M(0xcfcfcf)), 0, H + .08, -1.2);
  // taa za indicator/hazard (rangi ya chungwa); DRIVE inazibadilisha
  const lg = new T.Group(), mL = M(0x7a5200, { emissive: 0x000000 }), mR = M(0x7a5200, { emissive: 0x000000 });
  [-1, 1].forEach(sx => { const m = sx < 0 ? mL : mR, ad = (b, x, y, z) => { b.position.set(x, y, z); lg.add(b) };
    ad(B(.2, .2, .05, m), sx * 1.15, 1.05, -Lb / 2 - .11); ad(B(.2, .22, .05, m), sx * 1.17, 1.2, Lb / 2 + .11); ad(B(.04, .1, .3, m), sx * (W / 2 + .02), 1.0, -Lb / 2 + 1.4) });
  g.add(lg); g.userData.lampG = lg; g.userData.ind = { L: mL, R: mR };
  return g;
}
function makeVeh(kind) {
  const g = new T.Group(), add = (m, x, y, z) => { m.position.set(x, y, z); g.add(m); return m }, col = pick([0xe8e8e8, 0x1f2a44, 0x8a1f1f, 0x2f4f2f, 0x555a5f, 0xc9c9c9, 0x111111]), pm = M(col);
  const lamps = (len, W, yf, yr) => [-1, 1].forEach(sx => { add(B(.36, .14, .06, M(0xffffcc, { emissive: 0xffffaa })), sx * (W / 2 - .38), yf, -len / 2 - .02); add(B(.3, .12, .06, M(0xff2222, { emissive: 0x771111 })), sx * (W / 2 - .3), yr, len / 2 + .02) });
  let len, W;
  if (kind == 'sedan' || kind == 'suv' || kind == 'pickup') {
    const suv = kind == 'suv', pk = kind == 'pickup'; len = suv ? 4.9 : pk ? 5.3 : 4.6; W = suv ? 1.95 : pk ? 1.9 : 1.8;
    const bl = suv ? 1.1 : pk ? 1.0 : .95, rf = suv ? 1.85 : pk ? 1.78 : 1.42, wr = suv ? .4 : pk ? .38 : .32, cb = suv ? [.45, len - 1.0, .55, len - 1.35] : pk ? [2.05, len - 1.05, 2.2, len - 1.55] : [.85, len - 1.15, 1.5, len - 1.85];
    g.add(new T.Mesh(ext(shp([[.15, .3], [len - .25, .3], [len, .3, len, .58], [len, bl - .2], [len - .4, bl - .08], [len - 1.2, bl], [1.1, bl], [.5, bl - .02], [0, bl - .05, 0, bl - .3], [0, .5], [0, .3, .15, .3]]), len, W), pm));
    g.add(new T.Mesh(ext(shp([[cb[0], bl - .02], [cb[1], bl - .02], [cb[3], rf], [cb[2], rf]]), len, W - .12, .04), glass()));
    add(B(W - .22, .05, cb[3] - cb[2], pm), 0, rf + .02, len / 2 - (cb[2] + cb[3]) / 2);
    if (pk) { [-1, 1].forEach(sx => add(B(.06, .42, 2.0, pm), sx * (W / 2 - .03), bl + .2, len / 2 - 1.05)); add(B(W - .1, .42, .06, pm), 0, bl + .2, len / 2 - .03); add(B(W - .15, .5, .06, pm), 0, bl + .25, len / 2 - 2.05) }
    [-1, 1].forEach(sx => { wheel(g, sx * (W / 2 - .1), wr, -len / 2 + 1.0, wr, .26); wheel(g, sx * (W / 2 - .1), wr, len / 2 - 1.0, wr, .26) });
    lamps(len, W, .72, .85); add(B(W - .1, .14, .2, dark()), 0, .38, -len / 2); add(B(W - .1, .14, .2, dark()), 0, .38, len / 2);
  } else if (kind == 'matatu') {
    len = 5.3; W = 1.95; const sc = pick([0xe91e63, 0x00a651, 0xf5c518, 0x1e88e5, 0xff6f00]);
    g.add(new T.Mesh(ext(shp([[.2, .4], [len - .4, .4], [len, .4, len, .8], [len, 1.3], [len - .75, 2.25], [.3, 2.35], [0, 2.3, 0, 2.0], [0, .6], [0, .4, .2, .4]]), len, W), M(0xf2f2f2)));
    add(B(W + .03, .16, len - 1.0, M(sc)), 0, 1.05, .4); add(B(W + .03, .08, len - 1.0, dark()), 0, .85, .4); add(B(W + .02, .75, len - 2.3, glass()), 0, 1.75, .05);
    wsPlane(g, W - .2, 1.35, 2.2, -len / 2, .72, glass()); [-1, 1].forEach(sx => { wheel(g, sx * (W / 2 - .1), .33, -len / 2 + 1.1, .33, .26); wheel(g, sx * (W / 2 - .1), .33, len / 2 - 1.1, .33, .26) }); lamps(len, W, .95, 1.0);
  } else if (kind == 'lorry') {
    len = 8; W = 2.3; const bc = pick([0xe8e8e8, 0x1565c0, 0xc62828, 0xf9a825, 0x2e7d32]);
    g.add(new T.Mesh(ext(shp([[len - 2.1, .8], [len - .25, .8], [len, .8, len, 1.1], [len, 1.9], [len - .45, 2.75], [len - 2.0, 2.75], [len - 2.1, 2.6]]), len, W - .1), pm));
    wsPlane(g, W - .3, 1.9, 2.7, -len / 2, .45, glass()); add(B(W - .05, .6, 1.1, glass()), 0, 2.25, -len / 2 + 1.2);
    add(B(W, 2.3, len - 2.4, M(bc)), 0, 2.3, 1.2); add(B(1.0, .3, len - .6, dark()), 0, .8, 0);
    [-1, 1].forEach(sx => { wheel(g, sx * (W / 2 - .1), .5, -len / 2 + 1.3, .5, .3); wheel(g, sx * (W / 2 - .1), .5, len / 2 - 1.2, .5, .3); wheel(g, sx * (W / 2 - .1), .5, len / 2 - 2.3, .5, .3) }); lamps(len, W, 1.0, 1.2);
  } else {
    len = 14.5; W = 2.55; const bc = pick([0x1565c0, 0xc62828, 0x2e7d32, 0xf9a825, 0xe0e0e0]);
    g.add(new T.Mesh(ext(shp([[len - 2.6, .9], [len - .25, .9], [len, .9, len, 1.2], [len, 2.2], [len - .5, 3.3], [len - 2.0, 3.45], [len - 2.6, 3.4]]), len, W), pm));
    wsPlane(g, W - .3, 2.2, 3.3, -len / 2, .5, glass()); add(B(W - .05, .7, 1.2, glass()), 0, 2.75, -len / 2 + 1.4);
    add(B(W, 2.9, len - 3.0, M(bc)), 0, 2.35, 1.5); add(B(W + .03, .3, len - 3.2, M(0xffffff)), 0, 2.3, 1.5); add(B(1.0, .35, len - .6, dark()), 0, .85, 0);
    [-1, 1].forEach(sx => [-len / 2 + 1.3, -len / 2 + 4.0, len / 2 - 1.2, len / 2 - 2.5, len / 2 - 3.8].forEach(z => wheel(g, sx * (W / 2 - .12), .52, z, .52, .3))); lamps(len, W, 1.1, 1.3);
  }
  useGlb(g, (window.TRAFFIC_GLB || {})[kind], len, 0, []);
  return { g, len };
}
function useGlb(g, url, len, yaw, keep, cb) {
  if (!url || !T.GLTFLoader) return;
  new T.GLTFLoader().load(url, gl => {
    const m = gl.scene; let sz = new T.Box3().setFromObject(m).getSize(new T.Vector3()); if (sz.x > sz.z) m.rotation.y = Math.PI / 2; if (yaw) m.rotation.y += yaw;
    const bb = new T.Box3().setFromObject(m), c = bb.getCenter(new T.Vector3()), w = new T.Group(); sz = bb.getSize(new T.Vector3()); const k = len / sz.z;
    m.scale.setScalar(k); m.position.set(-c.x * k, -bb.min.y * k, -c.z * k); w.add(m);
    g.children.forEach(o => { if (!(keep || []).includes(o) && !o.isLight) o.visible = false }); g.add(w); if (cb) cb(sz.y * k);
  }, undefined, () => console.warn('GLB haikupatikana: ' + url));
}
window.makeBus = makeBus; window.makeVeh = makeVeh; window.useGlb = useGlb;
})();
