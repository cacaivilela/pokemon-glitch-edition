// AS MISSÕES DA POKÉDEX (pedido do CAIO, nov/2026: "faz ter umas missoes pra
// completar a pkdex de cada pkmn"). Como as tarefas de pesquisa do LEGENDS
// ARCEUS: cada espécie tem a lista dela (pegar, derrotar, ver usar golpes,
// evoluir, chocar, pegar alfa, pegar de noite, vencer com golpe super efetivo).
// Fez todas: a ficha fica COMPLETA (com estrela) e aquela espécie aparece
// SHINY 3x mais.
//
// As listas são montadas sozinhas pelos dados de cada bicho (são 1400 e
// tantos); o que se grava é só o contador: st.pesquisa[espécie][tarefa] = n.
import { DB } from "../data/index.js";
import { LENDARIOS } from "../data/leilao.js";
import { agora } from "./ciclo.js";
import { metaDerrotou, metaPegou } from "./metas.js";

/** quem é EVOLUÇÃO de alguém (esses não saem de ovo: o ovo dá o primeiro) */
let alvosCache = null, alvosDb = null;
function evoluidos() {
  if (alvosDb === DB.EVOLUTIONS && alvosCache) return alvosCache;
  alvosCache = new Set(Object.values(DB.EVOLUTIONS || {}).flat().map((r) => r.to));
  alvosDb = DB.EVOLUTIONS;
  return alvosCache;
}

/** os golpes que ele usa de verdade (de dano), do learnset, sem repetir */
function golpesDe(sp) {
  const vistos = new Set();
  return (sp.learnset || []).map(([, m]) => m).filter((m) => {
    const mv = DB.MOVES[m];
    if (!mv || vistos.has(m) || !(mv.power > 0)) return false;
    vistos.add(m); return true;
  });
}

const cache = new Map();
/** A LISTA DE MISSÕES de uma espécie: [{ k, texto, alvo }] */
export function tarefas(id) {
  const sp = DB.SPECIES[id];
  if (!sp) return [];
  const c = cache.get(id);
  if (c?.db === DB.SPECIES) return c.lista;
  const lenda = LENDARIOS.has(id) || !!sp.lendario;
  const nome = sp.name;
  const L = [];
  L.push({ k: "pegar", texto: `PEGUE ${nome}`, alvo: lenda ? 1 : 5 });
  L.push({ k: "derrotar", texto: `DERROTE ${nome}`, alvo: lenda ? 1 : 10 });
  const gs = golpesDe(sp);
  // um golpe do começo e um do fim (o lendário: só o do fim)
  const escolhidos = lenda ? gs.slice(-1) : [...new Set([gs[0], gs[gs.length - 1]])].filter(Boolean);
  for (const g of escolhidos) L.push({ k: "golpe:" + g, texto: `VEJA ELE USAR ${DB.MOVES[g].name}`, alvo: 3 });
  if ((DB.EVOLUTIONS?.[id] || []).some((r) => DB.SPECIES[r.to])) L.push({ k: "evoluir", texto: `EVOLUA ${nome}`, alvo: 1 });
  if (!lenda && id !== "ditto" && !evoluidos().has(id) && sp.dex >= 1) L.push({ k: "chocar", texto: `CHOQUE UM OVO DE ${nome}`, alvo: 1 });
  L.push({ k: "fraqueza", texto: "VENÇA COM GOLPE SUPER EFETIVO", alvo: lenda ? 1 : 3 });
  if (!lenda) {
    L.push({ k: "noite", texto: "PEGUE UM DE NOITE", alvo: 1 });
    L.push({ k: "alfa", texto: "PEGUE UM ALFA", alvo: 1 });
  }
  cache.set(id, { db: DB.SPECIES, lista: L });
  return L;
}

/** quanto já fez de cada uma: [{ ...tarefa, n, feito }] */
export function progresso(st, id) {
  const p = st?.pesquisa?.[id] || {};
  return tarefas(id).map((t) => ({ ...t, n: Math.min(t.alvo, p[t.k] || 0), feito: (p[t.k] || 0) >= t.alvo }));
}

/** fez TODAS as missões dessa espécie? */
export function completa(st, id) {
  const l = tarefas(id);
  if (!l.length) return false;
  const p = st?.pesquisa?.[id] || {};
  return l.every((t) => (p[t.k] || 0) >= t.alvo);
}

/** conta uma vez a tarefa `k` de `id` (só se ela existe pra ele) */
export function contar(st, id, k, n = 1) {
  if (!st || !id || !tarefas(id).some((t) => t.k === k)) return;
  const p = ((st.pesquisa ||= {})[id] ||= {});
  p[k] = (p[k] || 0) + n;
}

/** PEGOU: conta pegar, e de noite / alfa se for */
export function contarCaptura(st, mon) {
  if (!mon) return;
  metaPegou(st);
  contar(st, mon.species, "pegar");
  if (mon.alfa) contar(st, mon.species, "alfa");
  try { if (agora().noite) contar(st, mon.species, "noite"); } catch { /* sem relógio */ }
}

/** VENCEU: conta derrotar, e super efetivo se o último golpe foi */
export function contarVitoria(st, mon, eff) {
  if (!mon) return;
  metaDerrotou(st, mon);
  contar(st, mon.species, "derrotar");
  if (eff > 1) contar(st, mon.species, "fraqueza");
}

/** O SHINY DA PESQUISA: espécie completa = mais 2 sorteios (3x no total) */
export const extraShiny = (st, id) => (completa(st, id) ? 2 : 0);
