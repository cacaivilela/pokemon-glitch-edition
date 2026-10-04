// OS BICOS — a parte viva (os dados em src/data/bicos.js).
import { DB } from "../data/index.js";
import { randRange } from "../core/rng.js";
import { emBraglitch } from "./regionais.js";

const B = () => DB.BICOS;
const insignias = (st) => (st.badges || []).length + (st.bragBadges || []).length;
const mesmaRegiao = (a, b) => emBraglitch(a) === emBraglitch(b);

/** "PEWTER CIDADE  CENTRO POKÉMON" e "CENTRO POKÉMON — SÃO LUCARIO" -> o nome do lugar */
export function nomeDoCentro(mapa) {
  const n = String(DB.MAPS[mapa]?.name || mapa).replace(/CENTRO POKÉMON/, "").replace(/—/g, "").trim();
  return n.replace(/\s+/g, " ") || mapa.toUpperCase();
}

/** os Centros (com enfermeira) da mesma região deste, menos ele */
function outrosCentros(mapa) {
  return Object.keys(DB.MAPS).filter((m) => /pokemon_center_1f$/.test(m) && m !== mapa
    && mesmaRegiao(m, mapa) && (DB.MAPS[m].npcs || []).some((n) => n.heal));
}

// ------------------------------------------------------------ ENTREGAS
/** uma entrega nova saindo deste Centro (ou null, se não tem pra onde) */
export function novaEntrega(st, mapa) {
  const destinos = outrosCentros(mapa);
  if (!destinos.length) return null;
  const E = B().entrega;
  const valor = Math.round((E.base + E.porInsignia * insignias(st)) * (1 + Math.random() * E.sorte) / 10) * 10;
  return { de: mapa, para: destinos[Math.floor(Math.random() * destinos.length)], valor };
}

/** entregou aqui? paga e limpa. Devolve a entrega paga, ou null. */
export function entregarAqui(st, mapa) {
  const e = st.entrega;
  if (!e || e.para !== mapa) return null;
  st.money += e.valor;
  st.entrega = null;
  return e;
}

// ---------------------------------------------------------- PROCURADOS
/** quem vive no mato da região deste mapa: [{ id, max }] */
function quemViveAqui(mapa) {
  const vistos = new Map();
  for (const [m, def] of Object.entries(DB.MAPS)) {
    if (!mesmaRegiao(m, mapa) || def.interior || m === "glitchdim") continue;
    for (const e of def.encounters || []) {
      if (!DB.SPECIES[e.id] || e.id === "missingno") continue;
      vistos.set(e.id, Math.max(vistos.get(e.id) || 0, e.max || e.min || 5));
    }
  }
  return [...vistos].map(([id, max]) => ({ id, max }));
}

/** o mural: três procurados novos */
export function novoMural(mapa) {
  const P = B().procurado;
  const pool = quemViveAqui(mapa);
  const out = [];
  while (out.length < P.quantos && pool.length) {
    const [e] = pool.splice(Math.floor(Math.random() * pool.length), 1);
    const lvl = Math.min(100, e.max + randRange(P.acima[0], P.acima[1]));
    out.push({ species: e.id, lvl, valor: Math.round((P.base + P.porNivel * lvl) / 10) * 10, feito: false });
  }
  return out;
}

/** derrubou ou pegou `mon`: estava no mural? paga. Devolve o valor, ou 0. */
export function cumprirProcurado(st, mon) {
  const p = (st.procurados || []).find((x) => !x.feito && x.species === mon?.species && mon.level >= x.lvl);
  if (!p) return 0;
  p.feito = true;
  st.money += p.valor;
  return p.valor;
}
