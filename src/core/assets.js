// Todos os graficos sao gerados em runtime (nenhum arquivo de imagem).
// Trocar por PNGs depois e so mudar Assets.tiles / Assets.mons.
import { pintarCaraDitto } from "../systems/caraditto.js";
import { makeRng } from "./rng.js";
import { FR_BLOCOS, FR_CORES } from "./fr-blocos.js";
import { GRANDES, GRANDE_CORES } from "./arvore-grande.js";
import { DB } from "../data/index.js";
import { reduzido } from "./reduzir.js";
import { SpriteStore, loadImage, pedirMon, pedirMonShiny, pedirMonUrl, pedirAnim, pedirAnimDoJogador, quadroAnim, pedirAndar, quadroAndar, pedirVoo, quadroVoo } from "./sprites.js";
import { url as arquivo } from "./base.js";
import { corpoBombado, CORPO } from "./diglettbombado.js";
import { montarFusao, montarTripla, montarFusaoCara } from "../systems/montagem.js";
import { spriteDoCardume } from "../systems/cardume.js";
import { spriteDoBizarro } from "../systems/bizarro.js";
import { docesDoSeed, corDoCreme } from "../systems/doces.js";
import { formaDoSeed } from "../systems/bebbidah.js";

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

/** O MISSINGNO. DO RED: o "L" de trás pra frente — um bloco de 7x7 quadrados
 *  de 8 pixels com o canto de cima-esquerda vazio — cheio de LIXO DE MEMÓRIA
 *  nos quatro cinzas do Game Boy. É o desenho que sobrou de ler o sprite de um
 *  lugar que não era sprite.
 *
 *  E ELE MEXE: são `n` quadros, e de um pro outro só ALGUNS quadrados mudam
 *  (um padrão novo, um que copia o vizinho, uma fileira que escorrega) — o
 *  resto fica. Parece memória sendo reescrita, não uma tela piscando. */
const CINZAS_GB = ["#f8f8f8", "#a8a8a8", "#585858", "#181818"];
function missingnoQuadros(seed = 7, n = 10) {
  const r = makeRng(seed);
  const T = 7, L = 8;
  const dentro = (tx, ty) => !(tx < 3 && ty < 3);          // o vão do "L"
  // um quadrado de lixo: BLOCADO, não granulado — a memória lida como
  // desenho sai em pedaços de 2 pixels ou mais: cheio, listra grossa, metade,
  // tijolinho de 2x2. Branco e preto dominam, os cinzas são a junta.
  const cor = () => [0, 0, 0, 3, 3, 1, 2][r.int(7)];
  const novo = () => {
    const a = cor(), b = (a + 1 + r.int(3)) % 4, tipo = r.int(10);
    return Array.from({ length: L * L }, (_, i) => {
      const x = i % L, y = i >> 3;
      if (tipo < 3) return a;                                  // cheio
      if (tipo < 5) return (y >> 1) % 2 ? a : b;               // listra deitada
      if (tipo < 6) return (x >> 1) % 2 ? a : b;               // listra em pé
      if (tipo < 8) return y < 4 ? a : b;                      // metade
      return ((x >> 1) + (y >> 1) * 3 + seed) % 5 < 2 ? b : a; // tijolinho 2x2
    });
  };
  let tiles = Array.from({ length: T * T }, () => novo());
  const quadros = [];
  for (let q = 0; q < n; q++) {
    if (q > 0) {
      tiles = tiles.slice();
      for (let k = 0; k < 6; k++) {
        const i = r.int(T * T), o = r.int(3);
        if (o === 0) tiles[i] = novo();                       // padrão novo
        else if (o === 1) tiles[i] = tiles[(i + 1 + r.int(T * T - 1)) % (T * T)];   // copia outro
        else {                                                // a fileira escorrega
          const ty = Math.floor(i / T), fila = tiles.slice(ty * T, ty * T + T);
          fila.unshift(fila.pop());
          tiles.splice(ty * T, T, ...fila);
        }
      }
    }
    const { cv, ctx } = makeCanvas(64, 64);
    for (let ty = 0; ty < T; ty++) {
      for (let tx = 0; tx < T; tx++) {
        if (!dentro(tx, ty)) continue;
        const t = tiles[ty * T + tx];
        for (let p = 0; p < L * L; p++) {
          ctx.fillStyle = CINZAS_GB[t[p]];
          ctx.fillRect(4 + tx * L + (p % L), 8 + ty * L + Math.floor(p / L), 1, 1);
        }
      }
    }
    quadros.push(cv);
  }
  return quadros;
}

/** O MISSINGNO. DE VERDADE: o sprite do RED (assets/sprites/pokemon/missingno_rb.png,
 *  56x56, com as cores do Super Game Boy). Os quadrados de 8x8 todos brancos são
 *  o fundo (ficam transparentes); o resto é o desenho, parado como no RED.
 *
 *  E ELE PISCA O OLHO: o "olho" é a faixa de pontinhos escuros no alto da
 *  coluna, do lado esquerdo (no desenho, x 40-47, y 4-8). São dois quadros —
 *  aberto e fechado — e o fechado aparece por um instante a cada ~3 s.
 *  Enquanto o PNG não chegou, vale o desenhado (`missingnoQuadros`). */
let quadrosRB = null, pedindoRB = false;
const OLHO = { x: 40, y: 4, w: 8, h: 5 };       // no desenho de 56x56
function missingnoDoRed() {
  if (quadrosRB) return quadrosRB;
  if (!pedindoRB) {
    pedindoRB = true;
    loadImage(arquivo("assets/sprites/pokemon/missingno_rb.png")).then((img) => {
      if (!img) return;
      quadrosRB = montarRB(img);
      glitchCache.clear();                       // quem já desenhou o provisório troca
    });
  }
  return null;
}
function montarRB(img) {
  const { cv: aberto, ctx: b } = makeCanvas(64, 64);
  b.drawImage(img, 4, 8);
  const d = b.getImageData(0, 0, 64, 64);
  // os quadrados 8x8 todos brancos são o fundo
  for (let ty = 0; ty < 7; ty++) {
    for (let tx = 0; tx < 7; tx++) {
      const x0 = 4 + tx * 8, y0 = 8 + ty * 8;
      let branco = true;
      for (let y = y0; y < y0 + 8 && branco; y++) for (let x = x0; x < x0 + 8; x++) {
        const i = (y * 64 + x) * 4;
        if (d.data[i] < 240 || d.data[i + 1] < 240 || d.data[i + 2] < 240) { branco = false; break; }
      }
      if (branco) for (let y = y0; y < y0 + 8; y++) for (let x = x0; x < x0 + 8; x++) d.data[(y * 64 + x) * 4 + 3] = 0;
    }
  }
  b.putImageData(d, 0, 0);
  // o olho FECHADO: a área do olho vira a cor clara, com a pálpebra (uma linha escura) no meio
  const { cv: fechado, ctx: f } = makeCanvas(64, 64);
  f.drawImage(aberto, 0, 0);
  const ox = 4 + OLHO.x, oy = 8 + OLHO.y;
  f.fillStyle = "#f8e8f8";
  f.fillRect(ox, oy, OLHO.w, OLHO.h);
  f.fillStyle = "#181010";
  f.fillRect(ox, oy + Math.floor(OLHO.h / 2), OLHO.w, 1);
  return { aberto, fechado };
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
// sem parar). O MISSINGNO. normal é o sprite do RED piscando o olho
// (`missingnoDoRed`); o megado tem seis e fica trocando, porque esse não para quieto.
const MEGA_QUADROS = 6;
const glitchCache = new Map();
function glitchSprite(mega, seed) {
  const chave = `${mega ? "m" : "n"}|${seed}`;
  let quadros = glitchCache.get(chave);
  if (!quadros) {
    if (glitchCache.size > 48) glitchCache.clear();   // sessão longa: recomeça do zero
    // o do RED: parado, só pisca o olho (um quadro fechado a cada ~3 s)
    const rb = !mega && missingnoDoRed();
    if (rb) return performance.now() % 2800 < 170 ? rb.fechado : rb.aberto;
    quadros = mega
      ? Array.from({ length: MEGA_QUADROS }, (_, i) => megaNullmonSprite(seed * 31 + i * 977 + 1))
      : missingnoQuadros(seed);
    glitchCache.set(chave, quadros);
  }
  if (quadros.length === 1) return quadros[0];
  // o megado troca rápido (não para quieto); o do RED se reescreve mais devagar
  return quadros[((performance.now() / (mega ? 110 : 160)) | 0) % quadros.length];
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
// O desenho é montado com os dois sprites que já existem, em
// src/systems/montagem.js: a cabeça sai inteira pelo pescoço, o corpo perde a
// cabeça dele e ganha as cores da nova. Serve tanto pra arte provisória
// (16x16) quanto pros PNGs (96x96): o tamanho sai do maior dos dois.
const fusaoCache = new Map();

const idImg = (img) => img.__id || (img.__id = Math.random().toString(36).slice(2));

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

function comporFusao(sp, lado, seed) {
  const frente = lado !== "costas";
  const cab = frente ? Assets.mon(sp.fusao.cabeca, seed) : Assets.monBack(sp.fusao.cabeca, seed);
  const cor = frente ? Assets.mon(sp.fusao.corpo, seed) : Assets.monBack(sp.fusao.corpo, seed);
  // a TRIPLA: o terceiro dá as pernas (src/systems/montagem.js, montarTripla)
  if (sp.fusao.pernas) {
    const per = frente ? Assets.mon(sp.fusao.pernas, seed) : Assets.monBack(sp.fusao.pernas, seed);
    const n = (id) => { const e = DB.SPECIES[id]; return e?.spriteDex || e?.dex; };
    return frente
      ? montarTripla(cab, cor, per, DB.FUSAO?.editor?.tamanho || 64, CARA_DITTO[n(sp.fusao.cabeca)], CARA_DITTO[n(sp.fusao.corpo)], CARAS_FUSAO[n(sp.fusao.cabeca)])
      : montarTripla(cab, cor, per, DB.FUSAO?.editor?.tamanho || 64);
  }
  // sempre 64x64: é o tamanho do sprite do jogo, e é o tamanho em que o
  // jogador desenha na oficina. Quem monta é src/systems/montagem.js — a mesma
  // conta da oficina de fora (fusionglitch/).
  // PELA CARA (src/systems/montagem.js, montarFusaoCara): de frente, quando os
  // dois têm a cara marcada (as CARAS DE DITTO, src/data/cara-ditto.json)
  if (frente) {
    const n = (id) => { const e = DB.SPECIES[id]; return e?.spriteDex || e?.dex; };
    const pc = CARA_DITTO[n(sp.fusao.cabeca)], pb = CARA_DITTO[n(sp.fusao.corpo)];
    const pelaCara = pc && pb && montarFusaoCara(cab, cor, DB.FUSAO?.editor?.tamanho || 64, pc, pb, CARAS_FUSAO[n(sp.fusao.cabeca)]);
    if (pelaCara) return pelaCara;
  }
  return montarFusao(cab, cor, DB.FUSAO?.editor?.tamanho || 64, frente ? DB.CABECAS_MARCADAS?.[sp.fusao.cabeca] : null,
    { pescoco: PESCOCUDOS[sp.fusao.cabeca] || 0 });
}

// OS PESCOÇUDOS (pedido do CAIO: "um gyarados + machamp fica um machamp
// pescoçudo com cara de gyarados"): quem dá a CABEÇA e tem pescoço comprido leva
// o pescoço junto — o corpo ganha um pescoção na cor da cabeça. O número é o
// tamanho (1 = um pescoço bom; 1,5 = de cobra ou de dinossauro).
const PESCOCUDOS = {
  gyarados: 1.4, onix: 1.2, steelix: 1.2, dragonair: 1.3, dratini: 1, lapras: 1.1, seviper: 1.3, ekans: 1, arbok: 1.3,
  rayquaza: 1.5, milotic: 1.3, girafarig: 1.1, farigiraf: 1.4, exeggutoralola: 1.5, tyrantrum: 1, aurorus: 1.3, amaura: 1,
  meganium: 1, dodrio: 1, doduo: 0.8, aerodactyl: 0.8, gyaradosmega: 1.4, wailord: 0, serperior: 1.2, eternatus: 1.2,
};

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
  const c = !sp.fusao.pernas ? null
    : frente ? Assets.mon(sp.fusao.pernas, seed) : Assets.monBack(sp.fusao.pernas, seed);
  const chave = `${sp.id}|${lado}|${idImg(a)}|${idImg(b)}` + (c ? `|${idImg(c)}` : "");
  let img = fusaoCache.get(chave);
  if (!img) {
    if (fusaoCache.size > 240) fusaoCache.clear();      // sessão longa: recomeça
    img = comporFusao(sp, lado, seed);
    fusaoCache.set(chave, img);
  }
  return img;
}

// OS CARDUMES DESENHADOS À MÃO (tools/cardumes/<espécie>.py): pedidos uma vez
const cardumes = new Map();
function cardumeDesenhado(base) {
  if (!cardumes.has(base)) {
    cardumes.set(base, null);
    const img = new Image();
    img.onload = () => cardumes.set(base, img);
    img.src = arquivo(`assets/sprites/pokemon/cardume/${base}.png`);
  }
  return cardumes.get(base);
}

/** "#de8b4a" -> [222, 139, 74] */
const corDeHex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

// ---------------------------------------------------------- o LUMINOSO
// A MESMA CONTA DO colorsys.rgb_to_hls do Python, operação por operação: as
// prévias dos luminosos são feitas em Python, e com a conta igual o jogo pinta
// EXATAMENTE o que a prévia mostrou (até o pixel que cai bem na beirada de uma
// regra, como um matiz de 40° certinho)
function paraHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const maxc = Math.max(r, g, b), minc = Math.min(r, g, b);
  const sumc = maxc + minc, rangec = maxc - minc, l = sumc / 2.0;
  if (minc === maxc) return [0, 0, l];
  const s = l <= 0.5 ? rangec / sumc : rangec / (2.0 - sumc);
  const rc = (maxc - r) / rangec, gc = (maxc - g) / rangec, bc = (maxc - b) / rangec;
  let h = r === maxc ? bc - gc : g === maxc ? 2.0 + rc - bc : 4.0 + gc - rc;
  h = (h / 6.0) % 1.0;
  if (h < 0) h += 1.0;
  return [h * 360, s, l];
}
function deHsl(h, s, l) {
  const f = (n) => {
    const k = (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
    return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))));
  };
  return [f(0), f(8), f(4)];
}

/** O REPAGINADO: as cores do shiny mais claras e mais vivas; o contorno (quase
 *  preto) e o branco ficam como estão, pra o desenho não virar borrão. */
function repaginar(px) {
  for (let i = 0; i < px.length; i += 4) {
    if (!px[i + 3]) continue;
    const [h, s, l] = paraHsl(px[i], px[i + 1], px[i + 2]);
    if (l < 0.16 || l > 0.94) continue;
    const [r, g, b] = deHsl(h, Math.min(1, s * 1.35 + 0.08), Math.min(0.9, l * 0.8 + 0.2));
    px[i] = r; px[i + 1] = g; px[i + 2] = b;
  }
}

/** Troca as cores por FAIXA DE MATIZ: cada regra pega os pixels daquela cor
 *  (`h`: [de, até] em graus, `s`: saturação mínima) e põe na rampa dela, do
 *  claro pro escuro, pela luz do pixel. O resto (contorno, cinza, olho) fica. */
// sem folga nas beiradas: a conta da cor (paraHsl) é a mesma da prévia
const E = 0;
function pintarPorMatiz(px, regras) {
  for (let i = 0; i < px.length; i += 4) {
    if (!px[i + 3]) continue;
    const [hh, ss, ll] = paraHsl(px[i], px[i + 1], px[i + 2]);
    // `cinza`: [luz mínima, máxima] pega os cinzas e pretos (sem cor), deixando
    // de fora o contorno mais escuro e o branco
    const r = regras.find((g) => (g.cinza
      ? ss < 0.12 && ll >= g.cinza[0] - E && ll <= g.cinza[1] + E
      : hh >= g.h[0] - E && hh <= g.h[1] + E && ss >= (g.s ?? 0.2) - E && (!g.l || (ll >= g.l[0] - E && ll <= g.l[1] + E))));
    if (!r) continue;
    const k = ll > 0.55 ? 0 : ll > 0.33 ? 1 : ll > 0.2 ? 2 : 3;
    const nova = r.rampa[Math.min(k, r.rampa.length - 1)];
    px[i] = nova[0]; px[i + 1] = nova[1]; px[i + 2] = nova[2];
  }
}

/** As LUMINOSAS PINTADAS À MÃO: o que cada cor do sprite de sempre vira. Vale
 *  pra qualquer desenho da espécie (o parado, o de costas, o animado), porque
 *  separa as partes pela cor — não pela posição exata do pixel. */
// as rampas (do claro pro escuro) que as pinturas usam
const RAMPA = {
  indigo: [[100, 116, 236], [66, 74, 200], [44, 46, 152], [30, 30, 104]],
  chamaAzul: [[206, 244, 255], [124, 212, 248], [70, 160, 222]],
  ouro: [[255, 216, 92], [228, 172, 40], [172, 118, 24], [120, 80, 16]],
  jade: [[124, 232, 174], [62, 192, 132], [32, 142, 98], [20, 96, 66]],
  cascoVermelho: [[255, 228, 156], [204, 72, 62], [144, 40, 44], [96, 26, 30]],
  verdeEscuro: [[72, 150, 72], [44, 112, 52], [28, 80, 38], [18, 56, 26]],
  vermelho: [[240, 92, 80], [200, 48, 48], [150, 30, 36], [100, 20, 26]],
  azul: [[120, 176, 255], [62, 112, 232], [36, 70, 170]],
  rosa: [[255, 176, 214], [238, 124, 182], [192, 82, 142], [140, 54, 104]],
  magenta: [[252, 146, 204], [228, 92, 164], [172, 58, 122], [120, 36, 86]],
  lavanda: [[238, 218, 255], [204, 176, 242], [160, 130, 210]],
  celeste: [[146, 204, 255], [94, 162, 238], [62, 116, 192], [42, 80, 142]],
  perola: [[255, 242, 250], [242, 204, 228], [212, 164, 198]],
  abobora: [[255, 172, 74], [240, 130, 42], [192, 88, 28], [132, 58, 20]],
  verdeLuz: [[170, 255, 128], [96, 222, 84], [56, 160, 50]],
  lilas: [[242, 194, 255], [214, 152, 242], [170, 112, 212], [122, 78, 162]],
  morango: [[252, 124, 144], [216, 72, 102], [162, 44, 72], [112, 28, 50]],
  chantilly: [[255, 248, 238], [242, 222, 208], [212, 188, 172]],
  menta: [[186, 255, 216], [124, 232, 182], [72, 182, 142]],
  roxo: [[204, 144, 255], [154, 94, 222], [110, 60, 172]],
  marinho: [[74, 84, 146], [48, 54, 108], [32, 36, 76], [22, 24, 54]],
  violeta: [[202, 142, 255], [162, 98, 232], [118, 62, 182], [82, 42, 132]],
  ciano: [[164, 242, 255], [94, 204, 242], [52, 152, 204]],
  ouroClaro: [[255, 244, 212], [238, 214, 160], [198, 170, 110], [152, 126, 80]],
  carmim: [[242, 92, 112], [202, 52, 82], [142, 32, 58]],
  nuvem: [[192, 220, 255], [146, 186, 246], [100, 142, 220], [60, 88, 168]],
  prata: [[244, 246, 255], [200, 206, 226], [150, 158, 186], [100, 106, 136]],
  coral: [[255, 190, 170], [250, 128, 104], [204, 80, 64], [140, 48, 40]],
  azulNoite: [[64, 76, 128], [38, 46, 90], [24, 30, 62], [14, 18, 40]],
  neon: [[255, 255, 190], [255, 255, 60], [255, 228, 0], [220, 170, 0]],
  amareloPikachu: [[246, 230, 82], [246, 189, 32], [222, 148, 0], [156, 82, 0]],   // as cores do PIKACHU de sempre
  esmeralda: [[120, 240, 140], [40, 200, 90], [20, 140, 60], [10, 90, 40]],
  mentaClara: [[186, 255, 216]],
  menta4: [[90, 210, 165], [40, 140, 110], [20, 84, 66], [12, 56, 44]],
  rubi: [[240, 80, 110], [200, 30, 70], [140, 16, 48], [90, 8, 30]],
  _rubiEsc: [[150, 28, 64]],
  _k1: [[255, 250, 210]],
  _k2: [[255, 234, 96]],
  _k3: [[250, 206, 48]],
  _k4: [[222, 158, 26]],
  _k5: [[255, 234, 96]],
  _k6: [[250, 206, 48]],
  _k7: [[222, 158, 26]],
  perolaK: [[255, 240, 248], [240, 200, 222], [200, 150, 180], [140, 100, 128]],
  _k8: [[255, 250, 210]],
  _k9: [[255, 234, 96]],
  _k10: [[150, 98, 12]],
  _k11: [[250, 206, 48]],
  _k12: [[222, 158, 26]],
  _k13: [[255, 222, 150]],
  _k14: [[255, 170, 64]],
  _k15: [[238, 124, 24]],
  _k16: [[190, 84, 14]],
  violetaN: [[176, 112, 240], [120, 64, 200], [78, 36, 150], [48, 20, 100]],
  _k17: [[255, 222, 150]],
  _k18: [[255, 170, 64]],
  _k19: [[238, 124, 24]],
  _k20: [[190, 84, 14]],
  _k21: [[255, 222, 150]],
  _k22: [[255, 170, 64]],
  _k23: [[238, 124, 24]],
  _k24: [[190, 84, 14]],
  ouroNido: [[255, 236, 120], [246, 196, 40], [196, 138, 16], [128, 84, 8]],
  _k25: [[214, 98, 162]],
  _k26: [[255, 196, 226]],
  _k27: [[246, 140, 192]],
  _k28: [[130, 46, 94]],
  _k29: [[214, 98, 162]],
  _k30: [[255, 196, 226]],
  _k31: [[246, 140, 192]],
  _k32: [[130, 46, 94]],
  _k33: [[96, 170, 244]],
  _k34: [[66, 136, 232]],
  _k35: [[44, 102, 206]],
  _k36: [[218, 244, 255]],
  _k37: [[166, 224, 255]],
  _k38: [[116, 194, 250]],
  _k39: [[34, 64, 150]],
  _k40: [[22, 40, 106]],
  _k41: [[218, 244, 255]],
  _k42: [[166, 224, 255]],
  _k43: [[116, 194, 250]],
  _k44: [[96, 170, 244]],
  _k45: [[66, 136, 232]],
  _k46: [[44, 102, 206]],
  _k47: [[34, 64, 150]],
  _k48: [[22, 40, 106]],
  _k49: [[60, 100, 190]],
  _k50: [[204, 250, 255]],
  _k51: [[110, 226, 250]],
  _k52: [[56, 188, 236]],
  _k53: [[34, 146, 204]],
  _k54: [[204, 250, 255]],
  _k55: [[110, 226, 250]],
  _k56: [[56, 188, 236]],
  _k57: [[34, 146, 204]],
  _k58: [[204, 250, 255]],
  _k59: [[110, 226, 250]],
  _k60: [[56, 188, 236]],
  _k61: [[34, 146, 204]],
  _k62: [[190, 220, 255]],
  _k63: [[120, 166, 250]],
  _k64: [[80, 126, 236]],
  _k65: [[50, 84, 190]],
  _k66: [[32, 52, 140]],
  _k67: [[190, 220, 255]],
  _k68: [[120, 166, 250]],
  _k69: [[80, 126, 236]],
  _k70: [[50, 84, 190]],
  _k71: [[32, 52, 140]],
  _k72: [[120, 166, 250]],
  _k73: [[80, 126, 236]],
  _k74: [[50, 84, 190]],
  _k75: [[32, 52, 140]],
  _k76: [[240, 244, 252]],
  _k77: [[196, 204, 226]],
  _k78: [[140, 150, 182]],
  _k79: [[80, 88, 118]],
  _k80: [[200, 255, 228]],
  _k81: [[130, 234, 190]],
  _k82: [[70, 190, 150]],
  _k83: [[30, 116, 92]],
  _k84: [[200, 255, 228]],
  _k85: [[130, 234, 190]],
  _k86: [[70, 190, 150]],
  _k87: [[30, 116, 92]],
  _k88: [[240, 80, 110]],
  _k89: [[200, 30, 70]],
  _k90: [[96, 12, 40]],
  sonho: [[208, 160, 255], [160, 96, 236], [110, 58, 190], [70, 32, 130]],
  _k91: [[160, 96, 236]],
  _k92: [[110, 58, 190]],
  _k93: [[70, 32, 130]],
  _k94: [[156, 204, 255]],
  _k95: [[92, 152, 250]],
  _k96: [[56, 108, 238]],
  _k97: [[36, 70, 186]],
  _k98: [[20, 40, 120]],
  _kb0: [[156, 204, 255]],
  _k99: [[156, 204, 255]],
  _k100: [[92, 152, 250]],
  _k101: [[56, 108, 238]],
  _k102: [[36, 70, 186]],
  _k103: [[20, 40, 120]],
  _k104: [[214, 240, 255]],
  _k105: [[160, 214, 255]],
  _k106: [[120, 186, 250]],
  _k107: [[72, 140, 230]],
  _k108: [[44, 90, 180]],
  _k109: [[26, 56, 120]],
  _k110: [[214, 240, 255]],
  _k111: [[160, 214, 255]],
  _k112: [[120, 186, 250]],
  _k113: [[72, 140, 230]],
  _k114: [[44, 90, 180]],
  _k115: [[26, 56, 120]],
  sakura: [[255, 200, 226], [246, 140, 190], [200, 86, 146], [130, 50, 96]],
  indigoK: [[120, 130, 250], [70, 76, 214], [42, 44, 150], [26, 26, 96]],
  _gold0: [[172, 182, 255]],
  _gold1: [[208, 210, 242]],
  fogoA1: [[236, 250, 255], [236, 250, 255], [236, 250, 255], [236, 250, 255]],
  fogoA2: [[150, 226, 255], [150, 226, 255], [150, 226, 255], [150, 226, 255]],
  fogoA3: [[70, 150, 255], [70, 150, 255], [70, 150, 255], [70, 150, 255]],
  fogoA4: [[36, 96, 220], [36, 96, 220], [36, 96, 220], [36, 96, 220]],
  rubiJohto: [[255, 120, 110], [226, 44, 52], [158, 20, 40], [98, 10, 28]],
  sakuraSk: [[255, 196, 224], [246, 140, 190], [204, 86, 148], [140, 48, 100]],
  anil: [[120, 140, 255], [78, 90, 226], [52, 56, 170], [32, 32, 112]],
  rubiSk: [[255, 120, 130], [222, 48, 72], [160, 24, 52], [100, 12, 36]],
  neonSk: [[255, 150, 230], [240, 80, 196], [184, 40, 150], [120, 20, 100]],
  jadeF: [[130, 240, 190], [54, 196, 140], [28, 140, 100], [14, 84, 62]],
  azulF: [[130, 196, 255], [64, 136, 236], [36, 88, 186], [20, 54, 126]],
  lilasF: [[238, 206, 255], [206, 156, 246], [156, 104, 206], [104, 66, 150]],
  violetaF: [[214, 160, 255], [166, 98, 236], [116, 58, 186], [70, 30, 126]],
};
// `l`: [luz mínima, máxima] — só pinta os pixels dessa claridade (o gás do GASTLY sim, a bola não)
const faixa = (de, ate, rampa, s = 0.2, l = null) => ({ h: [de, ate], s, l, rampa: RAMPA[rampa] });

