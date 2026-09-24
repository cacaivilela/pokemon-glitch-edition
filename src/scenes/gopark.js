// UM PARQUE do GO PARK COMPLEX: o que foi "pro GO" — e o que veio DO GO —
// anda solto aqui, e volta se você capturar no estilo do GO. E o GO PLACE,
// onde cada um deles libera um minijogo.
//
// Cabem 20 por parque, e é por isso que as escolhas aqui usam uma LISTA
// ROLÁVEL própria em vez do menu do diálogo: o menu do diálogo desenha todas
// as opções de uma vez, e 20 linhas não cabem numa tela de 160 pixels.
// As regras estão em src/systems/gopark.js; as tabelas em src/data/gopark.js.
import { DB } from "../data/index.js";
import { Assets } from "../core/assets.js";
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { panel, drawText, cursor, fade, PAL, LINE_H } from "../core/gfx.js";
import { Dialogue } from "../systems/dialogue.js";
import { guardar as guardarNoBox, cheio as boxCheio } from "../systems/box.js";
import { parque, voltar, minijogoDe, chanceCaptura } from "../systems/gopark.js";
import { reduzido } from "../core/reduzir.js";

const W = 240, H = 160;
const HORIZONTE = 60;
const FAIXAS = 5, FAIXA0 = 96, FAIXA_H = 14;        // 5 fileiras: 20 cabem sem virar uma pilha só
const LISTA_VIS = 6;                                 // linhas visíveis na lista rolável
const SETAS = { up: "↑", down: "↓", left: "←", right: "→" };
const seqNova = (n) => Array.from({ length: n }, () => ["up", "down", "left", "right"][Math.floor(Math.random() * 4)]);

export class GoParkScene {
  /** `i` é qual parque do complexo abrir (o overworld pergunta antes). */
  constructor(i = 0) { this.iParque = i; }

  enter() {
    this.T = DB.GO_TEXTO;
    this.dlg = new Dialogue();
    this.t = 0;
    this.fadeA = 1; this.fadeDir = -1;
    this.saindo = false;
    this.menu = { tipo: "principal", i: 0 };
    this.captura = null;             // o arremesso rodando
    this.jogo = null;                // o minijogo rodando
    this.lista = null;               // a lista rolável (capturar / GO PLACE)
    this.tentativas = {};            // arremessos gastos por Pokémon nesta visita
    this.p = parque(this.st, this.iParque);
    // cada um anda de um lado pro outro numa faixa do gramado
    this.bichos = this.p.mons.map((mon, i) => ({
      mon, x: 24 + Math.random() * 192, y: FAIXA0 + (i % FAIXAS) * FAIXA_H, dir: Math.random() < 0.5 ? 1 : -1,
      vel: 6 + Math.random() * 10, t: Math.random() * 3, bob: Math.random() * 6,
    }));
    Audio2.select();
    if (!this.bichos.length) this.dlg.say(this.T.vazio, () => this.sair());
  }

  exit() {}
  get st() { return this.game.state; }
  get opcoes() { return this.T.parqueOpcoes; }

  // --------------------------------------------------------------- update
  update(dt) {
    this.t += dt;
    for (const b of this.bichos) {
      if (this.captura?.bicho === b) continue;
      b.t -= dt;
      if (b.t <= 0) { b.t = 1 + Math.random() * 3; b.dir = Math.random() < 0.5 ? 1 : -1; if (Math.random() < 0.3) b.dir = 0; }
      b.x = Math.max(24, Math.min(216, b.x + b.dir * b.vel * dt));
    }
    if (this.fadeDir) {
      this.fadeA = Math.max(0, Math.min(1, this.fadeA + this.fadeDir * dt * 3));
      if (this.fadeDir < 0 && this.fadeA <= 0) this.fadeDir = 0;
      if (this.fadeDir > 0 && this.fadeA >= 1) return void this.game.scenes.pop();
      return;
    }
    if (this.dlg.update(dt)) return;
    if (this.captura) return this.updateCaptura(dt);
    if (this.jogo) return this.updateJogo(dt);
    if (this.lista) return this.updateLista();
    if (this.menu.tipo === "principal") return this.updatePrincipal();
  }

