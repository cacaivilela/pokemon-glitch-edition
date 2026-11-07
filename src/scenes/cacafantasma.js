// A CAÇA-FANTASMAS DA TORRE POKÉMON (src/data/cacafantasma.js). A sala escura
// da torre, os fantasmas voando, a MÁQUINA embaixo: mexe a mira, SEGURA A e o
// raio puxa o fantasma que está na mira. A barra dele enche (ele se debate e
// vai sendo arrastado pro bico da máquina); soltou, ela esvazia e ele foge.
// Pegou: o grito dele AO CONTRÁRIO e de 1 a 20 FICHAS DE ALMA (1% da alma cada).
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { Assets, makeCanvas } from "../core/assets.js";
import { url } from "../core/base.js";
import { drawText } from "../core/font.js";
import { DB } from "../data/index.js";
import { LENDARIOS } from "../data/leilao.js";
import { CACA_FANTASMA as C } from "../data/cacafantasma.js";
import { gritoDe, gritoAoContrario } from "../systems/gritos.js";

const W = 240, H = 160, T = C.texto;
const BICO = { x: 120, y: 122 };   // de onde sai o raio
const ALCANCE = 20;                // distância da mira que o raio pega

// A MÁQUINA, pixel por pixel: a metade esquerda (a direita é o espelho).
// k contorno, g/G cinza, c/C o tanque de almas, y bolha, r luz
const MAQUINA_METADE = [
  "..........kk",
  ".........kGG",
  ".........kgG",
  ".........kgG",
  "..........kg",
  "..........kG",
  "..........kg",
  "....kkkkkkkg",
  "...kGGGGGGGG",
  "..kGgggggggg",
  "..kGgkkkkkkk",
  "..kGgkCccccc",
  "..kGgkCcyccc",
  "..kGgkCCcccc",
  "..kGgkkkkkkk",
  "..kGgggrgggg",
  "..kggggggggg",
  "...kkkkkkkkk",
];
const MAQUINA = MAQUINA_METADE.map((l) => l + [...l].reverse().join(""));

const lenda = (id) => LENDARIOS.has(id) || !!DB.SPECIES[id]?.lendario;
const nomeDe = (id) => DB.SPECIES[id]?.name || id.toUpperCase();

/** quem pode virar fantasma: todo mundo menos fusão e mega (a mega é de
 *  batalha: revivida, ficava mega pra sempre) */
let todos = null;
function candidatos() {
  if (todos?.db === DB.SPECIES) return todos.lista;
  const lista = Object.keys(DB.SPECIES).filter((id) => { const sp = DB.SPECIES[id]; return !sp.fusao && !sp.egg && !sp.mega && !sp.megaDe; });
  todos = { db: DB.SPECIES, lista };
  return lista;
}

/** as espécies da rodada: poucas, pra alma de alguém juntar. Uma delas é de
 *  quem você já tem alma pela metade (se tiver), pra continuar de onde parou. */
function sortearRodada(st) {
  const lista = candidatos(), out = [];
  const comecadas = Object.entries(st.almas || {}).filter(([, n]) => n > 0 && n < 100).map(([id]) => id);
  // caçando a alma do RATICATE do AZUL (RATICATE_DO_RIVAL): ele vem sempre
  if (st.flags?.raticateRival === 2 && !st.party.some((m) => m.doRival)) out.push("raticate");
  const sobra = comecadas.filter((id) => !out.includes(id));
  if (sobra.length) out.push(sobra[Math.floor(Math.random() * sobra.length)]);
  // 2 dos FANTASMAS DA TORRE (GASTLY, MIMIKYU, o RATICATE do rival...)
  const torre = C.daTorre.filter((id) => DB.SPECIES[id] && !out.includes(id));
  for (let i = torre.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [torre[i], torre[j]] = [torre[j], torre[i]]; }
  out.push(...torre.slice(0, 2));
  let tentativas = 0;
  while (out.length < C.especiesPorRodada && tentativas++ < 500) {
    const id = lista[Math.floor(Math.random() * lista.length)];
    if (out.includes(id)) continue;
    if (lenda(id) && Math.random() > 0.25) continue;   // lendário é raro
    out.push(id);
  }
  return out;
}

