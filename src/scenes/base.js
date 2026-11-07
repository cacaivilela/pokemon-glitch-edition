// DENTRO DA BASE SECRETA (src/data/bases.js): o quarto de 15 x 10 blocos, com
// a parede em cima, a porta embaixo no meio e o PC DA BASE no canto. O dono
// anda, decora pelo PC (DECORAR: escolhe o móvel e põe com o cursor; TIRAR
// MÓVEL: volta pra mochila) e escolhe os POKÉMON SOLTOS, que andam pelo
// quarto. Quem VISITA (pelo online) só anda e olha.
//
//   game.scenes.push(new BaseScene(), { base, regiao, dono, visita })
import { DB } from "../data/index.js";
import { Assets } from "../core/assets.js";
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { Opcoes } from "../core/opcoes.js";
import { drawText, fade, PAL } from "../core/gfx.js";
import { Dialogue } from "../systems/dialogue.js";
import { Online } from "../systems/online.js";
import { reduzido } from "../core/reduzir.js";
import { makeCanvas } from "../core/assets.js";
import { loadImage } from "../core/sprites.js";
import { url } from "../core/base.js";
import { desenhoDoMovel, desenhoDoPC } from "../core/moveis.js";
import { todosGuardados } from "../systems/box.js";
import { livreParaAndar, movelEm, podePor, porMovel, tirarMovel, moveisNaMochila, tamanho } from "../systems/bases.js";

const W = 240, H = 160, T = 16;
// O DOBRO DE POSIÇÕES (o CAIO): quem anda é desenhado em MEIO pixel — 32
// lugares pra ficar em cada bloco, e não 16 (a tela é 3x por dentro, ESCALA_TELA)
const meio = (v) => Math.round(v * 2) / 2;
// A VELOCIDADE DA BASE: a do mapa (16 quadros por bloco andando, 8 correndo
// com SHIFT), mas a opção de VELOCIDADE só acelera até 1,4x — o quarto é
// pequeno: com 16 quadros o CAIO achou lento, com a velocidade dele inteira
// virou "um jato"
const WALK = 16, RUN = 8;
const passoMapa = (base) => Math.max(2, Math.round(base / Math.min(1.4, Math.max(1.4, Opcoes.get("velocidade") || 1)))) / 60;
const JETPACK = 4;                  // pulo do ROBÔ maior que isso (em blocos): liga a JETPACK
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

/** as FOLHAS DE POSES dos robôs (src/data/bases.js, `folha`), quando chegam */
const folhas = new Map();
function folhaDe(caminho) {
  if (!folhas.has(caminho)) { folhas.set(caminho, null); loadImage(url(caminho)).then((img) => folhas.set(caminho, img || false)); }
  return folhas.get(caminho) || null;
}

/** um sorteio que sempre dá a mesma coisa (a caverna não muda a cada vez) */
function sorteio(semente) {
  let s = semente >>> 0 || 1;
  return () => ((s = (s * 1103515245 + 12345) >>> 0) / 4294967296);
}

/** O FUNDO DA CAVERNA: chão de terra com pedrinhas, a parede de pedra em
 *  cima (com estalactites) e embaixo (com a boca da caverna na porta), e a
 *  sombra nas bordas. Com `tile` (o desenho de parede do CAIO), a parede é ele
 *  repetido; sem, pedras sorteadas — e em Braglitch, com musgo. */
