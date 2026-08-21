// Tipos e tabela de efetividade da era Gen 3 + GLITCH. SOMBRIO entrou junto com
// os Pokémon de Hoenn (nenhum de Kanto é desse tipo); FADA continua de fora,
// porque é de uma geração posterior a tudo que existe aqui.
export const TYPES = [
  "NORMAL", "LUTADOR", "VOADOR", "VENENO", "TERRA", "PEDRA", "INSETO", "FANTASMA",
  "AÇO", "FOGO", "ÁGUA", "PLANTA", "ELÉTRICO", "PSÍQUICO", "GELO", "DRAGÃO", "SOMBRIO", "GLITCH",
];

export const TYPE_COLOR = {
  NORMAL: "#a8a878", LUTADOR: "#c03028", VOADOR: "#a890f0", VENENO: "#a040a0",
  TERRA: "#e0c068", PEDRA: "#b8a038", INSETO: "#a8b820", FANTASMA: "#705898",
  "AÇO": "#b8b8d0", FOGO: "#f08030", "ÁGUA": "#6890f0", PLANTA: "#78c850",
  "ELÉTRICO": "#f8d030", "PSÍQUICO": "#f85888", GELO: "#98d8d8", "DRAGÃO": "#7038f8",
  SOMBRIO: "#705848", GLITCH: "#b455ff",
};

// CHART[atacante][defensor] = multiplicador (omitido = 1)
export const CHART = {
  NORMAL:     { PEDRA: 0.5, "AÇO": 0.5, FANTASMA: 0, GLITCH: 0 },
  LUTADOR:    { NORMAL: 2, PEDRA: 2, "AÇO": 2, GELO: 2, SOMBRIO: 2, VOADOR: 0.5, VENENO: 0.5, "PSÍQUICO": 0.5, INSETO: 0.5, FANTASMA: 0 },
  VOADOR:     { PLANTA: 2, LUTADOR: 2, INSETO: 2, PEDRA: 0.5, "AÇO": 0.5, "ELÉTRICO": 0.5 },
  VENENO:     { PLANTA: 2, VENENO: 0.5, TERRA: 0.5, PEDRA: 0.5, FANTASMA: 0.5, "AÇO": 0 },
  TERRA:      { FOGO: 2, "ELÉTRICO": 2, VENENO: 2, PEDRA: 2, "AÇO": 2, PLANTA: 0.5, INSETO: 0.5, VOADOR: 0 },
  PEDRA:      { FOGO: 2, GELO: 2, VOADOR: 2, INSETO: 2, LUTADOR: 0.5, TERRA: 0.5, "AÇO": 0.5 },
  INSETO:     { PLANTA: 2, "PSÍQUICO": 2, SOMBRIO: 2, GLITCH: 2, FOGO: 0.5, LUTADOR: 0.5, VENENO: 0.5, VOADOR: 0.5, FANTASMA: 0.5, "AÇO": 0.5 },
  FANTASMA:   { "PSÍQUICO": 2, FANTASMA: 2, SOMBRIO: 0.5, NORMAL: 0, "AÇO": 0.5 },
  "AÇO":      { PEDRA: 2, GELO: 2, "AÇO": 0.5, FOGO: 0.5, "ÁGUA": 0.5, "ELÉTRICO": 0.5 },
  FOGO:       { PLANTA: 2, GELO: 2, INSETO: 2, "AÇO": 2, FOGO: 0.5, "ÁGUA": 0.5, PEDRA: 0.5, "DRAGÃO": 0.5 },
  "ÁGUA":     { FOGO: 2, TERRA: 2, PEDRA: 2, "ÁGUA": 0.5, PLANTA: 0.5, "DRAGÃO": 0.5 },
  PLANTA:     { "ÁGUA": 2, TERRA: 2, PEDRA: 2, FOGO: 0.5, PLANTA: 0.5, VENENO: 0.5, VOADOR: 0.5, INSETO: 0.5, "DRAGÃO": 0.5, "AÇO": 0.5 },
  "ELÉTRICO": { "ÁGUA": 2, VOADOR: 2, PLANTA: 0.5, "ELÉTRICO": 0.5, "DRAGÃO": 0.5, TERRA: 0 },
  "PSÍQUICO": { LUTADOR: 2, VENENO: 2, "PSÍQUICO": 0.5, "AÇO": 0.5, SOMBRIO: 0 },
  GELO:       { PLANTA: 2, TERRA: 2, VOADOR: 2, "DRAGÃO": 2, FOGO: 0.5, "ÁGUA": 0.5, GELO: 0.5, "AÇO": 0.5 },
  "DRAGÃO":   { "DRAGÃO": 2, "AÇO": 0.5 },
  SOMBRIO:    { "PSÍQUICO": 2, FANTASMA: 2, LUTADOR: 0.5, SOMBRIO: 0.5, "AÇO": 0.5 },
  GLITCH:     { NORMAL: 2, GLITCH: 0.5, INSETO: 0.5 },
};

export function effectiveness(atkType, defTypes) {
  let m = 1;
  for (const d of defTypes) m *= CHART[atkType]?.[d] ?? 1;
  return m;
}
