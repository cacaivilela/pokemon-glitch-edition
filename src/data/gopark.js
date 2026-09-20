// O GO PARK: a ponte entre este jogo e o POKÉMON GO.
//
// Não existe ponte de verdade — o GO é um serviço fechado, e nenhum jogo põe
// Pokémon numa conta de lá sem a Niantic. O que existe aqui é o que dá pra
// fazer HONESTAMENTE, e que é o que o jogador vê quando faz a transferência:
//   1. ENVIAR PRO GO: o Pokémon sai da equipe e vira um CARTÃO no estilo do GO
//      — com o CP calculado pela fórmula do GO de verdade (os atributos daqui
//      convertidos em ATK/DEF/STA de lá, os IVs, o nível) — que baixa como PNG.
//      Ele passa a morar no GO PARK, na ZONA SAFÁRI.
//   2. O GO PARK, como o do LET'S GO: o que foi "pro GO" anda solto no parque
//      e volta pra equipe se você capturar no estilo do GO — o círculo que
//      encolhe e o arremesso na hora certa.
//   3. O GO PLACE: cada Pokémon que está no parque LIBERA UM MINIJOGO (o tipo
//      dele decide qual), que paga em doce e poeira estelar (dinheiro).
// As regras estão em src/systems/gopark.js; a tela é src/scenes/gopark.js.

export const GO_PARK = {
  vagas: 6,                       // quantos cabem no parque
  arremessos: 5,                  // tentativas de captura por visita, por Pokémon
  nivelMax: 50,                   // o GO vai até o 50 (51 com os bônus, mas não aqui)
};

/** O multiplicador de CP por nível do GO (níveis inteiros, 1 a 50). */
export const CPM = [0,
  0.094, 0.16639787, 0.21573247, 0.25572005, 0.29024988, 0.3210876, 0.34921268, 0.37523559, 0.39956728, 0.42250001,
  0.44310755, 0.46279839, 0.48168495, 0.49985844, 0.51739395, 0.53435433, 0.55079269, 0.56675452, 0.58227891, 0.59740001,
  0.61215729, 0.62656713, 0.64065295, 0.65443563, 0.667934, 0.68116492, 0.69414365, 0.70688421, 0.71939909, 0.7317,
  0.73776948, 0.74378943, 0.74976104, 0.75568551, 0.76156384, 0.76739717, 0.7731865, 0.77893275, 0.78463697, 0.7903,
  0.79530001, 0.8003, 0.8053, 0.81029999, 0.8153, 0.82029999, 0.8253, 0.83029999, 0.8353, 0.84029999,
];

/** Os minijogos do GO PLACE: o tipo primário do Pokémon escolhe a mecânica.
 *  `mec` é uma das cinco que a tela sabe jogar. */
export const MINIJOGOS_GO = {
  corrida:  { nome: "CORRIDA", mec: "mash", texto: "APERTE A BEM RÁPIDO PRA {MON} CHEGAR NA LINHA!", rodadas: 3 },
  mergulho: { nome: "MERGULHO", mec: "timing", texto: "APERTE A QUANDO {MON} ESTIVER EM CIMA DO ALVO!", rodadas: 4 },
  faisca:   { nome: "FAÍSCA", mec: "reacao", texto: "ESPERE O JÁ! E APERTE A — {MON} É RÁPIDO.", rodadas: 4 },
  dancinha: { nome: "DANCINHA", mec: "seq", texto: "REPITA OS PASSOS DE {MON} COM AS SETAS!", rodadas: 3 },
  sussurro: { nome: "SUSSURRO", mec: "memoria", texto: "DECORE O QUE {MON} MOSTROU E REPITA!", rodadas: 3 },
};
export const MINIJOGO_POR_TIPO = {
  NORMAL: "corrida", LUTADOR: "corrida", TERRA: "corrida", PEDRA: "corrida", "AÇO": "corrida",
  "ÁGUA": "mergulho", GELO: "mergulho",
  FOGO: "faisca", "ELÉTRICO": "faisca", "DRAGÃO": "faisca",
  PLANTA: "dancinha", INSETO: "dancinha", VENENO: "dancinha", FADA: "dancinha",
  "PSÍQUICO": "sussurro", FANTASMA: "sussurro", SOMBRIO: "sussurro", VOADOR: "sussurro", GLITCH: "sussurro",
};

