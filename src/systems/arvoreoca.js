// A ÁRVORE OCA DA ROTA 1 (os dados e as plantas: src/data/arvore-oca.js). Aqui:
// o DESENHO de dentro da árvore (do zero), a PORTA que abre atrás de você, o
// GUZZLORD ALFA correndo atrás, o ROUBO se ele te pega, a FUGA pra SALA DO
// TESOURO e a porta dela, aberta, com ele ENTALADO tentando entrar. Tudo recebe a cena do mundo
// (`ow`), como src/systems/ligabrag.js.
import { DB } from "../data/index.js";
import { Audio2 } from "../core/audio.js";
import { Assets } from "../core/assets.js";
import { makeRng } from "../core/rng.js";
import { tocarGrito } from "./gritos.js";

const T = 16;
const A = () => DB.ARVORE;

// ------------------------------------------------------------ o desenho
const cache = new Map();
function salaDe(geo) {
  const k = geo.w + "x" + geo.h + geo.planta.join("");
  if (cache.has(k)) return cache.get(k);
  const cv = document.createElement("canvas");
  cv.width = geo.w * T; cv.height = geo.h * T;
  const ctx = cv.getContext("2d"), r = makeRng(1717);
  const at = (x, y) => geo.planta[y]?.[x] ?? "#";
  const ret = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  const px = (x, y, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1); };
  for (let y = 0; y < geo.h; y++) for (let x = 0; x < geo.w; x++) {
    const c = at(x, y), X = x * T, Y = y * T;
    if (c === "#" || c === "Z") {
      // a CASCA por dentro: madeira escura em fibras, com raiz e cogumelo que brilha
      ret(X, Y, T, T, "#3a2414");
      for (let k = 0; k < 4; k++) ret(X + ((x * 5 + k * 4) % 14), Y, 1, T, k % 2 ? "#2a180c" : "#4a3020");
      if (at(x, y + 1) !== "#" && at(x, y + 1) !== "Z") {        // a cara da parede, com luz
        ret(X, Y + 10, T, 6, "#5a3a22"); ret(X, Y + 10, T, 1, "#7a5232");
        for (let k = 0; k < 3; k++) ret(X + r.int(14), Y + 11 + r.int(4), 2, 1, "#3a2414");
      }
      if (r.chance(0.12)) {                                         // o COGUMELO aceso
        const mx = X + 3 + r.int(9), my = Y + 4 + r.int(8);
        ret(mx, my, 4, 2, "#78e8c8"); ret(mx + 1, my + 2, 2, 3, "#d8f0e0"); px(mx + 1, my, "#d8fff0");
      }
      if (r.chance(0.15)) for (let k = 0; k < 6; k++) px(X + 2 + k * 2, Y + 3 + (k % 3), "#6a4428");   // raiz
      continue;
    }
    // o CHÃO: anéis de madeira (é o miolo da árvore), com folha e terra
    ret(X, Y, T, T, "#8a6038");
    ctx.strokeStyle = "#7a5230"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(X + 8, Y + 8, 3 + (x + y) % 3, 0, Math.PI * 2); ctx.stroke();
    if (r.chance(0.3)) px(X + r.int(16), Y + r.int(16), "#a07848");
    if (r.chance(0.15)) { const fx = X + r.int(13), fy = Y + r.int(13); ret(fx, fy, 3, 2, "#4a8a3a"); px(fx + 1, fy - 1, "#6aaa4a"); }
    if (at(x, y - 1) === "#") ret(X, Y, T, 3, "rgba(20,10,4,0.4)");
    if (c === "U") { ret(X + 2, Y + 3, 12, 12, "#120a04"); ret(X + 3, Y + 4, 10, 1, "#2a1a0c"); }   // o buraco de passar
  }
  cache.set(k, cv);
  return cv;
}

