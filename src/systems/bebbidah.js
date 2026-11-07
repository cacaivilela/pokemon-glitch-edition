// O BEBBIDAH — as regras (os dados estão em src/data/bebbidah.js).
//
// A FORMA NO SEED: como o creme do ALCREMIE (src/systems/doces.js), a forma
// do BEBBIDÃO mora no valor de personalidade dele, e todo lugar que desenha um
// bicho por (espécie, seed) já pinta certo. O seed marcado começa com 0xBEB
// (as 12 casas de cima) e embaixo guarda:
//   bits 0-4  a bebida (1 a 31 = a posição em BEBIDAS + 1; 0 = água)
//   bits 5-7  o tom (0 = bem claro ... 4 = bem escuro)
//   bit  8    1 = quente, 0 = gelado
// Seed sem a marca = água pura, sem gelo e sem fumaça.
import { DB } from "../data/index.js";
import { regiaoDoMapa } from "./regionais.js";
import { agora } from "./ciclo.js";

const MARCA = 0xbeb;

/** a forma guardada no seed: { bebida, tom, quente } ou null (água pura) */
export function formaDoSeed(seed) {
  const s = (seed ?? 0) >>> 0;
  if (s >>> 20 !== MARCA) return null;
  const k = s & 31;
  const bebida = (DB.BEBIDAS || [])[k - 1] || null;
  if (!bebida) return null;
  const tons = DB.BEBIDA_TONS || [];
  const tom = Math.min(tons.length - 1, (s >>> 5) & 7);
  return { bebida, tom, quente: !!((s >>> 8) & 1) };
}

export function seedDaForma({ bebida, tom, quente }) {
  const k = (DB.BEBIDAS || []).indexOf(bebida) + 1;
  if (k <= 0) return 0;
  return ((MARCA << 20) | k | ((tom & 7) << 5) | (quente ? 1 << 8 : 0)) >>> 0;
}

export const bebidaDoItem = (item) => (DB.BEBIDAS || []).find((b) => b.item === item) || null;

/** O TOM DO LUGAR: calmo = claro, perigoso = escuro. Mede pelo nível mais
 *  alto dos selvagens do mapa (sem selvagem = calmo); o FUNDO DO MAR é
 *  sempre o mais escuro. Fora de Braglitch, o tom do meio. */
export function tomDoMapa(id) {
  const fora = DB.BEBIDA_TOM_FORA ?? 2;
  if (!id || regiaoDoMapa(id) !== "braglitch") return fora;
  const m = DB.MAPS?.[id];
  if (!m) return fora;
  const tons = DB.BEBIDA_TONS || [];
  if (m.submerso || id.startsWith("fundo_")) return tons.length - 1;
  const niveis = (m.encounters || []).map((e) => e.max ?? e.min ?? 0);
  const nivel = niveis.length ? Math.max(...niveis) : 0;
  const regra = (DB.BEBIDA_TOM_POR_NIVEL || []).find((r) => nivel <= r.ate);
  return regra ? regra.tom : fora;
}

/** Que forma sai AGORA, segurando esse item, neste mapa. null = item que não vira bebida. */
export function formaDaqui(item, mapa) {
  const bebida = bebidaDoItem(item);
  if (!bebida) return null;
  return { bebida, tom: tomDoMapa(mapa), quente: agora().noite };
}


// ------------------------------------------------------------------ O GIRO
// Anda em círculo: cada vez que a direção do personagem muda 90° pro MESMO
// lado (cima → direita → baixo → esquerda, ou o contrário) conta uma virada.
// Virou pro outro lado, parou de andar ou demorou demais: começa de novo.
const ORDEM = ["up", "right", "down", "left"];

export function novoGiro() {
  return { dir: null, sentido: 0, viradas: 0, t0: 0 };
}

/** Avisa o giro que o personagem agora olha pra `dir` (no tempo `ms`).
 *  Devolve true quando completou o giro (e zera pra contar de novo). */
export function girar(g, dir, ms) {
  const cfg = DB.BEBBIDAH_GIRO || { viradas: 8, segundos: 4 };
  if (dir === g.dir) return false;
  const antes = ORDEM.indexOf(g.dir), depois = ORDEM.indexOf(dir);
  g.dir = dir;
  if (antes < 0 || depois < 0) { g.viradas = 0; g.sentido = 0; return false; }
  const passo = (depois - antes + 4) % 4;
  const sentido = passo === 1 ? 1 : passo === 3 ? -1 : 0;
  if (!sentido || (g.sentido && sentido !== g.sentido) || ms - g.t0 > cfg.segundos * 1000) {
    // começou agora (ou desistiu e começou de novo daqui)
    g.sentido = sentido; g.viradas = sentido ? 1 : 0; g.t0 = ms;
    return false;
  }
  g.sentido = sentido;
  g.viradas += 1;
  if (g.viradas >= cfg.viradas) { g.viradas = 0; g.sentido = 0; g.t0 = ms; return true; }
  return false;
}

/** O BEBBIDAH da equipe que vai evoluir com o giro: o primeiro que segura um
 *  ingrediente que vira bebida. null = ninguém. */
export function quemGira(party) {
  return (party || []).find((m) => m && m.species === "bebbidah" && m.hp > 0 && bebidaDoItem(m.item)) || null;
}
