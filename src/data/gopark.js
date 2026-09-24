// O GO PARK: a ponte entre este jogo e o POKÉMON GO.
//
// O QUE NÃO EXISTE, pra ninguém se iludir: mandar um Pokémon PARA DENTRO do
// POKÉMON GO. O GO é um serviço fechado — não tem save no aparelho, não tem
// importação, e o bicho só passa a existir dentro do servidor da Niantic. Nem
// o POKÉMON HOME consegue: o GO Transporter só anda no sentido GO → HOME. O GO
// PARK do LET'S GO também é mão única (GO → LET'S GO, e não volta). Qualquer
// coisa que prometa o contrário está forjando tráfego pra sua conta, e conta
// forjada é conta derrubada.
//
// O QUE EXISTE AQUI, e que é o mesmo fluxo do LET'S GO com os dois sentidos
// que dá pra ter de verdade:
//
//   ENTRA  ← do POKÉMON GO: você traz os SEUS dados do GO (o arquivo que a
//            Niantic te manda quando você pede a sua cópia, ou um CSV/JSON que
//            você mesmo montou olhando a tela) e eles viram Pokémon de verdade
//            soltos no parque. O leitor é tolerante a formato e descobre o
//            nível pelo CP — é a conta do GO ao contrário. Nada de senha ou
//            token: o que lê a sua conta no seu lugar é o que derruba a conta.
//   ENTRA  ← da BOX: qualquer um capturado neste jogo, esteja na equipe ou
//            esquecido na box 7, pode ir morar no parque.
//   SAI    → o CARTÃO: um PNG no estilo da tela do GO, com o CP calculado pela
//            fórmula de lá, e um QR no rodapé que é o Pokémon inteiro. Outro
//            save deste jogo lê esse QR e o bicho chega no parque de lá.
//   FICA   → o parque, como o do LET'S GO: quem está lá anda solto e volta pra
//            equipe se você capturar no estilo do GO — o círculo que encolhe e
//            o arremesso na hora certa. E o GO PLACE, onde cada morador libera
//            um minijogo escolhido pelo tipo dele.
//
// O complexo tem CINCO parques de VINTE. As regras estão em
// src/systems/gopark.js, o QR em src/systems/qr.js, a tela em
// src/scenes/gopark.js.

export const GO_PARK = {
  parques: 5,                     // quantos parques tem o complexo
  porParque: 20,                  // quantos cabem em cada um (é o número do LET'S GO)
  arremessos: 5,                  // tentativas de captura por visita, por Pokémon
  nivelMax: 50,                   // o GO vai até o 50 (51 com os bônus, mas não aqui)
};

