// A ABERTURA, antes do título.
//
// É a demonstração de sempre, na ordem de sempre — o estúdio no escuro, o mundo
// visto de cima, o desfile de bicho, o treinador, o DUELO e o clarão que entrega
// o logo. Quem cresceu ligando um cartucho desses reconhece a ordem antes de
// reconhecer o desenho. O que muda é o fim: aqui o cartucho não está inteiro.
//
// A ABERTURA É TRAVADA NA MÚSICA. Cada fase tem um comprimento em TEMPOS, não em
// segundos, e o segundo sai de `MUSIC.abertura.bpm`. A faixa tem 200 tempos e a
// soma das fases também: a imagem e a música terminam juntas, e cada pancada da
// tela cai numa batida da faixa em vez de cair perto dela. Mexer no comprimento
// de uma fase aqui pede mexer no trecho correspondente em `src/data/music.js`.
//
// APERTAR QUALQUER COISA PULA. Abertura que não se pula vira castigo na segunda
// vez, e ninguém assiste oitenta segundos de fanfarra pra continuar um save.
import { DB } from "../data/index.js";
import { Assets, nullmonSprite } from "../core/assets.js";
import { trainerArt } from "../core/sprites.js";
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { drawText, fade, CHAR_W } from "../core/gfx.js";
import { Glitch } from "../systems/glitchfx.js";
import { TitleScene } from "./title.js";

const W = 240, H = 160;

/** O roteiro, em TEMPOS de música. A soma tem que dar 200 — ver o cabeçalho. */
const FASES = [
  { nome: "estudio", beats: 10 },    // o nome do estúdio, no escuro
  { nome: "fita", beats: 12 },       // o cartucho sendo lido — e vindo errado
  { nome: "mundo", beats: 24 },      // Kanto de cima, a câmera descendo
  { nome: "corrida", beats: 14 },    // o vulto atravessando a tela
  { nome: "desfile", beats: 24 },    // um bicho por duas batidas, na pancada
  { nome: "lendarios", beats: 16 },  // os três pássaros e o que veio depois
  { nome: "treinador", beats: 16 },  // o treinador e a bola que ele joga
  { nome: "duelo", beats: 28 },      // os dois se encarando, em quatro investidas
  { nome: "rival", beats: 14 },      // ele, do outro lado da tela
  { nome: "caos", beats: 18 },       // o cartucho desistindo
  { nome: "logo", beats: 24 },       // o clarão, o logo remontado e o START
];

/** O desfile: um por duas batidas, doze ao todo. São os que a pessoa reconhece
 *  de longe — silhueta antes de cor, que é como a abertura antiga fazia. */
const DESFILE = [
  "charizard", "blastoise", "venusaur", "pikachu", "gyarados", "dragonite",
  "alakazam", "machamp", "snorlax", "arcanine", "lapras", "gengar",
];

/** Os lendários, quatro batidas cada. */
const LENDARIOS = ["articuno", "zapdos", "moltres", "mewtwo"];

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const suave = (v) => v * v * (3 - 2 * v);          // entra e sai sem tranco
const freia = (v) => 1 - (1 - v) * (1 - v);       // rápido no começo, freia

/** ruído estável: o mesmo índice dá sempre o mesmo número. Serve pra estrela e
 *  pra lixo de tela não tremerem de quadro em quadro quando não devem. */
function fixo(i, s = 1) {
  const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return v - Math.floor(v);
}

const centro = (s) => Math.round((W - String(s).length * CHAR_W) / 2);

export class AberturaScene {
  enter() {
    const bpm = DB.MUSIC?.abertura?.bpm || 150;
    this.compasso = 60 / bpm;                       // quanto dura um tempo
    this.dur = FASES.map((f) => f.beats * this.compasso);

    this.t = 0;
    // Atalho de dev: `?abertura=duelo` começa naquela fase. Sem isto, conferir o
    // fim da abertura é esperar um minuto e meio toda vez — e numa aba de teste,
    // que o navegador roda em câmera lenta, é esperar muito mais.
    const pedida = new URLSearchParams(location.search).get("abertura");
    this.fase = Math.max(0, FASES.findIndex((f) => f.nome === pedida));
    this.faseT = 0;
    this.faseBeat = -1;
    this.flash = 0;
    this.tremor = 0;
    this.saindo = false;
    this.investida = 0;          // quantas vezes os dois já se bateram
    this.anel = [];              // ondas de choque abertas pelas investidas
    this.mostrado = -1;          // qual do desfile está na tela
    this.trocaT = 0;             // há quanto tempo ele trocou
    this.glitchForcado = Glitch.forced;
    Glitch.level = 0;

    // Pede TODO sprite da abertura já no primeiro quadro. Sem isto o desfile
    // começa em arte provisória e vai virando desenho de verdade no meio — que
    // é justamente a coisa que a abertura não pode fazer.
    for (const id of [...DESFILE, ...LENDARIOS, "rapidash", "nidorino", "gengar",
                      "pidgeot", "fearow", "charmander", "bulbasaur", "squirtle"]) {
      Assets.mon(id, 7);
    }
    Assets.monBack("nidorino", 7);
    trainerArt("garoto");
    trainerArt("rival");

    Audio2.playMusic("abertura", DB.MUSIC?.abertura);
  }

