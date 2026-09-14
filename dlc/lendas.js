// DLC: LENDAS DE KANTO.
//
// As aves, o MEWTWO e o MEW voltam a andar por Kanto — RAROS, nos lugares
// deles: ARTICUNO no fundo das Ilhas Seafoam, ZAPDOS na Usina, MOLTRES no
// caminho do Monte Ember, MEWTWO na Caverna Cerulean, MEW... onde ninguém
// procura (Rota 1, o começo de tudo). São bravos — lenda não foge de gente.
// Um velho no museu de Pewter conta a história de cada um.
//
// Os nove cartões entregam o resto da lenda: os três pássaros, os dois
// clones, o dragão, o lago, a besta e as pedras de quem quer ver as lendas
// ainda maiores.
export default {
  id: "lendas",
  nome: "LENDAS DE KANTO",

  encontrosExtra: {
    seafoam_islands_b4f: [{ id: "articuno", min: 50, max: 50, w: 1 }],
    power_plant:         [{ id: "zapdos",   min: 50, max: 50, w: 1 }],
    mt_ember_summit_path_3f: [{ id: "moltres", min: 50, max: 50, w: 1 }],
    cerulean_cave_b1f:   [{ id: "mewtwo",   min: 70, max: 70, w: 1 }],
    route1:              [{ id: "mew",      min: 5,  max: 5,  w: 1 }],
  },

  bravos: ["mew"],

  npcs: {
    pewter_city: [
      { id: "dlc_velho_lendas", x: 18, y: 18, dir: "down", sprite: "velho",
        lines: [
          "AS LENDAS VOLTARAM. EU SENTI NO JOELHO.",
          "O PÁSSARO DE GELO DORME NO FUNDO DAS ILHAS SEAFOAM. O DE TROVÃO MORA NA USINA ABANDONADA.",
          "O DE FOGO ESTÁ NO ALTO DO MONTE EMBER, NA ILHA UM. E O CLONE... NA CAVERNA DE CERULEAN, ONDE SEMPRE ESTEVE.",
          "E O ORIGINAL? DIZEM QUE ELE FICA ONDE NINGUÉM PROCURA. NA PRIMEIRA ROTA QUE VOCÊ ANDOU.",
          "NENHUM DELES FOGE. LENDA NÃO FOGE DE GENTE.",
        ] },
    ],
  },

  presentes: {
    LENDAS001: { titulo: "A PENA DE GELO", texto: "UMA PENA AZUL, GELADA, QUE NÃO DERRETE. O DONO DELA VEIO JUNTO.", de: "LENDAS DE KANTO", mons: [{ id: "articuno", nv: 50 }] },
    LENDAS002: { titulo: "A PENA DE TROVÃO", texto: "ELA DÁ CHOQUE SÓ DE OLHAR. O DONO TAMBÉM.", de: "LENDAS DE KANTO", mons: [{ id: "zapdos", nv: 50 }] },
    LENDAS003: { titulo: "A PENA DE FOGO", texto: "AINDA QUENTE. O ENVELOPE VEIO CHAMUSCADO.", de: "LENDAS DE KANTO", mons: [{ id: "moltres", nv: 50 }] },
    LENDAS004: { titulo: "O CLONE", texto: "NÚMERO 150. FEITO EM LABORATÓRIO, E NÃO GOSTA QUE LEMBREM DISSO.", de: "LENDAS DE KANTO", mons: [{ id: "mewtwo", nv: 70 }] },
    LENDAS005: { titulo: "O ORIGINAL", texto: "NÚMERO 151. NÃO ESTÁ NA POKÉDEX DE NINGUÉM. ESTÁ NA SUA.", de: "LENDAS DE KANTO", mons: [{ id: "mew", nv: 30, shiny: true }] },
    LENDAS006: { titulo: "O DRAGÃO DO CAIS", texto: "O CRIADOR DE DRAGÕES MANDOU ESTE. DISSE QUE ELE JÁ SABE O CAMINHO DE VOLTA.", de: "LANCE", mons: [{ id: "dragonite", nv: 55 }] },
    LENDAS007: { titulo: "A CANÇÃO DO LAGO", texto: "UM LAPRAS QUE CANTA. A COR TAMBÉM NÃO É A DE SEMPRE.", de: "SILPH CO.", mons: [{ id: "lapras", nv: 40, shiny: true }] },
    LENDAS008: { titulo: "A BESTA DA SAFÁRI", texto: "TRÊS CAUDAS. NÃO PARA QUIETO. FOI EMBALADO COM DIFICULDADE.", de: "GUARDA DO SAFÁRI", mons: [{ id: "tauros", nv: 45 }] },
    LENDAS009: { titulo: "AS PEDRAS DO CLONE", texto: "DUAS PEDRAS, UMA PRA CADA LADO DELE. X E Y. ESCOLHA COM CUIDADO.", de: "?", itens: [{ item: "mewtwonita x", qtd: 1 }, { item: "mewtwonita y", qtd: 1 }] },
  },
};
