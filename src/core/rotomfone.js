// O ROTOMFONE (pedido do CAIO, nov/2026: "faz os personagens terem
// rotomfones"). Ele escolheu três coisas: o menu START vira a tela de um
// ROTOMFONE (ícones em grade, como no Sword/Shield), os personagens LIGAM pra
// você (src/data/rotomfone.js) e o celular aparece nas conversas (a marca
// `[foto]` no começo de uma fala: clarão de foto + o ROTOMFONE do lado da caixa,
// src/systems/dialogue.js).
//
// Tudo aqui é desenho PIXEL POR PIXEL: grade de letras + paleta.

const PALETA = {
  // o ROTOMFONE de verdade (Sword/Shield): vermelho, raio em cima, ponta embaixo,
  // câmera azul no canto; a cara do ROTOM atrás e a tela preta na frente
  k: "#5a1410", r: "#f05a43", R: "#c83a28", H: "#ff9a80", l: "#d84a35",
  w: "#ffffff", c: "#9ddada", C: "#3aa8a8", b: "#3a6ad8", B: "#1a3a88",
  s: "#22262c", S: "#4a525c", y: "#ffd23a",
  // a dos ícones
  o: "#e8522e", O: "#ff8a5a",
  g: "#3ab04a", G: "#1e7a2e", n: "#a0642a", p: "#9058d0",
  e: "#9aa4b4", E: "#5a6070", Y: "#c89a10",
};

// O ROTOMFONE pequeno, pixel por pixel (18x30). AS COSTAS: a cara do ROTOM
// (os olhos ovais, a linha redonda em volta e o sorriso de dentinho).
const COSTAS = [
  "............kk....",
  "...........krk....",
  "..........krk.....",
  ".........krrkkk...",
  ".........kkkrrk...",
  "...........krk....",
  "..........krk.....",
  "..kkkkkkkkkrkkkk..",
  ".kHbBrrrrrrrrrrRk.",
  ".kHBbrrrrrrrrrrRk.",
  ".kHrwwrrrrrrwwrRk.",
  ".kHwccwrrrrwccwRk.",
  ".kHwcCwrrrrwcCwRk.",
  ".kHwcCwrrrrwcCwRk.",
  ".kHwccwrrrrwccwRk.",
  ".kHrwwrrrrrrwwrRk.",
  ".kHrrlrrrrrrlrrRk.",
  ".kHrrrkrrrrkrrrRk.",
  ".kHrrrrkkkkrrrrRk.",
  ".kHrlrrrrrrrrlrRk.",
  ".kHrrllrrrrllrrRk.",
  ".kHrrrrllllrrrrRk.",
  ".kHrrrrrrrrrrrrRk.",
  ".kHrrrrrrrrrrrrRk.",
  ".kRRrrrrrrrrrrRRk.",
  "..kkkkkkrrkkkkkk..",
  ".......krrk.......",
  ".......krrk.......",
  "........kk........",
];
// A FRENTE: a tela preta com o reflexo na diagonal (onde aparece quem liga)
const FRENTE = [
  "............kk....",
  "...........krk....",
  "..........krk.....",
  ".........krrkkk...",
  ".........kkkrrk...",
  "...........krk....",
  "..........krk.....",
  "..kkkkkkkkkrkkkk..",
  ".kHrrrrrrrrrrrrRk.",
  ".kHkkkkkkkkkkkkRk.",
  ".kHksssssssssSkRk.",
  ".kHkssssssssSSkRk.",
  ".kHksssssssSSskRk.",
  ".kHkssssssSSsskRk.",
  ".kHksssssSSssskRk.",
  ".kHkssssSSsssskRk.",
  ".kHksssSSssssskRk.",
  ".kHkssSSsssssskRk.",
  ".kHksSSssssssskRk.",
  ".kHkSSsssssssskRk.",
  ".kHkSssssssssskRk.",
  ".kHksssssssssskRk.",
  ".kHkkkkkkkkkkkkRk.",
  ".kRRrrrrrrrrrrRRk.",
  "..kkkkkkrrkkkkkk..",
  ".......krrk.......",
  ".......krrk.......",
  "........kk........",
];
// a tela da FRENTE (onde vai o rosto de quem liga), em pixels da grade
const TELA_FRENTE = { x: 4, y: 10, w: 10, h: 12 };
// os olhos fechados (piscando): as linhas dos olhos viram uma risca
const PISCA = { 11: ".kHrrrrrrrrrrrrRk.", 12: ".kHkkkkrrrrkkkkRk.", 13: ".kHrrrrrrrrrrrrRk.", 14: ".kHrrrrrrrrrrrrRk.", 10: ".kHrrrrrrrrrrrrRk.", 15: ".kHrrrrrrrrrrrrRk." };

