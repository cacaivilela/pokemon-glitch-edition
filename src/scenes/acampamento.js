// O ACAMPAMENTO.
//
// Você monta a barraca, a equipe inteira sai da bola e fica em volta da
// fogueira, e dá pra fazer três coisas: COZINHAR um sanduíche, BRINCAR com
// eles e DESCANSAR. O céu daqui é o mesmo lá de fora (src/systems/ciclo.js),
// então acampar de noite é acampar de noite mesmo.
//
// As regras não estão aqui: quem decide o que sai da panela é
// src/systems/acampamento.js, e as tabelas são src/data/acampamento.js. Esta
// tela cuida de tela — desenho, menu e os dois minijogos.
import { DB } from "../data/index.js";
import { Assets } from "../core/assets.js";
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { panel, drawText, cursor, fade, PAL, LINE_H } from "../core/gfx.js";
import { Dialogue } from "../systems/dialogue.js";
import { gainXp } from "../systems/mon.js";
import { agora, veu } from "../systems/ciclo.js";
import { naMochila, cozinhar, comer, descansar } from "../systems/acampamento.js";
import { INGREDIENTES, MINIJOGOS } from "../data/acampamento.js";

const W = 240, H = 160;
// O palco cabe entre o horizonte e a caixa de texto: 72 a 110. Tudo aqui
// dentro, ou o bicho boia no céu (foi o que aconteceu da primeira vez).
const HORIZONTE = 72;
const CHAO = 104;                 // onde ficam os pés de todo mundo
const FOGO = { x: 120, y: CHAO };
const MAX_INGREDIENTES = 3;

export class AcampamentoScene {
  enter() {
    this.dlg = new Dialogue();
    this.t = 0;
    this.fadeA = 1;
    this.fadeDir = -1;
    this.saindo = false;
    this.menu = { tipo: "principal", i: 0 };
    this.escolhidos = [];
    this.jogo = null;              // o minijogo rodando, quando tem um
    this.faisca = [];              // as fagulhas da fogueira

    // a equipe em volta do fogo: espalhada na faixa de chão, um pouco mais atrás
    // ou mais à frente pra não virar fila de banco de escola. A fogueira é
    // desenhada DEPOIS deles, então quem está atrás dela fica atrás mesmo.
    this.lugares = this.st.party.map((mon, i, todos) => {
      const larg = 150 / Math.max(1, todos.length);
      return {
        mon,
        x: 62 + i * larg + (todos.length === 1 ? 40 : 0),
        pes: CHAO - (i % 2 ? 8 : 0),
        bob: i * 1.7,
      };
    });
    Audio2.heal();
    this.say(DB.STORY.acampamento.montou);
  }

  exit() {}

  get st() { return this.game.state; }
  get opcoes() { return ["COZINHAR", "BRINCAR", "DESCANSAR", "GUARDAR A BARRACA"]; }

  say(texto, cb) { this.dlg.say(texto, cb); }

  // --------------------------------------------------------------- update
  update(dt) {
    this.t += dt;
    this.fogueira(dt);
    if (this.fadeDir) {
      this.fadeA = Math.max(0, Math.min(1, this.fadeA + this.fadeDir * dt * 3));
      if (this.fadeDir < 0 && this.fadeA <= 0) this.fadeDir = 0;
      if (this.fadeDir > 0 && this.fadeA >= 1) return void this.game.scenes.pop();
      return;
    }
    if (this.dlg.update(dt)) return;
    if (this.jogo) return this.updateJogo(dt);
    if (this.menu.tipo === "principal") return this.updatePrincipal();
    if (this.menu.tipo === "ingredientes") return this.updateIngredientes();
  }

  /** as fagulhas subindo: nascem no fogo, morrem no ar */
  fogueira(dt) {
    if (Math.random() < dt * 14) {
      this.faisca.push({ x: FOGO.x + (Math.random() * 12 - 6), y: FOGO.y - 14,
                         vx: Math.random() * 16 - 8, vy: -18 - Math.random() * 22, t: 0 });
    }
    for (let i = this.faisca.length - 1; i >= 0; i--) {
      const f = this.faisca[i];
      f.t += dt; f.x += f.vx * dt; f.y += f.vy * dt; f.vy += 6 * dt;
      if (f.t > 1.1) this.faisca.splice(i, 1);
    }
  }

  updatePrincipal() {
    const n = this.opcoes.length;
    if (Input.consume("up")) { this.menu.i = (this.menu.i + n - 1) % n; Audio2.blip(); }
    if (Input.consume("down")) { this.menu.i = (this.menu.i + 1) % n; Audio2.blip(); }
    if (Input.consume("b")) return this.guardar();
    if (!Input.consume("a")) return;
    Audio2.select();
    const escolha = this.opcoes[this.menu.i];
    if (escolha === "COZINHAR") return this.abrirIngredientes();
    if (escolha === "BRINCAR") return this.comecarBola();
    if (escolha === "DESCANSAR") return this.dormir();
    return this.guardar();
  }

