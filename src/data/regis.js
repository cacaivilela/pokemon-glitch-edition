// OS REGIS: sete gigantes dormindo nas sete câmaras das RUÍNAS TANOBY.
//
// As RUÍNAS TANOBY (ILHA SETE) têm sete câmaras — e os Regis são sete, contando
// o que não devia existir. Cada câmara guarda um, no santuário do meio: uma
// PLACA DE PEDRA com os SETE PONTOS dele, no desenho do rosto dele (o H do
// REGIROCK, a cruz comprida do REGICE, o hexágono do REGISTEEL...). Encostar a
// mão nos pontos acorda o gigante: o chão treme e ele SOBE DA TERRA EM 3D
// (src/core/gigante3d.js), acende os pontos um por um e luta — em 2D, como
// todo mundo. Pego, te segue com o sprite de batalha.
//
// O REGIGIGAS, como no original, só acorda depois dos três golens (REGIROCK,
// REGICE, REGISTEEL). E o REGIGLITCH só depois dos outros SEIS.
//
// O REGIGLITCH é deste jogo: o Regi que o cartucho montou com os restos dos
// outros. Verde código e roxo uva, com os sete pontos numa linha reta — um
// traço, o desenho de "nada aqui" —, e o grito é o de TODOS os Regis
// misturados, dez vezes mais rápido (src/systems/gritos.js).
const CAMARA = (nome) => `seven_island_tanoby_ruins_${nome}_chamber`;

/** `pontos`: o desenho do rosto, na ordem em que acendem ([coluna, linha],
 *  linha pra cima). `cor`: a dos pontos na placa (apagada, acesa). */
