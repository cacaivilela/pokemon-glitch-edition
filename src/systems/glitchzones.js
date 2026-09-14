// AS GLITCH ZONES, por dentro. As tabelas e os textos estão em
// src/data/glitchzones.js.
//
// O mapa da zona NÃO existe em arquivo nenhum: ele é um mapa de Kanto sorteado
// e passado por um EMBARALHADOR de tiles, com a arte fatiada do PNG daquele mapa
// na mesma ordem trocada. Tudo sai da SEMENTE guardada no save, então fechar o
// jogo e abrir de novo devolve o mesmo lugar quebrado — e o live update, que
// reconstrói o DB do zero, também (ver garantirZona).
import { DB } from "../data/index.js";
import { makeRng } from "../core/rng.js";
import { makeCanvas, TILE } from "../core/assets.js";
import { SpriteStore, loadImage } from "../core/sprites.js";
import { url } from "../core/base.js";

/** o id do mapa da zona. É um só: existe no máximo uma zona por save. */
export const ZONA = "glitchzone";

const cfg = () => DB.GLITCH_ZONES || {};
const T = () => DB.TAG || { FREE: 0, BLOCK: 1, GRASS: 2, WATER: 3 };

/** As portas só existem depois que a fenda foi aberta: é dali que vaza. */
export const zonasAbertas = (st) => !!(st?.flags?.dimUnlocked || st?.flags?.glitchWorld);

/** As entradas que estão neste mapa (nenhuma, quando ainda não abriram). */
export function entradasDoMapa(st, mapa) {
  if (!zonasAbertas(st)) return [];
  return (cfg().entradas || []).filter((e) => e.mapa === mapa);
}

export const entradaEm = (st, mapa, x, y) =>
  entradasDoMapa(st, mapa).find((e) => e.x === x && e.y === y) || null;

/** Você está dentro de uma? */
export const naZona = (st) => !!st?.zona && st.player?.map === ZONA;

/** Os mapas que podem servir de fonte: de fora, grandes o bastante, com PNG.
 *  Montado uma vez — a lista não muda em jogo. */
let fontes = null;
export function mapasPossiveis() {
  if (fontes) return fontes;
  const fora = new Set(cfg().fora || []);
  const minimo = cfg().minimo ?? 0;
  fontes = Object.entries(DB.KANTO || {})
    .filter(([id, geo]) => {
      if (fora.has(id) || id === ZONA || !geo?.tags) return false;
      if (DB.MAPS?.[id]?.interior) return false;
      if ((DB.ERAS || []).some((e) => e.mapa === id)) return false;
      return geo.w * geo.h >= minimo;
    })
    .map(([id]) => id);
  return fontes;
}

// ------------------------------------------------------------ o embaralhador
/** A permutação: `perm[destino] = origem`, sobre os índices do mapa fonte.
 *  Primeiro os PEDAÇOS (blocos de `bloco` x `bloco`) trocam de lugar entre si;
 *  depois uma fração de tiles SOLTOS troca um a um por cima. Só depende da
 *  semente — é isso que faz a zona sobreviver a fechar o jogo. */
export function permutar(w, h, seed, bloco = 3, soltos = 0.12) {
  const r = makeRng(seed);
  const perm = new Int32Array(w * h);
  for (let i = 0; i < perm.length; i++) perm[i] = i;
  // só blocos inteiros trocam; a beirada que sobra fica onde está.
  // bloco 0 é "nenhum": a oficina começa do mapa inteiro e troca na mão.
  const blocos = [];
  for (let by = 0; bloco > 0 && by + bloco <= h; by += bloco) {
    for (let bx = 0; bx + bloco <= w; bx += bloco) blocos.push([bx, by]);
  }
  const ordem = blocos.slice();
  for (let i = ordem.length - 1; i > 0; i--) {         // Fisher-Yates
    const j = r.int(i + 1);
    [ordem[i], ordem[j]] = [ordem[j], ordem[i]];
  }
  blocos.forEach(([dx, dy], k) => {
    const [sx, sy] = ordem[k];
    for (let y = 0; y < bloco; y++) {
      for (let x = 0; x < bloco; x++) perm[(dy + y) * w + dx + x] = (sy + y) * w + sx + x;
    }
  });
  const trocas = Math.round(w * h * soltos);
  for (let i = 0; i < trocas; i++) {
    const a = r.int(perm.length), b = r.int(perm.length);
    const t = perm[a]; perm[a] = perm[b]; perm[b] = t;
  }
  return perm;
}

