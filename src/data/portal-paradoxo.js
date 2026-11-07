// O PORTAL PARADOXO (ideia do CAIO, o PÓS-PÓS-GAME: src/data/pos-pos.js).
// Abre na praia de SÃO LUCARIO depois da briga do KYOGRE com o GROUDON. Você
// dá QUATRO ITENS; cada um vira uma RUNA; a COMBINAÇÃO das quatro runas (a
// ordem não importa) leva pra um mapa secreto, onde mora um POKÉMON SECRETO
// (inventado aqui — `RECEITAS`). Combinação que não leva a lugar nenhum: o
// portal brilha, devolve os itens e fecha.
//
// As runas são as que o CAIO pediu (as bolas e as frutas) e as que eu
// inventei (UNOWN, DOCE, FÓSSIL, OURO, MEGA). Cada uma tem o símbolo dela,
// desenhado pixel por pixel numa grade de 7x7 (`#` = traço).

export const PORTAL = {
  mapa: "sao_lucario", x: 25, y: 20,
  requer: "ppAcabou",              // a briga do pós-pós-game vencida
  nivel: 70,
  textos: {
    olha: [
      "UM REDEMOINHO DE LUZ EM PÉ NA AREIA. ELE ZUNE BAIXINHO.",
      "EM VOLTA DELE, QUATRO BURACOS NA AREIA, CADA UM DO TAMANHO DE UM ITEM.",
    ],
    titulo: "PORTAL PARADOXO",
    ajuda: "Z PÕE   X TIRA   ",
    escolhe: "QUAL ITEM VIRA RUNA?",
    semItem: "VOCÊ NÃO TEM NENHUM ITEM QUE VIRA RUNA. BOLAS, BERRIES, PEDRAS, DOCES, FÓSSEIS, PEPITAS, MEGAPEDRAS...",
    ativar: "ATIVAR AS RUNAS {RUNAS}?",
    sim: ["ATIVAR", "AINDA NÃO"],
    abriu: ["AS QUATRO RUNAS ACENDEM AO MESMO TEMPO!", "O PORTAL SE ABRE E TE PUXA PRA DENTRO!"],
    naoAbriu: ["AS RUNAS GIRAM... E APAGAM.", "ESSA COMBINAÇÃO NÃO LEVA A LUGAR NENHUM. O PORTAL DEVOLVEU OS ITENS."],
    // runas que não batem: o portal cospe um BIZARRO (src/systems/bizarro.js)
    bizarro: ["AS RUNAS NÃO COMBINAM... O PORTAL ENGASGA, TREME...", "...E CUSPE UMA COISA PRA FORA! É UM {MON}?!"],
    aindaNao: ["AS RUNAS GIRAM E O PORTAL TREME, COMO SE TIVESSE ALGUÉM DO OUTRO LADO...", "...MAS ELE AINDA NÃO SE ABRE. O ITENS VOLTARAM PRA SUA MÃO."],
    volta: "UM PORTAL PEQUENO, DE VOLTA PRA SÃO LUCARIO. ENTRAR?",
    simVolta: ["ENTRAR", "FICAR"],
  },
};

/** As RUNAS: o nome, a cor e o símbolo (7x7) */
export const RUNAS = {
  poke: { nome: "POKÉ", cor: "#e84040", desenho: [
    "..###..", ".#...#.", "#.....#", "###.###", "#.....#", ".#...#.", "..###..",
  ] },
  great: { nome: "GREAT", cor: "#3a78e0", desenho: [
    "..###..", ".##.##.", "#.....#", "###.###", "#.....#", ".#...#.", "..###..",
  ] },
  ultra: { nome: "ULTRA", cor: "#f0c830", desenho: [
    "#.....#", "#.....#", "#######", "#..#..#", "#.....#", "#.....#", "#.....#",
  ] },
  master: { nome: "MASTER", cor: "#a050e0", desenho: [
    "#.....#", "##...##", "#.#.#.#", "#..#..#", "#.....#", "#.....#", "#.....#",
  ] },
  fruit: { nome: "FRUIT", cor: "#e86a9a", desenho: [
    "...##..", "..#....", ".#####.", "#######", "#######", ".#####.", "..###..",
  ] },
  unown: { nome: "UNOWN", cor: "#8a8a9a", desenho: [
    "...#...", "..###..", ".#...#.", "#..#..#", ".#...#.", "..###..", "#..#..#",
  ] },
  doce: { nome: "DOCE", cor: "#40c8e0", desenho: [
    ".......", "#.....#", "##.#.##", "#######", "##.#.##", "#.....#", ".......",
  ] },
  fossil: { nome: "FÓSSIL", cor: "#b08850", desenho: [
    ".#####.", "#.....#", "#.###.#", "#.#.#.#", "#.#...#", "#.####.", ".#.....",
  ] },
  ouro: { nome: "OURO", cor: "#f0a020", desenho: [
    "..##...", ".####..", "######.", "#######", ".######", "..####.", "...##..",
  ] },
  mega: { nome: "MEGA", cor: "#50d070", desenho: [
    "#.....#", ".#...#.", "..#.#..", "...#...", "..#.#..", ".#...#.", "#.....#",
  ] },
};

