// A MONTAGEM AUTOMÁTICA DA FUSÃO — a mesma no jogo (src/core/assets.js) e na
// oficina de fora (fusionglitch/), por isso não importa nada: só canvas.
//
// Ela trabalha com pedaços, e não com faixas da tela:
//
//  1. O PESCOÇO de cada um é a linha mais fina entre 30% e 62% da altura do
//     desenho (perto de 45% desempata). Daí pra cima é "o andar da cabeça".
//  2. A CABEÇA é o pedaço maior desse andar (pixels encostados uns nos
//     outros). Rabo, asa e chifre que sobem pelo lado são outro pedaço — e
//     ficam onde estão. Isso vale pros dois: a cabeça nova sai inteira da
//     CABEÇA, e só a cabeça velha sai do CORPO.
//  3. AS CORES: cada desenho é separado em FAMÍLIAS de cor (mesmo matiz; os
//     cinzas e brancos são família à parte). A família que mais aparece no
//     corpo vira a que mais aparece na cabeça, a segunda vira a segunda — e
//     dentro da família cada pixel guarda a luz que tinha, então sombra
//     continua sombra e brilho continua brilho. Barriga branca fica branca
//     (só puxa um tico pra cor nova). O contorno escuro não muda.
//  4. A cabeça nova senta no meio do pescoço do corpo, do tamanho da cabeça
//     que saiu (em passos de 1/4: pixel esticado por número quebrado fica
//     torto), e a costura ganha sombra embaixo do queixo e contorno onde o
//     queixo ficou no ar.
//  5. No fim, os pés ficam onde os pés do corpo estavam. Não cabe? Encolhe.

const OPACO = 40;
const GIRAR_COR = false;          // o jeito simples de pintar o corpo (ver `repintar`)
const CONTORNO = 46;              // mais escuro que isto é linha, não cor

const brilho = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;

function tela(w, h) {
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  ctx.imageSmoothingEnabled = false;
  return { cv, ctx };
}

function pixels(img, N) {
  const { ctx } = tela(N, N);
  ctx.drawImage(img, 0, 0, N, N);
  return ctx.getImageData(0, 0, N, N);
}

function emTela(im) {
  const { cv, ctx } = tela(im.width, im.height);
  ctx.putImageData(im, 0, 0);
  return cv;
}

const cheio = (im, x, y) => x >= 0 && y >= 0 && x < im.width && y < im.height
  && im.data[(y * im.width + x) * 4 + 3] > OPACO;

/** A caixa do que está desenhado entre as linhas y0 e y1 (ou só dos pixels
 *  de `so`, um conjunto de índices). */
function caixa(im, y0 = 0, y1 = im.height - 1, so = null) {
  const w = im.width;
  let minx = w, maxx = -1, miny = im.height, maxy = -1;
  const olha = (x, y) => {
    if (x < minx) minx = x; if (x > maxx) maxx = x;
    if (y < miny) miny = y; if (y > maxy) maxy = y;
  };
  if (so) for (const p of so) olha(p % w, (p / w) | 0);
  else for (let y = Math.max(0, y0); y <= Math.min(im.height - 1, y1); y++)
    for (let x = 0; x < w; x++) if (cheio(im, x, y)) olha(x, y);
  return maxx < 0 ? null : { minx, maxx, miny, maxy, w: maxx - minx + 1, h: maxy - miny + 1 };
}

function pescoco(im, cx) {
  let melhor = null, nota = Infinity;
  for (let y = Math.round(cx.miny + cx.h * 0.3); y <= Math.round(cx.miny + cx.h * 0.62); y++) {
    let n = 0;
    for (let x = cx.minx; x <= cx.maxx; x++) if (cheio(im, x, y)) n++;
    if (!n) continue;
    const t = Math.abs((y - cx.miny) / cx.h - 0.45);
    if (n * (1 + t * 1.5) < nota) { nota = n * (1 + t * 1.5); melhor = y; }
  }
  return melhor ?? Math.round(cx.miny + cx.h * 0.46);
}

/** O meio dos pixels da linha y (onde o pescoço está de verdade). */
function meioDaLinha(im, y, cx) {
  let soma = 0, n = 0;
  for (let yy = y - 1; yy <= y; yy++)
    for (let x = cx.minx; x <= cx.maxx; x++) if (cheio(im, x, yy)) { soma += x; n++; }
  return n ? soma / n : (cx.minx + cx.maxx) / 2;
}

/** O pedaço da cabeça: dos pedaços que existem do pescoço pra cima, o maior
 *  (empate: o mais perto do meio do pescoço). Devolve o conjunto de índices. */
function pedacoDaCabeca(im, ate, meio) {
  const w = im.width, visto = new Uint8Array(w * im.height);
  let melhor = null, nota = -Infinity;
  for (let y = 0; y <= ate; y++) {
    for (let x = 0; x < w; x++) {
      const p0 = y * w + x;
      if (visto[p0] || !cheio(im, x, y)) continue;
      const pedaco = [], fila = [p0];
      visto[p0] = 1;
      let somaX = 0, toca = false;
      while (fila.length) {
        const p = fila.pop(), px = p % w, py = (p / w) | 0;
        pedaco.push(p); somaX += px;
        if (py === ate) toca = true;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = px + dx, ny = py + dy;
          if (ny > ate || !cheio(im, nx, ny)) continue;
          const q = ny * w + nx;
          if (!visto[q]) { visto[q] = 1; fila.push(q); }
        }
      }
      // o que encosta no pescoço é candidato forte: a cabeça está presa nele
      const n = pedaco.length * (toca ? 2 : 1) - Math.abs(somaX / pedaco.length - meio) * 2;
      if (n > nota) { nota = n; melhor = pedaco; }
    }
  }
  return melhor || [];
}

// ------------------------------------------------------------- as cores
function hsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  if (mx === mn) return [0, 0, l];
  const d = mx - mn, s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  const h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h / 6, s, l];
}
function rgb(h, s, l) {
  if (!s) return [l * 255, l * 255, l * 255];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  const f = (t) => {
    t = (t + 1) % 1;
    return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p;
  };
  return [f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255];
}

