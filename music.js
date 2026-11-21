// Muziki wa abiria: mitindo ya kutengenezwa papo hapo (bongo flava, taarab, injili, rumba, reggae) au pakia muziki wako mwenyewe.
window.MUSIC = (function () {
  let AC, master, nb, timer = null, step = 0, next = 0, style = null, vol = .5, audio = null;
  const pn = document.createElement('div'); pn.id = 'mup';
  pn.style.cssText = 'position:fixed;left:50%;bottom:90px;transform:translateX(-50%);z-index:7;background:#0b1118f2;color:#fff;border-radius:12px;padding:12px;font:13px system-ui,sans-serif;display:none;width:min(92vw,340px)';
  const STY = [['bongo', 'Bongo Flava'], ['taarab', 'Taarab'], ['injili', 'Injili'], ['rumba', 'Rumba'], ['reggae', 'Reggae']];
  pn.innerHTML = '<b>Muziki wa abiria</b><div style="display:flex;gap:6px;flex-wrap:wrap;margin:8px 0">' + STY.map(s => '<button data-m="' + s[0] + '" style="padding:8px 10px;border-radius:8px;border:0">' + s[1] + '</button>').join('') + '<button data-m="off" style="padding:8px 10px;border-radius:8px;border:0;background:#f5c518;font-weight:700">Zima</button></div><div>Sauti: <input id="muv" type="range" min="0" max="1" step=".05" value=".5" style="width:170px"></div><div style="margin:8px 0">Muziki wako: <input id="muf" type="file" accept="audio/*" style="max-width:200px"></div><div id="mus" style="color:#8ef0a0;min-height:16px"></div><button id="muc" style="padding:8px 12px;border-radius:8px;border:0">Funga</button>';
  document.body.appendChild(pn);
  const st = t => pn.querySelector('#mus').textContent = t;
  function ctx() { if (!AC) { AC = new (window.AudioContext || window.webkitAudioContext)(); master = AC.createGain(); master.gain.value = vol * .6; master.connect(AC.destination); const n = AC.sampleRate; nb = AC.createBuffer(1, n, n); const d = nb.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1 } if (AC.state == 'suspended') AC.resume() }
  const tone = (t, f, d, type, g) => { const o = AC.createOscillator(), e = AC.createGain(); o.type = type; o.frequency.value = f; e.gain.setValueAtTime(g, t); e.gain.exponentialRampToValueAtTime(.001, t + d); o.connect(e); e.connect(master); o.start(t); o.stop(t + d + .02) };
  const kick = t => { const o = AC.createOscillator(), e = AC.createGain(); o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(40, t + .12); e.gain.setValueAtTime(.9, t); e.gain.exponentialRampToValueAtTime(.001, t + .25); o.connect(e); e.connect(master); o.start(t); o.stop(t + .26) };
  const hit = (t, d, f, type, g) => { const s = AC.createBufferSource(), fl = AC.createBiquadFilter(), e = AC.createGain(); s.buffer = nb; fl.type = type; fl.frequency.value = f; e.gain.setValueAtTime(g, t); e.gain.exponentialRampToValueAtTime(.001, t + d); s.connect(fl); fl.connect(e); e.connect(master); s.start(t); s.stop(t + d + .02) };
  const snare = t => hit(t, .14, 1800, 'bandpass', .5), hat = (t, g) => hit(t, .04, 7000, 'highpass', g || .18);
  const A = [110, 123.5, 130.8, 146.8, 164.8, 174.6, 196, 220], chords = [[220, 261.6, 329.6], [174.6, 220, 261.6], [261.6, 329.6, 392], [196, 246.9, 293.7]];
  const SC = [220, 233.1, 277.2, 293.7, 329.6, 349.2, 415.3, 440, 466.2, 554.4];
  const play = {
    bongo(s, t) { const b = s % 16; if ([0, 6, 8, 13].includes(b)) kick(t); if ([4, 12].includes(b)) snare(t); if (b == 15) snare(t); if (b % 2 == 0) hat(t); const bn = [55, 0, 0, 55, 0, 0, 65.4, 0, 73.4, 0, 0, 73.4, 0, 0, 65.4, 0][b]; if (bn) tone(t, bn, .25, 'triangle', .5); if ([0, 3, 6, 8, 11, 14].includes(b)) tone(t, [440, 523.3, 659.3, 587.3][(b >> 1) % 4], .18, 'sine', .22) },
    taarab(s, t) { const b = s % 16; if ([0, 5, 8, 11].includes(b)) kick(t); if ([2, 4, 7, 10, 12, 15].includes(b)) hit(t, .06, 2200, 'bandpass', .3); if ([0, 2, 3, 6, 8, 10, 12, 14].includes(b)) { const f = SC[(s * 7 + (s >> 4) * 3) % SC.length]; tone(t, f, .35, 'sawtooth', .13); tone(t, f * 2, .2, 'sine', .08) } if (b == 0) tone(t, 110, .9, 'triangle', .4) },
    injili(s, t) { const b = s % 16, c = chords[(s >> 4) % 4]; if (b == 0) c.forEach(f => { tone(t, f, 1.6, 'sawtooth', .07); tone(t, f * 1.003, 1.6, 'sine', .1) }); if ([0, 8].includes(b)) kick(t); if ([4, 12].includes(b)) snare(t); if (b % 2 == 0) hat(t, .1); if (b == 0 || b == 8) tone(t, chords[(s >> 4) % 4][0] / 2, .5, 'triangle', .5) },
    rumba(s, t) { const b = s % 16, c = chords[(s >> 4) % 4]; if ([0, 8].includes(b)) kick(t); if ([4, 12].includes(b)) snare(t); hat(t, .08); tone(t, c[b % 3] * (b % 4 == 3 ? 2 : 1), .12, 'square', .09); if ([0, 3, 6, 10, 12].includes(b)) tone(t, c[0] / 2, .22, 'triangle', .5) },
    reggae(s, t) { const b = s % 16, c = chords[(s >> 4) % 4]; if (b == 8) { kick(t); snare(t) } if (b % 2 == 0) hat(t, .12); if ([2, 6, 10, 14].includes(b)) c.forEach(f => tone(t, f, .12, 'square', .08)); if ([0, 3, 8, 11].includes(b)) tone(t, c[0] / 2, .3, 'triangle', .55) }
  };
  const BPM = { bongo: 98, taarab: 88, injili: 80, rumba: 112, reggae: 76 };
  function sched() { while (next < AC.currentTime + .12) { play[style](step, next); next += 60 / BPM[style] / 4; step++ } }
  function stop() { if (timer) { clearInterval(timer); timer = null } style = null; if (audio) { audio.pause(); audio = null } st('') }
  function start(k) { stop(); ctx(); style = k; step = 0; next = AC.currentTime + .05; timer = setInterval(sched, 25); st('Inacheza: ' + (STY.find(s => s[0] == k) || [0, k])[1]) }
  pn.addEventListener('click', e => { const m = e.target.dataset && e.target.dataset.m; if (m) { m == 'off' ? stop() : start(m) } });
  pn.querySelector('#muv').oninput = e => { vol = parseFloat(e.target.value); if (master) master.gain.value = vol * .6; if (audio) audio.volume = vol };
  pn.querySelector('#muf').onchange = e => { const f = e.target.files[0]; if (!f) return; stop(); audio = new Audio(URL.createObjectURL(f)); audio.loop = true; audio.volume = vol; audio.play().then(() => st('Inacheza: ' + f.name)).catch(() => st('Imeshindwa kucheza faili hili')) };
  pn.querySelector('#muc').onclick = () => pn.style.display = 'none';
  return { toggle() { pn.style.display = pn.style.display == 'none' ? 'block' : 'none' }, stop, get on() { return !!(timer || audio) } };
})();
