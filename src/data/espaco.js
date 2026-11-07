// O ESPAÇO SIDERAL (pedido do CAIO, nov/2026: "faz ter como viajar pelo espaço
// sideral"). Escolhas dele: chega de FOGUETE, numa BASE ESPACIAL em CINNABAR
// depois de ser campeão; lá em cima é uma NAVE 3D num espaço 3D, e o mundo
// Pokémon tem um SISTEMA SOLAR diferente do da Terra; tem a LUA e PLANETAS
// NOVOS (um deles é o FOSSDEEP, coberto de água — ideia dele; os outros eu
// inventei), sem Pokémon novo; chegando num planeta a nave POUSA e você anda.
//
// A cena da nave é src/scenes/espaco.js. Os mapas dos planetas são PLANTAS de
// texto (o mesmo `montarGeos` de Braglitch) com o pintor `Assets.espacoArt`
// (tema "espaco"; as cores são as do planeta, `PLANETAS[i].cores`):
//   # paredão de pedra   . chão   , mato (selvagens)   ~ água   L lava
//   V nuvem sem fundo (o planeta de gás)   g gelo (escorrega)   = ponte
//   k cristal   o pedra   c cratera   t "árvore" do planeta (coral, antena...)
//   X a pista de pouso   1-9 placa

import { montarGeos } from "./braglitch.js";

/** O SISTEMA SOLAR. Posições em "mil km" (a nave anda nesse número). O sol
 *  fica no meio. `casa`: o planeta Pokémon (pousar nele = voltar pra Cinnabar). */
export const SOL = { nome: "SOL DOURADO", raio: 90, cores: ["#fff6c0", "#ffd860", "#ffa830", "#e86a18"] };

export const PLANETAS = [
  { id: "casa", nome: "PLANETA POKÉMON", raio: 26, pos: [0, 0, 620], casa: true,
    cores: ["#2a4ab0", "#3a8ae0", "#58b860", "#e8f4ff"], estilo: "terra",
    texto: "O SEU PLANETA. KANTO FICA BEM ALI, NAQUELE PEDACINHO VERDE." },
  { id: "lua", nome: "LUA", raio: 9, pos: [70, 18, 640], mapa: "espaco_lua", lua: true,
    cores: ["#4a4a58", "#8a8a98", "#c8c8d4", "#f0f0f8"], estilo: "crateras",
    texto: "A LUA DO PLANETA POKÉMON. DIZEM QUE OS CLEFAIRY VIERAM DAQUI." },
  { id: "fossdeep", nome: "FOSSDEEP", raio: 34, pos: [-420, -40, 300], mapa: "espaco_fossdeep",
    cores: ["#0a2a6a", "#1a5ab0", "#3a9ae8", "#c8f0ff"], estilo: "oceano",
    texto: "UM PLANETA INTEIRO COBERTO DE ÁGUA. SÓ TEM UNS ILHÉUS PRA PISAR." },
  { id: "magmario", nome: "MAGMÁRIO", raio: 22, pos: [260, 30, 180], mapa: "espaco_magmario",
    cores: ["#3a1008", "#8a2a10", "#e85a18", "#ffd060"], estilo: "lava",
    texto: "O MAIS PERTO DO SOL. O CHÃO É PEDRA PRETA E OS RIOS SÃO DE LAVA." },
  { id: "glacior", nome: "GLACIOR", raio: 28, pos: [-200, 60, 980], mapa: "espaco_glacior",
    cores: ["#3a5a8a", "#7ab0e0", "#c8e8ff", "#ffffff"], estilo: "gelo",
    texto: "LONGE DO SOL E CONGELADO DE PONTA A PONTA. O GELO ESCORREGA." },
  { id: "anellus", nome: "ANELLUS", raio: 52, pos: [620, -70, 900], mapa: "espaco_anellus", aneis: true,
    cores: ["#8a5a3a", "#c8905a", "#f0c890", "#fff0d8"], estilo: "faixas",
    texto: "UM GIGANTE DE GÁS COM ANÉIS. NÃO TEM CHÃO: SÓ ILHAS DE NUVEM DURA." },
  { id: "cristalla", nome: "CRISTALLA", raio: 18, pos: [-640, 90, 820], mapa: "espaco_cristalla",
    cores: ["#3a1a5a", "#8a4ac8", "#e070d8", "#ffe0ff"], estilo: "cristal",
    texto: "UM PLANETA DE CRISTAL. QUANDO O SOL BATE, ELE BRILHA DE LONGE." },
  { id: "ferronia", nome: "FERRÔNIA", raio: 20, pos: [480, 120, -260], mapa: "espaco_ferronia",
    cores: ["#2a2e38", "#5a6270", "#9aa4b4", "#e0e8f0"], estilo: "metal",
    texto: "UM PLANETA DE METAL. AS PLACAS DO CHÃO ZUMBEM COMO MÁQUINA." },
];

