// A ÁREA ZERO (pedido do CAIO, nov/2026: "faz ter novos pkmn paradoxo"... "a
// área zero se chega indo de helicóptero em viridian ao virar campeão").
//
// Depois de vencer a LIGA DE KANTO (`kantoCampeao`), aparece um HELICÓPTERO na
// praça de VIRIDIAN. Ele leva pra GARAGEM ZERO, lá em cima, na beira da
// cratera. Na cerca, a PESQUISADORA leva você cratera abaixo: montado no seu
// KORAIDON ou MIRAIDON, se tiver um na equipe; se não, num CYCLIZAR emprestado
// (a descida é a cena src/scenes/descida.js). Lá embaixo é a ÁREA ZERO: os
// PARADOXOS de hoje, os de Paldea e os DEZ NOVOS daqui (cada um de um Pokémon
// só, do passado OU do futuro; o GIANT DRAKE, o MATH PLUS e o MATH MINUS são
// do CAIO, o resto eu inventei).
//
// Os dois mapas são PLANTAS de texto (o mesmo `montarGeos` de Braglitch) com o
// pintor próprio `Assets.areaZeroArt` (tema "areazero"):
//   # paredão de cristal da cratera   . chão   , mato alto (onde moram os
//   selvagens)   ~ água   = ponte   W cachoeira   k cristal   K o CRISTAL
//   GIGANTE do meio   o pedregulho   t árvore   1-9 placa
//   (só na GARAGEM) Z o prédio   X o heliponto   E a cerca da beira
//   V a cratera vista de cima
// Os desenhos dos dez: tools/area_zero/paradoxo.py.

import { montarGeos } from "./braglitch.js";

const GARAGEM = [
  "##############################",
  "#tt..tt...tt.....tt...tt..tt##",
  "#t...........................#",
  "#..ZZZZZZZZ.......XXXXXX..t..#",
  "#..ZZZZZZZZ.......XXXXXX.....#",
  "#..ZZZZZZZZ.......XXXXXX.....#",
  "#..ZZZZZZZZ.......XXXXXX.....#",
  "#t...1............XXXXXX....t#",
  "#............................#",
  "#tt.......................ttt#",
  "#............................#",
  "#EEEEEEEEEEEE..EEEEEEEEEEEEEE#",
  "VVVVVVVVVVVVVVVVVVVVVVVVVVVVVV",
  "VVVVVVVVVVVVVVVVVVVVVVVVVVVVVV",
  "VVVVVVVVVVVVVVVVVVVVVVVVVVVVVV",
  "VVVVVVVVVVVVVVVVVVVVVVVVVVVVVV",
];

const AREA = [
  "############################################",
  "####kkk#######W########...#######W######kk##",
  "###kk..,,,..##W###.............##W###..,.k##",
  "##k...,,,,,..#~##.......2.......#~#..,,,..k#",
  "##...,,,,,,..=~.................~=..,,,,,..#",
  "#k...,,,,.....==..,,,,......,,,,==....,,,..#",
  "#....,,..o....~~..,,,,,....,,,,,~~..o......#",
  "#.k...........~~~~.,,,..kk..,,,~~~.......k.#",
  "#...tt...........~~~~..kkkk.~~~~.......tt..#",
  "#..tttt...........=~~~~.kk~~~~=.......tttt.#",
  "#..tttt..o............~~~~~~.....o....tttt.#",
  "#...tt....,,,,,,.......~~~~......,,,....tt.#",
  "#.........,,,,,,,.......==.......,,,,,.....#",
  "##..k.....,,,,,,,.......~~......,,,,,,,....#",
  "###kk.......,,,...o.....~~......,,,,,..o..##",
  "####....................~~...............###",
  "###....tt....kk.........~~..kk.........k.###",
  "##....tttt..kkkk.......~~~~.kkkk.....tt..###",
  "##....tttt...kk......~~~~~~~~.kk....tttt..##",
  "#......tt...........~~~~~~~~~~......tttt...#",
  "#..,,,,............~~~~KKKK~~~~......tt....#",
  "#.,,,,,,...........~~~~KKKK~~~~............#",
  "#.,,,,,,..o........~~~~KKKK~~~~...,,,,,,...#",
  "#..,,,,.............~~~~~~~~~~...,,,,,,,,..#",
  "#....................~~~~~~~~.....,,,,,,...#",
  "#k.....kk.............=~~~~=...............#",
  "#kk...kkkk...,,,,,.................kk...o..#",
  "##k....kk...,,,,,,,......,,,,.....kkkk.....#",
  "###.........,,,,,,,.....,,,,,,.....kk.....##",
  "####...o.....,,,,,.......,,,,....o.......###",
  "#####.....tt.........k...........tt....#####",
  "######...tttt.......kkk.........tttt..######",
  "########..tt.........k...........tt.########",
  "############################################",
];

