// AS FORMAS UNICAS: desenhos que os jogadores fizeram no UNIQUEMON
// (uniquemon/), cada um de uma especie. O PUBLICAR de la manda pro
// dev_server, que grava aqui (rota /__unica) e o PNG em assets/unicas/.
// No jogo cada uma vira uma especie propria, com os atributos e os golpes da
// original — e os tipos dela, a menos que a forma traga `tipos` proprios —, e
// se veste num bicho seu com o GUARDA-ROUPA UNICO
// (src/systems/unicas.js). Da pra editar a mao, e da pra apagar tudo:
// e so deixar o objeto vazio.
export const FORMAS_UNICAS = {
  "pikachu": [
    {
      "id": "muu6tu3bkg",
      "nome": "PIKACHU ROUPA MAMOSWINE",
      "autor": "CRIADOR DO JOGO",
      "sprite": "assets/unicas/pikachu~muu6tu3bkg.png"
    }
  ],
  "dewott": [
    {
      "id": "muu7k3m0qb",
      "nome": "DEWOTT COSPLAY HISUI",
      "autor": "CRIADOR DO JOGO",
      "sprite": "assets/unicas/dewott~muu7k3m0qb.png",
      "tipos": [
        "ÁGUA",
        "SOMBRIO"
      ],
      "evoluiPra": "samurotthisui"
    }
  ],
  "irontreads": [
    {
      "id": "muu7thcpum",
      "nome": "IRON TREADS TRISTE",
      "autor": "CRIADOR DO JOGO",
      "sprite": "assets/unicas/irontreads~muu7thcpum.png"
    }
  ],
  "hitmonchan": [
    {
      "id": "muu7zw90ce",
      "nome": "HITMONLEE SOMBRIO",
      "autor": "CRIADOR DO JOGO",
      "sprite": "assets/unicas/hitmonchan~muu7zw90ce.png",
      "tipos": [
        "LUTADOR",
        "SOMBRIO"
      ]
    }
  ],
  "goomy": [
    {
      "id": "muu89rq93",
      "nome": "GOOMY PAI E FILHO",
      "autor": "CRIADOR DO JOGO",
      "sprite": "assets/unicas/goomy~muu89rq93.png"
    },
    {
      "id": "muuam2qtfh",
      "nome": "GOOMY DE HISUI",
      "autor": "CAIO",
      "sprite": "assets/unicas/goomy~muuam2qtfh.png",
      "tipos": [
        "ÁGUA",
        "AÇO"
      ],
      "evoluiPra": "sliggoohisui"
    }
  ],
  "oshawott": [
    {
      "id": "muu8lpv04l",
      "nome": "OSHAWOTT COSPLAY DE HISU",
      "autor": "CRIADOR DO JOGO",
      "sprite": "assets/unicas/oshawott~muu8lpv04l.png",
      "tipos": [
        "ÁGUA",
        "SOMBRIO"
      ],
      "evoluiPra": "dewott:muu7k3m0qb"
    }
  ],
  "clodsire": [
    {
      "id": "muu9951u5v",
      "nome": "CLODSIRE BONÉ DO ASH",
      "autor": "CRIADOR DO JOGO",
      "sprite": "assets/unicas/clodsire~muu9951u5v.png"
    }
  ],
  "spinarak": [
    {
      "id": "muv2pgb45b",
      "nome": "SPINARAK SMURF",
      "autor": "CAIO",
      "sprite": "assets/unicas/spinarak~muv2pgb45b.png",
      "evoluiPra": "ariados"
    }
  ],
  "palkia": [
    {
      "id": "muv32qcbfr",
      "nome": "PALKIA ESTÈREO",
      "autor": "CAIO",
      "sprite": "assets/unicas/palkia~muv32qcbfr.png",
      "tipos": [
        "ELÉTRICO",
        "DRAGÃO"
      ]
    }
  ],
  "exeggutoralola": [
    {
      "id": "muv3f3aww7",
      "nome": "EXEGGUTOR DO SUCO",
      "autor": "CAIO",
      "sprite": "assets/unicas/exeggutoralola~muv3f3aww7.png"
    }
  ],
  "dialga": [
    {
      "id": "muv3irk7mv",
      "nome": "DIALGA ESTÈREO",
      "autor": "CAIO",
      "sprite": "assets/unicas/dialga~muv3irk7mv.png",
      "tipos": [
        "AÇO",
        "ELÉTRICO"
      ]
    }
  ],
  "cranidos": [
    {
      "id": "muvfo9po70",
      "nome": "CRANIDOS ÚNICO",
      "autor": "CAIO",
      "sprite": "assets/unicas/cranidos~muvfo9po70.png"
    }
  ],
  "snorlax": [
    {
      "id": "muwp8vy4ta",
      "nome": "SNORLAX NATALINO",
      "autor": "CAIO",
      "sprite": "assets/unicas/snorlax~muwp8vy4ta.png"
    }
  ],
  "shieldon": [
    {
      "id": "mv2xsbplzt",
      "nome": "SHEIDON DE GALAR",
      "autor": "CAIO",
      "sprite": "assets/unicas/shieldon~mv2xsbplzt.png",
      "tipos": [
        "AÇO",
        "LUTADOR"
      ]
    }
  ]
};
