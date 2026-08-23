// Ponto unico de acesso aos dados do jogo.
// O live update reimporta este modulo com ?t=... e reconstroi o DB em memoria,
// entao TUDO que le dados deve ler via `DB.x` (nunca guardar a referencia solta).
import { url as arquivo } from "../core/base.js";

const V = new URL(import.meta.url).search;

const [config, story, types, moves, gen1, extra, frags, loot, evo, field, music, species, box, mega, fusao, fusoes, feitas, concurso, idiomas, missoes, mundo, online, gifts, maps, kanto] = await Promise.all([
  import("./config.js" + V),
  import("./story.js" + V),
  import("./types.js" + V),
  import("./moves.js" + V),
  import("./gen1.js" + V),
  import("./extra.js" + V),
  import("./fragments.js" + V),
  import("./loot.js" + V),
  import("./evolution.js" + V),
  import("./field.js" + V),
  import("./music.js" + V),
  import("./species.js" + V),
  import("./box.js" + V),
  import("./mega.js" + V),
  import("./fusao.js" + V),
  import("./fusoes.js" + V),
  import("./fusoes-feitas.js" + V),
  import("./concurso.js" + V),
  import("./idiomas.js" + V),
  import("./missoes.js" + V),
  import("./mundo.js" + V),
  import("./online.js" + V),
  import("./gifts.js" + V),
  import("./maps.js" + V),
  fetch(arquivo(`assets/maps/kanto.json${V || "?v=1"}`)).then((r) => (r.ok ? r.json() : null)),
]);

if (!kanto) {
  console.error("[dados] assets/maps/kanto.json não encontrado — rode: python3 tools/fetch_maps.py");
}

/** Junta a geometria importada do FireRed com o conteúdo escrito à mão.
 *  O que está em src/data/maps.js sempre ganha. */
function mergeMaps(kanto, authored) {
  const out = {};
  kanto = kanto || {};
  for (const [id, geo] of Object.entries(kanto || {})) {
    const c = geo.content || {};
    const first = geo.warps?.[0];
    out[id] = {
      name: c.name || id.toUpperCase().replace(/_/g, " "),
      music: c.music || "route",
      interior: !!c.interior,
      npcs: c.npcs || [],
      encounters: c.encounters || [],
      lockedWarps: {},
      signs: Object.fromEntries((geo.signs || []).map((s) => [`${s.x},${s.y}`, c.name || ""])),
      spawn: first ? { x: first.x, y: first.y, dir: c.interior ? "up" : "down" }
                   : { x: Math.floor(geo.w / 2), y: Math.floor(geo.h / 2), dir: "down" },
    };
  }
  for (const [id, m] of Object.entries(authored)) {
    const base = out[id] || {};
    const npcs = m.npcs || [...(base.npcs || []), ...(m.addNpcs || [])];
    out[id] = {
      ...base, ...m,
      signs: { ...(base.signs || {}), ...(m.signs || {}) },
      // `npcPatch` altera um NPC que veio do decomp pelo id, sem ter que
      // reescrever a lista inteira do mapa à mão
      npcs: m.npcPatch ? npcs.map((n) => (m.npcPatch[n.id] ? { ...n, ...m.npcPatch[n.id] } : n)) : npcs,
    };
  }
  // O PC dos Centros Pokémon: mesma planta, mesma coordenada em Kanto inteira
  // (ver PC_CENTRO em src/data/maps.js). Um mapa que já traga `pc` escrito à
  // mão fica com o dele.
  for (const [id, m] of Object.entries(out)) {
    if (!m.pc && (id === "center" || id.endsWith("pokemon_center_1f"))) m.pc = [...maps.PC_CENTRO];
  }
  return out;
}

const DIM = { w: 44, h: 40, seed: 90210, entry: { x: 22, y: 30 } };
export const DIM_ENTRY = { x: 22, y: 29, portal: { x: 22, y: 30 } };

