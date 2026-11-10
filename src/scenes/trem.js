// A VIAGEM NO TREM MAGNÉTICO (src/data/johto.js, `pegarTrem` no overworld).
// De lado: o céu, as montanhas longe, as árvores perto passando rápido, o
// trilho, e o TREM branco com a faixa azul flutuando em cima dele (é
// magnético: não encosta no trilho). Pra JOHTO ele vai pra esquerda (Johto
// fica a oeste de Kanto); voltando, pra direita. Uns 6 segundos; A adianta.
// args: { de, para, indoPraJohto, fim }
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { drawText } from "../core/font.js";

const W = 240, H = 160, DURA = 6;
const TRILHO = 112;              // a altura do trilho na tela

// O NARIZ do trem, pixel por pixel (o vagão da frente; virado pra direita):
// b branco, c cinza claro, s sombra, a azul, A azul escuro, v vidro, V brilho
const NARIZ = [
  "bbbbbbbbbbbbbbbbbbb.......",
  "bbbbbbbbbbbbbbbbbbbbb.....",
  "bbbbbbbbbbbbbbbbbbbbbbb...",
  "bbbbbbbbbbbbbbbvvvvVVbbb..",
  "bbbbbbbbbbbbbbbvvvvvVVbbb.",
  "bbbbbbbbbbbbbbbvvvvvvvbbbb",
  "aaaaaaaaaaaaaaaaaaaaaaaaaa",
  "AAAAAAAAAAAAAAAAAAAAAAAAA.",
  "bbbbbbbbbbbbbbbbbbbbbbbb..",
  "cccccccccccccccccccccccc..",
  "sssssssssssssssssssssss...",
];
const COR = { b: "#f4f6fa", c: "#c8ced8", s: "#8a92a2", a: "#3a78d8", A: "#1e4aa0", v: "#203048", V: "#a8d8ff" };

export class TremScene {
  enter(args = {}) {
    this.de = args.de || "";
    this.para = args.para || "";
    this.esquerda = !!args.indoPraJohto;
    this.fim = args.fim || null;
    this.t = 0;
    this.acabou = false;
    // o zumbido do ímã subindo
    for (let i = 0; i < 6; i++) setTimeout(() => Audio2.tone?.(180 + i * 70, 0.25, "sine", 0.08), i * 120);
  }

  update(dt) {
    this.t += dt;
    if (this.t > 1 && Input.consume("a")) this.t = Math.max(this.t, DURA);
    if (Math.floor(this.t * 3) !== Math.floor((this.t - dt) * 3) && this.t < DURA) Audio2.tone?.(520, 0.05, "triangle", 0.04);
    if (this.t >= DURA && !this.acabou) {
      this.acabou = true;
      Audio2.tone?.(660, 0.2, "sine", 0.1);
      this.game.scenes.pop();
      this.fim?.();
    }
  }

  /** a VELOCIDADE: arranca, corre e freia (pixels por segundo do cenário) */
  velocidade() {
    const k = this.t / DURA;
    return 40 + 520 * Math.min(1, k * 3) * Math.min(1, (1 - k) * 3);
  }

