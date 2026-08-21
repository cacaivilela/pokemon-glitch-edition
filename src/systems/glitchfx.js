// Pos-processamento: copia o buffer 240x160 pra tela aplicando corrupcao.
import { makeRng } from "../core/rng.js";
import { DB } from "../data/index.js";

export const Glitch = {
  level: 0,        // 0..100 (corrupcao do save)
  burst: 0,        // pico temporario (segundos)
  scanlines: false,
  forced: false,   // ligado pela história (011glitchdimension110)
  t: 0,

  get enabled() { return !!(DB.CONFIG?.glitchMode || this.forced); },

  hit(amount = 1) {
    if (!this.enabled) return;
    this.burst = Math.min(2.5, this.burst + amount);
  },

  update(dt) {
    this.t += dt;
    this.burst = Math.max(0, this.burst - dt);
  },

  get intensity() {
    if (!this.enabled) return 0;
    const base = Math.max(0, this.level - 20) / 80;
    return Math.min(1, base + this.burst * 0.6);
  },

  render(dst, src) {
    const w = src.width, h = src.height;
    const k = this.intensity;
    dst.imageSmoothingEnabled = false;
    dst.clearRect(0, 0, w, h);

    if (k <= 0.02) {
      dst.drawImage(src, 0, 0);
      this.overlay(dst, w, h, 0);
      return;
    }

    const r = makeRng(((this.t * 12) | 0) * 7919 + 13);

    // aberracao cromatica
    if (k > 0.25) {
      const off = Math.round(k * 3 * (r.chance(0.5) ? 1 : -1));
      dst.globalCompositeOperation = "lighter";
      dst.globalAlpha = 0.5;
      dst.drawImage(src, off, 0);
      dst.drawImage(src, -off, 0);
      dst.globalAlpha = 1;
      dst.globalCompositeOperation = "source-over";
    }

    dst.drawImage(src, 0, 0);

    // fatias deslocadas
    const slices = Math.round(k * 9);
    for (let i = 0; i < slices; i++) {
      const y = r.int(h);
      const sh = 1 + r.int(Math.max(2, Math.round(k * 14)));
      const dx = Math.round((r() * 2 - 1) * k * 22);
      dst.drawImage(src, 0, y, w, sh, dx, y, w, sh);
    }

    // blocos corrompidos
    if (k > 0.5) {
      const blocks = Math.round((k - 0.5) * 14);
      for (let i = 0; i < blocks; i++) {
        const bw = 4 + r.int(24), bh = 3 + r.int(10);
        const sx = r.int(w - bw), sy = r.int(h - bh);
        dst.drawImage(src, sx, sy, bw, bh, r.int(w - bw), r.int(h - bh), bw, bh);
        if (r.chance(0.25)) {
          dst.fillStyle = r.pick(["#b455ff", "#00ffcc", "#ff0066"]);
          dst.globalAlpha = 0.35;
          dst.fillRect(r.int(w - bw), r.int(h - bh), bw, bh);
          dst.globalAlpha = 1;
        }
      }
    }
    this.overlay(dst, w, h, k);
  },

  overlay(dst, w, h, k) {
    if (this.scanlines && this.enabled) {
      dst.fillStyle = "rgba(0,0,0,.10)";
      for (let y = 0; y < h; y += 2) dst.fillRect(0, y, w, 1);
    }
    if (k > 0.15) {
      dst.fillStyle = `rgba(180,85,255,${0.05 * k})`;
      dst.fillRect(0, 0, w, h);
    }
  },
};
