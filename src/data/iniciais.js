// OS INICIAIS DE TODAS AS REGIÕES.
//
// O jogo é de Kanto, mas a escolha do laboratório não precisa ser. Aqui estão
// os três de cada geração, de KANTO a PALDEA — nove regiões, vinte e sete
// bichos —, e qualquer um deles pode ser o seu primeiro.
//
// A DÉCIMA GERAÇÃO NÃO ESTÁ AQUI porque ela não saiu. No dia em que sair, é uma
// linha na tabela e uma linha em REGIOES.
//
// Eles não aparecem na grama de lugar nenhum: não entram em tabela de encontro,
// não vazam pela fenda. Existem para serem escolhidos uma vez, e depois são
// seus como qualquer outro — evoluem, fundem, megam se tiverem pedra.
//
// Formato igual ao de gen1.js e extra.js:
//   dex NOME TIPO1[/TIPO2] HP ATK DEF SPA SPD SPE
//
// Os três de Kanto NÃO estão na tabela: eles já existem em gen1.js, e repetir
// espécie em dois arquivos é criar duas versões da mesma coisa pra manter.
//
// A tabela tem os 24 INICIAIS e as 48 formas em que eles crescem. Um inicial
// que não evolui é um inicial que se abandona no meio do jogo: as três formas
// são o que faz a escolha do laboratório durar as oito insígnias.
const TABLE = `
152 CHIKORITA PLANTA 45 49 65 49 65 45
155 CYNDAQUIL FOGO 39 52 43 60 50 65
158 TOTODILE ÁGUA 50 65 64 44 48 43
252 TREECKO PLANTA 40 45 35 65 55 70
255 TORCHIC FOGO 45 60 40 70 50 45
258 MUDKIP ÁGUA 50 70 50 50 50 40
387 TURTWIG PLANTA 55 68 64 45 55 31
390 CHIMCHAR FOGO 44 58 44 58 44 61
393 PIPLUP ÁGUA 53 51 53 61 56 40
495 SNIVY PLANTA 45 45 55 45 55 63
498 TEPIG FOGO 65 63 45 45 45 45
501 OSHAWOTT ÁGUA 55 55 45 63 45 45
650 CHESPIN PLANTA 56 61 65 48 45 38
653 FENNEKIN FOGO 40 45 40 62 60 60
656 FROAKIE ÁGUA 41 56 40 62 44 71
722 ROWLET PLANTA/VOADOR 68 55 55 50 50 42
725 LITTEN FOGO 45 65 40 60 40 70
728 POPPLIO ÁGUA 50 54 54 66 56 40
810 GROOKEY PLANTA 50 65 50 40 40 65
813 SCORBUNNY FOGO 50 71 40 40 40 69
816 SOBBLE ÁGUA 50 40 40 70 40 70
906 SPRIGATITO PLANTA 40 61 54 45 45 65
909 FUECOCO FOGO 67 45 59 63 40 36
912 QUAXLY ÁGUA 55 65 45 50 45 50
153 BAYLEEF PLANTA 60 62 80 63 80 60
154 MEGANIUM PLANTA 80 82 100 83 100 80
156 QUILAVA FOGO 58 64 58 80 65 80
157 TYPHLOSION FOGO 78 84 78 109 85 100
159 CROCONAW ÁGUA 65 80 80 59 63 58
160 FERALIGATR ÁGUA 85 105 100 79 83 78
253 GROVYLE PLANTA 50 65 45 85 65 95
254 SCEPTILE PLANTA 70 85 65 105 85 120
256 COMBUSKEN FOGO/LUTADOR 60 85 60 85 60 55
257 BLAZIKEN FOGO/LUTADOR 80 120 70 110 70 80
259 MARSHTOMP ÁGUA/TERRA 70 85 70 60 70 50
260 SWAMPERT ÁGUA/TERRA 100 110 90 85 90 60
388 GROTLE PLANTA 75 89 85 55 65 36
389 TORTERRA PLANTA/TERRA 95 109 105 75 85 56
391 MONFERNO FOGO/LUTADOR 64 78 52 78 52 81
392 INFERNAPE FOGO/LUTADOR 76 104 71 104 71 108
394 PRINPLUP ÁGUA 64 66 68 81 76 50
395 EMPOLEON ÁGUA/AÇO 84 86 88 111 101 60
496 SERVINE PLANTA 60 60 75 60 75 83
497 SERPERIOR PLANTA 75 75 95 75 95 113
499 PIGNITE FOGO/LUTADOR 90 93 55 70 55 55
500 EMBOAR FOGO/LUTADOR 110 123 65 100 65 65
502 DEWOTT ÁGUA 75 75 60 83 60 60
503 SAMUROTT ÁGUA 95 100 85 108 70 70
651 QUILLADIN PLANTA 61 78 95 56 58 57
652 CHESNAUGHT PLANTA/LUTADOR 88 107 122 74 75 64
654 BRAIXEN FOGO 59 59 58 90 70 73
655 DELPHOX FOGO/PSÍQUICO 75 69 72 114 100 104
657 FROGADIER ÁGUA 54 63 52 83 56 97
658 GRENINJA ÁGUA/SOMBRIO 72 95 67 103 71 122
723 DARTRIX PLANTA/VOADOR 78 75 75 70 70 52
724 DECIDUEYE PLANTA/FANTASMA 78 107 75 100 100 70
726 TORRACAT FOGO 65 85 50 80 50 90
727 INCINEROAR FOGO/SOMBRIO 95 115 90 80 90 60
729 BRIONNE ÁGUA 60 69 69 91 81 50
730 PRIMARINA ÁGUA/FADA 80 74 74 126 116 60
811 THWACKEY PLANTA 70 85 70 55 60 80
812 RILLABOOM PLANTA 100 125 90 60 70 85
814 RABOOT FOGO 65 86 60 55 60 94
815 CINDERACE FOGO 80 116 75 65 75 119
817 DRIZZILE ÁGUA 65 60 55 95 55 90
818 INTELEON ÁGUA 70 85 65 125 65 120
907 FLORAGATO PLANTA 61 80 63 60 63 83
908 MEOWSCARADA PLANTA/SOMBRIO 76 110 70 81 70 123
910 CROCALOR FOGO 81 55 78 90 58 49
911 SKELEDIRGE FOGO/FANTASMA 104 75 100 110 75 66
913 QUAXWELL ÁGUA 70 85 65 65 60 65
914 QUAQUAVAL ÁGUA/LUTADOR 85 120 80 85 75 85
`;