export const LUMINOSO_PINTURA = {
  // ---- O PÁSSARO DO SOL (o CAIO escolheu "dourado e fogo", nov/2026): o
  // BRAVIARY DE HISUI com as asas DOURADAS, o corpo LARANJA-FOGO, a crista de
  // penas virando CHAMA (amarela no claro, vermelha no fundo) e o roxo em vermelho
  braviaryhisui(px) {
    const OURO = [[255, 226, 110], [236, 182, 44], [184, 124, 22], [124, 80, 14]];
    const FOGO = [[255, 176, 72], [236, 112, 30], [184, 64, 18], [112, 32, 10]];
    const CHAMA = [[255, 250, 200], [255, 220, 90], [250, 140, 40], [210, 54, 30]];
    const VERM = [[255, 110, 90], [222, 52, 44], [160, 24, 30], [96, 12, 18]];
    const rampa = (R, l) => R[l > 0.75 ? 0 : l > 0.5 ? 1 : l > 0.3 ? 2 : 3];
    for (let i = 0; i < px.length; i += 4) {
      if (!px[i + 3]) continue;
      const [h, sat, l] = paraHsl(px[i], px[i + 1], px[i + 2]);
      if (l < 0.08) continue;                                   // o contorno fica
      let c = null;
      if (sat < 0.2 && l > 0.82) c = rampa(CHAMA, l - 0.25 + (((i >> 2) % 7) * 0.02));   // a crista branca: CHAMA
      else if (sat < 0.2 && h >= 200 && h <= 280) c = rampa(FOGO, l + 0.2);           // o corpo escuro: FOGO
      else if (sat < 0.2) c = rampa(OURO, l + 0.1);                                    // o marrom das asas: OURO
      else if (h >= 260 && h <= 320) c = rampa(VERM, l);                               // o roxo: VERMELHO
      else if (h >= 35 && h <= 60) c = rampa(OURO, l + 0.15);                          // bico e garras: ouro claro
      if (c) { px[i] = c[0]; px[i + 1] = c[1]; px[i + 2] = c[2]; }
    }
  },
  // ---- a CHAMA AZUL: o fogo da linha CHARMANDER queimando frio
  charmander(px) { pintarPorMatiz(px, [faixa(28, 62, "chamaAzul"), faixa(0, 28, "indigo"), faixa(345, 360, "indigo")]); },
  charmeleon(px) { pintarPorMatiz(px, [faixa(28, 62, "chamaAzul"), faixa(0, 28, "indigo"), faixa(345, 360, "indigo")]); },
  /** o DRAGÃO DA MEIA-NOITE: corpo índigo, chama e barriga azul-gelo, e o
   *  dentro das asas dourado */
  charizard(px) { pintarPorMatiz(px, [faixa(170, 215, "ouro"), faixa(28, 62, "chamaAzul"), faixa(0, 28, "indigo"), faixa(345, 360, "indigo")]); },
  // ---- a TARTARUGA DE JADE: pele verde-jade, casco vermelho e barriga creme
  squirtle(px) { pintarPorMatiz(px, [faixa(140, 275, "jade"), faixa(5, 62, "cascoVermelho")]); },
  wartortle(px) { pintarPorMatiz(px, [faixa(140, 275, "jade"), faixa(5, 62, "cascoVermelho")]); },
  blastoise(px) { pintarPorMatiz(px, [faixa(170, 275, "jade"), faixa(5, 62, "cascoVermelho")]); },
  // ---- a linha do BULBASAUR do jeito que você escolheu: verde-escuro, planta vermelha, flor azul
  ivysaur(px) { pintarPorMatiz(px, [faixa(150, 205, "verdeEscuro", 0.15), faixa(65, 115, "vermelho"), faixa(320, 360, "azul", 0.3), faixa(0, 15, "azul", 0.4)]); },
  venusaur(px) { pintarPorMatiz(px, [faixa(120, 175, "verdeEscuro", 0.15), faixa(80, 120, "vermelho"), faixa(340, 360, "azul", 0.3), faixa(0, 28, "azul", 0.3)]); },
  /** PIKACHU NEON (o CAIO escolheu): amarelo neon, bochechas azul CERULEAN e
   *  as listras marrons de sempre. Os 4 amarelos do sprite viram 4 neons. */
  pikachu(px) {
    const NEON = [[255, 255, 190], [255, 255, 60], [255, 228, 0], [220, 170, 0]];   // o A: sem verde nenhum
    const CERULEAN = [[42, 159, 214], [0, 123, 167]];
    for (let i = 0; i < px.length; i += 4) {
      if (!px[i + 3]) continue;
      const [h, s, l] = paraHsl(px[i], px[i + 1], px[i + 2]);
      let nova = null;
      if (h >= 38 && h <= 62 && s >= 0.2) nova = NEON[l > 0.75 ? 0 : l > 0.6 ? 1 : l > 0.5 ? 2 : 3];
      else if ((h <= 15 || h >= 345) && s >= 0.4) nova = CERULEAN[l > 0.5 ? 0 : 1];
      if (nova) { px[i] = nova[0]; px[i + 1] = nova[1]; px[i + 2] = nova[2]; }
    }
  },
  raichu(px) { pintarPorMatiz(px, [faixa(22, 40, "magenta"), faixa(40, 65, "lavanda"), faixa(0, 22, "ciano", 0.4)]); },
  /** EEVEE CELESTE: azul-céu com a gola de pérola */
  eevee(px) { pintarPorMatiz(px, [faixa(15, 40, "celeste"), faixa(40, 65, "perola", 0.1)]); },
  /** GENGAR ABÓBORA: laranja de Halloween e os olhos verdes acesos */
  // (nov/2026: o sprite novo é roxo-azulado, 245–305; a faixa velha deixava meio corpo roxo)
  gengar(px) { pintarPorMatiz(px, [faixa(245, 305, "abobora", 0.2, [0, 0.9]), faixa(0, 15, "verdeLuz", 0.4)]); },
  /** GYARADOS DE JADE E OURO */
  gyarados(px) { pintarPorMatiz(px, [faixa(190, 255, "jade"), faixa(40, 70, "ouro")]); },
  /** DRAGONITE LILÁS de asas douradas */
  dragonite(px) { pintarPorMatiz(px, [faixa(160, 200, "ouro"), faixa(25, 70, "lilas")]); },
  /** SNORLAX MORANGO COM CHANTILLY */
  // (nov/2026: o corpo do sprite novo é azul, 185–215; a faixa velha não pegava nada)
  snorlax(px) { pintarPorMatiz(px, [faixa(185, 215, "morango", 0.3), faixa(20, 50, "chantilly", 0.1)]); },
  /** JIGGLYPUFF DE NUVEM: azul bem clarinho, de algodão, com os olhos rosa */
  jigglypuff(px) { pintarPorMatiz(px, [faixa(225, 270, "rosa"), faixa(0, 25, "nuvem"), faixa(340, 360, "nuvem")]); },
  /** PSYDUCK LILÁS */
  psyduck(px) { pintarPorMatiz(px, [faixa(20, 65, "lilas")]); },
  /** UMBREON DA MADRUGADA: o preto vira azul-marinho, os anéis rosa e os olhos dourados */
  umbreon(px) { pintarPorMatiz(px, [{ cinza: [0.12, 0.6], rampa: RAMPA.marinho }, faixa(30, 70, "magenta"), faixa(0, 15, "ouro", 0.4)]); },
  /** MAGIKARP VIOLETA de barbatanas ciano */
  magikarp(px) { pintarPorMatiz(px, [faixa(40, 75, "ciano"), faixa(0, 30, "violeta"), faixa(345, 360, "violeta")]); },
  /** MEWTWO DOURADO de cauda carmim */
  // (nov/2026: no sprite novo o corpo e a cauda são os dois lilás; a cauda é o lilás forte)
  mewtwo(px) { pintarPorMatiz(px, [faixa(265, 300, "carmim", 0.4), faixa(230, 310, "ouroClaro", 0.08)]); },

  /** BULBASAUR: o corpo verde-escuro, o bulbo vermelho, e os olhos e a boca
   *  (que são vermelhos) azuis. */
  bulbasaur(px) {
    pintarPorMatiz(px, [
      { h: [135, 205], s: 0.15, rampa: [[72, 150, 72], [44, 112, 52], [28, 80, 38], [18, 56, 26]] },
      { h: [65, 115], s: 0.2, rampa: [[240, 92, 80], [200, 48, 48], [150, 30, 36], [100, 20, 26]] },
      { h: [0, 15], s: 0.4, rampa: [[120, 176, 255], [62, 112, 232], [36, 70, 170]] },
      { h: [340, 360], s: 0.4, rampa: [[120, 176, 255], [62, 112, 232], [36, 70, 170]] },
    ]);
  },
  /** LUCARIO: o azul virou verde, o pelo creme do peito, amarelo, e o preto da
   *  máscara e das patas, azul-claro, e os olhos vermelhos, rosa. O contorno fica. */
  lucario(px) {
    pintarPorMatiz(px, [
      { cinza: [0.15, 0.6], rampa: [[150, 214, 250], [104, 180, 236], [70, 142, 210], [52, 108, 176]] },
      // os olhos vermelhos, rosa
      { h: [0, 15], s: 0.4, rampa: [[255, 156, 206], [236, 96, 164], [182, 58, 122]] },
      { h: [340, 360], s: 0.4, rampa: [[255, 156, 206], [236, 96, 164], [182, 58, 122]] },
      { h: [180, 245], s: 0.3, rampa: [[120, 222, 92], [58, 168, 62], [26, 104, 44], [16, 66, 30]] },
      { h: [45, 75], s: 0.25, rampa: [[252, 228, 70], [224, 180, 32], [156, 114, 20]] },
    ]);
  },
  // ---- OS 8 QUE O CAIO ESCOLHEU (nov/2026), dos 23 que eu inventei
  /** MEW MENTA */
  mew(px) { pintarPorMatiz(px, [faixa(300, 345, "menta", 0.3)]); },
  /** GROWLITHE AZUL: o laranja vira azul, as listras pretas e o creme ficam */
  growlithe(px) { pintarPorMatiz(px, [faixa(0, 35, "azul", 0.4), faixa(345, 360, "azul", 0.4)]); },
  /** ABRA CIANO: o amarelo vira ciano, a armadura marrom fica */
  abra(px) { pintarPorMatiz(px, [faixa(36, 62, "ciano", 0.5, [0.36, 1])]); },
  /** GASTLY DE GÁS VERDE: só o gás muda, a bola preta fica */
  gastly(px) { pintarPorMatiz(px, [faixa(290, 330, "verdeLuz", 0.12, [0.3, 1])]); },
  /** CUBONE JADE de caveira dourada */
  cubone(px) { pintarPorMatiz(px, [faixa(220, 260, "ouroClaro", 0.1), faixa(0, 60, "jade", 0.15, [0.3, 0.7])]); },
  /** VAPOREON MAGENTA */
  vaporeon(px) { pintarPorMatiz(px, [faixa(185, 205, "magenta", 0.4)]); },
  /** JOLTEON CIANO */
  jolteon(px) { pintarPorMatiz(px, [faixa(40, 62, "ciano", 0.5)]); },
  /** FLAREON ÍNDIGO de gola azul-chama */
  flareon(px) { pintarPorMatiz(px, [faixa(30, 60, "chamaAzul", 0.4), faixa(0, 22, "indigo", 0.4), faixa(340, 360, "indigo", 0.4)]); },

  // ---- MAIS 8 QUE O CAIO ESCOLHEU (nov/2026), dos 25 que eu inventei
  /** BUTTERFREE DE ASAS DOURADAS */
  butterfree(px) { pintarPorMatiz(px, [faixa(230, 250, "ouro", 0.4, [0.6, 1]), faixa(230, 275, "marinho", 0.15, [0.2, 0.6])]); },
  /** SANDSHREW PRATA */
  sandshrew(px) { pintarPorMatiz(px, [faixa(38, 62, "prata", 0.7)]); },
  /** MAGNEMITE DOURADO */
  magnemite(px) { pintarPorMatiz(px, [{ cinza: [0.15, 0.9], rampa: RAMPA.ouro }, faixa(120, 165, "ouro", 0.15)]); },
  /** GRIMER VERDE-LUZ */
  grimer(px) { pintarPorMatiz(px, [faixa(270, 315, "verdeLuz", 0.3)]); },
  /** CHANSEY CELESTE */
  chansey(px) { pintarPorMatiz(px, [faixa(0, 10, "celeste", 0.3, [0.35, 1]), faixa(350, 360, "celeste", 0.3)]); },
  /** HORSEA CORAL */
  horsea(px) { pintarPorMatiz(px, [faixa(195, 220, "coral", 0.25)]); },
  /** DRATINI ROSA */
  dratini(px) { pintarPorMatiz(px, [faixa(225, 240, "rosa", 0.4)]); },
  /** PORYGON AMARELO PIKACHU E AZUL-NOITE (as duas cores trocadas de lugar, a pedido) */
  porygon(px) { pintarPorMatiz(px, [faixa(185, 200, "amareloPikachu", 0.7), faixa(0, 22, "azulNoite", 0.5), faixa(340, 360, "azulNoite", 0.5)]); },

  // ---- AS FAMÍLIAS (nov/2026): cada evolução acende com a luz do bicho que o
  // CAIO escolheu, pra o luminoso continuar luminoso do mesmo jeito quando evolui
  /** ARCANINE AZUL (do GROWLITHE) */
  arcanine(px) { pintarPorMatiz(px, [faixa(0, 33, "azul", 0.4, [0.4, 0.8]), faixa(345, 360, "azul", 0.4)]); },
  /** KADABRA CIANO (do ABRA) */
  kadabra(px) { pintarPorMatiz(px, [faixa(40, 62, "ciano", 0.5, [0.36, 1])]); },
  /** ALAKAZAM CIANO (do ABRA) */
  alakazam(px) { pintarPorMatiz(px, [faixa(40, 62, "ciano", 0.5, [0.36, 1])]); },
  /** HAUNTER VERDE (do GASTLY) */
  haunter(px) { pintarPorMatiz(px, [faixa(260, 345, "verdeLuz", 0.15)]); },
  /** MAROWAK JADE (do CUBONE) */
  marowak(px) { pintarPorMatiz(px, [{ cinza: [0.7, 0.95], rampa: RAMPA.ouroClaro }, faixa(220, 260, "ouroClaro", 0.05), faixa(0, 60, "jade", 0.15, [0.3, 0.7])]); },
  /** MAGNETON DOURADO (do MAGNEMITE) */
  magneton(px) { pintarPorMatiz(px, [{ cinza: [0.15, 0.9], rampa: RAMPA.ouro }, faixa(120, 165, "ouro", 0.15)]); },
  /** MAGNEZONE DOURADO (do MAGNEMITE) */
  magnezone(px) { pintarPorMatiz(px, [{ cinza: [0.15, 0.9], rampa: RAMPA.ouro }, faixa(205, 280, "ouro", 0.03)]); },
  /** MUK VERDE-LUZ (do GRIMER) */
  muk(px) { pintarPorMatiz(px, [faixa(270, 315, "verdeLuz", 0.3)]); },
  /** SEADRA CORAL (do HORSEA) */
  seadra(px) { pintarPorMatiz(px, [faixa(195, 220, "coral", 0.15)]); },
  /** KINGDRA CORAL (do HORSEA) */
  kingdra(px) { pintarPorMatiz(px, [faixa(195, 232, "coral", 0.25)]); },
  /** DRAGONAIR ROSA (do DRATINI) */
  dragonair(px) { pintarPorMatiz(px, [faixa(212, 240, "rosa", 0.4)]); },
  /** SANDSLASH PRATA (do SANDSHREW) */
  sandslash(px) { pintarPorMatiz(px, [faixa(44, 62, "prata", 0.7)]); },
  /** BLISSEY CELESTE (da CHANSEY) */
  blissey(px) { pintarPorMatiz(px, [faixa(330, 360, "celeste", 0.3)]); },
  /** PORYGON2 AMARELO E AZUL-NOITE */
  porygon2(px) { pintarPorMatiz(px, [faixa(195, 235, "amareloPikachu", 0.3), faixa(320, 360, "azulNoite", 0.2), faixa(0, 22, "azulNoite", 0.5)]); },
  /** PORYGON-Z AMARELO E AZUL-NOITE */
  porygonz(px) { pintarPorMatiz(px, [faixa(195, 235, "amareloPikachu", 0.3), faixa(320, 360, "azulNoite", 0.2), faixa(0, 22, "azulNoite", 0.5)]); },

  // ---- OS LUMINOSOS DOS AGENTES E OS MEUS (nov/2026): Kanto, Johto, Sinnoh/Kalos e as famílias dos antigos
  /** MUNCHLAX MORANGO COM CHANTILLY (do SNORLAX) */
  munchlax(px) { pintarPorMatiz(px, [faixa(175, 215, "morango", 0.3), faixa(20, 62, "chantilly", 0.1)]); },
  /** IGGLYBUFF DE NUVEM (do JIGGLYPUFF) */
  igglybuff(px) { pintarPorMatiz(px, [faixa(325, 360, "nuvem", 0.2), faixa(0, 25, "nuvem", 0.2)]); },
  /** WIGGLYTUFF DE NUVEM (do JIGGLYPUFF) */
  wigglytuff(px) { pintarPorMatiz(px, [faixa(225, 270, "rosa", 0.2), faixa(325, 360, "nuvem", 0.2), faixa(0, 25, "nuvem", 0.2)]); },
  /** GOLDUCK LILÁS (do PSYDUCK) */
  golduck(px) { pintarPorMatiz(px, [faixa(200, 245, "lilas", 0.2)]); },
  /** ESPEON DOURADO de joia esmeralda */
  espeon(px) { pintarPorMatiz(px, [faixa(335, 360, "esmeralda", 0.5), faixa(285, 330, "ouro", 0.2), faixa(255, 285, "ouro", 0.3)]); },
  /** LEAFEON DE FOLHAS DE CEREJEIRA */
  leafeon(px) { pintarPorMatiz(px, [faixa(135, 175, "rosa", 0.3)]); },
  /** GLACEON MENTA */
  glaceon(px) { pintarPorMatiz(px, [faixa(180, 240, "mentaClara", 0.15, [0.7, 1]), faixa(180, 240, "menta4", 0.15, [0, 0.7])]); },
  /** SYLVEON CELESTE de fitas rosa */
  sylveon(px) { pintarPorMatiz(px, [faixa(320, 360, "celeste", 0.2), faixa(190, 220, "rosa", 0.4)]); },
  /** NIDORAN FÊMEA DE OURO de pintas rubi */
  nidoranf(px) { pintarPorMatiz(px, [faixa(170, 215, "rubi", 0.4, [0.3, 0.45]), faixa(230, 250, "_rubiEsc", 0.3, [0.3, 0.45]), faixa(215, 250, "_k1", 0.2, [0.95, 1.0]), faixa(215, 250, "_k2", 0.2, [0.85, 0.95]), faixa(215, 250, "_k3", 0.2, [0.65, 0.85]), faixa(215, 250, "_k4", 0.2, [0.45, 0.65])]); },
  /** NIDORINA DE OURO de pintas rubi */
  nidorina(px) { pintarPorMatiz(px, [faixa(205, 225, "rubi", 0.6), faixa(185, 200, "rubi", 0.2, [0.25, 0.35]), faixa(180, 205, "_k5", 0.2, [0.8, 1.0]), faixa(180, 205, "_k6", 0.2, [0.6, 0.8]), faixa(180, 205, "_k7", 0.2, [0.45, 0.6])]); },
  /** NIDOQUEEN DE OURO de barriga pérola */
  nidoqueen(px) { pintarPorMatiz(px, [faixa(40, 60, "perolaK", 0.4), faixa(175, 200, "_k8", 0.15, [0.7, 1.0]), faixa(175, 200, "_k9", 0.15, [0.56, 0.7]), faixa(175, 200, "_k10", 0.15, [0.0, 0.56]), faixa(200, 215, "_k11", 0.15, [0.45, 1.0]), faixa(200, 215, "_k12", 0.15, [0.0, 0.45])]); },
  /** ZUBAT ABÓBORA de asas violeta */
  zubat(px) { pintarPorMatiz(px, [faixa(205, 255, "_k13", 0.3, [0.8, 1.0]), faixa(205, 255, "_k14", 0.3, [0.65, 0.8]), faixa(205, 255, "_k15", 0.3, [0.45, 0.65]), faixa(205, 255, "_k16", 0.3, [0.0, 0.45]), faixa(300, 325, "violetaN", 0.3)]); },
  /** GOLBAT ABÓBORA de asas violeta */
  golbat(px) { pintarPorMatiz(px, [faixa(200, 245, "_k17", 0.3, [0.75, 1.0]), faixa(200, 245, "_k18", 0.3, [0.62, 0.75]), faixa(200, 245, "_k19", 0.3, [0.45, 0.62]), faixa(200, 245, "_k20", 0.3, [0.0, 0.45]), faixa(295, 325, "violetaN", 0.3)]); },
  /** CROBAT ABÓBORA de asas violeta */
  crobat(px) { pintarPorMatiz(px, [faixa(270, 290, "_k21", 0.3, [0.62, 1.0]), faixa(270, 290, "_k22", 0.3, [0.5, 0.62]), faixa(270, 290, "_k23", 0.3, [0.4, 0.5]), faixa(270, 290, "_k24", 0.3, [0.0, 0.4]), faixa(195, 210, "violetaN", 0.3)]); },
  /** DIGLETT CHICLETE de nariz de ouro */
  diglett(px) { pintarPorMatiz(px, [faixa(0, 15, "ouroNido", 0.6), faixa(340, 360, "ouroNido", 0.6), faixa(0, 10, "_k25", 0.2, [0.0, 1.0]), faixa(10, 32, "_k26", 0.25, [0.58, 1.0]), faixa(10, 32, "_k27", 0.25, [0.4, 0.58]), faixa(10, 32, "_k28", 0.25, [0.0, 0.4])]); },
  /** DUGTRIO CHICLETE de nariz de ouro */
  dugtrio(px) { pintarPorMatiz(px, [faixa(0, 15, "ouroNido", 0.6), faixa(340, 360, "ouroNido", 0.6), faixa(0, 10, "_k29", 0.2, [0.0, 1.0]), faixa(10, 32, "_k30", 0.25, [0.58, 1.0]), faixa(10, 32, "_k31", 0.25, [0.4, 0.58]), faixa(10, 32, "_k32", 0.25, [0.0, 0.4])]); },
  /** MANKEY DE GELO */
  mankey(px) { pintarPorMatiz(px, [faixa(18, 36, "_k33", 0.5, [0.7, 1.0]), faixa(18, 36, "_k34", 0.5, [0.6, 0.7]), faixa(18, 36, "_k35", 0.5, [0.45, 0.6]), faixa(10, 62, "_k36", 0.3, [0.87, 1.0]), faixa(10, 62, "_k37", 0.3, [0.79, 0.87]), faixa(10, 62, "_k38", 0.3, [0.68, 0.79]), faixa(10, 62, "_k39", 0.3, [0.27, 1.0]), faixa(10, 62, "_k40", 0.3, [0.0, 0.27])]); },
  /** PRIMEAPE DE GELO */
  primeape(px) { pintarPorMatiz(px, [faixa(15, 62, "_k41", 0.3, [0.87, 1.0]), faixa(15, 62, "_k42", 0.3, [0.79, 0.87]), faixa(15, 62, "_k43", 0.3, [0.68, 0.79]), faixa(15, 36, "_k44", 0.5, [0.7, 1.0]), faixa(15, 36, "_k45", 0.5, [0.6, 0.7]), faixa(15, 36, "_k46", 0.5, [0.45, 0.6]), faixa(15, 62, "_k47", 0.3, [0.27, 1.0]), faixa(15, 62, "_k48", 0.3, [0.0, 0.27]), faixa(0, 10, "_k49", 0.15, [0.4, 1.0])]); },
  /** BELLSPROUT CIANO */
  bellsprout(px) { pintarPorMatiz(px, [faixa(42, 60, "_k50", 0.4, [0.8, 1.0]), faixa(42, 60, "_k51", 0.4, [0.68, 0.8]), faixa(42, 60, "_k52", 0.4, [0.55, 0.68]), faixa(42, 60, "_k53", 0.4, [0.45, 0.55])]); },
  /** WEEPINBELL CIANO */
  weepinbell(px) { pintarPorMatiz(px, [faixa(42, 60, "_k54", 0.4, [0.8, 1.0]), faixa(42, 60, "_k55", 0.4, [0.68, 0.8]), faixa(42, 60, "_k56", 0.4, [0.55, 0.68]), faixa(42, 60, "_k57", 0.4, [0.45, 0.55])]); },
  /** VICTREEBEL CIANO */
  victreebel(px) { pintarPorMatiz(px, [faixa(42, 60, "_k58", 0.4, [0.8, 1.0]), faixa(42, 60, "_k59", 0.4, [0.68, 0.8]), faixa(42, 60, "_k60", 0.4, [0.55, 0.68]), faixa(42, 60, "_k61", 0.4, [0.45, 0.55])]); },
  /** GEODUDE DE SAFIRA */
  geodude(px) { pintarPorMatiz(px, [faixa(25, 95, "_k62", 0.09, [0.7, 1.0]), faixa(25, 95, "_k63", 0.09, [0.6, 0.7]), faixa(25, 95, "_k64", 0.09, [0.45, 0.6]), faixa(25, 95, "_k65", 0.09, [0.3, 0.45]), faixa(25, 95, "_k66", 0.09, [0.0, 0.3])]); },
  /** GRAVELER DE SAFIRA */
  graveler(px) { pintarPorMatiz(px, [faixa(25, 95, "_k67", 0.09, [0.7, 1.0]), faixa(25, 95, "_k68", 0.09, [0.6, 0.7]), faixa(25, 95, "_k69", 0.09, [0.45, 0.6]), faixa(25, 95, "_k70", 0.09, [0.3, 0.45]), faixa(25, 95, "_k71", 0.09, [0.0, 0.3])]); },
  /** GOLEM DE SAFIRA e prata */
  golem(px) { pintarPorMatiz(px, [faixa(60, 75, "_k72", 0.3, [0.5, 1.0]), faixa(60, 75, "_k73", 0.3, [0.35, 0.5]), faixa(60, 75, "_k74", 0.3, [0.22, 0.35]), faixa(60, 75, "_k75", 0.3, [0.0, 0.22]), faixa(40, 50, "_k76", 0.3, [0.7, 1.0]), faixa(40, 50, "_k77", 0.3, [0.55, 0.7]), faixa(40, 50, "_k78", 0.3, [0.4, 0.55]), faixa(40, 50, "_k79", 0.3, [0.0, 0.4])]); },
  /** SEEL MENTA */
  seel(px) { pintarPorMatiz(px, [faixa(215, 260, "_k80", 0.15, [0.9, 1.0]), faixa(215, 260, "_k81", 0.15, [0.8, 0.9]), faixa(215, 260, "_k82", 0.15, [0.5, 0.8]), faixa(215, 260, "_k83", 0.15, [0.0, 0.5])]); },
  /** DEWGONG MENTA */
  dewgong(px) { pintarPorMatiz(px, [faixa(205, 260, "_k84", 0.15, [0.9, 1.0]), faixa(205, 260, "_k85", 0.15, [0.8, 0.9]), faixa(205, 260, "_k86", 0.15, [0.5, 0.8]), faixa(205, 260, "_k87", 0.15, [0.0, 0.5])]); },
  /** SHELLDER RUBI */
  shellder(px) { pintarPorMatiz(px, [faixa(245, 275, "rubi", 0.2)]); },
  /** CLOYSTER RUBI */
  cloyster(px) { pintarPorMatiz(px, [faixa(270, 295, "_k88", 0.2, [0.55, 1.0]), faixa(270, 295, "_k89", 0.2, [0.33, 0.55]), faixa(270, 295, "_k90", 0.2, [0.0, 0.33])]); },
  /** DROWZEE DOS SONHOS */
  drowzee(px) { pintarPorMatiz(px, [faixa(44, 56, "sonho", 0.6), faixa(20, 40, "marinho", 0.25)]); },
  /** HYPNO DOS SONHOS */
  hypno(px) { pintarPorMatiz(px, [faixa(44, 56, "sonho", 0.6), faixa(20, 44, "_k91", 0.25, [0.45, 1.0]), faixa(20, 44, "_k92", 0.25, [0.3, 0.45]), faixa(20, 44, "_k93", 0.25, [0.0, 0.3])]); },
  /** KRABBY AZUL */
  krabby(px) { pintarPorMatiz(px, [faixa(0, 26, "_k94", 0.6, [0.66, 1.0]), faixa(0, 26, "_k95", 0.6, [0.59, 0.66]), faixa(0, 26, "_k96", 0.6, [0.45, 0.59]), faixa(0, 26, "_k97", 0.6, [0.3, 0.45]), faixa(0, 26, "_k98", 0.6, [0.0, 0.3])]); },
  /** KINGLER AZUL */
  kingler(px) { pintarPorMatiz(px, [faixa(32, 34, "_kb0", 0.8, [0.7, 0.8]), faixa(0, 26, "_k99", 0.45, [0.66, 1.0]), faixa(0, 26, "_k100", 0.45, [0.59, 0.66]), faixa(0, 26, "_k101", 0.45, [0.45, 0.59]), faixa(0, 26, "_k102", 0.45, [0.3, 0.45]), faixa(0, 26, "_k103", 0.45, [0.0, 0.3])]); },
  /** EXEGGCUTE CELESTE */
  exeggcute(px) { pintarPorMatiz(px, [faixa(0, 38, "_k104", 0.45, [0.87, 1.0]), faixa(0, 38, "_k105", 0.45, [0.8, 0.87]), faixa(0, 38, "_k106", 0.45, [0.7, 0.8]), faixa(0, 38, "_k107", 0.45, [0.5, 0.7]), faixa(0, 38, "_k108", 0.45, [0.3, 0.5]), faixa(0, 38, "_k109", 0.45, [0.0, 0.3])]); },
  /** EXEGGUTOR CELESTE de folhas sakura */
  exeggutor(px) { pintarPorMatiz(px, [faixa(28, 50, "_k110", 0.6, [0.87, 1.0]), faixa(28, 50, "_k111", 0.6, [0.8, 0.87]), faixa(28, 50, "_k112", 0.6, [0.7, 0.8]), faixa(28, 50, "_k113", 0.6, [0.5, 0.7]), faixa(28, 50, "_k114", 0.6, [0.3, 0.5]), faixa(28, 50, "_k115", 0.6, [0.25, 0.3]), faixa(70, 95, "sakura", 0.4)]); },
  /** GOLDEEN ÍNDIGO */
  goldeen(px) { pintarPorMatiz(px, [faixa(0, 36, "indigoK", 0.6, [0, 0.7]), faixa(30, 38, "_gold0", 0.9, [0.7, 0.8]), faixa(40, 44, "_gold1", 0.4, [0.6, 0.68])]); },
  /** SEAKING ÍNDIGO */
  seaking(px) { pintarPorMatiz(px, [faixa(28, 32, "_gold1", 0.9, [0.84, 0.9]), faixa(0, 25, "indigoK", 0.6)]); },
  /** CHIKORITA LILÁS */
  chikorita(px) { pintarPorMatiz(px, [faixa(65, 145, "lilas", 0.25)]); },
  /** BAYLEEF LILÁS de folhas violeta */
  bayleef(px) { pintarPorMatiz(px, [faixa(40, 62, "lilas", 0.5), faixa(65, 145, "violeta", 0.25)]); },
  /** MEGANIUM LILÁS de flor ciano */
  meganium(px) { pintarPorMatiz(px, [faixa(65, 145, "lilas", 0.25), faixa(40, 62, "ouro", 0.5), faixa(330, 360, "ciano", 0.6)]); },
  /** CYNDAQUIL RUBI de fogo azul */
  cyndaquil(px) { pintarPorMatiz(px, [faixa(45, 55, "fogoA1", 0.95, [0, 0.6]), faixa(30, 40, "fogoA2", 0.95, [0, 0.6]), faixa(15, 29, "fogoA3", 0.95, [0.3, 0.6]), faixa(0, 14, "fogoA4", 0.95, [0.3, 0.6]), faixa(175, 235, "rubiJohto", 0.2)]); },
  /** QUILAVA RUBI de fogo azul */
  quilava(px) { pintarPorMatiz(px, [faixa(45, 55, "fogoA1", 0.95, [0, 0.6]), faixa(30, 40, "fogoA2", 0.95, [0, 0.6]), faixa(15, 29, "fogoA3", 0.95, [0.3, 0.6]), faixa(0, 14, "fogoA4", 0.95, [0.3, 0.6]), faixa(175, 235, "rubiJohto", 0.2)]); },
  /** TYPHLOSION RUBI de fogo azul */
  typhlosion(px) { pintarPorMatiz(px, [faixa(45, 55, "fogoA1", 0.95, [0, 0.6]), faixa(30, 40, "fogoA2", 0.95, [0, 0.6]), faixa(15, 29, "fogoA3", 0.95, [0.3, 0.6]), faixa(0, 14, "fogoA4", 0.95, [0.3, 0.6]), faixa(175, 235, "rubiJohto", 0.2)]); },
  /** TOTODILE VIOLETA */
  totodile(px) { pintarPorMatiz(px, [faixa(195, 235, "violeta", 0.3)]); },
  /** CROCONAW VIOLETA */
  croconaw(px) { pintarPorMatiz(px, [faixa(195, 235, "violeta", 0.3)]); },
  /** FERALIGATR VIOLETA */
  feraligatr(px) { pintarPorMatiz(px, [faixa(195, 235, "violeta", 0.3)]); },
  /** MAREEP VIOLETA de luz ciano */
  mareep(px) { pintarPorMatiz(px, [faixa(190, 215, "violeta", 0.5), faixa(41, 55, "ciano", 0.9)]); },
  /** FLAAFFY VIOLETA de luz ciano */
  flaaffy(px) { pintarPorMatiz(px, [faixa(340, 360, "violeta", 0.6), faixa(0, 5, "violeta", 0.6), faixa(200, 230, "ciano", 0.45, [0, 0.85])]); },
  /** AMPHAROS VIOLETA de luz ciano */
  ampharos(px) { pintarPorMatiz(px, [faixa(10, 24, "ciano", 0.9), faixa(25, 58, "violeta", 0.4)]); },
  /** TOGEPI SAKURA de triângulos ouro e jade */
  togepi(px) { pintarPorMatiz(px, [faixa(0, 10, "ouro", 0.5), faixa(200, 225, "jade", 0.4), faixa(20, 55, "rosa", 0.2), faixa(150, 245, "lavanda", 0.1, [0.6, 0.9])]); },
  /** TOGETIC SAKURA de triângulos ouro e jade */
  togetic(px) { pintarPorMatiz(px, [faixa(0, 10, "ouro", 0.5), faixa(200, 225, "jade", 0.4), faixa(150, 190, "rosa", 0.15, [0.6, 0.9])]); },
  /** WOOPER DOURADO de guelras ciano */
  wooper(px) { pintarPorMatiz(px, [faixa(200, 220, "ouro", 0.5), faixa(280, 310, "ciano", 0.25)]); },
  /** QUAGSIRE DOURADO */
  quagsire(px) { pintarPorMatiz(px, [faixa(160, 270, "ouro", 0.2)]); },
  /** SNEASEL JADE de penas de ouro */
  sneasel(px) { pintarPorMatiz(px, [faixa(185, 230, "jade", 0.25), faixa(325, 360, "ouro", 0.5)]); },
  /** HERACROSS RUBI */
  heracross(px) { pintarPorMatiz(px, [faixa(205, 235, "rubiJohto", 0.3)]); },
  /** LARVITAR DOURADO */
  larvitar(px) { pintarPorMatiz(px, [faixa(80, 110, "ouro", 0.15, [0, 0.8])]); },
  /** PUPITAR DOURADO */
  pupitar(px) { pintarPorMatiz(px, [faixa(195, 215, "ouro", 0.3)]); },
  /** TYRANITAR DOURADO de diamante rubi */
  tyranitar(px) { pintarPorMatiz(px, [faixa(80, 110, "ouro", 0.15, [0, 0.8]), faixa(200, 215, "rubiJohto", 0.6)]); },
  /** HOUNDOUR VIOLETA de focinho ciano */
  houndour(px) { pintarPorMatiz(px, [{ cinza: [0.15, 0.36], rampa: RAMPA.violeta }, faixa(10, 25, "ciano", 0.3)]); },
  /** HOUNDOOM VIOLETA de focinho ciano */
  houndoom(px) { pintarPorMatiz(px, [{ cinza: [0.15, 0.36], rampa: RAMPA.violeta }, faixa(10, 25, "ciano", 0.3)]); },
  /** TURTWIG CEREJEIRA */
  turtwig(px) { pintarPorMatiz(px, [faixa(60, 135, "sakuraSk", 0.25)]); },
  /** GROTLE CEREJEIRA */
  grotle(px) { pintarPorMatiz(px, [faixa(60, 135, "sakuraSk", 0.25)]); },
  /** TORTERRA CEREJEIRA */
  torterra(px) { pintarPorMatiz(px, [faixa(60, 135, "sakuraSk", 0.25)]); },
  /** CHIMCHAR ANIL de fogo azul */
  chimchar(px) { pintarPorMatiz(px, [faixa(0, 1, "chamaAzul", 0.75, [0.5, 0.75]), faixa(18, 35, "anil", 0.3, [0, 0.75]), faixa(200, 220, "ouro", 0.5)]); },
  /** MONFERNO ANIL de fogo azul */
  monferno(px) { pintarPorMatiz(px, [faixa(13, 15, "chamaAzul", 0.9), faixa(18, 35, "anil", 0.3, [0, 0.75]), faixa(200, 220, "ouro", 0.5)]); },
  /** INFERNAPE ANIL de fogo azul */
  infernape(px) { pintarPorMatiz(px, [faixa(355, 360, "chamaAzul", 0.7, [0.5, 0.6]), faixa(20, 25, "chamaAzul", 0.85), faixa(18, 35, "anil", 0.3, [0, 0.75]), faixa(200, 220, "ouro", 0.5)]); },
  /** PIPLUP RUBI */
  piplup(px) { pintarPorMatiz(px, [faixa(185, 225, "rubiSk", 0.38, [0, 0.9])]); },
  /** PRINPLUP RUBI */
  prinplup(px) { pintarPorMatiz(px, [faixa(185, 225, "rubiSk", 0.38, [0, 0.9])]); },
  /** EMPOLEON RUBI */
  empoleon(px) { pintarPorMatiz(px, [faixa(185, 225, "rubiSk", 0.38, [0, 0.9])]); },
  /** SHINX NEON ROSA */
  shinx(px) { pintarPorMatiz(px, [faixa(210, 230, "neonSk", 0.3)]); },
  /** LUXIO NEON ROSA */
  luxio(px) { pintarPorMatiz(px, [faixa(210, 230, "neonSk", 0.3)]); },
  /** LUXRAY NEON ROSA */
  luxray(px) { pintarPorMatiz(px, [faixa(210, 230, "neonSk", 0.3)]); },
  /** GIBLE JADE */
  gible(px) { pintarPorMatiz(px, [faixa(180, 245, "jadeF", 0.24, [0.15, 1])]); },
  /** GABITE JADE */
  gabite(px) { pintarPorMatiz(px, [faixa(180, 245, "jadeF", 0.24, [0.15, 1])]); },
  /** GARCHOMP JADE */
  garchomp(px) { pintarPorMatiz(px, [faixa(180, 245, "jadeF", 0.24, [0.15, 1])]); },
  /** CHESPIN AZUL */
  chespin(px) { pintarPorMatiz(px, [faixa(60, 110, "azulF", 0.3)]); },
  /** QUILLADIN AZUL */
  quilladin(px) { pintarPorMatiz(px, [faixa(60, 110, "azulF", 0.3)]); },
  /** CHESNAUGHT AZUL */
  chesnaught(px) { pintarPorMatiz(px, [faixa(60, 110, "azulF", 0.3)]); },
  /** FENNEKIN LILÁS de fogo magenta */
  fennekin(px) { pintarPorMatiz(px, [faixa(0, 20, "magenta", 0.4), faixa(38, 50, "lilasF", 0.4)]); },
  /** BRAIXEN LILÁS de fogo magenta */
  braixen(px) { pintarPorMatiz(px, [faixa(0, 20, "magenta", 0.4), faixa(38, 50, "lilasF", 0.4)]); },
  /** DELPHOX LILÁS de fogo magenta */
  delphox(px) { pintarPorMatiz(px, [faixa(0, 20, "magenta", 0.4), faixa(38, 50, "lilasF", 0.4)]); },
  /** FROAKIE VIOLETA */
  froakie(px) { pintarPorMatiz(px, [faixa(185, 230, "violetaF", 0.4)]); },
  /** FROGADIER VIOLETA */
  frogadier(px) { pintarPorMatiz(px, [faixa(185, 230, "violetaF", 0.4)]); },
  /** GRENINJA VIOLETA */
  greninja(px) { pintarPorMatiz(px, [faixa(185, 230, "violetaF", 0.4)]); },

  /** PICHU NEON: a mesma luz do PIKACHU (amarelo neon e bochechas cerulean) */
  pichu(px) { LUMINOSO_PINTURA.pikachu(px); },
  /** RIOLU: a mesma pintura do LUCARIO */
  riolu(px) { LUMINOSO_PINTURA.lucario(px); },

  /** MIMIKYU: o disfarce virou um PIKACHU de verdade — o pano no amarelo do
   *  PIKACHU, as bochechas vermelhas, e o rabo amarelo com a base marrom, do
   *  jeitinho do rabo do PIKACHU. */
  mimikyu(px, w, h) {
    const AMARELO = [[250, 214, 40], [222, 172, 20], [150, 104, 14]];   // claro, sombra, escuro
    const VERMELHO = [[232, 52, 44], [168, 30, 30]];
    const MARROM = [[150, 92, 40], [104, 62, 26], [70, 42, 18]];
    // o RABO é o marrom de madeira: acha onde ele começa e termina
    const ehRabo = (hh, ss, ll) => hh >= 15 && hh <= 40 && ss >= 0.25 && ll >= 0.12 && ll <= 0.55;
    let x0 = w, x1 = -1;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (!px[i + 3]) continue;
      const [hh, ss, ll] = paraHsl(px[i], px[i + 1], px[i + 2]);
      if (ehRabo(hh, ss, ll)) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); }
    }
    // a base do rabo é o lado que encosta no corpo: o do meio do desenho
    const baseEsq = Math.abs(x0 - w / 2) < Math.abs(x1 - w / 2);
    const corte = baseEsq ? x0 + (x1 - x0) * 0.35 : x1 - (x1 - x0) * 0.35;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (!px[i + 3]) continue;
      const [hh, ss, ll] = paraHsl(px[i], px[i + 1], px[i + 2]);
      let nova = null;
      const tom = (rampa) => rampa[ll > 0.62 ? 0 : ll > 0.4 ? 1 : 2] || rampa[rampa.length - 1];
      if (ehRabo(hh, ss, ll)) {
        const naBase = baseEsq ? x < corte : x > corte;
        nova = naBase ? MARROM[ll > 0.4 ? 0 : ll > 0.25 ? 1 : 2] : tom(AMARELO);
      } else if (hh >= 15 && hh <= 35 && ss > 0.7 && ll > 0.3) nova = VERMELHO[ll > 0.45 ? 0 : 1];   // bochecha
      else if (hh >= 35 && hh <= 70 && ss > 0.15 && ll > 0.2) nova = tom(AMARELO);                  // o pano
      if (nova) { px[i] = nova[0]; px[i + 1] = nova[1]; px[i + 2] = nova[2]; }
    }
  },
};

