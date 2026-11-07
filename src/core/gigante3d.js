// O QUE É 3D: o mundo é 2D, mas alguns bichos são MODELOS 3D de verdade.
//
// O mapa, o herói, os NPCs e as batalhas continuam sendo pixel art. Ser 3D não
// é ser gigante: cada um tem o TAMANHO REAL dele perto do herói. O RAYQUAZA
// cruzando o céu é do tamanho da tela, passa por cima de você e faz sombra no
// chão; os REGIS, em pé no mapa, têm umas três alturas do herói.
//
// O MODELO DO RAYQUAZA É O SPRITE DE BATALHA DELE, EM VOLTA (assets/sprites/pokemon/384.png):
// - a PALETA é a do sprite, cor por cor: os quatro verdes, os três amarelos, o
//   vinho da borda das barbatanas, o rosa da boca, o branco das garras;
// - o corpo tem as marcas do sprite: ANÉIS amarelos nos lados, ligados por uma
//   LINHA amarela, como um "O—O—O" (é uma textura calculada na hora, pela
//   posição no corpo e o ângulo em volta dele);
// - as BARBATANAS são largas, em pares, com a borda vinho, e batem enquanto ele
//   voa; o RABO é um tridente com a mesma borda;
// - a CABEÇA tem o focinho comprido, a MANDÍBULA que abre (quando ele ruge, a
//   boca rosa aparece com os dentes), os olhos amarelos com pupila, as linhas
//   amarelas da boca e da testa, os dois pares de CHIFRES em lâmina pra trás e
//   as barbatanas das bochechas; e os BRACINHOS com três garras brancas.
//
// E pra não destoar do resto, o 3D sai do mesmo jeito que um sprite do FireRed:
// - é rasterizado aqui mesmo, sem biblioteca, NA RESOLUÇÃO DO JOGO (240x160):
//   cada pixel do modelo é um pixel da tela, sem suavização nenhuma;
// - a luz é calculada por pixel (o corpo é redondo, não facetado), mas cai em
//   DEGRAUS: só os tons da paleta, como alguém pintando à mão;
// - e ele ganha o CONTORNO PRETO de 1 pixel que o sprite tem, por fora e onde o
//   corpo passa por cima de si mesmo.
//
// Pego, ele vira um da equipe como qualquer outro, e te segue em 2D com o
// sprite de batalha (src/scenes/overworld.js, `drawCompanheiro`): longe do céu
// ele cabe num desenho.
//
// Espaço da câmera: x pra direita, y pra cima, z entrando na tela. A câmera
// olha de cima pro mapa, como a do jogo — o chão é o plano z = CHAO, e o bicho
// voa entre ele e você.
import { REGIS } from "../data/regis.js";

const W = 240, H = 160;
const F = 150;                 // distância focal, em pixels
const PERTO = 4;               // nada mais perto que isso é desenhado
const CHAO = 170;              // o plano do mapa
const LUZ = norm([-0.45, 0.8, -0.4]);   // o sol vem de cima, um pouco à esquerda e de frente
const TAU = Math.PI * 2;

// --------------------------------------------------------------- os gigantes
//
// `chance`: a cada passo ao ar livre (olhar pro céu com O multiplica por
// `noCeu`). Pego uma vez, não passa mais (`flags.gigantes[id]`).
export const GIGANTES = {
  rayquaza: {
    nivel: 70,
    item: "esfera de jade",    // usada pela mochila, chama ele (o cientista de Fuchsia vende)
    preco: 5000,
    // ZERO: ele não passa mais sozinho no céu, só vem chamado pela ESFERA DE
    // JADE (pedido do CAIO). Era 1 / 900 por passo, 120x olhando pro céu.
    chance: 0,
    noCeu: 120,
    comprimento: 78,
    gomos: 60,
    // o pescoço é mais fino que o corpo, e o rabo afina até virar o tridente
    raio: (s) => s < 0.14 ? 2.3 + (s / 0.14) * 0.9
      : s < 0.55 ? 3.2
      : 3.2 - ((s - 0.55) / 0.45) ** 1.3 * 2.6,
    // as cores do sprite (assets/sprites/pokemon/384.png), do claro pro escuro
    paleta: {
      verde: ["#94deb4", "#5abd8b", "#4a8373", "#295241"],
      amarelo: ["#f6de00", "#f6de00", "#c5a400", "#836231"],
      vinho: ["#e65273", "#9c2952", "#732939", "#732939"],
      boca: ["#e65273", "#e65273", "#bd628b", "#9c2952"],
      branco: ["#ffffff", "#ffffff", "#ded5ee", "#ded5ee"],
      contorno: "#000000",
    },
    malha: malhaRayquaza,
  },
};

/** O caminho da cabeça no ar, por fase. O corpo é a cabeça de antes: o gomo s
 *  está onde a cabeça estava `s * comprimento / v` segundos atrás — é isso que
 *  faz a serpente ondular em vez de deslizar dura.
 *
 *  `U` diz pra onde ficam as COSTAS dele naquele instante: passando por cima,
 *  as costas viram pra câmera (você vê ele de cima, como vê o mapa); enrolado
 *  no anel, as costas viram pra fora do anel e é o LADO dele que fica de frente
 *  pra você — o olho, os anéis amarelos, o perfil do sprite.
 *
 *  `rugido` (0 a 1) abre a boca: ele ruge quando o grito toca
 *  (src/scenes/overworld.js, `andarGigante`). */
export const FASES = {
  // entra embaixo à esquerda, sobe na diagonal e sai em cima à direita
  passa: {
    dura: 5.6, v: 54,
    P: (t) => [-80 + 52 * t, -30 + 11 * t + 8 * Math.sin(t * 2.4), 64 + 8 * Math.sin(t * 1.3)],
    U: () => [0, 0.5, -1],
    rugido: (t) => pulso(t, 1.3, 2.6),
  },
  // volta lá do fundo e fica dando voltas em cima de você, enrolado em anel
  volta: {
    v: 24,
    P: (t) => {
      const k = Math.max(0, 1 - t / 2.2), e = k * k;
      const th = 1.6 * t;
      return [15 * Math.cos(th), 14 + 34 * e + 9 * Math.sin(th), 48 + 280 * e + 6 * Math.sin(th)];
    },
    U: (t) => {
      const th = 1.6 * t;
      return [Math.cos(th), Math.sin(th) * 0.6, -0.55];   // pra fora do anel, e um pouco pra você
    },
    rugido: (t) => pulso(t, 3.3, 5),
  },
};

/** 0 → 1 → 0 entre `a` e `b`: abre rápido, segura, fecha devagar */
function pulso(t, a, b) {
  if (t <= a || t >= b) return 0;
  const k = (t - a) / (b - a);
  return k < 0.2 ? k / 0.2 : k < 0.6 ? 1 : 1 - (k - 0.6) / 0.4;
}

export const ehImenso = (species) => !!GIGANTES[species];
/** O gigante que um item chama (a ESFERA DE JADE → rayquaza), ou null. */
export const giganteDoItem = (item) => Object.keys(GIGANTES).find((id) => GIGANTES[id].item === item) || null;

// `?gigante=rayquaza` na URL: ele passa no primeiro passo ao ar livre
let daUrl = (() => {
  try { return new URLSearchParams(location.search).get("gigante"); } catch { return null; }
})();
export const giganteDaUrl = () => (GIGANTES[daUrl] ? daUrl : null);

/** Qual gigante passa agora (ou null). `olhandoPraCima`: a chance é a `noCeu`. */
export function gigantePraPassar(st, olhandoPraCima = false) {
  const pegos = st.flags?.gigantes || {};
  if (giganteDaUrl()) { const id = daUrl; daUrl = null; return id; }
  for (const [id, g] of Object.entries(GIGANTES)) {
    if (!g.chance) continue;                // os do chão não passam no céu
    if (!pegos[id] && Math.random() < g.chance * (olhandoPraCima ? g.noCeu : 1)) return id;
  }
  return null;
}

// ------------------------------------------------------------------- vetores
function norm(v) { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
/** p + a*A + b*B + c*C: um ponto escrito num referencial */
const em = (p, A, a, B, b, C, c) => [
  p[0] + A[0] * a + B[0] * b + C[0] * c,
  p[1] + A[1] * a + B[1] * b + C[1] * c,
  p[2] + A[2] * a + B[2] * b + C[2] * c,
];
/** o referencial `r` girado de `ang` em volta do eixo S (positivo = nariz pra baixo) */
const inclina = (r, ang) => {
  const c = Math.cos(ang), s = Math.sin(ang);
  return { ...r, T: norm(em([0, 0, 0], r.T, c, r.U, -s, r.S, 0)), U: norm(em([0, 0, 0], r.U, c, r.T, s, r.S, 0)) };
};

/** A espinha: um referencial por gomo. T aponta pra frente (pra cabeça), U pras
 *  costas (o `U` da fase, tirado o que ele tiver na direção de T) e S pro lado. */
function espinha(g, fase, t) {
  const D = g.comprimento / fase.v, out = [];
  for (let i = 0; i <= g.gomos; i++) {
    const s = i / g.gomos, ts = t - s * D;
    const p = fase.P(ts);
    const T = norm(sub(fase.P(ts + 0.02), fase.P(ts - 0.02)));
    const quer = norm(fase.U(ts));
    let U = sub(quer, mul(T, dot(quer, T)));
    if (Math.hypot(...U) < 1e-3) U = [0, 1, 0];
    U = norm(U);
    const S = norm(cross(T, U));
    out.push({ s, p, T, U, S, r: g.raio(s) });
  }
  return out;
}

// --------------------------------------------------------------------- malha
//
// Um triângulo é { p: [a, b, c], n, t, m, rim }:
// - `n`: as normais dos três cantos (superfície lisa, a luz desliza por ela);
//   sem `n`, é uma PLACA fina (barbatana, chifre) e a normal vira pra câmera;
// - `t`: coordenadas de textura dos cantos ([u, v, w]), pro material que tem
//   desenho (as marcas do corpo, o olho);
// - `m`: o material (ver `MAT`);
// - `rim`: quais arestas ganham a BORDA VINHO (1: a→b, 2: b→c, 4: c→a).
const MAT = { CORPO: 0, CABECA: 1, PELE: 2, ALETA: 3, OLHO: 4, BOCA: 5, UNHA: 6, CHIFRE: 7, VINHO: 8, CODIGO: 9 };

/** O CONSTRUTOR DE MALHA: as peças de montar (tubo, placa, elipsoide, pedra,
 *  cristal) empilhando triângulos numa lista. `parte()` começa uma PEÇA nova:
 *  o contorno preto passa entre uma peça e outra (cada pedra do REGIROCK, o
 *  ombro e o braço do REGISTEEL), como as linhas internas de um sprite. */
function obra() {
  const tris = [];
  let parte = 0;
  const o = {
    tris,
    parte() { parte = (parte % 250) + 1; return o; },
    tri(a, b, c, m, rim = 0, t = null, fixo = -1) { tris.push({ p: [a, b, c], n: null, t, m, rim, parte, fixo }); },

    /** Um tubo de seções elípticas (corpo, cabeça, mandíbula, braço). Cada
     *  seção: { c, A, B, ra, rb, u, w }; a normal é a da elipse, e a textura
     *  sai em [u, v = ângulo/volta, w]. `fim`/`ini`: fecham as pontas num bico.
     *  `facetado`: cada face com a luz dela (cristal), em vez de redondo.
     *  `giro`: gira as faces em volta do eixo (pra ter uma face de frente). */
    tubo(secoes, lados, m, fim = null, { facetado = false, giro = 0, ini = null } = {}) {
      const vert = secoes.map((q) => Array.from({ length: lados + 1 }, (_, k) => {
        const a = (k / lados) * TAU + giro, ca = Math.cos(a), sa = Math.sin(a);
        return {
          p: em(q.c, q.A, ca * q.ra, q.B, sa * q.rb, q.A, 0),
          n: norm(em([0, 0, 0], q.A, ca / q.ra, q.B, sa / q.rb, q.A, 0)),
          t: [q.u ?? 0, k / lados, q.w ?? 0],
        };
      }));
      const push = (a, b, c) => tris.push({ p: [a.p, b.p, c.p], n: facetado ? null : [a.n, b.n, c.n],
        t: [a.t, b.t, c.t], m, rim: 0, parte, fixo: -1 });
      for (let i = 0; i < secoes.length - 1; i++) {
        for (let k = 0; k < lados; k++) {
          const a = vert[i][k], b = vert[i][k + 1], c = vert[i + 1][k + 1], d = vert[i + 1][k];
          push(a, b, c);
          push(a, c, d);
        }
      }
      for (const [ponta, anel, q] of [[fim, vert[vert.length - 1], secoes[secoes.length - 1]], [ini, vert[0], secoes[0]]]) {
        if (!ponta) continue;
        const pn = { p: ponta, n: norm(sub(ponta, q.c)), t: [q.u ?? 0, 0, q.w ?? 0] };
        for (let k = 0; k < lados; k++) push(anel[k], anel[k + 1], pn);
      }
    },

    /** Um bastão de `a` a `b` (braço, perna), redondo, afinando de r1 pra r2 */
    haste(a, b, r1, r2, m, lados = 7) {
      const T = norm(sub(b, a));
      let A = cross(T, [0, 0, 1]);
      if (Math.hypot(...A) < 1e-3) A = cross(T, [1, 0, 0]);
      A = norm(A);
      const B = norm(cross(T, A));
      o.tubo([{ c: a, A, B, ra: r1, rb: r1 }, { c: b, A, B, ra: r2, rb: r2 }], lados, m, null);
    },

    /** Uma PLACA GROSSA (barbatana, chifre, raio): o polígono `pts` (convexo,
     *  em ordem), com `esp` de espessura. As duas faces são do material `m`; a
     *  lateral é `mBorda` nas arestas marcadas em `rimMask` (bit i:
     *  pts[i]→pts[i+1]) e do próprio material nas outras. De frente, a borda
     *  aparece como uma faixa na beirada; de lado, a placa vira um bloco, não
     *  um risco. */
    placa(pts, rimMask, esp, m = MAT.ALETA, mBorda = MAT.VINHO, fixo = -1) {
      const nn = pts.length;
      const nrm = norm(cross(sub(pts[1], pts[0]), sub(pts[2], pts[0])));
      const meia = mul(nrm, esp / 2);
      const cima = pts.map((q) => [q[0] + meia[0], q[1] + meia[1], q[2] + meia[2]]);
      const baixo = pts.map((q) => [q[0] - meia[0], q[1] - meia[1], q[2] - meia[2]]);
      const r = (i) => (rimMask >> i) & 1;
      for (const face of [cima, baixo]) {
        for (let i = 1; i < nn - 1; i++) {
          const bits = (i === 1 && r(0) ? 1 : 0) | (r(i) ? 2 : 0) | (i + 1 === nn - 1 && r(nn - 1) ? 4 : 0);
          o.tri(face[0], face[i], face[i + 1], m, mBorda === MAT.VINHO ? bits : 0, null, fixo);
        }
      }
      for (let i = 0; i < nn; i++) {
        const j = (i + 1) % nn, lm = r(i) ? mBorda : m;
        o.tri(cima[i], cima[j], baixo[j], lm, 0, null, fixo);
        o.tri(cima[i], baixo[j], baixo[i], lm, 0, null, fixo);
      }
    },

    /** Um ELIPSOIDE liso (corpo, ombro, punho), com a normal certa de elipsoide
     *  e textura [altura 0..1, volta 0..1] pro material que tem desenho. */
    elipsoide(c, rx, ry, rz, m, lados = 12, aneis = 8) {
      const P = (i, k) => {
        const f = -Math.PI / 2 + (i / aneis) * Math.PI, th = (k / lados) * TAU;
        const x = Math.cos(f) * Math.cos(th), y = Math.sin(f), z = Math.cos(f) * Math.sin(th);
        return { p: [c[0] + x * rx, c[1] + y * ry, c[2] + z * rz], n: norm([x / rx, y / ry, z / rz]), t: [i / aneis, k / lados, 0] };
      };
      for (let i = 0; i < aneis; i++) {
        for (let k = 0; k < lados; k++) {
          const a = P(i, k), b = P(i, k + 1), cc = P(i + 1, k + 1), d = P(i + 1, k);
          for (const [x, y, z] of [[a, b, cc], [a, cc, d]]) {
            tris.push({ p: [x.p, y.p, z.p], n: [x.n, y.n, z.n], t: [x.t, y.t, z.t], m, rim: 0, parte, fixo: -1 });
          }
        }
      }
    },

    /** Uma PEDRA: um icosaedro amassado, de faces chapadas (a luz bate em
     *  cada face de um jeito, como pedra lascada). `semente` decide o amassado. */
    pedra(c, rx, ry, rz, m, semente = 1) {
      const rnd = sorteio(semente);
      const vs = ICO.v.map((q) => {
        const k = 0.84 + rnd() * 0.28;
        return [c[0] + q[0] * rx * k, c[1] + q[1] * ry * k, c[2] + q[2] * rz * k];
      });
      for (const [a, b, d] of ICO.f) o.tri(vs[a], vs[b], vs[d], m);
    },

    /** Um CRISTAL de `base` até `ponta`: bico curto embaixo, prisma, bico
     *  comprido em cima. Faces chapadas. */
    cristal(base, ponta, r, m, lados = 6, giro = 0) {
      const ax = sub(ponta, base), len = Math.hypot(...ax), T = mul(ax, 1 / len);
      let A = cross(T, [0, 0, 1]);
      if (Math.hypot(...A) < 1e-3) A = cross(T, [1, 0, 0]);
      A = norm(A);
      const B = norm(cross(T, A));
      const sec = (k) => ({ c: em(base, T, len * k, A, 0, B, 0), A, B, ra: r, rb: r });
      o.tubo([sec(0.12), sec(0.62)], lados, m, ponta, { facetado: true, giro, ini: em(base, T, -len * 0.12, A, 0, B, 0) });
    },
  };
  return o;
}

/** Um sorteio que sempre sai igual pra mesma semente */
function sorteio(semente) {
  let h = (semente * 2654435761) >>> 0 || 1;
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0) % 10000) / 10000;
}
const ICO = (() => {
  const t = (1 + Math.sqrt(5)) / 2;
  const v = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
             [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]].map(norm);
  const f = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2],
             [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5],
             [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
  return { v, f };
})();

