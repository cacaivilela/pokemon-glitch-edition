// ALOLA (pedido do CAIO, 09/nov/2026): "vc redesenha alola! mas nomes das
// ilhas, cidades, etc. ficam iguais". O DESENHO é todo nosso (o formato das
// ilhas vem do Havaí de verdade, que inspirou a Alola dos jogos), a HISTÓRIA
// e as PESSOAS também (o PROF. KOA e o KAHUNA MAKOA foram inventados aqui).
// Só os NOMES dos lugares são os de lá.
//
// PARTE 1: MELEMELE. Chega-se de AVIÃO (o mesmo piloto de Kalos, src/data/kalos.js
// `AVIAO`): HAU'OLI (a cidade, com praia, Centro, loja, aeroporto e o
// laboratório do PROF. KOA, que dá um dos três iniciais de Alola), a ROTA 1
// subindo até IKI (a vila no alto, com o PALCO e o KAHUNA MAKOA: o GRANDE
// DESAFIO de Melemele), a TRILHA DA ILHA e a PRAIA DE MELEMELE.
// As PROVAÇÕES (os totens e os cristais Z, src/data/provacoes.js) estão se
// mudando de Kanto pra Alola: as quatro primeiras (NORMAL, LUTADOR, VOADOR,
// VENENO) já estão em Melemele; as outras vêm com as próximas ilhas.
//
// A PLANTA usa os caracteres de Braglitch (dev/LUGARES.md), no tema "litoral".
// Teste: ?map=hauoli&x=27&y=12&perfil=teste
import { montarGeos } from "./braglitch.js";
import { saidaDe } from "./braglitch-mundo.js";

