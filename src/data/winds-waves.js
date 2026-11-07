// OS INICIAIS DE POKÉMON WINDS AND WAVES (a 10ª geração, mostrados em fev/2026;
// o jogo sai em 2027) — pedido do CAIO: BROWT, POMBON e GECQUA. Chegam pelo
// PRESENTE MISTERIOSO (src/data/gifts.js, código WINDSWAVES).
//
// O que ainda não saiu (atributos, golpes, evolução) foi decidido aqui, no
// tamanho de um inicial de primeira forma; quando o jogo sair, troca. Sem
// evolução por enquanto (escolha dele). E têm SHINY LOCK: nunca saem shiny. Os sprites não existem ainda: são
// desenhados pixel por pixel em tools/winds_waves/sprites.py, olhando o
// trailer — BROWT o pintinho-feijão marrom de sobrancelha de folha, POMBON o
// lulu-da-pomerânia laranja, GECQUA a lagartixa azul com a gota na testa.
const ESPECIE = (id, dex, name, types, [hp, atk, def, spa, spd, spe], learnset, dexText) => ({
  id, dex, name, types, base: { hp, atk, def, spa, spd, spe }, bst: hp + atk + def + spa + spd + spe,
  foreign: true, catchRate: 45, xpYield: 64, learnset, dexText, inicial: true,
  // SHINY LOCK (pedido do CAIO): nunca são shiny — src/systems/mon.js
  shinyLock: true,
});

export const WINDS_WAVES = {
  browt: ESPECIE("browt", 1112, "BROWT", ["PLANTA"], [48, 60, 55, 40, 50, 55],
    [[1, "investida"], [1, "encarar"], [5, "bicada"], [9, "folhanavalha"], [14, "chicotedevinha"],
     [19, "cabecada"], [24, "folhamagica"], [30, "bombadesementes"], [37, "laminadefolha"], [45, "energiadanatureza"]],
    "O POKÉMON PINTINHO-FEIJÃO. FAZ CARA DE BRAVO PRA PARECER FORTE, MAS A SOBRANCELHA DE FOLHA É SÓ UM BROTO."),
  pombon: ESPECIE("pombon", 1113, "POMBON", ["FOGO"], [50, 52, 45, 58, 48, 57],
    [[1, "investida"], [1, "rabodeabano"], [5, "brasa"], [9, "mordida"], [14, "rodadefogo"],
     [19, "nitrocarga"], [24, "presadefogo"], [30, "lancachamas"], [37, "ondadecalor"], [45, "labareda"]],
    "O PRIMEIRO CACHORRINHO A SER INICIAL. O PELO FOFO É QUENTE COMO BRASA: ABRAÇAR NO INVERNO É BOM, NO VERÃO NEM TANTO."),
  gecqua: ESPECIE("gecqua", 1114, "GECQUA", ["ÁGUA"], [45, 48, 48, 60, 52, 58],
    [[1, "investida"], [1, "encarar"], [5, "pistoladagua"], [9, "ataquerapido"], [14, "bolhas"],
     [19, "pulsodagua"], [24, "jatodagua"], [30, "caudadagua"], [37, "cachoeira"], [45, "hidrobomba"]],
    "UMA LAGARTIXA DE CABEÇA GRANDE. A GOTA ENTRE OS OLHOS GUARDA ÁGUA PRA ELE NUNCA SECAR, NEM LONGE DO MAR."),
};
