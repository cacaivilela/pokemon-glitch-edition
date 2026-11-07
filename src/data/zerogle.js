// O ENTERRO DO BRASEAGLE (pedido do CAIO, nov/2026): "uma missão pra ajudar um
// cara a enterrar o BRASEAGLE dele debaixo de uma lápide, e quando termina de
// enterrar ele e o jogador ouvem um uivo fantasmagórico e fofo ao mesmo tempo,
// porque o BRASEAGLE virou um ZEROGLE". Ajudou: o TOMÁS entra nos CONTATOS do
// ROTOMFONE (src/data/rotomfone.js) — é assim que se ganha contato: ajudando gente.
//
// Na TORRE POKÉMON, 2º andar. st.flags.zerogle: 1 pediu a pá, 2 tem a pá,
// 3 enterrado (a lápide nova fica no lugar).

export const ZEROGLE = {
  dono: { id: "dono_braseagle", x: 13, y: 15, dir: "up", sprite: "garoto", zerogleDono: true, lines: [] },
  lapide: { mapa: "pokemon_tower_2f", x: 13, y: 14 },
  // a zeladora do térreo (o n0 do FireRed, a WORKER_F do balcão) é quem tem a pá
  zeladora: { mapa: "pokemon_tower_1f", id: "n0" },
  nome: "TOMÁS",
  pede: [
    "TOMÁS: ...",
    "TOMÁS: O MEU BRASEAGLE... ELE ERA VELHINHO. DORMIU E NÃO ACORDOU MAIS.",
    "TOMÁS: EU QUERIA ENTERRAR ELE AQUI NA TORRE, DEBAIXO DE UMA LÁPIDE BONITA.",
    "TOMÁS: MAS EU NÃO TENHO PÁ. A ZELADORA LÁ EMBAIXO TEM UMA... VOCÊ PEDE PRA MIM?",
  ],
  esperandoPa: ["TOMÁS: A ZELADORA FICA NO TÉRREO, ATRÁS DO BALCÃO."],
  zeladora: [
    "ZELADORA: UMA PÁ? PRO MENINO DO BRASEAGLE?",
    "ZELADORA: COITADINHO... TOMA, PODE LEVAR.",
    "VOCÊ RECEBEU UMA PÁ!",
  ],
  vamos: "TOMÁS: VOCÊ TROUXE A PÁ! VAMOS ENTERRAR ELE?",
  opcoes: ["SIM", "AINDA NÃO"],
  depois: "TOMÁS: TÁ BOM. EU ESPERO AQUI COM ELE.",
  // o enterro
  comeco: ["TOMÁS: AQUI. DO LADO DOS OUTROS. ELE GOSTAVA DE COMPANHIA."],
  cava: "*CAVA*",
  despedida: [
    "TOMÁS: TCHAU, BRASEAGLE. VOCÊ FOI O MELHOR AMIGO DO MUNDO.",
    "...",
  ],
  uivo: "AUUUUUUU~♪",
  fim: [
    "TOMÁS: VOCÊ OUVIU ISSO?!",
    "TOMÁS: PARECIA ELE... SÓ QUE MAIS FOFO. E MAIS... FANTASMA.",
  ],
  // e aí a LAMBIDA: ele aparece (o ZEROGLE de verdade, a espécie 1082 de
  // Braglitch, boiando em cima da lápide dele) — confirmado!
  lambida: "*SLURP*",
  sentiu: ["TOMÁS: AI! ALGUMA COISA LAMBEU A MINHA CARA! TÁ GELADO!"],
  apareceu: [
    "TOMÁS: ...BRASEAGLE?",
    "TOMÁS: É VOCÊ! VOCÊ VIROU UM ZEROGLE!",
    "TOMÁS: VOCÊ VOLTOU PRA ME VER... *SNIF* EU SABIA QUE VOCÊ NUNCA IA ME LARGAR.",
    "TOMÁS: ME DÁ O NÚMERO DO SEU ROTOMFONE. EU TE CONTO TUDO QUE ELE APRONTAR!",
    "TOMÁS ESTÁ NOS SEUS CONTATOS!",
  ],
  // onde ele fica (boiando em cima da lápide, de frente pro TOMÁS)
  fantasma: { x: 13, y: 14.35, dir: "down" },
  visita: ["TOMÁS: ELE FICA AQUI COMIGO TODO DIA. DE NOITE O NARIZ DELE ACENDE PRA EU ACHAR O CAMINHO."],
  // O UIVO DO ZEROGLE: o "uuuu" do BRASEAGLE, de fantasma (subindo e caindo,
  // tremendo) e fofo (o "u!" agudo no fim). Toca duas vezes de leve fora do
  // tempo, que é o que dá o eco de fantasma.
  grito: {
    som: "AUUUUU~♪",
    s: [
      [420, 760, 450, "s", 4],
      [760, 980, 800, "s", 9],
      [980, 620, 1000, "s", 12],
      [0, 0, 140, "_"],
      [1400, 1750, 160, "s", 3],
      [1750, 1300, 240, "s", 6],
    ],
  },
  // a LÁPIDE NOVA, pixel por pixel (16x16), com uma patinha
  lapideGrade: [
    "................",
    ".....kkkkkkk....",
    "....keeeeeeek...",
    "...keeeeeeeeek..",
    "...keeEeEeEeek..",
    "...keeeeeeeeek..",
    "...keeeEEEeeek..",
    "...keeeEEEeeek..",
    "...keeeeeeeeek..",
    "...keeeeeeeeEk..",
    "...keeeeeeeeEk..",
    "...keeeeeeeeEk..",
    "..kkkkkkkkkkkkk.",
    "..kEEEEEEEEEEEk.",
    "..kkkkkkkkkkkkk.",
    "................",
  ],
  lapideCores: { k: "#3a3048", e: "#b8b0d0", E: "#7a7090" },
};

// o TOMÁS no ROTOMFONE (src/data/rotomfone.js)
export const CONTATO_TOMAS = {
  id: "tomas", nome: "TOMÁS", retrato: "garoto",
  tem: (st) => (st.flags?.zerogle || 0) >= 3,
  falas: () => [
    ["TOMÁS: OI! O ZEROGLE ME ACORDOU LAMBENDO A MINHA ORELHA DE NOVO.", "TOMÁS: É GELADO. E FOFO. NÃO DÁ PRA FICAR BRAVO."],
    ["TOMÁS: ESCUTA... *AUUUU~* OUVIU? É ELE! ELE UIVA QUANDO EU ATENDO O ROTOMFONE.", "TOMÁS: ACHO QUE ELE QUER FALAR COM VOCÊ TAMBÉM."],
    ["TOMÁS: DEIXEI UM BISCOITO NA LÁPIDE. ELE ATRAVESSOU O BISCOITO E FICOU TRISTE.", "TOMÁS: FANTASMA NÃO COME BISCOITO... MAS ELE CHEIRA. CHEIRAR CONTA."],
  ],
};
