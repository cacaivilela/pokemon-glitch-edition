// Tocar o grito de uma espécie (os dados estão em src/data/gritos.js).
import { DB } from "../data/index.js";
import { GRITOS } from "../data/gritos.js";
import { Audio2 } from "../core/audio.js";
import { gritoAtivo } from "../core/gritosmeus.js";
import { GB_GRITOS } from "../data/gritos-gb.js";
import { GRAVADOS } from "../data/gritos-gravados.js";

const ONDAS = ["q", "p", "f", "t", "s"];

/** Bicho sem grito escrito: um tirado do nome, sempre o mesmo pra ele. */
function doNome(id) {
  let h = 2166136261;
  for (const ch of String(id)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
  const r = () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0) % 1000) / 1000;
  const base = 300 + r() * 900, onda = ONDAS[Math.floor(r() * ONDAS.length)];
  const s = [];
  const n = 2 + Math.floor(r() * 2);
  for (let i = 0; i < n; i++) {
    const f0 = base * (0.8 + r() * 0.6);
    s.push([f0, f0 * (0.6 + r() * 0.8), 80 + r() * 160, onda, r() < 0.3 ? 15 : 0]);
  }
  return { som: "", s };
}

/** O grito da FORMA DE VÍNCULO (src/data/vinculo.js): 3/4 o grito do
 *  Pokémon (ou o grito próprio da forma, `VINCULO.gritos`), 1/4 o som do
 *  treinador. O som do treinador é encolhido (ou
 *  esticado) pra durar um terço do grito do Pokémon. */
function gritoVinculo(sp) {
  // (as sílabas do Pokémon, não o original: o som do treinador emenda nelas)
  const { gb, arquivo, ...base } = DB.VINCULO?.gritos?.[sp.vinculo]?.[sp.formaDe] || gritoDe(sp.formaDe);
  const dele = DB.VINCULO?.treinadores?.[sp.vinculo]?.grito;
  if (!dele) return base;
  const dur = (s) => s.reduce((a, x) => a + (x[2] || 0), 0);
  const quarto = dur(base.s) / 3;
  const k = quarto / Math.max(1, dur(dele));
  const treinador = dele.map((x) => [x[0], x[1], Math.max(15, Math.round(x[2] * k)), ...x.slice(3)]);
  return { ...base, s: [...base.s, ...treinador] };
}

/** O GRITO DO REGIGLITCH (src/data/regis.js): os gritos dos seis Regis
 *  MISTURADOS — uma sílaba de cada um, em rodízio, como se o cartucho lesse
 *  os seis ao mesmo tempo e não soubesse qual vem primeiro — e tudo DEZ VEZES
 *  MAIS RÁPIDO. Sai da tabela, então grito novo de Regi entra na mistura. */
const REGIS_DO_GRITO = ["regirock", "regice", "registeel", "regigigas", "regieleki", "regidrago"];
let gritoRegiglitch = null;
function misturaDosRegis() {
  if (gritoRegiglitch) return gritoRegiglitch;
  const fontes = REGIS_DO_GRITO.map((id) => GRITOS[id]?.s || []).filter((s) => s.length);
  const s = [];
  for (let i = 0; i < Math.max(...fontes.map((f) => f.length)); i++) {
    for (const f of fontes) {
      if (!f[i]) continue;
      const [f0, f1, ms, ...resto] = f[i];
      s.push([f0, f1, ms / 10, ...resto]);
    }
  }
  return (gritoRegiglitch = {
    som: "BÍPBÓPKLÁNGTÍNGIGÁZZTRÔÔ!",
    mais: ["BÍ-BÓ-KLÁ-TÍ-GI-ZÍ-RÔ!", "...BÓPTÍNKLÁNG... BÍP?"],
    s,
  });
}

/** É Pokémon de verdade, ou forma oficial (Alola, Galar, Hisui, Paldea, mega)?
 *  Fakemon, forma -BRAG, de vínculo, desenhada aqui ou fusão, não: esses
 *  ficam com o grito escrito. As formas oficiais têm sprite da PokeAPI (o
 *  número dela é 10000 e pouco) e, nos jogos, o mesmo grito do normal. */
function oficial(sp) {
  if (!sp || sp.fusao || sp.hack || sp.vinculo || sp.spriteUrl) return false;
  if (!(sp.dex >= 1 && sp.dex <= 1025)) return false;
  return !sp.spriteDex || (sp.spriteDex >= 10000 && sp.spriteDex < 20000);
}

