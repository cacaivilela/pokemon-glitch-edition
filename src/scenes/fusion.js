// Tela do DECODIFICADOR DE GENOMA: a fusão e a separação acontecendo.
// FUNDIR (`renderDoido`): os dois se encaram com o sprite normal, se DESFAZEM
// nos pixels deles, os pixels rodam num redemoinho (com um brilho de cor de
// vez em quando) em cima de um caleidoscópio discreto, se juntam no desenho da
// fusão ficando brancos e tremendo — e BUUM, a fusão aparece. Já foi mais
// doido (tela invertendo, glitch, nome embaralhado): ficou bizarro demais.
// SEPARAR continua o filme simples: os dois saem pelos lados.
//
// A mecânica (o que vira o quê) está em src/systems/fusao.js; aqui só tem
// tempo, som e o que a tela mostra. Quem mexe na equipe é esta cena, no
// instante do clarão — antes disso nada foi gravado.
import { DB } from "../data/index.js";
import { Assets, makeCanvas } from "../core/assets.js";
import { tocarGrito, gritoDe } from "../systems/gritos.js";
import { Audio2 } from "../core/audio.js";
import { Glitch } from "../systems/glitchfx.js";
import { Dialogue } from "../systems/dialogue.js";
import { fundir, separar, partes } from "../systems/fusao.js";
import { guardar } from "../systems/box.js";
import { drawText, fade, PAL } from "../core/gfx.js";
import { isoLigado, palcoIso, cubosIso, bichoNoPalco } from "../core/isometrico.js";

const W = 240, H = 160;
const DUR = 1.5;            // quanto dura o encontro (ou a abertura)
const CENTRO = { x: 120, y: 62 };
const LADO = 64;            // tamanho do sprite na tela
const FITA = "0123456789ABCDEF";
// o filme doido da fusão: quando começa cada parte (s, desde o fim da fala).
// Casado com MUSIC.fusao (src/data/music.js): 32 tempos a 150 bpm, 0,4 s por
// tempo — o desfaz no tempo 4, o redemoinho no 8 (o tema), a mistura no 24, a
// carga no 28 e o BUUM no 32, no silêncio depois da caixa acelerando
const DOIDO = { desfaz: 1.6, ciranda: 3.2, mistura: 9.6, carrega: 11.2, buum: 12.8 };
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

/** h (0..360) -> [r,g,b] bem saturado, pro arco-íris dos pixels */
function arco(h) {
  const f = (n) => { const k = (n + h / 30) % 12; return 255 * (0.5 - 0.5 * Math.max(-1, Math.min(k - 3, 9 - k, 1))); };
  return [f(0), f(8), f(4)];
}

export class FusionScene {
  enter(args = {}) {
    const F = () => DB.STORY.fusao;
    this.modo = args.modo === "separar" ? "separar" : "fundir";
    this.dlg = new Dialogue();
    this.t = 0;
    this.k = 0;               // 0 = separados, 1 = juntos
    this.fase = "texto";
    this.flash = 0;
    this.fadeA = 1;
    this.fadeDir = -1;
    this.saindo = false;

    if (this.modo === "fundir") {
      this.cabeca = args.cabeca;
      this.corpo = args.corpo;
      this.fus = fundir(this.cabeca, this.corpo, args.variante || "");
      if (!this.fus) return void this.desistir(F().naoDaParaFundir);
      this.sp = DB.SPECIES[this.fus.species];
      this._esq = [this.cabeca.species, this.cabeca.seed];
      this._dir = [this.corpo.species, this.corpo.seed];
      this._meio = [this.fus.species, this.fus.seed];
      // já pede os três desenhos (o da ficha do jogador é um PNG que demora a
      // abrir: sem isto os pixels se juntariam na montagem automática)
      void [this.esq, this.dir, this.meio];
      this.nomes = [this.cabeca.nickname, this.corpo.nickname];
      this.dlg.say(F().fundindo, () => { this.fase = "doido"; this.td = 0; this.marcos = new Set(); });
    } else {
      this.mon = args.mon;
      const p = partes(this.mon?.species);
      this.partido = separar(this.mon);
      if (!p || !this.partido) return void this.desistir(F().naoDaParaFundir);
      this.sp = DB.SPECIES[this.mon.species];
      this.k = 1;
      this._esq = [p.cabeca, this.mon.seed];
      this._dir = [p.corpo, this.mon.seed];
      this._meio = [this.mon.species, this.mon.seed];
      this.nomes = this.partido.map((m) => m.nickname);
      this.dlg.say(F().separando, () => { this.fase = "andando"; });
    }
    Audio2.glitch();
  }

