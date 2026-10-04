// Tela de evolução. Sai da batalha, entra aqui: fundo azul com fitas de DNA
// girando, o bicho aparece com o sprite normal, as barras de cinema descem,
// ele racha de luz e se desmancha nos pixels dele. Os pixels voam num
// redemoinho deixando rastro, se juntando e ficando brancos até desenhar a
// pixel art da forma nova. Ela treme no meio de raios e... BUUM: onda de
// choque, céu preto com fogos de artifício, a forma nova colorida entrando
// com um soco de zoom, faíscas e a fanfarra. A música (MUSIC.evolucao) tem
// 12,8 s e as fases somam isso: a virada da bateria cai bem no BUUM.
import { DB } from "../data/index.js";
import { Assets, makeCanvas } from "../core/assets.js";
import { Audio2 } from "../core/audio.js";
import { Glitch } from "../systems/glitchfx.js";
import { Dialogue } from "../systems/dialogue.js";
import { evolveTo } from "../systems/mon.js";
import { drawText, fade } from "../core/gfx.js";
import { isoLigado, palcoIso, cubosIso, bichoNoPalco } from "../core/isometrico.js";

const W = 240, H = 160;
const CX = W / 2, CY = 62;     // centro do sprite
const LADO = 64;               // tamanho do sprite na tela (1 pixel do sprite = 1 da tela)
const RACHA = 1.7;             // o bicho rachando de luz (1 compasso da música + a entrada)
const SEPARA = 2.4;            // segundos se desmanchando
const JUNTA = 5.5;             // segundos dos pixels voando até a forma nova
const CARREGA = 3.2;           // a forma nova branca tremendo antes do BUUM (a última frase)
const CLARAO = 0.5;            // tela branca antes de revelar
const ATRASO_S = 0.9;          // os pixels não se soltam todos juntos...
const ATRASO_J = 1.6;          // ...nem voam todos juntos
const FANFARRA = 3.0;          // duração da fanfarra do BUUM, até a música de festa
const BARRA = 18;              // altura das barras de cinema

// MUDANÇA DE FORMA (o CUBO ZYGARDE, src/data/extra.js): o mesmo filme, com
// outras palavras (`forma.inicio` / `forma.fim`) e outra cor. Cada tema troca
// o azul do DNA e o branco da luz pelas cores dele; o do ZYGARDE é o verde
// das células, que sobem pela tela como pontinhos com o núcleo escuro.
const TEMAS = {
  zygarde: {
    fundo: ["#010805", "#06301a"], ceu: ["#000", "#011008"],
    fita: "110,255,150", fita2: "40,190,100", degrau: "60,220,120",
    luz: "150,255,170", particula: "120,255,140", celulas: true,
  },
};

/** o som de quem não toca nada (o MODO FUNDO): qualquer chamada vira nada */
const MUDO = new Proxy({}, { get: () => () => 0 });

const suave = (t) => t * t * (3 - 2 * t);
const sai = (t) => 1 - (1 - t) * (1 - t);
const prende = (t) => Math.max(0, Math.min(1, t));

/** os pixels visíveis de um sprite, em coordenadas de tela, com a cor */
function pixelsDe(img) {
  const { ctx } = makeCanvas(LADO, LADO);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, 0, 0, LADO, LADO);
  const d = ctx.getImageData(0, 0, LADO, LADO).data;
  const out = [];
  const x0 = Math.round(CX - LADO / 2), y0 = Math.round(CY - LADO / 2);
  for (let y = 0; y < LADO; y++) {
    for (let x = 0; x < LADO; x++) {
      const i = (y * LADO + x) * 4;
      if (d[i + 3] < 100) continue;
      out.push({ x: x0 + x, y: y0 + y, r: d[i], g: d[i + 1], b: d[i + 2] });
    }
  }
  return out;
}

