// QR CODE: gerar e ler, sem biblioteca nenhuma.
//
// Existe aqui por causa do GO PARK: o cartão de transferência leva um QR com o
// Pokémon dentro, e o importador precisa ler esse QR de volta — de um PNG que
// este jogo desenhou ou de uma foto da tela de outra pessoa.
//
// O que está implementado: modo BYTE, versões 1 a 10, correção L e M. Isso dá
// de 17 a 274 bytes de dado, e o cartão do GO PARK gasta uns 70. Modos
// numérico e alfanumérico não existem aqui — não precisamos deles, e o modo
// byte lê qualquer coisa.
//
// O LEITOR é honesto sobre o que faz: ele acha os três olhos pelo padrão
// 1:1:3:1:1, endireita a imagem com uma transformada de perspectiva e lê os
// módulos. Numa imagem limpa (o PNG do cartão, um print) é certeiro. Numa foto
// torta, com sombra ou desfocada, pode falhar — e aí ele devolve null em vez
// de inventar um Pokémon.

// --------------------------------------------------------------- GF(256)
// O corpo de Galois da correção Reed-Solomon, com o polinômio 0x11d que o QR usa.
const EXP = new Uint8Array(512), LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 0x100) x ^= 0x11d; }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
})();
const mul = (a, b) => (a && b ? EXP[LOG[a] + LOG[b]] : 0);
const div = (a, b) => (a ? EXP[LOG[a] + 255 - LOG[b]] : 0);

/** g(x) = (x - a^0)(x - a^1)...(x - a^(n-1)), do maior grau pro menor. */
function rsGen(n) {
  let g = [1];
  for (let i = 0; i < n; i++) {
    const ng = new Array(g.length + 1).fill(0);
    for (let j = 0; j < g.length; j++) { ng[j] ^= g[j]; ng[j + 1] ^= mul(g[j], EXP[i]); }
    g = ng;
  }
  return g;
}

/** Os n bytes de correção de um bloco de dados. */
function rsEncode(data, n) {
  const g = rsGen(n), res = new Uint8Array(data.length + n);
  res.set(data);
  for (let i = 0; i < data.length; i++) {
    const c = res[i];
    if (!c) continue;
    for (let j = 1; j <= n; j++) res[i + j] ^= mul(g[j], c);
  }
  return res.slice(data.length);
}

/** Conserta um bloco recebido (dados + correção) no lugar. Devolve false se o
 *  estrago passou do que a correção aguenta. */
function rsDecode(buf, nec) {
  // síndromes: se todas derem zero, não há erro
  const syn = new Uint8Array(nec);
  let ruim = false;
  for (let i = 0; i < nec; i++) {
    let s = 0;
    for (let j = 0; j < buf.length; j++) s = mul(s, EXP[i]) ^ buf[j];
    syn[i] = s;
    if (s) ruim = true;
  }
  if (!ruim) return true;

  // Berlekamp-Massey: acha o polinômio localizador de erro.
  //
  // O comprimento do registrador (L) é acompanhado À PARTE, e não deduzido do
  // tamanho do array: C pode ganhar zeros no fim, e aí `C.length - 1` não é o
  // grau. Foi esse atalho que quebrou a correção — a condição de troca (2L<=n)
  // saía deslocada e o localizador vinha errado, o que só aparece quando há
  // erro de verdade pra corrigir, nunca numa leitura limpa.
  let C = [1], B = [1], L = 0, m = 1, b = 1;
  for (let n = 0; n < nec; n++) {
    let d = syn[n];
    for (let i = 1; i <= L; i++) d ^= mul(C[i] || 0, syn[n - i]);
    if (!d) { m++; continue; }
    const T = C.slice();
    const escala = div(d, b);
    while (C.length < B.length + m) C.push(0);
    for (let i = 0; i < B.length; i++) C[i + m] ^= mul(escala, B[i]);
    if (2 * L <= n) { L = n + 1 - L; B = T; b = d; m = 1; } else m++;
  }
  const sigma = C.slice(0, L + 1);
  const nerros = L;
  if (nerros <= 0 || nerros * 2 > nec) return false;

  // Chien: as raízes de sigma dizem ONDE estão os erros
  const pos = [];
  for (let i = 0; i < buf.length; i++) {
    let v = 0;
    // avalia sigma em a^-(i) ... a posição i conta do fim pro começo
    const xi = 255 - ((buf.length - 1 - i) % 255);
    for (let j = 0; j < sigma.length; j++) v ^= mul(sigma[j], EXP[(xi * j) % 255]);
    if (!v) pos.push(i);
  }
  if (pos.length !== nerros) return false;

  // Forney: e o valor de cada erro
  const omega = new Array(nec).fill(0);
  for (let i = 0; i < nec; i++) {
    let s = 0;
    for (let j = 0; j <= i && j < sigma.length; j++) s ^= mul(sigma[j], syn[i - j]);
    omega[i] = s;
  }
  for (const p of pos) {
    const xi = (buf.length - 1 - p) % 255;
    const xinv = (255 - xi) % 255;
    let num = 0;
    for (let j = 0; j < nerros; j++) num ^= mul(omega[j], EXP[(xinv * j) % 255]);
    let den = 0;                               // sigma'(x), só os termos ímpares
    for (let j = 1; j < sigma.length; j += 2) den ^= mul(sigma[j], EXP[(xinv * (j - 1)) % 255]);
    if (!den) return false;
    buf[p] ^= mul(EXP[xi], div(num, den));
  }
  // confere: se sobrou síndrome, o conserto foi chute
  for (let i = 0; i < nec; i++) {
    let s = 0;
    for (let j = 0; j < buf.length; j++) s = mul(s, EXP[i]) ^ buf[j];
    if (s) return false;
  }
  return true;
}

