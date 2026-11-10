// Bootstrap: canvas, loop, estado global e integracao com o live update.
import { pintarPlaneta } from "./core/espacoarte.js";
import { makeCanvas as fazerCanvas } from "./core/assets.js";
import { nomesDasMaquinas, golpeDeAlfa } from "./systems/maquinas.js";
import { garantirCardume, idCardume } from "./systems/cardume.js";
import { DB, ILHA_GERADA } from "./data/index.js";
import { LIGA_ETAPAS } from "./data/liga-kanto.js";
import { Assets } from "./core/assets.js";
import { initInput, Input } from "./core/input.js";
import { ligarToque, ehCelular, alturaDosBotoes } from "./core/toque.js";
import { Audio2 } from "./core/audio.js";
import { Save } from "./core/save.js";
import { Opcoes } from "./core/opcoes.js";
import { usarIdioma } from "./core/idioma.js";
import { setTextVars } from "./systems/dialogue.js";
import { SceneStack } from "./core/scene.js";
import { initHot } from "./core/hot.js";
import { Glitch } from "./systems/glitchfx.js";
import { suavizar, nivelSuave } from "./core/suave.js";
// na GLITCH DIMENSION a tela suave junta cores PARECIDAS (o jogador se emenda no chão); ?tolsuave=N pra testar
const TOL_GLITCH = +(new URLSearchParams(location.search).get("tolsuave") ?? 90);
// atalho: ?suave=2.5 liga a TELA SUAVE nesse nível
{ const q = new URLSearchParams(location.search).get("suave");
  if (q !== null) Opcoes.set("suave", nivelSuave(parseFloat(q.replace(",", ".")))); }
import { abrirPortal } from "./systems/raid.js";
import { ZONA, abrirZona, garantirZona, zonaDoCodigo, entrarNaZona } from "./systems/glitchzones.js";
import { createMon, recalc, darClaraoNoSave, darClarao } from "./systems/mon.js";
import { lugarDoEncontro } from "./systems/amigos.js";
import { EvolutionScene } from "./scenes/evolution.js";
import { MegaScene } from "./scenes/mega.js";
import { GrupoBattleScene } from "./scenes/grupobattle.js";
import { HordaScene } from "./scenes/horda.js";
import { TirinhaScene } from "./scenes/tirinha.js";
import { TrocaNpcScene } from "./scenes/trocanpc.js";
import { SoltarScene } from "./scenes/soltar.js";
import { VestirScene } from "./scenes/vestir.js";
import { NascerScene } from "./scenes/nascer.js";
import { FusionScene } from "./scenes/fusion.js";
import { reverterTudo } from "./systems/mega.js";
import { minutosDaFase } from "./systems/ciclo.js";
import { registrarDoEstado, garantirEspecie } from "./systems/fusao.js";
import { Online } from "./systems/online.js";
import { carregarDLC, aplicarDLC, ligarDoLink } from "./systems/dlc.js";
import { lerCodigo as lerPokesave, criarPokesave, folhaDoJogador } from "./systems/pokesave.js";
import { guardar as guardarNoBox, cheio as boxCheio } from "./systems/box.js";
import { TitleScene } from "./scenes/title.js";
import { AberturaScene } from "./scenes/abertura.js";
import { OverworldScene } from "./scenes/overworld.js";
import { BattleScene } from "./scenes/battle.js";
import { drawText, painelEmBloco, ESCALA_TELA } from "./core/gfx.js";
import { isoLigado } from "./core/isometrico.js";
import { url as arquivo } from "./core/base.js";
import { loadExternalSprites, adiantarDoMapa, adiantarOResto, mapArt, SpriteStore } from "./core/sprites.js";

const W = 240, H = 160;

// a tela de verdade é 3x (ESCALA_TELA, src/core/gfx.js); o desenho é nos 240x160
const display = document.getElementById("screen");
display.width = W * ESCALA_TELA; display.height = H * ESCALA_TELA;
const dctx = display.getContext("2d");
const buffer = document.createElement("canvas");
buffer.width = W * ESCALA_TELA; buffer.height = H * ESCALA_TELA;
const ctx = buffer.getContext("2d");
ctx.setTransform(ESCALA_TELA, 0, 0, ESCALA_TELA, 0, 0);
ctx.imageSmoothingEnabled = false;
dctx.imageSmoothingEnabled = false;

/** ITEM QUE MUDOU DE NOME. Só o CRISTAL Z DE GLITCH até agora, que virou
 *  GLITCHINIUM (src/data/zcristais.js). Trocar o nome de um item sem trocar a
 *  chave na mochila de quem já tinha é confiscar o item: o jogo procuraria o
 *  nome novo e acharia um vidro vazio. A troca é feita ao carregar, uma vez, e
 *  soma as quantidades caso as duas chaves existam. */
function renomearItens(st) {
  const mapa = DB.ITENS_RENOMEADOS || {};
  for (const [antigo, novo] of Object.entries(mapa)) {
    const n = st?.items?.[antigo];
    if (!n) continue;
    st.items[novo] = Math.min(999, (st.items[novo] || 0) + n);
    delete st.items[antigo];
  }
}

/** BICHO QUE MUDOU DE NOME (src/data/braglitch.js, `NOMES_NOVOS_BRAG`): o
 *  id é o mesmo, mas o apelido de quem nunca foi apelidado é o nome antigo
 *  guardado no save. Ele acompanha o nome novo — apelido de verdade fica. Anda
 *  pelo save inteiro (equipe, BOX, creche, soltos...) atrás de bicho. */
function renomearBichos(st) {
  const visto = new Set();
  const anda = (o) => {
    if (!o || typeof o !== "object" || visto.has(o)) return;
    visto.add(o);
    if (typeof o.species === "string" && typeof o.nickname === "string") {
      const sp = DB.SPECIES[o.species];
      if (sp?.nomeAntigo && o.nickname === sp.nomeAntigo) o.nickname = sp.name;
    }
    for (const v of Object.values(o)) anda(v);
  };
  anda(st);
}

/** Onde a jornada começa: KANTO (a casa de Pallet) ou BRAGLITCH (a casa de
 *  São Lucario do Sul). Quem não escolheu nada começa em Kanto, como sempre. */
function mapaInicial(regiao) {
  const m = regiao === "braglitch" ? DB.BRAGLITCH?.inicio : null;
  return m && DB.MAPS[m] && DB.KANTO[m] ? m : DB.START_MAP;
}

/** UM SAVE NUNCA VAI PRO LIXO POR CAUSA DE UM MAPA OU DE UMA ESPÉCIE. Se o
 *  mapa onde ele parou não existe agora (um DLC desligado — a KANTO
 *  DISTORCIDA —, um mapa que saiu do jogo), a partida volta pro último lugar
 *  seguro; e o Pokémon de uma espécie que não existe agora fica guardado à
 *  parte (`st.semEspecie`), e volta pro PC quando a espécie voltar. Antes, os
 *  dois casos viravam "incompatível" e um JOGO NOVO gravado por cima. */
function consertarSave(st) {
  if (!st?.player) return;
  if (!DB.MAPS[st.player.map] || !DB.KANTO[st.player.map]) {
    const r = st.respawn && DB.MAPS[st.respawn.map] && DB.KANTO[st.respawn.map]
      ? st.respawn : { map: DB.START_MAP, ...DB.MAPS[DB.START_MAP].spawn };
    console.warn(`[save] o mapa "${st.player.map}" não existe agora — voltando pra ${r.map}`);
    Object.assign(st.player, { map: r.map, x: r.x, y: r.y, dir: r.dir || "down" });
    if (st.mission) st.mission = null;
  }
  const existe = (m) => m && DB.SPECIES[m.species];
  const fora = (st.party || []).filter((m) => !existe(m));
  if (fora.length) {
    st.party = st.party.filter(existe);
    st.semEspecie = [...(st.semEspecie || []), ...fora];
    console.warn(`[save] ${fora.length} Pokémon de espécie que não existe agora — guardados à parte`);
  }
  // quem estava guardado à parte e já tem espécie de novo volta pro PC
  if (st.semEspecie?.length) {
    const voltam = st.semEspecie.filter(existe);
    st.semEspecie = st.semEspecie.filter((m) => !existe(m));
    for (const m of voltam) (st.box ||= []).push(m);
  }
  // a equipe não pode ficar vazia: o primeiro do PC sobe
  if (!st.party?.length) {
    const b = (st.boxes || []).find((x) => (x.mons || []).some(existe));
    const i = b ? b.mons.findIndex(existe) : -1;
    if (i >= 0) { st.party = [b.mons[i]]; b.mons[i] = null; }
    else if (st.box?.length) st.party = [st.box.shift()];
  }
}

// MENINO OU MENINA: escolhido no JOGO NOVO, depois da região. Muda o desenho
// no mapa (hero / heroina, ver Assets.actor) e o nome de quem joga. Save sem
// o campo é de antes da escolha existir: menino. Em BRAGLITCH são os gêmeos
// de lá, CAIO e LARA (tools/sprite_caio_lara.py).
const NOME_DO_GENERO = { menino: "VERMELHO", menina: "FOLHA" };
const NOME_BRAGLITCH = { menino: "CAIO", menina: "LARA" };

function newState(regiao, genero = "menino", dificuldade = "medio") {
  const inicio = mapaInicial(regiao);
  if (!NOME_DO_GENERO[genero]) genero = "menino";
  return {
    regiao: inicio === DB.START_MAP ? "kanto" : "braglitch",
    player: { name: (inicio === DB.START_MAP ? NOME_DO_GENERO : NOME_BRAGLITCH)[genero], genero, map: inicio, ...DB.MAPS[inicio].spawn },
    party: [],
    box: [],
    items: { "poké bola": 5, "poção": 3 },
    money: 3000,
    corruption: 0,
    fragChance: DB.SPOT_CHANCE,     // sobe a cada mapa (ver src/data/fragments.js)
    badges: [],
    flags: {},
    npcState: {},
    seen: {},
    caught: {},
    playtime: 0,
    // A SUA vida. Os selvagens bravos batem em VOCÊ, não na sua equipe (o
    // Pokémon do lado é seu companheiro, não seu escudo). Zerou, você apaga no
    // mato e acorda no último lugar seguro. Enche num Centro, na sua mãe ou
    // descansando na barraca — nos mesmos lugares que curam a equipe.
    vida: null,        // preenchido no primeiro quadro (ver `vidaMax` no config)
    respawn: { map: inicio, ...DB.MAPS[inicio].spawn },
    // A DIFICULDADE da partida (src/systems/dificuldade.js): escolhida no jogo
    // novo, trocável no OPÇÕES. Save sem ela joga no MÉDIO.
    dificuldade,
  };
}

const game = {
  state: newState(),
  scenes: null,
  debug: false,

  /** `regiao`: "kanto" ou "braglitch"; `genero`: "menino" ou "menina";
   *  `dificuldade`: o id de src/systems/dificuldade.js (as três escolhas da
   *  tela de título). */
  newGame(regiao, genero, dificuldade) {
    this.state = newState(regiao, genero, dificuldade);
    setTextVars({ NOME: this.state.player.name, RIVAL: this.state.rivalNome || DB.RIVAL?.nome || "AZUL" });
    Glitch.level = this.state.corruption;
    return this.state;
  },

  /** Grava. Se o arquivo tiver algo mais novo (o giveglitch mexeu enquanto você
   *  jogava), NÃO sobrescreve: adota o que está no disco. */
  async save() {
    this._lastSave = performance.now();
    const r = await Save.write(this.state);
    if (r === "conflito") await this.adoptSave("o arquivo tinha algo mais novo");
    return r;
  },

  /** Recarrega a partida do arquivo (alguém gravou por fora). */
  async adoptSave(motivo = "") {
    if (!(this.scenes?.top instanceof OverworldScene)) {
      this._adoptPending = motivo || true;      // no meio de uma batalha: espera
      return false;
    }
    const st = await Save.load();
    registrarDoEstado(st);              // as fusões do arquivo voltam a existir
    if (!st?.player || !this.isValid(st)) return false;
    this.state = st;
    this.state.badges ||= [];
    renomearBichos(this.state);
    reverterTudo(this.state);
    this.state.party.forEach(recalc);
    this.state.box?.forEach(recalc);
    Glitch.level = this.state.corruption || 0;
    Glitch.forced = !!this.state.flags?.glitchWorld;
    this._lastSave = performance.now();
    this.scenes.stack.forEach((sc) => sc.onSaveAdopted?.(motivo));
    console.log("%c[save] partida recarregada do arquivo", "color:#59d99b", motivo);
    return true;
  },

  /** Salva sozinho nos momentos seguros (trocar de mapa, sair de batalha, fechar
   *  a aba). Antes disso a partida só existia na memória: fechar o navegador
   *  sem passar no menu SALVAR perdia tudo. */
  autosave(force = false) {
    if (!this.state?.party) return;
    if (this.scenes?.top instanceof TitleScene) return;
    const agora = performance.now();
    if (!force && agora - (this._lastSave || 0) < 5000) return;   // no máximo um a cada 5s
    return this.save();
  },

  /** save/estado de uma versão antiga dos dados não deve quebrar o jogo */
  isValid(st) {
    // a GLITCH ZONE não está em arquivo nenhum: quem salvou dentro de uma
    // precisa que ela seja remontada ANTES de o mapa ser procurado, senão o
    // save inteiro passa por "incompatível" e vira jogo novo
    if (st?.zona && st.player?.map === ZONA) garantirZona(st);
    if (!st?.player || !DB.MAPS[st.player.map] || !DB.KANTO[st.player.map]) return false;
    return (st.party || []).every((m) => DB.SPECIES[m.species]);
  },

  loadGame() {
    const data = Save.read();
    // a espécie de uma fusão não está em src/data/: ela é remontada do id que
    // está no save, e precisa existir ANTES de qualquer validação
    registrarDoEstado(data);
    if (data && (!this.isValid(data) || data.semEspecie?.length)) consertarSave(data);
    if (data && !this.isValid(data)) {
      console.warn("[save] incompatível com os dados atuais — começando um jogo novo");
      return this.newGame();
    }
    if (data) {
      this.state = data;
      this.state.badges ||= [];
      renomearItens(this.state);
      renomearBichos(this.state);
      reverterTudo(this.state);
      Glitch.forced = !!this.state.flags?.glitchWorld;
      this.state.party.forEach(recalc);
      this.state.box?.forEach(recalc);
      darClaraoNoSave(this.state);   // todo LUMINOSO sabe o CLARÃO ILUMINADO
    } else this.newGame();
    setTextVars({ NOME: this.state.player?.name || "VERMELHO", RIVAL: this.state.rivalNome || DB.RIVAL?.nome || "AZUL" });
    return this.state;
  },

  giveStarter(id) {
    const mon = createMon(id, 5);
    this.state.party.push(mon);
    this.state.caught[id] = true;
    this.state.seen[id] = true;
    return mon;
  },

  /** Toca a faixa do mapa. As músicas ficam em src/data/music.js (hot-swap:
   *  editar lá troca a trilha sem recarregar o jogo). */
  music(kind) {
    const alias = DB.MUSIC_ALIAS?.[kind] || kind;
    const song = DB.MUSIC?.[alias] || DB.MUSIC?.pallet;
    if (song && song === Audio2.musicaAtual) return;   // já é essa que está tocando
    Audio2.playMusic(alias, song);
  },

  /** liga o idioma guardado nas opções (e o dicionário novo, no hot-swap) */
  aplicarIdioma() {
    const id = Opcoes.get("idioma") || "pt";
    usarIdioma(id, DB.DICIONARIOS?.[id] || null);
  },

  /** chamado pelo live update quando src/data/* muda */
  applyData(next) {
    Object.assign(DB, next);
    aplicarDLC();                       // o DB novo veio sem os DLCs
    this.aplicarIdioma();               // o dicionário pode ter sido reescrito
    registrarDoEstado(this.state);      // o DB novo veio sem as fusões desta partida
    this.state.party.forEach(recalc);
    this.state.box?.forEach(recalc);
    this.scenes.stack.forEach((s) => s.onDataChange?.());
    Glitch.hit(0.5);
  },

  serialize() {
    return {
      state: this.state,
      scene: this.scenes.top?.constructor?.name || "TitleScene",
      v: Save.versao(),        // em que versão do arquivo este estado se baseia
    };
  },
};

