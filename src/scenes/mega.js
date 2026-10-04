// A CUTSCENE DA MEGA EVOLUÇÃO. Curta (uns 5 s), porque ela acontece no meio da
// batalha — e diferente da evolução de propósito: aqui nada se desmancha.
//
//   CHAMADO  a tela escurece; embaixo, a PEDRA-CHAVE do anel acende, e no
//            peito do bicho a PEDRA MEGA responde. Um raio de arco-íris liga
//            as duas.
//   CASULO   fitas de luz colorida giram e entram nele; ele vira silhueta e
//            um CASULO DE CRISTAL (um losango facetado) fecha em volta.
//   RACHA    o cristal trinca de branco, cada vez mais, e treme.
//   ESTOURA  clarão: os cacos voam pra fora.
//   REVELA   a forma MEGA, com um soco de zoom, o SÍMBOLO DA MEGA brilhando em
//            cima da cabeça e um anel de arco-íris abrindo no chão.
//
// Quem chama: a batalha (src/scenes/battle.js, `fazerMega`) e a de grupo
// (src/scenes/grupobattle.js, a MEGA na entrada) — a espécie só muda DEPOIS
// que a cena fecha, quem chama é que faz `megaEvoluir`. E o site das evoluções
// (evolucoes.html, ?megacena=de:para), que pede `sozinha: true`: aí a cena mesma
// mostra a frase no fim e espera o A.
import { DB } from "../data/index.js";
import { Assets } from "../core/assets.js";
import { Audio2 } from "../core/audio.js";
import { Dialogue } from "../systems/dialogue.js";
import { fade } from "../core/gfx.js";
import { isoLigado, palcoIso, bichoNoPalco } from "../core/isometrico.js";

const W = 240, H = 160;
const CX = W / 2, CY = 60;           // o meio do bicho
const LADO = 64;
const PEDRA_CHAVE = { x: 34, y: 132 }; // o anel, no canto de baixo (é a mão de quem joga)
const FASES = [["chamado", 1.0], ["casulo", 1.5], ["racha", 0.9], ["estoura", 0.25], ["revela", 1.9]];
const ARCO = ["#ff5a5a", "#ffa63d", "#ffe14d", "#5ee87a", "#4fc3ff", "#8f6bff", "#e66bff"];

const prende = (t) => Math.max(0, Math.min(1, t));
const suave = (t) => t * t * (3 - 2 * t);

export class MegaScene {
  /** args: { mon, to, aoFim?, sozinha?, frase? } */
  enter(args = {}) {
    this.mon = args.mon;
    this.to = args.to;
    this.aoFim = args.aoFim || null;
    this.sozinha = !!args.sozinha;
    this.frase = args.frase || null;
    Assets.mon(this.mon.species, this.mon.seed);
    Assets.mon(this.to, this.mon.seed);
    this.dlg = new Dialogue();
    this.t = 0;
    this.i = 0;                  // a fase atual (índice em FASES)
    this.tf = 0;
    this.fitas = [];
    this.cacos = [];
    this.brilhos = [];
    this.trincas = [];
    this.flash = 0;
    this.tremor = 0;
    this.fadeA = 1;
    this.fadeDir = -1;
    this.saindo = false;
    this.acabou = false;
    // o casulo: um losango de 8 facetas em volta do bicho
    this.casulo = Array.from({ length: 8 }, (_, k) => {
      const a = (k / 8) * Math.PI * 2 - Math.PI / 2;
      return { x: CX + Math.cos(a) * 30, y: CY + Math.sin(a) * 38 };
    });
    Audio2.tone(330, 0.3, "sine", 0.4);
    Audio2.tone(494, 0.4, "sine", 0.35);
  }

  get fase() { return FASES[this.i]?.[0] || "fim"; }
  get duracao() { return FASES[this.i]?.[1] || 0; }
  get k() { return prende(this.tf / (this.duracao || 1)); }

  /** a arte do bicho, já com a cor dele (shiny, luminoso) */
  arte(id) {
    const img = Assets.mon(id, this.mon.seed);
    return img ? Assets.comCor(img, { ...this.mon, species: id }) : null;
  }

  proxima() {
    this.i++;
    this.tf = 0;
    const f = this.fase;
    if (f === "casulo") { Audio2.tone(392, 0.25, "triangle", 0.4); Audio2.tone(523, 0.3, "triangle", 0.4); }
    if (f === "racha") Audio2.tone(180, 0.6, "sawtooth", 0.25);
    if (f === "estoura") {
      this.flash = 1;
      this.tremor = 5;
      Audio2.tone(880, 0.12, "square", 0.5); Audio2.tone(1320, 0.2, "square", 0.45);
      // os cacos: cada faceta do casulo vira três pedaços voando pra fora
      for (let k = 0; k < 24; k++) {
        const a = Math.random() * Math.PI * 2, v = 60 + Math.random() * 120;
        this.cacos.push({ x: CX, y: CY, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 30, gira: (Math.random() - 0.5) * 12,
                          ang: a, tam: 3 + Math.random() * 5, cor: ARCO[k % ARCO.length], vida: 1 });
      }
    }
    if (f === "revela") { Audio2.heal(); }
    if (f === "fim") this.terminar();
  }

