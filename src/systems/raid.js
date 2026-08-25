// AS GLITCH RAIDS. Um chefe da fenda: grande demais, com escudo na frente.
//
// O que faz dele um chefe não é só ter mais HP. É o ESCUDO: enquanto ele está de
// pé, o dano bate nele e não no bicho, e não adianta jogar bola — primeiro se
// quebra a casca, depois se conversa. É isso que transforma "um selvagem com
// muito HP" numa luta com duas partes.
import { DB } from "../data/index.js";
import { createMon } from "./mon.js";
import { randRange, chance } from "../core/rng.js";
import { RAID, PORTAL, PONTOS } from "../data/glitch.js";

/** Rola a chance de o encontro da fenda virar raid. Não é mais usada pelos
 *  encontros — quem chama a raid agora é o rasgo, aqui embaixo —, mas fica: é
 *  a mesma pergunta, e quem quiser a raid de volta lá dentro só precisa dela. */
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

// ---------------------------------------------------------------- O RASGO
//
// A raid saiu de dentro da fenda. Ela chega por um RASGO que abre na grama de
// Kanto: um por vez, aberto por alguns minutos, e enquanto ele estiver de pé a
// tela inteira fica seis vezes mais corrompida que o normal. Encostar nele (ou
// falar com ele) faz o chefe passar pro nosso lado.
//
// O rasgo mora no save (`st.raidPortal`), não na cena: assim ele sobrevive a
// recarregar a página no meio, e a cena não precisa lembrar de nada.

/** O PONTO FRACO perto de você agora, ou null. Todos valem o mesmo, então quem
 *  ganha é o MAIS PERTO: dois pontos dentro do mesmo raio é coisa que não devia
 *  existir, mas se existir, o rasgo abre no que está debaixo do seu nariz e não
 *  no que está do outro lado da tela. */
export function pontoPerto(st, mapa) {
  const p = st?.player;
  if (!p) return null;
  let melhor = null, menor = Infinity;
  for (const q of PONTOS) {
    if (q.mapa !== mapa) continue;
    const d = Math.abs(q.x - p.x) + Math.abs(q.y - p.y);
    if (d > PORTAL.raio || d >= menor) continue;
    melhor = q; menor = d;
  }
  return melhor;
}

/** Rola a chance de um rasgo abrir neste passo. Dentro do raio de um ponto
 *  fraco ela é `pesoPonto` vezes maior — é isso, e só isso, que faz um lugar
 *  ter fama de rasgar mais que os outros. */
export function temPortal(st, mapa) {
  const perto = !!pontoPerto(st, mapa);
  return chance(PORTAL.chance * (perto ? PORTAL.pesoPonto : 1));
}

/** O rasgo aberto agora, ou null. Ele VENCE SOZINHO: quem pergunta primeiro é
 *  quem limpa, então não sobra rasgo esquecido num save antigo. */
export function portalAberto(st, mapa) {
  const p = st?.raidPortal;
  if (!p) return null;
  if (Date.now() >= p.ate) { delete st.raidPortal; return null; }
  if (mapa && p.map !== mapa) return null;
  return p;
}

export function fecharPortal(st) { if (st) delete st.raidPortal; }

/** Abre um rasgo perto do jogador. `livre(x, y)` vem da cena, que é quem
 *  conhece colisão, NPC e grama. Devolve o rasgo, ou null se não achou lugar. */
export function abrirPortal(st, mapa, livre) {
  const p = st?.player;
  if (!p) return null;
  const { perto, longe, minutos } = PORTAL;
  const abrir = (x, y) => (st.raidPortal = { map: mapa, x, y, ate: Date.now() + minutos * 60000 });

  // Ponto fraco por perto: é ALI que ele abre. Sortear um tile qualquer do lado
  // desperdiçaria o ponto — o que faz o lugar ter fama é o rasgo aparecer
  // sempre no mesmo canto dele, não em algum lugar daquele pedaço do mapa.
  const q = pontoPerto(st, mapa);
  if (q && !(q.x === p.x && q.y === p.y) && livre(q.x, q.y)) return abrir(q.x, q.y);

  for (let tentativa = 0; tentativa < 120; tentativa++) {
    const x = p.x + randRange(-longe, longe);
    const y = p.y + randRange(-longe, longe);
    const d = Math.abs(x - p.x) + Math.abs(y - p.y);
    if (d < perto || d > longe) continue;
    if (!livre(x, y)) continue;
    return abrir(x, y);
  }
  return null;
}

/** O quanto você está PERTO do rasgo: 1 colado nele, 0 a `alcance` tiles ou
 *  mais. É o que faz a sujeira subir conforme você anda pra lá. */
export function pertoDoPortal(st, mapa) {
  const p = portalAberto(st, mapa);
  if (!p || !st?.player) return 0;
  const d = Math.abs(p.x - st.player.x) + Math.abs(p.y - st.player.y);
  return Math.max(0, 1 - d / PORTAL.alcance);
}

/** A corrupção da tela agora: a de sempre quando você está longe, subindo até
 *  `corrupcao` VEZES ela quando você encosta.
 *
 *  O PISO existe porque num save limpo o normal é ZERO, e seis vezes zero
 *  continua zero — o rasgo tem que sujar a tela mesmo em Kanto inteira e limpa.
 *  E o teto de 100 é do próprio pós-processamento: com o mundo já quebrado (60)
 *  a conta passa de trezentos, então lá o 6x vira "o máximo que a tela dá", que
 *  é exatamente o ponto. */
export function corrupcaoDoPortal(st, mapa) {
  const normal = st?.corruption || 0;
  const cheio = Math.min(100, Math.max(normal, PORTAL.piso) * PORTAL.corrupcao);
  return normal + (cheio - normal) * pertoDoPortal(st, mapa);
}

export { RAID, PORTAL };
