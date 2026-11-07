// A PASSAGEM SECRETA DA FONTE DE CELADON (nov/2026, pedido do CAIO).
//
// A FONTE redonda na frente da LOJA DE DEPARTAMENTO (onde se joga o paintball),
// com o jato no meio e as flores em volta. Na borda dela, do lado esquerdo, tem
// uma pedrinha solta: é um BOTÃO ESCONDIDO. De frente pra ele, Z aperta — o
// jato desliga, a água ESCOA e aparece uma ESCADA no meio da fonte (chega-se
// por baixo), que desce pra uma SALA SECRETA NOVA:
// uma câmara de pedra azulada com canais d'água, dois tesouros e um SUICUNE
// esperando (o lendário da água pura, que combina com fonte).
//
// A fonte seca fica seca pra sempre (`flags.fonteCeladonAberta`). As regras
// estão em src/scenes/overworld.js (`botaoDaFonte`, `fonteSeca`, `desenhaFonte`).

import { montarGeos } from "./braglitch.js";

export const FONTE = {
  mapa: "celadon_city",
  flag: "fonteCeladonAberta",
  // a fonte: o desenho é redondo, no centro (em pixels do mapa) e com o raio da água
  centro: { x: 215.5, y: 322 }, raio: { x: 15, y: 14 },
  // o botão: no lado esquerdo da borda (aperta-se do tile da esquerda, olhando pra direita)
  botao: { x: 12, y: 20 },
  // a escada que aparece no meio (o tile do meio de baixo: chega-se por baixo)
  escada: { x: 13, y: 20 },
  sala: "celadon_fonte_secreta",
};

export const FONTE_TEXTO = {
  achou: "NA BORDA DA FONTE TEM UMA PEDRINHA SOLTA... EMBAIXO DELA, UM BOTÃO!",
  apertar: "APERTAR O BOTÃO?",
  sim: ["APERTAR", "NÃO"],
  escoou: ["GLUB... GLUB... A ÁGUA DA FONTE ESTÁ ESCOANDO!", "NO FUNDO DA FONTE SECA APARECEU UMA ESCADA!"],
  jaAberta: "A FONTE CONTINUA SECA. A ESCADA DESCE PRO ESCURO.",
};

// a sala: # pedra  . chão  ~ canal d'água  k cristal  q a escada de subir  1 placa
const PLANTA = [
  "###############",
  "#~~~.......~~~#",
  "#~...........~#",
  "#....k...k....#",
  "#.............#",
  "#.............#",
  "#..1..........#",
  "#~...........~#",
  "#~~~...q...~~~#",
  "###############",
];

/** Monta a sala e liga ela na fonte: a escada da fonte vira uma porta de
 *  CELADON (que só abre com a fonte seca — ver `warpAt` no overworld). */
export function montarFonte(kanto) {
  const celadon = kanto?.[FONTE.mapa];
  if (!celadon) return {};
  const out = montarGeos(kanto, { plantas: { [FONTE.sala]: PLANTA }, interiores: {}, temas: { [FONTE.sala]: "fonte" },
                                  cidadePadrao: FONTE.mapa, marca: {} });
  const sala = out[FONTE.sala];
  if (!celadon.warps.some((w) => w.fonteSecreta)) {
    celadon.warps.push({ x: FONTE.escada.x, y: FONTE.escada.y, to: FONTE.sala, toWarp: 0, fonteSecreta: true });
  }
  const i = celadon.warps.findIndex((w) => w.fonteSecreta);
  sala.warps = sala.warps.map((w) => (w.predio === "q" ? { ...w, to: FONTE.mapa, toWarp: i } : w));
  return out;
}

export const CONTEUDO_FONTE = {
  [FONTE.sala]: {
    name: "SALA SECRETA DA FONTE", music: "bragChapada", interior: true, caverna: true, encounters: [],
    spawn: { x: 7, y: 7, dir: "up" },
    signs: { "3,6": "AQUI A ÁGUA DE CELADON DESCANSA ANTES DE SUBIR PRA FONTE.\n(ALGUÉM RISCOU EMBAIXO: \"E ELE BEBE DELA.\")" },
    lockedWarps: {},
    npcs: [
      { id: "fonte_tesouro_1", x: 2, y: 4, sprite: "ball", gift: { item: "água mística", qty: 1 } },
      { id: "fonte_tesouro_2", x: 12, y: 4, sprite: "ball", gift: { item: "doce raro", qty: 3 } },
    ],
  },
};

/** o SUICUNE parado no fundo da sala (entra em DB.ESTATICOS) */
export const ESTATICO_FONTE = {
  id: "suicune", mapa: FONTE.sala, x: 7, y: 3, nivel: 50,
  lines: ["A ÁGUA DOS CANAIS PARA DE CORRER.", "UM POKÉMON AZUL, DE CRINA ROXA, LEVANTA A CABEÇA E OLHA PRA VOCÊ."],
};
