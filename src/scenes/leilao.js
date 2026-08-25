// A BARRACA DE LEILÃO, montada no balcão da loja.
//
// Três passos: escolher quem vai, escolher o preço MÍNIMO e ver os lances
// entrarem. O jogo está no segundo passo — a faixa é da raridade do bicho, e
// dentro dela você decide entre vender rápido e vender caro. Pedir o teto de um
// lendário é pedir 4000 e correr o risco de ninguém levantar a mão.
//
// As contas não estão aqui (src/systems/leilao.js), nem as faixas
// (src/data/leilao.js). Esta tela mostra e pergunta.
import { DB } from "../data/index.js";
import { Assets } from "../core/assets.js";
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { panel, drawText, cursor, fade, PAL, LINE_H } from "../core/gfx.js";
import { Dialogue } from "../systems/dialogue.js";
import { todosGuardados } from "../systems/box.js";
import { faixa, raridade, leiloar, vender, podeLeiloar } from "../systems/leilao.js";

const W = 240, H = 160;

export class LeilaoScene {
  enter() {
    this.dlg = new Dialogue();
    this.t = 0;
    this.fadeA = 1;
    this.fadeDir = -1;
    this.saindo = false;
    this.lances = [];
    this.resultado = null;

    // quem pode ir a leilão: a equipe e o que está guardado no PC
    this.lista = [...(this.st.party || []), ...todosGuardados(this.st)];
    this.menu = { tipo: "escolher", i: 0, top: 0 };
    this.dlg.say(DB.STORY.leilao.abriu);
  }

  exit() {}
  get st() { return this.game.state; }
  get escolhido() { return this.lista[this.menu.i]; }

  // --------------------------------------------------------------- update
  update(dt) {
    this.t += dt;
    if (this.fadeDir) {
      this.fadeA = Math.max(0, Math.min(1, this.fadeA + this.fadeDir * dt * 3));
      if (this.fadeDir < 0 && this.fadeA <= 0) this.fadeDir = 0;
      if (this.fadeDir > 0 && this.fadeA >= 1) return void this.game.scenes.pop();
      return;
    }
    if (this.dlg.update(dt)) return;
    if (this.menu.tipo === "escolher") return this.updateEscolher();
    if (this.menu.tipo === "preco") return this.updatePreco();
    if (this.menu.tipo === "leiloando") return this.updateLeilao(dt);
    if (this.menu.tipo === "fim" && Input.consume("a")) return this.sair();
  }

  updateEscolher() {
    const n = this.lista.length;
    if (!n) return this.sair();
    if (Input.consume("up")) { this.menu.i = (this.menu.i + n - 1) % n; Audio2.blip(); }
    if (Input.consume("down")) { this.menu.i = (this.menu.i + 1) % n; Audio2.blip(); }
    if (Input.consume("b")) return this.sair();
    if (!Input.consume("a")) return;

    const L = DB.STORY.leilao;
    const pode = podeLeiloar(this.st, this.escolhido);
    if (!pode.ok) { Audio2.cancel(); return this.dlg.say(L.naoPode[pode.erro] || L.naoPode.semBicho); }
    Audio2.select();
    const f = faixa(this.escolhido);
    this.menu = { tipo: "preco", i: this.menu.i, pedido: f.min };
  }

  updatePreco() {
    const f = faixa(this.escolhido);
    const anda = (d) => {
      this.menu.pedido = Math.max(f.min, Math.min(f.max, this.menu.pedido + d * f.passo));
      Audio2.blip();
    };
    if (Input.consume("left")) anda(-1);
    if (Input.consume("right")) anda(1);
    if (Input.consume("down")) anda(-5);
    if (Input.consume("up")) anda(5);
    if (Input.consume("b")) { Audio2.cancel(); this.menu = { tipo: "escolher", i: this.menu.i, top: 0 }; return; }
    if (Input.consume("a")) this.comecarLeilao();
  }

  comecarLeilao() {
    const r = leiloar(this.escolhido, this.menu.pedido);
    this.resultado = r;
    this.lances = [];
    this.menu = { tipo: "leiloando", i: this.menu.i, pedido: this.menu.pedido, passo: 0, t: 0 };
    Audio2.tone(520, 0.09);
  }

  /** os lances entram um a um, com meio segundo entre eles: leilão sem espera
   *  é só um número aparecendo na tela */
  updateLeilao(dt) {
    const m = this.menu;
    m.t += dt;
    if (m.t < 0.55) return;
    m.t = 0;

    const r = this.resultado;
    if (m.passo < r.lances.length) {
      this.lances.push(r.lances[m.passo]);
      Audio2.tone(700 + m.passo * 120, 0.07);
      m.passo++;
      return;
    }
    this.fecharLeilao();
  }

