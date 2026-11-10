// JOHTO (pedido do CAIO, nov/2026: "faz um trem magnético que leva pra johto" —
// ele escolheu JOHTO INTEIRA, "feita por fãs no estilo FireRed"). Vai em partes;
// esta é a PARTE 1: o TREM MAGNÉTICO (de SAFFRON), GOLDENROD com a estação, o
// Centro, a loja de departamentos e o GINÁSIO DA WHITNEY, e a ROTA 34.
//
// Mesmo construtor de Braglitch e Kalos (`montarGeos`, src/data/braglitch.js),
// com `marca: { johto: true, regiao: "johto" }`; o pintor usa os blocos do
// FireRed (src/core/fr-blocos.js) como em Braglitch. As letras da planta são as
// de sempre (dev/LUGARES.md): L é a ESTAÇÃO DO TREM, G o ginásio.
//
// As INSÍGNIAS DE JOHTO moram à parte (`st.johtoBadges`), como as de Braglitch:
// a história de Kanto conta as oito dela.
import { montarGeos } from "./braglitch.js";
import { saidaDe } from "./braglitch-mundo.js";

const PLANTA_GOLDENROD = [
  "##############################",
  "#....LLLLLL......hhhh....hhhh#",
  "#....LLLLLL......hhhh....hhhh#",
  "#....LLLLLL......hhhh....hhhh#",
  "#.......D..1......D.......D..#",
  "#..PPPPPPPPPPPPPPPPPPPPPPPPP.#",
  "#..P..........PP..........P..#",
  "#..P.MMMMMM...PP...GGGGGG.P..#",
  "#..P.MMMMMM...PP...GGGGGG.P..#",
  "#..P.MMMMMM...PP...GGGGGG.P..#",
  "#..P.MMMMMM...PP...GGGGGG.P..#",
  "#..P....D..2..PP.....D..3.P..#",
  "#..PPPPPPPPPPPPPPPPPPPPPPPP..#",
  "#.............PP.............#",
  "#.CCCCC..FFFF.PP.FFFF..hhhh..#",
  "#.CCCCC..FFFF.PP.FFFF..hhhh..#",
  "#.CCCCC.......PP.......hhhh..#",
  "#...D.........PP........D....#",
  "#...PPPPPPPPPPPP........P....#",
  "#.............PPPPPPPPPPP....#",
  "#.hhhh..4.....PP.............#",
  "#.hhhh........PP......FF.....#",
  "#.hhhh........PP......FF.....#",
  "##############PP##############",
];

const PLANTA_ROTA34 = [
  "##############PP##############",
  "#.............PP.............#",
  "#..,,,,,......PP......,,,,,..#",
  "#..,,,,,......PP......,,,,,..#",
  "#..,,,,,......PP......,,,,,..#",
  "#.............PP.............#",
  "####......####PP####......####",
  "#.............PP.............#",
  "#.,,,,,,,.....PP.....,,,,,,,.#",
  "#.,,,,,,,.....PP.....,,,,,,,.#",
  "#.,,,,,,,..1..PP.....,,,,,,,.#",
  "#.............PP.............#",
  "#..~~~~~......PP......hhhh...#",
  "#..~~~~~......PP......hhhh...#",
  "#..~~~~~......PP......hhhh...#",
  "#.............PP.......D.....#",
  "#.............PPPPPPPPPP.....#",
  "####....,,,,,,PP,,,,,,....####",
  "#.......,,,,,,PP,,,,,,.......#",
  "#.......,,,,,,PP,,,,,,.......#",
  "#.............PP.............#",
  "#....##.......PP.......##....#",
  "#....##..,,,,,PP,,,,,..##....#",
  "#........,,,,,PP,,,,,........#",
  "#.............PP.......2.....#",
  "##############################",
];

const PLANTAS = { goldenrod: PLANTA_GOLDENROD, rota34: PLANTA_ROTA34 };

/** os interiores: cópia dos de Kanto, com a porta apontando pra GOLDENROD */
const INTERIORES = {
  goldenrod_pokemon_center_1f: { de: "center", predio: "C", cidade: "goldenrod" },
  goldenrod_loja: { de: "mart", predio: "M", cidade: "goldenrod" },
  goldenrod_estacao: { de: "mart", predio: "L", cidade: "goldenrod" },
  goldenrod_ginasio: { de: "celadon_city_gym", predio: "G", cidade: "goldenrod" },
};

