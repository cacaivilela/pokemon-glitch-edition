// O DYNAMAX (pedido do CAIO, 07/nov/2026): o Pokémon fica GIGANTE e vermelho
// por 3 turnos. Durante esses turnos:
//  - o HP dobra (quem estava com metade continua com metade, só que do dobro);
//  - todo golpe vira GOLPE MAX: do mesmo tipo, mais forte, nunca erra, e com um
//    efeito que depende do tipo (sobe ou derruba um atributo);
//  - golpe de status vira MAX GUARDA (a defesa sobe).
// Quando acaba, o HP volta pro tamanho normal (na mesma proporção).
//
// ONDE PODE: só nas lutas grandes (GINÁSIO e LIGA) e nas RAIDS, e só com a
// PULSEIRA DYNAMAX (item "pulseira dynamax"). Uma vez por batalha, de cada lado.
// O líder dynamaxa o ÚLTIMO Pokémon dele.
// A tecla é a V (no menu de golpes), igual a C arma a MEGA e a Q arma o Z.
import { DB } from "../data/index.js";
import { GIGANTAMAX } from "../data/gigantamax.js";

export const DYNAMAX = {
  turnos: 3,
  hpVezes: 2,
  escala: 1.5,
  item: "pulseira dynamax",
};

// o efeito de cada tipo: que atributo, de quem, quanto (mais simples que o
// original — clima e terreno ficam de fora — mas cada tipo tem o seu)
const EFEITO = {
  NORMAL:   ["MAX ATAQUE",    { target: "foe",  key: "spe", delta: -1 }],
  FOGO:     ["MAX CHAMA",     { target: "self", key: "spa", delta: 1 }],
  "ÁGUA":   ["MAX GÊISER",    { target: "self", key: "spd", delta: 1 }],
  "ELÉTRICO": ["MAX RAIO",    { target: "self", key: "spe", delta: 1 }],
  PLANTA:   ["MAX FLORESTA",  { target: "self", key: "def", delta: 1 }],
  GELO:     ["MAX GEADA",     { target: "foe",  key: "spe", delta: -1 }],
  LUTADOR:  ["MAX SOCO",      { target: "self", key: "atk", delta: 1 }],
  VENENO:   ["MAX ÁCIDO",     { target: "self", key: "spa", delta: 1 }],
  TERRA:    ["MAX TERREMOTO", { target: "self", key: "spd", delta: 1 }],
  VOADOR:   ["MAX VENTANIA",  { target: "self", key: "spe", delta: 1 }],
  "PSÍQUICO": ["MAX MENTE",   { target: "foe",  key: "spd", delta: -1 }],
  INSETO:   ["MAX INSETO",    { target: "foe",  key: "spa", delta: -1 }],
  PEDRA:    ["MAX ROCHA",     { target: "self", key: "def", delta: 1 }],
  FANTASMA: ["MAX FANTASMA",  { target: "foe",  key: "def", delta: -1 }],
  "DRAGÃO": ["MAX DRAGÃO",    { target: "foe",  key: "atk", delta: -1 }],
  SOMBRIO:  ["MAX TREVAS",    { target: "foe",  key: "spd", delta: -1 }],
  "AÇO":    ["MAX AÇO",       { target: "self", key: "def", delta: 1 }],
  FADA:     ["MAX FADA",      { target: "foe",  key: "spa", delta: -1 }],
  GLITCH:   ["MAX GLITCH",    { target: "foe",  key: "def", delta: -1 }],
};

/** a força do golpe MAX pela força do golpe normal (a tabela do original) */
function forcaMax(p, tipo) {
  const fraco = tipo === "LUTADOR" || tipo === "VENENO";   // esses dois são mais fracos
  const t = p <= 40 ? [90, 70] : p <= 50 ? [100, 75] : p <= 60 ? [110, 80] : p <= 70 ? [120, 85]
    : p <= 100 ? [130, 90] : p <= 140 ? [140, 95] : [150, 100];
  return fraco ? t[1] : t[0];
}

/** A forma GIGANTAMAX de quem tomou a SOPA MAX (src/data/gigantamax.js), ou
 *  null. Cria a espécie `<espécie>gmax` em DB.SPECIES na primeira vez: a
 *  espécie inteira (atributos, tipos, golpes), só com o sprite oficial. */
