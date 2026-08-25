// DIA E NOITE.
//
// O relógio é o de verdade: a cada 15 minutos o mundo troca de fase, e os
// últimos 5 minutos de cada fase são a virada — de dia, aos 10 minutos começa a
// escurecer; de noite, aos 10 minutos começa a amanhecer. Então uma volta
// inteira (dia + noite) leva meia hora.
//
// POR QUE O RELÓGIO DA MÁQUINA, E NÃO UM CONTADOR NO SAVE
// Contador no save avança só enquanto alguém joga: você fecharia o jogo à noite
// e voltaria à noite, três dias depois. Do jeito que está, a fase sai de
// `Date.now()`: fechar e abrir não congela nada, dois aparelhos na mesma sala
// mostram a mesma hora, e não há um byte a mais no save. O preço é que quem
// mexer no relógio do computador mexe no céu do jogo — o que, para um jogo que
// se chama GLITCH EDITION, até combina.
//
// ESTE ARQUIVO NÃO DESENHA NADA. Ele responde "que horas são no mundo?" e a
// cena decide o que fazer com isso (o overworld e a batalha pintam o céu; a
// fenda e o interior das casas ignoram).
import { DB } from "../data/index.js";

const cfg = () => DB.CONFIG || {};

/** minutos de cada fase (dia, depois noite) */
export const minutosDaFase = () => Math.max(1, cfg().cicloMinutos ?? 15);

/** os últimos minutos da fase, em que ela vira a outra */
export const minutosDaVirada = () => Math.min(minutosDaFase(), cfg().viradaMinutos ?? 5);

/** o quanto o céu escurece na meia-noite fechada (0 = nada, 1 = breu) */
export const escuroMaximo = () => cfg().noiteMax ?? 0.58;

/** Que horas são no mundo, agora.
 *
 *  - `noite`     em qual das duas fases estamos
 *  - `t`         0..1 de quanto já passou desta fase
 *  - `escuridao` 0 = meio-dia, 1 = meia-noite. É isto que a tela usa.
 *  - `virando`   0..1 dentro da virada (0 fora dela)
 *  - `nome`      DIA / ENTARDECER / NOITE / AMANHECER
 *  - `faltam`    minutos até a próxima fase
 */
export function agora(quando = Date.now()) {
  const fase = minutosDaFase() * 60000;
  const noite = Math.floor(quando / fase) % 2 === 1;
  const t = (quando % fase) / fase;

  // a virada ocupa o fim da fase: com 15 e 5, ela começa em 10/15 = 2/3
  const comeco = (minutosDaFase() - minutosDaVirada()) / minutosDaFase();
  const virando = t >= comeco ? (t - comeco) / (1 - comeco) : 0;

  // de dia a escuridão sobe durante a virada; de noite ela desce. No fim de uma
  // fase o valor encosta no começo da outra, então não existe pulo no céu.
  const escuridao = noite ? 1 - virando : virando;

  return {
    noite, t, virando, escuridao,
    nome: noite ? (virando ? "AMANHECER" : "NOITE") : (virando ? "ENTARDECER" : "DIA"),
    faltam: (1 - t) * minutosDaFase(),
  };
}

/** O véu que se pinta por cima do mundo: cor e opacidade.
 *
 *  A cor não é a mesma o tempo todo. No começo da virada o céu puxa pro
 *  alaranjado (é entardecer, não apagar a luz), e conforme escurece ele vai pro
 *  azul de noite. Sem isso, escurecer vira só "a tela ficando cinza". */
export function veu(quando = Date.now()) {
  const { escuridao } = agora(quando);
  if (escuridao <= 0.001) return { alpha: 0, cor: "#000000" };
  const quente = [92, 42, 26];      // o laranja queimado do fim da tarde
  const frio = [10, 16, 48];        // o azul da noite fechada
  const k = Math.min(1, escuridao / 0.6);   // a cor chega ao azul antes do breu
  const c = quente.map((v, i) => Math.round(v + (frio[i] - v) * k));
  return {
    alpha: escuridao * escuroMaximo(),
    cor: `rgb(${c[0]},${c[1]},${c[2]})`,
  };
}

/** true quando aquele mapa fica de fora do ciclo (dentro de casa, na caverna,
 *  na fenda: lá não tem céu pra escurecer). */
export const temCeu = (mapa) => !!mapa && !mapa.interior;