/** O nome de cada parque, antes de o jogador renomear. */
export const GO_PARQUE_NOME = "PARQUE {N}";

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
    "OI! AQUI É O GO PARK COMPLEX DA ZONA SAFÁRI. SÃO {P} PARQUES DE {V}.",
    "DAQUI VOCÊ MANDA UM POKÉMON PRO GO E LEVA O CARTÃO DELE. E TRAZ DE VOLTA O QUE ESTÁ NO GO — O SEU, DE VERDADE.",
  ],
  menu: "O QUE VOCÊ QUER FAZER?",
  opcoes: ["ENVIAR PRO GO", "PUXAR DO GO", "ENTRAR NO PARQUE", "COMO FUNCIONA", "NADA"],
  explica: [
    "ENVIAR PRO GO: escolhe um da EQUIPE OU DA BOX. Ele vira um cartão com o CP calculado do jeito do GO — os atributos daqui viram ATK, DEF e STA de lá — e o cartão baixa como imagem, com um QR no rodapé.",
    "ESSE QR É O POKÉMON INTEIRO. Outro save deste jogo aponta o PUXAR DO GO pro cartão e o bicho chega no parque de lá. É assim que ele viaja.",
    "PUXAR DO GO: eu leio os SEUS DADOS DO POKÉMON GO. Serve o arquivo que a Niantic te manda quando você pede a sua cópia, ou uma tabela que você mesmo montou olhando a tela. Eu acho as colunas sozinha.",
    "SE VOCÊ SÓ TEM O CP NA TELA, TAMBÉM DÁ: com a espécie e o CP eu descubro o nível — é a conta do GO ao contrário. As três barras da avaliação deixam mais exato.",
    "O QUE EU NÃO FAÇO É PEDIR A SUA SENHA DO GO. Quem se oferece pra entrar na sua conta e tirar os bichos de lá derruba a sua conta. Aqui é arquivo seu, lido aqui dentro, e pronto.",
    "E O CAMINHO DE VOLTA PRO APP DO GO NÃO EXISTE, NEM PRA MIM NEM PRA NINGUÉM: o GO não recebe Pokémon de lugar nenhum, nem do POKÉMON HOME. O cartão é o que sai daqui.",
    "NO PARQUE: quem está lá anda solto e volta pra equipe se você capturar no estilo do GO — o círculo encolhe, e o arremesso na hora certa é o que segura.",
    "E O GO PLACE: cada um que está no parque libera um minijogo. Corrida, mergulho, faísca, dancinha, sussurro — o tipo dele escolhe. Paga em doce e poeira estelar.",
  ],
  escolher: "QUEM VAI PRO GO?",
  ultimo: "É O SEU ÚNICO POKÉMON. MANDA ELE PRO GO E VOCÊ FICA SEM NINGUÉM.",
  cheio: "O COMPLEXO TÁ LOTADO: {N} POKÉMON NOS {P} PARQUES. CAPTURA ALGUM DE VOLTA PRIMEIRO.",
  enviado: ["{MON} FOI PRO GO! CP {CP}.", "O CARTÃO BAIXOU: {ARQUIVO}. E ELE JÁ ESTÁ NO {PARQUE}."],
  vazio: "O COMPLEXO ESTÁ VAZIO. MANDA ALGUÉM PRO GO OU PUXA OS SEUS DE LÁ.",
  nada: "TÁ BOM. O PARQUE FICA AÍ.",

  // de onde sai quem vai pro GO
  origem: "DE ONDE?",
  origemOpcoes: ["DA EQUIPE", "DA BOX", "VOLTAR"],
  boxVazia: "NÃO TEM NINGUÉM GUARDADO NO PC.",

  // puxar do GO
  puxarMenu: "DE ONDE EU LEIO?",
  puxarOpcoes: ["ARQUIVO DO GO", "FOTO DE UM CARTÃO", "DIGITAR NA MÃO", "VOLTAR"],
  puxarArquivo: "ME PASSA O ARQUIVO: JSON OU CSV, DO JEITO QUE VEIO.",
  puxarImagem: "ME PASSA A IMAGEM DO CARTÃO — EU LEIO O QR.",
  lendo: "DEIXA EU VER ISSO...",
  puxouUm: ["{MON} CHEGOU DO GO! CP {CP}.", "ELE ESTÁ SOLTO NO {PARQUE}. VAI LÁ PEGAR."],
  puxouVarios: ["CHEGARAM {N} DO GO!", "ESTÃO SOLTOS NO COMPLEXO. VAI LÁ PEGAR."],
  puxouParcial: "COUBERAM {N}. OS OUTROS {F} FICARAM DE FORA: O COMPLEXO ENCHEU.",
  nivelEstimado: "SEM O NÍVEL NO ARQUIVO, EU TIREI DO CP. PODE DAR MEIO NÍVEL DE DIFERENÇA.",
  erroQR: "NÃO CONSEGUI LER O QR DESSA IMAGEM. TENTA UMA FOTO MAIS RETA E SEM SOMBRA.",
  erroCartao: "ESSE CARTÃO ESTÁ ESTRAGADO — A CONFERÊNCIA NÃO BATEU. NÃO VOU INVENTAR UM POKÉMON PRA VOCÊ.",
  erroFormato: "NÃO ACHEI POKÉMON NENHUM NESSE ARQUIVO. ELE PRECISA TER UMA LINHA POR POKÉMON, COM O NOME E O CP.",
  erroNenhum: "LI O ARQUIVO MAS NÃO RECONHECI NENHUMA ESPÉCIE. CONFERE SE A COLUNA DO NOME ESTÁ LÁ.",
  avisoSobrou: "NÃO ENTENDI {N}: {L}.",
  cancelou: "DEIXA PRA LÁ.",

  // digitar na mão, olhando a tela do GO
  digitarEspecie: "QUAL POKÉMON? (NOME OU NÚMERO DA POKÉDEX)",
  digitarCP: "E O CP QUE ESTÁ NA TELA?",
  digitarIV: "AS TRÊS BARRAS DA AVALIAÇÃO, DE 0 A 15: ATAQUE.DEFESA.PS — OU PULA COM ENTER.",
  digitarNada: "NÃO CONHEÇO ESSE POKÉMON. TENTA O NÚMERO DA POKÉDEX.",

  // escolher em qual parque entrar
  qualParque: "EM QUAL PARQUE?",
  parqueLinha: "{NOME} ({N}/{V})",
  parqueVazio: "ESSE PARQUE ESTÁ VAZIO.",

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
  chegouDoGO: "{MON} VEIO DO GO. ELE NÃO CONHECE NINGUÉM AQUI.",
  equipe: "{MON} ENTROU NA EQUIPE.",
  box: "{MON} FOI PRO BOX.",
  semVaga: "EQUIPE E BOX CHEIOS. {MON} FICA NO PARQUE POR ENQUANTO.",
  jogoFim: "{JOGO} DE {MON}: {N}/{T}!",
  premio: "VOCÊ GANHOU {POEIRA} DE POEIRA ESTELAR{DOCES}.",
  doces: " E {N} DOCE RARO",
  ja: "JÁ!",
  espere: "ESPERE...",
};
