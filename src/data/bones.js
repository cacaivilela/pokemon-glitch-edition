// OS PIKACHU DE BONÉ.
//
// Um em cada ilha SEVII, e o boné é o da geração com o número da ilha: ilha 1 o
// de KANTO, ilha 3 o de HOENN, ilha 4 o de SINNOH, e assim por diante.
//
// A CONTA TEM DOIS BURACOS, E ELES SE ENCAIXAM:
//
//   - A ilha 2 pede o boné da geração 2, e o jogo de origem nunca chamou
//     nenhum boné de JOHTO.
//   - A geração 8 pede a ilha 8, e ilha 8 não existe no jogo (são sete).
//
// Então o boné que o jogo de origem chama de PARCEIRO (o da 2ª geração da
// jornada do Ash) fica na ilha 2 como o BONÉ DE JOHTO, e o de GALAR fica em
// BIRTH ISLAND, que é a ilha que vem depois das sete e a que só se alcança de
// barco. Dois furos, duas peças que não tinham lugar: encaixam.
//
// Eles não nascem na grama. Ficam PARADOS, um por ilha, esperando — como os
// lendários deste jogo (ver ESTATICOS em src/data/extra.js). Derrubar sem
// capturar não resolve: saia do mapa e volte, e ele está lá de novo.
//
// O sprite vem pelo `spriteDex`, que é o número da FORMA na PokeAPI e não o da
// Pokédex — o mesmo caminho que as formas MEGA usam.
const TABLE = [
  // id            nome            forma   ilha              x   y   boné
  ["pikakanto",   "PIKA KANTO",   10094, "one_island",     12, 10, "KANTO"],
  ["pikajohto",   "PIKA JOHTO",   10148, "two_island",     24,  9, "JOHTO"],
  ["pikahoenn",   "PIKA HOENN",   10095, "three_island",   10, 20, "HOENN"],
  ["pikasinnoh",  "PIKA SINNOH",  10096, "four_island",    24, 21, "SINNOH"],
  ["pikaunova",   "PIKA UNOVA",   10097, "five_island",    12, 10, "UNOVA"],
  ["pikakalos",   "PIKA KALOS",   10098, "six_island",     12, 15, "KALOS"],
  ["pikaalola",   "PIKA ALOLA",   10099, "seven_island",   14, 10, "ALOLA"],
  ["pikagalar",   "PIKA GALAR",   10160, "birth_island",   15, 15, "GALAR"],
];

/** O CRISTAL Z, e onde ele fica.
 *
 *  ILHA NOVE é a ROCHA NAVEL: a última pedra do arquipélago, a que não tem
 *  nada — nem cidade, nem loja, nem grama. Só uma escada que sobe. O cristal
 *  está lá em cima.
 *
 *  A ilha em si está com as outras, em src/data/sevii.js, marcada `pedeBone`.
 *  A BALSA SÓ TE LEVA DEPOIS QUE VOCÊ TIVER UM PIKACHU DE BONÉ. Não é uma
 *  trava por trava: o cristal serve pra exatamente uma coisa, e um item que só
 *  funciona com um bicho que você não tem é um item que não faz nada. Assim a
 *  ilha aparece no menu no dia em que ela passa a significar alguma coisa. */
export const CRISTAL = {
  // O nome de verdade dele. Vale a pena usar o oficial aqui: quem procura este
  // item procura por "pikashunium", e um item com nome inventado é um item que
  // não se acha nem na mochila.
  item: "pikashunium z",
  golpe: "dezmilhoes",
  mapa: "navel_rock_summit",
  x: 9, y: 12,
  achou: [
    "NO ALTO DA ROCHA TEM UM CRISTAL AMARELO EM CIMA DE UMA PEDRA LISA.",
    "ELE ESTALA QUANDO VOCÊ CHEGA PERTO — E É O MESMO ESTALO DO BONÉ.",
    "VOCÊ PEGOU O PIKASHUNIUM Z!",
  ],
  usou: "{MON} ERGUEU O BONÉ. O CRISTAL RESPONDE.",
  semDono: "O CRISTAL NÃO ESTALA. ELE SÓ RESPONDE A UM PIKACHU DE BONÉ.",
  jaUsou: "O CRISTAL JÁ DEU O QUE TINHA NESTA BATALHA.",
};

/** Os stats são os do PIKACHU, sem mudança. O boné é um boné: ele não deixa
 *  ninguém mais forte, e fingir que deixa seria transformar uma coleção numa
 *  lista de compras. O que muda é onde ele está e quantos você achou. */
const BASE = { hp: 35, atk: 55, def: 40, spa: 50, spd: 50, spe: 90 };

/** OS RAICHU DE BONÉ. No jogo de origem o Pikachu de boné não evolui — o boné
 *  é um item de coleção e a Game Freak não desenhou um Raichu pra ele. Aqui
 *  evolui: PEDRA DO TROVÃO, como qualquer Pikachu, e o boné vai junto (ele não
 *  tira nem pra dormir, não ia tirar pra evoluir). Os stats são os do RAICHU;
 *  o sprite não existe em lugar nenhum, então é montado por
 *  tools/bones_raichu.py — o boné recortado do Pikachu, colado na cabeça do
 *  Raichu — e gravado com o número do Pikachu de boné + RAI_SALTO. */
