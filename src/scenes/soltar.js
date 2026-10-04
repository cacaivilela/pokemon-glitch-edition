// A CUTSCENE DE SOLTAR UM POKÉMON (src/systems/soltos.js guarda pra onde ele
// foi). Uns 5 segundos, sempre retos (o isométrico não entra aqui):
//
//   BOLA   a POKÉ BOLA vem num arco e cai na grama, balançando
//   ABRE   ela abre num clarão e ele sai, de silhueta branca pra cor
//   OLHA   ele olha pra você triste, dá o grito dele, CHORA (uma lágrima por
//          olho — os olhos são achados no próprio desenho) e aparece um balão
//          de pensamento com uma carinha triste
//   VAI    vira de costas e vai embora pro mato alto, ficando pequeno, com a
//          grama mexendo em volta — e a bola vazia fica pra trás
//
// No fim, a frase ("TCHAU, X!") e o A fecham. `aoFim` roda depois.
import { Assets } from "../core/assets.js";
import { Audio2 } from "../core/audio.js";
import { Dialogue } from "../systems/dialogue.js";
import { gritoDe } from "../systems/gritos.js";
import { fade } from "../core/gfx.js";

const W = 240, H = 160;
const CX = 120, CHAO = 112;           // onde a bola cai e ele sai
const FASES = [["bola", 0.9], ["abre", 0.5], ["olha", 2.4], ["vira", 0.3], ["vai", 1.8]];
const prende = (t) => Math.max(0, Math.min(1, t));
/** OS OLHOS MARCADOS À MÃO, pra quem a busca automática erra: espécie ->
 *  [[x, y], ...] em pixels do sprite de frente (0..63), embaixo de cada olho. */
const OLHOS_A_MAO = {};

export class SoltarScene {
  /** args: { mon, frase?, aoFim? } */
  enter(args = {}) {
    this.mon = args.mon;
    this.frase = args.frase || `TCHAU, ${this.mon?.nickname || "?"}!`;
    this.aoFim = args.aoFim || null;
    Assets.mon(this.mon.species, this.mon.seed);
    Assets.monBack(this.mon.species, this.mon.seed);
    this.dlg = new Dialogue();
    this.t = 0;
    this.i = 0;
    this.tf = 0;
    this.flash = 0;
    this.fadeA = 1;
    this.fadeDir = -1;
    this.saindo = false;
    this.acabou = false;
    this.folhas = [];
    Audio2.stopLoop();
    Audio2.tone(523, 0.08, "triangle", 0.35);
  }

  get fase() { return FASES[this.i]?.[0] || "fim"; }
  get k() { return prende(this.tf / (FASES[this.i]?.[1] || 1)); }

  update(dt) {
    this.t += dt;
    this.tf += dt;
    if (this.fadeDir) {
      this.fadeA = prende(this.fadeA + this.fadeDir * dt * 3);
      if (this.fadeDir < 0 && this.fadeA <= 0) this.fadeDir = 0;
    }
    this.flash = Math.max(0, this.flash - dt * 3);
    this.dlg.update(dt);
    if (this.saindo) {
      if (this.fadeA >= 1) { this.game.scenes.pop(); this.aoFim?.(); }
      return;
    }
    if (!this.acabou && this.tf >= (FASES[this.i]?.[1] || 0)) {
      this.i++;
      this.tf = 0;
      const f = this.fase;
      if (f === "abre") { this.flash = 0.8; Audio2.tone(880, 0.06); Audio2.tone(1175, 0.1); }
      if (f === "olha") Audio2.grito(gritoDe(this.mon.species));
      if (f === "fim") {
        this.acabou = true;
        this.dlg.say(this.frase, () => { this.saindo = true; this.fadeDir = 1; });
      }
    }
    // a grama mexendo enquanto ele entra no mato
    if (this.fase === "vai" && Math.random() < dt * 14) {
      const p = this.posicao();
      this.folhas.push({ x: p.x + (Math.random() - 0.5) * 20, y: p.y - 4, vx: (Math.random() - 0.5) * 30, vy: -20 - Math.random() * 30, vida: 1 });
    }
    for (const f of this.folhas) { f.x += f.vx * dt; f.y += f.vy * dt; f.vy += 70 * dt; f.vida -= dt * 1.4; }
    this.folhas = this.folhas.filter((f) => f.vida > 0);
  }

