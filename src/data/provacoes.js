// AS PROVAÇÕES: como se ganha um CRISTAL Z (a GUARDIÃ fica na ILHA DOIS; as marcas, por Kanto).
//
// Os dezoito cristais de TIPO estavam largados no chão da ILHA DOIS e do CABO
// DA BEIRA (era o que src/data/zcristais.js fazia: dezoito bolas espalhadas).
// Catar dezoito bolas é inventário, não é jogo — e um objeto que multiplica o
// poder de um golpe por três não devia custar o mesmo que uma poção esquecida
// num canto do mapa.
//
// Então a ilha virou outra coisa. Cada lugar onde havia uma bola agora tem uma
// MARCA NO CHÃO, e em cima de cada marca dorme um TOTEM: o mesmo bicho de
// sempre, grande demais, com uma aura que levanta um atributo dele no primeiro
// instante da luta. Derrubar o totem é o que entrega o cristal. É a PROVAÇÃO.
//
// AS TRÊS REGRAS, e por que cada uma existe:
//
//   1. SÓ NO PÓS-JOGO (`flags.caughtMissingno`). Antes disso a marca está no
//      chão e não responde — o mesmo "ainda não" da clareira do CELEBI. Um
//      cristal Z na mão de quem ainda tem duas insígnias não é presente: é o
//      resto do jogo estragado.
//   2. SÓ COM O TIPO NA EQUIPE. A provação de ÁGUA pede alguém de ÁGUA andando
//      com você. Não é burocracia: é a única coisa que faz o jogador olhar a
//      lista inteira de tipos e mexer no time dezoito vezes, que é exatamente o
//      que um cristal de tipo deveria ensinar antes de ser usado.
//   3. O TOTEM NÃO SE PEGA. Bola não funciona nele (src/scenes/battle.js). Ele
//      não é prêmio — é porteiro. O prêmio é o cristal, e ele sai do chão
//      quando o porteiro cai.
//
// ELAS TÊM ORDEM, e a ordem é a da tabela de tipos: NORMAL, LUTADOR, VOADOR,
// VENENO, TERRA, PEDRA, INSETO, FANTASMA, AÇO, FOGO, ÁGUA, PLANTA, ELÉTRICO,
// PSÍQUICO, GELO, DRAGÃO, SOMBRIO, FADA — e GLITCH por último, que não está em
// tabela nenhuma. Cada marca só acorda com a anterior feita, e o nível do totem
// sobe um por marca: é uma escada, não uma lista de compras. A última é
// MISSINGNO. de novo, e sem bola desta vez. O jogo inteiro foi atrás dele uma
// vez; a última provação é descobrir que ele continua lá, e que agora a
// conversa é outra.
//
// Tudo aqui tem hot-swap: dá pra mexer em nível, aura, lugar e fala com o jogo
// aberto. A parte viva está em src/systems/provacoes.js.
import { cristalDoTipo } from "./zcristais.js";

/** O QUE FAZ UM TOTEM SER TOTEM. Os números são os da GLITCH RAID vistos por
 *  baixo (src/data/glitch.js): o chefe da fenda é cinco vezes maior porque tem
 *  uma casca que precisa ser quebrada antes de a luta começar; o totem não tem
 *  casca, então ele é só grande o bastante pra aguentar um time de pós-jogo por
 *  alguns turnos. Inchar mais que isto vira espera, e espera não é dificuldade. */
export const TOTEM = {
  vidas: 2.4,      // o HP dele vezes isto
  forca: 1.15,     // o resto dos atributos vezes isto
  tamanho: 1.35,   // o tamanho na tela (o normal é 1; o da raid, 2.2)
  aura: 1,         // quantos estágios a aura levanta, no primeiro instante
};

/** Os nomes dos atributos, iguais aos que o motor de batalha já escreve
 *  (src/systems/battle-engine.js). Repetidos aqui porque a aura é escrita por
 *  esta pasta, e um segundo nome pro mesmo atributo é um segundo jogo. */
