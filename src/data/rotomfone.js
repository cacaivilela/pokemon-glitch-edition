// AS LIGAÇÕES DO ROTOMFONE (src/core/rotomfone.js). Os personagens que você
// conheceu ficam nos CONTATOS (menu START → CONTATOS): dá pra ligar pra eles,
// e de vez em quando ELES ligam pra você enquanto você anda.
//
// Cada contato: `nome`, `retrato` (assets/sprites/trainers/<retrato>.png; os
// dois também podem ser função do save, como o do GÊMEO),
// `tem(st)` = já está nos contatos? e `falas(st)` = o que ele diz agora (uma
// lista de conversas; sorteia uma).
//
// COMO GANHAR CONTATO: ajudando gente. Cada missão de ajudar alguém pode
// trazer um (o TOMÁS do ZEROGLE, src/data/zerogle.js, é o primeiro).
import { CONTATO_TOMAS } from "./zerogle.js";

const insignia = (st, b) => (st.badges || []).includes(b);
const venceuRival = (st) => !!st.npcState?.["lab.rival_lab"]?.defeated;
const brag = (st) => st.regiao === "braglitch" && !!st.flags?.starterChosen;
// o GÊMEO de Braglitch: a skin que você NÃO escolheu (src/data/rival.js, GEMEO)
const gemeo = (st) => (st.player?.genero === "menina" ? "CAIO" : "LARA");

export const ROTOMFONE_TEXTO = {
  titulo: "ROTOMFONE",
  contatos: "CONTATOS",
  nenhum: "NINGUÉM NOS CONTATOS AINDA.",
  ligando: "LIGANDO PRA {NOME}...",
  chamando: "{NOME} ESTÁ LIGANDO!",
  atender: ["ATENDER", "RECUSAR"],
  recusou: "VOCÊ RECUSOU A LIGAÇÃO.",
  desligou: "*CLIQUE* ...{NOME} DESLIGOU.",
  // uma ligação a cada tanto andando (segundos de jogo andando, sem menu nem conversa)
  intervalo: [150, 300],
};

/** A LIGAÇÃO DO MISSINGNO. (pedido do CAIO): na 1ª vez que você PEGA ele, o
 *  CARVALHO liga e manda a foto do PIKACHU SURPRESO (a cara dele agora).
 *  `[imagem]` na fala mostra a foto na tela do ROTOMFONE. */
export const LIGACAO_MISSINGNO = {
  imagem: "assets/sprites/objetos/pikachu_surpreso.png",
  falas: [
    "PROF. CARVALHO: ALÔ?! ALÔ?! A SUA POKÉDEX ME MANDOU UM ALERTA AGORA MESMO...",
    "PROF. CARVALHO: VOCÊ... PEGOU UM MISSINGNO.?! ELE ESTÁ NA SUA EQUIPE?!",
    "[imagem]PROF. CARVALHO: VOU TE MANDAR UMA FOTO DA MINHA CARA AGORA:",
    "[imagem]PROF. CARVALHO: ...",
    "PROF. CARVALHO: TOMA CUIDADO. NEM EU SEI O QUE É ESSA COISA.",
  ],
};

