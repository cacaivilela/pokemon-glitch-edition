// OS DLCs: pacotes de conteúdo que vêm com o jogo e se ligam e desligam.
//
// Cada DLC é UM ARQUIVO em dlc/ — um módulo ES que exporta um objeto dizendo o
// que muda: espécie nova, golpe, NPC numa cidade, placa, tabela de encontro,
// música, texto da história, entrada de GLITCH ZONE, item na fenda... e, pra
// quem precisa de mais que tabela, uma função `aplicar(DB, api)` que recebe o
// banco inteiro. O catálogo está aqui embaixo; a página dlc/ liga e desliga.
//
// O QUE ESTÁ LIGADO mora no navegador (localStorage `pge.dlc`), não no save:
// é escolha de quem joga, não da partida. `?dlc=<id>` no endereço liga um
// pelo link — o mesmo caminho do `?give=` e do `?area=`.
//
// QUANDO ENTRAM: depois que o DB é montado (src/data/index.js) e antes de
// qualquer cena — e DE NOVO a cada hot-swap, porque ele reconstrói o DB do zero
// e apagaria o que o DLC tinha posto. A ordem é a do catálogo.
import { DB } from "../data/index.js";
import { buildSpecies } from "../data/species.js";
import { url } from "../core/base.js";
import { loadImage, registrarSpriteMon } from "../core/sprites.js";

/** Os DLCs que existem. O arquivo é relativo à raiz do jogo. */
export const CATALOGO = [
  { id: "glitchcitytour", nome: "GLITCH CITY TOUR", arquivo: "dlc/glitchcitytour.js",
    descricao: "Um vão de GLITCH ZONE em toda cidade de Kanto, um guia em Pallet que sabe onde eles estão, e bichos corrompidos que só nascem dentro das zonas." },
  { id: "torneio", nome: "TORNEIO DE PALLET", arquivo: "dlc/torneio.js",
    descricao: "Oito treinadores na praia de Pallet, cada um com uma equipe de FUSÕES publicadas na oficina. Vença os oito e o juiz entrega o prêmio." },
  { id: "decamark", nome: "REVOLTA DE DECAMARK", arquivo: "dlc/decamark.js",
    descricao: "?????????? saiu do lugar dele. Nasce corrompido em toda rota de Kanto e vem pra cima de você — quebra de propósito a regra do \"só um\" da história do REGISTRO 0x3F." },
  // os quatro de baixo trazem, cada um, NOVE PRESENTES MISTERIOSOS por código
  { id: "lendas", nome: "LENDAS DE KANTO", arquivo: "dlc/lendas.js",
    descricao: "As aves, o MEWTWO e o MEW voltam a andar por Kanto: nascem raros nos lugares deles, e nove cartões entregam o resto da lenda." },
  { id: "silph", nome: "ARQUIVO DA SILPH", arquivo: "dlc/silph.js",
    descricao: "A Silph Co. abriu o depósito: PORYGON e os elétricos na cidade, um funcionário em Saffron, e nove cartões com o que saiu do estoque." },
  { id: "festival", nome: "FESTIVAL SHINY", arquivo: "dlc/festival.js",
    descricao: "Cor trocada em dobro: shiny quatro vezes mais fácil em Kanto inteira, uma feirante em Celadon, e nove cartões com um shiny cada." },
  { id: "vizinhas", nome: "REGIÕES VIZINHAS", arquivo: "dlc/vizinhas.js",
    descricao: "Os iniciais e as formas das outras regiões saem da fenda e nascem no mato de Kanto; nove cartões trazem um de cada região." },
];

const CHAVE = "pge.dlc";

/** ids ligados */
export function ligados() {
  try { return JSON.parse(localStorage.getItem(CHAVE) || "[]").filter((id) => CATALOGO.some((d) => d.id === id)); }
  catch { return []; }
}
export const estaLigado = (id) => ligados().includes(id);
export function ligar(id, on = true) {
  if (!CATALOGO.some((d) => d.id === id)) return;
  const lista = ligados().filter((x) => x !== id);
  if (on) lista.push(id);
  try { localStorage.setItem(CHAVE, JSON.stringify(lista)); } catch {}
  if (!on) carregados.delete(id);
}

/** os DLCs carregados nesta sessão, por id */
const carregados = new Map();
/** o que deu errado no carregamento, por id */
export const erros = new Map();

