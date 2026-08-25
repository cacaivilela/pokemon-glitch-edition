// Conteúdo dos mapas de Kanto.
// A GEOMETRIA (desenho, colisão, grama alta, barrancos, portas e conexões) vem
// dos mapas originais do FireRed, importados por tools/fetch_maps.py para
// assets/maps/*.png + assets/maps/kanto.json. Aqui ficam só as coisas do jogo:
// nome, música, NPCs, diálogos, placas, encontros e pontos de entrada.
//
// As coordenadas dos NPCs são as mesmas do jogo original (x,y em tiles).
import { CONCURSO } from "./concurso.js";
import { MISSOES } from "./missoes.js";

/** O palco do CONCURSO DE FUSÃO, na praça do sul de Cinnabar: a anfitriã na
 *  beira e os três jurados de frente pra plateia. Os nomes e as falas de
 *  julgamento estão em src/data/concurso.js — aqui é só quem fica onde. */
const PALCO_CINNABAR = [
  {
    id: "concurso", x: 10, y: 13, dir: "right",
    sprite: CONCURSO.anfitria.sprite, concurso: true,
    lines: CONCURSO.anfitria.convite,
  },
  // A fileira do júri fica na ÚLTIMA linha da praça (y=14), de frente pro
  // palco. Nada de y=12: ali passa quem vai pra porta do Centro Pokémon,
  // que é o warp (14,11) — a DRA. CÚPULA estava tapando a entrada.
  ...CONCURSO.jurados.map((j, i) => ({
    id: `jurado_${j.id}`, x: 12 + i * 2, y: 14, dir: "up", sprite: j.sprite,
    lines: [
      `${j.nome}. EU JULGO A ${j.titulo}.`,
      ...(j.fala.alto || []).slice(0, 1),
    ],
  })),
];

