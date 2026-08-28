// Quem espanta os motoqueiros da ILHA TRÊS. A regra está em
// src/data/motoqueiros.js.
import { DB } from "../data/index.js";

/** O mais rápido da equipe que está de pé. Desmaiado não corre com ninguém. */
export function oMaisRapido(st) {
  const vivos = (st?.party || []).filter((m) => m.hp > 0 && m.stats);
  if (!vivos.length) return null;
  return vivos.reduce((a, b) => (b.stats.spe > a.stats.spe ? b : a));
}

/** Ele passa da bicicleta? Empate não passa. */
export const ganhaDaBike = (m) =>
  !!m && !!DB.MOTOQUEIROS && m.stats.spe > DB.MOTOQUEIROS.marca;

/** Ainda estão no caminho? */
export const aindaEstao = (st) => !st?.flags?.[DB.MOTOQUEIROS?.flag];

/** Este NPC é um dos motoqueiros DAQUELA ilha? Vai por SPRITE e não por id
 *  porque os ids (n2, n3...) vêm do importador do decomp e mudam de número a
 *  cada reimportação — um id anotado à mão aqui é um bug esperando a próxima
 *  vez que alguém rodar as ferramentas. */
export function ehMotoqueiro(npc, mapa) {
  const M = DB.MOTOQUEIROS;
  return !!M && mapa === M.mapa && npc?.sprite === M.sprite;
}
