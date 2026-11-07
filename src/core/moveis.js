// O DESENHO DE CADA MÓVEL DAS BASES SECRETAS (src/data/bases.js): os de grade
// (cama, mesa, TV...), os tapetes e a piscininha (feitos na hora, no tamanho
// deles), e os BONECOS e PÔSTERES, que são o desenho do próprio Pokémon —
// pequeno, de pelúcia, ou num quadro na parede. Fica guardado; o do Pokémon
// só depois que o desenho dele carregou.
import { DB } from "../data/index.js";
import { Assets, spriteFromRows, makeCanvas } from "./assets.js";
import { SpriteStore } from "./sprites.js";
import { reduzido } from "./reduzir.js";
import { loadImage } from "./sprites.js";
import { url } from "./base.js";

// os DESENHADOS À MÃO (`desenho` no móvel): o arquivo, quando chega
const aMao = new Map();

const prontos = new Map();
const T = 16;

/** o canvas do móvel, no tamanho dele (w*16 x h*16), ou null se não deu ainda */
export function desenhoDoMovel(item) {
  if (prontos.has(item)) return prontos.get(item);
  const mv = DB.MOVEIS?.[item];
  if (!mv) return null;
  // o DESENHADO À MÃO ganha: enquanto carrega (ou se não existe), o automático
  if (mv.desenho) {
    if (!aMao.has(mv.desenho)) {
      aMao.set(mv.desenho, null);
      loadImage(url(mv.desenho)).then((img) => { aMao.set(mv.desenho, img || false); if (img) prontos.delete(item); });
    }
    const img = aMao.get(mv.desenho);
    if (img) { prontos.set(item, img); return img; }
  }
  const w = (mv.w || 1) * T, h = (mv.h || 1) * T;
  let cv = null;
  if (mv.rows) cv = spriteFromRows(mv.rows, mv.pal);
  else if (mv.tapete) {
    const c = makeCanvas(w, h);
    const [fundo, borda] = mv.tapete;
    c.ctx.fillStyle = "#2a2228"; c.ctx.fillRect(1, 1, w - 2, h - 2);
    c.ctx.fillStyle = borda; c.ctx.fillRect(2, 2, w - 4, h - 4);
    c.ctx.fillStyle = fundo; c.ctx.fillRect(4, 4, w - 8, h - 8);
    c.ctx.fillStyle = borda;
    for (let x = 8; x < w - 8; x += 6) c.ctx.fillRect(x, h / 2 - 1, 2, 2);
    cv = c.cv;
  } else if (mv.xadrez) {
    const c = makeCanvas(w, h);
    for (let y = 0; y < h; y += 4) for (let x = 0; x < w; x += 4) {
      c.ctx.fillStyle = mv.xadrez[((x + y) / 4) % 2]; c.ctx.fillRect(x, y, 4, 4);
    }
    cv = c.cv;
  } else if (mv.piscina) {
    const c = makeCanvas(w, h), g = c.ctx;
    g.fillStyle = "#2a2228"; g.beginPath(); g.ellipse(w / 2, h / 2, w / 2 - 1, h / 2 - 2, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#f8f8f8"; g.beginPath(); g.ellipse(w / 2, h / 2, w / 2 - 2, h / 2 - 3, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#4aa8f0"; g.beginPath(); g.ellipse(w / 2, h / 2, w / 2 - 5, h / 2 - 6, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#a8e0ff"; g.fillRect(w / 2 - 6, h / 2 - 4, 4, 1); g.fillRect(w / 2 + 2, h / 2 + 2, 5, 1);
    cv = c.cv;
  } else if (mv.mon) {
    // BONECO e PÔSTER: o desenho do Pokémon (pedido agora, chega depois)
    const img = Assets.mon(mv.mon, 1);
    if (!SpriteStore.pokemon[mv.mon] && !DB.SPECIES[mv.mon]?.spriteUrl) return null;
    const c = makeCanvas(w, h), g = c.ctx;
    if (mv.tipo === "robo") {
      // O ROBÔ FROAKIE de reserva: o FROAKIE em cinza-metal, com antena e olho vermelho
      const p = reduzido(img, w), m = makeCanvas(w, h);
      m.ctx.filter = "grayscale(1) brightness(1.15) contrast(1.2)";
      m.ctx.drawImage(p, 0, 0, w, h);
      m.ctx.filter = "none";
      m.ctx.globalCompositeOperation = "source-atop";
      m.ctx.fillStyle = "rgba(90,140,200,0.35)"; m.ctx.fillRect(0, 0, w, h);
      m.ctx.globalCompositeOperation = "source-over";
      g.drawImage(m.cv, 0, 2, w, h - 2);
      g.fillStyle = "#2a2228"; g.fillRect(w / 2, 0, 1, 4);
      g.fillStyle = "#ff3a3a"; g.fillRect(w / 2 - 1, 0, 2, 1); g.fillRect(w / 2 + 2, 7, 2, 2);
    } else if (mv.tipo === "estatua") {
      // A ESTÁTUA do SUBTERRÂNEO: o Pokémon em pedra cinza, num pedestal
      g.fillStyle = "rgba(0,0,0,0.25)"; g.beginPath(); g.ellipse(w / 2, h - 2, w / 2 - 2, 2, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#6e6e76"; g.fillRect(2, h - 5, w - 4, 4);
      g.fillStyle = "#a8a8b0"; g.fillRect(2, h - 5, w - 4, 1);
      g.filter = "grayscale(1) brightness(1.1) contrast(1.15)";
      g.drawImage(reduzido(img, w - 2), 1, -1, w - 2, h - 4);
      g.filter = "none";
    } else if (mv.tipo === "poster") {
      g.fillStyle = "#2a2228"; g.fillRect(1, 0, w - 2, h - 1);
      g.fillStyle = "#f8f4e8"; g.fillRect(2, 1, w - 4, h - 3);
      g.drawImage(reduzido(img, w - 4), 2, 1, w - 4, h - 4);
    } else {
      // de pelúcia: um pouco maior que o bloco, com a sombrinha no chão
      g.fillStyle = "rgba(0,0,0,0.25)"; g.beginPath(); g.ellipse(w / 2, h - 2, w / 2 - 2, 2, 0, 0, Math.PI * 2); g.fill();
      g.drawImage(reduzido(img, w), 0, 0, w, h);
    }
    cv = c.cv;
  }
  if (cv) prontos.set(item, cv);
  return cv;
}

/** o PC DA BASE */
let pc = null;
export const desenhoDoPC = () => (pc ||= spriteFromRows(DB.DESENHO_PC.rows, DB.DESENHO_PC.pal));
