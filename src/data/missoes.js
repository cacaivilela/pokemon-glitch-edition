// SIDE QUESTS.
//
// Cada missão é um NPC parado num mapa, com um pedido que o jogo consegue
// CONFERIR sozinho olhando o save: ninguém precisa de gatilho espalhado pelo
// código. Você pega o pedido, cumpre quando quiser, e volta pra receber — como
// nos jogos da série. O que cada tipo de objetivo confere está em
// src/systems/missoes.js.
//
// Os NPCs entram nos mapas sozinhos: o fim de src/data/maps.js percorre esta
// lista e põe cada um no lugar dele. Tudo aqui tem hot-swap — dá pra reescrever
// um pedido, mudar a recompensa ou mover o NPC com o jogo aberto.
//
// Campos:
//   id        chave no save (state.missoes)
//   nome      como aparece no diário
//   mapa/x/y  onde o NPC fica (tile andável, longe da frente das portas)
//   sprite    a arte dele, igual à dos outros NPCs
//   objetivo  { tipo, ... } — ver OBJETIVOS em src/systems/missoes.js
//   resumo    a linha do diário, curta
//   oferta / lembrete / entrega   o que ele fala em cada momento
//   requer    { insignias, missao, flag } — trava até a condição bater
//   travado   o que ele fala enquanto `requer` não bate (opcional)
//   premio    { dinheiro, item, qtd }

import { MISSOES_DECAMARK } from "./decamark.js";