  // OS SPRITES SÃO PEDIDOS A CADA QUADRO. Guardar o `Assets.mon` da entrada
  // prendia a cena na ARTE PROVISÓRIA quando o PNG ainda não tinha chegado (os
  // bichos "nada a ver"); pedindo sempre, o desenho de verdade entra sozinho
  // assim que carrega — e a fusão remonta junto (o cache dela é por imagem).
  get esq() { return this._esq && Assets.mon(...this._esq); }
  get dir() { return this._dir && Assets.mon(...this._dir); }
  get meio() { return this._meio && Assets.mon(...this._meio); }

  /** deu ruim antes de começar (dados mudaram no meio): avisa e volta */
  desistir(msg) {
    this.fase = "erro";
    this.dlg.say(msg, () => { this.fadeDir = 1; this.saindo = true; });
  }

  exit() { Glitch.burst = 0; Audio2.stopLoop(); }

  update(dt) {
    this.t += dt;
    this.dlg.update(dt);
    if (this.fadeDir) {
      this.fadeA = Math.max(0, Math.min(1, this.fadeA + this.fadeDir * dt * 3));
      if (this.fadeDir < 0 && this.fadeA <= 0) this.fadeDir = 0;
    }
    if (this.saindo && this.fadeA >= 1) {
      this.saindo = false;
      this.game.scenes.pop();
      return;
    }
    if (this.flash > 0) this.flash = Math.max(0, this.flash - dt * 2.2);

    if (this.fase === "doido") this.atualizaDoido(dt);
    if (this.fase === "pronto") this.tp = (this.tp || 0) + dt;
    if (this.fase === "andando") {
      const passo = dt / DUR;
      const antes = this.k;
      this.k = this.modo === "fundir" ? Math.min(1, this.k + passo) : Math.max(0, this.k - passo);
      // a fita corre: um bip a cada oitavo do caminho, cada vez mais agudo
      if (Math.floor(antes * 8) !== Math.floor(this.k * 8)) {
        Audio2.tone(420 + Math.round(this.k * 660), 0.04, "square", 0.45);
        Glitch.hit(0.35);
      }
      if (this.modo === "fundir" ? this.k >= 1 : this.k <= 0) this.concluir();
    }
  }

  /** O clarão: é aqui que a equipe muda. */
  concluir() {
    this.fase = "pronto";
    this.flash = 1;
    Glitch.hit(1.8);
    Audio2.heal();
    const F = DB.STORY.fusao;
    const st = this.game.state;
    const msgs = [];

    if (this.modo === "fundir") {
      const i = st.party.indexOf(this.cabeca);
      const j = st.party.indexOf(this.corpo);
      const lugar = Math.min(i, j);
      st.party.splice(Math.max(i, j), 1);
      st.party.splice(lugar, 1);
      st.party.splice(lugar, 0, this.fus);
      msgs.push(F.fundiu
        .replace("{CABECA}", this.nomes[0]).replace("{CORPO}", this.nomes[1])
        .replace("{NOME}", this.fus.nickname));
      // o brilho de um passou pro outro: vale dizer, porque muda os dois pra sempre
      if (this.fus.brilhouNaFusao) msgs.push(F.brilhoPegou);
    } else {
      const [cabeca, corpo] = this.partido;
      const i = st.party.indexOf(this.mon);
      st.party.splice(i, 1, cabeca);
      msgs.push(F.separou
        .replace("{NOME}", this.mon.nickname)
        .replace("{CABECA}", cabeca.nickname).replace("{CORPO}", corpo.nickname));
      if (cabeca.shiny && corpo.shiny) msgs.push(F.saiuBrilhando);
      if (st.party.length < 6) {
        st.party.splice(i + 1, 0, corpo);
      } else {
        // PC lotado também: ele fica na sobra, esperando vaga (ver box.js)
        if (!guardar(st, corpo)) (st.box ||= []).push(corpo);
        msgs.push(F.foiProBox.replace("{MON}", corpo.nickname));
      }
    }
    this.game.autosave?.(true);
    this.dlg.say(msgs, () => { this.fadeDir = 1; this.saindo = true; });
  }

