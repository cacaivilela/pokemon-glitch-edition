// OS BIZARROS DO PORTAL PARADOXO (ideia do CAIO): quando as quatro runas não
// batem com nenhuma receita (src/data/portal-paradoxo.js), o portal não
// devolve os itens — ele CUSPE UM POKÉMON BIZARRO: nome esquisito, desenho
// aleatório, tipos e golpes sorteados. Às vezes ele PUXA O DESENHO de um
// Pokémon de verdade e mantém o formato, só que com o miolo todo bagunçado.
//
// CADA VEZ SAI UM DIFERENTE (o CAIO pediu: nome, tipos e desenho aleatórios):
// a semente é sorteada na hora em que o portal cospe, e o id carrega ela
// (`bizarro-<semente>`). Por isso ele pode ir pro save sem guardar desenho
// nenhum: o id basta pra montar o mesmo bicho de novo (src/systems/fusao.js,
// `registrarDoEstado`, chama `garantirBizarro`).
import { DB } from "../data/index.js";

const PREFIXO = "bizarro-";
export const ehBizarro = (id) => String(id || "").startsWith(PREFIXO);
export const idBizarro = (semente) => PREFIXO + (semente >>> 0).toString(36);
const sementeDe = (id) => parseInt(String(id).slice(PREFIXO.length), 36) >>> 0;

