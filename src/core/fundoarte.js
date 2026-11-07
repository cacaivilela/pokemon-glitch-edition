// O DESENHO DO FUNDO DO MAR (os mapas `fundo_<id>`, src/data/fundo-do-mar.js).
// Pixel por pixel, em código, a partir das tags do mapa:
//   0 = AREIA, com ondulação, pedrinha, concha e estrela-do-mar de vez em quando,
//       e CORAL encostado no paredão;
//   2 = AREIA COM ALGA (onde os selvagens moram), cada tufo com fios de
//       comprimentos diferentes, balançando pra um lado;
//   1 = PAREDÃO de pedra, com a beirada clara em cima e a sombra embaixo;
// e por cima o que os SEGREDOS carimbaram (`geo.decor`): o casco e o convés do
// navio, o mastro, a placa de bronze, os pilares e o piso da ruína.
// A luz azul, os raios e as bolhas NÃO estão aqui: são desenhados por cima, no
// overworld, porque mexem.
const T = 16;

const hash = (x, y, s = 0) => {
  let h = (x * 374761393 + y * 668265263 + s * 2246822519) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
/** ruído suave (manchas grandes, não grão) */
function suave(x, y, s, e) {
  const fx = x / e, fy = y / e, x0 = Math.floor(fx), y0 = Math.floor(fy), tx = fx - x0, ty = fy - y0;
  const k = (t) => t * t * (3 - 2 * t);
  const a = hash(x0, y0, s), b = hash(x0 + 1, y0, s), c = hash(x0, y0 + 1, s), d = hash(x0 + 1, y0 + 1, s);
  return a + (b - a) * k(tx) + (c - a) * k(ty) + (a - b - c + d) * k(tx) * k(ty);
}
const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const PALETAS = {
  kanto: {
    areia: hex("#c9bd92"), areiaEsc: hex("#a99d76"), areiaClara: hex("#ddd2a8"),
    pedra: hex("#43546a"), pedraEsc: hex("#26323f"), pedraClara: hex("#6c809a"),
    alga: [hex("#1d5a44"), hex("#2f8a5e"), hex("#58b874")],
    coral: [[hex("#f07890"), hex("#c04c66")], [hex("#f0a050"), hex("#c07028")], [hex("#b880e0"), hex("#8050b0")]],
  },
  braglitch: {
    areia: hex("#d6bf86"), areiaEsc: hex("#b49c66"), areiaClara: hex("#ead6a0"),
    pedra: hex("#4c5848"), pedraEsc: hex("#2a3328"), pedraClara: hex("#76866c"),
    alga: [hex("#2a5a1e"), hex("#4a8a2a"), hex("#86c048")],
    coral: [[hex("#f05a4a"), hex("#b83228")], [hex("#f0c040"), hex("#b88a18")], [hex("#f080c0"), hex("#b04c88")]],
  },
};
const MADEIRA = [hex("#3a2414"), hex("#5a3a22"), hex("#7a5232"), hex("#9a6e44")];
const PEDRA_RUINA = [hex("#4a4e52"), hex("#6e7478"), hex("#959ca0"), hex("#b8c0c2")];
const MUSGO = hex("#4e7a46"), CRACA = hex("#d8d4c0"), BRONZE = [hex("#5a6a38"), hex("#8a9a50"), hex("#b8c070")];

export function fundoArt(geo) {
  const W = geo.w * T, H = geo.h * T;
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d");
  const img = ctx.createImageData(W, H), d = img.data;
  const P = PALETAS[geo.braglitch || geo.regiao === "braglitch" ? "braglitch" : "kanto"];
  const s = geo.seed || 1;
  const tag = (tx, ty) => (tx < 0 || ty < 0 || tx >= geo.w || ty >= geo.h ? "1" : geo.tags[ty * geo.w + tx]);
  const decor = (tx, ty) => geo.decor?.[`${tx},${ty}`] || null;
  const pinta = (x, y, c, a = 1) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const i = (y * W + x) * 4;
    d[i] = d[i] * (1 - a) + c[0] * a; d[i + 1] = d[i + 1] * (1 - a) + c[1] * a; d[i + 2] = d[i + 2] * (1 - a) + c[2] * a; d[i + 3] = 255;
  };
  const mistura = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];

  // ---------------------------------------------------------- 1) o chão
  for (let ty = 0; ty < geo.h; ty++) {
    for (let tx = 0; tx < geo.w; tx++) {
      const t = tag(tx, ty), x0 = tx * T, y0 = ty * T;
      if (t === "1" && !decor(tx, ty)) {
        // PAREDÃO: manchas de pedra; beirada clara onde em cima é chão, sombra onde embaixo é chão
        const chaoCima = tag(tx, ty - 1) !== "1", chaoBaixo = tag(tx, ty + 1) !== "1";
        const chaoEsq = tag(tx - 1, ty) !== "1", chaoDir = tag(tx + 1, ty) !== "1";
        for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
          const gx = x0 + x, gy = y0 + y;
          // pedras grandes (manchas suaves), com a rachadura escura entre elas
          const n = suave(gx, gy, s, 9) * 0.75 + suave(gx, gy, s + 1, 3) * 0.25;
          const borda = Math.abs(suave(gx, gy, s + 2, 7) - 0.5) < 0.025;
          let c = n < 0.38 ? P.pedraEsc : n > 0.62 ? P.pedraClara : P.pedra;
          if (borda) c = P.pedraEsc;
          else if (hash(gx, gy, s + 3) < 0.04) c = mistura(c, P.pedraClara, 0.5);
          if (chaoCima && y < 3) c = y === 0 ? P.pedraClara : mistura(P.pedraClara, P.pedra, y / 3);
          if (chaoEsq && x < 2) c = mistura(c, P.pedraClara, 0.4);
          if (chaoDir && x > 13) c = mistura(c, P.pedraEsc, 0.5);
          if (chaoBaixo && y > 12) c = mistura(c, P.pedraEsc, (y - 12) / 4);
          pinta(gx, gy, c);
        }
        continue;
      }
      // AREIA: grão, a ondulação (linhas tortas) e a sombra do paredão de cima
      for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
        const gx = x0 + x, gy = y0 + y;
        let c = P.areia;
        const g = hash(gx, gy, s + 2);
        if (g < 0.12) c = P.areiaEsc; else if (g > 0.93) c = P.areiaClara;
        if (((gy + Math.round(Math.sin(gx / 5 + s) * 2)) % 9) === 0 && hash(gx >> 3, gy, s) > 0.3) c = mistura(c, P.areiaEsc, 0.7);
        if (tag(tx, ty - 1) === "1" && !decor(tx, ty - 1) && y < 4) c = mistura(c, P.pedraEsc, (4 - y) * 0.12);
        pinta(gx, gy, c);
      }
      const h = hash(tx, ty, s + 3);
      // pedrinhas, conchas e estrelas-do-mar
      if (h < 0.05) estrela(pinta, x0 + 4 + ((h * 997) % 6 | 0), y0 + 5, P.coral[1]);
      else if (h < 0.11) concha(pinta, x0 + 3 + ((h * 731) % 8 | 0), y0 + 6 + ((h * 113) % 5 | 0));
      else if (h < 0.2) { const px = x0 + 2 + ((h * 517) % 11 | 0), py = y0 + 3 + ((h * 271) % 10 | 0); pinta(px, py, P.pedra); pinta(px + 1, py, P.pedraClara); pinta(px, py + 1, P.pedraEsc); }
      // CORAL: em areia encostada no paredão
      const encosta = tag(tx, ty - 1) === "1" || tag(tx - 1, ty) === "1" || tag(tx + 1, ty) === "1";
      if (t === "0" && encosta && !decor(tx, ty) && hash(tx, ty, s + 4) < 0.35) {
        coral(pinta, x0 + 3 + ((hash(tx, ty, s + 5) * 9) | 0), y0 + 14, P.coral[(hash(tx, ty, s + 6) * 3) | 0], hash(tx, ty, s + 7));
      }
      if (t === "2") alga(pinta, x0, y0, P.alga, hash(tx, ty, s + 8), tag(tx, ty - 1) === "2");
    }
  }

  // ---------------------------------------------------------- 2) os segredos
  for (const [k, tipo] of Object.entries(geo.decor || {})) {
    const [tx, ty] = k.split(",").map(Number), x0 = tx * T, y0 = ty * T;
    const viz = (dx, dy) => (geo.decor?.[`${tx + dx},${ty + dy}`] || "");
    if (tipo === "navio-parede") {
      // o CASCO: tábuas tortas, cracas e o fundo escuro
      for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
        const tabua = ((y0 + y) >> 2) % 2, n = hash(x0 + x, y0 + y, s + 9);
        let c = MADEIRA[tabua ? 1 : 2];
        if ((y & 3) === 0) c = MADEIRA[0];
        if (n < 0.06) c = CRACA; else if (n > 0.9) c = MADEIRA[3];
        if (!viz(0, -1).startsWith("navio") && y < 2) c = MADEIRA[3];
        pinta(x0 + x, y0 + y, c);
      }
    } else if (tipo === "navio-chao" || tipo === "placa-navio" || tipo === "mastro") {
      for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
        let c = ((x0 + x) >> 3) % 2 ? MADEIRA[2] : MADEIRA[3];
        if (((x0 + x) & 7) === 0) c = MADEIRA[1];
        if (hash(x0 + x, y0 + y, s + 10) < 0.04) c = MUSGO;
        pinta(x0 + x, y0 + y, c);
      }
      if (tipo === "mastro") {
        for (let y = 0; y < T; y++) for (let x = 5; x < 11; x++) pinta(x0 + x, y0 + y, x < 7 ? MADEIRA[3] : x > 8 ? MADEIRA[0] : MADEIRA[2]);
        if (!viz(0, -1).startsWith("mastro")) for (let x = 2; x < 14; x++) pinta(x0 + x, y0 + 4, MADEIRA[0]);   // a verga
      }
      if (tipo === "placa-navio") placa(pinta, x0, y0, BRONZE, true);
    } else if (tipo === "pilar") {
      // o PILAR: coluna de pedra com o capitel e musgo descendo
      // embaixo do pilar, o piso da ruína
      for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) pinta(x0 + x, y0 + y, x === 0 || y === 0 ? PEDRA_RUINA[0] : PEDRA_RUINA[1]);
      // o fuste com as caneluras, o capitel largo em cima e a base embaixo
      for (let y = 0; y < T; y++) {
        const largo = y < 3 || y > 12;
        for (let x = largo ? 1 : 3; x < (largo ? 15 : 13); x++) {
          let c;
          if (largo) c = y === 0 || y === 15 ? PEDRA_RUINA[0] : y === 1 || y === 13 ? PEDRA_RUINA[3] : PEDRA_RUINA[2];
          else c = x === 3 ? PEDRA_RUINA[3] : x === 12 ? PEDRA_RUINA[0] : (x % 3 === 0 ? PEDRA_RUINA[1] : PEDRA_RUINA[2]);
          if (!largo && hash(x0 + x, y0 + y, s + 11) < 0.1) c = MUSGO;
          pinta(x0 + x, y0 + y, c);
        }
      }
    } else if (tipo === "ruina-chao" || tipo === "placa-pedra") {
      for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
        let c = PEDRA_RUINA[1];
        if (x === 0 || y === 0) c = PEDRA_RUINA[0];
        else if (hash(x0 + x, y0 + y, s + 12) < 0.08) c = MUSGO;
        else if (hash(x0 + x, y0 + y, s + 13) > 0.9) c = PEDRA_RUINA[2];
        pinta(x0 + x, y0 + y, c);
      }
      if (tipo === "placa-pedra") placa(pinta, x0, y0, PEDRA_RUINA, false);
    }
  }
  ctx.putImageData(img, 0, 0);
  return cv;
}