const NEUTRO = -1;
const familia = (h, s, l) => (s < 0.18 || l > 0.92 ? NEUTRO : Math.floor(h * 12) % 12);

/** As famílias de cor de um desenho (só os pixels de `so`, se vier), da que
 *  mais aparece pra que menos aparece: { f, n, h, s, l } com a média de cada. */
function familias(im, so = null) {
  const d = im.data, conta = new Map();
  const ver = (i) => {
    if (d[i + 3] <= OPACO || brilho(d[i], d[i + 1], d[i + 2]) < CONTORNO) return;
    const [h, s, l] = hsl(d[i], d[i + 1], d[i + 2]);
    const f = familia(h, s, l);
    const e = conta.get(f) || { f, n: 0, hx: 0, hy: 0, s: 0, l: 0 };
    // o matiz é um círculo: a média é feita com seno e cosseno
    e.n++; e.hx += Math.cos(h * 2 * Math.PI); e.hy += Math.sin(h * 2 * Math.PI); e.s += s; e.l += l;
    conta.set(f, e);
  };
  if (so) for (const p of so) ver(p * 4);
  else for (let i = 0; i < d.length; i += 4) ver(i);
  // famílias vizinhas no círculo (laranja e vermelho do mesmo bicho) se juntam
  const lista = [...conta.values()].sort((a, b) => b.n - a.n);
  const juntas = [];
  for (const e of lista) {
    const dona = e.f !== NEUTRO && juntas.find((j) => j.f !== NEUTRO && Math.min(Math.abs(j.f - e.f), 12 - Math.abs(j.f - e.f)) <= 1);
    if (dona) { dona.n += e.n; dona.hx += e.hx; dona.hy += e.hy; dona.s += e.s; dona.l += e.l; dona.pixels += e.n; }
    else juntas.push({ ...e, pixels: e.n });
  }
  return juntas.map((e) => ({
    f: e.f, n: e.n,
    h: ((Math.atan2(e.hy, e.hx) / (2 * Math.PI)) + 1) % 1,
    s: e.s / e.pixels, l: e.l / e.pixels,
  })).sort((a, b) => b.n - a.n);
}

function repintar(im, deFam, paraFam) {
  const total = paraFam.reduce((a, f) => a + f.n, 0) || 1;
  // da cabeça só contam as famílias que são PARTE do bicho (6% ou mais): olho
  // e bochecha não viram a cor de uma perna inteira
  const coloridas = paraFam.filter((f) => f.f !== NEUTRO && f.n / total >= 0.06).slice(0, 3);
  const principal = coloridas[0] || paraFam[0];
  if (!principal) return;
  const destino = new Map();
  const totalDe = deFam.reduce((a, f) => a + f.n, 0) || 1;
  let k = 0;
  for (const f of deFam) {
    // branco e cinza ficam quase iguais (barriga branca é barriga branca)...
    // a não ser que o bicho SEJA cinza (ONIX, MACHOKE...): aí é a cor dele
    if (f.f === NEUTRO && f.n / totalDe < 0.4) destino.set(f.f, null);
    else destino.set(f.f, coloridas[Math.min(k++, coloridas.length - 1)] || principal);
  }
  const d = im.data;
  // O CORPO QUASE TODO CINZA (o BASTIODON, o ONIX): os mil tons de cinza viravam
  // cores diferentes e o corpo ficava pontilhado. Aí ele vira UMA cor só — a
  // principal da cabeça —, com a luz e a sombra de cada pixel
  const neutro = deFam.find((f) => f.f === NEUTRO);
  const mono = neutro && neutro.n / totalDe >= 0.45 && principal.f !== NEUTRO;
  if (mono) {
    let soma = 0, n = 0;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] <= OPACO || brilho(d[i], d[i + 1], d[i + 2]) < CONTORNO) continue;
      soma += hsl(d[i], d[i + 1], d[i + 2])[2]; n++;
    }
    const media = soma / (n || 1);
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] <= OPACO || brilho(d[i], d[i + 1], d[i + 2]) < CONTORNO) continue;
      const l = hsl(d[i], d[i + 1], d[i + 2])[2];
      const cor = rgb(principal.h, Math.min(1, principal.s * 0.85), Math.max(0.06, Math.min(0.95, principal.l + (l - media))));
      d[i] = cor[0]; d[i + 1] = cor[1]; d[i + 2] = cor[2];
    }
    return;
  }
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] <= OPACO || brilho(d[i], d[i + 1], d[i + 2]) < CONTORNO) continue;
    const [h, s, l] = hsl(d[i], d[i + 1], d[i + 2]);
    const f = familia(h, s, l);
    const minha = deFam.find((x) => x.f === f
      || (x.f !== NEUTRO && f !== NEUTRO && Math.min(Math.abs(x.f - f), 12 - Math.abs(x.f - f)) <= 1));
    const alvo = minha ? destino.get(minha.f) : principal;
    let cor;
    if (GIRAR_COR && minha && alvo) {
      // O JEITO SIMPLES (o CAIO: "procure um jeito mais simples"): GIRAR A COR.
      // O pixel guarda a luz e a sombra que tinha; só o matiz anda da cor da
      // família dele pra cor da família da cabeça, e a força da cor puxa um pouco
      const nh = (alvo.h + (h - minha.h) + 1) % 1;
      cor = rgb(nh, Math.min(1, s * 0.5 + alvo.s * 0.5), l);
    } else if (alvo === null || !minha) {
      // neutro: puxa 20% pro matiz principal da cabeça, pra não parecer colado
      cor = rgb(principal.h, Math.min(1, s + principal.s * 0.2), l);
    } else {
      // a luz relativa do pixel dentro da família dele vai junto
      const luz = Math.max(0.04, Math.min(0.97, alvo.l + (l - minha.l) * 1.1));
      cor = rgb(alvo.h, Math.min(1, alvo.s * 0.9 + s * 0.1), luz);
    }
    d[i] = cor[0]; d[i + 1] = cor[1]; d[i + 2] = cor[2];
  }
}

