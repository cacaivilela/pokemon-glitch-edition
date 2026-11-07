// AS BASES SECRETAS (o CAIO pediu "ter como fazer bases secretas"). Como ele
// escolheu:
// - o KIT DE BASE SECRETA (um item que não se gasta): de frente pra uma árvore,
//   pedra ou parede, ao ar livre, abre a base ali;
// - VÁRIAS: uma por região (Kanto, Braglitch, Kalos). Abrir outra na mesma
//   região muda a base de lugar, com os móveis;
// - dentro: DECORAR (móveis, tapetes, pôsteres, bonecos numa grade) e deixar
//   POKÉMON SOLTOS andando — tudo pelo PC DA BASE;
// - VISITAS pelo online, e a base é SECRETA de verdade: a porta é invisível
//   pros outros, que só entram se acharem o lugar (esbarrando nele);
// - os móveis são itens da mochila: LOJA DE DECORAÇÃO (dinheiro), balcão de
//   FICHAS do cassino e POKÉ BOLAS no chão.
// A cena da base é src/scenes/base.js; as regras, src/systems/bases.js.

export const KIT_BASE = "kit de base secreta";

/** O QUARTO: 15 x 10 blocos. As 2 linhas de cima são parede (pôster vai na
 *  de baixo delas); a porta é embaixo, no meio; o PC fica no canto. */
export const QUARTO = { w: 15, h: 10, parede: 2, porta: { x: 7, y: 9 }, pc: { x: 1, y: 2 } };

/** A CAVERNA de cada região (o CAIO: "vai parecer por dentro uma caverna"):
 *  a pedra da parede (escura, meio e clara), a terra do chão e, em Braglitch,
 *  o MUSGO nas pedras. `tile`: o desenho de um bloco de parede que ele mesmo
 *  fez (assets/sprites/bases/parede_<região>.png) — quando existe, a parede é
 *  ele repetido; sem ele, as pedras saem sorteadas. */
export const CORES_BASE = {
  kanto: { pedra: ["#3e2c1e", "#6a4c34", "#94704c"], chao: ["#8c6c4a", "#a4825c", "#6e523a"] },
  braglitch: { pedra: ["#2e2824", "#524840", "#7a6e60"], musgo: ["#2e6420", "#4e9430", "#7cc448"],
               chao: ["#5e5238", "#74664a", "#4a4030"], tile: "assets/sprites/bases/parede_braglitch.png" },
  kalos: { pedra: ["#2a3040", "#4a5468", "#727c92"], chao: ["#6a7084", "#80869a", "#545a6c"] },
};

// ============================================================ OS DESENHOS
// Uma letra por pixel, como os itens ('k' é o contorno). M/m madeira, W brilho.
const K = "#2a2228", MADEIRA = { M: "#a8703c", m: "#6e4420", W: "#e0b078", k: K };