Assets.init();
initInput(window);
game.aplicarIdioma();

// sprites externos (assets/sprites/**) entram por cima da arte provisoria.
// A lista sai dos proprios mapas — todo NPC, os oito lideres de ginasio inclusos —
// mais os papeis usados fora deles (jogador, rival, telas). Antes era uma lista
// fixa: quem nao estivesse nela ficava com a silhueta provisoria mesmo tendo PNG.
const PAPEIS_FIXOS = [
  "hero", "heroina", "prof", "mae", "garoto", "garota", "velho", "velha", "menino", "menina",
  "enfermeira", "balconista", "rival", "gentleman", "cientista", "cacador", "policial", "pescador",
  "motoqueiro", "marinheiro", "montanhista", "rocket", "rocketf", "gordo", "lutador", "superm", "superf",
  "tecnico", "tecnica", "canalizadora", "maniaco", "roqueiro", "ipe",
  "hero_brag", "heroina_brag", "ash", "vitor", "andre",
];
const ATORES = [...new Set([
  ...PAPEIS_FIXOS,
  ...Object.values(DB.MAPS).flatMap((m) => (m.npcs || []).map((n) => n.sprite)),
])].filter((n) => n && n !== "ball" && n !== "portal");   // esses dois sao desenhados em codigo

// No boot vão só os personagens e os tiles — eles aparecem em toda tela. Os
// Pokémon são pedidos quando entram em cena (ver `pedirMon`): antes o jogo
// abria pedindo quase 400 arquivos de bicho que talvez nem aparecesse.
loadExternalSprites(ATORES);


game.scenes = new SceneStack(game);

// Sem a geometria de Kanto (assets/maps/kanto.json) não existe mapa nenhum pra
// pisar: em vez de estourar num canto escuro, o jogo diz o que falta. É o que
// aparece pra quem clonou o repositório e ainda não rodou os importadores — e
// pra quem abriu uma cópia publicada sem os mapas junto.
if (!DB.KANTO?.[DB.START_MAP]) {
  const linhas = [
    "FALTAM OS MAPAS DE KANTO.",
    "",
    "assets/maps/kanto.json nao veio junto.",
    "Rode, na pasta do jogo:",
    "  python3 tools/fetch_maps.py",
    "",
    "Os importadores baixam pra SUA maquina;",
    "nada de arte oficial vive neste repositorio.",
  ];
  ctx.fillStyle = "#101018";
  ctx.fillRect(0, 0, W, H);
  linhas.forEach((l, i) => drawText(ctx, l, 8, 16 + i * 14, i === 0 ? "#b455ff" : "#c8ccd4"));
  dctx.drawImage(buffer, 0, 0);
  resize();
  throw new Error("[dados] assets/maps/kanto.json não encontrado");
}

// OS DLCs entram aqui: depois do DB montado, antes de qualquer cena olhar pra
// ele. `?dlc=<id>` liga antes de carregar (src/systems/dlc.js).
ligarDoLink();
await carregarDLC();
aplicarDLC();

// o save vem do arquivo do computador (save/save.json), não do navegador
await Save.load();

// restaura estado apos um reload do live update
const stash = Save.popStash();
// se o arquivo mudou enquanto a página recarregava (giveglitch), ele ganha
if (stash?.state && Save.read()?.player && (stash.v ?? 0) < Save.versao()) {
  console.warn("[hot] o save do arquivo é mais novo — usando ele");
  stash.state = Save.read();
}
if (stash?.state) registrarDoEstado(stash.state);
if (stash?.state && !game.isValid(stash.state)) {
  console.warn("[hot] estado antigo descartado (dados mudaram)");
  game.newGame();
  game.scenes.push(new TitleScene());
} else if (stash?.state) {
  game.state = stash.state;
  renomearBichos(game.state);
  reverterTudo(game.state);
  game.state.party.forEach(recalc);
  game.state.box?.forEach(recalc);
  Glitch.level = game.state.corruption;
  game.scenes.push(stash.scene === "TitleScene" ? new TitleScene() : new OverworldScene());
  console.log("%c[hot] estado restaurado", "color:#59d99b");
} else {
  // Boot de verdade: a ABERTURA vem antes do título. Ela não entra quando o
  // live update restaura a partida (acima) nem quando alguém abriu com atalho
  // de dev (?map=, ?battle=) ou pelo link de uma GLITCH ZONE (?area=) — nesses
  // casos ninguém quer ver fanfarra, e no primeiro ela apareceria a cada
  // arquivo salvo.
  const busca = new URLSearchParams(location.search);   // o `q` do arquivo só nasce mais abaixo
  const atalhoDeDev = busca.has("map") || busca.has("battle") || busca.has("starter") || busca.has("era")
    || busca.has("area") || busca.has("pokesave") || busca.has("lendasbrag") || busca.has("ilhas");
  game.scenes.push(atalhoDeDev ? new TitleScene() : new AberturaScene());
}

/** "spearow:10,cranidos:19" -> coloca esses Pokémon na equipe (sobra vai pro box) */
function addMons(state, spec) {
  for (const item of String(spec).split(",")) {
    const [id, lvl, extra] = item.trim().split(":");   // pidgey:8:alfa -> ALFA
    if (!DB.SPECIES[id]) { console.warn("[give] espécie desconhecida:", id); continue; }
    // pidgey:8:shiny / :luminoso / :alfa / :shinyalfa (o JUNTAR do DECODIFICADOR)
    const marcas = ["alfa", "shiny", "luminoso", "shinyalfa"];
    const mon = createMon(id, Math.max(1, Math.min(100, +lvl || 5)), {
      alfa: /alfa/.test(extra || "") && marcas.includes(extra),
      shiny: /^shiny/.test(extra || ""), luminoso: extra === "luminoso" });
    // blastoise:70:surfar+hidrobomba -> já com esses golpes
    const golpes = extra && !marcas.includes(extra) ? extra.split("+").filter((g) => DB.MOVES[g]).slice(0, 4) : [];
    if (golpes.length) mon.moves = golpes.map((g) => ({ id: g, pp: DB.MOVES[g].pp, ppMax: DB.MOVES[g].pp }));
    (state.party.length < 6 ? state.party : state.box).push(mon);
    state.seen[id] = true;
    state.caught[id] = true;
  }
}

