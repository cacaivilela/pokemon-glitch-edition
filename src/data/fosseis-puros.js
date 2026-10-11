// OS FÓSSEIS PURIFICADOS. O PURIFICADOR (um item da mochila) tira de um
// fóssil a pedra e o tempo que grudaram nele — e o laboratório de CINNABAR
// revive o que sobra do jeito que o bicho ERA antes de virar pedra: a FORMA
// PURA. Cada linha de fóssil tem a dela, e ela evolui dentro da forma, com o
// gatilho da linha de sempre.
//
// As METADES DE GALAR são outra história. DRACOZOLT e DRACOVISH são o que sai
// quando se cola a metade de um bicho com a de outro; purificada, cada metade
// lembra que era um bicho INTEIRO — e revive sozinha, uma de cada vez. Com
// duas metades puras a máquina não cola: elas não se reconhecem mais.
//
//   FÓSSIL DE AVE PURO     -> TURBOZOLT   (o velocirraptor com a cabeça do DRACOZOLT)
//   FÓSSIL DE PEIXE PURO   -> ABISSOVISH  (o tubarão do fundo com a cabeça do DRACOVISH)
//   FÓSSIL DE DRAGÃO PURO  -> DRACOSSAURO (o pescoçudo de cauda longa: a metade de baixo inteira)
//
// Os sprites são desenhados em tools/fosseis_puros/ (tools/fosseis_puros_sprites.py).

/** [id, dex da base, sprite, nome, tipos, stats, texto da Pokédex] */
const PUROS = [
  ["omanytepuro", 138, 22001, "OMANYTE", "PEDRA/FADA", "45 30 95 100 60 30",
   "A CONCHA VOLTOU A SER MADREPÉROLA. NADA DEVAGAR, GIRANDO, E A ESPIRAL BRILHA EM CORES QUE O MAR DE HOJE NÃO TEM."],
  ["omastarpuro", 139, 22002, "OMASTAR", "PEDRA/FADA", "80 50 115 125 85 40",
   "A CONCHA DE PÉROLA CRESCEU TANTO QUE ELE NÃO CONSEGUE MAIS CARREGAR. FICA NO FUNDO, CANTANDO PELOS ESPINHOS."],
  ["kabutopuro", 140, 22003, "KABUTO", "PEDRA/PSÍQUICO", "35 70 90 70 50 40",
   "O CASCO VIROU ÂMBAR TRANSPARENTE. DÁ PRA VER O CORAÇÃO DELE BATENDO, E OS OLHOS ENXERGAM O QUE AINDA VAI ACONTECER."],
  ["kabutopspuro", 141, 22004, "KABUTOPS", "PEDRA/PSÍQUICO", "65 105 100 85 75 65",
   "AS FOICES SÃO DE ÂMBAR E CORTAM SEM ENCOSTAR. CAÇAVA NO MAR ANTIGO SABENDO ONDE A PRESA IA ESTAR."],
  ["aerodactylpuro", 142, 22005, "AERODACTYL", "PEDRA/DRAGÃO", "80 100 70 75 70 120",
   "AS ESCAMAS SÃO DE CRISTAL AZUL. QUANDO PASSA NA FRENTE DO SOL, O CHÃO INTEIRO FICA COLORIDO EMBAIXO DELE."],
  ["lileeppuro", 345, 22006, "LILEEP", "PEDRA/FADA", "66 36 72 71 92 18",
   "UM LÍRIO-DO-MAR BRANCO, LIMPO DE PEDRA. AS PÉTALAS SOLTAM UM PÓ QUE ACALMA QUEM CHEGA PERTO — E É ASSIM QUE ELE CAÇA."],
  ["cradilypuro", 346, 22007, "CRADILY", "PEDRA/FADA", "86 71 97 96 112 33",
   "O JARDIM INTEIRO DE UM RECIFE QUE NÃO EXISTE MAIS FLORESCEU NOS BRAÇOS DELE."],
  ["anorithpuro", 347, 22008, "ANORITH", "PEDRA/AÇO", "45 90 65 40 45 70",
   "O CORPO VIROU OPALA. AS GARRAS RISCAM ROCHA COMO SE FOSSE AREIA."],
  ["armaldopuro", 348, 22009, "ARMALDO", "PEDRA/AÇO", "75 120 115 70 80 35",
   "UMA ARMADURA DE OPALA INTEIRA, SEM UMA RACHADURA. O BRILHO MUDA DE COR CONFORME ELE ANDA."],
  ["cranidospuro", 408, 22010, "CRANIDOS", "PEDRA/LUTADOR", "67 115 50 30 40 48",
   "SEM A PEDRA, O CRÂNIO FICOU BRANCO COMO OSSO NOVO. BATE A CABEÇA NAS ÁRVORES SÓ PRA OUVIR O BARULHO."],
  ["rampardospuro", 409, 22011, "RAMPARDOS", "PEDRA/LUTADOR", "97 155 70 55 60 58",
   "O CRÂNIO DE MARFIM É LISO COMO ESPELHO. UMA CABEÇADA DELE ABRIU O VALE ONDE O FÓSSIL FOI ACHADO."],
  ["shieldonpuro", 410, 22012, "SHIELDON", "PEDRA/GELO", "30 42 113 47 88 30",
   "O ESCUDO DA CARA É DE GELO QUE NUNCA DERRETE: VEM DA ERA EM QUE O MUNDO ERA FRIO."],
  ["bastiodonpuro", 411, 22013, "BASTIODON", "PEDRA/GELO", "60 52 158 57 138 30",
   "UMA MURALHA DE GELO ANTIGO. OS FILHOTES DA MANADA SE ESCONDIAM ATRÁS DELE NAS NEVASCAS."],
  ["tirtougapuro", 564, 22014, "TIRTOUGA", "ÁGUA/FADA", "54 68 98 63 50 22",
   "O CASCO É DE CORAL VIVO E CRESCE UM POUCO A CADA MERGULHO. PEIXINHOS MORAM NELE."],
  ["carracostapuro", 565, 22015, "CARRACOSTA", "ÁGUA/FADA", "74 98 128 93 70 32",
   "CARREGA UM RECIFE INTEIRO NAS COSTAS. ONDE ELE DORME, O MAR FICA AZUL-CLARO NO DIA SEGUINTE."],
  ["archenpuro", 566, 22016, "ARCHEN", "VOADOR/PSÍQUICO", "55 92 45 94 50 65",
   "AS PENAS VOLTARAM A TER COR: CADA UMA DE UM TOM. AINDA NÃO VOA, MAS JÁ PLANA EM SONHO."],
  ["archeopspuro", 567, 22017, "ARCHEOPS", "VOADOR/PSÍQUICO", "75 120 65 132 75 100",
   "A PRIMEIRA AVE QUE VOOU DE VERDADE. NO CÉU, AS PENAS DEIXAM UM RASTRO DE ARCO-ÍRIS."],
];