/** desenha a sala por cima do chão do mapa, e as portas do GUZZLORD */
export function desenharArvore(ow, ctx, cx, cy) {
  const geo = ow.geo;
  if (!geo?.planta) return;
  ctx.drawImage(salaDe(geo), -cx, -cy);
  for (let y = 0; y < geo.h; y++) for (let x = 0; x < geo.w; x++) {
    if (geo.planta[y][x] !== "Z") continue;
    const X = x * T - cx, Y = y * T - cy;
    const ar = ow.arvore;
    const aberta = ow.map?.arvoreTesouro ? 0 : ar && ar.fase !== "andando" ? Math.min(1, (ar.t + (ar.fase === "abrindo" ? 0 : 1)) / 0.8) : 0;
    // a sacudida da porta do TESOURO (ele batendo do outro lado)
    const bate = ow.map?.arvoreTesouro ? Math.max(0, (ow.arvoreBate || 0)) : 0;
    const sx = bate > 0 ? Math.round(Math.sin(performance.now() / 25) * 2) : 0;
    if (ow.map?.arvoreTesouro) entalado(ctx, X, Y, bate);
    else porta(ctx, X + sx, Y, aberta, false);
  }
}

/** O GUZZLORD ENTALADO na porta do TESOURO (o CAIO: "a porta vai tar aberta mas
 *  o guzzlord tenta entrar e entala"): a porta está aberta, ele enfia a cara e
 *  o peito, é largo demais e fica preso no batente — se mexendo pros lados,
 *  empurrando (no BUM ele avança um pouquinho e volta) e soltando poeira. */
function entalado(ctx, X, Y, bate) {
  porta(ctx, X, Y, 1, true);                        // o vão aberto, com o escuro roxo
  const t = performance.now() / 1000;
  const mexe = Math.round(Math.sin(t * 9) * 1.5);
  const empurra = Math.round(bate * 10);            // no BUM ele entra mais um tiquinho
  const mon = { species: "guzzlord", alfa: true, seed: 7 };
  // o desenho de FORA DA BOLA (o de andar, o CAIO: "faz usar o sprite de fora da
  // bola"), virado pra dentro da sala (ele vem de baixo: pra cima) e com as
  // pernas andando sem sair do lugar (empurrando); sem ele, o de batalha
  const q = Assets.monAndando(mon, "up", performance.now() * 2);
  ctx.save();
  // ele aparece só da porta pra dentro: o resto do corpo está do outro lado
  ctx.beginPath(); ctx.rect(X - 14, Y - 34, T + 28, 34 + T); ctx.clip();
  if (q) {
    // (menor que o do corredor: o CAIO, "só que menor")
    const e = 0.8, w = Math.round(q.width * e), h = Math.round(q.height * e);
    ctx.drawImage(q, Math.round(X + T / 2 - w / 2 + mexe), Math.round(Y + T + 4 - h - empurra + Math.abs(mexe)), w, h);
  } else {
    const L = 44;
    Assets.desenhaVivo(ctx, mon, Math.round(X + T / 2 - L / 2 + mexe), Math.round(Y - 22 - empurra + Math.abs(mexe)), L);
  }
  ctx.restore();
  // o BATENTE por cima dele, apertando dos dois lados (é isso que segura ele)
  for (const lado of [-1, 1]) {
    const bx = lado < 0 ? X - 3 : X + T;
    ctx.fillStyle = "#5a3a1e"; ctx.fillRect(bx, Y - 10, 3, T + 10);
    ctx.fillStyle = "#7a5232"; ctx.fillRect(bx + (lado < 0 ? 0 : 2), Y - 10, 1, T + 10);
  }
  ctx.fillStyle = "#5a3a1e"; ctx.fillRect(X - 3, Y - 12, T + 6, 3);
  // as RACHADURAS na parede em volta, e a poeira no BUM
  ctx.fillStyle = "#1a0c04";
  for (const [dx, dy] of [[-6, -4], [-8, 2], [T + 5, -6], [T + 7, 1]]) { ctx.fillRect(X + dx, Y + dy, 3, 1); ctx.fillRect(X + dx + 1, Y + dy + 1, 1, 2); }
  if (bate > 0) {
    ctx.fillStyle = `rgba(200,170,120,${bate * 1.8})`;
    for (let k = 0; k < 8; k++) ctx.fillRect(X - 4 + ((k * 37) % (T + 8)), Y - 14 + ((k * 13) % 20) - bate * 20, 2, 2);
  }
}

