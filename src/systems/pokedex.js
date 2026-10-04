// A POKÉDEX — as regras, sem tela. A tela é src/scenes/pokedex.js; as falas e os
// marcos estão em src/data/pokedex.js.
//
// Nada aqui é gravado à parte: VISTO é `st.seen`, PEGO é `st.caught`, e as duas
// já eram preenchidas pelo jogo inteiro (batalha, captura, ovo, troca,
// evolução, presente) antes de a Pokédex existir. O que esta pasta faz é
// organizar isso em listas e responder as perguntas da ficha.
import { DB } from "../data/index.js";

/** Quem tem a Pokédex. Um save que já passou do laboratório antes de ela
 *  existir (inicial E decodificador na mão) ganha ela sem voltar lá — pedir pra
 *  alguém atravessar Kanto até Pallet pra buscar uma tela seria castigo. */
export const temPokedex = (st) =>
  !!st?.flags?.pokedex || !!(st?.flags?.starterChosen && st?.flags?.decodificador);

/** OS TRÊS DEPOIS DO 1025. Não têm número de verdade (os dois glitches são o
 *  número 0, e o MEWTHREE divide o 150 com o MEWTWO), mas são espécies deste
 *  jogo e não formas de outra — então entram no fim da NACIONAL, cada um com o
 *  número que a Pokédex dá a ele. 1025 + 3 = 1028. */
export const EXTRAS_DA_NACIONAL = [
  ["missingno", 1026],
  ["decamark", 1027],
  ["mewthree", 1028],
];
const NUMERO_EXTRA = Object.fromEntries(EXTRAS_DA_NACIONAL);

/** O número que a Pokédex mostra: o nacional, ou o dos três extras. */
export const numeroNaDex = (id) => NUMERO_EXTRA[id] ?? DB.SPECIES[id]?.dex ?? 0;

/** Tem cara de forma (MEGA, hackeada, fusão, boné, número inválido)? As
 *  REGIONAIS ficam de fora daqui porque elas só são forma quando outro bicho
 *  já tem aquele número: o RAICHU-ALOLA é forma do RAICHU, mas o OBSTAGOON e o
 *  URSALUNA têm número próprio — o rótulo de região deles diz de onde vêm, não
 *  que são cópia de alguém. Quem decide isso é `listas`. */
function temCaraDeForma(id, sp) {
  if (NUMERO_EXTRA[id]) return false;
  // `formaDe`: forma que troca e destroca (as do ROTOM, pelo catálogo)
  return !!(sp.mega || sp.megaDe || sp.hack || sp.fusao || sp.crescimento || sp.formaDe
    || DB.EH_BONE?.has?.(id) || !(sp.dex >= 1));
}

/** É uma FORMA (divide número com outro bicho, ou não tem número)? */
export function ehForma(id, sp = DB.SPECIES[id]) {
  if (!sp) return true;
  if (NUMERO_EXTRA[id]) return false;
  return listas().FORMAS.includes(id);
}

let cache = null;
/** As três listas, montadas uma vez por DB (o live update troca o DB inteiro,
 *  e aí elas são montadas de novo). */
export function listas() {
  if (cache?.db === DB.SPECIES) return cache;
  const principais = new Map();          // número -> id (o primeiro que aparecer)
  const formas = [];
  const regionais = [];
  for (const [id, sp] of Object.entries(DB.SPECIES || {})) {
    if (sp.fusao || sp.crescimento) continue;            // fusão fica no decodificador
    if (NUMERO_EXTRA[id]) continue;                      // os três do fim, lá embaixo
    if (temCaraDeForma(id, sp)) { formas.push(id); continue; }
    if (DB.REGIAO?.[id]) { regionais.push(id); continue; }
    if (!principais.has(sp.dex)) principais.set(sp.dex, id);
  }
  // a regional que tem número só dela entra na NACIONAL (a de id mais curto,
  // quando duas dividem o número: URSALUNA antes de URSALUNA-PALDEA); a que
  // divide número com outro bicho é forma dele
  regionais.sort((a, b) => a.length - b.length || a.localeCompare(b));
  for (const id of regionais) {
    const n = DB.SPECIES[id].dex;
    if (principais.has(n)) formas.push(id);
    else principais.set(n, id);
  }
  const nacional = [...principais.entries()].sort((a, b) => a[0] - b[0]).map(([, id]) => id);
  nacional.push(...EXTRAS_DA_NACIONAL.map(([id]) => id).filter((id) => DB.SPECIES[id]));
  // os de BRAGLITCH têm número depois dos três extras (1029 em diante): a
  // lista volta pra ordem do número, senão eles apareciam antes do 1026
  nacional.sort((a, b) => numeroNaDex(a) - numeroNaDex(b));
  const numero = (id) => DB.SPECIES[id]?.dex || 0;
  formas.sort((a, b) => numero(a) - numero(b) || String(DB.SPECIES[a].name).localeCompare(DB.SPECIES[b].name));
  cache = {
    db: DB.SPECIES,
    KANTO: nacional.filter((id) => numeroNaDex(id) >= 1 && numeroNaDex(id) <= 151),
    NACIONAL: nacional,
    FORMAS: formas,
    GLITCH: glitchDex(nacional),
  };
  // UMA POKÉDEX POR REGIÃO: pela faixa do número nacional; BRAGLITCH são os de
  // lá (número depois dos três extras, ou marcados como de Braglitch)
  for (const r of REGIOES_DA_DEX) {
    if (r.id === "KANTO") continue;
    cache[r.id] = nacional.filter((id) => r.dentro(id, numeroNaDex(id), DB.SPECIES[id]));
  }
  return cache;
}

