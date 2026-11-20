// Kabati cha dereva (mtazamo wa ndani): dashibodi, usukani unaozunguka, kipima mwendo, vioo na paa.
(function () {
const T = THREE, M = c => new T.MeshLambertMaterial({ color: c }), B = (w, h, d, m) => new T.Mesh(new T.BoxGeometry(w, h, d), m);
function makeCockpit(BS) {
  const g = new T.Group(), zf = -BS.len / 2, add = (m, x, y, z) => { m.position.set(x, y, z); g.add(m); return m };
  add(B(2.45, .6, .7, M(0x24282d)), 0, 1.85, zf + .55); add(B(2.45, .1, .8, M(0x15181b)), 0, 2.18, zf + .6);
  [-1.2, 1.2].forEach(x => { add(B(.12, 1.7, .12, M(0x15181b)), x, 2.45, zf + .5).rotation.x = .25; add(B(.3, .2, .04, M(0x0b1218)), x * .93, 2.75, zf + .45) });
  add(B(2.45, .1, 2.4, M(0x2b2f35)), 0, 3.4, zf + 1.2);
  const wp = new T.Group(), wg = new T.Group(); wp.position.set(.6, 2.0, zf + .95); wp.rotation.x = -.85; wp.add(wg);
  wg.add(new T.Mesh(new T.TorusGeometry(.22, .035, 8, 24), M(0x111111)), B(.4, .035, .035, M(0x111111)), B(.035, .2, .035, M(0x111111))); g.add(wp);
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = 128; const x = cv.getContext('2d'), tx = new T.CanvasTexture(cv);
  const pl = new T.Mesh(new T.PlaneGeometry(.5, .25), new T.MeshBasicMaterial({ map: tx })); pl.position.set(.6, 2.3, zf + .58); pl.rotation.x = -.6; g.add(pl);
  function upd(kmh, fuel, rev) {
    x.fillStyle = '#0a0f14'; x.fillRect(0, 0, 256, 128); x.fillStyle = '#e8f1ff'; x.font = 'bold 64px Arial'; x.textAlign = 'center'; x.fillText(Math.round(kmh), 100, 74);
    x.font = '18px Arial'; x.fillText('km/h', 100, 100); x.font = 'bold 54px Arial'; x.fillStyle = rev ? '#ff8a80' : '#8ef0a0'; x.fillText(rev ? 'R' : 'D', 210, 70);
    x.fillStyle = '#333'; x.fillRect(20, 112, 216, 8); x.fillStyle = fuel < 20 ? '#ff5252' : '#f5c518'; x.fillRect(20, 112, 2.16 * Math.max(0, Math.min(100, fuel)), 8); tx.needsUpdate = true;
  }
  upd(0, 100, false); g.userData = { wheel: wg, upd }; return g;
}
window.makeCockpit = makeCockpit;
})();