const PLANTAS = { garagem_zero: GARAGEM, area_zero: AREA };

export function montarAreaZero(kanto) {
  return montarGeos(kanto, { plantas: PLANTAS, interiores: {}, temas: { garagem_zero: "areazero", area_zero: "areazero" },
                             cidadePadrao: "garagem_zero", marca: {} });
}

// ------------------------------------------------------------ os dez novos
const ESPECIE = (id, dex, name, types, era, de, [hp, atk, def, spa, spd, spe], dexText) => ({
  id, dex, name, types, base: { hp, atk, def, spa, spd, spe }, bst: hp + atk + def + spa + spd + spe,
  foreign: true, paradoxo: era, paradoxoDe: de, catchRate: 10, xpYield: 285, dexText,
});

export const PARADOXOS_AREA_ZERO = {
  // DO PASSADO (pelo, cor de terra)
  giantdrake: ESPECIE("giantdrake", 1118, "GIANT DRAKE", ["LUTADOR", "VENENO"], "passado", "eternatus", [125, 130, 100, 75, 80, 90],
    "DIZEM QUE É O ETERNATUS DE MUITO TEMPO ATRÁS. EM VEZ DE ENERGIA, ELE TEM MÚSCULO, E O VENENO ESCORRE DAS GARRAS."),
  mathplus: ESPECIE("mathplus", 1119, "MATH PLUS", ["ELÉTRICO", "TERRA"], "passado", "plusle", [100, 100, 85, 80, 85, 120],
    "PARECE UM PLUSLE DO PASSADO. O PELO GROSSO GUARDA ELETRICIDADE, E ELE SOMA A FORÇA DE QUEM ESTÁ DO LADO DELE."),
  stonewings: ESPECIE("stonewings", 1120, "STONE WINGS", ["DRAGÃO", "PEDRA"], "passado", "dragonite", [101, 134, 120, 60, 80, 75],
    "UM DRAGONITE DE PEDRA, COM MUSGO NAS ASAS. É PESADO DEMAIS PRA VOAR ALTO, ENTÃO VOA BAIXINHO E DERRUBA TUDO."),
  shaggyfang: ESPECIE("shaggyfang", 1121, "SHAGGY FANG", ["LUTADOR", "SOMBRIO"], "passado", "lucario", [90, 130, 80, 70, 75, 125],
    "TEM A CARA DE UM LUCARIO, MAS O PELO É COMPRIDO E ESCURO. CAÇA À NOITE E SENTE A AURA DE LONGE."),
  giantbelly: ESPECIE("giantbelly", 1122, "GIANT BELLY", ["NORMAL", "TERRA"], "passado", "snorlax", [160, 120, 95, 50, 95, 50],
    "UM SNORLAX PELUDO DO TAMANHO DE UMA CASA. QUANDO ELE DEITA, O CHÃO DA ÁREA ZERO AFUNDA UM POUQUINHO."),
  // DO FUTURO (metal, luz ciano)
  mathminus: ESPECIE("mathminus", 1123, "MATH MINUS", ["ELÉTRICO", "AÇO"], "futuro", "minun", [80, 65, 90, 120, 90, 125],
    "PARECE UM MINUN FEITO DE METAL. ELE TIRA A ENERGIA DE QUEM ESTÁ PERTO E GUARDA NAS ORELHAS, QUE BRILHAM."),
  ironblaze: ESPECIE("ironblaze", 1124, "IRON BLAZE", ["FOGO", "AÇO"], "futuro", "charizard", [85, 78, 95, 132, 85, 95],
    "UM CHARIZARD DE AÇO. A CHAMA DO RABO É AZUL E TÃO QUENTE QUE DERRETE PEDRA."),
  ironghost: ESPECIE("ironghost", 1125, "IRON GHOST", ["FANTASMA", "ELÉTRICO"], "futuro", "gastly", [75, 70, 75, 135, 90, 125],
    "PARECE UM GASTLY DE METAL. A CARA É UMA TELA, E O GÁS EM VOLTA VIROU PLASMA: ENCOSTAR DÁ CHOQUE."),
  ironscale: ESPECIE("ironscale", 1126, "IRON SCALE", ["ÁGUA", "AÇO"], "futuro", "gyarados", [105, 130, 105, 60, 95, 75],
    "UM GYARADOS DE PLACAS DE METAL. AS NADADEIRAS SÃO DE LUZ E CORTAM A ÁGUA COMO FACA."),
  ironmind: ESPECIE("ironmind", 1127, "IRON MIND", ["PSÍQUICO", "AÇO"], "futuro", "mewtwo", [95, 80, 90, 140, 85, 80],
    "PARECE UM MEWTWO DE METAL. NINGUÉM SABE QUEM CONSTRUIU, NEM ELE. A CAUDA LIGA NUM CÉREBRO DE LUZ."),
};

