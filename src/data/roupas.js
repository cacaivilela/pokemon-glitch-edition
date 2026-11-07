// AS ROUPAS DO JOGADOR (pedido do CAIO, nov/2026: "faz ter como personalizar o
// jogador tipo vc venceu o koga, ganhou o manto ninja e pode usar" / "e vai ter
// como comprar roupas de npcs, lojistas, etc."). Uma por líder de Kanto (vem com
// a insígnia) e outras pra COMPRAR: com os NPCs que usam ela (o pescador vende
// o chapéu dele) e na LOJA DE ROUPAS da loja de departamento de CELADON.
// Troca no menu (START → ROUPAS). O desenho é em src/systems/roupas.js.
//
// OS DESENHOS, PIXEL POR PIXEL. Cada linha tem 16 pixels; o número é a linha
// contada do TOPO DA CABEÇA (0 = o primeiro pixel do boné; nos quadros de passo
// a cabeça desce 1 e o desenho desce junto). "." = deixa o que está embaixo.
// Só "down", "up" e "left": a direita é a esquerda virada.
// Cores: e = contorno, e o resto em `cores` de cada peça.

// O CABELO SEM O BONÉ: quem bota uma peça de CABEÇA perde o boné de sempre
// (o vermelho do RED, o branco da LEAF) e aparece o cabelo, com a peça em cima.
export const CABELO = {
  hero: { cores: { H: [64, 44, 40], G: [110, 80, 70], h: [222, 148, 115], k: [255, 197, 148] }, linhas: {
    down: { 0: "....eeeeeeee....", 1: "...eHHHHHHHHe...", 2: "..eHHGGHHHHHHe..", 3: "..eHGHHHHHHHHe..", 4: ".eHHHHHHHHHHHHe.",
            5: ".eHHHHHHHHHHHHe.", 6: ".eHHHHHHHHHHHHe.", 7: ".eHHeHHHHHHeHHe.", 8: "..eHkeHHHHekHe.." },
    up: { 0: "....eeeeeeee....", 1: "...eHHHHHHHHe...", 2: "..eHHGGHHHHHHe..", 3: "..eHGHHHHHHHHe..", 4: ".eHHHHHHHHHHHHe.",
          5: ".eHHHHHHHHHHHHe.", 6: ".eHHHHHHHHHHHHe.", 7: ".eHHHHHHHHHHHHe.", 8: ".ehHHHHHHHHHHhe." },
    left: { 0: "....eeeeeeee....", 1: "...eHHHHHHHHe...", 2: "..eHHGGHHHHHHe..", 3: ".eHHGHHHHHHHHe..", 4: "eHHHHHHHHHHHHHe.",
            5: "eHHHHHHHHHHHHHe.", 6: ".eHHHHHHHHHHHe..", 7: ".eHkHHHHHHHHHe..", 8: "..ekkeHHHHHHe..." } } },
  heroina: { cores: { H: [123, 65, 65], G: [172, 123, 65], j: [255, 197, 148], e: [0, 0, 0] }, linhas: {
    down: { 0: "....eeeeeeee....", 1: "...eHHHHHHHHe...", 2: "..eHHGGHHHHHHe..", 3: "..eHGHHHHHHHHe..", 4: ".eHHHHHHHHHHHHe.",
            5: ".eHHHHHHHHHHHHe.", 6: ".eHHHHHHHHHHHHe.", 7: ".eHHeHHHHHHeHHe.", 8: ".eHHHjjjjjjHHHe." },
    up: { 0: "....eeeeeeee....", 1: "...eHHHHHHHHe...", 2: "..eHHGGHHHHHHe..", 3: "..eHGHHHHHHHHe..", 4: ".eHHHHHHHHHHHHe.",
          5: ".eHHHHHHHHHHHHe.", 6: ".eHHHHHHHHHHHHe.", 7: ".eHHHHHHHHHHHHe.", 8: ".eHHHHHHHHHHHHe." },
    left: { 0: "....eeeeeeee....", 1: "...eHHHHHHHHe...", 2: "..eHHGGHHHHHHe..", 3: ".eHHGHHHHHHHHe..", 4: "eHHHHHHHHHHHHHe.",
            5: "eHHHHHHHHHHHHHe.", 6: ".eHHHHHHHHHHHHe.", 7: ".eHjHHHHHHHHHHe.", 8: "..ejjeHHHHHHHe.." } } },
};