/** O GRITO ORIGINAL de quem é oficial, pelo número da Pokédex: TODOS (1 a
 *  1025) tocam o grito do SWITCH, o arquivo assets/gritos/<dex>.mp3 (PokeAPI
 *  "latest"), no volume dos do Game Boy (Audio2: ganhoDoGrito). O chip do Game
 *  Boy (src/core/gb.js) ficou só pro MISSINGNO., que não tem número. Ou null. */
const REGIOES_COM_GRITO = new Set(["ALOLA", "GALAR", "HISUI", "PALDEA"]);
function original(id, sp) {
  // KANTO E JOHTO TAMBÉM COM O GRITO DO SWITCH (pedido do CAIO, nov/2026), no
  // volume dos do Game Boy (Audio2: ganhoDoGrito). Só quem não tem número
  // (o MISSINGNO.) continua no chip do Game Boy.
  if (GB_GRITOS[id] && !(sp?.dex >= 1)) return { gb: GB_GRITOS[id] };
  if (!oficial(sp)) return null;
  // AS FORMAS REGIONAIS (Alola, Galar, Hisui, Paldea) têm o grito delas, da
  // PokeAPI: assets/gritos/formas/<número do sprite>.mp3
  if (REGIOES_COM_GRITO.has(sp.regiao) && sp.spriteDex) return { arquivo: `assets/gritos/formas/${sp.spriteDex}.mp3` };
  return originalDoNumero(sp.dex);
}

/** o grito original do Pokémon de número `dex` da Pokédex (ou null) */
function originalDoNumero(dex) {
  if (dex >= 1 && dex <= 1025) return { arquivo: `assets/gritos/${String(dex).padStart(4, "0")}.mp3` };
  return null;
}

/** OS GRITOS FEITOS DE OUTRO (pedido do CAIO, nov/2026): o grito original de
 *  `de` (número da Pokédex), editado (Audio2 `editarGrito`). O PARASECTROM é o
 *  PARASECT robô: o grito do PARASECT espelhado (de trás pra frente). */
const FEITOS_DE = {
  // o grito do PARASECT ESPELHADO (de trás pra frente), com 1% de chiado e um
  // RAIO no fim (o estalo e o trovão)
  // (o CAIO testou choque, robô e o traço do original, e ficou com este)
  parasectrom: { de: 47, tipos: [], invertido: true, puro: true, chiado: 0.01, raio: true },
  parasectromazul: { de: 47, tipos: [], invertido: true, puro: true, chiado: 0.01, raio: true },
  parasectromamarelo: { de: 47, tipos: [], invertido: true, puro: true, chiado: 0.01, raio: true },
};
/** OS MISSINGNO. (pedido do CAIO, nov/2026: "dos missingnos tá antigo ainda"):
 *  o grito de verdade (o do Switch) de quem eles são feitos, BUGADO (`hack`).
 *  O MISSINGNO. do Red/Blue grita com o grito do NIDORAN♂ (o grito nº 0 da
 *  tabela) mais rápido: aqui, o do Switch do NIDORAN♂ (nº 32), mais rápido.
 *  O ÂMBAR é o AERODACTYL bugado, o DOMO o KABUTOPS bugado, e o FANTASMA é
 *  a fusão de três: o começo do GASTLY, o meio do HAUNTER e o fim do MISSINGNO. */
