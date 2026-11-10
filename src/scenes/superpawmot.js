// SUPER PAWMOT (ideia do CAIO, 08/nov/2026): o jogo de plataforma 2D que
// roda no NINTENDO SWITCH do quarto (src/data/maps.js, o `switch` do quarto).
// Os bichos são os SPRITES DE ANDAR (os de fora da bola, do Mystery Dungeon —
// Assets.monAndando), pedido do CAIO:
//  - o HERÓI é o PAWMOT. ← → anda, Z pula (no ar, Z de novo = pulo duplo),
//    X dá soco; SEGURANDO X ele carrega o SOCO ELÉTRICO, que derruba tudo na
//    frente e LIGA os interruptores (as PONTES de luz).
//  - os "goombas" são SHROOMISH: andam e soltam uma NUVEM de esporos (dentro
//    dela você fica lento). Encostar machuca; cair em cima é trampolim.
//  - os "hammer bros" são TINKATUFF: pulam e jogam MARTELO em arco.
//  - os "pokeys" são CACNEA EMPILHADOS: cada soco (ou pulo em cima) tira um.
//  - as máscaras do SMB2 são YAMASK: dormem até você pegar a CHAVE; aí te
//    perseguem até você abrir a PORTA com ela.
//  - os "birdos" são OCTILLERY: cospem BOLAS DE TINTA retas (dá pra subir
//    em cima delas e ir de carona). Aguentam 3 socos; pular na cabeça é seguro.
//  - o "yoshi" é o LICKITUNG: encostou, você monta. Montado, o X é a LÍNGUA,
//    que come quase tudo (segurar X ainda é o SOCO ELÉTRICO). Se você se
//    machucar montado, cai e ele foge correndo.
//  - o BOWSER é o GARCHOMP (chefão: anda, pula e faz TREMOR, dá investida) e o
//    BOWSER JR. é o GIBLE (pula atrás de você e gira). Os dois são peças do
//    editor: o CAIO põe na fase dele. Com chefão vivo, a TORRE não acende.
//  - POWER-UPS nos blocos "?" (bate a cabeça embaixo): BAGA = fica GRANDE
//    (aguenta 1 golpe a mais), PEDRA DO FOGO = X atira fogo, ESTRELA =
//    invencível uns segundos, PENA = capa: segura Z caindo pra planar.
//    Machucou com fogo/pena: volta a ser GRANDE; grande: volta ao normal.
//  - os VOLBEAT são os moradores: falam uma dica e acendem a lanterna (o
//    lugar onde você volta se cair).
//  - as PILHAS: o que se junta. A TORRE no fim acende e a fase acaba.
// Fases: A FLORESTA, O LAGO, O VULCÃO, A PIRÂMIDE — e a FASE DO CAIO, que ele
// monta em dev/fasepawmot.html (fica em dev/captures/superpawmot_fase_caio.log).
// Passar uma fase destrava a próxima (st.flags.pawmotFases). C sai.
// ?superpawmot=3 já começa na fase 3; ?superpawmot=caio na dele.
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { drawText, fade } from "../core/gfx.js";
import { Assets } from "../core/assets.js";
import { Dialogue } from "../systems/dialogue.js";

const W = 240, H = 160, T = 16, ALT = 10;
const GRAV = 520, ANDA = 78, PULO = 205, PULO2 = 180;
const CARGA = 0.6;                       // segundos segurando X pro SOCO ELÉTRICO
const PW = 14, PH = 26;                  // o corpo do PAWMOT (o sprite de andar dele)
const EW = 16, EH = 15;                  // o corpo do SHROOMISH
const TW = 16, TH = 19;                  // o corpo do TINKATUFF
const CW = 16, CH = 14;                  // um CACNEA da pilha
const YW = 14, YH = 16;                  // o YAMASK
const OW = 24, OH = 22;                  // o OCTILLERY
const LINGUA = 34;                       // o alcance da língua do LICKITUNG
const MONTA = 14;                        // montado, o PAWMOT fica isso mais alto
const GW = 40, GH = 46, GVIDA = 8;      // o GARCHOMP (desenhado 1,6x)
const JW = 18, JH = 20, JVIDA = 4;       // o GIBLE
const ESTRELA_S = 9;                     // segundos de ESTRELA
// os blocos "?" e o que tem dentro
const BLOCOS = { B: "baga", R: "fogo", E: "estrela", N: "pena" };
const NOME_PODER = { baga: "BAGA", fogo: "PEDRA DO FOGO", estrela: "ESTRELA", pena: "PENA DE VOAR" };

// ------------------------------------------------------------------ as fases
// # chão   = tábua (só segura de cima)   o vitória-régia (igual à tábua)
// b ponte (só existe ligada)   S interruptor (liga a ponte depois dele)
// P pilha  e SHROOMISH  t TINKATUFF  c CACNEA (pilha de 3)  y YAMASK
// f bola de fogo (pula do buraco)  K chave  D porta (abre com a chave)
// O OCTILLERY  L LICKITUNG (pra montar)  G GARCHOMP (chefão)  g GIBLE
// blocos "?": B BAGA  R PEDRA DO FOGO  E ESTRELA  N PENA (u = bloco já usado)
// v VOLBEAT (lanterna)  F a torre do fim  @ começo
// Os vãos com PONTE têm 9 tiles: mais do que o pulo duplo alcança.
function grade(L) {
  const m = Array.from({ length: ALT }, () => Array(L).fill("."));
  const g = {
    m,
    poe: (x, y, ch) => { m[y][x] = ch; },
    chao: (a = 0, b = L - 1) => { for (let x = a; x <= b; x++) { m[8][x] = "#"; m[9][x] = "#"; } },
    vao: (a, b, ch = ".") => { for (let x = a; x <= b; x++) { m[8][x] = ch; m[9][x] = ch; } },
    tabua: (a, b, y, ch = "=") => { for (let x = a; x <= b; x++) m[y][x] = ch; },
    linhas: () => m.map((l) => l.join("")),
  };
  g.chao();
  return g;
}

function faseFloresta() {
  const g = grade(140);
  g.vao(22, 24); g.vao(46, 54, "b"); g.vao(76, 78); g.vao(100, 108, "b");
  g.tabua(14, 17, 5); g.tabua(30, 34, 5); g.tabua(34, 36, 3); g.tabua(60, 64, 5); g.tabua(84, 88, 5); g.tabua(112, 115, 5);
  for (const [x, y] of [[16, 4], [32, 4], [35, 2], [62, 4], [86, 4], [104, 6], [113, 4]]) g.poe(x, y, "P");
  for (const x of [11, 27, 39, 58, 68, 82, 90, 112, 120, 127]) g.poe(x, 7, "e");
  for (const x of [20, 66]) g.poe(x, 7, "v");
  g.poe(43, 7, "S"); g.poe(96, 7, "S"); g.poe(4, 7, "@"); g.poe(134, 4, "F");
  g.poe(9, 5, "B"); g.poe(70, 5, "R"); g.poe(118, 5, "E");
  return g.linhas();
}

function faseLago() {
  const g = grade(150);
  g.vao(16, 18);
  g.vao(28, 38); g.poe(31, 8, "o"); g.poe(35, 8, "o");
  g.tabua(44, 49, 5); g.poe(46, 4, "t");
  g.vao(61, 69, "b"); g.poe(58, 7, "S");
  g.tabua(86, 90, 5);
  g.vao(95, 105); for (const x of [97, 100, 103]) g.poe(x, 8, "o");
  g.tabua(118, 122, 5);
  g.vao(128, 136, "b"); g.poe(125, 7, "S");
  for (const x of [52, 74, 90, 110]) g.poe(x, 7, "e");
  for (const x of [80, 113]) g.poe(x, 7, "c");
  g.poe(115, 7, "t"); g.poe(141, 7, "O"); g.poe(9, 7, "L");
  g.poe(13, 5, "B"); g.poe(55, 5, "N"); g.poe(92, 5, "E");
  for (const x of [24, 108]) g.poe(x, 7, "v");
  for (const [x, y] of [[33, 5], [44, 3], [65, 5], [88, 4], [100, 6], [120, 4], [140, 2]]) g.poe(x, y, "P");
  g.poe(3, 7, "@"); g.poe(145, 4, "F");
  return g.linhas();
}

function faseVulcao() {
  const g = grade(160);
  g.vao(14, 17); g.poe(15, 9, "f");
  g.tabua(26, 30, 5); g.poe(28, 4, "t");
  g.vao(34, 40); g.tabua(36, 38, 6); g.poe(35, 9, "f"); g.poe(39, 9, "f");
  g.vao(67, 75, "b"); g.poe(64, 7, "S"); g.poe(71, 9, "f");
  g.poe(82, 7, "t"); g.tabua(88, 92, 5); g.poe(90, 4, "t");
  g.vao(96, 99); g.poe(97, 9, "f");
  g.vao(120, 128); g.tabua(122, 123, 6); g.tabua(126, 126, 5); g.poe(121, 9, "f"); g.poe(125, 9, "f");
  g.vao(137, 145, "b"); g.poe(134, 7, "S"); g.poe(141, 9, "f");
  for (const x of [22, 60, 104, 131]) g.poe(x, 7, "e");
  for (const x of [50, 58, 110, 147]) g.poe(x, 7, "c");
  g.poe(151, 7, "O"); g.poe(8, 7, "L");
  g.poe(11, 5, "B"); g.poe(45, 5, "R"); g.poe(113, 5, "E");
  for (const x of [44, 116]) g.poe(x, 7, "v");
  for (const [x, y] of [[16, 5], [28, 2], [37, 4], [71, 5], [90, 2], [122, 4], [149, 2]]) g.poe(x, y, "P");
  g.poe(3, 7, "@"); g.poe(155, 4, "F");
  return g.linhas();
}

function fasePiramide() {
  const g = grade(150);
  g.vao(18, 20);
  g.tabua(26, 30, 5); g.poe(28, 4, "t");
  g.vao(53, 61, "b"); g.poe(50, 7, "S");
  g.tabua(72, 76, 5); g.poe(74, 4, "K");               // a CHAVE: pegou, os YAMASK acordam
  g.vao(86, 89);
  g.vao(114, 118);
  for (let y = 0; y <= 5; y++) g.poe(128, y, "#");      // o paredão: só passa pela PORTA
  g.poe(128, 6, "D"); g.poe(128, 7, "D");
  for (const [x, y] of [[62, 3], [84, 2], [100, 3], [120, 2]]) g.poe(x, y, "y");
  for (const x of [12, 80, 122]) g.poe(x, 7, "e");
  for (const x of [44, 68, 110]) g.poe(x, 7, "c");
  g.poe(95, 7, "t"); g.poe(136, 7, "O"); g.poe(40, 7, "L");
  g.poe(9, 5, "B"); g.poe(48, 5, "N"); g.poe(92, 5, "R");
  for (const x of [36, 104]) g.poe(x, 7, "v");
  for (const [x, y] of [[19, 5], [28, 2], [57, 5], [88, 5], [100, 6], [116, 5], [135, 6]]) g.poe(x, y, "P");
  g.poe(3, 7, "@"); g.poe(140, 4, "F");
  return g.linhas();
}

function faseCastelo() {
  const g = grade(172);
  g.poe(8, 5, "B");
  g.vao(18, 20); g.poe(19, 9, "f");
  g.tabua(24, 28, 5); g.poe(26, 4, "t");
  g.poe(42, 5, "R");
  g.vao(46, 54, "b"); g.poe(43, 7, "S"); g.poe(50, 9, "f");
  g.poe(60, 7, "O"); g.poe(66, 5, "E");
  g.poe(76, 7, "g");                                   // o GIBLE no meio do caminho
  g.vao(92, 95); g.poe(93, 9, "f");
  g.poe(110, 5, "N");
  g.vao(114, 122, "b"); g.poe(111, 7, "S"); g.poe(118, 9, "f");
  g.poe(132, 5, "B");
  g.poe(155, 7, "G");                                  // o GARCHOMP no salão do fim
  for (const x of [14, 102]) g.poe(x, 7, "e");
  for (const x of [34, 100]) g.poe(x, 7, "c");
  g.poe(106, 7, "t");
  for (const x of [38, 88, 127]) g.poe(x, 7, "v");
  for (const [x, y] of [[19, 5], [26, 2], [50, 5], [66, 3], [93, 5], [118, 5], [145, 3]]) g.poe(x, y, "P");
  g.poe(3, 7, "@"); g.poe(167, 4, "F");
  return g.linhas();
}

