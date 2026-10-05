// Gritos, parte 6: os que entraram depois das cinco primeiras.
export const GRITOS = {
  // a AVE-BURITI: as três cabeças piam uma depois da outra, cada uma num tom,
  // e o tronco farfalha como palmeira no vento
  exeggutorbrag: { som: "PIU! PIÚ! PIÍÍ! FRRSSS", mais: ["PIU! PIU! PIU!", "PIÚ...? FRRSSS... ZZZ"], s: [[900, 1200, 90, "p"], [0, 0, 40, "_"], [1300, 1700, 100, "f"], [0, 0, 40, "_"], [1800, 2600, 160, "f", 10], [0, 0, 60, "_"], [1500, 1100, 140, "p", 0, 0.2], [1300, 2000, 120, "t"], [3000, 1200, 520, "n"]] },
  // as formas do ZYGARDE (o CUBO): o mesmo "ZI-GÁRD... ZZZM", mudando de tamanho.
  // O 10% é um cachorro: o motivo agudo e curto, com um latido no fim
  zygarde10: { som: "ZI-GÁ! AU-AU! ZZM", mais: ["AU-AU! ZI-GÁ! ZM!", "ZI...? ARF... ARF... ZM"], s: [[900, 950, 110, "q", 0, 0.15], [0, 0, 30, "_"], [800, 600, 160, "s", 0, 0.25], [0, 0, 50, "_"], [700, 500, 80, "p", 0, 0.35], [0, 0, 40, "_"], [700, 480, 100, "p", 0, 0.35], [500, 300, 300, "s", 35, 0.3]] },
  // o COMPLETO é o gigante: grave, longo, e o zumbido das células no fim
  zygardecompleto: { som: "ZIII-GÁÁÁRD... ZZZZZMMM", mais: ["ZI-GÁÁRD! ZZZM!", "ZIII... GRRR... NATUREZA"], s: [[300, 320, 280, "s", 0, 0.3], [0, 0, 50, "_"], [260, 180, 520, "s", 4, 0.4], [0, 0, 50, "_"], [140, 130, 900, "s", 35, 0.5], [600, 60, 400, "n"]] },
};
