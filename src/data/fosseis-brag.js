// OS FÓSSEIS DE BRAGLITCH. A terra daqui guardou em pedra três bichos que
// Kanto nunca viu, e eles só saem da parede de pedra deste lado do mar (a
// mina, src/scenes/mineracao.js, sorteia o que tem `onde: "braglitch"` só em
// Braglitch). Quem revive é o PALEONTÓLOGO de OURO GASTLY, a cidade das
// minas, com o MINEIRO do lado emprestando a picareta.
//
//   FÓSSIL DENTE GIGANTE -> GIGANTINY (SOMBRIO) -> GIGANTEETH (AÇO/SOMBRIO), N39
//   FÓSSIL BLINDADO      -> BLINDINO (PEDRA)    -> STEGARMOREX (PEDRA/AÇO), N39
//   FÓSSIL PENUGEM MIRAGEM -> GALLINY (NORMAL)  -> GALLIMIRAGE (NORMAL/PSÍQUICO), N39
//
// As espécies e a evolução moram em src/data/braglitch.js; os desenhos em
// tools/braglitch_desenhos/lote_32.py.

/** o que o laboratório revive de cada fóssil daqui (entra em FOSSEIS, src/data/mineracao.js) */
export const FOSSEIS_BRAG = {
  "fóssil dente gigante": { especie: "gigantiny", nivel: 20 },
  "fóssil blindado": { especie: "blindino", nivel: 20 },
  "fóssil penugem miragem": { especie: "galliny", nivel: 20 },
};

/** os achados da parede (entram em ACHADOS, src/data/mineracao.js) */
export const ACHADOS_BRAG = [
  { item: "fóssil dente gigante", w: 10, cor: "#e8e0cc", desenho: "dente", forma: [[0, 0], [0, 1]], onde: "braglitch" },
  { item: "fóssil blindado", w: 10, cor: "#a89878", desenho: "blindado", forma: [[0, 0], [1, 0], [0, 1], [1, 1]], onde: "braglitch" },
  { item: "fóssil penugem miragem", w: 10, cor: "#d8c8a8", desenho: "penugem", forma: [[0, 0], [1, 0]], onde: "braglitch" },
];

/** o que a mochila diz de cada um */
export const LORE_BRAG = {
  "fóssil dente gigante": "UM DENTE DO TAMANHO DE UM BRAÇO, SERRILHADO, VIRADO PEDRA. NÃO É DE KANTO. EM OURO GASTLY VIRA GIGANTINY.",
  "fóssil blindado": "UMA PLACA DE COSTAS LARGA E GROSSA, CHEIA DE ESCAMA, VIRADA PEDRA. NÃO É DE KANTO. EM OURO GASTLY VIRA BLINDINO.",
  "fóssil penugem miragem": "UMA PEDRA COM A MARCA DE UMA PENA. OLHANDO DE LADO, A MARCA PARECE SE MEXER. NÃO É DE KANTO. EM OURO GASTLY VIRA GALLINY.",
};

/** o MINEIRO e o PALEONTÓLOGO de OURO GASTLY (postos por src/data/braglitch-mundo.js) */
export const OURO_GASTLY_MINA = [
  ["montanhista", ["AQUI EMBAIXO É SÓ MINA VELHA. OURO ACABOU FAZ TEMPO...", "...MAS DE VEZ EM QUANDO SAI UM DENTE DESSE TAMANHO DA PAREDE."],
   { mineracao: true }],
  ["cientista", ["EU ESTUDO OS BICHOS QUE A TERRA DE BRAGLITCH GUARDOU EM PEDRA."],
   { fossil: "braglitch" }],
];

/** as falas do PALEONTÓLOGO de OURO GASTLY (no lugar das da paleontóloga de CINNABAR) */
export const LAB_BRAG_TEXTO = {
  labOferta: [
    "EU RESSUSCITO FÓSSIL. OS DE BRAGLITCH, E OS DE FORA TAMBÉM.",
    "A PAREDE DA MINA AQUI DO LADO TÁ CHEIA DELES. O MINEIRO EMPRESTA A PICARETA.",
  ],
};
