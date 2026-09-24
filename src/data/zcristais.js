// OS CRISTAIS Z: dezenove de TIPO (prêmio das PROVAÇÕES, por Kanto), sete de ESPÉCIE nas ilhas.
//
// A ilha 2 era a sobra da conta dos bonés: ela pedia o boné da geração 2, e boné
// de JOHTO nunca existiu (ver src/data/bones.js). Em vez de ficar sendo a ilha
// sem graça, ela virou A ILHA DAS PROVAÇÕES — uma marca no chão pra cada tipo,
// um TOTEM dormindo em cima de cada marca, e o cristal daquele tipo na mão de
// quem derrubar o totem. Quem manda nisso é src/data/provacoes.js; aqui embaixo
// fica só O QUE É cada cristal.
//
// COMO SE USA: com o cristal do tipo certo na mochila, aperte Q antes de
// escolher o golpe. Se o golpe for daquele tipo, ele sai como GOLPE Z — uma vez
// por batalha. É a mesma mão da MEGA (armar com uma tecla, depois escolher), e
// isso não é preguiça: um jogo que ensina um gesto uma vez e o reaproveita pede
// menos da cabeça de quem joga do que um gesto novo por sistema.
//
// O cristal NÃO GASTA. Como o GLITCHBOOSTER e o decodificador, ele é item-chave:
// o que acaba é a vez, não o objeto.
//
// O GOLPE Z DO PIKACHU DE BONÉ é outro (10.000.000 DE VOLTS, em bones.js): ele
// não olha tipo, olha espécie, e é mais forte. Estes de cima são os de todo
// mundo; lá embaixo vêm os DE ESPÉCIE, que seguem a mesma ideia do de boné.
const TABLE = [
  ["NORMAL", "normal", "EXPLOSÃO DEFINITIVA"],
  ["FOGO", "fogo", "INFERNO ABRASADOR"],
  ["ÁGUA", "agua", "HIDROVÓRTICE"],
  ["PLANTA", "planta", "FLORESTA DEVASTADORA"],
  ["ELÉTRICO", "eletrico", "GIGAVOLT DEVASTADOR"],
  ["GELO", "gelo", "GLACIAÇÃO SUBZERO"],
  ["LUTADOR", "lutador", "SOCO ROMPE-TUDO"],
  ["VENENO", "veneno", "ÁCIDO CORROSIVO"],
  ["TERRA", "terra", "TERREMOTO TECTÔNICO"],
  ["VOADOR", "voador", "VENDAVAL SUPERSÔNICO"],
  ["PSÍQUICO", "psiquico", "COLAPSO PSÍQUICO"],
  ["INSETO", "inseto", "ENXAME AGUILHOADOR"],
  ["PEDRA", "pedra", "AVALANCHE CONTINENTAL"],
  ["FANTASMA", "fantasma", "ASSOMBRAÇÃO INFINITA"],
  ["SOMBRIO", "sombrio", "BURACO NEGRO"],
  ["AÇO", "aco", "FERRO CORTA-MUNDO"],
  ["FADA", "fada", "BRILHO FEÉRICO"],
  // O DE DRAGÃO chegou depois, junto com a provação dele (src/data/provacoes.js),
  // e chegou com nome próprio como o de GLITCH: DRACONINUM Z.
  ["DRAGÃO", "dragao", "DESTRUIÇÃO MEDIEVAL", "draconinum z"],
  // O DE GLITCH TEM NOME PRÓPRIO. Os dezessete de cima são "CRISTAL Z DE
  // <TIPO>" porque o jogo é em português e um cristal de água se chama cristal
  // de água. O décimo oitavo não: GLITCH não é um tipo que existe em lugar
  // nenhum, então ele não tem nome traduzido pra respeitar — e o nome que ele
  // pede é o da série, o que a gente usaria se esse tipo tivesse existido.
  ["GLITCH", "glitch", "SOBRESCREVER TUDO", "glitchinium"],
];

