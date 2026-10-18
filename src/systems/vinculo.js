// O FENÔMENO DE VÍNCULO — a parte viva. Os dados (quem pode, números, textos)
// estão em src/data/vinculo.js.
//
// Virar a forma de vínculo é o mesmo caminho da MEGA: troca a espécie e guarda
// a de sempre em `mon.megaDe`; o fim da luta (src/systems/mega.js
// `reverterTudo`) devolve. Por isso também é uma vez por Pokémon por luta: quem
// já tem `megaDe` não vira de novo.
import { DB } from "../data/index.js";
import { recalc, amizade } from "./mon.js";

const V = () => DB.VINCULO;
const generoDe = (st) => (st?.player?.genero === "menina" ? "menina" : "menino");
/** quem treina: CAIO/LARA em BRAGLITCH, VERMELHO/FOLHA em KANTO */
export function treinadorDe(st) {
  const menina = generoDe(st) === "menina";
  if (st?.regiao === "braglitch") return menina ? "lara" : "caio";
  return menina ? "leaf" : "red";
}
const formaDe = (st, mon) => mon.species + "vinculo" + treinadorDe(st);

/** a espécie desse Pokémon é do vínculo de quem joga? (cada treinador tem a sua lista) */
export function ehDoVinculo(st, mon) {
  if (!mon || !V()) return false;
  return V().especies[treinadorDe(st)].includes(mon.megaDe || mon.species);
}

/** o golpe é o mais forte que ele sabe? (o de maior poder; empate vale) */
export function ehGolpeMaisForte(mon, moveId) {
  const poder = (id) => DB.MOVES[id]?.power || 0;
  const maior = Math.max(0, ...(mon?.moves || []).map((m) => poder(m.id)));
  return maior > 0 && poder(moveId) === maior;
}

/** Vira AGORA, usando este golpe? */
export function podeVirar(st, mon, moveId) {
  return ehDoVinculo(st, mon) && !mon.megaDe && mon.hp > 0
    && (mon.amizade || 0) >= V().precisa
    && ehGolpeMaisForte(mon, moveId)
    && !!DB.SPECIES[formaDe(st, mon)];
}

/** Troca pra forma de vínculo. Devolve as falas da batalha, ou null. */
export function virarVinculo(st, mon) {
  const de = mon.species, para = formaDe(st, mon);
  if (!DB.SPECIES[para]) return null;
  mon.megaDe = de;
  mon.species = para;
  recalc(mon);
  mon.hp = Math.min(mon.hp, mon.maxHp);
  const T = V().textos, nome = V().treinadores[treinadorDe(st)].nome;
  const falas = [
    T.sintonia.replace("{MON}", mon.nickname).replace("{NOME}", nome),
    T.virou.replace("{MON}", mon.nickname).replace("{NOME}", nome).replace("{ESPECIE}", DB.SPECIES[de].name),
  ];
  // tipo novo (o CAIO-GRENINJA vira ÁGUA/ELÉTRICO): a batalha avisa
  const antes = DB.SPECIES[de].types.join("/"), depois = DB.SPECIES[para].types.join("/");
  if (antes !== depois) falas.push(T.tipo.replace("{MON}", mon.nickname).replace("{TIPOS}", depois));
  const cod = DB.SPECIES[para].codinome;
  if (cod) falas.splice(2, 0, T.codinome.replace("{CODINOME}", cod));
  return falas;
}

/** a cor da aura (rgb) de quem joga */
export const corDoVinculo = (st) => V()?.treinadores[treinadorDe(st)]?.cor || [255, 255, 255];

/** As TÉCNICAS: sobem a amizade passando do máximo. Só pros do vínculo de
 *  quem joga. Devolve a frase, ou null se não serviu. */
function tecnica(st, mon, ganho, texto) {
  if (!ehDoVinculo(st, mon)) return null;
  const antes = mon.amizade || 0;
  if (antes >= V().teto) return null;
  const agora = amizade(mon, ganho, true);
  const linhas = [V().textos[texto].replace("{MON}", mon.nickname).replace("{AMZ}", agora).replace("{TETO}", V().teto)];
  if (antes < V().precisa && agora >= V().precisa) linhas.push(V().textos.pronto.replace("{MON}", mon.nickname));
  return linhas;
}

/** AGUENTOU JUNTO: venceu a luta com ele em campo e no fim do HP */
export function aguentouJunto(st, mon) {
  if (!mon || mon.hp <= 0 || mon.hp > mon.maxHp * V().aguentou.fracao) return null;
  return tecnica(st, mon, V().aguentou.ganho, "aguentou");
}

/** a vitória fica marcada nele: o CARINHO DA VITÓRIA vale por uns segundos */
export function marcarVitoria(mon) {
  if (mon) mon.venceuEm = Date.now();
}

/** CARINHO DA VITÓRIA: falar com ele logo depois de vencer. Uma vez por vitória. */
export function carinhoDaVitoria(st, mon) {
  if (!mon?.venceuEm || Date.now() - mon.venceuEm > V().carinho.segundos * 1000) return null;
  delete mon.venceuEm;
  return tecnica(st, mon, V().carinho.ganho, "carinho");
}

/** CRISTAL DO VÍNCULO: usado pela mochila. Devolve { linhas, gastou }. */
export function usarCristal(st, mon) {
  const T = V().textos;
  if (!ehDoVinculo(st, mon)) {
    return { gastou: false, linhas: [`O CRISTAL NÃO BRILHOU COM ${mon.nickname}. O VÍNCULO DELE NÃO É ESSE.`] };
  }
  if ((mon.amizade || 0) >= V().teto) return { gastou: false, linhas: [T.cristalCheio.replace("{MON}", mon.nickname)] };
  return { gastou: true, linhas: tecnica(st, mon, V().cristal.ganho, "cristal") };
}
