// VENDER ITEM NA LOJA: o preço de cada coisa e o que a mochila tem pra vender.
// A tabela está em src/data/leilao.js (VENDA) — junto do leilão, que é o outro
// jeito de fazer dinheiro no balcão.
import { DB } from "../data/index.js";
import { VENDA } from "../data/leilao.js";

/** O preço que a loja cobra por aquele item, se alguma loja de Kanto vende
 *  (a menor, se cobrarem diferente). null quando ninguém vende. */
export function precoDeLoja(item) {
  let menor = null;
  for (const mapa of Object.values(DB.MAPS || {})) {
    for (const npc of mapa.npcs || []) {
      for (const x of npc.shop || []) {
        if (x.item === item && x.price > 0 && (menor == null || x.price < menor)) menor = x.price;
      }
    }
  }
  return menor;
}

/** Por quanto o balcão compra: o especial, se tiver; senão a fração do preço
 *  de loja; senão nada (null = não compra). */
export function precoDeVenda(item) {
  if (VENDA.especiais[item] != null) return VENDA.especiais[item];
  const loja = precoDeLoja(item);
  if (loja == null) return null;
  return Math.max(VENDA.minimo, Math.floor(loja * VENDA.fracao));
}

/** O que a mochila tem que dá pra vender: [{ item, qtd, price }]. */
export function vendaveis(st) {
  return Object.entries(st.items || {})
    .filter(([, q]) => q > 0)
    .map(([item, qtd]) => ({ item, qtd, price: precoDeVenda(item) }))
    .filter((x) => x.price != null);
}