const MISSINGNO_ED = { tipos: [], hack: true, puro: true, tom: 1.5, semente: 32 };
const GRITOS_MISSINGNO = {
  missingno:         { arquivo: "assets/gritos/0032.mp3", edita: MISSINGNO_ED },
  missingnoambar:    { arquivo: "assets/gritos/0142.mp3", edita: { tipos: [], hack: true, puro: true, semente: 142 } },
  missingnodomo:     { arquivo: "assets/gritos/0141.mp3", edita: { tipos: [], hack: true, puro: true, semente: 141 } },
  missingnofantasma: { partes: [{ arquivo: "assets/gritos/0092.mp3" }, { arquivo: "assets/gritos/0093.mp3" },
                                { arquivo: "assets/gritos/0032.mp3", edita: MISSINGNO_ED }] },
  // OS GRITOS DO ZYGARDE (pedido do CAIO, nov/2026: "baixe todos os gritos do
  // zygarde"): da PokeAPI, um por forma (o 50% é o assets/gritos/0718.mp3).
  // O 200% é o COMPLETO mais grosso; a CÉLULA, o 10% bem fininho.
  zygarde10:       { arquivo: "assets/gritos/formas/10181.mp3" },
  zygardecompleto: { arquivo: "assets/gritos/formas/10120.mp3" },
  zygarde200:      { arquivo: "assets/gritos/formas/10120.mp3", edita: { tipos: [], puro: true, tom: 0.8, semente: 200 } },
  celulazygarde:   { arquivo: "assets/gritos/formas/10181.mp3", edita: { tipos: [], puro: true, tom: 1.9, semente: 7 } },
};
function feitoDeOutro(id) {
  if (GRITOS_MISSINGNO[id]) return GRITOS_MISSINGNO[id];
  const f = FEITOS_DE[id];
  const o = f && originalDoNumero(f.de);
  if (!o) return null;
  let semente = 7;
  for (const ch of id) semente = (semente * 31 + ch.charCodeAt(0)) >>> 0;
  return { ...o, edita: { tipos: f.tipos, robo: !!f.robo, choque: !!f.choque, invertido: !!f.invertido, traco: f.traco || 0, puro: !!f.puro, chiado: f.chiado || 0, raio: !!f.raio, hack: !!f.hack, semente } };
}

/** AS FORMAS -BRAG e -HACK (pedido do CAIO, nov/2026): gritam com o grito
 *  ORIGINAL do Pokémon delas (o do mesmo número da Pokédex) — o PIDGEY-BRAG
 *  com o do PIDGEY, o PORYGON-HACK com o do PORYGON. */
function originalDaForma(sp, id = sp?.id) {
  if (!sp || sp.fusao || sp.vinculo || !(sp.dex >= 1 && sp.dex <= 1025)) return null;
  if (!(sp.hack || sp.braglitch)) return null;
  const o = originalDoNumero(sp.dex);
  if (!o) return null;
  // EDITADO pelos tipos da forma (Audio2: editarGrito), cada um do seu jeito
  let semente = 7;
  for (const ch of String(id || sp.name)) semente = (semente * 31 + ch.charCodeAt(0)) >>> 0;
  return { ...o, edita: { tipos: (sp.types || []).filter((t) => t !== "GLITCH"), hack: !!sp.hack, semente } };
}

/** O grito de uma espécie: o escrito, o da fusão (cabeça + fim do corpo) ou o do nome.
 *  Antes de tudo, o que ESTE APARELHO ativou no ESTÚDIO DE GRITOS
 *  (src/core/gritosmeus.js) — `doAparelho = false` pula isso (o estúdio quer
 *  o original pra editar). */
/** O GRITO AO CONTRÁRIO: o de arquivo (e o do Game Boy) toca invertido
 *  inteiro (Audio2: editarGrito `espelho`); o de sílabas toca as sílabas da
 *  última pra primeira, cada uma deslizando ao contrário. Mesma conta do
 *  gritos.html. */
export function gritoAoContrario(g) {
  if (!g) return g;
  if (g.gb || g.arquivo) return { ...g, edita: { tipos: [], puro: true, ...(g.edita || {}), espelho: true } };
  return { ...g, s: (g.s || []).slice().reverse().map((sil) => [sil[1], sil[0], ...sil.slice(2)]) };
}

/** OS GRITOS DE ENCOMENDA: montados em cima do grito de outro.
 *  O PARACELERADO: o do PARASECT 10x acelerado, NOVE vezes seguidas
 *  (`repete`; pedido do CAIO, nov/2026 — a fanfarra no fim ele tirou). */
function deEncomenda(id) {
  if (id !== "paracelerado") return null;
  const base = gritoDe("parasect", false);
  return { ...base, som: "PRRRRRT! PRRRRRT! PRRRRRT!", edita: { tipos: [], puro: true, ...(base.edita || {}), tom: 10 }, repete: 9 };
}

