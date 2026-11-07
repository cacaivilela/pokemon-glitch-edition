// A CARA DE DITTO (pedido do CAIO, nov/2026: "faz ditto ao virar um pkmn ele
// ficar com cara de ditto"). O CAIO marca a cara de cada desenho em
// dev/caraditto.html: clica no OLHO 1, no OLHO 2 e na BOCA. As marcas moram em
// src/data/cara-ditto.json: número do sprite -> { o: [[x,y],[x,y]], b: [x,y] }
// (no desenho de frente). Aqui: o olho e a boca velhos somem na cor do corpo
// e, no lugar, entram os dois pontinhos e o sorrisinho do DITTO.

const luz = (r, g, b) => (Math.max(r, g, b) + Math.min(r, g, b)) / 510;

/** pinta a cara do DITTO em `dados` (ImageData), com a marca `m` */
export function pintarCaraDitto(dados, m) {
  const W = dados.width, H = dados.height, d = dados.data;
  const a = (x, y) => x >= 0 && y >= 0 && x < W && y < H && d[(y * W + x) * 4 + 3] > 0;
  const pinta = (x, y, c) => { if (!a(x, y)) return; const i = (y * W + x) * 4; d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; };
  const [[xa, ya], [xb, yb]] = [...m.o].sort((p, q) => p[0] - q[0]);
  const dist = Math.max(4, Math.hypot(xb - xa, yb - ya));
  const r = m.r ?? Math.max(2, Math.round(dist * 0.28));   // `r` na marca: olho grande             // o tamanho do olho velho que some
  const [bx, by] = m.b || [Math.round((xa + xb) / 2), Math.round(Math.max(ya, yb) + dist * 0.5)];

  // a BOCA ABERTA (VENUSAUR): o vazio dentro da boca, com corpo dos dois lados e
  // em cima, FECHA (vira corpo, tapado depois) - o DITTO sorri de boca fechada
  const buraco = new Set();
  {
    const rx = Math.max(3, Math.round(dist * 0.5)) * 1.7, ry = Math.max(4, dist * 0.45), fechar = [];
    for (let y = Math.floor(by - ry); y <= by + ry; y++) for (let x = Math.floor(bx - rx); x <= bx + rx; x++) {
      if (x < 0 || y < 0 || x >= W || y >= H || a(x, y) || ((x - bx) / rx) ** 2 + ((y - by) / ry) ** 2 > 1) continue;
      let e = false, dd = false, c = false;
      for (let k = x - 1; k >= bx - rx && !e; k--) e = a(k, y);
      for (let k = x + 1; k <= bx + rx && !dd; k++) dd = a(k, y);
      for (let k = y - 1; k >= by - ry - 2 && !c; k--) c = a(x, k);
      if (e && dd && c) fechar.push(y * W + x);
    }
    for (const k of fechar) { d[k * 4 + 3] = 255; buraco.add(k); }
    var bocaFechada = fechar;
  }
  // o vazio de FORA do desenho (o buraco da boca aberta não é de fora)
  const fora = new Uint8Array(W * H), pilha = [];
  for (let x = 0; x < W; x++) pilha.push([x, 0], [x, H - 1]);
  for (let y = 0; y < H; y++) pilha.push([0, y], [W - 1, y]);
  while (pilha.length) {
    const [x, y] = pilha.pop();
    if (x < 0 || y < 0 || x >= W || y >= H || fora[y * W + x] || a(x, y)) continue;
    fora[y * W + x] = 1; pilha.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  const vazioFora = (x, y) => x < 0 || y < 0 || x >= W || y >= H || fora[y * W + x];
  const beira = (x, y) => vazioFora(x - 1, y) || vazioFora(x + 1, y) || vazioFora(x, y - 1) || vazioFora(x, y + 1);
  const marcaBuraco = (cx, cy, rx, ry) => {
    for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++)
      if (((x - cx) / (rx + 0.5)) ** 2 + ((y - cy) / (ry + 0.5)) ** 2 <= 1 && a(x, y) && !beira(x, y)) buraco.add(y * W + x);
  };
  marcaBuraco(xa, ya, r, r + 1);
  marcaBuraco(xb, yb, r, r + 1);
  const meia = Math.max(3, Math.round(dist * 0.5));
  marcaBuraco(bx, by, m.mb?.[0] ?? meia + 1, m.mb?.[1] ?? Math.max(2, Math.round(dist * 0.22)));
  // o risco escuro GRUDADO no buraco (a boca grande do VENUSAUR, o olho comprido)
  // entra também, até um pouco longe da marca
  const perto = (x, y) => ((x - xa) / (r * 2)) ** 2 + ((y - ya) / (r * 2 + 1)) ** 2 <= 1 || ((x - xb) / (r * 2)) ** 2 + ((y - yb) / (r * 2 + 1)) ** 2 <= 1
    || ((x - bx) / (meia * 1.7)) ** 2 + ((y - by) / Math.max(4, dist * 0.45)) ** 2 <= 1;
  // o OLHO GRANDE e colorido (vermelho, amarelo, branco): perto do olho, o que
  // tem cor bem diferente do corpo em volta dele sai também
  const corEmVolta = (cx, cy) => {
    const cont = new Map(), R0 = r * 2 + 1, R1 = r * 2 + 4;
    for (let y = Math.floor(cy - R1); y <= cy + R1; y++) for (let x = Math.floor(cx - R1); x <= cx + R1; x++) {
      const e = Math.hypot(x - cx, y - cy);
      if (e < R0 || e > R1 || !a(x, y)) continue;
      const i = (y * W + x) * 4;
      if (luz(d[i], d[i + 1], d[i + 2]) < 0.22) continue;
      const k = d[i] + "," + d[i + 1] + "," + d[i + 2];
      cont.set(k, (cont.get(k) || 0) + 1);
    }
    const t = [...cont].sort((p, q) => q[1] - p[1])[0];
    return t ? t[0].split(",").map(Number) : null;
  };
  const olhosCor = [[xa, ya, corEmVolta(xa, ya)], [xb, yb, corEmVolta(xb, yb)]];
  const corDoOlho = (x, y, i) => olhosCor.some(([cx, cy, c]) => c && ((x - cx) / (r * 2)) ** 2 + ((y - cy) / (r * 2 + 1)) ** 2 <= 1
    && Math.abs(d[i] - c[0]) + Math.abs(d[i + 1] - c[1]) + Math.abs(d[i + 2] - c[2]) > 110);
  const fila = [...buraco];
  while (fila.length) {
    const k = fila.pop(), x = k % W, y = (k / W) | 0;
    for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
      const nk = ny * W + nx;
      if (buraco.has(nk) || nx < 0 || ny < 0 || nx >= W || ny >= H || fora[nk] || beira(nx, ny) || !perto(nx, ny)) continue;
      const i = nk * 4;
      // a LÍNGUA (vermelha/rosa) também sai, mas só bem no meio da boca (a
      // bochecha do PICHU é vermelha e fica do lado)
      const lingua = (d[i] > d[i + 1] + 50 && d[i] > d[i + 2] + 20 || luz(d[i], d[i + 1], d[i + 2]) > 0.8) && Math.abs(nx - bx) <= meia && Math.abs(ny - by) <= Math.max(3, dist * 0.45);   // (e os DENTES brancos)
      if (!d[i + 3]) d[i + 3] = 255;                       // buraco de dentro da boca: vira corpo
      else if (luz(d[i], d[i + 1], d[i + 2]) >= 0.3 && !lingua && !corDoOlho(nx, ny, i)) continue;
      buraco.add(nk); fila.push(nk);
    }
  }
  // tapa de FORA PRA DENTRO com a cor dos vizinhos: a sombra de volta continua
  // (nada de mancha lisa). Cor escura (risco, olho) só entra se não tiver outra.
  while (buraco.size) {
    const pintar = [];
    for (const k of buraco) {
      const x = k % W, y = (k / W) | 0, cont = new Map();
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy, nk = ny * W + nx;
        if ((!dx && !dy) || !a(nx, ny) || buraco.has(nk)) continue;
        const i = nk * 4, c = d[i] + "," + d[i + 1] + "," + d[i + 2];
        const peso = (luz(d[i], d[i + 1], d[i + 2]) < 0.22 ? 0.01 : 1) * (dx && dy ? 0.7 : 1);
        cont.set(c, (cont.get(c) || 0) + peso);
      }
      if (cont.size) pintar.push([k, [...cont].sort((p, q) => q[1] - p[1])[0][0].split(",").map(Number)]);
    }
    if (!pintar.length) break;
    for (const [k, c] of pintar) { const i = k * 4; d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; buraco.delete(k); }
  }

  // a boca que fechou ganha o CONTORNO onde encosta no vazio de fora
  if (bocaFechada.length) {
    const cont = new Map();
    for (let i = 0; i < d.length; i += 4) if (d[i + 3] && luz(d[i], d[i + 1], d[i + 2]) < 0.3) { const c = d[i] + "," + d[i + 1] + "," + d[i + 2]; cont.set(c, (cont.get(c) || 0) + 1); }
    const t = [...cont].sort((p, q) => q[1] - p[1])[0];
    if (t) { const c = t[0].split(",").map(Number); for (const k of bocaFechada) { const x = k % W, y = (k / W) | 0; if (beira(x, y)) pinta(x, y, c); } }
  }
  // corpo ESCURO (a mosca, o vaga-lume): a cara preta sumiria, então ela é clarinha
  const fundo = [];
  for (const [x0, y0] of [[xa, ya], [xb, yb], [bx, by]]) for (let j = -3; j <= 3; j++) for (let i = -3; i <= 3; i++) {
    const x = Math.round(x0) + i, y = Math.round(y0) + j;
    if (a(x, y)) { const k = (y * W + x) * 4; fundo.push(luz(d[k], d[k + 1], d[k + 2])); }
  }
  fundo.sort((p, q) => p - q);
  const PRETO = (fundo[fundo.length >> 1] ?? 1) < 0.4 ? [236, 236, 236] : [16, 16, 16];   // a luz do MEIO em volta da cara
  // os OLHOS do DITTO: pontinhos em pé
  const ew = Math.max(2, Math.round(W / 32)), eh = ew + 1;
  for (const [x, y] of [[xa, ya], [xb, yb]])
    for (let j = 0; j < eh; j++) for (let i = 0; i < ew; i++) pinta(x + i - (ew >> 1), y + j - (eh >> 1), PRETO);
  // o SORRISINHO: um risco com as pontas subindo
  for (let x = bx - meia; x <= bx + meia; x++) pinta(x, by, PRETO);
  pinta(bx - meia - 1, by - 1, PRETO); pinta(bx + meia + 1, by - 1, PRETO);
  if (W >= 80) { pinta(bx - meia - 2, by - 2, PRETO); pinta(bx + meia + 2, by - 2, PRETO); }
}