const FASES = [
  { nome: "A FLORESTA", ceu: "floresta", linhas: faseFloresta(), falas: [
    ["OI! EU SOU UM VOLBEAT. A FLORESTA ESTÁ APAGADA...", "SEGURA O X PRA CARREGAR O SOCO ELÉTRICO. ELE LIGA OS INTERRUPTORES!", "AGORA ESTA LANTERNA É SUA: SE CAIR, VOLTA AQUI."],
    ["CUIDADO COM A NUVEM DOS SHROOMISH: DENTRO DELA VOCÊ FICA LENTO.", "E SE PULAR EM CIMA DELES, ELES TE JOGAM LÁ PRO ALTO!", "ACENDI A LANTERNA PRA VOCÊ."],
  ] },
  { nome: "O LAGO", ceu: "lago", linhas: faseLago(), falas: [
    ["ACHOU O LICKITUNG? ENCOSTA NELE PRA MONTAR! O X VIRA LÍNGUA.", "AS VITÓRIAS-RÉGIAS AGUENTAM VOCÊ. A ÁGUA NÃO!", "AQUELE TINKATUFF JOGA MARTELO. PULA EM CIMA DELE!", "ACENDI A LANTERNA PRA VOCÊ."],
    ["OS CACNEA FICAM UM EM CIMA DO OUTRO.", "CADA SOCO TIRA UM. O SOCO ELÉTRICO TIRA VÁRIOS!", "LÁ NO FIM TEM UM OCTILLERY. DÁ PRA SUBIR NAS BOLAS DE TINTA DELE!", "ACENDI A LANTERNA PRA VOCÊ."],
  ] },
  { nome: "O VULCÃO", ceu: "vulcao", linhas: faseVulcao(), falas: [
    ["QUE CALOR! AS BOLAS DE FOGO PULAM DA LAVA.", "ESPERA ELAS CAÍREM E PASSA CORRENDO!", "ACENDI A LANTERNA PRA VOCÊ."],
    ["FALTA POUCO! TEM MAIS UMA PONTE LÁ NA FRENTE.", "ACENDI A LANTERNA PRA VOCÊ."],
  ] },
  { nome: "A PIRÂMIDE", ceu: "piramide", linhas: fasePiramide(), falas: [
    ["PSIU... AQUI MORAM OS YAMASK. ELES ESTÃO DORMINDO.", "SE ALGUÉM PEGAR A CHAVE, ELES ACORDAM E PERSEGUEM!", "ACENDI A LANTERNA PRA VOCÊ."],
    ["A PORTA DO FIM SÓ ABRE COM A CHAVE.", "O SOCO ELÉTRICO ASSUSTA OS YAMASK UM POUQUINHO.", "ACENDI A LANTERNA PRA VOCÊ."],
  ] },
  { nome: "O CASTELO", ceu: "castelo", linhas: faseCastelo(), falas: [
    ["AQUI É O CASTELO DO GARCHOMP!", "PEGA OS POWER-UPS DOS BLOCOS: VOCÊ VAI PRECISAR.", "ACENDI A LANTERNA PRA VOCÊ."],
    ["O GIBLE É O FILHO DO GARCHOMP. QUANDO ELE GIRA, NADA PEGA NELE!", "ESPERA ELE PARAR DE GIRAR E ATACA.", "ACENDI A LANTERNA PRA VOCÊ."],
    ["O GARCHOMP ESTÁ LOGO ALI. ELE PULA E FAZ O CHÃO TREMER: PULA AS PEDRAS!", "QUANDO ELE TREMER PARADO, VEM A INVESTIDA. SAI DA FRENTE!", "PULA NA CABEÇA DELE OU USA O SOCO ELÉTRICO. BOA SORTE!"],
  ] },
];
const FALAS_PADRAO = [["OI! EU SOU UM VOLBEAT.", "ACENDI A LANTERNA PRA VOCÊ."]];
const CEUS = ["floresta", "lago", "vulcao", "piramide", "castelo"];

/** A FASE DO CAIO (dev/fasepawmot.html): o arquivo que o editor salva, ou a
 *  cópia que ele guarda no navegador. null se ele ainda não fez. */
async function carregarFaseCaio() {
  let d = null;
  try {
    const r = await fetch("dev/captures/superpawmot_fase_caio.log?v=" + Date.now());
    if (r.ok) d = JSON.parse(await r.text());
  } catch {}
  if (!d) try { d = JSON.parse(localStorage.getItem("superpawmot_fase_caio")); } catch {}
  if (!d || !Array.isArray(d.linhas) || !d.linhas.length) return null;
  const L = Math.max(...d.linhas.map((l) => String(l).length));
  let linhas = d.linhas.slice(-ALT).map((l) => String(l).padEnd(L, "."));
  while (linhas.length < ALT) linhas.unshift(".".repeat(L));
  if (!linhas.some((l) => l.includes("@"))) return null;
  const falas = (d.falas || []).filter((f) => String(f).trim()).map((f) => String(f).toUpperCase());
  return {
    nome: String(d.nome || "A FASE DO CAIO").toUpperCase().slice(0, 22), dele: true,
    ceu: CEUS.includes(d.ceu) ? d.ceu : "floresta", linhas,
    falas: falas.length ? [[...falas, "ACENDI A LANTERNA PRA VOCÊ."]] : FALAS_PADRAO,
  };
}

// ------------------------------------------------------------------ desenhos reserva
// (só aparecem enquanto o sprite de andar ainda não carregou)
const HEROI = [
  "....y.......", "...yYy......", "....o.......", "..oooooo....", ".oooooooo...", ".ooWWkWWo...", ".ooWWkWWo...",
  "BBoWWWWWoBB.", "BBooRRoooBB.", "..oooooooo..", "..oooooooo..", "...oo..oo...", "...dd..dd...",
];
const HEROI_COR = { y: "#fff27a", Y: "#ffffff", o: "#f08a24", W: "#fff4e0", k: "#202028", B: "#3b7bea", R: "#e8504a", d: "#9a5212" };
const PILHA = [
  "..gg..", ".gGGg.", ".gGGg.", ".gYYg.", ".gYYg.", ".gggg.",
];
const PILHA_COR = { g: "#2a3040", G: "#3ec46a", Y: "#f8d040" };
// o MARTELO do TINKATUFF (cabeça rosa, cabo marrom)
const MARTELO = [
  ".rrrrr.", "rRRRRRr", "rRRRRRr", ".rrrrr.", "...c...", "...c...", "...c...",
];
const MARTELO_COR = { r: "#a83a6a", R: "#f07ab0", c: "#8a5a2a" };
const CHAVE = [
  ".yyy....", "y...y...", "y...yyyy", "y...y.y.", ".yyy..y.",
];
const CHAVE_COR = { y: "#f8d040" };
// a PENA DE VOAR (não tem ícone de item pronto)
const PENA = [
  "........wb", ".......wwb", "......wWwb", ".....wWWb.", "....wWWwb.", "...wWWWb..",
  "..wWWwb...", ".wWWwb....", ".wWwb.....", "..bb......", ".c........", "c.........",
];
const PENA_COR = { w: "#ffffff", W: "#c8e0ff", b: "#6a8ac8", c: "#a87a4a" };
// os ícones dos itens de verdade (assets/sprites/itens)
const ICONES = {};
for (const [k, f] of [["baga", "oran-berry"], ["fogo", "pedra-do-fogo"], ["estrela", "estrela"]]) {
  const img = new Image(); img.src = `assets/sprites/itens/${f}.png`; ICONES[k] = img;
}
function desenhaItem(ctx, tipo, x, y) {
  const img = ICONES[tipo];
  if (img?.complete && img.naturalWidth) ctx.drawImage(img, Math.round(x - 2), Math.round(y - 3));
  else if (tipo === "pena") pinta(ctx, PENA, PENA_COR, x, y);
  else { ctx.fillStyle = { baga: "#3a6ad8", fogo: "#e8502a", estrela: "#f8d040" }[tipo]; ctx.fillRect(x + 1, y + 1, 10, 10); }
}

/** Onde está o bicho DENTRO do quadro (o quadro do Mystery Dungeon tem sobra
 *  em volta): achado uma vez por quadro. */
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
/** o sprite de andar de `species` virado pra `dir`, com o meio dos pés em
 *  (cx, pe). `voando`: ancora pelo meio do QUADRO (aí o sobe-desce do próprio
 *  sprite aparece, como o do YAMASK). Devolve false se o PNG ainda não chegou. */
function desenhaMon(ctx, species, dir, ms, cx, pe, voando = false, escala = 1) {
  const q = Assets.monAndando({ species }, dir, ms);
  if (!q) return false;
  const c = voando ? { cx: q.width / 2, pe: q.height } : caixa(q);
  if (escala === 1) ctx.drawImage(q, Math.round(cx - c.cx), Math.round(pe - c.pe));
  else ctx.drawImage(q, Math.round(cx - c.cx * escala), Math.round(pe - c.pe * escala), Math.round(q.width * escala), Math.round(q.height * escala));
  return true;
}

function pinta(ctx, rows, cores, x, y, espelha = false) {
  const w = rows[0].length;
  rows.forEach((l, j) => [...l].forEach((ch, i) => {
    if (!cores[ch]) return;
    ctx.fillStyle = cores[ch];
    ctx.fillRect(Math.round(x + (espelha ? w - 1 - i : i)), Math.round(y + j), 1, 1);
  }));
}
const toca = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

// as cores do chão e do líquido de cada céu
const TERRA = {
  floresta: { terra: "#6a4428", pedra: "#57361e", topo: "#3ea84a", brilho: "#6ad06a", liquido: null },
  lago: { terra: "#8a6a3a", pedra: "#6a5028", topo: "#4ab85a", brilho: "#8ae08a", liquido: ["#2a6ac8", "#6aaef0"] },
  vulcao: { terra: "#3a2a2a", pedra: "#e8502a", topo: "#5a3a34", brilho: "#8a5a4a", liquido: ["#d83a1a", "#f8a020"] },
  piramide: { terra: "#c89a5a", pedra: "#a87a3a", topo: "#e8c47a", brilho: "#f8e0a0", liquido: null },
  castelo: { terra: "#4a4a5a", pedra: "#3a3a48", topo: "#6a6a7a", brilho: "#8a8a9a", liquido: ["#d83a1a", "#f8a020"] },
};

export class SuperPawmotScene {
  get st() { return this.game?.state; }

  enter() {
    this.dlg = new Dialogue();
    this.t = 0;
    this.fadeA = 1; this.fadeDir = -1;
    this.modo = "menu";
    this.escolha = 0;
    this.fases = [...FASES];
    this.faseCaio = null;
    const pede = new URLSearchParams(location.search).get("superpawmot");
    carregarFaseCaio().then((f) => {
      if (!f) return;
      this.faseCaio = f; this.fases = [...FASES, f];
      if (pede === "caio" && this.modo === "menu") this.comecar(this.fases.length - 1);
    });
    this.escolha = Math.min(this.liberadas(), FASES.length - 1);
    if (/^\d+$/.test(pede || "") && +pede >= 1 && +pede <= FASES.length && +pede !== 1) this.comecar(+pede - 1);
    else this.dlg.say(["VOCÊ LIGOU O NINTENDO SWITCH...", "SUPER PAWMOT! ESCOLHE A FASE COM ↑ ↓ E APERTA Z."]);
  }
  exit() {}

  /** quantas fases já passou (a próxima fica destravada) */
  liberadas() { return this.st?.flags?.pawmotFases || 0; }
  aberta(i) { return this.fases[i]?.dele || i <= this.liberadas(); }