/** ruído simples e determinístico (sem Math.random: precisa ser igual sempre) */
function hash2(x, y, seed) {
  // Math.imul mantém tudo em int32: sem isso o hash degenera e o mapa sai liso
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(seed, 2654435761)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function blob(x, y, seed, scale) {
  const gx = Math.floor(x / scale), gy = Math.floor(y / scale);
  let v = 0;
  for (let dx = 0; dx <= 1; dx++) {
    for (let dy = 0; dy <= 1; dy++) v += hash2(gx + dx, gy + dy, seed);
  }
  return v / 4;
}

/** A 011GLITCHDIMENSION110: ilhas de terra, poças de água e vazio no meio,
 *  com tufos de 101MATO011 espalhados (é neles que aparece bicho). */
function dimensionMap(story) {
  const { w, h, seed } = DIM;
  let tags = "", terrain = "";
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const edge = x === 0 || y === 0 || x === w - 1 || y === h - 1;
      const t = blob(x, y, seed, 7);
      const kind = t < 0.462 ? "a" : t < 0.538 ? "t" : "g";   // ar / terra / água (~1/3 cada)
      terrain += kind;
      if (edge) { tags += "1"; continue; }
      // clareira em volta do portal de entrada
      if (Math.abs(x - DIM.entry.x) <= 2 && Math.abs(y - DIM.entry.y) <= 2) { tags += "0"; continue; }
      const wall = blob(x, y, seed + 77, 3) > 0.74;          // blocos corrompidos
      const grass = !wall && blob(x, y, seed + 31, 2.5) > 0.62;
      tags += wall ? "1" : grass ? "2" : "0";
    }
  }
  return {
    w, h, tags, terrain, warps: [], connections: [], signs: [], objects: [],
    content: {
      name: story.dimension.name, music: "cave", interior: true, npcs: [], encounters: [],
    },
  };
}

/** BIRTH ISLAND. A geometria oficial vem do decomp, junto com o resto de Kanto
 *  (`python3 tools/fetch_maps.py --only BirthIsland_Exterior`). Se o arquivo não
 *  estiver lá, o jogo cai nesta ilha desenhada em código, pra nunca quebrar. */
const ILHA = { w: 22, h: 20 };
export const ILHA_ENTRADA = { x: 11, y: 16, dir: "up" };

function islandMap() {
  const { w, h } = ILHA;
  const cx = (w - 1) / 2, cy = (h - 1) / 2;
  let tags = "", terrain = "";
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // a ilha é uma elipse de areia; fora dela, mar
      const d = ((x - cx) / (w * 0.36)) ** 2 + ((y - cy) / (h * 0.36)) ** 2;
      const areia = d <= 1;
      terrain += areia ? "t" : "g";
      // o monumento: um triângulo de pedra no meio, sólido
      const dy = Math.round(cy) - y;
      const monumento = dy >= 0 && dy <= 3 && Math.abs(x - Math.round(cx)) <= dy;
      tags += !areia ? "3" : monumento ? "1" : "0";
    }
  }
  return {
    w, h, tags, terrain, warps: [], connections: [], signs: [], objects: [],
    content: { name: "BIRTH ISLAND", music: "ilha", interior: false, npcs: [], encounters: [] },
  };
}

/** A TEMPESTADE QUE NÃO ACABA: mar aberto perto de BIRTH ISLAND, com um
 *  recife de pedra no meio onde dá pra ficar de pé. Não é mapa do FireRed, não
 *  existe caminho por terra e não tem porta: só se chega de barco (as side
 *  quests do marinheiro) e só se sai falando com ele de novo. */
const TEMPESTADE = { w: 20, h: 16 };
export const TEMPESTADE_PIER = { x: 10, y: 10, dir: "up" };

function stormMap(story) {
  const { w, h } = TEMPESTADE;
  const cx = (w - 1) / 2, cy = (h - 1) / 2;
  let tags = "", terrain = "";
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // o recife é uma mancha irregular no meio; o resto é mar bravo
      const d = ((x - cx) / 4.6) ** 2 + ((y - cy) / 3.4) ** 2;
      const ruido = hash2(x, y, 7717) * 0.5;
      const pedra = d + ruido * 0.35 <= 1;
      terrain += "g";
      tags += pedra ? "0" : "3";
    }
  }
  return {
    w, h, tags, terrain, warps: [], connections: [], signs: [], objects: [],
    content: {
      name: story.tempestade?.nome || "TEMPESTADE", music: "cave",
      interior: false, npcs: [], encounters: [],
    },
  };
}

/** true quando a ilha está sendo desenhada aqui, e não veio do decomp */
export const ILHA_GERADA = !kanto?.birth_island;