export function gritoDe(id, doAparelho = true) {
  const enc = deEncomenda(id);
  if (enc) return enc;
  if (doAparelho) {
    const meu = gritoAtivo(id);
    // o feito em cima do GRITO DE VERDADE (`arquivo` + `edita`); as sílabas de
    // sempre ficam de reserva se o arquivo não carregar
    if (meu?.arquivo) return { som: meu.som || GRITOS[id]?.som || "", mais: GRITOS[id]?.mais, s: GRITOS[id]?.s || doNome(id).s, arquivo: meu.arquivo, edita: meu.edita };
    if (meu) return { som: meu.som || GRITOS[id]?.som || "", mais: GRITOS[id]?.mais, s: meu.s };
  }
  // OS GRAVADOS NO MICROFONE (Estúdio de Gritos -> GRAVAR NO MICROFONE,
  // src/data/gritos-gravados.js): quem não tinha grito de verdade (os de
  // BRAGLITCH e os outros feitos aqui) toca a gravação, com os efeitos por cima.
  // As sílabas ficam de reserva, se o arquivo não carregar
  const grav = GRAVADOS[id];
  if (grav?.arquivo) {
    const base = GRITOS[id] || doNome(id);
    return { ...base, som: grav.som || base.som, arquivo: grav.arquivo, edita: grav.edita && Object.keys(grav.edita).length ? grav.edita : undefined };
  }
  // QUEM É DE VERDADE toca o grito ORIGINAL (`original`). A onomatopeia
  // escrita continua a mesma, e as sílabas ficam de reserva (o arquivo que
  // não carregar cai nelas)
  const sp0 = DB.SPECIES?.[id];
  let o = feitoDeOutro(id) || original(id, sp0) || originalDaForma(sp0, id);
  // AS MEGAS (pedido do CAIO, nov/2026): o grito de sempre com uma EXPLOSÃO que
  // ecoa, começando JUNTO com ele (Audio2: editarGrito `raio`, `ecoRaio`, `raioJunto`)
  if (o && (sp0?.mega || sp0?.megaDe) && !o.edita) o = { ...o, edita: { tipos: [], puro: true, raio: true, ecoRaio: true, raioJunto: true, semente: 1 } };
  if (o) return { ...(GRITOS[id] || doNome(id)), ...o };
  if (GRITOS[id]) return GRITOS[id];
  if (id === "regiglitch") return misturaDosRegis();
  const sp = DB.SPECIES?.[id];
  // a FORMA ÚNICA é roupa: por baixo ela é a espécie original, e grita como ela
  if (sp?.unicaDe) return gritoDe(sp.unicaDe);
  if (sp?.vinculo) return gritoVinculo(sp);
  if (sp?.fusao) {
    const a = gritoDe(sp.fusao.cabeca), b = gritoDe(sp.fusao.corpo);
    const meio = (x) => Math.ceil(x.s.length / 2);
    if (sp.fusao.pernas) {           // a tripla: um terço de cada um
      const c = gritoDe(sp.fusao.pernas), t = (x, i) => Math.round((x.s.length * i) / 3);
      return { som: "", s: [...a.s.slice(0, t(a, 1)), ...b.s.slice(t(b, 1), t(b, 2)), ...c.s.slice(t(c, 2))] };
    }
    return { som: "", s: [...a.s.slice(0, meio(a)), ...b.s.slice(meio(b))] };
  }
  return doNome(id);
}

/** AS TRÊS ONOMATOPEIAS de uma espécie: a principal (`som`) e as duas do
 *  `mais` — a primeira alegre, a segunda em outro clima (cansado, bravo,
 *  sonolento...). Quem ainda não tem as outras devolve só a principal; quem
 *  não tem nem ela (a fusão), nada. */
export function onomatopeias(id) {
  const g = gritoDe(id);
  return [g?.som, ...(g?.mais || [])].filter(Boolean);
}

/** um semitom: o tom multiplicado por isso sobe meio tom (dividido, desce) */
export const SEMITOM = 2 ** (1 / 12);

/** Toca o grito do Pokémon (`mon` ou id da espécie). Devolve a duração em s. */
export function tocarGrito(mon, tom = 1, efeito = null) {
  const id = typeof mon === "string" ? mon : mon?.species;
  if (!id) return 0;
  // o ALFA grita sempre 4 semitons mais grosso (pedido do CAIO, nov/2026)
  if (mon?.alfa) tom *= SEMITOM ** -4;
  // A FUSÃO: os gritos DE VERDADE das partes, misturados (Audio2.gritoMisturado);
  // com efeito (o estouro, o metal da mega) fica o emendado de sempre
  const sp = DB.SPECIES?.[id];
  if (sp?.fusao && !efeito && Audio2.gritoMisturado) {
    const ids = [sp.fusao.cabeca, sp.fusao.corpo, sp.fusao.pernas].filter(Boolean);
    return Audio2.gritoMisturado(ids.map((p) => gritoDe(p)), ids.map(() => tom));
  }
  return Audio2.grito(gritoDe(id), tom, efeito);
}