  // ------------------------------------------------------------- começar uma fase
  comecar(i) {
    const fase = this.fases[i];
    this.faseI = i; this.fase = fase; this.ceu = fase.ceu;
    this.mapa = fase.linhas.map((l) => [...l]);
    this.L = this.mapa[0].length;
    this.pontesLigadas = new Set();
    this.pilhas = []; this.esporos = []; this.vagas = []; this.interruptores = []; this.nuvens = [];
    this.tinkas = []; this.martelos = []; this.cactos = []; this.yamasks = []; this.fogos = [];
    this.octis = []; this.tintas = []; this.lickis = []; this.lingua = 0;
    this.chefes = []; this.pedras = []; this.itens = []; this.bolasFogo = []; this.avisouChefe = false;
    this.faiscas = [];
    this.chave = null; this.temChave = false; this.porta = null; this.portaAberta = false;
    this.torre = null; this.inicio = null;
    let vi = 0;
    this.mapa.forEach((l, y) => l.forEach((ch, x) => {
      const px = x * T, py = y * T;
      if (ch === "P") this.pilhas.push({ x: px + 5, y: py + 5, pega: false });
      if (ch === "e") this.esporos.push({ x0: px, x: px, y: this.chaoAbaixo(x, y) - EH, dir: -1, vivo: true, solta: 1 + Math.random(), quica: 0 });
      if (ch === "v") this.vagas.push({ x: px + 3, y: py + 4, falas: fase.falas[vi++ % fase.falas.length], aceso: false });
      if (ch === "S") this.interruptores.push({ x: px, y: py, ligado: false, ponte: null });
      if (ch === "t") this.tinkas.push({ x0: px, x: px, base: this.chaoAbaixo(x, y), off: 0, vy: 0, dir: -1, anda: 1, vivo: true, pulo: 1 + Math.random(), joga: 1.2 + Math.random() });
      if (ch === "c") this.cactos.push({ x0: px, x: px, base: this.chaoAbaixo(x, y), n: 3, dir: -1, vivo: true });
      if (ch === "y") this.yamasks.push({ cx: px + 8, cy: py + 8, x: px + 1, y: py, susto: 0 });
      if (ch === "O") this.octis.push({ x: px - 4, base: this.chaoAbaixo(x, y), vida: 3, inv: 0, dir: -1, cospe: 1.5, vivo: true });
      if (ch === "G") this.chefes.push({ tipo: "garchomp", x: px - 12, base: this.chaoAbaixo(x, y), off: 0, vy: 0, vida: GVIDA, max: GVIDA, w: GW, h: GH, inv: 0, dir: -1, acao: "anda", tempo: 1.5, vivo: true });
      if (ch === "g") this.chefes.push({ tipo: "gible", x: px, base: this.chaoAbaixo(x, y), off: 0, vy: 0, vida: JVIDA, max: JVIDA, w: JW, h: JH, inv: 0, dir: -1, acao: "anda", tempo: 1, vivo: true });
      if (ch === "L") this.lickis.push({ x: px, base: this.chaoAbaixo(x, y), dir: 1, livre: true, foge: 0 });
      if (ch === "f") this.fogos.push({ x: px + 8, fase: Math.random() * 2.6 });
      if (ch === "K") this.chave = { x: px + 4, y: py + 5 };
      if (ch === "D") { this.porta ||= { x: px, y: py, tx: x, linhas: [] }; this.porta.linhas.push(y); this.porta.y = Math.min(this.porta.y, py); }
      if (ch === "F" && !this.torre) this.torre = { x: px, y: py, base: this.chaoAbaixo(x, y) };
      if (ch === "@" && !this.inicio) this.inicio = { x: px + 1, y: this.chaoAbaixo(x, y) - PH };
      if ("PevStcyfKF@OLGg".includes(ch)) l[x] = ".";
    }));
    this.inicio ||= { x: 17, y: 8 * T - PH };
    // cada interruptor liga a ponte logo depois dele
    for (const s of this.interruptores) {
      const cx = Math.floor(s.x / T);
      for (let x = cx; x < this.L; x++) if (this.mapa[8][x] === "b") { s.ponte = x; break; }
    }
    this.total = this.pilhas.length;
    this.pegou = 0;
    this.check = { ...this.inicio };
    this.vidas = 3;
    this.p = { x: this.inicio.x, y: this.inicio.y, vx: 0, vy: 0, chao: false, pulos: 0, dir: 1, inv: 0, lento: 0, segura: 0, soco: 0, eletrico: false, montado: null, poder: null, estrela: 0 };
    this.cam = 0;
    this.modo = "jogo"; this.fim = false; this.jogando = false;
    const num = fase.dele ? "A FASE DO CAIO" : `FASE ${i + 1}`;
    this.dlg.say([`${num}: ${fase.nome}!`, "← → ANDA, Z PULA (DUAS VEZES NO AR), X SOCA. SEGURA X PRO SOCO ELÉTRICO! C VOLTA PRO MENU."],
      () => { this.jogando = true; });
  }

  /** o topo do chão (ou tábua) logo abaixo do tile (tx, ty) — onde o bicho pisa */
  chaoAbaixo(tx, ty) {
    for (let y = ty + 1; y < ALT; y++) {
      const ch = this.mapa[y]?.[tx];
      if (ch === "#" || ch === "=" || ch === "o" || ch === "b") return y * T;
    }
    return 8 * T;
  }

  // ------------------------------------------------------------- colisão
  solido(tx, ty) {
    if (tx < 0) return true;
    if (tx >= this.L || ty < 0) return false;
    if (ty >= this.mapa.length) return false;
    const ch = this.mapa[ty][tx];
    if (ch === "#") return true;
    if (ch === "b") return this.pontesLigadas.has(tx);
    if (ch === "D") return !this.portaAberta;
    if (ch === "u" || BLOCOS[ch]) return true;
    return false;
  }
  /** tábua e vitória-régia: só seguram quem cai de cima */
  plataforma(tx, ty) { const ch = this.mapa[ty]?.[tx]; return ch === "=" || ch === "o"; }

  moverPersonagem(dt) {
    const p = this.p, LW = PW, LH = PH;
    p.x += p.vx * dt;
    const t0 = Math.floor(p.y / T), t1 = Math.floor((p.y + LH - 1) / T);
    if (p.vx > 0) { const tx = Math.floor((p.x + LW) / T); for (let ty = t0; ty <= t1; ty++) if (this.solido(tx, ty)) { p.x = tx * T - LW - 0.01; p.vx = 0; } }
    if (p.vx < 0) { const tx = Math.floor(p.x / T); for (let ty = t0; ty <= t1; ty++) if (this.solido(tx, ty)) { p.x = (tx + 1) * T; p.vx = 0; } }
    const antesPe = p.y + LH;
    p.vy = Math.min(320, p.vy + GRAV * dt);
    p.y += p.vy * dt;
    p.chao = false;
    const a0 = Math.floor((p.x + 1) / T), a1 = Math.floor((p.x + LW - 1) / T);
    if (p.vy > 0) {
      const ty = Math.floor((p.y + LH) / T);
      for (let tx = a0; tx <= a1; tx++) {
        const pisa = this.solido(tx, ty) || (this.plataforma(tx, ty) && antesPe <= ty * T + 1);
        if (pisa) { p.y = ty * T - LH; p.vy = 0; p.chao = true; p.pulos = 0; break; }
      }
    }
    // de carona nas BOLAS DE TINTA do OCTILLERY
    if (!p.chao && p.vy >= 0) for (const b of this.tintas) {
      if (p.x + PW - 2 < b.x || p.x + 2 > b.x + 10) continue;
      if (antesPe <= b.y + 2 && p.y + LH >= b.y) { p.y = b.y - LH; p.vy = 0; p.chao = true; p.pulos = 0; p.x += b.vx * dt; break; }
    }
    if (p.vy < 0) {
      const ty = Math.floor(p.y / T);
      for (let tx = a0; tx <= a1; tx++) if (this.solido(tx, ty)) {
        p.y = (ty + 1) * T; p.vy = 0;
        // bateu a cabeça num bloco "?": sai o POWER-UP (o bloco do meio da cabeça ganha)
        const meio = Math.floor((p.x + PW / 2) / T);
        const bx = BLOCOS[this.mapa[ty]?.[meio]] ? meio : tx;
        if (BLOCOS[this.mapa[ty]?.[bx]]) this.abrirBloco(bx, ty);
        else Audio2.bump();
        break;
      }
    }
  }
  corpo() { return { x: this.p.x, y: this.p.y, w: PW, h: PH }; }
  /** caiu em cima? (descendo, com os pés perto do topo do bicho) */
  pisou(topo) { const p = this.p; return p.vy > 0 && p.y + PH - topo < 10; }
  quicar(forca = 1) { const p = this.p; p.vy = -PULO * forca; p.pulos = 1; }

  // ------------------------------------------------------------- update
  update(dt) {
    this.t += dt;
    if (this.fadeDir) {
      this.fadeA = Math.max(0, Math.min(1, this.fadeA + this.fadeDir * dt * 3));
      if (this.fadeDir < 0 && this.fadeA <= 0) this.fadeDir = 0;
      if (this.fadeDir > 0 && this.fadeA >= 1) return void this.game.scenes.pop();
    }
    for (const f of this.faiscas || []) { f.x += f.vx * dt; f.y += f.vy * dt; f.vida -= dt; }
    if (this.faiscas) this.faiscas = this.faiscas.filter((f) => f.vida > 0);
    if (this.dlg.update(dt)) return;
    if (this.modo === "menu") return this.updateMenu();
    for (const n of this.nuvens) n.vida -= dt;
    this.nuvens = this.nuvens.filter((n) => n.vida > 0);
    if (!this.jogando || this.fim) return;
    if (Input.consume("select")) return this.voltarMenu();

    const p = this.p;
    p.inv = Math.max(0, p.inv - dt);
    p.lento = Math.max(0, p.lento - dt);
    p.soco = Math.max(0, p.soco - dt);
    this.lingua = Math.max(0, this.lingua - dt);
    p.estrela = Math.max(0, p.estrela - dt);
    if (p.estrela > 0 && Math.random() < 0.4) this.faisca(p.x + Math.random() * PW, p.y + Math.random() * PH, ["#fff27a", "#ff7ab0", "#7ae8ff"][Math.floor(Math.random() * 3)], 15);
    const vel = ANDA * (p.lento ? 0.5 : 1);
    const quer = (Input.held("right") ? 1 : 0) - (Input.held("left") ? 1 : 0);
    if (p.empurra > 0) { p.empurra -= dt; p.vx = p.empDir * 110; }   // levou golpe: empurrado
    else if (p.soco > 0 && p.eletrico) p.vx = p.dir * 170;        // o SOCO ELÉTRICO dá um tranco pra frente
    else { p.vx = quer * vel; if (quer) p.dir = quer; }
    if (Input.consume("a")) {
      if (p.chao) { p.vy = -PULO; p.pulos = 1; Audio2.tone(520, 0.05, "square", 0.3); }
      else if (p.pulos < 2) { p.vy = -PULO2; p.pulos = 2; Audio2.tone(700, 0.05, "square", 0.3); for (let i = 0; i < 6; i++) this.faisca(p.x + PW / 2, p.y + PH, "#fff27a", 40); }
    }
    if (Input.held("b")) {
      p.segura += dt;
      if (p.segura >= CARGA && Math.random() < 0.5) this.faisca(p.x + PW / 2 + p.dir * 9, p.y + PH / 2, "#fff27a", 18);
    } else if (p.segura > 0) {
      this.socar(p.segura >= CARGA);
      p.segura = 0;
    }
    Input.consume("b");

    // PENA: segurando Z caindo, plana
    if (p.poder === "pena" && !p.chao && p.vy > 40 && Input.held("a")) p.vy = 40;
    this.moverPersonagem(dt);
    this.updateEsporos(dt);
    this.updateTinkas(dt);
    this.updateCactos(dt);
    this.updateYamasks(dt);
    this.updateFogos();
    this.updateOctis(dt);
    this.updateLickis(dt);
    this.updateChefes(dt);
    this.updatePoderes(dt);
    this.updateCoisas();
    if (this.p.y > H + 20) this.machucar(true);
    this.cam = Math.max(0, Math.min(this.L * T - W, p.x - W / 2 + 20));
  }

