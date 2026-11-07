// Ponto unico de acesso aos dados do jogo.
// O live update reimporta este modulo com ?t=... e reconstroi o DB em memoria,
// entao TUDO que le dados deve ler via `DB.x` (nunca guardar a referencia solta).
import { porForasteiros, porForasteirosNasRegioes } from "./forasteiros.js";
import * as itensUso from "./itens-uso.js";
import * as ligaKanto from "./liga-kanto.js";
import { url as arquivo } from "../core/base.js";

const V = new URL(import.meta.url).search;

const [config, story, types, moves, gen1, extra, frags, loot, evo, field, music, species, box, mega, fusao, fusoes, feitas, concurso, idiomas, missoes, rival, amigos, versao, online, gifts, maps, acamp, bravos, iniciais, distorcoes, sevii, bones, zc, desc, moto, lugares, eras, bolas, aniv, reg, zonas, ovos, decamark, hab, pesos, mina, mais, gopark, spinda, spindaUnown, prov, hack, duplas, dex, brag, textos, rotom, vazio, trocas, kanto] = await Promise.all([
  import("./config.js" + V),
  import("./story.js" + V),
  import("./types.js" + V),
  import("./moves.js" + V),
  import("./gen1.js" + V),
  import("./extra.js" + V),
  import("./fragments.js" + V),
  import("./loot.js" + V),
  import("./evolution.js" + V),
  import("./field.js" + V),
  import("./music.js" + V),
  import("./species.js" + V),
  import("./box.js" + V),
  import("./mega.js" + V),
  import("./fusao.js" + V),
  import("./fusoes.js" + V),
  import("./fusoes-feitas.js" + V),
  import("./concurso.js" + V),
  import("./idiomas.js" + V),
  import("./missoes.js" + V),
  import("./rival.js" + V),
  import("./amigos.js" + V),
  import("./versao.js" + V),
  import("./online.js" + V),
  import("./gifts.js" + V),
  import("./maps.js" + V),
  import("./acampamento.js" + V),
  import("./bravos.js" + V),
  import("./iniciais.js" + V),
  import("./distorcoes.js" + V),
  import("./sevii.js" + V),
  import("./bones.js" + V),
  import("./zcristais.js" + V),
  import("./descida.js" + V),
  import("./motoqueiros.js" + V),
  import("./lugares.js" + V),
  import("./eras.js" + V),
  import("./bolas.js" + V),
  import("./aniversario.js" + V),
  import("./regionais.js" + V),
  import("./glitchzones.js" + V),
  import("./ovos.js" + V),
  import("./decamark.js" + V),
  import("./habilidades.js" + V),
  import("./pesos.js" + V),
  import("./mineracao.js" + V),
  import("./mais.js" + V),
  import("./gopark.js" + V),
  import("./spinda.js" + V),
  import("./spinda-unown.js" + V),
  import("./provacoes.js" + V),
  import("./hackeanas.js" + V),
  import("./duplas.js" + V),
  import("./pokedex.js" + V),
  import("./braglitch.js" + V),
  import("./pokedex-textos.js" + V),
  import("./rotom.js" + V),
  import("./void.js" + V),
  import("./trocas.js" + V),
  fetch(arquivo(`assets/maps/kanto.json${V || "?v=1"}`)).then((r) => (r.ok ? r.json() : null)),
]);

// MAIS GOLPES (src/data/golpes-mais.js): os duzentos golpes a mais, que todo
// Pokémon aprende alguns pelos tipos (src/data/species.js, `maisGolpes`)
const golpesMais = await import("./golpes-mais.js" + V);
// OS 99 GOLPES OFICIAIS A MAIS (src/data/golpes-oficiais.js, gerado por tools/mt_oficiais/golpes99.py)
const golpesOficiais = await import("./golpes-oficiais.js" + V);
// AS MTs OFICIAIS (src/data/mt-oficiais.json, tools/mt_oficiais/gerar.py): quem aprende cada MT nos jogos de verdade
const MT_OFICIAIS = await fetch(arquivo(`src/data/mt-oficiais.json${V || "?v=1"}`)).then((r) => (r.ok ? r.json() : {})).catch(() => ({}));
// OS POKÉBLOCOS (src/data/pokeblocos.js): as berries, o liquidificador e as condições
const pokeblocos = await import("./pokeblocos.js" + V);
// OS EVENTOS (src/data/eventos.js): as raids de evento com data marcada
const eventos = await import("./eventos.js" + V);
// A BATALHA EM LUMIOSE (src/data/musica-lumiose.js): a do X/Y, copiada de um MIDI
const musicaLumiose = await import("./musica-lumiose.js" + V);
// A MEGA DESCONTROLADA: a batalha de Lumiose tocada por uma banda pesada (src/data/musica-mega-descontrolada.js)
const musicaMegaDesc = await import("./musica-mega-descontrolada.js" + V);
// AS MÚSICAS DE KANTO DO FIRERED (src/data/musicas-frlg.js) e onde cada uma toca
const musicasFrlg = await import("./musicas-frlg.js" + V);
// O PAINTBALL DE CELADON e o balcão de fichas do cassino (src/data/paintball.js)
const paintball = await import("./paintball.js" + V);
// OS DOCES DO ALCREMIE (src/data/doces.js)
const doces = await import("./doces.js" + V);
// OS ITENS DE SEGURAR (src/data/segurar.js)
const segurar = await import("./segurar.js" + V);
// O BEBBIDAH (src/data/bebbidah.js): os ingredientes de sanduíche viram coisa
// de segurar — é segurando um e girando que ele evolui
const bebbidah = await import("./bebbidah.js" + V);
// AS MÚSICAS DOS LUGARES DE BRAGLITCH (src/data/musicas-braglitch.js)
const musicasBrag = await import("./musicas-braglitch.js" + V);
const cavernaSerra = await import("./caverna-serra.js" + V);
const fonteCeladon = await import("./fonte-celadon.js" + V);   // a PASSAGEM SECRETA DA FONTE DE CELADON
const ciber = await import("./ciberespaco.js" + V);   // o CIBERESPAÇO do PORYGON (cassino de Celadon)
const sub = await import("./subterraneo.js" + V);   // O SUBTERRÂNEO DE KANTO
for (const b of bebbidah.BEBIDAS) {
  if (!segurar.SEGURAVEIS[b.item]) segurar.SEGURAVEIS[b.item] = { efeito: "bebida", desc: bebbidah.BEBBIDAH_TEXTO.desc };
}
// AS BASES SECRETAS (src/data/bases.js)
const bases = await import("./bases.js" + V);
const cabecas = await import("./cabecas-marcadas.js" + V);   // as cabeças marcadas à mão da fusão
const musicasKanto = await import("./musicas-kanto.js" + V);
const fundoDoMar = await import("./fundo-do-mar.js" + V);
const posPos = await import("./pos-pos.js" + V);   // o PÓS-PÓS-GAME (KYOGRE x GROUDON)
const portal = await import("./portal-paradoxo.js" + V);
const secretos = await import("./portal-secretos.js" + V);   // o PORTAL PARADOXO (as runas e os mapas secretos)
const windsWaves = await import("./winds-waves.js" + V);   // BROWT, POMBON e GECQUA (o PRESENTE MISTERIOSO)
// LUMIOSE (CIDADE): a de andar por Lumiose fora da batalha (src/data/musica-lumiose-cidade.js)
const musicaLumioseCidade = await import("./musica-lumiose-cidade.js" + V);
// KALOS (src/data/kalos.js): a LUMIOSE do Legends Z-A e o avião
const kalos = await import("./kalos.js" + V);
// A ÁREA ZERO (src/data/area-zero.js): o helicóptero de Viridian, a GARAGEM ZERO e os PARADOXOS novos
const areaZero = await import("./area-zero.js" + V);
// A FÁBRICA DE POKÉBOLAS (src/data/fabrica.js)
const fabrica = await import("./fabrica.js" + V);
// O ESPAÇO SIDERAL (src/data/espaco.js): o foguete de Cinnabar, a Lua e os planetas
const espaco = await import("./espaco.js" + V);
// O CONECTADOR DE LENDAS (src/data/conectador.js): CALYREX/KYUREM/NECROZMA juntos com os parceiros
const conectador = await import("./conectador.js" + V);
// A ÁRVORE OCA DA ROTA 1 (src/data/arvore-oca.js): o corredor do GUZZLORD e a sala do tesouro
const arvoreOca = await import("./arvore-oca.js" + V);
// OS REGIS (src/data/regis.js): as placas das câmaras de Tanoby e o REGIGLITCH
const regis = await import("./regis.js" + V);
// AS MEGAS DESCONTROLADAS (src/data/descontroladas.js), à parte da lista acima
const descontroladas = await import("./descontroladas.js" + V);
// AS EVOLUÇÕES SECRETAS (src/data/secretas.js): as espécies e as marcas
const secretas = await import("./secretas.js" + V);
// AS FORMAS ÚNICAS (src/data/formas-unicas.js): os desenhos do UNIQUEMON
const unicas = await import("./formas-unicas.js" + V);
const formasBatalha = await import("./formas-batalha.js" + V);   // WISHIWASHI CARDUME, PALAFIN HERÓI
const carnaval = await import("./carnaval.js" + V);            // as ULTRA BEASTS DE CARNAVAL (evento)
const vinculo = await import("./vinculo.js" + V);              // o FENÔMENO DE VÍNCULO do CAIO e da LARA
const puros = await import("./fosseis-puros.js" + V);            // os FÓSSEIS PURIFICADOS: a FORMA PURA e o TURBOZOLT
const guardaRoupa = await import("./guarda-roupa.js" + V);
// FALAR COM O COMPANHEIRO (src/data/companheiro.js)
const companheiro = await import("./companheiro.js" + V);
// O ASH, o campeão secreto (src/data/ash.js)
const ash = await import("./ash.js" + V);
// OS BICOS: entregas e procurados (src/data/bicos.js)
const bicos = await import("./bicos.js" + V);

