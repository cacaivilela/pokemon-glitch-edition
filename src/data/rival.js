// AZUL — o rival.
//
// Ele já estava no laboratório, com duas falas e nada pra fazer. Agora ele
// atravessa o jogo inteiro.
//
// A PIADA QUE SUSTENTA O PERSONAGEM: ele escolhe o inicial que PERDE pro seu,
// convencido de que fez a conta certa. E ele nunca admite — a cada derrota
// aparece um motivo novo, nunca a tabela de tipos. É o mesmo erro repetido cinco
// vezes, e é isso que faz dele o AZUL, e não um treinador qualquer com sprite
// bonito.
//
// A segunda linha: ele também ganha um DECODIFICADOR DE GENOMA. O professor
// entrega o dele depois de muito pedido, e daí em diante o AZUL leva fusão pra
// batalha — a máquina que ele chamou de "remendo" vira a coisa em que ele mais
// confia.
//
// `INICIAL` no time é o inicial dele, na forma que couber pro momento;
// `FUSAO:a+b` é uma fusão montada na hora (ver src/systems/rival.js). Tudo aqui
// tem hot-swap: dá pra reescrever uma fala com o jogo aberto.

export const RIVAL = {
  nome: "AZUL",
  sprite: "rival",

  /** O que ele pega: o que PERDE pro seu. Ele acha que é o contrário. */
  escolhe: {
    bulbasaur: "squirtle",     // água perde pra planta
    charmander: "bulbasaur",   // planta perde pro fogo
    squirtle: "charmander",    // fogo perde pra água
  },

  /** A linhagem de cada inicial, pra ele evoluir junto com o jogo. */
  linhas: {
    bulbasaur: ["bulbasaur", "ivysaur", "venusaur"],
    charmander: ["charmander", "charmeleon", "charizard"],
    squirtle: ["squirtle", "wartortle", "blastoise"],
  },

  encontros: [
    {
      id: "lab",
      mapa: "lab", x: 6, y: 7, dir: "down",
      requer: { flag: "starterChosen" },
      antes: [
        "ESPERA AÍ. ACHOU QUE IA SAIR DAQUI SEM ME MOSTRAR?",
        "EU PEGUEI O QUE GANHA DO SEU. NÃO FOI SORTE, FOI CONTA — EU FIZ NO PAPEL.",
        "VAMOS VER SE ISSO IMPORTA.",
      ],
      depois: [
        "...",
        "O PAPEL ESTÁ CERTO. EU CONFERI DUAS VEZES ANTES DE ESCOLHER.",
        "VOCÊ TEVE SORTE NO ÚLTIMO GOLPE. SÓ ISSO.",
      ],
      time: [{ id: "INICIAL", lvl: 5 }],
      premio: 175,
    },
    {
      id: "route22",
      mapa: "route22", x: 24, y: 12, dir: "right",
      requer: { insignias: 1 },
      antes: [
        "OLHA SÓ QUEM APRENDEU A GANHAR INSÍGNIA.",
        "EU REFIZ A CONTA DAQUELE DIA. ESTAVA CERTA. O PROBLEMA FOI O TERRENO.",
        "AQUI NÃO TEM TERRENO NENHUM. VAMOS DE NOVO.",
      ],
      depois: [
        "O VENTO. FOI O VENTO, ELE MEXEU NO ÚLTIMO GOLPE.",
        "...E TEM UM BARULHO NESSA ESTRADA QUE NÃO É DE POKÉMON NENHUM. VOCÊ NÃO OUVIU?",
      ],
      time: [
        { id: "pidgey", lvl: 9 },
        { id: "INICIAL", lvl: 11 },
      ],
      premio: 420,
    },
    {
      id: "cerulean",
      mapa: "cerulean_city", x: 23, y: 20, dir: "down",
      requer: { insignias: 2 },
      antes: [
        "EU TE VI SAINDO DO LABORATÓRIO COM AQUELA CAIXA.",
        "PEDI UMA PRO MEU AVÔ TRÊS VEZES. NA TERCEIRA ELE DISSE \"LEVA E PARA DE ME PERGUNTAR\".",
        "ENTÃO AGORA SOMOS DOIS COM DECODIFICADOR. SÓ QUE EU SEI USAR A TABELA DE TIPOS.",
        "...EU SEI USAR A TABELA DE TIPOS.",
      ],
      depois: [
        "ELE ERA DOIS E GANHOU DE DOIS. ISSO NEM DEVIA CONTAR.",
        "TÁ. ME EXPLICA UMA COISA: COMO VOCÊ ESCOLHE QUEM VAI SER A CABEÇA?",
      ],
      time: [
        { id: "rattata", lvl: 16 },
        { id: "spearow", lvl: 16 },
        { id: "INICIAL", lvl: 18 },
      ],
      premio: 900,
    },
    {
      id: "lavanda",
      mapa: "lavender_town", x: 14, y: 10, dir: "down",
      requer: { insignias: 4 },
      antes: [
        "NÃO ENTRA NA TORRE HOJE.",
        "EU SUBI ATÉ O QUARTO ANDAR E VOLTEI. TINHA UM POKÉMON LÁ QUE NÃO ESTAVA NA MINHA POKÉDEX.",
        "NÃO ERA ESPÉCIE NOVA. ERA UM QUE EU JÁ TINHA VISTO, SÓ QUE ERRADO.",
        "OLHA O QUE EU FIZ NA MÁQUINA. AGORA A CONTA ESTÁ CERTA DE VERDADE.",
      ],
      depois: [
        "DE NOVO NÃO...",
        "EU JUNTEI OS DOIS QUE GANHAVAM DO SEU. OS DOIS. COMO É QUE ISSO PERDE?",
        "...OBRIGADO POR VIR. EU PREFIRO PERDER PRA VOCÊ DO QUE FICAR AQUI SOZINHO PENSANDO NAQUELA TORRE.",
      ],
      time: [
        { id: "gyarados", lvl: 30 },
        { id: "kadabra", lvl: 32 },
        { id: "FUSAO:pidgeotto+growlithe", lvl: 33 },
        { id: "INICIAL", lvl: 34 },
      ],
      premio: 2100,
    },
    {
      id: "route23",
      mapa: "route23", x: 12, y: 76, dir: "down",
      requer: { insignias: 8 },
      antes: [
        "OITO. VOCÊ CONSEGUIU ANTES DE MIM, E EU SÓ CONSIGO PENSAR NUMA COISA.",
        "AS INSÍGNIAS NÃO ABREM SÓ O CAMINHO DA LIGA. ELAS ABREM OUTRA COISA.",
        "MEU AVÔ SABE DISSO DESDE O COMEÇO. FOI POR ISSO QUE ELE TE MANDOU CATAR AS OITO.",
        "ÚLTIMA VEZ QUE EU TE SEGURO AQUI. GANHA DE MIM E VAI ATRÁS DELE.",
      ],
      depois: [
        "PRONTO. AGORA VAI.",
        "A CONTA ESTAVA CERTA DE NOVO, SABIA? EU ESCOLHI OS TIPOS UM POR UM.",
        "...UM DIA EU DESCUBRO O QUE EU ESTOU LENDO ERRADO NESSA TABELA.",
        "LEVA A MÁQUINA. SEJA O QUE FOR QUE ESTÁ DO OUTRO LADO, ELA É A ÚNICA COISA QUE ENTENDE DE JUNTAR PEDAÇO.",
      ],
      time: [
        { id: "pidgeot", lvl: 47 },
        { id: "alakazam", lvl: 47 },
        { id: "FUSAO:gyarados+arcanine", lvl: 48 },
        { id: "rhyhorn", lvl: 45 },
        { id: "INICIAL", lvl: 50 },
      ],
      premio: 6500,
    },
  ],

  /** Na fenda, depois que o mundo bugou. Não tem batalha: ele só está lá. */
  fenda: {
    id: "fenda",
    mapa: "glitchdim", x: 22, y: 26, dir: "up",
    requer: { flag: "glitchWorld" },
    fala: [
      "EU ENTREI ATRÁS DE VOCÊ. NÃO PERGUNTA COMO.",
      "AQUI DENTRO A MINHA POKÉDEX MOSTRA 152 REGISTROS. EU CONTEI TRÊS VEZES.",
      "O CENTO E CINQUENTA E DOIS NÃO TEM NOME, NÃO TEM NÚMERO E ESTÁ NA LISTA.",
      "EU TENTEI FUNDIR ELE COM ALGUMA COISA. A MÁQUINA DESLIGOU SOZINHA.",
      "...VOCÊ VEIO ATRÁS DELE, NÉ?",
      "VAI. EU FICO AQUI SEGURANDO A PORTA — ALGUÉM TEM QUE SABER O CAMINHO DE VOLTA.",
    ],
  },
};
