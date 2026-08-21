// Sorteio das pokébolas largadas dentro da 011GLITCHDIMENSION110.
import { DB } from "../data/index.js";
import { randRange } from "../core/rng.js";

/** sorteia o conteúdo de uma bola pela tabela de pesos */
export function rollLootItem() {
  const table = DB.DIM_LOOT || [];
  if (!table.length) return null;
  const total = table.reduce((a, e) => a + e.w, 0);
  let r = Math.random() * total;
  for (const e of table) {
    r -= e.w;
    if (r <= 0) return { item: e.item, qty: randRange(e.qty[0], e.qty[1]), rare: !!e.rare };
  }
  return null;
}

/** Espalha as bolas pelo mapa da dimensão.
 *  `isFree(x,y)` decide se o tile serve (vem da cena, que conhece colisão e NPCs). */
export function scatterDimLoot(geo, isFree) {
  const { min, max } = DB.DIM_LOOT_COUNT || { min: 3, max: 6 };
  const spread = DB.DIM_LOOT_SPREAD ?? 5;
  const want = randRange(min, max);
  const out = [];
  for (let tries = 0; out.length < want && tries < 600; tries++) {
    const x = randRange(1, geo.w - 2), y = randRange(1, geo.h - 2);
    if (!isFree(x, y)) continue;
    if (out.some((b) => Math.abs(b.x - x) + Math.abs(b.y - y) < spread)) continue;
    const roll = rollLootItem();
    if (roll) out.push({ x, y, ...roll });
  }
  return out;
}
