// AS ILHAS SEVII.
//
// Sete ilhas a leste de Kanto, importadas do mesmo lugar de onde veio o resto do
// mundo (tools/fetch_maps.py). Elas não se ligam a Kanto por estrada nenhuma —
// no jogo original também não —, então o que liga é A BALSA: um marinheiro no
// cais de VERMILION e outro em cada porto, e você escolhe pra onde vai.
//
// POR QUE UMA BALSA E NÃO UM WARP: um warp fixo faria as ilhas serem "o lugar
// depois da porta", e elas não são um lugar só — são sete, e a graça é escolher
// qual. O menu é a coisa; o barco é só a desculpa.
//
// A TRAVESSIA PEDE TRÊS INSÍGNIAS. Antes disso o marinheiro não te leva: as
// ilhas têm bicho de nível alto e nenhuma delas tem ginásio, então quem chega
// cedo demais atravessa o oceano pra apanhar num lugar sem prêmio.
export const SEVII = {
  requer: { insignias: 3 },

  /** O cais de VERMILION. `x,y` é onde o marinheiro fica em pé — na beirada, e
   *  não no meio, pra não tapar o caminho de quem só quer passar. */
  embarque: { mapa: "vermilion_city", x: 22, y: 32, nome: "VERMILION" },

  /** Onde a balsa te deixa em cada porto. Os sete portos são a mesma planta, e
   *  por isso o tile é o mesmo — se um dia um deles mudar, este campo vira uma
   *  coluna da tabela de baixo. */
  chegada: { x: 8, y: 4 },

  ilhas: [
    { id: "one", nome: "ILHA UM", porto: "one_island_harbor" },
    { id: "two", nome: "ILHA DOIS", porto: "two_island_harbor" },
    { id: "three", nome: "ILHA TRÊS", porto: "three_island_harbor" },
    { id: "four", nome: "ILHA QUATRO", porto: "four_island_harbor" },
    { id: "five", nome: "ILHA CINCO", porto: "five_island_harbor" },
    { id: "six", nome: "ILHA SEIS", porto: "six_island_harbor" },
    { id: "seven", nome: "ILHA SETE", porto: "seven_island_harbor" },
    // A ILHA NOVE (a ROCHA NAVEL) mora aqui junto com as outras, e não solta em
    // outro arquivo. Ela ficava definida com o CRISTAL Z, em bones.js, e por
    // isso não entrava em PORTOS — o marinheiro não aparecia no porto dela e
    // quem desembarcava ali FICAVA PRESO. Ilha é ilha: todas na mesma lista, e
    // o que muda é só quem pode ir.
    { id: "nine", nome: "ILHA NOVE", porto: "navel_rock_harbor", pedeBone: true },
  ],
};

/** OS NOMES. Sem isto o jogo monta o nome do mapa a partir do id, e sai
 *  "ONE ILHA" e "SEVEN ILHA HARBOR" — vira-lata de inglês com português, na
 *  faixa que aparece toda vez que você entra num lugar. Os nomes abaixo são a
 *  tradução de verdade, com os apelidos que as ilhas têm no jogo original. */
