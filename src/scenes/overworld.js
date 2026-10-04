// Cena do mundo. A geometria (desenho, colisão, grama, barrancos, portas e
// conexões entre mapas) vem dos mapas originais do FireRed, carregados de
// assets/maps/. Os diálogos, encontros e regras vêm de src/data/maps.js.
import { DB } from "../data/index.js";
import { Assets, TILE, makeCanvas } from "../core/assets.js";
import { mapArt, mapArtInteira, mapOverlay, adiantarDoMapa, estatuaArt } from "../core/sprites.js";
import { Input, Texto } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { tocarGrito } from "../systems/gritos.js";
import { Save } from "../core/save.js";
import { Opcoes } from "../core/opcoes.js";
import { panel, drawText, cursor, bar, hpColor, fade, sinal, PAL, LINE_H, moeda } from "../core/gfx.js";
import { Dialogue, FALA_VELOCIDADES } from "../systems/dialogue.js";
import { Online } from "../systems/online.js";
import { OnlineMenuScene } from "./online.js";
import { TradeScene } from "./trade.js";
import { TrocaNpcScene } from "./trocanpc.js";
import { LinkBattleScene } from "./linkbattle.js";
import { GrupoBattleScene } from "./grupobattle.js";
import { HordaScene } from "./horda.js";
import { SoltarScene } from "./soltar.js";
import { VestirScene } from "./vestir.js";
import { roupasDe, vestir, baseDe } from "../systems/unicas.js";
import { novaEntrega, entregarAqui, novoMural, nomeDoCentro } from "../systems/bicos.js";
import { soltar, lugarDoSolto, soltoParaNascer, limparRecapturados } from "../systems/soltos.js";
import { PokedexScene } from "./pokedex.js";
import { temPokedex, fatorAmuleto } from "../systems/pokedex.js";
import { objetivoAtual } from "../systems/objetivo.js";
import { wrapText } from "../core/font.js";
import { Glitch } from "../systems/glitchfx.js";
import { randRange } from "../core/rng.js";
import { rollEncounter, rollDimEncounter, rollFlores } from "../systems/encounters.js";
import {
  heal, hpPct, gainXp, xpForLevel, createMon, evolutionFor, learnableMoves, recalc,
} from "../systems/mon.js";
import { scatterDimLoot } from "../systems/loot.js";
import { chocar as chocarOvo } from "../systems/ovos.js";
import { habilidadeDoMon } from "../systems/habilidades.js";
import * as Creche from "../systems/creche.js";
import { nascer, andar, emCima, cacando, fugindo, encontroDe } from "../systems/selvagens.js";
import { distorcaoDeAgora, distorcaoAqui, ondeEla } from "../systems/distorcoes.js";
import { ZONA, naZona, entradasDoMapa, entradaEm, abrirZona, garantirZona, vaoDaZona,
         cedeu, esbarrar, alcance, tileCedido, desenharVao } from "../systems/glitchzones.js";
import { quemDesce, noTopo } from "../systems/descida.js";
import { oMaisRapido, ganhaDaBike, aindaEstao, ehMotoqueiro }
  from "../systems/motoqueiros.js";
import { montarChefe, temPortal, abrirPortal, portalAberto, fecharPortal, corrupcaoDoPortal, pertoDoPortal }
  from "../systems/raid.js";
import { pedrasIniciaisDevidas } from "../systems/mega.js";
import { estado as estadoMissao, progresso, aceitar, entregar, diario, feitas, missaoPorId, daVez }
  from "../systems/missoes.js";
import { estaNaHora, marcarFeita, fracas, apagarDoCodigo } from "../systems/faxina.js";
// O aniversário entra como namespace de propósito: ele exporta `partes` e
// `formata`, que são nomes que a fusão e o leilão também usam aqui dentro.
import * as Aniv from "../systems/aniversario.js";
import { alvoDaPedra, emBraglitch, seisLendasPegas, glitchDeVerdade, regiaoDoMapa } from "../systems/regionais.js";
import { ilhas, ilhaDoMapa, ilhaAberta, ilhaEntregue, ilhaCompleta, insigniaDaIlha, formasPegas,
         chefeVencido, todasEntregues } from "../systems/ilhas.js";
import { guardar as guardarNoBox, cheio as boxCheio } from "../systems/box.js";
import { veu, temCeu, agora as horaDoMundo, ajustarRelogio } from "../systems/ciclo.js";
import { escuridaoDoLugar, ehCaverna, acesa, camadaDeLuz, brilho, RAIO } from "../systems/lanterna.js";
import { AcampamentoScene } from "./acampamento.js";
import { MineracaoScene } from "./mineracao.js";
import { GoParkScene } from "./gopark.js";
import * as GoPark from "../systems/gopark.js";
import { LeilaoScene } from "./leilao.js";
import { temBarraca } from "../systems/leilao.js";
import { vendaveis } from "../systems/venda.js";
import { VENDA_TEXTO } from "../data/leilao.js";
import { quemSou, desenharPokemon, pokesaveDoSprite, acompanharEvolucao, euSei, posicionarCacador, chegarCacador, cacadorNpc, andarCacador, cacadorPerdeu, cacadorPegou, cacadorTentaBola, NOITE, idDaNoite, fugirDormindo, fugitivoAmanheceu, correrTempo, centroMaisPerto, andarNaBola, CACADOR, esfriarRaiva, RAIVA, diaDoCacador, desafiarGinasio, curarNoCentro, campeaoSolta } from "../systems/pokesave.js";
import { temVisor, explicado } from "../systems/glitchboost.js";
import { podeAcampar, fator, buff, minutosDoBuff } from "../systems/acampamento.js";
import { rivalNpc, gemeoNpc, quemEhOGemeo } from "../systems/rival.js";
import { eraDoMapa, erasAbertas, celebiApareceu, chaveGuardiao, acabouOTempo }
  from "../systems/eras.js";
import { ehFusao, fundivel, previsao, partes, temFicha, fichasProntas, variantes,
         buscarDoMundo, especiePorTexto, montarEspecie, servidorMundo,
         importarFicha, trocarVariante, versoesInvertidas } from "../systems/fusao.js";
import { noMapa as provacoesNoMapa, estado as estadoProvacao, montarTotem,
         chaveDoTotem, pagar as pagarProvacao, aPagar as provacaoAPagar,
         falaDaGuardia, ilhaAcordou, espalhar as espalharProvacoes, montarGrupoDoTotem,
         proxima as proximaProvacao } from "../systems/provacoes.js";
import { BattleScene } from "./battle.js";
import { EvolutionScene } from "./evolution.js";
import { FusionScene } from "./fusion.js";
import { FusaoEditorScene } from "./fusaoeditor.js";
import { ConcursoScene } from "./concurso.js";
import { reduzido } from "../core/reduzir.js";
import { desenharItem, adiantarItens } from "../core/itens.js";
import { isoLigado, alternarIso, origem, naTela, noChao, coluna, tilesVisiveis, relevo, chaoEm, vistaIso, espelhar, sombra, comEspessura, fontesDoTeto } from "../core/isometrico.js";

