// A CUTSCENE DO OVO CHOCANDO: quando um ovo racha pela mochila (o MYSTERY EGG
// e o ovo da creche, src/scenes/overworld.js). Uns 11 segundos, sempre retos
// (o isométrico não entra aqui), em cima da música da evolução tocada num
// xilofone a 70 bpm (src/data/music.js, `nascimento`):
//
//   BALANÇA  o ovo no ninho, de noite, balançando cada vez mais forte
//   RACHA    a rachadura corre pela casca e a luz vaza pelas frestas
//   EXPLODE  um clarão, e o ovo se desfaz em PIXELS que voam pra todo lado
//   MONTA    os pixels param no ar e, devagar, vão cada um pro seu lugar —
//            e trocam a cor da casca pela cor do bicho no caminho
//   PRONTO   o Pokémon inteiro, um pulinho e estrelinhas
//
// O bicho já foi criado antes de a cena abrir; aqui é só o filme. As frases
// (`frase`, uma ou várias) fecham no A.
import { Assets } from "../core/assets.js";
import { Audio2 } from "../core/audio.js";
import { DB } from "../data/index.js";
import { Dialogue } from "../systems/dialogue.js";
import { Glitch } from "../systems/glitchfx.js";
import { fade } from "../core/gfx.js";

const W = 240, H = 160;
const CX = 120, CHAO = 112;
const L = 56;                               // o tamanho do bicho montado
const OW = 26, OH = 32;                     // o ovo
const FASES = [["balanca", 2.6], ["racha", 1.6], ["explode", 1.1], ["monta", 5.2], ["pronto", 1.0]];
const prende = (t) => Math.max(0, Math.min(1, t));
const suave = (t) => t * t * (3 - 2 * t);

/** o ovo em pixel art: casca creme, pintas verdes e o contorno escuro */
function desenharOvo() {
  const cv = document.createElement("canvas");
  cv.width = OW; cv.height = OH;
  const c = cv.getContext("2d");
  const cx = OW / 2 - 0.5;
  for (let y = 0; y < OH; y++) {
    // mais estreito em cima, mais gordo embaixo
    const v = (y - OH * 0.58) / (y < OH * 0.58 ? OH * 0.58 : OH * 0.42);
    const meia = (OW / 2) * Math.sqrt(Math.max(0, 1 - v * v));
    for (let x = 0; x < OW; x++) {
      const d = Math.abs(x - cx);
      if (d > meia) continue;
      const borda = d > meia - 1.2 || y === 0 || y === OH - 1;
      c.fillStyle = borda ? "#5c4a32" : x < cx - meia * 0.35 && y < OH * 0.5 ? "#fffbea" : "#f3e8c8";
      c.fillRect(x, y, 1, 1);
    }
  }
  c.fillStyle = "#6fbf5a";                  // as pintas
  for (const [x, y, r] of [[8, 9, 3], [17, 14, 3], [10, 22, 4], [19, 25, 2], [15, 5, 2]]) {
    c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
  }
  // as pintas não podem passar do contorno: repinta a borda por cima
  const dados = c.getImageData(0, 0, OW, OH);
  for (let y = 0; y < OH; y++) {
    const v = (y - OH * 0.58) / (y < OH * 0.58 ? OH * 0.58 : OH * 0.42);
    const meia = (OW / 2) * Math.sqrt(Math.max(0, 1 - v * v));
    for (let x = 0; x < OW; x++) {
      const i = (y * OW + x) * 4, d = Math.abs(x - cx);
      if (d > meia) dados.data[i + 3] = 0;
      else if (d > meia - 1.2 || y === 0 || y === OH - 1) Object.assign(dados.data, { [i]: 0x5c, [i + 1]: 0x4a, [i + 2]: 0x32, [i + 3]: 255 });
    }
  }
  c.putImageData(dados, 0, 0);
  return cv;
}

/** os pixels acesos de uma imagem: [{ x, y, r, g, b }] */
function pixelsDe(img, w, h) {
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  const c = cv.getContext("2d");
  c.imageSmoothingEnabled = false;
  c.drawImage(img, 0, 0, w, h);
  const d = c.getImageData(0, 0, w, h).data, out = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (d[i + 3] > 128) out.push({ x, y, r: d[i], g: d[i + 1], b: d[i + 2] });
    }
  }
  return out;
}

export class NascerScene {
  /** args: { mon, frase?, aoFim? } — `frase` pode ser uma lista */
  enter(args = {}) {
    this.mon = args.mon;
    this.frase = args.frase || "";
    this.aoFim = args.aoFim || null;
    Assets.mon(this.mon.species, this.mon.seed);
    this.ovo = desenharOvo();
    this.casca = pixelsDe(this.ovo, OW, OH);
    this.dlg = new Dialogue();
    this.t = 0;
    this.i = 0;
    this.tf = 0;
    this.flash = 0;
    this.fadeA = 1;
    this.fadeDir = -1;
    this.saindo = false;
    this.acabou = false;
    this.pixels = null;                     // nascem no EXPLODE
    this.estrelas = [];
    this.racha = 0;
    if (DB.MUSIC?.nascimento) Audio2.playMusic("nascimento", DB.MUSIC.nascimento);
    else Audio2.stopLoop();
  }

