// A SALA DA LIGA DE BRAGLITCH (pedido do CAIO, nov/2026: "um prédio com uma sala
// que se transforma mas de um jeito diferente" — "robôs"). Os dados estão em
// src/data/braglitch-liga.js (`LIGA.sala`, `LIGA.lideres`).
//
// A sala tem CINCO formas, uma por vez: a OFICINA do GAMBI, a CAPELA da LUZIA,
// o SAMBÓDROMO da RAINHA LUA, o SERVIDOR da NIEMA e a CÚPULA dos CAMPEÕES. Cada
// forma é desenhada aqui inteira num canvas (`salaDe`), do zero, pixel por pixel.
//
// A TROCA (venceu um líder: `flags.ligaBragPendente`): CINCO BRAÇOS ROBÓTICOS
// descem do teto. A sala é cortada em BLOCOS de 3x3 tiles; cada braço pega um
// bloco por vez: desce, agarra, sobe com o pedaço velho, volta com o pedaço da
// sala nova, ENCAIXA (faísca de solda e um "clanc") e vai pro próximo. Enquanto
// o bloco está fora, embaixo dele aparece o esqueleto de vigas do prédio.
//
// Tudo aqui recebe a cena do mundo (`ow`), como as outras partes grandes do
// overworld: `trocaLigaBrag(ow, dt)` no update e `desenharLigaBrag(ow, ctx, cx, cy)`
// no desenho do chão.
import { DB } from "../data/index.js";
import { Audio2 } from "../core/audio.js";
import { makeRng } from "../core/rng.js";

const T = 16;
const BLOCO = 3;          // o lado do bloco que um braço carrega, em tiles
const BRACOS = 5;          // (o CAIO: "faz ser 5 braços")
const POR_BLOCO = 1.15;   // segundos de cada viagem do braço
const ENTRA = 0.9;        // os braços descendo antes do primeiro bloco
const SAI = 1.1;          // e subindo depois do último

const L = () => DB.LIGA_BRAG;
const etapa = (st) => st.flags?.ligaBragEtapa || 0;
const temaDe = (i) => (i >= L().lideres.length ? L().temaCampeoes : L().lideres[i].tema);

// ------------------------------------------------------------ os desenhos
const cache = new Map();

/** o canvas inteiro da sala na forma `tema` (cacheado) */
export function salaDe(tema, geo) {
  const k = tema + ":" + geo.w + "x" + geo.h;
  if (cache.has(k)) return cache.get(k);
  const cv = document.createElement("canvas");
  cv.width = geo.w * T; cv.height = geo.h * T;
  const ctx = cv.getContext("2d");
  const r = makeRng(9000 + tema.length * 31);
  const planta = geo.planta;
  const at = (x, y) => planta[y]?.[x] ?? "#";
  const px = (x, y, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1); };
  const ret = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  const W = geo.w, H = geo.h;
  const meio = (W - 1) / 2;
  const PINTA = PINTORES[tema] || PINTORES.oficina;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const c = at(x, y), X = x * T, Y = y * T;
    const parede = c === "#";
    const topo = parede && y < 2;
    const lado = parede && !topo && y < H - 1;
    const fundo = parede && y === H - 1;
    PINTA({ ctx, px, ret, r, x, y, X, Y, W, H, meio, topo, lado, fundo, chao: !parede, porta: c === "U", face: topo && y === 1 });
  }
  PINTORES[tema + "_depois"]?.({ ctx, px, ret, r, W, H, meio });
  cache.set(k, cv);
  return cv;
}