/** Nomes antigos de item -> nome de hoje. Quem tem "cristal z de glitch" na
 *  mochila de um save anterior fica com o GLITCHINIUM no lugar (o jogo aplica
 *  isso ao carregar, em src/main.js): renomear um item sem isso é confiscar o
 *  item de quem já tinha. */
export const RENOMEADOS = { "cristal z de glitch": "glitchinium" };

/** Força de todo golpe Z de tipo. Um número só: o Z é o teto, e teto que varia
 *  por tipo vira tabela de decoreba. O do PIKACHU é mais forte de propósito —
 *  ele é de uma espécie só e custa uma ilha inteira pra achar. */
export const PODER_Z = 180;

export const ZCRISTAIS = [];
export const Z_GOLPES = {};
for (const [tipo, slug, nome, apelido] of TABLE) {
  const golpe = `z${slug}`;
  ZCRISTAIS.push({ tipo, item: apelido || `cristal z de ${slug}`, golpe, nome });
  Z_GOLPES[golpe] = {
    name: nome, type: tipo, power: PODER_Z, acc: 100, pp: 1, category: "especial", z: true,
  };
}

// ---------------------------------------------------- CRISTAIS DE ESPÉCIE
//
// Os dezoito de cima servem pra QUALQUER bicho que saiba um golpe do tipo. Estes
// aqui servem pra UM SÓ — e é por isso que eles batem mais forte. O preço de
// pertencer a uma espécie é ser inútil em todas as outras; o troco é o número.
//
// Cada um mora numa ilha diferente, um por ilha, longe do PIKACHU DE BONÉ que
// já está lá. Espalhar assim é o que dá a cada ilha um motivo de visita além do
// boné dela — e, como são sete ilhas e sete cristais, dá pra dizer onde estão
// sem precisar de mapa.
//
//   [ item, espécie, tipo do golpe, nome do golpe, poder, mapa, x, y ]
const ESPECIE = [
  ["pikanium z", "pikachu", "ELÉTRICO", "CATASTROPIKA", 210, "one_island", 22, 13],
  ["eevium z", "eevee", "NORMAL", "EVOBOOST EXTREMO", 200, "three_island", 21, 7],
  ["snorlium z", "snorlax", "NORMAL", "PANQUECA PULVERIZADORA", 210, "four_island", 5, 12],
  ["incinium z", "incineroar", "FOGO", "SALTO MORTAL MALICIOSO", 200, "five_island", 8, 4],
  ["primarium z", "primarina", "ÁGUA", "OPERETA OCEÂNICA", 195, "six_island", 22, 19],
  ["decidium z", "decidueye", "PLANTA", "CHUVA DE FLECHAS SINISTRA", 200, "seven_island", 7, 1],
  ["mewnium z", "mew", "PSÍQUICO", "SUPERNOVA GÊNESE", 200, "birth_island", 13, 6],
];

for (const [item, especie, tipo, nome, poder, mapa, x, y] of ESPECIE) {
  const golpe = `z${item.split(" ")[0]}`;
  ZCRISTAIS.push({ tipo, especie, item, golpe, nome, mapa, x, y });
  Z_GOLPES[golpe] = {
    name: nome, type: tipo, power: poder, acc: 100, pp: 1, category: "especial", z: true,
  };
}

/** O cristal daquele tipo, ou null. */
export const cristalDoTipo = (tipo) => ZCRISTAIS.find((c) => c.tipo === tipo) || null;

/** ONDE ELES ESTÃO: NO FIM DE UMA PROVAÇÃO.
 *
 *  Eles já estiveram largados pelo chão da ILHA DOIS e do CABO DA BEIRA —
 *  dezoito bolas espalhadas, catadas em meia hora de caminhada. Agora cada um é
 *  o prêmio do TOTEM que dorme naquele mesmo lugar (src/data/provacoes.js): a
 *  lista de lugares mudou de arquivo porque o lugar deixou de ser um esconderijo
 *  e virou uma luta, e é a provação que sabe onde a luta acontece.
 *
 *  Os DE ESPÉCIE, ali em cima, continuam no chão de uma ilha cada um. Eles não
 *  ganharam provação de propósito: cristal que só serve pra UM bicho já custa
 *  encontrar o bicho. */
