// OS POKÉBLOCOS, como no Ruby/Sapphire: as BERRIES vão no LIQUIDIFICADOR DE
// BERRIES (ao lado do palco do concurso, em Cinnabar), você bate no ritmo, e
// sai um POKÉBLOCO com os sabores delas. Ele é pra dar aos POKÉMON SELVAGENS,
// na batalha (o ESTOJO, na mochila da batalha):
// - comendo, ele fica MAIS FÁCIL DE PEGAR (quanto mais sabor, mais fácil);
// - a RESISTÊNCIA (o quanto ele é duro) diz quantos turnos isso dura;
// - o PESO enche a barriga: barriga cheia demais e ele FICA GORDO, e aí é mais
//   DIFÍCIL de pegar (bicho grande aguenta mais, pequeno enche rápido);
// - pokébloco PESADO dá DEFESA a ele, e enquanto o efeito dura ele fica MAIS
//   LARGO. Se você pegar um que comeu pesado, ele vem com o GARFO (ψ) depois do
//   nome, fica mais pesado e a defesa dele sobe mais rápido a cada nível.
// As contas estão em src/systems/pokeblocos.js; o liquidificador é a cena
// src/scenes/liquidificador.js.

/** Os cinco sabores, na ordem de sempre */
export const SABORES = [
  { id: "picante", nome: "PICANTE" },
  { id: "seco", nome: "SECO" },
  { id: "doce", nome: "DOCE" },
  { id: "amargo", nome: "AMARGO" },
  { id: "azedo", nome: "AZEDO" },
];

/** Os sabores de cada berry [picante, seco, doce, amargo, azedo] — os do
 *  Ruby/Sapphire —, a cor que ela pinta o liquidificador, a DUREZA (0 mole a
 *  3 dura: a CHESTO, a ASPEAR, a GANLON de casca, a STARF) e o PESO (1 a 3: a
 *  SITRUS, a LANSAT e a STARF são as pesadas) */
export const BERRIES_SABOR = {
  "cheri berry": { sabor: [10, 0, 0, 0, 0], cor: "#e8403c", dureza: 1, peso: 1 },
  "chesto berry": { sabor: [0, 10, 0, 0, 0], cor: "#8a5ad0", dureza: 3, peso: 1 },
  "pecha berry": { sabor: [0, 0, 10, 0, 0], cor: "#f49ac0", dureza: 0, peso: 1 },
  "rawst berry": { sabor: [0, 0, 0, 10, 0], cor: "#4aa848", dureza: 2, peso: 1 },
  "aspear berry": { sabor: [0, 0, 0, 0, 10], cor: "#f0d040", dureza: 3, peso: 1 },
  "leppa berry": { sabor: [10, 0, 10, 10, 10], cor: "#d8483a", dureza: 1, peso: 2 },
  "oran berry": { sabor: [10, 10, 0, 10, 10], cor: "#4a7ad8", dureza: 1, peso: 1 },
  "persim berry": { sabor: [10, 10, 10, 0, 10], cor: "#f0889a", dureza: 0, peso: 1 },
  "lum berry": { sabor: [10, 10, 10, 10, 0], cor: "#8ad860", dureza: 2, peso: 1 },
  "sitrus berry": { sabor: [0, 10, 10, 10, 10], cor: "#f0c838", dureza: 1, peso: 3 },
  "figy berry": { sabor: [15, 0, 0, 0, 0], cor: "#c8402c", dureza: 1, peso: 1 },
  "nanab berry": { sabor: [0, 0, 10, 10, 0], cor: "#f0d860", dureza: 0, peso: 2 },
  "pinap berry": { sabor: [10, 0, 0, 0, 10], cor: "#e8d040", dureza: 2, peso: 2 },
  "liechi berry": { sabor: [30, 10, 30, 0, 0], cor: "#e83848", dureza: 2, peso: 2 },
  "ganlon berry": { sabor: [0, 30, 10, 30, 0], cor: "#4a4ab0", dureza: 3, peso: 2 },
  "salac berry": { sabor: [0, 0, 30, 10, 30], cor: "#48b058", dureza: 2, peso: 2 },
  "petaya berry": { sabor: [30, 0, 0, 30, 10], cor: "#f058a8", dureza: 1, peso: 2 },
  "apicot berry": { sabor: [10, 30, 0, 0, 30], cor: "#3a58b8", dureza: 2, peso: 2 },
  "lansat berry": { sabor: [30, 10, 30, 10, 30], cor: "#f08838", dureza: 2, peso: 3 },
  "starf berry": { sabor: [30, 10, 30, 10, 30], cor: "#f0e048", dureza: 3, peso: 3 },
};

