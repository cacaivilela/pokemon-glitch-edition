// Todos os graficos sao gerados em runtime (nenhum arquivo de imagem).
// Trocar por PNGs depois e so mudar Assets.tiles / Assets.mons.
import { makeRng } from "./rng.js";
import { DB } from "../data/index.js";
import { SpriteStore, pedirMon } from "./sprites.js";
import { url as arquivo } from "./base.js";

export const TILE = 16;

export function makeCanvas(w, h) {
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  const ctx = cv.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  return { cv, ctx };
}

/** Converte linhas de texto + paleta em canvas. Espaco/'.' = transparente. */
export function spriteFromRows(rows, palette) {
  const h = rows.length, w = rows[0].length;
  const { cv, ctx } = makeCanvas(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ch = rows[y][x];
      const col = palette[ch];
      if (!col) continue;
      ctx.fillStyle = col;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return cv;
}

export function flipH(cv) {
  const { cv: out, ctx } = makeCanvas(cv.width, cv.height);
  ctx.translate(cv.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(cv, 0, 0);
  return out;
}

// ---------------------------------------------------------------- tiles
function tileCanvas(draw) {
  const { cv, ctx } = makeCanvas(TILE, TILE);
  draw(ctx, makeRng(9137));
  return cv;
}
const px = (ctx, c, x, y, w = 1, h = 1) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };

function buildTiles() {
  const t = {};

  t["."] = tileCanvas((c, r) => {
    px(c, "#63ac4e", 0, 0, 16, 16);
    for (let i = 0; i < 26; i++) px(c, r.chance(0.5) ? "#5a9e46" : "#6cb757", r.int(16), r.int(16));
    for (let i = 0; i < 5; i++) { const x = r.int(15), y = r.int(15); px(c, "#4f9040", x, y); px(c, "#4f9040", x + 1, y - 1); }
  });

  t[","] = tileCanvas((c, r) => {
    px(c, "#5aa246", 0, 0, 16, 16);
    for (let i = 0; i < 20; i++) px(c, "#4c8f3c", r.int(16), r.int(16));
    for (let bx = 0; bx < 16; bx += 4) {
      for (let by = 2; by < 16; by += 6) {
        px(c, "#3f7d32", bx + 1, by + 2, 2, 4);
        px(c, "#4f9740", bx, by + 3, 1, 3);
        px(c, "#68b953", bx + 2, by, 1, 3);
      }
    }
  });

  t["P"] = tileCanvas((c, r) => {
    px(c, "#d9c69c", 0, 0, 16, 16);
    for (let i = 0; i < 30; i++) px(c, r.chance(0.5) ? "#cbb88c" : "#e3d3ad", r.int(16), r.int(16));
  });

  t["#"] = tileCanvas((c, r) => {
    px(c, "#63ac4e", 0, 0, 16, 16);
    px(c, "#6b4423", 6, 10, 4, 6);
    px(c, "#8a5a2f", 6, 10, 1, 6);
    px(c, "#1f5c2a", 2, 1, 12, 10);
    px(c, "#1f5c2a", 1, 3, 14, 6);
    px(c, "#2c7c39", 3, 2, 9, 7);
    px(c, "#3f9c4a", 4, 2, 5, 3);
    for (let i = 0; i < 16; i++) px(c, "#175023", 2 + r.int(12), 1 + r.int(9));
  });

  t["~"] = tileCanvas((c, r) => {
    px(c, "#3f79d0", 0, 0, 16, 16);
    for (let i = 0; i < 24; i++) px(c, "#4f8ce0", r.int(16), r.int(16));
    px(c, "#93c4f5", 2, 4, 5, 1); px(c, "#93c4f5", 9, 9, 4, 1); px(c, "#93c4f5", 5, 13, 3, 1);
  });
  t["≈"] = tileCanvas((c, r) => {
    px(c, "#3f79d0", 0, 0, 16, 16);
    for (let i = 0; i < 24; i++) px(c, "#4f8ce0", r.int(16), r.int(16));
    px(c, "#93c4f5", 6, 2, 5, 1); px(c, "#93c4f5", 1, 8, 4, 1); px(c, "#93c4f5", 10, 12, 4, 1);
  });

  t["W"] = tileCanvas((c) => {
    px(c, "#e6d7b8", 0, 0, 16, 16);
    px(c, "#cbb894", 0, 7, 16, 1); px(c, "#cbb894", 0, 15, 16, 1);
    px(c, "#cbb894", 5, 0, 1, 8); px(c, "#cbb894", 11, 8, 1, 8);
  });
  t["R"] = tileCanvas((c) => {
    px(c, "#c9503f", 0, 0, 16, 16);
    px(c, "#a83c2e", 0, 5, 16, 2); px(c, "#a83c2e", 0, 12, 16, 2);
    px(c, "#e2705c", 0, 0, 16, 2);
  });
  t["D"] = tileCanvas((c) => {
    px(c, "#e6d7b8", 0, 0, 16, 16);
    px(c, "#6b4423", 2, 1, 12, 15);
    px(c, "#8a5a2f", 3, 2, 10, 13);
    px(c, "#ffd166", 11, 8, 2, 2);
  });
  t["S"] = tileCanvas((c) => {
    px(c, "#63ac4e", 0, 0, 16, 16);
    px(c, "#6b4423", 7, 10, 2, 5);
    px(c, "#a2703f", 2, 3, 12, 8);
    px(c, "#c8925a", 3, 4, 10, 6);
    px(c, "#6b4423", 4, 6, 8, 1); px(c, "#6b4423", 4, 8, 6, 1);
  });
  t["="] = tileCanvas((c) => {
    px(c, "#63ac4e", 0, 0, 16, 16);
    px(c, "#a2703f", 0, 6, 16, 2); px(c, "#a2703f", 0, 10, 16, 2);
    px(c, "#8a5a2f", 3, 4, 2, 10); px(c, "#8a5a2f", 11, 4, 2, 10);
  });
  t["F"] = tileCanvas((c, r) => {
    px(c, "#63ac4e", 0, 0, 16, 16);
    for (let i = 0; i < 20; i++) px(c, "#5a9e46", r.int(16), r.int(16));
    const cols = ["#f2545b", "#ffd166", "#f28fd0"];
    for (let i = 0; i < 4; i++) {
      const x = 2 + r.int(11), y = 2 + r.int(11), col = r.pick(cols);
      px(c, col, x, y - 1); px(c, col, x - 1, y); px(c, col, x + 1, y); px(c, col, x, y + 1);
      px(c, "#fff6c8", x, y);
    }
  });
  t["L"] = tileCanvas((c) => {
    px(c, "#e8ddc8", 0, 0, 16, 16);
    px(c, "#d5c8ae", 0, 0, 8, 8); px(c, "#d5c8ae", 8, 8, 8, 8);
  });
  t["w"] = tileCanvas((c) => {
    px(c, "#b98f66", 0, 0, 16, 16);
    px(c, "#a67d57", 0, 5, 16, 1); px(c, "#a67d57", 0, 11, 16, 1);
    px(c, "#caa17a", 0, 0, 16, 1);
  });
  t["T"] = tileCanvas((c) => {
    px(c, "#e8ddc8", 0, 0, 16, 16);
    px(c, "#8c6239", 0, 2, 16, 12);
    px(c, "#a9784b", 0, 2, 16, 2);
    px(c, "#6f4c2b", 0, 12, 16, 2);
  });
  t["B"] = tileCanvas((c) => {
    px(c, "#e8ddc8", 0, 0, 16, 16);
    px(c, "#f2f2f2", 1, 0, 14, 16);
    px(c, "#e0524a", 1, 0, 14, 6);
    px(c, "#c8c8d0", 1, 6, 14, 1);
    px(c, "#b9b9c4", 1, 15, 14, 1);
  });
  t["C"] = tileCanvas((c) => { // computador / PC
    px(c, "#e8ddc8", 0, 0, 16, 16);
    px(c, "#5a6270", 2, 2, 12, 11);
    px(c, "#7ad6f5", 3, 3, 10, 7);
    px(c, "#2b2f38", 3, 11, 10, 2);
  });
  t["X"] = tileCanvas((c, r) => { // tile corrompido
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      px(c, r.pick(["#b455ff", "#000000", "#00ffcc", "#ff0066", "#ffffff"]), x, y);
    }
  });
  t["N"] = tileCanvas((c) => { // telhado do centro pokemon
    px(c, "#e05a4a", 0, 0, 16, 16);
    px(c, "#c33f32", 0, 5, 16, 2); px(c, "#c33f32", 0, 12, 16, 2);
    px(c, "#f4867a", 0, 0, 16, 2);
  });
  t["M"] = tileCanvas((c) => { // telhado da loja
    px(c, "#4a7ad0", 0, 0, 16, 16);
    px(c, "#3560ac", 0, 5, 16, 2); px(c, "#3560ac", 0, 12, 16, 2);
    px(c, "#7aa4e8", 0, 0, 16, 2);
  });
  t["l"] = tileCanvas((c, r) => { // barranco: so da pra descer
    px(c, "#63ac4e", 0, 0, 16, 6);
    for (let i = 0; i < 8; i++) px(c, "#5a9e46", r.int(16), r.int(6));
    px(c, "#b99a63", 0, 6, 16, 6);
    px(c, "#8a6f42", 0, 6, 16, 2);
    px(c, "#d9c69c", 0, 12, 16, 4);
    for (let i = 0; i < 10; i++) px(c, "#cbb88c", r.int(16), 12 + r.int(4));
  });
  t["t"] = tileCanvas((c) => { // televisao
    px(c, "#e8ddc8", 0, 0, 16, 16);
    px(c, "#3a3f4a", 1, 3, 14, 10);
    px(c, "#8fd6f0", 3, 5, 10, 6);
    px(c, "#2b2f38", 5, 13, 6, 2);
  });
  t["p"] = tileCanvas((c, r) => { // vaso de planta
    px(c, "#e8ddc8", 0, 0, 16, 16);
    px(c, "#a2703f", 5, 11, 6, 4);
    px(c, "#2f8c46", 3, 3, 10, 8);
    px(c, "#3fae5a", 5, 2, 6, 6);
    for (let i = 0; i < 6; i++) px(c, "#1f5c2a", 4 + r.int(8), 3 + r.int(7));
  });
  t[">"] = tileCanvas((c) => { // escada
    px(c, "#c8a882", 0, 0, 16, 16);
    for (let y = 0; y < 16; y += 4) { px(c, "#a67d57", 0, y, 16, 1); px(c, "#e0c9a8", 0, y + 1, 16, 2); }
  });
  return t;
}

