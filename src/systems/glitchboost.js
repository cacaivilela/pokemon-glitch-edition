// O GLITCHBOOSTER, por dentro.
//
// Ligou: o Pokémon vira um bug. Daí em diante o dano que ele TOMA é somado num
// contador, e esse contador entra em todo atributo menos o HP. Levou 20, tem
// +20 em ataque, defesa, ataque especial, defesa especial e velocidade.
//
// O contador é de UM BYTE. Passou de 255, ele volta pro zero — e o Pokémon que
// estava monstruoso fica pior do que começou. Isso não é um acidente da conta:
// é a conta. Apanhar é a força, e apanhar demais é a queda.
//
// O ITEM NÃO GASTA. Ele é chave, como o decodificador e o visor: compra-se uma
// vez e fica. O que acaba é o EFEITO — o bug dura a batalha (`limpar`, chamado
// no fim) e nada dele é gravado no save.
import { DB } from "../data/index.js";
import { BOOSTER, GLITCHBOOSTER } from "../data/glitch.js";

/** Tem um na mochila? */
export const temBooster = (st) => (st?.items?.[GLITCHBOOSTER.item] || 0) > 0;

/** O VISOR-G.L.I.T.C.H, que o CONOR entrega, é quem lê a GLITCHFORM: sem ele no
 *  rosto o booster é um cartucho quebrado. (É o mesmo visor dos fragmentos —
 *  `DB.STORY.detector.item`.) */
export const temVisor = (st) => (st?.items?.[DB.STORY?.detector?.item] || 0) > 0;

/** E o professor precisa ter explicado o que é isso. Um item que transforma o
 *  seu Pokémon num bug não devia funcionar antes de alguém dizer o que ele faz —
 *  ainda mais este, que pode zerar tudo que você juntou. */
export const explicado = (st) => !!st?.flags?.glitchform;

/** Dá pra usar agora? Os três juntos: item, visor e explicação. */
export const podeUsarBooster = (st) => temBooster(st) && temVisor(st) && explicado(st);

/** Por que não dá — pra tela saber o que dizer. */
export function porQueNao(st) {
  if (!temVisor(st)) return "semVisor";
  if (!explicado(st)) return "semExplicacao";
  if (!temBooster(st)) return "semItem";
  return null;
}

/** Este Pokémon está bugado agora? */
export const bugado = (mon) => !!mon?.bug;

/** Liga o bug num Pokémon. NÃO gasta o item: ele é chave. O limite de uso não
 *  é a mochila, é o byte — quem usa isso todo turno é quem zera um Pokémon. */
export function ligar(st, mon) {
  if (!podeUsarBooster(st) || !mon) return false;
  mon.bug = { dano: 0, virou: false };
  return true;
}

/** Soma o dano que ele acabou de tomar. Devolve o que mudou:
 *  `{ bonus, virou }` — `virou` é true no instante em que o byte deu a volta. */
export function acumular(mon, dano) {
  if (!bugado(mon) || dano <= 0) return { bonus: bonusDe(mon), virou: false };
  const antes = mon.bug.dano;
  mon.bug.dano += Math.round(dano * BOOSTER.porDano);
  // a volta do byte: antes cabia, agora não cabe mais
  const virou = Math.floor(mon.bug.dano / BOOSTER.byte) > Math.floor(antes / BOOSTER.byte);
  if (virou) mon.bug.virou = true;
  return { bonus: bonusDe(mon), virou };
}

/** O bônus que está valendo: o contador dentro do byte. */
export function bonusDe(mon) {
  if (!bugado(mon)) return 0;
  return mon.bug.dano % BOOSTER.byte;
}

/** Quanto falta pra virar o byte (pra tela avisar antes de ser tarde). */
export const atéVirar = (mon) => (bugado(mon) ? BOOSTER.byte - bonusDe(mon) : 0);

/** O bônus daquele atributo. HP nunca sobe: o dano tem que continuar doendo. */
export function bonusDoAtributo(mon, key) {
  if (!bugado(mon) || !BOOSTER.sobem.includes(key)) return 0;
  return bonusDe(mon);
}

/** Tira o bug: fim de batalha, ou o Pokémon voltou pra bola. */
export function limpar(mon) { if (mon) delete mon.bug; }

/** Tira de todo mundo (fim de batalha). */
export function limparTudo(st) { for (const mon of st?.party || []) limpar(mon); }

export { GLITCHBOOSTER };
