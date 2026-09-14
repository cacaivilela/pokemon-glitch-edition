// AS REGRAS DO ANIVERSÁRIO. Este arquivo não desenha nada e não fala com o
// jogador: ele responde "que dia é hoje", "já passou?", "o que cabe nesta
// bola?" — e a cena (src/scenes/overworld.js) faz a caixa de texto.
//
// A data mora no SAVE, em `player.aniversario`, no formato "MM-DD". Ela não vai
// pro localStorage junto com idioma e velocidade (src/core/opcoes.js) de
// propósito: aquilo é preferência de quem está na frente da tela, isto é uma
// coisa que o jogo SABE sobre a sua partida — e o presente que sai dela é
// gravado no mesmo arquivo.
//
// Os textos e os números ficam em src/data/aniversario.js, com hot-swap.
import { DB } from "../data/index.js";
import { LENDARIOS } from "../data/leilao.js";
import { createMon } from "./mon.js";
import { pick, clamp } from "../core/rng.js";

const cfg = () => DB.ANIVERSARIO || {};
const txt = () => DB.ANIVERSARIO_TEXTO || {};

// ------------------------------------------------------------------- a data

/** Quantos dias tem cada mês. FEVEREIRO aqui vale 29: quem nasceu no dia 29
 *  tem que conseguir DIGITAR o dia 29, mesmo num ano em que ele não existe. O
 *  que fazer nesses anos é problema de `noAno`, logo abaixo, e não do teclado. */
export const DIAS_NO_MES = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** "MM-DD" é uma data que este jogo aceita? */
export function valida(data) {
  if (typeof data !== "string" || !/^\d{2}-\d{2}$/.test(data)) return false;
  const [m, d] = data.split("-").map(Number);
  return m >= 1 && m <= 12 && d >= 1 && d <= DIAS_NO_MES[m - 1];
}