  get fase() { return FASES[this.i]?.[0] || "fim"; }
  get k() { return prende(this.tf / (FASES[this.i]?.[1] || 1)); }

  /** o bicho já colorido (shiny e luminoso inclusos), ou null se ainda carrega */
  arte() {
    const img = Assets.mon(this.mon.species, this.mon.seed);
    return img ? Assets.comCor(img, this.mon) : null;
  }

  /** O OVO VIRA PIXEL: cada pixel do bicho sai de um pixel da casca (sorteado
   *  — o bicho tem mais pixel que o ovo) e voa pra fora. O destino e a cor
   *  final já ficam guardados, pro MONTA. */
  explodir() {
    const arte = this.arte();
    const alvo = arte ? pixelsDe(arte, L, L) : [];
    const x0 = CX - OW / 2, y0 = CHAO - OH, ax = CX - L / 2, ay = CHAO - L + 4;
    const lista = alvo.length ? alvo : this.casca.map((p) => ({ ...p, x: p.x + (L - OW) / 2, y: p.y + (L - OH) }));
    this.pixels = lista.map((p) => {
      const s = this.casca[Math.floor(Math.random() * this.casca.length)];
      const sx = x0 + s.x, sy = y0 + s.y;
      const ang = Math.atan2(sy - (y0 + OH / 2), sx - CX) + (Math.random() - 0.5) * 0.9;
      const vel = 40 + Math.random() * 110;
      return {
        x: sx, y: sy, vx: Math.cos(ang) * vel, vy: Math.sin(ang) * vel - 30,
        de: [s.r, s.g, s.b], para: [p.r, p.g, p.b],
        ax: ax + p.x, ay: ay + p.y,
        // de baixo pra cima, com um pouco de sorte: o bicho vai subindo
        espera: (1 - p.y / L) * 0.45 + Math.random() * 0.2,
      };
    });
  }

  update(dt) {
    this.t += dt;
    this.tf += dt;
    if (this.fadeDir) {
      this.fadeA = prende(this.fadeA + this.fadeDir * dt * 2);
      if (this.fadeDir < 0 && this.fadeA <= 0) this.fadeDir = 0;
    }
    this.flash = Math.max(0, this.flash - dt * 1.6);
    this.dlg.update(dt);
    if (this.saindo) {
      if (this.fadeA >= 1) { this.game.scenes.pop(); this.aoFim?.(); }
      return;
    }
    const f0 = this.fase;
    // o ovo balançando: um toc a cada vai e volta
    if (f0 === "balanca" && Math.floor(this.tf * 2.4) !== Math.floor((this.tf - dt) * 2.4)) {
      Audio2.tone(700 + this.tf * 60, 0.04, "triangle", 0.25);
    }
    if (f0 === "racha") {
      const antes = this.racha;
      this.racha = this.k;
      if (Math.floor(this.racha * 5) !== Math.floor(antes * 5)) Audio2.noise(0.05, 0.25);
    }
    if (!this.acabou && this.tf >= (FASES[this.i]?.[1] || 0)) {
      this.i++;
      this.tf = 0;
      const f = this.fase;
      if (f === "explode") {
        this.flash = 1;
        this.explodir();
        Audio2.noise(0.35, 0.45);
        Audio2.tone(523, 0.1, "triangle", 0.35); Audio2.tone(1046, 0.18, "triangle", 0.3);
      }
      if (f === "monta" && this.pixels) {
        for (const p of this.pixels) { p.sx = p.x; p.sy = p.y; }      // de onde cada um parte
      }
      if (f === "pronto") {
        this.flash = 0.5;
        // forma rara (como era antes da cena): a tela treme na medida do que nasceu
        const brilho = this.mon.shiny || this.mon.luminoso || this.mon.alfa;
        if (brilho) { Glitch.hit(this.mon.luminoso ? 2.4 : 1.6); Audio2.glitch(); }
        for (let j = 0; j < (brilho ? 40 : 18); j++) {
          const a = Math.random() * Math.PI * 2, v = 30 + Math.random() * 60;
          this.estrelas.push({ x: CX, y: CHAO - L / 2, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 20, vida: 1 });
        }
      }
      if (f === "fim") {
        this.acabou = true;
        if (this.frase) this.dlg.say(this.frase, () => { this.saindo = true; this.fadeDir = 1; });
        else { this.saindo = true; this.fadeDir = 1; }
      }
    }
    // os pixels: voam freando no EXPLODE, e no MONTA vão pro lugar
    if (this.pixels && this.fase === "explode") {
      const freio = Math.pow(0.12, dt);
      for (const p of this.pixels) { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= freio; p.vy *= freio; }
    }
    if (this.pixels && this.fase === "monta") {
      for (const p of this.pixels) {
        const e = suave(prende((this.k - p.espera) / 0.35));
        p.e = e;
        p.x = p.sx + (p.ax - p.sx) * e;
        p.y = p.sy + (p.ay - p.sy) * e - Math.sin(e * Math.PI) * 6;   // um arquinho no caminho
      }
      if (Math.random() < dt * 5) Audio2.tone(1300 + Math.random() * 900, 0.03, "sine", 0.12);
    }
    if (this.fase === "pronto" && Math.random() < dt * 8) {
      this.estrelas.push({ x: CX + (Math.random() - 0.5) * 70, y: CHAO - Math.random() * 60, vx: 0, vy: -10, vida: 1 });
    }
    for (const e of this.estrelas) { e.x += e.vx * dt; e.y += e.vy * dt; e.vida -= dt * 1.2; }
    this.estrelas = this.estrelas.filter((e) => e.vida > 0);
  }

