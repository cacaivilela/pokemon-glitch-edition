// A CAVERNA DO MONTE SERRA (nov/2026, pedido do CAIO: "faz o monte serra ter
// uma caverna embaixo"; a primeira versão copiava o TÚNEL DE PEDRA do FireRed e
// ele achou que era o MT. MOON — esta é desenhada do zero, como os outros mapas
// de Braglitch).
//
// O paredão da serra tem duas bocas (a letra U na planta, src/data/braglitch-mundo.js):
// uma no pé da serra, perto do RIO DE JANEEVEE, e outra lá no alto, perto da
// ESTRADA REAL. Por dentro a montanha é oca, de granito avermelhado com veio de
// quartzo: quem entra por baixo não chega direto em cima — o andar de cima é
// cortado por um paredão, e o caminho é descer pelo buraco (Q), atravessar o
// FUNDO (o lago e a sala dos cristais) e subir pela escada (q) do outro lado.
//
// A planta é texto, como a das cidades (src/data/braglitch.js, `montarGeos`),
// e o desenho sai de `Assets.cavernaArt` (tema "caverna"):
//   # pedra   . chão   , cascalho (onde moram os selvagens)   o pedregulho
//   k cristal de quartzo   ~ água   U boca pra fora   Q buraco pra descer
//   q escada pra subir   1-9 placa

import { slugify } from "./gen1.js";
import { montarGeos } from "./braglitch.js";

const CIMA = [
  "############################",
  "#########.....U.....########",
  "########...,,,...,,,..######",
  "#######..,,,,,...,,,,..#####",
  "######..,,,o....k..,,...####",
  "#####....,,......kk.....####",
  "####..k......~~~~.......####",
  "####.......~~~~~~~~..o..####",
  "####..,,,..~~~~~~~...,,..###",
  "###..,,,,,...~~~.....,,,.###",
  "###..,,Q,,...1......o....###",
  "############################",
  "############################",
  "#####.....,,,,.....k..######",
  "####..o...,,,,,.......,..###",
  "###...,,,.........,,,,,..###",
  "###..,,,,,..kk....,,Q,,..###",
  "###..,,,,......o...,,,....##",
  "####.......~~~.......o...###",
  "####..,,..~~~~~..,,,.....###",
  "#####.,,,..~~~...,,,,..k####",
  "#####..,........,,,....#####",
  "######....,,,..2......######",
  "########......U....#########",
  "############################",
];

const FUNDO = [
  "##############################",
  "##...,,,,....###....,,,,,..###",
  "#..q..,,,,...###...,,,,k,...##",
  "#.....,,..........,,,,kk,...##",
  "##..o.....~~~~~~.....,,.....##",
  "###......~~~~~~~~~.......o..##",
  "####....~~~~~~~~~~~....,,,..##",
  "####...,,~~~~~~~~~...,,,,,,.##",
  "###...,,,,...~~~....,,kk,,..##",
  "##...,,,,,.........,,kkkk,,.##",
  "##..o..,,.....o......,,kk,,.##",
  "##...........,,,.......,,...##",
  "###..k.....,,,,,,.........###",
  "####......,,,,,,,,....o...####",
  "####..,,,...,,,,....,,,..#####",
  "###..,,,,,.........,,,,,.#####",
  "###...,,,....kk.....,,q..#####",
  "####..........k.........######",
  "##############################",
];

const PLANTAS = { serra_caverna_1f: CIMA, serra_caverna_b1f: FUNDO };

/** Monta os dois andares e liga as bocas do MONTE SERRA neles. `geos` são os
 *  mapas de Braglitch já montados (o MONTE SERRA é mexido aqui: as bocas
 *  ganham o destino). */
export function montarCavernaSerra(kanto, geos) {
  const serra = geos?.monte_serra;
  if (!serra) return {};
  const out = montarGeos(kanto, { plantas: PLANTAS, interiores: {}, temas: { serra_caverna_1f: "caverna", serra_caverna_b1f: "caverna" },
                                  cidadePadrao: "monte_serra", marca: { braglitch: true, regiao: "braglitch" } });
  const cima = out.serra_caverna_1f, fundo = out.serra_caverna_b1f;
  // as portas de cada um, achadas pela letra e pela metade do mapa (no andar
  // de cima o paredão da linha 11 separa a parte de cima da de baixo)
  const idx = (geo, letra, emCima) => geo.warps.findIndex((w) => w.predio === letra && (emCima == null || (w.y < 11) === emCima));
  const liga = (geo, i, to, toWarp) => { geo.warps[i] = { ...geo.warps[i], to, toWarp }; };
  const bocas = serra.warps.map((w, i) => ({ ...w, i })).filter((w) => w.predio === "U").sort((a, b) => b.y - a.y);
  if (bocas.length < 2) return {};
  const [bocaDeBaixo, bocaDeCima] = bocas;
  const uBaixo = idx(cima, "U", false), uCima = idx(cima, "U", true);
  const qBaixo = idx(cima, "Q", false), qCima = idx(cima, "Q", true);
  // no FUNDO: a escada da direita sobe pra parte de baixo, a da esquerda pra de cima
  const [qEsq, qDir] = fundo.warps.map((w, i) => ({ ...w, i })).filter((w) => w.predio === "q").sort((a, b) => a.x - b.x).map((w) => w.i);
  liga(serra, bocaDeBaixo.i, "serra_caverna_1f", uBaixo);
  liga(serra, bocaDeCima.i, "serra_caverna_1f", uCima);
  liga(cima, uBaixo, "monte_serra", bocaDeBaixo.i);
  liga(cima, uCima, "monte_serra", bocaDeCima.i);
  liga(cima, qBaixo, "serra_caverna_b1f", qDir);
  liga(cima, qCima, "serra_caverna_b1f", qEsq);
  liga(fundo, qDir, "serra_caverna_1f", qBaixo);
  liga(fundo, qEsq, "serra_caverna_1f", qCima);
  return out;
}