// ------------------------------------------------------- tabelas do padrão
// Por versão (1 a 10) e nível: [bytes de correção por bloco, blocos1, dados1, blocos2, dados2]
const BLOCOS = {
  L: [, [7, 1, 19, 0, 0], [10, 1, 34, 0, 0], [15, 1, 55, 0, 0], [20, 1, 80, 0, 0], [26, 1, 108, 0, 0],
    [18, 2, 68, 0, 0], [20, 2, 78, 0, 0], [24, 2, 97, 0, 0], [30, 2, 116, 0, 0], [18, 2, 68, 2, 69]],
  M: [, [10, 1, 16, 0, 0], [16, 1, 28, 0, 0], [26, 1, 44, 0, 0], [18, 2, 32, 0, 0], [24, 2, 43, 0, 0],
    [16, 4, 27, 0, 0], [18, 4, 31, 0, 0], [22, 2, 38, 2, 39], [22, 3, 36, 2, 37], [26, 4, 43, 1, 44]],
};
const ALINHAMENTO = [, [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50]];
const BITS_NIVEL = { L: 1, M: 0, Q: 3, H: 2 };
const NIVEL_DE_BITS = { 1: "L", 0: "M", 3: "Q", 2: "H" };
const VERSAO_MAX = 10;

const tamanho = (v) => v * 4 + 17;
const dadosTotais = (v, nivel) => { const b = BLOCOS[nivel][v]; return b[1] * b[2] + b[3] * b[4]; };

// ------------------------------------------------------------- a matriz
/** A moldura: olhos, separadores, tempo, alinhamento, módulo preto e as áreas
 *  reservadas. `reserva` marca o que o dado não pode ocupar. */
function moldura(v) {
  const n = tamanho(v);
  const m = Array.from({ length: n }, () => new Int8Array(n).fill(-1));
  const reserva = Array.from({ length: n }, () => new Uint8Array(n));
  const por = (x, y, val) => { if (x >= 0 && y >= 0 && x < n && y < n) { m[y][x] = val; reserva[y][x] = 1; } };

  const olho = (ox, oy) => {
    for (let dy = -1; dy <= 7; dy++) for (let dx = -1; dx <= 7; dx++) {
      const borda = dx === 0 || dx === 6 || dy === 0 || dy === 6;
      const miolo = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
      const dentro = dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6;
      por(ox + dx, oy + dy, dentro && (borda || miolo) ? 1 : 0);
    }
  };
  olho(0, 0); olho(n - 7, 0); olho(0, n - 7);

  for (let i = 8; i < n - 8; i++) { por(i, 6, i % 2 === 0 ? 1 : 0); por(6, i, i % 2 === 0 ? 1 : 0); }

  const cen = ALINHAMENTO[v];
  for (const cy of cen) for (const cx of cen) {
    if ((cx <= 8 && cy <= 8) || (cx <= 8 && cy >= n - 9) || (cx >= n - 9 && cy <= 8)) continue;
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++)
      por(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1 ? 1 : 0);
  }

  por(8, n - 8, 1);                                  // o módulo sempre preto
  for (let i = 0; i < 9; i++) { if (m[8][i] === -1) por(i, 8, 0); if (m[i][8] === -1) por(8, i, 0); }
  for (let i = 0; i < 8; i++) { por(n - 1 - i, 8, 0); por(8, n - 1 - i, 0); }
  if (v >= 7) for (let i = 0; i < 18; i++) { por(Math.floor(i / 3), n - 11 + (i % 3), 0); por(n - 11 + (i % 3), Math.floor(i / 3), 0); }
  return { m, reserva, n };
}