/** O que o minijogo paga: poeira estelar vira dinheiro, doce vira DOCE RARO. */
export const PREMIO_GO = { poeiraMax: 900, docesMax: 3 };

export const NPC_GO_PARK = {
  id: "gopark", x: 22, y: 29, sprite: "tecnica", dir: "down", gopark: true,
};

export const GO_TEXTO = {
  oferta: [
    "OI! AQUI É O GO PARK DA ZONA SAFÁRI.",
    "QUEM VAI PRO GO GANHA UM CARTÃO COM O CP DE LÁ E FICA MORANDO NO PARQUE. E QUEM ESTÁ NO PARQUE LIBERA UM MINIJOGO NO GO PLACE.",
  ],
  menu: "O QUE VOCÊ QUER FAZER?",
  opcoes: ["ENVIAR PRO GO", "ENTRAR NO PARQUE", "COMO FUNCIONA", "NADA"],
  explica: [
    "ENVIAR PRO GO: você escolhe um da equipe. Ele vira um cartão com o CP calculado do jeito do GO — os atributos daqui viram ATK, DEF e STA de lá — e o cartão baixa como imagem.",
    "O POKÉMON SAI DA EQUIPE E PASSA A MORAR NO PARQUE. Pra ele voltar, entra no parque e captura no estilo do GO: o círculo encolhe, e o arremesso na hora certa é o que segura.",
    "E O GO PLACE: cada um que está no parque libera um minijogo. Corrida, mergulho, faísca, dancinha, sussurro — o tipo dele escolhe. Paga em doce e poeira estelar.",
  ],
  escolher: "QUEM VAI PRO GO?",
  ultimo: "É O SEU ÚNICO POKÉMON. MANDA ELE PRO GO E VOCÊ FICA SEM NINGUÉM.",
  cheio: "O PARQUE TÁ LOTADO: {N} POKÉMON. CAPTURA ALGUM DE VOLTA PRIMEIRO.",
  enviado: ["{MON} FOI PRO GO! CP {CP}.", "O CARTÃO BAIXOU: {ARQUIVO}. E ELE JÁ ESTÁ NO PARQUE."],
  vazio: "O PARQUE ESTÁ VAZIO. MANDA ALGUÉM PRO GO PRIMEIRO.",
  nada: "TÁ BOM. O PARQUE FICA AÍ.",
  // dentro do parque
  parqueMenu: "GO PARK",
  parqueOpcoes: ["CAPTURAR DE VOLTA", "GO PLACE", "SAIR"],
  quem: "QUEM VOCÊ QUER CAPTURAR?",
  qualJogo: "QUAL MINIJOGO?",
  arremesso: "SEGURE... E SOLTE A QUANDO O CÍRCULO ESTIVER PEQUENO!",
  notas: ["NICE!", "GREAT!", "EXCELLENT!"],
  escapou: "{MON} ESCAPOU DA BOLA!",
  fugiu: "{MON} CORREU PRO FUNDO DO PARQUE. VOLTA OUTRA HORA.",
  pegou: "{MON} VOLTOU PRO SEU LADO!",
  equipe: "{MON} ENTROU NA EQUIPE.",
  box: "{MON} FOI PRO BOX.",
  semVaga: "EQUIPE E BOX CHEIOS. {MON} FICA NO PARQUE POR ENQUANTO.",
  jogoFim: "{JOGO} DE {MON}: {N}/{T}!",
  premio: "VOCÊ GANHOU {POEIRA} DE POEIRA ESTELAR{DOCES}.",
  doces: " E {N} DOCE RARO",
  ja: "JÁ!",
  espere: "ESPERE...",
};
