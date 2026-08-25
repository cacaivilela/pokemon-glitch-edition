// Encontros na grama alta + a chance corrompida da GLITCH EDITION.
import { DB } from "../data/index.js";
import { createMon } from "./mon.js";
import { garantirEspecie } from "./fusao.js";
import { randRange, chance } from "../core/rng.js";

export const ENCOUNTER_RATE = 0.11; // fallback; o valor real vem de DB.CONFIG.encounterRate

/** Encontro dentro da 011GLITCHDIMENSION110.
 *  A tabela depende do terreno do tile (ar / terra / água) e cada terreno tem
 *  seu lendário, raríssimo. A cada DB.SHINY_EVERY aparições, uma vem shiny. */
export function rollDimEncounter(terrain, state) {
  const table = DB.DIM_ENCOUNTERS?.[terrain] || DB.DIM_ENCOUNTERS?.terra || [];
  if (!table.length) return null;

  state.dimSeen = (state.dimSeen || 0) + 1;
  const shiny = state.dimSeen % (DB.SHINY_EVERY || 2956) === 0;

  // o intruso não olha terreno nenhum
  const odd = DB.RARE_LEGEND;
  if (odd && DB.SPECIES[odd.id] && chance(odd.chance ?? 0)) {
    return { mon: createMon(odd.id, randRange(odd.min, odd.max), { shiny }), glitch: true, legend: true };
  }

  const trio = DB.WEATHER_TRIO?.[terrain];
  if (trio && chance(DB.TRIO_CHANCE ?? 0.003)) {
    return { mon: createMon(trio, randRange(45, 60), { shiny }), glitch: true, legend: true };
  }

  const total = table.reduce((a, e) => a + e.w, 0);
  let r = Math.random() * total;
  for (const e of table) {
    r -= e.w;
    if (r <= 0) {
      return { mon: createMon(e.id, randRange(e.min, e.max), { shiny, corrupt: chance(0.15) }), glitch: true };
    }
  }
  return null;
}

/** As flores da VILA PALETA depois que o mundo bugou (`flores` em maps.js).
 *  Não olha tabela de encontro nem corrupção: se o mundo está quebrado, é ali
 *  que MISSINGNO. encosta — a flor é o pedaço de tela mais velho do cartucho. */
export function rollFlores(min = 5, max = 12) {
  if (!DB.SPECIES?.missingno) return null;
  return { mon: createMon("missingno", randRange(min, max), { corrupt: true }), glitch: true };
}

/** `sorte` vem do SANDUÍCHE AMARGO do acampamento: multiplica a chance de shiny. */
export function rollEncounter(mapId, corruption = 0, glitchOn = false, sorte = 1) {
  const map = DB.MAPS[mapId];
  const table = map?.encounters || [];
  if (!table.length) return null;

  // MISSINGNO. só existe com o modo glitch ligado (src/data/config.js)
  const on = glitchOn || DB.CONFIG?.glitchMode;
  const glitchChance = !on || corruption < 25 ? 0 : Math.min(0.35, (corruption - 25) / 200);
  const shiny = chance((DB.CONFIG?.shinyOdds ?? 0) * sorte);   // shiny solto pela grama
  if (chance(glitchChance)) {
    const lvl = randRange(5, 12);
    return { mon: createMon("missingno", lvl, { corrupt: true, shiny }), glitch: true };
  }

  // A FUSÃO SELVAGEM: raríssima, e antes da tabela porque ela não está na
  // tabela de mapa nenhum. `garantirEspecie` monta a espécie na hora (o id
  // carrega a dupla e a variante), como o jogo já faz pra fusão que vem de save.
  const rara = DB.FUSAO_SELVAGEM;
  if (rara && chance(rara.chance ?? 0) && garantirEspecie(rara.id)) {
    return { mon: createMon(rara.id, randRange(rara.min, rara.max), { shiny }), glitch: true };
  }

  const total = table.reduce((s, e) => s + e.w, 0);
  let r = Math.random() * total;
  for (const e of table) {
    r -= e.w;
    if (r <= 0) {
      const lvl = randRange(e.min, e.max);
      const corrupt = !!on && corruption > 40 && chance(Math.min(0.15, corruption / 800));
      return { mon: createMon(e.id, lvl, { corrupt, shiny }), glitch: false };
    }
  }
  return null;
}