// --------------------------------------------------------------- as GALÁXIAS
// (pedido do CAIO: "bote outras galáxias como o de onde veio deoxys, groudon,
// kyogre e o planeta que é o ovo do arceus"). Chega-se nelas pelo HIPERESPAÇO:
// a 9999 KM/S, aperte C. Lá moram os MINI lendários (menores e mais fracos).
// `orbita`: o planeta gira em volta de um ponto (os dois PRIMAIS, um em volta do outro).
export const GALAXIAS = [
  { id: "pokemon", nome: "GALÁXIA POKÉMON", sol: SOL, fundo: [6, 6, 18], planetas: PLANETAS },
  { id: "deoxys", nome: "NEBULOSA DEOXYS", fundo: [10, 22, 14],
    sol: { nome: "ESTRELA VERDE", raio: 70, cores: ["#e8ffe0", "#a0f080", "#50c860", "#208a50"] },
    planetas: [
      { id: "dnario", nome: "DNÁRIO", raio: 30, pos: [-300, 40, 420], mapa: "espaco_dnario",
        cores: ["#1a3a2a", "#2a8a5a", "#a050d0", "#f0d0ff"], estilo: "dna",
        texto: "O PLANETA DE ONDE SAIU O METEORO DO DEOXYS. O CHÃO TEM ESPIRAIS DE DNA." },
      { id: "meteoria", nome: "METEORIA", raio: 16, pos: [380, -60, 300], mapa: "espaco_meteoria",
        cores: ["#2a2a3a", "#5a4a7a", "#8a7aa8", "#c0f0a0"], estilo: "crateras",
        texto: "UMA PEDRA GIGANTE CHEIA DE BURACOS. CHOVE METEORO AQUI O TEMPO TODO." },
    ] },
  { id: "primal", nome: "GALÁXIA PRIMAL", fundo: [20, 8, 10],
    sol: { nome: "ESTRELA ANCESTRAL", raio: 80, cores: ["#fff0e0", "#ffb080", "#e86040", "#a02020"] },
    planetas: [
      { id: "terraprimal", nome: "TERRA PRIMAL", raio: 30, mapa: "espaco_terraprimal", orbita: { centro: [0, 0, 560], raio: 90, vel: 0.08, fase: 0 },
        cores: ["#3a0a04", "#a02a10", "#ff6a20", "#ffe060"], estilo: "lava",
        texto: "O PLANETA DO GROUDON. SÓ TEM TERRA E MAGMA, E ELE GIRA EM VOLTA DO MAR PRIMAL." },
      { id: "marprimal", nome: "MAR PRIMAL", raio: 30, mapa: "espaco_marprimal", orbita: { centro: [0, 0, 560], raio: 90, vel: 0.08, fase: Math.PI },
        cores: ["#04103a", "#0a3a9a", "#2a7ae0", "#e0f4ff"], estilo: "oceano",
        texto: "O PLANETA DO KYOGRE. É SÓ ÁGUA E TEMPESTADE, GIRANDO EM VOLTA DA TERRA PRIMAL." },
    ] },
  { id: "vazio", nome: "O VAZIO", fundo: [2, 2, 4],
    sol: { nome: "LUZ DO COMEÇO", raio: 40, cores: ["#ffffff", "#fff8e0", "#f0e0b0", "#c8b080"] },
    planetas: [
      { id: "ovoarceus", nome: "O OVO DO ARCEUS", raio: 40, pos: [0, 0, 420], mapa: "espaco_ovoarceus", ovo: true,
        cores: ["#5a4010", "#b08a30", "#f0d060", "#fff8d0"], estilo: "ovo",
        texto: "UM OVO DO TAMANHO DE UM PLANETA, NO MEIO DO NADA. DIZEM QUE FOI DAQUI QUE O ARCEUS NASCEU." },
    ] },
  { id: "ultra", nome: "ULTRA ESPAÇO", fundo: [18, 6, 26],
    sol: { nome: "ESTRELA PRISMA", raio: 60, cores: ["#ffffff", "#ffe0ff", "#c080ff", "#6040c0"] },
    planetas: [
      { id: "ultraruinas", nome: "ULTRA RUÍNAS", raio: 26, pos: [260, 30, 400], mapa: "espaco_ultraruinas",
        cores: ["#1a1030", "#4a2a7a", "#c070f0", "#60f0e0"], estilo: "ultra",
        texto: "UM PLANETA DE PRÉDIOS QUEBRADOS, DE ONDE VÊM AS ULTRACRIATURAS." },
    ] },
];
/** todos os planetas de todas as galáxias (os mapas e o pintor procuram aqui) */
export const TODOS_PLANETAS = GALAXIAS.flatMap((g) => g.planetas.map((p) => ({ ...p, galaxia: g.id })));

// --------------------------------------------------------------- os mapas
const LUA = [
  "##################################",
  "##.....,,,,......c.......,,,,..###",
  "#....,,,,,,,..........o.,,,,,,...#",
  "#...,,,,,,,.....XXX.....,,,,,....#",
  "#..c..,,,.......XXX.......,,..c..#",
  "#...........1.............o......#",
  "#..o.......................c.....#",
  "#.......c........,,,,,...........#",
  "#..,,,,,........,,,,,,,......,,,.#",
  "#.,,,,,,,..o....,,,,,,,....,,,,,.#",
  "#.,,,,,,,........,,,,,....,,,,,,.#",
  "#..,,,,,....c..............,,,,..#",
  "#........................c.......#",
  "#...o.....,,,,,.....o............#",
  "#....c...,,,,,,,.........,,,,,...#",
  "#........,,,,,,,..c.....,,,,,,,..#",
  "#..,,,....,,,,,........,,,,,,,,..#",
  "#.,,,,,..........o.......,,,,,...#",
  "#..,,,.....c................c....#",
  "##.......................o......##",
  "####..c....,,,,,.....c........####",
  "##################################",
];