export const NOME_STAT = { atk: "ATAQUE", def: "DEFESA", spa: "ESP.", spd: "ESP.DEF", spe: "VELOCIDADE" };

// OS LUGARES: uma marca em cada canto de KANTO, e não mais na ILHA DOIS (as
// dezoito ficavam a poucos passos umas das outras). Cada uma em chão aberto
// (os oito vizinhos andáveis), longe de porta, placa e gente, no pedaço do mapa
// onde o jogador anda de verdade. `lugar` é o nome que a GUARDIÃ fala.
const LISTA = [
  {
    tipo: "NORMAL", totem: "gumshoos", nivel: 57, aura: "atk",
    mapa: "route1", x: 12, y: 18, lugar: "ROTA 1",
    nome: "A PROVAÇÃO DO COMUM",
    marca: [
      "A PRIMEIRA MARCA FICA NA ROTA 1, ONDE TODO MUNDO PASSA.",
      "O MATO EM VOLTA ESTÁ PISADO EM CÍRCULO, E NÃO FOI GENTE QUE PISOU.",
    ],
    acorda: "ELE ESTAVA PARADO ESSE TEMPO TODO E VOCÊ ACHOU QUE ERA O CHÃO.",
    venceu: "O BICHO MAIS COMUM DA ESTRADA MAIS COMUM ERA O PRIMEIRO PORTÃO. FAZ SENTIDO.",
  },
  {
    tipo: "LUTADOR", totem: "bewear", nivel: 58, aura: "atk",
    mapa: "saffron_city", x: 29, y: 34, lugar: "SAFFRON",
    nome: "A PROVAÇÃO DO ABRAÇO",
    marca: [
      "TEM TRONCO PARTIDO EM VOLTA DESTA MARCA. PARTIDO AO MEIO, NÃO CORTADO.",
      "QUEM PARTIU NÃO USOU FERRAMENTA. USOU OS BRAÇOS.",
    ],
    acorda: "ELE ABRE OS BRAÇOS. NÃO É AMEAÇA: É COMO ELE CUMPRIMENTA.",
    venceu: "ELE TE DÁ UM TAPINHA NO OMBRO QUE QUASE TE DERRUBA. É ELOGIO.",
  },
  {
    tipo: "VOADOR", totem: "toucannon", nivel: 59, aura: "atk",
    mapa: "route16", x: 30, y: 8, lugar: "ROTA 16",
    nome: "A PROVAÇÃO DO BICO",
    marca: [
      "A MARCA ESTÁ NO ALTO, E TODA ÁRVORE EM VOLTA ESTÁ SEM UM GALHO SÓ:",
      "O DE CIMA. ALGUÉM POUSA SEMPRE NO MESMO LUGAR E O GALHO NÃO AGUENTOU.",
    ],
    acorda: "O BICO DELE ACENDE VERMELHO ANTES DE ABRIR. É O CANO ESQUENTANDO.",
    venceu: "ELE SOBE, DÁ UMA VOLTA E SOME. O GALHO DE CIMA VAI CRESCER DE NOVO.",
  },
  {
    tipo: "VENENO", totem: "muk", nivel: 60, aura: "spd",
    mapa: "fuchsia_city", x: 21, y: 20, lugar: "FUCHSIA",
    nome: "A PROVAÇÃO DA POÇA",
    marca: [
      "A MARCA ESTÁ COBERTA POR UMA CAMADA ROXA QUE NÃO É TINTA.",
      "ONDE ELA ENCOSTOU, O CAPIM VIROU PÓ.",
    ],
    acorda: "A CAMADA SE JUNTA NUM MONTE SÓ, E O MONTE ABRE UMA BOCA.",
    venceu: "O ROXO AFUNDA NA TERRA. DAQUI A UM ANO O CAPIM VOLTA.",
  },
  {
    // A DO USUÁRIO, E A MELHOR DA ILHA. Todo mundo que jogou os jogos antigos
    // já se perguntou o que tem embaixo de um DIGLETT, e a resposta oficial
    // nunca veio. Aqui ela vem: o totem está FORA DO BURACO, inteiro, de corpo
    // presente — e o que se vê não devia estar em nenhuma pokédex.
    //
    // A piada só funciona se o jogo levar a sério. Por isso ele não é um
    // DIGLETT engraçadinho com pernas: é um DIGLETT que saiu, e sair é a coisa
    // mais assustadora que ele podia ter feito.
    tipo: "TERRA", totem: "diglett", nivel: 61, aura: "spe", vidas: 5,
    mapa: "route11", x: 39, y: 10, lugar: "ROTA 11",
    nome: "A PROVAÇÃO DO BURACO VAZIO",
    marca: [
      "ESTA MARCA É UM BURACO. UM BURACO DE DIGLETT, DESSES QUE TEM AOS MILHARES.",
      "SÓ QUE ESTE ESTÁ VAZIO — E OS BURACOS DE DIGLETT NUNCA ESTÃO VAZIOS.",
      "TEM UMA SOMBRA COMPRIDA SAINDO DELE. COMPRIDA DEMAIS PRA CABER LÁ DENTRO.",
    ],
    acorda: "O TOTEM DIGLETT ESTÁ FORA DA TERRA. INTEIRO. DE CORPO PRESENTE.",
    acordaExtra: [
      "NINGUÉM NESTE MUNDO TINHA VISTO UM DIGLETT DA CABEÇA PRA BAIXO.",
      "AGORA VOCÊ VIU. E VOCÊ NÃO VAI CONSEGUIR EXPLICAR PRA NINGUÉM O QUE É.",
    ],
    venceu: "ELE VOLTA PRO BURACO. VOCÊ NUNCA MAIS VAI PISAR NUM SEM PENSAR NISSO.",
  },
  {
    tipo: "PEDRA", totem: "lycanroc", nivel: 62, aura: "spe",
    mapa: "pewter_city", x: 24, y: 17, lugar: "PEWTER",
    nome: "A PROVAÇÃO DA ROCHA",
    marca: [
      "AS PEDRAS DESTA MARCA ESTÃO EM PÉ, EM VOLTA, COMO DENTES.",
      "NENHUMA CAIU ATÉ HOJE. VENTO NENHUM CONSEGUIU.",
    ],
    acorda: "UMA DAS PEDRAS SACODE A POEIRA E ERA UM BICHO O TEMPO TODO.",
    venceu: "AS PEDRAS CONTINUAM DE PÉ. AGORA ELAS SÃO SÓ PEDRAS.",
  },
  {
    tipo: "INSETO", totem: "vikavolt", nivel: 63, aura: "spa",
    mapa: "route2", x: 17, y: 49, lugar: "ROTA 2",
    nome: "A PROVAÇÃO DO ZUMBIDO",
    marca: [
      "O ZUMBIDO AQUI NÃO É DE INSETO PEQUENO. É GRAVE, COMO MOTOR PARADO.",
      "ELE VEM DE CIMA, E NÃO TEM NADA EM CIMA.",
    ],
    acorda: "A COISA DESCE DEVAGAR, DE LADO, COMO QUEM ESTACIONA.",
    venceu: "O ZUMBIDO SOBE E VAI EMBORA POR CIMA DAS ÁRVORES.",
  },
  {
    tipo: "FANTASMA", totem: "mimikyu", nivel: 64, aura: "atk",
    mapa: "lavender_town", x: 15, y: 14, lugar: "LAVENDER",
    nome: "A PROVAÇÃO DO PANO",
    marca: [
      "TEM UM PANO VELHO JOGADO EM CIMA DESTA MARCA, COM UM DESENHO MAL FEITO.",
      "É UM DESENHO DE PIKACHU. FEITO POR QUEM NUNCA VIU UM.",
    ],
    acorda: "O PANO SE LEVANTA SOZINHO. NÃO OLHE O QUE ESTÁ EMBAIXO DELE.",
    venceu: "O PANO CAI NO CHÃO, VAZIO. VOCÊ NÃO OLHOU. FOI A DECISÃO CERTA.",
  },
  {
    tipo: "AÇO", totem: "celesteela", nivel: 65, aura: "def",
    mapa: "vermilion_city", x: 24, y: 17, lugar: "VERMILION",
    nome: "A PROVAÇÃO DO FERRO",
    marca: [
      "A MARCA ESTÁ NO FUNDO DE UMA CRATERA QUE NINGUÉM VIU ABRIR.",
      "O CHÃO AQUI ESTÁ VITRIFICADO, COMO SE ALGO TIVESSE POUSADO QUENTE.",
    ],
    acorda: "OS DOIS TUBOS ACENDEM. AQUILO NÃO POUSOU AQUI: AQUILO MORA AQUI.",
    venceu: "OS TUBOS APAGAM. A CRATERA VAI CONTINUAR SENDO UMA CRATERA.",
  },
  {
    tipo: "FOGO", totem: "salazzle", nivel: 66, aura: "spe",
    mapa: "route8", x: 35, y: 11, lugar: "ROTA 8",
    nome: "A PROVAÇÃO DA FUMAÇA",
    marca: [
      "A PEDRA DESTA MARCA ESTÁ QUENTE E NÃO TEM SOL EM CIMA DELA.",
      "O AR POR AQUI TEM CHEIRO DOCE. É ESSE O AVISO — E CHEGA TARDE.",
    ],
    acorda: "A FUMAÇA SOBE DA MARCA INTEIRA E ELA SAI DE DENTRO DA FUMAÇA.",
    venceu: "O CHEIRO DOCE SOME. DÁ PRA RESPIRAR DE NOVO.",
  },
  {
    tipo: "ÁGUA", totem: "araquanid", nivel: 67, aura: "def",
    mapa: "cerulean_city", x: 24, y: 23, lugar: "CERULEAN",
    nome: "A PROVAÇÃO DA BOLHA",
    marca: [
      "TEM UMA POÇA EM CIMA DA MARCA QUE NÃO SECA NEM NO MEIO DO DIA.",
      "ELA NÃO ESCORRE PRA LUGAR NENHUM. ELA ESTÁ ESPERANDO.",
    ],
    acorda: "A BOLHA NA CABEÇA DELE É MAIOR QUE VOCÊ. ELA É O ESCUDO E É A ARMA.",
    venceu: "A POÇA ESCORRE MORRO ABAIXO, FINALMENTE.",
  },
  {
    tipo: "PLANTA", totem: "lurantis", nivel: 68, aura: "spa",
    mapa: "celadon_city", x: 30, y: 15, lugar: "CELADON",
    nome: "A PROVAÇÃO DA FLOR",
    marca: [
      "AS FLORES EM VOLTA DESTA MARCA ESTÃO TODAS VIRADAS PRO MESMO PONTO.",
      "E O PONTO NÃO É O SOL.",
    ],
    acorda: "UMA DAS FLORES SE LEVANTA. AS OUTRAS ERAM ENFEITE DELA.",
    venceu: "AS FLORES VOLTAM A OLHAR PRO SOL, COMO FLOR DEVE FAZER.",
  },
  {
    tipo: "ELÉTRICO", totem: "togedemaru", nivel: 69, aura: "spe",
    mapa: "route10", x: 13, y: 28, lugar: "ROTA 10",
    nome: "A PROVAÇÃO DO ESPINHO",
    marca: [
      "OS PELOS DO SEU BRAÇO LEVANTAM QUANDO VOCÊ PISA AQUI.",
      "TEM UM ESTALO BAIXINHO EMBAIXO DA TERRA, NO RITMO DE UM CORAÇÃO.",
    ],
    acorda: "UMA BOLA DE ESPINHOS ROLA PRA FORA DA MARCA E PARA DE PÉ.",
    venceu: "O ESTALO PARA. O SILÊNCIO DEPOIS DELE É ALTO.",
  },
  {
    tipo: "PSÍQUICO", totem: "oranguru", nivel: 70, aura: "spa",
    mapa: "route5", x: 30, y: 20, lugar: "ROTA 5",
    nome: "A PROVAÇÃO DO SÁBIO",
    marca: [
      "TEM UM LUGAR DE SENTAR CAVADO NA PEDRA DESTA MARCA, GASTO DE TANTO USO.",
      "QUEM SENTA AQUI SENTA HÁ MUITO TEMPO, E SENTA OLHANDO PRA ESTA TRILHA.",
    ],
    acorda: "ELE NÃO SE LEVANTA PRA LUTAR. ELE CONTINUA SENTADO — E COMEÇA.",
    venceu: "ELE FAZ QUE SIM COM A CABEÇA. UMA VEZ SÓ, E VOLTA A OLHAR A TRILHA.",
  },
  {
    tipo: "GELO", totem: "beartic", nivel: 71, aura: "def",
    mapa: "route15", x: 38, y: 11, lugar: "ROTA 15",
    nome: "A PROVAÇÃO DO SOPRO",
    marca: [
      "NUMA ROTA DESTE CALOR, ESTA MARCA ESTÁ COBERTA DE GELO.",
      "O GELO NÃO DERRETE. ELE É MANTIDO ASSIM POR ALGUÉM QUE ESTÁ RESPIRANDO.",
    ],
    acorda: "O QUE VOCÊ ACHOU QUE ERA UM MONTE DE NEVE ABRE OS OLHOS.",
    venceu: "A ÚLTIMA PLACA DE GELO RACHA E VIRA ÁGUA NA HORA.",
  },
  {
    // A DO DRAGÃO, que não existia: DRAGÃO era o único tipo sem cristal Z, e
    // por isso o único sem marca. Agora tem as duas coisas. A marca fica na
    // ROTA 23, no caminho da VICTORY ROAD — o último trecho antes da LIGA, onde
    // mora o campeão dos dragões.
    tipo: "DRAGÃO", totem: "dragapult", nivel: 72, aura: "spe",
    mapa: "route23", x: 15, y: 76, lugar: "ROTA 23",
    nome: "A PROVAÇÃO DO DISPARO",
    marca: [
      "O CAPIM EM VOLTA DESTA MARCA ESTÁ DEITADO EM LINHA RETA, TUDO PRO MESMO LADO.",
      "COMO SE ALGUMA COISA TIVESSE PASSADO RASPANDO O CHÃO, RÁPIDO DEMAIS PRA VER.",
    ],
    acorda: "ELE NÃO APARECE: ELE CHEGA. E OS DOIS DREEPY NOS CHIFRES JÁ ESTÃO MIRANDO EM VOCÊ.",
    venceu: "OS DREEPY VOLTAM PRO LUGAR DELES. O CAPIM LEVANTA DEVAGAR.",
    premioTexto: "O DRACONINUM Z É SEU: O CRISTAL DO ÚNICO TIPO QUE AINDA NÃO TINHA UM.",
  },
  {
    tipo: "SOMBRIO", totem: "guzzlord", nivel: 73, aura: "def",
    mapa: "route9", x: 34, y: 12, lugar: "ROTA 9",
    nome: "A PROVAÇÃO DA FOME",
    marca: [
      "EM VOLTA DESTA MARCA NÃO TEM MATO, NEM PEDRA, NEM TERRA BOA.",
      "NÃO É CHÃO RUIM: É CHÃO COMIDO. ALGUÉM COMEU O LUGAR.",
    ],
    acorda: "A BOCA CHEGA ANTES DO RESTO DO CORPO. O RESTO DO CORPO NÃO ACABA.",
    venceu: "ELE PARA DE COMER. POR ENQUANTO.",
  },
  {
    tipo: "FADA", totem: "ribombee", nivel: 74, aura: "spe",
    mapa: "route3", x: 43, y: 10, lugar: "ROTA 3",
    nome: "A PROVAÇÃO DO PÓ",
    marca: [
      "TEM PÓ AMARELO PARADO NO AR EM CIMA DESTA MARCA. PARADO, NÃO CAINDO.",
      "QUEM RESPIRA DEMAIS AQUI DORME ONDE ESTÁ. TEM GENTE QUE DORMIU DIAS.",
    ],
    acorda: "O PÓ SE JUNTA E VIRA ALGUÉM DO TAMANHO DA SUA MÃO. É O BASTANTE.",
    venceu: "O PÓ CAI TODO DE UMA VEZ. O AR FICA LIMPO E SEM GRAÇA.",
  },
  {
    // A ÚLTIMA DA FILA. Ela só acende com as outras dezoito feitas.
    tipo: "GLITCH", totem: "missingno", nivel: 75, aura: "atk",
    mapa: "viridian", x: 23, y: 21, lugar: "VIRIDIAN",
    nome: "A PROVAÇÃO QUE NÃO DEVIA EXISTIR",
    marca: [
      "ESTA MARCA NÃO ESTÁ DESENHADA NO CHÃO. ELA ESTÁ DESENHADA NA TELA.",
      "É EM VIRIDIAN, ONDE O VELHO ENSINA A PEGAR POKÉMON. FOI AQUI QUE TODO MUNDO COMEÇOU A ACHAR ELE.",
      "OS PIXELS DELA NÃO SE MEXEM QUANDO VOCÊ ANDA. O RESTO DO MUNDO SE MEXE.",
      "AS OUTRAS DEZOITO ERAM PRA VOCÊ CHEGAR AQUI SABENDO O QUE FAZER.",
    ],
    acorda: "É ELE DE NOVO. VOCÊ JÁ PEGOU UM. ESTE NÃO É PRA PEGAR.",
    acordaExtra: [
      "NÃO TEM BOLA QUE SIRVA E NÃO TEM POKÉDEX QUE REGISTRE.",
      "SÓ TEM A LUTA. É A ÚNICA COISA QUE ELE SEMPRE SOUBE FAZER DIREITO.",
    ],
    venceu: "A MARCA SE APAGA DA TELA, LINHA POR LINHA. NÃO SOBROU MARCA EM KANTO.",
    // o único cristal com nome próprio (src/data/zcristais.js), então a fala
    // genérica — "O CRISTAL Z DE GLITCH É SEU" — não serve pra ele
    premioTexto: "O GLITCHINIUM É SEU: O CRISTAL DE UM TIPO QUE NÃO DEVIA TER UM.",
  },

];

