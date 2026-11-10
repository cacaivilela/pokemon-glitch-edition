// THE LEGENDS OF CELEBI (ideia do CAIO, 08/nov/2026): o 2º jogo do NINTENDO
// SWITCH do quarto. Aventura vista de cima, de tela em tela.
//  - VOCÊ é o AEGISLASH, com a espada e o escudo dele mesmo:
//    Z = golpe de ESPADA (corta mato também), SEGURAR X = ESCUDO (bloqueia o que
//    vem pela frente, mas anda devagar). C = sai (o progresso fica salvo).
//  - a CELEBA (CELEBI + a princesa da lenda, nome dele) luta do seu lado com a
//    ESPADA DE GALHO DE AMAZONIUM; no templo ela aprende a FOLHA NAVALHA e
//    acerta de longe (até o CRISTAL do outro lado da água).
//  - o BOSQUE DO TEMPO (6 telas) e o TEMPLO DA RAIZ (5 salas): chave pequena,
//    porta trancada, cristal que liga a ponte, baús que aparecem quando a sala
//    fica limpa, e o chefão TREVENANT.
// Os bichos são os SPRITES DE ANDAR (Assets.monAndando), como no SUPER PAWMOT.
// O mapa e as salas foram inventados aqui; os ladrilhos são desenhados ponto a
// ponto no código. Progresso em st.flags.celeba. ?celeba=1 abre direto.
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { drawText } from "../core/gfx.js";
import { Assets } from "../core/assets.js";
import { Dialogue } from "../systems/dialogue.js";

const W = 240, H = 160, T = 16, COLS = 15, LINS = 10;
const ANDA = 64, ANDA_ESCUDO = 30;
const GOLPE = 0.24;                 // segundos do golpe de espada
const PCX = 6, PCY = 5;             // meia-caixa do corpo do AEGISLASH (nos pés)

// ------------------------------------------------------------------ as salas
// . grama  , flores  T árvore  r pedra  b mato (a espada corta)  w água
// = ponte  S entrada do templo  _ chão do templo  # parede  o pilar
// D porta trancada (chave pequena)  g grade (o cristal abre)  p ponte apagada
// (o cristal acende)  k cristal  c baú  E saída do templo
const SALAS = {
  "o0,0": { nome: "CLAREIRA DO TEMPO", mapa: [
    "TTTTTTTTTTTTTTT",
    "TT,..,....,..TT",
    "T,...........,T",
    "T.....,..,....T",
    "T..,...........",
    "T..............",
    "T,....,...,...T",
    "TT.....,.....TT",
    "TTTTTT...TTTTTT",
    "TTTTTT...TTTTTT",
  ], inimigos: [] },
  "o1,0": { nome: "BOSQUE", mapa: [
    "TTTTTTTTTTTTTTT",
    "T..b...TT..b..T",
    "T.b..........bT",
    "T....TT..b....T",
    "...............",
    "...............",
    "T..b.....TT...T",
    "T.....b......bT",
    "TTTTTT...TTTTTT",
    "TTTTTT...TTTTTT",
  ], inimigos: [["sewaddle", 4, 2], ["sewaddle", 10, 6], ["sewaddle", 12, 4]] },
  "o2,0": { nome: "LAGO ANTIGO", mapa: [
    "TTTTTTTTTTTTTTT",
    "T..,..wwwwwwwwT",
    "T....wwwwwwwwwT",
    "T....ww,c,wwwwT",
    ".....==,,,wwwwT",
    "......ww,,wwwwT",
    "T,....wwwwwwwwT",
    "T..r..,wwwwwwwT",
    "T,..r....wwwwwT",
    "TTTTTTTTTTTTTTT",
  ], inimigos: [["sewaddle", 3, 6]], baus: { "8,3": "coracao" } },
  "o0,1": { nome: "CAMPO DAS FLORES", mapa: [
    "TTTTTT...TTTTTT",
    "T,,..,.....,,.T",
    "T,..,,..,..,..T",
    "T..,....,,....T",
    "T,....,........",
    "T..,,....,.....",
    "T,.....,..,,..T",
    "T.,,.,.....,,.T",
    "T..,...,..,...T",
    "TTTTTTTTTTTTTTT",
  ], inimigos: [["phantump", 4, 3], ["phantump", 10, 6]] },
  "o1,1": { nome: "TRILHA DAS PEDRAS", mapa: [
    "TTTTTT...TTTTTT",
    "T..r.......r..T",
    "T.....b.b.....T",
    "T.r.........r.T",
    "...............",
    "...............",
    "T.r..b...b..r.T",
    "T......r......T",
    "T..b.......b..T",
    "TTTTTTTTTTTTTTT",
  ], inimigos: [["foongus", 4, 2], ["foongus", 10, 7], ["sewaddle", 7, 6]] },
  "o2,1": { nome: "A ÁRVORE DO TEMPLO", mapa: [
    "TTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTT",
    "TT..TTTTTTT..TT",
    "T....TTSTT....T",
    ".......,......T",
    "...,..........T",
    "T....,....,...T",
    "T.b.........b.T",
    "TT..,....,...TT",
    "TTTTTTTTTTTTTTT",
  ], inimigos: [["phantump", 11, 6]] },
  // ---- o TEMPLO DA RAIZ
  "d1,2": { nome: "TEMPLO DA RAIZ", templo: true, mapa: [
    "######DDD######",
    "#_____________#",
    "#__o_______o__#",
    "#_____________#",
    "______________#",
    "______________#",
    "#_____________#",
    "#__o_______o__#",
    "#_____________#",
    "######EEE######",
  ], inimigos: [["spinarak", 7, 3], ["spinarak", 9, 6]] },
  "d0,2": { nome: "SALA DA CHAVE", templo: true, mapa: [
    "###############",
    "#_____________#",
    "#_o_o_____o_o_#",
    "#_____________#",
    "#______c_______",
    "#______________",
    "#_____________#",
    "#_o_o_____o_o_#",
    "#_____________#",
    "###############",
  ], inimigos: [["gastly", 3, 4], ["gastly", 11, 6]], baus: { "7,4": "chave" }, bauNaLimpa: true },
  "d1,1": { nome: "SALA DO CRISTAL", templo: true, mapa: [
    "######ggg######",
    "#_____________#",
    "#__k_______o__#",
    "#wwwwwpppwwwww#",
    "#wwwwwpppwwwww#",
    "#______________",
    "#______________",
    "#__o_______o__#",
    "#_____________#",
    "######___######",
  ], inimigos: [["gastly", 10, 7]] },
  "d2,1": { nome: "SALA DA FOLHA", templo: true, mapa: [
    "###############",
    "#_____________#",
    "#_o_________o_#",
    "#_____________#",
    "#______c______#",
    "______________#",
    "______________#",
    "#_o_________o_#",
    "#_____________#",
    "###############",
  ], inimigos: [["spinarak", 4, 3], ["spinarak", 10, 3], ["spinarak", 10, 7]], baus: { "7,4": "folha" }, bauNaLimpa: true },
  "d1,0": { nome: "O CORAÇÃO DA RAIZ", templo: true, chefe: true, mapa: [
    "###############",
    "#_____________#",
    "#_o_________o_#",
    "#_____________#",
    "#_____________#",
    "#_____________#",
    "#_____________#",
    "#_o_________o_#",
    "#_____________#",
    "######___######",
  ], inimigos: [["trevenant", 7, 3]] },
};
// confere o tamanho de cada sala (15 x 10)
for (const [k, s] of Object.entries(SALAS)) {
  if (s.mapa.length !== LINS || s.mapa.some((l) => l.length !== COLS)) console.warn("CELEBA: sala torta", k);
}