function grade(ctx, linhas, x, y, s = 1, pal = PALETA) {
  for (let j = 0; j < linhas.length; j++) {
    const l = linhas[j];
    for (let i = 0; i < l.length; i++) {
      const c = l[i];
      if (c === "." || !pal[c]) continue;
      ctx.fillStyle = pal[c];
      ctx.fillRect(x + i * s, y + j * s, s, s);
    }
  }
}

/** O ROTOMFONE pequeno em (x, y): 18x29 pixels vezes `s`, boiando. Sem `tela`
 *  ele mostra as COSTAS (a cara do ROTOM, que pisca); com `tela(ctx, x, y, w, h)`
 *  mostra a FRENTE e a função desenha dentro da tela (o rosto de quem liga). */
export function desenharRotomfone(ctx, x, y, s = 1, t = 0, tela = null) {
  const boia = Math.round(Math.sin(t * 2.4) * s);
  if (tela) {
    grade(ctx, FRENTE, x, y + boia, s);
    tela(ctx, x + TELA_FRENTE.x * s, y + boia + TELA_FRENTE.y * s, TELA_FRENTE.w * s, TELA_FRENTE.h * s);
    return;
  }
  const piscando = (t % 3.2) > 3.05;
  grade(ctx, piscando ? COSTAS.map((l, j) => PISCA[j] || l) : COSTAS, x, y + boia, s);
}

export const LARGURA_FONE = 18, ALTURA_FONE = 28;

// ------------------------------------------------------------- o MENU START
// O MENU é a FRENTE de um ROTOMFONE pequeno que fica boiando na frente de
// você: corpo vermelho, o raio em cima, a ponta embaixo e a tela preta com os
// ícones. Devolve onde fica a tela.
const RAIO = COSTAS.slice(0, 7).map((l) => l.slice(8, 14));     // o raio, 6x7
const PONTA = ["krrk", "krrk", ".kk."];
export function desenharCorpoMenu(ctx, x, y, w, h, t = 0) {
  // o raio (2x) saindo de cima, um pouco pra direita
  grade(ctx, RAIO, x + Math.round(w * 0.55), y - 13, 2);
  // a ponta (2x) embaixo, no meio
  grade(ctx, PONTA, x + Math.round(w / 2) - 4, y + h - 1, 2);
  const P = PALETA;
  ctx.fillStyle = P.k;
  ctx.fillRect(x + 2, y, w - 4, h); ctx.fillRect(x, y + 2, w, h - 4); ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
  ctx.fillStyle = P.r;
  ctx.fillRect(x + 2, y + 1, w - 4, h - 2); ctx.fillRect(x + 1, y + 2, w - 2, h - 4);
  ctx.fillStyle = P.H; ctx.fillRect(x + 2, y + 3, 1, h - 6);         // o brilho da esquerda
  ctx.fillStyle = P.R; ctx.fillRect(x + w - 3, y + 3, 1, h - 6); ctx.fillRect(x + 3, y + h - 3, w - 6, 1);
  // a tela preta, com o reflexo na diagonal bem de leve
  const tela = { x: x + 5, y: y + 5, w: w - 10, h: h - 10 };
  ctx.fillStyle = P.k; ctx.fillRect(tela.x - 1, tela.y - 1, tela.w + 2, tela.h + 2);
  ctx.fillStyle = P.s; ctx.fillRect(tela.x, tela.y, tela.w, tela.h);
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  for (let i = 0; i < tela.h; i++) {
    const a = tela.x + Math.round(tela.w * 0.15) + i * 0.5 - tela.h * 0.25;
    for (const [d, l] of [[0, 8], [12, 3]]) {
      const x0 = Math.max(tela.x, Math.round(a + d)), x1 = Math.min(tela.x + tela.w, Math.round(a + d + l));
      if (x1 > x0) ctx.fillRect(x0, tela.y + tela.h - 1 - i, x1 - x0, 1);
    }
  }
  return tela;
}

