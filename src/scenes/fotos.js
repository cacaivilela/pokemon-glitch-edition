// O ÁLBUM DA CÂMERA (menu START → CÂMERA, src/systems/fotos.js): uma foto por
// vez, grande, num porta-retrato; ◀ ▶ passa, B volta. A foto é montada na
// hora: o lugar onde vocês estavam (o desenho do mapa em volta) e os dois
// retratos de batalha lado a lado, com o clarão do flash no canto.
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { drawText } from "../core/font.js";
import { mapArtInteira, trainerArt } from "../core/sprites.js";
import { Assets } from "../core/assets.js";
import { fotos, FOTO_TEXTO as T } from "../systems/fotos.js";
import { DB } from "../data/index.js";
import { desenharMonNaFoto } from "./camerareal.js";
import { desenharFotoBoneco } from "../systems/boneco.js";
import { criarCamada, prepararCamada, esconderCamada } from "../core/camada.js";

// as FOTOS DE VERDADE (webcam pixelada) guardam a imagem: carrega uma vez só
const IMGS = new Map();
function imagemDa(f, src = f.img) {
  if (!IMGS.has(src)) { const i = new Image(); i.src = src; IMGS.set(src, i); }
  const i = IMGS.get(src);
  return i.complete && i.naturalWidth ? i : null;
}

const W = 240, H = 160;
const FOTO = { x: 34, y: 14, w: 172, h: 112 };   // a imagem dentro do porta-retrato

export class FotosScene {
  enter(args = {}) {
    this.lista = fotos(this.game.state);
    this.i = Math.max(0, Math.min(this.lista.length - 1, args.inicio ?? this.lista.length - 1));   // abre na mais nova
    this.t = 0;
  }

  exit() { this.camada?.remove(); this.camada = null; }

  update(dt) {
    this.t += dt;
    const n = this.lista.length;
    if (Input.consume("b") || (!n && Input.consume("a"))) { Audio2.cancel?.(); return void this.game.scenes.pop(); }
    if (!n) return;
    if (Input.consume("left")) { this.i = (this.i + n - 1) % n; this.t = 0; Audio2.blip(); }
    if (Input.consume("right")) { this.i = (this.i + 1) % n; this.t = 0; Audio2.blip(); }
  }

  /** o lugar: o desenho do mapa em volta de onde vocês estavam */
  fundo(ctx, f) {
    const { x, y, w, h } = FOTO;
    const arte = f.mapa && mapArtInteira(f.mapa);
    ctx.fillStyle = "#88b8e8"; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#6aa84a"; ctx.fillRect(x, y + h * 0.6, w, h * 0.4);
    if (arte) {
      const px = (f.x || 0) * 16 + 8, py = (f.y || 0) * 16 + 8;
      const sw = w / 2, sh = h / 2;                       // aproximado 2x
      const sx = Math.max(0, Math.min(arte.width - sw, px - sw / 2)), sy = Math.max(0, Math.min(arte.height - sh, py - sh * 0.6));
      ctx.drawImage(arte, sx, sy, Math.min(sw, arte.width), Math.min(sh, arte.height), x, y, w, h);
    }
    // um véu claro: os dois na frente aparecem melhor
    ctx.fillStyle = "rgba(255,255,255,0.18)"; ctx.fillRect(x, y, w, h);
  }

  /** A FOTO DO CAMPEÃO: você no lugar do campeão, de frente, e o AZUL de
   *  costas lá atrás, pequeno, andando embora, com os Pokémon dele em fila */
  fotoCampeao(ctx, f) {
    const { x, y, w, h } = FOTO, ms = performance.now();
    // ele: o boneco do mapa de costas, andando (os quadros de "up")
    const ator = Assets.actor(f.retrato || "rival", false)?.up;
    const q = ator?.[Math.floor(ms / 180) % ator.length];
    const rx = x + w * 0.66, ry = y + h * 0.34;
    if (q) ctx.drawImage(q, Math.round(rx - q.width), Math.round(ry - q.height * 2), q.width * 2, q.height * 2);
    // os Pokémon dele atrás, em fila, também de costas (cada um um pouco mais perto)
    const especie = (id) => {
      const s = String(id);
      if (DB.SPECIES[s]) return s;
      const parte = s.replace(/^FUSAO:/, "").split(/[+~]/)[0];
      return DB.SPECIES[parte] ? parte : null;
    };
    (f.time || []).map(especie).filter(Boolean).slice(0, 6).forEach((sp, i) => {
      const L = 22 + i * 3, px = rx - 26 - i * 16, py = ry + 4 + i * 7 + Math.abs(Math.sin(ms / 160 + i)) * -1;
      Assets.desenhaVivo(ctx, { species: sp }, Math.round(px - L / 2), Math.round(py - L), L, true);
    });
    // você, grande, no lugar do campeão, de frente
    const eu = trainerArt(f.eu), lado = 84;
    if (eu) ctx.drawImage(eu, Math.round(x + w * 0.32 - lado / 2), y + h - lado - 2, lado, lado);
    const a = Math.max(0, 1 - this.t * 3);
    if (a > 0) { ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fillRect(x, y, w, h); }
    const leg = "VOCÊ, O NOVO CAMPEÃO!";
    drawText(ctx, leg, x + (w - leg.length * 6) / 2, y + h + 4, "#303040");
    const d = new Date(f.data || 0), quando = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
    const sub = `${(f.lugar || "").slice(0, 22)} ${quando}`.trim();
    drawText(ctx, sub, x + (w - sub.length * 6) / 2, y + h + 14, "#806878");
    drawText(ctx, "← → PASSAR   B: VOLTAR", 6, H - 10, "#c8c8d8");
  }