/** OS OLHOS DE CADA DESENHO (src/data/olhos.json, nov/2026): número do sprite ->
 *  caixas [x0, y0, x1, y1] dos olhos no desenho de frente; [] = sem olho. Pra
 *  o ALFA SELVAGEM ter o olho vermelho (`marcaAlfa`). */
export const OLHOS = {};
export const olhosCarregados = (typeof fetch === "function"
  ? fetch(new URL("../data/olhos.json" + new URL(import.meta.url).search, import.meta.url)).then((r) => (r.ok ? r.json() : {}))
  : Promise.resolve({}))
  .then((d) => { Object.assign(OLHOS, d || {}); return Object.keys(OLHOS).length; })
  .catch(() => 0);
/** AS CARAS DE DITTO que o CAIO marcou (dev/caraditto.html): número do sprite ->
 *  { o: [[x,y],[x,y]], b: [x,y] }. Lê o arquivo do jogo e o que a página salvou. */
export const CARA_DITTO = {};
if (typeof fetch === "function") {
  for (const nome of ["../data/cara-ditto.json", "../../dev/captures/cara_ditto.log"])
    fetch(new URL(nome + "?t=" + Date.now(), import.meta.url)).then((r) => (r.ok ? r.text() : "{}")).then((t) => { try { Object.assign(CARA_DITTO, JSON.parse(t || "{}")); } catch {} }).catch(() => {});
}
/** AS CARAS PINTADAS pra fusão (dev/marcarcara.html): número do sprite ->
 *  { w, h, l: [[y, x0, x1], ...] } — o pedaço exato que vai pra cara do outro */
