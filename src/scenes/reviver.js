// A CENA DO REVIVER (pedido do CAIO, nov/2026: "faz uma cutscene do raticate
// revivendo"). Do jeito que ELE escolheu, "FICHAS VIRAM ALMA":
//   1. as 100 fichas saem da máquina
//   2. giram em volta e se juntam numa bola de luz
//   3. a bola vira o FANTASMA do Pokémon (azul)
//   4. a cor volta de baixo pra cima
//   5. ele dá o grito — o certo, não ao contrário
// Vale pra todo Pokémon revivido no CAÇADOR DE FANTASMAS (src/data/cacafantasma.js).
// args: { mon, fim } — `fim` roda depois que a cena fecha.
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { Assets } from "../core/assets.js";
import { url } from "../core/base.js";
import { drawText } from "../core/font.js";
import { tocarGrito } from "../systems/gritos.js";
import { desenharMaquina, fantasmaDe } from "./cacafantasma.js";

const W = 240, H = 160;
const CX = 120, CY = 62;            // onde a alma se junta
const BICO = { x: 120, y: 126 };
// os tempos de cada parte (segundos)
const SAEM = 1.6, GIRAM = 3.4, FANTASMA = 4.4, COR = 6.4;
const N = 100;                      // as 100 fichas

export class ReviverScene {
  enter(args = {}) {
    this.mon = args.mon;
    this.fim = args.fim || null;
    this.t = 0;
    this.gritou = false;
    this.flash = 0;
    this.faiscas = [];
    this.fundo = new Image();
    this.fundo.src = url("assets/maps/pokemon_tower_2f.png");
    // cada ficha: quando sai, pra onde voa, e o ângulo dela na roda
    this.fichas = Array.from({ length: N }, (_, i) => {
      const a = (i / N) * Math.PI * 2 * 3 + Math.random() * 0.4;
      return { sai: (i / N) * (SAEM - 0.5), a, r: 46 + Math.random() * 26, gira: 2.5 + Math.random() * 1.5 };
    });
    Audio2.tone?.(220, 0.3, "sine", 0.08);
  }

  update(dt) {
    this.t += dt;
    this.flash = Math.max(0, this.flash - dt * 1.5);
    for (const f of this.faiscas) { f.x += f.vx * dt; f.y += f.vy * dt; f.vida -= dt * 1.4; }
    this.faiscas = this.faiscas.filter((f) => f.vida > 0);
    // o zumbido das fichas saindo, subindo de tom enquanto juntam
    if (this.t < GIRAM && Math.floor(this.t * 8) !== Math.floor((this.t - dt) * 8)) {
      Audio2.tone?.(200 + (this.t / GIRAM) * 500, 0.08, "triangle", 0.04);
    }
    // a cor subindo solta faísca na linha
    if (this.t > FANTASMA && this.t < COR) {
      const p = (this.t - FANTASMA) / (COR - FANTASMA);
      for (let k = 0; k < 2; k++) {
        this.faiscas.push({ x: CX + (Math.random() - 0.5) * 50, y: CY + 26 - p * 52, vx: (Math.random() - 0.5) * 30, vy: -20 - Math.random() * 20, vida: 1 });
      }
    }
    if (!this.gritou && this.t >= COR) {
      this.gritou = true;
      this.flash = 1;
      if (this.mon) tocarGrito(this.mon);
      Audio2.heal?.();
      for (let k = 0; k < 30; k++) {
        const a = Math.random() * Math.PI * 2, v = 30 + Math.random() * 60;
        this.faiscas.push({ x: CX, y: CY, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vida: 1 });
      }
    }
    if (this.t > COR + 0.8 && (Input.consume("a") || Input.consume("b"))) {
      Audio2.select?.();
      this.game.scenes.pop();
      this.fim?.();
    }
  }

  /** onde está a ficha i agora (ou null se ainda não saiu / já entrou na bola) */
  ondeFicha(f) {
    const t = this.t - f.sai;
    if (t < 0) return null;
    // saindo: do bico até a roda, desacelerando
    const ate = SAEM - f.sai;
    const alvo = { x: CX + Math.cos(f.a) * f.r, y: CY + Math.sin(f.a) * f.r * 0.8 };
    if (this.t < SAEM) {
      const k = 1 - Math.pow(1 - Math.min(1, t / Math.max(0.3, ate)), 3);
      return { x: BICO.x + (alvo.x - BICO.x) * k, y: BICO.y + (alvo.y - BICO.y) * k, luz: 0.6 };
    }
    // girando e fechando em espiral até o centro
    if (this.t < GIRAM) {
      const k = (this.t - SAEM) / (GIRAM - SAEM), r = f.r * (1 - k * k);
      const a = f.a + (this.t - SAEM) * f.gira * (1 + k * 2);
      return { x: CX + Math.cos(a) * r, y: CY + Math.sin(a) * r * 0.8, luz: 0.6 + k * 0.4 };
    }
    return null;
  }

