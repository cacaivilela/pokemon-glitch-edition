// A TROCA SURPRESA (o treinador de src/data/trocas.js com `aleatoria`): você
// manda qualquer Pokémon da equipe e volta um sorteado, no mesmo nível. Dá
// pra trocar quantas vezes quiser.
//
// Quem pode sair no sorteio: toda espécie que se pega no jogo — Kanto, as
// outras regiões, as formas -BRAG, as regionais. Ficam de fora os lendários
// e os míticos (a lista de src/data/leilao.js, e todo mundo de total 570 pra
// cima — fora os PSEUDO-LENDÁRIOS, que são bicho de mato), as
// formas que só existem em batalha (MEGA, CARDUME, HERÓI), fusão, hackeana e
// FORMA ÚNICA (essas têm dono). Shiny e LUMINOSO saem com a sorte normal.
import { DB } from "../data/index.js";
import { LENDARIOS } from "../data/leilao.js";
import { createMon, sortearBrilho } from "./mon.js";

let sorteaveis = null;

// total 600, mas são bicho de mato (o DARKRAI, também 600, não é)
const PSEUDOS = new Set(["dragonite", "tyranitar", "salamence", "metagross", "garchomp", "hydreigon",
  "goodra", "kommoo", "dragapult", "baxcalibur"]);

function lista() {
  if (sorteaveis) return sorteaveis;
  sorteaveis = Object.values(DB.SPECIES).filter((sp) => sp?.id && (sp.dex || sp.spriteDex)
    && !LENDARIOS.has(sp.id) && ((sp.bst || 0) < 570 || PSEUDOS.has(sp.id))
    && !sp.megaDe && !sp.formaDe && !sp.fusao && !sp.crescimento && !sp.hack
    && !sp.soEvolucao && !sp.unicaDe && !sp.glitch && sp.id !== "missingno")
    .map((sp) => sp.id);
  return sorteaveis;
}

/** o Pokémon que sai da troca, no nível de quem foi (nunca a mesma espécie) */
export function sortearDaTroca(meu) {
  const opcoes = lista().filter((id) => id !== meu.species);
  const id = opcoes[Math.floor(Math.random() * opcoes.length)];
  return createMon(id, meu.level, sortearBrilho());
}