export const MISSOES = [
  {
    // A CHUVA DE MINIORS (ideia do CAIO, com o SOM QUE ELE EDITOU: o shiny do
    // LEGENDS ARCEUS cinco vezes, assets/sons/miniors-shiny.mp3). A ASTRÔNOMA da
    // CHAPADA DOS VEADEIROS te chama pra ver o céu; ao aceitar, 5 MINIORS SHINY
    // passam como meteoros (um em cada "plim") e caem espalhados pela chapada
    // (ESTATICOS em src/data/extra.js, `aparece: miniorsCairam`). Pegar os 5.
    id: "chuva-de-miniors",
    nome: "A CHUVA DE MINIORS",
    mapa: "chapada", x: 17, y: 36, sprite: "cientista",
    aoAceitar: "chuvaDeMiniors",
    // SÓ TRAZER, NÃO PEGAR (o CAIO): você leva cada um no colo, sem batalha
    // (`levar` em ESTATICOS). Ela fica com os 5 e você ESCOLHE UM pelo núcleo
    // pra ficar (`aoEntregar`) — esse vira seu Pokémon
    objetivo: { tipo: "bandeiras", flags: ["miniorShiny1", "miniorShiny2", "miniorShiny3", "miniorShiny4", "miniorShiny5"] },
    nucleos: ["VERMELHO", "LARANJA", "AMARELO", "VERDE", "AZUL"],
    aoEntregar: "entregarMiniors",
    resumo: "TRAZER OS 5 MINIORS SHINY QUE CAÍRAM NA CHAPADA PRA ASTRÔNOMA.",
    oferta: [
      "EU SOU ASTRÔNOMA. A CHAPADA TEM O CÉU MAIS LIMPO DE BRAGLITCH.",
      "ESTA NOITE VAI TER CHUVA DE METEOROS. SÓ QUE OS METEOROS DAQUI... BRILHAM DIFERENTE.",
      "FICA AQUI COMIGO E OLHA PRO CÉU. SE ALGUM CAIR, VOCÊ VAI ATRÁS?",
    ],
    lembrete: ["CINCO MINIORS CAÍRAM, UM EM CADA ANDAR DA CHAPADA. ELES BRILHAM: É SÓ PROCURAR O BRILHO! NÃO PRECISA LUTAR: ELES ESTÃO TONTOS. SÓ ME TRAZ OS CINCO."],
    entrega: [
      "OS CINCO?! VOCÊ TROUXE OS CINCO MINIORS SHINY, NO COLO!",
      "NENHUM ASTRÔNOMO DO MUNDO VIU ISSO. VOU ESTUDAR CADA NÚCLEO DESSES...",
      "MAS UM DELES É SEU. CADA UM TEM UM NÚCLEO DE UMA COR: ESCOLHE O SEU!",
    ],
    escolha: "QUAL MINIOR FICA COM VOCÊ?",
    escolheu: "O MINIOR DE NÚCLEO {COR} FICA COM VOCÊ! OS OUTROS QUATRO FICAM AQUI NA CHAPADA, OLHANDO O CÉU.",
    premio: { dinheiro: 5000, item: "pedra da lua", qtd: 5 },
  },
  {
    // AS CORES TRAVADAS (ideia do CAIO): enquanto esta missão não for entregue,
    // NENHUM bicho nasce shiny (DB.CONFIG.shinyMissao, src/systems/mon.js). O
    // único que escapou da trava é um PIKACHU SHINY parado na ROTA 2 (ESTATICOS,
    // src/data/extra.js) — e só aparece depois que ela te conta dele.
    id: "cores-travadas",
    nome: "AS CORES TRAVADAS",
    mapa: "viridian", x: 30, y: 21, sprite: "garota",
    requer: { flag: "starterChosen" },
    travado: ["VOCÊ NEM TEM POKÉMON AINDA? ENTÃO NÃO DÁ PRA TE PEDIR ISSO. VOLTA DEPOIS!"],
    objetivo: { tipo: "bandeira", flag: "pikachuShinyPego" },
    resumo: "CAPTURAR O PIKACHU SHINY DO LADO OESTE DA ROTA 2 E MOSTRAR À CAÇADORA DE CORES.",
    oferta: [
      "EU SOU CAÇADORA DE CORES. EU CAÇO SHINY. ...CAÇAVA.",
      "FAZ TEMPO QUE NENHUM POKÉMON NASCE COM A COR TROCADA. NEM UM. NEM NA GRAMA, NEM NO OVO.",
      "ACHO QUE O CARTUCHO TRAVOU A PALETA DE CORES. AÍ TUDO SAI COM A COR DE SEMPRE.",
      "MAS EU VI UM QUE ESCAPOU: UM PIKACHU SHINY, NO LADO OESTE DA ROTA 2!",
      "SE VOCÊ PEGAR ELE, A TRAVA SOLTA. AÍ AS CORES VOLTAM PRA TODO MUNDO!",
    ],
    lembrete: ["O PIKACHU SHINY! LADO OESTE DA ROTA 2, LÁ NO FUNDO, PERTO DA SAÍDA PRA VIRIDIAN. SE DERRUBAR SEM QUERER, SAI E VOLTA QUE ELE APARECE DE NOVO."],
    entrega: [
      "VOCÊ PEGOU?! DEIXA EU VER... É ELE! A COR TÁ ERRADA DO JEITO CERTO!",
      "OLHA... TÁ SENTINDO? A PALETA DESTRAVOU!",
      "A PARTIR DE AGORA, QUALQUER POKÉMON PODE NASCER SHINY DE NOVO. NA GRAMA, NA FENDA, NO OVO, EM TUDO!",
      "BOA CAÇADA, PARCEIRO. TOMA, PRA COMEÇAR.",
    ],
    premio: { dinheiro: 3000, item: "ultra ball", qtd: 10 },
  },
  {
    // UM BLACEPHALON CONTRA ARCEUS (ideia do CAIO; ARCEUS é o deus do mundo Pokémon): um youtuber viu os garfos do
    // Super Mario Odyssey fazendo o "six seven" com as mãos... e um BLACEPHALON
    // ALFA na ROTA 25 que NUNCA PARA de fazer. Ele só faz o pedaço do six seven
    // da animação (`soQuadros` no ESTATICOS, src/data/extra.js)
    id: "blacephalon-contra-arceus",
    nome: "UM BLACEPHALON CONTRA ARCEUS",
    mapa: "celadon_city", x: 33, y: 25, sprite: "roqueiro",
    objetivo: { tipo: "bandeira", flag: "blacephalonContraArceus" },
    resumo: "VENCER O BLACEPHALON ALFA QUE NÃO PARA DE FAZER SIX SEVEN, NA ROTA 25.",
    oferta: [
      "E AÍ! EU SOU YOUTUBER. MEU ÚLTIMO VÍDEO: OS GARFOS DO SUPER MARIO ODYSSEY FAZEM SIX SEVEN ENQUANTO FALAM!",
      "MAS AGORA APARECEU UMA COISA PIOR. NA ROTA 25 TEM UM BLACEPHALON ALFA...",
      "...QUE NÃO PARA. NUNCA. FICA SÓ FAZENDO SIX SEVEN COM AS MÃOS. É CONTRA ARCEUS.",
      "VAI LÁ E VENCE ELE! EU GRAVO TUDO PRO CANAL.",
    ],
    lembrete: ["ELE AINDA TÁ LÁ? FAZENDO SIX SEVEN? ROTA 25, PERTO DA CASA DO BILL. VAI!"],
    entrega: [
      "VOCÊ VENCEU O BLACEPHALON CONTRA ARCEUS?! ISSO VAI DAR UM MILHÃO DE VISUALIZAÇÕES!",
      "TOMA, É A SUA PARTE DO CANAL.",
    ],
    premio: { dinheiro: 6700, item: "doce raro", qtd: 6 },
  },
  {
    id: "isca",
    nome: "PESCADOR SEM ISCA",
    mapa: "route11", x: 36, y: 10, sprite: "pescador",
    objetivo: { tipo: "tem-especie", especie: "magikarp" },
    resumo: "MOSTRAR UM MAGIKARP AO PESCADOR DA ROTA 11.",
    oferta: [
      "TRINTA ANOS PESCANDO E EU NUNCA VI UM MAGIKARP DE PERTO.",
      "TODA VEZ QUE UM MORDE, ELE PULA E SOME ANTES DE EU PUXAR.",
      "ME TRAZ UM. SÓ PRA EU OLHAR. EU PAGO BEM.",
    ],
    lembrete: ["AINDA NÃO ACHOU UM? ELES ESTÃO EM QUALQUER ÁGUA. É ESSE O PROBLEMA."],
    entrega: [
      "É ESSE! É ESSE MESMO!",
      "...É MENOR DO QUE EU IMAGINEI. E MAIS MOLHADO.",
      "TOMA. VALEU A ESPERA.",
    ],
    premio: { dinheiro: 1200, item: "doce raro", qtd: 2 },
  },
  {
    id: "trio",
    nome: "O COLECIONADOR",
    mapa: "pallet", x: 12, y: 10, sprite: "velho",
    // A oferta dele conta uma cena — o Carvalho entregando as três bolas — que
    // no começo do jogo ainda não aconteceu. Sem isto ele contava o final antes
    // do começo, pra alguém que nem Pokémon tinha.
    requer: { flag: "starterChosen" },
    travado: [
      "O CARVALHO AINDA NÃO TE CHAMOU NO LABORATÓRIO?",
      "ENTÃO VOLTA AQUI DEPOIS. EU TENHO UMA COISA PRA TE PEDIR, MAS SÓ FAZ SENTIDO DEPOIS.",
    ],
    objetivo: {
      tipo: "tem-linhagens",
      linhagens: [
        ["bulbasaur", "ivysaur", "venusaur"],
        ["charmander", "charmeleon", "charizard"],
        ["squirtle", "wartortle", "blastoise"],
      ],
    },
    resumo: "TER OS TRÊS INICIAIS DE KANTO AO MESMO TEMPO.",
    oferta: [
      "EU VI O CARVALHO ENTREGAR AQUELAS TRÊS BOLAS. UMA PRA VOCÊ, UMA PRO OUTRO GAROTO...",
      "E A TERCEIRA FICOU NA MESA. ISSO ME INCOMODA DESDE ENTÃO.",
      "TRAGA OS TRÊS JUNTOS. SÓ QUERO VER OS TRÊS NO MESMO LUGAR UMA VEZ NA VIDA.",
    ],
    lembrete: ["OS TRÊS. JUNTOS. NA SUA EQUIPE OU NO SEU PC, TANTO FAZ."],
    entrega: [
      "OS TRÊS. VOCÊ CONSEGUIU.",
      "AGORA EU POSSO PARAR DE PENSAR NISSO.",
      "LEVA ISSO AQUI. EU GUARDEI A VIDA INTEIRA E NÃO USEI NENHUM.",
    ],
    premio: { dinheiro: 3000, item: "doce raro", qtd: 5 },
  },
  // (a missão DISTORÇÕES BIZARRAS saiu junto com as DISTORÇÕES ESPAÇO-TEMPO, a
  // pedido do CAIO em 03/nov/2026; quem já tinha ela no save só não vê mais)
  {
    id: "primeira-fusao",
    nome: "A DUPLA IMPOSSÍVEL",
    mapa: "cinnabar_island", x: 11, y: 10, sprite: "cientista",
    objetivo: { tipo: "tem-fusao" },
    resumo: "APARECER COM UMA FUSÃO PRONTA EM CINNABAR.",
    oferta: [
      "VOCÊ TEM UM DECODIFICADOR DE GENOMA? EU RECONHEÇO A CAIXA DAQUI.",
      "AQUI NA ILHA A GENTE RESSUSCITA FÓSSIL. JUNTAR DOIS VIVOS É OUTRA COISA.",
      "FUNDA DOIS E APAREÇA COM O RESULTADO. EU QUERO VER COM O MEU OLHO.",
    ],
    lembrete: ["ABRE A MOCHILA, LIGA A MÁQUINA E ESCOLHE DOIS. É SÓ ISSO."],
    entrega: [
      "...ESSE BICHO NÃO EXISTE. E ESTÁ AÍ.",
      "OS DOIS CONTINUAM INTEIROS LÁ DENTRO, NÉ? A MÁQUINA DEVOLVE?",
      "ENTÃO NÃO É EXPERIMENTO: É TRADUÇÃO. TOMA, VOCÊ MERECE.",
    ],
    premio: { dinheiro: 2500, item: "doce raro", qtd: 3 },
  },
  {
    id: "retrato",
    nome: "O RETRATISTA",
    mapa: "celadon_city", x: 29, y: 19, sprite: "maniaco",
    objetivo: { tipo: "tem-ficha-desenhada" },
    resumo: "DESENHAR UMA FUSÃO NA OFICINA E MOSTRAR PRA ELE.",
    oferta: [
      "EU PINTO POKÉMON HÁ ANOS. TODOS JÁ FORAM PINTADOS POR ALGUÉM.",
      "MENOS OS QUE NÃO EXISTEM AINDA.",
      "DESENHE UM NA SUA MÁQUINA. COM A SUA MÃO, NÃO COM O CÁLCULO DELA.",
    ],
    lembrete: ["A OFICINA DO DECODIFICADOR. DESENHA. SALVA A FICHA. VOLTA AQUI."],
    entrega: [
      "ISSO SAIU DA SUA MÃO. DÁ PRA VER — TEM ERRO NOS DOIS LADOS DO MESMO JEITO.",
      "ERRO IGUAL DOS DOIS LADOS É ASSINATURA. MÁQUINA NÃO ERRA ASSIM.",
      "GUARDA O DINHEIRO. E CONTINUA DESENHANDO.",
    ],
    premio: { dinheiro: 2000, item: "doce raro", qtd: 2 },
  },
  {
    id: "trofeu",
    nome: "O TROFÉU DE CINNABAR",
    mapa: "fuchsia_city", x: 24, y: 20, sprite: "gentleman",
    objetivo: { tipo: "recorde-concurso", nota: 20 },
    resumo: "TIRAR 20 DE 30 NO CONCURSO DE FUSÃO DE CINNABAR.",
    oferta: [
      "EU FINANCIO AQUELE CONCURSO DE CINNABAR HÁ SEIS ANOS.",
      "NUNCA VI NINGUÉM PASSAR DE VINTE PONTOS. NEM OS PRÓPRIOS CIENTISTAS.",
      "PASSE DE VINTE E EU PAGO O QUE PROMETI PUBLICAMENTE E NUNCA PRECISEI PAGAR.",
    ],
    lembrete: ["VINTE PONTOS. HARMONIA, POTÊNCIA E AUTORIA SOMADAS."],
    entrega: [
      "VINTE PONTOS. ESTÁ AQUI NA ATA, ASSINADO PELOS TRÊS.",
      "SEIS ANOS ESPERANDO PRA PERDER ESSA APOSTA. VALEU CADA ANO.",
    ],
    premio: { dinheiro: 8000 },
  },
  {
    id: "insetos",
    nome: "A COLEÇÃO DE INSETOS",
    mapa: "viridian_forest", x: 23, y: 34, sprite: "garoto",
    objetivo: { tipo: "capturou-tipo", tipoPokemon: "INSETO", quantos: 5 },
    resumo: "CAPTURAR 5 ESPÉCIES DIFERENTES DO TIPO INSETO.",
    oferta: [
      "EU MORO NESTA FLORESTA DESDE SEGUNDA. MEUS PAIS NÃO SABEM.",
      "ESTOU FAZENDO UM CATÁLOGO DE INSETO. SÓ QUE EU TENHO MEDO DE PEGAR ELES.",
      "PEGA CINCO ESPÉCIES DIFERENTES PRA MIM? EU ANOTO E VOCÊ FICA COM ELES.",
    ],
    lembrete: ["CINCO ESPÉCIES DIFERENTES. REPETIDO NÃO CONTA, EU CONFIRO."],
    entrega: [
      "CINCO! CINCO DIFERENTES!",
      "AGORA EU POSSO IR PRA CASA. MEUS PAIS DEVEM ESTAR PREOCUPADOS. É QUARTA.",
    ],
    premio: { dinheiro: 1500, item: "doce raro", qtd: 3 },
  },
  {
    id: "fantasma",
    nome: "QUEM ESTÁ NO CORREDOR",
    mapa: "lavender_town", x: 13, y: 10, sprite: "canalizadora",
    objetivo: { tipo: "capturou-tipo", tipoPokemon: "FANTASMA", quantos: 1 },
    resumo: "CAPTURAR UM POKÉMON DO TIPO FANTASMA.",
    oferta: [
      "TEM ALGUÉM ANDANDO NO MEU CORREDOR À NOITE. EU MORO SOZINHA.",
      "NÃO É GENTE. GENTE PISA.",
      "PEGA UM FANTASMA E TRAZ AQUI. EU QUERO SABER SE ELES SÃO ASSIM MESMO.",
    ],
    lembrete: ["UM FANTASMA. CAPTURADO, NÃO SÓ VISTO."],
    entrega: [
      "...ELE ESTÁ RINDO. NA POKÉ BOLA, ELE ESTÁ RINDO.",
      "É O MESMO RISO DO CORREDOR. OBRIGADA — AGORA EU SEI QUE NÃO ERA COMIGO.",
      "LEVA ISTO. ERA DO MEU MARIDO. ELE TAMBÉM OUVIA.",
    ],
    premio: { dinheiro: 2200, item: "poção", qtd: 5 },
  },
  {
    id: "fenda",
    nome: "O QUE NÃO ESTÁ NA POKÉDEX",
    mapa: "saffron_city", x: 32, y: 31, sprite: "tecnico",
    objetivo: { tipo: "capturou-fenda", quantos: 1 },
    resumo: "CAPTURAR UMA ESPÉCIE QUE NÃO É DE KANTO.",
    oferta: [
      "EU TRABALHO COM DADOS. CATALOGAR, NUMERAR, ARQUIVAR.",
      "SEMANA PASSADA CHEGOU UM REGISTRO DE UMA ESPÉCIE SEM NÚMERO. DE LUGAR NENHUM.",
      "SE VOCÊ CAPTURAR UMA DESSAS, TRAZ AQUI. EU PRECISO SABER SE O ERRO É MEU.",
    ],
    lembrete: ["UMA ESPÉCIE QUE NÃO ESTÁ NAS 151. VOCÊ SABE ONDE ELAS MORAM."],
    entrega: [
      "ELA EXISTE. ESTÁ NA SUA MÃO E NÃO TEM NÚMERO.",
      "ENTÃO O ERRO NÃO ERA MEU. O ERRO É A LISTA.",
      "OBRIGADO. VOU PRECISAR COMEÇAR UM ARQUIVO NOVO.",
    ],
    premio: { dinheiro: 4000, item: "doce raro", qtd: 3 },
  },

  // ----------------------------------------------------------- X, Y e Z
  // Três pedidos que TERMINAM em lendário: cada um conta onde procurar, e o
  // bicho só aparece no lugar depois que você aceitou. Sem o pedido, a clareira
  // é só clareira, a usina é só usina e o túnel é só túnel.
  {
    id: "x-marca-o-lugar",
    nome: "O X MARCA O LUGAR",
    mapa: "pewter_city", x: 24, y: 20, sprite: "cientista",
    requer: { insignias: 4 },
    objetivo: { tipo: "capturou-especie", especie: "xerneas" },
    libera: "xerneas",
    resumo: "ACHAR A CLAREIRA MARCADA NO MAPA, NO FUNDO DA FLORESTA VIRIDIAN.",
    oferta: [
      "TRABALHO NO MUSEU. CATALOGO MAPA VELHO — E ONTEM ACHEI UM QUE NÃO É MAPA.",
      "É UM DESENHO DA FLORESTA VIRIDIAN COM UM X NO MEIO E NENHUMA LEGENDA.",
      "MEDI TRÊS VEZES: O X CAI NUMA CLAREIRA QUE NÃO ESTÁ EM MAPA NENHUM DEPOIS DESSE.",
      "VÁ ATÉ O X. SE TIVER ALGUMA COISA LÁ, EU PRECISO QUE SEJA VOCÊ A VER.",
    ],
    lembrete: ["O X É NO FUNDO DA FLORESTA. ONDE O MATO FICA VERDE DEMAIS, EM CÍRCULO."],
    entrega: [
      "ENTÃO O X NÃO MARCAVA TESOURO. MARCAVA UM SER VIVO.",
      "QUEM DESENHOU AQUELE MAPA SABIA QUE ELE IA ESTAR LÁ — E O MAPA É DE 1802.",
      "GUARDE ISTO. E NÃO DEVOLVA O MAPA PRO ARQUIVO. EU VOU DIZER QUE PERDI.",
    ],
    premio: { dinheiro: 9000, item: "doce raro", qtd: 5 },
  },
  {
    id: "y-da-morte",
    nome: "O Y DA MORTE",
    mapa: "cerulean_city", x: 24, y: 20, sprite: "tecnico",
    requer: { insignias: 5 },
    objetivo: { tipo: "capturou-especie", especie: "yveltal" },
    libera: "yveltal",
    resumo: "ENTRAR NA USINA E ACHAR O QUE QUEIMOU A MARCA EM Y NA PAREDE.",
    oferta: [
      "EU ERA DA MANUTENÇÃO DA USINA. ESTAVA LÁ NO DIA EM QUE ELA MORREU.",
      "NÃO FOI CURTO, NÃO FOI RAIO, NÃO FOI FALTA DE ÁGUA. A ENERGIA SIMPLESMENTE SAIU.",
      "FICOU UMA MARCA QUEIMADA NA PAREDE DO GERADOR. UM Y, DO TAMANHO DA PAREDE.",
      "NINGUÉM MAIS ENTRA LÁ. VOCÊ ENTRA?",
    ],
    lembrete: ["A USINA. A MARCA EM Y FICA NO GERADOR GRANDE, NO MEIO."],
    entrega: [
      "...ENTÃO A MARCA NÃO ERA DE QUEIMADO. ERA A SOMBRA DELE, COM AS ASAS ABERTAS.",
      "TINHA DEZESSEIS PESSOAS TRABALHANDO NAQUELE TURNO. TODAS SAÍRAM ANDANDO.",
      "EU PENSEI NISSO TODO DIA POR ONZE ANOS. HOJE EU DURMO.",
    ],
    premio: { dinheiro: 9000, item: "doce raro", qtd: 5 },
  },
  {
    id: "z-do-dna",
    nome: "O Z DO DNA",
    mapa: "cinnabar_island", x: 10, y: 10, sprite: "tecnica",
    requer: { insignias: 6 },
    // ele foge duas vezes e só luta COMPLETO (src/data/extra.js, ZYGARDE_CACADA)
    objetivo: { tipo: "capturou-especie", especie: "zygardecompleto" },
    libera: "zygarde",
    resumo: "JUNTAR 200 CÉLULAS NO CUBO ZYGARDE E SEGUIR ELAS ATÉ O FUNDO DO TÚNEL ROCHA.",
    oferta: [
      "AQUI NO LABORATÓRIO A GENTE LÊ DNA O DIA INTEIRO. FITA DUPLA, DUAS VOLTAS, SEMPRE IGUAL.",
      "SEMANA PASSADA CHEGOU UMA AMOSTRA DO TÚNEL ROCHA QUE NÃO É FITA. É UM Z.",
      "E TEM MAIS: A AMOSTRA SE MEXE. UMA CÉLULA SOZINHA, SE MEXENDO, NUM POTE FECHADO.",
      "LEVA ESTE CUBO. NA LUTA CONTRA UMA CÉLULA, USA ELE (FICA NO BOLSO DAS BOLAS) E ELA ENTRA.",
      "JUNTA 200. COM 200 JUNTAS, ELAS VÃO QUERER VOLTAR PRA CASA. E A GENTE SEGUE.",
    ],
    // o CUBO vem na hora de aceitar (antes ele era o prêmio do fim)
    daAoAceitar: { item: "cubo zygarde", qtd: 1 },
    lembrete: ["AS CÉLULAS MORAM NA GRAMA DA ROTA 10 E NO TÚNEL ROCHA. USA O CUBO NELAS: SÃO 200.",
               "COM 200 NO CUBO, VAI PRO ANDAR DE BAIXO DO TÚNEL ROCHA E SEGUE OS PONTINHOS VERDES."],
    entrega: [
      "MILHARES DELAS. E JUNTAS VIRAM UM BICHO SÓ, COM VONTADE PRÓPRIA.",
      "ENTÃO NÃO É UM POKÉMON FEITO DE CÉLULAS. É UM MONTE DE CÉLULAS QUE DECIDIU SER UM POKÉMON.",
      "VOU PRECISAR DE UM POTE MAIOR. E DE OUTRA PROFISSÃO, TALVEZ.",
    ],
    premio: { dinheiro: 12000, item: "doce raro", qtd: 3 },
  },

  {
    // A última: ele não está em Kanto, e nem no mapa. A missão é o que faz o
    // vazio da fenda virar chão embaixo dos pés dele.
    id: "pokemon-divino",
    nome: "O POKÉMON DIVINO",
    mapa: "pallet", x: 13, y: 10, sprite: "prof",
    requer: { insignias: 8 },
    objetivo: { tipo: "capturou-especie", especie: "arceus" },
    libera: "arceus",
    resumo: "ACHAR O QUE ESTAVA NA FENDA ANTES DA FENDA.",
    oferta: [
      "EU NÃO DEVIA ESTAR CONTANDO ISTO, E O PROFESSOR NÃO SABE QUE EU ANOTEI.",
      "TODA VEZ QUE ALGUÉM ATRAVESSA A FENDA, A MÁQUINA GRAVA O QUE TEM DO OUTRO LADO.",
      "TEM UMA LEITURA QUE APARECE EM TODAS AS VISITAS, DESDE A PRIMEIRA. NO MESMO PONTO. PARADA.",
      "NÃO É BICHO DA FENDA: OS DA FENDA ENTRARAM DEPOIS. ESSE JÁ ESTAVA.",
      "VÁ ATÉ O MEIO DO VAZIO, ONDE NÃO TEM CHÃO. E OLHE PRA BAIXO ANTES DE PISAR.",
    ],
    lembrete: ["NO MEIO DA FENDA, ONDE O CHÃO ACABA. ELE NÃO SE MEXE — VOCÊ É QUE CHEGA."],
    entrega: [
      "ENTÃO ELE DEIXOU. ELE PODIA NÃO TER DEIXADO.",
      "MIL PLACAS GIRANDO, UMA PRA CADA TIPO QUE EXISTE E ALGUMAS PRA TIPO QUE NÃO EXISTE.",
      "EU PASSEI A VIDA CATALOGANDO O QUE CABE NA POKÉDEX. ESSE NÃO CABE, E ESTÁ AÍ.",
      "GUARDE ISTO. E NÃO CONTE PRO PROFESSOR QUE FUI EU.",
    ],
    premio: { dinheiro: 20000, item: "doce raro", qtd: 10 },
  },

  // ------------------------------------------------- o tempo e o espaço
  // Se o ARCEUS está no jogo (e está: no vazio da fenda, na missão de cima), os
  // dois que ele fez pra segurar o TEMPO e o ESPAÇO têm que estar também. Eles
  // não vieram pela fenda como o resto: eles já estavam segurando as duas
  // coisas que este cartucho quebrou primeiro — a hora e o lugar.
  //
  // O PALKIA vem DEPOIS do DIALGA de propósito. Ninguém procura por uma dobra
  // no espaço antes de aceitar que o tempo de um lugar parou: a segunda missão
  // é a primeira lida de novo, por outra pessoa, de outro jeito.
  {
    id: "o-tempo-parado",
    nome: "O TEMPO PARADO",
    mapa: "lavender_town", x: 16, y: 8, sprite: "velha",
    requer: { insignias: 7 },
    objetivo: { tipo: "capturou-especie", especie: "dialga" },
    libera: "dialga",
    resumo: "SUBIR ATÉ O ÚLTIMO ANDAR DA TORRE POKÉMON.",
    oferta: [
      "EU ACENDO AS VELAS DESSA TORRE DESDE QUE O MEU MARIDO SUBIU PRA LÁ.",
      "TRINTA E DOIS ANOS. EU SEI PORQUE EU CONTO — TODO DIA EU RISCO O CALENDÁRIO.",
      "SÓ QUE AS VELAS DO ÚLTIMO ANDAR NÃO DERRETEM. AS MESMAS VELAS, MOÇO. AS MESMAS.",
      "E TEM UM ZUMBIDO LÁ EM CIMA QUE NÃO É VENTO. É UMA BATIDA, DEVAGAR, SEMPRE IGUAL.",
      "EU JÁ ESTOU VELHA DEMAIS PRA SUBIR SETE ANDARES. VÁ VOCÊ, E ME DIGA QUE HORAS SÃO LÁ.",
    ],
    lembrete: ["O ÚLTIMO ANDAR DA TORRE. ONDE AS VELAS NÃO DERRETEM."],
    entrega: [
      "ENTÃO ERA ELE QUE ESTAVA CONTANDO. O TEMPO TODO, LÁ EM CIMA, SOZINHO.",
      "TRINTA E DOIS ANOS PRA MIM. E PRA ELE, QUANTO?",
      "ACHO QUE EU VOU PARAR DE RISCAR O CALENDÁRIO. NÃO ERA EU QUEM SEGURAVA A CONTA.",
    ],
    premio: { dinheiro: 15000, item: "doce raro", qtd: 8 },
  },
  {
    id: "o-espaco-dobrado",
    nome: "O ESPAÇO DOBRADO",
    mapa: "five_island", x: 13, y: 8, sprite: "cientista",
    // ele só faz a pergunta depois que o DIALGA foi achado: é a notícia da
    // torre que faz a conta da caverna parar de fechar na cabeça dele
    requer: { insignias: 7, missao: "o-tempo-parado" },
    travado: [
      "EU MEDI A CAVERNA PERDIDA CATORZE VEZES E DEU CERTO CATORZE VEZES.",
      "ENTÃO O PROBLEMA SOU EU, E EU NÃO TENHO O QUE TE PEDIR. AINDA.",
    ],
    objetivo: { tipo: "capturou-especie", especie: "palkia" },
    libera: "palkia",
    resumo: "MEDIR A CAVERNA PERDIDA ATÉ A CONTA NÃO FECHAR.",
    oferta: [
      "SOUBE DA TORRE DE LAVENDER. UM BICHO SEGURANDO A HORA DE UM LUGAR INTEIRO.",
      "SE DÁ PRA FAZER ISSO COM A HORA, ENTÃO EU ESTAVA MEDINDO A COISA ERRADA AQUI.",
      "A CAVERNA PERDIDA TEM CATORZE SALAS DE ONZE POR ONZE. EU MEDI TODAS. FECHA.",
      "MAS A ILHA NÃO COMPORTA CATORZE SALAS. EU MEDI A ILHA TAMBÉM. NÃO FECHA.",
      "AS DUAS CONTAS ESTÃO CERTAS, MOÇO. UMA DELAS ESTÁ CERTA NUM LUGAR QUE NÃO É ESTE.",
      "VÁ ATÉ O FUNDO. NA SALA QUE NÃO TEM PRA ONDE IR.",
    ],
    lembrete: ["O FUNDO DA CAVERNA PERDIDA. A SALA SEM SAÍDA — SE ELA AINDA FOR SEM SAÍDA."],
    entrega: [
      "ATRÁS DAS PÉROLAS TINHA MAIS CAVERNA. FOI ISSO QUE VOCÊ DISSE.",
      "ENTÃO AS DUAS CONTAS ESTAVAM CERTAS. A CAVERNA CABE — SÓ QUE NÃO É AQUI QUE ELA CABE.",
      "EU VOU PRECISAR DE UMA TRENA MAIOR. E DE UM LUGAR MAIOR PRA ESTICAR ELA.",
    ],
    premio: { dinheiro: 15000, item: "doce raro", qtd: 8 },
  },

  // ------------------------------------------------------- as três da tempestade
  // Um marinheiro em VERMILION leva você de barco até a tempestade que não
  // acaba, no mar perto de BIRTH ISLAND. Cada uma das três só aparece depois
  // que a anterior sai de lá — e a última é justamente a que acalma as outras
  // duas. O mapa da tempestade é gerado em código (src/data/index.js).
  {
    id: "tempestade",
    nome: "A TEMPESTADE SEM FIM",
    mapa: "vermilion_city", x: 24, y: 20, sprite: "marinheiro",
    requer: { insignias: 3 },
    objetivo: { tipo: "capturou-especie", especie: "tornadus" },
    resumo: "IR COM O MARINHEIRO ATÉ A TEMPESTADE E CAPTURAR O QUE FAZ O VENTO.",
    viagem: {
      mapa: "tempestade", x: 10, y: 10, dir: "up",
      pergunta: "LEVANTAR ÂNCORA?",
      opcoes: ["VAMOS", "AGORA NÃO"],
      indo: [
        "SEGURA ONDE DER. ISSO AQUI SACODE.",
        "...",
        "CHEGAMOS. NÃO SOLTA A MÃO DO CORRIMÃO.",
      ],
      voltando: ["VAMOS EMBORA ANTES QUE ELA MUDE DE IDEIA."],
    },
    oferta: [
      "TEM UMA TEMPESTADE NO MAR AQUI PERTO QUE NÃO ACABA. NUNCA.",
      "NEM DE DIA, NEM NO VERÃO, NEM QUANDO O RESTO DO MAR ESTÁ LISO.",
      "MEU PAI DIZIA QUE TEM UMA COISA LÁ DENTRO SEGURANDO ELA.",
      "EU TENHO BARCO E NÃO TENHO CORAGEM SOZINHO. VOCÊ TEM POKÉMON. VAMOS OS DOIS?",
    ],
    lembrete: ["O BARCO ESTÁ PRONTO QUANDO VOCÊ ESTIVER."],
    entrega: [
      "ENTÃO ERA VENTO. VENTO COM CARA.",
      "O MAR ALI FORA ABAIXOU DOIS PALMOS QUANDO VOCÊ PEGOU ELE. EU MEDI.",
      "MEU PAI TINHA RAZÃO A VIDA INTEIRA E MORREU ACHANDO QUE ERA LOUCO.",
    ],
    premio: { dinheiro: 6000, item: "doce raro", qtd: 5 },
  },
  {
    id: "tempestade-raio",
    nome: "O RAIO QUE FICOU",
    mapa: "vermilion_city", x: 24, y: 20, sprite: "marinheiro",
    requer: { missao: "tempestade" },
    objetivo: { tipo: "capturou-especie", especie: "thundurus" },
    resumo: "VOLTAR À TEMPESTADE: COM O VENTO FORA, SOBROU O RAIO.",
    viagem: {
      mapa: "tempestade", x: 10, y: 10, dir: "up",
      pergunta: "VOLTAR PRA LÁ?",
      opcoes: ["VAMOS", "AGORA NÃO"],
      indo: ["DESSA VEZ EU SEI O CAMINHO. NÃO ME SINTO MELHOR POR ISSO."],
      voltando: ["PRA CASA."],
    },
    oferta: [
      "A TEMPESTADE NÃO ACABOU. VOCÊ TIROU O VENTO E ELA CONTINUA LÁ.",
      "SÓ QUE AGORA ELA É SÓ RAIO. CAI UM POR SEGUNDO, SEMPRE NO MESMO PONTO.",
      "TEM OUTRA COISA LÁ. VAMOS BUSCAR.",
    ],
    lembrete: ["ELE CAI SEMPRE NO MESMO PONTO DO RECIFE. É SÓ ESPERAR EM CIMA."],
    entrega: [
      "AGORA SIM O CÉU ESTÁ CALADO.",
      "...E TÁ ESQUISITO. TEMPESTADE QUE NÃO ACABA VIRAR SILÊNCIO É ESQUISITO.",
    ],
    premio: { dinheiro: 7000, item: "doce raro", qtd: 5 },
  },
  {
    id: "tempestade-chao",
    nome: "O CHÃO QUE RESPONDE",
    mapa: "vermilion_city", x: 24, y: 20, sprite: "marinheiro",
    requer: { missao: "tempestade-raio" },
    objetivo: { tipo: "capturou-especie", especie: "landorus" },
    resumo: "SEM VENTO E SEM RAIO, ALGO SUBIU DO FUNDO NO LUGAR DELES.",
    viagem: {
      mapa: "tempestade", x: 10, y: 10, dir: "up",
      pergunta: "A ÚLTIMA VIAGEM?",
      opcoes: ["VAMOS", "AGORA NÃO"],
      indo: ["O MAR ESTÁ LISO COMO PRATO. ISSO ME ASSUSTA MAIS QUE A TEMPESTADE."],
      voltando: ["ACABOU. ACABOU MESMO."],
    },
    oferta: [
      "O RECIFE CRESCEU. EU JURO QUE CRESCEU.",
      "ONDE ERA ÁGUA AGORA TEM PEDRA, E A PEDRA ESTÁ QUENTE.",
      "MINHA AVÓ DIZIA: TIRA O VENTO E O RAIO DE UM LUGAR E O CHÃO VEM VER O QUE HOUVE.",
    ],
    lembrete: ["ELE ESTÁ NO MEIO DO RECIFE. E ELE SABE QUE VOCÊ VEM."],
    entrega: [
      "OS TRÊS. VOCÊ TIROU OS TRÊS DE LÁ.",
      "O MAR AQUI FORA VAI SER SÓ MAR DE NOVO. MEU PAI IA ODIAR ISSO.",
      "TOMA. É O QUE EU TENHO, E EU NÃO VOU PRECISAR DE BARCO GRANDE PRA MAR CALMO.",
    ],
    premio: { dinheiro: 12000, item: "doce raro", qtd: 8 },
  },

  // ------------------------------------------------- o registro 0x3F
  // A história principal do ??????????: quatro capítulos com a pesquisadora
  // de Cinnabar, escritos em src/data/decamark.js junto com o resto dele.
  ...MISSOES_DECAMARK,
  {
    // BRAGLITCH: a arqueóloga das letras, em CARUARU. O SPINDA dela nasceu com
    // as manchas no formato dos 28 UNOWN, de A a Z, ! e ? (src/data/spinda-unown.js)
    // e ela quer saber se é coisa da região — então pede pra ver um Spinda daqui.
    id: "spinda-unown",
    nome: "O SPINDA ALFABETO",
    mapa: "caruaru", x: 16, y: 13, sprite: "cientista",
    requer: { flag: "starterChosen" },
    objetivo: { tipo: "capturou-especie", especie: "spinda" },
    resumo: "CAPTURAR UM SPINDA (BR-324) E MOSTRAR À ARQUEÓLOGA DE CARUARU.",
    oferta: [
      "EU ESTUDO OS UNOWN. LETRAS VIVAS, ESCRITAS EM PAREDE DE RUÍNA.",
      "SÓ QUE O MEU SPINDA NASCEU COM AS MANCHAS EM FORMA DE UNOWN. TODAS: DE A ATÉ Z, E O ! E O ? DE BRINDE.",
      "MANCHA DE SPINDA É SORTEIO. NUNCA SAI LETRA. EU PRECISO VER UM SPINDA DAQUI PRA COMPARAR.",
      "ELES CAMBALEIAM NO MATO DA BR-324. ME TRAZ UM?",
    ],
    lembrete: ["O SPINDA. DA BR-324. ELE ANDA COMO QUEM SAIU DO FORRÓ ÀS QUATRO DA MANHÃ."],
    entrega: [
      "DEIXA EU VER... MANCHA COMUM. SORTEADA. NENHUMA LETRA.",
      "ENTÃO O MEU NÃO É COISA DA REGIÃO. É ELE QUE É ÚNICO.",
      "E SABE O QUE EU DESCOBRI? QUEM ESTUDA LETRA NÃO PRECISA TER A LETRA. PRECISA LER.",
      "FICA COM ELE. ELE GOSTOU DE VOCÊ. E ASSIM O ALFABETO DELE VAI VER O MUNDO.",
    ],
    premio: { dinheiro: 2000, pokemon: { especie: "spinda", lvl: 30, spinda: "unown" } },
  },
];

/** O que o diário e os NPCs falam. */
export const MISSAO_TEXTO = {
  titulo: "MISSÕES",
  vazio: "NINGUÉM TE PEDIU NADA AINDA.",
  aceitar: "ACEITAR ESSE PEDIDO?",
  opcoes: ["ACEITAR", "AGORA NÃO"],
  aceitou: "PEDIDO ANOTADO NO SEU DIÁRIO. (MENU X)",
  recusou: "TUDO BEM. EU FICO POR AQUI MESMO.",
  ganhou: "VOCÊ RECEBEU ${DINHEIRO}!",
  ganhouItem: "E MAIS {QTD} {ITEM}!",
  ganhouPokemon: "E GANHOU {MON}! (SE A EQUIPE ESTIVER CHEIA, ELE VAI PRO PC)",
  feita: "MISSÃO CUMPRIDA: {NOME}!",
  jaFeita: "OBRIGADO DE NOVO. SÉRIO.",
  ajuda: "X VOLTA",
  travada: "AINDA NÃO. VOLTA AQUI QUANDO TIVER MAIS ESTRADA NAS COSTAS.",
  estados: { ativa: "EM ANDAMENTO", pronta: "PRONTA — VOLTE LÁ", feita: "ENTREGUE" },
};