if (!kanto) {
  console.error("[dados] assets/maps/kanto.json não encontrado — rode: python3 tools/fetch_maps.py");
}

/** Junta a geometria importada do FireRed com o conteúdo escrito à mão.
 *  O que está em src/data/maps.js sempre ganha. */
/** ONDE O JOGADOR APARECE NUM MAPA SEM PORTA NENHUMA.
 *
 *  Antes era o meio do mapa, sem olhar o que tinha lá. Nas rotas de mar (19 e
 *  as duas partes da 21) o meio é oceano — e o jogador aparecia DE PÉ em cima
 *  da água, andando como se fosse chão. Agora o ponto de chegada procura chão
 *  de verdade, do centro pra fora, e só desiste se o mapa não tiver nenhum. */
function pontoSeco(geo) {
  const anda = (x, y) => {
    if (x < 0 || y < 0 || x >= geo.w || y >= geo.h) return false;
    const t = geo.tags.charCodeAt(y * geo.w + x) - 48;
    return t === maps.TAG.FREE || t === maps.TAG.GRASS;
  };
  const cx = Math.floor(geo.w / 2), cy = Math.floor(geo.h / 2);
  if (anda(cx, cy)) return { x: cx, y: cy, dir: "down" };
  for (let r = 1; r < Math.max(geo.w, geo.h); r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        if (anda(cx + dx, cy + dy)) return { x: cx + dx, y: cy + dy, dir: "down" };
      }
    }
  }
  return { x: cx, y: cy, dir: "down" };      // mapa 100% água: o jogo põe no surfe
}

/** Junta uma tabela de encontro com a lista de novatos, dando aos novatos,
 *  somados, o mesmo peso que a tabela de casa já tinha — mais espécie não
 *  pode significar menos das que já moravam ali. */
function comPesoDeCasa(casa, novos) {
  if (!novos.length) return casa;
  const total = casa.reduce((s, e) => s + e.w, 0) || 1;
  const soma = novos.reduce((s, e) => s + e.w, 0) || 1;
  return [...casa, ...novos.map((e) => ({ ...e, w: (e.w * total) / soma }))];
}