function malhaRayquaza(esp, g, tempo, rugido) {
  const o = obra();
  const { tris, tri } = o;
  const tubo = (secoes, lados, m, fim = null) => o.tubo(secoes, lados, m, fim);
  const placa = (pts, rimMask, esp2, m = MAT.ALETA) => o.placa(pts, rimMask, esp2, m);
  const L = g.comprimento;

  // ------------------------------------------------------------- O CORPO
  tubo(esp.map((e) => ({ c: e.p, A: e.S, B: e.U, ra: e.r, rb: e.r * 0.92, u: e.s * L, w: e.r })),
       12, MAT.CORPO, em(esp[esp.length - 1].p, esp[esp.length - 1].T, -1.2, esp[0].U, 0, esp[0].S, 0));

  // ------------------------------------------------------------- A CABEÇA
  // `n` é a nuca; a cabeça é mais larga que o pescoço e sai pra frente dele.
  // Ela inclina um pouco pra baixo quando ruge, como quem joga o grito.
  const n = inclina(esp[0], rugido * 0.12);
  const K = 1.4;
  const no = (x, u, s) => em(n.p, n.T, x * K, n.U, u * K, n.S, s * K);
  const CRANIO = [   // [x pra frente, u pra cima, meia-largura, meia-altura]
    [0, 0, esp[0].r / K, esp[0].r / K * 0.95],
    [1.6, 0.5, 2.6, 2.4],
    [3.4, 0.7, 2.45, 2.05],
    [5.2, 0.45, 1.85, 1.45],
    [7, 0.2, 1.2, 0.95],
    [8.2, 0.05, 0.75, 0.6],
  ];
  tubo(CRANIO.map(([x, u, ra, rb]) => ({ c: no(x, u, 0), A: n.S, B: n.U, ra: ra * K, rb: rb * K, u: x / 8.6, w: 0 })),
       12, MAT.CABECA, no(8.9, 0, 0));

  // a MANDÍBULA: dobradiça embaixo da cabeça, gira pra baixo com o rugido
  const boca = 0.14 + rugido * 0.34;
  const dob = no(1.2, -1.15, 0);
  const mj = inclina({ ...n, p: dob }, boca);
  const qx = (x, u, s) => em(dob, mj.T, x * K, mj.U, u * K, mj.S, s * K);
  const QUEIXO = [[0, 0, 2.1, 0.95], [2.6, -0.05, 1.75, 0.75], [5, 0.05, 1.1, 0.55], [6.3, 0.1, 0.6, 0.35]];
  tubo(QUEIXO.map(([x, u, ra, rb]) => ({ c: qx(x, u, 0), A: n.S, B: mj.U, ra: ra * K, rb: rb * K, u: 0, w: 0 })),
       10, MAT.PELE, qx(6.9, 0.1, 0));

  // o céu da boca e a língua: rosa, entre as duas mandíbulas
  for (const lado of [-1, 1]) {
    tri(dob, no(7.6, -0.35, 0.55 * lado), qx(6.2, 0.45, 0.5 * lado), MAT.BOCA);
  }
  tri(qx(0.5, 0.5, -1.2), qx(0.5, 0.5, 1.2), qx(5.4, 0.55, 0), MAT.BOCA);
  // os dentes: dois em cima, dois embaixo, na ponta
  for (const lado of [-1, 1]) {
    const d = no(6.6, -0.55, 0.7 * lado);
    tri(d, no(7.3, -0.5, 0.55 * lado), em(d, n.U, -0.7 * K * (0.4 + boca), n.T, 0.25, n.S, 0), MAT.UNHA);
    const e = qx(5.2, 0.45, 0.6 * lado);
    tri(e, qx(5.8, 0.4, 0.45 * lado), em(e, mj.U, 0.6 * K, mj.T, 0.2, n.S, 0), MAT.UNHA);
  }

  for (const lado of [-1, 1]) {
    // OS OLHOS: no lado da cabeça, logo abaixo da testa, puxados pra trás
    // (bravo); a pupila é desenhada pela textura
    const o = no(3.1, 0.95, 2.47 * lado);
    const ox = (x, u) => em(o, n.T, x * K, n.U, u * K, n.S, 0.06 * lado);
    const [a, b, c, d] = [ox(-0.8, 0.25), ox(0.9, 0.05), ox(0.75, -0.45), ox(-0.6, -0.25)];
    tri(a, b, c, MAT.OLHO, 0, [[0, 1, 0], [1, 1, 0], [1, 0, 0]]);
    tri(a, c, d, MAT.OLHO, 0, [[0, 1, 0], [1, 0, 0], [0, 0, 0]]);

    // OS CHIFRES: duas lâminas de cada lado, compridas, pra trás e pra cima.
    // A de cima é a maior (a silhueta do sprite), a de baixo acompanha
    placa([no(3.2, 2.1, 0.8 * lado), no(-0.8, 5.2, 1.4 * lado), no(-8.6, 8.4, 2.6 * lado),
           no(-3.6, 4, 1.7 * lado), no(0.3, 1.8, 1.2 * lado)], 0, 0.5, MAT.CHIFRE);
    placa([no(1.4, 1.2, 1.8 * lado), no(-2.2, 2.8, 2.9 * lado), no(-6.4, 4.2, 4 * lado),
           no(-2.4, 1.6, 2.5 * lado), no(-0.6, 0.8, 2.2 * lado)], 0, 0.45, MAT.CHIFRE);

    // as barbatanas das bochechas, saindo de trás da boca
    const bb = no(2.2, -0.6, 2.1 * lado);
    placa([bb, no(0.2, -0.3, 2.3 * lado), no(-3.8, -1.4, 4.4 * lado)], 2 | 4, 0.4);
  }

  // ------------------------------------------------------------- OS BRAÇOS
  // pequenos, logo atrás do pescoço, dobrados pra frente, com três garras
  const om = esp[Math.round(esp.length * 0.13)];
  const bate = Math.sin(tempo * 3.1) * 0.25;
  for (const lado of [-1, 1]) {
    const ombro = em(om.p, om.S, om.r * 0.8 * lado, om.U, -om.r * 0.35, om.T, 0);
    const cot = em(ombro, om.S, 2.2 * lado, om.U, -1.6, om.T, -0.6 + bate);
    const mao = em(cot, om.S, 0.5 * lado, om.U, -0.6, om.T, 2.2);
    const braco = (a, b, r1, r2) => {
      const T = norm(sub(b, a)), A = norm(cross(T, om.U)), B = norm(cross(A, T));
      tubo([{ c: a, A, B, ra: r1, rb: r1, u: 0, w: 0 }, { c: b, A, B, ra: r2, rb: r2, u: 0, w: 0 }], 6, MAT.PELE);
    };
    braco(ombro, cot, 0.85, 0.6);
    braco(cot, mao, 0.6, 0.5);
    for (const k of [-1, 0, 1]) {
      const raiz = em(mao, om.S, 0.35 * k, om.U, 0, om.T, 0.2);
      tri(em(raiz, om.S, -0.2, om.U, 0, om.T, 0), em(raiz, om.S, 0.2, om.U, 0, om.T, 0),
          em(raiz, om.S, 0.15 * k, om.U, -0.7, om.T, 0.9), MAT.UNHA);
    }
  }

  // ------------------------------------------------------- AS BARBATANAS
  // em pares, largas, varridas pra trás, com a borda vinho por fora — e batem
  // devagar, cada par num tempo (a onda corre do pescoço pro rabo)
  const PARES = [[0.2, 7.5], [0.42, 6.6], [0.64, 5.4]];
  PARES.forEach(([s, tam], i) => {
    const e = esp[Math.round(s * (esp.length - 1))];
    const asa = 0.35 + Math.sin(tempo * 4 - i * 0.9) * 0.3;     // o ângulo pra cima
    for (const lado of [-1, 1]) {
      const fora = (x, d) => em(e.p, e.T, x, e.S, (e.r * 0.75 + d * Math.cos(asa)) * lado, e.U, e.r * 0.25 + d * Math.sin(asa));
      // uma asa larga: bordo de ataque, ponta varrida pra trás e volta pro corpo
      placa([fora(2.6, 0), fora(0.6, tam * 0.72), fora(-3, tam), fora(-6.4, tam * 0.86), fora(-2.8, 0)], 0b1111, 0.9);
    }
  });

  // ------------------------------------------------------------- O RABO
  // um tridente: a ponta do meio comprida, as dos lados abertas em leque
  const z = esp[esp.length - 1];
  const rb = (x, s, u = 0) => em(z.p, z.T, x, z.S, s, z.U, u);
  placa([rb(0.6, -1), rb(-8.5, 0), rb(0.6, 1)], 0b11, 0.6);
  for (const lado of [-1, 1]) {
    placa([rb(0.4, 0.4 * lado), rb(-5.4, 5.2 * lado, 0.6), rb(-1.8, 0.7 * lado)], 0b11, 0.6);
    placa([rb(-0.2, 0.3 * lado), rb(-3.6, 3 * lado, -0.5), rb(-2.6, 0.5 * lado)], 0b11, 0.5);
  }
  return tris;
}

// ----------------------------------------------------------- as texturas
//
// As marcas amarelas do corpo, como no sprite: um ANEL em cada lado a cada
// tantas unidades de corpo, e uma LINHA ligando um anel no outro. `u` é a
// distância desde a nuca, `v` o ângulo em volta (0 = lado direito, 0.25 =
// costas, 0.5 = lado esquerdo) e `w` o raio ali (pra medir a volta em unidades).
const PASSO_ANEL = 9.5, PRIMEIRO_ANEL = 9;
function marcaDoCorpo(u, v, w, L) {
  if (u < 2 || u > L * 0.9) return false;
  const k = Math.round((u - PRIMEIRO_ANEL) / PASSO_ANEL);
  const du = u - (PRIMEIRO_ANEL + k * PASSO_ANEL);
  for (const vc of [0.06, 0.44]) {
    let dv = v - vc;
    dv -= Math.round(dv);
    const dvu = dv * TAU * w;
    const d = Math.hypot(du / 1.3, dvu);
    if (k >= 0 && u < L * 0.8) {
      if (d > 0.78 && d < 1.2) return true;   // o anel
      if (d <= 0.78) return false;            // o miolo do anel é verde
    }
    if (Math.abs(dvu) < 0.26) return true;    // a linha
  }
  // nas costas, entre um anel e outro: o "∞" do sprite de costas (dois anéis
  // pequenos colados, atravessados no dorso)
  if (u > PRIMEIRO_ANEL && u < L * 0.78) {
    const meio = du - (du > 0 ? 1 : -1) * PASSO_ANEL / 2;     // o ponto entre dois anéis
    let dv = v - 0.25;
    dv -= Math.round(dv);
    const dvu = dv * TAU * w;
    for (const lado of [-0.62, 0.62]) {
      const d = Math.hypot(meio, dvu - lado);
      if (d > 0.4 && d < 0.72) return true;
    }
  }
  return false;
}

/** Na cabeça: a linha da boca de cada lado e a marca curta da testa */
function marcaDaCabeca(u, v) {
  const perto = (a, b, tol) => { let d = a - b; d -= Math.round(d); return Math.abs(d) < tol; };
  if (u > 0.3 && u < 0.86 && (perto(v, 0.955, 0.028) || perto(v, 0.545, 0.028))) return true;
  if (u > 0.1 && u < 0.36 && perto(v, 0.25, 0.03)) return true;
  return false;
}

// ------------------------------------------------------------- rasterização
const hex = (h) => {
  const n = parseInt(h.slice(1), 16);
  return (0xff000000 | ((n & 0xff) << 16) | (n & 0xff00) | (n >> 16)) >>> 0;
};
const SOMBRA = ((80 << 24) | (40 << 16) | (24 << 8) | 20) >>> 0;   // azul quase preto, translúcido

const paletas = new WeakMap();
/** As rampas de cor de um gigante, prontas pro buffer (4 tons cada; quem tem
 *  menos repete o último). `preto` é o contorno. */
function paletaDe(g) {
  let p = paletas.get(g);
  if (!p) {
    p = {};
    for (const [k, a] of Object.entries(g.paleta)) {
      if (k === "contorno") continue;
      const arr = [...a];
      while (arr.length < 4) arr.push(arr[arr.length - 1]);
      p[k] = Uint32Array.from(arr, hex);
    }
    p.preto = hex(g.paleta.contorno || "#000000");
    paletas.set(g, p);
  }
  return p;
}

let tela = null;
function buffers() {
  if (tela) return tela;
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d");
  const img = ctx.createImageData(W, H);
  tela = {
    cv, ctx, img, px: new Uint32Array(img.data.buffer), z: new Float32Array(W * H),
    sombra: new Uint8Array(W * H), borda: new Uint8Array(W * H), parte: new Uint8Array(W * H),
  };
  return tela;
}
function limpar(b) { b.px.fill(0); b.z.fill(0); b.sombra.fill(0); b.borda.fill(0); b.parte.fill(0); }

/** O degrau de luz (0 claro ... 3 escuro) de uma normal */
// de onde vem o sol do desenho de agora: o Rayquaza é visto de cima e a luz
// vem de cima; os Regis estão em pé de frente pra você, e a luz vem da frente,
// de cima à esquerda (senão a cara deles caía no tom mais escuro)
const LUZ_REGI = norm([-0.5, 0.45, -0.75]);
let luz = LUZ;
function degrau(nx, ny, nz) {
  const d = nx * luz[0] + ny * luz[1] + nz * luz[2];
  // calibrado no sprite: a maior parte do corpo é o verde MÉDIO (o terceiro),
  // o lado do sol é o segundo, o brilho é um risco e o escuro é o lado de baixo
  const l = 0.1 + 0.8 * (d > 0 ? d : 0) + (nz < 0 ? -nz * 0.12 : 0);
  return l > 0.9 ? 0 : l > 0.7 ? 1 : l > 0.4 ? 2 : 3;
}

// O PLANO DO CHÃO de quem sobe da terra: o que está abaixo dele não aparece
// ({ o: um ponto do chão, n: pra cima }), ou null
let corte = null;
// o relógio do desenho de agora: a chuva de código do REGIGLITCH anda com ele
let relogio = 0;

/** um número de 0 a 1 que sempre sai igual pro mesmo `n` (o finalizador do
 *  murmur3: espalha bem até sequência de passo fixo, como `i * 3 + k`) */
const hash1 = (n) => {
  let x = Math.imul(n | 0, 0x9e3779b1) >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x85ebca6b) >>> 0;
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35) >>> 0;
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
};

/** A CHUVA DE CÓDIGO (o corpo do REGIGLITCH): roxo uva, com colunas de traços
 *  verde código descendo, cada coluna no seu passo. A cabeça de cada traço é
 *  o verde mais claro. */
function codigo(u, v, d, pal) {
  const col = Math.floor(v * 40);
  const h = hash1(col);
  if (h > 0.45) {
    const y = u * 4 + relogio * (0.6 + h * 1.4) + h * 13;
    const f = y - Math.floor(y);
    if (f < 0.42) return pal.verde[f < 0.05 ? 0 : Math.max(1, d)];
  }
  return pal.roxo[d];
}

/** Um triângulo na tela, com z-buffer e a cor decidida pixel a pixel. */
function rasteriza(b, tr, pal, L) {
  const [A, B, C] = tr.p;
  let dA = 0, dB = 0, dC = 0;
  if (corte) {
    dA = dot(sub(A, corte.o), corte.n); dB = dot(sub(B, corte.o), corte.n); dC = dot(sub(C, corte.o), corte.n);
    if (dA < 0 && dB < 0 && dC < 0) return;     // inteiro debaixo da terra
  }
  const ax = W / 2 + (F * A[0]) / A[2], ay = H / 2 - (F * A[1]) / A[2], aw = 1 / A[2];
  const bx = W / 2 + (F * B[0]) / B[2], by = H / 2 - (F * B[1]) / B[2], bw = 1 / B[2];
  const cx = W / 2 + (F * C[0]) / C[2], cy = H / 2 - (F * C[1]) / C[2], cw = 1 / C[2];
  const area = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
  if (Math.abs(area) < 1e-6) return;
  const x0 = Math.max(0, Math.floor(Math.min(ax, bx, cx)));
  const x1 = Math.min(W - 1, Math.ceil(Math.max(ax, bx, cx)));
  const y0 = Math.max(0, Math.floor(Math.min(ay, by, cy)));
  const y1 = Math.min(H - 1, Math.ceil(Math.max(ay, by, cy)));
  if (x0 > x1 || y0 > y1) return;
  const corta = corte && (dA < 0 || dB < 0 || dC < 0);

  // placa: uma normal só, virada pra câmera
  let fn = null;
  if (!tr.n) {
    fn = norm(cross(sub(B, A), sub(C, A)));
    if (dot(fn, A) > 0) fn = mul(fn, -1);
  }
  const N = tr.n, T = tr.t, m = tr.m;
  const rampa = typeof m === "string" ? (pal[m] || null) : null;
  const fixo = tr.fixo ?? -1, parte = tr.parte || 0;
  // a borda vinho: distância do pixel até a aresta, em pixels
  const dupla = Math.abs(area);
  const lAB = Math.hypot(bx - ax, by - ay) || 1, lBC = Math.hypot(cx - bx, cy - by) || 1, lCA = Math.hypot(ax - cx, ay - cy) || 1;
  const rim = tr.rim;
  // a cor de uma placa sem desenho não muda dentro dela
  const lisa = fn && !rim && m !== MAT.OLHO && m !== MAT.CODIGO;
  let corLisa = 0;
  if (lisa) {
    const d = fixo >= 0 ? fixo : degrau(fn[0], fn[1], fn[2]);
    corLisa = rampa ? rampa[d] : cor(m, d, pal);
  }

  const z = b.z, px = b.px, partes = b.parte;
  for (let y = y0; y <= y1; y++) {
    const py = y + 0.5;
    for (let x = x0; x <= x1; x++) {
      const pxx = x + 0.5;
      const wa = ((bx - pxx) * (cy - py) - (by - py) * (cx - pxx)) / area;
      if (wa < 0) continue;
      const wb = ((cx - pxx) * (ay - py) - (cy - py) * (ax - pxx)) / area;
      if (wb < 0) continue;
      const wc = 1 - wa - wb;
      if (wc < 0) continue;
      const iz = wa * aw + wb * bw + wc * cw;
      const i = y * W + x;
      if (iz <= z[i]) continue;
      // pesos corrigidos pela perspectiva, pra textura não escorregar
      const pa = (wa * aw) / iz, pb = (wb * bw) / iz, pc = (wc * cw) / iz;
      if (corta && pa * dA + pb * dB + pc * dC < 0) continue;
      z[i] = iz;
      partes[i] = parte;
      if (lisa) { px[i] = corLisa; continue; }
      let nx, ny, nz;
      if (N) {
        nx = pa * N[0][0] + pb * N[1][0] + pc * N[2][0];
        ny = pa * N[0][1] + pb * N[1][1] + pc * N[2][1];
        nz = pa * N[0][2] + pb * N[1][2] + pc * N[2][2];
        const l = Math.hypot(nx, ny, nz) || 1;
        nx /= l; ny /= l; nz /= l;
      } else { nx = fn[0]; ny = fn[1]; nz = fn[2]; }
      const d = fixo >= 0 ? fixo : degrau(nx, ny, nz);
      if (rim && (((rim & 1) && (wc * dupla) / lAB < 1.6) || ((rim & 2) && (wa * dupla) / lBC < 1.6)
          || ((rim & 4) && (wb * dupla) / lCA < 1.6))) {
        px[i] = pal.vinho[d];
        continue;
      }
      if (T) {
        const u = pa * T[0][0] + pb * T[1][0] + pc * T[2][0];
        const v = pa * T[0][1] + pb * T[1][1] + pc * T[2][1];
        if (m === MAT.CODIGO) { px[i] = codigo(u, v, d, pal); continue; }
        const w = pa * T[0][2] + pb * T[1][2] + pc * T[2][2];
        if (m === MAT.CORPO && marcaDoCorpo(u, v, w, L)) { px[i] = pal.amarelo[d]; continue; }
        if (m === MAT.CABECA && marcaDaCabeca(u, v)) { px[i] = pal.amarelo[d]; continue; }
        if (m === MAT.OLHO) {
          // a pupila: um risco preto vertical na frente do olho
          px[i] = u > 0.5 && u < 0.78 && v > 0.15 ? pal.preto : pal.amarelo[Math.min(d, 1)];
          continue;
        }
      }
      px[i] = rampa ? rampa[d] : cor(m, d, pal);
    }
  }
}

function cor(m, d, pal) {
  switch (m) {
    case MAT.BOCA: return pal.boca[d];
    case MAT.UNHA: return pal.branco[d];
    case MAT.VINHO: return pal.vinho[d];
    case MAT.OLHO: return pal.amarelo[Math.min(d, 1)];
    case MAT.CHIFRE: return pal.verde[Math.min(3, d + (d === 0 ? 1 : 0))];   // lâmina: sem o brilho
    case MAT.CODIGO: return pal.roxo[d];
    default: return pal.verde[d];
  }
}

/** O CONTORNO: pixel do bicho com vizinho vazio (a borda de fora), com um
 *  vizinho bem mais perto da câmera (onde o corpo passa por cima dele mesmo)
 *  ou com um vizinho mais perto que é de OUTRA PEÇA (a linha entre o braço e
 *  o corpo, entre uma pedra e outra). */
function contorno(b, pal) {
  const z = b.z, px = b.px, borda = b.borda, pt = b.parte;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x, zi = z[i];
      if (!zi) continue;
      const lim = zi * 1.07, eu = pt[i];
      const viz = (j) => { const zv = z[j]; return !zv || zv > lim || (zv > zi && pt[j] !== eu); };
      // quem sai pela beirada da tela não ganha linha ali: o corpo continua lá fora
      if ((x > 0 && viz(i - 1)) || (x < W - 1 && viz(i + 1)) || (y > 0 && viz(i - W)) || (y < H - 1 && viz(i + W))) borda[i] = 1;
    }
  }
  for (let i = 0; i < W * H; i++) if (borda[i]) px[i] = pal.preto;
}

/** A sombra no chão: um disco por gomo, projetado no plano do mapa com o sol
 *  vindo de cima à esquerda. Uma máscara só, pra sombra em cima de sombra não
 *  escurecer mais. */
function marcaSombra(b, esp) {
  for (const g of esp) {
    const alto = CHAO - g.p[2];
    if (alto <= 0) continue;
    const qx = W / 2 + (F * (g.p[0] + alto * 0.3)) / CHAO, qy = H / 2 - (F * (g.p[1] - alto * 0.38)) / CHAO;
    const r = Math.max(1, (g.r * 1.3 * F) / CHAO);
    for (let y = Math.max(0, Math.floor(qy - r)); y <= Math.min(H - 1, Math.ceil(qy + r)); y++) {
      for (let x = Math.max(0, Math.floor(qx - r)); x <= Math.min(W - 1, Math.ceil(qx + r)); x++) {
        if ((x + 0.5 - qx) ** 2 + (y + 0.5 - qy) ** 2 <= r * r) b.sombra[y * W + x] = 1;
      }
    }
  }
}

