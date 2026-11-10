// OS ITENS DE SEGURAR (o CAIO pediu: "fazer os pkmn segurarem itens e ter
// itens que foram feitos pra serem segurados"). Cada Pokémon segura UM item
// (o campo `item` dele). Você dá pela MOCHILA (escolhe o item, escolhe quem
// segura; quem já segurava devolve o dele) e tira pelo menu EQUIPE.
//
// Quatro famílias, como ele escolheu:
// - DE BATALHA: SOBRAS, FAIXA DO FOCO, GARRA RÁPIDA, LENTE DE MIRA;
// - DE TIPO: um por tipo (os 19, com o GLITCH), +20% no golpe daquele tipo;
// - BERRIES SEGURADAS: ele come sozinho na hora certa (e a berry acaba);
// - DE TREINO: OVO DA SORTE, PEDRA ETERNA, MOEDA AMULETO, SINO CALMANTE.
// De onde vêm: POKÉ BOLAS no chão (nos lugares onde o FireRed tinha bola) e
// POKÉMON SELVAGENS que já vêm segurando — pegou, o item vem junto. Dos
// treinadores, só os LÍDERES seguram. As contas estão em src/systems/segurar.js.

/** o que cada item faz. `tipo` (de tipo) é o tipo do golpe que ele fortalece */
export const SEGURAVEIS = {
  // ---- de batalha
  "sobras": { efeito: "sobras", desc: "CURA UM POUQUINHO DE HP NO FIM DE CADA TURNO." },
  "faixa do foco": { efeito: "foco", desc: "COM O HP CHEIO, AGUENTA UM GOLPE QUE IA DERRUBAR (1 VEZ)." },
  "garra rápida": { efeito: "garra", desc: "ÀS VEZES ATACA PRIMEIRO, MESMO SENDO MAIS LENTO." },
  "lente de mira": { efeito: "mira", desc: "OS GOLPES ERRAM MENOS." },
  // os NOVOS (nov/2026, "faz tbm outros itens... seguráveis"): vendidos nas
  // lojas depois de 5 insígnias (src/data/itens-uso.js)
  "orbe da vida": { efeito: "orbe", desc: "OS GOLPES BATEM 30% MAIS FORTE, MAS CADA GOLPE TIRA UM POUCO DO SEU HP." },
  "cinto expert": { efeito: "cinto", desc: "GOLPE SUPER EFETIVO BATE 20% MAIS FORTE." },
  "faixa de força": { efeito: "forca", desc: "GOLPES FÍSICOS BATEM 10% MAIS FORTE." },
  "óculos sábios": { efeito: "sabio", desc: "GOLPES ESPECIAIS BATEM 10% MAIS FORTE." },
  "sino da concha": { efeito: "concha", desc: "CURA UM OITAVO DO DANO QUE CAUSAR." },
  "capacete rochoso": { efeito: "capacete", desc: "QUEM BATER COM GOLPE FÍSICO PERDE UM POUCO DE HP." },
  // a PEDRA DO TROVÃO também se segura: com um FANTASMA (do tipo, ou que sabe
  // golpe FANTASMA) ela volta ASSOMBRADA — é a que evolui o MONSTELITO. No
  // bicho que ela evolui (PIKACHU, EEVEE...) ela continua sendo usada, não dada.
  "pedra do trovão": { efeito: "assombrar", desc: "SE UM POKÉMON FANTASMA SEGURAR ESTA PEDRA, ELA VOLTA ASSOMBRADA." },
  // ---- de tipo (+20%)
  "lenço de seda": { tipo: "NORMAL" },
  "carvão": { tipo: "FOGO" },
  "água mística": { tipo: "ÁGUA" },
  "ímã": { tipo: "ELÉTRICO" },
  "semente milagrosa": { tipo: "PLANTA" },
  "gelo eterno": { tipo: "GELO" },
  "faixa preta": { tipo: "LUTADOR" },
  "farpa venenosa": { tipo: "VENENO" },
  "areia macia": { tipo: "TERRA" },
  "bico afiado": { tipo: "VOADOR" },
  "colher torta": { tipo: "PSÍQUICO" },
  "pó prateado": { tipo: "INSETO" },
  "pedra dura": { tipo: "PEDRA" },
  "etiqueta maldita": { tipo: "FANTASMA" },
  "presa de dragão": { tipo: "DRAGÃO" },
  "óculos escuros": { tipo: "SOMBRIO" },
  "revestimento metálico": { tipo: "AÇO" },
  "pena de fada": { tipo: "FADA" },
  "dado corrompido": { tipo: "GLITCH" },
  // ---- berries (ele come sozinho; `hp` = quanto cura, `metade` = só com metade ou menos)
  "oran berry": { efeito: "berry", cura: 10 },
  "sitrus berry": { efeito: "berry", curaPct: 0.25 },
  "cheri berry": { efeito: "berry", status: ["paralisia"] },
  "pecha berry": { efeito: "berry", status: ["envenenado"] },
  "rawst berry": { efeito: "berry", status: ["queimadura"] },
  "lum berry": { efeito: "berry", status: ["paralisia", "envenenado", "queimadura"] },
  // ---- de treino
  "ovo da sorte": { efeito: "xp", desc: "GANHA 50% A MAIS DE EXPERIÊNCIA." },
  "pedra eterna": { efeito: "eterna", desc: "NÃO EVOLUI POR NÍVEL NEM POR AMIZADE." },
  "moeda amuleto": { efeito: "moeda", desc: "O DINHEIRO DA VITÓRIA VEM DOBRADO." },
  "sino calmante": { efeito: "sino", desc: "A AMIZADE SOBE DUAS VEZES MAIS RÁPIDO." },
};