const Y = { Y: [248, 208, 48], y: [200, 150, 20], W: [255, 250, 210] };
export const ROUPAS = [
  // ---------------------------------------------------- AS DOS LÍDERES
  { id: "mineiro", nome: "CAPACETE DE MINEIRO", parte: "cabeca", insignia: "pedra", de: "BROCK", cores: Y, linhas: {
    down: { "-3": "......eeee......", "-2": "....eeWWWWee....", "-1": "...eYeWWWWeYe...", 0: "..eYYYeeeeYYYe..", 1: ".eYYYYYYYYYYYYe.",
            2: ".eYYYYYYYYYYYYe.", 3: ".eyYYYYYYYYYYye.", 4: "eyyyyyyyyyyyyyye", 5: "eeeeeeeeeeeeeeee" },
    up: { "-2": "....eeeeeeee....", "-1": "...eYYYYYYYYe...", 0: "..eYYYYYYYYYYe..", 1: ".eYYYYYYYYYYYYe.", 2: ".eYYYYYYYYYYYYe.",
          3: ".eyYYYYYYYYYYye.", 4: "eyyyyyyyyyyyyyye", 5: "eeeeeeeeeeeeeeee" },
    left: { "-2": ".eee..eeeeee....", "-1": "eWWWeeYYYYYYe...", 0: "eWWWeYYYYYYYYe..", 1: ".eeeYYYYYYYYYYe.", 2: "..eYYYYYYYYYYYe.",
            3: ".eyYYYYYYYYYYye.", 4: "eyyyyyyyyyyyyye.", 5: "eeeeeeeeeeeeeee." } } },
  { id: "boia", nome: "BOIA", parte: "cintura", insignia: "cascata", de: "MISTY", cores: { R: [240, 96, 64], W: [255, 255, 255] }, linhas: {
    down: { 13: "..eeeeeeeeeeee..", 14: ".eRRWWRRWWRRWWe.", 15: ".eRRWWRRWWRRWWe.", 16: "..eeeeeeeeeeee.." },
    up: { 13: "..eeeeeeeeeeee..", 14: ".eWWRRWWRRWWRRe.", 15: ".eWWRRWWRRWWRRe.", 16: "..eeeeeeeeeeee.." },
    left: { 13: "..eeeeeeeeeee...", 14: ".eWWRRWWRRWWRe..", 15: ".eWWRRWWRRWWRe..", 16: "..eeeeeeeeeee..." } } },
  { id: "militar", nome: "ÓCULOS MILITAR", parte: "rosto", insignia: "trovao", de: "LT. SURGE", cores: { G: [96, 150, 70], g: [170, 220, 120] }, linhas: {
    down: { 8: "...eeeeeeeeee...", 9: "...eGgGeeGgGe..." },
    up: { 9: "..eeeeeeeeeeee.." },
    left: { 8: ".eeeee..........", 9: ".eGgGe.........." } } },
  { id: "flores", nome: "COROA DE FLORES", parte: "cabeca", insignia: "arcoiris", de: "ERIKA",
    cores: { F: [248, 128, 176], P: [255, 220, 80], V: [80, 170, 70] }, linhas: {
    down: { "-1": "..eFe.eFe.eFe...", 0: ".eFPFeFPFeFPFe..", 1: "..eFVVeFeVVeFe.." },
    up: { "-1": "...eFe.eFe.eFe..", 0: "..eFPFeFPFeFPFe.", 1: "..eFVVeFeVVeFe.." },
    left: { "-1": ".eFe.eFe.eFe....", 0: "eFPFeFPFeFPFe...", 1: ".eFVVeFeVVeFe..." } } },
  { id: "ninja", nome: "MANTO NINJA", parte: "corpo", insignia: "alma", de: "KOGA",
    tons: [[48, 28, 72], [92, 52, 128], [150, 100, 190]], cores: { N: [70, 40, 100], n: [200, 200, 215] }, linhas: {
    down: { 3: "..eNNNNNNNNNNe..", 4: "..eNNNNnnNNNNe.." },
    up: { 3: "..eNNNNNNNNNNe..", 4: "..eNNNNNNNNNNe..", 5: "......eNNe......", 6: ".....eNe.eNe...." },
    left: { 3: ".eNNNNNNNNNNNe..", 4: ".eNnnNNNNNNNNe..", 5: "...........eNNe.", 6: "............eNe." } } },
  { id: "colher", nome: "COLHER DA SABRINA", parte: "mao", insignia: "pantano", de: "SABRINA", cores: { S: [210, 210, 225], s: [150, 150, 170] }, linhas: {
    down: { 9: ".............ee.", 10: "............eSSe", 11: "............esSe", 12: ".............ee.", 13: ".............Se.", 14: ".............Se." },
    left: { 9: ".ee.............", 10: "eSSe............", 11: "eSse............", 12: ".ee.............", 13: ".eS.............", 14: ".eS............." } } },
  { id: "escuros", nome: "ÓCULOS ESCUROS", parte: "rosto", insignia: "vulcao", de: "BLAINE", cores: { K: [30, 30, 40], k: [110, 110, 140] }, linhas: {
    down: { 8: "...eeeeeeeeee...", 9: "...eKkKeeKkKe..." },
    up: { 9: "..e..........e.." },
    left: { 8: ".eeeee..........", 9: ".eKkKe.........." } } },
  { id: "terno", nome: "TERNO DO CHEFE", parte: "corpo", insignia: "terra", de: "GIOVANNI",
    tons: [[24, 24, 30], [52, 52, 62], [96, 96, 110]], cores: { R: [210, 40, 40] }, linhas: {
    down: { 11: ".......RR.......", 12: ".......RR.......", 13: "........R......." } } },

  // ---------------------------------------------------- AS DE COMPRAR
  // `npc`: o sprite dos NPCs que vendem a deles; `loja`: vendida na LOJA DE ROUPAS de CELADON
  { id: "pescador", nome: "CHAPÉU DE PESCADOR", parte: "cabeca", npc: "pescador", preco: 1500,
    cores: { O: [150, 150, 80], o: [110, 110, 50], B: [190, 60, 50] }, linhas: {
    down: { "-1": "....eeeeeeee....", 0: "...eOOOOOOOOe...", 1: "..eOOOOOOOOOOe..", 2: "..eBBBBBBBBBBe..", 3: ".eoooooooooooooe", 4: "eeeeeeeeeeeeeeee" },
    up: { "-1": "....eeeeeeee....", 0: "...eOOOOOOOOe...", 1: "..eOOOOOOOOOOe..", 2: "..eBBBBBBBBBBe..", 3: ".eoooooooooooooe", 4: "eeeeeeeeeeeeeeee" },
    left: { "-1": "....eeeeeeee....", 0: "...eOOOOOOOOe...", 1: "..eOOOOOOOOOOe..", 2: "..eBBBBBBBBBBe..", 3: "eoooooooooooooe.", 4: "eeeeeeeeeeeeeee." } } },
  { id: "motoqueiro", nome: "CAPACETE DE MOTOQUEIRO", parte: "cabeca", npc: "motoqueiro", preco: 3000,
    cores: { P: [40, 40, 48], p: [90, 90, 104], V: [120, 200, 240], v: [200, 240, 255] }, linhas: {
    down: { "-2": "....eeeeeeee....", "-1": "...ePPpPPPPPe...", 0: "..ePPpPPPPPPPe..", 1: ".ePPPPPPPPPPPPe.", 2: ".ePPPPPPPPPPPPe.",
            3: ".ePeeeeeeeeeePe.", 4: ".ePeVVvVVVVVePe.", 5: ".ePeVVVVVVVVePe.", 6: ".ePPeeeeeeeePPe.", 7: "..ePPPPPPPPPPe.." },
    up: { "-2": "....eeeeeeee....", "-1": "...ePPpPPPPPe...", 0: "..ePPpPPPPPPPe..", 1: ".ePPPPPPPPPPPPe.", 2: ".ePPPPPPPPPPPPe.",
          3: ".ePPPPPPPPPPPPe.", 4: ".ePPPPPPPPPPPPe.", 5: ".ePPPPPPPPPPPPe.", 6: ".ePPPPPPPPPPPPe.", 7: "..ePPPPPPPPPPe.." },
    left: { "-2": "....eeeeeeee....", "-1": "...ePPpPPPPPe...", 0: "..ePPpPPPPPPPe..", 1: ".ePPPPPPPPPPPPe.", 2: "ePPPPPPPPPPPPPe.",
            3: "eeeeeeePPPPPPPe.", 4: "eVvVVVePPPPPPPe.", 5: "eVVVVVePPPPPPPe.", 6: ".eeeeePPPPPPPPe.", 7: "..ePPPPPPPPPPe.." } } },
  { id: "jaleco", nome: "JALECO DE CIENTISTA", parte: "corpo", npc: "cientista", preco: 2500,
    tons: [[150, 150, 165], [215, 215, 228], [250, 250, 255]] },
  { id: "palha", nome: "CHAPÉU DE PALHA", parte: "cabeca", loja: true, preco: 1200,
    cores: { A: [236, 200, 110], a: [196, 156, 70], R: [200, 50, 50] }, linhas: {
    down: { "-1": ".....eeeeee.....", 0: "....eAAAAAAe....", 1: "...eAAAAAAAAe...", 2: "...eRRRRRRRRe...", 3: "eeeaaaaaaaaaaeee", 4: "eAAAAAAAAAAAAAAe", 5: ".eeeeeeeeeeeeee." },
    up: { "-1": ".....eeeeee.....", 0: "....eAAAAAAe....", 1: "...eAAAAAAAAe...", 2: "...eRRRRRRRRe...", 3: "eeeaaaaaaaaaaeee", 4: "eAAAAAAAAAAAAAAe", 5: ".eeeeeeeeeeeeee." },
    left: { "-1": ".....eeeeee.....", 0: "....eAAAAAAe....", 1: "...eAAAAAAAAe...", 2: "...eRRRRRRRRe...", 3: "eeeaaaaaaaaaaeee", 4: "eAAAAAAAAAAAAAAe", 5: ".eeeeeeeeeeeeee." } } },
  { id: "pikachu", nome: "MOLETOM DO PIKACHU", parte: "corpo", loja: true, preco: 2000,
    tons: [[200, 150, 20], [248, 208, 48], [255, 236, 120]] },
  { id: "coracao", nome: "ÓCULOS DE CORAÇÃO", parte: "rosto", loja: true, preco: 900, cores: { C: [240, 70, 130], c: [255, 170, 200] }, linhas: {
    down: { 8: "...ee.ee..ee.ee.", 9: "...eCcCe.eCcCe..", 10: "....eCe...eCe..." },
    up: { 9: "..e..........e.." },
    left: { 8: ".ee.ee..........", 9: ".eCcCe..........", 10: "..eCe..........." } } },
  { id: "semBone", nome: "SEM BONÉ (SÓ O CABELO)", parte: "cabeca", gratis: true, linhas: { down: {}, up: {}, left: {} } },
];

export const ROUPAS_TEXTO = {
  titulo: "ROUPAS",
  partes: { cabeca: "CABEÇA", rosto: "ROSTO", corpo: "CORPO", cintura: "CINTURA", mao: "MÃO" },
  ganhou: (r) => [`VOCÊ GANHOU: ${r.nome}!`, `É A ROUPA DE ${r.de}. PRA USAR: MENU (START) → ROUPAS.`],
  npcOferece: (r) => `GOSTOU DO MEU ${r.nome}? TE VENDO UM IGUAL POR $${r.preco}.`,
  comprou: (r) => [`VOCÊ COMPROU: ${r.nome}!`, "PRA USAR: MENU (START) → ROUPAS."],
  semDinheiro: "VOCÊ NÃO TEM DINHEIRO PRA ISSO.",
  lojaOi: "BEM-VINDO À LOJA DE ROUPAS! O QUE VAI LEVAR?",
  lojaVazia: "VOCÊ JÁ TEM TODAS AS ROUPAS DA LOJA! VOLTE SEMPRE.",
  nenhuma: "VOCÊ AINDA NÃO TEM NENHUMA ROUPA. VENÇA OS LÍDERES OU COMPRE NAS LOJAS!",
};