function mergeMaps(kanto, authored) {
  const out = {};
  kanto = kanto || {};
  for (const [id, geo] of Object.entries(kanto || {})) {
    const c = geo.content || {};
    const first = geo.warps?.[0];
    out[id] = {
      name: c.name || id.toUpperCase().replace(/_/g, " "),
      music: c.music || "route",
      interior: !!c.interior,
      npcs: c.npcs || [],
      encounters: c.encounters || [],
      lockedWarps: {},
      signs: Object.fromEntries((geo.signs || []).map((s) => [`${s.x},${s.y}`, c.name || ""])),
      spawn: first ? { x: first.x, y: first.y, dir: c.interior ? "up" : "down" }
                   : pontoSeco(geo),
    };
  }
  // JOHTO NO MATO DAS SEVII (src/data/mais.js): cada espécie de Johto que
  // entrou mora em dois mapas abertos das ilhas, no nível do que já vive lá,
  // e o grupo delas pesa o mesmo que os moradores antigos do mapa.
  const abertos = Object.keys(out).filter((id) => /island/.test(id) && !out[id].interior && kanto[id]?.tags?.includes("2") && out[id].encounters.length);
  if (abertos.length && mais.MAIS_SEVII?.length) {
    const porMapa = Object.fromEntries(abertos.map((id) => [id, []]));
    mais.MAIS_SEVII.forEach((e, i) => {
      for (const id of new Set([abertos[i % abertos.length], abertos[(i * 5 + 3) % abertos.length]])) {
        const casa = out[id].encounters;
        const lo = Math.min(...casa.map((c) => c.min)), hi = Math.max(...casa.map((c) => c.max));
        porMapa[id].push({ ...e, min: Math.max(e.min, lo - 4), max: Math.max(e.min, Math.min(e.max, hi + 2)) });
      }
    });
    for (const id of abertos) out[id].encounters = comPesoDeCasa(out[id].encounters, porMapa[id]);
  }
  // AS SEVII ganham nome de gente. O nome montado do id sai "ONE ILHA", que é
  // inglês e português no mesmo rótulo — e ele aparece na faixa toda vez que
  // alguém entra num lugar.
  for (const [id, nome] of Object.entries(sevii.NOMES || {})) {
    if (out[id]) out[id].name = nome;
  }
  // E os LUGARES FECHADOS (cavernas, torres, prédios): mesmo problema das
  // SEVII, e a mesma hora de resolver. Lá é tabela porque são nomes próprios de
  // ilha; aqui é regra porque são cento e nove nomes com a mesma forma.
  for (const id of Object.keys(out)) {
    const nome = lugares.nomeDoLugar(id);
    if (nome) out[id].name = nome;
  }
  for (const [id, m] of Object.entries(authored)) {
    const base = out[id] || {};
    const npcs = m.npcs || [...(base.npcs || []), ...(m.addNpcs || [])];
    out[id] = {
      ...base, ...m,
      signs: { ...(base.signs || {}), ...(m.signs || {}) },
      // `npcPatch` altera um NPC que veio do decomp pelo id, sem ter que
      // reescrever a lista inteira do mapa à mão
      npcs: m.npcPatch ? npcs.map((n) => (m.npcPatch[n.id] ? { ...n, ...m.npcPatch[n.id] } : n)) : npcs,
    };
  }
  // OS NOMES EM PORTUGUÊS DE GENTE: "CIDADE DE PEWTER", não "PEWTER CIDADE" (src/data/lugares.js)
  for (const id of Object.keys(out)) out[id].name = lugares.traduzirNome(out[id].name);
  // AS PLACAS DA HISTÓRIA DO ??????????: o aviso em Cinnabar e os diários da
  // mansão (src/data/decamark.js). Entram por cima do nome de mapa que os tiles
  // de placa importados mostram por padrão.
  for (const [id, placas] of Object.entries(decamark.DECAMARK_PLACAS)) {
    if (out[id]) out[id].signs = { ...(out[id].signs || {}), ...placas };
  }

  // AS DUPLAS DE TREINADORES (src/data/duplas.js): um NPC por dupla, montado
  // da tabela de lá — o formato é o de qualquer treinador escrito à mão, com
  // `dupla: true` no `trainer`, e é isso que manda a batalha pra cena dupla.
  for (const d of duplas.DUPLAS_TREINADORES) {
    const m = out[d.mapa];
    if (!m) continue;
    const id = `dupla_${d.mapa}`;
    if ((m.npcs || []).some((n) => n.id === id)) continue;
    m.npcs = [...(m.npcs || []), {
      id, x: d.x, y: d.y, dir: d.dir || "down", sprite: d.sprite,
      lines: d.fala, afterLines: d.depois,
      trainer: { name: d.nome, prize: d.premio, dupla: true, sight: 4,
                 party: d.time.map(([id2, lvl]) => ({ id: id2, lvl })) },
    }];
  }

  // AS ARVOREZINHAS DO FIREED: as árvores cortáveis vêm do decomp como objeto
  // (CUT_TREE), na posição de sempre. Só as que estão em chão de verdade — e só
  // nos mapas de Kanto mesmo (os interiores de BRAGLITCH copiam a geometria de
  // Kanto, objetos junto, e não herdam as árvores de lá).
  for (const [id, geo] of Object.entries(kanto)) {
    if (!out[id] || geo.planta || out[id].arvores) continue;   // região desenhada em código: sem árvore do decomp
    const livre = (x, y) => x >= 0 && y >= 0 && x < geo.w && y < geo.h
      && [maps.TAG.FREE, maps.TAG.GRASS].includes(geo.tags.charCodeAt(y * geo.w + x) - 48);
    const arv = (geo.objects || []).filter((o) => o.gfx === "CUT_TREE" && livre(o.x, o.y)).map((o) => `${o.x},${o.y}`);
    if (arv.length) out[id].arvores = arv;
  }

  // O PC dos Centros Pokémon: mesma planta, mesma coordenada em Kanto inteira
  // (ver PC_CENTRO em src/data/maps.js). Um mapa que já traga `pc` escrito à
  // mão fica com o dele.
  for (const [id, m] of Object.entries(out)) {
    if (!m.pc && (id === "center" || id.endsWith("pokemon_center_1f"))) m.pc = [...maps.PC_CENTRO];
  }

  // O VENDEDOR DE MYSTERY EGGS: mesma história do PC, todo Centro Pokémon
  // ganha o mesmo vendedor (src/data/ovos.js). Ele fica atrás do balcão, NO
  // TILE À DIREITA DA SRTA. JOY — não numa coordenada fixa, porque o centro da
  // ILHA UM tem outra planta e a enfermeira lá está em (5,2), não em (7,2). O
  // tile precisa ser chão, com balcão embaixo e chão do outro lado (é de lá
  // que o jogador fala com ele); se não for, aquele centro fica sem vendedor.
  // Um centro que já tenha um NPC com esse id fica com o dele.
  for (const [id, m] of Object.entries(out)) {
    if (id !== "center" && !id.endsWith("pokemon_center_1f")) continue;
    if ((m.npcs || []).some((n) => n.id === ovos.VENDEDOR_OVOS.id)) continue;
    const geo = kanto?.[id];
    const joy = (m.npcs || []).find((n) => n.sprite === "enfermeira");
    if (!geo || !joy) continue;
    const tag = (x, y) => (x < 0 || y < 0 || x >= geo.w || y >= geo.h) ? maps.TAG.BLOCK
      : geo.tags.charCodeAt(y * geo.w + x) - 48;
    const x = joy.x + 1, y = joy.y;
    const cabe = tag(x, y) === maps.TAG.FREE && tag(x, y + 1) === maps.TAG.BLOCK
      && tag(x, y + 2) === maps.TAG.FREE && !(m.pc || []).includes(`${x},${y}`)
      && !(m.npcs || []).some((n) => n.x === x && n.y === y);
    if (!cabe) continue;
    m.npcs = [...(m.npcs || []), { ...ovos.VENDEDOR_OVOS, x, y }];
  }

  // ACAMPAR E LEILÃO: cada cidade tem a sua loja, e todas vendiam só bola e poção. Em vez
  // de escrever a lista de ingredientes em cada uma (oito lugares pra esquecer
  // um), o estoque é grudado em QUALQUER balconista do jogo. Isto roda DEPOIS
  // dos mapas escritos à mão: rodando antes, `src/data/maps.js` sobrescrevia a
  // loja de exemplo inteira e ela ficava sem nada disso.
  for (const mapa of Object.values(out)) {
    for (const npc of mapa.npcs || []) {
      if (!npc.shop) continue;
      // `estoqueFechado`: o vendedor de ovos vende ovo, e só — bola e sanduíche
      // do lado de um MYSTERY EGG viravam uma loja de conveniência
      if (npc.estoqueFechado) continue;
      const tem = new Set(npc.shop.map((x) => x.item));
      // AS BOLAS entram GRUDADAS NA POKÉ BOLA, e não no fim da lista: bola se
      // compra ao lado de bola. Jogadas no fim, a GREAT BALL aparecia depois
      // das cinco pedras de evolução e dos ingredientes de sanduíche.
      // + a CURA, os X da batalha, os novos de segurar e a BICICLETA (src/data/itens-uso.js)
      const novas = [...bolas.ESTOQUE_BOLAS, ...itensUso.ESTOQUE_USO].filter((x) => !tem.has(x.item));
      const i = npc.shop.findIndex((x) => x.item === "poké bola");
      const comBolas = i < 0 ? [...npc.shop, ...novas]
        : [...npc.shop.slice(0, i + 1), ...novas, ...npc.shop.slice(i + 1)];
      npc.shop = [...comBolas, ...acamp.ESTOQUE.filter((x) => !tem.has(x.item))];
      // o GUARDA-ROUPA ÚNICO (src/data/guarda-roupa.js): uma vez só, como a barraca
      const G = guardaRoupa.GUARDA_ROUPA;
      if (!tem.has(G.item)) npc.shop.push({ item: G.item, price: G.preco, unico: true });
      // o CRISTAL DO VÍNCULO (src/data/vinculo.js): a técnica que se compra
      const B = vinculo.VINCULO.cristal;
      if (!tem.has(B.item)) npc.shop.push({ item: B.item, price: B.preco });
    }
  }
  // OS COGUMELOS DO PARASECT (src/data/secretas.js) só nas lojas das SEVII
  for (const [id, mapa] of Object.entries(out)) {
    if (!/_island_mart$/.test(id)) continue;
    for (const npc of mapa.npcs || []) {
      if (!npc.shop || npc.estoqueFechado) continue;
      for (const [item, c] of Object.entries(secretas.COGUMELOS.itens)) {
        if (!npc.shop.some((x) => x.item === item)) npc.shop.push({ item, price: c.preco });
      }
    }
  }

  return out;
}

const DIM = { w: 44, h: 40, seed: 90210, entry: { x: 22, y: 30 } };

/** ruído simples e determinístico (sem Math.random: precisa ser igual sempre) */
function hash2(x, y, seed) {
  // Math.imul mantém tudo em int32: sem isso o hash degenera e o mapa sai liso
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(seed, 2654435761)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function blob(x, y, seed, scale) {
  const gx = Math.floor(x / scale), gy = Math.floor(y / scale);
  let v = 0;
  for (let dx = 0; dx <= 1; dx++) {
    for (let dy = 0; dy <= 1; dy++) v += hash2(gx + dx, gy + dy, seed);
  }
  return v / 4;
}

/** A 011GLITCHDIMENSION110: ilhas de terra, poças de água e vazio no meio,
 *  com tufos de 101MATO011 espalhados (é neles que aparece bicho). */
function dimensionMap(story) {
  const { w, h, seed } = DIM;
  let tags = "", terrain = "";
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const edge = x === 0 || y === 0 || x === w - 1 || y === h - 1;
      const t = blob(x, y, seed, 7);
      const kind = t < 0.462 ? "a" : t < 0.538 ? "t" : "g";   // ar / terra / água (~1/3 cada)
      terrain += kind;
      if (edge) { tags += "1"; continue; }
      // clareira em volta do portal de entrada
      if (Math.abs(x - DIM.entry.x) <= 2 && Math.abs(y - DIM.entry.y) <= 2) { tags += "0"; continue; }
      const wall = blob(x, y, seed + 77, 3) > 0.74;          // blocos corrompidos
      const grass = !wall && blob(x, y, seed + 31, 2.5) > 0.62;
      tags += wall ? "1" : grass ? "2" : "0";
    }
  }
  return {
    w, h, tags, terrain, warps: [], connections: [], signs: [], objects: [],
    content: {
      name: story.dimension.name, music: "cave", interior: true, npcs: [], encounters: [],
    },
  };
}

/** BIRTH ISLAND. A geometria oficial vem do decomp, junto com o resto de Kanto
 *  (`python3 tools/fetch_maps.py --only BirthIsland_Exterior`). Se o arquivo não
 *  estiver lá, o jogo cai nesta ilha desenhada em código, pra nunca quebrar. */
const ILHA = { w: 22, h: 20 };

function islandMap() {
  const { w, h } = ILHA;
  const cx = (w - 1) / 2, cy = (h - 1) / 2;
  let tags = "", terrain = "";
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // a ilha é uma elipse de areia; fora dela, mar
      const d = ((x - cx) / (w * 0.36)) ** 2 + ((y - cy) / (h * 0.36)) ** 2;
      const areia = d <= 1;
      terrain += areia ? "t" : "g";
      // o monumento: um triângulo de pedra no meio, sólido
      const dy = Math.round(cy) - y;
      const monumento = dy >= 0 && dy <= 3 && Math.abs(x - Math.round(cx)) <= dy;
      tags += !areia ? "3" : monumento ? "1" : "0";
    }
  }
  return {
    w, h, tags, terrain, warps: [], connections: [], signs: [], objects: [],
    content: { name: "BIRTH ISLAND", music: "ilha", interior: false, npcs: [], encounters: [] },
  };
}

