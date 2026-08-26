// SELVAGENS À VISTA.
//
// Antes disto, o mato de Kanto era um lugar vazio que às vezes cuspia uma
// batalha: o bicho não estava lá, ele ACONTECIA. Agora alguns andam pela grama
// na cara do jogador, e pisar em cima começa a batalha com AQUELE — dá pra
// escolher, pra fugir de um e ir atrás de outro, e pra ver de longe que aquela
// rota tem um bicho que você ainda não pegou.
//
// ENCOSTAR NELES É O ÚNICO JEITO DE COMEÇAR UMA BATALHA SELVAGEM, no mundo
// inteiro — inclusive dentro da fenda. O sorteio invisível por passo acabou: ele
// existia porque não havia o que olhar, e agora há.
//
// E ALGUNS VÊM PRA CIMA DE VOCÊ. Os BRAVOS enxergam você de longe e caminham
// até encostar; o resto anda à toa e nunca chega perto. É uma parte deles só:
// se todos atacassem, andar pela grama viraria correr de cinco perseguidores ao
// mesmo tempo, e a escolha de com quem lutar — que é a razão de eles serem
// visíveis — acabaria no mesmo dia em que nasceu.
//
// Eles não entram no save. São cenário vivo: nascem quando você chega, somem
// quando você sai, e ninguém sente falta de um lagarto que estava num canto da
// ROTA 3 na terça passada.
import { DB } from "../data/index.js";
import { randRange, chance } from "../core/rng.js";

const cfg = () => DB.CONFIG?.selvagens || {};

/** Tenta pôr mais um no mundo. `livre(x, y)` vem da cena, que é quem conhece
 *  grama, colisão e quem já está em pé onde.
 *
 *  Ele nasce a pelo menos três tiles de você: um bicho que aparece do nada
 *  debaixo do seu pé não é um selvagem à vista, é um encontro aleatório com
 *  sprite. Você tem que ver ele antes de encostar nele. */
export function nascer(lista, jogador, sortear, livre) {
  const c = cfg();
  if (lista.length >= (c.quantos ?? 5)) return null;
  const perto = c.perto ?? 12;
  for (let tentativa = 0; tentativa < 60; tentativa++) {
    const x = jogador.x + randRange(-perto, perto);
    const y = jogador.y + randRange(-perto, perto);
    const d = Math.abs(x - jogador.x) + Math.abs(y - jogador.y);
    if (d < 3 || d > perto) continue;
    if (!livre(x, y)) continue;
    // O POKÉMON É SORTEADO AQUI, NO NASCIMENTO, e não na hora da batalha. Quem
    // sorteia é o sorteador de sempre (a cena passa ele fechado num closure, e
    // decide qual: o de Kanto ou o da fenda), então tudo que a grama já dava
    // continua saindo: MISSINGNO. com o mundo quebrado, o bicho corrompido, o
    // shiny, a fusão selvagem raríssima e os lendários da fenda.
    //
    // Ele recebe o TILE porque dentro da fenda a tabela depende do terreno
    // debaixo do bicho — ar, terra ou água —, e isso só dá pra saber depois de
    // escolher onde ele vai nascer.
    //
    // E sortear antes é o que faz o que você VÊ ser o que você LUTA. Sortear na
    // hora do encostão deixaria o sprite do mato ser uma etiqueta mentirosa — e
    // a razão inteira de eles serem visíveis é poder escolher olhando.
    const enc = sortear(x, y);
    if (!enc?.mon) return null;
    const bicho = {
      mon: enc.mon, glitch: !!enc.glitch, x, y, vida: 0,
      t: Math.random() * (c.passo ?? 1.2),
      bravo: chance(c.bravos ?? 0),
    };
    lista.push(bicho);
    return bicho;
  }
  return null;
}

/** Está caçando você AGORA? Bravo, dentro do campo de visão E com caminho até
 *  você. Serve pro desenho também: quem persegue tem que dar pra ver que
 *  persegue — e quem NÃO tem como chegar não pode ficar piscando aviso do outro
 *  lado de uma cerca, porque aviso que não vira nada ensina a ignorar aviso. */
export function cacando(b, jogador) {
  if (!b?.bravo || b.travado) return false;
  return Math.abs(b.x - jogador.x) + Math.abs(b.y - jogador.y) <= (cfg().persegue ?? 5);
}

/** O PRÓXIMO PASSO do caminho mais curto até você, ou null se não existe um
 *  dentro do alcance.
 *
 *  Era um passo guloso — anda pelo eixo mais distante, se der em parede tenta o
 *  outro — e isso trava na PRIMEIRA parede: um muro de um tile entre vocês
 *  deixava o bicho parado ali, com o aviso piscando em cima, pra sempre. Busca
 *  em largura num raio curto resolve e é barata: são poucos caçadores, o raio é
 *  de cinco tiles e a conta roda uma vez por passo dele, não por quadro. */
