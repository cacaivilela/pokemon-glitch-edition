// O MODO ISOMÉTRICO: o mesmo Kanto, visto de quina.
//
// Não é outro mapa nem outra física: a colisão, os passos, os encontros e os
// warps continuam sendo os da grade de sempre. Só o DESENHO muda:
//
// - o chão (o PNG do mapa inteiro) vai pra tela girado 45° e achatado pela
//   metade, então cada tile 16x16 vira um losango 32x16;
// - cada tile tem uma ALTURA (ver `relevo` abaixo): o que não está no nível
//   zero é redesenhado como uma coluna, com o desenho do tile em cima e o
//   próprio desenho, escurecido, nas duas faces que dão pra câmera. A frente
//   das casas do FireRed é desenhada olhando pro sul, e a face sul da coluna é
//   justamente a da esquerda — então a porta e a janela aparecem na parede;
// - os bonecos continuam EM PÉ (girar sprite de pixel art é destruir ele), sobem
//   junto com o chão onde pisam e entram na mesma fila das colunas, por
//   profundidade (x + y), pra passar por trás e pela frente na ordem certa.
//
// A preferência mora nas opções do navegador, como a velocidade (é de quem está
// na frente da tela, não da partida). `?iso=1` / `?iso=0` na URL força.
import { Opcoes } from "./opcoes.js";
import { url } from "./base.js";

export const ALTURA = 12;          // uma parede encostada no caminho, em pixels de tela
export const NIVEL = 8;            // um degrau de terreno (patamar de barranco, andar)
export const PREDIO = 32;          // todo prédio tem DOIS BLOCOS de altura (2 tiles de 16)
const AGUA = -4;                   // a água fica um pouco abaixo da margem
// OS PRÉDIOS ALTOS: os que o desenho não separa sozinho (a TORRE POKÉMON
// encosta nas árvores da borda, então a busca das portas acha um paredão e não
// um prédio). Vão escritos à mão: o retângulo em tiles, quantos BLOCOS de 16
// de altura e de qual tile sai o telhado (o topo do desenho dela é janela, e
// janela virada pro céu não é telhado). A parede da frente mostra o desenho
// inteiro da fachada — sete fileiras, sete blocos, sem esticar.
const PREDIOS_ALTOS = {
  lavender_town: [{ x0: 15, y0: 0, x1: 21, y1: 6, blocos: 7, teto: [18, 4] }],
};
const MAX_BLOCOS = Math.max(2, ...Object.values(PREDIOS_ALTOS).flat().map((p) => p.blocos));
const MAX_TOPO = Math.max(PREDIO + 6 * NIVEL, MAX_BLOCOS * 16 + 3 * NIVEL);   // o mais alto que algo sobe

const daUrl = (() => {
  try { return new URLSearchParams(location.search).get("iso"); } catch { return null; }
})();

export function isoLigado() {
  if (daUrl === "1") return true;
  if (daUrl === "0") return false;
  return !!Opcoes.get("isometrico");
}

export function alternarIso() {
  return Opcoes.set("isometrico", !isoLigado());
}

// ------------------------------------------------------------------ relevo
//
// De onde sai a altura de cada tile, na ordem:
//
// 1. A ELEVAÇÃO DO FIREred (assets/maps/alturas.json, de tools/fetch_alturas.py):
//    cada tile do jogo original tem um nível de 0 a 15. Em Kanto ao ar livre ele
//    é quase sempre 3 (chão) ou 1 (água) — o GBA só usa o resto onde há dois
//    andares de verdade (a VICTORY ROAD, as pontes). Então: água desce um pouco
//    e nível 4+ sobe um degrau por nível.
// 2. OS BARRANCOS. Quem pula um barranco desce: o lado de cima é mais alto. Se
//    o barranco separa duas partes do mapa que não se ligam por nenhum outro
//    caminho, a de cima vira um PATAMAR inteiro (um degrau acima da de baixo,
//    empilhando se tiver vários). Se as duas partes se ligam por outro lado, o
//    barranco é só um ressalto no próprio tile.
// 3. OS PRÉDIOS. Casa, laboratório, Centro, loja, ginásio: DOIS BLOCOS de
//    altura, com o telhado reto. Prédio é a parede que tem PORTA — o bloco de
//    parede ligado a uma porta, desde que ele feche em si mesmo (a casa é
//    cercada de chão). Porta de caverna num paredão não conta: o paredão não
//    fecha, e ele segue a regra de baixo.
// 4. AS OUTRAS PAREDES. Árvore, cerca, paredão: sobem ALTURA acima do chão e
//    mais um degrau a cada tile de distância do caminho (até três) — um bosque
//    fechado vira morro.
//
// Só precisa da geometria do mapa (tags); sem alturas.json, fica sem o item 1.