/** A TEMPESTADE QUE NÃO ACABA: mar aberto perto de BIRTH ISLAND, com um
 *  recife de pedra no meio onde dá pra ficar de pé. Não é mapa do FireRed, não
 *  existe caminho por terra e não tem porta: só se chega de barco (as side
 *  quests do marinheiro) e só se sai falando com ele de novo. */
const TEMPESTADE = { w: 20, h: 16 };

function stormMap(story) {
  const { w, h } = TEMPESTADE;
  const cx = (w - 1) / 2, cy = (h - 1) / 2;
  let tags = "", terrain = "";
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // o recife é uma mancha irregular no meio; o resto é mar bravo
      const d = ((x - cx) / 4.6) ** 2 + ((y - cy) / 3.4) ** 2;
      const ruido = hash2(x, y, 7717) * 0.5;
      const pedra = d + ruido * 0.35 <= 1;
      terrain += "g";
      tags += pedra ? "0" : "3";
    }
  }
  return {
    w, h, tags, terrain, warps: [], connections: [], signs: [], objects: [],
    content: {
      name: story.tempestade?.nome || "TEMPESTADE", music: "cave",
      interior: false, npcs: [], encounters: [],
    },
  };
}

/** AS TRÊS ERAS (src/data/eras.js), desenhadas em código como a fenda e a
 *  tempestade: chão, tufos de mato onde nasce bicho, pedra que não deixa
 *  passar e uma lagoa num canto só.
 *
 *  A LAGOA FICA NUM CANTO DE PROPÓSITO. Água espalhada pelo mapa inteiro corta
 *  o caminho de quem chegou sem SURFAR — e ninguém escolhe a equipe que leva
 *  numa viagem no tempo pensando em água. Melhor um mar pequeno num canto que
 *  um mapa bonito onde o guardião fica do outro lado. */
function eraMap(era) {
  const g = era.geo;
  const { w, h, seed } = g;
  const lag = g.lagoa;
  const perto = (x, y, c, r = 2) => Math.abs(x - c.x) <= r && Math.abs(y - c.y) <= r;
  const celulas = [];
  let terrain = "";
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const borda = x === 0 || y === 0 || x === w - 1 || y === h - 1;
      const naLagoa = !!lag && x >= lag.x0 * w && x <= lag.x1 * w
                            && y >= lag.y0 * h && y <= lag.y1 * h
                            && blob(x, y, seed + 13, g.escala) < lag.limite;
      terrain += naLagoa ? "g" : "t";
      if (borda) { celulas.push("1"); continue; }
      // clareira na chegada e no pé do guardião: ninguém nasce dentro da pedra
      if (perto(x, y, g.entrada) || perto(x, y, g.guardiao)) { celulas.push("0"); continue; }
      if (naLagoa) { celulas.push("3"); continue; }
      const pedra = blob(x, y, seed + 77, 3) > g.pedra;
      const mato = !pedra && blob(x, y, seed + 31, 2.5) > g.mato;
      celulas.push(pedra ? "1" : mato ? "2" : "0");
    }
  }
  abrirCaminho(celulas, w, h, g.entrada, g.guardiao);
  return {
    w, h, tags: celulas.join(""), terrain,
    warps: [], connections: [], signs: [], objects: [],
    content: {
      name: era.nome, music: era.music, interior: false, npcs: [],
      encounters: era.encontros || [],
    },
  };
}

/** A REDE DE SEGURANÇA DO MAPA GERADO: o ruído é determinístico, mas ninguém
 *  garante que ele ligue a chegada ao guardião. Se não ligar, o jogador anda
 *  meia hora numa era pra descobrir que o caminho não existe — e ele não tem
 *  como saber que o problema não é ele. Então: alaga o mapa a partir da
 *  chegada; se o guardião não foi alcançado, abre um corredor em L até ele.
 *  Com os `seed` escritos hoje isto não dispara — é justamente por isso que
 *  fica aqui, pro dia em que alguém mexer num número. */
function abrirCaminho(celulas, w, h, de, ate) {
  const anda = (i) => celulas[i] === "0" || celulas[i] === "2";
  const visto = new Uint8Array(w * h);
  const fila = [de.y * w + de.x];
  visto[fila[0]] = 1;
  for (let k = 0; k < fila.length; k++) {
    const i = fila[k], x = i % w, y = (i / w) | 0;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const j = ny * w + nx;
      if (visto[j] || !anda(j)) continue;
      visto[j] = 1;
      fila.push(j);
    }
  }
  if (visto[ate.y * w + ate.x]) return;
  console.warn("[eras] caminho fechado: abrindo corredor até o guardião");
  for (let y = Math.min(de.y, ate.y); y <= Math.max(de.y, ate.y); y++) celulas[y * w + de.x] = "0";
  for (let x = Math.min(de.x, ate.x); x <= Math.max(de.x, ate.x); x++) celulas[ate.y * w + x] = "0";
}

/** { era_fosseis: geo, era_paradoxo: geo, era_futuro: geo } */
const MAPAS_ERAS = Object.fromEntries((eras.ERAS || []).map((e) => [e.mapa, eraMap(e)]));
// OS MAPAS SECRETOS DO PORTAL PARADOXO (src/data/portal-paradoxo.js): o mesmo
// gerador das eras, um por receita de runas
const MAPAS_PORTAL = Object.fromEntries((portal.RECEITAS || []).map((r) =>
  [`paradoxo_${r.id}`, eraMap({ geo: r.geo, nome: r.nomeMapa, music: r.music || "era_paradoxo", encontros: [] })]));

/** BRAGLITCH (src/data/braglitch.js): os mapas abertos saem da planta de lá;
 *  os interiores são cópia dos de Kanto com as portas trocadas. Montado uma
 *  vez aqui porque precisa do kanto.json já carregado. */
const MAPAS_BRAGLITCH = kanto ? brag.montarBraglitch(kanto) : {};
/** A CAVERNA DO MONTE SERRA (src/data/caverna-serra.js): os dois andares, e
 *  as bocas do paredão da serra ligadas neles */
// a porta do PRÉDIO DA LIGA de Braglitch e a da SALA (src/data/braglitch-liga.js)
brag.ligarSalaDaLiga?.(MAPAS_BRAGLITCH);
const MAPAS_CAVERNA_SERRA = kanto ? cavernaSerra.montarCavernaSerra(kanto, MAPAS_BRAGLITCH) : {};
/** A SALA SECRETA DA FONTE DE CELADON (src/data/fonte-celadon.js) e a escada da fonte */
const MAPAS_FONTE = kanto ? fonteCeladon.montarFonte(kanto) : {};
/** O CIBERESPAÇO (src/data/ciberespaco.js): o mapa de dentro do computador, com os portais */
const MAPAS_CIBER = kanto ? ciber.montarCiber(kanto) : {};
/** O SUBTERRÂNEO DE KANTO (src/data/subterraneo.js): o mapa de túneis embaixo de tudo */
const MAPAS_SUB = kanto ? sub.montarSubterraneo(kanto) : {};
/** O GINÁSIO DO VOID (src/data/void.js): a porta no preto da MATA DO SACI e a
 *  sala. Vem logo depois de Braglitch porque põe a porta na geometria de lá. */
const MAPAS_VOID = kanto ? vazio.montarVoid(kanto, MAPAS_BRAGLITCH) : {};
/** A LIGA DO VOID (src/data/liga-void.js): mais longe no preto, o prédio da Liga de Kanto */
const ligaVoid = await import("./liga-void.js" + V);
const MAPAS_LIGA_VOID = kanto ? ligaVoid.montarSalaVoid(kanto) : {};
if (kanto) ligaVoid.ligarLigaVoid(kanto, MAPAS_BRAGLITCH, MAPAS_LIGA_VOID);
/** o texto das placas e das portas trancadas, colado por cima do conteúdo */
const BRAG_MUNDO = kanto ? brag.conteudoDoMundo(MAPAS_BRAGLITCH) : {};
const BRAG_PLACAS = brag.placasEPortas(MAPAS_BRAGLITCH, BRAG_MUNDO);
const BRAG_CONTEUDO = Object.fromEntries(Object.entries({ ...brag.BRAGLITCH_MAPS, ...BRAG_MUNDO }).map(([id, { placas, ...m }]) => [id, {
  ...m,
  // os NPCs das MISSÕES postos em mapa de Braglitch (src/data/maps.js, `addNpcs`):
  // o conteúdo daqui substitui o de maps.js inteiro, então eles entram aqui
  npcs: [...(m.npcs || []), ...(maps.MAPS[id]?.addNpcs || [])],
  signs: { ...(BRAG_PLACAS[id]?.signs || {}), ...(m.signs || {}) },
  lockedWarps: { ...(BRAG_PLACAS[id]?.lockedWarps || {}), ...(m.lockedWarps || {}) },
}]));

