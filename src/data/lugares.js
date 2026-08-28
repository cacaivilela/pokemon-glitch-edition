// OS NOMES DOS LUGARES FECHADOS.
//
// As cavernas, torres e prédios que entraram depois (109 mapas) chegam com id
// em inglês, e sem tradução o jogo monta o nome a partir do id: sai "CERULEAN
// CAVE 1F" e "FIVE ISLAND LOST CAVE ROOM3" na faixa que aparece toda vez que
// alguém entra num lugar. É o mesmo problema que as SEVII já tinham (ver NOMES
// em src/data/sevii.js) — só que agora em escala.
//
// AQUI NÃO TEM TABELA DE 109 LINHAS, e é de propósito. Cento e nove nomes
// escritos à mão são cento e nove chances de esquecer um, e o esquecido só
// aparece pra quem chegar lá. O nome sai de DUAS PEÇAS:
//
//   LUGAR   o nome próprio       cerulean_cave  -> CAVERNA CELESTE
//   PARTE   o pedaço final       _b2f           -> SUBSOLO 2
//
// Assim um andar novo do decomp já nasce com nome certo, e quem quiser mudar um
// nome muda num lugar só. Só entra em LUGAR o que é NOME PRÓPRIO; o resto é
// regra.

/** Os nomes próprios, do pedaço mais longo pro mais curto (a busca é por
 *  prefixo, e "mt_ember_ruby_path" tem que ganhar de "mt_ember"). */
const LUGAR = {
  cerulean_cave: "CAVERNA CELESTE",
  seafoam_islands: "ILHAS ESPUMA",
  pokemon_tower: "TORRE POKÉMON",
  pokemon_mansion: "MANSÃO ABANDONADA",
  rocket_hideout: "ESCONDERIJO ROCKET",
  silph_co: "SILPH S.A.",
  safari_zone: "ZONA SAFÁRI",
  fuchsia_city_safari_zone: "PORTARIA DO SAFÁRI",
  mt_ember_ruby_path: "CAMINHO RUBI",
  mt_ember_summit_path: "SUBIDA DO CUME",
  mt_ember: "MONTE BRASA",
  four_island_icefall_cave: "CAVERNA DO GELO",
  five_island_lost_cave: "CAVERNA PERDIDA",
  six_island_dotted_hole: "BURACO PONTILHADO",
  six_island_altering_cave: "CAVERNA QUE MUDA",
  six_island_pattern_bush: "MATO DOS DESENHOS",
  three_island_dunsparce_tunnel: "TÚNEL DUNSPARCE",
  seven_island_trainer_tower: "TORRE DOS TREINADORES",
  trainer_tower: "TORRE DOS TREINADORES",
  seven_island_tanoby_ruins: "RUÍNAS TANOBY",
  seven_island_sevault_canyon_tanoby_key: "CHAVE TANOBY",
};

/** As sete câmaras das RUÍNAS TANOBY têm nome próprio cada uma. */
const CAMARA = {
  monean: "MONEAN", liptoo: "LIPTOO", weepth: "WEEPTH", dilford: "DILFORD",
  scufib: "SCUFIB", rixy: "RIXY", viapois: "VIAPOIS",
};

/** O pedaço final do id vira o sufixo do nome. */
function parte(resto) {
  if (!resto) return "";
  let m;
  if ((m = resto.match(/^b(\d+)f$/))) return ` — SUBSOLO ${m[1]}`;
  if ((m = resto.match(/^(\d+)f$/))) return ` — ${m[1]}º ANDAR`;
  if ((m = resto.match(/^room(\d+)$/))) return ` — SALA ${m[1]}`;
  if ((m = resto.match(/^(\w+)_chamber$/))) return ` — CÂMARA ${CAMARA[m[1]] || m[1].toUpperCase()}`;
  const fixos = {
    secret_house: " — CASA SECRETA", sapphire_room: " — SALA DA SAFIRA",
    entrance: " — ENTRADA", back: " — FUNDO", exterior: "", office: " — ESCRITÓRIO",
    elevator: " — ELEVADOR", rest_house: " — CASA DE DESCANSO", center: " — CENTRO",
    east: " — LESTE", west: " — OESTE", north: " — NORTE", south: " — SUL",
    summit: " — CUME", stairs: " — ESCADA", lobby: " — SAGUÃO", roof: " — TERRAÇO",
  };
  if (resto in fixos) return fixos[resto];
  if ((m = resto.match(/^(east|west|north|center)_rest_house$/)))
    return `${fixos[m[1]]}, CASA DE DESCANSO`;
  if ((m = resto.match(/^b(\d+)f_stairs$/))) return ` — SUBSOLO ${m[1]}, ESCADA`;
  if ((m = resto.match(/^(\d+)f_stairs$/))) return ` — ${m[1]}º ANDAR, ESCADA`;
  return " — " + resto.toUpperCase().replace(/_/g, " ");
}

/** O nome em português daquele mapa, ou null se ele não é um lugar destes. */
export function nomeDoLugar(id) {
  // do prefixo mais longo pro mais curto: senão "mt_ember" engole o CAMINHO RUBI
  const chaves = Object.keys(LUGAR).sort((a, b) => b.length - a.length);
  const k = chaves.find((c) => id === c || id.startsWith(c + "_"));
  if (!k) return null;
  return LUGAR[k] + parte(id.slice(k.length).replace(/^_/, ""));
}
