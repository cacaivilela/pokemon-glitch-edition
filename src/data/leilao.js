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
  "deoxysvelocidade", "arceus", "xerneas", "yveltal", "zygarde",
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
  // fusão desenhada à mão vale mais que a montagem automática
  bonusFicha: 1.25,
};
