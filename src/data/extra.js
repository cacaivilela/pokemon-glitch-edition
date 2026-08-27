// Espécies que NÃO são de Kanto — elas vazam de outras regiões pela
// 011GLITCHDIMENSION110 e só aparecem lá dentro. Três famílias:
//   - dados soltos: PORYGON2/-Z, UNOWN, SHEDINJA, ROTOM, BRONZOR, KLINK
//   - fósseis remontados errado: CRANIDOS, SHIELDON, LILEEP, ANORITH,
//     TIRTOUGA, ARCHEN, DRACOZOLT, DRACOVISH
//   - coisas que não deviam caber aqui: LUNATONE, SOLROCK, CRYOGONAL, GOLETT
// Os lendários ficam por último (ver WEATHER_TRIO, RARE_LEGEND e TEMPESTADE).
// TORNADUS, THUNDURUS e LANDORUS não aparecem na grama de lugar nenhum: eles
// moram na tempestade que não acaba, no mar perto de BIRTH ISLAND, e só se
// chega lá de barco (as side quests do marinheiro — src/data/missoes.js).
// Formato igual ao de gen1.js: dex NOME TIPO1[/TIPO2] HP ATK DEF SPA SPD SPE
const TABLE = `
233 PORYGON2 NORMAL 85 80 90 105 95 60
474 PORYGON-Z NORMAL 85 80 70 135 75 90
408 CRANIDOS PEDRA 67 125 40 30 30 58
409 RAMPARDOS PEDRA 97 165 60 65 50 58
410 SHIELDON PEDRA/AÇO 30 42 118 42 88 30
411 BASTIODON PEDRA/AÇO 60 52 168 47 138 30
345 LILEEP PEDRA/PLANTA 66 41 77 61 87 23
347 ANORITH PEDRA/INSETO 45 95 50 40 50 75
564 TIRTOUGA ÁGUA/PEDRA 54 78 103 53 45 22
566 ARCHEN PEDRA/VOADOR 55 112 45 74 45 70
880 DRACOZOLT ELÉTRICO/DRAGÃO 90 100 90 80 70 75
882 DRACOVISH ÁGUA/DRAGÃO 90 90 100 70 80 75
201 UNOWN PSÍQUICO 48 72 48 72 48 48
292 SHEDINJA INSETO/FANTASMA 1 90 45 30 30 40
479 ROTOM ELÉTRICO/FANTASMA 50 50 77 95 77 91
436 BRONZOR AÇO/PSÍQUICO 57 24 86 24 86 23
599 KLINK AÇO 40 55 70 45 60 30
615 CRYOGONAL GELO 80 50 50 95 135 105
622 GOLETT TERRA/FANTASMA 59 74 50 35 50 35
337 LUNATONE PEDRA/PSÍQUICO 90 55 65 95 85 70
338 SOLROCK PEDRA/PSÍQUICO 90 95 85 55 65 70
382 KYOGRE ÁGUA 100 100 90 150 140 90
383 GROUDON TERRA 100 150 140 100 90 90
384 RAYQUAZA DRAGÃO/VOADOR 105 150 90 150 90 95
386 DEOXYS PSÍQUICO 50 150 50 150 50 150
881 ARCTOZOLT ELÉTRICO/GELO 90 100 90 90 80 55
883 ARCTOVISH ÁGUA/GELO 90 90 100 80 90 55
607 LITWICK FANTASMA/FOGO 50 30 55 65 55 20
608 LAMPENT FANTASMA/FOGO 60 40 60 95 60 55
609 CHANDELURE FANTASMA/FOGO 60 55 90 145 90 80
605 ELGYEM PSÍQUICO 55 55 55 85 55 30
606 BEHEEYEM PSÍQUICO 75 75 75 125 95 40
649 GENESECT INSETO/AÇO 71 120 95 120 95 99
235 SMEARGLE NORMAL 55 20 35 20 45 75
493 ARCEUS NORMAL 120 120 120 120 120 120
716 XERNEAS FADA 126 131 95 131 98 99
717 YVELTAL SOMBRIO/VOADOR 126 131 95 131 98 99
718 ZYGARDE DRAGÃO/TERRA 108 100 121 81 95 95
641 TORNADUS VOADOR 79 115 70 125 80 111
642 THUNDURUS ELÉTRICO/VOADOR 79 115 70 125 80 111
645 LANDORUS TERRA/VOADOR 89 125 90 115 80 101
386 DEOXYS-ATAQUE PSÍQUICO 50 180 20 180 20 150
386 DEOXYS-DEFESA PSÍQUICO 50 70 160 70 160 90
386 DEOXYS-VELOCIDADE PSÍQUICO 50 95 90 95 90 180
`;
/** os três só aparecem no terreno certo, e quase nunca */
export const WEATHER_TRIO = { agua: "kyogre", terra: "groudon", ar: "rayquaza" };

