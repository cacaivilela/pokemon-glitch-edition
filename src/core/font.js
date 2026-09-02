// Fonte bitmap 5x7 (celula 6x8) desenhada na mao. Sem arquivos externos.
// Minusculas sao mapeadas para maiusculas (estetica Gen 1). Acentos sao
// derivados: o glifo base desce 1px e a marca e desenhada na linha 0.

import { traduz } from "./idioma.js";

const G = {
  A: [" ### ", "#   #", "#   #", "#####", "#   #", "#   #", "#   #"],
  B: ["#### ", "#   #", "#   #", "#### ", "#   #", "#   #", "#### "],
  C: [" ### ", "#   #", "#    ", "#    ", "#    ", "#   #", " ### "],
  D: ["#### ", "#   #", "#   #", "#   #", "#   #", "#   #", "#### "],
  E: ["#####", "#    ", "#    ", "#### ", "#    ", "#    ", "#####"],
  F: ["#####", "#    ", "#    ", "#### ", "#    ", "#    ", "#    "],
  G: [" ### ", "#   #", "#    ", "#  ##", "#   #", "#   #", " ### "],
  H: ["#   #", "#   #", "#   #", "#####", "#   #", "#   #", "#   #"],
  I: [" ### ", "  #  ", "  #  ", "  #  ", "  #  ", "  #  ", " ### "],
  J: ["   ##", "    #", "    #", "    #", "    #", "#   #", " ### "],
  K: ["#   #", "#  # ", "# #  ", "##   ", "# #  ", "#  # ", "#   #"],
  L: ["#    ", "#    ", "#    ", "#    ", "#    ", "#    ", "#####"],
  M: ["#   #", "## ##", "# # #", "#   #", "#   #", "#   #", "#   #"],
  N: ["#   #", "##  #", "# # #", "#  ##", "#   #", "#   #", "#   #"],
  O: [" ### ", "#   #", "#   #", "#   #", "#   #", "#   #", " ### "],
  P: ["#### ", "#   #", "#   #", "#### ", "#    ", "#    ", "#    "],
  Q: [" ### ", "#   #", "#   #", "#   #", "# # #", "#  # ", " ## #"],
  R: ["#### ", "#   #", "#   #", "#### ", "# #  ", "#  # ", "#   #"],
  S: [" ####", "#    ", "#    ", " ### ", "    #", "    #", "#### "],
  T: ["#####", "  #  ", "  #  ", "  #  ", "  #  ", "  #  ", "  #  "],
  U: ["#   #", "#   #", "#   #", "#   #", "#   #", "#   #", " ### "],
  V: ["#   #", "#   #", "#   #", "#   #", "#   #", " # # ", "  #  "],
  W: ["#   #", "#   #", "#   #", "# # #", "# # #", "## ##", "#   #"],
  X: ["#   #", "#   #", " # # ", "  #  ", " # # ", "#   #", "#   #"],
  Y: ["#   #", "#   #", " # # ", "  #  ", "  #  ", "  #  ", "  #  "],
  Z: ["#####", "    #", "   # ", "  #  ", " #   ", "#    ", "#####"],
  0: [" ### ", "#   #", "#  ##", "# # #", "##  #", "#   #", " ### "],
  1: ["  #  ", " ##  ", "  #  ", "  #  ", "  #  ", "  #  ", " ### "],
  2: [" ### ", "#   #", "    #", "   # ", "  #  ", " #   ", "#####"],
  3: ["#####", "   # ", "  #  ", "   # ", "    #", "#   #", " ### "],
  4: ["   # ", "  ## ", " # # ", "#  # ", "#####", "   # ", "   # "],
  5: ["#####", "#    ", "#### ", "    #", "    #", "#   #", " ### "],
  6: ["  ## ", " #   ", "#    ", "#### ", "#   #", "#   #", " ### "],
  7: ["#####", "    #", "   # ", "  #  ", " #   ", " #   ", " #   "],
  8: [" ### ", "#   #", "#   #", " ### ", "#   #", "#   #", " ### "],
  9: [" ### ", "#   #", "#   #", " ####", "    #", "   # ", " ##  "],
  " ": ["     ", "     ", "     ", "     ", "     ", "     ", "     "],
  ".": ["     ", "     ", "     ", "     ", "     ", "     ", "  #  "],
  ",": ["     ", "     ", "     ", "     ", "     ", "  #  ", " #   "],
  "!": ["  #  ", "  #  ", "  #  ", "  #  ", "  #  ", "     ", "  #  "],
  "?": [" ### ", "#   #", "    #", "   # ", "  #  ", "     ", "  #  "],
  "'": ["  #  ", "  #  ", "     ", "     ", "     ", "     ", "     "],
  '"': [" # # ", " # # ", "     ", "     ", "     ", "     ", "     "],
  "-": ["     ", "     ", "     ", " ### ", "     ", "     ", "     "],
  "_": ["     ", "     ", "     ", "     ", "     ", "     ", "#####"],
  "+": ["     ", "  #  ", "  #  ", "#####", "  #  ", "  #  ", "     "],
  "/": ["    #", "    #", "   # ", "  #  ", " #   ", "#    ", "#    "],
  ":": ["     ", "  #  ", "  #  ", "     ", "  #  ", "  #  ", "     "],
  ";": ["     ", "  #  ", "  #  ", "     ", "  #  ", "  #  ", " #   "],
  "(": ["   # ", "  #  ", " #   ", " #   ", " #   ", "  #  ", "   # "],
  ")": [" #   ", "  #  ", "   # ", "   # ", "   # ", "  #  ", " #   "],
  "[": ["  ###", "  #  ", "  #  ", "  #  ", "  #  ", "  #  ", "  ###"],
  "]": ["###  ", "  #  ", "  #  ", "  #  ", "  #  ", "  #  ", "###  "],
  "*": ["     ", "# # #", " ### ", "#####", " ### ", "# # #", "     "],
  "=": ["     ", "     ", "#####", "     ", "#####", "     ", "     "],
  "%": ["#   #", "   # ", "  #  ", "  #  ", " #   ", "#   #", "     "],
  "<": ["   # ", "  #  ", " #   ", "#    ", " #   ", "  #  ", "   # "],
  ">": [" #   ", "  #  ", "   # ", "    #", "   # ", "  #  ", " #   "],
  "♥": ["     ", " # # ", "#####", "#####", " ### ", "  #  ", "     "],
  "→": ["     ", "  #  ", "   # ", "#####", "   # ", "  #  ", "     "],
  // as duas setas de "tem mais coisa nesta lista" (a mochila da batalha)
  "▲": ["     ", "  #  ", "  #  ", " ### ", " ### ", "#####", "     "],
  "▼": ["     ", "#####", " ### ", " ### ", "  #  ", "  #  ", "     "],
  "█": ["#####", "#####", "#####", "#####", "#####", "#####", "#####"],
};

