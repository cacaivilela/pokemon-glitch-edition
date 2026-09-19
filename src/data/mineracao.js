// A MINERAÇÃO: a parede de pedra do MONTE LUA, a picareta, o martelo e os
// fósseis que estão lá dentro.
//
// A ideia é a do SUBSOLO DE SINNOH: uma parede de terra em cima de uma grade,
// coisa escondida embaixo, e duas ferramentas — a PICARETA, que tira pouco e
// racha pouco, e o MARTELO, que tira muito e racha muito. A parede tem uma
// barra de rachadura; quando ela enche, desaba, e você leva embora só o que
// já tinha destampado por inteiro. Cavar é escolher onde gastar a parede.
//
// POR QUE OS FÓSSEIS VÊM DAQUI, E NÃO DE UM ITEM NO CHÃO
// No FireRed os dois fósseis são um item de chão no MONTE LUA que um
// cientista disputa com você — você fica com um e nunca vê o outro naquele
// save. Aqui a parede não acaba: cada rachada é uma parede nova, sorteada.
// Você pode achar os três fósseis, ou nenhum, e a AERODACTYL deixa de ser um
// âmbar entregue por um cientista pra ser o achado raro da mina. A raridade
// fica na tabela `ACHADOS`, com o peso de cada um, e não em quem falou com
// quem primeiro.
//
// A tela é src/scenes/mineracao.js; a ressurreição é no laboratório de
// CINNABAR (o NPC `fossil` em src/scenes/overworld.js).

export const PAREDE = {
  cols: 12, rows: 8,        // a grade (16px por célula, cabe em 192x128)
  vida: 44,                 // quanto a parede aguenta antes de desabar
  profMin: 1, profMax: 5,   // camadas de terra em cima de cada célula
  achadosMin: 3, achadosMax: 5,   // quantas coisas ficam escondidas
  pedras: 3,                // rochas que não saem e só gastam a parede
  aluguel: 300,             // o que o mineiro cobra depois da primeira vez
};

// As ferramentas: o que cada batida tira do centro, da cruz e das diagonais
// (em camadas), e quanto racha a parede.
export const FERRAMENTAS = {
  picareta: { nome: "PICARETA", centro: 2, cruz: 1, diag: 0, racha: 1 },
  martelo:  { nome: "MARTELO",  centro: 3, cruz: 2, diag: 1, racha: 3 },
};

/** O que fica enterrado. `forma` é a lista de células (dx,dy) que a coisa
 *  ocupa; `w` é o peso no sorteio; `cor` é como ela aparece na parede. */
export const ACHADOS = [
  { item: "fóssil hélix", w: 14, cor: "#c8a878", forma: [[0, 0], [1, 0], [0, 1], [1, 1]] },
  { item: "fóssil domo",  w: 14, cor: "#b8a090", forma: [[0, 0], [1, 0], [0, 1], [1, 1]] },
  { item: "âmbar velho",  w: 4,  cor: "#e0a030", forma: [[0, 0], [1, 0], [0, 1], [1, 1]] },
  { item: "pepita",       w: 10, cor: "#f0d048", forma: [[0, 0]] },
  { item: "pedra do fogo",   w: 6, cor: "#e06040", forma: [[0, 0], [1, 0]] },
  { item: "pedra da água",   w: 6, cor: "#4090e0", forma: [[0, 0], [1, 0]] },
  { item: "pedra do trovão", w: 6, cor: "#e0d040", forma: [[0, 0], [1, 0]] },
  { item: "pedra da folha",  w: 6, cor: "#50c060", forma: [[0, 0], [1, 0]] },
  { item: "pedra da lua",    w: 5, cor: "#d0d0f0", forma: [[0, 0], [0, 1]] },
  { item: "doce raro",       w: 8, cor: "#f080c0", forma: [[0, 0]] },
  { item: "estrela",         w: 6, cor: "#ffe080", forma: [[0, 0], [1, 1]] },
];

/** Os fósseis e o que sai deles no laboratório. */
export const FOSSEIS = {
  "fóssil hélix": { especie: "omanyte", nivel: 20 },
  "fóssil domo": { especie: "kabuto", nivel: 20 },
  "âmbar velho": { especie: "aerodactyl", nivel: 20 },
};

