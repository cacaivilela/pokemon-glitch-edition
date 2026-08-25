// AS GLITCH RAIDS. Um chefe da fenda: grande demais, com escudo na frente.
//
// O que faz dele um chefe não é só ter mais HP. É o ESCUDO: enquanto ele está de
// pé, o dano bate nele e não no bicho, e não adianta jogar bola — primeiro se
// quebra a casca, depois se conversa. É isso que transforma "um selvagem com
// muito HP" numa luta com duas partes.
import { DB } from "../data/index.js";
import { createMon } from "./mon.js";
import { randRange, chance } from "../core/rng.js";
import { RAID } from "../data/glitch.js";

/** Rola a chance de o encontro da fenda virar raid. */
export const temRaid = () => chance(RAID.chance);

/** Monta o chefe a partir de uma tabela de encontro da fenda.
 *  Devolve `{ mon, escudo, escudoMax }`, ou null se não deu pra montar. */
export function montarChefe(tabela) {
  const lista = (tabela || []).filter((e) => DB.SPECIES[e.id]);
  if (!lista.length) return null;
  const escolhido = lista[Math.floor(Math.random() * lista.length)];
  const nivel = randRange(RAID.nivel[0], RAID.nivel[1]);
  const mon = createMon(escolhido.id, nivel, { corrupt: true });

  // o chefe é o mesmo bicho, inflado: HP vezes `vidas` e o resto vezes `forca`.
  // Mexer nos `stats` (e não nos base) é de propósito: assim a conta de dano do
  // jogo não muda em lugar nenhum — ele só é grande.
  mon.maxHp = Math.round(mon.maxHp * RAID.vidas);
  mon.hp = mon.maxHp;
  for (const k of ["atk", "def", "spa", "spd", "spe"]) {
    mon.stats[k] = Math.round(mon.stats[k] * RAID.forca);
  }
  mon.raid = true;
  const escudoMax = Math.round(mon.maxHp * RAID.escudo);
  return { mon, escudo: escudoMax, escudoMax };
}

/** O dano bate primeiro no escudo. Devolve quanto sobrou pro bicho e se a
 *  casca quebrou agora. */
export function bater(raid, dano) {
  if (!raid || raid.escudo <= 0) return { noBicho: dano, quebrou: false };
  const noEscudo = Math.min(raid.escudo, dano);
  raid.escudo -= noEscudo;
  return { noBicho: dano - noEscudo, quebrou: raid.escudo <= 0 };
}

/** Enquanto a casca está de pé, bola não pega. */
export const podeCapturar = (raid) => !raid || raid.escudo <= 0;

/** O prêmio por derrubar: dinheiro na hora, e a experiência sai multiplicada. */
export function premio() {
  return {
    dinheiro: randRange(RAID.premio.dinheiro[0], RAID.premio.dinheiro[1]),
    xp: RAID.premio.xp,
  };
}

export { RAID };
