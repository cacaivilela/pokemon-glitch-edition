// A LIGA DE BRAGLITCH — a ESPLANADA DA LIGA, embaixo de BASCULINHA.
//
// A história de lá é: ilha e ginásio, oito vezes; as lendas; o MISSINGNO chega
// e você vence ele; aí a LIGA, e quem vence a LIGA vira CAMPEÃO DE BRAGLITCH.
// O guarda do portão só deixa passar com as oito insígnias de ginásio e o
// MISSINGNO de Braglitch vencido (`flags.bragMissingnoVencido`, src/scenes/battle.js).
//
// AQUI NÃO TEM ELITE DOS QUATRO: tem o ELITE QUIZ. Cada um dos quatro mestres
// fecha a passagem de um paredão e faz um quiz difícil; acertou tudo, o seu
// RANK sobe (POKÉ, GREAT, ULTRA, MASTER) e ele sai da frente. Errou uma, o quiz
// dele começa de novo, com outras perguntas.
//
// No fim da esplanada, entre as duas cúpulas, estão os DOIS CAMPEÕES — e a luta
// é DUPLA: você e o seu gêmeo (o rival, src/data/rival.js) contra os dois.
// A cena é a de grupo (src/scenes/grupobattle.js, com `aliado` e `trainer2`).
// A lógica do portão, do quiz e dos campeões está em src/scenes/overworld.js
// (`talkLiga*`).

const Q = (pergunta, opcoes, certa = 0) => ({ pergunta, opcoes, certa });

