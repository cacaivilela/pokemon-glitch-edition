// OS BICOS: dois jeitos de ganhar dinheiro, os dois na conversa com a
// ENFERMEIRA de qualquer Centro Pokémon (src/scenes/overworld.js; a lógica em
// src/systems/bicos.js).
//
//   ENTREGAS     ela te dá um pacote pra levar à enfermeira do Centro de OUTRA
//                cidade da mesma região. Sem relógio: entregou, recebeu. Um
//                pacote por vez; quanto mais insígnias, mais paga.
//   PROCURADOS   o mural com três Pokémon procurados — espécie e nível mínimo,
//                sorteados entre os que vivem no mato da região. Derrubou ou
//                capturou um que bate, a recompensa cai na hora. Cumpriu os
//                três, o mural ganha três novos.
export const BICOS = {
  entrega: {
    base: 900,             // o valor mínimo de uma entrega
    porInsignia: 250,      // + isto por insígnia (Kanto e Braglitch somadas)
    sorte: 0.3,            // até 30% a mais, sorteado
  },
  procurado: {
    quantos: 3,
    acima: [1, 4],         // o nível mínimo pedido: o máximo do mato + isto
    base: 600,
    porNivel: 45,
  },
  textos: {
    menu: "O QUE VOCÊ PRECISA?",
    opcoes: ["CURAR", "TROCAR GOLPES", "ENTREGAS", "PROCURADOS", "NADA"],
    // entregas
    oferta: "TEM UM PACOTE AQUI PRO CENTRO DE {CIDADE}. PAGAM ${VALOR} NA ENTREGA. LEVA?",
    simNao: ["LEVO", "AGORA NÃO"],
    levou: ["VOCÊ PEGOU O PACOTE PRA {CIDADE}.", "SEM PRESSA! É SÓ ENTREGAR PRA ENFERMEIRA DE LÁ."],
    jaTem: "VOCÊ JÁ ESTÁ COM UM PACOTE PRO CENTRO DE {CIDADE}.",
    desistir: "QUER DEVOLVER O PACOTE?",
    devolveu: "TUDO BEM, EU GUARDO ELE AQUI.",
    entregou: ["AH, O PACOTE DE {ORIGEM}! ERA EXATAMENTE O QUE A GENTE ESPERAVA.", "VOCÊ RECEBEU ${VALOR}!"],
    semDestino: "HOJE NÃO TEM NENHUM PACOTE SAINDO DAQUI.",
    // procurados
    mural: "O MURAL DE PROCURADOS:",
    linha: "{MON} NV {LVL}+  ${VALOR}{FEITO}",
    feito: " ✓",
    explica: "DERRUBE OU CAPTURE UM DESSES, DO NÍVEL PEDIDO PRA CIMA, E A RECOMPENSA CAI NA HORA.",
    novo: "VOCÊ CUMPRIU O MURAL TODO! JÁ PREGUEI TRÊS NOVOS.",
    pago: "ESSE {MON} ESTAVA NO MURAL DE PROCURADOS! VOCÊ RECEBEU ${VALOR}!",
  },
};