/** Desenha o gigante `id` na pose da `fase` no instante `t`, por cima do que já
 *  está em `ctx`. `comSombra`: no mapa ele faz sombra no chão; contra o céu, não. */
export function desenharGigante(ctx, id, fase, t, comSombra = true) {
  const g = GIGANTES[id], f = FASES[fase];
  if (!g || !f || !g.malha) return;
  const b = buffers(), pal = paletaDe(g);
  limpar(b);
  corte = null;
  relogio = t;
  luz = LUZ;

  const esp = espinha(g, f, t);
  for (const tr of g.malha(esp, g, t, f.rugido ? f.rugido(t) : 0)) {
    const [A, B, C] = tr.p;
    if (A[2] < PERTO || B[2] < PERTO || C[2] < PERTO) continue;
    rasteriza(b, tr, pal, g.comprimento);
  }
  contorno(b, pal);

  if (comSombra) {
    marcaSombra(b, esp);
    for (let i = 0; i < W * H; i++) if (b.sombra[i] && !b.z[i]) b.px[i] = SOMBRA;
  }
  b.ctx.putImageData(b.img, 0, 0);
  ctx.drawImage(b.cv, 0, 0);
}

// ============================================================ OS REGIS
//
// Os 3D DO CHÃO (src/data/regis.js): dormem nas câmaras das RUÍNAS
// TANOBY e sobem da terra quando alguém encosta nos sete pontos da placa. A
// câmera é a mesma, mas eles ficam EM PÉ no mapa: o "pra cima" deles é o pra
// cima da tela, inclinado pra você — o mesmo 3/4 dos sprites do FireRed, só
// que de verdade. Enquanto sobem, o que ainda está debaixo da terra não
// aparece (o plano de `corte`), o chão racha e solta pedra.
//
// Cada modelo é montado em coordenadas próprias — y pra cima, z pra frente
// (pra você), uns 10 de altura, pé no y = 0 — com as peças do `obra()`, e
// leva a paleta do sprite dele (assets/sprites/pokemon/<dex>.png). Os SETE
// PONTOS do rosto são os da placa (src/data/regis.js, `pontos`): acendem um
// por um, na ordem da lista.

const XR = [1, 0, 0];
const UPR = norm([0, 0.78, -0.62]);     // o pra cima deles: tela acima, e um pouco pra você
const FRR = norm([0, -0.62, -0.78]);    // a frente deles: pra você
const Z_REGI = 64;                      // a que distância da câmera eles ficam

/** quanto dura cada pedaço de acordar: subir, e os sete pontos acendendo */
export const TEMPO_REGI = { sobe: 2.8, ponto: 0.24, acende: 7 * 0.24 + 0.5 };

const suave = (k) => k * k * (3 - 2 * k);

/** Os SETE PONTOS no rosto: quadradinhos colados na superfície `sup`
 *  ([cx, cy, cz, rx, ry, rz], o elipsoide em cima do qual eles ficam). Aceso
 *  é a cor clara e sem sombra (eles brilham); apagado, a escura. `cores`:
 *  uma rampa por ponto, pra quem tem pontos de cores diferentes. */
function pontosDoRosto(o, id, centro, passo, tam, sup, acesos, cores = null) {
  const [cx, cy, cz, rx, ry, rz] = sup;
  REGIS[id].pontos.forEach(([dx, dy], i) => {
    const x = centro[0] + dx * passo, y = centro[1] + dy * passo;
    const k = 1 - ((x - cx) / rx) ** 2 - ((y - cy) / ry) ** 2;
    const zz = cz + rz * Math.sqrt(Math.max(0, k)) + 0.1;
    const h = tam / 2, aceso = i < acesos;
    const m = aceso ? (cores?.[i] || "aceso") : "apagado";
    const q = [[x - h, y + h, zz], [x + h, y + h, zz], [x + h, y - h, zz], [x - h, y - h, zz]];
    o.tri(q[0], q[1], q[2], m, 0, null, aceso ? 0 : 1);
    o.tri(q[0], q[2], q[3], m, 0, null, aceso ? 0 : 1);
  });
}

// ------------------------------------------------------------- REGIROCK
// Um amontoado de pedras: o tronco é um pedregulho bege com remendos laranja,
// os ombros são pedras laranja grandes, os braços e as pernas são pedras
// empilhadas e os punhos, pedras redondas. Cada pedra é uma peça (contorno
// entre elas), de faces chapadas. O rosto é a parte mais lisa, lá em cima.
function regirock(o, t, acesos) {
  const bal = (l) => Math.sin(t * 1.6 + l) * 0.12;
  o.parte(); o.pedra([0, 5.3, 0], 2.5, 2.8, 1.8, "pedra", 1);
  o.parte(); o.pedra([0, 2.6, 0.1], 1.9, 1.1, 1.5, "pedra", 6);
  o.parte(); o.pedra([-1.5, 4.2, 1.0], 1.0, 1.0, 0.8, "laranja", 2);
  o.parte(); o.pedra([1.2, 3.4, 1.0], 1.0, 0.9, 0.8, "laranja", 3);
  o.parte(); o.pedra([1.5, 5.4, 1.0], 0.8, 0.8, 0.7, "pedra", 4);
  o.parte(); o.elipsoide([0, 6.2, 0.75], 1.55, 1.45, 1.3, "pedra", 10, 7);   // o rosto
  pontosDoRosto(o, "regirock", [0, 6.25], 0.56, 0.3, [0, 6.2, 0.75, 1.55, 1.45, 1.3], acesos);
  for (const l of [-1, 1]) {
    o.parte(); o.pedra([2.9 * l, 6.8, 0], 1.55, 1.5, 1.4, "laranja", 10 + l);
    [[3.5, 5.0, 0.8], [3.8, 3.85, 0.72], [4.0, 2.8, 0.7]].forEach(([x, y, r], i) => {
      o.parte(); o.pedra([x * l, y, bal(l) * (i + 1)], r, r * 0.9, r, "pedra", 20 + i * 3 + l);
    });
    o.parte(); o.pedra([4.1 * l, 1.45, 0.3 + bal(l) * 4], 1.3, 1.2, 1.25, "pedra", 30 + l);
    o.parte(); o.pedra([1.2 * l, 1.55, 0], 0.95, 0.85, 0.9, "pedra", 40 + l);
    o.parte(); o.pedra([1.35 * l, 0.5, 0.25], 1.05, 0.55, 1.15, "pedra", 50 + l);
  }
}

// --------------------------------------------------------------- REGICE
// Um cristal de gelo: o corpo é um prisma de oito faces que termina em bico
// (a cabeça), os ombros são cachos de cristal, os braços são cristais grandes
// apontando pra baixo e os pés, espinhos. Tudo de faces chapadas — o gelo
// brilha por face. Os pontos ficam na face da frente.
function regice(o, t, acesos) {
  const sec = (y, r) => ({ c: [0, y, 0], A: [1, 0, 0], B: [0, 0, 1], ra: r, rb: r * 0.85 });
  o.parte();
  o.tubo([sec(0.9, 1.2), sec(2.4, 2.3), sec(5.6, 2.5), sec(7.8, 1.7)], 8, "gelo", [0, 10, 0],
         { facetado: true, giro: Math.PI / 8, ini: [0, 0.2, 0] });
  // a face da frente do prisma (oito faces, giradas: uma fica de frente)
  const zf = (y) => {
    const r = y < 5.6 ? 2.3 + (y - 2.4) / 3.2 * 0.2 : 2.5 - (y - 5.6) / 2.2 * 0.8;
    return r * 0.85 * Math.cos(Math.PI / 8);
  };
  pontosDoRosto(o, "regice", [0, 6.2], 0.4, 0.3, [0, 6.2, 0, 99, 99, zf(6.2) + 0.02], acesos);
  for (const l of [-1, 1]) {
    o.parte();
    o.cristal([1.9 * l, 6.7, 0], [3.6 * l, 8.8, -0.3], 0.75, "gelo");
    o.cristal([2.2 * l, 6.1, 0.2], [4.6 * l, 7.5, 0.4], 0.62, "gelo2");
    o.cristal([1.5 * l, 7.3, -0.4], [2.3 * l, 9.5, -0.8], 0.5, "gelo");
    o.parte();
    const bal = Math.sin(t * 1.4 + l) * 0.15;
    o.cristal([2.5 * l, 5.9, 0.2], [4.4 * l, 2.7, 0.5 + bal], 1.0, "gelo2");
    for (const k of [-1, 0, 1]) {
      o.cristal([4.2 * l, 3.1, 0.5 + bal], [(4.8 + 0.2 * k) * l, 1.8, 0.8 + k * 0.45 + bal], 0.3, "gelo", 4);
    }
    o.parte(); o.cristal([0.95 * l, 1.4, 0], [1.05 * l, -0.3, 0.25], 0.55, "gelo2");
  }
  o.parte(); o.cristal([0, 1.2, 0.2], [0, -0.5, 0.35], 0.45, "gelo2");
}

// ------------------------------------------------------------ REGISTEEL
// Metal liso: um corpo oval, a faixa escura do rosto descendo pela frente,
// os ombros redondos, braços finos e escuros com três garras brancas, e as
// pernas curtas.
function registeel(o, t, acesos) {
  o.parte(); o.elipsoide([0, 4.8, 0], 2.6, 3.4, 2.1, "aco");
  o.parte(); o.elipsoide([0, 2.0, 0], 1.95, 0.55, 1.6, "escuro");
  o.parte(); o.elipsoide([0, 5.4, 0.7], 1.2, 2.5, 1.55, "escuro");   // a faixa do rosto
  pontosDoRosto(o, "registeel", [0, 5.8], 0.42, 0.32, [0, 5.4, 0.7, 1.2, 2.5, 1.55], acesos);
  for (const l of [-1, 1]) {
    const bal = Math.sin(t * 1.5 + l * 1.3) * 0.18;
    o.parte(); o.elipsoide([3.05 * l, 5.8, 0], 1.15, 1.15, 1.15, "aco");
    o.parte();
    o.haste([3.4 * l, 5.0, 0], [3.95 * l, 3.0, 0.4 + bal], 0.45, 0.4, "escuro");
    o.haste([3.95 * l, 3.0, 0.4 + bal], [3.7 * l, 1.9, 0.95 + bal], 0.4, 0.38, "escuro");
    o.elipsoide([3.7 * l, 1.7, 1.0 + bal], 0.6, 0.5, 0.6, "escuro", 8, 6);
    o.parte();
    for (const k of [-1, 0, 1]) {
      const r = [(3.7 + 0.28 * k) * l, 1.5, 1.2 + bal];
      o.placa([r, [r[0] + 0.25 * l, r[1], r[2]], [r[0] + 0.12 * l, r[1] - 1.0, r[2] + 0.5]], 0, 0.2, "garra", "garra");
    }
    o.parte(); o.elipsoide([1.3 * l, 0.9, 0.1], 1.0, 0.95, 1.05, "aco");
  }
}

// ------------------------------------------------------------ REGIGIGAS
// O maior: corpo branco enorme, a cabeça dourada baixa, os ombros dourados com
// MUSGO em cima (ele dormiu tanto que cresceu planta), braços grossos com uma
// faixa preta, e os pés cobertos de musgo. Os pontos são de três cores, em
// duas colunas, no peito.
function regigigas(o, t, acesos) {
  const resp = Math.sin(t * 1.1) * 0.08;
  o.parte(); o.elipsoide([0, 5.2 + resp, 0], 3.2, 3.7, 2.5, "branco");
  o.parte(); o.elipsoide([0, 8.1 + resp, -0.3], 1.8, 1.2, 1.7, "ouro");
  o.parte(); o.elipsoide([0, 8.05 + resp, 0.05], 0.42, 1.05, 1.55, "preto");
  pontosDoRosto(o, "regigigas", [0, 6.0 + resp], 0.62, 0.38, [0, 5.2 + resp, 0, 3.2, 3.7, 2.5], acesos,
                ["acesoA", "acesoB", "acesoB", "acesoA", "acesoC", "acesoC", "acesoA"]);
  for (const l of [-1, 1]) {
    const bal = Math.sin(t * 1.1 + l) * 0.15;
    o.parte(); o.elipsoide([3.25 * l, 6.9 + resp, -0.2], 1.55, 1.45, 1.45, "ouro");
    o.parte(); o.elipsoide([3.0 * l, 8.05 + resp, -0.4], 1.1, 0.45, 1.0, "musgo", 10, 6);
    o.parte(); o.haste([3.9 * l, 5.6, 0], [4.7 * l, 3.4, 0.3 + bal], 1.0, 0.95, "branco");
    o.parte(); o.elipsoide([4.35 * l, 4.4, 0.15 + bal / 2], 1.08, 0.42, 1.08, "preto", 10, 6);
    o.parte(); o.elipsoide([4.85 * l, 2.6, 0.5 + bal], 1.35, 1.25, 1.35, "branco");
    o.parte();
    for (const k of [-1, 0, 1]) o.elipsoide([(4.9 + 0.5 * k) * l, 1.5, 1.2 + bal], 0.38, 0.55, 0.38, "preto", 6, 5);
    o.parte(); o.elipsoide([1.75 * l, 1.6, 0], 1.4, 1.45, 1.4, "branco");
    o.parte(); o.elipsoide([1.75 * l, 2.0, 0.05], 1.45, 0.35, 1.45, "preto", 12, 5);
    o.parte(); o.elipsoide([1.85 * l, 0.35, 0.2], 1.6, 0.5, 1.6, "musgo", 12, 6);
  }
}

// ------------------------------------------------------------ REGIELEKI
// Um núcleo amarelo de pontas, uma cinta azul, um pezinho de garras — e os
// dois BRAÇOS DE RAIO, enormes, que não param quietos: o zigue-zague é
// sorteado de novo várias vezes por segundo e pisca entre o branco e o
// amarelo. O raio não tem sombra: ele é a luz.
function regieleki(o, t, acesos) {
  const flut = Math.sin(t * 3) * 0.15;
  o.parte(); o.elipsoide([0, 6.3 + flut, 0], 1.9, 2.4, 1.5, "amarelo");
  pontosDoRosto(o, "regieleki", [0, 6.2 + flut], 0.55, 0.36, [0, 6.3 + flut, 0, 1.9, 2.4, 1.5], acesos);
  o.parte();
  for (let k = 0; k < 7; k++) {
    const a = (k / 7) * TAU;
    o.cristal([Math.cos(a) * 1.0, 7.9 + flut, Math.sin(a) * 0.8],
              [Math.cos(a) * 2.0, 9.7 + flut + (k % 2) * 0.5, Math.sin(a) * 1.4], 0.38, "espinho", 4);
  }
  o.parte(); o.elipsoide([0, 4.1 + flut, 0], 2.0, 0.85, 1.7, "azul");
  o.parte(); o.cristal([0, 3.7 + flut, 0], [0, 1.6 + flut, 0.1], 0.85, "amarelo", 6);
  for (const k of [-1, 0, 1]) o.cristal([0.5 * k, 2.0 + flut, 0.2], [0.9 * k, 0.5 + flut, 0.5], 0.22, "amarelo", 4);
  const tique = Math.floor(t * 12);
  for (const l of [-1, 1]) {
    o.parte(); o.elipsoide([2.0 * l, 5.2 + flut, 0], 0.8, 1.15, 0.8, "azul", 10, 6);
    // o braço de raio: uma corrente de pontos em zigue-zague, e cada elo é
    // uma placa fina que afina pra ponta
    const base = [[2.6, 5.4], [4.3, 6.7], [5.1, 4.6], [7.2, 6.1], [7.7, 3.6], [9.7, 4.6], [10.2, 2.4]];
    const pts = base.map(([x, y], i) => [x * l, y + flut + (i ? (hash1(tique * 31 + i * 7 + l * 3) - 0.5) * 0.9 : 0), 0.2]);
    o.parte();
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      const w0 = 0.75 * (1 - i / pts.length), w1 = 0.75 * (1 - (i + 1) / pts.length) + 0.08;
      const fixo = hash1(tique * 13 + i + l) > 0.5 ? 0 : 1;
      o.placa([[a[0], a[1] + w0, a[2]], [b[0], b[1] + w1, b[2]], [b[0], b[1] - w1, b[2]], [a[0], a[1] - w0, a[2]]],
              0, 0.25, "raio", "raio", fixo);
    }
  }
}

// ------------------------------------------------------------ REGIDRAGO
// Uma barriga vermelha redonda dentro de uma casca escura, dois chifres, e
// os braços são CABEÇAS DE DRAGÃO: mandíbula de cima e de baixo, o miolo
// vermelho e os dentes, abrindo e fechando devagar.
function regidrago(o, t, acesos) {
  o.parte(); o.elipsoide([0, 5.2, -0.8], 3.2, 3.5, 2.4, "casca");
  o.parte(); o.elipsoide([0, 4.4, 0.45], 2.6, 2.8, 2.1, "vermelho");
  pontosDoRosto(o, "regidrago", [0, 4.6], 0.46, 0.34, [0, 4.4, 0.45, 2.6, 2.8, 2.1], acesos);
  o.parte(); o.elipsoide([0, 7.3, -0.4], 1.6, 1.0, 1.4, "casca", 10, 6);
  for (const l of [-1, 1]) {
    o.parte(); o.cristal([0.9 * l, 7.6, -0.6], [1.45 * l, 10.6, -1.3], 0.55, "casca", 4);
    const abre = (Math.sin(t * 1.8 + l) + 1) * 0.25;
    o.parte(); o.elipsoide([4.1 * l, 5.1, 0.3], 1.5, 2.5, 1.6, "casca");
    o.parte(); o.elipsoide([4.25 * l, 3.25 - abre * 0.4, 1.0], 0.95, 1.1, 0.7, "vermelho", 10, 6);
    o.parte(); o.elipsoide([4.4 * l, 2.0 - abre, 0.6], 1.2, 1.25, 1.3, "casca");
    o.parte();
    for (const k of [-1, 1]) {
      o.cristal([(4.25 + 0.45 * k) * l, 3.0, 1.45], [(4.25 + 0.45 * k) * l, 2.2 - abre * 0.3, 1.6], 0.16, "dente", 4);
    }
    o.parte(); o.elipsoide([1.3 * l, 0.7, 0.3], 0.9, 0.7, 1.0, "casca", 10, 6);
  }
}