/** KALOS (src/data/kalos.js): a LUMIOSE, com o mesmo construtor de Braglitch */
const MAPAS_KALOS = kanto ? kalos.montarKalos(kanto) : {};
const MAPAS_AREA_ZERO = kanto ? areaZero.montarAreaZero(kanto) : {};
const MAPAS_ARVORE = kanto ? arvoreOca.montarArvore(kanto) : {};
const MAPAS_ESPACO = kanto ? espaco.montarEspaco(kanto) : {};
const ESP_PLACAS = brag.placasEPortas(MAPAS_ESPACO, espaco.CONTEUDO_ESPACO, {}, {});
const ESP_CONTEUDO = Object.fromEntries(Object.entries(espaco.CONTEUDO_ESPACO).map(([id, { placas, ...m }]) => [id, {
  ...m, signs: { ...(ESP_PLACAS[id]?.signs || {}), ...(m.signs || {}) },
}]));
const AZ_PLACAS = brag.placasEPortas(MAPAS_AREA_ZERO, areaZero.CONTEUDO_AREA_ZERO, {}, {});
const AZ_CONTEUDO = Object.fromEntries(Object.entries(areaZero.CONTEUDO_AREA_ZERO).map(([id, { placas, ...m }]) => [id, {
  ...m, signs: { ...(AZ_PLACAS[id]?.signs || {}), ...(m.signs || {}) },
}]));
const KALOS_PLACAS = brag.placasEPortas(MAPAS_KALOS, kalos.KALOS_CONTEUDO, {}, kalos.PORTA_FECHADA_KALOS);
const KALOS_CONTEUDO = Object.fromEntries(Object.entries(kalos.KALOS_CONTEUDO).map(([id, { placas, ...m }]) => [id, {
  ...m,
  signs: { ...(KALOS_PLACAS[id]?.signs || {}), ...(m.signs || {}) },
  lockedWarps: { ...(KALOS_PLACAS[id]?.lockedWarps || {}), ...(m.lockedWarps || {}) },
}]));

/** As espécies de todas as tabelas, antes do `buildSpecies` (as regiões
 *  criadas precisam saber o que existe pra montar os times delas). */
const ESPECIES_BASE = { ...gen1.GEN1, ...extra.EXTRA, ...reg.REGIONAIS, ...eras.ERAS_ESPECIES,
  ...iniciais.INICIAIS_ESPECIES, ...bones.BONES_ESPECIES, ...decamark.DECAMARK_ESPECIE, ...mais.MAIS,
  ...hack.HACKEANAS, ...brag.BRAGLITCH_ESPECIES, ...rotom.ROTOM_FORMAS, ...mega.MEGA_FORMS,
  ...secretas.SECRETAS_ESPECIES, ...formasBatalha.FORMAS_BATALHA, ...puros.FOSSEIS_PUROS_ESPECIES,
  ...kalos.KALOS_ESPECIES, ...regis.REGIS_ESPECIES };
// AS ULTRA BEASTS DE CARNAVAL também (src/data/carnaval.js)
Object.assign(ESPECIES_BASE, carnaval.especiesCarnaval(ESPECIES_BASE));
// AS FORMAS DE VÍNCULO saem das espécies de sempre (src/data/vinculo.js)
Object.assign(ESPECIES_BASE, vinculo.especiesVinculo(ESPECIES_BASE));
Object.assign(ESPECIES_BASE, secretos.SECRETOS);
Object.assign(ESPECIES_BASE, areaZero.PARADOXOS_AREA_ZERO);
Object.assign(ESPECIES_BASE, conectador.FORMAS_CONECTADAS);   // as formas JUNTAS (o CONECTADOR DE LENDAS)   // os PARADOXOS novos da ÁREA ZERO   // os POKÉMON SECRETOS do PORTAL PARADOXO
Object.assign(ESPECIES_BASE, windsWaves.WINDS_WAVES);   // os iniciais de WINDS AND WAVES (src/data/winds-waves.js)
/** true quando a ilha está sendo desenhada aqui, e não veio do decomp */
export const ILHA_GERADA = !kanto?.birth_island;

/** só entra se o mapa importado não existir */
const ilhaFallback = ILHA_GERADA ? { birth_island: islandMap() } : {};

/** O DB inteiro, com as FORMAS ÚNICAS por cima. O live update (src/core/hot.js)
 *  chama este mesmo `buildDB`: fora daqui, publicar uma forma (que é o que
 *  dispara o hot-swap) apagaria todas elas da memória. */
export function buildDB() {
  const db = montarDB();
  kalos.porAeroportos(db);          // o piloto em VERMILION e SÃO LUCARIO, o mato da LUMIOSE
  areaZero.porHelicoptero(db);
  espaco.porBaseEspacial(db);       // o FOGUETE em CINNABAR (depois da LIGA)
  fabrica.porFabrica(db);
  // OS FORASTEIROS (src/data/forasteiros.js): bicho de outra região em Kanto, um pouco mais raro
  porForasteiros(db, Object.keys(kanto || {}).filter((id) => !String(id).startsWith("espaco")));
  porForasteirosNasRegioes(db);       // e em BRAGLITCH, KALOS, ÁREA ZERO e no ESPAÇO
  // o GOTHITEPASS (GOTHITELLE + NOSEPASS) mora no alto da TORRE POKÉMON: o
  // CAIO achou na calculadora e o grito dele é "música de filme de terror antigo"
  for (const id of ["pokemon_tower_6f", "pokemon_tower_7f"]) {
    const m = db.MAPS[id];
    if (m?.encounters?.length && !m.encounters.some((e) => e.id === "fus-gothitelle-nosepass"))
      m.encounters.push({ id: "fus-gothitelle-nosepass", min: 20, max: 24, w: 2 });
  }
  // EXPLOSÃO (src/data/golpes-mais.js): os que explodem no jogo de verdade
  for (const [id, nv] of [["geodude", 32], ["graveler", 36], ["golem", 36], ["voltorb", 40], ["electrode", 46], ["koffing", 45],
                          ["weezing", 51], ["pineco", 39], ["forretress", 39], ["gastly", 50], ["haunter", 52], ["gengar", 52]]) {
    const sp = db.SPECIES?.[id];
    if (sp?.learnset && !sp.learnset.some(([, g]) => g === "explosao")) { sp.learnset.push([nv, "explosao"]); sp.learnset.sort((a, b) => a[0] - b[0]); }
  }
  // PODER ANCESTRAL (src/data/golpes-mais.js): os FÓSSEIS e os bichos antigos aprendem
  // (e quem evolui sabendo ele no jogo de verdade — PILOSWINE, YANMA, TANGELA, LICKITUNG)
  for (const [id, nv] of [["aerodactyl", 33], ["omanyte", 40], ["omastar", 40], ["kabuto", 36], ["kabutops", 36],
                          ["lileep", 36], ["cradily", 36], ["anorith", 36], ["armaldo", 36], ["cranidos", 28], ["rampardos", 28],
                          ["shieldon", 28], ["bastiodon", 28], ["tyrunt", 1], ["tyrantrum", 1], ["amaura", 1], ["aurorus", 1],
                          ["piloswine", 33], ["mamoswine", 33], ["yanma", 33], ["yanmega", 33], ["tangela", 33], ["tangrowth", 33],
                          ["lickitung", 33], ["lickilicky", 33], ["togepi", 33], ["togetic", 33], ["celebi", 10], ["mew", 30]]) {
    const sp = db.SPECIES?.[id];
    if (sp?.learnset && !sp.learnset.some(([, g]) => g === "poderancestral")) {
      sp.learnset.push([nv, "poderancestral"]);
      sp.learnset.sort((a, b) => a[0] - b[0]);
    }
  }           // a FÁBRICA DE POKÉBOLAS na USINA e o AZUL em VIRIDIAN (depois da LIGA)
  // os 99 GOLPES OFICIAIS: quem aprende subindo de nível, no nível dos jogos (a forma sem lista usa a da espécie)
  for (const [id, sp] of Object.entries(db.SPECIES || {})) {
    if (!Array.isArray(sp.learnset) || sp.fusao) continue;
    const lista = golpesOficiais.NIVEL_OFICIAL[id] || golpesOficiais.NIVEL_OFICIAL[sp.formaDe] || golpesOficiais.NIVEL_OFICIAL[sp.megaDe];
    if (!lista) continue;
    const tem = new Set(sp.learnset.map(([, g]) => g));
    const novos = lista.filter(([, g]) => !tem.has(g) && db.MOVES[g]);
    if (novos.length) sp.learnset = [...sp.learnset, ...novos].sort((a, b) => a[0] - b[0]);
  }
  // as CÉLULAS DE ZYGARDE (a missão O Z DO DNA pede 200 no CUBO): na grama da ROTA 10
  // e no TÚNEL ROCHA, de onde veio a amostra (1 em cada 4 encontros, mais ou menos)
  for (const m of ["route10", "rock_tunnel_1f", "rock_tunnel_b1f"]) {
    const t = db.MAPS?.[m]?.encounters;
    if (t && db.SPECIES?.celulazygarde && !t.some((e) => e.id === "celulazygarde")) t.push({ id: "celulazygarde", min: 14, max: 20, w: 33 });
  }
  arvoreOca.porArvore(db);          // a ÁRVORE OCA da ROTA 1 (o GUZZLORD)
  // o DITTO só aprende a TRANSFORMAÇÃO, como no jogo original (src/data/golpes-mais.js)
  if (db.SPECIES?.ditto && db.MOVES?.transformacao) db.SPECIES.ditto.learnset = [[1, "transformacao"]];
  // o ETERNATUS no nível 1 só sabe o RAIO ETERNO (pedido do CAIO); o resto vem depois, nos níveis de sempre
  if (db.SPECIES?.eternatus && db.MOVES?.raioeterno) db.SPECIES.eternatus.learnset = [[1, "raioeterno"], ...db.SPECIES.eternatus.learnset.filter(([l, m]) => l > 1 && m !== "raioeterno")];      // o HELICÓPTERO da ÁREA ZERO em VIRIDIAN (depois da LIGA)
  aplicarUnicas(db, unicas.FORMAS_UNICAS);
  musicasKanto.musicasDoFirered(db);   // Kanto com as músicas do FireRed
  fundoDoMar.gerarFundos(db);          // o FUNDO DO MAR de cada mapa com mar (src/data/fundo-do-mar.js)
  return db;
}