export const REGIS = {
  regirock: {
    camara: CAMARA("monean"), nivel: 60,
    pontos: [[-1, 1], [-1, 0], [-1, -1], [0, 0], [1, 1], [1, 0], [1, -1]],
    cor: ["#7a4020", "#ff8a40"],
    placa: ["SETE PONTOS NUMA PEDRA, EM FORMA DE H.", "A PEDRA É QUENTE COMO CHÃO DE ESTRADA AO MEIO-DIA."],
  },
  regice: {
    camara: CAMARA("liptoo"), nivel: 60,
    pontos: [[0, 1], [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [0, -1]],
    cor: ["#7a6a18", "#ffe600"],
    placa: ["SETE PONTOS NUMA PEDRA, NUMA CRUZ COMPRIDA.", "A PEDRA ESTÁ COBERTA DE GEADA. NO MEIO DO VERÃO."],
  },
  registeel: {
    camara: CAMARA("weepth"), nivel: 60,
    pontos: [[-0.5, 1], [0.5, 1], [-1, 0], [0, 0], [1, 0], [-0.5, -1], [0.5, -1]],
    cor: ["#6a2020", "#ff4141"],
    placa: ["SETE PONTOS NUMA PEDRA, EM HEXÁGONO.", "A PEDRA SOA COMO METAL QUANDO VOCÊ BATE NELA."],
  },
  regieleki: {
    camara: CAMARA("dilford"), nivel: 65,
    pontos: [[-1.5, 0.5], [-1, -0.3], [-0.5, -0.8], [0, -1], [0.5, -0.8], [1, -0.3], [1.5, 0.5]],
    cor: ["#7a4a5a", "#ff9dc2"],
    placa: ["SETE PONTOS NUMA PEDRA, NUM SORRISO.", "SEU CABELO ARREPIA ANTES DE A MÃO ENCOSTAR."],
  },
  regidrago: {
    camara: CAMARA("scufib"), nivel: 65,
    pontos: [[-0.5, 1], [0.5, 1], [-1, 0], [0, 0], [1, 0], [0, -1], [1, -1]],
    cor: ["#1a4a6a", "#139ee1"],
    placa: ["SETE PONTOS NUMA PEDRA, TORTOS.", "TEM MARCA DE DENTE NA BEIRADA. DENTE GRANDE."],
  },
  regigigas: {
    camara: CAMARA("rixy"), nivel: 70,
    requer: ["regirock", "regice", "registeel"],
    pontos: [[-0.6, 1.2], [0.6, 1.2], [-0.6, 0.3], [0.6, 0.3], [-0.6, -0.6], [0.6, -0.6], [0, -1.5]],
    cor: ["#5a5a6a", "#ef5a6b"],
    placa: ["SETE PONTOS NUMA PEDRA ENORME, EM DUAS COLUNAS.", "A PEDRA É DO TAMANHO DE UM CONTINENTE DE MAQUETE."],
    trancado: ["OS PONTOS NÃO ACENDEM.", "PARECE QUE ESPERAM TRÊS VISITAS ANTES: O DE PEDRA, O DE GELO E O DE AÇO."],
  },
  regiglitch: {
    camara: CAMARA("viapois"), nivel: 75,
    requer: ["regirock", "regice", "registeel", "regieleki", "regidrago", "regigigas"],
    pontos: [[-3, 0], [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [3, 0]],
    cor: ["#0a3a14", "#00ff41"],
    placa: ["SETE PONTOS NUMA PEDRA, NUMA LINHA RETA. UM TRAÇO.", "NO DESENHO DOS REGIS, UM TRAÇO QUER DIZER: NADA AQUI."],
    trancado: ["SETE PONTOS EM LINHA RETA. UM TRAÇO.", "NADA ACONTECE. AINDA FALTA ALGUÉM ACORDAR NAS OUTRAS SEIS CÂMARAS."],
  },
};

export const REGIS_TEXTO = {
  pergunta: "ENCOSTAR A MÃO NOS PONTOS?",
  opcoes: ["ENCOSTAR", "AGORA NÃO"],
  tremor: "O CHÃO DA CÂMARA COMEÇOU A TREMER!",
  acordou: ["{MON} ACORDOU!"],
  apagado: "OS PONTOS ESTÃO APAGADOS. QUEM DORMIA AQUI JÁ SAIU.",
  semTime: "NINGUÉM DA EQUIPE ESTÁ DE PÉ PRA ENCARAR O QUE DORME AQUI.",
  pego: [
    "{MON} ENTROU PRA EQUIPE.",
    "FORA DA CÂMARA ELE CABE NUM DESENHO. MAS O CHÃO AINDA TREME QUANDO ELE PISA.",
  ],
  fugiu: "{MON} AFUNDOU DE VOLTA NO CHÃO. OS PONTOS AINDA BRILHAM: DÁ PRA ACORDAR DE NOVO.",
};

/** O REGIGLITCH, a espécie. Os números são os do REGIGIGAS escorregados uma
 *  casa (a mesma regra das formas hackeanas, src/data/hackeanas.js): nada
 *  inventado, só lido no lugar errado. */
export const REGIS_ESPECIES = {
  regiglitch: {
    id: "regiglitch", dex: 0, name: "REGIGLITCH", types: ["GLITCH", "NORMAL"],
    base: { hp: 160, atk: 110, def: 80, spa: 110, spd: 100, spe: 110 },
    bst: 670,
    learnset: [[1, "corrompida"], [1, "ruidobranco"], [1, "jogarpedra"], [1, "ventogelado"],
               [20, "forca"], [35, "raiodegelo"], [45, "trovoada"], [55, "garradragao"], [65, "sobrescrever"]],
    dexText: "OS SETE PONTOS DELE FORMAM UM TRAÇO: NA ESCRITA DOS REGIS, \"NADA AQUI\". FOI MONTADO COM OS RESTOS DOS OUTROS SEIS.",
    catchRate: 3, xpYield: 290, foreign: true,
    spriteUrl: "assets/sprites/pokemon/regiglitch.png",
  },
};

/** As placas, uma por câmara, no santuário do meio (src/data/maps.js). */
export const PLACAS_REGI = Object.entries(REGIS).map(([regi, R]) => ({
  mapa: R.camara,
  npc: { id: `placa_${regi}`, x: 11, y: 8, dir: "down", sprite: "placaregi", regi,
         aoFalar: (cena, npc) => cena.acordarRegi(npc.regi, npc) },
}));