const FOSSDEEP = [
  "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
  "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
  "~~~~~~....~~~~~~~~~~~~~~~...~~~~~~",
  "~~~~~.,,,,..~~~~.....~~~~.,,,.~~~~",
  "~~~~.,,,,,,.~~~..XXX..~~.,,,,,.~~~",
  "~~~~.,,,t,,..===.XXX..===.,,,,.~~~",
  "~~~~~.,,,,.~~~~...1...~~~.,t,.~~~~",
  "~~~~~~....~~~~~~.....~~~~~...~~~~~",
  "~~~~~~~=~~~~~~~~~...~~~~~~~=~~~~~~",
  "~~~~~~~=~~~~~~~~~~=~~~~~~~~=~~~~~~",
  "~~~~~....~~~~~~~~~=~~~~~~~....~~~~",
  "~~~~.,,,,,.~~~~~~...~~~~~.,,,,.~~~",
  "~~~.,,,,,,,.~~~~.,,,.~~~.,,,,,,.~~",
  "~~~.,,t,,,,.====.,t,.===.,,t,,,.~~",
  "~~~.,,,,,,.~~~~~.,,,.~~~~.,,,,,.~~",
  "~~~~.,,,,.~~~~~~~...~~~~~~.,,,.~~~",
  "~~~~~....~~~~~~~~~~~~~~~~~~...~~~~",
  "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
  "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
];

const MAGMARIO = [
  "##################################",
  "#LLL....,,,,.....#####....,,,,.LL#",
  "#LL....,,,,,,....##o##...,,,,,..L#",
  "#L.....,,,,,.......XXX....,,,....#",
  "#...o...,,,........XXX.......o...#",
  "#..........LLLL.....1............#",
  "#.........LLLLLL.........LLL.....#",
  "#..,,,....LLLLLL=LLLL...LLLLL....#",
  "#.,,,,,....LLLL.=.LLL..LLLLLL..o.#",
  "#.,,,,,,........=..LL...LLLL.....#",
  "#..,,,,...o.....=.........,,,....#",
  "#.........LL....=.......,,,,,,...#",
  "#...LLL..LLLL...........,,,,,,,..#",
  "#..LLLLL..LL...o..,,,,....,,,,...#",
  "#...LLL..........,,,,,,..........#",
  "#.....,,,,.......,,,,,,....LLL...#",
  "#....,,,,,,.....o.,,,,....LLLLL..#",
  "#.....,,,,...............LLLLL...#",
  "##################################",
];

const GLACIOR = [
  "##################################",
  "#....,,,,......#####......,,,,...#",
  "#...,,,,,,......XXX.....,,,,,,...#",
  "#...,,,,,,......XXX......,,,,....#",
  "#....,,,...........1.............#",
  "#..o.......gggggggggg.......o....#",
  "#.........gggggggggggg...........#",
  "#..,,,...gggg.k..ggggggg...,,,,..#",
  "#.,,,,,..ggg.kkk.gggggggg.,,,,,,.#",
  "#.,,,,,..gggg.k.gggggggg..,,,,,,.#",
  "#..,,,....gggggggggggggg...,,,,..#",
  "#..........ggggggggggg...........#",
  "#....o.......ggggggg.......o.....#",
  "#.......,,,,,........,,,,,.......#",
  "#......,,,,,,,..t...,,,,,,,......#",
  "#.......,,,,,..ttt...,,,,,.......#",
  "#..t...........t...........t.....#",
  "##################################",
];

const ANELLUS = [
  "VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV",
  "VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV",
  "VVVV.....VVVVVVV.....VVVVVV....VVV",
  "VVV.,,,,,.VVVVV..XXX..VVVV.,,,,.VV",
  "VVV.,,,,,.======.XXX..====.,,,,.VV",
  "VVV.,,,,,.VVVVV...1...VVVV.,,,,.VV",
  "VVVV.....VVVVVVV.....VVVVVV....VVV",
  "VVVVVV=VVVVVVVVVV...VVVVVVVVV=VVVV",
  "VVVVVV=VVVVVVVVVVV=VVVVVVVVVV=VVVV",
  "VVVV.....VVVVVVV.....VVVVVV....VVV",
  "VVV.,,,,,,.VVVV.,,,,,.VVVV.,,,,.VV",
  "VVV.,,,,,,.====.,,o,,.====.,,,,.VV",
  "VVV.,,,,,,.VVVV.,,,,,.VVVV.,,,,.VV",
  "VVVV......VVVVVV.....VVVVVV....VVV",
  "VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV",
  "VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV",
];

const CRISTALLA = [
  "##################################",
  "#kk...,,,,....k.......k...,,,,..k#",
  "#k...,,,,,,.....XXX......,,,,,,..#",
  "#....,,,,,,.....XXX.......,,,,...#",
  "#.....,,,....k.....1...k.........#",
  "#..k.........kk......kk......k...#",
  "#.........,,,.k......k.,,,.......#",
  "#..,,,...,,,,,..........,,,,,....#",
  "#.,,,,,..,,,,,,...kkk...,,,,,,...#",
  "#.,,,,,...,,,,...kkkkk...,,,,..k.#",
  "#..,,,..k.........kkk............#",
  "#......kkk......................k#",
  "#.......k....,,,,,......,,,,,....#",
  "#...........,,,,,,,....,,,,,,,...#",
  "#..k.........,,,,,..k...,,,,,..k.#",
  "#kk......k..........kk.........kk#",
  "##################################",
];

