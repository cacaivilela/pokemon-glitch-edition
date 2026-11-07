// QUAL MÚSICA DO FIRERED TOCA EM CADA LUGAR DE KANTO (as músicas estão em
// src/data/musicas-frlg.js). Segue o próprio FireRed: VIRIDIAN, PEWTER e
// SAFFRON dividem a mesma; CERULEAN e FUCHSIA também; ROTA 1 e 2 têm a delas,
// 11 a 15 outra, 24 e 25 outra, e o resto das rotas toca a da ROTA 3.
//
// Só troca quem ainda está com a música genérica de antes (`de`): uma loja
// dentro de CELADON continua com a da loja.

/** [música de antes, teste do id do mapa, música do FireRed] — o primeiro que
 *  casar ganha */
const REGRAS = [
  ["pallet", /^pallet$/, "frPallet"],
  ["lab", /^lab$/, "frLab"],
  ["center", /./, "frCentro"],
  ["gym", /./, "frGinasio"],
  // as cavernas que têm música própria no FireRed
  ["cave", /^victory_road/, "frEstradaVitoria"],
  ["cave", /^five_island_lost_cave/, "frSeviiMasmorra"],
  ["cave", /^(four_island_icefall_cave|six_island_altering_cave)/, "frSeviiCaverna"],
  ["cave", /^(mt_moon|rock_tunnel|victory_road|digletts_cave|cerulean_cave|five_island_lost_cave|four_island_icefall_cave|six_island_altering_cave)/, "frCaverna"],
  ["casa", /^pokemon_tower_/, "frTorre"],
  // OS PRÉDIOS que têm música própria (31/out/2026)
  ["casa", /^silph_co/, "frSilph"],
  ["casa", /^rocket_hideout/, "frEsconderijo"],
  ["casa", /^pokemon_mansion/, "frMansao"],
  ["casa", /^celadon_city_game_corner/, "frCassino"],
  ["casa", /^trainer_tower/, "frTorreTreinador"],
  ["casa", /^(home|quarto)$/, "frPallet"],                 // a sua casa é em PALLET
  ["casa", /^(fuchsia_city_safari|safari_zone)/, "frFuchsia"],
  // as portarias das rotas tocam a música da rota
  ["casa", /^route(2|22)_/, "frRota1"],
  ["casa", /^route1[1-5]_/, "frRota11"],
  ["casa", /^route\d+_/, "frRota3"],
  // AS LOJAS tocam a música da cidade, como no FireRed
  ["mart", /^(pewter_city|saffron_city)_/, "frPewter"],
  ["mart", /^(cerulean_city|fuchsia_city)_/, "frFuchsia"],
  ["mart", /^vermilion_city_/, "frVermilion"],
  ["mart", /^lavender_town_/, "frLavender"],
  ["mart", /^celadon_city_/, "frCeladon"],
  ["mart", /^cinnabar_island_/, "frCinnabar"],
  ["mart", /^three_island_/, "frSevii"],
  ["mart", /^four_island_/, "frSevii45"],
  ["mart", /^(six|seven)_island_/, "frSevii67"],
  // A CICLOVIA
  ["route", /^route17$/, "frBicicleta"],
  ["route", /^route(1|2|22)$/, "frRota1"],
  ["route", /^route1[1-5]$/, "frRota11"],
  ["route", /^route2[45]$/, "frRota24"],
  ["route", /./, "frRota3"],
  ["viridian", /^viridian_forest$/, "frFloresta"],
  ["viridian", /^(viridian|pewter_city|saffron_city)$/, "frPewter"],
  ["viridian", /^(cerulean_city|fuchsia_city)$/, "frFuchsia"],
  ["viridian", /^vermilion_city$/, "frVermilion"],
  ["viridian", /^lavender_town$/, "frLavender"],
  ["viridian", /^celadon_city$/, "frCeladon"],
  ["viridian", /^cinnabar_island$/, "frCinnabar"],
  ["viridian", /^(one|two|three)_island(_harbor)?$/, "frSevii"],
  // AS ILHAS SEVII (31/out/2026): as cidades da 4 a 7, as cavernas e o resto
  ["viridian", /^(four|five)_island(_harbor)?$/, "frSevii45"],
  ["viridian", /^(six|seven)_island(_harbor)?$/, "frSevii67"],
  ["viridian", /^seven_island_trainer_tower/, "frTorreTreinador"],
  ["viridian", /^seafoam_islands/, "frCaverna"],
  ["viridian", /^safari_zone/, "frFuchsia"],
  ["viridian", /(dotted_hole|dunsparce_tunnel|pattern_bush|_path_|ruby_path|summit_path)/, "frSeviiCaverna"],
  ["viridian", /^navel_rock/, "frSeviiMasmorra"],
  ["viridian", /^(one|two|three|four|five|six|seven)_island_|^mt_ember/, "frSeviiRota"],
];

/** Troca a música dos mapas de Kanto pelas do FireRed. */
export function musicasDoFirered(db) {
  for (const [id, mapa] of Object.entries(db.MAPS)) {
    // só KANTO (e as ilhas): Braglitch, Lumiose, a fenda e as eras têm as delas
    const g = db.KANTO?.[id];
    if (g?.braglitch || g?.regiao || /^lumiose|glitch|era_|void/.test(id)) continue;
    const r = REGRAS.find(([de, teste, fr]) => mapa.music === de && teste.test(id) && db.MUSIC[fr]);
    if (r) mapa.music = r[2];
  }
}
