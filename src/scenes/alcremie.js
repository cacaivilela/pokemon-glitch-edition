// O ALCREMIE GIRANDO (o CAIO escolheu "ele gira", como no Sword/Shield): o
// doce cai em cima dele, ele começa a girar cada vez mais rápido, e durante o
// giro o creme NOVO vai cobrindo o antigo, faixa por faixa (as mesmas faixas
// tortas do redemoinho). Depois ele desacelera, para num clarão, pula, grita
// e toca a musiquinha do EVOLUIU. A cor já está no seed antes da cena: aqui é
// só o filme (src/systems/doces.js faz a conta; src/core/assets.js pinta).
//
//   game.scenes.push(new AlcremieScene(), { mon, seedAntes, seedDepois, doce, falas })
import { DB } from "../data/index.js";
import { Assets } from "../core/assets.js";
import { Audio2 } from "../core/audio.js";
import { fade } from "../core/gfx.js";
import { Dialogue } from "../systems/dialogue.js";
import { reduzido } from "../core/reduzir.js";
import { tocarGrito } from "../systems/gritos.js";

const W = 240, H = 160;
const CX = 120, CHAO = 104;          // onde ficam os pés dele
const LADO = 64;
// os tempos de cada parte (segundos)
const CAI = 0.9;                     // o doce caindo
const GIRA = 3.6;                    // girando e acelerando (o creme troca aqui)
const FREIA = 1.0;                   // desacelerando até parar
const VOLTAS_MAX = 7;                // voltas por segundo no mais rápido

export class AlcremieScene {
  enter(args = {}) {
    this.mon = args.mon;
    this.antes = args.seedAntes;
    this.depois = args.seedDepois;
    this.doce = args.doce;
    this.falas = args.falas || [];
    this.dlg = new Dialogue();
    this.t = 0; this.tf = 0;
    this.fase = "cai";
    this.angulo = 0;
    this.flash = 0;
    this.pulo = 0;
    this.fadeA = 1; this.fadeDir = -1;
    this.granulado = Array.from({ length: 40 }, () => this.novoGranulado(Math.random() * H));
    this.brilhos = [];
    this.tomT = 0;
    Audio2.stopLoop();
    Audio2.tone(1200, 0.06, "sine", 0.3);
  }

  exit() { Audio2.stopLoop(); }

  novoGranulado(y = -4) {
    const cores = ["#ff8ab0", "#ffe46a", "#8ad8ff", "#b48aff", "#9ae07a", "#ffffff"];
    return { x: Math.random() * W, y, v: 14 + Math.random() * 20, cor: cores[Math.floor(Math.random() * cores.length)], deitado: Math.random() < 0.5 };
  }

  mudaFase(f) { this.fase = f; this.tf = 0; }

  update(dt) {
    this.t += dt; this.tf += dt;
    if (this.fadeDir) {
      this.fadeA = Math.max(0, Math.min(1, this.fadeA + this.fadeDir * dt * 3));
      if (this.fadeDir < 0 && this.fadeA <= 0) this.fadeDir = 0;
      if (this.fadeDir > 0 && this.fadeA >= 1) return void this.game.scenes.pop();
    }
    for (const g of this.granulado) { g.y += g.v * dt; if (g.y > H) Object.assign(g, this.novoGranulado()); }
    for (const b of this.brilhos) { b.x += b.vx * dt; b.y += b.vy * dt; b.vida -= dt; }
    this.brilhos = this.brilhos.filter((b) => b.vida > 0);
    this.flash = Math.max(0, this.flash - dt * 2);
    if (this.dlg.update(dt)) return;

    if (this.fase === "cai") {
      if (this.tf >= CAI) {
        this.mudaFase("gira");
        Audio2.tone(880, 0.08, "square", 0.3);
        this.flash = 0.4;
      }
    } else if (this.fase === "gira") {
      const k = this.tf / GIRA;
      this.angulo += dt * Math.PI * 2 * (0.6 + (VOLTAS_MAX - 0.6) * k * k);
      // um zumbido subindo, cada vez mais agudo
      this.tomT -= dt;
      if (this.tomT <= 0) { this.tomT = 0.12 - 0.08 * k; Audio2.tone(300 + 900 * k, 0.05, "triangle", 0.18); }
      if (Math.random() < dt * (8 + 40 * k)) this.soltaBrilho(k);
      if (this.tf >= GIRA) this.mudaFase("freia");
    } else if (this.fase === "freia") {
      const k = this.tf / FREIA;
      this.angulo += dt * Math.PI * 2 * VOLTAS_MAX * (1 - k) * (1 - k);
      if (this.tf >= FREIA) this.parou();
    } else if (this.fase === "pronto") {
      this.pulo = Math.max(0, this.pulo - dt * 3);
    }
  }

  /** um brilho da cor do doce, saindo do creme girando */
  soltaBrilho(k) {
    const a = Math.random() * Math.PI * 2, v = 40 + 80 * k;
    this.brilhos.push({ x: CX + Math.cos(a) * 18, y: CHAO - 30 + Math.sin(a) * 18, vx: Math.cos(a) * v, vy: Math.sin(a) * v,
                        vida: 0.5 + Math.random() * 0.4, cor: Math.random() < 0.7 ? this.doce?.creme || "#fff" : "#ffffff" });
  }

