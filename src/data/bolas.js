// AS BOLAS. A POKÉ BOLA sempre existiu escrita à mão em três lugares (a loja, a
// mochila da batalha e o `tryCatch`); a GREAT BALL e a ULTRA BALL entram por
// uma tabela, porque três bolas escritas à mão são três lugares pra esquecer
// uma. Quem quiser uma quarta escreve uma linha aqui e acabou.
//
// `bonus` é o multiplicador da fórmula de captura (`catchAttempt` em
// src/systems/battle-engine.js, o mesmo número do jogo original: 1, 1,5 e 2).
//
// `insignias` é o que SEGURA a bola na prateleira. Sem isso as três apareceriam
// juntas na primeira loja da VILA VIRIDIAN, e a ULTRA BALL na primeira loja
// transforma a captura inteira do jogo num problema de dinheiro. A conta é a do
// FireRed: a GREAT BALL chega junto com a estrada aberta pro norte, e a ULTRA
// BALL só quando já sobra dinheiro pra ela.
import { BOLAS_NOVAS } from "./fabrica.js";

export const BOLAS = [
  { item: "poké bola", label: "POKÉ BOLA", bonus: 1, preco: 200, insignias: 0 },
  { item: "great ball", label: "GREAT BALL", bonus: 1.5, preco: 600, insignias: 3 },
  { item: "ultra ball", label: "ULTRA BALL", bonus: 2, preco: 1200, insignias: 6 },
  // AS DA FÁBRICA DE POKÉBOLAS (src/data/fabrica.js): o bônus delas depende da
  // batalha (`regra`, src/systems/bolas.js); só vão pra loja depois de fabricadas
  ...BOLAS_NOVAS.map((b) => ({ ...b, insignias: 0, fabricada: true })),
];

export const bolaPorItem = (item) => BOLAS.find((b) => b.item === item) || null;

/** o que entra na prateleira de QUALQUER balconista (ver src/data/index.js) */
export const ESTOQUE_BOLAS = [
  ...BOLAS.filter((b) => b.insignias > 0).map((b) => ({ item: b.item, price: b.preco, insignias: b.insignias })),
  // as da FÁBRICA: na loja só depois que o GIOVANNI fabricou (`flags.bola_<item>`)
  ...BOLAS_NOVAS.map((b) => ({ item: b.item, price: b.preco, requer: ["bola_" + b.item.replace(/\W/g, "")] })),
  // A MASTER BALL NA LOJA: só depois de VENCER UMA LIGA (a de Braglitch,
  // `flags.bragCampeao`, ou a de Kanto, `flags.kantoCampeao`) — "ao vencer a liga ganha
  // master ball nas lojas", CAIO, nov/2026
  { item: "master ball", price: 30000, requer: ["bragCampeao", "kantoCampeao"] },
];

export const BOLA_LORE = {
  ...Object.fromEntries(BOLAS_NOVAS.map((b) => [b.item, b.lore])),
  "great ball": "UMA BOLA MELHOR QUE A COMUM. O ARO AZUL NÃO É ENFEITE: É O QUE SEGURA.",
  "ultra ball": "A MELHOR BOLA QUE SE COMPRA COM DINHEIRO. DEPOIS DELA SÓ TEM SORTE.",
};

/** a frase da bola saindo da mão. A GLITCHBALL tem a dela em STORY.glitchball. */
export const jogou = (item) => {
  const b = bolaPorItem(item);
  return `VOCÊ JOGOU UMA ${b ? b.label : String(item).toUpperCase()}!`;
};