// ------------------------------------------------------------- sprites
const PC = {
  k: "#22283a", c: "#e0524a", C: "#a8382f", w: "#f4f4f4", s: "#f0b48a",
  h: "#5a3c1f", b: "#3f6fd8", B: "#2c4ea0", p: "#454b59", o: "#22242c", e: "#ffffff",
};

const HERO = {
  down: [
    "................",
    ".....kkkkkk.....",
    "....kCcccccK....",
    "...kccccccccc...",
    "...kwwwwwwwwk...",
    "....ksssssk.....",
    "....ksksksk.....",
    "....kssssssk....",
    "....kkbbbbkk....",
    "...kbbbbbbbbk...",
    "...sbbbbbbbbs...",
    "...kbbbbbbbbk...",
    "....kppppppk....",
    "....kppkkppk....",
    "....kookkook....",
    ".....kk..kk.....",
  ],
  up: [
    "................",
    ".....kkkkkk.....",
    "....kCcccccK....",
    "...kccccccccc...",
    "...kcccccccck...",
    "....khhhhhhk....",
    "....khhhhhhk....",
    "....khhhhhhk....",
    "....kkbbbbkk....",
    "...kbbbbbbbbk...",
    "...sbbbbbbbbs...",
    "...kbbbbbbbbk...",
    "....kppppppk....",
    "....kppkkppk....",
    "....kookkook....",
    ".....kk..kk.....",
  ],
  side: [
    "................",
    "....kkkkkk......",
    "...kCccccck.....",
    "..kccccccccc....",
    "..kwwwwwwwck....",
    "....ksssshk.....",
    "....ksksshk.....",
    "....ksssshk.....",
    "....kkbbbkk.....",
    "...kbbbbbbk.....",
    "...kbbbbbbs.....",
    "...kbbbbbbk.....",
    "....kppppk......",
    "....kppppk......",
    "....koookk......",
    ".....kk.........",
  ],
};

