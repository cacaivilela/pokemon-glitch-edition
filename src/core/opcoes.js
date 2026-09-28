// As preferências de quem joga: velocidade do jogador e idioma.
//
// Elas NÃO moram no save. Idioma e velocidade são de quem está na frente da
// tela, não da partida: quem apaga o save não perde o idioma, e quem abre o
// jogo antes de começar qualquer partida (na tela de título) já consegue
// escolher. Por isso ficam no localStorage do navegador.
const CHAVE = "pge.opcoes";

const PADRAO = {
  idioma: "pt",
  velocidade: 1,        // multiplicador: 0.5 devagar, 1 normal, 2 rápido...
  // A FALA (src/systems/dialogue.js): o jeito de ler é de quem lê
  falaEstilo: "caixa",  // "caixa" (a de baixo, do GBA) ou "balao" (em cima de quem fala)
  falaVel: 1,           // índice em FALA_VELOCIDADES: 0 lenta ... 3 na hora
  falaSom: true,        // o tique das letras aparecendo
  falaAuto: false,      // a página vira sozinha depois de dar tempo de ler
};

let atual = null;

function ler() {
  if (atual) return atual;
  atual = { ...PADRAO };
  try {
    const cru = JSON.parse(localStorage.getItem(CHAVE) || "{}");
    if (cru && typeof cru === "object") atual = { ...PADRAO, ...cru };
  } catch { /* navegador sem localStorage: fica no padrão */ }
  return atual;
}

function grava() {
  try { localStorage.setItem(CHAVE, JSON.stringify(atual)); } catch {}
}

export const Opcoes = {
  get(chave) { return ler()[chave]; },
  set(chave, valor) {
    ler()[chave] = valor;
    grava();
    return valor;
  },
  todas() { return { ...ler() }; },
};