const PLANTA_HAUOLI = [
  "###################PP###################",
  "###################PP###################",
  "#..................PP..................#",
  "#.................1PP..................#",
  "#..................PP..................#",
  "#..................PP..................#",
  "#..................PP..LLLLLLLL........#",
  "#...CCCCCC..MMMMM..PP..LLLLLLLL..hhhh..#",
  "#...CCCCCC..MMMMM..PP..LLLLLLLL..hhhh..#",
  "#...CCCCCC..MMMMM..PP..LLLLLLLL..hhhh..#",
  "#......D......D....PP......D.......D...#",
  "#.PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP.#",
  "#.PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP.#",
  "#..................PP2.................#",
  "#..............FFF.PP.FFF..............#",
  "#..............FFF.PP.FFF..............#",
  "#...hhhh..hhhh.FFF.PP...HHHHH...hhhh...#",
  "#...hhhh..hhhh.FFF.PP.KKHHHHH...hhhh...#",
  "#...hhhh..hhhh.FFF.PP.KKHHHHH...hhhh...#",
  "#.....D.....D......PP.....D.......D....#",
  "#..Y..P..Y..P..Y...PP....YP....Y..P..Y.#",
  "#.PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP.#",
  "#.PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP.#",
  "#aaaaaaaaaaaaaaaa3aaaaaaaaaaaaaaaaaaaaPP",
  "#aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaPP",
  "#aaaaYaaaaaaYaaaaaaaaaaaaaaaaYaaaaaYaaa#",
  "#aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa#",
  "~~~~~~~~~~~~~~~~~~~~~==~~~~~~~~~~~~~~~~~",
  "~~~~~~~~~~~~~~~~~~~~~==~~~~~~~~~~~~~~~~~",
  "~~~~~~~~~~~~~~~~~~~~~==~~~~~~~~~~~~~~~~~",
  "~~~~~~~~~~~~~~~~~~~~~==~~~~~~~~~~~~~~~~~",
  "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
];
const PLANTA_ROTA1_ALOLA = [
  "##############PP##############",
  "##............PP............##",
  "##............PP2...........##",
  "##.,,,,,,,,,..PP........,,,,##",
  "##.,,,,,,,,,..PP........,,,,##",
  "##.,,,,,,,,,..PP........,,,,##",
  "##.,,,,,,,,,..PP..#.....,,,,##",
  "##.,,,,,,,,,..PP........,,,,##",
  "##.,,,,,,,,,..PP........,,,,##",
  "##.,,,,,,,,,..PP........,,,,##",
  "##............PP........,,,,##",
  "##............PPPPPPPPP.,,,,##",
  "##............PPPPPPPPP.,,,,##",
  "##...................PP.,,,,##",
  "##..#....,,,,,,,,,,..PP.,,,,##",
  "##.......,,,,,,,,,,..PP.,,,,##",
  "##.......,,,,,,,,,,..PP.....##",
  "##.......,,,#,,,,,,..PP.....##",
  "##.......,,,,,,,,,,..PP.....##",
  "##.......,,,,,,,,,,..PP.....##",
  "##.......,,,,,,,,,,..PP..#..##",
  "##.......,,,,,,,,,,..PP.....##",
  "##...................PP.o...##",
  "##....PPPPPPPPPPPPPPPPP.....##",
  "##....PPPPPPPPPPPPPPPPP.....##",
  "##....PP....................##",
  "##..#.PP....................##",
  "##....PP.........,,,,,,,,,..##",
  "##....PP..#......,,,,,,,,,..##",
  "##....PP.........,,,,,,,,,..##",
  "##....PP.o.......,,,,,,,,,..##",
  "##....PP.........,,,,,,,,,..##",
  "##....PP.........,,,,,,,,,#.##",
  "##....PPPPPPPPPP.,,,,,,,,,..##",
  "##....PPPPPPPPPP.,,,,,,,,,..##",
  "##............PP.,,,,,,,,,..##",
  "##.,,,,,,,,,..PP.,,,,,,,,,..##",
  "##.,,,,,,,,,..PP.,,,,,,,,,..##",
  "##.,,,,,,,,,..PP.,,,,,,,,,..##",
  "##.,,,,,,,,,..PP............##",
  "##.,,,,,,,,,..PP1..o........##",
  "##.,,,,,,,,,..PP............##",
  "##............PP............##",
  "##############PP##############",
];
const PLANTA_IKI = [
  "####################################",
  "#..................................#",
  "#.FFFFFFF...KKKKKKKKKKKK...FFFFFFF.#",
  "#.FFFFFFF...KKKKKKKKKKKK...FFFFFFF.#",
  "#.FFFFFFF...KKKKKKKKKKKK...FFFFFFF.#",
  "#..............eeeeee..............#",
  "#.........Y....eeeeee....Y.........#",
  "#..............eeeeee2.............#",
  "#..............eePPee..............#",
  "#...HHHHH........PPPPPPPPPPPPPPPPPPP",
  "#...HHHHH........PPPPPPPPPPPPPPPPPPP",
  "#...HHHHH........PP................#",
  "#.....D..........PP................#",
  "#.....PPPPPPPPPPPPPPPPPPPPPPPPP....#",
  "#.....PPPPPPPPPPPPPPPPPPPPPPPPP....#",
  "#................PP................#",
  "#...hhhh..hhhh...PP.....hhhh.hhhh..#",
  "#...hhhh..hhhh...PP.....hhhh.hhhh..#",
  "#...hhhh..hhhh...PP.....hhhh.hhhh..#",
  "#.....D.....D....PP.......D....D...#",
  "#.....PPPPPPPPPPPPPPPPPPPPPPPPPP...#",
  "#................PP................#",
  "#................PP................#",
  "#................PP................#",
  "#.Y..............PP..............Y.#",
  "#...........Y....PP....Y...........#",
  "#................PP1...............#",
  "#................PP................#",
  "#................PP................#",
  "#################PP#################",
];
const PLANTA_TRILHA_MELEMELE = [
  "########################################",
  "#......................................#",
  "#.................,,,,,,,,,......~~~~~~#",
  "#.................,,,,,,,,,..PP..~~~~~~#",
  "#...Y...o.........,,,,,,,,,..PP..~~~~~~#",
  "#...........o.....,,,,,,,,,..PP..~~~~~~#",
  "#.................,,,,,,,,,..PP..~~~~~~#",
  "#.................,,,,,,,,,..PP........#",
  "#.1..........................PP........#",
  "PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP.....o..#",
  "PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP........#",
  "#............................PP........#",
  "#............................PP..,,,,,.#",
  "#..,,,,,,,,,,,,..............PP..,,,,,.#",
  "#..,,,,,,,,,,,,..............PP..,,,,,.#",
  "#..,,,,,,,,,,,,.......o......PP..,,,,,.#",
  "#..,,,,,,,,,,,,..............PP..,,,,,.#",
  "#..,,,,,,,,,,,,.Y............PP..,,,,,.#",
  "#..,,,,,,,,,,,,.........o....PP..,,,,,.#",
  "#..,,,,,,,,,,,,..............PP..,,,,,.#",
  "#..,,,,,,,,,,,,..............PP..,,,,,.#",
  "#..................................Y...#",
  "#......................................#",
  "########################################",
];
const PLANTA_PRAIA_MELEMELE = [
  "##################################",
  "#aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa#",
  "#a..............................a#",
  "#a..,,,,,,,,,.......,,,,,,,,,,..a#",
  "#a..,,,,,,,,,.......,,,,,,,,,,..a#",
  "#a..,,,,,,,,,.......,,,,,,,,,,..a#",
  "#a..............................a#",
  "#aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa#",
  "#aaaaaaaaaaaaaaaYaaaaaaaaaaaaaaaa#",
  "#aaYaaaaaaaaaaaaaaaaaaaaaaaaYaaaa#",
  "#aaaa1aaaaaaaaaaaaaaaaaaaaaaaaaaa#",
  "#aaaaaaaaYaaaaaaaaaaaaaaaaaaaaaaa#",
  "#aaaaaaaaaaaaaaaaaaaaaYaaaaaaaaaa#",
  "#aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa#",
  "#aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaYa#",
  "#aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa#",
  "#aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa#",
  "PPaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa#",
  "PPaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa#",
  "~~~~~~~~~~~~~~==~~~~~~~~~~~~~~~~~~",
  "~~~~~~~~~~~~~~==~~~~~~~~~~~~~~~~~~",
  "~~~~~~~~~~~~~~==~~~~~~~~~~~~~~~~~~",
  "~~~~~~~~~~~~~~==~~~~~~~~~~~~~~~~~~",
  "~~~~~~~~~~~~~~==~~~~~~~~~~~~~~~~~~",
  "~~~~~~~~~~~~~~==~~~~~~~~~~~~~~~~~~",
  "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
  "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
  "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
];

