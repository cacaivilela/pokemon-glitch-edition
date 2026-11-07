// O SUBTERRÂNEO DE KANTO — as regras (os dados estão em src/data/subterraneo.js).
import { DB } from "../data/index.js";
import { regiaoDoMapa } from "./regionais.js";

const S = () => DB.SUBTERRANEO || {};

/** em que sala se desce, a partir deste mapa de Kanto (a cidade, a ponta da
 *  rota, ou SAFFRON — o meio de tudo — pra quem estiver noutro canto) */
export function salaPraDescer(mapa) {
  const salas = S().SALAS || {};
  const id = salas[mapa] ? mapa : S().DESCE_EM?.[mapa] || "saffron_city";
  return { id, ...salas[id] };
}

/** o dia de hoje (um número): os brilhos mudam de lugar todo dia */
export const diaDeHoje = (quando = new Date()) => Math.floor((quando.getTime() - quando.getTimezoneOffset() * 60000) / 86400000);

/** OS BRILHOS DE HOJE: paredes (#) com chão embaixo, sorteadas pelo dia —
 *  sempre os mesmos no mesmo dia. Devolve [{ x, y }]. */
export function brilhosDoDia(geo, dia = diaDeHoje()) {
  const planta = geo?.planta || [];
  const cand = [];
  for (let y = 1; y < planta.length - 1; y++) {
    for (let x = 1; x < planta[y].length - 1; x++) {
      if (planta[y][x] === "#" && ".,".includes(planta[y + 1][x])) cand.push({ x, y });
    }
  }
  let r = (dia * 2654435761) >>> 0;
  const rnd = () => { r = (r * 1103515245 + 12345) >>> 0; return r / 4294967296; };
  const out = [];
  const n = Math.min(cand.length, S().BRILHOS_POR_DIA || 40);
  while (out.length < n && cand.length) out.push(cand.splice(Math.floor(rnd() * cand.length), 1)[0]);
  return out;
}

/** já cavou esse brilho hoje? (st.subterraneo.cavados = { dia, lista: ["x,y"] }) */
export function jaCavado(st, x, y, dia = diaDeHoje()) {
  const c = st.subterraneo?.cavados;
  return !!(c && c.dia === dia && c.lista.includes(`${x},${y}`));
}
export function marcarCavado(st, x, y, dia = diaDeHoje()) {
  st.subterraneo ||= {};
  if (st.subterraneo.cavados?.dia !== dia) st.subterraneo.cavados = { dia, lista: [] };
  st.subterraneo.cavados.lista.push(`${x},${y}`);
}

/** o item da estátua daquele Pokémon */
export const itemDaEstatua = (especie) => `estátua de ${especie}`;

/** AS ESTÁTUAS NA BASE (ideia do CAIO): a estátua de uma espécie posta na base
 *  secreta da região deste mapa faz ela nascer shiny 5x mais ali. Devolve o
 *  multiplicador (1 = nenhuma estátua dela). */
export function fatorEstatua(especie, mapa, st = globalThis.game?.state) {
  if (!st || !especie || !mapa) return 1;
  const regiao = regiaoDoMapa(mapa) || "kanto";
  const base = st.bases?.[regiao];
  if (!base?.moveis?.length) return 1;
  const tem = base.moveis.some((m) => DB.MOVEIS?.[m.item]?.estatua === especie);
  return tem ? S().FATOR_ESTATUA || 5 : 1;
}