  updatePrincipal() {
    const n = this.opcoes.length;
    if (Input.consume("up")) { this.menu.i = (this.menu.i + n - 1) % n; Audio2.blip(); }
    if (Input.consume("down")) { this.menu.i = (this.menu.i + 1) % n; Audio2.blip(); }
    if (Input.consume("b")) return this.sair();
    if (!Input.consume("a")) return;
    Audio2.select();
    if (this.menu.i === 0) return this.escolherCaptura();
    if (this.menu.i === 1) return this.escolherJogo();
    return this.sair();
  }

  nomes() { return this.bichos.map((b) => `${b.mon.nickname} CP${b.mon.cpGO || "?"}`); }

  // ---------------------------------------------------------- lista rolável
  /** Abre a lista. `itens` são rótulos; `cb(i)` recebe o índice escolhido, ou
   *  -1 se desistiu. */
  abrirLista(titulo, itens, cb) {
    this.lista = { titulo, itens, i: 0, topo: 0, cb };
  }

  updateLista() {
    const L = this.lista, n = L.itens.length;
    if (Input.consume("up")) { L.i = (L.i + n - 1) % n; Audio2.blip(); }
    if (Input.consume("down")) { L.i = (L.i + 1) % n; Audio2.blip(); }
    L.topo = Math.max(0, Math.min(L.topo, n - LISTA_VIS));
    if (L.i < L.topo) L.topo = L.i;                          // subiu além do topo
    if (L.i >= L.topo + LISTA_VIS) L.topo = L.i - LISTA_VIS + 1;   // desceu além do rodapé
    if (Input.consume("b")) { this.lista = null; Audio2.cancel(); return void L.cb(-1); }
    if (!Input.consume("a")) return;
    Audio2.select();
    this.lista = null;
    L.cb(L.i);
  }

  drawLista(ctx) {
    const L = this.lista, n = L.itens.length;
    const alt = Math.min(LISTA_VIS, n);
    const h = alt * LINE_H + 22;
    panel(ctx, 4, H - h - 4, W - 8, h);
    drawText(ctx, L.titulo, 12, H - h + 2, PAL.ink);
    for (let k = 0; k < alt; k++) {
      const idx = L.topo + k;
      if (idx >= n) break;
      const y = H - h + 14 + k * LINE_H;
      if (idx === L.i) cursor(ctx, 10, y);
      drawText(ctx, L.itens[idx], 18, y, PAL.ink, { maxChars: 33 });
    }
    // a barrinha de rolagem, pra saber que tem mais embaixo
    if (n > LISTA_VIS) {
      const tx = W - 12, ty = H - h + 14, th = alt * LINE_H - 2;
      ctx.fillStyle = PAL.ink2; ctx.fillRect(tx, ty, 2, th);
      const bh = Math.max(4, th * alt / n);
      ctx.fillStyle = PAL.ink; ctx.fillRect(tx, ty + (th - bh) * L.topo / Math.max(1, n - alt), 2, bh);
    }
    drawText(ctx, `${L.i + 1}/${n}`, 190, H - h + 2, PAL.ink2);
  }

  // -------------------------------------------------------------- captura
  escolherCaptura() {
    if (!this.bichos.length) return void this.dlg.say(this.T.vazio);
    this.abrirLista(this.T.quem, this.nomes(), (i) => {
      const b = this.bichos[i]; if (!b) return;
      const gastos = this.tentativas[this.chave(b.mon)] || 0;
      if (gastos >= DB.GO_PARK.arremessos) return void this.dlg.say(this.T.fugiu.replace("{MON}", b.mon.nickname));
      this.captura = { bicho: b, fase: "mira", r: 1, t: 0, bola: null, chacoalhos: 0, nota: null };
      this.dlg.say(this.T.arremesso);
    });
  }

  /** Dois bichos podem ter o mesmo apelido E a mesma semente (dois que vieram
   *  do mesmo arquivo do GO, por exemplo). A identidade é o objeto. */
  chave(mon) { return this.p.mons.indexOf(mon); }