let elevacoes = null;              // { mapa: "3333..." } quando carregar
let pedido = null;
function carregarElevacoes() {
  pedido ||= fetch(url("assets/maps/alturas.json"))
    .then((r) => (r.ok ? r.json() : {}))
    .catch(() => ({}))
    .then((j) => { elevacoes = j || {}; cache.clear(); });
}

const cache = new Map();

/** O relevo do mapa `id`: `topo[i]` é a altura do tile i (em pixels), `base[i]`
 *  a do chão debaixo dele (difere só nas paredes) e `parede[i]` se ele era
 *  parede no mapa original. */
export function relevo(id, g) {
  if (!elevacoes) carregarElevacoes();
  const chave = `${id}|${g.w}x${g.h}`;
  let r = cache.get(chave);
  if (r && r.g === g) return r;
  r = calcularRelevo(g, elevacoes?.[g.arte || id], PREDIOS_ALTOS[g.arte || id]);
  r.g = g;
  cache.set(chave, r);
  return r;
}

// as tags de src/data/maps.js
const LIVRE = 0, PAREDE = 1, MATO = 2, AGUA_T = 3;
const PULO = { 4: [0, 1], 5: [1, 0], 6: [-1, 0], 7: [0, -1] };   // barranco -> pra onde se pula

function calcularRelevo(g, elev, altos = []) {
  const { w, h } = g, n = w * h;
  const tag = new Int8Array(n);
  for (let i = 0; i < n; i++) tag[i] = g.tags.charCodeAt(i) - 48;
  const e = elev && elev.length === n ? elev : null;
  const anda = (t) => t === LIVRE || t === MATO;

  // (2) partes do mapa ligadas a pé, sem pular barranco
  const parte = new Int32Array(n).fill(-1);
  let partes = 0;
  for (let i = 0; i < n; i++) {
    if (parte[i] >= 0 || !anda(tag[i])) continue;
    const pilha = [i];
    parte[i] = partes;
    while (pilha.length) {
      const j = pilha.pop(), x = j % w, y = (j / w) | 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy, k = ny * w + nx;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h || parte[k] >= 0 || !anda(tag[k])) continue;
        parte[k] = partes;
        pilha.push(k);
      }
    }
    partes++;
  }
  // "a parte A fica um degrau acima da B", por barranco — contando quantos
  // tiles de barranco dizem isso (barranco comprido é regra mais forte)
  const votos = new Map();
  for (let i = 0; i < n; i++) {
    const p = PULO[tag[i]];
    if (!p) continue;
    const x = i % w, y = (i / w) | 0;
    const ax = x - p[0], ay = y - p[1], bx = x + p[0], by = y + p[1];
    if (ax < 0 || ay < 0 || ax >= w || ay >= h || bx < 0 || by < 0 || bx >= w || by >= h) continue;
    const a = parte[ay * w + ax], b = parte[by * w + bx];
    if (a >= 0 && b >= 0 && a !== b) votos.set(`${a},${b}`, (votos.get(`${a},${b}`) || 0) + 1);
  }
  // Barrancos em círculo (A acima de B por um, B acima de A por outro) não têm
  // resposta certa, e somar tudo empurraria o mapa inteiro pro teto. Então as
  // regras entram da mais forte pra mais fraca, e a que fecharia um círculo
  // fica de fora: aquele barranco vira só o ressalto do próprio tile.
  const desce = Array.from({ length: partes }, () => []);
  const alcanca = (de, ate) => {
    const visto = new Set([de]), pilha = [de];
    while (pilha.length) {
      const j = pilha.pop();
      if (j === ate) return true;
      for (const k of desce[j]) if (!visto.has(k)) { visto.add(k); pilha.push(k); }
    }
    return false;
  };
  for (const [ab] of [...votos].sort((p, q) => q[1] - p[1])) {
    const [a, b] = ab.split(",").map(Number);
    if (!alcanca(b, a)) desce[a].push(b);
  }
  // o degrau de cada parte: um acima da mais alta que fica abaixo dela (até 3)
  const degrau = new Int8Array(partes).fill(-1);
  const calc = (a) => {
    if (degrau[a] >= 0) return degrau[a];
    degrau[a] = 0;
    let d = 0;
    for (const b of desce[a]) d = Math.max(d, calc(b) + 1);
    return (degrau[a] = Math.min(3, d));
  };
  for (let a = 0; a < partes; a++) calc(a);

  const topo = new Float32Array(n), base = new Float32Array(n), parede = new Uint8Array(n);
  const teto = new Int32Array(n).fill(-1);   // prédio: de qual tile sai o desenho do teto
  const predio = new Int32Array(n).fill(-1); // prédio: qual (um número por prédio do mapa)
  const cimaY = new Int32Array(n).fill(-1);  // prédio: a fileira de cima dele, naquela coluna
  const fixo = new Uint8Array(n);            // prédio alto: o telhado é o escrito, não o achado
  let predios = 0;
  const chaoDe = (i) => {
    let z = parte[i] >= 0 ? degrau[parte[i]] * NIVEL : 0;
    const ev = e ? parseInt(e[i], 16) : 3;
    if (ev >= 4 && ev <= 14) z += (ev - 3) * NIVEL;
    return z;
  };
  for (let i = 0; i < n; i++) {
    const t = tag[i];
    if (anda(t)) topo[i] = base[i] = chaoDe(i);
    else if (t === AGUA_T) topo[i] = base[i] = AGUA;
  }
  // o barranco: fica na altura do lado de cima (é a beirada dele), e se os
  // dois lados estão no mesmo nível ele vira um ressalto de meio degrau
  for (let i = 0; i < n; i++) {
    const p = PULO[tag[i]];
    if (!p) continue;
    const x = i % w, y = (i / w) | 0;
    const alt = (xx, yy) => (xx < 0 || yy < 0 || xx >= w || yy >= h ? 0 : topo[yy * w + xx]);
    const cima = alt(x - p[0], y - p[1]), baixo = alt(x + p[0], y + p[1]);
    topo[i] = base[i] = Math.max(cima, baixo + NIVEL / 2);
  }

  // (3) as paredes: busca em largura a partir de tudo que não é parede,
  // levando junto a altura do chão de onde a parede começou
  const dist = new Int16Array(n).fill(-1);
  let fila = [];
  for (let i = 0; i < n; i++) {
    if (tag[i] === PAREDE || tag[i] < 0) continue;
    dist[i] = 0;
    fila.push(i);
  }
  while (fila.length) {
    const prox = [];
    for (const j of fila) {
      const x = j % w, y = (j / w) | 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy, k = ny * w + nx;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h || dist[k] >= 0) continue;
        dist[k] = dist[j] + 1;
        base[k] = Math.max(0, base[j]);
        prox.push(k);
      }
    }
    fila = prox;
  }
  for (let i = 0; i < n; i++) {
    if (tag[i] !== PAREDE) continue;
    parede[i] = 1;
    const d = dist[i] < 0 ? 3 : Math.min(3, dist[i]);
    topo[i] = base[i] + ALTURA + (d - 1) * NIVEL;
  }

  // a BASE DE UMA ESTÁTUA (o ARCEUS REDENTOR, src/data/braglitch.js) é um
  // pedestal: um bloco só de altura, reto — a figura de nove blocos vai em pé
  // em cima dele, desenhada pela cena
  const est = g.estatua;
  if (est) {
    for (let y = est.y; y < est.y + est.h; y++) {
      for (let x = est.x; x < est.x + est.w; x++) {
        const i = y * w + x;
        if (tag[i] === PAREDE) topo[i] = base[i] + 16;
      }
    }
  }

  // (3) os prédios, a partir das portas. Um prédio inteiro fica na altura do
  // chão da porta (o telhado é reto, não acompanha o terreno)
  if (!g.content?.interior) {
    const PERTO = 10, MAX = 160;           // prédio maior que isso é paredão
    const feito = new Uint8Array(n);
    for (const wp of g.warps || []) {
      // a porta do FireRed é parede; quando não é, o prédio está logo acima dela
      let s = wp.y * w + wp.x;
      if (wp.x < 0 || wp.y < 0 || wp.x >= w || wp.y >= h) continue;
      if (tag[s] !== PAREDE) s = wp.y > 0 && tag[s - w] === PAREDE ? s - w : -1;
      if (s < 0 || feito[s]) continue;
      const bloco = [s], visto = new Set([s]);
      let fecha = true;
      for (let q = 0; q < bloco.length && fecha; q++) {
        const j = bloco[q], x = j % w, y = (j / w) | 0;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = x + dx, ny = y + dy, k = ny * w + nx;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) { fecha = false; break; }   // encosta na borda
          if (tag[k] !== PAREDE || visto.has(k)) continue;
          if (Math.abs(nx - wp.x) > PERTO || wp.y - ny > PERTO || ny - wp.y > 2 || bloco.length >= MAX) {
            fecha = false; break;                                              // não fecha: paredão
          }
          visto.add(k);
          bloco.push(k);
        }
      }
      if (!fecha) continue;
      // O QUE ESTÁ GRUDADO NA CASA NÃO É CASA: a caixa de correio da VILA
      // PALETA encosta na parede e entrava no bloco, e o prédio virava um L com
      // um toco de telhado do lado. Coluna com menos da metade da altura do
      // resto fica de fora: vira um bloco dela, com o próprio desenho em cima e
      // a mesma altura de dois blocos da casa.
      const porColuna = new Map();
      for (const j of bloco) porColuna.set(j % w, (porColuna.get(j % w) || 0) + 1);
      const maior = Math.max(...porColuna.values());
      const fica = bloco.filter((j) => porColuna.get(j % w) * 2 >= maior);
      if (!fica.includes(s)) continue;
      const chao = base[s];
      for (const j of bloco) {
        if (fica.includes(j)) continue;
        feito[j] = 1; base[j] = chao; topo[j] = chao + PREDIO;
      }
      bloco.length = 0;
      bloco.push(...fica);
      // O TETO é a fileira de cima do prédio (a beira do telhado no desenho do
      // FireRed) repetida por cima dele inteiro, coluna por coluna — senão o
      // teto seria a fachada deitada, com porta e placa viradas pro céu
      const cima = new Map();
      for (const j of bloco) {
        const x = j % w, y = (j / w) | 0;
        if (!cima.has(x) || y < cima.get(x)) cima.set(x, y);
      }
      for (const j of bloco) {
        feito[j] = 1; base[j] = chao; topo[j] = chao + PREDIO;
        teto[j] = cima.get(j % w) * w + (j % w);
        cimaY[j] = cima.get(j % w);
        predio[j] = predios;
      }
      predios++;
    }
  }
  // os PRÉDIOS ALTOS: por cima do que a busca achou (ou não achou)
  for (const a of g.content?.interior ? [] : altos) {
    // o chão é o da frente da porta: o tile de baixo do meio da fachada
    const fx = (a.x0 + a.x1) >> 1, fy = Math.min(h - 1, a.y1 + 1);
    const chao = base[fy * w + fx];
    for (let y = a.y0; y <= a.y1; y++) {
      for (let x = a.x0; x <= a.x1; x++) {
        const j = y * w + x;
        if (tag[j] !== PAREDE) continue;
        base[j] = chao; topo[j] = chao + a.blocos * 16;
        teto[j] = a.teto[1] * w + a.teto[0];
        cimaY[j] = a.y0;
        predio[j] = predios;
        fixo[j] = 1;
      }
    }
    predios++;
  }
  return { w, h, topo, base, parede, teto, predio, cimaY, fixo };
}

