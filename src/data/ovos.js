// OS MYSTERY EGGS. Um ovo que ninguém sabe de onde veio e que vende em TODO
// CENTRO POKÉMON de Kanto, no balcão do lado da SRTA. JOY. Dentro tem um dos
// 151 — qualquer um, sorteado na hora de rachar — e a FORMA dele também sai de
// sorteio: comum, shiny, alfa, e a cruza que só existe aqui, o SHINY ALFA.
//
// O SUPER MYSTERY EGG é o mesmo ovo com o sorteio puxado: metade do que sai
// dele já vem com alguma coisa. Ele custa seis vezes mais, e é isso que segura
// a raridade — o ovo comum é o que se compra no caminho do ginásio, o super é o
// que se junta dinheiro pra comprar.
//
// Os dois também CAEM NA FENDA, raramente, dentro das bolas largadas no chão
// (src/data/loot.js). Faz sentido: se o ovo não é de Kanto, é de lá.
//
// As tabelas são por PESO, como as de encontro. `pool` é de onde saem as
// espécies: "tudo" = QUALQUER espécie jogável do jogo — os 151, as formas
// regionais, tudo que vaza de outra região pela fenda (LAMPENT, PORYGON-Z, os
// iniciais de fora, os das eras...). Ficam de fora as MEGA (só existem dentro
// da batalha), as fusões (essas se fazem na máquina) e os de tipo GLITCH
// (MISSINGNO., o ?????????? do DLC): ovo choca Pokémon, e interrogação não é
// Pokémon. "kanto" limita aos 151 da Pokédex.
//
// OS LENDÁRIOS (a lista de src/data/leilao.js) entram, mas com o peso
// `lendario` de cada ovo em vez de 1: um MEW pesando o mesmo que um RATTATA
// fazia sair lendário a cada trinta ovos de $500. No comum é uma fração de
// bicho; no SUPER a fração é maior — é isso que o super compra.

export const OVOS = {
  /** o nível de quem nasce; o alfa ainda soma `alfaNiveis` (config.js) */
  nivel: 5,
  pool: "tudo",

  tipos: {
    "mystery egg": {
      label: "MYSTERY EGG",
      preco: 500,
      lendario: 1 / 20,       // cada lendário pesa 1/20 de um bicho comum
      // 90% comum · 5,3% shiny · 4% alfa · 0,7% shiny alfa
      formas: [
        { forma: "comum",      w: 900 },
        { forma: "shiny",      w: 53 },
        { forma: "alfa",       w: 40 },
        { forma: "shiny alfa", w: 7 },
      ],
    },
    "super mystery egg": {
      label: "SUPER MYSTERY EGG",
      preco: 3000,
      lendario: 1 / 5,
      // 50% comum · 23,5% shiny · 18% alfa · 8,5% shiny alfa
      formas: [
        { forma: "comum",      w: 500 },
        { forma: "shiny",      w: 235 },
        { forma: "alfa",       w: 180 },
        { forma: "shiny alfa", w: 85 },
      ],
    },
  },

  /** o que cada forma liga no createMon */
  flags: {
    "comum":      {},
    "shiny":      { shiny: true },
    "alfa":       { alfa: true },
    "shiny alfa": { shiny: true, alfa: true },
  },
};

export const ehOvo = (item) => !!OVOS.tipos[item];

/** o que entra na prateleira do vendedor de ovos (e só nela — ver `estoqueFechado`) */
export const ESTOQUE_OVOS = Object.entries(OVOS.tipos).map(([item, t]) => ({ item, price: t.preco }));

/** O VENDEDOR: um por Centro Pokémon, atrás do balcão, no tile à direita da
 *  SRTA. JOY. src/data/index.js cola ele em todos os centros e decide o x,y
 *  (a ILHA UM tem outra planta, então a coordenada não é fixa). */
export const VENDEDOR_OVOS = {
  id: "ovos", dir: "down", sprite: "cientista",
  estoqueFechado: true,      // sem bola nem sanduíche nesta prateleira
  lines: [
    "PSIU. AQUI DO LADO DA ENFERMEIRA. ISSO MESMO.",
    "MYSTERY EGG, $500. TEM UM POKÉMON DENTRO. QUAL? NÃO SEI. DE ONDE? TAMBÉM NÃO.",
    "O SUPER É MAIS CARO PORQUE O QUE NASCE DELE COSTUMA VIR... DIFERENTE.",
  ],
  shop: ESTOQUE_OVOS,
};

export const OVO_LORE = {
  "mystery egg": "UM OVO SEM MARCA NENHUMA. QUANDO NINGUÉM ESTÁ OLHANDO, ELE MEXE.",
  "super mystery egg": "UM OVO QUE PESA MAIS DO QUE PARECE. A CASCA TEM UM BRILHO QUE NÃO É DELA.",
};

export const OVO_TEXTO = {
  semVaga: "O OVO ESTÁ QUASE RACHANDO... MAS NÃO TEM VAGA NA EQUIPE NEM NO BOX. ARRUME ESPAÇO.",
  rachou: "VOCÊ SEGURA O {OVO}. ELE ESQUENTA, TREME E... RACHA!",
  nasceu: "NASCEU {MON}, NÍVEL {NIVEL}!",
  formas: {
    "shiny":      "E A COR DELE ESTÁ TROCADA. É UM SHINY!",
    "alfa":       "E ELE É GRANDE. GRANDE DEMAIS PRA UM OVO. É UM ALFA!",
    "shiny alfa": "ELE É GRANDE E A COR ESTÁ TROCADA. UM SHINY ALFA!",
  },
  equipe: "{MON} ENTROU NA SUA EQUIPE.",
  box: "{MON} FOI PRO BOX: SUA EQUIPE ESTÁ CHEIA.",
};