export class EvolutionScene {
  enter(args = {}) {
    const { mon, to, estranho = false, forma = null, fundo = false } = args;
    // MODO FUNDO (o fundo da tela de título, src/scenes/fundo-evolucoes.js): o
    // filme inteiro, mas mudo, sem caixa de texto, sem mexer em bicho nenhum,
    // sem tremer a tela do jogo e sempre reto — e ele não sai da pilha: quem
    // toca olha `terminou` e põe outra no lugar
    this.fundo = fundo;
    this.som = fundo ? MUDO : Audio2;
    this.gl = fundo ? { hit() {} } : Glitch;
    this.terminou = false;
    this.mon = mon;
    this.to = to;
    this.estranho = estranho;                       // pedra da fenda: evolução torta
    this.forma = forma;                             // mudança de forma, não evolução
    this.tema = forma ? TEMAS[forma.tema] || null : null;
    // já pede os dois sprites: o da forma nova pode ainda não ter carregado
    Assets.mon(mon.species, mon.seed);
    Assets.mon(to, mon.seed);
    this.nomeVelho = DB.SPECIES[mon.species].name;
    this.nomeNovo = DB.SPECIES[to].name;
    this.dlg = new Dialogue();
    this.t = 0;
    this.fase = "chegando";
    this.tf = 0;              // tempo dentro da fase atual
    this.pixels = [];
    this.particulas = [];
    this.aneis = [];
    this.raiosEletricos = [];
    this.riscos = [];
    this.fogos = [];          // foguetes e estouros, depois do BUUM
    this.tremor = 0;
    this.flash = 0;
    this.cinema = 0;          // 0..1: barras de cinema
    this.cinemaAlvo = 0;
    this.fadeA = 1;
    this.fadeDir = -1;
    // a camada dos pixels voando: escreve direto num ImageData, um por quadro
    const { cv, ctx } = makeCanvas(W, H);
    this.camada = cv;
    this.camadaCtx = ctx;
    this.camadaDados = ctx.createImageData(W, H);
    if (this.fundo) return;                         // começa sozinho, quando a arte chegar
    this.som.stopLoop();
    const abre = this.forma ? this.forma.inicio.replace("{MON}", this.mon.nickname)
      : `O QUÊ? ${this.mon.nickname} ESTÁ EVOLUINDO!`;
    this.dlg.say(abre, () => this.racha());
  }

  exit() { if (this.fundo) return; Glitch.burst = 0; Audio2.stopLoop(); }

  /** isométrico só no jogo: o fundo do título é sempre reto */
  iso() { return !this.fundo && isoLigado(); }
  bicho(ctx, img, x, y, w, h) {
    if (this.fundo) { if (img) ctx.drawImage(img, x, y, w, h); }
    else bichoNoPalco(ctx, img, x, y, w, h);
  }

  get velho() { return Assets.mon(this.mon.species, this.mon.seed); }
  get novo() { return Assets.mon(this.to, this.mon.seed); }

  mudaFase(f) { this.fase = f; this.tf = 0; }

  /** começa a cutscene: música, barras de cinema, o bicho rachando de luz */
  racha() {
    const de = pixelsDe(this.velho), para = pixelsDe(this.novo);
    if (!de.length || !para.length) return this.concluir();
    // na ordem da leitura (de cima pra baixo): a cabeça vira cabeça, o pé vira pé
    const n = Math.max(de.length, para.length);
    this.pixels = [];
    for (let k = 0; k < n; k++) {
      const a = de[Math.floor(k * de.length / n)];
      const b = para[Math.floor(k * para.length / n)];
      // espalha pra fora do centro, cada um num tanto
      const ang = Math.atan2(a.y - CY, a.x - CX) + (Math.random() - 0.5) * 0.9;
      const dist = 12 + Math.random() * 40;
      this.pixels.push({
        x0: a.x, y0: a.y, r: a.r, g: a.g, b: a.b,
        sx: a.x + Math.cos(ang) * dist, sy: a.y + Math.sin(ang) * dist * 0.85,
        tx: b.x, ty: b.y,
        racha: Math.random(),                         // quando esse pixel acende
        atrasoS: Math.random() * ATRASO_S,            // começa a se soltar
        atrasoJ: Math.random() * ATRASO_J,            // começa a voar pra forma nova
        giro: (Math.random() < 0.5 ? -1 : 1) * (8 + Math.random() * 22),
        roxo: this.estranho && Math.random() < 0.25,
      });
    }
    this.mudaFase("rachando");
    this.cinemaAlvo = 1;
    this.som.playMusic("evolucao", DB.MUSIC?.evolucao);
  }

