// A CUTSCENE DO GUARDA-ROUPA ÚNICO: trocar de FORMA ÚNICA (src/systems/unicas.js).
// Uns 4 segundos, sempre retos (o isométrico não entra aqui):
//
//   ABRE    o guarda-roupa de madeira no meio de um quarto; as portas abrem
//   ENTRA   ele anda pra dentro, ficando pequeno, e as portas fecham
//   TROCA   o armário treme e pula; cabides, meias e camisetas voam pra fora
//   SAI     as portas se escancaram num clarão e ele sai com a roupa nova,
//           dando um pulinho no meio de estrelinhas
//
// A espécie já foi trocada antes de a cena abrir; aqui é só o filme (`de` e
// `para` dizem qual desenho mostrar em cada parte). A frase fecha no A.
import { Assets } from "../core/assets.js";
import { Audio2 } from "../core/audio.js";
import { Dialogue } from "../systems/dialogue.js";
import { fade } from "../core/gfx.js";

const W = 240, H = 160;
const CX = 120, CHAO = 118;
const AW = 70, AH = 92;                 // o guarda-roupa
const FASES = [["abre", 0.7], ["entra", 0.9], ["troca", 1.4], ["sai", 1.2]];
const ROUPAS = ["#e0524a", "#4f8ce0", "#f0c419", "#4cd06a", "#b455ff", "#ff8ad8"];
const prende = (t) => Math.max(0, Math.min(1, t));

export class VestirScene {
  /** args: { mon, de, para, frase?, aoFim? } */
  enter(args = {}) {
    this.mon = args.mon;
    this.de = args.de;
    this.para = args.para;
    this.frase = args.frase || "";
    this.aoFim = args.aoFim || null;
    Assets.mon(this.de, this.mon.seed);
    Assets.mon(this.para, this.mon.seed);
    this.dlg = new Dialogue();
    this.t = 0;
    this.i = 0;
    this.tf = 0;
    this.flash = 0;
    this.fadeA = 1;
    this.fadeDir = -1;
    this.saindo = false;
    this.acabou = false;
    this.voando = [];
    this.estrelas = [];
    Audio2.stopLoop();
    Audio2.tone(392, 0.08, "triangle", 0.35);
  }

  get fase() { return FASES[this.i]?.[0] || "fim"; }
  get k() { return prende(this.tf / (FASES[this.i]?.[1] || 1)); }

  update(dt) {
    this.t += dt;
    this.tf += dt;
    if (this.fadeDir) {
      this.fadeA = prende(this.fadeA + this.fadeDir * dt * 3);
      if (this.fadeDir < 0 && this.fadeA <= 0) this.fadeDir = 0;
    }
    this.flash = Math.max(0, this.flash - dt * 3);
    this.dlg.update(dt);
    if (this.saindo) {
      if (this.fadeA >= 1) { this.game.scenes.pop(); this.aoFim?.(); }
      return;
    }
    if (!this.acabou && this.tf >= (FASES[this.i]?.[1] || 0)) {
      this.i++;
      this.tf = 0;
      const f = this.fase;
      if (f === "entra") Audio2.tone(330, 0.06, "square", 0.3);
      if (f === "troca") Audio2.tone(196, 0.1, "square", 0.35);
      if (f === "sai") {
        this.flash = 0.8;
        Audio2.tone(523, 0.08); Audio2.tone(659, 0.08); Audio2.tone(784, 0.14);
        for (let j = 0; j < 18; j++) {
          const a = Math.random() * Math.PI * 2, v = 30 + Math.random() * 60;
          this.estrelas.push({ x: CX, y: CHAO - 36, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 20, vida: 1 });
        }
      }
      if (f === "fim") {
        this.acabou = true;
        if (this.frase) this.dlg.say(this.frase, () => { this.saindo = true; this.fadeDir = 1; });
        else { this.saindo = true; this.fadeDir = 1; }
      }
    }
    // as roupas voando do armário enquanto ele troca
    if (this.fase === "troca" && Math.random() < dt * 9) {
      const lado = Math.random() < 0.5 ? -1 : 1;
      this.voando.push({ x: CX + lado * 10, y: CHAO - AH + 20, vx: lado * (40 + Math.random() * 50), vy: -60 - Math.random() * 40,
                         gira: (Math.random() - 0.5) * 10, ang: 0, cor: ROUPAS[Math.floor(Math.random() * ROUPAS.length)],
                         tipo: Math.floor(Math.random() * 3), vida: 1.6 });
      if (Math.random() < 0.5) Audio2.noise(0.04, 0.15);
    }
    for (const r of this.voando) { r.x += r.vx * dt; r.y += r.vy * dt; r.vy += 160 * dt; r.ang += r.gira * dt; r.vida -= dt; }
    this.voando = this.voando.filter((r) => r.vida > 0 && r.y < H + 10);
    if (this.fase === "sai" && Math.random() < dt * 10) {
      this.estrelas.push({ x: CX + (Math.random() - 0.5) * 70, y: CHAO - Math.random() * 70, vx: 0, vy: -10, vida: 1 });
    }
    for (const e of this.estrelas) { e.x += e.vx * dt; e.y += e.vy * dt; e.vida -= dt * 1.2; }
    this.estrelas = this.estrelas.filter((e) => e.vida > 0);
  }

