// A PONTE DE VINHA (pedido do CAIO, nov/2026: "o golpe energia da natureza
// pode fazer pontes de vinha"). Um tile de 16x16, PIXEL POR PIXEL: duas vinhas
// grossas nas beiradas, as tábuas trançadas de cipó no meio e umas folhas.
// Desenhada deitada (pra atravessar indo pros lados); de pé é a mesma girada.
import { spriteFromRows } from "./assets.js";

const CORES = { k: "#183010", V: "#2f7a28", v: "#58b040", l: "#a0e070", t: "#7a5a28", T: "#a88040", s: "#4a3418" };
const DEITADA = [
  "kkkkkkkkkkkkkkkk",
  "VvVlVvVVvVlVvVVv",
  "vVvVvlvVvVvVvlvV",
  "kkkkkkkkkkkkkkkk",
  "sTTtsTTtsTTtsTTt",
  "sTttsTttsTttsTtt",
  "sTttsTltsTttsTtt",
  "stttstltstttsttt",
  "sTttsTttsTttsTtt",
  "sTttsTttsTtlsTtt",
  "sTttsTttsTtlsTtt",
  "stttstttstttsttt",
  "kkkkkkkkkkkkkkkk",
  "VvVVvVlVvVVvVlVv",
  "vVlVvVvVvlVvVvVV",
  "kkkkkkkkkkkkkkkk",
];
const DE_PE = DEITADA[0].split("").map((_, x) => DEITADA.map((r) => r[x]).join(""));

let cache = null;
export function tilePonte(dePe) {
  cache ||= { d: spriteFromRows(DEITADA, CORES), p: spriteFromRows(DE_PE, CORES) };
  return dePe ? cache.p : cache.d;
}