function fundoCaverna(cor, tile) {
  const Q = DB.QUARTO, { cv, ctx } = makeCanvas(W, H), r = sorteio(7);
  const [pe, pm, pc] = cor.pedra, [c0, c1, c2] = cor.chao;
  // o chão: terra pintadinha e umas pedrinhas
  ctx.fillStyle = c0; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 900; i++) { ctx.fillStyle = r() < 0.5 ? c1 : c2; ctx.fillRect(Math.floor(r() * W), Math.floor(r() * H), 1, 1); }
  for (let i = 0; i < 26; i++) {
    const x = Math.floor(r() * W), y = Q.parede * T + Math.floor(r() * (H - Q.parede * T - T));
    ctx.fillStyle = pe; ctx.fillRect(x, y + 1, 3, 1);
    ctx.fillStyle = pm; ctx.fillRect(x, y, 3, 1);
  }
  // a PAREDE: as linhas de cima e a de baixo (menos a boca da caverna)
  const parede = (x0, y0, w, h) => {
    if (tile) { for (let y = y0; y < y0 + h; y += T) for (let x = x0; x < x0 + w; x += T) ctx.drawImage(tile, x, y, T, T); return; }
    ctx.fillStyle = pe; ctx.fillRect(x0, y0, w, h);
    // pedras redondas umas por cima das outras, com luz em cima
    for (let i = 0; i < (w * h) / 40; i++) {
      const x = x0 + r() * w, y = y0 + r() * h, rr = 3 + r() * 5;
      ctx.fillStyle = pm; ctx.beginPath(); ctx.ellipse(x, y, rr, rr * 0.75, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = pc; ctx.fillRect(Math.round(x - rr / 2), Math.round(y - rr * 0.6), Math.max(1, Math.round(rr * 0.8)), 1);
      // o MUSGO (Braglitch): por cima das pedras
      if (cor.musgo && r() < 0.45) {
        ctx.fillStyle = cor.musgo[r() < 0.5 ? 0 : 1];
        ctx.fillRect(Math.round(x - rr), Math.round(y - rr * 0.75), Math.round(rr * 1.4), 2);
        ctx.fillStyle = cor.musgo[2]; ctx.fillRect(Math.round(x - rr + 1), Math.round(y - rr * 0.75), 2, 1);
      }
    }
    // rachaduras
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    for (let i = 0; i < w / 20; i++) { let x = x0 + r() * w, y = y0 + r() * h; for (let k = 0; k < 6; k++) { ctx.fillRect(Math.round(x), Math.round(y), 1, 1); x += r() * 2 - 1; y += 1; } }
  };
  parede(0, 0, W, Q.parede * T);
  parede(0, (Q.h - 1) * T, W, T);
  // as ESTALACTITES penduradas no teto
  for (let x = 4; x < W; x += 9 + Math.floor(r() * 10)) {
    const h = 3 + Math.floor(r() * 6);
    for (let k = 0; k < h; k++) {
      const meia = Math.max(0, Math.round((h - k) / 2));
      ctx.fillStyle = k === 0 ? pe : pm;
      ctx.fillRect(x - meia, Q.parede * T + k, meia * 2 + 1, 1);
    }
    ctx.fillStyle = pc; ctx.fillRect(x, Q.parede * T, 1, Math.max(1, h - 2));
  }
  ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.fillRect(0, Q.parede * T, W, 2);
  // a BOCA DA CAVERNA (a porta): o buraco escuro com a luz de fora
  const px = Q.porta.x * T, py = (Q.h - 1) * T;
  ctx.fillStyle = "#0e0a08"; ctx.beginPath(); ctx.ellipse(px + T / 2, py + T, T * 0.75, T, 0, Math.PI, 0); ctx.fill();
  ctx.fillStyle = "rgba(255,236,170,0.28)"; ctx.beginPath(); ctx.moveTo(px - 4, H); ctx.lineTo(px + T + 4, H); ctx.lineTo(px + T + 14, py - 6); ctx.lineTo(px - 14, py - 6); ctx.fill();
  // a SOMBRA das bordas: a caverna é mais escura nos cantos
  const g = ctx.createRadialGradient(W / 2, H * 0.55, 40, W / 2, H * 0.55, 150);
  g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,0.45)");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  return cv;
}

export class BaseScene {
  enter(args = {}) {
    this.base = args.base;
    this.regiao = args.regiao || "kanto";
    this.dono = args.dono || "";
    this.visita = !!args.visita;
    this.Q = DB.QUARTO;
    this.T = DB.BASES_TEXTO;
    this.cor = DB.CORES_BASE[this.regiao] || DB.CORES_BASE.kanto;
    this.dlg = new Dialogue();
    this.eu = { x: this.Q.porta.x, y: this.Q.porta.y - 1, dir: "up", s: { x: 0, y: 0 }, andou: 0, anda: false };
    this.modo = null;               // null | { tipo: "pondo", item, x, y } | { tipo: "tirando", x, y }
    this.fadeA = 1; this.fadeDir = -1;
    this.banner = this.visita ? 2.5 : 0;
    this.t = 0;
    this.montarMons();
    this.game.music?.("casa");
    // o fundo da CAVERNA, desenhado uma vez (e de novo quando o tile chega)
    this.fundo = fundoCaverna(this.cor, null);
    if (this.cor.tile) loadImage(url(this.cor.tile)).then((img) => { if (img) this.fundo = fundoCaverna(this.cor, img); });
    if (this.visita) this.dlg.say(this.T.visitaDica);
  }

  exit() {}
  get st() { return this.game.state; }

  /** os POKÉMON SOLTOS, cada um num bloco livre */
  montarMons() {
    const livres = [];
    for (let y = this.Q.parede; y < this.Q.h - 1; y++) for (let x = 0; x < this.Q.w; x++) {
      if (livreParaAndar(this.base, x, y) && !(x === this.eu.x && y === this.eu.y)) livres.push([x, y]);
    }
    this.mons = (this.base.mons || []).map((m) => {
      const [x, y] = livres.splice(Math.floor(Math.random() * livres.length), 1)[0] || [2, 4];
      return { mon: m, x, y, de: null, k: 0, dir: "down", espera: Math.random() * 2 };
    });
  }

