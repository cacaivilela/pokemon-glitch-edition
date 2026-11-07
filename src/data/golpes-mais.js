// MAIS GOLPES: duzentos golpes a mais, onze de cada tipo (e dois do GLITCH),
// mais os dois do ZYGARDE (LUZ NULA e EXPLOSÃO DA VIDA OU MORTE),
// com os mesmos campos de src/data/moves.js e só os efeitos que a batalha já
// sabe fazer: burn, para, poison (chance de 0 a 1), stat (um atributo, de quem
// usa ou do alvo — nos golpes de dano ele sempre acontece, então o número é
// mais baixo que no jogo original), crit, priority, recoil, mordida, corrupt.
//
// Quem aprende: todo Pokémon ganha alguns deles subindo de nível, pelos tipos
// dele (src/data/species.js, `maisGolpes`).
export const MAIS_GOLPES = {
  // OS GOLPES FORTES DE MT (pedido do CAIO, nov/2026: "pkmns alfas geralmente aprendem
  // golpes como giga impacto, potência equina, hiper raio, giga dreno"): só por MT
  // (src/data/maquinas.js, MT51 em diante) ou nascendo ALFA (src/systems/maquinas.js)
  gigaimpacto:       { name: "GIGA IMPACTO",      type: "NORMAL",   power: 150, acc: 90,  pp: 5,  category: "fisico" },
  potenciaequina:    { name: "POTÊNCIA EQUINA",   type: "TERRA",    power: 95,  acc: 95,  pp: 10, category: "fisico" },
  gigadreno:         { name: "GIGA DRENO",        type: "PLANTA",   power: 75,  acc: 100, pp: 10, category: "especial", drena: 0.5 },
  ultraje:           { name: "ULTRAJE",           type: "DRAGÃO",   power: 120, acc: 100, pp: 10, category: "fisico" },
  combateproximo:    { name: "COMBATE PRÓXIMO",   type: "LUTADOR",  power: 120, acc: 100, pp: 5,  category: "fisico" },
  golpeaquatico:     { name: "CAUDA AQUÁTICA",    type: "ÁGUA",     power: 90,  acc: 90,  pp: 10, category: "fisico" },
  investidaselvagem: { name: "INVESTIDA SELVAGEM", type: "ELÉTRICO", power: 90, acc: 100, pp: 15, category: "fisico", recoil: 0.25 },
  pedragume:         { name: "GUME DE PEDRA",     type: "PEDRA",    power: 100, acc: 80,  pp: 5,  category: "fisico" },

  // ------------------------------------------------------------ NORMAL
  tapa:              { name: "TAPA",              type: "NORMAL",   power: 40,  acc: 100, pp: 35, category: "fisico" },
  pisotear:          { name: "PISOTEAR",          type: "NORMAL",   power: 65,  acc: 100, pp: 20, category: "fisico" },
  golpedecorpo:      { name: "GOLPE DE CORPO",    type: "NORMAL",   power: 85,  acc: 100, pp: 15, category: "fisico", para: 0.3 },
  derrubada:         { name: "DERRUBADA",         type: "NORMAL",   power: 90,  acc: 85,  pp: 20, category: "fisico", recoil: 0.25 },
  avancoduplo:       { name: "AVANÇO DUPLO",      type: "NORMAL",   power: 120, acc: 100, pp: 15, category: "fisico", recoil: 0.33 },
  hiperraio:         { name: "HIPER-RAIO",        type: "NORMAL",   power: 150, acc: 90,  pp: 5,  category: "especial" },
  hipervoz:          { name: "HIPER VOZ",         type: "NORMAL",   power: 90,  acc: 100, pp: 10, category: "especial" },
  velocidadeextrema: { name: "VELOCIDADE EXTREMA", type: "NORMAL",  power: 80,  acc: 100, pp: 5,  category: "fisico", priority: 2 },
  // EXPLOSÃO (o golpe que o CAIO vai animar no dev/animgolpe.html): bate muito
  // forte e quem usa DESMAIA (`explode`, src/scenes/battle.js e grupobattle.js)
  explosao:          { name: "EXPLOSÃO",          type: "NORMAL",   power: 250, acc: 100, pp: 5,  category: "fisico", explode: true },
  // PODER ANCESTRAL (o golpe que o CAIO escolheu pra animar no dev/animgolpe.html)
  poderancestral:    { name: "PODER ANCESTRAL",   type: "PEDRA",    power: 60,  acc: 100, pp: 5,  category: "especial" },
  dancadasespadas:   { name: "DANÇA DAS ESPADAS", type: "NORMAL",   power: 0,   acc: 100, pp: 20, category: "status", stat: { target: "self", key: "atk", delta: 2 } },
  olharassustador:   { name: "OLHAR ASSUSTADOR",  type: "NORMAL",   power: 0,   acc: 100, pp: 10, category: "status", stat: { target: "foe", key: "spe", delta: -2 } },
  olhosdebebe:       { name: "OLHOS DE BEBÊ",     type: "NORMAL",   power: 0,   acc: 100, pp: 30, category: "status", priority: 1, stat: { target: "foe", key: "atk", delta: -1 } },

  // -------------------------------------------------------------- FOGO
  rodadefogo:        { name: "RODA DE FOGO",      type: "FOGO",     power: 60,  acc: 100, pp: 25, category: "fisico", burn: 0.1 },
  presadefogo:       { name: "PRESA DE FOGO",     type: "FOGO",     power: 65,  acc: 95,  pp: 15, category: "fisico", burn: 0.1, mordida: true },
  socodefogo:        { name: "SOCO DE FOGO",      type: "FOGO",     power: 75,  acc: 100, pp: 15, category: "fisico", burn: 0.1 },
  turbilhaodefogo:   { name: "TURBILHÃO DE FOGO", type: "FOGO",     power: 35,  acc: 85,  pp: 15, category: "especial", burn: 0.2 },
  rajadadefogo:      { name: "RAJADA DE FOGO",    type: "FOGO",     power: 110, acc: 85,  pp: 5,  category: "especial", burn: 0.1 },
  ondadecalor:       { name: "ONDA DE CALOR",     type: "FOGO",     power: 95,  acc: 90,  pp: 10, category: "especial", burn: 0.1 },
  investidaflamejante: { name: "INVESTIDA FLAMEJANTE", type: "FOGO", power: 120, acc: 100, pp: 15, category: "fisico", burn: 0.1, recoil: 0.33 },
  superaquecimento:  { name: "SUPERAQUECIMENTO",  type: "FOGO",     power: 130, acc: 90,  pp: 5,  category: "especial", stat: { target: "self", key: "spa", delta: -2 } },
  fogofatuo:         { name: "FOGO-FÁTUO",        type: "FOGO",     power: 0,   acc: 85,  pp: 15, category: "status", burn: 1 },
  nitrocarga:        { name: "NITROCARGA",        type: "FOGO",     power: 50,  acc: 100, pp: 20, category: "fisico", stat: { target: "self", key: "spe", delta: 1 } },
  labareda:          { name: "LABAREDA",          type: "FOGO",     power: 100, acc: 50,  pp: 5,  category: "especial", burn: 1 },

  // -------------------------------------------------------------- ÁGUA
  jatodagua:         { name: "JATO D'ÁGUA",       type: "ÁGUA",     power: 40,  acc: 100, pp: 20, category: "fisico", priority: 1 },
  pulsodagua:        { name: "PULSO D'ÁGUA",      type: "ÁGUA",     power: 60,  acc: 100, pp: 20, category: "especial" },
  raiodebolhas:      { name: "RAIO DE BOLHAS",    type: "ÁGUA",     power: 65,  acc: 100, pp: 20, category: "especial", stat: { target: "foe", key: "spe", delta: -1 } },
  navalhadeconcha:   { name: "NAVALHA DE CONCHA", type: "ÁGUA",     power: 60,  acc: 95,  pp: 10, category: "fisico", stat: { target: "foe", key: "def", delta: -1 } },
  cachoeira:         { name: "CACHOEIRA",         type: "ÁGUA",     power: 80,  acc: 100, pp: 15, category: "fisico" },
  mergulho:          { name: "MERGULHO",          type: "ÁGUA",     power: 80,  acc: 100, pp: 10, category: "fisico" },
  escaldar:          { name: "ESCALDAR",          type: "ÁGUA",     power: 80,  acc: 100, pp: 15, category: "especial", burn: 0.3 },
  caudadagua:        { name: "CAUDA D'ÁGUA",      type: "ÁGUA",     power: 90,  acc: 90,  pp: 10, category: "fisico" },
  hidrobomba:        { name: "HIDROBOMBA",        type: "ÁGUA",     power: 110, acc: 80,  pp: 5,  category: "especial" },
  canhaodagua:       { name: "CANHÃO D'ÁGUA",     type: "ÁGUA",     power: 150, acc: 90,  pp: 5,  category: "especial" },
  recolher:          { name: "RECOLHER",          type: "ÁGUA",     power: 0,   acc: 100, pp: 40, category: "status", stat: { target: "self", key: "def", delta: 1 } },

  // ------------------------------------------------------------ PLANTA
  folhamagica:       { name: "FOLHA MÁGICA",      type: "PLANTA",   power: 60,  acc: 100, pp: 20, category: "especial" },
  bombadesementes:   { name: "BOMBA DE SEMENTES", type: "PLANTA",   power: 80,  acc: 100, pp: 15, category: "fisico" },
  energiadanatureza: { name: "ENERGIA DA NATUREZA", type: "PLANTA", power: 90,  acc: 100, pp: 10, category: "especial" },
  laminadefolha:     { name: "LÂMINA DE FOLHA",   type: "PLANTA",   power: 90,  acc: 100, pp: 15, category: "fisico", crit: 2 },
  raiosolar:         { name: "RAIO SOLAR",        type: "PLANTA",   power: 120, acc: 90,  pp: 10, category: "especial" },
  petalasdancantes:  { name: "PÉTALAS DANÇANTES", type: "PLANTA",   power: 120, acc: 100, pp: 10, category: "especial" },
  chicotepoderoso:   { name: "CHICOTE PODEROSO",  type: "PLANTA",   power: 120, acc: 85,  pp: 10, category: "fisico" },
  martelodemadeira:  { name: "MARTELO DE MADEIRA", type: "PLANTA",  power: 120, acc: 100, pp: 15, category: "fisico", recoil: 0.33 },
  tempestadedefolhas:{ name: "TEMPESTADE DE FOLHAS", type: "PLANTA", power: 130, acc: 90,  pp: 5,  category: "especial", stat: { target: "self", key: "spa", delta: -2 } },
  poatordoante:      { name: "PÓ ATORDOANTE",     type: "PLANTA",   power: 0,   acc: 75,  pp: 30, category: "status", para: 1 },
  algodao:           { name: "ALGODÃO",           type: "PLANTA",   power: 0,   acc: 100, pp: 40, category: "status", stat: { target: "foe", key: "spe", delta: -2 } },

  // ---------------------------------------------------------- ELÉTRICO
  faisca:            { name: "FAÍSCA",            type: "ELÉTRICO", power: 65,  acc: 100, pp: 20, category: "fisico", para: 0.3 },
  presaeletrica:     { name: "PRESA ELÉTRICA",    type: "ELÉTRICO", power: 65,  acc: 95,  pp: 15, category: "fisico", para: 0.1, mordida: true },
  bolaeletrica:      { name: "BOLA ELÉTRICA",     type: "ELÉTRICO", power: 70,  acc: 100, pp: 10, category: "especial" },
  trocavolt:         { name: "TROCA VOLT",        type: "ELÉTRICO", power: 70,  acc: 100, pp: 20, category: "especial" },
  socodotrovao:      { name: "SOCO DO TROVÃO",    type: "ELÉTRICO", power: 75,  acc: 100, pp: 15, category: "fisico", para: 0.1 },
  descarga:          { name: "DESCARGA",          type: "ELÉTRICO", power: 80,  acc: 100, pp: 15, category: "especial", para: 0.3 },
  trovao:            { name: "TROVÃO",            type: "ELÉTRICO", power: 110, acc: 70,  pp: 10, category: "especial", para: 0.3 },
  investidadovolt:   { name: "INVESTIDA DO VOLT", type: "ELÉTRICO", power: 120, acc: 100, pp: 15, category: "fisico", para: 0.1, recoil: 0.33 },
  canhaozap:         { name: "CANHÃO ZAP",        type: "ELÉTRICO", power: 120, acc: 50,  pp: 5,  category: "especial", para: 1 },
  ondadotrovao:      { name: "ONDA DO TROVÃO",    type: "ELÉTRICO", power: 0,   acc: 90,  pp: 20, category: "status", para: 1 },
  carga:             { name: "CARGA",             type: "ELÉTRICO", power: 0,   acc: 100, pp: 20, category: "status", stat: { target: "self", key: "spd", delta: 1 } },

  // ------------------------------------------------------------ INSETO
  ataquedefuria:     { name: "ATAQUE DE FÚRIA",   type: "INSETO",   power: 40,  acc: 95,  pp: 20, category: "fisico", crit: 2 },
  picadadupla:       { name: "PICADA DUPLA",      type: "INSETO",   power: 50,  acc: 100, pp: 20, category: "fisico", poison: 0.2 },
  lutadeinseto:      { name: "LUTA DE INSETO",    type: "INSETO",   power: 50,  acc: 100, pp: 20, category: "especial", stat: { target: "foe", key: "spa", delta: -1 } },
  rajadaprateada:    { name: "RAJADA PRATEADA",   type: "INSETO",   power: 60,  acc: 100, pp: 5,  category: "especial" },
  voltarapida:       { name: "VOLTA RÁPIDA",      type: "INSETO",   power: 70,  acc: 100, pp: 20, category: "fisico" },
  sinaldeluz:        { name: "SINAL DE LUZ",      type: "INSETO",   power: 75,  acc: 100, pp: 15, category: "especial" },
  tesourax:          { name: "TESOURA X",         type: "INSETO",   power: 80,  acc: 100, pp: 15, category: "fisico" },
  zumbido:           { name: "ZUMBIDO",           type: "INSETO",   power: 90,  acc: 100, pp: 10, category: "especial", stat: { target: "foe", key: "spd", delta: -1 } },
  megachifre:        { name: "MEGACHIFRE",        type: "INSETO",   power: 120, acc: 85,  pp: 10, category: "fisico" },
  dancadaborboleta:  { name: "DANÇA DA BORBOLETA", type: "INSETO",  power: 0,   acc: 100, pp: 20, category: "status", stat: { target: "self", key: "spa", delta: 1 } },
  teiapegajosa:      { name: "TEIA PEGAJOSA",     type: "INSETO",   power: 0,   acc: 100, pp: 20, category: "status", stat: { target: "foe", key: "spe", delta: -1 } },

  // ------------------------------------------------------------ VOADOR
  bicadaforte:       { name: "BICADA FORTE",      type: "VOADOR",   power: 60,  acc: 100, pp: 20, category: "fisico" },
  aereoas:           { name: "AÉREO ÁS",          type: "VOADOR",   power: 60,  acc: 100, pp: 20, category: "fisico" },
  cortedear:         { name: "CORTE DE AR",       type: "VOADOR",   power: 60,  acc: 95,  pp: 25, category: "especial", crit: 2 },
  acrobacia:         { name: "ACROBACIA",         type: "VOADOR",   power: 70,  acc: 100, pp: 15, category: "fisico" },
  laminadear:        { name: "LÂMINA DE AR",      type: "VOADOR",   power: 75,  acc: 95,  pp: 15, category: "especial" },
  bicobroca:         { name: "BICO BROCA",        type: "VOADOR",   power: 80,  acc: 100, pp: 20, category: "fisico" },
  furacao:           { name: "FURACÃO",           type: "VOADOR",   power: 110, acc: 70,  pp: 10, category: "especial" },
  passarobravo:      { name: "PÁSSARO BRAVO",     type: "VOADOR",   power: 120, acc: 100, pp: 15, category: "fisico", recoil: 0.33 },
  golpedoceu:        { name: "GOLPE DO CÉU",      type: "VOADOR",   power: 140, acc: 90,  pp: 5,  category: "fisico", crit: 2 },
  ventotraseiro:     { name: "VENTO TRASEIRO",    type: "VOADOR",   power: 0,   acc: 100, pp: 15, category: "status", stat: { target: "self", key: "spe", delta: 2 } },
  penadancante:      { name: "PENA DANÇANTE",     type: "VOADOR",   power: 0,   acc: 100, pp: 15, category: "status", stat: { target: "foe", key: "atk", delta: -2 } },

  // ----------------------------------------------------------- LUTADOR
  socorapido:        { name: "SOCO RÁPIDO",       type: "LUTADOR",  power: 40,  acc: 100, pp: 30, category: "fisico", priority: 1 },
  pancadabaixa:      { name: "PANCADA BAIXA",     type: "LUTADOR",  power: 60,  acc: 100, pp: 20, category: "fisico" },
  submissao:         { name: "SUBMISSÃO",         type: "LUTADOR",  power: 80,  acc: 80,  pp: 20, category: "fisico", recoil: 0.25 },
  esferadeaura:      { name: "ESFERA DE AURA",    type: "LUTADOR",  power: 80,  acc: 100, pp: 20, category: "especial" },
  socodinamico:      { name: "SOCO DINÂMICO",     type: "LUTADOR",  power: 100, acc: 50,  pp: 5,  category: "fisico" },
  marretada:         { name: "MARRETADA",         type: "LUTADOR",  power: 100, acc: 90,  pp: 10, category: "fisico", stat: { target: "self", key: "spe", delta: -1 } },
  corpoacorpo:       { name: "CORPO A CORPO",     type: "LUTADOR",  power: 120, acc: 100, pp: 5,  category: "fisico", stat: { target: "self", key: "def", delta: -1 } },
  golpedefoco:       { name: "GOLPE DE FOCO",     type: "LUTADOR",  power: 120, acc: 70,  pp: 5,  category: "especial" },
  chutealto:         { name: "CHUTE ALTO",        type: "LUTADOR",  power: 130, acc: 90,  pp: 10, category: "fisico", recoil: 0.25 },
  ondadevacuo:       { name: "ONDA DE VÁCUO",     type: "LUTADOR",  power: 40,  acc: 100, pp: 30, category: "especial", priority: 1 },
  aumentodemusculo:  { name: "AUMENTO DE MÚSCULO", type: "LUTADOR", power: 0,   acc: 100, pp: 20, category: "status", stat: { target: "self", key: "atk", delta: 1 } },

  // ------------------------------------------------------------ VENENO
  sprayacido:        { name: "SPRAY ÁCIDO",       type: "VENENO",   power: 40,  acc: 100, pp: 20, category: "especial", stat: { target: "foe", key: "spd", delta: -2 } },
  caudavenenosa:     { name: "CAUDA VENENOSA",    type: "VENENO",   power: 50,  acc: 100, pp: 25, category: "fisico", crit: 2, poison: 0.1 },
  presavenenosa:     { name: "PRESA VENENOSA",    type: "VENENO",   power: 50,  acc: 100, pp: 15, category: "fisico", poison: 0.5, mordida: true },
  lodo:              { name: "LODO",              type: "VENENO",   power: 65,  acc: 100, pp: 20, category: "especial", poison: 0.3 },
  jatovenenoso:      { name: "JATO VENENOSO",     type: "VENENO",   power: 80,  acc: 100, pp: 20, category: "fisico", poison: 0.3 },
  bombadelodo:       { name: "BOMBA DE LODO",     type: "VENENO",   power: 90,  acc: 100, pp: 10, category: "especial", poison: 0.3 },
  ondadelodo:        { name: "ONDA DE LODO",      type: "VENENO",   power: 95,  acc: 100, pp: 10, category: "especial", poison: 0.1 },
  tirodegosma:       { name: "TIRO DE GOSMA",     type: "VENENO",   power: 120, acc: 80,  pp: 5,  category: "fisico", poison: 0.3 },
  toxico:            { name: "TÓXICO",            type: "VENENO",   power: 0,   acc: 90,  pp: 10, category: "status", poison: 1 },
  povenenoso:        { name: "PÓ VENENOSO",       type: "VENENO",   power: 0,   acc: 75,  pp: 35, category: "status", poison: 1 },
  armaduraacida:     { name: "ARMADURA ÁCIDA",    type: "VENENO",   power: 0,   acc: 100, pp: 20, category: "status", stat: { target: "self", key: "def", delta: 2 } },

  // ------------------------------------------------------------- TERRA
  tumulodeareia:     { name: "TÚMULO DE AREIA",   type: "TERRA",    power: 35,  acc: 85,  pp: 15, category: "fisico", stat: { target: "foe", key: "spe", delta: -1 } },
  tirodelama:        { name: "TIRO DE LAMA",      type: "TERRA",    power: 55,  acc: 95,  pp: 15, category: "especial", stat: { target: "foe", key: "spe", delta: -1 } },
  terrainstavel:     { name: "TERRA INSTÁVEL",    type: "TERRA",    power: 60,  acc: 100, pp: 20, category: "fisico", stat: { target: "foe", key: "spe", delta: -1 } },
  bombadelama:       { name: "BOMBA DE LAMA",     type: "TERRA",    power: 65,  acc: 85,  pp: 10, category: "especial", stat: { target: "foe", key: "acc", delta: -1 } },
  ossoclube:         { name: "OSSO CLUBE",        type: "TERRA",    power: 65,  acc: 85,  pp: 20, category: "fisico" },
  escavar:           { name: "ESCAVAR",           type: "TERRA",    power: 80,  acc: 100, pp: 10, category: "fisico" },
  magnitude:         { name: "MAGNITUDE",         type: "TERRA",    power: 80,  acc: 100, pp: 30, category: "fisico" },
  broca:             { name: "BROCA",             type: "TERRA",    power: 80,  acc: 95,  pp: 10, category: "fisico", crit: 2 },
  poderdaterra:      { name: "PODER DA TERRA",    type: "TERRA",    power: 90,  acc: 100, pp: 10, category: "especial", stat: { target: "foe", key: "spd", delta: -1 } },
  bumerangueosso:    { name: "BUMERANGUE DE OSSO", type: "TERRA",   power: 100, acc: 90,  pp: 10, category: "fisico" },
  lancaprecipicio:   { name: "LANÇA PRECIPÍCIO",  type: "TERRA",    power: 120, acc: 85,  pp: 10, category: "especial" },

  // ------------------------------------------------------------- PEDRA
  rolamento:         { name: "ROLAMENTO",         type: "PEDRA",    power: 50,  acc: 90,  pp: 20, category: "fisico" },
  tumbadepedra:      { name: "TUMBA DE PEDRA",    type: "PEDRA",    power: 60,  acc: 95,  pp: 15, category: "fisico", stat: { target: "foe", key: "spe", delta: -1 } },
  poderantigo:       { name: "PODER ANTIGO",      type: "PEDRA",    power: 60,  acc: 100, pp: 5,  category: "especial", stat: { target: "self", key: "spa", delta: 1 } },
  deslizamento:      { name: "DESLIZAMENTO",      type: "PEDRA",    power: 75,  acc: 90,  pp: 10, category: "fisico" },
  explosaodepedra:   { name: "EXPLOSÃO DE PEDRA", type: "PEDRA",    power: 75,  acc: 90,  pp: 10, category: "fisico" },
  joiadepoder:       { name: "JOIA DE PODER",     type: "PEDRA",    power: 80,  acc: 100, pp: 20, category: "especial" },
  laminadepedra:     { name: "LÂMINA DE PEDRA",   type: "PEDRA",    power: 100, acc: 80,  pp: 5,  category: "fisico", crit: 2 },
  cabecadadepedra:   { name: "CABEÇADA DE PEDRA", type: "PEDRA",    power: 150, acc: 80,  pp: 5,  category: "fisico", recoil: 0.5 },
  arremessoderocha:  { name: "ARREMESSO DE ROCHA", type: "PEDRA",   power: 150, acc: 90,  pp: 5,  category: "fisico" },
  polimento:         { name: "POLIMENTO",         type: "PEDRA",    power: 0,   acc: 100, pp: 20, category: "status", stat: { target: "self", key: "spe", delta: 2 } },
  muralhadepedra:    { name: "MURALHA DE PEDRA",  type: "PEDRA",    power: 0,   acc: 100, pp: 15, category: "status", stat: { target: "self", key: "def", delta: 2 } },

  // ---------------------------------------------------------- PSÍQUICO
  psicorraio:        { name: "PSICORRAIO",        type: "PSÍQUICO", power: 65,  acc: 100, pp: 20, category: "especial" },
  cortepsiquico:     { name: "CORTE PSÍQUICO",    type: "PSÍQUICO", power: 70,  acc: 100, pp: 20, category: "fisico", crit: 2 },
  cabecadazen:       { name: "CABEÇADA ZEN",      type: "PSÍQUICO", power: 80,  acc: 90,  pp: 15, category: "fisico" },
  choquepsiquico:    { name: "CHOQUE PSÍQUICO",   type: "PSÍQUICO", power: 80,  acc: 100, pp: 10, category: "especial" },
  extrassensorial:   { name: "EXTRASSENSORIAL",   type: "PSÍQUICO", power: 80,  acc: 100, pp: 20, category: "especial" },
  psicorruptura:     { name: "PSICORRUPTURA",     type: "PSÍQUICO", power: 100, acc: 100, pp: 10, category: "especial" },
  premonicao:        { name: "PREMONIÇÃO",        type: "PSÍQUICO", power: 120, acc: 100, pp: 10, category: "especial" },
  agilidade:         { name: "AGILIDADE",         type: "PSÍQUICO", power: 0,   acc: 100, pp: 30, category: "status", stat: { target: "self", key: "spe", delta: 2 } },
  amnesia:           { name: "AMNÉSIA",           type: "PSÍQUICO", power: 0,   acc: 100, pp: 20, category: "status", stat: { target: "self", key: "spd", delta: 2 } },
  calmamental:       { name: "CALMA MENTAL",      type: "PSÍQUICO", power: 0,   acc: 100, pp: 20, category: "status", stat: { target: "self", key: "spa", delta: 1 } },
  barreira:          { name: "BARREIRA",          type: "PSÍQUICO", power: 0,   acc: 100, pp: 20, category: "status", stat: { target: "self", key: "def", delta: 2 } },

  // -------------------------------------------------------------- GELO
  podeneve:          { name: "PÓ DE NEVE",        type: "GELO",     power: 40,  acc: 100, pp: 25, category: "especial" },
  cacodegelo:        { name: "CACO DE GELO",      type: "GELO",     power: 40,  acc: 100, pp: 30, category: "fisico", priority: 1 },
  boladegelo:        { name: "BOLA DE GELO",      type: "GELO",     power: 50,  acc: 90,  pp: 20, category: "fisico" },
  respiracaogelada:  { name: "RESPIRAÇÃO GELADA", type: "GELO",     power: 60,  acc: 90,  pp: 10, category: "especial", crit: 3 },
  presadegelo:       { name: "PRESA DE GELO",     type: "GELO",     power: 65,  acc: 95,  pp: 15, category: "fisico", mordida: true },
  raioaurora:        { name: "RAIO AURORA",       type: "GELO",     power: 65,  acc: 100, pp: 20, category: "especial", stat: { target: "foe", key: "atk", delta: -1 } },
  liofilizar:        { name: "LIOFILIZAR",        type: "GELO",     power: 70,  acc: 100, pp: 20, category: "especial" },
  socodegelo:        { name: "SOCO DE GELO",      type: "GELO",     power: 75,  acc: 100, pp: 15, category: "fisico" },
  quedadegelo:       { name: "QUEDA DE GELO",     type: "GELO",     power: 85,  acc: 90,  pp: 10, category: "fisico" },
  martelodegelo:     { name: "MARTELO DE GELO",   type: "GELO",     power: 100, acc: 90,  pp: 10, category: "fisico", stat: { target: "self", key: "spe", delta: -1 } },
  nevasca:           { name: "NEVASCA",           type: "GELO",     power: 110, acc: 70,  pp: 5,  category: "especial" },

  // ------------------------------------------------------------ DRAGÃO
  flechadodragao:    { name: "FLECHA DO DRAGÃO",  type: "DRAGÃO",   power: 50,  acc: 100, pp: 10, category: "fisico" },
  soprododragao:     { name: "SOPRO DO DRAGÃO",   type: "DRAGÃO",   power: 60,  acc: 100, pp: 20, category: "especial", para: 0.3 },
  caudadedragao:     { name: "CAUDA DE DRAGÃO",   type: "DRAGÃO",   power: 60,  acc: 90,  pp: 10, category: "fisico" },
  pulsodragao:       { name: "PULSO DRAGÃO",      type: "DRAGÃO",   power: 85,  acc: 100, pp: 10, category: "especial" },
  investidadragao:   { name: "INVESTIDA DRAGÃO",  type: "DRAGÃO",   power: 100, acc: 75,  pp: 10, category: "fisico" },
  fendaespacial:     { name: "FENDA ESPACIAL",    type: "DRAGÃO",   power: 100, acc: 95,  pp: 5,  category: "especial", crit: 2 },
  escamasfragorosas: { name: "ESCAMAS FRAGOROSAS", type: "DRAGÃO",  power: 110, acc: 100, pp: 5,  category: "especial", stat: { target: "self", key: "def", delta: -1 } },
  furiadeescamas:    { name: "FÚRIA DE ESCAMAS",  type: "DRAGÃO",   power: 120, acc: 100, pp: 10, category: "fisico" },
  cometadraco:       { name: "COMETA DRACO",      type: "DRAGÃO",   power: 130, acc: 90,  pp: 5,  category: "especial", stat: { target: "self", key: "spa", delta: -2 } },
  rugidodotempo:     { name: "RUGIDO DO TEMPO",   type: "DRAGÃO",   power: 150, acc: 90,  pp: 5,  category: "especial" },
  dancadodragao:     { name: "DANÇA DO DRAGÃO",   type: "DRAGÃO",   power: 0,   acc: 100, pp: 20, category: "status", stat: { target: "self", key: "atk", delta: 1 } },

  // ---------------------------------------------------------- FANTASMA
  assustar:          { name: "ASSUSTAR",          type: "FANTASMA", power: 30,  acc: 100, pp: 15, category: "fisico" },
  sombrafurtiva:     { name: "SOMBRA FURTIVA",    type: "FANTASMA", power: 40,  acc: 100, pp: 30, category: "fisico", priority: 1 },
  socosombrio:       { name: "SOCO SOMBRIO",      type: "FANTASMA", power: 60,  acc: 100, pp: 20, category: "fisico" },
  raionoturno:       { name: "RAIO NOTURNO",      type: "FANTASMA", power: 60,  acc: 100, pp: 15, category: "especial" },
  ventosinistro:     { name: "VENTO SINISTRO",    type: "FANTASMA", power: 60,  acc: 100, pp: 5,  category: "especial", stat: { target: "self", key: "spa", delta: 1 } },
  feitico:           { name: "FEITIÇO",           type: "FANTASMA", power: 65,  acc: 100, pp: 10, category: "especial" },
  garrasombria:      { name: "GARRA SOMBRIA",     type: "FANTASMA", power: 70,  acc: 100, pp: 15, category: "fisico", crit: 2 },
  ossosombrio:       { name: "OSSO SOMBRIO",      type: "FANTASMA", power: 85,  acc: 100, pp: 10, category: "fisico" },
  ataquefantasma:    { name: "ATAQUE FANTASMA",   type: "FANTASMA", power: 90,  acc: 100, pp: 10, category: "fisico" },
  forcasombria:      { name: "FORÇA SOMBRIA",     type: "FANTASMA", power: 120, acc: 100, pp: 5,  category: "fisico" },
  uivofantasma:      { name: "UIVO FANTASMA",     type: "FANTASMA", power: 0,   acc: 100, pp: 20, category: "status", stat: { target: "foe", key: "spa", delta: -1 } },

  // --------------------------------------------------------------- AÇO
  socobala:          { name: "SOCO BALA",         type: "AÇO",      power: 40,  acc: 100, pp: 30, category: "fisico", priority: 1 },
  bolagiro:          { name: "BOLA GIRO",         type: "AÇO",      power: 70,  acc: 100, pp: 5,  category: "fisico" },
  asadeaco:          { name: "ASA DE AÇO",        type: "AÇO",      power: 70,  acc: 90,  pp: 25, category: "fisico", stat: { target: "self", key: "def", delta: 1 } },
  cabecadeferro:     { name: "CABEÇA DE FERRO",   type: "AÇO",      power: 80,  acc: 100, pp: 15, category: "fisico" },
  canhaodeflash:     { name: "CANHÃO DE FLASH",   type: "AÇO",      power: 80,  acc: 100, pp: 10, category: "especial", stat: { target: "foe", key: "spd", delta: -1 } },
  socometeoro:       { name: "SOCO METEORO",      type: "AÇO",      power: 90,  acc: 90,  pp: 10, category: "fisico", stat: { target: "self", key: "atk", delta: 1 } },
  martelopesado:     { name: "MARTELO PESADO",    type: "AÇO",      power: 90,  acc: 100, pp: 10, category: "fisico" },
  caudadeferro:      { name: "CAUDA DE FERRO",    type: "AÇO",      power: 100, acc: 75,  pp: 15, category: "fisico", stat: { target: "foe", key: "def", delta: -1 } },
  raiodeaco:         { name: "RAIO DE AÇO",       type: "AÇO",      power: 140, acc: 95,  pp: 5,  category: "especial", recoil: 0.5 },
  defesadeferro:     { name: "DEFESA DE FERRO",   type: "AÇO",      power: 0,   acc: 100, pp: 15, category: "status", stat: { target: "self", key: "def", delta: 2 } },
  sommetalico:       { name: "SOM METÁLICO",      type: "AÇO",      power: 0,   acc: 85,  pp: 40, category: "status", stat: { target: "foe", key: "spd", delta: -2 } },

  // ----------------------------------------------------------- SOMBRIO
  ataquetraicoeiro:  { name: "ATAQUE TRAIÇOEIRO", type: "SOMBRIO",  power: 60,  acc: 100, pp: 20, category: "fisico" },
  ladrao:            { name: "LADRÃO",            type: "SOMBRIO",  power: 60,  acc: 100, pp: 25, category: "fisico" },
  surra:             { name: "SURRA",             type: "SOMBRIO",  power: 60,  acc: 100, pp: 10, category: "fisico" },
  golpebaixo:        { name: "GOLPE BAIXO",       type: "SOMBRIO",  power: 70,  acc: 100, pp: 5,  category: "fisico", priority: 1 },
  golpenoturno:      { name: "GOLPE NOTURNO",     type: "SOMBRIO",  power: 70,  acc: 100, pp: 15, category: "fisico", crit: 2 },
  triturar:          { name: "TRITURAR",          type: "SOMBRIO",  power: 80,  acc: 100, pp: 15, category: "fisico", mordida: true, stat: { target: "foe", key: "def", delta: -1 } },
  pulsosombrio:      { name: "PULSO SOMBRIO",     type: "SOMBRIO",  power: 80,  acc: 100, pp: 15, category: "especial" },
  trapaca:           { name: "TRAPAÇA",           type: "SOMBRIO",  power: 95,  acc: 100, pp: 15, category: "fisico" },
  escuridaototal:    { name: "ESCURIDÃO TOTAL",   type: "SOMBRIO",  power: 100, acc: 80,  pp: 5,  category: "especial" },
  maquinacao:        { name: "MAQUINAÇÃO",        type: "SOMBRIO",  power: 0,   acc: 100, pp: 20, category: "status", stat: { target: "self", key: "spa", delta: 2 } },
  lagrimasfalsas:    { name: "LÁGRIMAS FALSAS",   type: "SOMBRIO",  power: 0,   acc: 100, pp: 20, category: "status", stat: { target: "foe", key: "spd", delta: -2 } },

  // -------------------------------------------------------------- FADA
  ventodefada:       { name: "VENTO DE FADA",     type: "FADA",     power: 40,  acc: 100, pp: 30, category: "especial" },
  vozencantadora:    { name: "VOZ ENCANTADORA",   type: "FADA",     power: 40,  acc: 100, pp: 15, category: "especial" },
  beijodefada:       { name: "BEIJO DE FADA",     type: "FADA",     power: 50,  acc: 100, pp: 10, category: "especial" },
  resplendor:        { name: "RESPLENDOR",        type: "FADA",     power: 70,  acc: 100, pp: 15, category: "especial", crit: 2 },
  trompaespiritual:  { name: "TROMPA ESPIRITUAL", type: "FADA",     power: 75,  acc: 100, pp: 15, category: "fisico", stat: { target: "foe", key: "spa", delta: -1 } },
  brilhomagico:      { name: "BRILHO MÁGICO",     type: "FADA",     power: 80,  acc: 100, pp: 10, category: "especial" },
  jogoduro:          { name: "JOGO DURO",         type: "FADA",     power: 90,  acc: 90,  pp: 10, category: "fisico", stat: { target: "foe", key: "atk", delta: -1 } },
  explosaolunar:     { name: "EXPLOSÃO LUNAR",    type: "FADA",     power: 95,  acc: 100, pp: 15, category: "especial", stat: { target: "foe", key: "spa", delta: -1 } },
  canhaofloral:      { name: "CANHÃO FLORAL",     type: "FADA",     power: 130, acc: 90,  pp: 5,  category: "especial", stat: { target: "self", key: "spa", delta: -2 } },
  encanto:           { name: "ENCANTO",           type: "FADA",     power: 0,   acc: 100, pp: 20, category: "status", stat: { target: "foe", key: "atk", delta: -2 } },
  geomancia:         { name: "GEOMANCIA",         type: "FADA",     power: 0,   acc: 100, pp: 10, category: "status", stat: { target: "self", key: "spa", delta: 2 } },

  // ----------------------------------------------------------- ZYGARDE
  // A LUZ NULA, o golpe das células (toda forma do ZYGARDE aprende no 50). No
  // 200% ela vira a EXPLOSÃO DA VIDA OU MORTE: 150 de poder, e o tipo dela é o
  // da MAIOR FRAQUEZA de quem leva (`tipoDaFraqueza`, battle-engine.js
  // `calcDamage`) — o DRAGÃO aqui é só o que aparece no menu.
  // O CLARÃO ILUMINADO: o golpe dos LUMINOSOS (todo luminoso sabe; ideia do
  // CAIO). O clarão cega: a precisão do outro cai.
  claraoiluminado:   { name: "CLARÃO ILUMINADO",  type: "LUZ",      power: 90,  acc: 100, pp: 10, category: "especial", stat: { target: "foe", key: "acc", delta: -1 } },
  // A TRANSFORMAÇÃO (pedido do CAIO, nov/2026): o DITTO vira uma cópia de quem
  // está na frente — a forma, os tipos, os atributos (menos a vida) e os golpes
  // (5 PP cada). Volta a ser DITTO no fim da luta, se desmaiar ou se sair numa
  // troca (src/systems/formas.js). E fica com CARA DE DITTO (Assets.caraDeDitto).
  transformacao:     { name: "TRANSFORMAÇÃO",     type: "NORMAL",   power: 0,   acc: 100, pp: 10, category: "status", transformar: true },
  // O RAIO ETERNO (ETERNABEAM): o golpe do ETERNATUS. Usar ele transforma o
  // ETERNATUS em ETERNATUS ETERNAMAX (src/scenes/battle.js `virarEternamax`)
  raioeterno:        { name: "RAIO ETERNO",       type: "DRAGÃO",   power: 160, acc: 90,  pp: 5,  category: "especial" },
  luznula:           { name: "LUZ NULA",          type: "DRAGÃO",   power: 100, acc: 100, pp: 10, category: "especial" },
  explosaovidaoumorte: { name: "EXPLOSÃO DA VIDA OU MORTE", type: "DRAGÃO", power: 150, acc: 100, pp: 5, category: "especial", tipoDaFraqueza: true },

  // ------------------------------------------------------------ GLITCH
  pixelmorto:        { name: "PIXEL MORTO",       type: "GLITCH",   power: 70,  acc: 100, pp: 15, category: "especial", corrupt: 6 },
  estourodebuffer:   { name: "ESTOURO DE BUFFER", type: "GLITCH",   power: 110, acc: 80,  pp: 5,  category: "especial", corrupt: 15, recoil: 0.2 },
};