/** frames de caminhada: desloca as pernas (linhas 12..15). */
function legFrame(rows, dx) {
  return rows.map((row, y) => {
    if (y < 12 || dx === 0) return row;
    const shifted = dx > 0 ? ".".repeat(dx) + row.slice(0, 16 - dx) : row.slice(-dx) + ".".repeat(-dx);
    return shifted;
  });
}

function buildActor(pal) {
  const mk = (rows) => spriteFromRows(rows, pal);
  const dirs = {};
  // HERO.side foi desenhado olhando pra ESQUERDA; a direita e o espelho dele
  for (const [dir, rows] of Object.entries({ down: HERO.down, up: HERO.up, left: HERO.side })) {
    dirs[dir] = [mk(rows), mk(legFrame(rows, 1)), mk(rows), mk(legFrame(rows, -1))];
  }
  dirs.right = dirs.left.map(flipH);
  return dirs;
}

// paletas de NPC (mesma base do heroi, cores trocadas)
const ACTOR_PALETTES = {
  hero:   PC,
  prof:   { ...PC, c: "#f2f2f2", C: "#cfd3dc", w: "#e6e8ee", b: "#f2f2f2", B: "#cfd3dc", h: "#9aa0aa", s: "#e8b48a" },
  mae:    { ...PC, c: "#8a5a2f", C: "#6b4423", w: "#8a5a2f", b: "#e07ab0", B: "#b8558c", h: "#8a5a2f" },
  garoto: { ...PC, c: "#3fae5a", C: "#2c8442", w: "#f4f4f4", b: "#ffd166", B: "#d1a01f", h: "#3f2d1b" },
  garota: { ...PC, c: "#f28fd0", C: "#c96aa8", w: "#f4f4f4", b: "#f2f2f2", B: "#c8c8d4", h: "#c96aa8" },
  velho:  { ...PC, c: "#c8c8d0", C: "#9aa0aa", w: "#e8e8ee", b: "#6b7f8f", B: "#4d5d6b", h: "#d8d8e0" },
  enfermeira: { ...PC, c: "#f2a6c0", C: "#d1789c", w: "#f4f4f4", b: "#f4f4f4", B: "#dcdce4", h: "#f2a6c0" },
  balconista: { ...PC, c: "#4a7ad0", C: "#3560ac", w: "#f4f4f4", b: "#6f8fd0", B: "#4a6fae", h: "#3f2d1b" },
  rival:  { ...PC, c: "#8b5cf6", C: "#5b32b0", w: "#e8e8ee", b: "#2b2f38", B: "#1a1d24", h: "#8b5cf6" },
};

// ------------------------------------------------------------- monstros
const MP = {
  k: "#1c2030", o: "#ff8c1a", O: "#d1610a", y: "#ffd166", r: "#e0524a",
  b: "#4aa3e0", B: "#2f6fa8", g: "#5ac46a", G: "#2f8c46", p: "#8b5cf6",
  P: "#5b32b0", w: "#ffffff", e: "#101018", t: "#f7f7ff", n: "#8a94a6",
};

