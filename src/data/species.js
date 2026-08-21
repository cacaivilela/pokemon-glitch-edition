// Monta a lista de espécies jogáveis a partir da Pokédex de Kanto (gen1.js).
// - FEATURED: espécies com learnset/dex text escritos à mão (as do começo do jogo).
// - As outras 140 ganham learnset automático pelo tipo, então qualquer uma das 151
//   já pode ser colocada numa tabela de encontros sem trabalho extra.

// Golpes por tipo: [básico, status, intermediário (nv 7), forte (nv 16)]
const POOLS = {
  NORMAL:     ["investida", "grito", "ataquerapido", "cabecada"],
  FOGO:       ["arranhao", "grito", "brasa", "lancachamas"],
  "ÁGUA":     ["investida", "rabodeabano", "bolhas", "pistoladagua"],
  PLANTA:     ["investida", "grito", "chicotedevinha", "folhanavalha"],
  "ELÉTRICO": ["investida", "rabodeabano", "choquedotrovao", "ondadechoque"],
  INSETO:     ["investida", "fiodeseda", "picada", "picadadeveneno"],
  VOADOR:     ["investida", "areianosolhos", "rajadadevento", "ataquedeasa"],
  VENENO:     ["investida", "encarar", "picadadeveneno", "poderdeacido"],
  TERRA:      ["investida", "encarar", "bofetadadelama", "terremoto"],
  PEDRA:      ["investida", "endurecer", "jogarpedra", "cabecada"],
  LUTADOR:    ["investida", "encarar", "golpecarate", "chuteduplo"],
  "PSÍQUICO": ["investida", "grito", "confusao", "psiquico"],
  GELO:       ["investida", "endurecer", "ventogelado", "raiodegelo"],
  "DRAGÃO":   ["investida", "encarar", "furiadragao", "garradragao"],
  FANTASMA:   ["lambida", "encarar", "confusao", "bolasombria"],
  "AÇO":      ["investida", "endurecer", "garrademetal", "cabecada"],
  SOMBRIO:    ["investida", "encarar", "mordida", "cabecada"],
};

const SHAPE_BY_TYPE = {
  FOGO: "lagarto", "DRAGÃO": "lagarto",
  "ÁGUA": "tartaruga", GELO: "tartaruga", "AÇO": "tartaruga", PEDRA: "tartaruga",
  PLANTA: "quadrupede", VENENO: "quadrupede", TERRA: "quadrupede", LUTADOR: "quadrupede",
  "ELÉTRICO": "roedor", NORMAL: "roedor", "PSÍQUICO": "roedor",
  INSETO: "larva", FANTASMA: "larva", SOMBRIO: "quadrupede",
  VOADOR: "passaro",
};

