// DLC: GLITCH CITY TOUR.
//
// As GLITCH ZONES têm quatro portas em Kanto (src/data/glitchzones.js). Este
// pacote põe uma em CADA cidade — sempre num canto, num beco, num tile em que
// ninguém pisa indo pra outro lugar — e um guia em Pallet que sabe a lista de
// cor. E dentro das zonas, só lá, nascem os bichos que o cartucho não devia
// ter: MISSINGNO. e um PORYGON corrompido, raros, sempre bugados.
//
// Formato: src/systems/dlc.js. As coordenadas foram escolhidas pelo mapa
// (chão livre, longe de porta, placa e NPC).
export default {
  id: "glitchcitytour",
  nome: "GLITCH CITY TOUR",

  zonas: [
    { mapa: "pallet",         x: 2,  y: 2,  nome: "O CANTO DE PALLET" },
    { mapa: "pewter_city",    x: 19, y: 15, nome: "O BECO DE PEWTER" },
    { mapa: "cerulean_city",  x: 26, y: 2,  nome: "O ALTO DE CERULEAN" },
    { mapa: "vermilion_city", x: 30, y: 25, nome: "O BECO DE VERMILION" },
    { mapa: "celadon_city",   x: 44, y: 36, nome: "OS FUNDOS DE CELADON" },
    { mapa: "fuchsia_city",   x: 45, y: 5,  nome: "A CERCA DE FUCHSIA" },
    { mapa: "saffron_city",   x: 52, y: 42, nome: "O CANTO DE SAFFRON" },
  ],

  npcs: {
    pallet: [
      { id: "dlc_guia", x: 19, y: 2, dir: "left", sprite: "cientista",
        lines: [
          "EU MAPEIO OS VÃOS. AS PORTAS QUE NÃO SÃO DESENHO DE PORTA NENHUMA.",
          "TEM UM EM CADA CIDADE AGORA. SEMPRE NUM CANTO, SEMPRE ONDE NINGUÉM OLHA.",
          "PALLET: O CANTO NOROESTE, ATRÁS DE MIM. PEWTER: UM BECO NO MEIO DA CIDADE.",
          "CERULEAN: LÁ EM CIMA, NO ALTO. VERMILION: O BECO PERTO DO CAIS.",
          "CELADON: OS FUNDOS, NO SUDESTE. FUCHSIA: A CERCA DO NORDESTE. SAFFRON: O CANTO SUL.",
          "E OS DE SEMPRE: A COSTA DE CINNABAR, A CERCA DO SAFÁRI, O BECO DE LAVENDER, ATRÁS DO CENTRO DE VIRIDIAN.",
          "ELES SÓ APARECEM DEPOIS QUE A FENDA FOI ABERTA. ANTES DISSO, É SÓ PAREDE.",
          "LÁ DENTRO TEM COISA QUE NÃO NASCE AQUI FORA. NÃO SALVE DEPOIS DE VER.",
        ] },
    ],
  },

  placas: {
    pallet: { "4,7": "VILA PALETA. HÁ UM VÃO NO CANTO NOROESTE. NÃO É UMA PORTA. ATRAVESSE." },
  },

  aplicar(DB) {
    // os bichos que só nascem DENTRO das zonas (src/systems/glitchzones.js lê
    // GLITCH_ZONES.encontrosExtra ao montar cada uma). `corrupt: true` vale
    // sempre, independente da corrupção do save.
    DB.GLITCH_ZONES.encontrosExtra = [
      { id: "missingno", min: 8, max: 24, w: 4, corrupt: true },
      { id: "porygon",   min: 15, max: 30, w: 3, corrupt: true },
      { id: "unown",     min: 10, max: 20, w: 2, corrupt: true },
    ].filter((e) => DB.SPECIES[e.id]);
  },
};