// ------------------------------------------------- atalhos de desenvolvimento
// ?map=route1&x=7&y=10  |  ?battle=missingno&lvl=8  |  ?starter=squirtle  |  ?debug=1
// ?map=route1&rasgo=1 -> um rasgo aberto do seu lado (a GLITCH RAID)
// ?era=fosseis | ?map=viridian_forest&x=21&y=23&eras=1 -> o pós-jogo do CELEBI
const q = new URLSearchParams(location.search);
// ?lendasbrag=1 -> A VERSÃO DE TESTE do MISSINGNO em Braglitch: jogo novo na
// BR-101 com as seis lendas pegas (sem ?map, começa em rota_br101)
if (q.has("lendasbrag") && !q.has("map")) q.set("map", "rota_br101");
// ?doces=1 -> OS DOCES DO ALCREMIE: na sala de prêmios do cassino, de frente
// pro balcão, com MILCERY e ALCREMIE, 2 de cada doce e 1000 fichas
if (q.has("doces") && !q.has("map")) {
  for (const [k, v] of [["map", "celadon_city_game_corner_prize_room"], ["x", "6"], ["y", "4"], ["dir", "up"],
                        ["starter", "milcery:20"], ["party", "alcremie:40"], ["fichas", "1000"]]) if (!q.has(k)) q.set(k, v);
}
// ?verbase=braglitch (ou kanto, kalos) -> abre DIRETO a base secreta dessa
// região, já com uns móveis postos (pra ver a caverna e a parede)
if (q.has("verbase") && !q.has("map")) {
  const reg = q.get("verbase") || "kanto";
  q.set("map", reg === "braglitch" ? "sao_lucario" : reg === "kalos" ? "lumiose" : "viridian");
  if (reg === "braglitch") q.set("regiao", "braglitch");
}
// ?bases=1 -> AS BASES SECRETAS: em VIRIDIAN, de frente pra ESCOTEIRA (o kit) e
// do lado da LOJA DE DECORAÇÃO, com 20000 de dinheiro e 2 de cada móvel
if (q.has("bases") && !q.has("map")) {
  for (const [k, v] of [["map", "viridian"], ["x", "24"], ["y", "33"], ["dir", "up"], ["starter", "pikachu:20"], ["party", "eevee:20,bulbasaur:20"]]) if (!q.has(k)) q.set(k, v);
}
// ?miniors=1 -> A CHUVA DE MINIORS: na CHAPADA DOS VEADEIROS (Braglitch), de
// frente pra ASTRÔNOMA, com BLASTOISE e LUCARIO N45 (água e aço: o MINIOR é
// PEDRA/VOADOR — o CHARIZARD de antes levava 4x) e 20 ULTRA BALLS
if (q.has("miniors") && !q.has("map")) {
  for (const [k, v] of [["map", "chapada"], ["x", "17"], ["y", "37"], ["dir", "up"], ["regiao", "braglitch"], ["starter", "blastoise:45"], ["party", "lucario:45"]]) if (!q.has(k)) q.set(k, v);
}
// ?bebbidah=1 -> O BEBBIDAH: na BR-101 (Braglitch) com 3 BEBBIDAH, o
// primeiro já segurando HORTELÃ, e 3 de cada ingrediente na mochila. Ande em
// círculo (2 voltas) pra ele girar e evoluir
if (q.has("bebbidah") && !q.has("map")) {
  for (const [k, v] of [["map", "rota_br101"], ["regiao", "braglitch"], ["starter", "bebbidah:20"],
                        ["party", "bebbidah:20,bebbidah:20"]]) if (!q.has(k)) q.set(k, v);
}
// ?subterraneo=1 -> O SUBTERRÂNEO DE KANTO: em CELADON, com a PICARETA (use na
// mochila pra descer), 3 estátuas e o KIT de base na mochila
if (q.has("subterraneo") && !q.has("map")) {
  for (const [k, v] of [["map", "celadon_city"], ["x", "20"], ["y", "15"], ["dir", "down"], ["starter", "quaquaval:50"]]) if (!q.has(k)) q.set(k, v);
}
// ?segurar=1 -> OS ITENS DE SEGURAR: na ROTA 1, com CHARMANDER e PIKACHU e um
// de cada item de segurar na mochila (dê pela mochila, tire pelo menu EQUIPE)
// ?fantasmas=1 -> na TORRE POKÉMON (2º andar), do lado do AZUL na lápide e do
// CAÇADOR DE FANTASMAS (src/data/cacafantasma.js). &almas=1 -> com 95 fichas de
// alma do PIKACHU e do RATICATE
if (q.has("fantasmas") && !q.has("map")) {
  for (const [k, v] of [["map", "pokemon_tower_2f"], ["x", "16"], ["y", "8"], ["dir", "left"], ["starter", "charmander:20"]]) if (!q.has(k)) q.set(k, v);
}
// ?metas=1 -> na ROTA 1 com metas de exemplo (menu START → METAS)
if (q.has("metas") && !q.has("map")) {
  for (const [k, v] of [["map", "route1"], ["starter", "charmander:20"], ["party", "pikachu:20"]]) if (!q.has(k)) q.set(k, v);
}
if (q.has("segurar") && !q.has("map")) {
  for (const [k, v] of [["map", "route1"], ["starter", "charmander:20"], ["party", "pikachu:20"]]) if (!q.has(k)) q.set(k, v);
}
// ?paintball=1 -> em CELADON, de frente pra porta da loja de departamento (a
// ARENA DE PAINTBALL), com PIKACHU e SQUIRTLE. &fichas=9999 -> com fichas do
// cassino pra testar o balcão de prêmios
if (q.has("paintball") && !q.has("map")) {
  for (const [k, v] of [["map", "celadon_city"], ["x", "11"], ["y", "15"], ["dir", "up"], ["starter", "pikachu:20"], ["party", "squirtle:20"]]) if (!q.has(k)) q.set(k, v);
}
// ?superpawmot=1 -> no SEU QUARTO, já jogando o SUPER PAWMOT no NINTENDO SWITCH
if (q.has("superpawmot") && !q.has("map")) {
  for (const [k, v] of [["map", "quarto"], ["x", "6"], ["y", "6"], ["dir", "up"]]) if (!q.has(k)) q.set(k, v);
}
// ?canhaomax=1 -> em SAFFRON, de frente pra PESQUISADORA DO DYNAMAX, já com a
// PULSEIRA: ela abre o CANHÃO DE RAIOS (src/scenes/canhaomax.js) e faz SOPA MAX.
// &cogumelos=N -> já com N COGUMELOS MAX
if (q.has("canhaomax") && !q.has("map")) {
  for (const [k, v] of [["map", "saffron_city"], ["x", "23"], ["y", "16"], ["dir", "up"], ["starter", "pikachu:35"]]) if (!q.has(k)) q.set(k, v);
}
// ?cores=1 -> AS CORES TRAVADAS: em Viridian, de frente pra CAÇADORA DE CORES,
// com um CHARMANDER N15 e Poké Bolas (o PIKACHU SHINY fica na ROTA 2, oeste)
if (q.has("cores") && !q.has("map")) {
  for (const [k, v] of [["map", "viridian"], ["x", "30"], ["y", "22"], ["dir", "up"], ["starter", "charmander:15"]]) if (!q.has(k)) q.set(k, v);
}
// ?ilhas=1&perfil=teste -> BRAGLITCH com a missão das ilhas dada: no píer de SÃO
// LUCARIO, do lado da lancha da IPÊ (TRONKY no 12). ?ilhas=N (2..8) já chega
// com as ilhas de antes entregues, e na ilha N
if (q.has("ilhas") && !q.has("map")) {
  const n = Math.max(1, Math.min(8, +q.get("ilhas") || 1));
  const ilha = DB.ILHAS_BRAG?.[n - 1];
  if (n > 1 && ilha) { q.set("map", ilha.id); q.set("x", ilha.chegada.x); q.set("y", ilha.chegada.y); }
  else { q.set("map", "sao_lucario"); q.set("x", 14); q.set("y", 21); }
  if (!q.has("starter")) q.set("starter", `tronky:${5 + n * 5}`);
}
// ?gemeo=belem&genero=menino&perfil=teste -> BRAGLITCH de frente pro GÊMEO
// (o rival de lá, src/data/rival.js): lab, belem, salvador, sampa, rio ou
// brasilia, com as insígnias de ginásio que aquele encontro pede
const GEMEO_TESTE = q.has("gemeo") && (DB.GEMEO?.encontros || []).find((e) => e.id === q.get("gemeo"));
if (GEMEO_TESTE && !q.has("map")) {
  const l = GEMEO_TESTE.cidade ? DB.LUGAR_DO_GEMEO[GEMEO_TESTE.cidade] : GEMEO_TESTE;
  q.set("map", GEMEO_TESTE.cidade || GEMEO_TESTE.mapa);
  q.set("x", l.x); q.set("y", l.y + 1); q.set("dir", "up");
  const lvl = { lab: 5, belem: 14, salvador: 25, sampa: 36, rio: 46, brasilia: 53 }[GEMEO_TESTE.id] || 20;
  if (!q.has("starter")) q.set("starter", `tronky:${lvl}`);
}
// ?amigos=recife&perfil=teste -> BRAGLITCH na frente do VÍTOR e do ANDRÉ
// (src/data/amigos.js) naquele encontro: saida, ilha1, recife, ilha3, caruaru,
// ilha5, ouropreto, ilha7, ilha8, liga ou campeao — com as insígnias, ilhas e
// marcas que ele pede
const AMIGOS_TESTE = q.has("amigos") && (DB.AMIGOS?.encontros || []).find((e) => e.id === q.get("amigos"));
if (AMIGOS_TESTE && !q.has("map")) {
  const l = lugarDoEncontro(AMIGOS_TESTE);
  q.set("map", l.mapa); q.set("x", l.x + 2); q.set("y", l.y + 2); q.set("dir", "up");
  const lvl = [8, 12, 20, 25, 30, 35, 42, 47, 52, 60, 60][AMIGOS_TESTE.etapa] || 30;
  if (!q.has("starter")) q.set("starter", `tronky:${lvl}`);
}
// ?extrema=convite|festa|glitnexy&dlc=extrema&perfil=teste (&regiao=braglitch)
// -> a GLITCH DIMENSION EXTREMA (dlc/extrema.js), UM ANO DEPOIS: Kanto e
// Braglitch acabados e você no começo daquela parte — do lado da carteira, na
// porta da festa, ou na frente do GLITNEXY com espetinho na mochila
const EXTREMA_TESTE = q.has("extrema") ? (q.get("extrema") || "convite") : null;
if (EXTREMA_TESTE && !q.has("map")) {
  const brag = q.get("regiao") === "braglitch";
  const [mapa, x, y] = EXTREMA_TESTE === "convite" ? (brag ? ["sao_lucario", 6, 13] : ["pallet", 8, 9])
    : [brag ? "bra_lab" : "lab", 3, EXTREMA_TESTE === "festa" ? 7 : 6];
  q.set("map", mapa); q.set("x", x); q.set("y", y); q.set("dir", "up");
  if (!q.has("starter")) q.set("starter", brag ? "paubrasilisco:75" : "charizard:75");
  if (!q.has("party")) q.set("party", "dragonite:72,gengar:72,lapras:72,snorlax:72");
}
// ?liga=0&genero=menino&perfil=teste -> a ESPLANADA DA LIGA de Braglitch
// (src/data/braglitch-liga.js) com as 8 insígnias e o MISSINGNO vencido: 0 na
// frente do guarda, 1..4 na frente do próximo quiz com N já passados (4 = na
// frente dos campeões, com o gêmeo do lado). Time forte pra aguentar.
const LIGA_TESTE = q.has("liga") && DB.LIGA_BRAG ? Math.max(0, Math.min(4, +q.get("liga") || 0)) : null;
if (LIGA_TESTE != null && !q.has("map")) {
  const PAREDOES = DB.LIGA_BRAG.paredoes;
  q.set("map", DB.LIGA_BRAG.mapa);
  if (LIGA_TESTE === 0) { q.set("x", 14); q.set("y", PAREDOES[0] - 1); }
  else if (LIGA_TESTE < 4) { q.set("x", 14); q.set("y", PAREDOES[LIGA_TESTE + 1] - 1); }
  else { q.set("x", 13); q.set("y", 34); }
  q.set("dir", "down");
  if (!q.has("starter")) q.set("starter", "paubrasilisco:62");
  if (!q.has("party")) q.set("party", "magmastim:60,tilapiracu:60,dragonite:60");
}
// ?descontrolada=gengar&perfil=teste -> de NOITE, do lado da MEGA DESCONTROLADA
// daquela espécie (src/data/descontroladas.js), com um time forte
const DESC_TESTE = q.has("descontrolada")
  && (DB.DESCONTROLADAS?.lista || []).find((d) => d.id === q.get("descontrolada") || d.to === q.get("descontrolada"));