  terminar() {
    if (this.acabou) return;
    this.acabou = true;
    if (this.sozinha) {
      const frase = this.frase || DB.STORY?.mega?.evoluiu?.replace("{MON}", this.mon.nickname)
        .replace("{FORMA}", DB.SPECIES[this.to]?.name || this.to) || "MEGA EVOLUÇÃO!";
      this.dlg.say(frase, () => this.sair());
    } else this.sair();
  }

  sair() { this.saindo = true; this.fadeDir = 1; }

  update(dt) {
    this.t += dt;
    this.tf += dt;
    if (this.fadeDir) {
      this.fadeA = prende(this.fadeA + this.fadeDir * dt * (this.saindo ? 4 : 3));
      if (this.fadeDir < 0 && this.fadeA <= 0) this.fadeDir = 0;
    }
    this.flash = Math.max(0, this.flash - dt * 2.5);
    this.tremor = Math.max(0, this.tremor - dt * 8);
    this.dlg.update(dt);
    if (this.saindo) {
      if (this.fadeA >= 1) {
        this.game.scenes.pop();
        this.aoFim?.();
      }
      return;
    }
    if (!this.acabou && this.duracao && this.tf >= this.duracao) this.proxima();

    const f = this.fase;
    // as fitas de arco-íris girando e entrando no bicho
    if ((f === "chamado" && this.k > 0.5) || f === "casulo") {
      if (Math.random() < dt * 26) {
        this.fitas.push({ ang: Math.random() * Math.PI * 2, r: 110 + Math.random() * 30, v: 70 + Math.random() * 60,
                          giro: 2.4 + Math.random() * 1.5, cor: ARCO[Math.floor(Math.random() * ARCO.length)], vida: 1 });
      }
    }
    for (const q of this.fitas) { q.r -= q.v * dt; q.ang += q.giro * dt; if (q.r < 8) q.vida = 0; }
    this.fitas = this.fitas.filter((q) => q.vida > 0);
    // as trincas: uma a mais a cada tanto, do meio pra borda do cristal
    if (f === "racha" && Math.random() < dt * 14) {
      const a = Math.random() * Math.PI * 2, pts = [[CX, CY]];
      let x = CX, y = CY;
      for (let s = 0; s < 4; s++) {
        x += Math.cos(a + (Math.random() - 0.5) * 0.9) * 8;
        y += Math.sin(a + (Math.random() - 0.5) * 0.9) * 10;
        pts.push([x, y]);
      }
      this.trincas.push(pts);
      this.tremor = Math.max(this.tremor, 1 + this.k * 2);
      Audio2.tone(1200 + Math.random() * 600, 0.03, "square", 0.15);
    }
    for (const c of this.cacos) {
      c.x += c.vx * dt; c.y += c.vy * dt; c.vy += 140 * dt; c.ang += c.gira * dt; c.vida -= dt * 0.9;
    }
    this.cacos = this.cacos.filter((c) => c.vida > 0);
    if (f === "revela" && Math.random() < dt * 12) {
      const a = Math.random() * Math.PI * 2, r = 20 + Math.random() * 26;
      this.brilhos.push({ x: CX + Math.cos(a) * r, y: CY + Math.sin(a) * r, vida: 1, cor: ARCO[Math.floor(Math.random() * ARCO.length)] });
    }
    for (const b of this.brilhos) b.vida -= dt * 1.6;
    this.brilhos = this.brilhos.filter((b) => b.vida > 0);
  }

