// A CUTSCENE DA TROCA (com NPC, src/data/trocas.js). A troca no save já foi
// feita antes de a cena abrir; aqui é só o filme:
//
//   1. os dois Pokémon na tela: o SEU à direita, o DELE à esquerda, cada um grita
//   2. os dois racham de luz e se DESFAZEM nos pixels deles
//   3. os pixels rodopiam pro meio e se misturam num SPRITE BIZARRO — os dois
//      bichos encavalados um no outro (o dele espelhado), tremendo e piscando
//   4. BUUM! clarão, onda de choque, a tela treme
//   5. os pixels se separam: o que você RECEBEU monta à DIREITA (o seu lado) e
//      o seu antigo monta à ESQUERDA (o lado de quem trocou)
//   6. o novo dá um soco de zoom, grita, e a fanfarra toca — e se for SHINY,
//      chove estrela dourada
//
// `onDone` roda quando a cena fecha (o NPC agradece depois disso).
import { Assets, makeCanvas } from "../core/assets.js";
import { Audio2 } from "../core/audio.js";
import { Glitch } from "../systems/glitchfx.js";
import { Dialogue } from "../systems/dialogue.js";
import { tocarGrito } from "../systems/gritos.js";
import { DB } from "../data/index.js";
import { drawText, fade } from "../core/gfx.js";
import { isoLigado, palcoIso, cubosIso, bichoNoPalco } from "../core/isometrico.js";

const W = 240, H = 160;
const LADO = 64;
const CY = 64;
const ESQ = 64, DIR = 176, MEIO = 120;      // o centro de cada lado e o do meio
// as fases e quanto cada uma dura (s)
// casadas com MUSIC.troca (src/data/music.js): 150 bpm, 0,4 s por tempo — o
// BUUM cai no tempo 24 e a separação acaba no 29, quando entra a fanfarra
const FASES = [
  ["mostra", 1.6], ["racha", 1.6], ["desfaz", 1.6], ["mistura", 3.2], ["bizarro", 1.6],
  ["buum", 0.4], ["separa", 1.6], ["pronto", Infinity],
];
const suave = (t) => t * t * (3 - 2 * t);
const sai = (t) => 1 - (1 - t) * (1 - t);
const prende = (t) => Math.max(0, Math.min(1, t));

/** os pixels visíveis de um sprite, relativos ao centro dele, com a cor */
function pixelsDe(img) {
  if (!img) return [];
  const { cv, ctx } = makeCanvas(LADO, LADO);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, 0, 0, LADO, LADO);
  const d = ctx.getImageData(0, 0, LADO, LADO).data;
  const out = [];
  for (let y = 0; y < LADO; y++) {
    for (let x = 0; x < LADO; x++) {
      const i = (y * LADO + x) * 4;
      if (d[i + 3] > 128) out.push({ dx: x - LADO / 2, dy: y - LADO / 2, r: d[i], g: d[i + 1], b: d[i + 2] });
    }
  }
  return out;
}

export class TrocaNpcScene {
  enter({ meu, novo, dono, onDone }) {
    this.meu = meu;              // o seu, que vai embora
    this.novo = novo;            // o que você recebe
    this.dono = dono;
    this.onDone = onDone;
    this.dlg = new Dialogue();
    this.t = 0;
    this.i = 0;
    this.tf = 0;
    this.fadeA = 1;
    this.flash = 0;
    this.tremor = 0;
    this.pixels = [];
    this.faiscas = [];
    this.estrelas = [];
    this.aneis = [];
    const { cv, ctx } = makeCanvas(W, H);
    this.camada = cv;
    this.camadaCtx = ctx;
    this.camadaDados = ctx.createImageData(W, H);
    Assets.mon(meu.species, meu.seed);
    Assets.mon(novo.species, novo.seed);
    Audio2.stopLoop();
    if (DB.MUSIC?.troca) Audio2.playSong(DB.MUSIC.troca);
    tocarGrito(meu);
    setTimeout(() => tocarGrito(novo), 800);
  }

  exit() { Glitch.burst = 0; Audio2.stopLoop(); }

