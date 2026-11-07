// A TELA DAS ROUPAS (menu START → ROUPAS, src/data/roupas.js). À esquerda o
// boneco vestido, girando; à direita a lista do que você tem. A veste ou tira;
// B sai.
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { Assets } from "../core/assets.js";
import { panel } from "../core/gfx.js";
import { drawText } from "../core/font.js";
import { ROUPAS_TEXTO as T } from "../data/roupas.js";
import { roupasDoJogador, vestidas, trocarRoupa, vestirQuadro } from "../systems/roupas.js";

const W = 240, H = 160, POR_TELA = 9;

export class RoupasScene {
  enter() {
    this.i = 0; this.top = 0; this.t = 0;
    this.lista = roupasDoJogador(this.game.state);
  }

  update(dt) {
    this.t += dt;
    const n = this.lista.length;
    if (Input.consume("b")) { Audio2.cancel?.(); this.game.autosave?.(); return void this.game.scenes.pop(); }
    if (!n) { if (Input.consume("a")) this.game.scenes.pop(); return; }
    if (Input.consume("up")) { this.i = (this.i + n - 1) % n; Audio2.blip(); }
    if (Input.consume("down")) { this.i = (this.i + 1) % n; Audio2.blip(); }
    if (this.i < this.top) this.top = this.i;
    if (this.i >= this.top + POR_TELA) this.top = this.i - POR_TELA + 1;
    if (Input.consume("a")) { trocarRoupa(this.game.state, this.lista[this.i].id); Audio2.select(); }
  }

  render(ctx) {
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#2a3a5a"; ctx.fillRect(0, 0, W, H);
    for (let y = 0; y < H; y += 8) { ctx.fillStyle = (y / 8) % 2 ? "#2e4064" : "#283656"; ctx.fillRect(0, y, W, 8); }
    drawText(ctx, T.titulo, 8, 6, "#ffd860");
    // o boneco: girando pelas quatro direções
    const st = this.game.state, folha = Assets.jogador?.() || "hero";
    const sets = Assets.actor("hero");
    const dirs = ["down", "left", "up", "right"], dir = dirs[Math.floor(this.t / 1.2) % 4];
    const quadro = sets?.[dir]?.[0];
    panel(ctx, 6, 20, 76, 120);
    if (quadro) {
      const img = vestirQuadro(quadro, st, dir, folha);
      ctx.drawImage(img, 44 - img.width * 1.5, 40, img.width * 3, img.height * 3);
    }
    // a lista
    panel(ctx, 86, 20, 148, 134);
    if (!this.lista.length) {
      const linhas = T.nenhuma.match(/.{1,22}(\s|$)/g) || [T.nenhuma];
      linhas.forEach((l, k) => drawText(ctx, l.trim(), 92, 28 + k * 10, "#202020"));
      return;
    }
    const v = vestidas(st);
    for (let k = 0; k < POR_TELA && this.top + k < this.lista.length; k++) {
      const r = this.lista[this.top + k], y = 26 + k * 14, sel = this.top + k === this.i;
      if (sel) { ctx.fillStyle = "#ffe9a0"; ctx.fillRect(89, y - 2, 142, 13); }
      const usando = v[r.parte] === r.id;
      drawText(ctx, (usando ? "* " : "  ") + r.nome.slice(0, 21), 92, y, "#202020");
    }
    const r = this.lista[this.i];
    drawText(ctx, T.partes[r.parte] || "", 10, 128, "#ffffff");
    drawText(ctx, "A: VESTIR/TIRAR  B: SAIR", 8, 148, "#c8d8ff");
  }
}