  render(ctx) {
    ctx.imageSmoothingEnabled = false;
    // quanto o cenário andou até agora (a integral da velocidade, aproximada)
    const andou = (this._andou = (this._andou || 0) + this.velocidade() / 60);
    const lado = this.esquerda ? 1 : -1;        // o cenário corre pro lado contrário do trem
    // o céu
    const g = ctx.createLinearGradient(0, 0, 0, TRILHO);
    g.addColorStop(0, "#5aa0e8"); g.addColorStop(1, "#bfe2ff");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, TRILHO);
    // as montanhas longe (andam devagar)
    ctx.fillStyle = "#7e9cc4";
    for (let i = -1; i < 6; i++) {
      const x = (((i * 70 + andou * 0.08 * lado) % 420) + 420) % 420 - 70;
      ctx.beginPath(); ctx.moveTo(x, 86); ctx.lineTo(x + 35, 46 + (i % 3) * 8); ctx.lineTo(x + 70, 86); ctx.fill();
    }
    ctx.fillStyle = "#5f8f4a"; ctx.fillRect(0, 86, W, TRILHO - 86);
    // as árvores perto (andam rápido)
    for (let i = 0; i < 14; i++) {
      const x = (((i * 26 + andou * 0.6 * lado) % 364) + 364) % 364 - 20;
      ctx.fillStyle = "#3d6b2c"; ctx.fillRect(Math.round(x) + 6, 92, 4, 12);
      ctx.fillStyle = "#2c7a36"; ctx.fillRect(Math.round(x), 80, 16, 14);
      ctx.fillStyle = "#3f9446"; ctx.fillRect(Math.round(x) + 2, 78, 12, 4);
    }
    // o trilho e os dormentes
    ctx.fillStyle = "#4a4a52"; ctx.fillRect(0, TRILHO, W, H - TRILHO);
    ctx.fillStyle = "#9aa0aa"; ctx.fillRect(0, TRILHO + 2, W, 3);
    for (let i = 0; i < 20; i++) {
      const x = (((i * 16 + andou * 1.2 * lado) % 320) + 320) % 320 - 16;
      ctx.fillStyle = "#6a5a48"; ctx.fillRect(Math.round(x), TRILHO + 6, 8, 3);
    }
    // o TREM: entra, fica no meio e sai (é ele que vai pro lado da viagem)
    const k = this.t / DURA;
    const meio = W / 2 - 60;
    const entra = Math.min(1, k * 4), sai = Math.max(0, (k - 0.82) / 0.18);
    let x0 = this.esquerda
      ? W + 10 - (W + 10 - meio) * entra - sai * (W + 200)
      : -150 + (meio + 150) * entra + sai * (W + 200);
    const boia = Math.round(Math.sin(this.t * 6) * 1);       // flutuando no ímã
    this.desenharTrem(ctx, Math.round(x0), TRILHO - 15 + boia);
    // as linhas de velocidade
    const v = this.velocidade();
    if (v > 300) {
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      for (let i = 0; i < 6; i++) {
        const y = 20 + ((i * 37) % 70), x = (((i * 53 + andou * 2 * lado) % 300) + 300) % 300 - 30;
        ctx.fillRect(Math.round(x), y, 24, 1);
      }
    }
    // o letreiro
    ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.fillRect(0, 0, W, 22);
    drawText(ctx, "TREM MAGNÉTICO", 6, 3, "#ffd860");
    const rota = `${this.de} → ${this.para}`.slice(0, 38);
    drawText(ctx, rota, 6, 12, "#ffffff");
    if (this.t > 1) drawText(ctx, "A: ADIANTAR", W - 72, H - 10, "#c8d8ff");
  }

  /** o trem: o nariz na frente, dois vagões e a traseira (o nariz espelhado) */
  desenharTrem(ctx, x, y) {
    const frenteEsq = this.esquerda;
    const nariz = (nx, espelha) => {
      NARIZ.forEach((l, j) => {
        for (let i = 0; i < l.length; i++) {
          const c = COR[l[i]];
          if (!c) continue;
          ctx.fillStyle = c;
          ctx.fillRect(espelha ? nx + l.length - 1 - i : nx + i, y + j, 1, 1);
        }
      });
    };
    const vagao = (vx) => {
      ctx.fillStyle = COR.b; ctx.fillRect(vx, y, 40, 6);
      ctx.fillStyle = COR.a; ctx.fillRect(vx, y + 6, 40, 1);
      ctx.fillStyle = COR.A; ctx.fillRect(vx, y + 7, 40, 1);
      ctx.fillStyle = COR.b; ctx.fillRect(vx, y + 8, 40, 1);
      ctx.fillStyle = COR.c; ctx.fillRect(vx, y + 9, 40, 1);
      ctx.fillStyle = COR.s; ctx.fillRect(vx, y + 10, 40, 1);
      for (let w = 0; w < 4; w++) { ctx.fillStyle = COR.v; ctx.fillRect(vx + 3 + w * 9, y + 2, 6, 3); ctx.fillStyle = COR.V; ctx.fillRect(vx + 3 + w * 9, y + 2, 2, 1); }
      ctx.fillStyle = COR.s; ctx.fillRect(vx + 40, y + 1, 1, 9);        // a emenda
    };
    // virado pra direita: [traseira][vagão][vagão][nariz]; pra esquerda, ao contrário
    if (frenteEsq) {
      nariz(x, true); vagao(x + 26); vagao(x + 67); nariz(x + 108, false);
    } else {
      nariz(x, true); vagao(x + 26); vagao(x + 67); nariz(x + 108, false);
    }
    // o brilho do ímã embaixo
    ctx.fillStyle = `rgba(120,200,255,${0.4 + 0.3 * Math.sin(this.t * 20)})`;
    ctx.fillRect(x + 2, y + 12, 130, 1);
  }
}