function montarDB() {
  return {
    CONFIG: config.CONFIG,
    TYPES: types.TYPES,
    TYPE_COLOR: types.TYPE_COLOR,
    CHART: types.CHART,
    effectiveness: types.effectiveness,
    // os GOLPES Z de tipo entram junto: eles não se aprendem, mas o motor de
    // batalha procura todo golpe por id nesta mesma tabela
    MOVES: { ...moves.MOVES, ...golpesMais.MAIS_GOLPES, ...golpesOficiais.GOLPES_OFICIAIS, ...zc.Z_GOLPES, ...hab.GOLPES_DE_CLIMA, ...kalos.KALOS_GOLPES },
    HABILIDADES: hab.HABILIDADES,
    HABILIDADE_DE: hab.HABILIDADE_DE,
    HABILIDADE_POR_TIPO: hab.HABILIDADE_POR_TIPO,
    HABILIDADE_ASSINATURA: hab.HABILIDADE_ASSINATURA,
    CLIMA_TEXTO: hab.CLIMA_TEXTO,
    PESOS: pesos.PESOS,
    GEN1: gen1.GEN1,
    DEX_ORDER: gen1.DEX_ORDER,
    SPECIES: species.buildSpecies(ESPECIES_BASE, types.TYPE_COLOR, textos.DEX_TEXTOS, golpesMais.MAIS_GOLPES),
    EXTRA: extra.EXTRA,
    // as formas regionais entram na fenda junto com o resto que vaza pra lá
    // ...e AS QUE FALTAVAM (src/data/mais.js) também, com o mesmo peso TOTAL da
    // tabela de origem repartido entre elas: metade dos encontros continua
    // sendo o que a fenda sempre teve, metade é o que vazou agora
    DIM_ENCOUNTERS: Object.fromEntries(Object.entries(extra.DIM_ENCOUNTERS).map(
      ([terreno, lista]) => [terreno, comPesoDeCasa(
        [...lista, ...(reg.DIM_REGIONAIS[terreno] || []), ...(hack.DIM_HACKEANAS[terreno] || [])],
        mais.MAIS_DIM[terreno] || [])])),
    REGIONAIS: reg.REGIONAIS,
    // AS FORMAS HACKEANAS entram no mesmo rótulo de região das regionais: pra
    // quem lê a Pokédex, "HACK" é de onde aquele bicho veio (src/data/hackeanas.js)
    REGIAO: { ...reg.REGIAO, ...hack.REGIAO_HACKEANAS, ...brag.REGIAO_ESPECIES },
    HACKEANAS: hack.HACKEANAS,
    HACK_BASE_DE: hack.BASE_DE,
    PEDRA_GELO: reg.PEDRA_GELO,
    WEATHER_TRIO: extra.WEATHER_TRIO,
    RARE_LEGEND: extra.RARE_LEGEND,
    FUSAO_SELVAGEM: extra.FUSAO_SELVAGEM,
    DEOXYS_FORMS: extra.DEOXYS_FORMS,
    CUBO_ZYGARDE: extra.CUBO_ZYGARDE,
    ZYGARDE_CACADA: extra.ZYGARDE_CACADA,
    TEMPESTADE: extra.TEMPESTADE,
    ESTATICOS: [...extra.ESTATICOS, ...bones.BONES_ESTATICOS, decamark.DECAMARK_ESTATICO, fonteCeladon.ESTATICO_FONTE, ciber.ESTATICO_CIBER, ligaKanto.ESTATICO_VITORIA],
    FONTE_CELADON: fonteCeladon.FONTE, FONTE_TEXTO: fonteCeladon.FONTE_TEXTO,
    CIBER: ciber.CIBER, CIBER_TEXTO: ciber.CIBER_TEXTO,
    DECAMARK: { registro: decamark.REGISTRO, naFenda: decamark.REGISTRO_NA_FENDA },
    REGIS: regis.REGIS,
    REGIS_TEXTO: regis.REGIS_TEXTO,
    CRISTAL: bones.CRISTAL,
    ZCRISTAIS: zc.ZCRISTAIS,
    ITENS_RENOMEADOS: zc.RENOMEADOS,
    // AS PROVAÇÕES da ILHA DOIS: de onde os cristais de tipo saem agora
    PROVACOES: prov.PROVACOES,
    PROVACAO_GUARDIA: prov.GUARDIA,
    PROVACOES_TEXTO: prov.PROVACOES_TEXTO,
    TOTEM: prov.TOTEM,
    // AS BATALHAS DUPLAS (e em trio): src/data/duplas.js
    ESPALHA: duplas.ESPALHA,
    FORCA_ESPALHADA: duplas.FORCA_ESPALHADA,
    AJUDANTES: duplas.AJUDANTES,
    AJUDANTE_ABAIXO: duplas.AJUDANTE_ABAIXO,
    TRIO_A_PARTIR: duplas.TRIO_A_PARTIR,
    DUPLAS_TREINADORES: duplas.DUPLAS_TREINADORES,
    DUPLA_TEXTO: duplas.DUPLA_TEXTO,
    // A POKÉDEX: as falas do professor, os marcos e o AMULETO (src/data/pokedex.js)
    POKEDEX_TEXTO: dex.POKEDEX_TEXTO,
    MARCOS_DEX: dex.MARCOS,
    MARCOS_NACIONAL: dex.MARCOS_NACIONAL,
    AMULETO: dex.AMULETO,
    NOME_STAT: prov.NOME_STAT,
    DESCIDA: desc.DESCIDA,
    BOLAS: bolas.BOLAS,
    ANIVERSARIO: aniv.ANIVERSARIO,
    ANIVERSARIO_TEXTO: aniv.ANIVERSARIO_TEXTO,
    ERAS: eras.ERAS,
    CELEBI: eras.CELEBI,
    ERAS_TEXTO: eras.ERAS_TEXTO,
    MOTOQUEIROS: moto.MOTOQUEIROS,
    EH_BONE: bones.EH_BONE,
    TRIO_CHANCE: extra.TRIO_CHANCE,
    SHINY_EVERY: extra.SHINY_EVERY,
    FRAGMENT_SPOTS: frags.FRAGMENT_SPOTS,
    SPOT_CHANCE: frags.SPOT_CHANCE,
    SPOT_STEP: frags.SPOT_STEP,
    SPOT_RESET: frags.SPOT_RESET,
    NEAR_SIGNS: frags.NEAR_SIGNS,
    FALLBACK_CHANCE: frags.FALLBACK_CHANCE,
    DIM_LOOT: loot.DIM_LOOT,
    DIM_LOOT_COUNT: loot.DIM_LOOT_COUNT,
    DIM_LOOT_SPREAD: loot.DIM_LOOT_SPREAD,
    EVOLUTIONS: { ...evo.EVOLUTIONS },
    EVO_ITEMS: evo.EVO_ITEMS,
    PRE_EVOLUCAO: evo.PRE_EVOLUCAO,
    STONES: evo.STONES,
    FIELD_MOVES: field.FIELD_MOVES,
    FIELD_LEARNERS: field.FIELD_LEARNERS,
    FLY_SPOTS: { ...field.FLY_SPOTS, ...brag.VOO_BRAGLITCH },
    MUSIC: { ...music.MUSIC, ...brag.BRAGLITCH_MUSIC, ...musicaLumiose.LUMIOSE_MUSIC, ...musicaMegaDesc.MEGA_DESC_MUSIC, ...musicasFrlg.FRLG_MUSIC,
             ...musicaLumioseCidade.LUMIOSE_CIDADE_MUSIC, ...musicasBrag.MUSICAS_BRAGLITCH },
    POKEBLOCOS: pokeblocos,
    EVENTOS: eventos.EVENTOS,
    MUSIC_ALIAS: music.MUSIC_ALIAS,
    ITEM_LORE: { ...loot.ITEM_LORE, ...mega.PEDRA_LORE, ...kalos.KALOS_LORE, ...bolas.BOLA_LORE, ...ovos.OVO_LORE, ...decamark.DECAMARK_LORE,
                 [dex.AMULETO.item]: dex.AMULETO.lore },
    STARTERS: species.STARTERS,
    BOX: box.BOX,
    BOX_PAPEIS: box.BOX_PAPEIS,
    MEGAS: mega.MEGAS,
    MEGA_FORMS: mega.MEGA_FORMS,
    MEGA_PEDRAS: mega.MEGA_PEDRAS,
    MEGA_ANEL: mega.ANEL,
    FUSAO: fusao.FUSAO,
    FUSOES: fusoes.FUSOES,
    FUSOES_FEITAS: feitas.FUSOES_FEITAS,
    CONCURSO: concurso.CONCURSO,
    MISSOES: missoes.MISSOES,
    TROCAS: trocas.TROCAS,
    DISTORCOES: distorcoes.DISTORCOES,
    GLITCH_ZONES: zonas.GLITCH_ZONES,
    OVOS: ovos.OVOS,
    MINERACAO: { ...mina, ACHADOS: [...mina.ACHADOS, ...achadosDasEstatuas()],
                 MINA_LORE: { ...mina.MINA_LORE, ...loreDasEstatuas() } },
    SUBTERRANEO: { MAPA: sub.SUB_MAPA, SALAS: sub.SALAS, DESCE_EM: sub.DESCE_EM, FATOR_ESTATUA: sub.FATOR_ESTATUA,
                   BRILHOS_POR_DIA: sub.BRILHOS_POR_DIA, TEXTO: sub.SUB_TEXTO },
    PURIFICADOR: puros.PURIFICADOR,
    PURIFICAVEIS: puros.PURIFICAVEIS,
    PAINTBALL: paintball.PAINTBALL, PREMIOS_FICHAS: paintball.PREMIOS_FICHAS,
    DOCES: doces.DOCES, DOCES_TEXTO: doces.DOCES_TEXTO, DOCES_MAX: doces.MAX_CORES,
    KIT_BASE: bases.KIT_BASE, QUARTO: bases.QUARTO, CORES_BASE: bases.CORES_BASE, DESENHO_PC: bases.DESENHO_PC,
    MOVEIS: { ...bases.MOVEIS, ...moveisDasEstatuas() },
    CABECAS_MARCADAS: cabecas.CABECAS_MARCADAS, MOVEIS_FICHAS: bases.MOVEIS_FICHAS, BASES_TEXTO: bases.BASES_TEXTO,
    BEBIDAS: bebbidah.BEBIDAS, BEBIDA_TONS: bebbidah.TONS, BEBIDA_TOM_POR_NIVEL: bebbidah.TOM_POR_NIVEL,
    BEBIDA_TOM_FORA: bebbidah.TOM_FORA, BEBBIDAH_GIRO: bebbidah.GIRO, BEBBIDAH_TEXTO: bebbidah.BEBBIDAH_TEXTO,
    SEGURAVEIS: segurar.SEGURAVEIS, SEGURAR_CONFIG: segurar.SEGURAR_CONFIG, SEGURAR_TEXTO: segurar.SEGURAR_TEXTO,
    GO_PARK: gopark.GO_PARK, CPM: gopark.CPM, MINIJOGOS_GO: gopark.MINIJOGOS_GO, MINIJOGO_POR_TIPO: gopark.MINIJOGO_POR_TIPO,
    PREMIO_GO: gopark.PREMIO_GO, GO_TEXTO: gopark.GO_TEXTO, GO_PARQUE_NOME: gopark.GO_PARQUE_NOME,
    SPINDA_MANCHAS: spinda.SPINDA_MANCHAS, SPINDA_CORPO: spinda.SPINDA_CORPO, SPINDA_MANCHA: spinda.SPINDA_MANCHA,
    SPINDA_UNOWN: spindaUnown.SPINDA_UNOWN,
    OVO_TEXTO: ovos.OVO_TEXTO,
    ZONA_TEXTO: zonas.ZONA_TEXTO,
    SEVII: sevii.SEVII,
    NOMES_SEVII: sevii.NOMES,
    PORTOS: sevii.PORTOS,
    BRAVOS: bravos.BRAVOS,
    REGIOES: iniciais.REGIOES,
    LINHAS: iniciais.LINHAS,
    ARISCOS: bravos.ARISCOS,
    SO_FOGEM: bravos.SO_FOGEM,
    ITENS_CURA: itensUso.ITENS_CURA,
    ITENS_BATALHA: itensUso.ITENS_BATALHA,
    BICICLETA: itensUso.BICICLETA,
    BOLSOS: itensUso.BOLSOS,
    RIVAL: rival.RIVAL,
    RATICATE_DO_RIVAL: rival.RATICATE_DO_RIVAL,
    VERSAO: versao.VERSAO,
    VOLUME: versao.VOLUME,
    MISSAO_TEXTO: missoes.MISSAO_TEXTO,
    IDIOMAS: idiomas.IDIOMAS,
    DICIONARIOS: idiomas.DICIONARIOS,
    AVISO_IDIOMA: idiomas.AVISO_IDIOMA,
    ONLINE: online.ONLINE,
    FRASES: online.FRASES,
    EMOTES: online.EMOTES,
    BONECOS_IA: online.BONECOS_IA,
    ONLINE_TEXTO: online.ONLINE_TEXTO,
    GIFT_CODES: gifts.GIFT_CODES,
    GIFT_TEXTO: gifts.GIFT_TEXTO,
    MAPS: musicasBrag.aplicarMusicasBrag(mergeMaps({ ...kanto, ...ilhaFallback, glitchdim: dimensionMap(story.STORY),
                     tempestade: stormMap(story.STORY), ...MAPAS_ERAS, ...MAPAS_PORTAL, ...MAPAS_BRAGLITCH, ...MAPAS_CAVERNA_SERRA, ...MAPAS_FONTE, ...MAPAS_CIBER, ...MAPAS_SUB, ...MAPAS_VOID, ...MAPAS_KALOS, ...MAPAS_AREA_ZERO, ...MAPAS_ARVORE, ...MAPAS_ESPACO, ...MAPAS_LIGA_VOID },
                    { ...maps.MAPS, ...BRAG_CONTEUDO, ...vazio.CONTEUDO_VOID, ...cavernaSerra.CONTEUDO_CAVERNA_SERRA, ...fonteCeladon.CONTEUDO_FONTE, ...ciber.CONTEUDO_CIBER, ...conteudoSub(), ...KALOS_CONTEUDO, ...AZ_CONTEUDO, ...arvoreOca.CONTEUDO_ARVORE, ...ESP_CONTEUDO, ...ligaVoid.CONTEUDO_LIGA_VOID }),
                    Object.keys(MAPAS_BRAGLITCH).filter((id) => MAPAS_BRAGLITCH[id]?.regiao === "braglitch")),
    STORY: story.STORY,
    FUNDO_TEXTO: fundoDoMar.FUNDO_TEXTO,
    PORTAL: portal.PORTAL, RUNAS: portal.RUNAS, RECEITAS_PORTAL: portal.RECEITAS,
    POS_POS: posPos.POS_POS,   // o FUNDO DO MAR (src/data/fundo-do-mar.js)
    TRUNFO_TEXTO: story.TRUNFO_TEXTO,
    KANTO: { ...(kanto || {}), ...ilhaFallback, glitchdim: dimensionMap(story.STORY),
             tempestade: stormMap(story.STORY), ...MAPAS_ERAS, ...MAPAS_PORTAL, ...MAPAS_BRAGLITCH, ...MAPAS_CAVERNA_SERRA, ...MAPAS_FONTE, ...MAPAS_CIBER, ...MAPAS_SUB, ...MAPAS_VOID, ...MAPAS_KALOS, ...MAPAS_AREA_ZERO, ...MAPAS_ARVORE, ...MAPAS_ESPACO, ...MAPAS_LIGA_VOID },
    // KALOS: o avião (src/data/kalos.js); o piloto entra no `buildDB`
    AVIAO: kalos.AVIAO,
    AREA_ZERO: areaZero.AREA_ZERO,
    MT_OFICIAIS,
    FABRICA: fabrica.FABRICA, BOLAS_NOVAS: fabrica.BOLAS_NOVAS,
    ESPACO: espaco.ESPACO, PLANETAS: espaco.PLANETAS, SOL: espaco.SOL, GALAXIAS: espaco.GALAXIAS,
    CONECTADOR: conectador.CONECTADOR,
    ARVORE: arvoreOca.ARVORE,
    GINASIO_VOID: vazio.GINASIO_VOID,
    LIGA_VOID: ligaVoid.LIGA_VOID,
    LENDAS_VOID: vazio.LENDAS_VOID,
    GUIA_VOID: vazio.GUIA_VOID,
    // BRAGLITCH: a região, a história e o barco (src/data/braglitch.js)
    BRAGLITCH: brag.BRAGLITCH,
    BRAGLITCH_TEXTO: brag.BRAGLITCH_TEXTO,
    BONDINHO: brag.BONDINHO,
    // AS ILHAS: a história de lá (src/data/braglitch-ilhas.js)
    ILHAS_BRAG: brag.ILHAS_BRAG,
    ILHAS_TEXTO: brag.ILHAS_TEXTO,
    PEDRAS_BRAG: brag.PEDRAS_BRAG,
    EVO_BRAGLITCH: brag.EVO_BRAGLITCH,
    SACI_NA_MATA: brag.SACI_NA_MATA,
    INSIGNIAS_BRAG: brag.INSIGNIAS_BRAG,
    INSIGNIAS_ILHAS: brag.INSIGNIAS_ILHAS,
    LENDAS_BRAG: brag.LENDAS,
    LUGAR_DO_GEMEO: brag.LUGAR_DO_GEMEO,
    LIGA_BRAG: brag.LIGA_BRAG,
    DESCONTROLADAS: descontroladas.DESCONTROLADAS,
    MARCAS_SECRETAS: secretas.MARCAS_SECRETAS,
    COGUMELOS: secretas.COGUMELOS,
    GUARDA_ROUPA: guardaRoupa.GUARDA_ROUPA,
    COMPANHEIRO: companheiro.COMPANHEIRO,
    VINCULO: vinculo.VINCULO,
    ASH: ash.ASH,
    BICOS: bicos.BICOS,
    GEMEO: rival.GEMEO,
    AMIGOS: amigos.AMIGOS,
    TIRINHAS: amigos.TIRINHAS,
    MAPA_REGIAO: brag.MAPA_REGIAO,
    PANDEIRO_TEXTO: brag.PANDEIRO_TEXTO,
    BARCO: brag.BARCO,
    CUIA: brag.CUIA,
    CATALOGO_ROTOM: rotom.CATALOGO,
    MONTARIAS: brag.MONTARIAS,
    PANDEIROS: brag.PANDEIROS,
    PANDEIRO_GANHOU: brag.PANDEIRO_GANHOU,
    ENCONTROS_PROFS: brag.ENCONTROS_PROFS,
    PROFS: brag.PROFS,
    TAG: maps.TAG,
    LEDGE_DIR: maps.LEDGE_DIR,
    START_MAP: maps.START_MAP,
  };
}

