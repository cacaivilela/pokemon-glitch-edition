// Bootstrap: canvas, loop, estado global e integracao com o live update.
import { DB, ILHA_GERADA } from "./data/index.js";
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
import { abrirPortal } from "./systems/raid.js";
import { ZONA, abrirZona, garantirZona, zonaDoCodigo, entrarNaZona } from "./systems/glitchzones.js";
import { createMon, recalc } from "./systems/mon.js";
import { EvolutionScene } from "./scenes/evolution.js";
import { MegaScene } from "./scenes/mega.js";
import { GrupoBattleScene } from "./scenes/grupobattle.js";
import { HordaScene } from "./scenes/horda.js";
import { TrocaNpcScene } from "./scenes/trocanpc.js";
import { SoltarScene } from "./scenes/soltar.js";
import { VestirScene } from "./scenes/vestir.js";
import { NascerScene } from "./scenes/nascer.js";
import { FusionScene } from "./scenes/fusion.js";
import { reverterTudo } from "./systems/mega.js";
import { minutosDaFase } from "./systems/ciclo.js";
import { registrarDoEstado } from "./systems/fusao.js";
import { Online } from "./systems/online.js";
import { carregarDLC, aplicarDLC, ligarDoLink } from "./systems/dlc.js";
import { lerCodigo as lerPokesave, criarPokesave, folhaDoJogador } from "./systems/pokesave.js";
import { guardar as guardarNoBox, cheio as boxCheio } from "./systems/box.js";
import { TitleScene } from "./scenes/title.js";
import { AberturaScene } from "./scenes/abertura.js";
import { OverworldScene } from "./scenes/overworld.js";
import { BattleScene } from "./scenes/battle.js";
import { drawText, painelEmBloco } from "./core/gfx.js";
import { isoLigado } from "./core/isometrico.js";
import { url as arquivo } from "./core/base.js";
import { loadExternalSprites, adiantarDoMapa, adiantarOResto, mapArt, SpriteStore } from "./core/sprites.js";

const W = 240, H = 160;

const display = document.getElementById("screen");
const dctx = display.getContext("2d");
const buffer = document.createElement("canvas");
buffer.width = W; buffer.height = H;
const ctx = buffer.getContext("2d");
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

// MENINO OU MENINA: escolhido no JOGO NOVO, depois da região. Muda o desenho
// no mapa (hero / heroina, ver Assets.actor) e o nome de quem joga. Save sem
// o campo é de antes da escolha existir: menino. Em BRAGLITCH são os gêmeos
// de lá, CAIO e LARA (tools/sprite_caio_lara.py).
const NOME_DO_GENERO = { menino: "VERMELHO", menina: "FOLHA" };
const NOME_BRAGLITCH = { menino: "CAIO", menina: "LARA" };

function newState(regiao, genero = "menino") {
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
  };
}

