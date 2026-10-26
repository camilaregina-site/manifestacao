// Memórias de Camila Regina: galeria (só aprovadas) + formulário de envio
const $ = (id) => document.getElementById(id);
document.querySelectorAll("[data-group]").forEach(a => a.href = CONFIG.GRUPO_WHATSAPP);

/* ---------- Cartão de memória (usado aqui e na página principal) ---------- */
function memoriaCard(m) {
  const fig = document.createElement("figure");
  fig.className = "mem";
  if (m.foto) {
    const img = document.createElement("img");
    img.src = m.foto; img.loading = "lazy"; img.alt = "Foto de Camila Regina enviada por " + (m.nome || "uma pessoa da comunidade");
    img.referrerPolicy = "no-referrer";
    img.onerror = () => img.remove();
    fig.appendChild(img);
  }
  const cap = document.createElement("figcaption");
  const q = document.createElement("blockquote"); q.textContent = m.texto;   // textContent: nunca interpreta HTML
  const who = document.createElement("p"); who.className = "who";
  who.textContent = (m.nome ? m.nome : "Anônimo") + (m.data ? " · " + m.data : "");
  cap.append(q, who); fig.appendChild(cap);
  return fig;
}

/* ---------- Galeria ---------- */
async function carregarGaleria() {
  const box = $("galeria");
  box.innerHTML = '<p class="empty">Carregando memórias…</p>';
  try {
    const r = await fetch(CONFIG.SCRIPT_URL + "?action=memorias&t=" + Date.now());
    const j = await r.json();
    box.innerHTML = "";
    if (!j.ok) throw new Error();
    if (!j.items.length) { $("galeriaVazia").hidden = false; return; }
    j.items.forEach(m => box.appendChild(memoriaCard(m)));
  } catch {
    box.innerHTML = ""; $("galeriaErro").hidden = false;
  }
}

/* ---------- Foto: reduz no navegador antes de enviar ---------- */
let fotoBase64 = "";
function reduzirFoto(file, max = 1280, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(); };
    img.src = url;
  });
}

$("foto").addEventListener("change", async (e) => {
  const f = e.target.files[0];
  if (!f) return;
  try {
    const dataUrl = await reduzirFoto(f);
    fotoBase64 = dataUrl.split(",")[1];
    $("fotoPreview").src = dataUrl; $("fotoPreview").hidden = false;
    $("fileLabel").hidden = true; $("fotoRemove").hidden = false;
  } catch {
    msg("Não conseguimos ler essa imagem. Tente outra foto (JPG ou PNG).", true);
    e.target.value = "";
  }
});
$("fotoRemove").addEventListener("click", () => {
  fotoBase64 = ""; $("foto").value = "";
  $("fotoPreview").hidden = true; $("fileLabel").hidden = false; $("fotoRemove").hidden = true;
});

$("texto").addEventListener("input", () => $("textoCount").textContent = $("texto").value.length);

/* ---------- Envio ---------- */
function msg(text, erro) {
  const el = $("formMsg");
  el.textContent = text; el.hidden = false;
  el.classList.toggle("err", !!erro); el.classList.toggle("ok", !erro);
}

$("memForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const texto = $("texto").value.trim();
  if (texto.length < 10) return msg("Escreva um relato com pelo menos 10 caracteres.", true);
  if (!$("consent").checked) return msg("Para enviar, marque a autorização de publicação.", true);

  const btn = $("sendBtn");
  btn.disabled = true; btn.textContent = "Enviando…";
  try {
    const r = await fetch(CONFIG.SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },   // evita bloqueio de CORS
      body: JSON.stringify({
        texto, nome: $("nome").value.trim(), foto: fotoBase64,
        consent: true, site: $("site").value
      })
    });
    const j = await r.json();
    if (!j.ok) {
      const motivos = { limite: "Muitos envios agora. Tente de novo em alguns minutos.", foto: "A foto ficou grande demais. Tente outra.", texto: "O relato está muito curto." };
      throw new Error(motivos[j.erro] || "");
    }
    $("memForm").reset(); $("fotoRemove").click(); $("textoCount").textContent = "0";
    msg("Obrigada por compartilhar. Sua memória foi recebida e vai aparecer aqui depois de revisada pela organização.");
  } catch (err) {
    msg(err.message || "Não foi possível enviar agora. Verifique sua conexão e tente de novo.", true);
  }
  btn.disabled = false; btn.textContent = "Enviar memória";
});

carregarGaleria();
