// OS AMIGOS — VÍTOR e ANDRÉ, a parte viva. As falas, os lugares e os times
// estão em src/data/amigos.js.
//
// Como o GÊMEO (src/systems/rival.js), eles não são NPCs escritos no mapa: são
// montados na hora. Cada um aparece no encontro mais novo que já destravou pra
// ele; quando a história anda, ele muda de lugar. Vencido, ele fica ali com a
// fala de depois até o próximo encontro destravar.
import { DB } from "../data/index.js";
import { garantirEspecie, partes } from "./fusao.js";
import { ginasiosBrag } from "./rival.js";

const QUEM = ["vitor", "andre"];

/** Ilhas que a IPÊ já recebeu (as `ilha_<id>` de `st.bragBadges`). */
function ilhasEntregues(st) {
  return (st?.bragBadges || []).filter((b) => String(b).startsWith("ilha_")).length;
}

function destravou(st, enc) {
  const r = enc.requer || {};
  if (r.flag && !st?.flags?.[r.flag]) return false;
  if (r.ginasios != null && ginasiosBrag(st) < r.ginasios) return false;
  if (r.ilhas != null && ilhasEntregues(st) < r.ilhas) return false;
  return true;
}

/** O mapa e o ponto de referência do encontro. */
export function lugarDoEncontro(enc) {
  const o = enc.onde || {};
  if (o.cidade) {
    // do lado da porta do ginásio, onde o gêmeo fica nas cidades dele (as
    // dos amigos são as outras: RECIFEEBAS, CARUARU e OURO GASTLY)
    const g = DB.LUGAR_DO_GEMEO?.[o.cidade];
    return g && { mapa: o.cidade, x: g.x + 1, y: g.y, dir: "down" };
  }
  if (o.ilha) {
    // perto de onde a lancha encosta
    const ilha = (DB.ILHAS_BRAG || [])[o.ilha - 1];
    return ilha && { mapa: ilha.id, x: ilha.chegada.x + 2, y: ilha.chegada.y - 2, dir: "down" };
  }
  return o.mapa ? o : null;
}

/** Os encontros de agora de cada um: os de maior `etapa` já destravados (com
 *  `etapa` empatada, ele está nos dois lugares — o VÍTOR fica na praça de São
 *  Lucario E na primeira ilha até a história andar). */
export function encontrosDe(st, quem) {
  const abertos = (DB.AMIGOS?.encontros || []).filter((enc) => enc[quem] && destravou(st, enc));
  const max = Math.max(-1, ...abertos.map((enc) => enc.etapa));
  return abertos.filter((enc) => enc.etapa === max);
}

/** Os amigos que estão neste mapa agora, no formato de NPC do overworld. Só
 *  existem em BRAGLITCH. `livre(x, y)` diz se dá pra ficar num lugar; o
 *  ponto do encontro é um "perto de", e eles procuram o chão livre em volta. */
export function amigosNpcs(st, livre = () => true) {
  const A = DB.AMIGOS, aqui = st?.player?.map;
  if (!A || st?.regiao !== "braglitch" || !aqui || !st.flags?.starterChosen) return [];
  const out = [], usados = new Set();
  for (const quem of QUEM) {
    const enc = encontrosDe(st, quem).find((e) => lugarDoEncontro(e)?.mapa === aqui);
    if (!enc) continue;
    const b = lugarDoEncontro(enc);
    const f = enc[quem], lado = f.lado || {};
    const p = perto(b.x + (lado.dx || 0), b.y + (lado.dy || 0), (x, y) => livre(x, y) && !usados.has(`${x},${y}`));
    usados.add(`${p.x},${p.y}`);
    const npc = {
      id: `amigo_${quem}_${enc.id}`, x: p.x, y: p.y, dir: lado.dir || b.dir || "down",
      sprite: A.sprite[quem],
      lines: f.antes || f.fala,
    };
    // o VÍTOR mostra as tirinhas do caderno dele depois de conversar (TIRINHAS)
    if (quem === "vitor") npc.tirinhas = true;
    const time = (f.time || []).filter(([sp]) => DB.SPECIES[sp] || (partes(sp) && garantirEspecie(sp)))
      .map(([sp, lvl]) => ({ id: sp, lvl }));
    if (time.length) {
      npc.afterLines = f.depois;
      npc.trainer = { name: A.nome[quem], prize: f.premio || 500, sprite: A.sprite[quem], party: time };
    }
    out.push(npc);
  }
  return out;
}

/** O chão livre mais perto de (x0, y0), em anéis. */
function perto(x0, y0, ok) {
  for (let r = 0; r < 8; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        if (ok(x0 + dx, y0 + dy)) return { x: x0 + dx, y: y0 + dy };
      }
    }
  }
  return { x: x0, y: y0 };
}
