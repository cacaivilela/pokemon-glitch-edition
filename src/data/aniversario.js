// O ANIVERSÁRIO DE QUEM JOGA.
//
// O jogo pergunta a data uma vez (a sua mãe pergunta, em casa, antes de você
// sair pela porta) e guarda no save. No dia, um pacote chega: você escolhe UM
// TIPO e recebe um Pokémon daquele tipo — SHINY, ou com o GOLPE MAIS BOMBADO
// que a espécie dele consegue aprender. As duas coisas não vêm juntas: a
// escolha é o presente.
//
// UMA VEZ POR ANO. O que segura é `flags.aniversario`, que guarda o ANO da
// última entrega — não uma marca de "já ganhou". Marca de já ganhou nunca mais
// deixaria o ano seguinte acontecer.
//
// O RELÓGIO É O DA MÁQUINA, como no dia e noite (src/systems/ciclo.js): quem
// mexer no relógio do computador faz aniversário quando quiser. Num jogo que se
// chama GLITCH EDITION isso não é bug, é atalho — e é o mesmo atalho que os
// jogos de verdade sempre tiveram.

export const ANIVERSARIO = {
  /** Quantos dias depois da data o pacote ainda espera. 0 = só no dia.
   *
   *  Existe porque o dia é UM no ano inteiro: quem passou o próprio
   *  aniversário na escola, no trabalho ou sem computador perderia o presente
   *  por doze meses, e um presente que se perde por não estar em casa não é
   *  presente. Três dias é o suficiente pra um fim de semana passar. */
  janelaDias: 3,

  /** O nível do que vem na caixa: o do seu Pokémon mais forte, preso entre
   *  estes dois. O piso é pra ele não nascer inútil; o teto é pra um presente
   *  de aniversário não substituir a equipe que você levou o jogo inteiro
   *  montando. */
  nivelMinimo: 5,
  nivelMaximo: 50,

  /** O que conta como BOMBADO, em poder de golpe.
   *
   *  O prêmio do golpe procura primeiro o mais forte DOS TIPOS do bicho — o
   *  golpe da casa dele. Só que a tabela de golpes deste jogo é do tamanho da de
   *  Kanto, e tem tipo cujo teto é baixo: o VENENO inteiro para no ÁCIDO (40) e
   *  o INSETO na PICADA (35). Dar isso de aniversário é dar um golpe qualquer
   *  com nome de prêmio. Abaixo deste número, o presente passa pro degrau 2 (o
   *  mais forte do jogo que ele ainda não sabe) — 50 é o teto do tipo mais fraco
   *  que ainda dá pra chamar de golpe. */
  poderMinimo: 50,

  /** GLITCH fica fora da lista de tipos. O único bicho desse tipo é o
   *  MISSINGNO., e ele não é um presente: é o enredo. */
  tiposFora: ["GLITCH"],

  /** O sorteio não encosta em lendário, em forma MEGA, nas fusões que o jogador
   *  desenhou nem no PIKACHU DE BONÉ. Lendário de graça uma vez por ano acaba
   *  com a caçada dos lendários; MEGA e fusão não são espécies que se "ganham",
   *  são estados de uma espécie que você já tem. */
  fora: ["missingno"],
};

export const ANIVERSARIO_TEXTO = {
  // ------------------------------------------------------- a mãe perguntando
  pergunta: [
    "ESPERA! ANTES DE VOCÊ SAIR.",
    "EU FUI PREENCHER A SUA FICHA NO CENTRO POKÉMON E TRAVEI NUM CAMPO.",
    "QUE DIA É O SEU ANIVERSÁRIO, QUERIDO? EU JURO QUE SABIA.",
  ],
  perguntaDeNovo: "E QUANDO É O SEU ANIVERSÁRIO MESMO?",
  guardou: "{DATA}. PRONTO, ANOTADO. AGORA VAI, QUE O PROFESSOR ESTÁ ESPERANDO.",
  depois: [
    "DEIXA PRA LÁ, EU PERGUNTO DEPOIS.",
    "(DÁ PRA ANOTAR NAS OPÇÕES, SE VOCÊ LEMBRAR ANTES DE MIM.)",
  ],
  opcoesPergunta: ["ANOTAR AGORA", "DEIXA PRA DEPOIS"],

  // -------------------------------------------------------------- a escolha
  seletor: "QUANDO VOCÊ FAZ ANIVERSÁRIO?",
  // as duas cabem no painel do seletor: 29 letras cada, no máximo
  seletorAjuda: "CIMA/BAIXO MUDA  LADOS TROCAM",
  seletorAjuda2: "Z ANOTA   X SAI",
  dia: "DIA",
  mes: "MÊS",
  meses: ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN",
          "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"],

  // ---------------------------------------------------------------- o dia
  chegou: [
    "UM PACOTE CHEGOU PRA VOCÊ. NÃO TEM SELO, NÃO TEM REMETENTE, E ESTAVA NA SUA MOCHILA.",
    "DENTRO TEM UMA POKÉ BOLA VAZIA E UM BILHETE DA SUA MÃE:",
    "\"FELIZ ANIVERSÁRIO! ESCOLHA VOCÊ, QUE EU NUNCA SEI O QUE VOCÊ GOSTA.\"",
  ],
  atrasado: [
    "UM PACOTE CHEGOU PRA VOCÊ. ELE ESTÁ AMASSADO DE TANTO ESPERAR NA MOCHILA.",
    "\"FELIZ ANIVERSÁRIO ATRASADO. A BOLA ESPERA, EU NÃO.\"",
  ],
  escolhaTipo: "A BOLA ESTÁ VAZIA E ESPERANDO. DE QUE TIPO?",
  tituloTipo: "ESCOLHA UM TIPO",
  ajudaTipo: "Z ESCOLHE",
  comoQuer: "E COMO VOCÊ QUER ELE?",
  opcoesForma: ["SHINY", "GOLPE BOMBADO"],
  explicaShiny: "A COR RARA. SÓ A COR — MAS É A COR QUE QUASE NINGUÉM VÊ.",
  explicaGolpe: "O GOLPE MAIS FORTE QUE A ESPÉCIE DELE CONSEGUE APRENDER, JÁ APRENDIDO.",

  // ----------------------------------------------------------- a entrega
  abriu: "A BOLA ABRE SOZINHA.",
  recebeu: "FELIZ ANIVERSÁRIO! VOCÊ RECEBEU {MON}, DO TIPO {TIPO}!",
  veioShiny: "E ELE VEIO NA COR RARA. {MON} É SHINY.",
  veioGolpe: "E ELE JÁ SABE {GOLPE}. NO NÍVEL {NIVEL}, ISSO NÃO DEVIA SER POSSÍVEL.",
  foiProBox: "SUA EQUIPE ESTÁ CHEIA: {MON} FOI PRO BOX.",
  semVaga: "NÃO TEM VAGA NA EQUIPE NEM NO BOX. O PACOTE ESPERA VOCÊ ARRUMAR ESPAÇO.",
  proximo: "ATÉ O ANO QUE VEM.",

  // ------------------------------------------------------------- as opções
  rotulo: "ANIVERSÁRIO",
  naoDefinido: "---",
  jaGanhou: "JÁ GANHOU ESTE ANO",
  hoje: "É HOJE!",
  faltam: "FALTAM {DIAS} DIAS",
  amanha: "É AMANHÃ",
};
