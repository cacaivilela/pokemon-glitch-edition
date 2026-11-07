// O CARDUME (ideia do CAIO): no fundo do mar, um cardume de MAGIKARP não é uma
// horda — ele vira UM MAGIKARP GIGANTE e mais monstruoso, feito de MINI
// MAGIKARPS. Na batalha ele é um Pokémon só, com muito HP, e vai encolhendo
// conforme apanha (os peixinhos se espalham). Pego, sobra UM peixe na bola.
//
// A espécie do cardume (`cardume-<espécie>`) é montada na hora, como a fusão
// (src/systems/fusao.js): o id carrega a espécie de origem, então ela nunca
// precisa ir pro save — e nem vai: pego, o Pokémon volta a ser a espécie normal.
import { DB } from "../data/index.js";

const PREFIXO = "cardume-";
export const idCardume = (base) => PREFIXO + base;
export const baseDoCardume = (id) => (String(id).startsWith(PREFIXO) ? String(id).slice(PREFIXO.length) : null);

/** quanto cada atributo cresce no cardume (HP é o que mais: são dezenas de peixes) */
const GANHO = { hp: 2.6, atk: 1.35, def: 1.25, spa: 1.35, spd: 1.25, spe: 0.9 };

/** "CARDUME" + o fim do nome: MAGIKARP -> CARDUKARP, TENTACOOL -> CARDUCOOL */
function nomeDoCardume(nome) {
  const n = String(nome).toUpperCase().replace(/[^A-ZÀ-Ú]/g, "");
  const v = "AEIOUÁÂÃÉÊÍÓÔÕÚ";
  let i = n.length - 1;
  while (i > 0 && !v.includes(n[i])) i--;
  while (i > 0 && v.includes(n[i])) i--;
  while (i > 0 && !v.includes(n[i])) i--;
  const fim = n.slice(Math.max(1, i + 1));
  return ("CARDU" + (fim.length >= 3 ? fim : n.slice(-4))).slice(0, 11);
}

/** Garante a espécie do cardume de `base` em DB.SPECIES e devolve ela. */
export function garantirCardume(base) {
  const id = idCardume(base);
  if (DB.SPECIES[id]) return DB.SPECIES[id];
  const sp = DB.SPECIES[base];
  if (!sp) return null;
  const st = {};
  for (const [k, v] of Object.entries(sp.base)) st[k] = Math.min(255, Math.round(v * (GANHO[k] || 1)));
  DB.SPECIES[id] = {
    ...sp, id, dex: 0, name: nomeDoCardume(sp.name), base: st,
    bst: Object.values(st).reduce((a, b) => a + b, 0),
    catchRate: Math.max(3, Math.round((sp.catchRate || 45) * 0.6)),
    xpYield: Math.round((sp.xpYield || 60) * 2.2),
    cardume: base, lore: true,
    dexText: `UM CARDUME DE ${sp.name} NADANDO TÃO JUNTO QUE VIROU UM ${sp.name} SÓ — GIGANTE, E BRAVO.`,
  };
  return DB.SPECIES[id];
}

// ------------------------------------------------------------ o desenho
// O desenho do bicho grande vira a FORMA: ele é escurecido (a sombra do
// cardume, com os olhos dele ainda lá) e por cima vão dezenas de mini cópias,
// de lados e tamanhos diferentes, até cobrir quase tudo. Na beirada alguns
// mini escapam pra fora — é isso que dá o jeito de monstro, eriçado.
const cache = new Map();
const idImg = (img) => img.__id || (img.__id = Math.random().toString(36).slice(2));

export function spriteDoCardume(img, semente = 7) {
  if (!img) return null;
  const chave = idImg(img) + "|" + semente;
  if (cache.has(chave)) return cache.get(chave);
  const N = 96;
  const tela = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; const x = c.getContext("2d"); x.imageSmoothingEnabled = false; return [c, x]; };
  // a forma, no tamanho do quadro
  const [fc, fx] = tela(N, N);
  fx.drawImage(img, 0, 0, N, N);
  const forma = fx.getImageData(0, 0, N, N);
  const cheio = (x, y) => x >= 0 && y >= 0 && x < N && y < N && forma.data[(y * N + x) * 4 + 3] > 60;
  // 1) a sombra: o bicho grande, escuro e puxado pro vermelho
  const [out, ox] = tela(N, N);
  ox.drawImage(fc, 0, 0);
  ox.globalCompositeOperation = "source-atop";
  ox.fillStyle = "rgba(40,0,20,0.62)";
  ox.fillRect(0, 0, N, N);
  ox.globalCompositeOperation = "source-over";
  // 2) os mini: pontos dentro da forma, em grade torta; cada um com tamanho
  //    e lado sorteados (mas sempre os mesmos pra mesma semente)
  let s = semente * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const mini = [];
  for (let y = 4; y < N; y += 9) {
    for (let x = 4; x < N; x += 9) {
      const px = x + Math.round((rnd() - 0.5) * 6), py = y + Math.round((rnd() - 0.5) * 6);
      if (!cheio(px, py)) continue;
      mini.push({ x: px, y: py, t: 11 + Math.round(rnd() * 7), vira: rnd() < 0.5 });
    }
  }
  // na beirada, alguns escapando pra fora: o eriçado
  for (let k = 0; k < 14; k++) {
    const a = rnd() * Math.PI * 2;
    let x = N / 2, y = N / 2;
    for (let r = 0; r < N / 2; r++) {
      const nx = Math.round(N / 2 + Math.cos(a) * r), ny = Math.round(N / 2 + Math.sin(a) * r);
      if (cheio(nx, ny)) { x = nx; y = ny; }
    }
    mini.push({ x: x + Math.round(Math.cos(a) * 5), y: y + Math.round(Math.sin(a) * 5), t: 9 + Math.round(rnd() * 4), vira: rnd() < 0.5 });
  }
  // de trás pra frente: os de baixo da tela por cima (dá volume)
  mini.sort((a, b) => a.y - b.y);
  for (const m of mini) {
    ox.save();
    ox.translate(m.x, m.y);
    if (m.vira) ox.scale(-1, 1);
    ox.drawImage(img, -m.t / 2, -m.t / 2, m.t, m.t);
    ox.restore();
  }
  // 3) os olhos do monstro: dois pontos vermelhos acesos, perto do topo da forma
  let topo = N, esq = N, dir = 0;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (cheio(x, y)) { topo = Math.min(topo, y); esq = Math.min(esq, x); dir = Math.max(dir, x); }
  const oy = topo + Math.round((N - topo) * 0.22), meio = (esq + dir) / 2, abre = Math.max(5, (dir - esq) * 0.14);
  for (const lx of [meio - abre, meio + abre]) {
    if (!cheio(Math.round(lx), oy)) continue;
    ox.fillStyle = "#2a0000"; ox.fillRect(Math.round(lx) - 3, oy - 2, 6, 5);
    ox.fillStyle = "#ff2a2a"; ox.fillRect(Math.round(lx) - 2, oy - 1, 4, 3);
    ox.fillStyle = "#ffd0a0"; ox.fillRect(Math.round(lx) - 1, oy - 1, 1, 1);
  }
  if (cache.size > 40) cache.clear();
  cache.set(chave, out);
  return out;
}

/** O tamanho do cardume na batalha: grande cheio, encolhendo com o HP */
export const escalaDoCardume = (mon) => {
  const k = mon?.maxHp ? Math.max(0, mon.hp / mon.maxHp) : 1;
  return 0.55 + 1.0 * k;           // cheio 1,55x; quase sem HP, um pouco mais da metade
};