  update(dt) {
    this.t += dt;
    this.tf += dt;
    if (this.fadeDir) {
      this.fadeA = Math.max(0, Math.min(1, this.fadeA + this.fadeDir * dt * 3));
      if (this.fadeDir < 0 && this.fadeA <= 0) this.fadeDir = 0;
    }
    this.cinema += (this.cinemaAlvo - this.cinema) * Math.min(1, dt * 4);
    this.dlg.update(dt);
    if (this.fundo && this.fase === "chegando" && this.tf > 1 && this.velho && this.novo) this.racha();
    if (this.fundo && this.fase === "pronto" && this.tf > 4) this.terminou = true;
    if (this.saindo && this.fadeA >= 1) {
      this.saindo = false;
      this.game.scenes.pop();
      return;
    }
    if (this.flash > 0 && this.fase !== "clarao") this.flash = Math.max(0, this.flash - dt * 1.6);
    if (this.tremor > 0 && this.fase !== "carregando" && this.fase !== "rachando") {
      this.tremor = Math.max(0, this.tremor - dt * 8);
    }

    if (this.fase === "rachando") {
      this.tremor = this.tf / RACHA * 1.5;
      if (this.tf >= RACHA) {
        this.mudaFase("separando");
        this.flash = 0.5;
        this.aneis.push({ r: 20, a: 1 });
        this.som.noise(0.3, 0.5);
      }
    } else if (this.fase === "separando") {
      if (this.tf >= SEPARA) this.mudaFase("juntando");
    } else if (this.fase === "juntando") {
      const k = this.tf / JUNTA;
      this.solta(dt, 12 + 30 * k);
      this.risca(dt, 10 + 50 * k);
      if (k > 0.6 && Math.random() < dt * 3) this.raioEletrico();
      if (this.estranho && Math.random() < dt * 2.5) this.gl.hit(0.4);
      if (this.tf >= JUNTA) {
        this.mudaFase("carregando");
        this.aneis.push({ r: 4, a: 0.8 });
      }
    } else if (this.fase === "carregando") {
      const k = this.tf / CARREGA;
      this.tremor = 1 + k * 4;
      if (Math.random() < dt * (3 + k * 10)) this.aneis.push({ r: 40, a: 0.5, dentro: true });
      if (Math.random() < dt * (6 + k * 20)) this.raioEletrico();
      this.solta(dt, 70);
      this.risca(dt, 80);
      if (this.tf >= CARREGA) this.buum();
    } else if (this.fase === "clarao") {
      this.flash = 1;
      if (this.tf >= CLARAO) this.concluir();
    } else if (this.fase === "pronto") {
      // brilhinhos em volta do bicho novo, um tempinho depois do clarão
      if (this.tf < 1.6 && Math.random() < dt * 10) this.particulas.push(this.brilho());
      // fanfarra acabou (7,5 tempos a 150 bpm) e a frase ainda na tela: festa
      if (!this.festa && !this.saindo && this.tf >= FANFARRA) {
        this.festa = true;
        if (DB.MUSIC?.evolucao_festa) this.som.playMusic("evolucao_festa", DB.MUSIC.evolucao_festa);
      }
      // fogos de artifício no céu preto até a tela fechar
      if (Math.random() < dt * (this.tf < 1 ? 5 : 2.2)) this.soltaFoguete();
    }
    this.atualizaFogos(dt);

    for (const q of this.particulas) q.update(dt);
    this.particulas = this.particulas.filter((q) => q.vida > 0);
    for (const a of this.aneis) {
      a.r += dt * (a.dentro ? -70 : a.choque ? 260 : 120);
      a.a -= dt * (a.dentro ? 1.4 : 1.1);
      if (a.r < 0) a.a = 0;
    }
    this.aneis = this.aneis.filter((a) => a.a > 0);
    for (const r of this.raiosEletricos) r.vida -= dt;
    this.raiosEletricos = this.raiosEletricos.filter((r) => r.vida > 0);
    for (const r of this.riscos) r.r -= r.v * dt;
    this.riscos = this.riscos.filter((r) => r.r > 20);
  }

  /** um foguete subindo do pé da tela, que estoura lá em cima */
  soltaFoguete() {
    const cores = ["255,230,90", "120,220,255", "160,255,140", "255,140,220", "255,255,255", "255,170,60"];
    this.fogos.push({
      x: 16 + Math.random() * (W - 32), y: H + 2, vy: -(110 + Math.random() * 50),
      alvo: 14 + Math.random() * 60, cor: cores[Math.floor(Math.random() * cores.length)],
      faiscas: null, vida: 1,
    });
  }