export const guarda = (mes, dia) =>
  `${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

/** "03-14" -> { mes: 3, dia: 14 } */
export function partes(data) {
  if (!valida(data)) return null;
  const [mes, dia] = data.split("-").map(Number);
  return { mes, dia };
}

/** Como a data aparece na tela: "14 DE MAR". */
export function formata(data) {
  const p = partes(data);
  if (!p) return txt().naoDefinido || "---";
  const meses = txt().meses || [];
  return `${p.dia} DE ${meses[p.mes - 1] || p.mes}`;
}

/** A data que está gravada nesta partida (ou null). */
export function definido(st) {
  const d = st?.player?.aniversario;
  return valida(d) ? d : null;
}

export function definir(st, data) {
  if (!st?.player || !valida(data)) return false;
  st.player.aniversario = data;
  return true;
}

// --------------------------------------------------------------- o calendário

const meiaNoite = (quando) => {
  const d = new Date(quando);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

/** O dia MM-DD dentro de um ano.
 *
 *  29 DE FEVEREIRO. Quem nasceu nele faz aniversário três anos em cada quatro
 *  em que o calendário não tem o dia. O jogo não vai fingir que a pessoa não
 *  nasceu: nesses anos o aniversário cai no dia 28. Sem isto, `new Date(2025,
 *  1, 29)` escorrega sozinho pro dia 1 de março — e o presente chegaria no mês
 *  errado, calado. */
function noAno(ano, mes, dia) {
  const d = new Date(ano, mes - 1, dia);
  if (d.getMonth() === mes - 1) return d;
  return new Date(ano, mes, 0);     // dia 0 do mês seguinte = último dia deste
}

/** A ÚLTIMA vez que este aniversário passou, contada de hoje pra trás.
 *
 *  - `ano`   o ano DAQUELA passagem, que é o que fica gravado no save. Não é o
 *            ano de hoje: um aniversário em 31 de dezembro resgatado no dia 1
 *            de janeiro ainda é o presente do ano passado, e marcar o ano de
 *            hoje daria dois presentes em dois dias.
 *  - `dias`  0 é hoje, 1 é ontem, e assim por diante.
 */
export function ultimaVirada(data, quando = new Date()) {
  const p = partes(data);
  if (!p) return null;
  const hj = meiaNoite(quando);
  let ano = hj.getFullYear();
  let d = noAno(ano, p.mes, p.dia);
  if (d > hj) d = noAno(--ano, p.mes, p.dia);
  // o fuso muda de hora no meio do ano (horário de verão): a divisão não sai
  // inteira, e é por isso que o arredondamento está aqui
  return { ano, data: d, dias: Math.round((hj - d) / 86400000) };
}

/** Quantos dias FALTAM pro próximo (0 = é hoje). Só serve pra mostrar nas
 *  opções — quem decide o presente é `podeGanhar`. */
export function faltam(data, quando = new Date()) {
  const v = ultimaVirada(data, quando);
  if (!v) return null;
  if (v.dias === 0) return 0;
  const hj = meiaNoite(quando);
  const p = partes(data);
  let prox = noAno(hj.getFullYear(), p.mes, p.dia);
  if (prox <= hj) prox = noAno(hj.getFullYear() + 1, p.mes, p.dia);
  return Math.round((prox - hj) / 86400000);
}

// ---------------------------------------------------------------- o presente

/** O ano do último presente entregue (ou null). */
export const ultimoAno = (st) => {
  const n = Number(st?.flags?.aniversario);
  return Number.isFinite(n) && n > 0 ? n : null;
};

/** Tem presente esperando AGORA? Devolve `{ ano, dias }` ou null.
 *
 *  `dias` sai junto porque a fala muda: chegar no dia é "FELIZ ANIVERSÁRIO", e
 *  chegar dois dias depois é um pacote amassado de tanto esperar. */
export function pendente(st, quando = new Date()) {
  const data = definido(st);
  if (!data) return null;
  const v = ultimaVirada(data, quando);
  if (!v) return null;
  if (v.dias > Math.max(0, cfg().janelaDias ?? 0)) return null;   // passou da janela
  if (ultimoAno(st) === v.ano) return null;                        // deste ano você já ganhou
  return { ano: v.ano, dias: v.dias };
}

export function marcarGanho(st, ano) {
  if (!st) return;
  (st.flags ||= {}).aniversario = ano;
}

// ----------------------------------------------------------- o que cabe na bola

/** Espécie que pode sair da bola de aniversário.
 *
 *  Fica de fora o que não é "um Pokémon do tipo X" e sim outra coisa: os
 *  LENDÁRIOS (ganhar um de graça todo ano acaba com a caçada deles), as formas
 *  MEGA e as FUSÕES (não são espécies que se ganham — são estados de uma
 *  espécie que você já tem) e o PIKACHU DE BONÉ, que é troféu de outra coisa. */
export function elegivel(sp) {
  if (!sp?.id || !sp.types?.length) return false;
  if (LENDARIOS.has(sp.id)) return false;
  if (sp.megaDe || sp.crescimento) return false;
  if (DB.EH_BONE?.has(sp.id)) return false;
  return !(cfg().fora || []).includes(sp.id);
}

/** Todas as espécies daquele tipo que podem vir no pacote. */
export function elegiveis(tipo) {
  return Object.values(DB.SPECIES || {})
    .filter((sp) => elegivel(sp) && sp.types.includes(tipo));
}

/** Os tipos que o pacote oferece: os do jogo, menos os que estão de fora e
 *  menos os que não têm nenhuma espécie pra entregar. Oferecer um tipo que
 *  devolve uma bola vazia é oferecer um erro. */
export function tipos() {
  const fora = cfg().tiposFora || [];
  return (DB.TYPES || []).filter((t) => !fora.includes(t) && elegiveis(t).length > 0);
}

/** TODO golpe que alguma espécie do jogo aprende.
 *
 *  Serve pra separar golpe de GOLPE Z. A tabela `DB.MOVES` tem os dois juntos —
 *  o motor de batalha procura tudo por id no mesmo lugar — e o Z é o teto do
 *  jogo (180, e o do PIKACHU DE BONÉ chega a 195). Sem este filtro, "o golpe
 *  mais bombado do tipo ELÉTRICO" seria o 10.000.000 DE VOLTS, que não se
 *  aprende: ele sai do CRISTAL Z, uma vez por batalha (src/data/zcristais.js).
 *
 *  A conta é "quem alguém aprende", e não uma lista de exceções escrita à mão,
 *  porque assim um golpe Z novo já nasce de fora sem ninguém lembrar disto. */
let _aprendiveis = null, _fonte = null;
export function aprendiveis() {
  if (_aprendiveis && _fonte === DB.SPECIES) return _aprendiveis;
  const s = new Set();
  for (const sp of Object.values(DB.SPECIES || {})) {
    for (const [, id] of sp.learnset || []) s.add(id);
  }
  _fonte = DB.SPECIES;
  return (_aprendiveis = s);
}

/** O golpe mais forte de uma lista de ids, ignorando os que ele já sabe. */
function oMaisForte(ids, jaSabe) {
  let melhor = null, poder = 0;
  for (const id of ids) {
    if (jaSabe.includes(id)) continue;
    const mv = DB.MOVES?.[id];
    if (!mv || mv.z || !(mv.power > poder)) continue;
    melhor = id; poder = mv.power;
  }
  return melhor;
}

/** O GOLPE MAIS BOMBADO que este bicho pode ganhar, sem olhar nível nenhum. Em
 *  dois degraus, e o segundo existe por um motivo concreto:
 *
 *  1. O MAIS FORTE DOS TIPOS DELE, se ele ainda não souber E se ele for bombado
 *     de verdade (`poderMinimo`, em src/data/aniversario.js). É o presente que
 *     faz sentido: o golpe da casa dele, cedo demais.
 *  2. Senão, O MAIS FORTE DO JOGO que ele ainda não sabe, de qualquer tipo. Este jogo tem learnset automático de QUATRO golpes que
 *     fecha no nível 16, e o quarto é justamente o mais forte do tipo — então,
 *     no nível em que o presente chega, quase toda espécie JÁ SABE o degrau 1, e
 *     sozinho ele entregaria um Pokémon comum. Um TERREMOTO num CHARMANDER não
 *     é o golpe da casa dele: é exatamente por isso que é presente.
 *
 *  O degrau 1 olha o TETO do tipo, e não o que sobrou dele. Olhando a sobra, um
 *  VILEPLUME que já sabe FOLHA NAVALHA (55) ganhava ÁCIDO (40) de aniversário —
 *  o segundo melhor golpe da casa dele não é bombado coisa nenhuma.
 *
 *  Golpe de tipo GLITCH fica de fora dos dois: aquilo sobe a corrupção do save
 *  (src/data/moves.js) e não é coisa que se dá de aniversário sem avisar.
 *
 *  Golpe Z também: aquilo sai do CRISTAL Z, uma vez por batalha, e não é coisa
 *  que um Pokémon "sabe" — é o `aprendiveis()` aqui em cima que os separa. */
export function golpeBombado(especieId, jaSabe = []) {
  const sp = DB.SPECIES?.[especieId];
  if (!sp?.types) return null;
  const podem = [...aprendiveis()].filter((id) => DB.MOVES?.[id]?.type !== "GLITCH");
  const doTipo = new Set((sp.learnset || []).map(([, id]) => id));
  for (const id of podem) {
    if (sp.types.includes(DB.MOVES[id].type)) doTipo.add(id);
  }
  const piso = cfg().poderMinimo ?? 0;
  const teto = oMaisForte(doTipo, []);
  const daCasa = teto && !jaSabe.includes(teto) ? teto : null;
  if (daCasa && (DB.MOVES[daCasa]?.power || 0) >= piso) return daCasa;
  return oMaisForte(podem, jaSabe) || daCasa;
}

/** Põe o golpe no bicho. Com espaço, ele entra; sem espaço, ele toma o lugar do
 *  mais fraco — nunca o de um golpe mais forte que ele. */
export function ensinar(mon, golpeId) {
  const mv = DB.MOVES?.[golpeId];
  if (!mon || !mv) return false;
  if (mon.moves.some((m) => m.id === golpeId)) return false;
  const novo = { id: golpeId, pp: mv.pp, ppMax: mv.pp };
  if (mon.moves.length < 4) { mon.moves.push(novo); return true; }
  let pior = 0;
  mon.moves.forEach((m, i) => {
    if ((DB.MOVES?.[m.id]?.power || 0) < (DB.MOVES?.[mon.moves[pior].id]?.power || 0)) pior = i;
  });
  mon.moves[pior] = novo;
  return true;
}

/** O nível do que vem na caixa: o do seu mais forte, preso entre o piso e o
 *  teto do src/data/aniversario.js. Equipe vazia (o presente caiu antes do
 *  primeiro Pokémon) cai no piso. */
export function nivelDoPresente(st) {
  const c = cfg();
  const alto = Math.max(0, ...(st?.party || []).map((m) => m.level || 0));
  return clamp(alto || c.nivelMinimo || 5, c.nivelMinimo ?? 5, c.nivelMaximo ?? 50);
}

/** Monta o presente. `forma` é "shiny" ou "golpe" — as duas não vêm juntas.
 *
 *  Devolve `{ mon, especie, golpe }`, e `golpe` é o id do que foi ensinado (ou
 *  null). Quem grava no save é a cena. */
export function montarPresente(st, tipo, forma) {
  const lista = elegiveis(tipo);
  if (!lista.length) return null;
  const especie = pick(lista);
  const nivel = nivelDoPresente(st);
  const mon = createMon(especie.id, nivel, { shiny: forma === "shiny" });
  let golpe = null;
  if (forma === "golpe") {
    // os golpes que ele já tem entram na conta: o presente é sempre um golpe
    // que ele não sabia
    golpe = golpeBombado(especie.id, mon.moves.map((m) => m.id));
    if (golpe && !ensinar(mon, golpe)) golpe = null;
  }
  return { mon, especie, golpe };
}
