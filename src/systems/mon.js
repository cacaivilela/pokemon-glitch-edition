// Criacao de monstros, stats, XP e level up.
import { DB } from "../data/index.js";
import { shinyDoEvento } from "./raid.js";
import { randInt, clamp, chance } from "../core/rng.js";
import { lugarBate } from "./regionais.js";
import { naoEvolui, fatorAmizade } from "./segurar.js";

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
    // SHINY LOCK (`sp.shinyLock`): a espécie nunca nasce shiny (os de WINDS AND WAVES)
    shiny: !!opts.shiny && !sp.shinyLock,
    luminoso: !!opts.luminoso && !sp.shinyLock,
    alfa: !!opts.alfa,               // maior, mais forte, sempre bravo (ver config.js)
    // O SEED É O VALOR DE PERSONALIDADE. Além de semear a arte (a variação da
    // fusão, o ruído do glitch) e de ser a chave do bicho na creche, é ele que
    // decide as MANCHAS DO SPINDA — e é por isso que vai até 2^32: é o tamanho
    // que dá os 4.294.967.296 padrões do bicho, como nos jogos de verdade.
    // Quem foi capturado antes disto tem seed pequeno e continua valendo; só
    // desenha um padrão com menos variação nas duas últimas manchas.
    seed: opts.seed ?? seedNovo(speciesId),
    hp: 0,
  };
  recalc(mon);
  mon.hp = mon.maxHp;
  darClarao(mon);
  return mon;
}

/** O CLARÃO ILUMINADO (golpe tipo LUZ, src/data/golpes-mais.js): todo LUMINOSO
 *  sabe. Com vaga, entra; com os 4 golpes cheios, entra no lugar do mais fraco.
 *  Quem já sabe fica como está. */
export function darClarao(mon) {
  const mv = DB.MOVES?.claraoiluminado;
  if (!mon?.luminoso || !mv || !Array.isArray(mon.moves)) return mon;
  if (mon.moves.some((m) => m?.id === "claraoiluminado")) return mon;
  const novo = { id: "claraoiluminado", pp: mv.pp, ppMax: mv.pp };
  if (mon.moves.length < 4) mon.moves.push(novo);
  else {
    let fraco = 0;
    mon.moves.forEach((m, i) => { if ((DB.MOVES[m?.id]?.power || 0) < (DB.MOVES[mon.moves[fraco]?.id]?.power || 0)) fraco = i; });
    mon.moves[fraco] = novo;
  }
  return mon;
}

/** os luminosos que já estavam no save (equipe, box, creche...) aprendem também */
export function darClaraoNoSave(obj, vistos = new Set()) {
  if (!obj || typeof obj !== "object" || vistos.has(obj)) return;
  vistos.add(obj);
  if (obj.luminoso && Array.isArray(obj.moves)) darClarao(obj);
  for (const v of Object.values(obj)) darClaraoNoSave(v, vistos);
}

/** O valor de personalidade de quem nasce agora. O SPINDA pode sair TODO
 *  BRANCO ou TODO VERMELHO (DB.CONFIG.spindaRaros): aí o seed é o número
 *  marcado daquele raro, e o desenho reconhece. */
function seedNovo(id) {
  if (id === "spinda") {
    for (const r of Object.values(DB.CONFIG?.spindaRaros || {})) if (chance(r.chance)) return r.seed;
  }
  return randInt(2 ** 32);
}

/** A COR DO BICHO QUE ACABOU DE APARECER. São três, e só uma por Pokémon:
 *  comum, SHINY (1 em 1024) e LUMINOSO (1 em 9999).
 *
 *  O luminoso é sorteado PRIMEIRO e, se sair, apaga o shiny. Sorteando o shiny
 *  antes, a cor mais rara do jogo só apareceria em cima de um shiny — ela
 *  viraria um enfeite de outra raridade em vez de ser uma raridade.
 *
 *  `sorte` é o SANDUÍCHE AMARGO do acampamento, que multiplica as duas — quem
 *  caça cor caça as duas cores. `shiny` já vem decidido de fora quando quem
 *  chama tem regra própria (na fenda é 1 a cada N vistos, e não um sorteio).
 *  As duas cores ficam travadas até a missão das cores (shiniesLiberados). */
