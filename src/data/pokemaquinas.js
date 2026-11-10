// AS POKÉMÁQUINAS (pedido do CAIO, nov/2026: "máquinas que funcionam usando
// pkmns", "era pra ser uma máquina que o jogador faz", "constrói com peças").
//
// ("faz sem montar mesmo, tipo construir" -> "numa grade, inventando").
//
// ("faz pra fazer a pokémáquina não precisar dessas peças mas pra melhorar precisa")
//
// Com a CAIXA DE FERRAMENTAS (usada pela mochila) o jogador abre a OFICINA
// (src/scenes/construcao.js), escolhe o TIPO de Pokémon que move a máquina e
// CONSTRÓI — de graça: a máquina BÁSICA já vem com a carcaça e funciona. As PEÇAS
// (engrenagem, parafuso, fio, motor, placa de metal, vendidas nas lojas) são
// MELHORIAS: encaixadas na GRADE, cada uma muda o que ela faz (GRADE, abaixo), e o
// desenho dela no mapa muda junto (sai da própria grade, em cima da carcaça).
// Construída, ela fica no tile da frente, em qualquer mapa (state.pokemaquinas).
// Falando com ela: USAR, MELHORAR (a oficina de novo, com a grade dela) ou
// DESMONTAR (as peças voltam). As regras estão em src/systems/pokemaquinas.js.
//
// O TIPO escolhido decide o que ela PRODUZ: cada "planta" abaixo é o que sai de
// uma máquina movida por aqueles tipos (`tipos`), com a fala e o verbo dela.
// Tipo que não tem planta cai em GENERICA.
//   sorteio   [item, qtd, peso]; peso <= 10 é RARO (os FIOS aumentam a chance)
//   efeito    "itens" (sorteia) ou "curar" (cura a equipe)
export const POKEMAQUINAS_CONFIG = {
  espera: 10,            // minutos entre um uso e outro (sem engrenagem nenhuma)
  amizade: 3,            // o que o Pokémon que trabalhou ganha de amizade
};

/** A GRADE DA OFICINA e o que cada peça (MELHORIA) faz na máquina. Sem peça
 *  nenhuma ela é a BÁSICA: 1 item por uso, espera de CONFIG.espera, sem bônus. */
export const GRADE = {
  w: 6, h: 5,
  // o código de cada peça na grade (state.pokemaquinas[].grade é uma string de w*h letras; "." é vazio)
  codigos: { p: "placa de metal", e: "engrenagem", f: "fio", m: "motor", r: "parafuso" },
  // a CARCAÇA da máquina básica: as casas que ela ocupa no desenho (x0, y0, x1, y1, incluídas)
  carcaca: [1, 2, 4, 4],
  esperaMin: 3,          // ENGRENAGEM: -2 min de espera cada, até 3 min
  esperaPorEngrenagem: 2,
  sortePorFio: 0.05,     // FIO: +5% de chance de sair um prêmio raro, até 50%
  sorteMax: 0.5,
  qtdPorMotor: 1,        // MOTOR: +1 item por uso, até 3
  qtdMax: 3,
  dobroPorParafuso: 0.1, // PARAFUSO: +10% de chance de sair o DOBRO, até 50%
  dobroMax: 0.5,
  amizadePorPlaca: 1,    // PLACA DE METAL: +1 de amizade pra quem trabalha, até +5
  amizadeMax: 5,
};
/** os tipos que dá pra escolher na oficina */
export const TIPOS_MAQUINA = ["NORMAL", "FOGO", "ÁGUA", "PLANTA", "ELÉTRICO", "GELO", "LUTADOR", "VENENO", "TERRA",
  "VOADOR", "PSÍQUICO", "INSETO", "PEDRA", "FANTASMA", "DRAGÃO", "SOMBRIO", "AÇO", "FADA"];
/** o nome da máquina pelo tipo que move ela ("MÁQUINA ELÉTRICA") */
export const NOME_POR_TIPO = {
  NORMAL: "MÁQUINA COMUM", FOGO: "MÁQUINA DE FOGO", "ÁGUA": "MÁQUINA D'ÁGUA", PLANTA: "MÁQUINA DE PLANTA",
  "ELÉTRICO": "MÁQUINA ELÉTRICA", GELO: "MÁQUINA DE GELO", LUTADOR: "MÁQUINA LUTADORA", VENENO: "MÁQUINA VENENOSA",
  TERRA: "MÁQUINA DE TERRA", VOADOR: "MÁQUINA VOADORA", "PSÍQUICO": "MÁQUINA PSÍQUICA", INSETO: "MÁQUINA DE INSETO",
  PEDRA: "MÁQUINA DE PEDRA", FANTASMA: "MÁQUINA FANTASMA", "DRAGÃO": "MÁQUINA DE DRAGÃO", SOMBRIO: "MÁQUINA SOMBRIA",
  "AÇO": "MÁQUINA DE AÇO", FADA: "MÁQUINA DE FADA",
};
/** o que sai de uma máquina de tipo que não tem planta */
export const GENERICA = {
  id: "generica", nome: "MÁQUINA",
  fala: ["É A SUA MÁQUINA. ELA ESTÁ PARADINHA, ESPERANDO."],
  verbo: "{MON} EMPURROU A MÁQUINA COM TUDO! AS PEÇAS GIRARAM!",
  efeito: "itens",
  sorteio: [["poção", 1, 40], ["poké bola", 2, 35], ["pepita", 1, 15], ["doce raro", 1, 10]],
};

