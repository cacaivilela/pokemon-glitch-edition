// FICHAS PUBLICADAS PELOS JOGADORES.
//
// Este arquivo e ESCRITO PELO JOGO: ao terminar uma ficha na oficina,
// PUBLICAR manda ela pro dev_server, que grava aqui (rota /__ficha). Dai em
// diante ela entra na lista de variantes daquela dupla, com o nome de quem
// fez, do mesmo jeito que as fusoes que ja vem no jogo (src/data/fusoes.js)
// -- e vale pra qualquer partida deste computador, inclusive um jogo novo.
//
// Da pra editar a mao, e da pra apagar tudo: e so deixar o objeto vazio. O
// desenho vem junto, em PNG, dentro do campo `sprite`.
export const FUSOES_FEITAS = {
  "butterfree+pikachu": [
    {
      "id": "butterchuu",
      "nome": "BUTTERCHUU",
      "autor": "VERMELHO",
      "tipos": [
        "INSETO",
        "ELÉTRICO"
      ],
      "inicial": {
        "hp": 10,
        "atk": 5,
        "def": 5,
        "spa": 5,
        "spd": 5,
        "spe": 126
      },
      "crescimento": {
        "hp": 2.3,
        "atk": 1,
        "def": 0.9,
        "spa": 1.4,
        "spd": 1.4,
        "spe": 9
      },
      "sprite": "assets/fusoes/butterfree+pikachu~butterchuu.png"
    }
  ],
  "bulbasaur+vileplume": [
    {
      "id": "bulbaplume",
      "nome": "BULBAPLUME",
      "autor": "VERMELHO",
      "tipos": [
        "PLANTA",
        "VENENO"
      ],
      "inicial": {
        "hp": 10,
        "atk": 19,
        "def": 5,
        "spa": 6,
        "spd": 6,
        "spe": 5
      },
      "crescimento": {
        "hp": 2.4,
        "atk": 1.2,
        "def": 1.6,
        "spa": 1.6,
        "spd": 1.7,
        "spe": 1.1
      },
      "sprite": "assets/fusoes/bulbasaur+vileplume~bulbaplume.png"
    }
  ],
  "magneton+magnemite": [
    {
      "id": "magnet",
      "nome": "MAGNET",
      "autor": "VERMELHO",
      "tipos": [
        "ELÉTRICO",
        "AÇO"
      ],
      "inicial": {
        "hp": 10,
        "atk": 5,
        "def": 5,
        "spa": 5,
        "spd": 5,
        "spe": 5
      },
      "crescimento": {
        "hp": 2,
        "atk": 1.3,
        "def": 1.9,
        "spa": 2.5,
        "spd": 1.6,
        "spe": 1.4
      },
      "sprite": "assets/fusoes/magneton+magnemite~magnet.png"
    }
  ],
  "lapras+kabutops": [
    {
      "id": "laprutops",
      "nome": "LAPRUTOPS",
      "autor": "VERMELHO",
      "tipos": [
        "ÁGUA",
        "PEDRA"
      ],
      "inicial": {
        "hp": 10,
        "atk": 5,
        "def": 5,
        "spa": 5,
        "spd": 5,
        "spe": 5
      },
      "crescimento": {
        "hp": 3.1,
        "atk": 2.1,
        "def": 1.9,
        "spa": 1.6,
        "spd": 1.7,
        "spe": 1.5
      },
      "sprite": "assets/fusoes/lapras+kabutops~laprutops.png"
    }
  ],
  "pidgeotto+clefairy": [
    {
      "id": "pidgeotairy",
      "nome": "PIDGEOTAIRY",
      "autor": "VERMELHO",
      "tipos": [
        "NORMAL"
      ],
      "inicial": {
        "hp": 11,
        "atk": 6,
        "def": 6,
        "spa": 7,
        "spd": 6,
        "spe": 6
      },
      "crescimento": {
        "hp": 2.4,
        "atk": 1.2,
        "def": 1.2,
        "spa": 1.3,
        "spd": 1.2,
        "spe": 1.1
      },
      "sprite": "assets/fusoes/pidgeotto+clefairy~pidgeotairy.png"
    }
  ],
  "rattata+pidgey": [
    {
      "id": "rattadgey",
      "nome": "RATTADGEY",
      "autor": "VERMELHO",
      "tipos": [
        "NORMAL",
        "VOADOR"
      ],
      "inicial": {
        "hp": 10,
        "atk": 5,
        "def": 5,
        "spa": 5,
        "spd": 5,
        "spe": 9
      },
      "crescimento": {
        "hp": 1.9,
        "atk": 1.2,
        "def": 0.9,
        "spa": 0.7,
        "spd": 1,
        "spe": 2.6
      },
      "sprite": "assets/fusoes/rattata+pidgey~rattadgey.png"
    }
  ],
  "metapod+butterfree": [
    {
      "id": "metarfree",
      "nome": "METARFREE",
      "autor": "VERMELHO",
      "tipos": [
        "INSETO",
        "VOADOR"
      ],
      "inicial": {
        "hp": 10,
        "atk": 11,
        "def": 99,
        "spa": 7,
        "spd": 6,
        "spe": 6
      },
      "crescimento": {
        "hp": 2.1,
        "atk": 1,
        "def": 9,
        "spa": 1.1,
        "spd": 1.4,
        "spe": 1.1
      },
      "sprite": "assets/fusoes/metapod+butterfree~metarfree.png"
    }
  ],
  "rayquaza+kyogre": [
    {
      "id": "rayogre",
      "nome": "RAYOGRE",
      "autor": "VERMELHO",
      "tipos": [
        "DRAGÃO",
        "ÁGUA"
      ],
      "inicial": {
        "hp": 12,
        "atk": 6,
        "def": 7,
        "spa": 7,
        "spd": 8,
        "spe": 13
      },
      "crescimento": {
        "hp": 3.1,
        "atk": 2.3,
        "def": 1.8,
        "spa": 3,
        "spd": 2.1,
        "spe": 1.8
      },
      "sprite": "assets/fusoes/rayquaza+kyogre~rayogre.png"
    }
  ],
  "unown+unown": [
    {
      "id": "kingunown",
      "nome": "KING UNOWN",
      "autor": "VERMELHO",
      "tipos": [
        "PSÍQUICO",
        "AÇO"
      ],
      "inicial": {
        "hp": 10,
        "atk": 5,
        "def": 5,
        "spa": 5,
        "spd": 5,
        "spe": 5
      },
      "crescimento": {
        "hp": 2,
        "atk": 1.4,
        "def": 2.5,
        "spa": 1.4,
        "spd": 1,
        "spe": 1
      },
      "sprite": "assets/fusoes/unown+unown~kingunown.png"
    }
  ],
  "ditto+charizard": [
    {
      "id": "dizard",
      "nome": "DIZARD",
      "autor": "VERMELHO",
      "tipos": [
        "FOGO",
        "VOADOR"
      ],
      "inicial": {
        "hp": 10,
        "atk": 5,
        "def": 5,
        "spa": 5,
        "spd": 5,
        "spe": 5
      },
      "crescimento": {
        "hp": 2.3,
        "atk": 1.6,
        "def": 1.6,
        "spa": 1.8,
        "spd": 1.6,
        "spe": 1.7
      },
      "sprite": "assets/fusoes/ditto+charizard~dizard.png"
    }
  ],
  "pikachu+arbok": [
    {
      "id": "pikarbok",
      "nome": "PIKARBOK",
      "autor": "VERMELHO",
      "tipos": [
        "ELÉTRICO",
        "VENENO"
      ],
      "inicial": {
        "hp": 10,
        "atk": 7,
        "def": 6,
        "spa": 6,
        "spd": 6,
        "spe": 7
      },
      "crescimento": {
        "hp": 3.5,
        "atk": 2.1,
        "def": 1.4,
        "spa": 1.5,
        "spd": 1.5,
        "spe": 3
      },
      "sprite": "assets/fusoes/pikachu+arbok~pikarbok.png"
    }
  ],
  "snorlax+ditto": [
    {
      "id": "snotto",
      "nome": "SNOTTO",
      "autor": "VERMELHO",
      "tipos": [
        "NORMAL",
        "FADA"
      ],
      "inicial": {
        "hp": 10,
        "atk": 5,
        "def": 5,
        "spa": 5,
        "spd": 5,
        "spe": 0
      },
      "crescimento": {
        "hp": 3.4,
        "atk": 1.4,
        "def": 4.3,
        "spa": 1.2,
        "spd": 1.8,
        "spe": 0.6
      },
      "sprite": "assets/fusoes/snorlax+ditto~snotto.png"
    }
  ],
  "flareon+magikarp": [
    {
      "id": "flakarp",
      "nome": "FLAKARP",
      "autor": "CAIO",
      "tipos": [
        "FOGO",
        "ÁGUA"
      ],
      "inicial": {
        "hp": 10,
        "atk": 5,
        "def": 5,
        "spa": 5,
        "spd": 5,
        "spe": 5
      },
      "crescimento": {
        "hp": 6.4,
        "atk": 4.5,
        "def": 2.9,
        "spa": 8.4,
        "spd": 6.5,
        "spe": 9
      },
      "sprite": "assets/fusoes/flareon+magikarp~flakarp.png",
      "lore": "FLAREON NA CABEÇA, MAGIKARP NO CORPO."
    }
  ],
  "magikarp+gyarados": [
    {
      "id": "magikyrados",
      "nome": "MAGIKYRADOS",
      "autor": "CAIO",
      "tipos": [
        "ÁGUA",
        "VOADOR"
      ],
      "inicial": {
        "hp": 10,
        "atk": 5,
        "def": 5,
        "spa": 5,
        "spd": 5,
        "spe": 5
      },
      "crescimento": {
        "hp": 6.4,
        "atk": 4.5,
        "def": 2.9,
        "spa": 8.4,
        "spd": 6.5,
        "spe": 9
      },
      "sprite": "assets/fusoes/magikarp+gyarados~magikyrados.png",
      "lore": "MAGIKARP NA CABEÇA, GYARADOS NO CORPO."
    }
  ],
  "blastoise+jynx": [
    {
      "id": "blastoijynx",
      "nome": "BLASTOIJYNX",
      "autor": "CAIO",
      "tipos": [
        "ÁGUA",
        "PSÍQUICO"
      ],
      "inicial": {
        "hp": 10,
        "atk": 5,
        "def": 5,
        "spa": 5,
        "spd": 5,
        "spe": 5
      },
      "crescimento": {
        "hp": 6.4,
        "atk": 4.5,
        "def": 2.9,
        "spa": 8.4,
        "spd": 6.5,
        "spe": 9
      },
      "sprite": "assets/fusoes/blastoise+jynx~blastoijynx.png",
      "lore": "BLASTOISE NA CABEÇA, JYNX NO CORPO."
    }
  ],
  "pikachu+caterpie": [
    {
      "id": "pikarpie",
      "nome": "PIKARPIE",
      "autor": "CAIO",
      "tipos": [
        "ELÉTRICO",
        "INSETO"
      ],
      "inicial": {
        "hp": 10,
        "atk": 5,
        "def": 5,
        "spa": 5,
        "spd": 5,
        "spe": 5
      },
      "crescimento": {
        "hp": 2,
        "atk": 1.5,
        "def": 1.5,
        "spa": 1.5,
        "spd": 1.5,
        "spe": 1.5
      },
      "sprite": "assets/fusoes/pikachu+caterpie~pikarpie.png",
      "lore": "PIKACHU NA CABEÇA, CATERPIE NO CORPO."
    }
  ],
  "porygon+xerneas": [
    {
      "id": "porygoneas",
      "nome": "PORYGONEAS",
      "autor": "CAIO",
      "tipos": [
        "NORMAL",
        "FADA"
      ],
      "inicial": {
        "hp": 10,
        "atk": 5,
        "def": 5,
        "spa": 5,
        "spd": 5,
        "spe": 5
      },
      "crescimento": {
        "hp": 2,
        "atk": 1.5,
        "def": 1.5,
        "spa": 1.5,
        "spd": 1.5,
        "spe": 1.5
      },
      "sprite": "assets/fusoes/porygon+xerneas~porygoneas.png",
      "lore": "PORYGON NA CABEÇA, XERNEAS NO CORPO."
    }
  ],
  "butterfree+eevee": [
    {
      "id": "buttervee",
      "nome": "BUTTERVEE",
      "autor": "CAIO",
      "tipos": [
        "INSETO",
        "NORMAL"
      ],
      "inicial": {
        "hp": 10,
        "atk": 5,
        "def": 5,
        "spa": 5,
        "spd": 5,
        "spe": 5
      },
      "crescimento": {
        "hp": 3.4,
        "atk": 7.3,
        "def": 6.3,
        "spa": 2.9,
        "spd": 3.5,
        "spe": 5.9
      },
      "sprite": "assets/fusoes/butterfree+eevee~buttervee.png",
      "lore": "BUTTERFREE NA CABEÇA, EEVEE NO CORPO."
    }
  ],
  "electabuzz+poliwag": [
    {
      "id": "electawag",
      "nome": "ELECTAWAG",
      "autor": "CAIO",
      "tipos": [
        "ELÉTRICO",
        "ÁGUA"
      ],
      "inicial": {
        "hp": 10,
        "atk": 5,
        "def": 5,
        "spa": 5,
        "spd": 5,
        "spe": 5
      },
      "crescimento": {
        "hp": 3.4,
        "atk": 7.3,
        "def": 6.3,
        "spa": 2.9,
        "spd": 3.5,
        "spe": 5.9
      },
      "sprite": "assets/fusoes/electabuzz+poliwag~electawag.png",
      "lore": "ELECTABUZZ NA CABEÇA, POLIWAG NO CORPO."
    }
  ],
  "hypno+muk": [
    {
      "id": "hypmuk",
      "nome": "HYPMUK",
      "autor": "CAIO",
      "tipos": [
        "PSÍQUICO",
        "VENENO"
      ],
      "inicial": {
        "hp": 10,
        "atk": 5,
        "def": 5,
        "spa": 5,
        "spd": 5,
        "spe": 5
      },
      "crescimento": {
        "hp": 2.8,
        "atk": 4.9,
        "def": 4.4,
        "spa": 1.5,
        "spd": 3.2,
        "spe": 7.4
      },
      "sprite": "assets/fusoes/hypno+muk~hypmuk.png",
      "lore": "HYPNO NA CABEÇA, MUK NO CORPO."
    }
  ],
  "unown+staryu": [
    {
      "id": "unownie",
      "nome": "UNOWNIE",
      "autor": "CAIO",
      "tipos": [
        "PSÍQUICO",
        "ÁGUA"
      ],
      "inicial": {
        "hp": 10,
        "atk": 5,
        "def": 5,
        "spa": 5,
        "spd": 5,
        "spe": 5
      },
      "crescimento": {
        "hp": 7.1,
        "atk": 6.7,
        "def": 2.6,
        "spa": 7.1,
        "spd": 5.6,
        "spe": 5.6
      },
      "sprite": "assets/fusoes/unown+staryu~unownie.png",
      "lore": "UNOWN NA CABEÇA, STARYU NO CORPO."
    }
  ],
  "rotom+rattata": [
    {
      "id": "rota",
      "nome": "ROTA",
      "autor": "CAIO",
      "tipos": [
        "ELÉTRICO",
        "NORMAL"
      ],
      "inicial": {
        "hp": 10,
        "atk": 5,
        "def": 5,
        "spa": 5,
        "spd": 5,
        "spe": 5
      },
      "crescimento": {
        "hp": 7.1,
        "atk": 6.7,
        "def": 2.6,
        "spa": 7.1,
        "spd": 5.6,
        "spe": 5.6
      },
      "sprite": "assets/fusoes/rotom+rattata~rota.png",
      "lore": "ROTOM NA CABEÇA, RATTATA NO CORPO."
    }
  ],
  "primeape+poliwhirl": [
    {
      "id": "primeawhirl",
      "nome": "PRIMEAWHIRL",
      "autor": "CAIO",
      "tipos": [
        "LUTADOR",
        "ÁGUA"
      ],
      "inicial": {
        "hp": 10,
        "atk": 5,
        "def": 5,
        "spa": 5,
        "spd": 5,
        "spe": 5
      },
      "crescimento": {
        "hp": 7.1,
        "atk": 6.7,
        "def": 2.6,
        "spa": 7.1,
        "spd": 5.6,
        "spe": 5.6
      },
      "sprite": "assets/fusoes/primeape+poliwhirl~primeawhirl.png",
      "lore": "PRIMEAPE NA CABEÇA, POLIWHIRL NO CORPO."
    }
  ],
  "krabby+geodude": [
    {
      "id": "krade",
      "nome": "KRADE",
      "autor": "CAIO",
      "tipos": [
        "ÁGUA",
        "TERRA"
      ],
      "inicial": {
        "hp": 10,
        "atk": 5,
        "def": 5,
        "spa": 5,
        "spd": 5,
        "spe": 5
      },
      "crescimento": {
        "hp": 5.2,
        "atk": 6.7,
        "def": 7.1,
        "spa": 3.4,
        "spd": 2.9,
        "spe": 3.4
      },
      "sprite": "assets/fusoes/krabby+geodude~krade.png",
      "lore": "KRABBY NA CABEÇA, GEODUDE NO CORPO."
    }
  ],
  "rotom+pikachu": [
    {
      "id": "rochu",
      "nome": "ROTOM CHU",
      "autor": "CAIO",
      "tipos": [
        "ELÉTRICO"
      ],
      "inicial": {
        "hp": 10,
        "atk": 5,
        "def": 5,
        "spa": 5,
        "spd": 5,
        "spe": 5
      },
      "crescimento": {
        "hp": 5.2,
        "atk": 6.7,
        "def": 7.1,
        "spa": 3.4,
        "spd": 2.9,
        "spe": 3.4
      },
      "sprite": "assets/fusoes/rotom+pikachu~rochu.png",
      "lore": "ROTOM ENTROU NO PIKACHU E NÃO SAIU MAIS. A DESCARGA CORRE POR FORA DO CORPO, AZUL."
    }
  ]
};
