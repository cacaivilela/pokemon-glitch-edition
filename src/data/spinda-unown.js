// O SPINDA DOS UNOWN: o prêmio da ARQUEÓLOGA de CARUARU (missão
// "spinda-unown", src/data/missoes.js). As manchas sorteadas dele não
// existem: no lugar delas, as MANCHAS são as 28 silhuetas de UNOWN, de A a Z,
// ! e ?, cada uma num lugar FIXO do desenho de 64x64 (src/core/assets.js,
// `spinda`). Os espirais das orelhas e do rosto ficam.
//
// Elas pintam como mancha de verdade: só em cima das três cores claras do
// corpo, com a cor de mancha da mesma posição (laranja no comum, verde no
// shiny). Os lugares foram achados no próprio desenho: cada "#" cai no corpo
// claro e nenhuma letra encosta em outra, nem na diagonal. `forma`: "#" pinta.

export const SPINDA_UNOWN = {
  letras: [
  { letra: "A", x: 46, y: 9, forma: [".#.", "###", "#.#"] },
  { letra: "B", x: 29, y: 42, forma: ["##.", "###", "##."] },
  { letra: "C", x: 32, y: 32, forma: ["###", "#..", "###"] },
  { letra: "D", x: 34, y: 20, forma: ["##.", "#.#", "##."] },
  { letra: "E", x: 49, y: 13, forma: ["###", "##.", "###"] },
  { letra: "F", x: 43, y: 34, forma: ["###", "##.", "#.."] },
  { letra: "G", x: 40, y: 20, forma: [".##", "#.#", ".##"] },
  { letra: "H", x: 24, y: 34, forma: ["#.#", "###", "#.#"] },
  { letra: "I", x: 30, y: 26, forma: ["###", ".#.", "###"] },
  { letra: "J", x: 26, y: 20, forma: ["..#", "..#", "##."] },
  { letra: "K", x: 22, y: 24, forma: ["#.#", "##.", "#.#"] },
  { letra: "L", x: 36, y: 47, forma: ["#..", "#..", "###"] },
  { letra: "M", x: 30, y: 21, forma: ["###", "###", "#.#"] },
  { letra: "N", x: 21, y: 8, forma: ["##.", "#.#", "#.#"] },
  { letra: "O", x: 43, y: 30, forma: ["###", "#.#", "###"] },
  { letra: "P", x: 43, y: 14, forma: ["###", "###", "#.."] },
  { letra: "Q", x: 17, y: 10, forma: [".#.", "#.#", ".##"] },
  { letra: "R", x: 36, y: 33, forma: ["##.", "##.", "#.#"] },
  { letra: "S", x: 39, y: 35, forma: [".##", ".#.", "##."] },
  { letra: "T", x: 41, y: 26, forma: ["###", ".#.", ".#."] },
  { letra: "U", x: 33, y: 43, forma: ["#.#", "#.#", "###"] },
  { letra: "V", x: 38, y: 30, forma: ["#.#", "#.#", ".#."] },
  { letra: "W", x: 37, y: 23, forma: ["#.#", "###", "###"] },
  { letra: "X", x: 24, y: 15, forma: ["#.#", ".#.", "#.#"] },
  { letra: "Y", x: 21, y: 31, forma: ["#.#", ".#.", ".#."] },
  { letra: "Z", x: 40, y: 16, forma: ["##.", ".#.", ".##"] },
  { letra: "!", x: 26, y: 30, forma: [".#.", "...", ".#."] },
  { letra: "?", x: 45, y: 19, forma: ["##.", "..#", ".#."] },
  ],
};
