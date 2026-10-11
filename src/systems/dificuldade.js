// A DIFICULDADE da partida. Mora no save (`st.dificuldade`): escolhida no jogo
// novo (src/scenes/title.js) e trocável a qualquer hora no menu OPÇÕES. Save
// antigo, sem ela, joga no MÉDIO — que é o jogo exatamente como sempre foi.
//
// O que cada nível mexe, sempre só do lado de lá (o seu time e a batalha
// online nunca mudam):
//   nivel     o nível dos Pokémon inimigos (selvagens e treinadores), x
//   bate      o dano que VOCÊ causa, x
//   apanha    o dano que você RECEBE, x
//   ia        "boba" escolhe golpe ao acaso; "meio" às vezes acerta o melhor;
//             "normal" é a de sempre; "esperta" sempre o melhor; "cruel"
//             sempre o melhor e sabe matar (prefere o golpe que derruba)
//   captura   a chance de captura, x
//   xp        a EXP que você ganha, x
import { recalc, xpForLevel } from "./mon.js";

export const DIFICULDADES = [
  { id: "bebe",    nome: "BEBÊ",             curto: "BEBÊ",       nivel: 0.6,  bate: 2.0,  apanha: 0.35, ia: "boba",    captura: 3,    xp: 2,
    dica: "NINGUÉM TE MACHUCA DE VERDADE." },
  { id: "muitofacil", nome: "MUITO FÁCIL",   curto: "MUITO FÁC.", nivel: 0.75, bate: 1.6,  apanha: 0.55, ia: "boba",    captura: 2,    xp: 1.6,
    dica: "INIMIGOS FRACOS E DISTRAÍDOS." },
  { id: "facil",   nome: "FÁCIL",            curto: "FÁCIL",      nivel: 0.9,  bate: 1.25, apanha: 0.8,  ia: "meio",    captura: 1.4,  xp: 1.25,
    dica: "UM POUCO DE AJUDA NO CAMINHO." },
  { id: "medio",   nome: "MÉDIO",            curto: "MÉDIO",      nivel: 1,    bate: 1,    apanha: 1,    ia: "normal",  captura: 1,    xp: 1,
    dica: "O JOGO COMO ELE É." },
  { id: "dificil", nome: "DIFÍCIL",          curto: "DIFÍCIL",    nivel: 1.15, bate: 0.9,  apanha: 1.25, ia: "esperta", captura: 0.85, xp: 1,
    dica: "INIMIGOS MAIS FORTES E SEM DÓ." },
  { id: "quaseimpossivel", nome: "QUASE IMPOSSÍVEL", curto: "QUASE IMP.", nivel: 1.35, bate: 0.75, apanha: 1.7, ia: "cruel", captura: 0.6, xp: 0.9,
    dica: "BOA SORTE. VOCÊ VAI PRECISAR." },
];

const POR_ID = Object.fromEntries(DIFICULDADES.map((d) => [d.id, d]));
const MEDIO = POR_ID.medio;

/** a dificuldade daquela partida (save sem ela = MÉDIO) */
export const dificuldadeDe = (st) => POR_ID[st?.dificuldade] || MEDIO;

/** anda pra próxima (lado 1) ou pra anterior (-1), sem dar a volta */
export function mudarDificuldade(st, lado) {
  const i = DIFICULDADES.indexOf(dificuldadeDe(st));
  const j = Math.max(0, Math.min(DIFICULDADES.length - 1, i + lado));
  st.dificuldade = DIFICULDADES[j].id;
  return DIFICULDADES[j];
}

// A da batalha que está rolando: a batalha chama `entrarNaBatalha(st)` no
// começo (por src/systems/pedras.js, prepararBatalha), e a IA e a captura
// leem daqui sem precisar do save na mão.
let atual = MEDIO;
export function entrarNaBatalha(st) { atual = dificuldadeDe(st); }
export const naBatalha = () => atual;

/** O nível do INIMIGO nesta dificuldade. Mexe no Pokémon uma vez só (marca
 *  `_dif`): um selvagem que fugiu e volta não cresce de novo. */
export function ajustarInimigo(mon) {
  if (!mon || mon._dif || atual.nivel === 1) return mon;
  mon._dif = true;
  const lvl = Math.max(1, Math.min(100, Math.round(mon.level * atual.nivel)));
  if (lvl === mon.level) return mon;
  const cheio = mon.hp >= mon.maxHp;
  mon.level = lvl;
  mon.xp = xpForLevel(lvl);     // capturado, ele sobe de nível do jeito certo
  recalc(mon);
  if (cheio || mon.hp > mon.maxHp) mon.hp = mon.maxHp;
  return mon;
}

/** quanto o dano muda: `doJogador` = quem bate é você */
export const fatorDano = (doJogador) => (doJogador ? atual.bate : atual.apanha);
