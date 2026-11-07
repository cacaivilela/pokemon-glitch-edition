// O SUBTERRÂNEO DE KANTO (nov/2026, pedido do CAIO: "o underground kanto tipo
// o de sinnoh").
//
// Embaixo de Kanto inteira tem uma rede de túneis, como o SUBSOLO DE SINNOH:
// uma sala embaixo de cada cidade, túneis ligando as salas na mesma ordem das
// rotas lá de cima, e quatro CAVERNAS grandes com Pokémon que não aparecem lá
// em cima (os filhotes dos pseudo-lendários). Nas paredes, de vez em quando,
// tem um BRILHO: de frente pra ele, Z abre a parede de cavar de sempre (a do
// MONTE LUA, src/scenes/mineracao.js) — e aqui embaixo ela também tem as
// ESTÁTUAS.
//
// COMO SE DESCE: a PICARETA da mochila (a do balconista de VIRIDIAN), ao ar
// livre em Kanto, pergunta DESCER PRO SUBTERRÂNEO ou CAVAR AQUI. Desce na sala
// da cidade mais perto de onde você está. Lá embaixo, a PICARETA (ou a escada
// de qualquer sala) SOBE de volta pro lugar de onde você desceu.
//
// AS ESTÁTUAS (ideia do CAIO): saem da parede, e são MÓVEIS de base secreta.
// Pôs a estátua de um Pokémon na sua base, naquela REGIÃO ele tem 5x mais
// chance de nascer SHINY (src/systems/subterraneo.js, `fatorEstatua`).
//
// O mapa é montado por código (`plantaDoSubterraneo`), como o fundo do mar, e
// pintado como a caverna do MONTE SERRA (Assets.cavernaArt, tema "subterraneo").

import { montarGeos } from "./braglitch.js";

export const SUB_MAPA = "subterraneo_kanto";
const W = 96, H = 72;

/** as salas embaixo de cada cidade: o centro (x, y) no mapa de baixo, mais ou
 *  menos onde a cidade fica lá em cima */
export const SALAS = {
  pewter_city: { x: 14, y: 10, nome: "EMBAIXO DE PEWTER" },
  cerulean_city: { x: 66, y: 9, nome: "EMBAIXO DE CERULEAN" },
  viridian: { x: 14, y: 30, nome: "EMBAIXO DE VIRIDIAN" },
  celadon_city: { x: 36, y: 30, nome: "EMBAIXO DE CELADON" },
  saffron_city: { x: 60, y: 30, nome: "EMBAIXO DE SAFFRON" },
  lavender_town: { x: 84, y: 30, nome: "EMBAIXO DE LAVENDER" },
  pallet: { x: 14, y: 52, nome: "EMBAIXO DE PALLET" },
  vermilion_city: { x: 62, y: 52, nome: "EMBAIXO DE VERMILION" },
  fuchsia_city: { x: 40, y: 60, nome: "EMBAIXO DE FUCHSIA" },
  cinnabar_island: { x: 14, y: 66, nome: "EMBAIXO DE CINNABAR" },
};
/** os túneis: quem liga em quem (as rotas lá de cima) */
const TUNEIS = [
  ["pewter_city", "viridian"], ["viridian", "pallet"], ["pallet", "cinnabar_island"], ["pewter_city", "cerulean_city"],
  ["cerulean_city", "saffron_city"], ["cerulean_city", "lavender_town"], ["viridian", "celadon_city"],
  ["celadon_city", "saffron_city"], ["saffron_city", "lavender_town"], ["saffron_city", "vermilion_city"],
  ["lavender_town", "vermilion_city"], ["vermilion_city", "fuchsia_city"], ["celadon_city", "fuchsia_city"],
  ["fuchsia_city", "cinnabar_island"],
];
/** as CAVERNAS grandes (com cascalho, onde moram os selvagens) e em que sala elas abrem */
export const CAVERNAS = [
  { x: 40, y: 12, liga: "celadon_city", nome: "CAVERNA DO ECO" },
  { x: 84, y: 12, liga: "lavender_town", nome: "CAVERNA FUNDA" },
  { x: 30, y: 45, liga: "celadon_city", nome: "CAVERNA DAS RAÍZES" },
  { x: 84, y: 58, liga: "vermilion_city", nome: "CAVERNA DO MAR" },
];

/** de cada mapa de Kanto, pra que sala se desce (cidade = a dela; rota = a da ponta mais perto) */
export const DESCE_EM = {
  route1: "pallet", route2: "viridian", route22: "viridian", route23: "viridian", route3: "pewter_city",
  route4: "cerulean_city", route24: "cerulean_city", route25: "cerulean_city", route5: "cerulean_city",
  route6: "vermilion_city", route7: "celadon_city", route8: "lavender_town", route9: "cerulean_city",
  route10: "lavender_town", route11: "vermilion_city", route12: "lavender_town", route13: "fuchsia_city",
  route14: "fuchsia_city", route15: "fuchsia_city", route16: "celadon_city", route17: "fuchsia_city",
  route18: "fuchsia_city", route19: "fuchsia_city", route20: "cinnabar_island", route21_north: "pallet",
  route21_south: "cinnabar_island",
};

/** O MAPA, montado: tudo pedra; as salas, os túneis de 3 de largura e as
 *  cavernas cavados em cima. Sempre igual (nada sorteado aqui). */
