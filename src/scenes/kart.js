// SUPER PAWMOT KART (ideia do CAIO, 08/nov/2026): o 3º jogo do NINTENDO
// SWITCH do quarto. Corrida de kart com a câmera atrás, o chão desenhado em
// perspectiva (cada linha da tela é uma fatia do chão, mais longe em cima).
// Os corredores são os bichos do SUPER PAWMOT (src/scenes/superpawmot.js),
// com os SPRITES DE ANDAR deles sentados num kart.
//   ← →  vira        Z  acelera        ↓  freia / ré
//   SHIFT (segurando, virando): DERRAPA — solta e ganha TURBO (azul, depois laranja)
//   X    usa o item  C  sai
// ITENS (caixas "?" na pista): BAGA = turbo, POKÉBOLA = tiro reto pra frente,
// COGUMELO = nuvem de esporo deixada atrás (quem passa roda e freia),
// ESTRELA = invencível e mais rápido. Caiu na água / lava: o VOLBEAT te traz
// de volta. 3 voltas; o melhor tempo de cada pista fica em st.flags.kart.
// ?kart=1 abre direto.
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { drawText } from "../core/gfx.js";
import { Assets } from "../core/assets.js";
import { Dialogue } from "../systems/dialogue.js";

const W = 240, H = 160;
const HZ = 58;                 // a linha do horizonte
const FOCO = 120;              // a lente da câmera
const CAM_ALT = 22;            // altura da câmera
const CAM_ATRAS = 34;          // distância da câmera atrás do kart
const MUNDO = 1024;            // o tamanho do mapa de cada pista
const VOLTAS = 3;
const LARG = 64;               // largura da pista

// os corredores: velocidade, aceleração, curva (o jogador escolhe um)
const CORREDORES = [
  { id: "pawmot", nome: "PAWMOT", vel: 1.0, ac: 1.0, curva: 1.0, cor: "#f0a030" },
  { id: "shroomish", nome: "SHROOMISH", vel: 0.94, ac: 1.15, curva: 1.08, cor: "#88c070" },
  { id: "tinkatuff", nome: "TINKATUFF", vel: 0.98, ac: 1.05, curva: 1.05, cor: "#e888b8" },
  { id: "cacnea", nome: "CACNEA", vel: 0.96, ac: 1.1, curva: 1.0, cor: "#58a848" },
  { id: "octillery", nome: "OCTILLERY", vel: 1.02, ac: 0.95, curva: 0.95, cor: "#e05838" },
  { id: "lickitung", nome: "LICKITUNG", vel: 1.04, ac: 0.9, curva: 0.92, cor: "#f0a0b0" },
  { id: "gible", nome: "GIBLE", vel: 0.97, ac: 1.12, curva: 1.12, cor: "#5878b8" },
  { id: "garchomp", nome: "GARCHOMP", vel: 1.08, ac: 0.85, curva: 0.88, cor: "#3a4a88" },
];

// as PISTAS: pontos do traçado (em volta, no sentido da corrida), o chão de
// fora, os buracos (água/lava, círculos) e onde ficam as caixas de item
const PISTAS = [
  {
    nome: "FLORESTA DO PAWMOT", fora: "#3f8a3a", fora2: "#58a848", estrada: "#8a8478", borda: ["#e03030", "#f8f8f8"],
    ceu: ["#68a8f0", "#b8e0f8"], montanha: "#2e6a3a",
    pontos: [[512, 900], [800, 880], [920, 760], [900, 560], [760, 470], [800, 300], [700, 140], [480, 120], [300, 200], [330, 380], [200, 480], [120, 650], [200, 840]],
    buracos: [], arvores: true, agua: "#3878d0",
  },
  {
    nome: "PRAIA DO LAGO", fora: "#e8d090", fora2: "#d8c080", estrada: "#9a9284", borda: ["#3070e0", "#f8f8f8"],
    ceu: ["#58b8f8", "#d8f0f8"], montanha: "#4a8ac8",
    pontos: [[512, 920], [780, 900], [900, 780], [850, 620], [640, 560], [620, 400], [860, 300], [820, 130], [560, 90], [340, 150], [380, 330], [180, 420], [110, 640], [230, 860]],
    buracos: [[512, 720, 110], [690, 220, 70], [200, 250, 90]], agua: "#3878d0",
  },
  {
    nome: "VULCÃO DO GARCHOMP", fora: "#4a3030", fora2: "#5a3838", estrada: "#6a6060", borda: ["#f8a030", "#202020"],
    ceu: ["#401818", "#a04020"], montanha: "#200c0c",
    pontos: [[512, 930], [760, 920], [930, 800], [880, 600], [700, 640], [560, 500], [720, 330], [900, 240], [780, 90], [500, 110], [380, 280], [240, 160], [100, 340], [150, 600], [300, 700], [200, 880]],
    buracos: [[640, 780, 80], [560, 280, 60], [250, 450, 70], [850, 450, 50]], agua: "#f06020", lava: true,
  },
];

// os ícones dos itens de verdade (assets/sprites/itens)
const ITENS = { baga: "oran-berry", bola: "poke-bola", cogumelo: "cogumelo", estrela: "estrela" };
const NOME_ITEM = { baga: "BAGA TURBO", bola: "POKÉBOLA", cogumelo: "COGUMELO", estrela: "ESTRELA" };
const ICONES = {};
for (const [k, f] of Object.entries(ITENS)) { const i = new Image(); i.src = `assets/sprites/itens/${f}.png`; ICONES[k] = i; }

// o KART visto de trás, ponto a ponto (K = cor do corredor)
const KART = [
  "....kkkkkkkkkkkk....",
  "...kKKKKKKKKKKKKk...",
  "..kKKKkkkkkkkkKKKk..",
  ".kKKKk........kKKKk.",
  "kkkkkkkkkkkkkkkkkkkk",
  "kWWkKKKKKKKKKKKKkWWk",
  "kWWkKKKyyKKyyKKKkWWk",
  "kWWkKKKKKKKKKKKKkWWk",
  "kkkkkkkkkkkkkkkkkkkk",
  ".kkk............kkk.",
];
const CAIXA = [
  "kkkkkkkkkk", "kyyyyyyyyk", "kyyykkyyyk", "kyykyykyyk", "kyyyyykyyk",
  "kyyyykyyyk", "kyyyykyyyk", "kyyyyyyyyk", "kyyyykyyyk", "kkkkkkkkkk",
];