// os bichos: vida, dano de encostar, velocidade, jeito
const BICHOS = {
  sewaddle: { vida: 2, dano: 1, vel: 26, jeito: "passeia" },
  spinarak: { vida: 1, dano: 1, vel: 44, jeito: "passeia" },
  gastly: { vida: 2, dano: 1, vel: 26, jeito: "persegue", voa: true },
  phantump: { vida: 2, dano: 1, vel: 22, jeito: "persegue", voa: true },
  foongus: { vida: 3, dano: 1, vel: 0, jeito: "esporo" },
  trevenant: { vida: 16, dano: 2, vel: 22, jeito: "chefe", escala: 2 },
};

const ITENS = {
  chave: { nome: "UMA CHAVE PEQUENA", fala: "ELA ABRE UMA PORTA TRANCADA DO TEMPLO." },
  folha: { nome: "A FOLHA NAVALHA", fala: "A CELEBA APRENDEU A FOLHA NAVALHA! AGORA ELA ACERTA DE LONGE." },
  coracao: { nome: "UM CORAÇÃO EXTRA", fala: "VOCÊ AGUENTA MAIS UM CORAÇÃO!" },
};

const SOLIDO = new Set(["T", "r", "b", "w", "#", "o", "D", "g", "p", "k", "c", "C"]);
const PAREDE_TIRO = new Set(["T", "r", "b", "#", "o", "D", "g", "c", "C"]);   // a folha passa por cima da água
const SOLIDO_VOA = new Set(["T", "r", "#", "o", "D", "g", "c", "C", "k"]);      // fantasma voa por cima da água e do mato

// ------------------------------------------------------------------ desenhos
// tudo ponto a ponto: cada ladrilho é um canvas 16x16 pintado pixel por pixel
const ruido = (x, y, s = 0) => { const n = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453; return n - Math.floor(n); };
function ladrilho(fn) {
  const c = document.createElement("canvas"); c.width = T; c.height = T;
  const g = c.getContext("2d");
  const p = (x, y, cor) => { g.fillStyle = cor; g.fillRect(x, y, 1, 1); };
  for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) fn(x, y, p);
  return c;
}
const grama = (x, y, p) => {
  const r = ruido(x, y, 1);
  p(x, y, r < 0.12 ? "#3f8a3a" : r > 0.93 ? "#7cc860" : "#58a848");
};
let LADRILHOS = null;
function ladrilhos() {
  if (LADRILHOS) return LADRILHOS;
  const L = {};
  L["."] = ladrilho(grama);
  L[","] = ladrilho((x, y, p) => {
    grama(x, y, p);
    for (const [fx, fy, cor] of [[3, 4, "#f8f0f8"], [11, 3, "#f8d040"], [7, 11, "#f080b0"], [13, 12, "#f8f0f8"]]) {
      if (Math.abs(x - fx) + Math.abs(y - fy) === 1) p(x, y, cor);
      if (x === fx && y === fy) p(x, y, "#f8c030");
    }
  });
  L.T = ladrilho((x, y, p) => {
    grama(x, y, p);
    const dx = x - 7.5, dy = y - 6.5, d = Math.hypot(dx, dy * 1.1);
    if (y >= 11 && x >= 6 && x <= 9) p(x, y, x === 6 ? "#4a2c18" : "#6a4028");
    if (d < 7.5) {
      const luz = -dx * 0.5 - dy * 0.7 + ruido(x, y, 2) * 3;
      p(x, y, d > 6.6 ? "#1c3e1c" : luz > 3.5 ? "#5ab048" : luz > 0 ? "#3a8a38" : "#2a6a2c");
    }
  });
  L.r = ladrilho((x, y, p) => {
    grama(x, y, p);
    const dx = x - 7.5, dy = y - 8.5, d = Math.hypot(dx, dy * 1.25);
    if (d < 7) p(x, y, d > 6 ? "#383840" : dx + dy < -3 ? "#c8c8d0" : ruido(x, y, 3) < 0.15 ? "#70707a" : "#9898a4");
  });
  L.b = ladrilho((x, y, p) => {
    grama(x, y, p);
    const dx = x - 7.5, dy = y - 8.5, d = Math.hypot(dx, dy * 1.2);
    if (d < 6.5) p(x, y, d > 5.6 ? "#1e4a20" : (dx + dy < -2 && ruido(x, y, 4) > 0.3) ? "#88d070" : ruido(x, y, 5) < 0.2 ? "#3a7a34" : "#5aa848");
  });
  const agua = (fase) => ladrilho((x, y, p) => {
    p(x, y, "#3878d0");
    const onda = (y + fase * 2) % 8 === 0 && (x + y * 3 + fase * 4) % 7 < 3;
    if (onda) p(x, y, "#78b8f0");
    else if (ruido(x, y, 6) < 0.06) p(x, y, "#2860b0");
  });
  L.w = agua(0); L.w2 = agua(1);
  L["="] = ladrilho((x, y, p) => { p(x, y, x % 5 === 0 ? "#6a4028" : y === 0 || y === 15 ? "#4a2c18" : ruido(x, y, 7) < 0.1 ? "#a87048" : "#c08858"); });
  L.S = ladrilho((x, y, p) => {
    p(x, y, "#4a2c18");
    const dx = x - 7.5, d = Math.hypot(dx, (y - 10) * 0.9);
    if (y > 3 && (d < 6 || (y > 9 && Math.abs(dx) < 6))) p(x, y, d > 5 && y < 10 ? "#2a160c" : "#0c0604");
    if (y <= 3 || Math.abs(dx) >= 6.5) p(x, y, ruido(x, y, 8) < 0.3 ? "#6a4028" : "#4a2c18");
  });
  L._ = ladrilho((x, y, p) => {
    const borda = x === 0 || y === 0;
    p(x, y, borda ? "#6a5a48" : ruido(x, y, 9) < 0.08 ? "#8a7a62" : "#a89878");
    if ((x === 8 && y > 0) || (y === 8 && x > 0)) p(x, y, "#94846a");
  });
  L["#"] = ladrilho((x, y, p) => {
    const fila = Math.floor(y / 4), jx = (x + (fila % 2) * 4) % 8;
    p(x, y, y % 4 === 3 || jx === 7 ? "#2c2a2a" : ruido(x, y, 10) < 0.15 ? "#5a5650" : "#706a62");
    if (ruido(x, y, 11) < 0.04) p(x, y, "#4a7a3a");          // musgo
  });
  L.o = ladrilho((x, y, p) => {
    const piso = ruido(x, y, 9) < 0.08 ? "#8a7a62" : "#a89878";
    p(x, y, piso);
    if (x >= 3 && x <= 12 && y >= 1 && y <= 14) p(x, y, x === 3 || x === 12 ? "#3a3634" : y === 1 || y === 4 ? "#a0988c" : x < 7 ? "#8a847a" : "#6a645c");
    if (y >= 1 && y <= 3 && x >= 6 && x <= 9) p(x, y, "#f8a030");   // a tocha em cima
    if (y === 1 && (x === 7 || x === 8)) p(x, y, "#fff0a0");
  });
  L.D = ladrilho((x, y, p) => {
    p(x, y, x === 0 || x === 15 ? "#2c2a2a" : y % 5 === 0 ? "#4a2c18" : "#7a4a28");
    if (x >= 6 && x <= 9 && y >= 6 && y <= 9) p(x, y, "#e8c040");
    if ((x === 7 || x === 8) && (y === 7 || y === 8)) p(x, y, "#1c1008");
  });
  L.g = ladrilho((x, y, p) => { p(x, y, x % 4 === 1 ? "#40404a" : x % 4 === 2 ? "#a0a0b0" : y === 2 || y === 13 ? "#606070" : "#0c0c10"); });
  L.p = L.w;
  L.k = ladrilho((x, y, p) => {
    p(x, y, ruido(x, y, 9) < 0.08 ? "#8a7a62" : "#a89878");
    const dx = Math.abs(x - 7.5), dy = y - 7.5;
    if (dx + Math.abs(dy) * 0.6 < 5.5) p(x, y, dx + Math.abs(dy) * 0.6 > 4.5 ? "#1c3a6a" : x < 7 ? "#78c8f8" : "#3888d8");
    if (y >= 13 && dx < 5) p(x, y, "#4a4640");
  });
  L.k2 = ladrilho((x, y, p) => {
    p(x, y, ruido(x, y, 9) < 0.08 ? "#8a7a62" : "#a89878");
    const dx = Math.abs(x - 7.5), dy = y - 7.5;
    if (dx + Math.abs(dy) * 0.6 < 5.5) p(x, y, dx + Math.abs(dy) * 0.6 > 4.5 ? "#6a3a10" : x < 7 ? "#fff0a0" : "#f8b830");
    if (y >= 13 && dx < 5) p(x, y, "#4a4640");
  });
  const bau = (aberto) => ladrilho((x, y, p) => {
    p(x, y, ruido(x, y, 9) < 0.08 ? "#8a7a62" : "#a89878");
    if (x >= 2 && x <= 13 && y >= 4 && y <= 14) {
      const borda = x === 2 || x === 13 || y === 4 || y === 14;
      let cor = borda ? "#2a160c" : y === 8 ? "#e8c040" : "#a86030";
      if (aberto && y <= 7 && !borda) cor = "#1c0c06";
      if (!aberto && (x === 7 || x === 8) && y >= 8 && y <= 10) cor = "#f8e070";
      p(x, y, cor);
    }
  });
  L.c = bau(false); L.C = bau(true);
  L.E = ladrilho((x, y, p) => { p(x, y, y < 4 ? "#a89878" : y % 4 === 0 ? "#2c2a2a" : y < 8 ? "#8a7a62" : y < 12 ? "#6a5a48" : "#4a3e30"); });
  return (LADRILHOS = L);
}