export const POKEMAQUINAS = [
  {
    id: "gerador", nome: "GERADOR",
    tipos: ["ELÉTRICO"],
    fala: ["É UM GERADOR. NA PLAQUINHA: \"FUNCIONA COM UM POKÉMON ELÉTRICO\"."],
    verbo: "{MON} DEU UM CHOQUE NA BOBINA! O GERADOR ACENDEU E A ESTEIRA DE BOLAS ANDOU!",
    efeito: "itens",
    sorteio: [["poké bola", 3, 30], ["great ball", 2, 30], ["ultra ball", 1, 15], ["pepita", 1, 15], ["pedra do trovão", 1, 10]],
  },
  {
    id: "forno", nome: "FORNO",
    tipos: ["FOGO"],
    fala: ["É UM FORNO DE PADARIA. TEM MASSA PRONTA NA FORMA, MAS ESTÁ APAGADO.", "NA PORTA: \"ACENDE COM UM POKÉMON DE FOGO\"."],
    verbo: "{MON} SOPROU FOGO NA FORNALHA! O CHEIRO DE COISA ASSADA TOMOU CONTA DE TUDO...",
    efeito: "itens",
    sorteio: [["cocada", 2, 22], ["quindim", 1, 18], ["pé-de-moleque", 2, 18], ["brigadeiro", 2, 18], ["goiabada", 1, 16], ["pedra do fogo", 1, 8]],
  },
  {
    id: "bomba", nome: "BOMBA D'ÁGUA",
    tipos: ["ÁGUA"],
    fala: ["É UMA BOMBA D'ÁGUA LIGADA NUMA HORTINHA. A TERRA ESTÁ SECA.", "NA MANIVELA: \"ENCHE COM UM POKÉMON DE ÁGUA\"."],
    verbo: "{MON} ENCHEU O TANQUE! A HORTA BEBEU TUDO E AS FRUTINHAS CRESCERAM NA HORA!",
    efeito: "itens",
    sorteio: [["oran berry", 3, 22], ["sitrus berry", 2, 18], ["pecha berry", 2, 15], ["cheri berry", 2, 15], ["rawst berry", 2, 12], ["leppa berry", 1, 10], ["pedra da água", 1, 8]],
  },
  {
    id: "estufa", nome: "ESTUFA",
    tipos: ["PLANTA"],
    fala: ["É UMA ESTUFA DE VIDRO CHEIA DE VASINHOS VAZIOS.", "NA PORTA: \"BROTA COM UM POKÉMON DE PLANTA\"."],
    verbo: "{MON} ESPALHOU SEMENTES E FEZ TUDO CRESCER! A ESTUFA FICOU VERDINHA!",
    efeito: "itens",
    sorteio: [["lum berry", 1, 22], ["liechi berry", 1, 15], ["salac berry", 1, 15], ["petaya berry", 1, 15], ["ganlon berry", 1, 15], ["starf berry", 1, 5], ["pedra da folha", 1, 13]],
  },
  {
    id: "britadeira", nome: "BRITADEIRA",
    tipos: ["LUTADOR", "PEDRA"],
    fala: ["É UMA BRITADEIRA DE PEDREIRA, COM UM MONTE DE PEDRA DO LADO.", "NO CABO: \"PRECISA DE FORÇA: LUTADOR OU PEDRA\"."],
    verbo: "{MON} SEGUROU O CABO E MANDOU VER! TA-TA-TA-TA! AS PEDRAS RACHARAM!",
    efeito: "itens",
    sorteio: [["pepita", 1, 30], ["pepita grande", 1, 15], ["fóssil domo", 1, 10], ["fóssil hélix", 1, 10], ["âmbar velho", 1, 5], ["pedra da lua", 1, 15], ["estrela", 1, 15]],
  },
  {
    id: "moinho", nome: "MOINHO DE VENTO",
    tipos: ["VOADOR"],
    fala: ["É UM MOINHO DE VENTO PEQUENINHO. AS PÁS ESTÃO PARADAS: NÃO TEM VENTO HOJE.", "NA BASE: \"GIRA COM UM POKÉMON VOADOR\"."],
    verbo: "{MON} BATEU AS ASAS COM TUDO! AS PÁS GIRARAM E SAIU DOCE DA MOENDA!",
    efeito: "itens",
    sorteio: [["doce de nuvem", 1, 40], ["doce de estrela", 1, 30], ["mel", 1, 30]],
  },
  {
    id: "cura", nome: "MÁQUINA DE CURA",
    tipos: ["FADA", "PSÍQUICO"],
    fala: ["É UMA MÁQUINA DE CURA IGUAL À DO CENTRO POKÉMON, MONTADA POR VOCÊ.", "NO VISOR: \"FUNCIONA COM UM POKÉMON FADA OU PSÍQUICO\"."],
    verbo: "{MON} BRILHOU EM CIMA DA MÁQUINA! A LUZ COR-DE-ROSA PASSOU POR TODA A EQUIPE...",
    efeito: "curar",
  },
  {
    id: "sintonizador", nome: "SINTONIZADOR ASSOMBRADO",
    tipos: ["FANTASMA"],
    fala: ["É UM RÁDIO VELHO COM UMA ANTENA TORTA. SÓ CHIA.", "ALGUÉM ESCREVEU NELE: \"SÓ PEGA O CANAL DOS FANTASMAS\"."],
    verbo: "{MON} ENTROU NO RÁDIO! O CHIADO VIROU UMA VOZ... E ALGUMA COISA CAIU DA ANTENA!",
    efeito: "itens",
    sorteio: [["doce glitch", 1, 40], ["doce de noite", 1, 30], ["pedra do trovão assombrada", 1, 15], ["pedra do crepúsculo", 1, 15]],
  },
];

