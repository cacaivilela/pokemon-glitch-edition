// Carregador de sprites externos (PNG). Enquanto um arquivo não existir, o jogo
// usa a arte provisória gerada em assets.js — nada quebra, nada fica preto.
//
// Convenção de nomes (veja assets/sprites/README.md):
//   assets/sprites/pokemon/025.png        frente (ou pikachu.png)
//   assets/sprites/pokemon/back/025.png   costas
//   assets/sprites/overworld/hero.png     folha 4 colunas x 3 linhas (baixo/cima/esquerda)
//   assets/sprites/tiles/grama.png        tile de 16x16
import { url } from "./base.js";
import { DB } from "../data/index.js";

export const SpriteStore = {
  pokemon: {},      // id -> canvas/Image
  pokemonBack: {},
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

/** Pede o sprite daquela espécie (frente e costas), uma vez só. Enquanto ele
 *  não chega, quem desenha usa a arte provisória — nada fica preto. */
export function pedirMon(id, dex) {
  if (!id || pedidos.has(id)) return;
  pedidos.add(id);
  findMon("pokemon", id, dex).then((img) => {
    if (img) { SpriteStore.pokemon[id] = img; SpriteStore.loaded++; }
    else SpriteStore.missing.add(id);
  });
  findMon("pokemon/back", id, dex).then((img) => {
    if (img) SpriteStore.pokemonBack[id] = img;
  });
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
