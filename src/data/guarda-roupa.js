// O GUARDA-ROUPA ÚNICO: o jeito de vestir um Pokémon com uma FORMA ÚNICA (os
// desenhos do UNIQUEMON, src/data/formas-unicas.js). Usado pela mochila num
// bicho, ele mostra as roupas da espécie dele — a normal e as únicas — e troca.
// É só roupa: nível, golpes, atributos, apelido, tudo fica. Formas únicas não
// aparecem no mato; só existem vestidas. Vendido em toda loja, uma vez só.
export const GUARDA_ROUPA = {
  item: "guarda-roupa único",
  preco: 3000,
  pergunta: "QUE ROUPA {MON} VAI VESTIR?",
  normal: "{NOME} (NORMAL)",
  vestiu: "{MON} VESTIU {ROUPA}!",
  tirou: "{MON} TIROU A ROUPA E VOLTOU A SER {NOME}.",
  semRoupa: "NÃO TEM NENHUMA ROUPA DE {NOME} NO GUARDA-ROUPA AINDA. DESENHAR UMA NO UNIQUEMON?",
  // abre o UNIQUEMON numa aba nova, já com a espécie dele na bancada
  desenhar: "DESENHAR NOVA",
  abriu: "O UNIQUEMON ABRIU NUMA ABA NOVA. DESENHE, PUBLIQUE, E A ROUPA APARECE AQUI!",
  jaEsta: "{MON} JÁ ESTÁ COM ESSA ROUPA.",
};