  ocupadoPorMon(x, y, menos = null) {
    return this.mons.some((m) => m !== menos && ((m.x === x && m.y === y) || (m.de && m.de[0] === x && m.de[1] === y)));
  }

  // ------------------------------------------------------------- update
  update(dt) {
    this.t += dt;
    this.banner = Math.max(0, this.banner - dt);
    if (this.fadeDir) {
      this.fadeA = Math.max(0, Math.min(1, this.fadeA + this.fadeDir * dt * 3));
      if (this.fadeDir < 0 && this.fadeA <= 0) this.fadeDir = 0;
      if (this.fadeDir > 0 && this.fadeA >= 1) return void this.game.scenes.pop();
      if (this.fadeDir > 0) return;
    }
    this.andarMons(dt);
    this.andarRobos(dt);
    if (this.dlg.update(dt)) return;
    if (this.modo) return this.updateModo();
    this.andarEu(dt);
  }

  /** ANDAR LIVRE, como no mapa (o CAIO: "tô andando em tiles dentro da
   *  base"): o bloco onde o corpo está (eu.x, eu.y) mais o deslize dentro dele
   *  (eu.s), parando a 4 px da parede; diagonal vale. Passou do meio do bloco,
   *  mudou de bloco. A porta é pisar no bloco dela. */
  andarEu(dt) {
    const e = this.eu;
    e.s ||= { x: 0, y: 0 };
    e.anda = false;
    // SENTADO: qualquer seta levanta (volta pro bloco de onde subiu)
    if (this.sentado) {
      if (!Input.dir()) return;
      const [x, y, dir] = this.sentado.volta;
      this.sentado = null;
      e.x = x; e.y = y; e.dir = dir; e.s = { x: 0, y: 0 };
      Audio2.tone(390, 0.05, "sine", 0.25);
      return;
    }
    if (Input.consume("a")) return this.interagir();
    const ax = (Input.held("right") ? 1 : 0) - (Input.held("left") ? 1 : 0);
    const ay = (Input.held("down") ? 1 : 0) - (Input.held("up") ? 1 : 0);
    if (!ax && !ay) return;
    e.anda = true;
    const vert = ay > 0 ? "down" : "up", hori = ax > 0 ? "right" : "left";
    if (ay && !ax) e.dir = vert;
    else if (ax && !ay) e.dir = hori;
    else if (e.dir !== vert && e.dir !== hori) e.dir = vert;
    const v = T / passoMapa(Input.held("run") ? RUN : WALK), diag = ax && ay ? Math.SQRT1_2 : 1;
    const MEIO = T / 2, BEIRA = 4;
    for (const eixo of ["x", "y"]) {
      const a = eixo === "x" ? ax : ay;
      if (!a) continue;
      const n = e.s[eixo] + a * v * diag * dt;
      if (a * n <= BEIRA) { e.s[eixo] = n; e.andou = (e.andou || 0) + v * diag * dt; continue; }
      const nx = e.x + (eixo === "x" ? a : 0), ny = e.y + (eixo === "y" ? a : 0);
      if (!livreParaAndar(this.base, nx, ny) || this.ocupadoPorMon(nx, ny)) { e.s[eixo] = a * BEIRA; continue; }
      e.s[eixo] = n;
      e.andou = (e.andou || 0) + v * diag * dt;
      if (a * n > MEIO) {
        if (eixo === "x") e.x = nx; else e.y = ny;
        e.s[eixo] -= a * T;
        // pisou na porta: sai
        if (e.x === this.Q.porta.x && e.y === this.Q.porta.y) { Audio2.tone(440, 0.05); this.fadeDir = 1; return; }
      }
    }
  }

  andarMons(dt) {
    for (const m of this.mons) {
      if (m.de) { m.k += dt / 0.4; if (m.k >= 1) { m.de = null; m.k = 0; } continue; }
      m.espera -= dt;
      if (m.espera > 0) continue;
      m.espera = 0.8 + Math.random() * 2.2;
      const d = Object.keys(DIRS)[Math.floor(Math.random() * 4)];
      const [dx, dy] = DIRS[d], nx = m.x + dx, ny = m.y + dy;
      m.dir = d;
      if (!livreParaAndar(this.base, nx, ny) || this.ocupadoPorMon(nx, ny, m) || (nx === this.eu.x && ny === this.eu.y)) continue;
      if (nx === this.Q.porta.x && ny === this.Q.porta.y) continue;
      m.de = [m.x, m.y]; m.x = nx; m.y = ny; m.k = 0;
    }
  }