  get fase() { return FASES[this.i][0]; }
  get k() { return prende(this.tf / FASES[this.i][1]); }
  sprite(mon) { return Assets.comCor(Assets.mon(mon.species, mon.seed), mon); }

  /** monta os pixels: cada um sabe de onde sai, pra onde espalha, onde fica
   *  no BIZARRO e onde termina */
  montaPixels() {
    const lado = (mon, de, para, espelha) => pixelsDe(this.sprite(mon)).map((p) => {
      const ang = Math.atan2(p.dy, p.dx) + (Math.random() - 0.5) * 1.2;
      const dist = 14 + Math.random() * 34;
      return {
        r: p.r, g: p.g, b: p.b,
        ax: de + p.dx, ay: CY + p.dy,                                  // onde estava
        sx: de + p.dx + Math.cos(ang) * dist, sy: CY + p.dy + Math.sin(ang) * dist * 0.8,  // espalhado
        mx: MEIO + (espelha ? -p.dx : p.dx), my: CY + p.dy,           // no BIZARRO
        fx: para + p.dx, fy: CY + p.dy,                                // onde termina
        atraso: Math.random() * 0.5, giro: (Math.random() < 0.5 ? -1 : 1) * (10 + Math.random() * 24),
        racha: Math.random(),
      };
    });
    // o seu: da direita, termina na esquerda; o dele: da esquerda, termina na direita (espelhado no bizarro)
    this.pixels = [...lado(this.meu, DIR, ESQ, false), ...lado(this.novo, ESQ, DIR, true)];
  }

  proxima() {
    this.i = Math.min(FASES.length - 1, this.i + 1);
    this.tf = 0;
    const f = this.fase;
    if (f === "racha") this.montaPixels();
    if (f === "desfaz") this.flash = 0.4;
    if (f === "bizarro") {
      // o bicho que não existe: um grito que é os dois ao mesmo tempo
      Audio2.grito({ s: [[400, 300, 300, "s", 30, 0.5], [600, 200, 500, "q", 45, 0.5], [3000, 300, 400, "n"]] });
      Glitch.hit(1);
    }
    if (f === "buum") this.buum();

    if (f === "pronto") this.revelar();
  }

  whoosh(a, b) { Audio2.grito({ s: [[a, b, 400, "n"]] }); }

  buum() {
    this.flash = 1;
    this.tremor = 8;
    this.aneis.push({ x: MEIO, y: CY, r: 6, a: 1, v: 280 }, { x: MEIO, y: CY, r: 2, a: 0.8, v: 170 });
    for (let k = 0; k < 70; k++) this.faiscas.push(this.faisca(MEIO, CY, 190));
    Glitch.hit(1.6);
    Audio2.noise(0.6, 1);
    Audio2.tone(70, 0.5, "sawtooth", 0.8);
  }

  revelar() {
    this.pixels = [];
    this.flash = 0.8;
    for (let k = 0; k < 40; k++) this.faiscas.push(this.faisca(DIR, CY, 140));
    tocarGrito(this.novo);
    if (DB.MUSIC?.troca_fanfarra) Audio2.playSong(DB.MUSIC.troca_fanfarra);
    else Audio2.heal();
    // a fanfarra acabou e a fala ainda está na tela: a festa da evolução
    setTimeout(() => { if (!this.saindo && DB.MUSIC?.evolucao_festa) Audio2.playSong(DB.MUSIC.evolucao_festa); }, 3000);
    if (this.novo.shiny || this.novo.luminoso) {
      [1568, 2093, 2637].forEach((f, k) => setTimeout(() => Audio2.tone(f, 0.12, "triangle", 0.5), 500 + k * 90));
      for (let k = 0; k < 24; k++) this.estrelas.push(this.estrela());
    }
    const nome = this.novo.nickname;
    const linhas = [`${this.dono} MANDOU ${nome}!`];
    if (this.novo.shiny) linhas.push(`OLHA A COR DELE! ${nome} É SHINY!`);
    linhas.push(`CUIDE BEM DE ${nome}!`);
    setTimeout(() => this.dlg.say(linhas, () => { this.saindo = true; }), 900);
  }