const MONS = {
  lagarto: [
    "......kkkk......",
    ".....koooook....",
    "....kooOooook...",
    "....koewoewok...",
    "....koooooook...",
    ".....kokkkok....",
    "....koooooook...",
    "...kooOoooOook..",
    "...koooooooook..",
    "...kooooooookr..",
    "...kkoookkookry.",
    "..ko..ko..korryy",
    "..kk..kk..krry..",
    "..........kry...",
    "...........k....",
    "................",
  ],
  tartaruga: [
    "......kkkk......",
    ".....kbbbbk.....",
    "....kbbbbbbk....",
    "...kbewbbwebk...",
    "...kbbbbbbbbk...",
    "...kbbkkkkbbk...",
    "....kbbbbbbk....",
    "...kBBBBBBBBk...",
    "..kBttttttttBk..",
    "..kBtttttttBk...",
    "..kBBttttBBk....",
    "..kBBBBBBBBk....",
    "...kbbkkbbk.....",
    "...kk....kk.....",
    "................",
    "................",
  ],
  quadrupede: [
    "..k..........k..",
    "..kk........kk..",
    "..kgk......kgk..",
    "..kggkkkkkkggk..",
    "..kgggggggggg k.",
    ".kggeggggggegg k",
    ".kgggggggggggg k",
    ".kggggkkkkggggk.",
    "..kgggggggggg k.",
    "..kGGggggggGGk..",
    "...kGGGGGGGGk...",
    "...kGgkkkkgGk...",
    "...kk......kk...",
    "................",
    "................",
    "................",
  ],
  roedor: [
    "...k........k...",
    "..kyk......kyk..",
    "..kyyk....kyyk..",
    "...kyykkkkyyk...",
    "...kyyyyyyyyk...",
    "..kyyeyyyyeyyk..",
    "..kyyyyyyyyyyk..",
    "..kyrykkkkyryk..",
    "..kyyyyyyyyyyk..",
    "...kyyyyyyyyk...",
    "...kyykkkkyyk...",
    "..kyk..yy..kyk..",
    "..kk...yyy..kk..",
    ".........yy.....",
    "................",
    "................",
  ],
  passaro: [
    "................",
    "......kkkk......",
    ".....kpppppk....",
    "....kppepppk....",
    "....kppppppkyy..",
    "....kpppppkyy...",
    "...kPppppppk....",
    "..kPPpppppPPk...",
    ".kPPPpppppPPPk..",
    ".kPPPPpppPPPPk..",
    "..kPPPpppPPPk...",
    "...kppppppppk...",
    "....kkyykyyk....",
    ".....ky...yk....",
    "................",
    "................",
  ],
  larva: [
    "................",
    "................",
    "......kkkk......",
    ".....kggggk.....",
    "....kgeggegk....",
    "....kggggggk....",
    "....kgkkkkgk....",
    "...kGggggggGk...",
    "..kGGgggggGGk...",
    "..kGgggggggGk...",
    "...kGGgggGGk....",
    "....kGGGGGk.....",
    ".....kkkkk......",
    "................",
    "................",
    "................",
  ],
};

/** NULLMON: sprite corrompido, redesenhado a cada chamada. */
export function nullmonSprite(seed = 1) {
  const r = makeRng(seed);
  const { cv, ctx } = makeCanvas(16, 16);
  const pal = ["#b455ff", "#00ffcc", "#ff0066", "#ffffff", "#101018", "#101018"];
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      if (r.chance(0.32)) continue;
      ctx.fillStyle = r.pick(pal);
      ctx.fillRect(x, y, 1, 1);
    }
  }
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = r.pick(pal);
    ctx.fillRect(0, r.int(16), 16, 1);
  }
  return cv;
}

/** MISSINGNO. megado. A pedra não encaixou nele: sobrescreveu. É o mesmo bloco,
 *  só que cheio até a borda, com as colunas de 255 passando por cima, as linhas
 *  zeradas abertas no meio e as fatias rasgando pro lado. */
export function megaNullmonSprite(seed = 1) {
  const r = makeRng(seed);
  const { cv, ctx } = makeCanvas(16, 16);
  const pal = ["#b455ff", "#b455ff", "#7a1fff", "#00ffcc", "#ff0066",
               "#101018", "#101018", "#ffffff", "#ff9500"];
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      if (r.chance(0.06)) continue;          // quase sem buraco: o dado transbordou
      ctx.fillStyle = r.pick(pal);
      ctx.fillRect(x, y, 1, 1);
    }
  }
  for (let i = 0; i < 3; i++) {              // ATK, SPA e SPE em 255: três colunas cheias
    ctx.fillStyle = i === 1 ? "#ffffff" : r.pick(pal);
    ctx.fillRect(r.int(15), 0, 1 + r.int(2), 16);
  }
  for (let i = 0; i < 2; i++) {              // DEF e SPD em 0: duas linhas sem nada
    ctx.fillStyle = "#101018";
    ctx.fillRect(0, r.int(16), 16, 1);
  }
  for (let i = 0; i < 8; i++) {              // fatias arrancadas pro lado
    const y = r.int(16), hh = 1 + r.int(3);
    ctx.drawImage(cv, 0, y, 16, hh, r.int(11) - 5, y, 16, hh);
  }
  return cv;
}

