// A SALA DA LIGA DO VOID (src/data/liga-void.js). Cinco formas, uma por vez,
// pintadas aqui do zero: o NULO (zeros e uns verdes no preto), o ERRO 404 (o
// quadriculado roxo-e-preto de textura que não carregou), o BUG.SPRITE (o chão
// com pedaços de tile no lugar errado), a CORROMPIDA (vermelha, rasgada em
// faixas) e o ESPELHO do campeão (tudo branco e ciano, como negativo de foto).
//
// A TROCA (venceu um: `flags.ligaVoidPendente`): a sala DERRETE. Cada coluna
// de pixel começa a escorrer num tempo seu e cai acelerando, deixando pingos;
// por trás aparece o preto, e a sala nova PINGA de cima, coluna por coluna,
// até fechar. Uns pixels saem da cor certa no caminho (é o VOID).
import { DB } from "../data/index.js";
import { Audio2 } from "../core/audio.js";
import { makeRng } from "../core/rng.js";

const T = 16;
const DERRETE = 1.6;      // segundos da sala velha escorrendo (a última coluna)
const PINGA = 1.7;        // e da nova pingando
const L = () => DB.LIGA_VOID;
const etapa = (st) => st.flags?.ligaVoidEtapa || 0;
const temaDe = (i) => (i >= L().membros.length ? L().campeao.tema : L().membros[i].tema);

const cache = new Map();
/** o canvas da sala inteira na forma `tema` */
export function salaVoid(tema, geo) {
  const k = tema + ":" + geo.w + "x" + geo.h;
  if (cache.has(k)) return cache.get(k);
  const cv = document.createElement("canvas");
  cv.width = geo.w * T; cv.height = geo.h * T;
  const ctx = cv.getContext("2d");
  const r = makeRng(404 + tema.length * 17);
  const px = (x, y, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1); };
  const ret = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  const P = PALETAS[tema] || PALETAS.nulo;
  for (let y = 0; y < geo.h; y++) for (let x = 0; x < geo.w; x++) {
    const c = geo.planta[y]?.[x] ?? "#", X = x * T, Y = y * T;
    if (c === "#") parede({ ret, px, r, X, Y, P, topo: y < 2, face: y === 1, tema });
    else chao({ ret, px, r, X, Y, P, tema, x, y, porta: c === "U" });
  }
  // a ARENA no meio (o retângulo onde o da vez fica), igual em todas, com a cor de cada uma
  const ax = 4 * T, ay = 2 * T + 8, aw = 7 * T, ah = 3 * T;
  ret(ax, ay, aw, 1, P.arena); ret(ax, ay + ah, aw, 1, P.arena); ret(ax, ay, 1, ah, P.arena); ret(ax + aw - 1, ay, 1, ah + 1, P.arena);
  cache.set(k, cv);
  return cv;
}

const PALETAS = {
  nulo:       { chao: "#050805", chao2: "#0a140a", risco: "#1a4a1a", luz: "#40ff60", parede: "#0a160a", face: "#102a10", arena: "#40ff60" },
  erro:       { chao: "#1a0a2a", chao2: "#ff00dc", risco: "#000000", luz: "#ff7af0", parede: "#2a1040", face: "#3a1a5a", arena: "#ff00dc" },
  bug:        { chao: "#73cda4", chao2: "#8bdebd", risco: "#41b48b", luz: "#eee68b", parede: "#4a3c3d", face: "#7d6c6d", arena: "#e88b24" },
  corrompida: { chao: "#2a0606", chao2: "#4a0a0a", risco: "#a02020", luz: "#ff5040", parede: "#140303", face: "#3a0808", arena: "#ff5040" },
  espelho:    { chao: "#e8f8ff", chao2: "#c8ecff", risco: "#88d0f0", luz: "#ffffff", parede: "#a8d8f0", face: "#d0f0ff", arena: "#40c0ff" },
};

