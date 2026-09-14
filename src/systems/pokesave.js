// POKÉSAVE: uma partida em que VOCÊ É UM POKÉMON.
//
// Você escolhe a espécie (qualquer uma do jogo, forma regional inclusive), a
// cor (comum, shiny ou luminoso) e um nome, e a partida começa com você no
// mato — sem casa, sem mãe, sem professor — andando por Kanto como um selvagem
// que resolveu virar treinador: o desenho no mapa é o sprite do Pokémon
// (frente, costas quando sobe, espelhado quando vai pra direita), e o Pokémon
// que você é está na equipe com a marca `eu`, que é a única coisa que o
// distingue dos outros. Ele luta como qualquer um, sobe de nível, evolui — e
// quando evolui, você evolui: o mapa passa a desenhar a forma nova.
//
// O save guarda `st.pokesave = { species, shiny, luminoso }` — é só isso que o
// mapa olha pra decidir o que desenhar. A página pokesave/ monta o link
// (`?pokesave=especie.cor.nome`) que cria a partida (src/main.js).
import { DB } from "../data/index.js";
import { Assets } from "../core/assets.js";
import { createMon, evolutionFor } from "./mon.js";
import { relogio } from "./ciclo.js";

export const CORES = ["comum", "shiny", "luminoso"];

/** Onde dá pra nascer: os mapas de fora (rota, cidade, ilha), e nenhum dos
 *  gerados em código (a fenda, a zona, as eras). */
export function mapasDeNascer() {
  const fora = new Set(["glitchdim", "tempestade", "glitchzone", ...((DB.ERAS || []).map((e) => e.mapa))]);
  return Object.entries(DB.MAPS || {})
    .filter(([id, m]) => !m.interior && !fora.has(id) && DB.KANTO?.[id]?.tags)
    .map(([id, m]) => ({ id, nome: m.name }))
    .sort((a, b) => a.nome.localeCompare(b.nome));
}

/** `?pokesave=vulpixalola.shiny.30.route22.NEVE` -> { species, cor, nivel,
 *  mapa, nome } ou null. O formato velho (`especie.cor.nome`) ainda vale. */
