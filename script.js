const $ = (id) => document.getElementById(id);
const KEY = "camila-regina-eu-vou";

// Horário e mapa
$("horario").innerHTML = CONFIG.HORARIO
  ? CONFIG.HORARIO
  : '<span class="tbc">A confirmar</span> <small>' + CONFIG.HORARIO_PREVISTO + '</small>';
$("maplink").href = CONFIG.MAPA;

// Compartilhar
const pageUrl = location.href.split("#")[0];
$("waShare").href = "https://wa.me/?text=" + encodeURIComponent(CONFIG.TEXTO_COMPARTILHAR + " " + pageUrl);
$("copyBtn").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(pageUrl); $("copyBtn").textContent = "Link copiado"; }
  catch { prompt("Copie o link:", pageUrl); }
});

// Memória local (só neste navegador) de quem já confirmou
function jaConfirmou(){ try { return localStorage.getItem(KEY) === "1"; } catch { return false; } }
function marcar(v){ try { v ? localStorage.setItem(KEY,"1") : localStorage.removeItem(KEY); } catch {} }

let count = 0;
const demo = !CONFIG.SCRIPT_URL;
if (demo) $("demoNote").hidden = false;

function render(){
  $("count").textContent = count.toLocaleString("pt-BR");
  $("countLabel").textContent = count === 1 ? "pessoa confirmou presença" : "pessoas confirmaram presença";
  const done = jaConfirmou();
  $("goBtn").textContent = done ? "Presença confirmada ✓" : "Eu vou";
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
  try { count = await call("count"); } catch { $("count").textContent = "–"; }
  render();
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
