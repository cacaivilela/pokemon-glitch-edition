// AS REGRAS DO LEILÃO. Quem vale quanto, quem dá lance e por quanto sai.
// A tela é src/scenes/leilao.js e as tabelas src/data/leilao.js.
import { DB } from "../data/index.js";
import { ehFusao, partes } from "./fusao.js";
import { BARRACA_LEILAO, FAIXAS, LENDARIOS, CORTE, LEILOEIROS } from "../data/leilao.js";

const especie = (mon) => DB.SPECIES?.[mon?.species] || null;

/** Tem a barraca de leilão na mochila? */
export const temBarraca = (st) => (st?.items?.[BARRACA_LEILAO.item] || 0) > 0;

/** A raridade de um Pokémon: "comum" | "raro" | "pseudo" | "lendario".
 *
 *  Lendário é lista escrita à mão. O resto sai do total de status, que é o
 *  número que o próprio jogo já usa pra decidir o quanto é difícil capturar —
 *  então "caro de comprar" e "difícil de pegar" andam juntos, como deve ser.
 *  Fusão herda a raridade do lado mais raro: fundir com o MEWTWO não devia
 *  esconder que tem um MEWTWO ali dentro. */
export function raridade(mon) {
  const sp = especie(mon);
  if (!sp) return "comum";

  if (ehFusao(mon)) {
    const p = partes(mon.species);
    const lados = [p?.cabeca, p?.corpo].filter(Boolean).map((id) => raridade({ species: id }));
    const ordem = ["comum", "raro", "pseudo", "lendario"];
    return lados.sort((a, b) => ordem.indexOf(b) - ordem.indexOf(a))[0] || "raro";
  }

  const id = sp.id || mon.species;
  if (LENDARIOS.has(id)) return "lendario";
  const bst = sp.bst || 0;
  if (bst >= CORTE.pseudo) return "pseudo";
  if (bst >= CORTE.raro) return "raro";
  return "comum";
}

/** A faixa de preço daquele bicho: { min, max, passo, nome }. */
export const faixa = (mon) => FAIXAS[raridade(mon)] || FAIXAS.comum;

/** Pode leiloar? Não dá pra ficar sem nenhum Pokémon no mundo. */
export function podeLeiloar(st, mon) {
  if (!temBarraca(st)) return { ok: false, erro: "semBarraca" };
  if (!mon) return { ok: false, erro: "semBicho" };
  if ((st.party || []).length <= 1 && (st.party || []).includes(mon)) {
    return { ok: false, erro: "ultimo" };
  }
  return { ok: true };
}

/** O quanto o pedido está esticado dentro da faixa: 0 no mínimo, 1 no teto. */
export const esticado = (mon, pedido) => {
  const f = faixa(mon);
  return f.max === f.min ? 0 : Math.max(0, Math.min(1, (pedido - f.min) / (f.max - f.min)));
};

/** O LEILÃO. Devolve os lances, um a um, e o que aconteceu no fim.
 *
 *  Cada leiloeiro decide se entra: perto do mínimo quase todo mundo entra, perto
 *  do teto quase ninguém. Quem entra cobre o lance anterior por uma porcentagem.
 *  Ninguém entrou, ninguém levou — e é esse o risco de pedir caro.
 *
 *  `sorteio` existe pra o teste poder rodar o leilão sem depender da sorte. */
export function leiloar(mon, pedido, sorteio = Math.random) {
  const t = esticado(mon, pedido);
  const chance = LEILOEIROS.chanceNoMinimo
    + (LEILOEIROS.chanceNoTeto - LEILOEIROS.chanceNoMinimo) * t;

  const lances = [];
  let atual = pedido;
  for (let i = 0; i < LEILOEIROS.quantos; i++) {
    if (sorteio() > chance) continue;                 // esse passou a vez
    const [a, b] = LEILOEIROS.aumento;
    const sobe = i === 0 ? 0 : a + sorteio() * (b - a);   // o primeiro cobre o pedido
    atual = Math.round(atual * (1 + sobe) / 10) * 10;
    lances.push({ quem: i + 1, valor: atual });
  }

  if (!lances.length) return { vendido: false, preco: 0, lances: [] };

  let preco = lances[lances.length - 1].valor;
  if (mon.shiny) preco = Math.round(preco * LEILOEIROS.bonusShiny);
  if (especie(mon)?.ficha) preco = Math.round(preco * LEILOEIROS.bonusFicha);
  return { vendido: true, preco, lances, shiny: !!mon.shiny };
}

/** Fecha o negócio: tira o Pokémon de onde ele estiver e põe o dinheiro no bolso. */
export function vender(st, mon, preco) {
  const naEquipe = (st.party || []).indexOf(mon);
  if (naEquipe >= 0) st.party.splice(naEquipe, 1);
  else {
    for (const caixa of Object.values(st.box || {})) {
      const i = Array.isArray(caixa) ? caixa.indexOf(mon) : -1;
      if (i >= 0) { caixa.splice(i, 1); break; }
    }
  }
  st.money = Math.min(999999, (st.money || 0) + preco);
  return st.money;
}

export { BARRACA_LEILAO, FAIXAS };