/** A ordem em que os módulos de dado são lidos: ziguezague do canto de baixo à
 *  direita pra cima, pulando a coluna 6 (a do tempo). */
function caminho(n, reserva) {
  const passos = [];
  let subindo = true;
  for (let col = n - 1; col > 0; col -= 2) {
    if (col === 6) col--;
    for (let i = 0; i < n; i++) {
      const y = subindo ? n - 1 - i : i;
      for (const x of [col, col - 1]) if (!reserva[y][x]) passos.push([x, y]);
    }
    subindo = !subindo;
  }
  return passos;
}

const MASCARAS = [
  (x, y) => (x + y) % 2 === 0,
  (x, y) => y % 2 === 0,
  (x, y) => x % 3 === 0,
  (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0,
  (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
  (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
];

function bitsFormato(nivel, mascara) {
  let v = (BITS_NIVEL[nivel] << 3) | mascara;
  let d = v << 10;
  for (let i = 4; i >= 0; i--) if (d & (1 << (i + 10))) d ^= 0x537 << i;
  return ((v << 10) | d) ^ 0x5412;
}

function bitsVersao(v) {
  let d = v << 12;
  for (let i = 5; i >= 0; i--) if (d & (1 << (i + 12))) d ^= 0x1f25 << i;
  return (v << 12) | d;
}

function porFormato(m, n, nivel, mascara) {
  const b = bitsFormato(nivel, mascara);
  const bit = (i) => (b >> i) & 1;
  for (let i = 0; i <= 5; i++) { m[8][i] = bit(i); m[n - 1 - i][8] = bit(i); }
  m[8][7] = bit(6); m[8][8] = bit(7); m[7][8] = bit(8);
  m[n - 7][8] = bit(6); m[n - 8][8] = bit(7);
  for (let i = 9; i <= 14; i++) { m[14 - i][8] = bit(i); m[8][n - 15 + i] = bit(i); }
  m[8][n - 8] = 1;
}

function porVersao(m, n, v) {
  if (v < 7) return;
  const b = bitsVersao(v);
  for (let i = 0; i < 18; i++) {
    const bit = (b >> i) & 1;
    m[n - 11 + (i % 3)][Math.floor(i / 3)] = bit;
    m[Math.floor(i / 3)][n - 11 + (i % 3)] = bit;
  }
}

/** As multas do padrão, pra escolher a máscara que deixa o código mais legível. */
function multa(m, n) {
  let p = 0;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    if (x < n - 1 && y < n - 1 && m[y][x] === m[y][x + 1] && m[y][x] === m[y + 1][x] && m[y][x] === m[y + 1][x + 1]) p += 3;
  }
  const corrida = (get) => {
    for (let a = 0; a < n; a++) {
      let n1 = 1;
      for (let b = 1; b < n; b++) {
        if (get(a, b) === get(a, b - 1)) { n1++; if (b === n - 1 && n1 >= 5) p += 3 + (n1 - 5); }
        else { if (n1 >= 5) p += 3 + (n1 - 5); n1 = 1; }
      }
    }
  };
  corrida((a, b) => m[a][b]); corrida((a, b) => m[b][a]);
  const achar = (get) => {
    const alvo = [1, 0, 1, 1, 1, 0, 1];
    for (let a = 0; a < n; a++) for (let b = 0; b + 6 < n; b++) {
      let ok = true;
      for (let k = 0; k < 7; k++) if (get(a, b + k) !== alvo[k]) { ok = false; break; }
      if (!ok) continue;
      const claro = (ini, fim) => { for (let k = ini; k < fim; k++) { const v = k < 0 || k >= n ? 0 : get(a, k); if (v) return false; } return true; };
      if (claro(b - 4, b) || claro(b + 7, b + 11)) p += 40;
    }
  };
  achar((a, b) => m[a][b]); achar((a, b) => m[b][a]);
  let escuros = 0;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) escuros += m[y][x];
  p += Math.floor(Math.abs(escuros * 100 / (n * n) - 50) / 5) * 10;
  return p;
}

// ----------------------------------------------------------------- gerar
const utf8 = (txt) => new TextEncoder().encode(txt);

/** Monta os bytes finais (dados + correção, intercalados como o padrão manda). */
function montarCodewords(bytes, v, nivel) {
  const [nec, b1, d1, b2, d2] = BLOCOS[nivel][v];
  const total = dadosTotais(v, nivel);
  const bits = [];
  const push = (val, n) => { for (let i = n - 1; i >= 0; i--) bits.push((val >> i) & 1); };
  push(4, 4);                                        // modo BYTE
  push(bytes.length, v < 10 ? 8 : 16);
  for (const b of bytes) push(b, 8);
  push(0, Math.min(4, total * 8 - bits.length));     // terminador
  while (bits.length % 8) bits.push(0);
  const dados = [];
  for (let i = 0; i < bits.length; i += 8) dados.push(parseInt(bits.slice(i, i + 8).join(""), 2));
  const enche = [0xec, 0x11];
  for (let i = 0; dados.length < total; i++) dados.push(enche[i % 2]);

  const blocos = [], ecs = [];
  let off = 0;
  for (let i = 0; i < b1 + b2; i++) {
    const tam = i < b1 ? d1 : d2;
    const bloco = Uint8Array.from(dados.slice(off, off + tam));
    off += tam;
    blocos.push(bloco); ecs.push(rsEncode(bloco, nec));
  }
  const saida = [];
  for (let i = 0; i < Math.max(d1, d2); i++) for (const b of blocos) if (i < b.length) saida.push(b[i]);
  for (let i = 0; i < nec; i++) for (const e of ecs) saida.push(e[i]);
  return saida;
}

/** O texto vira uma matriz de 0 e 1. Devolve { modulos, n, versao, nivel }. */
export function gerar(texto, { nivel = "M" } = {}) {
  const bytes = utf8(texto);
  let v = 0;
  for (let i = 1; i <= VERSAO_MAX; i++) {
    const cab = dadosTotais(i, nivel) - (i < 10 ? 2 : 3);   // cabeçalho: modo + contagem
    if (bytes.length <= cab) { v = i; break; }
  }
  if (!v) throw new Error(`QR: ${bytes.length} bytes não cabem até a versão ${VERSAO_MAX} (${nivel})`);

  const codewords = montarCodewords(bytes, v, nivel);
  const { m, reserva, n } = moldura(v);
  const passos = caminho(n, reserva);
  const bits = [];
  for (const c of codewords) for (let i = 7; i >= 0; i--) bits.push((c >> i) & 1);
  passos.forEach(([x, y], i) => { m[y][x] = i < bits.length ? bits[i] : 0; });

  let melhor = null;
  for (let k = 0; k < 8; k++) {
    const teste = m.map((l) => Int8Array.from(l));
    passos.forEach(([x, y], i) => { if (MASCARAS[k](x, y)) teste[y][x] ^= 1; });
    porFormato(teste, n, nivel, k); porVersao(teste, n, v);
    const p = multa(teste, n);
    if (!melhor || p < melhor.p) melhor = { p, m: teste, k };
  }
  return { modulos: melhor.m, n, versao: v, nivel };
}

/** Desenha o QR num canvas. `escala` é o tamanho de cada módulo em pixels. */
export function desenhar(texto, { escala = 4, margem = 4, nivel = "M", fundo = "#fff", tinta = "#000" } = {}) {
  const { modulos, n } = gerar(texto, { nivel });
  const lado = (n + margem * 2) * escala;
  const c = document.createElement("canvas");
  c.width = lado; c.height = lado;
  const x = c.getContext("2d");
  x.fillStyle = fundo; x.fillRect(0, 0, lado, lado);
  x.fillStyle = tinta;
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++)
    if (modulos[j][i]) x.fillRect((i + margem) * escala, (j + margem) * escala, escala, escala);
  return c;
}