/** Espécies do início do jogo, escritas à mão. */
const FEATURED = {
  bulbasaur: {
    learnset: [[1, "investida"], [3, "grito"], [7, "chicotedevinha"], [13, "folhanavalha"], [20, "poderdeacido"]],
    dexText: "A SEMENTE NAS COSTAS CRESCE ABSORVENDO LUZ DO SOL.",
  },
  charmander: {
    learnset: [[1, "arranhao"], [3, "grito"], [7, "brasa"], [13, "ataquerapido"], [19, "lancachamas"]],
    dexText: "A CHAMA DA CAUDA MOSTRA O HUMOR DELE: TREMELUZ QUANDO ESTÁ FELIZ.",
  },
  squirtle: {
    learnset: [[1, "investida"], [3, "rabodeabano"], [7, "bolhas"], [13, "mordida"], [19, "pistoladagua"]],
    dexText: "A CURVA DO CASCO NÃO É SÓ DEFESA: DEIXA ELE MAIS RÁPIDO NA ÁGUA.",
  },
  pikachu: {
    learnset: [[1, "choquedotrovao"], [1, "grito"], [6, "ataquerapido"], [11, "rabodeabano"], [18, "ondadechoque"]],
    dexText: "GUARDA ELETRICIDADE NAS BOCHECHAS. SOLTA TUDO QUANDO SE ASSUSTA.",
  },
  lapras: {
    learnset: [[1, "investida"], [1, "grito"], [8, "bolhas"], [15, "ventogelado"],
               [25, "pistoladagua"], [34, "raiodegelo"], [70, "surfar"]],
    dexText: "ATRAVESSA O MAR CARREGANDO GENTE NAS COSTAS. QUASE NINGUÉM SOBROU.",
  },
  porygon: {
    dexText: "O PRIMEIRO POKÉMON FEITO DE CÓDIGO. AQUI DENTRO ELE ESTÁ EM CASA.",
  },
  rattata: {
    learnset: [[1, "investida"], [1, "rabodeabano"], [7, "ataquerapido"], [13, "mordida"]],
    dexText: "OS DENTES CRESCEM A VIDA INTEIRA, ENTÃO ELE ROI QUALQUER COISA.",
  },
  pidgey: {
    learnset: [[1, "investida"], [5, "areianosolhos"], [9, "rajadadevento"], [15, "ataquedeasa"]],
    dexText: "MUITO DÓCIL. PREFERE LEVANTAR AREIA A ENTRAR NUMA BRIGA.",
  },
  spearow: {
    learnset: [[1, "bicada"], [5, "grito"], [9, "rajadadevento"], [15, "ataquedeasa"]],
    dexText: "BATE AS ASAS RÁPIDO E EM VOO BAIXO PARA ESPANTAR INSETOS DO MATO.",
  },
  caterpie: {
    learnset: [[1, "investida"], [1, "fiodeseda"], [9, "picada"]],
    dexText: "AS ANTENAS SOLTAM UM CHEIRO FORTE PARA ESPANTAR PREDADORES.",
  },
  weedle: {
    learnset: [[1, "picadadeveneno"], [1, "fiodeseda"], [9, "picada"]],
    dexText: "O FERRÃO DA CABEÇA TEM VENENO. VIVE ONDE HÁ MUITA FOLHA.",
  },
  nidoranm: {
    learnset: [[1, "investida"], [1, "encarar"], [8, "picadadeveneno"], [14, "mordida"]],
    dexText: "AS ORELHAS ENORMES CAPTAM QUALQUER RUÍDO. O CHIFRE É VENENOSO.",
  },
  nidoranf: {
    learnset: [[1, "arranhao"], [1, "grito"], [8, "picadadeveneno"], [14, "mordida"]],
    dexText: "MENOS AGRESSIVA QUE O MACHO, MAS O FERRÃO É IGUALMENTE PERIGOSO.",
  },
  mankey: {
    learnset: [[1, "arranhao"], [1, "encarar"], [9, "golpecarate"], [15, "chuteduplo"]],
    dexText: "ACORDA IRRITADO E FICA PIOR DURANTE O DIA.",
  },
};

/** Registro que não deveria estar aqui. */
const MISSINGNO = {
  id: "missingno", dex: 0, name: "MISSINGNO.", types: ["GLITCH"],
  base: { hp: 33, atk: 136, def: 0, spa: 6, spd: 6, spe: 29 },
  catchRate: 30, xpYield: 200,
  placeholder: { shape: "glitch" },
  learnset: [[1, "corrompida"], [1, "ruidobranco"], [10, "sobrescrever"]],
  dexText: "ERRO 0x00. ESTE REGISTRO NÃO DEVERIA EXISTIR. NÃO SALVE DEPOIS DE VÊ-LO.",
  lore: true,
};

function autoLearnset(types) {
  const pool = POOLS[types[0]] || POOLS[types[1]] || POOLS.NORMAL;
  return [[1, pool[0]], [1, pool[1]], [7, pool[2]], [16, pool[3]]];
}

function shapeFor(sp) {
  if (sp.types[0] === "NORMAL" && sp.types[1] === "VOADOR") return "passaro";
  return SHAPE_BY_TYPE[sp.types[0]] || SHAPE_BY_TYPE[sp.types[1]] || "roedor";
}

export function buildSpecies(GEN1, TYPE_COLOR = {}) {
  const out = {};
  for (const [id, sp] of Object.entries(GEN1)) {
    const extra = FEATURED[id] || {};
    out[id] = {
      ...sp,
      learnset: extra.learnset || sp.learnset || autoLearnset(sp.types),
      dexText: extra.dexText || sp.dexText || `${sp.name}. DADOS DA POKÉDEX AINDA NÃO CARREGADOS.`,
      lore: !!(extra.dexText || sp.dexText),   // tem frase própria (não é o texto genérico)
      placeholder: sp.placeholder || { shape: shapeFor(sp), tint: TYPE_COLOR[sp.types[0]] },
    };
  }
  out.missingno = MISSINGNO;
  // As formas MEGA aprendem o que a espécie de origem aprende: subir de nível
  // no meio da batalha, já megado, não pode ensinar outra coisa.
  for (const sp of Object.values(out)) {
    if (sp.megaDe && out[sp.megaDe]) sp.learnset = out[sp.megaDe].learnset;
  }
  return out;
}

export const STARTERS = ["bulbasaur", "charmander", "squirtle"];