/** o fantasma: o sprite do Pokémon pintado de roxo-azulado (a forma fica, a cor some) */
const tingidos = new WeakMap();
export function fantasmaDe(img) {
  if (!img) return null;
  const pronto = tingidos.get(img);
  if (pronto) return pronto;
  const { cv: c, ctx: x } = makeCanvas(img.width, img.height);
  x.drawImage(img, 0, 0);
  x.globalCompositeOperation = "source-atop";
  x.fillStyle = "rgba(150,170,255,0.62)";
  x.fillRect(0, 0, c.width, c.height);
  tingidos.set(img, c);
  return c;
}

/** A MÁQUINA com o bico em (bx, by): `ligada` faz o tanque brilhar (a cena do
 *  REVIVER, src/scenes/reviver.js, usa a mesma) */
export function desenharMaquina(ctx, bx, by, t, ligada = false, cheio = 0) {
  const brilho = ligada ? 0.5 + 0.5 * Math.sin(t * 20) : 0;
  const cor = {
    k: "#181820", g: "#5a6070", G: "#9aa4b4",
    c: ligada ? `rgb(${80 + cheio * 120},${200 + brilho * 55},${210 + brilho * 45})` : "#2a9a8e",
    C: "#1a6a62", y: "#e8ffff", r: Math.sin(t * 6) > 0 ? "#ff4040" : "#801818",
  };
  const s = 2, x0 = bx - (MAQUINA[0].length * s) / 2, y0 = by - 2;
  for (let y = 0; y < MAQUINA.length; y++) {
    for (let x = 0; x < MAQUINA[y].length; x++) {
      const ch = MAQUINA[y][x];
      if (ch === ".") continue;
      ctx.fillStyle = cor[ch];
      ctx.fillRect(x0 + x * s, y0 + y * s, s, s);
    }
  }
}

export class CacaFantasmaScene {
  enter() {
    const st = this.game.state;
    st.almas ||= {};
    this.rodada = sortearRodada(st);
    this.t = 0;
    this.resta = C.segundos;
    this.mira = { x: W / 2, y: 60 };
    this.fantasmas = [];
    this.textos = [];
    this.pegos = {};
    this.n = 0;
    this.acabou = false;
    this.somT = 0;
    this.fundo = new Image();
    this.fundo.src = url("assets/maps/pokemon_tower_2f.png");
    for (let i = 0; i < C.naTela; i++) this.nascer(i * 0.6);
  }

  get st() { return this.game.state; }

  nascer(atraso = 0) {
    // os da torre aparecem mais (C.pesoDaTorre)
    const peso = (id) => (C.daTorre.includes(id) ? C.pesoDaTorre : 1);
    let r = Math.random() * this.rodada.reduce((s, id) => s + peso(id), 0), id = this.rodada[0];
    for (const x of this.rodada) { r -= peso(x); if (r < 0) { id = x; break; } }
    const esq = Math.random() < 0.5;
    this.fantasmas.push({
      id, x: esq ? 10 : W - 10, y: 24 + Math.random() * 70,
      vx: (esq ? 1 : -1) * (14 + Math.random() * 16), vy: 0,
      fase: Math.random() * 6, barra: 0, aparece: -atraso, sugado: 0,
      lento: lenda(id) ? C.puxarLenda : C.puxar,
    });
  }