// ------------------------------------------------------------ o que tem em cada mapa
const SELVAGENS = [
  // os dez novos
  ...Object.keys(PARADOXOS_AREA_ZERO).map((id) => ({ id, min: 62, max: 70, w: 8 })),
  // e os de Paldea (os mesmos dos vales do CELEBI, src/data/eras.js)
  ...["greattusk", "screamtail", "brutebonnet", "fluttermane", "slitherwing", "sandyshocks",
      "irontreads", "ironbundle", "ironhands", "ironjugulis", "ironmoth", "ironthorns"].map((id) => ({ id, min: 60, max: 68, w: 3 })),
];

/** onde o helicóptero pousa e onde a descida chega */
export const AREA_ZERO = {
  requer: "kantoCampeao",
  viridian: { mapa: "viridian", heli: { x: 38, y: 25 }, piloto: { x: 36, y: 26 }, chega: { x: 36, y: 27, dir: "down" } },
  garagem: { mapa: "garagem_zero", heli: { x: 20, y: 5 }, piloto: { x: 17, y: 7 }, chega: { x: 18, y: 8, dir: "down" },
             beira: { x: 13, y: 10, dir: "up" } },
  area: { mapa: "area_zero", chega: { x: 23, y: 3, dir: "down" } },
  // quem leva você cratera abaixo: o seu KORAIDON/MIRAIDON, ou o CYCLIZAR emprestado
  montarias: ["koraidon", "miraidon"],
  emprestado: "cyclizar",
  textos: {
    piloto: ["VOCÊ É O NOVO CAMPEÃO DE KANTO? QUE HONRA!", "O DIRETOR DA ÁREA ZERO PEDIU PRA EU TE LEVAR. É UMA CRATERA GIGANTE, LONGE DAQUI."],
    pergunta: "VOAR PRA GARAGEM ZERO?",
    opcoes: ["VOAR", "AGORA NÃO"],
    naoQuer: ["TUDO BEM. O HELICÓPTERO FICA AQUI TE ESPERANDO."],
    indo: ["SEGURA FIRME! AS HÉLICES COMEÇAM A GIRAR..."],
    chegou: ["(O HELICÓPTERO POUSOU NA GARAGEM ZERO, NA BEIRA DA CRATERA.)"],
    pilotoVolta: ["PRONTO PRA VOLTAR PRA VIRIDIAN?"],
    perguntaVolta: "VOLTAR PRA VIRIDIAN?",
    indoVolta: ["DE VOLTA PRA KANTO!"],
    chegouVolta: ["(O HELICÓPTERO POUSOU EM VIRIDIAN.)"],
    pesquisadora: ["LÁ EMBAIXO É A ÁREA ZERO. OS POKÉMON DE LÁ NÃO EXISTEM EM MAIS NENHUM LUGAR.", "TEM UNS QUE PARECEM DO PASSADO E OUTROS QUE PARECEM DO FUTURO."],
    perguntaDescer: "DESCER PRA ÁREA ZERO?",
    opcoesDescer: ["DESCER", "AGORA NÃO"],
    seu: (nome) => [`O SEU ${nome} OLHA PRA CRATERA E BALANÇA O RABO.`, `ELE QUER TE LEVAR LÁ PRA BAIXO!`],
    emprestado: ["VOCÊ NÃO TEM UM KORAIDON NEM UM MIRAIDON...", "ENTÃO TOMA: ESTE CYCLIZAR É DA GARAGEM. ELE CONHECE O CAMINHO.", "É SÓ SEGURAR FIRME E NÃO OLHAR PRA BAIXO!"],
    chegouEmbaixo: (nome) => [`(${nome} PAROU NO FUNDO DA CRATERA.)`, "BEM-VINDO À ÁREA ZERO!"],
    devolveu: ["(VOCÊ DEVOLVEU O CYCLIZAR. ELE SUBIU A PAREDE SOZINHO, CORRENDO.)"],
    subir: ["QUER SUBIR PRA GARAGEM ZERO? O ELEVADOR DE CARGA TE LEVA."],
    perguntaSubir: "SUBIR PRA GARAGEM ZERO?",
    opcoesSubir: ["SUBIR", "FICAR"],
    subiu: ["(O ELEVADOR SUBIU A PAREDE DA CRATERA INTEIRA. VOCÊ ESTÁ NA GARAGEM ZERO.)"],
  },
};

