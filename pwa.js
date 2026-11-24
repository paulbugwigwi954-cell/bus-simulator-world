// PWA: usajili wa service worker, kitufe cha "Weka kwenye simu", na skrini nzima/landscape wakati wa kuanza safari.
(function () {
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1'))
    addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist() } catch (e) {}   // simu isifute kuingia/akiba bila ruhusa
  const standalone = () => (matchMedia && matchMedia('(display-mode: standalone)').matches) || (matchMedia && matchMedia('(display-mode: fullscreen)').matches) || navigator.standalone;
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  let dp = null, btn = null;
  function show() {
    if (btn || standalone()) return; const box = document.querySelector('#ov > div'); if (!box) return;
    const p = document.createElement('p'); btn = document.createElement('button'); btn.className = 's'; btn.textContent = '📲 Weka kwenye simu (App)';
    btn.onclick = async () => {
      if (dp) { dp.prompt(); try { await dp.userChoice } catch (e) {} dp = null; hide() }
      else alert(ios ? 'iPhone/iPad: bonyeza kitufe cha Shiriki (mraba wenye mshale wa juu) kisha chagua "Ongeza kwenye Skrini ya Kwanza".' : 'Fungua menyu ya kivinjari (⋮) kisha chagua "Install app" au "Ongeza kwenye skrini ya kwanza".');
    };
    p.appendChild(btn); box.appendChild(p);
  }
  function hide() { if (btn && btn.parentNode) btn.parentNode.remove(); btn = null }
  addEventListener('beforeinstallprompt', e => { e.preventDefault(); dp = e; show() });
  addEventListener('appinstalled', hide);
  if (ios || !('onbeforeinstallprompt' in window)) addEventListener('load', () => setTimeout(show, 600));
  // skrini nzima na landscape kwenye simu unapobonyeza Anza
  const go = document.getElementById('go');
  if (go) go.addEventListener('click', () => {
    try { if (/android|iphone|ipad|ipod/i.test(navigator.userAgent) && !document.fullscreenElement && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().then(() => screen.orientation && screen.orientation.lock && screen.orientation.lock('landscape').catch(() => {})).catch(() => {}) } catch (e) {}
  });
})();