export function plantaDoSubterraneo() {
  const g = Array.from({ length: H }, () => Array(W).fill("#"));
  const pinta = (x, y, c) => { if (x > 0 && y > 0 && x < W - 1 && y < H - 1) g[y][x] = c; };
  const caixa = (cx, cy, w, h, c = ".") => {
    for (let y = cy - (h >> 1); y <= cy + (h >> 1); y++) for (let x = cx - (w >> 1); x <= cx + (w >> 1); x++) pinta(x, y, c);
  };
  const tunel = (a, b) => {
    // em L: anda na horizontal, depois na vertical, 3 de largura
    for (let x = Math.min(a.x, b.x); x <= Math.max(a.x, b.x); x++) for (let d = -1; d <= 1; d++) if (g[a.y + d][x] === "#") pinta(x, a.y + d, ".");
    for (let y = Math.min(a.y, b.y); y <= Math.max(a.y, b.y); y++) for (let d = -1; d <= 1; d++) if (g[y][b.x + d] === "#") pinta(b.x + d, y, ".");
  };
  for (const [a, b] of TUNEIS) tunel(SALAS[a], SALAS[b]);
  for (const c of CAVERNAS) tunel(c, SALAS[c.liga]);
  // as cavernas: grandes, de cascalho, com pedregulhos e cristais
  CAVERNAS.forEach((c, i) => {
    caixa(c.x, c.y, 15, 11, ",");
    caixa(c.x, c.y, 11, 13, ",");
    for (const [dx, dy] of [[-4, -2], [3, 3], [5, -3], [-5, 3]]) pinta(c.x + dx, c.y + dy, i % 2 ? "k" : "o");
  });
  // as salas das cidades: chão liso, a placa e a escada de subir
  for (const s of Object.values(SALAS)) {
    caixa(s.x, s.y, 11, 7, ".");
    pinta(s.x - 4, s.y - 2, "1");
    pinta(s.x + 4, s.y + 2, "q");
  }
  return g.map((l) => l.join(""));
}

/** a geometria (no formato de assets/maps/kanto.json) */
export function montarSubterraneo(kanto) {
  const planta = plantaDoSubterraneo();
  const out = montarGeos(kanto, { plantas: { [SUB_MAPA]: planta }, interiores: {}, temas: { [SUB_MAPA]: "subterraneo" },
                                  cidadePadrao: SUB_MAPA, marca: {} });
  // as escadas (q) não levam a um lugar fixo: sobem pra onde você desceu
  // (src/scenes/overworld.js, `subirDoSubterraneo`)
  out[SUB_MAPA].warps = [];
  out[SUB_MAPA].escadas = planta.flatMap((l, y) => [...l].map((c, x) => (c === "q" ? { x, y } : null)).filter(Boolean));
  return out;
}

/** quem mora nas cavernas (só no cascalho) — os filhotes que não aparecem lá em cima */
export const SELVAGENS_SUB = [
  { id: "gible", min: 24, max: 32, w: 8 }, { id: "larvitar", min: 24, max: 32, w: 8 },
  { id: "bagon", min: 24, max: 32, w: 8 }, { id: "beldum", min: 24, max: 32, w: 6 },
  { id: "deino", min: 24, max: 32, w: 6 }, { id: "axew", min: 24, max: 32, w: 8 },
  { id: "goomy", min: 24, max: 32, w: 6 }, { id: "jangmoo", min: 24, max: 32, w: 6 },
  { id: "dreepy", min: 24, max: 32, w: 5 }, { id: "riolu", min: 24, max: 32, w: 6 },
  { id: "diglett", min: 22, max: 30, w: 12 }, { id: "onix", min: 24, max: 32, w: 8 },
  { id: "drilbur", min: 24, max: 32, w: 8 }, { id: "nosepass", min: 24, max: 32, w: 5 },
];

/** AS ESTÁTUAS: o Pokémon de cada uma (o item é "estátua de <nome>") */
export const ESTATUAS = ["pikachu", "eevee", "charmander", "bulbasaur", "squirtle", "dratini", "gible", "larvitar",
  "riolu", "gastly", "abra", "magikarp", "ditto", "snorlax", "lapras", "onix", "growlithe", "vulpix", "scyther", "porygon"];
export const FATOR_ESTATUA = 5;

/** os textos */
export const SUB_TEXTO = {
  picareta: "O QUE FAZER COM A PICARETA?",
  picaretaOps: ["DESCER PRO SUBTERRÂNEO", "CAVAR AQUI", "SAIR"],
  desceu: ["VOCÊ CAVOU PRA BAIXO... E CAIU NUM TÚNEL!", "BEM-VINDO AO SUBTERRÂNEO DE KANTO. ONDE TEM BRILHO NA PAREDE, TEM COISA ENTERRADA."],
  soKanto: "AQUI NÃO DÁ PRA CAVAR PRA BAIXO. O SUBTERRÂNEO FICA EMBAIXO DE KANTO, AO AR LIVRE.",
  subir: "SUBIR DE VOLTA PRA {LUGAR}?",
  subirOps: ["SUBIR", "FICAR"],
  brilho: "TEM ALGUMA COISA BRILHANDO NA PAREDE!",
  cavar: "CAVAR?",
  cavarOps: ["CAVAR", "AGORA NÃO"],
  jaCavado: "ESSA PAREDE JÁ FOI CAVADA HOJE. AMANHÃ BRILHA DE NOVO.",
  estatuaLore: "UMA ESTÁTUA DE {MON} ESCULPIDA NA PEDRA DO SUBTERRÂNEO. NA SUA BASE SECRETA, {MON} NASCE SHINY 5X MAIS NAQUELA REGIÃO.",
};

/** os brilhos: quantos por dia, espalhados pelas paredes que dão pra um chão */
export const BRILHOS_POR_DIA = 40;
