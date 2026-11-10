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
import { tocarGrito } from "../systems/gritos.js";
import { Dialogue } from "../systems/dialogue.js";
import { fade } from "../core/gfx.js";
import { isoLigado, palcoIso, bichoNoPalco } from "../core/isometrico.js";

const W = 240, H = 160;
const CX = W / 2, CY = 60;           // o meio do bicho
const LADO = 64;
const PEDRA_CHAVE = { x: 34, y: 132 }; // o anel, no canto de baixo (é a mão de quem joga)
const FASES_CERTA = [["chamado", 1.0], ["casulo", 1.5], ["racha", 0.9], ["estoura", 0.25], ["revela", 1.9]];
// A MEGA COM A PEDRA ERRADA (a MEGA EMPRESTADA, roteiro do CAIO, nov/2026):
// raios roxos PUXAM a pedra, ele ABSORVE, fica DESCONTROLADO e SURTA, CONGELA,
// uma CÚPULA DE PEDRA sobe do chão, vai RACHANDO e BRILHANDO... e MEGA!
const FASES_ERRADA = [["puxa", 1.5], ["absorve", 0.7], ["surta", 2.2], ["congela", 0.8], ["cupula", 1.1],
                      ["trinca", 1.6], ["estoura", 0.25], ["revela", 2.0]];
const ROXO = ["#b14dff", "#7a2cff", "#e08cff", "#5a12b0", "#ff5af0"];
const ARCO = ["#ff5a5a", "#ffa63d", "#ffe14d", "#5ee87a", "#4fc3ff", "#8f6bff", "#e66bff"];

const prende = (t) => Math.max(0, Math.min(1, t));
const suave = (t) => t * t * (3 - 2 * t);

export class MegaScene {
  /** args: { mon, to, aoFim?, sozinha?, frase? } */
  enter(args = {}) {
    this.mon = args.mon;
    this.to = args.to;
    // a pedra é de OUTRO bicho: a cena muda inteira
    this.errada = !!DB.SPECIES[this.to]?.megaEmprestada;
    this.fases = this.errada ? FASES_ERRADA : FASES_CERTA;
    this.megaDaPedra = DB.SPECIES[this.to]?.megaEmprestada || null;
    if (this.megaDaPedra) Assets.mon(this.megaDaPedra, this.mon.seed);
    this.raios = [];
    this.pedras = [];
    this.pedraX = CX + 70; this.pedraY = CY - 10;
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
    // O SOM DA MEGA EVOLUÇÃO (pedido do CAIO, nov/2026), assets/sons/mega-evolucao.mp3
    // (do MyInstants, "MEGA EVOLUTION"). Sem o arquivo, as notas de antes.
    this.somMega = this.errada ? null : Audio2.somEditado("mega-evolucao", 0.9);
    if (this.errada) { Audio2.tone(110, 0.6, "sawtooth", 0.35); Audio2.tone(98, 0.8, "square", 0.25); }
    else if (!this.somMega) { Audio2.tone(330, 0.3, "sine", 0.4); Audio2.tone(494, 0.4, "sine", 0.35); }
  }

  get fase() { return this.fases[this.i]?.[0] || "fim"; }
  get duracao() { return this.fases[this.i]?.[1] || 0; }
  get k() { return prende(this.tf / (this.duracao || 1)); }

  /** a arte do bicho, já com a cor dele (shiny, luminoso) */
  arte(id) {
    const vivo = Assets.vivo({ ...this.mon, species: id });   // animado, quando tem
    if (vivo) return vivo;
    const img = Assets.mon(id, this.mon.seed);
    return img ? Assets.comCor(img, { ...this.mon, species: id }) : null;
  }