/** uma frase pra cada, que vira o texto da Pokédex */
const LORE = {
  chikorita: "A FOLHA DA CABEÇA SOLTA UM CHEIRO QUE ACALMA QUEM ESTÁ POR PERTO.",
  cyndaquil: "AS COSTAS PEGAM FOGO QUANDO ELE SE ASSUSTA. ELE SE ASSUSTA MUITO.",
  totodile: "MORDE TUDO. NÃO POR RAIVA — É COMO ELE DESCOBRE O QUE AS COISAS SÃO.",
  treecko: "AS PATAS GRUDAM EM PAREDE LISA. ELE DORME DE CABEÇA PRA BAIXO.",
  torchic: "GUARDA FOGO NA BARRIGA. ENCOSTAR NELE É MORNO; IRRITAR NÃO É.",
  mudkip: "A BARBATANA DA CABEÇA SENTE O AR E DIZ A ELE O QUE VEM PELA FRENTE.",
  turtwig: "O CASCO É TERRA DE VERDADE. SE ELE FICA PARADO, NASCE MATO NELE.",
  chimchar: "O FOGO DO RABO NÃO APAGA NA CHUVA. NINGUÉM SABE COM O QUE ELE QUEIMA.",
  piplup: "TEM ORGULHO DEMAIS PRA ACEITAR COMIDA DA MÃO DE ALGUÉM.",
  snivy: "FAZ FOTOSSÍNTESE PELO RABO. COM SOL ELE FICA RÁPIDO; SEM, FICA EMBURRADO.",
  tepig: "ASSA A PRÓPRIA COMIDA SOPRANDO PELO NARIZ. ÀS VEZES QUEIMA.",
  oshawott: "A CONCHA DA BARRIGA SAI E VIRA LÂMINA. ELE A AFIA TODO DIA.",
  chespin: "OS ESPINHOS SÃO MOLES ATÉ ELE QUERER. AÍ FICAM DUROS DE UMA VEZ.",
  fennekin: "MASTIGA GRAVETO PRA SE ALIMENTAR, E SOLTA FAÍSCA PELAS ORELHAS.",
  froakie: "A ESPUMA DAS COSTAS AMORTECE GOLPE E ESCONDE PRA ONDE ELE PULOU.",
  rowlet: "VOA SEM FAZER BARULHO NENHUM. VOCÊ SÓ SABE QUE ELE VEIO DEPOIS.",
  litten: "SOLTA BOLA DE PELO EM CHAMAS. ELE JUNTA O PELO ANTES, COM CALMA.",
  popplio: "FAZ BALÃO DE ÁGUA COM O NARIZ E PULA EM CIMA DELES PRA SE MOVER.",
  grookey: "O GRAVETO DELE ACORDA PLANTA MORTA. ELE TOCA RITMO COM ELE O DIA TODO.",
  scorbunny: "AS PATAS ESQUENTAM CORRENDO. QUANTO MAIS CORRE, MAIS FORTE O CHUTE.",
  sobble: "QUANDO CHORA, TODO MUNDO EM VOLTA CHORA JUNTO. ELE CHORA POR QUALQUER COISA.",
  sprigatito: "O PELO SOLTA UM CHEIRO DOCE QUE DEIXA QUEM SENTE COM SONO.",
  fuecoco: "COME PEDRA QUENTE E GUARDA O CALOR NA ESCAMA DA CABEÇA.",
  quaxly: "MANTÉM O TOPETE SEMPRE ARRUMADO. GEL PRÓPRIO, FEITO POR ELE MESMO.",
};