// O SUBTERRÂNEO DE KANTO (src/data/subterraneo.js): o conteúdo do mapa e as
// ESTÁTUAS — que são achado da parede (só lá embaixo), móvel de base e item com lore
function conteudoSub() {
  const placas = {};
  for (const s of Object.values(sub.SALAS)) placas[`${s.x - 4},${s.y - 2}`] = `${s.nome}.\nA ESCADA DO CANTO SOBE PRA ONDE VOCÊ DESCEU.`;
  const p = sub.SALAS.saffron_city;
  return {
    [sub.SUB_MAPA]: {
      name: "SUBTERRÂNEO DE KANTO", music: "bragCaverna", interior: false, caverna: true,
      encounters: sub.SELVAGENS_SUB, signs: placas, lockedWarps: {}, npcs: [],
      spawn: { x: p.x, y: p.y, dir: "down" },
    },
  };
}
const nomeEstatua = (id) => `estátua de ${id}`;
function achadosDasEstatuas() {
  return sub.ESTATUAS.map((id) => ({ item: nomeEstatua(id), w: 1, cor: "#b8b8c0", desenho: "estatua", mon: id,
                                     onde: "subterraneo", forma: [[0, 0], [1, 0], [0, 1], [1, 1]] }));
}
function moveisDasEstatuas() {
  return Object.fromEntries(sub.ESTATUAS.map((id) => [nomeEstatua(id), { tipo: "estatua", mon: id, estatua: id }]));
}
function loreDasEstatuas() {
  return Object.fromEntries(sub.ESTATUAS.map((id) => [nomeEstatua(id), sub.SUB_TEXTO.estatuaLore.replaceAll("{MON}", id.toUpperCase())]));
}

