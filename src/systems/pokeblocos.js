import { PESO_MAXIMO } from "../data/pesos.js";
// As contas dos POKÉBLOCOS (os dados estão em src/data/pokeblocos.js):
// misturar as berries num pokébloco e o que ele faz com um POKÉMON SELVAGEM na
// batalha.
import { DB } from "../data/index.js";
import { recalc } from "./mon.js";
import { pesoDe } from "./habilidades.js";

const P = () => DB.POKEBLOCOS;

/** As berries da mochila que vão no liquidificador: [nome, quantas] */
export function berriesNaMochila(st) {
  return Object.keys(P().BERRIES_SABOR).filter((b) => (st.items?.[b] || 0) > 0).map((b) => [b, st.items[b]]);
}

/** O POKÉBLOCO que sai de `berries` (nomes, até 4) batidas com `qualidade`
 *  (0 a 1, o quanto você acertou o ritmo). Cada sabor é a soma das berries,
 *  menos 2 por berry (o liquidificador come um pouco); o ritmo multiplica
 *  (0,6x errando tudo, 1,4x acertando tudo). A RESISTÊNCIA e o PESO vêm da
 *  dureza e do peso das berries (src/data/pokeblocos.js). */
export function misturar(berries, qualidade = 0.5) {
  const { BERRIES_SABOR, COR_DO_SABOR, COR_MISTA } = P();
  const n = berries.length;
  const mult = 0.6 + 0.8 * Math.max(0, Math.min(1, qualidade));
  // a mesma berry duas vezes estraga tudo: PRETO, fraquinho em tudo
  const repetida = new Set(berries).size < n;
  let sabor;
  if (repetida) sabor = [2, 2, 2, 2, 2];
  else {
    sabor = [0, 0, 0, 0, 0];
    for (const b of berries) BERRIES_SABOR[b].sabor.forEach((v, i) => { sabor[i] += v; });
    sabor = sabor.map((v) => (v > 0 ? Math.max(1, Math.round((v - 2 * n) * mult)) : 0));
  }
  const tem = sabor.map((v, i) => [v, i]).filter(([v]) => v > 0).sort((a, b) => b[0] - a[0]);
  let cor;
  if (repetida) cor = "preto";
  else if (tem.length === 1) cor = COR_DO_SABOR[tem[0][1]];
  else if (tem.length === 2) cor = COR_MISTA[tem[0][1]];
  else cor = tem[0][0] >= 50 ? "dourado" : "cinza";
  // a RESISTÊNCIA (quantos turnos ele dura sendo mastigado): a dureza das
  // berries, mais um se o ritmo foi bom; o PESO: o das berries
  const resistencia = berries.reduce((a, b) => a + (BERRIES_SABOR[b].dureza ?? 1), 0) + (qualidade >= 0.75 ? 1 : 0);
  const peso = berries.reduce((a, b) => a + (BERRIES_SABOR[b].peso ?? 1), 0);
  return { cor, sabor, resistencia, peso, nivel: tem.length ? tem[0][0] : 0 };
}

// ------------------------------------------------------------ na batalha
//
// O que o pokébloco faz com o SELVAGEM fica no próprio Pokémon dele, em campos
// que só valem nesta batalha (somem se ele for embora; se for pego, viram a
// marca, o peso e a defesa): `_isca` (o boost de captura e os turnos que
// faltam), `_barriga` (o peso que ele já comeu), `_gordo` e `_pesados` (quantos
// pokéblocos pesados ele comeu).

/** O selvagem `foe` come o pokébloco `b`. `fStages`: os estágios de atributo
 *  dele na batalha (o pesado sobe a DEFESA). Devolve { falas, pesado } — ou
 *  null se ele já está gordo e não come mais. */
export function darAoSelvagem(foe, b, fStages) {
  const { BATALHA: B, CORES, POKEBLOCO_TEXTO: T } = P();
  if (foe._gordo) return null;
  const nome = foe.nickname;
  const falas = [T.jogou.replace("{COR}", CORES[b.cor].nome), T.comeu.replace("{MON}", nome)];
  const mult = Math.min(B.captura.max, 1 + b.nivel / B.captura.porForca);
  const turnos = 1 + (b.resistencia ?? 1);
  const pesado = (b.peso ?? 0) >= B.pesado;
  // o efeito novo fica no lugar do de antes, ficando com o mais forte e o mais longo
  const antes = foe._isca;
  foe._isca = {
    mult: Math.max(mult, antes?.turnos > 0 ? antes.mult : 1),
    turnos: Math.max(turnos, antes?.turnos || 0),
    pesado: pesado || !!(antes?.turnos > 0 && antes.pesado),
  };
  falas.push(turnos >= 5 ? T.duro : T.mole);
  if (pesado) {
    foe._pesados = (foe._pesados || 0) + 1;
    if (fStages) fStages.def = Math.min(6, (fStages.def || 0) + 1);
    falas.push(T.pesado.replace("{MON}", nome));
  }
  foe._barriga = (foe._barriga || 0) + (b.peso ?? 1);
  if (foe._barriga > barrigaDe(foe)) {
    foe._gordo = true;
    falas.push(T.gordo.replace("{MON}", nome));
  }
  return { falas, pesado };
}

/** Quanto peso de pokébloco cabe na barriga de `mon`: bicho grande aguenta mais */
export function barrigaDe(mon) {
  const { barriga } = P().BATALHA;
  return Math.min(barriga.max, barriga.base + pesoDe(mon.species) / barriga.porKg);
}

/** O multiplicador de captura dos pokéblocos: o boost enquanto ele come, e o
 *  castigo de quando ele ficou gordo */
export function fatorPokebloco(mon) {
  const B = P()?.BATALHA;
  if (!B || !mon) return 1;
  return (mon._isca?.turnos > 0 ? mon._isca.mult : 1) * (mon._gordo ? B.gordo : 1);
}

/** Um turno a menos de efeito. Devolve a fala de quando ele terminou de comer. */
export function passaTurnoPokebloco(mon) {
  if (!(mon?._isca?.turnos > 0)) return null;
  mon._isca.turnos -= 1;
  if (mon._isca.turnos > 0) return null;
  return P().POKEBLOCO_TEXTO.acabou.replace("{MON}", mon.nickname);
}

/** Ele está mais largo agora? (pokébloco pesado com o efeito valendo) */
export const largoDoPokebloco = (mon) => !!(mon?._isca?.turnos > 0 && mon._isca.pesado);

/** Pego: quem comeu pokébloco pesado ganha a MARCA no nome, o peso a mais e a
 *  defesa que sobe mais rápido (src/systems/mon.js, `recalc`). Os campos da
 *  batalha somem. Devolve a fala (ou null). */
export function aoCapturar(mon) {
  const { BATALHA: B, POKEBLOCO_TEXTO: T } = P();
  const pesados = mon._pesados || 0;
  for (const k of ["_isca", "_barriga", "_gordo", "_pesados"]) delete mon[k];
  if (!pesados) return null;
  mon.garfo = true;
  mon.pesoExtra = (mon.pesoExtra || 0) + pesados * B.pesoExtra;
  if (!mon.nickname.endsWith(B.marca)) mon.nickname += B.marca;
  recalc(mon);
  return T.marca.replace("{MON}", mon.nickname);
}

/** O peso de um Pokémon de verdade: o da espécie mais o que os pokéblocos
 *  pesados deram a ele */
export const pesoDoMon = (mon) => Math.min(PESO_MAXIMO, pesoDe(mon.species) + (mon.pesoExtra || 0));