// ------------------------------------------------------------------- ler
/** Cinza + limiar de Otsu: devolve Uint8Array de 0 (claro) e 1 (escuro). */
function binarizar(img) {
  const { data, width: w, height: h } = img;
  const cinza = new Uint8Array(w * h), hist = new Uint32Array(256);
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    const g = (data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000 | 0;
    cinza[p] = g; hist[g]++;
  }
  const total = w * h;
  let soma = 0; for (let i = 0; i < 256; i++) soma += i * hist[i];
  let somaB = 0, wB = 0, melhor = 0, limiar = 128;
  for (let i = 0; i < 256; i++) {
    wB += hist[i]; if (!wB) continue;
    const wF = total - wB; if (!wF) break;
    somaB += i * hist[i];
    const mB = somaB / wB, mF = (soma - somaB) / wF, entre = wB * wF * (mB - mF) * (mB - mF);
    if (entre > melhor) { melhor = entre; limiar = i; }
  }
  const bin = new Uint8Array(total);
  for (let i = 0; i < total; i++) bin[i] = cinza[i] <= limiar ? 1 : 0;
  return { bin, w, h };
}

/** Os três olhos: varre as linhas atrás da proporção 1:1:3:1:1 e junta os
 *  acertos que caem no mesmo lugar. */
