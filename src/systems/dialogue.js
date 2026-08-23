// Caixa de texto estilo GBA: fila de falas, efeito maquina de escrever e menu de escolha.
import { Input } from "../core/input.js";
import { traduz } from "../core/idioma.js";
import { Audio2 } from "../core/audio.js";
import { panel, drawText, wrapText, cursor, PAL, LINE_H } from "../core/gfx.js";

/** trechos que o jogo substitui em qualquer fala: {NOME} = nome do jogador */
let TEXT_VARS = {};
export function setTextVars(v) { TEXT_VARS = { ...TEXT_VARS, ...v }; }
const fill = (t) => String(t).replace(/\{(\w+)\}/g, (m, k) => TEXT_VARS[k] ?? m);

const BOX = { x: 2, y: 110, w: 236, h: 48 };
const COLS = 37;
const SPEED = 42; // chars por segundo

export class Dialogue {
  constructor() {
    this.queue = [];
    this.lines = [];
    this.chars = 0;
    this.done = null;
    this.choice = null;
    this.active = false;
    this.blink = 0;
  }

  say(text, onDone) {
    const arr = Array.isArray(text) ? text : [text];
    this.queue.push(...arr);
    this.done = onDone || this.done;
    if (!this.active) this.next();
    this.active = true;
    return this;
  }

  /** ask("PERGUNTA?", ["SIM","NÃO"], (i) => ...) */
  ask(text, options, cb) {
    this.say(text, () => {
      this.choice = { options: options.map(fill), index: 0, cb, text };
    });
    return this;
  }

  next() {
    const t = this.queue.shift();
    if (t == null) {
      this.active = false;
      this.lines = [];
      const cb = this.done;
      this.done = null;
      cb?.();
      return;
    }
    // traduz a frase inteira antes de quebrar: a quebra tem que contar as
    // letras do texto que vai aparecer, não as do original
    const linhas = wrapText(fill(traduz(t)), COLS);
    this.lines = linhas.slice(0, 3);
    // não cabe na caixa: o resto vira a próxima página em vez de sumir
    const resto = linhas.slice(3).join(" ").trim();
    if (resto) this.queue.unshift(resto);
    this.chars = 0;
  }

  get typing() { return this.chars < this.totalChars; }
  get totalChars() { return this.lines.reduce((s, l) => s + l.length, 0); }

  update(dt) {
    if (!this.active && !this.choice) return false;
    this.blink += dt;

    if (this.choice) {
      const c = this.choice;
      if (Input.consume("up")) { c.index = (c.index + c.options.length - 1) % c.options.length; Audio2.blip(); }
      if (Input.consume("down")) { c.index = (c.index + 1) % c.options.length; Audio2.blip(); }
      if (Input.consume("a")) {
        Audio2.select();
        const { cb, index } = c;
        this.choice = null;
        this.active = this.queue.length > 0;
        cb?.(index);
      }
      return true;
    }

    if (this.typing) {
      const before = this.chars | 0;
      this.chars = Math.min(this.totalChars, this.chars + dt * SPEED * (Input.held("a") || Input.held("b") ? 3 : 1));
      if ((this.chars | 0) > before && (this.chars | 0) % 3 === 0) Audio2.tone(1200, 0.012, "square", 0.25);
    } else if (Input.consume("a")) {
      Audio2.select();
      this.next();
    }
    return true;
  }

  render(ctx) {
    if (!this.active && !this.choice) return;
    panel(ctx, BOX.x, BOX.y, BOX.w, BOX.h);
    let left = this.chars | 0;
    this.lines.forEach((line, i) => {
      const n = Math.max(0, Math.min(line.length, left));
      drawText(ctx, line, BOX.x + 8, BOX.y + 8 + i * LINE_H, PAL.ink, { maxChars: n });
      left -= line.length;
    });
    if (!this.typing && !this.choice && (this.blink % 0.9) < 0.55) {
      ctx.fillStyle = PAL.ink;
      ctx.fillRect(BOX.x + BOX.w - 12, BOX.y + BOX.h - 10, 5, 1);
      ctx.fillRect(BOX.x + BOX.w - 11, BOX.y + BOX.h - 9, 3, 1);
      ctx.fillRect(BOX.x + BOX.w - 10, BOX.y + BOX.h - 8, 1, 1);
    }
    if (this.choice) {
      const c = this.choice;
      const w = 8 + Math.max(...c.options.map((o) => o.length)) * 6 + 14;
      const h = c.options.length * LINE_H + 8;
      const x = 238 - w, y = BOX.y - h - 2;
      panel(ctx, x, y, w, h);
      c.options.forEach((o, i) => {
        drawText(ctx, o, x + 14, y + 4 + i * LINE_H, PAL.ink);
        if (i === c.index) cursor(ctx, x + 6, y + 4 + i * LINE_H);
      });
    }
  }
}
