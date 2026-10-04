// AS FORMAS REGIONAIS, por dentro: o LUGAR onde uma evolução acontece.
//
// A tabela está em src/data/regionais.js. O que este arquivo resolve é a única
// coisa que não cabe numa tabela: um PIKACHU pode virar RAICHU **ou**
// RAICHU-ALOLA, e quem decide não é o nível nem a pedra — é onde você estava
// quando usou a pedra. Nos jogos de verdade a forma regional é a criação
// daquela região; aqui isso vira "que mapa é este?".
//
// OS TRÊS LUGARES que uma regra pode pedir:
//
//   "sevii"   as ILHAS SEVII, o pedaço de mundo deste jogo que não é Kanto e
//             ainda assim é chão de verdade. É onde sai o RAICHU-ALOLA.
//   "fenda"   dentro da 011GLITCHDIMENSION110, de onde as formas vazam.
//   "braglitch" qualquer mapa de BRAGLITCH (a cuia do VICTREEBEL sai lá).
//   "fora"    qualquer lugar que não seja Kanto: as de cima, as três eras
//             do CELEBI, o recife da tempestade e BRAGLITCH.
//
// Regra sem `onde` vale em qualquer lugar — e é por isso que ela é sempre a
// ÚLTIMA da lista de uma espécie: quem tem lugar é conferido primeiro, senão a
// regra genérica atenderia antes e a bifurcação nunca aconteceria.
import { DB } from "../data/index.js";

/** As SEVII pelo id do mapa. São sete ilhas com dezenas de mapas cada (portos,
 *  cavernas, centros), então a conta é por prefixo e não por lista escrita à
 *  mão: uma lista aqui ficaria pra trás no dia em que um mapa novo entrasse. */
const SEVII = /^(one|two|three|four|five|six|seven)_island|^navel_rock|^mt_ember/;

export const nasSevii = (mapa) => SEVII.test(mapa || "");
export const naFenda = (mapa) => mapa === "glitchdim";
export const naEra = (mapa) => (DB.ERAS || []).some((e) => e.mapa === mapa);
/** BRAGLITCH: qualquer mapa de lá (src/data/braglitch.js marca a geometria). */
export const emBraglitch = (mapa) => !!DB.KANTO?.[mapa]?.braglitch;
/** A REGIÃO de um mapa: "braglitch" ou "kanto" (tudo o mais: Kanto, as SEVII,
 *  a fenda, as eras...). É o que o VOAR e o objetivo na tela usam pra separar
 *  as listas. */
export const regiaoDoMapa = (mapa) => DB.KANTO?.[mapa]?.regiao || "kanto";
/** EM BRAGLITCH O GLITCH VIRA FOLCLORE: o que escapa dos dados vira lenda
 *  (SACI, BOITATÁ, IARA...), e não MISSINGNO. Até você pegar AS SEIS LENDAS
 *  (DB.LENDAS_BRAG): aí não sobra lenda pra virar, o MISSINGNO chega
 *  (`flags.bragGlitch`, src/scenes/overworld.js) e lá o glitch passa a ser
 *  GLITCH — no mato e na tela, como em Kanto quebrado. */
export const seisLendasPegas = (st) => {
  const lendas = DB.LENDAS_BRAG || [];
  return lendas.length > 0 && lendas.every((l) => st?.caught?.[l.id]);
};
/** Este mapa, agora, tem glitch de verdade? Em Braglitch só depois do
 *  `bragGlitch`; no resto, quando o mundo de Kanto quebrou. */
export const glitchDeVerdade = (st, mapa) =>
  emBraglitch(mapa) ? !!st?.flags?.bragGlitch : !!st?.flags?.glitchWorld;
export const foraDeKanto = (mapa) =>
  nasSevii(mapa) || naFenda(mapa) || naEra(mapa) || mapa === "tempestade" || emBraglitch(mapa);

/** Esta regra de evolução vale NESTE mapa? */
export function lugarBate(regra, mapa) {
  const onde = regra?.onde;
  if (!onde) return true;                 // sem lugar: vale em qualquer canto
  if (onde === "sevii") return nasSevii(mapa);
  if (onde === "fenda") return naFenda(mapa);
  if (onde === "fora") return foraDeKanto(mapa);
  if (onde === "braglitch") return emBraglitch(mapa);
  return onde === mapa;                   // um mapa escrito na mão também serve
}

/** O que a pedra `item` faz com esta espécie AQUI. Devolve o id da espécie nova
 *  ou null. É a mesma busca que a mochila faz, mas olhando o lugar — sem isso a
 *  primeira regra da lista ganharia sempre e o RAICHU-ALOLA não existiria. */
export function alvoDaPedra(item, especie, mapa) {
  for (const r of DB.EVOLUTIONS?.[especie] || []) {
    if (r.item !== item || !DB.SPECIES?.[r.to]) continue;
    if (lugarBate(r, mapa)) return r.to;
  }
  return null;
}

/** A região de uma espécie (ALOLA/GALAR/HISUI/PALDEA), ou null pro resto. */
export const regiaoDe = (especie) => DB.REGIAO?.[especie] || null;

/** true quando a espécie é uma forma regional. */
export const ehRegional = (especie) => !!regiaoDe(especie);

/** Todas as formas de uma região. */
export const daRegiao = (regiao) =>
  Object.keys(DB.REGIAO || {}).filter((id) => DB.REGIAO[id] === regiao);
