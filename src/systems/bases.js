// AS BASES SECRETAS — as regras (os dados estão em src/data/bases.js).
//
// st.bases = { kanto: BASE, braglitch: BASE, kalos: BASE }, e cada BASE é
//   { mapa, x, y,                    a porta: o bloco (árvore/pedra/parede) — ou,
//                                     com `tipo: "chao"`, o buraco no chão (pisou, entrou)
//     moveis: [{ item, x, y }],       o que está posto, no quarto
//     mons: [{ species, seed, shiny }] os Pokémon soltos (cópias pra enfeite:
//                                     o de verdade continua na equipe/PC) }
import { DB } from "../data/index.js";
import { regiaoDoMapa } from "./regionais.js";

export const ehMovel = (item) => !!DB.MOVEIS?.[item];
/** o tamanho de um móvel em blocos (pôster e boneco são 1x1, menos o SNORLAX) */
export function tamanho(item) {
  const m = DB.MOVEIS?.[item];
  return { w: m?.w || 1, h: m?.h || 1 };
}
export const regiaoDe = (mapa) => regiaoDoMapa(mapa) || "kanto";

/** a base cuja porta é esse bloco desse mapa (a sua), ou null */
export function baseNaPorta(st, mapa, x, y) {
  return Object.values(st?.bases || {}).find((b) => b && b.mapa === mapa && b.x === x && b.y === y) || null;
}

/** ABRIR (ou MUDAR) a base da região do mapa: a porta vai pro bloco (x, y) */
export function abrirBase(st, mapa, x, y, tipo = "parede") {
  const regiao = regiaoDe(mapa);
  st.bases ||= {};
  const velha = st.bases[regiao];
  st.bases[regiao] = { mapa, x, y, tipo, moveis: velha?.moveis || [], mons: velha?.mons || [] };
  return st.bases[regiao];
}

/** os blocos ocupados por um móvel posto */
function blocos(m) {
  const { w, h } = tamanho(m.item), out = [];
  for (let dy = 0; dy < h; dy++) for (let dx = 0; dx < w; dx++) out.push([m.x + dx, m.y + dy]);
  return out;
}

/** quem está nesse bloco do quarto (o de cima primeiro: o que não é tapete) */
export function movelEm(base, x, y) {
  const aqui = (base?.moveis || []).filter((m) => blocos(m).some(([a, b]) => a === x && b === y));
  return aqui.find((m) => !["tapete", "robo"].includes(DB.MOVEIS[m.item]?.tipo)) || aqui.find((m) => DB.MOVEIS[m.item]?.tipo === "robo") || aqui[0] || null;
}

/** dá pra pisar nesse bloco do quarto? (parede, PC e móvel que não é tapete seguram) */
export function livreParaAndar(base, x, y) {
  const Q = DB.QUARTO;
  if (x < 0 || y < Q.parede || x >= Q.w || y >= Q.h) return false;
  if (y === Q.h - 1 && x !== Q.porta.x) return false;          // a última linha é parede, menos a porta
  if (x === Q.pc.x && y === Q.pc.y) return false;
  const m = movelEm(base, x, y);
  const tipo = m && DB.MOVEIS[m.item]?.tipo;
  return !m || tipo === "tapete" || tipo === "robo";     // o ROBÔ pula por cima de tudo
}

/** DÁ PRA PÔR o móvel com o canto em (x, y)? Devolve null (pode) ou o motivo. */
export function podePor(base, item, x, y) {
  const Q = DB.QUARTO, T = DB.BASES_TEXTO, mv = DB.MOVEIS[item];
  if (!mv) return T.naoCabe;
  const { w, h } = tamanho(item);
  const parede = mv.tipo === "poster";
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      const a = x + dx, b = y + dy;
      if (a < 0 || a >= Q.w) return T.naoCabe;
      if (parede) { if (b !== Q.parede - 1) return T.soParede; }
      else {
        if (b < Q.parede || b >= Q.h - 1) return T.soChao;
        if (a === Q.pc.x && b === Q.pc.y) return T.naoCabe;
        // o caminho da porta fica livre (a não ser tapete)
        if (mv.tipo !== "tapete" && a === Q.porta.x && b >= Q.h - 2) return T.naoCabe;
      }
      // tapete só divide lugar com o que não é tapete; o resto, com tapete
      const ja = (base.moveis || []).filter((m) => blocos(m).some(([c, d]) => c === a && d === b));
      for (const m of ja) {
        const outro = DB.MOVEIS[m.item]?.tipo;
        if ((mv.tipo === "tapete") === (outro === "tapete")) return T.naoCabe;
      }
    }
  }
  return null;
}

/** PÔR: sai da mochila, entra no quarto */
export function porMovel(st, base, item, x, y) {
  if (!(st.items[item] > 0) || podePor(base, item, x, y)) return false;
  st.items[item] -= 1;
  if (st.items[item] <= 0) delete st.items[item];
  (base.moveis ||= []).push({ item, x, y });
  return true;
}

/** TIRAR: volta pra mochila */
export function tirarMovel(st, base, m) {
  const i = (base.moveis || []).indexOf(m);
  if (i < 0) return false;
  base.moveis.splice(i, 1);
  st.items[m.item] = (st.items[m.item] || 0) + 1;
  return true;
}

/** os móveis que você tem na mochila */
export const moveisNaMochila = (st) => Object.keys(st?.items || {}).filter((it) => ehMovel(it) && st.items[it] > 0);

/** a base como vai pro online (pra quem visita): só o que precisa pra desenhar */
export function pacoteDaBase(base, regiao) {
  return { regiao, moveis: (base.moveis || []).map((m) => ({ item: m.item, x: m.x, y: m.y, ...(m.caminho ? { caminho: m.caminho } : {}) })),
           mons: (base.mons || []).slice(0, 6).map((m) => ({ species: m.species, seed: m.seed, shiny: !!m.shiny })) };
}