/** Carrega os ligados (uma vez por sessão; `deNovo` força). */
export async function carregarDLC(deNovo = false) {
  if (deNovo) { carregados.clear(); erros.clear(); }
  for (const d of CATALOGO) {
    if (!estaLigado(d.id) || carregados.has(d.id)) continue;
    try {
      const m = await import(url(d.arquivo));
      carregados.set(d.id, m.default || m.dlc || m);
    } catch (e) {
      erros.set(d.id, String(e?.message || e));
      console.warn(`[dlc] ${d.nome} não carregou:`, e);
    }
  }
  return [...carregados.keys()];
}

// ------------------------------------------------------------ aplicar
/** Uma espécie nova (ou reescrita) no formato do DB, com o que faltar
 *  preenchido do mesmo jeito que as de Kanto: learnset pelo tipo, texto de
 *  Pokédex genérico, arte provisória pela forma do tipo. */
function especieDoDLC(id, sp) {
  const base = sp.base || { hp: 50, atk: 50, def: 50, spa: 50, spd: 50, spe: 50 };
  const bst = Object.values(base).reduce((a, b) => a + b, 0);
  const crua = {
    id, dex: sp.dex || 0, name: String(sp.name || sp.nome || id).toUpperCase(),
    types: (sp.types || sp.tipos || ["NORMAL"]).map((t) => String(t).toUpperCase()),
    base, bst, catchRate: sp.catchRate ?? (bst >= 600 ? 3 : bst >= 500 ? 45 : 120),
    xpYield: sp.xpYield ?? Math.floor(bst / 4), foreign: true, dlc: true,
    ...(sp.learnset ? { learnset: sp.learnset } : {}),
    ...(sp.dexText || sp.lore ? { dexText: sp.dexText || sp.lore } : {}),
    ...(sp.spriteDex ? { spriteDex: sp.spriteDex } : {}),
    ...(sp.placeholder ? { placeholder: sp.placeholder } : {}),
  };
  const pronta = buildSpecies({ [id]: crua }, DB.TYPE_COLOR || {})[id];
  if (sp.sprite) {
    // arte própria: caminho dentro do jogo (dlc/x.png), URL ou data:. Vai
    // direto pro SpriteStore, então o jogo nem procura assets/sprites/pokemon
    const abs = (s) => (/^(https?:|data:|blob:)/.test(s) ? s : url(s));
    Promise.all([loadImage(abs(sp.sprite)), sp.spriteBack ? loadImage(abs(sp.spriteBack)) : null])
      .then(([f, c]) => { if (f) registrarSpriteMon(id, f, c); });
  }
  return pronta;
}

/** Escreve num caminho pontilhado do DB: "STORY.dimension.ask" -> DB.STORY.dimension.ask */
function escrever(caminho, valor) {
  const partes = String(caminho).split(".");
  let o = DB;
  for (const p of partes.slice(0, -1)) { if (o[p] == null || typeof o[p] !== "object") o[p] = {}; o = o[p]; }
  o[partes[partes.length - 1]] = valor;
}

/** Registra um gancho: `viajar(st)` depois de trocar de mapa, `encontrar(st, bicho)`
 *  quando um selvagem vira batalha, `brilho(st, sorte)` na hora de sortear a
 *  cor de um selvagem (devolve outra sorte, ou a cor pronta { shiny, luminoso }),
 *  `hud(ctx, st, g)` pra desenhar por cima do
 *  mapa (g traz panel, drawText, bar, PAL, W, H) (src/scenes/overworld.js). */
function gancho(quando, f) { (DB.GANCHOS ||= { viajar: [], encontrar: [], brilho: [], hud: [] })[quando]?.push(f); }

/** O que a função `aplicar` de um DLC recebe além do DB. */
export const api = { especie: especieDoDLC, escrever, url, gancho };