  render(ctx) {
    this.fundo(ctx);
    const f = this.fase, k = this.k;
    if (f === "balanca" || f === "racha") this.desenharOvo(ctx, f, k);
    else if ((f === "explode" || f === "monta") && this.pixels) this.desenharPixels(ctx, f);
    else if (f === "pronto" || f === "fim") {
      const salto = f === "pronto" ? Math.round(Math.sin(Math.min(1, k * 1.6) * Math.PI) * 10) : 0;
      const arte = this.arte();
      if (arte) {
        this.sombra(ctx, 18);
        ctx.drawImage(arte, CX - L / 2, CHAO - L + 4 - salto, L, L);
      }
    }
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

  /** a noite: céu azul fundo, estrelas piscando devagar e o ninho de palha */
  fundo(ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#0b1030"); g.addColorStop(1, "#2a2f5c");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    for (let j = 0; j < 28; j++) {
      const x = (j * 97) % W, y = (j * 53) % 90;
      ctx.globalAlpha = 0.3 + 0.5 * Math.abs(Math.sin(this.t * 0.8 + j));
      ctx.fillStyle = "#dfe6ff";
      ctx.fillRect(x, y, 1, 1);
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#1c2244";
    ctx.fillRect(0, CHAO + 6, W, H - CHAO - 6);
    // o ninho: duas camadas de palha
    ctx.fillStyle = "#7a5a2c";
    ctx.beginPath(); ctx.ellipse(CX, CHAO + 4, 30, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#a07a3c";
    for (let j = -26; j <= 26; j += 4) ctx.fillRect(CX + j, CHAO + 1 + (Math.abs(j) % 3), 3, 1);
  }

  sombra(ctx, rx) {
    ctx.fillStyle = "rgba(0,0,0,.3)";
    ctx.beginPath(); ctx.ellipse(CX, CHAO + 4, rx, 4, 0, 0, Math.PI * 2); ctx.fill();
  }

  /** o ovo balançando (cada vez mais) e, no RACHA, a fresta com luz */
  desenharOvo(ctx, f, k) {
    const forca = f === "balanca" ? 0.08 + k * 0.22 : 0.3;
    const ang = Math.sin(this.t * (f === "balanca" ? 7 : 16)) * forca * (f === "balanca" && k < 0.15 ? 0 : 1);
    ctx.save();
    ctx.translate(CX, CHAO);
    ctx.rotate(ang);
    ctx.drawImage(this.ovo, -OW / 2, -OH);
    if (f === "racha") {
      // a rachadura em zigue-zague, crescendo da esquerda pra direita
      const pts = [[-12, -17], [-8, -13], [-4, -18], [0, -12], [4, -17], [8, -12], [12, -16]];
      const ate = 1 + Math.floor(k * (pts.length - 1));
      ctx.strokeStyle = "#3a2a18";
      ctx.lineWidth = 1;
      ctx.beginPath();
      pts.slice(0, ate + 1).forEach(([x, y], j) => (j ? ctx.lineTo(x + 0.5, y + 0.5) : ctx.moveTo(x + 0.5, y + 0.5)));
      ctx.stroke();
      // a luz vazando pelas frestas
      ctx.globalAlpha = 0.4 + 0.4 * Math.sin(this.t * 20);
      ctx.fillStyle = "#fff6c0";
      for (const [x, y] of pts.slice(0, ate + 1)) ctx.fillRect(x - 1, y - 3 - Math.round(k * 4), 2, 3 + Math.round(k * 4));
    }
    ctx.restore();
    if (f === "racha") {
      ctx.globalAlpha = 0.15 + 0.25 * k;
      ctx.fillStyle = "#fff6c0";
      ctx.beginPath(); ctx.ellipse(CX, CHAO - OH / 2, 24 + k * 14, 26 + k * 14, 0, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  /** os pixels soltos: a cor vai da casca pra do bicho conforme ele chega */
  desenharPixels(ctx, f) {
    if (f === "monta") this.sombra(ctx, 6 + 12 * this.k);
    for (const p of this.pixels) {
      const e = f === "monta" ? (p.e || 0) : 0;
      const r = Math.round(p.de[0] + (p.para[0] - p.de[0]) * e);
      const g = Math.round(p.de[1] + (p.para[1] - p.de[1]) * e);
      const b = Math.round(p.de[2] + (p.para[2] - p.de[2]) * e);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), 1, 1);
    }
  }
}