function chao({ ret, px, r, X, Y, P, tema, x, y, porta }) {
  ret(X, Y, T, T, (x + y) % 2 ? P.chao : P.chao2 === "#ff00dc" ? P.chao : P.chao2);
  if (tema === "nulo") {                 // ZEROS E UNS
    for (let k = 0; k < 3; k++) {
      const cx = X + 2 + r.int(10), cy = Y + 2 + r.int(9), um = r.chance(0.5);
      if (um) ret(cx + 1, cy, 1, 5, r.chance(0.3) ? P.luz : P.risco);
      else { ret(cx, cy, 3, 1, P.risco); ret(cx, cy + 4, 3, 1, P.risco); ret(cx, cy, 1, 5, P.risco); ret(cx + 2, cy, 1, 5, P.risco); }
    }
  } else if (tema === "erro") {          // a TEXTURA QUE NÃO CARREGOU: quadradinho rosa e preto
    if ((x * 7 + y * 3) % 5 < 2) for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) ret(X + i * 4, Y + j * 4, 4, 4, (i + j) % 2 ? "#ff00dc" : "#000000");
    else { ret(X, Y, T, 1, P.risco); ret(X, Y, 1, T, P.risco); }
  } else if (tema === "bug") {           // o chão do FIRERED com pedaços de tile no lugar errado
    for (let k = 0; k < 10; k++) px(X + r.int(16), Y + r.int(16), r.pick([P.chao2, P.risco]));
    if (r.chance(0.35)) { const c = r.pick(["#62a4de", "#dec58b", "#e0402a", "#413931", "#eee68b"]); ret(X + r.int(8), Y + r.int(8), 4 + r.int(8), 2 + r.int(6), c); }
  } else if (tema === "corrompida") {    // vermelha, rasgada em faixas
    for (let k = 0; k < 3; k++) { const yy = Y + r.int(16); ret(X - r.int(4), yy, T + 8, 1, r.chance(0.5) ? P.risco : P.chao2); }
    if (r.chance(0.2)) ret(X + r.int(12), Y + r.int(12), 3, 3, P.luz);
  } else if (tema === "espelho") {       // branco e ciano, com o brilho de espelho na diagonal
    for (let k = 0; k < 16; k += 4) px(X + k, Y + (15 - k), P.luz);
    ret(X, Y, T, 1, P.risco); ret(X, Y, 1, T, P.risco);
  }
  if (porta) { ret(X + 2, Y, 12, T, "#000000"); ret(X + 2, Y, 12, 2, P.luz); }
}

function parede({ ret, px, r, X, Y, P, topo, face, tema }) {
  ret(X, Y, T, T, P.parede);
  if (face) { ret(X, Y + 4, T, 12, P.face); ret(X, Y + 4, T, 1, P.luz); for (let k = 0; k < 3; k++) ret(X + r.int(14), Y + 7 + r.int(7), 2, 1, P.risco); }
  // a parede também "pisca": um pixel ou outro da cor errada
  if (r.chance(0.25)) px(X + r.int(16), Y + r.int(16), r.pick(["#ff00dc", "#40ff60", "#ffffff", "#ff5040"]));
}

