// AS FORMAS DO ROTOM e o CATÁLOGO ROTOM.
//
// O ROTOM mora dentro de aparelho. O CATÁLOGO é a revista de eletrodoméstico
// que ele folheia: escolhe um, entra nele e vira outra forma — o forno, a
// máquina de lavar, a geladeira, o ventilador ou o cortador de grama. Não é
// evolução: é o mesmo ROTOM trocando de casa, e o catálogo leva de volta pro
// normal quando você quiser. O catálogo não se gasta.
//
// Quem dá o catálogo é um técnico no Centro Pokémon de SÃO LUCARIO DO SUL
// (src/data/braglitch.js). Vale em qualquer lugar, Kanto ou Braglitch.
//
// Os números são os das formas de verdade (todas iguais entre si, e mais
// fortes que o ROTOM solto); o sprite é o da PokeAPI (10008-10012), baixado
// por tools/fetch_sprites.py --only 10008,10009,10010,10011,10012.
//
//   sprite | NOME | TIPOS | HP ATK DEF SPA SPD SPE | como aparece no catálogo
const TABELA = `
10008 | ROTOM-CALOR      | ELÉTRICO/FOGO    | 50 65 107 105 107 86 | FORNO
10009 | ROTOM-LAVAGEM    | ELÉTRICO/ÁGUA    | 50 65 107 105 107 86 | MÁQUINA DE LAVAR
10010 | ROTOM-GELO       | ELÉTRICO/GELO    | 50 65 107 105 107 86 | GELADEIRA
10011 | ROTOM-VENTILADOR | ELÉTRICO/VOADOR  | 50 65 107 105 107 86 | VENTILADOR
10012 | ROTOM-CORTE      | ELÉTRICO/PLANTA  | 50 65 107 105 107 86 | CORTADOR DE GRAMA
`;

const LORE = {
  rotomcalor: "ENTROU NUM FORNO DE MICRO-ONDAS E DESCOBRIU QUE GOSTA DE ESQUENTAR AS COISAS. INCLUSIVE A BRIGA.",
  rotomlavagem: "MORA NA MÁQUINA DE LAVAR. QUANDO ELE CENTRIFUGA, A CASA INTEIRA TREME.",
  rotomgelo: "VIROU GELADEIRA E AGORA CONGELA TUDO O QUE ABRE A PORTA DELE SEM PEDIR.",
  rotomventilador: "O VENTILADOR QUE NUNCA PARA DE GIRAR. SOPRA TÃO FORTE QUE LEVANTA POKÉMON PESADO.",
  rotomcorte: "ENTROU NUM CORTADOR DE GRAMA E SAIU APARANDO O JARDIM DO BAIRRO INTEIRO.",
};

export const ROTOM_FORMAS = {};
/** id -> o nome do aparelho, na ordem do catálogo */
const APARELHO = {};

for (const linha of TABELA.trim().split("\n")) {
  const [sprite, nome, tipos, stats, aparelho] = linha.split("|").map((c) => c.trim());
  const [hp, atk, def, spa, spd, spe] = stats.split(/\s+/).map(Number);
  const id = nome.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const base = { hp, atk, def, spa, spd, spe };
  ROTOM_FORMAS[id] = {
    id, dex: 479, name: nome, types: tipos.split("/"), base, bst: hp + atk + def + spa + spd + spe,
    spriteDex: +sprite, foreign: true, formaDe: "rotom", dexText: LORE[id],
    catchRate: 45, xpYield: 182,
  };
  APARELHO[id] = aparelho;
}

export const CATALOGO = {
  item: "catálogo rotom",
  /** quem o catálogo aceita: o ROTOM, o ROTOM-BRAG e as cinco formas. O
   *  ROTOM-BRAG sai do fio do poste e entra no aparelho igual — e quando sai,
   *  volta pro fio: a forma "normal" é a de onde cada um veio (`rotomBase`). */
  aceita: ["rotom", "rotombrag", ...Object.keys(ROTOM_FORMAS)],
  bases: ["rotom", "rotombrag"],
  opcoes: [["rotom", "ROTOM NORMAL"], ...Object.keys(ROTOM_FORMAS).map((id) => [id, APARELHO[id]])],
  pergunta: "{MON} FOLHEIA O CATÁLOGO. EM QUE APARELHO ELE ENTRA?",
  virou: "{MON} ENTROU NO APARELHO! AGORA É {FORMA}.",
  saiu: "{MON} SAIU DO APARELHO E VOLTOU A SER O ROTOM DE SEMPRE.",
  jaE: "{MON} JÁ ESTÁ NESSA FORMA.",
  nada: "{MON} NÃO SE INTERESSA PELO CATÁLOGO. SÓ UM ROTOM ENTRA EM APARELHO.",
};
