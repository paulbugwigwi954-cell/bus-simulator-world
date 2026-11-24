import { db } from './supabase.js';
const G = window.GAME, BUSES = G.BUSES;
const $ = s => document.querySelector(s), fmt = n => Math.round(n).toLocaleString('en-US');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const hx = n => '#' + n.toString(16).padStart(6, '0'), num = h => parseInt(h.slice(1), 16);
const TR = { 'not enough cash': 'Pesa hazitoshi.', 'garage full': 'Garage imejaa (mabasi 8).', 'loan limit': 'Umefikia kikomo cha mkopo.', 'too fast': 'Subiri dakika moja kati ya safari.', 'bus not found': 'Basi halijapatikana.', 'bad livery': 'Rangi au jina si sahihi (herufi na namba, hadi 16).', 'bad amount': 'Kiasi si sahihi.' };
const tr = m => TR[m] || m;
let profile, garage = [], sel = null, trip = null, editing = null;
const LS = { get: k => { try { return JSON.parse(localStorage.getItem(k)) } catch (e) { return null } }, set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) {} } };
const timeout = (p, ms) => Promise.race([p, new Promise((_, rj) => setTimeout(() => rj(new Error('timeout')), ms))]);
const splash = t => { cm.style.display = 'flex'; cm.innerHTML = '<div class="box"><h2>Safari ya Mkoani</h2><p>' + esc(t) + '</p></div>' };
const snap = () => { if (profile) LS.set('safari-cache', { name: profile.name, cash: profile.cash, xp: profile.xp, trips: profile.trips, loan: profile.loan, sel, garage: garage.map(b => ({ id: b.id, model: b.model, condition: b.condition, livery: b.livery })) }) };

const cm = document.createElement('div'); cm.id = 'cm';
cm.style.cssText = 'position:fixed;inset:0;z-index:5;background:#0007;color:#fff;display:flex;align-items:flex-end;justify-content:center;padding:10px;font:14px system-ui,sans-serif';
const st = document.createElement('style');
st.textContent = '#cm .box{max-width:520px;width:100%;max-height:78vh;overflow:auto;background:#10161df2;border-radius:14px;padding:14px;box-sizing:border-box}#cm button,#cm select,#cm input{padding:9px 12px;border-radius:8px;border:0;font-size:14px}#cm button{background:#f5c518;font-weight:700;cursor:pointer}#cm button.s{background:#2b3642;color:#fff}#cm input,#cm select{background:#fff;color:#000;margin:3px 0;width:100%;box-sizing:border-box}#cm input[type=color]{width:60px;padding:0;height:34px}#cm .row{display:flex;gap:8px;align-items:center;justify-content:space-between;background:#1b2530;border-radius:10px;padding:8px 10px;margin:6px 0}#cm h2{margin:0 0 6px;color:#f5c518}#cm .m{color:#ffb4a8;min-height:18px;margin:6px 0}#cm .bt{display:flex;gap:8px;flex-wrap:wrap}';
document.head.appendChild(st);

function lvOf(b) { const m = BUSES[b.model], l = b.livery || {}; return { col: l.col || hx(m.col), c1: l.c1 || hx(m.stripes[0][0]), c2: l.c2 || hx(m.stripes[1][0]), brand: l.brand || m.brand } }
function busOf(b, l) { l = l || lvOf(b); const m = BUSES[b.model]; return Object.assign({}, m, { col: num(l.col), stripes: [[num(l.c1), m.stripes[0][1], m.stripes[0][2]], [num(l.c2), m.stripes[1][1], m.stripes[1][2]]], brand: l.brand || m.brand }) }
function applySel() { const b = garage.find(x => x.id === sel); if (b) G.setBus(busOf(b)) }
async function loadGarage() { const r = await db.from('garage').select('*').order('created_at'); garage = r.data || []; if (!garage.some(b => b.id === sel)) sel = garage.length ? garage[0].id : null; applySel() }