  updateCaptura(dt) {
    const c = this.captura, b = c.bicho;
    c.t += dt;
    if (c.fase === "mira") {
      // o círculo encolhe e volta, como no GO; A solta a bola
      c.r = 0.5 + 0.5 * Math.cos(c.t * 1.6);
      if (Input.consume("b")) { this.captura = null; Audio2.cancel(); return; }
      if (!Input.consume("a")) return;
      const q = 1 - c.r;                          // 0 = círculo cheio, 1 = pontinho
      c.nota = q > 0.85 ? 2 : q > 0.6 ? 1 : q > 0.3 ? 0 : -1;
      c.qualidade = q;
      c.fase = "voo"; c.t = 0; c.bola = { x: 120, y: 150 };
      this.tentativas[this.chave(b.mon)] = (this.tentativas[this.chave(b.mon)] || 0) + 1;
      Audio2.tone(500, 0.08);
      return;
    }
    if (c.fase === "voo") {
      const p = Math.min(1, c.t / 0.6);
      c.bola.x = 120 + (b.x - 120) * p;
      c.bola.y = 150 + (b.y - 16 - 150) * p - Math.sin(p * Math.PI) * 50;
      if (p >= 1) { c.fase = "chacoalha"; c.t = 0; c.chacoalhos = 0; c.pegou = Math.random() < chanceCaptura(c.qualidade); Audio2.hit(); }
      return;
    }
    if (c.fase === "chacoalha") {
      const n = Math.floor(c.t / 0.7);
      if (n > c.chacoalhos) { c.chacoalhos = n; Audio2.bump(); }
      if (c.t < 2.4) return;
      if (!c.pegou && c.chacoalhos < 3) { /* nunca chega aqui: o tempo decide */ }
      if (c.pegou) {
        const onde = voltar(this.st, b.mon, guardarNoBox, boxCheio);
        if (!onde) { this.captura = null; return void this.dlg.say(this.T.semVaga.replace("{MON}", b.mon.nickname)); }
        this.bichos.splice(this.bichos.indexOf(b), 1);
        this.captura = null;
        Audio2.heal();
        this.game.autosave?.(true);
        const falas = [this.T.pegou.replace("{MON}", b.mon.nickname)];
        if (b.mon.doGO) falas.push(this.T.chegouDoGO.replace("{MON}", b.mon.nickname));
        falas.push((onde === "box" ? this.T.box : this.T.equipe).replace("{MON}", b.mon.nickname));
        return void this.dlg.say(falas);
      }
      this.captura = null;
      Audio2.cancel();
      const gastos = this.tentativas[this.chave(b.mon)];
      this.dlg.say(gastos >= DB.GO_PARK.arremessos ? this.T.fugiu.replace("{MON}", b.mon.nickname) : this.T.escapou.replace("{MON}", b.mon.nickname));
    }
  }

  // ------------------------------------------------------------ GO PLACE
  escolherJogo() {
    if (!this.bichos.length) return void this.dlg.say(this.T.vazio);
    const lista = this.bichos.map((b) => `${minijogoDe(b.mon).nome} DE ${b.mon.nickname}`);
    this.abrirLista(this.T.qualJogo, lista, (i) => {
      const b = this.bichos[i]; if (!b) return;
      const mj = minijogoDe(b.mon);
      this.jogo = { mj, bicho: b, rodada: 0, notas: [], t: 0, pos: 0, dir: 1, alvo: 0.5, prog: 0, estado: "espera", espera: 1, seq: seqNova(4), i: 0, mostra: 2.2 };
      this.dlg.say(mj.texto.replace("{MON}", b.mon.nickname));
      Audio2.tone(700, 0.06);
    });
  }

  updateJogo(dt) {
    const j = this.jogo, m = j.mj.mec;
    j.t += dt;
    if (Input.consume("b")) { this.jogo = null; Audio2.cancel(); return; }
    if (m === "mash") {
      j.prog = Math.max(0, j.prog - 0.35 * dt);
      if (Input.consume("a")) { j.prog = Math.min(1, j.prog + 0.11); Audio2.blip(); }
      if (j.prog >= 1) { j.notas.push(1); Audio2.tone(900, 0.07); j.prog = 0; return this.proximaRodada(); }
      if (j.t > 6) { j.notas.push(0); Audio2.cancel(); j.prog = 0; return this.proximaRodada(); }
    } else if (m === "timing") {
      j.pos += j.dir * dt * (1.1 + j.rodada * 0.35);
      if (j.pos > 1) { j.pos = 1; j.dir = -1; } if (j.pos < 0) { j.pos = 0; j.dir = 1; }
      if (!Input.consume("a")) return;
      const nota = Math.max(0, 1 - Math.abs(j.pos - j.alvo) / 0.16);
      j.notas.push(nota); Audio2.tone(nota > 0.6 ? 900 : 220, 0.07, "square", 0.5);
      j.alvo = 0.2 + Math.random() * 0.6;
      return this.proximaRodada();
    } else if (m === "reacao") {
      if (j.estado === "espera") {
        if (Input.consume("a")) { j.notas.push(0); Audio2.cancel(); return this.proximaRodada(); }
        if (j.t >= j.espera) { j.estado = "ja"; j.t = 0; Audio2.tone(1200, 0.09); }
        return;
      }
      if (Input.consume("a")) { const nota = Math.max(0, 1 - j.t / 0.6); j.notas.push(nota); Audio2.tone(600 + nota * 800, 0.08); return this.proximaRodada(); }
      if (j.t >= 0.6) { j.notas.push(0); return this.proximaRodada(); }
    } else {                                           // seq e memoria
      if (m === "memoria" && j.mostra > 0) { j.mostra -= dt; return; }
      for (const k of Object.keys(SETAS)) {
        if (!Input.consume(k)) continue;
        if (k === j.seq[j.i]) { j.i++; Audio2.blip(); if (j.i >= j.seq.length) { j.notas.push(1); Audio2.tone(900, 0.07); return this.proximaRodada(); } }
        else { j.notas.push(0); Audio2.cancel(); return this.proximaRodada(); }
      }
    }
  }