  update(dt) {
    this.t += dt;
    for (const s of this.textos) s.t -= dt;
    if (this.recado) { this.recado.t -= dt; if (this.recado.t <= 0) this.recado = null; }
    this.textos = this.textos.filter((s) => s.t > 0);
    if (this.acabou) {
      if (Input.consume("a") || Input.consume("b")) {
        Audio2.select();
        this.game.autosave?.(true);
        this.game.scenes.pop();
      }
      return;
    }
    this.resta -= dt;
    if (this.resta <= 0 || Input.consume("b")) return this.terminar();

    // a mira
    const v = 110 * dt;
    if (Input.held("left")) this.mira.x -= v;
    if (Input.held("right")) this.mira.x += v;
    if (Input.held("up")) this.mira.y -= v;
    if (Input.held("down")) this.mira.y += v;
    this.mira.x = Math.max(6, Math.min(W - 6, this.mira.x));
    this.mira.y = Math.max(14, Math.min(108, this.mira.y));

    // o raio pega o fantasma mais perto da mira (um de cada vez)
    this.puxando = Input.held("a");
    let alvo = null, perto = ALCANCE;
    if (this.puxando) for (const f of this.fantasmas) {
      if (f.aparece < 1 || f.sugado) continue;
      const d = Math.hypot(f.x - this.mira.x, f.y - this.mira.y);
      if (d < perto + (f.barra > 0 ? 10 : 0)) { perto = d; alvo = f; }
    }
    this.alvo = alvo;

    for (const f of this.fantasmas) {
      f.fase += dt;
      if (f.aparece < 1) { f.aparece += dt * 1.5; continue; }
      if (f.sugado) { f.sugado += dt * 3; continue; }
      if (f === alvo) {
        // preso no raio: a barra enche, ele treme e é arrastado pro bico
        f.barra += dt / f.lento;
        f.x += (BICO.x - f.x) * dt * 0.35 + (Math.random() - 0.5) * 3;
        f.y += (BICO.y - 20 - f.y) * dt * 0.35 + (Math.random() - 0.5) * 3;
        // a mira acompanha um pouco (senão ele escapa sozinho do raio)
        this.mira.x += (f.x - this.mira.x) * dt * 3;
        this.mira.y += (f.y - this.mira.y) * dt * 3;
        if (f.barra >= 1) this.pegar(f);
      } else {
        f.barra = Math.max(0, f.barra - dt * 0.5);
        // voando: vai de um lado pro outro, ondulando; quem levou raio foge mais rápido
        const pressa = 1 + f.barra * 2;
        f.x += f.vx * dt * pressa;
        f.y += Math.sin(f.fase * 1.7) * 18 * dt;
        if (f.x < 8 || f.x > W - 8) f.vx = -f.vx;
        f.y = Math.max(20, Math.min(100, f.y));
      }
    }
    // sugado de vez: some no bico e nasce outro
    const antes = this.fantasmas.length;
    this.fantasmas = this.fantasmas.filter((f) => f.sugado < 1);
    for (let i = this.fantasmas.length; i < antes; i++) this.nascer(0.4);

    // o zumbido da máquina puxando
    this.somT -= dt;
    if (this.puxando && this.somT <= 0) {
      this.somT = 0.12;
      Audio2.tone?.(alvo ? 140 + alvo.barra * 260 : 90, 0.1, "sawtooth", 0.05);
    }
  }

  pegar(f) {
    f.sugado = 0.01;
    f.barra = 1;
    this.n++;
    const [min, max] = C.fichas, q = min + Math.floor(Math.random() * (max - min + 1));
    this.pegos[f.id] = (this.pegos[f.id] || 0) + q;
    this.st.almas[f.id] = (this.st.almas[f.id] || 0) + q;
    // o grito dele AO CONTRÁRIO
    Audio2.unlock?.();
    Audio2.grito(gritoAoContrario(gritoDe(f.id)));
    // o easter egg: o RATICATE do rival
    if (f.id === "raticate") this.recado = { txt: T.raticate, t: 3.5 };
    this.textos.push({ txt: T.ficha.replace("{N}", q).replace("{MON}", nomeDe(f.id)), x: f.x, y: f.y, t: 1.4 });
  }