  interagir() {
    const [dx, dy] = DIRS[this.eu.dir], fx = this.eu.x + dx, fy = this.eu.y + dy;
    if (fx === this.Q.pc.x && fy === this.Q.pc.y) {
      if (this.visita) return void this.dlg.say(this.T.visitaDica);
      Audio2.select();
      return this.abrirPC();
    }
    const mon = this.mons.find((m) => m.x === fx && m.y === fy);
    if (mon) {
      import("../systems/gritos.js").then((g) => g.tocarGrito(mon.mon.species));
      return void this.dlg.say(`${DB.SPECIES[mon.mon.species]?.name || "?"} ESTÁ BRINCANDO NA BASE.`);
    }
    const mv = movelEm(this.base, fx, fy);
    // o ASSENTO (o PUFE DE JIGGLYPUFF): você sobe nele e senta
    if (mv && DB.MOVEIS[mv.item]?.assento) {
      this.sentado = { volta: [this.eu.x, this.eu.y, this.eu.dir] };
      this.eu.x = fx; this.eu.y = fy; this.eu.dir = "down"; this.eu.s = { x: 0, y: 0 };
      Audio2.tone(520, 0.06, "sine", 0.3); Audio2.tone(390, 0.08, "sine", 0.3);
      return void this.dlg.say(this.T.sentou);
    }
    if (mv) this.dlg.say(mv.item.toUpperCase() + ".");
  }

  // ------------------------------------------------------------- o PC
  abrirPC() {
    const T = this.T;
    // a 4ª opção liga e desliga o ESCONDER (o SAIR fica por último)
    const ops = [...T.pcOpcoes.slice(0, 3), this.base.escondida ? T.mostrar : T.esconder, T.pcOpcoes[3]];
    this.dlg.ask(T.pc, ops, (i) => {
      if (i === 0) return this.escolherMovel();
      if (i === 1) { this.modo = { tipo: "tirando", x: this.eu.x, y: this.eu.y - 1 }; return; }
      if (i === 2) return this.menuMons();
      if (i === 3) {
        this.base.escondida = !this.base.escondida;
        Audio2.tone(this.base.escondida ? 330 : 660, 0.08, "square", 0.3);
        this.game.autosave?.(true);
        Online.anunciarBases?.();                    // as escondidas saem da lista dos outros
        this.dlg.say(this.base.escondida ? T.escondeu : T.mostrou);
      }
    });
  }

  /** uma lista que pode ser grande, de 6 em 6 (o menu do diálogo desenha tudo de uma vez) */
  lista(titulo, nomes, cb, pag = 0) {
    const POR = 6, pedaco = nomes.slice(pag * POR, pag * POR + POR);
    const mais = (pag + 1) * POR < nomes.length, volta = pag > 0;
    const ops = [...pedaco, ...(mais ? ["MAIS..."] : []), ...(volta ? ["VOLTAR"] : []), "SAIR"];
    this.dlg.ask(titulo, ops, (i) => {
      if (ops[i] === "MAIS...") return this.lista(titulo, nomes, cb, pag + 1);
      if (ops[i] === "VOLTAR") return this.lista(titulo, nomes, cb, pag - 1);
      if (i < pedaco.length) cb(pag * POR + i);
    });
  }

  escolherMovel() {
    const tem = moveisNaMochila(this.st);
    if (!tem.length) return void this.dlg.say(this.T.semMoveis);
    this.lista(this.T.qualMovel, tem.map((it) => `${it.toUpperCase()} X${this.st.items[it]}`), (i) => {
      const item = tem[i];
      const poster = DB.MOVEIS[item]?.tipo === "poster";
      this.modo = { tipo: "pondo", item, x: Math.min(this.Q.w - tamanho(item).w, this.eu.x), y: poster ? this.Q.parede - 1 : Math.max(this.Q.parede, this.eu.y - 2) };
    });
  }

