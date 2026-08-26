// SELVAGENS À VISTA.
//
// Antes disto, o mato de Kanto era um lugar vazio que às vezes cuspia uma
// batalha: o bicho não estava lá, ele ACONTECIA. Agora alguns andam pela grama
// na cara do jogador, e pisar em cima começa a batalha com AQUELE — dá pra
// escolher, pra fugir de um e ir atrás de outro, e pra ver de longe que aquela
// rota tem um bicho que você ainda não pegou.
//
// O sorteio invisível por passo (`CONFIG.encounterRate`) CONTINUA. Os dois
// convivem de propósito: um é o susto de sempre, o outro é poder escolher.
//
// Eles não entram no save. São cenário vivo: nascem quando você chega, somem
// quando você sai, e ninguém sente falta de um lagarto que estava num canto da
// ROTA 3 na terça passada.
import { DB } from "../data/index.js";
import { randRange, chance } from "../core/rng.js";

const cfg = () => DB.CONFIG?.selvagens || {};

/** Um da tabela de encontro daquele mapa, sorteado por peso. */
function daTabela(tabela) {
  const lista = (tabela || []).filter((e) => DB.SPECIES?.[e.id]);
  if (!lista.length) return null;
  const total = lista.reduce((a, e) => a + (e.w || 1), 0);
  let r = Math.random() * total;
  for (const e of lista) { r -= (e.w || 1); if (r <= 0) return e; }
  return lista[lista.length - 1];
}

/** Tenta pôr mais um no mundo. `livre(x, y)` vem da cena, que é quem conhece
 *  grama, colisão e quem já está em pé onde.
 *
 *  Ele nasce a pelo menos três tiles de você: um bicho que aparece do nada
 *  debaixo do seu pé não é um selvagem à vista, é um encontro aleatório com
 *  sprite. Você tem que ver ele antes de encostar nele. */
export function nascer(lista, jogador, tabela, livre) {
  const c = cfg();
  if (lista.length >= (c.quantos ?? 5)) return null;
  const perto = c.perto ?? 12;
  for (let tentativa = 0; tentativa < 60; tentativa++) {
    const x = jogador.x + randRange(-perto, perto);
    const y = jogador.y + randRange(-perto, perto);
    const d = Math.abs(x - jogador.x) + Math.abs(y - jogador.y);
    if (d < 3 || d > perto) continue;
    if (!livre(x, y)) continue;
    const e = daTabela(tabela);
    if (!e) return null;
    const bicho = { id: e.id, min: e.min, max: e.max, x, y, t: Math.random() * (c.passo ?? 1.2), vida: 0 };
    lista.push(bicho);
    return bicho;
  }
  return null;
}

/** Faz cada um dar o passinho dele e tira os que já foram longe demais ou
 *  velhos demais. Devolve a lista nova (os que ficaram). */
export function andar(lista, dt, jogador, livre) {
  const c = cfg();
  const passo = c.passo ?? 1.2;
  const perto = c.perto ?? 12;
  const some = c.some ?? 20;
  const vivos = [];
  for (const b of lista) {
    b.vida += dt;
    const longe = Math.abs(b.x - jogador.x) + Math.abs(b.y - jogador.y) > perto + 4;
    if (longe || b.vida > some) continue;             // some sem despedida
    b.t -= dt;
    if (b.t <= 0) {
      b.t = passo * (0.6 + Math.random() * 0.8);      // nem todos no mesmo compasso
      const [dx, dy] = [[1, 0], [-1, 0], [0, 1], [0, -1]][Math.floor(Math.random() * 4)];
      // ele não anda PRA CIMA de você: encostar é coisa que o jogador faz, não
      // ele. Selvagem que persegue vira armadilha, e a graça de ver o bicho é
      // poder desviar dele.
      const nx = b.x + dx, ny = b.y + dy;
      if (!(nx === jogador.x && ny === jogador.y) && livre(nx, ny)) { b.x = nx; b.y = ny; }
    }
    vivos.push(b);
  }
  return vivos;
}

/** Quem está em pé neste tile, ou null. */
export const emCima = (lista, x, y) => (lista || []).find((b) => b.x === x && b.y === y) || null;

/** O nível e o brilho de quem você pisou em cima. Quem monta o Pokémon é a
 *  cena, que já tem o `createMon` — aqui só sai a ficha do sorteio. */
export const sorteioDe = (b) => ({
  id: b.id,
  nivel: randRange(b.min, b.max),
  shiny: chance(DB.CONFIG?.shinyOdds ?? 0),
});

export { daTabela };