  updateMenu() {
    const n = this.fases.length;
    if (Input.consume("up")) { this.escolha = (this.escolha + n - 1) % n; Audio2.tone(600, 0.03, "square", 0.2); }
    if (Input.consume("down")) { this.escolha = (this.escolha + 1) % n; Audio2.tone(600, 0.03, "square", 0.2); }
    if (Input.consume("select") || Input.consume("b")) return this.sair();
    if (Input.consume("a")) {
      if (this.aberta(this.escolha)) { Audio2.heal(); this.comecar(this.escolha); }
      else { Audio2.bump(); this.dlg.say("ESSA FASE ESTÁ TRANCADA. PASSA A DE ANTES PRIMEIRO!"); }
    }
  }

  voltarMenu() {
    this.modo = "menu"; this.jogando = false; this.fim = false;
    this.escolha = Math.min(this.escolha, this.fases.length - 1);
  }

  socar(eletrico) {
    const p = this.p;
    if (p.montado && !eletrico) return this.lamber();
    if (p.poder === "fogo" && !eletrico) return this.atirarFogo();
    p.soco = eletrico ? 0.28 : 0.15; p.eletrico = eletrico;
    const alcance = eletrico ? 26 : 14;
    const golpe = { x: p.dir > 0 ? p.x + PW : p.x - alcance, y: p.y + 4, w: alcance, h: PH };
    if (eletrico) { Audio2.tone(180, 0.2, "sawtooth", 0.45); Audio2.noise(0.15, 0.4); for (let i = 0; i < 12; i++) this.faisca(p.x + PW / 2 + p.dir * 12, p.y + PH / 2, i % 2 ? "#fff27a" : "#ffffff", 70); }
    else Audio2.tone(300, 0.04, "square", 0.3);
    for (const e of this.esporos) if (e.vivo && toca(golpe, { x: e.x, y: e.y, w: EW, h: EH })) this.derrubar(e, e.x + EW / 2, e.y + EH / 2, "#e8d870");
    for (const k of this.tinkas) if (k.vivo && toca(golpe, this.caixaTinka(k))) this.derrubar(k, k.x + TW / 2, k.base - TH / 2, "#f07ab0");
    // o martelo no ar: o soco rebate
    this.martelos = this.martelos.filter((m) => {
      if (!toca(golpe, { x: m.x - 4, y: m.y - 4, w: 8, h: 8 })) return true;
      for (let i = 0; i < 5; i++) this.faisca(m.x, m.y, "#f07ab0", 40);
      return false;
    });
    // CACNEA: o soco tira um da pilha; o ELÉTRICO, todos que ele pegar
    for (const c of this.cactos) {
      if (!c.vivo) continue;
      let tirou = 0;
      for (let i = c.n - 1; i >= 0; i--) {
        if (!toca(golpe, { x: c.x, y: c.base - (i + 1) * CH, w: CW, h: CH })) continue;
        if (!eletrico && tirou) break;
        tirou++;
      }
      if (tirou) this.tirarCacnea(c, tirou);
    }
    // o SOCO ELÉTRICO assusta os YAMASK (voltam um pouco)
    if (eletrico) for (const y of this.yamasks) if (toca({ ...golpe, x: golpe.x - 6, w: golpe.w + 12 }, { x: y.x, y: y.y, w: YW, h: YH })) { y.susto = 1.5; Audio2.tone(140, 0.15, "triangle", 0.3); }
    for (const o of this.octis) if (o.vivo && toca(golpe, this.caixaOcti(o))) this.baterOcti(o, eletrico ? 2 : 1);
    for (const c of this.chefes) if (c.vivo && toca(golpe, this.caixaChefe(c))) this.baterChefe(c, eletrico ? 2 : 1);
    this.tintas = this.tintas.filter((b) => !toca(golpe, { x: b.x, y: b.y, w: 10, h: 8 }) || (this.respingo(b), false));
    for (const s of this.interruptores) {
      if (s.ligado || !toca({ ...golpe, w: golpe.w + 4 }, { x: s.x, y: s.y, w: 16, h: 16 })) continue;
      if (!eletrico) { Audio2.bump(); continue; }
      s.ligado = true;
      if (s.ponte != null) for (let x = s.ponte; this.mapa[8][x] === "b"; x++) this.pontesLigadas.add(x);
      Audio2.heal();
      for (let i = 0; i < 16; i++) this.faisca(s.x + 8, s.y + 8, "#fff27a", 60);
    }
  }

  derrubar(bicho, x, y, cor) {
    bicho.vivo = false;
    Audio2.tone(900, 0.06, "square", 0.3);
    for (let i = 0; i < 10; i++) this.faisca(x, y, i % 2 ? cor : "#ffffff", 50);
  }

  tirarCacnea(c, n) {
    c.n = Math.max(0, c.n - n);
    Audio2.tone(760, 0.06, "square", 0.3);
    for (let i = 0; i < 8 * n; i++) this.faisca(c.x + CW / 2, c.base - c.n * CH - 6, i % 2 ? "#6ac04a" : "#f8d040", 50);
    if (!c.n) c.vivo = false;
  }

  /** a LÍNGUA do LICKITUNG: come o que estiver na frente */
  lamber() {
    const p = this.p;
    this.lingua = 0.25;
    Audio2.tone(240, 0.08, "triangle", 0.35); Audio2.tone(480, 0.06, "triangle", 0.25);
    const y = p.y + PH - 12;
    const alvo = { x: p.dir > 0 ? p.x + PW : p.x - LINGUA, y: y - 8, w: LINGUA, h: 16 };
    for (const e of this.esporos) if (e.vivo && toca(alvo, { x: e.x, y: e.y, w: EW, h: EH })) this.derrubar(e, e.x + EW / 2, e.y + EH / 2, "#f890b0");
    for (const k of this.tinkas) if (k.vivo && toca(alvo, this.caixaTinka(k))) this.derrubar(k, k.x + TW / 2, k.base - TH / 2, "#f890b0");
    for (const c of this.cactos) {
      if (!c.vivo) continue;
      for (let i = 0; i < c.n; i++) if (toca(alvo, { x: c.x, y: c.base - (i + 1) * CH, w: CW, h: CH })) { this.tirarCacnea(c, 1); break; }
    }
    for (const o of this.octis) if (o.vivo && toca(alvo, this.caixaOcti(o))) this.baterOcti(o, 1);
    for (const c of this.chefes) if (c.vivo && toca(alvo, this.caixaChefe(c))) this.baterChefe(c, 1);
    this.martelos = this.martelos.filter((m) => !toca(alvo, { x: m.x - 4, y: m.y - 4, w: 8, h: 8 }));
    this.tintas = this.tintas.filter((b) => !toca(alvo, { x: b.x, y: b.y, w: 10, h: 8 }));
  }

  // ------------------------------------------------------------- power-ups
  abrirBloco(tx, ty) {
    const tipo = BLOCOS[this.mapa[ty][tx]];
    this.mapa[ty][tx] = "u";
    Audio2.tone(660, 0.06, "square", 0.35); Audio2.tone(990, 0.08, "square", 0.3);
    // sobe de dentro do bloco; a ESTRELA sai pulando
    this.itens.push({ tipo, x: tx * T + 2, y: ty * T, alvo: ty * T - 12, vx: tipo === "estrela" ? 40 : 0, vy: 0, sobe: true });
  }
  updatePoderes(dt) {
    const p = this.p;
    for (const it of this.itens) {
      if (it.sobe) { it.y -= 30 * dt; if (it.y <= it.alvo) { it.y = it.alvo; it.sobe = false; if (it.vx) it.vy = -150; } continue; }
      if (it.vx) {                                        // a ESTRELA quica pelo chão
        it.vy += GRAV * dt; it.x += it.vx * dt; it.y += it.vy * dt;
        const tx = Math.floor((it.x + 6) / T), ty = Math.floor((it.y + 12) / T);
        if (it.vy > 0 && (this.solido(tx, ty) || this.plataforma(tx, ty))) { it.y = ty * T - 12; it.vy = -170; }
        if (this.solido(Math.floor((it.x + (it.vx > 0 ? 12 : 0)) / T), Math.floor((it.y + 6) / T))) it.vx *= -1;
      }
    }
    this.itens = this.itens.filter((it) => {
      if (it.y > H + 20) return false;
      if (it.sobe || !toca(this.corpo(), { x: it.x, y: it.y, w: 12, h: 12 })) return true;
      this.pegarPoder(it.tipo);
      return false;
    });
    // as BOLAS DE FOGO do PAWMOT: quicam no chão
    for (const b of this.bolasFogo) {
      b.vy += GRAV * dt; b.x += b.vx * dt; b.y += b.vy * dt; b.vida -= dt;
      const tx = Math.floor(b.x / T), ty = Math.floor((b.y + 3) / T);
      if (b.vy > 0 && (this.solido(tx, ty) || this.plataforma(tx, ty))) { b.y = ty * T - 3; b.vy = -130; }
      if (this.solido(Math.floor((b.x + Math.sign(b.vx) * 3) / T), Math.floor(b.y / T))) b.vida = 0;
      const area = { x: b.x - 4, y: b.y - 4, w: 8, h: 8 };
      let bateu = false;
      for (const e of this.esporos) if (e.vivo && toca(area, { x: e.x, y: e.y, w: EW, h: EH })) { this.derrubar(e, e.x + EW / 2, e.y + EH / 2, "#f8a020"); bateu = true; }
      for (const k of this.tinkas) if (k.vivo && toca(area, this.caixaTinka(k))) { this.derrubar(k, k.x + TW / 2, k.base - TH / 2, "#f8a020"); bateu = true; }
      for (const c of this.cactos) if (c.vivo && toca(area, { x: c.x, y: c.base - c.n * CH, w: CW, h: c.n * CH })) { this.tirarCacnea(c, 1); bateu = true; }
      for (const o of this.octis) if (o.vivo && toca(area, this.caixaOcti(o))) { this.baterOcti(o, 1); bateu = true; }
      for (const c of this.chefes) if (c.vivo && toca(area, this.caixaChefe(c))) { this.baterChefe(c, 1); bateu = true; }
      if (bateu) b.vida = 0;
    }
    this.bolasFogo = this.bolasFogo.filter((b) => b.vida > 0 && b.y < H + 10);
    // ESTRELA: quem encosta em você cai
    if (p.estrela > 0) {
      const eu = this.corpo();
      for (const e of this.esporos) if (e.vivo && toca(eu, { x: e.x, y: e.y, w: EW, h: EH })) this.derrubar(e, e.x + EW / 2, e.y + EH / 2, "#fff27a");
      for (const k of this.tinkas) if (k.vivo && toca(eu, this.caixaTinka(k))) this.derrubar(k, k.x + TW / 2, k.base - TH / 2, "#fff27a");
      for (const c of this.cactos) if (c.vivo && toca(eu, { x: c.x, y: c.base - c.n * CH, w: CW, h: c.n * CH })) this.tirarCacnea(c, c.n);
      for (const o of this.octis) if (o.vivo && toca(eu, this.caixaOcti(o))) this.baterOcti(o, 1);
      for (const c of this.chefes) if (c.vivo && toca(eu, this.caixaChefe(c))) this.baterChefe(c, 1);
    }
  }
  pegarPoder(tipo) {
    const p = this.p;
    Audio2.heal();
    for (let i = 0; i < 14; i++) this.faisca(p.x + PW / 2, p.y + PH / 2, ["#fff27a", "#ffffff", "#f8a020"][i % 3], 60);
    if (tipo === "estrela") p.estrela = ESTRELA_S;
    else if (tipo === "baga") { if (!p.poder) p.poder = "grande"; }
    else p.poder = tipo;
    this.avisoPoder = { texto: NOME_PODER[tipo] + "!", t: 1.6 };
  }
  atirarFogo() {
    const p = this.p;
    if (this.bolasFogo.length >= 2) return;
    this.bolasFogo.push({ x: p.x + PW / 2 + p.dir * 10, y: p.y + PH / 2, vx: p.dir * 150, vy: 40, vida: 1.6 });
    Audio2.tone(500, 0.05, "sawtooth", 0.3);
    p.soco = 0.1; p.eletrico = false;
  }

