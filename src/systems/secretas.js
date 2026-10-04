// AS EVOLUÇÕES SECRETAS — a parte viva (os dados em src/data/secretas.js).
// A batalha chama `marcarSecreta` toda vez que um golpe bate; se o que
// aconteceu é o que uma marca pede, ela é gravada no bicho, e a regra
// `secreta` da evolução (src/systems/mon.js, `evolutionFor`) passa a valer.
import { DB } from "../data/index.js";
import { lugarBate } from "./regionais.js";
import { agora } from "./ciclo.js";

/** `alvo` levou o golpe `mv` (id `id`) neste `mapa`. Marca o que tiver que
 *  marcar: uma marca por `grupo`, a primeira da lista que bater. */
export function marcarSecreta(alvo, mv, mapa, id = null) {
  if (!alvo || !mv) return;
  const lista = DB.MARCAS_SECRETAS || [];
  const temDoGrupo = (g) => g && lista.some((m) => m.grupo === g && alvo[m.marca]);
  for (const m of lista) {
    if (alvo.species !== m.especie || alvo[m.marca] || temDoGrupo(m.grupo)) continue;
    if (m.tipo && mv.type !== m.tipo) continue;
    if (m.golpe && id !== m.golpe) continue;
    if (m.desmaiou && alvo.hp > 0) continue;
    if (m.noite && !agora().noite) continue;
    if (!lugarBate({ onde: m.onde }, mapa)) continue;
    alvo[m.marca] = true;
  }
}