function passoAte(b, jogador, atravessa, limite) {
  const chave = (x, y) => `${x},${y}`;
  const veio = new Map([[chave(b.x, b.y), null]]);
  const fila = [[b.x, b.y]];
  let achou = null;
  for (let i = 0; i < fila.length && !achou; i++) {
    const [x, y] = fila[i];
    if (Math.abs(x - b.x) + Math.abs(y - b.y) >= limite) continue;
    for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
      const nx = x + dx, ny = y + dy;
      const k = chave(nx, ny);
      if (veio.has(k)) continue;
      if (nx === jogador.x && ny === jogador.y) { veio.set(k, [x, y]); achou = [nx, ny]; break; }
      if (!atravessa(nx, ny)) continue;
      veio.set(k, [x, y]);
      fila.push([nx, ny]);
    }
  }
  if (!achou) return null;
  let atual = achou;                       // volta do jogador até o vizinho dele
  for (let guarda = 0; guarda < 400; guarda++) {
    const pai = veio.get(chave(atual[0], atual[1]));
    if (!pai) return null;
    if (pai[0] === b.x && pai[1] === b.y) return atual;
    atual = pai;
  }
  return null;
}

/** Faz cada um dar o passinho dele e tira os que já foram longe demais ou
 *  velhos demais.
 *
 *  Devolve `{ vivos, encostou }` — `encostou` é o bravo que chegou em você
 *  neste quadro, se algum chegou.
 *
 *  SÃO DOIS TESTES DE TILE, e não um. `livre` é onde um selvagem MORA: grama
 *  alta, e só. `atravessa` é onde um bravo PASSA enquanto caça: qualquer chão
 *  que dê pra pisar. Com um teste só, o bravo travava na beira do mato — bastava
 *  você estar do outro lado do caminho de terra pra ele parar ali, com o aviso
 *  piscando em cima, sem nunca chegar. Perseguidor que não alcança não é
 *  ameaça, é enfeite. */
export function andar(lista, dt, jogador, livre, atravessa = livre) {
  const c = cfg();
  const passo = c.passo ?? 1.2;
  const perto = c.perto ?? 12;
  const some = c.some ?? 20;
  const vivos = [];
  let encostou = null;
  for (const b of lista) {
    b.vida += dt;
    const dist = Math.abs(b.x - jogador.x) + Math.abs(b.y - jogador.y);
    // O BRAVO NÃO ENVELHECE ENQUANTO CAÇA. Sem isto ele evaporava no meio da
    // perseguição, e sumir na cara de quem estava fugindo é pior do que nunca
    // ter vindo: a fuga deixa de significar alguma coisa.
    // `travado` é recalculado a cada passo dele; enquanto isso ele conta como
    // bravo pra decidir SE tenta, e só o resultado da busca é que diz se dá
    const caca = b.bravo && dist <= (c.persegue ?? 5);
    if (caca && !b.travado) b.vida = 0;
    if (dist > perto + 4 || b.vida > some) continue;   // some sem despedida
    b.t -= dt;
    if (b.t <= 0) {
      if (caca) {
        b.t = passo * (c.pressa ?? 0.55);
        const alvo = passoAte(b, jogador, atravessa, (c.persegue ?? 5) + 2);
        // sem caminho: ele desiste de caçar (e para de piscar o aviso) até você
        // dar a volta e abrir passagem
        b.travado = !alvo;
        if (alvo) {
          if (alvo[0] === jogador.x && alvo[1] === jogador.y) encostou = encostou || b;
          else { b.x = alvo[0]; b.y = alvo[1]; }
        }
      } else {
        b.t = passo * (0.6 + Math.random() * 0.8);     // nem todos no mesmo compasso
        const [dx, dy] = [[1, 0], [-1, 0], [0, 1], [0, -1]][Math.floor(Math.random() * 4)];
        // o manso não anda PRA CIMA de você: encostar nele é coisa que você faz
        const nx = b.x + dx, ny = b.y + dy;
        if (!(nx === jogador.x && ny === jogador.y) && livre(nx, ny)) { b.x = nx; b.y = ny; }
      }
    }
    vivos.push(b);
  }
  return { vivos, encostou };
}

/** Quem está em pé neste tile, ou null. */
export const emCima = (lista, x, y) => (lista || []).find((b) => b.x === x && b.y === y) || null;

/** O encontro que aquele bicho vira. Ele já nasceu pronto — isto só embrulha. */
export const encontroDe = (b) => ({ mon: b.mon, glitch: b.glitch });