if (DESC_TESTE && !q.has("map")) {
  q.set("map", DESC_TESTE.mapa);
  q.set("x", DESC_TESTE.perto[0]); q.set("y", DESC_TESTE.perto[1]);
  if (!q.has("starter")) q.set("starter", "charizard:60");
  if (!q.has("party")) q.set("party", "blastoise:60,venusaur:60,dragonite:60");
}
// ?ash=1&perfil=teste -> em PALLET, já campeão de Braglitch, com um time forte,
// colado no ASH (src/data/ash.js) e virado pra ele: é só apertar A
const ASH_TESTE = q.has("ash");
if (ASH_TESTE && !q.has("map")) {
  q.set("map", DB.ASH?.mapa || "pallet");
  if (!q.has("starter")) q.set("starter", "mewtwo:90");
  if (!q.has("party")) q.set("party", "rayquaza:90,garchomp:90,tyranitar:90,metagross:90,salamence:90");
  if (!q.has("flags")) q.set("flags", "bragCampeao");
}
if (q.has("map") || q.has("battle") || q.has("era")) {
  // &dificuldade=bebe|muitofacil|facil|medio|dificil|quaseimpossivel
  // &regiao=braglitch -> a jornada de BRAGLITCH (CAIO/LARA), mesmo num mapa de Kanto
  game.newGame(GEMEO_TESTE || AMIGOS_TESTE || LIGA_TESTE != null || q.get("regiao") === "braglitch" ? "braglitch" : undefined, q.get("genero") || undefined, q.get("dificuldade") || undefined);
  {
    // &starter=pikachu:50:alfa -> o terceiro pedaço "alfa" faz ele ALFA
    let [sid, slvl, sextra] = (q.get("starter") || "charmander").split(":").map((x) => x.trim().toLowerCase());
    // espécie que não existe (escrita com espaço, "PIKACHU", "pikachu nv"...)
    // quebrava o jogo inteiro no createMon: avisa e vai de CHARMANDER
    if (!DB.SPECIES[sid]) { console.warn("[starter] espécie desconhecida:", sid, "— usando charmander"); sid = "charmander"; }
    slvl = slvl && Math.max(1, Math.min(100, +slvl.replace(/\D/g, "") || 5));
    const mon = game.giveStarter(sid);
    if (sextra === "alfa") mon.alfa = true;
    // no nível pedido, e com os golpes desse nível (não os do 5)
    if (slvl) { mon.level = slvl; mon.xp = Math.floor(slvl ** 3); mon.moves = createMon(sid, slvl).moves; recalc(mon); mon.hp = mon.maxHp; }
    // atalho de dev: a POKÉDEX já vem na mão (o resto do laboratório não)
    game.state.flags.pokedex = true;
  }
  const p = game.state.player;
  if (q.has("map")) {
    const spawn = DB.MAPS[q.get("map")].spawn;
    p.map = q.get("map");
    p.x = q.has("x") ? +q.get("x") : spawn.x;
    p.y = q.has("y") ? +q.get("y") : spawn.y;
    p.dir = q.get("dir") || spawn.dir;
  }
  if (q.has("badges")) {   // ?badges=3 -> começa com 3 insígnias e o professor te chamando
    const n = Math.min(8, +q.get("badges") || 0);
    game.state.badges = DB.STORY.badges.slice(0, n).map((b) => b.id);
    game.state.flags.oakPending = n > 0;
    game.state.flags.starterChosen = true;
  }
  if (DESC_TESTE) {
    // o relógio do mundo no começo da próxima NOITE (src/systems/ciclo.js)
    const fase = minutosDaFase() * 60000, ciclo = 2 * fase;
    game.state.relogio = (ciclo - (Date.now() % ciclo)) % ciclo + fase + 1000;
    game.state.items["poção"] = 20;
    // as de LUMIOSE só aparecem com a ROYALE andando: a MEGA FLOETTE do fim
    // espera o rank A e as quatro dos bairros vencidas (src/data/kalos.js)
    if (DESC_TESTE.mapa?.startsWith("lumiose")) {
      const ns = game.state.npcState;
      game.state.flags.zaInscrito = true;
      for (const L of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") (ns[`lumiose.za_${L}`] ||= {}).defeated = true;
      if (DESC_TESTE.to === "megafloette") {
        for (const d of DB.DESCONTROLADAS.lista) {
          if (d.mapa?.startsWith("lumiose") && d !== DESC_TESTE) (ns[`${d.mapa}.descontrolada_${d.to}`] ||= {}).defeated = true;
        }
      }
    }
  }
  if (LIGA_TESTE != null) {
    Object.assign(game.state.flags, { starterChosen: true, bragMissao: true, bragMissingnoVencido: true });
    game.state.bragBadges = (DB.INSIGNIAS_BRAG || []).map((b) => b.id);
    if (LIGA_TESTE > 0) game.state.flags.ligaPortao = true;
    for (let i = 0; i < LIGA_TESTE; i++) game.state.flags[`ligaQuiz${i}`] = true;
    game.state.items["poção"] = 20;
  }
  if (AMIGOS_TESTE) {
    const r = AMIGOS_TESTE.requer || {};
    Object.assign(game.state.flags, { starterChosen: true, bragMissao: true, bragIlhas: true });
    if (r.flag) game.state.flags[r.flag] = true;
    if (r.flag === "bragCampeao") game.state.flags.bragMissingnoVencido = true;
    const fim = AMIGOS_TESTE.etapa >= 9;
    game.state.bragBadges = [
      ...(DB.INSIGNIAS_BRAG || []).slice(0, fim ? 8 : r.ginasios ?? r.ilhas ?? 0).map((b) => b.id),
      ...(DB.ILHAS_BRAG || []).slice(0, fim ? 8 : r.ilhas ?? (r.ginasios || 0)).map((i) => `ilha_${i.id}`),
    ];
    game.state.items["poção"] = 20;
  }
  if (EXTREMA_TESTE) {
    const st = game.state, r = st.regiao === "braglitch" ? "b" : "k";
    Object.assign(st.flags, { starterChosen: true, caughtMissingno: true, dimUnlocked: true,
                              bragMissao: true, bragIlhas: true, bragIlhasFim: true, bragMissingnoVencido: true, bragCampeao: true });
    st.badges = DB.STORY.badges.map((b) => b.id);
    st.bragBadges = [...(DB.INSIGNIAS_BRAG || []).map((b) => b.id), ...(DB.ILHAS_BRAG || []).map((i) => `ilha_${i.id}`)];
    for (const pd of DB.PANDEIROS || []) { st.flags[`pandeiro_${pd.id}`] = true; st.items[pd.item] = 1; }
    st.missoes ||= {};
    if (EXTREMA_TESTE !== "convite") {
      st.flags.gdeUmAno = true;
      st.flags[`gde_${r}_convidou`] = true;
      st.missoes[`gde_${r}_convite`] = { estado: "feita" };
      st.missoes[`gde_${r}_festa`] = { estado: "ativa" };
    }
    if (EXTREMA_TESTE === "glitnexy") {
      st.flags[`gde_${r}_passado`] = true;
      st.missoes[`gde_${r}_festa`] = { estado: "feita" };
      Object.assign(st.items, { "oran berry": 10, "chesto berry": 10, "liechi berry": 3 });
    }
    st.items["poção"] = 20;
    st.items["ultra ball"] = 30;
  }
  if (GEMEO_TESTE) {
    game.state.flags.starterChosen = true;
    game.state.flags.bragMissao = true;
    game.state.bragBadges = (DB.INSIGNIAS_BRAG || []).slice(0, GEMEO_TESTE.requer?.ginasios || 0).map((b) => b.id);
  }
  if (q.has("ilhas")) {    // a missão das ilhas dada, e as de antes de N já entregues
    const n = Math.max(1, Math.min(8, +q.get("ilhas") || 1));
    Object.assign(game.state.flags, { starterChosen: true, bragMissao: true, bragIlhas: true });
    game.state.bragBadges = (DB.ILHAS_BRAG || []).slice(0, n - 1).map((i) => `ilha_${i.id}`);
    for (const pd of DB.PANDEIROS || []) {
      if (!game.state.bragBadges.includes(`ilha_${pd.ilha}`)) continue;
      game.state.flags[`pandeiro_${pd.id}`] = true;
      game.state.items[pd.item] = 1;
    }
    game.state.items["poké bola"] = 99;
  }
  // ?berries=1&map=cinnabar_island&x=9&y=13 -> 3 de cada berry na mochila, do
  // lado do LIQUIDIFICADOR (os POKÉBLOCOS, src/data/pokeblocos.js)
  if (q.has("berries")) {
    for (const b of Object.keys(DB.POKEBLOCOS?.BERRIES_SABOR || {})) game.state.items[b] = 3;
    game.state.flags.starterChosen = true;
  }
  // ?pokeblocos=1 -> o ESTOJO com uns pokéblocos prontos (dois pesados), pra
  // jogar nos selvagens (&battle=snorlax)
  if (q.has("pokeblocos")) {
    game.state.items[DB.POKEBLOCOS.ESTOJO] = 1;
    game.state.pokeblocos = [
      { cor: "rosa", sabor: [0, 0, 26, 0, 0], resistencia: 1, peso: 2, nivel: 26 },
      { cor: "vermelho", sabor: [30, 0, 0, 0, 0], resistencia: 4, peso: 3, nivel: 30 },
      { cor: "dourado", sabor: [56, 8, 56, 8, 56], resistencia: 8, peso: 9, nivel: 56 },
      { cor: "dourado", sabor: [56, 8, 56, 8, 56], resistencia: 8, peso: 9, nivel: 56 },
    ];
  }
  // ?zygarde=1&map=rock_tunnel_b1f&x=24&y=22 -> a CAÇADA DO ZYGARDE com a missão
  // O Z DO DNA dada (as células ficam dois tiles acima)
  if (q.has("zygarde")) {
    (game.state.missoes ||= {})["z-do-dna"] = { estado: "ativa", desde: 0 };
    game.state.flags.zygEtapa = 0;
    game.state.flags.starterChosen = true;
    // (a caçada só começa com 200 CÉLULAS no CUBO: o teste já vem com elas)
    game.state.items["cubo zygarde"] = 1;
    game.state.celulasZygarde = Math.max(game.state.celulasZygarde || 0, +q.get("celulas") || 200);
    game.state.items["ultra ball"] = 30;
  }
  if (q.get("glitchworld")) {   // ?glitchworld=1 -> testa a caçada final
    game.state.flags.glitchWorld = true;
    game.state.corruption = 60;
    Glitch.forced = true;
  }
  if (q.get("escort") === "lab") {   // já no laboratório, missão cumprida
    game.state.escort = { stage: "atLab", map: "lab", x: 5, y: 11, dir: "right",
                          from: { map: "pewter_city", x: 17, y: 6, dir: "down" } };
    game.state.flags.oakPending = false;
  } else if (q.get("escort")) game.state.flags.escortPending = true;
  if (q.has("dinheiro")) game.state.money = +q.get("dinheiro") || 0;   // ?dinheiro=9000 -> pra testar compra
  if (q.has("pegos")) {   // ?pegos=regirock,regice -> gigantes já pegos (destrava o REGIGIGAS e o REGIGLITCH)
    game.state.flags ||= {};
    game.state.flags.gigantes = Object.fromEntries(q.get("pegos").split(",").filter(Boolean).map((id) => [id, true]));
  }
  if (q.has("party")) {   // ?party=pidgey:8,pikachu:6 -> equipe extra pra teste
    addMons(game.state, q.get("party"));
  }
  // ?montaria=charizard,lugia&map=route1 -> eles na frente da equipe, sabendo
  // VOAR: é só abrir o menu e escolher VOAR LIVRE (as MONTARIAS VOADORAS)
  if (q.has("montaria")) {
    const ids = q.get("montaria").split(",").filter((id) => DB.SPECIES[id]);
    const novos = ids.map((id) => {
      const m = createMon(id, 50);
      // o LAPRAS (e o GYARADOS) também nadam: esses ganham SURFAR (o LAPRAS só ele)
      const golpes = id === "lapras" ? ["surfar"] : id === "gyarados" ? ["voar", "surfar"] : ["voar"];
      for (const g of golpes) if (!m.moves.some((v) => v.id === g)) m.moves[m.moves.length < 4 ? m.moves.length : 0] = { id: g, pp: 15, ppMax: 15 };
      game.state.seen[id] = game.state.caught[id] = true;
      return m;
    });
    game.state.party = [...novos, ...game.state.party].slice(0, 6);
  }
  // ?ligaetapa=2 -> a SALA DA LIGA já na etapa 2 (AGATHA); &ligatroca=1 -> a
  // sala se transforma pra próxima logo que o jogo abre (a cena da troca)
  // &surto=1 -> um SURTO EM MASSA começa logo, perto de você (src/systems/surtos.js)
  if (q.has("surto")) game.state.surtoDepois = 0;
  // ?ligabrag=2 -> a SALA DA LIGA DE BRAGLITCH na forma 2 (a RAINHA LUA);
  // &ligabragtroca=1 -> os braços robóticos trocam pra próxima assim que abre
  if (q.has("ligabrag")) {
    game.state.flags.ligaBragEtapa = +(q.get("ligabrag") || 0);
    if (q.has("ligabragtroca")) game.state.flags.ligaBragPendente = game.state.flags.ligaBragEtapa + 1;
    // &ligabraghall=1 -> o HALL DA FAMA DE BRAGLITCH (as garras) assim que abre
    if (q.has("ligabraghall")) { game.state.flags.bragCampeao = true; game.state.flags.hallBragPendente = true; }
  }
  if (q.has("ligaetapa") || q.has("ligatroca") || q.has("ligaentrada")) {
    game.state.flags.ligaEtapa = +(q.get("ligaetapa") || 0);
    if (q.has("ligatroca")) game.state.flags.ligaPendente = game.state.flags.ligaEtapa + 1;
    if (q.has("ligaentrada")) game.state.flags.ligaEntrada = true;   // &ligaentrada=1: a sala se monta
  }
  // ?hall=1 -> acabou de vencer o AZUL: no HALL DA FAMA, com o registro pra fazer
  if (q.has("hall")) { game.state.flags.kantoCampeao = true; game.state.flags.hallPendente = true; }
  // ?voando=charizard -> já começa VOANDO nele (a animação de voo das montarias)
  if (q.has("voando") && DB.SPECIES[q.get("voando")]) {
    game.state.voando = true;
    game.state.montaria = q.get("voando");
  }
  // ?cardume=magikarp -> a primeira coisa é a batalha contra o CARDUME (o
  // bicho gigante feito de mini cópias: src/systems/cardume.js). &lvl=30
  // ?pospos=1 -> o PÓS-PÓS-GAME começa na hora (a ligação do PROF. CARVALHO no
  // primeiro passo ao ar livre): conta como se o MISSINGNO já tivesse sido pego
  // (e o GIRATINA libertado, pra quem tem o DLC). &map=route20&x=85&y=16 já põe
  // você do lado da ILHA DA RUÍNA
  if (q.has("pospos")) {
    game.state.flags.caughtMissingno = true;
    game.state.flags.gdeLivre = true;
    // ?pospos=fim&map=route20&x=85&y=12 -> a briga já vencida: começa a ONDA e o BARCO
    if (q.get("pospos") === "fim") {
      game.state.flags.ppComecou = true;
      delete game.state.flags.ppAcabou;
      (game.state.npcState["route20.pp_briga"] ||= {}).defeated = true;
    }
  }
  // ?portal=1&map=sao_lucario&x=25&y=21 -> o PORTAL PARADOXO aberto (o pós-pós-game
  // vencido) e a mochila com os itens de todas as receitas
  if (q.has("portal")) {
    game.state.flags.ppComecou = game.state.flags.ppAcabou = true;
    for (const [it, n] of [["pedra do fogo", 2], ["pedra da água", 2], ["poké bola", 5], ["great ball", 2],
                           ["ultra ball", 2], ["master ball", 1], ["cheri berry", 4], ["oran berry", 4],
                           ["fóssil domo", 2], ["pepita", 2], ["doce raro", 3]]) {
      game.state.items[it] = Math.max(game.state.items[it] || 0, n);
    }
  }
  // ?missao=blacephalon-contra-deus -> essa side quest já aceita (pra testar o que ela destrava)
  if (q.has("fichas")) game.state.fichas = +q.get("fichas") || 0;
  if (q.has("canhaomax")) game.state.items["pulseira dynamax"] = 1;
  if (q.has("cogumelos")) game.state.items["cogumelo max"] = +q.get("cogumelos") || 0;
  // &reencontro=1 -> já com o RATICATE do AZUL revivido na equipe (é só falar com ele)
  if (q.has("reencontro") && !game.state.party.some((m) => m.doRival)) {
    (game.state.flags ||= {}).raticateRival = 2;
    game.state.party.push(Object.assign(createMon("raticate", 20), { doRival: true }));
  }
  // &fotos=1 -> a CÂMERA do ROTOMFONE com 3 fotos de exemplo (BROCK, o AZUL com o RATICATE, o VÍTOR)
  // &fotos=lideres -> uma foto com CADA líder de ginásio (Kanto e Braglitch), no ginásio dele
  if (q.get("fotos") === "lideres") {
    const d = Date.now(), eu = game.state.player?.genero === "menina" ? "heroina" : "hero";
    const lideres = [];
    for (const [mapa, m] of Object.entries(DB.MAPS)) for (const n of m.npcs || []) {
      const tr = n.trainer;
      if (!tr?.badge && !tr?.bragBadge) continue;
      const s = tr.sprite || n.sprite;
      lideres.push({ retrato: s, ator: s, nome: String(tr.name).replace(/^LÍDER /, ""), eu, mapa, x: n.x, y: n.y + 1,
                     lugar: m.name, data: d, ordem: (tr.bragBadge ? 1e6 : 0) + (tr.prize || 0) });
    }
    // e depois deles, a ELITE 4 e o CAMPEÃO (src/data/liga-kanto.js), na ordem da liga
    const liga = LIGA_ETAPAS.map((e, i) => {
      const tr = e.npc?.trainer, s = tr?.sprite || e.npc?.sprite;
      // o CAMPEÃO é a foto especial: você no lugar dele, ele indo embora com o time
      if (tr && tr.ligaKanto && /^CAMPE/.test(tr.name)) return { tipo: "campeao", retrato: "rival", nome: "AZUL", eu,
        time: ["pidgeot", "gyarados", "rhydon", "articuno"], mapa: e.chao?.de, x: 6, y: 5, lugar: "LIGA POKÉMON", data: d, ordem: 2e6 + i };
      return tr && { retrato: s, ator: s, nome: String(tr.name).replace(/^(ELITE 4|CAMPEÃO|CAMPEÃ) /, ""), eu,
                     mapa: e.chao?.de || "pokemon_league_loreleis_room", x: 6, y: 6, lugar: "LIGA POKÉMON", data: d, ordem: 2e6 + i };
    }).filter(Boolean);
    game.state.fotos = [...lideres, ...liga].sort((a, b) => a.ordem - b.ordem).map(({ ordem, ...f }) => f);
  }
  if (q.has("fotos") && !(game.state.fotos || []).length) {
    const d = Date.now(), eu = game.state.player?.genero === "menina" ? "heroina" : "hero";
    game.state.fotos = [
      { retrato: "brock", nome: "BROCK", eu, mapa: "pewter_city_gym", x: 6, y: 7, lugar: "GINÁSIO DE PEWTER", data: d },
      { retrato: "rival", nome: "AZUL", mon: "raticate", eu, mapa: "pokemon_tower_2f", x: 15, y: 9, lugar: "TORRE POKÉMON", data: d },
      { retrato: "vitor", nome: "VÍTOR", eu, mapa: "route1", x: 10, y: 10, lugar: "ROTA 1", data: d },
      { retrato: "lance", nome: "LANCE", eu, mapa: "pokemon_league_lances_room", x: 6, y: 6, lugar: "SALA DO LANCE", data: d },
      { mon: "mewtwo", nome: "MEWTWO", eu, mapa: "cerulean_cave_b1f", x: 10, y: 10, lugar: "CAVERNA CELESTE", data: d },
      { retrato: "garoto", ator: "garoto", nome: "GAROTO", eu, mapa: "pallet_town", x: 10, y: 10, lugar: "PALLET", data: d },
      { mon: "pikachu", nome: "PIKACHU", eu, mapa: "viridian_forest", x: 20, y: 30, lugar: "FLORESTA DE VIRIDIAN", data: d },
      { retrato: "garoto", nome: "TOMÁS", mon: "zerogle", eu, mapa: "pokemon_tower_2f", x: 13, y: 16, lugar: "TORRE POKÉMON", data: d },
    ];
  }
  if (q.has("almas")) { game.state.almas ||= {}; game.state.almas.pikachu = Math.max(game.state.almas.pikachu || 0, 95); game.state.almas.raticate = Math.max(game.state.almas.raticate || 0, 95); }
  if (q.has("metas")) game.state.metas ||= [{ k: "tipo", tipo: "FOGO", n: 3 }, { k: "derrotar", alvo: 2, n: 1 }, { k: "nivel", alvo: 21, n: 0 }];
  if (q.has("segurar")) for (const it of Object.keys(DB.SEGURAVEIS || {})) game.state.items[it] = Math.max(game.state.items[it] || 0, 1);
  if (q.has("doces")) for (const d of DB.DOCES || []) game.state.items[d.item] = Math.max(game.state.items[d.item] || 0, 2);
  if (q.has("subterraneo")) {
    game.state.items.picareta = 1;
    for (const it of ["estátua de pikachu", "estátua de eevee", "estátua de dratini", DB.KIT_BASE]) game.state.items[it] = Math.max(game.state.items[it] || 0, 1);
  }
  if (q.has("bebbidah")) {
    for (const b of DB.BEBIDAS || []) game.state.items[b.item] = Math.max(game.state.items[b.item] || 0, 3);
    if (game.state.party[0]?.species === "bebbidah") game.state.party[0].item = "hortelã";
  }
  if (q.has("verbase")) {
    const reg = q.get("verbase") || "kanto";
    const st = game.state;
    st.bases ||= {};
    st.bases[reg] ||= { mapa: st.player.map, x: 1, y: 1, mons: [{ species: "pikachu", seed: 1 }, { species: "eevee", seed: 2 }],
      moveis: [{ item: "tapete vermelho", x: 6, y: 4 }, { item: "mesa", x: 6, y: 4 }, { item: "planta", x: 3, y: 2 },
               { item: "cama", x: 12, y: 2 }, { item: "pôster de pikachu", x: 5, y: 1 }, { item: "boneco de snorlax", x: 9, y: 6 }, { item: "boneco de jigglypuff", x: 4, y: 6 }, { item: "robô froakie", x: 2, y: 7, caminho: [[2, 7], [5, 8], [10, 8], [12, 6], [8, 3], [1, 3]] }] };
    for (const it of Object.keys(DB.MOVEIS || {})) st.items[it] = Math.max(st.items[it] || 0, 2);
    import("./scenes/base.js").then(({ BaseScene }) => setTimeout(() => game.scenes.push(new BaseScene(), { base: st.bases[reg], regiao: reg, dono: st.player.name || "VOCÊ" }), 400));
  }
  if (q.has("bases")) {
    game.state.money = Math.max(game.state.money || 0, 20000);
    for (const it of Object.keys(DB.MOVEIS || {})) game.state.items[it] = Math.max(game.state.items[it] || 0, 2);
  }
  if (q.has("miniors")) game.state.items["ultra ball"] = Math.max(game.state.items["ultra ball"] || 0, 20);
  if (q.has("cores")) game.state.items["poké bola"] = Math.max(game.state.items["poké bola"] || 0, 15);
  if (q.has("missao")) {
    for (const id of q.get("missao").split(",")) (game.state.missoes ||= {})[id] = { estado: "ativa", desde: 0 };
  }
  if (q.has("cardume")) {
    const id = DB.SPECIES[q.get("cardume")] ? q.get("cardume") : "magikarp";
    const sp = garantirCardume(id);
    if (sp) {
      const foe = createMon(idCardume(id), +q.get("lvl") || 30);
      foe.shiny = false;
      setTimeout(() => game.scenes.push(new BattleScene(), { foe, cardume: true }), 300);
    }
  }
  if (q.has("horda")) {  // ?horda=rattata&map=route1 -> a primeira coisa é uma HORDA dessa espécie (&qtd=3..5)
    const id = DB.SPECIES[q.get("horda")] ? q.get("horda") : "rattata";
    const lvl = +q.get("lvl") || 8;
    const qtd = Math.max(3, Math.min(5, +q.get("qtd") || 5));   // &qtd=3..5
    const foes = Array.from({ length: qtd }, (_, i) => createMon(id, Math.max(2, lvl - (i ? 2 : 0))));
    setTimeout(() => game.scenes.push(new HordaScene(), {
      foes, aoFim: () => game.scenes.push(new GrupoBattleScene(), { foes, horda: true }),
    }), 300);
  }
  // ?tirinha=1 -> abre o caderno do VÍTOR na tirinha N (src/data/amigos.js); ao
  // fechar uma, vem a próxima, até a última
  if (q.has("tirinha") && DB.TIRINHAS) {
    const L = DB.TIRINHAS.lista;
    const abrir = (n) => n < L.length && game.scenes.push(new TirinhaScene(), {
      tirinha: L[n], numero: n + 1, onDone: () => abrir(n + 1) });
    setTimeout(() => abrir(Math.max(0, Math.min(L.length - 1, (+q.get("tirinha") || 1) - 1))), 300);
  }
  // ?estilo=real|explosiva|turno -> o estilo de batalha do OPÇÕES já escolhido
  if (q.has("estilo")) {
    game.state.flags.batalhaReal = q.get("estilo") === "real";
    game.state.flags.batalhaExplosiva = q.get("estilo") === "explosiva";
  }
  // ?dupla=clefairy:14,jigglypuff:14 -> a primeira coisa é uma BATALHA DUPLA contra
  // esse time (3+ bichos e &trio=1 vira trio). Junto com &estilo= dá a arena em grupo
  if (q.has("dupla")) {
    const party = q.get("dupla").split(",").map((x) => x.trim().split(":"))
      .filter(([id]) => DB.SPECIES[id]).map(([id, l]) => ({ id, lvl: +l || 10 }));
    if (party.length < 2) party.push({ id: "rattata", lvl: 10 }, { id: "pidgey", lvl: 10 });
    setTimeout(() => game.scenes.push(new GrupoBattleScene(), {
      tamanho: q.has("trio") ? 3 : 2,
      trainer: { name: "DUPLA DE TESTE", sprite: "garoto", party, prize: 100, dupla: true },
    }), 300);
  }
  // ?hordas=1&map=route1 -> todo selvagem comum nasce com HORDA (e as silhuetas em cima)
  if (q.has("hordas") && DB.CONFIG) DB.CONFIG.hordaOdds = 1;
  if (q.has("flags")) {    // ?flags=bragCampeao,caughtMissingno -> marcas da história ligadas
    for (const f of q.get("flags").split(",")) if (f.trim()) game.state.flags[f.trim()] = true;
  }
  if (q.has("billcaso")) {  // ?billcaso=1 -> o BILL já virado no caso N (src/data/bill-casos.js; 0 = RALTS, 1 = WAILORD no cano)
    const n = +q.get("billcaso") || 0, f = game.state.flags;
    Object.assign(f, { billPediu: true, billSeparado: true, billPresente: true, billCasos: n, billCasoAtivo: true, billProximo: false, [`billCaso${n}`]: true });
  }
  if (q.has("mochila")) {  // ?mochila=guarda-roupa único:1,poção:5 -> itens na mochila pra teste
    for (const par of q.get("mochila").split(",")) {
      const [item, n] = par.split(":");
      if (item?.trim()) game.state.items[item.trim()] = Math.max(1, +n || 1);
    }
  }
  if (q.has("amizade")) {  // ?amizade=300 -> a equipe inteira com essa amizade (o FENÔMENO DE VÍNCULO pede 300)
    for (const m of game.state.party) m.amizade = Math.max(0, +q.get("amizade") || 0);
  }
  if (q.has("golpes")) {  // ?golpes=chicotedevinha,folhanavalha -> a equipe inteira só com esses
    const ids = q.get("golpes").split(",").map((g) => g.trim()).filter((g) => DB.MOVES[g]).slice(0, 4);
    if (ids.length) for (const m of game.state.party) m.moves = ids.map((id) => ({ id, pp: DB.MOVES[id].pp, ppMax: DB.MOVES[id].pp }));
  }
  if (q.get("dim")) {   // ?dim=3 -> já dentro da dimensão, missão 3
    game.state.mission = { n: +q.get("dim") || 1, back: { map: "lab", x: 6, y: 11, dir: "up" } };
    Object.assign(game.state.player, {
      map: "glitchdim",
      x: q.has("x") ? +q.get("x") : 22,
      y: q.has("y") ? +q.get("y") : 29,
      dir: q.get("dir") || "up",
    });
    Glitch.forced = true;
  }
  if (q.get("missionready")) game.state.flags.missionReady = true;
  if (q.get("dimunlocked")) game.state.flags.dimUnlocked = true;
  if (q.get("pokedex")) game.state.flags.pokedexMsg = true;
  // ?insignias=5 -> as 5 primeiras insígnias de Braglitch (o símbolo no peito montado até ali);
  // &void=1 -> e as duas do VOID na perna
  if (q.has("insignias")) {
    game.state.bragBadges = (DB.INSIGNIAS_BRAG || []).slice(0, Math.max(0, Math.min(8, +q.get("insignias") || 0))).map((b) => b.id);
    // e a história já andou: o inicial escolhido, a missão da IPÊ e o MISSINGNO vencido
    Object.assign(game.state.flags, { starterChosen: true, pokedex: true, bragMissao: true, bragGlitch: true, bragMissingnoVencido: true,
                                      bragIlhas: true, bragIlhasFim: true });
    game.state.bragBadges.push(...(DB.ILHAS_BRAG || []).map((i) => `ilha_${i.id}`));      // as 8 ilhas entregues
    if (q.has("void")) { game.state.flags.insignia_void = true; game.state.flags.campeaoVoid = true; }
    // &encaixe=1 -> a cena do ENCAIXE da última dessas (src/scenes/encaixe.js)
    if (q.has("encaixe") && game.state.bragBadges.length) game.state.flags.encaixePendente = game.state.bragBadges[game.state.bragBadges.length - 1];
  }
  // ?ligavoid=N -> a LIGA DO VOID aberta, na vez do N (0-4); ?ligavoidtroca=1 já derrete
  if (q.has("ligavoid")) {
    game.state.flags.insignia_void = true;
    game.state.flags.ligaVoidEtapa = Math.max(0, Math.min(4, +q.get("ligavoid") || 0));
    if (q.has("ligavoidtroca")) game.state.flags.ligaVoidPendente = game.state.flags.ligaVoidEtapa + 1;
  }
  // ?fabrica=1 -> a FÁBRICA DE POKÉBOLAS com os Rockets (campeão de Kanto); ?fabrica=2 -> já depois (Rocket desfeita, dinheiro pra fabricar)
  if (q.has("fabrica")) {
    game.state.flags.kantoCampeao = true;
    // só um BLASTOISE nível 100 (e não o CHARMANDER nível 5 do teste)
    const p = game.state.party || (game.state.party = []);
    if (!p.some((m) => (m.level || 0) >= 50)) {
      game.state.party = [createMon("blastoise", 100)];
      game.state.starterChosen = game.state.starterChosen || "squirtle";
    }
    if (q.get("fabrica") === "2") { game.state.flags.rocketDesfeita = true; game.state.money = Math.max(game.state.money || 0, 500000); }
  }
  // ?mts=1 -> todas as MTs e MOs na mochila (e a MT RAIO ETERNO), pra testar
  if (q.get("mts")) {
    for (const it of nomesDasMaquinas()) game.state.items[it] = Math.max(1, game.state.items[it] || 0);
  }
  // ?pesquisa=1 -> as MISSÕES DA POKÉDEX: PIKACHU completo, CHARMANDER pela metade
  if (q.get("pesquisa")) {
    const st = game.state;
    st.flags.pokedex = true;
    for (const id of ["pikachu", "charmander", "bulbasaur", "squirtle"]) st.seen[id] = st.caught[id] = true;
    import("./systems/pesquisa.js").then(({ tarefas }) => {
      st.pesquisa ||= {};
      st.pesquisa.pikachu = Object.fromEntries(tarefas("pikachu").map((t) => [t.k, t.alvo]));
      st.pesquisa.charmander = Object.fromEntries(tarefas("charmander").map((t, i) => [t.k, i % 2 ? 0 : Math.ceil(t.alvo / 2)]));
    });
  }
  if (q.get("visor")) game.state.items[DB.STORY.detector.item] = 1;
  if (q.get("rasgo")) {   // ?rasgo=1 -> um rasgo já aberto do seu lado, pra testar a raid
    game.state.flags.dimUnlocked = true;
    game.state.corruption = Math.max(game.state.corruption, 60);
    Glitch.forced = true;
    const g = DB.KANTO[game.state.player.map];
    const chao = (x, y) => !!g && x >= 0 && y >= 0 && x < g.w && y < g.h
      && g.tags.charCodeAt(y * g.w + x) - 48 === DB.TAG.FREE;
    if (!abrirPortal(game.state, game.state.player.map, chao)) {
      console.warn("[rasgo] nenhum chão livre perto daqui; ande um pouco e tente de novo");
    }
  }
  if (q.get("zona")) {   // ?map=pallet&zona=1 -> já dentro de uma GLITCH ZONE; ?zona=lavender_town escolhe a entrada
    game.state.flags.dimUnlocked = true;
    Glitch.forced = true;
    const entradas = DB.GLITCH_ZONES?.entradas || [];
    const entrada = entradas.find((e) => e.mapa === q.get("zona")) || entradas[0];
    const z = entrada && abrirZona(game.state, entrada);
    if (z) Object.assign(game.state.player, { map: ZONA, x: z.x, y: z.y, dir: "down" });
    else console.warn("[zona] não deu pra abrir uma zona (sem entradas ou sem mapas de fonte)");
  }
  // ?fundidos=pikachu+charizard,gyarados+machamp -> essas fusões já na equipe (com os dois dentro, pra separar)
  if (q.get("fundidos")) {
    import("./systems/fusao.js").then(({ fundir }) => {
      for (const par of q.get("fundidos").split(",")) {
        const [a, b] = par.split(/[+ ]/);
        if (!DB.SPECIES[a] || !DB.SPECIES[b]) continue;
        const f = fundir(createMon(a, 30), createMon(b, 30));
        if (f) { (game.state.party.length < 6 ? game.state.party : game.state.box).push(f); game.state.seen[f.species] = game.state.caught[f.species] = true; }
      }
    });
  }
  if (q.get("modofusao")) game.state.flags.modoFusao = q.get("modofusao") !== "0";   // ?modofusao=1 -> MODO FUSÃO ligado
  if (q.get("tempo")) {   // ?tempo=chuva|temporal|tornado|sol|nublado|neblina|limpo -> esse tempo por 30 min
    import("./systems/tempo.js").then((m) => m.porTempo(game.state, q.get("tempo")));
  }
  if (q.get("mega")) {   // ?mega=1 -> anel + todas as megapedras na mochila
    game.state.items[DB.MEGA_ANEL] = 1;
    for (const pedra of Object.keys(DB.MEGA_PEDRAS || {})) game.state.items[pedra] = 1;
    game.state.flags.anelMega = true;
  }
  if (q.get("megacom")) {   // ?megacom=aerodactylita -> anel + SÓ essa pedra (a MEGA EMPRESTADA)
    game.state.items[DB.MEGA_ANEL] = 1;
    for (const pedra of q.get("megacom").split(",")) if (DB.MEGA_PEDRAS?.[pedra.trim()]) game.state.items[pedra.trim()] = 1;
    game.state.flags.anelMega = true;
  }
  if (q.get("ovos")) {   // ?ovos=N -> N MYSTERY EGGS de cada tipo na mochila
    for (const ovo of Object.keys(DB.OVOS?.tipos || {})) game.state.items[ovo] = +q.get("ovos") || 1;
  }
  if (q.get("fusao")) {   // ?fusao=1 -> a máquina do professor já na mochila
    game.state.items[DB.FUSAO.item] = 1;
    game.state.flags.decodificador = true;
  }
  // as seis lendas de BRAGLITCH já pegas: parado num mapa de lá, o MISSINGNO
  // chega (src/systems/regionais.js, `seisLendasPegas`)
  if (q.get("lendasbrag")) for (const l of DB.LENDAS_BRAG || []) game.state.caught[l.id] = game.state.seen[l.id] = true;
  // AS TRÊS ERAS (pós-jogo). ?eras=1 põe o CELEBI na clareira da FLORESTA
  // VIRIDIAN (é como se MISSINGNO. já tivesse sido capturado); ?era=paradoxo
  // joga direto dentro daquela era, já com o caminho de volta guardado.
  if (q.get("eras") || q.has("era")) game.state.flags.caughtMissingno = true;
  if (q.has("era")) {
    const era = (DB.ERAS || []).find((e) => e.id === q.get("era") || e.mapa === q.get("era"));
    if (!era) console.warn("[eras] era desconhecida:", q.get("era"));
    else {
      const C = DB.CELEBI;
      game.state.tempo = { map: C.mapa, x: C.x, y: C.y + 1, dir: "up", era: era.id };
      Object.assign(game.state.player, {
        map: era.mapa,
        x: q.has("x") ? +q.get("x") : era.geo.entrada.x,
        y: q.has("y") ? +q.get("y") : era.geo.entrada.y,
        dir: q.get("dir") || "up",
      });
    }
  }
  if (q.get("frag")) {   // ?frag=1 -> fragmento colado no jogador, pra testar
    const p2 = game.state.player;
    game.state.flags.dimUnlocked = true;
    game.state.fragment = { map: p2.map, x: p2.x, y: p2.y + 1 };
  }
  const cena = game.scenes.replace(new OverworldScene());
  if (ASH_TESTE) {
    // o lugar do ASH é achado pelo próprio mapa; o jogador vai pro primeiro
    // chão livre colado nele (embaixo, dos lados, em cima) e olha pra ele
    const ash = cena.ashNpc?.();
    const p = game.state.player;
    if (ash) {
      for (const [dx, dy, dir] of [[0, 1, "up"], [-1, 0, "right"], [1, 0, "left"], [0, -1, "down"]]) {
        const x = ash.x + dx, y = ash.y + dy;
        if (cena.blocked(x, y)) continue;
        Object.assign(p, { x, y, dir });
        break;
      }
      cena.snapCamera?.();
    }
  }
  // &meu=blastoise&meunv=99 SEM batalha: o primeiro do time vira esse (antes só valia junto com ?battle=)
  if (!q.has("battle") && q.has("meu") && DB.SPECIES[q.get("meu")] && game.state.party) {
    const nv = Math.max(1, Math.min(100, +(q.get("meunv") || 50)));
    if (game.state.party.length) game.state.party[0] = createMon(q.get("meu"), nv); else game.state.party.push(createMon(q.get("meu"), nv));
    // e o ?golpes= vale pra ele também (antes o novo nascia com os golpes de sempre)
    const ids = (q.get("meugolpes") || q.get("golpes") || "").split(",").map((g) => g.trim()).filter((g) => DB.MOVES[g]).slice(0, 4);
    if (ids.length) game.state.party[0].moves = ids.map((id) => ({ id, pp: DB.MOVES[id].pp, ppMax: DB.MOVES[id].pp }));
  }
  if (q.has("battle")) {
    // &shiny=1 -> o selvagem vem SHINY (o brilho de quando ele aparece)
    // &spinda=branco|vermelho -> o SPINDA raro (DB.CONFIG.spindaRaros)
    // espécie que não existe no jogo (ex.: CRAMORANT, que só está desenhado no
    // CANHÃO DE RAIOS) quebrava tudo no createMon: avisa e luta com um RATTATA
    { const id = q.get("battle").trim().toLowerCase();
      if (!DB.SPECIES[id]) { console.warn("[battle] espécie desconhecida:", id, "— usando rattata"); q.set("battle", "rattata"); } else q.set("battle", id); }
    const raro = DB.CONFIG?.spindaRaros?.[q.get("spinda")];
    const foe = createMon(q.get("battle"), +(q.get("lvl") || 5), { shiny: q.has("shiny"), luminoso: q.has("luminoso"), alfa: q.has("alfa"), ...(raro ? { seed: raro.seed } : {}) });   // &alfa=1: alfa (olho vermelho)
    if (foe.alfa) { const g = golpeDeAlfa(foe); if (g) foe.moves[Math.min(3, foe.moves.length)] = { id: g, pp: DB.MOVES[g].pp, ppMax: DB.MOVES[g].pp }; }   // o GOLPE FORTE do alfa
    if (q.has("foegolpes")) {   // &foegolpes=ondadechoque -> o selvagem só com esses golpes
      const ids = q.get("foegolpes").split(",").map((g) => g.trim()).filter((g) => DB.MOVES[g]).slice(0, 4);
      if (ids.length) foe.moves = ids.map((id) => ({ id, pp: DB.MOVES[id].pp, ppMax: DB.MOVES[id].pp }));
    }
    // &meu=fus-mimikyu-pikachu -> uma FUSÃO (cabeça-corpo) como o seu: a espécie dela é montada na hora
    if (q.get("meu")?.startsWith("fus-")) garantirEspecie(q.get("meu"));
    // &meu=lucario&meunv=50 -> o primeiro da SUA equipe vira esse (no nível pedido; sem nível, o do selvagem)
    if (q.has("meu") && DB.SPECIES[q.get("meu")] && game.state.party) {
      const nv = +(q.get("meunv") || q.get("lvl") || 5);
      game.state.party[0] = createMon(q.get("meu"), Math.max(1, Math.min(100, nv)));
      // &meugolpes=explosao,investida -> ele já com esses golpes
      const ids = (q.get("meugolpes") || "").split(",").filter((g) => DB.MOVES[g]).slice(0, 4);
      if (ids.length) game.state.party[0].moves = ids.map((id) => ({ id, pp: DB.MOVES[id].pp, ppMax: DB.MOVES[id].pp }));
    } else if (q.has("meunv") && game.state.party?.[0]) {
      const m = game.state.party[0], nv = Math.max(1, Math.min(100, +q.get("meunv")));
      game.state.party[0] = createMon(m.species, nv, { shiny: m.shiny, luminoso: m.luminoso, nickname: m.nickname });
    }
    // &meuluminoso=1 -> o primeiro da SUA equipe vira LUMINOSO (e aprende o CLARÃO ILUMINADO)
    const meu = game.state.party?.[0];
    if (q.has("meuluminoso") && meu) { meu.luminoso = true; meu.shiny = false; darClarao(meu); }
    // &meualfa=1 -> o primeiro da SUA equipe vira ALFA (olho vermelho, grito mais grosso)
    if (q.has("meualfa") && meu) meu.alfa = true;
    // &dynamax=1 -> ganha a PULSEIRA DYNAMAX e a luta vale como de ginásio (V arma; o selvagem dynamaxa também)
    if (q.has("dynamax") || q.has("gigantamax")) game.state.items["pulseira dynamax"] = 1;
    // &gigantamax=1 -> os DOIS com a SOPA MAX tomada: quando dynamaxam, viram GIGANTAMAX
    // (src/data/gigantamax.js). Ex.: ?battle=snorlax&lvl=50&starter=pikachu:100&gigantamax=1
    if (q.has("gigantamax")) { foe.gmax = true; if (game.state.party[0]) game.state.party[0].gmax = true; }
    const bs = game.scenes.push(new BattleScene(), { foe, glitch: q.get("battle").startsWith("missingno"), dyTeste: q.has("dynamax") || q.has("gigantamax") });
    bs.fadeA = 0; bs.fadeDir = 0;
  }
  if (q.get("debug")) game.debug = true;
}

// ?evolucao=charmander:charmeleon&perfil=teste -> abre direto a tela de evolução
// (jogo novo, o primeiro vira o inicial). &estranho=1 -> a versão da pedra da fenda.
// ?trabalhos=1 -> abre direto os POKÉTRABALHOS (src/scenes/trabalhos.js), com 4
// Pokémon no BOX e um trabalho de hoje já PRONTO pra buscar
if (q.has("trabalhos")) Promise.all([import("./scenes/trabalhos.js"), import("./systems/trabalhos.js"), import("./systems/box.js"), import("./systems/mon.js")])
  .then(([{ TrabalhosScene }, J, B, M]) => {
    const st = game.state;
    if (!J.doBox(st).length) for (const s of ["squirtle", "bulbasaur", "pikachu", "gastly", "geodude"]) B.guardar(st, M.createMon(s, 15));
    const job = J.trabalhosDoDia()[0];
    if (!Object.keys(J.emAndamento(st)).length) J.mandar(st, job.id, J.doBox(st).slice(0, 2), 30, Date.now() - 31 * 60000);
    game.scenes.push(new TrabalhosScene(), {});
  });
// ?fps=2000 -> o FPS das OPÇÕES (src/core/opcoes.js)
if (q.get("fps")) Opcoes.set("fps", +q.get("fps"));
// ?pokedex=1 -> abre direto a POKÉDEX (a que fala, com o desenho do CAIO no canto)
// &dextudo=kanto -> (só com &perfil=, pra teste) marca os 151 de KANTO como vistos e pegos
if (q.get("dextudo") === "kanto" && q.has("perfil")) {
  for (const sp of Object.values(DB.SPECIES)) if (sp.dex >= 1 && sp.dex <= 151 && !sp.fusao) game.state.seen[sp.id] = game.state.caught[sp.id] = true;
}
// &dextudo=emprestadas -> (só com &perfil=) as 6 MEGAS EMPRESTADAS vistas e pegas, e abre na aba FORMAS
const dexArgs = {};
if (q.get("dextudo") === "emprestadas" && q.has("perfil")) {
  const ids = Object.entries(DB.MEGAS_EMPRESTADAS || {}).flatMap(([p, quem]) => quem.map((s) => `fus-${s}-${DB.MEGA_PEDRAS[p]}`));
  for (const id of ids) if (garantirEspecie(id)) game.state.seen[id] = game.state.caught[id] = true;
  dexArgs.aba = "FORMAS";
  dexArgs.especie = ids[0];
}
if (q.has("pokedex")) import("./scenes/pokedex.js").then((m) => { const C = Object.values(m).find((v) => typeof v === "function" && /Pokedex/i.test(v.name)); if (C) game.scenes.push(new C(), dexArgs); });
// ?kart=1 -> abre o SUPER PAWMOT KART (o 3º jogo do Switch, src/scenes/kart.js)
if (q.has("kart")) import("./scenes/kart.js").then(({ KartScene }) => game.scenes.push(new KartScene(), {}));
// ?celeba=1 -> abre o THE LEGENDS OF CELEBI (o 2º jogo do Switch, src/scenes/celeba.js)
if (q.has("celeba")) import("./scenes/celeba.js").then(({ CelebaScene }) => game.scenes.push(new CelebaScene(), {}));
if (q.has("superpawmot")) import("./scenes/superpawmot.js").then(({ SuperPawmotScene }) => game.scenes.push(new SuperPawmotScene(), {}));
// &camera=1 -> abre direto o álbum da CÂMERA do ROTOMFONE (src/scenes/fotos.js)
// &camerareal=1 -> abre direto a FOTO DE VERDADE (webcam em pixel art + Pokémon, src/scenes/camerareal.js)
if (q.has("camerareal")) import("./scenes/camerareal.js").then(({ CameraRealScene }) => game.scenes.push(new CameraRealScene(), {}));
if (q.has("camera")) import("./scenes/fotos.js").then(({ FotosScene }) => game.scenes.push(new FotosScene(), q.get("fotos") === "lideres" ? { inicio: 0 } : {}));
if (q.has("evolucao")) {
  const [de, para] = (q.get("evolucao") || "").split(":");
  const sid = DB.SPECIES[de] ? de : "charmander";
  const to = DB.SPECIES[para] ? para : DB.EVOLUTIONS?.[sid]?.[0]?.to;
  if (!(game.scenes.top instanceof OverworldScene)) {
    game.newGame();
    game.giveStarter(sid);
    game.scenes.replace(new OverworldScene());
  }
  // UM BICHO NOVO da espécie pedida, e não o primeiro da equipe: recarregando
  // a página, o jogo restaura a partida do perfil, e o primeiro da equipe já é
  // a forma evoluída — a cena mostrava "PARASECTROM EVOLUIU PARA PARASECTROM"
  // Mas se ele ainda está na equipe, é ELE quem evolui: senão a forma nova
  // nunca entra no time (e o GHOTOLT do VOLTURG chegava sozinho)
  const mon = game.state.party.find((m) => m.species === sid) || createMon(sid, 30);
  // as formas do ZYGARDE trocam pelo CUBO: a cena é a de mudar de forma
  const cubo = DB.CUBO_ZYGARDE;
  const forma = cubo?.aceita.includes(sid) && cubo.aceita.includes(to) ? cubo.cena : null;
  // &quadros=0-76 -> ele só faz esse pedaço da animação (o SIX SEVEN do
  // BLACEPHALON: ?evolucao=blacephalon:blacephalon&quadros=0-76)
  if (q.has("quadros")) {
    const [ini, fim] = q.get("quadros").split("-").map(Number);
    if (fim >= ini) mon.soQuadros = [ini, fim];
  }
  if (to) game.scenes.push(new EvolutionScene(), { mon, to, estranho: q.has("estranho"), forma });
}

// ?megacena=charizard:megacharizardx&perfil=teste -> abre direto a cutscene da
// MEGA EVOLUÇÃO (src/scenes/mega.js), a mesma da batalha, com a frase no fim
if (q.has("megacena")) {
  const [de, para] = (q.get("megacena") || "").split(":");
  if (para?.startsWith("fus-")) garantirEspecie(para);   // a MEGA EMPRESTADA é uma fusão: nasce aqui
  const sid = DB.SPECIES[de] ? de : "charizard";
  const to = DB.SPECIES[para] ? para : DB.MEGAS?.[sid]?.[0]?.to;
  if (!(game.scenes.top instanceof OverworldScene)) {
    game.newGame();
    game.giveStarter(sid);
    game.scenes.replace(new OverworldScene());
  }
  // um bicho novo da espécie pedida (o primeiro da equipe pode ser outro, ver ?evolucao=)
  if (to) game.scenes.push(new MegaScene(), { mon: createMon(sid, 30), to, sozinha: true });
}

// ?hordacena=rattata:5&perfil=teste -> só a cutscene da HORDA (src/scenes/horda.js),
// com a frase no fim; o número é o tamanho (3 a 5)
if (q.has("hordacena")) {
  const [id, n] = (q.get("hordacena") || "").split(":");
  const sp = DB.SPECIES[id] ? id : "rattata";
  const qtd = Math.max(3, Math.min(5, +n || 5));
  if (!(game.scenes.top instanceof OverworldScene)) {
    game.newGame();
    game.giveStarter("charmander");
    game.scenes.replace(new OverworldScene());
  }
  const foes = Array.from({ length: qtd }, () => createMon(sp, 8));
  game.scenes.push(new HordaScene(), { foes, sozinha: true });
}

// ?soltarcena=pikachu&perfil=teste -> só a cutscene de SOLTAR (src/scenes/soltar.js)
if (q.has("soltarcena")) {
  const id = DB.SPECIES[q.get("soltarcena")] ? q.get("soltarcena") : "pikachu";
  if (!(game.scenes.top instanceof OverworldScene)) {
    game.newGame();
    game.giveStarter("charmander");
    game.scenes.replace(new OverworldScene());
  }
  game.scenes.push(new SoltarScene(), { mon: createMon(id, 20) });
}

// ?nascercena=pikachu&perfil=teste -> só a cutscene do OVO CHOCANDO
// (src/scenes/nascer.js): o ovo explode em pixels e eles montam o bicho
if (q.has("nascercena")) {
  const id = DB.SPECIES[q.get("nascercena")] ? q.get("nascercena") : "pichu";
  if (!(game.scenes.top instanceof OverworldScene)) {
    game.newGame();
    game.giveStarter("charmander");
    game.scenes.replace(new OverworldScene());
  }
  const mon = createMon(id, 5);
  game.scenes.push(new NascerScene(), { mon, frase: `O OVO RACHOU... NASCEU ${mon.nickname}!` });
}

// ?vestircena=pikachu&perfil=teste -> só a cutscene do GUARDA-ROUPA ÚNICO
// (src/scenes/vestir.js), vestindo a primeira forma única da espécie
if (q.has("vestircena")) {
  const base = DB.SPECIES[q.get("vestircena")] ? q.get("vestircena") : "pikachu";
  const para = DB.UNICAS_DE?.[base]?.[0] || base;
  if (!(game.scenes.top instanceof OverworldScene)) {
    game.newGame();
    game.giveStarter("charmander");
    game.scenes.replace(new OverworldScene());
  }
  game.scenes.push(new VestirScene(), {
    mon: createMon(base, 20), de: base, para, frase: `${DB.SPECIES[base].name} VESTIU ${DB.SPECIES[para].name}!`,
  });
}

// ?troca=charmander:pikachu&perfil=teste -> só o filme da TROCA COM NPC
// (src/scenes/trocanpc.js): o primeiro é o seu, que vai; o segundo o que vem
if (q.has("troca")) {
  const [a, b] = (q.get("troca") || "").split(":");
  const meuId = DB.SPECIES[a] ? a : "charmander", novoId = DB.SPECIES[b] ? b : "pikachu";
  if (!(game.scenes.top instanceof OverworldScene)) {
    game.newGame();
    game.giveStarter(meuId);
    game.scenes.replace(new OverworldScene());
  }
  game.scenes.push(new TrocaNpcScene(), {
    meu: createMon(meuId, 10), novo: createMon(novoId, 10), dono: "TREINADOR", onDone: () => {},
  });
}

// ?fundir=pikachu:charmander&perfil=teste -> abre direto o filme da FUSÃO
// (jogo novo, os dois na equipe; o primeiro é a cabeça, o segundo o corpo).
// Um terceiro pedaço escolhe a VARIANTE: ?fundir=rotom:voltorb:pokball
if (q.has("fundir")) {
  const [a, b, variante = ""] = (q.get("fundir") || "").split(":");
  const cab = DB.SPECIES[a] ? a : "pikachu", cor = DB.SPECIES[b] ? b : "charmander";
  if (!(game.scenes.top instanceof OverworldScene)) {
    game.newGame();
    game.giveStarter(cab);
    game.scenes.replace(new OverworldScene());
  }
  game.giveStarter(cor);
  const [cabeca, corpo] = game.state.party.slice(-2);
  game.scenes.push(new FusionScene(), { modo: "fundir", cabeca, corpo, variante });
}

// ?presente=LENDAS001 -> entrega aquele PRESENTE MISTERIOSO (um código de
// src/data/gifts.js ou de um DLC) na partida que for carregada — CONTINUAR ou
// jogo novo, como o ?give=. Um por save, como no menu: quem já recebeu não
// recebe de novo. Vários: ?presente=LENDAS001,LENDAS002. O parâmetro sai da
// URL depois, pra recarregar não tentar de novo.
if (q.has("presente")) {
  const codigos = q.get("presente").split(",").map((c) => c.toUpperCase().replace(/[^A-Z0-9]/g, "")).filter(Boolean);
  const entregar = (st) => {
    if (!st?.player) return;
    st.flags.presentes ||= {};
    const falas = [];
    for (const codigo of codigos) {
      const cartao = DB.GIFT_CODES?.[codigo];
      const id = `codigo-${codigo}`;
      if (!cartao) { console.warn("[presente] código desconhecido:", codigo); continue; }
      if (st.flags.presentes[id]) { console.log("[presente] já recebido:", codigo); continue; }
      // os LIMITADOS (contados no mundo) só pelo menu, que pergunta ao servidor
      if (cartao.limite) { console.warn("[presente] cartão limitado: resgate pelo PRESENTE MISTERIOSO no jogo:", codigo); continue; }
      let deu = false;
      for (const it of cartao.itens || []) {
        const qtd = Math.max(1, Math.min(99, it.qtd | 0 || 1));
        st.items[it.item] = Math.min(999, (st.items[it.item] || 0) + qtd);
        deu = true;
      }
      for (const m of cartao.mons || []) {
        if (!DB.SPECIES[m.id]) continue;
        const mon = createMon(m.id, Math.max(1, Math.min(100, m.nv | 0 || 5)),
          { shiny: !!m.shiny, luminoso: !!m.luminoso, nickname: m.apelido || undefined });
        if (st.party.length < 6) st.party.push(mon);
        else if (!boxCheio(st)) guardarNoBox(st, mon);
        else continue;
        st.seen[m.id] = true; st.caught[m.id] = true;
        deu = true;
      }
      if (deu) { st.flags.presentes[id] = true; falas.push(cartao.titulo); }
    }
    if (falas.length) {
      st.flags.presenteChegou = falas;      // a cena avisa ao entrar (overworld)
      game.autosave(true);
      console.log("%c[presente] entregue:", "color:#b455ff", falas.join(", "));
    }
    try {
      const u = new URL(location.href);
      u.searchParams.delete("presente");
      history.replaceState(null, "", u.pathname + (u.search || "") + u.hash);
    } catch {}
  };
  const loadOrig2 = game.loadGame.bind(game);
  game.loadGame = () => { const st = loadOrig2(); entregar(st); return st; };
  const newOrig2 = game.newGame.bind(game);
  game.newGame = (...a) => { const st = newOrig2(...a); entregar(st); return st; };
  if (game.scenes.top instanceof OverworldScene) entregar(game.state);
}

// ?pokesave=vulpixalola.shiny.NEVE -> uma partida NOVA em que você é aquele
// Pokémon (src/systems/pokesave.js; o link sai da página pokesave/). Apaga a
// partida atual, como um NOVO JOGO — e tira o parâmetro da URL, senão cada
// recarregada recomeçava do zero.
if (q.has("pokesave") && !stash?.state) {
  const pedido = lerPokesave(q.get("pokesave"));
  if (!pedido) console.warn("[pokesave] código inválido:", q.get("pokesave"));
  else {
    game.newGame();
    criarPokesave(game.state, pedido);
    Glitch.level = game.state.corruption;
    game.scenes.replace(new OverworldScene());
    game.autosave(true);
    try {
      const u = new URL(location.href);
      u.searchParams.delete("pokesave");
      history.replaceState(null, "", u.pathname + (u.search || "") + u.hash);
    } catch {}
  }
}

// ?give=spearow:10,cranidos:19 -> entrega os Pokémon na partida que for carregada
// (funciona com CONTINUAR: não começa jogo novo, não apaga nada)
if (q.has("give")) {
  const pedido = q.get("give");
  const entregar = (st) => {
    if (!st?.party) return;
    addMons(st, pedido);
    game.autosave(true);
    // tira o parâmetro da URL: recarregar não entrega de novo
    try {
      const u = new URL(location.href);
      u.searchParams.delete("give");
      history.replaceState(null, "", u.pathname + (u.search || "") + u.hash);
    } catch {}
  };
  const loadOrig = game.loadGame.bind(game);
  game.loadGame = () => { const st = loadOrig(); entregar(st); return st; };
  const newOrig = game.newGame.bind(game);
  game.newGame = (...a) => { const st = newOrig(...a); entregar(st); return st; };
  if (game.scenes.top instanceof OverworldScene) entregar(game.state);
}

// ?itens=1 -> a mochila com UM DE CADA item que tem desenho (a lista é a de
// assets/sprites/itens/itens.json, escrita por tools/itens_sprites.py), mais
// um OVO DA CRECHE e um item inventado, pra ver os ícones de família e a
// sacolinha. Funciona com CONTINUAR e com jogo novo; usar com &perfil=.
if (q.has("itens")) {
  const encher = (st) => {
    if (!st?.items) return;
    fetch(arquivo("assets/sprites/itens/itens.json")).then((r) => r.json()).then((j) => {
      for (const nome of Object.keys(j.itens || {})) st.items[nome] = Math.max(st.items[nome] || 0, 1);
      st.items["ovo de pichu"] = 1;
      st.items["coisa sem desenho"] = 1;
      game.autosave(true);
    }).catch((e) => console.warn("[itens]", e));
  };
  const loadOrig = game.loadGame.bind(game);
  game.loadGame = () => { const st = loadOrig(); encher(st); return st; };
  const newOrig = game.newGame.bind(game);
  game.newGame = (...a) => { const st = newOrig(...a); encher(st); return st; };
  if (game.scenes.top instanceof OverworldScene) encher(game.state);
}

// ?area=<código> -> entra numa GLITCH ZONE que alguém montou e mandou o link.
// O código carrega a zona inteira (src/systems/glitchzones.js,
// zonaDoCodigo), então quem abre o link cai NO MESMO LUGAR, tile por tile.
// Funciona com CONTINUAR (a partida gravada vai pra lá e o vão devolve pra onde
// ela estava) e com um jogo novo (o vão devolve pro começo).
if (q.has("area")) {
  const z = zonaDoCodigo(q.get("area"));
  if (!z) console.warn("[area] código de zona inválido:", q.get("area"));
  const entrar = (st) => {
    if (!z || !st?.player) return;
    const p = st.player;
    // já estava numa zona? a volta continua sendo a de antes, não a zona velha
    const volta = p.map === ZONA && st.zona?.volta ? st.zona.volta
                : { map: p.map, x: p.x, y: p.y, dir: p.dir };
    if (!entrarNaZona(st, z, volta)) return;
    Object.assign(p, { map: ZONA, x: z.x, y: z.y, dir: "down" });
    st.surfando = null;
    st.flags.zonaVista = true;
    try {                                    // recarregar não te joga lá de novo
      const u = new URL(location.href);
      u.searchParams.delete("area");
      history.replaceState(null, "", u.pathname + (u.search || "") + u.hash);
    } catch {}
  };
  const loadOrig = game.loadGame.bind(game);
  game.loadGame = () => { const st = loadOrig(); entrar(st); return st; };
  const newOrig = game.newGame.bind(game);
  game.newGame = (...a) => { const st = newOrig(...a); entrar(st); return st; };
}

SpriteStore.maps.glitchdim = Assets.glitchRoom(DB.KANTO.glitchdim);
SpriteStore.maps.tempestade = Assets.stormArt(DB.KANTO.tempestade);
// AS TRÊS ERAS: mesma função pras três, cada uma com a paleta dela (o `seed` é
// o do mapa, então a pintura sai igual toda vez que o jogo abre).
// O PORTAL PARADOXO: cada mapa secreto com a paleta da receita dele
for (const r of DB.RECEITAS_PORTAL || []) {
  const id = `paradoxo_${r.id}`;
  if (DB.KANTO[id]) SpriteStore.maps[id] = Assets.eraArt(DB.KANTO[id], r.paleta, r.geo.seed);
}
for (const e of DB.ERAS || []) {
  if (DB.KANTO[e.mapa]) SpriteStore.maps[e.mapa] = Assets.eraArt(DB.KANTO[e.mapa], e.paleta, e.geo.seed);
}
// BRAGLITCH: os mapas abertos saem da planta (src/data/braglitch.js); os
// interiores usam o desenho de um interior de Kanto (`arte`, ver mapArt)
for (const [id, geo] of Object.entries(DB.KANTO)) {
  if (!geo.planta) continue;
  // (as árvores de Braglitch são 3D e o overworld desenha uma por uma — src/core/arvore3d.js;
  // o desenho com elas pintadas, `comArvores`, é o do modo isométrico)
  // O ESPAÇO (src/data/espaco.js): cada planeta com as cores dele (src/core/espacoarte.js)
  SpriteStore.maps[id] = geo.tema === "espaco" ? pintarPlaneta(geo, fazerCanvas, id) : Assets.braglitchArt(geo);
}
// só desenha a ilha em código quando o mapa do decomp não foi importado
if (ILHA_GERADA) SpriteStore.maps.birth_island = Assets.islandArt(DB.KANTO.birth_island);
mapArt(game.state.player.map); // começa a carregar a arte do mapa atual
adiantarDoMapa(game.state);    // a equipe e os bichos daqui vêm primeiro
adiantarOResto();              // e o resto entra sozinho, de pouquinho em pouquinho

setTextVars({ NOME: game.state.player?.name || "VERMELHO", RIVAL: game.state.rivalNome || DB.RIVAL?.nome || "AZUL" });
// o desenho do jogador sai do save de agora, em qualquer cena: menino ou
// menina, e a roupa de BRAGLITCH enquanto o mapa for de lá
Assets.jogador = () => folhaDoJogador(game.state);

/** O jogo publicado no Pages pode ficar com metade dos arquivos velhos por até
 *  dez minutos depois de uma atualização (cada um tem o próprio cache), e aí um
 *  arquivo novo chama uma função que o velho não tem — o erro aparece no meio
 *  de uma batalha e some sozinho depois. Em vez de deixar isso parecer um bug do
 *  jogo, ele confere a versão e avisa. */
async function conferirVersao() {
  if (!Save.offline()) return;                 // em casa não existe cache velho
  try {
    const r = await fetch(new URL("data/versao.js", import.meta.url).href, { cache: "no-store" });
    const texto = await r.text();
    const doServidor = texto.match(/VERSAO\s*=\s*"([^"]+)"/)?.[1];
    if (!doServidor || doServidor === DB.VERSAO) return;
    const aviso = document.createElement("div");
    aviso.id = "desatualizado";
    aviso.innerHTML = "O jogo foi atualizado enquanto esta página estava aberta."
      + "<br>Aperte <b>Ctrl+Shift+R</b> (ou puxe a tela pra baixo, no celular) pra pegar a versão nova.";
    document.body.appendChild(aviso);
  } catch { /* sem rede: o jogo continua, é offline mesmo */ }
}
conferirVersao();