// Os bichos de dado solto são desenhados na hora, e o desenho é pedido a cada
// quadro. Guardamos os quadros por semente: sem isso cada frame criaria um
// canvas novo (e os caches de shiny/silhueta, que são por imagem, cresceriam
// sem parar). O MISSINGNO. normal tem um quadro só — ele é sempre igual;
// o megado tem seis e fica trocando, porque esse não para quieto.
const MEGA_QUADROS = 6;
const glitchCache = new Map();
function glitchSprite(mega, seed) {
  const chave = `${mega ? "m" : "n"}|${seed}`;
  let quadros = glitchCache.get(chave);
  if (!quadros) {
    if (glitchCache.size > 48) glitchCache.clear();   // sessão longa: recomeça do zero
    quadros = mega
      ? Array.from({ length: MEGA_QUADROS }, (_, i) => megaNullmonSprite(seed * 31 + i * 977 + 1))
      : [nullmonSprite(seed)];
    glitchCache.set(chave, quadros);
  }
  if (quadros.length === 1) return quadros[0];
  return quadros[((performance.now() / 110) | 0) % quadros.length];
}

// recolore mantendo o sombreado (blend "color" + mascara pelo alfa original)
const tintCache = new Map();
export function tinted(src, color) {
  const key = `${src.__id || (src.__id = Math.random())}|${color}`;
  if (tintCache.has(key)) return tintCache.get(key);
  const { cv, ctx } = makeCanvas(src.width, src.height);
  ctx.drawImage(src, 0, 0);
  ctx.globalCompositeOperation = "color";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, src.width, src.height);
  ctx.globalCompositeOperation = "destination-in";
  ctx.drawImage(src, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  tintCache.set(key, cv);
  return cv;
}

const flipCache = new Map();
function flipCached(cv) {
  if (flipCache.has(cv)) return flipCache.get(cv);
  const out = flipH(cv);
  flipCache.set(cv, out);
  return out;
}

function buildRustle() {
  // 3 quadros do tufo de grama que balança quando o jogador pisa
  const mk = (rows) => spriteFromRows(rows, { g: "#7bc85a", G: "#4a9c3a", d: "#2f7a2c" });
  return [
    mk([
      "................", "................", "................", "................",
      "................", "................", "................", "................",
      "................", "................", "....g......g....", "...gGg....gGg...",
      "..gGdGg..gGdGg..", "..GddG....GddG..", "................", "................",
    ]),
    mk([
      "................", "................", "................", "................",
      "................", "................", "................", "..g..........g..",
      ".gGg........gGg.", "gGdGg......gGdGg", "GddG........GddG", "..d..........d..",
      "................", "................", "................", "................",
    ]),
    mk([
      "................", "................", "................", "................",
      "................", "................", "................", "................",
      "................", "...g........g...", "..gGg......gGg..", "..GdG......GdG..",
      "...d........d...", "................", "................", "................",
    ]),
  ];
}

// ------------------------------------------------- fusão (decodificador de genoma)
// A fusão não tem arquivo de sprite e nunca vai ter: são 255x256 combinações.
// O desenho é montado com os dois sprites que já existem — o corpo inteiro,
// recolorido com a cor da cabeça, e a cabeça por cima até a linha do pescoço
// (`corte`, em src/data/fusao.js). Serve tanto pra arte provisória (16x16)
// quanto pros PNGs do FireRed (64x64): o tamanho sai do maior dos dois.
const fusaoCache = new Map();
const corCache = new Map();

const idImg = (img) => img.__id || (img.__id = Math.random().toString(36).slice(2));

/** A cor média dos pixels opacos: é ela que a cabeça empresta pro corpo. */
function corMedia(img) {
  const chave = idImg(img);
  if (corCache.has(chave)) return corCache.get(chave);
  const { ctx } = makeCanvas(16, 16);
  ctx.drawImage(img, 0, 0, 16, 16);
  let r = 0, g = 0, b = 0, n = 0;
  try {
    const d = ctx.getImageData(0, 0, 16, 16).data;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 128) continue;
      r += d[i]; g += d[i + 1]; b += d[i + 2]; n++;
    }
  } catch { n = 0; }                     // canvas sujo (não deve acontecer): sem tinta
  const cor = n ? `rgb(${Math.round(r / n)},${Math.round(g / n)},${Math.round(b / n)})` : null;
  corCache.set(chave, cor);
  return cor;
}

/** Recolore mantendo o sombreado, com força regulável (o `tinted` é o mesmo
 *  com força 1). Sem cor ou sem força, devolve o original. */