// os desenhos pequenos, ponto a ponto (cada letra é uma cor)
const CORACAO = ["0110110", "1221221", "1222221", "1222221", "0122210", "0012100", "0001000"];
const CORES_CORACAO = { 1: "#401018", 2: "#e83848" };
const CORES_CORACAO_VAZIO = { 1: "#401018", 2: "#583038" };
const CHAVE = ["0110000", "1001111", "0110101"];
const FOLHA = ["00110", "01221", "12210", "1210 ", "0100 "];
const CORES_FOLHA = { 1: "#1e5a20", 2: "#7ce060" };
const FOLHA_ESCURA = { 1: "#200a30", 2: "#8a50c0" };
// a LÂMINA do AEGISLASH (a espada dele mesmo), em pé: ponta em cima, cabo embaixo
const LAMINA = [
  "00100", "01210", "01210", "01310", "01310", "01310", "01310", "01310",
  "01310", "01310", "14441", "15551", "01510", "00500",
];
const CORES_LAMINA = { 1: "#202028", 2: "#f8f8ff", 3: "#b8b8c8", 4: "#e8c040", 5: "#6a4a8a" };
// o ESCUDO dele: dourado, com a pedra no meio
const ESCUDO = [
  "0011111100", "0122222210", "1233333321", "1233443321", "1234554321",
  "1234554321", "1233443321", "0123333210", "0012332100", "0001221000", "0000110000",
];
const CORES_ESCUDO = { 1: "#202028", 2: "#f8e070", 3: "#c89828", 4: "#5a3a7a", 5: "#e8e8f8" };
// a ESPADA DE GALHO DE AMAZONIUM da CELEBA: galho com o metal verde-água brilhando
const GALHO = ["010", "121", "121", "131", "131", "131", "141", "151", "151", "010"];
const CORES_GALHO = { 1: "#103a30", 2: "#c8fff0", 3: "#40e0b0", 4: "#e8c040", 5: "#6a4028" };

function pinta(g, rows, cores, x, y) {
  rows.forEach((l, j) => [...l].forEach((ch, i) => {
    if (!cores[ch]) return;
    g.fillStyle = cores[ch];
    g.fillRect(Math.round(x + i), Math.round(y + j), 1, 1);
  }));
}
/** um desenho girado em volta do pé dele (px, py), ângulo `a` */
function pintaGirado(g, rows, cores, px, py, a, pe = rows.length) {
  g.save();
  g.translate(Math.round(px), Math.round(py)); g.rotate(a);
  pinta(g, rows, cores, -Math.floor(rows[0].length / 2), -pe);
  g.restore();
}

// onde está o bicho dentro do quadro do Mystery Dungeon (o quadro tem sobra)
const caixas = new WeakMap();
function caixa(q) {
  let c = caixas.get(q);
  if (c) return c;
  const d = q.getContext("2d").getImageData(0, 0, q.width, q.height).data;
  let x0 = q.width, x1 = -1, y1 = -1;
  for (let y = 0; y < q.height; y++) for (let x = 0; x < q.width; x++) {
    if (d[(y * q.width + x) * 4 + 3] < 20) continue;
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y > y1) y1 = y;
  }
  c = x1 < 0 ? { cx: q.width / 2, pe: q.height } : { cx: (x0 + x1 + 1) / 2, pe: y1 + 1 };
  caixas.set(q, c);
  return c;
}
function desenhaMon(g, species, dir, ms, cx, pe, escala = 1) {
  const q = Assets.monAndando({ species }, dir, ms);
  if (!q) { g.fillStyle = "#00000060"; g.fillRect(Math.round(cx - 6), Math.round(pe - 12), 12, 12); return; }
  const c = caixa(q);
  g.drawImage(q, Math.round(cx - c.cx * escala), Math.round(pe - c.pe * escala), Math.round(q.width * escala), Math.round(q.height * escala));
}
const dirDe = (vx, vy) => Math.abs(vx) > Math.abs(vy) ? (vx < 0 ? "left" : "right") : (vy < 0 ? "up" : "down");
const VET = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

// ------------------------------------------------------------------ o jogo
export class CelebaScene {
  get st() { return this.game?.state; }

  enter() {
    this.dlg = new Dialogue();
    this.t = 0;
    this.modo = "titulo";
    const f = (this.st.flags ||= {});
    this.prog = (f.celeba ||= { conheceu: false, folha: false, chefe: false, chaves: 0, porta: false, cristal: false, baus: {}, coracoes: 0 });
    this.particulas = [];
    Audio2.tone(392, 0.12, "triangle", 0.3); setTimeout(() => Audio2.tone(523, 0.12, "triangle", 0.3), 130); setTimeout(() => Audio2.tone(784, 0.25, "triangle", 0.3), 260);
  }
  exit() { this.game.autosave?.(true); }