/** a PORTA: de tábua com duas cintas de ferro; aberta, o escuro com o brilho
 *  roxo de ULTRA BEAST lá dentro */
function porta(ctx, X, Y, aberta, deCima) {
  ctx.fillStyle = "#0a0408"; ctx.fillRect(X, Y, T, T);
  const g = ctx.createRadialGradient(X + 8, Y + 8, 1, X + 8, Y + 8, 10);
  g.addColorStop(0, "rgba(180,60,220,0.8)"); g.addColorStop(1, "rgba(60,0,80,0)");
  ctx.fillStyle = g; ctx.fillRect(X, Y, T, T);
  // a tábua desliza pra dentro da parede (sobe) quando abre
  const h = Math.round(T * (1 - aberta));
  if (h <= 0) return;
  ctx.fillStyle = "#6a4020"; ctx.fillRect(X + 1, Y, T - 2, h);
  ctx.fillStyle = "#4a2a12";
  for (let k = 4; k < T - 1; k += 4) ctx.fillRect(X + k, Y, 1, h);
  ctx.fillStyle = "#5a5e68";
  for (const fy of [3, 11]) if (fy < h) { ctx.fillRect(X + 1, Y + fy, T - 2, 2); ctx.fillStyle = "#8a909c"; ctx.fillRect(X + 2, Y + fy, 1, 1); ctx.fillRect(X + T - 3, Y + fy, 1, 1); ctx.fillStyle = "#5a5e68"; }
  if (deCima) { ctx.fillStyle = "#c0a070"; ctx.fillRect(X + 11, Y + 7, 2, 2); }   // a maçaneta
}

// ------------------------------------------------------------ o GUZZLORD
/** o update: devolve true quando você não pode andar (a porta abrindo) */
export function updateArvore(ow, dt) {
  const st = ow.st;
  // a SALA DO TESOURO: ele bate na porta de tempos em tempos
  if (ow.map?.arvoreTesouro) {
    ow.arvoreBate = Math.max(0, (ow.arvoreBate || 0) - dt);
    ow.arvoreBateT = (ow.arvoreBateT ?? 1.5) - dt;
    if (ow.arvoreBateT <= 0) {
      ow.arvoreBateT = 2 + Math.random() * 2.5;
      ow.arvoreBate = 0.35;
      ow.tremor = Math.max(ow.tremor || 0, 0.25);
      Audio2.tone(70, 0.12, "square", 0.6); Audio2.noise?.(0.08, 0.5);
      if (Math.random() < 0.3) tocarGrito({ species: "guzzlord", alfa: true }, 0.8);
    }
    return false;
  }
  if (!ow.map?.arvoreOca) return false;
  const ar = (ow.arvore ||= { fase: "andando", t: 0 });
  if (ow.dlg.active || ow.fx || ow.fadeDir) return ar.fase === "abrindo";
  ar.t += dt;
  const p = st.player, G = A().guzzlord;
  if (ar.fase === "andando") {
    if (p.y <= A().gatilho) {
      ar.fase = "abrindo"; ar.t = 0;
      Audio2.tone(98, 0.5, "sawtooth", 0.5); ow.tremor = 0.6;
    }
    return false;
  }
  if (ar.fase === "abrindo") {
    if (ar.t >= 0.9) {
      ar.fase = "grito"; ar.t = 0;
      const pt = A().porta;
      ar.gx = (pt.x + 1) * T + 8; ar.gy = pt.y * T + 8;
      tocarGrito({ species: "guzzlord", alfa: true });
      ow.tremor = 1;
      ow.dlg.say([A().textos.grito, A().textos.porta, A().textos.corre], () => { ar.fase = "corrida"; ar.t = 0; });
    }
    return true;
  }
  if (ar.fase === "corrida") {
    const { px, py } = ow.playerPixel();
    const alvoX = px + 8, alvoY = py + 8;
    const dx = alvoX - ar.gx, dy = alvoY - ar.gy, d = Math.hypot(dx, dy);
    if (d < 12) { ar.fase = "pegou"; pegou(ow); return true; }
    const v = G.velocidade * dt;
    ar.gx += (dx / d) * Math.min(v, d); ar.gy += (dy / d) * Math.min(v, d);
    ar.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? "left" : "right") : (dy < 0 ? "up" : "down");
    // o passo pesado dele
    ar.passo = (ar.passo || 0) + v;
    if (ar.passo > 22) { ar.passo = 0; Audio2.tone(55, 0.07, "square", 0.5); ow.tremor = Math.max(ow.tremor || 0, 0.15); }
  }
  return false;
}