// OS ÍCONES DO MENU, 12x12, pixel por pixel. A chave é o item do menu.
const ICONES = {
  "POKÉDEX": [
    "............",
    ".kkkkkkkkkk.",
    ".krrrrrrrrk.",
    ".krwwrryryk.",
    ".krwbwrrrrk.",
    ".krwwrrrrrk.",
    ".kkkkkkkkkk.",
    ".kcccccccck.",
    ".kcwcccccck.",
    ".kcccccwcck.",
    ".kcccccccck.",
    ".kkkkkkkkkk.",
  ],
  "POKÉMON": [
    "....kkkk....",
    "..kkrrrrkk..",
    ".krrrrrrrrk.",
    ".krrwrrrrrk.",
    "krrrrkkrrrrk",
    "kkkkkwwkkkkk",
    "kwwwkwwkwwwk",
    "kwwwwkkwwwwk",
    ".kwwwwwwwwk.",
    ".kwwwwwwwwk.",
    "..kkwwwwkk..",
    "....kkkk....",
  ],
  "BOX": [
    "............",
    ".kkkkkkkkkk.",
    ".keeeeeeeek.",
    ".keccccccek.",
    ".kecwccccek.",
    ".keccccccek.",
    ".keccccccek.",
    ".keeeeeeeek.",
    ".kkkkkkkkkk.",
    "....kEEk....",
    "..kkEEEEkk..",
    "..kkkkkkkk..",
  ],
  "MOCHILA": [
    "....kkkk....",
    "...kk..kk...",
    "..kkkkkkkk..",
    ".knnnnnnnnk.",
    ".knyynnnnnk.",
    ".knnnnnnnnk.",
    ".kkkkkkkkkk.",
    ".knnnnnnnnk.",
    ".knnnyynnnk.",
    ".knnnnnnnnk.",
    ".knnnnnnnnk.",
    "..kkkkkkkk..",
  ],
  "INSÍGNIAS": [
    "............",
    "....kkkk....",
    "...kyyyyk...",
    "..kyywyyyk..",
    ".kyywyyyyyk.",
    ".kyyyyyyyyk.",
    ".kyyyyyyYyk.",
    ".kyyyyyyYyk.",
    "..kyyyyYyk..",
    "...kyYYyk...",
    "....kkkk....",
    "............",
  ],
  "ROUPAS": [
    "............",
    "..kkk..kkk..",
    ".kbbbkkbbbk.",
    "kbbbbbbbbbbk",
    "kbbbbbbbbbbk",
    ".kkbbbbbbkk.",
    "..kbbbbbbk..",
    "..kbbwbbbk..",
    "..kbbbbbbk..",
    "..kbbbbbbk..",
    "..kkkkkkkk..",
    "............",
  ],
  "METAS": [
    "....kkkk....",
    "..kkrrrrkk..",
    ".krrwwwwrrk.",
    ".krwwrrwwrk.",
    "krwwrrrrwwrk",
    "krwrrkkrrwrk",
    "krwrrkkrrwrk",
    "krwwrrrrwwrk",
    ".krwwrrwwrk.",
    ".krrwwwwrrk.",
    "..kkrrrrkk..",
    "....kkkk....",
  ],
  "ACAMPAR": [
    "............",
    ".....kk.....",
    "....kggk....",
    "....kggk....",
    "...kgggGk...",
    "...kggGGk...",
    "..kgggkGGk..",
    "..kggkkkGk..",
    ".kgggkkkGGk.",
    ".kggkkkkkGk.",
    "kkkkkkkkkkkk",
    "............",
  ],
  "MAPA": [
    "............",
    "kkkkkkkkkkkk",
    "kgggbbbgggbk",
    "kggbbgggbbgk",
    "kgbbggrgbggk",
    "kbbgggrrgggk",
    "kbggggrggbbk",
    "kgggbbgggbgk",
    "kggbbgggbbgk",
    "kgbbggggbggk",
    "kkkkkkkkkkkk",
    "............",
  ],
  "MISSÕES": [
    "............",
    "..kkkkkkkk..",
    "..kwwwwwwk..",
    "..kwkkkkwk..",
    "..kwwwwwwk..",
    "..kwkkkkwk..",
    "..kwwwwwwk..",
    "..kwkkkwwk..",
    "..kwwwwwwk..",
    "..kwwwwrwk..",
    "..kkkkkkkk..",
    "............",
  ],
  "BAIXAR": [
    "............",
    ".....kk.....",
    "....kcck....",
    "....kcck....",
    "....kcck....",
    "..kkkcckkk..",
    "..kcccccck..",
    "...kcccck...",
    "....kcck....",
    ".....kk.....",
    ".kkkkkkkkkk.",
    "............",
  ],
  "VOAR": [
    "............",
    "..........k.",
    "........kkwk",
    "......kkwwwk",
    "....kkwwwwk.",
    "..kkwwwewk..",
    ".kwwwwwek...",
    "kwwwweek....",
    ".kwwwek.....",
    "..kkkk......",
    "............",
    "............",
  ],
  "POUSAR": [
    "............",
    ".....kk.....",
    "....kggk....",
    "....kggk....",
    "..kkkggkkk..",
    "..kggggggk..",
    "...kggggk...",
    "....kggk....",
    ".....kk.....",
    "............",
    "kGGGGGGGGGGk",
    "kkkkkkkkkkkk",
  ],
  "ÁGUA": [
    "............",
    "............",
    "..bb....bb..",
    ".bwwb..bwwb.",
    "b....bb....b",
    "............",
    "..bb....bb..",
    ".bwwb..bwwb.",
    "b....bb....b",
    "............",
    "BBBBBBBBBBBB",
    "............",
  ],
  "ONLINE": [
    "....kkkk....",
    "..kkbbbbkk..",
    ".kbgggbbbbk.",
    ".kbggggbbbk.",
    "kbbgggbbbbbk",
    "kbbbggbbggbk",
    "kbbbbbbgggbk",
    "kbbbbbbbggbk",
    ".kbbgbbbbbk.",
    ".kbbggbbbbk.",
    "..kkbbbbkk..",
    "....kkkk....",
  ],
  "SALVAR": [
    "kkkkkkkkkkk.",
    "kBBeweweeBBk",
    "kBBewewkeBBk",
    "kBBeweweeBBk",
    "kBBeeeeeeBBk",
    "kBBBBBBBBBBk",
    "kBwwwwwwwwBk",
    "kBwkkkkkkwBk",
    "kBwwwwwwwwBk",
    "kBwkkkkkkwBk",
    "kBwwwwwwwwBk",
    "kkkkkkkkkkkk",
  ],
  "OPÇÕES": [
    "............",
    ".....kk.....",
    "..k.keek.k..",
    ".kekeeeekek.",
    "..keeEEeek..",
    ".keeEkkEeek.",
    ".keeEkkEeek.",
    "..keeEEeek..",
    ".kekeeeekek.",
    "..k.keek.k..",
    ".....kk.....",
    "............",
  ],
  "SAIR": [
    "............",
    ".kk......kk.",
    ".krk....krk.",
    "..krk..krk..",
    "...krkkrk...",
    "....krrk....",
    "....krrk....",
    "...krkkrk...",
    "..krk..krk..",
    ".krk....krk.",
    ".kk......kk.",
    "............",
  ],
  "CÂMERA": [
    "............",
    "..kkkk......",
    ".kkeekkkkkk.",
    "keeeeeeeeeek",
    "keeekkkkeeyk",
    "keekbbbbkeek",
    "keekbwbbkeek",
    "keekbbbbkeek",
    "keeekkkkeeek",
    "keeeeeeeeeek",
    "kkkkkkkkkkkk",
    "............",
  ],
  "TRABALHOS": [
    "............",
    "....kkkk....",
    "....k..k....",
    ".kkkkkkkkkk.",
    ".knnnnnnnnk.",
    ".knnnnnnnnk.",
    ".kkkkyykkkk.",
    ".knnnyynnnk.",
    ".knnnnnnnnk.",
    ".knnnnnnnnk.",
    ".kkkkkkkkkk.",
    "............",
  ],
  "CONTATOS": [
    "............",
    ".kkk........",
    "kgggk.......",
    "kgwgk.......",
    ".kggk.......",
    "..kggk......",
    "...kggk.kkk.",
    "....kggkgggk",
    ".....kgggwgk",
    "......kgggk.",
    ".......kkk..",
    "............",
  ],
  "?": [
    "............",
    "...kkkkkk...",
    "..kppppppk..",
    "..kpkkkkpk..",
    "..kkk..kpk..",
    "......kppk..",
    ".....kppk...",
    ".....kppk...",
    "......kk....",
    ".....kppk...",
    "......kk....",
    "............",
  ],
};
// os itens que dividem ícone
const MESMO = {
  "LEVANTAR VOO": "VOAR", "VOAR LIVRE": "VOAR", "MERGULHAR": "ÁGUA", "SUBIR": "ÁGUA",
  "FICAR NA BOLA": "POKÉMON", "SAIR DA BOLA": "POKÉMON",
};

/** desenha o ícone do item do menu (12x12) em (x, y); `extra` mapeia rótulos
 *  que mudam (o título das missões, o ATUALIZAR das fusões) pra chave do ícone */
export function desenharIcone(ctx, item, x, y, extra = {}) {
  const chave = extra[item] || MESMO[item] || item;
  grade(ctx, ICONES[chave] || ICONES["?"], x, y, 1);
}

export const ICONES_ROTOMFONE = ICONES;   // (o tools/ e o teste conferem o tamanho)
export const FONE_GRADE = COSTAS;
export const FONE_FRENTE = FRENTE;
