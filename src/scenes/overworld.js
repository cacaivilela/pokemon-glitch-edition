// Cena do mundo. A geometria (desenho, colisão, grama, barrancos, portas e
// conexões entre mapas) vem dos mapas originais do FireRed, carregados de
// assets/maps/. Os diálogos, encontros e regras vêm de src/data/maps.js.
import { voltarDoEternamax } from "../systems/formas.js";
import { DB } from "../data/index.js";
import { fundoDe, superficieDe } from "../data/fundo-do-mar.js";
import { garantirCardume, idCardume } from "../systems/cardume.js";
import * as PosPos from "../systems/pospos.js";
import { barcoArt, roboArt } from "../core/barco.js";
import { runaDoItem, chaveRunas } from "../data/portal-paradoxo.js";
import { garantirBizarro, idBizarro, sementeDasRunas } from "../systems/bizarro.js";
import { Assets, TILE, makeCanvas } from "../core/assets.js";
import { tilePonte } from "../core/pontevinha.js";
import { CAMINHAO, desenhoCaminhao } from "../core/caminhao.js";
import { vestirQuadro, roupasDoJogador, roupasNovas, roupa } from "../systems/roupas.js";
import { ROUPAS, ROUPAS_TEXTO } from "../data/roupas.js";
import { RoupasScene } from "./roupas.js";
import { CacaFantasmaScene } from "./cacafantasma.js";
import { ReviverScene } from "./reviver.js";
import { FotosScene } from "./fotos.js";
import { CameraRealScene } from "./camerareal.js";
import { TremScene } from "./trem.js";
import { TrabalhosScene } from "./trabalhos.js";
import { tirarFoto, FOTO_TEXTO } from "../systems/fotos.js";
import { desenharCorpoMenu, desenharIcone, desenharRotomfone, LARGURA_FONE, ALTURA_FONE } from "../core/rotomfone.js";
import { CONTATOS, ROTOMFONE_TEXTO, LIGACAO_MISSINGNO } from "../data/rotomfone.js";
import { ZEROGLE } from "../data/zerogle.js";
import { SELVAGENS_3D } from "../data/selvagem3d.js";
import { pedirModelo, desenharModelo } from "../core/modelo3d.js";
import { CACA_FANTASMA } from "../data/cacafantasma.js";
import { MetasScene } from "./metas.js";
import { recadoDasMetas } from "../systems/metas.js";
import { tempoAgora, porTempo, TEMPOS } from "../systems/tempo.js";
import { roubarPixels, andarRoubo, desenharRouboChao, desenharRouboAr } from "../systems/roubopixels.js";
import { ligada as lutaLigada, podeLutar, podeLutarTreinador, comecar as comecarLuta, comecarTreinador, largarLuta, atacar as atacarNaLuta, andarLuta, atoresDaLuta, desenharLuta, emLuta, desenharMovimentoPMD } from "../systems/lutamapa.js";
import { fundirSelvagem, fundirCom, especieSurpresa, ehBasico } from "../systems/modofusao.js";
import { arvore3d, CAMADAS_NORMAL, CAMADAS_GRANDE } from "../core/arvore3d.js";
import { url } from "../core/base.js";
import { mapArt, mapArtInteira, mapOverlay, adiantarDoMapa, estatuaArt, trainerArt , arvoresDoMapa, loadImage } from "../core/sprites.js";

// OBJETOS DESENHADOS À MÃO (`sprite: "desenho"` no NPC, `desenho` = o PNG):
// o arquivo, quando chega (null carregando, false se não existe)
const DESENHOS_OBJ = new Map();
import { musicaDaBatalha } from "../systems/musicabatalha.js";
import { Input, Texto } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { tocarGrito, onomatopeias } from "../systems/gritos.js";
import { Save } from "../core/save.js";
import { Opcoes, FPS_OPCOES } from "../core/opcoes.js";
import { nivelSuave, nomeSuave, NIVEL_MAX } from "../core/suave.js";
import { panel, drawText, cursor, bar, hpColor, fade, sinal, PAL, LINE_H, moeda, ESCALA_TELA } from "../core/gfx.js";
import { Dialogue, FALA_VELOCIDADES } from "../systems/dialogue.js";
import { Online } from "../systems/online.js";
import { Net } from "../core/net.js";
import { OnlineMenuScene } from "./online.js";
import { TradeScene } from "./trade.js";
import { TrocaNpcScene } from "./trocanpc.js";
import { DescidaScene } from "./descida.js";
import { EspacoScene } from "./espaco.js";
import { EncaixeScene } from "./encaixe.js";
import { FabricaScene } from "./fabrica.js";
import { desenharArvore, updateArvore, sairDaArvore, escaparArvore, desenharGuzzlord } from "../systems/arvoreoca.js";
import { SURTO, surtoAtivo, talvezComecarSurto, textoDoSurto } from "../systems/surtos.js";
import { trocaLigaBrag, desenharLigaBrag, desenharBracosLigaBrag } from "../systems/ligabrag.js";
import { trocaLigaVoid, desenharLigaVoid } from "../systems/ligavoid.js";
import { insigniasNoCorpo, pecasDe, pecasDoTreinador, TUDO, desenharEstojo, temMeio } from "../core/insigniascorpo.js";
import { LinkBattleScene } from "./linkbattle.js";
import { GrupoBattleScene } from "./grupobattle.js";
import { HordaScene } from "./horda.js";
import { SoltarScene } from "./soltar.js";
import { NascerScene } from "./nascer.js";
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
  heal, hpPct, gainXp, xpForLevel, createMon, evolutionFor, learnableMoves, recalc, amizade, shiniesLiberados, darClarao, sortearBrilho } from "../systems/mon.js";
import { scatterDimLoot } from "../systems/loot.js";
import { chocar as chocarOvo } from "../systems/ovos.js";
import { habilidadeDoMon } from "../systems/habilidades.js";
import * as Creche from "../systems/creche.js";
import { nascer, andar, emCima, cacando, fugindo, encontroDe, chamar } from "../systems/selvagens.js";
import { distorcaoDeAgora, distorcaoAqui, ondeEla } from "../systems/distorcoes.js";
import { ZONA, naZona, entradasDoMapa, entradaEm, abrirZona, garantirZona, vaoDaZona,
         cedeu, esbarrar, alcance, tileCedido, desenharVao } from "../systems/glitchzones.js";
import { quemDesce, noTopo } from "../systems/descida.js";
import { oMaisRapido, ganhaDaBike, aindaEstao, ehMotoqueiro }
  from "../systems/motoqueiros.js";
import { montarChefe, temPortal, abrirPortal, portalAberto, fecharPortal, corrupcaoDoPortal, pertoDoPortal,
         montarChefeFixo, raidsDeEvento, chaveDaRaid, montarChefeUltra, ultraAberto, especieDaRaid, janelaAberta, shinyDoEvento } from "../systems/raid.js";
import { estrelasDoNivel, TEXTOS_EVENTO } from "../data/eventos.js";
import { desenharUnownFrase } from "../systems/unownfrase.js";
import { pedrasIniciaisDevidas } from "../systems/mega.js";
import { usarCristal, carinhoDaVitoria } from "../systems/vinculo.js";
import { estado as estadoMissao, progresso, aceitar, entregar, diario, feitas, missaoPorId, daVez }
  from "../systems/missoes.js";
import { estaNaHora, marcarFeita, fracas, apagarDoCodigo } from "../systems/faxina.js";
// O aniversário entra como namespace de propósito: ele exporta `partes` e
// `formata`, que são nomes que a fusão e o leilão também usam aqui dentro.
import * as Aniv from "../systems/aniversario.js";
import { alvoDaPedra, emBraglitch, seisLendasPegas, glitchDeVerdade, regiaoDoMapa } from "../systems/regionais.js";
import { ilhas, ilhaDoMapa, ilhaAberta, ilhaEntregue, ilhaCompleta, insigniaDaIlha, formasPegas,
         chefeVencido, todasEntregues } from "../systems/ilhas.js";
import { guardar as guardarNoBox, cheio as boxCheio, todosGuardados } from "../systems/box.js";
import { veu, temCeu, agora as horaDoMundo, ajustarRelogio } from "../systems/ciclo.js";
import { escuridaoDoLugar, ehCaverna, acesa, camadaDeLuz, brilho, RAIO } from "../systems/lanterna.js";
import { AcampamentoScene } from "./acampamento.js";
import { MineracaoScene } from "./mineracao.js";
import { TirinhaScene } from "./tirinha.js";
import { GoParkScene } from "./gopark.js";
import { SuperPawmotScene } from "./superpawmot.js";
import { CelebaScene } from "./celeba.js";
import { KartScene } from "./kart.js";
import { PaintballScene } from "./paintball.js";
import { CanhaoMaxScene, SOPA_CUSTA } from "./canhaomax.js";
import { AlcremieScene } from "./alcremie.js";
import { BaseScene } from "./base.js";
import { abrirBase, baseNaPorta, regiaoDe } from "../systems/bases.js";
import { doceDoItem, docesDoSeed, seedDosDoces, comerDoce } from "../systems/doces.js";
import { novoGiro, girar, quemGira, formaDaqui, seedDaForma } from "../systems/bebbidah.js";
import { salaPraDescer, brilhosDoDia, jaCavado, marcarCavado } from "../systems/subterraneo.js";
import { seguravel, darItem, tirarItem, descDoItem, devolvido, PEDRA_ASSOMBRADA } from "../systems/segurar.js";
import { juntavel, comPar, previaJunta, oQueGanhou, juntar } from "../systems/juntar.js";
import { abrirCaixa, falarComMaquina, maquinasNoMapa } from "../systems/pokemaquinas.js";
import { ehMaquina, golpeDaMaquina, podeAprender } from "../systems/maquinas.js";
import { MAQ_TEXTO } from "../data/maquinas.js";
import * as GoPark from "../systems/gopark.js";
import { LeilaoScene } from "./leilao.js";
import { temBarraca } from "../systems/leilao.js";
import { vendaveis } from "../systems/venda.js";
import { VENDA_TEXTO } from "../data/leilao.js";
import { quemSou, desenharPokemon, pokesaveDoSprite, acompanharEvolucao, euSei, posicionarCacador, chegarCacador, cacadorNpc, andarCacador, cacadorPerdeu, cacadorPegou, cacadorTentaBola, NOITE, idDaNoite, fugirDormindo, fugitivoAmanheceu, correrTempo, centroMaisPerto, andarNaBola, CACADOR, esfriarRaiva, RAIVA, diaDoCacador, desafiarGinasio, curarNoCentro, campeaoSolta } from "../systems/pokesave.js";
import { temVisor, explicado } from "../systems/glitchboost.js";
import { podeAcampar, fator, buff, minutosDoBuff } from "../systems/acampamento.js";
import { rivalNpc, gemeoNpc, quemEhOGemeo, montarTime } from "../systems/rival.js";
import { trancaDaLiga, recomecaLiga, ARCEUS_VITORIA, atalhoDaLiga, LIGA_ETAPAS, HALL_TEXTO } from "../data/liga-kanto.js";
import { HallDaFamaScene } from "./halldafama.js";
import { PcScene } from "./pc.js";
import { amigosNpcs } from "../systems/amigos.js";
import { eraDoMapa, erasAbertas, celebiApareceu, chaveGuardiao, acabouOTempo }
  from "../systems/eras.js";
import { ehFusao, fundivel, previsao, partes, temFicha, fichasProntas, variantes, evolucaoDaFusao, fundir, idFusao, garantirEspecie,
         buscarDoMundo, especiePorTexto, montarEspecie, servidorMundo,
         importarFicha, trocarVariante, inverterFusao, versoesInvertidas } from "../systems/fusao.js";
import { noMapa as provacoesNoMapa, estado as estadoProvacao, montarTotem,
         chaveDoTotem, pagar as pagarProvacao, aPagar as provacaoAPagar,
         falaDaGuardia, ilhaAcordou, espalhar as espalharProvacoes, montarGrupoDoTotem,
         proxima as proximaProvacao } from "../systems/provacoes.js";
import { BattleScene } from "./battle.js";
import { EvolutionScene } from "./evolution.js";
import { FusionScene } from "./fusion.js";
import { FusaoEditorScene } from "./fusaoeditor.js";
import { ConcursoScene } from "./concurso.js";
import { LiquidificadorScene } from "./liquidificador.js";
import { reduzido } from "../core/reduzir.js";
import { puloDoIcone } from "../systems/animon.js";
import { sortearDaTroca } from "../systems/trocasorteio.js";
import { CRIANCA_PRETO } from "../data/crianca-preto.js";
import { PEDRA_BUGADA } from "../data/pedra-bugada.js";
import { itensNoBolso, bolsosComItem } from "../systems/mochila.js";
import { DIFICULDADES, dificuldadeDe, mudarDificuldade } from "../systems/dificuldade.js";
import { desenharItem, adiantarItens } from "../core/itens.js";
import { BILL_CASOS, BILL_FIM } from "../data/bill-casos.js";
import { desenharGigante, desenharRegi, TEMPO_REGI, gigantePraPassar, giganteDaUrl, giganteDoItem, ehImenso, GIGANTES, FASES,
         tem3D, desenharParado, desenharSolto, altura3D,
         temMontaria3D, desenharMontaria, GIRO_DA_DIRECAO,
         voaSemGolpe, temNado3D, desenharNadando } from "../core/gigante3d.js";
import { isoLigado, alternarIso, origem, naTela, noChao, coluna, tilesVisiveis, relevo, chaoEm, vistaIso, espelhar, sombra, comEspessura, fontesDoTeto } from "../core/isometrico.js";

const W = 240, H = 160;
/** Quanto dura a entrada de cada tipo de batalha (ver `entrarEmBatalha`). */
const ENTRADA = { selvagem: 1.15, treinador: 1.7, chefe: 1.8 };
/** Linhas visíveis na lista do GO PARK (a box inteira cabe nela, rolando). */
const GO_LISTA_VIS = 6;
const rumoDoSelvagem = new WeakMap();   // selvagem -> { x, y, dir } do último passo (isométrico)
// OS BALÕES do companheiro (src/data/companheiro.js): 7x7, desenhados pixel a
// pixel — a fonte do jogo não tem nota nem reticências
const EMOTES = {
  "♥": [" ## ## ", "#######", "#######", " ##### ", "  ###  ", "   #   ", "       "],
  "♪": ["   ### ", "   # ##", "   #   ", "   #   ", " ###   ", "####   ", " ##    "],
  "!": ["   #   ", "   #   ", "   #   ", "   #   ", "   #   ", "       ", "   #   "],
  "?": [" ##### ", "##   ##", "    ## ", "   ##  ", "   #   ", "       ", "   #   "],
  "…": ["       ", "       ", "       ", "       ", "       ", "       ", "# # # "],
  "Z": ["       ", "#######", "    ## ", "   ##  ", "  ##   ", " ##    ", "#######"],
};
const COR_EMOTE = { "♥": "#e0304a", "♪": "#3a6fd0", "!": "#d04020", "?": "#3a6fd0", "…": "#505868", "Z": "#505868" };
const T_SELFIE = () => FOTO_TEXTO.selfie;
// O MENU ROTOMFONE: quantos ícones por linha
const COLUNAS_FONE = 3;

/** o balão: branco com borda escura e a pontinha embaixo, entrando com um "pop" */
function desenharEmote(ctx, emote, x, y, t = 1) {
  const m = EMOTES[emote] || EMOTES["!"];
  const sobe = t < 0.15 ? Math.round((1 - t / 0.15) * 4) : 0;
  const bx = x - 5, by = y + sobe;
  ctx.fillStyle = "#283040";
  ctx.fillRect(bx, by, 13, 11);
  ctx.fillRect(bx + 3, by + 11, 3, 2);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(bx + 1, by + 1, 11, 9);
  ctx.fillRect(bx + 4, by + 10, 1, 2);
  ctx.fillStyle = COR_EMOTE[emote] || "#283040";
  m.forEach((linha, j) => {
    for (let i = 0; i < linha.length; i++) if (linha[i] === "#") ctx.fillRect(bx + 3 + i, by + 2 + j, 1, 1);
  });
}
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
/** O caminho a pé de `a` até `b` ([x, y]) no mapa `g`, em tiles, de `b` pra
 *  trás (chão, mato e ressalto contam como passagem; as pontas podem ser uma
 *  porta ou escada). Vazio quando não tem como chegar. É o rastro das
 *  células do ZYGARDE. */
function caminhoNoMapa(g, a, b) {
  const L = g.w, fim = b[1] * L + b[0], ini = a[1] * L + a[0];
  const passa = (x, y) => {
    if (x < 0 || y < 0 || x >= g.w || y >= g.h) return false;
    if (y * L + x === fim) return true;
    const t = g.tags.charCodeAt(y * L + x) - 48;
    return t === 0 || t === 2 || (t >= 4 && t <= 7);
  };
  const de = new Int32Array(g.w * g.h).fill(-1), fila = [ini];
  de[ini] = ini;
  for (let k = 0; k < fila.length && de[fim] < 0; k++) {
    const i = fila[k], x = i % L, y = (i / L) | 0;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy, j = ny * L + nx;
      if (passa(nx, ny) && de[j] < 0) { de[j] = i; fila.push(j); }
    }
  }
  if (de[fim] < 0) return [];
  const out = [];
  for (let i = fim; i !== ini; i = de[i]) out.push([i % L, (i / L) | 0]);
  return out;
}

// a cena das formas do ZYGARDE (`andarZygarde`): as células chegando, a forma
// de agora ficando branca, a nova crescendo, e a corrida de quando ele foge
const TEMPO_ZYG = { junta: 2.2, nucleo: 0.8, cresce: 1.0, fim: 4.0, foge: 1.2 };
// `?rayquazasolto=1`: o primeiro selvagem da fenda é o RAYQUAZA (`sortearSelvagem`)
let rayquazaDaUrl = (() => { try { return new URLSearchParams(location.search).has("rayquazasolto"); } catch { return false; } })();
// O MEIO PASSO: quantos tiles dura um passo da animação de andar
// (meio → passo → meio → parado). Maior = perna mais devagar.
const ANDAR_TILES = 2;
// tempos do FireRed, contados em quadros (o loop roda fixo em 60fps):
// 16 quadros por tile andando, 8 correndo, 6 pra virar no lugar.
const WALK = 16, RUN = 8, TURN = 6, HOP = 20;
// as DISTORÇÕES ESPAÇO-TEMPO (src/systems/distorcoes.js) estão desligadas
const DISTORCOES_TIRADAS = true;
// A TROCA DA SALA DA LIGA (segundos): o líder sai, o chão cai, o novo sobe, pisca, acaba
// A TROCA DA SALA (segundos): o líder sai, os pilares descem, a sala se
// desmonta (teto, chão, paredes), pisca, se remonta como a nova (paredes, chão,
// teto), o próximo chega e os pilares sobem
const LIGA_TROCA = { sai: 1.0, desce: 1.0, desmontaTeto: 1.7, desmontaChao: 2.2, desmontaParedes: 3.3, pisca: 4.0,
  montaParedes: 4.4, montaChao: 5.5, montaTeto: 7.4, chega: 8.3, sobe: 9.7, fim: 10.8 };
// A ENTRADA NA SALA: o vazio, sobe a pokébola, sobe o chão, a LORELEI chega
// "é só uma sala holográfica sem nada, aí aparece as paredes, depois a bola,
// depois o resto do chão, depois os pilares de cubos de gelo, depois aquele
// teto na entrada, depois a lorelei" (CAIO, nov/2026)
const LIGA_ENTRADA = { paredes: 2.0, bola: 3.3, chao: 4.2, teto: 6.1, chega: 7.1, pilares: 8.5, fim: 9.6 };
// Quantos quadros aquele passo leva, já com a VELOCIDADE das opções. O jogo
// roda travado em 60fps: andar mais rápido é dar o passo em menos quadros, não
// acelerar o relógio. Nunca menos de 2 quadros — abaixo disso o passo some e o
// jogador teleporta de tile em tile.
const passo = (base) => Math.max(2, Math.round(base / (Opcoes.get("velocidade") || 1)));
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
// TAMANHO REAL FORA DA BATALHA (pedido do CAIO: "wailord fica de tamanho real
// selvagem fora de batalha ou fora da bola"): a largura em pixels no mapa. O
// herói tem uns 1,6 m em 26 px, ou seja ~16 px por metro: o WAILORD (14,5 m) dá 232.
const TAMANHO_REAL = { wailord: 232 };
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


// O VISOR DE CARDUMES na cara do herói: as grades são da altura dos olhos
// (8 pixels abaixo do topo do desenho), pixel por pixel, nas três vistas — de
// lado é a mesma grade espelhada pra direita. k = armação, c = lente, C = o
// reflexo correndo, g = a alça.
const VISOR = "visor de cardumes";
const VISOR_FRENTE = [
  "...kkkkkkkkkk...",
  "..gkcccccccckg..",
  "...kkkkkkkkkk...",
];
const VISOR_LADO = [
  "..kkkkkk........",
  ".kccccckgggg....",
  "..kkkkkk........",
];
const VISOR_COSTAS = [
  "................",
  "..gggggkkggggg..",
  "................",
];
const COR_VISOR = { k: "#14283a", c: "#38d8f0", C: "#e8ffff", g: "#4a4a5a" };
const topos = new WeakMap();
/** a primeira linha com desenho do quadro (pra achar a altura dos olhos) */
function topoDoQuadro(img) {
  if (topos.has(img)) return topos.get(img);
  let top = -1;
  try {
    const c = document.createElement("canvas");
    c.width = img.width; c.height = img.height;
    const x = c.getContext("2d");
    x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, img.width, img.height).data;
    for (let y = 0; y < img.height && top < 0; y++) for (let i = 0; i < img.width; i++) if (d[(y * img.width + i) * 4 + 3] > 0) { top = y; break; }
  } catch { top = 12; }
  topos.set(img, top);
  return top;
}


/** A LAMA RACHADA do PÓS-PÓS-GAME (onde o mar de Kanto secou): a cor de barro
 *  e as rachaduras, sempre as mesmas pro mesmo tile */
function desenharLama(ctx, x, y, tx, ty) {
  ctx.fillStyle = "#a07850";
  ctx.fillRect(x, y, TILE, TILE);
  let h = (tx * 374761393 + ty * 668265263) >>> 0;
  const r = () => ((h = (h * 1103515245 + 12345) >>> 0) / 4294967296);
  ctx.fillStyle = "#b8905e";
  for (let k = 0; k < 6; k++) ctx.fillRect(x + ((r() * 15) | 0), y + ((r() * 15) | 0), 2, 1);
  ctx.fillStyle = "#6a4a2e";
  // duas rachaduras tortas
  for (let k = 0; k < 2; k++) {
    let px = x + ((r() * 14) | 0), py = y + ((r() * 14) | 0);
    for (let i = 0; i < 7; i++) {
      ctx.fillRect(px, py, 1, 1);
      px += r() < 0.5 ? 1 : -1; py += r() < 0.6 ? 1 : 0;
      if (px < x || px >= x + TILE || py >= y + TILE) break;
    }
  }
}


/** O PORTAL PARADOXO no mapa: um redemoinho em pé, girando, com faíscas */
function desenharPortal(ctx, x, y, t) {
  const cx = x + 8, cy = y + 2;
  for (let k = 0; k < 4; k++) {
    const r = 11 - k * 2.5, a0 = t * (2 + k) * (k % 2 ? -1 : 1);
    ctx.strokeStyle = ["#b455ff", "#00ffcc", "#ff0066", "#ffffff"][k];
    ctx.lineWidth = k === 3 ? 1 : 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 0.7, r, 0, a0, a0 + Math.PI * 1.4);
    ctx.stroke();
  }
  ctx.fillStyle = "#0a0614";
  ctx.beginPath(); ctx.ellipse(cx, cy, 2.5, 4, 0, 0, Math.PI * 2); ctx.fill();
  for (let k = 0; k < 6; k++) {
    const a = t * 3 + k, r = 9 + Math.sin(t * 5 + k) * 3;
    ctx.fillStyle = k % 2 ? "#00ffcc" : "#ffd166";
    ctx.fillRect(Math.round(cx + Math.cos(a) * r * 0.7), Math.round(cy + Math.sin(a) * r), 1, 1);
  }
}

/** Uma RUNA (src/data/portal-paradoxo.js): o símbolo 7x7 na cor dela, em `e`
 *  vezes o tamanho, pulsando de leve */
function desenharRuna(ctx, id, x, y, e, t) {
  const R = DB.RUNAS?.[id];
  if (!R) return;
  ctx.globalAlpha = 0.85 + 0.15 * Math.sin(t * 4 + x);
  ctx.fillStyle = R.cor;
  R.desenho.forEach((linha, j) => {
    for (let i = 0; i < linha.length; i++) if (linha[i] === "#") ctx.fillRect(x + i * e, y + j * e, e, e);
  });
  ctx.globalAlpha = 1;
}

// o ALFA fora da pokébola (companheiro, montaria): do tamanho do alfa selvagem no mapa
const ALFA_FORA = 1.35;

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
    this.sairDaIlhaSemSaida();
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
  /** PRESO NUMA ILHA SEM SAÍDA: o pedaço de chão onde você está não tem porta,
   *  nem beirada que leve a outro mapa, e ninguém da equipe surfa nem voa (foi
   *  assim que alguém ficou preso na ilhinha da ROTA 21, embaixo de PALLET).
   *  Aí você volta pro último Centro Pokémon (ou pra PALLET). */
  sairDaIlhaSemSaida() {
    const p = this.st.player, g = this.geo;
    if (!g || this.st.surfando || this.st.voando || this.st.noPreto || p.map === ZONA || this.map?.interior) return;
    if (this.quemSabe("surfar") || this.quemSabe("voar") || euSei(this.st, "voar")) return;
    // NO ESPAÇO (e na BASE ESPACIAL) a saída é o FOGUETE, não porta nem beirada
    // ...e na DIMENSÃO LITERARTE a saída é a TOCA DO COELHO
    if (String(p.map).startsWith("espaco") || p.map === "ceu_nuvens" || this.npcsHere().some((n) => n.foguete || n.voltaBaseEspacial || n.voltaNuvens || n.sprite === "toca")) return;
    const pisa = (x, y) => [DB.TAG.FREE, DB.TAG.GRASS].includes(this.tagAt(x, y));
    if (!pisa(p.x, p.y)) return;
    const visto = new Set([`${p.x},${p.y}`]), fila = [[p.x, p.y]];
    let saida = false;
    while (fila.length && !saida && visto.size < 4000) {
      const [x, y] = fila.pop();
      if (this.warpAt(x, y)) { saida = true; break; }
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= g.w || ny >= g.h) {
          // a beirada: é saída se tem mapa do outro lado e lá dá pra pisar
          const dir = dx > 0 ? "right" : dx < 0 ? "left" : dy > 0 ? "down" : "up";
          const c = (g.connections || []).find((k) => k.dir === dir && k.to && DB.KANTO[k.to]);
          if (c) {
            const d = DB.KANTO[c.to];
            let tx = x, ty = y;
            if (dir === "up") { ty = d.h - 1; tx = x - c.offset; } else if (dir === "down") { ty = 0; tx = x - c.offset; }
            else if (dir === "left") { tx = d.w - 1; ty = y - c.offset; } else { tx = 0; ty = y - c.offset; }
            const t = tx >= 0 && ty >= 0 && tx < d.w && ty < d.h ? d.tags.charCodeAt(ty * d.w + tx) - 48 : 1;
            if (t === DB.TAG.FREE || t === DB.TAG.GRASS) { saida = true; break; }
          }
          continue;
        }
        const k = `${nx},${ny}`;
        if (visto.has(k)) continue;
        if (this.warpAt(nx, ny)) { saida = true; break; }
        const t = this.tagAt(nx, ny);
        if (t === DB.TAG.FREE || t === DB.TAG.GRASS || DB.LEDGE_DIR[t]) { visto.add(k); fila.push([nx, ny]); }
      }
    }
    if (saida || visto.size >= 4000) return;
    const volta = this.st.respawn && DB.MAPS[this.st.respawn.map] ? this.st.respawn : { map: "pallet", ...DB.MAPS.pallet.spawn };
    console.warn(`[mapa] preso numa ilha sem saída em ${p.map} (${p.x},${p.y}); voltando pra ${volta.map}`);
    p.map = volta.map; p.x = volta.x; p.y = volta.y; p.dir = volta.dir || "down";
    this.sub = { x: 0, y: 0 };
    this.mapaVisto = p.map;
    mapArt(p.map);
    this.snapCamera();
    this.dlg.say("VOCÊ ESTAVA PRESO NUM LUGAR SEM SAÍDA. UM BARCO DE PESCA TE TROUXE DE VOLTA!");
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
    if (this.gigante?.mon) this.voltouDoGigante();
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
    // a FONTE DE CELADON seca (o botão escondido): o meio dela, com a escada, dá pra pisar
    const F = DB.FONTE_CELADON;
    if (t === DB.TAG.BLOCK && F && x === F.escada.x && y === F.escada.y && this.st.player.map === F.mapa && this.fonteSeca()) return DB.TAG.FREE;
    // mato que você já cortou com CORTE não volta a crescer
    if (t === DB.TAG.GRASS && this.cortados().includes(`${x},${y}`)) return DB.TAG.FREE;
    // a PONTE DE VINHA (ENERGIA DA NATUREZA) em cima da água: dá pra pisar
    if (t === DB.TAG.WATER && this.pontesAqui().has(`${x},${y}`)) return DB.TAG.FREE;
    // o que abriu durante o jogo (barreira dos fios, porta do quiz) vira chão
    if (t === DB.TAG.BLOCK && this.tileLiberado(`${x},${y}`)) return DB.TAG.FREE;
    // O PÓS-PÓS-GAME (src/systems/pospos.js): KANTO SECOU — onde era mar é lama,
    // e na ROTA 20 a ILHA DA RUÍNA subiu (os pilares seguram, o resto é chão)
    if (this.posPosSeco) {
      const ilha = this.posPosIlha;
      if (ilha && x >= ilha.x && y >= ilha.y && x < ilha.x + ilha.w && y < ilha.y + ilha.h) {
        return ilha.pilar(x, y) ? DB.TAG.BLOCK : DB.TAG.FREE;
      }
      if (t === DB.TAG.WATER) return DB.TAG.FREE;
    }
    return t;
  }

  cortados() { return this.st.cortado?.[this.st.player.map] || []; }

  // ------------------------------------------------------- AS ROUPAS
  /** pergunta se quer comprar e compra */
  venderRoupa(r, depois) {
    const T = ROUPAS_TEXTO;
    this.dlg.ask(T.npcOferece(r), ["COMPRAR", "NÃO"], (i) => {
      if (i !== 0) return void depois?.();
      if ((this.st.money || 0) < r.preco) return void this.dlg.say(T.semDinheiro);
      this.st.money -= r.preco;
      (this.st.roupas ||= {})[r.id] = true;
      Audio2.heal();
      this.game.autosave?.(true);
      this.dlg.say(T.comprou(r));
    });
  }

  /** A LOJA DE ROUPAS de CELADON: as `loja` que você ainda não tem */
  lojaDeRoupas(npc) {
    const T = ROUPAS_TEXTO;
    const lista = ROUPAS.filter((r) => r.loja && !this.st.roupas?.[r.id]);
    if (!lista.length) return void this.dlg.say(T.lojaVazia);
    this.dlg.say(npc.lines?.length ? npc.lines : T.lojaOi, () => this.dlg.ask(T.lojaOi,
      [...lista.map((r) => `${r.nome} $${r.preco}`), "SAIR"], (i) => {
        const r = lista[i];
        if (!r) return;
        if ((this.st.money || 0) < r.preco) return void this.dlg.say(T.semDinheiro);
        this.st.money -= r.preco;
        (this.st.roupas ||= {})[r.id] = true;
        Audio2.heal();
        this.game.autosave?.(true);
        this.dlg.say(T.comprou(r));
      }));
  }

  /** ganhou a insígnia: avisa da roupa do líder (uma vez) */
  avisarRoupasNovas() {
    if (this.dlg.active || this.menu) return false;
    // (uma vez por partida aberta) A FUSÃO QUE GANHOU NOME NOVO: quem ainda tem o
    // nome velho da conta (o MUBCHOO, o "PIDGEY" do PIDOVE) passa pro novo
    if (!this._nomesFusao) {
      this._nomesFusao = true;
      const conta = DB.FUSAO;
      for (const m of [...(this.st.party || []), ...(this.st.box || [])]) {
        const sp = DB.SPECIES[m?.species], pt = sp?.fusao && partes(m.species);
        if (!pt || pt.pernas || !conta?.nome) continue;
        const velho = conta.nome(DB.SPECIES[pt.cabeca]?.name || "", DB.SPECIES[pt.corpo]?.name || "");
        if (m.nickname === velho && sp.name !== velho) m.nickname = sp.name;
      }
    }
    // a BOLA DO CARVALHO saiu do jogo: quem ganhou fica com POKÉ BOLAS no lugar
    if (this.st.items?.["bola do carvalho"]) {
      this.st.items["poké bola"] = (this.st.items["poké bola"] || 0) + this.st.items["bola do carvalho"];
      delete this.st.items["bola do carvalho"];
    }
    const novas = roupasNovas(this.st);
    if (!novas.length) return false;
    this.st.roupasAvisadas ||= {};
    for (const r of novas) this.st.roupasAvisadas[r.id] = true;
    Audio2.heal();
    this.dlg.say(novas.flatMap((r) => ROUPAS_TEXTO.ganhou(r)));
    return true;
  }

  // ------------------------------------------------------- O VENTO
  // A IA DO VENTO (pedido do CAIO: "muda de direção, muda com o lugar, outras
  // coisas que vc cria"). Ele tem uma DIREÇÃO que vira devagar de tempos em
  // tempos, uma FORÇA em rajadas, e o LUGAR muda o quanto ele sopra.

  /** o quanto venta NESTE MAPA: rota aberta 1; beira d'água e montanha mais;
   *  cidade menos; floresta quase nada (as árvores seguram) */
  ventoDoLugar() {
    const id = this.st.player.map;
    if (this._ventoLugar?.id === id) return this._ventoLugar.k;
    const g = this.geo, nome = String(id) + " " + String(this.map?.name || "");
    let k = /route|rota/i.test(nome) ? 1 : 0.6;
    if (/forest|floresta|mata/i.test(nome)) k = 0.3;
    if (/mt_|monte|mount|victory|serra/i.test(nome)) k = 1.35;
    // DENTRO DE TÚNEL E CAVERNA o vento é coisa RARA (pedido do CAIO): fica 0, e
    // de vez em quando passa uma lufada (ver `forcaVento`)
    if (this.map?.caverna || this.map?.music === "cave") k = 0;
    if (g?.tags) {
      let agua = 0;
      for (let i = 0; i < g.tags.length; i++) if (g.tags.charCodeAt(i) - 48 === DB.TAG.WATER) agua++;
      if (agua / g.tags.length > 0.3) k = Math.max(k, 1.25);      // praia, mar aberto
    }
    this._ventoLugar = { id, k };
    return k;
  }

  /** a direção agora (dx, dy): vira devagar pra um rumo novo a cada 20-40 s */
  rumoDoVento() {
    const t = performance.now() / 1000;
    if (this._ventoAng == null) { this._ventoAng = 0; this._ventoAlvo = 0; this._ventoTroca = t + 20; this._ventoT = t; }
    if (t > this._ventoTroca) {
      const rumos = [0, 0.35, -0.35, Math.PI, Math.PI - 0.35, Math.PI + 0.35];
      this._ventoAlvo = rumos[Math.floor(Math.random() * rumos.length)];
      this._ventoTroca = t + 20 + Math.random() * 20;
    }
    const dt = Math.min(0.1, t - this._ventoT); this._ventoT = t;
    let d = this._ventoAlvo - this._ventoAng;
    d = ((d + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
    this._ventoAng += d * Math.min(1, dt * 0.4);           // vira em uns segundos, sem tranco
    return { dx: Math.cos(this._ventoAng), dy: Math.sin(this._ventoAng) * 0.6 };
  }

  /** a força do vento agora (0 a 1, mais no temporal e no tornado): as rajadas
   *  vezes o lugar vezes o TEMPO (src/systems/tempo.js) */
  forcaVento() {
    const t = performance.now() / 1000;
    if (this.map?.caverna || this.map?.music === "cave") {
      // a lufada rara do túnel: 4 segundos a cada minuto e meio
      const k = (t % 90) / 4;
      return k < 1 ? 0.8 * Math.sin(k * Math.PI) : 0;
    }
    const r = Math.max(0, 0.45 + 0.35 * Math.sin(t * 0.37) + 0.2 * Math.sin(t * 1.13));
    const tempo = temCeu(this.map) ? (TEMPOS[tempoAgora(this.st)]?.vento ?? 1) : 1;
    return Math.min(1.8, r * this.ventoDoLugar() * tempo);
  }
  /** o vento NAS CAMADAS da árvore da coluna `x` (src/core/arvore3d.js):
   *  `forca` = quanto o topo vai pro lado (px, com o lado do vento), `fase` = a onda */
  ventoDaArvore(x) {
    if (!temCeu(this.map)) return null;
    const t = performance.now() / 1000, f = this.forcaVento(), { dx } = this.rumoDoVento();
    return { forca: (f * 3.2 + Math.sin(t * 1.7 + x * 0.9) * (0.5 + f)) * dx, fase: (t * 2.6 + x * 0.7) * 8 / (Math.PI * 2) };
  }
  /** quanto a árvore da coluna `x` se inclina (em degraus de 8 px): a rajada + o balanço dela, pro lado do vento */
  ventoNa(x) {
    if (!temCeu(this.map)) return 0;
    const t = performance.now() / 1000, f = this.forcaVento(), { dx } = this.rumoDoVento();
    return (f * 2 + Math.sin(t * 2.3 + x * 0.9) * (0.6 + f)) * dx;
  }
  /** AS FOLHAS VOANDO (pedido do CAIO): ao ar livre, umas folhinhas atravessam a
   *  tela com o vento — mais rajada, mais folha e mais rápida */
  drawFolhas(ctx) {
    const agora = performance.now();
    const dt = Math.min(0.05, ((agora - (this._folhasT || agora)) / 1000)); this._folhasT = agora;
    const fora = !temCeu(this.map) || this.map?.interior || this.map?.submerso || this.map?.ciber;
    this.folhas ||= [];
    const f = this.forcaVento(), rumo = this.rumoDoVento();
    // É O VENTO QUE SOLTA (pedido do CAIO): a folha sai de uma COPA na tela, e
    // só quando venta — na rajada forte, muitas; no vento fraco, quase nenhuma
    const copas = (this._copasNaTela || []).filter((c) => c.x > -30 && c.x < 250 && c.y > -30 && c.y < 140);
    if (!fora && copas.length && this.folhas.length < 30 && Math.random() < dt * Math.max(0, f - 0.25) * (4 + copas.length * 0.6)) {
      const cores = this.geo?.braglitch ? ["#4fa83a", "#8bd44a", "#e0b030", "#c86a20"] : ["#58b048", "#90d860", "#e8c040", "#d07830"];
      const c = copas[Math.floor(Math.random() * copas.length)];
      this.folhas.push({ x: c.x + Math.random() * c.w, y: c.y + 4 + Math.random() * 16, vx: 0, vy: 0,
                         fase: Math.random() * 6, cor: cores[Math.floor(Math.random() * cores.length)] });
    }
    for (const fo of this.folhas) {
      fo.fase += dt * 7;
      // o vento leva: a velocidade pra direita vai atrás da força dele; sem vento ela cai devagar
      fo.vx += ((15 + f * 90) * rumo.dx - fo.vx) * Math.min(1, dt * 2);
      fo.vy += ((10 + (1 - f) * 14) + rumo.dy * f * 50 - fo.vy) * Math.min(1, dt * 2);
      // perto do TORNADO, a folha é sugada e gira em volta dele
      const tt = this._tornadoTela;
      if (tt && this.tornado && this.st.tempo && (this.st.tempo.tipo === "tornado" || this.st.tempo.comTornado)) {
        const ddx = tt.x - fo.x, ddy = tt.y - fo.y, dd = Math.hypot(ddx, ddy) || 1;
        if (dd < Math.min(600, 170 * ((this.tornado?.tam || 290) / 290))) { fo.vx += (ddx / dd * 120 - ddy / dd * 160) * dt; fo.vy += (ddy / dd * 120 + ddx / dd * 160 - 60) * dt; }
      }
      fo.x += fo.vx * dt; fo.y += (fo.vy + Math.sin(fo.fase) * 18) * dt;
      ctx.fillStyle = fo.cor;
      const x = Math.round(fo.x), y = Math.round(fo.y);
      // girando: deitada (3x1), de lado (1x2) ou de frente (2x2)
      const g = Math.floor(fo.fase) % 3;
      if (g === 0) ctx.fillRect(x, y, 3, 1); else if (g === 1) ctx.fillRect(x + 1, y - 1, 1, 2); else ctx.fillRect(x, y, 2, 2);
    }
    this.folhas = this.folhas.filter((fo) => fo.x > -20 && fo.x < 260 && fo.y > -30 && fo.y < 170 && !fora);
    const caverna = this.map?.caverna || this.map?.music === "cave";
    this.drawRastroVento(ctx, dt, f, fora && !caverna, rumo);
    this.drawTempo(ctx, dt, f, rumo);
    this.matoNoVento(ctx, dt, f, fora);
  }

  /** O RASTRO DO VENTO (pedido do CAIO): fiozinhos brancos que atravessam a tela
   *  na rajada, com uma voltinha no meio — a cabeça anda e o rabo vem apagando */
  drawRastroVento(ctx, dt, f, fora, rumo) {
    this.ventos ||= [];
    const { dx, dy } = rumo, n = Math.hypot(dx, dy) || 1, ux = dx / n, uy = dy / n, px = -uy, py = ux;
    if (!fora && f > 0.55 && this.ventos.length < 4 && Math.random() < dt * (f - 0.5) * 6) {
      // nasce na beirada de onde o vento VEM
      const x0 = ux >= 0 ? -20 : 260, y0 = 10 + Math.random() * 100;
      this.ventos.push({ s: 0, x0, y0, v: 90 + f * 80, t: 0, laco: 0.35 + Math.random() * 0.3, pts: [] });
    }
    for (const w of this.ventos) {
      w.t += dt;
      const naVolta = w.t > w.laco && w.t < w.laco + 0.45;
      const k = naVolta ? (w.t - w.laco) / 0.45 : 0;
      w.s += w.v * dt * (naVolta ? 0.35 : 1);
      // na direção do vento (s) e de lado (p): a ondinha e a volta
      const along = w.s + (naVolta ? Math.sin(k * Math.PI * 2) * 7 : 0);
      const lado = Math.sin(w.s / 26 * 0.35) * 3 + (naVolta ? -(1 - Math.cos(k * Math.PI * 2)) * 6 : 0);
      w.pts.push([w.x0 + ux * along + px * lado, w.y0 + uy * along + py * lado]);
      if (w.pts.length > 26) w.pts.shift();
      for (let i = 1; i < w.pts.length; i++) {
        ctx.globalAlpha = (i / w.pts.length) * 0.7;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(Math.round(w.pts[i][0]), Math.round(w.pts[i][1]), 1, 1);
        const [ax, ay] = w.pts[i - 1], [bx, by] = w.pts[i];
        if (Math.abs(bx - ax) > 1.5 || Math.abs(by - ay) > 1.5) ctx.fillRect(Math.round((ax + bx) / 2), Math.round((ay + by) / 2), 1, 1);
      }
      ctx.globalAlpha = 1;
    }
    this.ventos = this.ventos.filter((w) => { const p = w.pts[0]; return p && p[0] > -30 && p[0] < 270 && p[1] > -30 && p[1] < 180 && !fora; });
  }

  /** O TEMPO NA TELA: sol forte, ventania, chuva, temporal (com raio), tornado, neblina */
  drawTempo(ctx, dt, f, rumo) {
    this._tornadoTela = null;
    if (!temCeu(this.map) || this.map?.ciber || this.st.player.map === "ceu_nuvens") return;
    const tipo = tempoAgora(this.st), t = performance.now() / 1000;
    if (tipo !== this._tempoVisto) {
      // trocou: avisa uma vez (só quando muda, não toda vez que entra no mapa)
      if (this._tempoVisto && tipo !== "limpo") this.avisoTempo = { txt: TEMPOS[tipo].nome + "!", t: 2.5 };
      this._tempoVisto = tipo;
    }
    if (tipo === "sol") {
      ctx.fillStyle = `rgba(255,214,110,${0.13 + 0.03 * Math.sin(t * 0.8)})`; ctx.fillRect(0, 0, W, H);
      // os raios de sol, inclinados, entrando por cima
      for (let k = 0; k < 3; k++) {
        ctx.fillStyle = `rgba(255,250,200,${0.08 + 0.05 * Math.sin(t * 0.6 + k * 2)})`;
        const x = 30 + k * 70 + Math.sin(t * 0.2 + k) * 10;
        ctx.beginPath(); ctx.moveTo(x, -10); ctx.lineTo(x + 22, -10); ctx.lineTo(x - 30, H + 10); ctx.lineTo(x - 60, H + 10); ctx.fill();
      }
    } else if (tipo === "nublado") {
      ctx.fillStyle = "rgba(60,70,95,0.16)"; ctx.fillRect(0, 0, W, H);
      // a sombra das nuvens passando no chão, com o vento — na rajada elas CORREM
      this._nuvemX = (this._nuvemX || 0) + dt * (10 + f * f * 40) * rumo.dx;
      // NUVEM CORRENDO = FURACÃO CHEGANDO (pedido do CAIO): com o vento forte, a
      // ventania pode virar TORNADO — quanto mais rápido elas correm, mais chance
      // (no vento mais forte, ~1 a cada 2 minutos; com brisa, quase nunca)
      if (f > 1.1 && Math.random() < dt * (f - 1.1) * 0.012) {
        porTempo(this.st, "tornado", 3 + Math.random() * 2);
        this.tornadoEspera = 2;
      }
      for (let k = 0; k < 3; k++) {
        const x = ((k * 140 + this._nuvemX) % 420 + 420) % 420 - 90, y = 20 + k * 45;
        ctx.fillStyle = "rgba(30,35,55,0.16)"; ctx.beginPath(); ctx.ellipse(x, y, 70, 26, 0, 0, Math.PI * 2); ctx.fill();
      }
    } else if (tipo === "chuva" || tipo === "temporal") {
      const forte = tipo === "temporal";
      ctx.fillStyle = forte ? "rgba(20,25,50,0.32)" : "rgba(30,40,70,0.18)"; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = forte ? "rgba(190,210,255,0.6)" : "rgba(200,225,255,0.5)"; ctx.lineWidth = 1;
      const n = forte ? 150 : 80, incl = rumo.dx * (1.5 + f * 3);
      ctx.beginPath();
      for (let k = 0; k < n; k++) {
        const x = ((k * 37.7 + t * 40 * rumo.dx + t * incl * 30) % (W + 40) + W + 40) % (W + 40) - 20;
        const y = ((k * 53.3 + t * (forte ? 340 : 260)) % (H + 20)) - 10;
        ctx.moveTo(x, y); ctx.lineTo(x + incl, y + 7);
      }
      ctx.stroke();
      // os pinguinhos batendo no chão
      ctx.fillStyle = "rgba(220,235,255,0.6)";
      for (let k = 0; k < (forte ? 14 : 8); k++) {
        const fase = (t * 3 + k * 0.37) % 1;
        if (fase < 0.25) ctx.fillRect(Math.round((k * 61.7 + Math.floor(t * 3 + k * 0.37) * 23) % W), Math.round((k * 29.1 + Math.floor(t * 3 + k * 0.37) * 41) % H), 2, 1);
      }
      // NO TEMPORAL O TORNADO É COMUM (pedido do CAIO): em 2 de cada 3 temporais tem um
      if (forte) {
        if (this.st.tempo && this.st.tempo.comTornado == null) this.st.tempo.comTornado = Math.random() < 0.5;
        if (this.st.tempo?.comTornado) this.desenharTornado(ctx, t, dt, f, rumo);
        // O RAIO: de vez em quando a tela acende, e o trovão chega logo depois
        this.raioT = (this.raioT ?? 3) - dt;
        if (this.raioT <= 0) {
          this.raioT = 4 + Math.random() * 6; this.raioClarao = 1;
          setTimeout(() => { Audio2.noise?.(1.1, 0.7); Audio2.tone(48, 0.9, "sawtooth", 0.5); }, 300 + Math.random() * 500);
        }
        if (this.raioClarao > 0) {
          ctx.fillStyle = `rgba(255,255,255,${this.raioClarao * 0.7})`; ctx.fillRect(0, 0, W, H);
          this.raioClarao = Math.max(0, this.raioClarao - dt * 3);
        }
      }
    } else if (tipo === "tornado") {
      ctx.fillStyle = "rgba(70,70,80,0.2)"; ctx.fillRect(0, 0, W, H);
      this.desenharTornado(ctx, t, dt, f, rumo);
    } else if (tipo === "neblina") {
      for (let k = 0; k < 4; k++) {
        const y = k * 45 + Math.sin(t * 0.3 + k) * 8;
        const g = ctx.createLinearGradient(0, y - 30, 0, y + 30);
        g.addColorStop(0, "rgba(235,240,245,0)"); g.addColorStop(0.5, "rgba(235,240,245,0.38)"); g.addColorStop(1, "rgba(235,240,245,0)");
        ctx.fillStyle = g; ctx.fillRect(0, y - 30, W, 60);
      }
    }
    // o CASTFORM FOGGY fugindo do tornado: atravessa a tela em 3 s, tremendo
    if (this.castformMedo) this.drawCastformMedo(ctx, dt);
    // os PIXELS ROUBADOS: subindo, no céu, caindo — e os MACHOKES arrumando
    andarRoubo(this, dt, !!this._tornadoTela);
    desenharRouboAr(this, ctx, Math.round(this.cam?.x || 0), Math.round(this.cam?.y || 0));
    // o aviso de quando o tempo vira
    if (this.avisoTempo?.t > 0) {
      this.avisoTempo.t -= dt;
      const txt = this.avisoTempo.txt;
      ctx.globalAlpha = Math.min(1, this.avisoTempo.t);
      ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(W / 2 - txt.length * 3 - 6, 6, txt.length * 6 + 12, 14);
      drawText(ctx, txt, W / 2 - txt.length * 3, 9, "#ffffff");
      ctx.globalAlpha = 1;
    }
  }

  /** O TORNADO: o funil girando, que atravessa a tela devagar e volta */
  desenharTornado(ctx, t, dt = 0, f = 1, rumo = { dx: 1, dy: 0 }) {
    // O TORNADO COM A IA DO VENTO (pedido do CAIO): ele mora no MAPA (não na
    // tela), anda pra onde o vento sopra — mais rápido na rajada — e ziguezagueia
    // de leve. Se sai pra longe, outro nasce do lado de onde o vento vem.
    const cx = this.cam?.x || 0, cy = this.cam?.y || 0, mx = cx + W / 2, my = cy + H / 2;
    // RARO E GIGANTE (pedido do CAIO: "gigantes e raros invés de vir tornado sem
    // parar"): depois que um passa, o próximo só vem daqui a 2 a 4 minutos
    let tor = this.tornado;
    const longe = tor && (tor.mapa !== this.st.player.map || Math.hypot(tor.x - mx, tor.y - my) > 420 + Math.min(4000, (tor.tam || 290) * 0.6));
    if (longe) { tor = this.tornado = null; this.tornadoEspera = 120 + Math.random() * 120; }
    if (!tor) {
      if (this.tornadoEspera == null) this.tornadoEspera = !this._tornadoTeste && new URLSearchParams(location.search).get("tornado") ? 1 : 5 + Math.random() * 10;
      this.tornadoEspera -= dt;
      if (this.tornadoEspera > 0) return;
      this.tornadoEspera = null;
      const lado = (Math.random() - 0.5) * 120;
      // O TAMANHO (pedido do CAIO: "de 10 a 99999 pixels"): sorteado de um jeito
      // que o pequeno é comum e o gigantesco é raríssimo (cada casa decimal vale igual)
      // ?tornado=99999 -> o primeiro tornado vem desse tamanho (pra testar)
      const forcado = !this._tornadoTeste && +new URLSearchParams(location.search).get("tornado");
      if (forcado) this._tornadoTeste = true;
      const tam = forcado ? Math.min(99999999, Math.max(10, forcado)) : Math.min(99999, Math.max(10, Math.round(10 * Math.pow(10, Math.random() * 4))));
      const sc0 = tam / 290;
      tor = this.tornado = { mapa: this.st.player.map, tam, x: mx - rumo.dx * (340 + Math.min(2000, tam * 0.3)) - rumo.dy * lado,
                             y: my - rumo.dy * 220 + rumo.dx * lado, fase: Math.random() * 6 };
      this.avisoTempo = { txt: `TORNADO DE ${tam.toLocaleString("pt-BR")} PIXELS!`, t: 3 };
      // o CASTFORM FORMA FOGGY passa correndo pela tela, com cara de medo (pedido do CAIO)
      this.castformMedo = { t: 0, dir: rumo.dx >= 0 ? 1 : -1, y: 26 + Math.random() * 40 };
      if (sc0 > 3) { Audio2.noise?.(2, 0.9); Audio2.tone(35, 1.6, "sawtooth", 0.6); }
    }
    const sc = (tor.tam || 290) / 290;
    const vel = (18 + f * 45) * Math.min(4, Math.max(0.6, Math.sqrt((this.tornado?.tam || 290) / 290)));
    tor.fase += dt;
    tor.x += (rumo.dx * vel + Math.sin(tor.fase * 0.9) * 14 * -rumo.dy) * dt;
    tor.y += (rumo.dy * vel + Math.sin(tor.fase * 0.9) * 14 * rumo.dx) * dt;
    this._tornadoTela = { x: tor.x - cx, y: tor.y - cy };
    // perto de você: puxa (o vento dele te arrasta um pouquinho) e a tela treme
    const p = this.st.player, px = p.x * TILE + 8, py = p.y * TILE + 8, d = Math.hypot(tor.x - px, tor.y - py);
    const puxa = Math.min(600, Math.max(30, 140 * sc));
    // (o olho levava pro CÉU DAS NUVENS — tirado a pedido do CAIO, nov/2026: "tire o céu")
    if (d < puxa && !this.dlg.active && !this.menu && !this.move) {
      this.tremor = Math.max(this.tremor || 0, Math.min(1.2, 0.5 * Math.sqrt(sc)) * (1 - d / puxa) + 0.05);
      if (this.andandoLivre !== undefined && this.sub) {
        const k = (1 - d / puxa) * Math.min(80, 34 * Math.sqrt(sc)) * dt;
        this.empurraoVento = { x: (tor.x - px) / (d || 1) * k, y: (tor.y - py) / (d || 1) * k };
      }
    }
    const X = tor.x - cx, base = tor.y - cy + 30 * Math.min(1, sc);
    if (X < -200 * Math.max(1, sc) || X > W + 200 * Math.max(1, sc) || base < -40 || base > H + 320 * Math.max(1, sc)) return;
    // ele ROUBA PIXELS do mapa, em volta do pé (src/systems/roubopixels.js)
    roubarPixels(this, ctx, X, base, sc, dt);
    for (let k = 0; k < 22; k++) {
      // GIGANTE: 22 anéis bem espaçados, o de cima com uns 170 px de largura
      const y = base - k * 13 * sc, larg = (12 + k * k * 0.32) * sc, gira = t * 5 + k * 0.5;
      if (y + (5 + k * 0.3) * sc < -10 || y - (5 + k * 0.3) * sc > H + 10) continue;     // fora da tela (os gigantescos)
      ctx.fillStyle = k % 2 ? "rgba(110,110,122,0.55)" : "rgba(150,150,162,0.5)";
      ctx.beginPath(); ctx.ellipse(X + (Math.sin(gira) * 6 + Math.sin(t + k * 0.3) * k * 1.2) * sc, y, Math.max(1, larg), Math.max(1, (5 + k * 0.3) * sc), 0, 0, Math.PI * 2); ctx.fill();
    }
    // o que ele levanta, voando em volta
    ctx.fillStyle = "#6a5a40";
    for (let k = 0; k < 34; k++) {
      const a = t * 3.5 + k * 1.7, alt = ((t * 40 + k * 23) % 280) * sc, pd = Math.max(1, Math.min(8, Math.round(2 * Math.sqrt(sc))));
      ctx.fillRect(Math.round(X + Math.cos(a) * (16 * sc + alt * 0.3)), Math.round(base - 2 - alt), pd, pd);
    }
  }

  /** o TUM do empurrão de um MACHOKE (src/systems/roubopixels.js) */
  somEmpurrao() { Audio2.tone(70, 0.15, "square", 0.6); Audio2.tone(140, 0.08, "triangle", 0.4); }

  /** O CASTFORM FORMA FOGGY (assets/sprites/pokemon/castform-foggy.png, feito pixel
   *  por pixel: tools/castform_foggy/desenha.py) fugindo do tornado pela tela */
  drawCastformMedo(ctx, dt) {
    const c = this.castformMedo;
    c.t += dt;
    if (c.t > 3.2) { this.castformMedo = null; return; }
    if (!this._imgCastformFoggy) {
      this._imgCastformFoggy = new Image();
      this._imgCastformFoggy.src = "assets/sprites/pokemon/castform-foggy.png";
    }
    const img = this._imgCastformFoggy;
    if (!img.complete || !img.naturalWidth) return;
    const k = c.t / 3.2, x = c.dir > 0 ? -40 + k * (W + 80) : W + 40 - k * (W + 80);
    const y = c.y + Math.sin(c.t * 9) * 4, treme = Math.round(Math.sin(c.t * 60));
    ctx.save();
    ctx.translate(Math.round(x) + treme, Math.round(y));
    if (c.dir < 0) ctx.scale(-1, 1);
    ctx.drawImage(img, 24, 24, 48, 48, -24, -24, 48, 48);
    ctx.restore();
    if (Math.floor(c.t * 3) % 2 === 0) drawText(ctx, "!!", Math.round(x) - 4, Math.round(y) - 30, "#ffffff");
  }

  /** O SEPARADOR DE CÉLULAS do BILL: aperta o botão, o WAILORD brilha, encolhe, e sai o BILL */
  separadorDoBill() {
    const caso = this.st.flags.billCasoAtivo ? BILL_CASOS[this.st.flags.billCasos || 0] : null;
    if (caso && !this.st.flags.billCasoPediu) return void this.dlg.say(["O SEPARADOR DE CÉLULAS ESTÁ LIGADO DE NOVO.", "MELHOR FALAR COM O POKÉMON DO LADO PRIMEIRO..."]);
    if (!caso && !this.st.flags.billPediu) return void this.dlg.say(["O COMPUTADOR DO BILL. NA TELA ESTÁ ESCRITO \"SEPARADOR DE CÉLULAS\" E TEM UM BOTÃO VERMELHO.", "MELHOR NÃO APERTAR SEM SABER PRA QUE SERVE..."]);
    this.dlg.ask("APERTAR O BOTÃO VERMELHO?", ["APERTAR", "NÃO"], (i) => {
      if (i !== 0) return;
      Audio2.tone(880, 0.1, "square", 0.4);
      [330, 440, 554, 659, 880, 1108].forEach((f, k) => setTimeout(() => Audio2.tone(f, 0.12, "triangle", 0.4), 200 + k * 120));
      this.tremor = 0.8;
      this.dlg.say(["BZZZZZ... AS CÁPSULAS DO TELEPORTADOR LIGARAM!"], () => {
        // A CUTSCENE (cenaDoBill): sugado, o tubo, a outra cápsula, e sai o BILL
        this.cenaBill = { t: 0, sons: {}, especie: caso?.especie || "snorlax", cor: caso?.cor || "#2e7a78", entala: caso ? !!caso.entala : true, noCano: !!caso?.noCano, caso: caso ? (this.st.flags.billCasos || 0) : null };
      });
    });
  }

  /** O SEPARADOR DE CÉLULAS: 16x24, pixel por pixel, com as luzinhas piscando */
  desenharSeparador(ctx, x, y) {
    const g = [
      "...kkkkkkkkkk...",
      "..kccccccccccK..",
      "..kcbbbbbbbbcK..",
      "..kcbGGbbYYbcK..",
      "..kcbbbbbbbbcK..",
      "..kcbYYbbGGbcK..",
      "..kcbbbbbbbbcK..",
      "..kccccccccccK..",
      "..kcckkkkkkccK..",
      "..kcckRRRRkccK..",
      "..kcckRrrRkccK..",
      "..kcckRRRRkccK..",
      "..kcckkkkkkccK..",
      "..kccccccccccK..",
      "..kssssssssssK..",
      "...kkkkkkkkkk...",
    ];
    const piscar = Math.floor(performance.now() / 300) % 2;
    const cores = { k: "#202028", K: "#101018", c: "#b8c0d0", b: "#2a3448", s: "#7a8090", R: "#e02828", r: "#ff9090",
                    G: piscar ? "#40f060" : "#1a6a28", Y: piscar ? "#3a3a10" : "#f8e040" };
    g.forEach((linha, dy) => [...linha].forEach((ch, dx) => { if (cores[ch]) { ctx.fillStyle = cores[ch]; ctx.fillRect(x + dx, y + dy, 1, 1); } }));
  }

  // A CUTSCENE DO BILL VOLTANDO A SER GENTE (pedido do CAIO). Na casa do mar
  // (route25_sea_cottage): as duas CÁPSULAS do teleportador e o TUBO verde entre
  // elas são do desenho do mapa — a cena desenha a luz, o Snorlax e o Bill por cima.
  //  0-0,8 s   o computador zumbe, o Snorlax treme
  //  0,8-2 s   ele é SUGADO pra cápsula da esquerda, encolhendo
  //  2-3,4 s   ENTALOU na boca do tubo (o CAIO: "faz o cano entalar no início")
  //  3,4-4,8 s passa espremido e VAI SE SEPARANDO: o SNORLAX volta, o BILL segue
  //  4,6-5,8 s a da direita treme e solta fumaça
  //  5,6 s     CLARÃO: sai o BILL, e ele anda até o meio da sala
  andarCenaBill(dt) {
    const c = this.cenaBill;
    c.t += dt;
    const som = (k, f) => { if (!c.sons[k]) { c.sons[k] = true; f(); } };
    if (c.t < 0.8) { som("zumbe", () => { Audio2.tone(110, 0.8, "sawtooth", 0.25); Audio2.tone(165, 0.8, "sawtooth", 0.18); }); this.tremor = Math.max(this.tremor || 0, 0.15); }
    else if (c.t < 2) som("suga", () => { [600, 500, 400, 300, 220].forEach((f, k) => setTimeout(() => Audio2.tone(f, 0.12, "triangle", 0.4), k * 160)); });
    else if (c.t < 3.4 && c.entala !== false) {
      // ENTALOU na boca do tubo: BOING, BOING, e o tubo estufa
      const n = Math.floor((c.t - 2) / 0.35);
      som("boing" + n, () => { Audio2.tone(140 - n * 6, 0.12, "square", 0.45); Audio2.tone(90, 0.1, "triangle", 0.4); });
      this.tremor = Math.max(this.tremor || 0, 0.25);
    }
    else if (c.t < 4.8) som("tubo", () => { Audio2.tone(70, 0.3, "sawtooth", 0.4); [330, 392, 494, 587, 698, 784].forEach((f, k) => setTimeout(() => Audio2.tone(f, 0.1, "square", 0.3), 200 + k * 180)); });
    else if (c.t < 5.6) { som("treme", () => Audio2.noise?.(0.7, 0.5)); this.tremor = Math.max(this.tremor || 0, 0.3); }
    else if (c.t < 5.8) som("plof", () => { Audio2.tone(880, 0.1, "square", 0.5); Audio2.tone(1320, 0.2, "triangle", 0.5); });
    if (c.t > 7.6) {
      this.cenaBill = null;
      Audio2.heal();
      if (c.caso != null) {
        // um dos OUTROS CASOS resolvido: o próximo fica pra próxima visita
        const f = this.st.flags;
        delete f[`billCaso${c.caso}`]; delete f.billCasoAtivo; delete f.billCasoPediu;
        f.billCasos = c.caso + 1; f.billProximo = true;
        if (c.especie === "wailord") f.billLargura = 1.4;
        this.game.autosave?.(true);
        return void this.dlg.say(["PLOFT! DA CÁPSULA SAIU O BILL, TONTO!", ...(BILL_CASOS[c.caso].depois || [])]);
      }
      this.st.flags.billSeparado = true;
      this.game.autosave?.(true);
      this.dlg.say(["PLOFT! DA CÁPSULA SAIU UM HOMEM BOCEJANDO!", "É O BILL, DE VOLTA AO NORMAL!"]);
    }
  }

  drawCenaBill(ctx, cx, cy) {
    const c = this.cenaBill, t = c.t;
    const P1 = { x: 56, y: 40 }, P2 = { x: 168, y: 40 }, TUBO = { x0: 74, x1: 150, y: 30 };
    const S = { x: 6 * TILE + 8, y: 5 * TILE + 8 }, FIM = { x: 7 * TILE + 8, y: 5 * TILE + 8 };
    const X = (v) => Math.round(v - cx), Y = (v) => Math.round(v - cy);
    const brilho = (p, a, r = 22) => {
      const g = ctx.createRadialGradient(X(p.x), Y(p.y), 2, X(p.x), Y(p.y), r);
      g.addColorStop(0, `rgba(180,255,190,${a})`); g.addColorStop(1, "rgba(180,255,190,0)");
      ctx.fillStyle = g; ctx.fillRect(X(p.x) - r, Y(p.y) - r, r * 2, r * 2);
    };
    // o SNORLAX: tremendo, depois voando e encolhendo pra cápsula da esquerda
    // o WAILORD ENTALADO NO CANO: até 3,4 s ele estufa e empurra, cada vez mais
    if (c.noCano && t < 3.4) this.drawWailordNoCano(ctx, cx, cy, 1 + Math.min(1, t / 3.4) * 0.6);
    const sn = this.monNaVista(c.especie || "snorlax", 7, "left");
    if (sn && t < 2 && !c.noCano) {
      const k = t < 0.8 ? 0 : (t - 0.8) / 1.2, e = k * k * (3 - 2 * k);
      const px = S.x + (P1.x - S.x) * e + (t < 0.8 ? Math.round((Math.random() - 0.5) * 2) : 0);
      const py = S.y + (P1.y - S.y) * e - Math.sin(e * Math.PI) * 14;
      const tam = Math.round(40 * (1 - e * 0.85));
      ctx.save(); ctx.globalAlpha = 1 - Math.max(0, e - 0.7) / 0.3;
      ctx.translate(X(px), Y(py)); ctx.rotate(e * Math.PI * 3);
      ctx.drawImage(reduzido(sn, 40), -tam / 2, -tam / 2, tam, tam);
      ctx.restore();
      // o rastro de luz que puxa ele
      if (t > 0.8) { ctx.strokeStyle = "rgba(160,255,180,0.5)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(P1.x), Y(P1.y)); ctx.lineTo(X(px), Y(py)); ctx.stroke(); }
    }
    // a cápsula da esquerda acende quando ele entra
    if (t > 1.7 && t < 4.8) brilho(P1, Math.min(1, (t - 1.7) / 0.3) * 0.7, 26);
    // O BOLO NO TUBO: o SNORLAX (verde-escuro) com o BILL (cor de pele) dentro
    const bolo = (bx, raio, cor) => {
      ctx.fillStyle = "#103030"; ctx.beginPath(); ctx.ellipse(X(bx), Y(TUBO.y), raio + 1, raio * 0.8 + 1, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = cor; ctx.beginPath(); ctx.ellipse(X(bx), Y(TUBO.y), raio, raio * 0.8, 0, 0, Math.PI * 2); ctx.fill();
    };
    // 2-3,4 s: ENTALOU na boca do tubo — o tubo estufa e o bolo empurra e volta
    if (t > 2 && t < 3.4 && c.entala === false) {
      // (o magrinho passa direto pelo tubo, só brilhando)
      const bx = TUBO.x0 + (TUBO.x1 - TUBO.x0) * ((t - 2) / 1.4) * 0.3;
      bolo(bx, 6, c.cor);
      brilho({ x: bx, y: TUBO.y }, 0.5, 10);
    }
    if (t > 2 && t < 3.4 && c.entala !== false && !c.noCano) {
      const empurra = Math.max(0, Math.sin((t - 2) / 0.35 * Math.PI)) * 4;
      bolo(TUBO.x0 + 2 + empurra, 9 + Math.sin(t * 18) * 0.8, c.cor || "#2e7a78");
      ctx.fillStyle = "#f0d0b0"; ctx.fillRect(X(TUBO.x0 + 2 + empurra) - 2, Y(TUBO.y) - 3, 4, 4);    // o BILL lá dentro
      if (Math.floor(t * 4) % 2) drawText(ctx, "ENTALOU!", X(TUBO.x0) - 10, Y(TUBO.y) - 22, "#ffffff");
    }
    // 3,4-4,8 s: passa espremido e VAI SE SEPARANDO — o pedaço de SNORLAX volta
    // pra cápsula da esquerda, o pedaço de BILL segue pra da direita
    if (t > 3.4 && t < 4.8) {
      const q = (t - 3.4) / 1.4, sep = Math.min(1, q * 1.6);
      const bx = TUBO.x0 + (TUBO.x1 - TUBO.x0) * q;
      const volta = bx - (bx - TUBO.x0) * sep * 1.2;
      if (sep < 1) bolo(Math.max(TUBO.x0, volta), 6 * (1 - sep * 0.5), c.cor || "#2e7a78");
      bolo(bx, 3 + (1 - sep) * 3, sep > 0.6 ? "#f0d0b0" : "#5a9a90");
      // faíscas onde eles se soltam
      if (sep > 0.2 && sep < 0.9) for (let k = 0; k < 4; k++) { ctx.fillStyle = "#ffffff"; ctx.fillRect(X((bx + volta) / 2 + Math.sin(t * 40 + k) * 5), Y(TUBO.y + Math.cos(t * 33 + k) * 4), 2, 2); }
      brilho({ x: bx, y: TUBO.y }, 0.6, 10);
    }
    // a da direita: acende, treme e solta fumaça
    if (t > 4.6 && t < 5.8) {
      brilho(P2, 0.5 + 0.4 * Math.sin(t * 30), 28);
      for (let k = 0; k < 6; k++) {
        const q = ((t - 4.6) * 1.5 + k / 6) % 1;
        ctx.fillStyle = `rgba(230,235,240,${0.6 * (1 - q)})`;
        ctx.beginPath(); ctx.arc(X(P2.x + Math.sin(k * 2.1) * 10 * q), Y(P2.y + 14 - q * 30), 3 + q * 5, 0, Math.PI * 2); ctx.fill();
      }
    }
    // O CLARÃO
    if (t > 5.6 && t < 6.2) { ctx.fillStyle = `rgba(255,255,255,${(1 - (t - 5.6) / 0.6) * 0.9})`; ctx.fillRect(0, 0, W, H); }
    // O BILL: sai da porta da cápsula e anda até o meio da sala
    if (t > 5.6) {
      const set = Assets.actor("bill");
      const k = Math.min(1, (t - 5.8) / 1.2), anda = t > 5.8 && k < 1;
      const bx = P2.x + (FIM.x - P2.x) * Math.max(0, k), by = (P2.y + 18) + (FIM.y - (P2.y + 18)) * Math.max(0, k);
      const dir = k < 1 ? (Math.abs(FIM.x - P2.x) > Math.abs(FIM.y - P2.y) ? "left" : "down") : "down";
      const q = set?.[dir]?.[anda ? (Math.floor(t * 8) % 2 ? 1 : 3) : 0];
      // (do WAILORD, ele já sai mais largo)
      const larg = Math.round(q?.width * (c.especie === "wailord" ? 1.4 : Math.max(1, this.st.flags.billLargura || 1)));
      if (q) ctx.drawImage(q, X(bx) - 8 - (larg - 16) / 2, Y(by) + 8 - q.height, larg, q.height);
      if (t > 7) drawText(ctx, "!", X(bx) - 2, Y(by) - 30, "#ffffff");
    }
  }

  /** O BILL-WAILORD ENTALADO DENTRO DO CANO entre as cápsulas: o WAILORD
   *  espremido no comprimento do tubo, o tubo estufado em volta, respirando.
   *  `forca` (1 = parado) é o quanto ele está empurrando, na cena. */
  drawWailordNoCano(ctx, cx, cy, forca = 1) {
    const TUBO = { x0: 74, x1: 150, y: 30 };
    const img = this.monNaVista("wailord", 7, "left");
    const t = performance.now() / 1000;
    const respira = Math.sin(t * 2.2) * 1.2 * forca + (forca > 1 ? Math.sin(t * 25) * (forca - 1) * 2 : 0);
    const w = TUBO.x1 - TUBO.x0 + 6, h = Math.round(20 * forca + respira);
    const X = Math.round(TUBO.x0 - 3 - cx), Y = Math.round(TUBO.y - cy - h / 2);
    // o tubo estufado (verde, por fora)
    ctx.fillStyle = "#1a4a3a";
    ctx.beginPath(); ctx.ellipse(X + w / 2, Y + h / 2, w / 2 + 2, h / 2 + 2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(110,220,170,0.55)";
    ctx.beginPath(); ctx.ellipse(X + w / 2, Y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2); ctx.fill();
    // o WAILORD lá dentro, espremido
    if (img) {
      const bb = reduzido(img, 64);
      ctx.save();
      ctx.beginPath(); ctx.ellipse(X + w / 2, Y + h / 2, w / 2 - 1, h / 2 - 1, 0, 0, Math.PI * 2); ctx.clip();
      ctx.globalAlpha = 0.9;
      ctx.drawImage(bb, X - 4, Y - h * 0.6, w + 8, h * 2.2);
      ctx.restore();
    }
    // o brilho do vidro
    ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.fillRect(X + 8, Y + 3, w - 16, 1);
    if (Math.floor(t * 1.2) % 3 === 0) drawText(ctx, "ENTALADO!", X + w / 2 - 27, Y - 12, "#ffffff");
  }

  /** o BILL de volta: agradece e dá o presente (uma vez) */
  falarBill(npc) {
    if (this.st.flags.billPresente) return void this.dlg.say((this.st.flags.billCasos || 0) >= BILL_CASOS.length ? BILL_FIM : npc.afterLines);
    this.dlg.say([...npc.lines, "BILL: O SNORLAX QUE ENTROU COMIGO NO TELEPORTADOR... ELE TINHA UM FILHOTE.", "ELE GOSTOU DE VOCÊ. LEVA ELE!"], () => {
      this.st.flags.billPresente = true;
      this.st.flags.billProximo = true;          // na próxima visita, o primeiro dos OUTROS CASOS
      const mon = createMon(DB.SPECIES.munchlax ? "munchlax" : "snorlax", 20);
      (this.st.party.length < 6 ? this.st.party : this.st.box).push(mon);
      this.st.seen[mon.species] = true; this.st.caught[mon.species] = true;
      Audio2.heal();
      this.game.autosave?.(true);
      this.dlg.say([`VOCÊ RECEBEU UM ${mon.nickname}!`, this.st.party.includes(mon) ? `${mon.nickname} ENTROU NA SUA EQUIPE.` : `${mon.nickname} FOI PRO BOX.`,
                    "BILL: CUIDADO: ELE COME TUDO O QUE VÊ. A MINHA GELADEIRA JÁ ERA."]);
    });
  }

  /** O OLHO DO TORNADO: girando, sobe, e chega no CÉU DAS NUVENS */
  irPraNuvens() {
    const p = this.st.player, N = DB.MAPS.ceu_nuvens;
    this.st.voltaNuvens = { map: p.map, x: p.x, y: p.y };
    this.tornado = null;
    this.tremor = 1;
    Audio2.noise?.(1.4, 0.8); Audio2.tone(90, 1, "sawtooth", 0.5);
    this.dlg.say(["VOCÊ ENTROU NO OLHO DO TORNADO!", "ELE TE GIRA, GIRA, GIRA... E TE JOGA PRA CIMA!"], () => this.transition(() => {
      p.map = "ceu_nuvens"; p.x = N.spawn.x; p.y = N.spawn.y; p.dir = "down";
      this.st.surfando = null; this.sub = { x: 0, y: 0 };
      this.afterTravel();
      this.snapCamera();
      setTimeout(() => this.dlg.say(["...", "VOCÊ CAIU EM CIMA DE UMA NUVEM. ELA É FOFA E AGUENTA O SEU PESO!", "VOCÊ ESTÁ NO CÉU DAS NUVENS!"]), 400);
    }));
  }

  /** o ALTARIA das nuvens: te leva de volta pra onde o tornado te pegou */
  voltarDasNuvens(npc) {
    const v = this.st.voltaNuvens && DB.MAPS[this.st.voltaNuvens.map] ? this.st.voltaNuvens : { map: "pallet", ...DB.MAPS.pallet.spawn };
    this.dlg.say(npc.lines, () => this.dlg.ask("VOLTAR PRA BAIXO NAS COSTAS DO ALTARIA?", ["SIM", "NÃO"], (i) => {
      if (i !== 0) return;
      const p = this.st.player;
      this.transition(() => {
        p.map = v.map; p.x = v.x; p.y = v.y; p.dir = "down";
        this.sub = { x: 0, y: 0 };
        this.afterTravel();
        this.snapCamera();
        setTimeout(() => this.dlg.say("O ALTARIA DESCEU PLANANDO E TE DEIXOU NO CHÃO, DEVAGARINHO."), 400);
      });
    }));
  }

  /** O MATO NO VENTO (ideia minha, pra IA do vento): na rajada forte, umas
   *  touceiras de mato alto na tela balançam sozinhas */
  matoNoVento(ctx, dt, f, fora) {
    this.matoVento ||= [];
    if (!fora && f > 0.6 && this.matoVento.length < 5 && Math.random() < dt * (f - 0.55) * 10) {
      const p = this.st.player, x = p.x + Math.floor(Math.random() * 15) - 7, y = p.y + Math.floor(Math.random() * 9) - 4;
      if (this.tagAt(x, y) === DB.TAG.GRASS) this.matoVento.push({ x, y, t: 0 });
    }
    const cx = Math.round(this.cam?.x || 0), cy = Math.round(this.cam?.y || 0);
    for (const m of this.matoVento) {
      m.t += dt;
      const q = Math.min(2, Math.floor(m.t / 0.12));
      if (Assets.rustle?.[q]) ctx.drawImage(Assets.rustle[q], m.x * TILE - cx, m.y * TILE - cy);
    }
    this.matoVento = this.matoVento.filter((m) => m.t < 0.36);
  }

  /** as PONTES DE VINHA deste mapa: "x,y" -> "d" (deitada) ou "p" (de pé) */
  pontesAqui() {
    const l = this.st.pontes?.[this.st.player.map] || [];
    if (this._pontes?.l !== l || this._pontes.n !== l.length) {
      this._pontes = { l, n: l.length, m: new Map(l.map((k) => { const [x, y, o] = k.split(","); return [`${x},${y}`, o]; })) };
    }
    return this._pontes.m;
  }

  /** ÁGUA NA FRENTE e alguém sabe ENERGIA DA NATUREZA: a vinha cresce até o
   *  outro lado (e some quando você sai do mapa), do tamanho que precisar (pedido do CAIO: "infinita se tiver
   *  chão adiante"); só não dá se a água vai até a beirada do mapa. */
  pedirPonte(alvo, surfar) {
    const mon = this.quemSabe("energiadanatureza");
    const p = this.st.player, [dx, dy] = DIRS[p.dir];
    const dir = p.dir;
    // ATRAVESSA MAPAS (pedido do CAIO): chegou na beirada com água, a vinha
    // continua no mapa vizinho pela conexão (vila <-> rota <-> cidade)
    const tagEm = (m, x, y) => {
      if (m === p.map) return this.tagAt(x, y);
      const g = DB.KANTO[m];
      if (!g || x < 0 || y < 0 || x >= g.w || y >= g.h) return -1;
      const t = g.tags.charCodeAt(y * g.w + x) - 48;
      return t === DB.TAG.WATER && (this.st.pontes?.[m] || []).some((k) => k.startsWith(`${x},${y},`)) ? DB.TAG.FREE : t;
    };
    const tiles = [];
    let m = p.map, x = alvo.x, y = alvo.y;
    for (let guarda = 0; guarda < 600; guarda++) {
      const t = tagEm(m, x, y);
      if (t === DB.TAG.WATER) { tiles.push([m, x, y]); x += dx; y += dy; continue; }
      if (t !== -1) break;
      // a beirada: passa pro vizinho
      const g = m === p.map ? this.geo : DB.KANTO[m];
      const c = (g?.connections || []).find((k) => k.dir === dir && k.to && DB.KANTO[k.to]);
      if (!c) break;
      const d = DB.KANTO[c.to];
      if (dir === "up") { y = d.h - 1; x -= c.offset; } else if (dir === "down") { y = 0; x -= c.offset; }
      else if (dir === "left") { x = d.w - 1; y -= c.offset; } else { x = 0; y -= c.offset; }
      m = c.to;
    }
    const t = tagEm(m, x, y);
    const chega = tiles.length && (t === DB.TAG.FREE || t === DB.TAG.GRASS || t === DB.TAG.ICE);
    const opcoes = ["PONTE DE VINHA", ...(surfar ? ["SURFAR"] : []), "NÃO"];
    this.dlg.ask("ÁGUA NA FRENTE. O QUE VOCÊ QUER FAZER?", opcoes, (i) => {
      if (opcoes[i] === "SURFAR") return this.pedirSurf(alvo);
      if (opcoes[i] !== "PONTE DE VINHA") return;
      if (!chega) return void this.dlg.say(`${mon.nickname} USOU ENERGIA DA NATUREZA... MAS A VINHA NÃO ALCANÇA O OUTRO LADO.`);
      this.dlg.say(`${mon.nickname} USOU ENERGIA DA NATUREZA! UMA PONTE DE VINHA CRESCEU POR CIMA DA ÁGUA!`, () => {
        const o = dy ? "p" : "d";
        this.st.pontes ||= {};
        for (const [mm, tx, ty] of tiles) {
          const l = (this.st.pontes[mm] ||= []);
          if (!l.some((k) => k.startsWith(`${tx},${ty},`))) l.push(`${tx},${ty},${o}`);
        }
        // os mapas que a mesma ponte liga: andando por ela de um pro outro, ela não some
        const mapas = [...new Set(tiles.map(([mm]) => mm))];
        if (mapas.length > 1) (this.st.pontesCadeias ||= []).push(mapas);
        this.ponteCrescendo = { tiles: tiles.filter(([mm]) => mm === p.map).map(([, tx, ty]) => [tx, ty]), t: 0 };
        tiles.slice(0, 30).forEach((_, k) => setTimeout(() => Audio2.tone(300 + (k % 15) * 40, 0.05, "triangle", 0.25), k * 60));
        this.game.autosave?.();
      });
    });
  }

  /** desenha as pontes (por baixo de quem anda); a que acabou de nascer cresce tile por tile */
  desenharPontes(ctx, cx, cy) {
    const m = this.pontesAqui();
    if (!m.size) return;
    const c = this.ponteCrescendo;
    let novos = null;
    if (c) {
      c.t += 1 / 60;
      const n = Math.floor(c.t / 0.06);
      if (n >= c.tiles.length) this.ponteCrescendo = null;
      else novos = new Set(c.tiles.slice(n).map(([x, y]) => `${x},${y}`));
    }
    for (const [k, o] of m) {
      if (novos?.has(k)) continue;
      const [x, y] = k.split(",").map(Number);
      ctx.drawImage(tilePonte(o === "p"), x * TILE - cx, y * TILE - cy);
    }
  }

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
    if (b) return { tipo: "bloco", ...b };
    const c = this.caminhaoAqui();
    if (c && y === c.y && x >= c.x && x < c.x + CAMINHAO.largura) return { tipo: "caminhao", x: c.x, y: c.y };
    return null;
  }

  /** onde está o CAMINHÃO DO MEW (se este é o mapa dele) */
  caminhaoAqui() {
    if (this.st.player.map !== CAMINHAO.mapa) return null;
    const c = this.st.caminhaoMew || { x: CAMINHAO.x, y: CAMINHAO.y };
    return c.afundou ? null : c;
  }

  /** EMPURRAR O CAMINHÃO: precisa de FORÇA. Cada empurrão anda 1 tile; se o
   *  próximo é ÁGUA, ele CAI NO MAR e afunda (pedido do CAIO: "tem que empurrar
   *  o caminhão pra água") — e onde ele estava parado aparece o MEW. */
  empurrarCaminhao(dx, dy) {
    const mon = this.quemSabe("forca");
    if (!mon) return void this.dlg.say(["UM CAMINHÃO VELHO E ENFERRUJADO, PARADO NO CAIS.", "DIZEM QUE TEM ALGUMA COISA EMBAIXO DELE... MAS ELE É PESADO DEMAIS PRA EMPURRAR."]);
    const c = this.caminhaoAqui();
    const nx = c.x + dx, ny = c.y + dy;
    const tiles = Array.from({ length: CAMINHAO.largura }, (_, i) => [nx + i, ny]);
    const naAgua = tiles.some(([x, y]) => this.tagAt(x, y) === DB.TAG.WATER);
    const livre = tiles.every(([x, y]) => { const t = this.tagAt(x, y);
      return (t === DB.TAG.FREE || t === DB.TAG.WATER) && !this.npcAt(x, y) && !this.warpAt(x, y) && !(x === this.st.player.x && y === this.st.player.y); });
    if (!livre) { Audio2.bump(); return void this.dlg.say("O CAMINHÃO NÃO SAI DO LUGAR PRA ESSE LADO."); }
    const empurra = () => {
      Audio2.tone(110, 0.2, "square", 0.9); setTimeout(() => Audio2.tone(90, 0.25, "square", 0.9), 180);
      if (!naAgua) {
        this.st.caminhaoMew = { x: nx, y: ny };
        this.game.autosave?.();
        return;
      }
      // CAIU NO MAR: afunda devagar, espirra água, e o MEW aparece
      this.caminhaoAfundando = { x: nx, y: ny, t: 0 };
      this.st.caminhaoMew = { x: nx, y: ny, afundou: true };
      setTimeout(() => { Audio2.tone(700, 0.08, "square", 0.5); Audio2.tone(300, 0.3, "triangle", 0.5); }, 250);
      this.st.flags.mewCaminhao = true;
      this.game.autosave?.(true);
      setTimeout(() => this.dlg.say(["TCHIBUM! O CAMINHÃO CAIU NO MAR E AFUNDOU!", "...", "ONDE ELE ESTAVA PARADO TEM ALGUMA COISA!", "É UM MEW!!! O MITO ERA VERDADE!"]), 1200);
    };
    if (this.st.forcaCaminhao) return empurra();
    this.dlg.ask(`${mon.nickname} PODE EMPURRAR O CAMINHÃO COM FORÇA. EMPURRAR?`, ["SIM", "NÃO"], (i) => {
      if (i !== 0) return;
      this.st.forcaCaminhao = true;        // daí em diante empurra direto, sem perguntar
      empurra();
    });
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
      // `noite`: só de noite (a Z-A ROYALE da LUMIOSE); `mostrar(st)`: a regra
      // que o dado escreve (o adversário da vez de cada rank)
      .filter((n) => !(n.noite && !horaDoMundo().noite))
      .filter((n) => !n.mostrar || n.mostrar(this.st))
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
    extra.push(...this.posPosNpcs());
    extra.push(...this.portalNpcs());
    extra.push(...this.zygardeNpcs());
    const celebi = this.celebiNpc();
    if (celebi) extra.push(celebi);
    extra.push(...this.erasNpcs());
    extra.push(...maquinasNoMapa(this.st, this.st.player.map));   // as POKÉMÁQUINAS que você montou aqui
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
    // A CRIANÇA PRESA NO PRETO (src/data/crianca-preto.js): no preto até você
    // trazer um doce; correndo, ela está onde a corrida está
    const CP = CRIANCA_PRETO;
    if (mapa === CP.mapa) {
      const salva = !!this.st.flags.criancaPretoSalva;
      const y = this.criancaCorre ? this.criancaCorre.y : salva ? CP.salva : CP.presa;
      extra.push({ id: "crianca_preto", x: CP.x, y, dir: "down", sprite: CP.sprite,
                   lines: salva ? CP.depois : [CP.grito] });
    }
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
    // num evento de ULTRA RAIDS o rasgo é um ULTRA BURACO (`ultra` muda o desenho)
    if (rasgo) extra.push({ id: "rasgo", x: rasgo.x, y: rasgo.y, sprite: "rasgo", raidPortal: true, dir: "down", ultra: !!ultraAberto() });
    // AS RAIDS DE EVENTO (src/data/eventos.js): rasgos fixos, só nos dias do evento
    for (const { ev, r } of raidsDeEvento(this.st, mapa)) {
      extra.push({ id: `evento_${chaveDaRaid(ev, r)}`, x: r.x, y: r.y, sprite: "rasgo", dir: "down",
                   raidEvento: { ev, r }, lines: ["..."], ultra: !!ev.ultra });
    }
    const f = this.st.fragment;
    if (f && f.map === this.st.player.map && this.hasDetector()) {
      extra.push({ id: "fragmento", x: f.x, y: f.y, sprite: "portal", fragment: true, dir: "down" });
    }
    // VÍTOR e ANDRÉ, os amigos de São Lucario (src/data/amigos.js): ficam num
    // chão livre, fora do caminho de quem já está no mapa
    const ocupado = new Set([...base, ...extra].map((n) => `${n.x},${n.y}`));
    extra.push(...amigosNpcs(this.st, (x, y) => {
      const t = this.tagAt(x, y);
      return t >= 0 && t !== DB.TAG.BLOCK && t < 4 && t !== DB.TAG.WATER && !ocupado.has(`${x},${y}`)
        && !this.warpAt(x, y);
    }));
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
    if (p.tipo === "GLITCH") { Glitch.hit(2); Audio2.glitch(); }
    // O TOTEM NÃO VEM SOZINHO: ele chama um ajudante (dupla) ou dois (trio), e
    // do seu lado saem tantos quanto os dele (src/data/duplas.js)
    const foes = montarGrupoDoTotem(p);
    const b = { foes, tamanho: foes.length, glitch: p.tipo === "GLITCH", npcKey: chaveDoTotem(p) };
    this.entrarEmBatalha("chefe", { ...b, glitch: false }, () => this.game.scenes.push(new GrupoBattleScene(), b));
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

  /** O AVIÃO (src/data/kalos.js `AVIAO`): o piloto em Kanto e em Braglitch e o
   *  balcão do aeroporto de LUMIOSE. Leva pra qualquer região menos a de onde
   *  você está, e só pra quem já fechou uma história. */
  pegarAviao(npc) {
    const A = DB.AVIAO, st = this.st;
    if (!A) return;
    if (!A.pode(st)) return void this.dlg.say(A.fechado);
    const aqui = regiaoDoMapa(st.player.map);
    const destinos = A.destinos.filter((d) => d.regiao !== aqui && DB.MAPS[d.mapa] && d.x != null);
    this.dlg.say(npc.lines || [], () => this.dlg.ask(A.pergunta, [...destinos.map((d) => d.nome), DB.STORY.sevii.aquiNao], (i) => {
      const d = destinos[i];
      if (!d) return;
      Audio2.tone(523, 0.1, "triangle", 0.5); Audio2.tone(784, 0.16, "triangle", 0.5);
      this.zarparPara({ porto: d.mapa, x: d.x, y: d.y, nome: d.nome, zarpou: A.indo(d.nome), chegou: A.chegou(d.nome) });
    }));
  }

  /** A POKÉBOLA DO TESOURO da árvore oca: todos os prêmios de uma vez */
  abrirTesouro(npc, state) {
    const T = DB.ARVORE.textos;
    if (state.gotGift) return void this.dlg.say(T.vazia);
    state.gotGift = true;
    const linhas = [T.tesouro];
    for (const [item, qty] of npc.premios) {
      this.st.items[item] = Math.min(999, (this.st.items[item] || 0) + qty);
      linhas.push(`${qty} ${item.toUpperCase()}`);
    }
    Audio2.heal();
    this.game.autosave?.(true);
    // de 3 em 3 por página, pra caber
    const pags = [linhas[0]];
    for (let i = 1; i < linhas.length; i += 3) pags.push(linhas.slice(i, i + 3).join(", ") + (i + 3 < linhas.length ? "," : "!"));
    this.dlg.say(pags);
  }

  /** O BURACO NO TRONCO da árvore da ROTA 1 (src/data/arvore-oca.js) */
  entrarNaArvore() {
    const A = DB.ARVORE, T = A.textos;
    this.dlg.say(T.tronco.slice(0, -1), () => this.dlg.ask(T.tronco[T.tronco.length - 1], T.opcoes, (i) => {
      if (i !== 0) return;
      const c = A.corredor.chegada;
      this.arvore = null;
      this.justWarped = true;
      this.transition(() => {
        Object.assign(this.st.player, { map: A.corredor.mapa, x: c.x, y: c.y, dir: c.dir });
        this.afterTravel();
      });
    }));
  }

  /** O HELICÓPTERO DA ÁREA ZERO (src/data/area-zero.js): em VIRIDIAN, depois da
   *  LIGA, ele leva pra GARAGEM ZERO; lá, traz de volta. */
  pegarHelicoptero(npc) {
    const A = DB.AREA_ZERO, T = A?.textos;
    if (!A) return;
    const ida = npc.helicoptero === "ida";
    const d = ida ? { ...A.garagem.chega, mapa: A.garagem.mapa, nome: "GARAGEM ZERO" } : { ...A.viridian.chega, mapa: A.viridian.mapa, nome: "VIRIDIAN" };
    if (!DB.MAPS[d.mapa]) return;
    this.dlg.say(npc.lines?.length ? npc.lines : ida ? T.piloto : T.pilotoVolta, () => this.dlg.ask(ida ? T.pergunta : T.perguntaVolta, T.opcoes, (i) => {
      if (i !== 0) return void this.dlg.say(T.naoQuer);
      // as hélices: um zumbido que sobe
      for (let k = 0; k < 8; k++) setTimeout(() => Audio2.tone(70 + k * 12, 0.08, "sawtooth", 0.35), k * 90);
      this.zarparPara({ porto: d.mapa, x: d.x, y: d.y, nome: d.nome, zarpou: ida ? T.indo : T.indoVolta, chegou: ida ? T.chegou : T.chegouVolta });
    }));
  }

  /** O FOGUETE (src/data/espaco.js): em CINNABAR depois da LIGA, e a nave
   *  pousada em cada planeta. Decola pro espaço 3D (src/scenes/espaco.js). */
  pegarFoguete(npc) {
    const E = DB.ESPACO, T = E?.textos;
    if (!E) return;
    this.dlg.say(npc.lines?.length ? npc.lines : T.cientista, () => this.dlg.ask(T.pergunta, T.opcoes, (i) => {
      if (i !== 0) return void this.dlg.say(T.naoQuer);
      T.contagem.forEach((_, k) => setTimeout(() => Audio2.tone(k < 3 ? 440 : 880, k < 3 ? 0.08 : 0.3, "square", 0.35), k * 450));
      this.dlg.say(T.contagem, () => {
        for (let k = 0; k < 10; k++) setTimeout(() => Audio2.tone(60 + k * 20, 0.1, "sawtooth", 0.4), k * 70);
        this.st.surfando = null;
        this.game.scenes.push(new EspacoScene(), { de: npc.foguete, aoPousar: (fala) => {
          this.compa = null; this.justWarped = true;
          this.afterTravel();
          this.game.music?.(this.map?.music);
          this.game.autosave?.(true);
          this.dlg.say(fala);
        } });
      });
    }));
  }

  /** A FÁBRICA DE POKÉBOLAS (src/data/fabrica.js): o GIOVANNI fala, o AZUL
   *  chega correndo, e é DUPLA: você e o AZUL contra o GIOVANNI e a ARIANA */
  lutarNaFabrica(npc) {
    const F = DB.FABRICA;
    // já perdeu? (trava extra: nunca luta duas vezes) -> vira o dono da fábrica
    if (this.st.flags.rocketDesfeita || this.st.npcState?.[`${F.mapa}.fabrica_giovanni`]?.defeated) {
      this.st.flags.rocketDesfeita = true;
      return this.menuDaFabrica(npc);
    }
    const time = (l) => l.filter(([id]) => DB.SPECIES[id]).map(([id, lvl]) => ({ id, lvl }));
    this.dlg.say([...F.giovanni.fala, ...F.giovanni.azulChega], () => {
      const args = {
        tamanho: 2, npcKey: `${F.mapa}.fabrica_giovanni`,
        trainer: { name: "GIOVANNI", sprite: "giovanni", party: time(F.giovanni.time), prize: 20000, dupla: true, lider: true, fabricaRocket: true },
        trainer2: { name: F.ariana.nome, sprite: F.ariana.sprite, party: time(F.ariana.time) },
        aliado: { name: DB.RIVAL?.nome || this.st.rivalNome || "AZUL", sprite: "rival", party: time(F.azulTime) },
      };
      this.entrarEmBatalha("chefe", args, () => this.game.scenes.push(new GrupoBattleScene(), args));
    });
  }

  /** o GIOVANNI DE DONO: escolhe a bola, paga, e a cena da fábrica (src/scenes/fabrica.js) */
  menuDaFabrica(npc) {
    const F = DB.FABRICA, st = this.st;
    const chave = (b) => "bola_" + b.item.replace(/\W/g, "");
    const faltam = (DB.BOLAS_NOVAS || []).filter((b) => !st.flags[chave(b)]);
    if (!faltam.length) return void this.dlg.say(F.jaTodas);
    // pedido do CAIO: paga $2000 e ele fabrica UMA BOLA ALEATÓRIA (das que ainda faltam)
    const PRECO = 2000;
    this.dlg.say(npc.lines?.length ? npc.lines : F.dono, () => this.dlg.ask(`PAGAR $${PRECO} PRA EU FABRICAR UMA BOLA SURPRESA?`,
      ["PAGAR $" + PRECO, "AGORA NÃO"], (i) => {
        if (i !== 0) return;
        if ((st.money || 0) < PRECO) return void this.dlg.say(F.semDinheiro);
        st.money -= PRECO;
        const b = faltam[Math.floor(Math.random() * faltam.length)];
        this.game.scenes.push(new FabricaScene(), { bola: b, aoFim: () => {
          st.flags[chave(b)] = true;
          st.items[b.item] = (st.items[b.item] || 0) + 1;     // a primeira, de presente
          this.game.autosave?.(true);
          this.dlg.say([...F.fabricou(b.label, "$" + PRECO), `VOCÊ RECEBEU UMA ${b.label}!`]);
        } });
      }));
  }

  /** a cientista de CINNABAR leva pra BASE ESPACIAL; o técnico de lá traz de volta */
  irBaseEspacial(npc) {
    const E = DB.ESPACO, T = E?.textos, ida = !!npc.irBaseEspacial;
    const d = ida ? { ...E.base.chega, mapa: E.base.mapa, nome: "BASE ESPACIAL" } : { ...E.cinnabar.chega, mapa: E.cinnabar.mapa, nome: "CINNABAR" };
    if (!DB.MAPS[d.mapa]) return;
    this.dlg.say(npc.lines, () => this.dlg.ask(ida ? T.perguntaGuia : T.perguntaVolta, T.opcoesGuia, (i) => {
      if (i !== 0) return;
      this.zarparPara({ porto: d.mapa, x: d.x, y: d.y, nome: d.nome, zarpou: ida ? T.indoBase : T.indoCidade, chegou: [ida ? "(VOCÊ CHEGOU NA BASE ESPACIAL.)" : "(VOCÊ ESTÁ DE VOLTA EM CINNABAR.)"] });
    }));
  }

  /** o FOGUETE em pé, pixel por pixel (2 tiles de altura, a ponta pra cima) */
  desenharFoguete(ctx, x, y) {
    const g = [
      ".......kk.......",
      "......krrk......",
      ".....krrrrk.....",
      ".....kwwwwk.....",
      "....kwwwwwwk....",
      "....kwwbbwwk....",
      "....kwbccbwk....",
      "....kwbccbwk....",
      "....kwwbbwwk....",
      "....kwwwwwwk....",
      "....krrrrrrk....",
      "....kwwwwwwk....",
      "....kwwwwwwk....",
      "....kwwwwwwk....",
      "....kwwwwwwk....",
      "...kkwwwwwwkk...",
      "..krkwwwwwwkrk..",
      ".krrkwwwwwwkrrk.",
      ".krrkrrrrrrkrrk.",
      ".krrkkssssk.krrk",
      ".kkk.kssssk..kkk",
      "......kddk......",
    ];
    const cores = { k: "#202838", r: "#d03030", w: "#eef0f6", b: "#3a6ab0", c: "#b8e0ff", s: "#6a7280", d: "#ffb040" };
    const X = Math.round(x), Y = Math.round(y + 16 - g.length);
    ctx.fillStyle = "rgba(0,0,0,0.22)"; ctx.fillRect(X + 2, Y + g.length - 1, 13, 2);
    g.forEach((l, j) => [...l].forEach((ch, i) => {
      if (!cores[ch]) return;
      // o foguinho de baixo pisca
      if (ch === "d" && Math.floor(performance.now() / 150) % 2) return;
      ctx.fillStyle = cores[ch]; ctx.fillRect(X + i, Y + j, 1, 1);
    }));
  }

  /** A DESCIDA PRA ÁREA ZERO: no seu KORAIDON ou MIRAIDON (se tiver um na
   *  equipe) ou num CYCLIZAR emprestado da GARAGEM (a cena src/scenes/descida.js) */
  descerAreaZero(npc) {
    const A = DB.AREA_ZERO, T = A?.textos;
    if (!A || !DB.MAPS[A.area.mapa]) return;
    this.dlg.say(npc.lines || T.pesquisadora, () => this.dlg.ask(T.perguntaDescer, T.opcoesDescer, (i) => {
      if (i !== 0) return;
      const seu = (this.st.party || []).find((m) => m && A.montarias.includes(m.megaDe || m.eternamaxDe || m.species) && m.hp > 0);
      const especie = seu ? (seu.megaDe || seu.species) : A.emprestado;
      const nome = seu ? seu.nickname : (DB.SPECIES[A.emprestado]?.name || "CYCLIZAR");
      this.dlg.say(seu ? T.seu(nome) : T.emprestado, () => {
        // você já vai pro fundo: a volta da cena clareia direto lá embaixo
        const c = A.area.chega;
        Object.assign(this.st.player, { map: A.area.mapa, x: c.x, y: c.y, dir: c.dir || "down" });
        this.st.surfando = null; this.compa = null; this.justWarped = true;
        this.afterTravel();
        this.game.autosave?.(true);
        this.game.scenes.push(new DescidaScene(), { especie, aoFim: () => this.dlg.say([...T.chegouEmbaixo(nome), ...(seu ? [] : T.devolveu)]) });
      });
    }));
  }

  /** o ELEVADOR DE CARGA do fundo da cratera: sobe pra GARAGEM ZERO */
  subirAreaZero(npc) {
    const A = DB.AREA_ZERO, T = A?.textos;
    if (!A) return;
    const b = A.garagem.beira;
    this.dlg.say(npc.lines || T.subir, () => this.dlg.ask(T.perguntaSubir, T.opcoesSubir, (i) => {
      if (i !== 0) return;
      this.zarparPara({ porto: A.garagem.mapa, x: b.x, y: b.y, nome: "GARAGEM ZERO", zarpou: ["(O ELEVADOR DE CARGA COMEÇA A SUBIR A PAREDE...)"], chegou: T.subiu });
    }));
  }

  /** O HELICÓPTERO (src/data/area-zero.js), pixel por pixel: a cabine branca
   *  com a faixa azul, a janela, o rabo comprido e a hélice girando */
  desenharHelicoptero(ctx, x, y) {
    const g = [
      "...........kkkkkkkk.................",
      "..........kwwwwwwwwkk...............",
      ".........kwbbbbbbwwwwk..............",
      "........kwbbcbbbbbwwwwkkkkkkkkkkk...",
      ".......kwwbbbbbbbbwwwwwwwwwwwwwwwk..",
      ".......kwwbbbbbbbwwwwwwwwkkkkkkkkwk.",
      ".......kwwwwwwwwwwwwwwwwk.......kwwk",
      ".......kssssssssssssssssk........kk.",
      ".......kwwwwwwwwwwwwwwwk............",
      "........kwwwwwwwwwwwwwk.............",
      ".........kkkkkkkkkkkkk..............",
      "..........k........k................",
      "........kkkkkkkkkkkkkkkk............",
    ];
    const cores = { k: "#202838", w: "#eef0f6", b: "#3a6ab0", c: "#b8e0ff", s: "#2a8ae0" };
    const X = Math.round(x - 10), Y = Math.round(y - 6);
    g.forEach((l, j) => [...l].forEach((ch, i) => { if (cores[ch]) { ctx.fillStyle = cores[ch]; ctx.fillRect(X + i, Y + j, 1, 1); } }));
    // a sombra no chão
    ctx.fillStyle = "rgba(0,0,0,0.22)"; ctx.fillRect(X + 8, Y + 14, 18, 2);
    // a HÉLICE: uma barra comprida que gira (fica mais curta e mais longa)
    const a = performance.now() / 60, larg = Math.round(Math.abs(Math.cos(a)) * 22) + 4;
    ctx.fillStyle = "#202838"; ctx.fillRect(X + 15, Y - 2, 2, 2);
    ctx.fillStyle = "rgba(40,48,64,0.85)"; ctx.fillRect(X + 16 - larg, Y - 3, larg * 2, 1);
    // a hélice do rabo
    ctx.fillStyle = "rgba(40,48,64,0.8)"; ctx.fillRect(X + 34, Y + 3 - (Math.round(a) % 2) * 2, 1, 5);
  }

  /** O CARA DO PORYGON (cassino de Celadon, src/data/ciberespaco.js): ele te
   *  leva pro CIBERESPAÇO montado no PORYGON dele. */
  falarCaraDoPorygon() {
    const C = DB.CIBER, T = DB.CIBER_TEXTO;
    if (!C || !DB.MAPS[C.mapa]) return;
    this.dlg.say(T.cara, () => this.dlg.ask(T.pergunta, T.opcoes, (i) => {
      if (i !== 0) return void this.dlg.say(T.naoQuer);
      Glitch.hit(0.8); Audio2.glitch();
      this.zarparPara({ porto: C.mapa, x: C.chegada.x, y: C.chegada.y, nome: "CIBERESPAÇO", zarpou: T.indo, chegou: T.chegou });
    }));
  }

  /** um PORTAL do ciberespaço: o PORYGON mergulha e sai na cidade (ou volta pro cassino) */
  sairDoCiber(w) {
    const d = w.ciber, T = DB.CIBER_TEXTO;
    this.justWarped = true;
    Glitch.hit(0.8); Audio2.glitch();
    this.zarparPara({ porto: d.mapa, x: d.x, y: d.y, nome: d.nome,
                      zarpou: d.volta ? T.voltando : T.saindo(d.nome), chegou: d.volta ? T.voltou : T.saiu(d.nome) });
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
    // AS DISTORÇÕES ESPAÇO-TEMPO foram tiradas (o CAIO, 03/nov/2026: "tire as
    // distorções espaço-tempo"): nada abre mais
    if (DISTORCOES_TIRADAS) return;
    const { trocou } = distorcaoDeAgora(this.st);
    if (!trocou) return;
    this.avisar(DB.STORY.distorcao.abriu.replace("{ONDE}", ondeEla(this.st)));
    Audio2.tone(880, 0.1, "sine", 0.35);
    Audio2.tone(1318, 0.16, "sine", 0.28);
    this.game.autosave?.();
  }

  /** Ela no mapa em que você está — o desenho e o encosto saem daqui. */
  distorcaoNpc() {
    if (DISTORCOES_TIRADAS) return null;
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
      if (n.area) return x >= n.x && x < n.x + n.area.w && y >= n.y && y < n.y + n.area.h;
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
    // o GELO dá pra pisar (escorrega — ver `andarLivre`)
    if (t === DB.TAG.ICE) return !!this.obstaculoEm(x, y) || !!this.npcAt(x, y);
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

  warpAt(x, y) {
    // a escada da FONTE DE CELADON só existe com a fonte seca (src/data/fonte-celadon.js)
    return (this.geo?.warps || []).find((w) => w.x === x && w.y === y && (!w.fonteSecreta || this.fonteSeca()));
  }

  /** a FONTE DE CELADON já foi esvaziada pelo botão escondido? */
  fonteSeca() { return !!this.st.flags?.[DB.FONTE_CELADON?.flag]; }

  /** O BOTÃO ESCONDIDO na borda da fonte: apertou, a água escoa e a escada aparece */
  botaoDaFonte() {
    const T = DB.FONTE_TEXTO;
    if (this.fonteSeca()) return void this.dlg.say(T.jaAberta);
    this.dlg.say(T.achou, () => this.dlg.ask(T.apertar, T.sim, (i) => {
      if (i !== 0) return;
      this.st.flags[DB.FONTE_CELADON.flag] = true;
      Audio2.noise(0.6, 0.5);
      Audio2.tone(196, 0.3, "sine", 0.4);
      this.tremor = 0.6;
      this.game.autosave?.(true);
      this.dlg.say(T.escoou);
    }));
  }
  facing() {
    const p = this.st.player;
    const d = DIRS[p.dir];
    return { x: p.x + d[0], y: p.y + d[1] };
  }
  /** posição em pixel; `withHop` só pro desenho — a câmera ignora o arco do pulo */
  playerPixel(withHop = false) {
    const p = this.st.player;
    let px = p.x * TILE, py = p.y * TILE;
    if (this.sub && this.subMapa === p.map) { px += this.sub.x; py += this.sub.y; }   // ANDAR LIVRE
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
    // um 3D ALTO logo acima de você: a câmera sobe pra ele caber (`panAlvo`)
    if (this.panGigante) this.cam.y = Math.max(0, this.cam.y - Math.round(this.panGigante));
  }

  // -------------------------------------------------------------- update
  update(dt) {
    // O REENCONTRO do RATICATE com o AZUL: ninguém anda enquanto passa
    if (this.reencontro) return void this.atualizarReencontro(dt);
    // conversa nenhuma na tela: ninguém está falando (um talkTo que abriu loja
    // ou batalha sem dizer nada não pode deixar o NPC dono da próxima fala)
    if (!this.dlg.active && !this.dlg.choice) this.dlg.falante = null;
    // a MÚSICA DA CONVERSA acabou junto com a conversa: volta a do lugar
    if (this.musicaConversa && !this.dlg.active && !this.dlg.choice && !this.fx && !this.menu) {
      this.musicaConversa = null;
      this.game.music(this.map.music);
    }
    // A SALA DA LIGA SE TRANSFORMANDO (src/data/liga-kanto.js): ninguém anda
    // O ROTOMFONE (src/data/rotomfone.js): de vez em quando alguém liga
    this.talvezLigarMissingno();
    this.talvezTocarRotomfone(dt);
    // OS SELVAGENS 3D (src/data/selvagem3d.js): o WAILORD nadando solto no mar
    this.atualizarSelvagens3D(dt);
    // AS METAS (src/systems/metas.js): cumpriu ou quebrou, o mapa conta
    if (!this.aviso || this.aviso.t <= 0) { const r = recadoDasMetas(this.st); if (r) this.avisar(r); }
    // O SURTO EM MASSA (src/systems/surtos.js): de vez em quando começa um perto de
    // você; e entrar no mapa do surto avisa
    this.surtoT = (this.surtoT || 0) - dt;
    if (this.surtoT <= 0 && !this.dlg.active) {
      this.surtoT = 3;
      const novo = talvezComecarSurto(this.st);
      if (novo) {
        this.avisar(textoDoSurto(novo.mapa === this.st.player.map ? "aqui" : "comecou", novo));
        this.surtoAvisadoEm = novo.mapa === this.st.player.map ? novo.mapa + novo.ate : null;
        Audio2.tone(523, 0.08); Audio2.tone(784, 0.12);
      }
      const s = surtoAtivo(this.st);
      if (s && s.mapa === this.st.player.map && this.surtoAvisadoEm !== s.mapa + s.ate) {
        this.surtoAvisadoEm = s.mapa + s.ate;
        this.avisar(textoDoSurto("aqui", s));
      }
    }
    // A SEMANA DO SHINY (src/data/eventos.js): a tarja avisa uma vez por vez que o jogo abre
    if (!this.avisouSemanaShiny && this.map && !this.dlg.active) {
      this.avisouSemanaShiny = true;
      // (e o TERROR ALFA, e qualquer outro evento aberto que traga `aviso`)
      const dd = (n) => String(n).padStart(2, "0");
      const avisos = (DB.EVENTOS || []).filter((e) => e.aviso && janelaAberta(e)).map((e) => {
        const ate = janelaAberta(e).ate;
        return e.aviso.replace("{ATE}", `${dd(ate.dia)}/${dd(ate.mes)}`);
      });
      if (avisos.length) { this.avisar(avisos.join("  ")); Audio2.shiny?.(); }
    }
    if (this.trocaDaLiga(dt)) return;
    // A SALA DA LIGA DE BRAGLITCH: os braços robóticos trocando a sala (src/systems/ligabrag.js)
    if (trocaLigaBrag(this, dt)) return;
    if (trocaLigaVoid(this, dt)) return;         // a LIGA DO VOID derretendo (src/systems/ligavoid.js)
    // O ENCAIXE da insígnia de Braglitch que acabou de ganhar (src/scenes/encaixe.js)
    if (this.st.flags?.encaixePendente && !this.dlg.active && !this.fadeDir && !(this.fadeA > 0) && !this.menu) {
      const id = this.st.flags.encaixePendente;
      this.st.flags.encaixePendente = null;
      this.game.scenes.push(new EncaixeScene(), { id });
      return;
    }
    // A ÁRVORE OCA: a porta abrindo e o GUZZLORD correndo atrás (src/systems/arvoreoca.js)
    if (updateArvore(this, dt)) return;
    // O HALL DA FAMA: chegou campeão, o CARVALHO registra o time
    this.talvezHallDaFama();
    if (this.omelete) return this.comerOmelete(dt);
    // no BONDINHO não se anda nem se abre menu: a cabine vai sozinha
    if (this.viagemBondinho) return this.andarDeBondinho(dt);
    // na LANCHA também não: a IPÊ dirige
    if (this.viagemLancha) return this.andarDeLancha(dt);
    // nem enquanto a CRIANÇA DO PRETO corre até você
    if (this.criancaCorre) return this.correrCrianca(dt);
    this.banner = Math.max(0, this.banner - dt);
    // O OBJETIVO aparece depois de 1 s parado: sem passo, sem conversa, sem menu
    // (andando livre não tem `move`: quem diz que está andando é `andandoLivre`)
    const parado = !this.move && !this.andandoLivre && !this.dlg.active && !this.menu && !this.fx && !(this.fadeA > 0) && !(this.banner > 0) && !this.gigante && !this.zygCena;
    this.paradoT = parado ? (this.paradoT || 0) + dt : 0;
    this.invuln = Math.max(0, (this.invuln || 0) - dt);
    this.tremor = Math.max(0, (this.tremor || 0) - dt * 3);
    this.clarao = Math.max(0, (this.clarao || 0) - dt * 2.4);
    if (this.aviso) { this.aviso.t -= dt; if (this.aviso.t <= 0) this.aviso = null; }
    if (this.olhando) this.olhando.t += dt;
    if (giganteDaUrl() && !this.gigante && !this.move && !this.fadeDir) this.talvezGigante();
    // a câmera sobe quando tem um 3D alto logo acima de você (`panAlvo`)
    const pan = this.panAlvo(), antes = this.panGigante || 0;
    if (pan !== antes) {
      this.panGigante = Math.abs(pan - antes) < 0.5 ? pan : antes + (pan - antes) * Math.min(1, dt * 5);
      this.snapCamera();
    }
    if (this.gigante && this.andarGigante(dt)) return;
    if (this.zygCena && this.andarZygarde(dt)) return;
    if (this.cenaMiniors) return void this.andarMiniors(dt);
    Glitch.level = this.st.corruption;
    // BRAGLITCH VIROU GLITCH (`flags.bragGlitch`): lá a tela suja como a de
    // Kanto quebrado. Voltando pra Kanto, o `forced` sai das fontes de lá.
    // (vencido o MISSINGNO de lá, Braglitch se acalma: a tela volta a ficar limpa)
    if (emBraglitch(this.st.player.map) && this.st.flags?.bragGlitch && !this.st.flags?.bragMissingnoVencido) {
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
      if (this.fx.t >= (this.fx.dur || 0.95)) { const cb = this.fx.cb; this.fx = null; cb?.(); }
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
      this.sub = { x: 0, y: 0 };               // passo de grade (pulo, empurrão, voo): sai do meio do tile
      this.move.n++;
      if (this.move.n >= this.move.total) {
        const p = this.st.player;
        p.x += this.move.dx; p.y += this.move.dy;
        this.move = null;
        this.chegouNoTile();
      }
      this.snapCamera();
      this.gravarRastro();
      return;
    }
    if (this.compaK < 1) this.compaK = Math.min(1, this.compaK + dt * 60 / passo(WALK));

    if (this.resgate) return this.atualizaResgate(dt);   // o fim do PÓS-PÓS-GAME: a onda e o barco
    if (this.posPosConfere()) return;           // o PÓS-PÓS-GAME começando (ou acabando)
    if (this.entregarLendas()) return;          // lenda vencida esperando pra entrar no time
    if (this.chefeDaIlhaCaiu()) return;         // venceu o chefe: a IPÊ leva pra próxima ilha
    if (this.glitchChegaEmBraglitch()) return;  // a sexta lenda entrou: o MISSINGNO chega
    if (this.avisarRoupasNovas()) return;       // venceu um líder: a ROUPA dele (src/data/roupas.js)
    if (this.cenaBill) return this.andarCenaBill(dt);   // o BILL voltando a ser gente
    if (Input.consume("b")) return this.openMenu();
    // NA BOLA (capturado): quem anda é o dono, e ele anda sozinho, caçando.
    // Você só olha — e abre o menu pra sair.
    if (this.st.capturado?.naBola) return this.andarDentroDaBola(dt);
    if (Input.consume("a")) return this.interact();
    if (Input.consume("ceu")) return this.olharOCeu();

    // O CHAT: T abre a caixa de digitar (com a sala ligada)
    if (Input.consomeTecla("KeyT") && Net.ligado()) {
      this.menu = { type: "chat" };
      Texto.comeca("", DB.ONLINE?.maxChat || 40);
      return;
    }
    // V: o ASSOBIO, que chama os bravos e os curiosos
    if (Input.consomeTecla("KeyV")) this.assobiar();
    if (this.assobio && this.assobio.t < 0.75) return;     // assobiando: fica parado
    // K: quem te segue ATACA (a animação de ataque do MYSTERY DUNGEON dele)
    // (no estilo TEMPO REAL é a LUTA NO MAPA: src/systems/lutamapa.js)
    if (Input.consomeTecla("KeyK") && !(lutaLigada(this) && atacarNaLuta(this))) this.compaAtacar();
    andarLuta(this, dt);
    this.musicaDoSurf();
    this.andarLivre(dt);
    this.snapCamera();                        // andando livre a câmera vai junto, todo quadro
    this.gravarRastro();
    this.bumpCd = Math.max(0, (this.bumpCd || 0) - dt);
  }

  /** Chegou num tile novo (passo de grade ou andando livre): conta o passo e
   *  faz o que o chão faz (porta, mato, selvagem...). */
  chegouNoTile() {
    // a ESCADA do SUBTERRÂNEO: pisou, pergunta se sobe
    const p0 = this.st.player;
    if (this.noSubterraneo() && this.geo?.escadas?.some((e) => e.x === p0.x && e.y === p0.y)) {
      this.andandoLivre = false;
      return void this.perguntarSubir();
    }
    // o BURACO DA BASE (o kit PRA BAIXO): pisou, desce — o seu, ou o de outro jogador
    const buraco = baseNaPorta(this.st, p0.map, p0.x, p0.y);
    if (buraco?.tipo === "chao") { this.andandoLivre = false; return void this.entrarNaBase(buraco); }
    const deOutro = Online.baseNaPorta?.(p0.map, p0.x, p0.y);
    if (deOutro) { this.andandoLivre = false; return void this.visitarBase(deOutro); }
    this.stepParity ^= 1;
    this.passosDados = (this.passosDados || 0) + 1;   // o ciclo do andar (quadroAndarT)
    if (this.map?.submerso && this.pisouNoCardume()) return;
    // quem ficou na creche cresce a cada passo seu; quem anda com você
    // gosta mais de você — e os bebês evoluem por isso
    const r = Creche.andou(this.st);
    this.onArrive();
    if (r.amigos.length && !this.menu && !this.dlg.active) {
      this.dlg.say(DB.STORY.creche.amigo.replace("{MON}", r.amigos[0].nickname), () => this.rodarEvolucao());
    }
  }

  /** NADANDO EM KANTO toca a do SURFAR do FireRed (frSurf); saiu da água,
   *  volta a do lugar. Confere a música que está tocando (e não só quando
   *  muda), porque a batalha e a troca de mapa põem a do lugar de volta. */
  musicaDoSurf() {
    const surf = DB.MUSIC?.frSurf;
    if (!surf) return;
    const kanto = regiaoDoMapa(this.st.player.map) === "kanto";
    const quer = !!(this.st.surfando && kanto && !this.map?.interior);
    const tocando = Audio2.musicaAtual === surf;
    if (quer && !tocando) this.game.music("frSurf");
    else if (!quer && tocando) this.game.music(this.map.music);
  }

  // ===================================================== O PÓS-PÓS-GAME
  // (src/data/pos-pos.js, src/systems/pospos.js) KYOGRE e GROUDON surtaram:
  // Kanto seca, Braglitch alaga, e os dois brigam na ILHA DA RUÍNA (ROTA 20).
  /** (no resgate, depois da onda, o mar já voltou) */
  get posPosSeco() { return PosPos.seco(this.st, this.st.player.map) && !(this.resgate && this.resgate.fase !== "onda"); }
  get posPosAlagado() { return PosPos.alagado(this.st, this.st.player.map); }
  get posPosIlha() {
    const P = DB.POS_POS;
    if (this.resgate && this.resgate.fase !== "onda") return null;   // a ilha afundou
    return P && this.st.player.map === P.ilha.mapa && PosPos.ativo(this.st) ? PosPos.ilhaDaRuina() : null;
  }

  /** começa (a ligação do PROF. CARVALHO) ou acaba (venceu a briga) */
  posPosConfere() {
    const P = DB.POS_POS, st = this.st;
    if (!P || this.dlg.active || this.menu) return false;
    if (PosPos.podeComecar(st) && temCeu(this.map) && !st.voando) {
      st.flags.ppComecou = true;
      st.surfando = null;
      Glitch.hit(2.2); Audio2.noise(0.9, 0.9); Audio2.tone(55, 0.8, "sawtooth", 0.9);
      this.game.autosave?.(true);
      this.dlg.say(P.comeca);
      return true;
    }
    if (PosPos.ativo(st) && st.npcState[`${P.ilha.mapa}.pp_briga`]?.defeated && st.player.map === P.ilha.mapa) {
      // A ÁGUA VOLTA: a onda vem correndo atrás de você (`atualizaResgate`)
      this.dlg.say(P.calmos, () => {
        this.resgate = { fase: "onda", t: 0, frente: this.geo.w * TILE + 40, som: 0 };
      });
      return true;
    }
    return false;
  }

  /** KYOGRE e GROUDON na ilha (um de cada lado do meio da ruína), e os
   *  MAGIKARP pulando no seco nos mapas de Kanto que secaram */
  posPosNpcs() {
    const out = [];
    const ilha = this.posPosIlha;
    if (ilha?.k && !this.st.npcState[`${DB.POS_POS.ilha.mapa}.pp_briga`]?.defeated) {
      out.push({ id: "pp_briga", x: ilha.k.x - 1, y: ilha.k.y, dir: "right", sprite: "mon:kyogre", ppBriga: true });
      out.push({ id: "pp_briga_g", x: ilha.k.x + 1, y: ilha.k.y, dir: "left", sprite: "mon:groudon", ppBriga: true });
    }
    if (this.posPosSeco && this.geo) {
      // uns MAGIKARP no seco: sempre nos mesmos lugares do mapa (onde era água)
      const g = this.geo;
      let n = 0;
      for (let i = 7; i < g.tags.length && n < 6; i += 97) {
        if (g.tags[i] !== "3") continue;
        const x = i % g.w, y = (i / g.w) | 0;
        if (this.posPosIlha && x >= this.posPosIlha.x - 1 && x <= this.posPosIlha.x + this.posPosIlha.w) continue;
        out.push({ id: `pp_karp_${n++}`, x, y, dir: "down", sprite: "mon:magikarp", magikarpSeco: true });
      }
    }
    return out;
  }

  brigaDosLendarios() {
    const P = DB.POS_POS;
    const key = `${P.ilha.mapa}.pp_briga`;
    this.dlg.say(P.briga, () => {
      const foes = ["kyogre", "groudon"].filter((id) => DB.SPECIES[id]).map((id) => createMon(id, P.nivel));
      const b = { foes, boss: true };
      this.entrarEmBatalha("chefe", b, () =>
        this.game.scenes.push(new GrupoBattleScene(), { tamanho: 2, foes, npcKey: key }));
    });
  }

  /** o chão do pós-pós-game: a LAMA rachada onde era mar (Kanto), a ILHA DA
   *  RUÍNA (o pedaço do desenho do fundo da ROTA 20) e a ÁGUA RASA por cima do
   *  chão de Braglitch */
  desenharPosPosChao(ctx, cx, cy) {
    const seco = this.posPosSeco, alagado = this.posPosAlagado;
    if (!seco && !alagado) return;
    const g = this.geo;
    const x0 = Math.max(0, Math.floor(cx / TILE)), y0 = Math.max(0, Math.floor(cy / TILE));
    const x1 = Math.min(g.w - 1, Math.floor((cx + W) / TILE)), y1 = Math.min(g.h - 1, Math.floor((cy + H) / TILE));
    const t = performance.now() / 1000;
    for (let ty = y0; ty <= y1; ty++) {
      for (let tx = x0; tx <= x1; tx++) {
        const tag = g.tags.charCodeAt(ty * g.w + tx) - 48, x = tx * TILE - cx, y = ty * TILE - cy;
        // (no resgate a onda já cobriu tudo que ficou atrás dela)
        if (seco && tag === DB.TAG.WATER && !(this.resgate && tx * TILE >= this.resgate.frente)) desenharLama(ctx, x, y, tx, ty);
        if (alagado && (tag === DB.TAG.FREE || tag === DB.TAG.GRASS)) {
          ctx.fillStyle = "rgba(60,140,200,0.38)";
          ctx.fillRect(x, y, TILE, TILE);
          // as ondinhas mexendo
          const o = Math.floor((t * 4 + tx * 3 + ty * 5) % 8);
          ctx.fillStyle = "rgba(220,245,255,0.45)";
          ctx.fillRect(x + o + 2, y + 5 + ((tx + ty) % 3) * 3, 4, 1);
        }
      }
    }
    // a ILHA DA RUÍNA: o desenho do fundo, no mesmo lugar
    const ilha = this.posPosIlha;
    if (ilha) {
      const art = mapArt(`fundo_${DB.POS_POS.ilha.mapa}`);
      if (art) ctx.drawImage(art, ilha.x * TILE, ilha.y * TILE, ilha.w * TILE, ilha.h * TILE,
                             ilha.x * TILE - cx, ilha.y * TILE - cy, ilha.w * TILE, ilha.h * TILE);
    }
  }

  // ------------------------------------------------ O RESGATE (o fim)
  // A onda corre atrás de você (o mar voltando) → você aparece na ILHA de
  // pertinho (a das SEAFOAM) → chega o BARCO do resgate, dirigido pelo ROBÔ do
  // PROF. CARVALHO com um NOSEPASS do lado, trazendo a IPÊ, o CARVALHO, o VÍTOR,
  // o ANDRÉ, os dois da região onde você NÃO começou e o do outro gênero da
  // sua → cada um fala → o barco te leva pra casa.
  quemVemNoBarco() {
    const st = this.st, kanto = st.regiao !== "braglitch", menino = st.player?.genero !== "menina";
    const H = { hero: "VERMELHO", heroina: "FOLHA", hero_brag: "CAIO", heroina_brag: "LARA" };
    const meus = kanto ? ["hero", "heroina"] : ["hero_brag", "heroina_brag"];
    const outros = kanto ? ["hero_brag", "heroina_brag"] : ["hero", "heroina"];
    const oposto = meus[menino ? 1 : 0];
    return [
      { sprite: DB.PROFS?.carvalho?.sprite || "prof", nome: "PROF. CARVALHO" },
      { sprite: DB.PROFS?.ipe?.sprite || "ipe", nome: "IPÊ" },
      { sprite: "vitor", nome: "VÍTOR" }, { sprite: "andre", nome: "ANDRÉ" },
      ...outros.map((s) => ({ sprite: s, nome: H[s] })),
      { sprite: oposto, nome: H[oposto] },
    ];
  }

  atualizaResgate(dt) {
    const r = this.resgate, p = this.st.player, P = DB.POS_POS;
    r.t += dt;
    if (r.fase === "onda") {
      // a onda vem da direita, mais rápida que você; você corre pra esquerda
      r.frente -= 130 * dt;
      this.sub ||= { x: 0, y: 0 };
      this.sub.x -= 78 * dt;
      while (this.sub.x < -TILE / 2) { p.x -= 1; this.sub.x += TILE; }
      p.dir = "left";
      this.andandoLivre = true;
      this.passoLivre = (this.passoLivre || 0) + 78 * dt;
      this.snapCamera();
      r.som -= dt;
      if (r.som <= 0) { r.som = 0.45; Audio2.noise(0.4, 0.5); Glitch.hit(0.25); }
      if (r.t > 2.8) {
        r.fase = "indo";
        this.andandoLivre = false;
        Audio2.noise(0.8, 0.9);
        this.transition(() => {
          const ilha = P.salvo || { x: 76, y: 5 };
          p.x = ilha.x; p.y = ilha.y; p.dir = "right";
          this.sub = { x: 0, y: 0 };
          this.resgate = { fase: "barco", t: 0, bx: (p.x + 16) * TILE, alvo: (p.x + 2) * TILE, by: (p.y - 2) * TILE + 6 };
          this.snapCamera();
        });
      }
      return;
    }
    if (r.fase === "barco") {
      r.bx = Math.max(r.alvo, r.bx - 52 * dt);
      this.snapCamera();
      this.cam.x = Math.max(0, Math.min(this.geo.w * TILE - W, this.cam.x + 56));
      if (r.bx <= r.alvo && r.t > 1) {
        r.fase = "falas";
        Audio2.tone(523, 0.08); Audio2.tone(659, 0.08); Audio2.tone(784, 0.12);
        const linhas = this.quemVemNoBarco().map((q) => `${q.nome}: ${P.falas?.[q.sprite] || P.falas?.padrao || "..."}`);
        this.dlg.say([...P.chegou, ...linhas, ...P.sobe], () => {
          r.fase = "sobe";
          this.transition(() => {
            const casa = this.st.regiao === "braglitch" ? (DB.BRAGLITCH?.porto?.mapa || "sao_lucario") : "pallet";
            const sp = DB.MAPS[casa]?.spawn || { x: 6, y: 8 };
            p.map = casa; p.x = sp.x; p.y = sp.y; p.dir = "down";
            this.st.flags.ppAcabou = true;
            this.st.surfando = null;
            this.resgate = null;
            this.afterTravel();
            this.game.music(this.map.music);
            Audio2.heal();
            this.game.autosave?.(true);
            this.dlg.say(P.acabou);
          });
        });
      }
      return;
    }
    // "falas" e "sobe": esperando a conversa ou a troca de tela
    this.snapCamera();
    if (r.fase === "falas") this.cam.x = Math.max(0, Math.min(this.geo.w * TILE - W, this.cam.x + 56));
  }

  /** a onda (uma parede de água com a espuma na frente) e o barco do resgate */
  desenharResgate(ctx, cx, cy) {
    const r = this.resgate;
    if (!r) return;
    const t = performance.now() / 1000;
    if (r.fase === "onda") {
      const x = Math.round(r.frente - cx);
      if (x < W) {
        ctx.fillStyle = "rgba(30,90,180,0.92)";
        ctx.fillRect(x + 6, 0, W - x, H);
        ctx.fillStyle = "rgba(90,160,230,0.9)";
        for (let y = 0; y < H; y += 2) ctx.fillRect(x + 4 + Math.round(Math.sin(y / 6 + t * 9) * 2), y, 6, 2);
        // a espuma: branca, mexendo, com respingo saindo pra frente
        ctx.fillStyle = "#f4fbff";
        for (let y = 0; y < H; y++) {
          const o = Math.round(Math.sin(y / 4 + t * 12) * 2 + Math.sin(y / 11 - t * 7) * 2);
          ctx.fillRect(x + o, y, 3, 1);
        }
        for (let k = 0; k < 24; k++) {
          const y = (k * 47 + t * 90) % H, o = ((k * 13 + t * 60) % 14);
          ctx.fillRect(x - o, Math.round(y), 1, 1);
        }
      }
      return;
    }
    if (r.fase === "indo") return;
    // O BARCO, balançando, com todo mundo no convés
    const b = barcoArt();
    const bx = Math.round(r.bx - cx), by = Math.round(r.by - cy + Math.sin(t * 2.2) * 1.2);
    ctx.drawImage(b.cv, bx, by);
    const gente = this.quemVemNoBarco();
    gente.forEach((q, i) => {
      const atras = i < 4;                          // duas fileiras no convés
      const gx = bx + 26 + (atras ? i : i - 4) * 16 + (atras ? 0 : 8), pe = by + (atras ? 14 : 27);
      const a = Assets.actor(q.sprite, false);
      const img = a?.left?.[0] || a?.down?.[0];
      if (img) ctx.drawImage(img, gx, pe - img.height);
    });
    // o ROBÔ no leme e o NOSEPASS do lado dele
    const robo = roboArt();
    ctx.drawImage(robo, bx + b.leme - 2, by + 22 - robo.height);
    const nose = this.monNaVista("nosepass", 7, "left");
    if (nose) ctx.drawImage(reduzido(nose, 22), bx + b.leme + 12, by + 22 - 22, 22, 22);
  }

  /** por cima de tudo: o SOL RACHANDO em Kanto e a CHUVA em Braglitch */
  desenharPosPosCeu(ctx) {
    const t = performance.now() / 1000;
    this.desenharResgate(ctx, this.cam.x, this.cam.y);
    if (this.posPosSeco) {
      ctx.fillStyle = `rgba(255,170,60,${0.14 + 0.03 * Math.sin(t * 1.3)})`;
      ctx.fillRect(0, 0, W, H);
    } else if (this.posPosAlagado) {
      ctx.fillStyle = "rgba(20,40,80,0.22)";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(200,225,255,0.5)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let k = 0; k < 70; k++) {
        const x = ((k * 37.7 + t * 40) % (W + 20)) - 10, y = ((k * 53.3 + t * 260) % (H + 20)) - 10;
        ctx.moveTo(x, y); ctx.lineTo(x - 2, y + 7);
      }
      ctx.stroke();
    }
  }

  /** Z num jogador da sala: o mesmo convite do menu ONLINE. Com um BONECO DA
   *  IA, a batalha e a troca são as COMUNS (`batalharComBoneco`, `trocarComBoneco`). */
  chamarJogador(o) {
    const T = DB.ONLINE_TEXTO || {};
    const nome = o.nome || "?";
    const ia = DB.BONECOS_IA?.[o.id];
    if (ia) {
      return void this.dlg.ask(`${nome}: E AÍ, O QUE VAMOS FAZER?`, ["BATALHAR", "TROCAR", "NADA"], (i) => {
        if (i === 0) this.batalharComBoneco(o, ia);
        else if (i === 1) this.trocarComBoneco(o, ia);
      });
    }
    this.dlg.ask(`${nome}: E AÍ, O QUE VAMOS FAZER?`, ["BATALHAR", "BATALHA 2X2", "TROCAR", "NADA"], (i) => {
      if (i === 3) return;
      const modo = i === 2 ? "troca" : "batalha", formato = i === 1 ? "dupla" : "simples";
      if (modo === "batalha" && !this.st.party.some((m) => m.hp > 0)) return void this.dlg.say(T.batalhaSemTime || "SUA EQUIPE NÃO TEM NINGUÉM DE PÉ.");
      if (modo === "troca" && this.st.party.length < 2) return void this.dlg.say(T.trocaUltimo || "VOCÊ NÃO PODE TROCAR O ÚLTIMO DA EQUIPE.");
      if (!Online.convidar(o.id, modo, formato)) return void this.dlg.say(T.semServidor || "NÃO DEU PRA CHAMAR.");
      this.dlg.say(String(T.convidou || "CHAMOU {NOME}!").replace("{NOME}", nome));
    });
  }

  /** a média de nível da sua equipe (o time do boneco vem nesse nível) */
  nivelDaEquipe() {
    const ns = this.st.party.map((m) => m.level || 1);
    return Math.max(2, Math.min(100, Math.round(ns.reduce((a, b) => a + b, 0) / Math.max(1, ns.length))));
  }

  /** BATALHA COMUM com um boneco: a de treinador, com a tela de sempre */
  batalharComBoneco(o, ia) {
    if (!this.st.party.some((m) => m.hp > 0)) return void this.dlg.say(DB.ONLINE_TEXTO?.batalhaSemTime || "SUA EQUIPE NÃO TEM NINGUÉM DE PÉ.");
    const nivel = this.nivelDaEquipe();
    const time = [...ia.time].sort(() => Math.random() - 0.5).slice(0, 3).filter((id) => DB.SPECIES[id]);
    const trainer = { name: o.nome, sprite: ia.retrato, prize: nivel * 60, party: time.map((id) => ({ id, lvl: nivel })) };
    Net.manda("vamosBatalhar", {}, o.id);          // o boneco para e fala alguma coisa
    this.dlg.say(`${o.nome}: BORA! VOU COM TUDO!`, () => {
      this.entrarEmBatalha("treinador", { trainer }, () =>
        this.game.scenes.push(new BattleScene(), { trainer, npcKey: `online.${o.id}` }));
    });
  }

  /** TROCA COMUM com um boneco: a de NPC — você escolhe quem dá, ele oferece um
   *  dele no mesmo nível, e o filme da troca */
  trocarComBoneco(o, ia) {
    const st = this.st;
    const nomes = st.party.map((m) => `${m.nickname} N${m.level}`.slice(0, 16));
    this.dlg.ask(`${o.nome}: QUEM VOCÊ ME DÁ?`, [...nomes.slice(0, 6), "VOLTAR"], (k) => {
      const meu = st.party[k];
      if (!meu || k >= 6) return;
      const esp = ia.trocas[Math.floor(Math.random() * ia.trocas.length)];
      const sp = DB.SPECIES[esp];
      if (!sp) return;
      this.dlg.ask(`${o.nome}: EU TE DOU MEU ${sp.name} N${meu.level}. FECHADO?`, ["TROCAR", "NÃO"], (i) => {
        if (i !== 0) return void this.dlg.say(`${o.nome}: TUDO BEM, FICA PRA PRÓXIMA!`);
        const j = st.party.indexOf(meu);
        if (j < 0) return;
        const novo = createMon(esp, meu.level, { shiny: shiniesLiberados(st) && Math.random() < 0.02 });
        novo.ot = o.nome;
        novo.trocado = true;
        st.party[j] = novo;
        st.seen[esp] = st.caught[esp] = true;
        this.game.autosave?.(true);
        Net.manda("trocaComum", { deu: meu.species }, o.id);
        this.game.scenes.push(new TrocaNpcScene(), {
          meu, novo, dono: o.nome, onDone: () => this.dlg.say(`${o.nome}: VALEU! CUIDA BEM DO ${sp.name}!`),
        });
      });
    });
  }

  // ============================================================== O CHAT
  /** A CAIXINHA DO CHAT no canto de baixo: as últimas mensagens da sala (somem
   *  depois de 15 segundos; digitando, aparecem todas) e, digitando, a linha
   *  com o que você está escrevendo. T abre; ENTER manda; ESC desiste. */
  drawChat(ctx) {
    if (!DB.ONLINE?.ativo) return;
    const digitando = this.menu?.type === "chat";
    const agora = performance.now(), VIDA = 15000;
    const msgs = (Online.historico || []).filter((m) => digitando || agora - m.t < VIDA).slice(digitando ? -7 : -4);
    if (!msgs.length && !digitando) return;
    const base = digitando ? H - 30 : H - 6;
    msgs.forEach((m, k) => {
      const y = base - (msgs.length - k) * 9;
      const a = digitando ? 1 : Math.max(0, Math.min(1, (VIDA - (agora - m.t)) / 2500));
      const linha = `${m.nome}: ${m.texto}`.slice(0, 38);
      ctx.globalAlpha = a * 0.55;
      ctx.fillStyle = "#0a0614";
      ctx.fillRect(2, y - 1, linha.length * 6 + 4, 9);
      ctx.globalAlpha = a;
      const ia = m.nome.endsWith("-IA");          // os bonecos da IA (online_robos.py)
      drawText(ctx, linha, 4, y, m.meu ? "#ffe27a" : ia ? "#7fd3ff" : "#f4f4f4");
    });
    ctx.globalAlpha = 1;
    if (digitando) {
      panel(ctx, 2, H - 26, W - 4, 24);
      const cursor = Math.floor(agora / 400) % 2 ? "_" : " ";
      drawText(ctx, `> ${Texto.buf()}${cursor}`.slice(-37), 8, H - 21, PAL.ink);
      drawText(ctx, "ENTER MANDA   ESC SAI", 8, H - 12, PAL.ink2);
    }
  }

  // ===================================================== O PORTAL PARADOXO
  // (src/data/portal-paradoxo.js) Na praia de SÃO LUCARIO, depois do KYOGRE e
  // do GROUDON. Quatro itens viram quatro RUNAS; a combinação leva pro mapa
  // secreto de um POKÉMON SECRETO. Lá dentro, um portal pequeno te traz de volta.
  receitaDoMapa(id = this.st.player.map) {
    return String(id).startsWith("paradoxo_")
      ? (DB.RECEITAS_PORTAL || []).find((r) => `paradoxo_${r.id}` === id) || null : null;
  }

  portalNpcs() {
    const P = DB.PORTAL, aqui = this.st.player.map, out = [];
    if (P && aqui === P.mapa && this.st.flags?.[P.requer]) {
      out.push({ id: "portal_paradoxo", x: P.x, y: P.y, dir: "down", sprite: "portal", portal: true });
    }
    const r = this.receitaDoMapa(aqui);
    if (r) {
      const g = r.geo;
      out.push({ id: "portal_volta", x: g.entrada.x + 1, y: g.entrada.y, dir: "down", sprite: "portal", portalVolta: true });
      const k = `${aqui}.guardiao`;
      if (DB.SPECIES[r.especie] && !this.st.caught?.[r.especie] && !this.st.npcState[k]?.defeated) {
        out.push({ id: "guardiao", x: g.guardiao.x, y: g.guardiao.y, dir: "down", sprite: `mon:${r.especie}`,
                   boss: { id: r.especie, lvl: r.nivel || P.nivel }, lines: r.encontro || [] });
      }
    }
    return out;
  }

  /** os itens da mochila que viram runa (com quantos ainda sobram fora das casas) */
  itensDeRuna(m) {
    const usados = {};
    for (const it of m?.casas || []) usados[it] = (usados[it] || 0) + 1;
    return Object.entries(this.st.items || {})
      .filter(([it, n]) => n > 0 && runaDoItem(it, DB.MEGA_PEDRAS || {}))
      .map(([it, n]) => ({ item: it, runa: runaDoItem(it, DB.MEGA_PEDRAS || {}), sobra: n - (usados[it] || 0) }))
      .filter((x) => x.sobra > 0)
      .sort((a, b) => a.runa.localeCompare(b.runa) || a.item.localeCompare(b.item));
  }

  abrirPortal() {
    const T = DB.PORTAL.textos;
    Audio2.glitch();
    this.dlg.say(T.olha, () => {
      const m = { type: "portal", index: 0, casas: [] };
      if (!this.itensDeRuna(m).length) return void this.dlg.say(T.semItem);
      this.menu = m;
    });
  }

  updatePortal(m) {
    const T = DB.PORTAL.textos, lista = this.itensDeRuna(m);
    const n = Math.max(1, lista.length);
    m.index = Math.min(m.index, n - 1);
    if (Input.consume("up")) { m.index = (m.index + n - 1) % n; Audio2.blip(); }
    if (Input.consume("down")) { m.index = (m.index + 1) % n; Audio2.blip(); }
    if (Input.consume("b")) {
      if (m.casas.length) { m.casas.pop(); Audio2.cancel(); }
      else { this.menu = null; Audio2.cancel(); }
      return;
    }
    if (Input.consume("a") && lista[m.index] && m.casas.length < 4) {
      m.casas.push(lista[m.index].item);
      Audio2.tone(392 + m.casas.length * 131, 0.08, "square", 0.5);
      Glitch.hit(0.2);
      if (m.casas.length === 4) {
        const runas = m.casas.map((it) => runaDoItem(it, DB.MEGA_PEDRAS || {}));
        const nomes = runas.map((r) => DB.RUNAS[r].nome).join(" + ");
        this.menu = null;
        this.dlg.ask(T.ativar.replace("{RUNAS}", nomes), T.sim, (i) => {
          if (i !== 0) { this.menu = { ...m, casas: m.casas.slice(0, 3) }; return; }
          this.ativarRunas(m.casas, runas);
        });
      }
    }
  }

  ativarRunas(casas, runas) {
    const T = DB.PORTAL.textos;
    const chave = chaveRunas(runas);
    const r = (DB.RECEITAS_PORTAL || []).find((x) => chaveRunas(x.runas) === chave);
    Glitch.hit(1.2); Audio2.glitch();
    // NÃO BATEU com receita nenhuma: o portal CUSPE UM BIZARRO (src/systems/bizarro.js) —
    // um NOVO a cada vez (nome, tipos e desenho sorteados na hora). Os itens vão junto.
    if (!r) {
      const semente = (sementeDasRunas(chave) ^ Math.floor(Math.random() * 4294967296) ^ Date.now()) >>> 0;
      const sp = garantirBizarro(idBizarro(semente));
      if (!sp) return void this.dlg.say(T.naoAbriu);
      for (const it of casas) this.spend(it, 1);
      const foe = createMon(sp.id, 40 + (semente % 25));
      this.dlg.say(T.bizarro.map((l) => l.replace("{MON}", sp.name)), () => {
        const b = { foe, boss: false };
        this.entrarEmBatalha("selvagem", b, () => this.game.scenes.push(new BattleScene(), b));
      });
      return;
    }
    if (!DB.SPECIES[r.especie] || !DB.KANTO[`paradoxo_${r.id}`]) return void this.dlg.say(T.aindaNao);
    // abriu: os quatro itens vão pro portal
    for (const it of casas) this.spend(it, 1);
    (this.st.portalAchados ||= {})[r.id] = true;
    this.dlg.say(T.abriu, () => {
      Audio2.noise(0.8, 0.8);
      this.transition(() => {
        const p = this.st.player, g = r.geo;
        this.st.voltaDoPortal = { map: p.map, x: p.x, y: p.y + 1, dir: "down" };
        p.map = `paradoxo_${r.id}`; p.x = g.entrada.x; p.y = g.entrada.y; p.dir = "up";
        this.afterTravel();
        this.game.music(this.map.music);
        this.game.autosave?.(true);
        if (r.chegada?.length) this.dlg.say(r.chegada);
      });
    });
  }

  voltarDoPortal() {
    const T = DB.PORTAL.textos;
    this.dlg.ask(T.volta, T.simVolta, (i) => {
      if (i !== 0) return;
      Audio2.glitch();
      this.transition(() => {
        const P = DB.PORTAL, p = this.st.player;
        const v = this.st.voltaDoPortal || { map: P.mapa, x: P.x, y: P.y + 1, dir: "down" };
        p.map = v.map; p.x = v.x; p.y = v.y; p.dir = v.dir || "down";
        this.st.voltaDoPortal = null;
        this.afterTravel();
        this.game.music(this.map.music);
        this.game.autosave?.(true);
      });
    });
  }

  renderPortal(ctx, m) {
    const T = DB.PORTAL.textos, lista = this.itensDeRuna(m), t = performance.now() / 1000;
    panel(ctx, 4, 4, W - 8, H - 8);
    drawText(ctx, T.titulo, 12, 10, PAL.glitch);
    // as QUATRO CASAS das runas, em cima
    for (let i = 0; i < 4; i++) {
      const x = 22 + i * 52, y = 22;
      ctx.fillStyle = "#14102a"; ctx.fillRect(x, y, 40, 40);
      ctx.strokeStyle = i === m.casas.length ? `rgba(0,255,204,${0.5 + 0.5 * Math.sin(t * 6)})` : "#3a3060";
      ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, 39, 39);
      const it = m.casas[i];
      if (it) desenharRuna(ctx, runaDoItem(it, DB.MEGA_PEDRAS || {}), x + 6, y + 6, 4, t);
    }
    // a lista dos itens que viram runa
    const VEZ = 5, top = Math.max(0, Math.min(lista.length - VEZ, m.index - 2));
    lista.slice(top, top + VEZ).forEach((x, k) => {
      const i = top + k, y = 70 + k * 12;
      if (i === m.index) cursor(ctx, 12, y);
      desenharRuna(ctx, x.runa, 22, y - 1, 1, t);
      drawText(ctx, `${x.item.toUpperCase().slice(0, 18)} x${x.sobra}`, 34, y, PAL.ink);
      drawText(ctx, DB.RUNAS[x.runa].nome, 176, y, DB.RUNAS[x.runa].cor);
    });
    drawText(ctx, T.ajuda + `${m.casas.length}/4`, 12, H - 22, PAL.ink2);
  }

  // ======================================================= O FUNDO DO MAR
  // (src/data/fundo-do-mar.js) Surfando em QUALQUER água dá pra mergulhar: o
  // mapa vira o `fundo_<id>`, no mesmo x,y. Quem te leva é quem estava te
  // levando na superfície (`st.mergulho.especie`). Subir é o contrário.
  mergulhar() {
    const p = this.st.player, fid = fundoDe(p.map), g = DB.KANTO[fid];
    if (!this.st.surfando || !g || this.map?.interior) return void this.dlg.say("AQUI NÃO DÁ PRA MERGULHAR.");
    if (g.tags[p.y * g.w + p.x] === "1") return void this.dlg.say("TEM ALGUMA COISA DURA BEM AQUI EMBAIXO. NADE UM POUCO PRO LADO.");
    const especie = this.st.surfando;
    Audio2.tone(392, 0.08); Audio2.tone(262, 0.12); Audio2.noise(0.25, 0.3);
    this.transition(() => {
      this.st.mergulho = { especie };
      this.st.surfando = null;
      p.map = fid;
      this.afterTravel();
      this.bolhas = [];
      const T = DB.FUNDO_TEXTO || {};
      const nome = DB.SPECIES[especie]?.name || "O POKÉMON";
      const msgs = [(T.mergulhou || "{MON} MERGULHOU COM VOCÊ!").replace("{MON}", nome)];
      // na primeira vez, o VISOR DE CARDUMES preso numa alga
      if (!this.st.flags.visorAchado) {
        this.st.flags.visorAchado = true;
        this.st.items[VISOR] = 1;
        msgs.push(...(T.achouVisor || []));
        Audio2.heal();
      }
      this.game.autosave?.(true);
      this.dlg.say(msgs);
    });
  }

  subir() {
    const p = this.st.player, cima = superficieDe(p.map);
    if (!cima || !DB.KANTO[cima]) return;
    const especie = this.st.mergulho?.especie || this.quemSabe("surfar")?.species || this.st.party[0]?.species;
    Audio2.tone(262, 0.06); Audio2.tone(523, 0.1);
    this.transition(() => {
      p.map = cima;
      this.st.surfando = especie;
      this.st.mergulho = null;
      this.afterTravel();
      this.game.autosave?.(true);
    });
  }

  /** o baú dos segredos, fechado ou aberto (pixel por pixel) */
  desenharBau(ctx, x, y, aberto) {
    const g = aberto ? [
      "................",
      "..kkkkkkkkkkkk..",
      ".kmmmmmmmmmmmmk.",
      ".kmMMMMMMMMMMmk.",
      ".kkkkkkkkkkkkkk.",
      ".kpppppppppppk..",
      ".kddddddddddddk.",
      ".kdooooooooood k",
      ".kmmmmmmmmmmmmk.",
      ".kmMmmmmmmmmMmk.",
      ".kmmmmmyymmmmmk.",
      ".kmMmmmyymmmMmk.",
      ".kmmmmmmmmmmmmk.",
      ".kkkkkkkkkkkkkk.",
    ] : [
      "................",
      "................",
      "................",
      "...kkkkkkkkkk...",
      "..kmmmmmmmmmmk..",
      ".kmMMMMMMMMMMmk.",
      ".kmmmmmmmmmmmmk.",
      ".kyyyyyyyyyyyyk.",
      ".kmmmmmmyymmmmk.",
      ".kmMmmmmyymmMmk.",
      ".kmmmmmmmmmmmmk.",
      ".kmMmmmmmmmmMmk.",
      ".kmmmmmmmmmmmmk.",
      ".kkkkkkkkkkkkkk.",
    ];
    const cor = { k: "#2a1a10", m: "#7a5232", M: "#9a6e44", y: "#d8b040", d: "#3a2414", o: "#f0d060", p: "#5a3a22" };
    g.forEach((linha, j) => {
      for (let i = 0; i < linha.length; i++) {
        const c = cor[linha[i]];
        if (c) { ctx.fillStyle = c; ctx.fillRect(x + i, y + 2 + j, 1, 1); }
      }
    });
  }

  /** A LUZ DO FUNDO: tudo azul (em Braglitch, verde-água), mais escuro embaixo
   *  da tela, os raios de sol entrando de viés, o brilho mexendo no chão e as
   *  bolhas — as que saem de você e as que sobem das algas. */
  drawSubmerso(ctx, cx, cy) {
    const t = performance.now() / 1000;
    const brag = !!(this.geo?.braglitch || this.geo?.regiao === "braglitch");
    const cor = brag ? "20,110,110" : "20,70,160";
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, `rgba(${cor},0.18)`);
    grad.addColorStop(1, `rgba(${cor},0.42)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    // os raios de sol, de viés, indo e voltando devagar
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let k = 0; k < 4; k++) {
      const x = ((k * 83 + t * 6 - cx * 0.3) % (W + 120) + W + 120) % (W + 120) - 60;
      const a = 0.05 + 0.03 * Math.sin(t * 0.7 + k * 2);
      ctx.fillStyle = `rgba(200,240,255,${a})`;
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x + 18 + k * 4, 0); ctx.lineTo(x - 30 + k * 4, H); ctx.lineTo(x - 52, H);
      ctx.fill();
    }
    // o brilho no chão (as ondas lá em cima fazendo desenho de luz)
    for (let k = 0; k < 26; k++) {
      const bx = ((k * 53.7 - cx) % W + W) % W, by = ((k * 37.3 - cy) % H + H) % H;
      const a = 0.04 + 0.04 * Math.sin(t * 1.6 + k * 1.7);
      ctx.fillStyle = `rgba(220,250,255,${Math.max(0, a)})`;
      ctx.fillRect(Math.round(bx + Math.sin(t + k) * 3), Math.round(by + Math.cos(t * 0.8 + k) * 2), 3 + (k % 3), 1);
    }
    ctx.restore();
    // AS BOLHAS
    const agora = t, dt = Math.min(0.1, agora - (this.bolhasT || agora));
    this.bolhasT = agora;
    const bolhas = (this.bolhas ||= []);
    const { px, py } = this.playerPixel();
    this.bolhaCd = (this.bolhaCd || 0) - dt;
    if (this.bolhaCd <= 0) {
      this.bolhaCd = 0.35 + Math.random() * 0.5;
      bolhas.push({ x: px + 8 + (Math.random() - 0.5) * 4, y: py + 2, r: 1 + Math.random() * 1.5, v: 14 + Math.random() * 8, f: Math.random() * 6, vida: 2.2 });
      // e uma das algas que aparecem na tela
      const tx = Math.floor((cx + Math.random() * W) / TILE), ty = Math.floor((cy + Math.random() * H) / TILE);
      if (this.tagAt(tx, ty) === DB.TAG.GRASS) {
        bolhas.push({ x: tx * TILE + 8, y: ty * TILE + 4, r: 0.8 + Math.random(), v: 10 + Math.random() * 6, f: Math.random() * 6, vida: 2.6 });
      }
    }
    ctx.strokeStyle = "rgba(220,250,255,0.75)";
    ctx.lineWidth = 0.5;
    for (let i = bolhas.length - 1; i >= 0; i--) {
      const b = bolhas[i];
      b.vida -= dt; b.y -= b.v * dt;
      if (b.vida <= 0) { bolhas.splice(i, 1); continue; }
      const x = b.x + Math.sin(agora * 3 + b.f) * 1.5 - cx, y = b.y - cy;
      ctx.beginPath(); ctx.arc(x, y, b.r, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.8)"; ctx.fillRect(x - b.r * 0.5, y - b.r * 0.5, 0.6, 0.6);
    }
    this.drawCardumes(ctx, cx, cy, agora);
  }

  // ------------------------------------------------- O VISOR DE CARDUMES
  // Um visor que fica NA CARA do jogador (pedido do CAIO). Usado pela
  // mochila, ele liga ou desliga; ligado, no fundo do mar ele mostra onde
  // estão os CARDUMES (e pra que lado fica o mais perto).
  /** o visor desenhado em cima dos olhos do herói (o quadro `img`, desenhado
   *  em dx,dy). A altura dos olhos sai do topo do desenho (o passo sobe e
   *  desce um pixel) */
  visorNaCara(ctx, img, dx, dy) {
    if (!this.st.flags?.visorNaCara || this.st.pokesave) return;
    const top = topoDoQuadro(img);
    if (top < 0) return;
    const dir = this.st.player.dir;
    const grade = dir === "up" ? VISOR_COSTAS : dir === "down" ? VISOR_FRENTE : VISOR_LADO;
    const espelho = dir === "right";
    const brilho = Math.floor(performance.now() / 140) % 12;   // o reflexo correndo na lente
    grade.forEach((linha, j) => {
      for (let i = 0; i < linha.length; i++) {
        let ch = linha[i];
        if (ch === ".") continue;
        if (ch === "c" && (i === 4 + brilho || i === 3 + brilho)) ch = "C";
        ctx.fillStyle = COR_VISOR[ch];
        ctx.fillRect(dx + (espelho ? linha.length - 1 - i : i), dy + top + 8 + j, 1, 1);
      }
    });
  }

  /** usa o visor pela mochila: põe ou tira */
  usarVisor() {
    this.menu = null;
    const T = DB.FUNDO_TEXTO || {};
    this.st.flags.visorNaCara = !this.st.flags.visorNaCara;
    Audio2.tone(this.st.flags.visorNaCara ? 880 : 440, 0.06); Audio2.tone(this.st.flags.visorNaCara ? 1320 : 330, 0.08);
    this.game.autosave?.(true);
    this.dlg.say(this.st.flags.visorNaCara ? T.botouVisor : T.tirouVisor);
  }

  /** OS CARDUMES do fundo: sorteados por mapa e por dia (todo dia eles mudam
   *  de lugar), um a quatro conforme o tamanho do mar. Pego (ou vencido), o
   *  cardume some até o dia seguinte. */
  cardumesAqui() {
    const p = this.st.player;
    if (this.cardumes && this.cardumes.mapa === p.map) return this.cardumes.lista;
    const g = this.geo, m = this.map, lista = [];
    if (g?.submerso && (m.encounters || []).length) {
      const dia = new Date().toISOString().slice(0, 10);
      let sem = [...(p.map + dia)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 17);
      const rnd = () => ((sem = (sem * 1103515245 + 12345) >>> 0) / 4294967296);
      let chao = 0;
      for (const c of g.tags) if (c === "0" || c === "2") chao++;
      const n = Math.max(1, Math.min(4, Math.round(chao / 350)));
      const peso = m.encounters.reduce((a, e) => a + e.w, 0);
      for (let i = 0; i < n; i++) {
        let x = 0, y = 0, ok = false;
        for (let k = 0; k < 60 && !ok; k++) {
          x = Math.floor(rnd() * g.w); y = Math.floor(rnd() * g.h);
          ok = g.tags[y * g.w + x] === "0" && !g.decor?.[`${x},${y}`] && !this.npcAt(x, y);
        }
        if (!ok) continue;
        let r = rnd() * peso, e = m.encounters[0];
        for (const q of m.encounters) { r -= q.w; if (r <= 0) { e = q; break; } }
        const chave = `${dia}|${p.map}|${i}`;
        if (this.st.cardumesPegos?.[chave]) continue;
        lista.push({ x, y, especie: e.id, nivel: e.max + 3, chave });
      }
    }
    this.cardumes = { mapa: p.map, lista };
    return lista;
  }

  drawCardumes(ctx, cx, cy, t) {
    const visor = !!this.st.flags?.visorNaCara;
    const lista = this.cardumesAqui();
    // sem o visor eles ainda estão lá — só que de longe parecem só uma sombra mexendo
    for (const c of lista) {
      const x = c.x * TILE + 8 - cx, y = c.y * TILE + 8 - cy;
      if (x < -30 || y < -30 || x > W + 30 || y > H + 30) continue;
      const n = visor ? 14 : 6;
      for (let k = 0; k < n; k++) {
        const a = t * (1.2 + (k % 3) * 0.3) + k * 2.4, r = 5 + (k % 4) * 2;
        const fx = x + Math.cos(a) * r, fy = y + Math.sin(a) * r * 0.55;
        ctx.fillStyle = visor ? (k % 2 ? "#ffe060" : "#ff9a40") : "rgba(10,30,60,0.35)";
        ctx.fillRect(Math.round(fx), Math.round(fy), 2, 1);
        ctx.fillRect(Math.round(fx - Math.sin(a) * 1.5), Math.round(fy), 1, 1);
      }
      if (visor) {
        // o anel do visor piscando em volta
        const pulso = (t * 1.5) % 1;
        ctx.strokeStyle = `rgba(56,216,240,${1 - pulso})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(x, y, 8 + pulso * 10, (8 + pulso * 10) * 0.6, 0, 0, Math.PI * 2); ctx.stroke();
      }
    }
    if (!visor) return;
    // o painelzinho do visor, em cima: quantos cardumes e a seta pro mais perto
    const { px, py } = this.playerPixel();
    let perto = null, dmin = Infinity;
    for (const c of lista) {
      const d = Math.hypot(c.x * TILE - px, c.y * TILE - py);
      if (d < dmin) { dmin = d; perto = c; }
    }
    ctx.fillStyle = "rgba(6,20,36,0.75)";
    ctx.fillRect(4, 4, 92, 16);
    ctx.strokeStyle = "#38d8f0"; ctx.lineWidth = 1; ctx.strokeRect(4.5, 4.5, 91, 15);
    drawText(ctx, `CARDUMES ${lista.length}`, 8, 8, "#38d8f0");
    if (perto) {
      const a = Math.atan2(perto.y * TILE - py, perto.x * TILE - px), ax = 86, ay = 12;
      ctx.fillStyle = "#e0ffff";
      ctx.beginPath();
      ctx.moveTo(ax + Math.cos(a) * 5, ay + Math.sin(a) * 5);
      ctx.lineTo(ax + Math.cos(a + 2.5) * 4, ay + Math.sin(a + 2.5) * 4);
      ctx.lineTo(ax + Math.cos(a - 2.5) * 4, ay + Math.sin(a - 2.5) * 4);
      ctx.fill();
    }
  }

  /** Encostou num cardume: ele vira UM bicho gigante (src/systems/cardume.js) */
  pisouNoCardume() {
    const p = this.st.player;
    const c = this.cardumesAqui().find((q) => Math.abs(q.x - p.x) <= 0 && Math.abs(q.y - p.y) <= 0);
    if (!c || !this.st.party.some((m) => m.hp > 0)) return false;
    const sp = garantirCardume(c.especie);
    if (!sp) return false;
    (this.st.cardumesPegos ||= {})[c.chave] = true;
    this.cardumes.lista = this.cardumes.lista.filter((q) => q !== c);
    const foe = createMon(idCardume(c.especie), Math.min(100, c.nivel));
    foe.shiny = false;
    const T = DB.FUNDO_TEXTO || {};
    Glitch.hit(0.6);
    this.dlg.say((T.cardume || ["O CARDUME SE JUNTOU NUM {MON} SÓ!"]).map((l) => l.replace("{MON}", sp.name).replace("{BASE}", DB.SPECIES[c.especie].name)), () => {
      const b = { foe, cardume: true };
      this.entrarEmBatalha("selvagem", b, () => this.game.scenes.push(new BattleScene(), b));
    });
    return true;
  }

  // ------------------------------------------------ O RASTRO DO COMPANHEIRO
  // Andando livre, quem te segue não pula de tile em tile: ele anda pelo
  // CAMINHO por onde você passou (os pontos em pixel, do mais novo pro mais
  // velho), sempre um pouco atrás. O tile dele (`this.compa`) continua sendo
  // contado como antes, pro resto do jogo (falar com ele etc.).
  gravarRastro() {
    const p = this.st.player, { px, py } = this.playerPixel();
    if (this.rastroMapa !== p.map) { this.rastro = []; this.rastroMapa = p.map; }
    const r = this.rastro, ult = r[0];
    if (ult && Math.hypot(ult.x - px, ult.y - py) < 0.5) return;
    // pulou longe (porta, viagem, teleporte): o caminho começa de novo
    if (ult && Math.hypot(ult.x - px, ult.y - py) > TILE * 2) r.length = 0;
    r.unshift({ x: px, y: py });
    let total = 0;
    for (let i = 1; i < r.length; i++) {
      total += Math.hypot(r[i].x - r[i - 1].x, r[i].y - r[i - 1].y);
      if (total > TILE * 3) { r.length = i + 1; break; }
    }
  }

  /** Onde o companheiro está desenhado, em pixel do mapa, e pra onde olha.
   *  null quando ainda não tem caminho (acabou de entrar no mapa). */
  compaNoRastro() {
    const r = this.rastro;
    if (!r || r.length < 2) return null;
    const ATRAS = 15;
    const ponto = (d) => {                      // o ponto do caminho a `d` px de você
      let falta = d;
      for (let i = 1; i < r.length; i++) {
        const a = r[i - 1], b = r[i], l = Math.hypot(b.x - a.x, b.y - a.y);
        if (l >= falta && l > 0) return { x: a.x + ((b.x - a.x) * falta) / l, y: a.y + ((b.y - a.y) * falta) / l };
        falta -= l;
      }
      return null;
    };
    const aqui = ponto(ATRAS);
    if (!aqui) return null;                     // ainda não andou o bastante
    // PRA ONDE ELE OLHA: o rumo de um pedaço maior do caminho (não de um
    // pixel só), e só troca de lado quando o outro lado ganha com folga — na
    // diagonal os dois empatam, e sem isso ele virava pra lá e pra cá todo quadro
    const atras = ponto(ATRAS + 8) || r[r.length - 1];
    const dx = aqui.x - atras.x, dy = aqui.y - atras.y;
    const ax = Math.abs(dx), ay = Math.abs(dy);
    const hori = dx > 0 ? "right" : "left", vert = dy > 0 ? "down" : "up";
    let dir = this.compaRumo || vert;
    if (ax > ay * 1.4) dir = hori;
    else if (ay > ax * 1.4) dir = vert;
    else if (dir !== hori && dir !== vert) dir = ay >= ax ? vert : hori;   // diagonal: fica num dos dois
    if (ax + ay > 0.5) this.compaRumo = dir;
    return { x: aqui.x, y: aqui.y, dir: this.compaRumo || dir };
  }

  // ------------------------------------------------------- ANDAR LIVRE
  // (pedido do CAIO) O jogador não fica preso na grade: anda pixel por pixel,
  // na diagonal também, e pode parar entre dois tiles. `this.sub` é quanto ele
  // está fora do meio do tile (de -8 a 8 em cada eixo); o tile dele
  // (`player.x/y`) é sempre o que está debaixo do meio do corpo, e é por ele
  // que todo o resto do jogo continua funcionando: porta, mato, conversa,
  // selvagem. Quando o meio do corpo passa pro tile do lado, é um passo.
  // Parede, gente, porta, barranco e borda do mapa: chegando perto, quem
  // decide é o `tryStep` de sempre (esbarra, entra, pula, troca de mapa).
  livrePra(nx, ny) {
    const t = this.tagAt(nx, ny);
    if (this.st.voando) return t >= 0;
    if (t < 0 || this.warpAt(nx, ny) || DB.LEDGE_DIR[t]) return false;
    return !this.blocked(nx, ny);
  }

  andarLivre(dt) {
    const p = this.st.player;
    if (!this.sub || this.subMapa !== p.map) { this.sub = { x: 0, y: 0 }; this.subMapa = p.map; this.vel = null; }
    const ax = (Input.held("right") ? 1 : 0) - (Input.held("left") ? 1 : 0);
    const ay = (Input.held("down") ? 1 : 0) - (Input.held("up") ? 1 : 0);
    // O GELO (pedido do CAIO: "passa por cima mas escorrega", e "não servir de
    // esteira"): no gelo o corpo tem INÉRCIA. A velocidade vai mudando DEVAGAR
    // na direção do que você aperta — demora pra embalar, demora pra virar e,
    // soltando o botão, ainda desliza um bom pedaço até parar. Bateu em
    // alguma coisa, a velocidade daquele lado zera. Fora do gelo, é o andar
    // de sempre (e a velocidade que você trazia entra junto no gelo).
    const noGelo = this.tagAt(p.x, p.y) === DB.TAG.ICE && !this.st.voando && !this.st.surfando;
    const deslizando = noGelo && this.vel && Math.hypot(this.vel.x, this.vel.y) > 2;
    // o TORNADO puxando (desenharTornado): um empurrãozinho por quadro
    const emp = this.empurraoVento; this.empurraoVento = null;
    this.andandoLivre = !!(ax || ay) || !!deslizando || !!emp;
    this.rumoLivre = ax || ay ? { x: ax, y: ay } : null;     // (o companheiro na diagonal usa)
    if (ax && ay) this.olharDiag = { x: ax, y: ay }; else if (ax || ay) this.olharDiag = null;   // parou na diagonal: continua olhando
    if (!ax && !ay && !deslizando && !emp) { if (!noGelo) this.vel = null; return; }
    // olha pra onde aperta; na diagonal continua olhando pra um dos dois lados
    const vert = ay > 0 ? "down" : "up", hori = ax > 0 ? "right" : "left";
    if (ay && !ax) p.dir = vert;
    else if (ax && !ay) p.dir = hori;
    else if ((ax || ay) && p.dir !== vert && p.dir !== hori) p.dir = vert;
    // GIRAR (andar em círculo) com um BEBBIDAH segurando ingrediente: ele evolui
    if ((ax || ay) && girar(this.giro ||= novoGiro(), p.dir, performance.now()) && this.giroBebbidah()) return;
    // a mesma velocidade do passo de grade: um tile a cada WALK (ou RUN) quadros
    const correndo = Input.held("run") || this.st.montaria;
    // no FUNDO DO MAR a água segura: um pouco mais devagar
    const v = (TILE * 60) / passo(this.quadrosDoPasso(correndo)) * (this.map?.submerso ? 0.8 : 1)
      * (this.posPosAlagado ? DB.POS_POS?.devagarNaCheia || 0.75 : 1);   // a água rasa de Braglitch segura
    const diag = ax && ay ? Math.SQRT1_2 : 1;
    // quanto anda em cada eixo NESTE quadro (px)
    const quer = { x: ax * v * diag, y: ay * v * diag };
    let anda;
    if (noGelo) {
      const G = DB.CONFIG?.gelo || {};
      this.vel ||= { x: 0, y: 0 };
      // apertando, puxa pra lá devagar; solto, o atrito é menor ainda (desliza)
      const k = Math.min(1, (ax || ay ? G.pega ?? 2.2 : G.atrito ?? 0.9) * dt);
      for (const e of ["x", "y"]) {
        this.vel[e] += (quer[e] - this.vel[e]) * k;
        if (Math.abs(this.vel[e]) < 1.5 && !(e === "x" ? ax : ay)) this.vel[e] = 0;
      }
      anda = { x: this.vel.x * dt, y: this.vel.y * dt };
    } else {
      this.vel = { x: quer.x, y: quer.y };     // a velocidade que entra no gelo, se for pra lá
      anda = { x: quer.x * dt, y: quer.y * dt };
    }
    if (emp) { anda.x += emp.x; anda.y += emp.y; }
    const MEIO = TILE / 2, BEIRA = 4;          // perto de parede, para a 4 px do meio
    for (const eixo of ["x", "y"]) {
      const passo_ = anda[eixo];
      if (!passo_) continue;
      const a = Math.sign(passo_);
      const novo = this.sub[eixo] + passo_;
      if (a * novo <= BEIRA) {                 // ainda no meio do tile
        this.sub[eixo] = novo;
        this.passoLivre = (this.passoLivre || 0) + Math.abs(passo_);
        continue;
      }
      const nx = p.x + (eixo === "x" ? a : 0), ny = p.y + (eixo === "y" ? a : 0);
      if (!this.livrePra(nx, ny)) {
        this.sub[eixo] = a * BEIRA;
        if (emp && !ax && !ay) continue;       // o vento te encostou na parede: só para (porta não abre sozinha)
        // no gelo, bateu: a velocidade daquele lado acaba ali
        if (noGelo && this.vel) {
          if (Math.abs(this.vel[eixo]) > v * 0.6) Audio2.bump();
          this.vel[eixo] = 0;
          if (!(eixo === "x" ? ax : ay)) continue;
        }
        // encostou: o tryStep resolve (porta, barranco, troca de mapa, empurrar,
        // esbarrão) — uma vez por passo de tempo, como na grade, senão o
        // esbarrão contaria um por quadro
        const chave = `${nx},${ny}`;
        this.encostoT = Math.max(0, (this.encostoT || 0) - dt);
        if (this.encosto !== chave || !this.encostoT) {
          this.encosto = chave;
          this.encostoT = passo(WALK) / 60;
          const nome = eixo === "x" ? (a > 0 ? "right" : "left") : (a > 0 ? "down" : "up");
          const antes = p.dir;
          this.tryStep(nome);
          if (!this.move) p.dir = antes;
          if (this.move || this.menu || this.dlg.active || this.fx || this.fadeDir) return;
        }
        continue;
      }
      this.encosto = null;
      this.sub[eixo] = novo;
      this.passoLivre = (this.passoLivre || 0) + Math.abs(passo_);
      if (a * novo > MEIO) {
        // o meio do corpo passou pro tile do lado: é um passo
        this.moverCompanheiro(p.x, p.y, nx - p.x, ny - p.y);
        this.compaK = 0;
        if (eixo === "x") p.x = nx; else p.y = ny;
        this.sub[eixo] -= a * TILE;
        this.chegouNoTile();
        if (this.menu || this.dlg.active || this.fx || this.fadeDir) return;
      }
    }
    // saiu do gelo deslizando, sem apertar nada: para
    if (!(ax || ay) && this.tagAt(p.x, p.y) !== DB.TAG.ICE) this.vel = null;
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
      this.move = { dx, dy, n: 0, total: passo(this.quadrosDoPasso(Input.held("run") || this.st.montaria)) };
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
      if (alvo?.raidEvento) return this.entrarNaRaidDoEvento(alvo.raidEvento);
      // NA GLITCH ZONE a parede não é de verdade: insista e ela cede. A borda
      // do mapa (tag -1) não — do outro lado dela não tem nada pra ceder.
      if (naZona(this.st) && !alvo && this.tagAt(nx, ny) >= 0) return this.esbarrarNaZona(nx, ny);
      if (!alvo && this.tentarAtravessar(nx, ny, dx, dy)) return;
      if (!this.bumpCd) { Audio2.bump(); this.bumpCd = 0.35; }
      return;
    }
    this.move = { dx, dy, n: 0, total: passo(this.quadrosDoPasso(Input.held("run"))) };
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
    if (this.talvezGigante()) return;

    // O SORTEIO INVISÍVEL POR PASSO NÃO EXISTE MAIS, aqui nem na fenda. O que
    // começa batalha selvagem é encostar: você num bicho, ou um bravo em você.
    this.talvezRasgar();
    if (this.criancaDoPreto()) return;
    this.checkTrainerSight();
  }

  /** A CRIANÇA PRESA NO PRETO (src/data/crianca-preto.js), a cada passo em
   *  SÃO LUCARIO: perto, você ouve o grito (uma vez por visita); parado em
   *  (18, 3) com um DOCE RARO, ela vem correndo. */
  criancaDoPreto() {
    const CP = CRIANCA_PRETO, st = this.st, p = st.player;
    if (p.map !== CP.mapa || st.flags.criancaPretoSalva || this.dlg.active) return false;
    if (p.x === CP.gatilho.x && p.y === CP.gatilho.y && (st.items[CP.item] || 0) > 0) {
      this.gritouCrianca = true;
      Audio2.tone(988, 0.07); Audio2.tone(1319, 0.12);
      this.dlg.say(CP.viu, () => { this.criancaCorre = { y: CP.presa, t: 0 }; });
      return true;
    }
    if (!this.gritouCrianca && Math.abs(p.x - CP.x) <= CP.ouvir && p.y - CP.presa <= CP.ouvir + 1) {
      this.gritouCrianca = true;
      Glitch.hit(0.4);
      this.dlg.say(CP.grito);
      return true;
    }
    return false;
  }

  /** ela sai do preto correndo, um tile por vez, até parar na sua frente */
  correrCrianca(dt) {
    const CP = CRIANCA_PRETO, c = this.criancaCorre;
    c.t += dt;
    if (c.t < 0.16) return;
    c.t = 0;
    c.y++;
    Audio2.tone(c.y % 2 ? 330 : 392, 0.03, "square", 0.4);   // os passinhos
    if (c.y < CP.salva) return;
    this.criancaCorre = null;
    const st = this.st;
    st.flags.criancaPretoSalva = true;
    st.player.dir = "up";
    this.dlg.say(CP.salvo, () => {
      if ((st.items[CP.item] || 0) > 0) this.spend(CP.item, 1);
      st.items[CP.premio.item] = (st.items[CP.premio.item] || 0) + CP.premio.qtd;
      Audio2.heal();
      this.game.autosave?.(true);
      this.dlg.say(CP.ganhou);
    });
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
    // os que SUMIRAM (o ABRA): um brilho onde eles estavam
    for (const b of passo.sumiram || []) {
      (this.brilhosSumiu ||= []).push({ x: b.x, y: b.y, mapa: st.player.map, t0: performance.now() });
      Audio2.tone(1568, 0.05); Audio2.tone(2093, 0.07);
    }
    this.nascerT -= dt;
    // O LUMINOSO DA SEMANA DO SHINY (10 shinies pegos): nasce logo que der
    if (st.flags?.lumiPendente && (this.map?.encounters || []).length) {
      const lumi = nascer(this.selvagens, st.player, (x, y) => {
        const r = this.sortearSelvagem(x, y);
        if (r?.mon) { r.mon.luminoso = true; r.mon.shiny = false; darClarao(r.mon); }
        return r;
      }, (x, y) => this.daPraSelvagem(x, y));
      if (lumi) {
        st.flags.lumiPendente = false;
        this.avisar(shinyDoEvento()?.lumiApareceu || "UM POKÉMON LUMINOSO APARECEU POR PERTO!");
        Audio2.shiny?.();
      }
    }
    if (this.nascerT <= 0) {
      // O SANDUÍCHE REFRESCANTE agora rareia os bichos à vista. Ele cortava o
      // sorteio invisível por passo; como em Kanto o encontro passou a ser o
      // encostão, ele tinha que passar junto — senão o item continuava na loja
      // sem fazer nada do lado de fora da fenda.
      const calma = Math.max(0.15, fator(this.st, "calmaria"));
      this.nascerT = (DB.CONFIG?.selvagens?.nascer ?? 2) / calma / (surtoAtivo(st)?.mapa === st.player.map ? 2 : 1);
      // o sorteio é o mesmo de sempre — MISSINGNO., corrompido, shiny e a fusão
      // selvagem saem daqui, agora em pé no mato em vez de aparecendo do nada
      const novo = nascer(this.selvagens, st.player, (x, y) => this.sortearSelvagem(x, y),
                          (x, y) => this.daPraSelvagem(x, y));
      // a HORDA também é sorteada no nascimento: quem traz uma anda com as
      // silhuetas dela em cima (`drawSelvagem`), e é essa que você luta
      if (novo) novo.horda = this.talvezHorda(novo);
      // O FRACO FOGE COMO DOIDO ("pkmns fracos só fogem como doidos", CAIO,
      // nov/2026): 10 níveis ou mais abaixo do seu primeiro de pé, ele vira
      // arisco desesperado (o alfa e quem traz horda não têm medo)
      const lider = st.party.find((m) => m.hp > 0);
      if (novo && lider && !novo.mon.alfa && !novo.horda && novo.mon.level <= lider.level - 10) {
        novo.genio = "arisco"; novo.bravo = false; novo.doido = true;
      }
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
    if (podeLutar(this, b)) return void comecarLuta(this, b);   // TEMPO REAL: ele entra na luta
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
    // no TEMPO REAL a luta é aqui mesmo, no mapa (src/systems/lutamapa.js)
    if (podeLutar(this, b)) return void comecarLuta(this, b);
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
    // a cutscene (src/scenes/horda.js) primeiro; a luta abre quando ela fecha
    this.entrarEmBatalha("selvagem", { horda: true }, () => this.game.scenes.push(new HordaScene(), {
      foes, aoFim: () => this.game.scenes.push(new GrupoBattleScene(), { foes, horda: true }),
    }));
  }

  /** O bicho que nasce naquele tile. Em Kanto é o sorteio de sempre; dentro da
   *  fenda é o dela, que olha o TERRENO debaixo do tile (ar, terra ou água) —
   *  cada um tem a sua tabela e o seu lendário. */
  /** o selvagem, e no MODO FUSÃO (src/systems/modofusao.js) ele já vem fundido */
  sortearSelvagem(x, y) {
    const r = this.sortearSelvagem0(x, y);
    // (na GLITCH DIMENSION também: o parceiro sai das tabelas da fenda)
    const naFenda = this.st.player.map === "glitchdim";
    if (r?.mon && this.st.flags?.modoFusao && (!r.glitch || naFenda) && !r.legend) {
      const tabela = naFenda ? Object.values(DB.DIM_ENCOUNTERS || {}).flat() : DB.MAPS[this.st.player.map]?.encounters || [];
      r.mon = fundirSelvagem(this.st, r.mon, tabela);
    }
    return r;
  }

  sortearSelvagem0(x, y) {
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
      // O SURTO EM MASSA (src/systems/surtos.js): neste mapa, quase todo bicho é ele
      const surto = surtoAtivo(st);
      if (surto && surto.mapa === st.player.map && Math.random() < SURTO.daEspecie && !brilho) {
        const lvl = surto.min + Math.floor(Math.random() * (surto.max - surto.min + 1));
        return { mon: createMon(surto.especie, lvl, sortearBrilho({ sorte: sorte * SURTO.sorteShiny })), surto: true };
      }
      // em Braglitch o glitch vira folclore até o MISSINGNO chegar lá; depois
      // disso o mato de lá é o de Kanto quebrado (src/systems/regionais.js)
      const brag = emBraglitch(st.player.map) && st.flags.bragGlitch && !st.flags.bragMissingnoVencido;
      // BRAGLITCH ALAGADA: no mato debaixo d'água nadam os bichos do fundo dela
      const tabela = this.posPosAlagado && DB.MAPS[fundoDe(st.player.map)]?.encounters?.length ? fundoDe(st.player.map) : st.player.map;
      return rollEncounter(tabela, brag ? Math.max(st.corruption, GLITCH_BRAG) : st.corruption,
                           glitchDeVerdade(st, st.player.map), sorte, brilho, { x, y });
    }
    // `?rayquazasolto=1`: o primeiro que nasce na fenda é o RAYQUAZA (pra ver
    // ele andando sem esperar a sorte)
    if (rayquazaDaUrl) { rayquazaDaUrl = false; return { mon: createMon("rayquaza", 55), glitch: true, legend: true }; }
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

  /** FALAR COM O COMPANHEIRO (src/data/companheiro.js), como em HGSS: ele
   *  vira pra você, grita, um balão aparece em cima dele e o jogo diz como ele
   *  está. A primeira situação que bater ganha; senão, uma frase sorteada. */
  falarComCompanheiro(mon) {
    const C = DB.COMPANHEIRO;
    if (!C) return;
    this.compa.dir = OPPOSITE[this.st.player.dir];
    const amz = mon.amizade || 0;
    const reacao = mon.status ? C.passandoMal
      : mon.hp < mon.maxHp * 0.3 ? C.cansado
      : mon.corrupt && Math.random() < 0.6 ? C.corrompido
      : horaDoMundo().noite && Math.random() < 0.4 ? C.sono
      : (mon.shiny || mon.luminoso) && Math.random() < 0.25 ? C.brilho
      : amz >= 200 ? C.inseparavel
      : amz >= 100 && Math.random() < 0.6 ? C.amigo
      : C.qualquer[Math.floor(Math.random() * C.qualquer.length)];
    // o carinho aproxima, mas só de vez em quando (não vira máquina de amizade)
    const agora = Date.now();
    if (!(mon.carinhoEm > agora - (C.intervalo ?? 300) * 1000)) { amizade(mon, 1); mon.carinhoEm = agora; }
    this.compaReacao = { t: 0, emote: reacao.emote };
    tocarGrito(mon);
    this.dlg.falante = () => this.cabecaNaTela({ x: this.compa.x, y: this.compa.y });
    // ELE FALA: primeiro uma das três onomatopeias dele (src/data/gritos), a
    // que combina com o humor (`tom`), saindo da cabeça dele no estilo BALÃO;
    // depois o jogo conta como ele está
    const sons = onomatopeias(mon.species);
    const som = reacao.tom === "alegre" && sons[1] ? sons[1]
      : reacao.tom === "baixo" && sons[2] ? sons[2]
      : sons[Math.floor(Math.random() * sons.length)];
    const falas = [...(som ? [`${mon.nickname}: ${som}`] : []), reacao.texto.replace("{MON}", mon.nickname)];
    // o CARINHO DA VITÓRIA (src/systems/vinculo.js): logo depois de vencer
    // junto, o carinho vale muito mais — e passa do máximo
    const vitoria = carinhoDaVitoria(this.st, mon);
    if (vitoria) { falas.push(...vitoria); Audio2.heal(); }
    this.dlg.say(falas, () => { this.compaReacao = null; });
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
    } else if (ultraAberto() && !st.flags.ultraBuracoVisto) {
      // o primeiro ULTRA BURACO também se explica, uma vez
      st.flags.ultraBuracoVisto = true;
      this.dlg.say(DB.STORY.ultra.rasgoPrimeiro);
    }
  }

  /** Entrar no rasgo: o chefe passa pro nosso lado. A tabela é a da FENDA — o
   *  bicho é de lá, o rasgo é só por onde ele coube. */
  entrarNoRasgo() {
    // num evento de ULTRA RAIDS (src/data/eventos.js) o que sai é uma ultra
    // beast, e a luta não é glitch: é uma ULTRA RAID
    const ultra = !!ultraAberto();
    const chefe = ultra ? montarChefeUltra() : montarChefe(DB.DIM_ENCOUNTERS?.terra || []);
    fecharPortal(this.st);
    if (!chefe) return void this.dlg.say(DB.STORY.glitch.rasgoVazio);
    if (DB.CONFIG?.sustos && !ultra) { Glitch.hit(3); Audio2.glitch(); }
    else Audio2.select();
    this.dlg.say((ultra ? DB.STORY.ultra : DB.STORY.glitch).rasgoEntrou, () => {
      this.startBattle({ mon: chefe.mon, glitch: !ultra, raid: chefe });
    });
  }

  /** A RAID DE EVENTO: o rasgo é fixo e não some — pergunta antes, e só
   *  fecha quando o bicho for pego (src/data/eventos.js). */
  entrarNaRaidDoEvento({ ev, r }) {
    const T = { ...TEXTOS_EVENTO, ...(ev.textos || {}) };
    const nome = DB.SPECIES[especieDaRaid(r)]?.name || r.id;
    const dd = (n) => String(n).padStart(2, "0");
    const ate = (janelaAberta(ev) || ev.janelas?.[0] || ev).ate;
    const f = (t) => t.replace("{MON}", nome).replace("{ESTRELAS}", estrelasDoNivel(r.nivel))
      .replace("{EVENTO}", ev.nome).replace("{ATE}", `${dd(ate.dia)}/${dd(ate.mes)}`);
    if (!this.st.party.some((m) => m.hp > 0)) return void this.dlg.say(f(T.semPokemon));
    Audio2.tone(880, 0.09, "sine", 0.4); Audio2.tone(1174, 0.14, "sine", 0.3);
    this.dlg.say((r.shiny ? T.rasgo : T.rasgoNormal).map(f), () => this.dlg.ask(f(T.pergunta), T.opcoes, (i) => {
      if (i !== 0) return void this.dlg.say(f(T.saiu));
      const chefe = montarChefeFixo(r, chaveDaRaid(ev, r), !!ev.ultra);
      if (!chefe) return void this.dlg.say(DB.STORY.glitch.rasgoVazio);
      chefe.pegou = f(T.pegou);
      this.startBattle({ mon: chefe.mon, glitch: !ev.ultra, raid: chefe });
    }));
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

  /** O PC DO QUARTO: o baú de itens do começo, como no FireRed, em 5 CAIXAS.
   *  A CAIXA 1 já vem com 3 POÇÕES e a última, a CAIXA 5, com 987 DOCES RAROS
   *  (pedido do CAIO). Escolher um item tira ele inteiro pra mochila. */
  abrirPcItens() {
    const st = this.st;
    const CAIXAS = 5;
    if (!st.flags.pcItensAberto) {
      st.pcItens = [{ "poção": 3 }, {}, {}, {}, { "doce raro": 987 }];
      st.flags.pcItensAberto = true;
    } else if (!Array.isArray(st.pcItens)) {
      // o PC de antes era uma lista só: o que sobrou vai pras caixas certas
      const velho = st.pcItens || {};
      st.pcItens = Array.from({ length: CAIXAS }, () => ({}));
      for (const [it, q] of Object.entries(velho)) st.pcItens[it === "doce raro" ? CAIXAS - 1 : 0][it] = q;
    }
    this.game.scenes.push(new PcScene(), { modo: "itens" });
  }

  /** O PROF. CARVALHO te segura na saída da CIDADE DE PALLET e te leva pro
   *  laboratório (src/data/story.js, `carvalhoImpede`). */
  carvalhoImpede() {
    const T = DB.STORY.carvalhoImpede, p = this.st.player;
    p.dir = "down";
    Audio2.tone(988, 0.07); Audio2.tone(1319, 0.12);   // o "!"
    this.tocarMusicaDaConversa("frCarvalho");
    this.dlg.say(T.grita, () => {
      this.tocarMusicaDaConversa("frSiga");             // ele te leva pela mão
      this.justWarped = true;
      this.transition(() => {
        p.map = "lab"; p.x = 6; p.y = 4; p.dir = "up";
        this.afterTravel();
        this.st.flags.carvalhoTrouxe = true;
        this.tocarMusicaDaConversa("frCarvalho");
        this.dlg.say(T.noLab);
      });
    });
  }

  useWarp(w) {
    const fromMap = this.st.player.map;
    // A ÁRVORE OCA (src/systems/arvoreoca.js): o buraco de baixo volta pra ROTA 1;
    // a SAÍDA de cima do corredor é a fuga pra SALA DO TESOURO
    if (w.arvoreFora) return sairDaArvore(this);
    if (w.arvoreSaida) return escaparArvore(this);
    if (w.ciber) return this.sairDoCiber(w);   // os portais do CIBERESPAÇO
    // A LIGA DE KANTO (src/data/liga-kanto.js): porta trancada até vencer quem
    // está na sala, a de trás fechada, e a do Centro só com 8 insígnias
    const tranca = trancaDaLiga(this.st, fromMap, w.x, w.y);
    if (tranca) {
      const p = this.st.player, [dx, dy] = DIRS[p.dir] || [0, 0];
      if (p.x === w.x && p.y === w.y) { p.x -= dx; p.y -= dy; }
      return void this.dlg.say(tranca);
    }
    recomecaLiga(this.st, fromMap, w.x, w.y);
    // a SALA ÚNICA: a porta de cima vai pro HALL, e a saída do HALL volta pra ela
    const atalho = atalhoDaLiga(fromMap, w.x, w.y);
    if (atalho) {
      this.justWarped = true;
      return void this.transition(() => {
        Object.assign(this.st.player, { map: atalho.mapa, x: atalho.x, y: atalho.y, dir: atalho.dir || "up" });
        this.afterTravel();
      });
    }
    // A ESTRADA DA VITÓRIA antes de ser campeão: o ARCEUS te leva por cima
    if (fromMap === "route23" && /^victory_road/.test(w.to || "") && !this.st.flags.kantoCampeao) {
      const p = this.st.player, [dx, dy] = DIRS[p.dir] || [0, 0];
      if (p.x === w.x && p.y === w.y) { p.x -= dx; p.y -= dy; }
      const A = ARCEUS_VITORIA;
      if ((this.st.badges || []).length < 8) return void this.dlg.say(A.semInsignias);
      Audio2.tone(523, 0.3); Audio2.tone(784, 0.3); Audio2.tone(1047, 0.5);
      Glitch.hit?.(0.6);
      return void this.dlg.say(A.fala, () => {
        this.justWarped = true;
        this.transition(() => {
          Object.assign(p, { map: A.destino.mapa, x: A.destino.x, y: A.destino.y, dir: A.destino.dir });
          this.st.surfando = null;
          this.afterTravel();
          this.game.autosave?.(true);
          this.dlg.say(A.chegou);
        });
      });
    }
    // A PORTA DO LABORATÓRIO, no começo: só sai com o inicial e depois da
    // primeira luta com o rival
    if (fromMap === "lab" && w.to === "pallet" && this.st.regiao !== "braglitch") {
      const T = DB.STORY.carvalhoImpede, p = this.st.player;
      const volta = () => { p.y = w.y - 1; p.dir = "up"; };
      if (!this.st.flags.starterChosen) { volta(); return void this.dlg.say(T.semInicial); }
      const azul = rivalNpc(this.st);
      if (azul?.trainer && azul.id === "rival_lab") {
        volta();
        const key = `lab.${azul.id}`;
        const state = (this.st.npcState[key] ||= {});
        Audio2.tone(988, 0.07); Audio2.tone(1319, 0.12);
        return void this.dlg.say(T.rivalChama, () => this.offerBattle(azul, key, state));
      }
    }
    if (!w.to) {
      const cap = this.st.capturado;
      if (cap?.dormindo?.mapa === fromMap) return void this.dlg.say(NOITE.escada.replace("{TREINADOR}", cap.nome));
      if (this.map.paintball?.includes(`${w.x},${w.y}`)) return void this.entrarPaintball();
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
      // AS SALAS DA LIGA: a porta de entrada fica dentro da parede (no FireRed
      // o jogo te faz andar sozinho pra dentro); aqui você já chega dentro
      const ch = DB.MAPS[w.to].chegadaLiga;
      if (ch && p.x === ch.porta[0] && p.y === ch.porta[1]) { p.x = ch.x; p.y = ch.y; p.dir = "up"; }
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
    // sem Pokémon, a ROTA 1 não deixa: o PROF. CARVALHO vem correndo
    if (this.st.player.map === "pallet" && conn.to === "route1" && !this.st.flags.starterChosen
        && !this.st.party.length) return this.carvalhoImpede();
    const dest = DB.KANTO[conn.to];
    const p = this.st.player;
    // DO OUTRO LADO TEM QUE DAR PRA PISAR: a beirada de baixo de PALLET dava
    // na pedra da ROTA 21 e largava você numa ilhinha sem saída. Parede (ou
    // água, sem estar surfando nem voando) do outro lado: não atravessa.
    {
      let nx = p.x, ny = p.y;
      if (dir === "up") { ny = dest.h - 1; nx = p.x - conn.offset; }
      else if (dir === "down") { ny = 0; nx = p.x - conn.offset; }
      else if (dir === "left") { nx = dest.w - 1; ny = p.y - conn.offset; }
      else { nx = 0; ny = p.y - conn.offset; }
      nx = Math.max(0, Math.min(dest.w - 1, nx)); ny = Math.max(0, Math.min(dest.h - 1, ny));
      const t = dest.tags.charCodeAt(ny * dest.w + nx) - 48;
      const parede = t === DB.TAG.BLOCK || t >= 4;
      // (água com PONTE DE VINHA do outro lado dá pra pisar)
      const ponte = (this.st.pontes?.[conn.to] || []).some((k) => k.startsWith(`${nx},${ny},`));
      const agua = t === DB.TAG.WATER && !ponte && !this.st.surfando && !this.st.voando;
      if (!this.st.voando && !this.st.noPreto && (parede || agua)) {
        if (!this.bumpCd) { Audio2.bump(); this.bumpCd = 0.35; }
        return;
      }
    }
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
    if (!st.flags.pokedexMsg || st.flags.glitchWorld || DB.FENDA_TRANCADA?.(st)) return;
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
    // a CASA DO BILL: voltou depois de resolver o último? ele virou outro Pokémon
    // (src/data/bill-casos.js — um por visita, na ordem)
    {
      const f = this.st.flags;
      // o BILL emagrecendo depois do WAILORD: cada visita, um pouquinho
      if (this.st.player.map === "route25_sea_cottage" && f.billLargura > 1) {
        f.billLargura = Math.round((f.billLargura - 0.1) * 10) / 10;
        if (f.billLargura <= 1) delete f.billLargura;
      }
      if (this.st.player.map === "route25_sea_cottage" && f.billPresente && !f.billCasoAtivo && f.billProximo !== false
          && (f.billCasos || 0) < BILL_CASOS.length) {
        f.billCasoAtivo = true; f[`billCaso${f.billCasos || 0}`] = true; f.billProximo = false;
      }
    }
    // saiu do fundo do mar por qualquer caminho (subir, desmaiar...): não está mais mergulhado
    if (!this.map?.submerso) this.st.mergulho = null;
    this.cardumes = null;                      // os do mapa novo são sorteados na hora
    largarLuta(this);                          // a LUTA NO MAPA fica pra trás
    // as PONTES DE VINHA somem quando você sai do mapa (pedido do CAIO)
    // (menos nos mapas que a mesma ponte liga com este: dá pra atravessar de um pro outro)
    if (this.st.pontes) {
      const aqui = this.st.player.map;
      this.st.pontesCadeias = (this.st.pontesCadeias || []).filter((c) => c.includes(aqui));
      const fica = new Set([aqui, ...this.st.pontesCadeias.flat()]);
      for (const m of Object.keys(this.st.pontes)) if (!fica.has(m)) delete this.st.pontes[m];
    }
    this.gritouCrianca = false;     // voltou pra SÃO LUCARIO: a criança do preto grita de novo
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
    // a entrada na batalha de raid: o estouro também é susto
    if (enc.raid && DB.CONFIG?.sustos) { Glitch.hit(3); Audio2.glitch(); }
    if (enc.glitch) { Glitch.hit(2); Audio2.glitch(); }
    const b = { foe: enc.mon, glitch: enc.glitch, raid: enc.raid };
    this.entrarEmBatalha(enc.raid ? "chefe" : "selvagem", b, () => this.game.scenes.push(new BattleScene(), b));
  }

  /** Treinador que te vê passar na frente: ele chama, você decide.
   *  Parede, água e outro NPC cortam a linha de visão; mato alto não. */
  checkTrainerSight() {
    const st = this.st, p = st.player;
    if (this.fx || this.menu || this.dlg.active || !st.party.some((m) => m.hp > 0) || this.luta?.treinador) return;
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
    // quem te viu de longe também chega com a música dele
    if (this.musicaConversa == null) this.tocarMusicaDaConversa(this.musicaDaConversa(npc));
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
    if (this.luta?.treinador) return;            // já tem um treinador lutando no mapa
    // o retrato de batalha tem o mesmo nome do sprite de overworld do NPC
    const trainer = { sprite: npc.sprite, ...npc.trainer };
    // time com FUSÃO ("FUSAO:a+b", a tripla) ou o INICIAL do AZUL: montado na hora
    if ((trainer.party || []).some((p) => p.id === "INICIAL" || String(p.id).startsWith("FUSAO:"))) {
      trainer.party = montarTime(this.st, { time: trainer.party });
    }
    // O CAMPEÃO DO VOID (src/data/liga-void.js) é VOCÊ.EXE: o seu time, uns níveis acima, e bugado
    if (trainer.espelho) {
      const nome = String(this.st.player?.name || "VOCÊ").toUpperCase();
      trainer.name = String(trainer.name).replace("{NOME}", nome);
      const menina = this.st.player?.genero === "menina", brag = this.st.regiao === "braglitch";
      trainer.sprite = (menina ? "heroina" : "hero") + (brag ? "_brag" : "");
      trainer.party = (this.st.party || []).filter(Boolean).map((m) => ({ id: m.species, lvl: Math.min(100, (m.level || 50) + trainer.espelho), corrupt: true }));
      if (!trainer.party.length) trainer.party = [{ id: "missingno", lvl: 70 }];
    }
    // EM DUPLA: as duplas de treinadores sempre (src/data/duplas.js); e todo
    // treinador com dois ou mais, se a opção BATALHA DUPLA estiver ligada
    const dupla = !!trainer.dupla || (!!this.st.flags?.todasDuplas && (trainer.party || []).length >= 2);
    // TEMPO REAL: os Pokémon dele saem da bola aqui no mapa (src/systems/lutamapa.js)
    if (podeLutarTreinador(this, trainer)) return void comecarTreinador(this, npc, key, trainer);
    this.entrarEmBatalha(trainer.badge || trainer.lider ? "chefe" : "treinador", { trainer }, () => (dupla
      ? this.game.scenes.push(new GrupoBattleScene(), { trainer, npcKey: key, tamanho: 2 })
      : this.game.scenes.push(new BattleScene(), { trainer, npcKey: key })));
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
      this.st.surfando = null; this.st.voando = false; this.st.montaria = null;
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

    // O COMPANHEIRO: virado pra ele, o A é com ele (src/data/companheiro.js)
    if (this.compa && this.compa.x === f.x && this.compa.y === f.y && !this.st.capturado) {
      const mon = this.quemSegue();
      if (mon && !this.st.surfando && !this.st.voando) return this.falarComCompanheiro(mon);
    }

    // OUTRO JOGADOR (ou um BONECO DA IA) na frente — ou bem do lado, que andando
    // livre ninguém fica certinho no tile: Z chama pra batalhar ou trocar
    const outro = Online.noMapa(p.map).find((o) => !this.peerEscondido(o)
      && (Math.round(o.x) === f.x && Math.round(o.y) === f.y));
    if (outro) return this.chamarJogador(outro);

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

    // A BASE SECRETA: a sua porta, ou a de outro jogador que você achou
    const minha = baseNaPorta(this.st, this.st.player.map, f.x, f.y);
    if (minha) return this.entrarNaBase(minha);
    const deOutro = Online.baseNaPorta?.(this.st.player.map, f.x, f.y);
    if (deOutro) return this.visitarBase(deOutro);

    const locked = this.map.lockedWarps?.[key] || (this.warpAt(f.x, f.y) && trancaDaLiga(this.st, this.st.player.map, f.x, f.y));
    if (locked) return void this.dlg.say(locked);

    const warp = this.warpAt(f.x, f.y);
    if (warp && !warp.to) {
      if (this.map.paintball?.includes(`${warp.x},${warp.y}`)) return void this.entrarPaintball();
      return void this.dlg.say(this.map.lockedWarps?.[`${warp.x},${warp.y}`] || "A PORTA ESTÁ TRANCADA.");
    }

    const obst = this.obstaculoEm(f.x, f.y);
    if (obst?.tipo === "pedra") return this.pedirQuebra(obst);
    if (obst?.tipo === "arvore") return this.pedirCorteArvore(obst);
    if (obst?.tipo === "bloco") return this.pedirForca(obst, ...DIRS[p.dir]);
    if (obst?.tipo === "caminhao") return this.empurrarCaminhao(...DIRS[p.dir]);

    const t = this.tagAt(f.x, f.y);
    // o BRILHO na parede do SUBTERRÂNEO: abre a parede de cavar
    const brilho = this.brilhosAqui().find((b) => b.x === f.x && b.y === f.y);
    if (brilho) return this.cavarBrilho(brilho);
    // o BOTÃO ESCONDIDO da fonte de CELADON (src/data/fonte-celadon.js)
    const F = DB.FONTE_CELADON;
    if (F && this.st.player.map === F.mapa && f.x === F.botao.x && f.y === F.botao.y) return this.botaoDaFonte();
    if (t === DB.TAG.WATER && !this.st.surfando && this.quemSabe("energiadanatureza")) return this.pedirPonte(f, !!this.quemSabe("surfar"));
    if (t === DB.TAG.WATER && !this.st.surfando) return this.pedirSurf(f);
    if (t === DB.TAG.GRASS) return this.pedirCorte(f);
  }

  /** A MÚSICA DA CONVERSA, como no FireRed: o PROF. CARVALHO tem a dele, o
   *  rival a dele, e o treinador que te desafia toca a de "te vi!" (menino,
   *  menina, EQUIPE ROCKET, líder de ginásio). Só em Kanto. Devolve a chave de
   *  DB.MUSIC, ou null. */
  musicaDaConversa(npc) {
    if (!npc || this.geo?.braglitch) return null;
    const M = DB.MUSIC || {};
    const tem = (k) => (M[k] ? k : null);
    if (npc.sprite === "prof") return tem("frCarvalho");
    if (!npc.trainer) return null;
    if (npc.id?.startsWith("rival_") || npc.sprite === "rival") return tem("frRival");
    if (npc.trainer.badge) return tem("frLiderAparece");
    if (/^rocket/.test(npc.sprite)) return tem("frRocket");
    const MENINAS = ["garota", "menina", "heroina", "misty", "erika", "sabrina", "mae", "velha", "tecnica", "canalizadora", "superf", "enfermeira"];
    return tem(MENINAS.includes(npc.sprite) ? "frTreinadorMenina" : "frTreinadorMenino");
  }

  /** toca a música da conversa (até a conversa acabar, ver `update`) */
  tocarMusicaDaConversa(chave) {
    if (!chave || !DB.MUSIC?.[chave]) return;
    this.musicaConversa = chave;
    Audio2.playMusic(chave, DB.MUSIC[chave]);
  }

  talkTo(npc) {
    if (npc.ppBriga) return this.brigaDosLendarios();
    if (npc.portal) return this.abrirPortal();
    if (npc.portalVolta) return this.voltarDoPortal();
    if (npc.magikarpSeco) return void this.dlg.say(DB.POS_POS.magikarpSeco);
    const key = `${this.st.player.map}.${npc.id}`;
    const state = (this.st.npcState[key] ||= {});
    // o treinador ainda não vencido e o PROF. CARVALHO falam com música
    if (npc.sprite === "prof" || (npc.trainer && !state.defeated)) this.tocarMusicaDaConversa(this.musicaDaConversa(npc));
    if (npc.sprite !== "ball") npc.dir = OPPOSITE[this.st.player.dir];
    // QUEM FALA é este: no estilo BALÃO (OPÇÕES → FALA) a fala sai da cabeça
    // dele. Bola no chão e item escondido não falam — o texto deles é do jogo.
    if (!npc.invisivel && npc.sprite !== "ball" && !npc.loot) this.dlg.falante = () => this.cabecaNaTela(npc);

    if (npc.loot) return this.takeLoot(npc.loot);
    // `aoFalar`: a conversa inteira em código, pra NPC de DLC que não cabe em
    // nenhum dos campos daqui (o GLITNEXY pede um espetinho e abre a fenda)
    if (typeof npc.aoFalar === "function") return npc.aoFalar(this, npc, state);
    // AS POKÉMÁQUINAS que o jogador construiu (src/systems/pokemaquinas.js): usar ou desmontar
    if (npc.maquinaUid) return falarComMaquina(this, npc);
    if (npc.lojaRoupas) return this.lojaDeRoupas(npc);
    if (npc.voltaNuvens) return this.voltarDasNuvens(npc);
    if (npc.billWailord) { const ja = this.st.flags.billPediu; this.st.flags.billPediu = true; return void this.dlg.say(ja ? npc.afterLines : npc.lines); }
    if (npc.separadorBill) return this.separadorDoBill();
    if (npc.billHumano) return this.falarBill(npc);
    if (npc.billCaso != null) { const ja = this.st.flags.billCasoPediu; this.st.flags.billCasoPediu = true; return void this.dlg.say(ja ? npc.afterLines : npc.lines); }
    { // o NPC que usa a roupa vende uma igual (o pescador, o motoqueiro, o cientista)
      // só o NPC COMUM (que só conversa) vende: o CONOR, que também é "cientista",
      // tem que te levar pro laboratório, e não oferecer o jaleco
      const COMUM = new Set(["id", "x", "y", "dir", "sprite", "lines", "afterLines", "mostrar", "comFlag", "someComFlag", "noite", "trainer", "againLines"]);
      const comum = Object.keys(npc).every((k) => COMUM.has(k));
      const r = comum && (!npc.trainer || state.defeated) ? ROUPAS.find((x) => x.npc && x.npc === npc.sprite && !this.st.roupas?.[x.id]) : null;
      if (r && !npc.shop && !npc.heal) return this.dlg.say(npc.lines?.length ? (state.defeated && npc.afterLines ? npc.afterLines : npc.lines) : ["..."], () => this.venderRoupa(r));
    }
    if (npc.pcItens) return this.abrirPcItens();
    // o NINTENDO SWITCH do quarto: joga o SUPER PAWMOT (src/scenes/superpawmot.js)
    // ...e agora também o THE LEGENDS OF CELEBI (src/scenes/celeba.js) e o SUPER PAWMOT KART (src/scenes/kart.js)
    if (npc.switchJogo) return this.dlg.ask("UM NINTENDO SWITCH! QUAL JOGO?", ["SUPER PAWMOT", "THE LEGENDS OF CELEBI", "SUPER PAWMOT KART", "SAIR"], (i) => {
      if (i === 0) this.game.scenes.push(new SuperPawmotScene(), {});
      if (i === 1) this.game.scenes.push(new CelebaScene(), {});
      if (i === 2) this.game.scenes.push(new KartScene(), {});
    });
    if (npc.fichas) return this.balcaoFichas();
    if (npc.cacaFantasma) return this.falarCacaFantasma();
    if (npc.raticateRival) return this.falarRivalLapide(npc);
    if (npc.zerogleDono) return this.falarTomas();
    if (npc.trem) return this.pegarTrem(npc.trem);
    if (npc.zeladoraPa && this.st.flags?.zerogle === 1) return this.falarZeladora();
    if (npc.confeiteira) return this.falarConfeiteira();
    if (npc.escoteiraBase) return this.falarEscoteira();
    if ((npc.sprite === "ball" || npc.bau) && npc.gift) {
      if (npc.bau && state.gotGift) return void this.dlg.say("O BAÚ ESTÁ VAZIO. SÓ TEM AREIA E UM SIRI ASSUSTADO.");
      return this.pegarItemBall(npc, state, key);
    }
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
    if (npc.arvoreOca) return this.entrarNaArvore();   // (antes da bola: ela é invisível)
    if (npc.tesouroArvore) return this.abrirTesouro(npc, state);
    if (npc.sprite === "ball") return this.pickStarter(npc, state);
    if (npc.monShop && !state.comprou) return this.venderMon(npc, state);
    if (npc.aurora) return this.talkVelhaAurora(state);
    if (npc.escort) return this.talkEscort(npc);
    if (npc.zygarde !== undefined) return this.falarZygarde(npc);
    if (npc.liquidificador) return this.usarLiquidificador(npc, state);
    if (npc.arbusto) return this.colherArbusto(npc, state);
    if (npc.levar) return this.levarEstatico(npc);
    if (npc.boss) return this.startBossBattle(npc);
    if (npc.descontrolada) return this.enfrentarDescontrolada(npc);
    if (npc.balsa) return this.pegarBalsa();
    if (npc.aviao) return this.pegarAviao(npc);
    if (npc.irBaseEspacial || npc.voltaBaseEspacial) return this.irBaseEspacial(npc);
    if (npc.fabricaChefe) return this.lutarNaFabrica(npc);   // a FÁBRICA DE POKÉBOLAS (src/data/fabrica.js)
    if (npc.fabricaDono) return this.menuDaFabrica(npc);
    if (npc.foguete) return this.pegarFoguete(npc);         // o ESPAÇO (src/data/espaco.js)
    if (npc.helicoptero) return this.pegarHelicoptero(npc);
    if (npc.arvoreOca) return this.entrarNaArvore();
    if (npc.descerAreaZero) return this.descerAreaZero(npc);
    if (npc.subirAreaZero) return this.subirAreaZero(npc);
    if (npc.ciberespaco) return this.falarCaraDoPorygon();
    if (npc.distorcao) return this.investigarDistorcao();
    if (npc.raidPortal) return this.entrarNoRasgo();
    if (npc.raidEvento) return this.entrarNaRaidDoEvento(npc.raidEvento);
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
    if (npc.fossil) return this.talkPaleontologa(npc);

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
    // o VÍTOR (src/data/amigos.js): depois da fala, a tirinha do caderno
    if (npc.tirinhas && DB.TIRINHAS) {
      const lines = state.defeated || state.talked ? npc.afterLines || npc.lines : npc.lines;
      state.talked = true;
      return void this.dlg.say(lines, () => this.oferecerTirinha());
    }
    // a PESQUISADORA DO DYNAMAX (SAFFRON): a missão é mostrar um Pokémon
    // nível 30 ou mais; aí ela dá a PULSEIRA DYNAMAX (src/systems/dynamax.js)
    if (npc.dynamax) {
      if (this.st.items["pulseira dynamax"]) return void this.falarPesquisadoraMax();
      const forte = (this.st.party || []).find((m) => (m.level || 0) >= 30);
      if (!forte) return void this.dlg.say([
        "EU ESTUDO A ENERGIA DYNAMAX. ELA FAZ OS POKÉMON FICAREM GIGANTES!",
        "MAS SÓ POKÉMON FORTE AGUENTA. ME MOSTRA UM POKÉMON NÍVEL 30 OU MAIS QUE EU TE DOU UMA COISA.",
      ]);
      return void this.dlg.say([
        "EU ESTUDO A ENERGIA DYNAMAX. ELA FAZ OS POKÉMON FICAREM GIGANTES!",
        `UAU! ${forte.nickname} É FORTE MESMO! ELE AGUENTA O DYNAMAX.`,
      ], () => {
        this.st.items["pulseira dynamax"] = 1;
        this.st.items["sopa max"] = (this.st.items["sopa max"] || 0) + 1;
        Audio2.heal();
        this.game.autosave?.(true);
        this.dlg.say([
          "VOCÊ GANHOU A PULSEIRA DYNAMAX!",
          "ELA FUNCIONA EM GINÁSIO, NA LIGA E NAS RAIDS. NA BATALHA, APERTE V ANTES DE ESCOLHER O GOLPE.",
          "SEU POKÉMON FICA GIGANTE POR 3 TURNOS, COM GOLPES MAX. O LÍDER TAMBÉM PODE FAZER ISSO, CUIDADO!",
          "E TOMA UMA SOPA MAX! DÁ PRA UM POKÉMON E ELE GANHA O FATOR GIGANTAMAX.",
        ]);
      });
    }
    if (npc.shop) {
      state.talked = true;
      // A LOJA DE VIRIDIAN guarda a ENCOMENDA do professor: antes de entregar, não vende
      if (this.st.player.map === "mart" && this.st.flags.starterChosen && !temPokedex(this.st) && !this.geo?.braglitch) {
        const E = DB.POKEDEX_TEXTO.encomenda;
        if (this.st.items?.[E.item] > 0) return void this.dlg.say(E.lojaDeNovo);
        return void this.dlg.say(E.loja, () => { this.st.items[E.item] = 1; Audio2.heal(); this.game.autosave?.(true); });
      }
      // o VENDEDOR DE OVOS dos centros dá o PURIFICADOR uma vez (o primeiro
      // que você encontrar; src/data/fosseis-puros.js)
      const P = DB.PURIFICADOR;
      if (npc.id === "ovos" && P && !this.st.flags.ganhouPurificador) {
        this.st.flags.ganhouPurificador = true;
        return void this.dlg.say(P.vendedor, () => {
          this.st.items[P.item] = (this.st.items[P.item] || 0) || 1;
          Audio2.heal();
          this.game.autosave?.(true);
          this.dlg.say([P.ganhou, P.dica]);
        });
      }
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
        // SEPARAR FUSÃO (pedido do CAIO: "faz separar com a joy"): só com ela
        const temFusao = (this.st.party || []).some((m) => ehFusao(m));
        if (!npc.tutor && !ehCentro && !temFusao) return this.curarEquipe(npc);
        const opcoes = ["CURAR", ...(temFusao ? ["SEPARAR FUSÃO"] : []), ...(npc.tutor ? ["TROCAR GOLPES"] : []), ...(ehCentro ? ["ENTREGAS", "PROCURADOS"] : []), "NADA"];
        this.dlg.ask(j.menu, opcoes, (i) => {
          const o = opcoes[i];
          if (o === "CURAR") return this.curarEquipe(npc);
          if (o === "SEPARAR FUSÃO") return this.separarComJoy();
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

  /** AS TIRINHAS DO VÍTOR (src/data/amigos.js, src/scenes/tirinha.js): ele
   *  mostra a próxima do caderno, em ordem, e volta pra primeira no fim. */
  oferecerTirinha() {
    const T = DB.TIRINHAS, st = this.st;
    this.dlg.ask(T.pergunta, T.opcoes, (i) => {
      if (i !== 0) return void this.dlg.say(T.nao);
      const n = (st.tirinhaVitor || 0) % T.lista.length;
      st.tirinhaVitor = n + 1;
      this.game.scenes.push(new TirinhaScene(), {
        tirinha: T.lista[n], numero: n + 1,
        onDone: () => this.dlg.say(T.lista[n].fim || T.depois[n % T.depois.length]),
      });
    });
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
      const foe = createMon(npc.boss.id, npc.boss.lvl, { corrupt: !!npc.boss.corrupt, alfa: !!npc.boss.alfa, shiny: !!npc.boss.shiny });
      // só um pedaço da animação (o BLACEPHALON CONTRA DEUS só faz o six seven)
      if (npc.boss.soQuadros) foe.soQuadros = npc.boss.soQuadros;
      const b = { foe, glitch: true, boss: true, npcKey: chave, falaCaptura: npc.falaCaptura, flagVitoria: npc.boss.flag || null,
                  flagCaptura: npc.boss.flagCaptura || null };
      this.entrarEmBatalha("chefe", b, () => this.game.scenes.push(new BattleScene(), b));
    });
  }

  /** conta os 3 minutos e devolve o jogador quando a fenda fecha */
  /** conta o tempo da fenda (o loop principal é quem desconta) e fecha no zero */
  /** Estou numa fenda? A 011GLITCHDIMENSION110, ou um mapa marcado `fenda: true`
   *  (a KANTO DISTORCIDA do dlc/extrema.js): é onde o relógio da fenda corre. */
  naFenda() {
    const aqui = this.st.player.map;
    return aqui === "glitchdim" || !!DB.MAPS[aqui]?.fenda;
  }

  updateFragmentTimer() {
    const m = this.st.mission;
    if (!m?.timed || !this.naFenda()) return;

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
    if (!npc.bau) state.hidden = true;         // a bola some do chão (o baú fica, aberto)
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

  /** A PESQUISADORA DO DYNAMAX, depois da pulseira: o CANHÃO DE RAIOS
   *  (src/scenes/canhaomax.js) dá COGUMELOS MAX, e com SOPA_CUSTA deles ela
   *  faz uma SOPA MAX. */
  falarPesquisadoraMax() {
    const tem = () => this.st.items["cogumelo max"] || 0;
    const menu = () => this.dlg.ask(`QUER O QUÊ? (VOCÊ TEM ${tem()} COGUMELO${tem() === 1 ? "" : "S"} MAX)`,
      ["CANHÃO DE RAIOS", "FAZER SOPA MAX", "COMO USA A PULSEIRA", "TCHAU"], (i) => {
        if (i === 0) return void this.dlg.say([
          "OS CRAMORANT ENGOLEM OS COGUMELOS MAX DA REGIÃO!",
          "LEVA UM CHOQUE DO MEU CANHÃO E ELES CUSPEM. O PIKACHU DA CÚPULA ADORA AJUDAR!",
        ], () => this.game.scenes.push(new CanhaoMaxScene(), {}));
        if (i === 1) {
          if (tem() < SOPA_CUSTA) return void this.dlg.say(`PRA SOPA MAX EU PRECISO DE ${SOPA_CUSTA} COGUMELOS MAX. VOCÊ TEM ${tem()}. VAI NO CANHÃO!`, menu);
          this.spend("cogumelo max", SOPA_CUSTA);
          this.st.items["sopa max"] = (this.st.items["sopa max"] || 0) + 1;
          Audio2.heal();
          this.game.autosave?.(true);
          return void this.dlg.say(["MEXE, MEXE, MEXE... PRONTO!", "VOCÊ GANHOU UMA SOPA MAX!"], menu);
        }
        if (i === 2) return void this.dlg.say([
          "A PULSEIRA DYNAMAX FUNCIONA EM GINÁSIO, NA LIGA E NAS RAIDS.",
          "NA BATALHA, APERTE V ANTES DE ESCOLHER O GOLPE. SEU POKÉMON FICA GIGANTE POR 3 TURNOS!",
        ], menu);
      });
    menu();
  }

  /** O PAINTBALL DE CELADON (src/data/paintball.js): a porta da loja de
   *  departamento chama a recepcionista, e JOGAR abre a arena com os 2
   *  primeiros da equipe que estão de pé. */
  entrarPaintball() {
    const P = DB.PAINTBALL, T = P.texto;
    const pergunta = () => this.dlg.ask(T.pergunta, T.opcoes, (i) => {
      if (i === 1) return void this.dlg.say(T.regras, pergunta);
      if (i !== 0) return void this.dlg.say(T.tchau);
      const mons = this.st.party.filter((m) => m.hp > 0 && !m.egg && !m.ovo).slice(0, 2);
      if (!mons.length) return void this.dlg.say(T.poucos);
      this.game.scenes.push(new PaintballScene(), { mons });
    });
    this.dlg.say(T.recepcao, pergunta);
  }

  /** A CONFEITEIRA de Cinnabar: conta as RECEITAS dos doces do Brasil (as
   *  berries que, batidas no modo DOCE do liquidificador, viram cada um) */
  falarConfeiteira() {
    const D = DB.DOCES_TEXTO;
    const nomeBerry = (b) => b.replace(" berry", "").toUpperCase();
    const linhas = (DB.DOCES || []).filter((d) => d.receita)
      .map((d) => `${d.nome}: ${d.receita.map(nomeBerry).join(" + ")}`);
    // a caixa tem 3 linhas e receita comprida quebra: 2 por página
    const paginas = [];
    for (let i = 0; i < linhas.length; i += 2) paginas.push(linhas.slice(i, i + 2).join("\n"));
    this.dlg.say([...D.confeiteira, ...paginas, D.receitaFim]);
  }

  // ============================================================ AS BASES SECRETAS
  /** a ESCOTEIRA: dá o KIT na primeira vez */
  falarEscoteira() {
    const T = DB.BASES_TEXTO, st = this.st;
    if (st.items[DB.KIT_BASE] > 0 || st.flags.ganhouKitBase) return void this.dlg.say(T.jaTem);
    this.dlg.say(T.escoteira, () => {
      st.items[DB.KIT_BASE] = 1;
      st.flags.ganhouKitBase = true;
      Audio2.heal();
      this.game.autosave?.(true);
      this.dlg.say(T.ganhouKit);
    });
  }

  /** O KIT: de frente pra árvore, pedra ou parede (bloco que segura), ao ar
   *  livre, sem porta nem ninguém ali — a base da região vem pra cá */
  usarKitBase() {
    const T = DB.BASES_TEXTO, st = this.st, p = st.player;
    if (this.map?.interior) { Audio2.cancel(); return void this.dlg.say(T.dentroNao); }
    // as duas funções do kit: PRA BAIXO (buraco no chão) ou NA PAREDE
    this.dlg.ask(T.tipoKit, T.tiposKit, (i) => {
      if (i === 0) this.abrirBaseNoKit("chao");
      else if (i === 1) this.abrirBaseNoKit("parede");
    });
  }

  /** abre a base de frente: na PAREDE (bloco que segura) ou PRA BAIXO (um
   *  buraco no chão livre da frente — pisou nele, desce pra base) */
  abrirBaseNoKit(tipo) {
    const T = DB.BASES_TEXTO, st = this.st, p = st.player;
    const [dx, dy] = DIRS[p.dir] || [0, 1];
    const fx = p.x + dx, fy = p.y + dy;
    const t = this.tagAt(fx, fy);
    const ocupado = this.warpAt(fx, fy) || this.npcAt(fx, fy) || this.map?.signs?.[`${fx},${fy}`];
    if (tipo === "chao" && (![DB.TAG.FREE, DB.TAG.GRASS].includes(t) || ocupado || this.obstaculoEm(fx, fy))) {
      Audio2.cancel();
      return void this.dlg.say(T.chaoNao);
    }
    if (tipo === "parede" && (t !== DB.TAG.BLOCK || ocupado)) {
      Audio2.cancel();
      return void this.dlg.say(T.aquiNao);
    }
    const regiao = regiaoDe(p.map);
    const ja = st.bases?.[regiao];
    const pergunta = ja ? T.mudar.replace("{REGIAO}", T.regioes[regiao] || regiao.toUpperCase()) : T.abrirAqui;
    this.dlg.ask(pergunta, T.sim, (i) => {
      if (i !== 0) return;
      abrirBase(st, p.map, fx, fy, tipo);
      Glitch.hit(0.3);
      Audio2.heal();
      this.game.autosave?.(true);
      Online.anunciarBases?.();
      this.dlg.say(tipo === "chao" ? T.abriuChao : T.abriu);
    });
  }

  entrarNaBase(base) {
    const regiao = Object.entries(this.st.bases || {}).find(([, b]) => b === base)?.[0] || regiaoDe(this.st.player.map);
    Audio2.tone(440, 0.05);
    this.game.scenes.push(new BaseScene(), { base, regiao, dono: this.st.player.name || "VOCÊ" });
  }

  /** ACHOU a porta secreta de outro jogador: bate e espera ele mandar a base */
  async visitarBase(o) {
    const T = DB.BASES_TEXTO;
    this.dlg.say(T.batendo.replace("{NOME}", o.nome));
    const r = await Online.pedirBase(o.id, o.regiao);
    if (!r?.base) return void this.dlg.say(T.ninguem);
    // fecha o "batendo..." (se ainda está na tela) e entra
    Object.assign(this.dlg, { queue: [], lines: [], done: null, choice: null, active: false });
    this.game.scenes.push(new BaseScene(), { base: r.base, regiao: r.base.regiao || o.regiao, dono: r.nome || o.nome, visita: true });
  }

  /** A FONTE DE CELADON: fechada, só a pedrinha do botão na borda; seca, o
   *  fundo de pedra molhada e a escada descendo */
  desenhaFonte(ctx, cx, cy) {
    const F = DB.FONTE_CELADON;
    if (!F || this.st.player.map !== F.mapa) return;
    const px = (x, y, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), 1, 1); };
    if (!this.fonteSeca()) {
      // a pedrinha solta no lado esquerdo da borda (o botão está embaixo dela)
      const X = F.centro.x - F.raio.x - 3 - cx, Y = F.centro.y - 2 - cy;
      ctx.fillStyle = "#8a7a6a"; ctx.fillRect(Math.round(X), Math.round(Y), 4, 3);
      px(X + 1, Y, "#b8a898"); px(X, Y + 3, "#4a3a2a"); px(X + 3, Y + 2, "#4a3a2a");
      return;
    }
    // SECA: o jato desliga e a bacia fica de pedra molhada, com a escada no meio
    const ox = F.centro.x - cx, oy = F.centro.y - cy;
    ctx.fillStyle = "#8c949c";
    ctx.beginPath(); ctx.ellipse(ox, oy, F.raio.x, F.raio.y, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#77808a";
    ctx.beginPath(); ctx.ellipse(ox, oy + 2, F.raio.x - 3, F.raio.y - 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(90,150,210,0.45)";                       // as poças que sobraram
    ctx.fillRect(Math.round(ox - 11), Math.round(oy + 6), 5, 2); ctx.fillRect(Math.round(ox + 6), Math.round(oy - 6), 4, 2);
    ctx.fillStyle = "rgba(20,30,40,0.3)";                          // a sombra da borda em cima
    ctx.fillRect(Math.round(ox - 10), Math.round(oy - F.raio.y + 1), 20, 3);
    // a ESCADA descendo, no meio
    const X = Math.round(ox - 7), Y = Math.round(oy - 6);
    ctx.fillStyle = "#1a1c22"; ctx.fillRect(X, Y, 14, 13);
    for (let k = 0; k < 4; k++) {
      ctx.fillStyle = k % 2 ? "#5b636b" : "#6c757d";
      ctx.fillRect(X + 1 + k, Y + 1 + k * 3, 12 - k * 2, 2);
    }
  }

  /** a SUA porta: um buraquinho escuro no bloco (os outros não veem nada) */
  desenhaPortaDaBase(ctx, cx, cy) {
    const mapa = this.st.player.map;
    for (const b of Object.values(this.st.bases || {})) {
      if (!b || b.mapa !== mapa) continue;
      const x = Math.round(b.x * TILE - cx), y = Math.round(b.y * TILE - cy);
      if (x < -TILE || y < -TILE || x > W || y > H) continue;
      if (b.escondida) {
        // ESCONDIDA: camuflada — só um risquinho, pra você lembrar onde é
        ctx.fillStyle = "rgba(20,14,10,0.28)";
        if (b.tipo === "chao") { ctx.fillRect(x + 5, y + 7, 6, 1); ctx.fillRect(x + 6, y + 8, 4, 1); }
        else ctx.fillRect(x + 7, y + 6, 1, 8);
        continue;
      }
      if (b.tipo === "chao") {
        // o BURACO no chão, com a pontinha da escada aparecendo
        const BURACO = [
          "................",
          "................",
          "....kkkkkkkk....",
          "..kkddddddddkk..",
          ".kddddddddddddk.",
          ".kddtddddddtddk.",
          "kdddtttttttttddk",
          "kdddtddddddtdddk",
          "kdddtttttttttddk",
          ".kddtddddddtddk.",
          ".kddddddddddddk.",
          "..kkddddddddkk..",
          "....kkkkkkkk....",
          "................",
          "................",
          "................",
        ];
        const COR = { k: "#5a3e24", d: "#120c0a", t: "#a07a4a" };
        BURACO.forEach((l, j) => [...l].forEach((c, i) => { if (COR[c]) { ctx.fillStyle = COR[c]; ctx.fillRect(x + i, y + j, 1, 1); } }));
        continue;
      }
      ctx.fillStyle = "#1a1418";
      ctx.fillRect(x + 4, y + 5, 8, 11);
      ctx.fillRect(x + 5, y + 4, 6, 1);
      ctx.fillStyle = "rgba(255,220,120,0.5)";
      ctx.fillRect(x + 7, y + 9, 2, 1);
    }
  }

  /** O AZUL NA LÁPIDE do RATICATE (RATICATE_DO_RIVAL, src/data/rival.js):
   *  1ª conversa ele chora; na 2ª o caçador diz que dá pra reviver; depois,
   *  com o RATICATE dele revivido na equipe, você entrega. */
  falarRivalLapide(npc) {
    const R = DB.RATICATE_DO_RIVAL, st = this.st, f = (st.flags ||= {});
    const etapa = f.raticateRival || 0;
    if (etapa === 0) { f.raticateRival = 1; return void this.dlg.say(R.chorando); }
    if (etapa === 1) {
      f.raticateRival = 2;
      this.game.autosave?.(true);
      return void this.dlg.say(R.pedido);
    }
    if (etapa === 2) {
      const i = st.party.findIndex((m) => m.doRival);
      if (i < 0) return void this.dlg.say(todosGuardados(st).some((m) => m.doRival) ? R.noBox : R.esperando);
      const [mon] = st.party.splice(i, 1);
      f.raticateRival = 3;
      this.game.autosave?.(true);
      // O REENCONTRO (desenharReencontro): ele corre e pula no colo; a fala vem depois
      // ele sai da bola um pouco atrás e do lado de você, pra dar tempo de correr
      const px = this.st.player.x, py = this.st.player.y;
      const ux = Math.sign(px - npc.x), uy = Math.sign(py - npc.y);
      const de = { x: px + ux * 1.5 - uy * 1.2, y: py + uy * 1.5 + ux * 1.2 };
      this.reencontro = { t: 0, npc, mon, de, coracoes: [], gritos: 0 };
      return;
    }
    this.dlg.say(R.depois);
  }

  /** O TREM MAGNÉTICO (src/data/johto.js): o bilheteiro pergunta, a cena da
   *  viagem (src/scenes/trem.js) passa, e você desce no destino */
  pegarTrem(para) {
    const T = DB.TREM, d = T?.destinos?.[para], st = this.st;
    if (!d) return;
    if (!T.pode(st)) return void this.dlg.say(T.fechado);
    this.dlg.ask(T.pergunta(d.nome), T.opcoes, (i) => {
      if (i !== 0) return;
      Audio2.select();
      this.game.scenes.push(new TremScene(), {
        de: DB.MAPS[st.player.map]?.name || "", para: d.nome, indoPraJohto: para === "goldenrod",
        fim: () => {
          Object.assign(st.player, { map: d.mapa, x: d.x, y: d.y, dir: d.dir || "down" });
          st.surfando = null;
          this.compa = null;
          this.justWarped = true;
          this.afterTravel();
          this.game.autosave?.(true);
          this.dlg.say(T.chegou(d.nome));
        },
      });
    });
  }

  /** O ENTERRO DO BRASEAGLE (src/data/zerogle.js), com o TOMÁS */
  falarTomas() {
    const Z = ZEROGLE, f = (this.st.flags ||= {}), etapa = f.zerogle || 0;
    if (etapa === 0) { f.zerogle = 1; this.game.autosave?.(true); return void this.dlg.say(Z.pede); }
    if (etapa === 1) return void this.dlg.say(Z.esperandoPa);
    if (etapa >= 3) return void this.dlg.say(Z.visita);
    this.dlg.ask(Z.vamos, Z.opcoes, (i) => {
      if (i !== 0) return void this.dlg.say(Z.depois);
      this.enterrarBraseagle();
    });
  }

  falarZeladora() {
    this.st.flags.zerogle = 2;
    Audio2.heal();
    this.game.autosave?.(true);
    this.dlg.say(ZEROGLE.zeladora);
  }

  /** o enterro: três pás de terra (a tela treme), a lápide nova aparece, a
   *  despedida... e o UIVO do ZEROGLE */
  enterrarBraseagle() {
    const Z = ZEROGLE, f = this.st.flags;
    const pa = (n, depois) => {
      if (n === 0) return depois();
      this.tremor = Math.max(this.tremor || 0, 0.3);
      Audio2.tone(140, 0.12, "sawtooth", 0.25);
      Audio2.tone(90, 0.18, "square", 0.15);
      this.dlg.say(Z.cava, () => pa(n - 1, depois));
    };
    this.dlg.say(Z.comeco, () => pa(3, () => {
      f.zerogle = 3;                                  // a lápide aparece (desenharLapideZerogle)
      Audio2.heal();
      this.game.autosave?.(true);
      this.dlg.say(Z.despedida, () => {
        // o uivo: duas vezes, a segunda um tiquinho depois e mais baixa — o eco de fantasma
        Audio2.grito(Z.grito, 1);
        setTimeout(() => Audio2.grito(Z.grito, 0.985), 230);
        this.dlg.say(Z.uivo, () => this.dlg.say(Z.fim, () => {
          // a LAMBIDA: *slurp*, e ele aparece em cima da lápide
          Audio2.tone(700, 0.08, "sine", 0.2); Audio2.tone(1100, 0.12, "sine", 0.15);
          this.dlg.say(Z.lambida, () => this.dlg.say(Z.sentiu, () => {
            f.zerogleViu = true;
            this.zerogleAparece = performance.now();
            tocarGrito({ species: "zerogle" });
            tirarFoto(this.st, { retrato: "garoto", nome: "TOMÁS", mon: "zerogle" });
            this.dlg.say(Z.apareceu);
          }));
        }));
      });
    }));
  }

  /** O ZEROGLE em cima da lápide: aparece devagar (transparente) e fica
   *  boiando, meio de fantasma */
  desenharZerogle(ctx, cx, cy) {
    const Z = ZEROGLE.fantasma, agora = performance.now();
    const k = this.zerogleAparece ? Math.min(1, (agora - this.zerogleAparece) / 1400) : 1;
    const q = Assets.monAndando({ species: "zerogle" }, Z.dir, agora);
    const boia = Math.sin(agora / 420) * 2;
    const x = Z.x * TILE - cx + 8, y = Z.y * TILE - cy + 15 + boia;
    ctx.save();
    ctx.globalAlpha = k * (0.72 + 0.12 * Math.sin(agora / 300));
    if (q) ctx.drawImage(q, Math.round(x - q.width / 2), Math.round(y - q.height));
    else Assets.desenhaVivo(ctx, { species: "zerogle" }, Math.round(x - 14), Math.round(y - 28), 28);
    ctx.restore();
    // aparecendo: brilhinhos subindo
    if (k < 1) {
      ctx.fillStyle = `rgba(220,235,255,${1 - k})`;
      for (let i = 0; i < 8; i++) ctx.fillRect(Math.round(x - 12 + ((i * 7) % 24)), Math.round(y - 4 - ((agora / 20 + i * 13) % 26)), 1, 1);
    }
  }

  /** a LÁPIDE NOVA do BRASEAGLE, pixel por pixel */
  desenharLapideZerogle(ctx, cx, cy) {
    const Z = ZEROGLE, x0 = Z.lapide.x * TILE - cx, y0 = Z.lapide.y * TILE - cy;
    Z.lapideGrade.forEach((l, j) => {
      for (let i = 0; i < l.length; i++) {
        const c = Z.lapideCores[l[i]];
        if (!c) continue;
        ctx.fillStyle = c;
        ctx.fillRect(x0 + i, y0 + j, 1, 1);
      }
    });
  }

  /** onde está o RATICATE do AZUL agora, em tiles (e o que ele está fazendo).
   *  Linha do tempo do reencontro (pedido do CAIO: "CORRE E PULA NO COLO"):
   *  0 sai da bola · 0,5 "!" nos dois · 1,3 corre · 2,4 pula · 2,9 giram com
   *  corações · 5 assenta do lado dele · 5,6 a fala. */
  raticateDoRival() {
    const R = DB.RATICATE_DO_RIVAL, lado = R.companheiro;
    const c = this.reencontro;
    if (!c) {
      if (this.st.player.map !== "pokemon_tower_2f" || (this.st.flags?.raticateRival || 0) < 3) return null;
      return { x: lado.x, y: lado.y, dir: "down", parado: true };
    }
    const t = c.t, P = c.de, Rv = { x: c.npc.x, y: c.npc.y };
    const dx = P.x - Rv.x, dy = P.y - Rv.y, d = Math.hypot(dx, dy) || 1;
    const A = d <= 1 ? P : { x: Rv.x + dx / d, y: Rv.y + dy / d };   // do lado dele
    const rumo = (ax, ay) => (Math.abs(ax) > Math.abs(ay) ? (ax > 0 ? "right" : "left") : ay > 0 ? "down" : "up");
    const lerp = (a, b, k) => ({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k });
    if (t < 0.5) return { ...P, dir: rumo(-dx, -dy), escala: Math.min(1, t / 0.3), bola: t };
    if (t < 1.3) return { ...P, dir: rumo(-dx, -dy), exclama: t - 0.5 };
    if (t < 2.4) return { ...lerp(P, A, (t - 1.3) / 1.1), dir: rumo(-dx, -dy), correndo: true };
    if (t < 2.9) { const k = (t - 2.4) / 0.5; return { ...lerp(A, Rv, k), dir: rumo(-dx, -dy), pulo: Math.sin(Math.PI * k) * 14 + k * 8 }; }
    if (t < 5) { const a = (t - 2.9) * 12; return { x: Rv.x + Math.cos(a) * 0.45, y: Rv.y + Math.sin(a) * 0.3, dir: ["down", "left", "up", "right"][Math.floor((t - 2.9) / 0.1) % 4], pulo: 8, girando: true }; }
    return { ...lerp(Rv, lado, Math.min(1, (t - 5) / 0.6)), dir: "down", correndo: t < 5.6 };
  }

  atualizarReencontro(dt) {
    const c = this.reencontro, R = DB.RATICATE_DO_RIVAL;
    c.t += dt;
    const t = c.t, n = c.npc;
    const rumo = (ax, ay) => (Math.abs(ax) > Math.abs(ay) ? (ax > 0 ? "right" : "left") : ay > 0 ? "down" : "up");
    if (t >= 0.5 && c.gritos === 0) { c.gritos = 1; tocarGrito(c.mon); }
    if (t >= 0.5 && t < 2.9) n.dir = rumo(c.de.x - n.x, c.de.y - n.y);            // ele vira e vê
    if (t >= 2.9 && c.gritos === 1) { c.gritos = 2; tocarGrito(c.mon); Audio2.heal(); }
    if (t >= 2.9 && t < 5) n.dir = ["down", "right", "up", "left"][Math.floor((t - 2.9) / 0.1) % 4];   // girando
    if (t >= 2.9 && t < 5.4 && Math.floor(t / 0.15) !== Math.floor((t - dt) / 0.15)) {
      c.coracoes.push({ x: n.x * TILE + 8 + (Math.random() - 0.5) * 24, y: n.y * TILE - 6, v: 14 + Math.random() * 10, vida: 1.4 });
    }
    for (const h of c.coracoes) { h.y -= h.v * dt; h.vida -= dt; }
    c.coracoes = c.coracoes.filter((h) => h.vida > 0);
    if (t >= 5) n.dir = rumo(this.st.player.x - n.x, this.st.player.y - n.y);
    if (t >= 5.6) {
      this.reencontro = null;
      // a selfie do fim vai pra CÂMERA (src/systems/fotos.js): ele e o RATICATE
      tirarFoto(this.st, { retrato: "rival", nome: this.st.rivalNome || DB.RIVAL?.nome || "AZUL", mon: "raticate" });
      this.dlg.say(R.entrega);
    }
  }

  /** o RATICATE (e, no reencontro, a bola, o "!" e os corações) */
  desenharReencontro(ctx, rr, cx, cy) {
    const c = this.reencontro, mon = c?.mon || (this._raticateRival ||= createMon("raticate", 46));
    const x = rr.x * TILE - cx, y = rr.y * TILE - cy - (rr.pulo || 0);
    if (rr.bola != null) {
      const r = 4 + rr.bola * 30;
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0, 1 - rr.bola * 2)})`;
      ctx.beginPath(); ctx.arc(x + 8, y + 8, r, 0, Math.PI * 2); ctx.fill();
    }
    const e = rr.escala ?? 1;
    if (e > 0) {
      const passo = Assets.monAndando(mon, rr.dir, rr.correndo || rr.girando ? (c?.t || 0) * 2000 : 0);
      if (passo) {
        const w = Math.round(passo.width * e), h = Math.round(passo.height * e);
        ctx.drawImage(passo, Math.round(x + 8 - w / 2), Math.round(y + 15 - h), w, h);
      } else Assets.desenhaVivo(ctx, mon, Math.round(x + 8 - 14 * e), Math.round(y + 16 - 28 * e), Math.round(28 * e));
    }
    if (!c) return;
    if (rr.exclama != null) {
      desenharEmote(ctx, "!", Math.round(x + 8), Math.round(y - 22), rr.exclama);
      desenharEmote(ctx, "!", c.npc.x * TILE - cx + 8, c.npc.y * TILE - cy - 26, rr.exclama);
    }
    // os corações (pixel por pixel)
    const CORACAO = [".#.#.", "#####", "#####", ".###.", "..#.."];
    for (const h of c.coracoes) {
      ctx.globalAlpha = Math.min(1, h.vida);
      ctx.fillStyle = "#e0304a";
      CORACAO.forEach((l, j) => { for (let i = 0; i < l.length; i++) if (l[i] === "#") ctx.fillRect(Math.round(h.x - cx) + i, Math.round(h.y - cy) + j, 1, 1); });
      ctx.globalAlpha = 1;
    }
  }

  /** O CAÇADOR DE FANTASMAS da TORRE POKÉMON (src/data/cacafantasma.js):
   *  CAÇAR abre a máquina; REVIVER gasta 100 FICHAS DE ALMA de um Pokémon. */
  falarCacaFantasma() {
    const C = CACA_FANTASMA, T = C.texto, st = this.st;
    const nome = (id) => DB.SPECIES[id]?.name || id.toUpperCase();
    const menu = () => this.dlg.ask(T.pergunta, T.opcoes, (i) => {
      if (i === 0) return void this.game.scenes.push(new CacaFantasmaScene(), {});
      if (i === 1) return reviver();
      if (i === 2) return void this.dlg.say(T.regras, menu);
      this.dlg.say(T.tchau);
    });
    // a lista das almas, das mais cheias pras mais vazias, de 6 em 6
    const reviver = (pag = 0) => {
      const todas = Object.entries(st.almas || {}).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]);
      if (!todas.length) return void this.dlg.say(T.semAlma, menu);
      const POR = 6, lista = todas.slice(pag * POR, pag * POR + POR);
      const mais = (pag + 1) * POR < todas.length, volta = pag > 0;
      const ops = [...lista.map(([id, n]) => `${nome(id)} ${n}%`), ...(mais ? [T.mais] : []), ...(volta ? [T.voltar] : []), T.sair];
      this.dlg.ask(T.qual, ops, (k) => {
        if (ops[k] === T.mais) return reviver(pag + 1);
        if (ops[k] === T.voltar) return reviver(pag - 1);
        const par = lista[k];
        if (!par) return menu();
        const [id, n] = par;
        if (n < 100) return void this.dlg.say(T.falta.replace("{MON}", nome(id)).replace("{P}", n).replace("{F}", 100 - n), () => reviver(pag));
        // o RATICATE do AZUL (RATICATE_DO_RIVAL): o 1º revivido na missão é DELE
        const R = DB.RATICATE_DO_RIVAL;
        const doRival = id === "raticate" && st.flags?.raticateRival === 2
          && ![...st.party, ...todosGuardados(st)].some((m) => m.doRival);
        if (doRival && st.party.length >= 6) return void this.dlg.say(R.equipeCheia, () => reviver(pag));
        this.dlg.ask(T.confirma.replace("{MON}", nome(id)), T.sim, (s) => {
          if (s !== 0) return reviver(pag);
          st.almas[id] -= 100;
          if (!st.almas[id]) delete st.almas[id];
          const mon = createMon(id, C.nivelRevive);
          // A CENA DO REVIVER (src/scenes/reviver.js): as fichas viram alma;
          // a fala vem quando ela fecha
          const cena = (fala) => this.game.scenes.push(new ReviverScene(), { mon, fim: () => this.dlg.say(fala) });
          if (doRival) {
            mon.doRival = true;
            st.party.push(mon);
            this.game.autosave?.(true);
            return void cena([...T.reviveu.map((l) => l.replace("{MON}", nome(id))), R.reviveuDele]);
          }
          const noBox = st.party.length >= 6;
          if (noBox) guardarNoBox(st, mon); else st.party.push(mon);
          st.seen[id] = st.caught[id] = true;
          this.game.autosave?.(true);
          const fala = T.reviveu.map((l) => l.replace("{MON}", nome(id)));
          if (noBox) fala.push(T.foiPraBox.replace("{MON}", nome(id)));
          cena(fala);
        });
      });
    };
    this.dlg.say(T.oi, menu);
  }

  /** O BALCÃO DE FICHAS do cassino: os prêmios do FireRed, pagos com as
   *  fichas do paintball (st.fichas). */
  balcaoFichas() {
    const F = DB.PREMIOS_FICHAS, T = F.texto, st = this.st;
    const nome = (p) => DB.SPECIES[p.especie]?.name || p.especie.toUpperCase();
    const ops = [...F.premios.map((p) => `${nome(p)} ${p.preco}`), T.sair];
    const D = DB.DOCES_TEXTO;
    // OS DOCES do balcão (src/data/doces.js): os 7 do Sword/Shield, ou os DO
    // BRASIL (mais caros, de 6 em 6 por página: 12 de uma vez não cabem na tela)
    const doces = (brasil = false, pag = 0) => {
      const todos = (DB.DOCES || []).filter((d) => (brasil ? d.brasil : d.balcao));
      const POR = 6, lista = todos.slice(pag * POR, pag * POR + POR);
      const mais = (pag + 1) * POR < todos.length, volta = pag > 0;
      const preco = brasil ? D.precoBrasil : D.precoBalcao;
      const ops = [...lista.map((d) => d.nome), ...(mais ? [D.mais] : []), ...(volta ? [D.voltar] : []), T.sair];
      this.dlg.ask(D.qualDoce.replace("{PRECO}", preco), ops, (i) => {
        if (ops[i] === D.mais) return doces(brasil, pag + 1);
        if (ops[i] === D.voltar) return doces(brasil, pag - 1);
        const d = lista[i];
        if (!d) return;
        if ((st.fichas || 0) < preco) return void this.dlg.say(T.falta);
        st.fichas -= preco;
        st.items[d.item] = (st.items[d.item] || 0) + 1;
        Audio2.heal();
        this.game.autosave?.(true);
        this.dlg.say(D.ganhouDoce.replace("{ITEM}", d.item.toUpperCase()), () => doces(brasil, pag));
      });
    };
    // OS MÓVEIS da base secreta que só saem aqui (src/data/bases.js)
    const moveis = () => {
      const lista = DB.MOVEIS_FICHAS || [];
      const ops = [...lista.map((m) => `${m.item.toUpperCase()} ${m.preco}`), T.sair];
      this.dlg.ask(T.qual, ops, (i) => {
        const m = lista[i];
        if (!m) return;
        if ((st.fichas || 0) < m.preco) return void this.dlg.say(T.falta);
        st.fichas -= m.preco;
        st.items[m.item] = (st.items[m.item] || 0) + 1;
        Audio2.heal();
        this.game.autosave?.(true);
        this.dlg.say(D.ganhouDoce.replace("{ITEM}", m.item.toUpperCase()), moveis);
      });
    };
    this.dlg.say(T.oi.replace("{FICHAS}", st.fichas || 0), () => this.dlg.ask(T.qual, D.categorias, (c) => {
      if (c === 1) return doces();
      if (c === 2) return doces(true);
      if (c === 3) return moveis();
      if (c !== 0) return;
      this.dlg.ask(T.qual, ops, (i) => {
        const p = F.premios[i];
        if (!p) return;
        if ((st.fichas || 0) < p.preco) return void this.dlg.say(T.falta);
        this.dlg.ask(T.confirma.replace("{MON}", nome(p)).replace("{PRECO}", p.preco), T.sim, (k) => {
          if (k !== 0) return;
          st.fichas -= p.preco;
          const mon = createMon(p.especie, p.nivel);
          if (st.party.length < 6) st.party.push(mon);
          else guardarNoBox(st, mon);
          st.seen[p.especie] = st.caught[p.especie] = true;
          Audio2.heal();
          this.game.autosave?.(true);
          this.dlg.say(T.ganhou.replace("{MON}", nome(p)));
        });
      });
    }));
  }

  /** Alguém da equipe passou do nível de evoluir? Abre a tela de evolução do
   *  primeiro que estiver pronto. Ao fechar, o resume() volta aqui e pega o
   *  próximo — inclusive quem evolui duas vezes seguidas com doce raro. */
  rodarEvolucao(estranho = false) {
    for (const mon of this.st.party) {
      // apertou B na evolução (src/scenes/evolution.js): só depois de subir de nível
      if ((mon.naoEvoluiAte ?? -1) >= mon.level) continue;
      // (a FUSÃO evolui por metade: src/systems/fusao.js, evolucaoDaFusao)
      const to = evolutionFor(mon, this.st.player.map) || evolucaoDaFusao(mon, this.st.player.map);
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
    // pela pedra não se para (como nos oficiais): ela já foi gasta
    this.game.scenes.push(new EvolutionScene(), { mon, to, estranho, semParar: true });
  }

  /** OS DOCES (src/data/doces.js): o MILCERY evolui na hora pra ALCREMIE com
   *  o creme da cor do doce; o ALCREMIE ganha a cor no redemoinho. */
  darDoce(item, mon) {
    this.menu = null;
    const doce = doceDoItem(item), T = DB.DOCES_TEXTO;
    const f = (t) => t.replace("{MON}", mon.nickname).replace("{ITEM}", item.toUpperCase());
    if (mon.species === "milcery" && DB.SPECIES.alcremie) {
      this.spend(item, 1);
      // a cor vai no seed antes: a cena da evolução já revela o creme novo
      mon.seed = seedDosDoces([doce]);
      return void this.dlg.say(f(T.evolui), () =>
        this.game.scenes.push(new EvolutionScene(), { mon, to: "alcremie", semParar: true }));
    }
    if (mon.species === "alcremie") {
      this.spend(item, 1);
      const seedAntes = mon.seed;
      const { cores, saiu } = comerDoce(mon, doce);
      this.game.autosave?.(true);
      const falas = [f(T.girou).replace("{CORES}", cores.map((d) => d.nome).join(", "))];
      if (saiu) falas.push(T.saiuCor.replace("{COR}", saiu.nome));
      // a CUTSCENE: ele gira e o creme novo cobre o velho (src/scenes/alcremie.js)
      return void this.game.scenes.push(new AlcremieScene(), { mon, seedAntes, seedDepois: mon.seed, doce, falas });
    }
    Audio2.cancel();
    this.dlg.say(f(T.nada));
  }

  /** O GIRO DO BEBBIDAH (src/systems/bebbidah.js): o primeiro da equipe que
   *  segura um ingrediente de sanduíche bebe ele e vira BEBBIDÃO — a bebida
   *  do item, o tom do lugar, gelado de dia e quente de noite. */
  giroBebbidah() {
    const mon = quemGira(this.st.party);
    if (!mon || !DB.SPECIES.bebbidao || this.menu || this.dlg.active) return false;
    const forma = formaDaqui(mon.item, this.st.player.map);
    if (!forma) return false;
    const T = DB.BEBBIDAH_TEXTO;
    const falas = [
      T.girou.replace("{MON}", mon.nickname).replace("{ITEM}", mon.item.toUpperCase()),
      T.virou.replace("{BEBIDA}", forma.bebida.nome).replace("{TEMP}", forma.quente ? T.quente : T.gelado)
        .replace("{TOM}", DB.BEBIDA_TONS[forma.tom].nome),
    ];
    delete mon.item;                     // o ingrediente se desmanchou na água
    // a forma vai no seed antes: a cena da evolução já mostra a bebida nova
    mon.seed = seedDaForma(forma);
    this.andandoLivre = false;
    this.dlg.say(falas, () =>
      this.game.scenes.push(new EvolutionScene(), { mon, to: "bebbidao", semParar: true }));
    return true;
  }

  /** fragmento de portal solto pelo mundo: entrada por tempo limitado */
  useFragment() {
    const tranca = DB.FENDA_TRANCADA?.(this.st);
    if (tranca) return void this.dlg.say(tranca);
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
    // o ETERNAMAX volta a ser ETERNATUS no CENTRO (src/systems/formas.js)
    this.st.party.forEach((m) => { voltarDoEternamax(m); heal(m); });
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

  /** A MT / MO (src/systems/maquinas.js): só aprende golpe da lista dele; a
   *  MT some depois, a MO fica */
  usarMaquina(item, mon) {
    const m = golpeDaMaquina(item), T = MAQ_TEXTO;
    const golpe = DB.MOVES[m.golpe].name;
    const pode = podeAprender(mon, item);
    const troca = (t) => t.replace("{MON}", mon.nickname).replace("{GOLPE}", golpe).replace("{ITEM}", item.toUpperCase());
    if (pode !== true) { Audio2.cancel(); return void this.dlg.say(troca(T[pode] || T.naoPode)); }
    const depois = m.mo ? null : () => { this.spend(item, 1); return troca(T.sumiu); };
    if (mon.moves.length < 4) return this.ensinarGolpe(mon, m.golpe, -1, depois);
    this.menu = { type: "tutorSlot", index: 0, mon, novo: m.golpe, volta: null, depois };
  }

  /** aprende no primeiro slot vazio; se estiver cheio, pede qual trocar.
   *  `depois` (a MT): roda quando aprendeu e devolve mais uma fala */
  ensinarGolpe(mon, id, slot = -1, depois = null) {
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
    const mais = depois?.();
    this.game.autosave?.(true);
    this.dlg.say(mais ? [msg, mais] : msg);
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
      // os 3 quadros do FireRed dela sendo cortada (Assets.arvorezinhaCorte)
      this.corteArvore = { mapa: this.st.player.map, x: obst.x, y: obst.y, t0: performance.now() };
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
    // o avião de papel pousa em qualquer cidade: as de KANTO e as de BRAGLITCH
    // (as de Kanto primeiro, depois as de lá)
    const destinos = Object.entries(DB.FLY_SPOTS)
      .filter(([id]) => id !== this.st.player.map && DB.MAPS[id])
      .sort(([a], [b]) => (regiaoDoMapa(a) === "kanto" ? 0 : 1) - (regiaoDoMapa(b) === "kanto" ? 0 : 1));
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
    // sem as formas MEGA: elas só existem dentro da batalha. E sem as FORMAS
    // ÚNICAS (o UNIQUEMON): elas se vestem pelo GUARDA-ROUPA ÚNICO ou chegam
    // evoluindo, não se ganham prontas — a mesma regra do giveglitch/ do site
    const lista = Object.values(DB.SPECIES).filter((sp) => !sp.mega && !sp.vinculo && !sp.fusao && !sp.unicaDe)
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

  // ------------------------------------------------- AS COISAS IMENSAS
  /** Um GIGANTE (src/core/gigante3d.js) cruza o céu: em 3D, por cima do mapa
   *  2D, fazendo sombra no chão. Sorteado a cada passo ao ar livre; olhando pro
   *  céu (`noCeu`), muito mais fácil. Devolve true quando ele começou a passar. */
  talvezGigante(olhandoPraCima = false) {
    const st = this.st;
    if (this.gigante || this.menu || this.fx || st.capturado?.naBola || st.voando) return false;
    if (st.player.map === "glitchdim" || !temCeu(this.map) || !st.party.some((m) => m.hp > 0)) return false;
    const id = gigantePraPassar(st, olhandoPraCima);
    if (!id) return false;
    this.gigante = { id, fase: "passa", t: 0, ceu: olhandoPraCima };
    return true;
  }

  /** passa (cruza a tela) → pausa (o céu vazio) → volta (lá do fundo, e fica
   *  dando voltas em cima de você) → fala → luta. Devolve true enquanto ele
   *  segura o jogo parado. */
  andarGigante(dt) {
    // o sprite de batalha dele já vai sendo pedido: a cena dura uns segundos,
    // e a luta abre com ele pronto em vez da arte provisória
    if (!this.gigante.pediu) { this.gigante.pediu = true; Assets.mon(this.gigante.id); }
    if (this.gigante.tipo === "chao") return this.andarRegi(dt);
    const g = this.gigante, T = DB.STORY.gigantes;
    g.t += dt;
    if (g.fase === "passa") {
      if (g.t > 0.7 && g.t < 4.6) this.tremor = Math.max(this.tremor, 0.3);
      if (!g.rugiu && g.t > 1.4) {
        g.rugiu = true;
        tocarGrito(g.id);
        if (!g.ceu) this.avisar(T.sombra);
      }
      if (g.t >= FASES.passa.dura) { g.fase = "pausa"; g.t = 0; }
      return true;
    }
    if (g.fase === "pausa") {
      if (g.t >= 1) { g.fase = "volta"; g.t = 0; }
      return true;
    }
    if (g.fase === "volta" && !g.falou) {
      if (g.t < 3.6) return true;
      g.falou = true;
      tocarGrito(g.id);
      this.tremor = 0.8;
      const nome = DB.SPECIES[g.id]?.name || g.id.toUpperCase();
      // chamado de novo depois de pego: ele só vem ver você e sobe
      if (g.visita) return void this.dlg.say(T.visita.map((l) => l.replace("{MON}", nome)), () => { this.gigante = null; });
      this.dlg.say(T.desceu.map((l) => l.replace("{MON}", nome)), () => this.lutarComGigante());
    }
    return false;
  }

  /** A ESFERA DE JADE (ou outro item de `GIGANTES`), pela mochila: o gigante
   *  surge do fundo do céu e desce. Já pego, ele só vem dar uma volta. */
  invocarGigante(id) {
    const st = this.st, T = DB.STORY.gigantes;
    this.menu = null;
    if (this.gigante) return;
    if (st.player.map === "glitchdim" || !temCeu(this.map) || st.capturado?.naBola || st.voando) {
      Audio2.cancel();
      return void this.dlg.say(T.semCeu);
    }
    const pego = !!st.flags.gigantes?.[id];
    if (!pego && !st.party.some((m) => m.hp > 0)) { Audio2.cancel(); return void this.dlg.say(T.semTime); }
    Audio2.select();
    st.player.dir = "up";
    this.dlg.say(T.invocou, () => {
      Glitch.hit(0.3);
      this.tremor = 0.6;
      this.gigante = { id, fase: "volta", t: 0, visita: pego };
    });
  }

  /** O CIENTISTA na frente do POKÉ MART de Fuchsia (src/data/maps.js) vende a
   *  ESFERA DE JADE. Uma só: ela não gasta. */
  venderEsferaDeJade(state) {
    const st = this.st, T = DB.STORY.gigantes, G = GIGANTES.rayquaza;
    if ((st.items[G.item] || 0) > 0) return void this.dlg.say(T.depois);
    this.dlg.say(T.cientista, () => {
      this.dlg.ask(T.pergunta.replace("{PRECO}", G.preco), T.opcoes, (i) => {
        if (i !== 0) return void this.dlg.say(T.recusa);
        if ((st.money || 0) < G.preco) { Audio2.cancel(); return void this.dlg.say(T.semGrana); }
        st.money -= G.preco;
        st.items[G.item] = 1;
        state.comprou = true;
        Audio2.heal();
        this.game.autosave?.(true);
        this.dlg.say([T.comprou, T.dica]);
      });
    });
  }

  /** OS REGIS (src/data/regis.js): a placa de sete pontos no meio de cada
   *  câmara das RUÍNAS TANOBY. Encostar a mão acorda quem dorme ali: ele sobe
   *  da terra em 3D (src/core/gigante3d.js), acende os pontos e luta. */
  acordarRegi(id, npc) {
    const st = this.st, R = DB.REGIS?.[id], T = DB.REGIS_TEXTO;
    if (!R || this.gigante) return;
    if (st.flags.gigantes?.[id]) return void this.dlg.say(T.apagado);
    if ((R.requer || []).some((r) => !st.flags.gigantes?.[r])) return void this.dlg.say(R.trancado);
    if (!st.party.some((m) => m.hp > 0)) return void this.dlg.say([...R.placa, T.semTime]);
    this.dlg.say(R.placa, () => this.dlg.ask(T.pergunta, T.opcoes, (i) => {
      if (i !== 0) return;
      Glitch.hit(0.2);
      this.avisar(T.tremor);
      this.gigante = { id, tipo: "chao", fase: "sobe", t: 0, tempo: 0, x: npc.x, y: npc.y };
    }));
  }

  /** sobe (da terra, tremendo) → acende (os sete pontos, um bipe cada) → grito,
   *  fala e luta. (Eles têm umas três alturas do herói: cabem na tela sem a
   *  câmera subir.) */
  andarRegi(dt) {
    const g = this.gigante, TR = TEMPO_REGI;
    g.t += dt;
    g.tempo += dt;
    if (g.fase === "sobe") {
      this.tremor = Math.max(this.tremor, 0.45);
      g.ronco = (g.ronco || 0) - dt;
      if (g.ronco <= 0) { g.ronco = 0.13; Audio2.tone(50 + Math.random() * 30, 0.12, "square", 0.5); }
      if (g.t >= TR.sobe) { g.fase = "acende"; g.t = 0; g.acesos = 0; }
      return true;
    }
    if (g.fase === "acende") {
      const n = Math.min(7, Math.floor(g.t / TR.ponto));
      if (n > (g.acesos || 0)) { g.acesos = n; Audio2.tone(620 + n * 95, 0.07, "square", 0.4); }
      if (g.t < TR.acende) return true;
      g.fase = "luta";
      g.t = 0;
      tocarGrito(g.id);
      this.tremor = 0.6;
      const nome = DB.SPECIES[g.id]?.name || g.id.toUpperCase();
      this.dlg.say(DB.REGIS_TEXTO.acordou.map((l) => l.replace("{MON}", nome)), () => this.lutarComGigante());
    }
    return false;
  }

  /** A batalha é 2D, como todas: ele entra com o sprite de batalha de sempre. */
  lutarComGigante() {
    const g = this.gigante;
    g.fase = "luta";
    g.mon = createMon(g.id, GIGANTES[g.id].nivel);
    this.olhando = null;
    this.startBattle({ mon: g.mon });
  }

  /** De volta da luta: pego, ele não passa mais (e te segue, se for o primeiro
   *  da equipe); senão, sobe de volta e um dia passa de novo. */
  voltouDoGigante() {
    const g = this.gigante, st = this.st, T = g.tipo === "chao" ? DB.REGIS_TEXTO : DB.STORY.gigantes;
    this.gigante = null;
    this.panGigante = 0;                 // a câmera volta pro lugar
    this.snapCamera();
    const nome = g.mon.nickname;
    if (st.party.includes(g.mon) || st.box.includes(g.mon)) {
      (st.flags.gigantes ||= {})[g.id] = true;
      this.dlg.say(T.pego.map((l) => l.replace("{MON}", nome)));
    } else {
      this.dlg.say(T.fugiu.replace("{MON}", nome));
    }
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
    // olhando pra cima é mais fácil ver um gigante passar (src/core/gigante3d.js)
    if (this.talvezGigante(true)) return;
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

  /** FUNDIR 3 (a FUSÃO TRIPLA): CABEÇA, MEIO e PERNAS. Usa os mesmos menus da
   *  fusão de dois, com o modo "tripla" — o corpo é escolhido duas vezes. */
  escolherTripla() {
    const lista = this.st.party.filter(fundivel);
    if (lista.length < 3) {
      Audio2.cancel();
      this.menu = null;
      return void this.dlg.say(DB.STORY.fusao.poucos3);
    }
    Audio2.select();
    this.menu = { type: "fusaoCabeca", index: 0, lista, modo: "tripla" };
  }

  /** JUNTAR (ideia do CAIO): dois da MESMA espécie viram um só com o melhor
   *  dos dois — PIPLUP SHINY + PIPLUP ALFA = PIPLUP SHINY ALFA. A regra está
   *  em src/systems/juntar.js. */
  escolherJuntar() {
    const lista = comPar(this.st.party);
    if (!lista.length) {
      Audio2.cancel();
      this.menu = null;
      return void this.dlg.say(DB.STORY.fusao.juntarPoucos);
    }
    Audio2.select();
    this.menu = { type: "juntar", index: 0, lista };
  }

  confirmaJuntar(base, outro) {
    const F = DB.STORY.fusao;
    this.menu = null;
    this.dlg.ask(F.juntarConfirma.replace("{OUTRO}", outro.nickname).replace("{BASE}", base.nickname), F.juntarSim, (i) => {
      if (i !== 0) return void this.escolherJuntar();
      const ganhou = juntar(this.st, base, outro);
      if (!ganhou) return void this.dlg.say(F.naoDaParaFundir);
      Audio2.heal();
      Glitch.hit(1);
      this.game.autosave?.(true);
      this.dlg.say([F.juntando, ganhou.length
        ? F.juntou.replace("{BASE}", base.nickname).replace("{LISTA}", ganhou.join(", "))
        : F.juntouNada.replace("{BASE}", base.nickname).replace("{OUTRO}", outro.nickname)]);
    });
  }

  confirmaTripla(cabeca, meio, pernas, variante = "") {
    const F = DB.STORY.fusao;
    const sp = previsao(cabeca, meio, variante, pernas);
    if (!sp) { Audio2.cancel(); this.menu = null; return void this.dlg.say(F.naoDaParaFundir); }
    this.menu = null;
    const pergunta = F.confirmaFundir3
      .replace("{CABECA}", cabeca.nickname).replace("{CORPO}", meio.nickname)
      .replace("{PERNAS}", pernas.nickname).replace("{NOME}", sp.name);
    this.dlg.ask(pergunta, F.sim, (i) => {
      if (i !== 0) return void this.abrirDecodificador();
      this.game.scenes.push(new FusionScene(), { modo: "fundir", cabeca, corpo: meio, pernas, variante });
    });
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

  /** O LIQUIDIFICADOR DE BERRIES (src/data/pokeblocos.js): na primeira vez o
   *  estojo vem junto; depois, com berry na mochila, é a cena dele. */
  usarLiquidificador(npc, state) {
    const P = DB.POKEBLOCOS, T = P.POKEBLOCO_TEXTO, st = this.st;
    const abrir = () => {
      if (!Object.keys(P.BERRIES_SABOR).some((b) => (st.items[b] || 0) > 0)) return void this.dlg.say(T.semBerry);
      // POKÉBLOCO pro estojo, ou DOCE do ALCREMIE (src/data/doces.js)
      const D = DB.DOCES_TEXTO;
      this.dlg.ask(D.modo, D.modos, (i) => {
        if (i === 1) return void this.game.scenes.push(new LiquidificadorScene(), { modo: "doce", onDone: () => this.game.autosave?.(true) });
        if (i !== 0) return;
        if ((st.pokeblocos || []).length >= P.ESTOJO_MAX) return void this.dlg.say(T.estojoCheio);
        this.game.scenes.push(new LiquidificadorScene(), { onDone: () => this.game.autosave?.(true) });
      });
    };
    if (!st.items[P.ESTOJO]) {
      st.items[P.ESTOJO] = 1;
      Audio2.heal();
      this.game.autosave?.(true);
      return void this.dlg.say([...T.liquidificador, ...T.ganhouEstojo], abrir);
    }
    this.dlg.say(T.liquidificador, abrir);
  }

  /** Um ARBUSTO da MATA DAS FRUTAS: dá uma berry e volta a dar depois de um
   *  tempo de jogo (o do fundo da mata dá as raras). */
  colherArbusto(npc, state) {
    const A = DB.POKEBLOCOS.ARBUSTOS, T = DB.POKEBLOCOS.POKEBLOCO_TEXTO;
    if (!this.arbustoPronto(state)) return void this.dlg.say([T.arbusto, T.semFruta]);
    const lista = npc.arbusto.rara ? A.raras : A.comuns;
    const berry = lista[Math.floor(Math.random() * lista.length)];
    this.st.items[berry] = Math.min(999, (this.st.items[berry] || 0) + 1);
    state.colhidoEm = this.st.playtime || 0;
    Audio2.heal();
    this.game.autosave?.(true);
    this.dlg.say([T.arbusto, T.colheu.replace("{BERRY}", berry.toUpperCase())]);
  }
  arbustoPronto(state) {
    const A = DB.POKEBLOCOS.ARBUSTOS;
    return state?.colhidoEm == null || (this.st.playtime || 0) - state.colhidoEm >= A.cresce * 60;
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
        // o item que vem JUNTO com o pedido (o CUBO ZYGARDE da O Z DO DNA)
        const da = missao.daAoAceitar;
        let recebeu = null;
        if (da && !(st.items[da.item] > 0)) { st.items[da.item] = (st.items[da.item] || 0) + (da.qtd || 1); Audio2.heal(); recebeu = `VOCÊ RECEBEU ${da.item.toUpperCase()}!`; }
        this.game.autosave?.(true);
        // já estava cumprida antes de aceitar: entrega na hora
        if (progresso(st, missao.id).feito) return this.entregarMissao(missao);
        if (missao.viagem) return this.oferecerViagem(missao);
        // a missão com CUTSCENE na hora de aceitar (a CHUVA DE MINIORS)
        if (missao.aoAceitar && this[missao.aoAceitar]) return void this.dlg.say(T.aceitou, () => this[missao.aoAceitar]());
        this.dlg.say(recebeu ? [recebeu, ...[].concat(T.aceitou)] : T.aceitou);
      });
    });
  }

  /** A CHUVA DE MINIORS (src/data/missoes.js): o céu escurece, toca o SOM
   *  QUE O CAIO EDITOU (o shiny do LEGENDS ARCEUS, cinco vezes) e passa um
   *  meteoro em cada "plim" — é um MINIOR, e no plim ele brilha. No fim os
   *  cinco caíram espalhados pela chapada (`miniorsCairam`). */
  chuvaDeMiniors() {
    const PLIM = 1.21;                  // a distância entre os plins do som
    this.cenaMiniors = {
      t: 0, escuro: 0,
      // cada meteoro brilha no plim dele: começa a cair 0,8 s antes
      meteoros: Array.from({ length: 5 }, (_, i) => ({
        t0: 0.6 + i * PLIM, x0: 60 + Math.random() * 180, ang: 2.2 + Math.random() * 0.4, rastro: [],
      })),
      fim: 0.6 + 5 * PLIM + 1.4,
      somEm: 0.6 + 0.8,                 // o som entra junto com o primeiro brilho
    };
    Assets.mon("minior", 1);
  }

  /** LEVAR NO COLO (os MINIORS da chapada): sem batalha e sem bola — a
   *  bandeira marca que ele está com você e ele some do chão */
  levarEstatico(npc) {
    this.dlg.say(npc.lines || [], () => {
      this.st.flags[npc.levar] = true;
      Audio2.heal();
      this.game.autosave?.(true);
      const n = [1, 2, 3, 4, 5].filter((i) => this.st.flags[`miniorShiny${i}`]).length;
      this.dlg.say(`VOCÊ ESTÁ LEVANDO ${n} DE 5 MINIORS.`);
    });
  }

  /** A ENTREGA DOS MINIORS: ela fica com os 5, e você escolhe um pelo núcleo —
   *  esse vira seu Pokémon (o MINIOR SHINY, no nível dos que caíram) */
  entregarMiniors(missao) {
    const st = this.st;
    const linhas = entregar(st, missao.id);
    Audio2.heal();
    this.dlg.say(missao.entrega || [], () => {
      const nucleos = missao.nucleos || ["?"];
      this.dlg.ask(missao.escolha, nucleos.map((c) => `NÚCLEO ${c}`), (i) => {
        const cor = nucleos[i] || nucleos[0];
        const mon = createMon("minior", 38, { shiny: true });
        mon.nucleo = cor;
        if (st.party.length < 6) st.party.push(mon); else guardarNoBox(st, mon);
        st.seen.minior = st.caught.minior = true;
        this.game.autosave?.(true);
        this.dlg.say([missao.escolheu.replace("{COR}", cor), ...linhas]);
      });
    });
  }

  andarMiniors(dt) {
    const c = this.cenaMiniors;
    c.t += dt;
    c.escuro = Math.min(0.55, c.escuro + dt * 0.8);
    if (!c.tocou && c.t >= c.somEm) { c.tocou = true; Audio2.somArquivo("assets/sons/miniors-shiny.mp3", 0.9) || Audio2.shiny(); }
    if (c.t >= c.fim) {
      this.cenaMiniors = null;
      this.st.flags.miniorsCairam = true;
      this.game.autosave?.(true);
      this.dlg.say(["CINCO MINIORS SHINY CAÍRAM ESPALHADOS PELA CHAPADA!", "ASTRÔNOMA: UM EM CADA ANDAR! VAI, ANTES QUE ESFRIEM!"]);
    }
  }

  desenhaMiniors(ctx) {
    const c = this.cenaMiniors;
    ctx.fillStyle = `rgba(4,6,30,${c.escuro})`;
    ctx.fillRect(0, 0, W, H);
    const img = Assets.mon("minior", 1);
    for (const m of c.meteoros) {
      const k = (c.t - m.t0) / 1.6;                    // cruza a tela em 1,6 s
      if (k < 0 || k > 1) continue;
      const d = k * 320;
      const x = m.x0 + Math.cos(m.ang) * d, y = -20 + Math.sin(m.ang) * d;
      // o rastro de fogo
      for (let i = 1; i < 14; i++) {
        const rx = x - Math.cos(m.ang) * i * 4, ry = y - Math.sin(m.ang) * i * 4;
        ctx.fillStyle = `rgba(255,${200 - i * 10},${120 - i * 8},${(1 - i / 14) * 0.8})`;
        ctx.fillRect(Math.round(rx) - 1, Math.round(ry) - 1, 3, 3);
      }
      if (img) ctx.drawImage(reduzido(img, 20), Math.round(x) - 10, Math.round(y) - 10, 20, 20);
      // O PLIM: no meio do caminho ele brilha (o shiny)
      const plim = c.t - m.t0 - 0.8;
      if (plim >= 0 && plim < 0.5) {
        const r = 4 + plim * 30;
        ctx.globalAlpha = 1 - plim * 2;
        ctx.fillStyle = "#fff6a0";
        for (let i = 0; i < 6; i++) {
          const a = i * Math.PI / 3 + plim * 4;
          const sx = Math.round(x + Math.cos(a) * r), sy = Math.round(y + Math.sin(a) * r);
          ctx.fillRect(sx - 2, sy, 5, 1); ctx.fillRect(sx, sy - 2, 1, 5);
        }
        ctx.globalAlpha = 1;
      }
    }
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

  // ------------------------------------------------- O SUBTERRÂNEO DE KANTO
  // (src/data/subterraneo.js): a PICARETA desce, a escada e a PICARETA sobem,
  // e os BRILHOS nas paredes abrem a parede de cavar (com as ESTÁTUAS)
  noSubterraneo() { return this.st.player.map === DB.SUBTERRANEO?.MAPA; }

  /** A PICARETA: lá embaixo, sobe; ao ar livre em Kanto, pergunta se desce ou
   *  cava ali; no resto, cava ali (como sempre foi) */
  /** dá pra montar uma POKÉMÁQUINA neste tile? Chão livre (sem mato, água, porta, NPC ou o companheiro) */
  lugarDeMaquina(x, y) {
    if (this.tagAt(x, y) !== DB.TAG.FREE || this.blocked(x, y) || this.warpAt(x, y)) return false;
    if (this.compa && this.compa.x === x && this.compa.y === y) return false;
    return !(this.st.player.x === x && this.st.player.y === y);
  }

  usarPicareta() {
    const T = DB.SUBTERRANEO?.TEXTO;
    if (!T) return this.cavarAqui();
    if (this.noSubterraneo()) return this.perguntarSubir();
    const kanto = regiaoDoMapa(this.st.player.map) === "kanto" && !DB.KANTO?.[this.st.player.map]?.braglitch;
    if (!kanto || this.map.interior) return this.cavarAqui();
    this.dlg.ask(T.picareta, T.picaretaOps, (i) => {
      if (i === 0) this.descerSubterraneo();
      else if (i === 1) this.cavarAqui();
    });
  }

  /** desce na sala da cidade mais perto, guardando de onde veio */
  descerSubterraneo() {
    const S = DB.SUBTERRANEO, p = this.st.player;
    const sala = salaPraDescer(p.map);
    (this.st.subterraneo ||= {}).volta = { map: p.map, x: p.x, y: p.y, dir: p.dir };
    Audio2.noise(0.4, 0.6);
    this.tremor = 0.5;
    this.transition(() => {
      p.map = S.MAPA; p.x = sala.x; p.y = sala.y; p.dir = "down";
      this.afterTravel();
      this.dlg.say(S.TEXTO.desceu);
    });
  }

  perguntarSubir() {
    const T = DB.SUBTERRANEO.TEXTO, v = this.st.subterraneo?.volta;
    const lugar = (v && DB.MAPS[v.map]?.name) || "CIDADE DE SAFFRON";
    this.dlg.ask(T.subir.replace("{LUGAR}", lugar), T.subirOps, (i) => { if (i === 0) this.subirDoSubterraneo(); });
  }

  /** sobe de volta pro lugar de onde desceu (SAFFRON, se não lembrar) */
  subirDoSubterraneo() {
    const p = this.st.player, v = this.st.subterraneo?.volta || { map: "saffron_city", x: 20, y: 20, dir: "down" };
    Audio2.tone(440, 0.05);
    this.transition(() => {
      p.map = v.map; p.x = v.x; p.y = v.y; p.dir = v.dir || "down";
      this.afterTravel();
    });
  }

  /** os brilhos de hoje, sem os já cavados (só no SUBTERRÂNEO) */
  brilhosAqui() {
    if (!this.noSubterraneo()) return [];
    const dia = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
    if (this._brilhos?.dia !== dia) this._brilhos = { dia, lista: brilhosDoDia(this.geo, dia) };
    return this._brilhos.lista.filter((b) => !jaCavado(this.st, b.x, b.y, dia));
  }

  /** de frente pra um brilho: pergunta e abre a parede de cavar */
  cavarBrilho(b) {
    const T = DB.SUBTERRANEO.TEXTO;
    this.dlg.say(T.brilho, () => this.dlg.ask(T.cavar, T.cavarOps, (i) => {
      if (i !== 0) return;
      marcarCavado(this.st, b.x, b.y);
      this.game.scenes.push(new MineracaoScene());
    }));
  }

  /** o brilho piscando nas paredes */
  desenhaBrilhos(ctx, cx, cy) {
    const t = performance.now() / 1000;
    for (const b of this.brilhosAqui()) {
      const X = Math.round(b.x * TILE - cx), Y = Math.round(b.y * TILE - cy);
      if (X < -TILE || Y < -TILE || X > W || Y > H) continue;
      const k = (Math.sin(t * 3 + b.x * 1.7 + b.y) + 1) / 2;
      ctx.fillStyle = `rgba(255,250,200,${0.35 + k * 0.6})`;
      const sx = X + 6 + ((b.x * 3) % 5), sy = Y + 7;
      ctx.fillRect(sx, sy - 2, 1, 5); ctx.fillRect(sx - 2, sy, 5, 1);
      if (k > 0.7) { ctx.fillRect(sx - 1, sy - 1, 3, 3); ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.fillRect(sx, sy, 1, 1); }
    }
  }

  /** A PICARETA da mochila: cava onde o jogador estiver, de graça. Não dentro
   *  de casa — parede de gente não é parede de mina. */
  cavarAqui() {
    const T = DB.MINERACAO.MINA_TEXTO;
    if (this.map.interior) return void this.dlg.say(T.dentroDeCasa);
    this.dlg.say(T.cavaAqui, () => this.game.scenes.push(new MineracaoScene()));
  }

  /** O PURIFICADOR da mochila: escolhe um fóssil e ele vira o fóssil PURO
   *  (src/data/fosseis-puros.js). O purificador fica; o fóssil é trocado. */
  usarPurificador() {
    const P = DB.PURIFICADOR, M = DB.PURIFICAVEIS || {};
    const tem = Object.keys(M).filter((f) => (this.st.items[f] || 0) > 0);
    if (!tem.length) return void this.dlg.say(P.nenhum);
    this.menu = null;
    this.dlg.ask(P.pergunta, tem.map((f) => f.toUpperCase()), (i) => {
      const f = tem[i], puro = M[f];
      this.spend(f, 1);
      this.st.items[puro] = (this.st.items[puro] || 0) + 1;
      Glitch.hit?.(0.4);
      Audio2.heal();
      this.game.autosave?.(true);
      this.dlg.say([P.feito.replace("{FOSSIL}", f.toUpperCase()).replace("{PURO}", puro.toUpperCase()), P.dica]);
    });
  }

  /** A PALEONTÓLOGA de CINNABAR: troca um fóssil da mochila pelo bicho vivo.
   *  O PALEONTÓLOGO de OURO GASTLY (`fossil: "braglitch"`) é a mesma máquina,
   *  com a fala dele. */
  talkPaleontologa(npc) {
    const T = { ...DB.MINERACAO.MINA_TEXTO, ...(npc?.fossil === "braglitch" ? DB.MINERACAO.LAB_BRAG_TEXTO : {}) }, F = DB.MINERACAO.FOSSEIS, O = DB.OVO_TEXTO, P = DB.PURIFICADOR;
    const tenho = (f) => (this.st.items[f] || 0) > 0;
    // sem PURIFICADOR ainda: ela conta quem tem (o vendedor de ovos, uma vez)
    if (P && !tenho(P.item) && !this.st.flags.ganhouPurificador && !this._contouPurificador) {
      this._contouPurificador = true;
      return void this.dlg.say(P.ondeTem, () => this.talkPaleontologa(npc));
    }
    // o que dá pra ligar: um fóssil inteiro, ou as duas metades de um de Galar
    const tem = Object.keys(F).filter((f) => (F[f].precisa || [f]).every(tenho));
    if (!tem.length) {
      // só uma metade na mochila: ela explica o que falta
      const metade = Object.values(F).some((r) => r.precisa?.some(tenho));
      return void this.dlg.say(metade ? T.labMetade : T.labOferta);
    }
    if (this.st.party.length >= 6 && boxCheio(this.st)) return void this.dlg.say(T.labSemVaga);
    // duas METADES PURAS na mochila: ela avisa que não cola (e revive uma por vez)
    const metadesPuras = tem.filter((f) => f.includes(" de ") && f.endsWith(" puro"));
    const aviso = metadesPuras.length >= 2 && !this._avisouPuras ? P?.labDuasPuras : null;
    if (aviso) { this._avisouPuras = true; return void this.dlg.say(aviso, () => this.talkPaleontologa(npc)); }
    this._avisouPuras = false;
    this.dlg.ask(T.labTem, tem.map((f) => f.toUpperCase()), (i) => {
      const item = tem[i], { especie, nivel, precisa } = F[item];
      for (const gasto of precisa || [item]) this.spend(gasto, 1);
      const mon = createMon(especie, nivel);
      // o fóssil PURO tem fala própria: a forma pura, ou a metade que virou bicho inteiro
      const fala = !item.endsWith(" puro") ? null : item.includes(" de ") ? P.labMetadePura : P.labPuro;
      const msgs = (fala || (precisa ? T.labColado : T.labFeito)).map((l) => l.replace("{MON}", mon.nickname).replace("{NIVEL}", nivel));
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
    this.game.autosave?.(true);
    this.chocarNaTela(mon, msgs);
  }

  /** A CUTSCENE DO OVO (src/scenes/nascer.js): o ovo explode em pixels e eles
   *  montam o bicho; as frases vêm no fim dela. O brilho de shiny e luminoso
   *  também é dela — na hora em que ele fica pronto. */
  chocarNaTela(mon, msgs) {
    this.game.scenes.push(new NascerScene(), { mon, frase: msgs, aoFim: () => this.game.music(this.map.music) });
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
      // quem tem `flagCaptura` (o PIKACHU SHINY) some quando ELE foi pego —
      // ter outro Pikachu comum na Pokédex não pode esconder o da missão
      .filter((e) => e.mapa === aqui && DB.SPECIES[e.id] && !(e.flagCaptura ? this.st.flags[e.flagCaptura] : this.st.caught[e.id]))
      // quem tem missão só está lá depois que alguém te contou onde procurar
      .filter((e) => !e.missao || this.st.missoes?.[e.missao])
      // `aparece`: só depois dessa bandeira (os MINIORS, depois de caírem)
      .filter((e) => !e.aparece || this.st.flags[e.aparece])
      .filter((e) => !this.st.npcState[`${aqui}.estatico_${e.chave || e.id}`]?.defeated)
      .map((e) => ({
        id: `estatico_${e.chave || e.id}`, x: e.x, y: e.y, dir: "down", sprite: `mon:${e.id}${e.shiny ? ":shiny" : ""}`,
        brilha: !!e.shiny,
        boss: { id: e.id, lvl: e.nivel || 60, corrupt: !!e.corrupt, alfa: !!e.alfa, soQuadros: e.soQuadros || null, flag: e.flag || null,
                shiny: !!e.shiny, flagCaptura: e.flagCaptura || null },
        levar: e.levar ? e.flagCaptura : null,
        lines: e.lines || [],
      }));
  }

  /** A CAÇADA DO ZYGARDE (src/data/extra.js, ZYGARDE_CACADA): a forma em que
   *  ele está agora, no lugar dela. Encostar faz as células se juntarem
   *  (`falarZygarde` → `andarZygarde`); o COMPLETO, no fim, é um chefe. */
  zygardeNpcs() {
    const st = this.st, Z = DB.ZYGARDE_CACADA;
    if (!Z || this.zygCena || !st.missoes?.[Z.missao] || st.caught?.zygardecompleto) return [];
    if ((st.celulasZygarde || 0) < (Z.precisa || 200)) return [];      // primeiro as 200 CÉLULAS no cubo
    const e = st.flags.zygEtapa || 0, p = Z.etapas[e];
    if (!p || p.mapa !== st.player.map) return [];
    if (!p.vira) {
      if (st.npcState[`${p.mapa}.zygarde_completo`]?.defeated) return [];
      return [{ id: "zygarde_completo", x: p.x, y: p.y, dir: "down", sprite: `mon:${p.forma}`,
                boss: { id: "zygardecompleto", lvl: Z.nivel }, lines: p.lines }];
    }
    return [{ id: `zygarde_${e}`, x: p.x, y: p.y, dir: "down", sprite: `mon:${p.forma}`, zygarde: e }];
  }

  falarZygarde(npc) {
    const p = DB.ZYGARDE_CACADA.etapas[npc.zygarde];
    this.dlg.say(p.lines, () => {
      Glitch.hit(0.2);
      this.zygCena = { e: npc.zygarde, x: npc.x, y: npc.y, t: 0, de: p.forma, para: p.vira };
    });
  }

  /** AS CÉLULAS SE JUNTANDO: chegam de todo lado rodando (o enxame), a forma
   *  de agora (ou o NÚCLEO, quando eram só células) fica branca, e a forma
   *  nova cresce de dentro do clarão. Depois a fala, e ele FOGE (sai
   *  correndo da tela) pra próxima etapa. Devolve true enquanto o controle
   *  é dele. */
  andarZygarde(dt) {
    const c = this.zygCena, Z = DB.ZYGARDE_CACADA, p = Z.etapas[c.e], T = TEMPO_ZYG;
    c.t += dt;
    if (c.foge !== undefined) {
      c.foge += dt;
      if (c.foge < T.foge) return true;
      this.st.flags.zygEtapa = c.e + 1;
      this.zygCena = null;
      this.game.autosave?.(true);
      return false;
    }
    if (c.t < T.fim) {
      // um bipe por célula chegando, cada vez mais agudo
      c.bipe = (c.bipe || 0) - dt;
      if (c.t < T.junta && c.bipe <= 0) { c.bipe = 0.09; Audio2.tone(300 + c.t * 260, 0.05, "square", 0.25); }
      if (c.t >= T.junta + T.nucleo && !c.clarao) { c.clarao = true; this.clarao = 0.6; Glitch.hit(0.4); }
      return true;
    }
    if (c.falou) return false;
    c.falou = true;
    tocarGrito(c.para);
    this.tremor = 0.5;
    this.dlg.say(p.virou, () => {
      if (p.fugiu) {
        this.dlg.say(p.fugiu, () => { c.foge = 0; Audio2.tone(900, 0.08, "square", 0.3); });
        return;
      }
      // (toda forma que muda foge: quem luta é o COMPLETO parado, a última
      // etapa — `zygardeNpcs`)
      this.st.flags.zygEtapa = c.e + 1;
      this.zygCena = null;
    });
    return false;
  }

  /** Quanto a câmera sobe pra caber a cabeça de um 3D ALTO (src/core/gigante3d.js)
   *  que está logo acima de você: o REGI acordando, o lendário em pé, o
   *  ZYGARDE mudando de forma. Com a câmera no lugar de sempre, você fica no
   *  meio da tela, e um bicho de quatro heróis um tile acima passava do topo. */
  panAlvo() {
    if (this._iso) return 0;
    const p = this.st.player;
    // `pe`: onde ficam os pés dele na tela com a câmera parada, com ele 0
    // tiles acima de você (o REGI fica 2 pixels mais pra cima, atrás da placa)
    const precisa = (id, x, y, pe = H / 2 + 7) => {
      const dy = p.y - y;
      if (Math.abs(p.x - x) > 5 || dy < 0 || dy > 5) return 0;
      return Math.max(0, altura3D(id) + 6 - (pe - dy * TILE));
    };
    let pan = 0;
    const g = this.gigante;
    if (g?.tipo === "chao") pan = precisa(g.id, g.x, g.y, H / 2 - 10);
    const c = this.zygCena;
    if (c) pan = Math.max(pan, precisa(c.para, c.x, c.y), precisa(c.de, c.x, c.y));
    for (const n of this.npcsHere()) {
      if (!n.sprite?.startsWith("mon:")) continue;
      const [esp, cor] = n.sprite.slice(4).split(":");
      if (!cor && tem3D(esp)) pan = Math.max(pan, precisa(esp, n.x, n.y));
    }
    return Math.min(72, pan);
  }

  /** O RASTRO DAS CÉLULAS: os tiles do caminho a pé da etapa de agora
   *  (src/data/extra.js, `rastro`) que passam por este mapa. Fica enquanto ele
   *  não é achado; calculado uma vez por mapa e etapa. */
  rastroZygarde() {
    const st = this.st, Z = DB.ZYGARDE_CACADA, g = this.geo;
    if (!Z || !g || st.missoes?.[Z.missao]?.estado !== "ativa" || st.caught?.zygardecompleto || this.zygCena) return null;
    if ((st.celulasZygarde || 0) < (Z.precisa || 200)) return null;    // (o rastro também só depois das 200)
    const e = st.flags.zygEtapa || 0, aqui = st.player.map, chave = `${aqui}:${e}`;
    if (this._rastroZyg?.chave === chave) return this._rastroZyg.tiles;
    const tiles = [];
    for (const [mapa, de, ate] of Z.etapas[e]?.rastro || []) if (mapa === aqui) tiles.push(...caminhoNoMapa(g, ate, de));
    this._rastroZyg = { chave, tiles };
    return tiles;
  }

  /** As células do rastro: uma a cada dois tiles, um pouco fora do centro, e o
   *  brilho correndo por elas na direção do ZYGARDE */
  drawRastroZygarde(ctx, cx, cy) {
    const tiles = this.rastroZygarde();
    if (!tiles?.length) return;
    const t = performance.now() / 1000;
    tiles.forEach(([x, y], k) => {
      if (k % 2) return;
      const px = x * TILE + 8 + ((x * 7 + y * 13) % 5) - 2 - cx, py = y * TILE + 10 + ((x * 11 + y * 5) % 5) - 2 - cy;
      if (px < -4 || py < -4 || px > W + 4 || py > H + 4) return;
      ctx.fillStyle = "#4f7f1f";
      ctx.fillRect(px - 2, py - 1, 4, 3);
      ctx.fillRect(px - 1, py - 2, 2, 5);
      ctx.fillStyle = Math.sin(t * 4 - k * 0.5) > 0.6 ? "#f4ffd8" : "#afcf4f";
      ctx.fillRect(px - 1, py - 1, 2, 2);
    });
  }

  /** O desenho da cena das formas do ZYGARDE (ver `andarZygarde`) */
  drawZygCena(ctx, cx, cy) {
    const c = this.zygCena, T = TEMPO_ZYG, t = c.t, agora = performance.now() / 1000;
    let x = c.x * TILE + 8 - cx;
    const y = c.y * TILE + 15 - cy;
    const suave = (k) => { k = Math.max(0, Math.min(1, k)); return k * k * (3 - 2 * k); };
    if (t < T.junta + T.nucleo) {
      // a forma de agora (as células soltas não têm forma: o núcleo nasce delas)
      if (c.de !== "zygardeenxame") desenharParado(ctx, c.de, x, y, agora, { branco: suave((t - T.junta) / T.nucleo) });
      else if (t >= T.junta) desenharParado(ctx, "zygardenucleo", x, y, agora, { branco: suave((t - T.junta) / T.nucleo) * 0.8 });
      if (t < T.junta) desenharParado(ctx, "zygardeenxame", x, y, agora, { est: { junta: suave(t / T.junta) }, sombra: false });
      return;
    }
    const k = suave((t - T.junta - T.nucleo) / T.cresce);
    if (c.foge !== undefined) {
      // FUGINDO: corre pro lado e some
      const f = c.foge / T.foge;
      x += f * f * 200;
    }
    desenharParado(ctx, c.para, x, y, agora, { cresce: 0.3 + 0.7 * k, branco: 1 - k });
  }

  /** Saiu do mapa e voltou: quem foi derrubado sem ser capturado está de pé no
   *  mesmo lugar de novo. */
  reporEstaticos() {
    // o ZYGARDE COMPLETO derrubado sem ser capturado também espera de novo
    const fim = DB.ZYGARDE_CACADA?.etapas.at(-1);
    if (fim && fim.mapa !== this.st.player.map) delete this.st.npcState[`${fim.mapa}.zygarde_completo`];
    for (const e of DB.ESTATICOS || []) {
      if (e.mapa === this.st.player.map) continue;      // só repõe os dos OUTROS mapas
      delete this.st.npcState[`${e.mapa}.estatico_${e.chave || e.id}`];
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
    if (missao.aoEntregar && this[missao.aoEntregar]) return this[missao.aoEntregar](missao);
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
    const vs = variantes(p.cabeca, p.corpo, p.pernas);
    if (vs.length < 2) {
      Audio2.cancel();
      this.menu = null;
      return void this.dlg.say(F.semOutraVersao);
    }
    Audio2.select();
    this.menu = { type: "fusaoVersao", index: 0, mon, lista: vs };
  }

  /** INVERTER: troca a cabeça e o corpo da fusão, sem passar pelo Centro */
  inverter(mon) {
    const F = DB.STORY.fusao;
    this.menu = null;
    if (partes(mon.species)?.pernas) { Audio2.cancel(); return void this.dlg.say(F.inverterTripla); }
    const antes = mon.nickname;
    const sp = inverterFusao(mon);
    if (!sp) { Audio2.cancel(); return void this.dlg.say(F.naoDaParaFundir); }
    Audio2.heal();
    Glitch.hit(0.8);
    this.game.autosave?.(true);
    this.dlg.say(F.inverteu.replace("{MON}", antes).replace("{NOME}", sp.name));
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

  /** A ENFERMEIRA separa: escolhe qual fusão da equipe, e a máquina do Centro desgruda */
  separarComJoy() {
    const lista = (this.st.party || []).filter((m) => ehFusao(m));
    if (!lista.length) return void this.dlg.say("ENFERMEIRA: NÃO TEM NENHUMA FUSÃO NA SUA EQUIPE.");
    const F = DB.STORY.fusao;
    const escolhe = (mon) => this.dlg.ask(`ENFERMEIRA: SEPARAR ${mon.nickname}? OS DOIS VOLTAM DO JEITO QUE ERAM.`, ["SEPARAR", "NÃO"], (i) => {
      if (i !== 0) return void this.dlg.say(DB.STORY.joy.tchau);
      this.dlg.say(["ENFERMEIRA: VOU COLOCAR NA MÁQUINA DO CENTRO...", "PLIM PLIM PLIM!"], () =>
        this.game.scenes.push(new FusionScene(), { modo: "separar", mon }));
    });
    if (lista.length === 1) return escolhe(lista[0]);
    this.dlg.ask("ENFERMEIRA: QUAL FUSÃO EU SEPARO?", [...lista.map((m) => m.nickname), "NENHUMA"], (i) => { if (lista[i]) escolhe(lista[i]); else this.dlg.say(DB.STORY.joy.tchau); });
  }

  confirmaSeparacao(mon) {
    const F = DB.STORY.fusao;
    this.menu = null;
    // SÓ NO CENTRO POKÉMON (pedido do CAIO): separar precisa da máquina de lá
    // (o mapa de um Centro, ou qualquer lugar com a ENFERMEIRA que cura)
    return void this.dlg.say(["O DECODIFICADOR NÃO SEPARA FUSÃO.", "QUEM SEPARA É A ENFERMEIRA DO CENTRO POKÉMON: A MÁQUINA DE LÁ É A ÚNICA FORTE O BASTANTE PRA DESGRUDAR UMA FUSÃO."], () => this.abrirDecodificador());
    this.dlg.ask(F.confirmaSeparar.replace("{MON}", mon.nickname), F.simSeparar, (i) => {
      if (i !== 0) return void this.abrirDecodificador();
      this.game.scenes.push(new FusionScene(), { modo: "separar", mon });
    });
  }

  /** o botão gigante da máquina do laboratório */
  useMachine() {
    const st = this.st;
    if (st.flags.glitchWorld) return void this.dlg.say(DB.STORY.dimension.machineOff);
    // um DLC pode trancar a fenda (`DB.FENDA_TRANCADA(st)` devolve a fala):
    // a GLITCH DIMENSION EXTREMA só abre pelo GLITNEXY
    const tranca = DB.FENDA_TRANCADA?.(st);
    if (tranca) return void this.dlg.say(tranca);
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
    if (st.flags.starterChosen && !st.flags.decodificador) return this.darDecodificador(npc, state);
    // A ENCOMENDA DE VIRIDIAN: trouxe, ganha a POKÉDEX e as 5 POKÉ BOLAS
    if (st.flags.starterChosen && !temPokedex(st)) {
      const E = DB.POKEDEX_TEXTO.encomenda;
      if (!(st.items?.[E.item] > 0)) return void this.dlg.say(E.oakSem);
      return void this.dlg.say(E.oakRecebe, () => {
        delete st.items[E.item];
        this.darPokedex(() => this.talkOak(npc, state));
      });
    }

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
    st.flags.pedrasIniciais = [...(Array.isArray(st.flags.pedrasIniciais) ? st.flags.pedrasIniciais : []), ...pedras];
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
    // MODO FUSÃO: a bola já mostra a FUSÃO e quem está junto nela
    const nomeBola = this.nomeDoInicial(npc.starter);
    // "OUTRA REGIÃO" abre as nove. As três bolas continuam sendo as de Kanto e
    // continuam funcionando com um SIM — quem quer o CHARMANDER de sempre não
    // atravessa menu nenhum, e quem quer um FUECOCO acha o caminho na primeira
    // pergunta em vez de descobrir que não dá.
    // MODO FUSÃO: SORTEAR DE NOVO (pedido do CAIO, nov/2026: "faz ter como
    // redefinir as fusões com os iniciais na mesa") — esquece os pares de todas
    // as bolas (e das outras regiões), sorteia outros e mostra esta bola de novo
    const ops = nomeBola ? ["SIM", "SORTEAR DE NOVO", "OUTRA REGIÃO", "NÃO"] : ["SIM", "OUTRA REGIÃO", "NÃO"];
    this.dlg.ask(`ESTA POKÉ BOLA CONTÉM ${nomeBola || sp.name}. LEVAR?`, ops, (i) => {
      const op = ops[i];
      if (op === "SORTEAR DE NOVO") {
        this.st.flags.paresIniciais = {};
        Audio2.select();
        return this.dlg.say("AS POKÉ BOLAS DA MESA BRILHARAM... AS FUSÕES MUDARAM!", () => this.pickStarter(npc, state));
      }
      if (op === "OUTRA REGIÃO") return this.escolherRegiao(state);
      if (op !== "SIM") return;
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
      const nomes = r.mons.map((id) => this.nomeDoInicial(id, true) || DB.SPECIES[id]?.name || id);
      this.dlg.ask(`OS TRÊS DE ${r.nome}:`, [...nomes, "VOLTAR"], (j) => {
        const id = r.mons[j];
        if (!id) return this.escolherRegiao(state);
        this.entregarInicial(id, state);
      });
    });
  }

  /** MODO FUSÃO: com quem este inicial vai se fundir (sorteado uma vez e
   *  guardado, pra a bola mostrar a fusão ANTES de você escolher) — { cab, cor } */
  parDoInicial(id) {
    if (!this.st.flags?.modoFusao || !DB.SPECIES[id]) return null;
    const pares = (this.st.flags.paresIniciais ||= {});
    // o par sorteado antes da regra do estágio 0 (o BELLIBOLT): sorteia de novo
    const velho = pares[id] && (pares[id].cab === id ? pares[id].cor : pares[id].cab);
    if (velho && !ehBasico(velho)) delete pares[id];
    if (!pares[id]) {
      const outro = especieSurpresa(id, true);     // só estágio 0
      if (!outro) return null;
      pares[id] = Math.random() < 0.5 ? { cab: id, cor: outro } : { cab: outro, cor: id };
    }
    const p = pares[id];
    return garantirEspecie(idFusao(p.cab, p.cor)) ? p : null;
  }
  /** "CHARMATHE (CHARMANDER + GROWLITHE)" — ou só o nome, `curto` */
  nomeDoInicial(id, curto = false) {
    const p = this.parDoInicial(id);
    if (!p) return null;
    const nome = DB.SPECIES[idFusao(p.cab, p.cor)]?.name || "?";
    return curto ? nome : `${nome} (${DB.SPECIES[p.cab]?.name} + ${DB.SPECIES[p.cor]?.name})`;
  }

  /** Entrega o inicial escolhido, venha ele de qual bola ou de qual região vier. */
  entregarInicial(id, state) {
    let mon = this.game.giveStarter(id);
    // MODO FUSÃO: o inicial se funde com um Pokémon SURPRESA na hora
    let fusaoMsg = null;
    if (this.st.flags?.modoFusao) {
      const par = this.parDoInicial(id);
      const outro = par ? (par.cab === id ? par.cor : par.cab) : null;
      const f = par ? fundir(...(par.cab === id ? [mon, createMon(outro, mon.level)] : [createMon(outro, mon.level), mon])) || mon : fundirCom(mon, especieSurpresa(id, true));
      if (f !== mon) {
        const i = this.st.party.indexOf(mon);
        if (i >= 0) this.st.party[i] = f;
        this.st.seen[f.species] = true; this.st.caught[f.species] = true;
        // o nome da fusão e quem está junto nela (pedido do CAIO)
        const pt = partes(f.species), nm = (x) => DB.SPECIES[x]?.name || String(x).toUpperCase();
        const juntos = pt ? [pt.cabeca, pt.corpo, pt.pernas].filter(Boolean).map(nm).join(" + ") : "";
        fusaoMsg = [`MAS... A BOLA BRILHOU! O ${nm(id)} SE FUNDIU COM UM POKÉMON SURPRESA!`,
                    `ELE VIROU ${f.nickname}${juntos ? ` (${juntos})` : ""}!`];
        mon = f;
      }
    }
    state.hidden = true;
    this.st.flags.starterChosen = true;
    this.st.flags.meuInicial = id;             // o AZUL escolhe a partir disto
    // e junto vem o MEIO do SÍMBOLO DA LIGA DE BRAGLITCH, com a cena do encaixe (src/scenes/encaixe.js)
    if (this.map.labBraglitch || this.st.regiao === "braglitch") this.st.flags.encaixePendente = "meio";   // (só no save de Braglitch)
    Audio2.heal();
    // no laboratório da PROFA. IPÊ a conversa é outra: a Pokédex sai da mão
    // dela, e em vez do "siga pela ROTA 1" vem o APAGÃO
    if (this.map.labBraglitch) {
      return void this.dlg.say([`VOCÊ RECEBEU ${mon.nickname}!`, ...(fusaoMsg || [])], () =>
        (temPokedex(this.st) ? this.darMissaoIpe() : this.darPokedexIpe(() => this.darMissaoIpe())));
    }
    // o inicial, depois a POKÉDEX, depois o DECODIFICADOR — e só então o
    // "siga pela ROTA 1", que é o fim da conversa
    const fim = () => this.dlg.say(DB.POKEDEX_TEXTO?.fim || []);
    const decodificador = () => (this.st.flags.decodificador ? fim() : this.darDecodificador(null, state, fim));
    this.dlg.say([`VOCÊ RECEBEU ${mon.nickname}!`, ...(fusaoMsg || [])], () =>
      { if (!temPokedex(this.st)) this.st.flags.precisaEncomenda = true; decodificador(); });   // a POKÉDEX vem depois: com a ENCOMENDA de VIRIDIAN (src/data/pokedex.js)
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
      if (d.mostrar && !d.mostrar(this.st)) continue;      // a da LUMIOSE espera o rank
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
    const D = DB.DESCONTROLADAS, d = npc.descontrolada, T = { ...D.textos, ...(d.textos || {}) };
    const nome = DB.SPECIES[d.to].name;
    const f = (t) => t.replace("{MON}", nome);
    if (!this.st.party.some((m) => m.hp > 0)) return void this.dlg.say(T.aparece.map(f));
    Audio2.tone(98, 0.5, "sawtooth", 0.35);
    this.dlg.say(T.aparece.map(f), () => this.dlg.ask(f(T.pergunta), T.opcoes, (i) => {
      if (i !== 0) return void this.dlg.say(T.saiu);
      const N = D.nivel;
      const insignias = (this.st.badges || []).length + (this.st.bragBadges || []).length;
      const lvl = d.nivel || Math.min(N.max, N.base + N.porInsignia * insignias);
      const foe = createMon(d.to, lvl);
      const pedra = (DB.MEGAS?.[d.id] || []).find((r) => r.to === d.to)?.pedra || null;
      const b = {
        foe, boss: true, npcKey: `${this.st.player.map}.${npc.id}`,
        descontrolada: { pedra, base: DB.SPECIES[d.id]?.name || d.id, hpVezes: d.hpVezes, furia: d.furia, textos: d.textos },
      };
      this.entrarEmBatalha("chefe", b, () => this.game.scenes.push(new BattleScene(), b));
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
    const args = {
      tamanho: 2, npcKey: `${L.mapa}.campeoes`,
      trainer: { name: a.nome, sprite: a.sprite, party: time(a.time), prize: L.premio, dupla: true,
                 nomeDupla: L.nomeDupla, ligaBrag: true, falaMega: L.falaMega },
      trainer2: { name: b.nome, sprite: b.sprite, party: time(b.time) },
      aliado: g ? { name: nome, sprite: DB.GEMEO.sprite[nome], party: time(g.time) } : null,
    };
    this.entrarEmBatalha("chefe", args, () => this.game.scenes.push(new GrupoBattleScene(), args));
  }

  /** O BONDINHO (src/data/braglitch.js): a estação pergunta, e o SIM começa a
   *  viagem — a cabine atravessa o mar numa tela desenhada (`drawBondinho`) e
   *  desce na estação da outra ponta. */
  /** A TOCA DO COELHO (ideia do CAIO): a da BR-101 leva pra DIMENSÃO LITERARTE
   *  (src/data/braglitch-literarte.js) e a de lá traz de volta. Pergunta,
   *  assobia caindo e aparece do outro lado. */
  pularNaToca(mapa, x, y) {
    if (!DB.MAPS[mapa]) return;
    const indo = mapa === "literarte";
    this.dlg.ask(indo ? "UMA TOCA DE COELHO FUNDA... LÁ DE BAIXO VEM UM TIC-TAC. PULAR?" : "A TOCA DE VOLTA PRA BR-101. PULAR?",
      ["PULAR", "NÃO"], (i) => {
        if (i !== 0) return;
        for (let k = 0; k < 6; k++) Audio2.tone(1200 - k * 150, 0.09, "triangle", 0.3);   // o assobio da queda
        const st = this.st;
        Object.assign(st.player, { map: mapa, x, y, dir: "down" });
        st.surfando = null;
        this.compa = null;
        this.selvagens = [];
        this.justWarped = true;
        this.afterTravel();
        this.game.autosave?.(true);
        this.dlg.say(indo ? ["VOCÊ CAIU... E CAIU... E CAIU...", "...E CHEGOU NA DIMENSÃO LITERARTE!"] : ["VOCÊ SUBIU PELA TOCA E SAIU NA BR-101."]);
      });
  }

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
      this.dlg.say([P.ganhou, ...P.bolas], () => {
        this.st.items["poké bola"] = (this.st.items["poké bola"] || 0) + 5;
        Audio2.heal();
        this.game.autosave?.(true);
        this.dlg.say(P.explica, () => depois?.());
      });
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

  // o ROTOMFONE sai voando da sua frente e vira o menu (drawMenu)
  openMenu() { Audio2.select(); this.menu = { type: "main", index: 0, abre: performance.now() }; Audio2.tone(900, 0.05, "triangle", 0.12); }

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
    const base = ["POKÉMON", "BOX", "MOCHILA", "INSÍGNIAS", "ROUPAS", "METAS", "CONTATOS", "CÂMERA", "TRABALHOS"];
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
    // O FUNDO DO MAR: surfando, dá pra MERGULHAR (em qualquer água); lá embaixo, SUBIR
    if (this.map?.submerso) base.push("SUBIR");
    else if (this.st.surfando && DB.KANTO[fundoDe(this.st.player.map)]) base.push("MERGULHAR");
    if (this.map?.submerso) { /* lá embaixo não se voa */ }
    else if (this.st.voando) base.push("POUSAR");
    else if (euSei(this.st, "voar") && !this.st.capturado?.naBola) base.push("LEVANTAR VOO");
    else if (this.quemSabe("voar")) base.push("VOAR", "VOAR LIVRE");   // VOAR LIVRE: montado nele
    else if (this.quemMonta().length) base.push("VOAR LIVRE");          // o GYARADOS voa sem saber VOAR
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
      .filter((x) => !x.requer || [].concat(x.requer).some((f) => this.st.flags?.[f]))
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
    this.st.voando = false; this.st.montaria = null; this.st.surfando = null;
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

  /** A MONTARIA VOADORA: quem da equipe sabe VOAR te leva nas costas, por cima
   *  de tudo, até você POUSAR (o mesmo voo do pokésave de VOADOR). Os que têm
   *  modelo (src/core/gigante3d.js, MONTARIAS_3D) voam em 3D. */
  /** Quem pode te levar voando: quem sabe VOAR e quem voa sem o golpe (o
   *  GYARADOS, src/core/gigante3d.js `voaSemGolpe`). Em Braglitch só a montaria. */
  quemMonta() {
    const lista = [];
    const sabe = this.quemSabe("voar");
    if (sabe) lista.push(sabe);
    if (this.geo?.braglitch) return lista;
    for (const m of this.st.party) {
      if (m.hp <= 0 || lista.includes(m)) continue;
      if (m.moves.some((mv) => mv.id === "voar") || voaSemGolpe(m.species)) lista.push(m);
    }
    return lista;
  }

  montar() {
    const lista = this.quemMonta();
    if (!lista.length) return void this.dlg.say(this.campo("voar").semNinguem);
    if (this.map.interior) return void this.dlg.say("AQUI DENTRO NÃO DÁ PRA LEVANTAR VOO.");
    if (this.st.surfando) return void this.dlg.say("SAIA DA ÁGUA PRIMEIRO.");
    if (lista.length === 1) return this.subirNa(lista[0]);
    // mais de um: você escolhe quem te leva
    const op = lista.slice(0, 5);
    this.dlg.ask("QUEM TE LEVA?", [...op.map((m) => m.nickname), "CANCELAR"], (i) => { if (i < op.length) this.subirNa(op[i]); });
  }

  subirNa(mon) {
    this.dlg.say(`VOCÊ SUBIU NAS COSTAS DO ${mon.nickname}! (PRA DESCER: MENU, POUSAR)`, () => {
      this.st.voando = true;
      this.st.montaria = mon.species;
      this.giroMontaria = null;
      Audio2.tone(523, 0.06); Audio2.tone(784, 0.08); Audio2.tone(1047, 0.12);
      this.selvagens = [];
      this.game.autosave?.();
    });
  }

  /** ...e desce. Só em chão em que dá pra ficar de pé — ou na água, se você
   *  também nada (aí pousa nadando). Em cima de árvore, casa ou gente, não. */
  pousar() {
    const p = this.st.player;
    const t = this.tagAt(p.x, p.y);
    const ocupado = this.npcAt(p.x, p.y) || this.obstaculoEm(p.x, p.y) || this.warpAt(p.x, p.y);
    if (t === DB.TAG.WATER && !ocupado && this.quemSabe("surfar")) {
      this.st.voando = false; this.st.montaria = null;
      this.st.surfando = this.quemSabe("surfar").species;
    } else if ((t === DB.TAG.FREE || t === DB.TAG.GRASS) && !ocupado) {
      this.st.voando = false; this.st.montaria = null;
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
    const T = DB.SEGURAR_TEXTO;
    this.dlg.ask(`O QUE FAZER COM ${mon.nickname}?`, ["TRUNFO", T.opcao, "SOLTAR", "NADA"], (k) => {
      if (k === 0) return this.escolherTrunfo(mon);
      if (k === 1) return this.itemDaEquipe(mon);
      if (k === 2) return this.pedirSoltar(this.st.party, i);
    });
  }

  /** O ITEM SEGURADO (src/data/segurar.js): mostra e deixa tirar */
  itemDaEquipe(mon) {
    const T = DB.SEGURAR_TEXTO;
    if (!mon.item) return void this.dlg.say(T.nada.replace("{MON}", mon.nickname));
    const desc = descDoItem(mon.item);
    const fala = T.segura.replace("{MON}", mon.nickname).replace("{ITEM}", mon.item.toUpperCase());
    this.dlg.say(desc ? [fala, desc] : fala, () => this.dlg.ask(fala, T.tirarOpcoes, (k) => {
      if (k !== 0) return;
      const it = tirarItem(this.st, mon);
      this.game.autosave?.(true);
      const fala = T.tirou.replace("{ITEM}", it.toUpperCase());
      this.dlg.say(it === PEDRA_ASSOMBRADA ? [fala, T.assombrou] : fala);
    }));
  }

  /** DAR PRA SEGURAR, pela mochila: quem já segurava devolve o dele */
  darPraSegurar(item, mon) {
    this.menu = null;
    const T = DB.SEGURAR_TEXTO;
    const velho = darItem(this.st, mon, item);
    Audio2.select();
    this.game.autosave?.(true);
    const f = (t) => t.replace("{MON}", mon.nickname).replace("{ITEM}", item.toUpperCase()).replace("{VELHO}", (velho || "").toUpperCase());
    const desc = descDoItem(item);
    // EVOLUI SEGURANDO (a regra com `segurando`, ex.: o MONSTELITO): o item na
    // mão já conta — e a PEDRA DO TROVÃO na mão de um fantasma já é a assombrada
    const regra = (DB.EVOLUTIONS?.[mon.species] || []).find((r) => r.segurando && DB.SPECIES[r.to]
      && (r.item === item || r.item === devolvido(mon, item)));
    if (regra) {
      const assombrou = regra.item !== item;
      return void this.dlg.say([f(velho ? T.trocou : T.deu),
        ...(assombrou ? [`NA MÃO DE ${mon.nickname}, A ${item.toUpperCase()} FICOU ASSOMBRADA!`] : []),
        `...${mon.nickname} ESTÁ REAGINDO À PEDRA!`], () => {
        delete mon.item;                            // a pedra é gasta na evolução
        this.game.autosave?.(true);
        this.game.scenes.push(new EvolutionScene(), { mon, to: regra.to, semParar: true });
      });
    }
    this.dlg.say([f(velho ? T.trocou : T.deu), ...(desc ? [desc] : [])]);
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

  // ------------------------------------------------- A SALA TECNOLÓGICA DA LIGA
  /** O chão da etapa `i` (os 13x13 tiles da sala): o do FireRed, ou pintado a
   *  partir dele (`chao.filtro`, o LANCE e o CAMPEÃO). null enquanto carrega. */
  chaoDaLiga(i) {
    const c = LIGA_ETAPAS[i]?.chao;
    if (!c) return null;
    const base = mapArt(c.de);
    if (!base) return null;
    if (!c.filtro) return base;
    const cache = (this._chaoLiga ||= {});
    if (cache[i]) return cache[i];
    const cv = document.createElement("canvas");
    cv.width = base.width; cv.height = base.height;
    const g = cv.getContext("2d");
    g.drawImage(base, 0, 0);
    // só o CHÃO (fileiras 3 a 10) muda de cor; a parede e as portas ficam
    g.filter = c.filtro;
    g.drawImage(base, 0, 3 * TILE, base.width, 8 * TILE, 0, 3 * TILE, base.width, 8 * TILE);
    g.filter = "none";
    cache[i] = cv;
    return cv;
  }

  /** O vazio da sala (escuro, com a grade de luz da máquina da Liga).
   *  `inteira`: a sala toda (13x13, paredes e teto também), senão só o chão */
  vazioDaLiga(ctx, cx, cy, t, inteira = false) {
    const y0 = inteira ? 0 : 3, y1 = inteira ? 13 : 11;
    ctx.fillStyle = "#04060c";
    ctx.fillRect(-cx, y0 * TILE - cy, 13 * TILE, (y1 - y0) * TILE);
    ctx.strokeStyle = `rgba(80,220,255,${0.25 + 0.15 * Math.sin(t * 9)})`;
    ctx.lineWidth = 1;
    for (let gx = 0; gx <= 13; gx++) { ctx.beginPath(); ctx.moveTo(gx * TILE - cx + 0.5, y0 * TILE - cy); ctx.lineTo(gx * TILE - cx + 0.5, y1 * TILE - cy); ctx.stroke(); }
    for (let gy = y0; gy <= y1; gy++) { ctx.beginPath(); ctx.moveTo(-cx, gy * TILE - cy + 0.5); ctx.lineTo(13 * TILE - cx, gy * TILE - cy + 0.5); ctx.stroke(); }
    if (inteira) {        // a borda da sala, acesa (é um holograma)
      ctx.strokeStyle = `rgba(140,240,255,${0.5 + 0.25 * Math.sin(t * 5)})`;
      ctx.strokeRect(-cx + 0.5, -cy + 0.5, 13 * TILE - 1, 13 * TILE - 1);
    }
  }

  /** a cor média de cada tile da sala (13x13), pro BLOCO BRUTO da construção */
  coresDaSalaLiga(img) {
    if (!img) return null;
    const cache = (this._coresLiga ||= new WeakMap());
    if (cache.has(img)) return cache.get(img);
    const cv = document.createElement("canvas");
    cv.width = img.width; cv.height = img.height;
    const g = cv.getContext("2d");
    g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, img.width, img.height).data, out = [];
    for (let ty = 0; ty < 13; ty++) for (let tx = 0; tx < 13; tx++) {
      let r = 0, gr = 0, b = 0, n = 0;
      for (let y = 0; y < TILE; y += 2) for (let x = 0; x < TILE; x += 2) {
        const i = ((ty * TILE + y) * img.width + tx * TILE + x) * 4;
        if (d[i + 3]) { r += d[i]; gr += d[i + 1]; b += d[i + 2]; n++; }
      }
      out.push(n ? `rgb(${r / n | 0},${gr / n | 0},${b / n | 0})` : "#6080a0");
    }
    cache.set(img, out);
    return out;
  }

  /** De que pedaço da sala é o tile (x, y)? */
  parteDaSala(x, y) {
    if (y >= 11) return "teto";                                   // o "teto" sobre a entrada
    if (y <= 2 || x === 0 || x === 12) return "paredes";
    if ((x === 2 || x === 10) && y !== 7 && y !== 10) return "pilares";   // os cubos de gelo
    if (this.ehPokebolaDaLiga(x, y)) return "bola";
    return "chao";
  }

  /** O ROTEIRO da cena de agora: o que acontece com cada parte da sala, e
   *  quando. ENTRADA: a sala holográfica se constrói (paredes, bola, chão,
   *  teto), a LORELEI chega e os PILARES SAEM DO CHÃO. TROCA: o líder sai, os
   *  pilares descem, a sala SE DESMONTA (menos a pokébola), pisca, a pokébola
   *  muda de cor e a sala SE REMONTA como a nova; o próximo chega, os pilares
   *  sobem. */
  roteiroDaLiga(tr) {
    const de = tr.entrada ? null : this.chaoDaLiga(tr.de), para = this.chaoDaLiga(tr.para);
    if (tr.entrada) {
      const R = LIGA_ENTRADA;
      return { antes: null, fases: [
        { parte: "paredes", modo: "monta", ini: R.paredes, img: para },
        { parte: "bola", modo: "monta", ini: R.bola, img: para },
        { parte: "chao", modo: "monta", ini: R.chao, img: para },
        { parte: "teto", modo: "monta", ini: R.teto, img: para },
        { parte: "pilares", modo: "sobe", ini: R.pilares, img: para },
      ], chega: [R.chega, R.pilares - 0.2], fim: R.fim, para };
    }
    const R = LIGA_TROCA;
    return { antes: de, sai: R.sai, pisca: R.pisca, fases: [
      { parte: "pilares", modo: "desce", ini: R.desce, img: de },
      { parte: "teto", modo: "desmonta", ini: R.desmontaTeto, img: de },
      { parte: "chao", modo: "desmonta", ini: R.desmontaChao, img: de },
      { parte: "paredes", modo: "desmonta", ini: R.desmontaParedes, img: de },
      { parte: "paredes", modo: "monta", ini: R.montaParedes, img: para },
      { parte: "chao", modo: "monta", ini: R.montaChao, img: para },
      { parte: "teto", modo: "monta", ini: R.montaTeto, img: para },
      { parte: "pilares", modo: "sobe", ini: R.sobe, img: para },
    ], chega: [R.chega, R.sobe - 0.2], fim: R.fim, de, para };
  }

  /** a vez de cada tile dentro da fase (a ORDEM da máquina), em segundos */
  vezDoTile(f, x, y) {
    const des = f.modo === "desmonta";
    if (f.parte === "paredes") return des ? (y <= 2 ? (12 - x) * 0.03 : (y - 3) * 0.03) : (y <= 2 ? x * 0.05 : 0.65 + (10 - y) * 0.04);
    if (f.parte === "teto") return des ? (12 - x) * 0.03 : x * 0.05;
    if (f.parte === "bola") return (8 - y) * 0.12 + Math.abs(x - 6) * 0.04;
    if (f.parte === "chao") {
      const d = Math.max(Math.abs(x - 6), Math.abs(y - 6.5));
      // montando, da pokébola pra fora; desmontando, de fora pra dentro
      return (des ? (7 - d) * 0.12 : d * 0.22) + ((x * 7 + y * 13) % 5) * 0.03;
    }
    return 0;                                    // os pilares sobem/descem juntos
  }

  /** o estado de uma parte no tile (x, y) no instante t: { modo, img, k } ou
   *  null (nada: o holograma). `antes` = como a sala estava antes de tudo */
  estadoNaLiga(rot, parte, x, y, t) {
    let ultimo = null;
    for (const f of rot.fases) if (f.parte === parte && t >= f.ini + this.vezDoTile(f, x, y)) ultimo = f;
    if (!ultimo) return rot.antes ? { modo: "pronto", img: rot.antes, k: 1 } : null;
    const e = t - ultimo.ini - this.vezDoTile(ultimo, x, y);
    const dur = { monta: 0.5, desmonta: 0.35, sobe: 0.8, desce: 0.6 }[ultimo.modo];
    return { modo: ultimo.modo, img: ultimo.img, k: Math.min(1, e / dur) };
  }

  /** a parte já está INTEIRA (pra camada de cima aparecer junto)? */
  parteProntaDaLiga(parte) {
    const tr = this.ligaTroca;
    if (!tr) return true;
    const rot = this.roteiroDaLiga(tr);
    const x = parte === "pilares" ? 2 : 6, y = parte === "teto" ? 12 : parte === "paredes" ? 1 : 4;
    const e = this.estadoNaLiga(rot, parte, x, y, tr.t);
    if (!e) return false;
    if (e.modo === "pronto") return true;
    return (e.modo === "monta" || e.modo === "sobe") && e.k >= 1;
  }

  /** UM TILE SE CONSTRUINDO, em etapas (k de 0 a 1):
   *    1. o CONTORNO de luz vai se fechando (o esqueleto)
   *    2. enche com a COR DO TILE, lisa e meio transparente (o bloco bruto)
   *    3. a máquina IMPRIME o desenho de baixo pra cima, com a linha de luz
   *    4. um BRILHO quando fica pronto
   *  Desmontando é o mesmo caminho ao contrário. (sx, sy) = o tile da imagem. */
  construirTileLiga(ctx, img, sx, sy, X, Y, k) {
    if (!img || k <= 0) return;
    if (k >= 1) return void ctx.drawImage(img, sx * TILE, sy * TILE, TILE, TILE, X, Y, TILE, TILE);
    const f = (a, b) => Math.max(0, Math.min(1, (k - a) / (b - a)));
    const c1 = f(0, 0.2);
    if (c1 > 0) {
      ctx.fillStyle = "rgba(140,245,255,0.9)";
      const L = TILE * 4 * c1;
      ctx.fillRect(X, Y, Math.min(TILE, L), 1);
      if (L > TILE) ctx.fillRect(X + TILE - 1, Y, 1, Math.min(TILE, L - TILE));
      if (L > TILE * 2) ctx.fillRect(X + TILE - Math.min(TILE, L - TILE * 2), Y + TILE - 1, Math.min(TILE, L - TILE * 2), 1);
      if (L > TILE * 3) ctx.fillRect(X, Y + TILE - Math.min(TILE, L - TILE * 3), 1, Math.min(TILE, L - TILE * 3));
    }
    const c2 = f(0.2, 0.36);
    if (c2 > 0) {
      ctx.save(); ctx.globalAlpha = 0.55 * c2;
      ctx.fillStyle = this.coresDaSalaLiga(img)?.[sy * 13 + sx] || "#6080a0";
      ctx.fillRect(X + 1, Y + 1, TILE - 2, TILE - 2);
      ctx.restore();
    }
    const c3 = f(0.36, 0.8);
    if (c3 > 0) {
      const h = Math.round(c3 * TILE);
      ctx.drawImage(img, sx * TILE, sy * TILE + TILE - h, TILE, h, X, Y + TILE - h, TILE, h);
      if (c3 < 1) {
        ctx.fillStyle = "rgba(140,245,255,0.95)";
        ctx.fillRect(X, Y + TILE - h - 1, TILE, 1);
        ctx.fillStyle = "rgba(140,245,255,0.35)";
        ctx.fillRect(X, Y + TILE - h - 2, TILE, 1);
      }
    }
    const c4 = f(0.8, 1);
    if (c4 > 0) {
      ctx.save(); ctx.globalAlpha = 0.6 * (1 - c4);
      ctx.fillStyle = "#e8ffff";
      ctx.fillRect(X, Y, TILE, TILE);
      ctx.restore();
    }
  }

  /** um tile num estado (montando, desmontando, pronto, subindo, descendo) */
  tileDaLiga(ctx, e, sx, sy, X, Y) {
    if (!e) return;
    if (e.modo === "pronto") return this.construirTileLiga(ctx, e.img, sx, sy, X, Y, 1);
    if (e.modo === "monta") return this.construirTileLiga(ctx, e.img, sx, sy, X, Y, e.k);
    if (e.modo === "desmonta") return this.construirTileLiga(ctx, e.img, sx, sy, X, Y, 1 - e.k);
    // os PILARES saindo do chão (ou afundando): o tile sobe de dentro dele mesmo
    const k = e.modo === "sobe" ? e.k : 1 - e.k;
    if (k <= 0 || !e.img) return;
    const h = Math.round(k * TILE);
    ctx.drawImage(e.img, sx * TILE, sy * TILE, TILE, h, X, Y + TILE - h, TILE, h);
  }

  /** Desenha a sala da etapa de agora; durante uma cena (entrada ou troca),
   *  o roteiro dela tile por tile. */
  desenharSalaDaLiga(ctx, cx, cy) {
    const tr = this.ligaTroca;
    if (!tr) {
      const etapa = this.st.flags?.ligaEtapa || 0;
      const atual = this.chaoDaLiga(etapa);
      if (atual && etapa) ctx.drawImage(atual, -cx, -cy);
      return;
    }
    const t = tr.t, rot = this.roteiroDaLiga(tr);
    this.vazioDaLiga(ctx, cx, cy, t, true);
    for (let y = 0; y <= 12; y++) for (let x = 0; x <= 12; x++) {
      const X = x * TILE - cx, Y = y * TILE - cy;
      const parte = this.parteDaSala(x, y);
      if (parte === "bola" && !tr.entrada) {
        // a POKÉBOLA DO CENTRO fica; muda de cor no clarão
        const img = t < rot.pisca + 0.12 ? rot.de : rot.para;
        if (img) ctx.drawImage(img, x * TILE, y * TILE, TILE, TILE, X, Y, TILE, TILE);
        continue;
      }
      if (parte === "pilares") {
        // embaixo do pilar tem chão (o tile do lado, que é chão liso), que
        // segue o chão; e o pilar por cima, saindo/afundando
        const vx = x === 2 ? 1 : 11;
        this.tileDaLiga(ctx, this.estadoNaLiga(rot, "chao", x, y, t), vx, y, X, Y);
        this.tileDaLiga(ctx, this.estadoNaLiga(rot, "pilares", x, y, t), x, y, X, Y);
        continue;
      }
      this.tileDaLiga(ctx, this.estadoNaLiga(rot, parte, x, y, t), x, y, X, Y);
    }
    // o LÍDER SAINDO (troca): anda até a porta e some
    if (rot.sai && t < rot.sai && tr.sprite) this.liderNaLiga(ctx, cx, cy, tr.sprite, "up", 5 - (t / rot.sai) * 3, 1 - Math.max(0, t / rot.sai - 0.7) / 0.3, t);
    // O HOLOGRAMA DO PRÓXIMO no lugar onde ele vai parar: aparece depois que o
    // de antes saiu (na entrada, logo no começo) e some quando ele chega nele
    const [c0, c1] = rot.chega;
    const npcProx = LIGA_ETAPAS[tr.para]?.npc;
    const holoIni = rot.sai ? rot.sai + 0.2 : 0.6;
    if (npcProx && t >= holoIni && t < c1) {
      const sumindo = t > c1 - 0.3 ? (c1 - t) / 0.3 : 1;
      this.hologramaNaLiga(ctx, cx, cy, npcProx.sprite, Math.min(1, (t - holoIni) / 0.4) * sumindo, t);
    }
    // O PRÓXIMO CHEGANDO: entra pela porta de cima e anda até o lugar dele
    if (t >= c0) {
      const ka = Math.min(1, (t - c0) / (c1 - c0));
      const npc = LIGA_ETAPAS[tr.para]?.npc;
      if (npc) this.liderNaLiga(ctx, cx, cy, npc.sprite, "down", 2 + ka * 3, Math.min(1, ka * 4), ka < 1 ? t : null);
    }
  }

  /** O HOLOGRAMA de um líder (azul, transparente, com linhas e tremendo) no
   *  lugar dele (6, 5) */
  hologramaNaLiga(ctx, cx, cy, sprite, alfa, t) {
    const ator = Assets.actor(sprite);
    const vista = ator && this.olhar(ator, "down");
    const q = vista?.set?.[0] && this.quadro(vista.set[0], vista.espelha);
    if (!q || alfa <= 0) return;
    const cache = (this._holoLiga ||= new WeakMap());
    let holo = cache.get(q);
    if (!holo) {
      holo = document.createElement("canvas");
      holo.width = q.width; holo.height = q.height;
      const g = holo.getContext("2d");
      g.drawImage(q, 0, 0);
      g.globalCompositeOperation = "source-atop";
      g.fillStyle = "rgba(90,230,255,0.85)";
      g.fillRect(0, 0, q.width, q.height);
      // as linhas do holograma (uma sim, uma não)
      g.globalCompositeOperation = "destination-out";
      g.fillStyle = "rgba(0,0,0,0.55)";
      for (let y = 1; y < q.height; y += 2) g.fillRect(0, y, q.width, 1);
      cache.set(q, holo);
    }
    const X = 6 * TILE - cx, pe = 5 * TILE - cy + TILE - 1, Y = Math.round(pe + 1 - holo.height);
    const meio = X + TILE / 2;
    ctx.save();
    // 1. o PROJETOR no chão: um anel aceso pulsando
    ctx.globalAlpha = alfa * (0.7 + 0.3 * Math.sin(t * 6));
    ctx.strokeStyle = "#8af4ff";
    ctx.beginPath(); ctx.ellipse(meio, pe, 7, 2.5, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "rgba(90,230,255,0.35)";
    ctx.beginPath(); ctx.ellipse(meio, pe, 5, 1.5, 0, 0, Math.PI * 2); ctx.fill();
    // 2. o FEIXE: luz subindo do projetor, apagando pra cima
    const g = ctx.createLinearGradient(0, pe, 0, Y - 4);
    g.addColorStop(0, "rgba(90,230,255,0.35)");
    g.addColorStop(1, "rgba(90,230,255,0)");
    ctx.globalAlpha = alfa;
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(meio - 6, pe); ctx.lineTo(meio + 6, pe);
    ctx.lineTo(meio + 10, Y - 4); ctx.lineTo(meio - 10, Y - 4); ctx.closePath(); ctx.fill();
    // 3. os PONTINHOS de luz subindo no feixe
    ctx.fillStyle = "#c8faff";
    for (let i = 0; i < 6; i++) {
      const k = ((t * 0.7 + i / 6) % 1);
      ctx.globalAlpha = alfa * (1 - k);
      ctx.fillRect(Math.round(meio - 6 + ((i * 37) % 12) + Math.sin(t * 3 + i) * 1.5), Math.round(pe - k * (pe - Y + 2)), 1, 1);
    }
    // 4. o BRILHO em volta do contorno (o holograma desenhado meio apagado
    //    um pixel pra cada lado)
    const base = alfa * (0.6 + 0.25 * Math.sin(t * 7));
    ctx.globalAlpha = base * 0.35;
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) ctx.drawImage(holo, X + dx, Y + dy);
    // 5. o HOLOGRAMA, com PEDAÇOS escorregando de lado de vez em quando
    ctx.globalAlpha = base;
    const chiado = Math.random() < 0.12;
    for (let y0 = 0; y0 < holo.height; y0 += 4) {
      const dx = chiado && Math.random() < 0.35 ? (Math.random() < 0.5 ? -2 : 2) : 0;
      ctx.drawImage(holo, 0, y0, holo.width, 4, X + dx, Y + y0, holo.width, 4);
    }
    // 6. a FAIXA CLARA subindo pelo corpo
    const fy = Y + holo.height - ((t * 18) % (holo.height + 10));
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = alfa * 0.5;
    ctx.fillStyle = "#8af4ff";
    ctx.fillRect(X, Math.round(fy), holo.width, 1);
    ctx.restore();
  }

  /** um líder andando na cena (`t` = o relógio do passo; null = parado) */
  liderNaLiga(ctx, cx, cy, sprite, dir, ty, alfa, t) {
    const ator = Assets.actor(sprite);
    const vista = ator && this.olhar(ator, dir);
    const set = vista?.set;
    const quadro = set && this.quadro(t != null ? this.quadroAndarT(set, t * 2) : set[0], vista.espelha);
    if (!quadro || alfa <= 0) return;
    ctx.save(); ctx.globalAlpha = alfa;
    ctx.drawImage(quadro, 6 * TILE - cx, Math.round(ty * TILE - cy + TILE - quadro.height));
    ctx.restore();
  }

  /** a CAMADA DE CIMA da sala (as colunas, o teto): a da sala de antes até o
   *  clarão, a da nova depois (com o mesmo filtro do chão) */
  overDaLiga() {
    const tr = this.ligaTroca;
    const i = tr ? (tr.entrada || tr.t >= LIGA_TROCA.pisca ? tr.para : tr.de) : (this.st.flags?.ligaEtapa || 0);
    const c = LIGA_ETAPAS[i]?.chao;
    const base = c && mapOverlay(c.de);
    if (!base || !c.filtro) return base || null;
    const cache = (this._overLiga ||= {});
    if (cache[i]) return cache[i];
    const cv = document.createElement("canvas");
    cv.width = base.width; cv.height = base.height;
    const g = cv.getContext("2d");
    g.filter = c.filtro;
    g.drawImage(base, 0, 0);
    cache[i] = cv;
    return cv;
  }

  /** Um tile do chão (x, y) é da POKÉBOLA DO CENTRO? (ela não sai) */
  ehPokebolaDaLiga(x, y) { return x >= 5 && x <= 7 && y >= 5 && y <= 8; }

  /** A CENA DA SALA: a ENTRADA (quando você chega pela porta do Centro) e a
   *  TROCA (quando você vence um, `flags.ligaPendente`). Enquanto dura, devolve
   *  true (nada anda). */
  trocaDaLiga(dt) {
    const st = this.st;
    if (!this.ligaTroca) {
      if (!this.map?.ligaTech || this.dlg.active || this.fx || this.fadeDir || (this.fadeA > 0) || this.menu || this.move) return false;
      if (st.flags?.ligaEntrada) {
        st.flags.ligaEntrada = false;
        st.flags.ligaTrocando = true;
        this.ligaTroca = { entrada: true, para: st.flags.ligaEtapa || 0, t: 0, som: {} };
        return true;
      }
      const para = st.flags?.ligaPendente;
      if (para == null) return false;
      const de = para - 1;
      st.flags.ligaPendente = null;
      st.flags.ligaEtapa = para;
      st.flags.ligaTrocando = true;
      // você fica em cima da POKÉBOLA DO CENTRO (é ela que não sai)
      const p = st.player;
      if (!this.ehPokebolaDaLiga(p.x, p.y)) { p.x = 6; p.y = 7; }
      p.dir = "up";
      this.ligaTroca = { de, para, t: 0, sprite: LIGA_ETAPAS[de]?.npc?.sprite, som: {} };
      return true;
    }
    const tr = this.ligaTroca;
    tr.t += dt;
    const rot = this.roteiroDaLiga(tr);
    // os SONS: um no começo de cada fase, e um "tec" a cada onda do chão
    rot.fases.forEach((f, i) => {
      if (tr.som[i] || tr.t < f.ini) return;
      tr.som[i] = true;
      if (f.modo === "monta") { Audio2.tone(330, 0.12); Audio2.tone(494, 0.18); }
      else if (f.modo === "desmonta") { Audio2.tone(392, 0.12); Audio2.tone(262, 0.18); }
      else if (f.modo === "sobe") { Audio2.tone(196, 0.2); Audio2.tone(294, 0.25); this.tremor = 0.5; }
      else { Audio2.tone(294, 0.2); Audio2.tone(147, 0.3); this.tremor = 0.5; }
    });
    const chao = rot.fases.find((f) => f.parte === "chao" && f.modo === "monta");
    const onda = chao ? Math.floor((tr.t - chao.ini) / 0.22) : -1;
    if (onda >= 0 && onda <= 7 && tr.som.onda !== onda) { tr.som.onda = onda; Audio2.tone(392 + onda * 60, 0.05); }
    if (rot.pisca && !tr.som.pisca && tr.t >= rot.pisca) {
      tr.som.pisca = true;
      this.flashLiga = 1; Audio2.tone(1319, 0.12); Audio2.tone(1760, 0.2);
    }
    if (this.flashLiga > 0) this.flashLiga = Math.max(0, this.flashLiga - dt * 2.2);
    if (tr.t >= rot.fim) {
      this.ligaTroca = null;
      this.flashLiga = 0;
      st.flags.ligaTrocando = false;
      this.game.autosave?.(true);
      if (!tr.entrada) {
        const prox = LIGA_ETAPAS[tr.para]?.npc;
        this.dlg.say(`A SALA SE TRANSFORMOU! ${prox?.trainer?.name || "O PRÓXIMO"} ESTÁ ESPERANDO.`);
      }
    }
    return true;
  }

  /** O HALL DA FAMA (src/scenes/halldafama.js): na primeira vez que você entra
   *  depois de vencer o campeão, o CARVALHO fala, a máquina registra o time e
   *  você volta pra casa (como no FireRed) */
  talvezHallDaFama() {
    const st = this.st;
    // A VOLTA PRA CASA: a MÃE, o OMELETE DE OVO DE CHANSEY e mais conversa
    if (this.maeVolta) {
      if (this.dlg.active || this.fx || this.fadeDir || (this.fadeA > 0) || this.menu || this.move) return;
      this.maeVolta = false;
      const T = HALL_TEXTO;
      const filho = st.player?.genero === "menina" ? "FILHA" : "FILHO";
      const f = (l) => l.map((x) => x.replace("{FILHO}", filho));
      st.player.dir = "up";
      Audio2.tone(784, 0.1); Audio2.tone(988, 0.15);
      return void this.dlg.say(f(T.mae1), () => {
        this.omelete = { t: 0, mordidas: 0 };
      });
    }
    if (this.hallVolta) {
      if (this.dlg.active || this.fx || this.fadeDir || (this.fadeA > 0) || this.menu || this.move) return;
      this.hallVolta = false;
      const T = HALL_TEXTO;
      this.justWarped = true;
      return void this.transition(() => {
        Object.assign(st.player, { ...T.casa });
        st.party.forEach((m) => { m.hp = m.maxHp; m.status = null; });
        this.afterTravel();
        this.game.autosave?.(true);
        this.maeVolta = true;          // a cena da MÃE começa quando a tela clarear
      });
    }
    // O HALL DA FAMA DE BRAGLITCH (src/data/braglitch-liga.js `hall`): na CÚPULA,
    // as GARRAS montam cada Pokémon e o GÊMEO entra na foto
    if (st.flags?.hallBragPendente && this.map?.ligaBrag) {
      if (this.dlg.active || this.fx || this.fadeDir || (this.fadeA > 0) || this.menu || this.move || this.ligaBragTroca) return;
      st.flags.hallBragPendente = false;
      const H = DB.LIGA_BRAG.hall;
      return void this.dlg.say(H.antes, () => {
        // o time do GÊMEO (o da luta dos campeões) entra também: os 12
        const nomeG = quemEhOGemeo(st), g = DB.LIGA_BRAG.gemeo[nomeG];
        const timeGemeo = (g?.time || []).filter(([id]) => DB.SPECIES[id]).map(([id, lvl, extra]) => createMon(id, lvl, { shiny: extra === "shiny" }));
        this.game.scenes.push(new HallDaFamaScene(), { st, garras: true, gemeo: nomeG, timeGemeo, titulo: H.titulo, aoFim: () => {
          this.game.music(this.map.music);
          this.game.autosave?.(true);
          this.dlg.say(H.depois);
        } });
      });
    }
    if (!st.flags?.hallPendente || st.player.map !== "pokemon_league_hall_of_fame") return;
    if (this.dlg.active || this.fx || this.fadeDir || (this.fadeA > 0) || this.menu || this.move) return;
    st.flags.hallPendente = false;
    const T = HALL_TEXTO;
    this.dlg.say(T.antes, () => {
      this.game.scenes.push(new HallDaFamaScene(), { st, aoFim: () => {
        this.game.music(this.map.music);
        this.game.autosave?.(true);
        // a volta pra casa espera a tela clarear (a viagem não começa no
        // meio de um fade): quem leva é o `talvezHallDaFama` do próximo quadro
        this.dlg.say(T.depois, () => { this.hallVolta = true; });
      } });
    });
  }

  /** O OMELETE DE OVO DE CHANSEY: o prato aparece, três mordidas (nham!), o
   *  prato vazio — e o time inteiro fica cheio de energia */
  comerOmelete(dt) {
    const o = this.omelete;
    o.t += dt;
    const mordida = Math.floor((o.t - 1.2) / 0.55);
    if (mordida >= 0 && mordida < 3 && o.mordidas <= mordida) {
      o.mordidas = mordida + 1;
      Audio2.tone(220 + mordida * 30, 0.06); Audio2.tone(180 + mordida * 30, 0.08);
    }
    if (o.t >= 3.4 && !o.acabou) {
      o.acabou = true;
      const st = this.st;
      st.party.forEach((m) => { m.hp = m.maxHp; m.status = null; m.friendship = Math.min(255, (m.friendship || 70) + 30); });
      Audio2.heal();
      const T = HALL_TEXTO;
      const filho = st.player?.genero === "menina" ? "FILHA" : "FILHO";
      this.dlg.say([T.comeu, ...T.mae2.map((x) => x.replace("{FILHO}", filho))], () => { this.omelete = null; this.game.autosave?.(true); });
    }
    this.dlg.update?.(dt);
  }

  /** o desenho do OMELETE (pixel por pixel): o prato, o omelete amarelo
   *  dobrado com a beirada dourada, a salsinha — e as mordidas tirando pedaço */
  desenharOmelete(ctx) {
    const o = this.omelete;
    if (!o) return;
    const aparece = Math.min(1, o.t / 0.4);
    const PX = 3, ox = 120 - 13 * PX, oy = 40 + (1 - aparece) * 10;
    const prato = [
      "...........wwwww..........",
      "........wwwgggggwww.......",
      ".....wwwgg.........ggwww..",
      "...wwg................gww.",
      "..wg....................gw",
      ".wg......................g",
      "wg.......................g",
      "wg.......................g",
      ".wg......................g",
      "..wg....................gw",
      "...wwg................gww.",
      ".....wwwgg.........ggwww..",
      "........wwwgggggwww.......",
      "...........wwwww..........",
    ];
    const omelete = [
      "......dddddddddddd......",
      "....ddyyyyyyyyyyyydd....",
      "...dyyYYyyyyyyyyyyyyd...",
      "..dyyyyyyyyyyyyyyyyyyd..",
      ".dyyyyyyyGyyyyyyyyyyyyd.",
      ".dyyyyyyGGGyyyyypyyyyyd.",
      "dyyyyyyyyGyyyyyyyyyyyyd",
      "dyyyyyyyyyyyyyyyyyyyyyd",
      ".ddyyyyyyyyyyyyyyyyydd.",
      "...ddddddddddddddddd...",
    ];
    const cor = { w: "#f8f8f8", g: "#b8c0c8", d: "#c88820", y: "#f8d848", Y: "#fff0a0", G: "#40a040", p: "#f0a0b0" };
    ctx.save();
    ctx.globalAlpha = aparece;
    ctx.fillStyle = "rgba(20,16,24,0.55)";
    ctx.fillRect(ox - 10, oy - 10, 26 * PX + 20, 14 * PX + 20);
    // o prato (por dentro, branco)
    ctx.fillStyle = "#ececec";
    ctx.beginPath(); ctx.ellipse(ox + 13 * PX, oy + 7 * PX, 12 * PX, 6 * PX, 0, 0, Math.PI * 2); ctx.fill();
    prato.forEach((l, y) => [...l].forEach((c, x) => { if (c !== ".") { ctx.fillStyle = cor[c]; ctx.fillRect(ox + x * PX, oy + y * PX, PX, PX); } }));
    // o omelete, perdendo um pedaço a cada mordida (do lado direito pro esquerdo)
    const resto = 1 - o.mordidas / 3;
    const corte = Math.round(23 * resto);
    if (resto > 0) {
      omelete.forEach((l, y) => [...l].forEach((c, x) => {
        if (c === "." || x >= corte) return;
        // a beirada da mordida: um dente torto
        if (x === corte - 1 && (y % 3 === 1)) return;
        ctx.fillStyle = cor[c]; ctx.fillRect(ox + (x + 1.5) * PX, oy + (y + 2) * PX, PX, PX);
      }));
    }
    if (o.mordidas > 0 && o.t < 3.4) {
      const nham = "NHAM!";
      drawText(ctx, nham, ox + 26 * PX - 10, oy - 4 - (o.t % 0.55) * 8, "#ffffff");
    }
    ctx.restore();
  }

  /** quantos quadros um tile leva: andando, correndo, ou de BICICLETA (2x
   *  andando; correndo de bicicleta, mais ainda). Dentro de casa ou na água
   *  ninguém pedala (e a bicicleta fica guardada até sair) */
  quadrosDoPasso(correndo) {
    if (this.st.bicicleta && !this.map?.interior && !this.st.surfando && !this.st.voando) return correndo ? 5 : RUN;
    return correndo ? RUN : WALK;
  }

  /** A BICICLETA (src/data/itens-uso.js): sobe/desce; em cima, anda 2x */
  usarBicicleta() {
    const B = DB.BICICLETA;
    this.menu = null;
    if (this.st.bicicleta) { this.st.bicicleta = false; Audio2.cancel(); return void this.dlg.say(B.desceu); }
    if (this.map?.interior || this.st.surfando || this.st.voando) { Audio2.cancel(); return void this.dlg.say(B.dentro); }
    this.st.bicicleta = true;
    Audio2.tone(784, 0.06); Audio2.tone(1047, 0.08);
    this.dlg.say(B.subiu);
  }

  /** os itens que a mochila mostra agora: os do bolso da vez (ou todos, quando
   *  ela abriu pra entregar alguma coisa a alguém) */
  itensDaMochila(m) {
    if (m?.escolher) return Object.keys(this.st.items);
    const bolsos = bolsosComItem(this.st);
    if ((m.bolso || 0) >= bolsos.length) m.bolso = 0;
    return itensNoBolso(this.st, bolsos[m.bolso || 0]);
  }

  /** usa até 999 de uma vez */
  useItem(item, mon, qty) {
    this.menu = null;
    const have = this.st.items[item] || 0;
    const n = Math.max(1, Math.min(qty, have));
    if (doceDoItem(item)) return this.darDoce(item, mon);
    // a PEDRA DO TROVÃO é as duas coisas: no bicho que ela evolui (PIKACHU, EEVEE...)
    // ela é usada; em qualquer outro, ele segura (e num FANTASMA ela assombra)
    const evoluiAqui = DB.EVO_ITEMS?.[item] && alvoDaPedra(item, mon.species, this.st.player.map);
    if (seguravel(item) && !evoluiAqui) return this.darPraSegurar(item, mon);
    if (ehMaquina(item)) return this.usarMaquina(item, mon);
    if (DB.EVO_ITEMS?.[item]) return this.useEvoItem(item, mon);
    if (item === "sopa max") return this.usarSopaMax(mon);
    if (item === DB.CUIA?.item) return this.usarCuia(mon);
    if (DB.COGUMELOS?.itens?.[item]) return this.darCogumelo(item, mon);
    if (item === DB.GUARDA_ROUPA?.item) return this.usarGuardaRoupa(mon);
    if (item === DB.CATALOGO_ROTOM?.item) return this.usarCatalogo(mon);
    // os itens de FORMA que um DLC traz (o ROTEADOR EXTREMO 999G): mesmo jeito do catálogo
    if (DB.ITENS_DE_FORMA?.[item]) return this.usarCatalogo(mon, DB.ITENS_DE_FORMA[item]);
    if (item === DB.CUBO_ZYGARDE?.item) return this.usarCubo(mon);
    if (item === DB.CONECTADOR?.item) return this.usarConectador(mon);
    if (item === PEDRA_BUGADA.item) return this.usarPedraBugada(mon);
    if (item === DB.VINCULO?.cristal.item) return this.darCristal(mon);
    // A CURA (src/data/itens-uso.js): poções, reviver, antídoto, cura total...
    const cura = DB.ITENS_CURA?.[item];
    if (cura) {
      const caido = mon.hp <= 0;
      if (cura.reviver) {
        if (!caido) return void this.dlg.say(`${mon.nickname} NÃO ESTÁ DESMAIADO.`);
        mon.hp = Math.max(1, Math.floor(mon.maxHp * cura.reviver)); mon.status = null;
        this.spend(item, 1); Audio2.heal();
        return void this.dlg.say(`${mon.nickname} LEVANTOU!`);
      }
      if (caido) return void this.dlg.say(`${mon.nickname} ESTÁ DESMAIADO. ISSO NÃO RESOLVE.`);
      const curaStatus = cura.status && mon.status && (cura.status === "*" || cura.status === mon.status);
      const missing = mon.maxHp - mon.hp;
      if (!curaStatus && !(cura.hp && missing > 0)) {
        return void this.dlg.say(cura.hp && !cura.status ? `${mon.nickname} JÁ ESTÁ COM O HP CHEIO!` : "NÃO VAI FAZER EFEITO NENHUM.");
      }
      const falas = [];
      let used = 1;
      if (cura.hp && missing > 0) {
        // as poções de número: usa quantas precisar (até `qty`); a máxima, uma
        used = cura.hp === "max" ? 1 : Math.min(n, Math.ceil(missing / cura.hp));
        const antes = mon.hp;
        mon.hp = cura.hp === "max" ? mon.maxHp : Math.min(mon.maxHp, mon.hp + used * cura.hp);
        falas.push(`${mon.nickname} RECUPEROU ${mon.hp - antes} DE HP!${used > 1 ? ` (${used} ${item.toUpperCase()})` : ""}`);
      }
      if (curaStatus) { mon.status = null; falas.push(`${mon.nickname} FICOU BOM!`); }
      this.spend(item, used);
      Audio2.heal();
      return void this.dlg.say(falas);
    }
    return this.useCandy(mon, n);
  }

  /** O CRISTAL DO VÍNCULO (src/data/vinculo.js): a amizade passa do máximo */
  darCristal(mon) {
    const { gastou, linhas } = usarCristal(this.st, mon);
    if (gastou) { this.spend(DB.VINCULO.cristal.item, 1); Audio2.heal(); this.game.autosave?.(true); }
    else Audio2.cancel();
    this.dlg.say(linhas);
  }

  /** O GUARDA-ROUPA ÚNICO (src/data/guarda-roupa.js): as roupas da espécie
   *  dele — a normal e as FORMAS ÚNICAS do UNIQUEMON — e ele veste a escolhida.
   *  Não se gasta. */
  usarGuardaRoupa(mon) {
    const G = DB.GUARDA_ROUPA, base = baseDe(mon.species);
    const nomeBase = DB.SPECIES[base]?.name || base;
    const f = (t, roupa = "") => t.replace("{MON}", mon.nickname).replace("{NOME}", nomeBase).replace("{ROUPA}", roupa);
    const roupas = roupasDe(mon);
    // DESENHAR NOVA: o UNIQUEMON (uniquemon/) numa aba nova, com a espécie
    // dele já escolhida — é de lá que vêm as roupas
    const desenhar = () => {
      window.open(url(`uniquemon/?especie=${encodeURIComponent(base)}`), "_blank");
      this.dlg.say(G.abriu);
    };
    if (roupas.length <= 1) {
      return void this.dlg.ask(f(G.semRoupa), [G.desenhar, "VOLTAR"], (i) => { if (i === 0) desenhar(); });
    }
    const nomes = roupas.map((id) => (id === base ? f(G.normal) : DB.SPECIES[id].name));
    this.dlg.ask(f(G.pergunta), [...nomes, G.desenhar, "VOLTAR"], (i) => {
      if (i === nomes.length) return void desenhar();
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
  /** A SOPA MAX (desenho do CAIO, 07/nov/2026): o Pokémon ganha o FATOR
   *  GIGANTAMAX. Quem tem forma GIGANTAMAX (as de Braglitch, que ele desenha)
   *  vira ela quando dynamaxa (src/systems/dynamax.js). */
  usarSopaMax(mon) {
    if (mon.gmax) return void this.dlg.say(`${mon.nickname} JÁ TEM O FATOR GIGANTAMAX!`);
    mon.gmax = true;
    this.spend("sopa max", 1);
    Audio2.heal();
    this.game.autosave?.(true);
    this.dlg.say([`${mon.nickname} TOMOU A SOPA MAX TODINHA!`, `${mon.nickname} GANHOU O FATOR GIGANTAMAX!`]);
  }

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
  usarCatalogo(mon, C = DB.CATALOGO_ROTOM) {
    if (!C.aceita.includes(mon.species)) {
      Audio2.cancel();
      return void this.dlg.say(C.nada.replace("{MON}", mon.nickname));
    }
    // a forma "normal" é a de onde ele veio: ROTOM ou ROTOM-BRAG (fica no mon)
    const base = C.bases.includes(mon.species) ? mon.species : (mon.rotomBase || C.bases[0]);
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
      C.aoTrocar?.(mon, nova);                 // o DLC troca o golpe da forma, por exemplo
      Audio2.tone(880, 0.05); Audio2.tone(1320, 0.1);
      Glitch.hit(0.6);
      this.game.autosave?.(true);
      this.dlg.say(C.bases.includes(nova) ? C.saiu.replace("{MON}", mon.nickname)
        : C.virou.replace("{MON}", mon.nickname).replace("{FORMA}", nome));
    });
  }

  /** O CONECTADOR DE LENDAS (src/data/conectador.js): no lendário principal,
   *  junta com o parceiro da equipe (que fica guardado dentro dele, em
   *  `mon.conectado`); no lendário já junto, separa. */
  usarConectador(mon) {
    const C = DB.CONECTADOR, T = C.textos, st = this.st;
    const nome = (m) => m.nickname || DB.SPECIES[m.species]?.name || m.species;
    const trocaForma = (m, para) => {
      const frac = m.maxHp ? m.hp / m.maxHp : 1;
      m.species = para;
      recalc(m);
      m.hp = Math.max(1, Math.round(m.maxHp * frac));
      st.seen[para] = true; st.caught[para] = true;
    };
    // JÁ JUNTO: separa
    if (mon.conectado) {
      const par = C.pares.find((p) => p.forma === mon.species);
      return void this.dlg.ask(T.separar.replace("{MON}", nome(mon)), T.opcoesSeparar, (i) => {
        if (i !== 0) return;
        const parceiro = mon.conectado;
        delete mon.conectado;
        const nomeVelho = DB.SPECIES[mon.species]?.name;
        trocaForma(mon, par?.base || mon.conectadoDe || "calyrex");
        delete mon.conectadoDe;
        if (mon.nickname === nomeVelho) mon.nickname = DB.SPECIES[mon.species].name;
        const falas = [T.separou.replace("{MON}", nome(mon)).replace("{PARCEIRO}", nome(parceiro))];
        if (st.party.length < 6) st.party.push(parceiro);
        else { guardarNoBox(st, parceiro); falas.push(T.proPc.replace("{PARCEIRO}", nome(parceiro))); }
        Audio2.tone(988, 0.06); Audio2.tone(660, 0.1);
        Glitch.hit(0.5);
        this.game.autosave?.(true);
        this.dlg.say(falas);
      });
    }
    const pares = C.pares.filter((p) => p.base === mon.species && DB.SPECIES[p.forma]);
    if (!pares.length) { Audio2.cancel(); return void this.dlg.say(T.nada.replace("{MON}", nome(mon))); }
    if (mon.hp <= 0) { Audio2.cancel(); return void this.dlg.say(T.desmaiado.replace("{MON}", nome(mon))); }
    // os parceiros que estão na EQUIPE
    const opcoes = pares.map((p) => ({ p, m: st.party.find((x) => x !== mon && x.species === p.parceiro && x.hp > 0) })).filter((o) => o.m);
    if (!opcoes.length) { Audio2.cancel(); return void this.dlg.say(T.semParceiro.replace("{MON}", nome(mon))); }
    this.dlg.ask(T.pergunta.replace("{MON}", nome(mon)), [...opcoes.map((o) => nome(o.m)), "VOLTAR"], (i) => {
      const o = opcoes[i];
      if (!o) return;
      const nomeVelho = DB.SPECIES[mon.species].name;
      st.party.splice(st.party.indexOf(o.m), 1);
      mon.conectado = o.m;
      mon.conectadoDe = mon.species;
      trocaForma(mon, o.p.forma);
      if (mon.nickname === nomeVelho) mon.nickname = DB.SPECIES[o.p.forma].name;
      Audio2.tone(523, 0.08); Audio2.tone(784, 0.08); Audio2.tone(1047, 0.16);
      Glitch.hit(0.9);
      this.game.autosave?.(true);
      this.dlg.say(T.juntou.map((f) => f.replace("{MON}", nomeVelho).replace("{PARCEIRO}", nome(o.m)).replace("{FORMA}", DB.SPECIES[o.p.forma].name)));
    });
  }

  /** TROCA COM NPC (src/data/trocas.js): ele pede uma espécie e dá a dele,
   *  com apelido. Uma vez só por troca. */
  trocarComNpc(t) {
    if (t.aleatoria) return this.trocaSurpresa(t);
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

  /** A TROCA SURPRESA (o SEU SORTEIO de SÃO LUCARIO): qualquer um da equipe
   *  por um sorteado (src/systems/trocasorteio.js), quantas vezes quiser. */
  trocaSurpresa(t) {
    const st = this.st, F = t.falas;
    this.dlg.say(F.oferta, () => this.dlg.ask(F.pergunta, ["SIM", "NÃO"], (i) => {
      if (i !== 0) return void this.dlg.say(F.recusou);
      const nomes = st.party.map((m) => `${m.nickname} N${m.level}`);
      this.dlg.ask(F.qual, [...nomes, "VOLTAR"], (k) => {
        const meu = st.party[k];
        if (!meu) return void this.dlg.say(F.recusou);
        this.dlg.ask(F.certeza.replace("{MON}", meu.nickname), ["SIM", "NÃO"], (c) => {
          if (c !== 0) return void this.dlg.say(F.recusou);
          const novo = sortearDaTroca(meu);
          novo.ot = t.dono;
          novo.trocado = true;
          st.party[st.party.indexOf(meu)] = novo;
          st.seen[novo.species] = true;
          st.caught[novo.species] = true;
          this.game.autosave?.(true);
          const fim = F.feito.map((l) => l.replace("{MON}", novo.nickname));
          if (novo.shiny || novo.luminoso) fim.splice(1, 0, F.brilhou);
          // misterio: ele vem tapado de "?" e só aparece quando a troca acaba
          this.game.scenes.push(new TrocaNpcScene(), { meu, novo, dono: t.dono, misterio: true, onDone: () => this.dlg.say(fim) });
        });
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

  /** A PEDRA BUGADA (src/data/pedra-bugada.js): o MISSINGNO. escolhe que
   *  desenho ler — NORMAL, ÂMBAR, DOMO ou FANTASMA. Não se gasta. */
  usarPedraBugada(mon) {
    const P = PEDRA_BUGADA;
    if (!P.aceita.includes(mon.species)) {
      Audio2.cancel();
      return void this.dlg.say(P.nada.replace("{MON}", mon.nickname));
    }
    const opcoes = P.opcoes.filter(([id]) => DB.SPECIES[id]);
    this.dlg.ask(P.pergunta.replace("{MON}", mon.nickname), [...opcoes.map(([, nome]) => nome), "VOLTAR"], (i) => {
      const escolha = opcoes[i];
      if (!escolha) return;
      const [nova, nome] = escolha;
      if (nova === mon.species) return void this.dlg.say(P.jaE.replace("{MON}", mon.nickname));
      const hpAntes = mon.maxHp ? mon.hp / mon.maxHp : 1;
      mon.species = nova;
      recalc(mon);
      mon.hp = Math.max(mon.hp > 0 ? 1 : 0, Math.round(mon.maxHp * hpAntes));
      Glitch.hit(2);
      Audio2.glitch();
      this.game.autosave?.(true);
      this.dlg.say(nova === "missingno" ? P.normal.replace("{MON}", mon.nickname)
        : P.virou.replace("{MON}", mon.nickname).replace("{FORMA}", nome));
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
    // a terceira coisa da opção diz de quem ela é (o 200% só pra quem está COMPLETO)
    const opcoes = C.opcoes.filter(([id, , de]) => DB.SPECIES[id] && (!de || de.includes(mon.species)));
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
    this.game.autosave?.(true);
    this.chocarNaTela(mon, msgs);
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
    if (m.type === "contatos") {
      const lista = this.contatos();
      const n = lista.length;
      if (Input.consume("b") || (!n && Input.consume("a"))) { this.menu = { type: "main", index: this.itensMenu().indexOf("CONTATOS") }; return void Audio2.cancel(); }
      if (Input.consume("up")) { m.index = (m.index + n - 1) % n; Audio2.blip(); }
      if (Input.consume("down")) { m.index = (m.index + 1) % n; Audio2.blip(); }
      if (Input.consume("a")) { Audio2.select(); this.menu = null; return void this.ligar(lista[m.index]); }
      return;
    }
    if (m.type === "main") {
      const items = this.itensMenu();
      m.index = Math.min(m.index, items.length - 1);
      // O ROTOMFONE: os ícones em grade (COLUNAS_FONE por linha)
      const n = items.length, C = COLUNAS_FONE;
      if (Input.consume("left")) { m.index = (m.index + n - 1) % n; Audio2.blip(); }
      if (Input.consume("right")) { m.index = (m.index + 1) % n; Audio2.blip(); }
      if (Input.consume("up")) { m.index = m.index - C >= 0 ? m.index - C : Math.min(n - 1, m.index + C * Math.floor((n - 1 - m.index) / C)); Audio2.blip(); }
      if (Input.consume("down")) { m.index = m.index + C < n ? m.index + C : m.index % C; Audio2.blip(); }
      if (Input.consume("b")) { this.menu = null; Audio2.cancel(); }
      if (Input.consume("a")) {
        Audio2.select();
        const pick = items[m.index];
        if (pick === "VOAR") { this.menu = null; return void this.abrirVoo(); }
        if (pick === "LEVANTAR VOO") { this.menu = null; return void this.levantarVoo(); }
        if (pick === "VOAR LIVRE") { this.menu = null; return void this.montar(); }
        if (pick === "MERGULHAR") { this.menu = null; return void this.mergulhar(); }
        if (pick === "SUBIR") { this.menu = null; return void this.subir(); }
        if (pick === "FICAR NA BOLA") { this.menu = null; return void this.entrarNaBola(); }
        if (pick === "SAIR DA BOLA") { this.menu = null; return void this.sairDaBola(); }
        if (pick === "POUSAR") { this.menu = null; return void this.pousar(); }
        if (pick === "ACAMPAR") {
          this.menu = null;
          return void this.game.scenes.push(new AcampamentoScene());
        }
        if (pick === "ONLINE") { this.menu = null; return void this.game.scenes.push(new OnlineMenuScene()); }
        if (pick === "POKÉDEX") { this.menu = null; return void this.game.scenes.push(new PokedexScene(), {}); }
        if (pick === "ROUPAS") { this.menu = null; return void this.game.scenes.push(new RoupasScene(), {}); }
        if (pick === "METAS") { this.menu = null; return void this.game.scenes.push(new MetasScene(), {}); }
        if (pick === "CONTATOS") { this.menu = { type: "contatos", index: 0 }; return; }
        if (pick === "CÂMERA") { this.menu = null; return void this.abrirCamera(); }
        if (pick === "TRABALHOS") { this.menu = null; return void this.game.scenes.push(new TrabalhosScene(), {}); }
        if (pick === "POKÉMON") this.menu = { type: "party", index: 0 };
        else if (pick === "BOX") {
          // o PC do jeito oficial (src/scenes/pc.js)
          this.menu = null;
          return void this.game.scenes.push(new PcScene(), { modo: "mons", soltar: (lista, i) => this.pedirSoltar(lista, i) });
        }
        else if (pick === "MOCHILA") { this.menu = { type: "bag", index: 0 }; adiantarItens(Object.keys(this.st.items)); }
        else if (pick === "INSÍGNIAS") this.menu = { type: "badges", index: 0 };
        else if (pick === "MAPA") this.menu = { type: "mapaRegiao", sel: this.ondeNoMapa() };
        else if (pick === DB.MISSAO_TEXTO.titulo) this.menu = { type: "missoes", index: 0, top: 0 };
        else if (pick === DB.STORY.fusao.atualizar) { this.menu = null; return void this.baixarDoMundo(); }
        else if (pick === "SALVAR") {
          this.menu = null;
          // o ESTOJO com as suas insígnias aparece enquanto salva (src/core/insigniascorpo.js)
          this.estojoAte = performance.now() + 60000;
          this.game.save().then((r) => this.dlg.say(
            r === "ok" ? "JOGO SALVO!"
            : r === "conflito" ? "O SAVE MUDOU POR FORA. RECARREGUEI A PARTIDA DO ARQUIVO."
            : "NÃO DEU PRA SALVAR. O SERVIDOR ESTÁ NO AR?", () => { this.estojoAte = 0; }));
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
      // OS BOLSOS (src/systems/mochila.js): ◀ ▶ troca (pra entregar um item a
      // alguém — `m.escolher` — a mochila mostra tudo de uma vez)
      if (!m.escolher) {
        const nb = bolsosComItem(this.st).length;
        if (nb > 1 && Input.consume("left")) { m.bolso = ((m.bolso || 0) + nb - 1) % nb; m.index = 0; m.top = 0; Audio2.blip(); }
        if (nb > 1 && Input.consume("right")) { m.bolso = ((m.bolso || 0) + 1) % nb; m.index = 0; m.top = 0; Audio2.blip(); }
      }
      const keys = this.itensDaMochila(m);
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
        if (item === VISOR && owned > 0) return void this.usarVisor();   // o VISOR DE CARDUMES: põe/tira
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
        if (item === DB.CAIXA_FERRAMENTAS?.item && owned > 0) {
          Audio2.select();                       // item-chave: monta uma POKÉMÁQUINA no tile da frente
          this.menu = null;
          return void abrirCaixa(this, (x, y) => this.lugarDeMaquina(x, y));
        }
        if (item === "picareta" && owned > 0) {
          Audio2.select();                       // item-chave: cava onde estiver — ou DESCE (o SUBTERRÂNEO)
          this.menu = null;
          return void this.usarPicareta();
        }
        if (item === DB.PURIFICADOR?.item && owned > 0) {
          Audio2.select();                       // PURIFICADOR: escolhe o fóssil
          return void this.usarPurificador();
        }
        if (DB.MINERACAO?.MINA_LORE?.[item] && owned > 0) {
          Audio2.select();                       // achado da mina: só se olha
          return void this.dlg.say(DB.MINERACAO.MINA_LORE[item]);
        }
        if (DB.OVOS?.tipos?.[item] && owned > 0) {
          Audio2.select();                       // MYSTERY EGG: racha na hora
          return void this.racharOvo(item);
        }
        if (giganteDoItem(item) && owned > 0) {
          return void this.invocarGigante(giganteDoItem(item));   // ESFERA DE JADE: ele desce
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
        // o KIT DE BASE SECRETA: abre a base no bloco da frente
        if (item === DB.KIT_BASE && owned > 0) { this.menu = null; return void this.usarKitBase(); }
        // o ESTOJO DE POKÉBLOCOS só abre na batalha (é pros selvagens)
        if (item === DB.POKEBLOCOS?.ESTOJO) { Audio2.cancel(); return void this.dlg.say(DB.POKEBLOCOS.POKEBLOCO_TEXTO.soNaBatalha); }
        // a CUIA TÉRMICA, o CATÁLOGO ROTOM, o CUBO ZYGARDE e os COGUMELOS do
        // PARASECT também escolhem um bicho
        const cuia = item === DB.CUIA?.item || item === DB.CATALOGO_ROTOM?.item || item === DB.CUBO_ZYGARDE?.item
          || item === PEDRA_BUGADA.item
          || !!DB.COGUMELOS?.itens?.[item] || item === DB.GUARDA_ROUPA?.item
          || item === DB.VINCULO?.cristal.item || !!DB.ITENS_DE_FORMA?.[item]
          || item === DB.CONECTADOR?.item   // o CONECTADOR DE LENDAS: escolhe o lendário
          || !!doceDoItem(item)             // os DOCES do MILCERY / ALCREMIE
          || seguravel(item)                // os ITENS DE SEGURAR
          || ehMaquina(item);               // as MTs e MOs (src/systems/maquinas.js)
        if ((DB.EVO_ITEMS?.[item] || cuia || item === "sopa max") && owned > 0 && this.st.party.length) {
          Audio2.select();                       // item de evolução: um por vez
          this.menu = { type: "useItem", index: 0, item, qty: 1 };
          return;
        }
        // os X da batalha: só na batalha
        if (DB.ITENS_BATALHA?.[item] && owned > 0) { Audio2.cancel(); return void this.dlg.say("ESSE ITEM SÓ FUNCIONA NA BATALHA."); }
        // a BICICLETA: sobe e desce
        if (item === DB.BICICLETA?.item && owned > 0) return void this.usarBicicleta();
        // a CURA que não é de número (reviver, antídoto, cura total, poção
        // máxima): um por vez, escolhendo quem
        const cura = DB.ITENS_CURA?.[item];
        if (cura && owned > 0 && this.st.party.length && !(typeof cura.hp === "number")) {
          Audio2.select();
          this.menu = { type: "useItem", index: 0, item, qty: 1 };
          return;
        }
        const usable = (item === "doce raro" || (cura && typeof cura.hp === "number")) && owned > 0 && this.st.party.length;
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
        else if (m.index === 5) this.escolherTripla();
        else if (m.index === 6) this.escolherJuntar();
        else if (m.index === 7) this.escolherFusao("inverter");
        else { this.menu = null; Audio2.cancel(); }
      }
      return;
    }
    if (m.type === "portal") return this.updatePortal(m);
    if (m.type === "chat") {                   // digitando no chat: ENTER manda, ESC desiste
      if (!Texto.ativo()) { this.menu = null; return; }
      if (!Texto.estado()) return;
      const escrito = Texto.termina();
      this.menu = null;
      if (escrito && escrito.trim()) { Online.falar(escrito); Audio2.select(); }
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
    if (m.type === "juntar") {
      const n = m.lista.length;
      if (!n) { this.menu = { type: "genoma", index: 6 }; return; }
      m.index = Math.min(m.index, n - 1);
      if (Input.consume("up")) { m.index = (m.index + n - 1) % n; Audio2.blip(); }
      if (Input.consume("down")) { m.index = (m.index + 1) % n; Audio2.blip(); }
      if (Input.consume("b")) {
        Audio2.cancel();
        this.menu = m.base ? { type: "juntar", index: 0, lista: comPar(this.st.party) } : { type: "genoma", index: 6 };
        return;
      }
      if (Input.consume("a")) {
        const escolhido = m.lista[m.index];
        Audio2.select();
        if (!m.base) this.menu = { type: "juntar", index: 0, base: escolhido, lista: this.st.party.filter((o) => juntavel(escolhido, o)) };
        else this.confirmaJuntar(m.base, escolhido);
      }
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
        if (m.type === "fusaoCorpo" && m.modo === "tripla" && m.meio) {
          // a tripla volta um passo: escolher o MEIO de novo
          this.menu = { type: "fusaoCorpo", index: 0, cabeca: m.cabeca, modo: "tripla", variante: 0,
                        lista: this.st.party.filter((mon) => mon !== m.cabeca && fundivel(mon)) };
        } else if (m.type === "fusaoCorpo") {
          this.menu = { type: "fusaoCabeca", index: 0, modo: m.modo,
                        lista: m.modo && m.modo !== "tripla" ? [...this.st.party] : this.st.party.filter(fundivel) };
        } else if (m.modo === "concurso") this.menu = null;   // o concurso não é a máquina
        else this.menu = { type: "genoma", index: 0 };
        return;
      }
      // C passa pelas fusões daquela dupla: a automática (ou a sua ficha), as
      // que já vêm no jogo e as que jogadores publicaram
      if (m.type === "fusaoCorpo") {
        const alvo = m.lista[m.index];
        const vs = !alvo ? []
          : m.modo !== "tripla" ? variantes(m.cabeca.species, alvo.species)
          : m.meio ? variantes(m.cabeca.species, m.meio.species, alvo.species) : [];
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
          if (jaFundido && m.modo && m.modo !== "tripla") {   // esse já é uma fusão: vale pela dupla dele
            if (jaFundido.pernas) { Audio2.cancel(); return void this.dlg.say(DB.STORY.fusao.triplaNaOficina); }
            if (m.modo === "oficina") return void this.editarFicha(jaFundido.cabeca, jaFundido.corpo);
            return void this.entrarNoPalco(jaFundido.cabeca, jaFundido.corpo, jaFundido.variante);
          }
          if (!fundivel(escolhido)) { Audio2.cancel(); return void this.dlg.say(DB.STORY.fusao.jaFundido); }
          Audio2.select();
          this.menu = {
            type: "fusaoCorpo", index: 0, cabeca: escolhido, modo: m.modo, variante: 0,
            lista: m.lista.filter((mon) => mon !== escolhido && fundivel(mon)),
          };
        } else if (m.type === "fusaoCorpo" && m.modo === "tripla") {
          Audio2.select();
          if (!m.meio) {                          // escolheu o MEIO: agora as PERNAS
            this.menu = { type: "fusaoCorpo", index: 0, cabeca: m.cabeca, meio: escolhido, modo: "tripla", variante: 0,
                          lista: m.lista.filter((mon) => mon !== escolhido) };
          } else {
            const vs = variantes(m.cabeca.species, m.meio.species, escolhido.species);
            this.confirmaTripla(m.cabeca, m.meio, escolhido, vs[m.variante || 0]?.variante || "");
          }
        } else if (m.type === "fusaoCorpo") {
          const vs = variantes(m.cabeca.species, escolhido.species);
          const v = vs[m.variante || 0]?.variante || "";
          if (m.modo === "oficina") this.editarFicha(m.cabeca.species, escolhido.species);
          else if (m.modo === "concurso") this.entrarNoPalco(m.cabeca.species, escolhido.species, v);
          else this.confirmaFusao(m.cabeca, escolhido, v);
        } else if (m.modo === "versao") this.escolherVersao(escolhido);
        else if (m.modo === "inverter") this.inverter(escolhido);
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
      if (Input.consume("a")) { Audio2.select(); this.ensinarGolpe(m.mon, m.novo, m.index, m.depois || null); }
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
      if (Input.consume("select")) { m.cor = (m.cor + 1) % 2; Audio2.select(); }   // tecla C
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
      const n = 15;
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
      if (lado && m.index === 10) { this.mudaSuave(lado); Audio2.blip(); }
      // DIFICULDADE (é do save): ← → anda, Z vai pra próxima
      if (lado && m.index === 8) { mudarDificuldade(this.st, lado); Audio2.blip(); }
      // BATALHA: POR TURNO, TEMPO REAL (src/systems/batalhareal.js) ou EXPLOSIVA
      // (src/systems/batalhaexplosiva.js) — é do save
      if (lado && m.index === 9) { this.mudaEstiloBatalha(lado); Audio2.blip(); }
      // ESTILO DE TROCA (como no FireRed): ALTERNAR ou SET (src/scenes/battle.js `perguntaTroca`)
      const trocaEstilo = () => Opcoes.set("estiloTroca", Opcoes.get("estiloTroca") === "set" ? "alternar" : "set");
      if (lado && m.index === 11) { trocaEstilo(); Audio2.blip(); }
      // FPS: de 30 a 2.000 (o laço do src/main.js lê a opção)
      const mudaFps = (d) => { const L = FPS_OPCOES, i = Math.max(0, L.indexOf(Opcoes.get("fps") || 60)); Opcoes.set("fps", L[(i + d + L.length) % L.length]); };
      if (lado && m.index === 13) { mudaFps(lado); Audio2.blip(); }
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
        else if (m.index === 8) {
          // Z dá a volta: do QUASE IMPOSSÍVEL volta pro BEBÊ
          const i = DIFICULDADES.indexOf(dificuldadeDe(this.st));
          this.st.dificuldade = DIFICULDADES[(i + 1) % DIFICULDADES.length].id;
        }
        else if (m.index === 9) this.mudaEstiloBatalha(1);
        else if (m.index === 10) this.mudaSuave(1);
        else if (m.index === 11) trocaEstilo();
        // MODO FUSÃO (src/data/modo-fusao): todo selvagem nasce fundido
        else if (m.index === 12) this.st.flags.modoFusao = !this.st.flags.modoFusao;
        else if (m.index === 13) mudaFps(1);
        else { Save.clear(); this.menu = null; this.dlg.say("SAVE APAGADO. RECARREGUE A PÁGINA."); }
      }
    }
  }

  /** OPÇÕES → TELA SUAVE: de meio em meio, de 0 (OFF) a 5,5; Z passa do 5,5 pro 0 */
  mudaSuave(lado) {
    const passos = NIVEL_MAX * 2 + 1;
    const i = Math.round(nivelSuave(Opcoes.get("suave")) * 2);
    Opcoes.set("suave", (((i + lado) % passos) + passos) % passos / 2);
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

    const artChao = mapArt(this.st.player.map);
    // no isométrico, Braglitch usa o chão com as árvores pintadas (as 3D são daqui de baixo)
    const art = (isoLigado() && artChao?.comArvores) || artChao;
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
      if (this.map?.ligaTech) this.desenharSalaDaLiga(ctx, cx, cy);
      if (this.map?.ligaBrag) desenharLigaBrag(this, ctx, cx, cy);
      if (this.map?.ligaVoid) desenharLigaVoid(this, ctx, cx, cy);
      if (this.map?.arvoreOca) desenharArvore(this, ctx, cx, cy);

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
      this.desenharPosPosChao(ctx, cx, cy);
      this.desenharPontes(ctx, cx, cy);
      desenharRouboChao(this, ctx, cx, cy);      // os buracos do tornado e os MACHOKES arrumando
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
    // O SELVAGEM 3D nadando (src/data/selvagem3d.js, src/core/modelo3d.js)
    { const s = this.solto3d, S = s && SELVAGENS_3D.find((x) => x.id === s.id);
      if (S) actors.push({ x: s.x, y: s.y, semSombra: true, draw: () => desenharModelo(ctx, S.especie, s.x * TILE - cx + 8, s.y * TILE - cy + 4,
        { comprimento: S.comprimento, angulo: s.ang, boia: Math.sin(s.t * 1.6) * 2.5, t: s.t }) }); }
    // a LÁPIDE do BRASEAGLE (src/data/zerogle.js), depois do enterro
    if ((this.st.flags?.zerogle || 0) >= 3 && this.st.player.map === ZEROGLE.lapide.mapa) {
      actors.push({ x: ZEROGLE.lapide.x, y: ZEROGLE.lapide.y, semSombra: true, draw: (c = ctx) => this.desenharLapideZerogle(c, cx, cy) });
      if (this.st.flags.zerogleViu) actors.push({ x: ZEROGLE.fantasma.x, y: ZEROGLE.fantasma.y + 0.01, semSombra: true, draw: (c = ctx) => this.desenharZerogle(c, cx, cy) });
    }
    // o RATICATE do AZUL: no reencontro, ou depois, do lado dele na lápide
    { const rr = this.raticateDoRival();
      if (rr) actors.push({ x: rr.x, y: rr.y, ax: rr.x, ay: rr.y, draw: (c = ctx) => this.desenharReencontro(c, rr, cx, cy) }); }
    // OS SELVAGENS À VISTA e o COMPANHEIRO entram na MESMA lista de atores que
    // o resto: assim eles passam por trás e pela frente das coisas na ordem
    // certa, em vez de flutuarem por cima do mundo.
    for (const b of this.selvagens || []) {
      actors.push({ x: b.x, y: b.y, dir: this.rumoDoSelvagem(b), draw: (c = ctx) => this.drawSelvagem(c, b, cx, cy) });
    }
    atoresDaLuta(this, actors, ctx, cx, cy);      // quem está na LUTA NO MAPA
    const segue = this.quemSegue();
    // onde o companheiro (ou o dono) está DESENHADO: no meio do passo, como você
    const kc = this.move ? this.move.n / this.move.total : (this.compaK ?? 1);
    const ondeCompa = () => {
      const c = this.compa, q = this.compaNoRastro();
      if (q) return { x: q.x / TILE, ax: q.x / TILE, ay: q.y / TILE, d: (q.x + q.y) / TILE, dir: q.dir };
      const ax = c.de.x + (c.x - c.de.x) * kc, ay = c.de.y + (c.y - c.de.y) * kc;
      return { x: ax, ax, ay, d: ax + ay, dir: c.dir || "down" };
    };
    // (dormindo ele está lá em cima: ninguém te segue até de manhã)
    if (this.st.capturado && !this.st.capturado.naBola && !this.st.capturado.dormindo
        && this.compa && !this.st.surfando && !this.st.voando) {
      // CAPTURADO: quem te segue é o seu dono, com a bola na mão
      actors.push({ ...ondeCompa(), y: this.compa.y, draw: (c = ctx) => this.drawDono(c, cx, cy) });
    } else if (segue && this.compa && !this.st.surfando && !(this.gigante?.visita && segue.species === this.gigante.id)
               && !(this.st.voando && segue.species === this.st.montaria)) {
      // na ordem de quem está mais embaixo na tela: andando livre ele fica entre os tiles
      const oc = ondeCompa();
      actors.push({ ...oc, y: this.compaNoRastro() ? oc.ay : this.compa.y, draw: (c = ctx) => this.drawCompanheiro(c, segue, cx, cy) });
    }
    for (const o of this.arvoresAqui()) {
      const [ox, oy] = o.split(",").map(Number);
      actors.push({ x: ox, y: oy, semSombra: true, draw: (c = ctx) => c.drawImage(Assets.arvorezinha, ox * TILE - cx, oy * TILE - cy, TILE, TILE) });
    }
    // o CAMINHÃO DO MEW, na fila de quem está em pé (2 tiles de largura, mais alto que um tile)
    { const af = !iso && this.st.player.map === CAMINHAO.mapa && this.caminhaoAfundando;
      if (af) {
        af.t += 1 / 60;
        if (af.t > 1.6) this.caminhaoAfundando = null;
        else actors.push({ x: af.x, y: af.y, semSombra: true, draw: (c = ctx) => {
          const im = desenhoCaminhao(), desce = Math.min(im.height, Math.round(af.t * 16)), X = af.x * TILE - cx, Y = (af.y + 1) * TILE - cy;
          // só a parte que ainda está fora d'água
          if (im.height - desce > 0) c.drawImage(im, 0, 0, im.width, im.height - desce, X, Y - im.height + desce, im.width, im.height - desce);
          // os espirros
          c.fillStyle = "#ffffff";
          for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI, r = 4 + af.t * 26;
            c.fillRect(Math.round(X + 16 + Math.cos(a) * r * 1.2), Math.round(Y - 4 - Math.sin(a) * r * (1.2 - af.t * 0.6)), 2, 2); }
          c.fillStyle = "#a0d8f8"; c.fillRect(X - 2, Y - 3, 36, 2);
        } });
      } }
    { const cm = !iso && this.caminhaoAqui();
      if (cm) actors.push({ x: cm.x, y: cm.y, semSombra: true, draw: (c = ctx) => { const im = desenhoCaminhao(); c.drawImage(im, cm.x * TILE - cx, (cm.y + 1) * TILE - cy - im.height); } }); }
    // AS ÁRVORES 3D DE BRAGLITCH (src/core/arvore3d.js): uma por uma, na fila de
    // quem está em pé — pelo pé delas, então quem passa atrás fica escondido pela
    // copa e quem passa na frente fica por cima. Inclinam pra fora do meio da tela.
    const arvores3d = !iso && (this.geo?._arvoresFR || arvoresDoMapa(this.st.player.map));   // (e as de KANTO, src/core/arvoreskanto.js)
    this._copasNaTela = [];
    if (arvores3d) {
      const mx = cx + W / 2, my = cy + H / 2;
      for (const a of arvores3d) {
        const X = a.x * TILE, base = (a.y + a.alt) * TILE;
        if (X > cx + W + 40 || X + a.larg * TILE < cx - 40 || base - 100 > cy + H || base < cy - 20) continue;
        // onde a copa dela está na tela: é de lá que o vento arranca as folhas
        this._copasNaTela.push({ x: X - cx, y: base - cy - (a.alt + 1) * TILE, w: a.larg * TILE });
        actors.push({ x: a.x, y: a.y + a.alt - 1, semSombra: true, draw: (c = ctx) => {
          const spr = Assets.blocosFR()[a.tipo];
          // O VENTO (pedido do CAIO): ela balança — a rajada empurra pra direita
          // e cada árvore balança no tempo dela
          // as grandes de Braglitch são mais grossas; as da FLORESTA DE VIRIDIAN são
          // árvores normais, com as camadas de sempre (o CAIO)
          const grossa = a.tipo === "arvore" && !!this.geo?.braglitch;
          const { img, ox, oy } = arvore3d(a.tipo, mx - (X + spr.width / 2), my - base, this.ventoDaArvore(a.x), grossa ? CAMADAS_GRANDE : CAMADAS_NORMAL);
          c.drawImage(img, X - cx + ox, base - spr.height - cy + oy);
        } });
      }
    }
    // a árvore que acabou de ser cortada: os quadros do corte, 0,13 s cada
    const ca = this.corteArvore;
    if (ca) {
      const k = Math.floor((performance.now() - ca.t0) / 130);
      const img = ca.mapa === this.st.player.map && Assets.arvorezinhaCorte?.[k];
      if (img) actors.push({ x: ca.x, y: ca.y, semSombra: true, draw: (c = ctx) => c.drawImage(img, ca.x * TILE - cx, ca.y * TILE - cy, TILE, TILE) });
      else this.corteArvore = null;
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
    // VOANDO você passa por cima de tudo (copa, telhado, gente): fica fora da
    // fila e é desenhado depois da camada de cima
    const noAr = this.st.voando && !iso;
    if (!noAr) actors.push({ x: this.st.player.x, y: ipy / TILE, ax: ipx / TILE, ay: ipy / TILE, dir: this.st.player.dir,
                  draw: (c = ctx) => this.drawPlayer(c, px - cx, py - cy) });
    // camada de cima: o jogador passa POR TRÁS de copa de árvore, telhado, batente
    // (no isométrico quem esconde o jogador são os próprios blocos).
    // A camada vai FILEIRA POR FILEIRA, no meio dos atores: a fileira k do
    // telhado tapa quem está na fileira k ou acima dela (atrás), mas não quem
    // está mais embaixo (na frente). Assim um bicho ALTO (o ETERNATUS andando)
    // na frente do prédio não tem a cabeça tapada pelo telhado de trás.
    // na SALA DA LIGA a camada de cima é a da sala da vez (as colunas de gelo
    // da LORELEI viram as de pedra do BRUNO...), e durante a troca o chão de
    // cima cai junto (some)
    const over = !iso && (this.map?.ligaTech ? this.overDaLiga() : mapOverlay(this.st.player.map));
    let fileiraOver = Math.floor(cy / TILE) - 1;
    const fimOver = Math.ceil((cy + H) / TILE) + 1;
    const overAte = (k) => {
      if (!over) return;
      for (; fileiraOver <= Math.min(k, fimOver); fileiraOver++) {
        const yy = fileiraOver * TILE;
        if (yy < 0 || yy >= over.height) continue;
        if (this.ligaTroca) {
          // na CENA: cada fileira da camada de cima só com a parte dela inteira
          // (a parede de cima, os topos dos pilares, o teto da entrada)
          const parte = fileiraOver <= 2 ? "paredes" : fileiraOver >= 11 ? "teto" : "pilares";
          if (!this.parteProntaDaLiga(parte)) continue;
        }
        ctx.drawImage(over, 0, yy, over.width, TILE, -cx, yy - cy, over.width, TILE);
      }
    };
    if (iso) this.desenharIso(ctx, iso, art, actors, cx, cy);
    // a fileira LOGO ACIMA de cada um ainda tapa (é o telhado/beirada que a
    // cabeça de quem está na porta passa por baixo, como no FireRed — senão o
    // cabelo do OAK aparecia em cima do telhado do laboratório); só o que é
    // mais alto que isso (o ETERNATUS) passa por cima das fileiras de trás
    else actors.sort((a, b) => a.y - b.y).forEach((a) => { overAte(Math.round(a.y) - 2); a.draw(); });

    this.drawCaboDoBondinho(ctx, cx, cy, iso);
    overAte(fimOver);
    if (noAr) this.drawPlayer(ctx, px - cx, py - cy);

    // O BRILHO DE QUEM SUMIU (o ABRA se teletransportando): estrelinhas
    // abrindo pra fora e sumindo em meio segundo
    if (this.brilhosSumiu?.length) {
      const agora = performance.now();
      this.brilhosSumiu = this.brilhosSumiu.filter((e) => agora - e.t0 < 600 && e.mapa === this.st.player.map);
      for (const e of this.brilhosSumiu) {
        const k = (agora - e.t0) / 600, X = e.x * TILE - cx + 8, Y = e.y * TILE - cy + 4;
        ctx.fillStyle = k < 0.5 ? "#fff8c0" : "#c8a0ff";
        for (let i = 0; i < 8; i++) {
          const a = i * Math.PI / 4 + k * 2, r = 2 + k * 14;
          ctx.fillRect(Math.round(X + Math.cos(a) * r), Math.round(Y + Math.sin(a) * r * 0.8), 2, 2);
        }
        if (k < 0.3) { ctx.globalAlpha = 1 - k / 0.3; ctx.fillStyle = "#ffffff"; ctx.fillRect(X - 3, Y - 8, 6, 14); ctx.globalAlpha = 1; }
      }
    }

    if (!iso) this.drawFolhas(ctx);
    desenharLuta(this, ctx, cx, cy);              // os números, a bola e o painel da LUTA NO MAPA
    if (this.assobio) this.drawAssobio(ctx, cx, cy);
    if (this.cenaBill && !iso) this.drawCenaBill(ctx, cx, cy);
    else if (!iso && this.st.player.map === "route25_sea_cottage" && this.st.flags.billCasoAtivo && BILL_CASOS[this.st.flags.billCasos || 0]?.noCano)
      this.drawWailordNoCano(ctx, cx, cy, 1);
    if (this.rustle && !iso) {
      const f = Math.min(2, Math.floor(this.rustle.t / 0.12));
      ctx.drawImage(Assets.rustle[f], this.rustle.x * TILE - cx, this.rustle.y * TILE - cy);
    }

    // O escuro (céu de noite ou caverna) com as lanternas abrindo buraco nele.
    // Vai por cima do mundo e dos bichos, e por baixo de tudo que é interface:
    // escurecer o mapa é o efeito; escurecer a caixa de texto seria só deixar o
    // jogo difícil de ler. Na fenda o escuro é outro assunto.
    if (this.st.player.map !== "glitchdim") this.drawEscuro(ctx, cx, cy);
    if (this.map?.submerso) this.drawSubmerso(ctx, cx, cy);
    this.desenharPosPosCeu(ctx);
    this.drawChat(ctx);
    // o rastro das células do ZYGARDE brilha por cima do escuro do túnel
    if (!iso) this.drawRastroZygarde(ctx, cx, cy);
    // com o céu aberto o mapa não aparece: o desenho é opaco e cobre tudo
    if (this.olhando) this.drawCeu(ctx);
    // um GIGANTE em 3D passando por cima de tudo (e fazendo sombra no chão)
    const g = this.gigante;
    if (g?.tipo === "chao") {
      // um REGI subindo da terra logo ATRÁS da placa (um tile acima dela):
      // em cima dela ele cobriria quem está encostando a mão
      let px = g.x * TILE + TILE / 2 - cx, py = g.y * TILE - cy - 2;
      if (iso) {
        const q = naTela(iso, g.x * TILE + TILE / 2, (g.y - 1) * TILE + TILE / 2);
        px = q.x; py = q.y - ISO_PE - this.zIso(g.x, g.y);
      }
      desenharRegi(ctx, g.id, g, px, py);
    } else if (g && g.fase !== "pausa") {
      desenharGigante(ctx, g.id, g.fase === "passa" ? "passa" : "volta", g.t, !this.olhando);
    }
    if (this.zygCena) this.drawZygCena(ctx, cx, cy);
    if (this.cenaMiniors) this.desenhaMiniors(ctx);
    if (!this._iso) this.desenhaPortaDaBase(ctx, cx, cy);
    if (!this._iso) this.desenhaFonte(ctx, cx, cy);
    if (!this._iso) this.desenhaBrilhos(ctx, cx, cy);
    // os UNOWN de evento soletrando no céu (src/systems/unownfrase.js)
    if (!this.map?.interior) desenharUnownFrase(ctx, this.st.player.map);

    // o efeito do sanduíche, enquanto vale: sem isto ele seria um texto que
    // aconteceu uma vez e nunca mais se soube
    const b = buff(this.st);
    if (b?.hud) {
      panel(ctx, 4, 4, 58, 18);
      drawText(ctx, `${b.hud} ${Math.ceil(minutosDoBuff(this.st))}M`, 9, 9, PAL.ink);
    }

    const left = this.st.mission?.left;
    if (left > 0 && this.naFenda()) {
      const mm = Math.floor(left / 60), ss = Math.floor(left % 60);
      const txt = `FENDA ${mm}:${String(ss).padStart(2, "0")}`;
      panel(ctx, W - 72, 4, 68, 18);
      drawText(ctx, txt, W - 66, 9, left < 30 ? "#e0524a" : PAL.ink);
    }

    // os BRAÇOS ROBÓTICOS da Liga de Braglitch vêm do teto: por cima de tudo
    if (this.ligaBragTroca) desenharBracosLigaBrag(this, ctx, cx, cy);
    if (this.map?.arvoreOca) desenharGuzzlord(this, ctx, cx, cy);
    if (sacode) ctx.restore();
    if (this.clarao > 0) fade(ctx, this.clarao, "#ff5566");
    if (this.flashLiga > 0) fade(ctx, this.flashLiga, "#ffffff");   // a sala da Liga piscando
    if (this.omelete) this.desenharOmelete(ctx);                       // o omelete da MÃE
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
    for (const f of DB.GANCHOS?.hud || []) f(ctx, this.st, { panel, drawText, bar, PAL, W, H, cena: this });
    if (this.banner > 0) this.drawBanner(ctx);
    else if ((this.paradoT || 0) > 1) this.drawObjetivo(ctx);
    if (this.viagemBondinho) this.drawBondinho(ctx);
    if (this.viagemLancha) this.drawLancha(ctx);
    if (this.menu) this.drawMenu(ctx);
    if (this.estojoAte && performance.now() < this.estojoAte) desenharEstojo(ctx, this.st, DB, 4, 4, drawText);
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

  /** O QUADRO DE ANDAR (com o MEIO PASSO, ideia do CAIO): cada passo é
   *  meio → passo → meio → parado, um quarto do passo cada. `perna` diz qual
   *  pé (1 = passo A, 0 = passo B) e `k` vai de 0 a 1 no passo. Os quadros 4 e
   *  5 são o meio A e o meio B (assets/sprites/overworld/meio/, feitos por
   *  tools/andar_meio.py); boneco sem eles usa o passo no lugar. */
  quadroAndar(set, perna, k) {
    const passo = set[perna ? 1 : 3], meio = set[perna ? 4 : 5] || passo;
    return [meio, passo, meio, set[0]][Math.min(3, Math.floor((k || 0) * 4))];
  }
  /** O mesmo, contando em tiles andados (`t`): cada passo (meio → passo →
   *  meio → parado) dura ANDAR_TILES tiles, e a perna troca a cada passo.
   *  Com 1 tile ficou rápido demais (o CAIO achou, nov/2026) — por isso 2. */
  quadroAndarT(set, t) {
    const v = (((t / ANDAR_TILES) % 2) + 2) % 2;
    return this.quadroAndar(set, v < 1 ? 1 : 0, v % 1);
  }
  /** O passo do herói (e de quem anda junto com ele) no tile de agora */
  kPasso() { return this.move ? this.move.n / this.move.total : 0; }

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
      rumo.andouEm = performance.now();
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
  /** OPÇÕES > BATALHA: POR TURNO -> TEMPO REAL -> EXPLOSIVA (e volta) */
  mudaEstiloBatalha(lado = 1) {
    const f = this.st.flags;
    const estilos = ["turno", "real", "explosiva"];
    const agora = f.batalhaExplosiva ? 2 : f.batalhaReal ? 1 : 0;
    const novo = estilos[(agora + lado + 3) % 3];
    f.batalhaReal = novo === "real";
    f.batalhaExplosiva = novo === "explosiva";
  }

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

  /** A ENTRADA DA BATALHA. A música da batalha já começa aqui, junto com a
   *  animação (e a cena da batalha não reinicia ela: ver `estaTocando`).
   *  `tipo`: "selvagem" (redemoinho), "treinador" (VS com os dois retratos) ou
   *  "chefe" (a tela racha). `b` é o que a batalha vai receber — é dele que sai
   *  a música (src/systems/musicabatalha.js) e o retrato do treinador. A
   *  batalha em grupo não tem música glitch: pra ela vai `glitch: false`. */
  entrarEmBatalha(tipo, b, cb) {
    const nome = b.descontrolada ? "megaDescontrolada" : b.glitch ? "batalhaGlitch"
      : musicaDaBatalha(b, this.st.player.map);
    Audio2.playMusic(nome, DB.MUSIC?.[nome] || DB.MUSIC?.batalha);
    // a MÚSICA DA CONVERSA do treinador acaba aqui: a de batalha tomou o lugar.
    // Sem isso, no instante entre a entrada acabar e a batalha abrir, o mapa via
    // a conversa terminada e voltava a música do lugar — e a batalha começava a
    // dela DE NOVO, do começo (o CAIO: "faz a música de batalha não recomeçar")
    this.musicaConversa = null;
    if (b.trainer?.sprite) trainerArt(b.trainer.sprite);      // começa a carregar já
    this.fx = { t: 0, tipo, dur: ENTRADA[tipo] || 0.95, b, cb, semente: 1 + Math.floor(Math.random() * 1e9) };
    if (tipo === "chefe") Glitch.hit(1.5);
  }

  /** Entrada de batalha. Sem tipo (viagem, porta...) são os três flashes e as
   *  barras fechando de sempre. */
  drawBattleFx(ctx) {
    const t = this.fx.t;
    if (this.fx.tipo === "selvagem") return this.entradaSelvagem(ctx, t);
    if (this.fx.tipo === "treinador") return this.entradaTreinador(ctx, t);
    if (this.fx.tipo === "chefe") return this.entradaChefe(ctx, t);
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

  /** O ULTRA BURACO (evento de ULTRA RAIDS): um buraco redondo no ar, com
   *  anéis de luz girando pra dentro e confete de Carnaval saindo dele. */
  drawUltraBuraco(ctx, x, y) {
    const t = performance.now() / 1000;
    const cx = x + 8, cy = y - 4;
    const aneis = ["#ffe46a", "#ff6ad5", "#6ae8ff", "#b455ff", "#ffffff"];
    for (let i = 0; i < 5; i++) {
      const r = 11 - i * 2 + Math.sin(t * 3 + i) * 0.8;
      ctx.fillStyle = aneis[(i + Math.floor(t * 6)) % aneis.length];
      ctx.beginPath(); ctx.ellipse(cx, cy, r, r * 1.15, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = "#0a0810";
    ctx.beginPath(); ctx.ellipse(cx, cy, 3, 3.5, 0, 0, Math.PI * 2); ctx.fill();
    // o confete: sai girando do buraco e cai
    const confete = ["#ffe46a", "#ff6ad5", "#6ae8ff", "#7dff7a", "#ff8a3a"];
    for (let i = 0; i < 10; i++) {
      const k = (t * 0.8 + i / 10) % 1;
      const a = i * 2.4;
      ctx.fillStyle = confete[i % confete.length];
      ctx.fillRect(Math.round(cx + Math.cos(a) * (6 + k * 10)), Math.round(cy + Math.sin(a) * 4 + k * 14), 1 + (i % 2), 1);
    }
  }

  /** SELVAGEM: dois piscos e o REDEMOINHO — braços pretos girando em volta de
   *  você, cada vez mais grossos, até a tela fechar. */
  entradaSelvagem(ctx, t) {
    if (t < 0.25) {
      if (Math.floor(t / 0.0625) % 2 === 0) { ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.fillRect(0, 0, W, H); }
      return;
    }
    const k = Math.min(1, (t - 0.25) / (ENTRADA.selvagem - 0.35));
    const BRACOS = 4, B = 4, giro = t * 7, cx = W / 2, cy = H / 2;
    const fatia = (Math.PI * 2) / BRACOS;
    ctx.fillStyle = "#000";
    for (let y = 0; y < H; y += B) {
      for (let x = 0; x < W; x += B) {
        const dx = x + B / 2 - cx, dy = y + B / 2 - cy;
        const r = Math.hypot(dx, dy);
        // o ângulo torce com a distância: é isso que faz o braço virar espiral
        let a = (Math.atan2(dy, dx) + r * 0.045 - giro) % fatia;
        if (a < 0) a += fatia;
        // a borda fecha antes do meio: você é o último a sumir
        const cheio = k * 1.35 - (1 - r / 145) * 0.35;
        if (a / fatia < cheio) ctx.fillRect(x, y, B, B);
      }
    }
  }

  /** TREINADOR: duas faixas atravessam a tela — você na de cima, ele na de
   *  baixo —, o VS cai no meio, e as barras fecham. */
  entradaTreinador(ctx, t) {
    const D = ENTRADA.treinador;
    if (t < 0.2) {
      if (Math.floor(t / 0.05) % 2 === 0) { ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.fillRect(0, 0, W, H); }
      return;
    }
    const entra = Math.min(1, (t - 0.2) / 0.3), sai = Math.max(0, (t - (D - 0.35)) / 0.35);
    const vai = 1 - (1 - entra) ** 3;                         // chega rápido e freia
    ctx.fillStyle = `rgba(0,0,0,${0.55 * entra})`;
    ctx.fillRect(0, 0, W, H);
    const faixa = (y, cor, deEsquerda) => {
      const x = deEsquerda ? -W + vai * W : W - vai * W;
      ctx.save();
      ctx.translate(x, 0);
      ctx.fillStyle = cor;
      ctx.beginPath();                                       // a faixa é torta
      ctx.moveTo(-20, y + 6); ctx.lineTo(W + 20, y - 6); ctx.lineTo(W + 20, y + 52); ctx.lineTo(-20, y + 64);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.25)";
      ctx.fillRect(-20, y + 3, W + 40, 2);
      ctx.restore();
      return x;
    };
    const x1 = faixa(14, "#2f6fd8", true), x2 = faixa(86, "#d8402f", false);
    // você: o boneco do mapa, grandão
    const eu = Assets.actor("hero")?.down?.[0];
    if (eu) {                                                 // cabe na faixa de cima
      const k = eu.height <= 32 ? 2 : 1;                      // o pé na beira da faixa
      ctx.drawImage(eu, Math.round(x1 + 30), 66 - eu.height * k, eu.width * k, eu.height * k);
    }
    drawText(ctx, (this.st.player?.name || "VOCÊ").toUpperCase(), Math.round(x1 + 84), 40, "#fff");
    // ele: o retrato da batalha, ou o boneco do mapa se o retrato não veio
    const tr = this.fx.b.trainer || {};
    const art = trainerArt(tr.sprite);
    const x2r = Math.round(x2 + W - 84);
    if (art) ctx.drawImage(art, x2r, 90, 56, Math.round(56 * (art.height / art.width)));
    else {
      const npc = Assets.actor(tr.sprite)?.down?.[0];
      if (npc) {
        const k = npc.height <= 32 ? 2 : 1;
        ctx.drawImage(npc, x2r + 10, 140 - npc.height * k, npc.width * k, npc.height * k);
      }
    }
    drawText(ctx, (tr.name || "TREINADOR").toUpperCase().slice(0, 14), Math.round(x2 + 20), 118, "#fff");
    // o VS cai do alto e quica
    if (t > 0.45) {
      const q = Math.min(1, (t - 0.45) / 0.2);
      const esc = q < 1 ? 3 - 2 * q : 1 + Math.sin((t - 0.65) * 30) * 0.08 * Math.max(0, 1 - (t - 0.65) * 3);
      ctx.save();
      ctx.translate(W / 2, H / 2 + 2);
      ctx.scale(esc, esc);
      ctx.fillStyle = "#000";
      ctx.fillRect(-15, -9, 30, 18);
      ctx.fillStyle = "#f8d030";
      ctx.fillRect(-14, -8, 28, 16);
      drawText(ctx, "VS", -6, -4, "#000");
      ctx.restore();
    }
    if (sai > 0) {
      const bar = Math.ceil(sai * (H / 2));
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, bar);
      ctx.fillRect(0, H - bar, W, bar);
    }
  }

  /** CHEFE: a tela treme e fica vermelha, as rachaduras saem do meio, o "!!"
   *  pisca — e os cacos caem, um de cada vez, até sobrar só o preto. */
  entradaChefe(ctx, t) {
    const D = ENTRADA.chefe;
    let s = this.fx.semente;
    const r = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
    const cx = W / 2 + (r() - 0.5) * 40, cy = H / 2 + (r() - 0.5) * 24;
    // as rachaduras: oito, em volta, cada uma um caminho torto até a borda
    const RAIOS = 8, rachas = [];
    for (let i = 0; i < RAIOS; i++) {
      const a = (i / RAIOS) * Math.PI * 2 + (r() - 0.5) * 0.5;
      const pts = [[cx, cy]];
      for (let p = 1; p <= 7; p++) {
        const d = p * 24, b = a + (r() - 0.5) * 0.5;
        pts.push([cx + Math.cos(b) * d, cy + Math.sin(b) * d]);
      }
      rachas.push(pts);
    }
    // o tremor: a tela inteira de agora, desenhada de novo deslocada
    const treme = t < D - 0.5 ? 3 : 0;
    if (treme) {
      const dx = Math.round((Math.random() - 0.5) * treme * 2), dy = Math.round((Math.random() - 0.5) * treme * 2);
      try { ctx.drawImage(ctx.canvas, dx * (ctx.canvas.width / W), dy * (ctx.canvas.height / H), ctx.canvas.width, ctx.canvas.height, 0, 0, W, H); } catch { /* sem tela pra copiar */ }
    }
    // vermelho subindo e batendo
    const pulso = 0.5 + 0.5 * Math.abs(Math.sin(t * 14));
    ctx.fillStyle = `rgba(200,0,24,${Math.min(0.55, t * 1.2) * pulso})`;
    ctx.fillRect(0, 0, W, H);
    // as rachaduras crescem do meio pra fora
    const cresce = Math.min(1, Math.max(0, (t - 0.15) / 0.55));
    const quebra = Math.max(0, (t - 0.85) / (D - 0.95));
    for (const pts of rachas) {
      const n = Math.max(1, Math.round(cresce * (pts.length - 1)));
      ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i <= n; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.strokeStyle = "#000"; ctx.lineWidth = 3; ctx.stroke();
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 1; ctx.stroke();
    }
    // os cacos (entre uma rachadura e a próxima) ficam pretos e caem
    if (quebra > 0) {
      for (let i = 0; i < RAIOS; i++) {
        const quando = ((i * 5) % RAIOS) / RAIOS * 0.7;      // fora de ordem
        const q = Math.min(1, Math.max(0, (quebra - quando) / 0.3));
        if (q <= 0) continue;
        const a = rachas[i], b = rachas[(i + 1) % RAIOS];
        ctx.save();
        ctx.translate(0, q * q * 30);
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        for (const [x, y] of a) ctx.lineTo(x, y);
        for (let j = b.length - 1; j >= 0; j--) ctx.lineTo(b[j][0], b[j][1]);
        ctx.fill();
        ctx.restore();
      }
      if (quebra >= 1) { ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H); }
    }
    // o !! no meio, piscando
    if (t > 0.3 && t < D - 0.2 && Math.floor(t * 10) % 2 === 0) {
      ctx.save();
      ctx.translate(Math.round(cx), Math.round(cy - 4));
      ctx.scale(2, 2);
      drawText(ctx, "!!", -5, -4, "#fff");
      ctx.restore();
    }
    // a cada rachadura nova, um tranco
    const etapa = Math.floor(cresce * 7);
    if (etapa !== this.fx.etapa) {
      this.fx.etapa = etapa;
      if (etapa > 0 && etapa < 7) { Glitch.hit(0.6); Audio2.noise(0.05, 0.4); }
    }
  }

  /** O ASSOBIO (pedido do CAIO, nov/2026): V, e os Pokémon bravos e curiosos do
   *  mato vêm até você (src/systems/selvagens.js, `chamar`). Uma vez a cada 4 s. */
  assobiar() {
    const agora = performance.now() / 1000;
    if (agora < (this.assobioEspera || 0) || this.st.surfando || this.st.voando) return;
    this.assobioEspera = agora + 4;
    // fiu-fiuuu: sobe rápido, desce e sobe de novo
    [[1568, 0], [2093, 110], [1760, 300], [2349, 400]].forEach(([f, ms]) => setTimeout(() => Audio2.tone(f, 0.11, "sine", 0.35), ms));
    // ele para, olha pra frente e leva a mão na boca (`drawAssobio`)
    this.assobio = { t: 0 };
    this.st.player.dir = "down"; this.olharDiag = null; this.andandoLivre = false;
    const n = chamar(this.selvagens, this.st.player);
    this.avisar(n ? `VOCÊ ASSOBIOU! ${n === 1 ? "UM POKÉMON OUVIU" : `${n} POKÉMON OUVIRAM`}!` : "VOCÊ ASSOBIOU... NINGUÉM OUVIU.");
  }
  /** as ondas do assobio saindo de você, e as notinhas subindo */
  drawAssobio(ctx, cx, cy) {
    const a = this.assobio;
    a.t += 1 / 60;
    if (a.t > 1.1) { this.assobio = null; return; }
    const p = this.st.player, s = this.sub && this.subMapa === p.map ? this.sub : { x: 0, y: 0 };
    const X = Math.round(p.x * TILE + s.x - cx + 8), Y = Math.round(p.y * TILE + s.y - cy - 8);
    ctx.strokeStyle = `rgba(255,255,255,${0.7 * (1 - a.t / 1.1)})`; ctx.lineWidth = 1;
    for (let k = 0; k < 3; k++) {
      const r = (a.t - k * 0.18) * 90;
      if (r > 0) { ctx.beginPath(); ctx.ellipse(X, Y + 8, r, r * 0.6, 0, 0, Math.PI * 2); ctx.stroke(); }
    }
    // as notinhas: bolinha e haste, de pixel
    ctx.fillStyle = "#ffffff";
    for (let k = 0; k < 2; k++) {
      const q = (a.t * 1.3 + k * 0.45) % 1, nx = X + 6 + k * 6 + Math.round(Math.sin(q * 6 + k) * 2), ny = Math.round(Y - q * 16);
      ctx.fillRect(nx, ny, 2, 2); ctx.fillRect(nx + 1, ny - 4, 1, 4); ctx.fillRect(nx + 2, ny - 4, 2, 1);
    }
  }

  /** o jogador assobiando: subindo a mão, na boca (soprando) e descendo */
  drawPlayerAssobio(ctx, x, y) {
    const nome = Assets.jogador?.() || "hero", D = (this._assobioArte ||= {});
    if (!D[nome]) {
      D[nome] = { img: new Image(), quadros: [] };
      D[nome].img.src = `assets/sprites/overworld/diagonal/assobio_${nome}.png`;
    }
    const F = D[nome];
    if (!F.img.complete || !F.img.naturalWidth) return false;
    const t = this.assobio.t, q = t < 0.1 || t > 0.65 ? 0 : Math.floor(t * 8) % 2 ? 2 : 1;
    if (!F.quadros[q]) {
      const cv = document.createElement("canvas"); cv.width = 16; cv.height = 32;
      const g = cv.getContext("2d"); g.imageSmoothingEnabled = false;
      g.drawImage(F.img, q * 16, 0, 16, 32, 0, 0, 16, 32);
      F.quadros[q] = cv;
    }
    const img = vestirQuadro(F.quadros[q], this.st, "down", nome);
    const terco = (v) => Math.round(v * ESCALA_TELA) / ESCALA_TELA;
    ctx.drawImage(img, terco(x), terco(y) + TILE - img.height);
    return true;
  }

  /** o quadro do jogador na diagonal: parado, ou o passo pelo que ele andou */
  drawPlayerDiagonal(ctx, x, y) {
    const nome = Assets.jogador?.() || "hero", D = (this._diagonal ||= {});
    if (!D[nome]) {
      D[nome] = { img: new Image(), quadros: {} };
      D[nome].img.src = `assets/sprites/overworld/diagonal/${nome}.png`;
    }
    const F = D[nome];
    if (!F.img.complete || !F.img.naturalWidth) return false;
    const baixo = this.olharDiag.y > 0;
    const andando = this.andandoLivre && !this.menu && !this.dlg.active;
    const col = andando ? [1, 0, 2, 0][Math.floor((this.passoLivre || 0) / 8) % 4] : 0, chave = `${baixo ? 0 : 1}.${col}`;
    if (!F.quadros[chave]) {
      const cv = document.createElement("canvas"); cv.width = 16; cv.height = 32;
      const g = cv.getContext("2d"); g.imageSmoothingEnabled = false;
      g.drawImage(F.img, col * 16, baixo ? 0 : 32, 16, 32, 0, 0, 16, 32);
      F.quadros[chave] = cv;
    }
    // a folha olha pra esquerda; pra direita é o espelho
    const img = this.quadro(vestirQuadro(F.quadros[chave], this.st, baixo ? "down" : "up", nome), this.olharDiag.x > 0);
    const terco = (v) => Math.round(v * ESCALA_TELA) / ESCALA_TELA;
    ctx.drawImage(img, terco(x), terco(y) + TILE - img.height);
    this.visorNaCara(ctx, img, terco(x), terco(y) + TILE - img.height);
    return true;
  }

  drawPlayer(ctx, x, y) {
    this._telaJogador = { x, y };     // (o ROTOMFONE do menu boia do lado de você)
    // NADANDO: em cima (surfando) ou no FUNDO DO MAR (mergulhado, com quem te leva)
    const nadador = this.st.surfando || (this.map?.submerso && this.st.mergulho?.especie) || null;
    const nadando = !!nadador;
    // POKÉSAVE: você é um Pokémon, e é ele que anda (src/systems/pokesave.js).
    // Nadando também: um Pokémon não precisa de outro pra atravessar.
    if (this.st.capturado?.naBola) {
      // dentro da bola: no mapa anda o dono, com você no cinto
      const { set, espelha } = this.olhar(Assets.actor("cacador") || Assets.actor("hero"), this.st.player.dir);
      const img = this.quadro(this.move ? this.quadroAndarT(set, (this.passosDados || 0) + this.kPasso()) : set[0], espelha);
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
    if (this.st.voando && this.st.montaria) return this.drawMontado(ctx, x, y);
    if (this.map?.ciber) return this.drawNoPorygon(ctx, x, y);   // no CIBERESPAÇO, montado no PORYGON
    // ASSOBIANDO (tools/andar_diagonal/assobio.py): a mão sobe até a boca
    if (this.assobio && this.assobio.t < 0.75 && !this._iso && !nadando && this.drawPlayerAssobio(ctx, x, y)) return;
    // NA DIAGONAL (tools/andar_diagonal/desenha.py): o boneco de 3/4, andando ou parado
    if (this.olharDiag && !this._iso && !nadando && !this.move && this.drawPlayerDiagonal(ctx, x, y)) return;
    const { set, espelha } = this.olhar(Assets.actor("hero"), this.st.player.dir);
    // andando: um quadro de passo por tile, alternando a perna (o ciclo do GBA).
    // nadando: quadro parado sempre — quem se mexe é o Pokémon, o herói só vira.
    // andando livre: a perna troca a cada meio tile andado
    const livre = !this.move && this.andandoLivre && !nadando && !this.menu && !this.dlg.active ? this.quadroAndarT(set, (this.passoLivre || 0) / TILE) : null;
    // AS ROUPAS (src/systems/roupas.js): o quadro vestido, antes de virar
    const cru = livre || (this.move && !nadando ? this.quadroAndarT(set, (this.passosDados || 0) + this.kPasso()) : set[0]);
    const img = this.quadro(vestirQuadro(cru, this.st, this._iso ? (vistaIso(this.st.player.dir).costas ? "up" : "down") : this.st.player.dir, Assets.jogador?.() || "hero"), espelha);
    // NADANDO / MERGULHADO com a PIXEL ART de andar do bicho (Mystery Dungeon):
    // ele boiando, e você atrás, tapado da cintura pra baixo por ele
    if (nadando && !this._iso && this.drawMontadoPixel(ctx, x, y, nadador, img, -2 + Math.sin(performance.now() / 260) * 1.2)) return;
    if (nadando && temNado3D(nadador) && !this._iso) return this.drawNadando3D(ctx, x, y, img, nadador);
    // em 1/3 de pixel: a tela é 3x (ESCALA_TELA), então o herói para entre os pixels do mapa
    const terco = (v) => Math.round(v * ESCALA_TELA) / ESCALA_TELA;
    ctx.drawImage(img, terco(x), terco(y) + TILE - img.height);
    // AS INSÍGNIAS NO CORPO (src/core/insigniascorpo.js): o símbolo de Braglitch
    // no peito (um pedaço por insígnia) e as do VOID na perna
    if (!nadando) {
      // (as do VOID ficam GUARDADAS, no estojo: não aparecem no corpo — o CAIO)
      insigniasNoCorpo(ctx, img, terco(x), terco(y) + TILE - img.height, topoDoQuadro(img), this.st.player.dir, { pecas: pecasDe(this.st.bragBadges, temMeio(this.st)) });
    }
    this.visorNaCara(ctx, img, terco(x), terco(y) + TILE - img.height);
    if (nadando) {
      // o Pokémon vem POR CIMA, cobrindo o herói da cintura pra baixo
      const mon = this.monNaVista(nadador, 7, this.st.player.dir);
      const bob = Math.sin(performance.now() / 260) * 1.2;    // sobe e desce na água
      ctx.drawImage(reduzido(mon, 26), Math.round(x) - 5, Math.round(y + 4 + bob), 26, 26);
    }
  }

  /** NADANDO em 3D (o LAPRAS, o GYARADOS): ele na linha da água, virando pra
   *  onde você vai, e você sentado em cima, cortado na cintura. */
  drawNadando3D(ctx, x, y, heroi, sp = this.st.surfando) {
    const dir = this.st.player.dir, agora = performance.now() / 1000;
    const alvo = GIRO_DA_DIRECAO[dir] ?? 0;
    let g = this.giroNado ?? alvo;
    const d = ((alvo - g + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
    g += d * 0.18;
    this.giroNado = g;
    const bob = Math.sin(agora * 2.2) * 1.2;
    const sela = desenharNadando(ctx, sp, Math.round(x) + 8, Math.round(y) + 18 + bob, agora, g);
    if (!sela) return;
    const corta = 4, hh = heroi.height - corta;
    const hx = Math.round(sela[0] - heroi.width / 2), hy = Math.round(sela[1]) - hh + 6;
    ctx.drawImage(heroi, 0, 0, heroi.width, hh, hx, hy, heroi.width, hh);
    this.visorNaCara(ctx, heroi, hx, hy);
  }

  /** NO CIBERESPAÇO, MONTADO NO PORYGON (src/data/ciberespaco.js): ele flutua
   *  um pouquinho acima da grade, balançando, e você vai sentado em cima — o
   *  sprite cortado na cintura, como no voo. Um rastro de pixels fica pra trás. */
  drawNoPorygon(ctx, x, y) {
    const dir = this.st.player.dir, agora = performance.now() / 1000;
    const { set, espelha } = this.olhar(Assets.actor("hero"), dir);
    const heroi = this.quadro(set[0], espelha);
    const corta = 5, hh = heroi.height - corta;
    const bob = Math.sin(agora * 3) * 1.2;
    ctx.fillStyle = "rgba(80,240,255,.25)";
    ctx.beginPath(); ctx.ellipse(Math.round(x) + 8, Math.round(y) + 14, 9, 3, 0, 0, Math.PI * 2); ctx.fill();
    // o PORYGON andando, virado pra onde você vai (sem os quadros dele ainda: o de batalha)
    const anda = Assets.monAndando({ species: "porygon" }, dir, performance.now());
    const img = anda || this.monNaVista("porygon", 7, dir);
    const L = anda ? anda.width : 30, A = anda ? anda.height : 30;
    const my = Math.round(y + 14 - A + 2 + bob);
    if (img) ctx.drawImage(anda ? img : reduzido(img, L), Math.round(x) + 8 - L / 2, my, L, A);
    // você sentado no meio das costas dele
    ctx.drawImage(heroi, 0, 0, heroi.width, hh, Math.round(x), my + Math.round(A * 0.45) - hh, heroi.width, hh);
    // o rastro: uns pixels ciano e magenta piscando atrás
    if (this.move || this.andandoLivre) {
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = i % 2 ? "#ff5ad8" : "#5af0ff";
        ctx.fillRect(Math.round(x) + 4 + ((agora * 37 + i * 5) % 9), Math.round(y) + 12 + i, 1, 1);
      }
    }
  }

  /** O herói VOANDO MONTADO: a montaria no ar (em 3D se tem modelo; se não, o
   *  sprite de batalha) e você sentado nas costas dela — o sprite cortado na
   *  cintura, que as pernas ficam do lado de lá. */
  drawMontado(ctx, x, y) {
    const sp = this.st.montaria, dir = this.st.player.dir, agora = performance.now() / 1000;
    const { set, espelha } = this.olhar(Assets.actor("hero"), dir);
    const heroi = this.quadro(set[0], espelha);
    const corta = 4, hh = heroi.height - corta;
    const bob = Math.sin(agora * 2.6) * 1.5;
    // com a PIXEL ART de andar do bicho (Mystery Dungeon): a sombra no chão e
    // ele no ar, com você em cima, tapado da cintura pra baixo por ele
    if (!this._iso && (Assets.monVoando({ species: sp }, dir, 0) || Assets.monAndando({ species: sp }, dir, 0))) {
      ctx.fillStyle = "rgba(0,0,0,.28)";
      ctx.beginPath(); ctx.ellipse(Math.round(x) + 8, Math.round(y) + 14, 11, 4, 0, 0, Math.PI * 2); ctx.fill();
      if (this.drawMontadoPixel(ctx, x, y, sp, heroi, 10 + bob, true)) return;
    }
    if (temMontaria3D(sp) && !this._iso) {
      // ela VIRA aos poucos pra onde você vai (pelo lado mais curto)
      const alvo = GIRO_DA_DIRECAO[dir] ?? 0;
      let g = this.giroMontaria ?? alvo;
      const d = ((alvo - g + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
      g += d * 0.18;
      this.giroMontaria = g;
      const sela = desenharMontaria(ctx, sp, Math.round(x) + 8, Math.round(y) + 14, agora, g, 6 + bob);
      if (sela) ctx.drawImage(heroi, 0, 0, heroi.width, hh, Math.round(sela[0] - heroi.width / 2), Math.round(sela[1]) - hh + 6, heroi.width, hh);
      return;
    }
    // sem modelo: a sombra no chão e o sprite dele por baixo de você
    ctx.fillStyle = "rgba(0,0,0,.28)";
    ctx.beginPath(); ctx.ellipse(Math.round(x) + 8, Math.round(y) + 14, 11, 4, 0, 0, Math.PI * 2); ctx.fill();
    const L = 40, my = Math.round(y + 14 - L - 6 + bob);
    const img = this.monNaVista(sp, 7, dir);
    if (img) ctx.drawImage(reduzido(img, L), Math.round(x) + 8 - L / 2, my, L, L);
    ctx.drawImage(heroi, 0, 0, heroi.width, hh, Math.round(x), my + 16 - hh, heroi.width, hh);
  }

  /** O RELÓGIO DO PASSO: a animação de andar anda pela DISTÂNCIA, não pelo
   *  relógio ("quanto mais rápido se move mais rápido passa a animação de
   *  andar", CAIO, nov/2026). Andando normal (1 pixel por quadro, o FireRed) o
   *  passo vai no tempo dele; correndo, 2x; de bicicleta/voando rápido, mais.
   *  `dono` guarda o relógio; (wx, wy) é a posição dele no mapa, em pixels. */
  relogioAndar(dono, wx, wy) {
    const r = (dono._relogioPasso ||= { t: 0, x: wx, y: wy });
    const d = Math.hypot(wx - r.x, wy - r.y);
    if (d < TILE * 3) r.t += d / 0.06;     // 0,06 px/ms = andando normal (pulo de tela não conta)
    r.x = wx; r.y = wy;
    return r.t;
  }

  /** MONTADO num Pokémon com a pixel art de andar dele (nadar, mergulhar,
   *  voar): o bicho virado pra onde você vai, sempre com o passo andando, e o
   *  herói ATRÁS dele, no meio das costas — a pixel art do Pokémon tapa a do
   *  jogador da cintura pra baixo. `alto`: quanto o bicho fica acima do chão
   *  (voando) ou abaixo (na água). Sem a pixel art, false (fica o de antes). */
  drawMontadoPixel(ctx, x, y, especie, heroi, alto = 0, voando = false) {
    // VOANDO: a animação de voo (asas batendo, 2x mais rápida que a do PMD
    // parado) e o corpo subindo e descendo no ritmo dela; nadando, o andar
    const agora = performance.now();
    const voo = voando && Assets.monVoando({ species: especie }, this.st.player.dir, agora * 2);
    // nadando: o passo pela distância (mais rápido = perna mais rápida)
    const { px, py } = this.playerPixel(true);
    const q = voo || Assets.monAndando({ species: especie }, this.st.player.dir, this.relogioAndar(this._relogioMontado ||= {}, px, py));
    if (!q) return false;
    if (voo) alto += Math.sin(agora / 140) * 2;
    // o ALFA é maior também montado (o da equipe com essa espécie)
    const e = (this.st.party || []).some((m) => m?.species === especie && m.alfa) ? ALFA_FORA : 1;
    const qw = Math.round(q.width * e), qh = Math.round(q.height * e);
    const pe = Math.round(y + 15 - alto);
    const mx = Math.round(x + 8 - qw / 2), my = pe - qh;
    // o herói sentado: a cintura (uns 9 pixels acima do pé dele) na metade de cima do bicho
    const cintura = my + Math.round(qh * 0.45);
    ctx.drawImage(heroi, Math.round(x + 8 - heroi.width / 2), cintura - heroi.height + 9);
    ctx.drawImage(q, mx, my, qw, qh);
    return true;
  }

  /** Outro jogador andando no mesmo mapa. */
  /** ESCONDE-ESCONDE (online_robos.py): quem está escondido só aparece com
   *  você do lado dele (até 1 tile) */
  peerEscondido(p) {
    if (!p.escondido) return false;
    const { px, py } = this.playerPixel();
    return Math.max(Math.abs(p.px - px), Math.abs(p.py - py)) > TILE * 1.5;
  }

  drawPeer(ctx, p, cx, cy) {
    if (this.peerEscondido(p)) return;
    const x = Math.round(p.px - cx), y = Math.round(p.py - cy);
    const ps = pokesaveDoSprite(p.sprite);     // o outro jogador é um Pokémon?
    if (ps) return desenharPokemon(ctx, ps, x, y, p.dir || "down", p.passo > 0 ? (p.passo % 1) : 0, 28, this.vistaMon(p.dir || "down"));
    const { set: s0, espelha } = this.olhar(Assets.actor(p.sprite || "hero", false), p.dir || "down");
    const set = s0 || Assets.actor("hero", false).down;
    const img = this.quadro(p.passo > 0 ? this.quadroAndarT(set, p.passo) : set[0], espelha);
    ctx.drawImage(img, x, y + TILE - img.height);
  }

  /** Nome e balão de fala do outro jogador. */
  drawPeerTag(ctx, p, cx, cy) {
    if (this.peerEscondido(p)) return;
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
    const y = (this.st.mission?.left > 0 && this.naFenda()) ? 26 : 6;
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
    // o que vai SUMIR pisca no último segundo (cada vez mais rápido)
    const falta = (DB.CONFIG?.selvagens?.someEm ?? 3) - (b.viu || 0);
    if (b.some && falta < 1 && Math.floor(performance.now() / (40 + falta * 80)) % 2) return;
    if (b.mon.species === "rayquaza" && this.st.player.map === "glitchdim" && !this._iso) return this.drawSerpente(ctx, b, cx, cy);
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
    // ouviu o ASSOBIO e é curioso: vem com um "?" em cima
    if (b.chamado > 0 && b.genio !== "bravo") drawText(ctx, "?", Math.round(b.x * TILE - cx + 5), Math.round(b.y * TILE - cy - 24), "#ffffff");
    // O SELVAGEM ATACA (pedido do CAIO): o BRAVO que está te caçando, quando chega
    // a uns 2 tiles, dá um golpe na sua direção — a animação de ATAQUE do
    // MYSTERY DUNGEON dele (a mesma do companheiro, tecla K)
    if (!this._iso) {
      const pl = this.st.player, dx = pl.x - b.x, dy = pl.y - b.y, perto = Math.hypot(dx, dy) <= 2.2;
      const agora = performance.now() / 1000;
      if (!b.pmdAtaque && caca && perto && agora > (b.pmdEspera || 0)) {
        const sp = DB.SPECIES[b.mon.species], base = DB.SPECIES[sp?.fusao?.cabeca || b.mon.species];
        const n = base?.spriteDex || base?.dex;
        if (n) { b.pmdAtaque = { t0: agora, n, vx: dx, vy: dy }; b.pmdEspera = agora + 2 + Math.random() * 2; }
      }
      if (b.pmdAtaque) {
        const a = b.pmdAtaque;
        const r = this.desenharAtaquePMD(ctx, a.n, agora - a.t0, a.vx, a.vy, Math.round(b.x * TILE - cx + 8), Math.round(b.y * TILE - cy + 12));
        if (r === "fim") b.pmdAtaque = null;
        else if (r) return;
      }
    }
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
    // ANDANDO no mapa, virado pra onde vai (Assets.monAndando); o passo só
    // anda enquanto ele anda (parado, o quadro parado). Quem não tem o sprite
    // de andar fica com o de batalha pulando, como antes
    const rumo = !v && this.rumoDoSelvagem(b);
    const andando = rumo && performance.now() - (rumoDoSelvagem.get(b).andouEm || -1e9) < 450;
    const passo = rumo && Assets.monAndando(b.mon, rumo,
      andando ? performance.now() * (caca || corre ? 1.6 : 1) + b.x * 137 : 0);
    if (TAMANHO_REAL[b.mon.species]) {
      const L = Math.round(TAMANHO_REAL[b.mon.species] * (b.mon.alfa ? 1.35 : b.mon.mini ? 0.6 : 1));
      ctx.drawImage(img, Math.round(b.x * TILE - cx + 8 - L / 2), Math.round(b.y * TILE - cy + 16 - L * 0.8 - pulo), L, L);
    } else if (passo) {
      const e = b.mon.alfa ? 1.35 : b.mon.mini ? 0.6 : 1, w = Math.round(passo.width * e), h = Math.round(passo.height * e);
      ctx.drawImage(passo, Math.round(b.x * TILE - cx + 8 - w / 2), Math.round(b.y * TILE - cy + 15 - h - (caca || corre ? pulo : 0)), w, h);
    } else ctx.drawImage(reduzido(img, lado), x, y, lado, lado);
    // shiny e luminoso fora da bola soltam BRILHINHOS (pedido do CAIO, nov/2026)
    if (b.mon.shiny || b.mon.luminoso) brilhinhos(ctx, b.x * TILE - cx + 8, b.y * TILE - cy + 4, lado, b.mon, b.x * 7 + b.y);
    // e o AVISO em cima dele. Perseguidor sem aviso é armadilha: quem toma uma
    // batalha que não pediu tem que ter tido a chance de ver ela chegando.
    if (caca && Math.floor(performance.now() / 220) % 2 === 0) {
      drawText(ctx, "!", x + Math.round(lado / 2) - 3, y - 8, "#ff5566", { shadow: "#2b0a12" });
    }
  }

  /** O RAYQUAZA SELVAGEM DA FENDA: lá não tem céu, então ele anda pelo mapa
   *  em 3D, no tamanho de verdade (src/core/gigante3d.js, `desenharSolto`). A
   *  cabeça vai atrás do tile dele (é ali que se encosta pra lutar), rodando
   *  um pouco em volta, e o corpo segue o RASTRO dela. Perto de você, ele ruge. */
  drawSerpente(ctx, b, cx, cy) {
    const t = performance.now() / 1000;
    const alvo = [b.x * TILE + 8 + Math.cos(t * 0.9) * 10, b.y * TILE + 8 + Math.sin(t * 1.3) * 6];
    if (!b.rastro) b.rastro = Array.from({ length: 12 }, (_, i) => [alvo[0] + i * 11, alvo[1] - i * 3]);
    const dt = Math.min(0.05, t - (b.rastroT ?? t));
    b.rastroT = t;
    const h = b.rastro[0], dx = alvo[0] - h[0], dy = alvo[1] - h[1], d = Math.hypot(dx, dy);
    if (d > 0.01) {
      const passo = Math.min(d, 70 * dt), nova = [h[0] + (dx / d) * passo, h[1] + (dy / d) * passo];
      // um ponto novo a cada 3 pixels; no meio disso a cabeça só anda
      if (Math.hypot(nova[0] - b.rastro[1][0], nova[1] - b.rastro[1][1]) < 3) b.rastro[0] = nova;
      else b.rastro.unshift(nova);
    }
    // o que passou do comprimento dele não serve mais
    let tot = 0;
    for (let i = 1; i < b.rastro.length; i++) {
      tot += Math.hypot(b.rastro[i][0] - b.rastro[i - 1][0], b.rastro[i][1] - b.rastro[i - 1][1]);
      if (tot > 140) { b.rastro.length = i + 1; break; }
    }
    const p = this.st.player, perto = Math.abs(p.x - b.x) + Math.abs(p.y - b.y) <= 4;
    if (perto && !b.rugiu) { b.rugiu = true; tocarGrito("rayquaza"); this.tremor = 0.4; }
    desenharSolto(ctx, "rayquaza", b.rastro, cx, cy, t, perto ? 0.5 + 0.5 * Math.sin(t * 2.5) : 0);
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
    const img = this.quadro(this.move ? this.quadroAndarT(set, (this.passosDados || 0) + this.kPasso()) : set[0], espelha);
    ctx.drawImage(img, Math.round(x), Math.round(y) + TILE - img.height);
  }

  /** LUTA NO MAPA (src/systems/lutamapa.js): sem tela de batalha. A cena de
   *  batalha entra transparente, por cima do mapa, só com as falas: guardar quem
   *  foi pego, ou pagar o prêmio e a insígnia do treinador */
  capturaNoMapa(mon) { this.game.scenes.push(new BattleScene(), { foe: mon, capturadoNoMapa: true }); }
  vitoriaNoMapa(T) {
    const trainer = { sprite: T.npc.sprite, ...T.trainer };
    this.game.scenes.push(new BattleScene(), { trainer, npcKey: T.key, venceuNoMapa: true });
  }
  equipeCaiuNoMapa() { largarLuta(this); this.apagarNoMato(); }

  /** O ATAQUE DO COMPANHEIRO (pedido do CAIO, nov/2026): K, e quem te segue dá
   *  um golpe pra onde você está olhando, com a animação de ATAQUE do Pokémon
   *  Mystery Dungeon dele (PMDCollab SpriteCollab; tools/pmd/baixar_ataques.py:
   *  assets/sprites/pmd/ataque/<número>.png e assets/sprites/pmd/ataques.json). */
  compaAtacar() {
    const mon = this.quemSegue();
    if (!mon || !this.compa || this.compaAtaque || this.st.surfando || this.st.voando) return;
    // a fusão ataca com o jeito de quem deu a cabeça
    const sp = DB.SPECIES[mon.species], id = sp?.fusao?.cabeca || mon.species, base = DB.SPECIES[id];
    const n = base?.spriteDex || base?.dex;
    if (!n) return;
    this.compaAtaque = { t: 0, n, dir: this.st.player.dir || "down" };
    this.pedirAtaquePMD(n);
    Audio2.tone(220, 0.06, "square", 0.3); setTimeout(() => Audio2.tone(330, 0.08, "square", 0.35), 90);
  }
  pedirAtaquePMD(n) {
    this._pmd ||= { idx: null, imgs: {} };
    if (!this._pmd.idx && !this._pmd.pedindo) {
      this._pmd.pedindo = true;
      fetch("assets/sprites/pmd/ataques.json").then((r) => r.json()).then((j) => { this._pmd.idx = j; }).catch(() => { this._pmd.idx = {}; });
    }
    if (!this._pmd.imgs[n]) { const im = new Image(); im.src = `assets/sprites/pmd/ataque/${n}.png`; this._pmd.imgs[n] = im; }
  }
  /** UM QUADRO DO ATAQUE DO PMD do Pokémon número `n`, no tempo `t` (s), virado
   *  pra (vx, vy), com o pé em (px, py) na tela. Devolve "fim" quando acabou,
   *  false enquanto o desenho não chegou (ou se ele não tem), true desenhado. */
  desenharAtaquePMD(ctx, n, t, vx, vy, px, py) {
    this.pedirAtaquePMD(n);
    const P = this._pmd, info = P.idx?.[n], img = P.imgs[n];
    if (P.idx && !info) return "fim";                                       // esse não tem no PMD
    if (!info || !img?.complete || !img.naturalWidth) return t > 2 ? "fim" : false;
    const [w, h, dur] = info, total = dur.reduce((s, d) => s + d, 0);
    let k = Math.floor(t * 60);
    if (k >= total) return "fim";
    let quadro = 0;
    for (let i = 0; i < dur.length; i++) { if (k < dur[i]) { quadro = i; break; } k -= dur[i]; }
    // as linhas do PMD: baixo, baixo-direita, direita, cima-direita, cima, cima-esquerda, esquerda, baixo-esquerda
    const oito = Math.round(Math.atan2(vy, vx) / (Math.PI / 4));
    const linha = { 2: 0, 1: 1, 0: 2, "-1": 3, "-2": 4, "-3": 5, 4: 6, "-4": 6, 3: 7 }[oito] ?? 0;
    // o meio do quadro do PMD é a sombra (o pé)
    ctx.drawImage(img, quadro * w, linha * h, w, h, Math.round(px - w / 2), Math.round(py - h / 2 - 4), w, h);
    return true;
  }
  /** desenha o golpe do companheiro; false = desenha o sprite de sempre */
  drawCompaAtaque(ctx, q, cx, cy) {
    const a = this.compaAtaque;
    a.t += 1 / 60;
    const c = this.compa, kk = this.move ? this.move.n / this.move.total : 1;
    const x0 = q ? q.x - cx : (c.de.x + (c.x - c.de.x) * kk) * TILE - cx;
    const y0 = q ? q.y - cy : (c.de.y + (c.y - c.de.y) * kk) * TILE - cy;
    const v = { down: [0, 1], right: [1, 0], up: [0, -1], left: [-1, 0] }[a.dir] || [0, 1];
    // ele PULA pra 1 tile NA SUA FRENTE (pedido do CAIO) e ataca de lá
    const p = this.st.player, sub = this.sub && this.subMapa === p.map ? this.sub : { x: 0, y: 0 };
    const fx = p.x * TILE + sub.x + v[0] * TILE - cx, fy = p.y * TILE + sub.y + v[1] * TILE - cy;
    const k = Math.min(1, a.t / 0.15), salto = Math.sin(k * Math.PI) * 6;
    const x = x0 + (fx - x0) * k, y = y0 + (fy - y0) * k - salto;
    const r = this.desenharAtaquePMD(ctx, a.n, Math.max(0, a.t - 0.15), v[0], v[1], x + 8, y + 12);
    if (r === "fim") { this.compaAtaque = null; return false; }
    return r;
  }

  drawCompanheiro(ctx, mon, cx, cy) {
    // andando livre: no caminho por onde você passou (`compaNoRastro`)
    const q = this.compaNoRastro();
    if (q) this.compa.dir = q.dir;
    // ATACANDO (tecla K): a animação de ataque do MYSTERY DUNGEON no lugar do sprite
    if (this.compaAtaque && this.drawCompaAtaque(ctx, q, cx, cy)) return;
    // na LUTA NO MAPA ele fica no jeito do MYSTERY DUNGEON o tempo todo; e andando
    // NA DIAGONAL também, porque o PMD é que tem o desenho das 8 direções
    const rl = this.rumoLivre, naDiagonal = !!(rl?.x && rl?.y) && !this._iso;
    if (emLuta(this) || naDiagonal) {
      const c = this.compa, k = this.move ? this.move.n / this.move.total : 1;
      const px = (q ? q.x : (c.de.x + (c.x - c.de.x) * k) * TILE) - cx + 8, py = (q ? q.y : (c.de.y + (c.y - c.de.y) * k) * TILE) - cy + 12;
      const v = { down: [0, 1], right: [1, 0], up: [0, -1], left: [-1, 0] }[c.dir || "down"] || [0, 1];
      if (desenharMovimentoPMD(ctx, mon, !!this.move || !!this.andandoLivre, performance.now() / 1000, rl?.x ?? v[0], rl?.y ?? v[1], px, py)) return;
    }
    const img = this.monNaVista(mon.species, mon.seed, this.compa?.dir || "down");
    if (!img) return;
    const c = this.compa;
    const k = this.move ? this.move.n / this.move.total : 1;
    const x = q ? q.x - cx : (c.de.x + (c.x - c.de.x) * k) * TILE - cx;
    const y = q ? q.y - cy : (c.de.y + (c.y - c.de.y) * k) * TILE - cy;
    // em 1/3 de pixel, como você (ESCALA_TELA): arredondando inteiro ele tremia na diagonal
    const terco = (v) => Math.round(v * ESCALA_TELA) / ESCALA_TELA;
    const andando = !!this.move || (this.andandoLivre && !this.menu && !this.dlg.active);
    // falando com ele: um pulinho de alegria (e o balão em cima, até a fala fechar)
    const r = this.compaReacao;
    if (r) r.t = (r.t || 0) + 1 / 60;
    const pulo = andando ? Math.abs(Math.sin(performance.now() / 85)) * 1.5
      : r && r.t < 0.5 ? Math.abs(Math.sin(r.t * Math.PI * 4)) * 4 : 0;
    // fora do isométrico ele ANDA: virado pra onde vai, com o passo (o sprite
    // de andar, Assets.monAndando); parado, fica parado (o quadro 0). Sem
    // sprite de andar, o desenho de batalha animado (Assets.desenhaVivo).
    const dir = this.compa?.dir || "down";
    // UM GIGANTE (src/core/gigante3d.js) é 3D só no céu: aqui ele é o sprite de
    // batalha, maior que o dos outros e boiando um pouco acima do chão
    if (ehImenso(mon.species) && !this.vistaMon(dir)) {
      // (os do chão, os Regis, não boiam: pisam)
      const L = Math.round(44 * (mon.alfa ? ALFA_FORA : mon.mini ? 0.6 : 1)), boia = GIGANTES[mon.species]?.tipo === "chao" ? 0 : terco(Math.sin(performance.now() / 400) * 1.5);
      Assets.desenhaVivo(ctx, mon, terco(x + 8 - L / 2), terco(y + 12 - L - pulo + boia), L);
      if (r) desenharEmote(ctx, r.emote, terco(x + 8), terco(y - L + 2), r.t);
      return;
    }
    const relogio = this.relogioAndar(this, x + cx, y + cy);   // (o do companheiro mora na cena)
    const passo = !this.vistaMon(dir) && Assets.monAndando(mon, dir, andando ? relogio : 0);
    // o ALFA é maior fora da pokébola também (pedido do CAIO, nov/2026)
    const e = mon.alfa ? ALFA_FORA : mon.mini ? 0.6 : 1, L = Math.round((TAMANHO_REAL[mon.species] || 28) * e);
    if (TAMANHO_REAL[mon.species]) {
      // FORA DA BOLA, DE TAMANHO REAL (o WAILORD te seguindo tapa meia tela)
      const im = Assets.comCor(Assets.mon(mon.species, mon.seed) || img, mon);
      if (im) ctx.drawImage(im, terco(x + 8 - L / 2), terco(y + 16 - L * 0.8 - pulo), L, L);
    } else if (passo) { const w = Math.round(passo.width * e), h = Math.round(passo.height * e); ctx.drawImage(passo, terco(x + 8 - w / 2), terco(y + 15 - h - pulo), w, h); }
    else if (this.vistaMon(dir)) ctx.drawImage(reduzido(img, 28), terco(x + 8 - L / 2), terco(y + 16 - L - pulo), L, L);
    else Assets.desenhaVivo(ctx, mon, terco(x + 8 - L / 2), terco(y + 16 - L - pulo), L);
    if (mon.shiny || mon.luminoso) brilhinhos(ctx, x + 8, y + 4, L, mon, 3);
    if (r) desenharEmote(ctx, r.emote, terco(x + 8), terco(y + 2 - L), r.t);
  }

  drawNpc(ctx, n, cx, cy) {
    // `fx, fy`: posição fracionária de quem está deslizando entre dois tiles
    // (o caçador do pokésave); os outros ficam parados no tile deles
    const x = (n.fx ?? n.x) * TILE - cx, y = (n.fy ?? n.y) * TILE - cy;
    if (n.sprite === "desenho") {
      // um OBJETO DESENHADO À MÃO (o NINTENDO SWITCH do quarto): `lado` é o
      // tamanho na tela, em pixels; em pé no tile dele, centrado. Enquanto o
      // PNG não existe, não desenha nada (fica o que o mapa tem embaixo)
      if (!DESENHOS_OBJ.has(n.desenho)) {
        DESENHOS_OBJ.set(n.desenho, null);
        loadImage(url(n.desenho)).then((img) => DESENHOS_OBJ.set(n.desenho, img || false)).catch(() => DESENHOS_OBJ.set(n.desenho, false));
      }
      const img = DESENHOS_OBJ.get(n.desenho);
      if (img) { const L = n.lado || 32; ctx.drawImage(img, Math.round(x + 8 - L / 2), Math.round(y + 16 - L), L, L); }
      return;
    }
    // um OBJETO DESENHADO NA HORA (a POKÉMÁQUINA que você construiu: o desenho sai da grade dela)
    if (n.sprite === "canvas") {
      if (n.canvas) { const L = n.lado || 32; ctx.drawImage(n.canvas, Math.round(x + 8 - L / 2), Math.round(y + 16 - L), L, L); }
      return;
    }
    if (n.sprite === "ball") return void ctx.drawImage(Assets.ball, x + 4, y + 4);
    if (n.sprite === "portal") return void desenharPortal(ctx, x, y, performance.now() / 1000);
    if (n.sprite === "toca") return void desenharToca(ctx, x, y);
    if (n.sprite === "bau") return void this.desenharBau(ctx, x, y, !!this.st.npcState[`${this.st.player.map}.${n.id}`]?.gotGift);
    if (n.sprite === "helicoptero") return void this.desenharHelicoptero(ctx, x, y);
    if (n.sprite === "foguete") return void this.desenharFoguete(ctx, x, y);
    if (n.sprite === "separador") return void this.desenharSeparador(ctx, x, y);
    if (n.sprite === "esqueleto") {
      // O ESQUELETO DO CYRUS (src/data/espaco.js), CAÍDO no chão, no jeito dos
      // bonecos do FIRERED: contorno escuro, três tons, o uniforme da EQUIPE
      // GALÁCTICA com o G amarelo (sem o cabelo, pedido do CAIO)
      const g = [
        "..........kk..................",
        ".........kWWk.................",
        "..kkkk...kWMk.....kk..........",
        ".kWWWWk...kWk....kWWk.........",
        "kWWWWWMk.kkUUUUUUUkMk.........",
        "kWkkWWMkkUUUUUUUUUUkk.........",
        "kWkkWWWMkUUuYYYuUUUUkkkkkkkkk.",
        "kWWWWkWMkUUuYuuuUUUUuuWWWWWWWk",
        "kWkWkWMkkUUuYuYYuUUUuuWMMMMWMk",
        "kMWkWMk.kUUuYYYYuUUUuukkkkkWk.",
        ".kkkkk..kuUUUUUUUUUuukkkkkWWk.",
        ".........kuuuuuuuuuukWWWWWMkk.",
        "..........kkkkkkkkkkkMMMMMWWk.",
        "...................kk.kkkkkMk.",
        "..................kWWk....kk..",
        ".................kWMMk........",
        "..................kkk.........",
      ];
      const cores = { k: "#202028", W: "#f0ecdc", M: "#b8ac94", U: "#58648a", u: "#384058", Y: "#f8d040" };
      const X = Math.round(x - 4), Y = Math.round(y + 16 - g.length + 1);
      ctx.fillStyle = "rgba(0,0,0,0.2)"; ctx.fillRect(X + 2, Y + g.length - 4, 26, 3);
      g.forEach((l, j) => [...l].forEach((ch, i) => { if (cores[ch]) { ctx.fillStyle = cores[ch]; ctx.fillRect(X + i, Y + j, 1, 1); } }));
      return;
    }
    if (n.sprite === "liquidificador") {
      // O LIQUIDIFICADOR DE BERRIES: o copo cheio de suco rodando em cima da
      // base. Desenhado pixel por pixel, do tamanho de um tile
      const g = [
        "...aaaaaaaa.....",
        "..awwwwwwwwa....",
        "..awSSSSSSwa....",
        "..awSRRRRSwa....",
        "..awSRPPRSwa....",
        "..awSRPPRSwa....",
        "..awSRRRRSwaaa..",
        "..awSSSSSSwa.a..",
        "..aawwwwwwaa.a..",
        "...aaaaaaaaaaa..",
        "..aBBBBBBBBBBa..",
        "..aBbbbGbbbbBa..",
        "..aBbbbbbbbbBa..",
        "..aBBBBBBBBBBa..",
        "...aaaaaaaaaa...",
      ];
      const gira = Math.floor(performance.now() / 150) % 2;
      const cores = { a: "#181420", w: "#c8e8f8", S: gira ? "#e8403c" : "#f490b8", R: gira ? "#f490b8" : "#f0d040",
                      P: gira ? "#f0d040" : "#e8403c", B: "#a8a0c0", b: "#787090", G: "#00ff41" };
      g.forEach((l, j) => [...l].forEach((ch, i) => {
        if (ch === ".") return;
        ctx.fillStyle = cores[ch];
        ctx.fillRect(x + i, y + j + 1, 1, 1);
      }));
      return;
    }
    if (n.sprite === "arbusto") {
      // O ARBUSTO DE BERRIES: folhas, e as frutinhas quando ele tem fruta
      // (as raras são douradas)
      const st = this.st.npcState[`${this.st.player.map}.${n.id}`];
      const tem = this.arbustoPronto(st);
      const g = [
        "....aaaaaa......",
        "..aaGGGGGGaa....",
        ".aGGgGGGGgGGa...",
        "aGGGGGgGGGGGGa..",
        "aGgGGGGGGGgGGa..",
        "aGGGGgGGGGGGGa..",
        ".aGGGGGGgGGGa...",
        "..aaGGGGGGaa....",
        "....aattaa......",
        ".....att a......".replace(" ", "t"),
      ];
      const fruta = n.arbusto?.rara ? "#f0c020" : "#e8403c";
      g.forEach((l, j) => [...l].forEach((ch, i) => {
        if (ch === ".") return;
        ctx.fillStyle = { a: "#181420", G: "#3a9a48", g: "#2a7038", t: "#7a5030" }[ch];
        ctx.fillRect(x + i + 1, y + j + 5, 1, 1);
      }));
      if (tem) {
        for (const [i, j] of [[4, 2], [9, 3], [6, 5], [11, 5], [3, 5]]) {
          ctx.fillStyle = fruta;
          ctx.fillRect(x + i + 1, y + j + 5, 2, 2);
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(x + i + 1, y + j + 5, 1, 1);
        }
      }
      return;
    }
    if (n.sprite === "placaregi") {
      // A PLACA DE SETE PONTOS (src/data/regis.js): pedra com o desenho do
      // rosto do Regi. Os pontos brilham de vez em quando — e acesos de vez
      // enquanto ele está acordando; apagados depois que ele foi embora.
      const R = DB.REGIS?.[n.regi];
      ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.fillRect(x + 1, y + 13, 14, 3);
      ctx.fillStyle = "#2e2a24"; ctx.fillRect(x + 1, y - 3, 14, 17);
      ctx.fillStyle = "#857b6a"; ctx.fillRect(x + 2, y - 2, 12, 15);
      ctx.fillStyle = "#a59b86"; ctx.fillRect(x + 2, y - 2, 12, 2);
      ctx.fillStyle = "#6a6050"; ctx.fillRect(x + 2, y + 11, 12, 2);
      if (R) {
        const xs = R.pontos.map((q) => q[0]), ys = R.pontos.map((q) => q[1]);
        const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), 1);
        const passo = Math.min(3, 9 / span), lado = passo >= 2.5 ? 2 : 1;
        const foi = this.st.flags.gigantes?.[n.regi];
        const acesa = !foi && (this.gigante?.id === n.regi || Math.sin(performance.now() / 600) > 0.75);
        ctx.fillStyle = R.cor[acesa ? 1 : 0];
        for (const [dx, dy] of R.pontos) {
          ctx.fillRect(Math.round(x + 8 + dx * passo - lado / 2), Math.round(y + 5 - dy * passo - lado / 2), lado, lado);
        }
      }
      return;
    }
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
    if (n.sprite === "toca") return void desenharToca(ctx, x, y);
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
    if (n.sprite === "rasgo" && n.ultra) return this.drawUltraBuraco(ctx, x, y);
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
      // "mon:glitnexy:shiny" é o shiny (o PRIMO do GLITNEXY, dlc/extrema.js)
      const [especie, cor] = n.sprite.slice(4).split(":");
      // QUEM TEM MODELO 3D (src/core/gigante3d.js, `tem3D`) fica em pé em 3D,
      // no tamanho dele (fora do isométrico, que desenha cada ator num
      // pedaço de tela e não cabe um bicho de três heróis)
      if (!cor && !this._iso && tem3D(especie)) {
        return void desenharParado(ctx, especie, x + 8 + treme, y + 15, performance.now() / 1000);
      }
      const img = (cor === "shiny" && Assets.monShiny(especie)) || this.monNaVista(especie, 7, n.dir || "down");
      if (!img) return;
      // O BILL-SNORLAX tentando apertar o botão: a cada 3 s ele se estica, dá um
      // pulinho pro lado do computador, cai sentado — TUM! — e o chão treme
      if (n.tentaBotao && this.cenaBill) return;    // na cena, quem desenha é a cena
      if (n.tentaBotao) {
        const t = performance.now() / 1000, k = t % 3;
        const pula = k < 0.5 ? Math.sin(k / 0.5 * Math.PI) * 6 : 0, estica = k < 0.5 ? Math.round(Math.sin(k / 0.5 * Math.PI) * 3) : 0;
        if (k >= 0.5 && this._tumBill !== Math.floor(t / 3)) {
          this._tumBill = Math.floor(t / 3);
          this.tremor = Math.max(this.tremor || 0, 0.4);
          Audio2.tone(60, 0.18, "square", 0.6);
        }
        ctx.drawImage(reduzido(img, 40), x - 12 - estica, y - 24 - Math.round(pula), 40, 40);
        if (k > 0.5 && k < 1.3) drawText(ctx, "?", x + 12, y - 30, "#ffffff");
        return;
      }
      if (TAMANHO_REAL[especie]) {
        // de TAMANHO REAL: no meio da área dele, com a barriga na beira de baixo (boiando, sobe e desce)
        const L = TAMANHO_REAL[especie], a = n.area || { w: 1, h: 1 };
        const mx = x + a.w * TILE / 2, base = y + a.h * TILE - L * 0.25 + Math.sin(performance.now() / 900) * 2;
        return void ctx.drawImage(img, Math.round(mx - L / 2), Math.round(base - L), L, L);
      }
      ctx.drawImage(reduzido(img, 40), x - 12 + treme, y - 24, 40, 40);
      // O BRILHO DO SHINY PARADO: estrelinhas piscando em volta (o MINIOR shiny
      // na casca é igual ao comum — sem isto ninguém sabia que ele é especial)
      if (n.brilha) {
        const t = performance.now() / 1000;
        for (let i = 0; i < 3; i++) {
          const k = (t * 0.9 + i / 3) % 1, a = i * 2.1 + Math.floor(t * 0.9 + i / 3) * 1.7;
          const sx = Math.round(x + 8 + Math.cos(a) * 14), sy = Math.round(y - 6 + Math.sin(a) * 12), r = Math.round(Math.sin(k * Math.PI) * 3);
          if (r <= 0) continue;
          ctx.fillStyle = "#fff6a0";
          ctx.fillRect(sx - r, sy, r * 2 + 1, 1); ctx.fillRect(sx, sy - r, 1, r * 2 + 1);
        }
      }
      return;
    }
    const { set, espelha } = this.olhar(Assets.actor(n.sprite), n.dir || "down");
    // andando, alterna a perna como o jogador (a paridade sai da posição)
    const img = this.quadro(n.andando ? this.quadroAndarT(set, n.fx + n.fy) : set[0], espelha);
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
    // o BILL depois do WAILORD (pedido do CAIO): "15 QUILOS DE GORDURA FORAM PRA
    // MIM" — ele ficou mais LARGO (o mesmo desenho, esticado pros lados)
    // (e vai EMAGRECENDO: a cada visita, um pouco — `billLargura`, de 1,4 até 1)
    if (n.billHumano && this.st.flags.billLargura > 1) {
      const w = Math.round(img.width * this.st.flags.billLargura);
      return void ctx.drawImage(img, x - (w - TILE) / 2, y + TILE - img.height, w, img.height);
    }
    ctx.drawImage(img, x - (img.width - TILE) / 2, y + TILE - img.height);
    // OS DESAFIANTES DE BRAGLITCH com o símbolo da Liga no peito (src/core/insigniascorpo.js):
    // os da Esplanada e o gêmeo com ele inteiro; os treinadores das rotas, com uns pedaços
    if (this.geo?.braglitch || this.map?.ligaBrag) {
      const gemeo = /^heroina?_brag$/.test(n.sprite);
      const lider = n.trainer && (n.trainer.lider || n.trainer.badge || n.trainer.bragBadge);
      const pecas = gemeo || n.desafianteLiga ? TUDO : n.trainer && !lider ? pecasDoTreinador(this.st.player.map + n.id) : null;
      if (pecas) insigniasNoCorpo(ctx, img, x - (img.width - TILE) / 2, y + TILE - img.height, topoDoQuadro(img), n.dir || "down", { pecas });
    }
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
      if (mon) Assets.desenhaVivo(ctx, mon, bx + 1, by + 1, 24);
    };
    const p = this.st.party;
    cx(x, y, p[0]);
    drawText(ctx, "+", x + 29, y + 9, PAL.ink);
    cx(x + 38, y, p[1]);
    drawText(ctx, "=", x + 29, y + 37, PAL.ink);
    cx(x + 19, y + 32, null);
    drawText(ctx, "?", x + 30, y + 41, PAL.glitch);
  }

  /** O MENU START é um ROTOMFONE (src/core/rotomfone.js): ao abrir, ele sai
   *  voando da frente de você e cresce até o canto; aí os ícones aparecem. Em
   *  cima da tela, o nome do ícone escolhido. CONTATOS é a lista de quem liga. */
  desenharRotomfoneMenu(ctx, m) {
    const t = performance.now() / 1000;
    // PEQUENO e NA SUA FRENTE (pedido do CAIO): do lado pra onde você olha
    // (olhando pra cima/baixo, do lado direito), boiando; se não couber, do outro lado
    const w = 66, h = 86, eu = this._telaJogador || { x: W / 2 - 8, y: H / 2 - 16 };
    const pcx = eu.x + 8, pcy = eu.y + 6;
    let lado = this.st.player.dir === "left" ? -1 : 1;
    const xDe = (l) => (l > 0 ? pcx + 12 : pcx - 12 - w);
    if (xDe(lado) < 2 || xDe(lado) + w > W - 2) lado = -lado;
    const fim = {
      x: Math.max(2, Math.min(W - w - 2, xDe(lado))),
      y: Math.max(16, Math.min(H - h - 8, Math.round(pcy - h / 2))) + Math.round(Math.sin(t * 2.4)),
      w, h,
    };
    const k = m.abre ? Math.min(1, (performance.now() - m.abre) / 380) : 1;
    if (k < 1) {
      // voando: sai de você (as costas, com a cara do ROTOM) e cresce até o lugar
      const e = 1 - Math.pow(1 - k, 3);
      const s = 1 + e, fw = LARGURA_FONE * s, fh = ALTURA_FONE * s;
      const x = pcx + (fim.x + w / 2 - pcx) * e - fw / 2;
      const y = pcy + (fim.y + h / 2 - pcy) * e - fh / 2 - Math.sin(Math.PI * k) * 16;
      desenharRotomfone(ctx, Math.round(x), Math.round(y), Math.max(1, Math.round(s)), t);
      return;
    }
    const tela = desenharCorpoMenu(ctx, fim.x, fim.y, fim.w, fim.h, t);
    if (m.type === "contatos") {
      const lista = this.contatos(), T = ROTOMFONE_TEXTO;
      drawText(ctx, T.contatos, tela.x + 3, tela.y + 3, "#40d0e0");
      if (!lista.length) { drawText(ctx, "...", tela.x + 3, tela.y + 18, "#ffffff"); return; }
      const POR = 5, top = Math.max(0, Math.min(m.index - 2, lista.length - POR));
      lista.slice(top, top + POR).forEach((c, i) => {
        const y = tela.y + 16 + i * 12, sel = top + i === m.index;
        if (sel) { ctx.fillStyle = "#2c4a64"; ctx.fillRect(tela.x + 1, y - 2, tela.w - 2, 11); }
        desenharIcone(ctx, "CONTATOS", tela.x + 2, y - 2);
        drawText(ctx, this.nomeContato(c).slice(0, 6), tela.x + 16, y, sel ? "#ffd860" : "#ffffff");
      });
      return;
    }
    const items = this.itensMenu();
    const extra = { [DB.MISSAO_TEXTO?.titulo]: "MISSÕES", [DB.STORY.fusao.atualizar]: "BAIXAR" };
    // em cima, o nome do escolhido
    const nome = String(items[m.index] || "").slice(0, Math.floor(tela.w / 6));
    drawText(ctx, nome, tela.x + Math.max(2, (tela.w - nome.length * 6) / 2), tela.y + 3, "#40d0e0");
    const cel = 16, x0 = tela.x + Math.round((tela.w - COLUNAS_FONE * cel) / 2), y0 = tela.y + 13;
    const linhas = Math.floor((tela.h - 16) / cel);
    const linhaSel = Math.floor(m.index / COLUNAS_FONE);
    const primeira = Math.max(0, linhaSel - linhas + 1);
    items.forEach((it, i) => {
      const l = Math.floor(i / COLUNAS_FONE) - primeira;
      if (l < 0 || l >= linhas) return;
      const x = x0 + (i % COLUNAS_FONE) * cel, y = y0 + l * cel;
      if (i === m.index) {
        ctx.fillStyle = "#ffd860"; ctx.fillRect(x, y, cel - 1, cel - 1);
        ctx.fillStyle = "#16202c"; ctx.fillRect(x + 1, y + 1, cel - 3, cel - 3);
      }
      desenharIcone(ctx, it, x + 2, y + 2 - (i === m.index ? Math.round(Math.abs(Math.sin(t * 6))) : 0), extra);
    });
  }

  /** A CÂMERA (src/systems/fotos.js): TIRAR FOTO aqui mesmo, ou ver o ÁLBUM */
  abrirCamera() {
    const T = FOTO_TEXTO;
    this.dlg.ask(T.oQue, T.opcoes, (i) => {
      if (i === 0) return this.selfie();
      if (i === 1) this.game.scenes.push(new CameraRealScene(), {});
      if (i === 2) this.game.scenes.push(new FotosScene(), {});
    });
  }

  /** a SELFIE: com quem está na sua frente; sem ninguém, com o Pokémon que te
   *  segue; sem ele, só você */
  selfie() {
    const p = this.st.player, [dx, dy] = DIRS[p.dir] || [0, 1];
    const npc = this.npcAt(p.x + dx, p.y + dy);
    const pessoa = npc && !["ball", "portal", "bau"].includes(npc.sprite) && !npc.invisivel ? npc : null;
    if (pessoa) {
      const nome = pessoa.trainer?.name?.replace(/^(LÍDER|ELITE 4|CAMPEÃO|CAMPEÃ) /, "")
        || (pessoa.sprite === "rival" ? this.st.rivalNome || DB.RIVAL?.nome || "AZUL" : String(pessoa.sprite || "").toUpperCase());
      tirarFoto(this.st, { retrato: pessoa.sprite, ator: pessoa.sprite, nome });
    } else {
      const mon = this.quemSegue();
      if (mon) tirarFoto(this.st, { mon: mon.species, nome: mon.nickname });
      else tirarFoto(this.st, {});
    }
    this.game.autosave?.(true);
    this.dlg.say(T_SELFIE());
  }

  /** O dia de hoje (pra o selvagem 3D voltar no dia seguinte) */
  diaDeHoje() { const d = new Date(); return d.getFullYear() * 1000 + Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000); }

  /** OS SELVAGENS 3D: nasce numa água qualquer do mapa, nada pra lugares
   *  sorteados (só por água), e encostar nele começa a luta */
  atualizarSelvagens3D(dt) {
    const st = this.st, aqui = st.player.map;
    const S = SELVAGENS_3D.find((s) => s.mapa === aqui && st.flags?.[`selv3d_${s.id}`] !== this.diaDeHoje());
    if (!S) { this.solto3d = null; return; }
    pedirModelo(S.especie, S.modelo, S.mexe);
    const agua = (x, y) => this.tagAt(Math.round(x), Math.round(y)) === DB.TAG.WATER;
    let s = this.solto3d;
    if (!s || s.id !== S.id) {
      // nasce longe de você, numa água
      const W = this.geo?.w || 30, H = this.geo?.h || 30;
      let x = 0, y = 0;
      for (let k = 0; k < 400; k++) {
        x = Math.floor(Math.random() * W); y = Math.floor(Math.random() * H);
        if (agua(x, y) && Math.hypot(x - st.player.x, y - st.player.y) > 8) break;
      }
      s = this.solto3d = { id: S.id, x, y, alvo: null, ang: 0, t: 0, avisou: false };
    }
    s.t += dt;
    if (this.menu || this.dlg.active || this.dlg.choice || this.fx) return;
    if (!s.avisou) { s.avisou = true; this.avisar(S.aviso); }
    // nadando: escolhe um ponto de água por perto e vai até lá, virando devagar
    if (!s.alvo || Math.hypot(s.alvo.x - s.x, s.alvo.y - s.y) < 0.3) {
      for (let k = 0; k < 40; k++) {
        const a = Math.random() * Math.PI * 2, r = 3 + Math.random() * 7;
        const tx = s.x + Math.cos(a) * r, ty = s.y + Math.sin(a) * r;
        if (agua(tx, ty) && agua((s.x + tx) / 2, (s.y + ty) / 2)) { s.alvo = { x: tx, y: ty }; break; }
      }
    }
    if (s.alvo) {
      const dx = s.alvo.x - s.x, dy = s.alvo.y - s.y, d = Math.hypot(dx, dy) || 1;
      const passo = Math.min(d, S.velocidade * dt);
      const nx = s.x + (dx / d) * passo, ny = s.y + (dy / d) * passo;
      if (agua(nx, ny)) { s.x = nx; s.y = ny; } else s.alvo = null;
      // o ângulo do modelo: a cabeça (o -x dele) aponta pra onde ele nada
      const quer = Math.atan2(dy, -dx);
      let dif = quer - s.ang;
      while (dif > Math.PI) dif -= Math.PI * 2;
      while (dif < -Math.PI) dif += Math.PI * 2;
      s.ang += dif * Math.min(1, dt * 2);
    }
    // ENCOSTOU: a luta (e ele some até amanhã)
    if (Math.hypot(st.player.x - s.x, st.player.y - s.y) < S.encosta) {
      (st.flags ||= {})[`selv3d_${S.id}`] = this.diaDeHoje();
      this.solto3d = null;
      const b = { foe: createMon(S.especie, S.nivel), boss: false };
      this.entrarEmBatalha("selvagem", b, () => this.game.scenes.push(new BattleScene(), b));
    }
  }

  /** quem está nos CONTATOS agora (src/data/rotomfone.js) */
  contatos() { return CONTATOS.filter((c) => c.tem(this.st)); }
  /** o nome e o retrato de um contato (podem ser função do save, como o do GÊMEO) */
  nomeContato(c) {
    const n = typeof c.nome === "function" ? c.nome(this.st) : c.nome;
    return String(n).replace("{RIVAL}", this.st.rivalNome || DB.RIVAL?.nome || "AZUL");
  }
  retratoContato(c) { return typeof c.retrato === "function" ? c.retrato(this.st) : c.retrato; }

  /** LIGAR (ou atender): o ROTOMFONE grande no alto com o rosto de quem fala */
  ligar(c, recebida = false) {
    const T = ROTOMFONE_TEXTO;
    const conversas = c.falas(this.st) || [];
    const conversa = conversas[Math.floor(Math.random() * conversas.length)] || [];
    const nome = this.nomeContato(c);
    this.dlg.say([...(recebida ? [] : [T.ligando.replace("{NOME}", nome)]), ...conversa, T.desligou.replace("{NOME}", nome)]);
    this.dlg.fone = { retrato: this.retratoContato(c), t: 0 };
  }

  /** A LIGAÇÃO DO MISSINGNO. (src/data/rotomfone.js): o MISSINGNO. apareceu
   *  numa luta (src/scenes/battle.js marca "pendente"), e, de volta no mapa, o
   *  CARVALHO liga e manda a foto do PIKACHU SURPRESO. Uma vez só. */
  talvezLigarMissingno() {
    if (this.st.flags?.ligouMissingno !== "pendente") return;
    if (this.menu || this.dlg.active || this.dlg.choice || this.fx || this.fadeDir) return;
    const T = ROTOMFONE_TEXTO, L = LIGACAO_MISSINGNO;
    this.st.flags.ligouMissingno = true;
    this.game.autosave?.(true);
    for (let i = 0; i < 3; i++) setTimeout(() => Audio2.tone(1400, 0.08, "square", 0.15), i * 160);   // trim-trim
    const nome = "PROF. CARVALHO";
    this.dlg.ask(T.chamando.replace("{NOME}", nome), ["ATENDER"], () => {
      this.dlg.say([...L.falas, T.desligou.replace("{NOME}", nome)]);
      this.dlg.fone = { retrato: "prof", t: 0, imagem: L.imagem };
    });
    this.dlg.fone = { retrato: "prof", t: 0 };
  }

  /** alguém te liga de vez em quando (ROTOMFONE_TEXTO.intervalo, em segundos andando) */
  talvezTocarRotomfone(dt) {
    const T = ROTOMFONE_TEXTO;
    if (this.menu || this.dlg.active || this.dlg.choice || this.fx || !this.st.flags?.starterChosen) return;
    const [a, b] = T.intervalo;
    if (this.ligacaoT == null) this.ligacaoT = a + Math.random() * (b - a);
    this.ligacaoT -= dt;
    if (this.ligacaoT > 0) return;
    this.ligacaoT = a + Math.random() * (b - a);
    const lista = this.contatos();
    if (!lista.length) return;
    const c = lista[Math.floor(Math.random() * lista.length)];
    // trim-trim
    for (let i = 0; i < 3; i++) setTimeout(() => Audio2.tone(1400, 0.08, "square", 0.15), i * 160);
    this.dlg.ask(T.chamando.replace("{NOME}", this.nomeContato(c)), T.atender, (i) => {
      if (i === 0) this.ligar(c, true);
      else this.dlg.say(T.recusou);
    });
    this.dlg.fone = { retrato: this.retratoContato(c), t: 0 };
  }

  drawMenu(ctx) {
    const m = this.menu;
    if (m.type === "mapaRegiao") return this.drawMapaRegiao(ctx, m);
    if (m.type === "main" || m.type === "contatos") return this.desenharRotomfoneMenu(ctx, m);
    if (m.type === "party") {
      panel(ctx, 4, 4, W - 8, H - 8);
      drawText(ctx, m.titulo || "EQUIPE", 12, 10, PAL.ink);
      this.st.party.forEach((mon, i) => {
        const y = 24 + i * 24;
        if (i === m.index) cursor(ctx, 8, y + 7);
        // o ícone pula como nos jogos (src/systems/animon.js)
        const pulo = puloDoIcone(performance.now() / 1000, i === m.index, mon.hp <= 0);
        Assets.desenhaVivo(ctx, mon, 16, y - 2 + pulo, 24);      // animado (Assets.desenhaVivo)
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
        // o ITEM SEGURADO (src/data/segurar.js): o ícone dele no canto da linha
        if (mon.item) desenharItem(ctx, mon.item, 210, y + 2);
      });
      drawText(ctx, "Z: TRUNFO", 12, H - 20, PAL.ink2);
      // a AMIZADE do selecionado: até 255 é a de sempre; acima disso (as
      // técnicas do FENÔMENO DE VÍNCULO, src/data/vinculo.js) fica rosa, e no
      // ponto do vínculo avisa
      const sel = this.st.party[m.index];
      if (sel) {
        const amz = sel.amizade || 0, V = DB.VINCULO;
        const pronto = V && amz >= V.precisa;
        drawText(ctx, `${pronto ? "VÍNCULO" : "AMIZADE"} ${amz}`, 72, H - 20,
                 amz > (V?.max ?? 255) ? "#d04a8a" : PAL.ink2);
      }
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
        Assets.desenhaVivo(ctx, it.mon, 16, y - 3, 20);
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
        const y = 36 + i * LINE_H;                 // 9 opções: começa mais em cima pra caber
        drawText(ctx, o, 32, y, PAL.ink);
        if (i === m.index) cursor(ctx, 20, y);
      });
      // as duas gavetas e a saída, do jeito que estão desenhadas na carcaça
      this.desenhaGavetas(ctx, 130, 44);
      drawText(ctx, F.ajuda, 12, H - 22, PAL.ink2);
      return;
    }
    if (m.type === "portal") return this.renderPortal(ctx, m);
    if (m.type === "chat") return;             // a caixa de digitar é desenhada em `drawChat`
    if (m.type === "fusaoVersao") {
      const F = DB.STORY.fusao;
      const p = partes(m.mon.species);
      panel(ctx, 4, 4, W - 8, H - 8);
      drawText(ctx, F.escolheVersao, 12, 10, PAL.glitch);
      m.lista.forEach((v, i) => {
        const y = 26 + i * 20;
        if (y > 118) return;
        if (i === m.index) cursor(ctx, 8, y + 4);
        const sp = previsao({ species: p.cabeca }, { species: p.corpo }, v.variante, p.pernas ? { species: p.pernas } : null);
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
    if (m.type === "juntar") {
      const F = DB.STORY.fusao;
      panel(ctx, 4, 4, W - 8, H - 8);
      drawText(ctx, m.base ? F.juntarSegundo : F.juntarPrimeiro, 12, 10, PAL.glitch);
      const marcas = (mon) => [mon.luminoso ? "L" : mon.shiny ? "*" : "", mon.alfa ? "A" : ""].join("");
      m.lista.forEach((mon, i) => {
        const y = 26 + i * 18;
        if (y > 118) return;
        if (i === m.index) cursor(ctx, 8, y + 4);
        Assets.desenhaVivo(ctx, mon, 16, y, 18);
        drawText(ctx, mon.nickname.slice(0, 9), 38, y + 5, PAL.ink);
        drawText(ctx, marcas(mon), 96, y + 5, "#f0c419");
        drawText(ctx, `N${mon.level}`, 112, y + 5, PAL.ink2);
      });
      // a vitrine: o que sai se juntar
      panel(ctx, 142, 22, 92, 100);
      const escolhido = m.lista[m.index];
      // a prévia é guardada (não um objeto novo por quadro); o alfa que é seu
      // não tem olho vermelho, só o tamanho — então ela desenha sem a marca
      if (m.base && escolhido && m._previa?.de !== escolhido) m._previa = { de: escolhido, mon: { ...previaJunta(m.base, escolhido), alfa: false } };
      const mostra = m.base && escolhido ? m._previa.mon : escolhido;
      if (mostra) {
        Assets.desenhaVivo(ctx, mostra, 164, 26, 48);
        drawText(ctx, (m.base || mostra).nickname.slice(0, 14), 148, 78, PAL.ink);
        if (m.base) {
          const g = oQueGanhou(m.base, escolhido);
          drawText(ctx, g.length ? F.juntarGanha : F.juntarNada.slice(0, 14), 148, 90, g.length ? "#59d99b" : PAL.ink2);
          g.slice(0, 3).forEach((t, k) => drawText(ctx, t.slice(0, 14), 148, 100 + k * 10, "#f0c419"));
        } else {
          drawText(ctx, `N${mostra.level}`, 148, 90, PAL.ink2);
          const t = [mostra.luminoso ? "LUMINOSO" : mostra.shiny ? "SHINY" : "", mostra.alfa ? "ALFA" : ""].filter(Boolean).join(" ");
          if (t) drawText(ctx, t.slice(0, 14), 148, 100, "#f0c419");
        }
      }
      drawText(ctx, F.ajuda, 12, H - 22, PAL.ink2);
      return;
    }
    if (m.type === "fusaoCabeca" || m.type === "fusaoCorpo" || m.type === "fusaoAbrir") {
      const F = DB.STORY.fusao;
      panel(ctx, 4, 4, W - 8, H - 8);
      const titulo = m.type === "fusaoAbrir" ? (m.modo === "versao" ? F.escolheTrocar : m.modo === "inverter" ? F.escolheInverter : F.escolheFusao)
        : m.type === "fusaoCorpo" && m.modo === "tripla" ? (m.meio ? F.escolhePernas : F.escolheMeio)
        : m.type === "fusaoCorpo" ? F.escolheCorpo
        : m.modo === "concurso" ? DB.CONCURSO.anfitria.escolha
        : m.modo === "oficina" ? F.escolheOficina : F.escolheCabeca;
      drawText(ctx, titulo, 12, 10, PAL.glitch);
      const escolhido = m.lista[m.index];
      m.lista.forEach((mon, i) => {
        const y = 26 + i * 18;
        if (y > 118) return;
        if (i === m.index) cursor(ctx, 8, y + 4);
        Assets.desenhaVivo(ctx, mon, 16, y, 18);
        drawText(ctx, mon.nickname.slice(0, 11), 38, y + 5, ehFusao(mon) ? PAL.glitch : PAL.ink);
        drawText(ctx, `N${mon.level}`, 112, y + 5, PAL.ink2);
      });
      // a vitrine da direita: o que sai se você confirmar
      panel(ctx, 142, 22, 92, 100);
      if (m.type === "fusaoCorpo" && m.modo === "tripla" && m.meio) {
        // a TRIPLA: o que sai com esse nas PERNAS
        const vs = variantes(m.cabeca.species, m.meio.species, escolhido.species);
        const atual = vs[Math.min(m.variante || 0, vs.length - 1)] || vs[0];
        const sp = previsao(m.cabeca, m.meio, atual.variante, escolhido);
        if (sp) {
          ctx.drawImage(reduzido(Assets.mon(sp.id, m.cabeca.seed), 48), 164, 26, 48, 48);
          drawText(ctx, sp.name, 148, 78, PAL.ink);
          // três tipos não cabem inteiros: quatro letras de cada
          drawText(ctx, sp.types.map((t) => t.slice(0, 4)).join("/"), 148, 90, PAL.ink2);
          drawText(ctx, `TOTAL ${sp.bst}`, 148, 100, PAL.ink2);
          drawText(ctx, atual.rotulo, 148, 110, atual.origem === "auto" ? PAL.ink2 : "#59d99b");
          if (vs.length > 1) drawText(ctx, `C ${(m.variante || 0) + 1}/${vs.length}`, 148, 120, PAL.ink2);
        } else drawText(ctx, F.naoDaParaFundir.slice(0, 14), 148, 60, PAL.ink2);
      } else if (m.type === "fusaoCorpo" && m.modo !== "tripla") {
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
        drawText(ctx, (sp.types.length > 2 ? sp.types.map((t) => t.slice(0, 4)) : sp.types).join("/").slice(0, 14), 148, 90, PAL.ink2);
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
      const lista = this.itensDaMochila(m).map((k) => [k, this.st.items[k]]);
      // OS BOLSOS: as abas em cima, a da vez acesa (◀ ▶ troca)
      if (!m.escolher) {
        const bolsos = bolsosComItem(this.st);
        const atual = bolsos[Math.min(m.bolso || 0, bolsos.length - 1)];
        drawText(ctx, `◀ ${atual} ▶`, 120, 10, PAL.glitch);
        drawText(ctx, `${Math.min(m.bolso || 0, bolsos.length - 1) + 1}/${bolsos.length}`, 206, 10, PAL.ink2);
      }
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
        Assets.desenhaVivo(ctx, mon, 16, y - 2, 20);
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
        Assets.desenhaVivo(ctx, sel, 6, 126, 28);
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
      // lista comprida (Kanto + Braglitch): mostra 9 por vez e rola com o cursor
      const VEZ = 9, n = m.destinos.length;
      const top = Math.max(0, Math.min(n - VEZ, m.index - 4));
      const alt = Math.min(n, VEZ) * LINE_H + 26;
      panel(ctx, 30, 12, 180, alt);
      drawText(ctx, m.titulo || DB.FIELD_MOVES.voar.pergunta, 40, 18, PAL.ink);
      m.destinos.slice(top, top + VEZ).forEach(([id, nome], k) => {
        const i = top + k, y = 34 + k * LINE_H;
        drawText(ctx, nome, 50, y, regiaoDoMapa(id) === "kanto" ? PAL.ink : "#3a8a3a");
        if (i === m.index) cursor(ctx, 40, y);
      });
      if (top > 0) drawText(ctx, "^", 196, 34, PAL.ink2);
      if (top + VEZ < n) drawText(ctx, "v", 196, 34 + (VEZ - 1) * LINE_H, PAL.ink2);
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
        ["DIFICULDADE", dificuldadeDe(this.st).curto],
        ["BATALHA", this.st.flags?.batalhaExplosiva ? "EXPLOSIVA" : this.st.flags?.batalhaReal ? "TEMPO REAL" : "POR TURNO"],
        ["TELA SUAVE", nomeSuave(Opcoes.get("suave"))],
        ["ESTILO DE TROCA", Opcoes.get("estiloTroca") === "set" ? "SET" : "ALTERNAR"],
        ["MODO FUSÃO", this.st.flags?.modoFusao ? "ON" : "OFF"],
        ["FPS", String(Opcoes.get("fps") || 60)],
        ["LIMPAR SAVE", ""],
      ];
      // 15 linhas: o painel sobe e as linhas apertam (9 em vez de 11) pra
      // dica de baixo não cair dentro dele
      const LH = 9;
      panel(ctx, 30, 2, 180, linhas.length * LH + 16);
      drawText(ctx, `CORRUPÇÃO: ${Math.round(this.st.corruption)}%`, 40, 6, PAL.glitch);
      linhas.forEach(([rot, val], i) => {
        const y = 17 + i * LH;
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
      else if (m.index === 8) {
        const d = dificuldadeDe(this.st);
        drawText(ctx, `${d.nome}: ${d.dica}`.slice(0, 38), 12, 150, PAL.glitch);
      }
      else if (m.index === 9) drawText(ctx, "SEM TURNO, ATÉ EM DUPLA E HORDA.", 4, 150, PAL.glitch);
      else if (m.index === 10) drawText(ctx, "← → DE 0 A 5,5: OS PIXELS SE EMENDAM.", 4, 150, PAL.glitch);
      else if (m.index === 11) drawText(ctx, Opcoes.get("estiloTroca") === "set" ? "SET: NÃO PERGUNTA SE QUER TROCAR." : "PERGUNTA SE QUER TROCAR DE POKÉMON.", 4, 150, PAL.glitch);
      else if (aviso) drawText(ctx, aviso.slice(0, 38), 12, 150, PAL.ink2);
    }
  }
}

/** OS BRILHINHOS do shiny (e do luminoso) andando fora da bola: três estrelinhas
 *  de quatro pontas que acendem e apagam em volta dele, cada uma num lugar e no
 *  seu tempo. O shiny brilha branco e amarelo; o luminoso, ciano. */
function brilhinhos(ctx, x, y, tam, mon, semente = 0) {
  const t = performance.now() / 700;
  const cores = mon.luminoso ? ["#e8ffff", "#7af0ff"] : ["#ffffff", "#ffe060"];
  for (let i = 0; i < 3; i++) {
    const fase = (t + i / 3 + semente * 0.13) % 1;
    const ciclo = Math.floor(t + i / 3 + semente * 0.13);
    const a = (ciclo * 2.39 + i * 2.1 + semente) % (Math.PI * 2);
    const r = tam * (0.35 + ((ciclo * 7 + i) % 5) * 0.06);
    const sx = Math.round(x + Math.cos(a) * r), sy = Math.round(y - tam * 0.15 + Math.sin(a) * r * 0.8);
    const k = Math.sin(fase * Math.PI);             // acende e apaga
    if (k < 0.15) continue;
    const n = k > 0.7 ? 2 : 1;
    ctx.fillStyle = cores[1];
    ctx.fillRect(sx - n, sy, n * 2 + 1, 1); ctx.fillRect(sx, sy - n, 1, n * 2 + 1);
    ctx.fillStyle = cores[0]; ctx.fillRect(sx, sy, 1, 1);
  }
}


/** A TOCA DO COELHO no chão (a entrada e a saída da DIMENSÃO LITERARTE): um
 *  buraco escuro com a borda de terra e um tufinho de grama de cada lado. */
function desenharToca(ctx, x, y) {
  ctx.fillStyle = "#6b4426";                     // a terra em volta
  ctx.fillRect(x + 1, y + 5, 14, 9);
  ctx.fillRect(x + 3, y + 4, 10, 11);
  ctx.fillStyle = "#3a2312";                     // a borda de dentro
  ctx.fillRect(x + 3, y + 6, 10, 7);
  ctx.fillStyle = "#0c0705";                     // o fundo, preto
  ctx.fillRect(x + 4, y + 7, 8, 5);
  ctx.fillRect(x + 5, y + 6, 6, 7);
  ctx.fillStyle = "#4f9a3c";                     // os tufos
  ctx.fillRect(x, y + 11, 2, 3); ctx.fillRect(x + 14, y + 6, 2, 3);
}