export function sortearBrilho({ sorte = 1, shiny = false } = {}) {
  // a SEMANA DO SHINY (src/data/eventos.js): 1 em 10, e solta as cores travadas
  const semana = shinyDoEvento();
  if (!semana && !shiniesLiberados()) return { shiny: false, luminoso: false };
  if (chance((DB.CONFIG?.luminosoOdds ?? 0) * sorte)) return { luminoso: true, shiny: false };
  const odds = semana ? Math.max(semana.shinyOdds, DB.CONFIG?.shinyOdds ?? 0) : (DB.CONFIG?.shinyOdds ?? 0);
  return { luminoso: false, shiny: shiny || chance(Math.min(1, odds * sorte)) };
}

/** AS CORES TRAVADAS (ideia do CAIO): nenhum bicho nasce shiny — na grama, na
 *  fenda, no ovo, na troca — até a missão DB.CONFIG.shinyMissao ser entregue
 *  (a CAÇADORA DE CORES de Viridian, src/data/missoes.js). Shiny que já está
 *  no save fica; o que é PRÊMIO (o PIKACHU da própria missão, presentes) não
 *  passa por aqui. Sem save carregado (testes no node) fica liberado. */
export function shiniesLiberados(st = globalThis.game?.state) {
  const id = DB.CONFIG?.shinyMissao;
  return !id || !st || st.missoes?.[id]?.estado === "feita";
}

export function recalc(mon) {
  const sp = DB.SPECIES[mon.species];
  if (sp?.shinyLock && (mon.shiny || mon.luminoso)) mon.shiny = mon.luminoso = false;   // SHINY LOCK: nem por troca, ovo ou fusão
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
  // o GARFO (comeu pokébloco pesado e foi pego, src/data/pokeblocos.js): a
  // defesa ganha 1 a mais a cada poucos níveis — ela sobe mais rápido
  const garfo = mon.garfo ? Math.floor(mon.level / (DB.POKEBLOCOS?.BATALHA?.defesaPorNivel || 3)) : 0;
  mon.stats = {
    atk: Math.floor(statValue(base.atk, mon.ivs.atk, mon.level) * f),
    def: Math.floor(statValue(base.def, mon.ivs.def, mon.level) * f) + garfo,
    spa: Math.floor(statValue(base.spa, mon.ivs.spa, mon.level) * f),
    spd: Math.floor(statValue(base.spd, mon.ivs.spd, mon.level) * f),
    spe: Math.floor(statValue(base.spe, mon.ivs.spe, mon.level) * f),
  };
  // O TRUNFO: o que ele ganhou a mais subindo de nível (ver `gainXp`) é dele
  // pra sempre — soma por cima da conta, mesmo depois de evoluir
  const t = mon.trunfoExtra;
  if (t) {
    mon.maxHp += t.hp || 0;
    for (const k of ["atk", "def", "spa", "spd", "spe"]) mon.stats[k] += t[k] || 0;
  }
  mon.types = sp.types;
  mon.name = sp.name;
  return mon;
}

