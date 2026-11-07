// A TELA SUAVE (nov/2026, pedido do CAIO: "os pixels vão se emendarem", como o
// FIRE RED com filtro de emulador). Liga em OPÇÕES → SUAVE.
//
// O jogo desenha nos 240x160 e a tela de verdade é 3x (ESCALA_TELA). Com a tela
// suave ligada, cada quadro pega os 240x160 de volta e amplia de novo com o
// SCALE3X: onde dois vizinhos de mesma cor fazem uma quina, o pixel do meio
// entra na diagonal — a escada vira rampa e as bordas ficam arredondadas.
//
// O NÍVEL vai de 0 a 5,5 (de meio em meio): de 0 a 3 o desenho suave vai
// aparecendo por cima do de quadradinho (3 = suave inteiro); de 3 a 5,5 ainda
// borra um pouco, cada vez mais macio.

export const NIVEL_MAX = 5.5;
/** o nível guardado nas OPÇÕES (quem tinha o liga/desliga antigo: ligado = 3) */
export const nivelSuave = (v) => (v === true ? 3 : Math.max(0, Math.min(NIVEL_MAX, Number(v) || 0)));
/** o nome do nível no menu: OFF, 0,5 ... 5,5 */
export const nomeSuave = (v) => (nivelSuave(v) ? String(nivelSuave(v)).replace(".", ",") : "OFF");

let fonte = null, saida = null, tela = null;

/** suaviza o `buffer` (canvas 3x) no lugar, no nível `nivel` (0 a 5,5).
 *  `tolerancia` (0 = só cor igualzinha; qualquer outro = pela CLARIDADE): na
 *  GLITCH DIMENSION (pedido do CAIO, nov/2026: "o jogador se emenda com a
 *  pixelart do chão, como se fossem a mesma pixelart"). */
export function suavizar(buffer, nivel = 3, tolerancia = 0) {
  nivel = nivelSuave(nivel);
  if (!nivel) return;
  const W = buffer.width / 3, H = buffer.height / 3, OW = buffer.width;
  const ctx = buffer.getContext("2d");
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const tudo = ctx.getImageData(0, 0, OW, buffer.height);
  const g = new Uint32Array(tudo.data.buffer);
  if (!fonte || fonte.length !== W * H) fonte = new Uint32Array(W * H);
  // o pixel do meio de cada quadrado 3x3 é o pixel do jogo
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) fonte[y * W + x] = g[(y * 3 + 1) * OW + x * 3 + 1];
  if (!saida || saida.width !== OW || saida.height !== buffer.height) saida = ctx.createImageData(OW, buffer.height);
  const o = new Uint32Array(saida.data.buffer);
  // GLITCH DIMENSION: TODA A PIXELART SE EMENDA, com as bordas derretendo
  // (pedido do CAIO, nov/2026: "era pra toda a pixelart emendar"). Depois do
  // arredondado, em toda borda entre duas cores, os pedacinhos de cada lado
  // MORDEM o outro (uns sim, uns não, mudando devagar) e a cor de cima escorre
  // pra baixo: o chão, o jogador e tudo viram uma pixelart só, derretendo.
  const derrete = !!tolerancia;
  const tempo = derrete ? Math.floor(performance.now() / 180) : 0;
  const sorte = (x, y, k) => {
    let h = (x * 374761393 + y * 668265263 + k * 2147483647 + tempo * 1274126177) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  };
  const ig = (a, b) => a === b;
  for (let y = 0; y < H; y++) {
    const ya = y > 0 ? y - 1 : y, yb = y < H - 1 ? y + 1 : y;
    for (let x = 0; x < W; x++) {
      const xa = x > 0 ? x - 1 : x, xb = x < W - 1 ? x + 1 : x;
      const A = fonte[ya * W + xa], B = fonte[ya * W + x], C = fonte[ya * W + xb];
      const D = fonte[y * W + xa], E = fonte[y * W + x], F = fonte[y * W + xb];
      const G = fonte[yb * W + xa], Hh = fonte[yb * W + x], I = fonte[yb * W + xb];
      const fA = A, fB = B, fC = C, fD = D, fE = E, fF = F, fG = G, fH = Hh, fI = I;
      let e0 = E, e1 = E, e2 = E, e3 = E, e5 = E, e6 = E, e7 = E, e8 = E;
      if (!ig(fB, fH) && !ig(fD, fF)) {
        e0 = ig(fD, fB) ? D : E;
        e1 = (ig(fD, fB) && !ig(fE, fC)) || (ig(fB, fF) && !ig(fE, fA)) ? B : E;
        e2 = ig(fB, fF) ? F : E;
        e3 = (ig(fD, fB) && !ig(fE, fG)) || (ig(fD, fH) && !ig(fE, fA)) ? D : E;
        e5 = (ig(fB, fF) && !ig(fE, fI)) || (ig(fH, fF) && !ig(fE, fC)) ? F : E;
        e6 = ig(fD, fH) ? D : E;
        e7 = (ig(fD, fH) && !ig(fE, fI)) || (ig(fH, fF) && !ig(fE, fG)) ? Hh : E;
        e8 = ig(fH, fF) ? F : E;
      }
      if (derrete) {
        // as bordas se mordendo: de cima escorre mais (60%), dos lados e de baixo menos
        if (B !== E && sorte(x, y, 1) < 0.6) { e1 = B; if (sorte(x, y, 2) < 0.5) e0 = B; if (sorte(x, y, 3) < 0.5) e2 = B; }
        if (Hh !== E && sorte(x, y, 4) < 0.3) e7 = Hh;
        if (D !== E && sorte(x, y, 5) < 0.4) e3 = D;
        if (F !== E && sorte(x, y, 6) < 0.4) e5 = F;
        if (A !== E && e0 === E && sorte(x, y, 7) < 0.3) e0 = A;
        if (C !== E && e2 === E && sorte(x, y, 8) < 0.3) e2 = C;
      }
      const p = y * 3 * OW + x * 3;
      o[p] = e0; o[p + 1] = e1; o[p + 2] = e2;
      o[p + OW] = e3; o[p + OW + 1] = E; o[p + OW + 2] = e5;
      o[p + 2 * OW] = e6; o[p + 2 * OW + 1] = e7; o[p + 2 * OW + 2] = e8;
    }
  }
  if (nivel === 3) { ctx.putImageData(saida, 0, 0); ctx.restore(); return; }
  // os outros níveis: o suave numa tela à parte, posto por cima do quadradinho
  // (até 3, meio transparente) ou borrado de leve (acima de 3)
  if (!tela || tela.width !== OW || tela.height !== buffer.height) {
    tela = document.createElement("canvas");
    tela.width = OW; tela.height = buffer.height;
  }
  tela.getContext("2d").putImageData(saida, 0, 0);
  if (nivel < 3) ctx.globalAlpha = nivel / 3;
  else {
    ctx.putImageData(saida, 0, 0);           // embaixo do borrado, o suave (e não o quadradinho)
    ctx.filter = `blur(${((nivel - 3) * 0.5).toFixed(2)}px)`;
  }
  ctx.drawImage(tela, 0, 0);
  ctx.restore();
}