  /** onde ele está (o meio da linha dos pés) e de que tamanho */
  posicao() {
    if (this.fase === "vai" || this.fase === "fim") {
      const k = this.fase === "fim" ? 1 : this.k;
      return { x: CX + Math.sin(k * 3) * 10, y: CHAO - 42 * k, escala: 1 - 0.75 * k, alfa: 1 - Math.max(0, (k - 0.7) / 0.3) };
    }
    return { x: CX, y: CHAO, escala: 1, alfa: 1 };
  }

  render(ctx) {
    this.fundo(ctx);
    const f = this.fase;
    // a bola: chegando num arco, caída, aberta
    if (f === "bola") {
      const k = this.k;
      const x = 20 + (CX - 20) * k, y = 150 - Math.sin(k * Math.PI) * 70 - (1 - k) * 20 + k * (CHAO - 4 - 130);
      this.bola(ctx, x, Math.min(y, CHAO - 4), k * 12, false);
    } else {
      this.bola(ctx, CX + 26, CHAO - 4, 0, true);
    }
    if (f !== "bola") this.bicho(ctx);
    for (const fl of this.folhas) {
      ctx.globalAlpha = prende(fl.vida);
      ctx.fillStyle = "#4fa04a";
      ctx.fillRect(Math.round(fl.x), Math.round(fl.y), 2, 1);
    }
    ctx.globalAlpha = 1;
    if (this.flash > 0) fade(ctx, this.flash, "#ffffff");
    this.dlg.render(ctx);
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }

  bicho(ctx) {
    const f = this.fase;
    const deCostas = f === "vai" || f === "fim" || (f === "vira" && this.k > 0.5);
    const img = deCostas ? Assets.monBack(this.mon.species, this.mon.seed) : Assets.mon(this.mon.species, this.mon.seed);
    if (!img) return;
    const arte = Assets.comCor(img, this.mon, deCostas);
    const p = this.posicao();
    const lado = Math.round(64 * p.escala * (f === "abre" ? 0.4 + 0.6 * this.k : 1));
    const pulo = f === "olha" ? Math.round(Math.abs(Math.sin(this.tf * 7)) * 3) : f === "vai" ? Math.round(Math.abs(Math.sin(this.tf * 12)) * 2) : 0;
    const x = Math.round(p.x - lado / 2), y = Math.round(p.y - lado - pulo);
    // a sombra
    ctx.fillStyle = "rgba(0,0,0,.25)";
    ctx.beginPath(); ctx.ellipse(p.x, p.y, 18 * p.escala, 4 * p.escala, 0, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = p.alfa;
    ctx.drawImage(arte, x, y, lado, lado);
    // saindo da bola: branco por cima, sumindo
    if (f === "abre") { ctx.globalAlpha = 1 - this.k; ctx.drawImage(Assets.silhueta(img), x, y, lado, lado); }
    ctx.globalAlpha = 1;
    // ele olha pra você triste: a LÁGRIMA escorrendo e o BALÃO de pensamento
    if (f === "olha" && this.tf > 0.3) {
      this.lagrima(ctx, x, y, lado, this.tf - 0.3);
      this.balao(ctx, x + lado - 6, y - 6, prende((this.tf - 0.3) / 0.25));
    }
  }

  /** ONDE FICAM OS OLHOS no sprite de frente (em pixels do sprite, 0..63):
   *  os pixels escuros DE DENTRO do corpo — os quatro vizinhos opacos, o que
   *  deixa o contorno de fora — na parte de cima do desenho, juntados em
   *  grupos. O par na mesma altura, lado a lado, são os olhos (de lado, às
   *  vezes só um aparece). OLHOS_A_MAO corrige quem a busca erra.
   *  Sem nada achado, um chute no meio do rosto. Calculado uma vez. */
  olhos(img) {
    if (this._olhos) return this._olhos;
    const mao = OLHOS_A_MAO[this.mon.species];
    if (mao) return (this._olhos = mao.map(([x, y]) => ({ x: x / 64, y: y / 64 })));
    const W0 = img.width, H0 = img.height;
    let dados;
    try {
      const cv = document.createElement("canvas");
      cv.width = W0; cv.height = H0;
      const c = cv.getContext("2d");
      c.drawImage(img, 0, 0);
      dados = c.getImageData(0, 0, W0, H0).data;
    } catch { dados = null; }
    const chute = [{ x: 0.42, y: 0.42 }, { x: 0.58, y: 0.42 }];
    if (!dados) return (this._olhos = chute);
    const a = (x, y) => (x < 0 || y < 0 || x >= W0 || y >= H0 ? 0 : dados[(y * W0 + x) * 4 + 3]);
    // o tamanho de verdade do bicho no quadro (o sprite tem margem)
    let topo = H0, base = 0;
    for (let y = 0; y < H0; y++) for (let x = 0; x < W0; x++) if (a(x, y) > 100) { topo = Math.min(topo, y); base = Math.max(base, y); }
    const limite = topo + (base - topo) * 0.6;
    const escuro = new Set();
    for (let y = topo; y < limite; y++) {
      for (let x = 1; x < W0 - 1; x++) {
        const i = (y * W0 + x) * 4;
        if (dados[i + 3] < 200) continue;
        const lum = 0.3 * dados[i] + 0.59 * dados[i + 1] + 0.11 * dados[i + 2];
        if (lum > 70) continue;
        if (a(x - 1, y) < 200 || a(x + 1, y) < 200 || a(x, y - 1) < 200 || a(x, y + 1) < 200) continue;
        escuro.add(y * W0 + x);
      }
    }
    // junta os pixels escuros em grupos (vizinhos de 8)
    const grupos = [];
    const visto = new Set();
    for (const p0 of escuro) {
      if (visto.has(p0)) continue;
      const g = [], fila = [p0];
      visto.add(p0);
      while (fila.length) {
        const p = fila.pop(); g.push(p);
        const px = p % W0, py = Math.floor(p / W0);
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          const q = (py + dy) * W0 + px + dx;
          if (escuro.has(q) && !visto.has(q)) { visto.add(q); fila.push(q); }
        }
      }
      if (g.length >= 2 && g.length <= 48) grupos.push(g);
    }
    const info = grupos.map((g) => {
      const xs = g.map((p) => p % W0), ys = g.map((p) => Math.floor(p / W0));
      return { cx: (Math.min(...xs) + Math.max(...xs)) / 2, cy: ys.reduce((t, v) => t + v, 0) / ys.length, base: Math.max(...ys) + 1 };
    });
    // os OLHOS são um PAR: na mesma altura (até 3 px) e lado a lado (6 a 24
    // px) — o par mais alto. Sem par (bicho de lado), a mancha mais alta.
    let par = null;
    for (let i = 0; i < info.length; i++) {
      for (let j = i + 1; j < info.length; j++) {
        const A = info[i], B = info[j], dx = Math.abs(A.cx - B.cx);
        if (Math.abs(A.cy - B.cy) > 3 || dx < 6 || dx > 24) continue;
        if (!par || A.cy + B.cy < par[0].cy + par[1].cy) par = [A, B];
      }
    }
    const escolhidos = par || (info.length ? [info.reduce((m, g) => (g.cy < m.cy ? g : m))] : []);
    // a lágrima nasce embaixo do olho, no meio dele
    const achados = escolhidos.map((g) => ({ x: g.cx / W0, y: g.base / H0 }));
    return (this._olhos = achados.length ? achados : chute);
  }

