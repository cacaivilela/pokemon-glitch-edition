// A MINA: a parede de pedra do MONTE LUA em cima de uma grade.
//
// Você escolhe uma célula, bate com a PICARETA ou com o MARTELO, a terra sai
// em camadas e o que estava embaixo aparece. A parede racha um pouco a cada
// batida; quando a barra enche, ela desaba e você leva só o que já tinha
// destampado por inteiro. As tabelas (ferramentas, achados, o que a parede
// aguenta) estão em src/data/mineracao.js — aqui é só a tela e a regra de
// cavar.
import { DB } from "../data/index.js";
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { panel, drawText, bar, fade, PAL } from "../core/gfx.js";
import { Dialogue } from "../systems/dialogue.js";

const W = 240, H = 160;
const CEL = 16;
const GX = 24, GY = 16;              // onde a grade começa na tela
const CORES_TERRA = ["#7a5a3a", "#8a6a44", "#9a7a50", "#aa8a5c", "#b89a6a"];   // por camada
const COR_PEDRA = "#6c6c74";
const COR_FUNDO = "#3a2a20";          // a rocha nua, sem terra nenhuma

export class MineracaoScene {
  enter() {
    const P = DB.MINERACAO.PAREDE;
    this.T = DB.MINERACAO.MINA_TEXTO;
    this.dlg = new Dialogue();
    this.t = 0;
    this.fadeA = 1; this.fadeDir = -1;
    this.saindo = false;
    this.cur = { x: Math.floor(P.cols / 2), y: Math.floor(P.rows / 2) };
    this.ferramenta = "picareta";
    this.racha = 0;
    this.batida = 0;                  // o tremor da tela depois da batida
    this.achados = [];                // o que está enterrado
    this.pedras = new Set();          // "x,y" das rochas que não saem
    this.montarParede();
    this.acabou = false;
    Audio2.tone(200, 0.1);
    this.dlg.say(this.T.ajuda);
  }

  exit() {}
  get st() { return this.game.state; }

  // ------------------------------------------------------------- a parede
  montarParede() {
    const P = DB.MINERACAO.PAREDE, A = DB.MINERACAO.ACHADOS;
    // as camadas de terra: uma altura base pra parede toda e ondulação por célula
    this.prof = [];
    for (let y = 0; y < P.rows; y++) {
      this.prof[y] = [];
      for (let x = 0; x < P.cols; x++) {
        const onda = Math.sin(x * 0.9 + y * 0.6) * 0.8 + Math.random() * 2.2;
        this.prof[y][x] = Math.max(P.profMin, Math.min(P.profMax, Math.round(2.4 + onda)));
      }
    }
    // o que fica enterrado: sorteio por peso, sem uma coisa em cima da outra
    const ocupado = new Set();
    const total = A.reduce((s, a) => s + a.w, 0);
    const n = P.achadosMin + Math.floor(Math.random() * (P.achadosMax - P.achadosMin + 1));
    for (let i = 0, tent = 0; i < n && tent < 200; tent++) {
      let r = Math.random() * total, tipo = A[0];
      for (const a of A) { r -= a.w; if (r <= 0) { tipo = a; break; } }
      const w = Math.max(...tipo.forma.map(([dx]) => dx)) + 1, h = Math.max(...tipo.forma.map(([, dy]) => dy)) + 1;
      const x = Math.floor(Math.random() * (P.cols - w + 1)), y = Math.floor(Math.random() * (P.rows - h + 1));
      const cels = tipo.forma.map(([dx, dy]) => `${x + dx},${y + dy}`);
      if (cels.some((c) => ocupado.has(c))) continue;
      cels.forEach((c) => ocupado.add(c));
      this.achados.push({ tipo, x, y, cels, visto: false, pronto: false });
      // coisa enterrada fica embaixo de pelo menos duas camadas
      for (const [dx, dy] of tipo.forma) this.prof[y + dy][x + dx] = Math.max(2, this.prof[y + dy][x + dx]);
      i++;
    }
    for (let i = 0, tent = 0; i < P.pedras && tent < 100; tent++) {
      const x = Math.floor(Math.random() * P.cols), y = Math.floor(Math.random() * P.rows);
      if (ocupado.has(`${x},${y}`)) continue;
      ocupado.add(`${x},${y}`); this.pedras.add(`${x},${y}`); i++;
    }
  }

  achadoEm(x, y) { return this.achados.find((a) => a.cels.includes(`${x},${y}`)); }