function pinta(g, rows, cores, x, y, esc = 1) {
  rows.forEach((l, j) => [...l].forEach((ch, i) => {
    if (!cores[ch]) return;
    g.fillStyle = cores[ch];
    g.fillRect(Math.round(x + i * esc), Math.round(y + j * esc), Math.ceil(esc), Math.ceil(esc));
  }));
}
const ruido = (x, y, s = 0) => { const n = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453; return n - Math.floor(n); };

// ------------------------------------------------------------------ a pista
/** o traçado liso (Catmull-Rom fechado) com `n` pontos por trecho */
function tracado(pts, n = 24) {
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    const p0 = pts[(i - 1 + pts.length) % pts.length], p1 = pts[i], p2 = pts[(i + 1) % pts.length], p3 = pts[(i + 2) % pts.length];
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  return out;
}

/** monta a pista: a textura do chão (cores) e o MAPA DE CHÃO (0 fora, 1 pista, 2 buraco, 3 turbo) */
function montarPista(P) {
  const caminho = tracado(P.pontos);
  const tex = document.createElement("canvas"); tex.width = tex.height = MUNDO;
  const g = tex.getContext("2d");
  // o chão de fora, com manchas
  g.fillStyle = P.fora; g.fillRect(0, 0, MUNDO, MUNDO);
  for (let k = 0; k < 2500; k++) {
    g.fillStyle = ruido(k, 1) < 0.5 ? P.fora2 : P.fora;
    g.fillRect(Math.floor(ruido(k, 2) * MUNDO), Math.floor(ruido(k, 3) * MUNDO), 3 + Math.floor(ruido(k, 4) * 6), 2 + Math.floor(ruido(k, 5) * 4));
  }
  const linha = (larg, cor, dash) => {
    g.lineJoin = "round"; g.lineCap = "round"; g.lineWidth = larg; g.strokeStyle = cor;
    g.setLineDash(dash || []);
    g.beginPath(); caminho.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.stroke();
    g.setLineDash([]);
  };
  // água / lava
  for (const [x, y, r] of P.buracos) {
    g.fillStyle = P.agua; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    g.strokeStyle = P.lava ? "#f8d040" : "#78b8f0"; g.lineWidth = 3; g.beginPath(); g.arc(x, y, r - 6, 0.3, 2.4); g.stroke();
  }
  linha(LARG + 10, P.borda[0]);
  linha(LARG + 10, P.borda[1], [10, 10]);
  linha(LARG, P.estrada);
  // a faixa do meio, tracejada
  g.globalAlpha = 0.35; linha(2, "#ffffff", [8, 14]); g.globalAlpha = 1;
  // a linha de chegada (quadriculada) no ponto 0
  const [ax, ay] = caminho[0], [bx, by] = caminho[1];
  const ang = Math.atan2(by - ay, bx - ax);
  g.save(); g.translate(ax, ay); g.rotate(ang);
  for (let i = 0; i < 4; i++) for (let j = -LARG / 2; j < LARG / 2; j += 4) { g.fillStyle = (i + j / 4) % 2 ? "#f8f8f8" : "#181818"; g.fillRect(i * 4 - 8, j, 4, 4); }
  g.restore();
  // as placas de TURBO (setas amarelas) em 3 lugares
  const turbos = [0.3, 0.62, 0.85].map((f) => Math.floor(caminho.length * f));
  for (const i of turbos) {
    const [x, y] = caminho[i], [x2, y2] = caminho[(i + 1) % caminho.length];
    g.save(); g.translate(x, y); g.rotate(Math.atan2(y2 - y, x2 - x));
    g.fillStyle = "#f8d040"; g.fillRect(-10, -10, 20, 20);
    g.fillStyle = "#e86020";
    for (const k of [-6, 2]) { g.beginPath(); g.moveTo(k, -7); g.lineTo(k + 6, 0); g.lineTo(k, 7); g.lineTo(k + 2, 0); g.fill(); }
    g.restore();
  }
  // o MAPA DE CHÃO: o mesmo desenho, só que em códigos
  const m = document.createElement("canvas"); m.width = m.height = MUNDO;
  const h = m.getContext("2d");
  h.fillStyle = "#000"; h.fillRect(0, 0, MUNDO, MUNDO);
  h.fillStyle = "#f00";
  for (const [x, y, r] of P.buracos) { h.beginPath(); h.arc(x, y, r - 4, 0, Math.PI * 2); h.fill(); }
  h.lineJoin = "round"; h.lineWidth = LARG + 10; h.strokeStyle = "#fff";
  h.beginPath(); caminho.forEach(([x, y], i) => (i ? h.lineTo(x, y) : h.moveTo(x, y))); h.closePath(); h.stroke();
  for (const i of turbos) {
    const [x, y] = caminho[i], [x2, y2] = caminho[(i + 1) % caminho.length];
    h.save(); h.translate(x, y); h.rotate(Math.atan2(y2 - y, x2 - x)); h.fillStyle = "#0f0"; h.fillRect(-10, -10, 20, 20); h.restore();
  }
  const md = h.getImageData(0, 0, MUNDO, MUNDO).data, chao = new Uint8Array(MUNDO * MUNDO);
  for (let i = 0; i < chao.length; i++) chao[i] = md[i * 4 + 1] > 128 ? (md[i * 4] > 128 ? 1 : 3) : md[i * 4] > 128 ? 2 : 0;
  // as cores da textura, em números (pra pintar o chão rápido)
  const cores = new Uint32Array(g.getImageData(0, 0, MUNDO, MUNDO).data.buffer.slice(0));
  const foraCor = cores[0];
  // as CAIXAS de item: fileiras de 4 atravessando a pista
  const caixas = [];
  for (const f of [0.15, 0.45, 0.72]) {
    const i = Math.floor(caminho.length * f), [x, y] = caminho[i], [x2, y2] = caminho[(i + 1) % caminho.length];
    const a = Math.atan2(y2 - y, x2 - x), nx = -Math.sin(a), ny = Math.cos(a);
    for (const k of [-1.5, -0.5, 0.5, 1.5]) caixas.push({ x: x + nx * k * 13, y: y + ny * k * 13, volta: 0 });
  }
  // árvores / pedras em volta (enfeite), fora da pista
  const enfeites = [];
  for (let k = 0; k < 140; k++) {
    const x = ruido(k, 7) * MUNDO, y = ruido(k, 8) * MUNDO;
    if (chao[Math.floor(y) * MUNDO + Math.floor(x)] !== 0) continue;
    let longe = true;
    for (let i = 0; i < caminho.length; i += 4) if (Math.hypot(caminho[i][0] - x, caminho[i][1] - y) < LARG) { longe = false; break; }
    if (longe) enfeites.push({ x, y, tipo: P.lava ? "pedra" : P.arvores ? "arvore" : "palmeira" });
  }
  return { P, caminho, cores, foraCor, chao, caixas, enfeites };
}

