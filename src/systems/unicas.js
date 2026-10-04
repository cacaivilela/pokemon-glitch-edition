// AS FORMAS ÚNICAS vestidas pelo GUARDA-ROUPA (src/data/guarda-roupa.js; as
// espécies são montadas em src/data/index.js, `aplicarUnicas`). Não existe
// forma única selvagem: a forma é uma roupa que se veste num bicho seu.
import { DB } from "../data/index.js";
import { recalc } from "./mon.js";

/** a espécie "de verdade" debaixo da roupa */
export const baseDe = (species) => DB.SPECIES[species]?.unicaDe || species;

/** as roupas que este bicho pode vestir: a normal e as únicas da espécie dele */
export const roupasDe = (mon) => {
  const base = baseDe(mon.species);
  return [base, ...(DB.UNICAS_DE?.[base] || [])];
};

/** veste (ou tira) a roupa. O apelido só acompanha se era o nome da espécie. */
export function vestir(mon, id) {
  const nomeAntes = DB.SPECIES[mon.species]?.name;
  const hp = mon.maxHp ? mon.hp / mon.maxHp : 1;
  mon.species = id;
  if (mon.nickname === nomeAntes) mon.nickname = DB.SPECIES[id].name;
  recalc(mon);
  mon.hp = Math.max(mon.hp > 0 ? 1 : 0, Math.round(mon.maxHp * hp));
}