/** O que a mochila diz de cada coisa que sai da mina. */
export const MINA_LORE = {
  "fóssil hélix": "UMA CONCHA EM ESPIRAL VIRADA PEDRA. NO LABORATÓRIO DE CINNABAR ELA VOLTA A SER OMANYTE.",
  "fóssil domo": "UMA CARAPAÇA EM CÚPULA VIRADA PEDRA. NO LABORATÓRIO DE CINNABAR ELA VOLTA A SER KABUTO.",
  "âmbar velho": "RESINA COM UM PEDAÇO DE ASA DENTRO. NO LABORATÓRIO DE CINNABAR VIRA AERODACTYL.",
  "picareta": "A PICARETA DO BALCONISTA DE VIRIDIAN. ESCOLHA ELA NA MOCHILA PRA CAVAR ONDE VOCÊ ESTIVER.",
  "pepita": "UM TORRÃO DE OURO PURO. NÃO SERVE PRA NADA A NÃO SER VENDER, E VENDE BEM.",
  "estrela": "UM PEDAÇO DE ESTRELA QUE CAIU NA MINA. VENDE POR UM BOM PREÇO.",
};

/** Preço de venda dos achados que nenhuma loja vende. */
export const MINA_VENDA = { "pepita": 5000, "estrela": 1500 };

export const MINEIRO = {
  id: "mineiro", x: 20, y: 30, sprite: "montanhista", dir: "down", mineracao: true,
};
export const PALEONTOLOGA = {
  id: "paleontologa", x: 8, y: 11, sprite: "tecnica", dir: "down", fossil: true,
};

export const MINA_TEXTO = {
  oferta: [
    "ESSA PAREDE AQUI TÁ CHEIA DE COISA. FÓSSIL, PEDRA, ATÉ OURO.",
    "EU EMPRESTO A PICARETA E O MARTELO. A PAREDE AGUENTA ATÉ UM TANTO — DEPOIS DESABA E VOCÊ LEVA O QUE JÁ DESTAMPOU.",
  ],
  primeira: "HOJE É POR CONTA DA CASA. QUER CAVAR?",
  cobra: "SÃO ${PRECO} PELO ALUGUEL DAS FERRAMENTAS. QUER CAVAR?",
  opcoes: ["CAVAR", "AGORA NÃO"],
  semGrana: "SEM ${PRECO} NÃO TEM PICARETA.",
  depois: "VOLTA QUANDO QUISER. PAREDE AQUI NÃO ACABA.",
  ajuda: "SETAS MOVEM · A BATE · C TROCA A FERRAMENTA · B DESISTE",
  achou: "ACHOU: {ITEM}!",
  desabou: "A PAREDE DESABOU!",
  limpou: "DESTAMPOU TUDO! A PAREDE AGUENTOU.",
  levou: "VOCÊ LEVOU: {LISTA}.",
  nada: "NÃO SOBROU NADA INTEIRO. ACONTECE.",
  desistiu: "VOCÊ LARGOU A PICARETA.",
  desistir: "LARGAR A PICARETA E SAIR?",
  // o balconista de VIRIDIAN e a PICARETA da mochila
  lojista: [
    "OPA, ESPERA. ANTES DA LOJA: ISSO AQUI TAVA ENCOSTADO NO DEPÓSITO FAZ ANOS.",
    "UMA PICARETA. COM ELA VOCÊ CAVA EM QUALQUER CANTO DE KANTO — É SÓ ABRIR A MOCHILA.",
    "O MONTE LUA É ONDE MAIS TEM FÓSSIL, MAS PEDRA É PEDRA EM TODO LUGAR.",
  ],
  ganhouPicareta: "VOCÊ RECEBEU A PICARETA!",
  cavaAqui: "VOCÊ CRAVOU A PICARETA NO CHÃO. TEM UMA PAREDE DE PEDRA AQUI EMBAIXO!",
  dentroDeCasa: "CAVAR AQUI DENTRO? O DONO DA CASA NÃO IA GOSTAR.",
  // a paleontóloga de CINNABAR
  labOferta: [
    "AQUI A GENTE RESSUSCITA FÓSSIL. É SÓ TRAZER UM.",
    "O MONTE LUA TÁ CHEIO DELES, MAS NINGUÉM CAVA MAIS.",
  ],
  labTem: "VOCÊ TEM FÓSSIL AÍ! QUAL EU RESSUSCITO?",
  labSemVaga: "SUA EQUIPE E O BOX ESTÃO CHEIOS. ONDE EU IA PÔR O BICHO?",
  labFeito: ["A MÁQUINA TREMEU, APITOU, E...", "{MON} VOLTOU! N{NIVEL}, INTEIRO, DO JEITO QUE ERA."],
  labEquipe: "{MON} ENTROU NA EQUIPE.",
  labBox: "{MON} FOI PRO BOX.",
};
