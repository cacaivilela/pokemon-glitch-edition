// A CRECHE DA ROTA 5. Até DOIS Pokémon ficam com o senhor da creche e CRESCEM
// ENQUANTO VOCÊ ANDA: um ponto de experiência por passo, como sempre foi. Lá
// dentro ninguém evolui (evolução é coisa de quem está com você) e golpe novo
// entra sozinho, no lugar do primeiro quando não cabe. Pegar de volta custa
// $100 + $100 por nível ganho, que é a conta do jogo de origem.
//
// OS OVOS. Dois da MESMA ESPÉCIE, ou qualquer um com um DITTO, botam ovo — de
// vez em quando, enquanto você anda. O ovo choca a FORMA MÍNIMA da linha de
// quem não é o Ditto (RAI KANTO + DITTO -> ovo -> PICHU KANTO; VULPIX-ALOLA ->
// VULPIX-ALOLA), seguindo PRE_EVOLUCAO (src/data/evolution.js) até o começo.
// Lendário não cria, tipo GLITCH não cria, fusão não cria, DITTO com DITTO não
// cria. O ovo vai pra mochila como item ("ovo de pichu kanto") e racha pela
// mochila, como o MYSTERY EGG — só que o que sai é sempre aquela espécie,
// nível 5, com a cor sorteada como na grama e amizade zero.
//
// A AMIZADE (mon.amizade, 0..255) é o que faz os bebês evoluírem: sobe
// andando com você na equipe, vencendo batalhas e subindo de nível.
//
// A casa da creche não veio com os mapas importados (a porta está trancada),
// então o senhor fica NA FRENTE dela, na rota — e é ele quem cuida de tudo.
import { DB } from "../data/index.js";
import { LENDARIOS } from "../data/leilao.js";
import { gainXp, createMon, sortearBrilho } from "./mon.js";
import { partes } from "./fusao.js";
import { chance } from "../core/rng.js";

export const CRECHE = {
  capacidade: 2,
  base: 100,           // o que ele cobra só por ter cuidado
  porNivel: 100,       // mais isto por nível ganho
  xpPorPasso: 1,
  ovo: { aCada: 256, chance: 0.5 },   // a cada N passos com um casal, esta chance de ovo
  nivelDoOvo: 5,
  amizade: { passos: 64, porPasso: 1, porVitoria: 2 },   // +1 a cada 64 passos; +2 por vitória
};

const cx = (st) => (st.creche ||= { mons: [], passos: 0, ovoPassos: 0, ovo: null });

/** quem está lá (lista, 0..2) */
export const naCreche = (st) => (st?.creche?.mons || []).filter(Boolean);
export const temVaga = (st) => naCreche(st).length < CRECHE.capacidade;

/** deixa um da equipe (índice) com ele */
export function deixar(st, idx) {
  const mon = st.party[idx];
  if (!mon || st.party.length <= 1 || !temVaga(st)) return null;
  st.party.splice(idx, 1);
  const c = cx(st);
  c.mons.push(mon);
  c.entrada ||= {};
  c.entrada[mon.seed] = mon.level;
  return mon;
}

export const niveisGanhos = (st, mon) => mon.level - (st?.creche?.entrada?.[mon.seed] ?? mon.level);
export const precoDeVolta = (st, mon) => CRECHE.base + CRECHE.porNivel * niveisGanhos(st, mon);

/** paga e leva de volta pra equipe; null se não deu (dinheiro, equipe cheia) */
export function pegar(st, mon) {
  const c = st?.creche;
  if (!c || !c.mons.includes(mon)) return null;
  const preco = precoDeVolta(st, mon);
  if (st.money < preco || st.party.length >= 6) return null;
  st.money -= preco;
  c.mons = c.mons.filter((m) => m !== mon);
  delete c.entrada?.[mon.seed];
  c.ovoPassos = 0;
  st.party.push(mon);
  return { mon, preco };
}

// ---------------------------------------------------------------- os ovos
/** a forma mínima da linha daquela espécie */
export function formaMinima(species) {
  const PRE = DB.PRE_EVOLUCAO || {};
  let id = species;
  for (let i = 0; i < 6 && PRE[id] && DB.SPECIES[PRE[id]]; i++) id = PRE[id];
  return id;
}