function acharOlhos({ bin, w, h }) {
  const cand = [];
  const testar = (corridas, fim, y) => {
    const t = corridas.reduce((a, b) => a + b, 0);
    if (t < 7) return;
    const mod = t / 7, tol = mod * 0.6;
    const ok = Math.abs(mod - corridas[0]) < tol && Math.abs(mod - corridas[1]) < tol
      && Math.abs(3 * mod - corridas[2]) < tol * 3 && Math.abs(mod - corridas[3]) < tol
      && Math.abs(mod - corridas[4]) < tol;
    if (!ok) return;
    const cx = fim - corridas[4] - corridas[3] - corridas[2] / 2;
    cand.push({ x: cx, y: y + 0.5, mod });
  };
  for (let y = 0; y < h; y++) {
    const corridas = [0, 0, 0, 0, 0];
    let estado = 0;
    for (let x = 0; x < w; x++) {
      const v = bin[y * w + x];
      if (v === (estado % 2 === 0 ? 1 : 0)) corridas[estado]++;
      else {
        if (estado === 4) { testar(corridas, x, y); corridas.copyWithin(0, 2); corridas[2] = corridas[4]; corridas[3] = 1; corridas[4] = 0; estado = 3; }
        else { estado++; corridas[estado] = 1; }
      }
    }
    if (estado === 4) testar(corridas, w, y);
  }
  // junta os candidatos próximos
  const grupos = [];
  for (const c of cand) {
    const g = grupos.find((g) => Math.abs(g.x - c.x) < g.mod * 2 && Math.abs(g.y - c.y) < g.mod * 2);
    if (g) { g.x = (g.x * g.n + c.x) / (g.n + 1); g.y = (g.y * g.n + c.y) / (g.n + 1); g.mod = (g.mod * g.n + c.mod) / (g.n + 1); g.n++; }
    else grupos.push({ ...c, n: 1 });
  }
  const bons = grupos.filter((g) => g.n >= 2).sort((a, b) => b.n - a.n).slice(0, 12);
  if (bons.length < 3) return null;
  // escolhe o trio mais parecido com um canto reto (dois lados iguais e perpendiculares)
  let melhor = null;
  for (let i = 0; i < bons.length; i++) for (let j = i + 1; j < bons.length; j++) for (let k = j + 1; k < bons.length; k++) {
    const t = [bons[i], bons[j], bons[k]];
    const d = [dist(t[0], t[1]), dist(t[1], t[2]), dist(t[0], t[2])];
    const maior = Math.max(...d), i2 = d.indexOf(maior);
    const l = d.filter((_, n) => n !== i2);
    const erro = Math.abs(l[0] - l[1]) / maior + Math.abs(maior - Math.hypot(l[0], l[1])) / maior;
    if (maior < 14) continue;
    if (!melhor || erro < melhor.erro) melhor = { erro, t, i2 };
  }
  if (!melhor || melhor.erro > 0.35) return null;
  // o canto é o que não participa da maior distância (a diagonal)
  const { t, i2 } = melhor;
  const diag = [[0, 1], [1, 2], [0, 2]][i2];
  const canto = t[[2, 0, 1][i2]];
  let [a, b] = diag.map((n) => t[n]);
  // orienta: A é o de cima à direita, B o de baixo à esquerda (produto vetorial)
  const cruz = (a.x - canto.x) * (b.y - canto.y) - (a.y - canto.y) * (b.x - canto.x);
  if (cruz < 0) [a, b] = [b, a];
  return { canto, dir: a, baixo: b, mod: (canto.mod + a.mod + b.mod) / 3 };
}
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

