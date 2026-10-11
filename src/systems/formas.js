// AS FORMAS DE BATALHA (src/data/formas-batalha.js): a regra de quando cada
// uma troca. A troca usa o mesmo caminho da MEGA (`mon.megaDe` guarda a
// espécie de sempre; src/systems/mega.js `reverterMega` desfaz no fim da luta).
//
// WISHIWASHI (habilidade CARDUME): do nível 20 em diante, com mais de 1/4 da
//   vida, ele é CARDUME — vale ao entrar e no fim de cada turno. Caiu pra
//   1/4 ou menos, o cardume se desfaz e ele volta a SOLITÁRIO.
// PALAFIN (habilidade ZERO A HERÓI): entra ZERO. Se sair da luta numa troca e
//   voltar, volta HERÓI e fica assim até a batalha acabar.
import { DB } from "../data/index.js";
import { recalc } from "./mon.js";

// quem já saiu da luta numa troca (um WeakSet: nada disso vai pro save)
const SAIU = new WeakSet();

const baseDe = (mon) => mon.megaDe || mon.species;

/** Saiu da luta numa troca: o PALAFIN volta HERÓI na próxima entrada, e o
 *  CARDUME do WISHIWASHI se desfaz no banco (ele volta SOLITÁRIO). */
export function saiuDaLuta(mon) {
  if (!mon) return;
  if (baseDe(mon) === "palafin") SAIU.add(mon);
  if (mon.species === "wishiwashicardume") {
    const frac = mon.hp / mon.maxHp;
    mon.species = "wishiwashi";
    delete mon.megaDe;
    recalc(mon);
    mon.hp = Math.max(1, Math.min(mon.maxHp, Math.round(frac * mon.maxHp)));
  }
}

/** a forma que ele deveria ter agora (id da espécie), ou null se não é dos que trocam */
function formaCerta(mon) {
  const base = baseDe(mon);
  if (base === "wishiwashi") return mon.level >= 20 && mon.hp > mon.maxHp / 4 ? "wishiwashicardume" : "wishiwashi";
  if (base === "palafin") return SAIU.has(mon) ? "palafinheroi" : "palafin";
  return null;
}

/** Troca a forma se for a hora. Devolve o texto pra batalha dizer, ou null. */
export function ajustarForma(mon) {
  if (!mon || mon.hp <= 0) return null;
  const quer = formaCerta(mon);
  if (!quer || quer === mon.species || !DB.SPECIES[quer]) return null;
  const base = baseDe(mon);
  if (quer === base) delete mon.megaDe;
  else mon.megaDe = base;
  const frac = mon.hp / mon.maxHp;
  mon.species = quer;
  recalc(mon);
  // o HP máximo das duas formas é o mesmo; se um dia não for, fica a mesma fração
  mon.hp = Math.max(1, Math.min(mon.maxHp, Math.round(frac * mon.maxHp)));
  if (quer === "wishiwashicardume") return `${mon.nickname} CHAMOU OS AMIGOS E FORMOU UM CARDUME!`;
  if (quer === "wishiwashi") return `O CARDUME DE ${mon.nickname} SE DESFEZ!`;
  if (quer === "palafinheroi") return `${mon.nickname} VOLTOU COMO HERÓI!`;
  return null;
}