/** As cores do pokébloco. Um sabor só: a cor dele. Dois: a do sabor mais
 *  forte, misturada. Três ou mais: CINZA (DOURADO quando ficou forte). A
 *  mesma berry duas vezes estraga: PRETO. */
export const CORES = {
  vermelho: { nome: "VERMELHO", cor: "#e8403c" },
  azul: { nome: "AZUL", cor: "#3a6ad8" },
  rosa: { nome: "ROSA", cor: "#f490b8" },
  verde: { nome: "VERDE", cor: "#3aa848" },
  amarelo: { nome: "AMARELO", cor: "#f0d040" },
  roxo: { nome: "ROXO", cor: "#9a4ac0" },
  anil: { nome: "ANIL", cor: "#4a40a0" },
  marrom: { nome: "MARROM", cor: "#a0683a" },
  azulclaro: { nome: "AZUL-CLARO", cor: "#68c0e8" },
  oliva: { nome: "OLIVA", cor: "#98a040" },
  cinza: { nome: "CINZA", cor: "#9098a0" },
  dourado: { nome: "DOURADO", cor: "#f0c020" },
  preto: { nome: "PRETO", cor: "#30303a" },
};
/** a cor de um sabor só, e a de dois quando ele é o mais forte */
export const COR_DO_SABOR = ["vermelho", "azul", "rosa", "verde", "amarelo"];
export const COR_MISTA = ["roxo", "anil", "marrom", "azulclaro", "oliva"];

/** O estojo onde os pokéblocos ficam (é ele que a mochila da batalha usa) */
export const ESTOJO = "estojo de pokéblocos";
/** quantos pokéblocos cabem no estojo */
export const ESTOJO_MAX = 40;
/** O POKÉBLOCO NA BATALHA:
 *  - `captura`: a captura fica (1 + força / captura.porForca) vezes mais
 *    fácil, até captura.max;
 *  - `turnos`: os turnos que isso dura = 1 + a resistência;
 *  - `barriga`: quanto peso cabe = barriga.base + o peso da espécie (kg) /
 *    barriga.porKg, até barriga.max; passou disso, GORDO: captura x `gordo`;
 *  - `pesado`: pokébloco com esse peso ou mais dá +1 de DEFESA e deixa ele
 *    `largura` vezes mais largo enquanto dura;
 *  - pego depois de comer pesado: a MARCA depois do nome, `pesoExtra` kg a
 *    mais por pokébloco pesado que comeu e a defesa ganhando 1 a mais a cada
 *    `defesaPorNivel` níveis. */
export const BATALHA = {
  captura: { porForca: 40, max: 3 },
  barriga: { base: 4, porKg: 15, max: 18 },
  gordo: 0.5,
  pesado: 6,
  largura: 1.3,
  marca: "ψ",
  pesoExtra: 6,
  defesaPorNivel: 3,
};

/** O VENDEDOR DE BERRIES, do lado do liquidificador */
export const VENDA_BERRIES = [
  { item: "cheri berry", price: 80 }, { item: "chesto berry", price: 80 }, { item: "pecha berry", price: 80 },
  { item: "rawst berry", price: 80 }, { item: "aspear berry", price: 80 }, { item: "oran berry", price: 120 },
  { item: "persim berry", price: 120 }, { item: "leppa berry", price: 150 }, { item: "figy berry", price: 150 },
  { item: "nanab berry", price: 150 }, { item: "pinap berry", price: 150 },
];

/** Os arbustos da MATA DAS FRUTAS (Ilha Três): cada um dá uma berry, sorteada
 *  da lista dele, e volta a dar depois de `cresce` minutos de jogo. Os do
 *  fundo da mata têm as raras. */