const CAMA = [
  "..kkkkkkkkkkkk..", ".kMMMMMMMMMMMMk.", ".kMmmmmmmmmmmMk.", ".kMkkkkkkkkkkMk.",
  ".kMkPPPPPPPPkMk.", ".kMkPWPPPPPPkMk.", ".kMkPPPPPPPpkMk.", ".kMkkkkkkkkkkMk.",
  ".kMkBBBBBBBBkMk.", ".kMkBWBBBBBBkMk.", ".kMkBBBBBBBBkMk.", ".kMkBBBBBBBBkMk.",
  ".kMkBBBBBBBBkMk.", ".kMkBBBBBBBBkMk.", ".kMkbbbbbbbbkMk.", ".kMkBBBBBBBBkMk.",
  ".kMkBBBBBBBBkMk.", ".kMkBBBBBBBBkMk.", ".kMkBBBBBBBBkMk.", ".kMkBBBBBBBBkMk.",
  ".kMkBBBBBBBBkMk.", ".kMkbbbbbbbbkMk.", ".kMkBBBBBBBBkMk.", ".kMkBBBBBBBBkMk.",
  ".kMkBBBBBBBBkMk.", ".kMkBBBBBBBBkMk.", ".kMkBBBBBBBBkMk.", ".kMkBBBBBBBbkMk.",
  ".kMkbbbbbbbbkMk.", ".kMkkkkkkkkkkMk.", ".kmmmmmmmmmmmmk.", "..kkkkkkkkkkkk..",
];
const MESA = [
  "................................", ".kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk.",
  ".kMMMMMMMMMMMMMMMMMMMMMMMMMMMMk.", ".kMWWMMMMMMMMMMMMMMMMMMMMMMMMMk.",
  ".kMWMMMMMMMMMMMMMMMMMMMMMMMMMMk.", ".kMMMMMMMMMMMMMMMMMMMMMMMMMMMMk.",
  ".kMMMMMMMMMMMMMMMMMMMMMMMMMMMMk.", ".kMMMMMMMMMMMMMMMMMMMMMMMMMMMMk.",
  ".kMMMMMMMMMMMMMMMMMMMMMMMMMMMMk.", ".kMMMMMMMMMMMMMMMMMMMMMMMMMMMMk.",
  ".kmmmmmmmmmmmmmmmmmmmmmmmmmmmmk.", ".kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk.",
  "..kmk......................kmk..", "..kmk......................kmk..",
  "..kkk......................kkk..", "................................",
];
const CADEIRA = [
  "................", "....kkkkkkkk....", "....kMMMMMMk....", "....kMWMMMMk....",
  "....kMMMMMMk....", "....kmmmmmmk....", "...kkkkkkkkkk...", "...kMMMMMMMMk...",
  "...kMWMMMMMMk...", "...kmmmmmmmmk...", "...kkkkkkkkkk...", "...kmk....kmk...",
  "...kmk....kmk...", "...kkk....kkk...", "................", "................",
];
const PLANTA = [
  "......g.g.g.....", "....gGgGgGgg....", "...gGgggGggGg...", "..gGgGgggGggGg..",
  "...gggGgGggGg...", "....gGggggGg....", ".....ggGgGg.....", "....kkkkkkkk....",
  "....kVVVVVVk....", "....kVWVVVVk....", ".....kVVVVk.....", ".....kVVVvk.....",
  ".....kVVvvk.....", "......kkkk......", "................", "................",
];
const TV = [
  "................", "..kkkkkkkkkkkk..", "..kTTTTTTTTTTk..", "..kTSSSSSSSSTk..",
  "..kTSWSSSSSSTk..", "..kTSSSSSSSSTk..", "..kTSSSSSSSSTk..", "..kTSSSSSSSSTk..",
  "..kTTTTTTTTRTk..", "..kkkkkkkkkkkk..", "......kTTk......", "....kkkkkkkk....",
  "....kmmmmmmk....", "....kkkkkkkk....", "................", "................",
];
const ABAJUR = [
  "................", "....kkkkkkkk....", "...kLLLLLLLLk...", "...kLWLLLLLLk...",
  "..kLLLLLLLLLLk..", "..kkkkkkkkkkkk..", "......kMMk......", "......kMMk......",
  "......kMMk......", "......kMMk......", "....kkkkkkkk....", "....kmmmmmmk....",
  "....kkkkkkkk....", "................", "................", "................",
];
const BAU = [
  "................", "................", "..kkkkkkkkkkkk..", ".kMMMMMMMMMMMMk.",
  ".kMWMMMMMMMMMMk.", ".kmmmmmmmmmmmmk.", ".kkkkkkYYkkkkkk.", ".kMMMMMkYkMMMMk.",
  ".kMMMMMMkMMMMMk.", ".kMMMMMMMMMMMMk.", ".kmmmmmmmmmmmmk.", ".kkkkkkkkkkkkkk.",
  "................", "................", "................", "................",
];
const ALMOFADA = [
  "................", "................", "....kkkkkkkk....", "...kRRRRRRRRk...",
  "..kRWRRRRRRRRk..", "..kRRRRRRRRRRk..", "..kkkkkWWkkkkk..", "..kWWWkWWkWWWk..",
  "..kWWWWWWWWWWk..", "...kWWWWWWWWk...", "....kkkkkkkk....", "................",
  "................", "................", "................", "................",
];
/** O PC DA BASE: fica sempre no canto; é por ele que se decora */
export const DESENHO_PC = {
  rows: [
    "................", "..kkkkkkkkkkkk..", "..kTTTTTTTTTTk..", "..kTGGGGGGGGTk..",
    "..kTGWGGGGGGTk..", "..kTGGGGGGGGTk..", "..kTTTTTTTTTTk..", "..kkkkkkkkkkkk..",
    ".kMMMMMMMMMMMMk.", ".kMWMMMMMMMMMMk.", ".kMMMMMMMMMMMMk.", ".kmmmmmmmmmmmmk.",
    ".kkkkkkkkkkkkkk.", ".kmk........kmk.", ".kkk........kkk.", "................",
  ],
  pal: { ...MADEIRA, T: "#a0a8b8", G: "#4ad06a" },
};

