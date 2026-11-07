// A DESCIDA PRA ÁREA ZERO (pedido do CAIO, nov/2026: "se o jogador não tiver
// koraidon ou miraidon na equipe ele desce de cyclizar emprestado").
//
// Você montado no bicho (o desenho de andar dele, virado pra baixo, com você em
// cima), correndo PAREDE DA CRATERA ABAIXO. A parede passa subindo cada vez
// mais rápido; o céu lá em cima vira um círculo cada vez menor; aparecem os
// veios e as pontas de cristal, a névoa, e o verde do fundo vai chegando. No
// fim ele pula, o chão treme, e a tela clareia. `aoFim` roda depois do pop.
//
// (Quem chama já pôs você no mapa da ÁREA ZERO antes: a volta do overworld
// clareia direto lá embaixo.)
import { Assets } from "../core/assets.js";
import { Audio2 } from "../core/audio.js";
import { fade } from "../core/gfx.js";
import { makeRng } from "../core/rng.js";
import { tocarGrito } from "../systems/gritos.js";

const W = 240, H = 160;
const DURA = 5.2;                 // segundos até o pulo do fim
const CRISTAIS = [["#b0408a", "#e070b8", "#ffb4e4"], ["#2a8ab0", "#4cc4e4", "#a8f0ff"], ["#6a4ab0", "#9a7ae0", "#d4c4ff"]];

export class DescidaScene {
  /** args: { especie, aoFim? } */
  enter(args = {}) {
    this.especie = args.especie;
    this.aoFim = args.aoFim || null;
    this.t = 0; this.desceu = 0;
    this.fadeA = 1; this.fadeDir = -1;
    this.flash = 0; this.treme = 0;
    this.saindo = false; this.pulou = false;
    // as coisas presas na parede (veios, pontas de cristal, plantas), sorteadas uma vez
    const r = makeRng(4040);
    this.coisas = [];
    for (let i = 0; i < 70; i++) {
      this.coisas.push({ x: 10 + r.int(W - 20), y: i * 46 + r.int(30), tipo: r.pick(["veio", "ponta", "ponta", "planta", "pedra"]),
                         cor: r.int(3), tam: 4 + r.int(8), lado: r.chance(0.5) ? 1 : -1 });
    }
    this.poeira = [];
    Audio2.stopLoop();
    tocarGrito({ species: this.especie });
  }

  update(dt) {
    this.t += dt;
    if (this.fadeDir) {
      this.fadeA = Math.max(0, Math.min(1, this.fadeA + this.fadeDir * dt * 2.2));
      if (this.fadeDir < 0 && this.fadeA <= 0) this.fadeDir = 0;
    }
    this.flash = Math.max(0, this.flash - dt * 1.8);
    this.treme = Math.max(0, this.treme - dt);
    if (this.saindo) {
      if (this.fadeA >= 1) { this.game.scenes.pop(); this.aoFim?.(); }
      return;
    }
    // a velocidade: começa devagar, acelera, freia um pouco antes do fundo
    const p = Math.min(1, this.t / DURA);
    const vel = 60 + 320 * Math.sin(Math.PI * Math.min(1, p * 1.15)) ** 0.7;
    if (!this.pulou) this.desceu += vel * dt;
    // a poeira saindo das patas
    if (!this.pulou && Math.random() < 0.6) this.poeira.push({ x: 120 + (Math.random() - 0.5) * 30, y: 104, vx: (Math.random() - 0.5) * 40, vy: -20 - Math.random() * 50, t: 0 });
    for (const q of this.poeira) { q.t += dt; q.x += q.vx * dt; q.y += q.vy * dt; }
    this.poeira = this.poeira.filter((q) => q.t < 0.6);
    // o passo (um "tac" de vez em quando)
    if (!this.pulou && Math.floor(this.t * (vel / 40)) !== this._passo) { this._passo = Math.floor(this.t * (vel / 40)); if (this._passo % 2) Audio2.tone(90 + Math.random() * 30, 0.03, "square", 0.25); }
    if (!this.pulou && this.t >= DURA) {
      this.pulou = true; this.tPulo = this.t;
      Audio2.tone(330, 0.1, "square", 0.4); Audio2.tone(494, 0.14, "square", 0.4);
    }
    if (this.pulou && !this.caiu && this.t - this.tPulo > 0.55) {
      this.caiu = true; this.treme = 0.4; this.flash = 0.8;
      Audio2.baque?.();
    }
    if (this.caiu && this.t - this.tPulo > 1.4) { this.saindo = true; this.fadeDir = 1; }
  }

