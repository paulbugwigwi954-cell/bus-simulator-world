// Tiketi na viti vya abiria: ramani ya viti (bonyeza T), tiketi ya kila abiria, na malalamiko.
window.TK = (function () {
  const el = document.createElement('div'); el.id = 'tk';
  el.style.cssText = 'position:fixed;left:50%;top:64px;transform:translateX(-50%);z-index:4;background:#0b1118ee;color:#fff;border-radius:12px;padding:10px;font:13px system-ui,sans-serif;display:none;max-width:92vw;max-height:70vh;overflow:auto';
  document.body.appendChild(el);
  const COL = ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5', '#8e24aa'], esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  let open = false, pick = -1, last = null;
  function draw() {
    if (!open || !last) return; const S = last[0], BS = last[1], STOPS = last[2];
    let h = '<b>Tiketi na viti</b> · Furaha ya abiria: <b>' + Math.round(S.sat) + '%</b><div style="display:grid;grid-template-columns:repeat(5,24px);gap:3px;margin:8px 0">';
    for (let i = 0; i < BS.pax; i++) { const q = S.seats[i]; if (i % 4 == 2) h += '<span></span>'; h += '<div data-s="' + i + '" style="height:24px;border-radius:5px;font-size:9px;line-height:24px;text-align:center;cursor:pointer;color:#000;background:' + (q ? COL[q.to % COL.length] : '#2b3642') + ';outline:' + (i === pick ? '2px solid #fff' : 'none') + '">' + (i + 1) + '</div>' }
    h += '</div>';
    const q = pick >= 0 ? S.seats[pick] : null;
    h += '<div>' + (pick < 0 ? 'Bonyeza kiti kuona tiketi.' : q ? 'Kiti ' + (pick + 1) + ' → <b>' + esc(STOPS[q.to].n) + '</b> · nauli ' + Math.round(q.fare).toLocaleString('en-US') + ' · mizigo ' + q.bags : 'Kiti ' + (pick + 1) + ' ki wazi') + '</div>';
    h += '<div style="margin-top:6px">' + STOPS.slice(1).map((p, i) => '<span style="display:inline-block;width:10px;height:10px;background:' + COL[(i + 1) % COL.length] + ';margin:0 4px 0 8px"></span>' + esc(p.n)).join('') + '</div>';
    if (S.log && S.log.length) h += '<div style="margin-top:8px;color:#ffb4a8"><b>Malalamiko:</b><br>' + S.log.map(esc).join('<br>') + '</div>';
    el.innerHTML = h;
  }
  el.addEventListener('click', e => { const s = e.target.dataset && e.target.dataset.s; if (s != null && s !== '') { pick = +s; draw() } });
  return { toggle() { open = !open; el.style.display = open ? 'block' : 'none'; draw() }, render(S, BS, STOPS) { last = [S, BS, STOPS]; draw() }, get open() { return open } };
})();
