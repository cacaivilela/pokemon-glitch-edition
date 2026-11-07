// O PÓS-PÓS-GAME: o estado (src/data/pos-pos.js tem a história e as falas).
//   flags.ppComecou — o KYOGRE e o GROUDON surtaram (Kanto seca, Braglitch alaga)
//   flags.ppAcabou  — a briga na ilha da ruína foi vencida: o mundo voltou
import { DB } from "../data/index.js";
import { ligados } from "./dlc.js";
import { regiaoDoMapa } from "./regionais.js";

/** Pode começar? Com o DLC EXTREMA ligado é depois do GIRATINA libertado;
 *  sem ele, depois do MISSINGNO pego ou do título de BRAGLITCH. */
export function podeComecar(st) {
  const f = st?.flags || {};
  if (f.ppComecou) return false;
  if (ligados().includes("extrema")) return !!f.gdeLivre;
  return !!(f.caughtMissingno || f.bragCampeao);
}

export const ativo = (st) => !!(st?.flags?.ppComecou && !st.flags.ppAcabou);

const aCeuAberto = (id) => {
  const m = DB.MAPS?.[id];
  return !!m && !m.interior && !m.submerso && m.music !== "cave" && !/^(glitch|era_|void|tempestade)/.test(id);
};

/** KANTO SECOU (o mar deste mapa virou lama) */
export const seco = (st, id) => ativo(st) && aCeuAberto(id) && regiaoDoMapa(id) === "kanto" && !DB.KANTO?.[id]?.braglitch;
/** BRAGLITCH ALAGOU (água rasa por cima do chão deste mapa) */
export const alagado = (st, id) => ativo(st) && aCeuAberto(id) && (regiaoDoMapa(id) === "braglitch" || !!DB.KANTO?.[id]?.braglitch);

/** A ILHA DA RUÍNA: o retângulo da ruína do fundo (o mesmo x,y na superfície)
 *  e o que é pilar. null quando a ruína não existe. */
export function ilhaDaRuina() {
  const P = DB.POS_POS;
  const fundo = DB.KANTO?.[`fundo_${P?.ilha?.mapa}`];
  const r = fundo?.segredos?.[P.ilha.ruina];
  if (!r) return null;
  return { ...r, pilar: (x, y) => fundo.decor?.[`${x},${y}`] === "pilar", decor: fundo.decor };
}