// --------------------------------------------- O JEITO DO POKÉMON FUSION
// Como o Alex Onsager fez (e o gerador do Japeal, que dá as fusões
// automáticas do Infinite Fusion): cada bicho tem 3 CORES (a principal, a
// segunda e a terceira), cada uma com 5 TONS, do escuro pro claro. Na fusão,
// cada tom do corpo vira O MESMO TOM da cabeça: 1º tom da cor 1 do corpo ->
// 1º tom da cor 1 da cabeça, e assim vai. O resto (contorno, olho, brilho
// pequeno) fica como está. Lá as cores são escolhidas à mão; aqui são as 3
// famílias de cor que mais aparecem, e os 5 tons são os 5 pedaços de luz delas.
// (o CAIO, 07/nov/2026: "copie 100 pct o jeito")
// "puro" = o jeito dele inteiro (troca só a cor IGUAL e cola a cara inteira);
// "onsager" = só a pintura por tons; "velha" = o `repintar` de antes
let PINTURA = "puro";
export function jeitoDePintar(j) { PINTURA = j; }
const TONS = 5;

function paletaOnsager(im) {
  const d = im.data, fams = familias(im).slice(0, 3);
  const grupos = fams.map((f) => ({ f: f.f, px: [] }));
  const dono = (f) => grupos.findIndex((g) => g.f === f
    || (g.f !== NEUTRO && f !== NEUTRO && Math.min(Math.abs(g.f - f), 12 - Math.abs(g.f - f)) <= 1));
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] <= OPACO || brilho(d[i], d[i + 1], d[i + 2]) < CONTORNO) continue;
    const [h, s, l] = hsl(d[i], d[i + 1], d[i + 2]);
    const g = dono(familia(h, s, l));
    if (g >= 0) grupos[g].px.push([l, d[i], d[i + 1], d[i + 2]]);
  }
  return grupos.filter((g) => g.px.length).map((g) => {
    g.px.sort((a, b) => a[0] - b[0]);
    const n = g.px.length, cortes = [], tons = [];
    for (let t = 0; t < TONS; t++) {
      const fatia = g.px.slice(Math.floor(t * n / TONS), Math.max(Math.floor(t * n / TONS) + 1, Math.floor((t + 1) * n / TONS)));
      // o tom é a cor de verdade que mais aparece naquele pedaço de luz
      const conta = new Map();
      let melhor = fatia[0], mx = 0;
      for (const p of fatia) { const k = (p[1] << 16) | (p[2] << 8) | p[3]; const c = (conta.get(k) || 0) + 1; conta.set(k, c); if (c > mx) { mx = c; melhor = p; } }
      tons.push([melhor[1], melhor[2], melhor[3]]);
      cortes.push(fatia[fatia.length - 1][0]);
    }
    return { f: g.f, tons, cortes, dono };
  });
}

function repintarOnsager(im, cab) {
  const de = paletaOnsager(im), para = paletaOnsager(cab);
  if (!de.length || !para.length) return;
  const d = im.data;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] <= OPACO || brilho(d[i], d[i + 1], d[i + 2]) < CONTORNO) continue;
    const [h, s, l] = hsl(d[i], d[i + 1], d[i + 2]);
    const f = familia(h, s, l);
    const g = de.findIndex((x) => x.f === f
      || (x.f !== NEUTRO && f !== NEUTRO && Math.min(Math.abs(x.f - f), 12 - Math.abs(x.f - f)) <= 1));
    if (g < 0) continue;                       // não é uma das 3 cores: fica
    const alvo = para[Math.min(g, para.length - 1)];
    let t = de[g].cortes.findIndex((c) => l <= c);
    if (t < 0) t = TONS - 1;
    const cor = alvo.tons[t];
    d[i] = cor[0]; d[i + 1] = cor[1]; d[i + 2] = cor[2];
  }
}

/** A PALETA DO ONSAGER de verdade: das 3 cores, os 5 tons são as 5 cores
 *  EXATAS que mais aparecem, do escuro pro claro. */
export function paletaExata(im) {
  const d = im.data, fams = familias(im).slice(0, 3);
  const grupos = fams.map((f) => ({ f: f.f, conta: new Map() }));
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] <= OPACO || brilho(d[i], d[i + 1], d[i + 2]) < CONTORNO) continue;
    const [h, s, l] = hsl(d[i], d[i + 1], d[i + 2]);
    const f = familia(h, s, l);
    const g = grupos.findIndex((x) => x.f === f
      || (x.f !== NEUTRO && f !== NEUTRO && Math.min(Math.abs(x.f - f), 12 - Math.abs(x.f - f)) <= 1));
    if (g < 0) continue;
    const k = (d[i] << 16) | (d[i + 1] << 8) | d[i + 2];
    grupos[g].conta.set(k, (grupos[g].conta.get(k) || 0) + 1);
  }
  return grupos.filter((g) => g.conta.size).map((g) => Object.assign([...g.conta.entries()]
    .sort((a, b) => b[1] - a[1]).slice(0, TONS).map(([k]) => k)
    .sort((a, b) => brilho(a >> 16, (a >> 8) & 255, a & 255) - brilho(b >> 16, (b >> 8) & 255, b & 255)), { f: g.f }));
}

/** A troca dele: pixel com a cor EXATA do tom t da cor g do corpo vira o tom t
 *  da cor g da cabeça (se a cabeça tem menos tons, o tom do mesmo lugar). O
 *  resto não muda. */
// as cores MARCADAS À MÃO (dev/marcarcores.html): ["rrggbb", ...] x 3 -> o
// mesmo formato da paletaExata (números, do escuro pro claro)
function daMarca(m) {
  if (!Array.isArray(m) || !m.some((g) => g?.length)) return null;
  const br = (k) => brilho(k >> 16, (k >> 8) & 255, k & 255);
  return m.filter((g) => g?.length).map((g) => g.map((h) => parseInt(h, 16)).sort((a, b) => br(a) - br(b)));
}