export const PORTA_FECHADA_JOHTO = {
  h: ["A PORTA ESTÁ TRANCADA. DÁ PRA OUVIR UM RÁDIO TOCANDO LÁ DENTRO."],
};

/** Monta a geometria de Johto (`kanto` é o kanto.json, de onde saem os interiores). */
export function montarJohto(kanto) {
  const a = saidaDe(PLANTA_GOLDENROD, "down"), b = saidaDe(PLANTA_ROTA34, "up");
  const ligacoes = {
    goldenrod: [{ dir: "down", offset: a - b, to: "rota34" }],
    rota34: [{ dir: "up", offset: b - a, to: "goldenrod" }],
  };
  const out = montarGeos(kanto, { plantas: PLANTAS, interiores: INTERIORES, ligacoes,
                                  temas: { goldenrod: "mata", rota34: "mata" },
                                  cidadePadrao: "goldenrod", marca: { johto: true, regiao: "johto" } });
  // A ESTAÇÃO DE SAFFRON (ele: "cadê a estação"): a casa do MR. PSYCHIC, embaixo,
  // perto do Centro, vira a ESTAÇÃO DO TREM MAGNÉTICO — a porta dela leva pra
  // uma sala com o balcão (a da loja de Kanto, como as estações de Johto)
  const saf = kanto?.saffron_city, sala = kanto?.mart;
  const i = (saf?.warps || []).findIndex((w) => w.destName === "MAP_SAFFRON_CITY_MR_PSYCHICS_HOUSE");
  if (saf && sala && i >= 0) {
    saf.warps[i] = { ...saf.warps[i], to: "saffron_estacao", toWarp: 0 };
    out.saffron_estacao = {
      ...sala, arte: "mart",
      warps: sala.warps.map((w) => (w.to === sala.warps[0].to ? { ...w, to: "saffron_city", toWarp: i } : { ...w, to: null })),
      connections: [],
      content: { ...(sala.content || {}), npcs: [], encounters: [] },
    };
  }
  return out;
}

// ------------------------------------------------------------ as insígnias
export const INSIGNIAS_JOHTO = [
  { id: "planicie", name: "INSÍGNIA PLANÍCIE", lider: "WHITNEY", cidade: "GOLDENROD" },
];

// ------------------------------------------------------------ o conteúdo
const LOJA_GOLDENROD = [
  { item: "poké bola", price: 200 }, { item: "great ball", price: 600 }, { item: "ultra ball", price: 1200 },
  { item: "super poção", price: 700 }, { item: "hiper poção", price: 1200 }, { item: "reviver", price: 1500 },
  { item: "pedra da lua", price: 3000 }, { item: "pedra do fogo", price: 2100 }, { item: "pedra da água", price: 2100 },
];
const t = (id, lvl) => ({ id, lvl });

