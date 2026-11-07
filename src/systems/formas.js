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
  desfazerTransformacao(mon);        // o DITTO que sai da luta volta a ser DITTO
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

/** O ETERNAMAX (pedido do CAIO, nov/2026): o RAIO ETERNO transforma o
 *  ETERNATUS (src/scenes/battle.js `virarEternamax`), e ele FICA assim depois
 *  da batalha — só volta a ser ETERNATUS quando desmaia ou quando é curado no
 *  CENTRO POKÉMON. Por isso não usa o `megaDe` da MEGA (que se desfaz no fim
 *  de toda luta e ao abrir o jogo): guarda de onde veio em `eternamaxDe`. */
export function virarEternamax(mon) {
  if (!mon || mon.species !== "eternatus" || mon.megaDe || mon.eternamaxDe || !DB.SPECIES.eternatuseternamax) return false;
  const frac = mon.hp / mon.maxHp;
  mon.eternamaxDe = mon.species;
  mon.species = "eternatuseternamax";
  recalc(mon);
  mon.hp = Math.max(1, Math.min(mon.maxHp, Math.round(frac * mon.maxHp)));
  return true;
}

/** volta a ser ETERNATUS (desmaiou, ou o CENTRO POKÉMON curou). */
export function voltarDoEternamax(mon) {
  if (!mon?.eternamaxDe) return false;
  const de = mon.eternamaxDe;
  delete mon.eternamaxDe;
  if (!DB.SPECIES[de]) return false;
  mon.species = de;
  recalc(mon);
  mon.hp = Math.min(mon.hp, mon.maxHp);
  return true;
}

/** A TRANSFORMAÇÃO do DITTO (o golpe `transformacao`): vira a cópia de `alvo`.
 *  Guarda o que ele era em `mon.transformado` (a espécie, os golpes e a vida). */
export function transformar(mon, alvo) {
  if (!mon || !alvo || mon.transformado) return false;
  mon.transformado = { species: mon.species, moves: mon.moves.map((m) => ({ ...m })), maxHp: mon.maxHp };
  const hp = mon.hp, maxHp = mon.maxHp;
  mon.species = alvo.species;
  recalc(mon);
  mon.maxHp = maxHp; mon.hp = Math.min(hp, maxHp);           // a vida continua a do DITTO
  mon.moves = alvo.moves.map((m) => ({ id: m.id, pp: 5, ppMax: 5 }));
  return true;
}

/** volta a ser DITTO (fim da luta, desmaio, troca). */
export function desfazerTransformacao(mon) {
  const t = mon?.transformado;
  if (!t) return false;
  delete mon.transformado;
  const hp = mon.hp;
  mon.species = t.species;
  mon.moves = t.moves;
  recalc(mon);
  mon.hp = Math.min(hp, mon.maxHp);
  return true;
}
