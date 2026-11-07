// OS EVENTOS: coisas que só acontecem em certos dias do ano.
//
// Cada evento tem um COMEÇO e um FIM (dia e mês, dos dois incluídos) e repete
// todo ano. O relógio é o da máquina, igual ao do aniversário
// (src/data/aniversario.js). Se o fim vier antes do começo (31/12 a 02/01),
// o evento vira o ano.
//
// As RAIDS DE EVENTO são GLITCH RAIDS paradas num lugar fixo do mapa, com o
// bicho escolhido, o nível fixo e — quase sempre — SHINY FIXO. Cada uma se pega
// UMA VEZ por ano: o que segura é `flags.eventos[<evento>_<raid>]`, que guarda o
// ANO em que foi pega (igual ao `flags.aniversario`).
//
// PRA FAZER UM EVENTO NOVO: copiar um de baixo, mudar o `id`, o nome, as
// datas, o mapa, os bichos e os lugares (x, y num chão livre, longe de porta).
// `textos` só precisa ter o que for diferente de TEXTOS_EVENTO.
//
// Um evento pode ter mais de uma época: `janelas: [{ de, ate }, ...]` no lugar
// de `de`/`ate`. E `ultra: true` faz ele virar um evento de ULTRA RAIDS:
// enquanto ele está aberto, todo rasgo que abre no mapa é um ULTRA BURACO, e o
// que sai dele é uma ultra beast (ULTRA_BEASTS, aqui embaixo) — e as raids
// fixas dele também são ULTRA RAIDS.

export const EVENTOS = [
  // (o TERROR ALFA, todo selvagem alfa, durou só um pedaço de 03/nov/2026: o
  // CAIO pediu pra tirar — "quase morri 7x". `alfaTodos` ainda funciona em
  // src/systems/encounters.js, se um dia voltar)
  // (a SEMANA DO SHINY — 1 em 10 shiny, a bola que quase sempre pega e o
  // luminoso a cada 10 — foi tirada a pedido do CAIO em 03/nov/2026, junto com
  // a chegada dos SURTOS EM MASSA. `shinyOdds`, `pegaShiny` e `lumiACada` ainda
  // funcionam se um evento novo trouxer)
  {
    id: "bug_de_halloween",
    nome: "BUG DE HALLOWEEN",
    // começa em 26/10, o dia em que o CAIO fez 10 anos
    de: { dia: 26, mes: 10 },
    ate: { dia: 31, mes: 10 },
    raids: [
      // no CENTRO DE LUMIOSE, um de cada lado da TORRE PRISMA, embaixo dela
      { id: "koraidon", mapa: "lumiose", x: 20, y: 20, nivel: 50, shiny: true },
      { id: "pikachu", mapa: "lumiose", x: 27, y: 20, nivel: 50, shiny: true },
    ],
    // UNOWN voando pelo céu de LUMIOSE, soletrando (src/systems/unownfrase.js)
    unown: { mapa: "lumiose", frase: "O CRIADOR DO JOGO FAZ ANIVERSÁRIO DIA VINTE E SEIS DE OUTUBRO" },
  },
  {
    id: "natal",
    nome: "NATAL GLITCHADO",
    de: { dia: 20, mes: 12 },
    ate: { dia: 26, mes: 12 },
    raids: [
      // em SAFFRON, na avenida de baixo
      { id: "delibird", mapa: "saffron_city", x: 25, y: 40, nivel: 50, shiny: true },
      { id: "articuno", mapa: "saffron_city", x: 45, y: 40, nivel: 50, shiny: true },
    ],
  },
  {
    id: "ano_novo",
    nome: "ANO NOVO BUGADO",
    de: { dia: 31, mes: 12 },
    ate: { dia: 2, mes: 1 },
    raids: [
      // em LUMIOSE, na praça de cima, entre o HOTEL Z e a ZONA DE BATALHA
      { id: "jirachi", mapa: "lumiose", x: 20, y: 9, nivel: 50, shiny: true },
      { id: "hooh", mapa: "lumiose", x: 27, y: 9, nivel: 50, shiny: true },
    ],
  },
  {
    id: "pascoa",
    nome: "PÁSCOA DO BUG",
    de: { dia: 1, mes: 4 },
    ate: { dia: 20, mes: 4 },
    raids: [
      // em CELADON, na praça de baixo
      { id: "buneary", mapa: "celadon_city", x: 28, y: 32, nivel: 50, shiny: true },
      { id: "togepi", mapa: "celadon_city", x: 34, y: 32, nivel: 50, shiny: true },
    ],
  },
  {
    id: "dia_das_criancas",
    nome: "DIA DAS CRIANÇAS",
    de: { dia: 12, mes: 10 },
    ate: { dia: 12, mes: 10 },
    raids: [
      // em PALLET, os três bebês, no caminho pro lago
      { id: "pichu", mapa: "pallet", x: 8, y: 15, nivel: 50, shiny: true },
      { id: "cleffa", mapa: "pallet", x: 12, y: 15, nivel: 50, shiny: true },
      { id: "igglybuff", mapa: "pallet", x: 16, y: 15, nivel: 50, shiny: true },
    ],
  },
  {
    id: "carnaval_ultra",
    nome: "CARNAVAL DAS ULTRA BEASTS",
    // SÓ na semana do Carnaval, todo ano (o CAIO pediu um evento PRO
    // carnaval — a "estreia" de out/nov 2026 que eu tinha posto saiu)
    de: { dia: 5, mes: 2 },
    ate: { dia: 17, mes: 2 },
    ultra: true,
    raids: [
      // no RIO DE JANEEVEE, na praça do ARCEUS REDENTOR: o desfile, dos dois
      // lados da avenida, com as fantasias (src/data/carnaval.js)
      { id: "pheromosacarnaval", mapa: "rio", x: 12, y: 18, nivel: 60 },
      { id: "blacephaloncarnaval", mapa: "rio", x: 17, y: 18, nivel: 60 },
      { id: "xurkitreecarnaval", mapa: "rio", x: 12, y: 20, nivel: 60 },
      { id: "buzzwolecarnaval", mapa: "rio", x: 17, y: 20, nivel: 60 },
      { id: "nihilegocarnaval", mapa: "rio", x: 12, y: 22, nivel: 60 },
      { id: "poipolecarnaval", mapa: "rio", x: 17, y: 22, nivel: 60 },
      { id: "naganadelcarnaval", mapa: "rio", x: 12, y: 24, nivel: 60 },
      { id: "guzzlordcarnaval", mapa: "rio", x: 12, y: 26, nivel: 70 },
    ],
    textos: {
      rasgoNormal: [
        "EVENTO: {EVENTO}! (ATÉ {ATE})",
        "UM ULTRA BURACO NO MEIO DO DESFILE! {MON} ESTÁ SAMBANDO LÁ DENTRO. ULTRA RAID DE {ESTRELAS} ESTRELAS!",
      ],
      pergunta: "ENTRAR NA ULTRA RAID?",
      saiu: "O ULTRA BURACO CONTINUA ABERTO. O DESFILE VAI ATÉ {ATE}.",
      pegou: "VOCÊ PEGOU {MON}! O ULTRA BURACO SE FECHA. NOTA DEZ!",
    },
  },
  {
    id: "independencia_braglitch",
    nome: "INDEPENDÊNCIA DE BRAGLITCH",
    de: { dia: 12, mes: 9 },
    ate: { dia: 20, mes: 9 },
    raids: [
      // em SÃO LUCARIO, na rua de baixo, perto do porto
      { id: "saci", mapa: "sao_lucario", x: 8, y: 18, nivel: 50, shiny: true },
      { id: "capivarao", mapa: "sao_lucario", x: 16, y: 18, nivel: 50, shiny: true },
    ],
  },
];