  /** o som e o tempo do filme doido; no BUUM a fusão acontece de verdade */
  atualizaDoido(dt) {
    this.td += dt;
    const td = this.td, uma = (nome) => !this.marcos.has(nome) && this.marcos.add(nome);
    if (uma("musica") && DB.MUSIC?.fusao) Audio2.playSong(DB.MUSIC.fusao);
    if (td > 0.2 && uma("grito1")) tocarGrito(this.cabeca);
    if (td > 0.8 && uma("grito2")) tocarGrito(this.corpo);
    if (td > DOIDO.desfaz && uma("desfaz")) { this.montaPixels(); Audio2.noise(0.4, 0.5); this.flash = 0.35; }
    if (td > DOIDO.mistura && uma("mistura")) {
      // os dois gritos juntos, graves: os dois virando um só
      Audio2.grito(gritoDe(this.cabeca.species), 0.6);
      Audio2.grito(gritoDe(this.corpo.species), 0.55);
    }
    if (td > DOIDO.buum && uma("buum")) {
      this.tremor = 5;
      this.pixels = [];
      Audio2.noise(0.7, 1);
      Audio2.tone(60, 0.5, "sawtooth", 0.8);
      this.tp = 0;
      this.concluir();                                     // o clarão: aqui a equipe muda
      if (DB.MUSIC?.fusao_fanfarra) Audio2.playSong(DB.MUSIC.fusao_fanfarra);
      // a fanfarra acabou e a fala ainda está na tela: a festa da evolução
      setTimeout(() => { if (!this.saindo && this.fase === "pronto" && DB.MUSIC?.evolucao_festa) Audio2.playSong(DB.MUSIC.evolucao_festa); }, 3000);
      setTimeout(() => tocarGrito(this.fus), 350);
    }
    if (this.tremor > 0) this.tremor = Math.max(0, this.tremor - dt * 10);
  }

  /** os pixels dos dois, cada um com o lugar de onde sai e o lugar que ele
   *  ocupa no desenho da FUSÃO (na ordem de leitura: cabeça vira cabeça) */
  montaPixels() {
    const cx = CENTRO.x, cy = CENTRO.y;
    const de = [
      ...pixelsDe(this.esq).map((p) => ({ ...p, ox: cx - 56 })),
      ...pixelsDe(this.dir).map((p) => ({ ...p, ox: cx + 56 })),
    ].sort((a, b) => a.dy - b.dy || a.dx - b.dx);
    const para = pixelsDe(this.meio);
    if (!de.length || !para.length) { this.pixels = []; return; }
    const n = Math.max(de.length, para.length);
    this.pixels = [];
    for (let k = 0; k < n; k++) {
      const a = de[Math.floor((k * de.length) / n)], b = para[Math.floor((k * para.length) / n)];
      const ax = a.ox + a.dx, ay = cy + a.dy;
      const ang = Math.atan2(a.dy, a.dx) + (Math.random() - 0.5) * 1.2, dist = 10 + Math.random() * 30;
      this.pixels.push({
        r: a.r, g: a.g, b: a.b, tr: b.r, tg: b.g, tb: b.b,
        ax, ay, sx: ax + Math.cos(ang) * dist, sy: ay + Math.sin(ang) * dist * 0.8,
        tx: cx + b.dx, ty: cy + b.dy,
        raio: 20 + Math.random() * 70, fase: Math.random() * Math.PI * 2,
        vel: (Math.random() < 0.5 ? -1 : 1) * (1.5 + Math.random() * 2.5),
        matiz: Math.random() * 360, atraso: Math.random() * 0.4,
      });
    }
  }