/** só entra se o mapa importado não existir */
const ilhaFallback = ILHA_GERADA ? { birth_island: islandMap() } : {};

export function buildDB() {
  return {
    CONFIG: config.CONFIG,
    TYPES: types.TYPES,
    TYPE_COLOR: types.TYPE_COLOR,
    CHART: types.CHART,
    effectiveness: types.effectiveness,
    MOVES: moves.MOVES,
    GEN1: gen1.GEN1,
    DEX_ORDER: gen1.DEX_ORDER,
    SPECIES: species.buildSpecies({ ...gen1.GEN1, ...extra.EXTRA, ...mega.MEGA_FORMS }, types.TYPE_COLOR),
    EXTRA: extra.EXTRA,
    DIM_ENCOUNTERS: extra.DIM_ENCOUNTERS,
    WEATHER_TRIO: extra.WEATHER_TRIO,
    RARE_LEGEND: extra.RARE_LEGEND,
    DEOXYS_FORMS: extra.DEOXYS_FORMS,
    TEMPESTADE: extra.TEMPESTADE,
    ESTATICOS: extra.ESTATICOS,
    TRIO_CHANCE: extra.TRIO_CHANCE,
    SHINY_EVERY: extra.SHINY_EVERY,
    FRAGMENT_SPOTS: frags.FRAGMENT_SPOTS,
    SPOT_CHANCE: frags.SPOT_CHANCE,
    SPOT_STEP: frags.SPOT_STEP,
    SPOT_RESET: frags.SPOT_RESET,
    NEAR_SIGNS: frags.NEAR_SIGNS,
    FALLBACK_CHANCE: frags.FALLBACK_CHANCE,
    DIM_LOOT: loot.DIM_LOOT,
    DIM_LOOT_COUNT: loot.DIM_LOOT_COUNT,
    DIM_LOOT_SPREAD: loot.DIM_LOOT_SPREAD,
    EVOLUTIONS: evo.EVOLUTIONS,
    EVO_ITEMS: evo.EVO_ITEMS,
    STONES: evo.STONES,
    FIELD_MOVES: field.FIELD_MOVES,
    FIELD_LEARNERS: field.FIELD_LEARNERS,
    FLY_SPOTS: field.FLY_SPOTS,
    MUSIC: music.MUSIC,
    MUSIC_ALIAS: music.MUSIC_ALIAS,
    ITEM_LORE: { ...loot.ITEM_LORE, ...mega.PEDRA_LORE },
    STARTERS: species.STARTERS,
    BOX: box.BOX,
    BOX_PAPEIS: box.BOX_PAPEIS,
    MEGAS: mega.MEGAS,
    MEGA_FORMS: mega.MEGA_FORMS,
    MEGA_PEDRAS: mega.MEGA_PEDRAS,
    MEGA_ANEL: mega.ANEL,
    FUSAO: fusao.FUSAO,
    FUSOES: fusoes.FUSOES,
    FUSOES_FEITAS: feitas.FUSOES_FEITAS,
    CONCURSO: concurso.CONCURSO,
    MISSOES: missoes.MISSOES,
    MUNDO: mundo.MUNDO,
    MISSAO_TEXTO: missoes.MISSAO_TEXTO,
    IDIOMAS: idiomas.IDIOMAS,
    DICIONARIOS: idiomas.DICIONARIOS,
    AVISO_IDIOMA: idiomas.AVISO_IDIOMA,
    ONLINE: online.ONLINE,
    FRASES: online.FRASES,
    EMOTES: online.EMOTES,
    ONLINE_TEXTO: online.ONLINE_TEXTO,
    GIFT_CODES: gifts.GIFT_CODES,
    GIFT_TEXTO: gifts.GIFT_TEXTO,
    MAPS: mergeMaps({ ...kanto, ...ilhaFallback, glitchdim: dimensionMap(story.STORY),
                     tempestade: stormMap(story.STORY) }, maps.MAPS),
    STORY: story.STORY,
    KANTO: { ...(kanto || {}), ...ilhaFallback, glitchdim: dimensionMap(story.STORY),
             tempestade: stormMap(story.STORY) },
    TAG: maps.TAG,
    LEDGE_DIR: maps.LEDGE_DIR,
    START_MAP: maps.START_MAP,
  };
}

/** Objeto vivo: o hot-swap faz Object.assign neste mesmo objeto. */
export const DB = buildDB();