/** A frase que o jogo diz quando você encontra a espécie pela primeira vez
 *  dentro da fenda. Uma pra cada — nada de texto genérico. */
export const LORE = {
  porygon2: "ESTE POKÉMON VEIO DE JOGOS ATUALIZADOS.",
  arctozolt: "A METADE DE CIMA CONGELA E A DE BAIXO SOLTA FAÍSCA. AS DUAS BRIGAM ENTRE SI.",
  arctovish: "CABEÇA DE PEIXE, CORPO DE GELO, E A BOCA NO LUGAR ERRADO. ELE NEM CONSEGUE MASTIGAR.",
  elgyem: "APARECEU NUM DESERTO SEM PEGADA NENHUMA EM VOLTA.",
  beheeyem: "OS DEDOS PISCAM EM SEQUÊNCIA. É UM ENDEREÇO SENDO DIGITADO.",
  genesect: "UM FÓSSIL QUE ALGUÉM ABRIU E REESCREVEU. O CANHÃO NÃO ESTAVA NO ORIGINAL.",
  smeargle: "ELE COPIA QUALQUER GOLPE QUE VÊ. AQUI DENTRO, COPIA COISA QUE NEM É GOLPE.",
  deoxysataque: "TODO O CORPO VIROU ARMA. NÃO SOBROU NADA PRA SE DEFENDER.",
  deoxysdefesa: "ELE SE FECHOU. AGORA AGUENTA O QUE VIER — E NÃO DEVOLVE QUASE NADA.",
  deoxysvelocidade: "FINO, LEVE E RÁPIDO DEMAIS PRA TELA ACOMPANHAR.",
  porygonz: "NÃO DÁ PRA CHAMAR ISSO DE POKÉMON. SÓ DE GLITCH.",
  cranidos: "CRÂNIO DURO DEMAIS PRA UM BICHO QUE NÃO EXISTE MAIS.",
  rampardos: "BATE DE CABEÇA EM TUDO. O QUE QUEBRA NUNCA É A CABEÇA.",
  shieldon: "A CARA DELE É UM ESCUDO. O RESTO NEM TERMINOU DE CARREGAR.",
  bastiodon: "DE FRENTE NÃO PASSA NADA. POR ISSO ELE NUNCA APRENDEU A VIRAR.",
  lileep: "UMA PLANTA QUE CAÇA. FICOU PRESA NA PEDRA E NO TEMPO.",
  anorith: "AS GARRAS SÃO DE UM MAR QUE SECOU ANTES DE KANTO EXISTIR.",
  tirtouga: "O CASCO AGUENTA MIL METROS DE PRESSÃO. AQUI NÃO TEM FUNDO NENHUM.",
  archen: "TENTA VOAR E NÃO CONSEGUE: FALTA O DADO QUE ENSINA.",
  dracozolt: "METADE DE CIMA DE UM BICHO, METADE DE BAIXO DE OUTRO. REMONTARAM ERRADO.",
  dracovish: "REMONTARAM ELE DE CABEÇA PRA BAIXO E NINGUÉM CORRIGIU.",
  unown: "SÃO LETRAS. ALGUÉM ESTÁ TENTANDO ESCREVER ALGUMA COISA COM ELES.",
  shedinja: "A CASCA ESTÁ AQUI. O POKÉMON, NÃO. NÃO OLHE PELAS COSTAS DELE.",
  rotom: "MORA DENTRO DE APARELHO LIGADO. AGORA MORA DENTRO DESTE JOGO.",
  bronzor: "O ESPELHO NÃO MOSTRA VOCÊ. MOSTRA O QUE ESTAVA AQUI ANTES.",
  klink: "DUAS ENGRENAGENS QUE NASCERAM JUNTAS. SEPAROU, PARA TUDO.",
  cryogonal: "CORRENTES DE GELO NUM LUGAR QUE NÃO TEM TEMPERATURA NENHUMA.",
  golett: "BARRO ANTIGO MOVIDO POR UMA ENERGIA QUE NINGUÉM SABE DESLIGAR.",
  lunatone: "CHEGOU NUMA CHUVA DE METEORO. NÃO É DAQUI E NEM FINGE QUE É.",
  solrock: "GIRA PARADO NO AR E ESQUENTA A TELA INTEIRA.",
  kyogre: "O MAR INTEIRO NUM ARQUIVO SÓ. A DIMENSÃO NÃO TEM ONDE GUARDAR ISSO.",
  groudon: "O CONTINENTE VEIO JUNTO COM ELE. E NÃO CABE AQUI.",
  rayquaza: "VIVE NA CAMADA MAIS ALTA DO CÉU. AQUI NÃO EXISTE CÉU.",
  deoxys: "UM VÍRUS QUE VIROU BICHO. ELE MUDA DE FORMA CONFORME LÊ VOCÊ.",
};

