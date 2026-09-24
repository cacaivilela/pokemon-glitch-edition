// AS BATALHAS DUPLAS: dois do seu lado, dois do outro.
//
// Quem luta em dupla (e quem manda nisso):
//   - as DUPLAS DE TREINADORES aqui embaixo, espalhadas por Kanto: um NPC só,
//     com `dupla: true` no `trainer`, como as gêmeas do FireRed;
//   - TODO treinador com dois ou mais Pokémon, se a opção BATALHA DUPLA estiver
//     ligada no menu OPÇÕES (`st.flags.todasDuplas`, é do save);
//   - as PROVAÇÕES: o totem chama um AJUDANTE, como nos jogos de Alola;
//   - a BATALHA LINK, quando quem desafia escolhe 2x2.
//
// A cena é src/scenes/doublebattle.js (a link é src/scenes/linkbattle.js, que
// ganhou o modo dupla). Aqui mora só o que é DADO: quem acerta todo mundo, quem
// ajuda cada totem e quem são as duplas.

/** OS GOLPES QUE PEGAM MAIS DE UM. Em dupla, o golpe normal escolhe um alvo;
 *  estes não escolhem nada e batem em todo mundo que alcançam, com 3/4 da força
 *  em cada um (a mesma conta dos jogos de verdade).
 *    "inimigos" — os dois do outro lado
 *    "todos"    — os dois do outro lado E o seu parceiro: TERREMOTO não sabe
 *                 quem é amigo. É o preço de um golpe de 100 que pega dois. */
export const ESPALHA = {
  terremoto: "todos",
  surfar: "todos",
  ventogelado: "inimigos",
  bolhas: "inimigos",
  rajadadevento: "inimigos",
  grito: "inimigos",
  rabodeabano: "inimigos",
};

/** Quanto sobra da força de um golpe que pega mais de um alvo. */
export const FORCA_ESPALHADA = 0.75;

/** OS AJUDANTES DE CADA TOTEM. Nos jogos de Alola o totem chama socorro, e
 *  quem vem é bicho da família dele ou do mesmo tipo — é isso aqui. Eles entram
 *  do lado do totem, sem aura e sem tamanho de chefe, alguns níveis abaixo. Não
 *  se pega nenhum: a marca fecha o círculo em volta do grupo inteiro.
 *
 *  Numa provação em DUPLA vem o primeiro da lista; em TRIO vêm os dois. E do
 *  seu lado saem tantos quanto os do outro: dois contra dois, três contra três. */
export const AJUDANTES = {
  NORMAL: ["yungoos", "rattata"],
  LUTADOR: ["stufful", "mankey"],
  VOADOR: ["trumbeak", "pikipek"],
  VENENO: ["grimer", "koffing"],
  // o DIGLETT bombado chama... DIGLETT. Do tamanho normal, do jeito de sempre,
  // enterrado. Do lado dele, parece que foram os outros que erraram.
  TERRA: ["diglett", "diglett"],
  PEDRA: ["rockruff", "geodude"],
  INSETO: ["charjabug", "grubbin"],
  FANTASMA: ["sandygast", "gastly"],
  AÇO: ["magnemite", "skarmory"],
  FOGO: ["salandit", "vulpix"],
  ÁGUA: ["dewpider", "psyduck"],
  PLANTA: ["fomantis", "oddish"],
  ELÉTRICO: ["dedenne", "pikachu"],
  PSÍQUICO: ["kadabra", "abra"],
  GELO: ["cubchoo", "swinub"],
  DRAGÃO: ["drakloak", "dreepy"],
  SOMBRIO: ["sneasel", "murkrow"],
  FADA: ["cutiefly", "clefairy"],
  // o MISSINGNO. não chama bicho: chama OUTROS ERROS. O PORYGON-HACK e o
  // DITTO-HACK são o código e a cópia lidos do lugar errado.
  GLITCH: ["porygonhack", "dittohack"],
};

/** DUPLA OU TRIO. As provações andam em fila (src/data/provacoes.js), e a
 *  partir desta posição da fila (contando do 1) o totem vem com DOIS ajudantes.
 *  A 10ª é a de FOGO: a metade de cima da escada luta três contra três. */
export const TRIO_A_PARTIR = 10;

/** Quantos níveis o ajudante fica abaixo do totem. */
export const AJUDANTE_ABAIXO = 5;

/** AS DUPLAS DE TREINADORES. Um NPC só, com os dois nomes, e a equipe dos dois
 *  numa lista — a batalha põe os dois primeiros em campo e o resto entra no
 *  lugar de quem cair. Os lugares são chão aberto, longe de porta, de placa e
 *  das marcas das provações (`dev/duplacheck.html` confere). O nível acompanha
 *  a ordem em que o jogo normalmente passa por cada rota. */
