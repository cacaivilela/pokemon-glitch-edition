// A ABERTURA, antes do título.
//
// É a demonstração de sempre, na ordem de sempre: a apresentação, um vulto
// atravessando a tela, o DUELO de dois Pokémon frente a frente se aproximando
// em pulsos — e o clarão que entrega o logo. Quem cresceu ligando um cartucho
// desses reconhece a ordem antes de reconhecer o desenho.
//
// O que muda é o fim: aqui o logo não fica parado. Ele treme, perde uma faixa e
// se remonta, porque o jogo se chama GLITCH EDITION e a abertura é o primeiro
// lugar onde isso devia aparecer.
//
// APERTAR QUALQUER COISA PULA. Abertura que não se pula vira castigo na segunda
// vez, e ninguém assiste três minutos de fanfarra pra continuar um save.
import { DB } from "../data/index.js";
import { Assets } from "../core/assets.js";
import { pedirMon } from "../core/sprites.js";
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { drawText, fade, PAL } from "../core/gfx.js";
import { Glitch } from "../systems/glitchfx.js";
import { TitleScene } from "./title.js";

const W = 240, H = 160;

/** O roteiro, em segundos. Mexer aqui muda a abertura inteira sem tocar no
 *  desenho: cada fase sabe quando começa e quanto dura. */
const FASES = [
  { nome: "apresenta", dur: 2.6 },   // o nome do estúdio, no escuro
  { nome: "corrida", dur: 2.4 },     // o vulto atravessando
  { nome: "duelo", dur: 5.2 },       // os dois se encarando e se aproximando
  { nome: "logo", dur: 3.4 },        // o clarão, o logo e o glitch
];

export class AberturaScene {
  enter() {
    this.t = 0;
    // Atalho de dev: `?abertura=duelo` começa naquela fase. Sem isto, conferir o
    // fim da abertura é esperar dez segundos toda vez — e numa aba de teste, que
    // o navegador roda em câmera lenta, é esperar muito mais.
    const pedida = new URLSearchParams(location.search).get("abertura");
    this.fase = Math.max(0, FASES.findIndex((f) => f.nome === pedida));
    this.faseT = 0;
    this.flash = 0;
    this.saindo = false;
    this.investida = 0;          // quantas vezes os dois já se bateram
    this.glitchLogo = 0;
    Glitch.level = 0;
    // Os três da abertura são pedidos JÁ. O sprite de um Pokémon só é baixado
    // quando ele precisa aparecer, e aqui ele precisa aparecer no primeiro
    // segundo de jogo — sem isto, o duelo estreia com a arte provisória.
    for (const [id, dex] of [["nidorino", 33], ["gengar", 94], ["rapidash", 78]]) {
      pedirMon(id, dex);
    }
    Audio2.playMusic("abertura", DB.MUSIC?.abertura);
  }

  exit() { Audio2.stopLoop(); }

  /** vai pro título, com ou sem o resto da abertura */
  pular() {
    if (this.saindo) return;
    this.saindo = true;
    Audio2.stopLoop();
    this.game.scenes.pop();
    this.game.scenes.push(new TitleScene());
  }

  update(dt) {
    this.t += dt;
    this.faseT += dt;
    this.flash = Math.max(0, this.flash - dt * 2.2);
    this.glitchLogo = Math.max(0, this.glitchLogo - dt);

    // qualquer botão pula — inclusive o de menu, inclusive as setas
    if (Input.consume("a") || Input.consume("b") || Input.consume("select")
        || Input.consume("run") || Input.dir()) return this.pular();

    const fase = FASES[this.fase];
    if (this.faseT >= fase.dur) {
      this.fase++;
      this.faseT = 0;
      if (this.fase >= FASES.length) return this.pular();
      if (FASES[this.fase].nome === "duelo") Audio2.tone(320, 0.12, "square", 0.5);
      if (FASES[this.fase].nome === "logo") {
        this.flash = 1;                 // o clarão que entrega o logo
        Glitch.hit(2.5);
        Audio2.glitch();
      }
    }

    // no duelo, os dois se batem três vezes, cada vez mais perto
    if (fase.nome === "duelo") {
      const bateEm = [1.4, 2.8, 4.2][this.investida];
      if (bateEm && this.faseT >= bateEm) {
        this.investida++;
        this.flash = 0.55;
        Audio2.hit();
        Glitch.hit(0.8);
      }
    }
  }