// ----------------------------------------------------------- REGIGLITCH
// O Regi que o cartucho montou com os restos dos outros seis: o corpo de
// metal do REGISTEEL feito de CHUVA DE CÓDIGO (roxo uva com traços verde
// código descendo), a faixa do rosto preta com os sete pontos num TRAÇO, o
// braço esquerdo de pedra do REGIROCK e o direito de cristal do REGICE, um
// ombro dourado do REGIGIGAS, os chifres do REGIDRAGO e um braço de raio do
// REGIELEKI nas costas — tudo pintado de verde e roxo. E ele está ERRADO:
// fatias do corpo escorregam pro lado, triângulos somem e trocam de cor, e
// os pontos piscam fora de ordem.
function regiglitch(o, t, acesos) {
  const tique = Math.floor(t * 9);
  o.parte(); o.elipsoide([0, 4.8, 0], 2.6, 3.4, 2.1, MAT.CODIGO);
  o.parte(); o.elipsoide([0, 2.0, 0], 1.95, 0.55, 1.6, "verde");
  o.parte(); o.elipsoide([0, 5.4, 0.7], 1.25, 2.3, 1.55, "fenda");
  const pisca = acesos >= 7 && hash1(tique * 5) < 0.25 ? Math.floor(hash1(tique) * 7) : 7;
  pontosDoRosto(o, "regiglitch", [0, 5.9], 0.36, 0.3, [0, 5.4, 0.7, 1.25, 2.3, 1.55], Math.min(acesos, pisca));
  // os chifres do REGIDRAGO
  for (const l of [-1, 1]) { o.parte(); o.cristal([0.8 * l, 7.6, -0.4], [1.3 * l, 10.2, -1.0], 0.5, "roxo", 4); }
  // ESQUERDA: ombro de aço, braço de pedra
  o.parte(); o.elipsoide([-3.05, 5.8, 0], 1.15, 1.15, 1.15, "verde");
  [[3.5, 5.0, 0.8], [3.8, 3.85, 0.72], [4.0, 2.8, 0.7]].forEach(([x, y, r], i) => {
    o.parte(); o.pedra([-x, y, 0], r, r * 0.9, r, "verde", 70 + i);
  });
  o.parte(); o.pedra([-4.1, 1.45, 0.3], 1.3, 1.2, 1.25, "roxo", 77);
  // DIREITA: ombro dourado (de roxo) com musgo (de verde), braço de cristal
  o.parte(); o.elipsoide([3.25, 6.5, 0], 1.6, 1.5, 1.5, "roxo");
  o.parte(); o.elipsoide([3.0, 7.7, -0.2], 1.15, 0.45, 1.05, "verde", 10, 6);
  o.parte(); o.cristal([2.5, 5.9, 0.2], [4.4, 2.7, 0.5], 1.0, "roxo");
  for (const k of [-1, 0, 1]) o.cristal([4.2, 3.1, 0.5], [4.8 + 0.2 * k, 1.8, 0.8 + k * 0.45], 0.3, "verde", 4);
  // nas costas, um braço de raio do REGIELEKI, torto
  o.parte();
  const raio = [[1.5, 7.2], [2.6, 8.8], [3.4, 7.6], [5.0, 9.6]];
  for (let i = 0; i < raio.length - 1; i++) {
    const [ax, ay] = raio[i], [bx, by] = raio[i + 1], w = 0.45 * (1 - i / 4);
    o.placa([[ax, ay + w, -1.4], [bx, by + w * 0.6, -1.4], [bx, by - w * 0.6, -1.4], [ax, ay - w, -1.4]], 0, 0.2, "verde", "verde", 0);
  }
  // as pernas: uma de pedra, uma de aço
  o.parte(); o.pedra([-1.2, 1.55, 0], 0.95, 0.85, 0.9, "verde", 80);
  o.parte(); o.pedra([-1.35, 0.5, 0.25], 1.05, 0.55, 1.15, "roxo", 81);
  o.parte(); o.elipsoide([1.3, 0.9, 0.1], 1.0, 0.95, 1.05, "roxo");

  // O ERRO. As FATIAS: de vez em quando uma faixa da altura dele escorrega
  // pro lado — por vértice, então o corpo ESTICA na emenda em vez de rasgar
  // (é a tela com defeito, não o bicho em pedaços). E uns poucos triângulos
  // trocam de cor ou somem por um instante.
  const desliza = (y) => {
    const f = Math.floor(y * 0.8);
    return hash1(f * 31 + tique * 7) > 0.86 ? (hash1(f + tique * 13) - 0.5) * 2.2 : 0;
  };
  const tris = o.tris;
  for (let i = tris.length - 1; i >= 0; i--) {
    const tr = tris[i];
    if (tr.m !== "aceso" && tr.m !== "apagado" && hash1(i * 3 + tique * 17) < 0.006) { tris.splice(i, 1); continue; }
    if (typeof tr.m === "string" && tr.m !== "aceso" && tr.m !== "apagado" && hash1(i * 5 + tique) < 0.02) {
      tr.m = tr.m === "verde" ? "roxo" : "verde";
    }
    tr.p = tr.p.map((q) => [q[0] + desliza(q[1]), q[1], q[2]]);
  }
}

const AMARELO_REGI = ["#ffffff", "#fefac7"];
// `escala`: o tamanho na tela. O herói tem 22 pixels de altura e eles ficam
// com umas três alturas dele (o REGIELEKI é o menor; o REGIGIGAS, o rei
// deles, o maior).
const REGIS_3D = {
  regirock: {   // 3 heróis
    tipo: "chao", modelo: regirock, escala: 3.39, altura: 8.6, largura: 5.2, poeira: "pedra",
    paleta: {
      pedra: ["#eee6de", "#cdc5ac", "#948b73", "#524a29"],
      laranja: ["#eeac6a", "#ee8339", "#bd6239", "#b44100"],
      aceso: ["#ffd0a0", "#ff8a40"], apagado: ["#7a4020", "#7a4020", "#5a3018"],
      contorno: "#181818",
    },
  },
  regice: {   // 3 heróis
    tipo: "chao", modelo: regice, escala: 3.2, altura: 10, largura: 4.8, poeira: "gelo",
    paleta: {
      gelo: ["#bdeeff", "#9ccdff", "#6ab4d5", "#396a8b"],
      gelo2: ["#9ccdff", "#6ab4d5", "#5a83ac", "#29397b"],
      aceso: ["#ffffac", "#ffe600"], apagado: ["#7a6a18", "#7a6a18", "#5a4a10"],
      contorno: "#000000",
    },
  },
  registeel: {   // 3 heróis
    tipo: "chao", modelo: registeel, escala: 3.39, altura: 8.2, largura: 4.6, poeira: "aco",
    paleta: {
      aco: ["#dedede", "#d5cdd5", "#b4acac", "#838b83"],
      escuro: ["#83837b", "#4a5a5a", "#4a4a4a", "#394152"],
      garra: ["#ffffff", "#ffffff", "#dedede", "#bdbdbd"],
      aceso: ["#ffb0b0", "#ff4141"], apagado: ["#6a2020", "#6a2020", "#4a1414"],
      contorno: "#181818",
    },
  },
  regigigas: {   // 3,5 heróis
    tipo: "chao", modelo: regigigas, escala: 3.36, altura: 8.6, largura: 6.4, poeira: "musgo",
    paleta: {
      branco: ["#f7f7f7", "#d6ced6", "#adadc5", "#8c94ad"],
      ouro: ["#f7d65a", "#f7d65a", "#c59c52", "#7b6321"],
      preto: ["#3a4a5a", "#3a4a5a", "#191921", "#191921"],
      musgo: ["#4aa563", "#4aa563", "#21846b", "#21846b"],
      acesoA: ["#ffb0b8", "#ef5a6b"], acesoB: ["#b0d8ff", "#4a90ef"], acesoC: ["#ffffff", "#d6ced6"],
      apagado: ["#5a5a6a", "#5a5a6a", "#3a3a4a"],
      contorno: "#191921",
    },
  },
  regieleki: {   // 2,5 heróis
    tipo: "chao", modelo: regieleki, escala: 2.64, altura: 10, largura: 6, poeira: "amarelo",
    paleta: {
      amarelo: ["#fefac7", "#e5ee1a", "#d7ad0d", "#7d542a"],
      azul: ["#8eacdd", "#4e7cc9", "#375395", "#2e3967"],
      raio: AMARELO_REGI,
      espinho: ["#fefac7", "#e5ee1a", "#d7ad0d", "#bc8b2f"],
      aceso: ["#ffffff", "#ff9dc2"], apagado: ["#7a4a5a", "#7a4a5a", "#5a3040"],
      contorno: "#101010",
    },
  },
  regidrago: {   // 3 heróis
    tipo: "chao", modelo: regidrago, escala: 2.74, altura: 10, largura: 5.8, poeira: "casca",
    paleta: {
      casca: ["#608d99", "#4b6f78", "#3f545f", "#242e35"],
      vermelho: ["#f27a99", "#e05276", "#b63650", "#872c3c"],
      dente: ["#ffffff", "#ffffff", "#d0d0d0", "#a0a0a0"],
      aceso: ["#9fe0ff", "#139ee1"], apagado: ["#1a4a6a", "#1a4a6a", "#0e3048"],
      contorno: "#101010",
    },
  },
  regiglitch: {   // 3 heróis
    tipo: "chao", modelo: regiglitch, escala: 2.95, altura: 10, largura: 5.4, poeira: "verde",
    paleta: {
      roxo: ["#9b59d0", "#6f2da8", "#4b1a78", "#2a0a45"],        // roxo uva
      verde: ["#a0ffb0", "#00ff41", "#00b82e", "#006b1a"],       // verde código
      fenda: ["#2a0a45", "#2a0a45", "#14051f", "#0a0210"],
      aceso: ["#ffffff", "#00ff41"], apagado: ["#0a3a14", "#0a3a14", "#06240c"],
      contorno: "#000000",
    },
  },
};
for (const [id, R] of Object.entries(REGIS_3D)) GIGANTES[id] = { nivel: REGIS[id]?.nivel ?? 60, ...R };

/** Pinta no buffer o modelo em pé `R` (um dos REGIS_3D ou LENDAS_3D) com os
 *  pés no ponto (sx, sy) da tela. `desce`: quanto dele ainda está debaixo da
 *  terra (o que passa do chão não aparece); `treme`: o tremor de lado;
 *  `cresce`: a escala por cima da dele (a forma nova do ZYGARDE nascendo);
 *  `est`: o que o modelo precisar saber além do tempo (as células juntando). */
function pintarEmPe(b, R, sx, sy, tempo, { acesos = 7, desce = 0, treme = 0, cresce = 1, est = null, giro = R.giro || 0 } = {}) {
  const pal = paletaDe(R);
  relogio = tempo;
  luz = LUZ_REGI;
  const E = R.escala * cresce;
  const base = [((sx - W / 2) * Z_REGI) / F, (-(sy - H / 2) * Z_REGI) / F, Z_REGI];
  const o = obra();
  R.modelo(o, tempo, acesos, est);
  // `giro`: quem é montado de lado (os de quatro patas, com a cabeça pro -x)
  // gira em volta do próprio eixo pra ficar de 3/4, como os sprites
  const c = Math.cos(giro), sn = Math.sin(giro);
  const gira = (q) => [q[0] * c + q[2] * sn, q[1], -q[0] * sn + q[2] * c];
  const mundo = (q0) => {
    const q = gira(q0);
    return [
      base[0] + XR[0] * (q[0] * E + treme) + UPR[0] * (q[1] * E - desce) + FRR[0] * q[2] * E,
      base[1] + XR[1] * (q[0] * E + treme) + UPR[1] * (q[1] * E - desce) + FRR[1] * q[2] * E,
      base[2] + XR[2] * (q[0] * E + treme) + UPR[2] * (q[1] * E - desce) + FRR[2] * q[2] * E,
    ];
  };
  const giraN = (n0) => {
    const n = gira(n0);
    return [XR[0] * n[0] + UPR[0] * n[1] + FRR[0] * n[2],
            XR[1] * n[0] + UPR[1] * n[1] + FRR[1] * n[2],
            XR[2] * n[0] + UPR[2] * n[1] + FRR[2] * n[2]];
  };
  corte = desce > 0 ? { o: base, n: UPR } : null;
  for (const tr of o.tris) {
    const p = tr.p.map(mundo);
    if (p[0][2] < PERTO || p[1][2] < PERTO || p[2][2] < PERTO) continue;
    rasteriza(b, { ...tr, p, n: tr.n && tr.n.map(giraN) }, pal, 0);
  }
  corte = null;
  contorno(b, pal);
  // onde um ponto do modelo cai na tela (a SELA da montaria)
  const proj = (q) => { const m = mundo(q); return [W / 2 + (F * m[0]) / m[2], H / 2 - (F * m[1]) / m[2]]; };
  return { pal, E, proj };
}

/** A sombra redonda no chão, por baixo de quem está em pé em (sx, sy) */
function sombraNoChao(b, sx, sy, rx) {
  const ry = rx * 0.32;
  for (let y = Math.max(0, Math.floor(sy - ry)); y <= Math.min(H - 1, Math.ceil(sy + ry)); y++) {
    for (let x = Math.max(0, Math.floor(sx - rx)); x <= Math.min(W - 1, Math.ceil(sx + rx)); x++) {
      const i = y * W + x;
      if (!b.z[i] && ((x + 0.5 - sx) / rx) ** 2 + ((y + 0.5 - sy) / ry) ** 2 <= 1) b.px[i] = SOMBRA;
    }
  }
}

/** Desenha o REGI `id` acordando (`g`: { fase: "sobe" | "acende" | "luta",
 *  t: tempo na fase, tempo: tempo desde o começo }), com os pés no ponto
 *  (sx, sy) da tela. Por cima do que já está em `ctx`. */
export function desenharRegi(ctx, id, g, sx, sy) {
  const R = GIGANTES[id];
  if (!R?.modelo) return;
  const b = buffers();
  limpar(b);
  const T = TEMPO_REGI;
  const sobe = g.fase === "sobe" ? suave(Math.min(1, g.t / T.sobe)) : 1;
  const acesos = g.fase === "sobe" ? 0 : g.fase === "acende" ? Math.min(7, Math.floor(g.t / T.ponto)) : 7;
  const { pal, E } = pintarEmPe(b, R, sx, sy, g.tempo, {
    acesos,
    desce: (1 - sobe) * R.altura * R.escala * 1.05,
    treme: g.fase === "sobe" ? Math.sin(g.t * 55) * 0.3 : 0,
  });

  // NO CHÃO, por baixo dele: a sombra, as rachaduras e as pedras voando
  const px = b.px, z = b.z;
  const rx = (R.largura * E * F) / Z_REGI * 0.55 * (0.4 + 0.6 * sobe);
  sombraNoChao(b, sx, sy, rx);
  const racha = pal.preto, rnd = sorteio(id.length * 97 + 13);
  if (g.fase !== "luta" || g.tempo < 12) {
    const alcance = Math.min(1, (g.fase === "sobe" ? g.t : T.sobe) / 0.8) * rx * 1.5;
    for (let k = 0; k < 7; k++) {
      let a = (k / 7) * TAU + rnd() * 0.6, x = sx, y = sy;
      for (let s = 0; s < alcance; s += 1) {
        a += (rnd() - 0.5) * 0.5;
        x += Math.cos(a); y += Math.sin(a) * 0.35;
        const i = Math.round(y) * W + Math.round(x);
        if (x >= 0 && x < W && y >= 0 && y < H && !z[i]) px[i] = racha;
      }
    }
  }
  const tp = g.fase === "sobe" ? g.t : g.fase === "acende" ? T.sobe + g.t : 99;
  const pedra = pal[R.poeira] || pal.preto;
  for (let k = 0; k < 46; k++) {
    const r1 = hash1(k * 7 + 1), r2 = hash1(k * 7 + 2), r3 = hash1(k * 7 + 3);
    const idade = tp - r1 * T.sobe;
    if (idade < 0 || idade > 0.9) continue;
    const a = Math.PI * (0.1 + 0.8 * r2);
    // (o voo das pedras vai no tamanho dele: o 4 é a escala de quando eram gigantes)
    const x = Math.round(sx + (r3 - 0.5) * rx * 1.6 + Math.cos(a) * 60 * (E / 4 + 0.3) * idade);
    const y = Math.round(sy - (Math.sin(a) * (70 + 50 * r3) * idade - 160 * idade * idade) * (E / 4 + 0.3));
    const c = r2 < 0.5 ? pedra[2] : pedra[3];
    for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
      const xx = x + dx, yy = y + dy;
      if (xx >= 0 && xx < W && yy >= 0 && yy < H) px[yy * W + xx] = dx + dy === 0 ? pal.preto : c;
    }
  }
  b.ctx.putImageData(b.img, 0, 0);
  ctx.drawImage(b.cv, 0, 0);
}

// ============================================================ OS LENDÁRIOS
//
// Ser 3D não é ser gigante: os lendários que esperam parados no mapa (os
// ESTÁTICOS, src/data/extra.js) também são modelos, em pé onde estão, cada um
// do tamanho dele perto do herói (`escala`, medida em dev/regitamanho.html).
// Os de quatro patas são montados DE LADO, com a cabeça pro -x, e o `giro`
// vira eles de 3/4 pra você; os outros, de frente (z pra você), como os Regis.
// A paleta é a do sprite de batalha de cada um.

/** Um TUBO CURVO pelos pontos `pts` (uma curva lisa passando por todos):
 *  rabo, pescoço, o corpo de serpente do ZYGARDE. `raio(s)`: a grossura de
 *  s = 0 (o primeiro ponto) a 1 (o último), que fecha num bico. */