/** Objeto vivo: o hot-swap faz Object.assign neste mesmo objeto. */
export const DB = buildDB();

/** AS FORMAS ÚNICAS viram espécies próprias: a original inteira (atributos,
 *  golpes, evolução, e os tipos — a menos que a forma tenha `tipos` próprios),
 *  com o nome e o desenho de quem fez. Ela pode escolher pra quem evolui
 *  (`evoluiPra`, no UNIQUEMON): uma espécie oficial ou outra forma única. O id é
 *  "<espécie>u<id>". `DB.UNICAS_DE` diz quais formas cada espécie tem — é
 *  por ali que o GUARDA-ROUPA ÚNICO lista as roupas (src/systems/unicas.js). */
function aplicarUnicas(db, todas) {
  db.UNICAS_DE = {};
  for (const [base, lista] of Object.entries(todas || {})) {
    const sp = db.SPECIES[base];
    if (!sp || !Array.isArray(lista)) continue;
    for (const f of lista) {
      if (!f?.id || !f.sprite) continue;
      const id = `${base}u${f.id}`;
      // TIPOS próprios (opcional, escolhidos no UNIQUEMON): só os que existem
      const tipos = (Array.isArray(f.tipos) ? f.tipos : []).filter((t) => db.TYPE_COLOR?.[t]).slice(0, 2);
      db.SPECIES[id] = { ...sp, id, name: f.nome || sp.name, unicaDe: base, autor: f.autor || "",
                         types: tipos.length ? tipos : sp.types,
                         spriteUrl: f.sprite, spriteDex: undefined, soEvolucao: true,
                         // a ANIMAÇÃO que o jogador desenhou no UNIQUEMON (opcional):
                         // { sprite, w, h, col, ms: [...] } — sem ela, a gerada
                         ...(f.animacao?.sprite ? { animacao: f.animacao } : {}) };
      (db.UNICAS_DE[base] ||= []).push(id);
      // a forma evolui como a original (uma CÓPIA das regras: a ligação abaixo
      // mexe nelas, e mexer na lista da original mudaria a original também)
      if (db.EVOLUTIONS[base]) db.EVOLUTIONS[id] = db.EVOLUTIONS[base].map((r) => ({ ...r }));
    }
  }
  // EVOLUI PRA QUEM (escolhido no UNIQUEMON): `evoluiPra` é uma espécie
  // ("sliggoohisui", o SLIGGOO de Hisui oficial) ou outra forma única
  // ("sliggoo:<id>"). A forma passa a evoluir SÓ pra ela, com a mesma regra
  // (nível, pedra...) que a original usa pra chegar naquela espécie — sem a
  // exigência de lugar: escolhida, ela vale em qualquer canto.
  for (const [base, lista] of Object.entries(todas || {})) {
    for (const f of Array.isArray(lista) ? lista : []) {
      const eu = `${base}u${f?.id}`, alvo = String(f?.evoluiPra || "");
      if (!alvo || !db.SPECIES[eu]) continue;
      const [alvoBase, alvoId] = alvo.split(":");
      const para = alvoId ? `${alvoBase}u${alvoId}` : alvoBase;
      if (!db.SPECIES[para]) continue;
      const regras = db.EVOLUTIONS[base] || [];
      const r0 = regras.find((r) => r.to === alvoBase) || regras[0];
      if (!r0) continue;
      const { onde, ...regra } = r0;
      db.EVOLUTIONS[eu] = [{ ...regra, to: para }];
    }
  }
}
