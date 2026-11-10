// O BONEQUINHO DA FOTO DE VERDADE (pedido do CAIO, 08/nov/2026: "faz a foto
// ter uma ia que te transforma em meio que um bonequinho do jogo" → "boneco
// do mapa e vai dar pra editar").
//
// Não é IA de imagem (isso mandaria a foto dele pra fora): é a webcam lida AQUI.
// O rosto fica no oval da tela; de lá sai a cor da PELE, de cima dele o
// CABELO, de baixo a CAMISA. Com essas cores o boneco do mapa
// (assets/sprites/overworld/hero.png) é repintado tom por tom. Depois dá pra
// trocar a cor de cada parte (src/scenes/camerareal.js).
import { mapArtInteira } from "../core/sprites.js";
import { Assets } from "../core/assets.js";

export const PARTES = [
  { id: "bone", nome: "BONÉ" },
  { id: "cabelo", nome: "CABELO" },
  { id: "pele", nome: "PELE" },
  { id: "camisa", nome: "CAMISA" },
  { id: "calca", nome: "CALÇA" },
  { id: "mochila", nome: "MOCHILA" },
];

// as cores pra escolher ao editar (a 1ª de cada parte é sempre a da foto/original)
export const CORES_EDITAR = [
  "#c53939", "#e8702a", "#f0c020", "#58b038", "#2a8a5a", "#30a0c8", "#3858c8", "#6a3ab0",
  "#d050a0", "#f4f0e8", "#909098", "#383840", "#18181c", "#6a4028", "#a87048", "#ffd0a0",
  "#e8ac7c", "#c88860", "#8a5a3a", "#4a2c1c", "#e8d070", "#f08478",
];

// o boneco original: a cor de referência de cada parte (o tom "do meio")
const ORIGINAL = { bone: "#c53939", cabelo: "#7b4141", pele: "#ffc594", camisa: "#c53939", calca: "#39397b", mochila: "#bd9c39" };

// cada cor do hero.png → de que parte ela é. Os vermelhos são boné na cabeça
// e camisa no corpo (linha < 23 dentro do quadro de 32 = cabeça)
const TOM = {
  "ff6a4a": "vermelho", "c53939": "vermelho", "6a2929": "vermelho",
  "7b4141": "cabelo", "39397b": "escuro", "73a4c5": "calca",
  "ffc594": "pele", "de9473": "pele",
  "bd9c39": "mochila", "ffde5a": "mochila", "ac7b41": "mochila",
};
const parteDoTom = (hex, yNoQuadro) => {
  const p = TOM[hex];
  if (!p) return null;
  const cabeca = yNoQuadro < 23;
  if (p === "vermelho") return cabeca ? "bone" : "camisa";
  if (p === "escuro") return cabeca ? "cabelo" : "calca";
  if (p === "cabelo") return cabeca ? "cabelo" : null;   // no corpo é sombra do braço: fica
  return p;
};

const rgb = (hex) => { const n = parseInt(String(hex).replace("#", ""), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const hexDe = (r, g, b) => "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
const luz = ([r, g, b]) => 0.3 * r + 0.59 * g + 0.11 * b + 1;

/** o tom novo: a cor escolhida, mais clara/escura na mesma medida que o tom original era da referência */
function tomNovo(original, ref, base) {
  const k = luz(original) / luz(ref), b = rgb(base);
  if (k <= 1) return b.map((v) => v * (0.25 + 0.75 * k));
  const claro = Math.min(1, (k - 1) * 0.8);
  return b.map((v) => v + (255 - v) * claro);
}

let FOLHA = null;
function folhaOriginal() {
  if (!FOLHA) { FOLHA = new Image(); FOLHA.src = "assets/sprites/overworld/hero.png"; }
  return FOLHA.complete && FOLHA.naturalWidth ? FOLHA : null;
}

const CACHE = new Map();
/** a folha inteira do boneco (4 colunas x 3 linhas de 16x32) repintada com `cores` */
export function folhaDoBoneco(cores) {
  const chave = JSON.stringify(cores);
  if (CACHE.has(chave)) return CACHE.get(chave);
  const img = folhaOriginal();
  if (!img) return null;
  const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
  const g = c.getContext("2d", { willReadFrequently: true });
  g.drawImage(img, 0, 0);
  const dados = g.getImageData(0, 0, c.width, c.height), d = dados.data;
  for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) {
    const i = (y * c.width + x) * 4;
    if (!d[i + 3]) continue;
    const hex = hexDe(d[i], d[i + 1], d[i + 2]).slice(1);
    const parte = parteDoTom(hex, y % 32);
    if (!parte || !cores[parte]) continue;
    const [r, gg, b] = tomNovo([d[i], d[i + 1], d[i + 2]], rgb(ORIGINAL[parte]), cores[parte]);
    d[i] = r; d[i + 1] = gg; d[i + 2] = b;
  }
  g.putImageData(dados, 0, 0);
  if (CACHE.size > 60) CACHE.clear();
  CACHE.set(chave, c);
  return c;
}

/** o OVAL onde fica o rosto (em fração da foto): a tela ao vivo desenha, a leitura usa */
export const OVAL = { cx: 0.5, cy: 0.42, rx: 0.13, ry: 0.27 };

/** a cor que MAIS aparece numa área (por faixas de cor), e a média dessa faixa */
function corDaArea(d, w, h, dentro) {
  const potes = new Map();
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (!dentro(x / w, y / h)) continue;
    const i = (y * w + x) * 4, r = d[i], g = d[i + 1], b = d[i + 2];
    const k = ((r >> 5) << 6) | ((g >> 5) << 3) | (b >> 5);
    const p = potes.get(k) || [0, 0, 0, 0];
    p[0] += r; p[1] += g; p[2] += b; p[3]++;
    potes.set(k, p);
  }
  let melhor = null;
  for (const p of potes.values()) if (!melhor || p[3] > melhor[3]) melhor = p;
  return melhor ? hexDe(melhor[0] / melhor[3], melhor[1] / melhor[3], melhor[2] / melhor[3]) : null;
}

