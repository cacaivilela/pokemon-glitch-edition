// AS MTs E AS MOs (pedido do CAIO, nov/2026: "adicione tms e hms").
//
// Regras que ELE escolheu:
//  - MT (máquina técnica) SOME depois de usar; MO (máquina oculta) fica pra sempre.
//  - o Pokémon só aprende a MT se o golpe estiver na lista de golpes dele (o
//    learnset). As MOs também deixam quem a SRTA. JOY já ensinava (pelo tipo,
//    src/data/field.js), senão quase ninguém surfaria.
//  - a MT RAIO ETERNO: só o MAGIKARP aprende. Ninguém mais. Nem o ETERNATUS.
//  - onde achar: loja de CELADON, pokébolas no chão, prêmio dos líderes e as
//    MOs com pessoas da história.
//
// O nome do item na mochila é "mt01 soco dinâmico" etc. (minúsculo, como os
// outros itens); quem lê o golpe é `golpeDaMaquina`.

import { MOVES } from "./moves.js";
import { MAIS_GOLPES } from "./golpes-mais.js";
import { GOLPES_OFICIAIS, MTS_NOVAS } from "./golpes-oficiais.js";

const NOME = (g) => String((MOVES[g] || MAIS_GOLPES[g] || GOLPES_OFICIAIS[g])?.name || g).toLowerCase();
const dois = (n) => String(n).padStart(2, "0");

/** as 50 MTs, na ordem (o número é a posição + 1) */
export const MTS = [
  "socodinamico", "garradragao", "pulsodagua", "dancadasespadas", "olharassustador",
  "toxico", "hidrobomba", "golpedecorpo", "bombadesementes", "extrassensorial",
  "diadesol", "tesourax", "raiodegelo", "nevasca", "hiperraio",
  "muralhadepedra", "hipervoz", "dancadachuva", "energiadanatureza", "pisotear",
  "derrubada", "raiosolar", "caudadeferro", "bolaeletrica", "trovao",
  "terremoto", "cabecada", "escavar", "psiquico", "bolasombria",
  "chuteduplo", "lutadeinseto", "choquepsiquico", "ondadechoque", "lancachamas",
  "bombadelodo", "deslizamento", "rajadadefogo", "tumbadepedra", "cortedear",
  "jatovenenoso", "labareda", "laminadefolha", "escaldar", "forcasombria",
  "ladrao", "asadeaco", "cabecadadepedra", "pulsodragao", "superaquecimento",
  // AS MTs DOS GOLPES FORTES (51 em diante, nov/2026): os que os ALFAS costumam saber
  "gigaimpacto", "potenciaequina", "gigadreno", "ultraje", "combateproximo",
  "golpeaquatico", "investidaselvagem", "pedragume", "furacao", "explosaolunar",
  "ondadecalor", "pulsosombrio", "cabecadeferro", "ondadelodo", "canhaodeflash", "esferadeaura",
  // MT67 em diante: os 99 GOLPES OFICIAIS a mais que vêm por máquina (src/data/golpes-oficiais.js)
  ...MTS_NOVAS,
];

/** OS GOLPES DE ALFA (o CAIO: "pkmns alfas geralmente aprendem golpes como giga
 *  impacto, potência equina, hiper raio, giga dreno"): o alfa selvagem nasce
 *  sabendo UM destes que ele aprenderia por MT nos jogos oficiais */
export const GOLPES_DE_ALFA = ["gigaimpacto", "hiperraio", "potenciaequina", "gigadreno", "ultraje", "combateproximo", "terremoto",
  "nevasca", "trovao", "rajadadefogo", "hidrobomba", "raiosolar", "furacao", "explosaolunar", "ondadecalor", "pedragume",
  "golpeaquatico", "investidaselvagem", "pulsosombrio", "ondadelodo", "esferadeaura", "cabecadeferro", "canhaodeflash", "psiquico", "bolasombria"];

/** as MOs: não somem */
export const MOS = ["corte", "voar", "surfar", "forca", "quebrarocha"];

/** a MT RAIO ETERNO: só o MAGIKARP */
export const MT_ETERNA = { golpe: "raioeterno", item: "mt raio eterno", so: ["magikarp"] };

/** o nome do item na mochila: "mt03 pulso d'água", "mo01 corte" */
export const itemDaMT = (n) => `mt${dois(n)} ${NOME(MTS[n - 1])}`;
export const itemDaMO = (n) => `mo${dois(n)} ${NOME(MOS[n - 1])}`;

/** o preço na loja de CELADON (as fortes custam mais) */
export const PRECO_MT = (n) => { const mv = MOVES[MTS[n - 1]] || MAIS_GOLPES[MTS[n - 1]] || GOLPES_OFICIAIS[MTS[n - 1]]; return (mv?.power >= 100 ? 5500 : mv?.power >= 75 ? 3000 : mv?.power > 0 ? 2000 : 1500); };