  render(ctx) {
    const sx = this.treme > 0 ? Math.round((Math.random() - 0.5) * 6) : 0;
    ctx.save();
    ctx.translate(sx, 0);
    const p = Math.min(1, this.desceu / 1500);          // 0 = beira da cratera, 1 = fundo
    // o FUNDO: o céu lá em cima indo embora e o ar ficando verde-azulado
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, mistura("#8ad0ff", "#2a5a6a", p));
    g.addColorStop(1, mistura("#5a7aa0", "#1e4a40", p));
    ctx.fillStyle = g; ctx.fillRect(-8, 0, W + 16, H);
    // o círculo de céu, lá em cima, cada vez menor
    const raio = 140 * (1 - p) + 18;
    ctx.fillStyle = "rgba(200,235,255,0.5)";
    ctx.beginPath(); ctx.ellipse(W / 2, -raio * 0.55, raio, raio * 0.6, 0, 0, Math.PI * 2); ctx.fill();
    // A PAREDE: a faixa de pedra em que ele corre, em camadas que passam subindo
    const desce = this.desceu;
    ctx.fillStyle = "#5a5278"; ctx.fillRect(40, 0, W - 80, H);
    for (let y = -((desce * 1.0) % 12); y < H; y += 12) {
      const k = Math.floor((y + desce) / 12);
      ctx.fillStyle = k % 2 ? "#6a6288" : "#4e4870"; ctx.fillRect(40, Math.round(y), W - 80, 6);
      ctx.fillStyle = "#3a3452"; ctx.fillRect(40 + ((k * 37) % (W - 100)), Math.round(y) + 3, 14, 1);
    }
    // as beiradas da parede, mais escuras (a curva da cratera)
    for (const [x0, lado] of [[40, 1], [W - 40, -1]]) {
      for (let i = 0; i < 18; i++) { ctx.fillStyle = `rgba(20,14,40,${0.5 - i * 0.027})`; ctx.fillRect(lado > 0 ? x0 + i : x0 - i - 1, 0, 1, H); }
    }
    // as paredes do lado, lá longe (com o verde aparecendo embaixo no fim)
    ctx.fillStyle = mistura("#3a3452", "#2c5a44", p); ctx.fillRect(-8, 0, 48, H); ctx.fillRect(W - 40, 0, 48, H);
    // as coisas presas na parede, passando
    for (const c of this.coisas) {
      const y = Math.round(c.y - (desce % 3220));
      const yy = y < -30 ? y + 3220 : y;
      if (yy < -20 || yy > H + 20 || c.x < 44 || c.x > W - 44) continue;
      const [e, m, cl] = CRISTAIS[c.cor];
      if (c.tipo === "veio") { for (let i = 0; i < c.tam * 2; i++) { ctx.fillStyle = i % 3 ? m : cl; ctx.fillRect(c.x + i, yy + Math.round(i * 0.4 * c.lado), 1, 2); } }
      else if (c.tipo === "ponta") {
        ctx.fillStyle = e; ctx.beginPath(); ctx.moveTo(c.x - c.tam / 2, yy); ctx.lineTo(c.x + c.lado * 2, yy - c.tam * 1.6); ctx.lineTo(c.x + c.tam / 2, yy); ctx.fill();
        ctx.fillStyle = cl; ctx.fillRect(c.x - 1, Math.round(yy - c.tam), 1, Math.round(c.tam * 0.7));
      } else if (c.tipo === "planta") { ctx.fillStyle = "#4f9a5e"; for (let i = 0; i < 5; i++) ctx.fillRect(c.x + i * 2, yy + (i % 3), 1, 4 + (i % 2) * 3); }
      else { ctx.fillStyle = "#3a3452"; ctx.fillRect(c.x, yy, c.tam, Math.round(c.tam * 0.6)); ctx.fillStyle = "#7a729a"; ctx.fillRect(c.x, yy, c.tam, 1); }
    }
    // A NÉVOA, passando mais devagar
    for (let i = 0; i < 4; i++) {
      const y = ((i * 53 - desce * 0.4) % (H + 40) + H + 40) % (H + 40) - 20;
      ctx.fillStyle = `rgba(220,240,255,${0.06 + 0.1 * p})`; ctx.fillRect(-8, Math.round(y), W + 16, 10);
    }
    // O FUNDO DA CRATERA chegando: o verde subindo por baixo no final
    if (p > 0.82) {
      const sobe = Math.round((p - 0.82) / 0.18 * 46);
      ctx.fillStyle = "#5cae6c"; ctx.fillRect(-8, H - sobe, W + 16, sobe);
      ctx.fillStyle = "#3fa660"; for (let x = -8; x < W + 8; x += 6) ctx.fillRect(x, H - sobe - 2, 3, 3);
    }
    // a poeira
    for (const q of this.poeira) { ctx.fillStyle = `rgba(200,190,220,${0.7 - q.t})`; ctx.fillRect(Math.round(q.x), Math.round(q.y), 2, 2); }
    // ELE (e você em cima), descendo a parede
    this.desenharMontado(ctx);
    ctx.restore();
    if (this.flash > 0) fade(ctx, this.flash, "#ffffff");
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }

  /** o bicho virado pra baixo (o desenho de andar dele, o passo pelo tempo) e
   *  você sentado, tapado da cintura pra baixo por ele; no pulo, sobe e cai */
  desenharMontado(ctx) {
    const ms = this.pulou ? 0 : this.t * 1000 * 1.6;
    const q = Assets.monAndando({ species: this.especie }, "down", ms);
    const heroi = Assets.actor("hero").down?.[0];
    let pulo = 0;
    if (this.pulou && !this.caiu) { const k = (this.t - this.tPulo) / 0.55; pulo = Math.sin(k * Math.PI) * 26; }
    const E = 2;                                   // tudo em dobro: é a câmera bem perto
    const pe = 110 - pulo;
    if (q) {
      const w = q.width * E, h = q.height * E;
      const x = Math.round(W / 2 - w / 2), y = Math.round(pe - h);
      if (heroi) ctx.drawImage(heroi, Math.round(W / 2 - heroi.width), Math.round(y + h * 0.45 - heroi.height * E + 18), heroi.width * E, heroi.height * E);
      ctx.drawImage(q, x, y, w, h);
    } else if (heroi) ctx.drawImage(heroi, Math.round(W / 2 - heroi.width), Math.round(pe - heroi.height * E), heroi.width * E, heroi.height * E);
    // a sombra embaixo
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath(); ctx.ellipse(W / 2, 112, 18 - pulo * 0.2, 4, 0, 0, Math.PI * 2); ctx.fill();
  }
}

/** a mistura de duas cores "#rrggbb" (0 = a primeira, 1 = a segunda) */
function mistura(a, b, k) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * k)).join(",")})`;
}