  // --------------------------------------------------------------- update
  update(dt) {
    this.t += dt;
    if (this.batida > 0) this.batida -= dt;
    if (this.fadeDir) {
      this.fadeA = Math.max(0, Math.min(1, this.fadeA + this.fadeDir * dt * 3));
      if (this.fadeDir < 0 && this.fadeA <= 0) this.fadeDir = 0;
      if (this.fadeDir > 0 && this.fadeA >= 1) return void this.game.scenes.pop();
      return;
    }
    if (this.dlg.update(dt)) return;
    if (this.acabou) return this.sair();
    const P = DB.MINERACAO.PAREDE;
    if (Input.consume("up")) { this.cur.y = (this.cur.y + P.rows - 1) % P.rows; Audio2.blip(); }
    if (Input.consume("down")) { this.cur.y = (this.cur.y + 1) % P.rows; Audio2.blip(); }
    if (Input.consume("left")) { this.cur.x = (this.cur.x + P.cols - 1) % P.cols; Audio2.blip(); }
    if (Input.consume("right")) { this.cur.x = (this.cur.x + 1) % P.cols; Audio2.blip(); }
    if (Input.consume("select")) {
      this.ferramenta = this.ferramenta === "picareta" ? "martelo" : "picareta";
      Audio2.select();
    }
    if (Input.consume("b")) {
      Audio2.cancel();
      return this.dlg.ask(this.T.desistir, ["SIM", "NÃO"], (i) => { if (i === 0) this.terminar(this.T.desistiu); });
    }
    if (Input.consume("a")) this.bater();
  }

  /** uma batida: tira camadas do centro, da cruz e das diagonais, e racha a parede */
  bater() {
    const F = DB.MINERACAO.FERRAMENTAS[this.ferramenta], P = DB.MINERACAO.PAREDE;
    const { x, y } = this.cur;
    const tira = (cx, cy, n) => {
      if (n <= 0 || cx < 0 || cy < 0 || cx >= P.cols || cy >= P.rows) return;
      if (this.pedras.has(`${cx},${cy}`)) return;          // rocha não sai
      this.prof[cy][cx] = Math.max(0, this.prof[cy][cx] - n);
    };
    tira(x, y, F.centro);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) tira(x + dx, y + dy, F.cruz);
    for (const [dx, dy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) tira(x + dx, y + dy, F.diag);
    // bater em rocha racha mais: a picareta bate e volta
    const naPedra = this.pedras.has(`${x},${y}`);
    this.racha += F.racha + (naPedra ? 1 : 0);
    this.batida = 0.12;
    Audio2.tone(naPedra ? 120 : this.ferramenta === "martelo" ? 160 : 260, 0.06, "square", 0.6);

    // o que apareceu inteiro
    const novos = [];
    for (const a of this.achados) {
      if (a.pronto) continue;
      const abertas = a.cels.filter((c) => { const [cx, cy] = c.split(",").map(Number); return this.prof[cy][cx] === 0; });
      if (abertas.length && !a.visto) a.visto = true;
      if (abertas.length === a.cels.length) { a.pronto = true; novos.push(a); }
    }
    if (novos.length) {
      Audio2.heal();
      this.dlg.say(novos.map((a) => this.T.achou.replace("{ITEM}", a.tipo.item.toUpperCase())));
    }
    if (this.racha >= P.vida) { this.acabou = true; Audio2.glitch?.(); return this.dlg.say(this.T.desabou); }
    if (this.achados.every((a) => a.pronto)) { this.acabou = true; return this.dlg.say(this.T.limpou); }
  }

  /** entrega o que saiu inteiro e volta pro mapa */
  sair() {
    this.acabou = false;
    const levou = this.achados.filter((a) => a.pronto).map((a) => a.tipo.item);
    for (const item of levou) this.st.items[item] = (this.st.items[item] || 0) + 1;
    const cont = {};
    for (const i of levou) cont[i] = (cont[i] || 0) + 1;
    const lista = Object.entries(cont).map(([i, n]) => `${i.toUpperCase()}${n > 1 ? " x" + n : ""}`).join(", ");
    this.game.autosave?.(true);
    this.terminar(levou.length ? this.T.levou.replace("{LISTA}", lista) : this.T.nada);
  }

  terminar(texto) {
    if (this.saindo) return;
    this.saindo = true;
    this.dlg.say(texto, () => { this.fadeDir = 1; });
  }