const MARKS = { acute: "   # ", grave: " #   ", circ: "  #  ", tilde: " # # " };
const ACCENTED = {
  "Á": ["A", "acute"], "À": ["A", "grave"], "Â": ["A", "circ"], "Ã": ["A", "tilde"],
  "É": ["E", "acute"], "Ê": ["E", "circ"], "Í": ["I", "acute"],
  "Ó": ["O", "acute"], "Ô": ["O", "circ"], "Õ": ["O", "tilde"],
  "Ú": ["U", "acute"], "Ç": ["C", "cedilla"],
};

export const CHAR_W = 6;
export const CHAR_H = 9;
export const LINE_H = 11;

function glyphRows(ch) {
  if (G[ch]) return G[ch];
  const acc = ACCENTED[ch];
  if (!acc) return null;
  const [base, mark] = acc;
  const rows = G[base];
  if (mark === "cedilla") return [...rows, "  #  "];
  return [MARKS[mark], ...rows];
}

const atlases = new Map();
const CHARS = [...Object.keys(G), ...Object.keys(ACCENTED)];

function atlasFor(color) {
  let a = atlases.get(color);
  if (a) return a;
  const cv = document.createElement("canvas");
  cv.width = CHARS.length * CHAR_W;
  cv.height = CHAR_H;
  const c = cv.getContext("2d");
  c.fillStyle = color;
  CHARS.forEach((ch, i) => {
    const rows = glyphRows(ch);
    if (!rows) return;
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        if (row[x] !== " ") c.fillRect(i * CHAR_W + x, y, 1, 1);
      }
    });
  });
  a = { cv, index: new Map(CHARS.map((ch, i) => [ch, i])) };
  atlases.set(color, a);
  return a;
}

/** Desenha texto (sempre em caixa alta). opts: { shadow, maxChars } */
export function drawText(ctx, text, x, y, color = "#20242c", opts = {}) {
  // o idioma entra aqui: o que não tiver tradução sai como foi escrito
  const s = traduz(text).toUpperCase();
  const n = opts.maxChars == null ? s.length : Math.min(s.length, Math.max(0, opts.maxChars));
  if (opts.shadow) blit(ctx, s, x + 1, y + 1, opts.shadow, n);
  blit(ctx, s, x, y, color, n);
  return x + n * CHAR_W;
}

function blit(ctx, s, x, y, color, n) {
  const a = atlasFor(color);
  for (let i = 0; i < n; i++) {
    const idx = a.index.get(s[i]);
    if (idx == null) continue;
    ctx.drawImage(a.cv, idx * CHAR_W, 0, CHAR_W, CHAR_H, x + i * CHAR_W, y, CHAR_W, CHAR_H);
  }
}

export const textWidth = (s) => String(s).length * CHAR_W;

/** Quebra texto em linhas de no maximo `cols` colunas. */
export function wrapText(text, cols) {
  const out = [];
  for (const para of String(text).split("\n")) {
    let line = "";
    for (const w of para.split(" ")) {
      if (!line.length) line = w;
      else if (line.length + 1 + w.length <= cols) line += " " + w;
      else { out.push(line); line = w; }
    }
    out.push(line);
  }
  return out;
}
