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
import { idFusao, partes, garantirEspecie } from "./fusao.js";

export const temAnel = (state) => (state?.items?.[DB.MEGA_ANEL] || 0) > 0;

/** As formas que este Pokémon pode assumir AGORA: precisa do anel e da pedra.
 *  Primeiro as dele; depois as MEGAS EMPRESTADAS (ideia do CAIO: "usar a
 *  blastoisita no charizard"): a pedra de outra espécie vira uma FUSÃO dele
 *  com aquela mega — CHARIZARD + MEGA BLASTOISE —, só durante a luta. Quem
 *  pode usar cada pedra está em DB.MEGAS_EMPRESTADAS (src/data/mega.js). */
export function opcoesMega(state, mon) {
  if (!mon || mon.megaDe || !temAnel(state)) return [];
  const tem = (p) => (state.items?.[p] || 0) > 0;
  const minhas = (DB.MEGAS?.[mon.species] || []).filter((r) => tem(r.pedra));
  return [...minhas, ...megasEmprestadas(mon, tem)];
}

/** As pedras dos OUTROS que este aqui consegue usar. Fusão não entra (a fita
 *  não dobra duas vezes) e o MISSINGNO. fica de fora dos dois lados. */
function megasEmprestadas(mon, tem) {
  const sp = DB.SPECIES?.[mon.species];
  if (!sp || sp.mega || partes(mon.species) || mon.species === "missingno") return [];
  const lista = [];
  for (const [pedra, forma] of Object.entries(DB.MEGA_PEDRAS || {})) {
    const mega = DB.SPECIES?.[forma];
    if (!tem(pedra) || !mega || mega.megaDe === mon.species || mega.megaDe === "missingno") continue;
    if (!(DB.MEGAS_EMPRESTADAS?.[pedra] || []).includes(mon.species)) continue;   // só quem está na lista
    const to = idFusao(mon.species, forma);
    const fus = garantirEspecie(to);
    if (fus) lista.push({ pedra, to, nome: fus.name, emprestada: true });
  }
  return lista;
}

export function megaEvoluir(mon, to) {
  const forma = DB.SPECIES?.[to] || garantirEspecie(to);   // a emprestada é uma fusão: nasce aqui
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
  const jaDadas = new Set([].concat(state.flags?.pedrasIniciais || []).filter((p) => typeof p === "string"));
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
