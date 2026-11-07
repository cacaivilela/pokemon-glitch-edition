// A CAÇA-FANTASMAS DA TORRE POKÉMON (pedido do CAIO, nov/2026: "um jogo de caçar
// fantasmas com uma máquina, e pode vir fantasma de pkmn que nem é tipo
// fantasma, tipo CALYREX e PIKACHU, e ao pegar um fantasma dá o grito do pkmn
// que você pegou ao contrário"). Regras que ELE escolheu:
//  - ASPIRADOR COM MIRA: mexe a mira, SEGURA A e a máquina puxa o fantasma
//    até a barra encher (src/scenes/cacafantasma.js)
//  - cada fantasma pego deixa de 1 a 20 FICHAS DE ALMA daquele Pokémon; cada
//    ficha é 1% da alma dele
//  - 100 fichas do mesmo Pokémon (100%) = ele REVIVE, na própria torre
// As fichas ficam em st.almas[espécie]; o recorde em st.cacaFantasmaRecorde.

export const CACA_FANTASMA = {
  npc: { id: "caca_fantasma", x: 17, y: 8, dir: "left", sprite: "cientista", cacaFantasma: true, lines: [] },
  segundos: 90,          // uma rodada
  naTela: 3,             // fantasmas voando ao mesmo tempo
  especiesPorRodada: 5,  // de quem vêm os fantasmas da rodada (pra alma juntar)
  // OS FANTASMAS DA TORRE (pedido do CAIO: "faz ter mais GASTLY, MIMIKYU,
  // RATICATE"): toda rodada traz 2 deles, e eles aparecem o dobro. O RATICATE é
  // easter egg: dizem que o RATICATE do rival morreu no S.S. ANNE, e é por isso
  // que ele está na torre. O MAROWAK é a mãe do CUBONE, o fantasma do original.
  daTorre: ["gastly", "haunter", "gengar", "mimikyu", "raticate", "marowak"],
  pesoDaTorre: 2,
  puxar: 1.6,            // segundos segurando A pra pegar um fantasma comum
  puxarLenda: 4,         // ...e um lendário
  nivelRevive: 20,
  fichas: [1, 20],       // quantas fichas um fantasma deixa (sorteado)
  texto: {
    oi: "EU SOU CAÇADOR DE FANTASMAS! ESTA TORRE ESTÁ CHEIA DE ALMAS DE POKÉMON... DE TODO TIPO, NÃO SÓ FANTASMA.",
    pergunta: "O QUE VOCÊ QUER?",
    opcoes: ["CAÇAR", "REVIVER", "REGRAS", "SAIR"],
    regras: [
      "PEGUE A MINHA MÁQUINA. MEXA A MIRA E SEGURE A EM CIMA DE UM FANTASMA ATÉ A BARRA ENCHER.",
      "CADA FANTASMA QUE VOCÊ PEGA DEIXA DE 1 A 20 FICHAS DE ALMA. CADA FICHA É 1% DA ALMA DAQUELE POKÉMON.",
      "JUNTOU 100 FICHAS DO MESMO POKÉMON? A ALMA ESTÁ INTEIRA: EU REVIVO ELE PRA VOCÊ!",
    ],
    tchau: "VOLTE QUANDO QUISER. OS FANTASMAS NÃO VÃO EMBORA...",
    semAlma: "VOCÊ AINDA NÃO TEM NENHUMA FICHA DE ALMA. VÁ CAÇAR!",
    qual: "DE QUEM É A ALMA?",
    mais: "MAIS", voltar: "VOLTAR", sair: "SAIR",
    falta: "A ALMA DE {MON} ESTÁ EM {P}%. FALTAM {F} FICHAS PRA FICAR INTEIRA.",
    confirma: "USAR 100 FICHAS E REVIVER {MON}?",
    sim: ["SIM", "NÃO"],
    reviveu: ["A ALMA DE {MON} ESTÁ INTEIRA DE NOVO...", "{MON} REVIVEU!"],
    foiPraBox: "{MON} FOI PRO BOX.",
    // a tela da caçada
    titulo: "CAÇA-FANTASMAS",
    pegou: "PEGOU: {N}",
    segure: "SEGURE A",
    ficha: "+{N}% {MON}",
    fim: "ACABOU A CAÇADA!",
    recorde: "RECORDE NOVO!",
    sairTela: "A: SAIR",
    // o easter egg: pegou o fantasma do RATICATE
    raticate: "VOCÊ SABE COMO É PERDER UM POKÉMON?",
  },
};
