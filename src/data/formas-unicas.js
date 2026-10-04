// AS FORMAS UNICAS: desenhos que os jogadores fizeram no UNIQUEMON
// (uniquemon/), cada um de uma especie. O PUBLICAR de la manda pro
// dev_server, que grava aqui (rota /__unica) e o PNG em assets/unicas/.
// No jogo cada uma vira uma especie propria, com os tipos, os atributos e os
// golpes da original, e aparece de vez em quando no mato no lugar dela
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
      "sprite": "assets/unicas/dewott~muu7k3m0qb.png"
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
      "sprite": "assets/unicas/hitmonchan~muu7zw90ce.png"
    }
  ]
};