/** O nome da faixa: o da fonte, com as letras que o glitch costuma comer.
 *  A troca é por semente, então o mesmo lugar tem sempre o mesmo nome torto. */
export function nomeCorrompido(nome, seed) {
  const r = makeRng(seed ^ 0x5bd1e995);
  const troca = { A: "4", E: "3", I: "1", O: "0", S: "5", T: "7", B: "8", G: "6" };
  let out = "";
  for (const ch of nome) out += troca[ch] && r.chance(0.55) ? troca[ch] : ch;
  return out;
}

/** A geometria da zona, no formato de DB.KANTO, e o conteúdo dela no formato
 *  de DB.MAPS. Sem portas, sem conexões, sem placas: nada aqui leva a lugar
 *  nenhum — o único jeito de sair é o vão, o VOAR ou a parede ceder. */
export function montarZona(z) {
  const fonte = DB.KANTO?.[z.fonte];
  if (!fonte) return null;
  const { w, h } = fonte;
  // uma zona PERSONALIZADA traz o tamanho dos pedaços, a pimenta e o nome
  // dentro dela (ver codigoDaZona); a sorteada usa os números da tabela
  const perm = permutar(w, h, z.seed, z.bloco ?? cfg().bloco ?? 3, z.soltos ?? cfg().soltos ?? 0.12);
  // ...e por cima, as TROCAS FEITAS NA MÃO na oficina: cada uma é um par de
  // posições que trocam de tile. Continua sendo uma permutação: os mesmos
  // tiles da fonte, só em outra ordem — é isso que faz o lugar ser GLITCH
  // CITY e não um mapa desenhado.
  for (const [a, b] of z.trocas || []) {
    if (a >= 0 && b >= 0 && a < perm.length && b < perm.length) { const t = perm[a]; perm[a] = perm[b]; perm[b] = t; }
  }
  let tags = "";
  for (let i = 0; i < perm.length; i++) tags += fonte.tags[perm[i]];
  const nome = DB.MAPS?.[z.fonte]?.name || z.fonte.toUpperCase();
  const geo = { w, h, tags, perm, seed: z.seed, fonte: z.fonte, codigo: codigoDaZona(z),
                warps: [], connections: [], signs: [], objects: [] };
  const mapa = {
    name: z.nome || nomeCorrompido(nome, z.seed), music: "glitchdim", interior: false, npcs: [],
    // os bichos são os da fonte: o lugar está fora de ordem, os moradores não
    encounters: DB.MAPS?.[z.fonte]?.encounters || [],
    lockedWarps: {}, signs: {}, spawn: { x: z.x, y: z.y, dir: "down" },
  };
  return { geo, mapa };
}

/** Um tile onde dá pra ficar de pé (chão ou mato) — SÓ o tile, sem olhar os
 *  vizinhos. É de propósito: nascer cercado é o susto da GLITCH CITY. */
function tileDePe(geo, r) {
  const t = T();
  const bons = [];
  for (let i = 0; i < geo.tags.length; i++) {
    const v = geo.tags.charCodeAt(i) - 48;
    if (v === t.FREE || v === t.GRASS) bons.push(i);
  }
  if (!bons.length) return { x: 0, y: 0 };
  const i = bons[r.int(bons.length)];
  return { x: i % geo.w, y: Math.floor(i / geo.w) };
}

/** Quantos tiles dá pra alcançar a pé daqui (até `teto`). Barranco e água
 *  contam como parede: quem está preso não tem como surfar pra fora. */
export function alcance(geo, x0, y0, teto = 64) {
  const t = T();
  const anda = (x, y) => {
    if (x < 0 || y < 0 || x >= geo.w || y >= geo.h) return false;
    const v = geo.tags.charCodeAt(y * geo.w + x) - 48;
    return v === t.FREE || v === t.GRASS;
  };
  const visto = new Set([`${x0},${y0}`]);
  const fila = [[x0, y0]];
  while (fila.length && visto.size < teto) {
    const [x, y] = fila.shift();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const k = `${x + dx},${y + dy}`;
      if (visto.has(k) || !anda(x + dx, y + dy)) continue;
      visto.add(k); fila.push([x + dx, y + dy]);
    }
  }
  return visto.size;
}