  render(ctx) {
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#0c0818";
    ctx.fillRect(0, 0, W, H);
    if (this.fundo.complete && this.fundo.naturalWidth) {
      ctx.drawImage(this.fundo, (this.fundo.naturalWidth - W) / 2, (this.fundo.naturalHeight - H) / 2, W, H, 0, 0, W, H);
    }
    ctx.fillStyle = "rgba(14,4,34,0.78)";
    ctx.fillRect(0, 0, W, H);

    desenharMaquina(ctx, BICO.x, BICO.y, this.t, this.t < GIRAM, Math.min(1, this.t / GIRAM));

    // 1 e 2: as fichas
    for (const f of this.fichas) {
      const p = this.ondeFicha(f);
      if (!p) continue;
      const x = Math.round(p.x), y = Math.round(p.y);
      ctx.fillStyle = `rgba(64,224,208,${0.35 * p.luz})`; ctx.fillRect(x - 2, y - 2, 5, 5);
      ctx.fillStyle = "#40e0d0"; ctx.fillRect(x - 1, y - 1, 3, 3);
      ctx.fillStyle = "#e8ffff"; ctx.fillRect(x, y, 1, 1);
    }

    // a bola de luz: cresce enquanto as fichas entram, pulsa, e some no fantasma
    const cresce = Math.max(0, Math.min(1, (this.t - SAEM) / (GIRAM - SAEM)));
    const some = this.t < GIRAM ? 1 : Math.max(0, 1 - (this.t - GIRAM) / (FANTASMA - GIRAM));
    if (cresce > 0 && some > 0) {
      const r = (4 + cresce * 16 + Math.sin(this.t * 18) * 1.5) * (this.t < GIRAM ? 1 : 1 + (1 - some) * 0.8);
      const g = ctx.createRadialGradient(CX, CY, 0, CX, CY, r);
      g.addColorStop(0, `rgba(255,255,255,${some})`);
      g.addColorStop(0.45, `rgba(120,240,240,${0.8 * some})`);
      g.addColorStop(1, "rgba(64,224,208,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(CX, CY, r, 0, Math.PI * 2); ctx.fill();
    }

    // 3 e 4: o fantasma, e a cor subindo
    const img = this.mon && Assets.mon(this.mon.species, this.mon.seed);
    if (img && this.t >= GIRAM) {
      const fan = fantasmaDe(img);
      const L = Math.min(64, Math.max(img.width, img.height)), e = L / Math.max(img.width, img.height);
      const w = img.width * e, h = img.height * e, x0 = CX - w / 2, y0 = CY - h / 2;
      const aparece = Math.min(1, (this.t - GIRAM) / (FANTASMA - GIRAM));
      const p = this.t < FANTASMA ? 0 : Math.min(1, (this.t - FANTASMA) / (COR - FANTASMA));
      const corte = img.height * (1 - p);       // daqui pra baixo já tem cor
      for (let y = 0; y < img.height; y += 2) {
        const colorido = y >= corte;
        const dx = colorido ? 0 : Math.sin(y * 0.25 + this.t * 5) * 2;
        ctx.globalAlpha = colorido ? 1 : aparece * (0.65 + 0.2 * Math.sin(this.t * 6));
        ctx.drawImage(colorido ? img : fan, 0, y, img.width, 2, x0 + dx, y0 + y * e, w, 2 * e + 0.5);
      }
      ctx.globalAlpha = 1;
      // a linha brilhando onde a cor está chegando
      if (p > 0 && p < 1) {
        ctx.fillStyle = "rgba(232,255,255,0.9)";
        ctx.fillRect(Math.round(x0), Math.round(y0 + corte * e), Math.round(w), 1);
      }
    }

    for (const f of this.faiscas) {
      ctx.fillStyle = `rgba(232,255,255,${Math.max(0, f.vida)})`;
      ctx.fillRect(Math.round(f.x), Math.round(f.y), 1, 1);
    }
    if (this.flash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${this.flash * 0.85})`;
      ctx.fillRect(0, 0, W, H);
    }
    // 5: o nome
    if (this.t >= COR && this.mon) {
      const txt = `${this.mon.nickname || this.mon.species.toUpperCase()} REVIVEU!`;
      ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.fillRect(0, H - 20, W, 20);
      drawText(ctx, txt, (W - txt.length * 6) / 2, H - 15, "#ffd860");
    }
  }
}
