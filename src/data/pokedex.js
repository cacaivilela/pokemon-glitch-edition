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
    "PROF. CARVALHO: E AGORA, PELO FAVOR DE TRAZER A ENCOMENDA, LEVA ISTO.",
    "É UMA POKÉDEX. ELA ANOTA TODO POKÉMON QUE VOCÊ VIR E TODO QUE FOR SEU.",
    "O QUE VOCÊ SÓ VIU, ELA DESENHA. O QUE VOCÊ PEGOU, ELA CONTA TUDO: TIPO, PESO, ONDE VIVE.",
  ],
  ganhou: "VOCÊ RECEBEU A POKÉDEX!",
  // A ENCOMENDA (pedido do CAIO: "tem que ir lá pra viridian pegar o pacote e
  // entregar"): igual ao jogo original. O balconista da loja de VIRIDIAN dá o
  // pacote; entregando, o professor dá a POKÉDEX e 5 POKÉ BOLAS.
  bolas: ["PROF. CARVALHO: E TOMA, CINCO POKÉ BOLAS PRA VOCÊ COMEÇAR A PEGAR POKÉMON.", "VOCÊ RECEBEU 5 POKÉ BOLAS!"],
  encomenda: {
    item: "encomenda do carvalho",
    loja: ["BALCONISTA: OI! VOCÊ É DE PALLET?", "CHEGOU UMA ENCOMENDA PRO PROF. CARVALHO. VOCÊ LEVA PRA ELE?", "VOCÊ RECEBEU A ENCOMENDA DO CARVALHO!"],
    lojaDeNovo: ["BALCONISTA: LEVA A ENCOMENDA PRO PROF. CARVALHO, LÁ EM PALLET!", "DEPOIS VOCÊ VOLTA PRA COMPRAR."],
    oakSem: ["PROF. CARVALHO: AH, A LOJA DE VIRIDIAN FICOU DE MANDAR UMA ENCOMENDA MINHA...", "SE VOCÊ PASSAR POR LÁ, TRAZ PRA MIM?"],
    oakRecebe: ["PROF. CARVALHO: OH! A MINHA ENCOMENDA! É ISSO MESMO QUE EU ESTAVA ESPERANDO.", "MUITO OBRIGADO! EM TROCA, TENHO UMA COISA PRA VOCÊ..."],
  },
  explica: [
    "ABRE PELO MENU (X). C TROCA A ABA: KANTO, NACIONAL E FORMAS.",
    "E ME AVISA COMO ELA ESTÁ INDO. A CADA TANTO QUE VOCÊ PEGAR, EU MANDO ALGUMA COISA.",
  ],
  // o fim da conversa, depois do decodificador
  fim: [
    "PROF. CARVALHO: BOA ESCOLHA! AGORA SIGA PELA ROTA 1.",
    "VIRIDIAN FICA AO NORTE. LÁ TEM CENTRO POKÉMON E LOJA.",
  ],
  registrou: "BZZT! {MON} ANOTADO NA POKÉDEX: PEGO!",
  abas: ["KANTO", "NACIONAL", "FORMAS"],
  vistos: "VISTOS",
  pegos: "PEGOS",
  semDados: "BZZT! PEGA ELE PRA EU LER OS DADOS!",
  paginas: ["DADOS", "ATRIBUTOS", "ONDE", "MISSÕES"],
  semLugar: "NÃO VIVE SOLTO EM LUGAR NENHUM QUE A POKÉDEX CONHEÇA.",
  ajudaLista: "C ABA  <> PULA 10  Z VER",
  ajudaFicha: "<> PÁGINA  ▲▼ OUTRO",
  // o professor falando pela Pokédex, quando um marco é passado
  professor: "PROF. CARVALHO (PELA POKÉDEX):",
  // A POKÉDEX FALA (pedido do CAIO, 09/nov/2026: "faz as falas da pkdex serem tipo o
  // rotom falando"). O desenho que aparece no canto é dele (assets/sprites/objetos/rotomdex_caio.png).
  fala: {
    oi: ["BZZT! VAMOS ACHAR MAIS POKÉMON!", "BZZT! ESCOLHE UM QUE EU TE CONTO!", "BZZT! EU ANOTO TUDO, VIU?"],
    pegos: "BZZT! VOCÊ JÁ PEGOU {N}!",
    pego: "BZZT! ESSE EU CONHEÇO BEM!",
    visto: "BZZT! SÓ VI DE LONGE. PEGA ELE!",
    nada: "BZZT! ESSE EU NUNCA VI...",
  },
  // as mesmas falas pra VOZ em inglês e espanhol (a tela continua em português)
  falaEn: {
    oi: ["BZZT! LET'S FIND MORE POKÉMON!", "BZZT! PICK ONE AND I'LL TELL YOU ALL ABOUT IT!", "BZZT! I WRITE EVERYTHING DOWN, YOU KNOW?"],
    pegos: "BZZT! YOU'VE ALREADY CAUGHT {N}!",
    pego: "BZZT! I KNOW THIS ONE REALLY WELL!",
    visto: "BZZT! I ONLY SAW IT FROM FAR AWAY. CATCH IT!",
    nada: "BZZT! I'VE NEVER SEEN THIS ONE...",
  },
  falaEs: {
    oi: ["¡BZZT! ¡VAMOS A ENCONTRAR MÁS POKÉMON!", "¡BZZT! ¡ELIGE UNO Y TE CUENTO TODO!", "¡BZZT! YO LO ANOTO TODO, ¿SABES?"],
    pegos: "¡BZZT! ¡YA ATRAPASTE {N}!",
    pego: "¡BZZT! ¡ESTE LO CONOZCO MUY BIEN!",
    visto: "¡BZZT! SOLO LO VI DE LEJOS. ¡ATRÁPALO!",
    nada: "¡BZZT! ESTE NUNCA LO HE VISTO...",
  },
  mandou: "BZZT! O PROFESSOR MANDOU {QTD} {ITEM}!",
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

