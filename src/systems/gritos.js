// Tocar o grito de uma espécie (os dados estão em src/data/gritos.js).
import { DB } from "../data/index.js";
import { GRITOS } from "../data/gritos.js";
import { Audio2 } from "../core/audio.js";

const ONDAS = ["q", "p", "f", "t", "s"];

/** Bicho sem grito escrito: um tirado do nome, sempre o mesmo pra ele. */
function doNome(id) {
  let h = 2166136261;
  for (const ch of String(id)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
  const r = () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0) % 1000) / 1000;
  const base = 300 + r() * 900, onda = ONDAS[Math.floor(r() * ONDAS.length)];
  const s = [];
  const n = 2 + Math.floor(r() * 2);
  for (let i = 0; i < n; i++) {
    const f0 = base * (0.8 + r() * 0.6);
    s.push([f0, f0 * (0.6 + r() * 0.8), 80 + r() * 160, onda, r() < 0.3 ? 15 : 0]);
  }
  return { som: "", s };
}

/** O grito de uma espécie: o escrito, o da fusão (cabeça + fim do corpo) ou o do nome. */
export function gritoDe(id) {
  if (GRITOS[id]) return GRITOS[id];
  const sp = DB.SPECIES?.[id];
  if (sp?.fusao) {
    const a = gritoDe(sp.fusao.cabeca), b = gritoDe(sp.fusao.corpo);
    const meio = (x) => Math.ceil(x.s.length / 2);
    return { som: "", s: [...a.s.slice(0, meio(a)), ...b.s.slice(meio(b))] };
  }
  return doNome(id);
}

/** Toca o grito do Pokémon (`mon` ou id da espécie). Devolve a duração em s. */
export function tocarGrito(mon) {
  const id = typeof mon === "string" ? mon : mon?.species;
  if (!id) return 0;
  return Audio2.grito(gritoDe(id));
}
