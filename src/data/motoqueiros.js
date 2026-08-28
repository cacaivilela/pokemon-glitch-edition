// ESPANTAR OS MOTOQUEIROS DA ILHA TRÊS.
//
// Eles ficam em bloco no meio do caminho dizendo "MINHA BICICLETA É MAIS RÁPIDA
// QUE VOCÊ". A fechadura é essa: quem se gaba de ser o mais rápido perde o lugar
// pra quem for mais rápido. Não inventei uma chave nova — usei a que eles mesmos
// anunciam toda vez que alguém encosta.
//
// A CONTA É A VELOCIDADE (o `spe`), e ela é dita EM VOZ ALTA: o motoqueiro fala
// quanto a bicicleta faz, e, quando você chega com alguém devagar, ele fala
// quanto o seu faz. Um enigma que não conta o número que está pedindo não é
// enigma, é sorte — e quem joga aqui tem nove anos.
//
// VALE O MAIS RÁPIDO DA EQUIPE, não o primeiro. Você não precisa reordenar o
// time pra provar uma coisa que já é verdade sobre ele.
//
// FUSÃO ENTRA NA CONTA SOZINHA: a velocidade sai de `mon.stats.spe`, que toda
// criatura tem calculada — fusão da oficina, mega, o que for. Por isso aqui não
// tem lista de espécie nenhuma: velocidade é número, e número não precisa de
// tabela de exceção.
export const MOTOQUEIROS = {
  mapa: "three_island",
  sprite: "motoqueiro",
  flag: "motoqueirosFora",

  /** o que a bicicleta faz. Ganhar EMPATADO não ganha: tem que passar. */
  marca: 100,

  // Três linhas que dizem a regra INTEIRA: que existe uma marca, qual é, quanto
  // o seu faz, e o que fazer com isso. Não tem uma fala "de gabolice" separada
  // porque ela diria as mesmas coisas duas vezes — e dado que não é usado é
  // dado que mente pra quem for ler o arquivo depois.
  devagar: [
    "SAI DA FRENTE!",
    "ESTA BICICLETA FAZ {MARCA}. SEU {MON} FAZ {SPE}.",
    "VOLTA COM ALGUÉM MAIS RÁPIDO QUE ISSO, AÍ EU SAIO.",
  ],
  semTime: ["SAI DA FRENTE! SEM POKÉMON VOCÊ NEM ATRAVESSA."],
  corrida: [
    "{MON} FAZ {SPE}. A BICICLETA FAZ {MARCA}.",
    "OS MOTOQUEIROS OLHAM UM PRO OUTRO.",
    "SAEM PEDALANDO SEM DIZER NADA.",
  ],
  depois: "A ESTRADA FICOU LIVRE.",
};