// ------------------------------------------------------------ os enfeites
//
// O teto repete a fileira de cima do prédio — mas não o que é ENFEITE: a Poké
// Ball do CENTRO, a placa da LOJA, o emblema do GINÁSIO. Repetido em toda
// fileira, o prédio viraria um tabuleiro de Poké Ball. Então o enfeite fica UMA
// vez, no lugar dele, e o resto do teto é telhado liso.
//
// Quem é enfeite sai do próprio desenho: no telhado de um prédio o tile liso se
// repete (é telhado, feito de pedaços iguais), e o enfeite é o que aparece uma
// vez só. As colunas das pontas ficam de fora (a quina do telhado também é
// única, e ela tem que continuar repetindo a própria borda).

const hashDoTile = (px, W, x0, y0, T) => {
  let hsh = 2166136261;
  for (let y = 0; y < T; y++) {
    let i = ((y0 + y) * W + x0) * 4;
    for (let x = 0; x < T; x++, i += 4) {
      hsh = Math.imul(hsh ^ px[i], 16777619);
      hsh = Math.imul(hsh ^ px[i + 1], 16777619);
      hsh = Math.imul(hsh ^ px[i + 2], 16777619);
      hsh = Math.imul(hsh ^ px[i + 3], 16777619);
    }
  }
  return hsh >>> 0;
};