/** LÊ AS CORES da foto (`c` = o recorte da webcam, sem filtro): pele, cabelo, camisa */
export function lerCores(c) {
  const g = c.getContext("2d", { willReadFrequently: true });
  const { width: w, height: h } = c, d = g.getImageData(0, 0, w, h).data;
  const { cx, cy, rx, ry } = OVAL;
  const pele = corDaArea(d, w, h, (x, y) => ((x - cx) / (rx * 0.55)) ** 2 + ((y - cy - ry * 0.1) / (ry * 0.45)) ** 2 < 1);
  const cabelo = corDaArea(d, w, h, (x, y) => Math.abs(x - cx) < rx * 0.7 && y > cy - ry * 1.15 && y < cy - ry * 0.75);
  const camisa = corDaArea(d, w, h, (x, y) => Math.abs(x - cx) < rx * 1.4 && y > cy + ry * 1.3);
  return { bone: camisa || ORIGINAL.bone, cabelo: cabelo || ORIGINAL.cabelo, pele: pele || ORIGINAL.pele,
    camisa: camisa || ORIGINAL.camisa, calca: ORIGINAL.calca, mochila: ORIGINAL.mochila };
}

/** o lugar: o desenho do mapa em volta de onde você estava (igual ao álbum) */
export function fundoDoLugar(ctx, f, x, y, w, h) {
  const arte = f.mapa && mapArtInteira(f.mapa);
  ctx.fillStyle = "#88b8e8"; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "#6aa84a"; ctx.fillRect(x, y + h * 0.6, w, h * 0.4);
  if (arte) {
    const px = (f.x || 0) * 16 + 8, py = (f.y || 0) * 16 + 8, sw = w / 2, sh = h / 2;
    const sx = Math.max(0, Math.min(arte.width - sw, px - sw / 2)), sy = Math.max(0, Math.min(arte.height - sh, py - sh * 0.6));
    ctx.drawImage(arte, sx, sy, Math.min(sw, arte.width), Math.min(sh, arte.height), x, y, w, h);
  }
  ctx.fillStyle = "rgba(255,255,255,0.18)"; ctx.fillRect(x, y, w, h);
}

/** A FOTO DO BONEQUINHO: o lugar, você-boneco grande (4x) e o Pokémon do lado.
 *  `passo` = o quadro do andar (0 parado; a tela de editar anda no lugar) */
export function desenharFotoBoneco(ctx, f, x, y, w, h, passo = 0) {
  fundoDoLugar(ctx, f, x, y, w, h);
  const folha = folhaDoBoneco(f.boneco || {});
  if (folha) {
    const E = 4, col = passo % 4;
    // o quadro é 16x32 com o boneco nas linhas 12 a 31: os pés na beirada da foto
    ctx.drawImage(folha, col * 16, 12, 16, 20, x + 30, y + h - 20 * E, 16 * E, 20 * E);
  }
  if (f.mon) { const L = 72; Assets.desenhaVivo(ctx, { species: f.mon }, x + w - L - 4, y + h - L, L); }
}
