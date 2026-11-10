// A DIMENSÃO LITERARTE (ideia do CAIO, nov/2026): o lugar onde as histórias
// ganham vida — tipo o País das Maravilhas. Chão de xadrez, grama lilás,
// árvores roxas, flores gigantes e lagos de chá. Moram aqui os bichos que o
// CAIO inventou: a TURMA (MONICAPOW e os outros), a MONSTELA, o HE-MON, o
// COELHATRASADO, o LOBEM, a RAINHACOPA e as formas bebês de todos.
//
// Não tem estrada: se chega pela TOCA DO COELHO da BR-101 (o NPC "toca" de
// src/data/braglitch.js) e se volta pela toca daqui. O chão é pintado pelo
// tema "literarte" em src/core/assets.js (braglitchArt).
export const LUGARES = [
  {
    id: "literarte",
    nome: "DIMENSÃO LITERARTE",
    tipo: "rota",
    tema: "literarte",
    musica: "br101",
    planta: [
      "##############################",
      "#FF,,,,,,....PPPP....,,,,,,FF#",
      "#F,,,,,,,....P..P....,,,,,,,F#",
      "#,,,,oo,,....P..P....,,oo,,,,#",
      "#,,,,,,,..1..PPPP......,,,,,,#",
      "#,,,,,.......PP........,,,,,,#",
      "#....FFFF....PP....FFFF......#",
      "#....F,,F....PP....F,,F......#",
      "#....FFFF....PP....FFFF......#",
      "#............PP..............#",
      "#PPPPPPPPPPPPPPPPPPPPPPPPPPPP#",
      "#............PP..............#",
      "#,,,,,,,.....PP.....,,,,,,,,,#",
      "#,,,,,,,,....PP....,,,,,,,,,,#",
      "#,,,oo,,,,...PP...,,,,,oo,,,,#",
      "#,,,,,,,,....PP....,,,,,,,,,,#",
      "#.....~~~~...PP...~~~~.......#",
      "#....~~~~~~..PP..~~~~~~......#",
      "#.....~~~~...PP...~~~~.......#",
      "#............PP..2...........#",
      "#FF,,,,,,....PP....,,,,,,,,FF#",
      "#F,,,,,,,,...PP...,,,,,,,,,,F#",
      "#,,,,,,,,,...PP...,,,,,,,,,,,#",
      "#F,,,,,,,....PP....,,,,,,,,,F#",
      "#FF..........PP............FF#",
      "##############################",
    ],
    saidas: {},
    niveis: [12, 20],
    mato: [
      // os bebês, mais comuns
      ["coelhadiantado", 10], ["lobebe", 10], ["hemini", 8], ["monstelito", 8], ["copinha", 8], ["nenejama", 6],
      ["cebolete", 5], ["monine", 5], ["melanquinha", 5], ["laminha", 5], ["rabisquinha", 5], ["cachinho", 5],
      // os crescidos, raros
      ["coelhatrasado", 3], ["lobem", 3], ["hemon", 2], ["monstela", 2], ["rainhacopa", 2], ["meninijama", 2],
      ["cebolinio", 1], ["monicapow", 1], ["magalancia", 1], ["cascalama", 1], ["marinarte", 1], ["milecachos", 1],
    ],
    npcs: [
      // a toca de volta pra BR-101
      { id: "toca_volta", x: 12, y: 24, sprite: "toca", lines: ["..."],
        aoFalar: (cena) => cena.pularNaToca("rota_br101", 8, 26) },
    ],
    placas: {
      1: "DIMENSÃO LITERARTE\nONDE AS HISTÓRIAS GANHAM VIDA.",
      2: "POR ORDEM DA RAINHACOPA: É PROIBIDO PISAR NO XADREZ BRANCO.\n(NINGUÉM SABE QUAL É O BRANCO.)",
    },
  },
];