const BASE_RAICHU = { hp: 60, atk: 90, def: 55, spa: 90, spd: 80, spe: 110 };
const RAI_SALTO = 10000;
export const RAI_ITEM = "pedra do trovão";

/** O PIKA ALOLA é a exceção: um Pikachu criado em Alola vira RAICHU-ALOLA, de
 *  boné ou sem. Então o RAI ALOLA é o RAICHU-ALOLA (ELÉTRICO/PSÍQUICO, os stats
 *  dele, o sprite dele com o boné em cima) — e não o Raichu de Kanto. */
const ALOLA = {
  id: "pikaalola",
  types: ["ELÉTRICO", "PSÍQUICO"],
  base: { hp: 60, atk: 85, def: 50, spa: 95, spd: 85, spe: 110 },
  dexText: "EVOLUIU DO JEITO DE ALOLA E O BONÉ DE ALOLA FICOU. SURFA NO PRÓPRIO RABO, DE BONÉ.",
};

/** OS PICHU DE BONÉ. Um PIKA de boné (ou o RAI dele) com um DITTO na creche
 *  bota um ovo, e o ovo choca a forma MÍNIMA da linha: um PICHU — com o boné,
 *  porque o boné é da linha, não do bicho. Ele vira o PIKA de boné de novo por
 *  AMIZADE (src/data/evolution.js), no nível de amizade que a linha pede.
 *  Stats do PICHU; o sprite é montado por tools/bones_raichu.py com o número
 *  do boné do Pikachu + PICHU_SALTO. */
const BASE_PICHU = { hp: 20, atk: 40, def: 15, spa: 35, spd: 35, spe: 60 };
const PICHU_SALTO = 20000;
export const AMIZADE_PICHU = 65;

/** Todo Pichu, Pikachu e Raichu de boné, pra quem precisar perguntar "este é de boné?". */
export const EH_BONE = new Set(TABLE.flatMap((l) => [l[0], l[0].replace(/^pika/, "rai"), l[0].replace(/^pika/, "pichu")]));

export const BONES_ESPECIES = {};
export const BONES_ESTATICOS = [];
/** pikaX -> raiX por pedra do trovão (entra em src/data/evolution.js) */
export const EVO_BONES = {};
for (const [id, nome, forma, mapa, x, y, bone] of TABLE) {
  const rai = id.replace(/^pika/, "rai");
  BONES_ESPECIES[id] = {
    id, dex: 25, spriteDex: forma, name: nome, types: ["ELÉTRICO"],
    base: { ...BASE }, bst: Object.values(BASE).reduce((a, b) => a + b, 0),
    catchRate: 190, xpYield: 112, foreign: true,
    dexText: `O MESMO PIKACHU DE SEMPRE, COM O BONÉ DE ${bone}. ELE NÃO TIRA NEM PRA DORMIR.`,
  };
  const alola = id === ALOLA.id;
  const baseRai = alola ? ALOLA.base : BASE_RAICHU;
  BONES_ESPECIES[rai] = {
    id: rai, dex: 26, spriteDex: forma + RAI_SALTO, name: nome.replace(/^PIKA/, "RAI"),
    types: alola ? [...ALOLA.types] : ["ELÉTRICO"],
    base: { ...baseRai }, bst: Object.values(baseRai).reduce((a, b) => a + b, 0),
    catchRate: 75, xpYield: 121, foreign: true,
    dexText: alola ? ALOLA.dexText : `EVOLUIU E O BONÉ DE ${bone} FICOU. FICOU APERTADO, MAS FICOU.`,
  };
  EVO_BONES[id] = [{ item: RAI_ITEM, to: rai }];
  const pichu = id.replace(/^pika/, "pichu");
  BONES_ESPECIES[pichu] = {
    id: pichu, dex: 172, spriteDex: forma + PICHU_SALTO, name: nome.replace(/^PIKA/, "PICHU"), types: ["ELÉTRICO"],
    base: { ...BASE_PICHU }, bst: Object.values(BASE_PICHU).reduce((a, b) => a + b, 0),
    catchRate: 190, xpYield: 41, foreign: true,
    dexText: `NASCEU COM O BONÉ DE ${bone}. O BONÉ É GRANDE DEMAIS PRA ELE, E ELE NÃO LIGA.`,
  };
  EVO_BONES[pichu] = [{ amizade: AMIZADE_PICHU, to: id }];
  BONES_ESTATICOS.push({
    id, mapa, x, y, nivel: 25,
    lines: [
      `TEM UM PIKACHU PARADO AQUI, DE BONÉ.`,
      `É O BONÉ DE ${bone}. ELE VIU VOCÊ E NÃO SAIU DO LUGAR.`,
    ],
  });
}