/** Instala (ou reinstala) a zona do save no DB. Devolve a geometria. */
export function garantirZona(st) {
  const z = st?.zona;
  if (!z) return null;
  const atual = DB.KANTO?.[ZONA];
  if (atual && atual.codigo === codigoDaZona(z)) return atual;
  const feito = montarZona(z);
  if (!feito) return null;
  DB.KANTO[ZONA] = feito.geo;
  DB.MAPS[ZONA] = feito.mapa;
  // o `in` é o que impede mapArt() de sair procurando assets/maps/glitchzone.png
  if (!(ZONA in SpriteStore.maps) || SpriteStore.maps[ZONA]?.seed !== z.seed) {
    SpriteStore.maps[ZONA] = null;
    SpriteStore.maps[ZONA + "_over"] = null;
    prepararArte(z);
  }
  return feito.geo;
}

/** Abre uma zona nova a partir daquela entrada: sorteia a fonte, a semente e
 *  o tile onde você cai, e entra. Devolve `st.zona` (ou null). */
export function abrirZona(st, entrada) {
  const mapas = mapasPossiveis();
  if (!mapas.length) return null;
  const seed = (Math.random() * 0x7fffffff) | 0;
  const r = makeRng(seed ^ 0x9e3779b9);
  const fonte = mapas[r.int(mapas.length)];
  const feito = montarZona({ fonte, seed });
  if (!feito) return null;
  const cai = tileDePe(feito.geo, r);
  return entrarNaZona(st, { fonte, seed, x: cai.x, y: cai.y },
                      { map: entrada.mapa, x: entrada.x, y: entrada.y, dir: st.player.dir });
}

/** Põe aquela zona no save e no DB. `z` é o que a define (fonte, semente, o
 *  tile onde se cai e, se for personalizada, bloco/soltos/nome); `volta` é pra
 *  onde o vão devolve. O VÃO DE VOLTA é o tile em que você cai: você chegou
 *  por ele, e ele fica ali atrás de você — dê um passo pra fora e outro pra
 *  dentro. Nascer cercado continua sendo susto: sem um vizinho livre pra sair
 *  e voltar, a parede ainda precisa ceder. Devolve `st.zona` (ou null). */
export function entrarNaZona(st, z, volta) {
  const zona = { fonte: z.fonte, seed: z.seed, x: z.x, y: z.y, vao: { x: z.x, y: z.y },
                 cedidos: [], volta };
  for (const k of ["bloco", "soltos", "nome", "trocas"]) if (z[k] != null) zona[k] = z[k];
  st.zona = zona;
  delete DB.KANTO[ZONA];                 // força o garantirZona a montar esta
  return garantirZona(st) ? zona : (delete st.zona, null);
}

// ------------------------------------------------- zonas personalizadas
// Uma zona é POUCA COISA: fonte, semente, tamanho dos pedaços, pimenta, o tile
// onde se cai, as trocas feitas na mão e um nome. Cabe numa linha — e uma
// linha cabe num link. É assim que uma zona montada na oficina (glitchzone/)
// chega em outra pessoa: o código vai no `?area=` e o jogo dela remonta o
// MESMO lugar, tile por tile.
//
//   fonte.semente.bloco.soltos.x.y.trocas[.nome]
//   viridian.k7f2a1.0.0.26.22.1a-2b,3c-3d.OS FUNDOS
//
// A semente em base 36 (curta), a pimenta em por cento (inteira), as trocas
// como pares de índices em base 36 (`a-b`, separados por vírgula; vazio quando
// não teve), e o nome opcional por último — pode ter ponto dentro, o resto não.
export const NOME_MAX = 20;
export const TROCAS_MAX = 2000;

/** O código de uma zona (a do save serve direto). */
export function codigoDaZona(z) {
  const partes = [z.fonte, (z.seed >>> 0).toString(36), z.bloco ?? cfg().bloco ?? 3,
                  Math.round((z.soltos ?? cfg().soltos ?? 0.12) * 100), z.x, z.y,
                  (z.trocas || []).map(([a, b]) => a.toString(36) + "-" + b.toString(36)).join(",")];
  if (limparNome(z.nome)) partes.push(limparNome(z.nome));
  return partes.join(".");
}