export const CONTATOS = [
  {
    id: "mae", nome: "MÃE", retrato: null,
    tem: () => true,
    falas: () => [
      ["MÃE: OI, MEU AMOR! TÁ COMENDO DIREITO?", "MÃE: NÃO ESQUECE DE CURAR OS SEUS POKÉMON. E DE ESCOVAR OS DENTES."],
      ["MÃE: EU VI VOCÊ NA TV? NÃO? ACHEI QUE ERA VOCÊ.", "MÃE: TÁ BOM, BEIJO! VOLTA PRA JANTAR UM DIA."],
    ],
  },
  {
    id: "carvalho", nome: "PROF. CARVALHO", retrato: "prof",
    tem: (st) => !!st.flags?.starterChosen,
    falas: (st) => [
      ["PROF. CARVALHO: ALÔ? AQUI É O CARVALHO.", `PROF. CARVALHO: QUANTOS POKÉMON VOCÊ JÁ REGISTROU? ${Object.keys(st.caught || {}).length}? CONTINUE ASSIM!`],
      ["PROF. CARVALHO: O MEU NETO ME LIGOU DE NOVO PEDINDO DINHEIRO PRA POKÉBOLA.", "PROF. CARVALHO: SE VOCÊ VIR ELE, DIZ QUE O AVÔ MANDOU ELE TRABALHAR."],
    ],
  },
  {
    id: "rival", nome: "{RIVAL}", retrato: "rival",
    tem: venceuRival,
    falas: (st) => {
      const r = st.flags?.raticateRival || 0;
      // a história do RATICATE dele (RATICATE_DO_RIVAL, src/data/rival.js)
      if (r === 3) return [
        ["{RIVAL}: SABE O QUE O RATICATE FEZ HOJE? ROEU O MEU ROTOMFONE.", "{RIVAL}: ...EU DEIXEI. ELE PODE ROER O QUE QUISER."],
        ["{RIVAL}: TIREI UMA FOTO DO RATICATE DORMINDO. OLHA ESSES DENTES!", "{RIVAL}: É O POKÉMON MAIS BONITO DO MUNDO. NÃO DISCUTE."],
      ];
      if (r >= 1) return [["{RIVAL}: *SNIF* ...LIGUEI ERRADO. DESCULPA.", "{RIVAL}: SE VOCÊ PASSAR NA TORRE POKÉMON... NADA NÃO."]];
      return [
        ["{RIVAL}: SÓ LIGUEI PRA DIZER QUE EU TÔ NA SUA FRENTE.", "{RIVAL}: E O RATICATE ROEU O FIO DO CARREGADOR DE NOVO. DENTUÇO ESQUISITO."],
        ["{RIVAL}: QUAL É O SEU TIME AGORA? NÃO, NÃO FALA. EU NÃO QUERO SABER.", "{RIVAL}: ...TÁ, FALA."],
      ];
    },
  },
  {
    id: "brock", nome: "BROCK", retrato: "brock",
    tem: (st) => insignia(st, "pedra"),
    falas: () => [["BROCK: OI! AQUI É O BROCK. TÔ FAZENDO COMIDA PROS MEUS IRMÃOS.", "BROCK: SE PRECISAR DE UM POKÉMON DE PEDRA, VOCÊ SABE ONDE ME ACHAR."]],
  },
  {
    id: "misty", nome: "MISTY", retrato: "misty",
    tem: (st) => insignia(st, "cascata"),
    falas: () => [["MISTY: VOCÊ VIU UMA BICICLETA VERMELHA POR AÍ? NÃO É NADA. ESQUECE.", "MISTY: TREINA OS SEUS POKÉMON DE ÁGUA, TÁ?"]],
  },
  {
    id: "surge", nome: "TENENTE SURGE", retrato: "surge",
    tem: (st) => insignia(st, "trovao"),
    falas: () => [["TENENTE SURGE: HEY, KID! MEU RAICHU ESTÁ CARREGANDO O MEU ROTOMFONE.", "TENENTE SURGE: CHOQUE GRÁTIS! HAHAHA!"]],
  },
  {
    id: "erika", nome: "ERIKA", retrato: "erika",
    tem: (st) => insignia(st, "arcoiris"),
    falas: () => [["ERIKA: ...ZZZ... AH! DESCULPA, EU COCHILEI COM O ROTOMFONE NA MÃO.", "ERIKA: AS FLORES DE CELADON ESTÃO LINDAS HOJE."]],
  },
  {
    id: "koga", nome: "KOGA", retrato: "koga",
    tem: (st) => insignia(st, "alma"),
    falas: () => [["KOGA: ...", "KOGA: UM NINJA NÃO FALA NO TELEFONE. *CLIQUE*"]],
  },
  {
    id: "sabrina", nome: "SABRINA", retrato: "sabrina",
    tem: (st) => insignia(st, "pantano"),
    falas: () => [["SABRINA: EU SABIA QUE VOCÊ IA ATENDER.", "SABRINA: EU TAMBÉM SEI O QUE VOCÊ VAI FAZER DEPOIS. NÃO CONTO."]],
  },
  {
    id: "blaine", nome: "BLAINE", retrato: "blaine",
    tem: (st) => insignia(st, "vulcao"),
    falas: () => [["BLAINE: CHARADA! O QUE É, O QUE É: TOCA E NÃO É SINO?", "BLAINE: O ROTOMFONE! HAHAHA! QUENTE, QUENTE!"]],
  },
  // ---- BRAGLITCH: quem começou lá (st.regiao === "braglitch") e já escolheu o inicial
  {
    id: "ipe", nome: "PROF. IPÊ", retrato: null,
    tem: (st) => brag(st),
    falas: () => [
      ["PROF. IPÊ: ALÔ! AQUI É A IPÊ, DO LABORATÓRIO DE SÃO LUCARIO.", "PROF. IPÊ: JÁ VISITOU AS ILHAS? CADA UMA TEM UM SEGREDO. VAI LÁ!"],
      ["PROF. IPÊ: O CARVALHO ME LIGOU DE NOVO PRA PERGUNTAR DE VOCÊ.", "PROF. IPÊ: EU DISSE QUE VOCÊ ESTÁ INDO MUITO BEM. NÃO ME FAZ PASSAR VERGONHA!"],
    ],
  },
  {
    id: "gemeo", nome: (st) => gemeo(st), retrato: (st) => (gemeo(st) === "CAIO" ? "hero_brag" : "heroina_brag"),
    tem: (st) => brag(st),
    falas: (st) => [
      [`${gemeo(st)}: OI! SÓ LIGUEI PRA DIZER QUE EU TÔ NA SUA FRENTE NAS INSÍGNIAS.`, `${gemeo(st)}: ...TÁ BOM, NÃO TÔ. MAS VOU FICAR!`],
      [`${gemeo(st)}: A MÃE PERGUNTOU SE A GENTE ESTÁ COMENDO DIREITO.`, `${gemeo(st)}: EU DISSE QUE SIM. NÃO ME DESMENTE.`],
    ],
  },
  {
    id: "vitor", nome: "VÍTOR", retrato: "vitor",
    tem: (st) => brag(st),
    falas: () => [
      ["VÍTOR: OI! ESTOU TE LIGANDO DE UM ROTOMFONE QUE EU MESMO MONTEI.", "VÍTOR: O ROTOM NÃO GOSTOU MUITO. ELE FICA DANDO CHOQUE NA MINHA ORELHA... AI!"],
      ["VÍTOR: O CATECHU SOLTOU CHOQUE PELA ANTENA DE NOVO E QUEIMOU A TORRADEIRA.", "VÍTOR: AGORA ELA FAZ TORRADA EM 1 SEGUNDO. ACHO QUE MELHOROU."],
      ["VÍTOR: O APPLIN ESTÁ BEM. NÃO EVOLUIU. EU ESTOU DE OLHO.", "VÍTOR: SE ELE EVOLUIR ELE SAI DA MAÇÃ. AÍ NÃO É MAIS O APPLIN."],
    ],
  },
  {
    id: "andre", nome: "ANDRÉ", retrato: "andre",
    tem: (st) => brag(st),
    falas: () => [
      ["ANDRÉ: FALA! VOCÊ VIU O JOGO ONTEM? NÃO? DEIXA PRA LÁ.", "[pensa:cinderace]ANDRÉ: O COELHO ARTILHEIRO FEZ TRÊS GOLS NO QUINTAL HOJE!"],
      ["[pensa:dragonite]ANDRÉ: O MEU CHARIZARD APRENDEU A VOAR DE COSTAS!", "ANDRÉ: O VÍTOR DISSE QUE NÃO É CHARIZARD. O VÍTOR NÃO ENTENDE NADA DE CHARIZARD."],
      ["[pensa:dratini]ANDRÉ: A MINHOCA AZUL ENROLOU NA MINHA CHUTEIRA E NÃO SOLTA.", "ANDRÉ: VOU JOGAR ASSIM MESMO. CHUTEIRA COM MINHOCA. VAI SER MODA."],
    ],
  },
  CONTATO_TOMAS,
];