export const NOMES = {
  one_island: "ILHA UM", one_island_harbor: "PORTO DA ILHA UM",
  one_island_kindle_road: "ESTRADA BRASA", one_island_treasure_beach: "PRAIA DO TESOURO",
  mt_ember_exterior: "MONTE BRASA",
  two_island: "ILHA DOIS", two_island_harbor: "PORTO DA ILHA DOIS",
  two_island_cape_brink: "CABO DA BEIRA",
  three_island: "ILHA TRÊS", three_island_harbor: "PORTO DA ILHA TRÊS",
  three_island_port: "CAIS DA ILHA TRÊS", three_island_bond_bridge: "PONTE DO LAÇO",
  three_island_berry_forest: "MATA DAS FRUTAS",
  four_island: "ILHA QUATRO", four_island_harbor: "PORTO DA ILHA QUATRO",
  five_island: "ILHA CINCO", five_island_harbor: "PORTO DA ILHA CINCO",
  five_island_meadow: "CAMPINA DA ILHA CINCO", five_island_resort_gorgeous: "RESORT LUXUOSO",
  five_island_water_labyrinth: "LABIRINTO DE ÁGUA", five_island_memorial_pillar: "PILAR MEMORIAL",
  six_island: "ILHA SEIS", six_island_harbor: "PORTO DA ILHA SEIS",
  six_island_water_path: "CAMINHO D'ÁGUA", six_island_green_path: "CAMINHO VERDE",
  six_island_outcast_island: "ILHA DEGREDADA", six_island_ruin_valley: "VALE DAS RUÍNAS",
  seven_island: "ILHA SETE", seven_island_harbor: "PORTO DA ILHA SETE",
  seven_island_sevault_canyon: "CÂNION SEVAULT",
  seven_island_sevault_canyon_entrance: "ENTRADA DO CÂNION",
  seven_island_tanoby_ruins: "RUÍNAS TANOBY",
  // Centros e lojas das ilhas. Levam o nome da ilha junto porque um "CENTRO
  // POKÉMON" solto na faixa, num arquipélago de sete, não diz em qual você está
  // — e sair do centro pro lugar errado é o tipo de erro que só acontece aqui.
  one_island_pokemon_center_1f: "CENTRO POKÉMON — ILHA UM",
  two_island_pokemon_center_1f: "CENTRO POKÉMON — ILHA DOIS",
  three_island_pokemon_center_1f: "CENTRO POKÉMON — ILHA TRÊS",
  four_island_pokemon_center_1f: "CENTRO POKÉMON — ILHA QUATRO",
  five_island_pokemon_center_1f: "CENTRO POKÉMON — ILHA CINCO",
  six_island_pokemon_center_1f: "CENTRO POKÉMON — ILHA SEIS",
  seven_island_pokemon_center_1f: "CENTRO POKÉMON — ILHA SETE",
  // A ROCHA NAVEL é a ILHA NOVE: a última pedra do arquipélago, sem cidade,
  // sem loja e sem grama. Só uma escada que sobe.
  navel_rock_harbor: "PORTO DA ILHA NOVE",
  navel_rock_exterior: "ROCHA NAVEL",
  navel_rock_fork: "ESCADA DA ROCHA",
  navel_rock_base: "BASE DA ROCHA",
  navel_rock_summit: "CUME DA ROCHA",
  navel_rock_1f: "DENTRO DA ROCHA",
  navel_rock_b1f: "FUNDO DA ROCHA",
  navel_rock_summit_path_2f: "SUBIDA PRO CUME", navel_rock_summit_path_3f: "SUBIDA PRO CUME",
  navel_rock_summit_path_4f: "SUBIDA PRO CUME", navel_rock_summit_path_5f: "SUBIDA PRO CUME",
  navel_rock_base_path_b1f: "DESCIDA PRA BASE", navel_rock_base_path_b2f: "DESCIDA PRA BASE",
  navel_rock_base_path_b3f: "DESCIDA PRA BASE", navel_rock_base_path_b4f: "DESCIDA PRA BASE",
  navel_rock_base_path_b5f: "DESCIDA PRA BASE", navel_rock_base_path_b6f: "DESCIDA PRA BASE",
  navel_rock_base_path_b7f: "DESCIDA PRA BASE", navel_rock_base_path_b8f: "DESCIDA PRA BASE",
  navel_rock_base_path_b9f: "DESCIDA PRA BASE", navel_rock_base_path_b10f: "DESCIDA PRA BASE",
  navel_rock_base_path_b11f: "DESCIDA PRA BASE",
  three_island_mart: "LOJA — ILHA TRÊS",
  four_island_mart: "LOJA — ILHA QUATRO",
  six_island_mart: "LOJA — ILHA SEIS",
  seven_island_mart: "LOJA — ILHA SETE",
};

/** TODO porto de ilha — inclusive o da NOVE. É esta lista que diz onde o
 *  marinheiro fica, e porto sem marinheiro é ilha sem volta. */
export const PORTOS = SEVII.ilhas.map((i) => i.porto);
