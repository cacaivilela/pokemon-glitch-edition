// Tela do DECODIFICADOR DE GENOMA: a fusão e a separação acontecendo.
// FUNDIR (`renderDoido`): AS POKÉBOLAS SE CHOCANDO (nov/2026, no lugar do
// redemoinho de pixels). Os dois se encaram, VOLTAM PRAS POKÉBOLAS (o raio
// vermelho, a silhueta sendo sugada), as bolas VOAM girando em órbitas que vão
// apertando, DISPARAM uma contra a outra e se CHOCAM no meio (clarão, tremor,
// faíscas, os gritos juntos), se ESPREMEM e VIRAM UMA BOLA SÓ (a de cima na cor
// da cabeça, a de baixo na do corpo), que cai, quica, SACODE três vezes como
// numa captura — e BUUM, ela abre e a fusão aparece. Com a tripla são três bolas.
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
// o filme da fusão: quando começa cada parte (s, desde o fim da fala).
// Casado com MUSIC.fusao (src/data/music.js): 32 tempos a 150 bpm, 0,4 s por
// tempo — volta pra bola no tempo 4, o voo no 8 (o tema), o disparo no 24, o
// CHOQUE no 25, VIRAM UMA no 26, a queda no 28, as três sacudidas no 29, 30 e
// 31, e o BUUM no 32, no silêncio depois da caixa
const DOIDO = { recolhe: 1.6, voa: 3.2, dispara: 9.6, choque: 10.0, junta: 10.4, cai: 11.2, sacode: [11.8, 12.2, 12.6], buum: 12.8 };
const ESPERA = 0.8;          // quanto dura o raio vermelho puxando pra bola
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

/** a COR de um Pokémon: a média das cores vivas do sprite (pra luz que vaza da bola dele) */
function corDe(img) {
  let r = 0, g = 0, b = 0, n = 0;
  for (const p of pixelsDe(img)) {
    const mx = Math.max(p.r, p.g, p.b), mn = Math.min(p.r, p.g, p.b);
    if (mx < 60 || mx - mn < 40) continue;          // contorno, preto, cinza: fora
    r += p.r; g += p.g; b += p.b; n++;
  }
  if (!n) return [200, 220, 255];
  // um pouco mais clara e viva: é luz, não tinta
  return [r / n, g / n, b / n].map((c) => Math.min(255, c * 1.15 + 30));
}

/** UMA POKÉBOLA, pixel a pixel: `r` o raio, `ang` o giro, `racha` 0..1 (as
 *  rachaduras crescendo, com a luz `cor` vazando), `branco` 0..1 (o clarão) */
function bola(ctx, x, y, r, ang, racha = 0, cor = null, branco = 0, trincas = null, cores = null) {
  const cs = Math.cos(ang), sn = Math.sin(ang), R = Math.ceil(r);
  const mix = (c) => c.map((v) => Math.round(v + (255 - v) * branco));
  for (let dy = -R; dy <= R; dy++) {
    for (let dx = -R; dx <= R; dx++) {
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > r) continue;
      const u = dx * cs + dy * sn, v = -dx * sn + dy * cs;   // coordenadas da bola girada
      let c;
      if (d > r - 1) c = [24, 22, 32];                         // o contorno
      else if (Math.sqrt(u * u + v * v) < r * 0.32) c = Math.sqrt(u * u + v * v) < r * 0.2 ? [248, 248, 248] : [24, 22, 32];   // o botão
      else if (Math.abs(v) < Math.max(1, r * 0.12)) c = [24, 22, 32];                    // a faixa do meio
      else if (cores) {
        // a BOLA FUNDIDA: a metade de cima na cor da cabeça, a de baixo na do corpo
        const base = v < 0 ? cores.cima : cores.baixo;
        const luz = (dx + dy < -r * 0.6) ? 0.45 : (dx + dy > r * 0.6) ? -0.25 : 0;
        c = base.map((q) => Math.round(luz >= 0 ? q + (255 - q) * luz : q * (1 + luz)));
      }
      else if (v < 0) c = (dx + dy < -r * 0.7) ? [255, 120, 110] : [226, 44, 52];        // a metade de cima, vermelha (com o brilho)
      else c = (dx + dy > r * 0.6) ? [196, 196, 206] : [244, 244, 248];                  // a de baixo, branca (com a sombra)
      ctx.fillStyle = `rgb(${mix(c).join(",")})`;
      ctx.fillRect(Math.round(x + dx), Math.round(y + dy), 1, 1);
    }
  }
  // as RACHADURAS, com a luz de dentro
  if (racha > 0 && trincas) {
    const k = Math.floor(trincas.length * Math.min(1, racha));
    const c = cor || [255, 255, 255];
    for (let i = 0; i < k; i++) {
      const [tx, ty] = trincas[i];
      ctx.fillStyle = `rgb(${c.map((v) => Math.round(v + (255 - v) * 0.4)).join(",")})`;
      ctx.fillRect(Math.round(x + tx * r), Math.round(y + ty * r), 1, 1);
    }
  }
}

