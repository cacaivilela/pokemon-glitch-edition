// OS ITENS DE USAR E OS BOLSOS DA MOCHILA (pedido do CAIO, nov/2026: "faz e
// faz tbm outros itens (de batalha, seguráveis, itens-chave) e separações na
// mochila").
//
// CURA: usa no mapa (escolhe o Pokémon) ou na batalha (no da frente; o
// REVIVER escolhe um desmaiado). `hp` = quanto cura ("max" = tudo), `status`
// = cura o problema (um, ou "*" pra todos), `reviver` = levanta com essa
// fração do HP.
//
// BATALHA: só na batalha, sobe um atributo do da frente em 1 nível (como no
// FireRed). Some quando ele sai da batalha (como os outros níveis).
//
// Os preços e as insígnias seguram eles na prateleira das lojas
// (src/data/index.js gruda `ESTOQUE_USO` em todo balconista).

export const ITENS_CURA = {
  "poção":            { hp: 20,    preco: 300,  insignias: 0 },
  "super poção":      { hp: 50,    preco: 700,  insignias: 2 },
  "hiper poção":      { hp: 200,   preco: 1200, insignias: 4 },
  "poção máxima":     { hp: "max", preco: 2500, insignias: 6 },
  "restaurar tudo":   { hp: "max", status: "*", preco: 3000, insignias: 8 },
  "reviver":          { reviver: 0.5, preco: 1500, insignias: 3 },
  "reviver máximo":   { reviver: 1, preco: 6000, insignias: 8 },
  "antídoto":         { status: "envenenado", preco: 100, insignias: 0 },
  "anti-paralisia":   { status: "paralisia", preco: 200, insignias: 0 },
  "cura queimadura":  { status: "queimadura", preco: 250, insignias: 1 },
  "cura total":       { status: "*", preco: 600, insignias: 4 },
};

export const ITENS_BATALHA = {
  "x ataque":          { stat: "atk", nome: "ATAQUE", preco: 500, insignias: 1 },
  "x defesa":          { stat: "def", nome: "DEFESA", preco: 550, insignias: 1 },
  "x especial":        { stat: "spa", nome: "ATAQUE ESPECIAL", preco: 350, insignias: 1 },
  "x defesa especial": { stat: "spd", nome: "DEFESA ESPECIAL", preco: 350, insignias: 1 },
  "x velocidade":      { stat: "spe", nome: "VELOCIDADE", preco: 350, insignias: 1 },
  "x precisão":        { stat: "acc", nome: "PRECISÃO", preco: 950, insignias: 2 },
};

/** A BICICLETA: item-chave. Usar sobe/desce dela; em cima, você anda 2x mais
 *  rápido (como correndo, sem segurar nada). Não entra em casa nem na água. */
export const BICICLETA = {
  item: "bicicleta", preco: 10000, insignias: 2,
  subiu: "VOCÊ SUBIU NA BICICLETA!",
  desceu: "VOCÊ DESCEU DA BICICLETA.",
  dentro: "NÃO DÁ PRA ANDAR DE BICICLETA AQUI DENTRO.",
};

/** os novos ITENS DE SEGURAR que a loja vende (os efeitos em src/data/segurar.js) */
const SEGURAR_NA_LOJA = [
  ["orbe da vida", 8000], ["cinto expert", 6000], ["faixa de força", 4000],
  ["óculos sábios", 4000], ["sino da concha", 5000], ["capacete rochoso", 6000],
];

/** o que entra na prateleira de QUALQUER balconista (ver src/data/index.js) */
export const ESTOQUE_USO = [
  ...Object.entries(ITENS_CURA).filter(([it]) => it !== "poção").map(([item, d]) => ({ item, price: d.preco, insignias: d.insignias })),
  ...Object.entries(ITENS_BATALHA).map(([item, d]) => ({ item, price: d.preco, insignias: d.insignias })),
  ...SEGURAR_NA_LOJA.map(([item, price]) => ({ item, price, insignias: 5 })),
  { item: BICICLETA.item, price: BICICLETA.preco, insignias: BICICLETA.insignias, unico: true },
];

/** OS BOLSOS DA MOCHILA, na ordem das abas (◀ ▶ troca) */
export const BOLSOS = ["ITENS", "CURA", "BOLAS", "BATALHA", "SEGURAR", "MÁQUINAS", "CHAVE"];