/** OS PRÊMIOS DA NACIONAL (pedido do CAIO, nov/2026: "faz a pkdex ter
 *  recompensas pelo nº de pkmns na sua pkdex"). Contam TODOS os pegos da
 *  NACIONAL (todas as regiões, Braglitch e os extras), e são pagos do mesmo
 *  jeito que os de Kanto: ao abrir a Pokédex, uma vez cada. */
export const MARCOS_NACIONAL = [
  { n: 200, item: "doce raro", qtd: 5,
    fala: "DUZENTOS NA NACIONAL! VOCÊ JÁ SAIU DE KANTO DE VERDADE. DOCES PRA QUEM FICOU PRA TRÁS." },
  { n: 300, item: "pepita", qtd: 5,
    fala: "TREZENTOS. VENDE ESSAS PEPITAS E COMPRA BOLA, QUE AINDA FALTA MUITO." },
  { n: 400, item: "master ball", qtd: 1,
    fala: "QUATROCENTOS! ISTO AQUI PEGA QUALQUER UM. GUARDA PRA UM QUE VALHA A PENA." },
  { n: 500, item: "ovo da sorte", qtd: 1,
    fala: "QUINHENTOS! METADE DO MUNDO. DÁ ESTE OVO PRA QUEM PRECISA CRESCER RÁPIDO." },
  { n: 600, item: "doce raro", qtd: 20,
    fala: "SEISCENTOS. EU JÁ NEM SEI DE ONDE VOCÊ TIRA TANTO POKÉMON. TOMA MAIS DOCES." },
  { n: 700, item: "master ball", qtd: 2,
    fala: "SETECENTOS! DUAS MASTER BALLS. NÃO CONTA PRO MEU NETO QUE EU TE DEI." },
  { n: 800, item: "pepita", qtd: 20,
    fala: "OITOCENTOS. VOCÊ É O TREINADOR MAIS RICO EM POKÉMON QUE EU JÁ CONHECI. AGORA EM DINHEIRO TAMBÉM." },
  { n: 900, item: "master ball", qtd: 3,
    fala: "NOVECENTOS! OS QUE FALTAM SÃO OS LENDÁRIOS ESCONDIDOS. ESTAS SÃO PRA ELES." },
  { n: 1000, item: "doce raro", qtd: 50,
    fala: "MIL!!! MIL POKÉMON! EU VOU TER QUE ESCREVER UM LIVRO SOBRE VOCÊ." },
  { n: 1100, item: "master ball", qtd: 10,
    fala: "MIL E CEM. A POKÉDEX NACIONAL ESTÁ QUASE TODA PREENCHIDA. NÃO TENHO MAIS NADA PRA TE ENSINAR." },
  // TODOS: o número é o tamanho da NACIONAL (calculado na hora: entra
  // Pokémon novo, o marco anda junto). Cem MASTER BALLS ("com todos os pkmns
  // 100 master balls", CAIO, nov/2026). A MASTER BALL na loja vem da LIGA.
  { todos: true, item: "master ball", qtd: 100,
    fala: "TODOS. TODOS OS POKÉMON DO MUNDO. A POKÉDEX ESTÁ COMPLETA! TOMA CEM MASTER BALLS. VOCÊ MERECE CADA UMA." },
];

/** O PRÊMIO DE COMPLETAR KANTO: com ele na mochila, a chance de um selvagem
 *  nascer shiny (ou luminoso) triplica. É o mesmo número que o SANDUÍCHE
 *  AMARGO do acampamento usa — e os dois somam na mesma conta. */
export const AMULETO = {
  item: "amuleto brilhante",
  fator: 3,
  lore: "BRILHA SOZINHO NO BOLSO. OS POKÉMON EM VOLTA PARECEM BRILHAR UM POUCO MAIS TAMBÉM.",
};