  proximaRodada() {
    const j = this.jogo;
    j.rodada++;
    if (j.rodada >= j.mj.rodadas) return this.terminarJogo();
    j.t = 0; j.estado = "espera"; j.espera = 0.6 + Math.random() * 2; j.seq = seqNova(4 + j.rodada); j.i = 0; j.mostra = 2.2; j.prog = 0;
  }

  terminarJogo() {
    const j = this.jogo, P = DB.PREMIO_GO;
    const media = j.notas.reduce((s, n) => s + n, 0) / j.notas.length;
    const acertos = j.notas.filter((n) => n > 0.5).length;
    this.jogo = null;
    const poeira = Math.round(P.poeiraMax * media / 100) * 100, doces = Math.round(P.docesMax * media);
    this.st.money = (this.st.money || 0) + poeira;
    if (doces) this.st.items["doce raro"] = (this.st.items["doce raro"] || 0) + doces;
    Audio2[media > 0.5 ? "heal" : "cancel"]();
    this.game.autosave?.(true);
    this.dlg.say([
      this.T.jogoFim.replace("{JOGO}", j.mj.nome).replace("{MON}", j.bicho.mon.nickname).replace("{N}", acertos).replace("{T}", j.mj.rodadas),
      this.T.premio.replace("{POEIRA}", poeira).replace("{DOCES}", doces ? this.T.doces.replace("{N}", doces) : ""),
    ]);
  }

  sair() { if (this.saindo) return; this.saindo = true; Audio2.cancel(); this.fadeDir = 1; }