export const MAPS = {
  home: {
    name: "SUA CASA", music: "casa", interior: true,
    spawn: { x: 5, y: 7, dir: "down" },
    signs: { "6,1": "A TV ESTÁ PASSANDO UM DOCUMENTÁRIO SOBRE TREINADORES." },
    lockedWarps: { "10,2": "A ESCADA SOBE PRO SEU QUARTO. VOCÊ ACABOU DE DESCER DE LÁ." },
    encounters: [],
    npcs: [{
      id: "mae", x: 8, y: 4, dir: "down", sprite: "mae", heal: true,
      lines: ["OI, QUERIDO! O PROF. CARVALHO ESTAVA TE PROCURANDO.", "O LABORATÓRIO DELE FICA NO SUL DA VILA."],
      afterLines: ["TODO TREINADOR SAI DE CASA UM DIA. DESCANSE ANTES DE IR!"],
      // ela cura a equipe; sem equipe, ela não finge que curou alguma coisa
      semMon: ["VOCÊ NEM TEM UM POKÉMON AINDA, QUERIDO!", "VAI LÁ FALAR COM O PROF. CARVALHO. EU FICO AQUI."],
    }],
  },

  pallet: {
    name: "VILA PALETA", music: "pallet",
    spawn: { x: 6, y: 8, dir: "down" },
    // O canteiro de flores (4x2 tiles, entre a cerca e a placa). Enquanto o
    // mundo está inteiro é só desenho; depois que MISSINGNO. atravessa
    // (flags.glitchWorld) é aqui que ele encosta — o dado dele não tem onde
    // existir e a flor é o pedaço de tela mais velho do cartucho.
    flores: ["5,12", "6,12", "7,12", "8,12", "5,13", "6,13", "7,13", "8,13"],
    floresChance: 0.3,       // por passo dado em cima delas, com o mundo bugado
    signs: {
      "4,7": "CASA DO VERMELHO.",
      "13,7": "CASA DO AZUL.",
      "9,11": "CUIDADO: A GRAMA ALTA COMEÇA AO NORTE.",
      "5,14": "VILA PALETA — UM TOM DE FOLHA NOVA.\nO CANTEIRO AO LADO TEM AS MESMAS FLORES DESDE QUE O JOGO EXISTE.",
      "16,16": "LABORATÓRIO DE POKÉMON DO PROF. CARVALHO.",
    },
    encounters: [],
    npcs: [
      // A MISSINGNITA está enfiada no meio do canteiro — nenhuma megapedra caiu
      // aqui, essa nasceu junto com as flores. Item escondido: não tem sprite,
      // só acha quem encostar em 6,13 e apertar Z.
      {
        id: "pedra_missingno", x: 6, y: 13, sprite: "ball", invisivel: true, glitch: true,
        achado: [
          "AS FLORES DAQUI SÃO TODAS IGUAIS. MENOS UMA.",
          "VOCÊ AFASTA AS PÉTALAS: TEM UMA PEDRA ENFIADA NA TERRA, PISCANDO DEVAGAR.",
          "VOCÊ PEGOU A MISSINGNITA!",
        ],
        gift: { item: "missingnita", qty: 1 },
      },
      {
        id: "menina", x: 3, y: 10, dir: "down", sprite: "garota", wander: true,
        lines: ["TECNOLOGIA É INCRÍVEL!", "O PROF. CARVALHO GUARDA UM POKÉMON INTEIRO DENTRO DE UMA BOLA."],
      },
      {
        id: "velho", x: 13, y: 17, dir: "up", sprite: "gentleman",
        lines: ["NÃO SAIA DA VILA SEM UM POKÉMON!", "A GRAMA ALTA DA ROTA 1 É PERIGOSA PRA QUEM ANDA SOZINHO."],
      },
    ],
  },

  // Floresta Viridian: a geometria e as posições dos NPCs vêm do FireRed
  // (assets/maps/kanto.json). Aqui os caçadores viram treinadores de verdade —
  // eles te chamam quando você passa na frente deles, e dá pra recusar.
  viridian_forest: {
    name: "FLORESTA VIRIDIAN", music: "viridian",
    pedras: ["39,15"],
    blocos: ["41,15"],
    signs: {
      "39,59": "FLORESTA VIRIDIAN — CUIDADO: DÁ PRA SE PERDER AQUI DENTRO.",
      "28,44": "OS INSETOS DAQUI EVOLUEM RÁPIDO. NÃO SUBESTIME UM CATERPIE.",
      "9,29": "SAÍDA NORTE: CIDADE PEWTER E O GINÁSIO DE PEDRA.",
      "43,26": "SE UM TREINADOR TE VER, ELE VAI QUERER BATALHAR.",
    },
    npcs: [
      // BEEDRILLITA: no fundo da floresta, no corredor de grama da direita
      { id: "pedra_beedrillita", x: 50, y: 17, sprite: "ball", gift: { item: "beedrillita", qty: 1 } },
      {
        id: "n9", x: 16, y: 5, dir: "down", sprite: "cacador",
        lines: ["EI! VOCÊ AÍ DO CHAPÉU!", "EU CAÇO INSETO DESDE PEQUENO. QUER VER?"],
        afterLines: ["MEUS INSETOS AINDA VÃO CRESCER. VOCÊ VAI VER."],
        trainer: { name: "CAÇADOR RICARDO", prize: 220,
                   party: [{ id: "caterpie", lvl: 6 }, { id: "weedle", lvl: 6 }] },
      },
      {
        id: "n8", x: 43, y: 6, dir: "down", sprite: "cacador",
        lines: ["ESSA REDE AQUI NUNCA FALHA.", "MAS PEGAR É FÁCIL. DIFÍCIL É LUTAR."],
        afterLines: ["ACHO QUE VOU TREINAR MAIS ANTES DE SAIR DA FLORESTA."],
        trainer: { name: "CAÇADOR SANDRO", prize: 260,
                   party: [{ id: "weedle", lvl: 7 }, { id: "kakuna", lvl: 7 }] },
      },
      {
        id: "n4", x: 7, y: 22, dir: "down", sprite: "cacador",
        lines: ["DORMI AQUI ESSA NOITE PRA PEGAR OS INSETOS DE MANHÃ.", "VALEU A PENA. OLHA SÓ ESSE CASULO!"],
        afterLines: ["TÁ BEM, TÁ BEM. VOCÊ É MELHOR QUE EU."],
        trainer: { name: "CAÇADOR DÉCIO", prize: 240,
                   party: [{ id: "caterpie", lvl: 5 }, { id: "metapod", lvl: 7 }] },
      },
      {
        id: "n3", x: 47, y: 29, dir: "down", sprite: "cacador",
        lines: ["TRÊS DE UMA VEZ! PEGUEI TODOS HOJE.", "AGORA ME DEIXA TESTAR ELES EM VOCÊ."],
        afterLines: ["TRÊS NÃO FOI SUFICIENTE, NÉ?"],
        trainer: { name: "CAÇADOR ANTÔNIO", prize: 280,
                   party: [{ id: "weedle", lvl: 5 }, { id: "caterpie", lvl: 5 }, { id: "weedle", lvl: 6 }] },
      },
      {
        id: "n2", x: 47, y: 45, dir: "down", sprite: "cacador",
        lines: ["NINGUÉM PASSA DAQUI SEM ENCARAR MEUS CASULOS.", "ELES SÓ ENDURECEM. E AGUENTAM."],
        afterLines: ["ENDURECER NÃO GANHA BATALHA SOZINHO. ANOTADO."],
        trainer: { name: "CAÇADOR LUÍS", prize: 320,
                   party: [{ id: "metapod", lvl: 8 }, { id: "kakuna", lvl: 8 }] },
      },
      {
        id: "n1", x: 45, y: 58, dir: "down", sprite: "garoto",
        lines: ["ENTREI AQUI ATRÁS DE UM PIKACHU E ACHEI SÓ MATO.", "JÁ QUE VOCÊ ESTÁ AQUI, BORA BATALHAR?"],
        afterLines: ["UM DIA EU ACHO O PIKACHU. E TE VENÇO."],
        trainer: { name: "JOVEM MARCOS", prize: 200,
                   party: [{ id: "rattata", lvl: 6 }, { id: "pidgey", lvl: 6 }] },
      },
      {
        id: "n0", x: 29, y: 58, dir: "down", sprite: "garoto",
        lines: ["TREINADOR NENHUM É OBRIGADO A ACEITAR BATALHA.",
                "SE NÃO ESTIVER PRONTO, DIGA QUE NÃO E VOLTE DEPOIS. ELES ESPERAM."],
        afterLines: ["A SAÍDA NORTE LEVA PRA PEWTER. O GINÁSIO É LOGO ALI."],
      },
    ],
  },

  route1: {
    name: "ROTA 1", music: "route",
    pedras: ["7,8"],              // a primeira pedra rachada do jogo
    spawn: { x: 9, y: 38, dir: "up" },
    signs: { "9,31": "ROTA 1 — VILA PALETA ↔ CIDADE VIRIDIAN." },
    encounters: [
      { id: "pidgey", min: 2, max: 5, w: 45 },
      { id: "rattata", min: 2, max: 5, w: 45 },
      { id: "spearow", min: 3, max: 5, w: 10 },
    ],
    npcs: [
      {
        id: "tiago", x: 19, y: 16, dir: "down", sprite: "garoto",
        lines: ["EI! VOCÊ TAMBÉM ESTÁ INDO PRA VIRIDIAN?", "ANTES DISSO: ME MOSTRA O QUE SEU POKÉMON SABE FAZER!"],
        afterLines: ["VOCÊ É FORTE. VOU TREINAR MAIS UM POUCO AQUI."],
        trainer: { name: "JOVEM TIAGO", party: [{ id: "pidgey", lvl: 5 }], prize: 240 },
      },
      {
        id: "andarilho", x: 6, y: 28, dir: "down", sprite: "balconista",
        lines: ["ENFRAQUEÇA O POKÉMON SELVAGEM ANTES DE JOGAR A BOLA.", "QUANTO MENOS HP ELE TIVER, MAIOR A CHANCE DE CAPTURA."],
      },
    ],
  },

  viridian: {
    name: "CIDADE VIRIDIAN", music: "viridian",
    spawn: { x: 26, y: 27, dir: "up" },
    signs: {
      "23,1": "AO NORTE: ROTA 2 E A FLORESTA DE VIRIDIAN.",
      "32,10": "GINÁSIO POKÉMON DE VIRIDIAN — LÍDER: GIOVANNI.",
      "36,10": "GINÁSIO DE VIRIDIAN. O ÚLTIMO DESAFIO DE KANTO.",
      "20,16": "CIDADE VIRIDIAN — A CIDADE PINTADA DE VERDE ETERNO.",
      "20,31": "CENTRO POKÉMON: CURA GRÁTIS. LOJA POKÉMON: TRAGA DINHEIRO.",
    },
    lockedWarps: {
      "25,18": "A ESCOLA DE TREINADORES ESTÁ FECHADA HOJE.",
      "25,11": "A PORTA ESTÁ TRANCADA.",
    },
    encounters: [
      { id: "rattata", min: 2, max: 4, w: 30 },
      { id: "pidgey", min: 2, max: 4, w: 30 },
      { id: "nidoranm", min: 3, max: 5, w: 15 },
      { id: "nidoranf", min: 3, max: 5, w: 15 },
      { id: "caterpie", min: 3, max: 4, w: 5 },
      { id: "weedle", min: 3, max: 4, w: 5 },
    ],
    npcs: [
      {
        id: "velha_aurora", x: 20, y: 8, dir: "down", sprite: "velha",
        lines: [],          // STORY.aurora.velha — a entrega é tratada na cena
        aurora: true,
      },
      {
        id: "velhote", x: 34, y: 11, dir: "down", sprite: "velho",
        lines: ["EU AINDA NÃO TOMEI MEU CAFÉ, MAS TUDO BEM.", "TOMA, LEVA ISSO AQUI. EU JÁ TENHO DEMAIS."],
        gift: { item: "poção", qty: 2 },
        afterLines: ["AGORA DEIXA EU TERMINAR MEU CAFÉ EM PAZ."],
      },
      {
        id: "moca", x: 20, y: 12, dir: "down", sprite: "velha",
        lines: ["A LOJA VENDE POKÉ BOLAS.", "SEM ELAS VOCÊ SÓ CONSEGUE DERROTAR OS SELVAGENS, NUNCA CAPTURAR."],
      },
      {
        id: "menino", x: 16, y: 22, dir: "right", sprite: "menino",
        lines: ["O GINÁSIO DAQUI VIVE FECHADO.", "DIZEM QUE O LÍDER É O CARA MAIS FORTE DE KANTO."],
      },
      {
        id: "jovem", x: 33, y: 26, dir: "left", sprite: "garoto",
        lines: ["O CENTRO POKÉMON CURA TUDO DE GRAÇA.", "NUNCA ENTENDI COMO ELES PAGAM AS CONTAS."],
      },
    ],
  },

  lab: {
    name: "LAB DO PROF. CARVALHO", music: "lab", interior: true,
    spawn: { x: 6, y: 12, dir: "up" },
    signs: {
      // as estantes de verdade ficam no canto direito da parede do fundo
      "9,1": "A ESTANTE ESTÁ COBERTA DE ANOTAÇÕES SOBRE EVOLUÇÃO.",
      "10,1": "LIVROS SOBRE HABITATS. METADE ESTÁ FORA DA ORDEM.",
      "11,1": "FICHAS DE POKÉMON CAPTURADOS, EMPILHADAS ATÉ EM CIMA.",
      "12,1": "UMA PRATELEIRA VAZIA. A POEIRA MOSTRA O QUE FALTA ALI.",
      "0,1": "UMA MÁQUINA ANTIGA PISCANDO SOZINHA. NINGUÉM SABE O QUE ELA FAZ.",
      "1,1": "MONITOR DE SINAIS. A LINHA VERDE NÃO PARA DE SUBIR.",
    },
    // máquina de cúpula vermelha com o botão gigante: o portal pra dimensão
    dimensionMachine: ["1,4", "2,4", "1,5", "2,5"],
    // o computador do professor (monitor + a torre branca do lado, tiles 2 e 3
    // da parede do fundo): é nele que roda o 011GIVEGLITCH110
    profPC: ["2,1", "3,1"],
    encounters: [],
    npcs: [
      {
        id: "carvalho", x: 6, y: 3, dir: "down", sprite: "prof",
        lines: [
          "AH, VOCÊ CHEGOU! DESCULPA A BAGUNÇA.",
          "TRÊS POKÉMON ESTÃO NAQUELA MESA. ESCOLHA UM PRA LEVAR.",
          "SÃO OS INICIAIS DE KANTO: BULBASAUR, CHARMANDER E SQUIRTLE.",
        ],
        afterLines: ["CUIDE BEM DELE. E PASSE NO CENTRO POKÉMON DE VIRIDIAN PRA CURAR."],
      },
      // largada no chão ao lado do computador: quem deixou o 011GIVEGLITCH110
      // aberto também esqueceu isto aqui. Não tem sprite: é item escondido —
      // só acha quem encostar em 4,2 e apertar Z.
      { id: "ball_voo", x: 4, y: 2, sprite: "ball", invisivel: true, gift: { item: "bilhete voo", qty: 1 } },
      { id: "ball0", x: 8, y: 4, sprite: "ball", starter: "bulbasaur" },
      { id: "ball1", x: 9, y: 4, sprite: "ball", starter: "charmander" },
      { id: "ball2", x: 10, y: 4, sprite: "ball", starter: "squirtle" },
      {
        // Antes de você escolher, ele está aqui, esperando a sua vez. Depois da
        // escolha some daqui e reaparece na porta (montado em runtime, com time
        // e batalha — ver src/systems/rival.js).
        id: "azul", x: 5, y: 4, dir: "right", sprite: "rival", someComFlag: "starterChosen",
        lines: ["VOCÊ DE NOVO? EU CHEGUEI PRIMEIRO, COMO SEMPRE.",
                "VOU ESCOLHER DEPOIS DE VOCÊ — ASSIM EU PEGO O QUE GANHA DO SEU.",
                "É CONTA, NÃO É SORTE."],
      },
      {
        id: "assistente", x: 3, y: 11, dir: "right", sprite: "cientista",
        lines: ["O PROFESSOR PESQUISA POKÉMON HÁ 40 ANOS.", "ELE AINDA NÃO CATALOGOU TODOS OS 151."],
      },
      {
        id: "assistente2", x: 11, y: 10, dir: "left", sprite: "cientista",
        lines: ["A POKÉDEX SE COMPLETA SOZINHA QUANDO VOCÊ VÊ UM POKÉMON NOVO."],
      },
    ],
  },

  // CIDADE SAFFRON continua tomada pela EQUIPE ROCKET, do jeito que ela vem do
  // FireRed — e um dos recrutas fica plantado em 46,13, bem na porta do ginásio
  // da SABRINA. No original ele só sai depois da SILPH CO., que não existe
  // neste jogo: sem isso a INSÍGNIA PÂNTANO era impossível e não dava pra fechar
  // as oito. Aqui ele sai na base da batalha (`sumirDepois`).
  saffron_city: {
    name: "CIDADE SAFFRON",
    npcPatch: {
      n2: {
        lines: [
          "A EQUIPE ROCKET MANDA NESTA CIDADE AGORA.",
          "O GINÁSIO ESTÁ FECHADO. A SABRINA NÃO RECEBE NINGUÉM.",
          "QUER ENTRAR? PASSA POR CIMA DE MIM.",
        ],
        againLines: ["MUDOU DE IDEIA? A PORTA CONTINUA ATRÁS DE MIM."],
        afterLines: ["TÁ BOM, TÁ BOM. EU SAIO DA FRENTE."],
        trainer: {
          name: "RECRUTA ROCKET", prize: 1800, sight: 0,
          party: [{ id: "zubat", lvl: 26 }, { id: "koffing", lvl: 27 }, { id: "raticate", lvl: 29 }],
        },
        sumirDepois: true,        // vencido, ele desocupa a porta do ginásio
      },
    },
    // ALAKAZITA: a cidade dos PSÍQUICOS. A pedra está encostada na cerca do
    // prédio do norte, entre as árvores.
    addNpcs: [{ id: "pedra_alakazita", x: 15, y: 10, sprite: "ball", gift: { item: "alakazita", qty: 1 } }],
  },

  // O VENDEDOR DE MAGIKARP do original, no centro pokémon da ROTA 4. Ele não é
  // piada: as tabelas de encontro importadas só têm bicho de terra, então quem
  // não escolheu o SQUIRTLE não teria nenhum tipo ÁGUA — e sem ÁGUA a SRTA. JOY
  // não ensina SURFAR, sem SURFAR não se chega em CINNABAR e a INSÍGNIA VULCÃO
  // fica impossível. O MAGIKARP vira GYARADOS no nível 20, que aprende SURFAR
  // (e VOAR) com ela.
  route4_pokemon_center_1f: {
    name: "CENTRO POKÉMON — ROTA 4",
    npcPatch: {
      n2: {
        lines: [
          "PSIU! VOCÊ AÍ! QUER FAZER O NEGÓCIO DA SUA VIDA?",
          "UM MAGIKARP RARÍSSIMO, SÓ $500. UMA PECHINCHA!",
        ],
        monShop: { id: "magikarp", lvl: 10, price: 500 },
        recusa: "TÁ PERDENDO A CHANCE, GAROTO.",
        depoisDaCompra: [
          "NEGÓCIO FECHADO! SEM DEVOLUÇÃO, HEIN?",
          "ELE SÓ SABE SE DEBATER AGORA. NO NÍVEL 20 VOCÊ VAI ME AGRADECER.",
        ],
        afterLines: ["JÁ TE VENDI UM. VAI TREINAR ELE, VAI!"],
      },
    },
  },

  // Mapas sem conteúdo escrito à mão, só com os obstáculos de FORÇA e
  // QUEBRA-ROCHA por cima da geometria importada do FireRed.
  route2: { pedras: ["11,15"] },
  mt_moon_1f: { pedras: ["9,8", "11,8"], blocos: ["17,8"] },
  rock_tunnel_1f: { pedras: ["19,8"], blocos: ["9,8", "17,8"] },

  // A ilha do BILHETE AURORA. A geometria (areia, mar e o monumento) é gerada em
  // src/data/index.js; aqui fica só quem mora nela.
  birth_island: {
    name: "BIRTH ISLAND", music: "ilha",
    spawn: { x: 15, y: 22, dir: "up" },      // o avião de papel pousa no píer
    encounters: [],
    signs: {
      "15,8": "A PEDRA TEM TRÊS LADOS IGUAIS E NENHUMA MARCA DE FERRAMENTA.",
      "15,5": "UMA ÁRVORE SOZINHA NA PONTA NORTE. NINGUÉM PLANTOU ELA AQUI.",
    },
    lockedWarps: { "15,24": "O BARCO NÃO ESTÁ NO PORTO. VOCÊ VEIO VOANDO, LEMBRA?" },
    npcs: [],          // o DEOXYS é montado em runtime (ver deoxysNpc no overworld)
    // os cantos onde ele se remonta, todos em areia livre
    deoxysSpots: [
      { x: 15, y: 9 }, { x: 11, y: 12 }, { x: 19, y: 12 },
      { x: 15, y: 14 }, { x: 8, y: 13 }, { x: 22, y: 13 },
    ],
  },

  center: {
    name: "CENTRO POKÉMON", music: "center", interior: true,
    spawn: { x: 7, y: 8, dir: "up" },
    signs: {},
    lockedWarps: { "1,6": "A ESCADA LEVA À SALA DE UNIÃO. ESTÁ FECHADA." },
    encounters: [],
    npcs: [
      {
        id: "enfermeira", x: 7, y: 2, dir: "down", sprite: "enfermeira", heal: true, tutor: true,
        lines: ["BEM-VINDO AO CENTRO POKÉMON! EU SOU A SRTA. JOY.",
                "CURO SEUS POKÉMON E TAMBÉM AJUSTO OS GOLPES DELES, SE QUISER."],
      },
      {
        id: "senhor", x: 12, y: 5, dir: "left", sprite: "gentleman",
        lines: ["OS CENTROS POKÉMON EXISTEM EM TODA KANTO.", "É BOM SABER ONDE FICA O MAIS PRÓXIMO."],
      },
      {
        id: "garotinho", x: 4, y: 7, dir: "up", sprite: "menino",
        lines: ["MINHA IRMÃ DISSE QUE EXISTE UM POKÉMON QUE NÃO ESTÁ NA POKÉDEX.", "EU ACHO QUE ELA TAVA ME ZOANDO."],
      },
    ],
  },

  mart: {
    name: "LOJA POKÉMON", music: "mart", interior: true,
    spawn: { x: 4, y: 7, dir: "up" },
    signs: {},
    encounters: [],
    npcs: [
      {
        id: "balconista", x: 2, y: 3, dir: "down", sprite: "balconista",
        lines: ["OI! BEM-VINDO À LOJA POKÉMON.", "CHEGARAM PEDRAS DE EVOLUÇÃO. CARAS, MAS VALEM CADA MOEDA.", "E TEM BARRACA! DÁ PRA ACAMPAR E FAZER UM SANDUÍCHE NO CAMINHO."],
        shop: [
          { item: "poké bola", price: 200 },
          { item: "poção", price: 300 },
          // a barraca, a barraca de leilão e os ingredientes NÃO estão escritos
          // aqui: src/data/index.js gruda o estoque de acampamento em toda loja
          // do jogo, e repetir a lista seria repetir o erro de esquecer uma
          // as cinco pedras de evolução (ver src/data/evolution.js)
          { item: "pedra do fogo", price: 2100 },
          { item: "pedra da água", price: 2100 },
          { item: "pedra do trovão", price: 2100 },
          { item: "pedra da folha", price: 2100 },
          { item: "pedra da lua", price: 2100 },
        ],
      },
      {
        id: "cliente", x: 6, y: 2, dir: "down", sprite: "garoto",
        lines: ["POÇÃO CURA 20 DE HP.", "DÁ PRA USAR NO MEIO DA BATALHA, SEM PERDER O TURNO... QUASE."],
      },
      {
        id: "cliente2", x: 9, y: 5, dir: "left", sprite: "garota",
        lines: ["ANTIGAMENTE DAVA PRA COMPRAR UMA POKÉ BOLA MAIS BARATO.", "INFLAÇÃO CHEGOU EM KANTO TAMBÉM."],
      },
    ],
  },

  // ---------------------------------------------------------------- ginásios
  // `addNpcs` acrescenta ao que veio do mapa original (os treinadores do
  // ginásio continuam lá); os times dos líderes são os do FireRed.
  pewter_city_gym: {
    name: "GINÁSIO DE PEWTER", music: "gym", interior: true,
    addNpcs: [{
      id: "lider", x: 6, y: 5, dir: "down", sprite: "brock",
      lines: ["EU SOU BROCK, LÍDER DO GINÁSIO DE PEWTER.", "MEUS POKÉMON SÃO DUROS COMO PEDRA. MOSTRE O QUE SABE!"],
      afterLines: ["VOCÊ TEM ALGO ALÉM DE FORÇA BRUTA. SIGA EM FRENTE."],
      trainer: { name: "LÍDER BROCK", prize: 1400, badge: "pedra",
                party: [{ id: "geodude", lvl: 12 }, { id: "onix", lvl: 14 }] },
    }],
  },
  cerulean_city_gym: {
    name: "GINÁSIO DE CERULEAN", music: "gym", interior: true,
    addNpcs: [{
      id: "lider", x: 8, y: 6, dir: "down", sprite: "misty",
      lines: ["EU SOU MISTY, A SEREIA DE CERULEAN.", "MINHA ESTRATÉGIA É SIMPLES: ATAQUE TOTAL COM POKÉMON DE ÁGUA!"],
      afterLines: ["VOCÊ É MESMO BOM. TÁ BOM, LEVA A INSÍGNIA."],
      trainer: { name: "LÍDER MISTY", prize: 2100, badge: "cascata",
                party: [{ id: "staryu", lvl: 18 }, { id: "starmie", lvl: 21 }] },
    }],
  },
  vermilion_city_gym: {
    name: "GINÁSIO DE VERMILION", music: "gym", interior: true,
    // Painel de manutenção na parede, ao lado do gerador da esquerda: encoste em
    // 1,8 ou 2,8 olhando pra cima e aperte Z pra abrir o desafio dos fios.
    interruptor: ["1,7", "2,7"],
    // A barreira elétrica que fecha a passagem pro SURGE. Com os fios ligados
    // (flag no save) estes tiles liberam, e o desenho deles é remendado com o
    // tile de piso limpo em 5,9.
    barreira: { tiles: ["5,6", "5,7"], piso: "5,9", flag: "fiosVermilion" },
    addNpcs: [{
      id: "lider", x: 5, y: 2, dir: "down", sprite: "surge",
      lines: ["EI, PIRRALHO! EU SOU O TENENTE SURGE.", "APRENDI A LUTAR NA GUERRA. ELÉTRICO SALVOU MINHA VIDA LÁ!"],
      afterLines: ["VOCÊ É DURO NA QUEDA, PIRRALHO. RESPEITO."],
      trainer: { name: "LÍDER TENENTE SURGE", prize: 2400, badge: "trovao",
                party: [{ id: "voltorb", lvl: 21 }, { id: "pikachu", lvl: 18 }, { id: "raichu", lvl: 24 }] },
    }],
  },
  celadon_city_gym: {
    name: "GINÁSIO DE CELADON", music: "gym", interior: true,
    addNpcs: [{
      id: "lider", x: 6, y: 4, dir: "down", sprite: "erika",
      lines: ["BEM-VINDO. EU SOU ERIKA, DE CELADON.", "EU ENSINO A ARTE DOS ARRANJOS FLORAIS... E DOS POKÉMON DE PLANTA."],
      afterLines: ["QUE DERROTA AGRADÁVEL. VOCÊ MERECEU."],
      trainer: { name: "LÍDER ERIKA", prize: 2900, badge: "arcoiris",
                party: [{ id: "victreebel", lvl: 29 }, { id: "tangela", lvl: 24 }, { id: "vileplume", lvl: 29 }] },
    }],
  },
  fuchsia_city_gym: {
    name: "GINÁSIO DE FUCHSIA", music: "gym", interior: true,
    addNpcs: [{
      id: "lider", x: 7, y: 13, dir: "down", sprite: "koga",
      lines: ["FWAHAHAHA! EU SOU KOGA, MESTRE DOS NINJAS.", "MEU VENENO VAI CORROER VOCÊ AOS POUCOS!"],
      afterLines: ["ADMIRÁVEL. VOCÊ VIU ATRAVÉS DA MINHA NÉVOA."],
      trainer: { name: "LÍDER KOGA", prize: 3700, badge: "alma",
                party: [{ id: "koffing", lvl: 37 }, { id: "muk", lvl: 39 }, { id: "koffing", lvl: 37 }, { id: "weezing", lvl: 43 }] },
    }],
  },
  saffron_city_gym: {
    name: "GINÁSIO DE SAFFRON", music: "gym", interior: true,
    addNpcs: [{
      id: "lider", x: 14, y: 11, dir: "down", sprite: "sabrina",
      lines: ["EU SABIA QUE VOCÊ VIRIA. EU SOU SABRINA.", "JÁ VI ESTA BATALHA NA MINHA MENTE. VOCÊ PERDE... TALVEZ."],
      afterLines: ["MINHA PREVISÃO FALHOU. ISSO NUNCA ACONTECEU ANTES."],
      trainer: { name: "LÍDER SABRINA", prize: 4300, badge: "pantano",
                party: [{ id: "kadabra", lvl: 38 }, { id: "mrmime", lvl: 37 }, { id: "venomoth", lvl: 38 }, { id: "alakazam", lvl: 43 }] },
    }],
  },
  cinnabar_island: {
    // A ilha do laboratório de fósseis. Quem ressuscita bicho de pedra desde
    // sempre foi ver o que o DECODIFICADOR DE GENOMA faz com dois vivos — e
    // montou um concurso na praça do sul pra julgar o resultado.
    addNpcs: PALCO_CINNABAR,
    signs: {
      // cartaz na parede do Centro Pokémon, ao lado da porta
      "12,11": "CONCURSO DE FUSÃO DE CINNABAR. TRAGA UMA DUPLA. TRÊS JURADOS, TRINTA PONTOS.",
    },
  },

  cinnabar_island_gym: {
    name: "GINÁSIO DE CINNABAR", music: "gym", interior: true,
    // O ginásio do BLAINE é um labirinto de salas com portas trancadas: no
    // original elas abrem quando você acerta a pergunta da máquina da sala.
    // A geometria importada trazia as portas fechadas e nada que as abrisse —
    // ou seja, o BLAINE era inalcançável e a INSÍGNIA VULCÃO, impossível.
    // Cada entrada abaixo liga a máquina (`painel`) à porta que ela destrava.
    piso: "25,12",              // tile de chão usado pra remendar a porta aberta
    quiz: [
      { id: "q1", painel: ["22,10", "23,10"], porta: ["26,9", "27,9"],
        pergunta: "GOLPE ELÉTRICO NÃO CAUSA NADA EM POKÉMON DE TERRA. CERTO?",
        opcoes: ["CERTO", "ERRADO"], certa: 0 },
      { id: "q2", painel: ["15,2", "16,2"], porta: ["17,9", "18,9"],
        pergunta: "GOLPE DE FOGO É SUPER EFETIVO CONTRA TIPO PEDRA. CERTO?",
        opcoes: ["CERTO", "ERRADO"], certa: 1 },
      { id: "q3", painel: ["13,10", "14,10"], porta: ["17,16", "18,16"],
        pergunta: "GOLPE NORMAL NÃO ACERTA POKÉMON FANTASMA. CERTO?",
        opcoes: ["CERTO", "ERRADO"], certa: 0 },
      { id: "q4", painel: ["13,17", "14,17"], porta: ["11,22", "11,23"],
        pergunta: "MAGIKARP EVOLUI USANDO A PEDRA DA ÁGUA. CERTO?",
        opcoes: ["CERTO", "ERRADO"], certa: 1 },
      { id: "q5", painel: ["1,18", "2,18"], porta: ["5,17", "6,17"],
        pergunta: "TIPO VENENO É SUPER EFETIVO CONTRA TIPO PLANTA. CERTO?",
        opcoes: ["CERTO", "ERRADO"], certa: 0 },
      { id: "q6", painel: ["1,10", "2,10"], porta: ["5,9", "6,9"],
        pergunta: "GOLPE DE PLANTA É SUPER EFETIVO CONTRA FOGO. CERTO?",
        opcoes: ["CERTO", "ERRADO"], certa: 1 },
    ],
    addNpcs: [{
      id: "lider", x: 5, y: 4, dir: "down", sprite: "blaine",
      lines: ["HAH! EU SOU BLAINE, O MESTRE DO FOGO!", "MINHAS CHAMAS VÃO REDUZIR VOCÊ A CINZAS!"],
      afterLines: ["VOCÊ APAGOU MINHAS CHAMAS. LEVE A INSÍGNIA."],
      trainer: { name: "LÍDER BLAINE", prize: 4700, badge: "vulcao",
                party: [{ id: "growlithe", lvl: 42 }, { id: "ponyta", lvl: 40 }, { id: "rapidash", lvl: 42 }, { id: "arcanine", lvl: 47 }] },
    }],
  },
  viridian_city_gym: {
    name: "GINÁSIO DE VIRIDIAN", music: "gym", interior: true,
    addNpcs: [{
      id: "lider", x: 2, y: 2, dir: "down", sprite: "giovanni",
      lines: ["ENTÃO É VOCÊ. EU SOU GIOVANNI, LÍDER DESTE GINÁSIO.", "A ÚLTIMA TRAVA DE KANTO ESTÁ COMIGO. VENHA BUSCÁ-LA."],
      afterLines: ["...O QUE FOI ISSO? O CHÃO TREMEU QUANDO VOCÊ GANHOU.", "VÁ EMBORA. AGORA."],
      trainer: { name: "LÍDER GIOVANNI", prize: 5000, badge: "terra",
                party: [{ id: "rhyhorn", lvl: 45 }, { id: "dugtrio", lvl: 42 }, { id: "nidoqueen", lvl: 44 }, { id: "nidoking", lvl: 45 }, { id: "rhydon", lvl: 50 }] },
    }],
  },

  // ------------------------------------------------------------ MEGAPEDRAS
  // Uma megapedra largada por mapa, sempre num canto de chão limpo encostado em
  // alguma coisa (cerca, barranco, parede de caverna). As dos INICIAIS não
  // estão aqui: essas o PROF. CARVALHO entrega junto com o ANEL MEGA. A
  // MISSINGNITA também não — ela nasceu no canteiro de Vila Paleta.
  route3: {
    addNpcs: [{ id: "pedra_pidgeotita", x: 29, y: 13, sprite: "ball", gift: { item: "pidgeotita", qty: 1 } }],
  },
  route12: {
    addNpcs: [{ id: "pedra_slowbronita", x: 19, y: 26, sprite: "ball", gift: { item: "slowbronita", qty: 1 } }],
  },
  lavender_town: {
    addNpcs: [{ id: "pedra_gengarita", x: 3, y: 5, sprite: "ball", gift: { item: "gengarita", qty: 1 } }],
  },
  fuchsia_city: {
    addNpcs: [{ id: "pedra_kangaskhanita", x: 42, y: 30, sprite: "ball", gift: { item: "kangaskhanita", qty: 1 } }],
  },
  route13: {
    addNpcs: [{ id: "pedra_pinsirita", x: 1, y: 14, sprite: "ball", gift: { item: "pinsirita", qty: 1 } }],
  },
  route25: {
    addNpcs: [{ id: "pedra_gyaradosita", x: 42, y: 9, sprite: "ball", gift: { item: "gyaradosita", qty: 1 } }],
  },
  mt_moon_b2f: {
    addNpcs: [{ id: "pedra_aerodactylita", x: 15, y: 27, sprite: "ball", gift: { item: "aerodactylita", qty: 1 } }],
  },
  victory_road_2f: {
    addNpcs: [{ id: "pedra_mewtwonita_x", x: 14, y: 13, sprite: "ball", gift: { item: "mewtwonita x", qty: 1 } }],
  },
  victory_road_3f: {
    addNpcs: [{ id: "pedra_mewtwonita_y", x: 12, y: 9, sprite: "ball", gift: { item: "mewtwonita y", qty: 1 } }],
  },
};