export const EXTRA = {};
for (const line of TABLE.trim().split("\n")) {
  const [dex, name, types, hp, atk, def, spa, spd, spe] = line.trim().split(/\s+/);
  const base = { hp: +hp, atk: +atk, def: +def, spa: +spa, spd: +spd, spe: +spe };
  const bst = Object.values(base).reduce((a, b) => a + b, 0);
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "");
  EXTRA[id] = {
    id, dex: +dex, name, types: types.split("/"), base, bst, foreign: true,
    dexText: LORE[id],
    catchRate: bst >= 600 ? 3 : bst >= 500 ? 45 : 120,
    xpYield: Math.floor(bst / 4),
  };
}

/** encontros dentro da dimensão, por terreno */
export const DIM_ENCOUNTERS = {
  // terra: fóssil remontado errado e coisa pesada demais pra flutuar
  terra: [
    { id: "porygon", min: 15, max: 28, w: 14 },   // o alvo do UP-GRADE (ver loot.js)
    { id: "cranidos", min: 18, max: 32, w: 20 },
    { id: "rampardos", min: 30, max: 44, w: 8 },
    { id: "shieldon", min: 18, max: 32, w: 20 },
    { id: "bastiodon", min: 30, max: 44, w: 8 },
    { id: "lileep", min: 18, max: 30, w: 14 },
    { id: "anorith", min: 18, max: 30, w: 14 },
    { id: "golett", min: 20, max: 32, w: 14 },
    { id: "bronzor", min: 18, max: 30, w: 12 },
    { id: "unown", min: 12, max: 40, w: 10 },
    { id: "porygon2", min: 22, max: 36, w: 12 },
    { id: "porygonz", min: 28, max: 42, w: 8 },
    { id: "dracozolt", min: 30, max: 44, w: 20 },
    { id: "arctozolt", min: 30, max: 44, w: 16 },
    { id: "elgyem", min: 20, max: 32, w: 14 },
    { id: "smeargle", min: 18, max: 34, w: 12 },
  ],
  // água: o que a fenda copiou do mar, metade certo
  agua: [
    { id: "tirtouga", min: 18, max: 32, w: 22 },
    { id: "shieldon", min: 18, max: 32, w: 16 },
    { id: "bastiodon", min: 30, max: 44, w: 6 },
    { id: "cryogonal", min: 26, max: 40, w: 12 },
    { id: "klink", min: 18, max: 30, w: 10 },
    { id: "unown", min: 12, max: 40, w: 8 },
    { id: "porygon2", min: 22, max: 36, w: 22 },
    { id: "porygonz", min: 28, max: 42, w: 12 },
    { id: "dracovish", min: 30, max: 44, w: 16 },
    { id: "arctovish", min: 30, max: 44, w: 16 },
  ],
  // ar (o vazio no meio): só o que não precisa de chão
  ar: [
    { id: "porygon", min: 18, max: 30, w: 14 },
    { id: "archen", min: 20, max: 34, w: 16 },
    { id: "rotom", min: 22, max: 36, w: 14 },
    { id: "lunatone", min: 24, max: 38, w: 12 },
    { id: "solrock", min: 24, max: 38, w: 12 },
    { id: "cryogonal", min: 26, max: 40, w: 10 },
    { id: "shedinja", min: 20, max: 34, w: 8 },
    { id: "litwick", min: 18, max: 30, w: 18 },     // as velas: só no vazio,
    { id: "lampent", min: 26, max: 38, w: 12 },     // onde a chama é a única
    { id: "chandelure", min: 34, max: 46, w: 5 },   // coisa que se vê

    { id: "unown", min: 12, max: 40, w: 10 },
    { id: "porygon2", min: 24, max: 38, w: 22 },
    { id: "porygonz", min: 30, max: 45, w: 20 },
    { id: "beheeyem", min: 28, max: 40, w: 12 },
    { id: "genesect", min: 40, max: 52, w: 4 },
  ],
};

