// A ÁRVORE OCA DA ROTA 1 (pedido do CAIO, nov/2026): a árvore mais perto do
// matinho de 6x5 da ROTA 1 tem um buraco no tronco. Dentro, um CORREDOR comprido;
// no meio do caminho, a porta ATRÁS de você abre e sai um GUZZLORD ALFA gritando
// "GUUUUZZLOOOORD!" e correndo atrás de você. Lá no fim tem a SAÍDA:
//   - se ele te PEGA: te derrota (sem batalha), rouba umas POKÉ BOLAS vazias e
//     dinheiro, e você acorda fora da árvore;
//   - se você CHEGA na saída: entra na SALA DO TESOURO, com a porta atrás de você
//     e o GUZZLORD tentando passar, e a sala cheia de pokébolas com prêmio.
// A lógica (a porta, a corrida, o roubo, o desenho) é src/systems/arvoreoca.js.
//
// Plantas no formato de src/data/braglitch.js (`montarGeos`, tema "arvoreoca"):
//   # parede de casca   . chão de madeira   U passagem (porta/buraco)
//   Z a porta do GUZZLORD (fechada: não passa)
import { montarGeos } from "./braglitch.js";

// (90 fileiras: o CAIO pediu "aumente em 3x o corredor")
const CORREDOR = [
  "#########",
  "####U####",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "#Z.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##",
  "####U####",
  "#########",
];

const TESOURO = [
  "###########",
  "#####U#####",
  "#.........#",
  "#.........#",
  "#.........#",
  "#.........#",
  "#.........#",
  "#.........#",
  "#####Z#####",
];

export const ARVORE = {
  // a árvore da ROTA 1 (fala com ela de cima, do (11,24))
  entrada: { mapa: "route1", x: 11, y: 25 },
  volta: { mapa: "route1", x: 11, y: 24, dir: "down" },
  corredor: { mapa: "arvore_oca", chegada: { x: 4, y: 91, dir: "up" } },
  tesouro: { mapa: "arvore_oca_tesouro", chegada: { x: 5, y: 7, dir: "up" } },
  // a porta do GUZZLORD (no corredor) e onde ele sai
  porta: { x: 1, y: 85 },
  // a porta abre quando você passa desta fileira (ela fica ATRÁS de você)
  gatilho: 77,
  guzzlord: { id: "guzzlord", nivel: 70, velocidade: 95 },   // pixels por segundo (andando 60, correndo 120)
  roubo: { bolas: 10, dinheiro: 0.15, maxDinheiro: 8000 },
  textos: {
    tronco: ["TEM UM BURACO NO TRONCO DESTA ÁRVORE. LÁ DENTRO É ESCURO... E VEM UM VENTINHO.", "ENTRAR?"],
    opcoes: ["ENTRAR", "NÃO"],
    grito: "GUUUUUUUUUUUZZLOOOOOOOOOOOOOOOOOOOOORD!",
    porta: "A PORTA ATRÁS DE VOCÊ SE ABRIU!",
    corre: "CORRE!",
    pegou: ["GUUUZZLORD!", "O GUZZLORD TE PEGOU! ELE TE DERRUBOU E REVIROU A SUA MOCHILA...",
            "ELE COMEU {BOLAS} POKÉ BOLAS VAZIAS E ${DINHEIRO}!", "...VOCÊ ACORDOU DO LADO DE FORA DA ÁRVORE."],
    escapou: ["VOCÊ PASSOU PELA SAÍDA!", "O GUZZLORD VEIO ATRÁS... E ENTALOU NA PORTA! ELE É GRANDE DEMAIS PRA PASSAR!"],
    bate: "BUM!",
    saida: ["UM BURACO NA RAIZ LEVA DE VOLTA PRA ROTA 1. SAIR?"],
    tesouro: "VOCÊ ABRIU A POKÉBOLA... E SAIU TUDO ISSO LÁ DE DENTRO!",
    vazia: "A POKÉBOLA ESTÁ VAZIA. O GUZZLORD CONTINUA ENTALADO NA PORTA...",
    opcoesSaida: ["SAIR", "FICAR"],
  },
};

// OS PRÊMIOS DA SALA DO TESOURO: cada pokébola um item (pega uma vez só)
const PREMIOS = [
  ["doce raro", 3], ["pepita grande", 2], ["master ball", 1], ["ultra ball", 10],
  ["lum berry", 5], ["sitrus berry", 5], ["liechi berry", 3], ["ganlon berry", 3],
  ["salac berry", 3], ["petaya berry", 3], ["lansat berry", 2], ["starf berry", 2],
  ["doce de estrela", 2], ["doce de trevo", 2], ["doce dourado", 1],
  ["mel", 5], ["bacon", 5], ["queijo", 5], ["presunto", 5], ["pimenta", 5], ["wasabi", 5],
];

export const CONTEUDO_ARVORE = {
  arvore_oca: {
    name: "ÁRVORE OCA", music: "cave", interior: true, caverna: true, encounters: [], arvoreOca: true,
    spawn: { ...ARVORE.corredor.chegada }, npcs: [],
  },
  arvore_oca_tesouro: {
    name: "SALA DO TESOURO", music: "cave", interior: true, caverna: true, encounters: [], arvoreOca: true, arvoreTesouro: true,
    spawn: { ...ARVORE.tesouro.chegada },
    // TODOS os prêmios numa pokébola só, no meio da sala (o CAIO: "todos os
    // itens saírem da mesma pkbola"); quem entrega é o overworld (`abrirTesouro`)
    npcs: [{ id: "tesouro", x: 5, y: 4, sprite: "ball", tesouroArvore: true, premios: PREMIOS, lines: [] }],
  },
};

export function montarArvore(kanto) {
  const geos = montarGeos(kanto, { plantas: { arvore_oca: CORREDOR, arvore_oca_tesouro: TESOURO }, interiores: {},
    temas: { arvore_oca: "arvoreoca", arvore_oca_tesouro: "arvoreoca" }, cidadePadrao: "arvore_oca", marca: {} });
  const c = geos.arvore_oca, t = geos.arvore_oca_tesouro;
  // as passagens: a de cima do corredor leva pro tesouro; a de baixo, pra ROTA 1
  // (quem leva pra fora é o overworld, `sairDaArvore`); a de cima do tesouro, pra ROTA 1 também
  const cima = c.warps.findIndex((w) => w.y === 1), baixo = c.warps.findIndex((w) => w.y > 1);
  const tCima = t.warps.findIndex((w) => w.y === 1);
  c.warps[cima] = { ...c.warps[cima], to: "arvore_oca_tesouro", toWarp: -1, arvoreSaida: true };
  c.warps[baixo] = { ...c.warps[baixo], to: null, arvoreFora: true };
  t.warps[tCima] = { ...t.warps[tCima], to: null, arvoreFora: true };
  return geos;
}

/** a ÁRVORE da ROTA 1 que dá pra falar (chamado no fim do `buildDB`) */
export function porArvore(db) {
  const r = db.MAPS?.[ARVORE.entrada.mapa];
  if (!r) return;
  r.npcs = [...(r.npcs || []).filter((n) => n.id !== "arvore_oca"),
    { id: "arvore_oca", x: ARVORE.entrada.x, y: ARVORE.entrada.y, dir: "down", sprite: "arvore_oca", invisivel: true, arvoreOca: true, lines: [] }];
}