const FERRONIA = [
  "##################################",
  "#t.....,,,,......t....t....,,,,.t#",
  "#.....,,,,,,....XXX.......,,,,,,.#",
  "#.....,,,,,,....XXX.......,,,,,,.#",
  "#......,,,,........1.......,,,,..#",
  "#..o.............................#",
  "#........t..........t............#",
  "#..,,,,.....oo...........,,,,....#",
  "#.,,,,,,....oo..........,,,,,,...#",
  "#.,,,,,,.........t......,,,,,,...#",
  "#..,,,,...................,,,....#",
  "#..........t.......o.............#",
  "#....,,,,,.....,,,,,....,,,,,....#",
  "#...,,,,,,,...,,,,,,,..,,,,,,,...#",
  "#....,,,,,.....,,,,,....,,,,,..t.#",
  "#t...........t.........t.........#",
  "##################################",
];

// O OVO DO ARCEUS: a casca dourada, com rachaduras de luz (c) e cristais (k)
const OVO = [
  "##################################",
  "#k.....,,,,.....c......,,,,....k.#",
  "#.....,,,,,,....XXX...,,,,,,.....#",
  "#.....,,,,,,....XXX....,,,,,.....#",
  "#..c...,,,.........1.......c.....#",
  "#.........c.............c........#",
  "#..,,,,......kkk.....,,,,,,......#",
  "#.,,,,,,....kkkkk...,,,,,,,,..c..#",
  "#.,,,,,,.....kkk.....,,,,,,......#",
  "#..,,,,..c...........c...........#",
  "#...........,,,,,,,..............#",
  "#..k.......,,,,,,,,,......c...k..#",
  "#...........,,,,,,,..............#",
  "#k......c..........c...........k.#",
  "##################################",
];

// a BASE ESPACIAL (aonde a cientista de Cinnabar leva): a pista e o foguete
const BASE = [
  "######################",
  "#t..................t#",
  "#.....XXX.....o......#",
  "#.....XXX............#",
  "#....................#",
  "#..o.....1.......o...#",
  "#....................#",
  "#t........t.........t#",
  "######################",
];

// O CÉU DAS NUVENS (pedido do CAIO: "se ir no olho do furacão vc vai pras
// nuvens"): ilhas de nuvem ligadas por pontes, em cima de KANTO. Só se chega
// pelo OLHO DO TORNADO (src/scenes/overworld.js, desenharTornado); o ALTARIA
// leva de volta pro lugar de onde o tornado te puxou.
const NUVENS = [
  "VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV",
  "VVVVVV......VVVVVVVVVVV.....VVVVVV",
  "VVVV..,,,,,,..VVVVVVV..,,,,,..VVVV",
  "VVV..,,,,,,,,.=======.,,,,,,,..VVV",
  "VVV..,,,,,,,..VVVVVVV..,,,,,..VVVV",
  "VVVV...1....VVVVVVVVVVV.....VVVVVV",
  "VVVVVV..VVVVVVVVVVVVVVVVVV.VVVVVVV",
  "VVVVVVV=VVVVVVVVVVVVVVVVVV=VVVVVVV",
  "VVVVVV....VVVVV......VVVV....VVVVV",
  "VVVV..,,,,..===..,,,,..===..,,..VV",
  "VVVV..,,,,,.VVV.,,,,,,.VVV.,,,,.VV",
  "VVVVV......VVVV........VVVV....VVV",
  "VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV",
];
for (const l of NUVENS) if (l.length !== 34) throw new Error("NUVENS: linha com " + l.length);

const PLANTAS = { espaco_base: BASE, espaco_lua: LUA, espaco_fossdeep: FOSSDEEP, espaco_magmario: MAGMARIO, espaco_glacior: GLACIOR,
                  espaco_anellus: ANELLUS, espaco_cristalla: CRISTALLA, espaco_ferronia: FERRONIA,
                  // as outras galáxias (as plantas repetem o jeito; as cores e os bichos são outros)
                  espaco_dnario: CRISTALLA, espaco_meteoria: LUA, espaco_terraprimal: MAGMARIO,
                  espaco_marprimal: FOSSDEEP, espaco_ovoarceus: OVO, espaco_ultraruinas: FERRONIA,
                  ceu_nuvens: NUVENS };

export function montarEspaco(kanto) {
  const temas = Object.fromEntries(Object.keys(PLANTAS).map((k) => [k, "espaco"]));
  return montarGeos(kanto, { plantas: PLANTAS, interiores: {}, temas, cidadePadrao: "espaco_lua", marca: {} });
}