export const DUPLAS_TREINADORES = [
  {
    mapa: "route24", x: 8, y: 14, dir: "down", sprite: "garota",
    nome: "GÊMEAS ANA E BIA", premio: 700,
    time: [["clefairy", 14], ["jigglypuff", 14]],
    fala: ["ANA: A GENTE FAZ TUDO JUNTO.", "BIA: ATÉ BATALHA. DOIS CONTRA DOIS!"],
    depois: ["ANA: PERDEMOS JUNTAS, PELO MENOS.", "BIA: ISSO NÃO CONSOLA NADA."],
  },
  {
    mapa: "route25", x: 37, y: 8, dir: "left", sprite: "garoto",
    nome: "IRMÃOS TUCO E TITO", premio: 800,
    time: [["nidoranm", 16], ["nidoranf", 16]],
    fala: ["TUCO: O MEU É O MACHO.", "TITO: O MEU É A FÊMEA. JUNTOS ELES SÃO IMBATÍVEIS!"],
    depois: ["TUCO: ELES ERAM IMBATÍVEIS ATÉ AGORA HÁ POUCO."],
  },
  {
    mapa: "route6", x: 8, y: 20, dir: "right", sprite: "gentleman",
    nome: "CASAL JOÃO E LIA", premio: 1200,
    time: [["pidgeotto", 19], ["raticate", 19], ["meowth", 20]],
    fala: ["JOÃO: SAÍMOS PRA PASSEAR E ACHAMOS UM DESAFIANTE.", "LIA: QUE SORTE A NOSSA. E O AZAR É SEU."],
    depois: ["LIA: O PASSEIO CONTINUA. MAS AGORA A GENTE VAI QUIETO."],
  },
  {
    mapa: "route4", x: 54, y: 11, dir: "down", sprite: "montanhista",
    nome: "MONTANHISTAS DUDA E RUI", premio: 1100,
    time: [["geodude", 18], ["onix", 18]],
    fala: ["DUDA: DESCEMOS O MONTE LUA AGORA.", "RUI: E AINDA TEMOS FÔLEGO PRA UMA BATALHA DUPLA!"],
    depois: ["RUI: ACHO QUE O FÔLEGO ACABOU AQUI."],
  },
  {
    mapa: "route12", x: 5, y: 70, dir: "down", sprite: "pescador",
    nome: "PESCADORES ZÉ E NINO", premio: 2000,
    time: [["poliwhirl", 28], ["seaking", 28], ["tentacool", 27]],
    fala: ["ZÉ: UM SEGURA A VARA...", "NINO: ...E O OUTRO SEGURA O PEIXE. VAMOS VER COMO VOCÊ SEGURA DOIS!"],
    depois: ["ZÉ: ESCAPOU. OS DOIS ESCAPARAM."],
  },
  {
    mapa: "route13", x: 32, y: 6, dir: "down", sprite: "lutador",
    nome: "LUTADORES KIM E JÔ", premio: 2400,
    time: [["machoke", 31], ["hitmonlee", 31]],
    fala: ["KIM: TREINAMOS EM DUPLA HÁ DEZ ANOS.", "JÔ: UM ABRE A GUARDA, O OUTRO ACERTA!"],
    depois: ["JÔ: DEZ ANOS... E VOCÊ ABRIU A NOSSA GUARDA."],
  },
  {
    mapa: "route14", x: 15, y: 30, dir: "down", sprite: "rocket",
    nome: "DUPLA ROCKET", premio: 2600,
    time: [["arbok", 33], ["weezing", 33]],
    fala: ["PREPARE-SE PARA ENCRENCA...", "...E ENCRENCA EM DOBRO! DOIS CONTRA DOIS!"],
    depois: ["A EQUIPE ROCKET DECOLA DE NOVO..."],
  },
  {
    mapa: "route18", x: 30, y: 9, dir: "left", sprite: "motoqueiro",
    nome: "MOTOQUEIROS BETO E GIL", premio: 2800,
    time: [["muk", 35], ["koffing", 34], ["grimer", 34]],
    fala: ["BETO: A CICLOVIA É NOSSA.", "GIL: QUER PASSAR? DERRUBA OS DOIS!"],
    depois: ["GIL: TÁ BOM, TÁ BOM. PODE PASSAR."],
  },
];

/** As falas que valem pra toda batalha dupla. */
export const DUPLA_TEXTO = {
  desafio: "{NOME} QUEREM BATALHAR EM DUPLA!",
  enviou: "{NOME} ENVIOU {A} E {B}!",
  enviouUm: "{NOME} ENVIOU {A}!",
  vai: "VAI, {A} E {B}!",
  vaiUm: "VAI, {A}!",
  chamou: "O TOTEM {MON} CHAMOU AJUDA!",
  ajudante: "{MON} VEIO AJUDAR!",
  alvo: "EM QUEM?",
  todos: "ACERTA TODO MUNDO EM VOLTA!",
  inimigos: "ACERTA OS DOIS DO OUTRO LADO!",
  semFuga: "NÃO DÁ PRA FUGIR DE UMA BATALHA DUPLA!",
  quemEntra: "QUEM ENTRA NO LUGAR DE {MON}?",
  opcao: "BATALHA DUPLA",
  opcaoDica: "TREINADOR COM 2+ POKÉMON LUTA EM DUPLA",
};
