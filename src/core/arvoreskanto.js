// AS ÁRVORES 3D DE KANTO (pedido do CAIO, nov/2026: "recorta a pixelart das
// árvores e empilha pra fazer uma árvore 3d e 2d ao mesmo tempo").
//
// Os mapas de Kanto são desenhos prontos do FireRed (assets/maps/<id>.png e
// <id>_over.png), com as árvores pintadas dentro. Aqui, quando o mapa carrega:
//  1. acha cada árvore no desenho — o MEIO dela (as fileiras 16..31 do bloco
//     "arvore" de src/core/fr-blocos.js) tem que bater pixel por pixel;
//  2. confere o PÉ (pode estar coberto pela copa da árvore de baixo, que é o
//     mesmo desenho 2 tiles abaixo) — se outra coisa cobre (um telhado), a
//     árvore fica pintada, como era;
//  3. apaga do desenho os pixels dela (vira grama) e guarda onde ela estava.
// O overworld desenha cada uma em pé, empilhada em fatias (src/core/arvore3d.js),
// igual às de BRAGLITCH: de frente é a pixelart, longe do meio da tela é 3D.
// O desenho original fica em `comArvores` (o modo isométrico usa ele).
import { FR_BLOCOS, FR_CORES } from "./fr-blocos.js";
import { GRANDES, GRANDE_CORES } from "./arvore-grande.js";

const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
let T = null;
function molde() {
  if (T) return T;
  const rows = FR_BLOCOS.arvore, grama = FR_BLOCOS.grama;
  const px = (rs, x, y) => { const ch = rs[y]?.[x]; return ch && FR_CORES[ch] ? hex(FR_CORES[ch]) : null; };
  const w = rows[0].length, h = rows.length;
  const p = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const c = px(rows, x, y); if (c) p.push([x, y, c]); }
  T = {
    w, h,
    meio: p.filter(([, y]) => y >= 16 && y < 32),
    pe: p.filter(([, y]) => y >= 32),
    todos: p,
    // a copa de cima (fileiras 0..15) indexada, pra conferir o pé coberto pela árvore de baixo
    copa: new Map(p.filter(([, y]) => y < 16).map(([x, y, c]) => [x + "," + y, c])),
    grama: (x, y) => px(grama, x & 15, y & 15) || [115, 205, 164],
  };
  return T;
}

const igual = (d, i, c) => d[i] === c[0] && d[i + 1] === c[1] && d[i + 2] === c[2] && d[i + 3] > 0;