  /** O CHORO: uma lágrima por olho. Ela se forma embaixo do olho, escorre um
   *  pouco deixando um rastro fino, e pinga até o chão — e outra se forma. */
  lagrima(ctx, x, y, lado, t) {
    const img = Assets.mon(this.mon.species, this.mon.seed);
    if (!img) return;
    this.olhos(img).forEach((o, i) => {
      const lx = Math.round(x + o.x * lado), ly0 = Math.round(y + o.y * lado);
      const ciclo = (t * 0.9 + i * 0.45) % 1;
      const escorre = 9;
      ctx.fillStyle = "#4fb4ff";
      if (ciclo < 0.25) {
        // se formando, embaixo do olho
        const r = ciclo / 0.25;
        ctx.fillRect(lx, ly0, 1 + Math.round(r), 1 + Math.round(r));
      } else if (ciclo < 0.6) {
        // escorrendo pela bochecha, com o rastro
        const k = (ciclo - 0.25) / 0.35, gy = ly0 + Math.round(k * escorre);
        ctx.fillStyle = "#9ad6ff";
        ctx.fillRect(lx, ly0, 1, gy - ly0);
        ctx.fillStyle = "#4fb4ff";
        ctx.fillRect(lx, gy, 2, 2);
        ctx.fillRect(lx, gy - 1, 1, 1);
      } else {
        // pingando até o chão
        const k = (ciclo - 0.6) / 0.4, topoQueda = ly0 + escorre;
        const gy = Math.round(topoQueda + k * (CHAO - topoQueda));
        ctx.globalAlpha = 1 - k * 0.5;
        ctx.fillRect(lx, gy, 2, 2);
        ctx.fillRect(lx, gy - 1, 1, 1);
        ctx.globalAlpha = 1;
      }
    });
  }