function repintarExato(im, cab, marcaDe = null, marcaPara = null) {
  const mDe = daMarca(marcaDe), mPara = daMarca(marcaPara);
  const de = mDe || paletaExata(im), para = mPara || paletaExata(cab);
  if (!de.length || !para.length) return;
  const troca = new Map();
  de.forEach((tons, g) => {
    const alvo = para[Math.min(g, para.length - 1)];
    tons.forEach((k, t) => {
      const u = tons.length > 1 ? Math.round(t * (alvo.length - 1) / (tons.length - 1)) : alvo.length - 1;
      troca.set(k, alvo[u]);
    });
  });
  // os sprites dele tinham SÓ esses 5 tons por cor; os nossos têm mais. Então
  // primeiro o nosso fica no formato dele: o tom que sobra vai pro tom mais
  // parecido (de luz) da mesma cor — e aí troca
  const br = (k) => brilho(k >> 16, (k >> 8) & 255, k & 255);
  const d = im.data;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] <= OPACO) continue;
    const k = (d[i] << 16) | (d[i + 1] << 8) | d[i + 2];
    let v = troca.get(k);
    if (v === undefined && mDe && brilho(d[i], d[i + 1], d[i + 2]) >= CONTORNO) {
      // marcado à mão: o tom que ele não clicou vai pro tom marcado mais perto
      // (se for perto mesmo; longe é outra coisa — olho, brilho — e fica)
      let perto = -1, menor = 48 * 48;
      for (const t of troca.keys()) {
        const e = ((t >> 16) - d[i]) ** 2 + (((t >> 8) & 255) - d[i + 1]) ** 2 + ((t & 255) - d[i + 2]) ** 2;
        if (e < menor) { menor = e; perto = t; }
      }
      if (perto >= 0) v = troca.get(perto);
    } else if (v === undefined && brilho(d[i], d[i + 1], d[i + 2]) >= CONTORNO) {
      const [h, s, l] = hsl(d[i], d[i + 1], d[i + 2]);
      const f = familia(h, s, l);
      const tons = de.find((x) => x.f === f
        || (x.f !== NEUTRO && f !== NEUTRO && Math.min(Math.abs(x.f - f), 12 - Math.abs(x.f - f)) <= 1));
      if (tons) {
        const b = br(k);
        let perto = tons[0];
        for (const t of tons) if (Math.abs(br(t) - b) < Math.abs(br(perto) - b)) perto = t;
        v = troca.get(perto);
      }
    }
    if (v === undefined) continue;
    d[i] = v >> 16; d[i + 1] = (v >> 8) & 255; d[i + 2] = v & 255;
  }
}

function corDoContorno(im) {
  const d = im.data;
  let melhor = [24, 16, 24], menor = Infinity;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] <= OPACO) continue;
    const l = brilho(d[i], d[i + 1], d[i + 2]);
    if (l < menor) { menor = l; melhor = [d[i], d[i + 1], d[i + 2]]; }
  }
  return melhor;
}

/** A FUSÃO: `cabeca` e `corpo` são imagens (img ou canvas, de qualquer
 *  tamanho); sai um canvas `lado` x `lado`. Faltou uma das duas, sai a outra. */
/** A cabeça MARCADA À MÃO (src/data/cabecas-marcadas.js): `m` é o retângulo
 *  dela no sprite de 96x96; devolve { pedaco, pescoco, meio } na grade de N. */
function cabecaMarcada(im, m, N) {
  const f = N / 96, w = im.width;
  const x0 = Math.round(m.x0 * f), x1 = Math.round(m.x1 * f), y0 = Math.round(m.y0 * f), y1 = Math.round(m.y1 * f);
  const pedaco = [];
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (cheio(im, x, y)) pedaco.push(y * w + x);
  return pedaco.length ? { pedaco, pescoco: y1, meio: (x0 + x1) / 2 } : null;
}