/** a semente de uma combinação de runas ("doce+fruit+poke+unown") */
export function sementeDasRunas(chave) {
  let h = 2166136261;
  for (const c of String(chave)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

function sorteio(semente) {
  let s = semente || 1;
  const r = () => ((s = (Math.imul(s, 1103515245) + 12345) >>> 0) / 4294967296);
  r.int = (n) => Math.floor(r() * n);
  r.pick = (lista) => lista[r.int(lista.length)];
  return r;
}

// O NOME: sílabas que não combinam, às vezes letra dobrada, às vezes um
// pedaço quebrado (? ou um número) — como um nome que o jogo leu errado
const INICIO = ["ZR", "KW", "GL", "PL", "BRR", "X", "VR", "SN", "FL", "GW", "TR", "MW", "Q", "DR", "SKR", "NG", "PF", "THR", "BL", "ZZ"];
const MEIO = ["O", "U", "A", "I", "E", "OO", "UI", "AE", "Y", "AU", "IU", "EO"];
const FIM = ["MPH", "BBO", "NK", "RG", "LL", "X", "TCH", "ZZ", "MB", "PT", "GG", "RF", "SH", "NN", "DD", "K", "LP", "ST"];
const TIPOS = ["NORMAL", "FOGO", "ÁGUA", "PLANTA", "ELÉTRICO", "GELO", "LUTADOR", "VENENO", "TERRA", "VOADOR",
  "PSÍQUICO", "INSETO", "PEDRA", "FANTASMA", "DRAGÃO", "SOMBRIO", "AÇO", "FADA", "GLITCH"];

function nomeBizarro(r) {
  let n = r.pick(INICIO) + r.pick(MEIO) + r.pick(FIM);
  if (r() < 0.5) n += r.pick(MEIO) + r.pick(FIM).slice(0, 2);
  if (r() < 0.25) n = n.replace(/[AEIOU]/, (v) => v + v);
  if (r() < 0.2) n += r.pick(["?", "!", "0", "7", "_"]);
  return n.slice(0, 11);
}

/** Garante a espécie do bizarro `id` em DB.SPECIES (montada da semente) */
export function garantirBizarro(id) {
  if (!ehBizarro(id)) return null;
  if (DB.SPECIES[id]) return DB.SPECIES[id];
  const r = sorteio(sementeDe(id));
  const name = nomeBizarro(r);
  const t1 = r.pick(TIPOS);
  let t2 = r() < 0.6 ? r.pick(TIPOS) : null;
  if (t2 === t1) t2 = null;
  const types = t2 ? [t1, t2] : [t1];
  // os atributos: um total entre 380 e 600, espalhado de qualquer jeito
  const total = 380 + r.int(220), pesos = Array.from({ length: 6 }, () => 0.4 + r());
  const soma = pesos.reduce((a, b) => a + b, 0);
  const [hp, atk, def, spa, spd, spe] = pesos.map((p) => Math.max(20, Math.min(200, Math.round((p / soma) * total))));
  // os golpes: dos tipos dele, e um ou outro de qualquer tipo
  const golpes = Object.entries(DB.MOVES || {}).filter(([k, m]) => m.power && !/^z/.test(k));
  const meus = golpes.filter(([, m]) => types.includes(m.type));
  const learnset = [];
  for (let i = 0; i < 8; i++) {
    const fonte = meus.length && r() < 0.75 ? meus : golpes;
    const [mid] = r.pick(fonte);
    if (!learnset.some(([, x]) => x === mid)) learnset.push([1 + i * 9, mid]);
  }
  // o desenho: às vezes um Pokémon de verdade como forma (só o formato)
  // (só os de verdade, dos jogos: nada de forma especial, -BRAG, pura, mega...)
  const comuns = Object.values(DB.SPECIES).filter((s) => s.dex > 0 && s.dex <= 386 && !s.fusao && !s.mega && !s.vinculo
    && !s.foreign && !s.spriteUrl && !s.unicaDe && /^[a-z]+$/.test(s.id) && !/(brag|puro|alola|glitch)$/.test(s.id));
  // é RARO puxar um Pokémon de verdade (1 em 10): o normal é o desenho do zero
  const base = r() < 0.1 && comuns.length ? r.pick(comuns).id : null;
  DB.SPECIES[id] = {
    id, dex: 0, name, types, base: { hp, atk, def, spa, spd, spe }, bst: hp + atk + def + spa + spd + spe,
    catchRate: 30 + r.int(120), xpYield: 120 + r.int(120), learnset, lore: true, foreign: true,
    bizarro: { semente: sementeDe(id), base },
    dexText: r.pick([
      "O PORTAL NÃO SABIA O QUE FAZER COM AQUELAS RUNAS, ENTÃO FEZ ISTO.",
      "NINGUÉM SABE PRA QUE LADO É A FRENTE DELE. NEM ELE.",
      "OS PESQUISADORES TENTARAM DESENHAR ELE TRÊS VEZES. AS TRÊS SAÍRAM DIFERENTES.",
      "ELE TEM O CHEIRO DE UMA COR QUE NÃO EXISTE.",
      "SE VOCÊ FALAR O NOME DELE DE TRÁS PRA FRENTE, ELE VEM. DE FRENTE PRA TRÁS, ELE FOGE.",
    ]),
  };
  return DB.SPECIES[id];
}

// ------------------------------------------------------------ o desenho
const cache = new Map();
const idImg = (img) => img ? (img.__id || (img.__id = Math.random().toString(36).slice(2))) : "nada";

/** O sprite (96x96) do bizarro. `baseImg`: o desenho do Pokémon de verdade
 *  que ele usa de forma (ou null pros feitos do zero). */
export function spriteDoBizarro(sp, baseImg) {
  const chave = sp.id + "|" + idImg(baseImg);
  if (cache.has(chave)) return cache.get(chave);
  const r = sorteio(sp.bizarro.semente * 7 + 3);
  const N = 96;
  const cv = document.createElement("canvas");
  cv.width = cv.height = N;
  const ctx = cv.getContext("2d");
  const img = ctx.createImageData(N, N), d = img.data;
  // AS CORES: 100% aleatórias (qualquer uma, cada bloco de 3x3 a sua) — ou,
  // quando ele puxa um Pokémon de verdade, as cores DAQUELE Pokémon, embaralhadas
  const cor = () => [r.int(256), r.int(256), r.int(256)];
  let pal = null;
  const escura = [r.int(50), r.int(40), r.int(60)];
  const cheio = new Uint8Array(N * N);
  let orig = null;
  if (baseImg) {
    // A FORMA DE UM POKÉMON DE VERDADE: o formato dele fica (e o contorno
    // escuro dele também); o miolo vira bloquinhos com as cores dele, embaralhadas
    const c2 = document.createElement("canvas");
    c2.width = c2.height = N;
    const x2 = c2.getContext("2d");
    x2.imageSmoothingEnabled = false;
    x2.drawImage(baseImg, 0, 0, N, N);
    orig = x2.getImageData(0, 0, N, N).data;
    const vistas = new Map();
    for (let i = 0; i < N * N; i++) {
      cheio[i] = orig[i * 4 + 3] > 60 ? 1 : 0;
      const luz = 0.299 * orig[i * 4] + 0.587 * orig[i * 4 + 1] + 0.114 * orig[i * 4 + 2];
      if (cheio[i] && luz >= 46) vistas.set(`${orig[i * 4]},${orig[i * 4 + 1]},${orig[i * 4 + 2]}`, [orig[i * 4], orig[i * 4 + 1], orig[i * 4 + 2]]);
    }
    pal = [...vistas.values()];
  } else {
    // FEITO DO ZERO: NADA É FIXO. O tamanho (de um bichinho a um que enche o
    // quadro), a largura e a altura, o tamanho do quadradinho (1 a 4 pixels),
    // se é simétrico ou torto, quão cheio — tudo sorteado. A forma nasce de
    // pontos jogados e de "braços" saindo deles, e o alisamento junta o pó.
    const B = 1 + r.int(4);                                  // o tamanho do quadradinho
    // largura e altura entre 30 e 84 pixels, e nunca achatado demais (no
    // máximo o dobro de um no outro): achatado demais vira "terra no chão"
    const larg = 30 + r.int(55);
    const alt = Math.max(Math.round(larg / 2), Math.min(Math.round(larg * 2), 30 + r.int(55)), 30);
    const L = Math.max(6, Math.floor(larg / B)), A = Math.max(6, Math.floor(Math.min(84, alt) / B));
    const simetrico = r() < 0.5;
    const x0 = Math.floor((N - L * B) / 2), y0 = N - 4 - A * B;
    let g = Array.from({ length: A }, () => new Array(L).fill(0));
    // alguns núcleos, e de cada um saem braços tortos em qualquer direção
    const nucleos = 1 + r.int(5);
    for (let k = 0; k < nucleos; k++) {
      // o primeiro é o CORPO: no meio e grande; os outros, em qualquer lugar
      let cx = k ? r.int(L) : L / 2 + (r() - 0.5) * L * 0.2, cy = k ? r.int(A) : A / 2 + (r() - 0.5) * A * 0.2;
      const raio = k ? 1 + r.int(Math.max(2, Math.min(L, A) / 3)) : Math.max(3, Math.min(L, A) * (0.32 + r() * 0.12));
      for (let y = 0; y < A; y++) for (let x = 0; x < L; x++) if (Math.hypot(x - cx, y - cy) <= raio * (0.6 + r() * 0.6)) g[y][x] = 1;
      const bracos = r.int(5);
      for (let b2 = 0; b2 < bracos; b2++) {
        let x = cx, y = cy, ang = r() * Math.PI * 2;
        for (let passo = 0, n = 3 + r.int(Math.max(L, A)); passo < n; passo++) {
          ang += (r() - 0.5) * 1.2;
          x += Math.cos(ang); y += Math.sin(ang);
          const xi = Math.round(x), yi = Math.round(y);
          if (xi < 0 || yi < 0 || xi >= L || yi >= A) break;
          g[yi][xi] = 1;
          if (r() < 0.4 && xi + 1 < L) g[yi][xi + 1] = 1;
        }
      }
    }
    // furos e pó, de vez em quando
    const poeira = r() * 0.08;
    for (let y = 0; y < A; y++) for (let x = 0; x < L; x++) if (r() < poeira) g[y][x] ^= 1;
    if (simetrico) for (let y = 0; y < A; y++) for (let x = 0; x < L / 2; x++) g[y][L - 1 - x] = g[y][x];
    // alisar (às vezes nada, às vezes duas vezes)
    const vizinhos = (G, x, y) => {
      let n = 0;
      for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) if ((i || j) && G[y + j]?.[x + i]) n++;
      return n;
    };
    for (let k = r.int(3); k > 0; k--) g = g.map((linha, y) => linha.map((c, x) => (vizinhos(g, x, y) >= 5 ? 1 : vizinhos(g, x, y) <= 1 ? 0 : c)));
    // SÓ O PEDAÇO MAIOR fica (o corpo e o que está grudado nele): nada de pó voando em volta
    const marca = Array.from({ length: A }, () => new Array(L).fill(0));
    let maior = null;
    for (let y = 0; y < A; y++) for (let x = 0; x < L; x++) {
      if (!g[y][x] || marca[y][x]) continue;
      const pedaco = [], fila = [[x, y]];
      marca[y][x] = 1;
      while (fila.length) {
        const [px, py] = fila.pop();
        pedaco.push([px, py]);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = px + dx, ny = py + dy;
          if (nx >= 0 && ny >= 0 && nx < L && ny < A && g[ny][nx] && !marca[ny][nx]) { marca[ny][nx] = 1; fila.push([nx, ny]); }
        }
      }
      if (!maior || pedaco.length > maior.length) maior = pedaco;
    }
    g = Array.from({ length: A }, () => new Array(L).fill(0));
    for (const [x, y] of maior || []) g[y][x] = 1;
    for (let by = 0; by < A; by++) {
      for (let bx = 0; bx < L; bx++) {
        if (!g[by][bx]) continue;
        for (let j = 0; j < B; j++) for (let i = 0; i < B; i++) {
          const yy = y0 + by * B + j, xx = x0 + bx * B + i;
          if (yy >= 0 && yy < N && xx >= 0 && xx < N) cheio[yy * N + xx] = 1;
        }
      }
    }
  }
  // o contorno escuro: às vezes tem, às vezes não
  const comContorno = !!orig || r() < 0.6;
  // o tamanho do bloco de cor: 1 a 4 pixels (no puxado, o de sempre: 3)
  const BC = orig ? 3 : 1 + r.int(4);
  // um bloco = uma cor só (sorteada uma vez por bloco)
  const blocos = new Map();
  const corDoBloco = (x, y) => {
    const k = ((y / BC) | 0) * 128 + ((x / BC) | 0);
    if (!blocos.has(k)) blocos.set(k, pal?.length ? r.pick(pal) : cor());
    return blocos.get(k);
  };
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const i = y * N + x;
      if (!cheio[i]) continue;
      let c;
      if (orig) {
        // o contorno escuro do Pokémon fica onde estava
        const luz = 0.299 * orig[i * 4] + 0.587 * orig[i * 4 + 1] + 0.114 * orig[i * 4 + 2];
        c = luz < 46 ? [orig[i * 4], orig[i * 4 + 1], orig[i * 4 + 2]] : corDoBloco(x, y);
      } else {
        const borda = !cheio[i - 1] || !cheio[i + 1] || !cheio[i - N] || !cheio[i + N];
        c = borda && comContorno ? escura : corDoBloco(x, y);
      }
      d[i * 4] = c[0]; d[i * 4 + 1] = c[1]; d[i * 4 + 2] = c[2]; d[i * 4 + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  if (cache.size > 60) cache.clear();
  cache.set(chave, cv);
  return cv;
}