/** o desenho das rachaduras de uma bola: caminhos tortos saindo do meio (em unidades de raio) */
function trincasDe() {
  const pts = [];
  for (let k = 0; k < 4; k++) {
    let a = Math.random() * Math.PI * 2, x = (Math.random() - 0.5) * 0.3, y = (Math.random() - 0.5) * 0.3;
    for (let i = 0; i < 10; i++) {
      a += (Math.random() - 0.5) * 1.2;
      x += Math.cos(a) * 0.11; y += Math.sin(a) * 0.11;
      if (x * x + y * y > 0.85) break;
      pts.push([x, y]);
    }
  }
  return pts;
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
      this.pernas = args.pernas || null;           // a FUSÃO TRIPLA
      this.fus = fundir(this.cabeca, this.corpo, args.variante || "", this.pernas);
      if (!this.fus) return void this.desistir(F().naoDaParaFundir);
      this.sp = DB.SPECIES[this.fus.species];
      this._esq = [this.cabeca.species, this.cabeca.seed];
      this._dir = [this.corpo.species, this.corpo.seed];
      this._meio = [this.fus.species, this.fus.seed];
      if (this.pernas) this._ter = [this.pernas.species, this.pernas.seed];
      // já pede os três desenhos (o da ficha do jogador é um PNG que demora a
      // abrir: sem isto os pixels se juntariam na montagem automática)
      void [this.esq, this.dir, this.meio];
      this.nomes = [this.cabeca.nickname, this.corpo.nickname, ...(this.pernas ? [this.pernas.nickname] : [])];
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
      if (p.pernas) this._ter = [p.pernas, this.mon.seed];
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
  get ter() { return this._ter && Assets.mon(...this._ter); }
  /** onde cada um fica quando estão separados (x a partir do centro) */
  get lados() { return this._ter ? [-76, 76, 0] : [-56, 56]; }

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
      const quem = [this.cabeca, this.corpo, this.pernas].filter(Boolean);
      const idx = quem.map((m) => st.party.indexOf(m)).sort((a, b) => b - a);
      const lugar = idx[idx.length - 1];
      for (const i of idx) st.party.splice(i, 1);
      st.party.splice(lugar, 0, this.fus);
      msgs.push((this.pernas ? F.fundiu3 : F.fundiu)
        .replace("{CABECA}", this.nomes[0]).replace("{CORPO}", this.nomes[1])
        .replace("{PERNAS}", this.nomes[2] || "")
        .replace("{NOME}", this.fus.nickname));
      // o brilho de um passou pro outro: vale dizer, porque muda os dois pra sempre
      if (this.fus.brilhouNaFusao) msgs.push(F.brilhoPegou);
    } else {
      const [cabeca, corpo, pernas] = this.partido;
      const i = st.party.indexOf(this.mon);
      st.party.splice(i, 1, cabeca);
      msgs.push((pernas ? F.separou3 : F.separou)
        .replace("{NOME}", this.mon.nickname)
        .replace("{CABECA}", cabeca.nickname).replace("{CORPO}", corpo.nickname)
        .replace("{PERNAS}", pernas?.nickname || ""));
      if (this.partido.every((m) => m.shiny)) msgs.push(F.saiuBrilhando);
      [corpo, pernas].filter(Boolean).forEach((m, k) => {
        if (st.party.length < 6) st.party.splice(i + 1 + k, 0, m);
        else {
          // PC lotado também: ele fica na sobra, esperando vaga (ver box.js)
          if (!guardar(st, m)) (st.box ||= []).push(m);
          msgs.push(F.foiProBox.replace("{MON}", m.nickname));
        }
      });
    }
    this.game.autosave?.(true);
    this.dlg.say(msgs, () => { this.fadeDir = 1; this.saindo = true; });
  }

  /** o som e o tempo do filme; no BUUM a fusão acontece de verdade */
  atualizaDoido(dt) {
    this.td += dt;
    const td = this.td, uma = (nome) => !this.marcos.has(nome) && this.marcos.add(nome);
    if (uma("musica") && DB.MUSIC?.fusao) Audio2.playSong(DB.MUSIC.fusao);
    if (td > 0.2 && uma("grito1")) tocarGrito(this.cabeca);
    if (td > 0.8 && uma("grito2")) tocarGrito(this.corpo);
    if (this.pernas && td > 1.2 && uma("grito3")) tocarGrito(this.pernas);
    // VOLTA PRA BOLA: o raio vermelho (o "tchuuu" descendo)
    if (td > DOIDO.recolhe && uma("recolhe")) {
      this.montaBolas();
      Audio2.tone(1400, 0.06, "square", 0.5); Audio2.tone(900, 0.12, "triangle", 0.5); Audio2.tone(500, 0.18, "triangle", 0.4);
    }
    if (td > DOIDO.recolhe + ESPERA && uma("fechou")) { Audio2.tone(320, 0.05, "square", 0.6); Audio2.tone(240, 0.06, "square", 0.5); }
    // O VOO: um "vush" a cada dois tempos, cada vez mais agudo
    if (td > DOIDO.voa && td < DOIDO.dispara) {
      const tempo = Math.floor((td - DOIDO.voa) / 0.8);
      if (uma("vush" + tempo)) { Audio2.noise(0.12, 0.25); Audio2.tone(300 + tempo * 60, 0.05, "triangle", 0.35); }
    }
    if (td > DOIDO.dispara && uma("dispara")) Audio2.noise(0.35, 0.45);
    // O CHOQUE: a pancada, o tremor, as faíscas e os gritos juntos (graves)
    if (td > DOIDO.choque && uma("choque")) {
      this.tremor = 6; this.flash = 0.7;
      Audio2.noise(0.5, 1); Audio2.tone(90, 0.35, "square", 0.9);
      Glitch.hit(1.2);
      this.faiscas = Array.from({ length: 40 }, () => {
        const a = Math.random() * Math.PI * 2, v = 40 + Math.random() * 110;
        return { x: CENTRO.x, y: CENTRO.y - 18, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 30, vida: 0.5 + Math.random() * 0.6 };
      });
      Audio2.grito(gritoDe(this.cabeca.species), 0.6);
      Audio2.grito(gritoDe(this.corpo.species), 0.55);
      if (this.pernas) Audio2.grito(gritoDe(this.pernas.species), 0.5);
    }
    // VIRAM UMA: o clarão e o som subindo
    if (td > DOIDO.junta && uma("junta")) {
      this.flash = 0.5; Glitch.hit(0.6);
      Audio2.tone(500, 0.08, "triangle", 0.5); Audio2.tone(800, 0.1, "triangle", 0.5); Audio2.tone(1200, 0.16, "triangle", 0.45);
    }
    // a QUEDA (a pancada no chão)
    if (td > DOIDO.cai + 0.35 && uma("chao")) { Audio2.tone(140, 0.08, "square", 0.6); Audio2.noise(0.08, 0.35); }
    // as TRÊS SACUDIDAS, com o clique de captura
    DOIDO.sacode.forEach((ts, i) => { if (td > ts && uma("sacode" + i)) { Audio2.tone(320, 0.04, "square", 0.6); Audio2.tone(260, 0.05, "square", 0.5); } });
    if (td > DOIDO.buum && uma("buum")) {
      this.tremor = 5;
      this.bolas = [];
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
    for (const f of this.faiscas || []) { f.x += f.vx * dt; f.y += f.vy * dt; f.vy += 160 * dt; f.vida -= dt; }
    if (this.faiscas) this.faiscas = this.faiscas.filter((f) => f.vida > 0);
  }

  /** uma bola pra cada um, onde ele está, com a cor dele e as rachaduras sorteadas */
  montaBolas() {
    const imgs = [this.esq, this.dir, ...(this._ter ? [this.ter] : [])];
    this.bolas = imgs.map((img, i) => ({
      img, lado: this.lados[i], cor: corDe(img), trincas: trincasDe(),
      sentido: i % 2 ? -1 : 1, fase: (i / imgs.length) * Math.PI * 2,
    }));
  }

  /** a BOLA FUNDIDA: onde ela está, o tamanho, o giro e a sacudida */
  ondeFundida(td) {
    const cx = CENTRO.x, cy = CENTRO.y, chao = cy + 16, alto = cy - 18;
    const cresce = suave(prende((td - DOIDO.junta) / 0.3));
    const r = 6 + 3 * cresce;
    if (td < DOIDO.cai) return { x: cx, y: alto + Math.sin(td * 6) * 1.5, r, ang: td * 3 };
    // cai e quica duas vezes
    const q = td - DOIDO.cai;
    let y;
    if (q < 0.35) y = alto + (chao - alto) * (q / 0.35) ** 2;
    else if (q < 0.55) { const k = (q - 0.35) / 0.2; y = chao - Math.sin(k * Math.PI) * 7; }
    else if (q < 0.65) { const k = (q - 0.55) / 0.1; y = chao - Math.sin(k * Math.PI) * 2; }
    else y = chao;
    // as sacudidas: um balanço curto pra cada lado
    let ang = 0;
    for (const ts of DOIDO.sacode) if (td > ts && td < ts + 0.3) ang = Math.sin((td - ts) / 0.3 * Math.PI * 2) * 0.45;
    return { x: cx + ang * 4, y, r, ang };
  }

  /** onde a bola `i` está agora (e o giro dela) */
  ondeBola(b, td) {
    const cx = CENTRO.x, cy = CENTRO.y, chao = cy + 20;
    const x0 = cx + b.lado, y0 = chao;
    if (td < DOIDO.voa) return { x: x0, y: y0, ang: Math.sin(td * 18) * 0.25 * prende(td - DOIDO.recolhe - ESPERA) };
    if (td < DOIDO.dispara) {
      // sobem num pulo e entram na órbita, que vai apertando e acelerando
      const k = (td - DOIDO.voa) / (DOIDO.dispara - DOIDO.voa);
      const sobe = suave(prende(k * 4));
      const raio = 56 - 36 * k, a = b.fase + b.sentido * (td - DOIDO.voa) * (2 + k * 5);
      const ox = cx + Math.cos(a) * raio, oy = cy - 22 + Math.sin(a) * raio * 0.45;
      return { x: x0 + (ox - x0) * sobe, y: y0 + (oy - y0) * sobe - Math.sin(Math.PI * prende(k * 4)) * 18, ang: td * 14 * b.sentido };
    }
    const centro = { x: cx + Math.sign(b.lado || 1) * 0, y: cy - 18 };
    if (td < DOIDO.choque) {
      // O DISPARO: da órbita direto pro meio
      const ini = this.ondeBola(b, DOIDO.dispara - 0.0001);
      const e = prende((td - DOIDO.dispara) / (DOIDO.choque - DOIDO.dispara));
      const enc = Math.sign(ini.x - cx || b.sentido) * 6;     // param encostadas, uma de cada lado
      return { x: ini.x + (cx + enc - ini.x) * e * e, y: ini.y + (centro.y - ini.y) * e * e, ang: td * 30 * b.sentido };
    }
    // GRUDADAS, se espremendo até o meio (e aí viram uma só: `ondeFundida`)
    const ini = this.ondeBola(b, DOIDO.dispara - 0.0001);
    const lado = Math.sign(ini.x - cx || b.sentido);
    const e = suave(prende((td - DOIDO.choque) / (DOIDO.junta - DOIDO.choque)));
    const treme = (Math.random() - 0.5) * 2 * e;
    return { x: cx + lado * 6 * (1 - e) + treme, y: centro.y + treme, ang: 0.4 * lado * (1 - e) };
  }

  renderDoido(ctx) {
    const td = this.td, pronto = this.fase === "pronto", tp = this.tp || 0, t = this.t;
    const cx = CENTRO.x, cy = CENTRO.y, chao = cy + 20;
    const energia = pronto ? Math.max(0, 1 - tp * 0.6) : Math.min(1, td / DOIDO.cai);
    ctx.save();
    if (this.tremor > 0) ctx.translate(Math.round((Math.random() - 0.5) * this.tremor), Math.round((Math.random() - 0.5) * this.tremor));
    // O PALCO: o céu escurecendo, os holofotes e o chão de arena
    const ceu = ctx.createLinearGradient(0, 0, 0, H);
    ceu.addColorStop(0, `rgb(${10 + 20 * energia},${8 + 6 * energia},${30 + 30 * energia})`);
    ceu.addColorStop(1, "#05030c");
    ctx.fillStyle = ceu;
    ctx.fillRect(-10, -10, W + 20, H + 20);
    for (let i = 0; i < 2; i++) {
      const a = Math.sin(t * 0.7 + i * 2) * 0.35 + (i ? 0.5 : -0.5);
      ctx.fillStyle = `rgba(255,255,230,${0.04 + 0.05 * energia})`;
      ctx.beginPath(); ctx.moveTo(cx + (i ? 90 : -90), -10);
      ctx.lineTo(cx + Math.sin(a) * 60 - 22, chao + 6); ctx.lineTo(cx + Math.sin(a) * 60 + 22, chao + 6); ctx.fill();
    }
    ctx.fillStyle = `rgba(120,140,255,${0.10 + 0.10 * energia})`;
    ctx.beginPath(); ctx.ellipse(cx, chao + 4, 92, 14, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = `rgba(170,190,255,${0.25 + 0.2 * energia})`;
    ctx.beginPath(); ctx.ellipse(cx, chao + 4, 92, 14, 0, 0, Math.PI * 2); ctx.stroke();

    // NO ISOMÉTRICO: o palco inclinado
    if (isoLigado()) {
      ctx.translate(0, -8);
      this.baseIso = ctx.getTransform();
      palcoIso(ctx, cx, cy + LADO / 2);
    } else this.baseIso = null;

    const [l0, l1, l2] = this.lados;
    if (!pronto && td < DOIDO.recolhe) {
      // ENCARAM-SE: o sprite normal dos dois, um de cada lado, tremendo
      const tr = td * 1.5, sx = () => Math.round((Math.random() - 0.5) * tr);
      if (this._ter) bichoNoPalco(ctx, this.ter, cx + l2 - LADO / 2 + sx(), cy - LADO / 2 + sx(), LADO, LADO);
      bichoNoPalco(ctx, this.esq, cx + l0 - LADO / 2 + sx(), cy - LADO / 2 + sx(), LADO, LADO);
      bichoNoPalco(ctx, this.dir, cx + l1 - LADO / 2 + sx(), cy - LADO / 2 + sx(), LADO, LADO);
    } else if (!pronto) {
      const bolas = this.bolas || [];
      // VOLTANDO PRA BOLA: a silhueta encolhendo pra dentro dela, puxada pelo raio vermelho
      if (td < DOIDO.recolhe + ESPERA) {
        const e = suave(prende((td - DOIDO.recolhe) / ESPERA));
        for (const b of bolas) {
          const bx = cx + b.lado, lado = Math.max(2, Math.round(LADO * (1 - e)));
          const x = Math.round(bx - lado / 2), y = Math.round(cy + (chao - cy) * e - lado / 2);
          ctx.strokeStyle = `rgba(255,60,60,${0.9 - 0.6 * e})`; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(bx, chao); ctx.lineTo(bx + (Math.random() - 0.5) * 6, cy - 10 + 30 * e); ctx.stroke();
          ctx.globalAlpha = 1 - e * 0.3;
          ctx.drawImage(Assets.silhueta(b.img), x, y, lado, lado);
          ctx.globalAlpha = 1;
        }
      }
      // O RASTRO do voo: as bolas de um instante atrás, sumindo
      if (td > DOIDO.voa && td < DOIDO.choque) {
        for (let k = 4; k >= 1; k--) for (const b of bolas) {
          const p = this.ondeBola(b, td - k * 0.035);
          ctx.globalAlpha = 0.12 * (5 - k);
          bola(ctx, p.x, p.y, 6, p.ang);
        }
        ctx.globalAlpha = 1;
      }
      // AS BOLAS SEPARADAS (no voo, no choque e se espremendo)
      if (td < DOIDO.junta) {
        for (const b of bolas) {
          const p = this.ondeBola(b, td);
          const brilho = td > DOIDO.voa && td < DOIDO.dispara ? Math.max(0, Math.cos(((td - DOIDO.voa) % 0.8) / 0.8 * Math.PI * 2)) * 0.35 : 0;
          const aperta = prende((td - DOIDO.choque) / (DOIDO.junta - DOIDO.choque));
          bola(ctx, p.x, p.y, td < DOIDO.voa ? 5 : 6, p.ang, 0, null, Math.max(brilho, aperta * 0.7));
        }
      } else if (bolas.length) {
        // A BOLA FUNDIDA: em cima a cor da cabeça, embaixo a do corpo, com o brilho das duas girando em volta
        const p = this.ondeFundida(td);
        const cima = bolas[0].cor, baixo = bolas[1]?.cor || bolas[0].cor;
        const forte = Math.max(0, 1 - (td - DOIDO.junta) * 1.2);
        for (let i = 0; i < 2; i++) {
          const a = t * 4 + i * Math.PI, c = i ? baixo : cima;
          const gx = p.x + Math.cos(a) * (p.r + 3), gy = p.y + Math.sin(a) * (p.r + 3) * 0.6;
          const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, 10);
          g.addColorStop(0, `rgba(${c.map(Math.round).join(",")},${0.25 + 0.4 * forte})`); g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g; ctx.fillRect(gx - 12, gy - 12, 24, 24);
        }
        // a sombra no chão, quando ela cai
        if (td > DOIDO.cai) { ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.beginPath(); ctx.ellipse(p.x, cy + 16 + p.r - 1, p.r, 2, 0, 0, Math.PI * 2); ctx.fill(); }
        // e ela vai ficando branca de tanta energia perto do BUUM
        const carga = prende((td - DOIDO.sacode[2]) / (DOIDO.buum - DOIDO.sacode[2]));
        bola(ctx, p.x, p.y, p.r, p.ang, 0, null, Math.max(forte * 0.6, carga * 0.8), null, { cima, baixo });
      }
      // AS FAÍSCAS do choque
      for (const f of this.faiscas || []) {
        ctx.fillStyle = f.vida > 0.4 ? "#fff6c0" : "#ffb040";
        ctx.fillRect(Math.round(f.x), Math.round(f.y), 2, 2);
      }
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

    // o título e o nome
    const F = DB.STORY.fusao;
    drawText(ctx, F.titulo, 8, 8, PAL.glitch);
    const nome = pronto ? this.fus.nickname : this.nomes.join(" + ");
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
      const dist = Math.round((1 - this.k) * (this._ter ? 72 : 44));
      const esc = 1 - this.k * 0.12;
      const lado = LADO * esc;
      const dy = CENTRO.y - lado / 2;
      const arte = (img) => (junto || this.k < 0.85 ? img : Assets.silhueta(img));
      if (this._ter) bichoNoPalco(ctx, arte(this.ter), Math.round(CENTRO.x - lado / 2), dy - Math.round((1 - this.k) * 20), lado, lado);
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
      : this.nomes.join(" + ");
    drawText(ctx, nome, Math.round(W / 2 - nome.length * 3), 104, PAL.paper);

    this.dlg.render(ctx);
    if (this.flash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${Math.min(1, this.flash)})`;
      ctx.fillRect(0, 0, W, H);
    }
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }
}