/** AS ABAS DA POKÉDEX, na ordem do SELECT: a GLITCH DEX, uma por região, a
 *  NACIONAL e as FORMAS. `regional`: o número mostrado é a posição na lista
 *  (cada uma começa no 1), e não o nacional. */
export const REGIOES_DA_DEX = [
  { id: "KANTO", dentro: (id, n) => n >= 1 && n <= 151 },
  { id: "JOHTO", dentro: (id, n) => n >= 152 && n <= 251 },
  { id: "HOENN", dentro: (id, n) => n >= 252 && n <= 386 },
  { id: "SINNOH", dentro: (id, n) => n >= 387 && n <= 493 },
  { id: "UNOVA", dentro: (id, n) => n >= 494 && n <= 649 },
  { id: "KALOS", dentro: (id, n) => n >= 650 && n <= 721 },
  { id: "ALOLA", dentro: (id, n) => n >= 722 && n <= 809 },
  { id: "GALAR", dentro: (id, n) => n >= 810 && n <= 905 },
  { id: "PALDEA", dentro: (id, n) => n >= 906 && n <= 1025 },
  { id: "BRAGLITCH", dentro: (id, n, sp) => !!sp?.braglitch || n >= 1029 },
];
export const ABAS_DA_DEX = [
  { id: "GLITCH", nome: "GLITCH DEX", regional: true },
  ...REGIOES_DA_DEX.map((r) => ({ id: r.id, nome: r.id, regional: true })),
  { id: "NACIONAL", nome: "NACIONAL" },
  { id: "FORMAS", nome: "FORMAS" },
];

/** A GLITCH DEX: a Pokédex PRÓPRIA do jogo, na ordem da jornada.
 *
 *    1. os INICIAIS: os três de Kanto, os três de BRAGLITCH e os das outras
 *       regiões (o laboratório oferece todos), cada um com a linha inteira;
 *    2. as FAMÍLIAS na ordem em que se encontra no mato: cada família entra na
 *       posição do nível mais baixo em que algum membro dela aparece selvagem,
 *       em qualquer mapa — quem nasce no começo da jornada fica no começo;
 *    3. no fim, quem NUNCA aparece no mato (lendários, presentes, fósseis), na
 *       ordem do número nacional.
 *
 *  Cada família fica junta, na ordem da evolução (a pré-evolução antes). */
function glitchDex(nacional) {
  const naDex = new Set(nacional);
  const pre = DB.PRE_EVOLUCAO || {};
  const raiz = (id) => { let r = id, n = 0; while (pre[r] && naDex.has(pre[r]) && n++ < 6) r = pre[r]; return r; };
  // a família inteira, a partir da raiz, na ordem da evolução
  const familia = (r) => {
    const out = [], fila = [r];
    while (fila.length) {
      const id = fila.shift();
      if (out.includes(id)) continue;
      if (naDex.has(id)) out.push(id);
      for (const regra of DB.EVOLUTIONS?.[id] || []) if (naDex.has(regra.to)) fila.push(regra.to);
    }
    return out;
  };
  // o nível mais baixo em que cada espécie aparece no mato
  const nivel = new Map();
  for (const [mapa, def] of Object.entries(DB.MAPS || {})) {
    if (mapa === "glitchdim") continue;
    for (const e of def.encounters || []) {
      const lv = e.min ?? e.max ?? 99;
      if (!nivel.has(e.id) || lv < nivel.get(e.id)) nivel.set(e.id, lv);
    }
  }
  const out = [], ja = new Set();
  const poe = (ids) => { for (const id of ids) if (!ja.has(id)) { ja.add(id); out.push(id); } };
  // 1. os iniciais
  const iniciais = ["bulbasaur", "charmander", "squirtle", ...(DB.BRAGLITCH?.iniciais || []),
    ...(DB.REGIOES || []).flatMap((r) => r.mons || [])];
  for (const id of iniciais) if (naDex.has(id)) poe(familia(raiz(id)));
  // 2 e 3. as famílias, pelo primeiro encontro no mato (sem encontro, no fim)
  const familias = new Map();
  for (const id of nacional) {
    if (ja.has(id)) continue;
    const r = raiz(id);
    if (familias.has(r)) continue;
    const membros = familia(r);
    const nv = Math.min(...membros.map((m) => nivel.get(m) ?? Infinity));
    familias.set(r, { membros, nv, numero: numeroNaDex(r) });
  }
  [...familias.values()].sort((a, b) => a.nv - b.nv || a.numero - b.numero).forEach((f) => poe(f.membros));
  return out;
}

