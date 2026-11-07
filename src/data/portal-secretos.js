// OS POKÉMON SECRETOS DO PORTAL PARADOXO (src/data/portal-paradoxo.js):
// inventados aqui, escolhidos pelo CAIO. Cada um mora no mapa secreto de uma
// combinação de quatro runas e se pega uma vez só (um de cada). Os desenhos
// são pixel por pixel em tools/portal_secretos/<nome>.py (nº.png e shiny/nº.png).
const ESPECIE = (id, dex, name, types, [hp, atk, def, spa, spd, spe], learnset, dexText) => ({
  id, dex, name, types, base: { hp, atk, def, spa, spd, spe }, bst: hp + atk + def + spa + spd + spe,
  foreign: true, secreto: true, catchRate: 15, xpYield: 230, learnset, dexText,
});

export const SECRETOS = {
  runaglifo: ESPECIE("runaglifo", 1105, "RUNÁGLIFO", ["PSÍQUICO", "FANTASMA"], [80, 60, 110, 130, 120, 80],
    [[1, "confusao"], [1, "assustar"], [12, "raionoturno"], [24, "psiquico"], [36, "bolasombria"],
     [48, "choquepsiquico"], [60, "poderantigo"], [72, "luzdaruina"]],
    "AS QUATRO RUNAS UNOWN DO PORTAL VIRARAM UMA PEDRA SÓ, E A PEDRA ABRIU O OLHO. AS LETRAS EM VOLTA ESCREVEM O QUE ELE PENSA."),
  pokemimo: ESPECIE("pokemimo", 1106, "POKÉMIMO", ["NORMAL", "AÇO"], [95, 100, 120, 70, 100, 95],
    [[1, "investida"], [1, "defesadeferro"], [12, "golpedecorpo"], [24, "cabecadeferro"], [36, "bolagiro"],
     [48, "caudadeferro"], [60, "pisotear"], [72, "raiodeaco"]],
    "UMA POKÉ BOLA, UMA GREAT, UMA ULTRA E UMA MASTER CAÍRAM NO PORTAL JUNTAS. SAIU ELE, QUE TROCA DE COR CONFORME O HUMOR. NINGUÉM SABE O QUE TEM DENTRO."),
  fruteiro: ESPECIE("fruteiro", 1107, "FRUTEIRO", ["PLANTA", "FADA"], [110, 80, 95, 115, 115, 65],
    [[1, "chicotedevinha"], [1, "encanto"], [12, "folhamagica"], [24, "bombadesementes"], [36, "ventodefada"],
     [48, "petalasdancantes"], [60, "canhaofloral"], [72, "raiosolar"]],
    "UMA ÁRVORE QUE ANDA. CADA GALHO DÁ UMA BERRY DIFERENTE, E QUANDO ELE PASSA CHOVE FRUTA PROS POKÉMON PEQUENOS."),
  aurossauro: ESPECIE("aurossauro", 1108, "AUROSSAURO", ["PEDRA", "DRAGÃO"], [100, 135, 120, 60, 80, 85],
    [[1, "mordida"], [1, "tumbadepedra"], [12, "garradragao"], [24, "poderantigo"], [36, "cabecadadepedra"],
     [48, "caudadedragao"], [60, "investidadragao"], [72, "laminadepedra"]],
    "UM ESQUELETO DE DINOSSAURO FEITO DE OURO. O PORTAL MISTUROU OS FÓSSEIS COM AS PEPITAS, E O OURO LEMBROU COMO É ANDAR."),
  doceronte: ESPECIE("doceronte", 1109, "DOCERONTE", ["FADA", "NORMAL"], [115, 125, 105, 70, 90, 75],
    [[1, "investida"], [1, "encanto"], [12, "beijodefada"], [24, "pisotear"], [36, "golpedecorpo"],
     [48, "ventodefada"], [60, "megachifre"], [72, "vozencantadora"]],
    "UM RINOCERONTE DE DOCE: O CHIFRE É UM PIRULITO E A CASCA É DE BALA. ELE CORRE ATRÁS DE QUEM TEM FRUTA NO BOLSO."),
};