  /** onde está cada pixel agora, e de que cor */
  desenhaPixels(ctx) {
    if (!this.camada) {
      const { cv, ctx: c2 } = makeCanvas(W, H);
      this.camada = cv; this.camadaCtx = c2; this.camadaDados = c2.createImageData(W, H);
    }
    const d = this.camadaDados.data, td = this.td, t = this.t, cx = CENTRO.x, cy = CENTRO.y;
    const pedaco = (a, b) => prende((td - a) / (b - a));
    for (let i = 3; i < d.length; i += 4) if (d[i]) d[i] = d[i] * 0.72;
    // onde o pixel está na CIRANDA num instante (pra a mistura sair de lá)
    const orbita = (p, tt) => {
      const k = prende((tt - DOIDO.ciranda) / (DOIDO.mistura - DOIDO.ciranda));
      const a = p.fase + (tt - DOIDO.ciranda) * p.vel * (1 + k * 2.5);
      const r = p.raio * (0.7 + 0.3 * Math.sin(tt * 5 + p.fase * 3));
      return [cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.62];
    };
    const cubos = this.baseIso ? [] : null;
    for (const p of this.pixels) {
      let x, y, cor = [p.r, p.g, p.b], branco = 0;
      if (td < DOIDO.ciranda) {
        // DESFAZ: cada pixel se solta e boia pra fora
        const e = sai(pedaco(DOIDO.desfaz + p.atraso * 0.5, DOIDO.ciranda));
        // e depois vai entrando na ciranda
        x = p.ax + (p.sx - p.ax) * e;
        y = p.ay + (p.sy - p.ay) * e + Math.sin(t * 6 + p.ax) * e;
        branco = 0.5 * (1 - e);
      } else if (td < DOIDO.mistura) {
        // A CIRANDA: um redemoinho doido em volta do meio, piscando arco-íris
        const k = pedaco(DOIDO.ciranda, DOIDO.mistura);
        const entra = suave(prende(k * 3));
        const [ox, oy] = orbita(p, td);
        x = p.sx + (ox - p.sx) * entra;
        y = p.sy + (oy - p.sy) * entra;
        if (Math.sin(t * 6 + p.matiz) > 0.9) {
          const a = arco((p.matiz + t * 200) % 360);
          cor = [(p.r + a[0]) / 2, (p.g + a[1]) / 2, (p.b + a[2]) / 2];
        }
      } else {
        // A MISTURA: de onde estava no redemoinho até o lugar dele na fusão,
        // ganhando a cor nova e ficando branco; depois treme carregando
        const e = suave(pedaco(DOIDO.mistura + p.atraso, DOIDO.carrega));
        const [ox, oy] = orbita(p, DOIDO.mistura);
        const giro = (1 - e) * (1 - e) * Math.PI * 2 * Math.sign(p.vel);
        const bx = ox + (p.tx - ox) * e, by = oy + (p.ty - oy) * e;
        const cs = Math.cos(giro), sn = Math.sin(giro);
        x = cx + (bx - cx) * cs - (by - cy) * sn;
        y = cy + (bx - cx) * sn + (by - cy) * cs;
        cor = [p.r + (p.tr - p.r) * e, p.g + (p.tg - p.g) * e, p.b + (p.tb - p.b) * e];
        if (td > DOIDO.carrega) {
          const kk = pedaco(DOIDO.carrega, DOIDO.buum);
          x += (Math.random() - 0.5) * (1 + kk * 3);
          y += (Math.random() - 0.5) * (1 + kk * 3);
          branco = 0.3 + 0.7 * kk;
        }
      }
      if (cubos) { cubos.push([x, y, cor[0] + (255 - cor[0]) * branco, cor[1] + (255 - cor[1]) * branco, cor[2] + (255 - cor[2]) * branco]); continue; }
      const xi = Math.round(x), yi = Math.round(y);
      if (xi < 0 || yi < 0 || xi >= W || yi >= H) continue;
      const i = (yi * W + xi) * 4;
      d[i] = cor[0] + (255 - cor[0]) * branco;
      d[i + 1] = cor[1] + (255 - cor[1]) * branco;
      d[i + 2] = cor[2] + (255 - cor[2]) * branco;
      d[i + 3] = 255;
    }
    if (cubos) return cubosIso(ctx, cubos, this.baseIso, CENTRO.x, CENTRO.y + LADO / 2);
    this.camadaCtx.putImageData(this.camadaDados, 0, 0);
    ctx.drawImage(this.camada, 0, 0);
  }