/** Os textos de toda raid de evento. {EVENTO} = o nome, {ATE} = o último dia,
 *  {MON} = o bicho, {ESTRELAS} = as estrelas. `rasgoNormal` é o de bicho que
 *  não é shiny. */
export const TEXTOS_EVENTO = {
  rasgo: [
    "EVENTO: {EVENTO}! (ATÉ {ATE})",
    "UM RASGO DE EVENTO! TEM UM {MON} SHINY LÁ DENTRO. RAID DE {ESTRELAS} ESTRELAS!",
  ],
  rasgoNormal: [
    "EVENTO: {EVENTO}! (ATÉ {ATE})",
    "UM RASGO DE EVENTO! TEM UM {MON} LÁ DENTRO. RAID DE {ESTRELAS} ESTRELAS!",
  ],
  pergunta: "ENTRAR NA GLITCH RAID?",
  opcoes: ["ENTRAR", "AGORA NÃO"],
  saiu: "O RASGO CONTINUA ABERTO. ELE ESPERA ATÉ {ATE}.",
  semPokemon: "SEUS POKÉMON ESTÃO SEM FORÇA. CURE ELES ANTES DE ENTRAR.",
  pegou: "VOCÊ PEGOU O {MON} DO EVENTO! O RASGO SE FECHA. ATÉ O ANO QUE VEM!",
};

/** AS ULTRA BEASTS: o que sai dos rasgos num evento `ultra`. */
export const ULTRA_BEASTS = ["nihilego", "buzzwole", "pheromosa", "xurkitree", "celesteela", "kartana",
  "guzzlord", "poipole", "naganadel", "stakataka", "blacephalon"];

/** AS ESTRELAS DA RAID: nível 1-10 = 1, 11-20 = 2 ... 91-100 = 10. */
export const estrelasDoNivel = (nivel) => Math.max(1, Math.min(10, Math.ceil(nivel / 10)));
