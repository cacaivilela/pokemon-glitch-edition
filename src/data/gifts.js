// PRESENTE MISTERIOSO.
//
// Dois caminhos, como nos jogos de verdade:
//
//   CÓDIGO     — as cartas escritas aqui embaixo. Ficam no jogo, funcionam sem
//                servidor nenhum e têm hot-swap: dá pra inventar um código novo
//                com o jogo aberto.
//   SERVIDOR   — os cartões que o dono do servidor (ou outro jogador da sala)
//                publicou. Esses vêm de online/cartoes.json, pela rota /__gift.
//
// Cada cartão só pode ser recebido UMA VEZ por save: o id fica gravado em
// `state.flags.presentes`. O que o cartão dá:
//
//   itens: [{ item: "poção", qtd: 3 }]                  vai pra mochila
//   mons:  [{ id: "mew", nv: 5, shiny: true, apelido: "" }]   vai pro time (ou pro BOX)
//
// Os nomes de item são os mesmos do resto do jogo (src/data/loot.js e as
// megapedras de src/data/mega.js). Espécie é o id da Pokédex daqui.

/** O código é comparado sem espaço e em maiúscula. */
export const GIFT_CODES = {
  GLITCHEDITION: {
    titulo: "CARTÃO DA CAIXA",
    texto: "VEIO DENTRO DA CAIXA DO JOGO, PRESO NO PLÁSTICO. NINGUÉM LIA ESTES.",
    de: "GAME FREAK",
    itens: [{ item: "poké bola", qtd: 10 }, { item: "poção", qtd: 5 }],
  },

  "011WONDERCARD110": {
    titulo: "CARTÃO SEM REMETENTE",
    texto: "O CAMPO DE QUEM MANDOU ESTÁ VAZIO. O POKÉMON DENTRO DELE NÃO ESTÁ.",
    de: "?",
    mons: [{ id: "mew", nv: 5, apelido: "PRESENTE" }],
  },

  PALETA1996: {
    titulo: "MUDA DA VILA",
    texto: "UMA MUDA TIRADA DO CANTEIRO DE VILA PALETA. ELA JÁ NASCEU DIFERENTE.",
    de: "PROF. CARVALHO",
    mons: [{ id: "bulbasaur", nv: 5, shiny: true }],
  },

  DOCEDOCEDOCE: {
    titulo: "CAIXA DE DOCES",
    texto: "SEIS DOCES. NÃO PERGUNTE DE ONDE VIERAM.",
    de: "SRTA. JOY",
    itens: [{ item: "doce raro", qtd: 6 }],
  },

  PORYGONZ: {
    titulo: "PACOTE DA SILPH",
    texto: "DUAS PEÇAS NUMA CAIXA SÓ. A SEGUNDA NÃO TEM MANUAL.",
    de: "SILPH CO.",
    itens: [{ item: "up-grade", qtd: 1 }, { item: "dubious disc", qtd: 1 }],
  },

  // OS DOZE MIL KORAIDON. Um cartão LIMITADO: `limite` diz quantas vezes o
  // código pode ser resgatado NO MUNDO — a contagem é do servidor
  // (online/resgates.json, rota /__resgate), então quando os doze mil
  // acabarem, acabaram pra todo mundo. Sem servidor, o cartão não abre.
  K0RA1DON: {
    titulo: "UM DOS DOZE MIL",
    texto: "SAÍRAM DOZE MIL DESTES. TODOS DA MESMA COR ERRADA. QUANDO ACABAREM, ACABARAM.",
    de: "PALDEA",
    limite: 12000,
    mons: [{ id: "koraidon", nv: 50, shiny: true }],
  },

  "011SEMDONO110": {
    titulo: "PEDRA SEM DONO",
    texto: "ALGUÉM DEIXOU CAIR ISTO NA SALA. O DESENHO DE DENTRO PARECE UM GENGAR.",
    de: "?",
    itens: [{ item: "gengarita", qtd: 1 }],
  },
};

export const GIFT_TEXTO = {
  titulo: "PRESENTE MISTERIOSO",
  menu: ["POR CÓDIGO", "PELO SERVIDOR", "MANDAR UM CARTÃO", "SAIR"],
  pedeCodigo: "DIGITE O CÓDIGO DO CARTÃO:",
  naoExiste: "ESSE CÓDIGO NÃO ABRE NADA.",
  repetido: "VOCÊ JÁ RECEBEU ESTE CARTÃO.",
  chegou: "CHEGOU UM CARTÃO: {TITULO}!",
  recebeuItem: "VOCÊ RECEBEU {QTD} {ITEM}!",
  recebeuMon: "{MON} VEIO NO CARTÃO!",
  foiProBox: "{MON} FOI PRO BOX: SEU TIME ESTÁ CHEIO.",
  semVaga: "SEM ESPAÇO NEM NO BOX. LIBERE UM LUGAR E VOLTE.",
  semServidor: "NÃO CONSEGUI FALAR COM O SERVIDOR.",
  limitadoSemServidor: "ESTE CARTÃO É CONTADO NO MUNDO. PRECISA DO SERVIDOR PRA ABRIR.",
  acabaram: "ACABARAM. OS {LIMITE} JÁ FORAM TODOS RESGATADOS.",
  restam: "ESTE ERA O Nº {USADOS}. RESTAM {RESTAM}.",
  nenhumNoServidor: "O SERVIDOR NÃO ESTÁ OFERECENDO NENHUM CARTÃO.",
  mandarOque: "QUAL ITEM VOCÊ VAI MANDAR PRA SALA?",
  mandouCartao: "SEU CARTÃO FOI PUBLICADO NO SERVIDOR.",
  mandarFalhou: "O SERVIDOR NÃO ACEITOU O CARTÃO.",
  semItemPraMandar: "VOCÊ NÃO TEM NADA PRA MANDAR.",
};

/** normaliza o que o jogador digitou */
export const limpaCodigo = (s) => String(s || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
