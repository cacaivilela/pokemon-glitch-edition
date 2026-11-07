// OS DOCES DO ALCREMIE — as regras (os dados estão em src/data/doces.js).
//
// AS CORES NO SEED: o creme de cada ALCREMIE fica no valor de personalidade
// dele, como as manchas do SPINDA — assim todo lugar que desenha um bicho
// pelo (espécie, seed) já pinta certo, sem campo novo pra carregar. O seed
// marcado começa com 0xA1C (as 12 casas de cima) e embaixo guarda até 3 cores,
// 5 bits cada (0 = nenhuma; 1 a 31 = a posição em DOCES + 1). Seed sem a
// marca = o ALCREMIE de sempre, de creme branco.
import { DB } from "../data/index.js";

const MARCA = 0xa1c;

/** as cores (os doces, em ordem) que o seed guarda; [] = creme branco */
export function docesDoSeed(seed) {
  const s = (seed ?? 0) >>> 0;
  if (s >>> 20 !== MARCA) return [];
  const lista = DB.DOCES || [];
  const out = [];
  for (let i = 0; i < 3; i++) {
    const k = (s >>> (i * 5)) & 31;
    if (k && lista[k - 1]) out.push(lista[k - 1]);
  }
  return out;
}

/** o seed que guarda esses doces (lista de itens de DB.DOCES) */
export function seedDosDoces(doces) {
  const lista = DB.DOCES || [];
  let s = MARCA << 20;
  doces.slice(0, 3).forEach((d, i) => {
    const k = lista.indexOf(d) + 1;
    if (k > 0) s |= k << (i * 5);
  });
  return s >>> 0;
}

export const doceDoItem = (item) => (DB.DOCES || []).find((d) => d.item === item) || null;
export const doceDaCor = (cor) => (DB.DOCES || []).find((d) => d.cor === cor) || null;

/** A RECEITA (os doces do Brasil): as berries batidas são EXATAMENTE as da
 *  receita de algum doce, em qualquer ordem? Devolve o doce, ou null. */
export function doceDaReceita(berries) {
  const tem = [...berries].sort().join("|");
  return (DB.DOCES || []).find((d) => d.receita && [...d.receita].sort().join("|") === tem) || null;
}

/** A COR DO CREME num ponto do corpo (u, v de 0 a 1, dentro do contorno do
 *  bicho): a do doce, ou a do PADRÃO dele — o granulado do BRIGADEIRO, as
 *  sementes do MARACUJÁ, a BANDEIRA do DOCE BRASILEIRO. [r, g, b] */
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export function corDoCreme(doce, u, v, x, y) {
  if (doce.padrao === "granulado" && (x * 5 + y * 11) % 13 === 0) return [58, 32, 16];
  if (doce.padrao === "sementes" && (x * 7 + y * 13) % 17 === 0) return [40, 24, 12];
  if (doce.padrao === "bandeira") {
    // o losango amarelo e o círculo azul no meio do corpo, com a faixa branca
    // (o centro fica na BARRIGA, abaixo da cara: no meio, o azul cobria o rosto)
    const du = (u - 0.5) / 0.42, dv = (v - 0.74) / 0.3;
    const r = Math.hypot(du * 0.42, dv * 0.3);
    if (r < 0.1) {
      const faixa = Math.abs(dv * 0.3 - du * 0.42 * 0.35 + 0.01) < 0.02;
      return faixa ? [250, 250, 250] : [40, 70, 180];
    }
    if (Math.abs(du) + Math.abs(dv) < 1) return [250, 220, 40];
    return [40, 160, 70];
  }
  return hex(doce.creme);
}

/** O ALCREMIE COME UM DOCE: a cor entra no redemoinho (a mais antiga sai
 *  quando passa do máximo). Devolve { cores, saiu } pra fala. */
export function comerDoce(mon, doce) {
  const max = DB.DOCES_MAX || 3;
  const agora = [...docesDoSeed(mon.seed), doce];
  const saiu = agora.length > max ? agora.shift() : null;
  mon.seed = seedDosDoces(agora);
  return { cores: agora, saiu };
}
