// Regras de batalha (sem render): dano, stages, status, captura e IA.
import { DB } from "../data/index.js";
import { pick, chance, clamp, randRange } from "../core/rng.js";
import { isFainted } from "./mon.js";

const STAGE_MULT = [0.25, 0.28, 0.33, 0.4, 0.5, 0.66, 1, 1.5, 2, 2.5, 3, 3.5, 4];
export const newStages = () => ({ atk: 0, def: 0, spa: 0, spd: 0, spe: 0, acc: 0, eva: 0 });
const withStage = (v, s) => Math.max(1, Math.floor(v * STAGE_MULT[clamp(s + 6, 0, 12)]));

export function effectiveStat(mon, key, stages) {
  let v = withStage(mon.stats[key], stages[key] || 0);
  if (mon.status === "paralisia" && key === "spe") v = Math.floor(v / 2);
  if (mon.status === "queimadura" && key === "atk") v = Math.floor(v / 2);
  return v;
}

export function calcDamage(atk, def, moveId, aStages, dStages) {
  const mv = DB.MOVES[moveId];
  const eff = DB.effectiveness(mv.type, def.types);
  if (mv.category === "status" || mv.power === 0) return { dmg: 0, eff: 1, crit: false, mv };
  if (eff === 0) return { dmg: 0, eff: 0, crit: false, mv };

  const physical = mv.category === "fisico";
  const A = effectiveStat(atk, physical ? "atk" : "spa", aStages);
  const D = Math.max(1, effectiveStat(def, physical ? "def" : "spd", dStages));
  const crit = chance((mv.crit || 1) / 16);
  const stab = atk.types.includes(mv.type) ? 1.5 : 1;
  const rand = randRange(85, 100) / 100;

  let dmg = Math.floor(Math.floor((Math.floor((2 * atk.level) / 5 + 2) * mv.power * A) / D) / 50) + 2;
  dmg = Math.floor(dmg * stab * eff * rand * (crit ? 2 : 1));
  if (atk.corrupt) dmg = Math.floor(dmg * 1.2);

  // Espelho: bater num Pokémon corrompido usando a MESMA espécie faz o dado
  // dele entrar em conflito consigo mesmo — 8x de dano.
  const mirror = !!def.corrupt && atk.species === def.species;
  if (mirror) dmg *= 8;

  return { dmg: Math.max(1, dmg), eff, crit, mv, mirror };
}

export function accuracyCheck(moveId, aStages, dStages) {
  const mv = DB.MOVES[moveId];
  if (mv.acc >= 100) return true;
  const mod = STAGE_MULT[clamp((aStages.acc || 0) - (dStages.eva || 0) + 6, 0, 12)];
  return chance((mv.acc * mod) / 100);
}

export function applyMoveEffects(mv, user, target, uStages, tStages) {
  const msgs = [];
  if (mv.stat) {
    const s = mv.stat.target === "self" ? uStages : tStages;
    const who = mv.stat.target === "self" ? user : target;
    const before = s[mv.stat.key] || 0;
    s[mv.stat.key] = clamp(before + mv.stat.delta, -6, 6);
    const label = { atk: "ATAQUE", def: "DEFESA", spa: "ESP.", spd: "ESP.DEF", spe: "VELOCIDADE" }[mv.stat.key];
    msgs.push(s[mv.stat.key] === before
      ? `${who.nickname} NÃO PODE ${mv.stat.delta > 0 ? "SUBIR" : "CAIR"} MAIS!`
      : `${label} DE ${who.nickname} ${mv.stat.delta > 0 ? "SUBIU" : "CAIU"}!`);
  }
  if (mv.burn && !target.status && chance(mv.burn)) { target.status = "queimadura"; msgs.push(`${target.nickname} SE QUEIMOU!`); }
  if (mv.para && !target.status && chance(mv.para)) { target.status = "paralisia"; msgs.push(`${target.nickname} FICOU PARALISADO!`); }
  if (mv.poison && !target.status && !target.types.includes("VENENO") && chance(mv.poison)) {
    target.status = "envenenado";
    msgs.push(`${target.nickname} FOI ENVENENADO!`);
  }
  return msgs;
}

