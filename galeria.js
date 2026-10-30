// Galeria do grande ato: grade + visualizador (foto e vídeo)
const $ = (id) => document.getElementById(id);
document.querySelectorAll("[data-group]").forEach(a => a.href = CONFIG.GRUPO_WHATSAPP);

const ITENS = typeof GALERIA_ATO !== "undefined" ? GALERIA_ATO : [];
const grid = $("grid"), lb = $("lb"), stage = $("lbStage");
let atual = 0, gatilho = null;

/* ---------- Grade ---------- */
if (!ITENS.length) {
  $("vazio").hidden = false;
} else {
  const fotos = ITENS.filter(m => m.tipo !== "video").length, videos = ITENS.length - fotos;
  const partes = [];
  if (fotos) partes.push(fotos + (fotos === 1 ? " foto" : " fotos"));
  if (videos) partes.push(videos + (videos === 1 ? " vídeo" : " vídeos"));
  $("contagem").textContent = partes.join(" · ");

  ITENS.forEach((m, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "tile";
    b.setAttribute("aria-label", (m.tipo === "video" ? "Abrir vídeo " : "Abrir foto ") + (i + 1) + (m.legenda ? ": " + m.legenda : ""));
    const src = m.tipo === "video" ? m.poster : (m.thumb || m.src);
    if (src) { const img = document.createElement("img"); img.src = src; img.alt = m.legenda || ""; img.loading = "lazy"; b.appendChild(img); }
    if (m.tipo === "video") {
      const p = document.createElement("span"); p.className = "play";
      p.innerHTML = '<svg class="ico"><use href="#i-play"/></svg>'; b.appendChild(p);
    }
    b.addEventListener("click", () => abrir(i, b));
    grid.appendChild(b);
  });
}

/* ---------- Visualizador ---------- */
function mostrar() {
  stage.querySelectorAll("video").forEach(v => v.pause());
  stage.textContent = "";
  const m = ITENS[atual];
  let el;
  if (m.tipo === "video") {
    el = document.createElement("video");
    el.src = m.src; el.controls = true; el.autoplay = true; el.playsInline = true; el.preload = "metadata";
    if (m.poster) el.poster = m.poster;
  } else {
    el = document.createElement("img"); el.src = m.src; el.alt = m.legenda || "Foto do grande ato";
  }
  stage.appendChild(el);
  const cap = [m.legenda, m.autor ? (m.tipo === "video" ? "Vídeo: " : "Foto: ") + m.autor : ""].filter(Boolean).join(" · ");
  $("lbCap").textContent = (cap ? cap + "  ·  " : "") + (atual + 1) + " / " + ITENS.length;
  const varios = ITENS.length > 1;
  $("lbPrev").hidden = $("lbNext").hidden = !varios;
}
function abrir(i, origem) {
  atual = i; gatilho = origem || null;
  lb.hidden = false; document.body.classList.add("lb-open");
  mostrar(); $("lbClose").focus();
}
function fechar() {
  stage.querySelectorAll("video").forEach(v => v.pause());
  stage.textContent = ""; lb.hidden = true; document.body.classList.remove("lb-open");
  if (location.hash.startsWith("#item-")) history.replaceState(null, "", location.pathname);
  if (gatilho) gatilho.focus();
}
function ir(d) { atual = (atual + d + ITENS.length) % ITENS.length; mostrar(); }

$("lbClose").addEventListener("click", fechar);
$("lbPrev").addEventListener("click", () => ir(-1));
$("lbNext").addEventListener("click", () => ir(1));
lb.addEventListener("click", (e) => { if (e.target === lb || e.target === stage) fechar(); });
document.addEventListener("keydown", (e) => {
  if (lb.hidden) return;
  if (e.key === "Escape") fechar();
  else if (e.key === "ArrowLeft") ir(-1);
  else if (e.key === "ArrowRight") ir(1);
});
let x0 = null;
lb.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
lb.addEventListener("touchend", (e) => {
  if (x0 === null) return;
  const dx = e.changedTouches[0].clientX - x0; x0 = null;
  if (Math.abs(dx) > 60) ir(dx < 0 ? 1 : -1);
});

// Link direto vindo da página principal: galeria.html#item-3
const h = location.hash.match(/^#item-(\d+)$/);
if (h && ITENS[Number(h[1]) - 1]) abrir(Number(h[1]) - 1, null);