/** `marcaC` (opcional): a cabeça marcada à mão de quem dá a CABEÇA */
export function montarFusao(cabeca, corpo, lado = 64, marcaC = null, opts = {}) {
  const N = Math.max(cabeca?.width || 0, corpo?.width || 0, 16);
  const fim = tela(lado, lado);
  if (!cabeca || !corpo) {
    if (cabeca || corpo) fim.ctx.drawImage(cabeca || corpo, 0, 0, lado, lado);
    return fim.cv;
  }
  const C = pixels(cabeca, N), B = pixels(corpo, N);
  const cc = caixa(C), cb = caixa(B);
  if (!cc || !cb) { fim.ctx.drawImage(cb ? corpo : cabeca, 0, 0, lado, lado); return fim.cv; }

  // 1 e 2: o pescoço e o pedaço da cabeça de cada um
  const mC = marcaC && cabecaMarcada(C, marcaC, N);
  const pc = mC ? mC.pescoco : pescoco(C, cc), pb = pescoco(B, cb);
  const cabC = mC ? mC.pedaco : pedacoDaCabeca(C, pc, meioDaLinha(C, pc, cc));
  const cabB = pedacoDaCabeca(B, pb, meioDaLinha(B, pb, cb));
  // O PESCOÇO DE VERDADE (pedido do CAIO: "laprazard ficar com pescoço de lapras",
  // "sem cortar muito da pixelart"): quem tem pescoço comprido (`opts.pescoco`,
  // os PESCOÇUDOS de src/core/assets.js) leva junto a FAIXA DO PESCOÇO dele —
  // os pixels de baixo da cabeça que ficam na largura do pescoço. O tamanho é
  // contado só pela cabeça; o pescoço vem a mais, e é ele que levanta a cabeça.
  const xC0 = caixa(C, 0, 0, cabC);
  if (opts.pescoco > 0 && xC0) {
    const meio = mC ? mC.meio : meioDaLinha(C, pc, cc);
    let larg = 0;
    for (let x = 0; x < N; x++) if (cheio(C, x, pc) && Math.abs(x - meio) < N * 0.2) larg++;
    const meia = Math.max(2, Math.round(larg * 0.6)), desce = Math.round(N * 0.22 * opts.pescoco);
    const ja = new Set(cabC);
    for (let y = pc + 1; y <= Math.min(N - 1, pc + desce); y++) {
      for (let x = Math.round(meio - meia); x <= Math.round(meio + meia); x++) {
        const p = y * N + x;
        if (x >= 0 && x < N && cheio(C, x, y) && !ja.has(p)) { cabC.push(p); ja.add(p); }
      }
    }
  }
  const xC = caixa(C, 0, 0, cabC), xB = caixa(B, 0, 0, cabB);
  if (!xC) { fim.ctx.drawImage(corpo, 0, 0, lado, lado); return fim.cv; }

  // 3: o corpo com as cores da cabeça (as famílias da cabeça contam só nela)
  repintar(B, familias(B), familias(C, cabC));

  // a cabeça nova, recortada só no pedaço dela
  const so = tela(xC.w, xC.h);
  const imC = so.ctx.createImageData(xC.w, xC.h);
  for (const p of cabC) {
    const x = p % N - xC.minx, y = ((p / N) | 0) - xC.miny, i = (y * xC.w + x) * 4, j = p * 4;
    imC.data[i] = C.data[j]; imC.data[i + 1] = C.data[j + 1]; imC.data[i + 2] = C.data[j + 2]; imC.data[i + 3] = 255;
  }
  so.ctx.putImageData(imC, 0, 0);
  // o tamanho da cabeça que sai — mas preso numa faixa razoável do corpo: o
  // "pedaço da cabeça" de uma cobra ou de um bicho de quatro braços pode ser
  // quase o corpo inteiro, e a cabeça nova não pode crescer (nem sumir) junto
  const prende = (v, a, b) => Math.max(a, Math.min(b, v));
  const alvoW = prende(xB ? xB.w : cb.w * 0.6, cb.w * 0.4, cb.w * 0.8);
  const alvoH = prende(xB ? xB.h : cb.h * 0.4, cb.h * 0.28, cb.h * 0.55);
  const base = opts.pescoco > 0 && xC0 ? xC0 : xC;
  const k = prende(Math.round(Math.min(alvoW / base.w, (alvoH / base.h) * 1.25) * 4) / 4, 0.75, 1.5);
  const cw = Math.max(1, Math.round(xC.w * k)), ch = Math.max(1, Math.round(xC.h * k));
  const cab = tela(cw, ch);
  cab.ctx.drawImage(so.cv, 0, 0, xC.w, xC.h, 0, 0, cw, ch);

  // 4: a cabeça velha sai, a nova senta no pescoço
  const M = N * 2, folga = Math.round(N / 2);
  const meioC = ((mC ? mC.meio : meioDaLinha(C, pc, xC)) - xC.minx) * k;
  const hx = Math.round(folga + meioDaLinha(B, pb, cb) - meioC);
  const hy = folga + pb + 1 - ch;
  // Pedaço pequeno (até 35% do bicho) é cabeça mesmo: sai inteiro. Pedaço
  // grande é cabeça GRUDADA em outra coisa (os braços do MACHAMP, o corpo do
  // ONIX, a cobra do RAYQUAZA): aí só sai o que fica na largura da cabeça
  // nova, com um pixel de folga de cada lado.
  let area = 0;
  for (let i = 3; i < B.data.length; i += 4) if (B.data[i] > OPACO) area++;
  const inteiro = cabB.length <= area * 0.35;
  const saiu = inteiro ? [...cabB] : cabB.filter((p) => {
    const x = p % N + folga;
    return x >= hx - 1 && x <= hx + cw;
  });
  for (const p of saiu) B.data[p * 4 + 3] = 0;
  // o corte deixa lasca: o que sobrou da cabeça velha e ficou fininho (até 3
  // pixels de largura) ou miúdo (menos de 3% do bicho) sai também
  if (!inteiro) {
    const resto = new Set(cabB.filter((p) => B.data[p * 4 + 3] > OPACO));
    const visto = new Set();
    for (const p0 of resto) {
      if (visto.has(p0)) continue;
      const pedaco = [], fila = [p0];
      visto.add(p0);
      while (fila.length) {
        const p = fila.pop();
        pedaco.push(p);
        for (const q of [p - 1, p + 1, p - N, p + N]) if (resto.has(q) && !visto.has(q)) { visto.add(q); fila.push(q); }
      }
      const cx = caixa(B, 0, 0, pedaco);
      if (cx.w <= 3 || pedaco.length < area * 0.03) {
        for (const p of pedaco) { B.data[p * 4 + 3] = 0; saiu.push(p); }
      }
    }
  }
  const out = tela(M, M);
  out.ctx.drawImage(emTela(B), folga, folga);
  out.ctx.drawImage(cab.cv, hx, hy);

  const im = out.ctx.getImageData(0, 0, M, M), d = im.data;
  const pc2 = cab.ctx.getImageData(0, 0, cw, ch).data;
  const linha = corDoContorno(C);
  for (let x = 0; x < cw; x++) {
    let fundo = -1;
    for (let y = ch - 1; y >= 0; y--) if (pc2[(y * cw + x) * 4 + 3] > OPACO) { fundo = y; break; }
    if (fundo < 0) continue;
    const px = hx + x, py = hy + fundo + 1;
    if (px < 0 || px >= M || py >= M) continue;
    const i = (py * M + px) * 4;
    if (d[i + 3] > OPACO) { d[i] *= 0.68; d[i + 1] *= 0.68; d[i + 2] *= 0.68; }
    else { d[i] = linha[0]; d[i + 1] = linha[1]; d[i + 2] = linha[2]; d[i + 3] = 255; }
  }
  // onde a cabeça velha saiu, a beirada do corpo que ficou aberta EMBAIXO do
  // buraco ganha contorno (o ombro). Do lado não: asa cortada de pé com linha
  // preta vira um risco atravessando o desenho.
  const eraCabeca = new Set(saiu.map((p) => (((p / N) | 0) + folga) * M + (p % N) + folga));
  for (const q of eraCabeca) {
    if (d[q * 4 + 3] > OPACO) continue;           // a cabeça nova cobriu
    for (const v of [q + M]) {
      const j = v * 4;
      if (d[j + 3] > OPACO && !eraCabeca.has(v) && brilho(d[j], d[j + 1], d[j + 2]) >= CONTORNO) {
        d[j] = linha[0]; d[j + 1] = linha[1]; d[j + 2] = linha[2];
      }
    }
  }
  out.ctx.putImageData(im, 0, 0);

  // 5: pros pés do corpo, e cabendo na tela
  const tudo = caixa(im);
  const meio = tela(N, N);
  if (tudo.w <= N && tudo.h <= N) {
    const topo = Math.max(0, Math.min(N - tudo.h, cb.maxy - tudo.h + 1));
    const esq = Math.max(0, Math.min(N - tudo.w, tudo.minx - folga));
    meio.ctx.drawImage(out.cv, tudo.minx, tudo.miny, tudo.w, tudo.h, esq, topo, tudo.w, tudo.h);
  } else {
    const f = N / Math.max(tudo.w, tudo.h);
    const w = Math.round(tudo.w * f), h = Math.round(tudo.h * f);
    meio.ctx.drawImage(out.cv, tudo.minx, tudo.miny, tudo.w, tudo.h, Math.round((N - w) / 2), N - h, w, h);
  }
  fim.ctx.drawImage(meio.cv, 0, 0, lado, lado);
  return fim.cv;
}

