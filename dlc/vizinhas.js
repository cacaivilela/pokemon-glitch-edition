// DLC: REGIÕES VIZINHAS.
//
// Os iniciais das outras regiões e as formas regionais saem da fenda — que é
// onde eles moram neste jogo (src/data/iniciais.js, src/data/regionais.js) —
// e passam a nascer no mato de Kanto, cada um num lugar que combina: a neve de
// Alola no Monte Moon, os de Galar na floresta, os de Hisui na Rota 10, os de
// Paldea perto da água. Uma viajante em Celadon explica de onde cada um veio.
//
// Os nove cartões: um de cada região — os oito iniciais de Johto a Paldea (um
// por região, sorteado à mão) e uma forma de Galar com cara de Kanto.
export default {
  id: "vizinhas",
  nome: "REGIÕES VIZINHAS",

  encontrosExtra: {
    // ALOLA: neve e vulcão — o Monte Moon e a Ilha Cinnabar não têm neve, mas
    // têm o que Alola tem de sobra: pedra e caverna
    mt_moon_1f:       [{ id: "vulpixalola", min: 10, max: 14, w: 4 }, { id: "sandshrewalola", min: 10, max: 14, w: 4 }],
    mt_moon_b2f:      [{ id: "geodudealola", min: 11, max: 15, w: 5 }],
    // GALAR: a floresta e a rota de fora
    viridian_forest:  [{ id: "zigzagoongalar", min: 4, max: 7, w: 6 }],
    route2:           [{ id: "meowthgalar", min: 4, max: 7, w: 4 }],
    route22:          [{ id: "ponytagalar", min: 5, max: 8, w: 3 }],
    // HISUI: a rota das montanhas e a caverna de pedra
    route10:          [{ id: "growlithehisui", min: 14, max: 18, w: 4 }, { id: "sneaselhisui", min: 15, max: 19, w: 3 }],
    rock_tunnel_1f:   [{ id: "voltorbhisui", min: 15, max: 20, w: 4 }],
    // PALDEA: beira d'água
    route12:          [{ id: "wooperpaldea", min: 12, max: 16, w: 6 }],
    route21_north:    [{ id: "wooperpaldea", min: 12, max: 16, w: 6 }],
  },

  npcs: {
    celadon_city: [
      { id: "dlc_viajante", x: 25, y: 15, dir: "down", sprite: "garota",
        lines: [
          "EU JÁ ANDEI POR TODAS AS REGIÕES. AGORA ELAS ANDARAM ATÉ AQUI.",
          "O VULPIX DE ALOLA ESTÁ NO MONTE MOON. FRIO O BASTANTE PRA ELE.",
          "OS DE GALAR FICARAM NA FLORESTA E NA ROTA 2. O MEOWTH DE LÁ É DE FERRO, CUIDADO COM O DEDO.",
          "OS DE HISUI SUBIRAM PRA ROTA 10. O GROWLITHE DE LÁ TEM PEDRA NA CABEÇA.",
          "E O WOOPER DE PALDEA GOSTA DE BEIRA DE RIO. ROTA 12, ROTA 21.",
          "SÃO OS MESMOS BICHOS. CRIADOS EM OUTRO LUGAR.",
        ] },
    ],
  },

  placas: {
    celadon_city: { "45,23": "CELADON — CIDADE DE TODAS AS REGIÕES. PERGUNTE À VIAJANTE." },
  },

  presentes: {
    VIZINHAS001: { titulo: "DE JOHTO", texto: "UMA CHIKORITA COM UMA FOLHA NA CABEÇA E O CHEIRO DE OUTRA REGIÃO.", de: "PROF. ELM", mons: [{ id: "chikorita", nv: 8 }] },
    VIZINHAS002: { titulo: "DE HOENN", texto: "UM TORCHIC. O ENVELOPE VEIO QUENTE.", de: "PROF. BIRCH", mons: [{ id: "torchic", nv: 8 }] },
    VIZINHAS003: { titulo: "DE SINNOH", texto: "UM PIPLUP QUE NÃO ACEITA ORDEM DE NINGUÉM. É ORGULHO, DIZEM.", de: "PROF. ROWAN", mons: [{ id: "piplup", nv: 8 }] },
    VIZINHAS004: { titulo: "DE UNOVA", texto: "UM SNIVY. ELE TE OLHA COMO SE VOCÊ ESTIVESSE ATRASADO.", de: "PROF. JUNIPER", mons: [{ id: "snivy", nv: 8 }] },
    VIZINHAS005: { titulo: "DE KALOS", texto: "UM FROAKIE. A ESPUMA É PARTE DELE, NÃO LAVE.", de: "PROF. SYCAMORE", mons: [{ id: "froakie", nv: 8 }] },
    VIZINHAS006: { titulo: "DE ALOLA", texto: "UM ROWLET. DORME DE DIA. ACORDA SE VOCÊ ABRIR A BOLA DEVAGAR.", de: "PROF. KUKUI", mons: [{ id: "rowlet", nv: 8 }] },
    VIZINHAS007: { titulo: "DE GALAR", texto: "UM GROOKEY COM UM GRAVETO. O GRAVETO É IMPORTANTE. NÃO TIRE.", de: "PROF. MAGNOLIA", mons: [{ id: "grookey", nv: 8 }] },
    VIZINHAS008: { titulo: "DE PALDEA", texto: "UMA SPRIGATITO. ELA JÁ DECIDIU QUE A CASA É DELA.", de: "PROF. SADA", mons: [{ id: "sprigatito", nv: 8 }] },
    VIZINHAS009: { titulo: "O MEOWTH DE FERRO", texto: "UM MEOWTH DE GALAR, SHINY. OS VIKINGS DE LÁ NÃO QUISERAM DEVOLVER. ELE VEIO SOZINHO.", de: "?", mons: [{ id: "meowthgalar", nv: 20, shiny: true }] },
  },
};