/** Perspectiva de 4 pontos: leva (0,0),(1,0),(1,1),(0,1) nos quatro cantos. */
function perspectiva(p0, p1, p2, p3) {
  const dx1 = p1.x - p2.x, dx2 = p3.x - p2.x, dy1 = p1.y - p2.y, dy2 = p3.y - p2.y;
  const sx = p0.x - p1.x + p2.x - p3.x, sy = p0.y - p1.y + p2.y - p3.y;
  const den = dx1 * dy2 - dx2 * dy1;
  if (!den) return null;
  const g = (sx * dy2 - dx2 * sy) / den, hh = (dx1 * sy - sx * dy1) / den;
  return {
    a: p1.x - p0.x + g * p1.x, b: p3.x - p0.x + hh * p3.x, c: p0.x,
    d: p1.y - p0.y + g * p1.y, e: p3.y - p0.y + hh * p3.y, f: p0.y, g, h: hh,
    em(u, v) { const w = this.g * u + this.h * v + 1; return { x: (this.a * u + this.b * v + this.c) / w, y: (this.d * u + this.e * v + this.f) / w }; },
  };
}

/** Lê os 15 bits do formato e devolve { nivel, mascara } ou null. */
function lerFormato(get, n) {
  const tentativa = (bits) => {
    let melhor = null;
    for (let nivel = 0; nivel < 4; nivel++) for (let k = 0; k < 8; k++) {
      const ref = bitsFormato(NIVEL_DE_BITS[nivel], k);
      let d = 0;
      for (let i = 0; i < 15; i++) if (((ref >> i) & 1) !== ((bits >> i) & 1)) d++;
      if (!melhor || d < melhor.d) melhor = { d, nivel: NIVEL_DE_BITS[nivel], mascara: k };
    }
    return melhor && melhor.d <= 3 ? melhor : null;
  };
  let b1 = 0;
  for (let i = 0; i <= 5; i++) b1 |= get(i, 8) << i;
  b1 |= get(7, 8) << 6; b1 |= get(8, 8) << 7; b1 |= get(8, 7) << 8;
  for (let i = 9; i <= 14; i++) b1 |= get(8, 14 - i) << i;
  const r1 = tentativa(b1);
  if (r1 && r1.d === 0) return r1;
  let b2 = 0;
  for (let i = 0; i <= 6; i++) b2 |= get(8, n - 1 - i) << i;
  for (let i = 7; i <= 14; i++) b2 |= get(n - 15 + i, 8) << i;
  const r2 = tentativa(b2);
  if (!r1) return r2;
  if (!r2) return r1;
  return r1.d <= r2.d ? r1 : r2;
}

/** Desfaz a intercalação e conserta os blocos. Devolve os bytes de dado. */
function desmontar(codewords, v, nivel) {
  const [nec, b1, d1, b2, d2] = BLOCOS[nivel][v];
  const nblocos = b1 + b2, tams = [];
  for (let i = 0; i < nblocos; i++) tams.push(i < b1 ? d1 : d2);
  const blocos = tams.map((t) => new Uint8Array(t + nec));
  let p = 0;
  for (let i = 0; i < Math.max(d1, d2); i++) for (let b = 0; b < nblocos; b++) if (i < tams[b]) blocos[b][i] = codewords[p++];
  for (let i = 0; i < nec; i++) for (let b = 0; b < nblocos; b++) blocos[b][tams[b] + i] = codewords[p++];
  const saida = [];
  for (let b = 0; b < nblocos; b++) {
    if (!rsDecode(blocos[b], nec)) return null;
    for (let i = 0; i < tams[b]; i++) saida.push(blocos[b][i]);
  }
  return saida;
}

/** Os bytes de dado viram texto (só o modo BYTE interessa aqui). */
function lerSegmentos(bytes, v) {
  let bit = 0;
  const pega = (n) => { let r = 0; for (let i = 0; i < n; i++) { const b = (bytes[bit >> 3] >> (7 - (bit & 7))) & 1; r = (r << 1) | b; bit++; } return r; };
  const total = bytes.length * 8;
  let texto = "";
  while (bit + 4 <= total) {
    const modo = pega(4);
    if (modo === 0) break;                          // fim
    if (modo !== 4) return null;                    // só byte
    const n = pega(v < 10 ? 8 : 16);
    if (bit + n * 8 > total) return null;
    const buf = new Uint8Array(n);
    for (let i = 0; i < n; i++) buf[i] = pega(8);
    texto += new TextDecoder().decode(buf);
  }
  return texto || null;
}

