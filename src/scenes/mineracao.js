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
    const cont = {};
    for (const a of this.achados.filter((a) => a.pronto)) {
      const [mn, mx] = a.tipo.qtd || [1, 1];
      const n = mn + Math.floor(Math.random() * (mx - mn + 1));
      this.st.items[a.tipo.item] = (this.st.items[a.tipo.item] || 0) + n;
      cont[a.tipo.item] = (cont[a.tipo.item] || 0) + n;
    }
    const levou = Object.keys(cont);
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
        continue;
      }
      ctx.fillStyle = CORES_TERRA[Math.min(p, CORES_TERRA.length) - 1];
      ctx.fillRect(px, py, CEL, CEL);
      ctx.fillStyle = "rgba(0,0,0,.12)";            // o grão da terra
      ctx.fillRect(px + ((x * 7 + y * 3) % 10), py + ((x * 5 + y * 11) % 10), 2, 2);
      ctx.fillRect(px + ((x * 3 + y * 7 + 6) % 12), py + ((x * 9 + y * 2 + 4) % 12), 1, 1);
    }
    // o desenho de cada coisa, recortado pelas células que já abriram
    for (const a of this.achados) {
      const abertas = a.cels.map((c) => c.split(",").map(Number)).filter(([cx, cy]) => this.prof[cy][cx] === 0);
      if (!abertas.length) continue;
      ctx.save();
      ctx.beginPath();
      for (const [cx, cy] of abertas) ctx.rect(GX + cx * CEL, GY + cy * CEL, CEL, CEL);
      ctx.clip();
      const w = (Math.max(...a.tipo.forma.map(([dx]) => dx)) + 1) * CEL, h = (Math.max(...a.tipo.forma.map(([, dy]) => dy)) + 1) * CEL;
      desenhaAchado(ctx, a.tipo, GX + a.x * CEL, GY + a.y * CEL, w, h, this.t);
      if (a.pronto && Math.sin(this.t * 10) > 0) { ctx.fillStyle = "rgba(255,255,255,.3)"; ctx.fillRect(GX + a.x * CEL, GY + a.y * CEL, w, h); }
      ctx.restore();
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

// ---------------------------------------------------------------- os desenhos
// Cada achado tem um `desenho` (src/data/mineracao.js); sem ele, sai a pedra
// lisa da cor dele. Tudo em pixel: retângulos e arcos, nada de imagem.
const px = (ctx, x, y, w, h, cor) => { ctx.fillStyle = cor; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
const escuro = (cor, f = 0.6) => { const n = parseInt(cor.slice(1), 16); const c = (v) => Math.round(v * f); return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`; };
const claro = (cor) => { const n = parseInt(cor.slice(1), 16); const c = (v) => Math.min(255, Math.round(v + (255 - v) * 0.5)); return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`; };
function desenhaAchado(ctx, tipo, x, y, w, h, t) {
  const cor = tipo.cor, esc = escuro(cor), cla = claro(cor), cx = x + w / 2, cy = y + h / 2;
  const d = tipo.desenho || "pedra";
  if (d === "helix") {                                  // a concha em espiral
    for (let r = 13, i = 0; r > 2; r -= 2.6, i++) { ctx.fillStyle = i % 2 ? esc : cor; ctx.beginPath(); ctx.arc(cx + i * 0.8, cy + i * 0.6, r, 0, Math.PI * 2); ctx.fill(); }
    px(ctx, cx - 6, cy - 9, 3, 2, cla);
  } else if (d === "domo") {                            // a carapaça em cúpula com três sulcos
    ctx.fillStyle = cor; ctx.beginPath(); ctx.arc(cx, cy + 5, 14, Math.PI, 0); ctx.fill();
    px(ctx, cx - 15, cy + 4, 30, 3, esc);
    for (const dx of [-7, 0, 7]) px(ctx, cx + dx, cy - 6, 2, 10, esc);
    px(ctx, cx - 4, cy - 10, 6, 2, cla);
  } else if (d === "ambar") {                           // o âmbar com a asa dentro
    ctx.fillStyle = cor; ctx.beginPath(); ctx.moveTo(cx - 12, cy - 4); ctx.lineTo(cx - 3, cy - 13); ctx.lineTo(cx + 12, cy - 6); ctx.lineTo(cx + 9, cy + 12); ctx.lineTo(cx - 9, cy + 11); ctx.closePath(); ctx.fill();
    px(ctx, cx - 6, cy - 2, 12, 2, esc); px(ctx, cx - 4, cy - 5, 2, 8, esc); px(ctx, cx + 2, cy - 5, 2, 8, esc); px(ctx, cx + 5, cy - 3, 2, 5, esc);
    px(ctx, cx - 8, cy - 8, 4, 2, "#fff4c0");
  } else if (d === "osso") {                            // fóssil genérico: a costela na pedra
    px(ctx, x + 2, y + 2, w - 4, h - 4, cor);
    px(ctx, x + 4, y + h / 2 - 1, w - 8, 2, cla);
    for (let i = x + 5; i < x + w - 4; i += 5) px(ctx, i, y + 4, 2, h - 8, cla);
    px(ctx, x + 2, y + h - 3, w - 4, 1, esc);
  } else if (d === "cranio") {                          // o crânio de testa grossa
    ctx.fillStyle = cor; ctx.beginPath(); ctx.arc(cx, cy - 3, 12, 0, Math.PI * 2); ctx.fill();
    px(ctx, cx - 9, cy + 3, 18, 9, cor); px(ctx, cx - 8, cy - 1, 5, 4, esc); px(ctx, cx + 3, cy - 1, 5, 4, esc);
    px(ctx, cx - 5, cy + 7, 10, 3, esc); for (const dx of [-4, 0, 4]) px(ctx, cx + dx, cy + 8, 2, 3, cla);
    px(ctx, cx - 12, cy - 9, 24, 3, cla);
  } else if (d === "escudo") {                          // a placa da cabeça, com as pontas
    ctx.fillStyle = cor; ctx.beginPath(); ctx.moveTo(cx - 14, cy - 8); ctx.lineTo(cx + 14, cy - 8); ctx.lineTo(cx + 10, cy + 12); ctx.lineTo(cx - 10, cy + 12); ctx.closePath(); ctx.fill();
    px(ctx, cx - 14, cy - 13, 4, 6, esc); px(ctx, cx + 10, cy - 13, 4, 6, esc);
    px(ctx, cx - 6, cy - 1, 4, 4, esc); px(ctx, cx + 2, cy - 1, 4, 4, esc); px(ctx, cx - 11, cy - 6, 22, 2, cla);
  } else if (d === "metade") {                          // meio fóssil: a linha do corte serrilhada
    px(ctx, x + 2, y + 2, w - 4, h - 4, cor);
    const vert = h > w;
    for (let i = 0; i < (vert ? w : h) - 4; i += 4) vert ? px(ctx, x + 2 + i, y + h - 4 - (i % 8 ? 0 : 2), 4, 2, "#3a2a20") : px(ctx, x + w - 4 - (i % 8 ? 0 : 2), y + 2 + i, 2, 4, "#3a2a20");
    px(ctx, x + 4, y + 4, w - 8, 2, cla); px(ctx, x + 4, y + h / 2, w - 8, 1, esc);
  } else if (d === "pedra") {                           // pedra de evolução: a gema facetada
    ctx.fillStyle = cor; ctx.beginPath(); ctx.moveTo(cx, cy - 10); ctx.lineTo(cx + 9, cy - 3); ctx.lineTo(cx + 6, cy + 9); ctx.lineTo(cx - 6, cy + 9); ctx.lineTo(cx - 9, cy - 3); ctx.closePath(); ctx.fill();
    ctx.fillStyle = esc; ctx.beginPath(); ctx.moveTo(cx, cy - 2); ctx.lineTo(cx + 6, cy + 9); ctx.lineTo(cx - 6, cy + 9); ctx.closePath(); ctx.fill();
    px(ctx, cx - 4, cy - 6, 3, 3, "#ffffff");
  } else if (d === "pepita") {                          // o torrão de ouro
    ctx.fillStyle = cor; ctx.beginPath(); ctx.moveTo(cx - 6, cy - 2); ctx.lineTo(cx - 1, cy - 6); ctx.lineTo(cx + 6, cy - 4); ctx.lineTo(cx + 6, cy + 3); ctx.lineTo(cx + 1, cy + 6); ctx.lineTo(cx - 6, cy + 4); ctx.closePath(); ctx.fill();
    px(ctx, cx - 3, cy - 3, 3, 2, "#ffffff"); px(ctx, cx - 2, cy + 3, 6, 2, esc);
    if (w > CEL) { ctx.fillStyle = cor; ctx.beginPath(); ctx.arc(cx + 6, cy + 6, 6, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(cx - 8, cy - 7, 5, 0, Math.PI * 2); ctx.fill(); px(ctx, cx + 3, cy + 4, 2, 2, "#ffffff"); }
  } else if (d === "estrela") {                         // a estrela de cinco pontas
    ctx.fillStyle = cor; ctx.beginPath();
    for (let i = 0; i < 10; i++) { const r = i % 2 ? 4 : 10, a = -Math.PI / 2 + i * Math.PI / 5; ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); }
    ctx.closePath(); ctx.fill();
    px(ctx, cx - 2, cy - 4, 2, 2, "#ffffff");
  } else if (d === "doce") {                            // o doce raro embrulhado
    px(ctx, cx - 5, cy - 4, 10, 8, cor); px(ctx, cx - 8, cy - 2, 3, 4, esc); px(ctx, cx + 5, cy - 2, 3, 4, esc); px(ctx, cx - 3, cy - 3, 3, 2, "#ffffff");
  } else if (d === "bola") {                            // a bola, da cor de cima dela
    ctx.fillStyle = "#f8f8f8"; ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = cor; ctx.beginPath(); ctx.arc(cx, cy, 6, Math.PI, 0); ctx.fill();
    px(ctx, cx - 6, cy - 1, 12, 2, "#202020"); px(ctx, cx - 1, cy - 1, 3, 3, "#f8f8f8"); px(ctx, cx - 4, cy - 4, 2, 1, "#ffffff");
  } else if (d === "ovo") {                             // o ovo com as pintas
    ctx.fillStyle = cor; ctx.beginPath(); ctx.ellipse(cx, cy + 2, 7, 10, 0, 0, Math.PI * 2); ctx.fill();
    for (const [dx, dy] of [[-3, -3], [2, 1], [-1, 6]]) px(ctx, cx + dx, cy + dy, 3, 3, "#7ac07a");
    px(ctx, cx - 3, cy - 6, 2, 2, "#ffffff");
  } else if (d === "disco") {                           // UP-GRADE / DUBIOUS DISC: o disco com o furo
    ctx.fillStyle = cor; ctx.beginPath(); ctx.arc(cx, cy, 9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = esc; ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.6)"; ctx.beginPath(); ctx.arc(cx, cy, 7, Math.PI * 1.1 + t * 3, Math.PI * 1.4 + t * 3); ctx.lineTo(cx, cy); ctx.fill();
  } else if (d === "crepusculo") {                      // a pedra preta que não reflete
    ctx.fillStyle = "#101018"; ctx.beginPath(); ctx.moveTo(cx, cy - 12); ctx.lineTo(cx + 7, cy); ctx.lineTo(cx, cy + 12); ctx.lineTo(cx - 7, cy); ctx.closePath(); ctx.fill();
    px(ctx, cx - 2, cy - 1, 4, 2, "#6a3a9a");
  } else { px(ctx, x + 2, y + 2, w - 4, h - 4, cor); px(ctx, x + 4, y + 4, 4, 2, cla); }
}