function pintado(src, cor, forca) {
  if (!cor || forca <= 0) return src;
  const { cv, ctx } = makeCanvas(src.width, src.height);
  ctx.drawImage(src, 0, 0);
  ctx.globalAlpha = Math.min(1, forca);
  ctx.globalCompositeOperation = "color";
  ctx.fillStyle = cor;
  ctx.fillRect(0, 0, src.width, src.height);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "destination-in";
  ctx.drawImage(src, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  return cv;
}

// O desenho que o JOGADOR fez na oficina (256x256, guardado no save como PNG).
// Ele entra reduzido pra 64x64 — o tamanho que a batalha usa — e a redução é
// feita com média, não com amostragem: um pixel do sprite é a média de 16 do
// desenho, senão o traço fino some.
const desenhos = new Map();
function desenhoDoJogador(url) {
  if (!desenhos.has(url)) {
    desenhos.set(url, null);
    const img = new Image();
    // O desenho pode vir de dois jeitos: um arquivo (assets/fusoes/...), que é
    // como as fichas publicadas guardam hoje, ou embutido em data: — que é como
    // ele chega de uma ficha importada de fora. Arquivo é resolvido pela raiz
    // do jogo, senão quebra na versão publicada, que mora numa subpasta.
    const endereco = url.startsWith("data:") ? url : arquivo(url);
    img.onload = () => {
      const lado = DB.FUSAO?.editor?.tamanho || 64;
      const { cv, ctx } = makeCanvas(lado, lado);
      // desenho antigo, feito quando a tela era maior: reduz com média, senão
      // o traço fino sumia. No tamanho certo, entra pixel por pixel.
      const encolhe = img.width > lado;
      ctx.imageSmoothingEnabled = encolhe;
      if (encolhe) ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, lado, lado);
      desenhos.set(url, cv);
    };
    img.onerror = () => console.warn("[fusão] o desenho gravado não abriu:", endereco);
    img.src = endereco;
  }
  return desenhos.get(url);
}

/** Esquece o desenho reduzido de uma ficha (o editor acabou de mudar ela). */
export function esquecerDesenho(url) { desenhos.delete(url); }

function comporFusao(sp, lado, seed) {
  const frente = lado !== "costas";
  const cab = frente ? Assets.mon(sp.fusao.cabeca, seed) : Assets.monBack(sp.fusao.cabeca, seed);
  const cor = frente ? Assets.mon(sp.fusao.corpo, seed) : Assets.monBack(sp.fusao.corpo, seed);
  const F = DB.FUSAO || {};
  const k = F.corte ?? 0.46;
  // sempre 64x64: é o tamanho do sprite do jogo, e é o tamanho em que o
  // jogador desenha na oficina. Arte provisória de 16x16 sobe pra cá, e o
  // pescoço da fusão cai no mesmo lugar em todo mundo.
  const S = DB.FUSAO?.editor?.tamanho || 64;
  const { cv, ctx } = makeCanvas(S, S);
  ctx.drawImage(pintado(cor, corMedia(cab), F.tintaCorpo ?? 0.5), 0, 0, S, S);
  const alturaCab = Math.max(1, Math.round(cab.height * k));
  const pescoco = Math.max(1, Math.round(S * k));
  ctx.drawImage(cab, 0, 0, cab.width, alturaCab, 0, 0, S, pescoco);
  // a costura: uma sombra de um pixel onde os dois se encontram. "source-atop"
  // pinta só onde já tem bicho — sem isso vira uma faixa atravessando o vazio.
  ctx.globalCompositeOperation = "source-atop";
  ctx.fillStyle = "rgba(0,0,0,.22)";
  ctx.fillRect(0, pescoco - 1, S, 1);
  ctx.globalCompositeOperation = "source-over";
  return cv;
}

/** O sprite da fusão, guardado por par de imagens de origem: quando o PNG
 *  externo de um dos lados termina de carregar, a chave muda e ele remonta. */
function fusaoSprite(sp, lado, seed) {
  // ficha do jogador com desenho: é ele, e mais nada. Enquanto o PNG não abre,
  // a montagem automática segura o lugar — nada fica preto.
  if (sp.spriteCustom) {
    const img = desenhoDoJogador(sp.spriteCustom);
    if (img) return img;
  }
  const frente = lado !== "costas";
  const a = frente ? Assets.mon(sp.fusao.cabeca, seed) : Assets.monBack(sp.fusao.cabeca, seed);
  const b = frente ? Assets.mon(sp.fusao.corpo, seed) : Assets.monBack(sp.fusao.corpo, seed);
  const chave = `${sp.id}|${lado}|${idImg(a)}|${idImg(b)}`;
  let img = fusaoCache.get(chave);
  if (!img) {
    if (fusaoCache.size > 240) fusaoCache.clear();      // sessão longa: recomeça
    img = comporFusao(sp, lado, seed);
    fusaoCache.set(chave, img);
  }
  return img;
}

