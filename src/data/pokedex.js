// A POKÉDEX: o que o professor fala quando entrega, e o que ele manda de volta
// quando a sua fica mais cheia.
//
// A ORDEM NO LABORATÓRIO é: o INICIAL, depois a POKÉDEX, depois o DECODIFICADOR
// DE GENOMA — primeiro o bicho, depois o caderno pra anotar os outros, e só
// então o aparelho que junta dois deles num só. Quem manda nessa conversa é
// `talkOak`, em src/scenes/overworld.js.
//
// O QUE ELA ANOTA: VISTO (apareceu numa batalha na sua frente) e PEGO (foi
// seu em algum momento — capturado, chocado, trocado, ganhado, evoluído). As
// duas contas moram no save desde sempre (`st.seen` e `st.caught`); a Pokédex
// é a primeira tela que mostra isso.
//
// AS TRÊS ABAS:
//   KANTO    — os 151, do BULBASAUR ao MEW
//   NACIONAL — todas as espécies do jogo, pelo número nacional
//   FORMAS   — as regionais, as hackeanas, as MEGA, os bonés e os glitches:
//              bichos que dividem número com outro, ou que não têm número
// As FUSÕES não entram: são infinitas, e quem guarda o registro delas é o
// próprio DECODIFICADOR.

export const POKEDEX_TEXTO = {
  entrega: [
    "PROF. CARVALHO: AGORA QUE VOCÊ TEM UM POKÉMON, LEVA ISTO TAMBÉM.",
    "É UMA POKÉDEX. ELA ANOTA TODO POKÉMON QUE VOCÊ VIR E TODO QUE FOR SEU.",
    "O QUE VOCÊ SÓ VIU, ELA DESENHA. O QUE VOCÊ PEGOU, ELA CONTA TUDO: TIPO, PESO, ONDE VIVE.",
  ],
  ganhou: "VOCÊ RECEBEU A POKÉDEX!",
  explica: [
    "ABRE PELO MENU (X). C TROCA A ABA: KANTO, NACIONAL E FORMAS.",
    "E ME AVISA COMO ELA ESTÁ INDO. A CADA TANTO QUE VOCÊ PEGAR, EU MANDO ALGUMA COISA.",
  ],
  // o fim da conversa, depois do decodificador
  fim: [
    "PROF. CARVALHO: BOA ESCOLHA! AGORA SIGA PELA ROTA 1.",
    "VIRIDIAN FICA AO NORTE. LÁ TEM CENTRO POKÉMON E LOJA.",
  ],
  registrou: "OS DADOS DE {MON} FORAM REGISTRADOS NA POKÉDEX!",
  abas: ["KANTO", "NACIONAL", "FORMAS"],
  vistos: "VISTOS",
  pegos: "PEGOS",
  semDados: "CAPTURE PRA LER OS DADOS.",
  paginas: ["DADOS", "ATRIBUTOS", "ONDE"],
  semLugar: "NÃO VIVE SOLTO EM LUGAR NENHUM QUE A POKÉDEX CONHEÇA.",
  ajudaLista: "C ABA  <> PULA 10  Z VER",
  ajudaFicha: "<> PÁGINA  ▲▼ OUTRO",
  // o professor falando pela Pokédex, quando um marco é passado
  professor: "PROF. CARVALHO (PELA POKÉDEX):",
  mandou: "O PROFESSOR MANDOU {QTD} {ITEM}!",
};

/** O PROFESSOR AVALIA. A cada marco de KANTO pegos, ele fala pela Pokédex e
 *  manda um presente — uma vez cada. Ele conta só Kanto de propósito: é a
 *  Pokédex que ele pediu, e a NACIONAL é grande demais pra virar tarefa. */
export const MARCOS = [
  { n: 10, item: "poké bola", qtd: 10,
    fala: "DEZ! JÁ DÁ PRA CHAMAR ISSO DE COMEÇO. TOMA MAIS BOLAS." },
  { n: 25, item: "great ball", qtd: 5,
    fala: "VINTE E CINCO. VOCÊ ESTÁ OLHANDO O MATO DIREITO. ESTAS AQUI PEGAM MELHOR." },
  { n: 50, item: "ultra ball", qtd: 5,
    fala: "CINQUENTA! UM TERÇO DE KANTO. NEM EU TINHA TANTO NA SUA IDADE." },
  { n: 80, item: "pedra da lua", qtd: 2,
    fala: "OITENTA. TEM BICHO QUE SÓ CRESCE COM ISTO — VOCÊ VAI PRECISAR." },
  { n: 120, item: "ultra ball", qtd: 10,
    fala: "CENTO E VINTE. OS QUE FALTAM SÃO OS DIFÍCEIS. LEVA AS MELHORES BOLAS QUE EU TENHO." },
  { n: 151, item: "amuleto brilhante", qtd: 1,
    fala: "CENTO E CINQUENTA E UM. A POKÉDEX DE KANTO ESTÁ COMPLETA. EU NÃO SEI O QUE DIZER. ISTO AQUI É SEU." },
];

/** O PRÊMIO DE COMPLETAR KANTO: com ele na mochila, a chance de um selvagem
 *  nascer shiny (ou luminoso) triplica. É o mesmo número que o SANDUÍCHE
 *  AMARGO do acampamento usa — e os dois somam na mesma conta. */
export const AMULETO = {
  item: "amuleto brilhante",
  fator: 3,
  lore: "BRILHA SOZINHO NO BOLSO. OS POKÉMON EM VOLTA PARECEM BRILHAR UM POUCO MAIS TAMBÉM.",
};
