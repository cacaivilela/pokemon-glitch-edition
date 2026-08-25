// AS LANTERNAS.
//
// Quando escurece — de noite lá fora, ou o dia inteiro dentro de uma caverna —
// todo mundo que está no mapa acende a sua: o jogador e cada NPC. O que se vê
// não é "o mapa mais escuro": é o escuro com BURACOS, um em volta de cada
// pessoa, e o resto do mapa some.
//
// COMO O BURACO É FEITO
// Numa camada só, fora da tela: pinta o escuro inteiro nela, e depois apaga
// círculos com `destination-out` — apagar é o que abre o buraco, e o degradê do
// círculo é o que faz a luz morrer devagar em vez de virar um recorte de
// tesoura. No fim a camada vai por cima do mundo, de uma vez. Fazer isso direto
// na tela do jogo apagaria o jogo junto.
//
// A camada é UMA só, guardada entre um quadro e outro: criar canvas de 240x160
// sessenta vezes por segundo é a diferença entre rodar e engasgar.
import { DB } from "../data/index.js";
import { makeCanvas } from "../core/assets.js";
import { agora, escuroMaximo } from "./ciclo.js";

/** caverna é o mapa que toca a música de caverna: escuro o dia inteiro */
export const ehCaverna = (mapa) => mapa?.music === "cave";

/** dentro de casa não tem céu nem caverna: a luz é a de sempre */
const ehCasa = (mapa) => !!mapa?.interior;

/** o escuro daquele lugar agora: 0 = claro, 1 = breu */
export function escuridaoDoLugar(mapa, quando = Date.now()) {
  if (ehCasa(mapa)) return 0;
  if (ehCaverna(mapa)) return DB.CONFIG?.cavernaEscura ?? 0.82;
  return agora(quando).escuridao * escuroMaximo();
}

/** a partir daqui está escuro o bastante pra alguém acender a lanterna */
const ACENDE = 0.3;

export const acesa = (mapa, quando = Date.now()) => escuridaoDoLugar(mapa, quando) >= ACENDE;

/** o raio da luz, em pixels: o miolo claro e a beirada onde ela morre */
export const RAIO = { miolo: 16, borda: 46 };

let camada = null;

/** Pinta o escuro com um buraco em cada luz e devolve a camada pronta.
 *  `luzes` são pontos na tela: [{ x, y, raio }] — o canto de cima-esquerda do
 *  sprite de 16x16 mais 8 dá o meio da pessoa. */
export function camadaDeLuz(w, h, escuridao, cor, luzes) {
  if (!camada || camada.cv.width !== w || camada.cv.height !== h) camada = makeCanvas(w, h);
  const { cv, ctx } = camada;

  ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = cor;
  ctx.globalAlpha = escuridao;
  ctx.fillRect(0, 0, w, h);
  ctx.globalAlpha = 1;

  // agora os buracos: o degradê vai de "apaga tudo" no meio a "não apaga nada"
  // na beirada, então a luz vaza pro escuro em vez de recortar um círculo
  ctx.globalCompositeOperation = "destination-out";
  for (const luz of luzes) {
    const r = luz.raio || RAIO.borda;
    const g = ctx.createRadialGradient(luz.x, luz.y, Math.min(RAIO.miolo, r * 0.35), luz.x, luz.y, r);
    g.addColorStop(0, "rgba(0,0,0,1)");
    g.addColorStop(0.55, "rgba(0,0,0,0.72)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(luz.x, luz.y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";
  return cv;
}

/** O brilho quente por cima da luz: sem ele a lanterna é só um buraco no
 *  escuro, e lanterna nenhuma é um buraco — ela é uma coisa que ilumina. */
export function brilho(ctx, luzes) {
  ctx.globalCompositeOperation = "lighter";
  for (const luz of luzes) {
    const r = (luz.raio || RAIO.borda) * 0.62;
    const g = ctx.createRadialGradient(luz.x, luz.y, 0, luz.x, luz.y, r);
    g.addColorStop(0, "rgba(255,214,130,0.30)");
    g.addColorStop(1, "rgba(255,190,90,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(luz.x, luz.y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";
}
