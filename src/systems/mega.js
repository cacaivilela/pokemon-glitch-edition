// MEGA EVOLUÇÃO — a parte viva. Os dados (formas, pedras, stats) estão em
// src/data/mega.js.
//
// Mega evoluir é trocar a espécie do Pokémon por uma forma MEGA e guardar de
// onde ele veio em `mon.megaDe`. Como a espécie muda, `recalc` já devolve os
// stats e os tipos novos — o resto do jogo (dano, tabela de tipos, sprite) não
// precisa saber de nada. No fim da batalha ele volta a ser o que era.
//
// Regra de ouro: NINGUÉM fica megado fora da batalha. `reverterTudo` é chamado
// ao carregar o save e ao fim da luta, porque a aba pode ser fechada no meio.
import { DB } from "../data/index.js";
import { recalc } from "./mon.js";
import { todosGuardados } from "./box.js";

export const temAnel = (state) => (state?.items?.[DB.MEGA_ANEL] || 0) > 0;
export const estaMegado = (mon) => !!mon?.megaDe;

/** As formas que este Pokémon pode assumir AGORA: precisa do anel e da pedra. */
export function opcoesMega(state, mon) {
  if (!mon || mon.megaDe || !temAnel(state)) return [];
  return (DB.MEGAS?.[mon.species] || []).filter((r) => (state.items?.[r.pedra] || 0) > 0);
}

/** Todas as formas da espécie, tendo pedra ou não (pra Pokédex e textos). */
export const formasDe = (id) => DB.MEGAS?.[id] || [];

export function megaEvoluir(mon, to) {
  const forma = DB.SPECIES?.[to];
  if (!mon || !forma || mon.megaDe) return null;
  const de = mon.species;
  mon.megaDe = de;
  mon.species = to;
  recalc(mon);
  mon.hp = Math.min(mon.hp, mon.maxHp);   // a MEGA não mexe no HP, mas dado velho pode
  return { de, forma: forma.name };
}

export function reverterMega(mon) {
  if (!mon?.megaDe) return null;
  const de = mon.megaDe;
  delete mon.megaDe;
  if (!DB.SPECIES?.[de]) return null;     // espécie sumiu dos dados: deixa como está
  mon.species = de;
  recalc(mon);
  mon.hp = Math.min(mon.hp, mon.maxHp);
  return DB.SPECIES[de].name;
}

/** Rede de segurança: desmega equipe e PC inteiros. */
export function reverterTudo(state) {
  if (!state) return;
  for (const mon of [...(state.party || []), ...todosGuardados(state)]) reverterMega(mon);
}

/** As megapedras que o professor deve pra você: uma por linhagem inicial que
 *  você tem na equipe ou no PC. CHARMANDER vale as duas do CHARIZARD. */
export function pedrasIniciaisDevidas(state) {
  const donos = new Set([...(state.party || []), ...todosGuardados(state)].map((m) => m.megaDe || m.species));
  const jaDadas = new Set(state.flags?.pedrasIniciais || []);
  const devidas = [];
  for (const [linha, especies] of Object.entries(LINHAS_INICIAIS)) {
    if (!especies.some((id) => donos.has(id))) continue;
    for (const r of DB.MEGAS?.[linha] || []) {
      if (!jaDadas.has(r.pedra) && !devidas.includes(r.pedra)) devidas.push(r.pedra);
    }
  }
  return devidas;
}

/** de qual inicial cada linhagem vem (a MEGA está sempre na forma final) */
const LINHAS_INICIAIS = {
  venusaur: ["bulbasaur", "ivysaur", "venusaur"],
  charizard: ["charmander", "charmeleon", "charizard"],
  blastoise: ["squirtle", "wartortle", "blastoise"],
};