// ------------------------------------------------------------ FUSÃO TRIPLA
// Três entram: CABEÇA, MEIO e PERNAS. Primeiro o MEIO perde o que fica abaixo
// da CINTURA (a linha mais fina entre 55% e 82% da altura dele) e ganha as
// pernas do terceiro — tudo que o terceiro tem abaixo da cintura dele —,
// esticadas pra largura da cintura do meio (em passos de 1/4, como a cabeça).
// Depois é a fusão de sempre: a CABEÇA senta nesse corpo novo e pinta ele com
// as cores dela.

function cintura(im, cx) {
  let melhor = null, nota = Infinity;
  // o meio do bicho (a média de onde tem pixel): onde as pernas se SEPARAM
  // ele fica vazio — ali já é perna, não cintura
  let soma = 0, qt = 0;
  for (let y = cx.miny; y <= cx.maxy; y++) for (let x = cx.minx; x <= cx.maxx; x++) if (cheio(im, x, y)) { soma += x; qt++; }
  const mx = qt ? Math.round(soma / qt) : Math.round(cx.minx + cx.w / 2);
  for (let y = Math.round(cx.miny + cx.h * 0.55); y <= Math.round(cx.miny + cx.h * 0.82); y++) {
    let n = 0;
    for (let x = cx.minx; x <= cx.maxx; x++) if (cheio(im, x, y)) n++;
    if (!n) continue;
    if (!cheio(im, mx, y) && !cheio(im, mx - 1, y) && !cheio(im, mx + 1, y)) continue;
    const t = Math.abs((y - cx.miny) / cx.h - 0.68);
    if (n * (1 + t * 1.5) < nota) { nota = n * (1 + t * 1.5); melhor = y; }
  }
  return melhor ?? Math.round(cx.miny + cx.h * 0.68);
}

/** a largura do que está desenhado na linha y (do primeiro ao último pixel) */
function larguraDaLinha(im, y, cx) {
  let a = -1, b = -1;
  for (let x = cx.minx; x <= cx.maxx; x++) if (cheio(im, x, y)) { if (a < 0) a = x; b = x; }
  return a < 0 ? cx.w : b - a + 1;
}

/** a largura do pedaço CONTÍNUO do meio da linha y (sem o rabo ou o braço que
 *  estão do lado, separados por vazio) */
function larguraDoMiolo(im, y, cx) {
  const runs = [];
  let a = -1;
  for (let x = cx.minx; x <= cx.maxx + 1; x++) {
    if (x <= cx.maxx && cheio(im, x, y)) { if (a < 0) a = x; }
    else if (a >= 0) { runs.push([a, x - 1]); a = -1; }
  }
  if (!runs.length) return cx.w;
  const meio = cx.minx + cx.w / 2;
  runs.sort((p, q) => Math.abs((p[0] + p[1]) / 2 - meio) - Math.abs((q[0] + q[1]) / 2 - meio));
  return runs[0][1] - runs[0][0] + 1;
}