// --------------------------------------------------------------- quem mora lá
const sel = (lista, min, max) => lista.split(" ").map((id) => ({ id, min, max, w: 4 }));
const mini = (lista, min, max, w) => lista.split(" ").map((id) => ({ id, min, max, w, mini: true }));
const SELVAGENS = {
  espaco_lua: sel("clefairy clefable cleffa lunatone solrock minior elgyem beheeyem staryu starmie", 55, 64),
  espaco_fossdeep: sel("wailmer wailord lapras chinchou lanturn mantine mantyke corsola relicanth kingdra horsea seadra dhelmise clauncher clawitzer", 58, 66),
  espaco_magmario: sel("slugma magcargo torkoal numel camerupt magmar magby heatmor sizzlipede centiskorch rolycoly carkol coalossal salandit", 60, 68),
  espaco_glacior: sel("snorunt glalie froslass cubchoo beartic bergmite avalugg frigibax arctibax spheal sealeo walrein vanillite cryogonal", 60, 68),
  espaco_anellus: sel("drifloon drifblim swablu altaria castform gastly haunter koffing weezing hoothoot noctowl rotom flittle espathra", 62, 70),
  espaco_cristalla: sel("carbink sableye roggenrola boldore gigalith glimmet glimmora nosepass probopass onix steelix diglett", 62, 70),
  // os MINI lendários: menores e mais fracos (`mini`, src/systems/encounters.js)
  espaco_dnario: [...sel("elgyem beheeyem minior", 40, 48), ...mini("deoxys deoxysataque deoxysdefesa deoxysvelocidade", 25, 35, 3),
                  ...sel("celulazygarde", 20, 30)],     // as CÉLULAS DE ZYGARDE (src/data/extra.js)
  espaco_meteoria: [...sel("minior solrock lunatone elgyem", 40, 48), ...mini("deoxys", 25, 35, 3), ...mini("jirachi", 25, 35, 2)],
  espaco_terraprimal: [...sel("numel camerupt torkoal magcargo", 45, 55), ...mini("groudon", 28, 38, 5)],
  espaco_marprimal: [...sel("carvanha sharpedo wailord lanturn huntail gorebyss", 45, 55), ...mini("kyogre", 28, 38, 5)],
  espaco_ovoarceus: [...sel("unown jirachi mew", 45, 55), ...mini("dialga palkia giratina", 30, 40, 2), ...mini("arceus", 30, 40, 1)],
  espaco_ultraruinas: [...mini("nihilego buzzwole pheromosa xurkitree celesteela kartana guzzlord stakataka blacephalon", 30, 40, 3), ...sel("poipole", 40, 48)],
  espaco_ferronia: sel("klink klang klinklang magnemite magneton magnezone bronzor bronzong beldum metang varoom revavroom tinkatink orthworm", 64, 72),
};

/** onde fica a nave pousada (o foguete) e onde você aparece, em cada mapa:
 *  o primeiro X da planta é o canto de cima da pista */
function pista(planta) {
  for (let y = 0; y < planta.length; y++) { const x = planta[y].indexOf("X"); if (x >= 0) return { x: x + 1, y: y + 1 }; }
  return { x: 2, y: 2 };
}

export const ESPACO = {
  requer: "kantoCampeao",
  // a BASE ESPACIAL em CINNABAR: o foguete e a cientista
  // a cientista em CINNABAR leva pra BASE ESPACIAL (um mapa só dela: Cinnabar já é lotada)
  cinnabar: { mapa: "cinnabar_island", guia: { x: 19, y: 13 }, chega: { x: 19, y: 14, dir: "down" } },
  base: { mapa: "espaco_base", chega: { x: 7, y: 5, dir: "down" } },
  textos: {
    cientista: ["ESTA É A BASE ESPACIAL DE CINNABAR!", "O FOGUETE ESTÁ PRONTO. SÓ UM CAMPEÃO PODE PILOTAR."],
    guia: ["VOCÊ É O CAMPEÃO? A BASE ESPACIAL DE CINNABAR ESTÁ TE ESPERANDO!", "FICA DO OUTRO LADO DA ILHA. EU TE LEVO."],
    perguntaGuia: "IR PRA BASE ESPACIAL?",
    opcoesGuia: ["IR", "AGORA NÃO"],
    indoBase: ["(VOCÊS ATRAVESSAM A ILHA ATÉ A BASE ESPACIAL.)"],
    perguntaVolta: "VOLTAR PRA CINNABAR?",
    indoCidade: ["(VOCÊ VOLTA PRA CIDADE DE CINNABAR.)"],
    pergunta: "DECOLAR PRO ESPAÇO?",
    opcoes: ["DECOLAR", "AGORA NÃO"],
    naoQuer: ["TUDO BEM. ELE FICA AQUI TE ESPERANDO."],
    contagem: ["3...", "2...", "1...", "DECOLAR!"],
    pousou: (nome) => [`(A NAVE POUSOU EM ${nome}.)`],
    voltou: ["(A NAVE POUSOU DE VOLTA NA BASE DE CINNABAR.)"],
    naveNoChao: ["A NAVE ESTÁ AQUI, ESFRIANDO OS MOTORES."],
    ajuda: "◀▶▲▼ VIRA  ESPAÇO ACELERA  X FREIA",
    perto: (nome) => `A: POUSAR EM ${nome}`,
    hiper: "C: HIPERESPAÇO!",
    perguntaHiper: "PRA QUAL GALÁXIA?",
    chegouHiper: (nome) => `(A NAVE SAIU DO HIPERESPAÇO NA ${nome}.)`,
    perguntaPousar: (nome) => `POUSAR EM ${nome}?`,
    opcoesPousar: ["POUSAR", "CONTINUAR VOANDO"],
  },
};