function tuboCurvo(o, pts, raio, m, { n = 14, lados = 9, fecha = true } = {}) {
  const P = (u) => {
    const k = Math.min(pts.length - 1.0001, Math.max(0, u * (pts.length - 1)));
    const i = Math.floor(k), f = k - i;
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    return [0, 1, 2].map((e) => 0.5 * ((2 * p1[e]) + (-p0[e] + p2[e]) * f
      + (2 * p0[e] - 5 * p1[e] + 4 * p2[e] - p3[e]) * f * f + (-p0[e] + 3 * p1[e] - 3 * p2[e] + p3[e]) * f * f * f));
  };
  const secs = [];
  let A0 = null;
  for (let i = 0; i <= n; i++) {
    const u = i / n, c = P(u);
    const T = norm(sub(P(Math.min(1, u + 0.01)), P(Math.max(0, u - 0.01))));
    // o lado vai junto com a curva (sem torcer de uma seção pra outra)
    let A = A0 ? sub(A0, mul(T, dot(A0, T))) : cross(T, Math.abs(T[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]);
    A = norm(A);
    A0 = A;
    const B = norm(cross(T, A)), r = raio(u);
    secs.push({ c, A, B, ra: r, rb: r });
  }
  o.tubo(secs, lados, m, fecha ? P(1) : null);
}

/** Um olho: uma bolinha achatada da cor `m` */
function olho(o, c, r, m) {
  o.elipsoide(c, r, r, r * 0.6, m, 6, 4);
}

// -------------------------------------------------------------- ARCEUS
// O cavalo branco: barriga cinza, cascos de ouro em ponta, a crina em lâmina
// pra trás, a máscara cinza com os olhos verdes e, em volta da cintura, a
// RODA DE OURO com as quatro pedras verdes — girando devagar.
function arceus(o, t) {
  const resp = Math.sin(t * 1.4) * 0.06;
  o.parte(); o.elipsoide([0, 5.2 + resp, 0], 2.5, 1.35, 1.25, "branco");
  o.parte(); o.elipsoide([0.1, 4.75 + resp, 0], 2.1, 0.85, 1.05, "cinza");
  o.parte(); o.haste([-1.9, 5.6 + resp, 0], [-2.7, 7.9, 0], 0.95, 0.7, "branco");
  o.parte(); o.elipsoide([-3.1, 8.5, 0], 0.95, 0.85, 0.75, "branco");
  o.parte(); o.elipsoide([-3.75, 8.2, 0], 0.65, 0.45, 0.5, "cinza");
  for (const l of [-1, 1]) olho(o, [-3.75, 8.65, 0.5 * l], 0.2, "verde");
  // a crina e as "bochechas" em lâmina, pra trás
  o.parte();
  o.placa([[-3.3, 9.15, 0], [-2.3, 9.9, 0], [-1.1, 9.6, 0], [-2.4, 8.9, 0]], 0, 0.3, "branco", "branco");
  for (const l of [-1, 1]) o.placa([[-3.2, 8.3, 0.6 * l], [-1.9, 7.6, 1.1 * l], [-2.6, 8.9, 0.7 * l]], 0, 0.2, "branco", "branco");
  // as pernas, finas, com o casco de ouro em ponta
  for (const [x, coxa] of [[-1.6, 0], [1.7, 1]]) {
    for (const l of [-1, 1]) {
      o.parte();
      if (coxa) o.elipsoide([x - 0.1, 4.8, 0.75 * l], 0.9, 1.2, 0.5, "branco", 10, 6);
      o.haste([x, 4.5, 0.7 * l], [x - 0.3, 1.4, 0.7 * l], 0.42, 0.3, "branco");
      o.parte(); o.cristal([x - 0.3, 1.6, 0.7 * l], [x - 0.15, -0.05, 0.7 * l], 0.42, "ouro", 5);
    }
  }
  // o rabo: um tufo em lâmina
  o.parte(); o.haste([2.4, 5.5, 0], [3.4, 6.3, 0], 0.45, 0.28, "branco");
  o.placa([[3.2, 6.0, 0], [4.6, 7.2, 0], [4.2, 5.6, 0]], 0, 0.25, "cinza", "cinza");
  // A RODA: um anel de ouro em volta da cintura, deitado e meio inclinado
  o.parte();
  const giro = t * 0.4, R0 = 2.55, cr = [0.2, 5.0 + resp, 0];
  const ponto = (a) => [cr[0] + Math.cos(a) * R0, cr[1] + Math.sin(a) * R0 * 0.45 + 0.35 * Math.cos(a), cr[2] + Math.sin(a) * R0];
  for (let k = 0; k < 20; k++) {
    const a = giro + (k / 20) * TAU, a2 = giro + ((k + 1) / 20) * TAU;
    o.haste(ponto(a), ponto(a2), 0.28, 0.28, "ouro", 5);
  }
  for (let k = 0; k < 4; k++) {
    const p = ponto(giro + (k / 4) * TAU + 0.4);
    o.parte(); o.elipsoide(p, 0.4, 0.4, 0.4, "verde", 6, 4);
  }
}

// -------------------------------------------------------------- DIALGA
// O do TEMPO: quatro patas grossas, o pescoço comprido e em pé, a armadura de
// prata no peito com o DIAMANTE no meio (que pulsa: cada batida é um
// segundo), o chifre da cabeça e o leque de barbatanas azul-claro nas costas.
function dialga(o, t) {
  const bate = (t % 1) < 0.15 ? 0 : -1;
  o.parte(); o.elipsoide([0.4, 4.9, 0], 2.4, 1.7, 1.55, "azul");
  o.parte(); o.elipsoide([-1.25, 5.5, 0], 1.25, 1.55, 1.3, "prata");
  o.parte(); o.elipsoide([-2.35, 5.6, 0], 0.5, 0.6, 0.5, "diamante", 8, 5);
  for (const tr of o.tris.slice(-8 * 5 * 2)) tr.fixo = bate;
  o.parte(); o.haste([-1.5, 6.6, 0], [-2.1, 9.2, 0], 0.8, 0.6, "azul");
  o.parte(); o.elipsoide([-2.5, 9.8, 0], 0.9, 0.75, 0.7, "azul");
  o.parte(); o.elipsoide([-3.3, 9.55, 0], 0.75, 0.4, 0.5, "azul");
  for (const l of [-1, 1]) olho(o, [-2.95, 9.95, 0.55 * l], 0.16, "olho");
  o.parte(); o.cristal([-2.3, 10.3, 0], [-1.3, 12.0, 0], 0.32, "prata", 4);
  for (const l of [-1, 1]) { o.parte(); o.cristal([-2.0, 9.6, 0.5 * l], [-0.9, 9.9, 1.0 * l], 0.25, "prata", 4); }
  // o leque das costas: placas claras abrindo pra trás
  o.parte();
  for (let k = 0; k < 5; k++) {
    const a = 0.35 + k * 0.28, x0 = 0.6 + k * 0.25;
    const ponta = [x0 + Math.cos(a) * 3.6, 6.0 + Math.sin(a) * 3.6, -0.3];
    o.placa([[x0 - 0.35, 6.0, -0.3], ponta, [x0 + 0.45, 6.0, -0.3]], 0, 0.2, "barbatana", "barbatana");
  }
  // as patas: grossas, com o pé de prata e as garras
  for (const [x, z] of [[-1.0, 1], [1.8, 1]]) {
    for (const l of [-1, 1]) {
      o.parte(); o.haste([x, 4.4, z * l], [x - 0.35, 0.9, (z + 0.2) * l], 0.72, 0.58, "azul");
      o.parte(); o.elipsoide([x - 0.55, 0.45, (z + 0.2) * l], 0.85, 0.45, 0.6, "prata", 8, 5);
    }
  }
  // o rabo, afinando pra trás com a ponta de prata
  o.parte(); tuboCurvo(o, [[2.4, 4.8, 0], [3.6, 4.2, 0], [4.8, 3.2, 0], [5.6, 2.9, 0]], (s) => 0.75 * (1 - s) + 0.1, "azul");
}

// -------------------------------------------------------------- PALKIA
// O do ESPAÇO, em pé em duas pernas: o corpo claro com as faixas roxas, as
// duas PÉROLAS dos ombros (rosa, com o centro vermelho), as asas finas nas
// costas, o focinho comprido e o rabo grosso.
function palkia(o, t) {
  const resp = Math.sin(t * 1.3) * 0.08;
  o.parte(); o.elipsoide([0, 5.7 + resp, 0], 1.75, 2.15, 1.4, "lilas");
  o.parte(); o.elipsoide([0, 5.3 + resp, 0.55], 1.1, 0.35, 1.0, "roxo", 10, 5);
  o.parte(); o.elipsoide([0, 4.5 + resp, 0.5], 1.0, 0.3, 0.95, "roxo", 10, 5);
  for (const l of [-1, 1]) {
    // a perna
    o.parte(); o.elipsoide([0.9 * l, 3.4, 0], 0.95, 1.3, 0.95, "lilas");
    o.parte(); o.haste([1.0 * l, 2.6, 0], [1.05 * l, 0.6, 0.2], 0.62, 0.55, "branco");
    o.parte(); o.elipsoide([1.05 * l, 0.35, 0.55], 0.7, 0.35, 0.95, "branco", 8, 5);
    // o ombro com a pérola
    o.parte(); o.elipsoide([1.75 * l, 7.1 + resp, 0], 1.05, 0.95, 1.0, "lilas");
    o.parte(); o.elipsoide([2.35 * l, 7.15 + resp, 0.45], 0.62, 0.62, 0.5, "perola", 8, 6);
    o.parte(); o.elipsoide([2.55 * l, 7.2 + resp, 0.75], 0.25, 0.25, 0.22, "olho", 6, 4);
    // o braço, com a garra branca
    o.parte(); o.haste([1.9 * l, 6.4 + resp, 0.3], [2.1 * l, 4.6, 1.1], 0.45, 0.38, "lilas");
    o.parte(); o.elipsoide([2.1 * l, 4.4, 1.25], 0.45, 0.4, 0.45, "branco", 6, 4);
    // a asa: duas lâminas finas, abrindo um pouco no compasso da respiração
    o.parte();
    o.placa([[0.8 * l, 7.6, -1.0], [3.3 * l, 11.0 + resp * 3, -1.8], [3.9 * l, 9.6, -1.6], [1.4 * l, 6.9, -1.0]], 0, 0.2, "asa", "roxo");
  }
  // o pescoço e a cabeça
  o.parte(); o.haste([0, 7.5 + resp, 0], [0, 8.7, 0.3], 0.75, 0.6, "lilas");
  o.parte(); o.elipsoide([0, 9.2, 0.4], 0.9, 0.75, 0.9, "branco");
  o.parte(); o.elipsoide([0, 8.9, 1.15], 0.45, 0.35, 0.6, "lilas");
  o.parte(); o.elipsoide([0, 8.75, 1.65], 0.25, 0.18, 0.2, "cinza", 6, 4);
  for (const l of [-1, 1]) olho(o, [0.55 * l, 9.35, 0.95], 0.15, "olho");
  o.parte(); o.placa([[-0.7, 9.6, 0.2], [0, 10.6, -0.8], [0.7, 9.6, 0.2]], 0, 0.3, "branco", "branco");
  // o rabo grosso, saindo de trás e encostando no chão
  o.parte(); tuboCurvo(o, [[0, 4.4, -1.0], [0, 2.8, -2.4], [0.4, 1.4, -3.4], [1.0, 1.2, -4.2]], (s) => 0.9 * (1 - s) + 0.15, "lilas");
}

// ------------------------------------------------------------- XERNEAS
// O cervo: corpo e pernas pretos (finos e compridos), o peito e o pescoço
// azuis, e os CHIFRES em galhos, cada ponta de uma cor, piscando como luz.
function xerneas(o, t) {
  const resp = Math.sin(t * 1.5) * 0.05;
  o.parte(); o.elipsoide([0.4, 5.2 + resp, 0], 2.1, 1.1, 1.0, "negro");
  o.parte(); o.elipsoide([-1.3, 5.6 + resp, 0], 1.15, 1.15, 0.95, "azul");
  o.parte(); o.haste([-1.5, 6.3, 0], [-1.9, 8.4, 0], 0.52, 0.38, "azul");
  o.parte(); o.elipsoide([-2.2, 8.8, 0], 0.68, 0.52, 0.45, "azul");
  o.parte(); o.elipsoide([-2.85, 8.6, 0], 0.45, 0.3, 0.3, "azul", 8, 5);
  for (const l of [-1, 1]) olho(o, [-2.5, 8.95, 0.35 * l], 0.12, "chifre");
  for (const [x, l] of [[-1.2, -1], [-1.2, 1], [1.5, -1], [1.5, 1]]) {
    o.parte();
    if (x > 0) o.elipsoide([1.4, 4.9, 0.45 * l], 0.75, 0.9, 0.38, "negro", 8, 6);
    o.haste([x, 4.6, 0.5 * l], [x - 0.15, 2.2, 0.5 * l], 0.36, 0.26, "negro", 6);
    o.haste([x - 0.15, 2.2, 0.5 * l], [x - 0.05, 0.25, 0.5 * l], 0.26, 0.2, "negro", 6);
    o.elipsoide([x - 0.1, 0.15, 0.45 * l], 0.22, 0.15, 0.2, "chifre", 6, 4);
  }
  o.parte(); o.placa([[2.3, 5.4, 0], [3.4, 6.6, 0], [3.7, 5.5, 0], [2.6, 4.9, 0]], 0, 0.25, "negro", "negro");
  // OS CHIFRES: um galho de cada lado, com as pontas coloridas
  const cores = ["laranja", "vermelho", "ciano", "violeta", "laranja"];
  for (const l of [-1, 1]) {
    const tronco = [[-2.0, 9.2, 0.25 * l], [-1.8, 10.0, 0.7 * l], [-1.3, 10.9, 1.3 * l], [-0.6, 11.6, 1.9 * l]];
    o.parte();
    for (let i = 0; i < tronco.length - 1; i++) o.haste(tronco[i], tronco[i + 1], 0.2, 0.17, "chifre", 5);
    for (let k = 0; k < 5; k++) {
      const b = tronco[Math.min(3, 1 + Math.floor(k * 0.7))];
      const ponta = [b[0] - 1.1 + k * 0.55, b[1] + 1.2 + (k % 2) * 0.5, b[2] + (0.5 + k * 0.15) * l];
      o.parte(); o.haste(b, ponta, 0.14, 0.1, "chifre", 5);
      const fim = [ponta[0] + (ponta[0] - b[0]) * 0.35, ponta[1] + (ponta[1] - b[1]) * 0.35, ponta[2] + (ponta[2] - b[2]) * 0.35];
      o.cristal(ponta, fim, 0.2, cores[k], 4);
      if (Math.sin(t * 3 + k * 1.7 + l) > 0.6) for (const tr of o.tris.slice(-16)) tr.fixo = 0;
    }
  }
}

// ------------------------------------------------------------- YVELTAL
// O pássaro da destruição, de frente pra você e pairando: corpo preto e
// vermelho, o pescoço cinza, as ASAS ABERTAS em Y (penas pretas por fora,
// vermelhas por dentro), o rabo em leque pra baixo e as garras vermelhas.
function yveltal(o, t) {
  const voa = Math.sin(t * 2.2), sobe = 1.2 + voa * 0.35;
  o.parte(); o.elipsoide([0, 5.6 + sobe, 0], 1.15, 1.9, 0.95, "vermelho");
  o.parte(); o.elipsoide([0, 6.3 + sobe, 0.45], 0.75, 1.25, 0.6, "cinza");
  o.parte(); o.haste([0, 7.4 + sobe, 0], [0, 9.0 + sobe, 0.35], 0.45, 0.38, "cinza");
  o.parte(); o.elipsoide([0, 9.4 + sobe, 0.55], 0.6, 0.5, 0.65, "negro");
  o.parte(); o.cristal([0, 9.35 + sobe, 1.0], [0, 8.8 + sobe, 1.9], 0.25, "negro", 4);
  for (const l of [-1, 1]) {
    olho(o, [0.35 * l, 9.55 + sobe, 0.95], 0.12, "ciano");
    o.parte(); o.placa([[0.3 * l, 9.7 + sobe, 0.2], [1.4 * l, 10.6 + sobe, -0.4], [0.5 * l, 9.2 + sobe, 0.1]], 0, 0.2, "vermelho", "vermelho");
    // A ASA: o braço sobe em diagonal; as penas pretas penduradas nele, cada
    // uma com o vermelho por dentro. Bate devagar.
    const bate = voa * 0.35;
    const ombro = [0.9 * l, 7.2 + sobe, -0.2];
    const cot = [3.3 * l, 9.6 + sobe + bate, -0.5], ponta = [6.2 * l, 10.4 + sobe + bate * 1.6, -0.6];
    o.parte(); o.haste(ombro, cot, 0.4, 0.32, "negro"); o.haste(cot, ponta, 0.32, 0.2, "negro");
    for (let k = 0; k < 5; k++) {
      const f = k / 4, raiz = [cot[0] + (ponta[0] - cot[0]) * f, cot[1] + (ponta[1] - cot[1]) * f, -0.5];
      const queda = 3.6 - k * 0.45, solto = Math.sin(t * 2.2 + k) * 0.15;
      o.parte();
      o.placa([[raiz[0] - 0.5 * l, raiz[1], -0.5], [raiz[0] + 0.55 * l, raiz[1] + 0.1, -0.5],
               [raiz[0] + (0.9 + solto) * l, raiz[1] - queda, -0.4], [raiz[0] + 0.1 * l, raiz[1] - queda * 0.8, -0.45]],
              0, 0.25, k % 2 ? "negro" : "vermelho", "negro");
    }
    o.parte();
    o.placa([ombro, cot, [cot[0] * 0.8, cot[1] - 3.2, -0.4], [ombro[0], ombro[1] - 1.8, -0.3]], 0, 0.2, "vermelho", "negro");
    // a garra
    o.parte(); o.haste([0.5 * l, 4.3 + sobe, 0.2], [0.65 * l, 3.0 + sobe, 0.7], 0.25, 0.2, "vermelho", 6);
  }
  // o rabo em leque, pra baixo
  o.parte();
  for (let k = -2; k <= 2; k++) {
    o.placa([[-0.35 + k * 0.1, 4.2 + sobe, -0.2], [0.35 + k * 0.1, 4.2 + sobe, -0.2], [k * 0.85 + 0.3, 1.1 + sobe - Math.abs(k) * 0.2, -0.3], [k * 0.85 - 0.3, 1.2 + sobe, -0.3]],
            0, 0.2, k % 2 ? "vermelho" : "negro", "negro");
  }
}

// -------------------------------------------------------------- ZYGARDE
// Cinco formas, todas feitas das mesmas CÉLULAS verdes:
// - a CÉLULA: uma gotinha verde com o núcleo escuro (sozinha ela é do tamanho
//   de uma pedrinha);
// - o NÚCLEO: uma gota maior com o hexágono escuro e o olho, e quatro
//   perninhas que balançam;
// - 10%: o cachorro magro e preto, com o verde nas patas e o raio no pescoço;
// - 50%: a serpente em pé, com o leque de pétalas escuras na cabeça;
// - 100%: o gigante, de capa, com o núcleo branco no peito.

const PISCA_CELULA = (t, k) => Math.sin(t * 4 + k * 2.3) > 0.7;

/** uma célula em `c`, de tamanho `r` */
function celula(o, c, r, t, k = 0) {
  o.parte(); o.elipsoide(c, r, r * 0.8, r, "verde", 8, 5);
  o.parte(); o.elipsoide([c[0], c[1] + r * 0.15, c[2] + r * 0.75], r * 0.38, r * 0.38, r * 0.25, PISCA_CELULA(t, k) ? "brilho" : "escuro", 6, 4);
}
function zygardecelula(o, t) {
  celula(o, [0, 0.8 + Math.abs(Math.sin(t * 5)) * 0.3, 0], 0.9, t);
}

function zygardenucleo(o, t) {
  const pula = Math.abs(Math.sin(t * 3)) * 0.3;
  o.parte(); o.elipsoide([0, 1.6 + pula, 0], 1.2, 1.15, 1.0, "verde", 10, 7);
  o.parte(); o.placa([0, 1, 2, 3, 4, 5].map((k) => {
    const a = (k / 6) * TAU + Math.PI / 6;
    return [Math.cos(a) * 0.65, 1.8 + pula + Math.sin(a) * 0.65, 0.95];
  }), 0, 0.12, "escuro", "escuro");
  o.parte(); o.elipsoide([0, 1.8 + pula, 1.03], 0.22, 0.22, 0.1, Math.sin(t * 2) > -0.8 ? "brilho" : "escuro", 6, 4);
  for (const [a, b] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) {
    const bal = Math.sin(t * 4 + a + b) * 0.25;
    o.parte(); o.haste([0.8 * a, 1.2 + pula, 0.3 * b], [1.5 * a, 0.2, 0.6 * b + bal], 0.22, 0.15, "verde", 5);
  }
}

function zygarde10(o, t) {
  const resp = Math.sin(t * 2.5) * 0.06;
  o.parte(); o.elipsoide([0.3, 4.6 + resp, 0], 1.8, 0.7, 0.6, "escuro");
  o.parte(); o.elipsoide([-1.3, 5.0 + resp, 0], 0.8, 0.85, 0.65, "escuro");
  o.parte(); o.elipsoide([-1.6, 5.1 + resp, 0.3], 0.3, 0.3, 0.3, "vermelho", 6, 4);
  o.parte(); o.elipsoide([-0.9, 4.3 + resp, 0.55], 0.32, 0.32, 0.2, "branco", 6, 4);
  o.parte(); o.haste([-1.5, 5.4, 0], [-2.1, 7.0, 0], 0.4, 0.3, "escuro");
  // a cabeça comprida, a boca verde e as orelhas em ponta pra trás
  o.parte(); o.elipsoide([-2.5, 7.3, 0], 0.65, 0.45, 0.42, "escuro");
  o.parte(); o.elipsoide([-3.15, 7.05, 0], 0.55, 0.25, 0.3, "verde", 8, 5);
  for (const l of [-1, 1]) {
    olho(o, [-2.75, 7.45, 0.33 * l], 0.1, "verde");
    o.parte(); o.cristal([-2.2, 7.6, 0.25 * l], [-0.9, 8.4, 0.45 * l], 0.22, "escuro", 4);
  }
  // o raio verde do pescoço
  o.parte();
  const raio = [[-1.6, 6.0], [-0.7, 6.9], [-1.0, 7.3], [0.1, 8.2]];
  for (let i = 0; i < raio.length - 1; i++) {
    const [ax, ay] = raio[i], [bx, by] = raio[i + 1], w = 0.22;
    o.placa([[ax, ay + w, -0.2], [bx, by + w, -0.2], [bx, by - w, -0.2], [ax, ay - w, -0.2]], 0, 0.15, "verde", "verde");
  }
  // as pernas finas: pretas, com o verde nas da frente; espinhos nas de trás
  for (const [x, l, cor] of [[-1.1, -1, "verde"], [-1.1, 1, "escuro"], [1.4, -1, "escuro"], [1.4, 1, "verde"]]) {
    const passo = Math.sin(t * 2 + x + l) * 0.1;
    o.parte(); o.haste([x, 4.4, 0.35 * l], [x + 0.1, 2.2, 0.35 * l], 0.24, 0.18, "escuro", 6);
    o.parte(); o.haste([x + 0.1, 2.2, 0.35 * l], [x - 0.15 + passo, 0.2, 0.35 * l], 0.2, 0.16, cor, 6);
    if (x > 0) { o.parte(); o.cristal([x + 0.2, 3.2, 0.35 * l], [x + 1.1, 3.6, 0.4 * l], 0.15, "escuro", 4); }
  }
  o.parte(); o.cristal([2.0, 4.8, 0], [3.0, 5.6, 0], 0.25, "escuro", 4);
}

function zygarde(o, t) {
  const bal = Math.sin(t * 1.6) * 0.15;
  // a serpente: enrolada no chão e subindo em S até a cabeça
  o.parte();
  tuboCurvo(o, [[1.6, 0.5, 0.4], [0.2, 0.6, 1.2], [-1.2, 0.8, 0.2], [-0.6, 2.0, -0.6], [0.3, 3.8, -0.2], [0, 5.6 + bal, 0.2], [-0.2, 7.0 + bal, 0.4]],
            (s) => s < 0.85 ? 0.75 + s * 0.35 : 1.05 - (s - 0.85) * 2, "verde", { n: 20 });
  o.parte(); o.elipsoide([-0.2, 7.2 + bal, 0.4], 1.0, 0.7, 0.9, "escuro");
  o.parte(); o.elipsoide([-0.25, 7.9 + bal, 0.75], 0.75, 0.6, 0.6, "escuro");
  for (const l of [-1, 1]) olho(o, [0.35 * l - 0.25, 8.0 + bal, 1.25], 0.12, "branco");
  // o leque de pétalas escuras, cada uma com os pontinhos verdes
  for (let k = 0; k < 5; k++) {
    const a = Math.PI / 2 + (k - 2) * 0.42, cx = -0.2, cy = 7.5 + bal;
    const dir = [Math.cos(a), Math.sin(a)], lado = [-Math.sin(a), Math.cos(a)];
    const p = (d, w) => [cx + dir[0] * d + lado[0] * w, cy + dir[1] * d + lado[1] * w, 0.1 - d * 0.12];
    o.parte(); o.placa([p(0, -0.3), p(1.9, -0.6), p(3.0, -0.3), p(3.0, 0.3), p(1.9, 0.6), p(0, 0.3)], 0, 0.22, "marrom", "escuro");
    o.parte(); o.elipsoide(p(2.3, 0).map((v, i) => i === 2 ? v + 0.15 : v), 0.2, 0.2, 0.1, PISCA_CELULA(t, k) ? "brilho" : "verde", 6, 4);
  }
  // os fios verdes dos lados do pescoço
  for (const l of [-1, 1]) {
    o.parte();
    tuboCurvo(o, [[0.7 * l, 6.3 + bal, 0], [1.6 * l, 6.0, 0.3], [2.1 * l, 5.4 + Math.sin(t * 3 + l) * 0.2, 0.1]], (s) => 0.2 - s * 0.1, "verde", { n: 6, lados: 5 });
  }
}

function zygardecompleto(o, t) {
  const resp = Math.sin(t * 1.2) * 0.08, capa = Math.sin(t * 1.5) * 0.25;
  o.parte(); o.elipsoide([0, 6.0 + resp, 0], 1.6, 2.1, 1.2, "escuro");
  o.parte(); o.elipsoide([0, 6.4 + resp, 1.1], 0.42, 0.42, 0.3, "branco", 8, 5);
  o.parte(); o.elipsoide([0, 7.6 + resp, 0.3], 1.75, 0.6, 1.05, "escuro");
  // a faixa de cores no peito (azul, branco, laranja, vermelho), como no sprite
  o.parte();
  ["azul", "branco", "laranja", "vermelho"].forEach((m, i) => {
    const x = -1.2 + i * 0.8;
    const z = 1.38 - Math.abs(x + 0.4) * 0.25;
    o.placa([[x, 7.45 + resp, z], [x + 0.75, 7.6 + resp + (i % 2 ? -0.25 : 0.25), z], [x + 0.75, 7.3 + resp + (i % 2 ? -0.25 : 0.25), z], [x, 7.15 + resp, z]], 0, 0.08, m, m);
  });
  o.parte(); o.elipsoide([0, 5.0 + resp, 0.95], 0.55, 0.9, 0.4, "verde");
  // a cabeça: pequena, com a crista e os olhos verdes
  o.parte(); o.elipsoide([0, 8.7 + resp, 0.3], 0.7, 0.7, 0.65, "escuro");
  o.parte(); o.elipsoide([0, 8.55 + resp, 0.85], 0.42, 0.3, 0.3, "verde", 6, 4);
  o.parte(); o.cristal([0, 9.1 + resp, 0], [0, 10.4 + resp, -0.4], 0.3, "escuro", 4);
  for (const l of [-1, 1]) {
    // o braço: ombro grosso, a garra verde com unhas brancas
    o.parte(); o.elipsoide([1.75 * l, 7.4 + resp, 0], 0.85, 0.75, 0.8, "escuro");
    o.parte(); o.haste([2.0 * l, 6.9, 0.2], [2.3 * l, 4.9, 0.8], 0.55, 0.5, "escuro");
    o.parte(); o.elipsoide([2.35 * l, 4.5, 0.95], 0.55, 0.55, 0.55, "verde", 8, 5);
    for (const k of [-1, 0, 1]) { o.parte(); o.cristal([2.35 * l + 0.25 * k, 4.2, 1.2], [2.4 * l + 0.35 * k, 3.4, 1.4], 0.12, "branco", 4); }
    // a perna, com o pé verde
    o.parte(); o.elipsoide([0.85 * l, 3.4, 0], 0.85, 1.2, 0.85, "escuro");
    o.parte(); o.haste([0.9 * l, 2.5, 0.1], [1.0 * l, 0.7, 0.3], 0.55, 0.5, "escuro");
    o.parte(); o.elipsoide([1.05 * l, 0.4, 0.55], 0.7, 0.4, 0.85, "verde", 8, 5);
    // A CAPA: as asas compridas caindo pelas costas até o chão, com as marcas
    // vermelhas da esquerda dele (a direita da tela)
    o.parte();
    o.placa([[1.2 * l, 8.4 + resp, -0.8], [3.6 * l, 10.2 + resp, -1.6], [4.2 * l + capa * l, 3.0, -1.4], [3.0 * l + capa * l, 0.4, -1.2], [1.4 * l, 2.5, -0.9]],
            0, 0.3, "escuro", "marrom");
    if (l > 0) {
      for (const [y, x] of [[7.4, 3.2], [5.0, 3.5], [2.6, 3.4]]) {
        o.placa([[x, y + 0.7, -1.85], [x + 0.45, y, -1.85], [x, y - 0.7, -1.85], [x - 0.45, y, -1.85]], 0, 0.06, "vermelho", "vermelho");
      }
    }
  }
}

/** O ENXAME: as células chegando de todo lado e se juntando no meio, rodando
 *  em espiral (`est.junta`: 0 espalhadas, 1 todas no centro). A cena das
 *  formas do ZYGARDE (src/scenes/overworld.js, `andarZygarde`). */
function zygardeenxame(o, t, _a, est) {
  const j = est?.junta ?? 0, n = 22;
  for (let k = 0; k < n; k++) {
    const a = hash1(k * 3 + 1) * TAU + j * 3.5, d = (1 - j) * (4 + hash1(k * 3 + 2) * 7);
    const y = 0.5 + j * 3.5 * hash1(k * 3 + 3) + Math.abs(Math.sin(t * 6 + k)) * 0.4 * (1 - j);
    if (j >= 0.999 && k > 3) break;
    celula(o, [Math.cos(a) * d, y, Math.sin(a) * d * 0.6], 0.55, t, k);
  }
}

// ------------------------------------------------------------- GIRATINA
// A forma ALTERADA, de lado como o DIALGA: o corpo cinza com as listras pretas
// e vermelhas na barriga, os ANÉIS DE OURO em volta, seis pernas de garra de
// ouro, a coroa de ouro na cabeça e as duas ASAS pretas de espinho vermelho,
// abrindo e fechando devagar.
function giratina(o, t) {
  const resp = Math.sin(t * 1.2) * 0.07, asa = Math.sin(t * 0.9) * 0.4;
  o.parte(); o.elipsoide([0.5, 5.0 + resp, 0], 2.7, 1.45, 1.35, "cinza");
  // a barriga listrada: preto e vermelho
  for (let k = 0; k < 6; k++) {
    o.parte(); o.elipsoide([-1.6 + k * 0.85, 4.05 + resp, 0], 0.42, 0.42, 1.05, k % 2 ? "negro" : "vermelho", 8, 5);
  }
  // os anéis de ouro em volta do corpo
  for (const x of [-1.2, 0.4, 2.0]) {
    o.parte();
    for (let k = 0; k < 10; k++) {
      const a = (k / 10) * TAU, a2 = ((k + 1) / 10) * TAU;
      const ry = 1.5 - Math.abs(x - 0.5) * 0.15, rz = 1.4 - Math.abs(x - 0.5) * 0.15;
      o.haste([x, 5.0 + resp + Math.cos(a) * ry, Math.sin(a) * rz], [x, 5.0 + resp + Math.cos(a2) * ry, Math.sin(a2) * rz], 0.16, 0.16, "ouro", 5);
    }
  }
  // o pescoço, a coroa e a cabeça
  o.parte(); o.haste([-1.9, 5.6 + resp, 0], [-2.9, 7.4, 0], 0.85, 0.6, "cinza");
  o.parte(); o.elipsoide([-2.7, 7.0, 0], 0.75, 0.3, 0.75, "ouro", 10, 5);
  o.parte(); o.elipsoide([-3.3, 7.95, 0], 0.95, 0.72, 0.7, "cinza");
  o.parte(); o.elipsoide([-4.0, 7.75, 0], 0.5, 0.35, 0.45, "ouro", 8, 5);
  for (const l of [-1, 1]) {
    olho(o, [-3.85, 8.1, 0.48 * l], 0.17, "olho");
    o.parte(); o.placa([[-3.6, 8.45, 0.5 * l], [-2.5, 9.6, 1.1 * l], [-2.2, 8.9, 0.9 * l], [-2.8, 8.2, 0.6 * l]], 0, 0.25, "ouro", "ouro");
  }
  // seis pernas, três de cada lado, com a garra de ouro
  for (const x of [-1.3, 0.5, 2.3]) {
    for (const l of [-1, 1]) {
      o.parte();
      o.haste([x, 4.4, 0.95 * l], [x - 0.2, 2.2, 1.25 * l], 0.42, 0.33, "cinza", 6);
      o.haste([x - 0.2, 2.2, 1.25 * l], [x - 0.1, 0.5, 1.3 * l], 0.33, 0.28, "negro", 6);
      o.parte(); o.cristal([x - 0.1, 0.7, 1.3 * l], [x - 0.5, -0.05, 1.4 * l], 0.3, "ouro", 5);
    }
  }
  // AS ASAS: a lâmina preta e os espinhos vermelhos na beira
  for (const l of [-1, 1]) {
    const pts = [[-0.6, 6.2, 0.9 * l], [0.6, 10.2 + asa, (2.2 + asa) * l], [2.4, 10.6 + asa, (2.6 + asa) * l],
                 [3.8, 8.6, (2.4 + asa * 0.6) * l], [2.0, 6.3, 1.0 * l]];
    o.parte(); o.placa(pts, 0, 0.3, "negro", "negro");
    for (let k = 1; k < 4; k++) {
      const b = pts[k], fora = [b[0] + 0.5, b[1] + 1.2, b[2] + 0.5 * l];
      o.parte(); o.cristal(b, fora, 0.32, "vermelho", 5);
    }
  }
  // o rabo, comprido, com a ponta de lâmina
  o.parte(); tuboCurvo(o, [[3.0, 5.2, 0], [4.4, 4.6, 0], [5.4, 3.4, 0.3], [6.2, 2.6, 0.6]], (s) => 0.75 * (1 - s) + 0.15, "cinza");
  o.parte(); o.placa([[6.0, 2.8, 0.6], [7.1, 3.4, 0.7], [6.6, 2.1, 0.7]], 0, 0.2, "negro", "negro");
}

// -------------------------------------------------------------- DARKRAI
// Flutua: não tem perna, a capa preta desce em pontas, a gola de espinhos
// vermelhos em volta do pescoço e a crina branca caindo de lado na cabeça,
// tampando um olho. O outro, azul, aparece.
function darkrai(o, t) {
  const voa = 1.0 + Math.sin(t * 1.6) * 0.25, onda = (k) => Math.sin(t * 2.2 + k) * 0.25;
  o.parte(); o.elipsoide([0, 5.4 + voa, 0], 1.0, 1.35, 0.8, "negro");
  // a capa: pontas pretas descendo, cada uma balançando
  for (let k = 0; k < 7; k++) {
    const a = -0.5 + (k / 6) * (Math.PI + 1.0);
    const x = Math.cos(a) * 0.8, z = Math.sin(a) * 0.55;
    o.parte(); o.haste([x, 5.0 + voa, z], [x * 1.6 + onda(k), 0.9 + voa + (k % 2) * 0.6, z * 1.4], 0.55, 0.08, "negro", 6);
  }
  // a gola de espinhos vermelhos
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * TAU;
    const dentro = [Math.cos(a) * 0.45, 6.75 + voa, Math.sin(a) * 0.4];
    const fora = [Math.cos(a) * 1.45, 6.4 + voa + (k % 2) * 0.35, Math.sin(a) * 1.1];
    o.parte(); o.cristal(dentro, fora, 0.3, "vermelho", 5);
  }
  // os braços finos, abertos, com a mão em ponta
  for (const l of [-1, 1]) {
    o.parte(); o.haste([0.95 * l, 6.3 + voa, 0], [1.7 * l, 4.9 + voa, 0.5], 0.3, 0.22, "negro", 6);
    o.parte(); o.cristal([1.7 * l, 4.95 + voa, 0.5], [1.95 * l, 4.1 + voa, 0.8], 0.24, "negro", 5);
  }
  // a cabeça, o olho azul e a crina branca
  o.parte(); o.elipsoide([0, 7.55 + voa, 0.05], 0.6, 0.66, 0.6, "negro");
  olho(o, [-0.24, 7.55 + voa, 0.55], 0.16, "azul");
  o.parte(); o.placa([[0.1, 8.25 + voa, 0.1], [1.4, 8.7 + voa, -0.3], [2.3, 7.5 + voa + onda(1) * 0.4, -0.3], [1.3, 7.2 + voa, 0.35],
                      [0.3, 7.5 + voa, 0.62]], 0, 0.35, "branco", "branco");
  o.parte(); o.placa([[0.4, 8.0 + voa, -0.3], [1.8, 7.0 + voa, -0.6], [1.0, 6.6 + voa + onda(2) * 0.4, -0.3]], 0, 0.25, "branco", "branco");
}

