// AS MTs E AS MOs — as regras (os dados em src/data/maquinas.js).
import { DB } from "../data/index.js";
import { MTS, MOS, MT_ETERNA, itemDaMT, itemDaMO, GOLPES_DE_ALFA } from "../data/maquinas.js";
import { FIELD_LEARNERS } from "../data/field.js";

export { itemDaMT, itemDaMO };

let mapa = null, mapaDb = null;
function todas() {
  if (mapa && mapaDb === DB.MOVES) return mapa;
  mapa = new Map();
  MTS.forEach((g, i) => DB.MOVES[g] && mapa.set(itemDaMT(i + 1), { golpe: g, mo: false }));
  MOS.forEach((g, i) => DB.MOVES[g] && mapa.set(itemDaMO(i + 1), { golpe: g, mo: true }));
  if (DB.MOVES[MT_ETERNA.golpe]) mapa.set(MT_ETERNA.item, { golpe: MT_ETERNA.golpe, mo: false, so: MT_ETERNA.so });
  mapaDb = DB.MOVES;
  return mapa;
}

/** { golpe, mo, so? } se o item é uma MT/MO; senão null */
export const golpeDaMaquina = (item) => todas().get(item) || null;
export const ehMaquina = (item) => todas().has(item);
/** todos os nomes de item de MT/MO (pros itens-chave e a mochila) */
export const nomesDasMaquinas = () => [...todas().keys()];
export const nomesDasMOs = () => [...todas()].filter(([, m]) => m.mo).map(([k]) => k);

/** esse Pokémon pode aprender? true, ou o motivo de não ("naoPode", "jaSabe", "soMagikarp") */
export function podeAprender(mon, item) {
  const m = golpeDaMaquina(item);
  if (!m || !mon) return "naoPode";
  if (m.so) return m.so.includes(mon.species) ? (mon.moves.some((x) => x.id === m.golpe) ? "jaSabe" : true) : "soMagikarp";
  if (mon.moves.some((x) => x.id === m.golpe)) return "jaSabe";
  const sp = DB.SPECIES[mon.species];
  // a regra do CAIO: golpe da lista de golpes dele, ou que ele aprende POR MT nos jogos oficiais
  if ((sp?.learnset || []).some(([, g]) => g === m.golpe)) return true;
  const n = MTS.indexOf(m.golpe) + 1;
  if (n && mtsOficiais(mon.species).includes(n)) return true;
  // a MO também deixa quem a JOY já ensinava (pelo tipo)
  const f = m.mo && FIELD_LEARNERS[m.golpe];
  if (f && (mon.types || sp?.types || []).some((t) => f.tipos.includes(t))) return true;
  return "naoPode";
}

/** as MTs que essa espécie aprende nos jogos OFICIAIS (src/data/mt-oficiais.json).
 *  A forma sem lista própria usa a da espécie de mesmo número */
export function mtsOficiais(id) {
  const T = DB.MT_OFICIAIS || {};
  if (T[id]) return T[id];
  const sp = DB.SPECIES[id];
  const base = sp?.formaDe || sp?.megaDe || sp?.unicaDe;
  if (base && T[base]) return T[base];
  if (sp?.dex) { const irmao = Object.values(DB.SPECIES).find((o) => o.dex === sp.dex && T[o.id]); if (irmao) return T[irmao.id]; }
  return [];
}

/** O GOLPE DE ALFA: um golpe forte que essa espécie aprende por MT nos jogos
 *  oficiais (GIGA IMPACTO, HIPER-RAIO, POTÊNCIA EQUINA, GIGA DRENO...) — o
 *  alfa selvagem nasce sabendo. Ou null. */
export function golpeDeAlfa(mon) {
  const pode = new Set(mtsOficiais(mon.species).map((n) => MTS[n - 1]));
  const opcoes = GOLPES_DE_ALFA.filter((g) => pode.has(g) && DB.MOVES[g] && !mon.moves.some((x) => x.id === g));
  if (!opcoes.length) return null;
  // os do tipo dele primeiro (um RAPIDASH alfa sabe POTÊNCIA EQUINA, não HIDROBOMBA)
  const tipos = mon.types || DB.SPECIES[mon.species]?.types || [];
  const doTipo = opcoes.filter((g) => tipos.includes(DB.MOVES[g].type));
  const lista = doTipo.length && Math.random() < 0.7 ? doTipo : opcoes;
  return lista[Math.floor(Math.random() * lista.length)];
}