/** `r.fonteTeto[i]`: de qual tile do desenho sai o teto do tile i de um prédio.
 *  Calculado uma vez por mapa, quando o desenho dele já carregou. */
export function fontesDoTeto(r, art, T) {
  if (r.fonteTeto && r.fonteArt === art) return r.fonteTeto;
  const { w } = r, n = r.predio.length;
  const fonte = Int32Array.from(r.teto);
  let px = null;
  try {
    const cv = document.createElement("canvas");
    cv.width = art.width; cv.height = art.height;
    const c = cv.getContext("2d");
    c.drawImage(art, 0, 0);
    px = c.getImageData(0, 0, art.width, art.height).data;
  } catch { /* sem ler pixel (desenho de outra origem): fica a fileira de cima */ }
  if (px) {
    const porPredio = new Map();
    for (let i = 0; i < n; i++) {
      if (r.predio[i] < 0) continue;
      if (!porPredio.has(r.predio[i])) porPredio.set(r.predio[i], []);
      porPredio.get(r.predio[i]).push(i);
    }
    for (const tiles of porPredio.values()) {
      // colunas do prédio e a fileira de baixo de cada uma
      const col = new Map();
      for (const i of tiles) {
        const x = i % w, y = (i / w) | 0;
        const c = col.get(x) || { cima: y, baixo: y };
        c.cima = Math.min(c.cima, y); c.baixo = Math.max(c.baixo, y);
        col.set(x, c);
      }
      const xs = [...col.keys()].sort((a, b) => a - b);
      const ponta = (x) => x === xs[0] || x === xs[xs.length - 1];
      // o TELHADO: tudo menos as duas fileiras de baixo (a fachada, que vai na
      // parede da frente); prédio baixinho é só a fileira de cima
      const ehTelhado = (i) => {
        const x = i % w, y = (i / w) | 0, c = col.get(x);
        return c.baixo - c.cima >= 2 ? y <= c.baixo - 2 : y === c.cima;
      };
      const hs = new Map(), conta = new Map();
      for (const i of tiles) {
        if (!ehTelhado(i)) continue;
        const hh = hashDoTile(px, art.width, (i % w) * T, ((i / w) | 0) * T, T);
        hs.set(i, hh);
        conta.set(hh, (conta.get(hh) || 0) + 1);
      }
      const enfeite = (i) => hs.has(i) && conta.get(hs.get(i)) === 1 && !ponta(i % w);
      // o telhado liso de cada coluna: o primeiro de cima pra baixo que não é enfeite
      const liso = new Map();
      for (const x of xs) {
        const c = col.get(x);
        for (let y = c.cima; y <= c.baixo; y++) {
          const i = y * w + x;
          if (hs.has(i) && !enfeite(i)) { liso.set(x, i); break; }
        }
      }
      // coluna que é só enfeite (a Poké Ball ocupa ela inteira): o liso da vizinha
      for (const x of xs) {
        if (liso.has(x)) continue;
        const viz = xs.filter((v) => liso.has(v)).sort((a, b) => Math.abs(a - x) - Math.abs(b - x))[0];
        if (viz !== undefined) liso.set(x, liso.get(viz));
      }
      for (const i of tiles) {
        fonte[i] = r.fixo[i] ? r.teto[i] : enfeite(i) ? i : (liso.get(i % w) ?? r.teto[i]);
      }
    }
  }
  r.fonteTeto = fonte;
  r.fonteArt = art;
  return fonte;
}