/** O corpo da tripla: o MEIO até a cintura, as PERNAS do outro dali pra baixo. */
export function juntarPernas(meio, pernas) {
  const N = Math.max(meio?.width || 0, pernas?.width || 0, 16);
  const fim = tela(N, N);
  if (!meio || !pernas) {
    if (meio || pernas) fim.ctx.drawImage(meio || pernas, 0, 0, N, N);
    return fim.cv;
  }
  const M = pixels(meio, N), P = pixels(pernas, N);
  const cm = caixa(M), cp = caixa(P);
  if (!cm || !cp) { fim.ctx.drawImage(cm ? meio : pernas, 0, 0, N, N); return fim.cv; }

  const yM = cintura(M, cm), yP = cintura(P, cp);
  const prende = (v, a, b) => Math.max(a, Math.min(b, v));
  // o tamanho das pernas: o tronco do MEIO (do topo à cintura) contra o tronco
  // de quem dá as pernas — assim as pernas ficam na proporção do dono delas
  // (as do MACHAMP não somem num CHARMANDER), e a cintura (só o pedaço do meio,
  // sem rabo nem braço) ajuda a acertar a largura
  // as pernas têm que APARECER: no mínimo do tamanho das pernas do meio e
  // ~70% do tronco dele; e na largura, pelo menos a cintura do meio
  const pernasP = Math.max(1, cp.maxy - yP), troncoM = yM - cm.miny + 1;
  const alvo = Math.max(cm.maxy - yM, troncoM * 0.6);
  const kAlto = alvo / pernasP;
  const kLargo = larguraDoMiolo(M, yM, cm) / Math.max(1, larguraDoMiolo(P, yP, cp));
  const k = prende(Math.round(Math.max(kAlto, kLargo * 0.8) * 4) / 4, 0.5, 1.25);

  // o meio, só até a cintura
  const cima = tela(N, N);
  for (let i = (yM + 1) * N * 4; i < M.data.length; i += 4) M.data[i + 3] = 0;
  cima.ctx.putImageData(M, 0, 0);
  // as pernas, só da cintura pra baixo
  const baixo = tela(N, N);
  for (let i = 0; i < (yP + 1) * N * 4; i += 4) P.data[i + 3] = 0;
  baixo.ctx.putImageData(P, 0, 0);
  const pc = caixa(P);
  if (!pc) { fim.ctx.drawImage(meio, 0, 0, N, N); return fim.cv; }

  const G = N * 2, folga = Math.round(N / 2);
  const out = tela(G, G);
  out.ctx.drawImage(cima.cv, folga, folga);
  const pw = Math.max(1, Math.round(pc.w * k)), ph = Math.max(1, Math.round(pc.h * k));
  const meioM = (() => {           // o meio de verdade da cintura do MEIO
    let a = -1, b = -1;
    for (let x = cm.minx; x <= cm.maxx; x++) if (cheio(M, x, yM)) { if (a < 0) a = x; b = x; }
    return a < 0 ? cm.minx + cm.w / 2 : (a + b + 1) / 2;
  })();
  const meioP = (() => {
    let a = -1, b = -1;
    for (let x = pc.minx; x <= pc.maxx; x++) if (cheio(P, x, pc.miny)) { if (a < 0) a = x; b = x; }
    return a < 0 ? pc.minx + pc.w / 2 : (a + b + 1) / 2;
  })();
  const px = Math.round(folga + meioM - (meioP - pc.minx) * k);
  // as pernas por BAIXO do meio: o que o tronco tem até a cintura fica na frente
  const tronco = tela(G, G);
  tronco.ctx.drawImage(out.cv, 0, 0);
  out.ctx.clearRect(0, 0, G, G);
  out.ctx.drawImage(baixo.cv, pc.minx, pc.miny, pc.w, pc.h, px, folga + yM, pw, ph);
  out.ctx.drawImage(tronco.cv, 0, 0);

  // cabendo na tela, com os pés no chão
  const im = out.ctx.getImageData(0, 0, G, G);
  const tudo = caixa(im);
  const chao = Math.max(cm.maxy, cp.maxy);
  if (tudo.w <= N && tudo.h <= N) {
    const topo = Math.max(0, Math.min(N - tudo.h, chao - tudo.h + 1));
    const esq = Math.max(0, Math.min(N - tudo.w, tudo.minx - folga));
    fim.ctx.drawImage(out.cv, tudo.minx, tudo.miny, tudo.w, tudo.h, esq, topo, tudo.w, tudo.h);
    fim.cv.doMeio = (x, y) => [x + folga - tudo.minx + esq, y + folga - tudo.miny + topo];
  } else {
    const f = N / Math.max(tudo.w, tudo.h);
    const w = Math.round(tudo.w * f), h = Math.round(tudo.h * f);
    fim.ctx.drawImage(out.cv, tudo.minx, tudo.miny, tudo.w, tudo.h, Math.round((N - w) / 2), N - h, w, h);
    fim.cv.doMeio = (x, y) => [(x + folga - tudo.minx) * f + Math.round((N - w) / 2), (y + folga - tudo.miny) * f + N - h];
  }
  // `doMeio`: onde um ponto do MEIO (em N) foi parar no corpo juntado — pra a
  // cara marcada do meio (os olhos, a boca) continuar valendo na tripla
  return fim.cv;
}

/** A FUSÃO TRIPLA inteira: o corpo de MEIO + PERNAS, e a CABEÇA em cima. */
export function montarTripla(cabeca, meio, pernas, lado = 64, mC = null, mB = null, pintada = null) {
  const corpo = juntarPernas(meio, pernas);
  // PELA CARA também na tripla (pedido do CAIO: "melhore as fusões triplas"):
  // a cara marcada do MEIO é levada pro lugar dela no corpo juntado
  if (mC?.o?.length && mB?.o?.length && corpo.doMeio && meio) {
    const s = corpo.width / meio.width;
    const leva = ([x, y]) => corpo.doMeio(x * s, y * s);
    const mJ = { o: mB.o.map(leva), b: mB.b ? leva(mB.b) : null };
    const pelaCara = montarFusaoCara(cabeca, corpo, lado, mC, mJ, pintada);
    if (pelaCara) return pelaCara;
  }
  return montarFusao(cabeca, corpo, lado);
}