// ------------------------------------------------------------- NECROZMA
// O bicho de cristal preto: corpo e pernas de prisma, a lâmina na cabeça e,
// nas costas, os quatro braços de prisma abertos pros lados, com as pontas
// e as juntas acendendo em azul.
function necrozma(o, t) {
  const resp = Math.sin(t * 1.3) * 0.06, luz = 0.5 + 0.5 * Math.sin(t * 2.5);
  o.parte(); o.elipsoide([0, 5.0 + resp, 0], 1.3, 1.45, 1.0, "negro", 6, 5);
  o.parte(); o.cristal([0, 5.6 + resp, 0.7], [0, 4.4 + resp, 1.25], 0.55, "azul", 4);
  // as pernas de prisma, abertas
  for (const l of [-1, 1]) {
    o.parte(); o.cristal([0.7 * l, 4.0, 0], [1.2 * l, 1.9, 0.3], 0.55, "negro", 4);
    o.parte(); o.cristal([1.2 * l, 2.2, 0.3], [1.0 * l, 0.0, 0.7], 0.45, "negro", 4);
    o.parte(); o.elipsoide([1.2 * l, 2.1, 0.45], 0.25, 0.25, 0.25, luz > 0.5 ? "ciano" : "azul", 6, 4);
  }
  // a cabeça: um bloco com a lâmina pra trás e os olhos azuis
  o.parte(); o.elipsoide([0, 7.0 + resp, 0.35], 0.7, 0.6, 0.75, "negro", 6, 4);
  o.parte(); o.cristal([0, 7.3 + resp, 0.1], [0, 8.6 + resp, -0.9], 0.45, "negro", 4);
  for (const l of [-1, 1]) olho(o, [0.3 * l, 7.1 + resp, 1.0], 0.12, "ciano");
  // os quatro braços de prisma das costas: dois pra cima, dois pra baixo
  for (const l of [-1, 1]) {
    for (const [cima, alto] of [[1, 8.6], [0, 3.4]]) {
      const ombro = [0.9 * l, 6.0 + resp, -0.5];
      const ponta = [(cima ? 3.4 : 3.1) * l, alto + resp * 2, -0.9];
      o.parte(); o.cristal(ombro, ponta, 0.5, "negro", 4);
      o.parte(); o.cristal(ponta, [ponta[0] + 0.5 * l, ponta[1] + (cima ? 0.7 : -0.7), ponta[2]], 0.3, "azul", 4);
    }
    o.parte(); o.elipsoide([0.95 * l, 6.0 + resp, -0.5], 0.3, 0.3, 0.3, luz > 0.5 ? "ciano" : "azul", 6, 4);
  }
}

// --------------------------------------------------------------- DEOXYS
// A forma NORMAL: pernas finas laranja, o tronco verde-água com o cristal
// roxo no peito, a cabeça de crista pra trás e os BRAÇOS de dois fios
// enrolados, um laranja e um azul, balançando.
function deoxys(o, t) {
  const resp = Math.sin(t * 1.8) * 0.06;
  for (const l of [-1, 1]) {
    o.parte(); o.haste([0.45 * l, 3.9, 0], [0.6 * l, 2.0, 0.1], 0.32, 0.24, "laranja", 6);
    o.parte(); o.haste([0.6 * l, 2.0, 0.1], [0.65 * l, 0.35, 0], 0.24, 0.2, "laranja", 6);
    o.parte(); o.elipsoide([0.65 * l, 0.2, 0.25], 0.3, 0.2, 0.45, "laranja", 6, 4);
  }
  o.parte(); o.elipsoide([0, 4.2 + resp, 0], 0.75, 0.55, 0.6, "laranja");
  o.parte(); o.elipsoide([0, 5.4 + resp, 0], 0.85, 1.15, 0.65, "verde");
  o.parte(); o.elipsoide([0, 5.5 + resp, 0.6], 0.28, 0.3, 0.15, "roxo", 6, 4);
  // os braços: dois fios enrolados de cada lado
  for (const l of [-1, 1]) {
    for (const [cor, fase] of [["laranja", 0], ["azul", Math.PI]]) {
      const pts = [];
      for (let k = 0; k <= 5; k++) {
        const u = k / 5, a = fase + u * 7 + t * 2;
        pts.push([(0.85 + u * 1.0) * l + Math.cos(a) * 0.18, 6.2 + resp - u * 3.0, 0.2 + u * 0.6 + Math.sin(a) * 0.18 + Math.sin(t * 1.5 + l) * u * 0.4]);
      }
      o.parte(); tuboCurvo(o, pts, (s) => 0.2 * (1 - s) + 0.08, cor);
    }
  }
  // a cabeça com a crista e o rosto verde
  o.parte(); o.haste([0, 6.4 + resp, 0], [0, 7.0 + resp, 0], 0.32, 0.3, "laranja", 6);
  o.parte(); o.elipsoide([0, 7.4 + resp, 0], 0.62, 0.68, 0.62, "laranja");
  o.parte(); o.elipsoide([0, 7.35 + resp, 0.45], 0.36, 0.42, 0.22, "verde", 8, 5);
  for (const l of [-1, 1]) olho(o, [0.16 * l, 7.45 + resp, 0.62], 0.08, "negro");
  o.parte(); o.placa([[0, 7.9 + resp, 0.3], [0, 9.0 + resp, -1.0], [0, 7.4 + resp, -0.6]], 0, 0.35, "laranja", "laranja");
}

const VERDE_ZYG = ["#cfdf9f", "#afcf4f", "#7f9f1f", "#4f7f1f"];
const PALETA_ZYG = {
  verde: VERDE_ZYG,
  escuro: ["#8a7576", "#6a5758", "#4a3c3c", "#2e2420"],
  marrom: ["#9a8586", "#7a6566", "#564748", "#38302e"],
  branco: ["#fefefe", "#fefefe", "#bcbe8f", "#8e9060"],
  vermelho: ["#ec484d", "#ec484d", "#c23033", "#8a1a1e"],
  azul: ["#6a9cff", "#3a6cdf", "#2a4caf", "#1a2c7f"],
  laranja: ["#ffa040", "#f08020", "#c06010", "#804008"],
  brilho: ["#ffffff", "#e8ffc0"],
  contorno: "#080808",
};