// ============================================================ OS MÓVEIS
// tipo: "chao" (bloqueia), "tapete" (no chão, dá pra pisar), "parede" (na
// linha de baixo da parede), "boneco" (um Pokémon de pelúcia: o desenho dele,
// pequeno) ou "poster" (o Pokémon num quadro, na parede). w/h em blocos.
export const MOVEIS = {
  "cama": { tipo: "chao", w: 1, h: 2, rows: CAMA, pal: { ...MADEIRA, P: "#f8f8f8", p: "#c8c8d8", B: "#e04848", b: "#a02828" } },
  "mesa": { tipo: "chao", w: 2, h: 1, rows: MESA, pal: MADEIRA },
  "cadeira": { tipo: "chao", w: 1, h: 1, rows: CADEIRA, pal: MADEIRA },
  "planta": { tipo: "chao", w: 1, h: 1, rows: PLANTA, pal: { k: K, g: "#58c048", G: "#2a8030", V: "#d07040", v: "#904020", W: "#f0a070" } },
  "tv": { tipo: "chao", w: 1, h: 1, rows: TV, pal: { k: K, T: "#8890a0", S: "#3a68c8", W: "#a8c8ff", R: "#ff4040", m: "#505868" } },
  "abajur": { tipo: "chao", w: 1, h: 1, rows: ABAJUR, pal: { ...MADEIRA, L: "#f8d860", W: "#fff8c0" } },
  "baú": { tipo: "chao", w: 1, h: 1, rows: BAU, pal: { ...MADEIRA, Y: "#f0c020" } },
  "almofada pokébola": { tipo: "chao", w: 1, h: 1, rows: ALMOFADA, pal: { k: K, R: "#e83838", W: "#f8f8f8" } },
  "tapete vermelho": { tipo: "tapete", w: 3, h: 2, tapete: ["#c83838", "#f0c040"] },
  "tapete azul": { tipo: "tapete", w: 3, h: 2, tapete: ["#3858c8", "#f8f8f8"] },
  "tapete glitch": { tipo: "tapete", w: 2, h: 2, xadrez: ["#ff40ff", "#18181e"] },
  "piscininha": { tipo: "chao", w: 2, h: 2, piscina: true },
  "pôster de pikachu": { tipo: "poster", mon: "pikachu" },
  "pôster de charizard": { tipo: "poster", mon: "charizard" },
  "pôster de mew": { tipo: "poster", mon: "mew" },
  "pôster de missingno": { tipo: "poster", mon: "missingno" },
  "boneco de pikachu": { tipo: "boneco", mon: "pikachu" },
  "boneco de bulbasaur": { tipo: "boneco", mon: "bulbasaur" },
  "boneco de charmander": { tipo: "boneco", mon: "charmander" },
  "boneco de squirtle": { tipo: "boneco", mon: "squirtle" },
  "boneco de eevee": { tipo: "boneco", mon: "eevee" },
  // o PUFE DE JIGGLYPUFF (desenhado pelo CAIO): dá pra SENTAR (`assento`)
  "boneco de jigglypuff": { tipo: "boneco", mon: "jigglypuff", assento: true, desenho: "assets/sprites/bases/boneco_jigglypuff.png" },
  "boneco de alcremie": { tipo: "boneco", mon: "alcremie" },
  "boneco de minior": { tipo: "boneco", mon: "minior" },
  "boneco de mew": { tipo: "boneco", mon: "mew" },
  // O ROBÔ FROAKIE (ideia do CAIO): você marca o CAMINHO e ele fica saltando
  // por ele pra sempre, em loop (src/scenes/base.js, `andarRobos`). Não
  // atrapalha ninguém. `desenho`: o que o CAIO fizer; sem, o FROAKIE de metal
  // (o desenho é do CAIO; as POSES — frente, costas, direita; parado,
  // agachado, no ar — são a `folha`, feita a partir dele por tools/robo_froakie.py)
  "robô froakie": { tipo: "robo", mon: "froakie", desenho: "assets/sprites/bases/robo_froakie.png",
                    folha: "assets/sprites/bases/robo_froakie_folha.png", quadro: 10 },
  // o grandão: 2x2
  // (`desenho`: o boneco que o CAIO desenhou, 32x32 — sem ele, o sprite do Pokémon)
  "boneco de snorlax": { tipo: "boneco", mon: "snorlax", w: 2, h: 2, desenho: "assets/sprites/bases/boneco_snorlax.png" },
};