export function formaGigantamax(mon) {
  const g = mon?.gmax && GIGANTAMAX[mon.species];
  const sp = g && DB.SPECIES[mon.species];
  if (!sp) return null;
  const id = `${mon.species}gmax`;
  if (!DB.SPECIES[id]) DB.SPECIES[id] = { ...sp, id, name: `${sp.name} GIGANTAMAX`, spriteDex: g.sprite,
    spriteUrl: undefined, animacao: undefined, gmaxDe: mon.species };
  return id;
}

/** O id do golpe MAX daquele golpe (cria em DB.MOVES na primeira vez). Se
 *  quem usa está GIGANTAMAX e o golpe é do tipo dele, vira o GOLPE G-MAX. */
export function golpeMax(id, mon) {
  const mv = DB.MOVES[id];
  if (!mv) return id;
  const g = mon?.gmaxDe && GIGANTAMAX[mon.gmaxDe];
  if (g && mv.category !== "status" && mv.power && mv.type === g.tipo) {
    const gid = `gmax_${mon.gmaxDe}_${mv.category}`;
    if (!DB.MOVES[gid]) DB.MOVES[gid] = { name: g.golpe, type: g.tipo, power: forcaMax(mv.power, mv.type),
      acc: 101, pp: 99, category: mv.category, ...(EFEITO[g.tipo]?.[1] ? { stat: EFEITO[g.tipo][1] } : {}), max: true, gmax: true };
    return gid;
  }
  if (mv.category === "status" || !mv.power) {
    if (!DB.MOVES.maxguarda) DB.MOVES.maxguarda = { name: "MAX GUARDA", type: "NORMAL", power: 0, acc: 101, pp: 99,
      category: "status", stat: { target: "self", key: "def", delta: 2 }, max: true };
    return "maxguarda";
  }
  const [nome, stat] = EFEITO[mv.type] || [`MAX ${mv.type}`, null];
  const power = forcaMax(mv.power, mv.type);
  const nid = `max_${mv.type}_${power}_${mv.category}`;
  if (!DB.MOVES[nid]) DB.MOVES[nid] = { name: nome, type: mv.type, power, acc: 101, pp: 99,
    category: mv.category, ...(stat ? { stat } : {}), max: true };
  return nid;
}

/** É luta grande (ginásio de qualquer região ou liga)? */
export function lutaGrande(trainer) {
  return !!(trainer && (trainer.badge || trainer.bragBadge || trainer.johtoBadge || trainer.ligaKanto
    || trainer.etapaLiga != null || trainer.etapaLigaBrag != null || trainer.etapaLigaVoid != null));
}

/** O jogador pode dynamaxar nesta batalha? (pulseira + luta grande ou raid) */
export function podeAqui(st, batalha) {
  if (!(st.items?.[DYNAMAX.item] > 0)) return false;
  return lutaGrande(batalha.trainer) || !!batalha.raid || !!batalha.dyTeste;
}

/** Liga: dobra o HP (na proporção) e marca os turnos. */
export function dynamaxar(mon) {
  if (mon.dynamax) return false;
  const prop = mon.hp / mon.maxHp;
  mon.dynamax = { turnos: DYNAMAX.turnos, maxHpAntes: mon.maxHp };
  mon.maxHp = Math.round(mon.maxHp * DYNAMAX.hpVezes);
  mon.hp = Math.max(1, Math.round(mon.maxHp * prop));
  // tomou a SOPA MAX e tem forma GIGANTAMAX: vira ela (mesmos atributos)
  const forma = formaGigantamax(mon);
  if (forma) { mon.gmaxDe = mon.species; mon.species = forma; }
  return true;
}

/** Desliga: o HP volta pro tamanho normal, na mesma proporção. */
export function desdynamaxar(mon) {
  if (!mon?.dynamax) return false;
  const prop = mon.hp / mon.maxHp;
  mon.maxHp = mon.dynamax.maxHpAntes;
  mon.hp = mon.hp <= 0 ? 0 : Math.max(1, Math.round(mon.maxHp * prop));
  delete mon.dynamax;
  if (mon.gmaxDe) { if (DB.SPECIES[mon.gmaxDe]) mon.species = mon.gmaxDe; delete mon.gmaxDe; }
  return true;
}