initHot(game);
// Funções online (sala, presença, troca, batalha link, presente misterioso).
// Se o servidor não responder, o jogo segue igual: nada aqui é obrigatório.
// No jogo publicado na web não existe servidor de sala nenhum, então elas saem
// do menu em vez de ficar dando erro em quem clicar.
if (Save.offline() && DB.ONLINE) DB.ONLINE.ativo = false;
Online.init(game);

// -------------------------------------------------------------- resize
function resize() {
  // a escala precisa cair em pixels INTEIROS do monitor: em telas HiDPI
  // (devicePixelRatio 1.25/1.5) uma escala quebrada faz o cenário cintilar
  const dpr = window.devicePixelRatio || 1;
  // no celular o que sobra é a altura MENOS os botões de tela: sem descontar
  // eles, a tela do jogo cresce por baixo do polegar e some metade do cenário
  const reservado = celular ? alturaDosBotoes() + 12 : 60;
  const fit = Math.min(window.innerWidth / W, (window.innerHeight - reservado) / H);
  // no celular a escala inteira é uma prisão: num aparelho estreito ela cai pra
  // 1 e o jogo fica do tamanho de um selo. Lá vale a escala cheia — a tela é de
  // pontos tão pequenos que a borda quebrada não aparece, e o que importa é
  // enxergar. No monitor continua inteira, que é onde o cintilar se vê.
  const scale = celular ? Math.max(1, fit) : Math.max(1, Math.floor(fit * dpr)) / dpr;
  display.style.width = W * scale + "px";
  display.style.height = H * scale + "px";
}
// OS BOTÕES DE TELA. Só entram em aparelho de dedo: num computador eles seriam
// um enfeite que rouba altura da tela do jogo.
const celular = ehCelular();
if (celular) {
  document.body.classList.add("celular");
  ligarToque();
}
window.addEventListener("resize", resize);
// virar o celular muda tudo de tamanho, e o `resize` nem sempre chega sozinho
window.addEventListener("orientationchange", () => setTimeout(resize, 120));
resize();