export const Assets = {
  tiles: null, actors: null, shapes: null, ball: null, rustle: null, rocha: null, bloco: null,
  init() {
    this.tiles = buildTiles();
    this.actors = Object.fromEntries(Object.entries(ACTOR_PALETTES).map(([k, p]) => [k, buildActor(p)]));
    this.shapes = Object.fromEntries(Object.entries(MONS).map(([k, rows]) => [k, spriteFromRows(rows, MP)]));
    this.ball = spriteFromRows([
      "..kkkk..",
      ".krrrrk.",
      "krrrrrrk",
      "kkkkkkkk",
      "kwwkkwwk",
      "kwwkkwwk",
      ".kwwwwk.",
      "..kkkk..",
    ], { k: "#1c2030", r: "#e0524a", w: "#f4f4f4" });
    this.rocha = spriteFromRows([
      "..cccc..",
      ".cddddc.",
      "cdddeddc",
      "cddeeddc",
      "cdeddddc",
      "cddddddc",
      ".cddddc.",
      "..cccc..",
    ], { c: "#5a5348", d: "#8a8070", e: "#403a33" });
    this.bloco = spriteFromRows([
      "kkkkkkkk",
      "kaaaaaak",
      "kabbbbak",
      "kabkkbak",
      "kabkkbak",
      "kabbbbak",
      "kaaaaaak",
      "kkkkkkkk",
    ], { k: "#4a4033", a: "#a3937a", b: "#7d6e58" });
    this.rustle = buildRustle();
    return this;
  },

  /** tile: PNG externo se existir, senao o procedural */
  tile(ch) {
    return SpriteStore.tiles[ch] || this.tiles[ch] || this.tiles["."];
  },

  /** personagem do mapa: folha externa se existir, senao a arte embutida */
  actor(kind) {
    return SpriteStore.overworld[kind] || this.actors[kind] || this.actors.hero;
  },

  /** versao shiny: mesma arte com as cores giradas */
  shiny(img) {
    if (!img) return img;
    if (!this._shiny) this._shiny = new Map();
    const hit = this._shiny.get(img);
    if (hit) return hit;
    const { cv, ctx } = makeCanvas(img.width, img.height);
    ctx.filter = "hue-rotate(150deg) saturate(1.6) brightness(1.1)";
    ctx.drawImage(img, 0, 0);
    ctx.filter = "none";
    this._shiny.set(img, cv);
    return cv;
  },

  /** silhueta chapada do sprite (a troca de formas da evolucao) */
  silhueta(img) {
    if (!img) return img;
    if (!this._sil) this._sil = new Map();
    const hit = this._sil.get(img);
    if (hit) return hit;
    const { cv, ctx } = makeCanvas(img.width, img.height);
    ctx.drawImage(img, 0, 0);
    ctx.globalCompositeOperation = "source-in";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.globalCompositeOperation = "source-over";
    this._sil.set(img, cv);
    return cv;
  },

  /** sprite de frente do Pokemon (a fusao e montada na hora com os dois) */
  mon(id, seed) {
    const sp = DB.SPECIES[id];
    if (sp?.fusao) return fusaoSprite(sp, "frente", seed);
    const ext = SpriteStore.pokemon[id];
    if (ext) return ext;
    // ainda não foi pedido: pede agora e mostra a arte provisória enquanto vem
    if (sp) pedirMon(sp.id || id, sp.spriteDex || sp.dex);
    return this.placeholder(id, seed);
  },

  /** sprite de costas (do jogador na batalha) */
  monBack(id, seed) {
    const sp = DB.SPECIES[id];
    if (sp?.fusao) return fusaoSprite(sp, "costas", seed);
    if (sp && !SpriteStore.pokemonBack[id]) pedirMon(sp.id || id, sp.spriteDex || sp.dex);
    // nunca espelha: sprite espelhado deixa o jogo com cara de bug
    return SpriteStore.pokemonBack[id] || this.mon(id, seed);
  },

  /** A 011GLITCHDIMENSION110 desenhada em runtime a partir do terreno. */
  /** BIRTH ISLAND desenhada em runtime: mar, praia e o monumento de pedra. */
  islandArt(geo, seed = 386) {
    const r = makeRng(seed);
    const { w: tw, h: th, tags } = geo;
    const { cv, ctx } = makeCanvas(tw * 16, th * 16);
    const MAR = ["#1c4f8a", "#20599a", "#17457a", "#2a6bb0"];
    const AREIA = ["#e8d9a0", "#dfcf92", "#f0e3b2", "#d6c485"];
    const PEDRA = ["#6f6a63", "#837d74", "#5c5850"];
    for (let y = 0; y < th; y++) {
      for (let x = 0; x < tw; x++) {
        const tag = tags[y * tw + x];
        const pal = tag === "3" ? MAR : AREIA;
        for (let py = 0; py < 16; py += 4) {
          for (let px2 = 0; px2 < 16; px2 += 4) {
            ctx.fillStyle = r.pick(pal);
            ctx.fillRect(x * 16 + px2, y * 16 + py, 4, 4);
          }
        }
        if (tag === "3" && r.chance(0.12)) {          // espuma na água
          ctx.fillStyle = "#bfe4ff";
          ctx.fillRect(x * 16 + r.int(10), y * 16 + r.int(12), 6, 2);
        }
        if (tag === "1") {                            // monumento
          ctx.fillStyle = r.pick(PEDRA);
          ctx.fillRect(x * 16, y * 16, 16, 16);
          ctx.fillStyle = "#4a4640";
          ctx.fillRect(x * 16, y * 16 + 13, 16, 3);
          ctx.fillStyle = "#9a938a";
          ctx.fillRect(x * 16 + 2, y * 16 + 2, 12, 2);
        }
      }
    }
    return cv;
  },

  /** A TEMPESTADE QUE NÃO ACABA, desenhada em runtime: mar escuro com crista de
   *  espuma, chuva atravessando a tela na diagonal e o recife de pedra molhada.
   *  O mapa não vem do FireRed — ele é gerado em src/data/index.js. */
  stormArt(geo, seed = 6411) {
    const r = makeRng(seed);
    const { w: tw, h: th, tags } = geo;
    const { cv, ctx } = makeCanvas(tw * 16, th * 16);
    const MAR = ["#0b1a2e", "#12263f", "#081422", "#183351"];
    const PEDRA = ["#2f3138", "#3d4049", "#24262b", "#4a4e59"];
    for (let y = 0; y < th; y++) {
      for (let x = 0; x < tw; x++) {
        const pedra = tags[y * tw + x] === "0";
        const pal = pedra ? PEDRA : MAR;
        for (let py = 0; py < 16; py += 4) {
          for (let px2 = 0; px2 < 16; px2 += 4) {
            ctx.fillStyle = r.pick(pal);
            ctx.fillRect(x * 16 + px2, y * 16 + py, 4, 4);
          }
        }
        if (!pedra && r.chance(0.3)) {          // crista de onda
          ctx.fillStyle = r.chance(0.5) ? "#8fb6d8" : "#5b7fa8";
          ctx.fillRect(x * 16 + r.int(8), y * 16 + r.int(14), 6 + r.int(5), 1);
        }
        if (pedra && r.chance(0.35)) {          // poça em cima da pedra
          ctx.fillStyle = "#1b2b3d";
          ctx.fillRect(x * 16 + r.int(10), y * 16 + r.int(10), 4 + r.int(4), 2);
        }
      }
    }
    // a chuva: riscos na diagonal, atravessando o mapa inteiro
    for (let i = 0; i < cv.width * 0.9; i++) {
      const x = r.int(cv.width + 40) - 20, y = r.int(cv.height);
      const n = 5 + r.int(7);
      ctx.fillStyle = r.chance(0.25) ? "#cfe4f5" : "#7f9dbc";
      for (let k = 0; k < n; k++) ctx.fillRect(x + k, y + k * 2, 1, 1);
    }
    return cv;
  },

  glitchRoom(geo, seed = 4242) {
    const r = makeRng(seed);
    const { w: tw, h: th, tags, terrain } = geo;
    const { cv, ctx } = makeCanvas(tw * 16, th * 16);
    const PAL_T = {
      a: ["#140a24", "#1a0d2a", "#2a1040", "#0d0616"],       // vazio / ar
      t: ["#2a1a3a", "#3a2450", "#241436", "#452a66"],       // terra corrompida
      g: ["#0d2440", "#123a5c", "#0a1c33", "#18507a"],       // água quebrada
    };
    const NEON = ["#b455ff", "#00ffcc", "#ff0066", "#ffffff"];
    for (let y = 0; y < th; y++) {
      for (let x = 0; x < tw; x++) {
        const i = y * tw + x;
        const kind = terrain ? terrain[i] : "t";
        const tag = tags[i];
        const pal = PAL_T[kind] || PAL_T.t;
        for (let py = 0; py < 16; py += 4) {
          for (let px2 = 0; px2 < 16; px2 += 4) {
            ctx.fillStyle = r.chance(0.02) ? r.pick(NEON) : r.pick(pal);
            ctx.fillRect(x * 16 + px2, y * 16 + py, 4, 4);
          }
        }
        if (tag === "1") {           // bloco sólido: núcleo escuro com borda neon
          ctx.fillStyle = "#0a0410";
          ctx.fillRect(x * 16 + 1, y * 16 + 1, 14, 14);
          ctx.strokeStyle = r.pick(NEON);
          ctx.lineWidth = 2;
          ctx.strokeRect(x * 16 + 2, y * 16 + 2, 12, 12);
        } else if (tag === "2") {    // 101MATO011: tufo alto e brilhante
          ctx.fillStyle = "#06251f";
          ctx.fillRect(x * 16, y * 16 + 6, 16, 10);
          for (let k = 0; k < 12; k++) {
            const bx = x * 16 + r.int(15);
            const top = y * 16 + 2 + r.int(8);
            ctx.fillStyle = r.pick(["#00ffcc", "#25e0a8", "#0fa87c"]);
            ctx.fillRect(bx, top, 1, y * 16 + 16 - top);
          }
        }
      }
    }
    for (let i = 0; i < 60; i++) {   // fatias deslocadas
      const y = r.int(cv.height), hh = 1 + r.int(3);
      ctx.drawImage(cv, 0, y, cv.width, hh, r.int(14) - 7, y, cv.width, hh);
    }
    return cv;
  },

  /** arte provisoria: silhueta original tintada com a cor do tipo */
  placeholder(id, seed) {
    const ph = DB.SPECIES[id]?.placeholder;
    if (ph?.shape === "megaglitch") return glitchSprite(true, seed || 7);
    if (!ph || ph.shape === "glitch") return glitchSprite(false, seed || 7);
    const base = this.shapes[ph.shape] || this.shapes.roedor;
    return ph.tint ? tinted(base, ph.tint) : base;
  },
};