  proxima() {
    this.i++;
    this.tf = 0;
    const f = this.fase;
    if (f === "casulo" && !this.somMega) { Audio2.tone(392, 0.25, "triangle", 0.4); Audio2.tone(523, 0.3, "triangle", 0.4); }
    if (f === "racha" && !this.somMega) Audio2.tone(180, 0.6, "sawtooth", 0.25);
    if (this.errada) this.entraErrada(f);
    if (f === "estoura") {
      this.flash = 1;
      this.tremor = 5;
      if (!this.somMega) { Audio2.tone(880, 0.12, "square", 0.5); Audio2.tone(1320, 0.2, "square", 0.45); }
      // os cacos: cada faceta do casulo vira três pedaços voando pra fora
      // na pedra errada os cacos são da CÚPULA: pedra cinza com brilho roxo
      const cores = this.errada ? ["#5a5560", "#7d7684", "#3c3842", "#b14dff", "#9b94a3"] : ARCO;
      for (let k = 0; k < (this.errada ? 34 : 24); k++) {
        const a = Math.random() * Math.PI * 2, v = 60 + Math.random() * 120;
        this.cacos.push({ x: CX, y: CY, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 30, gira: (Math.random() - 0.5) * 12,
                          ang: a, tam: 3 + Math.random() * 5, cor: cores[k % cores.length], vida: 1 });
      }
    }
    // a MEGA aparece e GRITA: a voz dela batendo numa câmara de metal (Audio2, cadeiaMetal)
    if (f === "revela") {
      if (this.errada) { Audio2.tone(196, 0.4, "sawtooth", 0.4); Audio2.tone(147, 0.6, "square", 0.3); }
      else if (!this.somMega) Audio2.heal();
      tocarGrito({ ...this.mon, species: this.to }, this.errada ? 0.8 : 1, "metal");
    }
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
    if (this.errada) this.updateErrada(dt, f);
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
    if (this.errada) return this.renderErrada(ctx);
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

  // ---------------------------------------------- A PEDRA ERRADA

  entraErrada(f) {
    if (f === "absorve") { this.flash = 0.5; Audio2.tone(70, 0.5, "sawtooth", 0.5); Audio2.glitch(); }
    if (f === "surta") { tocarGrito(this.mon); }   // o grito dele mesmo, sem distorcer (era sinistro demais)
    if (f === "congela") {                       // tudo para: só um "tinc" no silêncio
      this.tremor = 0; this.raios = [];
      Audio2.tone(2400, 0.08, "square", 0.25); Audio2.tone(3200, 0.05, "square", 0.15);
      this.congelado = { dx: this.surtoDx || 0, dy: this.surtoDy || 0, qual: this.surtoQual || 0 };
      // a FOTO do quadro de agora: congelado, ele PARA de animar (pedido do CAIO)
      const qual = this.congelado.qual === 1 && this.megaDaPedra ? this.megaDaPedra : this.mon.species;
      this.congelado.img = this.foto(this.arte(qual));
    }
    if (f === "cupula") { Audio2.tone(60, 1.0, "sawtooth", 0.45); Audio2.tone(45, 1.1, "square", 0.3); }
    if (f === "trinca") Audio2.tone(150, 1.4, "sawtooth", 0.25);
  }

  /** um raio quebrado (zigue-zague) de A até B, sorteado de novo a cada quadro */
  raioRoxo(ax, ay, bx, by, partes = 7, abre = 7) {
    const pts = [[ax, ay]];
    for (let j = 1; j < partes; j++) {
      const t = j / partes;
      pts.push([ax + (bx - ax) * t + (Math.random() - 0.5) * abre, ay + (by - ay) * t + (Math.random() - 0.5) * abre]);
    }
    pts.push([bx, by]);
    return { pts, cor: ROXO[Math.floor(Math.random() * ROXO.length)], vida: 0.12 + Math.random() * 0.1 };
  }

  updateErrada(dt, f) {
    const k = this.k;
    // PUXA: a pedra treme, não quer ir; os raios agarram e arrastam até o peito
    if (f === "puxa") {
      const puxao = suave(prende((k - 0.35) / 0.65));
      this.pedraX = CX + 70 - (70 * puxao) + (Math.random() - 0.5) * (4 - 3 * puxao);
      this.pedraY = CY - 10 + 16 * puxao + (Math.random() - 0.5) * 3;
      if (Math.random() < dt * 30) this.raios.push(this.raioRoxo(CX, CY + 6, this.pedraX, this.pedraY, 8, 10));
      if (Math.random() < dt * 8) Audio2.tone(900 + Math.random() * 900, 0.03, "square", 0.12);
    }
    // ABSORVE: a pedra entra e some no peito; os raios estouram pra fora
    if (f === "absorve" && Math.random() < dt * 40) {
      const a = Math.random() * Math.PI * 2, r = 30 + Math.random() * 40;
      this.raios.push(this.raioRoxo(CX, CY + 6, CX + Math.cos(a) * r, CY + Math.sin(a) * r, 6, 9));
    }
    // SURTA: se debate, pisca de vez em quando a cara da mega da pedra, solta
    // raios. O CAIO achou sinistro demais: agora é um surto mais leve, de desenho
    // animado — trancos curtos, quase sem giro e sem chiado.
    // ...mas sem graça também não: ele QUICA (amassa quando cai), dá um GIRO
    // inteiro no meio, se joga pros lados e solta faísca e estrelinha.
    if (f === "surta") {
      const forca = 0.5 + 0.5 * k;
      const fase = (this.tf * (9 + 5 * k)) % 1;   // um pulo: sobe e desce
      const alto = Math.sin(fase * Math.PI);
      this.surtoPulo = -Math.round(alto * (8 + 8 * k));
      const chao = alto < 0.25 ? 1 - alto / 0.25 : 0;   // perto do chão: amassa
      this.surtoSx = 1 + 0.22 * chao - 0.08 * alto;
      this.surtoSy = 1 - 0.22 * chao + 0.12 * alto;
      if (this._faseVelha != null && fase < this._faseVelha) {   // caiu no chão: boing!
        Audio2.tone(220 + 500 * k + Math.random() * 60, 0.07, "square", 0.12);
        this.surtoDx = Math.round((Math.random() - 0.5) * 14 * forca);
        for (let j = 0; j < 4; j++) this.brilhos.push({ x: CX + this.surtoDx + (Math.random() - 0.5) * 40, y: CY + 30,
          vida: 1, cor: Math.random() < 0.5 ? "#ffe14d" : "#e08cff", vy: -40 - Math.random() * 50, vx: (Math.random() - 0.5) * 80 });
      }
      this._faseVelha = fase;
      // o GIRO: no meio do surto ele rodopia uma volta inteira
      this.surtoGiro = k > 0.42 && k < 0.58 ? ((k - 0.42) / 0.16) * Math.PI * 2 : Math.sin(this.t * 14) * 0.12 * forca;
      if (k > 0.42 && k < 0.44 && !this._girou) { this._girou = true; Audio2.tone(400, 0.25, "triangle", 0.2); Audio2.tone(800, 0.25, "triangle", 0.15); }
      this.surtoDy = this.surtoPulo;
      this.surtoEscala = 1;
      // PISCA entre ele e a MEGA DA PEDRA (a dona dela), cada vez mais rápido
      // (pedido do CAIO: "piscar mais")
      if (Math.random() < dt * (8 + 16 * k)) this.surtoQual = this.surtoQual ? 0 : 1;
      this.tremor = Math.max(this.tremor, 1 + 1.5 * k);
      if (Math.random() < dt * 18) {
        const a = Math.random() * Math.PI * 2, r = 26 + Math.random() * 50;
        this.raios.push(this.raioRoxo(CX + (this.surtoDx || 0), CY, CX + Math.cos(a) * r, CY + Math.sin(a) * r, 6, 10));
      }
    }
    // TRINCA: rachaduras novas na cúpula, cada vez mais rápido
    if (f === "trinca" && Math.random() < dt * (6 + 22 * k)) {
      const x0 = CX + (Math.random() - 0.5) * 56, y0 = CY - 6 + Math.random() * 34;
      const pts = [[x0, y0]];
      let x = x0, y = y0;
      const a = Math.random() * Math.PI * 2;
      for (let j = 0; j < 3 + Math.floor(Math.random() * 3); j++) {
        x += Math.cos(a + (Math.random() - 0.5) * 1.4) * 6;
        y += Math.sin(a + (Math.random() - 0.5) * 1.4) * 6;
        pts.push([x, y]);
      }
      this.trincas.push(pts);
      this.tremor = Math.max(this.tremor, 1 + 3 * k);
      Audio2.tone(300 + Math.random() * 300, 0.04, "square", 0.18);
    }
    for (const r of this.raios) r.vida -= dt;
    this.raios = this.raios.filter((r) => r.vida > 0);
    // as faíscas que pulam caem (quem gasta a vida delas é o update de sempre)
    for (const b of this.brilhos) if (b.vy != null) { b.x += b.vx * dt; b.y += b.vy * dt; b.vy += 120 * dt; }
  }

  /** A CÚPULA DE PEDRA: sobe do chão (k de 0 a 1) e fecha em volta dele. Os
   *  blocos são fileiras de pedra com junta escura, cada um com seu tom. */
  cupula(ctx, k, luz = 0) {
    if (k <= 0) return;
    const base = CY + LADO / 2 - 2, rx = 40, ry = 54;
    const topo = base - ry * suave(k);
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(CX, base, rx, ry, 0, Math.PI, 0);
    ctx.lineTo(CX + rx, base); ctx.closePath();
    ctx.clip();
    const tons = ["#5a5560", "#6b6572", "#4a4650", "#7d7684", "#55505b"];
    for (let y = Math.floor(topo); y < base; y += 6) {
      const fila = Math.floor((base - y) / 6), desvio = fila % 2 ? 5 : 0;
      for (let x = CX - rx - 10 + desvio; x < CX + rx; x += 10) {
        ctx.fillStyle = tons[(fila * 3 + Math.floor(x / 10)) % tons.length];
        ctx.fillRect(Math.round(x), Math.round(y), 9, 5);
        ctx.fillStyle = "rgba(255,255,255,.12)";
        ctx.fillRect(Math.round(x), Math.round(y), 9, 1);
      }
    }
    ctx.fillStyle = "#26232b";                    // as juntas
    for (let y = Math.floor(topo); y < base; y += 6) ctx.fillRect(CX - rx, Math.round(y) + 5, rx * 2, 1);
    if (luz > 0) {                                // a luz roxa vazando por dentro
      ctx.globalAlpha = luz * (0.6 + 0.4 * Math.sin(this.t * 30));
      ctx.fillStyle = "#b14dff";
      ctx.fillRect(CX - rx, topo, rx * 2, base - topo);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
    // o contorno da cúpula
    ctx.strokeStyle = "#141218";
    ctx.beginPath();
    ctx.ellipse(CX, base, rx, ry * suave(k), 0, Math.PI, 0);
    ctx.stroke();
    // a poeira levantando no pé dela
    if (this.fase === "cupula") {
      ctx.fillStyle = "rgba(160,150,170,.5)";
      for (let j = 0; j < 10; j++) ctx.fillRect(CX - rx - 6 + Math.random() * (rx * 2 + 12), base - Math.random() * 6, 2, 2);
    }
  }

  renderErrada(ctx) {
    const f = this.fase, k = this.k;
    // o fundo: preto com um roxo doente pulsando (no CONGELA fica azul parado)
    const g = ctx.createRadialGradient(CX, CY, 6, CX, CY, 170);
    const pulsa = f === "surta" ? 0.45 + 0.2 * Math.sin(this.t * 8) : f === "trinca" ? 0.4 + 0.6 * k : 0.3;
    const gelo = f === "congela" || f === "cupula";
    g.addColorStop(0, gelo ? "#2a3550" : `rgb(${80 + 90 * pulsa | 0},${20 + 10 * pulsa | 0},${110 + 90 * pulsa | 0})`);
    g.addColorStop(1, "#05030c");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    if (this.tremor > 0 && !gelo) ctx.translate(Math.round((Math.random() - 0.5) * this.tremor), Math.round((Math.random() - 0.5) * this.tremor));
    const flutua = gelo ? 0 : Math.round(Math.sin(this.t * 2.4) * 2);
    const x0 = Math.round(CX - LADO / 2), y0 = Math.round(CY - LADO / 2) + flutua;
    const meu = this.arte(this.mon.species);

    if (f === "puxa" || f === "absorve") {
      this.reto(ctx, meu, x0, y0, LADO, LADO);
      if (f === "absorve") {                     // ele fica roxo por dentro
        ctx.globalAlpha = 0.5 * Math.sin(k * Math.PI);
        ctx.drawImage(this.tingido(meu, "#b14dff"), x0, y0, LADO, LADO);
        ctx.globalAlpha = 1;
      }
      const some = f === "absorve" ? 1 - suave(k) : 1;
      const px = f === "absorve" ? CX : this.pedraX, py = f === "absorve" ? CY + 6 : this.pedraY;
      this.pedra(ctx, px, py, 4 * some + 0.5, some, ROXO);
    } else if (f === "surta" || f === "congela") {
      // DESCONTROLADO: tranco, giro, cresce e encolhe, troca de cara com a mega da pedra
      const c = f === "congela" ? this.congelado : { dx: this.surtoDx || 0, dy: this.surtoDy || 0, qual: this.surtoQual || 0 };
      const outra = this.megaDaPedra ? this.arte(this.megaDaPedra) : null;
      const img = f === "congela" && c.img ? c.img : c.qual === 1 && outra ? outra : c.qual === 2 ? this.arte(this.to) : meu;
      const esc = f === "congela" ? 1 : this.surtoEscala || 1;
      const lado = Math.round(LADO * esc);
      ctx.save();
      ctx.translate(CX + c.dx, CY + c.dy + flutua);
      if (f === "surta") { ctx.rotate(this.surtoGiro || 0); ctx.scale(this.surtoSx || 1, this.surtoSy || 1); }
      if (img) {
        if (f === "surta") {                      // um brilho roxo em volta, pulsando (sem as cores separadas)
          ctx.globalAlpha = 0.35 + 0.15 * Math.sin(this.t * 10);
          for (const [ox, oy] of [[-1, 0], [1, 0], [0, -1], [0, 1]])
            ctx.drawImage(this.tingido(img, "#c77dff"), -lado / 2 + ox * 2, -lado / 2 + oy * 2, lado, lado);
          ctx.globalAlpha = 1;
        }
        // em fatias: de vez em quando uma faixa escorrega um pouquinho
        for (let y = 0; y < img.height; y += 4) {
          const d = f === "surta" && Math.random() < 0.05 ? (Math.random() - 0.5) * 4 : 0;
          const fy = (y / img.height) * lado;
          ctx.drawImage(img, 0, y, img.width, 4, -lado / 2 + d, -lado / 2 + fy, lado, (4 / img.height) * lado + 0.5);
        }
        if (f === "congela") {                    // CONGELA: azul-gelo por cima, parado
          ctx.globalAlpha = 0.55;
          ctx.drawImage(this.tingido(img, "#bfe6ff"), -lado / 2, -lado / 2, lado, lado);
          ctx.globalAlpha = 1;
        }
      }
      ctx.restore();
    } else if (f === "cupula" || f === "trinca") {
      if (f === "cupula") {
        const parado = this.congelado?.img || meu;   // a foto do congela: continua parado
        this.reto(ctx, parado, x0 + (this.congelado?.dx || 0), y0 + (this.congelado?.dy || 0), LADO, LADO);
        ctx.globalAlpha = 0.55;
        if (parado) ctx.drawImage(this.tingido(parado, "#bfe6ff"), x0 + (this.congelado?.dx || 0), y0 + (this.congelado?.dy || 0), LADO, LADO);
        ctx.globalAlpha = 1;
      }
      this.cupula(ctx, f === "cupula" ? k : 1, f === "trinca" ? 0.08 + 0.3 * k : 0);
      // as rachaduras: brilham roxo-branco, mais quanto mais perto de estourar
      for (const pts of this.trincas) {
        ctx.strokeStyle = Math.random() < 0.5 ? "#ffffff" : "#e08cff";
        ctx.lineWidth = 1 + (k > 0.7 ? 1 : 0);
        ctx.beginPath();
        pts.forEach(([x, y], j) => (j ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        ctx.stroke();
      }
      ctx.lineWidth = 1;
      if (f === "trinca" && k > 0.6) {              // raios de luz saindo pelas trincas
        ctx.globalAlpha = (k - 0.6) / 0.4;
        for (const pts of this.trincas.slice(-12)) {
          const [x, y] = pts[pts.length - 1];
          const a = Math.atan2(y - CY, x - CX);
          ctx.fillStyle = "#f3d9ff";
          ctx.beginPath(); ctx.moveTo(x, y);
          ctx.lineTo(x + Math.cos(a - 0.08) * 90, y + Math.sin(a - 0.08) * 90);
          ctx.lineTo(x + Math.cos(a + 0.08) * 90, y + Math.sin(a + 0.08) * 90);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
    } else {
      // MEGA! a mistura, com soco de zoom e o símbolo roxo
      const tr = f === "estoura" ? 0 : this.tf;
      const z = 1 + 0.6 * Math.exp(-6 * tr) * Math.cos(14 * tr);
      const lado = Math.round(LADO * z);
      const x = Math.round(CX - lado / 2), y = Math.round(CY - lado / 2) + flutua;
      const novo = this.arte(this.to);
      this.reto(ctx, novo, x, y, lado, lado);
      const branco = Math.max(0, 1 - tr * 1.6);
      if (novo && branco > 0) {
        ctx.globalAlpha = branco;
        ctx.drawImage(this.tingido(novo, "#e08cff"), x, y, lado, lado);
        ctx.globalAlpha = 1;
      }
      if (Math.random() < 0.3) this.raios.push(this.raioRoxo(CX + (Math.random() - 0.5) * 40, CY + (Math.random() - 0.5) * 40,
        CX + (Math.random() - 0.5) * 70, CY + (Math.random() - 0.5) * 70, 4, 6));
      this.simbolo(ctx, CX, Math.max(12, y - 6), prende((tr - 0.2) / 0.5));
    }
    // as faíscas e estrelinhas que pulam dele no surto
    for (const b of this.brilhos) {
      ctx.fillStyle = b.cor;
      ctx.globalAlpha = prende(b.vida);
      ctx.fillRect(Math.round(b.x) - 1, Math.round(b.y), 3, 1);
      ctx.fillRect(Math.round(b.x), Math.round(b.y) - 1, 1, 3);
    }
    ctx.globalAlpha = 1;
    // os raios roxos por cima de tudo
    for (const r of this.raios) {
      ctx.strokeStyle = r.cor;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      r.pts.forEach(([x, y], j) => (j ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    for (const c of this.cacos) {
      ctx.save();
      ctx.globalAlpha = prende(c.vida);
      ctx.translate(c.x, c.y);
      ctx.rotate(c.ang);
      ctx.fillStyle = c.cor;
      ctx.fillRect(-c.tam / 2, -c.tam / 2, c.tam, c.tam * 0.7);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
    if (this.flash > 0) fade(ctx, this.flash, this.fase === "estoura" ? "#ffffff" : "#b14dff");
    this.dlg.render(ctx);
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }

  /** a cena da pedra errada é sempre RETA, mesmo com o ISOMÉTRICO ligado nas
   *  OPÇÕES: no surto o bicho é desenhado em fatias e o 3D só pegava em umas
   *  partes da cena (o CAIO estranhou) */
  reto(ctx, img, x, y, w, h) { if (img) ctx.drawImage(img, x, y, w, h); }

  /** uma cópia do quadro de agora (o animado troca de quadro sozinho) */
  foto(img) {
    if (!img) return null;
    const cv = document.createElement("canvas");
    cv.width = img.width; cv.height = img.height;
    cv.getContext("2d").drawImage(img, 0, 0);
    return cv;
  }

  /** o desenho pintado de uma cor só (guardado por imagem e cor) */
  tingido(img, cor) {
    if (!img) return img;
    this._tinge ||= new WeakMap();   // o quadro animado muda: o velho é solto sozinho
    let m = this._tinge.get(img);
    if (!m) this._tinge.set(img, (m = {}));
    if (m[cor]) return m[cor];
    const cv = document.createElement("canvas");
    cv.width = img.width; cv.height = img.height;
    const c = cv.getContext("2d");
    c.drawImage(img, 0, 0);
    c.globalCompositeOperation = "source-atop";
    c.fillStyle = cor;
    c.fillRect(0, 0, cv.width, cv.height);
    return (m[cor] = cv);
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
  pedra(ctx, x, y, r, brilho, cores = ARCO) {
    if (brilho <= 0) return;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3);
    g.addColorStop(0, `rgba(255,255,255,${0.7 * brilho})`);
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - r * 3, y - r * 3, r * 6, r * 6);
    for (let j = 0; j < 4; j++) {
      ctx.strokeStyle = cores[(j * 2 + Math.floor(this.t * 6)) % cores.length];
      ctx.globalAlpha = brilho;
      const raio = r - j * 0.8;
      if (raio <= 0) break;                       // a pedra sumindo (a MEGA ERRADA): o anel de dentro acaba antes
      ctx.beginPath();
      ctx.arc(x, y, raio, this.t * 5 + j, this.t * 5 + j + 2.4);
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
