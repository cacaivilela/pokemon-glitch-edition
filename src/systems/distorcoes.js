// AS DISTORÇÕES, por dentro. As tabelas estão em src/data/distorcoes.js.
//
// Existe SEMPRE EXATAMENTE UMA no mundo. Quando o prazo vence, a antiga fecha e
// a nova abre em outro canto — nunca zero, nunca duas. Zero deixaria o jogador
// esperando sem saber o quê; duas tirariam a graça de correr até a que abriu.
//
// Ela mora no save (`st.distorcao`), então sobrevive a fechar o jogo, e o prazo
// é de RELÓGIO e não de passos: uma coisa que acontece "de cinco em cinco
// minutos" tem que acontecer também pra quem parou pra ler a Pokédex.
import { DB } from "../data/index.js";
import { randRange } from "../core/rng.js";

const cfg = () => DB.DISTORCOES || {};

/** Os mapas onde ela pode abrir: os de fora, com mato, que não estão na lista
 *  de exceções. Montado uma vez e guardado — a lista não muda em jogo. */
let mapasBons = null;
export function mapasPossiveis() {
  if (mapasBons) return mapasBons;
  const fora = new Set(cfg().fora || []);
  mapasBons = Object.entries(DB.KANTO || {})
    .filter(([id, geo]) => {
      if (fora.has(id) || !geo?.tags) return false;
      if (DB.MAPS?.[id]?.interior) return false;
      return geo.tags.includes(String(DB.TAG.GRASS));
    })
    .map(([id]) => id);
  return mapasBons;
}

/** Um tile de mato daquele mapa, ou null. */
function tileDeMato(mapa) {
  const geo = DB.KANTO?.[mapa];
  if (!geo?.tags) return null;
  const alvo = String(DB.TAG.GRASS);
  for (let tentativa = 0; tentativa < 400; tentativa++) {
    const x = randRange(1, geo.w - 2), y = randRange(1, geo.h - 2);
    if (geo.tags[y * geo.w + x] !== alvo) continue;
    // com vizinho livre dos dois lados: ela não vale nada encravada numa fresta
    const livre = [[1, 0], [-1, 0], [0, 1], [0, -1]]
      .filter(([dx, dy]) => "02".includes(geo.tags[(y + dy) * geo.w + (x + dx)])).length;
    if (livre >= 3) return { x, y };
  }
  return null;
}

/** Abre uma nova em algum canto de Kanto. Devolve `{ map, x, y, ate }`. */
export function abrirDistorcao(st, evitar = null) {
  const mapas = mapasPossiveis();
  if (!mapas.length) return null;
  for (let tentativa = 0; tentativa < 30; tentativa++) {
    const mapa = mapas[Math.floor(Math.random() * mapas.length)];
    // não repete o mapa da anterior: trocar de lugar é o ponto
    if (mapas.length > 1 && mapa === evitar) continue;
    const tile = tileDeMato(mapa);
    if (!tile) continue;
    st.distorcao = { map: mapa, x: tile.x, y: tile.y,
                     ate: Date.now() + (cfg().intervalo ?? 5) * 60000 };
    return st.distorcao;
  }
  return null;
}

/** A distorção de agora. Se o prazo venceu, ela mesma abre a próxima — quem
 *  pergunta primeiro é quem faz a troca, então não existe "esqueceram de
 *  fechar" nem timer solto em lugar nenhum.
 *
 *  Devolve `{ atual, trocou }`: `trocou` é a nova, quando acabou de trocar, e é
 *  ela que o aviso usa. */
export function distorcaoDeAgora(st) {
  if (!st) return { atual: null, trocou: null };
  const antes = st.distorcao;
  if (antes && Date.now() < antes.ate) return { atual: antes, trocou: null };
  const nova = abrirDistorcao(st, antes?.map);
  return { atual: nova, trocou: nova };
}

/** Ela está neste mapa agora? */
export function distorcaoAqui(st, mapa) {
  const d = st?.distorcao;
  return d && d.map === mapa ? d : null;
}

/** O nome bonito do lugar onde a atual abriu, pro aviso e pro cientista. */
export const ondeEla = (st) =>
  (st?.distorcao && DB.MAPS?.[st.distorcao.map]?.name) || "ALGUM LUGAR";