/** O contrário: de um código pra `{fonte, seed, bloco, soltos, x, y, trocas,
 *  nome}`, conferido — fonte que existe e pode ser zona, números na faixa,
 *  trocas dentro do mapa, e o tile onde se cai é um em que dá pra ficar de pé
 *  NESSE embaralhado. Qualquer coisa errada devolve null: um link torto não
 *  pode derrubar o jogo. */
export function zonaDoCodigo(codigo) {
  const partes = String(codigo || "").trim().split(".");
  if (partes.length < 7) return null;
  const [fonte, s36, sb, ss, sx, sy, st] = partes;
  const nome = limparNome(partes.slice(7).join("."));
  const seed = parseInt(s36, 36), bloco = +sb, soltos = +ss / 100, x = +sx, y = +sy;
  if (!mapasPossiveis().includes(fonte)) return null;
  if (!(seed >= 0 && seed <= 0xffffffff) || !/^[0-9a-z]+$/.test(s36)) return null;
  if (!Number.isInteger(bloco) || bloco < 0 || bloco > 8) return null;
  if (!(soltos >= 0 && soltos <= 1) || !/^\d+$/.test(ss)) return null;
  if (!Number.isInteger(x) || !Number.isInteger(y)) return null;
  const geo = DB.KANTO[fonte], n = geo.w * geo.h;
  const trocas = [];
  for (const par of st ? st.split(",") : []) {
    const m = /^([0-9a-z]+)-([0-9a-z]+)$/.exec(par);
    if (!m) return null;
    const a = parseInt(m[1], 36), b = parseInt(m[2], 36);
    if (a >= n || b >= n) return null;
    trocas.push([a, b]);
  }
  if (trocas.length > TROCAS_MAX) return null;
  const z = { fonte, seed, bloco, soltos, x, y, trocas };
  if (nome) z.nome = nome;
  const feito = montarZona(z);
  if (!feito || !dePe(feito.geo, x, y)) return null;
  return z;
}

/** O nome como sai na faixa: maiúsculo, só com o que a fonte do jogo desenha
 *  (src/core/font.js — as letras, os acentos do português, pouca pontuação). */