/** as três metades de Galar puras: espécies NOVAS, exclusivas deste jogo */
const NOVOS = [
  ["turbozolt", 1092, "TURBOZOLT", "ELÉTRICO/DRAGÃO", "85 115 75 80 65 120",
   "O DONO DE VERDADE DA METADE DE CIMA DO DRACOZOLT: UM VELOCIRRAPTOR. CORRE COM AS PERNAS QUE O OUTRO NUNCA TEVE, E A CAUDA SOLTA FAÍSCA."],
  ["abissovish", 1093, "ABISSOVISH", "ÁGUA/DRAGÃO", "95 105 90 70 70 110",
   "A METADE DE CIMA DO DRACOVISH ERA A CABEÇA DESTE TUBARÃO DO FUNDO DO MAR ANTIGO. ENGOLE A PRESA E A CORRENTEZA JUNTO."],
  ["dracossauro", 1094, "DRACOSSAURO", "DRAGÃO/TERRA", "110 95 110 70 90 65",
   "A METADE DE BAIXO DE TODO DRACO-ALGUMA-COISA ERA DELE: UM PESCOÇUDO MANSO DE CAUDA LONGA. O CHÃO TREME QUANDO ELE PASSA."],
];

/** os fósseis que viram outra coisa purificados: fóssil -> fóssil puro */
export const PURIFICAVEIS = {
  "fóssil hélix": "fóssil hélix puro",
  "fóssil domo": "fóssil domo puro",
  "âmbar velho": "âmbar puro",
  "fóssil raiz": "fóssil raiz puro",
  "fóssil garra": "fóssil garra puro",
  "fóssil crânio": "fóssil crânio puro",
  "fóssil escudo": "fóssil escudo puro",
  "fóssil casco": "fóssil casco puro",
  "fóssil pluma": "fóssil pluma puro",
  "fóssil de ave": "fóssil de ave puro",
  "fóssil de peixe": "fóssil de peixe puro",
  "fóssil de dragão": "fóssil de dragão puro",
};

/** o que o laboratório revive de cada fóssil puro (entra em FOSSEIS, src/data/mineracao.js) */
export const FOSSEIS_PUROS = {
  "fóssil hélix puro": { especie: "omanytepuro", nivel: 20 },
  "fóssil domo puro": { especie: "kabutopuro", nivel: 20 },
  "âmbar puro": { especie: "aerodactylpuro", nivel: 20 },
  "fóssil raiz puro": { especie: "lileeppuro", nivel: 20 },
  "fóssil garra puro": { especie: "anorithpuro", nivel: 20 },
  "fóssil crânio puro": { especie: "cranidospuro", nivel: 20 },
  "fóssil escudo puro": { especie: "shieldonpuro", nivel: 20 },
  "fóssil casco puro": { especie: "tirtougapuro", nivel: 20 },
  "fóssil pluma puro": { especie: "archenpuro", nivel: 20 },
  // as metades puras: UMA basta (e duas não colam)
  "fóssil de ave puro": { especie: "turbozolt", nivel: 25 },
  "fóssil de peixe puro": { especie: "abissovish", nivel: 25 },
  "fóssil de dragão puro": { especie: "dracossauro", nivel: 25 },
};

