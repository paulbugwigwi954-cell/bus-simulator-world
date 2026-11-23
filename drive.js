// Gia (Auto / Semi / Manual), indicator, hazards, na sauti ya injini ya basi la dizeli.
// Vifunguo: I gia juu · K gia chini (N = neutral, kwenye Manual) · N aina ya gia · Z/X indicator kushoto/kulia · F hazards
window.DRIVE = (function () {
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const MODES = ['auto', 'semi', 'manual'], MN = { auto: 'Auto', semi: 'Semi', manual: 'Manual' };
  const D = { mode: 'auto', gear: 1, eng: true, L: false, R: false, H: false, ph: 0, lit: false, rpm: .2, turned: 0, lug: 0, restT: 0, prevV: 0 };
  try { const m = localStorage.getItem('trm'); if (MODES.includes(m)) D.mode = m } catch (e) {}
  let BS = null, ind = null, AC = null, A = null, noiseBuf = null;
  const N = () => BS.gears.length, lo = g => BS.gears[g - 1], hi = g => g < N() ? BS.gears[g] : BS.vmax;
  const say = t => { if (typeof window.say === 'function') window.say(t) };

  function attach(body, bs) { BS = bs; D.gear = 1; D.eng = true; D.lug = 0; D.restT = 0; ind = body && body.userData && body.userData.ind || null; paint() }
  function paint() {
    if (!ind) return;
    const on = (side) => (D[side] || D.H) && D.lit;
    [['L', ind.L], ['R', ind.R]].forEach(([s, m]) => { const o = on(s); m.emissive.setHex(o ? 0xffaa00 : 0x000000); m.color.setHex(o ? 0xffc040 : 0x7a5200) });
  }
  function setMode(m) { D.mode = m; if (m === 'auto') D.eng = true; try { localStorage.setItem('trm', m) } catch (e) {} say('Gia: ' + MN[m] + (m === 'auto' ? ' (inabadilika yenyewe)' : m === 'semi' ? ' (wewe unabadilisha, I/K, bila kuzima injini)' : ' (I/K, N = neutral, injini inaweza kuzima)')); sync() }
  function shift(d) {
    if (D.mode === 'auto') return say('Uko kwenye Auto. Bonyeza N kubadilisha kuwa Semi au Manual.');
    D.gear = clamp(D.gear + d, D.mode === 'manual' ? 0 : 1, N());
    say('Gia ' + (D.gear === 0 ? 'N (neutral)' : D.gear));
  }
  function key(code) {
    if (code === 'KeyI') shift(1); else if (code === 'KeyK') shift(-1);
    else if (code === 'KeyN') setMode(MODES[(MODES.indexOf(D.mode) + 1) % 3]);
    else if (code === 'KeyZ') { D.L = !D.L; D.R = false; D.H = false; D.ph = 0; D.turned = 0; sync() }
    else if (code === 'KeyX') { D.R = !D.R; D.L = false; D.H = false; D.ph = 0; D.turned = 0; sync() }
    else if (code === 'KeyF') { D.H = !D.H; D.ph = 0; sync() }
  }

  // inarudisha { on, tq (nguvu ya injini), cap (kasi ya juu ya gia), eb (engine brake) }
  function update(S, bs, K, dt) {
    BS = bs; const v = Math.abs(S.v), thr = !!K.G && S.fuel > 0, r = { on: true, tq: 1, cap: null, eb: 0 };
    let target = .2;
    if (S.rev) { target = .2 + .5 * clamp(v / 6, 0, 1) + (thr ? .15 : 0) }
    else if (D.mode === 'auto') {
      let g = 1; while (g < N() && v > BS.gears[g]) g++; D.gear = g; D.eng = true;
      target = .22 + .78 * clamp((v - lo(g)) / (hi(g) - lo(g)), 0, 1);
    } else {
      let g = D.gear;
      if (D.mode === 'semi' && g > 1 && v < lo(g) * .5) { g--; D.gear = g }
      if (!D.eng) {
        r.on = false; r.tq = 0; target = 0;
        if (thr && g <= 1 && v < 1.5) { D.restT += dt; if (D.restT > .5) { D.eng = true; D.restT = 0; say('Injini imewaka') } } else D.restT = 0;
      } else if (g === 0) { r.tq = 0; target = .2 + (thr ? .7 : 0) }
      else {
        const rr = v / hi(g);
        r.tq = (1.25 - .1 * (g - 1)) * (1 - .5 * Math.min(rr, 1) ** 2); r.cap = hi(g) * 1.08; r.eb = .5 * (1 - (g - 1) / N());
        target = .2 + .8 * clamp(rr, 0, 1);
        if (D.mode === 'manual' && g >= 3 && v < lo(g) * .45) {
          r.tq *= (v / (lo(g) * .45)) * .6; D.lug = thr ? D.lug + dt : Math.max(0, D.lug - dt);
          if (D.lug > .9) { D.eng = false; D.lug = 0; S.v *= .9; say('Injini imezima! Weka gia 1 au N, kisha shikilia gesi kuiwasha.'); if (window.thud) window.thud() }
        } else D.lug = Math.max(0, D.lug - dt * 2);
      }
    }
    D.rpm += (target - D.rpm) * Math.min(1, dt * (thr ? 5 : 3));
    return r;
  }
  // hufutwa indicator baada ya kukata kona; hiss ya breki ya hewa basi likisimama
  function afterStep(S, K, dt) {
    if ((D.L || D.R) && !D.H) { const st = Math.abs(S.delta); if (st > .12) D.turned = 1; else if (D.turned && st < .03 && Math.abs(S.v) > 2) { D.L = D.R = false; D.turned = 0; sync() } }
    if (K.B && D.prevV > 3 && Math.abs(S.v) < .3) hiss();
    D.prevV = Math.abs(S.v);
  }
  function tick(dt) {
    if (!(D.L || D.R || D.H)) { if (D.lit) { D.lit = false; paint() } return }
    D.ph += dt * 1.5; const lit = (D.ph % 1) < .5;
    if (lit !== D.lit) { D.lit = lit; paint(); click(lit) }
  }
  function cockpit() { return { gear: gl(), mode: MN[D.mode].toUpperCase(), L: (D.L || D.H) && D.lit, R: (D.R || D.H) && D.lit, stall: !D.eng } }
  const gl = () => D.gear === 0 ? 'N' : String(D.gear);
  function label(S) {
    const g = S.rev ? 'R' : D.gear === 0 ? 'N' : D.gear, l = (D.L || D.H) && D.lit ? '<b style="color:#7CFC00">◀</b>' : '', r = (D.R || D.H) && D.lit ? '<b style="color:#7CFC00">▶</b>' : '';
    return l + '<b>' + g + '</b> <small>' + MN[D.mode] + '</small> ' + r + (D.eng ? '' : ' <b style="color:#ff5252">ZIMA</b>') + (D.H ? ' <b style="color:#ff5252">⚠</b>' : '');
  }
  function cp(S) { const c = cockpit(); c.gear = S.rev ? 'R' : D.gear === 0 ? 'N' : String(D.gear); return c }

  // ---- sauti ----
  function noise() { if (noiseBuf) return noiseBuf; const b = AC.createBuffer(1, AC.sampleRate, AC.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return noiseBuf = b }
  function audioInit(ac) {
    AC = ac; if (A || !AC) return;
    const m = AC.createGain(); m.gain.value = 0; m.connect(AC.destination);
    const sh = AC.createWaveShaper(), cv = new Float32Array(256); for (let i = 0; i < 256; i++) { const x = i / 128 - 1; cv[i] = Math.tanh(2.2 * x) } sh.curve = cv;
    const lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 400; lp.Q.value = 1.2;
    const amp = AC.createGain(); amp.gain.value = .8; const mix = AC.createGain(); mix.gain.value = 1; mix.connect(lp); lp.connect(sh); sh.connect(amp); amp.connect(m);
    const o = [['sawtooth', .55], ['square', .5], ['triangle', .25]].map(([t, g]) => { const x = AC.createOscillator(), gg = AC.createGain(); x.type = t; gg.gain.value = g; x.connect(gg); gg.connect(mix); x.start(); return x });
    const lfo = AC.createOscillator(), ld = AC.createGain(); lfo.frequency.value = 10; ld.gain.value = .3; lfo.connect(ld); ld.connect(amp.gain); lfo.start();
    const ns = AC.createBufferSource(); ns.buffer = noise(); ns.loop = true; const bp = AC.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 500; bp.Q.value = .7; const ng = AC.createGain(); ng.gain.value = 0; ns.connect(bp); bp.connect(ng); ng.connect(m); ns.start();
    const tb = AC.createOscillator(), tg = AC.createGain(); tb.type = 'sine'; tg.gain.value = 0; tb.connect(tg); tg.connect(m); tb.start();
    A = { m, o, lp, lfo, ld, bp, ng, tb, tg };
  }
  function audio(ac, dt, thr, on, S, bs) {
    if (!A) return; const t = ac.currentTime, v = Math.abs(S.v), alive = on && D.eng;
    const real = 650 + D.rpm * 1700, f = real / 60 * 3 * (bs.hz / 40);
    A.o[0].frequency.setTargetAtTime(f, t, .05); A.o[1].frequency.setTargetAtTime(f / 2, t, .05); A.o[2].frequency.setTargetAtTime(f * 2, t, .05);
    A.lp.frequency.setTargetAtTime(220 + D.rpm * 900 + (thr ? 500 : 0), t, .08);
    A.lfo.frequency.setTargetAtTime(6 + D.rpm * 22, t, .1); A.ld.gain.setTargetAtTime(.08 + .3 * (1 - D.rpm), t, .1);
    A.m.gain.setTargetAtTime(alive ? .16 + D.rpm * .12 + (thr ? .1 : 0) : 0, t, .12);
    A.bp.frequency.setTargetAtTime(300 + v * 40, t, .1); A.ng.gain.setTargetAtTime(on ? .03 + D.rpm * .05 + v * .004 : 0, t, .15);
    A.tb.frequency.setTargetAtTime(2200 + D.rpm * 3500, t, .1); A.tg.gain.setTargetAtTime(alive && thr && D.rpm > .5 ? (D.rpm - .5) * .03 : 0, t, .15);
  }
  function click(hi_) { if (!AC || window.DMUTE) return; const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime; o.type = 'square'; o.frequency.value = hi_ ? 1900 : 1400; g.gain.setValueAtTime(.035, t); g.gain.exponentialRampToValueAtTime(.001, t + .03); o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + .04) }
  function hiss() { if (!AC || window.DMUTE) return; const s = AC.createBufferSource(), g = AC.createGain(), h = AC.createBiquadFilter(), t = AC.currentTime; s.buffer = noise(); h.type = 'highpass'; h.frequency.value = 3500; g.gain.setValueAtTime(.09, t); g.gain.exponentialRampToValueAtTime(.001, t + .6); s.connect(h); h.connect(g); g.connect(AC.destination); s.start(t); s.stop(t + .65) }

  // ---- vitufe vya kugusa (simu) ----
  let mb;
  function sync() { if (mb) { mb.textContent = MN[D.mode]; mb.style.background = ''; } document.querySelectorAll('#tb2 [data-d]').forEach(b => { const k = b.dataset.d; b.style.outline = (k === 'L' && D.L) || (k === 'R' && D.R) || (k === 'H' && D.H) ? '3px solid #7CFC00' : '' }) }
  function ui() {
    const st = document.createElement('style');
    st.textContent = '#tb2{position:fixed;left:58px;top:calc(104px + env(safe-area-inset-top,0px));display:grid;grid-template-columns:repeat(2,42px);gap:6px;z-index:3}#tb2 button{width:42px;height:42px;border-radius:50%;border:2px solid #fff6;background:rgba(10,14,20,.72);color:#fff;font-size:12px;padding:0;touch-action:none}';
    document.head.appendChild(st);
    const box = document.createElement('div'); box.id = 'tb2';
    [['⚠', 'H'], ['◁', 'L'], ['▷', 'R'], ['G+', 'U'], ['G−', 'W'], ['', 'M']].forEach(([t, d]) => { const b = document.createElement('button'); b.textContent = t; b.dataset.d = d; if (d === 'M') mb = b; box.appendChild(b) });
    box.addEventListener('pointerdown', e => { const b = e.target.closest('button'); if (!b) return; e.preventDefault(); const d = b.dataset.d; key({ H: 'KeyF', L: 'KeyZ', R: 'KeyX', U: 'KeyI', W: 'KeyK', M: 'KeyN' }[d]) });
    document.body.appendChild(box); sync();
  }
  if (document.body) ui(); else addEventListener('DOMContentLoaded', ui);
  return { attach, update, afterStep, tick, key, label, cockpit: cp, audioInit, audio, click, hiss, get mode() { return D.mode } };
})();
