// Carregador de sprites externos (PNG). Enquanto um arquivo não existir, o jogo
// usa a arte provisória gerada em assets.js — nada quebra, nada fica preto.
//
// Convenção de nomes (veja assets/sprites/README.md):
//   assets/sprites/pokemon/025.png            frente (ou pikachu.png)
//   assets/sprites/pokemon/back/025.png       costas
//   assets/sprites/pokemon/shiny/025.png      a cor SHINY de verdade (opcional)
//   assets/sprites/pokemon/shiny/back/025.png
//   assets/sprites/overworld/hero.png     folha 4 colunas x 3 linhas (baixo/cima/esquerda)
//   assets/sprites/tiles/grama.png        tile de 16x16
import { url } from "./base.js";
import { DB } from "../data/index.js";

export const SpriteStore = {
  pokemon: {},      // id -> canvas/Image
  pokemonBack: {},
  pokemonShiny: {},     // id -> a arte shiny oficial, quando o PNG existe
  pokemonShinyBack: {},
  overworld: {},    // nome -> {down,up,left,right} com 4 frames cada
  trainers: {},     // nome -> retrato de batalha 64x64
  tiles: {},        // char -> Image
  maps: {},         // id do mapa -> Image (assets/maps/<id>.png)
  loaded: 0,
  missing: new Set(),
};

const cache = new Map();

export function loadImage(url) {
  if (cache.has(url)) return cache.get(url);
  const p = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
  cache.set(url, p);
  return p;
}

const pad3 = (n) => String(n).padStart(3, "0");

/** Tenta 025.png e depois pikachu.png. */
async function findMon(dir, id, dex) {
  const tries = dex ? [`${pad3(dex)}.png`, `${id}.png`] : [`${id}.png`];
  for (const f of tries) {
    const img = await loadImage(url(`assets/sprites/${dir}/${f}`));
    if (img) return img;
  }
  return null;
}

/** Fatia uma folha 4 colunas x 3 linhas (baixo, cima, lado) de 16x16. */
function sliceActorSheet(img) {
  const fw = Math.floor(img.width / 4);
  const fh = Math.floor(img.height / 3);
  const rows = ["down", "up", "left"];
  const out = {};
  rows.forEach((dir, r) => {
    out[dir] = [];
    for (let c = 0; c < 4; c++) {
      const cv = document.createElement("canvas");
      cv.width = fw; cv.height = fh;
      const ctx = cv.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, c * fw, r * fh, fw, fh, 0, 0, fw, fh);
      out[dir].push(cv);
    }
  });
  out.right = out.left.map((cv) => {
    const f = document.createElement("canvas");
    f.width = cv.width; f.height = cv.height;
    const c = f.getContext("2d");
    c.imageSmoothingEnabled = false;
    c.translate(cv.width, 0); c.scale(-1, 1); c.drawImage(cv, 0, 0);
    return f;
  });
  return out;
}

/** Arte do mapa, renderizada a partir do FireRed.
 *  `<id>.png` é o chão (fica atrás do jogador) e `<id>_over.png` é a camada que
 *  passa por cima dele — copa das árvores, telhados, batentes de porta. */
export function mapArt(id) {
  if (!(id in SpriteStore.maps)) {
    SpriteStore.maps[id] = null;
    loadImage(url(`assets/maps/${id}.png`)).then((img) => {
      SpriteStore.maps[id] = img;
      if (!img) console.warn(`[mapa] assets/maps/${id}.png não encontrado — rode: python3 tools/fetch_maps.py`);
    });
    loadImage(url(`assets/maps/${id}_over.png`)).then((img) => { SpriteStore.maps[id + "_over"] = img; });
  }
  return SpriteStore.maps[id];
}

export const mapOverlay = (id) => SpriteStore.maps[id + "_over"] || null;

/** Retrato de batalha do treinador (assets/sprites/trainers/<nome>.png).
 *  O nome é o mesmo do sprite de overworld do NPC. Quem não tiver arquivo
 *  simplesmente não aparece — a batalha começa direto, como antes. */
export function trainerArt(name) {
  if (!name) return null;
  if (!(name in SpriteStore.trainers)) {
    SpriteStore.trainers[name] = null;
    loadImage(url(`assets/sprites/trainers/${name}.png`)).then((img) => {
      SpriteStore.trainers[name] = img;
    });
  }
  return SpriteStore.trainers[name];
}

export const TILE_FILES = {
  ".": "grama", ",": "grama_alta", P: "caminho", "#": "arvore", "~": "agua",
  W: "parede", R: "telhado", N: "telhado_centro", M: "telhado_loja", D: "porta",
  S: "placa", "=": "cerca", F: "flores", l: "barranco", L: "piso", w: "parede_interna",
  T: "balcao", B: "cama", C: "pc", t: "tv", p: "planta", ">": "escada",
};

// Quem já foi pedido, pra não pedir duas vezes. O sprite de um Pokémon só é
// baixado quando ele PRECISA aparecer — antes o jogo pedia os quase 200 de uma
// vez no boot (uns 400 arquivos), e ficava esperando por bicho que talvez não
// entrasse na tela naquela partida inteira.
const pedidos = new Set();