/** AS PEÇAS: vendidas em toda loja (src/data/index.js, junto do estoque de acampar) */
export const PECAS = [
  { item: "engrenagem", preco: 300, desc: "UMA ENGRENAGEM DE METAL. SERVE PRA MONTAR POKÉMÁQUINAS." },
  { item: "parafuso", preco: 80, desc: "UM PARAFUSO. NUNCA TEM O BASTANTE." },
  { item: "fio", preco: 150, desc: "UM ROLO DE FIO DE COBRE. LEVA ENERGIA DE UM LADO PRO OUTRO." },
  { item: "motor", preco: 900, desc: "UM MOTORZINHO. NÃO GIRA SOZINHO: PRECISA DE QUEM EMPURRE." },
  { item: "placa de metal", preco: 250, desc: "UMA CHAPA DE METAL. VIRA PAREDE, TAMPA OU PORTA DE MÁQUINA." },
];
/** A CAIXA DE FERRAMENTAS: item-chave (uma vez só, como a barraca). Usada pela mochila, abre a OFICINA. */
export const CAIXA = { item: "caixa de ferramentas", preco: 1500 };

export const POKEMAQUINAS_TEXTO = {
  quer: "COLOCAR UM POKÉMON PRA FAZER A MÁQUINA FUNCIONAR?",
  quem: "QUEM VAI FAZER A {NOME} FUNCIONAR?",
  ninguem: "PRECISA DE UM POKÉMON {TIPOS}. NINGUÉM DA SUA EQUIPE É.",
  cansado: "A {NOME} AINDA ESTÁ ESFRIANDO. VOLTE DAQUI A {MIN} MINUTO(S).",
  ganhou: "SAIU DA MÁQUINA: {QTD} {ITEM}!",
  curou: "A EQUIPE INTEIRA FICOU CURADINHA!",
  gostou: "{MON} GOSTOU DE AJUDAR!",
  // a oficina
  titulo: "OFICINA DE POKÉMÁQUINA",
  semLugar: "NÃO DÁ PRA CONSTRUIR AQUI: PRECISA DE UM ESPAÇO LIVRE BEM NA SUA FRENTE.",
  basica: "BÁSICA: PEÇAS MELHORAM",
  melhorada: "MELHORADA COM {N} PEÇA(S)!",
  construiu: "VOCÊ APERTOU O ÚLTIMO PARAFUSO... A {NOME} ESTÁ PRONTA!",
  oQueFazer: "O QUE VOCÊ QUER FAZER COM A {NOME}?",
  acoes: ["USAR", "MELHORAR", "DESMONTAR", "NADA"],
  melhorou: "A {NOME} FICOU DO JEITO NOVO!",
  desmontou: "VOCÊ DESMONTOU A {NOME}. AS PEÇAS VOLTARAM PRA MOCHILA.",
  opcoes: ["SIM", "NÃO"],
  cancelar: "CANCELAR",
};
