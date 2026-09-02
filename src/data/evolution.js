// Evoluções. Cada espécie tem uma lista de regras; a primeira que der certo vale.
//
//   { lvl: 16, to: "ivysaur" }              sobe de nível e evolui
//   { item: "pedra do fogo", to: "arcanine" }   usar o item na mochila
//
// Este jogo não tem troca entre jogadores, então as quatro evoluções por troca
// do FireRed (ALAKAZAM, MACHAMP, GOLEM, GENGAR) viraram evolução por nível alto.
import { EVO_INICIAIS } from "./iniciais.js";
import { EVO_ERAS } from "./eras.js";

export const EVOLUTIONS = {
  // OS INICIAIS DAS OUTRAS REGIÕES. As regras saem de src/data/iniciais.js,
  // montadas das linhagens de lá — escrever as 24 linhagens aqui de novo seria
  // manter a mesma informação em dois lugares, e um dia um deles fica pra trás.
  ...EVO_INICIAIS,

  // AS METADES QUE FALTAVAM. LILEEP, ANORITH, TIRTOUGA e ARCHEN moravam na
  // fenda desde sempre sem a segunda forma — subiam de nível a vida toda
  // esperando virar uma coisa que não existia. As espécies vieram com AS TRÊS
  // ERAS (src/data/eras.js) e as regras vêm de lá junto, pelo mesmo motivo dos
  // iniciais: a mesma informação em dois arquivos é um dos dois ficando pra
  // trás.
  ...EVO_ERAS,

  // iniciais
  bulbasaur: [{ lvl: 16, to: "ivysaur" }],
  ivysaur: [{ lvl: 32, to: "venusaur" }],
  charmander: [{ lvl: 16, to: "charmeleon" }],
  charmeleon: [{ lvl: 36, to: "charizard" }],
  squirtle: [{ lvl: 16, to: "wartortle" }],
  wartortle: [{ lvl: 36, to: "blastoise" }],

  // OS MORADORES DOS LUGARES NOVOS (src/data/extra.js). Cada base com a sua
  // linhagem: adicionar NATU sem XATU é prometer uma evolução que nunca chega.
  // As três que no jogo original pedem item raro ou golpe específico (YANMEGA,
  // MISMAGIUS, DUDUNSPARCE) evoluem por NÍVEL aqui, pelo mesmo motivo que
  // ALAKAZAM e MACHAMP evoluem: este jogo não tem troca nem aquelas pedras.
  sentret: [{ lvl: 15, to: "furret" }],
  ledyba: [{ lvl: 18, to: "ledian" }],
  spinarak: [{ lvl: 22, to: "ariados" }],
  natu: [{ lvl: 25, to: "xatu" }],
  marill: [{ lvl: 18, to: "azumarill" }],
  hoppip: [{ lvl: 18, to: "skiploom" }],
  skiploom: [{ lvl: 27, to: "jumpluff" }],
  yanma: [{ lvl: 33, to: "yanmega" }],
  misdreavus: [{ lvl: 35, to: "mismagius" }],
  dunsparce: [{ lvl: 32, to: "dudunsparce" }],
  phanpy: [{ lvl: 25, to: "donphan" }],
  larvitar: [{ lvl: 30, to: "pupitar" }],
  pupitar: [{ lvl: 55, to: "tyranitar" }],
  sneasel: [{ lvl: 45, to: "weavile" }],
  slugma: [{ lvl: 38, to: "magcargo" }],
  swinub: [{ lvl: 33, to: "piloswine" }],
  piloswine: [{ lvl: 50, to: "mamoswine" }],
  // WOBBUFFET e HERACROSS não têm evolução em jogo nenhum — não é esquecimento.

  // insetos e pássaros do começo
  caterpie: [{ lvl: 7, to: "metapod" }],
  metapod: [{ lvl: 10, to: "butterfree" }],
  weedle: [{ lvl: 7, to: "kakuna" }],
  kakuna: [{ lvl: 10, to: "beedrill" }],
  pidgey: [{ lvl: 18, to: "pidgeotto" }],
  pidgeotto: [{ lvl: 36, to: "pidgeot" }],
  rattata: [{ lvl: 20, to: "raticate" }],
  spearow: [{ lvl: 20, to: "fearow" }],

  // resto de Kanto, por nível
  ekans: [{ lvl: 22, to: "arbok" }],
  sandshrew: [{ lvl: 22, to: "sandslash" }],
  nidoranf: [{ lvl: 16, to: "nidorina" }],
  nidoranm: [{ lvl: 16, to: "nidorino" }],
  zubat: [{ lvl: 22, to: "golbat" }],
  oddish: [{ lvl: 21, to: "gloom" }],
  paras: [{ lvl: 24, to: "parasect" }],
  venonat: [{ lvl: 31, to: "venomoth" }],
  diglett: [{ lvl: 26, to: "dugtrio" }],
  meowth: [{ lvl: 28, to: "persian" }],
  psyduck: [{ lvl: 33, to: "golduck" }],
  mankey: [{ lvl: 28, to: "primeape" }],
  poliwag: [{ lvl: 25, to: "poliwhirl" }],
  abra: [{ lvl: 16, to: "kadabra" }],
  kadabra: [{ lvl: 37, to: "alakazam" }],      // era por troca
  machop: [{ lvl: 28, to: "machoke" }],
  machoke: [{ lvl: 40, to: "machamp" }],       // era por troca
  bellsprout: [{ lvl: 21, to: "weepinbell" }],
  tentacool: [{ lvl: 30, to: "tentacruel" }],
  geodude: [{ lvl: 25, to: "graveler" }],
  graveler: [{ lvl: 38, to: "golem" }],        // era por troca
  ponyta: [{ lvl: 40, to: "rapidash" }],
  slowpoke: [{ lvl: 37, to: "slowbro" }],
  magnemite: [{ lvl: 30, to: "magneton" }],
  doduo: [{ lvl: 31, to: "dodrio" }],
  seel: [{ lvl: 34, to: "dewgong" }],
  grimer: [{ lvl: 38, to: "muk" }],
  gastly: [{ lvl: 25, to: "haunter" }],
  haunter: [{ lvl: 40, to: "gengar" }],        // era por troca
  drowzee: [{ lvl: 26, to: "hypno" }],
  krabby: [{ lvl: 28, to: "kingler" }],
  voltorb: [{ lvl: 30, to: "electrode" }],
  cubone: [{ lvl: 28, to: "marowak" }],
  koffing: [{ lvl: 35, to: "weezing" }],
  rhyhorn: [{ lvl: 42, to: "rhydon" }],
  horsea: [{ lvl: 32, to: "seadra" }],
  goldeen: [{ lvl: 33, to: "seaking" }],
  magikarp: [{ lvl: 20, to: "gyarados" }],
  omanyte: [{ lvl: 40, to: "omastar" }],
  kabuto: [{ lvl: 40, to: "kabutops" }],
  dratini: [{ lvl: 30, to: "dragonair" }],
  dragonair: [{ lvl: 55, to: "dragonite" }],

  // por pedra
  // as velas da fenda: a segunda troca é por pedra, como no jogo de origem
  litwick: [{ lvl: 41, to: "lampent" }],
  lampent: [{ item: "pedra do crepúsculo", to: "chandelure" }],

  pikachu: [{ item: "pedra do trovão", to: "raichu" }],
  nidorina: [{ item: "pedra da lua", to: "nidoqueen" }],
  nidorino: [{ item: "pedra da lua", to: "nidoking" }],
  clefairy: [{ item: "pedra da lua", to: "clefable" }],
  jigglypuff: [{ item: "pedra da lua", to: "wigglytuff" }],
  vulpix: [{ item: "pedra do fogo", to: "ninetales" }],
  growlithe: [{ item: "pedra do fogo", to: "arcanine" }],
  gloom: [{ item: "pedra da folha", to: "vileplume" }],
  weepinbell: [{ item: "pedra da folha", to: "victreebel" }],
  exeggcute: [{ item: "pedra da folha", to: "exeggutor" }],
  poliwhirl: [{ item: "pedra da água", to: "poliwrath" }],
  shellder: [{ item: "pedra da água", to: "cloyster" }],
  staryu: [{ item: "pedra da água", to: "starmie" }],
  eevee: [
    { item: "pedra da água", to: "vaporeon" },
    { item: "pedra do trovão", to: "jolteon" },
    { item: "pedra do fogo", to: "flareon" },
  ],

  // itens que só existem do outro lado da fenda (ver src/data/loot.js)
  cranidos: [{ lvl: 30, to: "rampardos" }],
  shieldon: [{ lvl: 30, to: "bastiodon" }],
  porygon: [{ item: "up-grade", to: "porygon2" }],
  porygon2: [{ item: "dubious disc", to: "porygonz" }],
};

/** as cinco pedras: o preço fica na loja, em src/data/maps.js */
export const STONES = [
  "pedra do fogo", "pedra da água", "pedra do trovão", "pedra da folha", "pedra da lua",
  // a do crepúsculo não é de Kanto: ela cai na fenda, junto com as velas que
  // precisam dela (ver DIM_LOOT em src/data/loot.js)
  "pedra do crepúsculo",
];

/** item -> { espécie atual: espécie nova } (é o formato que a mochila usa) */
export const EVO_ITEMS = {};
for (const [id, regras] of Object.entries(EVOLUTIONS)) {
  for (const r of regras) {
    if (!r.item) continue;
    (EVO_ITEMS[r.item] ||= {})[id] = r.to;
  }
}