  exit() {
    Audio2.stopLoop();
    Glitch.forced = this.glitchForcado;
  }

  /** vai pro título, com ou sem o resto da abertura */
  pular() {
    if (this.saindo) return;
    this.saindo = true;
    Audio2.stopLoop();
    Glitch.forced = this.glitchForcado;
    this.game.scenes.pop();
    this.game.scenes.push(new TitleScene());
  }

  // ------------------------------------------------------------------ update
  update(dt) {
    this.t += dt;
    this.faseT += dt;
    this.flash = Math.max(0, this.flash - dt * 2.4);
    this.tremor = Math.max(0, this.tremor - dt * 12);
    this.trocaT += dt;
    for (const a of this.anel) { a.r += dt * a.v; a.a -= dt * 1.6; }
    this.anel = this.anel.filter((a) => a.a > 0);

    // qualquer botão pula — inclusive o de menu, inclusive as setas
    if (Input.consume("a") || Input.consume("b") || Input.consume("select")
        || Input.consume("run") || Input.dir()) return this.pular();

    // as batidas da fase: tudo que estala na tela estala aqui
    const b = Math.floor(this.faseT / this.compasso);
    while (this.faseBeat < b) this.batida(FASES[this.fase].nome, ++this.faseBeat);

    if (this.faseT >= this.dur[this.fase]) {
      this.fase++;
      this.faseT = 0;
      this.faseBeat = -1;
      if (this.fase >= FASES.length) return this.pular();
      this.entraFase(FASES[this.fase].nome);
    }
  }

  /** o que acontece no instante em que uma fase começa */
  entraFase(nome) {
    if (nome === "corrida" || nome === "desfile") this.flash = 0.5;
    if (nome === "duelo") { this.flash = 0.7; Audio2.tone(320, 0.12, "square", 0.5); }
    if (nome === "caos") {
      // daqui pro fim o pós-processamento de corrupção entra à força, mesmo com
      // o glitchMode desligado: a abertura é o lugar onde o jogo se apresenta.
      Glitch.forced = true;
      Glitch.hit(2.5);
      Audio2.glitch();
    }
    if (nome === "logo") {
      this.flash = 1;                 // o clarão que entrega o logo
      Glitch.hit(2.5);
      Audio2.glitch();
    }
  }

  /** o que acontece em cada batida, por fase */
  batida(nome, n) {
    if (nome === "desfile" && n % 2 === 0) {
      this.mostrado = Math.min(DESFILE.length - 1, n / 2);
      this.trocaT = 0;
      this.flash = 0.42;
      this.tremor = 1.6;
    }
    if (nome === "lendarios" && n % 4 === 0) {
      this.mostrado = Math.min(LENDARIOS.length - 1, n / 4);
      this.trocaT = 0;
      this.flash = n === 12 ? 0.8 : 0.35;      // o quarto entra mais forte
      if (n === 12) { this.tremor = 3; Audio2.tone(160, 0.4, "sawtooth", 0.6); }
    }
    if (nome === "treinador" && n === 10) {   // a bola sai da mão
      Audio2.tone(700, 0.06, "square", 0.6);
    }
    if (nome === "treinador" && n === 14) {   // e abre
      this.flash = 0.8;
      this.tremor = 2.5;
      Audio2.heal();
    }
    // no duelo os dois se batem quatro vezes, cada vez mais perto
    if (nome === "duelo" && [4, 10, 16, 22].includes(n)) {
      this.investida++;
      this.flash = 0.6;
      this.tremor = 4;
      this.anel.push({ x: 120, y: 84, r: 4, v: 190, a: 0.9 });
      Audio2.hit();
      Glitch.hit(0.8);
    }
    if (nome === "rival" && n === 0) { this.tremor = 3; Audio2.tone(220, 0.18, "sawtooth", 0.6); }
    if (nome === "caos" && n % 3 === 0) { Glitch.hit(1.2); Audio2.glitch(); this.tremor = 3; }
  }

