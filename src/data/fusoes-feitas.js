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
      "sprite": "data:image/png;base64,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"
    }
  ]
};