  // ------------------------------------------------------------ cozinhar
  abrirIngredientes() {
    const C = DB.STORY.acampamento;
    this.lista = naMochila(this.st);
    if (!this.lista.length) return this.say(C.semIngrediente);
    this.escolhidos = [];
    this.menu = { tipo: "ingredientes", i: 0 };
  }

  updateIngredientes() {
    const n = this.lista.length;
    if (Input.consume("up")) { this.menu.i = (this.menu.i + n - 1) % n; Audio2.blip(); }
    if (Input.consume("down")) { this.menu.i = (this.menu.i + 1) % n; Audio2.blip(); }
    if (Input.consume("b")) { Audio2.cancel(); this.menu = { tipo: "principal", i: 0 }; return; }
    if (Input.consume("a")) {
      const item = this.lista[this.menu.i];
      const posto = this.escolhidos.filter((x) => x === item).length;
      // não dá pra pôr na tábua mais do que você tem na mochila
      if (this.escolhidos.length >= MAX_INGREDIENTES || posto >= (this.st.items[item] || 0)) {
        Audio2.cancel();
      } else {
        this.escolhidos.push(item);
        Audio2.select();
      }
    }
    // C fecha a tábua e acende o fogo
    if (Input.consume("select") && this.escolhidos.length) this.comecarPanela();
  }

  comecarPanela() {
    const cfg = MINIJOGOS.panela;
    this.menu = { tipo: "cozinhando", i: 0 };
    this.jogo = {
      tipo: "panela", volta: 0, pos: 0, dir: 1, notas: [],
      alvo: 0.3 + Math.random() * 0.4, cfg,
    };
    Audio2.tone(300, 0.08);
  }

  // -------------------------------------------------------------- brincar
  comecarBola() {
    const cfg = MINIJOGOS.bola;
    this.menu = { tipo: "brincando", i: 0 };
    this.jogo = {
      tipo: "bola", rodada: 0, estado: "espera", t: 0, notas: [], cfg,
      espera: cfg.esperaMin + Math.random() * (cfg.esperaMax - cfg.esperaMin),
    };
    Audio2.tone(700, 0.06);
  }

  updateJogo(dt) {
    const j = this.jogo;
    if (j.tipo === "panela") {
      // a barra vai e volta, mais rápido a cada volta
      j.pos += j.dir * dt * j.cfg.velocidade[Math.min(j.volta, j.cfg.velocidade.length - 1)];
      if (j.pos > 1) { j.pos = 1; j.dir = -1; }
      if (j.pos < 0) { j.pos = 0; j.dir = 1; }
      if (!Input.consume("a")) return;
      const erro = Math.abs(j.pos - j.alvo);
      const nota = Math.max(0, 1 - erro / j.cfg.janela);
      j.notas.push(nota);
      Audio2.tone(nota > 0.6 ? 900 : 220, 0.07, "square", 0.5);
      j.volta++;
      j.alvo = 0.2 + Math.random() * 0.6;
      if (j.volta >= j.cfg.voltas) this.terminarPanela();
      return;
    }

    // a bola: espera o JÁ! e aperta. Apertar antes conta como erro.
    j.t += dt;
    if (j.estado === "espera") {
      if (Input.consume("a")) { j.notas.push(0); Audio2.cancel(); return this.proximaBola(); }
      if (j.t >= j.espera) { j.estado = "ja"; j.t = 0; Audio2.tone(1200, 0.09); }
      return;
    }
    if (Input.consume("a")) {
      const nota = Math.max(0, 1 - j.t / j.cfg.limite);
      j.notas.push(nota);
      Audio2.tone(600 + nota * 800, 0.08);
      return this.proximaBola();
    }
    if (j.t >= j.cfg.limite) { j.notas.push(0); return this.proximaBola(); }
  }

  proximaBola() {
    const j = this.jogo;
    j.rodada++;
    if (j.rodada >= j.cfg.rodadas) return this.terminarBola();
    j.estado = "espera";
    j.t = 0;
    j.espera = j.cfg.esperaMin + Math.random() * (j.cfg.esperaMax - j.cfg.esperaMin);
  }

