// ACAMPAR: a barraca, os ingredientes, os sanduíches e o que eles fazem.
//
// A ideia é a do POKÉMON SWORD: parar no meio do caminho, montar a barraca,
// cozinhar uma coisa com o que você comprou e brincar com a equipe. Aqui isso
// cabe em três peças, e esta é a das TABELAS — as regras estão em
// src/systems/acampamento.js e a tela em src/scenes/acampamento.js.
//
// POR QUE SABOR, E NÃO RECEITA FECHADA
// Uma tabela de "estes três ingredientes exatos = este sanduíche" precisa de uma
// linha por combinação: com 8 ingredientes escolhendo 3, são 56 linhas pra
// escrever e 56 pra manter. Aqui cada ingrediente tem um SABOR, e o sanduíche
// sai do sabor que aparecer mais. Ingrediente novo entra com uma linha e já
// combina com todos os outros.

/** O que se compra na loja. `sabor` é o que manda no sanduíche. */
export const INGREDIENTES = {
  "pão": { sabor: null, preco: 60, base: true, texto: "SEM PÃO NÃO É SANDUÍCHE." },
  "morango": { sabor: "doce", preco: 180, texto: "DOCE. GRUDA NA MÃO." },
  "mel": { sabor: "doce", preco: 240, texto: "MAIS DOCE AINDA. GRUDA EM TUDO." },
  "presunto": { sabor: "salgado", preco: 200, texto: "SALGADO. O CLÁSSICO." },
  "queijo": { sabor: "salgado", preco: 220, texto: "SALGADO E DERRETE." },
  "pimenta": { sabor: "picante", preco: 260, texto: "PICANTE. CUIDADO COM O OLHO." },
  "limão": { sabor: "azedo", preco: 150, texto: "AZEDO DE FECHAR A CARA." },
  "café": { sabor: "amargo", preco: 300, texto: "AMARGO. NINGUÉM DORME DEPOIS." },
};

/** A barraca. Sem ela não dá pra acampar; compra-se uma vez. */
export const BARRACA = { item: "barraca", preco: 1200 };

/** O que cada sabor vira, e o que aquilo faz.
 *
 *  Duração em MINUTOS de relógio, igual ao ciclo de dia e noite: contar passos
 *  faria o efeito durar mais pra quem anda menos, que é o contrário do certo. */
export const SABORES = {
  doce: {
    nome: "SANDUÍCHE DOCE",
    efeito: "xp",
    minutos: 20,
    texto: "A EQUIPE APRENDE MAIS RÁPIDO DEPOIS DE COMER ISSO.",
    hud: "XP+",
  },
  salgado: {
    nome: "SANDUÍCHE SALGADO",
    efeito: "cura",
    minutos: 0,                      // este vale na hora: cura e acabou
    texto: "TODO MUNDO ENCHEU A BARRIGA E VOLTOU INTEIRO.",
    hud: "",
  },
  picante: {
    nome: "SANDUÍCHE PICANTE",
    efeito: "ataque",
    minutos: 15,
    texto: "A EQUIPE ESTÁ COM VONTADE DE BATER EM ALGUMA COISA.",
    hud: "ATK+",
  },
  azedo: {
    nome: "SANDUÍCHE AZEDO",
    efeito: "fuga",
    minutos: 20,
    texto: "DÁ PRA SAIR DE QUALQUER ENRASCADA DEPOIS DESSE.",
    hud: "FUGA+",
  },
  amargo: {
    nome: "SANDUÍCHE AMARGO",
    efeito: "sorte",
    minutos: 15,
    texto: "NINGUÉM DORME. E QUEM NÃO DORME VÊ COISA RARA.",
    hud: "SORTE+",
  },
  // o que sai quando não dá pra decidir: dois sabores empatados, ou só pão
  nenhum: {
    nome: "SANDUÍCHE DE PÃO",
    efeito: "nada",
    minutos: 0,
    texto: "É PÃO COM PÃO. A EQUIPE COMEU POR EDUCAÇÃO.",
    hud: "",
  },
};

/** Quantas estrelas o sanduíche ganhou, pelo tanto que você acertou a panela.
 *  A força do efeito sai daqui: 1 estrela é quase nada, 5 é o dobro. */
export const ESTRELAS = [
  { min: 0, nome: "QUEIMADO", forca: 0.5 },
  { min: 0.35, nome: "PASSÁVEL", forca: 0.8 },
  { min: 0.6, nome: "BOM", forca: 1 },
  { min: 0.8, nome: "MUITO BOM", forca: 1.4 },
  { min: 0.95, nome: "PERFEITO", forca: 2 },
];

/** O quanto cada efeito mexe no jogo, na força 1 (a estrela multiplica). */
export const FORCA = {
  xp: 0.5,          // +50% de experiência
  ataque: 0.15,     // +15% de dano
  fuga: 1.5,        // multiplica a chance de fugir
  sorte: 3,         // multiplica a chance de shiny
};

/** Os dois minijogos do acampamento. */
export const MINIJOGOS = {
  panela: {
    nome: "MEXER A PANELA",
    voltas: 3,              // quantas vezes tem que acertar
    janela: 0.16,           // o tamanho do alvo, de 0 a 1 da barra
    velocidade: [1.1, 1.5, 1.9],   // a barra acelera a cada volta
  },
  bola: {
    nome: "JOGAR A BOLA",
    rodadas: 3,
    esperaMin: 0.6,         // segundos antes do "JÁ!"
    esperaMax: 2.4,
    limite: 0.6,            // tempo pra apertar depois do "JÁ!"
  },
};