  renderDoido(ctx) {
    const td = this.td, pronto = this.fase === "pronto", tp = this.tp || 0, t = this.t;
    const cx = CENTRO.x, cy = CENTRO.y;
    const energia = pronto ? Math.max(0, 1 - tp * 0.6) : Math.min(1, td / DOIDO.carrega);
    ctx.save();
    if (this.tremor > 0) ctx.translate(Math.round((Math.random() - 0.5) * this.tremor), Math.round((Math.random() - 0.5) * this.tremor));
    // o CALEIDOSCÓPIO: fatias de cor girando, cada vez mais rápido
    ctx.fillStyle = "#0a0414";
    ctx.fillRect(-10, -10, W + 20, H + 20);
    const n = 16, rot = t * (0.3 + energia * 1.2);
    for (let i = 0; i < n; i++) {
      const a = rot + (i / n) * Math.PI * 2;
      ctx.fillStyle = `hsla(${(i * 47 + t * 60) % 360},70%,50%,${0.03 + 0.08 * energia})`;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * 200, cy + Math.sin(a) * 200);
      ctx.lineTo(cx + Math.cos(a + Math.PI / n) * 200, cy + Math.sin(a + Math.PI / n) * 200);
      ctx.fill();
    }
    for (let r = (t * (20 + energia * 40)) % 24; r < 200; r += 24) {
      ctx.strokeStyle = `hsla(${(r * 3 + t * 80) % 360},70%,70%,${0.04 + 0.08 * energia})`;
      ctx.beginPath(); ctx.ellipse(cx, cy, r, r * 0.7, 0, 0, Math.PI * 2); ctx.stroke();
    }

    // NO ISOMÉTRICO: o palco inclinado, sem chão; os pixels viram cubinhos
    if (isoLigado()) {
      ctx.translate(0, -8);
      this.baseIso = ctx.getTransform();
      palcoIso(ctx, cx, cy + LADO / 2);
    } else this.baseIso = null;
    if (!pronto && td < DOIDO.desfaz) {
      // ENCARAM-SE: o sprite normal dos dois, um de cada lado, tremendo
      const tr = td * 1.5, sx = () => Math.round((Math.random() - 0.5) * tr);
      bichoNoPalco(ctx, this.esq, cx - 56 - LADO / 2 + sx(), cy - LADO / 2 + sx(), LADO, LADO);
      bichoNoPalco(ctx, this.dir, cx + 56 - LADO / 2 + sx(), cy - LADO / 2 + sx(), LADO, LADO);
    } else if (!pronto) {
      this.desenhaPixels(ctx);
    } else {
      // NASCEU: o sprite normal da fusão, com um soco de zoom e a luz saindo dele
      const z = 1 + 0.6 * Math.exp(-6 * tp) * Math.cos(14 * tp);
      const lado = Math.round(LADO * z);
      const x = Math.round(cx - lado / 2), y = Math.round(cy - lado / 2);
      bichoNoPalco(ctx, this.meio, x, y, lado, lado);
      const k = Math.max(0, 1 - tp * 1.5);
      if (k > 0) { ctx.globalAlpha = k; ctx.drawImage(Assets.silhueta(this.meio), x, y, lado, lado); ctx.globalAlpha = 1; }
    }
    ctx.restore();