  comecar() {
    this.modo = "jogo";
    this.vidaMax = 6 + this.prog.coracoes * 2;
    this.p = { x: 7.5 * T, y: 5.5 * T, dir: "down", vida: this.vidaMax, golpe: 0, ferido: 0, kb: null, andando: false };
    // começa no templo se já entrou nele? não: sempre na clareira (a CELEBA espera ali)
    this.entrarSala("o0,0", 7.5 * T, 6.5 * T);
    this.cel = { x: 7.5 * T, y: 3.5 * T, dir: "down", alvo: null, cd: 0, cdFolha: 0, golpe: 0 };
    if (!this.prog.conheceu) {
      this.dlg.say([
        "...UMA LUZ VERDE DESCE ENTRE AS ÁRVORES.",
        "CELEBA: AEGISLASH! VOCÊ ACORDOU! EU SOU A CELEBA, A GUARDIÃ DO TEMPO DESTE BOSQUE.",
        "CELEBA: O TREVENANT DO TEMPLO DA RAIZ ESTÁ SECANDO TUDO. O TEMPO AQUI ESTÁ PARANDO...",
        "CELEBA: EU VOU COM VOCÊ, COM A MINHA ESPADA DE GALHO DE AMAZONIUM!",
        "Z = ESPADA. SEGURA X = ESCUDO. C = SAIR (FICA SALVO). O TEMPLO FICA NO SUDESTE!",
      ], () => { this.prog.conheceu = true; });
    }
  }

  /** carrega uma sala: o mapa (com o que já foi aberto), os bichos */
  entrarSala(id, x, y) {
    const s = SALAS[id];
    this.salaId = id; this.sala = s;
    this.mapa = s.mapa.map((l) => [...l]);
    const P = this.prog;
    for (let j = 0; j < LINS; j++) for (let i = 0; i < COLS; i++) {
      const ch = this.mapa[j][i];
      if (ch === "D" && P.porta) this.mapa[j][i] = "_";
      if (ch === "g" && P.cristal) this.mapa[j][i] = "_";
      if (ch === "p" && P.cristal) this.mapa[j][i] = "=";
      if (ch === "c") {
        if (P.baus[`${id}:${i},${j}`]) this.mapa[j][i] = "C";
        else if (s.bauNaLimpa) this.mapa[j][i] = "_";
      }
    }
    this.inimigos = [];
    for (const [tipo, i, j] of s.inimigos) {
      if (tipo === "trevenant" && P.chefe) continue;
      const b = BICHOS[tipo];
      this.inimigos.push({ tipo, x: (i + 0.5) * T, y: (j + 0.8) * T, vida: b.vida, dir: "down", t: Math.random() * 2, vx: 0, vy: 0, kb: null, ferido: 0, cd: 1.5 + Math.random() });
    }
    // baú que só aparece com a sala limpa: se já está limpa (não tem bicho), aparece
    if (s.bauNaLimpa && !this.inimigos.length) this.mostrarBaus();
    this.tiros = [];
    this.coracoes = [];
    this.p.x = x; this.p.y = y;
    this.entrada = { x, y };
    this.aviso = { texto: s.nome, t: 2 };
    // a sala do chefão fecha atrás de você
    if (s.chefe && !P.chefe) {
      for (let i = 6; i <= 8; i++) this.mapa[9][i] = "g";
      this.dlg.say(["O CHÃO TREME... O TREVENANT ACORDOU!", "CELEBA: CUIDADO COM AS FOLHAS ESCURAS! LEVANTA O ESCUDO (X)!"]);
    }
  }

  mostrarBaus() {
    for (const k of Object.keys(this.sala.baus || {})) {
      const [i, j] = k.split(",").map(Number);
      if (!this.prog.baus[`${this.salaId}:${i},${j}`] && this.mapa[j][i] !== "c") {
        this.mapa[j][i] = "c";
        this.brilho((i + 0.5) * T, (j + 0.5) * T, "#f8e070", 14);
        Audio2.tone(660, 0.08, "triangle", 0.35); setTimeout(() => Audio2.tone(990, 0.15, "triangle", 0.35), 100);
      }
    }
  }

  tile(i, j) { return i < 0 || j < 0 || i >= COLS || j >= LINS ? null : this.mapa[j][i]; }
  /** a caixa (x, y = meio dos pés, meia-largura hx, meia-altura hy) bate em algo sólido? */
  bate(x, y, hx, hy, voa = false) {
    const pontos = [[x - hx, y - hy], [x + hx, y - hy], [x - hx, y + hy], [x + hx, y + hy]];
    for (const [px, py] of pontos) {
      const ch = this.tile(Math.floor(px / T), Math.floor(py / T));
      if (ch == null) continue;                          // fora da tela: deixa (é a saída)
      if ((voa ? SOLIDO_VOA : SOLIDO).has(ch)) return true;
    }
    return false;
  }
  mover(o, dx, dy, hx, hy, voa = false, prender = true) {
    if (dx && !this.bate(o.x + dx, o.y, hx, hy, voa)) o.x += dx;
    if (dy && !this.bate(o.x, o.y + dy, hx, hy, voa)) o.y += dy;
    if (prender) { o.x = Math.max(hx + 1, Math.min(W - hx - 1, o.x)); o.y = Math.max(hy + 1, Math.min(H - hy - 1, o.y)); }
  }