/** A LOJA DE DECORAÇÃO (Viridian e São Lucário), com o próprio kit */
export const LOJA_DECORACAO = [
  { item: KIT_BASE, price: 500 },
  { item: "cama", price: 2000 }, { item: "mesa", price: 1500 }, { item: "cadeira", price: 600 },
  { item: "planta", price: 800 }, { item: "tv", price: 3000 }, { item: "abajur", price: 700 },
  { item: "baú", price: 1200 }, { item: "almofada pokébola", price: 500 },
  { item: "tapete vermelho", price: 1000 }, { item: "tapete azul", price: 1000 },
  { item: "pôster de pikachu", price: 800 }, { item: "pôster de charizard", price: 800 },
  { item: "boneco de pikachu", price: 1000 }, { item: "boneco de bulbasaur", price: 1000 },
  { item: "boneco de charmander", price: 1000 }, { item: "boneco de squirtle", price: 1000 },
  { item: "robô froakie", price: 2500 },
];

/** No BALCÃO DE FICHAS do cassino (os que não se compram com dinheiro) */
export const MOVEIS_FICHAS = [
  { item: "piscininha", preco: 300 }, { item: "tapete glitch", preco: 250 },
  { item: "boneco de mew", preco: 500 }, { item: "boneco de snorlax", preco: 400 },
  { item: "pôster de mew", preco: 200 },
];

/** ACHADOS: POKÉ BOLAS no chão (lugares onde o FireRed tinha bola) */
export const BOLAS_MOVEIS = [
  ["viridian_forest", 49, 60, "boneco de eevee"],
  ["mt_moon_1f", 11, 35, "boneco de jigglypuff"],
  ["route9", 12, 17, "boneco de alcremie"],
  ["pokemon_mansion_1f", 22, 6, "pôster de missingno"],
  ["rock_tunnel_b1f", 2, 37, "boneco de minior"],
];

/** quem dá o KIT (e explica) e a LOJA: Viridian (Kanto) e São Lucário (Braglitch) */
export const NPCS_BASE = [
  { mapa: "viridian", x: 24, y: 32 }, { mapa: "sao_lucario", x: 12, y: 13 },
];

