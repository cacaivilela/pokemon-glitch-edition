// A TIRINHA DO VÍTOR: um quadrinho do caderno dele de cada vez, numa folha de
// papel, com os Pokémon (o sprite de frente; `v` vira pra direita), a caixinha
// amarela da legenda e os balões de fala com o rabinho apontando pra quem fala.
// A passa pro próximo quadro, B fecha. As tirinhas estão em src/data/amigos.js
// (`TIRINHAS`); quem abre é a conversa com o VÍTOR (src/scenes/overworld.js).
// O site tirinhas.html desenha os mesmos quadros com `desenharQuadro`.
//
//   game.scenes.push(new TirinhaScene(), { tirinha, numero, onDone })
import { Assets } from "../core/assets.js";
import { trainerArt } from "../core/sprites.js";
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { drawText, wrapText, fade, CHAR_W, LINE_H } from "../core/gfx.js";
import { garantirEspecie, partes } from "../systems/fusao.js";
import { DB } from "../data/index.js";

const W = 240, H = 160;
export const QUADRO = { w: 224, h: 122 };          // o tamanho de um quadro
const QX = 8, QY = 16;                             // onde ele fica na folha da cena
const PAPEL = "#f4ecd6", TINTA = "#1c1a20", LEGENDA = "#ffe27a";

/** A arte de quem aparece no quadro: `@vitor`/`@andre` é o retrato de
 *  treinador; o resto, o sprite de frente da espécie (fusão montada na hora). */
function arte(id) {
  if (id.startsWith("@")) return trainerArt(id.slice(1));
  if (!DB.SPECIES[id] && partes(id)) garantirEspecie(id);
  return Assets.mon(id);
}

/** Já pede os sprites de uma tirinha inteira. */
export function pedirArtes(tirinha) {
  for (const q of tirinha.quadros) for (const [id] of q.bichos || []) arte(id);
}

/** UM QUADRO, com o canto de cima-esquerda em (x0, y0): o fundo branco, o
 *  chão, os bichos, o fx, a legenda e os balões. `letras` é quantas letras das
 *  falas já apareceram (Infinity = todas); `t` é o tempo no quadro (o ZZZ). */
export function desenharQuadro(ctx, q, x0, y0, { letras = Infinity, t = 0 } = {}) {
  const { w: QW, h: QH } = QUADRO;
  ctx.save();
  ctx.fillStyle = "#ffffff"; ctx.fillRect(x0, y0, QW, QH);
  ctx.beginPath(); ctx.rect(x0, y0, QW, QH); ctx.clip();
  // o chão: uma linha de nanquim e uns risquinhos
  const chao = y0 + QH - 8;
  ctx.fillStyle = TINTA; ctx.fillRect(x0, chao, QW, 1);
  for (let x = 6; x < QW; x += 23) ctx.fillRect(x0 + x, chao + 3, 6, 1);

  // os bichos, com os pés no chão
  const pos = (q.bichos || []).map(([id, bx, o = {}]) => {
    const s = o.s || 64, x = x0 + bx, y = chao - s + 2 + (o.dy || 0);
    const img = arte(id);
    if (img) {
      ctx.save();
      if (o.v) { ctx.translate(x + s, y); ctx.scale(-1, 1); ctx.drawImage(img, 0, 0, s, s); }
      else ctx.drawImage(img, x, y, s, s);
      ctx.restore();
    }
    return { cx: x + s / 2, topo: y + s * 0.2 };
  });

  // ZZZ subindo
  if (q.fx === "zzz") {
    for (let k = 0; k < 3; k++) {
      const f = (t * 0.6 + k / 3) % 1;
      drawText(ctx, "Z", x0 + QW - 40 + k * 8 + Math.sin(f * 6) * 3, chao - 20 - f * 60, TINTA);
    }
  }

  // a legenda, a caixinha amarela de cima
  let topo = y0 + 4;
  if (q.legenda) {
    const linhas = wrapText(q.legenda, 34);
    const w = Math.max(...linhas.map((l) => l.length)) * CHAR_W + 8, h = linhas.length * LINE_H + 4;
    ctx.fillStyle = TINTA; ctx.fillRect(x0 + 3, y0 + 3, w + 2, h + 2);
    ctx.fillStyle = LEGENDA; ctx.fillRect(x0 + 4, y0 + 4, w, h);
    linhas.forEach((l, k) => drawText(ctx, l, x0 + 8, y0 + 6 + k * LINE_H, TINTA));
    topo = y0 + h + 9;
  }

  // os balões, aparecendo letra por letra, na ordem das falas
  let resta = letras;
  const feitos = [];
  for (const [quem, fala] of q.falas || []) {
    if (resta <= 0) break;
    const texto = fala.slice(0, resta);
    resta -= fala.length;
    const p = pos[quem] || pos[0];
    if (!p) continue;
    const cols = (q.bichos || []).length >= 3 ? 12 : 16;
    const cheias = wrapText(fala, cols);            // o tamanho é o da fala inteira
    // as linhas são as da fala inteira, reveladas letra por letra: quebrar só
    // o pedaço já escrito põe palavra na linha errada e ela vaza do balão
    let falta = texto.length;
    const linhas = cheias.map((l) => { const parte = l.slice(0, Math.max(0, falta)); falta -= l.length + 1; return parte; });
    const w = Math.max(...cheias.map((l) => l.length)) * CHAR_W + 10, h = cheias.length * LINE_H + 5;
    const bx = Math.round(Math.max(x0 + 3, Math.min(x0 + QW - w - 3, p.cx - w / 2)));
    let by = topo;
    // um balão em cima do outro: desce o novo
    for (const f of feitos) {
      if (bx < f.x + f.w && bx + w > f.x && by < f.y + f.h + 3) by = f.y + f.h + 4;
    }
    feitos.push({ x: bx, y: by, w, h });
    balao(ctx, bx, by, w, h, p.cx, Math.max(by + h + 4, p.topo));
    linhas.forEach((l, k) => drawText(ctx, l, bx + 5, by + 3 + k * LINE_H, TINTA));
  }
  ctx.restore();
}