/** LER: recebe um ImageData e devolve o texto, ou null se não deu. */
export function ler(img) {
  const b = binarizar(img);
  const olhos = acharOlhos(b);
  if (!olhos) return null;
  const { canto, dir, baixo, mod } = olhos;

  // o tamanho em módulos vem da distância entre os olhos: 7 de olho + o miolo
  const d = (dist(canto, dir) + dist(canto, baixo)) / 2;
  let n = Math.round(d / mod) + 7;
  n = n + ((4 - ((n - 17) % 4)) % 4);                // arredonda pro 4k+17 mais perto
  if (n < 21) n = 21;
  const v = (n - 17) / 4;
  if (v < 1 || v > VERSAO_MAX) return null;

  // Os três olhos marcam o centro do quadrado 7x7: os módulos (3.5, 3.5),
  // (n-3.5, 3.5) e (3.5, n-3.5). O quarto canto não tem olho; o padrão de
  // alinhamento de baixo à direita fica perto dele, mas o paralelogramo já
  // basta pra imagem chapada, que é o caso do cartão e de um print.
  const quarto = { x: dir.x + baixo.x - canto.x, y: dir.y + baixo.y - canto.y };
  const P = perspectiva(canto, dir, quarto, baixo);
  if (!P) return null;
  const esc = n - 7;                                 // (3.5, 3.5) até (n-3.5, n-3.5)

  // O raio da amostra acompanha o tamanho do módulo: num QR grande vale a pena
  // tirar a média de uma vizinhança (aguenta ruído e desfoque), mas num QR
  // miúdo — 1 ou 2 pixels por módulo — a média invadiria o módulo vizinho e
  // destruiria a leitura. Aí é um pixel só, no centro.
  const modPx = d / (n - 7);
  const raio = Math.max(0, Math.min(2, Math.floor((modPx - 1) / 3)));
  const get = (x, y) => {
    const p = P.em((x + 0.5 - 3.5) / esc, (y + 0.5 - 3.5) / esc);
    // floor, não round: p é o centro contínuo do módulo, e o pixel que o contém
    // é o de baixo. Com round, um centro em x.5 (módulo de 1 pixel) cai no vizinho.
    const px = Math.floor(p.x), py = Math.floor(p.y);
    if (px < 0 || py < 0 || px >= b.w || py >= b.h) return 0;
    if (!raio) return b.bin[py * b.w + px];
    let soma = 0, cont = 0;
    for (let dy = -raio; dy <= raio; dy++) for (let dx = -raio; dx <= raio; dx++) {
      const qx = px + dx, qy = py + dy;
      if (qx < 0 || qy < 0 || qx >= b.w || qy >= b.h) continue;
      soma += b.bin[qy * b.w + qx]; cont++;
    }
    return soma * 2 > cont ? 1 : 0;
  };

  const fmt = lerFormato(get, n);
  if (!fmt) return null;
  if (!BLOCOS[fmt.nivel]) return null;               // só sabemos L e M

  const { reserva } = moldura(v);
  const passos = caminho(n, reserva);
  const bits = passos.map(([x, y]) => get(x, y) ^ (MASCARAS[fmt.mascara](x, y) ? 1 : 0));
  const codewords = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    let c = 0; for (let k = 0; k < 8; k++) c = (c << 1) | bits[i + k];
    codewords.push(c);
  }
  const b1 = BLOCOS[fmt.nivel][v];
  const precisa = b1[1] * (b1[2] + b1[0]) + b1[3] * (b1[4] + b1[0]);
  if (codewords.length < precisa) return null;
  const dados = desmontar(codewords.slice(0, precisa), v, fmt.nivel);
  if (!dados) return null;
  return lerSegmentos(dados, v);
}

/** Atalho: lê um QR de um canvas, de uma <img> ou de um ImageData. */
export function lerDe(fonte) {
  if (fonte instanceof ImageData) return ler(fonte);
  const w = fonte.naturalWidth || fonte.width, h = fonte.naturalHeight || fonte.height;
  if (!w || !h) return null;
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const x = c.getContext("2d", { willReadFrequently: true });
  x.drawImage(fonte, 0, 0);
  return ler(x.getImageData(0, 0, w, h));
}