/** Altura do chão num ponto do mapa (em tiles, pode ser fracionário: quem está
 *  no meio do passo sobe a rampa junto). */
export function chaoEm(r, x, y) {
  const x0 = Math.floor(x), y0 = Math.floor(y);
  const fx = x - x0, fy = y - y0;
  const z = (xx, yy) => {
    if (xx < 0 || yy < 0 || xx >= r.w || yy >= r.h) return 0;
    return r.base[yy * r.w + xx];
  };
  const a = z(x0, y0) + (z(x0 + 1, y0) - z(x0, y0)) * fx;
  const b = z(x0, y0 + 1) + (z(x0 + 1, y0 + 1) - z(x0, y0 + 1)) * fx;
  return fy ? a + (b - a) * fy : a;
}

// ---------------------------------------------------------------- desenho

/** A projeção. `o` é a origem (onde cai o pixel 0,0 do mapa na tela); com ela
 *  o ponto (wx, wy) em pixels do mapa vai pra (wx - wy, (wx + wy) / 2). */
export function origem(W, H, centroX, centroY, z = 0) {
  return { x: Math.round(W / 2 - (centroX - centroY)), y: Math.round(H / 2 - (centroX + centroY) / 2 + z) };
}
export const naTela = (o, wx, wy) => ({ x: o.x + wx - wy, y: o.y + (wx + wy) / 2 });