/** tira as árvores de `base` (+ `over`): { base, over, lista } ou null se não tem */
export function tirarArvores(base, over) {
  if (!base || typeof document === "undefined") return null;
  const M = molde(), W = base.width, H = base.height;
  const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  const g = cv.getContext("2d", { willReadFrequently: true });
  g.drawImage(base, 0, 0);
  if (over) g.drawImage(over, 0, 0);
  let comp;
  try { comp = g.getImageData(0, 0, W, H).data; } catch { return null; }
  const lista = [], apagar = new Uint8Array(W * H);
  for (let ty = 0; ty + 16 <= H; ty += 16) {
    for (let tx = 0; tx + 32 <= W; tx += 16) {
      // o meio da árvore nesta linha de tiles = a árvore começa um tile acima
      const ox = tx, oy = ty - 16;
      let ok = true;
      for (const [x, y, c] of M.meio) { if (!igual(comp, ((oy + y) * W + ox + x) * 4, c)) { ok = false; break; } }
      if (!ok) continue;
      // o pé: o desenho dele, ou a copa da árvore de baixo por cima
      let fora = 0;
      for (const [x, y, c] of M.pe) {
        const Y = oy + y;
        if (Y >= H) continue;
        const i = (Y * W + ox + x) * 4, cb = M.copa.get(x + "," + (y - 32));
        if (!igual(comp, i, c) && !(cb && igual(comp, i, cb))) fora++;
      }
      if (fora > 6) continue;                          // um telhado ou outra coisa na frente: fica pintada
      for (const [x, y, c] of M.todos) {
        const X = ox + x, Y = oy + y;
        if (X < 0 || Y < 0 || X >= W || Y >= H) continue;
        const i = (Y * W + X) * 4;
        // 1 = o corpo; 2 = a COPA (o tile de cima, que pode ser de pedra atrás)
        if (igual(comp, i, c)) apagar[Y * W + X] = y < 16 ? 2 : 1;
      }
      lista.push({ x: ox / 16, y: oy / 16 + 1, tipo: "arvore", larg: 2, alt: 2 });
    }
  }
  // AS GRANDES (as da FLORESTA DE VIRIDIAN: outro desenho, de 3 tiles de largura):
  // em pedaços de 3x2 tiles: o MEIO, que se repete empilhado pela mata, o TOPO e o PÉ
  for (const [tipo, linhas] of Object.entries(GRANDES)) {
    const G = [];
    linhas.forEach((linha, y) => [...linha].forEach((ch, x) => { if (GRANDE_CORES[ch]) G.push([x, y, hex(GRANDE_CORES[ch])]); }));
    for (let ty = 0; ty + 32 <= H; ty += 16) {
      for (let tx = 0; tx + 48 <= W; tx += 16) {
        // (até 6% de pixels diferentes: o vizinho encosta numa beirada ou outra)
        let erros = 0;
        const limite = G.length * 0.06;
        for (const [x, y, c] of G) { if (!igual(comp, ((ty + y) * W + tx + x) * 4, c) && ++erros > limite) break; }
        if (erros > limite || apagar[(ty + 16) * W + tx + 24] === 3) continue;
        for (const [x, y] of G) apagar[(ty + y) * W + tx + x] = 3;
        lista.push({ x: tx / 16, y: ty / 16, tipo, larg: 3, alt: 2 });
      }
    }
  }
  if (!lista.length) return null;
  // o chão sem elas: grama onde tinha árvore (e a camada de cima transparente ali)
  const b2 = document.createElement("canvas"); b2.width = W; b2.height = H;
  const gb = b2.getContext("2d"); gb.drawImage(base, 0, 0);
  const db = gb.getImageData(0, 0, W, H), dd = db.data;
  let o2 = null, od = null, oimg = null;
  if (over) {
    o2 = document.createElement("canvas"); o2.width = W; o2.height = H;
    const go = o2.getContext("2d"); go.drawImage(over, 0, 0);
    oimg = go.getImageData(0, 0, W, H); od = oimg.data;
  }
  // A COPA EM CIMA DA MONTANHA (pedido do CAIO: "montanhas tão com buracos com o
  // formato das árvores"): onde a copa estava na frente da PEDRA, atrás dela não
  // tinha grama — então a copa vira o desenho do tile de cima (a pedra continua),
  // e não grama. Se o de cima também era árvore (o meio da mata), aí sim grama.
  const orig = new Uint8ClampedArray(dd);
  for (let k = 0; k < W * H; k++) {
    if (!apagar[k]) continue;
    const x = k % W, y = (k / W) | 0, i = k * 4;
    let c = apagar[k] === 3 ? [24, 164, 106] : M.grama(x, y);     // (debaixo da grande, a sombra da mata)
    if (apagar[k] === 2 && y >= 16 && !apagar[k - 16 * W]) {
      const j = (k - 16 * W) * 4, cima = [orig[j], orig[j + 1], orig[j + 2]];
      const g = M.grama(x, y);
      // só copia se o de cima NÃO é grama (é pedra, cerca, água...)
      if (Math.abs(cima[0] - g[0]) + Math.abs(cima[1] - g[1]) + Math.abs(cima[2] - g[2]) > 60) c = cima;
    }
    dd[i] = c[0]; dd[i + 1] = c[1]; dd[i + 2] = c[2]; dd[i + 3] = 255;
    if (od) od[i + 3] = 0;
  }
  gb.putImageData(db, 0, 0);
  if (o2) o2.getContext("2d").putImageData(oimg, 0, 0);
  b2.comArvores = base;
  return { base: b2, over: o2, lista };
}
