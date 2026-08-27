// Cena do mundo. A geometria (desenho, colisão, grama, barrancos, portas e
// conexões entre mapas) vem dos mapas originais do FireRed, carregados de
// assets/maps/. Os diálogos, encontros e regras vêm de src/data/maps.js.
import { DB } from "../data/index.js";
import { Assets, TILE } from "../core/assets.js";
import { mapArt, mapOverlay, adiantarDoMapa } from "../core/sprites.js";
import { Input, Texto } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { Save } from "../core/save.js";
import { Opcoes } from "../core/opcoes.js";
import { panel, drawText, cursor, bar, hpColor, fade, sinal, PAL, LINE_H } from "../core/gfx.js";
import { Dialogue } from "../systems/dialogue.js";
import { Online } from "../systems/online.js";
import { OnlineMenuScene } from "./online.js";
import { TradeScene } from "./trade.js";
import { LinkBattleScene } from "./linkbattle.js";
import { Glitch } from "../systems/glitchfx.js";
import { randRange } from "../core/rng.js";
import { rollEncounter, rollDimEncounter, rollFlores } from "../systems/encounters.js";
import {
  heal, hpPct, gainXp, xpForLevel, createMon, evolutionFor, learnableMoves,
} from "../systems/mon.js";
import { scatterDimLoot } from "../systems/loot.js";
import { nascer, andar, emCima, cacando, fugindo, encontroDe } from "../systems/selvagens.js";
import { distorcaoDeAgora, distorcaoAqui, ondeEla } from "../systems/distorcoes.js";
import { montarChefe, temPortal, abrirPortal, portalAberto, fecharPortal, corrupcaoDoPortal, pertoDoPortal }
  from "../systems/raid.js";
import { pedrasIniciaisDevidas } from "../systems/mega.js";
import { estado as estadoMissao, progresso, aceitar, entregar, diario, feitas, missaoPorId, daVez }
  from "../systems/missoes.js";
import { estaNaHora, marcarFeita, fracas, apagarDoCodigo } from "../systems/faxina.js";
import { veu, temCeu, agora as horaDoMundo } from "../systems/ciclo.js";
import { escuridaoDoLugar, ehCaverna, acesa, camadaDeLuz, brilho, RAIO } from "../systems/lanterna.js";
import { AcampamentoScene } from "./acampamento.js";
import { LeilaoScene } from "./leilao.js";
import { temBarraca } from "../systems/leilao.js";
import { temVisor, explicado } from "../systems/glitchboost.js";
import { podeAcampar, fator, buff, minutosDoBuff } from "../systems/acampamento.js";
import { rivalNpc } from "../systems/rival.js";
import { ehFusao, fundivel, previsao, partes, temFicha, fichasProntas, variantes,
         buscarDoMundo, especiePorTexto, montarEspecie, servidorMundo,
         importarFicha, trocarVariante, versoesInvertidas } from "../systems/fusao.js";
import { BattleScene } from "./battle.js";
import { EvolutionScene } from "./evolution.js";
import { FusionScene } from "./fusion.js";
import { FusaoEditorScene } from "./fusaoeditor.js";
import { ConcursoScene } from "./concurso.js";

const W = 240, H = 160;
// tempos do FireRed, contados em quadros (o loop roda fixo em 60fps):
// 16 quadros por tile andando, 8 correndo, 6 pra virar no lugar.
const WALK = 16, RUN = 8, TURN = 6, HOP = 20;
// Quantos quadros aquele passo leva, já com a VELOCIDADE das opções. O jogo
// roda travado em 60fps: andar mais rápido é dar o passo em menos quadros, não
// acelerar o relógio. Nunca menos de 2 quadros — abaixo disso o passo some e o
// jogador teleporta de tile em tile.
const passo = (base) => Math.max(2, Math.round(base / (Opcoes.get("velocidade") || 1)));
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const BOX_LINHAS = 9;          // linhas visíveis em cada lado da tela da BOX
// ------------------------------------------------------- painel de fios (gym)
// Grade de peças de fio: cada célula é uma máscara de lados abertos.
// O gerador entra pelo oeste da linha do meio; a barreira sai pelo leste dela.
const FIO_W = 5, FIO_H = 3, FIO_LINHA = 1;
const F_N = 1, F_L = 2, F_S = 4, F_O = 8;
const PECAS = [F_N | F_S, F_L | F_O, F_N | F_L, F_L | F_S, F_S | F_O, F_O | F_N];
const gira = (m) => ((m << 1) | (m >> 3)) & 15;

/** Sorteia um caminho do gerador até a barreira; devolve null se se enrolar. */
function fiosCaminho() {
  const g = Array.from({ length: FIO_H }, () => Array(FIO_W).fill(0));
  let x = 0, y = FIO_LINHA, passos = 0;
  g[y][x] |= F_O;                                   // entrada do gerador
  while (x < FIO_W - 1 || y !== FIO_LINHA) {
    if (++passos > 40) return null;
    const opts = [];
    if (x < FIO_W - 1 && !g[y][x + 1]) opts.push([1, 0], [1, 0]);   // andar reto pesa mais
    // na última coluna só dá pra subir/descer na direção da barreira
    if (y > 0 && !g[y - 1][x] && (x < FIO_W - 1 || y - 1 >= FIO_LINHA)) opts.push([0, -1]);
    if (y < FIO_H - 1 && !g[y + 1][x] && (x < FIO_W - 1 || y + 1 <= FIO_LINHA)) opts.push([0, 1]);
    if (!opts.length) return null;                  // beco sem saída: sorteia de novo
    const [dx, dy] = opts[Math.floor(Math.random() * opts.length)];
    g[y][x] |= dx ? F_L : dy < 0 ? F_N : F_S;
    x += dx; y += dy;
    g[y][x] |= dx ? F_O : dy < 0 ? F_S : F_N;
  }
  g[y][x] |= F_L;                                   // saída pra barreira
  return g;
}

/** Caminho + peças soltas no resto + tudo girado ao acaso. */
function fiosSortear() {
  for (let i = 0; i < 60; i++) {
    const g = fiosCaminho();
    if (!g) continue;
    for (let y = 0; y < FIO_H; y++) {
      for (let x = 0; x < FIO_W; x++) {
        if (!g[y][x]) g[y][x] = PECAS[Math.floor(Math.random() * PECAS.length)];
        for (let r = Math.floor(Math.random() * 4); r > 0; r--) g[y][x] = gira(g[y][x]);
      }
    }
    if (!fiosResolvido(g)) return g;                // já resolvido não vale de desafio
  }
  return null;
}

/** Células que a corrente alcança, saindo do gerador. */
function fiosEnergia(g) {
  const vivas = new Set();
  if (!(g[FIO_LINHA][0] & F_O)) return vivas;
  const fila = [[0, FIO_LINHA]];
  vivas.add(`0,${FIO_LINHA}`);
  const lados = [[0, -1, F_N, F_S], [1, 0, F_L, F_O], [0, 1, F_S, F_N], [-1, 0, F_O, F_L]];
  while (fila.length) {
    const [x, y] = fila.pop();
    for (const [dx, dy, meu, dele] of lados) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= FIO_W || ny >= FIO_H) continue;
      if (!(g[y][x] & meu) || !(g[ny][nx] & dele)) continue;
      const k = `${nx},${ny}`;
      if (vivas.has(k)) continue;
      vivas.add(k);
      fila.push([nx, ny]);
    }
  }
  return vivas;
}

const fiosResolvido = (g) =>
  !!(g[FIO_LINHA][FIO_W - 1] & F_L) && fiosEnergia(g).has(`${FIO_W - 1},${FIO_LINHA}`);

/** Texto que muda a cada insígnia (ver STORY.escort / oakGreet / dimension.enter):
 *  pega a variante de N e, se ela não existir, a última escrita antes de N. */
function porInsignia(bloco, n) {
  if (!bloco || Array.isArray(bloco) || typeof bloco === "string") return bloco;
  if (bloco[n]) return bloco[n];
  const antes = Object.keys(bloco).map(Number).filter((k) => k <= n);
  return bloco[antes.length ? Math.max(...antes) : Math.min(...Object.keys(bloco).map(Number))];
}
const OPPOSITE = { up: "down", down: "up", left: "right", right: "left" };
// reserva, usada só se o mapa não trouxer deoxysSpots (ver src/data/maps.js)
const DEOXYS_PONTOS = [
  { x: 11, y: 11 }, { x: 7, y: 12 }, { x: 15, y: 12 },
  { x: 11, y: 14 }, { x: 5, y: 9 }, { x: 17, y: 9 },
];

export class OverworldScene {
  constructor() {
    this.dlg = new Dialogue();
    this.cam = { x: 0, y: 0 };
    this.move = null;
    this.animT = 0;
    this.frame = 0;
    this.justWarped = true;
    this.banner = 0;
    this.menu = null;
    this.fadeA = 0;
    this.fadeDir = 0;
    this.pending = null;
    this.wanderT = 0;
    this.rustle = null;      // tufo de grama quando pisa
    this.selvagens = [];     // os bichos à vista (cenário vivo: não vão pro save)
    this.nascerT = 0;
    this.compa = null;       // o COMPANHEIRO: quem da equipe está te seguindo
    this.fx = null;          // transição de batalha
    this.stepParity = 0;     // alterna a perna a cada tile
    this.turnT = 0;          // vira no lugar antes de sair andando
  }

  get st() { return this.game.state; }
  get map() { return DB.MAPS[this.st.player.map]; }
  get geo() { return DB.KANTO[this.st.player.map]; }

  enter() {
    this.ligaOnline();
    this.ensureDimLoot();
    this.rollFragment();
    if (this.st.flags.escortPending) this.spawnEscort();
    this.mapaVisto = this.st.player.map;
    this.banner = 2.2;
    this.ajeitarNaAgua();
    this.snapCamera();
    this.game.music(this.map.music);
  }
  resume() {
    if (this.game._adoptPending) {   // o arquivo mudou durante a batalha
      const motivo = this.game._adoptPending;
      this.game._adoptPending = null;
      this.game.adoptSave(motivo);
    }
    if (this.rodarEvolucao()) return;   // quem subiu de nível evolui antes de tudo
    this.deoxysVolta();                 // na ilha: ele se remonta se não foi capturado
    this.checkPokedexAlert();           // venceu o Brock? a Pokédex apita agora
    this.game.autosave?.();          // saiu da batalha: grava
    this.game.music(this.map.music);
    this.fadeA = 1; this.fadeDir = -1;
    // a batalha pode ter te movido de lugar (desmaiar te manda pro último ponto
    // seguro): sem isto a câmera ficava onde estava antes até o primeiro passo
    if (this.st.player.map !== this.mapaVisto) {
      this.mapaVisto = this.st.player.map;
      this.justWarped = true;
      mapArt(this.st.player.map);
      this.banner = 2.2;
    }
    this.ajeitarNaAgua();
    this.snapCamera();
    if (this.st.flags.escortPending) this.spawnEscort();
    this.reporEstaticos();
    adiantarDoMapa(this.st);          // os bichos deste mapa, antes de aparecerem
    this.checkMissionDone();
  }

  /** Convites que chegam da sala aparecem aqui, no mapa: é a única cena que
   *  pode perguntar "aceita?" sem atrapalhar nada. */
  ligaOnline() {
    if (this._online) return;              // enter() roda de novo a cada partida
    this._online = [
      Online.on("convite", (c) => this.perguntaConvite(c)),
      Online.on("comecar", (c) => this.abreOnline(c)),      // meu convite foi aceito
    ];
  }

  perguntaConvite(c) {
    const chave = c.modo === "batalha" ? "batalhaConvite" : "trocaConvite";
    const frase = String(DB.ONLINE_TEXTO?.[chave] || "").replace("{NOME}", c.nome);
    this.dlg.ask(frase, ["SIM", "NÃO"], (i) => {
      const combinado = Online.responder(i === 0);
      if (combinado) this.abreOnline(combinado);
    });
  }

  /** abre a cena da troca ou da batalha link */
  abreOnline(c) {
    if (c.modo === "batalha" && !this.st.party.some((m) => m.hp > 0)) {
      Online.liberar();
      return void this.dlg.say(DB.ONLINE_TEXTO.batalhaSemTime);
    }
    this.menu = null;
    const Cena = c.modo === "batalha" ? LinkBattleScene : TradeScene;
    this.game.scenes.push(new Cena(), c);
  }