  faisca(x, y, v0) {
    const ang = Math.random() * Math.PI * 2, v = v0 * (0.3 + Math.random());
    const cores = ["255,255,255", "255,236,120", "120,220,255", "255,140,220"];
    return { x, y, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v, vida: 1,
             cor: cores[Math.floor(Math.random() * cores.length)], tam: Math.random() < 0.3 ? 2 : 1 };
  }

  estrela() {
    return { x: DIR - 40 + Math.random() * 80, y: -10 - Math.random() * 60, vy: 30 + Math.random() * 40, vida: 1, gira: Math.random() * 6 };
  }

  update(dt) {
    this.t += dt;
    this.tf += dt;
    this.dlg.update(dt);
    if (this.fadeA > 0 && !this.saindo) this.fadeA = Math.max(0, this.fadeA - dt * 3);
    if (this.saindo) {
      this.fadeA = Math.min(1, this.fadeA + dt * 2.5);
      if (this.fadeA >= 1) {
        Audio2.stopLoop();
        this.game.scenes.pop();
        this.onDone?.();
        return;
      }
    }
    if (this.tf >= FASES[this.i][1]) this.proxima();
    if (this.fase !== "buum") this.flash = Math.max(0, this.flash - dt * 2.2);
    this.tremor = this.fase === "bizarro" ? 1 + this.k * 3 : Math.max(0, this.tremor - dt * 14);
    if (this.fase === "bizarro" && Math.random() < dt * 4) Glitch.hit(0.3);
    for (const f of this.faiscas) {
      f.x += f.vx * dt; f.y += f.vy * dt;
      f.vx *= 1 - dt * 2; f.vy = f.vy * (1 - dt * 2) + 50 * dt;
      f.vida -= dt * 0.9;
    }
    this.faiscas = this.faiscas.filter((f) => f.vida > 0);
    for (const a of this.aneis) { a.r += a.v * dt; a.a -= dt * 1.4; }
    this.aneis = this.aneis.filter((a) => a.a > 0);
    for (const e of this.estrelas) { e.y += e.vy * dt; e.gira += dt * 6; if (e.y > H + 10) e.vida = 0; }
    this.estrelas = this.estrelas.filter((e) => e.vida > 0);
    if ((this.novo.shiny || this.novo.luminoso) && this.fase === "pronto" && Math.random() < dt * 6) this.estrelas.push(this.estrela());
  }

