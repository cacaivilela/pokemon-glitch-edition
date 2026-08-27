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
for (const line of TABLE.trim().split("\n")) {
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

/** A região de um inicial, ou null se ele não for um. */
export const regiaoDe = (id) => REGIOES.find((r) => r.mons.includes(id)) || null;