/** ELE TE PEGOU: sem batalha. Rouba POKÉ BOLAS vazias e dinheiro, e você acorda fora */
function pegou(ow) {
  const st = ow.st, R = A().roubo;
  const bolas = Math.min(R.bolas, st.items?.["poké bola"] || 0);
  if (bolas) { st.items["poké bola"] -= bolas; if (st.items["poké bola"] <= 0) delete st.items["poké bola"]; }
  const grana = Math.min(R.maxDinheiro, Math.floor((st.money || 0) * R.dinheiro));
  st.money = Math.max(0, (st.money || 0) - grana);
  tocarGrito({ species: "guzzlord", alfa: true }, 1.1);
  ow.tremor = 1.2;
  ow.dlg.say(A().textos.pegou.map((l) => l.replace("{BOLAS}", bolas).replace("{DINHEIRO}", grana)), () => {
    ow.arvore = null;
    sairDaArvore(ow);
  });
}

/** volta pra ROTA 1, do lado da árvore */
export function sairDaArvore(ow) {
  const v = A().volta;
  ow.arvore = null;
  ow.justWarped = true;
  ow.transition(() => {
    Object.assign(ow.st.player, { map: v.mapa, x: v.x, y: v.y, dir: v.dir });
    ow.afterTravel();
    ow.game.autosave?.(true);
  });
}

/** passou pela SAÍDA do corredor: a SALA DO TESOURO, com a porta fechando atrás */
export function escaparArvore(ow) {
  const t = A().tesouro;
  ow.arvore = null;
  ow.justWarped = true;
  ow.transition(() => {
    Object.assign(ow.st.player, { map: t.mapa, x: t.chegada.x, y: t.chegada.y, dir: t.chegada.dir });
    ow.afterTravel();
    ow.arvoreBateT = 1.2;
    ow.game.autosave?.(true);
    ow.dlg.say(A().textos.escapou);
  });
}

/** o GUZZLORD no corredor (por cima, ele é grandão) */
export function desenharGuzzlord(ow, ctx, cx, cy) {
  const ar = ow.arvore;
  if (!ow.map?.arvoreOca || !ar || ar.gx == null) return;
  const mon = { species: A().guzzlord.id, alfa: true, seed: 7 };
  const ms = ar.fase === "corrida" ? performance.now() * 1.4 : 0;
  const q = Assets.monAndando(mon, ar.dir || "right", ms);
  const x = ar.gx - cx, y = ar.gy - cy;
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath(); ctx.ellipse(x, y + 6, 14, 4, 0, 0, Math.PI * 2); ctx.fill();
  if (q) {
    const e = 1.35, w = Math.round(q.width * e), h = Math.round(q.height * e);
    ctx.drawImage(q, Math.round(x - w / 2), Math.round(y + 8 - h), w, h);
  } else Assets.desenhaVivo(ctx, mon, Math.round(x - 20), Math.round(y - 32), 40);
}