const naoCria = (m) => {
  const sp = DB.SPECIES[m.species];
  return !sp || sp.megaDe || sp.crescimento || partes(m.species) || LENDARIOS.has(m.species)
    || (sp.types || []).includes("GLITCH");
};

/** o que o casal daria: a espécie do filhote, ou null se não combinam */
export function filhoteDe(a, b) {
  if (!a || !b || naoCria(a) || naoCria(b)) return null;
  const dittoA = a.species === "ditto", dittoB = b.species === "ditto";
  if (dittoA && dittoB) return null;
  if (dittoA) return formaMinima(b.species);
  if (dittoB) return formaMinima(a.species);
  if (a.species !== b.species) return null;
  return formaMinima(a.species);
}
export const casal = (st) => { const [a, b] = naCreche(st); return filhoteDe(a, b); };

/** o item do ovo daquela espécie, e o contrário */
export const itemDoOvo = (species) => `ovo de ${DB.SPECIES[species].name.toLowerCase()}`;
export function especieDoOvo(item) {
  if (!item?.startsWith?.("ovo de ")) return null;
  const nome = item.slice(7).toUpperCase();
  return Object.values(DB.SPECIES).find((sp) => sp.name === nome && !sp.fusao)?.id || null;
}
export const ehOvo = (item) => !!especieDoOvo(item);

/** racha um ovo: sempre aquela espécie, nível 5, cor sorteada como na grama */
export function chocar(item) {
  const id = especieDoOvo(item);
  if (!id) return null;
  const mon = createMon(id, CRECHE.nivelDoOvo, sortearBrilho());
  mon.amizade = 0;
  return mon;
}

// ---------------------------------------------------------------- os passos
/** um passo seu: quem está na creche ganha experiência, o casal pode botar
 *  ovo, e quem anda COM você fica mais amigo. Devolve { ovo, amigos } — o ovo
 *  novo (espécie) e quem cruzou o nível de amizade que evolui. */
export function andou(st) {
  const out = { ovo: null, amigos: [] };
  const c = st?.creche;
  if (c) {
    c.passos = (c.passos || 0) + 1;
    for (const mon of c.mons) {
      if (mon.level >= 100) continue;
      for (const ev of gainXp(mon, CRECHE.xpPorPasso)) {
        if (ev.type === "moveFull") {
          mon.moves.shift();
          mon.moves.push({ id: ev.id, pp: DB.MOVES[ev.id].pp, ppMax: DB.MOVES[ev.id].pp });
        }
      }
    }
    const filhote = casal(st);
    if (filhote && !c.ovo) {
      c.ovoPassos = (c.ovoPassos || 0) + 1;
      if (c.ovoPassos >= CRECHE.ovo.aCada) {
        c.ovoPassos = 0;
        if (chance(CRECHE.ovo.chance)) { c.ovo = filhote; out.ovo = filhote; }
      }
    }
  }
  // a amizade de quem anda com você
  st.amizadePassos = (st.amizadePassos || 0) + 1;
  if (st.amizadePassos >= CRECHE.amizade.passos) {
    st.amizadePassos = 0;
    for (const mon of st.party || []) {
      const antes = mon.amizade || 0;
      mon.amizade = Math.min(255, antes + CRECHE.amizade.porPasso);
      const r = (DB.EVOLUTIONS?.[mon.species] || []).find((x) => x.amizade);
      if (r && antes < r.amizade && mon.amizade >= r.amizade) out.amigos.push(mon);
    }
  }
  return out;
}

/** vitória: quem lutou gosta mais de você */
export function venceu(mon) {
  if (mon) mon.amizade = Math.min(255, (mon.amizade || 0) + CRECHE.amizade.porVitoria);
}

/** o senhor entrega o ovo que estava segurando: vira item na mochila */
export function entregarOvo(st) {
  const c = st?.creche;
  if (!c?.ovo) return null;
  const item = itemDoOvo(c.ovo);
  st.items[item] = Math.min(999, (st.items[item] || 0) + 1);
  const especie = c.ovo;
  c.ovo = null;
  return { item, especie };
}
