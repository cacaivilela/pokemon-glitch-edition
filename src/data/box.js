// O SISTEMA DE ARMAZENAMENTO do PC: quantas boxes existem, o tamanho de cada
// uma e os papéis de parede. Hot-swap: salvar aqui vale na hora.
//
// Aumentar `count` ou `size` é seguro (as boxes novas entram vazias). Diminuir
// também não perde ninguém: quem ficou de fora espera numa lista de sobra e
// volta pras boxes assim que houver vaga (ver src/systems/box.js).
export const BOX = {
  count: 14,             // quantas boxes o PC tem
  cols: 6,               // grade de cada box...
  rows: 5,               // ...6 x 5 = 30 lugares, como no FireRed
  nomePadrao: "BOX {N}", // nome de uma box que nunca foi renomeada
  nomeMax: 8,            // quantas letras cabem na barra de cima
};

BOX.size = BOX.cols * BOX.rows;

// Papéis de parede: cada box guarda o índice de um destes. `padrao` é desenhado
// em src/scenes/box.js — liso, bolinhas, xadrez, listras, grade, tijolo, onda
// e estatica (a da fenda, que treme).
export const BOX_PAPEIS = [
  { nome: "FLORESTA", fundo: "#7bc98d", detalhe: "#5fb075", padrao: "bolinhas" },
  { nome: "CIDADE",   fundo: "#8fa6c8", detalhe: "#7690b6", padrao: "tijolo" },
  { nome: "PRAIA",    fundo: "#f0dfa8", detalhe: "#dcc888", padrao: "onda" },
  { nome: "CAVERNA",  fundo: "#9a8f86", detalhe: "#83786f", padrao: "xadrez" },
  { nome: "CÉU",      fundo: "#9fd0f0", detalhe: "#86bde4", padrao: "listras" },
  { nome: "MÁQUINA",  fundo: "#a8b0bc", detalhe: "#8d95a2", padrao: "grade" },
  { nome: "VULCÃO",   fundo: "#dd9a7a", detalhe: "#c47f60", padrao: "bolinhas" },
  { nome: "FENDA",    fundo: "#6b4a9c", detalhe: "#4a3070", padrao: "estatica" },
];
