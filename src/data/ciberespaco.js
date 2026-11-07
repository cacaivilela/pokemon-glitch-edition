// O CIBERESPAÇO (nov/2026, pedido do CAIO: "faz dar pra viajar pelo
// ciberespaço num porygon de um cara").
//
// No CASSINO DE CELADON, num canto, tem um cara com um PORYGON do lado: o
// PORYGON é feito de dados, e ele entra no computador levando quem quiser. Lá
// dentro é um lugar pra andar (montado no PORYGON): chão de grade, blocos de
// circuito, nuvens de dados onde moram os bichos digitais, e PORTAIS — cada um
// sai em frente ao Centro Pokémon de uma cidade de Kanto. O portal branco, no
// meio de baixo, volta pro cassino. No canto de cima, escondido atrás dos
// blocos, um GENESECT reprogramado.
//
// O desenho do chão sai de `Assets.ciberArt` (src/core/assets.js); andar
// montado no PORYGON é o `drawNoPorygon` do overworld; a saída pelos portais é
// o `sairDoCiber`, que usa a mesma viagem do avião (`zarparPara`).

import { montarGeos } from "./braglitch.js";

export const CIBER = {
  mapa: "ciberespaco",
  // o cara do PORYGON, no cassino
  cassino: "celadon_city_game_corner",
  cara: { x: 15, y: 12 },
  // a chegada: logo acima do portal de volta, olhando pra cima
  chegada: { x: 20, y: 23 },
  // a volta: do lado do cara, no cassino
  volta: { mapa: "celadon_city_game_corner", x: 14, y: 12, nome: "CASSINO DE CELADON" },
};

// # bloco de circuito   . chão de grade   , nuvem de dados (onde os bichos moram)
// Q portal pra uma cidade   q portal de volta pro cassino   1 terminal (placa)
const PLANTA = [
  "#########################################",
  "#####1Q#####1Q#####1Q#####1Q#####1Q######",
  "#####..#####..#####..#####..#####..######",
  "#.....................................,,#",
  "#.,,,,,.....,,,,.........,,,,.....,,,,,,#",
  "#.,,,,,..#..,,,,...###...,,,,..#..,,,,,,#",
  "#.,,,,,..#..,,,,...#,#...,,,,..#..,,,####",
  "#........#.........#,#.........#...,,,#,#",
  "####.....#####...........#######...,,,#,#",
  "#1Q.....................................#",
  "#..........,,,,,,,,,,,,,,,,,,..........,#",
  "#....##....,,,,,,,,,,,,,,,,,,....##...,,#",
  "#....##....,,,,,,,,,,,,,,,,,,....##...,,#",
  "#..........,,,,,,,,,,,,,,,,,,..........,#",
  "#,,.....................................#",
  "#,,,,.....#######.......#######.....,,,,#",
  "#,,,,.......,,,,...........,,,,.....,,,,#",
  "#,,,,.......,,,,...........,,,,.....,,,,#",
  "#...........,,,,...........,,,,.........#",
  "#.....##......................##........#",
  "#.....##......................##........#",
  "#.......................................#",
  "#..,,,,,......,,,,.....,,,,......,,,,,..#",
  "#..,,,,,......,,,,.....,,,,......,,,,,..#",
  "####1Q#####1Q######1q######1Q#####1Q#####",
  "#########################################",
];

// os portais, na ordem em que aparecem na planta (de cima pra baixo, da
// esquerda pra direita). Cada um sai embaixo da porta do Centro Pokémon da
// cidade (na CIDADE DE PALLET, na frente de casa).
const DESTINOS = [
  { nome: "CIDADE DE PALLET", mapa: "pallet", x: 6, y: 8 },
  { nome: "VIRIDIAN", mapa: "viridian", x: 26, y: 27 },
  { nome: "PEWTER", mapa: "pewter_city", x: 17, y: 26 },
  { nome: "CERULEAN", mapa: "cerulean_city", x: 22, y: 20 },
  { nome: "VERMILION", mapa: "vermilion_city", x: 15, y: 7 },
  { nome: "LAVENDER", mapa: "lavender_town", x: 6, y: 6 },
  { nome: "CELADON", mapa: "celadon_city", x: 48, y: 12 },
  { nome: "FUCHSIA", mapa: "fuchsia_city", x: 25, y: 32 },
  { nome: "SAFFRON", mapa: "saffron_city", x: 24, y: 39 },
  { nome: "CINNABAR", mapa: "cinnabar_island", x: 14, y: 12 },
];

