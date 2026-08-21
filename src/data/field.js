// Golpes que também funcionam FORA da batalha — as antigas HMs.
//
// Nada de item de HM: se o Pokémon sabe o golpe, ele usa. O jogo procura na
// equipe inteira quem sabe e pergunta antes de usar.
export const FIELD_MOVES = {
  surfar: {
    onde: "agua",
    pergunta: "A ÁGUA ESTÁ CALMA. USAR SURFAR?",
    usando: "{MON} USOU SURFAR!",
    semNinguem: "A ÁGUA É FUNDA DEMAIS PRA ATRAVESSAR A PÉ.",
  },
  corte: {
    onde: "mato",
    pergunta: "ESTE MATO DÁ PRA CORTAR. USAR CORTE?",
    usando: "{MON} USOU CORTE! O MATO FOI APARADO.",
    semNinguem: "O MATO ESTÁ ALTO DEMAIS. ALGUÉM COM CORTE RESOLVERIA.",
  },
  quebrarocha: {
    onde: "pedra",
    pergunta: "UMA PEDRA RACHADA FECHA O CAMINHO. USAR QUEBRA-ROCHA?",
    usando: "{MON} USOU QUEBRA-ROCHA! A PEDRA VIROU CASCALHO.",
    semNinguem: "UMA PEDRA RACHADA. COM O GOLPE CERTO ELA CEDERIA.",
  },
  forca: {
    onde: "bloco",
    pergunta: "UM BLOCO DE PEDRA, PESADO DEMAIS. USAR FORÇA?",
    usando: "{MON} USOU FORÇA! AGORA DÁ PRA EMPURRAR O BLOCO.",
    semNinguem: "UM BLOCO DE PEDRA. NEM SE VOCÊ EMPURRAR COM TUDO.",
    travado: "O BLOCO BATEU EM ALGUMA COISA E PAROU.",
  },
  voar: {
    onde: "menu",
    pergunta: "VOAR PRA ONDE?",
    usando: "{MON} USOU VOAR!",
    semNinguem: "NINGUÉM DA SUA EQUIPE SABE VOAR.",
  },
};

/** Quem a SRTA. JOY consegue ensinar: por tipo do Pokémon e nível mínimo.
 *  (Além disso ela relembra qualquer golpe do learnset da espécie.) */
export const FIELD_LEARNERS = {
  surfar: { tipos: ["ÁGUA"], nivel: 40 },   // o LAPRAS é exceção: 70, pelo learnset dele
  corte: { tipos: ["NORMAL", "PLANTA", "INSETO", "VOADOR", "LUTADOR"], nivel: 10 },
  voar: { tipos: ["VOADOR", "DRAGÃO"], nivel: 20 },
  forca: { tipos: ["LUTADOR", "PEDRA", "TERRA", "NORMAL"], nivel: 25 },
  quebrarocha: { tipos: ["LUTADOR", "PEDRA", "TERRA", "AÇO"], nivel: 12 },
};

/** Destinos do VOAR: só aparecem depois que você pisou lá pelo menos uma vez. */
export const FLY_SPOTS = {
  pallet: "VILA PALETA",
  viridian: "CIDADE VIRIDIAN",
  pewter_city: "CIDADE PEWTER",
  cerulean_city: "CIDADE CERULEAN",
  vermilion_city: "CIDADE VERMILION",
  lavender_town: "VILA LAVENDER",
  celadon_city: "CIDADE CELADON",
  fuchsia_city: "CIDADE FUCHSIA",
  saffron_city: "CIDADE SAFFRON",
  cinnabar_island: "ILHA CINNABAR",
};