  // ------------------------------------------------------------------ render
  render(ctx) {
    ctx.fillStyle = "#0a0810";
    ctx.fillRect(0, 0, W, H);

    const nome = FASES[this.fase]?.nome;
    // o tremor é da CÂMERA, não do desenho: assim tudo treme junto e a tela
    // parece uma tela sendo sacudida, não um sprite mal posicionado
    const sx = this.tremor > 0 ? Math.round((Math.random() * 2 - 1) * this.tremor) : 0;
    const sy = this.tremor > 0 ? Math.round((Math.random() * 2 - 1) * this.tremor) : 0;
    ctx.save();
    ctx.translate(sx, sy);

    if (nome === "estudio") this.drawEstudio(ctx);
    if (nome === "fita") this.drawFita(ctx);
    if (nome === "mundo") this.drawMundo(ctx);
    if (nome === "corrida") this.drawCorrida(ctx);
    if (nome === "desfile") this.drawDesfile(ctx);
    if (nome === "lendarios") this.drawLendarios(ctx);
    if (nome === "treinador") this.drawTreinador(ctx);
    if (nome === "duelo") this.drawDuelo(ctx);
    if (nome === "rival") this.drawRival(ctx);
    if (nome === "caos") this.drawCaos(ctx);
    if (nome === "logo") this.drawLogo(ctx);

    this.drawAneis(ctx);
    ctx.restore();

    // as tarjas de cinema entram depois do estúdio e saem antes do logo
    const cine = nome !== "estudio" && nome !== "fita" && nome !== "logo";
    this.drawTarjas(ctx, cine ? 1 : 0);
    this.drawRiscos(ctx);

    // o aviso de pular, piscando devagar no rodapé — menos nos últimos instantes
    if (nome !== "logo" && Math.floor(this.t * 1.6) % 2 === 0) {
      const s = DB.STORY.abertura.pular;
      drawText(ctx, s, centro(s), H - 12, "#5a5470");
    }
    if (this.flash > 0) fade(ctx, this.flash, "#ffffff");
  }