  // ------------------------------------------------------------- os chefões
  caixaChefe(c) { return { x: c.x, y: c.base + c.off - c.h, w: c.w, h: c.h }; }
  baterChefe(c, dano) {
    if (c.inv > 0 || !c.vivo) return;
    if (c.tipo === "gible" && c.acao === "gira") { Audio2.bump(); return; }   // girando, nada pega
    c.vida -= dano; c.inv = 0.6;
    if (c.acao === "investida" || c.acao === "prepara") { c.acao = "anda"; c.tempo = 1.2; }   // apanhou: para a investida
    // e RECUA (dá tempo de socar de novo sem ele te atropelar)
    const longe = c.x + c.w / 2 < this.p.x + PW / 2 ? -1 : 1, dir = c.dir;
    for (let i = 0; i < 4; i++) this.andarChefe(c, longe * 5);
    c.dir = dir;
    Audio2.tone(150, 0.12, "square", 0.4);
    for (let i = 0; i < 10; i++) this.faisca(c.x + c.w / 2, c.base + c.off - c.h / 2, i % 2 ? "#4a6ad8" : "#ffffff", 60);
    if (c.vida <= 0) {
      c.vivo = false;
      Audio2.heal(); Audio2.noise?.(0.4, 0.4);
      for (let i = 0; i < 40; i++) this.faisca(c.x + c.w / 2, c.base - c.h / 2, ["#4a6ad8", "#f8d040", "#ffffff", "#e8503a"][i % 4], 110);
      this.dlg.say(c.tipo === "garchomp" ? ["O GARCHOMP FOI DERROTADO!", "AGORA A TORRE PODE ACENDER!"] : "O GIBLE FOI DERROTADO!");
    }
  }
  updateChefes(dt) {
    const p = this.p;
    for (const c of this.chefes) {
      if (!c.vivo) continue;
      c.inv = Math.max(0, c.inv - dt);
      if (Math.abs(p.x - c.x) > 220 && c.acao === "anda") continue;      // longe: espera você
      const g = c.tipo === "garchomp";
      c.tempo -= dt;
      if (c.acao === "anda") {
        c.dir = p.x + PW / 2 < c.x + c.w / 2 ? -1 : 1;
        this.andarChefe(c, c.dir * (g ? 28 : 34) * dt);
        if (c.tempo <= 0 && c.off === 0) {
          const sorte = Math.random();
          if (g) {
            if (sorte < 0.5) { c.acao = "pula"; c.vy = -300; Audio2.tone(200, 0.1, "square", 0.35); }
            else { c.acao = "prepara"; c.tempo = 0.6; Audio2.tone(120, 0.3, "sawtooth", 0.35); }
          } else {
            if (sorte < 0.5) { c.vy = -220; c.acao = "pula"; }
            else { c.acao = "gira"; c.tempo = 1.2; Audio2.tone(700, 0.2, "triangle", 0.3); }
          }
        }
      } else if (c.acao === "prepara") {                  // GARCHOMP treme antes da INVESTIDA
        if (c.tempo <= 0) { c.acao = "investida"; c.tempo = 1.1; Audio2.noise?.(0.2, 0.3); }
      } else if (c.acao === "investida") {
        if (!this.andarChefe(c, c.dir * 190 * dt)) c.tempo = 0;
        if (Math.random() < 0.5) this.faisca(c.x + c.w / 2 - c.dir * 20, c.base - 4, "#c8b890", 30);
        if (c.tempo <= 0) { c.acao = "anda"; c.tempo = 1.4 + Math.random(); }
      } else if (c.acao === "gira") {                     // GIBLE girando atrás de você
        this.andarChefe(c, c.dir * 120 * dt);
        if (c.tempo <= 0) { c.acao = "anda"; c.tempo = 1 + Math.random(); }
      }
      // gravidade (o pulo é um "off" em cima do chão dele)
      if (c.vy || c.off < 0) {
        c.vy += GRAV * dt; c.off = Math.min(0, c.off + c.vy * dt);
        if (c.acao === "pula" && g) c.x += c.dir * 50 * dt;
        if (c.off === 0) {
          c.vy = 0;
          if (c.acao === "pula") {
            c.acao = "anda"; c.tempo = 1.2 + Math.random();
            if (g) {                                     // o TREMOR: pedras correndo pros dois lados
              Audio2.noise?.(0.3, 0.5); Audio2.tone(70, 0.3, "sawtooth", 0.45);
              this.tremor = 0.4;
              for (const d of [-1, 1]) this.pedras.push({ x: c.x + c.w / 2, y: c.base - 8, vx: d * 110, vida: 2.2 });
            }
          }
        }
      }
      const cx = this.caixaChefe(c);
      // piscando (acabou de apanhar) ele não machuca
      if (toca(this.corpo(), cx) && p.estrela <= 0 && c.inv <= 0) {
        if (this.pisou(cx.y) && c.acao !== "gira") { this.quicar(1.1); this.baterChefe(c, 1); }
        else this.machucar(false, c.x + c.w / 2);
      }
    }
    for (const r of this.pedras) { r.x += r.vx * dt; r.vida -= dt; }
    this.pedras = this.pedras.filter((r) => {
      if (r.vida <= 0) return false;
      if (toca(this.corpo(), { x: r.x - 5, y: r.y, w: 10, h: 8 })) { this.machucar(false); return false; }
      return true;
    });
    this.tremor = Math.max(0, (this.tremor || 0) - dt);
  }
  /** anda o chefão sem cair do chão dele nem entrar em parede; false se travou */
  andarChefe(c, dx) {
    const nx = c.x + dx, borda = dx > 0 ? nx + c.w : nx;
    const tx = Math.floor(borda / T), tyPe = Math.floor(c.base / T), tyCorpo = Math.floor((c.base - 4) / T);
    const temChao = this.solido(tx, tyPe) || this.plataforma(tx, tyPe);
    if (!temChao || this.solido(tx, tyCorpo)) { c.dir *= -1; return false; }
    c.x = nx;
    return true;
  }

  caixaOcti(o) { return { x: o.x, y: o.base - OH, w: OW, h: OH }; }
  baterOcti(o, dano) {
    if (o.inv > 0) return;
    o.vida -= dano; o.inv = 0.5;
    Audio2.tone(200, 0.1, "square", 0.35);
    for (let i = 0; i < 8; i++) this.faisca(o.x + OW / 2, o.base - OH / 2, i % 2 ? "#e8503a" : "#ffffff", 50);
    if (o.vida <= 0) {
      o.vivo = false; Audio2.heal();
      for (let i = 0; i < 24; i++) this.faisca(o.x + OW / 2, o.base - OH / 2, i % 2 ? "#e8503a" : "#f8d040", 80);
    }
  }
  respingo(b) { for (let i = 0; i < 6; i++) this.faisca(b.x + 5, b.y + 4, "#3a3050", 40); }

  updateOctis(dt) {
    const p = this.p;
    for (const o of this.octis) {
      if (!o.vivo) continue;
      o.inv = Math.max(0, o.inv - dt);
      o.dir = p.x < o.x ? -1 : 1;
      if (Math.abs(p.x - o.x) < 170) {
        o.cospe -= dt;
        if (o.cospe <= 0) {
          o.cospe = 2 + Math.random() * 0.8;
          this.tintas.push({ x: o.x + OW / 2 - 5 + o.dir * 12, y: o.base - 14, vx: o.dir * 55, vida: 5 });
          Audio2.tone(160, 0.1, "triangle", 0.35);
        }
      }
      const cx = this.caixaOcti(o);
      if (toca(this.corpo(), cx)) {
        if (this.pisou(cx.y)) this.quicar(1);              // na cabeça: seguro, só quica
        else this.machucar(false);
      }
    }
    for (const b of this.tintas) { b.x += b.vx * dt; b.vida -= dt; }
    this.tintas = this.tintas.filter((b) => {
      if (b.vida <= 0 || this.solido(Math.floor((b.x + (b.vx > 0 ? 10 : 0)) / T), Math.floor((b.y + 4) / T))) { this.respingo(b); return false; }
      // encostou de lado (sem estar em cima dela): machuca
      if (toca(this.corpo(), { x: b.x + 1, y: b.y + 3, w: 8, h: 5 }) && p.y + PH > b.y + 3) { this.machucar(false); this.respingo(b); return false; }
      return true;
    });
  }

  updateLickis(dt) {
    const p = this.p;
    for (const l of this.lickis) {
      if (l.foge > 0) {                                  // fugindo depois que você caiu dele
        l.foge -= dt; l.x += l.dir * 110 * dt;
        if (l.foge <= 0) { l.livre = true; l.base = 8 * T; }
        continue;
      }
      if (!l.livre) continue;
      l.dir = p.x < l.x ? -1 : 1;
      if (!p.montado && p.inv <= 0 && toca(this.corpo(), { x: l.x + 2, y: l.base - 20, w: 20, h: 20 })) {
        l.livre = false; p.montado = l;
        Audio2.tone(330, 0.08, "triangle", 0.4); Audio2.tone(660, 0.1, "triangle", 0.35);
        for (let i = 0; i < 10; i++) this.faisca(p.x + PW / 2, p.y + PH, "#f8a0c0", 50);
      }
    }
  }

  updateEsporos(dt) {
    const p = this.p;
    for (const e of this.esporos) {
      if (!e.vivo) continue;
      e.x += e.dir * 14 * dt;
      if (Math.abs(e.x - e.x0) > 22) e.dir *= -1;
      e.quica = Math.max(0, e.quica - dt);
      e.solta -= dt;
      if (e.solta <= 0 && Math.abs(e.x - p.x) < 60) {
        e.solta = 2.4;
        this.nuvens.push({ x: e.x + EW / 2, y: e.y + 2, vida: 1.6 });
        Audio2.tone(240, 0.08, "triangle", 0.25);
      }
      if (toca(this.corpo(), { x: e.x + 2, y: e.y, w: EW - 4, h: EH })) {
        if (this.pisou(e.y)) { this.quicar(1.15); e.quica = 0.2; Audio2.tone(880, 0.06, "triangle", 0.4); }
        else this.machucar(false);
      }
    }
    for (const n of this.nuvens) {
      const r = 6 + (1.6 - n.vida) * 8;
      if (Math.hypot(p.x + PW / 2 - n.x, p.y + PH / 2 - n.y) < r + 4) p.lento = 1.2;
    }
  }

  caixaTinka(k) { return { x: k.x, y: k.base + k.off - TH, w: TW, h: TH }; }
  updateTinkas(dt) {
    const p = this.p;
    for (const k of this.tinkas) {
      if (!k.vivo) continue;
      const perto = Math.abs(p.x - k.x) < 150;
      k.dir = p.x < k.x ? -1 : 1;                       // sempre olhando pra você
      k.x += k.anda * 10 * dt;
      if (Math.abs(k.x - k.x0) > 14) k.anda *= -1;
      // pulinho
      k.pulo -= dt;
      if (k.pulo <= 0 && k.off === 0) { k.vy = -150; k.pulo = 1.4 + Math.random(); }
      if (k.vy || k.off) { k.vy += GRAV * dt; k.off = Math.min(0, k.off + k.vy * dt); if (k.off === 0) k.vy = 0; }
      // o MARTELO, em arco, na sua direção
      if (perto) {
        k.joga -= dt;
        if (k.joga <= 0) {
          k.joga = 1.3 + Math.random() * 0.9;
          this.martelos.push({ x: k.x + TW / 2, y: k.base + k.off - TH, vx: k.dir * (45 + Math.random() * 35), vy: -200, ang: 0 });
          Audio2.tone(420, 0.05, "square", 0.25);
        }
      }
      const cx = this.caixaTinka(k);
      if (toca(this.corpo(), cx)) {
        if (this.pisou(cx.y)) { this.quicar(1.05); this.derrubar(k, k.x + TW / 2, cx.y + TH / 2, "#f07ab0"); }
        else this.machucar(false);
      }
    }
    for (const m of this.martelos) { m.vy += GRAV * 0.8 * dt; m.x += m.vx * dt; m.y += m.vy * dt; m.ang += dt * 12 * Math.sign(m.vx || 1); }
    this.martelos = this.martelos.filter((m) => {
      if (m.y > H + 20) return false;
      if (toca(this.corpo(), { x: m.x - 3, y: m.y - 3, w: 6, h: 6 })) { this.machucar(false); return false; }
      return true;
    });
  }