// ------------------------------------------------------------ a troca
/** o update: começa a troca quando tem uma pendente; enquanto dura, devolve true */
export function trocaLigaVoid(ow, dt) {
  const st = ow.st;
  if (!ow.map?.ligaVoid) return false;
  if (!ow.ligaVoidTroca) {
    const para = st.flags?.ligaVoidPendente;
    if (para == null || ow.dlg.active || ow.fx || ow.fadeDir || ow.fadeA > 0 || ow.menu || ow.move) return false;
    st.flags.ligaVoidPendente = null;
    st.flags.ligaVoidTrocando = true;
    const r = makeRng(para * 977 + 13), w = ow.geo.w * T;
    // cada coluna: quando começa a derreter, quanto ela acelera, e quando a nova pinga
    const cols = Array.from({ length: w }, (_, x) => {
      const onda = Math.sin(x * 0.07) * 0.18 + Math.sin(x * 0.23 + 1) * 0.08;
      return { d: Math.max(0, 0.35 + onda + r() * 0.45), a: 260 + r() * 340, p: DERRETE + 0.15 + r() * 0.9 + Math.abs(onda) };
    });
    ow.ligaVoidTroca = { de: para - 1, para, t: 0, cols, fim: DERRETE + PINGA + 0.6, som: 0 };
    Audio2.tone(70, 0.6, "sawtooth", 0.45); Audio2.tone(52, 0.8, "square", 0.3);
    return true;
  }
  const tr = ow.ligaVoidTroca;
  tr.t += dt;
  // o som: um borbulhar que desce (derretendo) e um pinga-pinga (a nova chegando)
  if (Math.floor(tr.t * 9) !== tr.som) {
    tr.som = Math.floor(tr.t * 9);
    if (tr.t < DERRETE + 0.3) Audio2.tone(180 - tr.t * 60 + Math.random() * 40, 0.05, "sawtooth", 0.2);
    else Audio2.tone(900 + Math.random() * 600, 0.03, "triangle", 0.18);
  }
  if (tr.t > 0.5 && tr.t < DERRETE) ow.tremor = Math.max(ow.tremor || 0, 0.05);
  if (tr.t >= tr.fim) {
    ow.ligaVoidTroca = null;
    st.flags.ligaVoidEtapa = tr.para;
    st.flags.ligaVoidTrocando = false;
    ow.game.autosave?.(true);
    const nome = (DB.STORY?.playerName || st.player?.name || "VOCÊ");
    const prox = tr.para < L().membros.length ? L().membros[tr.para].nome : L().campeao.nome.replace("{NOME}", (st.player?.name || nome).toUpperCase());
    ow.dlg.say(L().troca.replace("{QUEM}", prox));
  }
  return true;
}

/** o desenho da sala (por cima do chão do mapa), derretendo se for a hora */
export function desenharLigaVoid(ow, ctx, cx, cy) {
  const geo = ow.geo;
  if (!geo?.planta) return;
  const tr = ow.ligaVoidTroca;
  if (!tr) { ctx.drawImage(salaVoid(temaDe(etapa(ow.st)), geo), -cx, -cy); return; }
  const velha = salaVoid(temaDe(tr.de), geo), nova = salaVoid(temaDe(tr.para), geo);
  const H = geo.h * T;
  ctx.fillStyle = "#000000"; ctx.fillRect(-cx, -cy, geo.w * T, H);
  for (let x = 0; x < tr.cols.length; x++) {
    const c = tr.cols[x];
    // a VELHA escorrendo: cai acelerando (um quadrado do tempo), esticando um pouco
    const e = Math.max(0, tr.t - c.d), cai = e * e * c.a;
    if (cai < H) {
      ctx.drawImage(velha, x, 0, 1, H, x - cx, cai - cy, 1, H + Math.min(40, cai * 0.25));
      // o PINGO na ponta de baixo da coluna
      if (cai > 2 && x % 3 === 0) { ctx.fillStyle = "#ff00dc"; ctx.fillRect(x - cx, Math.round(cai + H * 0.98) - cy - H, 1, 2); }
    }
    // a NOVA pingando de cima: desce do topo até fechar a coluna
    const en = Math.max(0, tr.t - c.p), desce = Math.min(H, en * en * 900 + en * 120);
    if (desce > 0) {
      ctx.drawImage(nova, x, H - desce, 1, desce, x - cx, -cy, 1, desce);
      // a gota da frente
      if (desce < H && x % 2 === 0) { ctx.fillStyle = "#40ff60"; ctx.fillRect(x - cx, desce - cy, 1, 2); }
    }
  }
  // uns pixels da cor errada no meio (o VOID)
  for (let k = 0; k < 30; k++) {
    ctx.fillStyle = ["#ff00dc", "#40ff60", "#ffffff"][k % 3];
    ctx.fillRect(((k * 97 + tr.t * 400) % (geo.w * T)) - cx, ((k * 53 + tr.t * 220) % H) - cy, 1, 1);
  }
}