  parou() {
    this.mudaFase("pronto");
    this.angulo = 0;
    this.flash = 1;
    this.pulo = 1;
    for (let i = 0; i < 40; i++) this.soltaBrilho(1);
    tocarGrito(this.mon);
    const fan = DB.MUSIC?.evolucao_fanfarra;
    setTimeout(() => {
      if (this.fadeDir > 0) return;
      if (fan) Audio2.playSong(fan); else Audio2.heal();
    }, 900);
    this.dlg.say(this.falas, () => { Audio2.stopLoop(); this.fadeDir = 1; });
  }

  // ------------------------------------------------------------- desenho
  /** o desenho do Alcremie agora: o creme antigo, com o novo cobrindo faixa
   *  por faixa enquanto ele gira (`cobre` de 0 a 1) */
  sprite(cobre) {
    const velho = Assets.mon("alcremie", this.antes), novo = Assets.mon("alcremie", this.depois);
    if (cobre <= 0) return velho;
    if (cobre >= 1) return novo;
    // um canvas novo a cada quadro: o `reduzido` guarda a cópia pequena pelo
    // canvas, e reaproveitar o mesmo mostraria a mistura velha
    const cv = document.createElement("canvas");
    cv.width = novo.width; cv.height = novo.height;
    const ctx = cv.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(velho, 0, 0);
    // as faixas tortas do redemoinho, de baixo pra cima: a linha que separa o
    // creme novo do velho sobe enquanto ele gira
    const corte = cv.height * (1 - cobre) * 1.4 - cv.width * 0.2;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, cv.height);
    for (let x = 0; x <= cv.width; x += 4) ctx.lineTo(x, corte - x * 0.5 + Math.sin(x / 7 + this.t * 6) * 4);
    ctx.lineTo(cv.width, cv.height);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(novo, 0, 0);
    ctx.restore();
    return cv;
  }

  render(ctx) {
    // a confeitaria: rosa em cima, creme embaixo, e granulado caindo
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#5a2a4a"); g.addColorStop(0.6, "#c86a94"); g.addColorStop(1, "#f6d6c0");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    for (const gr of this.granulado) {
      ctx.fillStyle = gr.cor;
      ctx.fillRect(Math.round(gr.x), Math.round(gr.y), gr.deitado ? 3 : 1, gr.deitado ? 1 : 3);
    }
    // o pratinho
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.beginPath(); ctx.ellipse(CX, CHAO + 2, 40, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(200,140,170,0.6)";
    ctx.beginPath(); ctx.ellipse(CX, CHAO + 2, 30, 6, 0, 0, Math.PI * 2); ctx.fill();

    // quanto do creme novo já cobriu
    const cobre = this.fase === "cai" ? 0 : this.fase === "gira" ? Math.min(1, (this.tf / GIRA) * 1.15) : 1;
    const img = this.sprite(cobre);
    if (img) {
      const peq = reduzido(img, LADO);
      // GIRANDO: a largura vai e volta (o cosseno do ângulo); do lado de trás,
      // espelhado. Um pouquinho de largura sempre, pra ele não sumir
      const c = Math.cos(this.angulo);
      const sx = Math.sign(c || 1) * Math.max(0.08, Math.abs(c));
      const pula = Math.sin(this.pulo * Math.PI) * 10;
      ctx.save();
      ctx.translate(CX, 0);
      ctx.scale(sx, 1);
      ctx.drawImage(peq, -LADO / 2, CHAO - LADO - pula, LADO, LADO);
      ctx.restore();
    }

    // o doce caindo do céu, girando
    if (this.fase === "cai") {
      const k = Math.min(1, this.tf / CAI);
      const y = -10 + (CHAO - LADO + 8) * k * k;
      this.desenhaDoce(ctx, CX - 6, y, 2);
    }
    for (const b of this.brilhos) {
      ctx.globalAlpha = Math.min(1, b.vida * 2);
      ctx.fillStyle = b.cor;
      ctx.fillRect(Math.round(b.x) - 1, Math.round(b.y), 3, 1);
      ctx.fillRect(Math.round(b.x), Math.round(b.y) - 1, 1, 3);
    }
    ctx.globalAlpha = 1;
    if (this.flash > 0) fade(ctx, this.flash, "#ffffff");
    this.dlg.render(ctx);
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }

  /** o doce: um bolinho de creme da cor dele com o morango em cima */
  desenhaDoce(ctx, x, y, k) {
    const cor = this.doce?.creme || "#fde4d0";
    ctx.fillStyle = "#101010"; ctx.fillRect(x - k, y + 4 * k, 8 * k, 4 * k);
    ctx.fillStyle = cor; ctx.fillRect(x, y + 5 * k, 6 * k, 2 * k);
    ctx.fillStyle = "#101010"; ctx.fillRect(x, y + k, 6 * k, 4 * k);
    ctx.fillStyle = cor; ctx.fillRect(x + k, y + 2 * k, 4 * k, 2 * k);
    ctx.fillStyle = "#fb5d74"; ctx.fillRect(x + 2 * k, y - k, 2 * k, 2 * k);
  }
}