/** As formas que o DEOXYS assume em BIRTH ISLAND, na ordem em que ele volta.
 *  Todas com o mesmo nº de Pokédex: o sprite é o mesmo, os atributos não. */
export const DEOXYS_FORMS = ["deoxys", "deoxysataque", "deoxysdefesa", "deoxysvelocidade"];

/** O intruso: não é de terreno nenhum, pode aparecer em qualquer tufo de mato
 *  da dimensão — e é mais raro que os três lendários do clima. */
export const RARE_LEGEND = { id: "deoxys", chance: 0.0008, min: 45, max: 60 };

// A FUSÃO SELVAGEM.
//
// Fusão é coisa de máquina: ela sai do DECODIFICADOR, com dois Pokémon seus
// dentro. Mas uma vez a cada MUITAS a grama devolve uma pronta, já feita, que
// ninguém fundiu — e é a LAPROCUNO, a do acervo, com o desenho e tudo.
//
// A chance é por encontro, não por passo: com a grama chamando 11% das vezes,
// 1/4096 aqui dá um a cada ~37 mil passos no mato. É pra ser história de
// jogador, não item de lista. Se a ficha dela sumir do acervo, a espécie ainda
// existe (`garantirEspecie` remonta a automática) — o encontro não quebra.
/** A FUSÃO SELVAGEM: uma só, raríssima, e ELA TEM ENDEREÇO.
 *
 *  Sem `mapas` ela saía em qualquer grama de Kanto, e um LAPROCUNO — LAPRAS com
 *  ARTICUNO, água e gelo — aparecendo na FLORESTA VIRIDIAN não é raridade, é
 *  erro de lugar. Agora ela mora em volta de CINNABAR, no mar entre a ilha e a
 *  VILA PALETA.
 *
 *  E A CHANCE SUBIU MUITO, de 1 em 4096 pra 1 em 220. Não é generosidade, é a
 *  troca: raríssima em Kanto inteira, ela era um acidente que ninguém procurava
 *  — e agora que tem endereço, 1 em 4096 num pedaço só de mato seria pior
 *  ainda, porque você saberia ONDE e mesmo assim não acharia. Coisa com lugar
 *  certo tem que ser achável indo até lá; é isso que transforma um número raro
 *  numa história que alguém conta.
 *
 *  A ROTA 21 NORTE É A ÚNICA QUE FUNCIONA HOJE, e é de propósito que as outras
 *  estão escritas: `route21_south` tem tabela mas ainda não tem grama alta, e a
 *  ilha e a ROTA 20 não têm tabela nenhuma. No dia em que ganharem, a fusão já
 *  está esperando lá — e até lá elas não atrapalham, porque o sorteio nem chega
 *  perto num mapa sem tabela. */
export const FUSAO_SELVAGEM = {
  id: "fus-articuno-lapras~laprocuno",
  chance: 1 / 220, min: 30, max: 42,
  mapas: ["route21_north", "route21_south", "route20", "cinnabar_island"],
};