const PINTORES = {
  // A OFICINA DO GAMBI: chapa de aço com rebite, a faixa de perigo amarela e
  // preta perto da parede, os fios vermelhos e azuis pendurados, o quadro de luz
  oficina({ px, ret, r, x, y, X, Y, W, H, meio, topo, lado, fundo, chao, porta, face }) {
    if (chao || porta) {
      ret(X, Y, T, T, "#4a505a"); ret(X, Y, T, 1, "#5e6570"); ret(X, Y, 1, T, "#5e6570");
      ret(X + T - 1, Y, 1, T, "#353a42"); ret(X, Y + T - 1, T, 1, "#353a42");
      for (const [a, b] of [[2, 2], [13, 2], [2, 13], [13, 13]]) { px(X + a, Y + b, "#8a919c"); px(X + a + 1, Y + b + 1, "#2a2e35"); }
      if (r.chance(0.25)) ret(X + 4 + r.int(6), Y + 5 + r.int(6), 3, 1, "#3d424b");    // risco de ferramenta
      const borda = x === 1 || x === W - 2 || y === 2 || y === H - 2;
      if (borda && !porta) for (let k = 0; k < T; k += 4) ret(X + k, Y + (y === 2 ? 0 : y === H - 2 ? 13 : 0), 2, 3, k % 8 ? "#141414" : "#f0c020");
      if (porta) { ret(X + 2, Y + 4, 12, 12, "#20242a"); ret(X + 3, Y + 5, 10, 1, "#f0c020"); }
      return;
    }
    // a parede: tijolo cinza
    ret(X, Y, T, T, "#5a5f68");
    for (let k = 0; k < 4; k++) { ret(X, Y + k * 4, T, 1, "#3e424a"); ret(X + ((k % 2) * 8 + 3), Y + k * 4 + 1, 1, 3, "#3e424a"); }
    if (topo && face) {
      // os FIOS pendurados, cada um de uma cor
      const cor = ["#d83838", "#3868d8", "#e8c030", "#30a850"][(x * 3) % 4];
      for (let k = 0; k < T; k++) px(X + k, Y + 6 + Math.round(Math.sin((k + x * 5) / 16 * Math.PI) * 4), cor);
      if (x % 4 === 1) {                         // o QUADRO DE LUZ com o raio
        ret(X + 3, Y + 2, 10, 11, "#2a2e35"); ret(X + 4, Y + 3, 8, 9, "#d8dce4");
        px(X + 8, Y + 4, "#f0c020"); px(X + 7, Y + 5, "#f0c020"); px(X + 7, Y + 6, "#f0c020"); px(X + 8, Y + 6, "#f0c020");
        px(X + 9, Y + 6, "#f0c020"); px(X + 8, Y + 7, "#f0c020"); px(X + 8, Y + 8, "#f0c020"); px(X + 7, Y + 9, "#f0c020");
      } else if (x % 4 === 3) {                  // a TOMADA de três pinos
        ret(X + 5, Y + 8, 6, 6, "#e8e8e0"); px(X + 7, Y + 10, "#222"); px(X + 9, Y + 10, "#222"); px(X + 8, Y + 12, "#222");
      }
    }
    if (topo && !face) { ret(X, Y, T, T, "#2e3238"); if (x % 3 === 0) { ret(X + 6, Y + 6, 4, 10, "#222"); ret(X + 4, Y + 12, 8, 4, "#f8f0a0"); } }   // a lâmpada pendurada
    if (lado) ret(X + (x === 0 ? 12 : 0), Y, 4, T, "#3e424a");
    if (fundo) ret(X, Y, T, 4, "#3e424a");
  },

  // A CAPELA DA LUZIA: tábua escura arroxeada, o tapete roxo no meio, as
  // janelas em arco acesas de azul e os LAMPIÕES amarelos na parede
  capela({ px, ret, r, x, y, X, Y, W, H, meio, topo, lado, fundo, chao, porta, face }) {
    if (chao || porta) {
      ret(X, Y, T, T, "#3a2a3a");
      for (let k = 0; k < 4; k++) { ret(X, Y + k * 4 + 3, T, 1, "#2a1c2a"); ret(X + ((x + k) % 3) * 5, Y + k * 4, 1, 3, "#2a1c2a"); }
      if (r.chance(0.3)) ret(X + r.int(12), Y + r.int(14), 3, 1, "#4a3a4a");
      if (Math.abs(x - meio) <= 1) {             // o TAPETE roxo com a barra dourada
        ret(X, Y, T, T, "#5a2a7a");
        if (x === Math.floor(meio) - 0 && 0) ret(X, Y, T, T, "#5a2a7a");
        if (Math.abs(x - meio) === 1) ret(X + (x < meio ? 0 : 14), Y, 2, T, "#c8a040");
        for (let k = 0; k < T; k += 4) px(X + 7, Y + k, "#7a4a9a");
      }
      if ((x === 1 || x === W - 2) && y % 3 === 0) {   // a VELA no chão
        ret(X + 6, Y + 6, 4, 8, "#f0e8d0"); px(X + 7, Y + 4, "#f8b030"); px(X + 8, Y + 4, "#f8b030"); px(X + 7, Y + 3, "#fff0a0");
        ret(X + 4, Y + 14, 8, 1, "#2a1c2a");
      }
      if (porta) ret(X + 2, Y + 4, 12, 12, "#1a101a");
      return;
    }
    ret(X, Y, T, T, "#2a2234");
    for (let k = 0; k < 3; k++) if (r.chance(0.5)) ret(X + r.int(12), Y + r.int(12), 4, 3, "#352c40");
    if (topo && face) {
      if (x % 3 === 1) {                         // a JANELA em arco, acesa de azul
        ret(X + 3, Y + 3, 10, 13, "#1a1424"); ret(X + 4, Y + 5, 8, 11, "#4a78c8");
        ret(X + 5, Y + 4, 6, 1, "#4a78c8"); ret(X + 7, Y + 5, 2, 11, "#1a1424"); ret(X + 4, Y + 10, 8, 1, "#1a1424");
        px(X + 5, Y + 6, "#a8c8f8"); px(X + 9, Y + 6, "#a8c8f8");
      } else {                                   // o LAMPIÃO
        ret(X + 6, Y + 2, 4, 2, "#1a1424"); ret(X + 5, Y + 4, 6, 7, "#2a2234"); ret(X + 6, Y + 5, 4, 5, "#f8d060");
        px(X + 7, Y + 6, "#fff8c0"); ret(X + 4, Y + 11, 8, 1, "#1a1424");
      }
    }
    if (topo && !face) { ret(X, Y, T, T, "#1a1424"); if ((x + 1) % 4 === 0) ret(X + 4, Y + 4, 8, 8, "#2a2234"); }
    if (lado) ret(X + (x === 0 ? 12 : 0), Y, 4, T, "#1a1424");
    if (fundo) ret(X, Y, T, 4, "#1a1424");
  },

  // O SAMBÓDROMO DA RAINHA LUA: o chão de xadrez colorido, os TAMBORES da
  // bateria na parede, as faixas de luz e o confete espalhado
  samba({ px, ret, r, x, y, X, Y, W, H, meio, topo, lado, fundo, chao, porta, face }) {
    if (chao || porta) {
      const CORES = ["#e84890", "#f8c830", "#30b868", "#3888e8"];
      for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) ret(X + i * 8, Y + j * 8, 8, 8, CORES[(x * 2 + i + (y * 2 + j) * 3) % 4]);
      ret(X, Y, T, 1, "rgba(255,255,255,0.25)");
      for (let k = 0; k < 4; k++) px(X + r.int(16), Y + r.int(16), r.pick(["#ffffff", "#f8e050", "#f878c8", "#78e8f8"]));   // confete
      if (porta) ret(X + 2, Y + 4, 12, 12, "#301838");
      return;
    }
    ret(X, Y, T, T, "#40204a");
    if (topo && face) {
      if (x % 2 === 0) {                         // o SURDO (tambor) pendurado
        ret(X + 2, Y + 4, 12, 10, "#c83848"); ret(X + 2, Y + 4, 12, 2, "#e8e0d0"); ret(X + 2, Y + 12, 12, 2, "#e8e0d0");
        for (let k = 0; k < 4; k++) ret(X + 3 + k * 3, Y + 6, 1, 6, "#f8c830");
      } else {                                   // a bandeirinha de festa
        ret(X, Y + 2, T, 1, "#e8e0d0");
        ret(X + 3, Y + 3, 5, 5, r.pick(["#f8c830", "#30b868", "#3888e8"])); ret(X + 9, Y + 3, 5, 5, "#e84890");
      }
    }
    if (topo && !face) {                         // o teto com as luzes de palco
      ret(X, Y, T, T, "#2a1430");
      if (x % 3 === 1) { ret(X + 5, Y + 8, 6, 5, "#18101a"); ret(X + 6, Y + 13, 4, 3, "#fff8c0"); }
    }
    if (lado) { ret(X + (x === 0 ? 12 : 0), Y, 4, T, "#2a1430"); ret(X + (x === 0 ? 10 : 4), Y + (y * 5) % 12, 2, 2, "#f8c830"); }
    if (fundo) ret(X, Y, T, 4, "#2a1430");
  },
  samba_depois({ ctx, W, H }) {
    // os HOLOFOTES cruzando o chão
    for (const [x0, x1] of [[2, 6], [W - 3, W - 7]]) {
      const g = ctx.createLinearGradient(x0 * T, 2 * T, x1 * T, H * T);
      g.addColorStop(0, "rgba(255,250,200,0.28)"); g.addColorStop(1, "rgba(255,250,200,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(x0 * T, 2 * T); ctx.lineTo(x1 * T - 24, H * T); ctx.lineTo(x1 * T + 24, H * T); ctx.closePath(); ctx.fill();
    }
  },

  // O SERVIDOR DA NIEMA: o chão preto com as trilhas de CIRCUITO ciano e os
  // ARMÁRIOS de servidor na parede, cheios de luzinha
  servidor({ px, ret, r, x, y, X, Y, W, H, meio, topo, lado, fundo, chao, porta, face }) {
    if (chao || porta) {
      ret(X, Y, T, T, "#0c1218"); ret(X, Y, T, 1, "#16202a"); ret(X, Y, 1, T, "#16202a");
      // as trilhas: uma reta e uma curva por tile, com o "pino" no fim
      const c = "#1e8aa8";
      if ((x + y) % 2 === 0) { ret(X, Y + 7, 10, 1, c); ret(X + 10, Y + 7, 1, 9, c); px(X + 10, Y + 15, "#58e0f8"); }
      else { ret(X + 5, Y, 1, 8, c); ret(X + 5, Y + 8, 11, 1, c); ret(X + 4, Y + 7, 3, 3, "#58e0f8"); }
      if (r.chance(0.15)) px(X + r.int(16), Y + r.int(16), "#58e0f8");
      if (porta) ret(X + 2, Y + 4, 12, 12, "#04080c");
      return;
    }
    ret(X, Y, T, T, "#1a2028");
    if (topo && face) {                          // o ARMÁRIO do servidor, cheio de luz
      ret(X + 1, Y, 14, T, "#0e1216"); ret(X + 2, Y + 1, 12, 14, "#20262e");
      for (let k = 0; k < 4; k++) {
        ret(X + 3, Y + 2 + k * 3, 10, 2, "#2c343e");
        px(X + 4, Y + 2 + k * 3, r.pick(["#30e860", "#30e860", "#f8c030", "#e83030", "#58c8f8"]));
        px(X + 6, Y + 2 + k * 3, r.pick(["#30e860", "#58c8f8"]));
      }
    }
    if (topo && !face) { ret(X, Y, T, T, "#0e1216"); for (let k = 0; k < 3; k++) ret(X + r.int(14), Y + 4 + k * 4, 2, 1, "#1e8aa8"); }
    if (lado) { ret(X + (x === 0 ? 12 : 0), Y, 4, T, "#0e1216"); px(X + (x === 0 ? 13 : 2), Y + 4, "#30e860"); }
    if (fundo) ret(X, Y, T, 4, "#0e1216");
  },

  // A CÚPULA DOS CAMPEÕES: mármore branco com veio, o tapete azul de borda
  // dourada até os campeões, e na parede as DUAS CÚPULAS (a de cima e a de
  // baixo, as do Congresso) com as faixas verde e amarela
  cupula({ px, ret, r, x, y, X, Y, W, H, meio, topo, lado, fundo, chao, porta, face }) {
    if (chao || porta) {
      ret(X, Y, T, T, "#e8e8ec"); ret(X, Y, T, 1, "#f8f8fa"); ret(X + T - 1, Y, 1, T, "#c8c8d0");
      if (r.chance(0.5)) for (let k = 0; k < 8; k++) px(X + 2 + k + r.int(2), Y + 3 + Math.round(k * 0.7) + r.int(2), "#c0c0cc");
      if (Math.abs(x - meio) <= 1 && y >= 3) {   // o TAPETE azul até os campeões
        ret(X, Y, T, T, "#2848a8");
        if (Math.abs(x - meio) === 1) ret(X + (x < meio ? 0 : 13), Y, 3, T, "#e8c040");
        if (x === meio) for (let k = 2; k < T; k += 6) { px(X + 7, Y + k, "#f8e070"); px(X + 8, Y + k + 1, "#f8e070"); }
      }
      if (porta) ret(X + 2, Y + 4, 12, 12, "#a8a8b4");
      return;
    }
    ret(X, Y, T, T, "#f4f4f8");
    if (topo && face) {
      ret(X, Y + 12, T, 2, "#30a050"); ret(X, Y + 14, T, 2, "#f0c830");   // as faixas
      ret(X, Y, T, 1, "#d0d0d8");
    }
    if (topo && !face) ret(X, Y, T, T, "#d8d8e0");
    if (lado) { ret(X + (x === 0 ? 12 : 0), Y, 4, T, "#c8c8d0"); ret(X + (x === 0 ? 12 : 0), Y + 7, 4, 2, "#e8c040"); }
    if (fundo) ret(X, Y, T, 4, "#c8c8d0");
  },
  cupula_depois({ ctx, W }) {
    // as DUAS CÚPULAS na parede de cima: a de boca pra baixo e a de boca pra cima
    const y = 4;
    ctx.fillStyle = "#ffffff"; ctx.strokeStyle = "#a8a8b4"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(4 * T, y + 18, 14, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc((W - 4) * T, y + 4, 14, 0, Math.PI); ctx.closePath(); ctx.fill(); ctx.stroke();
    // as duas torres no meio
    ctx.fillStyle = "#d8d8e0"; ctx.fillRect(W * T / 2 - 9, 2, 7, 26); ctx.fillRect(W * T / 2 + 2, 2, 7, 26);
    ctx.fillStyle = "#a8a8b4"; for (let k = 4; k < 26; k += 4) { ctx.fillRect(W * T / 2 - 8, k, 5, 1); ctx.fillRect(W * T / 2 + 3, k, 5, 1); }
  },
};

// ------------------------------------------------------------ a troca
/** o roteiro dos blocos: cada um com o braço, a hora de pegar e a de encaixar */
function roteiro(geo) {
  const blocos = [];
  for (let by = 0; by < geo.h; by += BLOCO) for (let bx = 0; bx < geo.w; bx += BLOCO) {
    blocos.push({ x: bx, y: by, w: Math.min(BLOCO, geo.w - bx), h: Math.min(BLOCO, geo.h - by) });
  }
  // de cima pra baixo, de fora pra dentro (os braços vão se encontrando no meio)
  const cx = geo.w / 2;
  blocos.sort((a, b) => (a.y - b.y) || (Math.abs(b.x + 1.5 - cx) - Math.abs(a.x + 1.5 - cx)));
  blocos.forEach((b, i) => {
    b.braco = i % BRACOS;
    b.ini = ENTRA + Math.floor(i / BRACOS) * POR_BLOCO + b.braco * 0.12;
  });
  const fim = Math.max(...blocos.map((b) => b.ini + POR_BLOCO)) + SAI;
  return { blocos, fim };
}

/** o update: começa a troca quando tem uma pendente; enquanto dura, devolve
 *  true (você não anda) */
export function trocaLigaBrag(ow, dt) {
  const st = ow.st;
  if (!ow.map?.ligaBrag) return false;
  if (!ow.ligaBragTroca) {
    const para = st.flags?.ligaBragPendente;
    if (para == null || ow.dlg.active || ow.fx || ow.fadeDir || ow.fadeA > 0 || ow.menu || ow.move) return false;
    st.flags.ligaBragPendente = null;
    st.flags.ligaBragTrocando = true;
    const geo = ow.geo;
    ow.ligaBragTroca = { de: para - 1, para, t: 0, ...roteiro(geo), som: new Set(), faiscas: [] };
    Audio2.tone(98, 0.4, "sawtooth", 0.4); Audio2.tone(147, 0.5, "square", 0.3);
    return true;
  }
  const tr = ow.ligaBragTroca;
  tr.t += dt;
  // os sons de cada bloco: o motor descendo, o "tchac" de pegar, o "clanc" de encaixar
  for (const [i, b] of tr.blocos.entries()) {
    const e = tr.t - b.ini;
    if (e > 0.05 && !tr.som.has(i + "d")) { tr.som.add(i + "d"); Audio2.tone(220 + b.braco * 30, 0.08, "sawtooth", 0.18); }
    if (e > 0.3 && !tr.som.has(i + "p")) { tr.som.add(i + "p"); Audio2.tone(140, 0.05, "square", 0.3); }
    if (e > 0.95 && !tr.som.has(i + "c")) {
      tr.som.add(i + "c");
      Audio2.tone(90, 0.06, "square", 0.45); Audio2.tone(1800 + Math.random() * 600, 0.05, "square", 0.12);
      ow.tremor = Math.max(ow.tremor || 0, 0.12);
      // as FAÍSCAS da solda, nos cantos do bloco
      for (let k = 0; k < 14; k++) {
        const a = Math.random() * Math.PI * 2, v = 30 + Math.random() * 70;
        tr.faiscas.push({ x: (b.x + (k % 2 ? 0 : b.w)) * T, y: (b.y + b.h) * T - 2, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 40, t: 0 });
      }
    }
  }
  for (const f of tr.faiscas) { f.t += dt; f.x += f.vx * dt; f.y += f.vy * dt; f.vy += 160 * dt; }
  tr.faiscas = tr.faiscas.filter((f) => f.t < 0.5);
  if (tr.t >= tr.fim) {
    ow.ligaBragTroca = null;
    st.flags.ligaBragEtapa = tr.para;
    st.flags.ligaBragTrocando = false;
    ow.game.autosave?.(true);
    const prox = tr.para < L().lideres.length ? L().lideres[tr.para].nome : "OS CAMPEÕES";
    ow.dlg.say(L().troca.replace("{QUEM}", prox));
  }
  return true;
}

/** o desenho da sala (por cima do chão do mapa), com a troca se estiver
 *  acontecendo */
export function desenharLigaBrag(ow, ctx, cx, cy) {
  const geo = ow.geo;
  if (!geo?.planta) return;
  const tr = ow.ligaBragTroca;
  const agora = salaDe(temaDe(tr ? tr.de : etapa(ow.st)), geo);
  if (!tr) { ctx.drawImage(agora, -cx, -cy); return; }
  const velha = salaDe(temaDe(tr.de), geo), nova = salaDe(temaDe(tr.para), geo);
  // o chão do jeito que está: cada bloco velho, vazio ou novo
  for (const b of tr.blocos) {
    const e = tr.t - b.ini;
    const sx = b.x * T, sy = b.y * T, w = b.w * T, h = b.h * T;
    if (e < 0.3) ctx.drawImage(velha, sx, sy, w, h, sx - cx, sy - cy, w, h);
    else if (e < 0.95) vazio(ctx, sx - cx, sy - cy, w, h);
    else ctx.drawImage(nova, sx, sy, w, h, sx - cx, sy - cy, w, h);
  }
}

/** o que se vê no buraco do bloco que saiu: o ESQUELETO do prédio (as vigas
 *  de metal em grade, e o escuro lá embaixo com uma luz piscando) */
function vazio(ctx, x, y, w, h) {
  ctx.fillStyle = "#08080c"; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "#3a3e48";
  for (let k = 0; k <= w; k += 16) ctx.fillRect(x + k - 1, y, 2, h);
  for (let k = 0; k <= h; k += 16) ctx.fillRect(x, y + k - 1, w, 2);
  ctx.fillStyle = "#5a606c";
  for (let k = 0; k < w; k += 16) for (let j = 0; j < h; j += 16) { ctx.fillRect(x + k + 3, y + j + 3, 1, 1); ctx.fillRect(x + k + 12, y + j + 12, 1, 1); }
  if ((performance.now() / 250 | 0) % 2) { ctx.fillStyle = "#e83030"; ctx.fillRect(x + w / 2 - 1, y + h / 2 - 1, 2, 2); }
}

/** OS BRAÇOS, os blocos carregados e as faíscas: por cima de tudo (até de
 *  você), porque eles vêm do teto. Chamado no fim do desenho do mundo. */
export function desenharBracosLigaBrag(ow, ctx, cx, cy) {
  const tr = ow.ligaBragTroca;
  if (!tr || !ow.geo?.planta) return;
  const velha = salaDe(temaDe(tr.de), ow.geo), nova = salaDe(temaDe(tr.para), ow.geo);
  const alto = -12;                               // o trilho do teto (acima da tela)
  for (const b of tr.blocos) {
    const e = tr.t - b.ini;
    if (e < 0 || e > POR_BLOCO) continue;
    const bx = b.x * T - cx, by = b.y * T - cy, w = b.w * T, h = b.h * T;
    const alvoX = bx + w / 2, alvoY = by + h / 2;
    // onde está a GARRA: desce (0–0,3), sobe com o velho (0,3–0,6), desce com o novo (0,6–0,95), sobe vazia
    let gy, carga = null, k;
    if (e < 0.3) { k = e / 0.3; gy = alto + (alvoY - alto) * suave(k); }
    else if (e < 0.6) { k = (e - 0.3) / 0.3; gy = alvoY + (alto - 40 - alvoY) * suave(k); carga = velha; }
    else if (e < 0.95) { k = (e - 0.6) / 0.35; gy = alto - 40 + (alvoY - alto + 40) * suave(k); carga = nova; }
    else { k = (e - 0.95) / (POR_BLOCO - 0.95); gy = alvoY + (alto - alvoY) * suave(k); }
    const gx = alvoX + Math.sin(e * 9 + b.braco) * (carga ? 1.5 : 0);   // balança um pouco carregando
    if (carga) {
      ctx.drawImage(carga, b.x * T, b.y * T, w, h, Math.round(gx - w / 2), Math.round(gy - h / 2), w, h);
      ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.fillRect(Math.round(gx - w / 2), Math.round(gy + h / 2), w, 2);
    }
    braco(ctx, gx, gy - (carga ? h / 2 : 6), b.braco, !!carga);
  }
  for (const f of tr.faiscas) {
    ctx.fillStyle = f.t < 0.2 ? "#fff8c0" : f.t < 0.35 ? "#f8c030" : "#e86020";
    ctx.fillRect(Math.round(f.x - cx), Math.round(f.y - cy), 2, 2);
  }
  // o clarão da solda bem na hora de encaixar
  for (const b of tr.blocos) {
    const e = tr.t - b.ini;
    if (e > 0.93 && e < 1.05) {
      ctx.fillStyle = `rgba(200,240,255,${0.6 - (e - 0.93) * 5})`;
      ctx.beginPath(); ctx.arc(b.x * T - cx + 2, (b.y + b.h) * T - cy - 2, 7, 0, Math.PI * 2); ctx.fill();
    }
  }
}

const suave = (k) => k * k * (3 - 2 * k);

/** UM BRAÇO ROBÓTICO: o trilho no teto, o braço de dois pedaços com o
 *  cotovelo, as faixas amarelas e pretas e a GARRA (fechada se carrega) */
function braco(ctx, gx, gy, n, fechada) {
  const topoX = gx + [-26, 26, -14, 14, 0][n], topoY = -14;
  const cotX = (topoX + gx) / 2 + [-18, 18, -12, 12, 16][n], cotY = (topoY + gy) / 2;
  const seg = (x0, y0, x1, y1, larg) => {
    ctx.strokeStyle = "#202430"; ctx.lineWidth = larg + 2; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    ctx.strokeStyle = "#8a909c"; ctx.lineWidth = larg;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    // a faixa de perigo no meio do pedaço
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
    ctx.strokeStyle = "#f0c020"; ctx.lineWidth = larg - 2;
    ctx.beginPath(); ctx.moveTo(mx - (x1 - x0) * 0.08, my - (y1 - y0) * 0.08); ctx.lineTo(mx + (x1 - x0) * 0.08, my + (y1 - y0) * 0.08); ctx.stroke();
  };
  seg(topoX, topoY, cotX, cotY, 6);
  seg(cotX, cotY, gx, gy - 4, 5);
  // o cotovelo e o motor do ombro
  ctx.fillStyle = "#202430"; ctx.beginPath(); ctx.arc(cotX, cotY, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#c8ccd4"; ctx.beginPath(); ctx.arc(cotX, cotY, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = (performance.now() / 180 | 0) % 2 ? "#e83030" : "#601010"; ctx.fillRect(Math.round(cotX) - 1, Math.round(cotY) - 1, 2, 2);
  // a GARRA: três dedos, abertos ou fechados
  const abre = fechada ? 2 : 6;
  ctx.fillStyle = "#202430"; ctx.fillRect(Math.round(gx) - 5, Math.round(gy) - 6, 10, 5);
  ctx.fillStyle = "#a8aeb8"; ctx.fillRect(Math.round(gx) - 4, Math.round(gy) - 5, 8, 3);
  for (const lado of [-1, 1]) {
    ctx.strokeStyle = "#202430"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(gx + lado * 3, gy - 1); ctx.lineTo(gx + lado * abre, gy + 5); ctx.lineTo(gx + lado * (abre - 2), gy + 8); ctx.stroke();
    ctx.strokeStyle = "#c8ccd4"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(gx + lado * 3, gy - 1); ctx.lineTo(gx + lado * abre, gy + 5); ctx.stroke();
  }
}