// ---------------------------------------------------------------- loop
let last = performance.now();
let acc = 0;
const STEP = 1 / 60;
let fps = 0, fpsT = 0, frames = 0;

// O FPS das OPÇÕES (src/core/opcoes.js): até 60, o requestAnimationFrame (que
// segue o monitor) pulando quadro se precisar; acima, um laço sem freio pelo
// MessageChannel — o jogo desenha mais vezes, mas a tela do monitor continua
// mostrando só o que ela aguenta (quase sempre 60 por segundo)
let ultimoDesenho = 0;
const canalFps = new MessageChannel();
canalFps.port1.onmessage = () => frame(performance.now());
function agendar() {
  if ((Opcoes.get("fps") || 60) > 60) canalFps.port2.postMessage(0);
  else requestAnimationFrame(frame);
}

function frame(now) {
  const alvo = Opcoes.get("fps") || 60;
  // ainda não deu a hora do próximo quadro (30 FPS, ou acima de 60): espera
  if (alvo !== 60 && now - ultimoDesenho < 1000 / alvo - 0.25) return void agendar();
  ultimoDesenho = now;
  game.frames = (game.frames || 0) + 1;
  const dt = Math.min(0.25, (now - last) / 1000);
  last = now;
  acc += dt;
  frames++; fpsT += dt;
  if (fpsT >= 0.5) { fps = Math.round(frames / fpsT); frames = 0; fpsT = 0; }

  while (acc >= STEP) {
    if (Input.consume("debug")) game.debug = !game.debug;
    if (Input.consume("mute")) Audio2.toggleMute();
    if (Input.consume("glitch")) { Glitch.hit(1.5); Audio2.glitch(); }
    game.state.playtime += STEP;
    // a fenda continua fechando mesmo durante uma batalha
    const ms = game.state.mission;
    // (fenda é a 011GLITCHDIMENSION110 e qualquer mapa marcado `fenda: true` — a
    // KANTO DISTORCIDA do dlc/extrema.js)
    const naFenda = game.state.player.map === "glitchdim" || !!DB.MAPS[game.state.player.map]?.fenda;
    if (ms?.left > 0 && naFenda) ms.left = Math.max(0, ms.left - STEP);
    Glitch.update(STEP);
    Online.update(STEP);            // presença/convites andam mesmo dentro do menu
    game.scenes.update(STEP);
    Input.endFrame();
    acc -= STEP;
  }

  // a escala da tela volta a cada quadro: cena que esqueceu um restore não estraga o resto
  ctx.setTransform(ESCALA_TELA, 0, 0, ESCALA_TELA, 0, 0);
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  // NO ISOMÉTRICO toda a interface vira bloco: cada painel (fala, menu,
  // objetivo, caixas da batalha, mochila...) ganha tampo e lateral no 2:1 dos
  // blocos do mapa (src/core/gfx.js, `painelEmBloco`)
  painelEmBloco(isoLigado() ? 6 : 0);
  game.scenes.render(ctx);
  painelEmBloco(0);
  // gancho de diagnóstico: window.__camlog = [] grava a câmera quadro a quadro
  if (window.__camlog && game.scenes.top?.cam) window.__camlog.push(game.scenes.top.cam.y);
  if (game.debug) {
    const p = game.state.player;
    drawText(ctx, `${fps}FPS ${p.map} ${p.x},${p.y}`, 2, H - 20, "#00ffcc");
    drawText(ctx, `CORR ${Math.round(game.state.corruption)}%`, 2, H - 10, "#b455ff");
    const fc = game.state.fragChance ?? DB.SPOT_CHANCE ?? 0.5;
    drawText(ctx, `FRAG ${Math.round(fc * 100)}%`, 92, H - 10, "#ffd166");
  }
  // OPÇÕES → SUAVE: os pixels se emendam (src/core/suave.js)
  // na GLITCH DIMENSION, cores parecidas se juntam: o jogador derrete no chão
  if (Opcoes.get("suave")) suavizar(buffer, Opcoes.get("suave"), game.state?.player?.map === "glitchdim" ? TOL_GLITCH : 0);
  Glitch.render(dctx, buffer);
  // o FPS de verdade no canto, quando a opção não está no 60 de sempre
  if (alvo !== 60 && !game.debug) {
    const txt = `${fps} FPS`;
    dctx.save(); dctx.font = "bold 14px monospace"; dctx.fillStyle = "rgba(0,0,0,0.6)";
    dctx.fillRect(dctx.canvas.width - txt.length * 9 - 12, 4, txt.length * 9 + 8, 20);
    dctx.fillStyle = "#00ffcc"; dctx.fillText(txt, dctx.canvas.width - txt.length * 9 - 8, 19); dctx.restore();
  }
  agendar();
}
requestAnimationFrame(frame);

// O SOM SÓ COMEÇA DEPOIS DE UM GESTO — é regra do navegador, não escolha nossa.
// No celular NÃO EXISTE `keydown`: preso só nele, o jogo ficaria mudo pra sempre
// no aparelho onde mais gente vai jogar. Vale qualquer primeiro contato.
for (const ev of ["keydown", "pointerdown", "touchstart"]) {
  window.addEventListener(ev, () => Audio2.unlock(), { once: true });
}

// fechar a aba, recarregar ou trocar de janela salva a partida
const gravarSaindo = () => {
  if (game.state?.party && !(game.scenes?.top instanceof TitleScene)) Save.flush(game.state);
};
window.addEventListener("pagehide", gravarSaindo);
window.addEventListener("beforeunload", gravarSaindo);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") gravarSaindo();
});
window.game = game;
window.Assets = Assets;
window.DB = DB;
