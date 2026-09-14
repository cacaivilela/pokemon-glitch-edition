// Criacao de monstros, stats, XP e level up.
import { DB } from "../data/index.js";
import { randInt, clamp, chance } from "../core/rng.js";
import { lugarBate } from "./regionais.js";

export const xpForLevel = (lvl) => Math.floor(lvl ** 3);

function statValue(base, iv, lvl) { return Math.floor(((2 * base + iv) * lvl) / 100) + 5; }
function hpValue(base, iv, lvl) { return Math.floor(((2 * base + iv) * lvl) / 100) + lvl + 10; }

export function learnableMoves(speciesId, level) {
  const sp = DB.SPECIES[speciesId];
  return sp.learnset.filter(([l]) => l <= level).map(([, m]) => m);
}

export function createMon(speciesId, level, opts = {}) {
  const sp = DB.SPECIES[speciesId];
  const ivs = opts.ivs || {
    hp: randInt(32), atk: randInt(32), def: randInt(32),
    spa: randInt(32), spd: randInt(32), spe: randInt(32),
  };
  const moveIds = (opts.moves || learnableMoves(speciesId, level)).slice(-4);
  const mon = {
    species: speciesId,
    nickname: opts.nickname || sp.name,
    level,
    xp: xpForLevel(level),
    ivs,
    moves: moveIds.map((id) => ({ id, pp: DB.MOVES[id].pp, ppMax: DB.MOVES[id].pp })),
    status: null,
    corrupt: !!opts.corrupt,
    shiny: !!opts.shiny,
    luminoso: !!opts.luminoso,
    alfa: !!opts.alfa,               // maior, mais forte, sempre bravo (ver config.js)
    seed: opts.seed ?? randInt(9999),
    hp: 0,
  };
  recalc(mon);
  mon.hp = mon.maxHp;
  return mon;
}

/** A COR DO BICHO QUE ACABOU DE APARECER. São três, e só uma por Pokémon:
 *  comum, SHINY (1 em 1024) e LUMINOSO (1 em 9999).
 *
 *  O luminoso é sorteado PRIMEIRO e, se sair, apaga o shiny. Sorteando o shiny
 *  antes, a cor mais rara do jogo só apareceria em cima de um shiny — ela
 *  viraria um enfeite de outra raridade em vez de ser uma raridade. E os dois
 *  sorteios são independentes: a chance de um luminoso é 1 em 9999 sempre, não
 *  1 em 9999 dos que já não eram shiny.
 *
 *  `sorte` é o SANDUÍCHE AMARGO do acampamento, que multiplica as duas — quem
 *  caça cor caça as duas cores. `shiny` já vem decidido de fora quando quem
 *  chama tem regra própria (na fenda é 1 a cada N vistos, e não um sorteio). */
export function sortearBrilho({ sorte = 1, shiny = false } = {}) {
  if (chance((DB.CONFIG?.luminosoOdds ?? 0) * sorte)) return { luminoso: true, shiny: false };
  return { luminoso: false, shiny: shiny || chance((DB.CONFIG?.shinyOdds ?? 0) * sorte) };
}

export function recalc(mon) {
  const sp = DB.SPECIES[mon.species];
  const { base } = sp;
  if (sp.crescimento) {
    // Fusão criada na oficina: quem manda é a ficha do jogador — cada atributo
    // vale `inicial` e sobe `crescimento` por nível. Sem stats-base, sem IV: o
    // que está escrito na ficha é exatamente o que aparece na batalha.
    const F = DB.FUSAO;
    mon.maxHp = F.valor(sp, "hp", mon.level);
    mon.stats = {
      atk: F.valor(sp, "atk", mon.level),
      def: F.valor(sp, "def", mon.level),
      spa: F.valor(sp, "spa", mon.level),
      spd: F.valor(sp, "spd", mon.level),
      spe: F.valor(sp, "spe", mon.level),
    };
    mon.types = sp.types;
    mon.name = sp.name;
    return mon;
  }
  // o ALFA é o mesmo bicho, só que mais: cada atributo vale `alfaForca` vezes
  const f = mon.alfa ? (DB.CONFIG?.alfaForca ?? 1.2) : 1;
  mon.maxHp = Math.floor(hpValue(base.hp, mon.ivs.hp, mon.level) * f);
  mon.stats = {
    atk: Math.floor(statValue(base.atk, mon.ivs.atk, mon.level) * f),
    def: Math.floor(statValue(base.def, mon.ivs.def, mon.level) * f),
    spa: Math.floor(statValue(base.spa, mon.ivs.spa, mon.level) * f),
    spd: Math.floor(statValue(base.spd, mon.ivs.spd, mon.level) * f),
    spe: Math.floor(statValue(base.spe, mon.ivs.spe, mon.level) * f),
  };
  mon.types = sp.types;
  mon.name = sp.name;
  return mon;
}