export const JOHTO_CONTEUDO = {
  goldenrod: {
    name: "GOLDENROD", music: "viridian", encounters: [],
    spawn: { x: 8, y: 5, dir: "down" },
    placas: {
      1: "ESTAÇÃO DO TREM MAGNÉTICO\nGOLDENROD ⇄ SAFFRON (KANTO).",
      2: "LOJA DE DEPARTAMENTOS DE GOLDENROD\nTEM DE TUDO, DO TÉRREO AO TELHADO!",
      3: "GINÁSIO DE GOLDENROD\nLÍDER: WHITNEY, A GAROTA INCRIVELMENTE LINDA!",
      4: "GOLDENROD\nA CIDADE GRANDE E ANIMADA DE JOHTO.",
    },
    npcs: [
      { id: "guia_goldenrod", x: 12, y: 13, dir: "down", sprite: "garota",
        lines: ["BEM-VINDO A GOLDENROD, A MAIOR CIDADE DE JOHTO!",
                "VEIO DE TREM? A ESTAÇÃO FICA LÁ EM CIMA. A LOJA É A DA ESQUERDA E O GINÁSIO DA WHITNEY, A DA DIREITA.",
                "PRO SUL FICA A ROTA 34. CUIDADO COM O MATO ALTO!"] },
      { id: "radio", x: 20, y: 19, dir: "left", sprite: "gentleman",
        lines: ["ESTÃO CONSTRUINDO UMA TORRE DE RÁDIO AQUI. UM DIA ELA VAI TOCAR MÚSICA PRA JOHTO INTEIRA."] },
      { id: "menino_goldenrod", x: 6, y: 19, dir: "right", sprite: "menino",
        lines: ["A WHITNEY É FORTE DEMAIS! O MILTANK DELA ROLA E NÃO PARA DE ROLAR!"] },
    ],
  },
  rota34: {
    name: "ROTA 34", music: "route",
    niveis: [26, 31],
    mato: [["sentret", 20], ["pidgey", 14], ["rattata", 14], ["drowzee", 12], ["abra", 6], ["ditto", 5], ["jigglypuff", 8], ["snubbull", 8], ["hoothoot", 10]],
    placas: {
      1: "ROTA 34\nGOLDENROD AO NORTE.",
      2: "MAIS PRO SUL: A FLORESTA DE ILEX\n(AINDA NÃO DÁ PRA PASSAR.)",
    },
    npcs: [
      { id: "campista_r34", x: 7, y: 11, dir: "right", sprite: "garoto",
        lines: ["EI! TREINADOR NOVO EM JOHTO? VAMOS VER O QUE VOCÊ TEM!"],
        afterLines: ["OS TREINADORES DE KANTO SÃO FORTES MESMO..."],
        trainer: { name: "CAMPISTA TODD", prize: 1100, sight: 4, party: [t("sentret", 27), t("furret", 29)] } },
      { id: "piqueniqueira_r34", x: 22, y: 20, dir: "left", sprite: "garota",
        lines: ["EU VIM FAZER PIQUENIQUE COM O MEU MARILL. QUER LUTAR ANTES DO LANCHE?"],
        afterLines: ["PERDI... PELO MENOS O LANCHE CONTINUA AQUI."],
        trainer: { name: "PIQUENIQUEIRA GINA", prize: 1150, sight: 4, party: [t("hoppip", 28), t("marill", 30)] } },
      { id: "vovo_creche", x: 20, y: 15, dir: "down", sprite: "velho",
        lines: ["ESTA É A CASA DA CRECHE DE JOHTO. A MINHA VELHA ESTÁ CUIDANDO DOS OVOS... ELA NÃO DEIXA NINGUÉM ENTRAR AGORA."] },
    ],
  },
  goldenrod_pokemon_center_1f: {
    name: "CENTRO POKÉMON — GOLDENROD", music: "center", interior: true, encounters: [],
    spawn: { x: 7, y: 8, dir: "up" },
    lockedWarps: { "1,6": "A ESCADA LEVA AO CENTRO DE TROCAS. ESTÁ FECHADA." },
    npcs: [{ id: "enfermeira", x: 7, y: 2, dir: "down", sprite: "enfermeira", heal: true, tutor: true,
             lines: ["BEM-VINDO AO CENTRO POKÉMON DE GOLDENROD!", "CURO SEUS POKÉMON E AJUSTO OS GOLPES DELES, SE QUISER."] }],
  },
  goldenrod_loja: {
    name: "LOJA DE DEPARTAMENTOS — GOLDENROD", music: "mart", interior: true, encounters: [],
    spawn: { x: 4, y: 7, dir: "up" },
    npcs: [{ id: "balconista", x: 2, y: 3, dir: "down", sprite: "balconista",
             lines: ["BEM-VINDO À LOJA DE DEPARTAMENTOS! HOJE É DIA DE PEDRA DE EVOLUÇÃO EM PROMOÇÃO."], shop: LOJA_GOLDENROD }],
  },
  goldenrod_estacao: {
    name: "ESTAÇÃO DO TREM MAGNÉTICO — GOLDENROD", music: "mart", interior: true, encounters: [],
    spawn: { x: 4, y: 7, dir: "up" },
    npcs: [{ id: "bilheteiro_goldenrod", x: 2, y: 3, dir: "down", sprite: "balconista", trem: "saffron",
             lines: ["ESTAÇÃO DO TREM MAGNÉTICO DE GOLDENROD."] }],
  },
  saffron_estacao: {
    name: "ESTAÇÃO DO TREM MAGNÉTICO — SAFFRON", music: "mart", interior: true, encounters: [],
    spawn: { x: 4, y: 6, dir: "down" },
    npcs: [{ id: "bilheteiro_saffron", x: 2, y: 3, dir: "down", sprite: "balconista", trem: "goldenrod",
             lines: ["ESTAÇÃO DO TREM MAGNÉTICO DE SAFFRON. O TREM LEVA PRA GOLDENROD, EM JOHTO!"] }],
  },
  goldenrod_ginasio: {
    name: "GINÁSIO DE GOLDENROD", music: "gym", interior: true, encounters: [],
    npcs: [
      { id: "lider", x: 6, y: 4, dir: "down", sprite: "garota",
        lines: ["OI! EU SOU A WHITNEY! TODO MUNDO ADORA POKÉMON FOFO, NÉ?",
                "EU TAMBÉM! E OS MEUS SÃO FOFOS... E FORTES. VAMOS LUTAR!"],
        afterLines: ["BUÁÁÁ! VOCÊ É MALVADO! ...TÁ BOM, TÁ BOM. TOMA A INSÍGNIA. SNIF."],
        trainer: { name: "LÍDER WHITNEY", prize: 3300, johtoBadge: "planicie",
                   party: [t("clefairy", 30), t("miltank", 33)] } },
      { id: "treinador1", x: 3, y: 11, dir: "right", sprite: "garota",
        lines: ["A WHITNEY É A MAIS FOFA DE JOHTO! VOCÊ NÃO VAI PASSAR!"],
        afterLines: ["OS POKÉMON FOFOS PERDERAM... MAS CONTINUAM FOFOS."],
        trainer: { name: "BELEZA VICTORIA", prize: 1200, sight: 3, party: [t("snubbull", 27), t("teddiursa", 28)] } },
      { id: "treinador2", x: 9, y: 10, dir: "left", sprite: "garota",
        lines: ["NORMAL NÃO É SEM GRAÇA. NORMAL É FORTE!"],
        afterLines: ["TÁ, VOCÊ É FORTE TAMBÉM."],
        trainer: { name: "BELEZA SAMANTHA", prize: 1200, sight: 3, party: [t("aipom", 28), t("girafarig", 29)] } },
    ],
  },
};

