// O DIGLETT DA PROVAÇÃO, DA CABEÇA PRA BAIXO.
//
// A provação de TERRA promete o que nenhuma pokédex mostrou: o DIGLETT fora do
// buraco, inteiro. Até aqui a promessa era só texto — na tela subia o mesmo
// DIGLETT de sempre, só que maior. Agora sobe o corpo.
//
// A REGRA DO DESENHO: o sprite de cima é O SPRITE DE SEMPRE, intacto, pixel por
// pixel — o monte de terra dele vira a gola de pedra em volta do pescoço. Tudo
// o que é novo fica EMBAIXO. Se a cabeça mudasse, a piada acabava: a graça é
// ser o DIGLETT que todo mundo conhece em cima de um corpo que ninguém pediu.
//
// O corpo é montado em código (formas simples numa grade, depois contorno e
// sombra), no mesmo espírito do resto da arte provisória do jogo: nenhum PNG
// novo em assets/. Esta parte não toca em canvas — devolve só as linhas e a
// paleta, pra dar pra conferir o desenho fora do navegador.

/** As cores saem do próprio DIGLETT (assets/sprites/pokemon/050.png): o corpo
 *  é da mesma pele da cabeça. O calção é do vermelho do nariz. */
export const PALETA_CORPO = {
  O: "#101010",   // contorno
  S: "#c07840",   // pele
  D: "#a05840",   // pele na sombra
  d: "#682000",   // o risco fundo (entre os gomos)
  H: "#d89858",   // pele no brilho
  R: "#d03848",   // calção
  r: "#982030",   // calção na sombra
  W: "#f8f8f8",   // a faixa do calção
};

/** O tamanho da peça inteira e onde o sprite de 64x64 entra nela. */
export const CORPO = { w: 80, h: 112, spriteX: 8, spriteY: 0 };