// `escala`: o tamanho perto do herói (22 px); `giro`: quem é montado de lado
const LENDAS_3D = {
  arceus: {   // 3 heróis
    modelo: arceus, escala: 2.9, giro: 0.75, largura: 6,
    paleta: {
      branco: ["#ffffff", "#e6e6ef", "#b5b5bd", "#84848c"],
      cinza: ["#7b8494", "#5a6373", "#3a4252", "#2a3242"],
      ouro: ["#ffef5a", "#dec53a", "#bda519", "#847300"],
      verde: ["#80ff80", "#00e600", "#009c00", "#006000"],
      contorno: "#101010",
    },
  },
  dialga: {   // 4 heróis
    modelo: dialga, escala: 3.3, giro: 0.7, largura: 7,
    paleta: {
      azul: ["#63a5c5", "#3a7bb5", "#215a94", "#21426b"],
      prata: ["#deefff", "#bdcede", "#8ca5b5", "#5a6373"],
      barbatana: ["#deefff", "#bdcede", "#9cd6f7", "#63a5c5"],
      diamante: ["#ffffff", "#9cd6f7", "#4284ff", "#2a5ad0"],
      olho: ["#f75242", "#f75242", "#b02a20", "#b02a20"],
      contorno: "#101010",
    },
  },
  palkia: {   // 3,5 heróis
    modelo: palkia, escala: 3.0, largura: 6,
    paleta: {
      branco: ["#ffffff", "#efe6ff", "#ceb5d6", "#a59cb5"],
      lilas: ["#efe6ff", "#ceb5d6", "#a59cb5", "#73737b"],
      roxo: ["#d58aef", "#bd6bd6", "#8c5294", "#5a2a60"],
      asa: ["#f7efff", "#efe6ff", "#ceb5d6", "#a59cb5"],
      perola: ["#ffd0cc", "#f7a59c", "#bd6bd6", "#8c5294"],
      cinza: ["#9c9ca5", "#73737b", "#3a3a3a", "#2a2a2a"],
      olho: ["#f75242", "#f75242", "#a02020", "#a02020"],
      contorno: "#101010",
    },
  },
  xerneas: {   // 3 heróis
    modelo: xerneas, escala: 2.7, giro: 0.75, largura: 5,
    paleta: {
      negro: ["#7a7a7a", "#5e5e5e", "#484848", "#343434"],
      azul: ["#8aabf0", "#638bdd", "#4257a0", "#202866"],
      chifre: ["#ffe5b4", "#bea96e", "#7a6c46", "#4a4030"],
      laranja: ["#ffe0a0", "#ffc67b", "#ff9d4c", "#c7653e"],
      vermelho: ["#ff9d80", "#ff6040", "#dd2e0f", "#a01a08"],
      ciano: ["#a0f0ff", "#40c8f0", "#0082a6", "#005a75"],
      violeta: ["#e0b0f0", "#b07ac0", "#824e8c", "#5a3460"],
      contorno: "#101010",
    },
  },
  yveltal: {   // 4 heróis, de asa aberta
    modelo: yveltal, escala: 2.9, largura: 7,
    paleta: {
      negro: ["#7a858b", "#586369", "#3c4247", "#282d31"],
      vermelho: ["#ec4434", "#c43647", "#982e3b", "#5b1929"],
      cinza: ["#c4b8b7", "#a49897", "#6d6969", "#464342"],
      ciano: ["#a0ffff", "#43c8cf", "#2a8890", "#2a8890"],
      contorno: "#010101",
    },
  },
  giratina: {   // 4 heróis, de lado como o DIALGA
    modelo: giratina, escala: 3.3, giro: 0.7, largura: 7,
    paleta: {
      cinza: ["#c6c6ce", "#a5a5ad", "#73737b", "#4a4a52"],
      negro: ["#5a5a62", "#3a3a42", "#26262c", "#18181c"],
      vermelho: ["#ff6b5a", "#e63a2a", "#a52010", "#6b1008"],
      ouro: ["#ffe67b", "#e6c53a", "#b59419", "#7b6300"],
      olho: ["#ff4a3a", "#ff4a3a", "#a51a10", "#a51a10"],
      contorno: "#101010",
    },
  },
  darkrai: {   // 2 heróis, flutuando
    modelo: darkrai, escala: 2.1, largura: 3,
    paleta: {
      negro: ["#6a6a72", "#48484f", "#303036", "#1c1c20"],
      vermelho: ["#ff5a52", "#d6312a", "#9c1a14", "#5a0c08"],
      branco: ["#ffffff", "#e6e6ee", "#b5b5c5", "#848494"],
      azul: ["#8ad6ff", "#3aa5ef", "#1a6bb5", "#1a6bb5"],
      contorno: "#080808",
    },
  },
  necrozma: {   // 2,5 heróis
    modelo: necrozma, escala: 2.7, largura: 4,
    paleta: {
      negro: ["#6b6b7b", "#4a4a5a", "#2e2e3a", "#1a1a22"],
      azul: ["#9cdeff", "#4aa5ef", "#2a6bc5", "#1a428c"],
      ciano: ["#e6ffff", "#a5f7ff", "#4ad6ef", "#2a9cb5"],
      contorno: "#080808",
    },
  },
  deoxys: {   // 2 heróis
    modelo: deoxys, escala: 2.2, largura: 3,
    paleta: {
      laranja: ["#ffb57b", "#f7843a", "#c55a21", "#8c3a10"],
      verde: ["#a5f7d6", "#5ad6b5", "#2a9c84", "#1a6b5a"],
      azul: ["#8cc5ff", "#4a8cef", "#2a5abd", "#1a3a84"],
      roxo: ["#d69cff", "#a55aef", "#7331bd", "#4a1a84"],
      negro: ["#4a4a52", "#2a2a30", "#1a1a1e", "#101012"],
      contorno: "#101010",
    },
  },
  zygardecelula: { modelo: zygardecelula, escala: 1.6, largura: 2, paleta: PALETA_ZYG },
  zygardenucleo: { modelo: zygardenucleo, escala: 2.2, largura: 3, paleta: PALETA_ZYG },
  zygardeenxame: { modelo: zygardeenxame, escala: 2.2, largura: 0, paleta: PALETA_ZYG },
  zygarde10: { modelo: zygarde10, escala: 1.9, giro: 0.75, largura: 4, paleta: PALETA_ZYG },   // 1,3 herói: um cachorro
  zygarde: { modelo: zygarde, escala: 2.9, largura: 5, paleta: PALETA_ZYG },                   // 3,5 heróis
  zygardecompleto: { modelo: zygardecompleto, escala: 3.6, largura: 6, paleta: PALETA_ZYG },   // 4,5 heróis
};

/** Quem tem modelo 3D pra ficar em pé no mapa (os Regis e os lendários) */
export const tem3D = (id) => !!(LENDAS_3D[id] || REGIS_3D[id]);

const alturas = {};
/** Quantos pixels de altura `id` tem em pé na tela (medido uma vez, no
 *  próprio buffer: chamar fora do desenho, que ele apaga o que estiver lá) */
export function altura3D(id) {
  if (alturas[id] !== undefined) return alturas[id];
  const R = LENDAS_3D[id] || REGIS_3D[id];
  if (!R) return (alturas[id] = 0);
  const b = buffers();
  limpar(b);
  pintarEmPe(b, R, W / 2, H - 4, 0);
  let topo = H;
  for (let i = 0; i < W * H && topo === H; i++) if (b.z[i]) topo = Math.floor(i / W);
  limpar(b);
  return (alturas[id] = H - 4 - topo);
}

/** Desenha `id` EM PÉ, parado no mapa, com os pés em (sx, sy), por cima do que
 *  já está em `ctx`. `cresce`, `est`: ver `pintarEmPe`; `branco` (0 a 1): o
 *  clarão de quando ele muda de forma. */
export function desenharParado(ctx, id, sx, sy, tempo, { cresce = 1, est = null, branco = 0, sombra = true } = {}) {
  const R = LENDAS_3D[id] || REGIS_3D[id];
  if (!R) return;
  const b = buffers();
  limpar(b);
  const { E } = pintarEmPe(b, R, sx, sy, tempo, { cresce, est });
  if (branco > 0) {
    const k = Math.min(1, branco);
    for (let i = 0; i < W * H; i++) {
      if (!b.z[i]) continue;
      const c = b.px[i];
      const r = c & 255, g = (c >> 8) & 255, bl = (c >> 16) & 255;
      b.px[i] = (0xff000000 | ((bl + (255 - bl) * k) << 16) | ((g + (255 - g) * k) << 8) | (r + (255 - r) * k)) >>> 0;
    }
  }
  if (sombra && R.largura) sombraNoChao(b, sx, sy, (R.largura * E * F) / Z_REGI * 0.5);
  b.ctx.putImageData(b.img, 0, 0);
  ctx.drawImage(b.cv, 0, 0);
}

// ======================================================= AS MONTARIAS VOADORAS
//
// Quem sabe VOAR te leva no céu (src/scenes/overworld.js, `montar`). Estes
// têm modelo 3D: voando de barriga pra baixo, a cabeça pro -x (o giro vira
// ele pra onde você vai), as asas batendo pros lados e a SELA nas costas, onde
// o herói vai sentado. Fora da montaria, te seguindo ou no mato, eles
// aparecem do mesmo jeito: pairando, batendo asa.

/** a batida de asa: -1 a 1 (`ritmo`: batidas por segundo × 2π) */
const asaBate = (t, ritmo = 5) => Math.sin(t * ritmo);

/** Uma ASA de membrana: do ombro ao cotovelo e à ponta, a pele esticada até
 *  as costas; `l` = lado (1 perto de você, -1 longe) */
function asaMembrana(o, ombro, cot, ponta, costas, l, osso, pele) {
  o.parte(); o.haste(ombro, cot, 0.22, 0.17, osso, 5); o.haste(cot, ponta, 0.17, 0.08, osso, 5);
  o.parte(); o.placa([ombro, cot, ponta, costas], 0, 0.14, pele, pele);
}

/** Uma ASA DE PENAS: o braço e as penas penduradas nele, abrindo em leque pra
 *  trás; `cores` alterna as penas */
function asaPenas(o, ombro, cot, ponta, l, osso, cores, comprido = 1.6) {
  o.parte(); o.haste(ombro, cot, 0.3, 0.24, osso, 6); o.haste(cot, ponta, 0.24, 0.12, osso, 6);
  o.parte(); o.placa([ombro, cot, [cot[0] + 1.1, cot[1] - 0.3, cot[2] * 0.85], [ombro[0] + 1.4, ombro[1] - 0.2, ombro[2]]], 0, 0.16, osso, osso);
  const n = 6;
  for (let k = 0; k < n; k++) {
    const f = k / (n - 1), raiz = [cot[0] + (ponta[0] - cot[0]) * f, cot[1] + (ponta[1] - cot[1]) * f, cot[2] + (ponta[2] - cot[2]) * f];
    const L = comprido * (1.25 - f * 0.35);
    o.parte();
    o.placa([[raiz[0] - 0.2, raiz[1], raiz[2] - 0.3 * l], [raiz[0] + 0.25, raiz[1] + 0.05, raiz[2] + 0.3 * l],
             [raiz[0] + L + 0.3, raiz[1] - 0.25, raiz[2] + (0.45 + f * 0.4) * l], [raiz[0] + L, raiz[1] - 0.3, raiz[2] - 0.05 * l]],
            0, 0.12, cores[k % cores.length], cores[k % cores.length]);
  }
}

// -------------------------------------------------------------- GYARADOS
// A serpente azul, ondulando no ar (e na água): a barriga creme, as
// barbatanas brancas nas costas, a crista azul na cabeça, a boca aberta e os
// bigodes brancos. Ele não tem asa: voa nadando no ar.
function gyarados(o, t) {
  const w = (k) => Math.sin(t * 3 - k * 0.9) * 0.45 * Math.min(1, k * 0.5);
  const pts = [[-1.7, 3.6, 0], [-0.4, 3.1, w(1)], [1.0, 3.0, w(2)], [2.4, 3.3, w(3)], [3.6, 3.0, w(4)], [4.6, 2.6, w(5)]];
  o.parte(); tuboCurvo(o, pts, (u) => 0.85 * (1 - u) + 0.18, "azul");
  o.parte(); tuboCurvo(o, pts.map(([x, y, z]) => [x, y - 0.4, z]), (u) => 0.62 * (1 - u) + 0.1, "creme");
  // as barbatanas brancas nas costas
  for (const k of [1, 2, 3]) {
    const [x, y, z] = pts[k], r = 0.85 * (1 - k / 5) + 0.18;
    o.parte(); o.placa([[x - 0.4, y + r - 0.1, z], [x + 0.1, y + r + 0.8, z], [x + 0.6, y + r - 0.1, z]], 0, 0.12, "branco", "branco");
  }
  // o rabo em leque
  const [tx, ty, tz] = pts[5];
  o.parte(); o.placa([[tx - 0.2, ty, tz], [tx + 1.1, ty + 0.9, tz + 0.7], [tx + 0.8, ty, tz], [tx + 1.1, ty - 0.9, tz - 0.7]], 0, 0.15, "azul", "branco");
  // a cabeça: a crista, a boca aberta e os bigodes
  o.parte(); o.elipsoide([-2.35, 4.05, 0], 0.95, 0.78, 0.78, "azul");
  o.parte(); o.elipsoide([-3.05, 3.8, 0], 0.62, 0.42, 0.58, "azul", 10, 6);
  o.parte(); o.elipsoide([-3.05, 3.42, 0], 0.55, 0.2, 0.48, "boca", 8, 4);
  o.parte(); o.elipsoide([-2.95, 3.2, 0], 0.5, 0.22, 0.45, "creme", 8, 4);
  o.parte(); o.placa([[-2.5, 4.7, 0], [-1.7, 6.0, 0], [-1.3, 4.6, 0]], 0, 0.22, "azul", "branco");
  for (const l of [-1, 1]) {
    olho(o, [-2.75, 4.3, 0.55 * l], 0.14, "olho");
    o.parte(); o.placa([[-2.1, 4.1, 0.65 * l], [-1.4, 4.5, 1.6 * l], [-1.3, 3.8, 0.9 * l]], 0, 0.12, "branco", "branco");
    const bal = Math.sin(t * 4 + l) * 0.2;
    o.parte(); o.haste([-3.4, 3.85, 0.4 * l], [-2.9, 3.3 + bal, 1.5 * l], 0.09, 0.05, "branco", 4);
  }
}

// ---------------------------------------------------------------- LAPRAS
// Nadando: o corpo azul meio dentro d'água, a barriga creme, o CASCO cinza
// com as pontas, o pescoço comprido com o chifrinho, e as nadadeiras remando.
// Você vai sentado no casco.
function lapras(o, t) {
  const rema = Math.sin(t * 2.4) * 0.35;
  o.parte(); o.elipsoide([0.3, 2.2, 0], 1.9, 0.95, 1.45, "azul");
  o.parte(); o.elipsoide([0.2, 1.75, 0], 1.65, 0.6, 1.25, "creme");
  o.parte(); o.elipsoide([0.6, 2.85, 0], 1.65, 0.72, 1.35, "casco");
  for (const [x, z] of [[-0.3, 0.7], [-0.3, -0.7], [0.8, 0.95], [0.8, -0.95], [1.7, 0.5], [1.7, -0.5]]) {
    o.parte(); o.cristal([x, 3.0, z], [x + 0.15, 3.65, z * 1.1], 0.24, "casco", 5);
  }
  // nadadeiras: duas na frente, duas atrás, remando
  for (const l of [-1, 1]) {
    o.parte(); o.placa([[-0.9, 2.0, 1.2 * l], [-0.8 + rema, 1.6, 2.7 * l], [0.1 + rema, 1.75, 2.4 * l], [0.1, 2.0, 1.3 * l]], 0, 0.15, "azul", "azul");
    o.parte(); o.placa([[1.6, 2.0, 1.0 * l], [2.3 - rema, 1.7, 2.0 * l], [2.5 - rema, 1.9, 1.3 * l]], 0, 0.15, "azul", "azul");
  }
  // o pescoço, a cabeça, o chifre e as orelhas
  o.parte(); o.haste([-1.3, 2.6, 0], [-2.1, 4.5, 0], 0.55, 0.42, "azul");
  o.parte(); o.haste([-1.45, 2.4, 0.2], [-2.05, 4.2, 0.25], 0.38, 0.3, "creme", 6);
  o.parte(); o.elipsoide([-2.4, 4.85, 0], 0.72, 0.55, 0.58, "azul");
  o.parte(); o.elipsoide([-3.0, 4.65, 0], 0.42, 0.3, 0.38, "azul", 8, 5);
  o.parte(); o.cristal([-2.3, 5.3, 0], [-2.05, 5.95, 0], 0.18, "casco", 5);
  for (const l of [-1, 1]) {
    olho(o, [-2.7, 5.0, 0.42 * l], 0.12, "olho");
    o.parte(); o.placa([[-2.1, 5.0, 0.4 * l], [-1.5, 5.5, 0.85 * l], [-1.7, 4.8, 0.55 * l]], 0, 0.12, "azul", "azul");
  }
}

// -------------------------------------------------------------- CHARIZARD
// Laranja, a barriga creme, as asas com a pele azul-esverdeada, os dois
// chifres pra trás e a CHAMA na ponta do rabo, tremendo.
function charizard(o, t) {
  const f = asaBate(t, 6) * 0.9;
  o.parte(); o.elipsoide([0, 3, 0], 1.6, 1.05, 1.0, "laranja");
  o.parte(); o.elipsoide([-0.15, 2.65, 0], 1.3, 0.7, 0.8, "creme");
  o.parte(); o.haste([-1.2, 3.4, 0], [-2.1, 4.2, 0], 0.55, 0.42, "laranja");
  o.parte(); o.elipsoide([-2.55, 4.45, 0], 0.72, 0.58, 0.6, "laranja");
  o.parte(); o.elipsoide([-3.2, 4.3, 0], 0.55, 0.34, 0.42, "laranja");
  for (const l of [-1, 1]) {
    olho(o, [-2.95, 4.62, 0.42 * l], 0.13, "olho");
    o.parte(); o.cristal([-2.3, 4.85, 0.3 * l], [-1.55, 5.35, 0.42 * l], 0.16, "creme", 4);
    asaMembrana(o, [-0.6, 3.75, 0.65 * l], [0.1, 5.0 + f, 2.5 * l], [1.3, 4.6 + f * 1.4, 4.4 * l], [1.3, 3.5, 0.9 * l], l, "laranja", "asa");
    // as pernas encolhidas pra trás e os bracinhos
    o.parte(); o.elipsoide([0.8, 2.5, 0.6 * l], 0.6, 0.55, 0.4, "laranja", 8, 5);
    o.haste([0.9, 2.2, 0.65 * l], [1.6, 1.8, 0.7 * l], 0.25, 0.2, "laranja", 5);
    o.parte(); o.haste([-1.1, 2.9, 0.55 * l], [-1.6, 2.3, 0.6 * l], 0.17, 0.14, "laranja", 5);
  }
  o.parte(); tuboCurvo(o, [[1.4, 3.0, 0], [2.4, 2.8, 0], [3.3, 3.1, 0], [3.9, 3.7, 0]], (u) => 0.55 * (1 - u) + 0.12, "laranja");
  // a chama: três bolas que crescem e encolhem fora de compasso
  const fog = (k) => 1 + Math.sin(t * 13 + k * 2.1) * 0.18;
  o.parte(); o.elipsoide([4.05, 4.15, 0], 0.42 * fog(0), 0.55 * fog(0), 0.42 * fog(0), "fogo", 8, 5);
  o.parte(); o.elipsoide([4.1, 4.55, 0], 0.24 * fog(1), 0.38 * fog(1), 0.24 * fog(1), "chama", 6, 4);
}

// -------------------------------------------------------------- DRAGONITE
// Gordinho, amarelo-laranja, a barriga creme listrada, as ASINHAS verdes (que
// batem rápido: é pequena pro tamanho dele), as antenas e o rabo grosso.
function dragonite(o, t) {
  const f = asaBate(t, 9) * 0.7;
  o.parte(); o.elipsoide([0, 3, 0], 1.7, 1.35, 1.3, "corpo");
  o.parte(); o.elipsoide([-0.1, 2.5, 0], 1.35, 0.95, 1.05, "barriga");
  o.parte(); o.elipsoide([-1.9, 4.3, 0], 0.82, 0.75, 0.72, "corpo");
  o.parte(); o.elipsoide([-2.6, 4.1, 0], 0.48, 0.42, 0.48, "corpo");
  for (const l of [-1, 1]) {
    olho(o, [-2.35, 4.5, 0.48 * l], 0.12, "olho");
    o.parte(); o.haste([-1.85, 4.95, 0.3 * l], [-1.4, 5.9, 0.5 * l], 0.07, 0.06, "corpo", 4);
    o.elipsoide([-1.38, 6.0, 0.5 * l], 0.16, 0.16, 0.16, "corpo", 6, 4);
    o.parte(); o.cristal([-1.7, 4.9, 0.2 * l], [-1.5, 5.3, 0.28 * l], 0.1, "barriga", 4);
    o.parte(); o.placa([[-0.3, 4.2, 0.9 * l], [0.3, 5.4 + f, 2.0 * l], [1.3, 4.9 + f, 2.5 * l], [0.9, 3.9, 1.0 * l]], 0, 0.14, "asa", "asa");
    o.parte(); o.haste([-1.1, 3.1, 0.85 * l], [-1.7, 2.4, 1.0 * l], 0.25, 0.2, "corpo", 5);
    o.parte(); o.elipsoide([0.9, 1.9, 0.6 * l], 0.55, 0.45, 0.45, "corpo", 8, 5);
  }
  o.parte(); tuboCurvo(o, [[1.4, 2.8, 0], [2.5, 2.4, 0], [3.4, 2.6, 0], [3.9, 3.1, 0]], (u) => 0.8 * (1 - u) + 0.15, "corpo");
}

// -------------------------------------------------------------- PIDGEOT
// O pássaro marrom de barriga creme, o bico rosado e a CRISTA comprida
// vermelha e amarela voando pra trás; as asas grandes de penas e o rabo em
// leque, também vermelho e amarelo.
function pidgeot(o, t) {
  const f = asaBate(t, 4.5) * 1.0;
  o.parte(); o.elipsoide([0, 3, 0], 1.5, 0.85, 0.9, "marrom");
  o.parte(); o.elipsoide([-0.3, 2.7, 0], 1.15, 0.6, 0.75, "creme");
  o.parte(); o.elipsoide([-1.75, 3.55, 0], 0.62, 0.55, 0.55, "marrom");
  o.parte(); o.cristal([-2.2, 3.5, 0], [-2.85, 3.3, 0], 0.2, "bico", 4);
  for (const l of [-1, 1]) {
    olho(o, [-2.0, 3.7, 0.4 * l], 0.11, "olho");
    asaPenas(o, [-0.6, 3.3, 0.6 * l], [0.1, 3.9 + f, 2.4 * l], [0.4, 3.7 + f * 1.5, 4.4 * l], l, "marrom", ["marrom", "creme", "marrom"], 1.7);
  }
  // a crista: penas compridas vermelhas e amarelas, ondulando
  for (let k = 0; k < 4; k++) {
    const ond = Math.sin(t * 5 + k) * 0.2, z = (k - 1.5) * 0.12;
    o.parte();
    o.placa([[-1.9, 4.0, z], [-1.4, 4.2, z], [0.9 + k * 0.3, 4.4 + ond - k * 0.12, z], [0.6 + k * 0.3, 4.1 + ond - k * 0.15, z]], 0, 0.1, k % 2 ? "amarelo" : "vermelho", "vermelho");
  }
  // o rabo em leque
  for (let k = -2; k <= 2; k++) {
    o.parte();
    o.placa([[1.2, 3.0, k * 0.15], [1.4, 3.15, k * 0.2], [3.2, 3.0 + Math.sin(t * 4 + k) * 0.1, k * 0.65 + 0.2], [3.1, 2.85, k * 0.65 - 0.2]], 0, 0.1, k % 2 ? "amarelo" : "vermelho", "vermelho");
  }
}