  /** coloca o assistente num tile livre ao lado do jogador */
  spawnEscort() {
    const p = this.st.player;
    const spot = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, 1]]
      .map(([dx, dy]) => ({ x: p.x + dx, y: p.y + dy }))
      .find((c) => !this.blocked(c.x, c.y));
    if (!spot) return;   // sem espaço: tenta de novo no próximo mapa
    this.st.flags.escortPending = false;
    this.st.escort = {
      stage: "found", map: p.map, x: spot.x, y: spot.y, dir: "down",
      from: { map: p.map, x: p.x, y: p.y, dir: p.dir },
    };
    Audio2.select();
  }
  onDataChange() { this.snapCamera(); }

  /** o save foi trocado por fora (giveglitch, outra aba): redesenha e avisa */
  onSaveAdopted() {
    this.menu = null;
    this.justWarped = true;
    this.snapCamera();
    this.game.music(this.map.music);
    mapArt(this.st.player.map);
    this.dlg.say("SEU SAVE FOI ATUALIZADO POR FORA. A PARTIDA FOI RECARREGADA.");
  }

  // ------------------------------------------------------------ geometria
  tagAt(x, y) {
    const g = this.geo;
    if (!g || x < 0 || y < 0 || x >= g.w || y >= g.h) return -1;
    const t = g.tags.charCodeAt(y * g.w + x) - 48;
    // mato que você já cortou com CORTE não volta a crescer
    if (t === DB.TAG.GRASS && this.cortados().includes(`${x},${y}`)) return DB.TAG.FREE;
    // o que abriu durante o jogo (barreira dos fios, porta do quiz) vira chão
    if (t === DB.TAG.BLOCK && this.tileLiberado(`${x},${y}`)) return DB.TAG.FREE;
    return t;
  }

  cortados() { return this.st.cortado?.[this.st.player.map] || []; }

  /** true quando a barreira deste mapa já foi desligada no painel */
  barreiraAberta() {
    const b = this.map.barreira;
    return !!b && !!this.st.flags[b.flag];
  }

  quizFlag(q) { return `quiz_${this.st.player.map}_${q.id}`; }
  quizAberto(q) { return !!this.st.flags[this.quizFlag(q)]; }

  /** tiles que nasceram sólidos e foram abertos: a barreira do ginásio elétrico
   *  e as portas que as perguntas do BLAINE destrancam */
  tileLiberado(k) {
    const b = this.map.barreira;
    if (b && this.st.flags[b.flag] && b.tiles.includes(k)) return true;
    for (const q of this.map.quiz || []) {
      if (q.porta.includes(k) && this.quizAberto(q)) return true;
    }
    return false;
  }

  /** lista de tiles abertos agora, pra remendar o desenho do mapa */
  tilesAbertos() {
    const out = [];
    const b = this.map.barreira;
    if (b && this.st.flags[b.flag]) out.push(...b.tiles.map((k) => [k, b.piso]));
    for (const q of this.map.quiz || []) {
      if (this.quizAberto(q)) out.push(...q.porta.map((k) => [k, q.piso || this.map.piso]));
    }
    return out;
  }

  /** pedras que ainda não foram quebradas neste mapa */
  pedrasAqui() {
    const quebradas = this.st.quebrado?.[this.st.player.map] || [];
    return (this.map.pedras || []).filter((k) => !quebradas.includes(k));
  }

  /** blocos deste mapa, já com a posição atual (eles ficam onde você empurrou) */
  blocosAqui() {
    const movidos = this.st.blocos?.[this.st.player.map] || {};
    return (this.map.blocos || []).map((k) => {
      const [x, y] = k.split(",").map(Number);
      return { id: k, ...(movidos[k] || { x, y }) };
    });
  }

  obstaculoEm(x, y) {
    const k = `${x},${y}`;
    if (this.pedrasAqui().includes(k)) return { tipo: "pedra", id: k, x, y };
    const b = this.blocosAqui().find((o) => o.x === x && o.y === y);
    return b ? { tipo: "bloco", ...b } : null;
  }
  /** NPCs do mapa + o assistente do professor, quando ele está aqui */
  npcsHere() {
    const mapa = this.st.player.map;
    const base = (this.map.npcs || [])
      // chefe e guarda de porta somem depois de perder; o resto continua no mapa
      .filter((n) => !((n.boss || n.sumirDepois) && this.st.npcState[`${mapa}.${n.id}`]?.defeated))
      // `someComFlag`: o NPC sai de cena quando aquilo já aconteceu (o AZUL do
      // laboratório some assim que você escolhe, e volta montado em runtime)
      .filter((n) => !(n.someComFlag && this.st.flags?.[n.someComFlag]));
    const extra = [];
    const e = this.st.escort;
    if (e && e.map === this.st.player.map) extra.push(this.escortNpc(e));
    const boss = this.bossNpc();
    if (boss) extra.push(boss);
    const deo = this.deoxysNpc();
    if (deo) extra.push(deo);
    extra.push(...this.tempestadeNpcs());
    extra.push(...this.estaticosNpcs());
    const azul = rivalNpc(this.st);        // o AZUL aparece quando é a vez dele
    if (azul) extra.push(azul);
    if (this.st.mission && this.st.player.map === "glitchdim") {
      extra.push({ id: "portal", x: 22, y: 30, sprite: "portal", portal: true, dir: "down" });
      (this.st.dimLoot || []).forEach((b, i) => {
        extra.push({ id: `bola${i}`, x: b.x, y: b.y, sprite: "ball", loot: b, dir: "down" });
      });
    }
    const dist = this.distorcaoNpc();
    if (dist) extra.push(dist);
    const balsa = this.marinheiroSevii();
    if (balsa) extra.push(balsa);
    const rasgo = portalAberto(this.st, mapa);
    if (rasgo) extra.push({ id: "rasgo", x: rasgo.x, y: rasgo.y, sprite: "rasgo", raidPortal: true, dir: "down" });
    const f = this.st.fragment;
    if (f && f.map === this.st.player.map && this.hasDetector()) {
      extra.push({ id: "fragmento", x: f.x, y: f.y, sprite: "portal", fragment: true, dir: "down" });
    }
    return extra.length ? [...base, ...extra] : base;
  }

  // ------------------------------------------------- A BALSA DAS SEVII
  /** O marinheiro da balsa: um no cais de VERMILION, um em cada porto de ilha.
   *  É o mesmo NPC nos oito lugares, porque é o mesmo barco. */
  marinheiroSevii() {
    const S = DB.SEVII;
    if (!S) return null;
    const aqui = this.st.player.map;
    if (aqui === S.embarque.mapa) {
      return { id: "balsa", x: S.embarque.x, y: S.embarque.y, dir: "right",
               sprite: "marinheiro", balsa: true, lines: DB.STORY.sevii.fala };
    }
    if ((DB.PORTOS || []).includes(aqui)) {
      return { id: "balsa", x: S.chegada.x - 2, y: S.chegada.y, dir: "right",
               sprite: "marinheiro", balsa: true, lines: DB.STORY.sevii.fala };
    }
    return null;
  }

  /** O menu da balsa: pra onde dá pra ir daqui. A ilha em que você já está não
   *  entra na lista — oferecer o lugar onde a pessoa está é ocupar uma linha
   *  da caixa pra não fazer nada. */
  pegarBalsa() {
    const S = DB.SEVII, T = DB.STORY.sevii;
    const st = this.st;
    if ((st.badges || []).length < (S.requer?.insignias ?? 0)) {
      return void this.dlg.say(T.travado);
    }
    const aqui = st.player.map;
    const destinos = S.ilhas.filter((i) => i.porto !== aqui);
    const rotulos = destinos.map((i) => i.nome);
    const voltar = aqui !== S.embarque.mapa;
    if (voltar) rotulos.push(T.voltar);
    rotulos.push(T.aquiNao);
    this.dlg.ask(T.pergunta, rotulos, (i) => {
      if (i < destinos.length) return this.zarparPara(destinos[i]);
      if (voltar && i === destinos.length) {
        return this.zarparPara({ nome: S.embarque.nome, porto: S.embarque.mapa,
                                 x: S.embarque.x + 1, y: S.embarque.y + 1 });
      }
    });
  }

  /** A travessia. Mesma transição de qualquer viagem: some a tela, troca o
   *  mundo, volta. */
  zarparPara(destino) {
    const S = DB.SEVII, T = DB.STORY.sevii;
    const st = this.st;
    Audio2.tone(392, 0.14, "triangle", 0.5);
    this.dlg.say(T.zarpou, () => {
      this.fx = { t: 0, cb: () => {
        Object.assign(st.player, {
          map: destino.porto,
          x: destino.x ?? S.chegada.x,
          y: destino.y ?? S.chegada.y,
          dir: "down",
        });
        st.surfando = null;
        this.selvagens = [];
        this.compa = null;
        this.justWarped = true;
        this.afterTravel();
        this.game.autosave?.(true);
        this.dlg.say(T.chegou.replace("{ONDE}", destino.nome));
      } };
    });
  }

  /** A DISTORÇÃO DE AGORA. Ela troca de lugar sozinha de tempos em tempos, e a
   *  troca AVISA: um evento que acontece e não se anuncia é um evento que não
   *  acontece — a tela mostra 10 tiles de altura e a ROTA 11 tem 285 de mato.
   *
   *  O aviso é a tarja do canto, e não caixa de diálogo: ela abre enquanto você
   *  anda, e parar o jogo a cada cinco minutos seria pior que não avisar. */
  updateDistorcao() {
    const { trocou } = distorcaoDeAgora(this.st);
    if (!trocou) return;
    this.avisar(DB.STORY.distorcao.abriu.replace("{ONDE}", ondeEla(this.st)));
    Audio2.tone(880, 0.1, "sine", 0.35);
    Audio2.tone(1318, 0.16, "sine", 0.28);
    this.game.autosave?.();
  }

  /** Ela no mapa em que você está — o desenho e o encosto saem daqui. */
  distorcaoNpc() {
    const d = distorcaoAqui(this.st, this.st.player.map);
    if (!d) return null;
    return { id: "distorcao", x: d.x, y: d.y, dir: "down", sprite: "distorcao", distorcao: true };
  }

  /** Encostar nela. O que sai é FÓSSIL VIVO — o argumento inteiro da missão
   *  (ver DISTORCAO em src/data/missoes.js). */
  investigarDistorcao() {
    const D = DB.DISTORCOES;
    const S = DB.STORY.distorcao;
    this.st.flags.distorcaoVista = true;
    // encostada, ela fecha na hora e a próxima já marca hora de abrir
    delete this.st.distorcao;
    this.tremor = 1.2;
    this.clarao = 0.4;
    if (DB.CONFIG?.sustos) { Glitch.hit(2.5); Audio2.glitch(); }
    else { Audio2.tone(147, 0.26, "triangle", 0.5); Audio2.tone(220, 0.3, "sine", 0.35); }
    // eles nascem em volta de você, do mesmo jeito que qualquer selvagem à
    // vista — a distorção não abre batalha, ela SOLTA bicho no mato
    for (let i = 0; i < (D?.quantos || 4); i++) {
      nascer(this.selvagens, this.st.player, () => {
        const id = D.saem[Math.floor(Math.random() * D.saem.length)];
        if (!DB.SPECIES[id]) return null;
        return { mon: createMon(id, randRange(D.nivel[0], D.nivel[1])), glitch: true };
      }, (x, y) => this.daPraSelvagem(x, y));
    }
    this.game.autosave?.();
    this.dlg.say(S.investigou);
  }

  /** o que está esperando do outro lado da fenda */
  bossNpc() {
    const m = this.st.mission;
    if (!m || this.st.player.map !== "glitchdim") return null;
    if (this.st.npcState["glitchdim.boss"]?.defeated) return null;
    const info = DB.STORY.missions[m.n];
    if (!info) return null;
    const sp = DB.SPECIES[info.boss.id];
    return {
      id: "boss", x: 22, y: 20, dir: "down", sprite: `mon:${info.boss.id}`,
      boss: { ...info.boss, kind: info.kind, name: sp.name },
      lines: info.intro,
    };
  }

  /** DEOXYS de BIRTH ISLAND: fica na ilha, mudando de forma e de lugar, até
   *  você capturar. Derrubar não resolve — ele se remonta. */
  deoxysNpc() {
    if (this.st.player.map !== "birth_island") return null;
    const formas = DB.DEOXYS_FORMS || ["deoxys"];
    if (formas.some((id) => this.st.caught[id])) return null;     // capturado: acabou
    const d = (this.st.deoxys ||= { forma: 0, ponto: 0, voltas: 0 });
    const id = formas[d.forma % formas.length];
    const pontos = this.map.deoxysSpots || DEOXYS_PONTOS;
    const p = pontos[d.ponto % pontos.length];
    return {
      id: "deoxys", x: p.x, y: p.y, dir: "down", sprite: `mon:${id}`,
      boss: { id, lvl: 30 + d.voltas * 3 },        // volta um pouco mais forte
      lines: [...DB.STORY.deoxys.intro, DB.STORY.deoxys.formas?.[id]].filter(Boolean),
    };
  }

  /** derrubou mas não capturou: ele reaparece com outro corpo, em outro canto */
  deoxysVolta() {
    if (this.st.player.map !== "birth_island") return;
    const chave = "birth_island.deoxys";
    if (!this.st.npcState[chave]?.defeated) return;
    const formas = DB.DEOXYS_FORMS || ["deoxys"];
    if (formas.some((id) => this.st.caught[id])) return;          // capturado: fica quieto
    delete this.st.npcState[chave];
    const d = (this.st.deoxys ||= { forma: 0, ponto: 0, voltas: 0 });
    d.forma = (d.forma + 1) % formas.length;
    const pontos = this.map.deoxysSpots || DEOXYS_PONTOS;
    d.ponto = (d.ponto + 1 + (d.voltas % 2)) % pontos.length;
    d.voltas++;
    Glitch.hit(2);
    Audio2.glitch();
    this.game.autosave?.();
    this.dlg.say(DB.STORY.deoxys.volta);
  }

  escortNpc(e) {
    return {
      id: "assistente_escolta", x: e.x, y: e.y, dir: e.dir || "down",
      sprite: "cientista", escort: true,
      lines: porInsignia(e.stage === "atLab" ? DB.STORY.escort.waiting : DB.STORY.escort.found,
                         this.st.badges.length),
    };
  }

  npcAt(x, y) {
    return this.npcsHere().find((n) => {
      if (this.st.npcState[`${this.st.player.map}.${n.id}`]?.hidden) return false;
      return n.x === x && n.y === y;
    });
  }
  blocked(x, y) {
    const t = this.tagAt(x, y);
    if (t < 0 || t === DB.TAG.BLOCK || t >= 4) return true;
    // água só passa surfando; e surfando só dá pra sair pra chão firme
    if (t === DB.TAG.WATER && !this.st.surfando) return true;
    if (this.obstaculoEm(x, y)) return true;
    return !!this.npcAt(x, y);
  }

  /** PAROU NA ÁGUA SEM ESTAR SURFANDO.
   *
   *  Não deveria dar: a água só passa surfando. Mas dá pra cair nesse estado
   *  por fora do caminho normal — abrindo o jogo num endereço com x e y no
   *  mar, voltando de uma viagem de barco pra um ponto que virou água, ou com
   *  um save de quando o mapa tinha outro formato. E aí o personagem fica DE
   *  PÉ em cima do mar: sem Pokémon embaixo, sem encontro de água, andando
   *  como se fosse chão.
   *
   *  Então o jogo ajeita na hora que o mapa aparece: se tem alguém na equipe
   *  pra te carregar, você já entra surfando; se não tem ninguém de pé, ele te
   *  devolve pro chão firme mais perto (sem cair em cima de uma porta). */
  ajeitarNaAgua() {
    const p = this.st.player;
    if (this.st.surfando || this.tagAt(p.x, p.y) !== DB.TAG.WATER) return;
    const mon = this.quemSabe("surfar") || this.st.party.find((m) => m.hp > 0);
    if (mon) return void (this.st.surfando = mon.species);
    for (let r = 1; r <= 16; r++) {                  // do mais perto pro mais longe
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
          const x = p.x + dx, y = p.y + dy;
          if (this.blocked(x, y) || this.warpAt(x, y)) continue;
          p.x = x; p.y = y;
          this.snapCamera();
          return;
        }
      }
    }
  }

  /** primeiro da equipe que sabe o golpe (e ainda está de pé) */
  quemSabe(golpe) {
    return this.st.party.find((m) => m.hp > 0 && m.moves.some((mv) => mv.id === golpe)) || null;
  }
  warpAt(x, y) { return (this.geo?.warps || []).find((w) => w.x === x && w.y === y); }
  facing() {
    const p = this.st.player;
    const d = DIRS[p.dir];
    return { x: p.x + d[0], y: p.y + d[1] };
  }
  /** posição em pixel; `withHop` só pro desenho — a câmera ignora o arco do pulo */
  playerPixel(withHop = false) {
    const p = this.st.player;
    let px = p.x * TILE, py = p.y * TILE;
    if (this.move) {
      // interpola do tile ATUAL em direção ao destino (p.x/p.y só mudam no fim
      // do passo). Usar (k-1) desenhava o jogador um tile à frente e estalava
      // de volta ao terminar — era isso que fazia a tela tremer a cada passo.
      const k = this.move.n / this.move.total;      // fração exata: sem sub-pixel
      px += this.move.dx * TILE * k;
      py += this.move.dy * TILE * k;
      if (withHop && this.move.hop) py -= Math.round(Math.sin(k * Math.PI) * 12);
    }
    return { px, py };
  }
  snapCamera() {
    const g = this.geo;
    if (!g) return;
    const { px, py } = this.playerPixel();
    const mw = g.w * TILE, mh = g.h * TILE;
    // sempre inteira: câmera fracionária faz a tela tremer ao rolar
    this.cam.x = Math.round(mw <= W ? (mw - W) / 2 : Math.max(0, Math.min(mw - W, px + TILE / 2 - W / 2)));
    this.cam.y = Math.round(mh <= H ? (mh - H) / 2 : Math.max(0, Math.min(mh - H, py + TILE / 2 - H / 2)));
  }

  // -------------------------------------------------------------- update
  update(dt) {
    this.banner = Math.max(0, this.banner - dt);
    this.invuln = Math.max(0, (this.invuln || 0) - dt);
    this.tremor = Math.max(0, (this.tremor || 0) - dt * 3);
    this.clarao = Math.max(0, (this.clarao || 0) - dt * 2.4);
    if (this.aviso) { this.aviso.t -= dt; if (this.aviso.t <= 0) this.aviso = null; }
    if (this.olhando) this.olhando.t += dt;
    Glitch.level = this.st.corruption;
    // O RASGO suja a tela inteira enquanto estiver aberto neste mapa: seis
    // vezes o normal, e ligado à força mesmo com o glitchMode desligado. É o
    // único aviso de que um abriu — não tem texto nem seta, você vê a tela
    // estragar e vai procurar.
    // A TELA CORROMPENDO PERTO DO RASGO É SUSTO, e sai com `CONFIG.sustos`
    // desligado. Era o efeito mais forte que a raid tinha: a tela ia se
    // estragando sozinha conforme você chegava perto, e ainda dava solavancos em
    // horas que ninguém escolhia. Sem ele o rasgo continua abrindo no mesmo
    // lugar e na mesma hora — você acha ele olhando, e não sentindo a tela
    // apodrecer.
    const rasgo = DB.CONFIG?.sustos ? portalAberto(this.st, this.st.player.map) : null;
    if (rasgo) {
      Glitch.forced = true;
      Glitch.level = corrupcaoDoPortal(this.st, this.st.player.map);
      this.rasgoForcou = true;
      // e ele PULSA: quanto mais perto, mais vezes a tela dá um solavanco.
      const perto = pertoDoPortal(this.st, this.st.player.map);
      if (perto > 0 && Math.random() < dt * 3 * perto) Glitch.hit(0.5 * perto);
    } else if (this.rasgoForcou) {
      // Quando o rasgo fecha, o `forced` volta RECALCULADO das fontes, e não de
      // um valor guardado lá atrás. Guardar estava errado: entre abrir e fechar
      // o rasgo dá tempo de o mundo quebrar (o finale do professor), de
      // desquebrar (capturar o MISSINGNO.) ou de você entrar na fenda — e um
      // `false` guardado antes desfazia qualquer um dos três, apagando a
      // corrupção que a história tinha acabado de ligar.
      this.rasgoForcou = false;
      Glitch.forced = !!(this.st.flags?.glitchWorld || this.st.mission);
    }
    Online.mandaPos(dt, this.st.player, !!this.move);
    this.updateWander(dt);
    this.updateDistorcao();
    this.updateSelvagens(dt);
    // A VIDA VOLTA ANDANDO, devagar, e só quando ninguém está te caçando. Sem
    // isso, uma pancada no começo do jogo te seguiria até o próximo Centro; com
    // regeneração durante a perseguição, apanhar não custaria nada.
    if (this.invuln <= 0 && !this.selvagens.some((b) => cacando(b, this.st.player))) {
      const max = this.vidaMax();
      if (this.vidaAgora() < max) {
        this.st.vida = Math.min(max, this.st.vida + (DB.CONFIG?.selvagens?.curaPorSegundo ?? 0.6) * dt);
      }
    }
    this.updateFragmentTimer();
    if (this.rustle) {
      this.rustle.t += dt;
      if (this.rustle.t > 0.36) this.rustle = null;
    }
    if (this.fx) {
      this.fx.t += dt;
      if (this.fx.t >= 0.95) { const cb = this.fx.cb; this.fx = null; cb?.(); }
      return;
    }

    if (this.fadeDir) {
      this.fadeA += this.fadeDir * dt * 3.2;
      if (this.fadeDir > 0 && this.fadeA >= 1) { this.fadeA = 1; this.fadeDir = -1; this.pending?.(); this.pending = null; }
      else if (this.fadeDir < 0 && this.fadeA <= 0) { this.fadeA = 0; this.fadeDir = 0; }
      return;
    }
    if (this.dlg.update(dt)) return;
    if (this.menu) return this.updateMenu(dt);

    if (this.move) {
      this.move.n++;
      if (this.move.n >= this.move.total) {
        const p = this.st.player;
        p.x += this.move.dx; p.y += this.move.dy;
        this.move = null;
        this.stepParity ^= 1;
        this.onArrive();
      }
      this.snapCamera();
      return;
    }

    if (Input.consume("b")) return this.openMenu();
    if (Input.consume("a")) return this.interact();
    if (Input.consume("ceu")) return this.olharOCeu();

    const p = this.st.player;
    const dir = Input.dir();
    if (!dir) {
      this.turnT = 0;
    } else if (dir !== p.dir) {
      p.dir = dir;              // primeiro vira no lugar, como no original
      this.turnT = TURN;
    } else if (this.turnT > 0) {
      this.turnT--;
    } else {
      this.tryStep(dir);
    }

    this.bumpCd = Math.max(0, (this.bumpCd || 0) - dt);
  }

  tryStep(dir) {
    const p = this.st.player;
    p.dir = dir;
    const [dx, dy] = DIRS[dir];
    const nx = p.x + dx, ny = p.y + dy;

    // saindo por uma porta em que já estou parado: só andando pra baixo,
    // que é como se sai de qualquer prédio no FireRed
    if (dir === "down") {
      const standing = this.warpAt(p.x, p.y);
      if (standing && this.blocked(nx, ny)) return this.useWarp(standing);
    }

    // porta: no FireRed o tile da porta é sólido, o warp vem antes da colisão
    const target = this.warpAt(nx, ny);
    if (target) return this.useWarp(target);

    // borda do mapa: conexão com o mapa vizinho (vila <-> rota <-> cidade)
    if (this.tagAt(nx, ny) === -1) {
      const conn = (this.geo.connections || []).find((c) => c.dir === dir && c.to);
      if (conn) return this.useConnection(conn, dir);
    }

    // barranco: só dá pra pular no sentido dele
    const ledge = DB.LEDGE_DIR[this.tagAt(nx, ny)];
    if (ledge === dir && !this.blocked(nx + dx, ny + dy)) {
      Audio2.tone(700, 0.06, "square", 0.6);
      this.move = { dx: dx * 2, dy: dy * 2, n: 0, total: passo(HOP), hop: true };
      return;
    }
    const obst = this.obstaculoEm(nx, ny);
    if (obst?.tipo === "bloco" && this.st.forcaOn && this.quemSabe("forca")) {
      return this.empurrar(obst, dx, dy);
    }
    if (this.blocked(nx, ny)) {
      // encostar no rasgo não dá esbarrão: ele puxa. É a única coisa no mapa
      // que responde ao ESBARRO em vez de esperar você apertar Z, e é de
      // propósito — quem anda pra cima de um buraco no ar já decidiu.
      const alvo = this.npcAt(nx, ny);
      if (alvo?.distorcao) return this.investigarDistorcao();
      if (alvo?.raidPortal) return this.entrarNoRasgo();
      if (!this.bumpCd) { Audio2.bump(); this.bumpCd = 0.35; }
      return;
    }
    this.move = { dx, dy, n: 0, total: passo(Input.held("run") ? RUN : WALK) };
  }

  onArrive() {
    const p = this.st.player;
    const warp = this.warpAt(p.x, p.y);
    if (warp && !this.justWarped) return this.useWarp(warp);
    if (!warp) this.justWarped = false;

    if (this.st.surfando && this.tagAt(p.x, p.y) !== DB.TAG.WATER) {
      this.st.surfando = null;              // pisou em terra firme
      Audio2.tone(659, 0.05); Audio2.tone(523, 0.08);
    }
    if (this.tagAt(p.x, p.y) === DB.TAG.GRASS) this.rustle = { x: p.x, y: p.y, t: 0 };

    if (this.pisouNasFlores()) return;
    if (this.pisouNumSelvagem()) return;

    // O SORTEIO INVISÍVEL POR PASSO NÃO EXISTE MAIS, aqui nem na fenda. O que
    // começa batalha selvagem é encostar: você num bicho, ou um bravo em você.
    this.talvezRasgar();
    this.checkTrainerSight();
  }

  // ------------------------------------------------- SELVAGENS À VISTA
  /** Onde um selvagem pode estar em pé: grama alta, sem nada nem ninguém em
   *  cima. Grama alta e só: é onde eles moram no jogo inteiro, e um bicho
   *  selvagem parado no meio do caminho de terra seria outra coisa. */
  daPraSelvagem(x, y) {
    return this.tagAt(x, y) === DB.TAG.GRASS
      && !this.obstaculoEm(x, y) && !this.npcAt(x, y) && !this.warpAt(x, y)
      && !emCima(this.selvagens, x, y)
      && !(x === this.st.player.x && y === this.st.player.y);
  }

  /** Por onde um BRAVO passa enquanto caça: qualquer chão que dê pra pisar, e
   *  não só o mato. Ele mora na grama, mas sai dela pra te alcançar — foi pra
   *  isso que ele veio. */
  podeCacar(x, y) {
    const tag = this.tagAt(x, y);
    return (tag === DB.TAG.GRASS || tag === DB.TAG.FREE)
      && !this.obstaculoEm(x, y) && !this.npcAt(x, y) && !this.warpAt(x, y)
      && !emCima(this.selvagens, x, y);
  }

  /** Eles andam e nascem sozinhos. Nada disso vai pro save: é cenário vivo. */
  updateSelvagens(dt) {
    const st = this.st;
    // Dentro de casa e no mar não tem grama pra eles morarem, e com a equipe
    // toda caída não faz sentido pôr batalha na frente do jogador. A FENDA
    // ENTRA: ela é marcada `interior` porque não tem céu, mas tem mato e é lá
    // que os bichos dela moram — desde que o encontro por passo acabou, sem eles
    // à vista a fenda ficaria sem nenhum encontro.
    const naFenda = st.player.map === "glitchdim";
    if ((this.map?.interior && !naFenda) || st.surfando
        || !st.party.some((m) => m.hp > 0)) {
      if (this.selvagens.length) this.selvagens = [];
      return;
    }
    const passo = andar(this.selvagens, dt, st.player,
                        (x, y) => this.daPraSelvagem(x, y), (x, y) => this.podeCacar(x, y));
    this.selvagens = passo.vivos;
    // um BRAVO chegou em você: ele BATE (não abre batalha)
    if (passo.encostou) this.levarBote(passo.encostou);
    this.nascerT -= dt;
    if (this.nascerT <= 0) {
      // O SANDUÍCHE REFRESCANTE agora rareia os bichos à vista. Ele cortava o
      // sorteio invisível por passo; como em Kanto o encontro passou a ser o
      // encostão, ele tinha que passar junto — senão o item continuava na loja
      // sem fazer nada do lado de fora da fenda.
      const calma = Math.max(0.15, fator(this.st, "calmaria"));
      this.nascerT = (DB.CONFIG?.selvagens?.nascer ?? 2) / calma;
      // o sorteio é o mesmo de sempre — MISSINGNO., corrompido, shiny e a fusão
      // selvagem saem daqui, agora em pé no mato em vez de aparecendo do nada
      nascer(this.selvagens, st.player, (x, y) => this.sortearSelvagem(x, y),
             (x, y) => this.daPraSelvagem(x, y));
    }
  }

  /** O BOTE, como nos LEGENDS. O bravo que te alcança NÃO abre batalha: ele
   *  bate ali mesmo, no mapa, e pula pra trás.
   *
   *  Abrir batalha ao encostar tirava do jogador a única coisa que ele ganhou
   *  quando os bichos ficaram visíveis: DECIDIR. Do jeito novo, tomar pancada é
   *  a consequência de não ter corrido, e lutar continua sendo escolha sua — é
   *  você que encosta nele. */
  levarBote(b) {
    const st = this.st;
    if ((this.invuln || 0) > 0) return;          // carência: nada de te moerem
    const C = DB.CONFIG?.selvagens || {};
    const S = DB.STORY.selvagem;
    this.invuln = C.respiro ?? 2.2;
    // QUEM APANHA É VOCÊ. Antes o dano ia no líder da equipe, e isso fazia do
    // Pokémon do seu lado um ESCUDO — ele é seu companheiro, não sua armadura.
    // E a conta ficava errada nos dois sentidos: com a equipe cheia você tinha
    // seis vidas contra um pidgey, e com um bicho fraco na frente você perdia
    // ele por andar no mato.
    const dano = Math.max(1, C.dano ?? 4);
    st.vida = Math.max(0, this.vidaAgora() - dano);
    this.tremor = 1;
    this.clarao = 0.35;
    Audio2.hit();
    Glitch.hit(0.5);
    this.empurrarSelvagem(b);
    const quem = DB.SPECIES[b.mon.species]?.name || b.mon.species;
    this.avisar(S.bote.replace("{BICHO}", quem).replace("{N}", dano));
    this.game.autosave?.();
    if (st.vida <= 0) this.apagarNoMato();
  }

  /** A sua vida agora. `vida` nasce nula (save antigo, jogo novo) e enche na
   *  primeira vez que alguém pergunta: assim ninguém precisa migrar save. */
  vidaAgora() {
    const st = this.st;
    const max = DB.CONFIG?.selvagens?.vidaMax ?? 24;
    if (st.vida == null || st.vida > max) st.vida = max;
    return st.vida;
  }
  vidaMax() { return DB.CONFIG?.selvagens?.vidaMax ?? 24; }

  /** Depois de bater ele PULA PRA TRÁS. Sem isso ele fica colado em você e o
   *  respiro só adia a próxima pancada — com o pulo, o respiro vira a janela em
   *  que dá pra sair de perto. */
  empurrarSelvagem(b) {
    const p = this.st.player;
    const dx = Math.sign(b.x - p.x) || (Math.random() < 0.5 ? 1 : -1);
    const dy = Math.sign(b.y - p.y);
    for (let i = 0; i < (DB.CONFIG?.selvagens?.recuo ?? 3); i++) {
      const nx = b.x + dx, ny = b.y + dy;
      if (!this.podeCacar(nx, ny)) break;
      b.x = nx; b.y = ny;
    }
    b.t = Math.max(b.t, DB.CONFIG?.selvagens?.respiro ?? 2.2);
  }

  /** Um recado curto no alto da tela. NÃO é caixa de diálogo de propósito: uma
   *  caixa modal a cada pancada pararia o jogo toda vez que você apanha, e
   *  apanhar tem que ser uma coisa que acontece ENQUANTO você foge. */
  avisar(txt) { this.aviso = { txt, t: 2 }; }

  /** Caiu a equipe inteira no mato. Mesmo fim da batalha perdida: todo mundo
   *  curado, de volta pro último lugar seguro, e a corrupção sobe um pouco. */
  apagarNoMato() {
    const st = this.st;
    st.party.forEach(heal);
    st.vida = this.vidaMax();
    st.surfando = null;
    const back = st.respawn || { map: DB.START_MAP, ...DB.MAPS[DB.START_MAP].spawn };
    Object.assign(st.player, { map: back.map, x: back.x, y: back.y, dir: back.dir || "down" });
    st.corruption = Math.min(100, st.corruption + 3);
    this.selvagens = [];
    this.compa = null;
    this.aviso = null;
    this.justWarped = true;
    this.afterTravel();
    this.game.autosave?.();
    this.dlg.say(DB.STORY.selvagem.apagou);
  }

  /** Começa a batalha com aquele bicho e tira ele do mapa. Só por ENCOSTO seu:
   *  o bravo que te alcança bate (ver `levarBote`). */
  encontrarSelvagem(b) {
    this.selvagens = this.selvagens.filter((o) => o !== b);
    if (b.bravo) { Audio2.bump(); this.rustle = { x: b.x, y: b.y, t: 0 }; }
    this.startBattle(encontroDe(b));
  }

  /** O bicho que nasce naquele tile. Em Kanto é o sorteio de sempre; dentro da
   *  fenda é o dela, que olha o TERRENO debaixo do tile (ar, terra ou água) —
   *  cada um tem a sua tabela e o seu lendário. */
  sortearSelvagem(x, y) {
    const st = this.st;
    if (st.player.map !== "glitchdim") {
      return rollEncounter(st.player.map, st.corruption, !!st.flags.glitchWorld,
                           fator(st, "sorte"));
    }
    const solo = this.geo?.terrain?.[y * this.geo.w + x];
    return rollDimEncounter(solo === "a" ? "ar" : solo === "g" ? "agua" : "terra", st);
  }

  /** Pisou em cima de um: a batalha é com AQUELE, e ele sai do mapa. Devolve
   *  true quando tomou conta do passo. */
  pisouNumSelvagem() {
    const b = emCima(this.selvagens, this.st.player.x, this.st.player.y);
    if (!b) return false;
    this.encontrarSelvagem(b);
    return true;
  }

  // ------------------------------------------------- O COMPANHEIRO
  /** Quem está te seguindo: o primeiro da equipe que ainda está de pé. Caiu
   *  todo mundo, ninguém segue — e a tela fica dizendo isso sem uma linha de
   *  texto. */
  quemSegue() {
    return this.st.party?.find((m) => m.hp > 0) || null;
  }

  /** O passo do companheiro começa no MESMO quadro que o seu.
   *
   *  O GANCHO FICA NO DESENHO, e não no update, porque o movimento é CRIADO no
   *  fim do update: uma checagem no começo dele perde justamente o quadro em
   *  que o passo nasceu. Nesse quadro o companheiro era desenhado com os dados
   *  do passo ANTERIOR — dois tiles atrás — e pulava pro lugar no quadro
   *  seguinte. Era esse o estalo, e é o mesmo defeito que o jogador já teve (a
   *  conta do `playerPixel` tem a anotação disso).
   *
   *  A marca vai no próprio `move`: ele nasce e morre com o passo, então não
   *  existe estado pra limpar nem jeito de sincronizar duas vezes o mesmo. */
  sincronizarCompanheiro() {
    if (!this.move || this.move.compaOk) return;
    this.move.compaOk = true;
    const p = this.st.player;
    this.moverCompanheiro(p.x, p.y, this.move.dx, this.move.dy);
  }

  /** Põe o companheiro andando pro tile que o jogador está DEIXANDO (aqui o
   *  `player.x/y` ainda é o de trás, que é exatamente o que ele precisa). */
  moverCompanheiro(x, y, dx, dy) {
    const dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up");
    // primeira vez: ele sai de debaixo do jogador, e não do canto do mapa
    if (!this.compa) this.compa = { x, y, de: { x, y }, dir };
    else this.compa = { x, y, de: { x: this.compa.x, y: this.compa.y }, dir };
  }

  /** O RASGO abrindo. Ele é NO CHÃO, e não tem nada a ver com grama alta: o
   *  mato dar bicho já existe, e o que o rasgo faz é o chão dar chefe. Por isso
   *  ele rola em qualquer passo dado do lado de fora e nasce em chão andável —
   *  nunca no mato, que é onde o jogo já tem outra coisa acontecendo.
   *
   *  Só depois que A FENDA FOI ABERTA pelo menos uma vez (`dimUnlocked`, que a
   *  máquina do laboratório liga na primeira viagem). Antes disso não existe de
   *  onde vazar, e um buraco no chão de Kanto limpa não é um susto, é um bug.
   *
   *  ISTO JÁ FOI `glitchWorld`, E ERA ERRADO: aquela flag só acende no finale,
   *  depois das oito insígnias, então a raid inteira ficava trancada atrás do
   *  jogo terminado. Uma coisa que se acha andando não pode estrear no último
   *  capítulo — quem chegou lá já não precisa dela.
   *
   *  Um por vez, nunca dentro de casa e nunca dentro da própria fenda — lá não
   *  faz sentido rasgar o que já é rasgo. */
  talvezRasgar() {
    const st = this.st;
    if (!st.flags?.dimUnlocked && !st.flags?.glitchWorld) return;
    if (st.player.map === "glitchdim" || this.map?.interior) return;
    if (portalAberto(st, st.player.map)) return;
    if (!temPortal(st, st.player.map)) return;
    // A lista de NPCs é montada UMA vez pra busca inteira. Antes o `livre`
    // chamava `blocked` e `npcAt`, e cada um deles remonta a lista do mapa: com
    // até 120 tentativas isso era montar a lista duzentas e quarenta vezes num
    // quadro só, e o passo engasgava toda vez que um rasgo ia abrir.
    const npcs = this.npcsHere();
    const ocupado = (x, y) => npcs.some((n) => n.x === x && n.y === y);
    // E ele não abre em CORREDOR. Um rasgo tapa o tile onde está, e encostar
    // nele começa a raid: num tile de passagem de largura 1 ele vira uma parede
    // que só se atravessa lutando com um chefe de nível 35 a 55. Exigir três
    // vizinhos livres garante que ele nasça em lugar aberto, onde dá pra passar
    // ao lado e voltar depois — a raid é um convite, não um pedágio.
    const livre = (x, y) => this.tagAt(x, y) === DB.TAG.FREE
      && !this.obstaculoEm(x, y) && !ocupado(x, y) && !this.warpAt(x, y);
    const aberto = abrirPortal(st, st.player.map, (x, y) =>
      livre(x, y) && [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dy]) => livre(x + dx, y + dy)).length >= 3);
    if (!aberto) return;
    // com susto, o estouro de ruído de sempre; sem, um sino curto — você ainda
    // sabe que abriu, mas ninguém pula da cadeira
    if (DB.CONFIG?.sustos) { Glitch.hit(2.5); Audio2.glitch(); }
    else { Audio2.tone(880, 0.09, "sine", 0.4); Audio2.tone(1174, 0.14, "sine", 0.3); }
    // o aviso só na primeira vez da partida; depois disso a tela estragando
    // já diz tudo, e uma caixa de texto a cada rasgo viraria castigo
    if (!st.flags.rasgoVisto) {
      st.flags.rasgoVisto = true;
      this.dlg.say(DB.STORY.glitch.rasgoPrimeiro);
    }
  }

  /** Entrar no rasgo: o chefe passa pro nosso lado. A tabela é a da FENDA — o
   *  bicho é de lá, o rasgo é só por onde ele coube. */
  entrarNoRasgo() {
    const chefe = montarChefe(DB.DIM_ENCOUNTERS?.terra || []);
    fecharPortal(this.st);
    if (!chefe) return void this.dlg.say(DB.STORY.glitch.rasgoVazio);
    if (DB.CONFIG?.sustos) { Glitch.hit(3); Audio2.glitch(); }
    else Audio2.select();
    this.dlg.say(DB.STORY.glitch.rasgoEntrou, () => {
      this.startBattle({ mon: chefe.mon, glitch: true, raid: chefe });
    });
  }

  /** Canteiro de flores com o mundo bugado: a tela treme a cada passo e
   *  MISSINGNO. sobe de dentro dele. Devolve true quando tomou conta do passo. */
  pisouNasFlores() {
    const p = this.st.player;
    if (!this.map.flores?.includes(`${p.x},${p.y}`)) return false;
    if (!this.st.flags.glitchWorld) return false;          // só depois que o mundo quebra
    Glitch.hit(0.8);
    if (!this.st.flags.floresVistas) {                     // o aviso vem antes do primeiro
      this.st.flags.floresVistas = true;
      Audio2.glitch();
      this.dlg.say(DB.STORY.flores.primeira);
      return true;
    }
    if (!this.st.party.some((m) => m.hp > 0)) return false;
    if (Math.random() >= (this.map.floresChance ?? 0.3)) return false;
    const enc = rollFlores();
    if (!enc) return false;
    this.dlg.say(DB.STORY.flores.encontrou, () => this.startBattle(enc));
    return true;
  }

  useWarp(w) {
    const fromMap = this.st.player.map;
    if (!w.to) {
      const msg = this.map.lockedWarps?.[`${w.x},${w.y}`];
      return void this.dlg.say(msg || "A PORTA ESTÁ TRANCADA.");
    }
    this.justWarped = true;
    Audio2.tone(440, 0.05);
    const dest = DB.KANTO[w.to];
    const dw = dest.warps[w.toWarp] || dest.warps[0] || { x: 0, y: 0 };
    this.transition(() => {
      const p = this.st.player;
      p.map = w.to; p.x = dw.x; p.y = dw.y;
      p.dir = DB.MAPS[w.to].interior ? "up" : "down";
      this.afterTravel();
      // primeira saída de casa: a mãe corre atrás com os doces
      if (fromMap === "home" && w.to === "pallet" && !this.st.flags.momGift) {
        this.st.flags.momGift = true;
        const g = DB.STORY.momGift;
        this.dlg.say(g.lines, () => {
          this.st.items[g.item] = Math.min(999, (this.st.items[g.item] || 0) + g.qty);
          Audio2.heal();
          this.dlg.say(g.got);
        });
      }
    });
  }

  useConnection(conn, dir) {
    const dest = DB.KANTO[conn.to];
    const p = this.st.player;
    this.justWarped = true;
    this.transition(() => {
      if (dir === "up") { p.y = dest.h - 1; p.x = p.x - conn.offset; }
      else if (dir === "down") { p.y = 0; p.x = p.x - conn.offset; }
      else if (dir === "left") { p.x = dest.w - 1; p.y = p.y - conn.offset; }
      else { p.x = 0; p.y = p.y - conn.offset; }
      p.map = conn.to;
      p.x = Math.max(0, Math.min(dest.w - 1, p.x));
      p.y = Math.max(0, Math.min(dest.h - 1, p.y));
      this.afterTravel();
    });
  }

  /** Depois da PRIMEIRA INSÍGNIA (Brock): a Pokédex apita sozinha e o bug se
   *  anuncia. Antes disso o mundo roda limpo — e os fragmentos de portal, que
   *  dependem deste aviso, também só começam a aparecer daqui pra frente. */
  checkPokedexAlert() {
    const st = this.st;
    if (st.flags.pokedexMsg) return;
    const primeira = DB.STORY.badges?.[0]?.id || "pedra";
    if (!st.badges?.includes(primeira)) return;
    st.flags.pokedexMsg = true;
    const a = DB.STORY.pokedexAlert;
    Audio2.glitch();
    Glitch.hit(1.6);
    this.dlg.say([a.beep, a.message, a.after]);
  }

  hasDetector() { return (this.st.items[DB.STORY.detector.item] || 0) > 0; }

  /** leitura do detector: nível médio de cada terreno da dimensão */
  detectorReading() {
    const avg = (list) => {
      if (!list?.length) return 0;
      const w = list.reduce((a, e) => a + e.w, 0) || 1;
      return Math.round(list.reduce((a, e) => a + ((e.min + e.max) / 2) * e.w, 0) / w);
    };
    const t = avg(DB.DIM_ENCOUNTERS?.terra), g = avg(DB.DIM_ENCOUNTERS?.agua), a = avg(DB.DIM_ENCOUNTERS?.ar);
    const media = Math.round((t + g + a) / 3);
    return DB.STORY.detector.reading
      .replace("{MEDIA}", media).replace("{TERRA}", t).replace("{AGUA}", g).replace("{AR}", a);
  }

  /** espalha um fragmento de portal pelos pontos de spawn do mapa */
  rollFragment() {
    const st = this.st;
    if (!st.flags.pokedexMsg || st.flags.glitchWorld) return;
    if (st.player.map === "glitchdim") return;
    if (st.fragment?.map === st.player.map) return;
    st.fragment = null;

    // A chance sobe a cada mapa em que você entra. Chegou nos 100%, o fragmento
    // é garantido — e assim que ele aparece garantido, ela cai pra SPOT_RESET.
    const p = Math.min(1, st.fragChance ?? DB.SPOT_CHANCE ?? 0.5);
    const sure = p >= 1;
    const bump = () => {
      st.fragChance = sure && st.fragment
        ? (DB.SPOT_RESET ?? 0.49)
        : Math.min(1, p + (DB.SPOT_STEP ?? 0.07));
    };

    const spots = this.fragmentSpots();
    if (spots.length) {
      // o primeiro ponto que passar no sorteio fica com o fragmento
      for (let i = spots.length - 1; i > 0; i--) {         // embaralha
        const j = Math.floor(Math.random() * (i + 1));
        [spots[i], spots[j]] = [spots[j], spots[i]];
      }
      for (const c of spots) {
        if (Math.random() < p) {
          st.fragment = { map: st.player.map, x: c.x, y: c.y };
          break;
        }
      }
      return bump();
    }

    // mapa sem ponto definido: sorteio livre, bem mais raro (o garantido vale aqui também)
    if (!sure && Math.random() > (DB.FALLBACK_CHANCE ?? 0.08)) return bump();
    const g = this.geo;
    for (let tries = 0; tries < 60; tries++) {
      const x = 1 + Math.floor(Math.random() * (g.w - 2));
      const y = 1 + Math.floor(Math.random() * (g.h - 2));
      if (this.freeForFragment(x, y)) {
        st.fragment = { map: st.player.map, x, y };
        break;
      }
    }
    return bump();
  }

  /** pontos fixos do mapa + os tiles ao lado de cada placa */
  fragmentSpots() {
    const id = this.st.player.map;
    const out = [];
    for (const c of DB.FRAGMENT_SPOTS?.[id] || []) {
      if (this.freeForFragment(c.x, c.y)) out.push(c);
    }
    if (DB.NEAR_SIGNS !== false) {
      for (const sg of this.geo.signs || []) {
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const x = sg.x + dx, y = sg.y + dy;
          if (this.freeForFragment(x, y) && !out.some((c) => c.x === x && c.y === y)) {
            out.push({ x, y });
            break;   // um tile por placa
          }
        }
      }
    }
    return out;
  }

  freeForFragment(x, y) {
    const t = this.tagAt(x, y);
    if (t !== DB.TAG.FREE && t !== DB.TAG.GRASS) return false;
    if (this.npcAt(x, y)) return false;
    if (this.warpAt(x, y)) return false;
    return !(x === this.st.player.x && y === this.st.player.y);
  }

  afterTravel() {
    if (DB.FLY_SPOTS?.[this.st.player.map]) {     // cidade nova: libera o VOAR
      this.st.visitado ||= {};
      this.st.visitado[this.st.player.map] = true;
    }
    this.ensureDimLoot();
    this.checkPokedexAlert();
    this.rollFragment();
    this.mapaVisto = this.st.player.map;
    this.banner = 2.2;
    this.ajeitarNaAgua();
    this.snapCamera();
    this.game.music(this.map.music);
    mapArt(this.st.player.map);
    this.game.autosave?.();          // trocou de mapa: grava
  }

  transition(cb) { this.fadeDir = 1; this.pending = cb; }

  startBattle(enc) {
    Audio2.stopLoop();
    // a entrada na batalha de raid: o estouro também é susto
    if (enc.raid && DB.CONFIG?.sustos) { Glitch.hit(3); Audio2.glitch(); }
    if (enc.glitch) { Glitch.hit(2); Audio2.glitch(); }
    Audio2.tone(880, 0.08); Audio2.tone(660, 0.12);
    this.fx = { t: 0, cb: () => this.game.scenes.push(new BattleScene(),
      { foe: enc.mon, glitch: enc.glitch, raid: enc.raid }) };
  }

  /** Treinador que te vê passar na frente: ele chama, você decide.
   *  Parede, água e outro NPC cortam a linha de visão; mato alto não. */
  checkTrainerSight() {
    const st = this.st, p = st.player;
    if (this.fx || this.menu || this.dlg.active || !st.party.some((m) => m.hp > 0)) return;
    for (const npc of this.npcsHere()) {
      if (!npc.trainer) continue;
      const key = `${p.map}.${npc.id}`;
      const state = (st.npcState[key] ||= {});
      if (state.defeated || state.refused) continue;   // já venceu ou já disse não
      const [dx, dy] = DIRS[npc.dir || "down"];
      for (let i = 1; i <= (npc.trainer.sight ?? 4); i++) {
        const x = npc.x + dx * i, y = npc.y + dy * i;
        if (x === p.x && y === p.y) {
          p.dir = OPPOSITE[npc.dir || "down"];
          Audio2.tone(988, 0.07); Audio2.tone(1319, 0.12);   // o "!" do original
          this.offerBattle(npc, key, state);
          return;
        }
        const t = this.tagAt(x, y);
        if (t < 0 || t === DB.TAG.BLOCK || t === DB.TAG.WATER || this.npcAt(x, y)) break;
      }
    }
  }

  /** O treinador propõe; você aceita ou não. Recusar só adia — ele fica ali. */
  offerBattle(npc, key, state) {
    const t = DB.STORY.trainer || {};
    const gym = !!npc.trainer.badge;
    const name = npc.trainer.name;
    const intro = state.refused ? (npc.againLines || t.again) : npc.lines;
    const ask = ((gym ? t.gymAsk : t.ask) || "ACEITAR O DESAFIO?").replace("{NOME}", name);
    this.dlg.say(intro, () => {
      this.dlg.ask(ask, [t.yes || "LUTAR", t.no || "AGORA NÃO"], (i) => {
        if (i === 0) {
          state.refused = false;
          return this.startTrainerBattle(npc, key);
        }
        state.refused = true;
        Audio2.cancel();
        this.dlg.say((gym ? t.gymRefuse : t.refuse) || "TALVEZ DEPOIS.");
      });
    });
  }

  startTrainerBattle(npc, key) {
    Audio2.stopLoop();
    Audio2.tone(880, 0.08); Audio2.tone(660, 0.12);
    // o retrato de batalha tem o mesmo nome do sprite de overworld do NPC
    const trainer = { sprite: npc.sprite, ...npc.trainer };
    this.fx = { t: 0, cb: () => this.game.scenes.push(new BattleScene(), { trainer, npcKey: key }) };
  }

  updateWander(dt) {
    this.wanderT += dt;
    if (this.wanderT < 1.8) return;
    this.wanderT = 0;
    for (const n of this.npcsHere()) {
      if (n.wander && Math.random() < 0.5) {
        n.dir = ["up", "down", "left", "right"][Math.floor(Math.random() * 4)];
      }
    }
  }

  // ------------------------------------------------------------ interação
  interact() {
    const p = this.st.player;
    const f = this.facing();
    const [dx, dy] = DIRS[p.dir];

    let npc = this.npcAt(f.x, f.y);
    // atendente do outro lado do balcão
    if (!npc && this.blocked(f.x, f.y)) npc = this.npcAt(f.x + dx, f.y + dy);
    if (npc) return this.talkTo(npc);

    const key = `${f.x},${f.y}`;
    if (this.map.dimensionMachine?.includes(key)) return this.useMachine();
    if (this.map.profPC?.includes(key)) return this.usePC();
    if (this.map.interruptor?.includes(key)) return this.usarInterruptor();
    const quiz = (this.map.quiz || []).find((q) => q.painel.includes(key));
    if (quiz) return this.abrirQuiz(quiz);

    const sign = this.map.signs?.[key];
    if (sign) {
      const ido = this.st.player.map === "birth_island"
        && this.st.npcState["birth_island.deoxys"]?.defeated;
      return void this.dlg.say(ido ? DB.STORY.deoxys.ido : sign);
    }

    const locked = this.map.lockedWarps?.[key];
    if (locked) return void this.dlg.say(locked);

    const warp = this.warpAt(f.x, f.y);
    if (warp && !warp.to) {
      return void this.dlg.say(this.map.lockedWarps?.[`${warp.x},${warp.y}`] || "A PORTA ESTÁ TRANCADA.");
    }

    const obst = this.obstaculoEm(f.x, f.y);
    if (obst?.tipo === "pedra") return this.pedirQuebra(obst);
    if (obst?.tipo === "bloco") return this.pedirForca(obst, ...DIRS[p.dir]);

    const t = this.tagAt(f.x, f.y);
    if (t === DB.TAG.WATER && !this.st.surfando) return this.pedirSurf(f);
    if (t === DB.TAG.GRASS) return this.pedirCorte(f);
  }

  talkTo(npc) {
    const key = `${this.st.player.map}.${npc.id}`;
    const state = (this.st.npcState[key] ||= {});
    if (npc.sprite !== "ball") npc.dir = OPPOSITE[this.st.player.dir];

    if (npc.loot) return this.takeLoot(npc.loot);
    if (npc.sprite === "ball" && npc.gift) return this.pegarItemBall(npc, state, key);
    if (npc.sprite === "ball") return this.pickStarter(npc, state);
    if (npc.monShop && !state.comprou) return this.venderMon(npc, state);
    if (npc.aurora) return this.talkVelhaAurora(state);
    if (npc.escort) return this.talkEscort(npc);
    if (npc.boss) return this.startBossBattle(npc);
    if (npc.balsa) return this.pegarBalsa();
    if (npc.distorcao) return this.investigarDistorcao();
    if (npc.raidPortal) return this.entrarNoRasgo();
    if (npc.portal) return this.usePortal();
    if (npc.fragment) return this.useFragment();
    if (npc.id === "carvalho") return this.talkOak(npc, state);
    if (npc.concurso) return this.talkConcurso(npc, state);
    if (npc.voltaBarco) return this.voltarDeBarco(npc);
    if (npc.missao) return this.talkMissao(npc);

    if (npc.trainer && !state.defeated) {
      if (!this.st.party.length) {
        return void this.dlg.say("VOCÊ NÃO TEM POKÉMON! FALE COM O PROF. CARVALHO PRIMEIRO.");
      }
      return this.offerBattle(npc, key, state);
    }
    if (npc.shop) {
      state.talked = true;
      // Com a BARRACA DE LEILÃO na mochila, o balcão passa a servir pros dois
      // lados: comprar coisa e vender bicho. Sem ela, nada muda — quem nunca
      // comprou a barraca não vê uma pergunta a mais toda vez que fala com o
      // balconista.
      this.dlg.say(npc.lines, () => {
        const prateleira = this.prateleira(npc.shop);
        if (!temBarraca(this.st)) {
          this.menu = { type: "shop", index: 0, shop: prateleira };
          return;
        }
        const L = DB.STORY.leilao;
        this.dlg.ask(L.oferta, L.opcoes, (i) => {
          if (i === 0) this.menu = { type: "shop", index: 0, shop: prateleira };
          else if (i === 1) this.game.scenes.push(new LeilaoScene());
        });
      });
      return;
    }
    if (npc.gift && !state.gotGift) {
      state.gotGift = true;
      this.dlg.say(npc.lines, () => {
        const { item, qty } = npc.gift;
        this.st.items[item] = Math.min(999, (this.st.items[item] || 0) + qty);
        Audio2.heal();
        this.dlg.say(`VOCÊ RECEBEU ${qty} ${item.toUpperCase()}!`);
      });
      return;
    }
    if (npc.heal) {
      const j = DB.STORY.joy;
      this.dlg.say(npc.lines, () => {
        if (!npc.tutor) return this.curarEquipe(npc);
        this.dlg.ask(j.menu, ["CURAR", "TROCAR GOLPES", "NADA"], (i) => {
          if (i === 0) return this.curarEquipe(npc);
          if (i === 1) {
            if (!this.st.party.length) return void this.dlg.say("VOCÊ NÃO TEM POKÉMON AINDA!");
            this.menu = { type: "tutorMon", index: 0 };
            return;
          }
          this.dlg.say(j.tchau);
        });
      });
      return;
    }
    const lines = state.defeated || state.talked ? npc.afterLines || npc.lines : npc.lines;
    state.talked = true;
    this.dlg.say(lines);
  }

  /** batalha de chefe: dá pra capturar, mas não dá pra fugir */
  startBossBattle(npc) {
    const chave = `${this.st.player.map}.${npc.id}`;
    const falas = npc.lines?.length ? npc.lines
      : npc.id === "deoxys" ? DB.STORY.deoxys.intro : [];
    this.dlg.say(falas, () => {
      Audio2.stopLoop();
      Audio2.tone(880, 0.08); Audio2.tone(660, 0.12);
      const foe = createMon(npc.boss.id, npc.boss.lvl, { corrupt: !!npc.boss.corrupt });
      this.fx = {
        t: 0,
        cb: () => this.game.scenes.push(new BattleScene(), {
          foe, glitch: true, boss: true, npcKey: chave,
        }),
      };
    });
  }

  /** conta os 3 minutos e devolve o jogador quando a fenda fecha */
  /** conta o tempo da fenda (o loop principal é quem desconta) e fecha no zero */
  updateFragmentTimer() {
    const m = this.st.mission;
    if (!m?.timed || this.st.player.map !== "glitchdim") return;

    if (m.left > 0 && m.left <= 10 && !m.warned) {
      m.warned = true;
      Glitch.hit(1.5);
      Audio2.glitch();
      this.dlg.say(DB.STORY.dimension.expiring);
      return;
    }
    if (m.left > 0 || m.closing) return;

    m.closing = true;
    Glitch.hit(2.5);
    Audio2.glitch();
    this.dlg.say(DB.STORY.dimension.expired, () => {
      this.transition(() => {
        Object.assign(this.st.player, m.back);
        this.st.mission = null;
        this.st.dimLoot = null;
        if (!this.st.flags.glitchWorld) { Glitch.forced = false; Glitch.burst = 0; }
        this.justWarped = true;
        this.afterTravel();
      });
    });
  }

  /** Espalha as pokébolas largadas pelo chão da dimensão.
   *  Uma leva nova a cada visita: o que você não pegar some quando a fenda fecha. */
  ensureDimLoot() {
    const st = this.st;
    if (st.player.map !== "glitchdim" || !st.mission || st.dimLoot) return;
    this.rollDimLoot();
  }

  rollDimLoot() {
    const geo = DB.KANTO.glitchdim;
    this.st.dimLoot = [];
    if (geo) this.st.dimLoot = scatterDimLoot(geo, (x, y) => this.freeForLoot(x, y));
  }

  freeForLoot(x, y) {
    const t = this.tagAt(x, y);
    if (t !== DB.TAG.FREE && t !== DB.TAG.GRASS) return false;
    const p = this.st.player;
    if (Math.abs(x - p.x) + Math.abs(y - p.y) < 4) return false;   // nunca em cima de você
    return !this.npcAt(x, y);
  }

  /** Pokébola largada num mapa normal (não é da fenda): pega o item e a bola some. */
  pegarItemBall(npc, state, key) {
    const { item, qty = 1 } = npc.gift;
    if (state.gotGift) return;
    state.gotGift = true;
    state.hidden = true;                       // a bola some do chão
    this.st.items[item] = Math.min(999, (this.st.items[item] || 0) + qty);
    Audio2.heal();
    this.game.autosave?.(true);
    // `achado` troca o texto de quem não está dentro de uma bola (item escondido
    // no chão, enfiado no mato, embaixo de uma flor...)
    const msgs = [].concat(npc.achado || `VOCÊ ABRIU A POKÉ BOLA: ${qty} ${item.toUpperCase()}!`);
    const lore = DB.ITEM_LORE?.[item];
    if (lore) msgs.push(lore);
    if (npc.glitch) { Glitch.hit(2); Audio2.glitch(); }
    this.dlg.say(msgs);
  }

  /** abre uma das bolas largadas no chão */
  takeLoot(b) {
    const st = this.st;
    st.dimLoot = (st.dimLoot || []).filter((l) => l.x !== b.x || l.y !== b.y);
    st.items[b.item] = Math.min(999, (st.items[b.item] || 0) + b.qty);
    const msgs = [DB.STORY.dimension.lootFound, `VOCÊ ENCONTROU ${b.qty} ${b.item.toUpperCase()}!`];
    if (b.rare) {
      Glitch.hit(1.8);
      Audio2.glitch();
      const lore = DB.ITEM_LORE?.[b.item];
      if (lore) msgs.push(lore);
      msgs.push(DB.STORY.dimension.lootRare);
    } else Audio2.heal();
    this.dlg.say(msgs);
  }

  /** Alguém da equipe passou do nível de evoluir? Abre a tela de evolução do
   *  primeiro que estiver pronto. Ao fechar, o resume() volta aqui e pega o
   *  próximo — inclusive quem evolui duas vezes seguidas com doce raro. */
  rodarEvolucao(estranho = false) {
    for (const mon of this.st.party) {
      const to = evolutionFor(mon);
      if (!to) continue;
      this.menu = null;
      this.game.scenes.push(new EvolutionScene(), { mon, to, estranho });
      return true;
    }
    return false;
  }

  /** Pedra de evolução, UP-GRADE, DUBIOUS DISC: só funciona no Pokémon certo. */
  useEvoItem(item, mon) {
    this.menu = null;
    const estranho = !!DB.ITEM_LORE?.[item];       // item que veio da fenda
    const to = DB.EVO_ITEMS?.[item]?.[mon.species];
    if (!to || !DB.SPECIES[to]) {
      Audio2.cancel();
      return void this.dlg.say(`NÃO ACONTECEU NADA COM ${mon.nickname}.`);
    }
    this.spend(item, 1);
    if (estranho) { Glitch.hit(2); Audio2.glitch(); }
    this.game.scenes.push(new EvolutionScene(), { mon, to, estranho });
  }

  /** fragmento de portal solto pelo mundo: entrada por tempo limitado */
  useFragment() {
    this.dlg.say([DB.STORY.dimension.fragmentFound, this.detectorReading()], () => {
      this.dlg.ask(DB.STORY.dimension.fragmentAsk, ["ATRAVESSAR", "DEIXAR"], (i) => {
        if (i !== 0) return;
        this.st.fragment = null;                       // o fragmento se fecha
        this.enterDimension(true, DB.CONFIG?.fragmentSeconds ?? 180);
      });
    });
  }

  /** portal de saída, dentro da dimensão */
  usePortal() {
    this.dlg.ask("VOLTAR PRA KANTO?", ["SIM", "FICAR"], (i) => {
      if (i !== 0) return;
      this.transition(() => {
        const st = this.st;
        Object.assign(st.player, st.mission?.back || { map: "lab", x: 6, y: 11, dir: "down" });
        st.mission = null;
        st.dimLoot = null;
        if (!st.flags.glitchWorld) { Glitch.forced = false; Glitch.burst = 0; }
        this.justWarped = true;
        this.afterTravel();
      });
    });
  }

  /** Curar a equipe — a mãe em casa, a enfermeira no centro. COM A EQUIPE
   *  VAZIA não há o que curar: o "prontinho, estão curados" saindo antes de
   *  você ter o primeiro Pokémon era a fala mais boba do jogo. Cada uma tem a
   *  sua saída, porque a mãe não fala como a enfermeira. */
  curarEquipe(npc) {
    if (!this.st.party.length) {
      Audio2.cancel();
      return void this.dlg.say(npc?.semMon || DB.STORY.joy.semMon);
    }
    this.st.party.forEach(heal);
    this.st.vida = this.vidaMax();      // quem cura a equipe cura você também
    this.st.respawn = { map: this.st.player.map, x: this.st.player.x, y: this.st.player.y };
    Audio2.heal();
    this.game.autosave?.();
    this.dlg.say(DB.STORY.joy.curar);
  }

  // ------------------------------------------------------ BILHETE AURORA
  /** Vendedor de Pokémon (o cara do MAGIKARP no centro da ROTA 4): um bicho
   *  por dinheiro, uma vez só. É por aqui que quem não pegou o SQUIRTLE
   *  consegue um tipo ÁGUA — e, com ele, SURFAR. */
  venderMon(npc, state) {
    const v = npc.monShop;
    const sp = DB.SPECIES[v.id];
    if (!sp) return void this.dlg.say(npc.lines);
    this.dlg.say(npc.lines, () => {
      this.dlg.ask(`COMPRAR ${sp.name} POR $${v.price}?`, ["COMPRAR", "AGORA NÃO"], (i) => {
        if (i !== 0) return void this.dlg.say(npc.recusa || "OFERTA DE HOJE SÓ. PENSE RÁPIDO!");
        if (this.st.money < v.price) return void this.dlg.say("VOCÊ NÃO TEM TODO ESSE DINHEIRO.");
        this.st.money -= v.price;
        state.comprou = true;
        const mon = createMon(v.id, v.lvl || 5);
        const msgs = [`VOCÊ COMPROU ${mon.nickname} POR $${v.price}!`];
        if (this.st.party.length < 6) msgs.push(`${mon.nickname} ENTROU NA SUA EQUIPE.`);
        else msgs.push(`${mon.nickname} FOI PRO BOX: SUA EQUIPE ESTÁ CHEIA.`);
        (this.st.party.length < 6 ? this.st.party : this.st.box).push(mon);
        this.st.seen[mon.species] = true;
        this.st.caught[mon.species] = true;
        Audio2.heal();
        this.game.autosave?.(true);
        if (npc.depoisDaCompra) msgs.push(...[].concat(npc.depoisDaCompra));
        this.dlg.say(msgs);
      });
    });
  }

  /** A velha de Viridian: entrega o bilhete na primeira conversa. */
  talkVelhaAurora(state) {
    const a = DB.STORY.aurora;
    if (state.gotGift) return void this.dlg.say(a.depois);
    state.gotGift = true;
    this.dlg.say(a.velha, () => {
      this.st.items[a.item] = Math.min(999, (this.st.items[a.item] || 0) + 1);
      Audio2.heal();
      this.game.autosave?.(true);
      this.dlg.say(a.entrega);
    });
  }

  /** Dobra o bilhete até virar avião e voa. O AURORA vai e volta da ilha; o VOO
   *  não tem destino impresso e abre a lista de Kanto (ver STORY.bilhetes). */
  usarBilhete(item) {
    const b = DB.STORY.bilhete;
    const t = DB.STORY.bilhetes?.[item];
    if (!t) return;
    this.menu = null;
    if (this.st.surfando) return void this.dlg.say(b.surfando);
    if (this.map.interior) return void this.dlg.say(b.dentro);
    if (t.kanto) return void this.dlg.say(b.dobrando, () => this.abrirVooBilhete(item, t));
    const destino = t.destino;
    if (!DB.MAPS[destino]) return;
    const voltando = this.st.player.map === destino;
    this.dlg.say(b.dobrando, () => {
      this.dlg.ask(b.subir, ["SIM", "NÃO"], (i) => {
        if (i !== 0) return;
        Audio2.tone(523, 0.07); Audio2.tone(784, 0.07); Audio2.tone(1046, 0.12);
        this.dlg.say(voltando ? b.voltando : b.voando, () => {
          this.transition(() => {
            const p = this.st.player;
            if (voltando) {
              Object.assign(p, this.st[t.chaveVolta] || { map: "viridian", x: 20, y: 9, dir: "down" });
              this.st[t.chaveVolta] = null;
            } else {
              this.st[t.chaveVolta] = { map: p.map, x: p.x, y: p.y, dir: p.dir };
              const spawn = DB.MAPS[destino].spawn;
              p.map = destino; p.x = spawn.x; p.y = spawn.y; p.dir = spawn.dir || "down";
            }
            this.justWarped = true;
            this.afterTravel();
            const msgs = [t.pousando];
            if (!voltando) {
              if (t.chegou) msgs.push(...[].concat(t.chegou));
              if (t.aviso) msgs.push(t.aviso);
            } else if (t.gasta) {
              this.spend(item, 1);            // o bilhete de ida e volta acaba aqui
              msgs.push(t.gastou);
            }
            this.game.autosave?.(true);
            this.dlg.say(msgs);
          });
        });
      });
    });
  }

  // --------------------------------------------------- golpes com a SRTA. JOY
  /** Tudo que a JOY consegue ensinar pra esse Pokémon: o que a espécie aprende
   *  até o nível atual + os golpes de campo liberados pelo tipo dele. */
  golpesDisponiveis(mon) {
    const sp = DB.SPECIES[mon.species];
    const ids = new Set(learnableMoves(mon.species, mon.level));
    for (const [id, regra] of Object.entries(DB.FIELD_LEARNERS || {})) {
      // se a própria espécie aprende esse golpe num nível (LAPRAS/SURFAR no 70),
      // o nível dela manda — a regra por tipo não serve de atalho
      const proprio = sp.learnset.find(([, mv]) => mv === id);
      const minimo = proprio ? proprio[0] : regra.nivel;
      if (mon.level >= minimo && (proprio || sp.types.some((t) => regra.tipos.includes(t)))) ids.add(id);
    }
    for (const mv of mon.moves) ids.delete(mv.id);          // o que ele já sabe, não
    return [...ids].filter((id) => DB.MOVES[id]);
  }

  /** aprende no primeiro slot vazio; se estiver cheio, pede qual trocar */
  ensinarGolpe(mon, id, slot = -1) {
    const j = DB.STORY.joy;
    const novo = { id, pp: DB.MOVES[id].pp, ppMax: DB.MOVES[id].pp };
    let msg;
    if (slot >= 0) {
      const velho = DB.MOVES[mon.moves[slot].id].name;
      mon.moves[slot] = novo;
      msg = j.trocou.replace("{MON}", mon.nickname).replace("{VELHO}", velho).replace("{NOVO}", DB.MOVES[id].name);
    } else {
      mon.moves.push(novo);
      msg = j.aprendeu.replace("{MON}", mon.nickname).replace("{NOVO}", DB.MOVES[id].name);
    }
    this.menu = null;
    Audio2.heal();
    this.game.autosave?.(true);
    this.dlg.say(msg);
  }

  // ------------------------------------------------- golpes fora da batalha
  /** água na frente: alguém sabe SURFAR? */
  pedirSurf(alvo) {
    const info = DB.FIELD_MOVES.surfar;
    const mon = this.quemSabe("surfar");
    if (!mon) return void this.dlg.say(info.semNinguem);
    this.dlg.ask(info.pergunta, ["SIM", "NÃO"], (i) => {
      if (i !== 0) return;
      this.dlg.say(info.usando.replace("{MON}", mon.nickname), () => {
        this.st.surfando = mon.species;      // guarda quem está te carregando
        Audio2.tone(523, 0.06); Audio2.tone(659, 0.1);
        const p = this.st.player;
        p.x = alvo.x; p.y = alvo.y;          // entra na água
        this.snapCamera();
        this.game.autosave?.();
      });
    });
  }

  /** mato alto na frente: alguém sabe CORTE? */
  pedirCorte(alvo) {
    const info = DB.FIELD_MOVES.corte;
    const mon = this.quemSabe("corte");
    if (!mon) return void this.dlg.say("GRAMA ALTA. ALGUMA COISA SE MEXEU LÁ DENTRO.");
    this.dlg.ask(info.pergunta, ["SIM", "NÃO"], (i) => {
      if (i !== 0) return;
      const mapa = this.st.player.map;
      this.st.cortado ||= {};
      (this.st.cortado[mapa] ||= []).push(`${alvo.x},${alvo.y}`);
      Audio2.hit();
      this.rustle = { x: alvo.x, y: alvo.y, t: 0 };
      this.game.autosave?.();
      this.dlg.say(info.usando.replace("{MON}", mon.nickname));
    });
  }

  /** pedra rachada: QUEBRA-ROCHA some com ela de vez */
  pedirQuebra(obst) {
    const info = DB.FIELD_MOVES.quebrarocha;
    const mon = this.quemSabe("quebrarocha");
    if (!mon) return void this.dlg.say(info.semNinguem);
    this.dlg.ask(info.pergunta, ["SIM", "NÃO"], (i) => {
      if (i !== 0) return;
      this.st.quebrado ||= {};
      (this.st.quebrado[this.st.player.map] ||= []).push(obst.id);
      Audio2.hit();
      Audio2.tone(180, 0.12, "sawtooth", 0.7);
      this.rustle = { x: obst.x, y: obst.y, t: 0 };
      this.game.autosave?.();
      this.dlg.say(info.usando.replace("{MON}", mon.nickname));
    });
  }

  /** bloco: FORÇA libera o empurrão; depois é só andar contra ele */
  pedirForca(obst, dx, dy) {
    const info = DB.FIELD_MOVES.forca;
    const mon = this.quemSabe("forca");
    if (!mon) return void this.dlg.say(info.semNinguem);
    if (this.st.forcaOn) return this.empurrar(obst, dx, dy);
    this.dlg.ask(info.pergunta, ["SIM", "NÃO"], (i) => {
      if (i !== 0) return;
      this.st.forcaOn = true;
      Audio2.tone(220, 0.1, "square", 0.8);
      this.dlg.say(info.usando.replace("{MON}", mon.nickname));
    });
  }

  /** empurra um tile: o bloco vai pra frente e você ocupa o lugar dele */
  empurrar(obst, dx, dy) {
    const nx = obst.x + dx, ny = obst.y + dy;
    const t = this.tagAt(nx, ny);
    const livre = t === DB.TAG.FREE && !this.obstaculoEm(nx, ny) && !this.npcAt(nx, ny) && !this.warpAt(nx, ny);
    if (!livre) {
      if (!this.bumpCd) { Audio2.bump(); this.bumpCd = 0.35; }
      return void this.dlg.say(DB.FIELD_MOVES.forca.travado);
    }
    this.st.blocos ||= {};
    (this.st.blocos[this.st.player.map] ||= {})[obst.id] = { x: nx, y: ny };
    Audio2.tone(150, 0.14, "square", 0.9);
    this.game.autosave?.();
    this.move = { dx, dy, n: 0, total: passo(WALK) };   // você entra no lugar do bloco
  }

  // ------------------------------------------------------ painel de fios (gym)
  /** Interruptor na parede: troca o desafio do ginásio por ligar a corrente. */
  usarInterruptor() {
    const F = DB.STORY.fios;
    if (this.barreiraAberta()) return void this.dlg.say(F.jaAberto);
    this.dlg.say(F.painel, () => {
      this.dlg.ask(F.ask, ["MEXER", "DEIXAR"], (i) => {
        if (i !== 0) return void this.dlg.say(F.desistiu);
        const grid = fiosSortear();
        if (!grid) return void this.dlg.say(F.desistiu);   // sorteio falhou: sem travar o jogo
        Audio2.select();
        this.menu = { type: "fios", grid, cx: 0, cy: FIO_LINHA };
      });
    });
  }

  /** Máquina de perguntas do GINÁSIO DE CINNABAR: acertou, a porta daquela
   *  sala destranca (e fica destrancada); errou, dá pra tentar de novo. */
  abrirQuiz(q) {
    const Q = DB.STORY.quiz;
    if (this.quizAberto(q)) return void this.dlg.say(Q.aberta);
    this.dlg.say([Q.maquina, Q.intro], () => {
      this.dlg.ask(q.pergunta, q.opcoes || ["CERTO", "ERRADO"], (i) => {
        if (i !== (q.certa ?? 0)) {
          Audio2.cancel();
          return void this.dlg.say(Q.errado);
        }
        this.st.flags[this.quizFlag(q)] = true;
        Audio2.tone(523, 0.07); Audio2.tone(784, 0.07); Audio2.tone(1046, 0.14);
        this.game.autosave?.(true);
        this.dlg.say(Q.certo);
      });
    });
  }

  /** corrente fechada: a barreira desliga e fica desligada pra sempre */
  fiosVenceu() {
    this.menu = null;
    const b = this.map.barreira;
    if (b) this.st.flags[b.flag] = true;
    Audio2.tone(523, 0.07); Audio2.tone(784, 0.07); Audio2.tone(1046, 0.16);
    this.game.autosave?.(true);
    this.dlg.say(DB.STORY.fios.ok);
  }

  /** VOAR: lista das cidades onde você já pisou */
  abrirVoo() {
    const info = DB.FIELD_MOVES.voar;
    const mon = this.quemSabe("voar");
    if (!mon) return void this.dlg.say(info.semNinguem);
    if (this.map.interior || this.st.surfando) {
      return void this.dlg.say("AQUI DENTRO NÃO DÁ PRA LEVANTAR VOO.");
    }
    const destinos = Object.entries(DB.FLY_SPOTS)
      .filter(([id]) => this.st.visitado?.[id] && id !== this.st.player.map && DB.MAPS[id]);
    if (!destinos.length) return void this.dlg.say("VOCÊ AINDA NÃO CONHECE OUTRA CIDADE PRA VOAR.");
    this.menu = { type: "voo", index: 0, destinos, mon };
  }

  /** BILHETE VOO: mesma lista do VOAR, mas o avião de papel pousa em qualquer
   *  cidade de Kanto — inclusive nas que você ainda não conhece — e ninguém da
   *  equipe precisa saber voar. */
  abrirVooBilhete(item, t) {
    const destinos = Object.entries(DB.FLY_SPOTS)
      .filter(([id]) => id !== this.st.player.map && DB.MAPS[id]);
    if (!destinos.length) return void this.dlg.say(DB.STORY.bilhete.semDestino);
    this.menu = { type: "voo", index: 0, destinos, bilhete: item, titulo: t.pergunta };
  }

  voarPara(id) {
    const { mon, bilhete } = this.menu || {};
    const t = bilhete ? DB.STORY.bilhetes?.[bilhete] : null;
    this.menu = null;
    const spawn = DB.MAPS[id].spawn;
    const abertura = t ? DB.STORY.bilhete.voandoKanto
                       : DB.FIELD_MOVES.voar.usando.replace("{MON}", mon.nickname);
    this.dlg.say(abertura, () => {
      Audio2.tone(784, 0.06); Audio2.tone(988, 0.12);
      this.transition(() => {
        const p = this.st.player;
        this.st.surfando = null;
        p.map = id; p.x = spawn.x; p.y = spawn.y; p.dir = spawn.dir || "down";
        this.justWarped = true;
        this.afterTravel();
        if (!t) return;
        const msgs = [t.pousando];
        if (t.gasta) { this.spend(bilhete, 1); msgs.push(t.gastou); }
        this.game.autosave?.(true);
        this.dlg.say(msgs);
      });
    });
  }

  /** 011GIVEGLITCH110: o programa aberto no computador do professor.
   *  Lista todo Pokémon que existe no jogo e baixa um pro seu save. */
  usePC() {
    const g = DB.STORY.giveglitch;
    const primeira = !this.st.flags.pcGlitch;
    this.st.flags.pcGlitch = true;
    Audio2.glitch();
    Glitch.hit(1.4);
    this.dlg.say(primeira ? g.first : g.again, () => this.openGive());
  }

  openGive() {
    // sem as formas MEGA: elas só existem dentro da batalha
    const lista = Object.values(DB.SPECIES).filter((sp) => !sp.mega && !sp.fusao)
      .sort((a, b) => (a.dex || 999) - (b.dex || 999));
    this.menu = { type: "give", index: 0, top: 0, lvl: 5, shiny: false, lista };
    Audio2.select();
  }

  /** baixa o Pokémon escolhido pro time (ou pro box, se estiver cheio) */
  baixarMon(m) {
    const sp = m.lista[m.index];
    const mon = createMon(sp.id, m.lvl, { shiny: m.shiny });
    const box = this.st.party.length >= 6;
    (box ? this.st.box : this.st.party).push(mon);
    this.st.seen[sp.id] = true;
    this.st.caught[sp.id] = true;
    this.menu = null;
    Glitch.hit(2);
    Audio2.glitch();
    Audio2.heal();
    this.game.autosave?.(true);
    const txt = (box ? DB.STORY.giveglitch.gotBox : DB.STORY.giveglitch.got)
      .replace("{NOME}", mon.nickname).replace("{NIVEL}", mon.level);
    // baixou um bicho já passado do nível de evoluir? evolui na hora
    this.dlg.say(txt, () => { if (!this.rodarEvolucao(true)) this.openGive(); });
  }

  /** PROF. CARVALHO entrega o DECODIFICADOR DE GENOMA e emenda no assunto do
   *  dia (o inicial, ou o que ele fosse falar mesmo). */
  darDecodificador(npc, state) {
    const F = DB.STORY.fusao;
    const st = this.st;
    st.flags.decodificador = true;
    this.dlg.say(F.entrega, () => {
      st.items[DB.FUSAO.item] = 1;
      Audio2.glitch();
      Glitch.hit(1.2);
      this.game.autosave?.(true);
      this.dlg.say([F.ganhou, ...F.explica], () => this.talkOak(npc, state));
    });
  }

  /** OLHAR PRO CÉU (tecla O). O personagem vira pra cima e conta o que está
   *  vendo — que depende da hora do mundo. Enquanto a fala está aberta, o sol,
   *  a lua ou as estrelas aparecem lá em cima (`drawCeu`).
   *
   *  Não é menu nem cena: é o jeito de o ciclo de dia e noite virar uma coisa
   *  que dá pra FAZER, em vez de só um filtro por cima da tela. */
  olharOCeu() {
    const C = DB.STORY.ceu;
    const p = this.st.player;
    p.dir = "up";
    Audio2.blip();

    if (p.map === "glitchdim") {
      Glitch.hit(0.8);
      this.olhando = { fase: "fenda", t: 0 };
      return void this.dlg.say(C.fenda, () => { this.olhando = null; });
    }
    if (!temCeu(this.map)) return void this.dlg.say(C.teto);

    const h = horaDoMundo();
    const fase = h.noite ? (h.virando ? "amanhecer" : "noite")
                         : (h.virando ? "entardecer" : "dia");
    this.olhando = { fase, t: 0 };
    const falas = [...C[fase]];
    if (!h.virando) falas.push(C.falta.replace("{MIN}", Math.ceil(h.faltam - 5)));
    this.dlg.say(falas, () => { this.olhando = null; });
  }

  /** O ESCURO E AS LANTERNAS. De noite lá fora, ou o dia inteiro dentro de uma
   *  caverna, o mundo escurece — mas com um buraco de luz em volta de cada
   *  pessoa que está no mapa. Vai por cima do mundo e por baixo da interface. */
  drawEscuro(ctx, cx, cy) {
    const escuro = escuridaoDoLugar(this.map);
    if (escuro <= 0.002) return;
    const cor = ehCaverna(this.map) ? "#070912" : veu().cor;
    const luzes = acesa(this.map) ? this.luzesDoMapa(cx, cy) : [];
    ctx.drawImage(camadaDeLuz(W, H, escuro, cor, luzes), 0, 0);
    if (luzes.length) brilho(ctx, luzes);
  }

  /** Onde estão as lanternas na tela. A sua é a maior; a dos NPCs é menor (eles
   *  não estão indo a lugar nenhum), e quem está na sala online também carrega
   *  a dele — do outro lado é gente no mesmo mapa, não enfeite. */
  luzesDoMapa(cx, cy) {
    const meio = (x, y) => ({ x: x - cx + TILE / 2, y: y - cy + TILE / 2 });
    const { px, py } = this.playerPixel(true);
    const luzes = [{ ...meio(px, py), raio: RAIO.borda }];
    for (const n of this.npcsHere()) {
      luzes.push({ ...meio(n.x * TILE, n.y * TILE), raio: RAIO.borda * 0.7 });
    }
    for (const o of Online.noMapa(this.st.player.map)) {
      luzes.push({ ...meio(o.x * TILE, o.y * TILE), raio: RAIO.borda * 0.8 });
    }
    // quem está longe da tela não precisa de buraco nenhum
    return luzes.filter((l) => l.x > -70 && l.x < W + 70 && l.y > -70 && l.y < H + 70);
  }

  /** O CÉU TOMA A TELA. O mapa some — quem olha pra cima não vê mais o chão —,
   *  e no lugar dele fica o céu da hora em que o mundo está. O sol é o SOLROCK
   *  e a lua é o LUNATONE: os dois já moram neste jogo, e um é literalmente uma
   *  pedra com cara de sol e a outra uma pedra com cara de lua. Não faria
   *  sentido desenhar outro. */
  drawCeu(ctx) {
    const { fase, t } = this.olhando;
    const noturno = fase === "noite" || fase === "amanhecer";

    if (fase === "fenda") {
      ctx.fillStyle = "#120820";
      ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 12; i++) {          // a emenda: a mesma faixa, repetida
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = i % 2 ? "#b455ff" : "#3a1d5c";
        ctx.fillRect(0, i * 9 + (Math.floor(t * 8) % 2), W, 4);
      }
      ctx.globalAlpha = 1;
      return;
    }

    const ceu = {
      dia: ["#4aa8f0", "#cfe9ff"],
      entardecer: ["#3a4a8a", "#f08a3c"],
      noite: ["#080c24", "#1c2450"],
      amanhecer: ["#2a2f60", "#f0a060"],
    }[fase];
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, ceu[0]);
    g.addColorStop(1, ceu[1]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    if (noturno) {
      for (let i = 0; i < 40; i++) {
        // as estrelas são fixas (saem do índice, não de sorteio por quadro) e só
        // piscam: estrela que pula de lugar vira chuvisco
        const x = (i * 97) % (W - 8) + 4, y = (i * 53) % 96 + 4;
        const brilho = 0.4 + 0.6 * Math.sin(t * 2.5 + i);
        if (brilho < 0.45) continue;
        ctx.globalAlpha = fase === "amanhecer" ? brilho * 0.45 : brilho;
        ctx.fillStyle = "#f4f2ff";
        ctx.fillRect(x, y, 1 + (i % 4 === 0 ? 1 : 0), 1);
      }
      ctx.globalAlpha = 1;
    }

    // o astro da vez, boiando devagar
    const id = noturno ? "lunatone" : "solrock";
    const art = Assets.mon(id, 7);
    const sobe = Math.sin(t * 1.1) * 3;
    const y = fase === "entardecer" ? 46 : fase === "amanhecer" ? 40 : 16;
    if (art) {
      ctx.globalAlpha = 0.28;                 // o halo, um pouco maior que ele
      ctx.fillStyle = noturno ? "#cfe9ff" : "#ffe14a";
      ctx.beginPath();
      ctx.arc(120, y + 32 + sobe, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.drawImage(art, 88, Math.round(y + sobe), 64, 64);
    }
  }

  /** A máquina, aberta pela mochila. Junta dois da equipe num só, e abre de
   *  volta o que ela juntou. Uma vez por semana, ela abre com a faxina. */
  abrirDecodificador() {
    Audio2.select();
    Glitch.hit(0.5);
    if (!Save.offline() && estaNaHora(this.st)) return this.faxinaDaSemana();
    this.menu = { type: "genoma", index: 0 };
  }

  /** A FAXINA: uma vez por semana a máquina junta as fusões que mal saíram da
   *  montagem automática e pergunta se é pra jogar fora. Ela nunca apaga
   *  sozinha — o histórico guarda tudo, mas desenho dos outros não se joga fora
   *  calado —, e nunca encosta no acervo protegido. */
  async faxinaDaSemana() {
    const F = DB.STORY.fusao;
    this.menu = null;
    marcarFeita(this.st);
    this.game.autosave?.(true);
    this.dlg.say([...F.faxinaAviso, F.faxinaPensando]);
    const lista = await fracas();
    if (!lista.length) return void this.dlg.say(F.faxinaVazio);
    const nomes = lista.map((x) => `${x.ficha.nome} (${x.desenhado}%)`).join(", ");
    this.dlg.ask(
      (lista.length > 1 ? F.faxinaPerguntaVarias : F.faxinaPergunta).replace("{LISTA}", nomes),
      F.faxinaOpcoes,
      async (i) => {
        if (i !== 0) return void this.dlg.say(F.faxinaFicou);
        const fora = [], erros = [];
        for (const x of lista) {
          const r = await apagarDoCodigo(x.chave, x.ficha.id);
          if (r.ok) fora.push(x.ficha.nome);
          else erros.push(r.erro || "?");
        }
        Audio2[fora.length ? "heal" : "cancel"]();
        Glitch.hit(1);
        this.dlg.say([
          ...(fora.length ? [F.faxinaFora.replace("{LISTA}", fora.join(", "))] : []),
          ...(erros.length ? [F.faxinaErro.replace("{ERRO}", erros[0])] : []),
        ]);
      });
  }

  /** A lista de quem pode entrar. Fundir só aceita quem ainda não é fusão; a
   *  oficina e o concurso aceitam uma fusão pronta, que vale pela dupla dela. */
  escolherCabeca(modo = "") {
    const F = DB.STORY.fusao;
    const solta = modo !== "";
    const lista = solta ? [...this.st.party] : this.st.party.filter(fundivel);
    if (lista.filter(fundivel).length < 2 && !(solta && lista.some(ehFusao))) {
      Audio2.cancel();
      this.menu = null;
      return void this.dlg.say(this.st.party.some(ehFusao) && this.st.party.length >= 2
        ? F.jaFundido : F.poucos);
    }
    Audio2.select();
    this.menu = { type: "fusaoCabeca", index: 0, lista, modo };
  }

  /** OFICINA: a bancada onde a fusão vira desenho, nome, tipos e crescimento.
   *  Dá pra trazer dois da sua equipe ou simplesmente DIZER quais são — pra
   *  desenhar uma dupla que você não tem (e talvez nunca tenha). */
  abrirOficina() {
    const F = DB.STORY.fusao;
    this.menu = null;
    this.dlg.ask(F.oficinaComo, F.oficinaOpcoes, (i) => {
      if (i === 0) return this.escolherCabeca("oficina");
      if (i === 1) {
        Audio2.select();
        this.menu = { type: "oficinaDigitar", linha: 0, textos: ["", ""], ids: [null, null] };
      }
      if (i === 2) return this.importarDoArquivo();
    });
  }

  /** IMPORTAR: a ficha que veio do FUSIONGLITCH (o site de fazer fusão fora do
   *  jogo) é um arquivo. Abre o seletor do sistema, lê, confere e grava. */
  importarDoArquivo() {
    const F = DB.STORY.fusao;
    this.menu = null;
    this.dlg.say(F.importar);
    const entrada = document.createElement("input");
    entrada.type = "file";
    entrada.accept = "application/json,.json";
    entrada.style.display = "none";
    document.body.appendChild(entrada);
    entrada.onchange = () => {
      const arquivo = entrada.files?.[0];
      entrada.remove();
      if (!arquivo) return void this.dlg.say(F.importouCancelou);
      const leitor = new FileReader();
      leitor.onload = () => {
        const r = importarFicha(this.st, leitor.result);
        if (!r.ok) {
          Audio2.cancel();
          return void this.dlg.say(F.importouErro.replace("{ERRO}", r.erro));
        }
        Audio2.heal();
        Glitch.hit(1);
        this.game.autosave?.(true);
        this.dlg.say(F.importou
          .replace("{NOME}", r.sp.name)
          .replace("{CABECA}", DB.SPECIES[r.cabeca].name)
          .replace("{CORPO}", DB.SPECIES[r.corpo].name));
      };
      leitor.onerror = () => this.dlg.say(F.importouErro.replace("{ERRO}", "NÃO DEU PRA LER"));
      leitor.readAsText(arquivo);
    };
    entrada.click();
  }

  /** Resolve o que foi digitado num dos dois campos da bancada livre. */
  resolveDigitado(m) {
    const F = DB.STORY.fusao;
    const sp = especiePorTexto(m.textos[m.linha]);
    if (!sp) {
      m.ids[m.linha] = null;
      Audio2.cancel();
      return void this.dlg.say(F.digitarNaoAchou);
    }
    m.ids[m.linha] = sp.id;
    m.textos[m.linha] = sp.name;
    Audio2.select();
  }

  /** CONCURSO DE CINNABAR: a anfitriã, os três jurados e a dupla que você
   *  inscreve (ver src/scenes/concurso.js). */
  talkConcurso(npc, state) {
    const A = DB.CONCURSO.anfitria;
    const primeira = !state.talked;
    state.talked = true;
    this.dlg.say(primeira ? A.convite : A.volta, () => {
      this.dlg.ask(DB.CONCURSO.nome, A.menu, (i) => {
        if (i === 0) return this.inscreverNoConcurso();
        if (i === 1) return void this.dlg.say(A.regras, () => this.talkConcurso(npc, state));
      });
    });
  }

  inscreverNoConcurso() {
    const A = DB.CONCURSO.anfitria;
    if (this.st.party.length < 2 && !this.st.party.some(ehFusao)) {
      Audio2.cancel();
      return void this.dlg.say(A.semDupla);
    }
    this.escolherCabeca("concurso");
  }

  /** Sobe no palco com aquela dupla (nada é fundido de verdade). */
  entrarNoPalco(cabeca, corpo, variante = "") {
    this.menu = null;
    Audio2.select();
    this.game.scenes.push(new ConcursoScene(), { cabeca, corpo, variante });
  }

  /** SIDE QUEST: oferecer, lembrar e entregar. O objetivo é conferido na hora
   *  (src/systems/missoes.js), então dá pra cumprir antes mesmo de aceitar —
   *  aí ele já entrega na primeira conversa. */
  talkMissao(npc) {
    const T = DB.MISSAO_TEXTO;
    const st = this.st;
    // um NPC pode ter uma fila de pedidos (o marinheiro tem três): pega o da vez
    const { missao, travada } = daVez(st, npc.missao);
    if (!missao) return void this.dlg.say(T.jaFeita);
    if (travada) return void this.dlg.say(missao.travado || T.travada);
    const agora = estadoMissao(st, missao.id);

    if (agora === "pronta") return this.entregarMissao(missao);
    // missão de viagem: enquanto ela estiver aberta, ele é o barco
    if (agora === "ativa" && missao.viagem) return this.oferecerViagem(missao);
    if (agora === "ativa") {
      // `{ONDE}` no lembrete vira o lugar da distorção de agora: o cientista
      // sabe onde ela está, então ele fala. É o conserto do "não acho".
      const onde = ondeEla(st);
      return void this.dlg.say([].concat(missao.lembrete).map((l) => l.replace("{ONDE}", onde)));
    }

    this.dlg.say(missao.oferta, () => {
      this.dlg.ask(T.aceitar, T.opcoes, (i) => {
        if (i !== 0) return void this.dlg.say(T.recusou);
        aceitar(st, missao.id);
        Audio2.select();
        this.game.autosave?.(true);
        // já estava cumprida antes de aceitar: entrega na hora
        if (progresso(st, missao.id).feito) return this.entregarMissao(missao);
        if (missao.viagem) return this.oferecerViagem(missao);
        this.dlg.say(T.aceitou);
      });
    });
  }

  /** O barco: ele pergunta, você aceita, a tela apaga e vocês estão lá. */
  oferecerViagem(missao) {
    const v = missao.viagem;
    this.dlg.ask(v.pergunta, v.opcoes || ["VAMOS", "AGORA NÃO"], (i) => {
      if (i !== 0) return;
      this.dlg.say(v.indo, () => {
        Audio2.tone(220, 0.12, "sawtooth", 0.5);
        this.transition(() => {
          const p = this.st.player;
          // de onde ele te tirou: é pra cá que o barco volta
          this.st.barco = { map: p.map, x: p.x, y: p.y, dir: p.dir, missao: missao.id };
          this.st.surfando = null;
          p.map = v.mapa; p.x = v.x; p.y = v.y; p.dir = v.dir || "up";
          this.justWarped = true;
          this.afterTravel();
          this.game.autosave?.(true);
        });
      });
    });
  }

  /** O marinheiro esperando no recife, pra voltar. */
  voltarDeBarco(npc) {
    const barco = this.st.barco;
    const missao = missaoPorId(barco?.missao);
    const v = missao?.viagem;
    this.dlg.say(v?.voltando || ["VAMOS EMBORA."], () => {
      this.transition(() => {
        const p = this.st.player;
        Object.assign(p, { map: barco.map, x: barco.x, y: barco.y, dir: barco.dir });
        delete this.st.npcState["tempestade.lendario"];   // na volta ele está lá de novo
        this.st.barco = null;
        this.justWarped = true;
        this.afterTravel();
        this.game.autosave?.(true);
      });
    });
  }

  /** XERNEAS, YVELTAL e ZYGARDE: parados, cada um no lugar dele, esperando.
   *  Nada de grama e nada de sorteio — você anda até lá e encosta. Capturou,
   *  some pra sempre; derrubou sem capturar, ele volta quando você sair do mapa
   *  e voltar (o `defeated` daquele NPC é limpo em `afterTravel`). */
  estaticosNpcs() {
    const aqui = this.st.player.map;
    return (DB.ESTATICOS || [])
      .filter((e) => e.mapa === aqui && DB.SPECIES[e.id] && !this.st.caught[e.id])
      // quem tem missão só está lá depois que alguém te contou onde procurar
      .filter((e) => !e.missao || this.st.missoes?.[e.missao])
      .filter((e) => !this.st.npcState[`${aqui}.estatico_${e.id}`]?.defeated)
      .map((e) => ({
        id: `estatico_${e.id}`, x: e.x, y: e.y, dir: "down", sprite: `mon:${e.id}`,
        boss: { id: e.id, lvl: e.nivel || 60 },
        lines: e.lines || [],
      }));
  }

  /** Saiu do mapa e voltou: quem foi derrubado sem ser capturado está de pé no
   *  mesmo lugar de novo. */
  reporEstaticos() {
    for (const e of DB.ESTATICOS || []) {
      if (e.mapa === this.st.player.map) continue;      // só repõe os dos OUTROS mapas
      delete this.st.npcState[`${e.mapa}.estatico_${e.id}`];
    }
  }

  /** O recife da tempestade: quem está lá é o lendário da missão da vez e o
   *  marinheiro, que fica no barco esperando. O lendário some quando é
   *  capturado — derrubar não resolve, ele volta na próxima viagem. */
  tempestadeNpcs() {
    if (this.st.player.map !== "tempestade") return [];
    const lista = [];
    const barco = this.st.barco;
    if (barco) {
      lista.push({
        id: "barco", x: 11, y: 10, dir: "left", sprite: "marinheiro",
        voltaBarco: true, lines: DB.STORY.tempestade?.espera || ["EU FICO NO BARCO."],
      });
    }
    const missao = missaoPorId(barco?.missao) || null;
    const alvo = missao?.objetivo?.especie;
    // derrubado sem capturar: ele não volta agora. Volta na PRÓXIMA viagem —
    // é o mar inteiro entre você e a segunda chance.
    const caiu = this.st.npcState["tempestade.lendario"]?.defeated;
    if (alvo && DB.SPECIES[alvo] && !this.st.caught[alvo] && !caiu) {
      const nivel = DB.STORY.tempestade?.nivel || 50;
      lista.push({
        id: "lendario", x: 9, y: 6, dir: "down", sprite: `mon:${alvo}`,
        boss: { id: alvo, lvl: nivel },
        lines: DB.STORY.tempestade?.encontro?.[alvo] || DB.STORY.tempestade?.encontro?.padrao || [],
      });
    }
    return lista;
  }

  entregarMissao(missao) {
    const linhas = entregar(this.st, missao.id);
    Audio2.heal();
    this.game.autosave?.(true);
    this.dlg.say([...(missao.entrega || []), ...linhas]);
  }

  /** MUNDO: traz as fusões que outras pessoas publicaram no código do jogo. O
   *  que chega entra na lista de variantes na hora, por hot-swap — e chega em
   *  todo aparelho ligado neste servidor junto. */
  async baixarDoMundo() {
    const F = DB.STORY.fusao;
    this.menu = null;
    if (Save.offline() && !servidorMundo()) { Audio2.cancel(); return void this.dlg.say(F.semServidor); }
    Audio2.select();
    this.dlg.say(F.mundoBuscando);
    const r = await buscarDoMundo();
    if (!r.ok) {
      Audio2.cancel();
      return void this.dlg.say(F.mundoFalhou.replace("{ERRO}", r.erro || "?"));
    }
    if (!r.novas) {
      return void this.dlg.say(r.aviso ? F.mundoFalhou.replace("{ERRO}", r.aviso) : F.mundoNada);
    }
    Audio2.heal();
    Glitch.hit(1.2);
    const chegaram = [F.mundoChegou.replace("{N}", r.novas)];
    if (r.desenhos) chegaram.push(F.mundoDesenhos.replace("{N}", r.desenhos));
    this.dlg.say(chegaram);
  }

  /** Abre o editor daquele par (os dois ids de espécie). */
  editarFicha(cabeca, corpo) {
    this.menu = null;
    Audio2.select();
    Glitch.hit(0.8);
    this.game.scenes.push(new FusaoEditorScene(), { cabeca, corpo });
  }

  escolherFusao(modo = "") {
    const F = DB.STORY.fusao;
    const lista = this.st.party.filter(ehFusao);
    if (!lista.length) {
      Audio2.cancel();
      this.menu = null;
      return void this.dlg.say(F.semFusao);
    }
    Audio2.select();
    this.menu = { type: "fusaoAbrir", index: 0, lista, modo };
  }

  /** As versões daquela dupla, pra trocar a de quem já está fundido. */
  escolherVersao(mon) {
    const F = DB.STORY.fusao;
    const p = partes(mon.species);
    const vs = variantes(p.cabeca, p.corpo);
    if (vs.length < 2) {
      Audio2.cancel();
      this.menu = null;
      return void this.dlg.say(F.semOutraVersao);
    }
    Audio2.select();
    this.menu = { type: "fusaoVersao", index: 0, mon, lista: vs };
  }

  trocarPorVersao(mon, v) {
    const F = DB.STORY.fusao;
    const antes = mon.nickname;
    const sp = trocarVariante(mon, v.variante);
    this.menu = null;
    if (!sp) { Audio2.cancel(); return void this.dlg.say(F.naoDaParaFundir); }
    Audio2.heal();
    Glitch.hit(0.8);
    this.game.autosave?.(true);
    this.dlg.say(F.trocou.replace("{MON}", antes).replace("{NOME}", sp.name).replace("{ROTULO}", v.rotulo));
  }

  /** Confirma e manda pra tela da máquina (src/scenes/fusion.js). */
  confirmaFusao(cabeca, corpo, variante = "", jaPerguntou = false) {
    const F = DB.STORY.fusao;
    const sp = previsao(cabeca, corpo, variante);
    if (!sp) { Audio2.cancel(); this.menu = null; return void this.dlg.say(F.naoDaParaFundir); }
    this.menu = null;
    // Você fez a ficha de A+B e está fundindo B+A: sem isto a máquina jogava o
    // seu desenho fora sem falar nada e caía no cálculo automático.
    // (só vale pra fusão da sua partida: variante escrita no código é outra coisa)
    // vale pra QUALQUER versão do par invertido: a sua ficha, uma do jogo ou
    // uma publicada — não adianta avisar só das suas
    const temAqui = temFicha(cabeca.species, corpo.species)
      || fichasProntas(cabeca.species, corpo.species).length > 0;
    const inverso = versoesInvertidas(cabeca.species, corpo.species);
    const outra = !variante && !temAqui && inverso.quantas ? inverso : null;
    if (outra && !jaPerguntou) {
      const pergunta = F.perguntaInverter
        .replace("{NOME}", outra.nome || "?")
        .replace("{CABECA}", DB.SPECIES[corpo.species]?.name || corpo.nickname)
        .replace("{OUTRO}", DB.SPECIES[cabeca.species]?.name || cabeca.nickname);
      return void this.dlg.ask(pergunta, F.opcoesInverter, (i) => {
        if (i === 0) return this.confirmaFusao(corpo, cabeca, "", true);   // troca os lados
        if (i === 1) return this.confirmaFusao(cabeca, corpo, "", true);
        this.abrirDecodificador();
      });
    }
    const pergunta = F.confirmaFundir
      .replace("{CABECA}", cabeca.nickname).replace("{CORPO}", corpo.nickname)
      .replace("{NOME}", sp.name);
    this.dlg.ask(pergunta, F.sim, (i) => {
      if (i !== 0) return void this.abrirDecodificador();
      this.game.scenes.push(new FusionScene(), { modo: "fundir", cabeca, corpo, variante });
    });
  }

  confirmaSeparacao(mon) {
    const F = DB.STORY.fusao;
    this.menu = null;
    this.dlg.ask(F.confirmaSeparar.replace("{MON}", mon.nickname), F.simSeparar, (i) => {
      if (i !== 0) return void this.abrirDecodificador();
      this.game.scenes.push(new FusionScene(), { modo: "separar", mon });
    });
  }

  /** o botão gigante da máquina do laboratório */
  useMachine() {
    const st = this.st;
    if (st.flags.glitchWorld) return void this.dlg.say(DB.STORY.dimension.machineOff);
    if (!st.flags.missionReady && !st.flags.dimUnlocked) {
      return void this.dlg.say(DB.STORY.dimension.machineIdle);
    }
    Audio2.glitch();
    Glitch.hit(1.2);
    if (st.flags.missionReady) return this.askDimension();
    // já desbloqueada: entra quando quiser, sem missão
    this.dlg.ask(DB.STORY.dimension.freeAsk, ["SIM", "NÃO"], (i) => {
      if (i === 0) this.enterDimension(true);
    });
  }

  /** convite pra entrar na fenda */
  askDimension() {
    const st = this.st;
    if (!DB.STORY.missions[st.badges.length]) {
      st.flags.missionReady = false;
      return void this.dlg.say("A FENDA FECHOU POR ENQUANTO. VOLTE COM MAIS UMA INSÍGNIA.");
    }
    this.dlg.ask(DB.STORY.dimension.ask, ["SIM", "NÃO"], (i) => {
      if (i !== 0) return void this.dlg.say(DB.STORY.dimension.refuse);
      this.enterDimension();
    });
  }

  enterDimension(free = false, seconds = 0) {
    const st = this.st;
    const p = st.player;
    st.flags.dimUnlocked = true;
    st.mission = { n: free ? 0 : st.badges.length, free, timed: seconds > 0, left: seconds || 0,
                   back: { map: p.map, x: p.x, y: p.y, dir: p.dir } };
    delete st.npcState["glitchdim.boss"];
    Glitch.forced = true;
    Glitch.hit(2.5);
    Audio2.glitch();
    Audio2.stopLoop();
    this.transition(() => {
      p.map = "glitchdim"; p.x = 22; p.y = 29; p.dir = "up";
      this.justWarped = true;
      this.afterTravel();
      this.dlg.say(seconds
        ? DB.STORY.dimension.fragmentIn
        : free ? DB.STORY.dimension.arrivedFree : DB.STORY.dimension.arrived);
    });
  }

  /** chamado ao voltar da batalha: chefe derrotado -> volta pro laboratório */
  checkMissionDone() {
    const st = this.st;
    if (st.player.map !== "glitchdim" || !st.mission) return;
    if (!st.npcState["glitchdim.boss"]?.defeated) return;
    const info = DB.STORY.missions[st.mission.n];
    st.flags.missionReady = false;
    this.dlg.say([...(info?.win || []), DB.STORY.dimension.exit], () => {
      this.transition(() => {
        const back = st.mission.back;
        Object.assign(st.player, back);
        st.mission = null;
        st.dimLoot = null;
        if (!st.flags.glitchWorld) { Glitch.forced = false; Glitch.burst = 0; }
        this.justWarped = true;
        this.afterTravel();
      });
    });
  }

  /** Assistente do professor: te busca, te leva e te traz de volta. */
  talkEscort(npc) {
    const e = this.st.escort;
    if (!e) return;
    const n = this.st.badges.length;
    const E = DB.STORY.escort;
    if (e.stage === "found") {
      const det = DB.STORY.detector;
      const first = !this.st.items[det.item];
      const achou = porInsignia(E.found, n);
      const lines = first ? [...achou, ...det.give, det.got] : achou;
      if (first) this.st.items[det.item] = 1;
      this.dlg.say(lines, () => {
        this.dlg.say(DB.STORY.escort.arrive, () => {
          this.transition(() => {
            const p = this.st.player;
            p.map = "lab"; p.x = 6; p.y = 11; p.dir = "up";
            e.stage = "atLab"; e.map = "lab"; e.x = 5; e.y = 11; e.dir = "right";
            this.justWarped = true;
            this.afterTravel();
          });
        });
      });
      return;
    }
    if (e.stage === "atLab" && this.st.flags.oakPending) {
      return void this.dlg.say(porInsignia(E.waiting, n));
    }
    // missão cumprida: volta pro lugar onde te achou
    this.dlg.ask(porInsignia(E.offerReturn, n), ["SIM", "AINDA NÃO"], (i) => {
      if (i !== 0) return;
      this.transition(() => {
        const p = this.st.player;
        Object.assign(p, e.from);
        this.st.escort = null;
        this.justWarped = true;
        this.afterTravel();
        this.dlg.say(porInsignia(E.returned, n));
      });
    });
  }

  /** Prof. Carvalho: conduz o arco da 011glitchdimension110. */
  /** O professor explica a GLITCHFORM e libera o GLITCHBOOSTER. */
  explicarGlitchform() {
    const G = DB.STORY.glitch;
    this.st.flags.glitchform = true;
    Glitch.hit(1.5);
    Audio2.glitch();
    this.game.autosave?.(true);
    this.dlg.say([...G.explica, G.liberou]);
  }

  talkOak(npc, state) {
    const st = this.st;
    const S = DB.STORY;
    const n = st.badges.length;

    // DECODIFICADOR DE GENOMA: a primeira coisa que ele faz, na primeira
    // conversa — antes do inicial, antes de qualquer insígnia.
    if (!st.flags.decodificador) return this.darDecodificador(npc, state);

    // A GLITCHFORM: com o VISOR-G.L.I.T.C.H do Conor no bolso, o professor
    // explica pra que mais ele serve — e é essa conversa que destranca o
    // GLITCHBOOSTER. Antes dela, o item não sai da mochila nem aparece na loja:
    // uma coisa que transforma o seu Pokémon num bug não devia funcionar antes
    // de alguém dizer o que ela faz.
    if (temVisor(st) && !explicado(st)) return this.explicarGlitchform();

    // ANEL MEGA: sai da mão dele na primeira volta ao laboratório depois da
    // primeira insígnia. As outras megapedras estão espalhadas por Kanto.
    if (st.flags.starterChosen && n >= 1 && !st.flags.anelMega) return this.darAnelMega();
    if (st.flags.anelMega) {
      // ele guarda uma pedra de cada inicial: apareceu um novo, ele entrega
      const devidas = pedrasIniciaisDevidas(st);
      if (devidas.length) return this.darPedrasIniciais(devidas, true);
    }

    if (st.flags.caughtMissingno) {
      return void this.dlg.say([
        "VOCÊ FEZ O QUE NINGUÉM CONSEGUIU: DEU UM LUGAR PRO QUE NÃO TINHA.",
        "CUIDE BEM DELE. E NÃO O SOLTE NO PC.",
      ]);
    }
    if (st.flags.glitchWorld) {
      const g = S.glitchball;
      // com o mundo bugado ele entrega a GLITCHBALL; se você gastou, monta outra
      if (!g || (st.items[g.item] || 0) > 0) return void this.dlg.say(S.hunting);
      const denovo = !!st.flags.glitchballDada;
      st.flags.glitchballDada = true;
      return void this.dlg.say(denovo ? g.outra : g.lines, () => {
        st.items[g.item] = 1;
        Glitch.hit(1.6);
        Audio2.glitch();
        this.game.autosave?.(true);
        this.dlg.say([g.got, ...[].concat(S.hunting)]);
      });
    }

    if (n >= 8) {
      // finale: a última trava cede
      this.dlg.say(S.finale, () => {
        st.flags.glitchWorld = true;
        st.flags.oakPending = false;
        st.corruption = 60;
        Glitch.forced = true;
        Glitch.hit(2.5);
        Audio2.glitch();
      });
      return;
    }
    if (st.flags.oakPending && S.chapters[n]) {
      st.flags.oakPending = false;
      st.flags.missionReady = true;
      state.talked = true;
      const fenda = porInsignia(S.dimension.enter, n);
      if (n === 1) {                     // só na primeira ele checa a mensagem
        const C = S.oakCheck;
        this.dlg.ask(C.ask, C.options, (i) => {
          const reply = i === 1 ? C.replyCode : C.replyNo;
          this.dlg.say([...reply, ...S.chapters[n], ...fenda]);
        });
        return;
      }
      this.dlg.say([...(porInsignia(S.oakGreet, n) || []), ...S.chapters[n], ...fenda]);
      return;
    }
    if (st.flags.missionReady) return this.askDimension();
    if (!st.flags.starterChosen) return void this.dlg.say(npc.lines);
    return void this.dlg.say(n === 0
      ? npc.afterLines || npc.lines
      : porInsignia(S.oakIdle, n)
        || ["CONTINUE COLETANDO INSÍGNIAS. E VOLTE AQUI A CADA UMA DELAS.", `VOCÊ TEM ${n} DE 8.`]);
  }

  /** O professor entrega o ANEL MEGA (e já emenda a pedra do seu inicial). */
  darAnelMega() {
    const M = DB.STORY.mega;
    const st = this.st;
    st.flags.anelMega = true;
    this.dlg.say(M.entrega, () => {
      st.items[M.anel] = 1;
      Audio2.heal();
      this.dlg.say([M.ganhouAnel, ...M.explica], () => {
        const devidas = pedrasIniciaisDevidas(st);
        if (devidas.length) this.darPedrasIniciais(devidas, false);
        else this.game.autosave?.(true);
      });
    });
  }

  /** As pedras dos iniciais não estão no mundo: são as que ele tem na gaveta. */
  darPedrasIniciais(pedras, depois) {
    const M = DB.STORY.mega;
    const st = this.st;
    (st.flags.pedrasIniciais ||= []).push(...pedras);
    const msgs = [].concat(depois ? M.daPedraDepois : M.daPedra);
    for (const pedra of pedras) {
      st.items[pedra] = (st.items[pedra] || 0) + 1;
      msgs.push(M.ganhouPedra.replace("{PEDRA}", pedra.toUpperCase()));
    }
    Audio2.heal();
    this.game.autosave?.(true);
    this.dlg.say(msgs);
  }

  pickStarter(npc, state) {
    if (this.st.flags.starterChosen) {
      return void this.dlg.say("AS OUTRAS POKÉ BOLAS SÃO DO PROFESSOR. MELHOR NÃO MEXER.");
    }
    const sp = DB.SPECIES[npc.starter];
    // "OUTRA REGIÃO" abre as nove. As três bolas continuam sendo as de Kanto e
    // continuam funcionando com um SIM — quem quer o CHARMANDER de sempre não
    // atravessa menu nenhum, e quem quer um FUECOCO acha o caminho na primeira
    // pergunta em vez de descobrir que não dá.
    this.dlg.ask(`ESTA POKÉ BOLA CONTÉM ${sp.name}. LEVAR?`,
                 ["SIM", "OUTRA REGIÃO", "NÃO"], (i) => {
      if (i === 1) return this.escolherRegiao(state);
      if (i !== 0) return;
      this.entregarInicial(npc.starter, state);
    });
  }

  /** As nove regiões. Nove cabem na caixa de escolha; vinte e sete não caberiam,
   *  e é por isso que a escolha é em dois passos e não numa lista só. */
  escolherRegiao(state) {
    const regioes = DB.REGIOES || [];
    this.dlg.ask("DE QUE REGIÃO?", [...regioes.map((r) => r.nome), "VOLTAR"], (i) => {
      const r = regioes[i];
      if (!r) return;
      const nomes = r.mons.map((id) => DB.SPECIES[id]?.name || id);
      this.dlg.ask(`OS TRÊS DE ${r.nome}:`, [...nomes, "VOLTAR"], (j) => {
        const id = r.mons[j];
        if (!id) return this.escolherRegiao(state);
        this.entregarInicial(id, state);
      });
    });
  }

  /** Entrega o inicial escolhido, venha ele de qual bola ou de qual região vier. */
  entregarInicial(id, state) {
    const mon = this.game.giveStarter(id);
    state.hidden = true;
    this.st.flags.starterChosen = true;
    this.st.flags.meuInicial = id;             // o AZUL escolhe a partir disto
    Audio2.heal();
    this.dlg.say([
      `VOCÊ RECEBEU ${mon.nickname}!`,
      "PROF. CARVALHO: BOA ESCOLHA! AGORA SIGA PELA ROTA 1.",
      "VIRIDIAN FICA AO NORTE. LÁ TEM CENTRO POKÉMON E LOJA.",
    ]);
  }

  // ---------------------------------------------------------------- menu
  openMenu() { Audio2.select(); this.menu = { type: "main", index: 0 }; }

  /** VELOCIDADE: quantos passos por segundo o jogador dá. Ela é do aparelho,
   *  não da partida (mora nas opções do navegador), então vale pra qualquer
   *  save aberto aqui. */
  nomeVelocidade() {
    const v = Opcoes.get("velocidade") || 1;
    return v <= 0.5 ? "DEVAGAR" : v < 1 ? "CALMA" : v === 1 ? "NORMAL" : v <= 1.5 ? "RÁPIDA" : "TURBO";
  }

  mudaVelocidade(d) {
    const escala = [0.5, 0.75, 1, 1.5, 2];
    const i = escala.indexOf(Opcoes.get("velocidade") || 1);
    const novo = escala[(Math.max(0, i) + d + escala.length) % escala.length];
    Opcoes.set("velocidade", novo);
    Audio2.blip();
  }

  /** IDIOMA: troca o dicionário na hora. O que não estiver traduzido continua
   *  aparecendo em português (ver src/core/idioma.js). */
  mudaIdioma(d) {
    const lista = DB.IDIOMAS || [{ id: "pt" }];
    const i = lista.findIndex((l) => l.id === Opcoes.get("idioma"));
    const novo = lista[(Math.max(0, i) + d + lista.length) % lista.length];
    Opcoes.set("idioma", novo.id);
    this.game.aplicarIdioma();
    Audio2.select();
  }

  /** itens do menu principal: VOAR entra quando alguém da equipe sabe voar */
  itensMenu() {
    const base = ["POKÉMON", "BOX", "MOCHILA", "INSÍGNIAS"];
    // ACAMPAR só aparece quando dá: com barraca na mochila e chão de fora. Menu
    // que oferece o que não funciona é menu que mente.
    if (podeAcampar(this.st, this.map).ok) base.push("ACAMPAR");
    if (diario(this.st).length) base.push(DB.MISSAO_TEXTO.titulo);   // só depois do primeiro pedido
    base.push(DB.STORY.fusao.atualizar);   // baixa as fusões publicadas no mundo
    if (this.quemSabe("voar")) base.push("VOAR");
    if (DB.ONLINE?.ativo) base.push("ONLINE");
    return [...base, "SALVAR", "OPÇÕES", "SAIR"];
  }

  /** O que esta loja mostra AGORA: item com `requer` só entra depois da flag, e
   *  item `unico` sai da prateleira depois de comprado. Vender o que o jogador
   *  ainda não pode usar é vender problema; vender de novo o que não gasta é
   *  vender a mesma coisa duas vezes. */
  prateleira(shop) {
    return (shop || [])
      .filter((x) => !x.requer || this.st.flags?.[x.requer])
      .filter((x) => !x.unico || !(this.st.items?.[x.item] > 0));
  }

  buy(item, price, n, shop) {
    const total = price * n;
    this.st.money -= total;
    this.st.items[item] = Math.min(999, (this.st.items[item] || 0) + n);
    Audio2.heal();
    this.menu = { type: "shop", index: 0, shop };
    this.dlg.say(`VOCÊ COMPROU ${n} ${item.toUpperCase()} POR $${total}.`);
  }

  /** BOX: tira o escolhido pra equipe, ou guarda um da equipe no depósito. */
  moverBox(m, lista) {
    const B = DB.STORY.box;
    const mon = lista[m.index];
    if (!mon) return;
    let msg;
    if (m.lado === "box") {
      if (this.st.party.length >= 6) { Audio2.cancel(); return void this.dlg.say(B.equipeCheia); }
      this.st.box.splice(m.index, 1);
      this.st.party.push(mon);
      msg = B.tirou;
    } else {
      if (this.st.party.length <= 1) { Audio2.cancel(); return void this.dlg.say(B.ultimo); }
      // guardar não pode te deixar sem ninguém de pé
      if (mon.hp > 0 && this.st.party.filter((p) => p.hp > 0).length <= 1) {
        Audio2.cancel();
        return void this.dlg.say(B.semLutador);
      }
      this.st.party.splice(m.index, 1);
      this.st.box.push(mon);
      msg = B.guardou;
    }
    const atual = m.lado === "box" ? this.st.box : this.st.party;
    m.index = Math.max(0, Math.min(m.index, atual.length - 1));
    m.top = Math.min(m.top, m.index);
    Audio2.heal();
    this.game.autosave?.(true);
    this.dlg.say(msg.replace("{MON}", mon.nickname));
  }

  /** usa até 999 de uma vez */
  useItem(item, mon, qty) {
    this.menu = null;
    const have = this.st.items[item] || 0;
    const n = Math.max(1, Math.min(qty, have));
    if (DB.EVO_ITEMS?.[item]) return this.useEvoItem(item, mon);
    if (item === "poção") {
      if (mon.hp <= 0) return void this.dlg.say(`${mon.nickname} ESTÁ DESMAIADO. POÇÃO NÃO RESOLVE.`);
      const missing = mon.maxHp - mon.hp;
      if (missing <= 0) return void this.dlg.say(`${mon.nickname} JÁ ESTÁ COM O HP CHEIO!`);
      const used = Math.min(n, Math.ceil(missing / 20));
      mon.hp = Math.min(mon.maxHp, mon.hp + used * 20);
      this.spend(item, used);
      Audio2.heal();
      return void this.dlg.say(`${mon.nickname} RECUPEROU ${Math.min(missing, used * 20)} DE HP! (${used} POÇÃO)`);
    }
    return this.useCandy(mon, n);
  }

  spend(item, n) {
    this.st.items[item] -= n;
    if (this.st.items[item] <= 0) delete this.st.items[item];
  }

  /** doce raro: +1 nível por doce, até 999 de uma vez */
  useCandy(mon, qty = 1) {
    if (mon.level >= 100) { Audio2.cancel(); return void this.dlg.say(`${mon.nickname} JÁ ESTÁ NO NÍVEL MÁXIMO!`); }
    const before = mon.level;
    const used = Math.min(qty, 100 - mon.level);
    const learned = [];
    for (let i = 0; i < used; i++) {
      for (const ev of gainXp(mon, xpForLevel(mon.level + 1) - mon.xp)) {
        if (ev.type === "move") learned.push(DB.MOVES[ev.id].name);
      }
    }
    this.spend("doce raro", used);
    Audio2.heal();
    this.menu = null;
    const msgs = [used === 1
      ? `${mon.nickname} SUBIU PARA O NÍVEL ${mon.level}!`
      : `${mon.nickname} SUBIU ${mon.level - before} NÍVEIS! AGORA ESTÁ NO NÍVEL ${mon.level}.`];
    if (learned.length === 1) msgs.push(`${mon.nickname} APRENDEU ${learned[0]}!`);
    else if (learned.length > 1) msgs.push(`${mon.nickname} APRENDEU: ${learned.slice(0, 4).join(", ")}.`);
    this.dlg.say(msgs, () => this.rodarEvolucao());   // o doce pode passar de forma
  }

  updateMenu() {
    const m = this.menu;
    if (m.type === "main") {
      const items = this.itensMenu();
      m.index = Math.min(m.index, items.length - 1);
      if (Input.consume("up")) { m.index = (m.index + items.length - 1) % items.length; Audio2.blip(); }
      if (Input.consume("down")) { m.index = (m.index + 1) % items.length; Audio2.blip(); }
      if (Input.consume("b")) { this.menu = null; Audio2.cancel(); }
      if (Input.consume("a")) {
        Audio2.select();
        const pick = items[m.index];
        if (pick === "VOAR") { this.menu = null; return void this.abrirVoo(); }
        if (pick === "ACAMPAR") {
          this.menu = null;
          return void this.game.scenes.push(new AcampamentoScene());
        }
        if (pick === "ONLINE") { this.menu = null; return void this.game.scenes.push(new OnlineMenuScene()); }
        if (pick === "POKÉMON") this.menu = { type: "party", index: 0 };
        else if (pick === "BOX") this.menu = { type: "box", lado: "box", index: 0, top: 0 };
        else if (pick === "MOCHILA") this.menu = { type: "bag", index: 0 };
        else if (pick === "INSÍGNIAS") this.menu = { type: "badges", index: 0 };
        else if (pick === DB.MISSAO_TEXTO.titulo) this.menu = { type: "missoes", index: 0, top: 0 };
        else if (pick === DB.STORY.fusao.atualizar) { this.menu = null; return void this.baixarDoMundo(); }
        else if (pick === "SALVAR") {
          this.menu = null;
          this.game.save().then((r) => this.dlg.say(
            r === "ok" ? "JOGO SALVO!"
            : r === "conflito" ? "O SAVE MUDOU POR FORA. RECARREGUEI A PARTIDA DO ARQUIVO."
            : "NÃO DEU PRA SALVAR. O SERVIDOR ESTÁ NO AR?"));
        } else if (pick === "OPÇÕES") this.menu = { type: "opts", index: 0 };
        else this.menu = null;
      }
      return;
    }
    if (m.type === "party") {
      if (Input.consume("up")) m.index = Math.max(0, m.index - 1);
      if (Input.consume("down")) m.index = Math.min(this.st.party.length - 1, m.index + 1);
      if (Input.consume("b") || Input.consume("a")) { this.menu = { type: "main", index: 0 }; Audio2.cancel(); }
      return;
    }
    if (m.type === "bag") {
      const keys = Object.keys(this.st.items);
      if (!keys.length) {                       // mochila vazia: nada de índice NaN
        if (Input.consume("b") || Input.consume("a")) { this.menu = { type: "main", index: this.itensMenu().indexOf("MOCHILA") }; Audio2.cancel(); }
        return;
      }
      if (m.index >= keys.length) m.index = 0;
      if (!keys.length) {           // mochila vazia: sem cursor pra mover
        if (Input.consume("b") || Input.consume("a")) { this.menu = { type: "main", index: this.itensMenu().indexOf("MOCHILA") }; Audio2.cancel(); }
        return;
      }
      m.index = Math.min(m.index, keys.length - 1);
      if (Input.consume("up")) { m.index = (m.index + keys.length - 1) % keys.length; Audio2.blip(); }
      if (Input.consume("down")) { m.index = (m.index + 1) % keys.length; Audio2.blip(); }
      if (Input.consume("b")) { this.menu = { type: "main", index: this.itensMenu().indexOf("MOCHILA") }; Audio2.cancel(); }
      if (Input.consume("a")) {
        const item = keys[m.index];
        const owned = this.st.items[item] || 0;
        if (DB.STORY.bilhetes?.[item] && owned > 0) {
          Audio2.select();
          return void this.usarBilhete(item);
        }
        if (item === DB.STORY.glitchball?.item && owned > 0) {
          Audio2.cancel();                      // ela só serve com alguém na frente
          return void this.dlg.say("A GLITCHBALL SÓ FUNCIONA EM BATALHA. E SÓ UMA VEZ.");
        }
        if (item === DB.FUSAO?.item && owned > 0) {
          this.menu = null;                      // item-chave: abre a máquina
          return void this.abrirDecodificador();
        }
        if (item === DB.MEGA_ANEL && owned > 0) {
          Audio2.select();                       // item-chave: só se olha
          return void this.dlg.say(DB.STORY.mega.olhaAnel);
        }
        if (DB.MEGA_PEDRAS?.[item] && owned > 0) {
          Audio2.select();
          const forma = DB.SPECIES[DB.MEGA_PEDRAS[item]];
          const base = DB.SPECIES[forma?.megaDe];
          return void this.dlg.say(DB.STORY.mega.olhaPedra.replace("{ESPECIE}", base?.name || "?"));
        }
        if (DB.EVO_ITEMS?.[item] && owned > 0 && this.st.party.length) {
          Audio2.select();                       // item de evolução: um por vez
          this.menu = { type: "useItem", index: 0, item, qty: 1 };
          return;
        }
        const usable = (item === "doce raro" || item === "poção") && owned > 0 && this.st.party.length;
        if (usable) {
          Audio2.select();
          this.menu = { type: "qty", item, n: 1, max: Math.min(999, owned), next: "use" };
        } else Audio2.cancel();
      }
      return;
    }
    if (m.type === "oficinaDigitar") {
      const F = DB.STORY.fusao;
      if (Texto.ativo()) {                     // o teclado virou texto
        if (!Texto.estado()) return;
        const escrito = Texto.termina();
        if (escrito !== null) { m.textos[m.linha] = escrito; this.resolveDigitado(m); }
        return;
      }
      if (Input.consume("up")) { m.linha = (m.linha + 2) % 3; Audio2.blip(); }
      if (Input.consume("down")) { m.linha = (m.linha + 1) % 3; Audio2.blip(); }
      if (Input.consume("b")) { this.menu = { type: "genoma", index: 2 }; Audio2.cancel(); }
      if (Input.consume("a")) {
        if (m.linha < 2) { Texto.comeca(m.textos[m.linha] || "", 12); Audio2.select(); return; }
        if (!m.ids[0] || !m.ids[1]) { Audio2.cancel(); return void this.dlg.say(F.digitarFaltam); }
        return void this.editarFicha(m.ids[0], m.ids[1]);
      }
      return;
    }
    if (m.type === "missoes") {
      const lista = diario(this.st);
      const n = Math.max(1, lista.length);
      if (Input.consume("up")) { m.index = (m.index + n - 1) % n; Audio2.blip(); }
      if (Input.consume("down")) { m.index = (m.index + 1) % n; Audio2.blip(); }
      m.top = Math.max(0, Math.min(m.top ?? 0, Math.max(0, lista.length - 4)));
      if (m.index < m.top) m.top = m.index;
      if (m.index > m.top + 3) m.top = m.index - 3;
      if (Input.consume("b") || Input.consume("a")) {
        this.menu = { type: "main", index: this.itensMenu().indexOf(DB.MISSAO_TEXTO.titulo) };
        Audio2.cancel();
      }
      return;
    }
    if (m.type === "genoma") {
      const opts = DB.STORY.fusao.menu;
      if (Input.consume("up")) { m.index = (m.index + opts.length - 1) % opts.length; Audio2.blip(); }
      if (Input.consume("down")) { m.index = (m.index + 1) % opts.length; Audio2.blip(); }
      if (Input.consume("b")) { this.menu = null; Audio2.cancel(); }
      if (Input.consume("a")) {
        if (m.index === 0) this.escolherCabeca();
        else if (m.index === 1) this.escolherFusao();
        else if (m.index === 2) this.escolherFusao("versao");
        else if (m.index === 3) this.abrirOficina();
        else if (m.index === 4) this.baixarDoMundo();
        else { this.menu = null; Audio2.cancel(); }
      }
      return;
    }
    if (m.type === "fusaoVersao") {
      const n = m.lista.length;
      if (Input.consume("up")) { m.index = (m.index + n - 1) % n; Audio2.blip(); }
      if (Input.consume("down")) { m.index = (m.index + 1) % n; Audio2.blip(); }
      if (Input.consume("b")) { this.menu = { type: "genoma", index: 2 }; Audio2.cancel(); }
      if (Input.consume("a")) this.trocarPorVersao(m.mon, m.lista[m.index]);
      return;
    }
    if (m.type === "fusaoCabeca" || m.type === "fusaoCorpo" || m.type === "fusaoAbrir") {
      const n = m.lista.length;
      if (!n) { this.menu = { type: "genoma", index: 0 }; return; }
      m.index = Math.min(m.index, n - 1);
      if (Input.consume("up")) { m.index = (m.index + n - 1) % n; Audio2.blip(); }
      if (Input.consume("down")) { m.index = (m.index + 1) % n; Audio2.blip(); }
      if (Input.consume("b")) {
        Audio2.cancel();
        if (m.type === "fusaoCorpo") {
          this.menu = { type: "fusaoCabeca", index: 0, modo: m.modo,
                        lista: m.modo ? [...this.st.party] : this.st.party.filter(fundivel) };
        } else if (m.modo === "concurso") this.menu = null;   // o concurso não é a máquina
        else this.menu = { type: "genoma", index: 0 };
        return;
      }
      // C passa pelas fusões daquela dupla: a automática (ou a sua ficha), as
      // que já vêm no jogo e as que jogadores publicaram
      if (m.type === "fusaoCorpo") {
        const alvo = m.lista[m.index];
        const vs = alvo ? variantes(m.cabeca.species, alvo.species) : [];
        m.variante = Math.min(m.variante || 0, Math.max(0, vs.length - 1));
        if (Input.consume("select") && vs.length > 1) {
          m.variante = (m.variante + 1) % vs.length;
          Audio2.select();
        }
      }
      if (Input.consume("a")) {
        const escolhido = m.lista[m.index];
        if (m.type === "fusaoCabeca") {
          const jaFundido = partes(escolhido.species);
          if (jaFundido && m.modo) {             // esse já é uma fusão: vale pela dupla dele
            if (m.modo === "oficina") return void this.editarFicha(jaFundido.cabeca, jaFundido.corpo);
            return void this.entrarNoPalco(jaFundido.cabeca, jaFundido.corpo, jaFundido.variante);
          }
          if (!fundivel(escolhido)) { Audio2.cancel(); return void this.dlg.say(DB.STORY.fusao.jaFundido); }
          Audio2.select();
          this.menu = {
            type: "fusaoCorpo", index: 0, cabeca: escolhido, modo: m.modo, variante: 0,
            lista: m.lista.filter((mon) => mon !== escolhido && fundivel(mon)),
          };
        } else if (m.type === "fusaoCorpo") {
          const vs = variantes(m.cabeca.species, escolhido.species);
          const v = vs[m.variante || 0]?.variante || "";
          if (m.modo === "oficina") this.editarFicha(m.cabeca.species, escolhido.species);
          else if (m.modo === "concurso") this.entrarNoPalco(m.cabeca.species, escolhido.species, v);
          else this.confirmaFusao(m.cabeca, escolhido, v);
        } else if (m.modo === "versao") this.escolherVersao(escolhido);
        else this.confirmaSeparacao(escolhido);
      }
      return;
    }
    if (m.type === "qty") {
      const step = (d) => { m.n = Math.min(m.max, Math.max(1, m.n + d)); Audio2.blip(); };
      if (Input.consume("up")) step(1);
      if (Input.consume("down")) step(-1);
      if (Input.consume("right")) step(10);
      if (Input.consume("left")) step(-10);
      if (Input.held("run")) m.n = m.max;          // SHIFT = tudo
      if (Input.consume("b")) { this.menu = m.next === "buy" ? { type: "shop", index: 0, shop: m.shop } : { type: "bag", index: 0 }; Audio2.cancel(); }
      if (Input.consume("a")) {
        Audio2.select();
        if (m.next === "buy") this.buy(m.item, m.price, m.n, m.shop);
        else this.menu = { type: "useItem", index: 0, item: m.item, qty: m.n };
      }
      return;
    }
    if (m.type === "useItem") {
      const n = this.st.party.length;
      if (Input.consume("up")) { m.index = (m.index + n - 1) % n; Audio2.blip(); }
      if (Input.consume("down")) { m.index = (m.index + 1) % n; Audio2.blip(); }
      if (Input.consume("b")) { this.menu = { type: "bag", index: 0 }; Audio2.cancel(); }
      if (Input.consume("a")) this.useItem(m.item, this.st.party[m.index], m.qty);
      return;
    }
    if (m.type === "shop") {
      const list = m.shop;
      if (Input.consume("up")) { m.index = (m.index + list.length - 1) % list.length; Audio2.blip(); }
      if (Input.consume("down")) { m.index = (m.index + 1) % list.length; Audio2.blip(); }
      if (Input.consume("b")) { this.menu = null; Audio2.cancel(); this.dlg.say("VOLTE SEMPRE!"); }
      if (Input.consume("a")) {
        const { item, price } = list[m.index];
        const cap = Math.min(999, Math.floor(this.st.money / price));
        if (cap < 1) {
          Audio2.cancel();
          this.menu = null;
          this.dlg.say("DESCULPA, VOCÊ NÃO TEM DINHEIRO SUFICIENTE.");
        } else {
          Audio2.select();
          this.menu = { type: "qty", item, price, n: 1, max: cap, next: "buy", shop: list };
        }
      }
      return;
    }
    if (m.type === "tutorMon") {            // escolhe o Pokémon
      const n = this.st.party.length;
      if (Input.consume("up")) { m.index = (m.index + n - 1) % n; Audio2.blip(); }
      if (Input.consume("down")) { m.index = (m.index + 1) % n; Audio2.blip(); }
      if (Input.consume("b")) { this.menu = null; Audio2.cancel(); this.dlg.say(DB.STORY.joy.tchau); }
      if (Input.consume("a")) {
        const mon = this.st.party[m.index];
        const lista = this.golpesDisponiveis(mon);
        if (!lista.length) {
          Audio2.cancel();
          this.menu = null;
          return void this.dlg.say(DB.STORY.joy.semGolpe.replace("{MON}", mon.nickname));
        }
        Audio2.select();
        this.menu = { type: "tutorGolpe", index: 0, top: 0, mon, lista };
      }
      return;
    }
    if (m.type === "tutorGolpe") {          // escolhe o golpe novo
      const n = m.lista.length;
      if (Input.consume("up")) { m.index = (m.index + n - 1) % n; Audio2.blip(); }
      if (Input.consume("down")) { m.index = (m.index + 1) % n; Audio2.blip(); }
      m.top = Math.min(Math.max(m.top, m.index - 4), m.index);
      if (Input.consume("b")) { this.menu = { type: "tutorMon", index: 0 }; Audio2.cancel(); }
      if (Input.consume("a")) {
        Audio2.select();
        const id = m.lista[m.index];
        if (m.mon.moves.length < 4) return this.ensinarGolpe(m.mon, id);
        this.menu = { type: "tutorSlot", index: 0, mon: m.mon, novo: id, volta: m };
      }
      return;
    }
    if (m.type === "tutorSlot") {           // com 4 golpes: qual sai
      const n = m.mon.moves.length;
      if (Input.consume("up")) { m.index = (m.index + n - 1) % n; Audio2.blip(); }
      if (Input.consume("down")) { m.index = (m.index + 1) % n; Audio2.blip(); }
      if (Input.consume("b")) { this.menu = m.volta; Audio2.cancel(); }
      if (Input.consume("a")) { Audio2.select(); this.ensinarGolpe(m.mon, m.novo, m.index); }
      return;
    }
    if (m.type === "box") {
      const box = (this.st.box ||= []);
      const lista = m.lado === "box" ? box : this.st.party;
      const n = lista.length;
      if (Input.consume("left") || Input.consume("right")) {
        m.lado = m.lado === "box" ? "equipe" : "box";
        m.index = 0; m.top = 0; Audio2.blip();
        return;
      }
      if (n) {
        if (Input.consume("up")) { m.index = (m.index + n - 1) % n; Audio2.blip(); }
        if (Input.consume("down")) { m.index = (m.index + 1) % n; Audio2.blip(); }
        m.top = Math.min(Math.max(m.top, m.index - (BOX_LINHAS - 1)), m.index);   // rolagem
      } else m.index = 0;
      if (Input.consume("b")) {
        this.menu = { type: "main", index: this.itensMenu().indexOf("BOX") };
        Audio2.cancel();
        return;
      }
      if (Input.consume("a") && n) this.moverBox(m, lista);
      return;
    }
    if (m.type === "fios") {
      const g = m.grid;
      if (Input.consume("up")) { m.cy = (m.cy + FIO_H - 1) % FIO_H; Audio2.blip(); }
      if (Input.consume("down")) { m.cy = (m.cy + 1) % FIO_H; Audio2.blip(); }
      if (Input.consume("left")) { m.cx = (m.cx + FIO_W - 1) % FIO_W; Audio2.blip(); }
      if (Input.consume("right")) { m.cx = (m.cx + 1) % FIO_W; Audio2.blip(); }
      if (Input.consume("b")) {
        this.menu = null; Audio2.cancel();
        return void this.dlg.say(DB.STORY.fios.desistiu);
      }
      if (Input.consume("a")) {
        g[m.cy][m.cx] = gira(g[m.cy][m.cx]);
        Audio2.tone(240 + 60 * (g[m.cy][m.cx] & 3), 0.05, "square", 0.5);
        if (fiosResolvido(g)) return this.fiosVenceu();
      }
      return;
    }
    if (m.type === "voo") {
      const n = m.destinos.length;
      if (Input.consume("up")) { m.index = (m.index + n - 1) % n; Audio2.blip(); }
      if (Input.consume("down")) { m.index = (m.index + 1) % n; Audio2.blip(); }
      if (Input.consume("b")) { this.menu = null; Audio2.cancel(); }
      if (Input.consume("a")) { Audio2.select(); this.voarPara(m.destinos[m.index][0]); }
      return;
    }
    if (m.type === "give") {
      const n = m.lista.length;
      const passo = Input.held("run") ? 10 : 1;
      if (Input.consume("up")) { m.index = (m.index + n - 1) % n; Audio2.blip(); }
      if (Input.consume("down")) { m.index = (m.index + 1) % n; Audio2.blip(); }
      if (Input.consume("left")) { m.lvl = Math.max(1, m.lvl - passo); Audio2.blip(); }
      if (Input.consume("right")) { m.lvl = Math.min(100, m.lvl + passo); Audio2.blip(); }
      if (Input.consume("select")) { m.shiny = !m.shiny; Audio2.select(); }   // tecla C
      m.top = Math.min(Math.max(m.top, m.index - 5), m.index);                // rolagem
      if (Input.consume("b")) { this.menu = null; Audio2.cancel(); }
      if (Input.consume("a")) this.baixarMon(m);
      return;
    }
    if (m.type === "opts") {
      const n = 5;
      if (Input.consume("up")) m.index = (m.index + n - 1) % n;
      if (Input.consume("down")) m.index = (m.index + 1) % n;
      if (Input.consume("b")) {
        this.menu = { type: "main", index: this.itensMenu().indexOf("OPÇÕES") };
        Audio2.cancel();
      }
      // velocidade e idioma andam pros dois lados; o resto é liga/desliga no Z
      const lado = Input.consume("right") ? 1 : Input.consume("left") ? -1 : 0;
      if (lado && m.index === 2) this.mudaVelocidade(lado);
      if (lado && m.index === 3) this.mudaIdioma(lado);
      if (Input.consume("a")) {
        Audio2.select();
        if (m.index === 0) Glitch.scanlines = !Glitch.scanlines;
        else if (m.index === 1) Audio2.toggleMute();
        else if (m.index === 2) this.mudaVelocidade(1);
        else if (m.index === 3) this.mudaIdioma(1);
        else { Save.clear(); this.menu = null; this.dlg.say("SAVE APAGADO. RECARREGUE A PÁGINA."); }
      }
    }
  }

  // -------------------------------------------------------------- render
  render(ctx) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
    // O TREMOR do bote sacode o MUNDO, e não a interface: a caixa de texto e o
    // menu tremendo junto viram tela quebrada, não pancada.
    const sacode = this.tremor > 0;
    if (sacode) {
      ctx.save();
      ctx.translate(Math.round((Math.random() * 2 - 1) * this.tremor * 3),
                    Math.round((Math.random() * 2 - 1) * this.tremor * 3));
    }
    // antes de qualquer desenho: o companheiro tem que saber deste passo
    this.sincronizarCompanheiro();
    const cx = Math.round(this.cam.x), cy = Math.round(this.cam.y);

    const art = mapArt(this.st.player.map);
    if (art) ctx.drawImage(art, -cx, -cy);
    else drawText(ctx, "CARREGANDO MAPA...", 60, 76, "#f4f4f4");

    // o que abriu durante o jogo (barreira, portas do quiz) some do desenho:
    // cada tile aberto é coberto por um tile de chão limpo do próprio mapa
    if (art) {
      for (const [k, piso] of this.tilesAbertos()) {
        if (!piso) continue;
        const [fx, fy] = piso.split(",").map(Number);
        const [tx, ty] = k.split(",").map(Number);
        ctx.drawImage(art, fx * TILE, fy * TILE, TILE, TILE,
                      tx * TILE - cx, ty * TILE - cy, TILE, TILE);
      }
    }

    const actors = [];
    for (const n of this.npcsHere()) {
      // `invisivel` nasce sem sprite (item escondido); `hidden` some depois de pego
      if (n.invisivel || this.st.npcState[`${this.st.player.map}.${n.id}`]?.hidden) continue;
      actors.push({ y: n.y, draw: () => this.drawNpc(ctx, n, cx, cy) });
    }
    // OS SELVAGENS À VISTA e o COMPANHEIRO entram na MESMA lista de atores que
    // o resto: assim eles passam por trás e pela frente das coisas na ordem
    // certa, em vez de flutuarem por cima do mundo.
    for (const b of this.selvagens || []) {
      actors.push({ y: b.y, draw: () => this.drawSelvagem(ctx, b, cx, cy) });
    }
    const segue = this.quemSegue();
    if (segue && this.compa && !this.st.surfando) {
      actors.push({ y: this.compa.y, draw: () => this.drawCompanheiro(ctx, segue, cx, cy) });
    }
    for (const o of this.pedrasAqui()) {
      const [ox, oy] = o.split(",").map(Number);
      actors.push({ y: oy, draw: () => ctx.drawImage(Assets.rocha, ox * TILE - cx, oy * TILE - cy, TILE, TILE) });
    }
    for (const b of this.blocosAqui()) {
      actors.push({ y: b.y, draw: () => ctx.drawImage(Assets.bloco, b.x * TILE - cx, b.y * TILE - cy, TILE, TILE) });
    }
    // os outros jogadores da sala entram na MESMA lista de atores, então eles
    // passam por trás e pela frente das coisas como qualquer NPC
    for (const outro of Online.noMapa(this.st.player.map)) {
      actors.push({ y: outro.y, draw: () => this.drawPeer(ctx, outro, cx, cy) });
    }
    const { px, py } = this.playerPixel(true);
    actors.push({ y: this.st.player.y, draw: () => this.drawPlayer(ctx, px - cx, py - cy) });
    actors.sort((a, b) => a.y - b.y).forEach((a) => a.draw());

    // camada de cima: o jogador passa POR TRÁS de copa de árvore, telhado, batente
    const over = mapOverlay(this.st.player.map);
    if (over) ctx.drawImage(over, -cx, -cy);

    if (this.rustle) {
      const f = Math.min(2, Math.floor(this.rustle.t / 0.12));
      ctx.drawImage(Assets.rustle[f], this.rustle.x * TILE - cx, this.rustle.y * TILE - cy);
    }

    // O escuro (céu de noite ou caverna) com as lanternas abrindo buraco nele.
    // Vai por cima do mundo e dos bichos, e por baixo de tudo que é interface:
    // escurecer o mapa é o efeito; escurecer a caixa de texto seria só deixar o
    // jogo difícil de ler. Na fenda o escuro é outro assunto.
    if (this.st.player.map !== "glitchdim") this.drawEscuro(ctx, cx, cy);
    // com o céu aberto o mapa não aparece: o desenho é opaco e cobre tudo
    if (this.olhando) this.drawCeu(ctx);

    // o efeito do sanduíche, enquanto vale: sem isto ele seria um texto que
    // aconteceu uma vez e nunca mais se soube
    const b = buff(this.st);
    if (b?.hud) {
      panel(ctx, 4, 4, 58, 18);
      drawText(ctx, `${b.hud} ${Math.ceil(minutosDoBuff(this.st))}M`, 9, 9, PAL.ink);
    }

    const left = this.st.mission?.left;
    if (left > 0 && this.st.player.map === "glitchdim") {
      const mm = Math.floor(left / 60), ss = Math.floor(left % 60);
      const txt = `FENDA ${mm}:${String(ss).padStart(2, "0")}`;
      panel(ctx, W - 72, 4, 68, 18);
      drawText(ctx, txt, W - 66, 9, left < 30 ? "#e0524a" : PAL.ink);
    }

    if (sacode) ctx.restore();
    if (this.clarao > 0) fade(ctx, this.clarao, "#ff5566");
    if (this.aviso) this.drawAviso(ctx);

    // balões e nomes vão POR CIMA do telhado: senão o nome some dentro de casa
    for (const outro of Online.noMapa(this.st.player.map)) this.drawPeerTag(ctx, outro, cx, cy);
    if (Online.aviso) this.drawAvisoOnline(ctx);
    this.drawSinal(ctx);

    this.drawVida(ctx);
    if (this.banner > 0) this.drawBanner(ctx);
    if (this.menu) this.drawMenu(ctx);
    this.dlg.render(ctx);
    if (this.fadeA > 0) fade(ctx, this.fadeA);
    if (this.fx) this.drawBattleFx(ctx);
  }

  /** Entrada de batalha: três flashes e as barras fechando. */
  drawBattleFx(ctx) {
    const t = this.fx.t;
    if (t < 0.45) {
      const on = Math.floor(t / 0.075) % 2 === 0;
      if (on) { ctx.fillStyle = "#ffffff"; ctx.globalAlpha = 0.75; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
      return;
    }
    const k = Math.min(1, (t - 0.45) / 0.5);
    const bar = Math.ceil(k * (H / 2));
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, bar);
    ctx.fillRect(0, H - bar, W, bar);
  }

  drawPlayer(ctx, x, y) {
    const nadando = !!this.st.surfando;
    const set = Assets.actor("hero")[this.st.player.dir];
    // andando: um quadro de passo por tile, alternando a perna (o ciclo do GBA).
    // nadando: quadro parado sempre — quem se mexe é o Pokémon, o herói só vira.
    const img = this.move && !nadando ? set[this.stepParity ? 1 : 3] : set[0];
    ctx.drawImage(img, Math.round(x), Math.round(y) + TILE - img.height);
    if (nadando) {
      // o Pokémon vem POR CIMA, cobrindo o herói da cintura pra baixo
      const mon = Assets.mon(this.st.surfando, 7);
      const bob = Math.sin(performance.now() / 260) * 1.2;    // sobe e desce na água
      ctx.drawImage(mon, Math.round(x) - 5, Math.round(y + 4 + bob), 26, 26);
    }
  }

  /** Outro jogador andando no mesmo mapa. */
  drawPeer(ctx, p, cx, cy) {
    const x = Math.round(p.px - cx), y = Math.round(p.py - cy);
    const set = Assets.actor(p.sprite || "hero")[p.dir || "down"] || Assets.actor("hero").down;
    const img = p.passo > 0 ? set[(p.passo | 0) % 2 ? 1 : 3] : set[0];
    ctx.drawImage(img, x, y + TILE - img.height);
  }

  /** Nome e balão de fala do outro jogador. */
  drawPeerTag(ctx, p, cx, cy) {
    const x = Math.round(p.px - cx), y = Math.round(p.py - cy);
    if (x < -40 || x > W + 40 || y < -40 || y > H + 40) return;
    const nome = String(p.nome || "?").toUpperCase();
    const larg = nome.length * 6;
    drawText(ctx, nome, x + 8 - larg / 2, y - 10, "#f4f4f4", { shadow: "#101018" });

    if (p.emote) {
      const e = (DB.EMOTES || [])[p.emote.i] || "!";
      drawText(ctx, e, x + 6, y - 22, PAL.glitch, { shadow: "#101018" });
    }
    if (p.balao) {
      const t = p.balao.texto.slice(0, 24);
      const w = t.length * 6 + 12;
      const bx = Math.max(2, Math.min(W - w - 2, x + 8 - w / 2));
      panel(ctx, bx, y - 34, w, 20);
      drawText(ctx, t, bx + 6, y - 30, PAL.ink);
    }
  }

  /** As barras de sinal no canto, enquanto você está numa sala. Elas dizem se
   *  o servidor está respondendo rápido — não se você "pode" jogar online. */
  drawSinal(ctx) {
    if (!DB.ONLINE?.ativo || !Online.naSala()) return;
    // desce pra baixo do relógio da fenda quando ele está na tela
    const y = (this.st.mission?.left > 0 && this.st.player.map === "glitchdim") ? 26 : 6;
    panel(ctx, W - 30, y - 2, 26, 16);
    sinal(ctx, W - 26, y + 1, Online.barras());
  }

  /** "FULANO ENTROU NA SALA" no canto, por alguns segundos. */
  drawAvisoOnline(ctx) {
    const t = Online.aviso;
    ctx.globalAlpha = Math.min(1, Online.avisoT / 0.6);
    panel(ctx, 2, H - 30, Math.min(W - 4, t.length * 6 + 14), 18);
    drawText(ctx, t, 8, H - 25, PAL.ink);
    ctx.globalAlpha = 1;
  }

  /** Um selvagem no mato. É o sprite de batalha, pequeno e saltitando: o jogo
   *  não tem arte de overworld pra Pokémon nenhum, e inventar 151 seria outro
   *  projeto. Pequeno o bastante pra não virar um NPC, grande o bastante pra
   *  dar pra reconhecer a espécie de longe — que é a razão de eles existirem. */
  drawSelvagem(ctx, b, cx, cy) {
    const bruto = Assets.mon(b.mon.species, b.mon.seed);
    if (!bruto) return;
    // shiny no mato aparece shiny: o brilho é a informação que faz alguém
    // atravessar a rota correndo, e escondê-la até a batalha seria escondê-la
    const img = b.mon.shiny ? Assets.shiny(bruto) : bruto;
    const caca = cacando(b, this.st.player);
    const corre = !caca && fugindo(b, this.st.player);
    // quem está caçando pula mais rápido e mais alto: o bicho parece afobado
    // antes de você ler o aviso, e é assim que se avisa sem texto. O ARISCO
    // também se mexe mais — só que fugindo, e sem o aviso vermelho: ele não é
    // uma ameaça a caminho, é uma coisa saindo de perto.
    const vel = caca ? 150 : corre ? 200 : 380;
    const pulo = Math.abs(Math.sin(performance.now() / vel + b.x * 1.7 + b.y)) * (caca || corre ? 4 : 2);
    const x = Math.round(b.x * TILE - cx - 6), y = Math.round(b.y * TILE - cy - 12 - pulo);
    ctx.drawImage(img, x, y, 28, 28);
    // e o AVISO em cima dele. Perseguidor sem aviso é armadilha: quem toma uma
    // batalha que não pediu tem que ter tido a chance de ver ela chegando.
    if (caca && Math.floor(performance.now() / 220) % 2 === 0) {
      drawText(ctx, "!", x + 11, y - 8, "#ff5566", { shadow: "#2b0a12" });
    }
  }

  /** O COMPANHEIRO, no compasso do seu passo. Interpolar com a MESMA fração do
   *  seu movimento é o que faz ele andar junto: com posição de tile inteiro ele
   *  pula de casa em casa enquanto você desliza, e a tela parece destravada. */
  drawCompanheiro(ctx, mon, cx, cy) {
    const img = Assets.mon(mon.species, mon.seed);
    if (!img) return;
    const c = this.compa;
    const k = this.move ? this.move.n / this.move.total : 1;
    const x = (c.de.x + (c.x - c.de.x) * k) * TILE - cx;
    const y = (c.de.y + (c.y - c.de.y) * k) * TILE - cy;
    const pulo = this.move ? Math.abs(Math.sin(k * Math.PI)) * 2 : 0;
    ctx.drawImage(img, Math.round(x - 6), Math.round(y - 12 - pulo), 28, 28);
  }

  drawNpc(ctx, n, cx, cy) {
    const x = n.x * TILE - cx, y = n.y * TILE - cy;
    if (n.sprite === "ball") return void ctx.drawImage(Assets.ball, x + 4, y + 4);
    if (n.sprite === "portal") {
      const t = performance.now() / 200;
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = ["#b455ff", "#00ffcc", "#ff0066", "#ffffff"][(i + Math.floor(t)) % 4];
        const s2 = 14 - i * 3;
        ctx.fillRect(x + (16 - s2) / 2, y + (16 - s2) / 2, s2, s2);
      }
      return;
    }
    // A DISTORÇÃO: um quadrado de ar que não está no lugar. Ela não é um buraco
    // como o rasgo — ela é o MESMO pedaço de mundo, repetido fora de hora, então
    // o desenho é uma moldura que respira e um miolo que troca de cor devagar.
    // Rápido demais viraria irmão do rasgo, e são coisas diferentes.
    if (n.sprite === "distorcao") {
      const t = performance.now() / 700;
      const cx2 = x + 8, cy2 = y + 8;
      // ELA TEM QUE SER VISTA DE LONGE, E NUMA FLORESTA ESCURA. A primeira
      // versão tinha um MIOLO PRETO e molduras claras finas: no meio das
      // árvores, o preto virava sombra de copa e as molduras sumiam no verde —
      // ela lia como buraco do cenário, não como coisa mágica. Agora é o
      // contrário: o miolo é a parte mais CLARA da tela e o brilho em volta
      // levanta ela do mato. Nada escuro, porque a floresta já é escura.
      ctx.globalAlpha = 0.22 + Math.sin(t * 2) * 0.08;
      ctx.fillStyle = "#bff4ff";
      ctx.fillRect(cx2 - 28, cy2 - 28, 56, 56);
      const cores = ["#ffffff", "#7ff0ff", "#d99bff"];
      for (let i = 0; i < 3; i++) {
        const d = 23 - i * 6 + Math.sin(t * 1.6 + i * 0.9) * 3;
        ctx.globalAlpha = 0.95 - i * 0.16;
        ctx.strokeStyle = cores[i];
        ctx.lineWidth = 2;
        ctx.strokeRect(Math.round(cx2 - d), Math.round(cy2 - d), Math.round(d * 2), Math.round(d * 2));
      }
      // faíscas girando: é o que diz "encosta em mim" sem escrever nada
      for (let i = 0; i < 5; i++) {
        const a = t * 1.1 + (i * Math.PI * 2) / 5;
        const raio = 17 + Math.sin(t * 2.3 + i) * 4;
        ctx.globalAlpha = 0.6 + Math.sin(t * 3 + i) * 0.35;
        ctx.fillStyle = i % 2 ? "#ffffff" : "#7ff0ff";
        ctx.fillRect(Math.round(cx2 + Math.cos(a) * raio) - 1,
                     Math.round(cy2 + Math.sin(a) * raio) - 1, 2, 2);
      }
      const r = 6 + Math.sin(t * 3) * 2;
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#7ff0ff";
      ctx.fillRect(Math.round(cx2 - r - 1), Math.round(cy2 - r - 1), Math.round(r * 2 + 2), Math.round(r * 2 + 2));
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(Math.round(cx2 - r), Math.round(cy2 - r), Math.round(r * 2), Math.round(r * 2));
      ctx.globalAlpha = 1;
      return;
    }
    // O RASGO: faixas tortas que não param quietas, empilhadas num buraco alto
    // demais pro tile. Não é um sprite — é o desenho falhando naquele pedaço.
    if (n.sprite === "rasgo") {
      // sem sustos ele pisca bem mais devagar: a mesma imagem, sem a
      // estroboscopia que faz o olho reagir antes da cabeça
      const t = performance.now() / (DB.CONFIG?.sustos ? 90 : 300);
      const cores = ["#b455ff", "#00ffcc", "#ff0066", "#ffffff"];
      const meio = x + 8, topo = y - 14;
      // o miolo: o buraco propriamente dito, que é onde não tem desenho nenhum
      for (let i = 0; i < 13; i++) {
        const larg = Math.round((20 - Math.abs(i - 6) * 2.6) * 1.35);
        const jitter = Math.round(Math.sin((t + i * 1.9) * 0.8) * 2);
        ctx.fillStyle = "#0a0810";
        ctx.fillRect(meio - larg / 2 + jitter, topo + i * 3, larg, 3);
      }
      // e as faixas que escapam dele pros lados, trocando de cor sozinhas
      for (let i = 0; i < 13; i++) {
        if ((i + Math.floor(t)) % 3) continue;
        const larg = Math.round((20 - Math.abs(i - 6) * 2.6) * 1.35) + 6;
        const jitter = Math.round(Math.sin((t + i * 1.9) * 0.8) * 4);
        ctx.fillStyle = cores[(i + Math.floor(t * 1.7)) % cores.length];
        ctx.fillRect(meio - larg / 2 + jitter, topo + i * 3, larg, 2);
      }
      return;
    }
    if (n.sprite.startsWith("mon:")) {
      const img = Assets.mon(n.sprite.slice(4), 7);
      return void ctx.drawImage(img, x - 12, y - 24, 40, 40);
    }
    const img = Assets.actor(n.sprite)[n.dir || "down"][0];
    ctx.drawImage(img, x, y + TILE - img.height);
  }

  /** A SUA vida, no canto de baixo. Só aparece quando falta alguma coisa: uma
   *  barra sempre cheia na tela é enfeite, e o jogo passa a maior parte do tempo
   *  sem ninguém batendo em você. */
  drawVida(ctx) {
    const max = this.vidaMax();
    const v = this.vidaAgora();
    if (v >= max) return;
    const larg = 46;
    const x = 4, y = H - 12;
    panel(ctx, x, y - 4, larg + 8, 14);
    bar(ctx, x + 4, y, larg, 4, v / max, v / max > 0.5 ? PAL.hpGreen : v / max > 0.25 ? PAL.hpYellow : PAL.hpRed);
  }

  /** O recado do bote, no alto e sem caixa. Some sozinho. */
  drawAviso(ctx) {
    const a = this.aviso;
    const txt = String(a.txt);
    const w = txt.length * 6 + 12;
    ctx.globalAlpha = Math.min(1, a.t * 1.6);
    // Abaixo do nome do mapa, e não em cima dele: os dois aparecem juntos quando
    // você toma pancada logo depois de entrar numa rota, e empilhados viravam
    // uma coisa só ilegível.
    panel(ctx, Math.max(2, (W - w) / 2), 24, Math.min(W - 4, w), 16);
    drawText(ctx, txt, Math.max(8, (W - txt.length * 6) / 2), 28, "#e0524a");
    ctx.globalAlpha = 1;
  }

  drawBanner(ctx) {
    ctx.globalAlpha = Math.min(1, this.banner / 0.4);
    panel(ctx, 4, 4, this.map.name.length * 6 + 16, 20);
    drawText(ctx, this.map.name, 12, 10, PAL.ink);
    ctx.globalAlpha = 1;
  }

  /** As duas gavetas da máquina e a saída, desenhadas na tela do menu. */
  desenhaGavetas(ctx, x, y) {
    const cx = (bx, by, mon) => {
      ctx.fillStyle = PAL.ink;
      ctx.fillRect(bx, by, 26, 26);
      ctx.fillStyle = "#0a0614";
      ctx.fillRect(bx + 1, by + 1, 24, 24);
      if (mon) ctx.drawImage(Assets.mon(mon.species, mon.seed), bx + 1, by + 1, 24, 24);
    };
    const p = this.st.party;
    cx(x, y, p[0]);
    drawText(ctx, "+", x + 29, y + 9, PAL.ink);
    cx(x + 38, y, p[1]);
    drawText(ctx, "=", x + 29, y + 37, PAL.ink);
    cx(x + 19, y + 32, null);
    drawText(ctx, "?", x + 30, y + 41, PAL.glitch);
  }

  drawMenu(ctx) {
    const m = this.menu;
    if (m.type === "main") {
      const items = this.itensMenu();
      const w = 84, x = W - w - 4, y = 4;
      panel(ctx, x, y, w, items.length * LINE_H + 8);
      items.forEach((it, i) => {
        drawText(ctx, it, x + 14, y + 4 + i * LINE_H, PAL.ink);
        if (i === m.index) cursor(ctx, x + 6, y + 4 + i * LINE_H);
      });
      return;
    }
    if (m.type === "party") {
      panel(ctx, 4, 4, W - 8, H - 8);
      drawText(ctx, "EQUIPE", 12, 10, PAL.ink);
      this.st.party.forEach((mon, i) => {
        const y = 24 + i * 24;
        if (i === m.index) cursor(ctx, 8, y + 7);
        ctx.drawImage(Assets.mon(mon.species, mon.seed), 16, y - 2, 24, 24);
        drawText(ctx, mon.nickname, 46, y + 2, PAL.ink);
        drawText(ctx, `N${mon.level}`, 152, y + 2, PAL.ink);
        bar(ctx, 46, y + 14, 76, 4, hpPct(mon), hpColor(hpPct(mon)));
        drawText(ctx, `${mon.hp}/${mon.maxHp}`, 130, y + 11, PAL.ink2);
        if (mon.corrupt) drawText(ctx, "!", 200, y + 2, PAL.glitch);
      });
      drawText(ctx, "X VOLTA", 180, H - 20, PAL.ink2);
      return;
    }
    if (m.type === "oficinaDigitar") {
      const F = DB.STORY.fusao;
      panel(ctx, 4, 4, W - 8, H - 8);
      drawText(ctx, F.digitarTitulo, 12, 10, PAL.glitch);
      [F.digitarCabeca, F.digitarCorpo].forEach((rot, i) => {
        const y = 30 + i * 24;
        if (m.linha === i) cursor(ctx, 10, y);
        drawText(ctx, rot, 22, y, PAL.ink);
        const sp = m.ids[i] && DB.SPECIES[m.ids[i]];
        const escrevendo = Texto.ativo() && m.linha === i;
        const txt = escrevendo ? Texto.buf() + ((this.animT * 3) % 1 > 0.5 ? "_" : "")
          : (m.textos[i] || F.digitarVazio);
        drawText(ctx, String(txt).slice(0, 14), 72, y, sp ? PAL.glitch : PAL.ink2);
        if (sp) {
          ctx.drawImage(Assets.mon(sp.id, 7), 158, y - 8, 24, 24);
          drawText(ctx, `${String(sp.dex || 0).padStart(3, "0")}`, 188, y, PAL.ink2);
        }
      });
      // a prévia: o que sai dessa dupla, mesmo sem ter nenhum dos dois
      const preview = m.ids[0] && m.ids[1] ? montarEspecie(m.ids[0], m.ids[1]) : null;
      if (preview) {
        DB.SPECIES[preview.id] = preview;
        ctx.drawImage(Assets.mon(preview.id, 7), 20, 84, 40, 40);
        drawText(ctx, preview.name, 68, 92, PAL.glitch);
        drawText(ctx, preview.types.join("/"), 68, 104, PAL.ink2);
        drawText(ctx, preview.codigo, 68, 116, PAL.ink2);
      }
      if (m.linha === 2) cursor(ctx, 10, 132);
      drawText(ctx, F.digitarAbrir, 22, 132, preview ? PAL.ink : PAL.ink2);
      const ajuda = [].concat(F.digitarAjuda);
      drawText(ctx, ajuda[Math.floor(this.animT / 3) % ajuda.length], 8, H - 12, PAL.ink2);
      return;
    }
    if (m.type === "missoes") {
      const T = DB.MISSAO_TEXTO;
      const lista = diario(this.st);
      panel(ctx, 4, 4, W - 8, H - 8);
      drawText(ctx, T.titulo, 12, 10, PAL.glitch);
      drawText(ctx, `${feitas(this.st)}/${(DB.MISSOES || []).length}`, 200, 10, PAL.ink2);
      if (!lista.length) drawText(ctx, T.vazio, 20, 34, PAL.ink2);
      lista.slice(m.top || 0, (m.top || 0) + 4).forEach((l, i) => {
        const idx = (m.top || 0) + i;
        const y = 26 + i * 30;
        if (idx === m.index) cursor(ctx, 8, y + 4);
        const cor = l.estado === "pronta" ? "#00ffcc" : l.estado === "feita" ? PAL.ink2 : PAL.ink;
        drawText(ctx, l.missao.nome.slice(0, 24), 18, y, cor);
        drawText(ctx, T.estados[l.estado] || "", 18, y + 10, l.estado === "pronta" ? "#00ffcc" : PAL.ink2);
        // contador só quando o objetivo é de juntar mais de um
        if (l.progresso.alvo > 1 && l.estado !== "feita") {
          drawText(ctx, `${l.progresso.atual}/${l.progresso.alvo}`, 200, y + 10, PAL.glitch);
        }
        drawText(ctx, l.missao.resumo.slice(0, 38), 18, y + 20, PAL.ink2);
      });
      drawText(ctx, T.ajuda, 190, H - 18, PAL.ink2);
      return;
    }
    if (m.type === "genoma") {
      const F = DB.STORY.fusao;
      panel(ctx, 4, 4, W - 8, H - 8);
      drawText(ctx, F.titulo, 12, 10, PAL.glitch);
      drawText(ctx, `${DB.FUSAO.combinacoes} COMBINAÇÕES`, 12, 22, PAL.ink2);
      F.menu.forEach((o, i) => {
        const y = 46 + i * LINE_H;
        drawText(ctx, o, 32, y, PAL.ink);
        if (i === m.index) cursor(ctx, 20, y);
      });
      // as duas gavetas e a saída, do jeito que estão desenhadas na carcaça
      this.desenhaGavetas(ctx, 130, 44);
      drawText(ctx, F.ajuda, 12, H - 22, PAL.ink2);
      return;
    }
    if (m.type === "fusaoVersao") {
      const F = DB.STORY.fusao;
      const p = partes(m.mon.species);
      panel(ctx, 4, 4, W - 8, H - 8);
      drawText(ctx, F.escolheVersao, 12, 10, PAL.glitch);
      m.lista.forEach((v, i) => {
        const y = 26 + i * 20;
        if (y > 118) return;
        if (i === m.index) cursor(ctx, 8, y + 4);
        const sp = previsao({ species: p.cabeca }, { species: p.corpo }, v.variante);
        if (sp) ctx.drawImage(Assets.mon(sp.id, m.mon.seed), 16, y - 2, 20, 20);
        const atual = m.mon.species === (sp?.id || "");
        drawText(ctx, (sp?.name || "?").slice(0, 12), 42, y + 2,
                 atual ? PAL.ink2 : v.origem === "jogo" ? "#f0c419" : v.origem === "auto" ? PAL.ink : "#59d99b");
        drawText(ctx, v.rotulo.slice(0, 12), 130, y + 2, PAL.ink2);
        if (atual) drawText(ctx, "*", 224, y + 2, "#00ffcc");
      });
      drawText(ctx, F.ajuda, 12, H - 22, PAL.ink2);
      return;
    }
    if (m.type === "fusaoCabeca" || m.type === "fusaoCorpo" || m.type === "fusaoAbrir") {
      const F = DB.STORY.fusao;
      panel(ctx, 4, 4, W - 8, H - 8);
      const titulo = m.type === "fusaoAbrir" ? (m.modo === "versao" ? F.escolheTrocar : F.escolheFusao)
        : m.type === "fusaoCorpo" ? F.escolheCorpo
        : m.modo === "concurso" ? DB.CONCURSO.anfitria.escolha
        : m.modo === "oficina" ? F.escolheOficina : F.escolheCabeca;
      drawText(ctx, titulo, 12, 10, PAL.glitch);
      const escolhido = m.lista[m.index];
      m.lista.forEach((mon, i) => {
        const y = 26 + i * 18;
        if (y > 118) return;
        if (i === m.index) cursor(ctx, 8, y + 4);
        ctx.drawImage(Assets.mon(mon.species, mon.seed), 16, y, 18, 18);
        drawText(ctx, mon.nickname.slice(0, 11), 38, y + 5, ehFusao(mon) ? PAL.glitch : PAL.ink);
        drawText(ctx, `N${mon.level}`, 112, y + 5, PAL.ink2);
      });
      // a vitrine da direita: o que sai se você confirmar
      panel(ctx, 142, 22, 92, 100);
      if (m.type === "fusaoCorpo") {
        const vs = variantes(m.cabeca.species, escolhido.species);
        const atual = vs[Math.min(m.variante || 0, vs.length - 1)] || vs[0];
        const sp = previsao(m.cabeca, escolhido, atual.variante);
        if (sp) {
          ctx.drawImage(Assets.mon(sp.id, m.cabeca.seed), 164, 26, 48, 48);
          drawText(ctx, sp.name, 148, 78, PAL.ink);
          drawText(ctx, sp.types.join("/").slice(0, 14), 148, 90, PAL.ink2);
          drawText(ctx, `TOTAL ${sp.bst}`, 148, 100, PAL.ink2);
          // FICHA AO CONTRÁRIO: existe desenho pra essa dupla, mas com os lados
          // trocados. A etiqueta agora diz o NOME dela, e não só que ela
          // existe: "AO CONTRÁRIO" sozinho é um diagnóstico — quem lê não
          // descobre que tem um BASTIORDOS pronto do outro lado, e vai embora
          // achando que o desenho sumiu.
          const inv = atual.origem === "auto" && vs.length === 1
            ? versoesInvertidas(m.cabeca.species, escolhido.species) : null;
          const avessa = inv?.quantas > 0;
          const cor = atual.origem === "sua" ? "#00ffcc"
            : atual.origem === "jogo" ? "#f0c419"
            : atual.origem === "jogador" ? "#59d99b"
            : avessa ? "#f0c419" : PAL.ink2;
          drawText(ctx, avessa ? (inv.nome || "?").slice(0, 15) : atual.rotulo, 148, 110, cor);
          if (avessa) drawText(ctx, F.fichaAoContrario, 148, 120, "#f0c419");
          else if (vs.length > 1) drawText(ctx, `C ${(m.variante || 0) + 1}/${vs.length}`, 148, 120, PAL.ink2);
        } else drawText(ctx, F.naoDaParaFundir.slice(0, 14), 148, 60, PAL.ink2);
      } else if (escolhido) {
        ctx.drawImage(Assets.mon(escolhido.species, escolhido.seed), 164, 26, 48, 48);
        drawText(ctx, escolhido.nickname.slice(0, 14), 148, 78, PAL.ink);
        const sp = DB.SPECIES[escolhido.species];
        drawText(ctx, sp.types.join("/").slice(0, 14), 148, 90, PAL.ink2);
        drawText(ctx, `TOTAL ${sp.bst}`, 148, 100, PAL.ink2);
        if (sp.codigo) drawText(ctx, sp.codigo, 148, 110, PAL.glitch);
      }
      drawText(ctx, F.ajuda, 12, H - 22, PAL.ink2);
      return;
    }
    if (m.type === "qty") {
      panel(ctx, 30, 50, 180, 60);
      drawText(ctx, m.item.toUpperCase(), 40, 58, PAL.ink);
      drawText(ctx, `QUANTOS?`, 40, 72, PAL.ink2);
      drawText(ctx, `x${String(m.n).padStart(3, " ")}`, 120, 70, PAL.ink);
      if (m.price) drawText(ctx, `$${m.price * m.n}`, 120, 84, PAL.ink2);
      drawText(ctx, "CIMA/BAIXO 1  LADOS 10  SHIFT MAX", 38, 96, PAL.ink2);
      return;
    }
    if (m.type === "useItem") {
      panel(ctx, 4, 4, W - 8, H - 8);
      drawText(ctx, `USAR ${m.qty} ${m.item.toUpperCase()} EM QUEM?`, 12, 10, PAL.ink);
      this.st.party.forEach((mon, i) => {
        const y = 30 + i * 20;
        if (i === m.index) cursor(ctx, 10, y);
        drawText(ctx, mon.nickname, 22, y, PAL.ink);
        drawText(ctx, `N${mon.level}`, 140, y, PAL.ink);
        drawText(ctx, `${mon.hp}/${mon.maxHp}`, 170, y, PAL.ink2);
      });
      drawText(ctx, "X VOLTA", 180, H - 20, PAL.ink2);
      return;
    }
    if (m.type === "badges") {
      panel(ctx, 4, 4, W - 8, H - 8);
      drawText(ctx, `INSÍGNIAS  ${this.st.badges.length}/8`, 12, 10, PAL.ink);
      (DB.STORY.badges || []).forEach((b, i) => {
        const got = this.st.badges.includes(b.id);
        const x = 14 + (i % 2) * 112, y = 30 + Math.floor(i / 2) * 24;
        ctx.fillStyle = got ? "#f0c419" : "#9aa0aa";
        ctx.fillRect(x, y, 12, 12);
        ctx.fillStyle = got ? "#fff6c8" : "#c8ccd4";
        ctx.fillRect(x + 3, y + 3, 6, 6);
        drawText(ctx, b.name.replace("INSÍGNIA ", ""), x + 18, y + 2, got ? PAL.ink : PAL.ink2);
        drawText(ctx, b.city, x + 18, y + 12, PAL.ink2);
      });
      drawText(ctx, "X VOLTA", 180, H - 20, PAL.ink2);
      return;
    }
    if (m.type === "bag") {
      panel(ctx, 4, 4, W - 8, H - 8);
      drawText(ctx, "MOCHILA", 12, 10, PAL.ink);
      Object.entries(this.st.items).forEach(([k, v], i) => {
        const y = 30 + i * LINE_H;
        drawText(ctx, k.toUpperCase(), 24, y, PAL.ink);
        drawText(ctx, `x${v}`, 180, y, PAL.ink);
        if (i === m.index) cursor(ctx, 12, y);
      });
      drawText(ctx, "Z USA   X VOLTA", 20, H - 42, PAL.ink2);
      if (!Object.keys(this.st.items).length) drawText(ctx, "MOCHILA VAZIA.", 24, 30, PAL.ink2);
      drawText(ctx, `DINHEIRO: $${this.st.money}`, 20, H - 30, PAL.ink2);
      drawText(ctx, "X VOLTA", 180, H - 20, PAL.ink2);
      return;
    }
    if (m.type === "shop") {
      // A lista rola: com a barraca e os dezesseis ingredientes são dezenove
      // itens, e dezenove linhas não cabem em 160 pixels de altura. Sem isto o
      // painel passava do fim da tela e metade da loja ficava invisível.
      const JANELA = 10;
      m.top = Math.max(0, Math.min(m.top || 0, m.shop.length - JANELA));
      if (m.index < m.top) m.top = m.index;
      if (m.index >= m.top + JANELA) m.top = m.index - JANELA + 1;
      const vistos = m.shop.slice(m.top, m.top + JANELA);
      panel(ctx, 4, 4, 150, vistos.length * LINE_H + 16);
      vistos.forEach((it, k) => {
        const i = m.top + k;
        const y = 10 + k * LINE_H;
        drawText(ctx, it.item.toUpperCase(), 20, y, PAL.ink);
        drawText(ctx, `$${it.price}`, 110, y, PAL.ink);
        if (i === m.index) cursor(ctx, 10, y);
      });
      // as setinhas dizem que tem mais coisa pra cima ou pra baixo
      if (m.top > 0) drawText(ctx, "\u2191", 140, 10, PAL.ink2);
      if (m.top + JANELA < m.shop.length) drawText(ctx, "\u2193", 140, 10 + (vistos.length - 1) * LINE_H, PAL.ink2);
      drawText(ctx, `Z COMPRA  X SAI  ${m.index + 1}/${m.shop.length}`, 20, 10 + vistos.length * LINE_H, PAL.ink2);
      panel(ctx, 158, 4, 78, 22);
      drawText(ctx, "DINHEIRO", 164, 8, PAL.ink2);
      drawText(ctx, `$${this.st.money}`, 164, 17, PAL.ink);
      return;
    }
    if (m.type === "tutorMon") {
      panel(ctx, 4, 4, W - 8, H - 8);
      drawText(ctx, DB.STORY.joy.quemMon, 12, 10, PAL.ink);
      this.st.party.forEach((mon, i) => {
        const y = 26 + i * 20;
        if (i === m.index) cursor(ctx, 8, y + 4);
        ctx.drawImage(Assets.mon(mon.species, mon.seed), 16, y - 2, 20, 20);
        drawText(ctx, mon.nickname, 42, y + 2, PAL.ink);
        drawText(ctx, `N${mon.level}`, 150, y + 2, PAL.ink2);
        drawText(ctx, `${mon.moves.length}/4`, 190, y + 2, PAL.ink2);
      });
      drawText(ctx, "X VOLTA", 180, H - 18, PAL.ink2);
      return;
    }
    if (m.type === "tutorGolpe" || m.type === "tutorSlot") {
      const trocando = m.type === "tutorSlot";
      const mon = m.mon;
      panel(ctx, 4, 4, W - 8, H - 8);
      const titulo = (trocando ? DB.STORY.joy.qualSlot : DB.STORY.joy.qualGolpe).replace("{MON}", mon.nickname);
      drawText(ctx, titulo.slice(0, 34), 12, 10, PAL.ink);
      const lista = trocando ? mon.moves.map((mv) => mv.id) : m.lista;
      const top = trocando ? 0 : m.top;
      for (let i = 0; i < 5; i++) {
        const idx = top + i;
        if (idx >= lista.length) break;
        const mv = DB.MOVES[lista[idx]];
        const y = 28 + i * LINE_H;
        const campo = !!DB.FIELD_MOVES?.[lista[idx]];
        drawText(ctx, mv.name, 20, y, campo ? PAL.glitch : PAL.ink);
        drawText(ctx, mv.type.slice(0, 8), 110, y, PAL.ink2);
        drawText(ctx, mv.power ? `PODER ${mv.power}` : "STATUS", 168, y, PAL.ink2);
        if (idx === m.index) cursor(ctx, 12, y);
      }
      const sel = DB.MOVES[lista[m.index]];
      if (sel) drawText(ctx, `PP ${sel.pp}  PRECISÃO ${sel.acc}`, 12, 120, PAL.ink2);
      drawText(ctx, DB.FIELD_MOVES?.[lista[m.index]] ? "TAMBÉM FUNCIONA FORA DA BATALHA" : "", 12, 132, PAL.glitch);
      drawText(ctx, "X VOLTA", 180, H - 18, PAL.ink2);
      return;
    }
    if (m.type === "box") {
      const B = DB.STORY.box;
      const box = this.st.box || [];
      const lado = (titulo, lista, x, ativo) => {
        panel(ctx, x, 2, 116, 118);
        drawText(ctx, titulo, x + 8, 8, PAL.ink);
        if (!lista.length) drawText(ctx, B.vazia, x + 8, 24, PAL.ink2);
        const topo = ativo ? m.top : 0;
        for (let i = 0; i < BOX_LINHAS; i++) {
          const idx = topo + i;
          const mon = lista[idx];
          if (!mon) break;
          const y = 22 + i * LINE_H;
          drawText(ctx, `${mon.nickname.slice(0, 9)} N${mon.level}`, x + 14, y,
                   mon.hp > 0 ? PAL.ink : "#b04040");
          if (ativo && idx === m.index) cursor(ctx, x + 4, y);
        }
        const sobra = lista.length - topo - BOX_LINHAS;      // quantos ficaram abaixo
        if (sobra > 0) drawText(ctx, `+${sobra}`, x + 92, 8, PAL.ink2);
      };
      lado("EQUIPE", this.st.party, 2, m.lado === "equipe");
      lado(`BOX ${box.length}`, box, 122, m.lado === "box");

      panel(ctx, 2, 124, 236, 34);
      const sel = (m.lado === "box" ? box : this.st.party)[m.index];
      if (sel) {
        ctx.drawImage(Assets.mon(sel.species, sel.seed), 6, 126, 28, 28);
        drawText(ctx, sel.nickname, 38, 130, PAL.ink);
        drawText(ctx, `N${sel.level}  ${sel.hp}/${sel.maxHp}`, 38, 142, PAL.ink2);
      } else drawText(ctx, B.titulo, 8, 136, PAL.ink2);
      [].concat(B.ajuda).forEach((linha, i) => drawText(ctx, linha, 118, 128 + i * 10, PAL.ink2));
      return;
    }
    if (m.type === "fios") {
      const F = DB.STORY.fios;
      const CEL = 30, OX = 45, OY = 36;
      panel(ctx, 8, 8, W - 16, H - 16);
      drawText(ctx, F.tela, 16, 14, PAL.ink);
      drawText(ctx, F.dica, 16, 26, PAL.ink2);
      const vivas = fiosEnergia(m.grid);
      const meio = OY + FIO_LINHA * CEL + CEL / 2;
      // grade
      ctx.fillStyle = PAL.paperShade;
      for (let i = 0; i <= FIO_W; i++) ctx.fillRect(OX + i * CEL, OY, 1, FIO_H * CEL);
      for (let j = 0; j <= FIO_H; j++) ctx.fillRect(OX, OY + j * CEL, FIO_W * CEL, 1);
      // gerador (esquerda) e barreira (direita)
      const aceso = vivas.has(`${FIO_W - 1},${FIO_LINHA}`) && (m.grid[FIO_LINHA][FIO_W - 1] & F_L);
      ctx.fillStyle = PAL.hpYellow;
      ctx.fillRect(OX - 13, meio - 7, 9, 14);
      ctx.fillRect(OX - 5, meio - 2, 5, 4);
      ctx.fillStyle = aceso ? PAL.hpYellow : PAL.ink2;
      ctx.fillRect(OX + FIO_W * CEL, meio - 2, 5, 4);
      ctx.fillRect(OX + FIO_W * CEL + 4, meio - 7, 9, 14);
      // fios
      for (let y = 0; y < FIO_H; y++) {
        for (let x = 0; x < FIO_W; x++) {
          const mask = m.grid[y][x];
          const px = OX + x * CEL + CEL / 2, py = OY + y * CEL + CEL / 2;
          ctx.fillStyle = vivas.has(`${x},${y}`) ? PAL.hpYellow : PAL.ink2;
          ctx.fillRect(px - 3, py - 3, 6, 6);
          if (mask & F_N) ctx.fillRect(px - 2, OY + y * CEL + 3, 4, py - (OY + y * CEL + 3));
          if (mask & F_S) ctx.fillRect(px - 2, py, 4, CEL / 2 - 3);
          if (mask & F_O) ctx.fillRect(OX + x * CEL + 3, py - 2, px - (OX + x * CEL + 3), 4);
          if (mask & F_L) ctx.fillRect(px, py - 2, CEL / 2 - 3, 4);
        }
      }
      // cursor: moldura na peça escolhida
      const bx = OX + m.cx * CEL, by = OY + m.cy * CEL;
      ctx.fillStyle = PAL.ink;
      ctx.fillRect(bx, by, CEL, 2); ctx.fillRect(bx, by + CEL - 2, CEL, 2);
      ctx.fillRect(bx, by, 2, CEL); ctx.fillRect(bx + CEL - 2, by, 2, CEL);
      drawText(ctx, F.ajuda, 16, H - 26, PAL.ink2);
      return;
    }
    if (m.type === "voo") {
      const alt = m.destinos.length * LINE_H + 26;
      panel(ctx, 30, 20, 180, alt);
      drawText(ctx, m.titulo || DB.FIELD_MOVES.voar.pergunta, 40, 26, PAL.ink);
      m.destinos.forEach(([, nome], i) => {
        const y = 42 + i * LINE_H;
        drawText(ctx, nome, 50, y, PAL.ink);
        if (i === m.index) cursor(ctx, 40, y);
      });
      return;
    }
    if (m.type === "give") {
      const sp = m.lista[m.index];
      panel(ctx, 4, 4, W - 8, H - 8);
      drawText(ctx, DB.STORY.giveglitch.name, 12, 9, PAL.glitch);
      drawText(ctx, `${m.lista.length} REGISTROS`, 150, 9, PAL.ink2);
      // lista rolando, 6 linhas
      for (let i = 0; i < 6; i++) {
        const idx = m.top + i;
        if (idx >= m.lista.length) break;
        const e = m.lista[idx];
        const y = 24 + i * LINE_H;
        const cor = e.foreign ? PAL.glitch : PAL.ink;
        drawText(ctx, `${e.dex ? String(e.dex).padStart(3, "0") : "???"} ${e.name}`.slice(0, 18), 20, y, cor);
        if (idx === m.index) cursor(ctx, 12, y);
      }
      // ficha do escolhido
      const img = Assets.mon(sp.id, 7);
      ctx.drawImage(img, 158, 22, 48, 48);
      drawText(ctx, sp.types.join("/").slice(0, 12), 150, 74, PAL.ink2);
      drawText(ctx, `NÍVEL ${String(m.lvl).padStart(3, " ")}`, 150, 86, PAL.ink);
      drawText(ctx, m.shiny ? "SHINY: SIM" : "SHINY: NÃO", 150, 98, m.shiny ? "#d8a828" : PAL.ink2);
      drawText(ctx, DB.STORY.giveglitch.hint, 12, 132, PAL.ink2);
      drawText(ctx, "C TROCA SHINY", 12, 142, PAL.ink2);
      return;
    }
    if (m.type === "opts") {
      const idioma = DB.IDIOMAS?.find((l) => l.id === Opcoes.get("idioma")) || { nome: "PORTUGUÊS" };
      const linhas = [
        ["SCANLINES", Glitch.scanlines ? "ON" : "OFF"],
        ["SOM", Audio2.muted ? "OFF" : "ON"],
        ["VELOCIDADE", this.nomeVelocidade()],
        ["IDIOMA", idioma.nome],
        ["LIMPAR SAVE", ""],
      ];
      panel(ctx, 30, 32, 180, linhas.length * LINE_H + 32);
      drawText(ctx, `CORRUPÇÃO: ${Math.round(this.st.corruption)}%`, 40, 38, PAL.glitch);
      linhas.forEach(([rot, val], i) => {
        const y = 54 + i * LINE_H;
        drawText(ctx, rot, 50, y, PAL.ink);
        drawText(ctx, val, 140, y, PAL.glitch);
        if (i === m.index) cursor(ctx, 40, y);
      });
      const aviso = DB.AVISO_IDIOMA?.[Opcoes.get("idioma")];
      if (aviso) drawText(ctx, aviso.slice(0, 38), 12, 150, PAL.ink2);
    }
  }
}
