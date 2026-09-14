// DLC: REVOLTA DE DECAMARK.
//
// ?????????? é o que o cartucho mostra quando a espécie não existe: dez
// interrogações no lugar de um nome. Aqui ele SAIU do lugar dele. Nasce em
// toda rota e caverna de Kanto e das ilhas, sempre corrompido, e não foge —
// vem pra cima (BRAVOS). Na fenda ele mora em todo terreno, e pode ser o chefe
// de um rasgo. Em Cinnabar, uma pesquisadora sabe de onde ele veio e deixa um
// registro com quem quiser ler.
//
// O tipo é GLITCH, como o MISSINGNO.; os golpes são os dele. O sprite é feito
// em código (dlc/decamark.png): dez "?" tortos em cima de um chão de ruído.
const DECAMARK = "decamark";

export default {
  id: "decamark",
  nome: "REVOLTA DE DECAMARK",

  especies: {
    [DECAMARK]: {
      name: "??????????", dex: 0, types: ["GLITCH"],
      base: { hp: 90, atk: 100, def: 40, spa: 100, spd: 40, spe: 120 },
      learnset: [[1, "corrompida"], [1, "ruidobranco"], [12, "lambida"], [24, "sobrescrever"], [36, "bolasombria"]],
      dexText: "DEZ INTERROGAÇÕES ONDE DEVIA HAVER UM NOME. NÃO É UM POKÉMON. É O LUGAR ONDE UM POKÉMON DEVERIA ESTAR.",
      catchRate: 20, xpYield: 180,
      sprite: "dlc/decamark.png", spriteBack: "dlc/decamark_costas.png",
    },
  },

  // vem pra cima de você, como o BEEDRILL
  bravos: [DECAMARK],

  itens: {
    "registro 0x3f": "UMA FICHA DE PESQUISA COM O CAMPO ESPÉCIE EM BRANCO. ALGUÉM ESCREVEU ?????????? À MÃO E DEPOIS TENTOU APAGAR.",
  },

  npcs: {
    cinnabar_island: [
      { id: "dlc_pesquisadora", x: 17, y: 5, dir: "down", sprite: "cientista",
        lines: [
          "VOCÊ TAMBÉM VIU? AS INTERROGAÇÕES?",
          "O LABORATÓRIO DAQUI GUARDAVA UM REGISTRO VAZIO. UM NÚMERO SEM POKÉMON. ERA SÓ UM ESPAÇO RESERVADO.",
          "DEPOIS QUE A FENDA ABRIU, O ESPAÇO COMEÇOU A ANDAR. PRIMEIRO NAS ROTAS PERTO DAQUI. AGORA EM TODA PARTE.",
          "ELE NÃO FOGE. UM POKÉMON QUE NÃO EXISTE NÃO TEM MEDO DE NADA.",
          "LEVE O REGISTRO. É TUDO QUE SOBROU DO QUE ELE DEVIA SER.",
        ],
        gift: { item: "registro 0x3f", qty: 1 } },
    ],
  },

  placas: {
    cinnabar_island: { "12,3": "ILHA CINNABAR. AVISO: SE VIR ??????????, NÃO SALVE. SE JÁ SALVOU, NÃO ABRA." },
  },

  loot: [
    { item: "registro 0x3f", qty: [1, 1], w: 2, rare: true },
  ],

  aplicar(DB) {
    // A REVOLTA: em todo mapa de fora (e caverna) que já tem bicho, ele entra
    // também — raro, corrompido, e no nível do lugar (a faixa da tabela dali).
    const eras = new Set((DB.ERAS || []).map((e) => e.mapa));   // outro tempo não é Kanto
    for (const [id, m] of Object.entries(DB.MAPS)) {
      const t = m.encounters;
      if (!t?.length || eras.has(id) || t.some((e) => e.id === DECAMARK)) continue;
      const min = Math.min(...t.map((e) => e.min)), max = Math.max(...t.map((e) => e.max));
      t.push({ id: DECAMARK, min: Math.max(3, min), max: Math.max(min + 4, max + 3), w: 3, corrupt: true, dlc: true });
    }
    // na fenda, em todo terreno — e por isso também na lista de chefe do rasgo
    for (const terreno of ["terra", "agua", "ar"]) {
      const lista = DB.DIM_ENCOUNTERS?.[terreno];
      if (lista && !lista.some((e) => e.id === DECAMARK)) lista.push({ id: DECAMARK, min: 24, max: 40, w: 6 });
    }
    // (as GLITCH ZONES herdam a tabela da fonte, então ele já nasce lá também)
  },
};