export const INICIAIS_ESPECIES = {};
// Linha vazia é PULADA. Sem isto, uma linha em branco no meio da tabela faz
// `name` sair `undefined`, e a primeira coisa que se faz com ele é chamar
// `.toLowerCase()` — o arquivo inteiro morre, o DB não monta e O JOGO NÃO ABRE,
// por um espaço. Já aconteceu: um separador em branco entre dois blocos de
// espécies derrubou o jogo inteiro, e o erro que aparecia era "name is
// undefined", que não diz nada sobre tabela nenhuma.
for (const line of TABLE.trim().split("\n")) {
  if (!line.trim()) continue;
  const [dex, name, types, hp, atk, def, spa, spd, spe] = line.trim().split(/\s+/);
  const base = { hp: +hp, atk: +atk, def: +def, spa: +spa, spd: +spd, spe: +spe };
  const bst = Object.values(base).reduce((a, b) => a + b, 0);
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "");
  INICIAIS_ESPECIES[id] = {
    id, dex: +dex, name, types: types.split("/"), base, bst, foreign: true,
    dexText: LORE[id],
    catchRate: 45, xpYield: Math.floor(bst / 4),
  };
}

/** As regiões, na ordem em que saíram. `mons` é sempre PLANTA, FOGO, ÁGUA —
 *  nessa ordem, porque é assim que o jogo pergunta e é assim que o rival
 *  escolhe o que ganha do seu. */