/** Quantas letras têm as falas de um quadro. */
export const letrasDo = (q) => (q.falas || []).reduce((n, [, f]) => n + f.length, 0);

export class TirinhaScene {
  enter({ tirinha, numero = 1, onDone } = {}) {
    this.tira = tirinha;
    this.numero = numero;
    this.onDone = onDone;
    this.i = 0;                  // o quadro de agora
    this.t = 0;                  // tempo no quadro (o fx e a fala aparecendo)
    this.fadeA = 1; this.fadeDir = -1;
    pedirArtes(tirinha);
    Audio2.select();
  }

  update(dt) {
    this.t += dt;
    if (this.fadeDir) {
      this.fadeA = Math.max(0, Math.min(1, this.fadeA + this.fadeDir * dt * 4));
      if (this.fadeDir < 0 && this.fadeA <= 0) this.fadeDir = 0;
      if (this.fadeDir > 0 && this.fadeA >= 1) {
        this.game.scenes.pop();
        this.onDone?.();
      }
      return;
    }
    if (Input.consume("b")) { Audio2.cancel(); this.fadeDir = 1; return; }
    if (Input.consume("a")) {
      // a primeira apertada só termina de escrever as falas
      if (this.letras() < letrasDo(this.quadro)) { this.t = 99; return; }
      if (this.i < this.tira.quadros.length - 1) { this.i++; this.t = 0; Audio2.blip(); }
      else { Audio2.select(); this.fadeDir = 1; }
    }
  }

  get quadro() { return this.tira.quadros[this.i]; }
  letras() { return Math.floor(Math.max(0, this.t - 0.25) * 45); }

  render(ctx) {
    const q = this.quadro;
    ctx.fillStyle = PAPEL; ctx.fillRect(0, 0, W, H);
    // as linhas do caderno, bem clarinhas
    ctx.fillStyle = "#e2d8bc";
    for (let y = 12; y < H; y += 10) ctx.fillRect(0, y, W, 1);
    ctx.fillStyle = "#e8a8a0"; ctx.fillRect(4, 0, 1, H);
    drawText(ctx, `TIRINHA DO VÍTOR ${this.numero}: ${this.tira.titulo}`.slice(0, 39), 6, 3, TINTA);

    // o quadro (treme no fx "treme")
    const treme = q.fx === "treme" && this.t < 0.8 ? Math.round(Math.sin(this.t * 60) * 2) : 0;
    ctx.fillStyle = TINTA; ctx.fillRect(QX + treme - 2, QY - 2, QUADRO.w + 4, QUADRO.h + 4);
    desenharQuadro(ctx, q, QX + treme, QY, { letras: this.letras(), t: this.t });

    // o clarão
    if (q.fx === "flash" && this.t < 0.35) fade(ctx, 1 - this.t / 0.35, "#ffffff");

    // embaixo: as bolinhas dos quadros e o que apertar
    const n = this.tira.quadros.length;
    for (let k = 0; k < n; k++) {
      ctx.fillStyle = k === this.i ? TINTA : "#b8ae98";
      ctx.fillRect(W / 2 - n * 5 + k * 10, H - 14, 6, 6);
    }
    const fim = this.i === n - 1;
    if (Math.floor(this.t * 2) % 2 === 0 || this.letras() < letrasDo(q)) {
      drawText(ctx, fim ? "A: FIM" : "A: →", W - 52, H - 16, TINTA);
    }
    drawText(ctx, "B: FECHAR", 6, H - 16, "#8a8070");
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }
}

/** O balão de fala: retângulo de cantos cortados com contorno de nanquim e o
 *  rabinho descendo até a cabeça de quem fala (o ponto `alvoX`, `alvoY`). */
function balao(ctx, x, y, w, h, alvoX, alvoY) {
  const meio = Math.max(x + 6, Math.min(x + w - 6, alvoX));
  const pontaY = Math.min(alvoY, y + h + 14);
  const rabo = (d, cor) => {
    ctx.fillStyle = cor; ctx.beginPath();
    ctx.moveTo(meio - 4 + d, y + h - 1); ctx.lineTo(meio + 4 - d, y + h - 1);
    ctx.lineTo(alvoX + (alvoX > meio ? -1 : 1) * d, pontaY - d); ctx.closePath(); ctx.fill();
  };
  rabo(-1, TINTA);
  ctx.fillStyle = TINTA;
  ctx.fillRect(x + 1, y - 1, w - 2, h + 2); ctx.fillRect(x - 1, y + 1, w + 2, h - 2); ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x + 1, y, w - 2, h); ctx.fillRect(x, y + 1, w, h - 2);
  rabo(1, "#ffffff");
}