export function statusTickDamage(mon) {
  if (mon.status === "queimadura" || mon.status === "envenenado") return Math.max(1, Math.floor(mon.maxHp / 16));
  return 0;
}

export const effText = (eff) =>
  eff === 0 ? "NÃO AFETA O ALVO..." : eff > 1.9 ? "É SUPER EFETIVO!" : eff > 1 ? "É EFETIVO." : eff < 0.6 ? "NÃO É MUITO EFETIVO..." : null;

/** IA simples: prioriza o golpe com maior dano esperado. */
export function chooseAiMove(foe, player, fStages, pStages) {
  const usable = foe.moves.filter((m) => m.pp > 0);
  if (!usable.length) return null;
  let best = usable[0], bestScore = -1;
  for (const m of usable) {
    const mv = DB.MOVES[m.id];
    const eff = DB.effectiveness(mv.type, player.types);
    let score = (mv.power || 25) * eff * (foe.types.includes(mv.type) ? 1.5 : 1);
    if (mv.category === "status") score = 30 + Math.random() * 20;
    score *= 0.8 + Math.random() * 0.4;
    if (score > bestScore) { bestScore = score; best = m; }
  }
  return best;
}

/** Formula de captura simplificada (Gen 3). Retorna nº de chacoalhadas 0..4. */
export function catchAttempt(mon, ballBonus = 1) {
  const rate = DB.SPECIES[mon.species].catchRate;
  const statusBonus = mon.status ? 1.5 : 1;
  const a = ((3 * mon.maxHp - 2 * mon.hp) / (3 * mon.maxHp)) * rate * ballBonus * statusBonus;
  if (a >= 255) return 4;
  const b = Math.floor(1048560 / Math.floor(Math.sqrt(Math.floor(Math.sqrt(Math.floor(16711680 / a))))));
  let shakes = 0;
  for (let i = 0; i < 4; i++) { if (Math.floor(Math.random() * 65536) < b) shakes++; else break; }
  return shakes;
}

/** GLITCHBALL (STORY.glitchball): feita do mesmo dado quebrado que ele.
 *  Num MISSINGNO. — ou em qualquer coisa corrompida — ela só falha se 51
 *  sorteios de shiny saírem shiny em sequência. É a mesma moeda que decide a
 *  cor de um selvagem na grama (CONFIG.shinyOdds), jogada 51 vezes: uma a mais
 *  que os cinquenta seguidos que o professor cita, então falhar é literalmente
 *  mais raro que isso. Na prática o laço morre no primeiro sorteio.
 *  Em bicho normal ela é só uma bola muito boa. */
export const GLITCHBALL_SHINIES = 51;
export function catchGlitchball(mon) {
  if (mon.species !== "missingno" && !mon.corrupt) return catchAttempt(mon, 5);
  const odds = DB.CONFIG?.shinyOdds ?? 1 / 1024;
  for (let i = 0; i < GLITCHBALL_SHINIES; i++) {
    if (!chance(odds)) return 4;      // um sorteio saiu comum: a bola prende
  }
  return 0;                           // 51 shinies seguidos. boa sorte com isso
}

export function canFlee(player, foe, attempts) {
  // fórmula clássica; o `% 256` é do original mesmo (por isso ser lento demais
  // às vezes vira fuga fácil). CONFIG.fleeBoost multiplica o resultado.
  const base = (Math.floor((player.stats.spe * 128) / Math.max(1, foe.stats.spe)) + 30 * attempts) % 256;
  const odds = Math.min(256, base * (DB.CONFIG?.fleeBoost ?? 1));
  return Math.floor(Math.random() * 256) < odds;
}

export const anyAlive = (party) => party.some((m) => !isFainted(m));
