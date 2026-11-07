// O QUE CADA BOLA NOVA FAZ (src/data/fabrica.js, BOLAS_NOVAS): o multiplicador
// da captura (o mesmo `bonus` da POKÉ BOLA 1, GREAT 1,5 e ULTRA 2), olhando a
// batalha na hora em que a bola sai da mão. `b` = a bola, `bt` = a batalha.
import { DB } from "../data/index.js";
import { LENDARIOS } from "../data/leilao.js";
import { agora } from "./ciclo.js";
import { pesoDe } from "./habilidades.js";

const ULTRA = new Set(["nihilego", "buzzwole", "pheromosa", "xurkitree", "celesteela", "kartana", "guzzlord", "poipole", "naganadel", "stakataka", "blacephalon"]);

export function bonusDaBola(b, bt) {
  if (!b) return 1;
  if (typeof b.bonus === "number") return b.bonus;
  const f = bt.foe, m = bt.mine, st = bt.st;
  const tipos = f.types || DB.SPECIES[f.species]?.types || [];
  const base = DB.SPECIES[f.megaDe || f.species];
  switch (b.regra) {
    case "net": return tipos.includes("ÁGUA") || tipos.includes("INSETO") ? 3.5 : 1;
    case "dive": return st.surfando || DB.MAPS?.[st.player?.map]?.submerso ? 3.5 : 1;
    case "nest": return Math.max(1, (41 - (f.level || 1)) / 10);
    case "repeat": return st.caught?.[f.species] ? 3.5 : 1;
    case "timer": return Math.min(4, 1 + (bt.nTurno || 0) * 0.3);
    case "dusk": { let noite = false; try { noite = agora().noite; } catch {} return noite || DB.MAPS?.[st.player?.map]?.interior ? 3 : 1; }
    case "quick": return (bt.nTurno || 0) === 0 ? 5 : 1;
    case "fast": return (base?.base?.spe || 0) >= 100 ? 4 : 1;
    case "level": { const a = m?.level || 1, d = f.level || 1; return a >= d * 4 ? 8 : a >= d * 2 ? 4 : a > d ? 2 : 1; }
    case "heavy": { const kg = pesoDe(f.species) || 0; return kg >= 300 ? 4 : kg >= 200 ? 3 : kg >= 100 ? 2 : 1; }
    case "moon": return (DB.EVOLUTIONS?.[f.species] || []).some((r) => r.item === "pedra da lua") ? 4 : 1;
    case "dream": return f.status ? 4 : 1;        // (o jogo não tem sono: vale qualquer problema)
    case "beast": return ULTRA.has(f.species) ? 5 : 0.1;
    case "rocket": return tipos.includes("SOMBRIO") || tipos.includes("VENENO") ? 3.5 : 1;
    case "alfa": return f.alfa ? 4 : 1;
    case "lenda": return LENDARIOS.has(f.species) ? 5 : 1;
    default: return 1;
  }
}