  // ------------------------------------------------------------ desenho
  fundo(ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#0a0620");
    g.addColorStop(1, "#1a0c3a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    const energia = { mistura: 0.6, bizarro: 1, buum: 1, separa: 0.7 }[this.fase] || 0.15;
    ctx.fillStyle = `rgba(120,90,255,${0.12 + 0.2 * energia})`;
    for (let y = 0; y < H; y += 8) {
      const off = (this.t * (20 + energia * 120) + y * 3) % 16;
      for (let x = -16; x < W; x += 16) ctx.fillRect(Math.round(x + off), y, 1, 1);
    }
    // o redemoinho atrás do bizarro
    if (this.fase === "mistura" || this.fase === "bizarro") {
      const n = 10, giro = this.t * (1 + energia * 3);
      ctx.fillStyle = `rgba(200,120,255,${0.1 + 0.12 * energia})`;
      for (let i = 0; i < n; i++) {
        const a = giro + (i / n) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(MEIO, CY);
        ctx.lineTo(MEIO + Math.cos(a - 0.12) * 160, CY + Math.sin(a - 0.12) * 160);
        ctx.lineTo(MEIO + Math.cos(a + 0.12) * 160, CY + Math.sin(a + 0.12) * 160);
        ctx.fill();
      }
    }
  }

  desenhaMon(ctx, mon, cx, escala = 1, branco = 0) {
    const img = this.sprite(mon);
    if (!img) return;
    const lado = Math.round(LADO * escala);
    const flutua = Math.round(Math.sin(this.t * 2.2 + cx) * 2);
    const x = Math.round(cx - lado / 2), y = Math.round(CY - lado / 2) + flutua;
    bichoNoPalco(ctx, img, x, y, lado, lado);
    if (branco > 0) {
      ctx.globalAlpha = Math.min(1, branco);
      ctx.drawImage(Assets.silhueta(img), x, y, lado, lado);
      ctx.globalAlpha = 1;
    }
  }

  /** os pixels onde estiverem agora, num ImageData com rastro */
  desenhaPixels(ctx) {
    const d = this.camadaDados.data;
    const f = this.fase, k = this.k;
    const rastro = f === "racha" ? 0 : 0.7;
    for (let i = 3; i < d.length; i += 4) if (d[i]) d[i] = d[i] * rastro;
    const cubos = this.baseIso ? [] : null;
    for (const p of this.pixels) {
      let x, y, branco = 0;
      if (f === "racha") {
        x = p.ax; y = p.ay;
        branco = p.racha < k * k ? 0.6 + 0.4 * Math.abs(Math.sin(this.t * 14 + p.racha * 9)) : 0;
      } else if (f === "desfaz") {
        const e = sai(prende((k * 1.2 - p.atraso * 0.4)));
        x = p.ax + (p.sx - p.ax) * e;
        y = p.ay + (p.sy - p.ay) * e + Math.sin(this.t * 6 + p.ax) * e;
        branco = 0.5 * (1 - e);
      } else if (f === "mistura") {
        // espiral pro meio, e assenta no lugar dele no BIZARRO
        const e = suave(prende((k - p.atraso * 0.5) / 0.75));
        const curva = Math.sin(Math.PI * e) * p.giro;
        const dx = p.mx - p.sx, dy = p.my - p.sy, len = Math.hypot(dx, dy) || 1;
        const bx = p.sx + dx * e - (dy / len) * curva, by = p.sy + dy * e + (dx / len) * curva;
        const giro = (1 - e) * (1 - e) * Math.PI * 1.4;
        const cs = Math.cos(giro), sn = Math.sin(giro);
        x = MEIO + (bx - MEIO) * cs - (by - CY) * sn;
        y = CY + (bx - MEIO) * sn + (by - CY) * cs;
      } else if (f === "bizarro") {
        // treme, e de vez em quando uma faixa inteira escorrega pro lado
        const faixa = Math.floor(p.my / 4);
        const escorrega = Math.sin(this.t * 23 + faixa * 1.7) > 0.86 ? Math.round(Math.sin(faixa * 7.1) * 6) : 0;
        x = p.mx + escorrega + (Math.random() - 0.5) * k * 2;
        y = p.my + (Math.random() - 0.5) * k * 2;
        branco = Math.random() < 0.04 * (1 + k * 3) ? 1 : 0;
      } else if (f === "buum") {
        x = p.mx; y = p.my; branco = 1;
      } else if (f === "separa") {
        // do meio, cada um pro seu lado, numa curva — e vai ganhando a cor de volta
        const e = suave(prende((k - p.atraso * 0.4) / 0.8));
        const curva = Math.sin(Math.PI * e) * p.giro * 1.4;
        const dx = p.fx - p.mx, dy = p.fy - p.my, len = Math.hypot(dx, dy) || 1;
        x = p.mx + dx * e - (dy / len) * curva;
        y = p.my + dy * e + (dx / len) * curva;
        branco = 1 - e;
      } else continue;
      if (cubos) { cubos.push([x, y, p.r + (255 - p.r) * branco, p.g + (255 - p.g) * branco, p.b + (255 - p.b) * branco]); continue; }
      const xi = Math.round(x), yi = Math.round(y);
      if (xi < 0 || yi < 0 || xi >= W || yi >= H) continue;
      const i = (yi * W + xi) * 4;
      d[i] = p.r + (255 - p.r) * branco;
      d[i + 1] = p.g + (255 - p.g) * branco;
      d[i + 2] = p.b + (255 - p.b) * branco;
      d[i + 3] = 255;
    }
    if (cubos) return cubosIso(ctx, cubos, this.baseIso, MEIO, CY + LADO / 2);
    this.camadaCtx.putImageData(this.camadaDados, 0, 0);
    ctx.drawImage(this.camada, 0, 0);
  }

  render(ctx) {
    ctx.save();
    if (this.tremor > 0) ctx.translate(Math.round((Math.random() - 0.5) * this.tremor), Math.round((Math.random() - 0.5) * this.tremor));
    this.fundo(ctx);
    const f = this.fase, k = this.k;
    // NO ISOMÉTRICO: o palco inclinado, sem chão (subido 12 px: o da direita
    // desce com a inclinação e encostaria na caixa de texto); os pixels viram cubinhos
    if (isoLigado()) {
      ctx.translate(0, -12);
      this.baseIso = ctx.getTransform();
      palcoIso(ctx, MEIO, CY + LADO / 2);
    } else this.baseIso = null;

    if (f === "mostra") {
      // os dois entram com zoom: o dele na esquerda, o seu na direita
      this.desenhaMon(ctx, this.novo, ESQ, suave(prende(k * 1.6)), 1 - k);
      this.desenhaMon(ctx, this.meu, DIR, suave(prende(k * 1.6)), 1 - k);
    } else if (f === "racha") {
      // o contorno de luz pulsando em volta dos dois enquanto racham
      for (const [mon, cx] of [[this.novo, ESQ], [this.meu, DIR]]) {
        const sil = Assets.silhueta(this.sprite(mon));
        if (!sil) continue;
        ctx.globalAlpha = k * (0.5 + 0.5 * Math.sin(this.t * 18));
        for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) ctx.drawImage(sil, cx - LADO / 2 + dx, CY - LADO / 2 + dy, LADO, LADO);
        ctx.globalAlpha = 1;
      }
      this.desenhaPixels(ctx);
    } else if (f === "pronto") {
      // o seu antigo à esquerda, quietinho; o novo à direita, com soco de zoom
      this.desenhaMon(ctx, this.meu, ESQ, 1, 0);
      const z = 1 + 0.5 * Math.exp(-6 * this.tf) * Math.cos(14 * this.tf);
      this.desenhaMon(ctx, this.novo, DIR, z, Math.max(0, 1 - this.tf * 1.6));
      const nome = this.novo.nickname;
      const nx = Math.round(DIR - nome.length * 3);
      drawText(ctx, nome, nx + 1, 105, "#000");
      drawText(ctx, nome, nx, 104, this.novo.shiny ? "#ffe060" : "#fff");
      const velho = this.meu.nickname;
      drawText(ctx, velho, Math.round(ESQ - velho.length * 3), 104, "#9080c0");
    } else {
      this.desenhaPixels(ctx);
    }

    for (const a of this.aneis) {
      ctx.strokeStyle = `rgba(255,255,255,${a.a})`;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(a.x, a.y, a.r, a.r * 0.8, 0, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.lineWidth = 1;
    for (const p of this.faiscas) {
      ctx.fillStyle = `rgba(${p.cor},${Math.min(1, p.vida * 1.4)})`;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), p.tam, p.tam);
    }
    for (const e of this.estrelas) {
      const s = 1 + Math.round(Math.abs(Math.sin(e.gira)) * 2);
      ctx.fillStyle = "#ffe060";
      const x = Math.round(e.x), y = Math.round(e.y);
      ctx.fillRect(x - s, y, s * 2 + 1, 1);
      ctx.fillRect(x, y - s, 1, s * 2 + 1);
    }
    ctx.restore();

    if (f !== "pronto") {
      const dx = f === "bizarro" || f === "buum" ? Math.round((Math.random() - 0.5) * 4) : 0;
      drawText(ctx, "TROCA", 8 + dx, 8, "#b8a0ff");
      drawText(ctx, `${this.dono}  ⇄  VOCÊ`, 8, 18, "#8070c0");
      if (f === "bizarro") drawText(ctx, "???", MEIO - 9 + dx, 104, "#ff80ff");
    }
    this.dlg.render(ctx);
    if (this.flash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${Math.min(1, this.flash)})`;
      ctx.fillRect(0, 0, W, H);
    }
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }
}
