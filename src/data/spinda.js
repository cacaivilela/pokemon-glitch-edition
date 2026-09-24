// O SPINDA: o Pokémon que não tem um sprite, e sim 4.294.967.296.
//
// GERADO POR tools/fetch_spinda.py a partir do decomp (pret/pokefirered).
// Não edite à mão: rode a ferramenta de novo.
//
// COMO FUNCIONA, que é igualzinho ao dos jogos de verdade (DrawSpindaSpots, em
// src/pokemon.c do decomp): o desenho do SPINDA é LIMPO, sem mancha nenhuma —
// é o 327.png daqui. As quatro manchas são carimbadas por cima na hora de
// desenhar, e a posição de cada uma sai do VALOR DE PERSONALIDADE do bicho:
//
//   os 32 bits da personalidade são lidos de 8 em 8, um naco por mancha;
//   de cada naco, o nibble BAIXO é o deslocamento X e o ALTO é o Y;
//   cada deslocamento vale de 0 a 15 e entra como `âncora + nibble - 8`,
//   ou seja a mancha anda de -8 a +7 em volta da âncora dela.
//
//   4 manchas x 8 bits = 32 bits = 4.294.967.296 combinações.
//
// O carimbo respeita o corpo: um pixel da mancha só pinta se o pixel que está
// embaixo for uma das TRÊS cores claras do corpo (`CORPO` aqui embaixo). É o
// que faz a mancha parar na borda da orelha em vez de vazar pro contorno, pro
// olho ou pras patas. A cor que entra é a da mesma posição em `MANCHA`.
//
// O SHINY do SPINDA tem o corpo da MESMA cor: o que muda é a rampa das manchas
// (e a das patas, que já vem pronta em shiny/327.png).
//
// As COSTAS não têm mancha sorteada — no jogo original o carimbo só vale pro
// sprite de frente, e o de costas tem uma mancha fixa desenhada. É por isso que
// só existe tabela pra frente aqui.

/** Os quatro moldes, 16x16. Cada `linhas[i]` é uma fileira de 16 bits, e o bit
 *  MENOS significativo é a coluna da esquerda. `x`/`y` são a âncora. */
export const SPINDA_MANCHAS = [
  { x: 16, y: 7, linhas: [0x0070, 0x01fc, 0x03fe, 0x07fe, 0x07ff, 0x0fff, 0x0fff, 0x0fff, 0x07fe, 0x07fe, 0x03fc, 0x01e0, 0x0000, 0x0000, 0x0000, 0x0000] },
  { x: 40, y: 8, linhas: [0x01e0, 0x03f8, 0x07fc, 0x0ffe, 0x0ffe, 0x1fff, 0x1fff, 0x1fff, 0x0ffe, 0x0ffe, 0x07fc, 0x07f8, 0x00e0, 0x0000, 0x0000, 0x0000] },
  { x: 22, y: 25, linhas: [0x001c, 0x003e, 0x007f, 0x007f, 0x007f, 0x007f, 0x007f, 0x003e, 0x001c, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000] },
  { x: 34, y: 26, linhas: [0x003c, 0x007e, 0x00ff, 0x00ff, 0x00ff, 0x00ff, 0x00ff, 0x007e, 0x003c, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000] },
];

/** As três cores claras do corpo que aceitam mancha (índices 1, 2 e 3 da
 *  paleta do decomp). Quem não for uma destas não recebe carimbo. */
export const SPINDA_CORPO = ["#f6e6ac", "#e6d5a4", "#c5b483"];

/** A cor que cada uma das três vira quando é mancha (índices 5, 6 e 7). */
export const SPINDA_MANCHA = {
  comum: ["#de8b4a", "#de6a39", "#b45a29"],
  shiny: ["#b4c55a", "#94a439", "#738318"],
};