export const REGIOES = [
  { nome: "KANTO", mons: ["bulbasaur", "charmander", "squirtle"] },
  { nome: "JOHTO", mons: ["chikorita", "cyndaquil", "totodile"] },
  { nome: "HOENN", mons: ["treecko", "torchic", "mudkip"] },
  { nome: "SINNOH", mons: ["turtwig", "chimchar", "piplup"] },
  { nome: "UNOVA", mons: ["snivy", "tepig", "oshawott"] },
  { nome: "KALOS", mons: ["chespin", "fennekin", "froakie"] },
  { nome: "ALOLA", mons: ["rowlet", "litten", "popplio"] },
  { nome: "GALAR", mons: ["grookey", "scorbunny", "sobble"] },
  { nome: "PALDEA", mons: ["sprigatito", "fuecoco", "quaxly"] },
];

/** AS LINHAGENS, na ordem em que crescem. Vale pra evolução (`EVOLUTIONS` em
 *  evolution.js sai daqui) e pro AZUL, que evolui o dele junto com o jogo. */
export const LINHAS = {
  chikorita: ["chikorita", "bayleef", "meganium"],
  cyndaquil: ["cyndaquil", "quilava", "typhlosion"],
  totodile: ["totodile", "croconaw", "feraligatr"],
  treecko: ["treecko", "grovyle", "sceptile"],
  torchic: ["torchic", "combusken", "blaziken"],
  mudkip: ["mudkip", "marshtomp", "swampert"],
  turtwig: ["turtwig", "grotle", "torterra"],
  chimchar: ["chimchar", "monferno", "infernape"],
  piplup: ["piplup", "prinplup", "empoleon"],
  snivy: ["snivy", "servine", "serperior"],
  tepig: ["tepig", "pignite", "emboar"],
  oshawott: ["oshawott", "dewott", "samurott"],
  chespin: ["chespin", "quilladin", "chesnaught"],
  fennekin: ["fennekin", "braixen", "delphox"],
  froakie: ["froakie", "frogadier", "greninja"],
  rowlet: ["rowlet", "dartrix", "decidueye"],
  litten: ["litten", "torracat", "incineroar"],
  popplio: ["popplio", "brionne", "primarina"],
  grookey: ["grookey", "thwackey", "rillaboom"],
  scorbunny: ["scorbunny", "raboot", "cinderace"],
  sobble: ["sobble", "drizzile", "inteleon"],
  sprigatito: ["sprigatito", "floragato", "meowscarada"],
  fuecoco: ["fuecoco", "crocalor", "skeledirge"],
  quaxly: ["quaxly", "quaxwell", "quaquaval"],
};

/** Em que nível cada um passa pra forma seguinte: [primeira, segunda]. */
export const NIVEIS = {
  chikorita: [16, 32], cyndaquil: [14, 36], totodile: [18, 30],
  treecko: [16, 36], torchic: [16, 36], mudkip: [16, 36],
  turtwig: [18, 32], chimchar: [14, 36], piplup: [16, 36],
  snivy: [17, 36], tepig: [17, 36], oshawott: [17, 36],
  chespin: [16, 36], fennekin: [16, 36], froakie: [16, 36],
  rowlet: [17, 34], litten: [17, 34], popplio: [17, 34],
  grookey: [16, 35], scorbunny: [16, 35], sobble: [16, 35],
  sprigatito: [16, 36], fuecoco: [16, 36], quaxly: [16, 36],
};

/** As regras de evolução das 24 linhagens, no formato de evolution.js. Montado
 *  daqui pra não escrever a mesma linhagem duas vezes em dois arquivos. */
export const EVO_INICIAIS = {};
for (const [base, linha] of Object.entries(LINHAS)) {
  const [n1, n2] = NIVEIS[base];
  EVO_INICIAIS[linha[0]] = [{ lvl: n1, to: linha[1] }];
  EVO_INICIAIS[linha[1]] = [{ lvl: n2, to: linha[2] }];
}

/** A região de um inicial, ou null se ele não for um. */
export const regiaoDe = (id) => REGIOES.find((r) => r.mons.includes(id)) || null;