  // ------------------------------------------------------------ resultados
  terminarPanela() {
    const C = DB.STORY.acampamento;
    const j = this.jogo;
    const acerto = j.notas.reduce((s, n) => s + n, 0) / j.notas.length;
    const feito = cozinhar(this.escolhidos, acerto);
    const usados = [...this.escolhidos];
    this.jogo = null;
    this.menu = { tipo: "principal", i: 0 };
    this.escolhidos = [];

    const r = comer(this.st, feito, usados);
    Audio2[acerto > 0.6 ? "heal" : "cancel"]();
    const falas = [
      C.saiu.replace("{NOME}", feito.nome).replace("{ESTRELA}", feito.estrela.nome),
      feito.texto,
    ];
    if (r.curou) falas.push(C.curou);
    else if (feito.minutos) falas.push(C.valePor.replace("{MIN}", feito.minutos));
    this.say(falas);
  }

  terminarBola() {
    const C = DB.STORY.acampamento;
    const j = this.jogo;
    const acertos = j.notas.filter((n) => n > 0).length;
    const media = j.notas.reduce((s, n) => s + n, 0) / j.notas.length;
    this.jogo = null;
    this.menu = { tipo: "principal", i: 0 };

    // brincar dá experiência: pouca, mas pra equipe inteira e sem apanhar
    const xp = Math.round(20 + media * 80);
    const subiram = [];
    for (const mon of this.st.party) {
      for (const ev of gainXp(mon, xp)) if (ev.type === "level") subiram.push(mon.nickname);
    }
    Audio2[acertos ? "heal" : "cancel"]();
    const falas = [C.bolaFim.replace("{N}", acertos).replace("{XP}", xp)];
    if (subiram.length) falas.push(C.subiu.replace("{NOMES}", subiram.join(", ")));
    this.say(falas);
  }

  dormir() {
    const C = DB.STORY.acampamento;
    const n = descansar(this.st);
    Audio2.heal();
    this.say(C.descansou.replace("{N}", n));
  }

  guardar() {
    if (this.saindo) return;
    this.saindo = true;
    Audio2.cancel();
    this.fadeDir = 1;
  }

  // --------------------------------------------------------------- render
  render(ctx) {
    const hora = agora();
    const noturno = hora.escuridao > 0.4;

    const g = ctx.createLinearGradient(0, 0, 0, 110);
    g.addColorStop(0, noturno ? "#0a1030" : "#7fc8f0");
    g.addColorStop(1, noturno ? "#2a2350" : "#d8eef8");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, HORIZONTE + 2);
    if (noturno) {
      for (let i = 0; i < 26; i++) {
        const x = (i * 89) % 236, y = (i * 41) % 60;
        ctx.globalAlpha = 0.4 + 0.6 * Math.sin(this.t * 2 + i);
        ctx.fillStyle = "#f4f2ff";
        ctx.fillRect(x, y, 1, 1);
      }
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = noturno ? "#1e3a24" : "#4e9c46";      // o chão
    ctx.fillRect(0, HORIZONTE, W, H - HORIZONTE);
    ctx.fillStyle = noturno ? "#16301c" : "#3f8038";
    ctx.fillRect(0, HORIZONTE, W, 3);

    this.drawBarraca(ctx, 8, CHAO - 42);
    for (const l of this.lugares) {
      const img = Assets.mon(l.mon.species, l.mon.seed);
      const sobe = Math.sin(this.t * 2 + l.bob) * 1.5;   // respirando
      if (img) ctx.drawImage(img, Math.round(l.x - 16), Math.round(l.pes - 32 + sobe), 32, 32);
    }
    this.drawFogo(ctx);

    // o véu da noite entra por cima do acampamento, mas mais fraco: aqui tem
    // fogueira, e fogueira é justamente o que não deixa escurecer de vez
    const v = veu();
    if (v.alpha > 0) fade(ctx, v.alpha * 0.55, v.cor);

    if (this.jogo?.tipo === "panela") this.drawPanela(ctx);
    if (this.jogo?.tipo === "bola") this.drawBola(ctx);
    if (this.menu.tipo === "principal" && !this.dlg.active) this.drawMenu(ctx);
    if (this.menu.tipo === "ingredientes") this.drawIngredientes(ctx);
    this.dlg.render(ctx);
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }

  drawBarraca(ctx, x, y) {
    ctx.fillStyle = "#c8503c";                       // o pano
    ctx.beginPath();
    ctx.moveTo(x, y + 40); ctx.lineTo(x + 26, y); ctx.lineTo(x + 52, y + 40);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#8e3527";                       // a boca aberta
    ctx.beginPath();
    ctx.moveTo(x + 18, y + 40); ctx.lineTo(x + 26, y + 12); ctx.lineTo(x + 34, y + 40);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#5a3a2a";
    ctx.fillRect(x - 2, y + 40, 56, 3);              // a estaca de baixo
  }