export const LIGA = {
  mapa: "esplanada",
  /** quantas perguntas cada mestre faz (sorteadas da lista dele) */
  porQuiz: 3,
  ranks: ["POKÉ", "GREAT", "ULTRA", "MASTER"],

  portao: {
    antes: [
      "ESTA É A ESPLANADA DA LIGA DE BRAGLITCH.",
      "SÓ PASSA QUEM TEM AS OITO INSÍGNIAS DOS GINÁSIOS E JÁ ENFRENTOU O MISSINGNO QUE CHEGOU AQUI.",
    ],
    faltaInsignia: "VOCÊ TEM {N} DE 8 INSÍGNIAS DE GINÁSIO. VOLTA QUANDO TIVER TODAS.",
    faltaMissingno: "AS INSÍGNIAS ESTÃO AQUI... MAS O MISSINGNO AINDA ANDA SOLTO POR BRAGLITCH. VENCE ELE PRIMEIRO.",
    passa: [
      "OITO INSÍGNIAS. E O MISSINGNO... VENCIDO. É, VOCÊ É DE VERDADE.",
      "AQUI A ELITE NÃO LUTA: ELA PERGUNTA. SÃO QUATRO QUIZ, E CADA UM SOBE O SEU RANK.",
      "NO FIM DA ESPLANADA ESTÃO OS CAMPEÕES. BOA SORTE.",
    ],
    depois: ["A ESPLANADA É TODA SUA. QUATRO QUIZ E DEPOIS A ARENA."],
  },

  /** OS QUATRO MESTRES, na ordem dos paredões. Cada um sobe o rank pra `rank`. */
  quiz: [
    {
      nome: "PROFA. NOEMI", rank: "POKÉ",
      intro: ["EU SOU A PROFA. NOEMI. A MINHA MATÉRIA É A TABELA DE TIPOS.", "TRÊS PERGUNTAS. ERROU UMA, COMEÇA DE NOVO."],
      perguntas: [
        Q("GOLPE FANTASMA EM POKÉMON NORMAL CAUSA:", ["NADA", "METADE", "O DOBRO"], 0),
        Q("GOLPE DE TERRA EM POKÉMON VOADOR CAUSA:", ["O DOBRO", "NADA", "METADE"], 1),
        Q("GOLPE ELÉTRICO NUM GYARADOS (ÁGUA/VOADOR):", ["O DOBRO", "NORMAL", "4 VEZES"], 2),
        Q("GOLPE DE FADA EM DRAGÃO CAUSA:", ["METADE", "O DOBRO", "NADA"], 1),
        Q("GOLPE PSÍQUICO EM POKÉMON SOMBRIO:", ["NADA", "O DOBRO", "METADE"], 0),
        Q("GOLPE DE GELO NUM TORTERRA (PLANTA/TERRA):", ["O DOBRO", "4 VEZES", "METADE"], 1),
        Q("GOLPE LUTADOR NUM ORBEETLE-BRAG (ELÉTRICO/AÇO):", ["O DOBRO", "METADE", "NORMAL"], 0),
        Q("QUAL TIPO NÃO SOFRE NADA COM GOLPE DE VENENO?", ["PEDRA", "AÇO", "FANTASMA"], 1),
      ],
      depois: ["RANK POKÉ. É O PRIMEIRO DEGRAU, MAS É DEGRAU.", "O PRÓXIMO MESTRE NÃO É TÃO BOAZINHA QUANTO EU."],
    },
    {
      nome: "SEU BENEDITO", rank: "GREAT",
      intro: ["SEU BENEDITO, A SEU DISPOR. EU DECOREI A POKÉDEX INTEIRA. DUAS VEZES.", "VAMOS VER QUANTO VOCÊ LEU DA SUA."],
      perguntas: [
        Q("QUAL É O NÚMERO DO PIKACHU NA POKÉDEX?", ["#025", "#026", "#052"], 0),
        Q("EEVEE COM PEDRA DA ÁGUA VIRA:", ["JOLTEON", "VAPOREON", "GLACEON"], 1),
        Q("QUANTOS POKÉMON TINHA A POKÉDEX DE KANTO?", ["150", "152", "151"], 2),
        Q("MELMETAL EVOLUI DE QUEM?", ["MELTAN", "MAGNEMITE", "KLINK"], 0),
        Q("DESTES TRÊS, QUEM NÃO É INICIAL?", ["TOTODILE", "PIKACHU", "ROWLET"], 1),
        Q("MAUSHOLD EVOLUI DE QUEM?", ["RATTATA", "PAWMI", "TANDEMAUS"], 2),
        Q("QUAQUAVAL É ÁGUA E...", ["VOADOR", "LUTADOR", "NORMAL"], 1),
        Q("QUANTOS GOLPES UM POKÉMON SABE DE UMA VEZ?", ["4", "5", "6"], 0),
      ],
      depois: ["RANK GREAT! NADA MAL. A POKÉDEX AGRADECE.", "AGORA É A DONA CIRANDA. ELA NÃO PERGUNTA DE LIVRO, PERGUNTA DE CAUSO."],
    },
    {
      nome: "DONA CIRANDA", rank: "ULTRA",
      intro: ["EU SOU A DONA CIRANDA. EU CONTO OS CAUSOS DE BRAGLITCH.", "QUEM ANDOU DE VERDADE POR AQUI SABE. QUEM SÓ PASSOU, NÃO."],
      perguntas: [
        Q("QUAL LENDA DE BRAGLITCH É FOGO/FANTASMA?", ["CURUPIRA", "BOITATÁ", "IARA"], 1),
        Q("A IARA É ÁGUA E...", ["PSÍQUICO", "FADA", "FANTASMA"], 0),
        Q("O SACI É SOMBRIO E...", ["VOADOR", "LUTADOR", "GLITCH"], 2),
        Q("QUEM É A LÍDER DE BELÉM DO PARASECT?", ["JACIRA", "ZEFA DA FOGUEIRA", "LUZIA DAS ALMAS"], 0),
        Q("TRONKY É PLANTA E...", ["TERRA", "SOMBRIO", "FADA"], 1),
        Q("QUANTAS ILHAS A PROFA. IPÊ MANDA VOCÊ VISITAR?", ["CINCO", "SETE", "OITO"], 2),
        Q("O CURUPIRA TEM OS PÉS...", ["VIRADOS PRA TRÁS", "DE FOGO", "DE PEDRA"], 0),
        Q("EM QUE CIDADE FICA O GINÁSIO DE TIPO FANTASMA?", ["RIO DE JANEEVEE", "OURO GASTLY", "SALVADITTO"], 1),
      ],
      depois: ["RANK ULTRA. VOCÊ OUVIU OS CAUSOS. OU VIVEU ELES.", "O ÚLTIMO É O MESTRE DO QUIZ GLITCH. ELE É... DIFERENTE."],
    },
    {
      nome: "MESTRE GLITCH", rank: "MASTER",
      intro: ["B0A N01TE. EU SOU O MESTRE DO QUIZ GLITCH.", "AS MINHAS PERGUNTAS VÊM DO LADO DE DENTRO DO JOGO. SEM AJUDA DOS UNIVERSITÁRIOS."],
      perguntas: [
        Q("EM QUE ILHA DE KANTO O MISSINGNO. APARECIA?", ["CINNABAR", "ILHA UM", "VERMILION"], 0),
        Q("QUAL LÍDER DE BRAGLITCH LUTA COM O SACI?", ["GAMBI", "RAINHA LUA", "ENGENHEIRA NIEMA"], 2),
        Q("O MEGA AERODACTYL É DE QUE TIPOS?", ["PEDRA/DRAGÃO", "PEDRA/VOADOR", "AÇO/VOADOR"], 1),
        Q("QUANTAS FORMAS -BRAG TEM CADA ILHA DA IPÊ?", ["14", "10", "8"], 0),
        Q("QUAL É O TIPO DO GINÁSIO DE BASCULINHA?", ["AÇO", "ELÉTRICO", "GLITCH"], 2),
        Q("DE QUE LADO DO MAR FICA KANTO, OLHANDO DO PÍER?", ["AO NORTE", "AO SUL", "A LESTE"], 0),
        Q("O AMAZONIUM É PLANTA E...", ["FADA", "DRAGÃO", "SOMBRIO"], 0),
        Q("O ENCONTRIUM É ÁGUA E...", ["PSÍQUICO", "DRAGÃO", "AÇO"], 1),
      ],
      depois: ["R4NK... MASTER. A MÁQUINA NÃO ERRA, ENTÃO VOCÊ TAMBÉM NÃO.", "DESCE. OS CAMPEÕES ESTÃO ESPERANDO. E O SEU GÊMEO TAMBÉM."],
    },
  ],
  /** A SALA DA LIGA (pedido do CAIO, nov/2026: "faz a liga de braglitch tbm ser um
   *  prédio com uma sala que se transforma mas de um jeito diferente"; "robôs";
   *  "invés da elite quiz vai ter os 4 líderes de ginásio com os pkmns mais
   *  bombados"). Uma sala só, dentro do PRÉDIO DA LIGA da Esplanada: venceu um
   *  líder, os BRAÇOS ROBÓTICOS descem do teto, arrancam a sala em blocos e
   *  encaixam a do próximo (src/systems/ligabrag.js). A quinta forma é a CÚPULA
   *  dos CAMPEÕES. `tema` é o desenho da sala (o mesmo arquivo). */
  sala: { mapa: "liga_brag_sala", chegada: { x: 7, y: 11, dir: "up" }, lider: { x: 7, y: 3 } },
  lideres: [
    { nome: "GAMBI", sprite: "tecnico", tema: "oficina", titulo: "O ELETRICISTA DA GAMBIARRA",
      time: [["gatonet", 60], ["fus-gambiarra-orelhao", 61], ["araraio", 62], ["manguebit", 62], ["voltabum", 63], ["gambiarra", 65]],
      fala: ["VOLTOU, É? AGORA NÃO É GINÁSIO, É LIGA. E NA LIGA A GAMBIARRA É DE ALTA TENSÃO.",
             "TROQUEI TODOS OS FIOS DESDE A ÚLTIMA VEZ. QUER VER SE AGUENTA O CHOQUE?"],
      perdeu: ["...QUEIMOU O FUSÍVEL. O MEU, NÃO O SEU.", "OS ROBÔS VÃO MONTAR A SALA DA PRÓXIMA. SEGURA FIRME."] },
    { nome: "LUZIA DAS ALMAS", sprite: "velha", tema: "capela", titulo: "A CONTADORA DE CAUSOS",
      time: [["zerogle", 61], ["fus-assombracao-ghotolt", 62], ["boitata", 63], ["lobisomem", 63], ["curupira", 64], ["assombracao", 66]],
      fala: ["SENTA, CRIANÇA. NA LIGA EU NÃO CONTO CAUSO: EU MOSTRO.",
             "CADA ALMA DESTA SALA JÁ PERDEU PRA ALGUÉM. HOJE ELAS QUEREM GANHAR."],
      perdeu: ["AS ALMAS SE ACALMARAM. VOCÊ TEM A LUZ DE QUEM ANDOU MUITO.", "VAI. A RAINHA JÁ ESTÁ TOCANDO O TAMBOR."] },
    { nome: "RAINHA LUA", sprite: "superf", tema: "samba", titulo: "A RAINHA DA BATERIA",
      time: [["brigadeirinho", 62], ["fus-encantado-plumario", 63], ["beijaflorzinha", 63], ["lorose", 64], ["iara", 65], ["encantado", 67]],
      fala: ["OLHA QUEM CHEGOU NO DESFILE! A BATERIA DA LIGA NÃO PARA NUNCA.",
             "AQUI CADA BATIDA É UM GOLPE. ENTRA NO RITMO OU SAI DA AVENIDA!"],
      perdeu: ["NOTA DEZ, NOTA DEZ, NOTA DEZ! VOCÊ GANHOU O DESFILE.", "A NIEMA TÁ NO SERVIDOR. CUIDADO: ELA NÃO PERDE NADA."] },
    { nome: "ENGENHEIRA NIEMA", sprite: "cientista", tema: "servidor", titulo: "A ARQUITETA DO SERVIDOR",
      time: [["chuvisco", 63], ["fus-concretao-saci", 64], ["submarinum", 64], ["destroium", 65], ["monstela", 66], ["saci", 67]],
      fala: ["FUI EU QUE PROJETEI ESTA SALA. E OS ROBÔS. E O SERVIDOR QUE COMANDA OS ROBÔS.",
             "CALCULEI 4.096 JEITOS DE VOCÊ PERDER. VAMOS TESTAR O PRIMEIRO."],
      perdeu: ["...ERRO NÃO PREVISTO. VOCÊ É O ERRO NÃO PREVISTO.",
               "OS ROBÔS VÃO MONTAR A CÚPULA. OS CAMPEÕES ESTÃO ESPERANDO. E O SEU GÊMEO TAMBÉM."] },
  ],
  /** O HALL DA FAMA DE BRAGLITCH (src/scenes/halldafama.js, `garras`): logo
   *  depois dos campeões, ali mesmo na CÚPULA — as garras da NIEMA montam cada
   *  Pokémon do time, e o GÊMEO entra na foto do seu lado */
  hall: {
    titulo: "HALL DA FAMA DE BRAGLITCH",
    antes: [
      "DALVA: AINDA NÃO ACABOU. TODO CAMPEÃO DE BRAGLITCH FICA GRAVADO NA CÚPULA.",
      "TOMÉ: A NIEMA PROGRAMOU AS GARRAS PRA MONTAR CADA UM DOS SEUS POKÉMON, PEDACINHO POR PEDACINHO.",
      "DALVA: E VOCÊS DOIS ENTRAM JUNTOS. FOI DUPLA, ENTÃO O REGISTRO É DE DUPLA.",
    ],
    depois: [
      "DALVA: PRONTO. A CÚPULA NUNCA MAIS ESQUECE VOCÊS.",
      "TOMÉ: AGORA VAI. BRAGLITCH INTEIRA JÁ SABE QUEM SÃO OS CAMPEÕES.",
    ],
  },
  /** o tema da quinta forma da sala (a dos CAMPEÕES) */
  temaCampeoes: "cupula",
  troca: "A SALA SE TRANSFORMOU! {QUEM} ESTÁ ESPERANDO.",

  certo: "CERTO!",
  errado: ["ERRADO!", "O QUIZ COMEÇA DE NOVO. FALA COMIGO QUANDO ESTIVER PRONTO."],
  subiu: "SEU RANK SUBIU PRA {RANK}!",
  fimQuiz: "ACERTOU TUDO!",

  /** OS DOIS CAMPEÕES. A DALVA é candanga: ajudou a levantar a capital com as
   *  próprias mãos, e o time dela é de metal, concreto e fóssil — com o
   *  AERODACTYL que ela MEGA EVOLUI na luta (`mega`). O TOMÉ é vaqueiro do
   *  cerrado, e o time dele é de céu aberto e de chão batido. */
  campeoes: [
    {
      id: "dalva", nome: "DALVA", sprite: "tecnica", x: 6, y: 3,
      time: [["melmetal", 69], ["fus-stegarmorex-orbeetlebrag", 68], ["concretao", 68], ["piranhorda", 69], ["stegarmorex", 70], ["aerodactyl", 72, "mega"]],
    },
    {
      id: "tome", nome: "TOMÉ", sprite: "montanhista", x: 8, y: 3,
      time: [["dragonite", 71], ["fus-amazonium-volcarona", 70], ["encantado", 68], ["sandbash", 68], ["lobisomem", 69], ["amazonium", 70]],
    },
  ],
  /** o MEGA AERODACTYL da DALVA: a forma em que ele vira na hora que entra */
  megas: { aerodactyl: "megaaerodactyl" },
  falaMega: ["DALVA: ESSA PEDRA EU ACHEI NA FUNDAÇÃO DO CONGRESSO. ELA ESPEROU SESSENTA ANOS POR ESSE DIA."],
  premio: 15000,

  /** o GÊMEO na arena: o time final dele, um pouco acima do de BASCULINHA */
  gemeo: {
    lugar: { x: 5, y: 8, dir: "up" },
    CAIO: {
      // (6 Pokémon: no HALL DA FAMA entram os 12, os seus e os dele)
      time: [["pikachu", 66, "shiny"], ["fus-zoroark-bangveet", 66], ["zoroark", 67], ["manguebit", 66], ["gingao", 67], ["quaquaval", 68]],
      espera: ["MANA! SABIA QUE VOCÊ CHEGAVA. EU PASSEI NO QUIZ POR UM FIO... UM FIO BEM FININHO.",
               "SÃO DOIS CAMPEÕES, ENTÃO A GENTE VAI JUNTO. É DUPLA: VOCÊ E EU.",
               "FALA COM ELES QUANDO ESTIVER PRONTA. EU TÔ DO SEU LADO."],
      depois: ["A GENTE CONSEGUIU, MANA! A GENTE CONSEGUIU!", "...TÁ, VOCÊ CONSEGUIU MAIS. MAS EU AJUDEI. ANOTA AÍ."],
    },
    LARA: {
      time: [["lopunny", 66, "shiny"], ["fus-gardevoir-vaporeon", 66], ["maushold", 66], ["gardevoir", 67], ["plumario", 66], ["meowscarada", 68]],
      espera: ["MANO. DEMOROU, HEIN. EU PASSEI NO QUIZ DE PRIMEIRA, SÓ PRA CONSTAR.",
               "SÃO DOIS CAMPEÕES. ENTÃO NÃO TEM JEITO: É VOCÊ E EU, LADO A LADO.",
               "QUANDO ESTIVER PRONTO, FALA COM ELES. EU VOU JUNTO."],
      depois: ["A GENTE GANHOU, MANO. DE VERDADE.", "A MÃE VAI CHORAR. EU TAMBÉM, MAS NÃO CONTA PRA NINGUÉM."],
    },
  },

  desafio: [
    "DALVA: ENTÃO SÃO VOCÊS, OS GÊMEOS DE SÃO LUCARIO.",
    "TOMÉ: DOIS CAMPEÕES, DOIS DESAFIANTES. É ASSIM QUE A LIGA DE BRAGLITCH FUNCIONA.",
    "DALVA: EU AJUDEI A LEVANTAR ESTA CIDADE COM CONCRETO E FERRO. VAMOS VER O QUE VOCÊS LEVANTAM.",
    "TOMÉ: E EU VIM DO CERRADO, ONDE O CÉU NÃO TEM FIM. PODEM VIR OS DOIS!",
  ],
  pergunta: "LUTAR CONTRA OS CAMPEÕES?",
  opcoes: ["LUTAR", "AGORA NÃO"],
  recusou: "TOMÉ: SEM PRESSA. A ARENA NÃO VAI SAIR DAQUI.",
  nomeDupla: "CAMPEÕES DALVA E TOMÉ",
  vitoria: [
    "DALVA: ...O CONCRETO RACHOU. E EU NUNCA FIQUEI TÃO FELIZ DE VER UMA RACHADURA.",
    "TOMÉ: O CERRADO TEM CAMPEÕES NOVOS. E QUE CAMPEÕES.",
    "DALVA: {NOME}, A PARTIR DE HOJE VOCÊ É CAMPEÃO DE BRAGLITCH.",
    "O SEU NOME E O DOS SEUS POKÉMON FICAM GRAVADOS NA CÚPULA DO CONGRESSO. PRA SEMPRE.",
  ],
  campeao: "{NOME} VIROU CAMPEÃO DE BRAGLITCH! AGORA AS LOJAS VENDEM MASTER BALL PRA VOCÊ!",
  depois: {
    dalva: ["O SEU NOME ESTÁ NA CÚPULA. EU MESMA SUBI NA ESCADA PRA GRAVAR."],
    tome: ["VOLTA QUANDO QUISER. A ARENA AGORA É SUA TAMBÉM."],
  },
};

