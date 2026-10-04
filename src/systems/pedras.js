// AS PEDRAS BRAGLITCHIANAS: cada chefe de ilha deixa uma (src/data/braglitch-ilhas.js,
// PEDRAS), e cada uma dá um bônus PASSIVO — basta estar na mochila, como as
// insígnias do jogo antigo. Vale em qualquer batalha, de qualquer região.
//
// Quem é "seu" numa batalha é quem estava na sua equipe quando ela começou
// (`prepararBatalha`). A marca é um WeakSet, e não um campo no Pokémon: um
// campo iria parar no save, e o bônus é da mochila, não do bicho.
import { DB } from "../data/index.js";

const DO_JOGADOR = new WeakSet();
let ativas = [];

/** Chamado quando a batalha começa: quais pedras você tem e quem é seu. */
export function prepararBatalha(st) {
  ativas = (DB.PEDRAS_BRAG || []).filter((p) => st?.items?.[p.item] > 0);
  for (const m of st?.party || []) DO_JOGADOR.add(m);
}

const produto = (campo) => ativas.reduce((f, p) => f * (p[campo] || 1), 1);

/** Multiplicador de um atributo (atk, def, spa, spd, spe) — só dos seus. */
export const fatorAtributo = (mon, key) =>
  (DO_JOGADOR.has(mon) ? ativas.reduce((f, p) => f * (p.atributo?.[key] || 1), 1) : 1);

/** Multiplicador do dano que um Pokémon seu RECEBE. */
export const fatorDanoRecebido = (def) => (DO_JOGADOR.has(def) ? produto("dano") : 1);

/** Multiplicador da Poké Bola (entra no `ballBonus` da captura). */
export const fatorCaptura = () => produto("captura");

/** Multiplicador da experiência que a sua equipe ganha. */
export const fatorXp = () => produto("xp");
