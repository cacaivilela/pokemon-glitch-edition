// O REGISTRO 0x3F: a história principal do ??????????.
//
// ?????????? é o que o cartucho mostra quando a espécie não existe: dez
// interrogações no lugar de um nome. O laboratório de CINNABAR guardava um
// registro vazio — um número sem Pokémon, um espaço reservado — e depois que a
// fenda abriu, o espaço começou a andar.
//
// SÓ EXISTE UM. Ele não nasce na grama, não vem da fenda, não sai de ovo (os
// de tipo GLITCH ficam fora do MYSTERY EGG, src/data/ovos.js). Ele é o fim de
// uma história em quatro capítulos, contada pela pesquisadora do laboratório de
// Cinnabar, e está PARADO num lugar só: a costa leste da ilha, onde o mapa
// acaba — que é onde as coisas que não existem sempre apareceram em Kanto.
// Capturado, ele some do mundo (como os outros parados, src/data/extra.js).
// As duas exceções são de quem escolhe: o terminal 011GIVEGLITCH110 e o DLC
// REVOLTA DE DECAMARK, que solta ele em toda rota de propósito.
//
// Os capítulos são missões em cadeia (src/data/missoes.js puxa `MISSOES_DECAMARK`
// daqui), no mesmo NPC — o jogo escolhe qual pedido ela faz pela ordem:
//
//   1. O REGISTRO VAZIO       ler a página arrancada do diário da MANSÃO
//   2. QUEM APAGOU            fazer o BLAINE falar (ele só fala com quem venceu)
//   3. O QUE SE APAGA NÃO SOME   buscar o REGISTRO 0x3F no fundo da fenda
//   4. DEZ INTERROGAÇÕES      ir aonde o registro aponta e capturar
//
// Tudo aqui tem hot-swap.

const ID = "decamark";
export const REGISTRO = "registro 0x3f";

/** A espécie. Tipo GLITCH, como o MISSINGNO.; os golpes são os dele. O sprite
 *  é assets/sprites/pokemon/decamark.png (dex 0 não tem número de arquivo,
 *  então o jogo procura pelo id): dez "?" tortos em cima de um chão de ruído. */
export const DECAMARK_ESPECIE = {
  [ID]: {
    id: ID, dex: 0, name: "??????????", types: ["GLITCH"],
    base: { hp: 90, atk: 100, def: 40, spa: 100, spd: 40, spe: 120 },
    bst: 490,
    learnset: [[1, "corrompida"], [1, "ruidobranco"], [12, "lambida"], [24, "sobrescrever"], [36, "bolasombria"]],
    dexText: "DEZ INTERROGAÇÕES ONDE DEVIA HAVER UM NOME. NÃO É UM POKÉMON. É O LUGAR ONDE UM POKÉMON DEVERIA ESTAR.",
    catchRate: 20, xpYield: 180, foreign: true,
    placeholder: { shape: "glitch" },
  },
};

export const DECAMARK_LORE = {
  [REGISTRO]: "UMA FICHA DE PESQUISA COM O CAMPO ESPÉCIE EM BRANCO. ALGUÉM ESCREVEU ?????????? À MÃO E DEPOIS TENTOU APAGAR.",
};

/** Onde a pesquisadora fica: a praça do laboratório, em Cinnabar. */
const ONDE = { mapa: "cinnabar_island", x: 17, y: 5, sprite: "cientista" };

/** O REGISTRO 0x3F dentro da fenda: uma bola fechada, num canto longe da
 *  entrada, que só está lá enquanto o capítulo 3 estiver aberto (a cena monta
 *  ela em src/scenes/overworld.js, junto com o portal e as outras bolas). */
export const REGISTRO_NA_FENDA = {
  x: 38, y: 4,
  missao: "decamark-registro",
  achado: [
    "UMA POKÉ BOLA FECHADA NO CANTO MAIS LONGE DA ENTRADA. ELA NÃO ABRE SOZINHA COMO AS OUTRAS.",
    "DENTRO NÃO TEM POKÉMON. TEM UMA FICHA DOBRADA EM QUATRO.",
    "VOCÊ PEGOU O REGISTRO 0x3F!",
  ],
};

/** O parado: na costa leste da ilha, em cima da água, onde o mapa acaba. */
export const DECAMARK_ESTATICO = {
  id: ID, mapa: "cinnabar_island", x: 23, y: 6, nivel: 55, corrupt: true,
  missao: "decamark-costa",
  lines: [
    "A COSTA ACABA AQUI. DEPOIS DESTA ÁGUA O MAPA NÃO TEM MAIS NADA.",
    "E EM CIMA DELA TEM DEZ INTERROGAÇÕES PARADAS, UMA DO LADO DA OUTRA.",
    "ELAS NÃO SE MEXEM. NÃO FOGEM. NÃO TÊM MOTIVO PRA TER MEDO.",
    "UM POKÉMON QUE NÃO EXISTE ESTÁ OLHANDO PRA VOCÊ.",
  ],
};