/** A runa que um item vira (ou null): as bolas, qualquer BERRY (FRUIT), as
 *  PEDRAS de evolução (elas têm letras UNOWN gravadas), o DOCE RARO, os
 *  FÓSSEIS, as PEPITAS (OURO) e as MEGAPEDRAS. */
export function runaDoItem(item, megas = {}) {
  const n = String(item).toLowerCase();
  if (n === "poké bola") return "poke";
  if (n === "great ball") return "great";
  if (n === "ultra ball") return "ultra";
  if (n === "master ball") return "master";
  if (n.endsWith(" berry")) return "fruit";
  if (/^pedra d[aeo] /.test(n)) return "unown";
  if (n === "doce raro") return "doce";
  if (/^f[óo]ssil /.test(n)) return "fossil";
  if (n === "pepita" || n === "pepita grande") return "ouro";
  if (megas[item]) return "mega";
  return null;
}

/** a chave de uma combinação: as quatro runas em ordem alfabética */
export const chaveRunas = (runas) => [...runas].sort().join("+");

// ------------------------------------------------------------ AS RECEITAS
// Cada combinação de quatro runas leva pra um MAPA SECRETO (o mesmo gerador das
// ERAS: src/data/index.js, `eraMap`; o desenho é o `eraArt` com a paleta de
// cada um) e lá mora o POKÉMON SECRETO dela. Os Pokémon são inventados aqui e
// entram um por um (src/data/portal-secretos.js); receita de Pokémon que ainda
// não existe não abre (o portal treme: "tem alguém do outro lado...").
const GEO = (seed, extra = {}) => ({
  w: 30, h: 26, seed, escala: 5, mato: 0.62, pedra: 0.8,
  entrada: { x: 15, y: 22 }, guardiao: { x: 15, y: 5 }, ...extra,
});

const PALETA = (chao, mato, pedra, agua, espuma, faisca) => ({ chao, mato, pedra, agua, espuma, faisca, faiscaChance: 0.03 });

