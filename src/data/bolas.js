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
export const BOLAS = [
  { item: "poké bola", label: "POKÉ BOLA", bonus: 1, preco: 200, insignias: 0 },
  { item: "great ball", label: "GREAT BALL", bonus: 1.5, preco: 600, insignias: 3 },
  { item: "ultra ball", label: "ULTRA BALL", bonus: 2, preco: 1200, insignias: 6 },
];

export const bolaPorItem = (item) => BOLAS.find((b) => b.item === item) || null;
export const ehBola = (item) => !!bolaPorItem(item);

/** o que entra na prateleira de QUALQUER balconista (ver src/data/index.js) */
export const ESTOQUE_BOLAS = BOLAS
  .filter((b) => b.insignias > 0)
  .map((b) => ({ item: b.item, price: b.preco, insignias: b.insignias }));

export const BOLA_LORE = {
  "great ball": "UMA BOLA MELHOR QUE A COMUM. O ARO AZUL NÃO É ENFEITE: É O QUE SEGURA.",
  "ultra ball": "A MELHOR BOLA QUE SE COMPRA COM DINHEIRO. DEPOIS DELA SÓ TEM SORTE.",
};

/** a frase da bola saindo da mão. A GLITCHBALL tem a dela em STORY.glitchball. */
export const jogou = (item) => {
  const b = bolaPorItem(item);
  return `VOCÊ JOGOU UMA ${b ? b.label : String(item).toUpperCase()}!`;
};