/** Desenha `f(ctx)` no plano do chão (coordenadas em pixels do mapa), `sobe`
 *  pixels acima dele. */
export function noChao(ctx, o, f, sobe = 0) {
  ctx.save();
  ctx.transform(1, 0.5, -1, 0.5, o.x, o.y - sobe);
  f(ctx);
  ctx.restore();
}

/** Uma coluna no tile (tx, ty) com o desenho `art` do mapa: o tampo na altura
 *  `topo` e as faces sul e leste descendo até a altura do vizinho daquele lado
 *  (encostada em algo tão alto quanto ela, a face fica escondida e não se
 *  desenha). `tampo` false: só as faces (o tampo já está no chão desenhado). */
/** `fonte`: de onde sai o desenho de cada parte, em pixels do PNG do mapa —
 *  `{ tampo: [x, y], sul: [x, y, altura], leste: [x, y, altura] }`. Sem ela,
 *  tudo sai do próprio tile (e a face estica o tile até a altura dela). */
export function coluna(ctx, o, art, T, tx, ty, topo, sul, leste, tampo = true, fonte = null) {
  const sx = tx * T, sy = ty * T;
  if (sul < topo) {
    // face sul: corre ao longo do x do mapa, da quina (tx, ty+1) pra direita
    const [fx, fy, fh] = fonte?.sul || [sx, sy, T];
    const p = naTela(o, sx, sy + T);
    face(ctx, art, fx, fy, T, fh, [1, 0.5, 0, (topo - sul) / fh, p.x, p.y - topo], 0.28);
  }
  if (leste < topo) {
    // face leste: corre ao longo do y do mapa, da quina (tx+1, ty) pra baixo
    const [fx, fy, fh] = fonte?.leste || [sx, sy, T];
    const p = naTela(o, sx + T, sy);
    face(ctx, art, fx, fy, T, fh, [-1, 0.5, 0, (topo - leste) / fh, p.x, p.y - topo], 0.48);
  }
  if (tampo) {
    const [fx, fy] = fonte?.tampo || [sx, sy];
    noChao(ctx, o, (c) => c.drawImage(art, fx, fy, T, T, sx, sy, T, T), topo);
  }
}

function face(ctx, art, sx, sy, sw, sh, m, sombra) {
  ctx.save();
  ctx.transform(...m);
  ctx.drawImage(art, sx, sy, sw, sh, 0, 0, sw, sh);
  ctx.fillStyle = `rgba(8,10,24,${sombra})`;
  ctx.fillRect(0, 0, sw, sh);
  ctx.restore();
}

/** Os tiles que aparecem na tela, JÁ na ordem de desenho: de trás pra frente
 *  (profundidade d = x + y crescendo). Devolve [{ d, x, y }]. */