function login(err) {
  cm.style.display = 'flex';
  setTimeout(() => { const e = LS.get('safari-email'), f = $('#em'); if (e && f && !f.value) f.value = e }, 0);
  cm.innerHTML = '<div class="box"><h2>Safari ya Mkoani</h2><p>Ingia ili kuhifadhi maendeleo, kununua mabasi na kupanda ngazi.</p><input id="em" type="email" placeholder="Barua pepe" autocomplete="email"><input id="pw" type="password" placeholder="Nenosiri (angalau 6)" autocomplete="current-password"><input id="nn" maxlength="20" placeholder="Jina la kuonyesha (unapojisajili)"><p class="m">' + esc(err || '') + '</p><div class="bt"><button data-a="li">Ingia</button><button data-a="su">Jisajili</button><button class="s" data-a="fd">Free drive (bila akaunti)</button></div></div>';
}
function home(t) {
  snap();
  const b = garage.find(x => x.id === sel), lvl = 1 + Math.floor(profile.xp / 500);
  cm.innerHTML = '<div class="box"><h2>' + esc(profile.name) + ' · Kiwango ' + lvl + '</h2><div class="row"><span>Pesa</span><b>TZS ' + fmt(profile.cash) + '</b></div><div class="row"><span>Deni (mkopo)</span><b>TZS ' + fmt(profile.loan) + '</b></div><div class="row"><span>Safari zilizokamilika</span><b>' + profile.trips + '</b></div><p>Njia: <b>' + esc(G.RT.name) + '</b> · ' + G.RT.km + ' km <button class="s" data-a="map">Ramani</button></p><p>Basi: <b>' + (b ? esc(BUSES[b.model].name) + ' (hali ' + b.condition + '%)' : 'huna') + '</b></p><p class="m">' + esc(t || '') + '</p><div class="bt"><button data-a="go2">Anza safari</button><button class="s" data-a="gr">Garage</button><button class="s" data-a="ln">Mkopo</button><button class="s" data-a="lo">Toka</button></div></div>';
}
function garageView(t) {
  const rows = garage.map(b => { const m = BUSES[b.model], l = lvOf(b), cost = (100 - b.condition) * 30000;
    return '<div class="row"><span><b>' + esc(m.name) + '</b> · ' + esc(l.brand) + '<br>Hali ' + b.condition + '%' + (b.id === sel ? ' · imechaguliwa' : '') + '</span><span class="bt">' + (b.id === sel ? '' : '<button class="s" data-a="sel" data-i="' + b.id + '">Chagua</button>') + (b.condition < 100 ? '<button class="s" data-a="rep" data-i="' + b.id + '">Rekebisha ' + fmt(cost) + '</button>' : '') + '<button class="s" data-a="liv" data-i="' + b.id + '">Rangi</button></span></div>' }).join('');
  const shop = Object.keys(BUSES).map(k => '<div class="row"><span><b>' + esc(BUSES[k].name) + '</b><br>TZS ' + fmt(BUSES[k].price) + '</span><button data-a="buy" data-i="' + k + '">Nunua</button></div>').join('');
  cm.innerHTML = '<div class="box"><h2>Garage</h2><p>Pesa: <b>TZS ' + fmt(profile.cash) + '</b></p>' + rows + '<h2 style="margin-top:12px">Duka la mabasi</h2>' + shop + '<p class="m">' + esc(t || '') + '</p><button class="s" data-a="hm">Rudi</button></div>';
}
function edit(id) {
  const b = garage.find(x => x.id === id), l = lvOf(b); sel = id; editing = id; applySel();
  cm.innerHTML = '<div class="box"><h2>Rangi na jina</h2><div class="row"><span>Mwili</span><input type="color" data-l="col" value="' + l.col + '"></div><div class="row"><span>Mstari 1</span><input type="color" data-l="c1" value="' + l.c1 + '"></div><div class="row"><span>Mstari 2</span><input type="color" data-l="c2" value="' + l.c2 + '"></div><input data-l="brand" maxlength="16" value="' + esc(l.brand) + '" placeholder="Jina la kampuni (hadi 16)"><p class="m"></p><div class="bt"><button data-a="sv">Hifadhi</button><button class="s" data-a="gr">Rudi</button></div></div>';
}
const curLv = () => { const g = k => cm.querySelector('[data-l=' + k + ']').value; return { col: g('col'), c1: g('c1'), c2: g('c2'), brand: g('brand').toUpperCase() } };
function loanView(t) {
  cm.innerHTML = '<div class="box"><h2>Mkopo</h2><p>Pesa: <b>TZS ' + fmt(profile.cash) + '</b><br>Deni: <b>TZS ' + fmt(profile.loan) + '</b></p><p>Mkopo unaongezwa riba ya 10%. Kikomo cha deni: TZS 5,500,000.</p><div class="bt"><button data-a="kopa" data-i="1000000">Kopa 1,000,000</button><button data-a="kopa" data-i="3000000">Kopa 3,000,000</button><button class="s" data-a="lipa" data-i="1000000">Lipa 1,000,000</button><button class="s" data-a="lipa" data-i="5500000">Lipa yote</button></div><p class="m">' + esc(t || '') + '</p><button class="s" data-a="hm">Rudi</button></div>';
}
const sendTrip = (bus, r) => db.rpc('finish_trip', { p_bus: bus, p_route: r.route, p_cur: r.cur, p_money: r.money, p_secs: r.secs, p_crashes: r.crashes, p_dmg: r.dmg, p_stars: r.stars, p_km: r.km });
function offlineFinish(r) {
  const box = document.getElementById('lb'), q = LS.get('safari-pend') || []; q.push({ bus: trip && trip.bus, r }); LS.set('safari-pend', q.slice(-5));
  if (box) box.innerHTML = '<p><b>Uko bila mtandao.</b> Safari imehifadhiwa kwenye simu na itatumwa (pesa na kiwango) utakapofungua mchezo ukiwa na mtandao.</p>';
}
async function finish(r) {
  if (!navigator.onLine) return offlineFinish(r);
  const box = document.getElementById('lb'); if (box) box.innerHTML = '<div id="cr">Inahifadhi safari...</div><div id="lb2"></div>';
  let x; try { x = await timeout(sendTrip(trip && trip.bus, r), 15000) } catch (e) { return offlineFinish(r) }
  const cr = document.getElementById('cr');
  if (cr) cr.innerHTML = x.error ? 'Imeshindwa kuhifadhi safari: ' + esc(tr(x.error.message)) : '<b>Mapato ya safari: TZS ' + fmt(x.data.net) + '</b><br>Pesa yako: TZS ' + fmt(x.data.cash) + ' · Kiwango ' + x.data.level + ' · Hali ya basi ' + x.data.condition + '%';
  if (window.submitScore) window.submitScore(Object.assign({}, r, { box: document.getElementById('lb2') }));
}
async function rpc(fn, args) { const r = await db.rpc(fn, args); if (r.error) return { err: tr(r.error.message) }; return { data: r.data } }

