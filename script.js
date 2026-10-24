const $ = (id) => document.getElementById(id);
const KEY = "camila-regina-eu-vou";
const fill = (name, html) => document.querySelectorAll('[data-fill="' + name + '"]').forEach(el => el.innerHTML = html);

// Data e horário (a confirmar ou definidos)
fill("data", CONFIG.DATA ? CONFIG.DATA
  : '<span class="tbc">A confirmar</span><small>' + CONFIG.DATA_PREVISTA + '</small>');
fill("horario", CONFIG.HORARIO ? CONFIG.HORARIO
  : '<span class="tbc">A confirmar</span><small>' + CONFIG.HORARIO_PREVISTO + '</small>');
fill("data-curta", CONFIG.DATA ? CONFIG.DATA_CURTA + (CONFIG.HORARIO ? " · " + CONFIG.HORARIO : "") : CONFIG.DATA_CURTA + " (a confirmar)");
fill("data-curta-tl", CONFIG.DATA ? CONFIG.DATA_CURTA : CONFIG.DATA_CURTA + " (previsão)");

$("maplink").href = CONFIG.MAPA;
document.querySelectorAll("[data-group]").forEach(a => a.href = CONFIG.GRUPO_WHATSAPP);

// Compartilhar
const pageUrl = location.href.split("#")[0];
$("waShare").href = "https://wa.me/?text=" + encodeURIComponent(CONFIG.TEXTO_COMPARTILHAR + " " + pageUrl);
$("copyBtn").addEventListener("click", async () => {
  const label = $("copyBtn").querySelector("span");
  try { await navigator.clipboard.writeText(pageUrl); label.textContent = "Link copiado"; setTimeout(() => label.textContent = "Copiar link", 2500); }
  catch { prompt("Copie o link:", pageUrl); }
});

// Animação ao rolar
const io = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, { threshold: 0.12 }) : null;
document.querySelectorAll(".reveal").forEach(el => io ? io.observe(el) : el.classList.add("in"));

// Contador "Eu vou"
function jaConfirmou(){ try { return localStorage.getItem(KEY) === "1"; } catch { return false; } }
function marcar(v){ try { v ? localStorage.setItem(KEY,"1") : localStorage.removeItem(KEY); } catch {} }

let count = 0;
const demo = !CONFIG.SCRIPT_URL;
if (demo) $("demoNote").hidden = false;

function render(){
  $("count").textContent = count.toLocaleString("pt-BR");
  $("countLabel").textContent = count === 1 ? "pessoa confirmou presença" : "pessoas confirmaram presença";
  const done = jaConfirmou();
  $("goBtn").innerHTML = done ? '<svg class="ico"><use href="#i-check"/></svg> Presença confirmada' : "Eu vou";
  $("goBtn").classList.toggle("done", done);
  $("goBtn").disabled = done;
  $("undoBtn").hidden = !done;
}

async function call(action){
  if (demo) {
    if (action === "add") count++;
    if (action === "remove") count = Math.max(0, count - 1);
    return count;
  }
  const r = await fetch(CONFIG.SCRIPT_URL + "?action=" + action + "&t=" + Date.now());
  const j = await r.json();
  if (!j.ok) throw new Error("erro");
  return j.count;
}

async function load(){
  render();
  $("count").textContent = "–";
  try { count = await call("count"); render(); } catch {}
}

$("goBtn").addEventListener("click", async () => {
  if (jaConfirmou()) return;
  $("goBtn").disabled = true; $("goBtn").textContent = "Confirmando…";
  try { count = await call("add"); marcar(true); }
  catch { alert("Não foi possível confirmar agora. Tente de novo em instantes."); }
  render();
});

$("undoBtn").addEventListener("click", async () => {
  try { count = await call("remove"); marcar(false); } catch {}
  render();
});

load();