const W = 240, H = 160;
/** Linhas visíveis na lista do GO PARK (a box inteira cabe nela, rolando). */
const GO_LISTA_VIS = 6;
const rumoDoSelvagem = new WeakMap();   // selvagem -> { x, y, dir } do último passo (isométrico)
const pretas = new WeakMap();           // sprite -> a silhueta preta dele (o bando da HORDA)
/** a silhueta PRETA de um sprite, feita uma vez só (ver `drawSelvagem`) */
function silhuetaPreta(img) {
  let cv = pretas.get(img);
  if (cv) return cv;
  const c = makeCanvas(img.width, img.height);
  c.ctx.drawImage(img, 0, 0);
  c.ctx.globalCompositeOperation = "source-in";
  c.ctx.fillStyle = "#000";
  c.ctx.fillRect(0, 0, img.width, img.height);
  pretas.set(img, (cv = c.cv));
  return cv;
}
const PRETO_MAX = 30;          // até onde dá pra andar no preto de fora do mapa (técnica secreta)
const ESTATUA_BASE = 16;       // no isométrico, a base da estátua tem um bloco de altura
const GLITCH_BRAG = 60;        // a corrupção de Braglitch depois que o MISSINGNO chega (a do finale de Kanto)
const ISO_PE = 5;              // no isométrico o pé fica um pouco acima da ponta de baixo do losango
const ISO_ESPESSURA = 5;       // quantos pixels de "grossura" tem a plaquinha dos bonecos
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
  // A GLITCH ZONE não está em arquivo nenhum: ela é remontada da semente do
  // save sempre que falta — na primeira vez, e depois de cada hot-swap, que
  // reconstrói o DB sem ela (ver src/systems/glitchzones.js).
  get map() {
    if (this.st.player.map === ZONA) garantirZona(this.st);
    return DB.MAPS[this.st.player.map];
  }
  get geo() {
    if (this.st.player.map === ZONA) garantirZona(this.st);
    return DB.KANTO[this.st.player.map];
  }

  enter() {
    this.ligaOnline();
    // um PRESENTE MISTERIOSO entregue pelo link (?presente=) na carga do save
    if (this.st.flags.presenteChegou) {
      const lista = this.st.flags.presenteChegou;
      delete this.st.flags.presenteChegou;
      Audio2.heal();
      this.dlg.say(lista.map((t) => DB.GIFT_TEXTO.chegou.replace("{TITULO}", t)));
    }
    this.ensureDimLoot();
    this.rollFragment();
    this.checarAniversario();
    if (this.st.flags.escortPending) this.spawnEscort();
    this.mapaVisto = this.st.player.map;
    this.banner = 2.2;
    this.ajeitarNaAgua();
    this.desencalhar();
    ajustarRelogio(this.st.relogio || 0);       // o mundo pode estar adiantado (pokésave)
    posicionarCacador(this.st, this);
    this.snapCamera();
    this.game.music(this.map.music);
  }

  /** Nasceu DENTRO de uma parede (um spawn errado, um mapa que mudou debaixo
   *  do save): sai pro chão livre mais perto que tenha pra onde ir. Fora da
   *  GLITCH ZONE só — lá, parede é parte da coisa (ver glitchzones.js). */
  desencalhar() {
    const p = this.st.player;
    // no preto (a técnica secreta) estar dentro da parede é de propósito
    if (p.map === ZONA || this.st.surfando || this.st.voando || this.st.noPreto) return;
    if (this.tagAt(p.x, p.y) !== DB.TAG.BLOCK) return;
    const livre = (x, y) => [DB.TAG.FREE, DB.TAG.GRASS].includes(this.tagAt(x, y)) && !this.warpAt(x, y);
    // chão livre com pelo menos dois vizinhos livres: um tile isolado é outra
    // parede com outro nome
    const bom = (x, y) => livre(x, y)
      && [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dy]) => livre(x + dx, y + dy)).length >= 2;
    for (let r = 1; r <= 24; r++) {
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== r || !bom(p.x + dx, p.y + dy)) continue;
          console.warn(`[mapa] nasceu em parede em ${p.map} (${p.x},${p.y}); indo pra (${p.x + dx},${p.y + dy})`);
          p.x += dx; p.y += dy;
          return;
        }
      }
    }
  }
  resume() {
    if (this.game._adoptPending) {   // o arquivo mudou durante a batalha
      const motivo = this.game._adoptPending;
      this.game._adoptPending = null;
      this.game.adoptSave(motivo);
    }
    this.conferirCacador();
    if (this.st.pokesave && !this.st.cacador?.map) posicionarCacador(this.st, this);
    limparRecapturados(this.st);        // pegou de volta um que tinha soltado?
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
    this.conferirProvacao();          // derrubou o totem: a marca se apaga e paga
    adiantarDoMapa(this.st);          // os bichos deste mapa, antes de aparecerem
    this.checkMissionDone();
    this.conferirBraglitch();         // o saci fugiu?
    this.conferirPandeiros();         // a IPÊ achou um PANDEIRO DA TERRA?
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
    const chave = c.modo !== "batalha" ? "trocaConvite"
      : c.formato === "dupla" ? "batalhaConviteDupla" : "batalhaConvite";
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
    // na GLITCH ZONE, parede em que você insistiu deixou de ser parede
    if (t > 0 && this.st.player.map === ZONA && cedeu(this.st, x, y)) return DB.TAG.FREE;
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

  /** arvorezinhas que ainda não foram cortadas neste mapa */
  arvoresAqui() {
    const cortadas = this.st.arvoresCortadas?.[this.st.player.map] || [];
    return (this.map.arvores || []).filter((k) => !cortadas.includes(k));
  }

  obstaculoEm(x, y) {
    const k = `${x},${y}`;
    if (this.pedrasAqui().includes(k)) return { tipo: "pedra", id: k, x, y };
    if (this.arvoresAqui().includes(k)) return { tipo: "arvore", id: k, x, y };
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
      .filter((n) => !(n.someComFlag && this.st.flags?.[n.someComFlag]))
      // `comFlag`: o contrário — só aparece depois (o mestre do quiz da LIGA,
      // que sai da passagem e fica do lado)
      .filter((n) => !(n.comFlag && !this.st.flags?.[n.comFlag]))
      // os MOTOQUEIROS da ILHA TRÊS somem depois de espantados. É por sprite e
      // não por `someComFlag` escrito no mapa porque esses NPCs vêm do decomp:
      // qualquer coisa anotada neles à mão morre na próxima reimportação.
      .filter((n) => !(ehMotoqueiro(n, mapa) && !aindaEstao(this.st)));
    const extra = [];
    const e = this.st.escort;
    if (e && e.map === this.st.player.map) extra.push(this.escortNpc(e));
    const boss = this.bossNpc();
    if (boss) extra.push(boss);
    const deo = this.deoxysNpc();
    if (deo) extra.push(deo);
    extra.push(...this.tempestadeNpcs());
    extra.push(...this.estaticosNpcs());
    const celebi = this.celebiNpc();
    if (celebi) extra.push(celebi);
    extra.push(...this.erasNpcs());
    const azul = rivalNpc(this.st);        // o AZUL aparece quando é a vez dele
    if (azul) extra.push(azul);
    const gemeo = gemeoNpc(this.st);       // em BRAGLITCH, o seu irmão gêmeo
    if (gemeo) extra.push(gemeo);
    extra.push(...this.descontroladasNpcs());   // de noite: as MEGAS DESCONTROLADAS
    const ash = this.ashNpc();                  // o CAMPEÃO SECRETO, em PALLET
    if (ash) extra.push(ash);
    const caca = cacadorNpc(this.st);      // POKÉSAVE: o treinador que te caça
    if (caca) extra.push(caca);
    if (this.st.mission && this.st.player.map === "glitchdim") {
      extra.push({ id: "portal", x: 22, y: 30, sprite: "portal", portal: true, dir: "down" });
      (this.st.dimLoot || []).forEach((b, i) => {
        extra.push({ id: `bola${i}`, x: b.x, y: b.y, sprite: "ball", loot: b, dir: "down" });
      });
      // O REGISTRO 0x3F: uma bola que não abre sozinha, no canto oposto à
      // entrada, só enquanto o capítulo 3 da história do ?????????? estiver
      // aberto e ela ainda não tiver sido pega (src/data/decamark.js)
      const R = DB.DECAMARK?.naFenda;
      if (R && estadoMissao(this.st, R.missao) === "ativa" && !this.st.npcState["glitchdim.registro"]?.gotGift) {
        extra.push({ id: "registro", x: R.x, y: R.y, sprite: "ball", dir: "down", glitch: true,
                     gift: { item: DB.DECAMARK.registro, qty: 1 }, achado: R.achado });
      }
    }
    const dist = this.distorcaoNpc();
    if (dist) extra.push(dist);
    const balsa = this.marinheiroSevii();
    if (balsa) extra.push(balsa);
    extra.push(...this.braglitchNpcs());
    // AS TROCAS COM NPC (src/data/trocas.js)
    for (const t of DB.TROCAS || []) {
      if (t.mapa === mapa) extra.push({ id: `troca_${t.id}`, x: t.x, y: t.y, dir: t.dir, sprite: t.sprite, troca: t, lines: ["..."] });
    }
    extra.push(...this.lanchaNpcs());           // a IPÊ e o CARVALHO na lancha
    // a estação do BONDINHO (CARVORIÚ ⇄ PRAIA DO LARVANJAL, src/data/braglitch.js)
    const est = DB.BONDINHO?.estacoes.find((e) => e.mapa === mapa);
    if (est) extra.push({ id: "bondinho", x: est.x, y: est.y, dir: "down", sprite: "bondinho", bondinho: est, lines: ["..."] });
    // a canalizadora da TORRE POKÉMON que tem medo do preto (src/data/void.js)
    const G = DB.GUIA_VOID;
    if (G && mapa === G.mapa) extra.push({ ...G.npc, guiaVoid: true, lines: ["..."] });
    extra.push(...this.profsVisitando());
    const cristal = this.cristalNoCume();
    if (cristal) extra.push(cristal);
    extra.push(...this.cristaisNoChao());
    extra.push(...this.provacoesNpcs());
    const rasgo = portalAberto(this.st, mapa);
    if (rasgo) extra.push({ id: "rasgo", x: rasgo.x, y: rasgo.y, sprite: "rasgo", raidPortal: true, dir: "down" });
    const f = this.st.fragment;
    if (f && f.map === this.st.player.map && this.hasDetector()) {
      extra.push({ id: "fragmento", x: f.x, y: f.y, sprite: "portal", fragment: true, dir: "down" });
    }
    return extra.length ? [...base, ...extra] : base;
  }

  /** DESCER O CUME SEM ESCADA. Sobe-se por dezessete andares; descer de novo
   *  pelos mesmos dezessete é o tipo de caminho que faz ninguém voltar num
   *  lugar. Com alguém de PEDRA, de AÇO ou que pule muito bem, dá pra descer
   *  direto (ver src/data/descida.js). */
  tentarDescer() {
    const D = DB.DESCIDA;
    const quem = quemDesce(this.st);
    if (!quem) return void this.dlg.say(D.semNinguem);
    this.dlg.ask(D.pergunta.replace("{MON}", quem.nickname), D.opcoes, (i) => {
      if (i !== 0) return;
      Audio2.tone(523, 0.07, "triangle", 0.5);
      Audio2.tone(392, 0.12, "triangle", 0.45);
      this.dlg.say(D.desceu.map((l) => l.replace("{MON}", quem.nickname)), () => {
        this.fx = { t: 0, cb: () => {
          // o dado usa `mapa` (como o resto do arquivo de dados) e o jogador
          // usa `map`; espalhar `...D.para` direto criava um campo `mapa` solto
          // no jogador e deixava o `map` como estava — descia sem sair do cume
          Object.assign(this.st.player,
            { map: D.para.mapa, x: D.para.x, y: D.para.y, dir: D.para.dir || "down" });
          this.compa = null;
          this.justWarped = true;
          this.afterTravel();
          this.game.autosave?.();
        } };
      });
    });
  }

  /** O CRISTAL Z, parado no cume da ROCHA NAVEL. Some quando você pega. */
  cristalNoCume() {
    const C = DB.CRISTAL;
    if (!C || this.st.player.map !== C.mapa) return null;
    if (this.st.flags?.cristalZ) return null;
    return { id: "cristalz", x: C.x, y: C.y, dir: "down", sprite: "ball", cristal: true };
  }

  /** OS CRISTAIS Z DE TIPO, espalhados pela ILHA DOIS e pelo CABO DA BEIRA.
   *  Cada um some quando é pego, e só o dele. */
  cristaisNoChao() {
    const aqui = this.st.player.map;
    return (DB.ZCRISTAIS || [])
      .filter((c) => c.mapa === aqui && !this.st.items?.[c.item])
      .map((c) => ({ id: `z_${c.golpe}`, x: c.x, y: c.y, dir: "down",
                     sprite: "ball", zcristal: c }));
  }

  /** AS PROVAÇÕES DA ILHA DOIS: a GUARDIÃ na subida do porto e um TOTEM
   *  dormindo em cima de cada marca que ainda não foi passada.
   *
   *  O totem é um NPC de chefe, como os de ESTATICOS: ele fica parado, você
   *  anda até lá e encosta. Perdeu, ele continua de pé — a provação não tem
   *  tranca, tem porteiro, e porteiro não some porque você foi embora. */
  provacoesNpcs() {
    const aqui = this.st.player.map;
    const lista = [];
    const G = DB.PROVACAO_GUARDIA;
    if (G && G.mapa === aqui && ilhaAcordou(this.st)) {
      lista.push({ id: "guardia_provacoes", x: G.x, y: G.y, dir: G.dir || "down",
                   sprite: G.sprite, guardiaProvacao: true, lines: [] });
    }
    for (const p of provacoesNoMapa(this.st, aqui)) {
      if (this.st.npcState[chaveDoTotem(p)]?.defeated) continue;   // caiu, falta só pagar
      lista.push({ id: `totem_${p.id}`, x: p.x, y: p.y, dir: "down",
                   sprite: `mon:${p.totem}`, provacao: p, lines: p.marca });
    }
    return lista;
  }

  /** Encostar numa marca. O que ela diz depende só do save: o pós-jogo abriu?
   *  falta alguém do tipo dela na equipe? é a de GLITCH e ainda faltam
   *  provações? Se está tudo certo, ela pergunta — e quem responde é você. */
  talkProvacao(npc) {
    const p = npc.provacao;
    const T = DB.PROVACOES_TEXTO;
    const diz = (linha) => this.dlg.say([...p.marca, linha]);
    switch (estadoProvacao(this.st, p)) {
      case "fechada": return void diz(T.fechada);
      case "travada": {
        const antes = proximaProvacao(this.st);
        return void diz(T.travada.replace("{TIPO}", antes.tipo).replace("{LUGAR}", antes.lugar));
      }
      case "semtipo": return void diz(T.semTipo.replace("{TIPO}", p.tipo));
      case "feita": return void this.dlg.say(p.venceu);
      default: break;
    }
    this.dlg.say(p.marca, () => {
      this.dlg.ask(T.pergunta.replace("{TIPO}", p.tipo), T.opcoes, (i) => {
        if (i !== 0) { Audio2.cancel(); return void this.dlg.say(T.recusa); }
        this.startTotemBattle(p);
      });
    });
  }

  /** O totem acorda. É batalha de chefe (não dá pra fugir) com uma diferença:
   *  bola nenhuma funciona nele, e quem diz isso é a cena de batalha, olhando o
   *  `totem` que veio dentro do bicho. A fenda só entra na de GLITCH — nas
   *  outras dezessete a ilha não tem nada de corrompido, e piscar a tela em
   *  todas elas seria gastar o susto à toa. */
  startTotemBattle(p) {
    Audio2.stopLoop();
    if (p.tipo === "GLITCH") { Glitch.hit(2); Audio2.glitch(); }
    Audio2.tone(880, 0.08); Audio2.tone(660, 0.12);
    // O TOTEM NÃO VEM SOZINHO: ele chama um ajudante (dupla) ou dois (trio), e
    // do seu lado saem tantos quanto os dele (src/data/duplas.js)
    const foes = montarGrupoDoTotem(p);
    this.fx = {
      t: 0,
      cb: () => this.game.scenes.push(new GrupoBattleScene(), {
        foes, tamanho: foes.length, glitch: p.tipo === "GLITCH", npcKey: chaveDoTotem(p),
      }),
    };
  }

  /** Voltou da batalha: se algum totem caiu e o cristal dele ainda não foi
   *  pago, paga agora. A conta é feita aqui e não no fim da batalha porque o
   *  prêmio é do MUNDO, não da luta — é a marca que se apaga. */
  conferirProvacao() {
    const p = provacaoAPagar(this.st);
    if (!p) return false;
    const linhas = pagarProvacao(this.st, p);
    if (!linhas) return false;
    Audio2.heal();
    this.game.autosave?.(true);
    this.dlg.say(linhas);
    return true;
  }

  /** OS MOTOQUEIROS DA ILHA TRÊS. Eles se gabam da velocidade da bicicleta, e é
   *  isso que abre: chegue com alguém mais rápido que a marca deles e eles saem
   *  pedalando. Vale o MAIS RÁPIDO da equipe, não o primeiro — o time já é o que
   *  é, ninguém devia ter que reordenar pra provar. */
  espantarMotoqueiros() {
    const M = DB.MOTOQUEIROS;
    const diz = (linhas, m) => this.dlg.say(linhas.map((l) => l
      .replace("{MARCA}", M.marca)
      .replace("{MON}", m ? m.nickname : "")
      .replace("{SPE}", m ? m.stats.spe : "")));
    const veloz = oMaisRapido(this.st);
    if (!veloz) return void diz(M.semTime);
    if (!ganhaDaBike(veloz)) return void diz(M.devagar, veloz);
    this.st.flags[M.flag] = true;
    Audio2.tone(660, 0.06, "square", 0.5);
    Audio2.tone(880, 0.06, "square", 0.5);
    Audio2.tone(1174, 0.12, "square", 0.45);
    this.game.autosave?.(true);
    diz([...M.corrida, M.depois], veloz);
  }

  /** Pegar um cristal do chão — de tipo ou de espécie. O de espécie precisa
   *  dizer de quem ele é: um cristal que só serve pra um bicho e não conta qual
   *  é um item que o jogador guarda pra sempre sem nunca usar. */
  pegarZ(c) {
    const Z = DB.STORY.zcristal;
    this.st.items[c.item] = 1;
    Audio2.heal();
    this.game.autosave?.(true);
    if (!c.especie) return void this.dlg.say([Z.achou.replace("{TIPO}", c.tipo), Z.comoUsa]);
    const dono = c.especie.toUpperCase();
    this.dlg.say([
      Z.achouEspecie.replace("{ITEM}", c.item.toUpperCase()),
      Z.soDele.replace("{DONO}", dono),
      Z.comoUsaEspecie.replace("{DONO}", dono).replace("{TIPO}", c.tipo),
    ]);
  }

  /** Pegar o cristal. */
  pegarCristal() {
    const C = DB.CRISTAL;
    this.st.flags.cristalZ = true;
    this.st.items[C.item] = (this.st.items[C.item] || 0) + 1;
    Audio2.heal();
    Glitch.hit(0.6);
    this.game.autosave?.(true);
    this.dlg.say(C.achou);
  }

  // ------------------------------------------------- A BALSA DAS SEVII
  /** O marinheiro da balsa: um no cais de VERMILION, um em cada porto de ilha.
   *  É o mesmo NPC nos oito lugares, porque é o mesmo barco. */
  marinheiroSevii() {
    const S = DB.SEVII;
    if (!S) return null;
    const aqui = this.st.player.map;
    // o BARQUEIRO de São Lucario: mesma linha, outro barco (src/data/braglitch.js)
    const P = DB.BRAGLITCH?.porto;
    if (P && aqui === P.mapa) {
      return { id: "balsa", ...P.barqueiro, sprite: "marinheiro", balsa: true, lines: DB.BARCO.fala };
    }
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

  /** O menu do barco: pra onde dá pra ir daqui. A linha tem três pontas —
   *  KANTO (o cais de VERMILION), BRAGLITCH (o píer de SÃO LUCARIO) e as ILHAS
   *  SEVII —, e o mesmo menu vale no cais, no píer e em qualquer porto de ilha.
   *  O lugar em que você já está não entra na lista: oferecer o lugar onde a
   *  pessoa está é ocupar uma linha da caixa pra não fazer nada.
   *
   *  São dois passos (a ponta, depois a ilha) porque as oito ilhas mais as duas
   *  regiões não cabem numa caixa de escolha só. */
  pegarBalsa() {
    const S = DB.SEVII, T = DB.STORY.sevii, B = DB.BARCO || {};
    const st = this.st;
    const aqui = st.player.map;
    const P = DB.BRAGLITCH?.porto;
    const pontas = [];
    if (aqui !== S.embarque.mapa) {
      pontas.push({ nome: B.kanto || "KANTO", ir: () => this.zarparPara({
        nome: S.embarque.nome, porto: S.embarque.mapa, x: S.embarque.x + 1, y: S.embarque.y + 1,
        chegou: B.chegouKanto }) });
    }
    if (P && aqui !== P.mapa && DB.KANTO[P.mapa]) {
      pontas.push({ nome: B.braglitch || "BRAGLITCH", ir: () => this.zarparPara({
        nome: "SÃO LUCARIO DO SUL", porto: P.mapa, x: P.chegada.x, y: P.chegada.y,
        chegou: B.chegouBraglitch }) });
    }
    pontas.push({ nome: B.sevii || "ILHAS SEVII", ir: () => this.escolherIlha() });
    this.dlg.ask(B.pergunta || T.pergunta, [...pontas.map((p) => p.nome), T.aquiNao], (i) => pontas[i]?.ir());
  }

  /** As ilhas. A TRAVA DAS TRÊS INSÍGNIAS é só aqui: pra ir e voltar entre
   *  KANTO e BRAGLITCH o barco sempre leva — quem começou em Braglitch não tem
   *  insígnia nenhuma, e um barco que não sai do píer prende a pessoa numa
   *  região só. */
  escolherIlha() {
    const S = DB.SEVII, T = DB.STORY.sevii, B = DB.BARCO || {};
    const st = this.st;
    // as insígnias das duas regiões contam: quem começou em Braglitch também chega
    const n = (st.badges || []).length + (st.bragBadges || []).length;
    if (n < (S.requer?.insignias ?? 0)) {
      return void this.dlg.say(T.travado);
    }
    const aqui = st.player.map;
    // A ILHA NOVE (`pedeBone`) só entra no menu depois que você tem um PIKACHU
    // DE BONÉ. O que existe lá é o PIKASHUNIUM Z, que serve pra exatamente uma
    // coisa: um item que só funciona com um bicho que você não tem é um item
    // que não faz nada.
    //
    // A trava é só pra CHEGAR. De lá pra qualquer lugar a balsa sempre leva —
    // ilha que se entra e não se sai não é destino, é armadilha.
    const temBone = [...(st.party || []), ...(st.box || [])]
      .some((m) => DB.EH_BONE?.has(m.species));
    const destinos = S.ilhas
      .filter((i) => i.porto !== aqui)
      .filter((i) => !i.pedeBone || temBone);
    this.dlg.ask(B.qualIlha || T.pergunta, [...destinos.map((i) => i.nome), T.aquiNao], (i) => {
      if (i < destinos.length) this.zarparPara(destinos[i]);
    });
  }

  /** A travessia. Mesma transição de qualquer viagem: some a tela, troca o
   *  mundo, volta. */
  zarparPara(destino) {
    const S = DB.SEVII, T = DB.STORY.sevii;
    const st = this.st;
    Audio2.tone(392, 0.14, "triangle", 0.5);
    // saindo do píer de São Lucario é o barquinho, não a balsa
    const saindoDoPier = st.player.map === DB.BRAGLITCH?.porto?.mapa;
    this.dlg.say(destino.zarpou || (saindoDoPier ? DB.BARCO.zarpou : T.zarpou), () => {
      this.fx = { t: 0, cb: () => {
        Object.assign(st.player, {
          map: destino.porto,
          x: destino.x ?? S.chegada.x,
          y: destino.y ?? S.chegada.y,
          dir: "down",
        });
        st.surfando = null;
        this.compa = null;
        this.justWarped = true;
        this.afterTravel();
        this.game.autosave?.(true);
        this.dlg.say(destino.chegou || T.chegou.replace("{ONDE}", destino.nome));
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
      // `tamanho` 2: o NPC ocupa um bloco 2x2 a partir do canto (o caçador furioso)
      const t = n.tamanho || 1;
      if (t > 1) return x >= n.x && x < n.x + t && y >= n.y && y < n.y + t;
      return n.x === x && n.y === y;
    });
  }
  blocked(x, y) {
    // ATRAVESSANDO (a técnica secreta, ver `tentarAtravessar`): a beirada e o
    // preto de fora do mapa não seguram ninguém
    if (this.st.noPreto && this.predioNoPreto(x, y)) return true;
    if (this.st.noPreto && this.naBeirada(x, y)) return !!this.npcAt(x, y);
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
    if (this.st.voando || this.st.surfando || this.tagAt(p.x, p.y) !== DB.TAG.WATER) return;
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
    // EM BRAGLITCH golpe de campo não funciona: quem resolve é a MONTARIA, e
    // quem chama ela é o PANDEIRO DA TERRA daquela ação (src/data/braglitch.js)
    if (this.geo?.braglitch) return this.montariaNaEquipe(golpe);
    // num POKÉSAVE o que você é conta: de VOADOR voa, de ÁGUA nada (euSei).
    // EM KANTO vale os dois: quem sabe o golpe, ou a montaria de Braglitch que
    // veio de barco com você — o golpe tem a vez, a montaria é o reserva.
    return this.st.party.find((m) => m.hp > 0 && m.moves.some((mv) => mv.id === golpe)) || euSei(this.st, golpe)
      || this.montariaNaEquipe(golpe);
  }

  /** A montaria que o pandeiro chama: não é um Pokémon da sua equipe, é quem
   *  vem quando você toca. Devolve um "Pokémon" só com o que os golpes de campo
   *  leem (a espécie, pro desenho, e o nome, pra fala). */
  montariaNaEquipe(golpe) {
    const m = DB.MONTARIAS?.[golpe];
    if (!m || !(this.st.items?.[m.pandeiro] > 0)) return null;
    const sp = DB.SPECIES[m.especie];
    return sp ? { species: m.especie, nickname: sp.name, hp: 1, moves: [], montaria: true } : null;
  }

  /** OS PANDEIROS DA TERRA: a IPÊ acha um quando a história chega no ponto
   *  dele, avisa pela Pokédex e manda. Um por vez, quando não tem conversa na
   *  tela (chamado depois de batalha e ao trocar de mapa). */
  conferirPandeiros() {
    if (this.dlg.active || this.menu) return false;
    const st = this.st;
    for (const pd of DB.PANDEIROS || []) {
      if (st.flags[`pandeiro_${pd.id}`]) continue;
      // o pandeiro é da ilha: sai quando ela é entregue (`entregarIlha`
      // já dá na hora; isto aqui é pra quem já tinha a ilha no save)
      const ilha = ilhas().find((i) => i.id === pd.ilha);
      if (!ilha || !ilhaEntregue(st, ilha)) continue;
      st.flags[`pandeiro_${pd.id}`] = true;
      st.items[pd.item] = 1;
      Audio2.tone(660, 0.06); Audio2.tone(990, 0.1);
      this.game.autosave?.(true);
      this.dlg.say(pd.fala, () => {
        Audio2.heal();
        this.dlg.say(DB.PANDEIRO_GANHOU.replace("{ITEM}", pd.item.toUpperCase()));
      });
      return true;
    }
    return false;
  }

  /** O texto de um golpe de campo AQUI: em Braglitch é sempre o da montaria;
   *  em Kanto, o da montaria só quando é ela que vai fazer o serviço. */
  campo(golpe) {
    const base = DB.FIELD_MOVES[golpe];
    const M = DB.MONTARIAS?.[golpe];
    if (!M) return base;
    if (this.geo?.braglitch) return { ...base, ...M };
    const quem = this.quemSabe(golpe);
    const eMontaria = !!quem?.montaria;
    // em Kanto a falta de alguém continua com a fala de sempre (golpe OU montaria)
    return eMontaria ? { ...base, ...M, semNinguem: base.semNinguem } : base;
  }
  // ------------------------------------------------ A TÉCNICA SECRETA
  //
  // ATRAVESSAR PRO PRETO. Segure CORRER e esbarre CINCO vezes seguidas na
  // mesma parede da beirada do mapa: na quinta você passa por dentro dela. Dali
  // em diante a beirada (as árvores da cerca, a parede de fora da casa) e o
  // preto do lado de fora do mapa não seguram mais: dá pra andar por fora do
  // desenho, no escuro, até PRETO_MAX tiles longe. Pisar de novo num chão de
  // verdade dentro do mapa desliga a técnica.
  //
  // Ninguém no jogo conta isto. Só vale na BEIRADA (até 3 tiles da borda) pra
  // não virar atalho: a parede do meio do mapa continua segurando, então não
  // dá pra pular portão, ginásio nem porta trancada com ela.

  /** Esbarrou numa parede: é a técnica? Devolve true quando atravessou. */
  tentarAtravessar(x, y, dx, dy) {
    if (!Input.held("run") || !this.naBeirada(x, y) || this.st.voando) { this.atravessa = null; return false; }
    if (this.bumpCd) return false;                 // um esbarrão de cada vez
    const a = this.atravessa;
    const mesmo = a && a.x === x && a.y === y && a.dx === dx && a.dy === dy;
    this.atravessa = { x, y, dx, dy, n: mesmo ? a.n + 1 : 1 };
    // o SINAL: do segundo esbarrão certo em diante o mundo pisca, cada vez
    // mais — quem está no caminho certo tem que sentir que tem algo ali (o
    // livro de SALVADITTO avisa: "REPARE QUANDO O MUNDO PISCAR")
    if (this.atravessa.n >= 2 && this.atravessa.n < 5) Glitch.hit(0.15 * this.atravessa.n);
    if (this.atravessa.n < 5) return false;
    this.atravessa = null;
    this.st.noPreto = true;
    Glitch.hit(1.2);
    Audio2.glitch();
    this.move = { dx, dy, n: 0, total: passo(WALK) };
    return true;
  }

  /** Um prédio que mora no preto (o GINÁSIO DO VOID) ocupa este tile? */
  predioNoPreto(x, y) {
    for (const v of this.geo?.vazio || []) {
      if (v.solidos.includes(`${x - v.x},${y - v.y}`)) return true;
    }
    return false;
  }

  /** O prédio no preto: recortado do desenho do mapa de onde ele veio, e
   *  piscando — de vez em quando uma faixa dele escorrega pro lado, como uma
   *  imagem que o jogo não terminou de carregar. `cx, cy` como no chão. */
  desenharPredioNoPreto(ctx, cx, cy) {
    for (const v of this.geo?.vazio || []) {
      const art = mapArt(v.de);
      if (!art) continue;
      const x = (v.x + v.dx0) * TILE - cx, y = (v.y + v.dy0) * TILE - cy;
      const w = v.w * TILE, h = v.h * TILE;
      ctx.drawImage(art, v.sx * TILE, v.sy * TILE, w, h, x, y, w, h);
      const t = performance.now();
      if (Math.floor(t / 90) % 23 === 0) {
        const fy = ((t / 7) | 0) % h, fh = 3 + (((t / 13) | 0) % 6);
        ctx.drawImage(art, v.sx * TILE, v.sy * TILE + fy, w, fh, x + ((t / 5) % 2 ? 3 : -3), y + fy, w, fh);
      }
    }
  }

  /** A beirada do mapa (até 3 tiles da borda) e o preto de fora, até PRETO_MAX */
  naBeirada(x, y) {
    const g = this.geo;
    if (!g) return false;
    const fora = Math.max(-x, -y, x - (g.w - 1), y - (g.h - 1));
    if (fora > 0) return fora <= PRETO_MAX;
    return Math.min(x, y, g.w - 1 - x, g.h - 1 - y) < 3;
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
    // no preto a câmera vai atrás de você: presa no mapa, ela te deixaria
    // sair da tela
    if (this.st.noPreto) {
      this.cam.x = Math.round(px + TILE / 2 - W / 2);
      this.cam.y = Math.round(py + TILE / 2 - H / 2);
      return;
    }
    // sempre inteira: câmera fracionária faz a tela tremer ao rolar
    this.cam.x = Math.round(mw <= W ? (mw - W) / 2 : Math.max(0, Math.min(mw - W, px + TILE / 2 - W / 2)));
    this.cam.y = Math.round(mh <= H ? (mh - H) / 2 : Math.max(0, Math.min(mh - H, py + TILE / 2 - H / 2)));
  }

  // -------------------------------------------------------------- update
  update(dt) {
    // conversa nenhuma na tela: ninguém está falando (um talkTo que abriu loja
    // ou batalha sem dizer nada não pode deixar o NPC dono da próxima fala)
    if (!this.dlg.active && !this.dlg.choice) this.dlg.falante = null;
    // no BONDINHO não se anda nem se abre menu: a cabine vai sozinha
    if (this.viagemBondinho) return this.andarDeBondinho(dt);
    // na LANCHA também não: a IPÊ dirige
    if (this.viagemLancha) return this.andarDeLancha(dt);
    this.banner = Math.max(0, this.banner - dt);
    // O OBJETIVO aparece depois de 1 s parado: sem passo, sem conversa, sem menu
    const parado = !this.move && !this.dlg.active && !this.menu && !this.fx && !(this.fadeA > 0) && !(this.banner > 0);
    this.paradoT = parado ? (this.paradoT || 0) + dt : 0;
    this.invuln = Math.max(0, (this.invuln || 0) - dt);
    this.tremor = Math.max(0, (this.tremor || 0) - dt * 3);
    this.clarao = Math.max(0, (this.clarao || 0) - dt * 2.4);
    if (this.aviso) { this.aviso.t -= dt; if (this.aviso.t <= 0) this.aviso = null; }
    if (this.olhando) this.olhando.t += dt;
    Glitch.level = this.st.corruption;
    // BRAGLITCH VIROU GLITCH (`flags.bragGlitch`): lá a tela suja como a de
    // Kanto quebrado. Voltando pra Kanto, o `forced` sai das fontes de lá.
    if (emBraglitch(this.st.player.map) && this.st.flags?.bragGlitch) {
      Glitch.forced = true;
      Glitch.level = Math.max(Glitch.level, GLITCH_BRAG);
      this.bragForcou = true;
    } else if (this.bragForcou) {
      this.bragForcou = false;
      Glitch.forced = !!(this.st.flags?.glitchWorld || this.st.mission);
    }
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
    Online.mandaPos(dt, this.st, !!this.move);
    this.updateWander(dt);
    ajustarRelogio(correrTempo(this.st, dt));   // o fugitivo faz o tempo correr
    this.updateCacador(dt);
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
        // quem ficou na creche cresce a cada passo seu; quem anda com você
        // gosta mais de você — e os bebês evoluem por isso
        const r = Creche.andou(this.st);
        this.onArrive();
        if (r.amigos.length && !this.menu && !this.dlg.active) {
          this.dlg.say(DB.STORY.creche.amigo.replace("{MON}", r.amigos[0].nickname), () => this.rodarEvolucao());
        }
      }
      this.snapCamera();
      return;
    }

    if (this.entregarLendas()) return;          // lenda vencida esperando pra entrar no time
    if (this.chefeDaIlhaCaiu()) return;         // venceu o chefe: a IPÊ leva pra próxima ilha
    if (this.glitchChegaEmBraglitch()) return;  // a sexta lenda entrou: o MISSINGNO chega
    if (Input.consume("b")) return this.openMenu();
    // NA BOLA (capturado): quem anda é o dono, e ele anda sozinho, caçando.
    // Você só olha — e abre o menu pra sair.
    if (this.st.capturado?.naBola) return this.andarDentroDaBola(dt);
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
    if (dir === "down" && !this.st.voando) {
      const standing = this.warpAt(p.x, p.y);
      if (standing && this.blocked(nx, ny)) return this.useWarp(standing);
    }

    // borda do mapa: conexão com o mapa vizinho (vila <-> rota <-> cidade).
    // Atravessando, a borda não leva a lugar nenhum: leva pro preto.
    if (this.tagAt(nx, ny) === -1 && !this.st.noPreto) {
      const conn = (this.geo.connections || []).find((c) => c.dir === dir && c.to);
      if (conn) return this.useConnection(conn, dir);
    }

    // VOANDO (o pokésave de VOADOR): por cima de árvore, casa, água, barranco,
    // gente e bicho — só a borda do mapa segura. Porta não entra: ninguém
    // entra numa casa pelo ar; pra isso pousa.
    if (this.st.voando) {
      if (this.tagAt(nx, ny) < 0) return;
      this.move = { dx, dy, n: 0, total: passo(Input.held("run") ? RUN : WALK) };
      return;
    }

    // porta: no FireRed o tile da porta é sólido, o warp vem antes da colisão
    const target = this.warpAt(nx, ny);
    if (target) return this.useWarp(target);

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
      // NO TOPO DA ROCHA NAVEL, encostar pra cima é pedir pra descer. É a
      // mesma mão da água: você anda contra a coisa e o jogo pergunta — sem
      // item, sem menu, sem ninguém ter que te contar que existe.
      if (noTopo(this.st)) return this.tentarDescer();
      const alvo = this.npcAt(nx, ny);
      if (alvo?.distorcao) return this.investigarDistorcao();
      if (alvo?.raidPortal) return this.entrarNoRasgo();
      // NA GLITCH ZONE a parede não é de verdade: insista e ela cede. A borda
      // do mapa (tag -1) não — do outro lado dela não tem nada pra ceder.
      if (naZona(this.st) && !alvo && this.tagAt(nx, ny) >= 0) return this.esbarrarNaZona(nx, ny);
      if (!alvo && this.tentarAtravessar(nx, ny, dx, dy)) return;
      if (!this.bumpCd) { Audio2.bump(); this.bumpCd = 0.35; }
      return;
    }
    this.move = { dx, dy, n: 0, total: passo(Input.held("run") ? RUN : WALK) };
  }

  onArrive() {
    const p = this.st.player;
    // voltou do preto: pisou num chão de verdade, dentro do mapa
    if (this.st.noPreto && this.tagAt(p.x, p.y) >= 0 && this.tagAt(p.x, p.y) !== DB.TAG.BLOCK) {
      this.st.noPreto = false;
    }
    if (this.st.voando) return;              // no ar, o chão não te alcança
    if (this.st.capturado?.naBola) {         // na bola, quem chegou foi o dono
      // ...e se ele estava indo pra porta, ele entra (sai) por ela
      const cap = this.st.capturado, w = this.warpAt(p.x, p.y);
      if (cap.rumo?.porta && w?.to) { cap.rumo = null; return this.useWarp(w); }
      return;
    }
    const warp = this.warpAt(p.x, p.y);
    if (warp && !this.justWarped) return this.useWarp(warp);
    if (!warp) this.justWarped = false;

    if (this.st.surfando && this.tagAt(p.x, p.y) !== DB.TAG.WATER) {
      this.st.surfando = null;              // pisou em terra firme
      Audio2.tone(659, 0.05); Audio2.tone(523, 0.08);
    }
    if (this.tagAt(p.x, p.y) === DB.TAG.GRASS) this.rustle = { x: p.x, y: p.y, t: 0 };

    if (this.pisouNoVao()) return;
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
    // um BRAVO chegou em você: ele BATE (não abre batalha) — menos se você
    // está voando: lá em cima ninguém alcança
    if (passo.encostou && !this.st.voando) this.levarBote(passo.encostou);
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
      const novo = nascer(this.selvagens, st.player, (x, y) => this.sortearSelvagem(x, y),
                          (x, y) => this.daPraSelvagem(x, y));
      // a HORDA também é sorteada no nascimento: quem traz uma anda com as
      // silhuetas dela em cima (`drawSelvagem`), e é essa que você luta
      if (novo) novo.horda = this.talvezHorda(novo);
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
    for (const f of DB.GANCHOS?.encontrar || []) f(this.st, b);   // os DLCs
    if (b.bravo) { Audio2.bump(); this.rustle = { x: b.x, y: b.y, t: 0 }; }
    if (b.horda) {
      for (const r of b.horda) this.st.seen[r.species] = true;
      return this.startHorda(b.horda);
    }
    this.startBattle(encontroDe(b));
  }

  /** A HORDA (src/data/config.js, `hordaOdds`): às vezes o bicho comum que
   *  nasce no mato vem com mais da mesma espécie. Sorteada no NASCIMENTO
   *  (`updateSelvagens`), como o próprio bicho: o que você vê — as silhuetas
   *  em cima dele — é o que você luta. Devolve a horda (3 a 5), ou null. */
  talvezHorda(b) {
    const C = DB.CONFIG || {}, m = b.mon;
    if (!m || b.bravo || b.glitch || m.alfa || m.shiny || m.luminoso || m.corrupt || m.totem || m.soltoId) return null;
    if (this.st.player.map === "glitchdim" || Math.random() >= (C.hordaOdds ?? 0)) return null;
    const [a, z] = C.hordaNiveis || [1, 4];
    const [min, max] = C.hordaTamanho || [3, 5];
    const resto = Array.from({ length: randRange(min, max) - 1 }, () => createMon(m.species, Math.max(2, m.level - randRange(a, z))));
    return [m, ...resto];
  }

  startHorda(foes) {
    Audio2.stopLoop();
    Audio2.tone(880, 0.08); Audio2.tone(660, 0.12); Audio2.tone(880, 0.08);
    // a cutscene (src/scenes/horda.js) primeiro; a luta abre quando ela fecha
    this.fx = { t: 0, cb: () => this.game.scenes.push(new HordaScene(), {
      foes, aoFim: () => this.game.scenes.push(new GrupoBattleScene(), { foes, horda: true }),
    }) };
  }

  /** O bicho que nasce naquele tile. Em Kanto é o sorteio de sempre; dentro da
   *  fenda é o dela, que olha o TERRENO debaixo do tile (ar, terra ou água) —
   *  cada um tem a sua tabela e o seu lendário. */
  sortearSelvagem(x, y) {
    const st = this.st;
    // UM QUE VOCÊ SOLTOU AQUI (src/systems/soltos.js): às vezes nasce ele de volta
    if (st.player.map !== "glitchdim") {
      const presentes = new Set(this.selvagens.map((b) => b.mon?.soltoId).filter(Boolean));
      const solto = soltoParaNascer(st, st.player.map, presentes);
      if (solto) return { mon: solto };
    }
    // o primeiro que nasce depois do MISSINGNO chegar em Braglitch é ele: a
    // fala acabou de dizer isso, o mato tem que mostrar
    if (this.primeiroMissingno && emBraglitch(st.player.map)) {
      this.primeiroMissingno = false;
      const enc = rollFlores();
      if (enc) return enc;
    }
    if (st.player.map !== "glitchdim") {
      // a cor do bicho pode ser reescrita por um DLC — a SHINY ZONE. O gancho
      // devolve outra `sorte` (número) ou a cor pronta ({ shiny, luminoso })
      // o AMULETO BRILHANTE (a Pokédex de Kanto completa) soma na mesma conta
      let sorte = fator(st, "sorte") * fatorAmuleto(st), brilho = null;
      for (const f of DB.GANCHOS?.brilho || []) {
        const r = f(st, sorte);
        if (typeof r === "number") sorte = r;
        else if (r && typeof r === "object") brilho = r;
      }
      // em Braglitch o glitch vira folclore até o MISSINGNO chegar lá; depois
      // disso o mato de lá é o de Kanto quebrado (src/systems/regionais.js)
      const brag = emBraglitch(st.player.map) && st.flags.bragGlitch;
      return rollEncounter(st.player.map, brag ? Math.max(st.corruption, GLITCH_BRAG) : st.corruption,
                           glitchDeVerdade(st, st.player.map), sorte, brilho);
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
    // num POKÉSAVE o Pokémon que você é não te segue — ele é você
    return this.st.party?.find((m) => m.hp > 0 && !m.eu) || null;
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

  // ------------------------------------------------------- GLITCH ZONES
  /** Pisou num VÃO: o de entrada, em Kanto, te joga numa zona nova; o de
   *  saída, dentro dela, te devolve pra onde você entrou. Devolve true quando
   *  tomou conta do passo. (src/systems/glitchzones.js) */
  pisouNoVao() {
    const p = this.st.player;
    if (naZona(this.st)) {
      const vao = vaoDaZona(this.st);
      if (!vao || vao.x !== p.x || vao.y !== p.y) return false;
      this.voltarDoVao();
      return true;
    }
    const entrada = entradaEm(this.st, p.map, p.x, p.y);
    if (!entrada) return false;
    return this.atravessarVao(entrada);
  }

  /** Atravessar: sorteia um mapa de Kanto, embaralha os tiles dele e te larga
   *  num tile qualquer de lá. Se você caiu cercado, o jogo diz — na hora, e
   *  não depois de dez esbarrões: "preso" só é susto se vier com a saída. */
  atravessarVao(entrada) {
    const z = abrirZona(this.st, entrada);
    if (!z) return false;
    if (DB.CONFIG?.sustos) { Glitch.hit(2.5); Audio2.glitch(); }
    else { Audio2.tone(220, 0.12, "square", 0.4); Audio2.tone(330, 0.16, "square", 0.3); }
    this.justWarped = true;
    this.transition(() => {
      const p = this.st.player;
      this.st.surfando = null;
      p.map = ZONA; p.x = z.x; p.y = z.y; p.dir = "down";
      this.afterTravel();
      const t = DB.ZONA_TEXTO || {};
      const falas = [];
      if (!this.st.flags.zonaVista) { this.st.flags.zonaVista = true; falas.push(...(t.primeira || [])); }
      else falas.push(...(t.entrou || []));
      const preso = DB.GLITCH_ZONES?.preso ?? 6;
      if (alcance(this.geo, p.x, p.y, preso) < preso) falas.push(...(t.preso || []));
      if (falas.length) this.dlg.say(falas);
    });
    return true;
  }

  /** O vão de saída te devolve pro tile da entrada, olhando pra onde olhava. */
  voltarDoVao() {
    const v = this.st.zona?.volta;
    if (!v) return;
    if (DB.CONFIG?.sustos) { Glitch.hit(1.5); Audio2.glitch(); }
    else Audio2.tone(330, 0.08, "square", 0.3);
    this.justWarped = true;
    this.transition(() => {
      const p = this.st.player;
      this.st.surfando = null;
      p.map = v.map; p.x = v.x; p.y = v.y; p.dir = v.dir || "down";
      this.afterTravel();                 // é ele que apaga a zona do save
      this.dlg.say(DB.ZONA_TEXTO?.saiu || []);
    });
  }

  /** Esbarrou numa parede da zona. Na `esbarroes`-ésima vez ela cede e vira
   *  chão — é a saída de quem nasceu preso e não sabe VOAR. */
  esbarrarNaZona(x, y) {
    if (this.bumpCd) return;
    this.bumpCd = 0.35;
    Glitch.hit(0.5);
    if (!esbarrar(this.st, x, y)) return void Audio2.bump();
    Audio2.glitch();
    Glitch.hit(2);
    if (!this.st.flags.paredeCedeu) {
      this.st.flags.paredeCedeu = true;
      this.dlg.say(DB.ZONA_TEXTO?.cedeu || []);
    }
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
      const cap = this.st.capturado;
      if (cap?.dormindo?.mapa === fromMap) return void this.dlg.say(NOITE.escada.replace("{TREINADOR}", cap.nome));
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
      // (a de São Lucario também: mãe é mãe dos dois lados do mar)
      const saiuDeCasa = (fromMap === "home" && w.to === "pallet")
        || (fromMap === DB.BRAGLITCH?.inicio && w.to === DB.BRAGLITCH?.porto?.mapa);
      if (saiuDeCasa && !this.st.flags.momGift) {
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
    this.veioDe = OPPOSITE[dir];                     // o caçador entra por aqui
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

  /** Voltou de uma batalha com o caçador e ele perdeu: some por um tempo. */
  conferirCacador() {
    const key = `${this.st.player.map}.cacador`;
    if (this.st.npcState[key]?.defeated) { delete this.st.npcState[key]; cacadorPerdeu(this.st); }
  }

  afterTravel() {
    // o último lugar ao ar livre com mato: é pra lá que vai quem é solto no PC
    if ((this.map?.encounters || []).length && temCeu(this.map)) this.st.ultimoComMato = this.st.player.map;
    // trocou de mapa: o preto ficou pra trás — menos quando a porta de onde você
    // saiu fica NO preto (o GINÁSIO DO VOID, src/data/void.js)
    {
      const p = this.st.player, g = DB.KANTO[p.map];
      this.st.noPreto = !!g && (p.x < 0 || p.y < 0 || p.x >= g.w || p.y >= g.h);
    }
    this.profsFica = null;            // quem veio de visita foi embora
    this.conferirPandeiros();
    // CAPTURADO: saiu do Centro enquanto ele dorme lá em cima — isso é fugir
    const cap = this.st.capturado;
    if (cap?.dormindo && this.st.player.map !== cap.dormindo.mapa) {
      const nome = cap.nome;
      Glitch.hit(1); Audio2.glitch();
      fugirDormindo(this.st);
      this.compa = null;
      this.dlg.say(NOITE.fugiu.map((t) => t.replace("{TREINADOR}", nome)));
    }
    posicionarCacador(this.st, this, { deOnde: this.veioDe });   // POKÉSAVE: o caçador vem atrás
    this.veioDe = null;
    // OS SELVAGENS À VISTA FICAM NO MAPA DE ONDE SÃO. A lista guarda posição
    // no mapa de agora, então trocar de mapa com ela cheia trazia os bichos
    // junto, nas mesmas coordenadas: atravessar a cerca de PALLET pra ROTA 21
    // e voltar deixava três TANGELA na vila. As portas e o VOAR já zeravam
    // por conta própria; a CONEXÃO (borda de mapa) não — e é o jeito mais
    // comum de mudar de lugar. Aqui vale pra todo caminho.
    this.selvagens = [];
    for (const f of DB.GANCHOS?.viajar || []) f(this.st);     // os DLCs (src/systems/dlc.js)
    if (DB.FLY_SPOTS?.[this.st.player.map]) {     // cidade nova: libera o VOAR
      this.st.visitado ||= {};
      this.st.visitado[this.st.player.map] = true;
    }
    // saiu da GLITCH ZONE por qualquer caminho (o vão, VOAR, desmaiar): ela
    // acabou. A próxima entrada sorteia outra — é o ponto de ela ser aleatória.
    if (this.st.zona && this.st.player.map !== ZONA) delete this.st.zona;
    this.ensureDimLoot();
    this.checkPokedexAlert();
    this.checarAniversario();
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
    // EM DUPLA: as duplas de treinadores sempre (src/data/duplas.js); e todo
    // treinador com dois ou mais, se a opção BATALHA DUPLA estiver ligada
    const dupla = !!trainer.dupla || (!!this.st.flags?.todasDuplas && (trainer.party || []).length >= 2);
    this.fx = { t: 0, cb: () => (dupla
      ? this.game.scenes.push(new GrupoBattleScene(), { trainer, npcKey: key, tamanho: 2 })
      : this.game.scenes.push(new BattleScene(), { trainer, npcKey: key })) };
  }

  /** O CAÇADOR do pokésave vem andando; quando encosta, ataca sem perguntar. */
  /** CAPTURADO, DE NOITE: o dono te leva pro Centro mais perto e sobe pra
   *  dormir. Você fica embaixo até ele descer — ou sai, e isso é fugir. */
  noiteDoDono() {
    const cap = this.st.capturado;
    if (!cap || this.fx || this.menu || this.dlg.active || this.move) return;
    const fill = (t) => t.replace("{TREINADOR}", cap.nome);
    const hora = horaDoMundo();
    // ele está dormindo e amanheceu: desce, e nada mais acontece
    if (cap.dormindo && !hora.noite) {
      cap.dormindo = null;
      cap.acordouEm = Date.now();
      return void this.dlg.say(NOITE.acordou.map(fill));
    }
    if (cap.dormindo || !hora.noite) return;
    const noite = idDaNoite();
    if (cap.dormiuNoite === noite) return;       // já dormiu (e acordou) nesta noite
    // com o tempo a 60x a noite chega a cada 30 segundos — e ninguém aguenta
    // ser levado pro Centro a cada 30 segundos. Ele só dorme de novo depois
    // de `entreSonos` minutos de relógio de parede.
    if (cap.acordouEm && Date.now() - cap.acordouEm < CACADOR.entreSonos * 60000) return;
    cap.dormiuNoite = noite;
    const centro = centroMaisPerto(this.st);
    cap.dormindo = { mapa: centro, noite };
    this.transition(() => {
      const sp = DB.MAPS[centro]?.spawn || { x: 7, y: 8, dir: "up" };
      Object.assign(this.st.player, { map: centro, x: sp.x, y: sp.y, dir: "up" });
      this.st.surfando = null; this.st.voando = false;
      this.compa = null;
      this.afterTravel();
      this.game.autosave?.(true);
      this.dlg.say(NOITE.dormiu.map(fill));
    });
  }

  updateCacador(dt) {
    if (!this.st.pokesave || this.fx || this.menu || this.dlg.active) return;
    // a carreira dele anda um dia de cada vez (treino, captura, ginásio)
    diaDoCacador(this.st);                          // a carreira anda em silêncio
    if (this.st.capturado && campeaoSolta(this.st)) {   // campeão: ele te solta
      Glitch.hit(1); Audio2.heal();
      this.compa = null;
      this.game.autosave?.(true);
      return void this.dlg.say([`${this.st.cacador.nome} VENCEU A LIGA POKÉMON. É O NOVO CAMPEÃO.`,
        "ELE ABRIU A BOLA E DISSE: \"VAI. VOCÊ JÁ FEZ O QUE TINHA QUE FAZER.\"", "VOCÊ ESTÁ LIVRE. DE VEZ."]);
    }
    if (this.st.capturado) {
      // a raiva esfria com o tempo; quando desce um degrau, ele mostra
      esfriarRaiva(this.st, dt);                      // a raiva esfria em silêncio
      return this.noiteDoDono();
    }
    // amanheceu depois da fuga: ele percebe, e vem — de longe, sem folga, furioso
    if (fugitivoAmanheceu(this.st)) {
      Glitch.hit(2); Audio2.glitch();
      posicionarCacador(this.st, this, { atraso: 3 });
      return void this.dlg.say(NOITE.percebeu.map((t) => t.replace("{TREINADOR}", this.st.cacador.nome)));
    }
    chegarCacador(this.st, this);                    // deu a hora de ele entrar?
    if (this.move) return;
    const alvo = andarCacador(this.st, this, dt, this.selvagens);
    if (!alvo) return;
    if (alvo !== "voce") {                           // pegou um selvagem
      this.selvagens = this.selvagens.filter((o) => o !== alvo);
      cacadorPegou(this.st, alvo);
      Audio2.tone(880, 0.06); Audio2.tone(1175, 0.1);
      return;
    }
    const npc = cacadorNpc(this.st);
    if (!npc || !this.st.party.some((m) => m.hp > 0)) return;
    const key = `${this.st.player.map}.cacador`;
    delete this.st.npcState[key];
    this.st.player.dir = OPPOSITE[npc.dir];
    Audio2.tone(988, 0.07); Audio2.tone(1319, 0.12);
    // primeiro a bola — e VOCÊ decide: entra, ou resiste. Resistindo, a bola
    // ainda pode te segurar (quanto mais ferido, mais); se não segura, ele luta.
    const nome = npc.trainer.name;
    const capturado = () => {
      Glitch.hit(1.5); Audio2.glitch();
      this.compa = null;
      this.game.autosave?.(true);
      this.dlg.say([`VOCÊ FOI CAPTURADO POR ${nome}!`,
        "AGORA VOCÊ É O POKÉMON DE ALGUÉM. NA BATALHA, QUEM MANDA É ELE.",
        "MAS NINGUÉM É OBRIGADO A OBEDECER."]);
    };
    this.dlg.say([npc.lines[0], `${nome} JOGOU UMA POKÉ BOLA EM VOCÊ!`], () => {
      this.dlg.ask("A BOLA ESTÁ ABERTA NA SUA FRENTE.", ["ENTRAR", "RESISTIR"], (i) => {
        if (i === 0) { cacadorTentaBola(this.st, true); return capturado(); }
        if (cacadorTentaBola(this.st)) return capturado();
        Audio2.bump();
        this.dlg.say(["VOCÊ ESCAPOU DA BOLA!", npc.lines[1]], () => this.startTrainerBattle(npc, key));
      });
    });
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
      // placa-objeto ({ texto, bandeira }): o diário da mansão que a missão
      // manda ler — ler é o que cumpre o pedido, então ler marca a bandeira
      if (typeof sign === "object") {
        return void this.dlg.say(sign.texto, () => {
          if (sign.bandeira && !this.st.flags[sign.bandeira]) {
            this.st.flags[sign.bandeira] = true;
            Audio2.heal();
            this.game.autosave?.(true);
          }
        });
      }
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
    if (obst?.tipo === "arvore") return this.pedirCorteArvore(obst);
    if (obst?.tipo === "bloco") return this.pedirForca(obst, ...DIRS[p.dir]);

    const t = this.tagAt(f.x, f.y);
    if (t === DB.TAG.WATER && !this.st.surfando) return this.pedirSurf(f);
    if (t === DB.TAG.GRASS) return this.pedirCorte(f);
  }

  talkTo(npc) {
    const key = `${this.st.player.map}.${npc.id}`;
    const state = (this.st.npcState[key] ||= {});
    if (npc.sprite !== "ball") npc.dir = OPPOSITE[this.st.player.dir];
    // QUEM FALA é este: no estilo BALÃO (OPÇÕES → FALA) a fala sai da cabeça
    // dele. Bola no chão e item escondido não falam — o texto deles é do jogo.
    if (!npc.invisivel && npc.sprite !== "ball" && !npc.loot) this.dlg.falante = () => this.cabecaNaTela(npc);

    if (npc.loot) return this.takeLoot(npc.loot);
    if (npc.sprite === "ball" && npc.gift) return this.pegarItemBall(npc, state, key);
    // BOLA QUE CARREGA COISA VEM ANTES DA BOLA GENÉRICA. O último `if` desta
    // trinca manda toda bola pro fluxo do laboratório ("as outras são do
    // professor"), e os cristais são desenhados como bola: sem esta ordem, o
    // PIKASHUNIUM Z no cume e os dezoito da ILHA DOIS respondiam com a fala das
    // bolas do Carvalho, a meio mundo de distância dele.
    if (ehMotoqueiro(npc, this.st.player.map)) return this.espantarMotoqueiros();
    if (npc.provacao) return this.talkProvacao(npc);
    if (npc.guardiaProvacao) {
      const agora = espalharProvacoes(this.st);
      if (agora) { Audio2.heal(); this.game.autosave?.(true); }
      return void this.dlg.say(falaDaGuardia(this.st, agora));
    }
    if (npc.zcristal) return this.pegarZ(npc.zcristal);
    if (npc.cristal) return this.pegarCristal();
    if (npc.sprite === "ball") return this.pickStarter(npc, state);
    if (npc.monShop && !state.comprou) return this.venderMon(npc, state);
    if (npc.aurora) return this.talkVelhaAurora(state);
    if (npc.escort) return this.talkEscort(npc);
    if (npc.boss) return this.startBossBattle(npc);
    if (npc.descontrolada) return this.enfrentarDescontrolada(npc);
    if (npc.balsa) return this.pegarBalsa();
    if (npc.distorcao) return this.investigarDistorcao();
    if (npc.raidPortal) return this.entrarNoRasgo();
    if (npc.portal) return this.usePortal();
    if (npc.fragment) return this.useFragment();
    if (npc.guiaVoid) return this.falarGuiaDoVoid(state);
    if (npc.bondinho) return this.pegarBondinho(npc.bondinho);
    if (npc.ligaPortao) return this.talkLigaPortao();
    if (npc.ligaQuiz != null) return this.talkLigaQuiz(npc.ligaQuiz);
    if (npc.ligaCampeao) return this.talkLigaCampeao(npc);
    // os dois professores juntos: quem está no encontro puxa a conversa antes
    // de qualquer outra coisa (inclusive o professor da casa)
    const enc = this.encontroProfsAqui();
    if (enc && (npc.profVisita || npc.id === "carvalho" || npc.id === "ipe")) return this.conversaDosProfs(enc, npc);
    if (npc.id === "carvalho") return this.talkOak(npc, state);
    if (npc.lancha) return this.lanchaIpe();
    if (npc.carvalhoLancha) return this.falarCarvalhoLancha();
    if (npc.id === "ipe") return this.talkIpe(npc, state);
    if (npc.saci) return this.enfrentarSaci(npc);
    if (npc.lenda) return this.enfrentarLenda(npc);
    if (npc.livroLendas) return this.lerLivroDasLendas();
    if (npc.concurso) return this.talkConcurso(npc, state);
    if (npc.celebi) return this.talkCelebi();
    if (npc.voltaTempo) return this.voltarDoTempo();
    if (npc.voltaBarco) return this.voltarDeBarco(npc);
    if (npc.missao) return this.talkMissao(npc);
    if (npc.troca) return this.trocarComNpc(npc.troca);
    if (npc.travessia) return this.oferecerTravessia(npc);
    if (npc.creche) return this.talkCreche();
    if (npc.mineracao) return this.talkMineiro(state);
    if (npc.gopark) return this.talkGoPark(state);
    if (npc.fossil) return this.talkPaleontologa();

    // `conta`: o que este NPC sabe de uma missão. Com ela aberta (e, se ele
    // for treinador, depois de vencido) ele conta e marca a bandeira que o
    // pedido confere — é o BLAINE falando da página que arrancou.
    const c = npc.conta;
    if (c && (!npc.trainer || state.defeated) && !this.st.flags[c.flag]
        && estadoMissao(this.st, c.missao) === "ativa") {
      state.talked = true;
      return void this.dlg.say(c.lines, () => {
        this.st.flags[c.flag] = true;
        Audio2.heal();
        this.game.autosave?.(true);
      });
    }

    if (npc.trainer && !state.defeated) {
      if (!this.st.party.length) {
        return void this.dlg.say(this.geo?.braglitch ? DB.BRAGLITCH_TEXTO.semPokemon
          : "VOCÊ NÃO TEM POKÉMON! FALE COM O PROF. CARVALHO PRIMEIRO.");
      }
      return this.offerBattle(npc, key, state);
    }
    if (npc.shop) {
      state.talked = true;
      // o balconista de VIRIDIAN entrega a PICARETA uma vez: com ela na
      // mochila dá pra cavar em qualquer lugar (src/scenes/mineracao.js)
      if (npc.picareta && !state.deuPicareta) {
        state.deuPicareta = true;
        const T = DB.MINERACAO.MINA_TEXTO;
        return void this.dlg.say(T.lojista, () => {
          this.st.items.picareta = 1;
          Audio2.heal();
          this.game.autosave?.(true);
          this.dlg.say(T.ganhouPicareta);
        });
      }
      // O balcão serve pros dois lados: comprar coisa e VENDER coisa (metade
      // do preço; o TROFÉU DE PALLET vale oito zilhões — src/data/leilao.js).
      // Com a BARRACA DE LEILÃO na mochila entra a terceira opção: leiloar
      // bicho.
      this.dlg.say(npc.lines, () => {
        const prateleira = this.prateleira(npc.shop);
        const V = VENDA_TEXTO;
        if (!temBarraca(this.st)) {
          this.dlg.ask(V.oferta, V.opcoes, (i) => {
            if (i === 0) this.menu = { type: "shop", index: 0, shop: prateleira };
            else if (i === 1) this.abrirVenda();
          });
          return;
        }
        this.dlg.ask(V.ofertaComBarraca, V.opcoesComBarraca, (i) => {
          if (i === 0) this.menu = { type: "shop", index: 0, shop: prateleira };
          else if (i === 1) this.abrirVenda();
          else if (i === 2) this.game.scenes.push(new LeilaoScene());
        });
        return;
      });
      return;
    }
    if (npc.gift && !state.gotGift) {
      // `depoisDe`: o presente só sai depois que aqueles NPCs (ids deste mapa)
      // foram derrotados — o juiz de um torneio, o prêmio de uma sequência.
      // Antes disso ele diz `antes` (ou as falas de sempre).
      if (npc.depoisDe?.some((id) => !this.st.npcState[`${this.st.player.map}.${id}`]?.defeated)) {
        return void this.dlg.say(npc.antes || npc.lines);
      }
      state.gotGift = true;
      this.dlg.say(npc.lines, () => {
        const { item, qty } = npc.gift;
        this.st.items[item] = Math.min(999, (this.st.items[item] || 0) + qty);
        Audio2.heal();
        this.dlg.say(`VOCÊ RECEBEU ${qty} ${item.toUpperCase()}!`);
      });
      return;
    }
    // A MÃE PERGUNTANDO O ANIVERSÁRIO. Vem antes do `heal` porque ela é a
    // enfermeira da primeira casa do jogo: se ficasse depois, a cura respondia
    // primeiro e a pergunta nunca chegava a acontecer. Uma vez só — o `perguntou`
    // é o que impede a mãe de virar um formulário toda vez que você passa em casa.
    if (npc.aniversario && !Aniv.definido(this.st) && !state.perguntou) {
      return this.perguntarAniversario(npc, state);
    }
    if (npc.heal) {
      const j = DB.STORY.joy;
      // OS BICOS (src/data/bicos.js): o pacote que veio pra cá é entregue antes de tudo
      const mapa = this.st.player.map, ehCentro = /pokemon_center_1f$/.test(mapa) && DB.BICOS;
      const entregue = ehCentro ? entregarAqui(this.st, mapa) : null;
      const abrir = () => this.dlg.say(npc.lines, () => {
        if (!npc.tutor && !ehCentro) return this.curarEquipe(npc);
        const opcoes = ["CURAR", ...(npc.tutor ? ["TROCAR GOLPES"] : []), ...(ehCentro ? ["ENTREGAS", "PROCURADOS"] : []), "NADA"];
        this.dlg.ask(j.menu, opcoes, (i) => {
          const o = opcoes[i];
          if (o === "CURAR") return this.curarEquipe(npc);
          if (o === "TROCAR GOLPES") {
            if (!this.st.party.length) return void this.dlg.say("VOCÊ NÃO TEM POKÉMON AINDA!");
            this.menu = { type: "tutorMon", index: 0 };
            return;
          }
          if (o === "ENTREGAS") return this.bicoEntregas();
          if (o === "PROCURADOS") return this.bicoProcurados();
          this.dlg.say(j.tchau);
        });
      });
      if (entregue) {
        const T = DB.BICOS.textos;
        Audio2.heal();
        this.game.autosave?.(true);
        return void this.dlg.say(T.entregou.map((l) => l.replace("{ORIGEM}", nomeDoCentro(entregue.de)).replace("{VALOR}", entregue.valor)), abrir);
      }
      abrir();
      return;
    }
    const lines = state.defeated || state.talked ? npc.afterLines || npc.lines : npc.lines;
    state.talked = true;
    this.dlg.say(lines);
  }

  /** ENTREGAS (src/data/bicos.js): um pacote por vez, pro Centro de outra cidade */
  bicoEntregas() {
    const T = DB.BICOS.textos, st = this.st, aqui = st.player.map;
    const cid = (m) => nomeDoCentro(m);
    if (st.entrega) {
      return void this.dlg.say(T.jaTem.replace("{CIDADE}", cid(st.entrega.para)), () =>
        this.dlg.ask(T.desistir, ["DEVOLVER", "FICO COM ELE"], (i) => {
          if (i !== 0) return;
          st.entrega = null;
          this.dlg.say(T.devolveu);
        }));
    }
    const e = novaEntrega(st, aqui);
    if (!e) return void this.dlg.say(T.semDestino);
    this.dlg.ask(T.oferta.replace("{CIDADE}", cid(e.para)).replace("{VALOR}", e.valor), T.simNao, (i) => {
      if (i !== 0) return;
      st.entrega = e;
      Audio2.select();
      this.game.autosave?.(true);
      this.dlg.say(T.levou.map((l) => l.replace("{CIDADE}", cid(e.para))));
    });
  }

  /** PROCURADOS (src/data/bicos.js): o mural, e um novo quando o de agora acabou */
  bicoProcurados() {
    const T = DB.BICOS.textos, st = this.st;
    const falas = [];
    if (!st.procurados?.length || st.procurados.every((p) => p.feito)) {
      if (st.procurados?.length) falas.push(T.novo);
      st.procurados = novoMural(st.player.map);
      this.game.autosave?.(true);
    }
    // a caixa tem 3 linhas: o título numa página, os 3 procurados na outra
    falas.push(T.mural);
    falas.push(st.procurados.map((p) => T.linha.replace("{MON}", DB.SPECIES[p.species]?.name || p.species)
      .replace("{LVL}", p.lvl).replace("{VALOR}", p.valor).replace("{FEITO}", p.feito ? T.feito : "")).join("\n"));
    falas.push(T.explica);
    this.dlg.say(falas);
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
          foe, glitch: true, boss: true, npcKey: chave, falaCaptura: npc.falaCaptura,
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
      const to = evolutionFor(mon, this.st.player.map);
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
    // O LUGAR decide: a mesma pedra no mesmo bicho dá coisa diferente em Kanto e
    // fora dela (o PIKACHU nas SEVII vira RAICHU-ALOLA).
    const to = alvoDaPedra(item, mon.species, this.st.player.map);
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
    const info = this.campo("surfar");
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
    const info = this.campo("corte");
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

  /** ARVOREZINHA: o CORTE derruba (em Braglitch, o ROÇADOR do PANDEIRO DO
   *  MATO). Fica derrubada de vez — nada de crescer de novo a cada visita. */
  pedirCorteArvore(obst) {
    const info = this.campo("corte");
    const mon = this.quemSabe("corte");
    if (!mon) return void this.dlg.say(info.semArvore);
    this.dlg.ask(info.perguntaArvore, ["SIM", "NÃO"], (i) => {
      if (i !== 0) return;
      this.st.arvoresCortadas ||= {};
      (this.st.arvoresCortadas[this.st.player.map] ||= []).push(obst.id);
      Audio2.hit();
      this.rustle = { x: obst.x, y: obst.y, t: 0 };
      this.game.autosave?.();
      this.dlg.say(info.usandoArvore.replace("{MON}", mon.nickname));
    });
  }

  /** pedra rachada: QUEBRA-ROCHA some com ela de vez */
  pedirQuebra(obst) {
    const info = this.campo("quebrarocha");
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
    const info = this.campo("forca");
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
    const info = this.campo("voar");
    const mon = this.quemSabe("voar");
    if (!mon) return void this.dlg.say(info.semNinguem);
    if (this.map.interior || this.st.surfando) {
      return void this.dlg.say("AQUI DENTRO NÃO DÁ PRA LEVANTAR VOO.");
    }
    // só as cidades da região em que você está: Kanto e Braglitch se ligam
    // por barco, não por asa (e as duas listas juntas não cabem na caixa)
    const aqui = regiaoDoMapa(this.st.player.map);
    const destinos = Object.entries(DB.FLY_SPOTS)
      .filter(([id]) => this.st.visitado?.[id] && id !== this.st.player.map && DB.MAPS[id]
        && regiaoDoMapa(id) === aqui);
    if (!destinos.length) return void this.dlg.say("VOCÊ AINDA NÃO CONHECE OUTRA CIDADE PRA VOAR.");
    this.menu = { type: "voo", index: 0, destinos, mon };
  }

  /** BILHETE VOO: mesma lista do VOAR, mas o avião de papel pousa em qualquer
   *  cidade de Kanto — inclusive nas que você ainda não conhece — e ninguém da
   *  equipe precisa saber voar. */
  abrirVooBilhete(item, t) {
    // o avião de papel é de Kanto: pousa nas cidades de lá
    const destinos = Object.entries(DB.FLY_SPOTS)
      .filter(([id]) => id !== this.st.player.map && DB.MAPS[id] && regiaoDoMapa(id) === "kanto");
    if (!destinos.length) return void this.dlg.say(DB.STORY.bilhete.semDestino);
    this.menu = { type: "voo", index: 0, destinos, bilhete: item, titulo: t.pergunta };
  }

  voarPara(id) {
    const { mon, bilhete } = this.menu || {};
    const t = bilhete ? DB.STORY.bilhetes?.[bilhete] : null;
    this.menu = null;
    const spawn = DB.MAPS[id].spawn;
    const abertura = t ? DB.STORY.bilhete.voandoKanto
                       : this.campo("voar").usando.replace("{MON}", mon.nickname);
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
    // no laboratório da IPÊ a primeira vez tem fala própria (src/data/braglitch.js)
    const ipe = !!this.map.labBraglitch;
    const flag = ipe ? "pcGlitchIpe" : "pcGlitch";
    const primeira = !this.st.flags[flag];
    this.st.flags[flag] = true;
    Audio2.glitch();
    Glitch.hit(1.4);
    const fala = primeira ? (ipe ? DB.BRAGLITCH_TEXTO.pc : g.first) : g.again;
    this.dlg.say(fala, () => this.openGive());
  }

  openGive() {
    // sem as formas MEGA: elas só existem dentro da batalha
    const lista = Object.values(DB.SPECIES).filter((sp) => !sp.mega && !sp.fusao)
      .sort((a, b) => (a.dex || 999) - (b.dex || 999));
    // `cor`: 0 comum, 1 shiny, 2 luminoso — o C gira entre as três
    this.menu = { type: "give", index: 0, top: 0, lvl: 5, cor: 0, lista };
    Audio2.select();
  }

  /** baixa o Pokémon escolhido pro time (ou pro box, se estiver cheio) */
  baixarMon(m) {
    const sp = m.lista[m.index];
    const mon = createMon(sp.id, m.lvl, { shiny: m.cor === 1, luminoso: m.cor === 2 });
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
  darDecodificador(npc, state, depois = null) {
    const F = DB.STORY.fusao;
    const st = this.st;
    st.flags.decodificador = true;
    this.dlg.say(F.entrega, () => {
      st.items[DB.FUSAO.item] = 1;
      Audio2.glitch();
      Glitch.hit(1.2);
      this.game.autosave?.(true);
      this.dlg.say([F.ganhou, ...F.explica], () => (depois ? depois() : this.talkOak(npc, state)));
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
    const meio = (x, y) => this._iso
      ? (({ x: qx, y: qy }) => ({ x: qx, y: qy - ISO_PE - 6 - this.zIso(x / TILE, y / TILE) }))(naTela(this._iso, x + TILE / 2, y + TILE / 2))
      : { x: x - cx + TILE / 2, y: y - cy + TILE / 2 };
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

  /** O SENHOR DA CRECHE (src/systems/creche.js): deixa até dois, pega de
   *  volta, e entrega o ovo quando o casal botou um. */
  /** O MINEIRO do MONTE LUA: empresta as ferramentas (a primeira vez de
   *  graça, depois cobra o aluguel) e abre a parede — src/scenes/mineracao.js. */
  talkMineiro(state) {
    const T = DB.MINERACAO.MINA_TEXTO, preco = DB.MINERACAO.PAREDE.aluguel;
    const gratis = !state.cavou;
    const pergunta = () => this.dlg.ask(gratis ? T.primeira : T.cobra.replace("{PRECO}", preco), T.opcoes, (i) => {
      if (i !== 0) return void this.dlg.say(T.depois);
      if (!gratis && this.st.money < preco) return void this.dlg.say(T.semGrana.replace("{PRECO}", preco));
      if (!gratis) this.st.money -= preco;
      state.cavou = true;
      this.game.scenes.push(new MineracaoScene());
    });
    if (gratis) this.dlg.say(T.oferta, pergunta); else pergunta();
  }

  /** A PICARETA da mochila: cava onde o jogador estiver, de graça. Não dentro
   *  de casa — parede de gente não é parede de mina. */
  cavarAqui() {
    const T = DB.MINERACAO.MINA_TEXTO;
    if (this.map.interior) return void this.dlg.say(T.dentroDeCasa);
    this.dlg.say(T.cavaAqui, () => this.game.scenes.push(new MineracaoScene()));
  }

  /** A PALEONTÓLOGA de CINNABAR: troca um fóssil da mochila pelo bicho vivo. */
  talkPaleontologa() {
    const T = DB.MINERACAO.MINA_TEXTO, F = DB.MINERACAO.FOSSEIS, O = DB.OVO_TEXTO;
    const tenho = (f) => (this.st.items[f] || 0) > 0;
    // o que dá pra ligar: um fóssil inteiro, ou as duas metades de um de Galar
    const tem = Object.keys(F).filter((f) => (F[f].precisa || [f]).every(tenho));
    if (!tem.length) {
      // só uma metade na mochila: ela explica o que falta
      const metade = Object.values(F).some((r) => r.precisa?.some(tenho));
      return void this.dlg.say(metade ? T.labMetade : T.labOferta);
    }
    if (this.st.party.length >= 6 && boxCheio(this.st)) return void this.dlg.say(T.labSemVaga);
    this.dlg.ask(T.labTem, tem.map((f) => f.toUpperCase()), (i) => {
      const item = tem[i], { especie, nivel, precisa } = F[item];
      for (const gasto of precisa || [item]) this.spend(gasto, 1);
      const mon = createMon(especie, nivel);
      const msgs = (precisa ? T.labColado : T.labFeito).map((l) => l.replace("{MON}", mon.nickname).replace("{NIVEL}", nivel));
      if (mon.luminoso) msgs.push(O.formas.luminoso);
      else if (mon.shiny) msgs.push(O.formas.shiny);
      if (this.st.party.length < 6) { this.st.party.push(mon); msgs.push(T.labEquipe.replace("{MON}", mon.nickname)); }
      else { guardarNoBox(this.st, mon); msgs.push(T.labBox.replace("{MON}", mon.nickname)); }
      this.st.seen[mon.species] = true;
      this.st.caught[mon.species] = true;
      Audio2.heal();
      this.game.autosave?.(true);
      this.dlg.say(msgs);
    });
  }

  /** A ATENDENTE DO GO PARK COMPLEX (src/systems/gopark.js).
   *
   *  Quatro coisas: manda um Pokémon da EQUIPE OU DA BOX pro GO (e o cartão
   *  com o QR baixa), PUXA os seus do POKÉMON GO pra dentro do complexo, abre
   *  um dos cinco parques, e explica o que dá e o que não dá pra fazer. */
  talkGoPark(state) {
    const T = DB.GO_TEXTO, st = this.st;
    const menu = () => this.dlg.ask(T.menu, T.opcoes, (i) => {
      if (i === 0) return this.enviarProGO();
      if (i === 1) return this.puxarDoGO();
      if (i === 2) return this.entrarNoParque();
      if (i === 3) return void this.dlg.say(T.explica, menu);
      this.dlg.say(T.nada);
    });
    if (state.talked) return menu();
    state.talked = true;
    this.dlg.say(T.oferta.map((l) => l.replace("{P}", DB.GO_PARK.parques).replace("{V}", DB.GO_PARK.porParque)), menu);
  }

  /** ENVIAR PRO GO: de onde, quem, e o cartão baixa. */
  enviarProGO() {
    const T = DB.GO_TEXTO, st = this.st;
    if (!GoPark.parqueComVaga(st)) {
      return void this.dlg.say(T.cheio.replace("{N}", GoPark.totalNoParque(st)).replace("{P}", DB.GO_PARK.parques));
    }
    this.dlg.ask(T.origem, T.origemOpcoes, (k) => {
      if (k !== 0 && k !== 1) return;
      const daEquipe = k === 0;
      if (daEquipe && st.party.length <= 1) return void this.dlg.say(T.ultimo);
      const lista = GoPark.candidatos(st).filter((c) => c.origem === (daEquipe ? "equipe" : "box"));
      if (!lista.length) return void this.dlg.say(daEquipe ? T.ultimo : T.boxVazia);
      this.menu = {
        type: "goLista", titulo: T.escolher, index: 0, top: 0,
        itens: lista.map((c) => ({
          rotulo: `${c.mon.nickname} N${c.mon.level} CP${GoPark.cpDe(c.mon)}`, mon: c.mon,
        })),
        escolher: (mon) => {
          this.menu = null;
          const foi = GoPark.enviar(st, mon);
          if (!foi) return void this.dlg.say(T.ultimo);
          const arquivo = GoPark.baixarCartao(foi, st.player?.name || "");
          const parque = GoPark.parqueDe(st, foi);
          Audio2.heal();
          this.game.autosave?.(true);
          this.dlg.say(T.enviado.map((l) => l
            .replace("{MON}", foi.nickname).replace("{CP}", foi.cpGO)
            .replace("{ARQUIVO}", arquivo).replace("{PARQUE}", parque?.nome || "PARQUE")));
        },
      };
    });
  }

  /** PUXAR DO GO: por onde entram os que vêm de fora. */
  puxarDoGO() {
    const T = DB.GO_TEXTO;
    this.dlg.ask(T.puxarMenu, T.puxarOpcoes, (i) => {
      if (i === 0) return this.lerDoGO("texto");
      if (i === 1) return this.lerDoGO("imagem");
      if (i === 2) return this.digitarDoGO();
    });
  }

  /** Abre o seletor do sistema e lê o que vier: JSON/CSV com a sua coleção do
   *  GO, ou a imagem de um cartão (aí o que vale é o QR). Mesmo padrão do
   *  importar do FUSIONGLITCH, logo acima. */
  lerDoGO(tipo) {
    const T = DB.GO_TEXTO;
    this.menu = null;
    const imagem = tipo === "imagem";
    this.dlg.say(imagem ? T.puxarImagem : T.puxarArquivo);
    const entrada = document.createElement("input");
    entrada.type = "file";
    entrada.accept = imagem ? "image/*" : "application/json,text/csv,text/plain,.json,.csv,.txt";
    entrada.style.display = "none";
    document.body.appendChild(entrada);
    entrada.onchange = () => {
      const arquivo = entrada.files?.[0];
      entrada.remove();
      if (!arquivo) return void this.dlg.say(T.cancelou);
      this.dlg.say(T.lendo);
      if (!imagem) {
        const leitor = new FileReader();
        leitor.onload = () => this.receberDoGO(GoPark.importar(leitor.result));
        leitor.onerror = () => { Audio2.cancel(); this.dlg.say(T.erroFormato); };
        return void leitor.readAsText(arquivo);
      }
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        this.receberDoGO(GoPark.importarDeImagem(img));
      };
      img.onerror = () => { URL.revokeObjectURL(img.src); Audio2.cancel(); this.dlg.say(T.erroQR); };
      img.src = URL.createObjectURL(arquivo);
    };
    entrada.click();
  }

  /** DIGITAR NA MÃO: sem arquivo nenhum, olhando a tela do GO. Espécie e CP
   *  bastam — o nível sai da conta do CP ao contrário. */
  digitarDoGO() {
    this.menu = { type: "goDigitar", linha: 0, textos: ["", "", ""] };
  }

  /** Fecha o digitado: monta o Pokémon e manda pro complexo. */
  confirmarDigitado(m) {
    const T = DB.GO_TEXTO;
    const species = GoPark.especieDe(m.textos[0], m.textos[0]);
    if (!species) { Audio2.cancel(); return void this.dlg.say(T.digitarNada); }
    const cp = Number(String(m.textos[1]).replace(/[^\d]/g, ""));
    const [a, d, v] = String(m.textos[2]).split(/[.\s\/-]+/).map((n) => Number(n));
    const reg = { name: species, cp: cp > 0 ? cp : undefined };
    if (Number.isFinite(a)) { reg.attack = a; reg.defense = Number.isFinite(d) ? d : a; reg.stamina = Number.isFinite(v) ? v : a; }
    if (!(cp > 0) && !Number.isFinite(a)) { Audio2.cancel(); return void this.dlg.say(T.erroFormato); }
    this.menu = null;
    const r = GoPark.monDoGO(reg);
    if (r.erro) { Audio2.cancel(); return void this.dlg.say(T.digitarNada); }
    this.receberDoGO({ mons: [r.mon], avisos: [], estimado: r.nivelEstimado });
  }

  /** A CHEGADA: o que o importador devolveu entra nos parques que tiverem vaga.
   *  Nada é jogado fora em silêncio — o que não coube e o que não foi entendido
   *  viram fala. */
  receberDoGO({ mons, avisos, estimado }) {
    const T = DB.GO_TEXTO, st = this.st;
    if (!mons.length) {
      Audio2.cancel();
      const q = avisos[0] || "";
      if (q === "qr") return void this.dlg.say(T.erroQR);
      if (q === "cartao") return void this.dlg.say(T.erroCartao);
      if (q === "formato" || q === "vazio") return void this.dlg.say(T.erroFormato);
      return void this.dlg.say(T.erroNenhum);
    }
    const entraram = [];
    for (const mon of mons) { if (GoPark.receber(st, mon)) entraram.push(mon); else break; }
    if (!entraram.length) {
      Audio2.cancel();
      return void this.dlg.say(T.cheio.replace("{N}", GoPark.totalNoParque(st)).replace("{P}", DB.GO_PARK.parques));
    }
    const falas = [];
    if (entraram.length === 1) {
      const mon = entraram[0], parque = GoPark.parqueDe(st, mon);
      falas.push(...T.puxouUm.map((l) => l
        .replace("{MON}", mon.nickname).replace("{CP}", mon.cpGO)
        .replace("{PARQUE}", parque?.nome || "PARQUE")));
    } else {
      falas.push(...T.puxouVarios.map((l) => l.replace("{N}", entraram.length)));
    }
    if (entraram.length < mons.length) {
      falas.push(T.puxouParcial.replace("{N}", entraram.length).replace("{F}", mons.length - entraram.length));
    }
    if (estimado) falas.push(T.nivelEstimado);
    if (avisos?.length) falas.push(T.avisoSobrou.replace("{N}", avisos.length).replace("{L}", avisos.join(", ")));
    Audio2.heal();
    this.game.autosave?.(true);
    this.dlg.say(falas);
  }

  /** ENTRAR NO PARQUE: são cinco, e cada um mostra quantos tem dentro. */
  entrarNoParque() {
    const T = DB.GO_TEXTO, st = this.st;
    if (!GoPark.totalNoParque(st)) return void this.dlg.say(T.vazio);
    const parques = GoPark.complexo(st);
    const opcoes = parques.map((p) => T.parqueLinha
      .replace("{NOME}", p.nome).replace("{N}", p.mons.length).replace("{V}", DB.GO_PARK.porParque));
    this.dlg.ask(T.qualParque, [...opcoes, "VOLTAR"], (i) => {
      const p = parques[i];
      if (!p) return;
      if (!p.mons.length) return void this.dlg.say(T.parqueVazio);
      this.game.scenes.push(new GoParkScene(i));
    });
  }

  talkCreche() {
    const C = DB.STORY.creche;
    const st = this.st;
    // o ovo vem antes de qualquer conversa
    if (st.creche?.ovo) {
      return void this.dlg.say(C.temOvo, () => {
        this.dlg.ask(C.opcoesOvo[0] + "?", C.opcoesOvo, (i) => {
          if (i !== 0) return void this.dlg.say(C.ovoFicou);
          const r = Creche.entregarOvo(st);
          Audio2.heal();
          this.game.autosave?.(true);
          this.dlg.say(C.ovoPegou.replace("{ITEM}", r.item.toUpperCase()), () => this.talkCreche());
        });
      });
    }
    this.dlg.say(C.oi, () => {
      this.dlg.ask(C.menu, C.opcoes, (i) => {
        if (i === 0) return this.crecheDeixar();
        if (i === 1) return this.crechePegar();
        this.dlg.say(C.recusa);
      });
    });
  }

  crecheDeixar() {
    const C = DB.STORY.creche, st = this.st;
    if (!Creche.temVaga(st)) return void this.dlg.say(C.cheia);
    if (st.party.length <= 1) return void this.dlg.say(C.ultimo);
    // a equipe como ESCOLHA: Z deixa aquele, X desiste
    this.menu = {
      type: "party", index: 0, titulo: C.escolher,
      escolher: (idx) => {
        this.menu = null;
        const m = Creche.deixar(st, idx);
        if (!m) return void this.dlg.say(C.ultimo);
        Audio2.heal();
        this.game.autosave?.(true);
        const falas = [C.deixou.replace("{MON}", m.nickname)];
        if (Creche.naCreche(st).length === 2) falas.push(Creche.casal(st) ? C.casal : C.semCasal);
        this.dlg.say(falas);
      },
    };
  }

  crechePegar() {
    const C = DB.STORY.creche, st = this.st;
    const la = Creche.naCreche(st);
    if (!la.length) return void this.dlg.say(C.vazia);
    const escolhido = (mon) => {
      const niveis = Creche.niveisGanhos(st, mon), preco = Creche.precoDeVolta(st, mon);
      const como = (niveis > 0 ? C.comEle : C.semSubir)
        .replace("{MON}", mon.nickname).replace("{PASSOS}", st.creche.passos || 0).replace("{NIVEIS}", niveis);
      this.dlg.say(como, () => {
        this.dlg.ask(C.cobrar.replace("{PRECO}", preco), C.opcoesVolta, (i) => {
          if (i !== 0) return void this.dlg.say(C.recusa);
          if (st.money < preco) return void this.dlg.say(C.semGrana.replace("{PRECO}", preco));
          if (st.party.length >= 6) return void this.dlg.say(C.equipeCheia);
          const r = Creche.pegar(st, mon);
          Audio2.heal();
          this.game.autosave?.(true);
          this.dlg.say(C.pegou.replace("{MON}", r.mon.nickname).replace("{NIVEL}", r.mon.level));
        });
      });
    };
    if (la.length === 1) return escolhido(la[0]);
    this.dlg.ask(C.quem, la.map((m) => `${m.nickname} N${m.level}`), (i) => escolhido(la[i]));
  }

  /** um OVO DA CRECHE racha pela mochila: sempre a espécie dele, nível 5. */
  racharOvoDaCreche(item) {
    const C = DB.STORY.creche, T = DB.OVO_TEXTO;
    this.menu = null;
    if (this.st.party.length >= 6 && boxCheio(this.st)) { Audio2.cancel(); return void this.dlg.say(T.semVaga); }
    const mon = Creche.chocar(item);
    if (!mon) { Audio2.cancel(); return; }
    this.spend(item, 1);
    const msgs = [C.rachou.replace("{OVO}", item.toUpperCase()), C.nasceu.replace("{MON}", mon.nickname).replace("{NIVEL}", mon.level)];
    if (mon.luminoso) msgs.push(T.formas.luminoso);
    else if (mon.shiny) msgs.push(T.formas.shiny);
    if (this.st.party.length < 6) { this.st.party.push(mon); msgs.push(T.equipe.replace("{MON}", mon.nickname)); }
    else { guardarNoBox(this.st, mon); msgs.push(T.box.replace("{MON}", mon.nickname)); }
    this.st.seen[mon.species] = true;
    this.st.caught[mon.species] = true;
    if (mon.luminoso || mon.shiny) { Glitch.hit(1.6); Audio2.glitch(); }
    Audio2.heal();
    this.game.autosave?.(true);
    this.dlg.say(msgs);
  }

  /** O MONTANHISTA: $X e um item da mochila, e ele te põe do outro lado.
   *  O item é escolhido na própria mochila (`escolher` no menu dela). */
  oferecerTravessia(npc) {
    const t = npc.travessia;
    const T = DB.STORY.travessia;
    this.dlg.say(npc.lines, () => {
      this.dlg.ask(t.pergunta || T.pergunta, T.opcoes, (i) => {
        if (i !== 0) return void this.dlg.say(t.recusa || T.recusa);
        if (this.st.money < t.preco) return void this.dlg.say(T.semGrana);
        if (!Object.keys(this.st.items).length) return void this.dlg.say(T.semItem);
        this.menu = {
          type: "bag", index: 0, titulo: T.escolher,
          escolher: (item) => {
            this.menu = null;
            this.spend(item, 1);
            this.st.money -= t.preco;
            Audio2.heal();
            this.dlg.say([T.pegou.replace("{ITEM}", item.toUpperCase()), ...[].concat(t.indo || T.indo)], () => {
              Audio2.tone(220, 0.12, "sawtooth", 0.5);
              this.transition(() => {
                const p = this.st.player;
                this.st.surfando = null;
                Object.assign(p, { map: t.para.map, x: t.para.x, y: t.para.y, dir: t.para.dir || "down" });
                this.justWarped = true;
                this.afterTravel();
                this.game.autosave?.(true);
              });
            });
          },
        };
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
        boss: { id: e.id, lvl: e.nivel || 60, corrupt: !!e.corrupt },
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

  /** O CELEBI, na clareira da FLORESTA VIRIDIAN.
   *
   *  Ele não está lá desde o começo: só aparece depois que MISSINGNO. foi
   *  capturado (`flags.caughtMissingno`). Antes disso a clareira é só clareira
   *  — do mesmo jeito que a usina é só usina enquanto ninguém te contou do
   *  YVELTAL. Um bicho parado dizendo "ainda não" durante o jogo inteiro é
   *  pior que bicho nenhum: ele estraga a surpresa e não entrega nada. */
  celebiNpc() {
    const C = DB.CELEBI;
    if (!C || this.st.player.map !== C.mapa || !celebiApareceu(this.st)) return null;
    return { id: "celebi", x: C.x, y: C.y, dir: "down", sprite: C.sprite, celebi: true, lines: [] };
  }

  /** Quem está do outro lado do tempo: o CELEBI, que traz de volta, e o
   *  guardião da era, parado, esperando você atravessar o mapa até ele.
   *
   *  Capturou: ele some pra sempre e a era seguinte abre. Derrubou sem
   *  capturar: ele volta NA PRÓXIMA VIAGEM (`viajarNoTempo` limpa o estado
   *  dele), que é a mesma regra do lendário da tempestade — a viagem inteira
   *  entre você e a segunda chance já é preço bastante. */
  erasNpcs() {
    const era = eraDoMapa(this.st.player.map);
    if (!era) return [];
    const T = DB.ERAS_TEXTO || {};
    const lista = [{
      id: "celebi", x: era.geo.entrada.x + 1, y: era.geo.entrada.y, dir: "left",
      sprite: DB.CELEBI?.sprite || "mon:celebi", voltaTempo: true, lines: T.espera || [],
    }];
    const g = era.guardiao;
    const caiu = this.st.npcState[chaveGuardiao(era)]?.defeated;
    if (g && DB.SPECIES[g.id] && !this.st.caught[g.id] && !caiu) {
      lista.push({
        id: "guardiao", x: era.geo.guardiao.x, y: era.geo.guardiao.y, dir: "down",
        sprite: `mon:${g.id}`, boss: { id: g.id, lvl: g.nivel || 70 }, lines: g.lines || [],
      });
    }
    return lista;
  }

  /** A conversa da clareira: ele pergunta PRA QUANDO e a lista é só o que já
   *  está aberto. Era trancada não entra no menu como opção cinza — ela
   *  simplesmente não está lá, e o CELEBI diz por quê. */
  talkCelebi() {
    const C = DB.CELEBI, st = this.st;
    const todas = DB.ERAS || [];
    const abertas = erasAbertas(st);
    if (!abertas.length) return void this.dlg.say(C.trancada);
    const primeira = !st.flags?.celebiFalou;
    const acabou = acabouOTempo(st);
    const linhas = primeira ? [...C.primeira] : acabou ? [...C.fim] : [...C.falas];
    if (!primeira && !acabou && abertas.length < todas.length) linhas.push(C.trancada);
    (st.flags ||= {}).celebiFalou = true;
    this.dlg.say(linhas, () => {
      this.dlg.ask(C.pergunta, [...abertas.map((e) => e.curto), C.agora], (i) => {
        const era = abertas[i];
        if (!era) return void this.dlg.say(C.recusa);
        this.viajarNoTempo(era);
      });
    });
  }

  /** A viagem. Guarda DE ONDE você saiu (é pra cá que ele te devolve) e põe
   *  você na clareira de chegada da era. */
  viajarNoTempo(era) {
    const T = DB.ERAS_TEXTO || {};
    this.dlg.say(T.indo || [], () => {
      Audio2.tone(660, 0.1, "triangle", 0.5);
      Audio2.tone(990, 0.18, "triangle", 0.4);
      this.transition(() => {
        const p = this.st.player;
        this.st.tempo = { map: p.map, x: p.x, y: p.y, dir: p.dir, era: era.id };
        this.st.surfando = null;
        // derrubado sem capturar na viagem passada: ele está de pé de novo
        if (!this.st.caught[era.guardiao.id]) delete this.st.npcState[chaveGuardiao(era)];
        p.map = era.mapa; p.x = era.geo.entrada.x; p.y = era.geo.entrada.y; p.dir = "up";
        this.justWarped = true;
        this.afterTravel();
        this.game.autosave?.(true);
        this.dlg.say(era.chegada || []);
      });
    });
  }

  /** A volta. `st.tempo` é o endereço de casa; se ele sumir (save de uma versão
   *  anterior, VOAR pra fora da era e voltar por outro caminho), o CELEBI
   *  devolve na clareira dele — nunca deixa ninguém preso num ano. */
  voltarDoTempo() {
    const T = DB.ERAS_TEXTO || {}, C = DB.CELEBI, st = this.st;
    const era = eraDoMapa(st.player.map);
    const g = era?.guardiao;
    // o comentário dele sobre o guardião capturado, uma vez só
    const marca = era && `eraFim_${era.id}`;
    const fecho = (g && st.caught?.[g.id] && !st.flags?.[marca]) ? (g.capturado || []) : [];
    if (fecho.length) (st.flags ||= {})[marca] = true;
    const perguntar = () => this.dlg.ask(T.perguntaVolta, T.opcoesVolta, (i) => {
      if (i !== 0) return void this.dlg.say(T.ficar);
      this.transition(() => {
        const casa = st.tempo || { map: C.mapa, x: C.x, y: C.y + 1, dir: "up" };
        Object.assign(st.player, { map: casa.map, x: casa.x, y: casa.y, dir: casa.dir || "down" });
        st.tempo = null;
        st.surfando = null;
        this.justWarped = true;
        this.afterTravel();
        this.game.autosave?.(true);
      });
    });
    if (fecho.length) this.dlg.say(fecho, perguntar);
    else perguntar();
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

    // A ORDEM DO LABORATÓRIO: o INICIAL (nas bolas da mesa), depois a POKÉDEX,
    // depois o DECODIFICADOR DE GENOMA. Normalmente os dois saem em sequência
    // logo depois de você pegar a bola (`entregarInicial`); isto aqui é pra
    // quem saiu antes do fim da conversa, ou pra um save de antes da Pokédex.
    if (st.flags.starterChosen && !temPokedex(st)) return this.darPokedex(() => this.talkOak(npc, state));
    if (st.flags.starterChosen && !st.flags.decodificador) return this.darDecodificador(npc, state);

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
    // no laboratório da PROFA. IPÊ a conversa é outra: a Pokédex sai da mão
    // dela, e em vez do "siga pela ROTA 1" vem o APAGÃO
    if (this.map.labBraglitch) {
      return void this.dlg.say([`VOCÊ RECEBEU ${mon.nickname}!`], () =>
        (temPokedex(this.st) ? this.darMissaoIpe() : this.darPokedexIpe(() => this.darMissaoIpe())));
    }
    // o inicial, depois a POKÉDEX, depois o DECODIFICADOR — e só então o
    // "siga pela ROTA 1", que é o fim da conversa
    const fim = () => this.dlg.say(DB.POKEDEX_TEXTO?.fim || []);
    const decodificador = () => (this.st.flags.decodificador ? fim() : this.darDecodificador(null, state, fim));
    this.dlg.say([`VOCÊ RECEBEU ${mon.nickname}!`], () =>
      (temPokedex(this.st) && this.st.flags.pokedex ? decodificador() : this.darPokedex(decodificador)));
  }

  // ------------------------------------------------------------- BRAGLITCH
  // A história de lá são AS ILHAS (src/data/braglitch-ilhas.js e
  // src/systems/ilhas.js): a PROFA. IPÊ dá a missão no laboratório e depois
  // espera no píer, com a lancha; o PROF. CARVALHO chega depois da primeira
  // ilha e fica do lado dela. O SACI, as lendas e o livro continuam montados em
  // runtime, como o AZUL e o DEOXYS.

  /** A PROFA. IPÊ no laboratório: inicial, Pokédex e a missão. Depois disso
   *  ela sai de lá (`someComFlag`) e vai pra lancha (`lanchaIpe`). */
  talkIpe(npc, state) {
    const st = this.st;
    if (!st.flags.starterChosen) return void this.dlg.say(npc.lines);
    if (!temPokedex(st)) return this.darPokedexIpe(() => this.talkIpe(npc, state));
    this.darMissaoIpe();
  }

  /** A IPÊ e o CARVALHO na lancha: no píer de SÃO LUCARIO (depois da missão)
   *  e no píer da ilha em que você está. */
  lanchaNpcs() {
    const st = this.st, aqui = st.player.map, L = DB.BRAGLITCH?.lancha;
    if (!st.flags.bragMissao || !L) return [];
    const ilha = ilhaDoMapa(aqui);
    const lugar = aqui === L.mapa ? L : ilha ? { ipe: ilha.lancha, carvalho: ilha.carvalho } : null;
    if (!lugar) return [];
    const out = [{ id: "ipe", ...lugar.ipe, dir: "down", sprite: DB.PROFS.ipe.sprite, lancha: true, lines: ["..."] }];
    // o CARVALHO chega quando a primeira ilha é entregue
    if (ilhas()[0] && ilhaEntregue(st, ilhas()[0])) {
      out.push({ id: "carvalho_lancha", ...lugar.carvalho, dir: "down", sprite: DB.PROFS.carvalho.sprite,
                 carvalhoLancha: true, lines: ["..."] });
    }
    return out;
  }

  /** Falar com a IPÊ na lancha: ela cura a equipe, conta a ilha que ficou
   *  completa (se tiver uma), e pergunta pra onde. */
  lanchaIpe() {
    const st = this.st, T = DB.ILHAS_TEXTO;
    st.party.forEach(heal);
    Audio2.heal();
    // quem vem de um save antigo (a missão era a dos redemoinhos) ouve a teoria
    if (!st.flags.bragIlhas) {
      st.flags.bragIlhas = true;
      this.game.autosave?.(true);
      return void this.dlg.say(T.comeco, () => this.menuLancha());
    }
    const pronta = ilhas().find((i) => !ilhaEntregue(st, i) && ilhaCompleta(st, i));
    if (pronta) return this.entregarIlha(pronta);
    if (todasEntregues(st) && !st.flags.bragIlhasFim) return this.fimDasIlhas();
    const msgs = [T.oi, T.curou];
    const aqui = ilhaDoMapa(st.player.map);
    if (aqui && !ilhaEntregue(st, aqui)) {
      msgs.push(T.falta.replace("{ILHA}", aqui.nome).replace("{N}", formasPegas(st, aqui)));
      if (!chefeVencido(st, aqui)) msgs.push(T.faltaChefe);
    }
    if (st.flags.bragIlhasFim) msgs.push(T.depois);
    this.dlg.say(msgs, () => this.menuLancha());
  }

  /** A ILHA COMPLETA: a IPÊ conta o que descobriu, o CARVALHO compara com
   *  Kanto, sai o prêmio e — nas cinco primeiras — um PANDEIRO DA TERRA. A
   *  ilha entra em `st.bragBadges` (o menu de INSÍGNIAS de Braglitch). */
  entregarIlha(ilha, depois) {
    const st = this.st, T = DB.ILHAS_TEXTO;
    (st.bragBadges ||= []).push(insigniaDaIlha(ilha));
    st.items[T.premio.item] = Math.min(999, (st.items[T.premio.item] || 0) + T.premio.qty);
    const pd = (DB.PANDEIROS || []).find((p) => p.ilha === ilha.id && !st.flags[`pandeiro_${p.id}`]);
    if (pd) { st.flags[`pandeiro_${pd.id}`] = true; st.items[pd.item] = 1; }
    // A PEDRA BRAGLITCHIANA que o chefe deixa (src/systems/pedras.js)
    const pedra = (DB.PEDRAS_BRAG || []).find((p) => p.ilha === ilha.id);
    const falaPedra = [];
    if (pedra && !(st.items[pedra.item] > 0)) {
      st.items[pedra.item] = 1;
      const nome = pedra.item.toUpperCase(), chefe = DB.SPECIES[ilha.chefe]?.name || "CHEFE";
      falaPedra.push(T.pedraCaiu.replace("{CHEFE}", chefe).replace("{PEDRA}", nome),
                     T.pedraGanhou.replace("{PEDRA}", nome), pedra.texto);
    }
    this.game.autosave?.(true);
    const falas = [...falaPedra, ...ilha.fim];
    // o CARVALHO só está na lancha depois da primeira ilha
    if (ilhas().indexOf(ilha) > 0) falas.push(...(ilha.carvalhoFala || []));
    falas.push(T.ganhou);
    if (pd) falas.push(...pd.fala, DB.PANDEIRO_GANHOU.replace("{ITEM}", pd.item.toUpperCase()));
    Audio2.tone(660, 0.06); Audio2.tone(990, 0.1);
    this.dlg.say(falas, () => (todasEntregues(st) ? this.fimDasIlhas() : depois ? depois() : this.menuLancha()));
  }

  /** O CHEFE CAIU: a IPÊ vem correndo do píer, conta a ilha e já sobe todo
   *  mundo na lancha pra PRÓXIMA ilha — sem menu, sem voltar andando. Roda a
   *  cada quadro parado (como `entregarLendas`), então espera a fala da
   *  batalha acabar. Devolve true quando tomou conta do quadro. */
  chefeDaIlhaCaiu() {
    const st = this.st;
    if (this.dlg.active || this.dlg.choice || this.menu || this.fx || this.viagemLancha) return false;
    const ilha = ilhaDoMapa(st.player.map);
    if (!ilha || ilhaEntregue(st, ilha) || !ilhaCompleta(st, ilha)) return false;
    const prox = ilhas()[ilhas().indexOf(ilha) + 1];
    st.party.forEach(heal);
    this.dlg.say(DB.ILHAS_TEXTO.veio, () => this.entregarIlha(ilha, prox && (() => {
      Audio2.tone(196, 0.18, "square", 0.25);
      Audio2.tone(247, 0.22, "square", 0.25);
      this.dlg.say(DB.ILHAS_TEXTO.proxima.replace("{ILHA}", prox.nome), () => {
        this.viagemLancha = { t: 0, total: 4.5,
                              destino: { nome: prox.nome, porto: prox.id, x: prox.chegada.x, y: prox.chegada.y } };
      });
    })));
    return true;
  }

  /** As oito ilhas entregues: os dois professores fecham a história, e as
   *  lendas acordam (`braglitchNpcs`). */
  fimDasIlhas() {
    const st = this.st, T = DB.ILHAS_TEXTO;
    st.flags.bragIlhasFim = true;
    st.items[T.premioFinal.item] = Math.min(999, (st.items[T.premioFinal.item] || 0) + T.premioFinal.qty);
    this.game.autosave?.(true);
    Audio2.heal();
    this.dlg.say([...T.final, T.ganhouFinal]);
  }

  /** Pra onde a lancha vai: as ilhas já abertas e SÃO LUCARIO, menos onde você está. */
  menuLancha() {
    const st = this.st, T = DB.ILHAS_TEXTO, L = DB.BRAGLITCH.lancha, aqui = st.player.map;
    const destinos = ilhas().filter((i) => i.id !== aqui && ilhaAberta(st, i))
      .map((i) => ({ nome: i.nome, porto: i.id, x: i.chegada.x, y: i.chegada.y }));
    if (aqui !== L.mapa) destinos.push({ nome: T.voltar, porto: L.mapa, x: L.chegada.x, y: L.chegada.y });
    this.dlg.ask(T.pergunta, [...destinos.map((d) => d.nome), T.agoraNao], (i) => {
      const d = destinos[i];
      if (!d) return;
      this.dlg.say(T.zarpou, () => {
        Audio2.tone(196, 0.18, "square", 0.25);
        Audio2.tone(247, 0.22, "square", 0.25);
        this.viagemLancha = { t: 0, total: 4.5, destino: d };
      });
    });
  }

  /** A TRAVESSIA DE LANCHA: a tela desenhada (`drawLancha`) corre sozinha, e
   *  no fim você desce no píer do outro lado. */
  andarDeLancha(dt) {
    const v = this.viagemLancha, st = this.st, T = DB.ILHAS_TEXTO, d = v.destino;
    v.t += dt;
    if (v.t < v.total) return;
    Object.assign(st.player, { map: d.porto, x: d.x, y: d.y, dir: "down" });
    st.surfando = null;
    this.compa = null;
    this.justWarped = true;
    this.viagemLancha = null;
    this.afterTravel();
    this.game.autosave?.(true);
    this.dlg.say(T.chegou.replace("{ONDE}", d.nome));
  }

  /** A LANCHA NO ESCURO: tela preta, e a lancha atravessando da esquerda pra
   *  direita, quicando nas ondas — a PROFA. IPÊ no volante, na frente, e você
   *  sentado atrás dela, com a esteira de espuma ficando pra trás. */
  drawLancha(ctx) {
    const v = this.viagemLancha;
    const k = Math.min(1, v.t / v.total);
    const agora = performance.now() / 1000;
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
    const agua = 104;
    // as ondinhas no escuro: tracinhos azuis correndo pra trás
    ctx.fillStyle = "#12305a";
    for (let y = agua + 4; y < agua + 40; y += 7) {
      for (let x = -24; x < W + 24; x += 28) {
        const dx = (agora * 40 + y * 5) % 28;
        ctx.fillRect(Math.round(x - dx), y, 10, 1);
      }
    }
    // a lancha: entra pela esquerda e sai pela direita
    const bx = Math.round(-70 + (W + 140) * k);
    const by = agua + Math.round(Math.sin(agora * 7) * 1.5);
    const incl = Math.sin(agora * 3.5) * 1.2;             // o bico sobe e desce
    // a esteira de espuma atrás
    ctx.fillStyle = "#cfe8ff";
    for (let i = 0; i < 14; i++) {
      const ex = bx - 36 - i * 7, abre = 1 + i * 0.6;
      if ((i + Math.floor(agora * 10)) % 3 === 0) continue;
      ctx.fillRect(Math.round(ex), Math.round(by + 6 - abre), 5, 1);
      ctx.fillRect(Math.round(ex), Math.round(by + 8 + abre), 5, 1);
    }
    // as duas pessoas (desenhadas antes do casco, que cobre as pernas)
    const pessoa = (nome, x, y) => {
      const sets = Assets.actor(nome) || Assets.actor("hero");
      const img = sets?.right?.[0] || (sets?.left?.[0] && espelhar(sets.left[0])) || sets?.down?.[0];
      if (img) ctx.drawImage(img, Math.round(x - img.width / 2), Math.round(y - img.height));
    };
    pessoa("hero", bx - 14, by + 8 - incl);                        // você, atrás (sentado)
    pessoa(DB.PROFS?.ipe?.sprite || "ipe", bx + 10, by + 6 + incl);   // a IPÊ, no volante
    // o volante e o para-brisa na frente dela
    ctx.fillStyle = "#2a2d33"; ctx.fillRect(bx + 16, by - 10, 2, 8);
    ctx.fillStyle = "rgba(170,220,255,.75)";
    ctx.beginPath(); ctx.moveTo(bx + 19, by - 1); ctx.lineTo(bx + 24, by - 14); ctx.lineTo(bx + 27, by - 14); ctx.lineTo(bx + 24, by - 1); ctx.fill();
    // o casco: branco com a faixa verde e amarela, bico pra direita
    ctx.fillStyle = "#f4f4f0";
    ctx.beginPath();
    ctx.moveTo(bx - 34, by - 2 - incl);
    ctx.lineTo(bx + 30, by - 2 + incl);
    ctx.lineTo(bx + 40, by - 5 + incl);
    ctx.lineTo(bx + 30, by + 10);
    ctx.lineTo(bx - 30, by + 10);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#1f9a4a"; ctx.fillRect(bx - 32, by + 2, 62, 2);
    ctx.fillStyle = "#f2c230"; ctx.fillRect(bx - 31, by + 4, 60, 1);
    ctx.fillStyle = "#9aa4ae"; ctx.fillRect(bx - 30, by + 9, 60, 1);
    // o motor de popa, cuspindo espuma
    ctx.fillStyle = "#3a3f48"; ctx.fillRect(bx - 38, by - 4, 5, 12);
    ctx.fillStyle = "#e8f4ff";
    if (Math.floor(agora * 12) % 2) ctx.fillRect(bx - 42, by + 7, 4, 2);
    // o rótulo, como o do bondinho
    const rotulo = `A CAMINHO DE ${v.destino.nome}`;
    panel(ctx, 4, 4, rotulo.length * 6 + 12, 18);
    drawText(ctx, rotulo, 9, 9, PAL.ink);
  }

  /** O CARVALHO na lancha: o que ele anda anotando. */
  falarCarvalhoLancha() {
    const T = DB.ILHAS_TEXTO;
    this.dlg.say(this.st.flags.bragIlhasFim ? T.carvalhoFim : T.carvalho);
  }

  darPokedexIpe(depois) {
    const P = DB.POKEDEX_TEXTO;
    this.st.flags.pokedex = true;
    this.dlg.say(DB.BRAGLITCH_TEXTO.pokedex, () => {
      Audio2.heal();
      this.game.autosave?.(true);
      this.dlg.say([P.ganhou, P.explica[0]], () => depois?.());
    });
  }

  darMissaoIpe() {
    this.st.flags.bragMissao = true;
    this.st.flags.bragIlhas = true;
    this.game.autosave?.(true);
    this.dlg.say(DB.BRAGLITCH_TEXTO.missao);
  }

  /** O ENCONTRO DOS DOIS PROFESSORES neste mapa (src/data/braglitch.js):
   *  o primeiro da lista cujas condições batem e que ainda não aconteceu. */
  encontroProfsAqui() {
    const st = this.st, aqui = st.player.map;
    const bate = (r = {}) =>
      (r.flags || []).every((f) => st.flags[f]) && !(r.semFlags || []).some((f) => st.flags[f])
      && (r.pegos || []).every((id) => st.caught?.[id])
      && (st.badges || []).length >= (r.kanto || 0) && (st.bragBadges || []).length >= (r.braglitch || 0);
    return (DB.ENCONTROS_PROFS || []).find((e) => e.mapa === aqui && !st.flags[`profs_${e.id}`] && bate(e.requer)) || null;
  }

  /** Quem veio de visita: durante o encontro, e depois dele até você sair do
   *  mapa (quem conversou não evapora na sua frente). */
  profsVisitando() {
    const aqui = this.st.player.map;
    const enc = this.encontroProfsAqui()
      || (this.profsFica?.mapa === aqui ? (DB.ENCONTROS_PROFS || []).find((e) => e.id === this.profsFica.id) : null);
    if (!enc) return [];
    return enc.visita.map((v) => ({
      id: v.id, x: v.x, y: v.y, dir: v.dir, sprite: DB.PROFS[v.quem].sprite,
      profVisita: v.quem, lines: enc.depois,
    }));
  }

  /** A conversa dos dois. Os dois se viram pra você, falam, e o prêmio sai no fim. */
  conversaDosProfs(enc, npc) {
    const st = this.st;
    st.flags[`profs_${enc.id}`] = true;
    this.profsFica = { id: enc.id, mapa: st.player.map };
    this.dlg.say(enc.conversa, () => {
      const p = enc.premio;
      if (p) {
        st.items[p.item] = Math.min(999, (st.items[p.item] || 0) + p.qty);
        Audio2.heal();
      }
      this.game.autosave?.(true);
      if (p) this.dlg.say(`VOCÊ RECEBEU ${p.qty} ${p.item.toUpperCase()}!`);
    });
  }

  /** O SACI na clareira (desde a missão da IPÊ) e as lendas, se for a hora. */
  braglitchNpcs() {
    const st = this.st, aqui = st.player.map, out = [];
    const S = DB.SACI_NA_MATA;
    if (S && S.mapa === aqui && !st.caught?.saci && st.flags.bragMissao) {
      out.push({ id: "saci", x: S.x, y: S.y, dir: "down", sprite: "mon:saci", saci: true });
    }
    // AS LENDAS: soltas quando as oito ilhas estão completas, cada uma na sua
    // estrada, até serem pegas
    if (st.flags.bragIlhasFim) {
      for (const l of DB.LENDAS_BRAG || []) {
        if (l.mapa !== aqui || st.caught?.[l.id] || st.flags[`lenda_sumiu_${l.id}`]) continue;
        if (st.npcState[`${l.mapa}.lenda_${l.id}`]?.defeated) continue;   // vencida: já é sua
        if ((l.requer?.pegos || []).some((id) => !st.caught?.[id])) continue;   // o ENCONTRIUM espera os outros dois
        out.push({ id: `lenda_${l.id}`, x: l.x, y: l.y, dir: "down", sprite: `mon:${l.id}`, lenda: l });
      }
    }
    // AS LENDAS DO VOID (src/data/void.js): no preto do mapa, sem esperar insígnia
    for (const l of DB.LENDAS_VOID || []) {
      if (l.mapa !== aqui || st.caught?.[l.id] || st.flags[`lenda_sumiu_${l.id}`] || !DB.SPECIES[l.id]) continue;
      if (st.npcState[`${l.mapa}.lenda_${l.id}`]?.defeated) continue;
      out.push({ id: `lenda_${l.id}`, x: l.x, y: l.y, dir: "down", sprite: `mon:${l.id}`, lenda: l });
    }
    return out;
  }

  enfrentarSaci(npc) {
    const T = DB.BRAGLITCH_TEXTO;
    if (!this.st.party.some((m) => m.hp > 0)) return void this.dlg.say(T.semPokemon);
    this.startBossBattle({ id: npc.id, lines: T.saci, falaCaptura: T.saciPego,
                           boss: { id: "saci", lvl: DB.SACI_NA_MATA.lvl } });
  }

  enfrentarLenda(npc) {
    const T = DB.BRAGLITCH_TEXTO, l = npc.lenda;
    if (!this.st.party.some((m) => m.hp > 0)) return void this.dlg.say(T.semPokemon);
    const nome = DB.SPECIES[l.id]?.name || l.id.toUpperCase();
    this.startBossBattle({ id: npc.id, lines: l.fala, falaCaptura: T.lenda.replace("{MON}", nome),
                           boss: { id: l.id, lvl: l.lvl } });
  }

  /** O LIVRO DAS COORDENADAS DA LENDA, no chão de SALVADITTO: onde cada lenda
   *  de Braglitch aparece (mapa, X e Y), e o que já aconteceu com ela. Ler o
   *  livro também ensina a contar: dali em diante, nas estradas onde mora uma
   *  lenda, o canto da tela mostra o seu X e Y (ver `drawCoordenadas`). */
  lerLivroDasLendas() {
    const st = this.st, L = DB.BRAGLITCH_TEXTO.livro;
    st.flags.leuLivroLendas = true;
    const paginas = [...L.abre];
    if (!st.flags.bragIlhasFim) paginas.push(L.dorme);
    for (const l of this.todasAsLendas()) {
      if (l === (DB.LENDAS_VOID || [])[0]) paginas.push(...[].concat(L.void));
      const nome = DB.SPECIES[l.id]?.name || l.id.toUpperCase();
      const lugar = DB.MAPS[l.mapa]?.name || l.mapa;
      const molde = st.caught?.[l.id] ? L.pego : st.flags[`lenda_sumiu_${l.id}`] ? L.sumiu : L.linha;
      paginas.push(molde.replace("{MON}", nome).replace("{LUGAR}", lugar).replace("{X}", l.x).replace("{Y}", l.y));
    }
    paginas.push(L.fecha);
    Audio2.select();
    this.dlg.say(paginas);
  }

  /** As lendas de Braglitch: as das estradas e as do VOID (no preto) */
  todasAsLendas() {
    return [...(DB.LENDAS_BRAG || []), ...(DB.LENDAS_VOID || []).filter((l) => DB.SPECIES[l.id])];
  }

  /** O X e o Y de onde você está, no canto de baixo — só depois do livro e só
   *  nas estradas onde mora uma lenda (em qualquer lugar seria ruído). */
  drawCoordenadas(ctx) {
    const st = this.st, p = st.player;
    if (!st.flags.leuLivroLendas || !this.todasAsLendas().some((l) => l.mapa === p.map)) return;
    const txt = `X ${p.x} Y ${p.y}`;
    const w = txt.length * 6 + 10;
    panel(ctx, W - w - 4, H - 22, w, 18);
    drawText(ctx, txt, W - w + 1, H - 17, PAL.ink);
  }

  /** Depois da batalha: devolve o SACI pra clareira se ele só apanhou (ele
   *  volta — é o SACI). */
  conferirBraglitch() {
    const st = this.st, T = DB.BRAGLITCH_TEXTO;
    if (!T || this.dlg.active) return;
    const S = DB.SACI_NA_MATA;
    const chave = S && `${S.mapa}.saci`;
    if (chave && st.npcState[chave]?.defeated && !st.caught?.saci) {
      delete st.npcState[chave];
      this.dlg.say(T.saciFugiu);
    }
    this.entregarLendas();
  }

  /** LENDA VENCIDA É LENDA CAPTURADA: quem derruba uma lenda ganha ela na hora
   *  — ela vem pra equipe (ou pra box, com a equipe cheia), inteira e no nível
   *  em que lutou. O livro de SALVADITTO passa a dizer "CAPTURADO". Roda na
   *  volta da batalha E a cada quadro parado (ver `update`): na volta pode ter
   *  outra fala na tela, e aí a entrega espera ela acabar em vez de se perder.
   *  Devolve true quando entregou. */
  entregarLendas() {
    const st = this.st, T = DB.BRAGLITCH_TEXTO;
    if (!T || this.dlg.active || this.menu || this.fx) return false;
    for (const l of this.todasAsLendas()) {
      const k = `${l.mapa}.lenda_${l.id}`;
      if (st.npcState[k]?.defeated && !st.caught?.[l.id] && DB.SPECIES[l.id]) {
        const mon = createMon(l.id, l.lvl);
        const msgs = [T.lendaCapturada.replace("{MON}", mon.nickname)];
        if (st.party.length < 6) { st.party.push(mon); msgs.push(T.lendaEquipe.replace("{MON}", mon.nickname)); }
        else { guardarNoBox(st, mon); msgs.push(T.lendaBox.replace("{MON}", mon.nickname)); }
        st.seen[l.id] = true;
        st.caught[l.id] = true;
        delete st.flags[`lenda_sumiu_${l.id}`];
        Audio2.heal();
        this.game.autosave?.(true);
        this.dlg.say(msgs);
        return true;
      }
    }
    return false;
  }

  /** O MISSINGNO CHEGA EM BRAGLITCH: com as seis lendas pegas, na primeira
   *  vez que você está parado num mapa de lá. Daí em diante o mato e a tela de
   *  Braglitch são de glitch de verdade (ver `sortearSelvagem` e `update`).
   *  Devolve true quando tomou conta do quadro. */
  glitchChegaEmBraglitch() {
    const st = this.st, T = DB.BRAGLITCH_TEXTO;
    if (!T?.glitchChegou || st.flags.bragGlitch || this.dlg.active || this.menu || this.fx) return false;
    if (!emBraglitch(st.player.map) || !seisLendasPegas(st)) return false;
    st.flags.bragGlitch = true;
    this.selvagens = [];            // o mato de antes era folclore: nasce de novo, já glitch
    this.primeiroMissingno = true;
    Glitch.forced = true;
    Glitch.hit(2.5);
    Audio2.glitch();
    this.tremor = 1;
    this.game.autosave?.(true);
    this.dlg.say(T.glitchChegou);
    return true;
  }

  // ------------------------------------- AS MEGAS DESCONTROLADAS
  // src/data/descontroladas.js: de noite, um mega evoluído sem treinador, com
  // aura roxa. A luta é de chefe (src/scenes/battle.js, `descontrolada`).

  /** As descontroladas deste mapa agora: só de noite e só as não vencidas. O
   *  lugar é o chão livre mais perto de `perto` (achado uma vez por mapa). */
  descontroladasNpcs() {
    const D = DB.DESCONTROLADAS, aqui = this.st.player.map;
    if (!D || !temCeu(this.map) || !horaDoMundo().noite) return [];
    const out = [];
    for (const d of D.lista) {
      if (d.mapa !== aqui || !DB.SPECIES[d.to]) continue;
      const id = `descontrolada_${d.to}`;
      if (this.st.npcState[`${aqui}.${id}`]?.defeated) continue;
      const lugar = this.lugarDaDescontrolada(d);
      if (!lugar) continue;
      out.push({ id, ...lugar, dir: "down", sprite: `mon:${d.to}`, descontrolada: d, lines: ["..."] });
    }
    return out;
  }

  lugarDaDescontrolada(d) {
    const cache = (this._lugaresDesc ||= {});
    const chave = `${d.mapa}.${d.to}`;
    if (chave in cache) return cache[chave];
    const ocupado = new Set((this.map.npcs || []).map((n) => `${n.x},${n.y}`));
    ocupado.add(`${this.st.player.x},${this.st.player.y}`);
    const chao = (x, y) => {
      const t = this.tagAt(x, y);
      return t >= 0 && t !== DB.TAG.BLOCK && t < 4 && t !== DB.TAG.WATER;
    };
    // NO ISOMÉTRICO o que fica a leste e ao sul é desenhado POR CIMA: colado
    // num prédio por esses lados, o bloco alto tapava ele inteiro (o ASH
    // sumia atrás do laboratório de PALLET). Então esses três vizinhos também
    // têm que ser chão.
    const livre = (x, y) => chao(x, y) && chao(x + 1, y) && chao(x, y + 1) && chao(x + 1, y + 1)
      && !this.warpAt(x, y) && !ocupado.has(`${x},${y}`);
    const [x0, y0] = d.perto || [this.map.spawn?.x || 8, this.map.spawn?.y || 8];
    let achou = null;
    for (let r = 0; r < 14 && !achou; r++) {
      for (let dy = -r; dy <= r && !achou; dy++) {
        for (let dx = -r; dx <= r && !achou; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
          if (livre(x0 + dx, y0 + dy)) achou = { x: x0 + dx, y: y0 + dy };
        }
      }
    }
    cache[chave] = achou;
    return achou;
  }

  enfrentarDescontrolada(npc) {
    const D = DB.DESCONTROLADAS, T = D.textos, d = npc.descontrolada;
    const nome = DB.SPECIES[d.to].name;
    const f = (t) => t.replace("{MON}", nome);
    if (!this.st.party.some((m) => m.hp > 0)) return void this.dlg.say(T.aparece.map(f));
    Audio2.tone(98, 0.5, "sawtooth", 0.35);
    this.dlg.say(T.aparece.map(f), () => this.dlg.ask(f(T.pergunta), T.opcoes, (i) => {
      if (i !== 0) return void this.dlg.say(T.saiu);
      const N = D.nivel;
      const insignias = (this.st.badges || []).length + (this.st.bragBadges || []).length;
      const lvl = Math.min(N.max, N.base + N.porInsignia * insignias);
      const foe = createMon(d.to, lvl);
      const pedra = (DB.MEGAS?.[d.id] || []).find((r) => r.to === d.to)?.pedra || null;
      Audio2.stopLoop();
      this.fx = { t: 0, cb: () => this.game.scenes.push(new BattleScene(), {
        foe, boss: true, npcKey: `${this.st.player.map}.${npc.id}`,
        descontrolada: { pedra, base: DB.SPECIES[d.id]?.name || d.id },
      }) };
    }));
  }

  /** O ASH (src/data/ash.js): em PALLET, depois que você fecha uma das
   *  histórias. É um treinador comum pro resto do jogo (a conversa, a luta e o
   *  "já venci" são os de sempre), montado aqui só porque a hora dele chega. */
  ashNpc() {
    const A = DB.ASH;
    if (!A || this.st.player.map !== A.mapa) return null;
    if (!(A.requer || []).some((f) => this.st.flags?.[f])) return null;
    const lugar = this.lugarDaDescontrolada({ mapa: A.mapa, to: "ash", perto: A.perto });
    if (!lugar) return null;
    const party = A.time.filter(([id]) => DB.SPECIES[id]).map(([id, lvl]) => ({ id, lvl }));
    return {
      id: "ash", ...lugar, dir: "down", sprite: A.sprite,
      lines: A.antes, afterLines: A.depois, againLines: A.denovo,
      trainer: { name: A.nome, prize: A.premio, party, sprite: A.sprite },
    };
  }

  // --------------------------------------------- A LIGA DE BRAGLITCH
  // src/data/braglitch-liga.js: o portão, o ELITE QUIZ e os dois campeões.

  /** O guarda do portão: oito insígnias de ginásio e o MISSINGNO vencido. */
  talkLigaPortao() {
    const L = DB.LIGA_BRAG, st = this.st, P = L.portao;
    const ids = new Set((DB.INSIGNIAS_BRAG || []).map((b) => b.id));
    const n = (st.bragBadges || []).filter((b) => ids.has(b)).length;
    if (n < ids.size) return void this.dlg.say([...P.antes, P.faltaInsignia.replace("{N}", n)]);
    if (!st.flags.bragMissingnoVencido) return void this.dlg.say([...P.antes, P.faltaMissingno]);
    this.dlg.say(P.passa, () => {
      st.flags.ligaPortao = true;            // ele sai da passagem (`someComFlag`)
      Audio2.heal();
      this.game.autosave?.(true);
    });
  }

  /** Um mestre do ELITE QUIZ: perguntas sorteadas da lista dele, com as opções
   *  embaralhadas (decorar a posição não vale). Errou uma, começa de novo;
   *  acertou todas, o rank sobe e ele sai da frente. */
  talkLigaQuiz(i) {
    const L = DB.LIGA_BRAG, q = L.quiz[i], st = this.st;
    const embaralha = (lista) => lista.map((x) => [Math.random(), x]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
    const perguntas = embaralha(q.perguntas).slice(0, L.porQuiz);
    const fazer = (k) => {
      if (k >= perguntas.length) {
        Audio2.tone(523, 0.07); Audio2.tone(784, 0.07); Audio2.tone(1046, 0.14);
        return void this.dlg.say([L.fimQuiz, L.subiu.replace("{RANK}", q.rank), ...q.depois], () => {
          st.flags[`ligaQuiz${i}`] = true;
          st.flags.ligaRank = q.rank;
          Audio2.heal();
          this.game.autosave?.(true);
        });
      }
      const p = perguntas[k];
      const ordem = embaralha(p.opcoes.map((_, j) => j));
      this.dlg.ask(`${q.nome} (${k + 1}/${perguntas.length}): ${p.pergunta}`, ordem.map((j) => p.opcoes[j]), (esc) => {
        if (esc == null || esc < 0) return;
        if (ordem[esc] !== p.certa) { Audio2.cancel(); return void this.dlg.say(L.errado); }
        Audio2.tone(784, 0.06);
        this.dlg.say(L.certo, () => fazer(k + 1));
      });
    };
    this.dlg.say(q.intro, () => fazer(0));
  }

  /** OS CAMPEÕES: a luta dupla, você e o gêmeo contra os dois. */
  talkLigaCampeao(npc) {
    const L = DB.LIGA_BRAG, st = this.st;
    if (st.flags.bragCampeao) return void this.dlg.say(L.depois[npc.id] || "...");
    this.dlg.say(L.desafio, () => this.dlg.ask(L.pergunta, L.opcoes, (i) => {
      if (i !== 0) return void this.dlg.say(L.recusou);
      this.lutarContraCampeoes();
    }));
  }

  lutarContraCampeoes() {
    const L = DB.LIGA_BRAG, nome = quemEhOGemeo(this.st);
    const time = (lista) => lista.filter(([id]) => DB.SPECIES[id])
      .map(([id, lvl, extra]) => ({ id, lvl, shiny: extra === "shiny", mega: extra === "mega" ? L.megas[id] : null }));
    const [a, b] = L.campeoes;
    const g = nome && L.gemeo[nome];
    Audio2.stopLoop();
    Audio2.tone(880, 0.08); Audio2.tone(660, 0.12);
    this.fx = { t: 0, cb: () => this.game.scenes.push(new GrupoBattleScene(), {
      tamanho: 2, npcKey: `${L.mapa}.campeoes`,
      trainer: { name: a.nome, sprite: a.sprite, party: time(a.time), prize: L.premio, dupla: true,
                 nomeDupla: L.nomeDupla, ligaBrag: true, falaMega: L.falaMega },
      trainer2: { name: b.nome, sprite: b.sprite, party: time(b.time) },
      aliado: g ? { name: nome, sprite: DB.GEMEO.sprite[nome], party: time(g.time) } : null,
    }) };
  }

  /** O BONDINHO (src/data/braglitch.js): a estação pergunta, e o SIM começa a
   *  viagem — a cabine atravessa o mar numa tela desenhada (`drawBondinho`) e
   *  desce na estação da outra ponta. */
  pegarBondinho(de) {
    const B = DB.BONDINHO;
    const para = B.estacoes.find((e) => e !== de);
    if (!para || !DB.MAPS[para.mapa]) return;
    this.dlg.ask(B.pergunta.replace("{AQUI}", de.nome).replace("{LA}", para.nome), B.opcoes, (i) => {
      if (i !== 0) return;
      this.dlg.say(B.partiu, () => {
        Audio2.tone(523, 0.1, "triangle", 0.4);
        Audio2.tone(659, 0.14, "triangle", 0.4);
        // da esquerda pra direita saindo de Carvoriú, e o contrário na volta
        this.viagemBondinho = { t: 0, total: 5, de, para, ida: de === B.estacoes[0] };
      });
    });
  }

  /** O CABO DO BONDINHO no mapa: do alto do poste da estação até a borda do
   *  mapa do lado do mar, por cima de tudo (é fio no ar). No isométrico ele
   *  vai na mesma altura do poste, projetado como o resto. */
  drawCaboDoBondinho(ctx, cx, cy, iso) {
    const est = DB.BONDINHO?.estacoes.find((e) => e.mapa === this.st.player.map);
    if (!est || !this.geo) return;
    const ALTO = 18;                                     // o alto do poste, acima do tile
    const px = est.x * TILE + 4, py = est.y * TILE;      // o pé do poste, no mapa
    const ex = px + 24, ey = est.cabo === "down" ? this.geo.h * TILE + TILE : -TILE;
    let a, b;
    if (iso) {
      const z0 = this.zIso(est.x, est.y);
      const pa = naTela(iso, px, py + TILE / 2), pb = naTela(iso, ex, ey);
      a = { x: pa.x, y: pa.y - z0 - ALTO - ISO_PE }; b = { x: pb.x, y: pb.y - z0 - ALTO - ISO_PE };
    } else {
      a = { x: px - cx, y: py - cy - ALTO }; b = { x: ex - cx, y: ey - cy - ALTO };
    }
    ctx.strokeStyle = "#2a2d33";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(Math.round(a.x) + 0.5, Math.round(a.y) + 0.5); ctx.lineTo(Math.round(b.x) + 0.5, Math.round(b.y) + 0.5); ctx.stroke();
  }

  andarDeBondinho(dt) {
    const v = this.viagemBondinho;
    v.t += dt;
    if (v.t < v.total) return;
    const st = this.st, B = DB.BONDINHO;
    Object.assign(st.player, { map: v.para.mapa, x: v.para.chegada.x, y: v.para.chegada.y, dir: "down" });
    st.surfando = null;
    this.compa = null;
    this.selvagens = [];
    this.justWarped = true;
    this.viagemBondinho = null;
    this.afterTravel();
    this.game.autosave?.(true);
    Audio2.heal();
    this.dlg.say(B.chegou.replace("{LA}", v.para.nome));
  }

  /** A VIAGEM: céu, mar mexendo embaixo, a cidade de onde se saiu ficando pra
   *  trás, o cabo com a curva do peso, e a cabine indo por ele, balançando. */
  drawBondinho(ctx) {
    if (isoLigado()) return this.drawBondinhoIso(ctx);
    const v = this.viagemBondinho, B = DB.BONDINHO;
    const k = Math.min(1, v.t / v.total);
    const p = k * k * (3 - 2 * k);                       // sai devagar, chega devagar
    const agora = performance.now() / 1000;
    // o céu
    const ceu = ctx.createLinearGradient(0, 0, 0, H);
    ceu.addColorStop(0, "#6fb9ec"); ceu.addColorStop(1, "#d6f1ff");
    ctx.fillStyle = ceu; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#fff4b0";
    ctx.beginPath(); ctx.arc(196, 26, 10, 0, Math.PI * 2); ctx.fill();
    // as margens: os prédios de CARVORIÚ numa ponta, a praia baixa do LARVANJAL
    // na outra (a de Carvoriú fica à esquerda na ida e à direita na volta)
    const margem = (x0, larg, predios) => {
      ctx.fillStyle = "#e8d49a"; ctx.fillRect(x0, 104, larg, 10);
      if (!predios) {
        ctx.fillStyle = "#4f9a4a";
        for (let i = 0; i < larg; i += 9) ctx.fillRect(x0 + i, 96 + ((i * 7) % 5), 7, 9);
        return;
      }
      for (let i = 0; i < larg; i += 11) {
        const alto = 34 + ((i * 37) % 30);
        ctx.fillStyle = (i / 11) % 2 ? "#8c96a8" : "#a9b3c4";
        ctx.fillRect(x0 + i, 104 - alto, 10, alto);
        ctx.fillStyle = "#e6f4ff";
        for (let j = 6; j < alto - 4; j += 6) ctx.fillRect(x0 + i + 2, 104 - alto + j, 2, 2), ctx.fillRect(x0 + i + 6, 104 - alto + j, 2, 2);
      }
    };
    margem(0, 44, v.ida);
    margem(W - 44, 44, !v.ida);
    // o mar, com as ondas correndo
    ctx.fillStyle = "#2b7fc2"; ctx.fillRect(0, 112, W, H - 112);
    ctx.fillStyle = "#63aee6";
    for (let y = 118; y < H; y += 8) {
      for (let x = -16; x < W; x += 24) {
        const dx = ((agora * 12 + y * 3) % 24);
        ctx.fillRect(Math.round(x + dx), y, 8, 1);
      }
    }
    // o cabo: de torre a torre, com a barriga do peso
    const A = { x: 30, y: 44 }, Z = { x: W - 30, y: 34 }, C = { x: W / 2, y: 62 };
    const ponto = (u) => ({
      x: (1 - u) * (1 - u) * A.x + 2 * (1 - u) * u * C.x + u * u * Z.x,
      y: (1 - u) * (1 - u) * A.y + 2 * (1 - u) * u * C.y + u * u * Z.y,
    });
    ctx.fillStyle = "#4a4f59";
    ctx.fillRect(A.x - 2, A.y, 4, 104 - A.y);
    ctx.fillRect(Z.x - 2, Z.y, 4, 104 - Z.y);
    ctx.strokeStyle = "#2a2d33"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.quadraticCurveTo(C.x, C.y, Z.x, Z.y); ctx.stroke();
    // a cabine
    const c = ponto(v.ida ? p : 1 - p);
    const bal = Math.sin(agora * 2.4) * 2 * Math.sin(Math.PI * p);
    const cx = Math.round(c.x + bal), cy = Math.round(c.y);
    ctx.fillStyle = "#2a2d33";
    ctx.fillRect(cx - 3, cy - 2, 6, 3);                   // as rodinhas no cabo
    ctx.fillRect(Math.round(c.x), cy, 1, 8);              // o braço
    ctx.fillStyle = "#d8322e"; ctx.fillRect(cx - 19, cy + 8, 38, 26);
    ctx.fillStyle = "#8f1f1c"; ctx.fillRect(cx - 19, cy + 32, 38, 2);
    // AS DUAS JANELAS: você numa, e o Pokémon que te segue na outra. Você vai
    // na da frente (a do lado pra onde a cabine anda); ele, atrás de você.
    const frente = v.ida ? cx + 2 : cx - 16, tras = v.ida ? cx - 16 : cx + 2;
    const janela = (jx, desenhar) => {
      ctx.fillStyle = "#bfe6ff";
      ctx.fillRect(jx, cy + 11, 14, 14);
      ctx.save();
      ctx.beginPath(); ctx.rect(jx, cy + 11, 14, 14); ctx.clip();
      desenhar(jx, cy + 11);
      ctx.restore();
      ctx.fillStyle = "rgba(255,255,255,.35)";          // o reflexo do vidro
      ctx.fillRect(jx + 1, cy + 12, 3, 1);
    };
    janela(frente, (jx, jy) => {
      const sets = Assets.actor("hero");
      const img = (v.ida ? sets?.right || sets?.down : sets?.left || sets?.down)?.[0] || sets?.down?.[0];
      // o quadro do herói tem 32 de altura e o boneco ocupa só os ~20 de baixo:
      // encostar o topo do quadro na janela mostrava o vazio em cima da cabeça
      if (img) ctx.drawImage(img, jx + ((14 - img.width) >> 1), jy + 1 - Math.max(0, img.height - 20));
    });
    const mon = this.quemSegue();
    if (mon) {
      janela(tras, (jx, jy) => {
        // o desenho de frente olha pra esquerda: na ida (pra direita) ele vira
        const base = Assets.mon(mon.species, mon.seed);
        const img = base && (v.ida ? espelhar(base) : base);
        if (img) ctx.drawImage(reduzido(img, 20), jx - 3, jy - 1 + Math.round(Math.sin(agora * 5) * 0.8), 20, 20);
      });
    } else {
      ctx.fillStyle = "#bfe6ff"; ctx.fillRect(tras, cy + 11, 14, 14);
    }
    const rotulo = B.ceu.replace("{LA}", v.para.nome);
    panel(ctx, 4, 4, rotulo.length * 6 + 12, 18);
    drawText(ctx, rotulo, 9, 9, PAL.ink);
  }

  /** A VIAGEM NO ISOMÉTRICO: a mesma travessia, vista de quina como o resto
   *  do mundo. A cena é uma faixa comprida no eixo x do "mapa" (CARVORIÚ no
   *  começo, a PRAIA DO LARVANJAL no fim), com o mar deitado em losango, os
   *  prédios e as árvores em blocos, as duas torres, o cabo com a barriga do
   *  peso e a cabine em caixa — você e o seu Pokémon nas janelas da face sul. */
  drawBondinhoIso(ctx) {
    const v = this.viagemBondinho, B = DB.BONDINHO;
    const k = Math.min(1, v.t / v.total);
    const p = k * k * (3 - 2 * k);
    const agora = performance.now() / 1000;
    const L = 280, D = 64, S = 0.68;                     // comprimento, largura, escala
    const TA = 44, TB = L - 44, ALTO = 62, BARRIGA = 14; // as torres e o cabo
    const o = { x: W / 2 - ((L / 2 - D / 2) * S), y: H / 2 - ((L / 2 + D / 2) / 2) * S + 26 };
    const P = (x, y, z = 0) => ({ x: o.x + (x - y) * S, y: o.y + ((x + y) / 2 - z) * S });
    const quad = (pts, cor) => {
      ctx.fillStyle = cor;
      ctx.beginPath();
      pts.forEach((q, i) => (i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y)));
      ctx.closePath(); ctx.fill();
    };
    // uma caixa: tampo, face sul (y1, desce pra esquerda) e face leste (x1)
    const caixa = (x0, x1, y0, y1, z0, z1, topo, sul, leste) => {
      quad([P(x0, y1, z1), P(x1, y1, z1), P(x1, y1, z0), P(x0, y1, z0)], sul);
      quad([P(x1, y0, z1), P(x1, y1, z1), P(x1, y1, z0), P(x1, y0, z0)], leste);
      quad([P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)], topo);
    };
    // o céu
    const ceu = ctx.createLinearGradient(0, 0, 0, H);
    ceu.addColorStop(0, "#6fb9ec"); ceu.addColorStop(1, "#d6f1ff");
    ctx.fillStyle = ceu; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#fff4b0";
    ctx.beginPath(); ctx.arc(212, 22, 9, 0, Math.PI * 2); ctx.fill();
    // o mar, deitado, com as ondas correndo ao longo dele
    quad([P(-40, -40), P(L + 40, -40), P(L + 40, D + 40), P(-40, D + 40)], "#2b7fc2");
    ctx.fillStyle = "#63aee6";
    for (let i = 0; i < 26; i++) {
      const wx = ((i * 53 + agora * 14) % (L + 60)) - 30, wy = (i * 37) % (D + 60) - 30;
      const a = P(wx, wy), b = P(wx + 10, wy);
      ctx.fillRect(Math.round(a.x), Math.round(a.y), Math.max(1, Math.round(b.x - a.x)), 1);
    }
    // CARVORIÚ: a areia e a parede de prédios (do fundo pra frente)
    caixa(-40, 30, -40, D + 40, 0, 4, "#e8d49a", "#c9b27a", "#b39c66");
    const predios = [[-36, -14, -36, -6, 70], [-36, -14, 0, 22, 54], [-10, 12, -36, -6, 58],
                     [-36, -14, 28, 50, 80], [-10, 12, 0, 22, 44], [-10, 12, 28, 50, 64]];
    for (const [x0, x1, y0, y1, alt] of predios) {
      caixa(x0, x1, y0, y1, 4, alt, "#c5cedb", "#a9b3c4", "#8c96a8");
      // as janelas da face sul
      ctx.fillStyle = "#e6f4ff";
      for (let z = 12; z < alt - 6; z += 9) {
        for (let x = x0 + 3; x < x1 - 3; x += 7) {
          const q = P(x, y1, z);
          ctx.fillRect(Math.round(q.x), Math.round(q.y), 2, 2);
        }
      }
    }
    // O LARVANJAL: praia baixa e as árvores do mato
    caixa(L - 30, L + 40, -40, D + 40, 0, 4, "#e8d49a", "#c9b27a", "#b39c66");
    for (const [x, y] of [[L - 20, -20], [L - 4, 4], [L + 14, -10], [L - 18, 30], [L + 6, 44], [L + 22, 20]]) {
      caixa(x, x + 2, y, y + 2, 4, 14, "#6b4a2a", "#5a3d22", "#4a3019");
      caixa(x - 6, x + 8, y - 6, y + 8, 14, 26, "#5fb35a", "#4f9a4a", "#3f8039");
    }
    // as torres
    const torre = (x) => caixa(x - 2, x + 2, D / 2 - 2, D / 2 + 2, 4, ALTO, "#6a707c", "#5a5f6a", "#4a4f59");
    torre(TA);
    // o cabo: da torre A à B, no meio da faixa, com a barriga do peso
    const cabo = (u) => ({ x: TA + (TB - TA) * u, z: ALTO - BARRIGA * Math.sin(Math.PI * u) });
    ctx.strokeStyle = "#2a2d33"; ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= 24; i++) {
      const c = cabo(i / 24), q = P(c.x, D / 2, c.z);
      i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y);
    }
    ctx.stroke();
    // a cabine, pendurada no cabo e balançando pra frente e pra trás
    const c = cabo(v.ida ? p : 1 - p);
    const bal = Math.sin(agora * 2.4) * 2 * Math.sin(Math.PI * p);
    const cx = c.x + bal, zc = c.z;
    const braco = [P(c.x, D / 2, zc), P(cx, D / 2, zc - 8)];
    ctx.beginPath(); ctx.moveTo(braco[0].x, braco[0].y); ctx.lineTo(braco[1].x, braco[1].y); ctx.stroke();
    const x0 = cx - 13, x1 = cx + 13, y0 = D / 2 - 8, y1 = D / 2 + 8, z1 = zc - 8, z0 = z1 - 24;
    caixa(x0, x1, y0, y1, z0, z1, "#b82a26", "#d8322e", "#a8241f");
    quad([P(x0, y1, z0 + 2), P(x1, y1, z0 + 2), P(x1, y1, z0), P(x0, y1, z0)], "#8f1f1c");
    // AS JANELAS na face sul: você na da frente, o Pokémon na de trás
    const janela = (jx0, desenhar) => {
      const pts = [P(jx0, y1, z1 - 4), P(jx0 + 10, y1, z1 - 4), P(jx0 + 10, y1, z1 - 18), P(jx0, y1, z1 - 18)];
      quad(pts, "#bfe6ff");
      ctx.save();
      ctx.beginPath();
      pts.forEach((q, i) => (i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y)));
      ctx.closePath(); ctx.clip();
      const meio = P(jx0 + 5, y1, z1 - 11);
      desenhar(Math.round(meio.x), Math.round(meio.y));
      ctx.restore();
    };
    const frente = v.ida ? x1 - 12 : x0 + 2, tras = v.ida ? x0 + 2 : x1 - 12;
    // quem anda pra +x no isométrico olha ↘, e na volta ↖ — a mesma regra dos
    // bonecos do mapa (`vistaIso` em src/core/isometrico.js)
    const vista = vistaIso(v.ida ? "right" : "left");
    janela(frente, (mx, my) => {
      const sets = Assets.actor("hero");
      const quadro = (vista.costas ? sets?.up : sets?.down)?.[0] || sets?.down?.[0];
      const img = quadro && (vista.espelha ? espelhar(quadro) : quadro);
      if (img) ctx.drawImage(img, mx - (img.width >> 1), my - 6 - Math.max(0, img.height - 20));
    });
    const mon = this.quemSegue();
    if (mon) {
      janela(tras, (mx, my) => {
        const base = vista.costas ? Assets.monBack(mon.species, mon.seed) : Assets.mon(mon.species, mon.seed);
        const img = base && (vista.espelha ? espelhar(base) : base);
        if (img) ctx.drawImage(reduzido(img, 18), mx - 9, my - 9 + Math.round(Math.sin(agora * 5) * 0.8), 18, 18);
      });
    } else janela(tras, () => {});
    // a torre B por último: ela fica na frente da cabine quando a cabine chega
    torre(TB);
    const rotulo = B.ceu.replace("{LA}", v.para.nome);
    panel(ctx, 4, 4, rotulo.length * 6 + 12, 18);
    drawText(ctx, rotulo, 9, 9, PAL.ink);
  }

  /** Onde está a cabeça de um NPC na tela agora (o BALÃO de fala sai dali):
   *  no meio do tile dele, uns pixels acima do topo do boneco. */
  cabecaNaTela(n) {
    const ax = n.fx ?? n.x, ay = n.fy ?? n.y;
    if (this._iso) {
      const p = naTela(this._iso, ax * TILE + TILE / 2, ay * TILE + TILE / 2);
      return { x: p.x, y: p.y - ISO_PE - this.zIso(ax, ay) - 22 };
    }
    return { x: ax * TILE - Math.round(this.cam.x) + TILE / 2, y: ay * TILE - Math.round(this.cam.y) - 8 };
  }

  /** O GUIA DO VOID (src/data/void.js): a canalizadora quer luz no preto do
   *  mapa. Com um Pokémon de FOGO na equipe, ela dá o guia — uma vez. */
  falarGuiaDoVoid(state) {
    const G = DB.GUIA_VOID;
    const fogo = this.st.party.find((m) => !m.eu && (m.types || DB.SPECIES[m.species]?.types || []).includes("FOGO"));
    if (state.deuGuia) {
      return void this.dlg.say(fogo ? G.depois.replace("{MON}", fogo.nickname) : G.depoisSemNome);
    }
    this.dlg.say(G.pede, () => {
      if (!fogo) return void this.dlg.say(G.semFogo);
      this.dlg.say(G.comFogo.map((l) => l.replace("{MON}", fogo.nickname)), () => {
        state.deuGuia = true;
        this.st.items[G.item] = 1;
        Audio2.heal();
        this.game.autosave?.(true);
        this.dlg.say(G.ganhou);
      });
    });
  }

  /** A POKÉDEX sai da mão do professor (src/data/pokedex.js). */
  darPokedex(depois) {
    const P = DB.POKEDEX_TEXTO;
    this.st.flags.pokedex = true;
    this.dlg.say(P.entrega, () => {
      Audio2.heal();
      this.game.autosave?.(true);
      this.dlg.say([P.ganhou, ...P.explica], () => depois?.());
    });
  }

  // ---------------------------------------------------------------- menu
  // ------------------------------------------------------------ ANIVERSÁRIO
  // A data é perguntada uma vez (pela mãe, em casa) e fica no save; no dia, um
  // pacote chega onde você estiver e você escolhe o TIPO e a FORMA do presente.
  // As regras estão em src/systems/aniversario.js — aqui só tem tela e fala.

  /** A mãe perguntando. Se você mandar ela deixar pra depois, ela deixa pra
   *  sempre: a data continua editável nas OPÇÕES, e mãe que repete a mesma
   *  pergunta toda vez que você entra em casa vira um formulário. */
  perguntarAniversario(npc, state) {
    const A = DB.ANIVERSARIO_TEXTO;
    this.dlg.say(A.pergunta, () => {
      this.dlg.ask(A.seletor, A.opcoesPergunta, (i) => {
        if (i === 0) return this.abrirDataAniversario("mae");
        state.perguntou = true;
        this.dlg.say(A.depois);
      });
    });
  }

  /** O seletor de data. `volta` diz pra onde ir quando ele fechar: a mãe está
   *  esperando uma resposta, as OPÇÕES querem o cursor de volta na linha certa. */
  abrirDataAniversario(volta = null) {
    const hoje = new Date();
    const p = Aniv.partes(Aniv.definido(this.st))
      || { mes: hoje.getMonth() + 1, dia: hoje.getDate() };
    this.menu = { type: "aniversarioData", mes: p.mes, dia: p.dia, campo: 0, volta };
  }

  /** Tem pacote esperando? É chamado ao entrar no mundo e a cada mapa novo —
   *  quem virou o dia jogando não precisa fechar o jogo pra ganhar. */
  checarAniversario() {
    if (this.menu || this.dlg.active) return;
    const p = Aniv.pendente(this.st);
    if (!p || !Aniv.tipos().length) return;
    const A = DB.ANIVERSARIO_TEXTO;
    Audio2.heal();
    this.dlg.say(p.dias > 0 ? A.atrasado : A.chegou, () => {
      this.dlg.say(A.escolhaTipo, () => {
        this.menu = { type: "aniversarioTipo", lista: Aniv.tipos(), index: 0 };
      });
    });
  }

  /** Escolhido o tipo, falta a forma: a COR ou o GOLPE. Uma ou outra. */
  formaDoPresente(tipo) {
    const A = DB.ANIVERSARIO_TEXTO;
    this.menu = null;
    this.dlg.ask(A.comoQuer, A.opcoesForma,
                 (i) => this.entregarPresente(tipo, i === 0 ? "shiny" : "golpe"));
  }

  /** A bola abre. Sem vaga na equipe nem na BOX o presente NÃO é entregue e o
   *  ano não é marcado: ele continua esperando você arrumar espaço, dentro da
   *  janela. Um presente que evapora porque a BOX estava cheia é um presente
   *  perdido por um ano. */
  entregarPresente(tipo, forma) {
    const A = DB.ANIVERSARIO_TEXTO;
    const pend = Aniv.pendente(this.st);
    if (!pend) return;
    const feito = Aniv.montarPresente(this.st, tipo, forma);
    if (!feito) return void this.dlg.say(A.semVaga);
    const { mon, golpe } = feito;

    const falas = [A.abriu, A.recebeu.replace("{MON}", mon.nickname).replace("{TIPO}", tipo)];
    if (forma === "shiny") falas.push(A.veioShiny.replace("{MON}", mon.nickname));
    else if (golpe) {
      falas.push(A.veioGolpe.replace("{GOLPE}", DB.MOVES[golpe]?.name || golpe)
                            .replace("{NIVEL}", mon.level));
    }
    if (this.st.party.length < 6) this.st.party.push(mon);
    else if (!boxCheio(this.st)) {
      guardarNoBox(this.st, mon);
      falas.push(A.foiProBox.replace("{MON}", mon.nickname));
    } else return void this.dlg.say(A.semVaga);

    falas.push(A.proximo);
    Aniv.marcarGanho(this.st, pend.ano);
    Audio2.heal();
    this.game.save?.();          // presente é gravado na hora, sem trava de tempo
    this.dlg.say(falas);
  }

  /** O que a linha ANIVERSÁRIO mostra nas OPÇÕES. */
  resumoAniversario() {
    const A = DB.ANIVERSARIO_TEXTO;
    const data = Aniv.definido(this.st);
    return data ? Aniv.formata(data) : A.naoDefinido;
  }

  /** A linha de baixo das OPÇÕES, quando o cursor está no aniversário: quanto
   *  falta, ou que o deste ano já foi entregue. */
  dicaAniversario() {
    const A = DB.ANIVERSARIO_TEXTO;
    const data = Aniv.definido(this.st);
    if (!data) return A.seletorAjuda;
    if (Aniv.pendente(this.st)) return A.hoje;
    const dias = Aniv.faltam(data);
    if (dias === 0) return A.jaGanhou;
    if (dias === 1) return A.amanha;
    return A.faltam.replace("{DIAS}", dias);
  }

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
    // a POKÉDEX vem do professor, logo depois do inicial (src/data/pokedex.js)
    if (temPokedex(this.st)) base.unshift("POKÉDEX");
    // ACAMPAR só aparece quando dá: com barraca na mochila e chão de fora. Menu
    // que oferece o que não funciona é menu que mente.
    if (podeAcampar(this.st, this.map).ok) base.push("ACAMPAR");
    if (this.geo?.braglitch && DB.MAPA_REGIAO) base.push("MAPA");   // o mapa do Brasil (Braglitch)
    if (diario(this.st).length) base.push(DB.MISSAO_TEXTO.titulo);   // só depois do primeiro pedido
    base.push(DB.STORY.fusao.atualizar);   // baixa as fusões publicadas no mundo
    // VOAR LIVRE é do pokésave de VOADOR: levanta e fica no ar até pousar. Pra
    // quem tem um Pokémon que sabe VOAR, continua sendo a lista de cidades.
    if (this.st.capturado) base.push(this.st.capturado.naBola ? "SAIR DA BOLA" : "FICAR NA BOLA");
    if (this.st.voando) base.push("POUSAR");
    else if (euSei(this.st, "voar") && !this.st.capturado?.naBola) base.push("LEVANTAR VOO");
    else if (this.quemSabe("voar")) base.push("VOAR");
    if (DB.ONLINE?.ativo) base.push("ONLINE");
    return [...base, "SALVAR", "OPÇÕES", "SAIR"];
  }

  /** O que esta loja mostra AGORA: item com `requer` só entra depois da flag,
   *  item com `insignias` só entra depois de tantas insígnias, e item `unico`
   *  sai da prateleira depois de comprado. Vender o que o jogador ainda não
   *  pode usar é vender problema; vender de novo o que não gasta é vender a
   *  mesma coisa duas vezes.
   *
   *  `insignias` existe pelas BOLAS (src/data/bolas.js): a GREAT BALL e a ULTRA
   *  BALL na primeira loja do jogo transformariam a captura inteira num
   *  problema de dinheiro. Flag não servia — o que segura elas não é uma cena
   *  que aconteceu, é quanto de estrada você já tem nas costas. */
  prateleira(shop) {
    return (shop || [])
      .filter((x) => !x.requer || this.st.flags?.[x.requer])
      .filter((x) => !x.insignias || (this.st.badges || []).length >= x.insignias)
      .filter((x) => !x.unico || !(this.st.items?.[x.item] > 0));
  }

  /** FICAR NA BOLA: você entra, e o dono te carrega. Ele anda sozinho pelo
   *  mapa caçando bicho (é o que ele faz), você descansa lá dentro (a vida
   *  volta devagar) e vê tudo por um vidro vermelho. Ninguém te encosta. */
  entrarNaBola() {
    const cap = this.st.capturado;
    if (!cap || cap.naBola) return;
    cap.naBola = true;
    this.st.voando = false; this.st.surfando = null;
    this.compa = null;
    Audio2.tone(660, 0.06); Audio2.tone(440, 0.1);
    this.dlg.say([`VOCÊ ENTROU NA BOLA. ${cap.nome} PRENDEU ELA NO CINTO.`, "LÁ DENTRO É VERMELHO, E TUDO BALANÇA."]);
    this.game.autosave?.();
  }

  sairDaBola() {
    const cap = this.st.capturado;
    if (!cap?.naBola) return;
    // só sai em chão em que dá pra ficar de pé (ele te solta ao lado)
    const p = this.st.player;
    const t = this.tagAt(p.x, p.y);
    if (!(t === DB.TAG.FREE || t === DB.TAG.GRASS)) return void this.dlg.say("AQUI NÃO DÁ PRA SAIR.");
    cap.naBola = false;
    this.compa = null;
    Audio2.tone(440, 0.06); Audio2.tone(660, 0.1);
    this.dlg.say(`${cap.nome} ABRIU A BOLA. VOCÊ SAIU.`);
    this.game.autosave?.();
  }

  /** quanto dura um passo do dono (o mesmo do seu andar) */
  passoDoDono() { return passo(WALK); }

  /** O dono andando com você no cinto: ele vai atrás do selvagem mais perto,
   *  pega, e segue pro próximo. Quando não tem nenhum, fica parado esperando
   *  nascer. Você descansa. */
  andarDentroDaBola(dt) {
    const eu = quemSou(this.st);
    if (eu && eu.hp < eu.maxHp) eu.hp = Math.min(eu.maxHp, eu.hp + eu.maxHp * 0.02 * dt);
    // chegou no Centro com você fraco: a cura
    if (!this.move && curarNoCentro(this.st)) {
      Audio2.heal();
      return void this.dlg.say(`${this.st.capturado.nome} PEDIU PRA SRTA. JOY CUIDAR DE TODO MUNDO. VOCÊ ESTÁ CURADO.`);
    }
    // entrou no ginásio da vez: o desafio (você ouve de dentro da bola)
    const desafio = !this.move && desafiarGinasio(this.st);
    if (desafio) {
      Audio2.tone(988, 0.07); Audio2.tone(1319, 0.12);
      this.game.autosave?.();
      return void this.dlg.say(desafio, () => Audio2.heal());
    }
    const pego = andarNaBola(this.st, this, dt, this.selvagens);
    if (pego) {
      // ele te manda pra briga: é uma batalha selvagem, você na frente e ele
      // dando as ordens — e é ele quem joga a bola quando o bicho fraqueja
      const eu = quemSou(this.st);
      if (eu && eu.hp > 0 && !this.fx) {
        return this.encontrarSelvagem(pego);
      }
      // sem você de pé, ele pega no braço, como antes
      this.selvagens = this.selvagens.filter((o) => o !== pego);
      Audio2.tone(880, 0.06); Audio2.tone(1175, 0.1);
      cacadorPegou(this.st, pego);
    }
    this.snapCamera();
  }

  /** VOAR LIVRE (pokésave de VOADOR): sobe e fica no ar. */
  levantarVoo() {
    if (this.map.interior) return void this.dlg.say("AQUI DENTRO NÃO DÁ PRA LEVANTAR VOO.");
    this.st.voando = true;
    this.st.surfando = null;
    Audio2.tone(523, 0.06); Audio2.tone(784, 0.1);
    this.selvagens = [];
    this.game.autosave?.();
  }

  /** ...e desce. Só em chão em que dá pra ficar de pé — ou na água, se você
   *  também nada (aí pousa nadando). Em cima de árvore, casa ou gente, não. */
  pousar() {
    const p = this.st.player;
    const t = this.tagAt(p.x, p.y);
    const ocupado = this.npcAt(p.x, p.y) || this.obstaculoEm(p.x, p.y) || this.warpAt(p.x, p.y);
    if (t === DB.TAG.WATER && !ocupado && this.quemSabe("surfar")) {
      this.st.voando = false;
      this.st.surfando = this.quemSabe("surfar").species;
    } else if ((t === DB.TAG.FREE || t === DB.TAG.GRASS) && !ocupado) {
      this.st.voando = false;
    } else {
      return void this.dlg.say("NÃO DÁ PRA POUSAR AQUI.");
    }
    Audio2.tone(784, 0.06); Audio2.tone(523, 0.1);
    this.justWarped = true;                 // pousar em cima de porta não entra nela
    this.game.autosave?.();
  }

  /** VENDER: a lista do que a mochila tem e o balcão compra. */
  abrirVenda() {
    const lista = vendaveis(this.st);
    if (!lista.length) return void this.dlg.say(VENDA_TEXTO.nadaPraVender);
    this.menu = { type: "venda", index: 0, lista };
  }

  sell(item, price, n) {
    const total = price * n;
    this.st.money = Math.min(Number.MAX_SAFE_INTEGER * 1e6, (this.st.money || 0) + total);
    this.st.items[item] = (this.st.items[item] || 0) - n;
    if (this.st.items[item] <= 0) delete this.st.items[item];
    Audio2.heal();
    const lista = vendaveis(this.st);
    this.menu = lista.length ? { type: "venda", index: 0, lista } : null;
    const msg = VENDA_TEXTO.vendeu.replace("{N}", n).replace("{ITEM}", item.toUpperCase()).replace("{TOTAL}", moeda(total));
    this.dlg.say(item === "troféu de pallet" ? [VENDA_TEXTO.trofeu, msg] : msg);
    this.game.autosave?.(true);
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

  // ------------------------------------------------------------ SOLTAR
  // src/systems/soltos.js e a cutscene em src/scenes/soltar.js.

  /** A na equipe: TRUNFO (o que já era) ou SOLTAR */
  acoesDaEquipe(i) {
    const mon = this.st.party[i];
    this.dlg.ask(`O QUE FAZER COM ${mon.nickname}?`, ["TRUNFO", "SOLTAR", "NADA"], (k) => {
      if (k === 0) return this.escolherTrunfo(mon);
      if (k === 1) return this.pedirSoltar(this.st.party, i);
    });
  }

  /** A no PC: mover (o que já era) ou SOLTAR */
  acoesDoBox(m, lista) {
    const mon = lista[m.index];
    if (!mon) return;
    const mover = m.lado === "box" ? "PÔR NA EQUIPE" : "GUARDAR";
    this.dlg.ask(`O QUE FAZER COM ${mon.nickname}?`, [mover, "SOLTAR", "NADA"], (k) => {
      if (k === 0) return this.moverBox(m, lista);
      if (k === 1) return this.pedirSoltar(lista, m.index, m);
    });
  }

  pedirSoltar(lista, i, m = null) {
    const mon = lista[i];
    const daEquipe = lista === this.st.party;
    if (daEquipe && this.st.party.length <= 1) { Audio2.cancel(); return void this.dlg.say("ELE É O ÚNICO DA EQUIPE. NÃO DÁ PRA SOLTAR."); }
    if (daEquipe && mon.hp > 0 && this.st.party.filter((p) => p.hp > 0).length <= 1) {
      Audio2.cancel();
      return void this.dlg.say("ELE É O ÚNICO QUE AINDA AGUENTA LUTAR. NÃO DÁ PRA SOLTAR AGORA.");
    }
    const lugar = lugarDoSolto(this.st, this.st.player.map);
    const nomeLugar = DB.MAPS[lugar]?.name || lugar.toUpperCase();
    this.dlg.ask(`SOLTAR ${mon.nickname}? ELE VAI MORAR NO MATO DE ${nomeLugar}.`, ["SOLTAR", "NÃO"], (k) => {
      if (k !== 0) return;
      lista.splice(i, 1);
      const caiu = soltar(this.st, mon, lugar);
      if (m) { m.index = Math.max(0, Math.min(m.index, lista.length - 1)); m.top = Math.min(m.top, m.index); }
      this.menu = null;
      this.game.autosave?.(true);
      const frase = [`TCHAU, ${mon.nickname}!`, `ELE FOI PRO MATO DE ${nomeLugar}. QUEM SABE VOCÊS SE ENCONTRAM DE NOVO.`];
      if (caiu) frase.push(`(${caiu.mon.nickname}, O MAIS ANTIGO DOS SOLTOS, FOI EMBORA PRA SEMPRE.)`);
      this.game.scenes.push(new SoltarScene(), { mon, frase, aoFim: () => this.game.music(this.map.music) });
    });
  }

  /** usa até 999 de uma vez */
  useItem(item, mon, qty) {
    this.menu = null;
    const have = this.st.items[item] || 0;
    const n = Math.max(1, Math.min(qty, have));
    if (DB.EVO_ITEMS?.[item]) return this.useEvoItem(item, mon);
    if (item === DB.CUIA?.item) return this.usarCuia(mon);
    if (DB.COGUMELOS?.itens?.[item]) return this.darCogumelo(item, mon);
    if (item === DB.GUARDA_ROUPA?.item) return this.usarGuardaRoupa(mon);
    if (item === DB.CATALOGO_ROTOM?.item) return this.usarCatalogo(mon);
    if (item === DB.CUBO_ZYGARDE?.item) return this.usarCubo(mon);
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

  /** O GUARDA-ROUPA ÚNICO (src/data/guarda-roupa.js): as roupas da espécie
   *  dele — a normal e as FORMAS ÚNICAS do UNIQUEMON — e ele veste a escolhida.
   *  Não se gasta. */
  usarGuardaRoupa(mon) {
    const G = DB.GUARDA_ROUPA, base = baseDe(mon.species);
    const nomeBase = DB.SPECIES[base]?.name || base;
    const f = (t, roupa = "") => t.replace("{MON}", mon.nickname).replace("{NOME}", nomeBase).replace("{ROUPA}", roupa);
    const roupas = roupasDe(mon);
    if (roupas.length <= 1) { Audio2.cancel(); return void this.dlg.say(f(G.semRoupa)); }
    const nomes = roupas.map((id) => (id === base ? f(G.normal) : DB.SPECIES[id].name));
    this.dlg.ask(f(G.pergunta), [...nomes, "VOLTAR"], (i) => {
      const id = roupas[i];
      if (!id) return;
      if (id === mon.species) { Audio2.cancel(); return void this.dlg.say(f(G.jaEsta)); }
      const de = mon.species;
      vestir(mon, id);
      this.st.seen[id] = true;
      this.game.autosave?.(true);
      // a cutscene do guarda-roupa (src/scenes/vestir.js), com a frase no fim
      this.game.scenes.push(new VestirScene(), {
        mon, de, para: id, frase: id === base ? f(G.tirou) : f(G.vestiu, DB.SPECIES[id].name),
        aoFim: () => this.game.music(this.map.music),
      });
    });
  }

  /** OS COGUMELOS do PARASECT (src/data/secretas.js): ele come, e o cogumelo
   *  decide a cor do PARASECTROM quando vier o choque nas SEVII. */
  darCogumelo(item, mon) {
    const C = DB.COGUMELOS, f = (t) => t.replace("{MON}", mon.nickname);
    if (mon.species !== C.especie) { Audio2.cancel(); return void this.dlg.say(f(C.naoQuer)); }
    if (mon.comeu === item) { Audio2.cancel(); return void this.dlg.say(f(C.jaComeu)); }
    mon.comeu = item;
    this.spend(item, 1);
    Audio2.heal();
    this.game.autosave?.(true);
    this.dlg.say(f(C.itens[item].comeu));
  }

  /** A CUIA TÉRMICA: o VICTREEBEL de Braglitch troca de CHIMARRÃO pra TERERÊ
   *  e de volta. É troca de forma, não evolução: mesmo nível, mesmos golpes,
   *  só o tipo e os números mudam. A cuia não se gasta. */
  usarCuia(mon) {
    const C = DB.CUIA;
    const nova = C.troca[mon.species];
    if (!nova || !DB.SPECIES[nova]) {
      Audio2.cancel();
      return void this.dlg.say(C.nada.replace("{MON}", mon.nickname));
    }
    const nomeVelho = DB.SPECIES[mon.species].name;
    const hpAntes = mon.maxHp ? mon.hp / mon.maxHp : 1;
    mon.species = nova;
    if (mon.nickname === nomeVelho) mon.nickname = DB.SPECIES[nova].name;   // apelido não se mexe
    recalc(mon);
    mon.hp = Math.max(mon.hp > 0 ? 1 : 0, Math.round(mon.maxHp * hpAntes));
    this.st.seen[nova] = true;
    this.st.caught[nova] = true;
    Audio2.heal();
    this.game.autosave?.(true);
    this.dlg.say(C.virou[nova].replace("{MON}", mon.nickname));
  }

  /** O CATÁLOGO ROTOM (src/data/rotom.js): o ROTOM escolhe um aparelho e vira
   *  aquela forma, ou volta ao normal. Mesmo nível, mesmos golpes; o catálogo
   *  não se gasta. */
  usarCatalogo(mon) {
    const C = DB.CATALOGO_ROTOM;
    if (!C.aceita.includes(mon.species)) {
      Audio2.cancel();
      return void this.dlg.say(C.nada.replace("{MON}", mon.nickname));
    }
    // a forma "normal" é a de onde ele veio: ROTOM ou ROTOM-BRAG (fica no mon)
    const base = C.bases.includes(mon.species) ? mon.species : (mon.rotomBase || "rotom");
    const opcoes = C.opcoes.filter(([id]) => DB.SPECIES[id])
      .map(([id, nome]) => (id === "rotom" ? [base, `${DB.SPECIES[base].name} NORMAL`] : [id, nome]));
    this.dlg.ask(C.pergunta.replace("{MON}", mon.nickname), [...opcoes.map(([, nome]) => nome), "VOLTAR"], (i) => {
      const escolha = opcoes[i];
      if (!escolha) return;
      const [nova, nome] = escolha;
      if (nova === mon.species) return void this.dlg.say(C.jaE.replace("{MON}", mon.nickname));
      const nomeVelho = DB.SPECIES[mon.species].name;
      const hpAntes = mon.maxHp ? mon.hp / mon.maxHp : 1;
      if (C.bases.includes(mon.species)) mon.rotomBase = mon.species;
      mon.species = nova;
      if (mon.nickname === nomeVelho) mon.nickname = DB.SPECIES[nova].name;
      recalc(mon);
      mon.hp = Math.max(mon.hp > 0 ? 1 : 0, Math.round(mon.maxHp * hpAntes));
      this.st.seen[nova] = true;
      this.st.caught[nova] = true;
      Audio2.tone(880, 0.05); Audio2.tone(1320, 0.1);
      Glitch.hit(0.6);
      this.game.autosave?.(true);
      this.dlg.say(C.bases.includes(nova) ? C.saiu.replace("{MON}", mon.nickname)
        : C.virou.replace("{MON}", mon.nickname).replace("{FORMA}", nome));
    });
  }

  /** TROCA COM NPC (src/data/trocas.js): ele pede uma espécie e dá a dele,
   *  com apelido. Uma vez só por troca. */
  trocarComNpc(t) {
    const st = this.st, F = t.falas, flag = `troca_${t.id}`;
    if (st.flags[flag]) return void this.dlg.say(F.depois);
    const meus = st.party.filter((m) => m.species === t.pede);
    if (!meus.length) return void this.dlg.say([...F.oferta, ...F.semBicho]);
    this.dlg.say(F.oferta, () => this.dlg.ask(F.pergunta, ["SIM", "NÃO"], (i) => {
      if (i !== 0) return void this.dlg.say(F.recusou);
      if (meus.length === 1) return this.fazerTroca(t, meus[0]);
      const nomes = meus.map((m) => `${m.nickname} N${m.level}`);
      this.dlg.ask(F.qual, [...nomes, "VOLTAR"], (k) => {
        if (meus[k]) this.fazerTroca(t, meus[k]);
        else this.dlg.say(F.recusou);
      });
    }));
  }

  fazerTroca(t, meu) {
    const st = this.st;
    const i = st.party.indexOf(meu);
    if (i < 0) return;
    const novo = createMon(t.da.especie, meu.level, { nickname: t.da.apelido, shiny: !!t.da.shiny });
    novo.ot = t.dono;                      // o treinador original é quem trocou
    novo.trocado = true;
    st.party[i] = novo;                    // entra no mesmo lugar da equipe
    st.seen[t.da.especie] = true;
    st.caught[t.da.especie] = true;
    st.flags[`troca_${t.id}`] = true;
    this.game.autosave?.(true);
    // o filme da troca (src/scenes/trocanpc.js); o agradecimento vem depois
    this.game.scenes.push(new TrocaNpcScene(), {
      meu, novo, dono: t.dono, onDone: () => this.dlg.say(t.falas.feito),
    });
  }

  /** O CUBO ZYGARDE (src/data/extra.js): escolhe a forma, e a troca é a
   *  cutscene de evolução no tema verde das células. O cubo não se gasta. */
  usarCubo(mon) {
    const C = DB.CUBO_ZYGARDE;
    if (!C.aceita.includes(mon.species)) {
      Audio2.cancel();
      return void this.dlg.say(C.nada.replace("{MON}", mon.nickname));
    }
    const opcoes = C.opcoes.filter(([id]) => DB.SPECIES[id]);
    this.dlg.ask(C.pergunta.replace("{MON}", mon.nickname), [...opcoes.map(([, nome]) => nome), "VOLTAR"], (i) => {
      const escolha = opcoes[i];
      if (!escolha) return;
      const [nova] = escolha;
      if (nova === mon.species) return void this.dlg.say(C.jaE.replace("{MON}", mon.nickname));
      this.game.scenes.push(new EvolutionScene(), { mon, to: nova, forma: C.cena });
    });
  }

  spend(item, n) {
    this.st.items[item] -= n;
    if (this.st.items[item] <= 0) delete this.st.items[item];
  }

  /** MYSTERY EGG: um da mochila racha e sai um dos 151, com a forma sorteada
   *  (src/data/ovos.js). Sem vaga na equipe nem no BOX o ovo NÃO é gasto — um
   *  bicho que evapora por falta de espaço é um ovo de $500 jogado fora. */
  racharOvo(item) {
    const T = DB.OVO_TEXTO;
    this.menu = null;
    if (this.st.party.length >= 6 && boxCheio(this.st)) {
      Audio2.cancel();
      return void this.dlg.say(T.semVaga);
    }
    const r = chocarOvo(item);
    if (!r) { Audio2.cancel(); return; }
    const { mon, forma, tipo } = r;
    this.spend(item, 1);
    const msgs = [T.rachou.replace("{OVO}", tipo.label),
                  T.nasceu.replace("{MON}", mon.nickname).replace("{NIVEL}", mon.level)];
    if (T.formas[forma]) msgs.push(T.formas[forma]);
    if (this.st.party.length < 6) {
      this.st.party.push(mon);
      msgs.push(T.equipe.replace("{MON}", mon.nickname));
    } else {
      guardarNoBox(this.st, mon);
      msgs.push(T.box.replace("{MON}", mon.nickname));
    }
    this.st.seen[mon.species] = true;
    this.st.caught[mon.species] = true;
    // forma rara: a tela treme na medida do que nasceu
    if (mon.luminoso) { Glitch.hit(2.4); Audio2.glitch(); }
    else if (mon.shiny || mon.alfa) { Glitch.hit(1.6); Audio2.glitch(); }
    Audio2.heal();
    this.game.autosave?.(true);
    this.dlg.say(msgs);
  }

  /** doce raro: +1 nível por doce, até 999 de uma vez */
  useCandy(mon, qty = 1) {
    if (mon.level >= 100) { Audio2.cancel(); return void this.dlg.say(`${mon.nickname} JÁ ESTÁ NO NÍVEL MÁXIMO!`); }
    const before = mon.level;
    const used = Math.min(qty, 100 - mon.level);
    const learned = [];
    for (let i = 0; i < used; i++) {
      for (const ev of gainXp(mon, xpForLevel(mon.level + 1) - mon.xp, { semTrunfo: true })) {
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
    // INSÍGNIAS em Braglitch: duas páginas, os GINÁSIOS e as ILHAS (← →)
    if (m.type === "badges" && this.geo?.braglitch && (Input.consume("left") || Input.consume("right"))) {
      m.pagina = m.pagina ? 0 : 1;
      return void Audio2.blip();
    }
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
        if (pick === "LEVANTAR VOO") { this.menu = null; return void this.levantarVoo(); }
        if (pick === "FICAR NA BOLA") { this.menu = null; return void this.entrarNaBola(); }
        if (pick === "SAIR DA BOLA") { this.menu = null; return void this.sairDaBola(); }
        if (pick === "POUSAR") { this.menu = null; return void this.pousar(); }
        if (pick === "ACAMPAR") {
          this.menu = null;
          return void this.game.scenes.push(new AcampamentoScene());
        }
        if (pick === "ONLINE") { this.menu = null; return void this.game.scenes.push(new OnlineMenuScene()); }
        if (pick === "POKÉDEX") { this.menu = null; return void this.game.scenes.push(new PokedexScene(), {}); }
        if (pick === "POKÉMON") this.menu = { type: "party", index: 0 };
        else if (pick === "BOX") this.menu = { type: "box", lado: "box", index: 0, top: 0 };
        else if (pick === "MOCHILA") { this.menu = { type: "bag", index: 0 }; adiantarItens(Object.keys(this.st.items)); }
        else if (pick === "INSÍGNIAS") this.menu = { type: "badges", index: 0 };
        else if (pick === "MAPA") this.menu = { type: "mapaRegiao", sel: this.ondeNoMapa() };
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
      // a equipe como ESCOLHA (a creche): Z escolhe, X desiste
      if (m.escolher) {
        if (Input.consume("b")) { this.menu = null; Audio2.cancel(); this.dlg.say(DB.STORY.creche.desistiu); }
        else if (Input.consume("a")) { Audio2.select(); m.escolher(m.index); }
        return;
      }
      if (Input.consume("b")) { this.menu = { type: "main", index: 0 }; Audio2.cancel(); }
      else if (Input.consume("a") && this.st.party[m.index]) { Audio2.select(); this.acoesDaEquipe(m.index); }
      return;
    }
    if (m.type === "goLista") {
      // A escolha de quem vai pro GO: pode ter a box inteira aqui dentro, então
      // é lista com rolagem, e não o menu do diálogo (que desenha tudo de uma vez).
      const n = m.itens.length;
      if (Input.consume("up")) { m.index = (m.index + n - 1) % n; Audio2.blip(); }
      if (Input.consume("down")) { m.index = (m.index + 1) % n; Audio2.blip(); }
      if (Input.consume("left")) { m.index = Math.max(0, m.index - GO_LISTA_VIS); Audio2.blip(); }
      if (Input.consume("right")) { m.index = Math.min(n - 1, m.index + GO_LISTA_VIS); Audio2.blip(); }
      m.top = Math.max(0, Math.min(m.top, n - GO_LISTA_VIS));
      if (m.index < m.top) m.top = m.index;
      if (m.index >= m.top + GO_LISTA_VIS) m.top = m.index - GO_LISTA_VIS + 1;
      if (Input.consume("b")) { this.menu = null; Audio2.cancel(); return void this.dlg.say(DB.GO_TEXTO.cancelou); }
      if (Input.consume("a")) { Audio2.select(); m.escolher(m.itens[m.index].mon); }
      return;
    }
    if (m.type === "goDigitar") {
      if (Texto.ativo()) {
        if (!Texto.estado()) return;
        const escrito = Texto.termina();
        if (escrito !== null) m.textos[m.linha] = escrito;
        return;
      }
      if (Input.consume("up")) { m.linha = (m.linha + 3) % 4; Audio2.blip(); }
      if (Input.consume("down")) { m.linha = (m.linha + 1) % 4; Audio2.blip(); }
      if (Input.consume("b")) { this.menu = null; Audio2.cancel(); return void this.dlg.say(DB.GO_TEXTO.cancelou); }
      if (Input.consume("a")) {
        if (m.linha < 3) { Texto.comeca(m.textos[m.linha] || "", m.linha === 0 ? 14 : 10); Audio2.select(); return; }
        Audio2.select();
        this.confirmarDigitado(m);
      }
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
      // a mochila como ESCOLHA: alguém pediu um item (o montanhista); Z entrega, X desiste
      if (m.escolher) {
        if (Input.consume("b")) { this.menu = null; Audio2.cancel(); this.dlg.say(DB.STORY.travessia.desistiu); }
        else if (Input.consume("a")) { Audio2.select(); m.escolher(keys[m.index]); }
        return;
      }
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
        if (item === DB.GUIA_VOID?.item && owned > 0) {
          Audio2.select();                       // item-chave: só se lê
          return void this.dlg.say(DB.GUIA_VOID.texto);
        }
        if (item === "picareta" && owned > 0) {
          Audio2.select();                       // item-chave: cava onde estiver
          this.menu = null;
          return void this.cavarAqui();
        }
        if (DB.MINERACAO?.MINA_LORE?.[item] && owned > 0) {
          Audio2.select();                       // achado da mina: só se olha
          return void this.dlg.say(DB.MINERACAO.MINA_LORE[item]);
        }
        if (DB.OVOS?.tipos?.[item] && owned > 0) {
          Audio2.select();                       // MYSTERY EGG: racha na hora
          return void this.racharOvo(item);
        }
        if (Creche.ehOvo(item) && owned > 0) {
          Audio2.select();                       // OVO DA CRECHE: idem, espécie certa
          return void this.racharOvoDaCreche(item);
        }
        // OS PANDEIROS DA TERRA também tocam da MOCHILA: o do CÉU chama o
        // CATORBIS e abre a lista de cidades; os outros dizem onde tocar (eles
        // funcionam de frente pro obstáculo, com Z)
        // AS PEDRAS BRAGLITCHIANAS não se gastam: usar só diz o que ela faz
        const pedra = (DB.PEDRAS_BRAG || []).find((p) => p.item === item);
        if (pedra && owned > 0) { Audio2.select(); return void this.dlg.say([pedra.texto, "(FUNCIONA SÓ DE ESTAR NA MOCHILA.)"]); }
        const pandeiro = (DB.PANDEIROS || []).find((pd) => pd.item === item);
        if (pandeiro && owned > 0) {
          if (!this.geo?.braglitch) { Audio2.cancel(); return void this.dlg.say(DB.PANDEIRO_TEXTO.foraDeBraglitch); }
          Audio2.select();
          if (pandeiro.golpe === "voar") { this.menu = null; return void this.abrirVoo(); }
          return void this.dlg.say(DB.PANDEIRO_TEXTO.onde[pandeiro.golpe] || DB.PANDEIRO_TEXTO.ondeGeral);
        }
        // a CUIA TÉRMICA, o CATÁLOGO ROTOM, o CUBO ZYGARDE e os COGUMELOS do
        // PARASECT também escolhem um bicho
        const cuia = item === DB.CUIA?.item || item === DB.CATALOGO_ROTOM?.item || item === DB.CUBO_ZYGARDE?.item
          || !!DB.COGUMELOS?.itens?.[item] || item === DB.GUARDA_ROUPA?.item;
        if ((DB.EVO_ITEMS?.[item] || cuia) && owned > 0 && this.st.party.length) {
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
      if (Input.consume("b")) {
        this.menu = m.next === "buy" ? { type: "shop", index: 0, shop: m.shop }
                  : m.next === "sell" ? { type: "venda", index: 0, lista: vendaveis(this.st) }
                  : { type: "bag", index: 0 };
        Audio2.cancel();
      }
      if (Input.consume("a")) {
        Audio2.select();
        if (m.next === "buy") this.buy(m.item, m.price, m.n, m.shop);
        else if (m.next === "sell") this.sell(m.item, m.price, m.n);
        else this.menu = { type: "useItem", index: 0, item: m.item, qty: m.n };
      }
      return;
    }
    if (m.type === "venda") {
      const list = m.lista;
      if (Input.consume("up")) { m.index = (m.index + list.length - 1) % list.length; Audio2.blip(); }
      if (Input.consume("down")) { m.index = (m.index + 1) % list.length; Audio2.blip(); }
      if (Input.consume("b")) { this.menu = null; Audio2.cancel(); this.dlg.say("VOLTE SEMPRE!"); }
      if (Input.consume("a")) {
        const { item, price, qtd } = list[m.index];
        Audio2.select();
        this.menu = { type: "qty", item, price, n: 1, max: qtd, next: "sell" };
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
      if (Input.consume("a") && n) this.acoesDoBox(m, lista);
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
      if (Input.consume("select")) { m.cor = (m.cor + 1) % 3; Audio2.select(); }   // tecla C
      m.top = Math.min(Math.max(m.top, m.index - 5), m.index);                // rolagem
      if (Input.consume("b")) { this.menu = null; Audio2.cancel(); }
      if (Input.consume("a")) this.baixarMon(m);
      return;
    }
    // O seletor de data do aniversário: DIA e MÊS, dois campos.
    if (m.type === "aniversarioData") {
      const A = DB.ANIVERSARIO_TEXTO;
      const gira = (v, n) => ((v % n) + n) % n;
      const salto = Input.held("run") ? 5 : 1;
      if (Input.consume("left") || Input.consume("right")) { m.campo ^= 1; Audio2.blip(); }
      const d = Input.consume("up") ? 1 : Input.consume("down") ? -1 : 0;
      if (d) {
        if (m.campo === 0) {
          const max = Aniv.DIAS_NO_MES[m.mes - 1];
          m.dia = gira(m.dia - 1 + d * salto, max) + 1;
        } else {
          m.mes = gira(m.mes - 1 + d, 12) + 1;
          // 31 de janeiro virando fevereiro: o dia desce junto, senão sairia
          // daqui uma data que não existe
          m.dia = Math.min(m.dia, Aniv.DIAS_NO_MES[m.mes - 1]);
        }
        Audio2.blip();
      }
      if (Input.consume("b")) {
        Audio2.cancel();
        this.menu = m.volta === "opts" ? { type: "opts", index: 4 } : null;
        return;
      }
      if (Input.consume("a")) {
        Audio2.select();
        const data = Aniv.guarda(m.mes, m.dia);
        Aniv.definir(this.st, data);
        this.game.autosave?.(true);
        const volta = m.volta;
        this.menu = volta === "opts" ? { type: "opts", index: 4 } : null;
        if (volta === "mae") this.dlg.say(A.guardou.replace("{DATA}", Aniv.formata(data)));
        // anotou hoje e hoje é o dia: o pacote chega agora, sem esperar o
        // próximo mapa
        else if (volta !== "opts") this.checarAniversario();
      }
      return;
    }
    // A grade dos tipos, no dia. Sair com X não perde o presente: ele volta na
    // próxima vez, enquanto a janela não fechar.
    if (m.type === "aniversarioTipo") {
      const n = m.lista.length, COLS = 3;
      if (Input.consume("left")) { m.index = (m.index + n - 1) % n; Audio2.blip(); }
      if (Input.consume("right")) { m.index = (m.index + 1) % n; Audio2.blip(); }
      if (Input.consume("up")) { m.index = (m.index + n - COLS) % n; Audio2.blip(); }
      if (Input.consume("down")) { m.index = (m.index + COLS) % n; Audio2.blip(); }
      if (Input.consume("b")) { this.menu = null; Audio2.cancel(); }
      if (Input.consume("a")) { Audio2.select(); this.formaDoPresente(m.lista[m.index]); }
      return;
    }
    if (m.type === "mapaRegiao") {
      if (Input.consume("b") || Input.consume("a")) {
        this.menu = { type: "main", index: this.itensMenu().indexOf("MAPA") };
        return void Audio2.cancel();
      }
      for (const d of ["up", "down", "left", "right"]) {
        if (!Input.consume(d)) continue;
        const prox = this.vizinhoNoMapa(m.sel, d);
        if (prox) { m.sel = prox; Audio2.blip(); }
      }
      return;
    }
    if (m.type === "optsFala") return this.menuFala(m);
    if (m.type === "opts") {
      const n = 9;
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
      if (lado && m.index === 6) this.mudaIso();
      if (Input.consume("a")) {
        Audio2.select();
        if (m.index === 0) Glitch.scanlines = !Glitch.scanlines;
        else if (m.index === 1) Audio2.toggleMute();
        else if (m.index === 2) this.mudaVelocidade(1);
        else if (m.index === 3) this.mudaIdioma(1);
        else if (m.index === 4) this.abrirDataAniversario("opts");
        // BATALHA DUPLA: todo treinador com 2+ luta em dupla (é do save)
        else if (m.index === 5) this.st.flags.todasDuplas = !this.st.flags.todasDuplas;
        else if (m.index === 6) this.mudaIso();
        else if (m.index === 7) this.menu = { type: "optsFala", index: 0 };
        else { Save.clear(); this.menu = null; this.dlg.say("SAVE APAGADO. RECARREGUE A PÁGINA."); }
      }
    }
  }

  /** OPÇÕES → FALA (src/systems/dialogue.js lê daqui, via src/core/opcoes.js).
   *  Cada linha anda pros dois lados com ←/→ e pra frente com Z. */
  linhasDaFala() {
    const vel = FALA_VELOCIDADES[Opcoes.get("falaVel")] || FALA_VELOCIDADES[1];
    return [
      ["ESTILO", Opcoes.get("falaEstilo") === "balao" ? "BALÃO" : "CAIXA", "BALÃO: A FALA SAI DA CABEÇA DE QUEM FALA."],
      ["VELOCIDADE", vel.nome, "QUÃO RÁPIDO AS LETRAS APARECEM."],
      ["SOM DAS LETRAS", Opcoes.get("falaSom") !== false ? "ON" : "OFF", "O TIQUE DE CADA LETRA APARECENDO."],
      ["AVANÇO", Opcoes.get("falaAuto") ? "SOZINHO" : "APERTANDO Z", "SOZINHO: A PÁGINA VIRA DEPOIS DE DAR TEMPO DE LER."],
    ];
  }

  menuFala(m) {
    const n = 4;
    if (Input.consume("up")) m.index = (m.index + n - 1) % n;
    if (Input.consume("down")) m.index = (m.index + 1) % n;
    if (Input.consume("b")) { Audio2.cancel(); this.menu = { type: "opts", index: 7 }; return; }
    const lado = Input.consume("right") ? 1 : Input.consume("left") ? -1 : Input.consume("a") ? 1 : 0;
    if (!lado) return;
    Audio2.select();
    if (m.index === 0) Opcoes.set("falaEstilo", Opcoes.get("falaEstilo") === "balao" ? "caixa" : "balao");
    else if (m.index === 1) {
      const k = FALA_VELOCIDADES.length;
      Opcoes.set("falaVel", ((Opcoes.get("falaVel") ?? 1) + lado + k) % k);
    } else if (m.index === 2) Opcoes.set("falaSom", Opcoes.get("falaSom") === false);
    else Opcoes.set("falaAuto", !Opcoes.get("falaAuto"));
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
    // MODO ISOMÉTRICO (src/core/isometrico.js): o chão gira e as paredes sobem.
    // Tudo que é "do chão" abaixo recebe (cx, cy) = (0, 0) e é desenhado no
    // plano do mapa já projetado; o resto do render continua igual.
    const { px: ipx, py: ipy } = this.playerPixel();
    const iso = this._iso = art && isoLigado()
      ? origem(W, H, ipx + TILE / 2, ipy + TILE / 2, this.zIso(ipx / TILE, ipy / TILE)) : null;
    const chao = (f) => iso ? noChao(ctx, iso, () => f(0, 0)) : f(cx, cy);

    chao((cx, cy) => {
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

      // as paredes da GLITCH ZONE que cederam: um quadrado que parou de ser desenhado
      if (naZona(this.st)) {
        for (const k of this.st.zona.cedidos || []) {
          const [tx, ty] = k.split(",").map(Number);
          ctx.drawImage(tileCedido(), tx * TILE - cx, ty * TILE - cy);
        }
      }
      // OS VÃOS: as entradas das GLITCH ZONES em Kanto, e a saída dentro de uma.
      // Ficam por baixo dos atores: é uma porta, e se passa por dentro dela.
      const relogio = performance.now() / 1000;
      const vaos = naZona(this.st) ? [vaoDaZona(this.st)].filter(Boolean)
                                   : entradasDoMapa(this.st, this.st.player.map);
      for (const v of vaos) desenharVao(ctx, v.x * TILE - cx, v.y * TILE - cy, relogio);
      this.desenharPredioNoPreto(ctx, cx, cy);

    });

    const actors = [];
    for (const n of this.npcsHere()) {
      // `invisivel` nasce sem sprite (item escondido); `hidden` some depois de pego
      if (n.invisivel || this.st.npcState[`${this.st.player.map}.${n.id}`]?.hidden) continue;
      const t = (n.tamanho || 1) - 1;
      actors.push({ x: (n.fx ?? n.x) + t, y: n.y + t, ax: n.fx ?? n.x, ay: n.fy ?? n.y, dir: n.dir || "down",
                    draw: (c = ctx) => this.drawNpc(c, n, cx, cy) });
    }
    // OS SELVAGENS À VISTA e o COMPANHEIRO entram na MESMA lista de atores que
    // o resto: assim eles passam por trás e pela frente das coisas na ordem
    // certa, em vez de flutuarem por cima do mundo.
    for (const b of this.selvagens || []) {
      actors.push({ x: b.x, y: b.y, dir: this.rumoDoSelvagem(b), draw: (c = ctx) => this.drawSelvagem(c, b, cx, cy) });
    }
    const segue = this.quemSegue();
    // onde o companheiro (ou o dono) está DESENHADO: no meio do passo, como você
    const kc = this.move ? this.move.n / this.move.total : 1;
    const ondeCompa = () => {
      const c = this.compa;
      const ax = c.de.x + (c.x - c.de.x) * kc, ay = c.de.y + (c.y - c.de.y) * kc;
      return { x: ax, ax, ay, d: ax + ay, dir: c.dir || "down" };
    };
    // (dormindo ele está lá em cima: ninguém te segue até de manhã)
    if (this.st.capturado && !this.st.capturado.naBola && !this.st.capturado.dormindo
        && this.compa && !this.st.surfando && !this.st.voando) {
      // CAPTURADO: quem te segue é o seu dono, com a bola na mão
      actors.push({ ...ondeCompa(), y: this.compa.y, draw: (c = ctx) => this.drawDono(c, cx, cy) });
    } else if (segue && this.compa && !this.st.surfando) {
      actors.push({ ...ondeCompa(), y: this.compa.y, draw: (c = ctx) => this.drawCompanheiro(c, segue, cx, cy) });
    }
    for (const o of this.arvoresAqui()) {
      const [ox, oy] = o.split(",").map(Number);
      actors.push({ x: ox, y: oy, semSombra: true, draw: (c = ctx) => c.drawImage(Assets.arvorezinha, ox * TILE - cx, oy * TILE - cy, TILE, TILE) });
    }
    for (const o of this.pedrasAqui()) {
      const [ox, oy] = o.split(",").map(Number);
      actors.push({ x: ox, y: oy, semSombra: true, draw: (c = ctx) => c.drawImage(Assets.rocha, ox * TILE - cx, oy * TILE - cy, TILE, TILE) });
    }
    for (const b of this.blocosAqui()) {
      actors.push({ x: b.x, y: b.y, semSombra: true, draw: (c = ctx) => c.drawImage(Assets.bloco, b.x * TILE - cx, b.y * TILE - cy, TILE, TILE) });
    }
    // A ESTÁTUA (o ARCEUS REDENTOR de RIO DE JANEEVEE): nove blocos de altura em pé
    // em cima da base, na mesma fila dos atores — quem anda atrás dela some
    // atrás dela. Fica na fileira de baixo da base; no isométrico, no meio
    // dela e em cima do pedestal.
    const est = this.geo?.estatua;
    if (est) {
      const ax = est.x + (est.w - 1) / 2, ay = est.y + (est.h - 1) / 2;
      actors.push({ x: est.x + est.w - 1, y: est.y + est.h - 1, ax, ay, d: est.x + est.w - 1 + est.y + est.h - 1 + 0.5,
                    sobe: ESTATUA_BASE, semSombra: true, dir: "down",
                    draw: (c = ctx) => this.drawEstatua(c, est, ax, ay, cx, cy) });
    }
    // os outros jogadores da sala entram na MESMA lista de atores, então eles
    // passam por trás e pela frente das coisas como qualquer NPC
    for (const outro of Online.noMapa(this.st.player.map)) {
      actors.push({ x: outro.x, y: outro.y, ax: outro.px / TILE, ay: outro.py / TILE, dir: outro.dir || "down",
                    draw: (c = ctx) => this.drawPeer(c, outro, cx, cy) });
    }
    const { px, py } = this.playerPixel(true);
    actors.push({ x: this.st.player.x, y: this.st.player.y, ax: ipx / TILE, ay: ipy / TILE, dir: this.st.player.dir,
                  draw: (c = ctx) => this.drawPlayer(c, px - cx, py - cy) });
    if (iso) this.desenharIso(ctx, iso, art, actors, cx, cy);
    else actors.sort((a, b) => a.y - b.y).forEach((a) => a.draw());

    this.drawCaboDoBondinho(ctx, cx, cy, iso);

    // camada de cima: o jogador passa POR TRÁS de copa de árvore, telhado, batente
    // (no isométrico quem esconde o jogador são os próprios blocos)
    const over = !iso && mapOverlay(this.st.player.map);
    if (over) ctx.drawImage(over, -cx, -cy);

    if (this.rustle && !iso) {
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
    for (const outro of Online.noMapa(this.st.player.map)) {
      if (!iso) { this.drawPeerTag(ctx, outro, cx, cy); continue; }
      const p = naTela(iso, outro.px + TILE / 2, outro.py + TILE / 2);
      const z = this.zIso(outro.px / TILE, outro.py / TILE);
      this.drawPeerTag(ctx, outro, outro.px + TILE / 2 - p.x, outro.py + TILE / 2 - p.y + ISO_PE + z);
    }
    if (Online.aviso) this.drawAvisoOnline(ctx);
    this.drawSinal(ctx);

    if (this.st.capturado?.naBola) {
      // o vidro da bola: vermelho em cima, branco embaixo, e a fresta no meio
      ctx.fillStyle = "rgba(220,40,40,.22)"; ctx.fillRect(0, 0, W, H / 2);
      ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.fillRect(0, H / 2, W, H / 2);
      ctx.fillStyle = "rgba(30,30,40,.5)"; ctx.fillRect(0, H / 2 - 2, W, 4);
    }
    this.drawVida(ctx);
    this.drawCoordenadas(ctx);
    // o HUD dos DLCs (o medidor da SHINY ZONE): por cima do mapa, por baixo
    // do menu e das falas
    for (const f of DB.GANCHOS?.hud || []) f(ctx, this.st, { panel, drawText, bar, PAL, W, H });
    if (this.banner > 0) this.drawBanner(ctx);
    else if ((this.paradoT || 0) > 1) this.drawObjetivo(ctx);
    if (this.viagemBondinho) this.drawBondinho(ctx);
    if (this.viagemLancha) this.drawLancha(ctx);
    if (this.menu) this.drawMenu(ctx);
    this.dlg.render(ctx);
    if (this.fadeA > 0) fade(ctx, this.fadeA);
    if (this.fx) this.drawBattleFx(ctx);
  }

  /** O MUNDO NO ISOMÉTRICO: as paredes sobem em blocos e os atores ficam em pé
   *  entre elas, todos na mesma fila de trás pra frente (profundidade x + y).
   *  Um ator é desenhado pela função de sempre, só que com a tela deslocada
   *  pra que o tile dele caia no losango certo. */
  desenharIso(ctx, iso, art, actors, cx, cy) {
    // os blocos saem do desenho INTEIRO (chão + camada de cima): o telhado e a
    // copa das árvores de Kanto moram na camada de cima (src/core/sprites.js)
    art = mapArtInteira(this.st.player.map) || art;
    const g = this.geo, B = DB.TAG.BLOCK;
    const r = relevo(this.st.player.map, g);
    // a altura de um tile AGORA: parede que abriu no meio do jogo (árvore
    // cortada, barreira, parede da GLITCH ZONE que cedeu) desce pro chão
    const alt = (x, y) => {
      if (x < 0 || y < 0 || x >= g.w || y >= g.h) return 0;
      const k = y * g.w + x;
      return r.parede[k] && this.tagAt(x, y) !== B ? r.base[k] : r.topo[k];
    };
    const fila = actors.map((a) => ({ a, d: a.d ?? (a.x ?? 0) + a.y }))
      .sort((p, q) => p.d - q.d);
    let i = 0;
    const emPe = ({ a }) => {
      const ax = a.ax ?? a.x ?? 0, ay = a.ay ?? a.y;
      const p = naTela(iso, ax * TILE + TILE / 2, ay * TILE + TILE / 2);
      const z = chaoEm(r, ax, ay) + (a.sobe || 0);
      if (!a.semSombra) sombra(ctx, p.x, p.y - z);
      ctx.save();
      ctx.translate(Math.round(p.x - (ax * TILE - cx + TILE / 2)),
                    Math.round(p.y - (ay * TILE - cy + TILE / 2) - ISO_PE - z));
      if (!a.dir) { a.draw(); ctx.restore(); return; }
      // A PLAQUINHA: o sprite vai num plano em pé, inclinado como as paredes
      // dos blocos. Quem olha ↙ ou ↗ (baixo/cima no mapa) fica de frente pra
      // face sul, que desce pra direita; quem olha ↘ ou ↖ (direita/esquerda)
      // fica na face leste, que sobe pra direita. O pé é o eixo: ele fica no
      // lugar e o resto do corpo inclina em volta dele.
      const sul = a.dir === "down" || a.dir === "up";
      const px = ax * TILE - cx + TILE / 2, py = ay * TILE - cy + TILE;
      ctx.translate(px, py);
      ctx.transform(1, sul ? 0.5 : -0.5, 0, 1, 0, 0);
      ctx.translate(-px, -py);
      // ...e não é papel: tem ESPESSURA, que vai pra longe da câmera (pra
      // trás da face sul é o norte do mapa, ↗; pra trás da face leste, o oeste, ↖)
      const m = ctx.getTransform();
      ctx.restore();
      comEspessura(ctx, m, (c) => a.draw(c), sul ? 1 : -1, -0.5, ISO_ESPESSURA);
    };
    for (const t of tilesVisiveis(iso, W, H, TILE, g.w, g.h)) {
      while (i < fila.length && fila[i].d < t.d) emPe(fila[i++]);
      const z = alt(t.x, t.y), sul = alt(t.x, t.y + 1), leste = alt(t.x + 1, t.y);
      // no nível zero o tampo já está no chão desenhado; só falta a face se o
      // vizinho da frente for mais baixo (a margem de um rio)
      if (z !== 0 || sul < 0 || leste < 0) {
        coluna(ctx, iso, art, TILE, t.x, t.y, z, sul, leste, z !== 0, this.fontePredio(r, t.x, t.y, z));
      }
      // o mato balança no tampo do tile, por baixo de quem está nele
      if (this.rustle && this.rustle.x === t.x && this.rustle.y === t.y) {
        const f = Math.min(2, Math.floor(this.rustle.t / 0.12));
        noChao(ctx, iso, (c) => c.drawImage(Assets.rustle[f], t.x * TILE, t.y * TILE), z);
      }
    }
    while (i < fila.length) emPe(fila[i++]);
  }

  /** OS BONECOS NO ISOMÉTRICO olham na diagonal (src/core/isometrico.js):
   *  de frente ou de costas, espelhados pro lado certo. Fora dele, o de sempre.
   *  `sets` é o que Assets.actor devolve (um conjunto de quadros por direção). */
  olhar(sets, dir) {
    if (!this._iso) return { set: sets?.[dir] || sets?.down, espelha: false };
    const v = vistaIso(dir);
    return { set: sets?.[v.costas ? "up" : "down"] || sets?.down, espelha: v.espelha };
  }
  quadro(img, espelha) { return espelha ? espelhar(img) : img; }

  /** A figura da ESTÁTUA, com os pés no meio da base (`ax, ay`, em tiles):
   *  ancorada pelo meio de baixo, com a altura do próprio PNG (o do ARCEUS
   *  REDENTOR tem 144px, nove blocos). */
  drawEstatua(ctx, est, ax, ay, cx, cy) {
    const img = estatuaArt(est.arte);
    if (!img) return;
    const x = Math.round(ax * TILE + TILE / 2 - cx - img.width / 2);
    const y = Math.round(ay * TILE + TILE / 2 - cy - img.height + 4);
    ctx.drawImage(img, x, y);
    // O RELEVO DA CARA: fatias do mesmo tamanho da estátua, uma por cima da
    // outra, cada uma um passo mais pra frente — as de baixo são a lateral de
    // pedra, a de cima é a cara (tools/estatua_camadas.py)
    const c = est.cara;
    for (let k = 1; c && k <= c.camadas + (c.olhos ? 1 : 0); k++) {
      const f = estatuaArt(`${est.arte}_cara_${k}`);
      const nivel = k > c.camadas ? c.olhos : k;          // os olhos vão na altura deles
      if (f) ctx.drawImage(f, x + c.passo[0] * nivel, y + c.passo[1] * nivel);
    }
  }

  /** Pra onde o selvagem olha: ele não guarda direção, então ela sai do último
   *  passo que ele deu (parado desde que nasceu: de frente, ↙). */
  rumoDoSelvagem(b) {
    const rumo = rumoDoSelvagem.get(b) || { x: b.x, y: b.y, dir: "down" };
    if (rumo.x !== b.x || rumo.y !== b.y) {
      rumo.dir = b.x > rumo.x ? "right" : b.x < rumo.x ? "left" : b.y > rumo.y ? "down" : "up";
      rumo.x = b.x; rumo.y = b.y;
    }
    rumoDoSelvagem.set(b, rumo);
    return rumo.dir;
  }

  /** O Pokémon do mapa (companheiro, o da prancha, NPC-Pokémon) na diagonal */
  monNaVista(especie, seed, dir) {
    const v = this.vistaMon(dir);
    if (!v) return Assets.mon(especie, seed);
    const img = v.costas ? Assets.monBack(especie, seed) : Assets.mon(especie, seed);
    return v.espelha ? espelhar(img) : img;
  }
  vistaMon(dir) { return this._iso ? vistaIso(dir) : null; }

  /** O desenho de um PRÉDIO no isométrico (src/core/isometrico.js): o teto é
   *  a fileira de cima dele repetida — menos os enfeites (a Poké Ball do
   *  CENTRO, a placa da loja), que ficam uma vez só, no lugar deles —, e a
   *  parede da frente (2 blocos de altura)
   *  mostra as duas fileiras de baixo do desenho — a da placa e a da porta, no
   *  CENTRO POKÉMON — sem esticar nada. `null`: não é prédio (ou já abriu). */
  fontePredio(r, x, y, z) {
    const i = y * r.w + x, t = r.teto[i];
    if (t < 0 || z !== r.topo[i]) return null;
    const f = fontesDoTeto(r, mapArtInteira(this.st.player.map), TILE)[i];
    // uma fileira do desenho por bloco de altura (dois nos prédios comuns, sete
    // na TORRE POKÉMON), sem passar da fileira de cima do prédio
    const blocos = Math.max(1, Math.round((r.topo[i] - r.base[i]) / TILE));
    const de = Math.max(r.cimaY[i], y - blocos + 1);
    const altura = (y - de + 1) * TILE;
    return {
      tampo: [(f % r.w) * TILE, Math.floor(f / r.w) * TILE],
      sul: [x * TILE, de * TILE, altura],
      leste: [x * TILE, de * TILE, altura],
    };
  }

  /** Altura do chão em (x, y) — em tiles, pode ser fracionário — no isométrico.
   *  Fora dele é sempre zero. */
  zIso(x, y) {
    if (!this.geo || !isoLigado()) return 0;
    return chaoEm(relevo(this.st.player.map, this.geo), x, y);
  }

  /** ISOMÉTRICO liga/desliga (é do aparelho, como a velocidade) */
  mudaIso() {
    alternarIso();
    Audio2.blip();
  }

  // ------------------------------------------------- O MAPA DA REGIÃO
  // Braglitch no formato do Brasil (DB.MAPA_REGIAO, de src/data/braglitch-mundo.js):
  // o contorno do país, as rotas ligando os lugares, as cidades, as praias e
  // um VOCÊ ESTÁ AQUI piscando. As setas andam de lugar em lugar.

  /** O lugar do mapa onde você está: o próprio mapa, ou — dentro de um Centro,
   *  loja, casa ou ginásio — a cidade de onde a porta sai. */
  ondeNoMapa() {
    const L = DB.MAPA_REGIAO?.layout || {};
    const aqui = this.st.player.map;
    if (L[aqui]) return aqui;
    const fora = (DB.KANTO[aqui]?.warps || []).map((w) => w.to).find((to) => L[to]);
    return fora || Object.keys(L)[0];
  }

  /** O lugar mais perto na direção da seta (cone de ~60°). */
  vizinhoNoMapa(de, dir) {
    const L = DB.MAPA_REGIAO.layout;
    const [x0, y0] = L[de].pos;
    const [dx, dy] = DIRS[dir];
    let melhor = null, nota = Infinity;
    for (const [id, l] of Object.entries(L)) {
      if (id === de || !DB.MAPS[id]) continue;
      const vx = l.pos[0] - x0, vy = l.pos[1] - y0;
      const ao = vx * dx + vy * dy, lado = Math.abs(vx * dy - vy * dx);
      if (ao <= 0 || lado > ao * 1.7) continue;
      const n = ao + lado * 2;
      if (n < nota) { nota = n; melhor = id; }
    }
    return melhor;
  }

  drawMapaRegiao(ctx, m) {
    const R = DB.MAPA_REGIAO, L = R.layout;
    const X = (x) => Math.round(52 + x * 1.36), Y = (y) => Math.round(8 + y * 1.26);
    ctx.fillStyle = "#1f5f99";                      // o mar
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#2a70ad";
    for (let y = 3; y < H; y += 6) for (let x = (y * 7) % 11; x < W; x += 11) ctx.fillRect(x, y, 3, 1);
    // os vizinhos (o resto da América do Sul), em cinza, pra o Brasil não flutuar
    ctx.fillStyle = "#6b7a6a";
    ctx.beginPath();
    ctx.moveTo(0, Y(8)); ctx.lineTo(X(12), Y(10)); ctx.lineTo(X(1), Y(31)); ctx.lineTo(X(11), Y(41)); ctx.lineTo(X(34), Y(47));
    ctx.lineTo(X(40), Y(64)); ctx.lineTo(X(46), Y(70)); ctx.lineTo(X(48), Y(78)); ctx.lineTo(X(45), Y(85)); ctx.lineTo(X(41), Y(90));
    ctx.lineTo(X(47), Y(92)); ctx.lineTo(X(52), Y(99)); ctx.lineTo(X(44), H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
    // O BRASIL: o contorno cheio de verde, com a borda escura
    const contorno = () => {
      ctx.beginPath();
      R.contorno.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y))));
      ctx.closePath();
    };
    ctx.fillStyle = "#4f9e45"; contorno(); ctx.fill();
    ctx.save(); contorno(); ctx.clip();               // a Amazônia, mais escura, lá em cima à esquerda
    ctx.fillStyle = "#3a8238"; ctx.beginPath(); ctx.ellipse(X(28), Y(24), 34, 22, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#b9a95a"; ctx.beginPath(); ctx.ellipse(X(80), Y(38), 12, 11, 0, 0, Math.PI * 2); ctx.fill();   // o sertão
    ctx.restore();
    ctx.strokeStyle = "#1d3b1a"; ctx.lineWidth = 1; contorno(); ctx.stroke();
    // AS ROTAS: uma linha entre cada par ligado (com as curvas de quem tem `via`)
    ctx.strokeStyle = "#e3b36a";
    for (const [id, l] of Object.entries(L)) {
      if (!DB.MAPS[id]) continue;
      for (const [lado, para] of Object.entries(l.liga)) {
        if (!DB.MAPS[para] || para < id) continue;    // cada ligação uma vez só
        const volta = Object.entries(L[para].liga).find(([, v]) => v === id)?.[0];
        const pontos = [l.pos, ...(l.via?.[lado] || []), ...[...(L[para].via?.[volta] || [])].reverse(), L[para].pos];
        ctx.beginPath();
        pontos.forEach(([x, y], i) => (i ? ctx.lineTo(X(x) + 0.5, Y(y) + 0.5) : ctx.moveTo(X(x) + 0.5, Y(y) + 0.5)));
        ctx.stroke();
      }
    }
    // OS LUGARES: cidade é quadrado branco; praia, amarelo; rota, pontinho de terra
    const aqui = this.ondeNoMapa();
    const pisca = Math.floor(performance.now() / 300) % 2 === 0;
    for (const [id, l] of Object.entries(L)) {
      if (!DB.MAPS[id]) continue;
      const x = X(l.pos[0]), y = Y(l.pos[1]), tipo = R.tipos[id];
      if (tipo === "cidade") { ctx.fillStyle = "#1a1a1a"; ctx.fillRect(x - 3, y - 3, 7, 7); ctx.fillStyle = "#f4f1e8"; ctx.fillRect(x - 2, y - 2, 5, 5); }
      else if (tipo === "praia") { ctx.fillStyle = "#1a1a1a"; ctx.fillRect(x - 2, y - 2, 5, 5); ctx.fillStyle = "#ffd23f"; ctx.fillRect(x - 1, y - 1, 3, 3); }
      else { ctx.fillStyle = "#7a4a22"; ctx.fillRect(x - 1, y - 1, 3, 3); }
      if (id === aqui && pisca) { ctx.fillStyle = "#e0524a"; ctx.fillRect(x - 2, y - 2, 5, 5); }
    }
    // o cursor: um quadradinho piscando em volta do lugar escolhido
    const s = L[m.sel];
    if (s) {
      const x = X(s.pos[0]), y = Y(s.pos[1]);
      ctx.strokeStyle = "#ffffff"; ctx.strokeRect(x - 5.5, y - 5.5, 12, 12);
      ctx.strokeStyle = "#1a1a1a"; ctx.strokeRect(x - 6.5, y - 6.5, 14, 14);
    }
    // o título e a faixa de baixo com o nome
    panel(ctx, 4, 4, 70, 18);
    drawText(ctx, "BRAGLITCH", 10, 9, PAL.glitch);
    panel(ctx, 4, H - 24, W - 8, 20);
    const nome = DB.MAPS[m.sel]?.name || m.sel;
    const tipo = { cidade: "CIDADE", praia: "PRAIA", rota: "ROTA" }[R.tipos[m.sel]] || "";
    drawText(ctx, nome.slice(0, 26), 10, H - 18, PAL.ink);
    drawText(ctx, m.sel === aqui ? "VOCÊ" : tipo, W - 50, H - 18, m.sel === aqui ? "#e0524a" : PAL.ink2);
  }

  /** O POKÉMON TRUNFO (ver `gainXp` em src/systems/mon.js): um só, pra equipe
   *  e a box inteira. Escolher outro tira o título do anterior; escolher o
   *  mesmo pergunta se é pra tirar. */
  escolherTrunfo(mon) {
    const T = DB.TRUNFO_TEXTO;
    if (mon.trunfo) {
      return void this.dlg.ask(T.tirar.replace("{MON}", mon.nickname), ["SIM", "NÃO"], (i) => {
        if (i !== 0) return;
        mon.trunfo = false;
        this.dlg.say(T.tirou.replace("{MON}", mon.nickname));
      });
    }
    this.dlg.ask(T.pergunta.replace("{MON}", mon.nickname), ["SIM", "NÃO"], (i) => {
      if (i !== 0) return;
      for (const m of [...this.st.party, ...(this.st.box || [])]) if (m) m.trunfo = false;
      mon.trunfo = true;
      Audio2.heal();
      this.dlg.say([T.virou.replace("{MON}", mon.nickname), T.explica]);
    });
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
    // POKÉSAVE: você é um Pokémon, e é ele que anda (src/systems/pokesave.js).
    // Nadando também: um Pokémon não precisa de outro pra atravessar.
    if (this.st.capturado?.naBola) {
      // dentro da bola: no mapa anda o dono, com você no cinto
      const { set, espelha } = this.olhar(Assets.actor("cacador") || Assets.actor("hero"), this.st.player.dir);
      const img = this.quadro(this.move ? set[this.stepParity ? 1 : 3] : set[0], espelha);
      return void ctx.drawImage(img, Math.round(x), Math.round(y) + TILE - img.height);
    }
    if (this.st.pokesave) {
      acompanharEvolucao(this.st);           // evoluiu? o mapa evolui junto
      const k = this.move ? this.move.n / this.move.total : 0;
      let bob = nadando ? Math.sin(performance.now() / 260) * 1.2 : 0;
      if (this.st.voando) {
        // no ar: a sombra fica no chão e o bicho sobe, balançando devagar
        ctx.fillStyle = "rgba(0,0,0,.28)";
        ctx.beginPath(); ctx.ellipse(Math.round(x) + 8, Math.round(y) + 14, 7, 3, 0, 0, Math.PI * 2); ctx.fill();
        bob = -12 + Math.sin(performance.now() / 320) * 2;
      }
      return desenharPokemon(ctx, this.st.pokesave, x, y + bob, this.st.player.dir, k, 28, this.vistaMon(this.st.player.dir));
    }
    const { set, espelha } = this.olhar(Assets.actor("hero"), this.st.player.dir);
    // andando: um quadro de passo por tile, alternando a perna (o ciclo do GBA).
    // nadando: quadro parado sempre — quem se mexe é o Pokémon, o herói só vira.
    const img = this.quadro(this.move && !nadando ? set[this.stepParity ? 1 : 3] : set[0], espelha);
    ctx.drawImage(img, Math.round(x), Math.round(y) + TILE - img.height);
    if (nadando) {
      // o Pokémon vem POR CIMA, cobrindo o herói da cintura pra baixo
      const mon = this.monNaVista(this.st.surfando, 7, this.st.player.dir);
      const bob = Math.sin(performance.now() / 260) * 1.2;    // sobe e desce na água
      ctx.drawImage(reduzido(mon, 26), Math.round(x) - 5, Math.round(y + 4 + bob), 26, 26);
    }
  }

  /** Outro jogador andando no mesmo mapa. */
  drawPeer(ctx, p, cx, cy) {
    const x = Math.round(p.px - cx), y = Math.round(p.py - cy);
    const ps = pokesaveDoSprite(p.sprite);     // o outro jogador é um Pokémon?
    if (ps) return desenharPokemon(ctx, ps, x, y, p.dir || "down", p.passo > 0 ? (p.passo % 1) : 0, 28, this.vistaMon(p.dir || "down"));
    const { set: s0, espelha } = this.olhar(Assets.actor(p.sprite || "hero", false), p.dir || "down");
    const set = s0 || Assets.actor("hero", false).down;
    const img = this.quadro(p.passo > 0 ? set[(p.passo | 0) % 2 ? 1 : 3] : set[0], espelha);
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
    // shiny no mato aparece shiny, e luminoso aparece luminoso: o brilho é a
    // informação que faz alguém atravessar a rota correndo, e escondê-la até a
    // batalha seria escondê-la
    // no isométrico ele olha pra onde anda: o selvagem não guarda direção,
    // então ela sai do último passo que ele deu (parado desde sempre: ↙)
    const v = this._iso ? vistaIso(this.rumoDoSelvagem(b)) : null;
    const cru = v?.costas ? (Assets.monBack(b.mon.species, b.mon.seed) || bruto) : bruto;
    const img = v?.espelha ? espelhar(Assets.comCor(cru, b.mon, !!v?.costas)) : Assets.comCor(cru, b.mon, !!v?.costas);
    const caca = cacando(b, this.st.player);
    const corre = !caca && fugindo(b, this.st.player);
    // quem está caçando pula mais rápido e mais alto: o bicho parece afobado
    // antes de você ler o aviso, e é assim que se avisa sem texto. O ARISCO
    // também se mexe mais — só que fugindo, e sem o aviso vermelho: ele não é
    // uma ameaça a caminho, é uma coisa saindo de perto.
    const vel = caca ? 150 : corre ? 200 : 380;
    const pulo = Math.abs(Math.sin(performance.now() / vel + b.x * 1.7 + b.y)) * (caca || corre ? 4 : 2);
    // o ALFA é maior — é a primeira coisa que se nota nele, antes da cor
    const lado = b.mon.alfa ? 38 : 28;
    const x = Math.round(b.x * TILE - cx - 6 - (lado - 28) / 2), y = Math.round(b.y * TILE - cy - 12 - pulo - (lado - 28));
    // A HORDA: quem traz uma anda com o bando em cima dele — silhuetas pretas,
    // uma por bicho a mais (até 4), em leque por trás e pulando cada uma no seu
    // compasso. É o aviso de que encostar ali é 1 contra vários.
    if (b.horda) {
      const sil = silhuetaPreta(img), n = Math.min(4, b.horda.length - 1), t = performance.now();
      ctx.save();
      ctx.globalAlpha = 0.8;
      for (let i = 0; i < n; i++) {
        const k = n === 1 ? 0 : i / (n - 1) - 0.5;          // -0.5 .. 0.5: o leque
        const p = Math.abs(Math.sin(t / 300 + i * 1.9 + b.x)) * 2;
        ctx.drawImage(reduzido(sil, 20), Math.round(x + 4 + k * 26), Math.round(y - 9 + Math.abs(k) * 6 - p), 20, 20);
      }
      ctx.restore();
    }
    ctx.drawImage(reduzido(img, lado), x, y, lado, lado);
    // e o AVISO em cima dele. Perseguidor sem aviso é armadilha: quem toma uma
    // batalha que não pediu tem que ter tido a chance de ver ela chegando.
    if (caca && Math.floor(performance.now() / 220) % 2 === 0) {
      drawText(ctx, "!", x + Math.round(lado / 2) - 3, y - 8, "#ff5566", { shadow: "#2b0a12" });
    }
  }

  /** O COMPANHEIRO, no compasso do seu passo. Interpolar com a MESMA fração do
   *  seu movimento é o que faz ele andar junto: com posição de tile inteiro ele
   *  pula de casa em casa enquanto você desliza, e a tela parece destravada. */
  /** O caçador que te pegou, andando atrás de você. */
  drawDono(ctx, cx, cy) {
    const c = this.compa;
    const k = this.move ? this.move.n / this.move.total : 1;
    const x = (c.de.x + (c.x - c.de.x) * k) * TILE - cx;
    const y = (c.de.y + (c.y - c.de.y) * k) * TILE - cy;
    const { set, espelha } = this.olhar(Assets.actor("cacador") || Assets.actor("hero"), c.dir || "down");
    const img = this.quadro(this.move ? set[this.stepParity ? 1 : 3] : set[0], espelha);
    ctx.drawImage(img, Math.round(x), Math.round(y) + TILE - img.height);
  }

  drawCompanheiro(ctx, mon, cx, cy) {
    const img = this.monNaVista(mon.species, mon.seed, this.compa?.dir || "down");
    if (!img) return;
    const c = this.compa;
    const k = this.move ? this.move.n / this.move.total : 1;
    const x = (c.de.x + (c.x - c.de.x) * k) * TILE - cx;
    const y = (c.de.y + (c.y - c.de.y) * k) * TILE - cy;
    const pulo = this.move ? Math.abs(Math.sin(k * Math.PI)) * 2 : 0;
    ctx.drawImage(reduzido(img, 28), Math.round(x - 6), Math.round(y - 12 - pulo), 28, 28);
  }

  drawNpc(ctx, n, cx, cy) {
    // `fx, fy`: posição fracionária de quem está deslizando entre dois tiles
    // (o caçador do pokésave); os outros ficam parados no tile deles
    const x = (n.fx ?? n.x) * TILE - cx, y = (n.fy ?? n.y) * TILE - cy;
    if (n.sprite === "ball") return void ctx.drawImage(Assets.ball, x + 4, y + 4);
    if (n.sprite === "livro") {
      // um livro aberto largado no chão: capa marrom, duas páginas, linhas
      ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.fillRect(x + 2, y + 12, 13, 2);
      ctx.fillStyle = "#5a3418"; ctx.fillRect(x + 1, y + 5, 14, 8);
      ctx.fillStyle = "#f2ead2"; ctx.fillRect(x + 2, y + 4, 5, 8); ctx.fillRect(x + 9, y + 4, 5, 8);
      ctx.fillStyle = "#8f8672";
      for (let i = 0; i < 3; i++) { ctx.fillRect(x + 3, y + 6 + i * 2, 3, 1); ctx.fillRect(x + 10, y + 6 + i * 2, 3, 1); }
      ctx.fillStyle = "#3a200e"; ctx.fillRect(x + 7, y + 4, 2, 9);
      return;
    }
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
    // A ESTAÇÃO DO BONDINHO: o poste com o cabo subindo pro mar e a cabine
    // vermelha parada na plataforma, balançando de leve
    if (n.sprite === "bondinho") {
      const t = performance.now() / 500;
      ctx.fillStyle = "#5a5f6a";
      ctx.fillRect(x + 2, y - 18, 3, 34);                 // o poste
      ctx.fillRect(x, y - 19, 9, 2);                      // a cruzeta (o cabo sai dela: `drawCaboDoBondinho`)
      const bal = Math.round(Math.sin(t) * 1);
      ctx.fillStyle = "#2a2d33";
      ctx.fillRect(x + 10 + bal, y - 14, 1, 5);           // o braço da cabine
      ctx.fillStyle = "#d8322e";
      ctx.fillRect(x + 6 + bal, y - 9, 10, 9);            // a cabine
      ctx.fillStyle = "#bfe6ff";
      ctx.fillRect(x + 8 + bal, y - 7, 6, 3);             // a janela
      ctx.fillStyle = "#8f1f1c";
      ctx.fillRect(x + 6 + bal, y - 1, 10, 1);
      return;
    }
    if (n.sprite.startsWith("mon:")) {
      // a MEGA DESCONTROLADA: a aura roxa pulsando atrás, e ela não para quieta
      if (n.descontrolada) {
        const a = 0.35 + 0.25 * Math.sin(performance.now() / 110);
        const g = ctx.createRadialGradient(x + 8, y - 4, 2, x + 8, y - 4, 28);
        g.addColorStop(0, `rgba(200,70,255,${a})`);
        g.addColorStop(1, "rgba(200,70,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(x - 20, y - 32, 56, 56);
      }
      const treme = n.descontrolada ? Math.round((Math.random() * 2 - 1) * 0.8) : 0;
      const img = this.monNaVista(n.sprite.slice(4), 7, n.dir || "down");
      return void ctx.drawImage(reduzido(img, 40), x - 12 + treme, y - 24, 40, 40);
    }
    const { set, espelha } = this.olhar(Assets.actor(n.sprite), n.dir || "down");
    // andando, alterna a perna como o jogador (a paridade sai da posição)
    const img = this.quadro(n.andando ? set[Math.floor((n.fx + n.fy) * 2) % 2 ? 1 : 3] : set[0], espelha);
    // GRANDE (o caçador com dez mil de raiva): o bloco 2x2 inteiro, o sprite
    // esticado pra cobrir ele, e um tremor — ele não para quieto
    if ((n.tamanho || 1) > 1) {
      const t = n.tamanho, lado = TILE * t;
      const j = Math.round((Math.random() * 2 - 1) * 0.6);
      ctx.drawImage(img, x + j, y + lado - img.height * t, img.width * t, img.height * t);
      return;
    }
    // O sprite é encostado no CANTO do tile, e isso só funciona enquanto ele
    // tem a largura de um tile. O MOTOQUEIRO tem 32 (é o `.width` do decomp), e
    // encostado no canto ele ficava meio tile à direita do lugar. Centralizar
    // pela largura vale pra qualquer tamanho e não muda nada nos de 16.
    ctx.drawImage(img, x - (img.width - TILE) / 2, y + TILE - img.height);
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

  /** O OBJETIVO: o próximo passo da história da região em que você está
   *  (src/systems/objetivo.js), no canto de cima, depois de 1 s parado. */
  drawObjetivo(ctx) {
    const texto = objetivoAtual(this.st, regiaoDoMapa(this.st.player.map));
    if (!texto) return;
    const linhas = wrapText(texto, 24).slice(0, 4);
    ctx.globalAlpha = Math.min(1, (this.paradoT - 1) / 0.25);
    const w = Math.max(...linhas.map((l) => l.length), 8) * 6 + 16;
    panel(ctx, 4, 4, w, 20 + linhas.length * 11);
    drawText(ctx, "OBJETIVO", 12, 9, PAL.glitch);
    linhas.forEach((l, i) => drawText(ctx, l, 12, 21 + i * 11, PAL.ink));
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
      if (mon) ctx.drawImage(reduzido(Assets.mon(mon.species, mon.seed), 24), bx + 1, by + 1, 24, 24);
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
    if (m.type === "mapaRegiao") return this.drawMapaRegiao(ctx, m);
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
      drawText(ctx, m.titulo || "EQUIPE", 12, 10, PAL.ink);
      this.st.party.forEach((mon, i) => {
        const y = 24 + i * 24;
        if (i === m.index) cursor(ctx, 8, y + 7);
        ctx.drawImage(reduzido(Assets.comCor(Assets.mon(mon.species, mon.seed), mon), 24), 16, y - 2, 24, 24);
        drawText(ctx, mon.nickname, 46, y + 2, PAL.ink);
        drawText(ctx, `N${mon.level}`, 152, y + 2, PAL.ink);
        bar(ctx, 46, y + 14, 76, 4, hpPct(mon), hpColor(hpPct(mon)));
        drawText(ctx, `${mon.hp}/${mon.maxHp}`, 130, y + 11, PAL.ink2);
        // a habilidade (src/data/habilidades.js), no lugar que sobra na linha de baixo
        const hab = habilidadeDoMon(mon);
        if (hab) drawText(ctx, hab.nome, 46, y + 11, PAL.ink2, { maxChars: 13 });
        if (mon.corrupt) drawText(ctx, "!", 200, y + 2, PAL.glitch);
        if (mon.alfa) drawText(ctx, "ALFA", 182, y + 11, "#e0242a");
        if (mon.trunfo) {                            // o TRUNFO: a estrelinha dourada
          const sx = 196, sy = y + 1;
          ctx.fillStyle = "#6b4a00";
          ctx.fillRect(sx + 2, sy, 3, 7); ctx.fillRect(sx, sy + 2, 7, 3);
          ctx.fillStyle = "#ffd23f";
          ctx.fillRect(sx + 3, sy + 1, 1, 5); ctx.fillRect(sx + 1, sy + 3, 5, 1);
          ctx.fillRect(sx + 2, sy + 2, 3, 3);
        }
      });
      drawText(ctx, "Z: TRUNFO", 12, H - 20, PAL.ink2);
      drawText(ctx, "X VOLTA", 180, H - 20, PAL.ink2);
      return;
    }
    if (m.type === "goLista") {
      panel(ctx, 4, 4, W - 8, H - 8);
      drawText(ctx, m.titulo, 12, 10, PAL.ink);
      drawText(ctx, `${m.index + 1}/${m.itens.length}`, 186, 10, PAL.ink2);
      for (let k = 0; k < GO_LISTA_VIS; k++) {
        const i = m.top + k;
        if (i >= m.itens.length) break;
        const it = m.itens[i], y = 26 + k * 18;
        if (i === m.index) cursor(ctx, 8, y + 4);
        ctx.drawImage(reduzido(Assets.comCor(Assets.mon(it.mon.species, it.mon.seed), it.mon), 20), 16, y - 3, 20, 20);
        drawText(ctx, it.rotulo, 40, y + 2, PAL.ink, { maxChars: 30 });
      }
      if (m.itens.length > GO_LISTA_VIS) {
        const th = GO_LISTA_VIS * 18 - 4;
        ctx.fillStyle = PAL.ink2; ctx.fillRect(W - 14, 26, 2, th);
        const bh = Math.max(4, th * GO_LISTA_VIS / m.itens.length);
        ctx.fillStyle = PAL.ink;
        ctx.fillRect(W - 14, 26 + (th - bh) * m.top / Math.max(1, m.itens.length - GO_LISTA_VIS), 2, bh);
      }
      drawText(ctx, "←→ PULA  X VOLTA", 96, H - 18, PAL.ink2);
      return;
    }
    if (m.type === "goDigitar") {
      const T = DB.GO_TEXTO;
      panel(ctx, 4, 4, W - 8, H - 8);
      drawText(ctx, "PUXAR DO GO", 12, 10, PAL.ink);
      const rotulos = [T.digitarEspecie, T.digitarCP, T.digitarIV];
      const curtos = ["POKÉMON", "CP", "IV A.D.PS"];
      rotulos.forEach((_, i) => {
        const y = 28 + i * 20;
        if (m.linha === i) cursor(ctx, 10, y);
        drawText(ctx, curtos[i], 20, y, PAL.ink);
        const escrevendo = Texto.ativo() && m.linha === i;
        const txt = escrevendo ? Texto.buf() + ((this.animT * 3) % 1 > 0.5 ? "_" : "") : (m.textos[i] || "---");
        drawText(ctx, String(txt).slice(0, 16), 96, y, m.textos[i] || escrevendo ? PAL.ink : PAL.ink2);
      });
      // a prévia: se já dá pra saber quem é, mostra o sprite e o nível que sai do CP
      const sp = m.textos[0] && DB.SPECIES[GoPark.especieDe(m.textos[0], m.textos[0])];
      if (sp) {
        ctx.drawImage(reduzido(Assets.mon(sp.id, 7), 28), 196, 26, 28, 28);
        const cp = Number(String(m.textos[1]).replace(/[^\d]/g, ""));
        if (cp > 0) {
          const [a, d, v] = String(m.textos[2]).split(/[.\s\/-]+/).map(Number);
          const ivs = Number.isFinite(a) ? { atk: a, def: Number.isFinite(d) ? d : a, sta: Number.isFinite(v) ? v : a } : undefined;
          drawText(ctx, `N${GoPark.nivelPorCP(sp.id, ivs, cp).level}`, 198, 56, PAL.ink2);
        }
      }
      if (m.linha === 3) cursor(ctx, 10, 96);
      drawText(ctx, "TRAZER PRO PARQUE", 20, 96, sp ? PAL.ink : PAL.ink2);
      drawText(ctx, "Z DIGITA / ESCOLHE", 20, 118, PAL.ink2);
      drawText(ctx, "SÓ A ESPÉCIE E O CP JÁ BASTAM", 20, 130, PAL.ink2);
      drawText(ctx, "X VOLTA", 20, 142, PAL.ink2);
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
          ctx.drawImage(reduzido(Assets.mon(sp.id, 7), 24), 158, y - 8, 24, 24);
          drawText(ctx, `${String(sp.dex || 0).padStart(3, "0")}`, 188, y, PAL.ink2);
        }
      });
      // a prévia: o que sai dessa dupla, mesmo sem ter nenhum dos dois
      const preview = m.ids[0] && m.ids[1] ? montarEspecie(m.ids[0], m.ids[1]) : null;
      if (preview) {
        DB.SPECIES[preview.id] = preview;
        ctx.drawImage(reduzido(Assets.mon(preview.id, 7), 40), 20, 84, 40, 40);
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
        if (sp) ctx.drawImage(reduzido(Assets.mon(sp.id, m.mon.seed), 20), 16, y - 2, 20, 20);
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
        ctx.drawImage(reduzido(Assets.mon(mon.species, mon.seed), 18), 16, y, 18, 18);
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
          ctx.drawImage(reduzido(Assets.mon(sp.id, m.cabeca.seed), 48), 164, 26, 48, 48);
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
        ctx.drawImage(reduzido(Assets.mon(escolhido.species, escolhido.seed), 48), 164, 26, 48, 48);
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
      drawText(ctx, m.next === "sell" ? "VENDER QUANTOS?" : `QUANTOS?`, 40, 72, PAL.ink2);
      drawText(ctx, `x${String(m.n).padStart(3, " ")}`, 140, 70, PAL.ink);
      if (m.price) drawText(ctx, moeda(m.price * m.n), 120, 84, PAL.ink2);
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
      // em Braglitch, as insígnias de lá; em qualquer outro lugar, as de Kanto.
      // Em Braglitch são duas páginas: os GINÁSIOS e as ILHAS entregues
      // (src/systems/ilhas.js), as duas em `st.bragBadges`
      const brag = !!this.geo?.braglitch, ilhas = brag && m.pagina === 1;
      const lista = ilhas ? DB.INSIGNIAS_ILHAS || [] : brag ? DB.INSIGNIAS_BRAG || [] : DB.STORY.badges || [];
      const tem = brag ? this.st.bragBadges || [] : this.st.badges;
      const n = lista.filter((b) => tem.includes(b.id)).length;
      panel(ctx, 4, 4, W - 8, H - 8);
      const titulo = ilhas ? "ILHAS DE BRAGLITCH" : brag ? "INSÍGNIAS DE BRAGLITCH" : "INSÍGNIAS DE KANTO";
      drawText(ctx, `${titulo}  ${n}/8`, 12, 10, PAL.ink);
      if (brag) drawText(ctx, ilhas ? "← GINÁSIOS" : "ILHAS →", 12, H - 20, PAL.ink2);
      lista.forEach((b, i) => {
        const got = tem.includes(b.id);
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
      drawText(ctx, m.titulo || "MOCHILA", 12, 10, PAL.ink);
      // Cada linha tem o ÍCONE do item (src/core/itens.js, 16x16), então a
      // linha cresceu de 11 pra 16 pixels e a lista ROLA: com os fósseis, as
      // pedras, os cristais e os ingredientes a mochila passa de cem itens, e
      // antes a lista era desenhada até sair da tela. O item da vez aparece
      // em dobro no canto, pra se ver o desenho.
      const lista = Object.entries(this.st.items);
      const PASSO = 16, JANELA = 5;
      m.top = Math.max(0, Math.min(m.top || 0, lista.length - JANELA));
      if (m.index < m.top) m.top = m.index;
      if (m.index >= m.top + JANELA) m.top = m.index - JANELA + 1;
      lista.slice(m.top, m.top + JANELA).forEach(([k, v], j) => {
        const i = m.top + j, y = 24 + j * PASSO;
        desenharItem(ctx, k, 22, y - 2);
        drawText(ctx, k.toUpperCase(), 42, y + 2, PAL.ink, { maxChars: 21 });
        const q = `x${v}`;
        drawText(ctx, q, 190 - q.length * 6, y + 2, PAL.ink);
        if (i === m.index) cursor(ctx, 12, y + 2);
      });
      if (m.top > 0) drawText(ctx, "\u2191", 182, 12, PAL.ink2);
      if (m.top + JANELA < lista.length) drawText(ctx, "\u2193", 182, 106, PAL.ink2);
      if (lista[m.index]) {
        panel(ctx, 194, 22, 40, 40);
        desenharItem(ctx, lista[m.index][0], 198, 26, 2);
      }
      drawText(ctx, m.escolher ? "Z ENTREGA   X DESISTE" : "Z USA   X VOLTA", 20, H - 42, PAL.ink2);
      if (!Object.keys(this.st.items).length) drawText(ctx, "MOCHILA VAZIA.", 24, 30, PAL.ink2);
      drawText(ctx, `DINHEIRO: ${moeda(this.st.money)}`, 20, H - 30, PAL.ink2);
      drawText(ctx, "X VOLTA", 180, H - 20, PAL.ink2);
      return;
    }
    if (m.type === "venda") {
      const JANELA = 10;
      m.top = Math.max(0, Math.min(m.top || 0, m.lista.length - JANELA));
      if (m.index < m.top) m.top = m.index;
      if (m.index >= m.top + JANELA) m.top = m.index - JANELA + 1;
      const vistos = m.lista.slice(m.top, m.top + JANELA);
      panel(ctx, 4, 4, 150, vistos.length * LINE_H + 16);
      vistos.forEach((it, k) => {
        const y = 10 + k * LINE_H;
        drawText(ctx, `${it.item.toUpperCase()}`, 20, y, PAL.ink, { maxChars: 14 });
        const p = moeda(it.price);
        drawText(ctx, p, 148 - p.length * 6, y, PAL.ink);
        if (m.top + k === m.index) cursor(ctx, 10, y);
      });
      if (m.top > 0) drawText(ctx, "\u2191", 140, 10, PAL.ink2);
      if (m.top + JANELA < m.lista.length) drawText(ctx, "\u2193", 140, 10 + (vistos.length - 1) * LINE_H, PAL.ink2);
      drawText(ctx, `Z VENDE  X SAI  X${m.lista[m.index]?.qtd || 0}`, 20, 10 + vistos.length * LINE_H, PAL.ink2);
      panel(ctx, 158, 4, 78, 22);
      drawText(ctx, "DINHEIRO", 164, 8, PAL.ink2);
      drawText(ctx, moeda(this.st.money), 164, 17, PAL.ink, { maxChars: 11 });
      if (m.lista[m.index]) {                     // o desenho do que está na mira
        panel(ctx, 158, 30, 40, 40);
        desenharItem(ctx, m.lista[m.index].item, 162, 34, 2);
      }
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
      // o painel vai até encostar no do DINHEIRO e o preço encosta na direita:
      // com ele fixo em x=110 sobravam 15 letras pro nome, e SUPER MYSTERY EGG
      // tem 17 (o "$" não tem desenho na fonte, então ele mesmo é o espaço
      // entre o nome e o número)
      panel(ctx, 4, 4, 152, vistos.length * LINE_H + 16);
      vistos.forEach((it, k) => {
        const i = m.top + k;
        const y = 10 + k * LINE_H;
        const p = `$${it.price}`;
        drawText(ctx, it.item.toUpperCase(), 20, y, PAL.ink, { maxChars: 22 - p.length });
        drawText(ctx, p, 152 - p.length * 6, y, PAL.ink);
        if (i === m.index) cursor(ctx, 10, y);
      });
      // as setinhas dizem que tem mais coisa pra cima ou pra baixo
      if (m.top > 0) drawText(ctx, "\u2191", 140, 10, PAL.ink2);
      if (m.top + JANELA < m.shop.length) drawText(ctx, "\u2193", 140, 10 + (vistos.length - 1) * LINE_H, PAL.ink2);
      drawText(ctx, `Z COMPRA  X SAI  ${m.index + 1}/${m.shop.length}`, 20, 10 + vistos.length * LINE_H, PAL.ink2);
      panel(ctx, 158, 4, 78, 22);
      drawText(ctx, "DINHEIRO", 164, 8, PAL.ink2);
      drawText(ctx, moeda(this.st.money), 164, 17, PAL.ink, { maxChars: 11 });
      if (m.shop[m.index]) {                      // o desenho do que está na mira
        panel(ctx, 158, 30, 40, 40);
        desenharItem(ctx, m.shop[m.index].item, 162, 34, 2);
      }
      return;
    }
    if (m.type === "tutorMon") {
      panel(ctx, 4, 4, W - 8, H - 8);
      drawText(ctx, DB.STORY.joy.quemMon, 12, 10, PAL.ink);
      this.st.party.forEach((mon, i) => {
        const y = 26 + i * 20;
        if (i === m.index) cursor(ctx, 8, y + 4);
        ctx.drawImage(reduzido(Assets.mon(mon.species, mon.seed), 20), 16, y - 2, 20, 20);
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
        // encolhido pelo redutor de pixel art (src/core/reduzir.js): sem ele a
        // pupila some e o bicho muda de cara
        ctx.drawImage(reduzido(Assets.comCor(Assets.mon(sel.species, sel.seed), sel), 28), 6, 126, 28, 28);
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
      // a prévia sai NA COR escolhida: o menu mostra o que vai baixar
      const cor = { species: sp.id, shiny: m.cor === 1, luminoso: m.cor === 2 };
      // 64 -> 48 pelo redutor de pixel art: desenhado direto, a escala
      // quebrada jogava fora pixel no chute e o olho de todo bicho estragava
      ctx.drawImage(reduzido(Assets.comCor(img, cor), 48), 158, 22, 48, 48);
      drawText(ctx, sp.types.join("/").slice(0, 12), 150, 74, PAL.ink2);
      drawText(ctx, `NÍVEL ${String(m.lvl).padStart(3, " ")}`, 150, 86, PAL.ink);
      drawText(ctx, ["COR: COMUM", "COR: SHINY", "COR: LUMINOSA"][m.cor], 150, 98,
        [PAL.ink2, "#d8a828", "#fff3b0"][m.cor]);
      // a ajuda em duas linhas: numa só ela passava da borda e cortava o fim
      drawText(ctx, "CIMA/BAIXO ESCOLHE  LADOS NÍVEL", 12, 132, PAL.ink2);
      drawText(ctx, "SHIFT +10  Z BAIXA  X SAI  C COR", 12, 142, PAL.ink2);
      return;
    }
    if (m.type === "aniversarioData") {
      const A = DB.ANIVERSARIO_TEXTO;
      panel(ctx, 20, 36, 200, 92);
      drawText(ctx, A.seletor, 28, 42, PAL.ink);
      const campo = (rot, val, x, ativo) => {
        drawText(ctx, rot, x + 6, 62, PAL.ink2);
        panel(ctx, x, 72, 62, 20);
        drawText(ctx, val, x + 12, 78, ativo ? PAL.glitch : PAL.ink);
        // as setinhas dizem em qual dos dois campos o cima/baixo está mexendo.
        // São ▲▼ e não ↑↓ porque a fonte do jogo só desenha esses dois
        // (src/core/font.js): a seta de linha fina sai como espaço em branco.
        if (ativo) {
          drawText(ctx, "▲", x + 46, 62, PAL.glitch);
          drawText(ctx, "▼", x + 46, 95, PAL.glitch);
        }
      };
      campo(A.dia, String(m.dia).padStart(2, "0"), 38, m.campo === 0);
      campo(A.mes, (A.meses || [])[m.mes - 1] || String(m.mes), 128, m.campo === 1);
      drawText(ctx, A.seletorAjuda, 28, 108, PAL.ink2);
      drawText(ctx, A.seletorAjuda2, 28, 118, PAL.ink2);
      return;
    }
    if (m.type === "aniversarioTipo") {
      const A = DB.ANIVERSARIO_TEXTO;
      const COLS = 3, PASSO = 17;
      panel(ctx, 8, 12, 224, 136);
      drawText(ctx, A.tituloTipo, 16, 18, PAL.ink);
      m.lista.forEach((t, i) => {
        const x = 22 + (i % COLS) * 70, y = 36 + Math.floor(i / COLS) * PASSO;
        drawText(ctx, t, x, y, DB.TYPE_COLOR?.[t] || PAL.ink);
        if (i === m.index) cursor(ctx, x - 9, y);
      });
      drawText(ctx, A.ajudaTipo, 16, 136, PAL.ink2);
      return;
    }
    if (m.type === "optsFala") {
      const linhas = this.linhasDaFala();
      panel(ctx, 20, 30, 200, linhas.length * LINE_H + 30);
      drawText(ctx, "FALA", 30, 36, PAL.glitch);
      linhas.forEach(([rot, val], i) => {
        const y = 52 + i * LINE_H;
        drawText(ctx, rot, 40, y, PAL.ink);
        drawText(ctx, val, 138, y, PAL.glitch);
        if (i === m.index) cursor(ctx, 30, y);
      });
      drawText(ctx, linhas[m.index][2].slice(0, 38), 6, 118, PAL.ink2);
      drawText(ctx, "SETAS OU Z MUDA   X VOLTA", 6, 130, PAL.ink2);
      return;
    }
    if (m.type === "opts") {
      const idioma = DB.IDIOMAS?.find((l) => l.id === Opcoes.get("idioma")) || { nome: "PORTUGUÊS" };
      const linhas = [
        ["SCANLINES", Glitch.scanlines ? "ON" : "OFF"],
        ["SOM", Audio2.muted ? "OFF" : "ON"],
        ["VELOCIDADE", this.nomeVelocidade()],
        ["IDIOMA", idioma.nome],
        [DB.ANIVERSARIO_TEXTO.rotulo, this.resumoAniversario()],
        [DB.DUPLA_TEXTO?.opcao || "BATALHA DUPLA", this.st.flags?.todasDuplas ? "ON" : "OFF"],
        ["ISOMÉTRICO", isoLigado() ? "ON" : "OFF"],
        ["FALA", "..."],
        ["LIMPAR SAVE", ""],
      ];
      // 9 linhas: o painel sobe pra dica de baixo não cair dentro dele
      panel(ctx, 30, 14, 180, linhas.length * LINE_H + 32);
      drawText(ctx, `CORRUPÇÃO: ${Math.round(this.st.corruption)}%`, 40, 20, PAL.glitch);
      linhas.forEach(([rot, val], i) => {
        const y = 36 + i * LINE_H;
        drawText(ctx, rot, 50, y, PAL.ink);
        drawText(ctx, val, 140, y, PAL.glitch);
        if (i === m.index) cursor(ctx, 40, y);
      });
      // a linha de baixo é do idioma, menos quando o cursor está no
      // aniversário: ali ela conta quanto falta pro dia
      const aviso = DB.AVISO_IDIOMA?.[Opcoes.get("idioma")];
      if (m.index === 4) drawText(ctx, this.dicaAniversario().slice(0, 38), 12, 150, PAL.glitch);
      else if (m.index === 5) drawText(ctx, (DB.DUPLA_TEXTO?.opcaoDica || "").slice(0, 38), 12, 150, PAL.glitch);
      else if (m.index === 6) drawText(ctx, "O MUNDO VISTO DE QUINA.", 12, 150, PAL.glitch);
      else if (m.index === 7) drawText(ctx, "CAIXA OU BALÃO, VELOCIDADE, SOM...", 12, 150, PAL.glitch);
      else if (aviso) drawText(ctx, aviso.slice(0, 38), 12, 150, PAL.ink2);
    }
  }
}