/** As dezenove, NA ORDEM em que se fazem, com o item do cristal colado em cada uma: quem diz qual cristal
 *  é o de cada tipo continua sendo src/data/zcristais.js — aqui só se pergunta.
 *  `id` é a chave no save (`state.provacoes`). */
export const PROVACOES = LISTA.map((p) => ({
  ...p,
  id: `prov_${p.tipo.toLowerCase().normalize("NFD").replace(/[^a-z]/g, "")}`,
  item: cristalDoTipo(p.tipo)?.item || null,
}));

/** A provação daquele tipo, ou null. */
export const provacaoDoTipo = (tipo) => PROVACOES.find((p) => p.tipo === tipo) || null;

/** A GUARDIÃ DAS PROVAÇÕES. Ela fica na subida do porto da ILHA DOIS, onde
 *  as dezoito marcas ficavam — e elas ficavam perto demais: dava pra fazer as
 *  dezoito numa tarde, sem sair da ilha. Agora é ela quem ESPALHA as marcas por
 *  Kanto, na primeira vez que alguém fala com ela no pós-jogo
 *  (`flags.provacoesEspalhadas`). Antes dessa conversa não tem marca em lugar
 *  nenhum; depois, tem uma em cada canto do mapa, e ela é o placar que diz onde
 *  falta ir. */
