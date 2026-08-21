// Tela de título. Limpa por padrão; o visual corrompido só aparece se
// CONFIG.glitchMode estiver ligado em src/data/config.js.
import { DB } from "../data/index.js";
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { Save } from "../core/save.js";
import { Assets, nullmonSprite } from "../core/assets.js";
import { drawText, panel, cursor, PAL, LINE_H } from "../core/gfx.js";
import { Glitch } from "../systems/glitchfx.js";
import { OverworldScene } from "./overworld.js";
import { GiftScene } from "./online.js";

export class TitleScene {
  enter() {
    this.t = 0;
    this.index = 0;
    this.hasSave = Save.exists();
    // O PRESENTE MISTERIOSO fica aqui, como nos jogos de verdade. Só aparece
    // com uma partida gravada: o presente precisa de um save pra entrar.
    this.items = this.hasSave ? ["CONTINUAR", "NOVO JOGO", DB.GIFT_TEXTO.titulo] : ["NOVO JOGO"];
    Glitch.level = DB.CONFIG?.glitchMode ? 45 : 0;
    Audio2.playMusic("titulo", DB.MUSIC?.titulo);
  }
  exit() { Audio2.stopLoop(); }

  update(dt) {
    this.t += dt;
    if (DB.CONFIG?.glitchMode && Math.random() < dt * 1.4) Glitch.hit(0.35);
    if (Input.consume("up")) { this.index = (this.index + this.items.length - 1) % this.items.length; Audio2.blip(); }
    if (Input.consume("down")) { this.index = (this.index + 1) % this.items.length; Audio2.blip(); }
    if (Input.consume("a")) {
      Audio2.unlock();
      Audio2.select();
      if (this.items[this.index] === DB.GIFT_TEXTO.titulo) {
        this.game.loadGame();                 // o cartão entra na partida gravada
        return void this.game.scenes.push(new GiftScene());
      }
      if (this.items[this.index] === "CONTINUAR") this.game.loadGame();
      else this.game.newGame();
      Glitch.level = this.game.state.corruption;
      this.game.scenes.replace(new OverworldScene());
    }
  }

  render(ctx) {
    const glitch = !!DB.CONFIG?.glitchMode;
    const g = ctx.createLinearGradient(0, 0, 0, 160);
    if (glitch) { g.addColorStop(0, "#140a24"); g.addColorStop(0.6, "#2a1040"); g.addColorStop(1, "#0a0612"); }
    else { g.addColorStop(0, "#2f7fd0"); g.addColorStop(0.55, "#8fd0f0"); g.addColorStop(1, "#e8f4c8"); }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 240, 160);

    // nuvens / partículas
    for (let i = 0; i < 26; i++) {
      const x = (i * 47 + this.t * (glitch ? 12 : 6)) % 260 - 10;
      const y = 12 + ((i * 29) % 60);
      ctx.fillStyle = glitch ? (i % 5 === 0 ? "#b455ff" : "#3a2a55") : "rgba(255,255,255,.5)";
      ctx.fillRect(x | 0, y | 0, glitch ? 1 : 6, glitch ? 1 : 2);
    }

    const wob = Math.sin(this.t * 2) * 1.5;
    drawText(ctx, "POKÉMON", 74, 20 + wob, "#ffd166", { shadow: "#7a4a10" });
    drawText(ctx, "GLITCH EDITION", 60, 36 + wob, glitch ? "#f4f4ff" : "#2b4a7a", { shadow: glitch ? "#5b32b0" : "#dff0ff" });
    ctx.fillStyle = glitch ? "#b455ff" : "#2b4a7a";
    ctx.fillRect(52, 48, 136, 1);

    // trio inicial (sprites reais quando existirem)
    const trio = DB.STARTERS || [];
    trio.forEach((id, i) => {
      const bob = Math.sin(this.t * 2.2 + i * 1.4) * 2;
      ctx.drawImage(Assets.mon(id, 1), 24 + i * 68, 58 + bob, 56, 56);
    });
    if (glitch) ctx.drawImage(nullmonSprite(((this.t * 6) | 0) * 31 + 5), 96, 60, 48, 48);

    const w = 96, x = 120 - w / 2, y = 114;
    panel(ctx, x, y, w, this.items.length * LINE_H + 8);
    this.items.forEach((it, i) => {
      drawText(ctx, it, x + 16, y + 4 + i * LINE_H, PAL.ink);
      if (i === this.index) cursor(ctx, x + 7, y + 4 + i * LINE_H);
    });

    drawText(ctx, "FANGAME NÃO OFICIAL - V0.3", 34, 150, glitch ? "#6b5a8a" : "#4a6a8a");
  }
}
