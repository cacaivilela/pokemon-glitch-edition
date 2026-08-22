// CONCURSO DE FUSÃO DE CINNABAR.
//
// Na ilha onde ressuscitam fóssil, três cientistas montaram um concurso pra
// julgar o que sai do DECODIFICADOR DE GENOMA. Você escolhe a dupla (ou leva
// uma fusão pronta), eles dão nota de 0 a 10 cada um, e a soma decide.
//
// Cada jurado olha uma coisa só, e nenhum deles olha a mesma:
//   HARMONIA  os dois tipos se cobrem ou se atrapalham (tabela de tipos)
//   POTÊNCIA  os números da fusão no nível 50
//   AUTORIA   o que veio da SUA mão: desenho, nome, tipos e crescimento
//
// Tudo aqui tem hot-swap: dá pra reescrever nota, fala e prêmio com o jogo
// aberto. As contas estão em src/systems/concurso.js.

export const CONCURSO = {
  nome: "CONCURSO DE FUSÃO",
  local: "cinnabar_island",
  /** quantos rivais entram junto com você (a lista deles está lá embaixo) */
  quantosRivais: 3,
  /** teto de cada nota */
  notaMax: 10,

  /** POTÊNCIA: a soma dos atributos no nível 50 que vale nota 10.
   *  Uma fusão comum de Kanto no 50 fica na casa dos 500. */
  potenciaTeto: 620,
  potenciaPiso: 220,

  /** AUTORIA: o que cada coisa vale. Sem ficha, a fusão vale só o `automatico`
   *  — os jurados sabem quando a máquina fez tudo sozinha. */
  autoria: {
    automatico: 2,
    desenho: 4,       // desenho próprio na oficina
    nome: 2,          // trocou o nome que a máquina deu
    tipos: 1,         // mexeu nos tipos
    crescimento: 1,   // mexeu no crescimento por nível
  },

  /** HARMONIA: como a nota sai da tabela de tipos. Conta quantos dos 18 tipos
   *  a dupla RESISTE e quantos ela sofre; monotipo perde um ponto, porque a
   *  graça do concurso é a mistura. */
  harmonia: { base: 5, porResistencia: 0.55, porFraqueza: -0.7, monotipo: -1, imunidade: 1 },

  /** Os três jurados. `sprite` é o mesmo nome de arte dos NPCs do mapa. */
  jurados: [
    {
      id: "helix", nome: "DR. HÉLIX", sprite: "cientista", criterio: "harmonia",
      titulo: "HARMONIA",
      fala: {
        alto: ["OS DOIS TIPOS SE PROTEGEM. ISSO NÃO FOI SORTE.",
               "UM COBRE O BURACO DO OUTRO. É ISSO QUE EU VIM VER."],
        medio: ["SE ENTENDEM. NÃO SE COMPLETAM.",
                "FUNCIONA. NÃO ME EMOCIONA."],
        baixo: ["ESSES DOIS BRIGAM DENTRO DO MESMO CORPO.",
                "VOCÊ SOMOU AS FRAQUEZAS, NÃO AS FORÇAS."],
      },
    },
    {
      id: "cupula", nome: "DRA. CÚPULA", sprite: "tecnica", criterio: "potencia",
      titulo: "POTÊNCIA",
      fala: {
        alto: ["MEDI TRÊS VEZES. O NÚMERO É ESSE MESMO.",
               "ISSO AQUI NÃO DEVIA CABER NUM POKÉMON SÓ."],
        medio: ["SÓLIDO. NADA QUE ME FAÇA REESCREVER A TABELA.",
                "DENTRO DA MÉDIA. A MÉDIA TAMBÉM É UM LUGAR."],
        baixo: ["FRÁGIL. BONITO, TALVEZ, MAS FRÁGIL.",
                "A FITA MAL ENCOSTOU NOS NÚMEROS."],
      },
    },
    {
      id: "ambar", nome: "DR. ÂMBAR", sprite: "maniaco", criterio: "autoria",
      titulo: "AUTORIA",
      fala: {
        alto: ["ISSO AQUI TEM MÃO. DÁ PRA VER QUEM DESENHOU.",
               "VOCÊ NÃO ACEITOU O QUE A MÁQUINA CUSPIU. ÓTIMO."],
        medio: ["VOCÊ MEXEU UM POUCO. UM POUCO É MAIS QUE NADA.",
                "TEM UMA ESCOLHA SUA AQUI DENTRO. UMA."],
        baixo: ["ISSO É O CÁLCULO PADRÃO DA MÁQUINA. EU CONHEÇO DE COR.",
                "SAIU DA FITA E VEIO DIRETO PRA CÁ. SEM PASSAR POR VOCÊ."],
      },
    },
  ],

  /** Quem organiza, na beira do palco. */
  anfitria: {
    id: "cinabrio", nome: "DRA. CINÁBRIO", sprite: "canalizadora",
    convite: [
      "BEM-VINDO AO CONCURSO DE FUSÃO DE CINNABAR.",
      "AQUI A GENTE RESSUSCITA BICHO DE PEDRA HÁ ANOS. FUNDIR DOIS VIVOS FOI O PASSO SEGUINTE.",
      "TRAGA UMA DUPLA. OS TRÊS ALI JULGAM: HARMONIA, POTÊNCIA E AUTORIA.",
    ],
    volta: ["DE VOLTA? ESCOLHA A DUPLA."],
    menu: ["INSCREVER UMA DUPLA", "COMO FUNCIONA", "SAIR"],
    regras: [
      "DR. HÉLIX OLHA SE OS DOIS TIPOS SE COBREM.",
      "DRA. CÚPULA MEDE OS NÚMEROS NO NÍVEL 50.",
      "DR. ÂMBAR OLHA O QUE VEIO DA SUA MÃO: DESENHO, NOME, TIPOS, CRESCIMENTO.",
      "A DUPLA NÃO É FUNDIDA DE VERDADE: A MÁQUINA DAQUI LÊ, MOSTRA E DEVOLVE OS DOIS.",
    ],
    semDupla: "PRECISA DE DOIS POKÉMON NA EQUIPE — OU DE UMA FUSÃO PRONTA.",
    escolha: "QUAL DUPLA VOCÊ INSCREVE?",
  },

  /** Os rivais: cientistas do laboratório, cada um com a dupla dele. A ordem é
   *  a ordem de entrada no palco, e a nota deles sai da mesma conta que a sua
   *  (mais um empurrãozinho por insígnia — ver src/systems/concurso.js). */
  rivais: [
    { nome: "DR. PÁLEO", sprite: "cientista", cabeca: "kabutops", corpo: "omastar" },
    { nome: "DRA. RESINA", sprite: "tecnica", cabeca: "aerodactyl", corpo: "onix" },
    { nome: "DR. FÓSSIL", sprite: "cientista", cabeca: "omanyte", corpo: "kabuto" },
    { nome: "ESTAGIÁRIO NEY", sprite: "garoto", cabeca: "magikarp", corpo: "magikarp" },
    { nome: "DRA. LAVA", sprite: "tecnica", cabeca: "magmar", corpo: "rapidash" },
    { nome: "DR. VULCÃO", sprite: "cientista", cabeca: "arcanine", corpo: "ninetales" },
    { nome: "DRA. PONTE", sprite: "canalizadora", cabeca: "gengar", corpo: "haunter" },
    { nome: "DR. TANQUE", sprite: "maniaco", cabeca: "lapras", corpo: "cloyster" },
  ],

  /** Prêmios por colocação. O primeiro lugar só dá item na primeira vez; daí em
   *  diante é dinheiro (senão o concurso vira uma torneira de doce raro). */
  premios: [
    { dinheiro: 5000, item: "doce raro", qtd: 3, fala: "PRIMEIRO LUGAR!" },
    { dinheiro: 2000, fala: "SEGUNDO LUGAR." },
    { dinheiro: 800, fala: "TERCEIRO LUGAR." },
  ],
  premioRepetido: { dinheiro: 3000, fala: "PRIMEIRO LUGAR DE NOVO!" },
  premioForaDoPodio: { dinheiro: 200, fala: "FICOU FORA DO PÓDIO. LEVE O AJUDA DE CUSTO." },

  /** O que a tela do concurso fala. */
  texto: {
    comeca: "OS TRÊS JURADOS SE SENTAM. A PLATEIA FICA QUIETA.",
    entra: "{DONO} APRESENTA {NOME}!",
    notaFinal: "TOTAL: {TOTAL} DE 30.",
    suaVez: "AGORA VOCÊ. {NOME}, DE {DONO}!",
    resultado: "RESULTADO DO CONCURSO",
    ganhou: "VOCÊ GANHOU ${DINHEIRO}!",
    ganhouItem: "E MAIS {QTD} {ITEM}!",
    devolve: "A MÁQUINA DEVOLVE OS DOIS, INTEIROS. FOI SÓ UMA LEITURA.",
    recorde: "MELHOR NOTA SUA ATÉ HOJE: {N} DE 30.",
    novoRecorde: "RECORDE NOVO! {N} DE 30.",
    ajuda: "Z CONTINUA",
  },
};