// os enfeites, ponto a ponto
const ARVORE = [
  "....gggg....", "..gGGGGGGg..", ".gGGgGGGGGg.", "gGGGGGGgGGGg", "gGgGGGGGGGGg", "gGGGGGgGGGGg",
  ".gGGGGGGGGg.", "..gggGGggg..", ".....bb.....", ".....bb.....", ".....bb.....", "....bbbb....",
];
const PALMEIRA = [
  "..gg....gg..", ".gGGg..gGGg.", "gG..gGGg..Gg", "....gGGg....", "...gG..Gg...", ".....bb.....",
  "......bb....", "......bb....", ".....bb.....", ".....bb.....", "....bb......", "...bbbb.....",
];
const PEDRA = [
  "....kkkk....", "..kkRRRRkk..", ".kRRRrRRRRk.", "kRRrRRRRRrRk", "kRRRRRRRRRRk", "kRrRRRRrRRRk",
  ".kRRRRRRRRk.", "..kkkkkkkk..",
];
const CORES_ENF = { g: "#1e4a20", G: "#3a8a38", b: "#6a4028", k: "#201010", R: "#5a4040", r: "#f08030" };

// ------------------------------------------------------------------ o jogo
export class KartScene {
  get st() { return this.game?.state; }

  enter() {
    this.dlg = new Dialogue();
    this.t = 0;
    this.modo = "menu"; this.passo = "corredor";
    this.escolha = 0; this.escolhaPista = 0;
    this.f = ((this.st.flags ||= {}).kart ||= { recordes: {} });
    this.tela = document.createElement("canvas"); this.tela.width = W; this.tela.height = H - HZ;
    this.telaG = this.tela.getContext("2d");
    this.telaImg = this.telaG.createImageData(W, H - HZ);
    this.tela32 = new Uint32Array(this.telaImg.data.buffer);
    this.dlg.say(["VOCÊ LIGOU O NINTENDO SWITCH...", "SUPER PAWMOT KART! ESCOLHE O CORREDOR COM ← → E APERTA Z."]);
  }
  exit() { this.game.autosave?.(true); }

  // ---------------------------------------------------------------- corrida
  comecar() {
    const pista = (this.pista = montarPista(PISTAS[this.escolhaPista]));
    const c = pista.caminho, [x0, y0] = c[0], [x1, y1] = c[3];
    const ang = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(ang), ny = Math.cos(ang);
    // o grid de largada: 2 por fila, você por último (como nos jogos de kart)
    const ordem = [...CORREDORES.filter((r, i) => i !== this.escolha), CORREDORES[this.escolha]];
    this.karts = ordem.map((r, i) => {
      const fila = Math.floor(i / 2) + 1, lado = i % 2 ? 1 : -1;
      return {
        r, eu: r === CORREDORES[this.escolha],
        x: x0 - Math.cos(ang) * fila * 22 + nx * lado * 14, y: y0 - Math.sin(ang) * fila * 22 + ny * lado * 14,
        ang, vel: 0, idx: c.length - fila * 2, volta: 0, prog: 0, item: null, rodando: 0, turbo: 0, estrela: 0,
        deriva: 0, carga: 0, caiu: 0, lado: (Math.random() - 0.5) * 24, mente: Math.random() * 10, chegou: null,
        habil: 0.86 + Math.random() * 0.1, cdItem: 3 + Math.random() * 6,
      };
    });
    this.eu = this.karts.find((k) => k.eu);
    this.tiros = []; this.nuvens = []; this.faiscas = [];
    this.relogio = 0; this.largada = 3.99; this.modo = "corrida"; this.fim = null;
    this.camAng = ang;
    Audio2.tone(440, 0.15, "square", 0.3);
  }

  update(dt) {
    this.t += dt;
    if (this.dlg.update(dt)) return;
    if (this.modo === "menu") return this.updateMenu();
    if (this.modo === "resultado") {
      if (Input.consume("a") || Input.consume("select")) { this.modo = "menu"; this.passo = "pista"; }
      return;
    }
    if (Input.consume("select")) { this.modo = "menu"; this.passo = "pista"; return; }
    dt = Math.min(dt, 1 / 30);
    if (this.largada > 0) {
      const antes = Math.ceil(this.largada);
      this.largada -= dt;
      const agora = Math.ceil(this.largada);
      if (agora !== antes) Audio2.tone(agora > 0 ? 440 : 880, agora > 0 ? 0.15 : 0.35, "square", 0.35);
      // segurar Z na hora certa da largada: turbo de largada!
      if (this.largada <= 0 && Input.held("a") && this.segurouLargada > 0.4 && this.segurouLargada < 1.2) this.eu.turbo = 1;
      if (Input.held("a")) this.segurouLargada = (this.segurouLargada || 0) + dt; else this.segurouLargada = 0;
      return;
    }
    this.relogio += dt;
    for (const k of this.karts) this.updateKart(k, dt);
    this.batidas();
    this.updateTiros(dt);
    this.updateCaixas(dt);
    for (const f of this.faiscas) { f.x += f.vx * dt; f.y += f.vy * dt; f.vida -= dt; }
    this.faiscas = this.faiscas.filter((f) => f.vida > 0);
    // a câmera vira atrás do kart, um pouco atrasada (fica gostoso nas curvas)
    let d = this.eu.ang - this.camAng;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    this.camAng += d * Math.min(1, dt * 7);
    // todo mundo chegou (ou você e mais uns segundos)
    if (this.eu.chegou != null && (this.karts.every((k) => k.chegou != null) || this.relogio - this.eu.chegou > 6)) this.terminar();
  }

