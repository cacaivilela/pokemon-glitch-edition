// OS DOCES DO ALCREMIE (ideia do CAIO). Cada doce tem uma COR DE CREME:
// - o MILCERY que come um doce evolui na hora pra ALCREMIE com o creme
//   daquela cor (o nível 32 continua valendo: aí sai o de creme branco);
// - o ALCREMIE que come mais doce ganha a cor nova num REDEMOINHO, uma faixa
//   de cada cor, até 3 cores (a quarta empurra a mais antiga pra fora).
// O enfeite de cima continua o morango. As cores ficam guardadas no seed do
// bicho (como as manchas do SPINDA) e o desenho é pintado na hora
// (src/core/assets.js, `alcremie`); as regras estão em src/systems/doces.js.
//
// De onde vêm: os 7 do Sword/Shield (`balcao: true`) se trocam por FICHAS no
// balcão do cassino de CELADON; e TODOS saem do LIQUIDIFICADOR DE BERRIES de
// Cinnabar no modo DOCE — cada cor de pokébloco dá o doce daquela cor (os 6
// novos só saem de lá).

export const DOCES = [
  // os 7 do Sword/Shield
  { item: "doce de morango", nome: "MORANGO", cor: "rosa", creme: "#f8b4cc", balcao: true },
  { item: "doce de frutinha", nome: "FRUTINHA", cor: "roxo", creme: "#cca4ec", balcao: true },
  { item: "doce de amor", nome: "AMOR", cor: "vermelho", creme: "#f48478", balcao: true },
  { item: "doce de estrela", nome: "ESTRELA", cor: "amarelo", creme: "#f8e88c", balcao: true },
  { item: "doce de trevo", nome: "TREVO", cor: "verde", creme: "#b4e09c", balcao: true },
  { item: "doce de flor", nome: "FLOR", cor: "azulclaro", creme: "#a8e0f4", balcao: true },
  { item: "doce de laço", nome: "LAÇO", cor: "marrom", creme: "#dcac7c", balcao: true },
  // os novos (só no liquidificador)
  { item: "doce de oceano", nome: "OCEANO", cor: "azul", creme: "#8cacf4" },
  { item: "doce de noite", nome: "NOITE", cor: "anil", creme: "#8c7cd4" },
  { item: "doce de erva", nome: "ERVA", cor: "oliva", creme: "#cccc7c" },
  { item: "doce de nuvem", nome: "NUVEM", cor: "cinza", creme: "#ccd0d8" },
  { item: "doce dourado", nome: "DOURADO", cor: "dourado", creme: "#f8d45c" },
  // a mistura estragada (a mesma berry duas vezes) vira o doce do jogo
  { item: "doce glitch", nome: "GLITCH", cor: "preto", creme: "#5c5c70" },

  // OS DOCES DO BRASIL (o CAIO pediu mais 12: os brasileiros, e um deles é o
  // DOCE BRASILEIRO, com a bandeira; era "brazilian sweet", traduzido a pedido). Não são cor de pokébloco: saem de uma
  // RECEITA no liquidificador (exatamente essas berries, no modo DOCE — a
  // CONFEITEIRA de Cinnabar conta) ou do balcão de fichas, mais caros.
  // `padrao`: o creme não é chapado — "granulado" (pontinhos de chocolate),
  // "sementes" (as do maracujá) ou "bandeira" (a do Brasil, no corpo todo).
  // (sempre no FIM da lista: a posição de cada doce é o que fica no seed)
  { item: "brigadeiro", nome: "BRIGADEIRO", creme: "#8a5a44", brasil: true, padrao: "granulado", receita: ["chesto berry", "nanab berry"] },
  { item: "doce de açaí", nome: "AÇAÍ", creme: "#7a4a90", brasil: true, receita: ["chesto berry", "oran berry"] },
  { item: "paçoca", nome: "PAÇOCA", creme: "#e8cc98", brasil: true, receita: ["nanab berry", "pinap berry"] },
  { item: "doce de jabuticaba", nome: "JABUTICABA", creme: "#4a3454", brasil: true, receita: ["chesto berry", "persim berry"] },
  { item: "goiabada", nome: "GOIABADA", creme: "#e4566e", brasil: true, receita: ["cheri berry", "pecha berry"] },
  { item: "doce de maracujá", nome: "MARACUJÁ", creme: "#f4c83c", brasil: true, padrao: "sementes", receita: ["aspear berry", "pinap berry"] },
  { item: "quindim", nome: "QUINDIM", creme: "#ffe43a", brasil: true, receita: ["aspear berry", "nanab berry"] },
  { item: "doce de caju", nome: "CAJU", creme: "#f48040", brasil: true, receita: ["cheri berry", "figy berry"] },
  { item: "cocada", nome: "COCADA", creme: "#f6f2e6", brasil: true, receita: ["pecha berry", "leppa berry"] },
  { item: "pé-de-moleque", nome: "PÉ-DE-MOLEQUE", creme: "#b07a44", brasil: true, receita: ["rawst berry", "figy berry"] },
  { item: "beijinho", nome: "BEIJINHO", creme: "#fbe2ec", brasil: true, receita: ["pecha berry", "persim berry"] },
  // a bandeira: verde, amarela e azul — as três berries dessas cores
  { item: "doce brasileiro", nome: "DOCE BRASILEIRO", creme: "#2aa84a", brasil: true, padrao: "bandeira",
    receita: ["rawst berry", "aspear berry", "oran berry"] },
];

export const DOCES_TEXTO = {
  // no balcão de fichas do cassino
  precoBalcao: 100,
  categorias: ["POKÉMON", "DOCES", "DOCES DO BRASIL", "MÓVEIS", "SAIR"],
  qualDoce: "QUAL DOCE? ({PRECO} FICHAS CADA)",
  ganhouDoce: "VOCÊ GANHOU: {ITEM}!",
  // usando na mochila
  evolui: "{MON} COMEU {ITEM}...",
  girou: "{MON} COMEU {ITEM}! O CREME GIROU E AGORA TEM: {CORES}.",
  saiuCor: "(A COR {COR} SAIU DO REDEMOINHO: SÓ CABEM 3.)",
  nada: "{MON} NÃO SABE O QUE FAZER COM UM DOCE TÃO BONITO.",
  // no liquidificador
  modo: "O QUE VOCÊ QUER FAZER?",
  modos: ["POKÉBLOCO", "DOCE", "SAIR"],
  saiuDoce: "SAIU UM",
  // os do Brasil no balcão: mais caros, em duas páginas (a lista não cabe)
  precoBrasil: 200,
  categoriaBrasil: "DOCES DO BRASIL",
  mais: "MAIS...",
  voltar: "VOLTAR",
  // A CONFEITEIRA de Cinnabar, do lado do liquidificador
  confeiteira: [
    "EU SOU CONFEITEIRA! O ALCREMIE ADORA DOCE DO BRASIL.",
    "É SÓ BATER AS BERRIES CERTAS NO LIQUIDIFICADOR, NO MODO DOCE. ANOTA AS MINHAS RECEITAS:",
  ],
  receitaFim: "A ÚLTIMA É A MAIS DIFÍCIL: TRÊS BERRIES, AS CORES DA BANDEIRA!",
};

/** Até quantas cores cabem no redemoinho */
export const MAX_CORES = 3;