  render(ctx) {
    const f = this.fase, k = this.k;
    // o fundo: preto com um degradê roxo que acende na revelação
    const g = ctx.createRadialGradient(CX, CY, 6, CX, CY, 170);
    const acende = f === "revela" || f === "fim" ? 1 : f === "casulo" ? 0.35 + 0.3 * k : f === "racha" ? 0.7 : 0.15 * k;
    g.addColorStop(0, `rgba(${120 + 100 * acende | 0},${60 + 60 * acende | 0},${160 + 60 * acende | 0},1)`);
    g.addColorStop(1, "#05030c");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    this.raiosDeFundo(ctx, acende);

    ctx.save();
    if (this.tremor > 0) ctx.translate(Math.round((Math.random() - 0.5) * this.tremor), Math.round((Math.random() - 0.5) * this.tremor));

    // a PEDRA-CHAVE (fora do palco: é a mão de quem joga, reta) e o raio até o bicho
    if (f === "chamado" || f === "casulo") this.raioDasPedras(ctx, f === "chamado" ? k : 1 - k);
    this.pedra(ctx, PEDRA_CHAVE.x, PEDRA_CHAVE.y, 6, f === "chamado" || f === "casulo" ? 1 : 0.4);

    // O PALCO (no isométrico vai inclinado, como o da evolução)
    ctx.save();
    if (isoLigado()) palcoIso(ctx, CX, CY + LADO / 2);
    const flutua = Math.round(Math.sin(this.t * 2.4) * 2);
    const x0 = Math.round(CX - LADO / 2), y0 = Math.round(CY - LADO / 2) + flutua;

    // as fitas de luz entrando
    for (const q of this.fitas) {
      ctx.strokeStyle = q.cor;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.arc(CX, CY, Math.max(1, q.r), q.ang, q.ang + 0.5);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.lineWidth = 1;

    if (f === "chamado") {
      bichoNoPalco(ctx, this.arte(this.mon.species), x0, y0, LADO, LADO);
      // a PEDRA MEGA no peito, acendendo
      this.pedra(ctx, CX, CY + 6, 3 + 2 * k, k);
    } else if (f === "casulo" || f === "racha") {
      // ele vira silhueta branca dentro do cristal
      const velho = this.arte(this.mon.species);
      if (velho) {
        bichoNoPalco(ctx, velho, x0, y0, LADO, LADO);
        ctx.globalAlpha = f === "casulo" ? suave(k) : 1;
        ctx.drawImage(Assets.silhueta(velho), x0, y0, LADO, LADO);
        ctx.globalAlpha = 1;
      }
      this.desenhaCasulo(ctx, f === "casulo" ? suave(k) : 1);
      for (const pts of this.trincas) {
        ctx.strokeStyle = "#ffffff";
        ctx.beginPath();
        pts.forEach(([x, y], j) => (j ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        ctx.stroke();
      }
    } else {
      // a forma MEGA: soco de zoom, a silhueta branca sumindo por cima
      const tr = f === "estoura" ? 0 : this.tf;
      const z = 1 + 0.55 * Math.exp(-6 * tr) * Math.cos(14 * tr);
      const lado = Math.round(LADO * z);
      const x = Math.round(CX - lado / 2), y = Math.round(CY - lado / 2) + flutua;
      this.anelNoChao(ctx, prende(tr / 0.8));
      const novo = this.arte(this.to);
      bichoNoPalco(ctx, novo, x, y, lado, lado);
      const branco = Math.max(0, 1 - tr * 1.6);
      if (novo && branco > 0) {
        ctx.globalAlpha = branco;
        ctx.drawImage(Assets.silhueta(novo), x, y, lado, lado);
        ctx.globalAlpha = 1;
      }
      this.simbolo(ctx, CX, Math.max(12, y - 6), prende((tr - 0.2) / 0.5));
    }
    for (const c of this.cacos) {
      ctx.save();
      ctx.globalAlpha = prende(c.vida);
      ctx.translate(c.x, c.y);
      ctx.rotate(c.ang);
      ctx.fillStyle = c.cor;
      ctx.beginPath(); ctx.moveTo(0, -c.tam); ctx.lineTo(c.tam * 0.7, c.tam * 0.6); ctx.lineTo(-c.tam * 0.6, c.tam * 0.4); ctx.fill();
      ctx.restore();
    }
    for (const b of this.brilhos) {
      ctx.fillStyle = b.cor;
      ctx.globalAlpha = prende(b.vida);
      ctx.fillRect(Math.round(b.x) - 1, Math.round(b.y), 3, 1);
      ctx.fillRect(Math.round(b.x), Math.round(b.y) - 1, 1, 3);
    }
    ctx.globalAlpha = 1;
    ctx.restore();
    ctx.restore();

    if (this.flash > 0) fade(ctx, this.flash, "#ffffff");
    this.dlg.render(ctx);
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }

  /** raios de luz girando atrás de tudo, mais fortes quanto mais aceso */
  raiosDeFundo(ctx, forca) {
    if (forca <= 0.05) return;
    ctx.save();
    ctx.translate(CX, CY);
    ctx.rotate(this.t * 0.4);
    for (let j = 0; j < 12; j++) {
      ctx.rotate(Math.PI / 6);
      ctx.fillStyle = ARCO[j % ARCO.length];
      ctx.globalAlpha = 0.08 + 0.12 * forca;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(200, -12); ctx.lineTo(200, 12); ctx.fill();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  /** uma pedra (a do anel ou a mega): a bolinha com o redemoinho de arco-íris */
  pedra(ctx, x, y, r, brilho) {
    if (brilho <= 0) return;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3);
    g.addColorStop(0, `rgba(255,255,255,${0.7 * brilho})`);
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - r * 3, y - r * 3, r * 6, r * 6);
    for (let j = 0; j < 4; j++) {
      ctx.strokeStyle = ARCO[(j * 2 + Math.floor(this.t * 6)) % ARCO.length];
      ctx.globalAlpha = brilho;
      ctx.beginPath();
      ctx.arc(x, y, r - j * 0.8, this.t * 5 + j, this.t * 5 + j + 2.4);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  /** o raio que liga a pedra-chave à pedra mega: sete fios, um de cada cor */
  raioDasPedras(ctx, forca) {
    if (forca <= 0) return;
    const ate = this.fase === "chamado" ? suave(prende(this.k * 1.6)) : 1;
    const ax = PEDRA_CHAVE.x, ay = PEDRA_CHAVE.y, bx = ax + (CX - ax) * ate, by = ay + (CY + 6 - ay) * ate;
    ARCO.forEach((cor, j) => {
      ctx.strokeStyle = cor;
      ctx.globalAlpha = 0.8 * forca;
      ctx.lineWidth = 1;
      ctx.beginPath();
      const d = (j - 3) * 1.2;
      ctx.moveTo(ax + d, ay);
      const mx = (ax + bx) / 2 + Math.sin(this.t * 9 + j) * 6, my = (ay + by) / 2 + Math.cos(this.t * 7 + j) * 6;
      ctx.quadraticCurveTo(mx + d, my, bx + d * 0.3, by);
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
  }

  /** o casulo de cristal: as facetas com borda de arco-íris e o miolo claro */
  desenhaCasulo(ctx, k) {
    if (k <= 0) return;
    const pts = this.casulo.map((p) => ({ x: CX + (p.x - CX) * (0.4 + 0.6 * k), y: CY + (p.y - CY) * (0.4 + 0.6 * k) }));
    ctx.globalAlpha = 0.35 * k;
    ctx.fillStyle = "#e8f6ff";
    ctx.beginPath();
    pts.forEach((p, j) => (j ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = k;
    for (let j = 0; j < pts.length; j++) {
      const a = pts[j], b = pts[(j + 1) % pts.length];
      ctx.strokeStyle = ARCO[(j + Math.floor(this.t * 8)) % ARCO.length];
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      // as arestas de dentro: do vértice pro meio, dando cara de cristal facetado
      ctx.strokeStyle = "rgba(255,255,255,.45)";
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(CX, CY); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  /** o anel de arco-íris que abre no chão quando a forma MEGA aparece */
  anelNoChao(ctx, k) {
    if (k <= 0 || k >= 1) return;
    ARCO.forEach((cor, j) => {
      ctx.strokeStyle = cor;
      ctx.globalAlpha = (1 - k) * 0.9;
      ctx.beginPath();
      ctx.ellipse(CX, CY + LADO / 2 - 4, 10 + k * 90 + j * 2, (10 + k * 90 + j * 2) * 0.3, 0, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
  }

  /** O SÍMBOLO DA MEGA: um círculo com a dupla hélice dentro, nas cores do
   *  arco-íris, girando devagar em cima da cabeça */
  simbolo(ctx, x, y, k) {
    if (k <= 0) return;
    const r = 7 * (0.6 + 0.4 * k);
    ctx.save();
    ctx.globalAlpha = k;
    ctx.translate(x, y);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 2.4);
    g.addColorStop(0, "rgba(255,255,255,.55)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(-r * 2.4, -r * 2.4, r * 4.8, r * 4.8);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#ff8a3d";
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 1;
    // a hélice: duas curvas em S cruzadas, uma rosa e uma azul
    for (const [cor, s] of [["#ff6bd6", 1], ["#4fc3ff", -1]]) {
      ctx.strokeStyle = cor;
      ctx.beginPath();
      for (let j = 0; j <= 12; j++) {
        const t = j / 12, yy = -r + 2 * r * t, xx = s * Math.sin(t * Math.PI * 2 + this.t * 3) * r * 0.55;
        j ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy);
      }
      ctx.stroke();
    }
    ctx.restore();
  }
}

/** Toca a cutscene por cima da cena atual e resolve quando ela fecha. Com as
 *  animações de batalha desligadas (OPÇÕES), não toca nada. */
export function tocarMega(game, mon, to) {
  if (!(DB.CONFIG?.battleAnim ?? 1) || !mon || !DB.SPECIES[to]) return Promise.resolve();
  return new Promise((res) => game.scenes.push(new MegaScene(), { mon, to, aoFim: res }));
}
