// OS POKÉTRABALHOS — a parte viva (as tabelas em src/data/trabalhos.js; a tela
// em src/scenes/trabalhos.js). O relógio é o de verdade (Date.now()): o
// Pokémon trabalha com o jogo fechado também.
import { TRABALHOS as T } from "../data/trabalhos.js";
import { gainXp } from "./mon.js";
import { guardar, todosGuardados, cheio as boxCheio } from "./box.js";

const DIA = 86400000;
export const agora = () => Date.now();

/** os trabalhos DE HOJE: os mesmos o dia inteiro, outros amanhã */
export function trabalhosDoDia(t = agora()) {
  let s = Math.floor(t / DIA) * 2654435761 % 4294967296;
  const rnd = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
  const lista = T.lista.slice();
  for (let i = lista.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [lista[i], lista[j]] = [lista[j], lista[i]]; }
  return lista.slice(0, T.porDia);
}

export const emAndamento = (st) => (st.trabalhos ||= {});

/** os da tela: os de hoje e os de outro dia que ainda não voltaram */
export function trabalhosNaTela(st) {
  const hoje = trabalhosDoDia(), ids = new Set(hoje.map((j) => j.id));
  const antigos = Object.keys(emAndamento(st)).filter((id) => !ids.has(id)).map((id) => T.lista.find((j) => j.id === id)).filter(Boolean);
  return [...antigos, ...hoje];
}

/** quanto falta, em milissegundos (0 = pronto); null = livre */
export function falta(st, id, t = agora()) {
  const j = emAndamento(st)[id];
  if (!j) return null;
  return Math.max(0, j.inicio + j.min * 60000 - t);
}

export function textoTempo(ms) {
  const min = Math.ceil(ms / 60000);
  if (min >= 60) { const h = Math.floor(min / 60), m = min % 60; return m ? `${h}H ${m}MIN` : `${h} ${h === 1 ? "HORA" : "HORAS"}`; }
  return `${Math.max(1, min)} MIN`;
}

/** tira um Pokémon do BOX (fica no trabalho até voltar) */
function tirarDoBox(st, mon) {
  for (const b of st.boxes || []) {
    const i = (b.mons || []).indexOf(mon);
    if (i >= 0) { b.mons[i] = null; return true; }
  }
  const i = (st.box || []).indexOf(mon);
  if (i >= 0) { st.box.splice(i, 1); return true; }
  return false;
}

export const doBox = (st) => todosGuardados(st).filter((m) => !m.egg && !m.ovo);

/** manda até 3 do BOX pro trabalho `id` por `min` minutos */
export function mandar(st, id, mons, min, t = agora()) {
  const vao = mons.slice(0, T.maxMons).filter((m) => tirarDoBox(st, m));
  if (!vao.length) return null;
  emAndamento(st)[id] = { mons: vao, inicio: t, min };
  return vao;
}

const doTipo = (mon, job) => (mon.types || []).some((tp) => job.tipos.includes(tp));

/** BUSCAR: pronto, eles voltam (pro BOX; cheio, pra equipe) com experiência e
 *  itens. Devolve as falas do que aconteceu. `rnd` dá pra trocar no teste. */
export function buscar(st, id, rnd = Math.random) {
  const j = emAndamento(st)[id], job = T.lista.find((x) => x.id === id);
  if (!j || !job || falta(st, id) > 0) return null;
  const X = T.texto, falas = j.voltando ? [] : [job.fala];
  const itens = {};
  const ficam = [];
  for (const mon of j.mons) {
    // (quem ficou esperando vaga na última vez já ganhou: agora só volta)
    if (j.voltando) {
      if (!boxCheio(st) && guardar(st, mon)) continue;
      if (st.party.length < 6) { st.party.push(mon); continue; }
      falas.push(X.semLugar.replace("{MON}", mon.nickname)); ficam.push(mon); continue;
    }
    const xp = Math.round(j.min * T.xpPorMin * (1 + (mon.level || 1) / 25) * (doTipo(mon, job) ? T.bonusTipo : 1));
    falas.push(X.xp.replace("{MON}", mon.nickname).replace("{XP}", xp));
    for (const ev of gainXp(mon, xp)) if (ev.type === "level") falas.push(X.nivel.replace("{MON}", mon.nickname).replace("{N}", ev.level));
    const n = 1 + Math.floor(j.min / T.minPorItem);
    for (let k = 0; k < n; k++) { const it = job.itens[Math.floor(rnd() * job.itens.length)]; itens[it] = (itens[it] || 0) + 1; }
    if (j.min >= T.doceRaro.minimo && rnd() < T.doceRaro.chance) itens["doce raro"] = (itens["doce raro"] || 0) + 1;
    // de volta pra casa: BOX; cheio, a equipe; nem isso, espera no trabalho
    if (!boxCheio(st) && guardar(st, mon)) continue;
    if (st.party.length < 6) { st.party.push(mon); falas.push(X.boxCheio.replace("{MON}", mon.nickname)); continue; }
    falas.push(X.semLugar.replace("{MON}", mon.nickname));
    ficam.push(mon);
  }
  st.items ||= {};
  for (const [it, q] of Object.entries(itens)) { st.items[it] = (st.items[it] || 0) + q; falas.push(X.item.replace("{ITEM}", it.toUpperCase()).replace("{Q}", q)); }
  if (ficam.length) { j.mons = ficam; j.voltando = true; }
  else delete emAndamento(st)[id];
  return falas;
}