  atualizaFogos(dt) {
    for (const f of this.fogos) {
      if (!f.faiscas) {
        f.y += f.vy * dt;
        if (f.y <= f.alvo) {
          // estourou: um círculo de faíscas que caem
          const n = 26 + Math.floor(Math.random() * 14), v = 40 + Math.random() * 30;
          f.faiscas = Array.from({ length: n }, (_, i) => {
            const a = (i / n) * Math.PI * 2 + Math.random() * 0.2;
            return { x: f.x, y: f.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v };
          });
          if (Math.random() < 0.6) this.som.noise(0.12, 0.25);
        }
      } else {
        f.vida -= dt * 0.8;
        for (const q of f.faiscas) {
          q.x += q.vx * dt; q.y += q.vy * dt;
          q.vx *= 1 - dt * 1.5; q.vy = q.vy * (1 - dt * 1.5) + 30 * dt;
        }
      }
    }
    this.fogos = this.fogos.filter((f) => f.vida > 0);
  }

  /** fundo de antes do BUUM: azul, com fitas de DNA girando e subindo */
  fundoDNA(ctx, energia) {
    const T = this.tema;
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, T ? T.fundo[0] : this.estranho ? "#1a0a3a" : "#06102e");
    g.addColorStop(1, T ? T.fundo[1] : this.estranho ? "#2c1060" : "#0c2a6a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    if (T?.celulas) this.celulas(ctx, energia);
    const fitas = [[22, 0], [64, 1.7], [176, 3.1], [218, 4.4]];
    const vel = 1.2 + energia * 5;
    for (const [fx, off] of fitas) {
      for (let y = -4; y < H + 4; y += 3) {
        const fase = y * 0.11 + this.t * vel + off;
        const sn = Math.sin(fase), cs = Math.cos(fase);
        const a = Math.round(fx + sn * 11), b = Math.round(fx - sn * 11);
        // degraus ligando as duas fitas
        if (Math.floor((y + 400) / 3) % 3 === 0) {
          ctx.fillStyle = `rgba(${T ? T.degrau : "120,180,255"},${0.18 + 0.15 * energia})`;
          ctx.fillRect(Math.min(a, b), y, Math.abs(a - b), 1);
        }
        // a fita da frente mais clara que a de trás
        const frente = 0.55 + 0.35 * energia, tras = 0.22 + 0.15 * energia;
        ctx.fillStyle = `rgba(${T ? T.fita : "150,220,255"},${cs > 0 ? frente : tras})`;
        ctx.fillRect(a, y, 2, 2);
        ctx.fillStyle = `rgba(${T ? T.fita2 : "110,160,255"},${cs > 0 ? tras : frente})`;
        ctx.fillRect(b, y, 2, 2);
      }
    }
  }

  /** as CÉLULAS do ZYGARDE: pontinhos verdes com o núcleo escuro subindo
   *  pela tela, mais rápidos e mais claros com mais energia */
  celulas(ctx, energia) {
    for (let i = 0; i < 46; i++) {
      const x = (i * 53 + Math.sin(i * 7.3 + this.t) * 6 + 400) % W;
      const y = H - ((i * 37 + this.t * (14 + energia * 60) * (0.6 + (i % 5) * 0.15)) % (H + 8));
      const a = 0.35 + 0.5 * energia * (0.5 + 0.5 * Math.sin(this.t * 4 + i));
      ctx.fillStyle = `rgba(${this.tema.fita},${a})`;
      ctx.fillRect(Math.round(x) - 1, Math.round(y), 3, 1);
      ctx.fillRect(Math.round(x), Math.round(y) - 1, 1, 3);
      ctx.fillStyle = `rgba(0,30,10,${a})`;
      ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    }
  }

