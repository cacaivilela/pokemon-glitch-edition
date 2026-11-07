// OS BOLSOS DA MOCHILA (pedido do CAIO, nov/2026: "separações na mochila").
// Cada item cai num bolso pelo que ele É: bola, cura, X de batalha, de segurar,
// item-chave (os que não se gastam e servem pra fazer algo: a PICARETA, o
// DECODIFICADOR, a BICICLETA...) e o resto em ITENS (pedras, fósseis,
// ingredientes, doces...). A ordem das abas está em src/data/itens-uso.js.
import { DB } from "../data/index.js";
import { seguravel } from "./segurar.js";
import { bolaPorItem } from "../data/bolas.js";
import { PEDRA_BUGADA } from "../data/pedra-bugada.js";
import { ehMaquina } from "./maquinas.js";

/** os ITENS-CHAVE: os que não se gastam (uma lista feita na hora, porque eles
 *  moram espalhados pelos dados de cada coisa) */
function chaves() {
  const lista = [
    DB.BICICLETA?.item, DB.FUSAO?.item, DB.MEGA_ANEL, DB.GUIA_VOID?.item, DB.PURIFICADOR?.item,
    DB.KIT_BASE, DB.CUIA?.item, DB.CONECTADOR?.item, DB.CATALOGO_ROTOM?.item, DB.CUBO_ZYGARDE?.item, DB.GUARDA_ROUPA?.item,
    DB.POKEBLOCOS?.ESTOJO, DB.VINCULO?.cristal?.item, PEDRA_BUGADA?.item, DB.CRISTAL?.item,
    "picareta", "visor de cardumes", "pokédex", "amuleto brilhante",
    ...(DB.PANDEIROS || []).map((p) => p.item),
    ...(DB.PEDRAS_BRAG || []).map((p) => p.item),
    ...Object.keys(DB.STORY?.bilhetes || {}),
    ...Object.keys(DB.ITENS_DE_FORMA || {}),
  ];
  return new Set(lista.filter(Boolean));
}

let cacheChaves = null, cacheDb = null;

/** o bolso de um item: "ITENS" | "CURA" | "BOLAS" | "BATALHA" | "SEGURAR" | "CHAVE" */
export function bolsoDoItem(item) {
  if (cacheDb !== DB.SPECIES) { cacheChaves = chaves(); cacheDb = DB.SPECIES; }
  if (ehMaquina(item)) return "MÁQUINAS";       // as MTs e MOs (src/systems/maquinas.js)
  if (cacheChaves.has(item)) return "CHAVE";
  if (DB.ITENS_CURA?.[item]) return "CURA";
  if (DB.ITENS_BATALHA?.[item]) return "BATALHA";
  if (bolaPorItem(item) || item === "master ball" || item === DB.STORY?.glitchball?.item || / ball$|bola$/.test(item)) return "BOLAS";
  if (seguravel(item)) return "SEGURAR";
  return "ITENS";
}

/** os itens da mochila que estão no bolso `bolso` (nomes, na ordem da mochila) */
export const itensNoBolso = (st, bolso) => Object.keys(st.items || {}).filter((k) => bolsoDoItem(k) === bolso);

/** os bolsos que têm alguma coisa (sempre pelo menos um) */
export function bolsosComItem(st) {
  const cheios = (DB.BOLSOS || ["ITENS"]).filter((b) => itensNoBolso(st, b).length);
  return cheios.length ? cheios : ["ITENS"];
}