/** "pego" | "visto" | null */
export function estado(st, id) {
  if (st?.caught?.[id]) return "pego";
  if (st?.seen?.[id]) return "visto";
  return null;
}

/** Quantos vistos e quantos pegos numa lista. Pego conta como visto. */
export function contagem(st, lista) {
  let vistos = 0, pegos = 0;
  for (const id of lista) {
    const e = estado(st, id);
    if (e) vistos++;
    if (e === "pego") pegos++;
  }
  return { vistos, pegos, total: lista.length };
}

/** Todo bicho que é seu está pego (e visto). Roda ao abrir a Pokédex: pega o
 *  que algum caminho do jogo esqueceu de anotar, e os saves de antes dela. */
export function sincronizar(st) {
  for (const m of [...(st.party || []), ...(st.box || [])]) {
    if (!m?.species) continue;
    (st.seen ||= {})[m.species] = true;
    (st.caught ||= {})[m.species] = true;
  }
}

/** Onde ele vive solto: os mapas cuja grama (ou água) tem ele na tabela, e a
 *  fenda, se ele aparece lá. Os nomes são os que aparecem na faixa do mapa. */
export function onde(id) {
  const lugares = [];
  for (const [mapa, m] of Object.entries(DB.MAPS || {})) {
    if ((m.encounters || []).some((e) => e.id === id)) lugares.push(m.name || mapa.toUpperCase());
  }
  const naFenda = Object.values(DB.DIM_ENCOUNTERS || {}).some((t) => (t || []).some((e) => e.id === id));
  if (naFenda) lugares.push("011GLITCHDIMENSION110");
  return [...new Set(lugares)];
}

/** A linha de evolução inteira, do primeiro ao último, em estágios:
 *  [["charmander"], ["charmeleon"], ["charizard"]]. Linha que se parte (o EEVEE)
 *  vira um estágio com mais de um. */
export function cadeia(id) {
  const PRE = DB.PRE_EVOLUCAO || {};
  let raiz = id;
  for (let i = 0; i < 6 && PRE[raiz] && DB.SPECIES[PRE[raiz]]; i++) raiz = PRE[raiz];
  const estagios = [[raiz]];
  const visto = new Set([raiz]);
  for (let i = 0; i < 4; i++) {
    const prox = [];
    for (const de of estagios.at(-1)) {
      for (const r of DB.EVOLUTIONS?.[de] || []) {
        if (r.to && DB.SPECIES[r.to] && !visto.has(r.to)) { visto.add(r.to); prox.push(r.to); }
      }
    }
    if (!prox.length) break;
    estagios.push(prox);
  }
  return estagios;
}

/** O peso em quilos, da tabela da PokeAPI (pelo número do sprite), ou null. */
export function peso(id) {
  const sp = DB.SPECIES[id];
  if (!sp) return null;
  return DB.PESOS?.[sp.spriteDex || sp.dex] ?? null;
}

/** Os marcos que você já passou e o professor ainda não pagou. */
export function marcosDevidos(st) {
  const { pegos } = contagem(st, listas().KANTO);
  const pagos = st?.flags?.marcosDex || [];
  return (DB.MARCOS_DEX || []).filter((m) => pegos >= m.n && !pagos.includes(m.n));
}

/** Paga um marco: o item vai pra mochila e o marco não volta mais. */
export function pagarMarco(st, m) {
  const pagos = ((st.flags ||= {}).marcosDex ||= []);
  if (pagos.includes(m.n)) return false;
  pagos.push(m.n);
  st.items[m.item] = Math.min(999, (st.items[m.item] || 0) + m.qtd);
  return true;
}

/** O AMULETO BRILHANTE multiplica a sorte de cor dos selvagens. */
export const fatorAmuleto = (st) => ((st?.items?.[DB.AMULETO?.item] || 0) > 0 ? DB.AMULETO.fator : 1);
