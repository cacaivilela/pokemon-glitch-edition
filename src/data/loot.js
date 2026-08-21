// Pokébolas largadas no chão da 011GLITCHDIMENSION110.
//
// Cada vez que você entra na fenda, ela espalha algumas bolas fechadas pelo
// terreno. O que tem dentro sai da tabela abaixo por peso — igual às tabelas de
// encontro. Os itens estrangeiros (UP-GRADE / DUBIOUS DISC) não existem em
// Kanto: vazam de outra região pela fenda, do mesmo jeito que as espécies de
// extra.js. Por isso eles só aparecem aqui. O que eles fazem (evoluir a linha do
// PORYGON) está com o resto das evoluções, em src/data/evolution.js.

/** quantas bolas por visita */
export const DIM_LOOT_COUNT = { min: 3, max: 6 };

/** distância mínima (em tiles) entre duas bolas, pra não nascerem grudadas */
export const DIM_LOOT_SPREAD = 5;

/** tabela de conteúdo: qty = [mínimo, máximo] */
export const DIM_LOOT = [
  { item: "poké bola",   qty: [2, 4], w: 30 },
  { item: "poção",       qty: [1, 3], w: 26 },
  { item: "doce raro",   qty: [1, 2], w: 16 },
  { item: "up-grade",    qty: [1, 1], w: 6, rare: true },
  { item: "dubious disc", qty: [1, 1], w: 4, rare: true },
  { item: "bilhete voo",  qty: [1, 1], w: 8, rare: true },     // um já serve pra sempre
];

/** texto que aparece ao achar um item estrangeiro pela primeira vez */
export const ITEM_LORE = {
  "up-grade": "UM DISPOSITIVO ESTRANHO CHEIO DE DADOS. NÃO FOI FEITO EM KANTO.",
  "dubious disc": "UM DISCO TRANSPARENTE COM DADOS SUSPEITOS DENTRO. PISCA SOZINHO.",
  "bilhete voo": "UM BILHETE DE VOO COM O CAMPO \"PARA\" EM BRANCO. VALE PRA KANTO INTEIRA.",
};