  /** o balão de pensamento: as bolinhas subindo da cabeça e o balão com uma
   *  carinha amarela triste dentro (a boca pra baixo e uma lágrima) */
  balao(ctx, x, y, k) {
    if (k <= 0) return;
    ctx.globalAlpha = k;
    const borda = "#1c2030", branco = "#f4f4f4";
    const bolinha = (cx, cy, r) => {
      ctx.fillStyle = borda; ctx.beginPath(); ctx.arc(cx, cy, r + 1, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = branco; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    };
    bolinha(x, y, 1.5);
    bolinha(x + 5, y - 6, 2.5);
    // o balão
    const bx = x + 18, by = y - 20;
    ctx.fillStyle = borda; ctx.beginPath(); ctx.ellipse(bx, by, 15, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = branco; ctx.beginPath(); ctx.ellipse(bx, by, 14, 11, 0, 0, Math.PI * 2); ctx.fill();
    // a carinha triste
    ctx.fillStyle = "#c08a10"; ctx.beginPath(); ctx.arc(bx, by, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ffd23f"; ctx.beginPath(); ctx.arc(bx, by, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = borda;
    ctx.fillRect(bx - 4, by - 3, 2, 2);                  // os olhos
    ctx.fillRect(bx + 2, by - 3, 2, 2);
    ctx.fillRect(bx - 5, by - 5, 2, 1);                  // as sobrancelhas caídas
    ctx.fillRect(bx + 3, by - 5, 2, 1);
    ctx.fillRect(bx - 2, by + 2, 4, 1);                  // a boca pra baixo
    ctx.fillRect(bx - 3, by + 3, 1, 1);
    ctx.fillRect(bx + 2, by + 3, 1, 1);
    ctx.fillStyle = "#4fb4ff";                           // a lágrima da carinha
    ctx.fillRect(bx - 4, by - 1, 1, 2);
    ctx.fillRect(bx - 5, by + 1, 2, 1);
    ctx.globalAlpha = 1;
  }

  /** a POKÉ BOLA: girando no ar, ou aberta e vazia no chão */
  bola(ctx, x, y, giro, aberta) {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    if (!aberta) ctx.rotate(giro);
    const r = 6;
    ctx.fillStyle = "#1c2030";
    ctx.beginPath(); ctx.arc(0, 0, r + 1, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#f4f4f4";
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI); ctx.fill();
    ctx.fillStyle = "#e0524a";
    if (aberta) { ctx.beginPath(); ctx.arc(0, -4, r, Math.PI, 0); ctx.fill(); }
    else { ctx.beginPath(); ctx.arc(0, 0, r, Math.PI, 0); ctx.fill(); }
    ctx.fillStyle = "#1c2030";
    ctx.fillRect(-r, -1, r * 2, 2);
    ctx.fillStyle = "#f4f4f4";
    ctx.fillRect(-1, -1, 2, 2);
    ctx.restore();
  }

  /** o campo: céu, horizonte e o mato alto lá no fundo, pra onde ele vai */
  fundo(ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, 70);
    g.addColorStop(0, "#5aa8e0");
    g.addColorStop(1, "#cfeaf4");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, 70);
    ctx.fillStyle = "#4c9a46";
    ctx.fillRect(0, 66, W, H - 66);
    // o mato alto do fundo, balançando
    for (let fil = 0; fil < 3; fil++) {
      const y = 62 + fil * 8;
      ctx.fillStyle = fil % 2 ? "#2f7a30" : "#357f34";
      for (let x = -4 + (fil % 2) * 5; x < W + 4; x += 10) {
        const b = Math.sin(this.t * 3 + x * 0.1 + fil) * 1.5;
        ctx.beginPath(); ctx.moveTo(x, y + 10); ctx.lineTo(x + 3 + b, y); ctx.lineTo(x + 6, y + 10); ctx.fill();
      }
    }
    // o chão de terra onde a bola cai
    ctx.fillStyle = "#b99a62";
    ctx.beginPath(); ctx.ellipse(CX, CHAO + 4, 70, 12, 0, 0, Math.PI * 2); ctx.fill();
  }
}