  updateModo() {
    const m = this.modo, Q = this.Q;
    for (const d of Object.keys(DIRS)) {
      if (!Input.consume(d)) continue;
      m.x = Math.max(0, Math.min(Q.w - 1, m.x + DIRS[d][0]));
      m.y = Math.max(0, Math.min(Q.h - 1, m.y + DIRS[d][1]));
      Audio2.blip?.();
    }
    if (m.tipo === "caminho") return this.updateCaminho(m);
    if (Input.consume("b")) { this.modo = null; Audio2.cancel(); return; }
    if (!Input.consume("a")) return;
    if (m.tipo === "pondo") {
      const motivo = podePor(this.base, m.item, m.x, m.y);
      if (motivo) { Audio2.cancel(); return void this.dlg.say(motivo); }
      porMovel(this.st, this.base, m.item, m.x, m.y);
      Audio2.select();
      this.game.autosave?.(true);
      // o ROBÔ: logo depois de pôr, marca o caminho dele
      if (DB.MOVEIS[m.item]?.tipo === "robo") {
        const robo = this.base.moveis[this.base.moveis.length - 1];
        robo.caminho = [[m.x, m.y]];
        this.modo = { tipo: "caminho", robo, x: m.x, y: m.y };
        return void this.dlg.say(this.T.caminhoComeco);
      }
      // acabou esse móvel? sai do modo; senão continua pondo outro igual
      if (!(this.st.items[m.item] > 0)) this.modo = null;
    } else {
      const mv = movelEm(this.base, m.x, m.y);
      if (!mv) return void Audio2.cancel();
      tirarMovel(this.st, this.base, mv);
      Audio2.select();
      this.game.autosave?.(true);
    }
  }

  /** MARCANDO O CAMINHO do robô: Z marca o ponto, X termina (com 1 ponto
   *  marcado ou mais além de onde ele está; sem nenhum, X tira o robô) */
  updateCaminho(m) {
    const Q = this.Q;
    if (Input.consume("b")) {
      if (m.robo.caminho.length < 2) {
        tirarMovel(this.st, this.base, m.robo);
        this.modo = null; Audio2.cancel();
        return void this.dlg.say(this.T.caminhoCurto);
      }
      this.modo = null; Audio2.select();
      this.game.autosave?.(true);
      return;
    }
    if (!Input.consume("a")) return;
    if (m.y < Q.parede || m.y >= Q.h - 1) return void Audio2.cancel();
    const ult = m.robo.caminho[m.robo.caminho.length - 1];
    if (ult[0] === m.x && ult[1] === m.y) return void Audio2.cancel();
    m.robo.caminho.push([m.x, m.y]);
    Audio2.tone(880 + m.robo.caminho.length * 40, 0.04, "square", 0.25);
  }

  /** OS ROBÔS: cada um pula do ponto em que está pro próximo do caminho dele,
   *  num arco, e do último volta pro primeiro — pra sempre */
  andarRobos(dt) {
    this.robos ||= new Map();
    for (const m of this.base.moveis || []) {
      if (DB.MOVEIS[m.item]?.tipo !== "robo") continue;
      const cam = m.caminho?.length > 1 ? m.caminho : [[m.x, m.y]];
      // o caminho sendo marcado agora: o robô espera no começo
      if (this.modo?.tipo === "caminho" && this.modo.robo === m) { this.robos.set(m, { i: 0, k: 0, espera: 0.4 }); continue; }
      let r = this.robos.get(m);
      if (!r) { r = { i: 0, k: 0, espera: 0.4 }; this.robos.set(m, r); }
      if (cam.length < 2) continue;
      if (r.espera > 0) { r.espera -= dt; continue; }
      const [a, b] = [cam[r.i % cam.length], cam[(r.i + 1) % cam.length]];
      const dist = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (r.k === 0 && dist > JETPACK) Audio2.noise(0.35, 0.12);    // a JETPACK ligando: fssss
      r.k += dt / Math.max(0.35, dist * 0.22);
      if (r.k >= 1) {
        r.k = 0; r.i = (r.i + 1) % cam.length; r.espera = 0.25;
        Audio2.tone(1200, 0.03, "square", 0.12); Audio2.tone(900, 0.03, "square", 0.1);
      }
    }
  }