export const CIBER_TEXTO = {
  cara: [
    "ESSE AQUI É O MEU PORYGON. ELE É FEITO DE DADOS, SABIA?",
    "ELE ENTRA NO COMPUTADOR DO CASSINO E ANDA LÁ DENTRO, NO CIBERESPAÇO.",
    "LÁ TEM PORTAL PRA TUDO QUANTO É CIDADE. E BICHO QUE SÓ VIVE LÁ.",
  ],
  pergunta: "QUER IR PRO CIBERESPAÇO MONTADO NO MEU PORYGON?",
  opcoes: ["VAMOS!", "AGORA NÃO"],
  naoQuer: "TÁ BOM. ELE FICA AQUI PISCANDO ATÉ VOCÊ VOLTAR.",
  indo: "VOCÊ SOBE NO PORYGON... A TELA DO COMPUTADOR ACENDE... E VOCÊ É PUXADO PRA DENTRO!",
  chegou: "CIBERESPAÇO! O CHÃO É DE GRADE E O AR ZUMBE. CADA PORTAL SAI NUMA CIDADE.",
  saindo: (nome) => `O PORYGON MERGULHA NO PORTAL... DESTINO: ${nome}!`,
  saiu: (nome) => `VOCÊ CAIU FORA DO COMPUTADOR DO CENTRO POKÉMON DE ${nome}!`,
  voltando: "O PORYGON VOLTA PRO COMPUTADOR DO CASSINO...",
  voltou: "VOCÊ ESTÁ DE VOLTA NO CASSINO. O PORYGON PISCA PRA VOCÊ.",
};

/** Monta o mapa e diz pra onde cada portal leva (`w.ciber`). */
export function montarCiber(kanto) {
  if (!kanto?.[CIBER.volta.mapa]) return {};
  const out = montarGeos(kanto, { plantas: { [CIBER.mapa]: PLANTA }, interiores: {}, temas: { [CIBER.mapa]: "ciber" },
                                  cidadePadrao: CIBER.mapa, marca: { ciber: true } });
  const geo = out[CIBER.mapa];
  let i = 0;
  geo.warps = geo.warps.map((w) => {
    if (w.predio === "q") return { ...w, ciber: { ...CIBER.volta, volta: true } };
    if (w.predio === "Q") { const d = DESTINOS[i++]; return d ? { ...w, ciber: d } : w; }
    return w;
  });
  return out;
}

/** o nome da cidade de cada terminal (a placa "1" do lado esquerdo do portal) */
function placas() {
  const out = {};
  let i = 0;
  PLANTA.forEach((linha, y) => [...linha].forEach((c, x) => {
    if (c === "1") {
      const portal = linha[x + 1];
      const nome = portal === "q" ? "CASSINO DE CELADON (VOLTA)" : DESTINOS[i++]?.nome;
      out[`${x},${y}`] = `TERMINAL DO PORTAL:\n> DESTINO = ${nome}`;
    }
  }));
  return out;
}

export const CONTEUDO_CIBER = {
  [CIBER.mapa]: {
    name: "CIBERESPAÇO", music: "ciberespaco", interior: false, ciber: true,
    spawn: { x: CIBER.chegada.x, y: CIBER.chegada.y, dir: "up" },
    signs: placas(),
    lockedWarps: {},
    npcs: [
      { id: "ciber_tesouro_1", x: 39, y: 3, sprite: "ball", gift: { item: "up-grade", qty: 1 } },
      { id: "ciber_tesouro_2", x: 1, y: 16, sprite: "ball", gift: { item: "dubious disc", qty: 1 } },
    ],
    // os bichos digitais, morando nas nuvens de dados
    encounters: [
      { id: "porygon", min: 30, max: 36, w: 20 },
      { id: "rotom", min: 30, max: 35, w: 12 },
      { id: "magnemite", min: 30, max: 34, w: 12 },
      { id: "magneton", min: 34, max: 38, w: 5 },
      { id: "voltorb", min: 30, max: 34, w: 10 },
      { id: "electrode", min: 34, max: 38, w: 4 },
      { id: "klink", min: 30, max: 34, w: 9 },
      { id: "klang", min: 36, max: 39, w: 3 },
      { id: "elgyem", min: 31, max: 35, w: 7 },
      { id: "joltik", min: 30, max: 34, w: 8 },
      { id: "charjabug", min: 33, max: 37, w: 3 },
      { id: "porygon2", min: 36, max: 40, w: 3 },
      { id: "porygonz", min: 40, max: 42, w: 1 },
      { id: "porygonhack", min: 33, max: 38, w: 2 },
      { id: "dittohack", min: 33, max: 38, w: 2 },
    ],
  },
  // o cara do PORYGON e o PORYGON dele, no cassino
  [CIBER.cassino]: {
    addNpcs: [
      { id: "ciber_cara", x: CIBER.cara.x, y: CIBER.cara.y, dir: "left", sprite: "maniaco", ciberespaco: true, lines: [] },
      { id: "ciber_porygon", x: CIBER.cara.x + 1, y: CIBER.cara.y, dir: "left", sprite: "mon:porygon", ciberespaco: true, lines: [] },
    ],
  },
};

/** o GENESECT reprogramado, no corredorzinho escondido de cima à direita (entra em DB.ESTATICOS) */
export const ESTATICO_CIBER = {
  id: "genesect", mapa: CIBER.mapa, x: 39, y: 7, nivel: 55,
  lines: ["NO CANTO DO CIBERESPAÇO, UM POKÉMON DE METAL ROXO ESTÁ PARADO, COM UM CANHÃO NAS COSTAS.",
          "OS OLHOS DELE ACENDEM. ELE FOI REPROGRAMADO. E ACHA QUE VOCÊ É UM VÍRUS!"],
};