  terminar() {
    this.acabou = true;
    this.recorde = this.n > (this.st.cacaFantasmaRecorde || 0);
    if (this.recorde) this.st.cacaFantasmaRecorde = this.n;
    Audio2.heal?.();
  }

  // ---------------------------------------------------------------- desenho

  desenharFundo(ctx) {
    ctx.fillStyle = "#0c0818";
    ctx.fillRect(0, 0, W, H);
    if (this.fundo.complete && this.fundo.naturalWidth) {
      const fw = this.fundo.naturalWidth, fh = this.fundo.naturalHeight;
      ctx.drawImage(this.fundo, Math.max(0, (fw - W) / 2), Math.max(0, (fh - H) / 2), W, H, 0, 0, W, H);
    }
    // escuro e roxo, com névoa passando
    ctx.fillStyle = "rgba(14,4,34,0.72)";
    ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 6; i++) {
      const x = ((i * 61 + this.t * (6 + i * 2)) % (W + 80)) - 40, y = 30 + i * 17 + Math.sin(this.t * 0.7 + i) * 6;
      const g = ctx.createRadialGradient(x, y, 0, x, y, 34);
      g.addColorStop(0, "rgba(160,140,220,0.13)");
      g.addColorStop(1, "rgba(160,140,220,0)");
      ctx.fillStyle = g;
      ctx.fillRect(x - 34, y - 34, 68, 68);
    }
  }

  desenharFantasma(ctx, f) {
    const img = fantasmaDe(Assets.mon(f.id, 1));
    if (!img) return;
    const escala = Math.min(1, 44 / Math.max(img.width, img.height)) * (f.sugado ? Math.max(0, 1 - f.sugado) : 1);
    const w = img.width * escala, h = img.height * escala;
    const cx = f.sugado ? f.x + (BICO.x - f.x) * f.sugado : f.x;
    const cy = f.sugado ? f.y + (BICO.y - f.y) * f.sugado : f.y;
    const tremendo = f.barra > 0 && !f.sugado ? (Math.random() - 0.5) * 2 * f.barra : 0;
    ctx.save();
    ctx.globalAlpha = Math.min(1, Math.max(0, f.aparece)) * (0.55 + 0.2 * Math.sin(f.fase * 5));
    // ondulando: uma faixa de 2 linhas por vez, cada uma empurrada pro lado
    const passo = 2;
    for (let y = 0; y < img.height; y += passo) {
      const dx = Math.sin(y * 0.25 + f.fase * 5) * 2 + tremendo;
      ctx.drawImage(img, 0, y, img.width, passo, cx - w / 2 + dx, cy - h / 2 + y * escala, w, passo * escala + 0.5);
    }
    ctx.restore();
    if (f.barra > 0 && !f.sugado) {
      const bx = Math.round(f.x - 14), by = Math.round(f.y + h / 2 + 2);
      ctx.fillStyle = "#202028"; ctx.fillRect(bx - 1, by - 1, 30, 5);
      ctx.fillStyle = "#40e0d0"; ctx.fillRect(bx, by, Math.round(28 * Math.min(1, f.barra)), 3);
    }
  }

  desenharRaio(ctx) {
    if (!this.puxando) return;
    const a = this.alvo, ax = a ? a.x : this.mira.x, ay = a ? a.y : this.mira.y;
    for (let k = 0; k < 3; k++) {
      ctx.strokeStyle = k === 0 ? "rgba(64,224,208,0.35)" : k === 1 ? "rgba(180,120,255,0.6)" : "rgba(230,255,255,0.9)";
      ctx.lineWidth = k === 0 ? 5 : k === 1 ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(BICO.x, BICO.y);
      for (let i = 1; i <= 12; i++) {
        const p = i / 12, x = BICO.x + (ax - BICO.x) * p, y = BICO.y + (ay - BICO.y) * p;
        const onda = Math.sin(p * 14 - this.t * 30 + k) * (a ? 4 : 2) * Math.sin(Math.PI * p);
        ctx.lineTo(x + onda, y + onda * 0.5);
      }
      ctx.stroke();
    }
  }

  desenharMaquina(ctx) {
    desenharMaquina(ctx, BICO.x, BICO.y, this.t, this.puxando, this.alvo ? this.alvo.barra : 0);
  }

  desenharMira(ctx) {
    const { x, y } = this.mira, r = this.alvo ? 6 + Math.sin(this.t * 25) : 7;
    ctx.strokeStyle = this.alvo ? "#40e0d0" : "#ffffff";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(Math.round(x) + 0.5, Math.round(y) + 0.5, r, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fillRect(Math.round(x) - r - 3, Math.round(y), 4, 1);
    ctx.fillRect(Math.round(x) + r, Math.round(y), 4, 1);
    ctx.fillRect(Math.round(x), Math.round(y) - r - 3, 1, 4);
    ctx.fillRect(Math.round(x), Math.round(y) + r, 1, 4);
  }

  render(ctx) {
    ctx.imageSmoothingEnabled = false;
    this.desenharFundo(ctx);
    for (const f of this.fantasmas) this.desenharFantasma(ctx, f);
    this.desenharRaio(ctx);
    this.desenharMaquina(ctx);
    if (!this.acabou) this.desenharMira(ctx);
    for (const s of this.textos) {
      ctx.globalAlpha = Math.min(1, s.t);
      drawText(ctx, s.txt, Math.max(2, Math.min(W - s.txt.length * 6 - 2, s.x - s.txt.length * 3)), s.y - 24 - (1.4 - s.t) * 12, "#c8ffff");
      ctx.globalAlpha = 1;
    }
    // em cima: o nome, o tempo e quantos pegou
    ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.fillRect(0, 0, W, 12);
    drawText(ctx, T.titulo, 4, 2, "#c8a8ff");
    const seg = Math.max(0, Math.ceil(this.resta));
    drawText(ctx, `${Math.floor(seg / 60)}:${String(seg % 60).padStart(2, "0")}`, W - 34, 2, "#ffffff");
    drawText(ctx, T.pegou.replace("{N}", this.n), 4, H - 10, "#ffffff");
    if (!this.acabou) drawText(ctx, T.segure, W - 52, H - 10, "#40e0d0");
    if (this.recado && !this.acabou) {
      const txt = this.recado.txt, w = txt.length * 6 + 12;
      ctx.globalAlpha = Math.min(1, this.recado.t);
      ctx.fillStyle = "rgba(0,0,0,0.75)"; ctx.fillRect((W - w) / 2, 50, w, 16);
      drawText(ctx, txt, (W - txt.length * 6) / 2, 54, "#ff6060");
      ctx.globalAlpha = 1;
    }
    if (this.acabou) this.desenharFim(ctx);
  }

  desenharFim(ctx) {
    const lista = Object.entries(this.pegos).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const h = 40 + lista.length * 11;
    const y0 = Math.round((H - h) / 2) - 10;
    ctx.fillStyle = "rgba(10,4,24,0.92)"; ctx.fillRect(20, y0, 200, h);
    ctx.strokeStyle = "#8f6bd8"; ctx.strokeRect(20.5, y0 + 0.5, 199, h - 1);
    drawText(ctx, T.fim, 28, y0 + 6, "#ffd860");
    drawText(ctx, T.pegou.replace("{N}", this.n) + (this.recorde && this.n ? "  " + T.recorde : ""), 28, y0 + 18, "#ffffff");
    lista.forEach(([id, n], i) => {
      drawText(ctx, `${nomeDe(id).slice(0, 12)} +${n}  ALMA ${this.st.almas[id] || 0}%`, 28, y0 + 32 + i * 11, "#c8ffff");
    });
    drawText(ctx, T.sairTela, 28, y0 + h - 10, "#c8a8ff");
  }
}