/** o que a loja de CELADON vende (o resto só no chão e com os líderes) */
export const MTS_NA_LOJA = [1, 3, 6, 11, 13, 15, 17, 18, 20, 22, 24, 25, 33, 34, 35, 38, 40, 46,
  51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66];   // (as fortes custam 5500)

/** o prêmio de cada LÍDER de Kanto, pela insígnia (o número da MT), como no FireRed quando dá */
export const MT_DO_LIDER = {
  pedra: 39, cascata: 3, trovao: 34, arcoiris: 9, alma: 6, pantano: 33, vulcao: 38, terra: 26,
};

/** a SEGUNDA prateleira (o outro vendedor de Celadon): as MTs dos 99 golpes oficiais */
export const MTS_NA_LOJA2 = MTS_NOVAS.map((_, i) => 67 + i);

/** as pokébolas de MT no chão: [mapa, x, y, número] (o número 0 = MT RAIO ETERNO) */
export const MTS_NO_CHAO = [
  ["route1", 12, 19, 2],
  ["route2", 16, 39, 4],
  ["route3", 42, 10, 5],
  ["route4", 54, 10, 7],
  ["route5", 24, 20, 8],
  ["route6", 12, 19, 10],
  ["route7", 12, 10, 12],
  ["route8", 35, 10, 14],
  ["route9", 35, 10, 16],
  ["route10", 12, 42, 19],
  ["route11", 36, 10, 21],
  ["route12", 12, 57, 23],
  ["route13", 37, 10, 27],
  ["route14", 11, 30, 28],
  ["route15", 36, 8, 29],
  ["route17", 12, 80, 30],
  ["route18", 30, 10, 31],
  ["route19", 11, 12, 32],
  ["route20", 60, 10, 36],
  ["route22", 24, 12, 37],
  ["route23", 12, 77, 41],
  ["route24", 12, 21, 42],
  ["route25", 36, 9, 43],
  ["viridian_forest", 23, 34, 44],
  ["mt_moon_1f", 24, 20, 45],
  ["rock_tunnel_1f", 24, 20, 47],
  ["seafoam_islands_1f", 19, 12, 48],
  ["power_plant", 24, 18, 49],
  ["pokemon_tower_3f", 13, 10, 50],
  ["cerulean_cave_1f", 19, 10, 0],   // a MT RAIO ETERNO (só o MAGIKARP aprende)
];

/** as MOs com pessoas: [mapa, x, y, sprite, MO, fala] */
export const MOS_COM_PESSOAS = [
  ["vermilion_city", 21, 18, "marinheiro", 1, ["EU ERA MARINHEIRO DE UM NAVIO GRANDE.", "NO NAVIO A GENTE CORTAVA CORDA COM ISTO. PODE FICAR!"]],
  ["route16", 14, 12, "garota", 2, ["VOCÊ VEIO ANDANDO ATÉ AQUI? QUE CANSEIRA!", "TOME, COM ISTO SEU POKÉMON TE LEVA VOANDO."]],
  ["safari_zone_secret_house", 6, 3, "velho", 3, ["PARABÉNS! VOCÊ ACHOU A CASA SECRETA DO SAFARI!", "O PRÊMIO É A MÁQUINA DO SURFAR."]],
  ["fuchsia_city", 20, 20, "velho", 4, ["PERDI MEUS DENTES DE OURO NO SAFARI... MAS TUDO BEM, JÁ ACHEI.", "TOME: ESTA MÁQUINA DÁ FORÇA PRA EMPURRAR PEDRA."]],
  ["route2_east_building", 7, 6, "cientista", 5, ["SOU AJUDANTE DO PROF. CARVALHO.", "ESTA MÁQUINA QUEBRA PEDRA RACHADA. LEVE!"]],
];

export const MAQ_TEXTO = {
  ligou: "VOCÊ LIGOU A {ITEM}!",
  contem: "ELA TEM O GOLPE {GOLPE}. ENSINAR A QUAL POKÉMON?",
  naoPode: "{MON} NÃO CONSEGUE APRENDER {GOLPE}.",
  jaSabe: "{MON} JÁ SABE {GOLPE}.",
  aprendeu: "{MON} APRENDEU {GOLPE}!",
  sumiu: "A {ITEM} SE DESFEZ.",
  soMagikarp: "SÓ UM MAGIKARP CONSEGUE APRENDER O RAIO ETERNO. (NINGUÉM SABE POR QUÊ.)",
  ganhou: "VOCÊ GANHOU A {ITEM}!",
  lider: "PEGUE TAMBÉM ESTA MÁQUINA. É O MEU GOLPE FAVORITO.",
};