  brilho(x, y, cor, n = 8, vel = 50) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = vel * (0.4 + Math.random() * 0.6);
      this.particulas.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vida: 0.3 + Math.random() * 0.3, cor });
    }
  }

  update(dt) {
    this.t += dt;
    for (const q of this.particulas) { q.x += q.vx * dt; q.y += q.vy * dt; q.vida -= dt; }
    this.particulas = this.particulas.filter((q) => q.vida > 0);
    if (this.dlg.update(dt)) return;
    if (this.modo === "titulo") {
      if (Input.consume("a")) { Audio2.blip(); this.comecar(); }
      if (Input.consume("select") || Input.consume("b")) this.game.scenes.pop();
      return;
    }
    if (this.modo === "fim") {
      if (Input.consume("a") || Input.consume("select")) this.game.scenes.pop();
      return;
    }
    if (this.modo === "caiu") {
      this.caiuT -= dt;
      if (this.caiuT <= 0) {
        this.p.vida = this.vidaMax; this.p.ferido = 1.5; this.p.kb = null;
        this.entrarSala(this.salaId, this.entrada.x, this.entrada.y);
        this.cel.x = this.p.x; this.cel.y = this.p.y - 16;
        this.modo = "jogo";
      }
      return;
    }
    if (Input.consume("select")) {
      this.game.autosave?.(true);
      return void this.dlg.say("CELEBA: ATÉ LOGO, AEGISLASH! O SEU PROGRESSO FICA GUARDADO.", () => this.game.scenes.pop());
    }
    if (this.aviso) { this.aviso.t -= dt; if (this.aviso.t <= 0) this.aviso = null; }
    this.updateJogador(dt);
    this.updateCeleba(dt);
    this.updateInimigos(dt);
    this.updateTiros(dt);
    this.updateCoracoes(dt);
    this.trocarDeSala();
  }

  updateJogador(dt) {
    const p = this.p;
    p.ferido = Math.max(0, p.ferido - dt);
    p.escudo = Input.held("b") && !p.golpe;
    if (p.kb) {
      this.mover(p, p.kb.vx * dt, p.kb.vy * dt, PCX, PCY);
      p.kb.t -= dt;
      if (p.kb.t <= 0) p.kb = null;
      return;
    }
    // A ESPADA: um golpe em arco pra frente
    if (p.golpe > 0) {
      p.golpe -= dt;
      this.acertarComEspada();
      if (p.golpe <= 0) { p.golpe = 0; p.acertou = null; }
    } else if (Input.consume("a")) {
      // de frente pra um baú ou uma porta trancada: abre
      if (this.usarNaFrente()) return;
      p.golpe = GOLPE; p.acertou = new Set();
      Audio2.tone(300, 0.05, "sawtooth", 0.25); Audio2.noise(0.05, 0.2);
    }
    let vx = 0, vy = 0;
    if (Input.held("left")) vx -= 1;
    if (Input.held("right")) vx += 1;
    if (Input.held("up")) vy -= 1;
    if (Input.held("down")) vy += 1;
    p.andando = !!(vx || vy);
    // com o ESCUDO levantado ele não vira: anda de lado, sempre de frente pro perigo
    if (p.andando && !p.golpe && !p.escudo) p.dir = dirDe(vx, vy);
    const vel = (p.escudo ? ANDA_ESCUDO : ANDA) * (p.golpe ? 0.3 : 1) * (vx && vy ? 0.72 : 1);
    this.mover(p, vx * vel * dt, vy * vel * dt, PCX, PCY);
    // a entrada do TEMPLO e a saída
    const ch = this.tile(Math.floor(p.x / T), Math.floor((p.y - 2) / T));
    if (ch === "S") { Audio2.tone(200, 0.2, "triangle", 0.4); this.levarCeleba(); return this.entrarSala("d1,2", 7.5 * T, 8.2 * T); }
    if (ch === "E" && p.dir === "down") { Audio2.tone(300, 0.2, "triangle", 0.4); this.levarCeleba(); return this.entrarSala("o2,1", 7.5 * T, 4.8 * T); }
  }

  levarCeleba() { this.cel.x = this.p.x; this.cel.y = this.p.y; }

  /** Z de frente pra um baú (abre) ou uma porta trancada (gasta a chave) */
  usarNaFrente() {
    const p = this.p, [dx, dy] = VET[p.dir];
    const i = Math.floor((p.x + dx * 12) / T), j = Math.floor((p.y - 3 + dy * 12) / T);
    const ch = this.tile(i, j);
    if (ch === "c") {
      const item = this.sala.baus?.[`${i},${j}`];
      this.mapa[j][i] = "C";
      this.prog.baus[`${this.salaId}:${i},${j}`] = true;
      if (item === "chave") this.prog.chaves++;
      if (item === "folha") this.prog.folha = true;
      if (item === "coracao") { this.prog.coracoes++; this.vidaMax += 2; this.p.vida = this.vidaMax; }
      this.brilho((i + 0.5) * T, j * T, "#f8e070", 16);
      [523, 659, 784, 1046].forEach((f, k) => setTimeout(() => Audio2.tone(f, 0.12, "triangle", 0.35), k * 110));
      const it = ITENS[item] || { nome: "NADA", fala: "" };
      this.dlg.say([`VOCÊ ACHOU ${it.nome}!`, it.fala].filter(Boolean));
      this.game.autosave?.(true);
      return true;
    }
    if (ch === "D") {
      if (this.prog.chaves <= 0) { Audio2.bump(); this.dlg.say("A PORTA ESTÁ TRANCADA. PRECISA DE UMA CHAVE PEQUENA."); return true; }
      this.prog.chaves--; this.prog.porta = true;
      for (let jj = 0; jj < LINS; jj++) for (let ii = 0; ii < COLS; ii++) if (this.mapa[jj][ii] === "D") this.mapa[jj][ii] = "_";
      Audio2.tone(440, 0.1, "square", 0.3); setTimeout(() => Audio2.tone(330, 0.15, "square", 0.3), 120);
      this.dlg.say("A CHAVE GIROU... A PORTA ABRIU!");
      return true;
    }
    return false;
  }

  /** a caixa do golpe (na frente dele) e o ângulo da lâmina agora */
  golpeAgora() {
    const p = this.p, [dx, dy] = VET[p.dir], k = 1 - p.golpe / GOLPE;
    const base = { up: -Math.PI / 2, down: Math.PI / 2, left: Math.PI, right: 0 }[p.dir];
    const ang = base - 1.3 + k * 2.6;                     // varre de um lado pro outro
    const cx = p.x + dx * 13, cy = p.y - 6 + dy * 13;
    return { x: cx - 11, y: cy - 11, w: 22, h: 22, ang };
  }

  acertarComEspada() {
    const p = this.p, g = this.golpeAgora();
    for (const e of this.inimigos) {
      if (p.acertou.has(e)) continue;
      const b = this.caixaInimigo(e);
      if (g.x < b.x + b.w && g.x + g.w > b.x && g.y < b.y + b.h && g.y + g.h > b.y) {
        p.acertou.add(e);
        this.ferir(e, 1, e.x - p.x, e.y - p.y);
      }
    }
    // corta o MATO
    for (const [ox, oy] of [[g.x + 4, g.y + 4], [g.x + g.w - 4, g.y + 4], [g.x + 4, g.y + g.h - 4], [g.x + g.w - 4, g.y + g.h - 4]]) {
      const i = Math.floor(ox / T), j = Math.floor(oy / T);
      if (this.tile(i, j) === "b") {
        this.mapa[j][i] = ".";
        this.brilho((i + 0.5) * T, (j + 0.5) * T, "#5aa848", 10, 40);
        Audio2.noise(0.08, 0.3);
        if (Math.random() < 0.25) this.coracoes.push({ x: (i + 0.5) * T, y: (j + 0.6) * T, t: 0 });
      }
      // a espada também acende o cristal (se der pra encostar)
      if (this.tile(i, j) === "k") this.acenderCristal();
    }
  }

  acenderCristal() {
    if (this.prog.cristal) return;
    this.prog.cristal = true;
    for (let j = 0; j < LINS; j++) for (let i = 0; i < COLS; i++) {
      if (this.mapa[j][i] === "g") this.mapa[j][i] = "_";
      if (this.mapa[j][i] === "p") { this.mapa[j][i] = "="; this.brilho((i + 0.5) * T, (j + 0.5) * T, "#fff0a0", 4); }
    }
    [392, 523, 659, 784].forEach((f, k) => setTimeout(() => Audio2.tone(f, 0.1, "triangle", 0.35), k * 90));
    this.dlg.say(["O CRISTAL ACENDEU!", "UMA PONTE DE LUZ APARECEU, E A GRADE LÁ EM CIMA ABRIU!"]);
  }

  caixaInimigo(e) {
    const s = BICHOS[e.tipo].escala || 1;
    return { x: e.x - 7 * s, y: e.y - 14 * s, w: 14 * s, h: 14 * s };
  }

  ferir(e, dano, dx, dy) {
    if (e.ferido > 0) return;
    e.vida -= dano; e.ferido = 0.35;
    const d = Math.hypot(dx, dy) || 1, chefe = e.tipo === "trevenant";
    if (!chefe) e.kb = { vx: (dx / d) * 160, vy: (dy / d) * 160, t: 0.14 };
    Audio2.tone(chefe ? 160 : 240, 0.06, "square", 0.35);
    this.brilho(e.x, e.y - 8, "#ffffff", 6);
    if (e.vida <= 0) this.derrotar(e);
  }

  derrotar(e) {
    this.inimigos = this.inimigos.filter((o) => o !== e);
    this.brilho(e.x, e.y - 8, "#c8a0f8", e.tipo === "trevenant" ? 40 : 14, e.tipo === "trevenant" ? 90 : 60);
    Audio2.noise(0.15, 0.35);
    if (e.tipo === "trevenant") return this.venceuChefe();
    if (Math.random() < 0.3) this.coracoes.push({ x: e.x, y: e.y - 4, t: 0 });
    if (this.sala.bauNaLimpa && !this.inimigos.length) this.mostrarBaus();
  }

  venceuChefe() {
    this.prog.chefe = true;
    this.inimigos = []; this.tiros = [];
    for (let i = 6; i <= 8; i++) this.mapa[9][i] = "_";
    this.game.autosave?.(true);
    [523, 659, 784, 1046, 784, 1046].forEach((f, k) => setTimeout(() => Audio2.tone(f, 0.16, "triangle", 0.35), k * 150));
    this.dlg.say([
      "O TREVENANT CAIU! A RAIZ DO TEMPLO VOLTOU A BRILHAR.",
      "CELEBA: CONSEGUIMOS, AEGISLASH! O TEMPO DO BOSQUE VOLTOU A ANDAR!",
      "CELEBA: ...MAS EU SINTO QUE ALGUÉM MEXEU NO TEMPO DE OUTROS LUGARES TAMBÉM.",
      "CELEBA: QUANDO VOCÊ ESTIVER PRONTO, A GENTE VIAJA JUNTO PELO TEMPO!",
    ], () => { this.modo = "fim"; });
  }

  updateCeleba(dt) {
    const c = this.cel, p = this.p;
    c.cd = Math.max(0, c.cd - dt); c.cdFolha = Math.max(0, c.cdFolha - dt);
    c.golpe = Math.max(0, c.golpe - dt);
    // quem atacar: o bicho mais perto de VOCÊ (até 70) — com a FOLHA, até 120 dela
    let alvo = null, melhor = 1e9;
    for (const e of this.inimigos) {
      const d = Math.hypot(e.x - p.x, e.y - p.y);
      if (d < 70 && d < melhor) { melhor = d; alvo = e; }
    }
    // A FOLHA NAVALHA: de longe, no bicho ou no CRISTAL apagado
    if (this.prog.folha && c.cdFolha <= 0) {
      let mira = null;
      for (let j = 0; j < LINS && !this.prog.cristal; j++) for (let i = 0; i < COLS; i++) {
        if (this.mapa[j][i] === "k" && Math.hypot((i + 0.5) * T - c.x, (j + 0.5) * T - c.y) < 120) mira = { x: (i + 0.5) * T, y: (j + 0.5) * T };
      }
      if (!mira) {
        let md = 120;
        for (const e of this.inimigos) { const d = Math.hypot(e.x - c.x, e.y - 8 - c.y); if (d < md) { md = d; mira = { x: e.x, y: e.y - 8 }; } }
      }
      if (mira) {
        const dx = mira.x - c.x, dy = mira.y - (c.y - 8), d = Math.hypot(dx, dy) || 1;
        this.tiros.push({ x: c.x, y: c.y - 8, vx: (dx / d) * 150, vy: (dy / d) * 150, de: "nos", vida: 1.2, tipo: "folha", ang: 0 });
        c.cdFolha = 1.3;
        Audio2.tone(900, 0.04, "triangle", 0.2);
      }
    }
    // pra onde ela vai: atrás de você, ou até o bicho pra dar o golpe de galho
    let tx = p.x - VET[p.dir][0] * 18, ty = p.y - 14 - VET[p.dir][1] * 14;
    if (alvo) { tx = alvo.x + (c.x < alvo.x ? -12 : 12); ty = alvo.y - 6; }
    const dx = tx - c.x, dy = ty - c.y, d = Math.hypot(dx, dy);
    const vel = alvo ? 120 : Math.min(110, d * 4);
    if (d > 1) { c.x += (dx / d) * Math.min(d, vel * dt); c.y += (dy / d) * Math.min(d, vel * dt); c.dir = dirDe(dx, dy); }
    // GOLPE DA ESPADA DE GALHO DE AMAZONIUM
    if (alvo && c.cd <= 0 && Math.hypot(alvo.x - c.x, alvo.y - 6 - c.y) < 18) {
      c.golpe = 0.25; c.cd = 0.9; c.dir = alvo.x < c.x ? "left" : "right";
      this.ferir(alvo, 1, alvo.x - c.x, alvo.y - c.y);
      this.brilho(alvo.x, alvo.y - 8, "#40e0b0", 8);
      Audio2.tone(1200, 0.04, "triangle", 0.25);
    }
  }

  updateInimigos(dt) {
    const p = this.p;
    for (const e of this.inimigos) {
      const B = BICHOS[e.tipo];
      e.t += dt; e.ferido = Math.max(0, e.ferido - dt); e.cd -= dt;
      if (e.kb) {
        this.mover(e, e.kb.vx * dt, e.kb.vy * dt, 6, 4, B.voa);
        e.kb.t -= dt; if (e.kb.t <= 0) e.kb = null;
        continue;
      }
      const dx = p.x - e.x, dy = p.y - e.y, d = Math.hypot(dx, dy) || 1;
      if (B.jeito === "passeia") {
        if (e.t > (e.troca || 0)) {
          e.troca = e.t + 0.8 + Math.random() * 1.4;
          const dirs = ["up", "down", "left", "right"];
          e.dir = Math.random() < 0.3 ? dirDe(dx, dy) : dirs[Math.floor(Math.random() * 4)];
        }
        const [vx, vy] = VET[e.dir], antes = [e.x, e.y];
        this.mover(e, vx * B.vel * dt, vy * B.vel * dt, 6, 4);
        if (e.x === antes[0] && e.y === antes[1]) e.troca = 0;
      } else if (B.jeito === "persegue") {
        if (d < 110) {
          e.dir = dirDe(dx, dy);
          this.mover(e, (dx / d) * B.vel * dt, (dy / d) * B.vel * dt, 6, 4, true);
        } else e.y += Math.sin(e.t * 2) * 6 * dt;
      } else if (B.jeito === "esporo") {
        e.dir = dirDe(dx, dy);
        if (e.cd <= 0 && d < 130) {
          e.cd = 2.6;
          this.tiros.push({ x: e.x, y: e.y - 8, vx: (dx / d) * 55, vy: ((dy - 0) / d) * 55, de: "eles", vida: 2.5, tipo: "esporo", dano: 1 });
          Audio2.tone(180, 0.08, "sine", 0.25);
        }
      } else if (B.jeito === "chefe") this.updateChefe(e, dt, dx, dy, d);
      // ENCOSTOU EM VOCÊ
      const b = this.caixaInimigo(e);
      if (p.x + PCX > b.x && p.x - PCX < b.x + b.w && p.y + PCY > b.y && p.y - PCY - 6 < b.y + b.h) {
        if (this.bloqueia(e.x - p.x, e.y - p.y)) {
          // bateu no ESCUDO: o bicho é que volta
          if (e.tipo !== "trevenant") e.kb = { vx: (-(p.x - e.x) / d) * 150, vy: (-(p.y - e.y) / d) * 150, t: 0.15 };
          if (!e.tocouEscudo || e.t - e.tocouEscudo > 0.3) { Audio2.tone(700, 0.04, "square", 0.25); e.tocouEscudo = e.t; }
        } else this.machucar(B.dano, p.x - e.x, p.y - e.y);
      }
    }
  }

  updateChefe(e, dt, dx, dy, d) {
    e.dir = dirDe(dx, dy);
    if (!e.fase) e.fase = { roda: 3, chama: 6 };
    e.fase.roda -= dt; e.fase.chama -= dt;
    if (d > 20) this.mover(e, (dx / d) * BICHOS.trevenant.vel * dt, (dy / d) * BICHOS.trevenant.vel * dt, 12, 6);
    // a RODA DE FOLHAS ESCURAS: 8 pra todo lado (o escudo segura)
    if (e.fase.roda <= 0) {
      e.fase.roda = e.vida < 8 ? 2.2 : 3.2;
      const giro = Math.random() * Math.PI;
      for (let k = 0; k < 8; k++) {
        const a = giro + (k / 8) * Math.PI * 2;
        this.tiros.push({ x: e.x, y: e.y - 20, vx: Math.cos(a) * 70, vy: Math.sin(a) * 70, de: "eles", vida: 3, tipo: "escura", dano: 1, ang: a });
      }
      Audio2.tone(110, 0.2, "sawtooth", 0.3);
    }
    // chama PHANTUMP (até 3)
    if (e.fase.chama <= 0) {
      e.fase.chama = 8;
      const n = this.inimigos.filter((o) => o.tipo === "phantump").length;
      for (let k = n; k < Math.min(3, n + 2); k++) {
        const x = (k % 2 ? 3 : 11.5) * T, y = 2.5 * T;
        this.inimigos.push({ tipo: "phantump", x, y, vida: 1, dir: "down", t: 0, kb: null, ferido: 0, cd: 2 });
        this.brilho(x, y - 8, "#8a50c0", 10);
      }
    }
  }

  /** o ESCUDO está levantado e a coisa vem pela frente dele? */
  bloqueia(dx, dy) {
    const p = this.p;
    if (!p.escudo) return false;
    const [fx, fy] = VET[p.dir], d = Math.hypot(dx, dy) || 1;
    return (dx * fx + dy * fy) / d > 0.35;
  }

  machucar(dano, dx, dy) {
    const p = this.p;
    if (p.ferido > 0) return;
    p.vida -= dano; p.ferido = 1;
    const d = Math.hypot(dx, dy) || 1;
    p.kb = { vx: (dx / d) * 150, vy: (dy / d) * 150, t: 0.16 };
    Audio2.tone(140, 0.12, "square", 0.45);
    if (p.vida <= 0) {
      p.vida = 0;
      this.modo = "caiu"; this.caiuT = 2;
      Audio2.tone(220, 0.2, "triangle", 0.4); setTimeout(() => Audio2.tone(165, 0.3, "triangle", 0.4), 200); setTimeout(() => Audio2.tone(110, 0.5, "triangle", 0.4), 450);
    }
  }

  updateTiros(dt) {
    const p = this.p;
    for (const s of this.tiros) {
      s.x += s.vx * dt; s.y += s.vy * dt; s.vida -= dt; s.ang = (s.ang || 0) + dt * 12;
      const ch = this.tile(Math.floor(s.x / T), Math.floor(s.y / T));
      if (ch == null || s.x < 0 || s.y < 0 || s.x > W || s.y > H) { s.vida = 0; continue; }
      if (s.de === "nos") {
        if (ch === "k") { s.vida = 0; this.acenderCristal(); continue; }
        if (PAREDE_TIRO.has(ch)) { s.vida = 0; this.brilho(s.x, s.y, "#7ce060", 3); continue; }
        for (const e of this.inimigos) {
          const b = this.caixaInimigo(e);
          if (s.x > b.x && s.x < b.x + b.w && s.y > b.y && s.y < b.y + b.h) { s.vida = 0; this.ferir(e, 1, s.vx, s.vy); break; }
        }
      } else {
        if (PAREDE_TIRO.has(ch) && ch !== "o") { s.vida = 0; continue; }
        if (Math.abs(s.x - p.x) < 7 && s.y > p.y - 16 && s.y < p.y + 4) {
          s.vida = 0;
          if (this.bloqueia(s.x - p.x, s.y - p.y + 6)) { Audio2.tone(800, 0.04, "square", 0.3); this.brilho(s.x, s.y, "#f8e070", 5); }
          else this.machucar(s.dano || 1, s.vx, s.vy);
        }
      }
    }
    this.tiros = this.tiros.filter((s) => s.vida > 0);
  }

  updateCoracoes(dt) {
    const p = this.p;
    for (const c of this.coracoes) {
      c.t += dt;
      if (Math.abs(c.x - p.x) < 10 && Math.abs(c.y - p.y) < 10) {
        c.pego = true; p.vida = Math.min(this.vidaMax, p.vida + 2);
        Audio2.tone(988, 0.05, "triangle", 0.3); setTimeout(() => Audio2.tone(1318, 0.08, "triangle", 0.3), 60);
      }
    }
    this.coracoes = this.coracoes.filter((c) => !c.pego && c.t < 8);
  }

  /** saiu pela beirada da tela: a sala do lado */
  trocarDeSala() {
    const p = this.p, [pre, xy] = [this.salaId[0], this.salaId.slice(1).split(",").map(Number)];
    let [sx, sy] = xy, nx = p.x, ny = p.y;
    if (p.x <= PCX + 1 && Input.held("left")) { sx--; nx = W - PCX - 3; }
    else if (p.x >= W - PCX - 1 && Input.held("right")) { sx++; nx = PCX + 3; }
    else if (p.y <= PCY + 1 && Input.held("up")) { sy--; ny = H - PCY - 3; }
    else if (p.y >= H - PCY - 1 && Input.held("down")) { sy++; ny = PCY + 8; }
    else return;
    const id = `${pre}${sx},${sy}`;
    if (!SALAS[id]) return;
    this.entrarSala(id, nx, ny);
    this.cel.x = nx - VET[p.dir][0] * 16; this.cel.y = ny - 14;
  }

  // ------------------------------------------------------------------ tela
  render(g) {
    g.imageSmoothingEnabled = false;
    if (this.modo === "titulo") return this.renderTitulo(g);
    if (this.modo === "fim") return this.renderFim(g);
    const L = ladrilhos(), ms = performance.now();
    for (let j = 0; j < LINS; j++) for (let i = 0; i < COLS; i++) {
      let ch = this.mapa[j][i];
      if (ch === "w" || ch === "p") ch = Math.floor(this.t * 1.5 + i * 0.3) % 2 ? "w2" : "w";
      if (ch === "k" && this.prog.cristal) ch = "k2";
      const img = L[ch] || (this.sala.templo ? L._ : L["."]);
      g.drawImage(img, i * T, j * T);
    }
    // corações no chão
    for (const c of this.coracoes) if (c.t < 6 || Math.floor(c.t * 8) % 2) pinta(g, CORACAO, CORES_CORACAO, c.x - 3, c.y - 6 - Math.abs(Math.sin(c.t * 4)) * 2);
    // todos em ordem de altura (quem está mais embaixo, na frente)
    const coisas = [
      ...this.inimigos.map((e) => ({ y: e.y, f: () => this.desenhaInimigo(g, e, ms) })),
      { y: this.p.y, f: () => this.desenhaJogador(g, ms) },
      { y: this.cel.y + 14, f: () => this.desenhaCeleba(g, ms) },
    ].sort((a, b) => a.y - b.y);
    for (const c of coisas) c.f();
    for (const s of this.tiros) {
      if (s.tipo === "esporo") { g.fillStyle = "#c070d0"; g.fillRect(Math.round(s.x - 2), Math.round(s.y - 2), 4, 4); g.fillStyle = "#f0c0f8"; g.fillRect(Math.round(s.x - 1), Math.round(s.y - 2), 1, 1); }
      else pintaGirado(g, FOLHA, s.tipo === "escura" ? FOLHA_ESCURA : CORES_FOLHA, s.x, s.y + 2, s.ang || 0, 3);
    }
    for (const q of this.particulas) { g.fillStyle = q.cor; g.fillRect(Math.round(q.x), Math.round(q.y), 1, 1); }
    this.renderHud(g);
    if (this.modo === "caiu") {
      g.fillStyle = `rgba(0,0,0,${Math.min(0.75, (2 - this.caiuT) * 0.6)})`; g.fillRect(0, 0, W, H);
      const s = "O AEGISLASH CAIU...";
      drawText(g, s, (W - s.length * 6) / 2, 70, "#ffffff");
    }
    this.dlg.render(g);
  }

  desenhaJogador(g, ms) {
    const p = this.p;
    if (p.ferido > 0 && Math.floor(p.ferido * 16) % 2) return;
    const atras = p.dir === "up";
    if (p.golpe && atras) this.desenhaLamina(g);
    desenhaMon(g, "aegislash", p.dir, p.andando ? ms : 0, p.x, p.y + 2);
    if (p.golpe && !atras) this.desenhaLamina(g);
    if (p.escudo) {
      // o ESCUDO levantado na frente
      const [dx, dy] = VET[p.dir];
      if (p.dir !== "up") pinta(g, ESCUDO, CORES_ESCUDO, p.x + dx * 9 - 5, p.y - 14 + dy * 6, false);
      else { g.fillStyle = "#f8e07080"; g.fillRect(Math.round(p.x - 6), Math.round(p.y - 22), 12, 2); }
    }
  }
  desenhaLamina(g) {
    const p = this.p, ga = this.golpeAgora();
    pintaGirado(g, LAMINA, CORES_LAMINA, p.x, p.y - 10, ga.ang + Math.PI / 2, 2);
    // o rastro brilhante da lâmina
    g.fillStyle = "#ffffff90";
    for (let k = 1; k <= 3; k++) {
      const a = ga.ang - k * 0.25, r = 16;
      g.fillRect(Math.round(p.x + Math.cos(a) * r), Math.round(p.y - 10 + Math.sin(a) * r), 2, 2);
    }
  }

  desenhaCeleba(g, ms) {
    const c = this.cel, voo = Math.sin(this.t * 3) * 2;
    // a sombra no chão
    g.fillStyle = "#00000040"; g.fillRect(Math.round(c.x - 5), Math.round(c.y + 12), 10, 2);
    desenhaMon(g, "celebi", c.dir, ms, c.x, c.y + 8 + voo);
    // a ESPADA DE GALHO DE AMAZONIUM: na mão dela, e girando quando ela ataca
    const lado = c.dir === "left" ? -1 : 1;
    const a = c.golpe > 0 ? lado * (-1.4 + (1 - c.golpe / 0.25) * 2.8) : lado * 0.5;
    pintaGirado(g, GALHO, CORES_GALHO, c.x + lado * 7, c.y + 2 + voo, a, 9);
    if (Math.floor(this.t * 6) % 3 === 0) { g.fillStyle = "#c8fff0"; g.fillRect(Math.round(c.x + lado * 7 + Math.sin(a) * 7), Math.round(c.y - 5 + voo), 1, 1); }
  }

  desenhaInimigo(g, e, ms) {
    const B = BICHOS[e.tipo];
    if (e.ferido > 0 && Math.floor(e.ferido * 20) % 2) return;
    if (e.tipo === "gastly" && Math.floor(this.t * 5 + e.x) % 7 === 0) g.globalAlpha = 0.5;
    const voo = B.voa ? Math.sin(e.t * 3) * 2 - 2 : 0;
    desenhaMon(g, e.tipo, e.dir, ms, e.x, e.y + voo, B.escala || 1);
    g.globalAlpha = 1;
  }

  renderHud(g) {
    // corações
    const n = this.vidaMax / 2;
    for (let k = 0; k < n; k++) {
      const x = 4 + k * 9, y = 3, v = this.p.vida - k * 2;
      pinta(g, CORACAO, CORES_CORACAO_VAZIO, x, y);
      if (v >= 2) pinta(g, CORACAO, CORES_CORACAO, x, y);
      else if (v === 1) pinta(g, CORACAO.map((l) => l.slice(0, 4)), CORES_CORACAO, x, y);
    }
    // chaves e a folha
    let x = W - 8;
    if (this.prog.folha) { x -= 8; pinta(g, FOLHA, CORES_FOLHA, x, 4); }
    if (this.prog.chaves) {
      x -= 18;
      pinta(g, CHAVE, { 1: "#f8e070" }, x, 6);
      drawText(g, `${this.prog.chaves}`, x + 9, 3, "#ffffff");
    }
    // a vida do chefão
    const chefe = this.inimigos.find((e) => e.tipo === "trevenant");
    if (chefe) {
      g.fillStyle = "#000000a0"; g.fillRect(60, H - 9, 120, 6);
      g.fillStyle = "#8a50c0"; g.fillRect(61, H - 8, Math.round(118 * chefe.vida / BICHOS.trevenant.vida), 4);
    }
    if (this.aviso) {
      const s = this.aviso.texto, a = Math.min(1, this.aviso.t);
      g.globalAlpha = a;
      g.fillStyle = "#00000090"; g.fillRect((W - s.length * 6) / 2 - 4, 18, s.length * 6 + 8, 12);
      drawText(g, s, (W - s.length * 6) / 2, 20, "#f8f0c0");
      g.globalAlpha = 1;
    }
  }

  renderTitulo(g) {
    const L = ladrilhos();
    for (let j = 0; j < LINS; j++) for (let i = 0; i < COLS; i++) g.drawImage(L[(i + j) % 5 === 0 || j === 0 || j === 9 ? "T" : (i * 7 + j * 3) % 4 ? "." : ","], i * T, j * T);
    g.fillStyle = "#00000080"; g.fillRect(0, 0, W, H);
    // o título grande: escrito pequeno e esticado 2x
    const c = this._titulo ||= (() => {
      const cv = document.createElement("canvas"); cv.width = 120; cv.height = 20;
      const x = cv.getContext("2d");
      drawText(x, "THE LEGENDS", 27, 0, "#f8e070");
      drawText(x, "OF CELEBI", 33, 10, "#7ce060");
      return cv;
    })();
    g.drawImage(c, 0, 0, 120, 20, 0, 22, 240, 40);
    const ms = performance.now(), voo = Math.sin(this.t * 3) * 3;
    desenhaMon(g, "aegislash", "down", ms, 96, 112);
    desenhaMon(g, "celebi", "down", ms, 144, 104 + voo);
    pintaGirado(g, GALHO, CORES_GALHO, 152, 100 + voo, 0.5, 9);
    if (Math.floor(this.t * 2) % 2) { const s = "APERTE Z"; drawText(g, s, (W - s.length * 6) / 2, 128, "#ffffff"); }
    const s2 = "C: VOLTAR";
    drawText(g, s2, 4, H - 10, "#a0a0b0");
    this.dlg.render(g);
  }

  renderFim(g) {
    g.fillStyle = "#0c1a10"; g.fillRect(0, 0, W, H);
    const ms = performance.now(), voo = Math.sin(this.t * 3) * 3;
    desenhaMon(g, "aegislash", "down", ms, 100, 96);
    desenhaMon(g, "celebi", "down", ms, 140, 88 + voo);
    for (let k = 0; k < 12; k++) { g.fillStyle = k % 2 ? "#7ce060" : "#f8e070"; g.fillRect(Math.round(120 + Math.cos(this.t + k) * 60), Math.round(80 + Math.sin(this.t * 1.3 + k) * 40), 1, 1); }
    const l = ["FIM DO CAPÍTULO 1", "O TEMPLO DA RAIZ", "", "APERTE Z"];
    l.forEach((s, k) => drawText(g, s, (W - s.length * 6) / 2, 20 + k * 12, k === 0 ? "#f8e070" : "#ffffff"));
  }
}