function estrela(pinta, x, y, [c, e]) {
  for (const [dx, dy] of [[2, 0], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [2, 1], [2, 3], [1, 4], [3, 4]]) pinta(x + dx, y + dy, c);
  pinta(x + 2, y + 2, e);
}
function concha(pinta, x, y) {
  const c = [240, 220, 210], e = [200, 160, 160];
  for (const [dx, dy] of [[1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [3, 1], [0, 2], [3, 2], [1, 2], [2, 2]]) pinta(x + dx, y + dy, dy === 2 && (dx === 1 || dx === 2) ? e : c);
}
function coral(pinta, x, y, [c, e], h) {
  // uma moita de coral: o tronco grosso e os galhos abrindo em leque, com as
  // pontas redondas e mais claras
  const claro = [Math.min(255, c[0] + 40), Math.min(255, c[1] + 40), Math.min(255, c[2] + 40)];
  const galhos = 3 + ((h * 3) | 0);
  for (let i = 0; i < 3; i++) { pinta(x, y - i, e); pinta(x + 1, y - i, c); }
  for (let g = 0; g < galhos; g++) {
    const ang = -Math.PI / 2 + (g - (galhos - 1) / 2) * 0.55, alto = 5 + (((h * 31 + g * 7) % 4) | 0);
    let px = x + 0.5, py = y - 2;
    for (let i = 0; i < alto; i++) {
      px += Math.cos(ang) * 0.9; py += Math.sin(ang) * 0.9;
      pinta(Math.round(px), Math.round(py), i < 2 ? e : c);
    }
    const tx = Math.round(px), ty = Math.round(py);
    pinta(tx, ty, claro); pinta(tx + 1, ty, claro); pinta(tx, ty - 1, claro); pinta(tx + 1, ty - 1, c);
  }
}
function alga(pinta, x0, y0, [esc, meio, claro], h, emendada) {
  // três a quatro fios, cada um de um comprimento, ondulando
  const n = 3 + ((h * 2) | 0);
  for (let k = 0; k < n; k++) {
    const bx = x0 + 2 + (((h * 97 + k * 4.3) % 12) | 0);
    const alto = emendada ? 16 : 7 + (((h * 53 + k * 3.7) % 8) | 0);
    for (let i = 0; i < alto; i++) {
      const x = bx + Math.round(Math.sin(i / 2.5 + k + h * 6) * 1.2), y = y0 + 15 - i;
      pinta(x, y, i > alto - 3 ? claro : meio);
      pinta(x + 1, y, esc);
      if (i % 4 === 2) pinta(x - 1, y, claro);     // a folhinha
    }
  }
}
function placa(pinta, x0, y0, cores, bronze) {
  for (let y = 3; y < 13; y++) for (let x = 2; x < 14; x++) {
    let c = cores[2];
    if (y === 3 || x === 2) c = cores[cores.length - 1];
    else if (y === 12 || x === 13) c = cores[0];
    else if (y % 2 === 0 && x > 3 && x < 12 && ((x * 7 + y) % 5) < 3) c = cores[bronze ? 0 : 1];   // as letras
    pinta(x0 + x, y0 + y, c);
  }
}
