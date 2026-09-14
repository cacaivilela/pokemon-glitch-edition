// AS GLITCH ZONES: a GLITCH CITY deste jogo.
//
// No Pokémon Red de verdade, sair da ZONA SAFÁRI do jeito errado te largava
// numa cidade que não existia: os tiles da última cidade em que você pisou,
// embaralhados, com árvore em cima de telhado e água no meio da rua — e você
// preso num quadrado de dois tiles, sem porta, esperando o VOAR te salvar.
// Ninguém programou aquele lugar. Ele foi a coisa mais lembrada do jogo.
//
// Aqui ela tem ENTRADA. Depois que a fenda foi aberta, aparece em alguns cantos
// de Kanto uma porta que não é desenho de porta nenhuma: um vão de tela
// corrompida. Você ATRAVESSA — não conversa, não aperta nada — e cai NUM LUGAR
// ALEATÓRIO de Kanto que não está mais na ordem: os tiles daquele mapa foram
// sorteados de lugar, colisão e tudo. Grama no telhado, barranco no meio do
// mar, e possivelmente você no meio de quatro árvores.
//
// O VÃO DE VOLTA fica NO TILE EM QUE VOCÊ CAIU: a porta por onde você entrou
// é a porta por onde se sai — um passo pra fora, um passo de volta pra dentro.
//
// FICAR PRESO É PARTE DA COISA, e não um defeito a corrigir: é o que a GLITCH
// CITY fazia, e é o susto que ela dava. Cair num quadrado de um tile só, sem
// vizinho pra dar o passo de fora, ainda acontece. Mas preso pra sempre é um
// save que morreu, então a saída também é glitch: parede que não devia estar
// ali não é parede de verdade — INSISTA nela (esbarre `esbarroes` vezes) e ela
// cede. Quem sabe VOAR voa; quem não sabe, empurra o mundo até ele desistir.
//
// A zona mora no save (`st.zona`): fonte, semente, de onde você veio. A
// semente é o que faz o lugar continuar o MESMO lugar depois de fechar o jogo
// — o embaralhado sai da semente, então o mapa bugado é reconstruído igual.
export const GLITCH_ZONES = {
  /** As entradas. Cada uma é UM tile de chão; pisar nele é atravessar.
   *  São tiles de beco, escolhidos pra ninguém cair lá indo pra outro lugar:
   *  a costa de CINNABAR tem faixa dupla (x=21 passa ao lado), o vão do
   *  SAFÁRI é UM dos dois buracos de uma cerca (o outro, em x=34, continua
   *  aberto), o beco de LAVENDER não leva a nada e os fundos do CENTRO de
   *  VIRIDIAN ficam na rua de trás, encostados no telhado (x=26 é o meio
   *  do prédio; quem contorna passa por x=23 ou x=29). */
  entradas: [
    // A costa leste de CINNABAR: o lugar mais quebrado da história dos jogos.
    { mapa: "cinnabar_island", x: 22, y: 10, nome: "A COSTA DE CINNABAR" },
    // A ZONA SAFÁRI, por onde a GLITCH CITY original se alcançava.
    { mapa: "safari_zone_center", x: 32, y: 20, nome: "A CERCA DO SAFÁRI" },
    // Um beco sem saída no canto de LAVENDER, à sombra da torre.
    { mapa: "lavender_town", x: 1, y: 5, nome: "O BECO DE LAVENDER" },
    // Atrás do CENTRO POKÉMON de VIRIDIAN, colado no telhado: a rua de trás
    // da primeira cidade que todo mundo atravessa — e ninguém olha.
    { mapa: "viridian", x: 26, y: 22, nome: "OS FUNDOS DE VIRIDIAN" },
  ],
  /** Mapas que NUNCA servem de fonte: os gerados em código não têm PNG pra
   *  fatiar, e a fenda embaralhada seria a fenda de novo. */
  fora: ["glitchdim", "tempestade", "home"],
  /** A fonte tem que ter pelo menos isto de tiles: um quartinho embaralhado é
   *  só um quartinho. */
  minimo: 24 * 20,
  /** O TAMANHO DOS PEDAÇOS que trocam de lugar, em tiles.
   *
   *  A 1 o mapa vira areia: cada tile solto, metade parede, e o jogador nasce
   *  preso NOVE em cada DEZ vezes — aí "pode ficar preso" vira "sempre fica
   *  preso", e a saída forçada vira o jogo inteiro. A 3 um pedaço de rua ou de
   *  clareira sobrevive inteiro dentro do caos, então às vezes dá pra andar, às
   *  vezes não — e é o ÀS VEZES que faz a pessoa olhar em volta antes de dar o
   *  primeiro passo. */
  bloco: 3,
  /** ...e por cima dos pedaços, uma fração de tiles soltos trocados um a um —
   *  a pimenta: é o que põe uma janela de casa no meio do mato. */
  soltos: 0.12,
  /** Quantos esbarrões até uma parede da zona ceder. */
  esbarroes: 6,
  /** Quantos tiles alcançáveis contam como "preso" — abaixo disso o jogo
   *  avisa como se sai, já na chegada. Com o vão debaixo dos pés, preso é não
   *  ter NENHUM vizinho pra dar o passo de fora e voltar: 2 = você e mais um. */
  preso: 2,
};

export const ZONA_TEXTO = {
  /** o nome que sai na faixa: o da fonte, corrompido (ver nomeCorrompido) */
  primeira: [
    "VOCÊ ATRAVESSOU O VÃO.",
    "ISTO É UM LUGAR QUE VOCÊ CONHECE. SÓ QUE NÃO NESTA ORDEM.",
    "OS TILES ESTÃO FORA DO LUGAR. A COLISÃO FOI JUNTO COM ELES.",
  ],
  entrou: ["O CHÃO DESTE LUGAR NÃO CONCORDA COM O DESENHO."],
  preso: [
    "VOCÊ ESTÁ PRESO ENTRE OS TILES.",
    "MAS ESSAS PAREDES NÃO NASCERAM AQUI. INSISTA NELAS.",
  ],
  cedeu: ["A PAREDE DESISTIU DE SER PAREDE."],
  saiu: ["O MUNDO VOLTOU PRA ORDEM DE SEMPRE."],
  /** o que vem antes das entradas aparecerem — a porta não existe ainda */
  fechada: null,
};