const PLACA = {
  espaco_dnario: "DNÁRIO\nAQUI O DNA FAZ ESPIRAL NO CHÃO. OS DEOXYS NASCEM PEQUENINHOS.",
  espaco_meteoria: "METEORIA\nCUIDADO COM A CABEÇA: CHOVE METEORO.",
  espaco_terraprimal: "TERRA PRIMAL\nO CHÃO TREME QUANDO UM MINI GROUDON PASSA.",
  espaco_marprimal: "MAR PRIMAL\nA TEMPESTADE NUNCA PARA. OS MINI KYOGRE ADORAM.",
  espaco_ovoarceus: "O OVO DO ARCEUS\nA CASCA É QUENTINHA. LÁ DENTRO ALGUMA COISA BATE, DEVAGAR.",
  espaco_ultraruinas: "ULTRA RUÍNAS\nNINGUÉM SABE QUEM MOROU NESTES PRÉDIOS.",
  espaco_lua: "LUA\nPOUCA GRAVIDADE: OS CLEFAIRY PULAM ALTO AQUI.",
  espaco_fossdeep: "FOSSDEEP\nO MAR NÃO TEM FUNDO. NÃO CAIA DA PONTE!",
  espaco_magmario: "MAGMÁRIO\nNÃO ENCOSTE NA LAVA. SÉRIO.",
  espaco_glacior: "GLACIOR\nO LAGO É DE GELO PURO E ESCORREGA.",
  espaco_anellus: "ANELLUS\nAS ILHAS SÃO NUVEM DURA. EMBAIXO NÃO TEM NADA.",
  espaco_cristalla: "CRISTALLA\nTODO CRISTAL DAQUI CANTA QUANDO O VENTO PASSA.",
  espaco_ferronia: "FERRÔNIA\nNINGUÉM SABE QUEM CONSTRUIU AS ANTENAS." };

/** o conteúdo de cada mapa (formato de src/data/maps.js) */
export const CONTEUDO_ESPACO = Object.fromEntries(Object.entries(PLANTAS).filter(([id]) => id !== "espaco_base" && id !== "ceu_nuvens").map(([id, planta]) => {
  const p = TODOS_PLANETAS.find((q) => q.mapa === id), pi = pista(planta);
  return [id, {
    name: p.nome, music: "era_futuro", interior: false, encounters: SELVAGENS[id] || [],
    espaco: p.id,
    spawn: { x: pi.x, y: pi.y + 2, dir: "down" },
    placas: { 1: PLACA[id] },
    npcs: [{ id: "nave_" + p.id, x: pi.x, y: pi.y, dir: "down", sprite: "foguete", foguete: p.id, lines: ESPACO.textos.naveNoChao }],
  }];
}));

// O ESQUELETO DO CYRUS (o líder da EQUIPE GALÁCTICA), no ANELLUS — o "JÚPITER"
// deste sistema (pedido do CAIO). Ele sumiu atrás de um mundo novo e veio parar aqui.
CONTEUDO_ESPACO.espaco_anellus.npcs.push({
  id: "esqueleto_cyrus", x: 6, y: 13, dir: "down", sprite: "esqueleto",
  lines: ["É UM ESQUELETO... COM O UNIFORME DA EQUIPE GALÁCTICA!",
          "ELE ESTÁ CAÍDO NA NUVEM DURA. NO BOLSO, UM CRACHÁ: CYRUS, LÍDER DA EQUIPE GALÁCTICA.",
          "DO LADO, UM CADERNO: \"EU QUERIA UM UNIVERSO SÓ MEU, SEM ESPÍRITO NENHUM. ACHEI UM PLANETA SEM CHÃO.\"",
          "\"...DEVIA TER TRAZIDO UMA NAVE DE VOLTA.\""],
  afterLines: ["O ESQUELETO DO CYRUS CONTINUA OLHANDO PRO ESPAÇO."],
});