export function tilesVisiveis(o, W, H, T, w, h) {
  const out = [];
  const meio = T / 2;
  // tela → mapa: u - v = (X - o.x) / T, u + v = (Y - o.y) / meio
  const dMin = Math.floor((0 - o.y - T) / meio) - 1;          // a água desce um pouco
  const dMax = Math.ceil((H + MAX_TOPO - o.y) / meio) + 1;    // coluna alta aparece de baixo
  const eMin = Math.floor((0 - o.x) / T) - 2;
  const eMax = Math.ceil((W - o.x) / T) + 2;
  for (let d = Math.max(0, dMin); d <= Math.min(w + h - 2, dMax); d++) {
    for (let e = eMin; e <= eMax; e++) {
      if (((d + e) & 1) !== 0) continue;
      const x = (d + e) / 2, y = (d - e) / 2;
      if (x < 0 || y < 0 || x >= w || y >= h) continue;
      out.push({ d, x, y });
    }
  }
  return out;
}

// ------------------------------------------------------------ os bonecos
//
// No isométrico cada direção do mapa vira uma DIAGONAL na tela: andar pra
// baixo desce pra esquerda (↙), pra direita desce pra direita (↘), pra cima
// sobe pra direita (↗) e pra esquerda sobe pra esquerda (↖). Então quem anda
// não pode mais olhar reto pra câmera nem de perfil: olha na diagonal.
//
// Os sprites de BATALHA dos Pokémon já são desenhados em 3/4 — a frente olha
// pra baixo e pra esquerda (pro seu Pokémon), as costas olham pra cima e pra
// direita (pro adversário). São exatamente duas das quatro diagonais; as
// outras duas são as mesmas espelhadas. Os bonecos (herói, NPCs, o dono) usam
// a mesma regra com os quadros de frente e de costas deles.

/** De frente ou de costas, e espelhado ou não, pra cada direção do mapa. */
export function vistaIso(dir) {
  return {
    costas: dir === "up" || dir === "left",      // ↗ ↖: indo pra longe da câmera
    espelha: dir === "right" || dir === "left",  // ↘ ↖: o lado contrário do desenho
  };
}

const espelhos = new WeakMap();
/** A imagem virada de lado (guardada: cada sprite é espelhado uma vez só). */
export function espelhar(img) {
  if (!img) return img;
  let out = espelhos.get(img);
  if (out) return out;
  const cv = document.createElement("canvas");
  cv.width = img.width; cv.height = img.height;
  const c = cv.getContext("2d");
  c.imageSmoothingEnabled = false;
  c.translate(img.width, 0); c.scale(-1, 1); c.drawImage(img, 0, 0);
  espelhos.set(img, cv);
  return cv;
}

/** A sombra no chão, em losango achatado como o tile: é ela que põe o boneco
 *  EM CIMA do chão girado, em vez de colado na tela por cima dele. */
export function sombra(ctx, x, y, raio = 7) {
  ctx.fillStyle = "rgba(0,0,0,.26)";
  ctx.beginPath();
  ctx.ellipse(Math.round(x), Math.round(y), raio, raio / 2, 0, 0, Math.PI * 2);
  ctx.fill();
}

// A PLAQUINHA GROSSA. O boneco é desenhado numa tela à parte com a mesma
// inclinação (a matriz `m`), e na tela de verdade entram primeiro `n` cópias
// escurecidas dele, cada uma um pixel mais pra trás (na direção `dx`, `dy` por
// pixel de espessura), e por último ele mesmo, na frente. É o jeito de dar
// volume a um sprite qualquer (herói, NPC, Pokémon, o que for) sem precisar
// saber nada do desenho dele: a borda escura que sobra atrás é a lateral.
let folha = null, folhaEscura = null;
function folhas(w, h) {
  if (!folha || folha.width !== w || folha.height !== h) {
    folha = document.createElement("canvas");
    folhaEscura = document.createElement("canvas");
    folha.width = folhaEscura.width = w;
    folha.height = folhaEscura.height = h;
  }
  return [folha, folhaEscura];
}

export function comEspessura(ctx, m, desenhar, dx, dy, n) {
  const W = ctx.canvas.width, H = ctx.canvas.height;
  const [f, e] = folhas(W, H);
  const c = f.getContext("2d");
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.clearRect(0, 0, W, H);
  c.imageSmoothingEnabled = false;
  c.setTransform(m);
  desenhar(c);
  c.setTransform(1, 0, 0, 1, 0, 0);

  // a lateral: o mesmo desenho, escurecido como as faces dos blocos
  const ce = e.getContext("2d");
  ce.globalCompositeOperation = "copy";
  ce.drawImage(f, 0, 0);
  ce.globalCompositeOperation = "source-atop";
  ce.fillStyle = "rgba(8,10,24,.5)";
  ce.fillRect(0, 0, W, H);
  ce.globalCompositeOperation = "source-over";

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  for (let i = n; i >= 1; i--) ctx.drawImage(e, Math.round(dx * i), dy * i);
  ctx.drawImage(f, 0, 0);
  ctx.restore();
}

