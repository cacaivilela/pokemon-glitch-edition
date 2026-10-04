// Os ÍCONES DOS ITENS: um PNG de 16x16 por item em assets/sprites/itens/,
// desenhados por tools/itens_sprites.py. O nome do arquivo é o slug do nome
// do item ("pedra do trovão" -> pedra-do-trovao.png); a conta é a mesma do
// gerador, e os dois têm que bater.
//
// Item sem desenho próprio cai no da FAMÍLIA — o OVO DA CRECHE ("ovo de
// pichu") usa ovo.png, uma megapedra que uma DLC inventar usa megapedra.png —
// e, no fim, em item.png, a sacolinha. Enquanto o PNG não chega (ou não
// existe nenhum) o ícone é um quadradinho da arte provisória, como o resto do
// jogo faz com o que ainda não baixou.
import { url } from "./base.js";
import { loadImage } from "./sprites.js";
import { spriteFromRows } from "./assets.js";

export const LADO = 16;

export const slugItem = (nome) => String(nome).toLowerCase()
  .normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/** a família do item: o desenho que serve quando não há um só dele */
export function familiaDoItem(nome) {
  const n = String(nome).toLowerCase();
  if (n.startsWith("ovo ") || n.endsWith(" egg")) return "ovo";
  if (n.startsWith("cristal z") || /ium z$/.test(n) || n.endsWith("inium")) return "cristal-z";
  if (/(n|s|z|d|r)ita( [xy])?$/.test(n)) return "megapedra";
  if (n.startsWith("fóssil") || n.startsWith("fossil")) return "fossil";
  if (n.startsWith("pedra")) return "pedra";
  if (n.endsWith(" ball") || n.endsWith("bola") || n.endsWith("ball")) return "bola";
  if (n.startsWith("pandeiro")) return "pandeiro";
  if (n.startsWith("bilhete")) return "bilhete";
  return null;
}

// nome -> Image (ou null enquanto carrega / quando não existe)
const prontos = new Map();
const pedidos = new Set();
let provisorio = null;

function reserva() {
  if (!provisorio) {
    provisorio = spriteFromRows([
      "................",
      "................",
      "................",
      "....kkkkkkkk....",
      "...kBBBBBBBBk...",
      "..kBBAAAAAABBk..",
      "..kBAAAAAAAABk..",
      "..kBAAAAAAAABk..",
      "..kBAAAAAAAABk..",
      "..kBBAAAAAABBk..",
      "...kBBBBBBBBk...",
      "....kkkkkkkk....",
    ], { k: "#3a3040", B: "#a08868", A: "#d8c098" });
  }
  return provisorio;
}

/** O ícone do item, já carregado; null enquanto não há. Pede o PNG na
 *  primeira vez e tenta, na ordem: o dele, o da família, a sacolinha. */
export function iconeItem(nome) {
  if (prontos.has(nome)) return prontos.get(nome);
  if (!pedidos.has(nome)) {
    pedidos.add(nome);
    const fam = familiaDoItem(nome);
    const tentativas = [slugItem(nome), fam, "item"].filter((s, i, a) => s && a.indexOf(s) === i);
    (async () => {
      for (const s of tentativas) {
        const img = await loadImage(url(`assets/sprites/itens/${s}.png`));
        if (img) { prontos.set(nome, img); return; }
      }
      prontos.set(nome, null);
    })();
  }
  return null;
}

/** Desenha o ícone em (x, y), ampliado `escala` vezes. */
export function desenharItem(ctx, nome, x, y, escala = 1) {
  const img = iconeItem(nome) || reserva();
  ctx.drawImage(img, x, y, LADO * escala, LADO * escala);
}

/** pede os ícones de uma lista de nomes de uma vez (a mochila ao abrir) */
export const adiantarItens = (nomes) => { for (const n of nomes || []) iconeItem(n); };