export const ARBUSTOS = {
  mapa: "three_island_berry_forest",
  cresce: 20,
  comuns: ["cheri berry", "chesto berry", "pecha berry", "rawst berry", "aspear berry", "oran berry",
           "persim berry", "leppa berry", "figy berry", "nanab berry", "pinap berry", "sitrus berry", "lum berry"],
  raras: ["liechi berry", "ganlon berry", "salac berry", "petaya berry", "apicot berry", "lansat berry", "starf berry"],
  // [x, y, rara?]
  lugares: [[12, 5, 0], [22, 6, 0], [13, 10, 0], [16, 15, 0], [22, 21, 0], [11, 24, 0], [25, 24, 0],
            [40, 15, 0], [46, 22, 1], [36, 37, 1], [10, 38, 0], [42, 37, 1]],
};

export const POKEBLOCO_TEXTO = {
  vendedor: ["BERRIES FRESQUINHAS! É SÓ JOGAR NO LIQUIDIFICADOR AQUI DO LADO E VIRA POKÉBLOCO."],
  liquidificador: ["O LIQUIDIFICADOR DE BERRIES. É SÓ ESCOLHER AS BERRIES E BATER NO RITMO!"],
  ganhouEstojo: ["UM ESTOJO DE POKÉBLOCOS ESTAVA DO LADO DA MÁQUINA. AGORA É SEU!",
                 "OS POKÉBLOCOS SÃO PROS POKÉMON SELVAGENS: NA BATALHA, ABRA O ESTOJO NA MOCHILA E JOGUE UM.",
                 "COMENDO, ELES FICAM MAIS FÁCEIS DE PEGAR. MAS CUIDADO PRA NÃO ENCHER DEMAIS A BARRIGA DELES!"],
  semBerry: "VOCÊ NÃO TEM NENHUMA BERRY. O VENDEDOR AQUI DO LADO TEM!",
  estojoCheio: "O ESTOJO ESTÁ CHEIO! DÊ ALGUNS POKÉBLOCOS PROS SEUS POKÉMON ANTES.",
  estojoVazio: "O ESTOJO ESTÁ VAZIO. FAÇA POKÉBLOCOS NO LIQUIDIFICADOR DE CINNABAR!",
  soNaBatalha: "OS POKÉBLOCOS SÃO PROS POKÉMON SELVAGENS. ABRA O ESTOJO NA MOCHILA DURANTE A BATALHA!",
  soSelvagem: "O TREINADOR NÃO DEIXA O POKÉMON DELE COMER O QUE VOCÊ JOGA!",
  qual: "QUAL POKÉBLOCO?",
  jogou: "VOCÊ JOGOU UM POKÉBLOCO {COR}!",
  comeu: "O {MON} SELVAGEM COMEU! ELE ESTÁ DISTRAÍDO: MAIS FÁCIL DE PEGAR!",
  duro: "O POKÉBLOCO É DURO: ELE VAI FICAR MASTIGANDO UM TEMPÃO.",
  mole: "O POKÉBLOCO É MOLE: ELE ENGOLIU RAPIDINHO.",
  pesado: "O POKÉBLOCO ERA PESADO! O {MON} FICOU LARGÃO E A DEFESA DELE SUBIU!",
  gordo: "A BARRIGA DO {MON} ENCHEU DEMAIS... ELE FICOU GORDO! AGORA É MAIS DIFÍCIL DE PEGAR.",
  cheio: "O {MON} JÁ ESTÁ GORDO DEMAIS. NÃO QUER MAIS COMER!",
  acabou: "O {MON} TERMINOU DE COMER.",
  marca: "O {MON} COMEU POKÉBLOCO PESADO: ELE VEM COM O GARFO NO NOME E VAI FICAR CADA VEZ MAIS RESISTENTE!",
  arbusto: "UM ARBUSTO DE BERRIES.",
  colheu: "VOCÊ COLHEU UMA {BERRY}!",
  semFruta: "O ARBUSTO AINDA NÃO DEU FRUTA DE NOVO.",
};