  render(ctx) {
    this.quarto(ctx);
    const f = this.fase, k = this.k;
    // quanto as portas estão abertas (0 fechadas, 1 escancaradas)
    const aberta = f === "abre" ? k : f === "entra" ? (k < 0.6 ? 1 : 1 - (k - 0.6) / 0.4)
      : f === "troca" ? 0 : f === "sai" ? Math.min(1, k * 3) : 1;
    // o tremor do armário trocando
    const treme = f === "troca" ? Math.round(Math.sin(this.t * 40) * 2) : 0;
    const pula = f === "troca" ? Math.round(Math.abs(Math.sin(this.t * 9)) * 4) : 0;
    this.armario(ctx, CX + treme, CHAO - pula, aberta);
    // o bicho: na frente do armário, entrando, ou saindo com a roupa nova
    if (f === "abre") this.bicho(ctx, this.de, CX, CHAO + 8, 1, 1);
    else if (f === "entra") {
      const e = prende(k / 0.6);
      this.bicho(ctx, this.de, CX, CHAO + 8 - e * 14, 1 - e * 0.35, 1 - Math.max(0, (k - 0.5) / 0.2));
    } else if (f === "sai" || f === "fim") {
      const s = f === "fim" ? 1 : k;
      const salto = f === "sai" ? Math.round(Math.sin(Math.min(1, s * 1.4) * Math.PI) * 14) : 0;
      this.bicho(ctx, this.para, CX, CHAO + 8 - salto, 0.65 + 0.35 * Math.min(1, s * 2), 1);
    }
    for (const r of this.voando) this.peca(ctx, r);
    for (const e of this.estrelas) {
      ctx.globalAlpha = prende(e.vida);
      ctx.fillStyle = "#fff6c0";
      ctx.fillRect(Math.round(e.x) - 1, Math.round(e.y), 3, 1);
      ctx.fillRect(Math.round(e.x), Math.round(e.y) - 1, 1, 3);
    }
    ctx.globalAlpha = 1;
    if (this.flash > 0) fade(ctx, this.flash, "#ffffff");
    this.dlg.render(ctx);
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }

  bicho(ctx, especie, x, pe, escala, alfa) {
    const img = Assets.mon(especie, this.mon.seed);
    if (!img || alfa <= 0) return;
    const arte = Assets.comCor(img, { ...this.mon, species: especie });
    const lado = Math.round(64 * escala);
    ctx.fillStyle = "rgba(0,0,0,.25)";
    ctx.beginPath(); ctx.ellipse(x, pe, 18 * escala, 4 * escala, 0, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = alfa;
    ctx.drawImage(arte, Math.round(x - lado / 2), Math.round(pe - lado), lado, lado);
    ctx.globalAlpha = 1;
  }

  /** o quarto: parede de papel listrado, rodapé e o assoalho de tábuas */
  quarto(ctx) {
    ctx.fillStyle = "#e9d6c0";
    ctx.fillRect(0, 0, W, CHAO + 4);
    ctx.fillStyle = "#dcc4aa";
    for (let x = 0; x < W; x += 16) ctx.fillRect(x, 0, 8, CHAO + 4);
    ctx.fillStyle = "#8a5a34";
    ctx.fillRect(0, CHAO, W, 6);
    ctx.fillStyle = "#b98a52";
    ctx.fillRect(0, CHAO + 6, W, H - CHAO - 6);
    ctx.fillStyle = "#a07444";
    for (let y = CHAO + 12; y < H; y += 8) ctx.fillRect(0, y, W, 1);
  }

  /** o guarda-roupa: o corpo, o vão escuro de dentro e as duas portas */
  armario(ctx, cx, base, aberta) {
    const x0 = cx - AW / 2, y0 = base - AH;
    ctx.fillStyle = "#4a2c16";
    ctx.fillRect(x0 - 3, y0 - 6, AW + 6, 6);                  // a cornija
    ctx.fillStyle = "#6b3f1f";
    ctx.fillRect(x0, y0, AW, AH);
    ctx.fillStyle = "#2a1a10";
    ctx.fillRect(x0 + 4, y0 + 4, AW - 8, AH - 8);             // o vão de dentro
    // os cabides pendurados lá dentro
    ctx.fillStyle = "#a8b0bc";
    ctx.fillRect(x0 + 8, y0 + 10, AW - 16, 1);
    ROUPAS.slice(0, 4).forEach((c, j) => {
      ctx.fillStyle = c;
      ctx.fillRect(x0 + 12 + j * 13, y0 + 13, 9, 16);
    });
    // as portas: cada uma gira na dobradiça de fora — aberta, ela fica
    // estreita (é vista de lado) e um pouco pra fora do armário
    const larg = Math.max(3, Math.round((AW / 2) * (1 - 0.85 * aberta)));
    const fora = Math.round(6 * aberta);
    for (const lado of [-1, 1]) {
      const xx = lado < 0 ? x0 - fora : x0 + AW - larg + fora;
      ctx.fillStyle = "#8a5a2f";
      ctx.fillRect(xx, y0, larg, AH);
      if (larg > 8) {
        ctx.fillStyle = "#6b3f1f";                            // as almofadas da porta
        ctx.fillRect(xx + 3, y0 + 6, larg - 6, AH / 2 - 9);
        ctx.fillRect(xx + 3, y0 + AH / 2 + 3, larg - 6, AH / 2 - 9);
        ctx.fillStyle = "#f0c419";                            // a maçaneta, do lado do meio
        ctx.fillRect(lado < 0 ? xx + larg - 4 : xx + 2, y0 + AH / 2 - 2, 2, 4);
      }
    }
    ctx.fillStyle = "#4a2c16";
    ctx.fillRect(x0 - 3, base, AW + 6, 3);                    // o pé
  }

  /** uma peça voando: cabide, meia ou camiseta */
  peca(ctx, r) {
    ctx.save();
    ctx.translate(Math.round(r.x), Math.round(r.y));
    ctx.rotate(r.ang);
    ctx.globalAlpha = prende(r.vida);
    if (r.tipo === 0) {                                       // o cabide
      ctx.fillStyle = "#a8b0bc";
      ctx.fillRect(-6, 2, 12, 1); ctx.fillRect(-1, -3, 2, 5); ctx.fillRect(0, -4, 2, 1);
    } else if (r.tipo === 1) {                                // a meia
      ctx.fillStyle = r.cor;
      ctx.fillRect(-2, -5, 4, 8); ctx.fillRect(-2, 2, 7, 3);
    } else {                                                  // a camiseta
      ctx.fillStyle = r.cor;
      ctx.fillRect(-4, -4, 8, 9); ctx.fillRect(-7, -4, 3, 4); ctx.fillRect(4, -4, 3, 4);
    }
    ctx.restore();
  }
}