/** Desenha o corpo e devolve { rows, paleta }. Mesma entrada, mesmo desenho. */
export function corpoBombado() {
  const { w, h } = CORPO;
  const cx = 40;
  // parte[y][x]: 0 = vazio; o resto diz de que pedaço é o pixel
  const parte = Array.from({ length: h }, () => new Array(w).fill(0));
  const cor = Array.from({ length: h }, () => new Array(w).fill(""));
  const pinta = (x, y, p, c = "S") => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    parte[y][x] = p; cor[y][x] = c;
  };
  const elipse = (ex, ey, rx, ry, p, c) => {
    for (let y = Math.floor(ey - ry); y <= Math.ceil(ey + ry); y++) {
      for (let x = Math.floor(ex - rx); x <= Math.ceil(ex + rx); x++) {
        const nx = (x - ex) / rx, ny = (y - ey) / ry;
        if (nx * nx + ny * ny <= 1) pinta(x, y, p, c);
      }
    }
  };
  // um "osso" grosso de A até B (braço, perna)
  const osso = (ax, ay, bx, by, ra, rb, p, c) => {
    const passos = Math.ceil(Math.hypot(bx - ax, by - ay) * 2);
    for (let i = 0; i <= passos; i++) {
      const t = i / passos;
      elipse(ax + (bx - ax) * t, ay + (by - ay) * t, ra + (rb - ra) * t, ra + (rb - ra) * t, p, c);
    }
  };
  const espelho = (fn) => { fn(1); fn(-1); };

  // AS PEÇAS, na ordem em que ficam umas por cima das outras. A ordem importa
  // pro contorno de dentro: o pedaço que vem depois ganha a linha preta na
  // borda com o de antes (o braço por cima do peito, e não o contrário).
  const PERNA = 1, TRONCO = 2, CALCAO = 3, OMBRO = 4, BRACO = 5, PUNHO = 6;

  // as pernas, abertas: postura de quem vai levantar alguma coisa pesada
  espelho((s) => {
    osso(cx + s * 8, 94, cx + s * 13, 104, 7, 6, PERNA);
    elipse(cx + s * 15, 108, 6, 2.6, PERNA);                    // o pé
  });
  // o tronco em V: ombro largo, cintura fina
  const larguraEm = (y) => {
    const pts = [[46, 21], [56, 24], [66, 21], [76, 16], [88, 13]];
    for (let i = 0; i < pts.length - 1; i++) {
      const [y0, a] = pts[i], [y1, b] = pts[i + 1];
      if (y >= y0 && y <= y1) return a + (b - a) * (y - y0) / (y1 - y0);
    }
    return 0;
  };
  for (let y = 46; y <= 88; y++) {
    const meia = larguraEm(y);
    for (let x = Math.round(cx - meia); x <= Math.round(cx + meia); x++) pinta(x, y, TRONCO);
  }
  elipse(cx, 48, 16, 6, TRONCO);                                // o trapézio, sob a gola
  // o calção, por cima da cintura
  for (let y = 85; y <= 97; y++) {
    const meia = 14 + Math.min(4, Math.max(0, y - 86) * 0.6);
    for (let x = Math.round(cx - meia); x <= Math.round(cx + meia); x++) pinta(x, y, CALCAO, "R");
  }
  // os ombros e os braços em DUPLO BÍCEPS, os punhos na altura da cabeça
  espelho((s) => {
    elipse(cx + s * 23, 53, 8, 7, OMBRO);
    osso(cx + s * 26, 50, cx + s * 33, 40, 6, 5.5, BRACO);     // o braço
    elipse(cx + s * 30, 40, 6.5, 5, BRACO);                      // o morro do bíceps
    osso(cx + s * 33, 40, cx + s * 31, 23, 4.8, 4.2, BRACO);    // o antebraço
    elipse(cx + s * 31, 19, 5.2, 5, PUNHO);                      // o punho fechado
  });

  const vazio = (x, y) => x < 0 || y < 0 || x >= w || y >= h || !parte[y][x];
  const VIZ = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  // SOMBRA E BRILHO. A luz vem da esquerda de cima, como no sprite dele: o
  // lado direito e a barriga das formas escurecem, o lado esquerdo acende.
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!parte[y][x]) continue;
      const pele = cor[y][x] === "S";
      const escuro = pele ? "D" : "r";
      if (vazio(x + 1, y) || vazio(x + 2, y) || vazio(x, y + 1)) cor[y][x] = escuro;
      else if (pele && (vazio(x - 1, y) || vazio(x, y - 1))) cor[y][x] = "H";
    }
  }

  // OS MÚSCULOS, riscados por dentro
  const risca = (x, y, c = "d") => { if (!vazio(x, y)) cor[y][x] = c; };
  espelho((s) => {
    // a borda de baixo do peitoral
    for (let i = 0; i <= 12; i++) risca(cx + s * i, 63 + Math.round(Math.sin((i / 12) * Math.PI) * 2));
    for (let i = 1; i <= 11; i++) risca(cx + s * i, 62 + Math.round(Math.sin((i / 12) * Math.PI) * 2), "D");
    // o brilho em cima de cada peitoral
    for (let i = 3; i <= 8; i++) risca(cx + s * i, 54, "H");
    // o risco do bíceps (onde ele dobra)
    for (let i = 0; i <= 4; i++) risca(cx + s * (27 + i), 43 + (i > 2 ? 1 : 0));
    // o serrátil, três dentes do lado da costela
    for (const yy of [67, 70, 73]) { risca(cx + s * (larguraEm(yy) - 3 | 0), yy); risca(cx + s * (larguraEm(yy) - 4 | 0), yy); }
  });
  // o meio do peito
  for (let y = 52; y <= 64; y++) risca(cx, y);
  // o TANQUINHO: três pares de gomos
  for (let y = 67; y <= 84; y++) risca(cx, y);
  for (const yy of [72, 78]) for (let i = -6; i <= 6; i++) risca(cx + i, yy);
  for (let y = 67; y <= 84; y++) { risca(cx - 7, y, "D"); risca(cx + 7, y, "D"); }
  for (const yy of [68, 74, 80]) for (const i of [-4, -3, 2, 3]) risca(cx + i, yy, "H");
  // a faixa branca do calção e a separação das pernas
  for (let x = cx - 15; x <= cx + 15; x++) if (parte[86]?.[x] === CALCAO) cor[86][x] = "W";
  for (let y = 91; y <= 97; y++) risca(cx, y, "r");

  // O CONTORNO. Fora: todo vazio encostado no corpo vira linha preta. Dentro:
  // a peça de cima ganha linha onde encosta numa peça de baixo.
  const contorno = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!parte[y][x]) {
        if (VIZ.some(([dx, dy]) => !vazio(x + dx, y + dy))) contorno.push([x, y]);
        continue;
      }
      const p = parte[y][x];
      if (p === BRACO || p === PUNHO || p === OMBRO || p === CALCAO) {
        if (VIZ.some(([dx, dy]) => { const q = vazio(x + dx, y + dy) ? 0 : parte[y + dy][x + dx]; return q && q < p && !(p === PUNHO && q === BRACO); })) {
          contorno.push([x, y]);
        }
      }
    }
  }
  for (const [x, y] of contorno) cor[y][x] = "O";

  const rows = cor.map((linha) => linha.map((c) => c || ".").join(""));
  return { rows, paleta: PALETA_CORPO };
}
