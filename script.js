const $ = (id) => document.getElementById(id);

document.querySelectorAll("[data-group]").forEach(a => a.href = CONFIG.GRUPO_WHATSAPP);

// Links configuráveis: esconde se estiver vazio
document.querySelectorAll("[data-link]").forEach(a => {
  const url = CONFIG[a.dataset.link];
  if (url && /^https:\/\//.test(url)) a.href = url; else a.hidden = true;
});

// Próximo grande ato
(function () {
  const p = typeof CONFIG.PROXIMO_ATO === "object" ? CONFIG.PROXIMO_ATO : null;
  if (!p || !p.quando) return;
  $("proxQuando").textContent = p.quando;
  const ul = $("proxRota");
  (p.pontos || []).forEach(pt => {
    const li = document.createElement("li");
    const d = document.createElement("div");
    const st = document.createElement("strong"); st.textContent = pt.titulo || "";
    d.appendChild(st);
    if (pt.detalhe) { const sm = document.createElement("small"); sm.textContent = pt.detalhe; d.appendChild(sm); }
    if (pt.mapa && /^https:\/\//.test(pt.mapa)) { const a = document.createElement("a"); a.href = pt.mapa; a.target = "_blank"; a.rel = "noopener"; a.textContent = "Ver no mapa"; d.appendChild(a); }
    li.appendChild(d); ul.appendChild(li);
  });
  if (p.levar) $("proxLevar").textContent = p.levar; else $("proxLevar").hidden = true;
  $("proximo").hidden = false; $("chipProx").hidden = false;
  $("semProximo").hidden = true; $("comProximo").hidden = false;
})();

// Compartilhar
const pageUrl = location.href.split("#")[0];
$("waShare").href = "https://wa.me/?text=" + encodeURIComponent(CONFIG.TEXTO_COMPARTILHAR + " " + pageUrl);
$("regShare").href = "https://wa.me/?text=" + encodeURIComponent(CONFIG.TEXTO_REGINALDO + " " + pageUrl + "#reginaldo");
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

// Prévia da galeria do ato (até 6 itens)
(function () {
  const itens = typeof GALERIA_ATOS !== "undefined" ? GALERIA_ATOS.flatMap(a => a.itens) : [];
  if (!itens.length) return;
  const box = $("atoPreview");
  const MAX = 6;
  itens.slice(0, MAX).forEach((m, i) => {
    const a = document.createElement("a");
    a.className = "tile"; a.href = "galeria.html#item-" + (i + 1);
    a.setAttribute("aria-label", (m.tipo === "video" ? "Abrir vídeo " : "Abrir foto ") + (i + 1) + " do ato");
    const src = m.tipo === "video" ? m.poster : (m.thumb || m.src);
    if (src) { const img = document.createElement("img"); img.src = src; img.alt = m.legenda || ""; img.loading = "lazy"; a.appendChild(img); }
    if (m.tipo === "video") {
      const p = document.createElement("span"); p.className = "play";
      p.innerHTML = '<svg class="ico"><use href="#i-play"/></svg>'; a.appendChild(p);
    }
    if (i === MAX - 1 && itens.length > MAX) {
      const more = document.createElement("span"); more.className = "more"; more.textContent = "+" + (itens.length - MAX); a.appendChild(more);
    }
    box.appendChild(a);
  });
  box.hidden = false; $("atoCta").hidden = false; $("atoVazio").hidden = true;
})();

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
