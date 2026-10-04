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
    // os de BRAGLITCH (src/data/braglitch.js), pela mesma conta errada
    tronky: "tilapish",        // água perde pra planta
    diggle: "tronky",          // planta perde pro fogo
    tilapish: "diggle",        // fogo perde pra água
  },

  /** A linhagem de cada inicial, pra ele evoluir junto com o jogo. */
  linhas: {
    bulbasaur: ["bulbasaur", "ivysaur", "venusaur"],
    charmander: ["charmander", "charmeleon", "charizard"],
    squirtle: ["squirtle", "wartortle", "blastoise"],
    tronky: ["tronky", "troncudo", "paubrasilisco"],
    diggle: ["diggle", "braseagle", "magmastim"],
    tilapish: ["tilapish", "tilapisco", "tilapiracu"],
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

// ---------------------------------------------------------------- O GÊMEO
// O RIVAL DE BRAGLITCH é o seu irmão gêmeo: a skin que você NÃO escolheu.
// Jogou de CAIO, quem te espera na porta dos ginásios é a LARA; jogou de LARA,
// é o CAIO. Os dois saíram de casa no mesmo dia, mas não pegaram nada da mesa
// da IPÊ: o inicial de cada um chegou de PALDEA na véspera.
//
//   CAIO  QUAXLY (vira QUAQUAVAL), PIKACHU, BANGVEET e ZOROARK
//   LARA  SPRIGATITO (vira MEOWSCARADA), LOPUNNY, VAPOREON, MAUSHOLD e GARDEVOIR
//
// O time vai crescendo e evoluindo a cada reencontro. Os encontros moram nas
// cidades, na porta do ginásio (o lugar exato sai da planta: LUGAR_DO_GEMEO em
// src/data/braglitch-mundo.js); `requer.ginasios` conta só as insígnias dos
// ginásios de Braglitch, não as das ilhas.
export const GEMEO = {
  /** quem é o rival, pelo gênero de quem joga */
  quem: { menino: "LARA", menina: "CAIO" },
  sprite: { CAIO: "hero_brag", LARA: "heroina_brag" },

  encontros: [
    {
      id: "lab", mapa: "bra_lab", x: 6, y: 7, dir: "up",
      requer: { flag: "starterChosen" },
      CAIO: {
        antes: [
          "PERAÍ, MANA! EU TAMBÉM GANHEI UM!",
          "NÃO É DESSA MESA, NÃO. A IPÊ ME DEU UM QUE CHEGOU DE PALDEA ONTEM. O QUAXLY!",
          "ELE TEM TOPETE IGUAL O MEU. VAMOS VER QUEM DOS GÊMEOS É O MAIS RÁPIDO!",
        ],
        depois: [
          "AH, QUE ISSO... ELE TROPEÇOU NO PRÓPRIO TOPETE.",
          "TÁ BOM, VOCÊ GANHOU A PRIMEIRA. MAS EU SAÍ DA BARRIGA DA MÃE PRIMEIRO, ISSO NINGUÉM TIRA DE MIM.",
        ],
        time: [["quaxly", 5]],
      },
      LARA: {
        antes: [
          "EI, MANO. ACHOU QUE SÓ VOCÊ IA SAIR DE CASA HOJE?",
          "A IPÊ GUARDOU UM PRA MIM QUE VEIO DE PALDEA. SPRIGATITO. OLHA ESSA CARINHA.",
          "ELE É FOFO, MAS ARRANHA. IGUAL EU.",
        ],
        depois: [
          "HUM. FOI SÓ A PRIMEIRA.",
          "VOU TREINAR NA MATA E TE ESPERO LÁ NA FRENTE. NÃO DEMORA, TÁ?",
        ],
        time: [["sprigatito", 5]],
      },
      premio: 300,
    },
    {
      id: "belem", cidade: "belem",
      requer: { flag: "starterChosen", ginasios: 0 },
      CAIO: {
        antes: [
          "CHEGOU, ENFIM! EU VIM CORRENDO PELA MATA ATLÂNTICA INTEIRA.",
          "E OLHA QUEM EU ACHEI NO CAMINHO: UM PIKACHU! DEPOIS DO APAGÃO ELE GRUDOU NUM POSTE E NÃO QUERIA SAIR.",
          "ANTES DA JACIRA, VOCÊ PASSA POR MIM!",
        ],
        depois: [
          "O PIKACHU DEU CHOQUE EM MIM DE NOVO. ACHO QUE É CARINHO.",
          "VAI LÁ PEGAR A INSÍGNIA. EU PEGO A MINHA DEPOIS... DEPOIS DE TREINAR UM POUQUINHO.",
        ],
        time: [["pikachu", 11, "shiny"], ["quaxly", 13]],
      },
      LARA: {
        antes: [
          "DEMOROU, HEIN, MANO.",
          "ACHEI UM BUNEARY NO CAMINHO. ELE CURTIU A MINHA ROUPA, ACHOU QUE EU ERA DA FAMÍLIA DELE.",
          "A JACIRA É DE PLANTA. O SPRIGATITO TAMBÉM. ENTÃO PRIMEIRO EU TREINO EM VOCÊ.",
        ],
        depois: [
          "TÁ, TÁ. TÁ BOM.",
          "SE A JACIRA TE DERRUBAR, EU VOU RIR. MAS DEPOIS EU TE AJUDO A LEVANTAR.",
        ],
        time: [["buneary", 11, "shiny"], ["sprigatito", 13]],
      },
      premio: 800,
    },
    {
      id: "salvador", cidade: "salvador",
      requer: { flag: "starterChosen", ginasios: 2 },
      CAIO: {
        antes: [
          "MANA! O QUAXLY EVOLUIU! AGORA ELE É O QUAXWELL E SABE DANÇAR.",
          "E EU PEGUEI UM BANTEVY NA BR-101. ELE CANTA TÃO ALTO QUE OS VIZINHOS RECLAMARAM.",
          "O MESTRE GINGA PODE ESPERAR. A RODA AGORA É NOSSA!",
        ],
        depois: [
          "PERDI O PASSO. FOI SÓ ISSO, PERDI O PASSO.",
          "TÔ ACHANDO QUE A MÃE TINHA RAZÃO: VOCÊ PENSA ANTES, EU PENSO DEPOIS.",
        ],
        time: [["pikachu", 21, "shiny"], ["bantevy", 21], ["quaxwell", 24]],
      },
      LARA: {
        antes: [
          "OI, MANO. PERA, DEIXA EU OLHAR O SENSOR... TUDO CERTO. AGORA SIM.",
          "O BUNEARY VIROU LOPUNNY. E A PEDRA DA ÁGUA DA LOJA DE RECIFEEBAS VIROU UM VAPOREON.",
          "O FLORAGATO JÁ SABE FAZER TRUQUE COM FLOR. QUER VER?",
        ],
        depois: [
          "ARGH. VOCÊ SEMPRE ACHA O GOLPE CERTO NA HORA CERTA.",
          "EU VOU DESCOBRIR COMO VOCÊ FAZ ISSO. A GENTE É GÊMEO, TEM QUE SER GENÉTICO.",
        ],
        time: [["lopunny", 22, "shiny"], ["vaporeon", 22], ["floragato", 24]],
      },
      premio: 1600,
    },
    {
      id: "sampa", cidade: "sampa",
      requer: { flag: "starterChosen", ginasios: 4 },
      CAIO: {
        antes: [
          "SAMPIKACHU! AQUI O MEU PIKACHU SE SENTE EM CASA. TEM ATÉ ESTÁTUA DELE... OU QUASE.",
          "O BANTEVY VIROU BANGVEET, E UM ZORUA ME SEGUIU DESDE A BR-116 FINGINDO SER VOCÊ.",
          "QUASE QUE EU CAÍ. AGORA ELE É MEU.",
          "E O QUAQUAVAL... OLHA ESSA PLUMA. AGORA É SÉRIO!",
        ],
        depois: [
          "O ZORUA ESTÁ IMITANDO A SUA CARA DE VITÓRIA. NÃO TEM GRAÇA, ZORUA.",
          "...TÁ, TEM UM POUCO DE GRAÇA.",
        ],
        time: [["pikachu", 32, "shiny"], ["bangveet", 33], ["zorua", 32], ["quaquaval", 36]],
      },
      LARA: {
        antes: [
          "MANO, SAMPIKACHU É GRANDE DEMAIS. EU ME PERDI TRÊS VEZES PROCURANDO O GINÁSIO.",
          "NO METRÔ, UM TANDEMAUS E UM RALTS ENTRARAM NA MINHA BOLSA. NÃO SAÍRAM MAIS.",
          "E O FLORAGATO AGORA É MEOWSCARADA. VEM, QUE A MÁGICA DELA É COM ESPINHO.",
        ],
        depois: [
          "TÁ BOM, O SEU TIME É MELHOR. POR ENQUANTO.",
          "O RALTS SENTIU QUE EU TAVA TRISTE E VEIO ME ABRAÇAR. TÁ VENDO? ATÉ PERDENDO EU GANHO ALGUMA COISA.",
        ],
        time: [["lopunny", 33, "shiny"], ["vaporeon", 33], ["tandemaus", 32], ["kirlia", 32], ["meowscarada", 36]],
      },
      premio: 2600,
    },
    {
      id: "rio", cidade: "rio",
      requer: { flag: "starterChosen", ginasios: 6 },
      CAIO: {
        antes: [
          "MANA, EU SUBI O MORRO DA SERRA SÓ PRA TREINAR. O ZORUA VIROU ZOROARK LÁ EM CIMA.",
          "AGORA ELE FAZ ILUSÃO DO TIME INTEIRO. ÀS VEZES NEM EU SEI QUEM EU MANDEI PRA BATALHA.",
          "A RAINHA LUA QUE ME DESCULPE, MAS ESSE BATUQUE É MEU!",
        ],
        depois: [
          "PERDI NO RIO DE JANEEVEE. PELO MENOS A VISTA É BONITA.",
          "SABIA QUE A GENTE VAI TER QUE SE ENFRENTAR NA CAPITAL? EU VOU TÁ PRONTO. JURO.",
        ],
        time: [["pikachu", 43, "shiny"], ["bangveet", 43], ["zoroark", 44], ["quaquaval", 46]],
      },
      LARA: {
        antes: [
          "ACHEI VOCÊ, MANO! O TANDEMAUS VIROU UMA FAMÍLIA INTEIRA: AGORA É MAUSHOLD.",
          "E O KIRLIA VIROU GARDEVOIR. ELA PROTEGE A GENTE, É ASSIM QUE ELA FUNCIONA.",
          "CINCO CONTRA OS SEUS. HOJE EU NÃO PERCO!",
        ],
        depois: [
          "PERDI. DE NOVO.",
          "MAS SABE O QUE A GARDEVOIR ME DISSE? QUE VOCÊ TAMBÉM FICA NERVOSO ANTES DE CADA LUTA. ISSO JÁ É ALGUMA COISA.",
        ],
        time: [["lopunny", 43, "shiny"], ["vaporeon", 43], ["maushold", 43], ["gardevoir", 44], ["meowscarada", 46]],
      },
      premio: 4200,
    },
    {
      id: "brasilia", cidade: "brasilia",
      requer: { flag: "starterChosen", ginasios: 7 },
      CAIO: {
        antes: [
          "BASCULINHA. A ÚLTIMA. DEPOIS DESSE GINÁSIO NÃO TEM MAIS PRA ONDE CORRER.",
          "LEMBRA QUANDO A GENTE APOSTAVA CORRIDA ATÉ A PADARIA? EU NUNCA GANHEI UMA.",
          "HOJE EU GANHO. QUAQUAVAL, PIKACHU, BANGVEET, ZOROARK — TODO MUNDO JUNTO!",
        ],
        depois: [
          "...",
          "TÁ CERTO. VOCÊ É A MAIS RÁPIDA DOS GÊMEOS. SEMPRE FOI.",
          "VAI LÁ NA NIEMA. E QUANDO VOLTAR PRA CASA, A GENTE APOSTA CORRIDA ATÉ A PADARIA DE NOVO.",
        ],
        time: [["pikachu", 50, "shiny"], ["bangveet", 50], ["zoroark", 51], ["quaquaval", 53]],
      },
      LARA: {
        antes: [
          "BASCULINHA. A ÚLTIMA INSÍGNIA, MANO.",
          "EU ESPEREI AQUI DE PROPÓSITO. QUERIA SER A ÚLTIMA COISA ENTRE VOCÊ E ELA.",
          "MEOWSCARADA, LOPUNNY, VAPOREON, MAUSHOLD, GARDEVOIR. É O MEU MELHOR. VEM!",
        ],
        depois: [
          "...",
          "TUDO BEM. DE VERDADE. EU SÓ QUERIA TER CERTEZA DE QUE VOCÊ TAVA PRONTO.",
          "TÁ PRONTO. VAI LÁ NA NIEMA E VOLTA INTEIRO, QUE A MÃE ME MATA SE VOCÊ NÃO VOLTAR.",
        ],
        time: [["lopunny", 50, "shiny"], ["vaporeon", 50], ["maushold", 50], ["gardevoir", 51], ["meowscarada", 53]],
      },
      premio: 6500,
    },
  ],
};