/** Aplica UM pacote no DB. Cada seção é opcional. */
export function aplicarPacote(pk, nome = pk.nome || pk.id) {
  for (const [id, sp] of Object.entries(pk.especies || {})) DB.SPECIES[id] = especieDoDLC(id, sp);
  for (const [id, mv] of Object.entries(pk.golpes || {})) {
    DB.MOVES[id] = { ...(DB.MOVES[id] || {}), ...mv, name: String(mv.name || mv.nome || id).toUpperCase(),
                     type: String(mv.type || mv.tipo || "NORMAL").toUpperCase() };
  }
  for (const [item, lore] of Object.entries(pk.itens || {})) (DB.ITEM_LORE ||= {})[item] = lore;
  for (const [id, regras] of Object.entries(pk.evolucoes || {})) (DB.EVOLUTIONS ||= {})[id] = regras;
  for (const [mapa, lista] of Object.entries(pk.npcs || {})) {
    const m = DB.MAPS[mapa];
    if (!m) { console.warn(`[dlc] ${nome}: mapa "${mapa}" não existe (npcs)`); continue; }
    const ids = new Set((lista || []).map((n) => n.id));
    m.npcs = [...(m.npcs || []).filter((n) => !ids.has(n.id)),
              ...(lista || []).map((n) => ({ dir: "down", sprite: "gentleman", lines: [], ...n }))];
  }
  for (const [mapa, placas] of Object.entries(pk.placas || {})) {
    if (DB.MAPS[mapa]) DB.MAPS[mapa].signs = { ...(DB.MAPS[mapa].signs || {}), ...placas };
  }
  for (const [mapa, tabela] of Object.entries(pk.encontros || {})) if (DB.MAPS[mapa]) DB.MAPS[mapa].encounters = tabela;
  for (const [mapa, extra] of Object.entries(pk.encontrosExtra || {})) {
    if (!DB.MAPS[mapa]) continue;
    const atual = DB.MAPS[mapa].encounters || [];
    DB.MAPS[mapa].encounters = [...atual, ...extra.filter((e) => !atual.some((a) => a.id === e.id && a.dlc))
                                                  .map((e) => ({ ...e, dlc: true }))];
  }
  for (const [id, faixa] of Object.entries(pk.musica || {})) DB.MUSIC[id] = faixa;
  for (const [mapa, faixa] of Object.entries(pk.musicaDoMapa || {})) if (DB.MAPS[mapa]) DB.MAPS[mapa].music = faixa;
  for (const [caminho, valor] of Object.entries(pk.textos || {})) escrever(caminho, valor);
  if (Array.isArray(pk.zonas)) {
    const e = DB.GLITCH_ZONES.entradas;
    for (const z of pk.zonas) if (!e.some((x) => x.mapa === z.mapa && x.x === z.x && x.y === z.y)) e.push(z);
  }
  if (Array.isArray(pk.loot)) for (const l of pk.loot) if (!DB.DIM_LOOT.some((x) => x.item === l.item)) DB.DIM_LOOT.push(l);
  if (Array.isArray(pk.bravos)) for (const id of pk.bravos) if (!DB.BRAVOS.includes(id)) DB.BRAVOS.push(id);
  // PRESENTES MISTERIOSOS: cartões por código, no formato de src/data/gifts.js
  // ({ titulo, texto, de, itens, mons }). A chave é o código; entra sem espaço
  // e em maiúsculo, que é como o jogo compara.
  for (const [codigo, cartao] of Object.entries(pk.presentes || {})) {
    (DB.GIFT_CODES ||= {})[String(codigo).toUpperCase().replace(/[^A-Z0-9]/g, "")] = cartao;
  }
  if (pk.config) Object.assign(DB.CONFIG, pk.config);
  if (typeof pk.aplicar === "function") pk.aplicar(DB, api);
}

/** Aplica todos os carregados, na ordem do catálogo. Chamado no boot e a
 *  cada hot-swap (game.applyData). Devolve os nomes dos que entraram. */
export function aplicarDLC() {
  const nomes = [];
  // OS GANCHOS: funções que a cena chama em certos momentos (trocar de mapa,
  // encostar num selvagem, sortear a cor de um). Zerados aqui porque o DB novo
  // do hot-swap não traz a chave e os DLCs vão registrar os deles de novo.
  DB.GANCHOS = { viajar: [], encontrar: [], brilho: [], hud: [] };
  for (const d of CATALOGO) {
    const pk = carregados.get(d.id);
    if (!pk) continue;
    try { aplicarPacote(pk, d.nome); nomes.push(d.nome); }
    catch (e) { erros.set(d.id, String(e?.message || e)); console.warn(`[dlc] ${d.nome} quebrou ao aplicar:`, e); }
  }
  if (nomes.length) console.log("%c[dlc] ligados:", "color:#b455ff", nomes.join(", "));
  return nomes;
}

/** `?dlc=<id>` (ou vários, separados por vírgula) no endereço do jogo: liga e
 *  tira o parâmetro. `?dlc=nenhum` desliga todos. */
export function ligarDoLink() {
  const q = new URLSearchParams(location.search);
  const v = q.get("dlc");
  if (v == null) return;
  if (v === "nenhum" || v === "0") for (const d of CATALOGO) ligar(d.id, false);
  else for (const id of v.split(",")) ligar(id.trim(), true);
  try {
    const nova = new URL(location.href);
    nova.searchParams.delete("dlc");
    history.replaceState(null, "", nova.pathname + (nova.search || "") + nova.hash);
  } catch {}
}
