// A CRIANÇA PRESA NO PRETO de SÃO LUCARIO DO SUL. Ela está em (18, -1): uma
// linha ACIMA do mapa, no preto, onde a câmera não chega — dá pra ouvir, não
// dá pra ver. Chegou perto, ela grita. Parou em (18, 3) com um DOCE RARO na
// mochila, ela sente o cheiro, sai correndo do preto até (18, 2), pega o doce
// e, salva, dá 20 ULTRA BALLS. Depois disso ela fica ali, em (18, 2).
//
// A FALA BUGADA (0 no lugar do O, 3 no lugar do E) é do PRETO: enquanto ela
// está lá, a voz sai estragada. Fora dele — do "ME DÁ!" em diante — ela fala
// normal.
// (o motor está em src/scenes/overworld.js, `criancaDoPreto`)
export const CRIANCA_PRETO = {
  mapa: "sao_lucario",
  x: 18, presa: -1, salva: 2,          // de onde ela sai e onde ela fica
  gatilho: { x: 18, y: 3 },            // onde você tem que parar com o doce
  ouvir: 5,                            // de quantos tiles dá pra ouvir o grito
  sprite: "menino",
  item: "doce raro",
  premio: { item: "ultra ball", qtd: 20 },
  grito: "SOC0RRO! EU TÔ PRES0 NO PR3TO!",
  viu: "UM D0CE!",
  salvo: "ME DÁ! PERA, TÔ SALVO!",
  ganhou: "VOCÊ DEU UM DOCE RARO E RECEBEU 20 ULTRA BALLS!",
  depois: ["VALEU PELO DOCE!", "LÁ NO PRETO NÃO TEM NADA PRA COMER. NEM CHÃO TEM."],
};