// ------------------------------------------------------------ PELA CARA
// O JEITO DO POKEMON FUSION (Alex Onsager) e do INFINITE FUSION, com as CARAS
// DE DITTO (pedido do CAIO, nov/2026: "faz a região dos olhos marcados pro ditto
// ser a cara"): os OLHOS e a BOCA que marcamos pra cada sprite
// (src/data/cara-ditto.json) dizem onde fica a cara. O CORPO fica inteiro — com
// o formato da cabeça dele —, pintado com as cores da cabeça; e a CARA de quem
// dá a cabeça (os olhos, a boca e o que tem em volta) é colada em cima da cara
// do corpo, no tamanho certo (os olhos de um na distância dos olhos do outro).
// `mC`, `mB`: { o: [[x,y],[x,y]], b: [x,y] }, nas coordenadas de cada imagem.
export function montarFusaoCara(cabeca, corpo, lado = 64, mC, mB, pintada = null, cores = {}) {
  const N = Math.max(cabeca?.width || 0, corpo?.width || 0, 16);
  const fim = tela(lado, lado);
  if (!cabeca || !corpo || !mC?.o?.length || !mB?.o?.length) return null;
  const C = pixels(cabeca, N), B = pixels(corpo, N);
  const cara = (m, s) => {
    const o = m.o.map(([x, y]) => [x * s, y * s]), b = m.b ? [m.b[0] * s, m.b[1] * s] : null;
    const o1 = o[0], o2 = o[1] || o[0];
    const dist = Math.max(3, Math.hypot(o2[0] - o1[0], o2[1] - o1[1]));
    const ex = (o1[0] + o2[0]) / 2, ey = (o1[1] + o2[1]) / 2;
    const boca = b ? Math.max(2, b[1] - ey) : dist * 0.6;
    return { ex, ey, dist, boca, cx: b ? (ex * 2 + b[0]) / 3 : ex };
  };
  const fc = cara(mC, N / cabeca.width), fb = cara(mB, N / corpo.width);
  // 1: o corpo com as cores da cabeça (o mesmo `repintar` da fusão de sempre)
  if (PINTURA === "puro") repintarExato(B, C, cores.corpo, cores.cabeca);
  else if (PINTURA === "onsager") repintarOnsager(B, C);
  else repintar(B, familias(B), familias(C));
  // 2: o tamanho: os olhos de um na distância dos olhos do outro (em meios,
  //    pra pixel esticado não ficar torto)
  // (até 1/4: a cara do BASTIODON tem que caber no MUDKIP)
  // NO JEITO DO JAPEAL a cara cresce até a LARGURA DA CABEÇA do corpo: mede a
  // largura do desenho na linha dos olhos de cada um (o pedaço contínuo em
  // volta do meio da cara) e usa a proporção
  const largura = (im, cx, y) => {
    y = Math.round(y); let a = Math.round(cx), b = a;
    if (!cheio(im, a, y)) return 0;
    while (cheio(im, a - 1, y)) a--;
    while (cheio(im, b + 1, y)) b++;
    return b - a + 1;
  };
  const lC = largura(C, fc.cx, fc.ey), lB = largura(B, fb.cx, fb.ey);
  const pelaLargura = PINTURA === "puro" && lC > 4 && lB > 4;
  const k = Math.max(0.25, Math.min(2, Math.round((pelaLargura ? lB / lC : fb.dist / fc.dist) * 4) / 4));
  // 3: a região da cara de quem dá a cabeça: um oval em volta dos olhos e da boca
  // (o CAIO: "faz puxar um pouco mais a cabeça": o oval pega mais pros lados e
  // bem mais pra cima — a testa, as orelhas, os chifres de quem dá a cabeça)
  const rx = fc.dist / 2 + Math.max(8, fc.dist * 1.35);
  const cima = Math.max(10, fc.dist * 1.7), baixo = fc.boca + Math.max(4, fc.dist * 0.65);
  const d = B.data, s = C.data;
  // A CARA PINTADA À MÃO (dev/marcarcara.html): quando tem, é ELA a região
  let naPintada = null;
  if (pintada?.l?.length) {
    const pw = pintada.w || cabeca.width, ph = pintada.h || cabeca.height, set = new Set();
    for (const [yy, a, b] of pintada.l) for (let xx = a; xx <= b; xx++) set.add(yy * pw + xx);
    naPintada = (X, Y) => { const mx = Math.floor(X * pw / N), my = Math.floor(Y * ph / N); return set.has(my * pw + mx); };
  }
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const j = (y * N + x) * 4;
      // em cima dos olhos a cabeça pode passar do corpo (a orelha do PIKACHU, o
      // chifre): ali entra o desenho dela com o contorno dela; embaixo, a cara
      // fica dentro do corpo
      const foraB = d[j + 3] <= OPACO;
      if (foraB && y >= fb.ey) continue;
      // de onde vem este pixel na cabeça
      const X = fc.cx + (x - fb.cx) / k, Y = fc.ey + (y - fb.ey) / k;
      const dy = Y - fc.ey;
      // NO JEITO DAS FUSÕES DO INFINITE FUSION (o CAIO, 07/nov: "vê a de cacnea
      // mais pikachu"): DENTRO do corpo entra só a cara mesmo — olhos e boca,
      // num oval justo —, e o desenho do corpo (as manchas dele) fica. FORA do
      // corpo, em cima dos olhos, entra o que a cabeça tem lá (coroa, orelha)
      const justo = PINTURA === "puro" && !foraB;
      const rxx = justo ? fc.dist / 2 + Math.max(3, fc.dist * 0.45) : rx;
      const ry = justo ? (dy < 0 ? Math.max(3, fc.dist * 0.55) : fc.boca + Math.max(2, fc.dist * 0.3)) : (dy < 0 ? cima : baixo);
      const r2 = naPintada ? 0 : ((X - fc.cx) / rxx) ** 2 + (dy / ry) ** 2;
      if (naPintada ? !naPintada(X, Y) : r2 > 1) continue;
      const xi = Math.round(X), yi = Math.round(Y);
      if (xi < 0 || yi < 0 || xi >= N || yi >= N) continue;
      const i = (yi * N + xi) * 4;
      if (s[i + 3] <= OPACO) continue;
      // o contorno do corpo fica (o formato da cabeça é dele), a não ser que
      // ali seja um traço escuro da cara (o olho, a boca)
      const contornoB = !foraB && brilho(d[j], d[j + 1], d[j + 2]) < CONTORNO, escuroC = brilho(s[i], s[i + 1], s[i + 2]) < CONTORNO;
      if (contornoB && !escuroC) continue;
      if (!foraB) {
        // na BEIRADA do oval, dentro do corpo, o traço escuro da cabeça é o
        // CONTORNO dela, não a cara: ele não entra, senão vira um risco no corpo
        if (escuroC && r2 > 0.55) continue;
        // e o que é FUNDO da cabeça (colado na beirada) também não
        if (r2 > 0.7 && !cheio(C, xi + 1, yi) + !cheio(C, xi - 1, yi) + !cheio(C, xi, yi + 1) + !cheio(C, xi, yi - 1) > 0) continue;
      }
      d[j] = s[i]; d[j + 1] = s[i + 1]; d[j + 2] = s[i + 2]; d[j + 3] = 255;
    }
  }
  fim.ctx.drawImage(emTela(B), 0, 0, lado, lado);
  return fim.cv;
}