const time = (lista) => lista.map(([id, lvl]) => ({ id: slugify(id), lvl }));
const SELVAGENS = [
  { id: "taturrao", min: 43, max: 47, w: 20 },
  { id: "concretao", min: 43, max: 46, w: 14 },
  { id: "zerogle", min: 43, max: 47, w: 16 },
  { id: "britadeiro", min: 44, max: 47, w: 8 },
  { id: "sandbash", min: 45, max: 48, w: 4 },
  { id: "lobisomem", min: 44, max: 47, w: 10 },
  { id: "tatubola", min: 40, max: 44, w: 12 },
  { id: "macacavern", min: 42, max: 46, w: 8 },   // o macaco homem das cavernas (família do AMEBO)
];

/** O que tem dentro (no formato de src/data/maps.js). */
export const CONTEUDO_CAVERNA_SERRA = {
  serra_caverna_1f: {
    name: "CAVERNA DO MONTE SERRA", music: "bragCaverna", interior: false, caverna: true, encounters: SELVAGENS,
    spawn: { x: 14, y: 22, dir: "up" },
    placas: {
      1: "SAÍDA DE CIMA: ESTRADA REAL.\n(ESCRITO À MÃO: \"VOCÊ CHEGOU! O FUNDO FOI O PIOR.\")",
      2: "CAVERNA DO MONTE SERRA.\nCUIDADO: O CHÃO DE CASCALHO É CASA DE TATU.",
    },
    npcs: [
      {
        id: "espeleologa", x: 16, y: 15, dir: "left", sprite: "montanhista",
        lines: ["PSIU! FALA BAIXO. A SERRA É OCA, E O ECO ACORDA OS TATU.", "QUANDO A GENTE ACHOU ESTA CAVERNA, A LANTERNA DUROU TRÊS DIAS. A CAVERNA, NÃO ACABOU."],
        afterLines: ["O BURACO COM A ESCADA DESCE PRO FUNDO. LÁ EMBAIXO A PEDRA É MAIS VELHA QUE O MAPA."],
        trainer: { name: "ESPELEÓLOGA RITA", prize: 1300, sight: 4, party: time([["taturrao", 44], ["zerogle", 45]]) },
      },
      {
        id: "eco", x: 7, y: 21, dir: "up", sprite: "garoto",
        lines: ["ÔÔÔÔ! ...ÔÔÔ... ÔÔ...", "VIU? A CAVERNA RESPONDE. MAS SÓ QUANDO ELA QUER."],
      },
      {
        id: "garimpeiro", x: 18, y: 4, dir: "left", sprite: "montanhista",
        lines: ["ESSE CRISTAL É MEU! ACHOU, PERDEU... QUER DIZER, ACHEI, GANHEI!"],
        afterLines: ["É QUARTZO. A SERRA INTEIRA É FEITA DISSO POR DENTRO."],
        trainer: { name: "GARIMPEIRO JUCA", prize: 1300, sight: 4, party: time([["concretao", 45], ["britadeiro", 45]]) },
      },
      { id: "item_serra_1", x: 22, y: 9, sprite: "ball", gift: { item: "pedra da lua", qty: 1 } },
      { id: "item_serra_2", x: 4, y: 18, sprite: "ball", gift: { item: "hiper poção", qty: 2 } },
    ],
  },
  serra_caverna_b1f: {
    name: "CAVERNA DO MONTE SERRA — FUNDO", music: "bragCaverna", interior: false, caverna: true,
    encounters: SELVAGENS.map((e) => ({ ...e, min: e.min + 2, max: e.max + 2 })),
    spawn: { x: 22, y: 15, dir: "up" },
    npcs: [
      {
        id: "tropeiro", x: 15, y: 11, dir: "down", sprite: "gentleman",
        lines: ["MEU AVÔ PASSAVA POR AQUI COM A TROPA, FUGINDO DA CHUVA DE CIMA.", "BATALHA PRA ESQUENTAR? AQUI DENTRO FAZ FRIO."],
        afterLines: ["A TROPA DO MEU AVÔ ERA DE LOBISOMEM. NINGUÉM ACREDITA."],
        trainer: { name: "TROPEIRO ZECA", prize: 1500, sight: 4, party: time([["lobisomem", 46], ["sandbash", 47]]) },
      },
      {
        id: "alpinista", x: 20, y: 3, dir: "left", sprite: "garota",
        lines: ["EU SUBI A SERRA POR FORA CINCO VEZES. POR DENTRO É A PRIMEIRA. E VOCÊ É O PRIMEIRO QUE EU ENCONTRO!"],
        afterLines: ["A SALA DOS CRISTAIS BRILHA SOZINHA. NINGUÉM SABE POR QUÊ."],
        trainer: { name: "ALPINISTA DUDA", prize: 1500, sight: 4, party: time([["tatubola", 44], ["taturrao", 46], ["zerogle", 46]]) },
      },
      { id: "item_serra_3", x: 26, y: 9, sprite: "ball", gift: { item: "doce raro", qty: 1 } },
    ],
  },
};

// as placas: o número na planta vira o texto de `placas` (como nas cidades)
for (const [id, planta] of Object.entries(PLANTAS)) {
  const c = CONTEUDO_CAVERNA_SERRA[id], signs = {};
  planta.forEach((linha, y) => [...linha].forEach((ch, x) => {
    if (/[1-9]/.test(ch) && c.placas?.[ch]) signs[`${x},${y}`] = c.placas[ch];
  }));
  c.signs = signs;
  c.lockedWarps = {};
}