/** chance do lendário aparecer no terreno dele (0.3%) */
export const TRIO_CHANCE = 0.003;

/** a cada N Pokémon vistos na dimensão, um vem shiny */
export const SHINY_EVERY = 2956;

/** As três forças da natureza, na ordem em que a tempestade entrega:
 *  o vento primeiro, o raio quando o vento sai, e o chão quando os dois somem
 *  — que é o que acalma os outros dois. */
export const TEMPESTADE = ["tornadus", "thundurus", "landorus"];

/** OS TRÊS PARADOS EM KANTO.
 *  XERNEAS, YVELTAL e ZYGARDE não aparecem na grama nem vêm da fenda: eles
 *  estão PARADOS, cada um num lugar, esperando. Você anda até lá e encosta.
 *
 *  Só que o lugar não se acha sozinho: cada um tem uma missão que conta ONDE
 *  procurar (O X MARCA O LUGAR, O Y DA MORTE, O Z DO DNA — src/data/missoes.js),
 *  e enquanto o pedido não for aceito a clareira é só clareira, a usina é só
 *  usina e o túnel é só túnel.
 *  Derrubar sem capturar não resolve — saia do mapa e volte, e ele está lá de
 *  novo, no mesmo lugar. (A tela que monta esses NPCs é src/scenes/overworld.js;
 *  o nível e as falas saem daqui e têm hot-swap.)
 */
export const ESTATICOS = [
  {
    // O POKÉMON DIVINO. Ele não está num mapa de Kanto: aparece no meio da
    // 011GLITCHDIMENSION110, no vazio entre as ilhas — o único lugar deste jogo
    // que não foi feito por ninguém. E só depois que a missão o encontra.
    id: "arceus", mapa: "glitchdim", x: 20, y: 20, nivel: 70,
    missao: "pokemon-divino",
    lines: [
      "O CHÃO ACABA E ELE ESTÁ PARADO EM CIMA DE NADA.",
      "NÃO É QUE ELE FLUTUE: O VAZIO É QUE ENCOSTA NELE COMO SE FOSSE CHÃO.",
      "AS PLACAS DO ANEL GIRAM SOZINHAS, UMA DE CADA COR, E NENHUMA REPETE.",
      "ELE ESTAVA AQUI ANTES DA FENDA. TALVEZ ANTES DO JOGO.",
    ],
  },
  {
    id: "xerneas", mapa: "viridian_forest", x: 23, y: 31, nivel: 60,
    missao: "x-marca-o-lugar",
    lines: [
      "NO FUNDO DA FLORESTA TEM UMA CLAREIRA QUE NINGUÉM ABRIU.",
      "O MATO EM VOLTA ESTÁ MAIS VERDE DO QUE DEVIA, EM CÍRCULO.",
      "OS CHIFRES DELE ESTÃO ACESOS E NÃO É LUZ DO SOL.",
    ],
  },
  {
    id: "yveltal", mapa: "power_plant", x: 24, y: 16, nivel: 60,
    missao: "y-da-morte",
    lines: [
      "A USINA NUNCA VOLTOU A FUNCIONAR — E NINGUÉM EXPLICOU POR QUÊ.",
      "AS ASAS DELE ESTÃO ABERTAS EM CIMA DO GERADOR MORTO.",
      "AS PONTAS BRILHAM VERMELHO. É A ÚNICA COISA COM ENERGIA AQUI DENTRO.",
    ],
  },
  {
    id: "zygarde", mapa: "rock_tunnel_b1f", x: 24, y: 20, nivel: 60,
    missao: "z-do-dna",
    lines: [
      "O TÚNEL SE ABRE NUMA SALA QUE NÃO ESTÁ EM MAPA NENHUM.",
      "O CHÃO ESTÁ COBERTO DE PONTINHOS VERDES QUE SE MEXEM JUNTOS.",
      "ELES SE JUNTAM QUANDO VOCÊ CHEGA PERTO. AGORA É UM SÓ, E ELE OLHA PRA VOCÊ.",
    ],
  },
];
