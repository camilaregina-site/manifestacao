const $ = (id) => document.getElementById(id);
const KEY = "camila-regina-eu-vou";

// Esconde avisos com data de validade vencida (ex.: o ato de hoje)
document.querySelectorAll("[data-until]").forEach(el => {
  if (Date.now() > new Date(el.dataset.until).getTime()) el.remove();
});

document.querySelectorAll(".maplink").forEach(a => a.href = CONFIG.MAPA);
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
  $("countLabel").textContent = count === 1 ? "pessoa confirmou presença nos atos" : "pessoas confirmaram presença nos atos";
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

// Prévia das memórias aprovadas (até 3)
(async () => {
  const box = $("memPreview");
  if (!box || !CONFIG.SCRIPT_URL) return;
  try {
    const r = await fetch(CONFIG.SCRIPT_URL + "?action=memorias&t=" + Date.now());
    const j = await r.json();
    (j.items || []).slice(0, 3).forEach(m => {
      const fig = document.createElement("figure"); fig.className = "mem";
      if (m.foto) { const img = document.createElement("img"); img.src = m.foto; img.loading = "lazy"; img.alt = "Foto de Camila Regina"; img.referrerPolicy = "no-referrer"; img.onerror = () => img.remove(); fig.appendChild(img); }
      const cap = document.createElement("figcaption");
      const q = document.createElement("blockquote"); q.textContent = m.texto.length > 220 ? m.texto.slice(0, 220) + "…" : m.texto;
      const who = document.createElement("p"); who.className = "who"; who.textContent = m.nome || "Anônimo";
      cap.append(q, who); fig.appendChild(cap); box.appendChild(fig);
    });
  } catch {}
})();