  drawFogo(ctx) {
    ctx.fillStyle = "#3a2418";                       // as pedras em volta
    for (let i = -2; i <= 2; i++) ctx.fillRect(FOGO.x + i * 9 - 3, FOGO.y - 1, 7, 4);
    ctx.fillStyle = "#5a3a2a";                       // as achas
    ctx.fillRect(FOGO.x - 16, FOGO.y - 5, 32, 6);
    ctx.fillRect(FOGO.x - 11, FOGO.y - 10, 22, 5);
    const p = 0.6 + 0.4 * Math.sin(this.t * 9);      // a chama respirando
    for (const [cor, tam] of [["#e0524a", 22], ["#ff8a3c", 16], ["#ffd166", 9]]) {
      ctx.fillStyle = cor;
      ctx.beginPath();
      ctx.moveTo(FOGO.x - tam * 0.55, FOGO.y - 8);
      ctx.lineTo(FOGO.x, FOGO.y - 8 - tam * 1.6 * p);
      ctx.lineTo(FOGO.x + tam * 0.55, FOGO.y - 8);
      ctx.closePath(); ctx.fill();
    }
    for (const f of this.faisca) {                   // as fagulhas
      ctx.globalAlpha = Math.max(0, 1 - f.t);
      ctx.fillStyle = "#ffd166";
      ctx.fillRect(Math.round(f.x), Math.round(f.y), 1, 1);
    }
    ctx.globalAlpha = 1;
  }

  drawMenu(ctx) {
    const op = this.opcoes;
    panel(ctx, 4, H - 8 - op.length * LINE_H - 8, 118, op.length * LINE_H + 10);
    op.forEach((o, i) => {
      const y = H - 8 - op.length * LINE_H - 2 + i * LINE_H;
      if (i === this.menu.i) cursor(ctx, 9, y + 2);
      drawText(ctx, o, 17, y, PAL.ink);
    });
  }

  drawIngredientes(ctx) {
    const C = DB.STORY.acampamento;
    panel(ctx, 4, 8, 132, Math.min(96, this.lista.length * LINE_H + 12));
    drawText(ctx, C.tabua, 10, 12, PAL.ink2 || PAL.ink);
    this.lista.forEach((item, i) => {
      const y = 24 + i * LINE_H;
      if (y > 96) return;
      if (i === this.menu.i) cursor(ctx, 9, y + 2);
      const postos = this.escolhidos.filter((x) => x === item).length;
      const tem = this.st.items[item] || 0;
      drawText(ctx, `${item.toUpperCase()} x${tem}${postos ? " •".repeat(postos) : ""}`, 17, y, PAL.ink);
    });

    panel(ctx, 140, 8, 96, 62);
    const item = this.lista[this.menu.i];
    drawText(ctx, (INGREDIENTES[item]?.sabor || "SEM SABOR").toUpperCase(), 146, 12, PAL.ink);
    drawText(ctx, `NA TÁBUA ${this.escolhidos.length}/${MAX_INGREDIENTES}`, 146, 12 + LINE_H, PAL.ink);
    drawText(ctx, C.ajuda1, 146, 12 + LINE_H * 2.4, PAL.ink);
    drawText(ctx, C.ajuda2, 146, 12 + LINE_H * 3.4, PAL.ink);
  }

  drawPanela(ctx) {
    const j = this.jogo;
    panel(ctx, 20, 112, 200, 40);
    drawText(ctx, `${MINIJOGOS.panela.nome}  ${j.volta + 1}/${j.cfg.voltas}`, 28, 116, PAL.ink);
    const x0 = 28, larg = 184, y = 134;
    ctx.fillStyle = "#3d3160";
    ctx.fillRect(x0, y, larg, 8);
    ctx.fillStyle = "#59d99b";                        // o alvo
    ctx.fillRect(x0 + (j.alvo - j.cfg.janela / 2) * larg, y, j.cfg.janela * larg, 8);
    ctx.fillStyle = "#ffffff";                        // a colher
    ctx.fillRect(Math.round(x0 + j.pos * larg) - 1, y - 3, 3, 14);
  }

  drawBola(ctx) {
    const j = this.jogo;
    panel(ctx, 20, 112, 200, 40);
    drawText(ctx, `${MINIJOGOS.bola.nome}  ${j.rodada + 1}/${j.cfg.rodadas}`, 28, 116, PAL.ink);
    const C = DB.STORY.acampamento;
    drawText(ctx, j.estado === "ja" ? C.ja : C.espere, 28, 132,
             j.estado === "ja" ? "#59d99b" : PAL.ink);
    if (j.estado === "ja") {                          // a bola quicando
      ctx.fillStyle = "#e0524a";
      ctx.beginPath();
      ctx.arc(180, 132 - Math.abs(Math.sin(this.t * 12)) * 10, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