  updateCactos(dt) {
    for (const c of this.cactos) {
      if (!c.vivo) continue;
      c.x += c.dir * 10 * dt;
      if (Math.abs(c.x - c.x0) > 20) c.dir *= -1;
      const topo = c.base - c.n * CH;
      if (toca(this.corpo(), { x: c.x + 1, y: topo, w: CW - 2, h: c.n * CH })) {
        if (this.pisou(topo)) { this.quicar(1); this.tirarCacnea(c, 1); }
        else this.machucar(false);
      }
    }
  }

  updateYamasks(dt) {
    const p = this.p;
    for (const y of this.yamasks) {
      y.susto = Math.max(0, y.susto - dt);
      if (!this.temChave) {                              // dormindo: só balança no lugar
        y.x = y.cx - YW / 2; y.y = y.cy - YH / 2 + Math.sin(this.t * 2 + y.cx) * 2;
        continue;
      }
      // acordado: vem atrás de você, atravessando parede (mais devagar que você)
      const alvoX = p.x + PW / 2, alvoY = p.y + PH / 2;
      const dx = alvoX - (y.x + YW / 2), dy = alvoY - (y.y + YH / 2), d = Math.hypot(dx, dy) || 1;
      const v = y.susto ? -55 : 46;
      y.x += (dx / d) * v * dt;
      y.y += (dy / d) * v * dt + Math.sin(this.t * 4 + y.cx) * 0.3;
      if (toca(this.corpo(), { x: y.x + 2, y: y.y + 2, w: YW - 4, h: YH - 4 })) this.machucar(false);
    }
  }

  /** as BOLAS DE FOGO pulam do buraco a cada 2,6 s */
  fogoY(f) {
    const ph = (this.t + f.fase) % 2.6;
    if (ph > 1.6) return null;
    const s = ph / 1.6;
    return H + 10 - (H + 10 - 56) * 4 * s * (1 - s);
  }
  updateFogos() {
    for (const f of this.fogos) {
      const y = this.fogoY(f);
      if (y != null && toca(this.corpo(), { x: f.x - 4, y: y - 4, w: 8, h: 8 })) this.machucar(false);
    }
  }

  updateCoisas() {
    const p = this.p;
    for (const k of this.pilhas) {
      if (k.pega || Math.abs(p.x + PW / 2 - (k.x + 3)) > 10 || Math.abs(p.y + PH / 2 - (k.y + 3)) > 16) continue;
      k.pega = true; this.pegou++;
      Audio2.tone(1046, 0.06, "square", 0.35); Audio2.tone(1568, 0.08, "square", 0.3);
      for (let i = 0; i < 8; i++) this.faisca(k.x + 3, k.y + 3, "#3ec46a", 40);
    }
    // a CHAVE: pegou, os YAMASK acordam
    if (this.chave && !this.temChave && toca(this.corpo(), { x: this.chave.x, y: this.chave.y, w: 8, h: 5 })) {
      this.temChave = true;
      Audio2.tone(1318, 0.08, "square", 0.35); Audio2.tone(988, 0.12, "square", 0.3);
      this.dlg.say(this.yamasks.length ? ["VOCÊ PEGOU A CHAVE!", "...OS YAMASK ACORDARAM! CORRE PRA PORTA!"] : "VOCÊ PEGOU A CHAVE!");
    }
    // a PORTA: encostou com a chave, abre; os YAMASK somem
    if (this.porta && !this.portaAberta && this.temChave && Math.abs((p.dir > 0 ? p.x + PW : p.x) - (this.porta.x + (p.dir > 0 ? 0 : T))) < 4) {
      this.portaAberta = true;
      Audio2.heal();
      for (const y of this.yamasks) for (let i = 0; i < 10; i++) this.faisca(y.x + YW / 2, y.y + YH / 2, i % 2 ? "#3a3040" : "#c84a4a", 50);
      this.yamasks = [];
      for (let i = 0; i < 16; i++) this.faisca(this.porta.x + 8, this.porta.y + 16, "#f8d040", 60);
    }
    for (const v of this.vagas) {
      if (v.aceso || Math.abs(p.x - v.x) > 14) continue;
      v.aceso = true;
      this.check = { x: v.x, y: v.y + 12 - PH };
      this.dlg.say(v.falas);
    }
    if (this.torre && p.x > this.torre.x - 4) {
      if (this.chefes.some((c) => c.vivo && c.tipo === "garchomp")) {
        if (!this.avisouChefe) { this.avisouChefe = true; this.dlg.say("A TORRE NÃO ACENDE! DERROTA O GARCHOMP PRIMEIRO!"); }
      } else this.chegou();
    }
  }

  /** `deX`: de onde veio o golpe — você é EMPURRADO pro outro lado (sem isso
   *  você ficava grudado no GARCHOMP e perdia as vidas todas de uma vez) */
  machucar(caiu, deX = null) {
    const p = this.p;
    if (!caiu && (p.inv > 0 || p.estrela > 0)) return;
    if (!caiu) {
      p.empDir = deX == null ? -p.dir : (p.x + PW / 2 < deX ? -1 : 1);
      p.empurra = 0.3;
    }
    // com POWER-UP: perde o poder, não a vida
    if (!caiu && p.poder && !p.montado) {
      p.poder = p.poder === "grande" ? null : "grande";
      Audio2.tone(400, 0.2, "sawtooth", 0.3);
      p.inv = 1.4; p.vy = -140;
      return;
    }
    // montado: quem se machuca é a montaria — você cai e o LICKITUNG foge
    if (p.montado && !caiu) {
      const l = p.montado; p.montado = null;
      Object.assign(l, { x: p.x, base: p.y + PH, dir: p.dir < 0 ? 1 : -1, foge: 1.6 });
      Audio2.tone(300, 0.15, "sawtooth", 0.3);
      p.inv = 1.2; p.vy = -150;
      return;
    }
    this.vidas--;
    Audio2.hit?.();
    if (this.vidas <= 0) {
      this.vidas = 3;
      return this.voltar("AS VIDAS ACABARAM... DE VOLTA PRA ÚLTIMA LANTERNA!");
    }
    if (caiu) return this.voltar(null);
    p.inv = 1.4; p.vy = -140;
  }

  voltar(msg) {
    const p = this.p;
    if (p.montado) { Object.assign(p.montado, { livre: true, x: this.check.x + 20, base: this.check.y + PH }); p.montado = null; }
    Object.assign(p, { x: this.check.x, y: this.check.y, vx: 0, vy: 0, inv: 1.2, segura: 0, soco: 0, poder: null, estrela: 0 });
    this.martelos = []; this.tintas = []; this.pedras = []; this.bolasFogo = [];
    // os chefões param o que estavam fazendo
    // (a vida deles NÃO enche de novo: o que você tirou fica tirado)
    for (const c of this.chefes) if (c.vivo) Object.assign(c, { off: 0, vy: 0, acao: "anda", tempo: 1.5 });
    // os YAMASK voltam pro lugar deles (mas continuam acordados se a chave tá com você)
    for (const y of this.yamasks) { y.x = y.cx - YW / 2; y.y = y.cy - YH / 2; }
    if (msg) this.dlg.say(msg);
  }

  chegou() {
    this.fim = true;
    Audio2.heal();
    const tudo = this.pegou === this.total;
    const i = this.faseI, dele = this.fase.dele;
    if (!dele && this.st) {
      this.st.flags ||= {};
      this.st.flags.pawmotFases = Math.max(this.liberadas(), i + 1);
    }
    const prox = !dele && i + 1 < FASES.length ? `A FASE ${i + 2} (${FASES[i + 1].nome}) DESTRAVOU!` : dele ? "VOCÊ PASSOU A SUA PRÓPRIA FASE!" : "VOCÊ PASSOU TODAS AS FASES! VOCÊ É O SUPER PAWMOT!";
    this.dlg.say([
      "A TORRE ACENDEU!",
      this.total ? `VOCÊ JUNTOU ${this.pegou} DE ${this.total} PILHAS.` + (tudo ? " TODAS! INCRÍVEL!" : " DÁ PRA ACHAR MAIS!") : "MUITO BEM!",
      prox,
    ], () => { this.escolha = Math.min(i + 1, this.fases.length - 1); this.voltarMenu(); });
  }

  sair() { this.jogando = false; this.fadeDir = 1; }