// ------------------------------------------------------------ o trem
/** O TREM MAGNÉTICO: o bilheteiro em SAFFRON (Kanto) e o da estação de
 *  GOLDENROD (Johto). A viagem é a cena src/scenes/trem.js. */
export const TREM = {
  pode: (st) => (st.party || []).some(Boolean),
  destinos: {
    goldenrod: { mapa: "goldenrod", x: 8, y: 5, dir: "down", nome: "GOLDENROD (JOHTO)" },
    saffron: { mapa: "saffron_estacao", x: 4, y: 6, dir: "down", nome: "SAFFRON (KANTO)" },
  },
  pergunta: (nome) => `O TREM MAGNÉTICO VAI PRA ${nome}. QUER EMBARCAR?`,
  opcoes: ["EMBARCAR", "AGORA NÃO"],
  fechado: ["VIAJAR SEM NENHUM POKÉMON? EM JOHTO TEM MUITO MATO ALTO! PEGA O SEU PRIMEIRO E VOLTA AQUI."],
  chegou: (nome) => [`(O TREM PAROU. BEM-VINDO A ${nome}!)`],
  bilheteiro: ["EU SOU O BILHETEIRO DO TREM MAGNÉTICO.", "ELE ANDA FLUTUANDO NOS TRILHOS, MAIS RÁPIDO QUE UM RAPIDASH!"],
};

/** Chamado no fim do `buildDB`: o mato da ROTA 34 e as tabelas no DB. (O
 *  bilheteiro de SAFFRON fica DENTRO da estação, `saffron_estacao`.) */
export function porTrem(db) {
  // a ROTA 34: o mato, só com quem existe no DB
  const r = db.MAPS?.rota34, C = JOHTO_CONTEUDO.rota34;
  if (r) r.encounters = C.mato.filter(([e]) => db.SPECIES[e]).map(([e, w]) => ({ id: e, min: C.niveis[0], max: C.niveis[1], w }));
  db.TREM = TREM;
  db.INSIGNIAS_JOHTO = INSIGNIAS_JOHTO;
}
