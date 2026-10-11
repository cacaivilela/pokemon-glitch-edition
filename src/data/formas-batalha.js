// AS FORMAS DE BATALHA: Pokémon que mudam de forma sozinhos no meio da luta
// (a regra está em src/systems/formas.js). Como a MEGA, a forma só existe
// dentro da batalha: quem troca guarda a espécie de antes em `mon.megaDe`, e
// o fim da luta (e o carregar do save) devolve a de sempre.
//
//   WISHIWASHI  SOLITÁRIO (a espécie de sempre) <-> CARDUME
//   PALAFIN     ZERO (a espécie de sempre)       ->  HERÓI
//
// O número do sprite é o id de forma da PokeAPI (10127 e 10256).
export const FORMAS_BATALHA = {
  wishiwashicardume: {
    id: "wishiwashicardume", dex: 746, name: "WISHIWASHI", forma: "CARDUME", formaDe: "wishiwashi", megaDe: "wishiwashi",
    types: ["ÁGUA"], base: { hp: 45, atk: 140, def: 130, spa: 140, spd: 135, spe: 30 }, bst: 620,
    spriteDex: 10127, foreign: true, catchRate: 60, xpYield: 61, soEvolucao: true,
    dexText: "SOZINHO ELE É UM PEIXINHO À TOA. QUANDO O PERIGO CHEGA, MIL DELES NADAM JUNTOS E VIRAM UM MONSTRO DO MAR.",
  },
  palafinheroi: {
    id: "palafinheroi", dex: 964, name: "PALAFIN", forma: "HERÓI", formaDe: "palafin", megaDe: "palafin",
    types: ["ÁGUA"], base: { hp: 100, atk: 160, def: 97, spa: 106, spd: 87, spe: 100 }, bst: 650,
    spriteDex: 10256, foreign: true, catchRate: 45, xpYield: 160, soEvolucao: true,
    dexText: "SAI DA LUTA UM GOLFINHO QUALQUER E VOLTA HERÓI, DE CAPA E MÚSCULO. NINGUÉM SABE ONDE ELE SE TROCA.",
  },
};
