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

export const MISSOES = [
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
    objetivo: { tipo: "capturou-especie", especie: "zygarde" },
    libera: "zygarde",
    resumo: "SEGUIR AS CÉLULAS ATÉ O FUNDO DO TÚNEL ROCHA.",
    oferta: [
      "AQUI NO LABORATÓRIO A GENTE LÊ DNA O DIA INTEIRO. FITA DUPLA, DUAS VOLTAS, SEMPRE IGUAL.",
      "SEMANA PASSADA CHEGOU UMA AMOSTRA DO TÚNEL ROCHA QUE NÃO É FITA. É UM Z.",
      "E TEM MAIS: A AMOSTRA SE MEXE. UMA CÉLULA SOZINHA, SE MEXENDO, NUM POTE FECHADO.",
      "ELAS ESTÃO INDO PRA ALGUM LUGAR LÁ EMBAIXO. EU QUERO SABER PARA ONDE.",
    ],
    lembrete: ["TÚNEL ROCHA, O ANDAR DE BAIXO. SIGA OS PONTINHOS VERDES."],
    entrega: [
      "MILHARES DELAS. E JUNTAS VIRAM UM BICHO SÓ, COM VONTADE PRÓPRIA.",
      "ENTÃO NÃO É UM POKÉMON FEITO DE CÉLULAS. É UM MONTE DE CÉLULAS QUE DECIDIU SER UM POKÉMON.",
      "VOU PRECISAR DE UM POTE MAIOR. E DE OUTRA PROFISSÃO, TALVEZ.",
    ],
    premio: { dinheiro: 12000, item: "doce raro", qtd: 6 },
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
  feita: "MISSÃO CUMPRIDA: {NOME}!",
  jaFeita: "OBRIGADO DE NOVO. SÉRIO.",
  ajuda: "X VOLTA",
  travada: "AINDA NÃO. VOLTA AQUI QUANDO TIVER MAIS ESTRADA NAS COSTAS.",
  estados: { ativa: "EM ANDAMENTO", pronta: "PRONTA — VOLTE LÁ", feita: "ENTREGUE" },
};