export function limparNome(nome) {
  return String(nome || "").toUpperCase().replace(/[^A-Z0-9ÁÀÂÃÉÊÍÓÔÕÚÇ .,!?'\-]/g, "")
    .replace(/\s+/g, " ").trim().slice(0, NOME_MAX);
}

/** Dá pra ficar de pé naquele tile da geometria? */
export function dePe(geo, x, y) {
  if (!geo || x < 0 || y < 0 || x >= geo.w || y >= geo.h) return false;
  const v = geo.tags.charCodeAt(y * geo.w + x) - 48;
  return v === T().FREE || v === T().GRASS;
}

/** O vão de saída, no formato das entradas — pra desenhar e pra pisar. */
export const vaoDaZona = (st) => (naZona(st) && st.zona.vao) ? st.zona.vao : null;

/** Uma parede da zona que já cedeu vira chão (ver tagAt na cena). */
export const cedeu = (st, x, y) => !!st?.zona?.cedidos?.includes(`${x},${y}`);

/** Mais um esbarrão naquele tile. Devolve true quando ele cede. */
export function esbarrar(st, x, y) {
  const z = st?.zona;
  if (!z) return false;
  const k = `${x},${y}`;
  if (z.esbarro?.k !== k) z.esbarro = { k, n: 0 };
  z.esbarro.n++;
  if (z.esbarro.n < (cfg().esbarroes ?? 6)) return false;
  z.esbarro = null;
  (z.cedidos ||= []).push(k);
  return true;
}

// ---------------------------------------------------------------- a arte
/** Fatia o PNG da fonte na ordem da permutação, pro chão e pra camada de cima.
 *  Se o PNG não existir, sai ruído: o lugar continua andável, só não tem cara
 *  de lugar — que, numa zona glitch, ainda é uma cara. */
export function prepararArte(z) {
  const geo = DB.KANTO?.[ZONA];
  if (!geo || geo.seed !== z.seed) return;
  const monta = (img, camada) => {
    const { w, h, perm } = geo;
    const { cv, ctx } = makeCanvas(w * TILE, h * TILE);
    cv.seed = z.seed;
    const r = makeRng(z.seed + (camada ? 7 : 3));
    if (img) {
      for (let i = 0; i < perm.length; i++) {
        const s = perm[i];
        ctx.drawImage(img, (s % w) * TILE, Math.floor(s / w) * TILE, TILE, TILE,
                      (i % w) * TILE, Math.floor(i / w) * TILE, TILE, TILE);
      }
    } else if (!camada) {
      for (let i = 0; i < perm.length; i++) ctx.drawImage(tileRuido(geo.tags[i], r), (i % w) * TILE, Math.floor(i / w) * TILE);
    }
    if (!camada) {
      // e o acabamento: umas fatias deslocadas, como a fenda tem
      for (let i = 0; i < 40; i++) {
        const y = r.int(cv.height), hh = 1 + r.int(3);
        ctx.drawImage(cv, 0, y, cv.width, hh, r.int(10) - 5, y, cv.width, hh);
      }
    }
    return cv;
  };
  loadImage(url(`assets/maps/${z.fonte}.png`)).then((img) => {
    if (DB.KANTO?.[ZONA]?.seed !== z.seed) return;      // trocou de zona no meio
    SpriteStore.maps[ZONA] = monta(img, false);
  });
  loadImage(url(`assets/maps/${z.fonte}_over.png`)).then((img) => {
    if (DB.KANTO?.[ZONA]?.seed !== z.seed) return;
    SpriteStore.maps[ZONA + "_over"] = img ? monta(img, true) : null;
  });
}

const NEON = ["#b455ff", "#00ffcc", "#ff0066", "#ffffff"];

/** um tile de ruído, colorido pelo que ele É (parede escura, mato verde...) */
function tileRuido(tag, r) {
  const { cv, ctx } = makeCanvas(TILE, TILE);
  const pal = tag === "1" ? ["#0a0410", "#1a0d2a", "#2a1040"]
            : tag === "2" ? ["#06251f", "#0fa87c", "#123a2c"]
            : tag === "3" ? ["#0d2440", "#123a5c", "#18507a"]
            : ["#2a1a3a", "#3a2450", "#452a66"];
  for (let y = 0; y < TILE; y += 4) {
    for (let x = 0; x < TILE; x += 4) {
      ctx.fillStyle = r.chance(0.03) ? r.pick(NEON) : r.pick(pal);
      ctx.fillRect(x, y, 4, 4);
    }
  }
  return cv;
}

let cedidoCv = null;
/** O tile que fica no lugar de uma parede que cedeu: um quadrado que parou de
 *  ser desenhado. Um só pra todos — ele é a AUSÊNCIA de um tile. */
export function tileCedido() {
  if (cedidoCv) return cedidoCv;
  const { cv, ctx } = makeCanvas(TILE, TILE);
  const r = makeRng(77);
  for (let y = 0; y < TILE; y += 2) {
    for (let x = 0; x < TILE; x += 2) {
      ctx.fillStyle = r.chance(0.08) ? r.pick(NEON) : r.chance(0.5) ? "#0a0810" : "#16101f";
      ctx.fillRect(x, y, 2, 2);
    }
  }
  return (cedidoCv = cv);
}

/** O VÃO: a porta que não é desenho de porta. Dois batentes de tela rasgada e,
 *  no meio, nada — pixels que trocam de lugar sozinhos. `t` é o relógio. */
export function desenharVao(ctx, px, py, t) {
  const r = makeRng((t * 8) | 0);
  const cor = NEON[Math.floor(t * 3) % NEON.length];
  // os batentes: duas colunas que sobem um tile acima do chão
  for (let i = 0; i < 24; i += 2) {
    const j = r.int(3) - 1;
    ctx.fillStyle = r.chance(0.2) ? r.pick(NEON) : cor;
    ctx.fillRect(px + 1 + j, py - 8 + i, 2, 2);
    ctx.fillRect(px + 13 + j, py - 8 + i, 2, 2);
  }
  // o miolo: um retângulo escuro com pixels soltos por dentro
  ctx.fillStyle = "#0a0810";
  ctx.fillRect(px + 3, py - 6, 10, 22);
  for (let i = 0; i < 9; i++) {
    ctx.fillStyle = r.pick(NEON);
    ctx.globalAlpha = 0.35 + r() * 0.5;
    ctx.fillRect(px + 3 + r.int(9), py - 6 + r.int(21), 1 + r.int(2), 1);
  }
  ctx.globalAlpha = 1;
}
