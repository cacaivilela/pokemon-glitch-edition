// RACHAR UM MYSTERY EGG: sorteia a espécie e a forma, e monta o bicho. A tela
// (overworld) só cuida de onde ele vai e do que dizer. Tabelas em src/data/ovos.js.
import { DB } from "../data/index.js";
import { LENDARIOS } from "../data/leilao.js";
import { randRange } from "../core/rng.js";
import { createMon } from "./mon.js";

/** sorteio por peso, igual às tabelas de encontro */
function sortearPeso(tabela) {
  const total = tabela.reduce((a, e) => a + e.w, 0);
  let r = Math.random() * total;
  for (const e of tabela) {
    r -= e.w;
    if (r <= 0) return e;
  }
  return tabela[tabela.length - 1];
}

/** de onde saem as espécies: tudo que é jogável (sem mega, sem fusão, sem tipo
 *  GLITCH) — ou, com `pool: "kanto"`, só os 151 da Pokédex (DB.GEN1; as formas
 *  regionais têm o mesmo número, por isso o filtro é pela tabela, não pelo `dex`) */
export function poolDoOvo() {
  const O = DB.OVOS || {};
  const kanto = new Set(Object.keys(DB.GEN1 || {}));
  return Object.values(DB.SPECIES).filter((sp) =>
    !sp.mega && !sp.fusao && !sp.megaDe && !sp.crescimento
    && !(sp.types || []).includes("GLITCH")
    && (O.pool !== "kanto" || kanto.has(sp.id)));
}

/** o peso de cada espécie no sorteio daquele ovo: 1, ou `lendario` pros lendários */
export const pesoNoOvo = (sp, tipo) => (LENDARIOS.has(sp.id) ? (tipo?.lendario ?? 1) : 1);

/** sorteia a espécie pelo peso (lendário pesa menos — ver src/data/ovos.js) */
function sortearEspecie(pool, tipo) {
  const total = pool.reduce((a, sp) => a + pesoNoOvo(sp, tipo), 0);
  let r = Math.random() * total;
  for (const sp of pool) {
    r -= pesoNoOvo(sp, tipo);
    if (r <= 0) return sp;
  }
  return pool[pool.length - 1];
}

/** Devolve { mon, forma } — ou null se o item não é ovo. */
export function chocar(item) {
  const O = DB.OVOS;
  const tipo = O?.tipos?.[item];
  if (!tipo) return null;
  const pool = poolDoOvo();
  if (!pool.length) return null;
  const sp = sortearEspecie(pool, tipo);
  const forma = sortearPeso(tipo.formas).forma;
  const flags = O.flags[forma] || {};
  let lvl = O.nivel ?? 5;
  // o alfa nasce maior também em nível, como o selvagem (config.js)
  if (flags.alfa) {
    const [a, b] = DB.CONFIG?.alfaNiveis || [6, 12];
    lvl = Math.min(100, lvl + randRange(a, b));
  }
  return { mon: createMon(sp.id, lvl, flags), forma, tipo };
}