// -------------------------------------------------------------- SALAMENCE
// Azul, a barriga cinza, as ASAS VERMELHAS em lua crescente e os chifres
// cinza pra trás. Quatro patas encolhidas e o rabo comprido.
function salamence(o, t) {
  const f = asaBate(t, 5) * 0.9;
  o.parte(); o.elipsoide([0, 3, 0], 1.8, 0.95, 0.95, "azul");
  o.parte(); o.elipsoide([-0.4, 2.6, 0], 1.3, 0.62, 0.75, "cinza");
  o.parte(); o.haste([-1.5, 3.3, 0], [-2.3, 3.8, 0], 0.55, 0.45, "azul");
  o.parte(); o.elipsoide([-2.75, 3.95, 0], 0.68, 0.5, 0.52, "azul");
  o.parte(); o.elipsoide([-3.35, 3.75, 0], 0.48, 0.28, 0.38, "azul");
  o.parte(); o.elipsoide([-3.0, 3.55, 0], 0.55, 0.2, 0.32, "vermelho", 8, 4);
  for (const l of [-1, 1]) {
    olho(o, [-2.95, 4.15, 0.38 * l], 0.11, "olho");
    o.parte(); o.cristal([-2.5, 4.3, 0.3 * l], [-1.6, 4.65, 0.5 * l], 0.15, "cinza", 4);
    o.parte();
    o.placa([[-0.5, 3.6, 0.8 * l], [0.5, 4.8 + f, 2.6 * l], [2.0, 4.4 + f * 1.4, 4.6 * l], [1.3, 3.4, 1.1 * l]], 0, 0.15, "vermelho", "vermelho");
    for (const x of [-1.0, 1.1]) { o.parte(); o.haste([x, 2.5, 0.6 * l], [x + 0.6, 1.9, 0.65 * l], 0.25, 0.2, "azul", 5); }
  }
  o.parte(); tuboCurvo(o, [[1.6, 3.0, 0], [2.8, 2.9, 0], [3.8, 3.2, 0], [4.5, 3.6, 0]], (u) => 0.55 * (1 - u) + 0.08, "azul");
}

// -------------------------------------------------------------- LUGIA
// O guardião do mar: branco, a barriga azul-clara, as BARBATANAS AZUIS das
// costas e dos olhos, o pescoço comprido e as asas em forma de mão (os
// "dedos" das penas da ponta).
function lugia(o, t) {
  const f = asaBate(t, 3.2) * 1.0;
  o.parte(); o.elipsoide([0, 3.4, 0], 2.0, 1.1, 1.1, "branco");
  o.parte(); o.elipsoide([-0.2, 3.0, 0], 1.6, 0.75, 0.85, "barriga");
  o.parte(); tuboCurvo(o, [[-1.6, 3.8, 0], [-2.5, 4.5, 0], [-3.3, 4.8, 0]], (u) => 0.6 - u * 0.2, "branco", { fecha: false });
  o.parte(); o.elipsoide([-3.8, 4.85, 0], 0.72, 0.5, 0.52, "branco");
  o.parte(); o.elipsoide([-4.4, 4.7, 0], 0.4, 0.3, 0.35, "branco");
  for (const l of [-1, 1]) {
    o.parte(); o.elipsoide([-3.75, 4.95, 0.4 * l], 0.42, 0.22, 0.16, "azul", 8, 4);
    olho(o, [-3.85, 4.98, 0.5 * l], 0.09, "olho");
    // a asa: braço grosso, a mão aberta com quatro dedos azuis na ponta
    const ombro = [-0.6, 3.9, 0.8 * l], cot = [0.2, 5.0 + f, 2.8 * l], mao = [0.5, 4.8 + f * 1.5, 5.0 * l];
    o.parte(); o.haste(ombro, cot, 0.45, 0.35, "branco", 6); o.haste(cot, mao, 0.35, 0.3, "branco", 6);
    o.parte(); o.placa([ombro, cot, mao, [1.6, 3.6, 1.2 * l]], 0, 0.15, "branco", "branco");
    for (let k = 0; k < 4; k++) {
      o.parte(); o.cristal([mao[0] + k * 0.25, mao[1] - 0.1, mao[2] - k * 0.15 * l], [mao[0] + 1.3 + k * 0.35, mao[1] - 0.5 - k * 0.15, mao[2] + (0.6 - k * 0.3) * l], 0.17, "azul", 4);
    }
  }
  // as barbatanas das costas
  for (let k = 0; k < 3; k++) {
    o.parte(); o.placa([[-0.6 + k * 0.9, 4.3, 0], [-0.2 + k * 0.9, 5.2 - k * 0.2, 0], [0.4 + k * 0.9, 4.2, 0]], 0, 0.15, "azul", "azul");
  }
  o.parte(); tuboCurvo(o, [[1.8, 3.4, 0], [3.0, 3.3, 0], [4.2, 3.6, 0], [5.0, 4.0, 0]], (u) => 0.6 * (1 - u) + 0.1, "branco");
  for (const l of [-1, 1]) { o.parte(); o.placa([[4.6, 3.8, 0], [5.6, 4.1, 0.9 * l], [5.3, 3.7, 0.5 * l]], 0, 0.12, "azul", "azul"); }
}

// -------------------------------------------------------------- HO-OH
// A fênix do arco-íris: corpo vermelho, a barriga branca, o bico e a crista
// de ouro, as asas com as penas vermelhas, douradas e VERDES na ponta, e o
// rabo comprido de penas douradas e verdes.
function hooh(o, t) {
  const f = asaBate(t, 3.6) * 1.0;
  o.parte(); o.elipsoide([0, 3.4, 0], 1.6, 1.0, 1.0, "vermelho");
  o.parte(); o.elipsoide([-0.3, 3.0, 0], 1.2, 0.7, 0.8, "creme");
  o.parte(); o.haste([-1.3, 3.8, 0], [-1.95, 4.4, 0], 0.48, 0.4, "vermelho");
  o.parte(); o.elipsoide([-2.3, 4.55, 0], 0.6, 0.52, 0.52, "vermelho");
  o.parte(); o.cristal([-2.7, 4.5, 0], [-3.35, 4.25, 0], 0.22, "ouro", 4);
  for (const l of [-1, 1]) {
    olho(o, [-2.55, 4.7, 0.4 * l], 0.1, "olho");
    asaPenas(o, [-0.5, 3.8, 0.65 * l], [0.2, 4.6 + f, 2.6 * l], [0.5, 4.4 + f * 1.5, 4.8 * l], l, "vermelho", ["vermelho", "ouro", "verde"], 2.0);
  }
  for (let k = 0; k < 3; k++) {
    o.parte(); o.placa([[-2.4, 5.0, (k - 1) * 0.15], [-2.0, 5.1, (k - 1) * 0.15], [-0.8 + k * 0.3, 5.7 - k * 0.2, (k - 1) * 0.3], [-1.1 + k * 0.3, 5.4 - k * 0.2, (k - 1) * 0.3]], 0, 0.1, "ouro", "ouro");
  }
  for (let k = -2; k <= 2; k++) {
    const ond = Math.sin(t * 3 + k) * 0.25;
    o.parte();
    o.placa([[1.3, 3.4, k * 0.15], [1.5, 3.55, k * 0.2], [4.6 - Math.abs(k) * 0.4, 3.4 + ond, k * 0.7 + 0.2], [4.4 - Math.abs(k) * 0.4, 3.2 + ond, k * 0.7 - 0.2]], 0, 0.1, k % 2 ? "verde" : "ouro", "ouro");
  }
}

// `escala`: o tamanho perto do herói; `sela`: onde o herói senta (no modelo)
const MONTARIAS_3D = {
  charizard: {   // 2 heróis de comprido
    modelo: charizard, escala: 3.8, sela: [-0.5, 3.9, 0], largura: 3,
    paleta: {
      laranja: ["#f8a858", "#f08030", "#c05818", "#803810"],
      creme: ["#f8f0b0", "#f0d880", "#c8a850", "#806830"],
      asa: ["#68b8c8", "#3890a8", "#286880", "#184858"],
      fogo: ["#fff8a0", "#f8d030", "#f08030", "#c04010"],
      chama: ["#ffffff", "#fff8a0", "#f8d030", "#f08030"],
      olho: ["#ffffff", "#3080c0", "#204080", "#102040"],
      contorno: "#181010",
    },
  },
  dragonite: {
    modelo: dragonite, escala: 3.6, sela: [-0.4, 4.25, 0], largura: 3,
    paleta: {
      corpo: ["#f8d888", "#f0b858", "#c88838", "#885420"],
      barriga: ["#f8f0c8", "#f0e0a0", "#c8b070", "#887040"],
      asa: ["#98e8d8", "#58c0a8", "#309078", "#206050"],
      olho: ["#605040", "#403020", "#201810", "#201810"],
      contorno: "#181010",
    },
  },
  pidgeot: {
    modelo: pidgeot, escala: 3.6, sela: [-0.3, 3.75, 0], largura: 3,
    paleta: {
      marrom: ["#e8c080", "#c89858", "#987040", "#604428"],
      creme: ["#fff8d8", "#f8e8b0", "#d0b880", "#988050"],
      bico: ["#f8c8a8", "#e89878", "#b86850", "#804030"],
      vermelho: ["#f87858", "#e04830", "#a82820", "#701810"],
      amarelo: ["#fff080", "#f8d040", "#c8a020", "#887010"],
      olho: ["#202020", "#202020", "#101010", "#101010"],
      contorno: "#181010",
    },
  },
  salamence: {
    modelo: salamence, escala: 3.8, sela: [-0.6, 3.85, 0], largura: 3,
    paleta: {
      azul: ["#88c0e8", "#5898d0", "#3870a8", "#204878"],
      cinza: ["#e8e8e0", "#c0c0b8", "#909088", "#606058"],
      vermelho: ["#f88080", "#e04848", "#a82830", "#701820"],
      olho: ["#f8e070", "#e0a030", "#a06010", "#a06010"],
      contorno: "#101018",
    },
  },
  lugia: {   // 3 heróis de comprido
    modelo: lugia, escala: 4.4, sela: [-0.8, 4.4, 0], largura: 4,
    paleta: {
      branco: ["#ffffff", "#e8ecf8", "#b8c0d8", "#8088a8"],
      barriga: ["#d8e8ff", "#b0c8f0", "#8098c8", "#506898"],
      azul: ["#90b0e8", "#5878c8", "#385098", "#203068"],
      olho: ["#202040", "#202040", "#101020", "#101020"],
      contorno: "#101020",
    },
  },
  // GYARADOS voa sem saber VOAR (`voaSemGolpe`) e também te leva NADANDO (`nada`)
  gyarados: {   // 2,5 heróis de comprido
    modelo: gyarados, escala: 3.6, sela: [-0.5, 3.85, 0], largura: 3, voaSemGolpe: true, nada: true,
    paleta: {
      azul: ["#7ac0f0", "#3a8ce0", "#2a62b0", "#1a3a78"],
      creme: ["#fff8d0", "#f0e0a0", "#c8b070", "#887040"],
      branco: ["#ffffff", "#e8eef8", "#b8c4d8", "#8090a8"],
      boca: ["#f88070", "#e04848", "#a02828", "#601010"],
      olho: ["#ffe060", "#d03020", "#801010", "#801010"],
      contorno: "#101020",
    },
  },
  // LAPRAS só NADA: aparece quando ele te leva no SURFAR
  lapras: {
    modelo: lapras, escala: 3.5, sela: [0.5, 3.45, 0], largura: 3, nada: true, soNada: true,
    paleta: {
      azul: ["#88c8f8", "#4898e0", "#2a68b0", "#1a4078"],
      creme: ["#fff8e0", "#f0e4b8", "#c8b888", "#887850"],
      casco: ["#e0e0e8", "#b0b0c0", "#80808f", "#505060"],
      olho: ["#202030", "#202030", "#101018", "#101018"],
      contorno: "#101020",
    },
  },
  hooh: {
    modelo: hooh, escala: 4.4, sela: [-0.4, 4.35, 0], largura: 4,
    paleta: {
      vermelho: ["#f87858", "#e03828", "#a82020", "#681010"],
      creme: ["#ffffff", "#f8f0e0", "#d8c8a8", "#a09070"],
      ouro: ["#fff090", "#f8c830", "#c89020", "#806010"],
      verde: ["#a8f0a0", "#58c858", "#309030", "#186018"],
      olho: ["#c82020", "#a01010", "#600808", "#600808"],
      contorno: "#180808",
    },
  },
};

/** Quem voa em 3D (as montarias com modelo; o LAPRAS só nada) */
export const temMontaria3D = (id) => !!MONTARIAS_3D[id] && !MONTARIAS_3D[id].soNada;
/** Quem te leva voando mesmo sem saber o golpe VOAR (o GYARADOS) */
export const voaSemGolpe = (id) => !!MONTARIAS_3D[id]?.voaSemGolpe;
/** Quem tem modelo pra te levar NADANDO no SURFAR (o LAPRAS, o GYARADOS) */
export const temNado3D = (id) => !!MONTARIAS_3D[id]?.nada;

/** O ângulo do modelo pra cada direção (a cabeça é o -x do modelo) */
export const GIRO_DA_DIRECAO = { left: 0, right: Math.PI, up: -Math.PI / 2, down: Math.PI / 2 };

/** Desenha a montaria `id` voando, com a SOMBRA no chão em (sx, sy) e ela
 *  `alto` pixels acima, virada `giro`. Devolve onde fica a sela na tela (ou
 *  null se ele não tem modelo). */
export function desenharMontaria(ctx, id, sx, sy, tempo, giro = 0, alto = 0) {
  const R = MONTARIAS_3D[id];
  if (!R) return null;
  const b = buffers();
  limpar(b);
  const { E, proj } = pintarEmPe(b, R, sx, sy - alto, tempo, { giro });
  // a sombra fica no chão, debaixo do corpo (e não debaixo de onde o modelo começa)
  sombraNoChao(b, sx, sy, (R.largura * E * F) / Z_REGI * 0.5);
  b.ctx.putImageData(b.img, 0, 0);
  ctx.drawImage(b.cv, 0, 0);
  return proj(R.sela);
}

/** Desenha a montaria `id` NADANDO: na linha da água em (sx, sy), sem
 *  sombra, virada `giro`. Devolve onde fica a sela na tela. */
export function desenharNadando(ctx, id, sx, sy, tempo, giro = 0) {
  const R = MONTARIAS_3D[id];
  if (!R?.nada) return null;
  const b = buffers();
  limpar(b);
  const { proj } = pintarEmPe(b, R, sx, sy, tempo, { giro });
  b.ctx.putImageData(b.img, 0, 0);
  ctx.drawImage(b.cv, 0, 0);
  return proj(R.sela);
}

// ============================================================ A SERPENTE SOLTA
//
// Na 011GLITCHDIMENSION110 o RAYQUAZA selvagem não fica no céu (lá não tem
// céu): ele anda pelo mapa no tamanho de verdade — uns cinco heróis de
// comprido — pairando um pouco acima do chão, ondulando atrás da cabeça. O
// corpo segue o RASTRO da cabeça (src/scenes/overworld.js guarda os pontos
// por onde ela passou), então ele faz a curva como uma cobra, sem deslizar.

const COMPRIDO_SOLTO = 110;            // pixels de comprido no mapa

/** O corpo do gigante `id` ao longo do `rastro` ([x, y] em pixels do mapa,
 *  da cabeça pra trás), com a câmera em (cx, cy). */
function espinhaDoRastro(g, rastro, cx, cy, t) {
  const z0 = (g.comprimento * F) / COMPRIDO_SOLTO;
  const cam = (mx, my, z) => [((mx - cx - W / 2) * z) / F, (-(my - cy - H / 2) * z) / F, z];
  // anda pelo rastro e devolve o ponto a `d` pixels da cabeça (passou do fim:
  // continua reto na direção do último pedaço)
  const naDistancia = (d) => {
    let falta = d;
    for (let i = 0; i < rastro.length - 1; i++) {
      const a = rastro[i], b = rastro[i + 1], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (l >= falta && l > 0) return [a[0] + ((b[0] - a[0]) * falta) / l, a[1] + ((b[1] - a[1]) * falta) / l];
      falta -= l;
    }
    const a = rastro[rastro.length - 2] || [rastro[0][0] - 1, rastro[0][1]], b = rastro[rastro.length - 1];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    return [b[0] + ((b[0] - a[0]) * falta) / l, b[1] + ((b[1] - a[1]) * falta) / l];
  };
  const P = (s) => {
    const [mx, my] = naDistancia(s * COMPRIDO_SOLTO);
    // a ONDA: ele sobe e desce pelo comprimento (pra cima é pra perto de você)
    // e o meio do corpo balança de lado, com a cabeça mais firme
    const onda = Math.sin(t * 2.4 - s * 9), lado = Math.sin(t * 1.9 - s * 7) * 3 * Math.min(1, s * 4);
    const [qx, qy] = naDistancia(Math.min(1, s + 0.01) * COMPRIDO_SOLTO);
    const dl = Math.hypot(qx - mx, qy - my) || 1;
    return cam(mx - ((qy - my) / dl) * lado, my + ((qx - mx) / dl) * lado - 10 - onda * 3, z0 - 5 - onda * 4);
  };
  const out = [];
  for (let i = 0; i <= g.gomos; i++) {
    const s = i / g.gomos, p = P(s);
    // T aponta pra cabeça: do gomo de trás pro da frente
    const T = norm(sub(P(Math.max(0, s - 0.01)), P(Math.min(1, s + 0.01))));
    const quer = norm([0, 0.55, -0.85]);
    let U = sub(quer, mul(T, dot(quer, T)));
    if (Math.hypot(...U) < 1e-3) U = [0, 1, 0];
    U = norm(U);
    out.push({ s, p, T, U, S: norm(cross(T, U)), r: g.raio(s) });
  }
  return { esp: out, z0 };
}

/** Desenha o gigante `id` (o RAYQUAZA) andando solto pelo mapa ao longo do
 *  `rastro` da cabeça. `rugido` (0 a 1) abre a boca. */
export function desenharSolto(ctx, id, rastro, cx, cy, t, rugido = 0) {
  const g = GIGANTES[id];
  if (!g?.malha || !rastro?.length) return;
  const b = buffers(), pal = paletaDe(g);
  limpar(b);
  corte = null;
  relogio = t;
  luz = LUZ;
  const { esp, z0 } = espinhaDoRastro(g, rastro, cx, cy, t);
  for (const tr of g.malha(esp, g, t, rugido)) {
    const [A, B, C] = tr.p;
    if (A[2] < PERTO || B[2] < PERTO || C[2] < PERTO) continue;
    rasteriza(b, tr, pal, g.comprimento);
  }
  contorno(b, pal);
  // a sombra: no chão, logo abaixo de cada gomo (ele paira uns 10 pixels acima)
  for (const e of esp) {
    const qx = W / 2 + (F * e.p[0]) / e.p[2], qy = H / 2 - (F * e.p[1]) / e.p[2] + 12;
    const r = Math.max(1, (e.r * 1.1 * F) / z0);
    for (let y = Math.max(0, Math.floor(qy - r * 0.6)); y <= Math.min(H - 1, Math.ceil(qy + r * 0.6)); y++) {
      for (let x = Math.max(0, Math.floor(qx - r)); x <= Math.min(W - 1, Math.ceil(qx + r)); x++) {
        if (((x + 0.5 - qx) / r) ** 2 + ((y + 0.5 - qy) / (r * 0.6)) ** 2 <= 1) b.sombra[y * W + x] = 1;
      }
    }
  }
  for (let i = 0; i < W * H; i++) if (b.sombra[i] && !b.z[i]) b.px[i] = SOMBRA;
  b.ctx.putImageData(b.img, 0, 0);
  ctx.drawImage(b.cv, 0, 0);
}
