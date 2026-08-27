// QUEM ATACA.
//
// Selvagem à vista não decide no cara ou coroa se vem pra cima de você: DECIDE
// A ESPÉCIE. Era 30% de todos, sorteado no nascimento, e isso fazia um pidgey
// atacar num dia e fugir no outro — a rota não tinha reputação nenhuma, e não
// dava pra aprender nada andando por ela. Agora é a lista aqui embaixo: o
// BEEDRILL sempre vem, o pidgey nunca vem, e depois de duas passadas pela mesma
// rota você já sabe de quem desviar.
//
// COMO ESTA LISTA FOI ESCOLHIDA: entra quem atacaria uma pessoa de verdade.
// Bicho territorial (BEEDRILL, o enxame da floresta), predador (ARBOK, os de
// briga), coisa que não pensa (VOLTORB, os fantasmas), e o que é grande demais
// pra ter medo de você (GYARADOS, os lendários). Fica de fora quem fugiria: o
// pidgey, o rattata, o magikarp, o bicho pequeno em geral.
//
// FUSÃO E MEGA HERDAM — não precisam estar aqui. A fusão é brava se QUALQUER
// uma das metades for (é por isso que LAPROCUNO ataca: o ARTICUNO ataca), e a
// mega é brava se a espécie de origem for. Sem isso, uma lista de espécies
// nunca daria conta: as fusões são 255 x 256 e ninguém vai escrever 65 mil
// linhas pra dizer quem morde.
//
// SÃO DUAS LISTAS. `BRAVOS` vem te procurar. `ARISCOS` faz o contrário: foge de
// você o tempo todo — mas se você ENCURRALAR um, ele te dá um choque e dispara.
// É o PIKACHU e companhia: não vêm atrás de ninguém, e também não são de
// apanhar calados. Quem não está em nenhuma das duas anda à toa e nunca encosta.
//
// Editar aqui vale na hora: o arquivo tem hot-swap como o resto dos dados.
export const BRAVOS = [
  // O ENXAME DA FLORESTA. Quem jogou FireRed lembra de atravessar a FLORESTA
  // VIRIDIAN torcendo pra não encostar num deles.
  "beedrill", "butterfree", "kakuna", "venonat", "venomoth", "parasect",
  "pinsir", "scyther",

  // VENENO. Nenhum destes recua.
  "ekans", "arbok", "zubat", "golbat", "grimer", "muk", "koffing", "weezing",
  "nidorina", "nidorino", "nidoqueen", "nidoking",

  // BRIGA E TERRITÓRIO
  "spearow", "fearow", "mankey", "primeape", "machop", "machoke", "machamp",
  "hitmonlee", "hitmonchan", "tauros", "kangaskhan", "dodrio", "raticate",

  // O QUE NÃO PENSA: fantasma e o que explode
  "gastly", "haunter", "gengar", "voltorb", "electrode", "cubone", "marowak",

  // GRANDE DEMAIS PRA TER MEDO DE VOCÊ
  "onix", "rhyhorn", "rhydon", "golem", "graveler", "arcanine", "charizard",
  "gyarados", "tentacruel", "kingler", "seadra", "magmar", "electabuzz",
  "dragonite", "snorlax",

  // OS LENDÁRIOS. É por causa do ARTICUNO aqui que o LAPROCUNO ataca.
  "articuno", "zapdos", "moltres", "mewtwo",

  // O QUE VAZA PELA FENDA. Lá dentro quase tudo vem pra cima — não é o mato de
  // Kanto, é o lugar onde o cartucho parou de funcionar.
  "missingno", "rotom", "porygon2", "porygonz", "shedinja", "beheeyem",
  "elgyem", "lunatone", "solrock", "archen", "cranidos", "rampardos",
  "bastiodon", "shieldon", "duskull", "dusclops", "lampent", "chandelure",
];

/** BATEM E CORREM. Fogem de você; encurralados, dão o troco e disparam.
 *
 *  A régua aqui é outra: entra o bicho pequeno, rápido ou tímido — o que
 *  fugiria de uma pessoa de verdade mas tem com que se defender. O PIKACHU é o
 *  caso exemplar (ele solta faísca e some), o ABRA é o caso extremo (ele nem
 *  espera). Quem é grande demais pra fugir está na lista de cima; quem não tem
 *  com que se defender não está em nenhuma. */
export const ARISCOS = [
  // os elétricos pequenos: dão choque e somem
  "pikachu", "raichu", "magnemite", "voltorb",

  // os que somem de verdade
  "abra", "kadabra", "ditto", "haunter",

  // pequeno, rápido e assustado
  "eevee", "vulpix", "growlithe", "meowth", "sandshrew", "nidoran-f", "nidoran-m",
  "jigglypuff", "clefairy", "psyduck", "poliwag", "goldeen", "seel", "staryu",
  "krabby", "horsea", "shellder", "ponyta", "doduo", "rattata", "pidgey",
  "caterpie", "weedle", "oddish", "bellsprout", "paras", "diglett", "dugtrio",
  "chansey", "dratini", "porygon", "lickitung", "tangela", "mr. mime",
];