  chao(x, y) {
    const i = Math.floor(x), j = Math.floor(y);
    if (i < 0 || j < 0 || i >= MUNDO || j >= MUNDO) return 0;
    return this.pista.chao[j * MUNDO + i];
  }

  updateKart(k, dt) {
    const eu = k.eu, R = k.r, c = this.pista.caminho, N = c.length;
    k.turbo = Math.max(0, k.turbo - dt); k.estrela = Math.max(0, k.estrela - dt); k.rodando = Math.max(0, k.rodando - dt);
    // caiu no buraco: o VOLBEAT traz de volta
    if (k.caiu > 0) {
      k.caiu -= dt;
      if (k.caiu <= 0) {
        const [x, y] = c[k.idx], [x2, y2] = c[(k.idx + 3) % N];
        k.x = x; k.y = y; k.ang = Math.atan2(y2 - y, x2 - x); k.vel = 0;
      }
      return;
    }
    let vira = 0, acel = 0, freia = false, deriva = false;
    if (k.chegou != null && eu) { acel = 0.4; }
    else if (eu) {
      vira = (Input.held("right") ? 1 : 0) - (Input.held("left") ? 1 : 0);
      acel = Input.held("a") ? 1 : 0;
      freia = Input.held("down");
      deriva = Input.held("run") && vira !== 0 && k.vel > 60;
      if (Input.consume("b")) this.usarItem(k);
    } else {
      // O PILOTO DO COMPUTADOR: mira num ponto mais pra frente do traçado
      const alvo = c[(k.idx + 10) % N], a2 = c[(k.idx + 11) % N];
      const an = Math.atan2(a2[1] - alvo[1], a2[0] - alvo[0]);
      const ox = alvo[0] - Math.sin(an) * k.lado, oy = alvo[1] + Math.cos(an) * k.lado;
      let d = Math.atan2(oy - k.y, ox - k.x) - k.ang;
      while (d > Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      vira = Math.max(-1, Math.min(1, d * 3));
      acel = 1;
      k.mente += dt;
      if (k.mente > 4) { k.mente = 0; k.lado = (Math.random() - 0.5) * 28; }
      k.cdItem -= dt;
      if (k.item && k.cdItem <= 0) { this.usarItem(k); k.cdItem = 2 + Math.random() * 5; }
    }
    const tipo = this.chao(k.x, k.y);
    let max = 150 * R.vel * (eu ? 1 : k.habil * this.elastico(k));
    if (tipo === 0 && !k.estrela) max *= 0.45;          // fora da pista: devagar
    if (tipo === 3) k.turbo = Math.max(k.turbo, 0.8);   // placa de turbo
    if (k.turbo > 0) max *= 1.45;
    if (k.estrela > 0) max *= 1.25;
    if (k.rodando > 0) { acel = 0; vira = 0; k.ang += dt * 14; }
    // acelera / freia
    if (acel) k.vel += 110 * R.ac * acel * dt;
    else if (freia) k.vel -= 160 * dt;
    else k.vel -= 50 * dt * Math.sign(k.vel);
    if (k.turbo > 0) k.vel = Math.max(k.vel, max);
    k.vel = Math.max(-40, Math.min(max, k.vel));
    if (k.vel > max) k.vel -= 200 * dt;
    // vira (só andando); DERRAPAGEM: vira mais e junta carga de turbo
    const andar = Math.min(1, Math.abs(k.vel) / 50) * Math.sign(k.vel || 1);
    if (deriva) {
      if (!k.deriva) { k.deriva = vira; k.carga = 0; Audio2.tone(200, 0.05, "square", 0.2); }
      k.carga += dt;
      k.ang += (k.deriva * 1.6 + vira * 0.9) * R.curva * andar * dt;
      if (Math.random() < 0.5) this.faisca(k, k.carga > 1.6 ? "#f8a030" : k.carga > 0.7 ? "#58a8f8" : "#d0d0d0");
    } else {
      if (k.deriva && eu) {
        // soltou: TURBO pela carga
        if (k.carga > 1.6) { k.turbo = 1.1; Audio2.tone(660, 0.12, "sawtooth", 0.3); }
        else if (k.carga > 0.7) { k.turbo = 0.6; Audio2.tone(520, 0.1, "sawtooth", 0.3); }
      }
      k.deriva = 0;
      k.ang += vira * 2.1 * R.curva * andar * dt;
    }
    // anda (derrapando, o kart escorrega um pouco pro lado de fora)
    const fx = Math.cos(k.ang), fy = Math.sin(k.ang);
    k.x += fx * k.vel * dt; k.y += fy * k.vel * dt;
    if (k.deriva) { k.x += -fy * -k.deriva * k.vel * 0.18 * dt; k.y += fx * -k.deriva * k.vel * 0.18 * dt; }
    k.x = Math.max(4, Math.min(MUNDO - 4, k.x)); k.y = Math.max(4, Math.min(MUNDO - 4, k.y));
    if (this.chao(k.x, k.y) === 2 && !k.estrela) {
      k.caiu = 1.6; k.vel = 0; k.turbo = 0;
      if (eu) { Audio2.tone(300, 0.3, "triangle", 0.4); setTimeout(() => Audio2.tone(150, 0.4, "triangle", 0.4), 250); }
      return;
    }
    // onde ele está no traçado (procura perto do último ponto)
    let melhor = k.idx, md = 1e9;
    for (let s = -6; s <= 14; s++) {
      const i = (k.idx + s + N) % N, d = (c[i][0] - k.x) ** 2 + (c[i][1] - k.y) ** 2;
      if (d < md) { md = d; melhor = i; }
    }
    // passou pela linha de chegada (do fim do traçado pro começo)
    if (k.idx > N * 0.8 && melhor < N * 0.2) {
      k.volta++;
      if (k.volta > VOLTAS && k.chegou == null) {
        k.chegou = this.relogio;
        if (eu) { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => Audio2.tone(f, 0.15, "square", 0.3), i * 120)); }
      } else if (eu && k.volta === VOLTAS) Audio2.tone(880, 0.25, "square", 0.3);
      else if (eu && k.volta > 1) Audio2.tone(660, 0.1, "square", 0.3);
    } else if (k.idx < N * 0.2 && melhor > N * 0.8 && k.volta > 0) k.volta--;   // de ré pela linha
    k.idx = melhor;
    k.prog = k.volta * N + k.idx;
  }

  /** o computador corre mais quando está atrás de você e menos quando está muito na frente */
  elastico(k) {
    const dif = (k.prog - this.eu.prog) / this.pista.caminho.length;
    return Math.max(0.85, Math.min(1.15, 1 - dif * 0.25));
  }

  faisca(k, cor) {
    this.faiscas.push({ x: k.x - Math.cos(k.ang) * 8 + (Math.random() - 0.5) * 10, y: k.y - Math.sin(k.ang) * 8 + (Math.random() - 0.5) * 10, vx: 0, vy: 0, vida: 0.25, cor });
  }

  batidas() {
    for (let i = 0; i < this.karts.length; i++) for (let j = i + 1; j < this.karts.length; j++) {
      const a = this.karts[i], b = this.karts[j];
      if (a.caiu > 0 || b.caiu > 0) continue;
      const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
      if (d > 0 && d < 10) {
        const empurra = (10 - d) / 2, nx = dx / d, ny = dy / d;
        // quem está de ESTRELA derruba o outro
        if (a.estrela && !b.estrela) this.rodar(b);
        else if (b.estrela && !a.estrela) this.rodar(a);
        a.x -= nx * empurra; a.y -= ny * empurra; b.x += nx * empurra; b.y += ny * empurra;
        if ((a.eu || b.eu) && !this.bateuSom) { Audio2.tone(120, 0.05, "square", 0.3); this.bateuSom = true; setTimeout(() => (this.bateuSom = false), 200); }
      }
    }
  }

  rodar(k) {
    if (k.estrela > 0 || k.rodando > 0) return;
    k.rodando = 1.0; k.vel *= 0.3; k.turbo = 0;
    if (k.eu) { Audio2.tone(200, 0.1, "square", 0.35); Audio2.noise(0.2, 0.3); }
  }

  usarItem(k) {
    const it = k.item;
    if (!it) return;
    k.item = null;
    if (it === "baga") { k.turbo = 1.3; if (k.eu) Audio2.tone(700, 0.15, "sawtooth", 0.3); }
    if (it === "estrela") { k.estrela = 7; if (k.eu) [784, 988, 1175].forEach((f, i) => setTimeout(() => Audio2.tone(f, 0.08, "square", 0.3), i * 80)); }
    if (it === "bola") {
      this.tiros.push({ x: k.x + Math.cos(k.ang) * 12, y: k.y + Math.sin(k.ang) * 12, ang: k.ang, vel: Math.max(220, k.vel + 90), vida: 4, dono: k, quica: 3 });
      if (k.eu) Audio2.tone(500, 0.08, "square", 0.3);
    }
    if (it === "cogumelo") {
      this.nuvens.push({ x: k.x - Math.cos(k.ang) * 16, y: k.y - Math.sin(k.ang) * 16, vida: 14, dono: k });
      if (k.eu) Audio2.noise(0.12, 0.25);
    }
  }

  updateTiros(dt) {
    for (const s of this.tiros) {
      s.vida -= dt;
      const nx = s.x + Math.cos(s.ang) * s.vel * dt, ny = s.y + Math.sin(s.ang) * s.vel * dt;
      if (this.chao(nx, ny) === 0 && s.quica > 0) {
        // bate na beira da pista e quica
        s.quica--;
        if (this.chao(nx, s.y) === 0) s.ang = Math.PI - s.ang; else s.ang = -s.ang;
      } else { s.x = nx; s.y = ny; }
      for (const k of this.karts) {
        if (k === s.dono && s.vida > 3.6) continue;
        if (k.caiu <= 0 && Math.hypot(k.x - s.x, k.y - s.y) < 9) { this.rodar(k); s.vida = 0; break; }
      }
    }
    this.tiros = this.tiros.filter((s) => s.vida > 0);
    for (const n of this.nuvens) {
      n.vida -= dt;
      for (const k of this.karts) if (Math.hypot(k.x - n.x, k.y - n.y) < 12 && !(k === n.dono && n.vida > 13)) { this.rodar(k); n.vida = 0; }
    }
    this.nuvens = this.nuvens.filter((n) => n.vida > 0);
  }

  updateCaixas(dt) {
    for (const cx of this.pista.caixas) {
      if (cx.volta > 0) { cx.volta -= dt; continue; }
      for (const k of this.karts) {
        if (k.caiu > 0 || Math.hypot(k.x - cx.x, k.y - cx.y) > 9) continue;
        cx.volta = 3;
        if (!k.item) {
          // quem está atrás ganha coisa melhor
          const pos = this.posicao(k), n = this.karts.length;
          const sorte = Math.random() + (pos / n) * 0.6;
          k.item = sorte > 1.25 ? "estrela" : sorte > 0.85 ? "baga" : sorte > 0.45 ? "bola" : "cogumelo";
          if (k.eu) { this.roleta = 0.8; Audio2.tone(990, 0.05, "square", 0.25); }
        }
        break;
      }
    }
    if (this.roleta) this.roleta = Math.max(0, this.roleta - dt);
  }

  /** a posição (1 = primeiro): quem chegou antes, depois quem andou mais */
  posicao(k) {
    const ord = [...this.karts].sort((a, b) => (a.chegou != null || b.chegou != null)
      ? (a.chegou ?? 1e9) - (b.chegou ?? 1e9) : b.prog - a.prog);
    return ord.indexOf(k) + 1;
  }

  terminar() {
    this.modo = "resultado";
    const ord = [...this.karts].sort((a, b) => (a.chegou ?? 1e9) - (b.chegou ?? 1e9) || b.prog - a.prog);
    this.resultado = ord;
    const nome = PISTAS[this.escolhaPista].nome;
    const tempo = this.eu.chegou;
    if (tempo != null && (!this.f.recordes[nome] || tempo < this.f.recordes[nome])) { this.f.recordes[nome] = tempo; this.recordeNovo = true; }
    else this.recordeNovo = false;
    this.game.autosave?.(true);
  }

  // ---------------------------------------------------------------- menu
  updateMenu() {
    if (this.passo === "corredor") {
      const n = CORREDORES.length;
      if (Input.consume("left")) { this.escolha = (this.escolha + n - 1) % n; Audio2.blip(); }
      if (Input.consume("right")) { this.escolha = (this.escolha + 1) % n; Audio2.blip(); }
      if (Input.consume("up")) { this.escolha = (this.escolha + n - 4) % n; Audio2.blip(); }
      if (Input.consume("down")) { this.escolha = (this.escolha + 4) % n; Audio2.blip(); }
      if (Input.consume("a")) { this.passo = "pista"; Audio2.tone(660, 0.08, "square", 0.3); }
      if (Input.consume("b") || Input.consume("select")) this.game.scenes.pop();
      return;
    }
    const n = PISTAS.length;
    if (Input.consume("up")) { this.escolhaPista = (this.escolhaPista + n - 1) % n; Audio2.blip(); }
    if (Input.consume("down")) { this.escolhaPista = (this.escolhaPista + 1) % n; Audio2.blip(); }
    if (Input.consume("a")) {
      this.comecar();
      this.dlg.say(["SEGURA Z PRA ACELERAR. SHIFT + VIRAR = DERRAPAR (SOLTA PRO TURBO!). X = ITEM. ↓ = FREIO.", "DICA: SEGURA Z NO \"2\" DA CONTAGEM PRO TURBO DE LARGADA!"]);
    }
    if (Input.consume("b")) this.passo = "corredor";
    if (Input.consume("select")) this.game.scenes.pop();
  }

  // ---------------------------------------------------------------- tela
  render(g) {
    g.imageSmoothingEnabled = false;
    if (this.modo === "menu") return this.renderMenu(g);
    this.renderCeu(g);
    this.renderChao(g);
    this.renderCoisas(g);
    this.renderEu(g);
    this.renderHud(g);
    if (this.modo === "resultado") this.renderResultado(g);
    this.dlg.render(g);
  }

  /** a câmera: atrás do seu kart, olhando pra frente */
  camera() {
    const k = this.eu, a = this.camAng;
    return { x: k.x - Math.cos(a) * CAM_ATRAS, y: k.y - Math.sin(a) * CAM_ATRAS, fx: Math.cos(a), fy: Math.sin(a) };
  }

  renderCeu(g) {
    const P = this.pista.P;
    const gr = g.createLinearGradient(0, 0, 0, HZ);
    gr.addColorStop(0, P.ceu[0]); gr.addColorStop(1, P.ceu[1]);
    g.fillStyle = gr; g.fillRect(0, 0, W, HZ);
    // as montanhas lá longe, que andam quando você vira
    const desl = (this.camAng / (Math.PI * 2)) * 480;
    g.fillStyle = P.montanha;
    for (let x = 0; x < W; x++) {
      const u = (x + desl) * 0.05;
      const h = 8 + Math.sin(u) * 5 + Math.sin(u * 2.3 + 1) * 3 + Math.sin(u * 0.37) * 6;
      g.fillRect(x, HZ - Math.max(2, h), 1, Math.max(2, h));
    }
    if (P.lava) {
      // fumaça do vulcão
      g.fillStyle = "#f8603080";
      for (let k = 0; k < 6; k++) g.fillRect(((k * 53 - desl * 1.2) % W + W) % W, HZ - 18 - ((this.t * 6 + k * 7) % 14), 3, 3);
    }
  }

  /** O CHÃO EM PERSPECTIVA: cada linha da tela embaixo do horizonte é uma faixa
   *  do chão a uma distância; mais embaixo = mais perto */
  renderChao(g) {
    const cam = this.camera(), { cores, foraCor } = this.pista, px = this.tela32;
    const rx = -cam.fy, ry = cam.fx;   // o lado direito da câmera
    const alturaTela = H - HZ;
    for (let j = 0; j < alturaTela; j++) {
      const dist = (CAM_ALT * FOCO) / (j + 1);
      const cx = cam.x + cam.fx * dist, cy = cam.y + cam.fy * dist;
      const passo = dist / FOCO;
      let wx = cx - rx * passo * (W / 2), wy = cy - ry * passo * (W / 2);
      const dx = rx * passo, dy = ry * passo;
      const base = j * W;
      for (let i = 0; i < W; i++) {
        const xi = wx | 0, yi = wy | 0;
        px[base + i] = xi >= 0 && yi >= 0 && xi < MUNDO && yi < MUNDO ? cores[yi * MUNDO + xi] : foraCor;
        wx += dx; wy += dy;
      }
    }
    this.telaG.putImageData(this.telaImg, 0, 0);
    g.drawImage(this.tela, 0, HZ);
    // a névoa perto do horizonte
    const gr = g.createLinearGradient(0, HZ, 0, HZ + 14);
    gr.addColorStop(0, this.pista.P.ceu[1] + "c0"); gr.addColorStop(1, this.pista.P.ceu[1] + "00");
    g.fillStyle = gr; g.fillRect(0, HZ, W, 14);
  }

  /** onde um ponto do mundo aparece na tela (null = atrás da câmera) */
  naTela(x, y) {
    const cam = this.camera(), dx = x - cam.x, dy = y - cam.y;
    const f = dx * cam.fx + dy * cam.fy, s = dx * -cam.fy + dy * cam.fx;
    if (f < 8) return null;
    return { x: W / 2 + (s / f) * FOCO, y: HZ + (CAM_ALT * FOCO) / f, esc: FOCO / f, f };
  }

  renderCoisas(g) {
    const ms = performance.now(), lista = [];
    for (const e of this.pista.enfeites) { const p = this.naTela(e.x, e.y); if (p && p.f < 520) lista.push({ p, f: () => this.desenhaEnfeite(g, e, p) }); }
    for (const cx of this.pista.caixas) { if (cx.volta > 0) continue; const p = this.naTela(cx.x, cx.y); if (p) lista.push({ p, f: () => this.desenhaCaixa(g, p) }); }
    for (const n of this.nuvens) { const p = this.naTela(n.x, n.y); if (p) lista.push({ p, f: () => this.desenhaNuvem(g, n, p) }); }
    for (const s of this.tiros) { const p = this.naTela(s.x, s.y); if (p) lista.push({ p, f: () => this.desenhaIcone(g, "bola", p, 0.9) }); }
    for (const k of this.karts) {
      if (k.eu) continue;
      const p = this.naTela(k.x, k.y);
      if (p && p.f < 600) lista.push({ p, f: () => this.desenhaKart(g, k, p, ms) });
    }
    for (const f of this.faiscas) { const p = this.naTela(f.x, f.y); if (p) lista.push({ p, f: () => { g.fillStyle = f.cor; g.fillRect(Math.round(p.x), Math.round(p.y - 2 * p.esc), Math.max(1, Math.round(2 * p.esc)), Math.max(1, Math.round(2 * p.esc))); } }); }
    lista.sort((a, b) => b.p.f - a.p.f);
    for (const c of lista) c.f();
  }

  desenhaEnfeite(g, e, p) {
    const art = e.tipo === "pedra" ? PEDRA : e.tipo === "palmeira" ? PALMEIRA : ARVORE;
    const esc = p.esc * 2.4;
    if (esc < 0.15) return;
    pinta(g, art, CORES_ENF, p.x - (art[0].length * esc) / 2, p.y - art.length * esc, esc);
  }
  desenhaCaixa(g, p) {
    const esc = p.esc * 1.0, sobe = Math.sin(this.t * 4) * 2 * esc;
    pinta(g, CAIXA, { k: "#3a2a10", y: Math.floor(this.t * 6) % 2 ? "#f8d040" : "#f8e888" }, p.x - 5 * esc, p.y - 14 * esc + sobe, esc);
  }
  desenhaNuvem(g, n, p) {
    const r = 7 * p.esc;
    g.fillStyle = "#b070c0a0";
    for (let k = 0; k < 5; k++) g.fillRect(Math.round(p.x + Math.cos(this.t * 2 + k) * r - r / 2), Math.round(p.y - r * 1.4 + Math.sin(this.t * 3 + k) * r * 0.4), Math.ceil(r), Math.ceil(r));
  }
  desenhaIcone(g, it, p, esc = 1) {
    const img = ICONES[it];
    if (!img?.complete || !img.naturalWidth) return;
    const s = Math.max(2, img.width * esc * p.esc);
    g.drawImage(img, Math.round(p.x - s / 2), Math.round(p.y - s), Math.round(s), Math.round(s));
  }

  /** um kart com o bicho em cima, do tamanho da distância */
  desenhaKart(g, k, p, ms) {
    if (k.caiu > 0) return;
    const esc = p.esc * 0.9;
    if (esc < 0.08) return;
    const piscar = k.estrela > 0 && Math.floor(this.t * 12) % 2;
    // de que lado a gente vê ele (de costas, de lado, de frente)
    let rel = k.ang - this.camAng + (k.rodando ? this.t * 20 : 0);
    while (rel > Math.PI) rel -= Math.PI * 2;
    while (rel < -Math.PI) rel += Math.PI * 2;
    const dir = Math.abs(rel) < 0.8 ? "up" : Math.abs(rel) > 2.3 ? "down" : rel > 0 ? "right" : "left";
    this.desenhaBicho(g, k.r.id, dir, ms, p.x, p.y - 6 * esc, esc);
    pinta(g, KART, { k: "#181818", K: piscar ? "#ffffff" : k.r.cor, W: "#404040", y: "#f8d040" }, p.x - 10 * esc, p.y - 10 * esc, esc);
  }

  desenhaBicho(g, species, dir, ms, cx, pe, esc) {
    const q = Assets.monAndando({ species }, dir, ms);
    if (!q) return;
    const w = q.width * esc, h = q.height * esc;
    g.drawImage(q, Math.round(cx - w / 2), Math.round(pe - h * 0.78), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
  }

  /** VOCÊ: grande, embaixo no meio da tela, de costas */
  renderEu(g) {
    const k = this.eu, ms = performance.now();
    if (k.caiu > 0) {
      // o VOLBEAT vem te buscar
      const t = 1.6 - k.caiu, y = 60 + Math.sin(t * 4) * 6;
      this.desenhaBicho(g, "volbeat", "down", ms, W / 2, y + 30, 1.4);
      const s = "O VOLBEAT TE BUSCOU!";
      drawText(g, s, (W - s.length * 6) / 2, 110, "#ffffff");
      return;
    }
    const balanco = Math.sin(this.t * 30) * (k.vel > 20 ? 0.6 : 0);
    let virada = (Input.held("right") ? 1 : 0) - (Input.held("left") ? 1 : 0);
    if (k.rodando) virada = Math.floor(this.t * 10) % 3 - 1;
    const dir = virada > 0 ? "right" : virada < 0 ? "left" : "up";
    const x = W / 2, y = H - 10 + balanco;
    const piscar = k.estrela > 0 && Math.floor(this.t * 12) % 2;
    this.desenhaBicho(g, k.r.id, k.deriva ? (k.deriva > 0 ? "right" : "left") : dir, k.vel > 5 ? ms : 0, x, y - 12, 1.3);
    pinta(g, KART, { k: "#181818", K: piscar ? "#ffffff" : k.turbo > 0 ? "#f8f080" : k.r.cor, W: "#404040", y: "#f8d040" }, x - 20, y - 20, 2);
    // fogo do turbo saindo de trás
    if (k.turbo > 0) for (let i = 0; i < 4; i++) { g.fillStyle = i % 2 ? "#f8d040" : "#f86020"; g.fillRect(x - 14 + i * 8 + (Math.random() * 2 | 0), y - 2 + (Math.random() * 3 | 0), 4, 3); }
    // faíscas da derrapagem
    if (k.deriva) {
      const cor = k.carga > 1.6 ? "#f8a030" : k.carga > 0.7 ? "#58a8f8" : "#e0e0e0";
      for (let i = 0; i < 3; i++) { g.fillStyle = cor; g.fillRect(x - 22 + Math.random() * 6, y - 4 + Math.random() * 4, 2, 2); g.fillRect(x + 16 + Math.random() * 6, y - 4 + Math.random() * 4, 2, 2); }
    }
  }

  renderHud(g) {
    const k = this.eu, pos = this.posicao(k);
    // a posição, grande
    const txt = `${pos}/${this.karts.length}`;
    g.fillStyle = "#00000080"; g.fillRect(W - 34, H - 22, 30, 16);
    drawText(g, txt, W - 28, H - 18, pos === 1 ? "#f8d040" : "#ffffff");
    // a volta e o tempo
    const v = Math.min(VOLTAS, Math.max(1, k.volta));
    drawText(g, `VOLTA ${v}/${VOLTAS}`, 4, 3, "#ffffff");
    drawText(g, tempoTexto(this.relogio), 4, 13, "#f8f0c0");
    // o item (com a roleta girando quando pegou)
    g.fillStyle = "#00000080"; g.fillRect(W - 26, 2, 22, 22);
    g.strokeStyle = "#ffffff"; g.lineWidth = 1; g.strokeRect(W - 25.5, 2.5, 21, 21);
    const it = this.roleta > 0 ? Object.keys(ITENS)[Math.floor(this.t * 14) % 4] : k.item;
    if (it) { const img = ICONES[it]; if (img?.complete && img.naturalWidth) g.drawImage(img, W - 15 - img.width / 2, 13 - img.height / 2); }
    // o mapinha
    this.renderMapinha(g);
    // a contagem
    if (this.largada > 0) {
      const n = Math.ceil(this.largada) - 1;
      const s = n > 0 ? `${n}` : "VAI!";
      if (n <= 3) {
        const c = document.createElement("canvas"); c.width = s.length * 6; c.height = 8;
        drawText(c.getContext("2d"), s, 0, 0, n > 0 ? "#f8f8f8" : "#60e060");
        g.drawImage(c, (W - c.width * 4) / 2, 40, c.width * 4, 32);
      }
    } else if (this.relogio < 0.8) {
      const c = document.createElement("canvas"); c.width = 24; c.height = 8;
      drawText(c.getContext("2d"), "VAI!", 0, 0, "#60e060");
      g.drawImage(c, (W - 96) / 2, 40, 96, 32);
    }
    if (k.chegou != null && this.modo !== "resultado") { const s = "CHEGADA!"; drawText(g, s, (W - s.length * 6) / 2, 50, "#f8d040"); }
  }

  renderMapinha(g) {
    const c = this.pista.caminho, e = 44 / MUNDO, x0 = 4, y0 = H - 50;
    g.fillStyle = "#00000060"; g.fillRect(x0 - 2, y0 - 2, 48, 48);
    g.fillStyle = "#c8c8c8";
    for (let i = 0; i < c.length; i += 3) g.fillRect(Math.round(x0 + c[i][0] * e), Math.round(y0 + c[i][1] * e), 1, 1);
    for (const k of this.karts) { g.fillStyle = k.eu ? "#ffffff" : k.r.cor; g.fillRect(Math.round(x0 + k.x * e) - 1, Math.round(y0 + k.y * e) - 1, k.eu ? 3 : 2, k.eu ? 3 : 2); }
  }

  renderResultado(g) {
    g.fillStyle = "#000000b0"; g.fillRect(30, 12, 180, 136);
    drawText(g, "RESULTADO", 90, 16, "#f8d040");
    this.resultado.forEach((k, i) => {
      const t = k.chegou != null ? tempoTexto(k.chegou) : "--:--.-";
      drawText(g, `${i + 1}. ${k.r.nome}`, 40, 30 + i * 11, k.eu ? "#60e0ff" : "#ffffff");
      drawText(g, t, 150, 30 + i * 11, k.eu ? "#60e0ff" : "#c8c8d8");
    });
    if (this.recordeNovo) drawText(g, "RECORDE NOVO!", 81, 120, "#f8d040");
    drawText(g, "Z: CONTINUAR", 84, 134, "#c8c8d8");
  }

  renderMenu(g) {
    g.fillStyle = "#1a1830"; g.fillRect(0, 0, W, H);
    for (let y = 0; y < H; y += 10) for (let x = 0; x < W; x += 10) if ((x + y) % 20 === 0) { g.fillStyle = "#22203c"; g.fillRect(x, y, 10, 10); }
    const c = this._titulo ||= (() => {
      const cv = document.createElement("canvas"); cv.width = 120; cv.height = 10;
      drawText(cv.getContext("2d"), "SUPER PAWMOT KART", 9, 0, "#f8a030");
      return cv;
    })();
    g.drawImage(c, 0, 0, 120, 10, 0, 4, 240, 20);
    const ms = performance.now();
    if (this.passo === "corredor") {
      drawText(g, "ESCOLHE O CORREDOR", 66, 28, "#ffffff");
      CORREDORES.forEach((r, i) => {
        const x = 18 + (i % 4) * 54, y = 38 + Math.floor(i / 4) * 56, sel = i === this.escolha;
        g.fillStyle = sel ? "#f8d040" : "#3a3860"; g.fillRect(x, y, 46, 42);
        g.fillStyle = "#14122a"; g.fillRect(x + 1, y + 1, 44, 40);
        this.desenhaBicho(g, r.id, "down", sel ? ms : 0, x + 23, y + 32, 1);
        pinta(g, KART, { k: "#181818", K: r.cor, W: "#404040", y: "#f8d040" }, x + 13, y + 29, 1);
        // o nome embaixo da caixa (os compridos encolhem pra caber)
        const nome = r.nome.length > 7 ? r.nome.slice(0, 6) + "." : r.nome;
        drawText(g, nome, x + 23 - nome.length * 3, y + 44, sel ? "#f8d040" : "#c8c8d8");
      });
      drawText(g, "← → ↑ ↓   Z: ESSE!   C: SAIR", 18, H - 10, "#a0a0c0");
      return this.dlg.render(g);
    }
    drawText(g, "ESCOLHE A PISTA", 75, 28, "#ffffff");
    PISTAS.forEach((p, i) => {
      const y = 44 + i * 30, sel = i === this.escolhaPista;
      g.fillStyle = sel ? "#f8d040" : "#3a3860"; g.fillRect(30, y, 180, 26);
      g.fillStyle = p.fora; g.fillRect(31, y + 1, 178, 24);
      g.fillStyle = "#00000070"; g.fillRect(31, y + 1, 178, 24);
      drawText(g, p.nome, 38, y + 5, sel ? "#f8d040" : "#ffffff");
      const rec = this.f.recordes[p.nome];
      drawText(g, rec ? `RECORDE ${tempoTexto(rec)}` : "SEM RECORDE", 38, y + 15, "#c8c8d8");
    });
    this.desenhaBicho(g, CORREDORES[this.escolha].id, "down", ms, 20, 150, 1);
    drawText(g, "↑ ↓   Z: CORRER   X: VOLTAR", 36, H - 10, "#a0a0c0");
    this.dlg.render(g);
  }
}

function tempoTexto(s) {
  const m = Math.floor(s / 60), r = s - m * 60;
  return `${m}:${r < 10 ? "0" : ""}${r.toFixed(1)}`;
}
