import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

const ok = !SUPABASE_URL.includes("YOUR-PROJECT");
const db = ok ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const ROUTE = "dar-dodoma";

window.submitScore = async function (r) {
  const box = document.getElementById("lb");
  if (!box) return;
  if (!db) { box.innerHTML = "<p>Leaderboard haijawashwa (weka config.js).</p>"; return; }
  box.innerHTML = "<p>Inahifadhi alama...</p>";
  const name = (document.getElementById("nm")?.value || "Dereva").trim().slice(0, 20) || "Dereva";
  const ins = await db.from("scores").insert({ name, route: ROUTE, money: r.money, crashes: r.crashes, secs: r.secs, stars: r.stars });
  const { data, error } = await db.from("scores").select("name,money,stars,crashes").eq("route", ROUTE).order("money", { ascending: false }).limit(10);
  if (error || !data) { box.innerHTML = "<p>Imeshindwa kupakia leaderboard.</p>"; return; }
  box.innerHTML = "<p><b>Madereva bora: Dar–Dodoma</b>" + (ins.error ? " (alama yako haikuhifadhiwa)" : "") + "</p><ol style='text-align:left;font-size:14px'>" +
    data.map(x => `<li>${esc(x.name)}: TZS ${x.money.toLocaleString("en-US")} · ${"★".repeat(x.stars)}</li>`).join("") + "</ol>";
};
