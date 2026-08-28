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
import { createMon, recalc } from "./systems/mon.js";
import { reverterTudo } from "./systems/mega.js";
import { registrarDoEstado } from "./systems/fusao.js";
import { Online } from "./systems/online.js";
import { TitleScene } from "./scenes/title.js";
import { AberturaScene } from "./scenes/abertura.js";
import { OverworldScene } from "./scenes/overworld.js";
import { BattleScene } from "./scenes/battle.js";
import { drawText } from "./core/gfx.js";
import { loadExternalSprites, adiantarDoMapa, adiantarOResto, mapArt, SpriteStore } from "./core/sprites.js";

const W = 240, H = 160;

const display = document.getElementById("screen");
const dctx = display.getContext("2d");
const buffer = document.createElement("canvas");
buffer.width = W; buffer.height = H;
const ctx = buffer.getContext("2d");
ctx.imageSmoothingEnabled = false;
dctx.imageSmoothingEnabled = false;

function newState() {
  return {
    player: { name: "VERMELHO", map: DB.START_MAP, ...DB.MAPS[DB.START_MAP].spawn },
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
    respawn: { map: DB.START_MAP, ...DB.MAPS[DB.START_MAP].spawn },
  };
}

const game = {
  state: newState(),
  scenes: null,
  debug: false,

  newGame() {
    this.state = newState();
    const spawn = DB.MAPS[DB.START_MAP].spawn;
    Object.assign(this.state.player, { map: DB.START_MAP, ...spawn });
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
  "tecnico", "tecnica", "canalizadora", "maniaco", "roqueiro",
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
  reverterTudo(game.state);
  game.state.party.forEach(recalc);
  game.state.box?.forEach(recalc);
  Glitch.level = game.state.corruption;
  game.scenes.push(stash.scene === "TitleScene" ? new TitleScene() : new OverworldScene());
  console.log("%c[hot] estado restaurado", "color:#59d99b");
} else {
  // Boot de verdade: a ABERTURA vem antes do título. Ela não entra quando o
  // live update restaura a partida (acima) nem quando alguém abriu com atalho
  // de dev (?map=, ?battle=) — nesses dois casos ninguém quer ver fanfarra, e
  // no primeiro ela apareceria a cada arquivo salvo.
  const busca = new URLSearchParams(location.search);   // o `q` do arquivo só nasce mais abaixo
  const atalhoDeDev = busca.has("map") || busca.has("battle") || busca.has("starter");
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
const q = new URLSearchParams(location.search);
if (q.has("map") || q.has("battle")) {
  game.newGame();
  {
    const [sid, slvl] = (q.get("starter") || "charmander").split(":");
    const mon = game.giveStarter(sid);
    if (slvl) { mon.level = +slvl; recalc(mon); mon.hp = mon.maxHp; }
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
  if (q.get("mega")) {   // ?mega=1 -> anel + todas as megapedras na mochila
    game.state.items[DB.MEGA_ANEL] = 1;
    for (const pedra of Object.keys(DB.MEGA_PEDRAS || {})) game.state.items[pedra] = 1;
    game.state.flags.anelMega = true;
  }
  if (q.get("fusao")) {   // ?fusao=1 -> a máquina do professor já na mochila
    game.state.items[DB.FUSAO.item] = 1;
    game.state.flags.decodificador = true;
  }
  if (q.get("frag")) {   // ?frag=1 -> fragmento colado no jogador, pra testar
    const p2 = game.state.player;
    game.state.flags.dimUnlocked = true;
    game.state.fragment = { map: p2.map, x: p2.x, y: p2.y + 1 };
  }
  game.scenes.replace(new OverworldScene());
  if (q.has("battle")) {
    const foe = createMon(q.get("battle"), +(q.get("lvl") || 5));
    const bs = game.scenes.push(new BattleScene(), { foe, glitch: q.get("battle") === "missingno" });
    bs.fadeA = 0; bs.fadeDir = 0;
  }
  if (q.get("debug")) game.debug = true;
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
  game.newGame = () => { const st = newOrig(); entregar(st); return st; };
  if (game.scenes.top instanceof OverworldScene) entregar(game.state);
}

SpriteStore.maps.glitchdim = Assets.glitchRoom(DB.KANTO.glitchdim);
SpriteStore.maps.tempestade = Assets.stormArt(DB.KANTO.tempestade);
// só desenha a ilha em código quando o mapa do decomp não foi importado
if (ILHA_GERADA) SpriteStore.maps.birth_island = Assets.islandArt(DB.KANTO.birth_island);
mapArt(game.state.player.map); // começa a carregar a arte do mapa atual
adiantarDoMapa(game.state);    // a equipe e os bichos daqui vêm primeiro
adiantarOResto();              // e o resto entra sozinho, de pouquinho em pouquinho

setTextVars({ NOME: game.state.player?.name || "VERMELHO" });

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
  game.scenes.render(ctx);
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
