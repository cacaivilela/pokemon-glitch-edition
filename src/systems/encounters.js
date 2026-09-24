// Encontros na grama alta + a chance corrompida da GLITCH EDITION.
import { DB } from "../data/index.js";
import { createMon, sortearBrilho } from "./mon.js";
import { garantirEspecie } from "./fusao.js";
import { randRange, chance } from "../core/rng.js";

export const ENCOUNTER_RATE = 0.11; // fallback; o valor real vem de DB.CONFIG.encounterRate

/** Encontro dentro da 011GLITCHDIMENSION110.
 *  A tabela depende do terreno do tile (ar / terra / água) e cada terreno tem
 *  seu lendário, raríssimo. A cada DB.SHINY_EVERY aparições, uma vem shiny. */
export function rollDimEncounter(terrain, state) {
  const table = DB.DIM_ENCOUNTERS?.[terrain] || DB.DIM_ENCOUNTERS?.terra || [];
  if (!table.length) return null;

  // A GLITCH RAID SAIU DAQUI. Ela era um encontro raro no meio desta tabela, e
  // aqui dentro ninguém entra por acaso: quem chegava já tinha visto tudo, e o
  // chefe virava mais um bicho da lista. Agora ela chega por um RASGO na grama
  // de Kanto (ver src/systems/raid.js) — a fenda deixou de ser um lugar aonde
  // você vai e virou uma coisa que vaza pra cá.

  state.dimSeen = (state.dimSeen || 0) + 1;
  // aqui o shiny é contado, não sorteado; o luminoso é sorteado como em todo
  // lugar — e quando sai, é ele que aparece
  const brilho = sortearBrilho({ shiny: state.dimSeen % (DB.SHINY_EVERY || 2956) === 0 });

  // o intruso não olha terreno nenhum
  const odd = DB.RARE_LEGEND;
  if (odd && DB.SPECIES[odd.id] && chance(odd.chance ?? 0)) {
    return { mon: createMon(odd.id, randRange(odd.min, odd.max), brilho), glitch: true, legend: true };
  }

  const trio = DB.WEATHER_TRIO?.[terrain];
  if (trio && chance(DB.TRIO_CHANCE ?? 0.003)) {
    return { mon: createMon(trio, randRange(45, 60), brilho), glitch: true, legend: true };
  }

  const total = table.reduce((a, e) => a + e.w, 0);
  let r = Math.random() * total;
  for (const e of table) {
    r -= e.w;
    if (r <= 0) {
      // `corrupt: true` na entrada nasce corrompido SEMPRE (é o caso das FORMAS
      // HACKEANAS, que são literalmente isso) — igual ao que a tabela de Kanto
      // já fazia logo abaixo. O resto da fenda continua na chance de sempre.
      const { lvl, opts } = talvezAlfa(randRange(e.min, e.max),
        { ...brilho, corrupt: !!e.corrupt || chance(0.15) });
      return { mon: createMon(e.id, lvl, opts), glitch: true };
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
/** UM EM `alfaOdds` NASCE ALFA: sobe de nível e ganha a marca. Vale pra Kanto
 *  e pra fenda — a fusão selvagem e o MISSINGNO. ficam de fora, que já são a
 *  raridade deles. Devolve as opções de createMon já com o nível ajustado. */
function talvezAlfa(lvl, opts = {}) {
  const C = DB.CONFIG || {};
  if (!chance(C.alfaOdds ?? 0)) return { lvl, opts };
  const [a, b] = C.alfaNiveis || [6, 12];
  return { lvl: Math.min(100, lvl + randRange(a, b)), opts: { ...opts, alfa: true } };
}

export function rollEncounter(mapId, corruption = 0, glitchOn = false, sorte = 1, brilhoForcado = null) {
  const map = DB.MAPS[mapId];
  const table = map?.encounters || [];
  if (!table.length) return null;

  // MISSINGNO. só existe com o modo glitch ligado (src/data/config.js)
  const on = glitchOn || DB.CONFIG?.glitchMode;
  const glitchChance = !on || corruption < 25 ? 0 : Math.min(0.35, (corruption - 25) / 200);
  // a cor do bicho: comum, shiny ou luminoso — ou o que um DLC já decidiu
  // (a SHINY ZONE manda a cor pronta, pra mexer no shiny sem inflar o luminoso)
  const brilho = brilhoForcado || sortearBrilho({ sorte });
  if (chance(glitchChance)) {
    const lvl = randRange(5, 12);
    return { mon: createMon("missingno", lvl, { corrupt: true, ...brilho }), glitch: true };
  }

  // A FUSÃO SELVAGEM: raríssima, com ENDEREÇO (`mapas`, em extra.js), e antes da
  // tabela porque ela não está na tabela de mapa nenhum. `garantirEspecie` monta a espécie na hora (o id
  // carrega a dupla e a variante), como o jogo já faz pra fusão que vem de save.
  const rara = DB.FUSAO_SELVAGEM;
  const noLugarDela = !rara?.mapas || rara.mapas.includes(mapId);
  if (rara && noLugarDela && chance(rara.chance ?? 0) && garantirEspecie(rara.id)) {
    return { mon: createMon(rara.id, randRange(rara.min, rara.max), brilho), glitch: true };
  }

  const total = table.reduce((s, e) => s + e.w, 0);
  let r = Math.random() * total;
  for (const e of table) {
    r -= e.w;
    if (r <= 0) {
      // `corrupt: true` na entrada da tabela: esse nasce corrompido sempre (é
      // o que os DLCs usam pra pôr bicho bugado num lugar específico)
      const corrupt = !!e.corrupt || (!!on && corruption > 40 && chance(Math.min(0.15, corruption / 800)));
      const { lvl, opts } = talvezAlfa(randRange(e.min, e.max), { corrupt, ...brilho });
      return { mon: createMon(e.id, lvl, opts), glitch: false };
    }
  }
  return null;
}