const PLANTAS = {
  hauoli: PLANTA_HAUOLI, rota1_alola: PLANTA_ROTA1_ALOLA, iki: PLANTA_IKI,
  trilha_melemele: PLANTA_TRILHA_MELEMELE, praia_melemele: PLANTA_PRAIA_MELEMELE,
};

/** os interiores: cópia dos de Kanto, com a porta apontando pra cidade */
const INTERIORES = {
  hauoli_pokemon_center_1f: { de: "center", predio: "C", cidade: "hauoli" },
  hauoli_loja: { de: "mart", predio: "M", cidade: "hauoli" },
  hauoli_aeroporto: { de: "mart", predio: "L", cidade: "hauoli" },
  hauoli_laboratorio: { de: "home", predio: "H", cidade: "hauoli" },
  iki_casa_kahuna: { de: "home", predio: "H", cidade: "iki" },
};

export const PORTA_FECHADA_ALOLA = {
  h: ["ALOHA! ...NINGUÉM ATENDE. DEVEM ESTAR NA PRAIA."],
};

/** quem liga em quem: [mapa, lado, mapa do outro lado] (o outro lado é o oposto) */
const LIGA = [
  ["hauoli", "up", "rota1_alola"],
  ["rota1_alola", "up", "iki"],
  ["iki", "right", "trilha_melemele"],
  ["hauoli", "right", "praia_melemele"],
];
const OPOSTO = { up: "down", down: "up", left: "right", right: "left" };