// O SEGREDO DA LUA (pedido do CAIO): uma roda de BEHEEYEM tentando tirar a
// MOEDA DA TESTA do MEOWTH. Ele não deixa.
CONTEUDO_ESPACO.espaco_lua.npcs.push(
  { id: "lua_meowth", x: 16, y: 12, dir: "down", sprite: "mon:meowth",
    lines: ["UM MEOWTH NA LUA?! ELE ESTÁ SEGURANDO A MOEDA DA TESTA COM AS DUAS PATAS.",
            "MEOWTH: MIAAAU! ESSA MOEDA É MINHA! SAIAM DAQUI, CABEÇUDOS!",
            "OS BEHEEYEM PISCAM AS LUZINHAS DAS MÃOS E PUXAM A MOEDA COM PSÍQUICO...",
            "...MAS ELA NÃO SAI. ESTÁ GRUDADA NA TESTA DELE DESDE QUE ELE NASCEU."],
    afterLines: ["MEOWTH: NEM ADIANTA! JÁ TENTARAM ME TROCAR POR TRÊS MOEDAS DA LUA!"] },
  { id: "lua_beheeyem1", x: 15, y: 12, dir: "right", sprite: "mon:beheeyem",
    lines: ["BEHEEYEM: BIP... BIP BOP. (AS LUZES DA MÃO PISCAM: VERMELHO, AMARELO, VERDE.)",
            "ELE ACHA QUE A MOEDA DO MEOWTH É UMA ANTENA PRA FALAR COM A NAVE DELES."] },
  { id: "lua_beheeyem2", x: 17, y: 12, dir: "left", sprite: "mon:beheeyem",
    lines: ["BEHEEYEM: BOP BOP BIIIP!", "ELE ESTÁ PUXANDO A MOEDA COM TODA A FORÇA DA MENTE. A TESTA DO MEOWTH ESTICOU UM POUQUINHO."] },
  { id: "lua_beheeyem3", x: 16, y: 10, dir: "down", sprite: "mon:beheeyem",
    lines: ["BEHEEYEM: BIIIIP...", "ESSE AQUI DESISTIU DE PUXAR. AGORA ESTÁ SÓ OLHANDO A MOEDA BRILHAR."] },
  { id: "lua_elgyem", x: 16, y: 13, dir: "up", sprite: "mon:elgyem",
    lines: ["UM ELGYEM PEQUENININHO ESTÁ ANOTANDO TUDO NUM CADERNO.", "NA CAPA: \"PROJETO MOEDA. TENTATIVA Nº 4.096.\""] },
);

// MAIS SEGREDOS NOS PLANETAS (pedido do CAIO: "e os outros eastereggs?")
const segredo = (mapa, lista) => CONTEUDO_ESPACO[mapa]?.npcs.push(...lista.map(([id, x, y, dir, mon, lines]) =>
  ({ id: "segredo_" + id, x, y, dir, sprite: "mon:" + mon, lines })));
segredo("espaco_magmario", [
  ["torkoal", 15, 2, "left", "torkoal", ["UM TORKOAL ESTÁ FAZENDO CHURRASCO NO CHÃO DE LAVA.", "NO ESPETO: TRÊS BERRIES E UM MARSHMALLOW. O MARSHMALLOW JÁ PEGOU FOGO."]],
  ["charmander", 14, 2, "right", "charmander", ["CHARMANDER: CHAR! CHARMAAAN!", "ELE VEIO DE KANTO SÓ PRA ACENDER O CHURRASCO COM O RABO. NINGUÉM AVISOU QUE AQUI O CHÃO JÁ É FOGO."]],
]);
segredo("espaco_glacior", [
  ["snorlax", 12, 2, "down", "snorlax", ["UM SNORLAX CONGELADO DENTRO DE UM BLOCO DE GELO.", "...ELE ESTÁ RONCANDO. DORMIU TANTO QUE O PLANETA CONGELOU EM VOLTA DELE."]],
  ["spheal", 13, 2, "left", "spheal", ["SPHEAL: SPHEEE!", "ELE ESTÁ LAMBENDO O GELO DO SNORLAX. DIZ QUE TEM GOSTO DE SORVETE DE BERRY."]],
]);
segredo("espaco_anellus", [
  ["rayquaza", 16, 11, "left", "rayquaza", ["UM RAYQUAZA BEM PEQUENININHO, ENROLADO NUM DOS ANÉIS DO PLANETA.", "ELE ESTÁ OLHANDO PRO ESQUELETO DO CYRUS. ACHO QUE FOI ELE QUE NÃO DEIXOU O CYRUS IR EMBORA."]],
]);
segredo("espaco_cristalla", [
  ["sableye", 12, 2, "right", "sableye", ["UM SABLEYE ESCONDIDO ATRÁS DE UMA PEDRA, MASTIGANDO CRISTAL.", "CRUNCH CRUNCH. OS OLHOS DE DIAMANTE DELE BRILHAM DE FELICIDADE."]],
  ["carbink", 13, 2, "left", "carbink", ["CARBINK: ...!", "ELE ESTÁ TREMENDO DE MEDO. O SABLEYE JÁ ESTÁ OLHANDO PRAS PEDRINHAS DA CABEÇA DELE."]],
]);
segredo("espaco_ferronia", [
  ["magneton", 12, 2, "down", "magneton", ["TRÊS MAGNEMITE VIERAM PRO PLANETA DE FERRO SEPARADOS...", "...E GRUDARAM UM NO OUTRO SEM QUERER. VIRARAM UM MAGNETON POR ACIDENTE.", "ELES ESTÃO TENTANDO SE DESGRUDAR HÁ TRÊS DIAS."]],
  ["magnemite", 13, 2, "left", "magnemite", ["UM MAGNEMITE SOZINHO, BEM LONGE DO CHÃO.", "ELE ESTÁ COM MEDO DE ENCOSTAR NO FERRO E VIRAR MAGNETON TAMBÉM."]],
]);
segredo("espaco_dnario", [
  ["ditto", 12, 2, "right", "ditto", ["UM DITTO TENTANDO SE TRANSFORMAR NO DEOXYS.", "SAIU UMA GELEIA ROSA COM DUAS ANTENAS E A CARA DE SEMPRE. QUASE!"]],
  ["deoxys", 13, 2, "left", "deoxys", ["DEOXYS: ...", "O DEOXYS ESTÁ TROCANDO DE FORMA PRA ENSINAR O DITTO. ATAQUE, DEFESA, VELOCIDADE... O DITTO NÃO ESTÁ ACOMPANHANDO."]],
]);
segredo("espaco_meteoria", [
  ["jirachi", 12, 2, "down", "jirachi", ["UM JIRACHI DORMINDO EM CIMA DE UM METEORO.", "TEM UMA PLAQUINHA DO LADO: \"NÃO ACORDAR. VOLTO DAQUI A 1000 ANOS.\"", "ALGUÉM ESCREVEU EMBAIXO: \"PEDI UM POKÉMON SHINY. AINDA ESPERANDO.\""]],
  ["clefairy", 13, 2, "left", "clefairy", ["UM CLEFAIRY COM UM CAPACETE DE ASTRONAUTA FEITO DE AQUÁRIO.", "CLEFAIRY: CLEF! CLEF! (ELE ESTÁ FAZENDO SILÊNCIO PRO JIRACHI.)"]],
]);
segredo("espaco_terraprimal", [
  ["numel", 15, 2, "down", "numel", ["UM NUMEL COM UM OVO FRITANDO NAS COSTAS.", "O CHÃO DAQUI É TÃO QUENTE QUE A CORCOVA DELE VIROU FRIGIDEIRA."]],
]);
segredo("espaco_marprimal", [
  ["magikarp", 26, 3, "left", "magikarp", ["UM MAGIKARP COM UMA COROA NA CABEÇA.", "ELE SE CHAMA DE \"REI DO MAR PRIMAL\". O KYOGRE AINDA NÃO FICOU SABENDO.", "MAGIKARP: SPLASH! SPLASH! (NADA ACONTECEU.)"]],
]);
segredo("espaco_ovoarceus", [
  ["togepi", 12, 2, "down", "togepi", ["UM TOGEPI SENTADO NA FRENTE DO OVO GIGANTE DO ARCEUS.", "ELE ACHA QUE É IRMÃO DO ARCEUS. AFINAL, OS DOIS SAÍRAM DE UM OVO."]],
]);
segredo("espaco_ultraruinas", [
  ["rowlet", 12, 2, "right", "rowlet", ["UM ROWLET MONTADO NO CELESTEELA.", "ELE ACHA QUE O CELESTEELA É UM FOGUETE. NO FUNDO... ELE NÃO ESTÁ ERRADO."]],
  ["celesteela", 13, 2, "left", "celesteela", ["CELESTEELA: ...", "O CELESTEELA ESTÁ PARADO HÁ HORAS PRO ROWLET NÃO CAIR. QUE GIGANTE GENTIL."]],
]);

