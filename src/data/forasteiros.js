// OS FORASTEIROS (pedido do CAIO, nov/2026: "faz pkmns que não são de kanto
// aparecerem em kanto mas são levemente mais raros" — "tô na power plant achei
// um elekid, na torre pokémon achei um shuppet"). Em cada mapa de KANTO, cada
// bicho da tabela ganha um PRIMO de outra região: do MESMO TIPO e da força mais
// parecida (o total de status), no mesmo nível, com peso menor (35% do dele).
// A escolha é fixa por mapa (sorteio com semente), pra rota não mudar a cada
// vez que o jogo abre. Lendário, forma, mega e fusão não entram.
import { LENDARIOS } from "./leilao.js";

const PESO = 0.35;
// os que não são lendários no nome, mas são raros demais pra andar no mato
export const RAROS = new Set(["nihilego", "buzzwole", "pheromosa", "xurkitree", "celesteela", "kartana", "guzzlord", "poipole", "naganadel",
  "stakataka", "blacephalon", "typenull", "silvally", "cosmog", "cosmoem", "meltan", "melmetal", "kubfu", "urshifu", "zarude",
  "magearna", "marshadow", "zeraora", "diancie", "hoopa", "volcanion", "keldeo", "meloetta", "genesect", "phione", "manaphy",
  // os PARADOXOS (os da ÁREA ZERO)
  "greattusk", "screamtail", "brutebonnet", "fluttermane", "slitherwing", "sandyshocks", "roaringmoon", "walkingwake", "gougingfire",
  "ragingbolt", "irontreads", "ironbundle", "ironhands", "ironjugulis", "ironmoth", "ironthorns", "ironvaliant", "ironleaves",
  "ironboulder", "ironcrown", "koraidon", "miraidon"]);

function semente(txt) { let h = 2166136261; for (const c of txt) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; }

/** `ehNativo(sp)`: quem é DA região (não entra como forasteiro nem ganha primo).
 *  Em KANTO são os 151; nas outras, quem já aparece nas tabelas de lá. */
export function porForasteiros(db, idsKanto, ehNativo = (sp) => sp.dex <= 151) {
  const lista = Object.values(db.SPECIES || {}).filter((sp) => !ehNativo(sp) && sp.dex > 0 && sp.dex <= 1025 && !sp.fusao
    && !LENDARIOS.has(sp.id) && !RAROS.has(sp.id) && !/mega|gmax|totem|alola|galar|hisui|paldea|brag|vinculo|carnaval|-/.test(sp.id)
    && !(sp.types || []).includes("GLITCH")
    // forma (o TAUROS de Paldea, com o desenho de outro número) e quem é forte
    // como lendário (os da ÁREA ZERO puxavam REGIDRAGO, ZAMAZENTA...) não entram
    && !(sp.spriteDex && sp.spriteDex !== sp.dex) && (sp.bst || 0) < 580);
  // quem é EVOLUÇÃO de alguém (aparece como "to" numa regra)
  const evoluidos = new Set(Object.values(db.EVOLUTIONS || {}).flat().map((r) => r.to));
  const porTipo = new Map();
  for (const sp of lista) {
    const t = sp.types?.[0];
    if (!porTipo.has(t)) porTipo.set(t, []);
    porTipo.get(t).push(sp);
  }
  for (const id of idsKanto) {
    const m = db.MAPS?.[id];
    if (!m || m.forasteirosFeitos) continue;
    // a tabela do mapa e as das ZONAS (as zonas selvagens de LUMIOSE)
    const tabelas = [m.encounters, ...(m.zonas || []).map((z) => z.encounters)].filter((t) => t?.length);
    for (const tabela of tabelas) {
    const ja = new Set(tabela.map((e) => e.id));
    const novos = [];
    for (const e of tabela) {
      const sp = db.SPECIES[e.id];
      if (!sp || !ehNativo(sp) || e.corrupt || e.forasteiro) continue;
      const cand = (porTipo.get(sp.types?.[0]) || []).filter((c) => !ja.has(c.id));
      if (!cand.length) continue;
      // a NOTA de cada um (menor é melhor): a força parecida, os DOIS tipos
      // iguais (o ZUBAT, veneno e voador, puxa um voador-venenoso) e o mesmo
      // ESTÁGIO (bebê traz bebê, evoluído traz evoluído)
      const bst = sp.bst || 0, t2 = sp.types?.[1] || "", basico = !evoluidos.has(sp.id);
      const nota = (c) => Math.abs((c.bst || 0) - bst)
        + ((c.types?.[1] || "") === t2 ? 0 : t2 && (c.types || []).includes(t2) ? 25 : 55)
        + (!evoluidos.has(c.id) === basico ? 0 : 150);
      const perto = cand.sort((a, b) => nota(a) - nota(b)).slice(0, 4);
      const c = perto[semente(id + ":" + e.id) % perto.length];
      ja.add(c.id);
      novos.push({ id: c.id, min: e.min, max: e.max, w: Math.max(1, Math.round(e.w * PESO)), forasteiro: true });
    }
    tabela.push(...novos);
    }
    m.forasteirosFeitos = true;
  }
}

/** AS OUTRAS REGIÕES (o CAIO: "faz ter outros lugares assim"): BRAGLITCH,
 *  KALOS, a ÁREA ZERO e o ESPAÇO também ganham forasteiros — quem é nativo é
 *  quem já aparece nas tabelas daquela região (e, em Braglitch, os inventados). */
export function porForasteirosNasRegioes(db) {
  const grupos = { braglitch: [], kalos: [], zero: [], espaco: [] };
  for (const [id, g] of Object.entries(db.KANTO || {})) {
    if (g.regiao === "braglitch") grupos.braglitch.push(id);
    else if (/^lumiose|kalos/.test(id)) grupos.kalos.push(id);
    else if (/area_zero/.test(id)) grupos.zero.push(id);
    else if (/^espaco_/.test(id)) grupos.espaco.push(id);
  }
  for (const ids of Object.values(grupos)) {
    const nativos = new Set();
    for (const id of ids) {
      const m = db.MAPS?.[id];
      for (const t of [m?.encounters, ...(m?.zonas || []).map((z) => z.encounters)]) for (const e of t || []) nativos.add(e.id);
    }
    porForasteiros(db, ids, (sp) => nativos.has(sp.id) || sp.dex > 1025);
  }
}