  /** FOTO DE VERDADE: você pela webcam, em pixel art, com o Pokémon escolhido */
  fotoDeVerdade(ctx, f) {
    const { x, y, w, h } = FOTO;
    if (f.foto) {
      // a FOTO NORMAL da webcam: na camada nítida por cima do jogo (src/core/camada.js)
      ctx.fillStyle = "#16202c"; ctx.fillRect(x, y, w, h);
      this.camada ||= criarCamada();
      const g = prepararCamada(this.camada), img = imagemDa(f, f.foto);
      if (g && img) {
        g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
        g.drawImage(img, x, y, w, h);
        const a = Math.max(0, 1 - this.t * 3);
        if (a > 0) { g.fillStyle = `rgba(255,255,255,${a})`; g.fillRect(x, y, w, h); }
      }
    } else if (f.boneco) desenharFotoBoneco(ctx, f, x, y, w, h);
    else {
      const img = imagemDa(f);
      ctx.fillStyle = "#16202c"; ctx.fillRect(x, y, w, h);
      if (img) ctx.drawImage(img, x, y, w, h);
      if (f.mon) desenharMonNaFoto(ctx, { species: f.mon }, x, y, w, h);
    }
    const a = Math.max(0, 1 - this.t * 3);
    if (a > 0) { ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fillRect(x, y, w, h); }
    const d = new Date(f.data || 0), quando = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
    const leg = (f.nome ? `VOCÊ E ${f.nome}` : "VOCÊ").slice(0, 28);
    drawText(ctx, leg, x + (w - leg.length * 6) / 2, y + h + 4, "#303040");
    const sub = `${(f.lugar || "").slice(0, 22)} ${quando}`.trim();
    drawText(ctx, sub, x + (w - sub.length * 6) / 2, y + h + 14, "#806878");
    drawText(ctx, "← → PASSAR   B: VOLTAR", 6, H - 10, "#c8c8d8");
  }

  render(ctx) {
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#2a2230"; ctx.fillRect(0, 0, W, H);
    for (let y = 0; y < H; y += 8) { ctx.fillStyle = (y / 8) % 2 ? "#30283a" : "#2a2230"; ctx.fillRect(0, y, W, 8); }
    drawText(ctx, T.titulo, 6, 4, "#ffd860");
    const n = this.lista.length;
    if (!n) {
      T.vazio.forEach((l, k) => drawText(ctx, l, (W - l.length * 6) / 2, 60 + k * 12, "#ffffff"));
      return;
    }
    const f = this.lista[this.i];
    drawText(ctx, `${this.i + 1}/${n}`, W - 6 - `${this.i + 1}/${n}`.length * 6, 4, "#c8c8d8");
    // o porta-retrato (branco, como foto revelada) com sombra
    const { x, y, w, h } = FOTO;
    ctx.fillStyle = "rgba(0,0,0,0.4)"; ctx.fillRect(x - 4, y - 2, w + 12, h + 30);
    ctx.fillStyle = "#f4f0e8"; ctx.fillRect(x - 6, y - 6, w + 12, h + 30);
    if (!f.foto) esconderCamada(this.camada);
    if (f.img || f.boneco || f.foto) return this.fotoDeVerdade(ctx, f);
    this.fundo(ctx, f);
    // os dois: você na esquerda, ele na direita, um pouquinho por cima
    if (f.tipo === "campeao") return this.fotoCampeao(ctx, f);
    const eu = trainerArt(f.eu), ele = f.retrato ? trainerArt(f.retrato) : null;
    const lado = 76, base = y + h - 2;
    if (ele) ctx.drawImage(ele, x + w - lado - 14, base - lado, lado, lado);
    else if (f.ator) {
      // gente sem retrato de batalha: o boneco do mapa, grandão
      const q = Assets.actor(f.ator, false)?.down?.[0];
      if (q) { const e = Math.min(4, Math.floor(lado / q.height) || 1); ctx.drawImage(q, x + w - 14 - lado / 2 - (q.width * e) / 2, base - q.height * e, q.width * e, q.height * e); }
    } else if (f.mon) {
      // só o Pokémon (lendário, shiny, evolução, ovo, selfie com quem te segue): grande, do lado
      Assets.desenhaVivo(ctx, { species: f.mon }, x + w - 14 - 64, base - 64, 64);
    }
    if (eu) {
      // o seu retrato de batalha olha pra direita? espelha pra olhar pro meio
      ctx.save(); ctx.translate(x + 14 + lado, base - lado); ctx.scale(-1, 1);
      ctx.drawImage(eu, 0, 0, lado, lado); ctx.restore();
    }
    // um Pokémon junto (o RATICATE do AZUL no reencontro)
    if (f.mon && (ele || f.ator)) Assets.desenhaVivo(ctx, { species: f.mon }, x + w / 2 - 16, base - 34, 32);
    // o flash: um brilho que some quando a foto aparece
    const a = Math.max(0, 1 - this.t * 3);
    if (a > 0) { ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fillRect(x, y, w, h); }
    // a legenda escrita embaixo
    const d = new Date(f.data || 0);
    const quando = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
    const leg = (f.nome ? `VOCÊ E ${f.nome}` : "VOCÊ").slice(0, 28);
    drawText(ctx, leg, x + (w - leg.length * 6) / 2, y + h + 4, "#303040");
    const sub = `${(f.lugar || "").slice(0, 22)} ${quando}`.trim();
    drawText(ctx, sub, x + (w - sub.length * 6) / 2, y + h + 14, "#806878");
    drawText(ctx, "← → PASSAR   B: VOLTAR", 6, H - 10, "#c8c8d8");
  }
}
