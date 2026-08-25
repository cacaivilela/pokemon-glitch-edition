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

// O PÃO NÃO ESTÁ AQUI, DE PROPÓSITO. Ele era comprável, e comprar pão pra fazer
// sanduíche é a etapa que só existe pra ser esquecida: você chega no
// acampamento com os recheios na mão e não faz nada. Agora o pão é do mundo —
// todo sanduíche já vem nele, e a tábua só pergunta o que vai DENTRO.

/** O que se compra na loja. `sabor` é o que manda no sanduíche. */
export const INGREDIENTES = {
  "morango": { sabor: "doce", preco: 180, texto: "DOCE. GRUDA NA MÃO." },
  "mel": { sabor: "doce", preco: 240, texto: "MAIS DOCE AINDA. GRUDA EM TUDO." },
  "banana": { sabor: "doce", preco: 120, texto: "DOCE E BARATA. SEMPRE TEM." },
  "presunto": { sabor: "salgado", preco: 200, texto: "SALGADO. O CLÁSSICO." },
  "queijo": { sabor: "salgado", preco: 220, texto: "SALGADO E DERRETE." },
  "bacon": { sabor: "salgado", preco: 320, texto: "SALGADO DEMAIS. VALE A PENA." },
  "pimenta": { sabor: "picante", preco: 260, texto: "PICANTE. CUIDADO COM O OLHO." },
  "wasabi": { sabor: "picante", preco: 380, texto: "PICANTE QUE SOBE PELO NARIZ." },
  "limão": { sabor: "azedo", preco: 150, texto: "AZEDO DE FECHAR A CARA." },
  "picles": { sabor: "azedo", preco: 190, texto: "AZEDO E CROCANTE." },
  "café": { sabor: "amargo", preco: 300, texto: "AMARGO. NINGUÉM DORME DEPOIS." },
  "jiló": { sabor: "amargo", preco: 140, texto: "AMARGO. METADE DAS PESSOAS DEVOLVE." },
  "cogumelo": { sabor: "umami", preco: 280, texto: "GOSTO DE COISA SÉRIA." },
  "azeitona": { sabor: "umami", preco: 240, texto: "UMAMI. OU VOCÊ AMA OU TIRA." },
  "hortelã": { sabor: "fresco", preco: 160, texto: "REFRESCA ATÉ O CAMINHO." },
};

import { BARRACA_LEILAO } from "./leilao.js";

/** A barraca. Sem ela não dá pra acampar; compra-se uma vez. */
export const BARRACA = { item: "barraca", preco: 1200 };

/** O que TODA loja passa a vender: a barraca e os ingredientes, com o preço que
 *  está aqui em cima. É montado da própria tabela, então ingrediente novo entra
 *  na prateleira sozinho — e entra em TODAS as lojas, porque cada cidade tem a
 *  sua (`pewter_city_mart`, `cerulean_city_mart`...) e escrever a lista oito
 *  vezes é escrever sete erros. Quem espalha é src/data/index.js. */
export const ESTOQUE = [
  { item: BARRACA.item, price: BARRACA.preco },
  { item: BARRACA_LEILAO.item, price: BARRACA_LEILAO.preco },
  ...Object.entries(INGREDIENTES).map(([item, i]) => ({ item, price: i.preco })),
];

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
  umami: {
    nome: "SANDUÍCHE UMAMI",
    efeito: "defesa",
    minutos: 15,
    texto: "A EQUIPE COMEU COMIDA DE VERDADE. AGUENTA MAIS PANCADA.",
    hud: "DEF+",
  },
  fresco: {
    nome: "SANDUÍCHE REFRESCANTE",
    efeito: "calmaria",
    minutos: 15,
    texto: "O CHEIRO ESPANTA BICHO DO MATO. O CAMINHO FICA MAIS CALMO.",
    hud: "CALMA",
  },
  // o que sai quando não tem sabor nenhum: só pão, ou três sabores diferentes
  nenhum: {
    nome: "SANDUÍCHE DE PÃO",   // o pão sempre está lá; foi o recheio que faltou
    efeito: "nada",
    minutos: 0,
    texto: "É PÃO COM PÃO. A EQUIPE COMEU POR EDUCAÇÃO.",
    hud: "",
  },
};

/** OS COMBINADOS. Dois sabores empatados não viram mais "sanduíche de pão":
 *  viram um sanduíche dos DOIS, com os dois efeitos ao mesmo tempo — cada um
 *  valendo menos do que valeria sozinho (`MISTURA`), porque comer bem de duas
 *  coisas ao mesmo tempo não é comer o dobro.
 *
 *  A chave é o par em ordem alfabética: "doce+salgado" acha o mesmo que
 *  "salgado+doce". Par sem nome escrito aqui ainda funciona — sai como MISTO,
 *  com os dois efeitos do mesmo jeito. */
export const COMBOS = {
  "doce+salgado": { nome: "SANDUÍCHE AGRIDOCE", texto: "SALGADO E DOCE NA MESMA MORDIDA. NINGUÉM ENTENDE E TODO MUNDO GOSTA." },
  "azedo+doce": { nome: "SANDUÍCHE CÍTRICO", texto: "DOCE NA FRENTE, AZEDO ATRÁS." },
  "doce+picante": { nome: "SANDUÍCHE DOCE-ARDIDO", texto: "COMEÇA DOCE E TERMINA GRITANDO." },
  "picante+salgado": { nome: "SANDUÍCHE FORTE", texto: "COMIDA DE QUEM VAI BRIGAR DEPOIS." },
  "azedo+picante": { nome: "SANDUÍCHE BRAVO", texto: "ARDE E FECHA A CARA. A EQUIPE FICOU ELÉTRICA." },
  "amargo+doce": { nome: "CAFÉ COM AÇÚCAR", texto: "NINGUÉM DORME, MAS TODO MUNDO GOSTOU." },
  "amargo+salgado": { nome: "SANDUÍCHE ESCURO", texto: "GOSTO DE COISA QUE SÓ APARECE DE MADRUGADA." },
  "salgado+umami": { nome: "SANDUÍCHE SUBSTANCIOSO", texto: "ISSO NÃO É LANCHE, É ALMOÇO." },
  "doce+fresco": { nome: "SANDUÍCHE DE VERÃO", texto: "DOCE E GELADO. DÁ VONTADE DE ANDAR." },
  "amargo+fresco": { nome: "SANDUÍCHE DA MADRUGADA", texto: "MENOS BICHO NO CAMINHO, E O QUE APARECE VEM ESTRANHO." },
  "fresco+umami": { nome: "SANDUÍCHE VERDE", texto: "LEVE E FIRME AO MESMO TEMPO." },
};

/** o nome de quem não tem nome, e o quanto cada efeito perde num combinado */
export const MISTO = { nome: "SANDUÍCHE MISTO", texto: "DOIS GOSTOS BRIGANDO. FICOU BOM ASSIM MESMO." };
export const MISTURA = 0.7;

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
  defesa: 0.15,     // -15% no dano que você toma
  calmaria: 0.5,    // metade dos encontros na grama
};

/** O PISO dos efeitos que diminuem. Sem ele o REFRESCANTE no PERFEITO zerava a
 *  chance de encontro: quinze minutos sem um bicho na grama não é mato calmo, é
 *  o mato desligado — e um item que desliga parte do jogo não é um prêmio. */
export const PISO = {
  calmaria: 0.35,   // no máximo 65% a menos de encontro
  defesa: 0.6,      // no máximo 40% a menos de dano tomado
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
