// O LEILÃO: vender Pokémon na loja, pelo preço que VOCÊ pede.
//
// Compra-se uma BARRACA DE LEILÃO uma vez e ela vale pra sempre: daí em diante,
// todo balconista pergunta se você quer comprar ou leiloar. Você escolhe quem
// vai e o preço MÍNIMO — e é aí que está o jogo: pedir pouco vende na hora,
// pedir muito pode não vender nada.
//
// A faixa de preço sai da raridade do bicho (regras em src/systems/leilao.js),
// e as pontas são as que o jogo promete:
//
//   comum            500 a 1000
//   raro            1000 a 1500
//   pseudo-lendário 1500 a 2000
//   lendário        2000 a 4000

/** a barraca que abre o leilão; compra-se uma vez, em qualquer loja */
export const BARRACA_LEILAO = { item: "barraca de leilão", preco: 3000 };

/** as faixas, por raridade. `passo` é de quanto em quanto o preço anda quando
 *  você escolhe — de 50 em 50 num comum, de 100 em 100 num lendário. */
export const FAIXAS = {
  comum: { min: 500, max: 1000, passo: 50, nome: "COMUM" },
  raro: { min: 1000, max: 1500, passo: 50, nome: "RARO" },
  pseudo: { min: 1500, max: 2000, passo: 100, nome: "PSEUDO-LENDÁRIO" },
  lendario: { min: 2000, max: 4000, passo: 100, nome: "LENDÁRIO" },
};

/** Quem é lendário, escrito à mão: não dá pra descobrir por número, e chutar
 *  por total de status poria o SNORLAX no mesmo balcão do MEWTWO. */
export const LENDARIOS = new Set([
  "articuno", "zapdos", "moltres", "mewtwo", "mew",
  "kyogre", "groudon", "rayquaza", "deoxys", "deoxysataque", "deoxysdefesa",
  "deoxysvelocidade", "arceus", "dialga", "palkia", "xerneas", "yveltal", "zygarde",
  "tornadus", "thundurus", "landorus", "genesect", "missingno",
]);

/** Daqui pra cima é pseudo-lendário; daqui pra cima é raro. O resto é comum. */
export const CORTE = { pseudo: 540, raro: 450 };

/** Os compradores da praça. */
export const LEILOEIROS = {
  quantos: 3,
  // a chance de dar lance cai conforme você pede mais perto do teto da faixa
  chanceNoMinimo: 0.92,
  chanceNoTeto: 0.18,
  // o quanto cada lance sobe em cima do anterior
  aumento: [0.04, 0.14],
  // shiny é shiny: paga o dobro
  bonusShiny: 2,
  // luminoso é 1 em 9999: eles brigam pelo bicho. Nunca soma com o do shiny —
  // um Pokémon tem uma cor só, e este bônus é o do lugar dele na raridade
  bonusLuminoso: 5,
  // fusão desenhada à mão vale mais que a montagem automática
  bonusFicha: 1.25,
};

// ---------------------------------------------------------------- VENDER ITEM
// O balcão compra de volta. O preço é uma FRAÇÃO do que a loja cobra pelo
// item (metade, como sempre foi), então só vende o que alguma loja vende — o
// resto não tem preço, e coisa sem preço não se vende... menos o que está em
// `especiais`, que tem preço próprio: o que não se compra em lugar nenhum mas
// ainda vale alguma coisa (as peças da Silph, o doce), e O TROFÉU DE PALLET,
// que vale OITO ZILHÕES DE POKÉDÓLARES. É de lata. Vale oito zilhões. Os dois
// são verdade, e é o balconista quem paga.
export const VENDA = {
  fracao: 0.5,
  minimo: 10,
  especiais: {
    "doce raro": 2400,
    "up-grade": 1050,
    "dubious disc": 1050,
    "troféu de pallet": 8e21,     // 8 ZILHÕES (ver `moeda` em src/core/gfx.js)
  },
};

export const VENDA_TEXTO = {
  oferta: "COMPRAR OU VENDER?",
  opcoes: ["COMPRAR", "VENDER", "NADA"],
  ofertaComBarraca: "COMPRAR, VENDER OU LEILOAR ALGUÉM?",
  opcoesComBarraca: ["COMPRAR", "VENDER", "LEILOAR", "NADA"],
  nadaPraVender: "VOCÊ NÃO TEM NADA QUE EU COMPRE.",
  vendeu: "VOCÊ VENDEU {N} {ITEM} POR {TOTAL}.",
  trofeu: "...ISSO É O TROFÉU DE PALLET? OITO ZILHÕES. EU PAGO. NÃO PERGUNTE DE ONDE.",
};
