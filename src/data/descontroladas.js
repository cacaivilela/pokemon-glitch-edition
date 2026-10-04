// AS MEGA EVOLUÇÕES DESCONTROLADAS: de noite, em alguns lugares de Kanto e de
// Braglitch, um Pokémon que mega evoluiu SOZINHO, sem treinador e sem anel, e
// não consegue voltar. Ele fica parado no mesmo lugar, com uma aura roxa
// tremendo em volta (src/scenes/overworld.js, `descontroladasNpcs`).
//
// A luta é de chefe (src/scenes/battle.js, `descontrolada`): HP multiplicado,
// ATAQUE e ATAQUE ESP. já subidos, sem bola e sem fuga, e a música dela
// (MUSIC.megaDescontrolada, src/data/music.js). Vencido, ele se acalma, volta
// ao normal e vai embora — e deixa a PEDRA MEGA dele com você. Não volta mais.
//
// `perto`: o tile de onde ele procura o chão livre mais próximo (o mapa de
// Kanto vem do decomp e muda; a posição exata é achada na hora).

export const DESCONTROLADAS = {
  /** quantas vezes o HP de um bicho normal */
  hpVezes: 3,
  /** quanto o ATAQUE e o ATAQUE ESP. já entram subidos */
  furia: 1,
  /** o nível: base + um tanto por insígnia (Kanto e Braglitch somadas) */
  nivel: { base: 28, porInsignia: 4, max: 80 },

  lista: [
    // KANTO
    { id: "beedrill", to: "megabeedrill", mapa: "viridian_forest", perto: [29, 40] },
    { id: "pidgeot", to: "megapidgeot", mapa: "route1", perto: [12, 20] },
    { id: "blastoise", to: "megablastoise", mapa: "cerulean_city", perto: [24, 20] },
    { id: "gengar", to: "megagengar", mapa: "lavender_town", perto: [12, 12] },
    { id: "venusaur", to: "megavenusaur", mapa: "celadon_city", perto: [30, 26] },
    { id: "alakazam", to: "megaalakazam", mapa: "saffron_city", perto: [33, 36] },
    { id: "slowbro", to: "megaslowbro", mapa: "fuchsia_city", perto: [24, 22] },
    { id: "charizard", to: "megacharizardx", mapa: "cinnabar_island", perto: [12, 12] },
    // BRAGLITCH
    { id: "pinsir", to: "megapinsir", mapa: "belem", perto: [15, 13] },
    { id: "gyarados", to: "megagyarados", mapa: "recife", perto: [15, 14] },
    { id: "aerodactyl", to: "megaaerodactyl", mapa: "caruaru", perto: [15, 14] },
    { id: "charizard", to: "megacharizardy", mapa: "sampa", perto: [15, 13] },
    { id: "kangaskhan", to: "megakangaskhan", mapa: "rio", perto: [15, 20] },
  ],

  textos: {
    // no mapa, ao chegar perto e falar
    aparece: [
      "UM BARULHO DE PEDRA RACHANDO... E UMA LUZ ROXA QUE NÃO PARA DE TREMER.",
      "É UM {MON}. ELE MEGA EVOLUIU SOZINHO, SEM NINGUÉM, E NÃO CONSEGUE VOLTAR.",
      "ELE ESTÁ DESCONTROLADO!",
    ],
    pergunta: "ENFRENTAR O {MON} DESCONTROLADO?",
    opcoes: ["ENFRENTAR", "SAIR DE PERTO"],
    saiu: "VOCÊ SE AFASTA DEVAGAR. ELE NEM PERCEBE: ESTÁ BRIGANDO COM A PRÓPRIA LUZ.",
    // na batalha
    entra: "O {MON} DESCONTROLADO RUGE! A AURA DELE ENCHE O CÉU!",
    furia: "A FÚRIA DEIXOU O ATAQUE E O ATAQUE ESP. DELE MAIS FORTES!",
    semBola: "A AURA DESCONTROLADA REBATE A BOLA DE VOLTA!",
    semFuga: "ELE NÃO DEIXA VOCÊ SAIR! NÃO TEM PRA ONDE FUGIR!",
    // vencido
    acalmou: [
      "A AURA ROXA APAGA DE UMA VEZ.",
      "{BASE} VOLTOU AO NORMAL. ELE OLHA PRA VOCÊ, CANSADO... E VAI EMBORA.",
    ],
    deixou: "NO CHÃO, ONDE ELE ESTAVA, FICOU UMA PEDRA BRILHANDO.",
    pedra: "VOCÊ RECEBEU A {PEDRA}!",
    jaTinha: "ERA UMA {PEDRA}. VOCÊ JÁ TEM UMA, ENTÃO VENDEU OS CACOS POR ${DIN}.",
    dinheiro: 3000,
  },
};
