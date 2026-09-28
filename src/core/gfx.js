// Helpers de desenho no estilo GBA.
import { drawText, wrapText, CHAR_W, LINE_H } from "./font.js";

export const PAL = {
  ink: "#2b2f38",
  ink2: "#5a6270",
  paper: "#f8f8f8",
  paperShade: "#d8dae2",
  frame: "#4c5468",
  frameHi: "#8f97ad",
  hpGreen: "#4cd06a", hpYellow: "#f0c419", hpRed: "#e0524a",
  glitch: "#b455ff",
  black: "#000000",
};

/** Caixa de janela estilo Pokemon. */
/** PAINEL EM BLOCO (a interface inteira no ISOMÉTRICO): enquanto ligado, cada
 *  painel ganha espessura — um tampo e uma lateral recuando pra cima e pra
 *  direita no mesmo 2:1 dos blocos do mapa. O texto continua reto: texto
 *  torto em 240x160 deixa de ser lido. Quem liga e desliga é o laço de
 *  desenho de src/main.js, em volta da cena. */
let emBloco = 0;
export function painelEmBloco(prof) { emBloco = prof || 0; }

export function panel(ctx, x, y, w, h, opts = {}) {
  const fill = opts.fill || PAL.paper;
  const edge = opts.edge || PAL.frame;
  const inner = opts.inner || PAL.frameHi;
  if (emBloco) {
    const D = emBloco, d = D / 2;
    const poli = (pts, cor) => {
      ctx.fillStyle = cor;
      ctx.beginPath();
      pts.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
      ctx.closePath(); ctx.fill();
    };
    const tampo = [[x + 1, y], [x + 1 + D, y - d], [x + w - 1 + D, y - d], [x + w - 1, y]];
    const lado = [[x + w, y + 1], [x + w + D, y + 1 - d], [x + w + D, y + h - 1 - d], [x + w, y + h - 1]];
    poli(tampo, inner); poli(tampo, "rgba(255,255,255,.18)");
    poli(lado, edge); poli(lado, "rgba(8,10,24,.35)");
  }
  ctx.fillStyle = edge;
  ctx.fillRect(x + 1, y, w - 2, h);
  ctx.fillRect(x, y + 1, w, h - 2);
  ctx.fillStyle = inner;
  ctx.fillRect(x + 2, y + 1, w - 4, h - 2);
  ctx.fillRect(x + 1, y + 2, w - 2, h - 4);
  ctx.fillStyle = fill;
  ctx.fillRect(x + 3, y + 2, w - 6, h - 4);
  ctx.fillRect(x + 2, y + 3, w - 4, h - 6);
}

export function bar(ctx, x, y, w, h, pct, color) {
  if (emBloco) {
    // a barra também é bloco: uma lateral fininha no mesmo ângulo
    ctx.fillStyle = "#3a3f4a";
    ctx.beginPath();
    ctx.moveTo(x + w + 1, y - 1); ctx.lineTo(x + w + 3, y - 2); ctx.lineTo(x + w + 3, y + h - 1); ctx.lineTo(x + w + 1, y + h + 1);
    ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle = PAL.ink;
  ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
  ctx.fillStyle = "#7c8496";
  ctx.fillRect(x, y, w, h);
  const fw = Math.max(0, Math.round(w * Math.max(0, Math.min(1, pct))));
  ctx.fillStyle = color;
  ctx.fillRect(x, y, fw, h);
  ctx.fillStyle = "rgba(255,255,255,.35)";
  ctx.fillRect(x, y, fw, 1);
}

export const hpColor = (pct) => (pct > 0.5 ? PAL.hpGreen : pct > 0.2 ? PAL.hpYellow : PAL.hpRed);

/** Cursor "seta" do menu (triangulo 4x7). */
export function cursor(ctx, x, y, color = PAL.ink) {
  const widths = [1, 2, 3, 4, 3, 2, 1];
  ctx.fillStyle = color;
  widths.forEach((w, i) => ctx.fillRect(x, y + 1 + i, w, 1));
}

export function menuBox(ctx, x, y, w, items, index, opts = {}) {
  const h = items.length * LINE_H + 8;
  panel(ctx, x, y, w, h, opts);
  items.forEach((it, i) => {
    const ty = y + 4 + i * LINE_H;
    drawText(ctx, it, x + 12, ty, PAL.ink);
    if (i === index) cursor(ctx, x + 5, ty);
  });
  return h;
}

/** Barras de sinal, estilo aparelho de telefone: `n` acesas de `max`.
 *  Vermelho no talo, amarelo no meio, verde de 3 pra cima. */
export function sinal(ctx, x, y, n, max = 4) {
  const cor = n <= 0 ? PAL.hpRed : n === 1 ? PAL.hpRed : n === 2 ? PAL.hpYellow : PAL.hpGreen;
  for (let i = 0; i < max; i++) {
    const h = 3 + i * 2;
    ctx.fillStyle = i < n ? cor : "#7c8496";
    ctx.fillRect(x + i * 4, y + (9 - h), 3, h);
  }
  if (n <= 0) {                     // um X em cima: sem sinal nenhum
    ctx.fillStyle = PAL.hpRed;
    for (let i = 0; i < 7; i++) {
      ctx.fillRect(x + 2 + i, y + 1 + i, 1, 1);
      ctx.fillRect(x + 8 - i, y + 1 + i, 1, 1);
    }
  }
}

/** Escurece/clareia a tela toda. */
export function fade(ctx, alpha, color = "#000") {
  if (alpha <= 0) return;
  ctx.fillStyle = color;
  ctx.globalAlpha = Math.min(1, alpha);
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.globalAlpha = 1;
}

export { drawText, wrapText, CHAR_W, LINE_H };

/** Dinheiro na tela. Até bilhões sai como número; de 1e21 pra cima é ZILHÃO —
 *  a unidade em que se vende o TROFÉU DE PALLET (src/data/leilao.js, VENDA). */
export function moeda(n) {
  n = Number(n) || 0;
  if (n >= 1e21) { const z = n / 1e21; return `$${z >= 10 ? Math.floor(z) : Math.round(z * 10) / 10} ZILH\u00d5ES`; }
  if (n >= 1e15) return `$${Math.floor(n / 1e12)} TRILH\u00d5ES`;
  return `$${Math.floor(n)}`;
}