/** O que o BLAINE conta (capítulo 2). `conta` é lido em talkTo, no overworld:
 *  com a missão aberta e ele já vencido, ele fala isto e marca a bandeira. */
export const BLAINE_CONTA = {
  missao: "decamark-blaine",
  flag: "decamark_blaine",
  lines: [
    "...QUEM TE CONTOU DA PÁGINA?",
    "FUI EU QUE ARRANQUEI. A LETRA É MINHA. EU ERA MOÇO E ACHAVA QUE APAGAR RESOLVIA.",
    "ANTES DO MEWTWO A GENTE COPIOU O MEW E SAIU O DITTO. UMA MASSA QUE VIRA QUALQUER COISA PORQUE NÃO É NENHUMA.",
    "AÍ TENTAMOS SEM O MEW. SEM ORIGINAL. NÃO NASCEU NADA. NASCEU UM NÚMERO.",
    "O REGISTRO FICOU. UM CAMPO DE ESPÉCIE EM BRANCO, ESPERANDO UM NOME QUE NUNCA VEIO.",
    "E EU APRENDI UMA COISA NESTE CARTUCHO: NADA SE APAGA. VAI PRA ONDE NÃO TEM NADA.",
    "SE VOCÊ QUER O REGISTRO DE VOLTA, ELE ESTÁ NA FENDA. NO CANTO MAIS LONGE DE TUDO.",
  ],
};

/** As placas: o aviso na cidade e os diários da mansão. Os diários são os
 *  objetos de mesa que o FireRed já tinha (os tiles de placa vieram com o
 *  mapa); o de baixo é o que a pesquisadora manda ler, e por isso marca uma
 *  bandeira quando é lido. */
export const DECAMARK_PLACAS = {
  cinnabar_island: {
    "12,3": "ILHA CINNABAR. AVISO DO LABORATÓRIO: SE VIR ??????????, NÃO SALVE. SE JÁ SALVOU, NÃO ABRA.",
  },
  pokemon_mansion_1f: {
    "5,5": "DIÁRIO — 5 DE JULHO. GUIANA, AMÉRICA DO SUL. ACHAMOS UM POKÉMON NOVO NA MATA. CHAMAMOS DE MEW.",
    "2,21": "DIÁRIO — 10 DE JULHO. ESTÁ CONFIRMADO: O MEW DÁ CRIA. TRAZEMOS O FILHOTE PRA ILHA.",
  },
  pokemon_mansion_2f: {
    "2,16": "DIÁRIO — 6 DE FEVEREIRO. A CRIA NASCEU. DEMOS O NOME DE MEWTWO. ELA É FORTE DEMAIS.",
    // a teoria do DITTO: a cópia do MEW que não segurou a forma. Não é
    // invenção daqui — o DITTO nasce no porão desta mansão desde o FireRed,
    // e é o único bicho do jogo que copia qualquer coisa e não é nada.
    "6,31": "DIÁRIO — 20 DE DEZEMBRO. AS PRIMEIRAS CÓPIAS DO MEW NÃO SEGURARAM A FORMA. VIRARAM UMA MASSA ROXA QUE COPIA O QUE VÊ E NÃO É NADA. SOLTAMOS NO PORÃO. ELAS AINDA ESTÃO LÁ.",
    "25,4": "UMA ESTANTE DE FICHAS. TODAS NUMERADAS, TODAS PREENCHIDAS. A GAVETA 0x3F ESTÁ VAZIA. A GAVETA 132 ESTÁ CHEIA DEMAIS.",
  },
  pokemon_mansion_3f: {
    "12,5": "DIÁRIO — 1 DE SETEMBRO. O MEWTWO NÃO OBEDECE. NÃO DÁ PRA SEGURAR. A MANSÃO NÃO VAI AGUENTAR.",
    "36,13": "UM QUADRO DE AVISOS. \"QUEM MEXEU NO REGISTRO 0x3F? — B.\" ESCRITO POR CIMA: \"EU. ESQUECE. — B.\"",
  },
  pokemon_mansion_b1f: {
    "21,27": {
      bandeira: "decamark_diario",
      texto: [
        "UM DIÁRIO COM A LOMBADA QUEBRADA. FALTA UMA PÁGINA — E ELA ESTÁ DOBRADA DENTRO DA CAPA.",
        "\"AS CÓPIAS DO MEW DERAM ERRADO: VIRARAM DITTO. ENTÃO TENTAMOS UMA VEZ SEM O MEW. SÓ COM O REGISTRO EM BRANCO E A MÁQUINA.\"",
        "\"O DITTO É UMA CÓPIA SEM FORMA. ISTO É PIOR: É UMA CÓPIA SEM ORIGINAL. NÃO NASCEU NADA — MAS O REGISTRO FICOU ?????????? E A MÁQUINA CONTOU ELE COMO VIVO.\"",
        "\"APAGUEI O REGISTRO. NÚMERO 0x3F. NINGUÉM PRECISA SABER.\" — B.",
      ],
    },
    "24,29": "DIÁRIO — SEM DATA. \"O MEWTWO SAIU PELA PAREDE. A GENTE NÃO VAI ATRÁS.\"",
  },
};