/** A ARTE HACKEADA: o desenho da base, lido errado.
 *
 *  As FORMAS HACKEANAS (src/data/hackeanas.js) não têm arte própria e não
 *  deviam ter: elas SÃO o bicho original lido com o deslocamento errado, e é
 *  isso que a imagem mostra. O PNG que chega é o do RHYDON de sempre; o que vai
 *  pra tela é ele com as linhas escorregadas, um pedaço com os canais de cor
 *  trocados e dois blocos de lixo por cima — exatamente o que os atributos
 *  dela já fizeram com os números.
 *
 *  É DETERMINÍSTICO: a semente sai do id da espécie, então o mesmo bicho quebra
 *  do mesmo jeito em toda partida, em todo aparelho. Um sprite que se
 *  redesenhasse a cada carregamento não seria um bicho, seria um chuvisco.
 *
 *  Nenhum arquivo novo em assets/ — e é de propósito: baixar dezenove PNGs pra
 *  guardar a mesma imagem estragada de dezenove jeitos seria pagar disco por
 *  uma conta que o navegador faz em um milésimo de segundo. */
export function corromperSprite(img, semente) {
  const w = img.width | 0, h = img.height | 0;
  if (!w || !h) return img;
  const novo = document.createElement("canvas");
  novo.width = w; novo.height = h;
  const c = novo.getContext("2d");
  c.imageSmoothingEnabled = false;
  c.drawImage(img, 0, 0);

  // a fonte é uma cópia: as fatias são lidas do desenho inteiro, e não do que
  // as fatias anteriores já mexeram — senão o estrago vira borrão
  const fonte = document.createElement("canvas");
  fonte.width = w; fonte.height = h;
  fonte.getContext("2d").drawImage(novo, 0, 0);

  let s = (semente >>> 0) || 1;
  const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  const inteiro = (n) => Math.floor(rnd() * n);

  // 1. AS LINHAS ESCORREGAM. Cada faixa anda pro lado e dá a volta pelo outro
  //    lado — é o que uma linha lida do lugar errado faz na tela de verdade.
  const faixas = 4 + inteiro(4);
  for (let i = 0; i < faixas; i++) {
    const y = inteiro(h);
    const alt = 1 + inteiro(Math.max(2, Math.round(h / 14)));
    const dx = Math.round((rnd() * 2 - 1) * (w / 5)) || 1;
    c.clearRect(0, y, w, alt);
    c.drawImage(fonte, 0, y, w, alt, dx, y, w, alt);
    c.drawImage(fonte, 0, y, w, alt, dx + (dx > 0 ? -w : w), y, w, alt);
  }

  // 2. OS CANAIS TROCADOS, numa faixa só. Vermelho vira azul onde o byte da cor
  //    foi lido na ordem errada.
  try {
    const y = inteiro(Math.max(1, h - 4));
    const alt = 2 + inteiro(Math.max(2, Math.round(h / 8)));
    const d = c.getImageData(0, y, w, Math.min(alt, h - y));
    for (let i = 0; i < d.data.length; i += 4) {
      const r = d.data[i]; d.data[i] = d.data[i + 2]; d.data[i + 2] = r;
    }
    c.putImageData(d, 0, y);
  } catch { /* canvas sem leitura de pixel: fica só o resto do estrago */ }

  // 3. OS BLOCOS DE LIXO, com cor tirada do próprio bicho: o pedaço que sobrou
  //    na memória é da mesma imagem, não é tinta de fora.
  for (let i = 0; i < 2 + inteiro(2); i++) {
    const bx = inteiro(w), by = inteiro(h);
    const bw = 2 + inteiro(Math.max(3, Math.round(w / 7)));
    const bh = 1 + inteiro(Math.max(2, Math.round(h / 16)));
    c.drawImage(fonte, inteiro(Math.max(1, w - bw)), inteiro(Math.max(1, h - bh)), bw, bh, bx, by, bw, bh);
  }
  return novo;
}

/** semente estável a partir do id (djb2) */
function sementeDe(id) {
  let n = 5381;
  for (let i = 0; i < id.length; i++) n = ((n * 33) ^ id.charCodeAt(i)) >>> 0;
  return n;
}

/** Se a espécie for uma FORMA HACKEANA, o que vai pro store é o desenho
 *  estragado. O sprite pedido continua sendo o da base (`spriteDex`), que é o
 *  que existe em assets/. */
const talvezHackear = (id, img, lado) =>
  (img && DB.SPECIES?.[id]?.hack) ? corromperSprite(img, sementeDe(id + lado)) : img;

/** Pede o sprite daquela espécie (frente e costas), uma vez só. Enquanto ele
 *  não chega, quem desenha usa a arte provisória — nada fica preto. */