/** Monta a geometria de Alola (`kanto` é o kanto.json, de onde saem os interiores). */
export function montarAlola(kanto) {
  const ligacoes = Object.fromEntries(Object.keys(PLANTAS).map((id) => [id, []]));
  for (const [a, lado, b] of LIGA) {
    const sa = saidaDe(PLANTAS[a], lado), sb = saidaDe(PLANTAS[b], OPOSTO[lado]);
    ligacoes[a].push({ dir: lado, offset: sa - sb, to: b });
    ligacoes[b].push({ dir: OPOSTO[lado], offset: sb - sa, to: a });
  }
  return montarGeos(kanto, { plantas: PLANTAS, interiores: INTERIORES, ligacoes,
                             temas: Object.fromEntries(Object.keys(PLANTAS).map((id) => [id, "litoral"])),
                             cidadePadrao: "hauoli", marca: { alola: true, regiao: "alola" } });
}

// ------------------------------------------------------------ os selvagens
/** o mato de cada lugar: [espécie, peso]. Só entra quem existe no jogo (`porAlola`). */
const MATO = {
  rota1_alola: { niveis: [8, 12], lista: [["pikipek", 20], ["yungoos", 20], ["rattataalola", 15], ["grubbin", 15], ["cutiefly", 10], ["caterpie", 8], ["rockruff", 4]] },
  trilha_melemele: { niveis: [10, 14], lista: [["crabrawler", 15], ["makuhita", 15], ["fomantis", 12], ["mudbray", 10], ["salandit", 8], ["stufful", 4], ["ledyba", 10]] },
  praia_melemele: { niveis: [10, 14], lista: [["wingull", 20], ["sandygast", 12], ["wimpod", 10], ["mareanie", 8], ["pyukumuku", 8], ["meowthalola", 6]] },
};

// ------------------------------------------------------------ as pessoas
/** O PROF. KOA dá um dos três iniciais de Alola (uma vez só) */
const INICIAIS = ["rowlet", "litten", "popplio"];
const KOA = {
  oi: [
    "PROF. KOA: ALOHA! VOCÊ VEIO DE AVIÃO DE LONGE, NÃO VEIO? DÁ PRA VER PELA CARA DE SONO.",
    "PROF. KOA: EU ESTUDO COMO OS POKÉMON MUDAM QUANDO VÊM MORAR NAS ILHAS. TEM RATTATA AQUI QUE VIROU OUTRA COISA!",
    "PROF. KOA: TODO TREINADOR QUE CHEGA EM MELEMELE GANHA UM PARCEIRO DAQUI. ESCOLHE O SEU!",
  ],
  pergunta: "QUAL VOCÊ QUER?",
  depois: (nome) => [`PROF. KOA: ${nome} VAI ADORAR CORRER NA AREIA COM VOCÊ!`,
    "PROF. KOA: SOBE A ROTA 1 ATÉ IKI. O KAHUNA MAKOA ESPERA QUEM CHEGA NA ILHA."],
  ja: ["PROF. KOA: E AÍ, COMO ESTÁ O SEU PARCEIRO? EM ALOLA, OS POKÉMON CRESCEM COM SOL E MAR."],
  semVaga: "PROF. KOA: A SUA EQUIPE E O PC ESTÃO CHEIOS! ABRE UM ESPAÇO E VOLTA AQUI.",
};
function falarKoa(cena) {
  const st = cena.st, f = (st.flags ||= {});
  if (f.alolaInicial) return void cena.dlg.say(KOA.ja);
  Promise.all([import("./index.js"), import("../systems/mon.js"), import("../systems/box.js")]).then(([{ DB }, M, B]) => {
    const opcoes = INICIAIS.filter((id) => DB.SPECIES[id]);
    if (!opcoes.length) return void cena.dlg.say(KOA.ja);
    cena.dlg.say(KOA.oi, () => cena.dlg.ask(KOA.pergunta, opcoes.map((id) => DB.SPECIES[id].name), (i) => {
      const id = opcoes[i];
      if (!id) return;
      const mon = M.createMon(id, 10);
      if (st.party.length < 6) st.party.push(mon);
      else if (!B.guardar(st, mon)) return void cena.dlg.say(KOA.semVaga);
      f.alolaInicial = id;
      st.seen[id] = st.caught[id] = true;
      cena.game.autosave?.(true);
      cena.dlg.say([`VOCÊ RECEBEU ${DB.SPECIES[id].name}!`, ...KOA.depois(DB.SPECIES[id].name)]);
    }));
  });
}