const ESPECIE = (id, dex, nome, tipos, stats, extra) => {
  const [hp, atk, def, spa, spd, spe] = stats.split(/\s+/).map(Number);
  const bst = hp + atk + def + spa + spd + spe;
  return {
    id, dex, name: nome, types: tipos.split("/"), base: { hp, atk, def, spa, spd, spe }, bst,
    foreign: true, catchRate: 45, xpYield: Math.floor(bst / 4), ...extra,
  };
};

export const FOSSEIS_PUROS_ESPECIES = {};
for (const [id, base, sprite, nome, tipos, stats, dexText] of PUROS) {
  // o golpe é o da linha de sempre (`learnsetDe`, src/data/species.js)
  const deBase = id.replace(/puro$/, "");
  FOSSEIS_PUROS_ESPECIES[id] = ESPECIE(id, base, nome, tipos, stats,
    { spriteDex: sprite, forma: "PURA", formaDe: deBase, learnsetDe: deBase, dexText });
}
for (const [id, dex, nome, tipos, stats, dexText] of NOVOS) {
  FOSSEIS_PUROS_ESPECIES[id] = ESPECIE(id, dex, nome, tipos, stats,
    { learnsetDe: { turbozolt: "dracozolt", abissovish: "dracovish", dracossauro: "dracozolt" }[id], dexText });
}

/** as evoluções da forma pura: o mesmo gatilho da linha de sempre */
export const EVO_PUROS = {
  omanytepuro: [{ lvl: 40, to: "omastarpuro" }],
  kabutopuro: [{ lvl: 40, to: "kabutopspuro" }],
  lileeppuro: [{ lvl: 40, to: "cradilypuro" }],
  anorithpuro: [{ lvl: 40, to: "armaldopuro" }],
  cranidospuro: [{ lvl: 30, to: "rampardospuro" }],
  shieldonpuro: [{ lvl: 30, to: "bastiodonpuro" }],
  tirtougapuro: [{ lvl: 37, to: "carracostapuro" }],
  archenpuro: [{ lvl: 37, to: "archeopspuro" }],
};

/** O PURIFICADOR: não se gasta (como a PEDRA BUGADA); quem se gasta é o fóssil */
export const PURIFICADOR = {
  item: "purificador",
  lore: "UMA LANTERNINHA DE LUZ BRANCA. APONTADA PRA UM FÓSSIL, TIRA A PEDRA E O TEMPO QUE GRUDARAM NELE.",
  pergunta: "QUAL FÓSSIL VOCÊ QUER PURIFICAR?",
  nenhum: "VOCÊ NÃO TEM NENHUM FÓSSIL PRA PURIFICAR. A LUZ BATE NA MOCHILA E NÃO ACHA NADA.",
  feito: "A LUZ BRANCA PASSA PELO {FOSSIL}... A PEDRA ESCORRE COMO ÁGUA. AGORA É UM {PURO}!",
  dica: "LEVE PRO LABORATÓRIO DE CINNABAR: ELE VOLTA DO JEITO QUE ERA ANTES DE VIRAR PEDRA.",
  vendedor: ["PSIU. ESSA LANTERNINHA AQUI VEIO DENTRO DE UM OVO. NÃO NASCEU NADA, SÓ ELA.",
             "NÃO SERVE PRA OVO NENHUM. FICA PRA VOCÊ: APONTA PRA UM FÓSSIL E VÊ O QUE ACONTECE."],
  ganhou: "VOCÊ GANHOU UM PURIFICADOR!",
  ondeTem: "SE QUISER VER UM FÓSSIL DO JEITO QUE ERA ANTES DA PEDRA, PROCURA O VENDEDOR DE OVOS DO CENTRO POKÉMON. ELE ACHOU UMA LANTERNINHA ESTRANHA DENTRO DE UM OVO.",
  // o laboratório
  labPuro: ["A MÁQUINA LÊ O FÓSSIL PURO... NÃO TEM PEDRA PRA TIRAR.", "{MON} VOLTOU DO JEITO QUE ERA! NÍVEL {NIVEL}. A FORMA PURA!"],
  labMetadePura: ["A METADE PURA NÃO PRECISA DE OUTRA: ELA LEMBRA QUE ERA UM BICHO INTEIRO.", "NASCEU {MON}, NÍVEL {NIVEL}! NINGUÉM NUNCA VIU UM DESSES VIVO."],
  labDuasPuras: "DUAS METADES PURAS NÃO COLAM: CADA UMA LEMBRA QUE ERA UM BICHO INTEIRO. REVIVE UMA DE CADA VEZ.",
};

/** o que a mochila diz de cada fóssil puro */
export const PUROS_LORE = Object.fromEntries(Object.entries(FOSSEIS_PUROS).map(([item, { especie }]) => [item,
  item.includes(" de ") ? "UMA METADE DE GALAR SEM PEDRA NENHUMA. SOZINHA ELA JÁ É UM BICHO INTEIRO — EM CINNABAR, REVIVE."
    : "UM FÓSSIL LIMPO, SEM PEDRA E SEM TEMPO. EM CINNABAR ELE VOLTA NA FORMA PURA."]));