export function pedirMon(id, dex) {
  if (!id || pedidos.has(id)) return;
  pedidos.add(id);
  findMon("pokemon", id, dex).then((img) => {
    if (img) { SpriteStore.pokemon[id] = talvezHackear(id, img, "f"); SpriteStore.loaded++; }
    else SpriteStore.missing.add(id);
  });
  findMon("pokemon/back", id, dex).then((img) => {
    if (img) SpriteStore.pokemonBack[id] = talvezHackear(id, img, "c");
  });
}

/** A ARTE SHINY, pedida só quando um shiny precisa ser desenhado.
 *
 *  Shiny é raro (1 em 1024), então pedir o PNG shiny de toda espécie que
 *  aparece seria dobrar os pedidos pra quase nunca usar. Aqui o arquivo só é
 *  procurado na primeira vez que um shiny daquela espécie vai pra tela — e se
 *  ele não existir, quem chamou cai no filtro de cor de assets.js, como antes. */
const pedidosShiny = new Set();

export function pedirMonShiny(id, dex) {
  if (!id || pedidosShiny.has(id)) return;
  pedidosShiny.add(id);
  findMon("pokemon/shiny", id, dex).then((img) => {
    if (img) SpriteStore.pokemonShiny[id] = img;
  });
  findMon("pokemon/shiny/back", id, dex).then((img) => {
    if (img) SpriteStore.pokemonShinyBack[id] = img;
  });
}

/** Arte que chega pronta, sem passar por assets/sprites/pokemon — é como um
 *  DLC entrega o sprite de uma espécie dele (src/systems/dlc.js). Marca o id
 *  como pedido pra ninguém sair procurando arquivo por cima. */
export function registrarSpriteMon(id, frente, costas = null) {
  pedidos.add(id);
  if (frente) { SpriteStore.pokemon[id] = frente; SpriteStore.loaded++; SpriteStore.missing?.delete?.(id); }
  if (costas) SpriteStore.pokemonBack[id] = costas;
}

/** Adianta o que já se sabe que vai aparecer (a sua equipe, o que mora no mapa
 *  em que você está). O resto chega sozinho, na hora. */
export function adiantarMons(lista) {
  for (const { id, dex } of lista || []) pedirMon(id, dex);
}

const daEspecie = (id) => {
  const sp = DB.SPECIES?.[id];
  return sp ? { id: sp.id || id, dex: sp.spriteDex || sp.dex } : null;
};

/** Tudo que pode aparecer NESTE mapa: a sua equipe, quem mora na grama, os
 *  Pokémon dos treinadores e o que estiver guardado no PC. Chamado a cada
 *  troca de mapa — assim o sprite já está aqui quando o bicho aparece, em vez
 *  de mostrar a arte provisória por um instante. */
export function adiantarDoMapa(state) {
  const ids = new Set();
  for (const m of state?.party || []) ids.add(m.species);
  const mapa = DB.MAPS?.[state?.player?.map];
  for (const e of mapa?.encounters || []) ids.add(e.id);
  for (const npc of mapa?.npcs || []) {
    for (const p of npc.trainer?.party || []) ids.add(p.id);
    if (npc.boss?.id) ids.add(npc.boss.id);
    if (npc.starter) ids.add(npc.starter);
  }
  adiantarMons([...ids].map(daEspecie).filter(Boolean));
}

/** Depois que o jogo já está rodando, o resto vem sozinho, de pouquinho em
 *  pouquinho: em uns segundos TODOS os sprites estão aqui, e daí em diante
 *  ninguém mais vê arte provisória — sem atrasar a abertura, que era o motivo
 *  de não pedir tudo de uma vez no boot. */
export function adiantarOResto(porVez = 6, intervalo = 200) {
  const fila = Object.values(DB.SPECIES || {})
    .filter((sp) => !sp.fusao && !pedidos.has(sp.id))
    .map((sp) => ({ id: sp.id, dex: sp.spriteDex || sp.dex }));
  const passo = () => {
    for (let i = 0; i < porVez && fila.length; i++) {
      const sp = fila.shift();
      pedirMon(sp.id, sp.dex);
    }
    if (fila.length) setTimeout(passo, intervalo);
  };
  setTimeout(passo, intervalo);
}

/** Roda em segundo plano; o jogo já está rodando enquanto isso.
 *  Aqui ficam só os que são precisos SEMPRE: os personagens do mapa e os
 *  tiles. Pokémon é pedido por `pedirMon`, quando aparece. */
export async function loadExternalSprites(actorNames) {
  const jobs = [];

  for (const name of actorNames) {
    jobs.push(loadImage(url(`assets/sprites/overworld/${name}.png`)).then((img) => {
      if (img) { SpriteStore.overworld[name] = sliceActorSheet(img); SpriteStore.loaded++; }
    }));
  }
  for (const [ch, file] of Object.entries(TILE_FILES)) {
    jobs.push(loadImage(url(`assets/sprites/tiles/${file}.png`)).then((img) => {
      if (img) { SpriteStore.tiles[ch] = img; SpriteStore.loaded++; }
    }));
  }

  await Promise.all(jobs);
  if (SpriteStore.loaded) console.log(`%c[sprites] ${SpriteStore.loaded} arquivo(s) externo(s) carregado(s)`, "color:#59d99b");
  return SpriteStore;
}
