// Todos os graficos sao gerados em runtime (nenhum arquivo de imagem).
// Trocar por PNGs depois e so mudar Assets.tiles / Assets.mons.
import { makeRng } from "./rng.js";
import { DB } from "../data/index.js";
import { SpriteStore, pedirMon, pedirMonShiny, pedirMonUrl } from "./sprites.js";
import { url as arquivo } from "./base.js";
import { corpoBombado, CORPO } from "./diglettbombado.js";

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

/** "#de8b4a" -> [222, 139, 74] */
const corDeHex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

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
    // a ARVOREZINHA que o CORTE derruba (a do FireRed, e as de Braglitch)
    this.arvorezinha = spriteFromRows([
      "..kkkk..",
      ".kgGGgk.",
      "kgGGgGgk",
      "kGgGGggk",
      ".kgggGk.",
      "..kttk..",
      "...tt...",
      "..kttk..",
    ], { k: "#1f4a26", g: "#3f8f3a", G: "#62b64f", t: "#7a5330" });
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
  actor(kind, deQuemJoga = true) {
    // "hero" é QUEM JOGA: a menina usa a folha da heroína (main.js define isso).
    // O outro jogador online passa `false`: o "hero" dele é dele, não o seu.
    if (kind === "hero" && deQuemJoga) {
      const j = this.jogador?.();
      if (j && SpriteStore.overworld[j]) kind = j;
    }
    return SpriteStore.overworld[kind] || this.actors[kind] || this.actors.hero;
  },

  /** A COR SHINY INVENTADA: a mesma arte com o matiz girado.
   *
   *  É a RESERVA, não o caminho principal — quem manda é `monShiny()`, que usa
   *  a arte shiny de verdade quando o PNG existe. Este filtro fica pras
   *  espécies que não têm shiny oficial pra ter: as fusões da oficina, o
   *  MISSINGNO, o DECAMARK, as formas glitch.
   *
   *  E ele tem um limite conhecido: girar o matiz não mexe em pixel cinza, então
   *  em bicho preto-e-branco o shiny sai igual ao comum. Foi por isso que as 89
   *  espécies mais acinzentadas ganharam PNG shiny próprio — dá pra medir
   *  quanto cada uma muda em dev/shinycheck.html. */
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

  /** versao LUMINOSA: a arte acesa, com o brilho vazando pela borda.
   *
   *  Nao e uma troca de cor como o shiny, de proposito. E 1 em 9999: quando um
   *  aparece no mato, num sprite de 32 pixels, do outro lado da tela, tem que
   *  dar pra ver de longe que aquele ali nao e igual aos outros — senao a cor
   *  mais rara do jogo passa despercebida, que e o mesmo que nao existir.
   *
   *  O halo e a silhueta borrada POR BAIXO: ela so aparece onde o bicho nao
   *  cobre, entao o desenho continua sendo o desenho, com luz em volta. */
  luminoso(img) {
    if (!img) return img;
    if (!this._lum) this._lum = new Map();
    const hit = this._lum.get(img);
    if (hit) return hit;
    const { cv, ctx } = makeCanvas(img.width, img.height);
    ctx.globalAlpha = 0.85;
    ctx.filter = "blur(2px)";
    ctx.drawImage(this.silhueta(img), 0, 0);
    ctx.globalAlpha = 1;
    ctx.filter = "brightness(1.45) saturate(0.55)";
    ctx.drawImage(img, 0, 0);
    ctx.filter = "none";
    this._lum.set(img, cv);
    return cv;
  },

  /** O SPINDA: as quatro manchas carimbadas pelo valor de personalidade.
   *
   *  É a conta do jogo original (DrawSpindaSpots, no decomp), e está explicada
   *  em src/data/spinda.js: 32 bits lidos de 8 em 8, um naco por mancha, nibble
   *  baixo = X e nibble alto = Y, cada um entrando como `âncora + nibble - 8`.
   *  O pixel só é pintado se o que está embaixo for uma das três cores claras
   *  do corpo — é isso que faz a mancha parar na borda da orelha em vez de
   *  vazar pro contorno, pro olho ou pras patas.
   *
   *  `pid` é o `seed` do Pokémon, que é o valor de personalidade dele. */
  spinda(pid, shiny = false) {
    const base = shiny ? SpriteStore.pokemonShiny.spinda : SpriteStore.pokemon.spinda;
    const manchas = DB.SPINDA_MANCHAS;
    if (!base || !manchas) return null;
    // as âncoras são coordenadas do desenho de 64x64 do decomp; noutro tamanho
    // elas não querem dizer nada, então o desenho fica como veio
    if (base.width !== 64 || base.height !== 64) return base;

    const chave = `${pid >>> 0}|${shiny ? 1 : 0}`;
    if (!this._spinda) this._spinda = new Map();
    const hit = this._spinda.get(chave);
    if (hit) return hit;

    const { cv, ctx } = makeCanvas(64, 64);
    ctx.drawImage(base, 0, 0);
    const dados = ctx.getImageData(0, 0, 64, 64), px = dados.data;
    const corpo = DB.SPINDA_CORPO.map(corDeHex);
    const tinta = DB.SPINDA_MANCHA[shiny ? "shiny" : "comum"].map(corDeHex);

    let p = pid >>> 0;
    for (const m of manchas) {
      const x0 = m.x + ((p & 0x0f) - 8);
      let y = m.y + (((p & 0xf0) >> 4) - 8);
      for (let linha = 0; linha < 16; linha++, y++) {
        let bits = m.linhas[linha];
        for (let col = x0; col < x0 + 16; col++, bits >>= 1) {
          if (!(bits & 1)) continue;
          if (col < 0 || col > 63 || y < 0 || y > 63) continue;
          const o = (y * 64 + col) * 4;
          if (px[o + 3] < 255) continue;                 // transparente não recebe mancha
          const k = corpo.findIndex((c) => c[0] === px[o] && c[1] === px[o + 1] && c[2] === px[o + 2]);
          if (k < 0) continue;                           // não é cor de corpo: contorno, olho, pata
          px[o] = tinta[k][0]; px[o + 1] = tinta[k][1]; px[o + 2] = tinta[k][2];
        }
      }
      p >>>= 8;                                          // o próximo naco, pra próxima mancha
    }
    ctx.putImageData(dados, 0, 0);
    // o cache é por padrão desenhado; num box cheio de SPINDA ele não pode crescer sem fim
    if (this._spinda.size > 96) this._spinda.delete(this._spinda.keys().next().value);
    this._spinda.set(chave, cv);
    return cv;
  },

  /** A ARTE SHINY DE VERDADE, se esta espécie tiver uma. Devolve null quando
   *  não tem — e aí quem chamou usa o filtro. Pede o PNG na primeira vez. */
  monShiny(id, costas = false) {
    const sp = DB.SPECIES[id];
    if (!sp || sp.fusao || sp.crescimento || sp.spriteUrl) return null;   // composta ou desenhada: sem shiny oficial
    pedirMonShiny(sp.id || id, sp.spriteDex || sp.dex);
    // Sem arte shiny do lado pedido, devolve null e quem chamou usa o filtro em
    // cima do sprite certo. Cair no sprite de FRENTE quando pedem as costas
    // desenharia o bicho olhando pra quem ele está de costas.
    return (costas ? SpriteStore.pokemonShinyBack[id] : SpriteStore.pokemonShiny[id]) || null;
  },

  /** A arte com a cor QUE AQUELE BICHO TEM. Luminoso ganha do shiny, e o comum
   *  e a arte crua. Existe pra nao haver quatro telas decidindo isso cada uma
   *  do seu jeito — e pra que a proxima tela que desenhar bicho ja acerte.
   *
   *  `costas` diz qual lado `img` é, porque a arte shiny tem frente e costas
   *  próprias e não dá pra adivinhar isso olhando o canvas. */
  comCor(img, mon, costas = false) {
    let out = img;
    if (mon?.luminoso) out = this.luminoso(img);
    else if (mon?.shiny) {
      // o SPINDA shiny é carimbado na rampa verde; só a frente, como no original
      const spinda = mon.species === "spinda" && !costas ? this.spinda(mon.seed, true) : null;
      out = spinda || (mon.species && this.monShiny(mon.species, costas)) || this.shiny(img);
    }
    return mon?.alfa ? this.alfa(out) : out;
  },

  /** A MARCA DO ALFA: um contorno vermelho de um pixel em volta do sprite e os
   *  olhos... não dá pra achar olho em 151 sprites, então a marca é a borda —
   *  é o que se vê de longe no mato, e é o que os LEGENDS mostram no mapa.
   *  O tamanho maior é de quem desenha (drawSelvagem e a batalha). */
  alfa(img) {
    if (!img) return img;
    if (!this._alfa) this._alfa = new Map();
    const hit = this._alfa.get(img);
    if (hit) return hit;
    const { cv, ctx } = makeCanvas(img.width, img.height);
    const sil = this.silhueta(img);
    ctx.globalCompositeOperation = "source-over";
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) ctx.drawImage(sil, dx, dy);
    ctx.globalCompositeOperation = "source-in";
    ctx.fillStyle = "#e0242a";
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(img, 0, 0);
    this._alfa.set(img, cv);
    return cv;
  },

  /** O TOTEM DIGLETT DE CORPO PRESENTE (src/core/diglettbombado.js): o sprite
   *  de sempre, intacto, em cima de um corpo que ninguém pediu. As linhas vazias
   *  de cima são cortadas — quem desenha precisa saber onde começa o punho. */
  diglettBombado(img) {
    if (!img) return img;
    if (!this._bombado) this._bombado = new Map();
    const hit = this._bombado.get(img);
    if (hit) return hit;
    const { rows, paleta } = corpoBombado();
    const corpo = spriteFromRows(rows, paleta);
    const topo = rows.findIndex((r) => /[^.]/.test(r));
    const { cv, ctx } = makeCanvas(CORPO.w, CORPO.h - topo);
    ctx.drawImage(corpo, 0, -topo);
    ctx.drawImage(img, CORPO.spriteX, CORPO.spriteY - topo);
    this._bombado.set(img, cv);
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
    // o SPINDA não tem UM sprite: o desenho é limpo e as manchas saem do seed
    if (ext && id === "spinda") return this.spinda(seed) || ext;
    if (ext) return ext;
    // ainda não foi pedido: pede agora e mostra a arte provisória enquanto vem
    // a FORMA ÚNICA tem o desenho dela num caminho próprio
    if (sp?.spriteUrl) pedirMonUrl(sp.id || id, sp.spriteUrl);
    else if (sp) pedirMon(sp.id || id, sp.spriteDex || sp.dex);
    return this.placeholder(id, seed);
  },

  /** sprite de costas (do jogador na batalha) */
  monBack(id, seed) {
    const sp = DB.SPECIES[id];
    if (sp?.fusao) return fusaoSprite(sp, "costas", seed);
    // a FORMA ÚNICA só tem a frente: de costas ela usa o mesmo desenho
    if (sp && !sp.spriteUrl && !SpriteStore.pokemonBack[id]) pedirMon(sp.id || id, sp.spriteDex || sp.dex);
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

  /** AS TRÊS ERAS (src/data/eras.js), desenhadas em runtime. É UMA FUNÇÃO SÓ
   *  pras três: o que muda de uma pra outra é a PALETA, e paleta é dado — está
   *  escrita junto da era, no arquivo de dados, e tem hot-swap com ela.
   *
   *  Três funções quase iguais era o caminho fácil, e seria a terceira vez que
   *  este arquivo desenharia chão-mato-pedra-água com nomes diferentes. */
  eraArt(geo, pal, seed = 66000) {
    const r = makeRng(seed);
    const { w: tw, h: th, tags } = geo;
    const { cv, ctx } = makeCanvas(tw * 16, th * 16);
    for (let y = 0; y < th; y++) {
      for (let x = 0; x < tw; x++) {
        const tag = tags[y * tw + x];
        const base = tag === "3" ? pal.agua : pal.chao;
        for (let py = 0; py < 16; py += 4) {
          for (let px2 = 0; px2 < 16; px2 += 4) {
            ctx.fillStyle = r.chance(pal.faiscaChance || 0) ? pal.faisca : r.pick(base);
            ctx.fillRect(x * 16 + px2, y * 16 + py, 4, 4);
          }
        }
        if (tag === "3" && r.chance(0.14)) {          // crista / reflexo na água
          ctx.fillStyle = pal.espuma;
          ctx.fillRect(x * 16 + r.int(10), y * 16 + r.int(12), 5 + r.int(3), 1);
        }
        if (tag === "1") {                            // pedra: bloco com topo claro
          ctx.fillStyle = r.pick(pal.pedra);
          ctx.fillRect(x * 16, y * 16, 16, 16);
          ctx.fillStyle = pal.pedra[pal.pedra.length - 1];
          ctx.fillRect(x * 16, y * 16 + 12, 16, 4);
          ctx.fillStyle = pal.pedra[0];
          ctx.fillRect(x * 16 + 2, y * 16 + 2, 12, 2);
        } else if (tag === "2") {                     // o mato onde nasce bicho
          ctx.fillStyle = pal.mato[pal.mato.length - 1];
          ctx.fillRect(x * 16, y * 16 + 7, 16, 9);
          for (let k = 0; k < 11; k++) {
            const bx = x * 16 + r.int(15);
            const topo = y * 16 + 1 + r.int(9);
            ctx.fillStyle = r.pick(pal.mato);
            ctx.fillRect(bx, topo, 1, y * 16 + 16 - topo);
          }
        }
      }
    }
    // O FUTURO ganha a grade por cima de tudo: linhas horizontais finas, como
    // tela ligada. As outras duas não passam `linhas` e não pagam por isto.
    if (pal.linhas) {
      ctx.globalAlpha = 0.16;
      ctx.fillStyle = pal.linhas;
      for (let y = 0; y < cv.height; y += 4) ctx.fillRect(0, y, cv.width, 1);
      ctx.globalAlpha = 1;
    }
    return cv;
  },

  /** BRAGLITCH (src/data/braglitch.js), desenhada em runtime a partir da
   *  PLANTA do mapa — um caractere por tile. O chão sai tile por tile; os
   *  prédios saem inteiros (cada bloco de uma letra é um prédio), porque um
   *  telhado pintado de dezesseis em dezesseis pixels vira xadrez.
   *
   *  O jeito é o de lá: terra vermelha no caminho, casario de cor diferente
   *  uma do lado da outra, telha de barro, igrejinha branca, coreto na praça,
   *  coqueiro na areia e um barquinho pintado no píer. E, espalhado, o que o
   *  APAGÃO deixou: um pixel ou outro que não voltou da cor certa. */
  braglitchArt(geo, seed = 5501) {
    const r = makeRng(seed);
    const planta = geo.planta || [];
    const th = planta.length, tw = planta[0]?.length || 0;
    const { cv, ctx } = makeCanvas(tw * 16, th * 16);
    const at = (x, y) => planta[y]?.[x] ?? "#";
    // o chão muda com o lugar: sertão seco, cerrado amarelado, mata e litoral verdes
    const tema = geo.tema || "mata";
    const GRAMA = {
      serra: ["#5d9a5a", "#66a562", "#548f52", "#70ad6a"],
      sertao: ["#b9a95a", "#c4b465", "#ad9d50", "#cdbd72"],
      cerrado: ["#93a84a", "#9db352", "#879c42", "#a8bd5d"],
    }[tema] || ["#5fae4a", "#67b852", "#58a444", "#6fbf58"];
    const COPA = tema === "sertao" ? ["#7a6a55", "#8f7f66", "#a39478"]
      : tema === "cerrado" ? ["#4f7a2c", "#5e8f36", "#74a445"] : ["#1f5e2a", "#2c7a36", "#3f9446"];
    const TERRA = ["#c07a48", "#b86f3e", "#c98553", "#ae683a"];
    const AREIA = ["#efdca6", "#e8d397", "#f4e4b4", "#e2cb8c"];
    const AGUA = ["#2f7fc0", "#3689cc", "#2a74b2", "#3c93d6"];
    const salpica = (x, y, pal, passo = 4) => {
      for (let py = 0; py < 16; py += passo) {
        for (let px2 = 0; px2 < 16; px2 += passo) {
          ctx.fillStyle = r.pick(pal);
          ctx.fillRect(x * 16 + px2, y * 16 + py, passo, passo);
        }
      }
    };
    const PREDIO = "HhLCMIKGA";

    // O CHÃO. Antes era tudo salpicado de quadradinhos de 4px sorteados, e de
    // longe parecia chuvisco de TV. Agora é como no FireRed: cor lisa, e o
    // detalhe vai em poucos pixels que querem dizer alguma coisa — o tufo de
    // grama, a pedrinha no caminho, o grão de areia.
    const liso = (x, y, cor) => { ctx.fillStyle = cor; ctx.fillRect(x * 16, y * 16, 16, 16); };
    const px1 = (x, y, cor) => { ctx.fillStyle = cor; ctx.fillRect(x, y, 1, 1); };
    const grama = (x, y) => {
      liso(x, y, GRAMA[0]);
      const X = x * 16, Y = y * 16;
      if (r.chance(0.18)) {                       // uma mancha de grama mais escura
        ctx.fillStyle = GRAMA[2];
        const mx = X + r.int(8), my = Y + r.int(9);
        ctx.fillRect(mx + 1, my, 5, 1); ctx.fillRect(mx, my + 1, 7, 3); ctx.fillRect(mx + 1, my + 4, 5, 1);
      }
      for (let k = 0; k < 3; k++) {               // os tufos: dois fiozinhos e o miolo
        if (!r.chance(0.6)) continue;
        const tx = X + 1 + r.int(12), ty = Y + 2 + r.int(11);
        px1(tx, ty + 1, GRAMA[2]); px1(tx + 1, ty + 2, GRAMA[2]); px1(tx + 2, ty + 1, GRAMA[2]);
        px1(tx, ty, GRAMA[3]); px1(tx + 2, ty, GRAMA[3]);
      }
      if (r.chance(0.07)) {                       // um trevo
        const tx = X + 2 + r.int(11), ty = Y + 2 + r.int(11);
        px1(tx, ty, GRAMA[3]); px1(tx + 1, ty, GRAMA[1]); px1(tx, ty + 1, GRAMA[1]); px1(tx + 1, ty + 1, GRAMA[2]);
      }
      if (r.chance(0.06)) {                       // uma florzinha perdida
        const tx = X + 2 + r.int(12), ty = Y + 2 + r.int(12);
        const cor = r.pick(["#ffffff", "#ffe066", "#ff9ec7"]);
        px1(tx, ty - 1, cor); px1(tx - 1, ty, cor); px1(tx + 1, ty, cor); px1(tx, ty + 1, cor);
        px1(tx, ty, "#e8a23a");
      }
      // a SOMBRA de quem está em cima: a árvore e o coqueiro fazem sombra no
      // chão logo abaixo deles (a luz vem de cima-esquerda)
      if ("#Y".includes(at(x, y - 1))) {
        ctx.fillStyle = "rgba(10,40,20,0.22)";
        ctx.fillRect(X, Y, 16, 2);
        ctx.fillRect(X + 2, Y + 2, 12, 1);
      }
      if (at(x - 1, y) === "#") {
        ctx.fillStyle = "rgba(10,40,20,0.12)";
        ctx.fillRect(X, Y, 2, 16);
      }
    };
    const areia = (x, y) => {
      liso(x, y, AREIA[0]);
      const X = x * 16, Y = y * 16;
      for (let k = 0; k < 5; k++) px1(X + r.int(16), Y + r.int(16), r.chance(0.5) ? AREIA[3] : AREIA[2]);
      if (r.chance(0.12)) { px1(X + 4 + r.int(8), Y + 4 + r.int(8), "#fff7dc"); }   // uma conchinha
    };
    // o CAMINHO de terra: borda escura onde encosta na grama, a beirada da
    // grama roendo a terra de leve, cantos arredondados e umas pedrinhas
    const ehCaminho = (x, y) => "PD".includes(at(x, y));
    const ehChao = (x, y) => ".,F1234567890o".includes(at(x, y));
    const TERRA_BORDA = "#96582f", TERRA_LUZ = "#d8966a";
    const terra = (x, y) => {
      liso(x, y, TERRA[0]);
      const X = x * 16, Y = y * 16;
      for (let k = 0; k < 3; k++) {               // pedrinhas: um pixel de luz em cima de um de sombra
        if (!r.chance(0.55)) continue;
        const sx = X + 2 + r.int(12), sy = Y + 2 + r.int(12);
        px1(sx, sy, TERRA_LUZ); px1(sx, sy + 1, TERRA_BORDA);
      }
      const n = !ehCaminho(x, y - 1), s = !ehCaminho(x, y + 1), o = !ehCaminho(x - 1, y), l = !ehCaminho(x + 1, y);
      // a beirada: a linha escura inteira, e a grama avançando um pixel pra
      // dentro aqui e ali (irregular, sem padrão — senão vira pontilhado)
      const beira = (ax, ay, bx, by, dx, dy, grama) => {
        let avanca = 0;
        for (let k = 0; k < 16; k++) {
          const xx = X + ax * k + bx, yy = Y + ay * k + by;
          if (grama && avanca <= 0 && r.chance(0.12)) avanca = 2 + r.int(3);
          if (avanca-- > 0) { px1(xx, yy, GRAMA[0]); px1(xx + dx, yy + dy, TERRA_BORDA); }
          else px1(xx, yy, TERRA_BORDA);
        }
      };
      if (n) beira(1, 0, 0, 0, 0, 1, ehChao(x, y - 1));
      if (s) beira(1, 0, 0, 15, 0, -1, ehChao(x, y + 1));
      if (o) beira(0, 1, 0, 0, 1, 0, ehChao(x - 1, y));
      if (l) beira(0, 1, 15, 0, -1, 0, ehChao(x + 1, y));
      // cantos de fora arredondados: tira a quina e põe a borda na diagonal
      const canto = (cx, cy, dx, dy) => {
        ctx.fillStyle = GRAMA[0];
        ctx.fillRect(cx, cy, 1, 1); ctx.fillRect(cx + dx, cy, 1, 1); ctx.fillRect(cx, cy + dy, 1, 1);
        px1(cx + dx, cy + dy, TERRA_BORDA);
      };
      if (n && o && ehChao(x - 1, y - 1)) canto(X, Y, 1, 1);
      if (n && l && ehChao(x + 1, y - 1)) canto(X + 15, Y, -1, 1);
      if (s && o && ehChao(x - 1, y + 1)) canto(X, Y + 15, 1, -1);
      if (s && l && ehChao(x + 1, y + 1)) canto(X + 15, Y + 15, -1, -1);
      // a sombrinha que a beirada de grama faz na terra, embaixo dela
      if (n) { ctx.fillStyle = "rgba(60,25,5,0.16)"; ctx.fillRect(X + (o ? 1 : 0), Y + 1, 16 - (o ? 1 : 0) - (l ? 1 : 0), 1); }
      // o meio do caminho, mais pisado: mais claro
      ctx.fillStyle = "rgba(255,235,205,0.10)";
      if (o && l && !n && !s) ctx.fillRect(X + 5, Y, 6, 16);        // caminho em pé
      else if (n && s && !o && !l) ctx.fillRect(X, Y + 5, 16, 6);   // caminho deitado
    };

    // 1. O CHÃO de todo tile (os prédios e as árvores vão por cima)
    for (let y = 0; y < th; y++) {
      for (let x = 0; x < tw; x++) {
        const c = at(x, y);
        if (c === "~" || c === "B") {
          salpica(x, y, AGUA);
          if (r.chance(0.3)) {                      // crista de onda
            ctx.fillStyle = "#9fd4f5";
            ctx.fillRect(x * 16 + r.int(10), y * 16 + r.int(14), 4 + r.int(4), 1);
          }
          if (at(x - 1, y) === "R" || at(x + 1, y) === "R") {   // cachoeira: a água caindo no paredão
            ctx.fillStyle = "#dff1ff";
            for (let k = 0; k < 4; k++) ctx.fillRect(x * 16 + 2 + k * 4, y * 16, 1, 16);
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(x * 16, y * 16 + 14, 16, 2);
          }
          if ("a=".includes(at(x, y - 1)) || "aY".includes(at(x, y - 1))) {   // espuma na beira
            ctx.fillStyle = "#e9f6ff";
            ctx.fillRect(x * 16, y * 16, 16, 2);
            ctx.fillRect(x * 16 + r.int(8), y * 16 + 2, 6, 1);
          }
        } else if (c === "a" || (c === "Y" && [at(x - 1, y), at(x + 1, y), at(x, y - 1), at(x, y + 1)].includes("a"))) areia(x, y);
        // na serra o chão vai ficando de pedra conforme sobe: embaixo é grama,
        // no alto é campo de altitude cinzento
        else if (tema === "serra" && ".,v^12".includes(c) && y < th * 0.66) {
          salpica(x, y, y < th * 0.33 ? ["#8a9c80", "#94a689", "#7f9176", "#9db191"] : ["#6f9a66", "#79a46f", "#66905e", "#82ad78"]);
          if (r.chance(y < th * 0.33 ? 0.35 : 0.15)) {       // lascas de pedra no chão
            ctx.fillStyle = r.pick(["#9d9890", "#b3aea4", "#86817a"]);
            ctx.fillRect(x * 16 + r.int(12), y * 16 + r.int(12), 3 + r.int(3), 2);
          }
        }
        // placa e pedra ficam no chão de quem está do lado: na praia, areia
        else if (/[1-9o]/.test(c) && [at(x - 1, y), at(x + 1, y), at(x, y + 1)].includes("a")) areia(x, y);
        else if (c === "P" || c === "D") terra(x, y);
        else if (c === "R" || c === "e") salpica(x, y, ["#8d8a84", "#97948d", "#827f79", "#a09c94"]);
        else if (c === "=") {
          salpica(x, y, AGUA);
          ctx.fillStyle = "#8a5a32";
          ctx.fillRect(x * 16, y * 16, 16, 16);
          for (let k = 0; k < 4; k++) {             // as tábuas, com a fresta
            ctx.fillStyle = k % 2 ? "#a06c3e" : "#98653a";
            ctx.fillRect(x * 16, y * 16 + k * 4, 16, 3);
          }
          ctx.fillStyle = "#5c3a20";
          ctx.fillRect(x * 16 + (at(x - 1, y) === "=" ? 15 : 0), y * 16, 1, 16);
        } else grama(x, y);
      }
    }

    // 2. O QUE FICA EM CIMA DO CHÃO, tile por tile
    for (let y = 0; y < th; y++) {
      for (let x = 0; x < tw; x++) {
        const c = at(x, y), X = x * 16, Y = y * 16;
        if (c === ",") {                            // mato alto
          ctx.fillStyle = "#2f7a2c";
          ctx.fillRect(X, Y + 7, 16, 9);
          for (let k = 0; k < 12; k++) {
            const bx = X + r.int(15), topo = Y + 1 + r.int(8);
            ctx.fillStyle = r.pick(["#3f9a36", "#4fb044", "#2f8a2a", "#6cc45a"]);
            ctx.fillRect(bx, topo, 1, Y + 16 - topo);
          }
        } else if (c === "F") {                     // canteiro de flor
          for (let k = 0; k < 7; k++) {
            ctx.fillStyle = r.pick(["#ffd23f", "#ff5a5f", "#c36bff", "#ffffff", "#ff9f1c"]);
            const fx = X + 1 + r.int(13), fy = Y + 1 + r.int(13);
            ctx.fillRect(fx, fy, 2, 2);
            ctx.fillStyle = "#3e8d34";
            ctx.fillRect(fx, fy + 2, 1, 2);
          }
        } else if (c === "o") {                     // pedra
          ctx.fillStyle = "#7d776c";
          ctx.fillRect(X + 2, Y + 4, 12, 11);
          ctx.fillStyle = "#a39c8e";
          ctx.fillRect(X + 3, Y + 4, 9, 3);
          ctx.fillStyle = "#57524a";
          ctx.fillRect(X + 2, Y + 13, 12, 2);
        } else if (/[1-9]/.test(c)) {               // placa
          ctx.fillStyle = "#6b4526";
          ctx.fillRect(X + 7, Y + 8, 2, 8);
          ctx.fillStyle = "#b0804a";
          ctx.fillRect(X + 2, Y + 2, 12, 8);
          ctx.fillStyle = "#6b4526";
          ctx.fillRect(X + 2, Y + 9, 12, 1);
          ctx.fillStyle = "#f4e4c0";
          ctx.fillRect(X + 4, Y + 4, 8, 1);
          ctx.fillRect(X + 4, Y + 6, 6, 1);
        } else if (c === "Y") {                     // coqueiro
          ctx.fillStyle = "#8a6a3e";
          for (let k = 0; k < 7; k++) ctx.fillRect(X + 7 + (k > 3 ? 1 : 0), Y + 4 + k * 2, 3, 2);
          ctx.fillStyle = "#2f8a3a";
          for (const [dx, dy, w] of [[-6, 0, 8], [6, 0, 8], [-4, -3, 6], [4, -3, 6], [0, -5, 4]]) {
            ctx.fillRect(X + 6 + dx, Y + 3 + dy, w, 2);
          }
          ctx.fillStyle = "#6b4a22";
          ctx.fillRect(X + 6, Y + 5, 2, 2);
          ctx.fillRect(X + 9, Y + 5, 2, 2);
        } else if (c === "R") {                     // paredão da serra: pedra em camadas
          ctx.fillStyle = "#77736c";
          ctx.fillRect(X, Y, 16, 16);
          for (let k = 0; k < 4; k++) {
            ctx.fillStyle = k % 2 ? "#6a665f" : "#8a857d";
            ctx.fillRect(X, Y + k * 4, 16, 2);
            ctx.fillStyle = "#5a5650";
            ctx.fillRect(X + ((x * 5 + k * 7) % 13), Y + k * 4 + 2, 3, 2);
          }
          ctx.fillStyle = "#4e4a45";                // a sombra na base do paredão
          ctx.fillRect(X, Y + 14, 16, 2);
          ctx.fillStyle = "rgba(20,30,20,0.28)";    // e a que ele joga no chão de baixo
          ctx.fillRect(X, Y + 16, 16, 5);
          if (at(x, y - 1) !== "R") { ctx.fillStyle = "#b3aea4"; ctx.fillRect(X, Y, 16, 2); }
        } else if (c === "e") {                     // escadaria de pedra
          for (let k = 0; k < 4; k++) {
            ctx.fillStyle = "#b8b3a8";
            ctx.fillRect(X + 1, Y + k * 4, 14, 3);
            ctx.fillStyle = "#6f6b64";
            ctx.fillRect(X + 1, Y + k * 4 + 3, 14, 1);
          }
        } else if (c === "v") {                     // barranco: grama com a beirada caindo
          ctx.fillStyle = "#4d7f45";
          ctx.fillRect(X, Y + 10, 16, 3);
          ctx.fillStyle = "#7a5a38";
          ctx.fillRect(X, Y + 13, 16, 3);
          ctx.fillStyle = "#8fbf7f";
          ctx.fillRect(X, Y + 9, 16, 1);
        } else if (c === "^") {                     // barranco virado: a beirada cai pra cima
          ctx.fillStyle = "#4d7f45";
          ctx.fillRect(X, Y + 3, 16, 3);
          ctx.fillStyle = "#7a5a38";
          ctx.fillRect(X, Y, 16, 3);
          ctx.fillStyle = "#8fbf7f";
          ctx.fillRect(X, Y + 6, 16, 1);
        } else if (c === "#" && tema === "serra") { // araucária: tronco reto e a copa em taça
          ctx.fillStyle = "#5a3a20";
          ctx.fillRect(X + 7, Y + 5, 2, 11);
          ctx.fillStyle = "#1f4f2c";
          ctx.fillRect(X, Y + 1, 16, 4);
          ctx.fillRect(X + 2, Y + 5, 12, 2);
          ctx.fillStyle = "#2e6b3a";
          ctx.fillRect(X + 1, Y, 3, 2);
          ctx.fillRect(X + 12, Y, 3, 2);
          ctx.fillRect(X + 6, Y, 4, 2);
        } else if (c === "#") {                     // árvore de mata: copa redonda
          ctx.fillStyle = "#5a3a20";
          ctx.fillRect(X + 6, Y + 10, 4, 6);
          ctx.fillStyle = COPA[0];
          ctx.fillRect(X, Y + 2, 16, 11);
          ctx.fillRect(X + 2, Y, 12, 14);
          ctx.fillStyle = COPA[1];
          ctx.fillRect(X + 2, Y + 2, 10, 7);
          ctx.fillStyle = COPA[2];
          ctx.fillRect(X + 3, Y + 2, 5, 3);
          if (r.chance(0.12)) {                     // um ipê florido aqui e ali
            ctx.fillStyle = r.chance(0.5) ? "#ffd23f" : "#e27bd0";
            for (let k = 0; k < 5; k++) ctx.fillRect(X + 1 + r.int(13), Y + 1 + r.int(10), 2, 2);
          }
        }
      }
    }

    // 3. OS PRÉDIOS: cada bloco de letra igual, inteiro
    const visto = new Set();
    const CASARIO = ["#f2c14e", "#5fa8d3", "#f28ab2", "#7cc48a", "#f08a4b", "#b99be0"];
    let n = 0;
    for (let y = 0; y < th; y++) {
      for (let x = 0; x < tw; x++) {
        const c = at(x, y);
        if (!PREDIO.includes(c) || visto.has(`${x},${y}`)) continue;
        // o retângulo: anda pra direita e pra baixo enquanto for a mesma letra
        let x1 = x, y1 = y;
        while (at(x1 + 1, y) === c) x1++;
        while (at(x, y1 + 1) === c) y1++;
        for (let yy = y; yy <= y1; yy++) for (let xx = x; xx <= x1; xx++) visto.add(`${xx},${yy}`);
        const portas = [];
        for (let xx = x; xx <= x1; xx++) if (at(xx, y1 + 1) === "D") portas.push(xx);
        this._predio(ctx, c, x * 16, y * 16, (x1 - x + 1) * 16, (y1 - y + 1) * 16,
                     portas.map((xx) => xx * 16), CASARIO[n++ % CASARIO.length], r);
      }
    }

    // 4. OS BARQUINHOS: cada bloco de B encostado é um barco (um porto pode
    // ter vários — as jangadas de Fortaleza, os barcos do Rio Negro)
    const barcos = [], noBarco = new Set();
    planta.forEach((l, y) => [...l].forEach((c, x) => {
      if (c !== "B" || noBarco.has(`${x},${y}`)) return;
      const bloco = [[x, y]];
      noBarco.add(`${x},${y}`);
      for (let i = 0; i < bloco.length; i++) {
        const [bx, by] = bloco[i];
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const k = `${bx + dx},${by + dy}`;
          if (at(bx + dx, by + dy) === "B" && !noBarco.has(k)) { noBarco.add(k); bloco.push([bx + dx, by + dy]); }
        }
      }
      barcos.push(bloco);
    }));
    barcos.forEach((barco, n) => {
      const bx = Math.min(...barco.map((b) => b[0])) * 16, by = Math.min(...barco.map((b) => b[1])) * 16;
      const bw = (Math.max(...barco.map((b) => b[0])) + 1) * 16 - bx;
      const bh = (Math.max(...barco.map((b) => b[1])) + 1) * 16 - by;
      const faixa = ["#2a9d8f", "#e76f51", "#3a86ff", "#8338ec"][n % 4];   // cada um pintado de um jeito
      ctx.fillStyle = "#1e5a8c";                    // sombra na água
      ctx.fillRect(bx + 3, by + bh - 4, bw - 4, 3);
      ctx.fillStyle = "#f4f1e8";                    // casco branco
      ctx.fillRect(bx + 2, by + 6, bw - 4, bh - 10);
      ctx.fillStyle = faixa;                        // a faixa colorida
      ctx.fillRect(bx + 2, by + bh - 10, bw - 4, 3);
      ctx.fillStyle = "#e9c46a";                    // e a amarela
      ctx.fillRect(bx + 2, by + bh - 7, bw - 4, 2);
      ctx.fillStyle = "#8a5a32";                    // o banco
      ctx.fillRect(bx + 6, by + 10, Math.max(2, bw - 12), 3);
      ctx.fillStyle = "#c0392b";                    // bandeirinha no mastro
      ctx.fillRect(bx + bw / 2, by, 1, 10);
      ctx.fillRect(bx + bw / 2 + 1, by, 5, 3);
      ctx.fillStyle = "#264653";                    // o nome pintado na proa
      ctx.fillRect(bx + 5, by + bh - 14, 8, 1);
    });

    // 5. A NEBLINA DA SERRA: faixas brancas soltas, mais grossas lá em cima
    if (tema === "serra") {
      for (let i = 0; i < 26; i++) {
        const y0 = r.int(cv.height), alt = 3 + r.int(6);
        const peso = 1 - y0 / cv.height;              // em cima, mais neblina
        ctx.globalAlpha = 0.08 + peso * 0.18;
        ctx.fillStyle = "#f2f5f8";
        ctx.fillRect(r.int(cv.width) - 60, y0, 80 + r.int(160), alt);
      }
      ctx.globalAlpha = 1;
    }

    // 6. O QUE O APAGÃO DEIXOU: poucos, e só no chão aberto
    for (let i = 0; i < Math.round(tw * th * 0.012); i++) {
      const x = r.int(tw), y = r.int(th);
      if (!".P,a".includes(at(x, y))) continue;
      ctx.fillStyle = r.pick(["#b455ff", "#00ffcc", "#ff0066"]);
      ctx.fillRect(x * 16 + r.int(12), y * 16 + r.int(14), 2 + r.int(4), 1);
    }
    return cv;
  },

  /** A BASE do ARCEUS REDENTOR de RIO DE JANEEVEE (src/data/braglitch-mundo.js):
   *  o pedestal de pedra clara em degraus, ocupando o bloco inteiro (10x5
   *  tiles). O ARCEUS em si não é pintado aqui: ele tem nove blocos de altura
   *  e é desenhado por cima de tudo, em pé, pela cena (`drawEstatua`), pra quem
   *  passar atrás dele sumir atrás dele. */
  _arceusRedentor(ctx, X, Y, W, H) {
    const px = (x, y, w, h, cor) => { ctx.fillStyle = cor; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
    ctx.fillStyle = "rgba(0,0,0,0.22)";                     // a sombra no chão
    ctx.fillRect(X + 2, Y + H - 3, W - 4, 3);
    // três degraus, cada um mais estreito e mais pra trás
    const degraus = [[0, 0, H], [8, 10, H - 18], [16, 20, H - 34]];
    degraus.forEach(([rec, topo, alt], i) => {
      const x = X + rec, w = W - rec * 2, y = Y + topo;
      px(x, y, w, alt, i % 2 ? "#dcdad0" : "#d0cec4");
      px(x, y, w, 2, "#efede5");                            // a quina iluminada
      px(x, y + alt - 1, w, 1, "#7d7b73");                  // a quina de baixo
      px(x, y, 1, alt, "#e6e4db");
      px(x + w - 1, y, 1, alt, "#a9a79e");
      for (let k = x + 6; k < x + w - 6; k += 12) px(k, y + alt - 5, 6, 1, "#bdbbb1");   // juntas das pedras
    });
    // a placa de bronze na frente do degrau de baixo
    px(X + W / 2 - 14, Y + H - 12, 28, 7, "#b89b4e");
    px(X + W / 2 - 12, Y + H - 10, 24, 1, "#6e5a26");
    px(X + W / 2 - 12, Y + H - 8, 18, 1, "#6e5a26");
  },

  /** Um prédio de Braglitch, inteiro. `c` é a letra da planta. */
  _predio(ctx, c, X, Y, W, H, portas, cor, r) {
    const sombra = (x, y, w, h) => { ctx.fillStyle = "rgba(0,0,0,0.18)"; ctx.fillRect(x, y, w, h); };
    if (c === "A") return this._arceusRedentor(ctx, X, Y, W, H);
    if (c === "K") {                               // o CORETO: cúpula e colunas
      const cx = X + W / 2;
      ctx.fillStyle = "#e8e2d0";
      ctx.fillRect(X + 2, Y + H - 8, W - 4, 6);     // o piso de cima
      ctx.fillStyle = "#ffffff";
      for (let k = 0; k < 4; k++) ctx.fillRect(X + 4 + k * ((W - 10) / 3), Y + 12, 2, H - 18);
      ctx.fillStyle = "#2e8b57";                    // cúpula verde de chapa
      ctx.beginPath();
      ctx.ellipse(cx, Y + 12, W / 2 - 1, 10, 0, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = "#c0392b";
      ctx.fillRect(X + 1, Y + 11, W - 2, 3);        // o friso
      ctx.fillStyle = "#ffd23f";
      ctx.fillRect(cx - 1, Y, 2, 4);                // o pináculo
      return;
    }
    const telhado = c === "C" ? "#d64040" : c === "M" ? "#3a7bd5" : c === "L" ? "#8a9bb0"
      : c === "G" ? "#2f7d4f" : "#b5532e";
    const parede = c === "L" || c === "C" || c === "M" || c === "I" ? "#f4f1ea" : c === "G" ? "#f2d45c" : cor;
    const casario = c === "H" || c === "h";        // as casas: janela com veneziana e chaminé
    const alturaParede = Math.min(26, Math.round(H * 0.5));
    const yParede = Y + H - alturaParede;
    const topo = Y + (c === "I" ? 10 : 2);
    const tom = (hex, f) => {                      // a mesma cor, mais escura (f<1) ou mais clara (f>1)
      const n = parseInt(hex.slice(1), 16);
      const ch = (v) => Math.max(0, Math.min(255, Math.round(f > 1 ? v + (255 - v) * (f - 1) : v * f)));
      return `rgb(${ch(n >> 16)},${ch((n >> 8) & 255)},${ch(n & 255)})`;
    };
    const ret = (x, y, w, h, cor) => { ctx.fillStyle = cor; ctx.fillRect(Math.round(x), Math.round(y), w, h); };

    // a SOMBRA do prédio no chão: pra direita e pra baixo (a luz vem de cima-esquerda)
    ctx.fillStyle = "rgba(20,30,20,0.22)";
    ctx.fillRect(X + W, topo + 4, 3, H - (topo - Y) - 4);
    ctx.fillRect(X + 3, Y + H, W, 2);

    // A PAREDE: a cor, o rodapé mais escuro e a sombra do beiral em cima
    ret(X + 1, yParede, W - 2, alturaParede, parede);
    ret(X + 1, Y + H - 3, W - 2, 3, tom(parede, 0.78));
    ret(X + 1, yParede, 1, alturaParede, tom(parede, 1.25));            // a quina iluminada
    ret(X + W - 3, yParede, 2, alturaParede, tom(parede, 0.82));        // a quina na sombra
    if (casario) {
      // O CASARIO COLONIAL: parede colorida emoldurada de branco — os cunhais
      // nas quinas e a cimalha embaixo do beiral
      ret(X + 1, yParede, 3, alturaParede - 3, "#f7f3e8");
      ret(X + W - 4, yParede, 3, alturaParede - 3, "#e4ddcc");
      ret(X + 1, yParede, W - 2, 3, "#f7f3e8");
      ret(X + 1, yParede + 3, W - 2, 1, tom(parede, 0.75));
    }
    if (c === "C") ret(X + 1, yParede + 3, W - 2, 2, "#d64040");        // a faixa vermelha do Centro
    ret(X + 1, yParede, W - 2, 2, "rgba(0,0,0,0.22)");                  // a sombra do beiral

    // O TELHADO: sai 1px pra fora da parede dos dois lados (o beiral), telha
    // em escamas, cumeeira clara em cima e o beiral escuro embaixo
    const tx = X - 1, tw = W + 2, th = yParede + 1 - topo;
    ret(tx, topo, tw, th, telhado);
    for (let yy = topo + 4, fila = 0; yy < yParede - 1; yy += 4, fila++) {
      for (let xx = tx + (fila % 2 ? 3 : 0); xx < tx + tw - 3; xx += 6) {
        ret(xx, yy, Math.min(5, tx + tw - 3 - xx), 1, tom(telhado, 0.72));   // a borda de baixo da telha
        ret(xx, yy - 3, 1, 3, tom(telhado, 0.85));                     // a junta
        ret(xx + 1, yy - 3, 2, 1, tom(telhado, 1.2));                  // o brilho da telha
      }
    }
    ret(tx, topo, tw, 2, tom(telhado, 1.3));                           // a cumeeira
    ret(tx, topo + 2, tw, 1, tom(telhado, 0.8));
    ret(tx, topo, 2, th, tom(telhado, 1.12));                          // o oitão, na luz
    ret(tx + tw - 3, topo, 3, th, tom(telhado, 0.78));                 // e na sombra
    ret(tx, yParede - 1, tw, 2, tom(telhado, 0.6));                    // o beiral
    if (casario && W >= 48) {                      // a chaminé de tijolo
      const cx = X + W - 14;
      ret(cx, topo - 5, 6, 9, "#8a4b32");
      ret(cx, topo - 5, 6, 2, "#b0694a");
      ret(cx + 1, topo - 1, 1, 1, "#6a3522"); ret(cx + 4, topo + 1, 1, 1, "#6a3522");
    }

    // AS JANELAS (menos onde tem porta): moldura branca, vidro com reflexo,
    // peitoril embaixo e, nas casas, a veneziana de madeira dos dois lados
    const vidro = c === "L" ? "#9fd3f5" : "#3a6ea5";
    const veneziana = tom(cor === parede ? "#2e7d4f" : "#2e7d4f", 1);
    for (let xx = X + 6; xx + 12 < X + W - 2; xx += 16) {
      if (portas.some((p) => xx + 12 > p && xx < p + 16)) continue;
      const wy = yParede + 6;
      if (casario) { ret(xx - 3, wy, 3, 10, veneziana); ret(xx + 12, wy, 3, 10, veneziana);
                     ret(xx - 3, wy + 3, 3, 1, tom(veneziana, 0.7)); ret(xx + 12, wy + 3, 3, 1, tom(veneziana, 0.7));
                     ret(xx - 3, wy + 6, 3, 1, tom(veneziana, 0.7)); ret(xx + 12, wy + 6, 3, 1, tom(veneziana, 0.7)); }
      ret(xx, wy, 12, 10, "#ffffff");
      ret(xx + 1, wy + 1, 10, 8, vidro);
      ret(xx + 2, wy + 2, 2, 1, "#d8efff"); ret(xx + 2, wy + 3, 1, 1, "#d8efff");   // o reflexo
      ret(xx + 6, wy + 1, 1, 8, "#ffffff");                                        // o caixilho
      ret(xx - 1, wy + 10, 14, 1, tom(parede, 0.7));                               // o peitoril
      if (casario && r.chance(0.55)) {             // a floreira debaixo da janela
        ret(xx, wy + 11, 12, 3, "#7a4a2a");
        ret(xx, wy + 11, 12, 1, "#9a6238");
        for (let k = 0; k < 6; k++) {
          const fx = xx + 1 + k * 2;
          ret(fx, wy + 10, 1, 1, "#3e8d34");
          ret(fx, wy + 9 + (k % 2), 1, 1, r.pick(["#ff5a5f", "#ffd23f", "#ff9ec7", "#ffffff"]));
        }
      }
    }

    // AS PORTAS (em cima do tile D, que fica logo abaixo): batente, a porta de
    // madeira com duas almofadas, a maçaneta e o degrau de pedra
    // a cor da porta: nas casas, cada uma pinta a sua
    const corPorta = c === "I" ? "#2f6db5" : casario ? r.pick(["#6b3f1f", "#2e7d4f", "#2f5d9e", "#7a2331"]) : "#6b3f1f";
    for (const px of portas) {
      const dy = yParede + alturaParede - 15;
      if (c === "G") {                             // o GINÁSIO: duas colunas em volta da porta
        for (const cx of [px - 2, px + 15]) {
          ret(cx, dy - 5, 3, 20, "#f4f1ea"); ret(cx + 2, dy - 5, 1, 20, "#cfc8b6");
          ret(cx - 1, dy - 6, 5, 2, "#ffffff"); ret(cx - 1, dy + 13, 5, 2, "#cfc8b6");
        }
      }
      if (c === "M") {                             // a LOJA: o toldo listrado em cima da porta
        for (let k = 0; k < 18; k += 2) ret(px - 1 + k, dy - 6, 2, 4, (k / 2) % 2 ? "#ffffff" : "#3a7bd5");
        for (let k = 0; k < 18; k += 2) ret(px - 1 + k, dy - 2, 1, 1, (k / 2) % 2 ? "#ffffff" : "#3a7bd5");
        ret(px - 1, dy - 7, 18, 1, "#255aa8");
      }
      ret(px + 2, dy - 1, 12, 16, c === "I" ? "#e8e2d0" : tom(parede, 1.35));      // o batente
      ret(px + 3, dy, 10, 14, corPorta);
      const alm = tom(corPorta, 0.75);
      ret(px + 4, dy + 2, 3, 4, alm); ret(px + 9, dy + 2, 3, 4, alm);
      ret(px + 4, dy + 8, 3, 4, alm); ret(px + 9, dy + 8, 3, 4, alm);
      ret(px + 8, dy + 7, 1, 2, "#ffd23f");                                          // a maçaneta
      ret(px + 1, dy + 14, 14, 2, "#a19d93"); ret(px + 1, dy + 14, 14, 1, "#c9c5ba"); // o degrau
      if (casario && r.chance(0.5)) {              // o lampião do lado da porta
        ret(px + 15, dy + 1, 2, 1, "#2b2b2b");
        ret(px + 16, dy + 2, 3, 5, "#2b2b2b");
        ret(px + 17, dy + 3, 1, 3, "#ffd86b");
      }
      if (c === "I") {                             // porta em arco
        ret(px + 3, dy, 2, 2, parede); ret(px + 11, dy, 2, 2, parede);
      }
    }
    // o que diz o que cada um é
    if (c === "C") {                               // a bola do Centro
      const cx = X + W / 2, cy = Y + 10;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(cx - 5, cy - 5, 10, 10);
      ctx.fillStyle = "#d64040";
      ctx.fillRect(cx - 5, cy - 5, 10, 4);
      ctx.fillStyle = "#222";
      ctx.fillRect(cx - 5, cy - 1, 10, 1);
      ctx.fillRect(cx - 1, cy - 2, 2, 3);
    } else if (c === "G") {                        // o GINÁSIO: faixa verde-amarela e a bola no alto
      ctx.fillStyle = "#1f5fbf";
      ctx.fillRect(X, yParede - 3, W, 3);
      const cx = X + W / 2, cy = Y + 9;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(cx - 7, cy - 6, 14, 12);
      ctx.fillStyle = "#1f5fbf";
      ctx.fillRect(cx - 7, cy - 6, 14, 5);
      ctx.fillStyle = "#222";
      ctx.fillRect(cx - 7, cy - 1, 14, 1);
      ctx.fillRect(cx - 2, cy - 2, 4, 3);
      ctx.fillStyle = "#ffd23f";                   // as estrelas das insígnias
      ctx.fillRect(X + 4, Y + 6, 2, 2);
      ctx.fillRect(X + W - 6, Y + 6, 2, 2);
    } else if (c === "M") {                        // a placa da loja
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(X + W / 2 - 8, Y + 6, 16, 7);
      ctx.fillStyle = "#3a7bd5";
      ctx.fillRect(X + W / 2 - 6, Y + 8, 12, 3);
    } else if (c === "L") {                        // a antena do laboratório
      ctx.fillStyle = "#555";
      ctx.fillRect(X + W - 12, Y - 6, 1, 10);
      ctx.fillStyle = "#ff5a5f";
      ctx.fillRect(X + W - 13, Y - 7, 3, 2);
      ctx.fillStyle = "#e9c46a";                   // placas solares
      ctx.fillRect(X + 6, Y + 6, 18, 6);
      ctx.fillStyle = "#26547c";
      ctx.fillRect(X + 7, Y + 7, 16, 4);
    } else if (c === "I") {                        // a torre da igrejinha, com a cruz
      const cx = X + W / 2;
      ctx.fillStyle = "#f4f1ea";
      ctx.fillRect(cx - 7, Y + 2, 14, 12);
      ctx.fillStyle = "#b5532e";
      ctx.fillRect(cx - 8, Y, 16, 3);
      ctx.fillStyle = "#6b3f1f";
      ctx.fillRect(cx - 2, Y + 5, 4, 5);           // o sino
      ctx.fillStyle = "#ffd23f";
      ctx.fillRect(cx - 1, Y - 8, 2, 8);
      ctx.fillRect(cx - 3, Y - 6, 6, 2);
    }
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