  // --------------------------------------------------------------- render
  render(ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, HORIZONTE);
    g.addColorStop(0, "#6fc0f0"); g.addColorStop(1, "#d4ecf8");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, HORIZONTE);
    ctx.fillStyle = "#57b34c"; ctx.fillRect(0, HORIZONTE, W, H - HORIZONTE);
    ctx.fillStyle = "#4a9a40"; ctx.fillRect(0, HORIZONTE, W, 3);
    for (let i = 0; i < 12; i++) { ctx.fillStyle = "#63c257"; ctx.fillRect((i * 37) % 236, HORIZONTE + 14 + (i * 23) % 40, 6, 2); }
    // a cerca do GO PARK
    ctx.fillStyle = "#f6f6f6";
    for (let x = 4; x < W; x += 16) ctx.fillRect(x, HORIZONTE - 14, 3, 16);
    ctx.fillRect(0, HORIZONTE - 10, W, 2); ctx.fillRect(0, HORIZONTE - 4, W, 2);
    // os Pokémon, do fundo pra frente
    for (const b of [...this.bichos].sort((a, c) => a.y - c.y)) {
      const img = Assets.mon(b.mon.species, b.mon.seed);
      const sobe = Math.sin(this.t * 4 + b.bob) * (b.dir ? 1.5 : 0.5);
      if (img) {
        ctx.save();
        if (b.dir > 0) { ctx.translate(Math.round(b.x + 16), 0); ctx.scale(-1, 1); ctx.drawImage(reduzido(img, 32), 0, Math.round(b.y - 32 + sobe), 32, 32); }
        else ctx.drawImage(reduzido(img, 32), Math.round(b.x - 16), Math.round(b.y - 32 + sobe), 32, 32);
        ctx.restore();
      }
      if (!this.captura && !this.jogo && !this.lista && !this.dlg.active) drawText(ctx, `CP${b.mon.cpGO || "?"}`, Math.round(b.x - 12), Math.round(b.y - 40), "#fff");
    }
    if (this.captura) this.drawCaptura(ctx);
    if (this.jogo) this.drawJogo(ctx);
    if (this.lista) this.drawLista(ctx);
    if (this.menu.tipo === "principal" && !this.dlg.active && !this.captura && !this.jogo && !this.lista) this.drawMenu(ctx);
    this.dlg.render(ctx);
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }

  drawMenu(ctx) {
    const op = this.opcoes;
    panel(ctx, 4, H - 8 - op.length * LINE_H - 8, 110, op.length * LINE_H + 10);
    op.forEach((o, i) => {
      const y = H - 8 - op.length * LINE_H - 2 + i * LINE_H;
      if (i === this.menu.i) cursor(ctx, 9, y + 2);
      drawText(ctx, o, 17, y, PAL.ink);
    });
    drawText(ctx, `${this.p.nome} ${this.bichos.length}/${DB.GO_PARK.porParque}`, 132, 4, "#fff", { maxChars: 17 });
  }

  drawCaptura(ctx) {
    const c = this.captura, b = c.bicho;
    if (c.fase === "mira") {
      const R = 22, r = 4 + (R - 4) * c.r;
      ctx.strokeStyle = "rgba(255,255,255,.8)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(b.x, b.y - 16, R, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = c.r < 0.15 ? "#ffd166" : c.r < 0.4 ? "#59d99b" : "#ff9a3c"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(b.x, b.y - 16, r, 0, Math.PI * 2); ctx.stroke();
      this.drawBola(ctx, 120, 150);
    } else {
      const shake = c.fase === "chacoalha" ? Math.sin(c.t * 18) * 3 * (c.t % 0.7 < 0.35 ? 1 : 0) : 0;
      this.drawBola(ctx, c.bola.x + shake, c.bola.y);
      if (c.nota >= 0 && c.t < 1.2) drawText(ctx, this.T.notas[c.nota], Math.round(b.x - 18), Math.round(b.y - 50), c.nota === 2 ? "#ffd166" : "#fff");
    }
  }

  drawBola(ctx, x, y) {
    ctx.fillStyle = "#e0524a"; ctx.beginPath(); ctx.arc(x, y, 5, Math.PI, 0); ctx.fill();
    ctx.fillStyle = "#f8f8f8"; ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI); ctx.fill();
    ctx.fillStyle = "#222"; ctx.fillRect(x - 5, y - 1, 10, 2); ctx.fillRect(x - 1, y - 1, 2, 2);
  }

  drawJogo(ctx) {
    const j = this.jogo, m = j.mj.mec;
    panel(ctx, 20, 112, 200, 40);
    drawText(ctx, `${j.mj.nome}  ${j.rodada + 1}/${j.mj.rodadas}`, 28, 116, PAL.ink);
    const x0 = 28, larg = 184, y = 134;
    if (m === "mash") {
      ctx.fillStyle = "#3d3160"; ctx.fillRect(x0, y, larg, 8);
      ctx.fillStyle = "#59d99b"; ctx.fillRect(x0, y, larg * j.prog, 8);
    } else if (m === "timing") {
      ctx.fillStyle = "#3d3160"; ctx.fillRect(x0, y, larg, 8);
      ctx.fillStyle = "#59d99b"; ctx.fillRect(x0 + (j.alvo - 0.08) * larg, y, 0.16 * larg, 8);
      ctx.fillStyle = "#fff"; ctx.fillRect(Math.round(x0 + j.pos * larg) - 1, y - 3, 3, 14);
    } else if (m === "reacao") {
      drawText(ctx, j.estado === "ja" ? this.T.ja : this.T.espere, 28, 132, j.estado === "ja" ? "#59d99b" : PAL.ink);
    } else {
      const esconde = m === "memoria" && j.mostra <= 0;
      j.seq.forEach((k, i) => drawText(ctx, i < j.i ? SETAS[k] : esconde ? "?" : SETAS[k], 28 + i * 14, 130, i < j.i ? "#59d99b" : i === j.i ? "#ffd166" : PAL.ink));
    }
  }
}
