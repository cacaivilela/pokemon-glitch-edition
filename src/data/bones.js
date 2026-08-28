// OS PIKACHU DE BONÉ.
//
// Um em cada ilha SEVII, e o boné é o da geração com o número da ilha: ilha 1 o
// de KANTO, ilha 3 o de HOENN, ilha 4 o de SINNOH, e assim por diante.
//
// A CONTA TEM DOIS BURACOS, E ELES SE ENCAIXAM:
//
//   - A ilha 2 pede o boné da geração 2, e boné de JOHTO nunca existiu.
//   - A geração 8 pede a ilha 8, e ilha 8 não existe no jogo (são sete).
//
// Então o BONÉ PARCEIRO — o único que não é de geração nenhuma — fica na ilha 2,
// e o de GALAR fica em BIRTH ISLAND, que é a ilha que vem depois das sete e a que
// só se alcança de barco. Dois furos, duas peças que não tinham lugar: encaixam.
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
  ["pikaamigo",   "PIKA AMIGO",   10148, "two_island",     24,  9, "PARCEIRO"],
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

/** Todo Pikachu de boné, pra quem precisar perguntar "este é de boné?". */
export const EH_BONE = new Set(TABLE.map((l) => l[0]));

export const BONES_ESPECIES = {};
export const BONES_ESTATICOS = [];
for (const [id, nome, forma, mapa, x, y, bone] of TABLE) {
  BONES_ESPECIES[id] = {
    id, dex: 25, spriteDex: forma, name: nome, types: ["ELÉTRICO"],
    base: { ...BASE }, bst: Object.values(BASE).reduce((a, b) => a + b, 0),
    catchRate: 190, xpYield: 112, foreign: true,
    dexText: `O MESMO PIKACHU DE SEMPRE, COM O BONÉ DE ${bone}. ELE NÃO TIRA NEM PRA DORMIR.`,
  };
  BONES_ESTATICOS.push({
    id, mapa, x, y, nivel: 25,
    lines: [
      `TEM UM PIKACHU PARADO AQUI, DE BONÉ.`,
      `É O BONÉ DE ${bone}. ELE VIU VOCÊ E NÃO SAIU DO LUGAR.`,
    ],
  });
}