  fecharLeilao() {
    const L = DB.STORY.leilao;
    const r = this.resultado;
    const mon = this.escolhido;
    this.menu = { tipo: "fim", i: 0 };

    if (!r.vendido) {
      Audio2.cancel();
      return this.dlg.say([L.ninguem, L.tenteMenos]);
    }
    const venda = vender(this.st, mon, r.preco);
    if (!venda.ok) {                       // não achei o bicho: não cobro por ele
      Audio2.cancel();
      return this.dlg.say(L.sumiu);
    }
    const dinheiro = venda.money;
    this.lista = this.lista.filter((x) => x !== mon);
    Audio2.heal();
    const falas = [L.vendido.replace("{NOME}", mon.nickname).replace("{PRECO}", r.preco)];
    if (r.shiny) falas.push(L.shiny);
    falas.push(L.caixa.replace("{TOTAL}", dinheiro));
    this.dlg.say(falas);
  }

  sair() {
    if (this.saindo) return;
    this.saindo = true;
    Audio2.cancel();
    this.fadeDir = 1;
  }

  // --------------------------------------------------------------- render
  render(ctx) {
    const L = DB.STORY.leilao;
    ctx.fillStyle = "#2a2036";                       // o salão
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#3d3160";
    ctx.fillRect(0, 96, W, H - 96);
    ctx.fillStyle = "#8e6a3c";                       // o balcão
    ctx.fillRect(0, 92, W, 6);

    const mon = this.escolhido;
    if (mon && this.menu.tipo !== "escolher") {
      const img = Assets.mon(mon.species, mon.seed);
      if (img) ctx.drawImage(img, 158, 30 + Math.sin(this.t * 2) * 2, 64, 64);
    }

    if (this.menu.tipo === "escolher") this.drawLista(ctx);
    if (this.menu.tipo === "preco") this.drawPreco(ctx);
    if (this.menu.tipo === "leiloando" || this.menu.tipo === "fim") this.drawLances(ctx);

    panel(ctx, 158, 4, 78, 22);
    drawText(ctx, L.dinheiro, 164, 8, PAL.ink2);
    drawText(ctx, `$${this.st.money}`, 164, 17, PAL.ink);

    this.dlg.render(ctx);
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }

  drawLista(ctx) {
    const L = DB.STORY.leilao;
    const JANELA = 7;
    const m = this.menu;
    if (m.i < m.top) m.top = m.i;
    if (m.i >= m.top + JANELA) m.top = m.i - JANELA + 1;
    const vistos = this.lista.slice(m.top, m.top + JANELA);

    panel(ctx, 4, 4, 148, vistos.length * LINE_H + 16);
    drawText(ctx, L.quem, 10, 8, PAL.ink2);
    vistos.forEach((mon, k) => {
      const y = 20 + k * LINE_H;
      if (m.top + k === m.i) cursor(ctx, 9, y);
      const f = faixa(mon);
      drawText(ctx, `${mon.nickname} N${mon.level}`, 17, y, PAL.ink);
      drawText(ctx, `$${f.min}+`, 108, y, mon.shiny ? "#ffd166" : PAL.ink2);
    });
  }

  drawPreco(ctx) {
    const L = DB.STORY.leilao;
    const mon = this.escolhido;
    const f = faixa(mon);
    const pedido = this.menu.pedido;

    panel(ctx, 4, 4, 148, 84);
    drawText(ctx, `${mon.nickname} — ${f.nome}`, 10, 8, PAL.ink);
    drawText(ctx, L.faixa.replace("{MIN}", f.min).replace("{MAX}", f.max), 10, 8 + LINE_H, PAL.ink2);
    drawText(ctx, `$${pedido}`, 10, 30, PAL.ink);

    // a barra mostra onde o seu pedido está dentro da faixa
    const t = f.max === f.min ? 0 : (pedido - f.min) / (f.max - f.min);
    ctx.fillStyle = "#1a1030";
    ctx.fillRect(10, 48, 132, 8);
    ctx.fillStyle = t < 0.4 ? "#59d99b" : t < 0.75 ? "#ffd166" : "#e0524a";
    ctx.fillRect(10, 48, Math.round(132 * t) || 2, 8);
    drawText(ctx, t < 0.4 ? L.facil : t < 0.75 ? L.medio : L.dificil, 10, 60,
             t < 0.4 ? "#59d99b" : t < 0.75 ? "#ffd166" : "#e0524a");
    drawText(ctx, L.ajuda, 10, 74, PAL.ink2);
  }

  drawLances(ctx) {
    const L = DB.STORY.leilao;
    panel(ctx, 4, 4, 148, 84);
    drawText(ctx, L.pedido.replace("{PRECO}", this.menu.pedido || 0), 10, 8, PAL.ink2);
    this.lances.forEach((lance, i) => {
      drawText(ctx, L.lance.replace("{QUEM}", lance.quem).replace("{VALOR}", lance.valor),
               10, 24 + i * LINE_H, PAL.ink);
    });
    if (!this.lances.length && this.menu.tipo === "fim") {
      drawText(ctx, L.silencio, 10, 24, "#e0524a");
    }
  }
}