export function lerCodigo(codigo) {
  const partes = String(codigo || "").split(".");
  const [species, cor = "comum"] = partes;
  if (!DB.SPECIES?.[species] || DB.SPECIES[species].mega || DB.SPECIES[species].fusao) return null;
  const c = CORES.includes(cor) ? cor : "comum";
  let nivel = 5, mapa = "route1", resto = partes.slice(2);
  if (/^\d+$/.test(resto[0] || "")) {                 // formato novo: nível e mapa antes do nome
    nivel = Math.max(1, Math.min(100, +resto[0]));
    mapa = mapasDeNascer().some((m) => m.id === resto[1]) ? resto[1] : "route1";
    resto = resto.slice(2);
  }
  const nome = resto.join(".").toUpperCase().replace(/[^A-Z0-9ÁÀÂÃÉÊÍÓÔÕÚÇ .,!?'\-]/g, "").trim().slice(0, 10);
  return { species, cor: c, nivel, mapa, nome: nome || DB.SPECIES[species].name.slice(0, 10) };
}

export const codigo = (species, cor, nivel, mapa, nome) => [species, cor, nivel, mapa, nome].join(".");

/** Monta a partida: o estado já veio de `newGame()`. Devolve o Pokémon que
 *  você é. Começa na ROTA 1 — é mato, e é o começo de tudo. */
export function criarPokesave(st, { species, cor, nome, nivel = 5, mapa = "route1" }) {
  const mon = createMon(species, nivel, { shiny: cor === "shiny", luminoso: cor === "luminoso", nickname: nome });
  mon.eu = true;
  st.party.push(mon);
  st.caught[species] = true;
  st.seen[species] = true;
  st.player.name = nome;
  st.pokesave = { species, shiny: mon.shiny, luminoso: mon.luminoso };
  st.flags.starterChosen = true;      // o professor não tem o que te dar
  st.flags.momGift = true;            // nem a mãe
  // Onde nascer: o mapa escolhido, no `spawn` dele — e a cena desencalha se o
  // spawn automático cair em parede (na ROTA 1 caía dentro da cerca, então
  // ela tem ponto próprio: o meio do caminho, logo acima do portão de Pallet).
  if (mapa === "route1" || !DB.MAPS[mapa]) Object.assign(st.player, { map: "route1", x: 12, y: 34, dir: "up" });
  else Object.assign(st.player, { map: mapa, ...DB.MAPS[mapa].spawn, dir: "down" });
  return mon;
}

/** AS HABILIDADES: sendo um Pokémon, você faz fora da batalha o que o seu
 *  tipo faz — VOAR se é de VOADOR/DRAGÃO, SURFAR se é de ÁGUA, CORTE, FORÇA,
 *  QUEBRA-ROCHA — sem precisar saber o golpe. A tabela é a mesma que diz o
 *  que a SRTA. JOY ensina por tipo (FIELD_LEARNERS, src/data/field.js). */
export function euSei(st, golpe) {
  const eu = quemSou(st);
  if (!eu || eu.hp <= 0) return null;
  if (eu.moves.some((m) => m.id === golpe)) return eu;
  const regra = DB.FIELD_LEARNERS?.[golpe];
  return regra && (eu.types || []).some((t) => regra.tipos.includes(t)) ? eu : null;
}

// --------------------------------------------------------------- O CAÇADOR
// Sendo um Pokémon selvagem, tem sempre alguém atrás de você: um TREINADOR
// caçando por Kanto. Em todo mapa de fora ele aparece longe e vem andando na
// sua direção; quando encosta, é batalha — sem pergunta, caçador não pergunta.
// A equipe dele é do lugar (a tabela de encontro dali), no seu nível. Vencer
// paga, e ele some por um tempo antes de voltar a caçar. O estado mora no
// save (`st.cacador`): mapa, posição, e até quando ele está fora.
export const CACADOR = {
  passo: 0.27,          // segundos por tile — o mesmo andar de quem joga (16 quadros)
  longe: 9,             // chega a pelo menos isto de você
  chegaEm: 7,           // segundos depois de você trocar de mapa, ele chega
  folga: 150,           // segundos fora depois de perder
  maxEquipe: 6,
  visao: 8,             // até onde ele te enxerga (fora disso, caça bicho)
  fugitivoVisao: 6,     // vezes mais, depois que você fugiu dele dormindo
  fugitivoRaiva: 10000, // a raiva que ele ganha POR DIA procurando você
  fugitivoTempo: 60,    // o tempo do pokésave corre isto de vezes mais rápido (cada minuto, um segundo)
  entreSonos: 8,        // minutos DE VERDADE entre uma dormida no Centro e a próxima
  inicio: [{ id: "rattata", lvl: 3 }, { id: "pidgey", lvl: 4 }],   // o que ele leva de Pallet
  /** a chance de a bola dele te pegar: `base` + `ferido` * (1 - hp/máx) */
  bola: { base: 0.12, ferido: 0.7 },
  nomes: ["CAÇADOR ODAIR", "CAÇADORA IVY", "CAÇADOR NILTON", "CAÇADORA REGINA", "CAÇADOR JUCA"],
  falas: ["TE ACHEI! UM SELVAGEM RARO ANDANDO POR AÍ COMO SE FOSSE GENTE.", "VOCÊ VAI PRA MINHA COLEÇÃO."],
  depois: ["...ESCAPOU. MAS EU VOLTO."],
};

/** Onde o caçador está. ELE COMEÇA EM PALLET — é de lá que todo treinador
 *  sai — e vem atrás de você de mapa em mapa: quando você troca de mapa, ele
 *  chega no seu, uns segundos depois, pela borda por onde você entrou (ou
 *  num canto longe, se você veio de porta). Chamado ao chegar num mapa; o
 *  `atraso` é o que faz ele parecer que veio andando. */
export function posicionarCacador(st, cena, { deOnde = null, atraso = 0 } = {}) {
  if (!st.pokesave || st.capturado || st.cacador?.aposentado) return;
  const c = (st.cacador ||= {});
  c.nome ||= CACADOR.nomes[Math.floor(Math.random() * CACADOR.nomes.length)];
  if (!c.casa) {
    // sai de Pallet como todo treinador: com dois bichos básicos de nível baixo
    c.casa = true; c.map = "pallet"; c.x = 12; c.y = 12; c.dir = "down";
    c.equipe = CACADOR.inicio.map((e) => ({ ...e }));
  }
  if (c.ate && Date.now() < c.ate && !c.fugitivo) return;  // ainda lambendo a ferida
  if (c.fugitivo && !c.fugitivo.avisou) return;             // ainda dormindo: só de manhã
  const mapa = st.player.map;
  const m = DB.MAPS[mapa];
  if (!m || m.interior || mapa === "glitchzone" || mapa === "glitchdim") { c.espera = null; return; }
  if (c.map === mapa && c.x != null) return;               // já está aqui
  // chega daqui a pouco: guarda de onde e quando
  c.espera = { mapa, deOnde, em: Date.now() + (atraso || CACADOR.chegaEm) * 1000 };
}

/** O caçador entra no mapa quando dá a hora (ver posicionarCacador). */
export function chegarCacador(st, cena) {
  const c = st?.cacador;
  const e = c?.espera;
  if (st?.capturado || !e || e.mapa !== st.player.map || Date.now() < e.em) return false;
  c.espera = null;
  const p = st.player;
  const g = DB.KANTO[p.map];
  const cands = [];
  // pela borda por onde você entrou...
  if (e.deOnde && g) {
    for (let i = 0; i < g.w && cands.length < 40; i += 1) {
      const pt = e.deOnde === "up" ? { x: i, y: 0 } : e.deOnde === "down" ? { x: i, y: g.h - 1 }
               : e.deOnde === "left" ? { x: 0, y: i % g.h } : { x: g.w - 1, y: i % g.h };
      cands.push(pt);
    }
  }
  // ...ou num canto longe
  for (let t = 0; t < 60; t++) {
    cands.push({ x: p.x + Math.round((Math.random() * 2 - 1) * 18), y: p.y + Math.round((Math.random() * 2 - 1) * 14) });
  }
  const tam = tamanhoDoCacador(c);
  for (const { x, y } of cands) {
    if (Math.abs(x - p.x) + Math.abs(y - p.y) < CACADOR.longe) continue;
    if (celulasDoCacador(c, x, y).some((q) => cena.blocked(q.x, q.y) || cena.warpAt(q.x, q.y))) continue;
    // e de onde dê pra chegar em você a pé — do outro lado de um barranco ou
    // de um lago ele ficaria parado olhando, e isso não é caçar
    if (!primeiroPasso({ x, y }, p, cena, tam)) continue;
    Object.assign(c, { map: p.map, x, y, dir: "down", t: 0, de: null });
    return true;
  }
  return false;
}

/** COM DEZ MIL DE RAIVA ELE CRESCE: ocupa 2x2 tiles. É o fugitivo já
 *  acordado — o caçador normal tem o tamanho de gente. */
export const tamanhoDoCacador = (c) => (c?.fugitivo?.avisou ? 2 : 1);

/** NUM POKÉSAVE O TEMPO CORRE: cada minuto vira um segundo (60x). Um bicho
 *  selvagem vive rápido — o dia passa, a noite chega, o caçador dorme e
 *  acorda, tudo no ritmo de quem não tem relógio. Chamado a cada quadro;
 *  devolve o avanço acumulado (vai no save, então F5 não volta atrás). */
export function correrTempo(st, dt) {
  if (!st?.pokesave) return st?.relogio || 0;
  st.relogio = (st.relogio || 0) + dt * 1000 * (CACADOR.fugitivoTempo - 1);
  return st.relogio;
}

/** As células que o caçador ocupa (1 ou 4). */
export function celulasDoCacador(c, x = c.x, y = c.y) {
  const n = tamanhoDoCacador(c);
  const out = [];
  for (let dy = 0; dy < n; dy++) for (let dx = 0; dx < n; dx++) out.push({ x: x + dx, y: y + dy });
  return out;
}

/** O NPC do caçador, montado do estado: treinador com equipe do lugar. */
export function cacadorNpc(st) {
  const c = st?.cacador;
  if (!st?.pokesave || !c || c.map !== st.player.map || c.x == null) return null;
  const eu = quemSou(st);
  const nv = Math.max(3, eu?.level || 5);
  // A EQUIPE DELE É O QUE ELE PEGOU. Começa vazia — ele está caçando — e cada
  // selvagem que ele alcança no mato entra nela. Sem nada na hora da briga,
  // dois do lugar, no seu nível: caçador nenhum anda sem bola.
  // o que ele treinou não pode ficar ridículo perto de você: quem está com ele
  // há um tempo luta no seu nível menos quatro, no mínimo
  let party = (c.equipe || []).slice(-CACADOR.maxEquipe).map((e) => ({ ...e, lvl: Math.max(e.lvl, nv - 4) }));
  if (!party.length) {
    const tabela = (DB.MAPS[c.map]?.encounters || []).filter((e) => DB.SPECIES[e.id]);
    const fonte = tabela.length ? tabela : (DB.MAPS.route1?.encounters || []);
    party = Array.from({ length: 2 }, () => {
      const e = fonte[Math.floor(Math.random() * fonte.length)];
      return { id: e?.id || "rattata", lvl: Math.max(2, nv + Math.floor(Math.random() * 5) - 2) };
    });
  }
  // entre um tile e o outro ele desliza (fx, fy), como o jogador — sem isso
  // ele pulava de casa em casa a cada passo
  const k = c.de ? Math.min(1, (c.t || 0) / CACADOR.passo) : 1;
  const fx = c.de ? c.de.x + (c.x - c.de.x) * k : c.x;
  const fy = c.de ? c.de.y + (c.y - c.de.y) * k : c.y;
  return {
    id: "cacador", x: c.x, y: c.y, fx, fy, andando: k < 1, dir: c.dir || "down", sprite: "cacador", cacador: true,
    tamanho: tamanhoDoCacador(c),
    lines: CACADOR.falas, afterLines: CACADOR.depois,
    trainer: { name: nomeDoCacador(c), prize: 300 + nv * 20 + (c.insignias || 0) * 400, sight: 0, party },
  };
}

/** ELE TE PEGA TAMBÉM. Quando encosta em você, joga uma bola: a chance sobe
 *  quanto mais ferido você está, como qualquer captura. Devolve true se te
 *  pegou — e aí você é dele: `st.capturado` guarda o nome de quem te leva, o
 *  caçador para de te caçar (está do seu lado) e nas batalhas ele é quem dá
 *  as ordens (src/scenes/battle.js, a ORDEM e a DESOBEDIÊNCIA). */
export function cacadorTentaBola(st, entrou = false) {
  const eu = quemSou(st);
  if (!eu || eu.hp <= 0) return false;
  const chance = CACADOR.bola.base + CACADOR.bola.ferido * (1 - eu.hp / eu.maxHp);
  if (!entrou && Math.random() >= chance) return false;     // `entrou`: você quis
  const c = st.cacador;
  st.capturado = { nome: c.nome, desobedeceu: 0, quando: Date.now(), raiva: raivaDoFugitivo(c) };
  Object.assign(c, { map: null, x: null, espera: null, fugitivo: null });
  return true;
}

/** Livre de novo: você escapou. O caçador some por um tempo. */
export function escapar(st) {
  delete st.capturado;
  cacadorPerdeu(st);
}

/** O caçador pegou um selvagem: entra na equipe dele (a mais fraca sai quando
 *  está cheia). Devolve o que ele diz. */
export function cacadorPegou(st, b) {
  const c = st?.cacador;
  if (!c || !b?.mon) return null;
  const eq = (c.equipe ||= []);
  eq.push({ id: b.mon.species, lvl: b.mon.level, shiny: !!b.mon.shiny });
  if (eq.length > CACADOR.maxEquipe) {
    eq.sort((a, z) => a.lvl - z.lvl);
    eq.shift();
  }
  return `${c.nome} PEGOU ${b.mon.nickname}!`;
}

/** Um passo do caçador na sua direção. Devolve true quando ele te alcançou. */
/** Um passo do caçador. Ele vai atrás do que estiver MAIS PERTO: um
 *  selvagem à vista ou você. Devolve "voce" quando te alcançou, o bicho
 *  quando pegou um selvagem, ou null. */
export function andarCacador(st, cena, dt, selvagens = []) {
  const c = st?.cacador;
  if (!st?.pokesave || !c || c.map !== st.player.map || c.x == null) return null;
  c.t = (c.t || 0) + dt;
  if (c.t < CACADOR.passo) return null;
  const p = st.player;
  // a distância é da célula mais perto do bloco (2x2 quando ele está grande)
  const dist = (a) => Math.min(...celulasDoCacador(c).map((q) => Math.abs(a.x - q.x) + Math.abs(a.y - q.y)));
  // A CABEÇA DELE. Você só conta dentro da VISÃO (8 tiles; 48 quando é o
  // fugitivo) e quando ele tem com que te enfrentar: equipe no seu nível, ou
  // três bichos — antes disso ele prefere caçar mato até ficar forte (menos o
  // fugitivo, que não pensa). Voando você não conta: lá em cima ele não alcança.
  const eu = quemSou(st);
  const eq = c.equipe || [];
  const media = eq.length ? eq.reduce((a, x) => a + x.lvl, 0) / eq.length : 0;
  // ele SEMPRE vem: o que ele tem luta no mínimo no seu nível menos quatro,
  // então equipe fraca não é desculpa (foi o que fazia ele só caçar bicho)
  const aguenta = true;
  const visao = CACADOR.visao * (c.fugitivo ? CACADOR.fugitivoVisao : 1);
  // VOCÊ É O ALVO. Selvagem só quando você não está à vista (ou não dá pra
  // te enfrentar ainda) — ou quando um está do lado dele, que aí ele pega de
  // passagem. Entre os selvagens ele prefere o que VALE: shiny, alfa e nível
  // alto pesam mais que distância curta.
  const valor = (b) => dist(b) - (b.mon.shiny || b.mon.luminoso ? 6 : 0) - (b.mon.alfa ? 5 : 0) - b.mon.level / 8;
  let alvo = st.voando || !aguenta || dist(p) > visao ? null : p, alvoBicho = null;
  const doLado = selvagens.find((b) => dist(b) === 1);
  if (doLado) { alvo = doLado; alvoBicho = doLado; }
  else if (!alvo) {
    for (const b of selvagens) if (!alvoBicho || valor(b) < valor(alvoBicho)) { alvo = b; alvoBicho = b; }
  }
  if (!alvo) return null;
  c.t = 0;
  const dx = Math.sign(alvo.x - c.x), dy = Math.sign(alvo.y - c.y);
  if (dist(alvo) === 1) {                                     // encostou
    c.dir = dx > 0 ? "right" : dx < 0 ? "left" : dy > 0 ? "down" : "up";
    return alvoBicho || "voce";
  }
  // O CAMINHO: uma busca em largura até o alvo (ou até cansar — 6000 tiles,
  // que é mais que qualquer mapa de Kanto: a borda de uma cidade grande fica
  // a mais de 600 do meio, e com o teto baixo ele desistia e zanzava).
  // O passo cego pelo eixo mais longo travava em qualquer cerca; caçador que
  // trava em cerca não é caçador.
  const passo = primeiroPasso(c, alvo, cena, tamanhoDoCacador(c));
  if (!passo) { c.de = null; return null; }
  c.de = { x: c.x, y: c.y };
  c.x = passo.x; c.y = passo.y; c.dir = passo.dir;
  return null;
}

function primeiroPasso(de, ate, cena, tamanho = 1) {
  const chave = (x, y) => `${x},${y}`;
  const visto = new Map([[chave(de.x, de.y), null]]);
  const fila = [[de.x, de.y]];
  const dirs = [[1, 0, "right"], [-1, 0, "left"], [0, 1, "down"], [0, -1, "up"]];
  // grande, o bloco inteiro tem que caber; e "chegou" é qualquer célula
  // encostar no alvo
  const cabe = (x, y) => {
    for (let dy = 0; dy < tamanho; dy++) for (let dx = 0; dx < tamanho; dx++) {
      if (cena.blocked(x + dx, y + dy) || cena.warpAt(x + dx, y + dy)) return false;
    }
    return true;
  };
  const encosta = (x, y) => {
    for (let dy = 0; dy < tamanho; dy++) for (let dx = 0; dx < tamanho; dx++) {
      if (x + dx === ate.x && y + dy === ate.y) return true;
    }
    return false;
  };
  let achou = null;
  while (fila.length && visto.size < 6000 && !achou) {
    const [x, y] = fila.shift();
    for (const [dx, dy, dir] of dirs) {
      const nx = x + dx, ny = y + dy, k = chave(nx, ny);
      if (visto.has(k)) continue;
      if (encosta(nx, ny)) { achou = k; visto.set(k, { x, y, dir }); break; }
      if (!cabe(nx, ny)) continue;
      visto.set(k, { x, y, dir });
      fila.push([nx, ny]);
    }
  }
  if (!achou) return null;
  // volta pelo caminho até o passo que sai de onde ele está
  let k = achou, prev = visto.get(k);
  while (prev && !(prev.x === de.x && prev.y === de.y)) { k = chave(prev.x, prev.y); prev = visto.get(k); }
  if (!prev) return null;
  const [x, y] = k.split(",").map(Number);
  return { x, y, dir: prev.dir };
}

/** Perdeu pra você: some por um tempo, e volta de mãos vazias — a equipe
 *  que ele tinha pegado foi embora com a derrota. */
export function cacadorPerdeu(st) {
  const c = st?.cacador;
  if (!c) return;
  Object.assign(c, { map: null, x: null, espera: null, equipe: [], ate: Date.now() + CACADOR.folga * 1000 });
}


/** O Pokémon que você é, na equipe (ou no box). null fora de um pokésave. */
export const quemSou = (st) => st?.pokesave
  ? [...(st.party || []), ...(st.box || [])].find((m) => m.eu) || null : null;

/** Quando o Pokémon que você é evolui, você evolui junto. Chamado depois de
 *  toda evolução (src/scenes/battle.js, o doce, a pedra). */
export function acompanharEvolucao(st) {
  const eu = quemSou(st);
  if (eu && st.pokesave.species !== eu.species) st.pokesave.species = eu.species;
}

const espelho = new Map();
function espelhado(img) {
  if (!img) return img;
  let out = espelho.get(img);
  if (out) return out;
  const cv = document.createElement("canvas");
  cv.width = img.width; cv.height = img.height;
  const c = cv.getContext("2d");
  c.translate(img.width, 0); c.scale(-1, 1); c.drawImage(img, 0, 0);
  espelho.set(img, cv);
  return cv;
}

/** O desenho no mapa. `x, y` é o canto do tile em pixels de tela; `k` é a
 *  fração do passo (0..1) pro pulinho; `dir` decide frente, costas ou espelho.
 *  Serve pra você e pros outros jogadores da sala (drawPeer). */
export function desenharPokemon(ctx, ps, x, y, dir, k = 0, escala = 28) {
  const fake = { shiny: !!ps.shiny, luminoso: !!ps.luminoso };
  const seed = 7;
  let img = dir === "up" ? Assets.monBack(ps.species, seed) : Assets.mon(ps.species, seed);
  if (!img) return;
  img = Assets.comCor(img, fake);
  if (dir === "right") img = espelhado(img);
  const pulo = k > 0 && k < 1 ? Math.abs(Math.sin(k * Math.PI)) * 2 : 0;
  const d = (escala - 16) / 2;
  ctx.drawImage(img, Math.round(x - d), Math.round(y - (escala - 16) - pulo), escala, escala);
}

/** O que a sala online recebe como sprite: "mon:vulpixalola:shiny". */
export function spriteOnline(st) {
  const ps = st?.pokesave;
  if (!ps) return "hero";
  return `mon:${ps.species}:${ps.luminoso ? "luminoso" : ps.shiny ? "shiny" : "comum"}`;
}

/** O contrário: de "mon:..." pra { species, shiny, luminoso } (ou null). */
export function pokesaveDoSprite(sprite) {
  if (typeof sprite !== "string" || !sprite.startsWith("mon:")) return null;
  const [, species, cor] = sprite.split(":");
  if (!DB.SPECIES?.[species]) return null;
  return { species, shiny: cor === "shiny", luminoso: cor === "luminoso" };
}

// ------------------------------------------------------------ O CATIVEIRO
// Capturado, você continua andando (é o Pokémon dele fora da bola, e ele vem
// atrás), mas NA BATALHA quem manda é ele: a cada turno ele diz o golpe, e
// você OBEDECE ou DESOBEDECE. Desobedecer sorteia uma destas — a lista é a
// dos jogos de sempre (o Pokémon que ignora ordem e dorme), mais as que só
// fazem sentido quando o Pokémon é você. `escapa` é a saída do cativeiro, e
// fica mais provável a cada desobediência: quem insiste, sai.
// VOCÊ ESCOLHE o que faz — desobedecer é decisão, não sorteio. Só o ESCAPAR
// é aposta: a bola segura ou não, e ela segura menos a cada desobediência.
export const DESOBEDIENCIA = [
  { id: "soneca",  rotulo: "SONECA",      texto: "{MON} IGNOROU A ORDEM E TIROU UMA SONECA." },
  { id: "outro",   rotulo: "OUTRO GOLPE", texto: "{MON} FEZ OUTRA COISA." },
  { id: "tudo",    rotulo: "COM TUDO",    texto: "{MON} NÃO QUIS SABER DE ORDEM E FOI COM TUDO!" },
  { id: "recusa",  rotulo: "RECUSAR",     texto: "{MON} VIROU DE COSTAS E SE RECUSOU A LUTAR." },
  { id: "morde",   rotulo: "MORDER",      texto: "{MON} MORDEU {TREINADOR}! CAIU DINHEIRO DO BOLSO." },
  { id: "foge",    rotulo: "SAIR CORRENDO", texto: "{MON} SAIU CORRENDO DA BATALHA." },
  { id: "escapa",  rotulo: "ESCAPAR",     texto: "{MON} ARREBENTOU A BOLA E ESCAPOU! VOCÊ ESTÁ LIVRE.",
    falhou: "{MON} FORÇOU A BOLA... E ELA SEGUROU. {TREINADOR} APERTOU MAIS." },
];

/** A chance de a bola ceder: `vezes` é quantas vezes você já desobedeceu. */
export const chanceDeEscapar = (vezes = 0) => Math.min(0.95, 0.06 + vezes * 0.07);

// ---------------------------------------------------------------- A RAIVA
// Cada desobediência deixa o dono mais bravo (`st.capturado.raiva`, 0 a 5), e
// bravo ele FORÇA A BARRA: grita, aperta a bola (você perde vida ao
// desobedecer), e do nível 3 em diante às vezes aperta tanto que não dá pra
// desobedecer naquele turno. Obedecer três turnos seguidos acalma um ponto;
// uma noite dormida no Centro acalma dois.
export const RAIVA = {
  max: 5,
  aperta: 0.08,        // fração da vida que a bola tira por desobediência, do nível 2 em diante
  forca: [0, 0, 0, 0.34, 0.5, 0.7],   // chance de a ordem vir sem DESOBEDECER, por nível
  grito: [
    "",
    "{TREINADOR} GRITOU COM VOCÊ.",
    "{TREINADOR} APERTOU A BOLA. DOEU.",
    "{TREINADOR} ESTÁ FURIOSO. A BOLA CHIA NA MÃO DELE.",
    "{TREINADOR} NEM FALA MAIS. SÓ APERTA.",
    "{TREINADOR} ESTÁ NO LIMITE. A BOLA ESTÁ RACHANDO — DE RAIVA OU DE VOCÊ.",
  ],
  acalmou: "{TREINADOR} RESPIROU FUNDO.",
  /** a raiva ESFRIA sozinha: a cada `esfria` segundos de relógio de parede,
   *  um ponto — ou 2% quando é a raiva de dez mil do fugitivo recapturado */
  esfria: 40,
};

/** O tempo acalma. Chamado a cada quadro com você capturado; devolve true
 *  quando baixou um degrau que muda alguma coisa (pra avisar). */
export function esfriarRaiva(st, dt) {
  const c = st?.capturado;
  if (!c || !(c.raiva > 0)) return false;
  c.esfriando = (c.esfriando || 0) + dt;
  if (c.esfriando < RAIVA.esfria) return false;
  c.esfriando = 0;
  const antes = nivelDeRaiva(c.raiva);
  c.raiva = c.raiva >= 1000 ? Math.max(0, c.raiva - Math.max(1, Math.floor(c.raiva * 0.02))) : c.raiva - 1;
  return nivelDeRaiva(c.raiva) < antes;
}

export function desobedeceu(st) {
  const c = st.capturado; if (!c) return 0;
  c.desobedeceu = (c.desobedeceu || 0) + 1;
  c.seguidas = 0;
  c.raiva = (c.raiva || 0) >= 1000 ? c.raiva + 1 : Math.min(RAIVA.max, (c.raiva || 0) + 1);
  return c.raiva;
}
/** Obedeceu: três seguidas acalmam um ponto. Devolve true quando acalmou. */
export function obedeceu(st) {
  const c = st.capturado; if (!c) return false;
  c.seguidas = (c.seguidas || 0) + 1;
  if (c.seguidas >= 3 && (c.raiva || 0) > 0) { c.seguidas = 0; c.raiva--; return true; }
  return false;
}
/** o nível de 0 a 5 que a raiva vale pras tabelas (dez mil é "tudo") */
export const nivelDeRaiva = (raiva = 0) => Math.min(RAIVA.max, raiva);
export const ordemForcada = (st) => {
  const r = st?.capturado?.raiva || 0;
  if (r >= 1000) return true;                    // o fugitivo recapturado não escolhe mais nada
  return Math.random() < (RAIVA.forca[nivelDeRaiva(r)] || 0);
};

// ----------------------------------------------------------------- A NOITE
// De noite o dono dorme no CENTRO POKÉMON (o último em que você passou; sem
// nenhum, onde estiver), e é a sua hora: FUGIR ou FICAR. Fugir é aposta —
// ele pode acordar, e acorda mais fácil quanto mais bravo — e ficar cura a
// equipe e acalma ele. Uma vez por noite (`noiteVista` guarda qual).
// A NOITE, de verdade: quando escurece, ele te leva pro CENTRO POKÉMON mais
// perto e sobe pra dormir no segundo andar — a escada está fechada, pra
// Pokémon e pra gente. Você fica embaixo. Ficar não faz nada. SAIR DO CENTRO
// ANTES DE ELE ACORDAR é fugir: ele só percebe de manhã.
export const NOITE = {
  dormiu: ["{TREINADOR} TE LEVOU PRO CENTRO POKÉMON E SUBIU PRA DORMIR.", "\"FICA AÍ EMBAIXO. E NÃO SAI.\""],
  escada: "{TREINADOR} ESTÁ DORMINDO LÁ EM CIMA. A ESCADA ESTÁ FECHADA — PRA POKÉMON E PRA GENTE.",
  acordou: ["{TREINADOR} DESCEU A ESCADA.", "\"VAMOS.\""],
  fugiu: ["VOCÊ SAIU NA PONTA DOS PÉS. {TREINADOR} NEM SE MEXEU.", "VOCÊ ESTÁ LIVRE. POR ENQUANTO: ELE VAI PERCEBER QUANDO ACORDAR."],
  percebeu: ["{TREINADOR} ACORDOU E A BOLA ESTAVA VAZIA.", "AGORA É PESSOAL. ELE ESTÁ PROCURANDO VOCÊ EM KANTO INTEIRA."],
};

/** O Centro Pokémon mais perto: o desta cidade, senão o último em que você
 *  passou, senão o de Viridian. */
export function centroMaisPerto(st) {
  const m = st.player.map;
  if (m === "viridian" || m === "center") return "center";
  const daqui = `${m}_pokemon_center_1f`;
  if (DB.MAPS[daqui]) return daqui;
  if (m.endsWith("_pokemon_center_1f")) return m;
  const r = st.respawn?.map;
  if (r && (r === "center" || r.endsWith("_pokemon_center_1f"))) return r;
  return "center";
}

/** FUGIU DORMINDO: sempre dá — ele está dormindo. Mas de manhã ele acorda
 *  com a bola vazia, e aí você é o FUGITIVO dele: ele te enxerga de seis
 *  vezes mais longe, não descansa (sem folga), e ganha DEZ MIL de raiva por
 *  dia que passa procurando. Se te pega de novo, é com essa raiva toda. */
export function fugirDormindo(st) {
  const c = st.cacador;
  delete st.capturado;
  Object.assign(c, { map: null, x: null, espera: null, ate: null,
                     fugitivo: { desde: idDaNoite(), avisou: false } });
}

/** A raiva do fugitivo hoje: dez mil por dia (contando o de amanhã). */
export function raivaDoFugitivo(c) {
  if (!c?.fugitivo) return 0;
  const dias = Math.max(1, Math.floor((idDaNoite() - c.fugitivo.desde + 1) / 2) + 1);
  return dias * CACADOR.fugitivoRaiva;
}

/** Amanheceu depois da fuga: ele percebe (uma vez) e volta a caçar. */
export function fugitivoAmanheceu(st) {
  const c = st?.cacador;
  if (!c?.fugitivo || c.fugitivo.avisou) return false;
  if (idDaNoite() === c.fugitivo.desde) return false;   // ainda é a mesma noite
  c.fugitivo.avisou = true;
  c.ate = null;
  return true;
}
export const idDaNoite = (quando = relogio()) => Math.floor(quando / (Math.max(1, (DB.CONFIG?.cicloMinutos ?? 15)) * 60000));

/** Pra onde o dono vai quando não tem bicho à vista. Devolve { x, y } e,
 *  quando é uma saída, `porta` (warp) ou `borda` + `conn` (conexão). */
function rumoDoDono(st, cena) {
  const p = st.player;
  const mapa = DB.MAPS[p.map], geo = DB.KANTO[p.map];
  // "tem mato" = tabela de encontro E grama alta de verdade: Viridian tem
  // tabela e quase nenhuma grama — bicho não nasce, e ele zanzava esperando
  const temMato = (id) => (DB.MAPS[id]?.encounters || []).length > 0 && (DB.KANTO[id]?.tags || "").includes("2");
  const perto = (a, b) => Math.abs(a.x - p.x) + Math.abs(a.y - p.y) - Math.abs(b.x - p.x) - Math.abs(b.y - p.y);
  // VOCÊ FRACO: ele te leva pro Centro Pokémon mais perto antes de qualquer
  // coisa — treinador que manda bicho com um ponto de vida pra briga perde
  // o bicho. Entra pela porta; a cena cura ao chegar (curarNoCentro).
  const eu = quemSou(st);
  if (eu && eu.hp / eu.maxHp < CARREIRA.curaAbaixoDe && geo) {
    const centro = centroMaisPerto(st);
    if (p.map !== centro && DB.KANTO[centro]) {
      const cache = st.capturado.saida;
      const porta = (DB.KANTO[centro].warps || [])[0];
      const cidade = DB.MAPS[centro]?.name && Object.keys(DB.KANTO).find((id) => (DB.KANTO[id].warps || []).some((w) => w.to === centro));
      const alvoPorta = cidade && (DB.KANTO[cidade].warps || []).find((w) => w.to === centro);
      if (cidade && alvoPorta) {
        if (p.map === cidade) return { x: alvoPorta.x, y: alvoPorta.y, porta: true, cura: true, tentativas: 0 };
        const saida = cache && cache.mapa === p.map && cache.alvo === centro ? cache.rumo : proximaSaida(st, cidade, alvoPorta);
        st.capturado.saida = { mapa: p.map, alvo: centro, rumo: saida };
        if (saida) return { ...saida };
      }
    }
  }
  // A VEZ DO GINÁSIO: a equipe está no nível, então ele vai até lá — sai do
  // prédio em que estiver, atravessa Kanto mapa a mapa pelas bordas, e na
  // cidade entra pela porta do ginásio. Sem estrada (ilha), fica na
  // simulação de sempre.
  const g = ginasioDaVez(st);
  if (g && geo) {
    if (p.map === g.ginasio) return null;                 // já dentro: o desafio é da cena
    if (p.map === g.cidade) return { x: g.porta.x, y: g.porta.y, porta: true, ginasio: true, tentativas: 0 };
    // a saída deste mapa rumo à cidade do ginásio (tile por tile, por Kanto
    // inteira). Sem estrada a pé (ilha), a carreira simula esse ginásio.
    const cache = st.capturado.saida;
    const saida = cache && cache.mapa === p.map && cache.alvo === g.ginasio ? cache.rumo : proximaSaida(st, g.cidade, g.porta);
    st.capturado.saida = { mapa: p.map, alvo: g.ginasio, rumo: saida };
    if (saida) return { ...saida };
    st.cacador.semEstrada = g.indice;
  }
  if (!temMato(p.map) && geo) {
    // dentro de casa: a porta que dá pra fora
    if (mapa?.interior) {
      const portas = (geo.warps || []).filter((w) => w.to && !DB.MAPS[w.to]?.interior).sort(perto);
      if (portas.length) return { x: portas[0].x, y: portas[0].y, porta: true, tentativas: 0 };
    }
    // na rua: a borda que dá numa rota com mato (ou qualquer borda)
    const conns = (geo.connections || []).filter((c) => c.to && DB.KANTO[c.to]);
    const ordem = [...conns.filter((c) => temMato(c.to)), ...conns.filter((c) => !temMato(c.to))];
    for (const c of ordem) {
      const cands = [];
      for (let i = 0; i < Math.max(geo.w, geo.h); i++) {
        const t = c.dir === "up" ? { x: i, y: 0 } : c.dir === "down" ? { x: i, y: geo.h - 1 }
                : c.dir === "left" ? { x: 0, y: i } : { x: geo.w - 1, y: i };
        if (t.x < geo.w && t.y < geo.h && !cena.blocked(t.x, t.y)) cands.push(t);
      }
      cands.sort(perto);
      for (const t of cands.slice(0, 6)) {
        if (primeiroPasso(p, t, cena) || (t.x === p.x && t.y === p.y)) return { ...t, borda: c.dir, conn: c, tentativas: 0 };
      }
    }
  }
  // onde tem mato: vai PRA GRAMA — um tile de grama alta a até vinte tiles
  // (é onde o bicho nasce); sem grama por perto, um ponto qualquer
  if (geo) {
    const gramas = [];
    for (let i = 0; i < geo.tags.length; i++) {
      if (geo.tags[i] !== "2") continue;
      const x = i % geo.w, y = Math.floor(i / geo.w), d = Math.abs(x - p.x) + Math.abs(y - p.y);
      if (d >= 3 && d <= 20) gramas.push({ x, y, d });
    }
    for (let t = 0; t < 8 && gramas.length; t++) {
      const g = gramas[Math.floor(Math.random() * gramas.length)];
      if (!cena.blocked(g.x, g.y) && primeiroPasso(p, g, cena)) return { x: g.x, y: g.y, tentativas: 0 };
    }
  }
  for (let t = 0; t < 30; t++) {
    const x = p.x + Math.round((Math.random() * 2 - 1) * 12), y = p.y + Math.round((Math.random() * 2 - 1) * 10);
    if (Math.abs(x - p.x) + Math.abs(y - p.y) < 5 || cena.blocked(x, y) || cena.warpAt(x, y)) continue;
    return { x, y, tentativas: 0 };
  }
  return null;
}

/** VOCÊ NA BOLA: o dono anda com o seu corpo — a posição do jogador é a dele.
 *  Vai atrás do selvagem mais perto (ou fica parado). Devolve o bicho que
 *  ele pegou, ou null. Usa o `move` da cena pra andar tile a tile. */
export function andarNaBola(st, cena, dt, selvagens = []) {
  const cap = st.capturado;
  if (!cap?.naBola || cena.move) return null;      // um passo emenda no outro: andar normal
  const p = st.player;
  let alvo = null, d = Infinity;
  // a caminho do ginásio ele não para pra caçar: tem hora pra tudo
  const indoAoGinasio = !!ginasioDaVez(st);
  for (const b of indoAoGinasio ? [] : selvagens) {
    const dd = Math.abs(b.x - p.x) + Math.abs(b.y - p.y);
    if (dd < d) { d = dd; alvo = b; }
  }
  if (alvo && d === 1) {
    p.dir = alvo.x > p.x ? "right" : alvo.x < p.x ? "left" : alvo.y > p.y ? "down" : "up";
    return alvo;
  }
  // SEM BICHO À VISTA ELE VAI CAÇAR ONDE TEM: num lugar sem tabela de
  // encontro (cidade, Centro) ele procura a saída — a porta pra rua, ou a
  // borda que dá numa rota com mato — e atravessa. Onde tem mato, explora
  // até um bicho nascer. Zanzar no meio da cidade não é caçar.
  if (!alvo) {
    const r = cap.rumo;
    if (!r || (r.x === p.x && r.y === p.y) || (r.tentativas || 0) > 60) cap.rumo = null;
    if (!cap.rumo) cap.rumo = rumoDoDono(st, cena);
    if (!cap.rumo) return null;
    cap.rumo.tentativas = (cap.rumo.tentativas || 0) + 1;
    alvo = cap.rumo;
    // chegou na borda: atravessa pro mapa vizinho
    if (alvo.borda && p.x === alvo.x && p.y === alvo.y) {
      cap.rumo = null;
      cena.useConnection?.(alvo.conn, alvo.borda);
      return null;
    }
  }
  const passo = primeiroPasso(p, alvo, cena);
  if (!passo) { cap.rumo = null; return null; }
  const dx = passo.x - p.x, dy = passo.y - p.y;
  p.dir = passo.dir;
  cena.move = { dx, dy, n: 0, total: cena.passoDoDono?.() ?? 12 };
  return null;
}

// ---------------------------------------------------------------- A CARREIRA
// O caçador é um treinador de verdade, e treinador tem carreira: enquanto o
// jogo anda, ele também anda. A cada DIA DO JOGO (com o tempo a 60x, a cada
// 30 segundos) a equipe dele sobe de nível, evolui quando é hora, ele pega
// mais um bicho de alguma rota, e — quando a equipe está no nível do ginásio
// seguinte — enfrenta o líder e ganha a insígnia. As oito insígnias de Kanto
// são as de src/data/story.js (STORY.badges), na ordem. Tudo isso é
// simulado: acontece na tabela, não na tela. O que se vê é o nome dele com o
// número de insígnias, a equipe mais forte na hora da briga, e as falas.
export const CARREIRA = {
  /** o nível que a equipe precisa ter (na média) pra cada ginásio */
  ginasios: [12, 20, 26, 30, 36, 40, 44, 48],
  liga: 55,                   // ...e pra Liga, depois das oito
  curaAbaixoDe: 0.35,         // com você abaixo disto de vida, ele te leva pro Centro
  /** onde cada um fica: a cidade e o mapa do ginásio, na ordem das insígnias */
  cidades: ["pewter_city", "cerulean_city", "vermilion_city", "celadon_city",
            "fuchsia_city", "saffron_city", "cinnabar_island", "viridian"],
  niveisPorDia: [1, 2],       // quanto cada Pokémon dele sobe por dia
  pegaPorDia: 0.6,            // chance de pegar mais um por dia
  chanceGinasio: 0.5,         // por dia, quando a equipe já está no nível
  rotas: ["route1", "route2", "viridian_forest", "route3", "route4", "route24", "route25", "route5",
          "route6", "route11", "route9", "route10", "route8", "route7", "route12", "route13",
          "route14", "route15", "route16", "route17", "route18", "route21_north", "route22", "route23"],
};

/** Um dia passou pro caçador: treino, captura, evolução, ginásio. Devolve o
 *  que aconteceu (uma linha), ou null. */
export function diaDoCacador(st) {
  const c = st?.cacador;
  if (!st?.pokesave || !c) return null;
  const hoje = Math.floor(idDaNoite() / 2);
  if (c.dia === hoje) return null;
  const primeiro = c.dia == null;
  c.dia = hoje;
  if (primeiro) return null;                     // o primeiro dia só marca o calendário
  c.insignias ||= 0;
  const eq = (c.equipe ||= []);
  const avisos = [];
  // TREINO: todo mundo sobe; quem chegou no nível da evolução, evolui
  for (const e of eq) {
    e.lvl = Math.min(100, e.lvl + CARREIRA.niveisPorDia[0] + Math.floor(Math.random() * (CARREIRA.niveisPorDia[1] - CARREIRA.niveisPorDia[0] + 1)));
    const para = evolutionFor({ species: e.id, level: e.lvl });
    if (para) { avisos.push(`O ${DB.SPECIES[e.id]?.name} DE ${c.nome} VIROU ${DB.SPECIES[para]?.name}!`); e.id = para; }
  }
  // CAPTURA: um bicho de uma rota do nível dele
  if (Math.random() < CARREIRA.pegaPorDia) {
    const rota = CARREIRA.rotas[Math.min(CARREIRA.rotas.length - 1, Math.floor(c.insignias * 3 + Math.random() * 3))];
    const tabela = (DB.MAPS[rota]?.encounters || []).filter((e) => DB.SPECIES[e.id]);
    if (tabela.length) {
      const e = tabela[Math.floor(Math.random() * tabela.length)];
      const media = eq.length ? eq.reduce((a, x) => a + x.lvl, 0) / eq.length : 5;
      const novo = { id: e.id, lvl: Math.max(e.min, Math.round(media - 2)) };
      eq.push(novo);
      if (eq.length > CACADOR.maxEquipe) { eq.sort((a, z) => a.lvl - z.lvl); eq.shift(); }
      avisos.push(`${c.nome} PEGOU UM ${DB.SPECIES[e.id]?.name} NA ${DB.MAPS[rota]?.name || rota}.`);
    }
  }
  // A LIGA: com as oito insígnias e a equipe no nível (55), ele vai pro
  // Planalto Índigo (que não existe neste jogo — então é um dia de viagem e
  // uma luta que você ouve de longe). Campeão, ele TE SOLTA: caçador que
  // chegou lá não precisa mais de ninguém na bola. E se aposenta.
  if (c.insignias >= CARREIRA.ginasios.length && !c.campeao && media >= CARREIRA.liga && Math.random() < CARREIRA.chanceGinasio) {
    c.campeao = true;
    c.solta = true;                                  // a cena lê e liberta
    return `${c.nome} VENCEU A LIGA POKÉMON. É O NOVO CAMPEÃO.`;
  }
  // GINÁSIO: com a equipe no nível, ele enfrenta o próximo líder — simulado
  // só quando você NÃO está na bola com ele; na bola, ele vai até lá a pé e
  // você vê (rumoDoDono, desafiarGinasio)
  const alvo = CARREIRA.ginasios[c.insignias];
  const media = eq.length ? eq.reduce((a, x) => a + x.lvl, 0) / eq.length : 0;
  if (alvo && media >= alvo && (!st.capturado?.naBola || c.semEstrada === c.insignias) && Math.random() < CARREIRA.chanceGinasio) {
    const b = DB.STORY?.badges?.[c.insignias];
    c.insignias++;
    avisos.push(`${c.nome} VENCEU O GINÁSIO DE ${b?.city || "?"} E GANHOU A ${b?.name || "INSÍGNIA Nº " + c.insignias}!`);
  }
  return avisos.length ? avisos[Math.floor(Math.random() * avisos.length)] : null;
}

/** O nome que aparece: com as insígnias, quando tem alguma. */
export const nomeDoCacador = (c) => (c?.insignias ? `${c.nome} (${c.insignias}★)` : c?.nome || "CAÇADOR");

/** O próximo ginásio que ele consegue: { cidade, ginasio, indice } ou null. */
export function ginasioDaVez(st) {
  const c = st?.cacador;
  if (!c) return null;
  const i = c.insignias || 0;
  const alvo = CARREIRA.ginasios[i], cidade = CARREIRA.cidades[i];
  if (!alvo || !cidade || !DB.KANTO[cidade]) return null;
  const eq = c.equipe || [];
  const media = eq.length ? eq.reduce((a, x) => a + x.lvl, 0) / eq.length : 0;
  if (media < alvo || c.semEstrada === i) return null;   // sem estrada: fica na simulação
  const porta = (DB.KANTO[cidade].warps || []).find((w) => w.to && w.to.endsWith("_gym"));
  return porta ? { cidade, ginasio: porta.to, porta, indice: i } : null;
}

// O CAMINHO ATRAVÉS DE KANTO, tile por tile, com as bordas e as portas.
// Um mapa não é um nó: a Rota 2 tem duas metades separadas pela Floresta
// Viridian, e por mapa a busca acha um caminho que não existe. Por tile ela
// acha o de verdade — passa pelo portão sul, atravessa a floresta, sai pelo
// portão norte. Água é parede (ele não surfa), então ilha não tem estrada.
// É uma busca grande (Kanto tem 200 mil tiles), mas roda uma vez por mapa
// e cabe num piscar de olhos com chaves inteiras.
const LADO = 10000;
let indiceDosMapas = null;
function indices() {
  if (!indiceDosMapas) {
    indiceDosMapas = new Map();
    let i = 0;
    for (const id of Object.keys(DB.KANTO)) indiceDosMapas.set(id, i++);
  }
  return indiceDosMapas;
}

/** A PRIMEIRA SAÍDA do mapa atual rumo a (`mapaAlvo`, `alvo`): a borda por
 *  onde atravessar ({ x, y, borda, conn }) ou a porta em que entrar
 *  ({ x, y, porta }). null quando não tem caminho a pé. */
export function proximaSaida(st, mapaAlvo, alvo) {
  const idx = indices();
  const nomes = [...idx.keys()];
  const chave = (m, x, y) => idx.get(m) * LADO + y * DB.KANTO[m].w + x;
  const de = st.player;
  if (de.map === mapaAlvo) return null;
  const inicio = chave(de.map, de.x, de.y);
  const fim = chave(mapaAlvo, alvo.x, alvo.y);
  const prev = new Map([[inicio, -1]]);
  const como = new Map();                   // chave -> { borda, conn } | { porta } quando o passo muda de mapa
  const fila = [inicio];
  let achou = false;
  const livre = (g, x, y) => x >= 0 && y >= 0 && x < g.w && y < g.h && "02".includes(g.tags[y * g.w + x]);
  const passa = (k, nk, jeito) => {
    if (prev.has(nk)) return;
    prev.set(nk, k);
    if (jeito) como.set(nk, jeito);
    if (nk === fim) achou = true;
    fila.push(nk);
  };
  let ultimo = fim;
  while (fila.length && !achou && prev.size < 250000) {
    const k = fila.shift();
    const mi = Math.floor(k / LADO), m = nomes[mi], g = DB.KANTO[m];
    const i = k % LADO, x = i % g.w, y = Math.floor(i / g.w);
    // o alvo é uma porta, e porta é tile sólido: chegar AO LADO dela é chegar
    if (m === mapaAlvo && Math.abs(x - alvo.x) + Math.abs(y - alvo.y) === 1) { achou = true; ultimo = k; break; }
    // a porta daqui (o alvo é uma porta: chegar nela é chegar)
    const w = (g.warps || []).find((q) => q.x === x && q.y === y && q.to && DB.KANTO[q.to]);
    if (w && !(m === mapaAlvo)) {
      const dest = DB.KANTO[w.to], dw = dest.warps?.[w.toWarp] || dest.warps?.[0];
      if (dw) passa(k, chave(w.to, dw.x, dw.y), { porta: true });
    }
    for (const [dx, dy, dir] of [[1, 0, "right"], [-1, 0, "left"], [0, 1, "down"], [0, -1, "up"]]) {
      const nx = x + dx, ny = y + dy;
      if (livre(g, nx, ny)) { passa(k, chave(m, nx, ny), null); continue; }
      if (nx >= 0 && ny >= 0 && nx < g.w && ny < g.h) continue;      // parede, não borda
      const c = (g.connections || []).find((q) => q.dir === dir && q.to && DB.KANTO[q.to]);
      if (!c) continue;
      const dest = DB.KANTO[c.to];
      let tx = nx, ty = ny;
      if (dir === "up") { ty = dest.h - 1; tx = x - c.offset; }
      else if (dir === "down") { ty = 0; tx = x - c.offset; }
      else if (dir === "left") { tx = dest.w - 1; ty = y - c.offset; }
      else { tx = 0; ty = y - c.offset; }
      if (livre(dest, tx, ty)) passa(k, chave(c.to, tx, ty), { borda: dir, conn: c });
    }
  }
  if (!achou) return null;
  // volta do fim até o primeiro passo que SAI do mapa atual
  let k = ultimo, saida = null;
  while (prev.get(k) !== -1) {
    const anterior = prev.get(k);
    if (Math.floor(anterior / LADO) === idx.get(de.map) && Math.floor(k / LADO) !== idx.get(de.map)) {
      const g = DB.KANTO[de.map], i = anterior % LADO;
      saida = { x: i % g.w, y: Math.floor(i / g.w), ...como.get(k), tentativas: 0 };
    }
    k = anterior;
  }
  return saida;
}

/** Entrou no ginásio com você no cinto: ele desafia o líder. A conta é a da
 *  carreira (a equipe já está no nível, senão ele nem vinha). Devolve as
 *  falas, e marca a insígnia. */
export function desafiarGinasio(st) {
  const c = st?.cacador;
  const g = ginasioDaVez(st);
  if (!c || !g || st.player.map !== g.ginasio) return null;
  const b = DB.STORY?.badges?.[g.indice];
  c.insignias = g.indice + 1;
  c.rumo = null;
  return [`${c.nome} DESAFIOU O LÍDER DO GINÁSIO!`,
          "VOCÊ FICOU NA BOLA. DEU PRA OUVIR A LUTA DE DENTRO.",
          `${c.nome} VENCEU E GANHOU A ${b?.name || "INSÍGNIA"}!`];
}

/** Chegou no Centro com você fraco no cinto: a Srta. Joy cura todo mundo. */
export function curarNoCentro(st) {
  const m = st.player.map;
  if (!(m === "center" || m.endsWith("_pokemon_center_1f"))) return false;
  const eu = quemSou(st);
  if (!eu || eu.hp / eu.maxHp >= CARREIRA.curaAbaixoDe) return false;
  for (const mon of st.party) { mon.hp = mon.maxHp; mon.status = null; for (const mv of mon.moves) mv.pp = mv.ppMax; }
  st.capturado.rumo = null;
  return true;
}

/** O campeão te solta: livre, e ele some de vez (aposentado). */
export function campeaoSolta(st) {
  const c = st?.cacador;
  if (!c?.solta) return false;
  c.solta = false;
  delete st.capturado;
  Object.assign(c, { map: null, x: null, espera: null, aposentado: true, ate: Number.MAX_SAFE_INTEGER });
  return true;
}