const game = {
  state: newState(),
  scenes: null,
  debug: false,

  /** `regiao`: "kanto" ou "braglitch"; `genero`: "menino" ou "menina" (as
   *  duas escolhas da tela de título). */
  newGame(regiao, genero) {
    this.state = newState(regiao, genero);
    setTextVars({ NOME: this.state.player.name });
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
    } else this.newGame();
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
  "motoqueiro", "marinheiro", "montanhista", "rocket", "rocketf", "lutador", "superm", "superf",
  "tecnico", "tecnica", "canalizadora", "maniaco", "roqueiro", "ipe",
  "hero_brag", "heroina_brag", "ash",
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
    const [id, lvl] = item.trim().split(":");
    if (!DB.SPECIES[id]) { console.warn("[give] espécie desconhecida:", id); continue; }
    const mon = createMon(id, Math.max(1, Math.min(100, +lvl || 5)));
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
  game.newGame(GEMEO_TESTE || LIGA_TESTE != null ? "braglitch" : undefined, q.get("genero") || undefined);
  {
    const [sid, slvl] = (q.get("starter") || "charmander").split(":");
    const mon = game.giveStarter(sid);
    if (slvl) { mon.level = +slvl; recalc(mon); mon.hp = mon.maxHp; }
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
  }
  if (LIGA_TESTE != null) {
    Object.assign(game.state.flags, { starterChosen: true, bragMissao: true, bragMissingnoVencido: true });
    game.state.bragBadges = (DB.INSIGNIAS_BRAG || []).map((b) => b.id);
    if (LIGA_TESTE > 0) game.state.flags.ligaPortao = true;
    for (let i = 0; i < LIGA_TESTE; i++) game.state.flags[`ligaQuiz${i}`] = true;
    game.state.items["poção"] = 20;
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
  if (q.has("party")) {   // ?party=pidgey:8,pikachu:6 -> equipe extra pra teste
    addMons(game.state, q.get("party"));
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
  // ?hordas=1&map=route1 -> todo selvagem comum nasce com HORDA (e as silhuetas em cima)
  if (q.has("hordas") && DB.CONFIG) DB.CONFIG.hordaOdds = 1;
  if (q.has("flags")) {    // ?flags=bragCampeao,caughtMissingno -> marcas da história ligadas
    for (const f of q.get("flags").split(",")) if (f.trim()) game.state.flags[f.trim()] = true;
  }
  if (q.has("mochila")) {  // ?mochila=guarda-roupa único:1,poção:5 -> itens na mochila pra teste
    for (const par of q.get("mochila").split(",")) {
      const [item, n] = par.split(":");
      if (item?.trim()) game.state.items[item.trim()] = Math.max(1, +n || 1);
    }
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
  if (q.get("mega")) {   // ?mega=1 -> anel + todas as megapedras na mochila
    game.state.items[DB.MEGA_ANEL] = 1;
    for (const pedra of Object.keys(DB.MEGA_PEDRAS || {})) game.state.items[pedra] = 1;
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
  if (q.has("battle")) {
    const foe = createMon(q.get("battle"), +(q.get("lvl") || 5));
    if (q.has("foegolpes")) {   // &foegolpes=ondadechoque -> o selvagem só com esses golpes
      const ids = q.get("foegolpes").split(",").map((g) => g.trim()).filter((g) => DB.MOVES[g]).slice(0, 4);
      if (ids.length) foe.moves = ids.map((id) => ({ id, pp: DB.MOVES[id].pp, ppMax: DB.MOVES[id].pp }));
    }
    const bs = game.scenes.push(new BattleScene(), { foe, glitch: q.get("battle") === "missingno" });
    bs.fadeA = 0; bs.fadeDir = 0;
  }
  if (q.get("debug")) game.debug = true;
}

// ?evolucao=charmander:charmeleon&perfil=teste -> abre direto a tela de evolução
// (jogo novo, o primeiro vira o inicial). &estranho=1 -> a versão da pedra da fenda.
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
  const mon = createMon(sid, 30);
  // as formas do ZYGARDE trocam pelo CUBO: a cena é a de mudar de forma
  const cubo = DB.CUBO_ZYGARDE;
  const forma = cubo?.aceita.includes(sid) && cubo.aceita.includes(to) ? cubo.cena : null;
  if (to) game.scenes.push(new EvolutionScene(), { mon, to, estranho: q.has("estranho"), forma });
}

// ?megacena=charizard:megacharizardx&perfil=teste -> abre direto a cutscene da
// MEGA EVOLUÇÃO (src/scenes/mega.js), a mesma da batalha, com a frase no fim
if (q.has("megacena")) {
  const [de, para] = (q.get("megacena") || "").split(":");
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

// ?area=<código> -> entra numa GLITCH ZONE que alguém montou na oficina
// (glitchzone/). O código carrega a zona inteira (src/systems/glitchzones.js,
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
for (const e of DB.ERAS || []) {
  if (DB.KANTO[e.mapa]) SpriteStore.maps[e.mapa] = Assets.eraArt(DB.KANTO[e.mapa], e.paleta, e.geo.seed);
}
// BRAGLITCH: os mapas abertos saem da planta (src/data/braglitch.js); os
// interiores usam o desenho de um interior de Kanto (`arte`, ver mapArt)
for (const [id, geo] of Object.entries(DB.KANTO)) {
  if (geo.planta) SpriteStore.maps[id] = Assets.braglitchArt(geo);
}
// só desenha a ilha em código quando o mapa do decomp não foi importado
if (ILHA_GERADA) SpriteStore.maps.birth_island = Assets.islandArt(DB.KANTO.birth_island);
mapArt(game.state.player.map); // começa a carregar a arte do mapa atual
adiantarDoMapa(game.state);    // a equipe e os bichos daqui vêm primeiro
adiantarOResto();              // e o resto entra sozinho, de pouquinho em pouquinho

setTextVars({ NOME: game.state.player?.name || "VERMELHO" });
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

function frame(now) {
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
    if (ms?.left > 0 && game.state.player.map === "glitchdim") ms.left = Math.max(0, ms.left - STEP);
    Glitch.update(STEP);
    Online.update(STEP);            // presença/convites andam mesmo dentro do menu
    game.scenes.update(STEP);
    Input.endFrame();
    acc -= STEP;
  }

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
  Glitch.render(dctx, buffer);
  requestAnimationFrame(frame);
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