  /** onde o robô está agora (em pixels) e a altura do pulo */
  posDoRobo(m) {
    const cam = m.caminho?.length > 1 ? m.caminho : [[m.x, m.y]];
    const r = this.robos?.get(m) || { i: 0, k: 0 };
    const a = cam[r.i % cam.length], b = cam[(r.i + 1) % cam.length];
    const dist = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const x = (a[0] + (b[0] - a[0]) * r.k) * T, y = (a[1] + (b[1] - a[1]) * r.k) * T;
    // A POSE: agachado logo antes de pular e logo depois de cair, esticado no
    // ar, em pé no resto. A DIREÇÃO: pra onde vai o pulo de agora
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const lado = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? "esquerda" : "direita") : (dy < 0 ? "costas" : "frente");
    const parado = (r.espera || 0) > 0;
    const pose = !parado ? (r.k < 0.12 || r.k > 0.9 ? 1 : 2) : (r.espera > 0.17 || r.espera < 0.1 ? 1 : 0);
    const jet = cam.length > 1 && !parado && dist > JETPACK && r.k > 0.08 && r.k < 0.94;
    return { x, y, pulo: Math.sin(r.k * Math.PI) * (6 + dist * 3), vira: b[0] < a[0], lado, pose: cam.length > 1 ? pose : 0, jet };
  }

  // ------------------------------------------------------------- os soltos
  menuMons() {
    const T = this.T;
    this.dlg.ask(T.quaisMons, T.monsOpcoes, (i) => {
      if (i === 1) { this.base.mons = []; this.montarMons(); this.game.autosave?.(true); return; }
      if (i !== 0) return;
      if ((this.base.mons || []).length >= 6) return void this.dlg.say(T.monsCheio);
      const todos = [...this.st.party, ...todosGuardados(this.st)].filter(Boolean);
      this.lista(T.quaisMons, todos.map((m) => `${m.nickname} N${m.level}`), (k) => {
        const m = todos[k];
        (this.base.mons ||= []).push({ species: m.species, seed: m.seed, shiny: !!m.shiny });
        this.montarMons();
        this.game.autosave?.(true);
        import("../systems/gritos.js").then((g) => g.tocarGrito(m.species));
      });
    });
  }

  // ------------------------------------------------------------- desenho
  render(ctx) {
    const Q = this.Q;
    ctx.drawImage(this.fundo, 0, 0);
    // os tapetes primeiro, os pôsteres na parede
    const ms = this.base.moveis || [];
    for (const m of ms) {
      const tipo = DB.MOVEIS[m.item]?.tipo;
      if (tipo !== "tapete" && tipo !== "poster") continue;
      const img = desenhoDoMovel(m.item);
      if (img) ctx.drawImage(img, m.x * T, m.y * T);
    }
    // O "F" ONDE O ROBÔ FROAKIE COMEÇA (pedido do CAIO): uma plaquinha de
    // metal no chão, no primeiro ponto do caminho, com o F em azul
    for (const m of ms) {
      if (DB.MOVEIS[m.item]?.tipo !== "robo") continue;
      const [fx, fy] = m.caminho?.[0] || [m.x, m.y];
      const x = fx * T, y = fy * T;
      ctx.fillStyle = "#2a2228"; ctx.fillRect(x + 2, y + 3, 12, 11);
      ctx.fillStyle = "#8a8a96"; ctx.fillRect(x + 3, y + 4, 10, 9);
      ctx.fillStyle = "#b8b8c4"; ctx.fillRect(x + 3, y + 4, 10, 1);
      ctx.fillStyle = "#e0e0e8"; ctx.fillRect(x + 3, y + 4, 1, 1); ctx.fillRect(x + 12, y + 4, 1, 1); ctx.fillRect(x + 3, y + 12, 1, 1); ctx.fillRect(x + 12, y + 12, 1, 1);
      // o F (5 de altura), pixel por pixel
      ctx.fillStyle = "#4a90d0";
      ctx.fillRect(x + 6, y + 6, 1, 5); ctx.fillRect(x + 7, y + 6, 3, 1); ctx.fillRect(x + 7, y + 8, 2, 1);
    }
    // o resto (móveis, Pokémon, você), do fundo pra frente
    const coisas = [];
    coisas.push({ y: Q.pc.y, desenha: () => ctx.drawImage(desenhoDoPC(), Q.pc.x * T, Q.pc.y * T) });
    for (const m of ms) {
      const tipo = DB.MOVEIS[m.item]?.tipo;
      if (tipo === "tapete" || tipo === "poster") continue;
      if (tipo === "robo") {
        const p = this.posDoRobo(m);
        coisas.push({ y: p.y / T + 0.005, desenha: () => {
          const img = desenhoDoMovel(m.item);
          ctx.fillStyle = "rgba(0,0,0,0.25)";
          ctx.beginPath(); ctx.ellipse(p.x + 8, p.y + 14, 6 - Math.min(3, p.pulo / 6), 2, 0, 0, Math.PI * 2); ctx.fill();
          // AS POSES (a folha): a linha é a direção, a coluna é a pose; a
          // esquerda é a direita espelhada
          const mv = DB.MOVEIS[m.item], folha = mv.folha && folhaDe(mv.folha);
          if (folha) {
            const q = mv.quadro || 10, linha = { frente: 0, costas: 1, direita: 2, esquerda: 2 }[p.lado] ?? 0;
            const x = meio(p.x + T / 2 - q / 2), y = meio(p.y + T - q - 1 - p.pulo);
            // de lado, a esquerda é a direita espelhada (a jetpack junto)
            const desenha = (f) => {
              if (p.lado !== "esquerda") return f(x);
              ctx.save(); ctx.translate(x * 2 + q, 0); ctx.scale(-1, 1); f(x); ctx.restore();
            };
            // A JETPACK do pulo grande: de frente ela fica atrás do corpo
            // (aparecem as pontas dos tanques), de costas e de lado, por cima
            if (p.jet && p.lado === "frente") desenha((bx) => this.desenhaJetpack(ctx, bx, y, p.lado));
            desenha((bx) => ctx.drawImage(folha, p.pose * q, linha * q, q, q, bx, y, q, q));
            if (p.jet && p.lado !== "frente") desenha((bx) => this.desenhaJetpack(ctx, bx, y, p.lado));
            return;
          }
          if (!img) return;
          // (o desenho pode ser maior que o bloco: os pés no chão dele, no meio)
          const dx = Math.round(T / 2 - img.width / 2), dy = Math.round(T - img.height - p.pulo);
          if (p.vira) { ctx.save(); ctx.translate(p.x + T, 0); ctx.scale(-1, 1); ctx.drawImage(img, dx, Math.round(p.y) + dy); ctx.restore(); }
          else ctx.drawImage(img, Math.round(p.x) + dx, Math.round(p.y) + dy);
        } });
        continue;
      }
      const { h } = tamanho(m.item);
      coisas.push({ y: m.y + h - 1, desenha: () => { const img = desenhoDoMovel(m.item); if (img) ctx.drawImage(img, m.x * T, m.y * T); } });
    }
    for (const m of this.mons) {
      const [px, py] = this.pos(m);
      coisas.push({ y: py / T, desenha: () => this.desenhaMon(ctx, m, px, py) });
    }
    const [ex, ey] = this.pos(this.eu);
    coisas.push({ y: ey / T + (this.sentado ? 0.5 : 0.01), desenha: () => this.desenhaEu(ctx, ex, ey) });
    coisas.sort((a, b) => a.y - b.y).forEach((o) => o.desenha());
    // o cursor de decorar (e o CAMINHO do robô sendo marcado)
    if (this.modo?.tipo === "caminho") this.desenhaCaminho(ctx);
    else if (this.modo) this.desenhaCursor(ctx);
    if (this.banner > 0) {
      const txt = this.T.baseDe.replace("{NOME}", this.dono);
      ctx.fillStyle = "rgba(0,0,0,0.65)";
      ctx.fillRect(0, 4, W, 14);
      drawText(ctx, txt, Math.max(4, W / 2 - txt.length * 3), 7, "#ffd166");
    }
    this.dlg.render(ctx);
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }

  pos(o) {
    if (o === this.eu) return [o.x * T + (o.s?.x || 0), o.y * T + (o.s?.y || 0)];
    if (!o.de) return [o.x * T, o.y * T];
    return [(o.de[0] + (o.x - o.de[0]) * o.k) * T, (o.de[1] + (o.y - o.de[1]) * o.k) * T];
  }

  desenhaEu(ctx, x, y) {
    const sets = Assets.actor(this.visita ? "hero" : "hero");
    const set = sets?.[this.eu.dir] || sets?.down;
    if (!set) return;
    // o ciclo do mapa, com o MEIO PASSO: meio → passo → meio → parado, cada
    // passo em 2 blocos andados (src/scenes/overworld.js, quadroAndarT)
    let quadro = set[0];
    if (this.eu.anda) {
      const v = ((this.eu.andou / T / 2) % 2 + 2) % 2, perna = v < 1;
      const passo = set[perna ? 1 : 3], meioPasso = set[perna ? 4 : 5] || passo;
      quadro = [meioPasso, passo, meioPasso, set[0]][Math.min(3, Math.floor((v % 1) * 4))] || set[0];
    }
    if (this.sentado) {
      // sentado no pufe: só da cintura pra cima, afundado nele
      const metade = Math.round(quadro.height * 0.62);
      ctx.drawImage(quadro, 0, 0, quadro.width, metade, Math.round(x), Math.round(y) + T - metade - 5, quadro.width, metade);
      return;
    }
    ctx.drawImage(quadro, meio(x), meio(y) + T - quadro.height);
  }

  desenhaMon(ctx, m, x, y) {
    // O SPRITE NORMAL (o CAIO): o mesmo de quando ele anda no mapa, virado pra
    // onde vai e mexendo as pernas só enquanto anda (Assets.monAndando). Quem
    // não tem esse desenho fica com o de batalha, pequeno, como antes.
    const passo = Assets.monAndando?.(m.mon, m.dir, m.de ? performance.now() : 0);
    if (passo) {
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.beginPath(); ctx.ellipse(x + 8, y + 14, 6, 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.drawImage(passo, meio(x + 8 - passo.width / 2), meio(y + 15 - passo.height));
      return;
    }
    const base = Assets.mon(m.mon.species, m.mon.seed);
    const img = Assets.comCor ? Assets.comCor(base, m.mon) : base;
    if (!img) return;
    const pula = m.de ? Math.abs(Math.sin(m.k * Math.PI)) * 3 : 0;
    const S = 22;
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath(); ctx.ellipse(x + 8, y + 14, 6, 2, 0, 0, Math.PI * 2); ctx.fill();
    if (m.dir === "right") {
      ctx.save(); ctx.translate(x + 8, 0); ctx.scale(-1, 1);
      ctx.drawImage(reduzido(img, S), -S / 2, y + T - S - pula, S, S);
      ctx.restore();
    } else ctx.drawImage(reduzido(img, S), x + 8 - S / 2, y + T - S - pula, S, S);
  }

  /** A JETPACK, pixel por pixel, no quadro de 10x10 do robô em (x, y): dois
   *  tanques de metal com bico e o FOGO saindo embaixo (piscando). De lado, um
   *  tanque só, nas costas (o lado esquerdo do quadro da DIREITA). */
  desenhaJetpack(ctx, x, y, lado) {
    const px = (cx, cy, cor) => { ctx.fillStyle = cor; ctx.fillRect(x + cx, y + cy, 1, 1); };
    const tanque = (tx) => {
      for (let cy = 2; cy <= 6; cy++) { px(tx, cy, "#5a5a66"); px(tx + 1, cy, cy === 2 ? "#e0e0e8" : "#b8b8c4"); }
      px(tx, 1, "#2a2a30"); px(tx + 1, 1, "#2a2a30");
      px(tx, 7, "#3a3a44"); px(tx + 1, 7, "#3a3a44");
      // o fogo: amarelo no bico, laranja e vermelho pra baixo, tremendo
      const f = Math.floor(performance.now() / 70) % 3;
      px(tx, 8, "#fff6a0"); px(tx + 1, 8, "#ffe046");
      px(tx + (f === 1 ? 1 : 0), 9, "#ffb040");
      if (f !== 2) px(tx + (f === 0 ? 1 : 0), 10, "#ff6a2a");
      if (f === 0) px(tx, 11, "#e83838");
    };
    if (lado === "direita" || lado === "esquerda") tanque(1);
    else { tanque(0); tanque(8); }
  }

  desenhaCaminho(ctx) {
    const m = this.modo, cam = m.robo.caminho;
    const pisca = 0.5 + 0.5 * Math.sin(this.t * 8);
    ctx.fillStyle = "#6ae8ff";
    const pontos = [...cam, [m.x, m.y]];
    for (let i = 0; i < pontos.length - 1; i++) {
      const [a, b] = [pontos[i], pontos[i + 1]];
      const n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) * 4));
      for (let k = 0; k <= n; k += 1) {
        if (i === pontos.length - 2 && k % 2) continue;      // o pedaço até o cursor, mais falhado
        const x = (a[0] + (b[0] - a[0]) * k / n) * T + 7, y = (a[1] + (b[1] - a[1]) * k / n) * T + 7;
        ctx.fillRect(Math.round(x), Math.round(y), 2, 2);
      }
    }
    cam.forEach(([x, y], i) => {
      ctx.fillStyle = i === 0 ? "#4cd06a" : "#ffd166";
      ctx.fillRect(x * T + 5, y * T + 5, 6, 6);
      drawText(ctx, String(i + 1), x * T + 5, y * T - 5, "#ffffff", { shadow: "#000000" });
    });
    ctx.strokeStyle = `rgba(106,232,255,${pisca})`;
    ctx.strokeRect(m.x * T + 0.5, m.y * T + 0.5, T - 1, T - 1);
    drawText(ctx, this.T.caminhoDica, 4, H - 12, "#ffffff", { shadow: "#000000" });
  }

  desenhaCursor(ctx) {
    const m = this.modo;
    const pisca = 0.5 + 0.5 * Math.sin(this.t * 8);
    if (m.tipo === "pondo") {
      const { w, h } = tamanho(m.item);
      const ok = !podePor(this.base, m.item, m.x, m.y);
      const img = desenhoDoMovel(m.item);
      ctx.globalAlpha = 0.7;
      if (img) ctx.drawImage(img, m.x * T, m.y * T);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = ok ? `rgba(80,255,120,${pisca})` : `rgba(255,80,80,${pisca})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(m.x * T + 0.5, m.y * T + 0.5, w * T - 1, h * T - 1);
      drawText(ctx, this.T.decorarDica, 4, H - 12, "#ffffff", { shadow: "#000000" });
    } else {
      ctx.strokeStyle = `rgba(255,220,80,${pisca})`;
      ctx.strokeRect(m.x * T + 0.5, m.y * T + 0.5, T - 1, T - 1);
      drawText(ctx, this.T.tirarDica, 4, H - 12, "#ffffff", { shadow: "#000000" });
    }
  }
}