// ------------------------------------------------------------ A ESPLANADA
// Entra por cima (de BASCULINHA) e desce: o Centro e a loja na entrada, o
// portão do guarda e os quatro paredões do quiz (cada um com UMA passagem de
// chão, na coluna 14, onde o mestre fica), e lá embaixo a arena.
const PAREDE = "#RRRRRRRRRRRRR.RRRRRRRRRRRRRR#";
const PATIO = [
  "#.............PP.............#",
  "#..FFFF.......PP.......FFFF..#",
  "#..FFFF.......PP.......FFFF..#",
  "#.............PP.............#",
];
/** a fileira de cada paredão (o portão é o primeiro) */
export const PAREDOES = [8, 13, 18, 23, 28];
LIGA.paredoes = PAREDOES;

export const LUGARES = [
  {
    id: "esplanada",
    nome: "ESPLANADA DA LIGA",
    tipo: "cidade",
    tema: "cerrado",
    musica: "saolucario",
    planta: [
      "##############PP##############",
      "#F..CCCCC.....PP.....MMMM...F#",
      "#...CCCCC.....PP.....MMMM....#",
      "#...CCCCC.....PP.....MMMM....#",
      "#.....D.......PP......D......#",
      "#.....PPPPPPPPPPPPPPPPP......#",
      "#..1..........PP.............#",
      "#FF...........PP...........FF#",
      PAREDE,
      "#.............PP.............#",
      "#..FFFF.......PP.......FFFF..#",
      "#..FFFF.......PP...2...FFFF..#",
      "#.............PP.............#",
      "#.......LLLLLLLLLLLLLL.......#",
      "#..o....LLLLLLLLLLLLLL....o..#",
      "#.......LLLLLLLLLLLLLL.......#",
      "#.......LLLLLLLLLLLLLL.......#",
      "#.......LLLLLLLLLLLLLL.......#",
      "#.............DP.............#",
      "#.............PP.............#",
      "#FFFFF........PP........FFFFF#",
      "#FFFFFFFFFFFFFFFFFFFFFFFFFFFF#",
      "##############################",
    ],
    saidas: { up: 14 },
    placas: {
      1: "ESPLANADA DA LIGA DE BRAGLITCH.\nQUEM SOBE O RANK, DESCE PRA ARENA.",
      2: "PRÉDIO DA LIGA DE BRAGLITCH.\nQUATRO LÍDERES, UMA SALA SÓ. OS CAMPEÕES NO FIM.",
    },
    centro: "BEM-VINDO AO CENTRO POKÉMON DA LIGA! AQUI NINGUÉM ENTRA NA ARENA CANSADO.",
    npcs: [
      // o portão
      { id: "guarda", x: 14, y: PAREDOES[0], dir: "up", sprite: "policial", ligaPortao: true,
        someComFlag: "ligaPortao", lines: ["..."] },
      { id: "guarda_lado", x: 12, y: PAREDOES[0] - 1, dir: "right", sprite: "policial", comFlag: "ligaPortao",
        lines: LIGA.portao.depois },
      // OS DESAFIANTES (pedido do CAIO, nov/2026): quem juntou as 8 insígnias e
      // veio tentar a Liga, com o SÍMBOLO DA LIGA inteiro no peito (src/core/insigniascorpo.js)
      { id: "desafiante_a", x: 10, y: 19, dir: "right", sprite: "garoto", desafianteLiga: true,
        lines: ["OLHA O MEU PEITO: AS OITO JUNTAS FAZEM O SÍMBOLO DA LIGA!", "QUEM ENTRA LÁ DENTRO COM ELE COMPLETO É LEVADO A SÉRIO."],
        afterLines: ["TÁ, VOCÊ TAMBÉM TEM O SÍMBOLO INTEIRO. ENTÃO VAI LÁ!"],
        trainer: { name: "DESAFIANTE TIAGO", prize: 4200, sight: 3, party: [{ id: "tilapiracu", lvl: 58 }, { id: "boitata", lvl: 58 }] } },
      { id: "desafiante_b", x: 19, y: 19, dir: "left", sprite: "garota", desafianteLiga: true,
        lines: ["CADA INSÍGNIA FOI UM PEDAÇO. A SAMAÚMA FOI O PRIMEIRO, A CÚPULA O ÚLTIMO.", "AGORA FALTA O MAIS DIFÍCIL."],
        afterLines: ["O MEIO DO SÍMBOLO SÓ ACENDE COM AS OITO. O SEU ESTÁ ACESO?"],
        trainer: { name: "DESAFIANTE BIA", prize: 4200, sight: 3, party: [{ id: "paubrasilisco", lvl: 58 }, { id: "iara", lvl: 59 }] } },
      { id: "desafiante_c", x: 5, y: 12, dir: "down", sprite: "montanhista", desafianteLiga: true,
        lines: ["VIM DE BELÉM ATÉ AQUI A PÉ. O SÍMBOLO NO PEITO PESA MAIS QUE A MOCHILA."],
        afterLines: ["QUANDO EU GANHAR DA LIGA, VOU PENDURAR ELE NA PAREDE DE CASA."],
        trainer: { name: "DESAFIANTE RUI", prize: 4200, sight: 3, party: [{ id: "curupira", lvl: 59 }, { id: "tilapiracu", lvl: 59 }] } },
      // (os quatro mestres do quiz e os campeões saíram: agora é o PRÉDIO DA LIGA)
    ],
  },
  {
    id: "liga_brag_sala",
    nome: "LIGA DE BRAGLITCH",
    tipo: "sala",
    tema: "ligabrag",
    musica: "saolucario",
    ligaBrag: true,
    planta: [
      "###############",
      "###############",
      "#.............#",
      "#.............#",
      "#.............#",
      "#.............#",
      "#.............#",
      "#.............#",
      "#.............#",
      "#.............#",
      "#.............#",
      "#.............#",
      "#######U#######",
    ],
    saidas: {},
    placas: {},
    npcs: [
      // o líder da vez (só um aparece: `mostrar`, src/systems/ligabrag.js)
      ...LIGA.lideres.map((l, i) => ({
        id: `lider_liga${i}`, x: 7, y: 3, dir: "down", sprite: l.sprite, ligaBragLider: i,
        mostrar: (st) => (st.flags?.ligaBragEtapa || 0) === i && !st.flags?.ligaBragTrocando,
        lines: l.fala, afterLines: l.perdeu,
        trainer: { name: `${l.nome}`, prize: 6000 + i * 1500, sight: 0, etapaLigaBrag: i, lider: true,
                   party: l.time.map(([id, lvl]) => ({ id, lvl })) },
      })),
      // os campeões, na CÚPULA
      ...LIGA.campeoes.map((c) => ({ id: c.id, x: c.x, y: c.y, dir: "down", sprite: c.sprite, ligaCampeao: true, ligaBragFinal: true, lines: ["..."],
        mostrar: (st) => (st.flags?.ligaBragEtapa || 0) >= LIGA.lideres.length && !st.flags?.ligaBragTrocando })),
    ],
  },
];


/** A PORTA DO PRÉDIO DA LIGA (o D embaixo do L da Esplanada) e a porta da SALA (o
 *  U de baixo dela) apontam uma pra outra. Chamado com os mapas de Braglitch
 *  já montados (src/data/index.js). */
export function ligarSalaDaLiga(geos) {
  const esp = geos?.[LIGA.mapa], sala = geos?.[LIGA.sala.mapa];
  if (!esp || !sala) return;
  const porta = esp.warps.findIndex((w) => w.predio === "L");
  const saida = sala.warps.findIndex((w) => w.predio === "U");
  if (porta < 0 || saida < 0) return;
  esp.warps[porta] = { ...esp.warps[porta], to: LIGA.sala.mapa, toWarp: saida };
  sala.warps[saida] = { ...sala.warps[saida], to: LIGA.mapa, toWarp: porta };
}
