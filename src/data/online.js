// Funções online: sala, presença, chat, troca e batalha link.
// Tudo aqui tem hot-swap — dá pra mudar uma frase, um emote ou o tempo do balão
// com o jogo aberto, sem ninguém sair da sala.
//
// O servidor é o dev_server.py que já serve o jogo: quem entra pela mesma URL
// entra na mesma sala. Na rede local isso é o IP da máquina que subiu o
// servidor (ele imprime o endereço no terminal ao ligar).

export const ONLINE = {
  /** liga as funções online. Desligado, o jogo é exatamente o de antes. */
  ativo: true,
  /** sala de quem não escolheu nenhuma */
  salaPadrao: "kanto",
  /** manda a posição no máximo a cada tantos segundos (só quando muda) */
  ritmoPos: 0.12,
  /** quanto tempo o balão de fala fica em cima da cabeça */
  balao: 4.0,
  /** um passo do outro jogador leva isso pra ser desenhado (suaviza a rede) */
  suavizacao: 0.14,
  /** convite ignorado por tanto tempo cai sozinho */
  convite: 30,
  /** tamanho máximo do que dá pra digitar no chat */
  maxChat: 40,

  /** Os avisos que o JOGO dá sobre a sala — "FULANO ENTROU", "A CONEXÃO CAIU",
   *  "O SERVIDOR RESPONDEU DE NOVO". Desligados, o canto da tela fica limpo e
   *  só sobra o que veio de gente: o balão de fala em cima da cabeça e a
   *  resposta de quem você chamou. Ligue de volta pra depurar a sala. */
  avisosDoSistema: false,

  /** As barras de sinal.
   *
   *  ELAS SÃO INFORMAÇÃO, NÃO PORTEIRA. `minimoBarras: 0` quer dizer que o
   *  online funciona SEMPRE — e funciona mesmo: este jogo não usa internet
   *  nenhuma. Ele fala com o `dev_server.py`, que pode ser esta máquina ou a do
   *  lado. Dá pra jogar junto com o roteador desligado do mundo, num cabo entre
   *  dois computadores, ou sozinho com as duas abas abertas aqui. Quem quiser a
   *  porteira de volta é só pôr 1 (ou 2, ou 3) aqui — vale na hora, com o jogo
   *  aberto.
   *
   *  A conta é o tempo de ida e volta até o servidor (o mesmo ping que já
   *  mantinha a sala viva): `escala` é o teto de milissegundos de 4, 3, 2 e 1
   *  barra, nessa ordem. O servidor responde um ping em ~0,15ms na própria
   *  máquina, então 4 barras é "mesma máquina ou rede boa". */
  sinal: {
    minimoBarras: 0,         // 0 = nunca bloqueia
    escala: [30, 90, 300, 1500],
    quedasPraCair: 3,        // pings perdidos seguidos = zero barra (só no desenho)
    segundosPraSair: 10,     // conexão morta por tanto tempo encerra troca/batalha
  },

  /** letras do código de sala criada: sem I, O, 0 e 1 (ninguém lê direito) */
  alfabetoSala: "ABCDEFGHJKLMNPQRSTUVWXYZ23456789",
  tamanhoCodigo: 5,
};

/** Frases prontas: dá pra conversar sem soltar as setas. */
export const FRASES = [
  "OI!", "VAMOS TROCAR?", "BORA BATALHAR!", "OBRIGADO!", "ESPERA AÍ",
  "BOA SORTE", "QUE ISSO?!", "TCHAU!",
];

/** Emote em cima da cabeça. O desenho de cada um está em src/systems/online.js. */
export const EMOTES = ["!", "?", "♥", "...", "ZZZ"];

export const ONLINE_TEXTO = {
  semServidor: "O SERVIDOR NÃO RESPONDEU. AS FUNÇÕES ONLINE PRECISAM DELE NO AR.",
  semSinal: "O SINAL ESTÁ ABAIXO DE {MIN} BARRA. AJUSTE EM SRC/DATA/ONLINE.JS.",
  sinalCaiu: "PERDI O SERVIDOR. O QUE ESTAVA ABERTO FOI ENCERRADO.",
  sinalVoltou: "O SERVIDOR RESPONDEU DE NOVO.",
  semRede: "SEM RESPOSTA DO SERVIDOR. ELE ESTÁ NO AR?",
  salaCriada: "SALA {SALA} CRIADA! PASSE O CÓDIGO PRA QUEM VOCÊ QUER NA SALA.",
  salaPrivada: "ELA NÃO APARECE NA LISTA: SÓ ENTRA QUEM SABE O CÓDIGO.",
  salaAberta: "ELA APARECE PRA QUEM PROCURAR SALAS ABERTAS.",
  entrando: "ENTRANDO NA SALA {SALA}...",
  nenhumaSala: "NÃO TEM NENHUMA SALA ABERTA AGORA. CRIE A SUA.",
  procurando: "PROCURANDO SALAS...",
  desligado: "AS FUNÇÕES ONLINE ESTÃO DESLIGADAS EM SRC/DATA/ONLINE.JS.",
  entrou: "{NOME} ENTROU NA SALA.",
  saiu: "{NOME} SAIU DA SALA.",
  caiu: "A CONEXÃO CAIU. TENTANDO VOLTAR...",
  voltou: "DE VOLTA À SALA {SALA}.",
  sozinho: "NÃO TEM MAIS NINGUÉM NESTA SALA AINDA.",
  convidou: "VOCÊ CHAMOU {NOME}. ESPERANDO A RESPOSTA...",
  recusou: "{NOME} NÃO QUIS AGORA.",
  ocupado: "{NOME} ESTÁ NO MEIO DE OUTRA COISA.",
  sumiu: "{NOME} SUMIU DA SALA.",

  trocaConvite: "{NOME} QUER TROCAR UM POKÉMON COM VOCÊ.",
  trocaEspera: "ESPERANDO {NOME} ESCOLHER...",
  trocaConfirma: "TROCAR {MEU} POR {SEU}?",
  trocaFeita: "CUIDE BEM DELE!",
  trocaCancelou: "{NOME} DESISTIU DA TROCA.",
  trocaUltimo: "É O ÚNICO POKÉMON QUE VOCÊ TEM. SEM ELE NÃO DÁ PRA ANDAR.",

  batalhaConvite: "{NOME} TE DESAFIOU PRA UMA BATALHA!",
  batalhaEspera: "ESPERANDO {NOME}...",
  batalhaComeca: "A BATALHA CONTRA {NOME} VAI COMEÇAR!",
  batalhaSemTime: "VOCÊ PRECISA DE UM POKÉMON EM PÉ PRA BATALHAR.",
  batalhaGanhou: "VOCÊ VENCEU {NOME}!",
  batalhaPerdeu: "VOCÊ PERDEU PRA {NOME}.",
  batalhaFugiu: "{NOME} DESISTIU DA BATALHA.",
  batalhaNadaVale: "NINGUÉM GANHA XP NEM DINHEIRO NA BATALHA LINK. É SÓ ORGULHO.",
};