export const START_MAP = "home";

// tags de célula que vêm de assets/maps/kanto.json
export const TAG = { FREE: 0, BLOCK: 1, GRASS: 2, WATER: 3, LEDGE_S: 4, LEDGE_E: 5, LEDGE_W: 6, LEDGE_N: 7 };

// O PC do CENTRO POKÉMON. Todo centro de Kanto tem a mesma planta: a máquina
// branca fica encostada na parede do fundo, no canto direito do balcão (x=11).
// Em vez de repetir isso em cada um dos mapas, a lista é colada em todos eles
// por mergeMaps (src/data/index.js) — e qualquer mapa pode ter o seu próprio
// escrevendo `pc: ["x,y"]` aqui. Os tiles listados também viram parede: o
// original não deixa o jogador andar por cima da máquina.
export const PC_CENTRO = ["11,0", "11,1", "11,2"];
export const LEDGE_DIR = { 4: "down", 5: "right", 6: "left", 7: "up" };

// ---------------------------------------------------------------- side quests
// Os NPCs das missões (src/data/missoes.js) entram aqui, cada um no mapa dele.
// Fica assim, e não escrito à mão mapa por mapa, porque o pedido, a fala e o
// lugar são a MESMA coisa: escrever a missão já é colocar o NPC no mundo.
const jaPosto = new Set();
for (const q of MISSOES) {
  // várias missões no mesmo tile são o MESMO NPC (o marinheiro tem três): ele
  // entra uma vez só, e o jogo escolhe qual pedido ele faz (ver `daVez`).
  const lugar = `${q.mapa}.${q.x},${q.y}`;
  if (jaPosto.has(lugar)) continue;
  jaPosto.add(lugar);
  const mapa = (MAPS[q.mapa] ||= {});
  const npc = {
    id: `missao_${q.id}`, x: q.x, y: q.y, dir: q.dir || "down",
    sprite: q.sprite, missao: q.id, lines: q.oferta,
  };
  // Mapa que escreve a lista `npcs` inteira ignora `addNpcs` (ver mergeMaps em
  // src/data/index.js): nesse caso o NPC da missão entra na lista dele.
  if (Array.isArray(mapa.npcs)) mapa.npcs.push(npc);
  else (mapa.addNpcs ||= []).push(npc);
}