async function act(a, i) {
  if (a === 'li' || a === 'su') {
    const email = $('#em').value.trim(), password = $('#pw').value, name = $('#nn').value.trim();
    if (name) try { localStorage.setItem('nm', name) } catch (e) {}
    LS.set('safari-email', email);
    const r = a === 'li' ? await db.auth.signInWithPassword({ email, password }) : await db.auth.signUp({ email, password, options: { emailRedirectTo: location.origin + location.pathname } });
    if (r.error) return login(r.error.message);
    if (!r.data.session) return login('Angalia barua pepe ili kuthibitisha akaunti, kisha bonyeza Ingia.');
    return boot();
  }
  if (a === 'map') return MAP.open();
  if (a === 'retry') return boot();
  if (a === 'go0') return offlineGo();
  if (a === 'fd') return cm.remove();
  if (a === 'lo') { await db.auth.signOut(); return location.reload() }
  if (a === 'hm') return home();
  if (a === 'gr') { await loadGarage(); return garageView() }
  if (a === 'ln') return loanView();
  if (a === 'sel') { sel = i; applySel(); return garageView() }
  if (a === 'liv') return edit(i);
  if (a === 'sv') { const r = await rpc('set_livery', { p_bus: editing, p_livery: curLv() }); if (r.err) return garageView(r.err); await loadGarage(); return garageView('Rangi zimehifadhiwa.') }
  if (a === 'rep') { const r = await rpc('repair_bus', { p_bus: i }); if (r.err) return garageView(r.err); profile = r.data; await loadGarage(); return garageView('Basi limerekebishwa.') }
  if (a === 'buy') { const r = await rpc('buy_bus', { p_model: i }); if (r.err) return garageView(r.err); profile = r.data; await loadGarage(); return garageView('Umenunua basi jipya!') }
  if (a === 'kopa' || a === 'lipa') { const r = await rpc(a === 'kopa' ? 'take_loan' : 'repay_loan', { p_amount: Number(i) }); if (r.err) return loanView(r.err); profile = r.data; return loanView(a === 'kopa' ? 'Mkopo umetolewa.' : 'Malipo yamepokelewa.') }
  if (a === 'go2') {
    const b = garage.find(x => x.id === sel);
    if (!b) return home('Huna basi.');
    if (b.condition < 20) return home('Basi limeharibika sana (chini ya 20%). Rekebisha kwenye Garage.');
    trip = { bus: b.id }; applySel(); cm.style.display = 'none'; G.begin({ dmg: 100 - b.condition, baseTzs: profile.cash });
  }
}
function offlineHome(t) {
  const k = LS.get('safari-cache'); if (!k) return login('Hakuna mtandao. Unaweza kucheza Free drive.');
  const pend = (LS.get('safari-pend') || []).length;
  cm.style.display = 'flex'; cm.innerHTML = '<div class="box"><h2>' + esc(k.name) + ' · Bila mtandao</h2><p>Unaweza kucheza sasa hivi. Safari yako itahifadhiwa na kutumwa ukipata mtandao.</p><div class="row"><span>Pesa (ya mwisho kuhifadhiwa)</span><b>TZS ' + fmt(k.cash) + '</b></div>' + (pend ? '<p class="m">Safari ' + pend + ' zinasubiri kutumwa.</p>' : '') + '<p class="m">' + esc(t || '') + '</p><div class="bt"><button data-a="go0">Anza safari (bila mtandao)</button><button class="s" data-a="map">Ramani</button><button class="s" data-a="retry">Jaribu kuunganisha</button><button class="s" data-a="fd">Free drive</button></div></div>';
}
function offlineGo() {
  const k = LS.get('safari-cache'); if (!k || !k.garage || !k.garage.length) return offlineHome('Hakuna basi lililohifadhiwa. Tumia Free drive.');
  garage = k.garage; sel = garage.some(b => b.id === k.sel) ? k.sel : garage[0].id; const b = garage.find(x => x.id === sel);
  if (b.condition < 20) return offlineHome('Basi limeharibika sana (chini ya 20%). Rekebisha ukiwa na mtandao.');
  applySel(); trip = { bus: b.id }; window.careerFinish = finish; cm.style.display = 'none'; G.begin({ dmg: 100 - b.condition, baseTzs: k.cash });
}
async function syncPending() {
  const q = LS.get('safari-pend') || []; if (!q.length) return '';
  const x = await sendTrip(q[0].bus, q[0].r);
  if (!x.error || /bad |not found|no profile/.test(x.error.message)) { q.shift(); LS.set('safari-pend', q); return x.error ? '' : 'Safari ya offline imetumwa (mapato TZS ' + fmt(x.data.net) + ').' + (q.length ? ' Zimebaki ' + q.length + '.' : '') }
  return 'Safari ' + q.length + ' za offline zinasubiri (' + tr(x.error.message) + ').';
}
async function boot() {
  splash('Inapakia...');
  let ses = null, netErr = false;
  try { ses = (await timeout(db.auth.getSession(), 8000)).data.session } catch (e) { netErr = true }
  if (!ses) { if ((netErr || !navigator.onLine) && LS.get('safari-cache')) return offlineHome(); return login(!navigator.onLine ? 'Hakuna mtandao. Unaweza kucheza Free drive.' : ''); }
  let nm = ''; try { nm = localStorage.getItem('nm') || '' } catch (e) {}
  let r; try { r = await timeout(rpc('ensure_profile', { p_name: nm || ses.user.email.split('@')[0] }), 10000) } catch (e) { r = { err: 'network' } }
  if (r.err) { if ((!navigator.onLine || /network|fetch|timeout/i.test(r.err)) && LS.get('safari-cache')) return offlineHome(); return login(r.err) }
  profile = r.data; try { localStorage.setItem('nm', profile.name) } catch (e) {}
  window.careerFinish = finish;
  await loadGarage(); let note = ''; try { note = await syncPending(); if (note) { const p = await rpc('ensure_profile', { p_name: profile.name }); if (!p.err) profile = p.data; await loadGarage() } } catch (e) {}
  home(note);
}
if (db) {
  document.body.appendChild(cm);
  cm.addEventListener('click', e => { const t = e.target.closest('[data-a]'); if (t) act(t.dataset.a, t.dataset.i).catch(err => console.error(err)) });
  cm.addEventListener('input', e => { if (e.target.dataset && e.target.dataset.l) { const b = garage.find(x => x.id === editing); if (b) G.setBus(busOf(b, curLv())) } });
  boot().catch(err => { console.error(err); LS.get('safari-cache') ? offlineHome() : login('Imeshindwa kuunganisha. Jaribu tena au tumia Free drive.') });
}