/** O KAHUNA MAKOA: o GRANDE DESAFIO de MELEMELE, em cima do PALCO de IKI */
const KAHUNA = {
  id: "kahuna_makoa", x: 18, y: 8, dir: "down", sprite: "lutador",
  lines: [
    "KAHUNA MAKOA: ALOHA, VIAJANTE! EU CUIDO DE MELEMELE, E O PALCO DE IKI É ONDE EU CONHEÇO QUEM CHEGA.",
    "KAHUNA MAKOA: AQUI NINGUÉM GANHA INSÍGNIA. GANHA O RESPEITO DA ILHA. QUER TENTAR? ENTÃO SOBE!",
  ],
  afterLines: [
    "KAHUNA MAKOA: HA! A ILHA GOSTOU DE VOCÊ. O VENTO ATÉ MUDOU DE LADO.",
    "KAHUNA MAKOA: AS MARCAS DAS PROVAÇÕES ESTÃO APARECENDO POR MELEMELE. QUEM ACORDA OS TOTENS GANHA OS CRISTAIS Z!",
  ],
  trainer: { name: "KAHUNA MAKOA", prize: 2400, sight: 0, alolaSelo: "melemele",
             party: [{ id: "crabrawler", lvl: 15 }, { id: "makuhita", lvl: 15 }, { id: "hariyama", lvl: 17 }] },
};

// ------------------------------------------------------------ o conteúdo
const LOJA = [
  { item: "poké bola", price: 200 }, { item: "great ball", price: 600 },
  { item: "poção", price: 300 }, { item: "super poção", price: 700 }, { item: "antídoto", price: 100 },
];

