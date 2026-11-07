// AS METAS (pedido do CAIO, nov/2026: "faz dar pra definir metas ou usar só um
// tipo, metas que o jogador define"). Menu START → METAS (src/scenes/metas.js):
// o próprio jogador escolhe o desafio. Só contam daqui pra frente.
//   tipo:     lutar SÓ com um tipo. Entrou outro na luta, a meta QUEBRA
//   derrotar: derrotar N Pokémon, de qualquer espécie ou só de uma (esp)
//   pegar:    pegar N Pokémon
//   nivel:    ter alguém na equipe no nível N
// Grava em st.metas: { k, alvo?, tipo?, esp?, n, fim? }, com fim = "feita" | "quebrada".
import { DB } from "../data/index.js";

export const KINDS = [
  { k: "tipo", nome: "USAR SÓ UM TIPO" },
  { k: "derrotar", nome: "DERROTAR POKÉMON", alvo: 50, min: 1, max: 999 },
  { k: "pegar", nome: "PEGAR POKÉMON", alvo: 10, min: 1, max: 999 },
  { k: "nivel", nome: "CHEGAR NO NÍVEL", alvo: 50, min: 2, max: 100 },
];

export const metas = (st) => (st.metas ||= []);

/** os recados pro mapa: a batalha não pode parar pra avisar, o mapa avisa depois */
const recados = [];

export function criarMeta(st, meta) {
  metas(st).push({ ...meta, n: 0 });
}

export const apagarMeta = (st, i) => void metas(st).splice(i, 1);

export function textoDaMeta(m) {
  if (m.k === "tipo") return `SÓ ${m.tipo}: ${m.n} ${m.n === 1 ? "DERROTADO" : "DERROTADOS"}`;
  if (m.esp) return `DERROTAR ${(DB.SPECIES[m.esp]?.name || m.esp).slice(0, 12)}: ${Math.min(m.n, m.alvo)}/${m.alvo}`;
  const nome = { derrotar: "DERROTAR", pegar: "PEGAR", nivel: "NÍVEL" }[m.k];
  return `${nome} ${m.alvo}: ${Math.min(m.n, m.alvo)}/${m.alvo}`;
}

function somar(m) {
  m.n++;
  if (m.alvo && m.n >= m.alvo) cumprir(m);
}

function cumprir(m) {
  m.fim = "feita";
  recados.push(`META CUMPRIDA: ${textoDaMeta(m)}!`);
}

const ativas = (st, k) => metas(st).filter((m) => m.k === k && !m.fim);

/** alguém entrou na luta */
export function metaUsou(st, mon) {
  if (!mon) return;
  const tipos = mon.types || DB.SPECIES[mon.species]?.types || [];
  for (const m of ativas(st, "tipo")) {
    if (tipos.includes(m.tipo)) continue;
    m.fim = "quebrada";
    recados.push(`META QUEBRADA: ${mon.nickname} NÃO É ${m.tipo}!`);
  }
}

export function metaDerrotou(st, mon) {
  for (const m of ativas(st, "tipo")) somar(m);
  for (const m of ativas(st, "derrotar")) if (!m.esp || m.esp === mon?.species) somar(m);
}

export function metaPegou(st) {
  for (const m of ativas(st, "pegar")) somar(m);
}

/** o mapa chama sempre: confere o nível e devolve o próximo recado (ou null) */
export function recadoDasMetas(st) {
  if (st.metas?.length) {
    const maior = Math.max(0, ...st.party.map((p) => p.level || 0));
    for (const m of ativas(st, "nivel")) {
      m.n = Math.max(m.n, maior);
      if (m.n >= m.alvo) cumprir(m);
    }
  }
  return recados.shift() || null;
}