export const isFainted = (m) => m.hp <= 0;
export const hpPct = (m) => clamp(m.hp / m.maxHp, 0, 1);

export function heal(mon) {
  recalc(mon);
  mon.hp = mon.maxHp;
  mon.status = null;
  mon.moves.forEach((mv) => (mv.pp = mv.ppMax));
}

/** Retorna eventos: [{type:'level', level}, {type:'move', id}] */
export function gainXp(mon, amount) {
  const events = [];
  mon.xp += amount;
  while (mon.level < 100 && mon.xp >= xpForLevel(mon.level + 1)) {
    mon.level++;
    const before = mon.maxHp;
    recalc(mon);
    // quem está desmaiado continua desmaiado: subir de nível não é reviver
    if (mon.hp > 0) mon.hp += mon.maxHp - before;
    events.push({ type: "level", level: mon.level });
    const sp = DB.SPECIES[mon.species];
    for (const [lvl, id] of sp.learnset) {
      if (lvl === mon.level && !mon.moves.some((m) => m.id === id)) {
        if (mon.moves.length < 4) {
          mon.moves.push({ id, pp: DB.MOVES[id].pp, ppMax: DB.MOVES[id].pp });
          events.push({ type: "move", id });
        } else {
          events.push({ type: "moveFull", id });
        }
      }
    }
  }
  return events;
}

export function xpYieldFor(foe) {
  const sp = DB.SPECIES[foe.species];
  const alfa = foe.alfa ? (DB.CONFIG?.alfaXp ?? 1.6) : 1;
  return Math.floor((sp.xpYield * foe.level * alfa) / 7) + 1;
}

/** Núcleo da evolução: troca a espécie e ajusta stats, apelido e golpes.
 *  Devolve { from, to } com os nomes, ou null se a espécie nova não existe. */
export function evolveTo(mon, toId) {
  if (!toId || !DB.SPECIES[toId]) return null;
  const from = DB.SPECIES[mon.species];
  const named = mon.nickname === from.name;    // apelido próprio não se perde
  const beforeMax = mon.maxHp;
  mon.species = toId;
  recalc(mon);
  mon.hp = Math.min(mon.maxHp, mon.hp + (mon.maxHp - beforeMax));
  if (named) mon.nickname = DB.SPECIES[toId].name;
  // golpes que a espécie nova já deveria saber, se ainda tem espaço na lista
  for (const id of learnableMoves(toId, mon.level).slice(-4)) {
    if (mon.moves.length >= 4 || mon.moves.some((m) => m.id === id)) continue;
    mon.moves.push({ id, pp: DB.MOVES[id].pp, ppMax: DB.MOVES[id].pp });
  }
  return { from: from.name, to: DB.SPECIES[toId].name };
}

/** Espécie pra onde ele evolui no nível atual, ou null. */
/** Pra que forma este bicho passa agora? `mapa` importa: tem linha que se
 *  parte em duas, e o que escolhe o lado é o lugar (um CUBONE vira MAROWAK em
 *  Kanto e MAROWAK-ALOLA do lado de lá — ver src/systems/regionais.js). */
export function evolutionFor(mon, mapa = null) {
  for (const r of DB.EVOLUTIONS?.[mon.species] || []) {
    if (!r.lvl || mon.level < r.lvl || !DB.SPECIES[r.to]) continue;
    if (lugarBate(r, mapa)) return r.to;
  }
  return null;
}
