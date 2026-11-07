// OS POKÉTRABALHOS (pedido do CAIO, nov/2026: "faz os pokétrabalhos"), como os
// POKÉ JOBS do Sword/Shield: menu START → ROTOMFONE → TRABALHOS
// (src/scenes/trabalhos.js). Todo dia aparecem 4 trabalhos; você manda até 3
// Pokémon do BOX, escolhe o tempo (relógio DE VERDADE) e, quando acaba, eles
// voltam com EXPERIÊNCIA (mais pra quem é de um tipo que o trabalho pede) e ITENS.
// O que está rolando fica em st.trabalhos[id] = { mons, inicio, min }.

export const TRABALHOS = {
  porDia: 4,
  maxMons: 3,
  tempos: [
    { nome: "5 MINUTOS", min: 5 },
    { nome: "30 MINUTOS", min: 30 },
    { nome: "1 HORA", min: 60 },
    { nome: "3 HORAS", min: 180 },
    { nome: "8 HORAS", min: 480 },
  ],
  // EXPERIÊNCIA: por minuto, vezes (1 + nível/25); quem é do tipo pedido ganha 1,5x
  xpPorMin: 10,
  bonusTipo: 1.5,
  // ITENS: cada Pokémon traz 1 + (minutos / 45) sorteios da lista do trabalho
  minPorItem: 45,
  // o DOCE RARO aparece em trabalho de 1 hora ou mais, de vez em quando
  doceRaro: { minimo: 60, chance: 0.12 },

  lista: [
    { id: "fazenda", nome: "COLHEITA NA FAZENDA DE PALLET", tipos: ["PLANTA", "TERRA", "INSETO"],
      itens: ["mel", "morango", "banana", "poção"],
      fala: "OS SEUS POKÉMON COLHERAM UM MONTE DE FRUTA!" },
    { id: "incendio", nome: "APAGAR FOGO NA MANSÃO DE CINNABAR", tipos: ["ÁGUA", "GELO"],
      itens: ["super poção", "pedra da água", "poção"],
      fala: "O FOGO APAGOU! O DONO DA MANSÃO MANDOU UM PRESENTE." },
    { id: "tunel", nome: "ILUMINAR O TÚNEL DE PEDRA", tipos: ["ELÉTRICO", "FOGO"],
      itens: ["pedra do trovão", "pedra do fogo", "poké bola"],
      fala: "O TÚNEL FICOU CLARINHO! OS ZUBAT RECLAMARAM." },
    { id: "porto", nome: "CARREGAR CAIXAS NO PORTO DE VERMILION", tipos: ["LUTADOR", "PEDRA", "AÇO"],
      itens: ["hiper poção", "pepita grande", "super poção"],
      fala: "O NAVIO SAIU NA HORA CERTA, GRAÇAS A ELES!" },
    { id: "torre", nome: "ACALMAR AS ALMAS DA TORRE POKÉMON", tipos: ["FANTASMA", "PSÍQUICO", "SOMBRIO"],
      itens: ["cura total", "pedra do crepúsculo", "reviver"],
      fala: "A TORRE FICOU EM PAZ. UM ZEROGLE ACENOU COM O RABO." },
    { id: "correio", nome: "ENTREGAR CARTAS PELO CÉU", tipos: ["VOADOR", "DRAGÃO"],
      itens: ["great ball", "ultra ball", "poké bola"],
      fala: "TODAS AS CARTAS CHEGARAM! UMA ERA PRA VOCÊ." },
    { id: "lago", nome: "LIMPAR O LAGO DA ZONA SAFARI", tipos: ["ÁGUA", "VENENO"],
      itens: ["antídoto", "cogumelo", "poção"],
      fala: "O LAGO FICOU LIMPINHO. OS MAGIKARP AGRADECEM." },
    { id: "silph", nome: "TESTE NO LABORATÓRIO DA SILPH", tipos: ["PSÍQUICO", "AÇO", "ELÉTRICO", "GLITCH"],
      itens: ["up-grade", "x ataque", "x defesa"],
      fala: "O TESTE DEU CERTO! QUER DIZER, QUASE. NÃO PERGUNTA." },
    { id: "carnaval", nome: "DESFILE DO CARNAVAL", tipos: ["FADA", "NORMAL"],
      itens: ["morango", "queijo", "poção"],
      fala: "O BLOCO FOI UM SUCESSO! ELES VOLTARAM CHEIOS DE CONFETE." },
    { id: "fossil", nome: "PROCURAR FÓSSIL NO MONTE LUA", tipos: ["PEDRA", "TERRA"],
      itens: ["pedra da lua", "pepita grande", "poké bola"],
      fala: "ACHARAM UM MONTE DE PEDRA! E UMA DELAS BRILHA." },
    { id: "cafe", nome: "CAFÉ DA MANHÃ DO PROF. CARVALHO", tipos: ["NORMAL", "FOGO"],
      itens: ["café", "queijo", "bacon", "presunto"],
      fala: "O PROFESSOR COMEU TUDO E MANDOU AS SOBRAS PRA VOCÊ." },
    { id: "gelo", nome: "VIGIAR O ARMAZÉM DE GELO", tipos: ["GELO", "SOMBRIO"],
      itens: ["pedra do gelo", "super poção"],
      fala: "NINGUÉM ROUBOU NADA. FICOU TUDO GELADINHO." },
  ],

  texto: {
    titulo: "POKÉTRABALHOS",
    livre: "LIVRE",
    pronto: "PRONTO! A: BUSCAR",
    volta: "VOLTA EM {T}",
    escolha: "QUEM VAI? (ATÉ 3, DO BOX)",
    mandar: "> MANDAR <",
    semBox: ["NÃO TEM NINGUÉM NO BOX.", "GUARDE ALGUM POKÉMON NO PC PRA ELE PODER TRABALHAR!"],
    nenhum: "ESCOLHA PELO MENOS UM POKÉMON.",
    quantoTempo: "QUANTO TEMPO?",
    foi: "{MONS} FOI TRABALHAR! VOLTA EM {T}.",
    foram: "{MONS} FORAM TRABALHAR! VOLTAM EM {T}.",
    ainda: "ELES AINDA ESTÃO TRABALHANDO. VOLTAM EM {T}.",
    xp: "{MON} GANHOU {XP} DE EXPERIÊNCIA!",
    nivel: "{MON} SUBIU PARA O NÍVEL {N}!",
    item: "TROUXERAM: {ITEM} x{Q}",
    boxCheio: "O BOX ENCHEU! {MON} FICOU NA EQUIPE.",
    semLugar: "NÃO TEM LUGAR NEM NO BOX NEM NA EQUIPE. {MON} ESPERA AQUI NO TRABALHO.",
    ajuda: "A: ESCOLHER  B: VOLTAR",
  },
};