  /** fundo de depois do BUUM: céu preto, com os fogos */
  fundoFogos(ctx) {
    const T = this.tema;
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, T ? T.ceu[0] : this.estranho ? "#0a0410" : "#000");
    g.addColorStop(1, T ? T.ceu[1] : this.estranho ? "#1a0828" : "#0a0a12");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    for (const f of this.fogos) {
      if (!f.faiscas) {
        ctx.fillStyle = "rgba(255,240,200,.9)";
        ctx.fillRect(Math.round(f.x), Math.round(f.y), 1, 3);
        ctx.fillStyle = "rgba(255,200,120,.4)";
        ctx.fillRect(Math.round(f.x), Math.round(f.y) + 3, 1, 4);
      } else {
        const a = Math.max(0, Math.min(1, f.vida * 1.4));
        const pisca = f.vida < 0.4 && Math.random() < 0.4;
        if (pisca) continue;
        ctx.fillStyle = `rgba(${f.cor},${a})`;
        for (const q of f.faiscas) ctx.fillRect(Math.round(q.x), Math.round(q.y), 1, 1);
      }
    }
  }

  /** BUUM! */
  buum() {
    this.mudaFase("clarao");
    this.flash = 1;
    this.tremor = 7;
    this.pixels = [];
    this.raiosEletricos = [];
    this.som.stopLoop();
    this.som.noise(0.6, 1);
    this.som.tone(70, 0.5, "sawtooth", 0.8);
    this.gl.hit(this.estranho ? 2.4 : 0.8);
  }

  /** raio elétrico zigue-zague da borda da tela até o bicho */
  raioEletrico() {
    const ang = Math.random() * Math.PI * 2;
    const pts = [];
    const passos = 9;
    for (let i = 0; i <= passos; i++) {
      const k = i / passos, r = 150 * (1 - k) + 10 * k;
      const torto = i === 0 || i === passos ? 0 : (Math.random() - 0.5) * 16;
      pts.push([CX + Math.cos(ang) * r - Math.sin(ang) * torto, CY + Math.sin(ang) * r + Math.cos(ang) * torto]);
    }
    this.raiosEletricos.push({ pts, vida: 0.09 + Math.random() * 0.08 });
    if (Math.random() < 0.4) this.som.noise(0.05, 0.25);
  }

  /** riscos de "hiperespaço" correndo pro centro, `taxa` por segundo */
  risca(dt, taxa) {
    let n = taxa * dt;
    while (n > 0) {
      if (Math.random() < n) {
        this.riscos.push({ ang: Math.random() * Math.PI * 2, r: 140 + Math.random() * 40, v: 200 + Math.random() * 200 });
      }
      n -= 1;
    }
  }

  /** bolinhas de luz entrando em espiral pro centro, `taxa` por segundo */
  solta(dt, taxa) {
    let n = taxa * dt;
    while (n > 0) {
      if (Math.random() < n) {
        const ang = Math.random() * Math.PI * 2;
        const r = 70 + Math.random() * 40;
        const giro = (this.estranho ? -1 : 1) * (1.2 + Math.random());
        this.particulas.push({
          ang, r, vida: 1, tam: Math.random() < 0.3 ? 2 : 1,
          get x() { return CX + Math.cos(this.ang) * this.r; },
          get y() { return CY + Math.sin(this.ang) * this.r * 0.8; },
          update(dt) {
            this.ang += giro * dt;
            this.r -= dt * (60 + (110 - this.r) * 1.2);
            if (this.r < 6) this.vida = 0;
          },
        });
      }
      n -= 1;
    }
  }

  /** faísca saindo do centro pra fora, caindo um pouco */
  faisca() {
    const ang = Math.random() * Math.PI * 2;
    const v = 70 + Math.random() * 160;
    const cores = ["255,255,255", "255,240,140", "255,190,90", "160,220,255"];
    return {
      x: CX, y: CY, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v, vida: 1,
      tam: Math.random() < 0.4 ? 2 : 1, cor: cores[Math.floor(Math.random() * cores.length)],
      update(dt) {
        this.x += this.vx * dt; this.y += this.vy * dt;
        this.vx *= 1 - dt * 1.8; this.vy *= 1 - dt * 1.8;
        this.vy += 40 * dt;
        this.vida -= dt * 0.7;
      },
    };
  }

  /** brilho piscando parado em algum lugar em volta do sprite */
  brilho() {
    const ang = Math.random() * Math.PI * 2, r = 18 + Math.random() * 22;
    return {
      x: CX + Math.cos(ang) * r, y: CY + Math.sin(ang) * r, vida: 1, cruz: true,
      update(dt) { this.vida -= dt * 1.8; },
    };
  }

  /** aplica a evolução de verdade e anuncia */
  concluir() {
    this.mudaFase("pronto");
    this.flash = 1;
    this.tremor = 4;
    this.cinemaAlvo = 0;
    for (let i = 0; i < 70; i++) this.particulas.push(this.faisca());
    this.aneis.push({ r: 10, a: 1, choque: true }, { r: 2, a: 0.9, choque: true }, { r: 6, a: 0.8 });
    if (this.fundo) return;                          // no fundo é só o filme: ninguém evolui
    const st = this.game.state;
    const evo = evolveTo(this.mon, this.to);
    if (evo) {
      st.seen[this.mon.species] = true;
      st.caught[this.mon.species] = true;
    }
    if (this.estranho) this.gl.hit(1.2);
    if (DB.MUSIC?.evolucao_fanfarra) this.som.playSong(DB.MUSIC.evolucao_fanfarra);
    else this.som.heal();
    this.festa = false;       // a música de festa entra quando a fanfarra acaba
    this.game.autosave?.(true);
    const fecha = this.forma
      ? this.forma.fim.replace("{MON}", this.mon.nickname).replace("{NOVO}", this.nomeNovo)
      : `PARABÉNS! SEU ${this.nomeVelho} EVOLUIU PARA ${this.nomeNovo}!`;
    this.dlg.say(fecha, () => {
      this.som.stopLoop();      // passou a frase: a festa acaba
      this.fadeDir = 1;
      this.saindo = true;
    });
  }

  /** os pixels, onde estiverem agora, direto no ImageData — o que já estava
   *  lá vai apagando devagar, e é isso que deixa o rastro */
  desenhaPixels(ctx) {
    const d = this.camadaDados.data;
    const rastro = this.fase === "rachando" ? 0 : this.fase === "carregando" ? 0.5 : 0.72;
    for (let i = 3; i < d.length; i += 4) if (d[i]) d[i] = d[i] * rastro;
    const cubos = this.iso() && this.baseIso ? [] : null;
    for (const p of this.pixels) {
      let x, y, branco;
      if (this.fase === "rachando") {
        // as rachaduras de luz vão se espalhando pelo corpo
        const k = this.tf / RACHA;
        x = p.x0; y = p.y0;
        branco = p.racha < k * k ? 0.6 + 0.4 * Math.abs(Math.sin(this.t * 14 + p.racha * 9)) : 0;
      } else if (this.fase === "separando") {
        const k = sai(prende((this.tf - p.atrasoS) / (SEPARA - ATRASO_S)));
        x = p.x0 + (p.sx - p.x0) * k;
        y = p.y0 + (p.sy - p.y0) * k + Math.sin(this.t * 6 + p.x0) * k;   // boiando
        branco = 0.6 * (1 - k) + 0.1 * k;   // a luz da rachadura apagando
      } else if (this.fase === "juntando") {
        const k = suave(prende((this.tf - p.atrasoJ) / (JUNTA - ATRASO_J)));
        // sai do ponto espalhado, faz uma curva até o lugar na forma nova...
        const curva = Math.sin(Math.PI * k) * p.giro;
        const dx = p.tx - p.sx, dy = p.ty - p.sy, len = Math.hypot(dx, dy) || 1;
        const bx = p.sx + dx * k - (dy / len) * curva;
        const by = p.sy + dy * k + (dx / len) * curva;
        // ...e o redemoinho em volta do centro, que vai parando quando chega
        const giro = (1 - k) * (1 - k) * Math.PI * 1.6 * (this.estranho ? -1 : 1);
        const cs = Math.cos(giro), sn = Math.sin(giro);
        x = CX + (bx - CX) * cs - (by - CY) * sn;
        y = CY + (bx - CX) * sn + (by - CY) * cs;
        branco = 0.1 + 0.9 * Math.min(1, k * 1.5);
      } else {
        x = p.tx; y = p.ty; branco = 1;
      }
      if (cubos) {
        const roxo = p.roxo && branco > 0.5 && Math.random() < 0.5;
        cubos.push(roxo ? [x, y, 190, 90, 255]
          : [x, y, p.r + (255 - p.r) * branco, p.g + (255 - p.g) * branco, p.b + (255 - p.b) * branco]);
        continue;
      }
      const xi = Math.round(x), yi = Math.round(y);
      if (xi < 0 || yi < 0 || xi >= W || yi >= H) continue;
      const i = (yi * W + xi) * 4;
      if (p.roxo && branco > 0.5 && Math.random() < 0.5) {
        d[i] = 190; d[i + 1] = 90; d[i + 2] = 255;
      } else {
        d[i] = p.r + (255 - p.r) * branco;
        d[i + 1] = p.g + (255 - p.g) * branco;
        d[i + 2] = p.b + (255 - p.b) * branco;
      }
      d[i + 3] = 255;
    }
    if (cubos) return cubosIso(ctx, cubos, this.baseIso, CX, CY + LADO / 2);
    this.camadaCtx.putImageData(this.camadaDados, 0, 0);
    ctx.drawImage(this.camada, 0, 0);
  }

  /** raios de luz girando atrás do sprite */
  raios(ctx, forca) {
    if (forca <= 0) return;
    const n = 12, giro = this.t * (0.4 + forca * 1.6) * (this.estranho ? -1 : 1);
    // na carga, a luz fica trocando de cor
    const cor = this.fase === "carregando"
      ? `hsla(${(this.t * 360) % 360},100%,80%,${0.22 * forca})`
      : this.tema ? `rgba(${this.tema.luz},${0.18 * forca})`
      : this.estranho ? `rgba(190,110,255,${0.18 * forca})` : `rgba(255,250,210,${0.16 * forca})`;
    ctx.fillStyle = cor;
    for (let i = 0; i < n; i++) {
      const a = giro + (i / n) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(CX, CY);
      ctx.lineTo(CX + Math.cos(a - 0.11) * 200, CY + Math.sin(a - 0.11) * 200);
      ctx.lineTo(CX + Math.cos(a + 0.11) * 200, CY + Math.sin(a + 0.11) * 200);
      ctx.closePath();
      ctx.fill();
    }
  }

  render(ctx) {
    // quanto de "energia" tem na tela: sobe enquanto os pixels se juntam
    const energia = this.fase === "rachando" ? 0.15 * (this.tf / RACHA)
      : this.fase === "separando" ? 0.15 + 0.1 * (this.tf / SEPARA)
      : this.fase === "juntando" ? 0.25 + 0.45 * (this.tf / JUNTA)
      : this.fase === "carregando" || this.fase === "clarao" ? 0.7 + 0.3 * Math.min(1, this.tf / CARREGA)
      : this.fase === "pronto" ? Math.max(0, 0.7 - this.tf * 0.3) : 0;

    if (this.fase === "pronto") this.fundoFogos(ctx);
    else this.fundoDNA(ctx, energia);
    // NO ISOMÉTRICO: o palco inclinado (sem chão), e os pixels viram cubinhos
    const iso = this.iso(), PE = CY + LADO / 2;

    ctx.save();
    if (this.tremor > 0) {
      ctx.translate(Math.round((Math.random() - 0.5) * this.tremor), Math.round((Math.random() - 0.5) * this.tremor));
    }
    if (iso) { this.baseIso = ctx.getTransform(); palcoIso(ctx, CX, PE); }
    this.raios(ctx, energia);

    // riscos de hiperespaço
    ctx.strokeStyle = this.tema ? `rgba(${this.tema.luz},.5)` : this.estranho ? "rgba(200,140,255,.55)" : "rgba(255,255,255,.45)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (const r of this.riscos) {
      const c = Math.cos(r.ang), s = Math.sin(r.ang), len = Math.min(26, r.v * 0.06);
      ctx.moveTo(CX + c * r.r, CY + s * r.r * 0.8);
      ctx.lineTo(CX + c * (r.r + len), CY + s * (r.r + len) * 0.8);
    }
    ctx.stroke();

    // brilho atrás do sprite, pulsando mais rápido com mais energia
    const raio = 46 + Math.sin(this.t * (3 + 12 * energia)) * (3 + 6 * energia);
    const g = ctx.createRadialGradient(CX, CY, 4, CX, CY, raio);
    const forte = 0.3 + 0.45 * energia;
    g.addColorStop(0, this.tema ? `rgba(${this.tema.luz},${forte + 0.1})`
      : this.estranho ? `rgba(180,85,255,${forte + 0.2})` : `rgba(255,255,255,${forte})`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(CX - raio, CY - raio, raio * 2, raio * 2);

    // anéis de luz (os de choque, grossos)
    for (const a of this.aneis) {
      ctx.lineWidth = a.choque ? 3 : 1;
      ctx.strokeStyle = this.tema ? `rgba(${this.tema.luz},${a.a})`
        : this.estranho ? `rgba(200,120,255,${a.a})` : `rgba(255,255,255,${a.a})`;
      ctx.beginPath();
      ctx.ellipse(CX, CY, a.r, a.r * 0.8, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.lineWidth = 1;

    // raios elétricos: um contorno largo e fraco e o miolo fino e forte
    for (const r of this.raiosEletricos) {
      for (const [lw, cor] of [[3, this.estranho ? "rgba(190,90,255,.5)" : "rgba(140,200,255,.5)"], [1, "#fff"]]) {
        ctx.lineWidth = lw;
        ctx.strokeStyle = cor;
        ctx.beginPath();
        r.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        ctx.stroke();
      }
    }
    ctx.lineWidth = 1;

    // o bicho: sprite normal parado, ou os pixels dele voando
    const flutua = Math.round(Math.sin(this.t * 2.2) * 2);
    const x0 = Math.round(CX - LADO / 2), y0 = Math.round(CY - LADO / 2);
    if (this.fase === "chegando") {
      this.bicho(ctx, this.velho, x0, y0 + flutua, LADO, LADO);
    } else if (this.fase === "pronto") {
      // a forma nova entra com um soco de zoom e balança até assentar
      const z = 1 + 0.6 * Math.exp(-6 * this.tf) * Math.cos(14 * this.tf);
      const lado = Math.round(LADO * z);
      const x = Math.round(CX - lado / 2), y = Math.round(CY - lado / 2) + flutua;
      this.bicho(ctx, this.novo, x, y, lado, lado);
      const k = Math.max(0, 1 - this.tf * 1.5);
      if (k > 0) {
        ctx.globalAlpha = k;
        ctx.drawImage(Assets.silhueta(this.novo), x, y, lado, lado);
        ctx.globalAlpha = 1;
      }
    } else if (this.pixels.length) {
      // na rachadura, um contorno de luz pulsando em volta do bicho
      if (this.fase === "rachando") {
        const sil = Assets.silhueta(this.velho);
        ctx.globalAlpha = (this.tf / RACHA) * (0.5 + 0.5 * Math.sin(this.t * 18));
        for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) ctx.drawImage(sil, x0 + dx, y0 + dy, LADO, LADO);
        ctx.globalAlpha = 1;
      }
      this.desenhaPixels(ctx);
    }

    // partículas
    for (const q of this.particulas) {
      const a = Math.max(0, Math.min(1, q.vida * 1.5));
      ctx.fillStyle = q.cor ? `rgba(${q.cor},${a})`
        : this.tema ? `rgba(${this.tema.particula},${a})`
        : this.estranho ? `rgba(${200 + Math.random() * 55 | 0},120,255,${a})`
        : `rgba(255,255,${200 + (q.tam === 2 ? 55 : 0)},${a})`;
      const x = Math.round(q.x), y = Math.round(q.y);
      if (q.cruz) {
        const s = q.vida > 0.5 ? 2 : 1;
        ctx.fillRect(x - s, y, s * 2 + 1, 1);
        ctx.fillRect(x, y - s, 1, s * 2 + 1);
      } else {
        ctx.fillRect(x, y, q.tam, q.tam);
      }
    }
    ctx.restore();

    // barras de cinema
    if (this.cinema > 0.01) {
      const h = Math.round(BARRA * this.cinema);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, h);
      ctx.fillRect(0, H - h, W, h);
    }

    if (this.fase === "pronto") {
      // branco com sombra, pra ler em cima dos fogos
      const nx = CX - this.nomeNovo.length * 3;
      drawText(ctx, this.nomeNovo, nx + 1, 103, "#333");
      drawText(ctx, this.nomeNovo, nx, 102, "#fff");
    }

    this.dlg.render(ctx);

    if (this.flash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${Math.min(1, this.flash)})`;
      ctx.fillRect(0, 0, W, H);
    }
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }
}