    // o título e o nome, com a letra tremendo junto
    const F = DB.STORY.fusao;
    drawText(ctx, F.titulo, 8, 8, PAL.glitch);
    const nome = pronto ? this.fus.nickname : `${this.nomes[0]} + ${this.nomes[1]}`;
    drawText(ctx, nome, Math.round(W / 2 - nome.length * 3), 104, PAL.paper);
    this.dlg.render(ctx);
    if (this.flash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${Math.min(1, this.flash)})`;
      ctx.fillRect(0, 0, W, H);
    }
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }

  /** a fita de código que corre atrás dos sprites */
  desenhaFita(ctx) {
    const y = CENTRO.y + 40;
    ctx.fillStyle = "#0a0614";
    ctx.fillRect(0, y, W, 10);
    const desl = Math.floor(this.t * 60) % 6;
    let linha = "";
    for (let i = 0; i < 40; i++) {
      const n = (i * 7 + Math.floor(this.t * 12) + Math.floor(this.k * 40)) % 16;
      linha += FITA[n];
    }
    drawText(ctx, linha.slice(0, 39), 4 - desl, y + 2, "#00ffcc");
  }

  render(ctx) {
    // FUNDIR é o filme doido, do começo ao fim (depois que a fala abre)
    if (this.modo === "fundir" && (this.fase === "doido" || (this.fase === "pronto" && this.marcos))) return this.renderDoido(ctx);
    ctx.fillStyle = "#120a20";
    ctx.fillRect(0, 0, W, H);

    // brilho no ponto de encontro
    const raio = 40 + Math.sin(this.t * 4) * 3 + this.k * 12;
    const g = ctx.createRadialGradient(CENTRO.x, CENTRO.y, 4, CENTRO.x, CENTRO.y, raio);
    g.addColorStop(0, `rgba(180,85,255,${0.25 + this.k * 0.4})`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(CENTRO.x - raio, CENTRO.y - raio, raio * 2, raio * 2);

    this.desenhaFita(ctx);

    const F = DB.STORY.fusao;
    drawText(ctx, F.titulo, 8, 8, PAL.glitch);
    if (this.sp) {
      drawText(ctx, (F.ajudaCatalogo || "")
        .replace("{TOTAL}", String(DB.FUSAO?.combinacoes ?? ""))
        .replace("{CODIGO}", this.sp.codigo || "0x0000"), 8, 18, PAL.ink2);
    }

    if (this.fase === "erro") { this.dlg.render(ctx); if (this.fadeA > 0) fade(ctx, this.fadeA); return; }

    // NO ISOMÉTRICO (o filme de separar): o palco inclinado, sem chão
    ctx.save();
    if (isoLigado()) {
      ctx.translate(0, -8);
      palcoIso(ctx, CENTRO.x, CENTRO.y + LADO / 2);
    }
    const junto = this.fase === "pronto";
    if (junto) {
      const img = this.modo === "fundir" ? this.meio : null;
      if (img) bichoNoPalco(ctx, img, CENTRO.x - LADO / 2, CENTRO.y - LADO / 2, LADO, LADO);
    }
    if (!junto || this.modo === "separar") {
      // os dois lados: longe no começo, colados no fim (a separação é o inverso)
      const dist = Math.round((1 - this.k) * 44);
      const esc = 1 - this.k * 0.12;
      const lado = LADO * esc;
      const dy = CENTRO.y - lado / 2;
      const arte = (img) => (junto || this.k < 0.85 ? img : Assets.silhueta(img));
      bichoNoPalco(ctx, arte(this.esq), Math.round(CENTRO.x - dist - lado / 2), dy, lado, lado);
      bichoNoPalco(ctx, arte(this.dir), Math.round(CENTRO.x + dist - lado / 2), dy, lado, lado);
    }
    if (!junto && this.modo === "fundir" && this.k > 0.85) {
      // no último instante o resultado já aparece por trás, como silhueta
      const s = Assets.silhueta(this.meio);
      ctx.globalAlpha = (this.k - 0.85) / 0.15;
      ctx.drawImage(s, CENTRO.x - LADO / 2, CENTRO.y - LADO / 2, LADO, LADO);
      ctx.globalAlpha = 1;
    }

    ctx.restore();
    const nome = junto && this.modo === "fundir" ? this.fus.nickname
      : junto ? this.nomes.join(" + ")
      : `${this.nomes[0]} + ${this.nomes[1]}`;
    drawText(ctx, nome, Math.round(W / 2 - nome.length * 3), 104, PAL.paper);

    this.dlg.render(ctx);
    if (this.flash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${Math.min(1, this.flash)})`;
      ctx.fillRect(0, 0, W, H);
    }
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }
}
