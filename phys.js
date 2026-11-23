// Fizikia ya basi: usukani huru (bicycle model), mteremko wa milima, aina ya barabara (lami, vumbi, nje ya barabara).
window.PHYS = (function () {
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function step(S, inp, env, dt) {
    const BS = env.BS, sf = env.surface(S.s, S.d), av = Math.abs(S.v), sg = Math.sign(S.v), thr = inp.thr && S.fuel > 0;
    const fx = -Math.sin(S.psi), fz = -Math.cos(S.psi), hh = BS.len / 2 - 1.5;
    const slope = (env.H(S.x + fx * hh, S.z + fz * hh) - env.H(S.x - fx * hh, S.z - fz * hh)) / (2 * hh); S.slope = slope;
    const tq = inp.tq == null ? 1 : inp.tq;
    let a = 0; if (thr) a = S.rev ? -Math.max(0, 2.2 - av * .4) : tq > 0 ? Math.max(0, BS.acc * (1 - .15 * S.cargo / BS.cargo) * tq - S.v * .14) : 0;
    if (!S.rev && S.v > 0.5) { if (inp.cap != null && S.v > inp.cap) a -= (S.v - inp.cap) * 1.2 + 1.5; if (!thr && inp.eb) a -= inp.eb }
    if (inp.brake) a -= sg * (12 - 4 * S.wx);
    a -= sg * (.02 * av + sf.drag * av + (av > .05 ? .3 : 0)); const gr = 9.8 * slope * .7; a -= gr;
    let v2 = S.v + a * dt; if (sg !== 0 && Math.sign(v2) !== sg && !thr && Math.abs(gr) < .6) v2 = 0;
    S.v = clamp(v2, -6, BS.vmax * (1 - S.dmg / 250));
    const maxD = Math.min(.52, Math.atan(26 / (S.v * S.v + 1))), target = clamp(inp.steer, -1, 1) * maxD;
    S.delta += (target - S.delta) * Math.min(1, dt * (inp.rate || 6));
    S.psi += -(S.v / 6.2) * Math.tan(S.delta) * sf.grip * (1 - .2 * S.wx) * dt;
    const f2x = -Math.sin(S.psi), f2z = -Math.cos(S.psi); S.x += f2x * S.v * dt; S.z += f2z * S.v * dt;
    S.s = -S.z; S.d = S.x - env.cx(S.s);
    S.fuel = Math.max(0, S.fuel - Math.abs(S.v) * dt * BS.fuel * (1 + .12 * S.cargo / BS.cargo) * (1 + Math.max(0, slope) * 6));
    S.surf = sf.kind; S.rough = sf.rough;
  }
  return { step };
})();