// ------------------------------------------------------------ a batalha
//
// NA BATALHA o isométrico é o chão e as plataformas: o piso vira losangos até
// o horizonte e cada plataforma é um bloco de losango com as duas faces da
// frente escurecidas, como as colunas do mapa. Os Pokémon ficam como estão —
// os sprites de batalha já são desenhados em 3/4, que é justamente a vista de
// quina.

/** O piso de losangos entre `y0` (o horizonte) e `y1`, em duas cores. */
export function chaoDeBatalhaIso(ctx, W, y0, y1, [a, b]) {
  ctx.save();
  ctx.beginPath(); ctx.rect(-8, y0, W + 16, y1 - y0); ctx.clip();
  ctx.fillStyle = a;
  ctx.fillRect(-8, y0, W + 16, y1 - y0);
  ctx.fillStyle = b;
  const LW = 32, LH = 16;
  for (let y = y0 - LH, fila = 0; y < y1 + LH; y += LH / 2, fila++) {
    for (let x = -LW + (fila % 2) * (LW / 2); x < W + LW; x += LW) {
      if (((x / LW) | 0) % 2 === 0) continue;             // xadrez: um sim, um não
      ctx.beginPath();
      ctx.moveTo(x, y + LH / 2); ctx.lineTo(x + LW / 2, y); ctx.lineTo(x + LW, y + LH / 2); ctx.lineTo(x + LW / 2, y + LH);
      ctx.closePath(); ctx.fill();
    }
  }
  // o horizonte esmaece, senão o piso bate no céu como uma parede
  const n = ctx.createLinearGradient(0, y0, 0, y0 + 14);
  n.addColorStop(0, "rgba(255,255,255,.45)"); n.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = n;
  ctx.fillRect(-8, y0, W + 16, 14);
  ctx.restore();
}

/** Uma plataforma de batalha: losango de meia-largura `rx` centrado em (cx, cy),
 *  com `alta` pixels de espessura. */
export function plataformaIso(ctx, cx, cy, rx, cor, alta = 6) {
  const ry = rx / 2;
  const poli = (pts, fill) => {
    ctx.fillStyle = fill;
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath(); ctx.fill();
  };
  const esq = [[cx - rx, cy], [cx, cy + ry], [cx, cy + ry + alta], [cx - rx, cy + alta]];
  const dir = [[cx, cy + ry], [cx + rx, cy], [cx + rx, cy + alta], [cx, cy + ry + alta]];
  poli(esq, cor); poli(esq, "rgba(8,10,24,.28)");
  poli(dir, cor); poli(dir, "rgba(8,10,24,.48)");
  poli([[cx - rx, cy], [cx, cy - ry], [cx + rx, cy], [cx, cy + ry]], cor);
  // a borda de dentro, mais clara: é ela que faz o tampo ler como tampo
  ctx.strokeStyle = "rgba(255,255,255,.35)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - rx + 6, cy); ctx.lineTo(cx, cy - ry + 3); ctx.lineTo(cx + rx - 6, cy); ctx.lineTo(cx, cy + ry - 3);
  ctx.closePath(); ctx.stroke();
}

/** UM SPRITE EM PÉ NO ISOMÉTRICO fora do mapa (os Pokémon da batalha): a mesma
 *  plaquinha grossa dos bonecos — no plano da face sul, inclinada em volta dos
 *  PÉS (o meio de baixo do retângulo), com `n` pixels de espessura pra trás.
 *  Os de batalha olham ↙ (frente) e ↗ (costas), e as duas diagonais são as da
 *  face sul — então é sempre ela. */
export function emPeIso(ctx, img, x, y, w, h, n = 5) {
  const px = x + w / 2, py = y + h;
  const m = ctx.getTransform().translate(px, py)
    .multiply(new DOMMatrix([1, 0.5, 0, 1, 0, 0])).translate(-px, -py);
  comEspessura(ctx, m, (c) => c.drawImage(img, x, y, w, h), 1, -0.5, n);
}