  faisca(x, y, cor, vel) {
    const a = Math.random() * Math.PI * 2, v = vel * (0.4 + Math.random() * 0.6);
    this.faiscas.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vida: 0.25 + Math.random() * 0.25, cor });
  }

  // ------------------------------------------------------------- render
  render(ctx) {
    if (this.modo === "menu") return this.renderMenu(ctx);
    this.renderCeu(ctx);
    const cor = TERRA[this.ceu] || TERRA.floresta;
    ctx.save();
    ctx.translate(-Math.round(this.cam), this.tremor > 0 ? Math.round((Math.random() - 0.5) * 4) : 0);
    const x0 = Math.floor(this.cam / T), x1 = Math.min(this.L, x0 + W / T + 2);
    // a água / a lava nos buracos
    if (cor.liquido) for (let tx = x0; tx < x1; tx++) {
      if (this.mapa[9][tx] === "#") continue;
      const X = tx * T, onda = Math.sin(this.t * 3 + tx) * 1.5;
      ctx.fillStyle = cor.liquido[0]; ctx.fillRect(X, 8 * T + 8 + onda, T, H);
      ctx.fillStyle = cor.liquido[1]; ctx.fillRect(X, 8 * T + 8 + onda, T, 2);
      if (this.ceu === "vulcao" && (tx * 7 + Math.floor(this.t * 3)) % 5 === 0) ctx.fillRect(X + 6, 8 * T + 14, 3, 2);
    }
    for (let ty = 0; ty < this.mapa.length; ty++) for (let tx = x0; tx < x1; tx++) {
      const ch = this.mapa[ty][tx], X = tx * T, Y = ty * T;
      if (ch === "#") {
        const topo = this.mapa[ty - 1]?.[tx] !== "#";
        ctx.fillStyle = cor.terra; ctx.fillRect(X, Y, T, T);
        ctx.fillStyle = cor.pedra; ctx.fillRect(X + 3, Y + 9, 3, 2); ctx.fillRect(X + 10, Y + 4, 2, 2);
        if (this.ceu === "piramide" || this.ceu === "castelo") { ctx.fillStyle = cor.pedra; ctx.fillRect(X, Y + 15, T, 1); ctx.fillRect(X + ((ty % 2) ? 0 : 8), Y, 1, T); }
        if (topo) { ctx.fillStyle = cor.topo; ctx.fillRect(X, Y, T, 4); ctx.fillStyle = cor.brilho; ctx.fillRect(X, Y, T, 1); }
      } else if (ch === "=") {
        ctx.fillStyle = this.ceu === "vulcao" ? "#5a4a4a" : "#a8743a"; ctx.fillRect(X, Y, T, 5);
        ctx.fillStyle = this.ceu === "vulcao" ? "#7a6a6a" : "#c8945a"; ctx.fillRect(X, Y, T, 1);
        ctx.fillStyle = "#3a2a22"; ctx.fillRect(X + 7, Y + 1, 1, 4);
      } else if (ch === "o") {                               // vitória-régia
        const b = Math.sin(this.t * 2 + tx) * 0.8;
        ctx.fillStyle = "#2a8a3a"; ctx.beginPath(); ctx.ellipse(X + 8, Y + 9 + b, 9, 3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#4ac85a"; ctx.beginPath(); ctx.ellipse(X + 8, Y + 8 + b, 8, 2.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#f8a0c8"; ctx.fillRect(X + 10, Y + 6 + b, 2, 2);
      } else if (ch === "b") {
        if (this.pontesLigadas.has(tx)) {
          const brilho = 0.7 + 0.3 * Math.sin(this.t * 8 + tx);
          ctx.fillStyle = `rgba(255,242,122,${brilho})`; ctx.fillRect(X, Y, T, 4);
          ctx.fillStyle = "#ffffff"; ctx.fillRect(X + ((Math.floor(this.t * 20) + tx * 5) % 16), Y + 1, 2, 1);
        } else if (ty === 8) {
          ctx.strokeStyle = "rgba(255,242,122,0.35)"; ctx.setLineDash([2, 2]); ctx.strokeRect(X + 0.5, Y + 0.5, T - 1, 3); ctx.setLineDash([]);
        }
      } else if (BLOCOS[ch] || ch === "u") {                 // bloco "?" (u = já usado)
        const usado = ch === "u", brilha = !usado && Math.floor(this.t * 3) % 2;
        ctx.fillStyle = usado ? "#6a5a4a" : "#d89a2a"; ctx.fillRect(X, Y, T, T);
        ctx.fillStyle = usado ? "#4a3a2a" : "#8a5a1a"; ctx.fillRect(X, Y + 15, T, 1); ctx.fillRect(X + 15, Y, 1, T);
        ctx.fillStyle = usado ? "#7a6a5a" : "#f8d070"; ctx.fillRect(X, Y, T, 1); ctx.fillRect(X, Y, 1, T);
        if (!usado) drawText(ctx, "?", X + 5, Y + 4, brilha ? "#ffffff" : "#5a3a10");
      } else if (ch === "D" && !this.portaAberta) {           // a porta trancada
        ctx.fillStyle = "#5a3418"; ctx.fillRect(X + 1, Y, T - 2, T);
        ctx.fillStyle = "#7a4a22"; ctx.fillRect(X + 3, Y + 2, 4, T - 4); ctx.fillRect(X + 9, Y + 2, 4, T - 4);
        if (ty === this.porta?.linhas[this.porta.linhas.length - 1]) { ctx.fillStyle = "#f8d040"; ctx.fillRect(X + 7, Y + 4, 2, 2); ctx.fillRect(X + 7, Y + 6, 2, 4); }
      }
    }
    // a torre do fim
    if (this.torre) {
      const { x, y, base } = this.torre, acesa = this.fim;
      ctx.fillStyle = "#4a4a5a"; ctx.fillRect(x + 4, y + 8, 8, base - y - 8);
      ctx.fillStyle = "#6a6a7a"; ctx.fillRect(x + 4, y + 8, 2, base - y - 8);
      ctx.fillStyle = acesa ? "#fff27a" : "#2a2a36"; ctx.fillRect(x, y, 16, 9);
      if (acesa) { ctx.fillStyle = "rgba(255,242,122,0.25)"; ctx.beginPath(); ctx.arc(x + 8, y + 4, 22 + Math.sin(this.t * 4) * 3, 0, Math.PI * 2); ctx.fill(); }
    }
    for (const s of this.interruptores) {
      ctx.fillStyle = "#2a3040"; ctx.fillRect(s.x + 3, s.y + 2, 10, 14);
      ctx.fillStyle = s.ligado ? "#fff27a" : "#e8504a"; ctx.fillRect(s.x + 5, s.y + 4, 6, 6);
      ctx.fillStyle = "#9aa8c0"; ctx.fillRect(s.x + 5, s.y + 12, 6, 2);
    }
    for (const v of this.vagas) {
      const by = v.y + Math.sin(this.t * 4 + v.x) * 2;
      ctx.fillStyle = "#3a3040"; ctx.fillRect(v.x + 4, v.y + 6, 2, 22);
      if (v.aceso) { ctx.fillStyle = "rgba(248,232,88,0.3)"; ctx.beginPath(); ctx.arc(v.x + 5, by + 4, 9, 0, Math.PI * 2); ctx.fill(); }
      if (!desenhaMon(ctx, "volbeat", "down", this.t * 1000, v.x + 5, by + 6)) { ctx.fillStyle = "#f8e858"; ctx.fillRect(v.x + 2, by - 2, 6, 6); }
    }
    for (const k of this.pilhas) if (!k.pega) pinta(ctx, PILHA, PILHA_COR, k.x, k.y + Math.sin(this.t * 3 + k.x) * 1.5);
    if (this.chave && !this.temChave) {
      ctx.fillStyle = "rgba(248,208,64,0.25)"; ctx.beginPath(); ctx.arc(this.chave.x + 4, this.chave.y + 2, 7 + Math.sin(this.t * 5), 0, Math.PI * 2); ctx.fill();
      pinta(ctx, CHAVE, CHAVE_COR, this.chave.x, this.chave.y + Math.sin(this.t * 3) * 1.5);
    }
    for (const n of this.nuvens) {
      const r = 6 + (1.6 - n.vida) * 8;
      ctx.fillStyle = `rgba(200,190,120,${Math.min(0.5, n.vida * 0.4)})`;
      ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.fill();
    }
    for (const e of this.esporos) {
      if (!e.vivo) continue;
      const amassa = e.quica ? 2 : 0;
      if (!desenhaMon(ctx, "shroomish", e.dir < 0 ? "left" : "right", this.t * 1000 + e.x0 * 7, e.x + EW / 2, e.y + EH + amassa)) {
        ctx.fillStyle = "#c8b870"; ctx.fillRect(e.x + 2, e.y + 4, EW - 4, EH - 4);
      }
    }
    for (const k of this.tinkas) {
      if (!k.vivo) continue;
      const ms = k.off ? 120 : this.t * 1000 + k.x0;
      if (!desenhaMon(ctx, "tinkatuff", k.dir < 0 ? "left" : "right", ms, k.x + TW / 2, k.base + k.off)) {
        ctx.fillStyle = "#f07ab0"; ctx.fillRect(k.x, k.base + k.off - TH, TW, TH);
      }
    }
    for (const c of this.cactos) {
      if (!c.vivo) continue;
      for (let i = 0; i < c.n; i++) {
        const bx = c.x + CW / 2 + Math.sin(this.t * 3 + i * 0.9) * 2, pe = c.base - i * CH;
        if (!desenhaMon(ctx, "cacnea", "down", this.t * 1000 + i * 230, bx, pe)) { ctx.fillStyle = "#6ac04a"; ctx.fillRect(bx - 7, pe - CH, 14, CH); }
      }
    }
    for (const m of this.martelos) {
      ctx.save(); ctx.translate(Math.round(m.x), Math.round(m.y)); ctx.rotate(m.ang);
      pinta(ctx, MARTELO, MARTELO_COR, -3, -3);
      ctx.restore();
    }
    for (const f of this.fogos) {
      const y = this.fogoY(f);
      if (y == null) continue;
      ctx.fillStyle = "rgba(248,160,32,0.5)"; ctx.beginPath(); ctx.arc(f.x, y + 4, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#e8402a"; ctx.beginPath(); ctx.arc(f.x, y, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#f8d040"; ctx.beginPath(); ctx.arc(f.x, y - 1, 2.5, 0, Math.PI * 2); ctx.fill();
    }
    for (const it of this.itens) {
      if (it.sobe) { ctx.save(); ctx.beginPath(); ctx.rect(it.x - 4, it.alvo - 4, 20, it.alvo + 16 - (it.alvo - 4) - 4); ctx.clip(); }
      desenhaItem(ctx, it.tipo, it.x, it.y + (it.vx ? 0 : Math.sin(this.t * 4) * 1));
      if (it.sobe) ctx.restore();
    }
    for (const b of this.bolasFogo) {
      ctx.fillStyle = "#e8402a"; ctx.beginPath(); ctx.arc(b.x, b.y, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#f8d040"; ctx.fillRect(Math.round(b.x) - 1, Math.round(b.y) - 1, 2, 2);
    }
    for (const r of this.pedras) {
      ctx.fillStyle = "#8a7a6a"; ctx.fillRect(Math.round(r.x) - 5, r.y + 2, 10, 6);
      ctx.fillStyle = "#b8a890"; ctx.fillRect(Math.round(r.x) - 3, r.y, 6, 3);
    }
    for (const c of this.chefes) {
      if (!c.vivo || (c.inv > 0 && Math.floor(this.t * 20) % 2)) continue;
      const g = c.tipo === "garchomp", lado = c.dir < 0 ? "left" : "right";
      const treme = c.acao === "prepara" ? (Math.random() - 0.5) * 3 : 0;
      const ms = c.acao === "gira" ? this.t * 4000 : c.off ? 100 : this.t * (c.acao === "investida" ? 3000 : 1000);
      const cx = c.x + c.w / 2 + treme, pe = c.base + c.off;
      if (c.acao === "gira") {                             // GIBLE girando: vira pros lados bem rápido
        const lados = ["down", "right", "up", "left"];
        desenhaMon(ctx, "gible", lados[Math.floor(this.t * 16) % 4], 0, cx, pe);
      } else if (!desenhaMon(ctx, g ? "garchomp" : "gible", lado, ms, cx, pe, false, g ? 1.6 : 1)) {
        ctx.fillStyle = "#4a6ad8"; ctx.fillRect(c.x, pe - c.h, c.w, c.h);
      }
    }
    for (const o of this.octis) {
      if (!o.vivo || (o.inv > 0 && Math.floor(this.t * 20) % 2)) continue;
      if (!desenhaMon(ctx, "octillery", o.dir < 0 ? "left" : "right", this.t * 600, o.x + OW / 2, o.base)) { ctx.fillStyle = "#e8503a"; ctx.fillRect(o.x, o.base - OH, OW, OH); }
    }
    for (const b of this.tintas) {
      ctx.fillStyle = "#2a2238"; ctx.beginPath(); ctx.ellipse(b.x + 5, b.y + 4, 6, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#6a5a8a"; ctx.fillRect(b.x + 3, b.y + 1, 3, 1);
    }
    for (const l of this.lickis) {
      if (!l.livre && !(l.foge > 0)) continue;
      if (!desenhaMon(ctx, "lickitung", l.dir < 0 ? "left" : "right", l.foge > 0 ? this.t * 2000 : 0, l.x + 12, l.base)) { ctx.fillStyle = "#f8a0c0"; ctx.fillRect(l.x, l.base - 20, 24, 20); }
    }
    // o herói (pisca quando machucado)
    const p = this.p;
    if (!(p.inv > 0 && Math.floor(this.t * 15) % 2)) {
      const anda = p.chao && Math.abs(p.vx) > 1;
      const ms = anda ? this.t * 1000 * (p.lento ? 0.5 : 1) : p.chao ? 0 : 150;
      const lado = p.dir < 0 ? "left" : "right";
      // montado no LICKITUNG: ele embaixo, o PAWMOT parado em cima
      let pe = p.y + PH;
      if (p.montado) {
        if (this.lingua > 0) {                            // a língua esticando
          const k = 1 - Math.abs(this.lingua / 0.25 * 2 - 1), comp = LINGUA * k, ly = p.y + PH - 12;
          ctx.fillStyle = "#e8708a"; ctx.fillRect(p.dir > 0 ? p.x + PW : p.x - comp, ly, comp, 3);
          ctx.fillStyle = "#f8a0b8"; ctx.fillRect(p.dir > 0 ? p.x + PW + comp - 4 : p.x - comp, ly - 1, 4, 5);
        }
        if (!desenhaMon(ctx, "lickitung", lado, anda ? this.t * 1000 : 0, p.x + PW / 2, p.y + PH)) { ctx.fillStyle = "#f8a0c0"; ctx.fillRect(p.x - 4, p.y + PH - 20, 22, 20); }
        pe = p.y + PH - MONTA;
      }
      // os PODERES: GRANDE = 1,3x; PENA = capinha; FOGO = chaminhas; ESTRELA = arco-íris
      const grande = p.poder && !p.montado ? 1.3 : 1;
      if (p.poder === "pena") {
        const balanca = Math.sin(this.t * (p.chao ? 4 : 14)) * 2;
        ctx.fillStyle = "#f8d040"; ctx.fillRect(p.x + PW / 2 - p.dir * 8 - 3, pe - 24, 6, 14 + balanca);
        ctx.fillStyle = "#c89a20"; ctx.fillRect(p.x + PW / 2 - p.dir * 8 - 3, pe - 24, 6, 2);
      }
      if (p.estrela > 0) ctx.filter = `hue-rotate(${Math.floor(this.t * 720) % 360}deg) brightness(1.3)`;
      if (!desenhaMon(ctx, "pawmot", lado, p.montado ? 0 : ms, p.x + PW / 2, pe, false, grande)) {
        pinta(ctx, HEROI, HEROI_COR, p.x + 1, pe - 13, p.dir < 0);
      }
      ctx.filter = "none";
      if (p.poder === "fogo" && Math.random() < 0.35) this.faisca(p.x + Math.random() * PW, pe - 30 + Math.random() * 10, Math.random() < 0.5 ? "#f8a020" : "#e8402a", 12);
      if (p.soco > 0) {
        ctx.fillStyle = p.eletrico ? "#fff27a" : "#3b7bea";
        ctx.fillRect(p.dir > 0 ? p.x + PW + 1 : p.x - 6, pe - 16, 5, 4);
      }
      if (p.lento) { ctx.fillStyle = "#c8b870"; ctx.fillRect(p.x + 4, p.y - 3, 1, 1); ctx.fillRect(p.x + 9, p.y - 4, 1, 1); }
      if (this.temChave && !this.portaAberta) pinta(ctx, CHAVE, CHAVE_COR, p.x + 3, p.y - 8);
    }
    // os YAMASK por cima de tudo (eles atravessam parede)
    for (const y of this.yamasks) {
      const acordado = this.temChave;
      ctx.save();
      ctx.globalAlpha = acordado ? 1 : 0.55;
      const lado = acordado ? (p.x < y.x ? "left" : "right") : "down";
      if (!desenhaMon(ctx, "yamask", lado, acordado ? this.t * 1000 : 0, y.x + YW / 2, y.y + YH + 4, true)) {
        ctx.fillStyle = "#3a3040"; ctx.fillRect(y.x, y.y, YW, YH);
      }
      ctx.restore();
      if (!acordado && Math.floor(this.t * 1.5 + y.cx) % 3 === 0) drawText(ctx, "z", y.x + YW, y.y - 6 - (this.t * 6 % 4), "#c8c8e8");
    }
    for (const f of this.faiscas) { ctx.fillStyle = f.cor; ctx.fillRect(Math.round(f.x), Math.round(f.y), 2, 2); }
    ctx.restore();

    // placar: pilhas, vidas e a carga do soco
    ctx.fillStyle = "rgba(20,16,32,0.7)"; ctx.fillRect(0, 0, W, 14);
    pinta(ctx, PILHA, PILHA_COR, 4, 4);
    drawText(ctx, `${this.pegou}/${this.total}`, 13, 3, "#ffffff");
    for (let i = 0; i < 3; i++) { ctx.fillStyle = i < this.vidas ? "#e8504a" : "#4a4050"; ctx.fillRect(48 + i * 9, 4, 6, 6); }
    const c = Math.min(1, p.segura / CARGA);
    ctx.fillStyle = "#2a2a36"; ctx.fillRect(80, 4, 34, 6);
    ctx.fillStyle = c >= 1 ? (Math.floor(this.t * 10) % 2 ? "#fff27a" : "#ffffff") : "#f0a030"; ctx.fillRect(80, 4, 34 * c, 6);
    if (this.temChave && !this.portaAberta) pinta(ctx, CHAVE, CHAVE_COR, 118, 4);
    const poder = p.estrela > 0 ? "estrela" : p.poder === "grande" ? "baga" : p.poder;
    if (poder) { ctx.save(); ctx.translate(117, 1); ctx.scale(0.75, 0.75); desenhaItem(ctx, poder, 2, 3); ctx.restore(); }
    // a vida do chefão que está na tela
    const chefe = this.chefes.find((c) => c.vivo && Math.abs(c.x - p.x) < 160);
    if (chefe) {
      ctx.fillStyle = "rgba(20,16,32,0.75)"; ctx.fillRect(40, H - 16, 160, 12);
      drawText(ctx, chefe.tipo === "garchomp" ? "GARCHOMP" : "GIBLE", 44, H - 14, "#ffffff");
      ctx.fillStyle = "#4a4050"; ctx.fillRect(100, H - 12, 96, 5);
      ctx.fillStyle = chefe.vida / chefe.max > 0.3 ? "#e8504a" : "#f8d040"; ctx.fillRect(100, H - 12, 96 * chefe.vida / chefe.max, 5);
    }
    if (this.avisoPoder?.t > 0) {
      this.avisoPoder.t -= 1 / 60;
      const txt = this.avisoPoder.texto;
      drawText(ctx, txt, Math.round(W / 2 - txt.length * 3), 24, Math.floor(this.t * 10) % 2 ? "#fff27a" : "#ffffff");
    }
    drawText(ctx, this.fase.dele ? "FASE DO CAIO" : `FASE ${this.faseI + 1}: ${this.fase.nome}`, 132, 3, "#fff27a");

    this.dlg.render(ctx);
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }

  renderCeu(ctx) {
    const cam = this.cam || 0, ceu = this.ceu;
    const g = ctx.createLinearGradient(0, 0, 0, H);
    const cores = { floresta: ["#2a2350", "#7a5a8a"], lago: ["#4a8ad8", "#bfe4f8"], vulcao: ["#1a0a14", "#7a2a1a"], piramide: ["#e87a3a", "#f8d08a"], castelo: ["#0e0c18", "#2a1a2a"] }[ceu] || ["#2a2350", "#7a5a8a"];
    g.addColorStop(0, cores[0]); g.addColorStop(1, cores[1]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    if (ceu === "floresta") {
      for (let i = 0; i < 30; i++) { ctx.fillStyle = "#ffffff"; if ((i * 7 + Math.floor(this.t * 2)) % 11) ctx.fillRect((i * 53) % W, (i * 29) % 70, 1, 1); }
      for (const [vel, cor, alt] of [[0.2, "#3a3466", 70], [0.5, "#2a4a3a", 50]]) {
        ctx.fillStyle = cor;
        const off = -(cam * vel) % 40;
        for (let x = off - 40; x < W + 40; x += 40) {
          ctx.beginPath(); ctx.moveTo(x, H - alt + 30); ctx.lineTo(x + 20, H - alt - 10); ctx.lineTo(x + 40, H - alt + 30); ctx.fill();
          ctx.fillRect(x + 18, H - alt + 20, 4, alt);
        }
      }
    } else if (ceu === "lago") {
      ctx.fillStyle = "#fff8c0"; ctx.beginPath(); ctx.arc(190, 30, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 5; i++) {
        const x = ((i * 70 - cam * 0.1 + this.t * 4) % (W + 60) + W + 60) % (W + 60) - 30, y = 20 + (i * 17) % 40;
        ctx.fillRect(x, y, 26, 6); ctx.fillRect(x + 5, y - 4, 14, 5);
      }
      for (const [vel, cor, alt] of [[0.15, "#7ab8c8", 60], [0.4, "#4a9a6a", 42]]) {
        ctx.fillStyle = cor;
        const off = -(cam * vel) % 80;
        for (let x = off - 80; x < W + 80; x += 80) { ctx.beginPath(); ctx.ellipse(x + 40, H - alt + 40, 50, alt, 0, Math.PI, 0); ctx.fill(); }
        ctx.fillRect(0, H - alt + 40, W, alt);
      }
    } else if (ceu === "vulcao") {
      ctx.fillStyle = "#3a1a1a";
      const off = -(cam * 0.15) % 160;
      for (let x = off - 160; x < W + 160; x += 160) {
        ctx.beginPath(); ctx.moveTo(x, H); ctx.lineTo(x + 60, 50); ctx.lineTo(x + 90, 50); ctx.lineTo(x + 150, H); ctx.fill();
        ctx.fillStyle = "#e8502a"; ctx.fillRect(x + 62, 48, 26, 4); ctx.fillStyle = "#3a1a1a";
      }
      ctx.fillStyle = "#5a2a22";
      const off2 = -(cam * 0.4) % 60;
      for (let x = off2 - 60; x < W + 60; x += 60) { ctx.beginPath(); ctx.moveTo(x, H); ctx.lineTo(x + 30, H - 70); ctx.lineTo(x + 60, H); ctx.fill(); }
      ctx.fillStyle = "#8a7a7a";                                   // cinza caindo
      for (let i = 0; i < 25; i++) ctx.fillRect(((i * 47 + this.t * 10) % W + W) % W, (i * 31 + this.t * 20) % H, 1, 1);
    } else if (ceu === "castelo") {
      // a parede de tijolo lá do fundo, com janelas e tochas
      const off = -(cam * 0.3) % 64;
      ctx.fillStyle = "#24202e"; ctx.fillRect(0, 20, W, H);
      ctx.fillStyle = "#1a1724";
      for (let y = 20; y < H; y += 8) for (let x = off - 64 + ((y / 8) % 2) * 8; x < W + 64; x += 16) ctx.fillRect(x, y, 1, 8);
      for (let y = 20; y < H; y += 8) ctx.fillRect(0, y, W, 1);
      for (let x = off - 64; x < W + 64; x += 64) {
        ctx.fillStyle = "#0e0c18"; ctx.fillRect(x + 8, 40, 12, 22); ctx.beginPath(); ctx.arc(x + 14, 40, 6, Math.PI, 0); ctx.fill();
        ctx.fillStyle = "#6a4a2a"; ctx.fillRect(x + 44, 64, 3, 10);              // a tocha
        const fl = Math.sin(this.t * 12 + x) * 1.5;
        ctx.fillStyle = "rgba(248,160,32,0.18)"; ctx.beginPath(); ctx.arc(x + 45, 60, 12 + fl, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#f8a020"; ctx.fillRect(x + 43, 58 + fl, 5, 6); ctx.fillStyle = "#f8e060"; ctx.fillRect(x + 44, 61, 3, 3);
      }
      ctx.fillStyle = "#3a1a14"; ctx.fillRect(0, 0, W, 20);                     // o teto
      for (let x = off - 64; x < W + 64; x += 16) { ctx.fillStyle = "#2a1210"; ctx.fillRect(x, 16, 8, 6); }
    } else if (ceu === "piramide") {
      ctx.fillStyle = "#fff0c0"; ctx.beginPath(); ctx.arc(60, 40, 16, 0, Math.PI * 2); ctx.fill();
      for (const [vel, cor, alt, larg] of [[0.12, "#c8784a", 80, 180], [0.35, "#a85a3a", 55, 110]]) {
        ctx.fillStyle = cor;
        const off = -(cam * vel) % larg;
        for (let x = off - larg; x < W + larg; x += larg) { ctx.beginPath(); ctx.moveTo(x, H); ctx.lineTo(x + larg / 2, H - alt - 30); ctx.lineTo(x + larg, H); ctx.fill(); }
      }
    }
  }

  renderMenu(ctx) {
    this.ceu = this.fases[this.escolha]?.ceu || "floresta";
    this.cam = this.t * 20;
    this.renderCeu(ctx);
    ctx.fillStyle = "rgba(20,16,32,0.55)"; ctx.fillRect(0, 0, W, H);
    drawText(ctx, "SUPER PAWMOT", 84, 10, "#fff27a");
    desenhaMon(ctx, "pawmot", "right", this.t * 1000, 60, 36);
    desenhaMon(ctx, "pawmot", "left", this.t * 1000, 182, 36);
    this.fases.forEach((f, i) => {
      const y = 48 + i * 16, sel = i === this.escolha, aberta = this.aberta(i);
      if (sel) { ctx.fillStyle = "rgba(255,242,122,0.25)"; ctx.fillRect(20, y - 3, 200, 14); drawText(ctx, "▶", 24, y, "#fff27a"); }
      const nome = f.dele ? `★ ${f.nome}` : `FASE ${i + 1}: ${aberta ? f.nome : "???"}`;
      drawText(ctx, nome, 36, y, aberta ? "#ffffff" : "#7a7088");
      if (!f.dele && i < this.liberadas()) drawText(ctx, "✓", 206, y, "#6ad06a");
      if (!aberta) drawText(ctx, "TRANCADA", 160, y, "#7a7088");
    });
    if (!this.faseCaio) drawText(ctx, "SUA FASE: dev/fasepawmot.html", 30, 48 + this.fases.length * 16 + 4, "#a898c8");
    drawText(ctx, "Z JOGA   C SAI", 78, H - 14, "#c8c0d8");
    this.dlg.render(ctx);
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }
}