/** Os quatro capítulos, no formato de src/data/missoes.js. */
export const MISSOES_DECAMARK = [
  {
    id: "decamark-diario",
    nome: "O REGISTRO VAZIO",
    ...ONDE,
    requer: { insignias: 6 },
    travado: [
      "VOCÊ TAMBÉM VIU? AS INTERROGAÇÕES?",
      "...NÃO. VOCÊ AINDA NÃO VIU. VOLTA QUANDO TIVER MAIS ESTRADA. EU VOU PRECISAR DE ALGUÉM QUE AGUENTE.",
    ],
    objetivo: { tipo: "bandeira", flag: "decamark_diario" },
    resumo: "LER O DIÁRIO DO PORÃO DA MANSÃO POKÉMON.",
    oferta: [
      "VOCÊ TAMBÉM VIU? AS INTERROGAÇÕES?",
      "O LABORATÓRIO DAQUI GUARDAVA UM REGISTRO VAZIO. NÚMERO 0x3F. UM NÚMERO SEM POKÉMON — UM ESPAÇO RESERVADO.",
      "DEPOIS QUE A FENDA ABRIU, O ESPAÇO COMEÇOU A APARECER NAS LEITURAS. PRIMEIRO NA COSTA. DEPOIS EM TODA PARTE.",
      "QUEM RESERVOU O NÚMERO FOI A EQUIPE DA MANSÃO, A DO MEWTWO. OS DIÁRIOS DELES AINDA ESTÃO LÁ.",
      "TEM UM NO PORÃO QUE NINGUÉM LÊ, PORQUE FALTA UMA PÁGINA. EU ACHO QUE A PÁGINA NÃO FALTA. EU ACHO QUE ESTÁ ESCONDIDA.",
    ],
    lembrete: ["O PORÃO DA MANSÃO. O DIÁRIO DA MESA DO FUNDO. PROCURE A PÁGINA QUE FALTA."],
    entrega: [
      "\"NÃO NASCEU NADA. MAS O REGISTRO NÃO FICOU VAZIO.\"",
      "ENTÃO O DITTO DO PORÃO É ISSO: O MEW COPIADO SEM DAR CERTO. E DEPOIS ELES TENTARAM SEM O MEW — E O QUE NASCEU FOI O NÚMERO.",
      "A PÁGINA ESTÁ ASSINADA. UMA LETRA SÓ. B.",
      "SÓ SOBROU UMA PESSOA DAQUELA EQUIPE NA ILHA, E ELA NÃO FALA DISSO COM NINGUÉM.",
    ],
    premio: { dinheiro: 5000, item: "doce raro", qtd: 2 },
  },
  {
    id: "decamark-blaine",
    nome: "QUEM APAGOU",
    ...ONDE,
    requer: { missao: "decamark-diario", insignias: 7 },
    travado: [
      "O B. DA PÁGINA É O LÍDER DO GINÁSIO. E O BLAINE NÃO CONVERSA COM QUEM NÃO VENCEU ELE.",
      "VOLTA AQUI COM A INSÍGNIA VULCÃO. AÍ ELE VAI TER QUE TE OUVIR.",
    ],
    objetivo: { tipo: "bandeira", flag: "decamark_blaine" },
    resumo: "FAZER O BLAINE FALAR DA PÁGINA QUE ELE ARRANCOU.",
    oferta: [
      "O B. DA PÁGINA É O BLAINE. ELE ERA DA EQUIPE DA MANSÃO ANTES DE SER LÍDER DE GINÁSIO.",
      "ELE NUNCA FALOU DISSO COMIGO. MAS VOCÊ TEM A INSÍGNIA DELE — E QUEM VENCE O BLAINE, ELE OUVE.",
      "VÁ ATÉ O GINÁSIO E PERGUNTE DA PÁGINA. DIGA QUE FOI A PESQUISADORA DO LABORATÓRIO QUE MANDOU.",
    ],
    lembrete: ["O BLAINE, NO GINÁSIO. PERGUNTE DA PÁGINA. ELE VAI SABER DO QUE VOCÊ ESTÁ FALANDO."],
    entrega: [
      "ELE FALOU. DEPOIS DE TODOS ESSES ANOS, ELE FALOU.",
      "\"NADA SE APAGA. VAI PRA ONDE NÃO TEM NADA.\" É A FENDA. É ÓBVIO QUE É A FENDA.",
      "O REGISTRO ESTÁ LÁ. E SE O REGISTRO ESTÁ LÁ, O QUE ESTÁ ESCRITO NELE TAMBÉM ESTÁ.",
    ],
    premio: { dinheiro: 6000, item: "doce raro", qtd: 3 },
  },
  {
    id: "decamark-registro",
    nome: "O QUE SE APAGA NÃO SOME",
    ...ONDE,
    requer: { missao: "decamark-blaine" },
    objetivo: { tipo: "tem-item", item: REGISTRO },
    resumo: "BUSCAR O REGISTRO 0x3F NO CANTO MAIS LONGE DA FENDA.",
    oferta: [
      "EU PRECISO DO REGISTRO. É A ÚNICA COISA QUE DIZ ONDE ELE ESTÁ.",
      "O BLAINE DISSE \"NO CANTO MAIS LONGE DE TUDO\". A FENDA TEM UM CANTO ASSIM: O OPOSTO DA ENTRADA.",
      "VAI TER UMA BOLA LÁ. NÃO VAI SER BICHO. TRAZ PRA MIM.",
    ],
    lembrete: ["A FENDA. O CANTO OPOSTO À ENTRADA, LÁ NO ALTO. UMA BOLA QUE NÃO ABRE SOZINHA."],
    entrega: [
      "É ESTE. NÚMERO 0x3F. O CAMPO DE ESPÉCIE EM BRANCO.",
      "...NÃO ESTÁ EM BRANCO. ALGUÉM ESCREVEU ?????????? À MÃO E TENTOU APAGAR. E EMBAIXO TEM COORDENADAS.",
      "SÃO DAQUI. DA ILHA. A COSTA LESTE, ONDE O MAPA ACABA.",
      "É ONDE AS COISAS QUE NÃO EXISTEM SEMPRE APARECERAM EM KANTO. EU DEVIA TER PENSADO NISSO ANTES.",
    ],
    premio: { dinheiro: 8000, item: "doce raro", qtd: 4 },
  },
  {
    id: "decamark-costa",
    nome: "DEZ INTERROGAÇÕES",
    ...ONDE,
    requer: { missao: "decamark-registro" },
    objetivo: { tipo: "capturou-especie", especie: ID },
    libera: ID,
    resumo: "IR À COSTA LESTE DE CINNABAR, ONDE O MAPA ACABA, E CAPTURAR O QUE ESTÁ LÁ.",
    oferta: [
      "A COSTA LESTE. É SÓ ANDAR ATÉ A BEIRA DA ILHA E OLHAR PRA ÁGUA.",
      "ELE NÃO VAI FUGIR. UM POKÉMON QUE NÃO EXISTE NÃO TEM MEDO DE NADA.",
      "LEVE BOLAS. LEVE MUITAS. E NÃO SALVE COM ELE NA TELA — EU NÃO SEI O QUE ACONTECE, E NÃO QUERO SABER.",
    ],
    lembrete: ["A BEIRA LESTE DA ILHA, EM CIMA DA ÁGUA. ELE ESTÁ LÁ. ELE SEMPRE ESTEVE."],
    entrega: [
      "VOCÊ PEGOU. O REGISTRO 0x3F TEM UM POKÉMON.",
      "NÃO É QUE ELE NÃO EXISTIA. É QUE NINGUÉM TINHA DEIXADO ELE EXISTIR.",
      "O DITTO COPIA QUALQUER UM PORQUE NÃO É NINGUÉM. ESSE AÍ NÃO COPIA NADA — ELE É O ESPAÇO ONDE ALGUÉM DEVIA ESTAR.",
      "GUARDE A FICHA. E GUARDE ELE. NÃO VAI TER OUTRO — ESSE NÚMERO SÓ TINHA UM ESPAÇO.",
      "LEVE ISTO. É O QUE O LABORATÓRIO PAGARIA POR UMA ESPÉCIE NOVA. E ESTA É A MAIS NOVA QUE EXISTE.",
    ],
    premio: { dinheiro: 20000, item: "doce raro", qtd: 10 },
  },
];