  // --------------------------------------------------------------- render
  render(ctx) {
    const P = DB.MINERACAO.PAREDE;
    ctx.fillStyle = "#1a1418";
    ctx.fillRect(0, 0, W, H);
    ctx.save();
    if (this.batida > 0) ctx.translate(Math.round((Math.random() - 0.5) * 3), Math.round((Math.random() - 0.5) * 3));

    // a parede
    for (let y = 0; y < P.rows; y++) for (let x = 0; x < P.cols; x++) {
      const px = GX + x * CEL, py = GY + y * CEL, p = this.prof[y][x];
      if (this.pedras.has(`${x},${y}`)) {
        ctx.fillStyle = COR_PEDRA; ctx.fillRect(px, py, CEL, CEL);
        ctx.fillStyle = "#8a8a94"; ctx.fillRect(px + 3, py + 3, 6, 4);
        ctx.fillStyle = "#4c4c54"; ctx.fillRect(px + 7, py + 10, 6, 3);
        continue;
      }
      if (p === 0) {
        const a = this.achadoEm(x, y);
        ctx.fillStyle = a ? a.tipo.cor : COR_FUNDO;
        ctx.fillRect(px, py, CEL, CEL);
        if (a) {                                    // o desenho da coisa: um brilho e a borda
          ctx.fillStyle = "rgba(255,255,255,.45)"; ctx.fillRect(px + 3, py + 3, 4, 2);
          ctx.fillStyle = "rgba(0,0,0,.25)";
          if (!a.cels.includes(`${x + 1},${y}`)) ctx.fillRect(px + CEL - 1, py, 1, CEL);
          if (!a.cels.includes(`${x},${y + 1}`)) ctx.fillRect(px, py + CEL - 1, CEL, 1);
          if (a.pronto && Math.sin(this.t * 10) > 0) { ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(px, py, CEL, CEL); }
        }
        continue;
      }
      ctx.fillStyle = CORES_TERRA[Math.min(p, CORES_TERRA.length) - 1];
      ctx.fillRect(px, py, CEL, CEL);
      ctx.fillStyle = "rgba(0,0,0,.12)";            // o grão da terra
      ctx.fillRect(px + ((x * 7 + y * 3) % 10), py + ((x * 5 + y * 11) % 10), 2, 2);
      ctx.fillRect(px + ((x * 3 + y * 7 + 6) % 12), py + ((x * 9 + y * 2 + 4) % 12), 1, 1);
    }
    // a grade fina por cima
    ctx.fillStyle = "rgba(0,0,0,.18)";
    for (let x = 0; x <= P.cols; x++) ctx.fillRect(GX + x * CEL, GY, 1, P.rows * CEL);
    for (let y = 0; y <= P.rows; y++) ctx.fillRect(GX, GY + y * CEL, P.cols * CEL, 1);

    // o cursor: a ferramenta em cima da célula
    const cx = GX + this.cur.x * CEL, cy = GY + this.cur.y * CEL;
    ctx.strokeStyle = Math.sin(this.t * 8) > 0 ? "#ffffff" : "#ffe080";
    ctx.lineWidth = 2;
    ctx.strokeRect(cx + 1, cy + 1, CEL - 2, CEL - 2);
    this.drawFerramenta(ctx, cx + CEL - 2, cy - 6);
    ctx.restore();

    // a barra da rachadura e a ferramenta escolhida
    const pct = this.racha / P.vida;
    drawText(ctx, "PAREDE", 4, 3, "#f8f8f8");
    bar(ctx, 48, 5, 120, 6, 1 - pct, pct > 0.75 ? PAL.hpRed : pct > 0.45 ? PAL.hpYellow : PAL.hpGreen);
    drawText(ctx, DB.MINERACAO.FERRAMENTAS[this.ferramenta].nome, 176, 3, "#ffe080");
    // o que já saiu inteiro
    const prontos = this.achados.filter((a) => a.pronto).length;
    drawText(ctx, `ACHADOS ${prontos}/${this.achados.length}`, 4, H - 12, "#f8f8f8");
    drawText(ctx, "C TROCA · B SAI", 150, H - 12, "#9aa0b0");

    this.dlg.render(ctx);
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }

  drawFerramenta(ctx, x, y) {
    if (this.ferramenta === "picareta") {
      ctx.fillStyle = "#8a5a2a"; ctx.fillRect(x, y, 2, 9);          // o cabo
      ctx.fillStyle = "#c0c0c8"; ctx.fillRect(x - 4, y - 1, 10, 2);  // a ponta
    } else {
      ctx.fillStyle = "#8a5a2a"; ctx.fillRect(x, y, 2, 9);
      ctx.fillStyle = "#c0c0c8"; ctx.fillRect(x - 4, y - 2, 10, 5);  // a cabeça
    }
  }
}
