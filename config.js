/* ============ CONFIGURAÇÃO: edite só aqui ============ */
const CONFIG = {
  // URL do App Script (termina em /exec). Usado pelas Memórias.
  SCRIPT_URL: "https://script.google.com/macros/s/AKfycbzMtXKxN33uihd3lR4hnWnmtDMuXB9AaM-ffh8Cxou497Dj-hWQnt9ffX7QCUZN68Yp/exec",

  GRUPO_WHATSAPP: "https://chat.whatsapp.com/JGRMLoCoVue0ylTl1f6JJ6",

  // Deixe "" para esconder o botão/link
  CANAL_WHATSAPP: "https://whatsapp.com/channel/0029VbDVLyS77qVbhWpkGR03",
  INSTAGRAM: "https://www.instagram.com/justicaporcamilaregina/",

  // Próximo grande ato. Deixe null para esconder a seção.
  // Exemplo:
  // PROXIMO_ATO: {
  //   quando: "Sábado, 14 de novembro, às 17h",
  //   pontos: [ { titulo: "Concentração", detalhe: "Praça X, Ponta Verde", mapa: "https://maps.google.com/..." } ],
  //   levar: "Roupa preta, água e cartazes respeitosos."
  // },
  PROXIMO_ATO: {
    quando: "Quinta-feira, 12 de novembro, às 18h",
    pontos: [
      { titulo: "Em frente à Bluefit Ponta Verde", detalhe: "Ato pela justiça: por Camila Regina, por todos os animais de Maceió e para que todos os envolvidos sejam responsabilizados.", mapa: "https://www.google.com/maps/search/?api=1&query=Bluefit+Ponta+Verde+Macei%C3%B3" }
    ],
    levar: "Ato pacífico. Leve água e cartazes com respeito, focados em Camila e nos direitos dos animais."
  },

  // Texto que acompanha o link no botão "Enviar no WhatsApp"
  TEXTO_COMPARTILHAR: "Justiça por Camila Regina: novo ato dia 12/11 (quinta), às 18h, em frente à Bluefit Ponta Verde, em Maceió. Veja as fotos dos atos e ajude o Reginaldo a encontrar um lar.",

  // Texto do botão "Divulgar o Reginaldo"
  TEXTO_REGINALDO: "Reginaldo, gato manso e carinhoso da Ponta Verde (Maceió), precisa de um lar: adoção responsável ou lar temporário. Castração garantida, se necessário. Saiba mais:"
};
/* ===================================================== */