/** A vida máxima que ele teria em outro nível (sem mexer nele). */
export function maxHpNoNivel(mon, lvl) {
  const outro = { ...mon, level: lvl };
  recalc(outro);
  return outro.maxHp;
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
/** O POKÉMON TRUNFO (um só, escolhido na EQUIPE — `mon.trunfo`): ganha o dobro
 *  de XP, o dobro do que cada atributo sobe a cada nível (guardado em
 *  `trunfoExtra`, somado pelo `recalc`), o dobro de amizade ao subir de nível,
 *  e — na batalha — o dobro quando um golpe sobe os atributos dele.
 *  `semTrunfo`: XP que não dobra (o DOCE RARO, que é "um nível", não XP). */
export function gainXp(mon, amount, { semTrunfo = false } = {}) {
  const events = [];
  const trunfo = !!mon.trunfo && !semTrunfo;
  mon.xp += trunfo ? amount * 2 : amount;
  // `nivelEmprestado`: níveis que um espetinho deu só enquanto ele está na
  // GLITCH DIMENSION EXTREMA (dlc/extrema.js). A XP se junta, mas o nível de
  // verdade só sobe quando ele sai e devolve o emprestado
  while (!mon.nivelEmprestado && mon.level < 100 && mon.xp >= xpForLevel(mon.level + 1)) {
    mon.level++;
    const before = mon.maxHp;
    const antes = { hp: mon.maxHp, ...mon.stats };
    recalc(mon);
    if (mon.trunfo) {                            // o que subiu, sobe de novo
      mon.trunfoExtra ||= {};
      const ganho = { hp: mon.maxHp - antes.hp };
      for (const k of ["atk", "def", "spa", "spd", "spe"]) ganho[k] = mon.stats[k] - antes[k];
      for (const [k, v] of Object.entries(ganho)) mon.trunfoExtra[k] = (mon.trunfoExtra[k] || 0) + Math.max(0, v);
      recalc(mon);
    }
    // quem está desmaiado continua desmaiado: subir de nível não é reviver
    if (mon.hp > 0) mon.hp += mon.maxHp - before;
    events.push({ type: "level", level: mon.level });
    amizade(mon, mon.trunfo ? 6 : 3);   // subir de nível aproxima
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
  // o GARFO dos pokéblocos fica depois do nome, evoluindo ou não
  const marca = mon.garfo ? (DB.POKEBLOCOS?.BATALHA?.marca || "") : "";
  const semMarca = marca && mon.nickname.endsWith(marca) ? mon.nickname.slice(0, -marca.length) : mon.nickname;
  const named = semMarca === from.name;        // apelido próprio não se perde
  const beforeMax = mon.maxHp;
  mon.species = toId;
  // FUSÃO que evoluiu: os dois guardados lá dentro evoluem junto (pra separar
  // depois e sair cada um na forma nova) — "fus-cabeca-corpo[-pernas][~ficha]"
  if (mon.fusao && toId.startsWith("fus-")) {
    const [cab, cor, per] = toId.split("~")[0].split("-").slice(1);
    for (const [k, id] of [["cabeca", cab], ["corpo", cor], ["pernas", per]]) {
      const m = mon.fusao[k];
      if (m && id && DB.SPECIES[id] && m.species !== id) {
        const nomeDele = m.nickname === DB.SPECIES[m.species]?.name;
        m.species = id; m.level = Math.max(m.level || 1, mon.level);
        if (nomeDele) m.nickname = DB.SPECIES[id].name;
      }
    }
  }
  recalc(mon);
  mon.hp = Math.min(mon.maxHp, mon.hp + (mon.maxHp - beforeMax));
  if (named) mon.nickname = DB.SPECIES[toId].name + marca;
  // GOLPE DA FORMA (`trocaGolpe`): no ZYGARDE 200% a LUZ NULA vira a EXPLOSÃO
  // DA VIDA OU MORTE, e saindo dele ela volta
  const troca = (de, para) => {
    for (const m of mon.moves) {
      if (m.id !== de || !DB.MOVES[para]) continue;
      m.id = para;
      m.ppMax = DB.MOVES[para].pp;
      m.pp = Math.min(m.pp, m.ppMax);
    }
  };
  for (const [a, b] of Object.entries(from.trocaGolpe || {})) troca(b, a);
  for (const [a, b] of Object.entries(DB.SPECIES[toId].trocaGolpe || {})) troca(a, b);
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
  // a PEDRA ETERNA segurada: não evolui por nível nem por amizade
  if (naoEvolui(mon)) return null;
  for (const r of DB.EVOLUTIONS?.[mon.species] || []) {
    if (!DB.SPECIES[r.to]) continue;
    // SECRETA (src/data/secretas.js): uma marca que ficou no bicho, em qualquer nível
    if (r.secreta) { if (!mon[r.secreta] || (r.comeu && mon.comeu !== r.comeu)) continue; }
    // por AMIZADE (os bebês): gostar de você o bastante, em qualquer nível
    else if (r.amizade) { if ((mon.amizade || 0) < r.amizade) continue; }
    // (o nível emprestado pelo espetinho da fenda extrema não conta)
    else if (!r.lvl || mon.level - (mon.nivelEmprestado || 0) < r.lvl) continue;
    if (lugarBate(r, mapa)) return r.to;
  }
  return null;
}

/** AMIZADE: sobe andando com você, vencendo e subindo de nível (as contas
 *  estão em src/systems/creche.js, que é quem mais se importa com isso).
 *  Fica em 0..255, e quem nunca ganhou nada está em 0.
 *
 *  ACIMA DO MÁXIMO (o FENÔMENO DE VÍNCULO, src/data/vinculo.js): só as
 *  técnicas do vínculo passam de 255 (`passa`). O resto para no 255, mas não
 *  puxa pra baixo quem já está acima. */
export function amizade(mon, quanto, passa = false) {
  if (!mon) return 0;
  const atual = mon.amizade || 0;
  const teto = passa ? (DB.VINCULO?.teto ?? 255) : 255;
  // o SINO CALMANTE segurado: o que sobe, sobe dobrado
  if (quanto > 0) quanto *= fatorAmizade(mon);
  mon.amizade = quanto > 0 ? Math.max(atual, Math.min(teto, atual + quanto)) : Math.max(0, atual + quanto);
  return mon.amizade;
}
