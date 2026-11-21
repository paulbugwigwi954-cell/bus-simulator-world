// Usukani: chagua vitufe, usukani wa mzunguko (steering), au kuinamisha simu. Pia unyeti na kuweka sawa (calibrate).
window.STEER = (function () {
  const LS = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : v } catch (e) { return d } }, SV = (k, v) => { try { localStorage.setItem(k, v) } catch (e) { } };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  let mode = LS('steerMode', 'btn'), sens = parseFloat(LS('steerSens', '1')) || 1, inv = LS('steerInv', '0') == '1', wheel = 0, th0 = null, th = 0, tiltOn = false, drag = false, a0 = 0, cur = 0;
  const sw = document.createElement('div'); sw.id = 'sw';
  sw.style.cssText = 'position:fixed;left:14px;bottom:calc(14px + env(safe-area-inset-bottom,0px));width:150px;height:150px;touch-action:none;display:none;z-index:2';
  sw.innerHTML = '<svg viewBox="-50 -50 100 100" width="150" height="150"><g id="swg"><circle r="44" fill="none" stroke="#222" stroke-width="9"/><circle r="44" fill="none" stroke="#f5c518" stroke-width="1.5"/><rect x="-44" y="-3" width="88" height="6" fill="#222"/><rect x="-3" y="0" width="6" height="44" fill="#222"/><circle r="9" fill="#333" stroke="#f5c518"/><polygon points="-4,-44 4,-44 0,-36" fill="#f5c518"/></g></svg>';
  document.body.appendChild(sw);
  const ti = document.createElement('div'); ti.id = 'ti'; ti.style.cssText = 'position:fixed;left:50%;bottom:calc(8px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);width:160px;height:8px;background:#fff3;border-radius:4px;display:none;z-index:2'; ti.innerHTML = '<div id="tib" style="position:absolute;left:50%;top:-3px;width:14px;height:14px;margin-left:-7px;border-radius:50%;background:#f5c518"></div>'; document.body.appendChild(ti);
  const ang = e => { const r = sw.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) };
  sw.addEventListener('pointerdown', e => { drag = true; a0 = ang(e); sw.setPointerCapture(e.pointerId); e.preventDefault() });
  sw.addEventListener('pointermove', e => { if (!drag) return; const a = ang(e); let d = a - a0; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; wheel = clamp(wheel + d / (Math.PI * .75), -1, 1); a0 = a });
  ['pointerup', 'pointercancel'].forEach(v => sw.addEventListener(v, () => drag = false));
  function onMotion(e) {
    const a = e.accelerationIncludingGravity; if (!a || a.x == null) return;
    const o = (screen.orientation && screen.orientation.angle != null) ? screen.orientation.angle : (window.orientation || 0); let sx, sy;
    if (o == 90) { sx = -a.y; sy = a.x } else if (o == 270 || o == -90) { sx = a.y; sy = -a.x } else if (o == 180) { sx = -a.x; sy = -a.y } else { sx = a.x; sy = a.y }
    th = Math.atan2(sx, sy); if (th0 === null) th0 = th;
  }
  function enableTilt() {
    if (tiltOn) return; const go = () => { window.addEventListener('devicemotion', onMotion); tiltOn = true };
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') DeviceMotionEvent.requestPermission().then(r => { if (r === 'granted') go(); else alert('Ruhusa ya sensor imekataliwa.') }).catch(() => { }); else go();
  }
  function tiltVal() { if (th0 === null) return 0; let d = th - th0; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; const v = clamp(d / .6, -1, 1); return (Math.abs(v) < .04 ? 0 : v) * (inv ? -1 : 1) }
  function apply() {
    const lp = document.getElementById('lpad'); if (lp) lp.style.display = mode == 'btn' ? 'flex' : 'none';
    sw.style.display = mode == 'wheel' ? 'block' : 'none'; ti.style.display = mode == 'tilt' ? 'block' : 'none'; if (mode == 'tilt') enableTilt();
  }
  const pn = document.createElement('div'); pn.id = 'stp';
  pn.style.cssText = 'position:fixed;left:50%;bottom:90px;transform:translateX(-50%);z-index:7;background:#0b1118f2;color:#fff;border-radius:12px;padding:12px;font:13px system-ui,sans-serif;display:none;width:min(92vw,340px)';
  pn.innerHTML = '<b>Mipangilio ya usukani</b><label style="display:block;margin:8px 0"><input type="radio" name="sm" value="btn"> Vitufe (◀ ▶)</label><label style="display:block;margin:8px 0"><input type="radio" name="sm" value="wheel"> Usukani wa mzunguko (steering): zungusha kwa kidole</label><label style="display:block;margin:8px 0"><input type="radio" name="sm" value="tilt"> Kuinamisha simu: kata kona kwa kuinamisha simu kama usukani</label><div style="margin:8px 0">Unyeti: <input id="ssn" type="range" min=".5" max="2" step=".1" style="width:150px"></div><div style="margin:8px 0"><label><input type="checkbox" id="sinv"> Geuza upande wa kuinamisha</label></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button id="scal" style="padding:8px 12px;border-radius:8px;border:0">Weka sawa (calibrate)</button><button id="sclose" style="padding:8px 12px;border-radius:8px;border:0;background:#f5c518;font-weight:700">Funga</button></div><p style="color:#aaa;margin:8px 0 0">Kuinamisha: shika simu kama usukani, bonyeza "Weka sawa" ukiwa umenyoosha, kisha inamisha kushoto au kulia. Kibodi (A/D, mishale) inafanya kazi kila wakati.</p>';
  document.body.appendChild(pn);
  pn.querySelectorAll('input[name=sm]').forEach(r => { r.checked = r.value == mode; r.onchange = () => { mode = r.value; SV('steerMode', mode); apply() } });
  const ssn = pn.querySelector('#ssn'), sinv = pn.querySelector('#sinv'); ssn.value = sens; sinv.checked = inv;
  ssn.oninput = () => { sens = parseFloat(ssn.value); SV('steerSens', sens) }; sinv.onchange = () => { inv = sinv.checked; SV('steerInv', inv ? '1' : '0') };
  pn.querySelector('#scal').onclick = () => { th0 = th; if (typeof th0 !== 'number') th0 = 0 }; pn.querySelector('#sclose').onclick = () => pn.style.display = 'none';
  setTimeout(apply, 0);
  return {
    get mode() { return mode }, get cur() { return cur }, rate() { return mode == 'btn' ? 4 : 14 }, toggle() { pn.style.display = pn.style.display == 'none' ? 'block' : 'none' },
    get(K) {
      const keys = (K.R ? 1 : 0) - (K.L ? 1 : 0); let a = 0;
      if (mode == 'wheel') { if (!drag) wheel *= .9; a = wheel; document.getElementById('swg').setAttribute('transform', 'rotate(' + (wheel * 135).toFixed(1) + ')') }
      else if (mode == 'tilt') { a = tiltVal(); const b = document.getElementById('tib'); if (b) b.style.left = (50 + a * 45) + '%' }
      cur = clamp(keys * sens + a * sens, -1, 1); return cur;
    }
  };
})();