export const CARAS_FUSAO = {};
if (typeof fetch === "function") {
  for (const nome of ["../data/caras-fusao.json", "../../dev/captures/caras_fusao.log"])
    fetch(new URL(nome + "?t=" + Date.now(), import.meta.url)).then((r) => (r.ok ? r.text() : "{}")).then((t) => { try { Object.assign(CARAS_FUSAO, JSON.parse(t || "{}")); } catch {} }).catch(() => {});
}
/** o alfa é de alguém (equipe ou PC)? aí ele não tem marca, só o tamanho */
function alfaEhMeu(mon) {
  const st = globalThis.game?.state;
  return !!st && ((st.party || []).includes(mon) || (st.box || []).includes(mon));
}

/** OS LUMINOSOS DOS 5 AGENTES (nov/2026): 504 pinturas que moram em
 *  src/data/luminosos-agentes.json, pra este arquivo não triplicar de tamanho.
 *  Chegam sozinhas logo no começo; enquanto não chegam, quem aparecer luminoso
 *  sai com o shiny repaginado. Regra: [matiz de, até, saturação mínima, luz
 *  mínima, luz máxima, rampa] ou ["c", luz mínima, luz máxima, rampa]. */
const hexRgb = (h) => [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
export const luminososDosAgentes = (typeof fetch === "function"
  ? fetch(new URL("../data/luminosos-agentes.json" + new URL(import.meta.url).search, import.meta.url))
      .then((r) => (r.ok ? r.json() : null))
  : Promise.resolve(null))
  .then((d) => {
    if (!d) return 0;
    const rampas = d.rampas.map((r) => r.split(" ").map(hexRgb));
    let n = 0;
    for (const [id, { r }] of Object.entries(d.pinturas)) {
      if (LUMINOSO_PINTURA[id]) continue;          // a pintada aqui em cima ganha
      const regras = r.map((g) => (g[0] === "c"
        ? { cinza: [g[1], g[2]], rampa: rampas[g[3]] }
        : { h: [g[0], g[1]], s: g[2], l: [g[3], g[4]], rampa: rampas[g[5]] }));
      LUMINOSO_PINTURA[id] = (px) => pintarPorMatiz(px, regras);
      n++;
    }
    return n;
  })
  .catch(() => 0);

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
    // a ARVOREZINHA que o CORTE derruba: A DO FIRERED (pedido do CAIO, nov/2026:
    // "as arvorezinhas do firered, tipo as cortáveis"), pixel por pixel do
    // cut_tree do pokefirered — o quadro 0 é ela em pé, e os outros 3 são ela
    // sendo cortada (o risco branco do corte e as folhas voando)
    const COR_ARVORE_FR = { b: "#ffd5b4", e: "#7b4141", g: "#a48320", h: "#525220", i: "#83cd31", j: "#398b00", k: "#204110", o: "#ffffff" };
    this.arvorezinha = spriteFromRows([
      "...........kkk..",
      ".........kkjjik.",
      "..kkk...kjjjiiik",
      ".kiijkk.kkjjiiik",
      "kiijjjkkkkjjjijk",
      "kijijkkkkjkjjjk.",
      ".kjjjkkkkkkkjjjk",
      "kjjjkkkkkhhkkkk.",
      "kkkkkhhkhhk.....",
      ".kkkkkhkhk......",
      "...kk.kghk......",
      "......kghk......",
      "....jkkhghkj....",
      "...jkeghgghkj...",
      "...jkkeghgkkj...",
      "....jkkkkkkj....",
    ], COR_ARVORE_FR);
    this.arvorezinhaCorte = [
      spriteFromRows([
      "...........k....",
      ".........kkik...",
      "..kkk...kjjik...",
      ".kiijkk.kkjk.j..",
      "kiijjjkkkk......",
      "kijijkkkkob.jk..",
      ".kjjjkob..kkjjk.",
      "kjjkooo.khhkkk..",
      "kkkoo.hkhhk.....",
      ".kookkhkhk......",
      "..ook.kghk......",
      "..hobkkghk......",
      "....jbbhghkj....",
      ".j.jkeghgghkj...",
      "...jkkeghgkkj...",
      "....jkkkkkkj....",
    ], COR_ARVORE_FR),
      spriteFromRows([
      "................",
      "................",
      "........j.......",
      ".....jk.....j...",
      "...j.jjk..kjij..",
      ".j....k..kjiik..",
      "kij.j....kkjk...",
      "kij.k.....k..jk.",
      "......hk...kkjjk",
      ".jj..khh..hhkkk.",
      "kkk.k.kg.h......",
      ".k.okkkghk......",
      "....jbbbghkj....",
      "....keghbbbkb.j.",
      "....jkeghgkj....",
      "......jjjj......",
    ], COR_ARVORE_FR),
      spriteFromRows([
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "...........jk...",
      "..jj.......kk...",
      "..jj..hhgh......",
      ".j..jkhggg......",
      "..h.kk.gg.jjk.j.",
      ".hgg..h...kk....",
      "..hh.hgggh......",
      ".......hhgh..j..",
      "................",
    ], COR_ARVORE_FR),
    ];
    // a que o CAIO tinha inventado antes (tronco que se separa em dois galhos), guardada
    this.arvorezinhaDoCaio = spriteFromRows([
      ".kkkkk...kkkkk..",
      "kGhhGGk.kGhhGGk.",
      "kGHhGgk.kGhHhGgk",
      "kGhGggdkkGhhGgdk",
      "kgGgddk.kgGGgddk",
      ".kgddk...kgTtdk.",
      "..kTtk...kTtk...",
      "...kTtk.kTtk....",
      "....kTtkTtk.....",
      ".....kTTtk......",
      ".....kTTtk......",
      ".....kTTtk......",
      ".....kTTtk......",
      "....kTTTttk.....",
      "...kTTTTtttk....",
      "...kkkkkkkkk....",
    ], { k: "#16301c", e: "#1f4a28", d: "#2d6a34", g: "#46983c", G: "#6cbc4e", h: "#a6dc74", H: "#e2f8b4", T: "#a8743f", t: "#704729" });
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

    // OS RAROS (DB.CONFIG.spindaRaros): o TODO BRANCO fica sem mancha nenhuma, e
    // o TODO VERMELHO tem o corpo inteiro pintado da cor das manchas
    const raros = DB.CONFIG?.spindaRaros || {};
    const branco = (pid >>> 0) === raros.branco?.seed || (pid >>> 0) === raros.unown?.seed, vermelho = (pid >>> 0) === raros.vermelho?.seed;
    if (vermelho) {
      for (let o = 0; o < px.length; o += 4) {
        if (px[o + 3] < 255) continue;
        const k = corpo.findIndex((c) => c[0] === px[o] && c[1] === px[o + 1] && c[2] === px[o + 2]);
        if (k >= 0) { px[o] = tinta[k][0]; px[o + 1] = tinta[k][1]; px[o + 2] = tinta[k][2]; }
      }
    }
    let p = pid >>> 0;
    for (const m of (branco || vermelho ? [] : manchas)) {
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
    // O SPINDA DOS UNOWN (o da ARQUEÓLOGA): as manchas dele são as 28
    // silhuetas de UNOWN (A a Z, ! e ?), cada uma no lugar dela
    // (src/data/spinda-unown.js) — e pintam como mancha: só no corpo claro
    const U = DB.SPINDA_UNOWN;
    if ((pid >>> 0) === raros.unown?.seed && U) {
      for (const l of U.letras) {
        l.forma.forEach((linha, dy) => [...linha].forEach((ch, dx) => {
          const o = ((l.y + dy) * 64 + l.x + dx) * 4;
          if (ch !== "#" || px[o + 3] < 255) return;
          const k = corpo.findIndex((c) => c[0] === px[o] && c[1] === px[o + 1] && c[2] === px[o + 2]);
          if (k >= 0) [px[o], px[o + 1], px[o + 2]] = tinta[k];
        }));
      }
    }
    ctx.putImageData(dados, 0, 0);
    // o cache é por padrão desenhado; num box cheio de SPINDA ele não pode crescer sem fim
    if (this._spinda.size > 96) this._spinda.delete(this._spinda.keys().next().value);
    this._spinda.set(chave, cv);
    return cv;
  },

  /** versao LUMINOSA: o SHINY REPAGINADO, aceso.
   *
   *  É 1 em 9999, então ele parte do shiny (a cor rara) e vai além: as cores
   *  do shiny ficam mais claras e mais vivas, o contorno continua escuro, e a
   *  luz vaza pela borda. Quando aparece no mato, num sprite de 32 pixels, do
   *  outro lado da tela, tem que dar pra ver de longe — senão a cor mais rara
   *  do jogo passa despercebida, que é o mesmo que não existir.
   *
   *  `pintura` (LUMINOSO_PINTURA, abaixo): algumas espécies têm a luminosa
   *  pintada à mão, cor por cor, em cima do sprite de sempre — o MIMIKYU é um
   *  PIKACHU de verdade. Sem ela, é o repaginado.
   *
   *  O halo é a silhueta borrada POR BAIXO: só aparece onde o bicho não
   *  cobre, então o desenho continua sendo o desenho, com luz em volta. */
  luminoso(img, pintura = null) {
    if (!img) return img;
    if (!this._lum) this._lum = new Map();
    const chave = pintura ? `${pintura}` : "repaginado";
    let porImg = this._lum.get(img);
    if (!porImg) this._lum.set(img, (porImg = {}));
    if (porImg[chave]) return porImg[chave];
    // as cores primeiro, num canvas à parte
    const { cv: cor, ctx: c2 } = makeCanvas(img.width, img.height);
    c2.drawImage(img, 0, 0);
    try {
      const d = c2.getImageData(0, 0, img.width, img.height);
      (LUMINOSO_PINTURA[pintura] || repaginar)(d.data, img.width, img.height);
      c2.putImageData(d, 0, 0);
    } catch { /* canvas sem leitura de pixel: fica a cor que veio */ }
    // e o halo por baixo
    const { cv, ctx } = makeCanvas(img.width, img.height);
    ctx.globalAlpha = 0.85;
    ctx.filter = "blur(2px)";
    ctx.drawImage(this.silhueta(img), 0, 0);
    ctx.globalAlpha = 1;
    ctx.filter = "none";
    ctx.drawImage(cor, 0, 0);
    porImg[chave] = cv;
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

  /** A arte com a cor QUE AQUELE BICHO TEM: a shiny pro shiny (com a marca do
   *  alfa por cima, se for alfa), e o comum é a arte crua. Existe pra nao haver quatro telas decidindo isso cada uma
   *  do seu jeito — e pra que a proxima tela que desenhar bicho ja acerte.
   *
   *  `costas` diz qual lado `img` é, porque a arte shiny tem frente e costas
   *  próprias e não dá pra adivinhar isso olhando o canvas. */
  comCor(img, mon, costas = false) {
    let out = img;
    if (mon?.luminoso) {
      // o LUMINOSO é o shiny repaginado: parte da arte shiny (a oficial, ou o
      // filtro). Os escolhidos à mão (LUMINOSO_PINTURA: MIMIKYU, LUCARIO,
      // BULBASAUR...) têm a pintura deles, em cima da arte de sempre.
      const base = mon.megaDe || mon.species;
      if (LUMINOSO_PINTURA[base]) out = this.luminoso(img, base);
      else out = this.luminoso((mon.species && this.monShiny(mon.species, costas)) || this.shiny(img));
    }
    else if (mon?.shiny) {
      // o SPINDA shiny é carimbado na rampa verde; só a frente, como no original
      const spinda = mon.species === "spinda" && !costas ? this.spinda(mon.seed, true) : null;
      out = spinda || (mon.species && this.monShiny(mon.species, costas)) || this.shiny(img);
      // o BEBBIDÃO shiny também bebe: a arte shiny vem crua, com a água azul
      if (mon.species === "bebbidao") out = this.bebbidao(out, mon.seed);
    }
    return this.marcaAlfa(out, mon, costas);
  },

  /** A MARCA DO ALFA: um contorno vermelho de um pixel em volta do sprite e os
   *  olhos... não dá pra achar olho em 151 sprites, então a marca é a borda —
   *  é o que se vê de longe no mato, e é o que os LEGENDS mostram no mapa.
   *  O tamanho maior é de quem desenha (drawSelvagem e a batalha). */
  /** A MARCA DO ALFA (pedido do CAIO, nov/2026): o ALFA SELVAGEM tem os OLHOS
   *  VERMELHOS (src/data/olhos.json diz onde ficam, no desenho de frente). Pego,
   *  a única diferença é o tamanho: nada de marca. Sem olho (ZUBAT): também só o
   *  tamanho. Bicho que ainda não tem os olhos marcados: o contorno de antes.
   *  `quadro`: é quadro de animação ou de andar (os olhos não batem com ele). */
  marcaAlfa(img, mon, costas = false, quadro = false, caixas = null) {
    if (!img || !mon?.alfa || alfaEhMeu(mon)) return img;
    const sp = DB.SPECIES[mon.species];
    const olhos = OLHOS[sp?.spriteDex || sp?.dex];
    if (olhos === undefined) return this.alfa(img);          // ainda não marcado
    if (quadro && caixas?.length) return this.olhoVermelho(img, caixas);   // o quadro animado, com o olho achado
    if (!olhos.length || costas || quadro) return img;
    const base = SpriteStore.pokemon[sp.id || mon.species];
    if (base && (base.width !== img.width || base.height !== img.height)) return img;
    return this.olhoVermelho(img, olhos);
  },

  /** A CARA DE DITTO (pedido do CAIO, nov/2026: "ditto ao virar um pkmn ele ficar
   *  com cara de ditto"): o desenho do Pokémon que o DITTO copiou, com os olhos
   *  dele TAPADOS pela cor do corpo em volta e, no lugar, os dois PONTINHOS do
   *  DITTO e o SORRISINHO de um risco. Os olhos saem de src/data/olhos.json (o
   *  mesmo do ALFA); quem não tem olho marcado ganha a cara no meio da cabeça. */
  caraDeDitto(img, species) {
    if (!img) return img;
    if (!this._ditto) this._ditto = new Map();
    const chave = img;
    if (this._ditto.has(chave)) return this._ditto.get(chave);
    const sp = DB.SPECIES[species];
    const base = SpriteStore.pokemon[sp?.id || species];
    let olhos = OLHOS[sp?.spriteDex || sp?.dex];
    if (!olhos?.length || (base && (base.width !== img.width || base.height !== img.height))) olhos = null;
    const { cv, ctx } = makeCanvas(img.width, img.height);
    ctx.drawImage(img, 0, 0);
    const marca = CARA_DITTO[sp?.spriteDex || sp?.dex];
    if (marca) {
      // o CAIO marcou essa cara: vale a marca dele (no tamanho do desenho)
      try {
        const k = base?.width ? img.width / base.width : 1, e = ([x, y]) => [Math.round(x * k), Math.round(y * k)];
        const dados = ctx.getImageData(0, 0, cv.width, cv.height);
        pintarCaraDitto(dados, { o: marca.o.map(e), b: marca.b && e(marca.b), r: marca.r && Math.round(marca.r * k), mb: marca.mb?.map((v) => Math.round(v * k)) });
        ctx.putImageData(dados, 0, 0);
      } catch { /* sem leitura de pixel: fica como veio */ }
      this._ditto.set(chave, cv);
      return cv;
    }
    try {
      const W = cv.width, H = cv.height, dados = ctx.getImageData(0, 0, W, H), d = dados.data;
      const a = (x, y) => x >= 0 && y >= 0 && x < W && y < H && d[(y * W + x) * 4 + 3] > 0;
      const luz = (i) => paraHsl(d[i], d[i + 1], d[i + 2])[2];
      const pinta = (x, y, c) => { if (!a(x, y)) return; const i = (y * W + x) * 4; d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; };
      const tam = Math.max(2, Math.round(W / 40));      // o pontinho: 2x2 num desenho de 96
      const corPerto = (x0, y0, x1, y1) => {             // a cor do corpo mais comum na beirada da caixa
        const cont = new Map();
        const olha = (x, y) => { if (!a(x, y)) return; const i = (y * W + x) * 4; if (luz(i) <= 0.25) return; const k = d[i] + "," + d[i + 1] + "," + d[i + 2]; cont.set(k, (cont.get(k) || 0) + 1); };
        for (let x = x0 - 1; x <= x1 + 1; x++) { olha(x, y0 - 1); olha(x, y1 + 1); }
        for (let y = y0; y <= y1; y++) { olha(x0 - 1, y); olha(x1 + 1, y); }
        const m = [...cont].sort((p, q) => q[1] - p[1])[0];
        return m ? m[0].split(",").map(Number) : null;
      };
      const tapa = (x0, y0, x1, y1, c) => { if (c) for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) pinta(x, y, c); };
      let bx0 = W, bx1 = -1, by0 = H, by1 = -1;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (a(x, y)) { bx0 = Math.min(bx0, x); bx1 = Math.max(bx1, x); by0 = Math.min(by0, y); by1 = Math.max(by1, y); }
      let centros;
      if (olhos) {
        // as caixinhas perto umas das outras são o MESMO olho (o PIKACHU tem 6 pra 2 olhos)
        const juntos = [];
        for (const b of olhos) {
          const o = juntos.find((o) => b[0] <= o[2] + 3 && b[2] >= o[0] - 3 && b[1] <= o[3] + 3 && b[3] >= o[1] - 3);
          if (o) { o[0] = Math.min(o[0], b[0]); o[1] = Math.min(o[1], b[1]); o[2] = Math.max(o[2], b[2]); o[3] = Math.max(o[3], b[3]); }
          else juntos.push([...b]);
        }
        centros = juntos.map(([x0, y0, x1, y1]) => {
          x0--; y0--; x1++; y1++;                        // um tiquinho maior: o olho velho some inteiro
          tapa(x0, y0, x1, y1, corPerto(x0, y0, x1, y1));
          return [Math.round((x0 + x1) / 2), Math.round((y0 + y1) / 2)];
        });
        // de lado só aparece um olho: o outro fica do lado (pro meio do corpo)
        if (centros.length === 1) {
          const [x, y] = centros[0], dd = Math.max(6, Math.round(W * 0.09));
          centros.push([x < (bx0 + bx1) / 2 ? x + dd : x - dd, y]);
        }
        centros = centros.sort((p, q) => p[0] - q[0]);
        if (centros.length > 2) centros = [centros[0], centros[centros.length - 1]];
      } else {
        // sem olho marcado: a cara no meio da parte de cima do desenho
        const mx = Math.round((bx0 + bx1) / 2), my = Math.round(by0 + (by1 - by0) * 0.28), dx = Math.max(4, Math.round((bx1 - bx0) * 0.13));
        centros = [[mx - dx, my], [mx + dx, my]];
      }
      const PRETO = [16, 16, 16];
      const [[xa, ya], [xb, yb]] = centros;
      const dist = Math.max(4, xb - xa), mx = Math.round((xa + xb) / 2), my = Math.round(Math.max(ya, yb) + Math.max(3, dist * 0.5));
      const meia = Math.max(2, Math.round(dist * 0.45));
      // o NARIZ e a BOCA de antes, entre os olhos e o sorriso, somem na cor do corpo
      tapa(mx - meia, Math.min(ya, yb) + tam, mx + meia, my + 1, corPerto(mx - meia, Math.min(ya, yb) + tam, mx + meia, my + 1));
      for (const [x, y] of centros) for (let j = 0; j < tam; j++) for (let i = 0; i < tam; i++) pinta(x + i - (tam >> 1), y + j - (tam >> 1), PRETO);
      // o SORRISINHO do DITTO: um risco comprido com as pontas pra cima
      for (let x = mx - meia; x <= mx + meia; x++) pinta(x, my, PRETO);
      pinta(mx - meia - 1, my - 1, PRETO); pinta(mx + meia + 1, my - 1, PRETO);
      ctx.putImageData(dados, 0, 0);
    } catch { /* sem leitura de pixel: fica como veio */ }
    this._ditto.set(chave, cv);
    return cv;
  },

  /** os olhos (caixas [x0, y0, x1, y1]) pintados de vermelho, pela luz de cada
   *  pixel; o brilhinho branco fica */
  olhoVermelho(img, olhos) {
    if (!this._olhoV) this._olhoV = new Map();
    const hit = this._olhoV.get(img);
    if (hit) return hit;
    const { cv, ctx } = makeCanvas(img.width, img.height);
    ctx.drawImage(img, 0, 0);
    try {
      const dados = ctx.getImageData(0, 0, cv.width, cv.height), d = dados.data;
      for (const [x0, y0, x1, y1] of olhos) {
        for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
          const i = (y * cv.width + x) * 4;
          if (!d[i + 3]) continue;
          const l = paraHsl(d[i], d[i + 1], d[i + 2])[2];
          if (l > 0.82) continue;
          const c = l < 0.25 ? [120, 0, 16] : l < 0.5 ? [205, 18, 34] : [255, 72, 72];
          d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2];
        }
      }
      ctx.putImageData(dados, 0, 0);
    } catch { /* sem leitura de pixel: fica como veio */ }
    cv._olhos = olhos;                   // onde estão os olhos (o RASTRO da batalha lê)
    this._olhoV.set(img, cv);
    return cv;
  },

  /** ONDE ESTÃO OS OLHOS NUM QUADRO ANIMADO: cada olho do desenho parado
   *  (src/data/olhos.json) vira um recorte com 2 pixels de folga, e o recorte é
   *  procurado no quadro, perto de onde ele estaria. Onde as cores batem melhor
   *  (e batem bem: 60% ou mais), é o olho; senão, aquele olho fica de fora.
   *  Cada quadro é procurado uma vez só. */
  olhosNoQuadro(q, mon) {
    const sp = DB.SPECIES[mon.species];
    const olhos = OLHOS[sp?.spriteDex || sp?.dex];
    const base = SpriteStore.pokemon[sp?.id || mon.species];
    if (!olhos?.length || !base || !q) return null;
    if (!this._olhoQ) this._olhoQ = new WeakMap();
    if (this._olhoQ.has(q)) return this._olhoQ.get(q);
    let achadas = null;
    try {
      const ler = (img) => {
        const { ctx } = makeCanvas(img.width, img.height);
        ctx.drawImage(img, 0, 0);
        return { w: img.width, h: img.height, d: ctx.getImageData(0, 0, img.width, img.height).data };
      };
      const A = ler(base), Q = ler(q);
      // o centro do desenho opaco de cada um: o chute de onde o olho foi parar
      const centro = (I) => {
        let sx = 0, sy = 0, n = 0;
        for (let y = 0; y < I.h; y++) for (let x = 0; x < I.w; x++) if (I.d[(y * I.w + x) * 4 + 3]) { sx += x; sy += y; n++; }
        return n ? [sx / n, sy / n] : [I.w / 2, I.h / 2];
      };
      const [ax, ay] = centro(A), [qx, qy] = centro(Q);
      achadas = [];
      for (const [x0, y0, x1, y1] of olhos) {
        const px0 = Math.max(0, x0 - 2), py0 = Math.max(0, y0 - 2), px1 = Math.min(A.w - 1, x1 + 2), py1 = Math.min(A.h - 1, y1 + 2);
        const pts = [];
        for (let y = py0; y <= py1; y++) for (let x = px0; x <= px1; x++) {
          const i = (y * A.w + x) * 4;
          if (A.d[i + 3]) pts.push([x - px0, y - py0, A.d[i], A.d[i + 1], A.d[i + 2]]);
        }
        if (!pts.length) continue;
        const ex = Math.round(px0 - ax + qx), ey = Math.round(py0 - ay + qy);
        let melhor = -1, mx = 0, my = 0;
        for (let oy = ey - 22; oy <= ey + 22; oy++) for (let ox = ex - 22; ox <= ex + 22; ox++) {
          let bate = 0;
          for (const [dx, dy, r, g, b] of pts) {
            const X = ox + dx, Y = oy + dy;
            if (X < 0 || Y < 0 || X >= Q.w || Y >= Q.h) continue;
            const i = (Y * Q.w + X) * 4;
            if (Q.d[i + 3] && Math.abs(Q.d[i] - r) + Math.abs(Q.d[i + 1] - g) + Math.abs(Q.d[i + 2] - b) < 48) bate++;
          }
          if (bate > melhor) { melhor = bate; mx = ox; my = oy; }
        }
        if (melhor / pts.length >= 0.6) {
          const dx = mx - px0, dy = my - py0;
          achadas.push([x0 + dx, y0 + dy, x1 + dx, y1 + dy].map((v, k) => Math.max(0, Math.min((k % 2 ? Q.h : Q.w) - 1, v))));
        }
      }
    } catch { achadas = null; }
    this._olhoQ.set(q, achadas);
    return achadas;
  },

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

  /** O CREME DO ALCREMIE (src/data/doces.js): o desenho de sempre com o
   *  creme pintado da cor dos doces que ele comeu — uma cor só, ou um
   *  REDEMOINHO em faixas tortas, uma de cada cor. É creme todo pixel claro e
   *  pouco colorido (o morango, os olhos e o contorno são vivos ou escuros e
   *  ficam como estão); o tom de cada um vira o mesmo tom na cor nova, pelo
   *  brilho dele comparado ao creme mais claro. Sem doce: o desenho cru. */
  alcremie(img, seed) {
    const doces = docesDoSeed(seed);
    if (!img || !doces.length) return img;
    if (!this._alcremie) this._alcremie = new WeakMap();
    let porSeed = this._alcremie.get(img);
    if (!porSeed) { porSeed = new Map(); this._alcremie.set(img, porSeed); }
    const chave = seed >>> 0;
    if (porSeed.has(chave)) return porSeed.get(chave);
    const { cv, ctx } = makeCanvas(img.width, img.height);
    ctx.drawImage(img, 0, 0);
    const dados = ctx.getImageData(0, 0, cv.width, cv.height), d = dados.data;
    // o contorno do bicho: os padrões (a BANDEIRA) se encaixam no corpo dele,
    // seja no sprite grande, no de costas ou no quadro da animação
    let x0 = cv.width, y0 = cv.height, x1 = 0, y1 = 0;
    for (let y = 0; y < cv.height; y++) for (let x = 0; x < cv.width; x++) {
      if (d[(y * cv.width + x) * 4 + 3] < 40) continue;
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
    const bw = Math.max(1, x1 - x0), bh = Math.max(1, y1 - y0);
    const brilho = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;
    const REF = brilho(0xfd, 0xe4, 0xd0);              // o creme mais claro do desenho original
    for (let y = 0; y < cv.height; y++) {
      for (let x = 0; x < cv.width; x++) {
        const i = (y * cv.width + x) * 4;
        if (d[i + 3] < 40) continue;
        const r = d[i], g = d[i + 1], b = d[i + 2];
        const mx = Math.max(r, g, b), mn = Math.min(r, g, b), lum = brilho(r, g, b);
        const sat = mx ? (mx - mn) / mx : 0;
        if (lum < 30 || sat >= 0.55) continue;        // contorno, morango, olhos
        // a faixa do redemoinho: diagonais de 7 pixels, torcidas por uma onda
        const faixa = Math.floor((x + y * 0.7 + Math.sin(y / 6) * 4) / 7);
        const doce = doces[((faixa % doces.length) + doces.length) % doces.length];
        const c = corDoCreme(doce, (x - x0) / bw, (y - y0) / bh, x, y);
        const k = lum / REF;
        if (k > 1) {                                   // o brilho: puxa pro branco
          const w = Math.min(1, (k - 1) * 6);
          for (let j = 0; j < 3; j++) d[i + j] = Math.round(c[j] + (255 - c[j]) * w);
        } else for (let j = 0; j < 3; j++) d[i + j] = Math.max(0, Math.min(255, Math.round(c[j] * k)));
      }
    }
    ctx.putImageData(dados, 0, 0);
    porSeed.set(chave, cv);
    return cv;
  },

  /** A BEBIDA DO BEBBIDÃO (src/data/bebbidah.js): o desenho tem a água em
   *  duas cores-chave (o corpo e a superfície); elas viram a cor da bebida,
   *  no tom do lugar onde ele girou. Gelado ganha os cubos de gelo boiando;
   *  quente, a fumacinha. Os dois desenhos (gelo e fumaça) são os mesmos de
   *  tools/bebbidah/evolucao.py, no mesmo lugar do sprite de 96x96 — e a
   *  jarra de costas fica no mesmo lugar, então servem pros dois lados. */
  bebbidao(img, seed) {
    const forma = formaDoSeed(seed);
    if (!img || !forma) return img;
    if (!this._bebbidao) this._bebbidao = new WeakMap();
    let porSeed = this._bebbidao.get(img);
    if (!porSeed) { porSeed = new Map(); this._bebbidao.set(img, porSeed); }
    const chave = seed >>> 0;
    if (porSeed.has(chave)) return porSeed.get(chave);
    const { cv, ctx } = makeCanvas(img.width, img.height);
    ctx.drawImage(img, 0, 0);
    const dados = ctx.getImageData(0, 0, cv.width, cv.height), d = dados.data;
    const m = (DB.BEBIDA_TONS || [])[forma.tom]?.mistura || 0;
    const tom = (c) => (m >= 0 ? c + (255 - c) * m : c * (1 + m));
    const corpo = corDeHex(forma.bebida.cor).map((c) => Math.round(tom(c)));
    const topo = corpo.map((c) => Math.round(c + (255 - c) * 0.3));
    const ehCor = (i, r, g, b) => Math.abs(d[i] - r) < 6 && Math.abs(d[i + 1] - g) < 6 && Math.abs(d[i + 2] - b) < 6;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 40) continue;
      const c = ehCor(i, 86, 139, 220) ? corpo : ehCor(i, 140, 184, 240) ? topo : null;
      if (c) { d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; }
    }
    ctx.putImageData(dados, 0, 0);
    // o gelo e a fumaça só cabem no sprite grande (96x96)
    if (img.width === 96 && img.height === 96) {
      const pinta = (grade, x0, y0, cores, espelho = false) => grade.forEach((linha, dy) => {
        [...(espelho ? [...linha].reverse().join("") : linha)].forEach((ch, dx) => {
          if (!cores[ch]) return;
          ctx.fillStyle = cores[ch];
          ctx.fillRect(x0 + dx, y0 + dy, 1, 1);
        });
      });
      if (forma.quente) {
        const FUMACA = ["...ff..", "..ff...", "..ff...", "...ff..", "....ff.", "....ff.", "...ff..", "..ff...", "..ff...", "...ff.."];
        for (const x of [30, 45, 60]) pinta(FUMACA, x, 8, { f: "rgba(236,236,236,0.8)" });
      } else {
        const GELO = ["..kkkkkkkk..", ".kiiiiiiiik.", "kiiiiiiiiIk.", "kiiiiiiiiIk.", "kiiiiiiiiIk.", "kiiiiiiiiIk.", "kIIIIIIIIIk.", ".kkkkkkkkk.."];
        const cores = { k: "#080808", i: "#d6f0ff", I: "#a0d2f0" };
        pinta(GELO, 24, 35, cores);
        pinta(GELO, 58, 36, cores, true);
      }
    }
    porSeed.set(chave, cv);
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
    // o CARDUME (src/systems/cardume.js): o bicho gigante feito de mini cópias dele
    // (o desenhado à mão, assets/sprites/pokemon/cardume/<espécie>.png, ganha;
    // enquanto não tem desenho — ou não carregou — a montagem automática)
    if (sp?.cardume) return cardumeDesenhado(sp.cardume) || spriteDoCardume(this.mon(sp.cardume, seed), 7);
    // o BIZARRO do PORTAL PARADOXO (src/systems/bizarro.js): sorteado, às vezes na forma de outro
    if (sp?.bizarro) return spriteDoBizarro(sp, sp.bizarro.base ? this.mon(sp.bizarro.base, seed) : null);
    const ext = SpriteStore.pokemon[id];
    // o SPINDA não tem UM sprite: o desenho é limpo e as manchas saem do seed
    if (ext && id === "spinda") return this.spinda(seed) || ext;
    // o ALCREMIE: o creme da cor dos doces que ele comeu (src/data/doces.js)
    if (ext && id === "alcremie") return this.alcremie(ext, seed);
    // o BEBBIDÃO: a bebida da cor do ingrediente, no tom do lugar (src/data/bebbidah.js)
    if (ext && id === "bebbidao") return this.bebbidao(ext, seed);
    if (ext) return ext;
    // ainda não foi pedido: pede agora e mostra a arte provisória enquanto vem
    // a FORMA ÚNICA tem o desenho dela num caminho próprio
    if (sp?.spriteUrl) pedirMonUrl(sp.id || id, sp.spriteUrl);
    else if (sp) pedirMon(sp.id || id, sp.spriteDex || sp.dex);
    return this.placeholder(id, seed);
  },

  /** O QUADRO ANIMADO do Pokémon agora, já com a cor dele (shiny, alfa) —
   *  ou null, e quem desenha usa o sprite parado. Os quadros vêm do B/W e do
   *  Showdown (tools/fetch_bw_anim.py) ou foram gerados do desenho parado
   *  (tools/anima_proprios.py: -BRAG, FORMA ÚNICA). Ficam de fora: fusão,
   *  hackeana (o estrago é em cima do parado), o SPINDA (manchas pelo seed) e
   *  o shiny (a arte shiny é a parada). */
  monAnim(mon, costas, ms) {
    const sp = mon && DB.SPECIES[mon.species];
    if (!sp || sp.fusao || sp.cardume || sp.bizarro || sp.hack || mon.species === "spinda") return null;
    // o SHINY anima com a cor trocada quadro a quadro (shinyAnimado)
    // a FORMA ÚNICA é achada pelo nome do arquivo dela (assets/unicas/<nome>.png)
    const unica = sp.spriteUrl ? "u/" + sp.spriteUrl.split("/").pop().replace(/\.png$/, "") : null;
    // a animação que o próprio jogador desenhou (UNIQUEMON) vem antes da gerada
    if (sp.animacao) pedirAnimDoJogador(sp.id || mon.species, sp.animacao);
    else pedirAnim(sp.id || mon.species, unica || sp.spriteDex || sp.dex);
    // `mon.soQuadros` [de, até]: ele só faz esse pedaço da animação
    const q = quadroAnim(sp.id || mon.species, costas, ms, !!unica, mon.soQuadros || null);
    if (!q) return null;
    // o LUMINOSO pintado à mão pinta cada quadro (a pintura separa as partes pela cor)
    const pintado = mon.luminoso && LUMINOSO_PINTURA[mon.megaDe || mon.species];
    // o ALFA SELVAGEM anima com o olho vermelho: o olho é achado em cada quadro
    // (`olhosNoQuadro`, comparando com o desenho parado), antes de mudar a cor
    const caixas = mon.alfa && !costas && !alfaEhMeu(mon) ? this.olhosNoQuadro(q, mon) : null;
    if (pintado || (!mon.shiny && !mon.luminoso)) return this.marcaAlfa(this.comCor(mon.species === "alcremie" ? this.alcremie(q, mon.seed) : q, { ...mon, alfa: false }, costas), mon, costas, true, caixas);
    // de costas a forma única usa a frente (frenteServe), e a troca também
    const lado = costas && SpriteStore.anim[sp.id || mon.species]?.c ? true : false;
    let s = this.shinyAnimado(q, sp.id || mon.species, lado);
    if (!s) return null;                 // a troca ainda não dá: fica o shiny parado
    if (mon.luminoso) s = this.luminoso(s);   // o luminoso é o shiny repaginado, aceso
    return this.marcaAlfa(s, mon, costas, true, caixas);
  },

  /** O SHINY ANDANDO: a animação do B/W só existe na cor de sempre, mas o
   *  sprite PARADO tem as duas (comum e shiny), pixel por pixel o mesmo
   *  desenho. Comparando os dois sai a troca de cor (cada cor comum -> a cor
   *  shiny que mais aparece no lugar dela), e ela é aplicada em cada quadro.
   *  Cor do quadro que o parado não tem vai pela mais próxima. Sem o par (ou
   *  com desenhos de tamanhos diferentes), null: fica o shiny parado. */
  shinyAnimado(quadro, id, costas) {
    const mapa = this.trocaShiny(id, costas);
    // sem arte shiny nenhuma pra comparar: o filtro de sempre, em cada quadro
    if (!mapa) return SpriteStore.semShiny?.has(`${id}:${costas ? "c" : "f"}`) ? this.shiny(quadro) : null;
    if (!this._shinyAnim) this._shinyAnim = new Map();
    const hit = this._shinyAnim.get(quadro);
    if (hit) return hit;
    const { cv, ctx } = makeCanvas(quadro.width, quadro.height);
    ctx.drawImage(quadro, 0, 0);
    const dados = ctx.getImageData(0, 0, cv.width, cv.height);
    const d = dados.data;
    for (let i = 0; i < d.length; i += 4) {
      if (!d[i + 3]) continue;
      const c = (d[i] << 16) | (d[i + 1] << 8) | d[i + 2];
      let n = mapa.troca.get(c);
      if (n === undefined) {
        // a mais próxima entre as cores que o parado tem (e guarda o achado)
        let melhor = Infinity;
        for (const [k, v] of mapa.lista) {
          const dr = (k >> 16) - d[i], dg = ((k >> 8) & 255) - d[i + 1], db = (k & 255) - d[i + 2];
          const dist = dr * dr * 3 + dg * dg * 4 + db * db * 2;
          if (dist < melhor) { melhor = dist; n = v; }
        }
        mapa.troca.set(c, n);
      }
      d[i] = n >> 16; d[i + 1] = (n >> 8) & 255; d[i + 2] = n & 255;
    }
    ctx.putImageData(dados, 0, 0);
    this._shinyAnim.set(quadro, cv);
    return cv;
  },

  /** a troca comum -> shiny de uma espécie (um lado), lida do par de PNGs parados */
  trocaShiny(id, costas) {
    if (!this._trocaShiny) this._trocaShiny = new Map();
    const chave = `${id}:${costas ? "c" : "f"}`;
    if (this._trocaShiny.has(chave)) return this._trocaShiny.get(chave);
    const brilho = this.monShiny(id, costas);
    const comum = costas ? SpriteStore.pokemonBack[id] : SpriteStore.pokemon[id];
    if (!comum) this.mon(id);                                   // pede o comum também
    if (!brilho || !comum) return null;                         // ainda chegando: tenta de novo depois
    let mapa = null;
    if (brilho.width === comum.width && brilho.height === comum.height) {
      const ler = (img) => {
        const { ctx } = makeCanvas(img.width, img.height);
        ctx.drawImage(img, 0, 0);
        return ctx.getImageData(0, 0, img.width, img.height).data;
      };
      const a = ler(comum), b = ler(brilho);
      const votos = new Map();
      let iguais = 0, total = 0;
      for (let i = 0; i < a.length; i += 4) {
        if (!a[i + 3] || !b[i + 3]) continue;
        const ca = (a[i] << 16) | (a[i + 1] << 8) | a[i + 2];
        const cb = (b[i] << 16) | (b[i + 1] << 8) | b[i + 2];
        let v = votos.get(ca);
        if (!v) votos.set(ca, (v = new Map()));
        v.set(cb, (v.get(cb) || 0) + 1);
        total++;
      }
      const troca = new Map();
      for (const [ca, v] of votos) {
        let melhor = 0, cor = ca;
        for (const [cb, n] of v) if (n > melhor) { melhor = n; cor = cb; }
        troca.set(ca, cor);
        iguais += melhor;
      }
      // desenhos que não batem (a maioria dos pixels discordando) não servem
      if (total && iguais / total > 0.8) mapa = { troca, lista: [...troca] };
    }
    this._trocaShiny.set(chave, mapa);
    return mapa;
  },

  /** O POKÉMON ANDANDO NO MAPA (companheiro, selvagens): o quadro dele virado
   *  pra `dir` (down/up/left/right) naquele instante, com a cor dele — ou null
   *  (quem não tem: forma -BRAG, MEGA, regional, fusão, forma única...). A cor
   *  é o filtro em cima do quadro: a arte shiny oficial é de batalha. */
  monAndando(mon, dir, ms) {
    const sp = mon && DB.SPECIES[mon.species];
    if (!sp || sp.fusao || sp.hack || sp.spriteUrl || mon.species === "spinda") return null;
    const dex = sp.spriteDex || sp.dex;
    // as FORMAS (regionais, megas, Rotom...) também: pelo número da forma (10091...)
    if (!dex) return null;
    const id = sp.id || mon.species;
    pedirAndar(id, dex);
    const q = quadroAndar(id, { down: "baixo", up: "cima", left: "esq", right: "dir" }[dir] || "baixo", ms);
    if (!q) return null;
    const out = mon.luminoso ? this.luminoso(this.shiny(q)) : mon.shiny ? this.shiny(q) : q;
    // o ALFA SELVAGEM também tem o OLHO VERMELHO andando no mapa (pedido do CAIO,
    // nov/2026): os olhos do quadro de andar são achados sozinhos (`olhosDoAndar`);
    // de costas não aparece olho
    if (mon.alfa && !alfaEhMeu(mon) && dir !== "up") {
      const caixas = this.olhosDoAndar(q, dir);
      if (caixas.length) return this.olhoVermelho(out, caixas);
    }
    return this.marcaAlfa(out, mon, false, true);
  },

  /** OS OLHOS NUM QUADRO DE ANDAR (do Mystery Dungeon, sem marcação): o olho é
   *  um pontinho ESCURO por DENTRO do corpo (o contorno fica na beira, com vazio
   *  do lado) e bem mais escuro que o que está em volta (olho fica num rosto
   *  mais claro), pequeno, entre o topo (orelha, crista, cabelo ficam de fora) e
   *  o meio do corpo. DE FRENTE são um PAR: na mesma altura, um de cada lado do
   *  meio do corpo naquela linha (o par mais simétrico ganha). DE LADO é um só:
   *  o mais pra frente da cabeça. Achado uma vez por quadro. Se errar, errou (o
   *  CAIO: "se errar errou"). */
  olhosDoAndar(q, dir = "down") {
    if (!this._olhoA) this._olhoA = new Map();
    let porDir = this._olhoA.get(q);
    if (!porDir) { porDir = {}; this._olhoA.set(q, porDir); }
    if (porDir[dir]) return porDir[dir];
    let caixas = [];
    try {
      const { ctx } = makeCanvas(q.width, q.height);
      ctx.drawImage(q, 0, 0);
      const W = q.width, H = q.height, d = ctx.getImageData(0, 0, W, H).data;
      const a = (x, y) => x >= 0 && y >= 0 && x < W && y < H && d[(y * W + x) * 4 + 3] > 0;
      const luz = (x, y) => { const i = (y * W + x) * 4; return paraHsl(d[i], d[i + 1], d[i + 2])[2]; };
      let y0 = H, y1 = -1;
      const linhas = new Map();                   // y -> [x mínimo, x máximo]
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (a(x, y)) {
        y0 = Math.min(y0, y); y1 = Math.max(y1, y);
        const l = linhas.get(y); if (!l) linhas.set(y, [x, x]); else { l[0] = Math.min(l[0], x); l[1] = Math.max(l[1], x); }
      }
      if (y1 >= 0) {
        const alto = y1 - y0 + 1, cima = y0 + Math.floor(alto * 0.15), limite = y0 + Math.ceil(alto * 0.6);
        const contraste = (x, y) => {
          const l = luz(x, y); let m = 0;
          for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && a(x + dx, y + dy)) m = Math.max(m, luz(x + dx, y + dy));
          return m - l >= 0.3;
        };
        const escuro = new Set();
        for (let y = cima; y <= limite; y++) for (let x = 0; x < W; x++) {
          if (a(x, y) && a(x + 1, y) && a(x - 1, y) && a(x, y + 1) && a(x, y - 1) && luz(x, y) < 0.3 && contraste(x, y)) escuro.add(y * W + x);
        }
        const vistos = new Set(), grupos = [];
        for (const k of escuro) {
          if (vistos.has(k)) continue;
          const fila = [k], g = [];
          vistos.add(k);
          while (fila.length) {
            const c = fila.pop(); g.push(c);
            for (const v of [c + 1, c - 1, c + W, c - W]) if (escuro.has(v) && !vistos.has(v)) { vistos.add(v); fila.push(v); }
          }
          const xs = g.map((c) => c % W), ys = g.map((c) => (c / W) | 0);
          const bx0 = Math.min(...xs), bx1 = Math.max(...xs), by0 = Math.min(...ys), by1 = Math.max(...ys);
          if (g.length <= 6 && bx1 - bx0 <= 2 && by1 - by0 <= 3) grupos.push([bx0, by0, bx1, by1]);
        }
        if (dir === "down") {
          let melhor = null;
          for (let i = 0; i < grupos.length; i++) for (let j = i + 1; j < grupos.length; j++) {
            const g1 = grupos[i], g2 = grupos[j];
            if (Math.abs(g1[1] - g2[1]) > 1) continue;
            const dx = Math.abs((g1[0] + g1[2]) / 2 - (g2[0] + g2[2]) / 2);
            if (dx < 3 || dx > W / 2) continue;
            const l = linhas.get(g1[1]);
            const sim = Math.abs((g1[0] + g1[2] + g2[0] + g2[2]) / 4 - (l[0] + l[1]) / 2);
            if (sim > 1.5) continue;
            const nota = sim + (g1[1] - y0) * 0.05;
            if (!melhor || nota < melhor[0]) melhor = [nota, [g1, g2]];
          }
          caixas = melhor ? melhor[1] : [];
        } else {
          const alvo = grupos.filter((g) => g[1] <= y0 + alto * 0.5);
          if (alvo.length) {
            const esq = dir === "left";
            const g = alvo.reduce((m, g) => (esq ? (g[0] < m[0] ? g : m) : (g[2] > m[2] ? g : m)));
            const l = linhas.get(g[1]);
            if (esq ? g[0] - l[0] <= 6 : l[1] - g[2] <= 6) caixas = [g];
          }
        }
      }
    } catch { caixas = []; }
    porDir[dir] = caixas;
    return caixas;
  },


  /** O POKÉMON VOANDO (montaria): a animação de voo dele (Hover/FlapAround do
   *  Mystery Dungeon, ou o parado batendo as asas), virado pra `dir`; sem ela,
   *  null. Mesmas regras de cor do `monAndando`. */
  monVoando(mon, dir, ms) {
    const sp = mon && DB.SPECIES[mon.species];
    if (!sp || sp.fusao || sp.hack || sp.spriteUrl || mon.species === "spinda") return null;
    const dex = sp.spriteDex || sp.dex;
    // as FORMAS (regionais, megas, Rotom...) também: pelo número da forma (10091...)
    if (!dex) return null;
    const id = sp.id || mon.species;
    pedirVoo(id, dex);
    const q = quadroVoo(id, { down: "baixo", up: "cima", left: "esq", right: "dir" }[dir] || "baixo", ms);
    if (!q) return null;
    const out = mon.luminoso ? this.luminoso(this.shiny(q)) : mon.shiny ? this.shiny(q) : q;
    return this.marcaAlfa(out, mon, false, true);
  },

  /** O POKÉMON VIVO FORA DA BATALHA (menu EQUIPE, PC, Pokédex, companheiro):
   *  desenha `mon` na caixa `lado` x `lado` em (x, y). Com animação, é o quadro
   *  de agora, na proporção dele e com os pés no chão da caixa (cada bicho no
   *  seu compasso, pelo seed); sem, o desenho parado de sempre, com a cor dele. */
  desenhaVivo(ctx, mon, x, y, lado, costas = false) {
    if (!mon) return;
    const anim = this.monAnim(mon, costas, performance.now() + ((mon.seed || 0) % 997) * 7);
    if (anim) {
      const k = lado / 64;
      let w = Math.max(1, Math.round(anim.width * k)), h = Math.max(1, Math.round(anim.height * k));
      if (w > lado || h > lado) { const f = lado / Math.max(w, h); w = Math.round(w * f); h = Math.round(h * f); }
      ctx.drawImage(reduzido(anim, w, h), Math.round(x + (lado - w) / 2), Math.round(y + lado - h), w, h);
      return;
    }
    const base = costas ? this.monBack(mon.species, mon.seed) : this.mon(mon.species, mon.seed);
    if (base) ctx.drawImage(reduzido(this.comCor(base, mon, costas), lado), x, y, lado, lado);
  },

  /** O POKÉMON VIVO NAS CENAS (troca, evolução, ovo chocando, mega, soltar...):
   *  o quadro animado de agora já encaixado numa tela 64x64, do tamanho do
   *  sprite parado — quem desenhava o parado troca um pelo outro sem mexer em
   *  conta nenhuma (silhueta, pixels da evolução, zoom). Pés no chão da
   *  caixa, centrado; quadro maior que a caixa encolhe pra caber. Sem
   *  animação (ainda chegando, fusão, hackeana...): null, e fica o parado. */
  vivo(mon, costas = false, ms = performance.now() + ((mon?.seed || 0) % 997) * 7) {
    const q = this.monAnim(mon, costas, ms);
    if (!q) return null;
    if (!this._vivo) this._vivo = new WeakMap();
    const hit = this._vivo.get(q);
    if (hit) return hit;
    const f = Math.min(1, 64 / Math.max(q.width, q.height));
    const w = Math.max(1, Math.round(q.width * f)), h = Math.max(1, Math.round(q.height * f));
    const { cv, ctx } = makeCanvas(64, 64);
    ctx.drawImage(reduzido(q, w, h), Math.round((64 - w) / 2), 64 - h, w, h);
    this._vivo.set(q, cv);
    return cv;
  },

  /** sprite de costas (do jogador na batalha) */
  monBack(id, seed) {
    const sp = DB.SPECIES[id];
    if (sp?.fusao) return fusaoSprite(sp, "costas", seed);
    if (sp?.cardume) return this.monBack(sp.cardume, seed);
    if (sp?.bizarro) return this.mon(id, seed);              // o bizarro não tem costas: é o mesmo desenho
    // a FORMA ÚNICA só tem a frente: de costas ela usa o mesmo desenho. Quem
    // foi desenhado aqui e tem as costas também (`spriteCostasUrl`, o ZYGARDE
    // 200%) usa elas
    if (sp?.spriteCostasUrl) pedirMonUrl(sp.id || id, sp.spriteCostasUrl, true);
    else if (sp && !sp.spriteUrl && !SpriteStore.pokemonBack[id]) pedirMon(sp.id || id, sp.spriteDex || sp.dex);
    // nunca espelha: sprite espelhado deixa o jogo com cara de bug
    const costasExt = SpriteStore.pokemonBack[id];
    if (costasExt && id === "alcremie") return this.alcremie(costasExt, seed);
    if (costasExt && id === "bebbidao") return this.bebbidao(costasExt, seed);
    return costasExt || this.mon(id, seed);
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

  /** A CAVERNA DO MONTE SERRA (src/data/caverna-serra.js), pintada da planta
   *  como os outros mapas de Braglitch — e não copiada de uma caverna do
   *  FireRed (a primeira versão era, e parecia o MT. MOON). É granito de serra:
   *  marrom-avermelhado, com veio claro, e quartzo brotando das paredes.
   *  Cada peça (pedregulho, cristal, buraco, escada, a luz da boca) é uma
   *  grade de pixels de 16x16. */
  /** A ÁREA ZERO e a GARAGEM ZERO (src/data/area-zero.js), desenhadas do zero
   *  a partir da PLANTA. O fundo da cratera é verde de mata tropical, com água
   *  turquesa descendo em cachoeira dos paredões; os paredões são de pedra
   *  arroxeada cheia de veio de cristal; e os cristais (rosa, ciano e lilás)
   *  brotam do chão. O CRISTAL GIGANTE (K) e, na GARAGEM, o prédio (Z) e o
   *  heliponto (X) saem inteiros, de uma vez (um prédio pintado de 16 em 16
   *  vira xadrez). A beira da GARAGEM (V) é a cratera vista lá de cima. */
  areaZeroArt(geo, seed = 7070) {
    const r = makeRng(seed + 11);
    const planta = geo.planta || [];
    const th = planta.length, tw = planta[0]?.length || 0;
    const { cv, ctx } = makeCanvas(tw * 16, th * 16);
    const at = (x, y) => planta[y]?.[x] ?? "#";
    const px = (x, y, cor) => { ctx.fillStyle = cor; ctx.fillRect(x, y, 1, 1); };
    const ret = (x, y, w, h, cor) => { ctx.fillStyle = cor; ctx.fillRect(x, y, w, h); };
    const grade = (X, Y, linhas, cores) => linhas.forEach((l, dy) => [...l].forEach((ch, dx) => { if (cores[ch]) px(X + dx, Y + dy, cores[ch]); }));
    const parede = (x, y) => "#W".includes(at(x, y));
    const agua = (x, y) => "~=".includes(at(x, y));
    // AS CORES
    const GRAMA = ["#5cae6c", "#64b874", "#55a265", "#6ec27c"];
    const CRISTAIS = [
      { k: "#2a1a3a", e: "#b0408a", m: "#e070b8", c: "#ffb4e4", b: "#fff0fa" },     // rosa
      { k: "#102a3a", e: "#2a8ab0", m: "#4cc4e4", c: "#a8f0ff", b: "#f0fdff" },     // ciano
      { k: "#22183a", e: "#6a4ab0", m: "#9a7ae0", c: "#d4c4ff", b: "#f6f0ff" },     // lilás
    ];
    const cristalDe = (x, y) => CRISTAIS[(x * 7 + y * 13) % 3];

    // ---------------------------------------------------------------- o chão
    const chao = (x, y) => {
      const X = x * 16, Y = y * 16;
      ret(X, Y, 16, 16, GRAMA[0]);
      for (let k = 0; k < 10; k++) { const gx = X + r.int(16), gy = Y + r.int(16); px(gx, gy, r.pick(GRAMA)); }
      // os fiozinhos de grama
      for (let k = 0; k < 3; k++) if (r.chance(0.7)) { const gx = X + 1 + r.int(14), gy = Y + 2 + r.int(12); px(gx, gy, "#4a9458"); px(gx + 1, gy - 1, "#4a9458"); px(gx + 2, gy, "#4a9458"); }
      // flor da cratera (rosa, branca ou amarela) e, às vezes, um caquinho de cristal
      if (r.chance(0.14)) { const fx = X + 2 + r.int(11), fy = Y + 2 + r.int(11), c = r.pick(["#ff8ac8", "#ffffff", "#ffe060"]);
        px(fx, fy - 1, c); px(fx - 1, fy, c); px(fx + 1, fy, c); px(fx, fy + 1, c); px(fx, fy, "#ffd040"); }
      if (r.chance(0.06)) { const cx = X + 3 + r.int(10), cy = Y + 4 + r.int(9), cr = cristalDe(x, y);
        px(cx, cy, cr.c); px(cx, cy + 1, cr.m); px(cx + 1, cy + 1, cr.e); px(cx, cy + 2, cr.e); }
      // a sombra do paredão de cima no chão
      if (parede(x, y - 1)) { ret(X, Y, 16, 3, "rgba(30,20,60,0.32)"); ret(X, Y + 3, 16, 2, "rgba(30,20,60,0.16)"); }
      // a beira da água: areiazinha clara
      if (agua(x, y + 1) && at(x, y + 1) !== "=") { ret(X, Y + 14, 16, 2, "#d8e6b8"); ret(X, Y + 13, 16, 1, "#9ccf8a"); }
    };
    // o MATO ALTO (onde moram os selvagens): tufos de folha comprida
    const mato = (x, y) => {
      chao(x, y);
      const X = x * 16, Y = y * 16;
      const TUFO = [
        "..a.....a.......",
        ".ab..a..ab..a...",
        ".ab.ab..ab.ab...",
        "abbcab.abbcab...",
        "abbcabbabbcabb..",
        "bbcccbbbbcccbb..",
        "bccccbbbcccccb..",
        ".dddd...ddddd...",
      ];
      const cores = { a: "#8ae08e", b: "#3a9a5c", c: "#2a7a48", d: "rgba(20,50,30,0.35)" };
      grade(X, Y, TUFO, cores);
      grade(X + 4, Y + 8, TUFO, cores);
    };
    // a ÁGUA: turquesa, com brilho e espuma onde encosta na terra
    const aguaT = (x, y) => {
      const X = x * 16, Y = y * 16;
      ret(X, Y, 16, 16, "#2aa0c4");
      for (let k = 0; k < 3; k++) if (r.chance(0.6)) ret(X + r.int(11), Y + 2 + r.int(12), 3 + r.int(4), 1, "#5cd0ea");
      if (r.chance(0.3)) px(X + r.int(15), Y + r.int(15), "#c8f6ff");
      const terra = (dx, dy) => !agua(x + dx, y + dy) && !parede(x + dx, y + dy) && at(x + dx, y + dy) !== "W";
      if (terra(0, -1)) { ret(X, Y, 16, 2, "#e8fbff"); ret(X, Y + 2, 16, 1, "#8ae4f6"); }
      if (terra(-1, 0)) { ret(X, Y, 2, 16, "#bdf2fc"); }
      if (terra(1, 0)) { ret(X + 14, Y, 2, 16, "#bdf2fc"); }
      if (terra(0, 1)) { ret(X, Y + 14, 16, 2, "#1c7c9c"); }
      // embaixo de cachoeira: a água espumando
      if (at(x, y - 1) === "W" || at(x, y - 2) === "W") for (let k = 0; k < 14; k++) px(X + r.int(16), Y + r.int(10), r.pick(["#ffffff", "#d8f8ff"]));
    };
    // a PONTE: tábuas de madeira por cima da água
    const ponte = (x, y) => {
      aguaT(x, y);
      const X = x * 16, Y = y * 16;
      const vertical = agua(x - 1, y) && agua(x + 1, y) && !agua(x, y - 1);
      if (vertical || (agua(x - 1, y) && agua(x + 1, y))) {
        ret(X + 1, Y, 14, 16, "#8a5a32");
        for (let k = 0; k < 4; k++) { ret(X + 1, Y + k * 4, 14, 1, "#5a3a1e"); ret(X + 2, Y + k * 4 + 1, 12, 1, "#a8743e"); }
        ret(X, Y, 1, 16, "#4a2e16"); ret(X + 15, Y, 1, 16, "#4a2e16");
      } else {
        ret(X, Y + 1, 16, 14, "#8a5a32");
        for (let k = 0; k < 4; k++) { ret(X + k * 4, Y + 1, 1, 14, "#5a3a1e"); ret(X + k * 4 + 1, Y + 2, 1, 12, "#a8743e"); }
        ret(X, Y, 16, 1, "#4a2e16"); ret(X, Y + 15, 16, 1, "#4a2e16");
      }
    };
    // o PAREDÃO DA CRATERA: pedra arroxeada em camadas, com veio de cristal; em
    // cima de chão é a cara do paredão, cercado de pedra é o alto da cratera
    const pedra = (x, y) => {
      const X = x * 16, Y = y * 16;
      const chaoEmbaixo = !parede(x, y + 1) && at(x, y + 1) !== "k", chaoEmCima = !parede(x, y - 1);
      ret(X, Y, 16, 16, "#3a3452");
      for (let k = 0; k < 3; k++) if (r.chance(0.6)) ret(X + r.int(12), Y + r.int(12), 4, 3, "#443d60");
      // musgo no alto da cratera
      for (let k = 0; k < 2; k++) if (r.chance(0.35)) ret(X + r.int(12), Y + r.int(13), 4, 2, "#3f6a4c");
      if (chaoEmbaixo) {
        ret(X, Y + 3, 16, 13, "#6a6288");
        for (let k = 0; k < 3; k++) {
          ret(X, Y + 4 + k * 4, 16, 2, k % 2 ? "#5a5278" : "#7a729a");
          ret(X + ((x * 7 + k * 5) % 12), Y + 6 + k * 4, 3, 1, "#4a4466");
        }
        // o veio de cristal atravessando a pedra
        if ((x * 13 + y * 7) % 3 === 0) {
          const cr = cristalDe(x, y);
          for (let k = 0; k < 9; k++) { px(X + 3 + k, Y + 6 + Math.round(k * 0.5), cr.m); px(X + 3 + k, Y + 5 + Math.round(k * 0.5), cr.c); }
        }
        ret(X, Y + 3, 16, 1, "#948cb4");          // a quina de cima, com luz
        ret(X, Y + 15, 16, 1, "#2a2440");         // o pé
        // as plantinhas penduradas
        if ((x * 5 + y) % 4 === 0) for (let k = 0; k < 5; k++) px(X + 4 + k * 2, Y + 4 + (k % 3), "#4f9a5e");
      }
      if (chaoEmCima) { ret(X, Y, 16, 2, "#5a5278"); ret(X, Y, 16, 1, "#4f9a5e"); }
      if (!parede(x - 1, y) && !chaoEmbaixo) ret(X, Y, 2, 16, "#58507a");
      if (!parede(x + 1, y) && !chaoEmbaixo) ret(X + 14, Y, 2, 16, "#26203a");
    };
    // a CACHOEIRA: a água caindo pela cara do paredão
    const cachoeira = (x, y) => {
      const X = x * 16, Y = y * 16;
      ret(X, Y, 16, 16, "#3aa8cc");
      for (let k = 0; k < 6; k++) { const fx = X + 1 + k * 2 + (k % 2); ret(fx, Y, 1, 16, k % 2 ? "#8ae4f6" : "#5ccae8"); }
      for (let k = 0; k < 8; k++) px(X + r.int(16), Y + r.int(16), "#e8fbff");
      ret(X, Y, 1, 16, "#2a2440"); ret(X + 15, Y, 1, 16, "#2a2440");
      if (!"W".includes(at(x, y - 1))) ret(X + 1, Y, 14, 2, "#e8fbff");
    };
    // o CRISTAL (k): um cacho de três pontas brotando do chão
    const CRISTAL = [
      "................",
      ".........k......",
      "........kck.....",
      "...k....kcmk....",
      "..kck..kccmk....",
      "..kcmk.kcmmk..k.",
      "..kcmk.kcmme.kck",
      ".kccmk.kcmme.kcm",
      ".kcmmekkcmmekkcm",
      ".kcmmekcmmmeekmm",
      ".kcmmekcmmmeekme",
      "kccmmeekcmmeekme",
      "kcmmmeekcmmeekee",
      "kkkkkkkkkkkkkkkk",
      ".ssssssssssssss.",
      "................",
    ];
    const cristal = (x, y) => {
      chao(x, y);
      const cr = cristalDe(x, y);
      grade(x * 16, y * 16, CRISTAL, { k: cr.k, c: cr.c, m: cr.m, e: cr.e, s: "rgba(20,10,40,0.35)" });
      px(x * 16 + 10, y * 16 + 3, cr.b); px(x * 16 + 4, y * 16 + 5, cr.b);
    };
    // o PEDREGULHO
    const PEDREGULHO = [
      "................",
      "................",
      "................",
      ".....kkkkkk.....",
      "...kkllmmmmkk...",
      "..kllllmmmmmmk..",
      "..klllmmmmmmmk..",
      ".kllmmmmmmmmsk..",
      ".klmmmmmmmmmssk.",
      ".kmmmmmmmmmmssk.",
      ".kmmmmmmmmmsssk.",
      ".ksmmmmmmmsssk..",
      "..kssmmmssssk...",
      "...kkksssskk....",
      "..hhhkkkkkhhhh..",
      "................",
    ];
    // a ÁRVORE da cratera: copa redonda e alta, de folha larga
    const ARVORE = [
      "....kkkkkkk.....",
      "..kkaaabbbbkk...",
      ".kaaaabbbbbcck..",
      "kaaabbbbbbbccck.",
      "kaabbbbbbbbccck.",
      "kabbbbbbbbcccck.",
      "kbbbbbbbbcccccck",
      "kbbbbbbcccccccck",
      ".kbbbcccccccddk.",
      "..kcccccccdddk..",
      "...kkkcckkkkk...",
      "......ktk.......",
      "......kttk......",
      "......kttk......",
      "....hhkttkhh....",
      "................",
    ];
    const arvore = (x, y) => {
      chao(x, y);
      grade(x * 16, y * 16, ARVORE, { k: "#1a3a26", a: "#7ad88a", b: "#3fa660", c: "#2c8048", d: "#1e5e34", t: "#6a4a2a", h: "rgba(20,40,20,0.35)" });
    };
    const placa = (x, y) => {
      chao(x, y);
      const X = x * 16, Y = y * 16;
      ret(X + 2, Y + 3, 12, 8, "#2a2440"); ret(X + 3, Y + 4, 10, 6, "#e8e4f4"); ret(X + 4, Y + 5, 8, 1, "#6a6288"); ret(X + 4, Y + 7, 6, 1, "#6a6288");
      ret(X + 7, Y + 11, 2, 4, "#4a3a5a");
    };

    // ---------------------------------------------------------------- a GARAGEM ZERO
    // a CERCA da beira: grade de metal com a cratera lá embaixo
    const cerca = (x, y) => {
      chao(x, y);
      const X = x * 16, Y = y * 16;
      ret(X, Y + 5, 16, 2, "#c8ccd8"); ret(X, Y + 10, 16, 2, "#c8ccd8");
      ret(X, Y + 7, 16, 1, "#6a7080"); ret(X, Y + 12, 16, 1, "#6a7080");
      for (const fx of [1, 8]) { ret(X + fx, Y + 3, 2, 13, "#9aa0b0"); ret(X + fx + 2, Y + 3, 1, 13, "#5a6070"); px(X + fx, Y + 3, "#e8ecf4"); }
      ret(X, Y + 15, 16, 1, "rgba(20,20,40,0.35)");
    };
    // a CRATERA VISTA DE CIMA: a parede descendo, a névoa e, lá no fundo, o verde e os cristais
    const vista = (x, y) => {
      const X = x * 16, Y = y * 16;
      const fundo = y - planta.findIndex((l) => l.includes("V"));     // 0 = a primeira fileira de cratera
      const cores = ["#4a4468", "#3f5a6a", "#3a6a66", "#3a7a60"];
      ret(X, Y, 16, 16, cores[Math.min(cores.length - 1, fundo)]);
      if (fundo === 0) {                          // a quina da beira, e a pedra caindo
        ret(X, Y, 16, 3, "#6a6288"); ret(X, Y + 3, 16, 1, "#2a2440");
        for (let k = 0; k < 4; k++) ret(X + r.int(14), Y + 4 + r.int(8), 2, 3, "#5a5278");
      } else {
        // o verde lá embaixo, as copas pequenininhas e os pontinhos de cristal
        for (let k = 0; k < 6; k++) px(X + r.int(16), Y + r.int(16), r.pick(["#4f9a5e", "#5cae6c", "#3a8a50"]));
        if (r.chance(0.3)) { const c = cristalDe(x, y); px(X + r.int(15), Y + r.int(15), c.c); }
        if (fundo >= 2 && r.chance(0.25)) ret(X + r.int(12), Y + r.int(14), 4, 1, "#5cd0ea");
      }
      // a névoa: faixas claras na frente
      if (fundo === 1 || fundo === 2) ret(X, Y + (x * 3) % 12, 16, 2, "rgba(220,240,255,0.18)");
    };
    // um BLOCO INTEIRO de uma letra (o prédio, o heliponto, o CRISTAL GIGANTE)
    const blocos = (letra) => {
      const vistos = new Set(), out = [];
      for (let y = 0; y < th; y++) for (let x = 0; x < tw; x++) {
        if (at(x, y) !== letra || vistos.has(`${x},${y}`)) continue;
        let w = 0; while (at(x + w, y) === letra) w++;
        let h = 0; while (at(x, y + h) === letra) h++;
        for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) vistos.add(`${x + i},${y + j}`);
        out.push({ x, y, w, h });
      }
      return out;
    };

    // ---------------------------------------------------------------- pinta tile por tile
    for (let y = 0; y < th; y++) for (let x = 0; x < tw; x++) {
      const c = at(x, y), X = x * 16, Y = y * 16;
      if (c === "#") pedra(x, y);
      else if (c === "W") cachoeira(x, y);
      else if (c === "~") aguaT(x, y);
      else if (c === "=") ponte(x, y);
      else if (c === ",") mato(x, y);
      else if (c === "k") cristal(x, y);
      else if (c === "t") arvore(x, y);
      else if (c === "E") cerca(x, y);
      else if (c === "V") vista(x, y);
      else if (/[1-9]/.test(c)) placa(x, y);
      else if (c === "K") aguaT(x, y);              // por baixo do cristal gigante, a água do lago
      else chao(x, y);
      if (c === "o") grade(X, Y, PEDREGULHO, { k: "#2a2440", l: "#a8a0c4", m: "#7a729a", s: "#5a5278", h: "rgba(20,10,40,0.35)" });
    }

    // ---------------------------------------------------------------- os blocos inteiros
    // O HELIPONTO: o chão de concreto com o círculo amarelo e o H
    for (const b of blocos("X")) {
      const X = b.x * 16, Y = b.y * 16, W = b.w * 16, H = b.h * 16;
      ret(X, Y, W, H, "#8a8e9a");
      for (let k = 0; k < 40; k++) px(X + r.int(W), Y + r.int(H), r.pick(["#7e828e", "#969aa6"]));
      ret(X, Y, W, 2, "#f0c020"); ret(X, Y + H - 2, W, 2, "#f0c020"); ret(X, Y, 2, H, "#f0c020"); ret(X + W - 2, Y, 2, H, "#f0c020");
      const cx = X + W / 2, cy = Y + H / 2, raio = Math.min(W, H) / 2 - 6;
      ctx.strokeStyle = "#f0e8d0"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(cx, cy, raio, 0, Math.PI * 2); ctx.stroke();
      ret(cx - 10, cy - 12, 4, 24, "#f0e8d0"); ret(cx + 6, cy - 12, 4, 24, "#f0e8d0"); ret(cx - 6, cy - 2, 12, 4, "#f0e8d0");
      // as luzinhas da beira
      for (let k = 0; k < b.w; k++) { px(X + k * 16 + 8, Y + 1, "#ff5040"); px(X + k * 16 + 8, Y + H - 2, "#ff5040"); }
    }
    // O PRÉDIO DA GARAGEM ZERO: branco, com a faixa azul, as janelas, o portão de garagem e o letreiro
    for (const b of blocos("Z")) {
      const X = b.x * 16, Y = b.y * 16, W = b.w * 16, H = b.h * 16;
      ret(X, Y + 6, W, H - 6, "#e4e8f0");                      // a parede
      ret(X - 2, Y, W + 4, 8, "#5a6a8a"); ret(X - 2, Y, W + 4, 2, "#8a9aba"); ret(X - 2, Y + 7, W + 4, 1, "#3a4a6a");   // o telhado
      ret(X, Y + 14, W, 4, "#2a7ab0"); ret(X, Y + 14, W, 1, "#5aaee0");                    // a faixa azul
      for (let i = 0; i < 4; i++) { const jx = X + 8 + i * 14; if (jx + 10 > X + W / 2 - 8) break;
        ret(jx, Y + 22, 10, 8, "#2a3a5a"); ret(jx + 1, Y + 23, 8, 6, "#6ac4f0"); ret(jx + 1, Y + 23, 3, 2, "#c8f0ff"); }
      // o portão de garagem, de lâminas
      const gx = X + W / 2 + 4, gw = W / 2 - 12;
      ret(gx, Y + 26, gw, H - 26, "#7a8090");
      for (let k = 0; k < 6; k++) ret(gx, Y + 28 + k * 5, gw, 1, "#5a6070");
      ret(gx - 1, Y + 25, gw + 2, 1, "#3a4050");
      // a porta de gente
      ret(X + 14, Y + H - 18, 12, 18, "#3a4a6a"); ret(X + 15, Y + H - 17, 10, 16, "#5a7aa0"); px(X + 23, Y + H - 9, "#f0c020");
      // o letreiro ZERO, em ciano
      const L = { Z: ["####", "...#", "..#.", ".#..", "####"], E: ["####", "#...", "###.", "#...", "####"], R: ["###.", "#..#", "###.", "#.#.", "#..#"], O: [".##.", "#..#", "#..#", "#..#", ".##."] };
      [..."ZERO"].forEach((ch, i) => grade(X + W / 2 - 22 + i * 6, Y + 1, L[ch], { "#": "#7affff" }));
      ret(X, Y + H - 1, W, 1, "#8a90a0");
    }
    // O CRISTAL GIGANTE do meio do lago: três pontas enormes, facetadas, brilhando
    for (const b of blocos("K")) {
      const X = b.x * 16, Y = b.y * 16, W = b.w * 16, H = b.h * 16;
      const brilho = ctx.createRadialGradient(X + W / 2, Y + H / 2, 4, X + W / 2, Y + H / 2, W);
      brilho.addColorStop(0, "rgba(255,200,240,0.45)"); brilho.addColorStop(1, "rgba(255,200,240,0)");
      ctx.fillStyle = brilho; ctx.fillRect(X - W / 2, Y - H / 2, W * 2, H * 2);
      const ponta = (cx, base, larg, alt, cr) => {
        // o contorno, as duas faces (a clara e a escura) e o fio de luz no meio
        ctx.fillStyle = cr.k;
        ctx.beginPath(); ctx.moveTo(cx - larg / 2 - 1, base); ctx.lineTo(cx, base - alt - 1); ctx.lineTo(cx + larg / 2 + 1, base); ctx.closePath(); ctx.fill();
        ctx.fillStyle = cr.c;
        ctx.beginPath(); ctx.moveTo(cx - larg / 2, base); ctx.lineTo(cx, base - alt); ctx.lineTo(cx, base); ctx.closePath(); ctx.fill();
        ctx.fillStyle = cr.e;
        ctx.beginPath(); ctx.moveTo(cx, base); ctx.lineTo(cx, base - alt); ctx.lineTo(cx + larg / 2, base); ctx.closePath(); ctx.fill();
        ctx.fillStyle = cr.m; ctx.fillRect(Math.round(cx - larg / 4), Math.round(base - alt / 2), 2, Math.round(alt / 3));
        ctx.fillStyle = cr.b; ctx.fillRect(Math.round(cx - 1), Math.round(base - alt + 3), 1, Math.round(alt / 2));
      };
      const base = Y + H - 4;
      ponta(X + W * 0.22, base, W * 0.32, H * 0.62, CRISTAIS[2]);
      ponta(X + W * 0.80, base, W * 0.30, H * 0.55, CRISTAIS[1]);
      ponta(X + W * 0.50, base + 2, W * 0.42, H * 1.15, CRISTAIS[0]);
      // a base de pedra dentro da água
      ret(X + 4, base - 2, W - 8, 4, "#3a3452"); ret(X + 6, base + 2, W - 12, 2, "#1c7c9c");
    }
    return cv;
  },

  cavernaArt(geo, seed = 5501) {
    const r = makeRng(seed + 77);
    const planta = geo.planta || [];
    const th = planta.length, tw = planta[0]?.length || 0;
    const { cv, ctx } = makeCanvas(tw * 16, th * 16);
    const at = (x, y) => planta[y]?.[x] ?? "#";
    const parede = (x, y) => "#".includes(at(x, y));
    const px = (x, y, cor) => { ctx.fillStyle = cor; ctx.fillRect(x, y, 1, 1); };
    const grade = (X, Y, linhas, cores) => linhas.forEach((l, dy) => [...l].forEach((ch, dx) => { if (cores[ch]) px(X + dx, Y + dy, cores[ch]); }));
    // o chão: terra de granito, lisa, com uns grãos
    const CHAO = ["#6e5546", "#7a6050", "#62493c", "#86705f"];
    const chao = (x, y) => {
      const X = x * 16, Y = y * 16;
      ctx.fillStyle = CHAO[0]; ctx.fillRect(X, Y, 16, 16);
      for (let k = 0; k < 4; k++) if (r.chance(0.6)) { const gx = X + r.int(15), gy = Y + r.int(15); px(gx, gy, CHAO[3]); px(gx, gy + 1, CHAO[2]); }
      if (r.chance(0.08)) { ctx.fillStyle = CHAO[1]; ctx.fillRect(X + r.int(10), Y + r.int(12), 5, 2); }
      // a sombra da parede de cima no chão
      if (parede(x, y - 1)) { ctx.fillStyle = "rgba(20,8,4,0.35)"; ctx.fillRect(X, Y, 16, 4); ctx.fillStyle = "rgba(20,8,4,0.18)"; ctx.fillRect(X, Y + 4, 16, 2); }
      if (parede(x - 1, y)) { ctx.fillStyle = "rgba(20,8,4,0.2)"; ctx.fillRect(X, Y, 2, 16); }
    };
    // o cascalho (onde moram os selvagens): pedrinha solta por cima do chão
    const cascalho = (x, y) => {
      chao(x, y);
      const X = x * 16, Y = y * 16;
      for (let k = 0; k < 7; k++) {
        const gx = X + 1 + r.int(13), gy = Y + 1 + r.int(13), cor = r.pick(["#a08a76", "#94806c", "#b39d88"]);
        px(gx, gy, cor); px(gx + 1, gy, cor); px(gx, gy + 1, "#4a362c"); px(gx + 1, gy + 1, "#4a362c");
      }
    };
    // a água de dentro da montanha: escura e parada, com um brilho ou outro
    const agua = (x, y) => {
      const X = x * 16, Y = y * 16;
      ctx.fillStyle = "#1d3f4f"; ctx.fillRect(X, Y, 16, 16);
      if (r.chance(0.4)) { ctx.fillStyle = "#2f6276"; ctx.fillRect(X + r.int(10), Y + r.int(14), 4 + r.int(4), 1); }
      if (!"~".includes(at(x, y - 1))) { ctx.fillStyle = "#3a2a22"; ctx.fillRect(X, Y, 16, 2); ctx.fillStyle = "#4f8aa0"; ctx.fillRect(X, Y + 2, 16, 1); }
    };
    // a PEDRA: em cima de chão vira paredão (a cara da rocha, com camadas e o
    // veio de quartzo); cercada de pedra é o escuro da montanha
    const pedra = (x, y) => {
      const X = x * 16, Y = y * 16;
      const chaoEmbaixo = !parede(x, y + 1), chaoEmCima = !parede(x, y - 1);
      ctx.fillStyle = "#2a1d18"; ctx.fillRect(X, Y, 16, 16);
      for (let k = 0; k < 3; k++) if (r.chance(0.5)) { ctx.fillStyle = "#33241e"; ctx.fillRect(X + r.int(12), Y + r.int(12), 4, 3); }
      if (chaoEmbaixo) {                            // a cara do paredão
        ctx.fillStyle = "#5a3f33"; ctx.fillRect(X, Y + 4, 16, 12);
        for (let k = 0; k < 3; k++) {
          ctx.fillStyle = k % 2 ? "#4c352b" : "#694b3d";
          ctx.fillRect(X, Y + 5 + k * 4, 16, 2);
          ctx.fillStyle = "#3d2a22"; ctx.fillRect(X + ((x * 7 + k * 5) % 12), Y + 7 + k * 4, 3, 1);
        }
        if ((x * 13 + y * 7) % 5 === 0) {           // o veio de quartzo atravessando
          for (let k = 0; k < 10; k++) px(X + 3 + k, Y + 6 + Math.round(k * 0.6), "#d9cfc4");
        }
        ctx.fillStyle = "#7d5d4c"; ctx.fillRect(X, Y + 4, 16, 1);      // a quina de cima, com luz
        ctx.fillStyle = "#24170f"; ctx.fillRect(X, Y + 15, 16, 1);     // o pé
      }
      if (chaoEmCima) { ctx.fillStyle = "#4a342a"; ctx.fillRect(X, Y, 16, 2); }
      if (!parede(x - 1, y) && !chaoEmbaixo) { ctx.fillStyle = "#43302a"; ctx.fillRect(X, Y, 2, 16); }
      if (!parede(x + 1, y) && !chaoEmbaixo) { ctx.fillStyle = "#1c120e"; ctx.fillRect(X + 14, Y, 2, 16); }
    };
    const PEDREGULHO = [
      "................",
      "................",
      "................",
      ".....kkkkkk.....",
      "...kkcclmmmkk...",
      "..kcllllmmmmmk..",
      "..kclllmmmmmmk..",
      ".kcllmmmmmmmmsk.",
      ".kclmmmmmmmmssk.",
      ".kmmmmmmmmmmssk.",
      ".kmmmmmmmmmsssk.",
      ".ksmmmmmmmsssk..",
      "..kssmmmssssk...",
      "...kkksssskk....",
      "..hhhkkkkkhhhh..",
      "................",
    ];
    const CRISTAL = [
      "................",
      "......k.........",
      ".....kbk....k...",
      ".....kbwk..kbk..",
      "....kbbwk..kbwk.",
      "..k.kbbwk.kbbwk.",
      ".kbkkbbwk.kbbwk.",
      ".kbwkbbwkkbbbwk.",
      ".kbwkbbbwkbbbwk.",
      ".kbbkbbbwkbbbwk.",
      "kbbbwkbbwkbbbwk.",
      "kbbbwkbbbkbbbbk.",
      "kkkkkkkkkkkkkkk.",
      ".rrrrrrrrrrrrr..",
      "..hhhhhhhhhhhh..",
      "................",
    ];
    const BURACO = [
      "................",
      "..kkkkkkkkkkkk..",
      ".kddddddddddddk.",
      "kddtttttttttdddk",
      "kddtddddddtdddk.",
      "kddtttttttttdddk",
      "kddtddddddtdddk.",
      "kddtttttttttdddk",
      "kddtddddddtdddk.",
      "kddtttttttttdddk",
      "kddddddddddddddk",
      ".kddddddddddddk.",
      "..kkkkkkkkkkkk..",
      "................",
      "................",
      "................",
    ];
    const ESCADA = [
      "...t........t...",
      "...tmmmmmmmmt...",
      "...t........t...",
      "...t........t...",
      "...tmmmmmmmmt...",
      "...t........t...",
      "...t........t...",
      "...tmmmmmmmmt...",
      "...t........t...",
      "...t........t...",
      "...tmmmmmmmmt...",
      "...t........t...",
      "...t........t...",
      "...tmmmmmmmmt...",
      "..hthhhhhhhhth..",
      "................",
    ];
    for (let y = 0; y < th; y++) for (let x = 0; x < tw; x++) {
      const c = at(x, y), X = x * 16, Y = y * 16;
      if (c === "#") pedra(x, y);
      else if (c === "~") agua(x, y);
      else if (c === ",") cascalho(x, y);
      else chao(x, y);
      if (c === "o") grade(X, Y, PEDREGULHO, { k: "#2b1c16", c: "#c4a690", l: "#a8866f", m: "#8a6a56", s: "#6a4e40", h: "rgba(20,8,4,0.35)" });
      else if (c === "k") {
        // quartzo: rosa claro na maioria, ametista de vez em quando
        const ame = (x * 3 + y * 5) % 4 === 0;
        grade(X, Y, CRISTAL, { k: ame ? "#3b2152" : "#5a3a46", b: ame ? "#9d6ad0" : "#e7c6cf", w: ame ? "#e2ccff" : "#fff4f6",
                               r: "#4a342a", h: "rgba(20,8,4,0.35)" });
        // o brilho que ele joga no chão em volta
        const brilho = ctx.createRadialGradient(X + 8, Y + 8, 2, X + 8, Y + 8, 18);
        brilho.addColorStop(0, ame ? "rgba(170,120,230,0.22)" : "rgba(255,220,230,0.2)");
        brilho.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = brilho;
        ctx.fillRect(X - 12, Y - 12, 40, 40);
      } else if (c === "Q") grade(X, Y, BURACO, { k: "#2b1c16", d: "#0c0706", t: "#a07a4a" });
      else if (c === "q") grade(X, Y, ESCADA, { t: "#8a6238", m: "#b8905a", h: "rgba(20,8,4,0.35)" });
      else if (c === "U") {                         // a boca: a luz de fora entrando
        const g = ctx.createRadialGradient(X + 8, Y + (y < th / 2 ? 0 : 16), 1, X + 8, Y + 8, 22);
        g.addColorStop(0, "rgba(255,246,214,0.85)");
        g.addColorStop(1, "rgba(255,246,214,0)");
        ctx.fillStyle = g; ctx.fillRect(X - 16, Y - 16, 48, 48);
      } else if (/[1-9]/.test(c)) {                // placa de madeira
        grade(X, Y, ["................", "................", "..kkkkkkkkkkkk..", "..kmmmmmmmmmmk..", "..kmllllllllmk..",
                     "..kmmmmmmmmmmk..", "..kmlllllllmmk..", "..kmmmmmmmmmmk..", "..kkkkkkkkkkkk..", "......kmk.......",
                     "......kmk.......", "......kmk.......", ".....hkmkh......", "................", "................", "................"],
             { k: "#3a2414", m: "#a8744a", l: "#7a5030", h: "rgba(20,8,4,0.35)" });
      }
    }
    // a escuridão nas beiradas: a luz é de quem anda (um véu leve por cima)
    const v = ctx.createRadialGradient(cv.width / 2, cv.height / 2, Math.min(cv.width, cv.height) * 0.3, cv.width / 2, cv.height / 2, Math.max(cv.width, cv.height) * 0.75);
    v.addColorStop(0, "rgba(0,0,0,0)");
    v.addColorStop(1, "rgba(8,4,2,0.35)");
    ctx.fillStyle = v; ctx.fillRect(0, 0, cv.width, cv.height);
    // A SALA DA FONTE DE CELADON (tema "fonte"): a mesma pedra, só que azulada —
    // troca o vermelho pelo azul em todo pixel puxado pro marrom (a água e os
    // cristais, que já são azul e rosa, ficam como estão)
    if (geo.tema === "fonte") {
      const dados = ctx.getImageData(0, 0, cv.width, cv.height), d = dados.data;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i] > d[i + 2] + 8 && d[i] - d[i + 1] < 60) { const r = d[i]; d[i] = d[i + 2]; d[i + 2] = Math.min(255, r + 10); }
      }
      ctx.putImageData(dados, 0, 0);
    }
    return cv;
  },

  /** O CIBERESPAÇO (src/data/ciberespaco.js), desenhado do zero a partir da
   *  planta: o chão é uma grade azul-escura; as NUVENS DE DADOS (onde os
   *  bichos moram) são pacotinhos verdes acesos; os blocos são de CIRCUITO roxo
   *  com trilhas e nós brilhando (bloco no meio de bloco vira o vazio, com
   *  estrelinhas de pixel); os PORTAIS são anéis ciano e magenta (o de volta,
   *  branco e dourado); as placas são terminais com a tela verde. */
  ciberArt(geo, seed = 5501) {
    const r = makeRng(seed + 404);
    const planta = geo.planta || [];
    const th = planta.length, tw = planta[0]?.length || 0;
    const { cv, ctx } = makeCanvas(tw * 16, th * 16);
    const at = (x, y) => planta[y]?.[x] ?? "#";
    const bloco = (x, y) => at(x, y) === "#";
    const px = (x, y, cor) => { ctx.fillStyle = cor; ctx.fillRect(x, y, 1, 1); };
    const ret = (x, y, w, h, cor) => { ctx.fillStyle = cor; ctx.fillRect(x, y, w, h); };
    // o chão: azul-noite com a grade e um bit perdido aqui e ali
    const chao = (x, y) => {
      const X = x * 16, Y = y * 16;
      ret(X, Y, 16, 16, "#0b1030");
      ret(X, Y, 16, 1, "#18337a"); ret(X, Y, 1, 16, "#18337a");
      if ((x + y) % 4 === 0) px(X, Y, "#3d6cff");                  // o cruzamento aceso
      if (r.chance(0.25)) px(X + 2 + r.int(12), Y + 2 + r.int(12), r.pick(["#2a4fae", "#6a3cc8", "#1f7a9a"]));
      // a sombra do bloco de cima
      if (bloco(x, y - 1)) { ret(X, Y, 16, 3, "rgba(0,0,10,0.55)"); }
    };
    // a nuvem de dados: o chão com pacotinhos verdes (2x2 com o brilho em cima)
    const dados = (x, y) => {
      chao(x, y);
      const X = x * 16, Y = y * 16;
      ret(X + 1, Y + 1, 15, 15, "rgba(20,120,90,0.28)");
      for (let k = 0; k < 6; k++) {
        const gx = X + 1 + r.int(12), gy = Y + 1 + r.int(12);
        const cor = r.pick(["#36f5a8", "#22c48a", "#7cffcf"]);
        ret(gx, gy, 2, 2, cor); px(gx, gy, "#e8fff6"); px(gx + 1, gy + 2, "#0a3a2a"); px(gx + 2, gy + 1, "#0a3a2a");
      }
    };
    // o bloco de circuito: com chão embaixo é a CARA (roxa, trilhas e nós);
    // com chão em cima, a tampa com borda; cercado, o vazio estrelado
    const circuito = (x, y) => {
      const X = x * 16, Y = y * 16;
      const caraEmbaixo = !bloco(x, y + 1), chaoEmCima = !bloco(x, y - 1) && y > 0;
      const cercado = bloco(x, y + 1) && bloco(x, y - 1) && bloco(x - 1, y) && bloco(x + 1, y);
      if (cercado && !caraEmbaixo) {
        ret(X, Y, 16, 16, "#05050f");
        if (r.chance(0.5)) px(X + r.int(16), Y + r.int(16), r.pick(["#ffffff", "#5af0ff", "#ff5ad8", "#3d6cff"]));
        return;
      }
      ret(X, Y, 16, 16, "#2a0f4a");
      // a trilha: um caminho que vira no meio, com o nó aceso
      const ty = Y + 3 + r.int(10), tx = X + 3 + r.int(10);
      ret(X, ty, tx - X + 1, 1, "#9b4cff"); ret(tx, ty, 1, Y + 16 - ty, "#9b4cff");
      ret(tx - 1, ty - 1, 3, 3, "#ff5ad8"); px(tx, ty, "#ffe6fb");
      if (r.chance(0.5)) { const y2 = Y + 2 + r.int(12); ret(X + 8, y2, 8, 1, "#6a2cc0"); px(X + 8, y2, "#5af0ff"); }
      if (chaoEmCima) { ret(X, Y, 16, 2, "#7a3ae0"); ret(X, Y + 2, 16, 1, "#4a1a8a"); }
      if (caraEmbaixo) {
        ret(X, Y + 12, 16, 4, "#1a0832");                         // o rodapé
        for (let k = 1; k < 16; k += 3) px(X + k, Y + 13, (k + x) % 2 ? "#5af0ff" : "#ff5ad8");   // as luzinhas
        ret(X, Y + 15, 16, 1, "#000000");
      }
      if (!bloco(x - 1, y)) ret(X, Y, 1, 16, "#7a3ae0");
      if (!bloco(x + 1, y)) ret(X + 15, Y, 1, 16, "#120424");
    };
    // o portal: anéis um dentro do outro, com o miolo claro
    const portal = (x, y, volta) => {
      chao(x, y);
      const X = x * 16 + 8, Y = y * 16 + 8;
      const aneis = volta ? ["#ffd84a", "#ffffff", "#fff3b0"] : ["#5af0ff", "#ff5ad8", "#b8fbff"];
      [[7, 6], [5, 4], [3, 2]].forEach(([rx, ry], i) => {
        ctx.strokeStyle = aneis[i]; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(X, Y, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
      });
      ret(X - 1, Y - 1, 2, 2, "#ffffff");
    };
    // o terminal: monitorzinho de tela verde, num pé
    const terminal = (x, y) => {
      chao(x, y);
      const X = x * 16, Y = y * 16;
      ret(X + 2, Y + 2, 12, 9, "#2a2a44"); ret(X + 3, Y + 3, 10, 7, "#0a3a2a");
      for (let k = 0; k < 3; k++) ret(X + 4, Y + 4 + k * 2, 3 + ((x * 7 + k * 3) % 6), 1, "#7cffcf");
      ret(X + 7, Y + 11, 2, 3, "#2a2a44"); ret(X + 5, Y + 14, 6, 1, "#2a2a44");
    };
    for (let y = 0; y < th; y++) for (let x = 0; x < tw; x++) {
      const c = at(x, y);
      if (c === "#") circuito(x, y);
      else if (c === ",") dados(x, y);
      else if (c === "Q" || c === "q") portal(x, y, c === "q");
      else if (/[1-9]/.test(c)) terminal(x, y);
      else chao(x, y);
    }
    return cv;
  },

  /** os blocos do FireRed (src/core/fr-blocos.js), virados canvas uma vez só */
  blocosFR() {
    if (!this._blocosFR) {
      this._blocosFR = Object.fromEntries(Object.entries(FR_BLOCOS).map(([k, rows]) => [k, spriteFromRows(rows, FR_CORES)]));
      for (const [k, rows] of Object.entries(GRANDES)) this._blocosFR[k] = spriteFromRows(rows, GRANDE_CORES);   // a árvore da FLORESTA DE VIRIDIAN
    }
    return this._blocosFR;
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
    if (["caverna", "fonte", "subterraneo"].includes(geo.tema)) return this.cavernaArt(geo, seed);
    if (geo.tema === "areazero") return this.areaZeroArt(geo, seed);
    // a SALA DA LIGA DE BRAGLITCH: quem desenha é src/systems/ligabrag.js (muda de forma)
    // a ÁRVORE OCA: quem desenha é src/systems/arvoreoca.js
    if (geo.tema === "ligavoid") { const { cv, ctx } = makeCanvas((geo.planta[0]?.length || 1) * 16, geo.planta.length * 16); ctx.fillStyle = "#000000"; ctx.fillRect(0, 0, cv.width, cv.height); return cv; }   // a LIGA DO VOID: quem pinta é src/systems/ligavoid.js
    if (geo.tema === "arvoreoca") { const { cv, ctx } = makeCanvas((geo.planta[0]?.length || 1) * 16, geo.planta.length * 16); ctx.fillStyle = "#120a04"; ctx.fillRect(0, 0, cv.width, cv.height); return cv; }
    if (geo.tema === "ligabrag") { const { cv, ctx } = makeCanvas((geo.planta[0]?.length || 1) * 16, geo.planta.length * 16); ctx.fillStyle = "#08080c"; ctx.fillRect(0, 0, cv.width, cv.height); return cv; }
    if (geo.tema === "ciber") return this.ciberArt(geo, seed);
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
    const PREDIO = "HhLCMIKGAT";
    // KALOS (src/data/kalos.js): calçada de paralelepípedo no lugar da terra
    const lumiose = tema === "lumiose";
    // BRAGLITCH COM OS BLOCOS DO FIRERED (pedido do CAIO, nov/2026): a grama, o
    // capim alto, a areia, a água e as árvores saem do tileset do FireRed
    // (src/core/fr-blocos.js); o caminho de terra, o coqueiro e as casas continuam
    const FR = !!geo.braglitch && !lumiose;
    const B = FR ? this.blocosFR() : null;
    const calcada = (x, y) => {
      const X = x * 16, Y = y * 16;
      liso(x, y, "#b3ada3");
      for (let fy = 0; fy < 4; fy++) {             // as pedras em fileiras desencontradas
        const des = (fy + y) % 2 ? 4 : 0;
        for (let fx = -des; fx < 16; fx += 8) {
          const sx = X + Math.max(0, fx), sw = Math.min(fx + 7, 16) - Math.max(0, fx);
          if (sw <= 0) continue;
          ctx.fillStyle = r.pick(["#bdb7ad", "#aba59b", "#c4beb3", "#b7b1a6"]);
          ctx.fillRect(sx, Y + fy * 4, sw, 3);
          ctx.fillStyle = "#cfc9be";
          ctx.fillRect(sx, Y + fy * 4, sw, 1);       // a luz em cima da pedra
        }
      }
    };

    // O CHÃO. Antes era tudo salpicado de quadradinhos de 4px sorteados, e de
    // longe parecia chuvisco de TV. Agora é como no FireRed: cor lisa, e o
    // detalhe vai em poucos pixels que querem dizer alguma coisa — o tufo de
    // grama, a pedrinha no caminho, o grão de areia.
    const liso = (x, y, cor) => { ctx.fillStyle = cor; ctx.fillRect(x * 16, y * 16, 16, 16); };
    const px1 = (x, y, cor) => { ctx.fillStyle = cor; ctx.fillRect(x, y, 1, 1); };
    const grama = (x, y) => {
      if (FR) { ctx.drawImage(B[r.chance(0.8) ? "grama" : r.chance(0.5) ? "grama2" : "grama3"], x * 16, y * 16); return; }
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
      if (FR) { ctx.drawImage(B.areia, x * 16, y * 16); return; }
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

    // O GELO (o lago congelado, letra g): azul bem clarinho, liso, com o
    // brilho riscado de quem escorrega, umas rachaduras e a beirada mais
    // escura onde encosta na terra
    const ehGelo = (x, y) => at(x, y) === "g";
    const gelo = (x, y) => {
      const X = x * 16, Y = y * 16;
      liso(x, y, "#d4ecf7");
      if ((x + y) % 2 === 0) { ctx.fillStyle = "#e4f4fb"; ctx.fillRect(X, Y, 16, 16); }
      // o brilho: dois riscos brancos na diagonal
      if (r.chance(0.45)) {
        const sx = X + 2 + r.int(8), sy = Y + 2 + r.int(8);
        for (let k = 0; k < 5; k++) px1(sx + k, sy + k, "#ffffff");
        for (let k = 0; k < 3; k++) px1(sx + k + 2, sy + k, "#ffffff");
      }
      // uma rachadura fininha
      if (r.chance(0.25)) {
        let cx = X + 2 + r.int(12), cy = Y + 2 + r.int(6);
        for (let k = 0; k < 6; k++) { px1(cx, cy, "#9cc7de"); cx += r.int(3) - 1; cy += 1; }
      }
      // a beirada: onde acaba o gelo, uma linha azul mais escura e a neve em volta
      const B = "#8fbcd6";
      if (!ehGelo(x, y - 1)) { ctx.fillStyle = B; ctx.fillRect(X, Y, 16, 1); ctx.fillStyle = "#f6fbff"; ctx.fillRect(X, Y + 1, 16, 1); }
      if (!ehGelo(x, y + 1)) { ctx.fillStyle = B; ctx.fillRect(X, Y + 15, 16, 1); }
      if (!ehGelo(x - 1, y)) { ctx.fillStyle = B; ctx.fillRect(X, Y, 1, 16); }
      if (!ehGelo(x + 1, y)) { ctx.fillStyle = B; ctx.fillRect(X + 15, Y, 1, 16); }
    };

    // 1. O CHÃO de todo tile (os prédios e as árvores vão por cima)
    for (let y = 0; y < th; y++) {
      for (let x = 0; x < tw; x++) {
        const c = at(x, y);
        // (a pedra no meio do lago fica em cima de gelo, não de grama)
        if (c === "g" || (c === "o" && ehGelo(x - 1, y) && ehGelo(x + 1, y))) gelo(x, y);
        else if (c === "~" || c === "B") {
          if (FR) ctx.drawImage(B.agua, x * 16, y * 16);
          else salpica(x, y, AGUA);
          if (!FR && r.chance(0.3)) {               // crista de onda
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
        else if (lumiose && /[PD1-9lT]/.test(c)) calcada(x, y);
        else if (c === "P" || c === "D") terra(x, y);
        else if (c === "R" || c === "e" || c === "U") salpica(x, y, ["#8d8a84", "#97948d", "#827f79", "#a09c94"]);
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
        if (c === "c") {                            // KALOS: a PAREDE HOLOGRÁFICA da zona selvagem
          // o chão de baixo é o de quem está do lado de fora (calçada) ou de dentro (grama)
          const fora = [at(x - 1, y), at(x + 1, y), at(x, y - 1), at(x, y + 1)].some((v) => "PD".includes(v));
          if (fora) calcada(x, y);
          const vert = at(x, y - 1) === "c" || at(x, y + 1) === "c";
          const horiz = at(x - 1, y) === "c" || at(x + 1, y) === "c";
          ctx.fillStyle = "rgba(60,230,255,0.28)";                         // o painel de luz
          if (horiz || !vert) ctx.fillRect(X, Y + 3, 16, 10);
          if (vert) ctx.fillRect(X + 4, Y, 8, 16);
          ctx.fillStyle = "rgba(170,250,255,0.9)";                         // as bordas acesas
          if (horiz || !vert) { ctx.fillRect(X, Y + 3, 16, 1); ctx.fillRect(X, Y + 12, 16, 1); }
          if (vert) { ctx.fillRect(X + 4, Y, 1, 16); ctx.fillRect(X + 11, Y, 1, 16); }
          ctx.fillStyle = "rgba(120,240,255,0.55)";                        // as linhas de varredura
          if (horiz || !vert) for (let k = 5; k < 12; k += 3) ctx.fillRect(X, Y + k, 16, 1);
          if (vert) for (let k = 2; k < 16; k += 4) ctx.fillRect(X + 5, Y + k, 6, 1);
          if ((x + y) % 3 === 0) { ctx.fillStyle = "#ffffff"; ctx.fillRect(X + 7, Y + 7, 2, 2); }   // o brilho
          ctx.fillStyle = "#1f3b52";                                       // o emissor no chão
          ctx.fillRect(X + (vert ? 3 : 0), Y + 13, vert ? 10 : 16, 2);
          continue;
        }
        if (c === "l") {                            // KALOS: o poste de luz de ferro
          ctx.fillStyle = "rgba(0,0,0,0.2)"; ctx.fillRect(X + 9, Y + 13, 5, 2);
          ctx.fillStyle = "#2b2f36"; ctx.fillRect(X + 7, Y + 4, 2, 11); ctx.fillRect(X + 5, Y + 13, 6, 2);
          ctx.fillStyle = "#2b2f36"; ctx.fillRect(X + 4, Y, 8, 5);
          ctx.fillStyle = "#ffe08a"; ctx.fillRect(X + 5, Y + 1, 6, 3);
          ctx.fillStyle = "#fff6cf"; ctx.fillRect(X + 6, Y + 1, 2, 1);
          continue;
        }
        if (c === "," && FR) ctx.drawImage(B.capim, X, Y);   // o capim alto do FireRed
        else if (c === "#" && FR) { /* a árvore do FireRed vem inteira depois (4) */ }
        else if (c === ",") {                       // mato alto
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
        } else if (c === "R" || c === "U") {        // paredão da serra: pedra em camadas
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
          if (c === "U") {                          // a BOCA DA CAVERNA (src/data/caverna-serra.js)
            const BOCA = [
              "................",
              "................",
              ".....aaaaaa.....",
              "...aakkkkkkaa...",
              "..akkddddddkka..",
              ".akddddddddddka.",
              ".akddddddddddka.",
              "akdddddddddddkka",
              "akddddddddddddka",
              "akddddddddddddka",
              "akdddddddddddddk",
              "kddddddddddddddk",
              "kddddddddddddddk",
              "kddddddddddddddk",
              "kddddddddddddddk",
              "kddddddddddddddk",
            ];
            const COR = { a: "#a39e95", k: "#3a3632", d: "#121010" };
            BOCA.forEach((linha, dy) => [...linha].forEach((ch, dx) => {
              if (!COR[ch]) return;
              ctx.fillStyle = COR[ch];
              ctx.fillRect(X + dx, Y + dy, 1, 1);
            }));
          }
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

    // 4 (antes dos prédios, que não encostam em árvore). AS ÁRVORES DO FIRERED
    // (Braglitch): cada 2x2 de "#" vira uma árvore inteira; sobrou uma coluna de
    // 2, a fininha; sobrou um só, a moita. O PÉ fica no chão (embaixo do
    // jogador); a COPA e a PONTA vão pro `over`, a camada que fica POR CIMA de
    // tudo — a ponta sobe pro bloco de cima e cobre quem estiver lá: o jogador
    // passando atrás, a árvore de trás, a água.
    if (FR) {
      // as ÁRVORES 3D (src/core/arvore3d.js): o overworld desenha cada uma, todo
      // quadro, na fila de quem está em pé (o jogador passa atrás e na frente).
      // Aqui só fica a lista (e, no fim, o desenho com elas pintadas, pro isométrico).
      const lista = [];
      const usada = new Set(), k = (x, y) => y * tw + x;
      const livre = (x, y) => x >= 0 && y >= 0 && x < tw && y < th && at(x, y) === "#" && !usada.has(k(x, y));
      for (let y = 0; y < th; y++) for (let x = 0; x < tw; x++) {
        if (!livre(x, y)) continue;
        let tipo, larg, alt;
        if (livre(x + 1, y) && livre(x, y + 1) && livre(x + 1, y + 1)) { tipo = "arvore"; larg = 2; alt = 2; }
        else if (livre(x, y + 1)) { tipo = "fininha"; larg = 1; alt = 2; }
        else { tipo = "moita"; larg = 1; alt = 1; }
        for (let a = 0; a < larg; a++) for (let b = 0; b < alt; b++) usada.add(k(x + a, y + b));
        lista.push({ x, y, tipo, larg, alt });
      }
      geo._arvoresFR = lista;
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
        this._tema = tema;
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
    // o ISOMÉTRICO não desenha a árvore 3D: pra ele, o chão com elas pintadas
    if (FR && geo._arvoresFR?.length) {
      const { cv: iso, ctx: ci } = makeCanvas(cv.width, cv.height);
      ci.drawImage(cv, 0, 0);
      for (const a of geo._arvoresFR) { const img = B[a.tipo]; ci.drawImage(img, a.x * 16, (a.y + a.alt) * 16 - img.height); }
      cv.comArvores = iso;
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

  /** A TORRE PRISMA de LUMIOSE (letra T): treliça de ferro afinando pra cima,
   *  as luzes amarelas nas vigas e o prisma no alto. O bloco da planta é a
   *  base; a ponta sobe por cima de quem está atrás. */
  _torrePrisma(ctx, X, Y, W, H) {
    const ret = (x, y, w, h, cor) => { ctx.fillStyle = cor; ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h))); };
    const cx = X + W / 2;
    ret(X + 4, Y + H - 4, W, 4, "rgba(20,25,35,0.25)");                    // a sombra
    ret(X + 2, Y + H - 6, W - 4, 6, "#8f8a80");                             // o pedestal
    ret(X + 2, Y + H - 6, W - 4, 1, "#b0aa9e");
    const alto = H + 40;                                                     // passa do bloco pra cima
    const base = Y + H - 6;
    for (let k = 0; k < alto; k++) {                                         // as duas pernas, afinando
      const t = k / alto;
      const meia = (W / 2 - 2) * (1 - t) ** 1.5 + 3;
      const y = base - k;
      for (let xx = Math.ceil(cx - meia) + 3; xx < cx + meia - 3; xx++) {    // a treliça por dentro
        if ((xx + k) % 4 === 0 || (xx - k) % 4 === 0) ret(xx, y, 1, 1, "rgba(70,84,106,0.85)");
      }
      ret(cx - meia, y, 3, 1, "#6d7c94");
      ret(cx + meia - 3, y, 3, 1, "#3f4b5c");
      if (k % 8 === 0) ret(cx - meia, y, meia * 2, 1, "#6f7d92");           // as vigas de travessa
      if (k % 8 === 4 && meia > 4) {                                         // o X da treliça
        ret(cx - meia / 2, y, 1, 1, "#56637a"); ret(cx + meia / 2, y, 1, 1, "#56637a");
      }
      if (k % 16 === 0 && meia > 6) {                                        // as luzes
        ret(cx - meia + 3, y - 1, 2, 2, "#ffe08a"); ret(cx + meia - 5, y - 1, 2, 2, "#ffe08a");
      }
    }
    ret(cx - 10, base - 22, 20, 3, "#7f8ea6");                               // o primeiro andar (a plataforma)
    ret(cx - 7, base - 50, 14, 2, "#7f8ea6");                                // o segundo
    const topo = base - alto;
    ret(cx - 3, topo - 4, 6, 8, "#9fe8ff");                                  // o PRISMA, brilhando
    ret(cx - 2, topo - 3, 2, 3, "#ffffff");
    ret(cx - 1, topo - 10, 2, 7, "#5d6b80");                                 // a antena
  },

  /** Um prédio de Braglitch, inteiro. `c` é a letra da planta. */
  _predio(ctx, c, X, Y, W, H, portas, cor, r) {
    const sombra = (x, y, w, h) => { ctx.fillStyle = "rgba(0,0,0,0.18)"; ctx.fillRect(x, y, w, h); };
    if (c === "A") return this._arceusRedentor(ctx, X, Y, W, H);
    if (c === "T") return this._torrePrisma(ctx, X, Y, W, H);
    // KALOS: os prédios de Paris — parede creme, telhado de ardósia azul
    const paris = this._tema === "lumiose" && (c === "h" || c === "H");
    if (paris) cor = r.pick(["#efe3c8", "#e9dcc0", "#f3ead6", "#e6d6b6"]);
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
    const telhado = paris ? "#4d5d7a" : c === "C" ? "#d64040" : c === "M" ? "#3a7bd5" : c === "L" ? "#8a9bb0"
      : c === "G" ? "#2f7d4f" : "#b5532e";
    const parede = c === "L" || c === "C" || c === "M" || c === "I" ? "#f4f1ea" : c === "G" ? "#f2d45c" : cor;
    const casario = (c === "H" || c === "h") && !paris;   // as casas: janela com veneziana e chaminé
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
      if (paris) {                                 // a sacadinha de ferro
        ret(xx - 1, wy + 7, 14, 1, "#2b2f36");
        for (let k = 0; k < 14; k += 3) ret(xx - 1 + k, wy + 7, 1, 4, "#2b2f36");
      }
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