CONTEUDO_ESPACO.ceu_nuvens = {
  name: "CÉU DAS NUVENS", music: "era_futuro", interior: false,
  encounters: sel("swablu altaria pidgeot fearow castform drifloon drifblim rufflet braviary skarmory togekiss", 40, 50),
  spawn: { x: 16, y: 9, dir: "down" },
  placas: { 1: "CÉU DAS NUVENS\nAQUI EM CIMA O VENTO NUNCA PARA. QUEM TROUXE VOCÊ FOI O TORNADO." },
  npcs: [{ id: "altaria_volta", x: 18, y: 9, dir: "left", sprite: "mon:altaria", voltaNuvens: true,
           lines: ["UM ALTARIA FOFINHO, DE ASAS DE ALGODÃO.", "ELE OLHA PRA BAIXO E DEPOIS PRA VOCÊ. QUER QUE ELE TE LEVE DE VOLTA?"] }],
};

CONTEUDO_ESPACO.espaco_base = {
  name: "BASE ESPACIAL", music: "era_futuro", interior: false, encounters: [],
  spawn: { x: 7, y: 5, dir: "down" },
  placas: { 1: "BASE ESPACIAL DE CINNABAR\nSÓ CAMPEÕES PODEM PILOTAR O FOGUETE." },
  npcs: [
    { id: "foguete_base", x: 7, y: 3, dir: "down", sprite: "foguete", foguete: "casa", lines: ["O FOGUETE ESTÁ PRONTO PRA DECOLAR."] },
    { id: "cientista_base", x: 11, y: 4, dir: "left", sprite: "cientista", foguete: "casa",
      lines: ["ESTA É A BASE ESPACIAL! O FOGUETE ESTÁ PRONTO.", "LÁ EM CIMA TEM A LUA E SEIS PLANETAS QUE NINGUÉM DE KANTO PISOU AINDA."] },
    { id: "volta_base", x: 4, y: 6, dir: "right", sprite: "tecnico", voltaBaseEspacial: true,
      lines: ["QUER VOLTAR PRA CIDADE DE CINNABAR?"] },
  ],
};

/** a BASE em CINNABAR: só depois da LIGA. Chamado no fim do `buildDB`. */
export function porBaseEspacial(db) {
  const v = db.MAPS?.[ESPACO.cinnabar.mapa];
  if (!v) return;
  const mostrar = (st) => !!st.flags?.[ESPACO.requer];
  v.npcs = [...(v.npcs || []).filter((n) => !String(n.id).endsWith("_espaco")),
    { id: "guia_espaco", ...ESPACO.cinnabar.guia, dir: "down", sprite: "cientista", irBaseEspacial: true, lines: ESPACO.textos.guia, mostrar }];
}