export const GUARDIA = { mapa: "two_island", x: 11, y: 6, sprite: "velha", dir: "down" };

export const PROVACOES_TEXTO = {
  // a GUARDIÃ, no caminho do porto — a primeira conversa, que espalha tudo
  guardia: [
    "ESTA ILHA JÁ FOI A ILHA DAS PROVAÇÕES. UMA MARCA PRA CADA TIPO, E MAIS UMA.",
    "SÓ QUE ELAS ESTAVAM PERTO DEMAIS. QUEM VINHA, FAZIA TUDO NUMA TARDE.",
    "ENTÃO EU MANDEI AS MARCAS EMBORA. AGORA TEM UMA EM CADA CANTO DE KANTO.",
    "EM CIMA DE CADA MARCA DORME UM TOTEM. DERRUBE O TOTEM, LEVE O CRISTAL.",
    "E ELAS TÊM ORDEM: NORMAL PRIMEIRO, GLITCH POR ÚLTIMO. UMA SÓ ACORDA DEPOIS DA OUTRA.",
  ],
  espalhou: "...PRONTO. OLHE O MAPA: ELAS JÁ ESTÃO LÁ.",
  // as outras conversas
  denovo: "AS MARCAS ESTÃO ESPALHADAS POR KANTO. EU SÓ CUIDO DA CONTA.",
  regra: [
    "UMA REGRA SÓ: A MARCA SÓ ACORDA PRA QUEM CHEGA COM O TIPO DELA NA EQUIPE.",
    "O CRISTAL DE ÁGUA É DE QUEM ANDA COM ÁGUA. ELE NÃO SERVE PRA MAIS NINGUÉM.",
  ],
  proxima: "A PRÓXIMA É A DE {TIPO}, EM {LUGAR}.",
  depois: "DEPOIS DELA: {LISTA}.",
  ultima: "SÓ FALTA A ÚLTIMA, A DE GLITCH, EM {LUGAR}. BOA SORTE COM ELA.",
  todas: [
    "DEZENOVE. NENHUMA MARCA ACESA EM KANTO INTEIRO.",
    "EU CUIDO DISSO HÁ TRINTA ANOS E VOCÊ É O SEGUNDO. NÃO PERGUNTE DO PRIMEIRO.",
  ],
  fechada: "A MARCA ESTÁ FRIA. O QUE DORME NELA AINDA NÃO TEM MOTIVO PRA ACORDAR.",
  semTipo: "A MARCA NÃO RESPONDE: FALTA ALGUÉM DE {TIPO} ANDANDO COM VOCÊ.",
  travada: "A MARCA NÃO ACORDA AINDA. ANTES DELA VEM A DE {TIPO}, EM {LUGAR}.",
  pergunta: "ACORDAR O TOTEM DE {TIPO}?",
  opcoes: ["ENFRENTAR", "AINDA NÃO"],
  recusa: "A MARCA ESFRIA DE NOVO. ELA ESPERA — É O QUE ELA SABE FAZER.",
  apareceu: "O TOTEM {MON} SE LEVANTA!",
  aura: "A AURA DO TOTEM SOBE! {STAT} DE {MON} AUMENTOU!",
  fuga: "A MARCA ACENDEU E FECHOU O CÍRCULO. DAQUI SÓ SE SAI PELO FIM.",
  semBola: "A BOLA BATE NELE E VOLTA PRA SUA MÃO. O TOTEM NÃO É PRÊMIO.",
  premio: "A MARCA SE APAGA. O CRISTAL Z DE {TIPO} É SEU!",
  comoUsa: "APERTE Q NA BATALHA E ESCOLHA UM GOLPE DESSE TIPO.",
  contagem: "PROVAÇÕES: {N} DE {T}.",
};