export const RECEITAS = [
  {
    id: "runas", runas: ["unown", "unown", "unown", "unown"], especie: "runaglifo", nomeMapa: "RUÍNA DAS RUNAS",
    geo: GEO(1105, { mato: 0.7, pedra: 0.72 }),
    paleta: PALETA(["#4a4660", "#544f6c", "#3e3a52", "#5e5878"], ["#2e3a4a", "#36465a", "#26303e"],
                   ["#6a6488", "#7a74a0", "#565072"], ["#203048", "#283a56", "#18263a"], "#38e8f0", "#38e8f0"),
    chegada: ["PEDRAS DE PÉ POR TODO LADO, TODAS COM LETRAS.", "AS LETRAS SE MEXEM QUANDO VOCÊ NÃO ESTÁ OLHANDO."],
    encontro: ["UMA PEDRA FLUTUANDO NO FIM DA RUÍNA. ELA ABRE UM OLHO SÓ.", "AS LETRAS EM VOLTA DELA ESCREVEM: \"QUEM?\""],
  },
  {
    id: "bolas", runas: ["poke", "great", "ultra", "master"], especie: "pokemimo", nomeMapa: "DEPÓSITO DE BOLAS",
    geo: GEO(1106, { mato: 0.75 }),
    paleta: PALETA(["#d8d8e0", "#e4e4ec", "#c8c8d4", "#eeeef4"], ["#c84848", "#d85858", "#a83838"],
                   ["#3a3a48", "#4a4a5a", "#2a2a36"], ["#3a68c8", "#4a78d8", "#2a58b0"], "#f0c830", "#f0c830"),
    chegada: ["O CHÃO É LISO E BRANCO COMO A PARTE DE BAIXO DE UMA POKÉ BOLA.", "TEM BOLA ABERTA, VAZIA, ESPALHADA POR TODO LADO."],
    encontro: ["UMA BOLA DO TAMANHO DE VOCÊ ESTÁ PARADA NO MEIO DO DEPÓSITO.", "ELA ABRE UM POUQUINHO... E TE OLHA DE DENTRO."],
  },
  {
    id: "frutas", runas: ["fruit", "fruit", "fruit", "fruit"], especie: "fruteiro", nomeMapa: "POMAR SEM FIM",
    geo: GEO(1107, { mato: 0.5, pedra: 0.86 }),
    paleta: PALETA(["#5a8a3a", "#649a40", "#4e7a32", "#70a848"], ["#2e6a2a", "#3a7a30", "#245a22"],
                   ["#6a4a2a", "#7a5a34", "#5a3e22"], ["#3a8ab0", "#4a9ac0", "#2a7aa0"], "#f080c0", "#f05a4a"),
    chegada: ["ÁRVORE ATÉ ONDE A VISTA ALCANÇA. CADA UMA DÁ UMA FRUTA DIFERENTE.", "O AR TEM CHEIRO DE SUCO."],
    encontro: ["UMA DAS ÁRVORES SE MEXE. ELA TEM OLHOS — E TE OFERECE UMA FRUTA.", "...ANTES DE VOCÊ PEGAR, ELA PUXA A FRUTA DE VOLTA. QUER BRINCAR."],
  },
  {
    id: "ouro", runas: ["fossil", "fossil", "ouro", "ouro"], especie: "aurossauro", nomeMapa: "VALE DOURADO",
    geo: GEO(1108, { mato: 0.78, pedra: 0.7 }),
    paleta: PALETA(["#a8823a", "#b89044", "#987432", "#c89e4e"], ["#7a6a2a", "#8a7a32", "#6a5a22"],
                   ["#5a4a3a", "#6a5a46", "#4a3c2e"], ["#3a6a7a", "#4a7a8a", "#2a5a6a"], "#ffe080", "#ffe060"),
    chegada: ["O CHÃO BRILHA. É AREIA DE OURO, MOLE COMO A DA PRAIA.", "TEM OSSO GIGANTE ENTERRADO PELA METADE. DE OURO TAMBÉM."],
    encontro: ["O ESQUELETO DOURADO DO FUNDO DO VALE LEVANTA A CABEÇA.", "OS OSSOS FAZEM BARULHO DE MOEDA QUANDO ELE SE MEXE."],
  },
  {
    id: "doces", runas: ["doce", "doce", "fruit", "fruit"], especie: "doceronte", nomeMapa: "CAMPO DE AÇÚCAR",
    geo: GEO(1109, { mato: 0.6 }),
    paleta: PALETA(["#f0b8d0", "#f4c4da", "#e8a8c4", "#f8d0e2"], ["#a8e0f0", "#b8ecf8", "#90d0e4"],
                   ["#c86a9a", "#d87aaa", "#b05a88"], ["#f8f0c0", "#fff8d0", "#f0e8b0"], "#ffffff", "#ff80c0"),
    chegada: ["A GRAMA É DE ALGODÃO-DOCE. AS PEDRAS SÃO DE BALA.", "TUDO GRUDA UM POUQUINHO NO SAPATO."],
    encontro: ["UM RINOCERONTE COR-DE-ROSA, COM UM PIRULITO NO LUGAR DO CHIFRE, RASPA A PATA NO CHÃO.", "ELE SENTIU O CHEIRO DE FRUTA NA SUA MOCHILA!"],
  },
];