export const BASES_TEXTO = {
  escoteira: [
    "EU SOU ESCOTEIRA! SABE O QUE É MELHOR QUE ACAMPAR? TER UMA BASE SECRETA.",
    "COM ESTE KIT, É SÓ FICAR DE FRENTE PRA UMA ÁRVORE, PEDRA OU PAREDE E USAR NA MOCHILA.",
    "DÁ PRA TER UMA EM CADA REGIÃO. E ELA É SECRETA DE VERDADE: NINGUÉM VÊ A PORTA, SÓ VOCÊ!",
  ],
  ganhouKit: "VOCÊ GANHOU O KIT DE BASE SECRETA!",
  jaTem: ["E AÍ, JÁ DECOROU A SUA BASE? A LOJA AQUI DO LADO TEM MÓVEIS!"],
  loja: ["LOJA DE DECORAÇÃO! MÓVEIS, TAPETES, PÔSTERES E BONECOS PRA SUA BASE SECRETA."],
  // o kit
  aquiNao: "AQUI NÃO DÁ. FICA DE FRENTE PRA UMA ÁRVORE, PEDRA OU PAREDE, AO AR LIVRE.",
  dentroNao: "DENTRO DE CASA NÃO DÁ. TEM QUE SER AO AR LIVRE.",
  abrirAqui: "ABRIR SUA BASE SECRETA AQUI?",
  // as duas funções do KIT (pedido do CAIO): PRA BAIXO = um buraco no chão da
  // sua frente, com escada (pisou, entrou); NA PAREDE = a porta de sempre
  tipoKit: "COMO VAI SER A BASE?",
  tiposKit: ["PRA BAIXO", "NA PAREDE", "SAIR"],
  chaoNao: "AQUI NÃO DÁ PRA CAVAR. FICA DE FRENTE PRA UM CHÃO LIVRE, AO AR LIVRE.",
  abriuChao: "VOCÊ CAVOU UM BURACO SECRETO COM ESCADA! SÓ VOCÊ VÊ. É SÓ PISAR PRA DESCER.",
  mudar: "VOCÊ JÁ TEM UMA BASE EM {REGIAO}. ELA VAI MUDAR PRA CÁ (OS MÓVEIS VÃO JUNTO). MUDAR?",
  sim: ["ABRIR", "NÃO"],
  abriu: "VOCÊ ABRIU UMA PASSAGEM SECRETA! SÓ VOCÊ VÊ A PORTA.",
  // dentro
  pc: "PC DA BASE",
  pcOpcoes: ["DECORAR", "TIRAR MÓVEL", "POKÉMON SOLTOS", "SAIR"],
  // ESCONDER A BASE (pedido do CAIO): ninguém do online acha mais, nem
  // esbarrando, e a entrada fica camuflada (só um risquinho, pra você achar)
  esconder: "ESCONDER A BASE",
  mostrar: "MOSTRAR A BASE",
  escondeu: "A BASE FICOU ESCONDIDA! NINGUÉM DO ONLINE ACHA MAIS, NEM ESBARRANDO. A ENTRADA FICOU CAMUFLADA.",
  mostrou: "A BASE VOLTOU A PODER SER ACHADA: QUEM ESBARRAR NA ENTRADA BATE NA PORTA.",
  semMoveis: "VOCÊ NÃO TEM NENHUM MÓVEL NA MOCHILA. A LOJA DE DECORAÇÃO TEM!",
  qualMovel: "QUAL MÓVEL?",
  decorarDica: "SETAS: MOVER  Z: PÔR  X: CANCELAR",
  tirarDica: "SETAS: ESCOLHER  Z: TIRAR  X: VOLTAR",
  naoCabe: "NÃO CABE AÍ.",
  soParede: "PÔSTER SÓ NA PAREDE.",
  soChao: "ISSO VAI NO CHÃO.",
  quaisMons: "QUEM FICA SOLTO NA BASE? (ATÉ 6)",
  monsOpcoes: ["PÔR UM", "TIRAR TODOS", "VOLTAR"],
  monsCheio: "JÁ TEM 6 POKÉMON SOLTOS.",
  // visitas
  baseDe: "BASE SECRETA DE {NOME}",
  batendo: "VOCÊ ACHOU UMA PASSAGEM SECRETA! É A BASE DE {NOME}... BATENDO NA PORTA...",
  ninguem: "NINGUÉM RESPONDEU. A BASE FICA FECHADA QUANDO O DONO NÃO ESTÁ NO ONLINE.",
  achouSua: "{NOME} ACHOU A SUA BASE SECRETA!",
  visitaDica: "VOCÊ ESTÁ VISITANDO. SÓ O DONO MEXE NOS MÓVEIS.",
  sentou: "VOCÊ SENTOU NO PUFE. (UMA SETA PRA LEVANTAR)",
  caminhoDica: "Z: MARCAR PONTO  X: PRONTO",
  caminhoComeco: "AGORA MARCA O CAMINHO DO ROBÔ: Z EM CADA PONTO, X QUANDO ACABAR.",
  caminhoCurto: "MARCA PELO MENOS 1 PONTO PRA ELE PULAR.",
  regioes: { kanto: "KANTO", braglitch: "BRAGLITCH", kalos: "KALOS" },
};
