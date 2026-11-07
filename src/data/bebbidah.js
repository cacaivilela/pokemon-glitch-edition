// O BEBBIDAH (criado pelo CAIO): a caneca de água que vira jarra de bebida.
//
// COMO EVOLUI: ele SEGURA um ingrediente de sanduíche (os do acampamento,
// src/data/acampamento.js) e você GIRA — anda em círculo com o personagem,
// duas voltas inteiras, como o ALCREMIE do Sword/Shield. Aí ele vira BEBBIDÃO,
// e a forma sai de três coisas:
//   - o INGREDIENTE escolhe a BEBIDA (a cor de base): hortelã vira chá,
//     tomate vira suco de tomate...
//   - o LUGAR de Braglitch escolhe o TOM: lugar calmo deixa a bebida clara,
//     lugar perigoso deixa escura (src/systems/bebbidah.js, `tomDoMapa`);
//   - a HORA: girou de dia, sai GELADO (gelo boiando); de noite, QUENTE
//     (fumacinha subindo).
// A forma fica guardada no seed do bicho, como o creme do ALCREMIE, e o
// desenho é pintado na hora (src/core/assets.js, `bebbidao`).
//
// BEBIDA NOVA SEMPRE NO FIM DA LISTA: a posição dela vai no seed.

export const BEBIDAS = [
  { item: "morango",  nome: "VITAMINA DE MORANGO", cor: "#e8607a" },
  { item: "mel",      nome: "ÁGUA COM MEL",        cor: "#e8a830" },
  { item: "banana",   nome: "VITAMINA DE BANANA",  cor: "#eed872" },
  { item: "presunto", nome: "CALDO DE PRESUNTO",   cor: "#d88878" },
  { item: "queijo",   nome: "QUEIJO DERRETIDO",    cor: "#f2c84a" },
  { item: "bacon",    nome: "CALDO DE BACON",      cor: "#b25a3a" },
  { item: "pimenta",  nome: "SUCO DE PIMENTA",     cor: "#d42a2a" },
  { item: "wasabi",   nome: "CHÁ DE WASABI",       cor: "#92c850" },
  { item: "limão",    nome: "LIMONADA",            cor: "#e2ec6a" },
  { item: "picles",   nome: "SUCO DE PICLES",      cor: "#a6b43a" },
  { item: "café",     nome: "CAFÉ",                cor: "#6c3e22" },
  { item: "jiló",     nome: "SUCO DE JILÓ",        cor: "#4e8a3a" },
  { item: "cogumelo", nome: "SOPA DE COGUMELO",    cor: "#a08866" },
  { item: "azeitona", nome: "SUCO DE AZEITONA",    cor: "#6a7a2c" },
  { item: "hortelã",  nome: "CHÁ DE HORTELÃ",      cor: "#56c88e" },
  { item: "tomate",   nome: "SUCO DE TOMATE",      cor: "#e04230" },
];

/** OS TONS, do lugar mais calmo pro mais perigoso. `mistura` > 0 puxa pro
 *  branco, < 0 puxa pro preto. */
export const TONS = [
  { nome: "BEM CLARO",  mistura: 0.45 },
  { nome: "CLARO",      mistura: 0.22 },
  { nome: "NORMAL",     mistura: 0 },
  { nome: "ESCURO",     mistura: -0.28 },
  { nome: "BEM ESCURO", mistura: -0.5 },
];

/** O quanto o lugar é perigoso, pelo nível dos selvagens dele (o mais alto).
 *  Cidade, casa e lugar sem mato = calmo. O FUNDO DO MAR é sempre o mais
 *  escuro. Fora de Braglitch, o tom NORMAL. */
export const TOM_POR_NIVEL = [
  { ate: 0, tom: 0 },      // sem selvagem nenhum: cidade, casa, centro
  { ate: 20, tom: 1 },
  { ate: 35, tom: 2 },
  { ate: 50, tom: 3 },
  { ate: Infinity, tom: 4 },
];
export const TOM_FORA = 2;

/** quantas mudanças de direção seguidas, sempre girando pro mesmo lado,
 *  contam como GIRAR (4 = uma volta; 8 = duas) e em quantos segundos */
export const GIRO = { viradas: 8, segundos: 4 };

export const BEBBIDAH_TEXTO = {
  girou: "{MON} RODOU, RODOU... A {ITEM} SE DESMANCHOU NA ÁGUA!",
  virou: "VIROU {BEBIDA}, {TEMP}, TOM {TOM}!",
  gelado: "GELADA",
  quente: "QUENTE",
  semItem: "{MON} GIROU JUNTO, MAS NÃO TINHA NADA PRA MISTURAR.",
  desc: "UM BEBBIDAH SEGURANDO ISSO E GIRANDO VIRA BEBIDA.",
};