  /** ondas de choque: o círculo que abre a cada pancada */
  drawAneis(ctx) {
    for (const a of this.anel) {
      ctx.globalAlpha = clamp01(a.a);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = clamp01(a.a * 0.6);
      ctx.strokeStyle = "#b455ff";
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r * 0.72, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  drawTarjas(ctx, k) {
    if (k <= 0) return;
    ctx.fillStyle = "#050409";
    ctx.fillRect(0, 0, W, Math.round(10 * k));
    ctx.fillRect(0, H - Math.round(10 * k), W, Math.round(10 * k));
  }

  /** as linhas de varredura: pouca coisa, só pra tela ter cara de tela */
  drawRiscos(ctx) {
    ctx.globalAlpha = 0.13;
    ctx.fillStyle = "#000000";
    for (let y = 0; y < H; y += 2) ctx.fillRect(0, y, W, 1);
    ctx.globalAlpha = 1;
  }

  /** legenda grande, centralizada, com sombra — a mesma pra todas as fases */
  legenda(ctx, texto, y, cor = "#f4f2ff", alpha = 1) {
    if (!texto || alpha <= 0) return;
    ctx.globalAlpha = clamp01(alpha);
    drawText(ctx, texto, centro(texto), y, cor, { shadow: "#12091f" });
    ctx.globalAlpha = 1;
  }

  // ------------------------------------------------------------------ fases

  /** o nome no escuro, entrando e saindo devagar, num campo de estrelas */
  drawEstudio(ctx) {
    const A = DB.STORY.abertura;
    const t = this.faseT / this.dur[0];
    for (let i = 0; i < 40; i++) {
      const x = (fixo(i, 1) * W + this.t * (4 + fixo(i, 2) * 8)) % W;
      const y = fixo(i, 3) * H;
      const brilho = 0.25 + fixo(i, 4) * 0.6;
      ctx.globalAlpha = brilho * Math.min(1, t * 3);
      ctx.fillStyle = i % 7 === 0 ? "#b455ff" : "#d8d4ff";
      ctx.fillRect(x | 0, y | 0, 1, 1);
    }
    ctx.globalAlpha = 1;

    const alpha = Math.min(1, Math.min(t, 1 - t) * 4);
    this.legenda(ctx, A.estudio, 66, "#f4f2ff", alpha);
    this.legenda(ctx, A.apresenta, 82, "#7a6f9c", alpha);

    // o risco que abre embaixo do nome, como quem sublinha
    const largura = Math.round(suave(clamp01(t * 1.6)) * 120);
    ctx.globalAlpha = alpha * 0.8;
    ctx.fillStyle = "#5b32b0";
    ctx.fillRect(120 - largura / 2, 78, largura, 1);
    ctx.globalAlpha = 1;
  }

  /** O CARTUCHO SENDO LIDO. É a fase que explica o subtítulo do jogo antes de
   *  qualquer texto: o rótulo aparece certo e se corrige pro nome errado. */
  drawFita(ctx) {
    const A = DB.STORY.abertura;
    const t = this.faseT / this.dur[1];

    // lixo de memória rolando atrás: blocos e dígitos, estáveis por linha
    const linha = Math.floor(this.t * 14);
    for (let y = 0; y < 12; y++) {
      const s = "0123456789ABCDEF█ ";
      let txt = "";
      for (let x = 0; x < 34; x++) txt += s[Math.floor(fixo(x + y * 41 + linha, 9) * s.length)];
      ctx.globalAlpha = 0.1 + fixo(y, 5) * 0.1;
      drawText(ctx, txt, 6, 6 + y * 13, "#2f8f5f");
    }
    ctx.globalAlpha = 1;

    // a barra de leitura descendo, e passando de novo
    const varre = ((this.faseT * 90) % (H + 40)) - 20;
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "#59d99b";
    ctx.fillRect(0, varre | 0, W, 1);
    ctx.globalAlpha = 0.14;
    ctx.fillRect(0, (varre - 6) | 0, W, 6);
    ctx.globalAlpha = 1;

    this.legenda(ctx, A.fitaLendo + ".".repeat(Math.floor(this.faseT * 3) % 4), 44, "#59d99b");

    // o rótulo: certo até a metade, depois trocado — e trocando na frente
    const trocou = t > 0.52;
    const rotulo = trocou ? A.fitaErrado : A.fitaCerto;
    const cor = trocou ? "#b455ff" : "#d8d4ff";
    const corta = trocou && Math.floor(this.t * 9) % 3 === 0;
    ctx.fillStyle = "#0a0810";
    ctx.fillRect(20, 68, 200, 22);
    this.legenda(ctx, rotulo, 74, cor);
    if (corta) {
      ctx.fillStyle = "#0a0810";
      ctx.fillRect(0, 76, W, 5);
      this.legenda(ctx, rotulo, 74 + 4, "#59d99b", 0.8);
    }

    if (t > 0.68) {
      const pisca = Math.floor(this.t * 6) % 2 === 0;
      this.legenda(ctx, A.fitaErro, 104, pisca ? "#ff6b6b" : "#8a3040");
    }
  }

  /** KANTO DE CIMA: céu, nuvem em duas velocidades, o mar, a terra — e a câmera
   *  descendo devagar, que é o que faz o desenho parado parecer sobrevoo. */
  drawMundo(ctx) {
    const A = DB.STORY.abertura;
    const t = this.faseT / this.dur[2];
    const desce = suave(t) * 34;                 // a câmera baixando

    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#123a7a");
    g.addColorStop(0.45, "#3f8fd8");
    g.addColorStop(1, "#a8dff0");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // o sol e o brilho em volta
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "#ffe9a8";
    ctx.beginPath();
    ctx.arc(196, 26 + desce * 0.3, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#fff6d0";
    ctx.beginPath();
    ctx.arc(196, 26 + desce * 0.3, 9, 0, Math.PI * 2);
    ctx.fill();

    // nuvem: a de cima corre mais que a de baixo, e é só isso que dá a altura
    for (let camada = 0; camada < 2; camada++) {
      const v = camada ? 26 : 12;
      const alt = camada ? 0.9 : 0.5;
      ctx.globalAlpha = camada ? 0.85 : 0.45;
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 9; i++) {
        const x = ((fixo(i, camada + 10) * (W + 80)) - this.t * v) % (W + 80);
        const y = 14 + fixo(i, camada + 20) * 54 + desce * alt;
        const w = 16 + fixo(i, camada + 30) * 26;
        ctx.fillRect((x < -40 ? x + W + 80 : x) | 0, y | 0, w, 3);
        ctx.fillRect(((x < -40 ? x + W + 80 : x) + 4) | 0, (y - 3) | 0, w - 8, 3);
      }
    }
    ctx.globalAlpha = 1;

    // o horizonte: mar, praia e mata, tudo subindo com a câmera
    const chao = 104 + desce;
    ctx.fillStyle = "#1c4f8a";
    ctx.fillRect(0, chao | 0, W, H);
    ctx.fillStyle = "#e8d9a0";
    ctx.fillRect(0, (chao + 14) | 0, W, 6);
    ctx.fillStyle = "#2f7a3c";
    ctx.fillRect(0, (chao + 20) | 0, W, H);
    for (let i = 0; i < 26; i++) {                 // as ilhas de Kanto, de longe
      const x = (i * 31 + Math.sin(i) * 13) % W;
      ctx.fillStyle = i % 3 ? "#256a33" : "#1d5528";
      ctx.fillRect(x | 0, (chao + 22 + (i % 5) * 6) | 0, 10 + (i % 4) * 8, 3);
    }

    // dois voadores cruzando: um perto e rápido, um longe e devagar
    const perto = Assets.mon("pidgeot", 7);
    const longe = Assets.mon("fearow", 7);
    if (longe) {
      ctx.globalAlpha = 0.55;
      ctx.drawImage(longe, Math.round(W - (this.faseT * 34) % (W + 90)), Math.round(24 + desce * 0.4), 28, 28);
      ctx.globalAlpha = 1;
    }
    if (perto) {
      const x = -70 + ((this.faseT * 86) % (W + 140));
      ctx.drawImage(perto, Math.round(x), Math.round(44 + Math.sin(this.t * 3) * 4 + desce * 0.6), 56, 56);
    }

    const entra = clamp01((t - 0.25) * 4) * clamp01((1 - t) * 5);
    this.legenda(ctx, A.mundo, 26, "#ffffff", entra);
  }

  /** um vulto correndo, com rastro e as linhas de velocidade fechando na tela */
  drawCorrida(ctx) {
    const t = this.faseT / this.dur[3];
    const x = -70 + t * (W + 90);

    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#2a1a48");
    g.addColorStop(1, "#120c22");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // linhas saindo do centro: a velocidade é isto aqui, não o sprite
    ctx.strokeStyle = "#4a3a80";
    ctx.lineWidth = 1;
    for (let i = 0; i < 22; i++) {
      const ang = fixo(i, 40) * Math.PI * 2;
      const d = ((fixo(i, 41) * 120) + this.t * 210) % 130;
      ctx.globalAlpha = clamp01(d / 130) * 0.8;
      ctx.beginPath();
      ctx.moveTo(120 + Math.cos(ang) * d, 80 + Math.sin(ang) * d * 0.7);
      ctx.lineTo(120 + Math.cos(ang) * (d + 14), 80 + Math.sin(ang) * (d + 14) * 0.7);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // as faixas de chão passam pra trás mais rápido que ele
    for (let i = 0; i < 9; i++) {
      const fx = ((i * 42) - this.t * 260) % (W + 40);
      ctx.fillStyle = i % 2 ? "#1a1630" : "#241d3e";
      ctx.fillRect((fx < 0 ? fx + W + 40 : fx) | 0, 104 + i * 3, 34, 2);
    }

    const img = Assets.mon("rapidash", 7);
    if (img) {
      const y = 58 + Math.sin(this.t * 15) * 3;
      for (let r = 3; r >= 0; r--) {           // o rastro: ele mesmo, mais atrás
        ctx.globalAlpha = r === 0 ? 1 : 0.16 * (4 - r);
        ctx.drawImage(img, Math.round(x - r * 13), Math.round(y), 68, 68);
      }
      ctx.globalAlpha = 1;
    }
  }

  /** O DESFILE: um por duas batidas. Entra branco chapado e vira desenho — é a
   *  troca de silhueta por bicho, a coisa mais antiga que uma abertura faz. */
  drawDesfile(ctx) {
    const i = Math.max(0, this.mostrado);
    const id = DESFILE[i % DESFILE.length];
    const t = this.trocaT / (this.compasso * 2);

    // leque girando atrás, trocando de cor a cada bicho
    const cores = ["#3a1d5c", "#1d3a5c", "#5c1d2e", "#1d5c3a", "#4a3a10", "#3a1d5c"];
    ctx.fillStyle = "#120a20";
    ctx.fillRect(0, 0, W, H);
    ctx.save();
    ctx.translate(120, 80);
    ctx.rotate(this.t * 0.5);
    ctx.fillStyle = cores[i % cores.length];
    for (let r = 0; r < 12; r++) {
      ctx.rotate(Math.PI / 6);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(200, -22);
      ctx.lineTo(200, 22);
      ctx.closePath();
      if (r % 2 === 0) ctx.fill();
    }
    ctx.restore();

    const img = Assets.mon(id, 7);
    if (img) {
      // entra grande e assenta: dá o "peso" do corte sem mover a câmera
      const tam = Math.round(120 - freia(clamp01(t * 2.2)) * 34);
      const x = Math.round(120 - tam / 2 + (i % 2 ? 1 : -1) * 14 * (1 - clamp01(t * 2)));
      const y = Math.round(80 - tam / 2);
      if (t < 0.22) {
        const sil = Assets.silhueta(img);
        ctx.globalAlpha = 1;
        if (sil) ctx.drawImage(sil, x, y, tam, tam);
      } else {
        ctx.drawImage(img, x, y, tam, tam);
      }
      ctx.globalAlpha = 1;
    }

    const nome = DB.SPECIES[id]?.name || id;
    this.legenda(ctx, nome, 126, "#ffe28a", clamp01(t * 4));
  }

  /** OS LENDÁRIOS: um a cada quatro batidas, e o quarto entra por baixo, com a
   *  tela roxa — quem jogou sabe qual é antes de ver o desenho. */
  drawLendarios(ctx) {
    const A = DB.STORY.abertura;
    const i = Math.max(0, this.mostrado);
    const id = LENDARIOS[i % LENDARIOS.length];
    const t = this.trocaT / (this.compasso * 4);
    const ultimo = i === LENDARIOS.length - 1;

    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, ultimo ? "#1a0630" : "#0a1a34");
    g.addColorStop(1, ultimo ? "#40106a" : "#0a2a4a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // faíscas subindo, mais denso no último
    ctx.fillStyle = ultimo ? "#b455ff" : "#8fd0f0";
    for (let k = 0; k < (ultimo ? 46 : 24); k++) {
      const x = fixo(k, 50 + i) * W;
      const y = (H - ((fixo(k, 60 + i) * H) + this.t * 60) % H) | 0;
      ctx.globalAlpha = 0.2 + fixo(k, 70) * 0.5;
      ctx.fillRect(x | 0, y, 1, 2);
    }
    ctx.globalAlpha = 1;

    const img = Assets.mon(id, 7);
    if (img) {
      if (ultimo) {
        // sobe do fundo da tela, crescendo
        const tam = Math.round(70 + suave(clamp01(t * 1.4)) * 60);
        const y = Math.round(H - suave(clamp01(t * 1.2)) * (tam + 26));
        ctx.drawImage(img, Math.round(120 - tam / 2), y, tam, tam);
      } else {
        // atravessa a tela, com um rastro curto
        const x = -80 + clamp01(t) * (W + 120);
        const y = 40 + Math.sin(this.t * 2.4 + i) * 8;
        for (let r = 2; r >= 0; r--) {
          ctx.globalAlpha = r === 0 ? 1 : 0.2 * (3 - r);
          ctx.drawImage(img, Math.round(x - r * 15), Math.round(y), 76, 76);
        }
        ctx.globalAlpha = 1;
      }
    }

    if (ultimo) this.legenda(ctx, A.lendarios, 24, "#e0c8ff", clamp01((t - 0.3) * 3));
  }

  /** O TREINADOR e a bola. A bola sai na batida 10 e abre na 14: é o único
   *  momento da abertura em que uma coisa é jogada e outra responde. */
  drawTreinador(ctx) {
    const A = DB.STORY.abertura;
    const t = this.faseT / this.dur[6];
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#f0c060");
    g.addColorStop(0.6, "#d06840");
    g.addColorStop(1, "#40203a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#2a1428";
    ctx.fillRect(0, 118, W, H - 118);

    // o treinador entra da esquerda e para
    const art = trainerArt("garoto");
    const entrada = suave(clamp01(t * 3));
    if (art) ctx.drawImage(art, Math.round(-60 + entrada * 76), 52, 68, 68);

    // a bola: sai da mão na batida 10, sobe em arco e abre na 14
    const b = this.faseT / this.compasso;
    if (b >= 10) {
      const k = clamp01((b - 10) / 4);
      const bx = 60 + k * 118;
      const by = 74 - Math.sin(k * Math.PI) * 46 + k * 12;
      if (k < 1) {
        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(k * 14);
        ctx.drawImage(Assets.ball, -6, -6, 12, 12);
        ctx.restore();
      } else {
        // abriu: o clarão vira o inicial, escolhido pelo trio da tela de título
        const inicial = (DB.STARTERS || ["charmander"])[0];
        const img = Assets.mon(inicial, 7);
        const abre = clamp01((b - 14) / 2);
        const tam = Math.round(40 + suave(abre) * 40);
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(178, 86, 10 + abre * 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        if (img) ctx.drawImage(img, Math.round(178 - tam / 2), Math.round(86 - tam / 2), tam, tam);
      }
    }

    this.legenda(ctx, A.treinador, 24, "#fff0c8", clamp01(t * 3) * clamp01((1 - t) * 4));
  }

  /** O DUELO: um de cada lado, se aproximando em pulsos. O da esquerda é visto
   *  de costas e o da direita de frente, como numa batalha — é essa moldura que
   *  faz a cena ser reconhecida na hora. */
  drawDuelo(ctx) {
    const chegada = Math.min(1, this.investida / 4);
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#1b1030");
    g.addColorStop(1, "#3a1d5c");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // o chão e o público: manchas escuras que pulsam na batida
    ctx.fillStyle = "#120a20";
    ctx.fillRect(0, 116, W, H - 116);
    const pulso = Math.floor(this.faseT / this.compasso) % 2 === 0 ? 1 : 0;
    ctx.fillStyle = pulso ? "#241640" : "#1d1136";
    for (let i = 0; i < 30; i++) ctx.fillRect((i * 9) % W, 108 + (i % 3) * 3, 5, 2);

    const salto = Math.abs(Math.sin(this.t * 5)) * 4;
    const esq = Assets.monBack("nidorino", 7);
    const dir = Assets.mon("gengar", 7);
    const tam = Math.round(64 + chegada * 16);
    if (esq) ctx.drawImage(esq, Math.round(2 + chegada * 46), Math.round(74 - salto), tam, tam);
    if (dir) ctx.drawImage(dir, Math.round(W - 2 - tam - chegada * 46), Math.round(26 + salto), tam, tam);

    // o risco de tensão entre os dois, fechando a cada investida
    const largura = Math.max(2, 74 - chegada * 66);
    ctx.fillStyle = "#b455ff";
    ctx.globalAlpha = 0.35 + chegada * 0.5;
    ctx.fillRect(Math.round(120 - largura / 2), 84, largura, 2);
    ctx.globalAlpha = 1;
  }

  /** O RIVAL. A tela racha na diagonal e ele fica do lado que sobrou. */
  drawRival(ctx) {
    const A = DB.STORY.abertura;
    const t = this.faseT / this.dur[8];
    const abre = suave(clamp01(t * 2.4));

    ctx.fillStyle = "#1a2c50";
    ctx.fillRect(0, 0, W, H);
    ctx.save();                                  // o lado dele, cortado na diagonal
    ctx.beginPath();
    ctx.moveTo(W, 0);
    ctx.lineTo(W, H);
    ctx.lineTo(Math.round(96 - abre * 20), H);
    ctx.lineTo(Math.round(136 - abre * 20), 0);
    ctx.closePath();
    ctx.clip();
    ctx.fillStyle = "#50202c";
    ctx.fillRect(0, 0, W, H);
    const art = trainerArt("rival");
    if (art) ctx.drawImage(art, Math.round(W - 46 - abre * 42), 46, 76, 76);
    ctx.restore();

    const meu = trainerArt("garoto");
    if (meu) ctx.drawImage(meu, Math.round(-30 + abre * 44), 50, 72, 72);

    // o risco da racha, tremendo
    ctx.strokeStyle = "#ffe28a";
    ctx.globalAlpha = 0.6 + Math.random() * 0.4;
    ctx.beginPath();
    ctx.moveTo(136 - abre * 20 + (Math.random() * 2 - 1), 0);
    ctx.lineTo(96 - abre * 20 + (Math.random() * 2 - 1), H);
    ctx.stroke();
    ctx.globalAlpha = 1;

    this.legenda(ctx, A.rival, 132, "#ffd8d8", clamp01((t - 0.2) * 3));
  }

  /** O CAOS: o cartucho desistindo. A tela vira fatia de coisa nenhuma e o que
   *  aparece no meio não é mais um Pokémon — é o que sobra de um. */
  drawCaos(ctx) {
    const A = DB.STORY.abertura;
    const t = this.faseT / this.dur[9];

    ctx.fillStyle = "#0a0810";
    ctx.fillRect(0, 0, W, H);

    // fatias horizontais de lixo, redesenhadas a cada 1/12 de segundo
    const q = Math.floor(this.t * 12);
    for (let i = 0; i < 30; i++) {
      const y = Math.floor(fixo(i + q * 7, 80) * H);
      const h = 1 + Math.floor(fixo(i + q * 7, 81) * 5);
      const cores = ["#b455ff", "#59d99b", "#ff6b6b", "#1d1136", "#f4f2ff"];
      ctx.globalAlpha = 0.2 + fixo(i + q, 82) * 0.5;
      ctx.fillStyle = cores[Math.floor(fixo(i + q, 83) * cores.length)];
      ctx.fillRect(0, y, W, h);
    }
    ctx.globalAlpha = 1;

    // o que sobrou de um sprite: o NULLMON, trocando de forma sem parar
    const nm = nullmonSprite(Math.floor(this.t * 9) * 37 + 11);
    if (nm) {
      const tam = Math.round(64 + Math.sin(this.t * 7) * 10);
      ctx.drawImage(nm, Math.round(120 - tam / 2), Math.round(76 - tam / 2), tam, tam);
    }

    // e um dos do desfile piscando por trás, como se a fita voltasse sozinha
    if (Math.floor(this.t * 6) % 4 === 0) {
      const img = Assets.mon(DESFILE[Math.floor(this.t * 3) % DESFILE.length], 7);
      ctx.globalAlpha = 0.35;
      if (img) ctx.drawImage(img, Math.round(80 + Math.random() * 60), 40, 64, 64);
      ctx.globalAlpha = 1;
    }

    const lixo = "0X" + Math.floor(fixo(q, 90) * 65535).toString(16).toUpperCase().padStart(4, "0");
    this.legenda(ctx, A.caos, 28, "#ff6b6b", clamp01(t * 3));
    this.legenda(ctx, lixo, 130, "#59d99b", 0.8);
  }

  /** O LOGO. Chega em fatias espalhadas que se juntam, e depois não fica quieto:
   *  perde uma faixa e se remonta, porque o jogo se chama GLITCH EDITION. */
  drawLogo(ctx) {
    const A = DB.STORY.abertura;
    const t = this.faseT;
    const junta = clamp01(t / 1.4);              // as fatias vindo pro lugar
    const solto = 1 - suave(junta);

    ctx.fillStyle = "#0a0810";
    ctx.fillRect(0, 0, W, H);

    // brilho atrás do logo, crescendo
    ctx.globalAlpha = 0.18 + Math.sin(this.t * 2) * 0.05;
    const rad = ctx.createRadialGradient(120, 62, 4, 120, 62, 110);
    rad.addColorStop(0, "#b455ff");
    rad.addColorStop(1, "#0a0810");
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;

    // as duas linhas do logo, cada uma chegando de um lado
    const x1 = Math.round(centro(A.titulo1) - solto * 90);
    const x2 = Math.round(centro(A.titulo2) + solto * 90);
    const treme = t > 1.6 && Math.floor(t * 7) % 3 === 0 ? 1 : 0;
    const dx = treme ? (Math.random() < 0.5 ? -2 : 2) : 0;

    ctx.globalAlpha = junta;
    drawText(ctx, A.titulo1, x1 + dx, 48, "#ffd166", { shadow: "#7a4a10" });
    drawText(ctx, A.titulo2, x2 - dx, 68, "#b455ff", { shadow: "#3a1060" });
    ctx.globalAlpha = 1;

    // a faixa que sai do lugar: o logo do jogo se recusando a ficar parado
    if (treme) {
      ctx.fillStyle = "#0a0810";
      ctx.fillRect(0, 54, W, 6);
      drawText(ctx, A.titulo1, x1 - dx * 3, 48, "#59d99b");
    }

    // o risco embaixo, abrindo do meio pros lados
    const largura = Math.round(suave(junta) * 140);
    ctx.fillStyle = "#5b32b0";
    ctx.fillRect(120 - largura / 2, 82, largura, 1);

    if (t > 2 && Math.floor(t * 2) % 2 === 0) {
      this.legenda(ctx, A.comece, 116, "#a99ec9");
    }
  }
}