export const ALOLA_CONTEUDO = {
  hauoli: {
    name: "HAU'OLI", music: "saolucario", encounters: [],
    spawn: { x: 27, y: 12, dir: "down" },
    placas: {
      1: "HAU'OLI\nA CIDADE DA ALEGRIA. PRA CIMA: ROTA 1 E IKI.",
      2: "PRAÇA DE HAU'OLI\nO CORETO TOCA MÚSICA NO FIM DE TARDE.",
      3: "PRAIA DE HAU'OLI\nPRA DIREITA: A PRAIA DE MELEMELE.",
    },
    npcs: [
      { id: "guia", x: 25, y: 12, dir: "down", sprite: "garota",
        lines: ["ALOHA! BEM-VINDO A ALOLA!", "ISTO AQUI É MELEMELE, A PRIMEIRA DAS ILHAS. O LABORATÓRIO DO PROF. KOA É A CASA GRANDE DO LADO DA PRAÇA.",
          "SOBE A ROTA 1 PRA CHEGAR EM IKI, A VILA DO KAHUNA."] },
      { id: "surfista", x: 30, y: 24, dir: "left", sprite: "superf", wander: true,
        lines: ["AS ONDAS DE MELEMELE SÃO PEQUENAS. BOAS PRA QUEM ESTÁ COMEÇANDO. TIPO EU. HÁ DEZ ANOS."] },
      { id: "vovo", x: 13, y: 13, dir: "down", sprite: "velha",
        lines: ["O MEU RATTATA É PRETO E TEM BIGODE. O DO MEU PRIMO DE KANTO É ROXO. ACHO O MEU MAIS ELEGANTE."] },
      { id: "pescador_hauoli", x: 22, y: 26, dir: "down", sprite: "pescador",
        lines: ["O PÍER É O MEU ESCRITÓRIO. HOJE O PEIXE TIROU FOLGA."],
        afterLines: ["O MAR GANHOU DE NÓS DOIS HOJE."],
        trainer: { name: "PESCADOR KAI", prize: 360, sight: 3, party: [{ id: "wingull", lvl: 11 }, { id: "magikarp", lvl: 12 }] } },
    ],
  },
  rota1_alola: {
    name: "ROTA 1 (ALOLA)", music: "br101", encounters: [],
    placas: { 1: "ROTA 1 DE ALOLA\nPRA BAIXO: HAU'OLI. PRA CIMA: IKI.", 2: "VILA IKI\nO PALCO DO KAHUNA FICA LÁ NO ALTO." },
    npcs: [
      { id: "menino_r1", x: 8, y: 23, dir: "right", sprite: "garoto",
        lines: ["EI! ACABEI DE PEGAR UM PIKIPEK! VAMOS VER QUEM BICA MAIS FORTE!"],
        afterLines: ["O MEU PIKIPEK FICOU COM O BICO TORTO DE TANTO BICAR."],
        trainer: { name: "GAROTO NOA", prize: 220, sight: 4, party: [{ id: "pikipek", lvl: 10 }, { id: "yungoos", lvl: 11 }] } },
      { id: "menina_r1", x: 21, y: 13, dir: "down", sprite: "garota",
        lines: ["OS CUTIEFLY SENTEM O CHEIRO DE FLOR. E DE TREINADOR NOVO!"],
        afterLines: ["VOU PLANTAR MAIS FLOR. VAI QUE AJUDA."],
        trainer: { name: "MENINA LANI", prize: 240, sight: 4, party: [{ id: "cutiefly", lvl: 11 }, { id: "grubbin", lvl: 12 }] } },
    ],
  },
  iki: {
    name: "IKI", music: "saolucario", encounters: [],
    placas: { 1: "VILA IKI\nA VILA MAIS ALTA DE MELEMELE.", 2: "O PALCO DE IKI\nAQUI A ILHA ESCOLHE QUEM ELA RESPEITA." },
    npcs: [
      KAHUNA,
      { id: "tia_iki", x: 22, y: 14, dir: "down", sprite: "velha",
        lines: ["NO PALCO, O KAHUNA LUTA DE PÉ DESCALÇO. DIZ QUE É PRA SENTIR A ILHA."] },
      { id: "garoto_iki", x: 10, y: 21, dir: "up", sprite: "garoto", wander: true,
        lines: ["PRA DIREITA TEM A TRILHA DA ILHA. TEM UMA MARCA ESTRANHA NO CHÃO LÁ. EU NÃO CHEGO PERTO."] },
    ],
  },
  trilha_melemele: {
    name: "TRILHA DA ILHA", music: "br101", encounters: [],
    placas: { 1: "TRILHA DA ILHA\nAS MARCAS NO CHÃO SÃO DAS PROVAÇÕES. NÃO ACORDE O QUE DORME À TOA." },
    npcs: [
      { id: "lutador_trilha", x: 26, y: 9, dir: "left", sprite: "lutador",
        lines: ["EU TREINO AQUI TODO DIA ANTES DO SOL. O MAKUHITA TREINA DEPOIS DO ALMOÇO."],
        afterLines: ["AMANHÃ EU ACORDO MAIS CEDO."],
        trainer: { name: "FAIXA-PRETA KEONI", prize: 420, sight: 4, party: [{ id: "makuhita", lvl: 13 }, { id: "crabrawler", lvl: 14 }] } },
    ],
  },
  praia_melemele: {
    name: "PRAIA DE MELEMELE", music: "saolucario", encounters: [],
    placas: { 1: "PRAIA DE MELEMELE\nCUIDADO COM O SANDYGAST: ELE NÃO É CASTELO DE AREIA. QUER DIZER, É. MAS MORDE." },
    npcs: [
      { id: "banhista", x: 24, y: 15, dir: "left", sprite: "garota", wander: true,
        lines: ["O PYUKUMUKU NA AREIA? JOGA DE VOLTA NO MAR! ELE AGRADECE... DO JEITO DELE."] },
    ],
  },
  hauoli_pokemon_center_1f: {
    name: "CENTRO POKÉMON — HAU'OLI", music: "center", interior: true, encounters: [],
    spawn: { x: 7, y: 8, dir: "up" },
    lockedWarps: { "1,6": "A ESCADA LEVA À SALA DE UNIÃO. ESTÁ FECHADA." },
    npcs: [{ id: "enfermeira", x: 7, y: 2, dir: "down", sprite: "enfermeira", heal: true, tutor: true,
             lines: ["ALOHA! BEM-VINDO AO CENTRO POKÉMON DE HAU'OLI!", "CURO SEUS POKÉMON E AJUSTO OS GOLPES DELES, SE QUISER."] }],
  },
  hauoli_loja: {
    name: "LOJA — HAU'OLI", music: "mart", interior: true, encounters: [],
    spawn: { x: 4, y: 7, dir: "up" },
    npcs: [{ id: "balconista", x: 2, y: 3, dir: "down", sprite: "balconista",
             lines: ["ALOHA! TEM PROTETOR SOLAR? NÃO. TEM POKÉ BOLA? TEM!"], shop: LOJA }],
  },
  hauoli_aeroporto: {
    name: "AEROPORTO DE HAU'OLI", music: "mart", interior: true, encounters: [],
    spawn: { x: 4, y: 7, dir: "up" },
    npcs: [{ id: "balcao_aviao", x: 2, y: 3, dir: "down", sprite: "balconista", aviao: true,
             lines: ["AEROPORTO DE HAU'OLI. PRA ONDE VAI?"] }],
  },
  hauoli_laboratorio: {
    name: "LABORATÓRIO DO PROF. KOA", music: "casa", interior: true, encounters: [],
    npcs: [{ id: "prof_koa", x: 4, y: 4, dir: "down", sprite: "cientista", aoFalar: falarKoa, lines: [] }],
  },
  iki_casa_kahuna: {
    name: "CASA DO KAHUNA", music: "casa", interior: true, encounters: [],
    npcs: [{ id: "neta_kahuna", x: 4, y: 4, dir: "down", sprite: "garota", heal: true,
             lines: ["O VOVÔ MAKOA ESTÁ NO PALCO. SENTA UM POUCO: VOU DAR ÁGUA DE COCO PROS SEUS POKÉMON."] }],
  },
};

/** Chamado no fim do `buildDB` (src/data/index.js): o avião pra HAU'OLI, o mato de cada lugar */
export function porAlola(db) {
  const A = db.AVIAO;
  if (A && !A.destinos.some((d) => d.regiao === "alola")) {
    A.destinos.splice(1, 0, { regiao: "alola", nome: "HAU'OLI (ALOLA)", mapa: "hauoli", x: 27, y: 12, dir: "down" });
  }
  for (const [id, m] of Object.entries(MATO)) {
    const mapa = db.MAPS[id];
    if (!mapa) continue;
    mapa.encounters = m.lista.filter(([e]) => db.SPECIES[e]).map(([e, w]) => ({ id: e, min: m.niveis[0], max: m.niveis[1], w }));
  }
}
