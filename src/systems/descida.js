// Quem consegue te levar cume abaixo. A regra está em src/data/descida.js.
import { DB } from "../data/index.js";
import { partes } from "./fusao.js";

/** Esta espécie desce? Tipo PEDRA/AÇO, ou nome na lista de parkour.
 *  FUSÃO E MEGA HERDAM — basta uma das metades servir. */
export function especieDesce(id, fundo = 0) {
  if (!id || fundo > 3) return false;
  const D = DB.DESCIDA;
  if (!D) return false;
  if ((D.parkour || []).includes(id)) return true;
  const sp = DB.SPECIES?.[id];
  if (sp?.types?.some((t) => (D.tipos || []).includes(t))) return true;
  const p = partes(id);
  if (p) return especieDesce(p.cabeca, fundo + 1) || especieDesce(p.corpo, fundo + 1);
  if (sp?.megaDe) return especieDesce(sp.megaDe, fundo + 1);
  return false;
}

/** O primeiro da equipe que consegue, e que está de pé. Desmaiado não carrega
 *  ninguém por uma parede. */
export const quemDesce = (st) =>
  (st?.party || []).find((m) => m.hp > 0 && especieDesce(m.species)) || null;

/** Você está no topo, virado pro alto? É daí que se desce. */
export function noTopo(st) {
  const D = DB.DESCIDA;
  if (!D || st?.player?.map !== D.mapa) return false;
  return st.player.x === D.de.x && st.player.y === D.de.y && st.player.dir === "up";
}