  // ---------------------------------------------------------------- render
  render(ctx) {
    ctx.fillStyle = "#0a0810";
    ctx.fillRect(0, 0, W, H);
    const fase = FASES[this.fase]?.nome;
    if (fase === "apresenta") this.drawApresenta(ctx);
    if (fase === "corrida") this.drawCorrida(ctx);
    if (fase === "duelo") this.drawDuelo(ctx);
    if (fase === "logo") this.drawLogo(ctx);

    // o aviso de pular, piscando devagar no rodapé — menos nos últimos instantes
    if (fase !== "logo" && Math.floor(this.t * 1.6) % 2 === 0) {
      drawText(ctx, DB.STORY.abertura.pular, 74, H - 14, "#5a5470");
    }
    if (this.flash > 0) fade(ctx, this.flash, "#ffffff");
  }

  /** o nome no escuro, entrando e saindo devagar */
  drawApresenta(ctx) {
    const A = DB.STORY.abertura;
    const t = this.faseT / FASES[0].dur;
    const alpha = Math.min(1, Math.min(t, 1 - t) * 4);
    ctx.globalAlpha = alpha;
    drawText(ctx, A.estudio, 60, 66, "#f4f2ff");
    drawText(ctx, A.apresenta, 82, 82, "#7a6f9c");
    ctx.globalAlpha = 1;
  }

  /** um vulto correndo de um lado ao outro, na frente de faixas de chão */
  drawCorrida(ctx) {
    const t = this.faseT / FASES[1].dur;
    const x = -60 + t * (W + 120);
    // as faixas passam pra trás mais rápido que ele: é o que dá a sensação de
    // velocidade sem precisar desenhar cenário nenhum
    for (let i = 0; i < 7; i++) {
      const fx = ((i * 46) - this.t * 190) % (W + 40);
      ctx.fillStyle = i % 2 ? "#1a1630" : "#241d3e";
      ctx.fillRect(fx < 0 ? fx + W + 40 : fx, 96 + i * 3, 30, 2);
    }
    const img = Assets.mon("rapidash", 7) || Assets.mon("ponyta", 7);
    if (img) {
      ctx.save();
      ctx.globalAlpha = 0.92;
      ctx.translate(Math.round(x), 62 + Math.sin(this.t * 14) * 2);
      ctx.drawImage(img, 0, 0, 64, 64);
      ctx.restore();
    }
  }

  /** O DUELO: um de cada lado, se aproximando em pulsos. O da esquerda é visto
   *  de costas e o da direita de frente, como numa batalha — é essa moldura que
   *  faz a cena ser reconhecida na hora. */
  drawDuelo(ctx) {
    const t = this.faseT / FASES[2].dur;
    const chegada = Math.min(1, this.investida / 3);
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#1b1030");
    g.addColorStop(1, "#3a1d5c");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#120a20";
    ctx.fillRect(0, 112, W, H - 112);

    const pulo = Math.abs(Math.sin(this.t * 5)) * 4;
    const esq = Assets.monBack("nidorino", 7) || Assets.mon("nidorino", 7);
    const dir = Assets.mon("gengar", 7);
    if (esq) ctx.drawImage(esq, Math.round(6 + chegada * 42), Math.round(70 - pulo), 64, 64);
    if (dir) ctx.drawImage(dir, Math.round(W - 70 - chegada * 42), Math.round(28 + pulo), 64, 64);

    // o risco de tensão entre os dois, fechando a cada investida
    ctx.fillStyle = "#b455ff";
    ctx.globalAlpha = 0.35 + chegada * 0.4;
    ctx.fillRect(84 + chegada * 30, 84, Math.max(2, 70 - chegada * 60), 2);
    ctx.globalAlpha = 1;
  }

  /** o logo, tremendo como quem não confia no próprio cartucho */
  drawLogo(ctx) {
    const A = DB.STORY.abertura;
    const t = this.faseT;
    const treme = t < 0.6 ? 0 : Math.floor(t * 7) % 3 === 0 ? 1 : 0;
    const dx = treme ? (Math.random() < 0.5 ? -2 : 2) : 0;

    ctx.fillStyle = "#0a0810";
    ctx.fillRect(0, 0, W, H);
    drawText(ctx, A.titulo1, 52 + dx, 54, "#f4f2ff");
    drawText(ctx, A.titulo2, 74 - dx, 72, "#b455ff");

    // a faixa que sai do lugar: o logo do jogo se recusando a ficar parado
    if (treme) {
      ctx.fillStyle = "#0a0810";
      ctx.fillRect(0, 60, W, 6);
      drawText(ctx, A.titulo1, 52 - dx * 3, 54, "#59d99b");
    }
    if (t > 1.4 && Math.floor(t * 2) % 2 === 0) {
      drawText(ctx, A.comece, 78, 110, "#a99ec9");
    }
  }
}