export const SEGURAR_CONFIG = {
  bonusTipo: 1.2,
  sobras: 1 / 16,
  garra: 0.2,            // chance de sair primeiro
  xp: 1.5,
  // o SELVAGEM que já vem segurando: a chance, e o que ele segura (berry é o
  // mais comum; o resto, o item do tipo dele)
  selvagem: 0.06,
  selvagemBerries: ["oran berry", "oran berry", "sitrus berry", "cheri berry", "pecha berry", "rawst berry", "lum berry"],
  selvagemBerryChance: 0.6,
  // o LÍDER: o último (o trunfo) segura SITRUS; os outros, o item do tipo deles
  liderTrunfo: "sitrus berry",
};

/** AS POKÉ BOLAS NO CHÃO: [mapa, x, y, item] — nos lugares onde o FireRed
 *  tinha bola, na ordem da jornada (os mais fortes perto do fim) */
export const BOLAS_SEGURAR = [
  ["route2", 17, 54, "pedra eterna"],
  ["viridian_forest", 40, 21, "pó prateado"],
  ["viridian_forest", 5, 41, "semente milagrosa"],
  ["mt_moon_1f", 26, 32, "pedra dura"],
  ["mt_moon_b2f", 35, 5, "areia macia"],
  ["route4", 67, 5, "lenço de seda"],
  ["route24", 11, 4, "água mística"],
  ["route25", 26, 2, "lente de mira"],
  ["route11", 42, 12, "faixa preta"],
  ["route9", 65, 17, "carvão"],
  ["rock_tunnel_1f", 37, 5, "garra rápida"],
  ["celadon_city", 5, 3, "moeda amuleto"],
  ["pokemon_tower_5f", 11, 9, "etiqueta maldita"],
  ["pokemon_tower_6f", 5, 15, "sino calmante"],
  ["route12", 18, 36, "farpa venenosa"],
  ["rocket_hideout_b2f", 15, 3, "óculos escuros"],
  ["route15", 20, 6, "bico afiado"],
  ["silph_co_5f", 22, 21, "colher torta"],
  ["silph_co_7f", 30, 11, "revestimento metálico"],
  ["safari_zone_east", 13, 12, "sobras"],
  ["safari_zone_west", 28, 14, "presa de dragão"],
  ["power_plant", 26, 22, "ímã"],
  ["seafoam_islands_b1f", 19, 18, "gelo eterno"],
  ["pokemon_mansion_2f", 18, 23, "pena de fada"],
  ["pokemon_mansion_b1f", 23, 4, "dado corrompido"],
  ["route11", 63, 13, "ovo da sorte"],
  ["victory_road_1f", 12, 3, "faixa do foco"],
];

export const SEGURAR_TEXTO = {
  // a mochila
  quem: "QUEM VAI SEGURAR?",
  deu: "{MON} AGORA SEGURA: {ITEM}.",
  trocou: "{MON} DEVOLVEU {VELHO} PRA MOCHILA E AGORA SEGURA: {ITEM}.",
  // o menu EQUIPE
  opcao: "ITEM",
  segura: "{MON} ESTÁ SEGURANDO: {ITEM}.",
  nada: "{MON} NÃO ESTÁ SEGURANDO NADA. DÊ UM ITEM PELA MOCHILA.",
  tirarOpcoes: ["TIRAR", "DEIXAR"],
  tirou: "VOCÊ PEGOU {ITEM} DE VOLTA.",
  // a PEDRA DO TROVÃO que ficou com um FANTASMA (src/systems/segurar.js)
  assombrou: "A PEDRA VOLTOU FRIA... E TEM UM ROSTINHO DE PONTINHOS AZUIS PISCANDO DENTRO DELA.",
  // a batalha
  sobras: "{MON} RECUPEROU UM POUCO DE HP COM AS SOBRAS.",
  foco: "{MON} AGUENTOU FIRME COM A FAIXA DO FOCO!",
  garra: "A GARRA RÁPIDA DE {MON} BRILHOU!",
  berryCura: "{MON} COMEU A {ITEM} E RECUPEROU HP!",
  berryStatus: "{MON} COMEU A {ITEM} E FICOU BOM!",
  selvagem: "O {MON} SELVAGEM ESTÁ SEGURANDO ALGUMA COISA...",
  capturouCom: "{MON} ESTAVA SEGURANDO: {ITEM}!",
  moeda: "A MOEDA AMULETO DOBROU O PRÊMIO!",
  orbe: "{MON} PERDEU UM POUCO DE HP POR CAUSA DO ORBE DA VIDA!",
  concha: "{MON} RECUPEROU UM POUCO DE HP COM O SINO DA CONCHA!",
  capacete: "{MON} SE MACHUCOU NO CAPACETE ROCHOSO!",
};
