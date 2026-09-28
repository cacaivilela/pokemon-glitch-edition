// Caixa de texto estilo GBA: fila de falas, efeito maquina de escrever e menu de escolha.
import { Input } from "../core/input.js";
import { traduz } from "../core/idioma.js";
import { Audio2 } from "../core/audio.js";
import { panel, drawText, wrapText, cursor, PAL, LINE_H } from "../core/gfx.js";
import { Opcoes } from "../core/opcoes.js";

/** trechos que o jogo substitui em qualquer fala: {NOME} = nome do jogador */
let TEXT_VARS = {};
export function setTextVars(v) { TEXT_VARS = { ...TEXT_VARS, ...v }; }
const fill = (t) => String(t).replace(/\{(\w+)\}/g, (m, k) => TEXT_VARS[k] ?? m);

const BOX = { x: 2, y: 110, w: 236, h: 48 };
const COLS = 37;
const COLS_BALAO = 26;     // o balão é mais estreito: ele fica em cima de alguém

// AS CONFIGURAÇÕES DA FALA (OPÇÕES → FALA; moram em src/core/opcoes.js).
// A velocidade é em letras por segundo; NA HORA mostra a página inteira.
export const FALA_VELOCIDADES = [
  { nome: "LENTA", cps: 20 },
  { nome: "NORMAL", cps: 42 },
  { nome: "RÁPIDA", cps: 90 },
  { nome: "NA HORA", cps: Infinity },
];
const velocidade = () => (FALA_VELOCIDADES[Opcoes.get("falaVel")] || FALA_VELOCIDADES[1]).cps;
const emBalao = () => Opcoes.get("falaEstilo") === "balao";

export class Dialogue {
  constructor() {
    this.queue = [];
    this.lines = [];
    this.chars = 0;
    this.done = null;
    this.choice = null;
    this.active = false;
    this.blink = 0;
    // QUEM FALA: uma função que diz onde está a cabeça dele na tela ({ x, y })
    // — é daí que o BALÃO sai. A cena põe ao puxar conversa; sem ninguém
    // (placa, aviso, batalha) a fala vai na caixa de baixo mesmo no balão.
    this.falante = null;
    this.parado = 0;           // quanto tempo a página está inteira na tela (o AVANÇO sozinho)
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
      // a conversa acabou de vez (o fim dela não puxou outra fala): quem
      // falava sai de cena, senão o próximo aviso sairia da boca dele
      if (!this.active && !this.choice) this.falante = null;
      return;
    }
    // traduz a frase inteira antes de quebrar: a quebra tem que contar as
    // letras do texto que vai aparecer, não as do original
    const linhas = wrapText(fill(traduz(t)), this.balao ? COLS_BALAO : COLS);
    this.lines = linhas.slice(0, 3);
    // não cabe na caixa: o resto vira a próxima página em vez de sumir
    const resto = linhas.slice(3).join(" ").trim();
    if (resto) this.queue.unshift(resto);
    this.chars = 0;
    this.parado = 0;
  }

  /** A fala vai em balão agora? (a opção ligada E alguém falando) */
  get balao() { return emBalao() && !!this.falante; }

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
      this.chars = Math.min(this.totalChars, this.chars + dt * velocidade() * (Input.held("a") || Input.held("b") ? 3 : 1));
      if (Opcoes.get("falaSom") !== false && (this.chars | 0) > before && (this.chars | 0) % 3 === 0) {
        Audio2.tone(1200, 0.012, "square", 0.25);
      }
    } else if (Input.consume("a")) {
      Audio2.select();
      this.next();
    } else if (Opcoes.get("falaAuto")) {
      // O AVANÇO SOZINHO: dá tempo de ler (mais letra, mais tempo) e vira a
      // página. A última página antes de uma pergunta também vira — a
      // pergunta espera o Z, ela não escolhe sozinha.
      this.parado += dt;
      if (this.parado >= 1.2 + this.totalChars * 0.035) this.next();
    }
    return true;
  }

  render(ctx) {
    if (!this.active && !this.choice) return;
    const balao = this.balao && this.lines.length;
    const caixa = balao ? this.caixaDoBalao(ctx) : BOX;
    if (!balao) panel(ctx, BOX.x, BOX.y, BOX.w, BOX.h);
    let left = this.chars | 0;
    this.lines.forEach((line, i) => {
      const n = Math.max(0, Math.min(line.length, left));
      drawText(ctx, line, caixa.x + 8, caixa.y + (balao ? 6 : 8) + i * LINE_H, PAL.ink, { maxChars: n });
      left -= line.length;
    });
    if (!this.typing && !this.choice && (this.blink % 0.9) < 0.55) {
      ctx.fillStyle = PAL.ink;
      ctx.fillRect(caixa.x + caixa.w - 12, caixa.y + caixa.h - 10, 5, 1);
      ctx.fillRect(caixa.x + caixa.w - 11, caixa.y + caixa.h - 9, 3, 1);
      ctx.fillRect(caixa.x + caixa.w - 10, caixa.y + caixa.h - 8, 1, 1);
    }
    if (this.choice) {
      const c = this.choice;
      const w = 8 + Math.max(...c.options.map((o) => o.length)) * 6 + 14;
      const h = c.options.length * LINE_H + 8;
      // no balão a caixa de baixo não existe: as opções encostam no pé da tela
      const x = 238 - w, y = this.falante && emBalao() ? 158 - h : BOX.y - h - 2;
      panel(ctx, x, y, w, h);
      c.options.forEach((o, i) => {
        drawText(ctx, o, x + 14, y + 4 + i * LINE_H, PAL.ink);
        if (i === c.index) cursor(ctx, x + 6, y + 4 + i * LINE_H);
      });
    }
  }

  /** O BALÃO: do tamanho do texto, em cima da cabeça de quem fala, com o
   *  biquinho apontando pra ela. Sem espaço em cima (a pessoa está no alto da
   *  tela), ele vai embaixo, com o biquinho pra cima. Devolve a caixa. */
  caixaDoBalao(ctx) {
    const W = 240, H = 160;
    const cab = this.falante() || { x: W / 2, y: H / 2 };
    const larg = Math.max(...this.lines.map((l) => l.length), 4);
    const w = larg * 6 + 16, h = this.lines.length * LINE_H + 10;
    const x = Math.round(Math.max(4, Math.min(W - 4 - w, cab.x - w / 2)));
    let y = Math.round(cab.y - 6 - h);
    const embaixo = y < 4;
    if (embaixo) y = Math.round(Math.min(H - 4 - h, cab.y + 34));
    panel(ctx, x, y, w, h);
    // o biquinho: moldura por fora, papel por dentro, colado na borda
    const bx = Math.round(Math.max(x + 8, Math.min(x + w - 8, cab.x)));
    const pontas = embaixo ? [[bx - 4, y + 1], [bx + 4, y + 1], [bx, y - 5]]
                           : [[bx - 4, y + h - 1], [bx + 4, y + h - 1], [bx, y + h + 5]];
    const tri = (pts, cor) => {
      ctx.fillStyle = cor;
      ctx.beginPath();
      pts.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
      ctx.closePath(); ctx.fill();
    };
    tri(pontas.map(([px, py]) => [px + (px < bx ? -1 : px > bx ? 1 : 0), py + (embaixo ? (py < y ? -1 : 0) : (py > y + h ? 1 : 0))]), PAL.frame);
    tri(pontas, PAL.paper);
    return { x, y, w, h };
  }
}