const PESQUISADORA = (x, y, dir, extra) => ({ id: "pesquisadora_zero", x, y, dir, sprite: "cientista", ...extra });

/** O que tem dentro (no formato de src/data/maps.js). */
export const CONTEUDO_AREA_ZERO = {
  garagem_zero: {
    name: "GARAGEM ZERO", music: "era_futuro", interior: false, encounters: [],
    spawn: { ...AREA_ZERO.garagem.chega },
    placas: { 1: "GARAGEM ZERO\nPESQUISA DA ÁREA ZERO. SÓ ENTRA QUEM FOR CONVIDADO." },
    npcs: [
      { id: "helicoptero_zero", ...AREA_ZERO.garagem.heli, dir: "down", sprite: "helicoptero", helicoptero: "volta", lines: [] },
      { id: "piloto_zero", ...AREA_ZERO.garagem.piloto, dir: "down", sprite: "gentleman", helicoptero: "volta", lines: AREA_ZERO.textos.pilotoVolta },
      PESQUISADORA(13, 11, "up", { descerAreaZero: true, lines: AREA_ZERO.textos.pesquisadora }),
      { id: "vigia_zero", x: 24, y: 9, dir: "left", sprite: "tecnico",
        lines: ["DAQUI DÁ PRA VER A CRATERA INTEIRA. LÁ NO MEIO TEM UM CRISTAL DO TAMANHO DE UM PRÉDIO.", "À NOITE ELE BRILHA. NINGUÉM SABE POR QUÊ.",
                // ele dá o CONECTADOR DE LENDAS (src/data/conectador.js)
                "ESPERA! LEVA ISTO. ACHARAM NO FUNDO DA CRATERA, PERTO DO CRISTAL GIGANTE.",
                "CHAMAM DE CONECTADOR DE LENDAS. DIZEM QUE JUNTA DOIS LENDÁRIOS NUM SÓ."],
        afterLines: ["O CONECTADOR FUNCIONA NO CALYREX, NO KYUREM E NO NECROZMA. JUNTA CADA UM COM O PARCEIRO DELE."],
        gift: { item: "conectador de lendas", qty: 1 } },
    ],
  },
  area_zero: {
    name: "ÁREA ZERO", music: "era_paradoxo", interior: false, encounters: SELVAGENS,
    spawn: { ...AREA_ZERO.area.chega },
    placas: { 2: "ÁREA ZERO\nCUIDADO: OS POKÉMON DAQUI SÃO FORTES E NÃO SE PARECEM COM NADA." },
    npcs: [
      PESQUISADORA(21, 3, "down", { subirAreaZero: true, lines: AREA_ZERO.textos.subir }),
      { id: "ofuscado", x: 30, y: 21, dir: "left", sprite: "cientista",
        lines: ["O CRISTAL GIGANTE... ELE ZUNE. PARECE QUE TEM ALGUÉM DO OUTRO LADO.", "OS PARADOXOS SEMPRE APARECEM PERTO DELE. ACHO QUE ELE É UMA PORTA."] },
    ],
  },
};

/** O HELICÓPTERO EM VIRIDIAN: só depois da LIGA. Chamado no fim do `buildDB`
 *  (src/data/index.js), com os mapas já montados. */
export function porHelicoptero(db) {
  const v = db.MAPS?.[AREA_ZERO.viridian.mapa];
  if (!v) return;
  const mostrar = (st) => !!st.flags?.[AREA_ZERO.requer];
  v.npcs = [...(v.npcs || []).filter((n) => !String(n.id).endsWith("_heli")),
    { id: "helicoptero_heli", ...AREA_ZERO.viridian.heli, dir: "down", sprite: "helicoptero", helicoptero: "ida", lines: [], mostrar },
    { id: "piloto_heli", ...AREA_ZERO.viridian.piloto, dir: "down", sprite: "gentleman", helicoptero: "ida", lines: AREA_ZERO.textos.piloto, mostrar }];
}
