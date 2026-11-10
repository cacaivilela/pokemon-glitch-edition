// Cena de batalha por turnos. O fluxo usa async/await: cada `await this.say()`
// espera o jogador apertar Z, o que deixa a logica linear e facil de estender.
import { desenharPokebloco } from "./liquidificador.js";
import { darAoSelvagem, passaTurnoPokebloco, largoDoPokebloco, aoCapturar } from "../systems/pokeblocos.js";
import { musicaDaBatalha } from "../systems/musicabatalha.js";
import { DB } from "../data/index.js";
import { emBraglitch } from "../systems/regionais.js";
import { bolaPorItem, jogou as jogouBola } from "../data/bolas.js";
import { Assets } from "../core/assets.js";
import { trainerArt, adiantarMons } from "../core/sprites.js";
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { tocarGrito, SEMITOM } from "../systems/gritos.js";
import { panel, drawText, cursor, bar, hpColor, fade, PAL, LINE_H } from "../core/gfx.js";
import { Dialogue } from "../systems/dialogue.js";
import { Glitch } from "../systems/glitchfx.js";
import { shinyDoEvento, hojeDoEvento } from "../systems/raid.js";
import { contarSurto } from "../systems/surtos.js";
import { MT_DO_LIDER, MAQ_TEXTO, itemDaMT } from "../data/maquinas.js";
import { bonusDaBola } from "../systems/bolas.js";
import { contarCaptura, contarVitoria, contar as contarPesquisa } from "../systems/pesquisa.js";
import { Opcoes } from "../core/opcoes.js";
import { randRange } from "../core/rng.js";
import { DESOBEDIENCIA, chanceDeEscapar, escapar, RAIVA, desobedeceu, obedeceu, ordemForcada, nivelDeRaiva, cacadorPegou } from "../systems/pokesave.js";
import { cenaDoGolpe } from "../systems/cutscenes.js";
import { veu, temCeu } from "../systems/ciclo.js";
import { fator } from "../systems/acampamento.js";
import { partes } from "../systems/fusao.js";
import { podeUsarBooster, ligar, acumular, bugado, bonusDe, limpar, limparTudo } from "../systems/glitchboost.js";
import { bater, podeCapturar, premio as premioRaid, RAID, marcarRaidDeEvento } from "../systems/raid.js";
import { GLITCHBOOSTER } from "../data/glitch.js";
import { baseDoCardume, escalaDoCardume } from "../systems/cardume.js";
import { hpPct, isFainted, gainXp, xpYieldFor, xpForLevel, heal, createMon, recalc } from "../systems/mon.js";
import { prepararBatalha, fatorCaptura, fatorXp } from "../systems/pedras.js";
import { ajustarInimigo, fatorDano } from "../systems/dificuldade.js";
import {
  calcDamage, accuracyCheck, applyMoveEffects, statusTickDamage, effText,
  chooseAiMove, catchAttempt, catchGlitchball, chanceDeCaptura, canFlee, newStages, effectiveStat,
  aoSerCurado, aoApanhar, devolveu,
} from "../systems/battle-engine.js";
import { TAMPA, jeitoDaMao, ajudaDaMao } from "../systems/tampa.js";
import { habilidadeDoMon, entrada as entradaDaHabilidade, contato as contatoDaHabilidade, curaDoTurno, ficaNaBola,
         precisao, robustez, aoDerrubar, fimDoTurno, peleAspera } from "../systems/habilidades.js";
import { opcoesMega, megaEvoluir, reverterMega, reverterTudo } from "../systems/mega.js";
import { animDesenhada } from "../systems/animdesenho.js";
import { ajustarForma, saiuDaLuta, virarEternamax, voltarDoEternamax, transformar, desfazerTransformacao } from "../systems/formas.js";
import { podeVirar, virarVinculo, corDoVinculo, aguentouJunto, marcarVitoria } from "../systems/vinculo.js";
import { PEDRA_BUGADA } from "../data/pedra-bugada.js";
import { podeSerReal, iniciar as iniciarReal, atualizar as atualizarReal, desenhar as desenharReal } from "../systems/batalhareal.js";
import { podeSerExplosiva, iniciar as iniciarExplosiva, atualizar as atualizarExplosiva, desenhar as desenharExplosiva } from "../systems/batalhaexplosiva.js";
import { tocarMega } from "./mega.js";
import { DYNAMAX, golpeMax, lutaGrande, podeAqui as podeDynamaxAqui, dynamaxar, desdynamaxar } from "../systems/dynamax.js";
import { marcarSecreta } from "../systems/secretas.js";
import { cumprirProcurado } from "../systems/bicos.js";
import { venceu as venceuAmizade } from "../systems/creche.js";
import { metaUsou } from "../systems/metas.js";
import { fotoDaLuta, fotoDaCaptura, FOTO_TEXTO } from "../systems/fotos.js";
import { reduzido } from "../core/reduzir.js";
import { desenharItem } from "../core/itens.js";
import { segura, comerBerry, curaDasSobras, segurarComFoco, garraBrilhou, fatorXp as fatorXpItem, talvezSegurando, itensDoLider, depoisDoGolpe } from "../systems/segurar.js";
import { isoLigado, chaoDeBatalhaIso, plataformaIso, emPeIso } from "../core/isometrico.js";

const W = 240, H = 160;

// os tempos da animação de desmaio (em segundos; ver BattleScene.desmaia)
const DESMAIO = { cai: 0.45, deitado: 0.4, volta: 0.45 };

export class BattleScene {
  enter(args = {}) {
    const st = this.game.state;
    prepararBatalha(st);            // as PEDRAS BRAGLITCHIANAS da mochila valem aqui
    this.trainer = args.trainer || null;
    this.npcKey = args.npcKey || null;
    // LUTA NO MAPA (src/systems/lutamapa.js): sem tela de batalha nenhuma — esta
    // cena fica transparente por cima do mapa, só com as falas do fim da luta
    this.noMapa = !!(args.capturadoNoMapa || args.venceuNoMapa);
    this.transparent = this.noMapa;
    this.flagVitoria = args.flagVitoria || null;   // venceu ou pegou: marca no save (as missões conferem)
    this.flagCaptura = args.flagCaptura || null;   // só se PEGOU (o PIKACHU SHINY das cores travadas)
    this.isGlitch = !!args.glitch;
    this.boss = !!args.boss;
    this.falaCaptura = args.falaCaptura || null;   // o SACI tem a dele
    this.foeParty = this.trainer
      ? this.trainer.party.map((p) => createMon(p.id, p.lvl, { corrupt: !!p.corrupt, shiny: !!p.shiny }))
      : [args.foe];
    // OS ITENS DE SEGURAR (src/systems/segurar.js): dos treinadores, só os
    // LÍDERES seguram; o selvagem às vezes já vem segurando (e vem junto na captura)
    if (this.trainer?.badge || this.trainer?.lider) itensDoLider(this.foeParty);
    else if (!this.trainer && !args.boss) talvezSegurando(args.foe);
    // a DIFICULDADE da partida mexe no nível de quem está do lado de lá
    this.foeParty.forEach((m) => ajustarInimigo(m));
    this.foeIdx = 0;
    // pede os sprites de quem vai lutar ANTES da transição de entrada: ela leva
    // quase um segundo, e nesse tempo o arquivo chega — senão o bicho aparece
    // como arte provisória no primeiro quadro da batalha
    adiantarMons([...this.foeParty, ...st.party]
      .filter(Boolean)
      .map((m) => DB.SPECIES[m.species])
      .filter(Boolean)
      .map((sp) => ({ id: sp.id, dex: sp.spriteDex || sp.dex })));
    this.playerIdx = st.party.findIndex((m) => !isFainted(m));
    if (this.playerIdx < 0) this.playerIdx = 0;

    this.dlg = new Dialogue();
    this.timers = [];
    this.waits = [];
    this.busy = true;
    this.menu = null;
    this.fleeTries = 0;
    this.fadeA = 1;
    this.fadeDir = -1;
    this.shake = 0;
    this.ballAnim = null;
    this.t = 0;
    // retrato do treinador: fica na frente até ele soltar o primeiro Pokémon
    this.showTrainer = !!this.trainer;
    this.tOut = 0;
    trainerArt(this.trainer?.sprite);   // começa a carregar
    this.pStages = newStages();
    this.fStages = newStages();
    // MEGA EVOLUÇÃO: uma por lado, por batalha. `megaArmada` é o que o jogador
    // escolheu com C e ainda não aconteceu — ela dispara no começo do turno.
    this.megou = { p: false, f: false };
    // o som da mega já carregando, pra tocar na primeira vez
    Audio2.somArquivoCarregar("assets/sons/mega-evolucao.wav"); Audio2.somArquivoCarregar("assets/sons/mega-evolucao.mp3");
    this.megaArmada = null;
    this.flash = 0;
    this.fx = [];                 // os efeitos das cutscenes de golpe
    this.raid = args.raid || null;   // GLITCH RAID: a casca do chefe
    // O TOTEM de uma PROVAÇÃO (src/systems/provacoes.js). Ele não vem por
    // argumento: vem DENTRO do bicho, porque quem monta o totem é o mundo e o
    // que chega aqui é só um Pokémon grande com uma aura pendurada.
    this.totem = this.foe?.totem || null;
    this.cristalUsado = false;       // o GOLPE Z é uma vez por batalha
    // O DYNAMAX (src/systems/dynamax.js): uma vez por lado, por batalha; V arma
    this.dyUsado = { p: false, f: false };
    this.dyArmado = false;
    this.dyTeste = !!args.dyTeste;   // ?battle=...&dynamax=1 (src/main.js)
    this.zArmado = false;
    // O CLIMA (src/data/habilidades.js): a TEMPESTADE chove sempre; o resto
    // vem de habilidade de entrada ou de golpe, por cinco turnos.
    this.clima = st.player?.map === "tempestade" ? { tipo: "chuva", turnos: Infinity } : null;
    // O TEMPO DO MUNDO (src/systems/tempo.js): chovendo lá fora, chove na batalha; sol forte, sol
    if (!this.clima && st.tempo && Date.now() < st.tempo.ate && temCeu(DB.MAPS?.[st.player?.map])) {
      const tp = st.tempo.tipo;
      if (tp === "chuva" || tp === "temporal") this.clima = { tipo: "chuva", turnos: 8 };
      else if (tp === "sol") this.clima = { tipo: "sol", turnos: 8 };
    }
    this.chuvaT = 0;
    // A MEGA DESCONTROLADA (src/data/descontroladas.js): HP de chefe e a fúria
    // já subindo o ATAQUE e o ATAQUE ESP.
    this.descontrolada = args.descontrolada || null;
    if (this.descontrolada) {
      // a entrada da lista pode trazer os números dela (a MEGA FLOETTE da
      // LUMIOSE, src/data/kalos.js, é a HIPER-DESCONTROLADA)
      const D = DB.DESCONTROLADAS || {};
      this.foe.maxHp *= this.descontrolada.hpVezes || D.hpVezes || 3;
      this.foe.hp = this.foe.maxHp;
      this.fStages.atk = this.fStages.spa = this.descontrolada.furia ?? D.furia ?? 1;
    }
    this.disp = { p: this.mine.hp, f: this.foe.hp };
    this.sp = { p: this.newSprite(-90), f: this.newSprite(90) };
    // o chefe entra do tamanho de um filhote; `crescer()` faz o resto
    if (this.raid) this.sp.f.escala = RAID.cresceDe;
    // o CARDUME é grande e vai encolhendo com o HP (os peixinhos se espalham)
    if (this.foe && baseDoCardume(this.foe.species)) this.sp.f.escala = escalaDoCardume(this.foe);
    // o ALFA entra grande e fica grande — do seu lado também, se for seu
    if (!this.raid && this.foe?.alfa) this.sp.f.escala = 1.3;
    if (this.totem) this.sp.f.escala = DB.TOTEM?.tamanho || 1.35;
    if (this.mine?.alfa) this.sp.p.escala = 1.3;
    // os MINI lendários do espaço (src/data/espaco.js): pequenininhos
    if (this.foe?.mini) this.sp.f.escala = 0.6;
    if (this.mine?.mini) this.sp.p.escala = 0.6;
    if (this.descontrolada) this.sp.f.escala = 1.25;
    this.crescendo = null;
    // NOVO NA POKÉDEX: avisa NA HORA que ele foi anotado como VISTO (pedido do CAIO)
    this.novoVisto = !st.seen[this.foe.species] && !!st.flags?.pokedex;
    st.seen[this.foe.species] = true;

    // a música da região e do tipo de batalha (src/systems/musicabatalha.js).
    // Quem entrou pelo mapa já chega com ela tocando (a entrada da batalha
    // começa a música): aí não recomeça.
    const nome = this.descontrolada ? "megaDescontrolada" : this.isGlitch ? "batalhaGlitch"
      : musicaDaBatalha(this, st.player.map);
    if (!this.noMapa && !Audio2.estaTocando(nome)) Audio2.playMusic(nome, DB.MUSIC?.[nome] || DB.MUSIC?.batalha);

    // TEMPO REAL (OPÇÕES, src/systems/batalhareal.js): no lugar do menu de turno, a arena
    this.modoReal = podeSerReal(this);
    // EXPLOSIVA (OPÇÕES, src/systems/batalhaexplosiva.js): a arena de lado, tudo destrutível
    this.modoExplosivo = !this.modoReal && podeSerExplosiva(this);
    // LUTA NO MAPA (src/systems/lutamapa.js): a luta já foi; aqui é só o fim dela
    if (this.noMapa) this.fadeA = 0, this.fadeDir = 0;
    this.run(args.capturadoNoMapa ? this.fimDaCapturaNoMapa() : args.venceuNoMapa ? this.fimDaVitoriaNoMapa() : this.intro());
  }

  async fimDaCapturaNoMapa() {
    this.menu = null;
    await this.say(`GOTCHA! ${this.foe.nickname} FOI CAPTURADO!`);
    if (reverterMega(this.foe)) await this.say(DB.STORY.mega.voltou.replace("{MON}", this.foe.nickname));
    await this.guardarCapturado();
  }

  async fimDaVitoriaNoMapa() {
    this.menu = null;
    this.foeIdx = this.foeParty.length - 1;
    this.foe.hp = 0;
    this.modoReal = false;
    await this.onFoeFaint();
  }

  exit() { Audio2.stopLoop(); }

  /** O TOTEM DIGLETT, da cabeça pra baixo (src/core/diglettbombado.js). Ele
   *  não é quadrado como os outros sprites, então não passa pelo `drawMon`: é
   *  desenhado em pé na plataforma, com os pés nela e os punhos no alto da
   *  tela. 3/4 do tamanho, sem suavizar — a peça inteira tem 99 px de altura e
   *  a tela de batalha não tem isso livre acima da caixa de status. A batalha
   *  em grupo (src/scenes/grupobattle.js) chama esta mesma função com o lugar e
   *  o tamanho da vaga dele. */
  drawDiglettBombado(ctx, fimg, bob, sp = this.sp.f, mon = this.foe, cx = 178, pe = 72, k = 0.75) {
    if (sp.blink > 0 && Math.floor(sp.blink * 22) % 2 === 0) return;
    const inteiro = Assets.diglettBombado(Assets.comCor(fimg, mon));
    const l = sp.lunge > 0 ? -Math.sin((0.3 - sp.lunge) / 0.3 * Math.PI) * 12 : 0;
    const w = Math.round(inteiro.width * k), h = Math.round(inteiro.height * k);
    // encolhido pelo redutor de pixel art: o DIGLETT de cima não perde o olho
    const img = reduzido(inteiro, w, h);
    ctx.globalAlpha = sp.alpha;
    ctx.drawImage(img, Math.round(cx - w / 2 + sp.dx + l), Math.round(pe - h + sp.dy + bob), w, h);
    ctx.globalAlpha = 1;
  }

  /** O chefe de GLITCH RAID nasce com a escala dele: se ele voltar pra tela por
   *  outro caminho (trocar de bicho, reviver), volta grande, e não do tamanho
   *  de um selvagem. */
  /** A ANIMAÇÃO DE DESMAIO (pedido do CAIO, nov/2026): ele dá o grito 2
   *  semitons mais grosso (o ALFA, que já grita 4 abaixo, fica 6), CAI DE
   *  COSTAS — e, se estava numa forma que não é a normal (mega, vínculo,
   *  cardume, herói), volta pra normal na hora da queda —, bate no chão e
   *  ENCOLHE com o som de voltar pra pokébola. Se ele tem treinador (o seu,
   *  sempre; o do inimigo, se for luta de treinador), um RAIO VERMELHO vem
   *  dele e puxa o Pokémon pra dentro da bola. O desenho é em drawMon. */
  async desmaia(who) {
    const mon = who === "p" ? this.mine : this.foe, s = this.sp[who];
    s.faint = true;                       // as auras e o rastro dos olhos param
    // (o `desmaio` já existe no grito: sem ele, o update apaga quem está `faint`)
    s.desmaio = { fase: "grito", t: 0, dir: who === "p" ? -1 : 1, raio: who === "p" || !!this.trainer, who };
    const grito = tocarGrito(mon, SEMITOM ** -2) || 0.6;
    await this.wait(Math.min(1.1, Math.max(0.45, grito * 0.85)));
    if (mon.megaDe) reverterMega(mon);    // a forma normal, já caindo
    voltarDoEternamax(mon);               // (o ETERNAMAX também)
    desfazerTransformacao(mon);           // (e o DITTO transformado)
    s.desmaio = { ...s.desmaio, fase: "cai", t: 0 };
    await this.wait(DESMAIO.cai);
    Audio2.baque();
    this.shake = Math.max(this.shake, 0.12);
    await this.wait(DESMAIO.deitado);
    s.desmaio = { ...s.desmaio, fase: "volta", t: 0 };
    Audio2.voltaBola();
    await this.wait(DESMAIO.volta + 0.1);
    s.desmaio = null;
    s.alpha = 0;
  }

  newSprite(dx) {
    return { dx, dy: 0, alpha: 1, blink: 0, lunge: 0, faint: false,
             escala: this.raid ? RAID.tamanho : 1 };
  }

  /** O PALCO DA CUTSCENE. A cena (src/systems/cutscenes.js) não desenha nada:
   *  ela pede efeito, espera, treme, clareia — e quem desenha é o `drawFx` aqui
   *  embaixo, do mesmo jeito pra todos. `battleAnim` continua mandando: em 0 não
   *  tem cutscene nenhuma, e em 2 ela passa no dobro da velocidade. */
  async cutscene(who, id, mv) {
    const vel = DB.CONFIG?.battleAnim ?? 1;
    if (!vel) return;
    const alvo = who === "p" ? "f" : "p";
    const centro = (k) => (k === "f" ? { x: 178, y: 36 } : { x: 46, y: 78 });
    const palco = {
      de: centro(who), para: centro(alvo), dir: who === "p" ? 1 : -1,
      som: Audio2,
      // a cor do tipo, pronta: a cena desenha, quem sabe de dados é daqui
      cor: DB.TYPE_COLOR?.[mv?.type] || "#ffffff",
      fx: (o) => this.fx.push({ t: 0, vida: 0.4, fade: true, vx: 0, vy: 0, g: 0, gira: 0, ang: 0, ...o }),
      wait: (s) => this.wait(s / vel),
      flash: (a) => { this.flash = Math.max(this.flash, a); },
      shake: (t) => { this.shake = Math.max(this.shake, t); },
      piscaAlvo: (t) => { this.sp[alvo].blink = Math.max(this.sp[alvo].blink, t); },
      avanca: () => this.lunge(who),
      somem: () => { this.sp[who].alpha = 0; },
      voltam: () => { this.sp[who].alpha = 1; },
      glitch: (n) => Glitch.hit(n),
    };
    try {
      // A ANIMAÇÃO QUE O CAIO DESENHOU (src/systems/animdesenho.js), quando tem
      const ad = animDesenhada(id);
      if (ad) await this.tocarAnimDesenhada(ad, who, alvo, vel);
      else await cenaDoGolpe(id, mv)(palco);
    } finally {
      // cena que esconde alguém e quebra no meio não pode deixar o bicho sumido
      if (!this.sp[who].faint) this.sp[who].alpha = 1;
    }
  }

  /** O RASTRO DOS OLHOS do ALFA SELVAGEM (pedido do CAIO, nov/2026): onde o
   *  olho vermelho esteve nos últimos 0,35 s fica uma risca vermelha que vai
   *  apagando — o bicho se mexe e o olho deixa luz pra trás. `onde` é o que o
   *  drawMon desenhou (o desenho tem `_olhos`: as caixas dos olhos nele). */
  rastroDosOlhos(ctx, onde) {
    const agora = this.t;
    const r = (this.rastro ||= []);
    const img = onde?.img;
    if (img?._olhos && this.foe?.alfa && this.sp.f.alpha > 0 && !this.sp.f.faint) {
      const kx = onde.w / img.width, ky = onde.h / img.height;
      for (const [x0, y0, x1, y1] of img._olhos) {
        r.push({ x: onde.dx + ((x0 + x1 + 1) / 2) * kx, y: onde.dy + ((y0 + y1 + 1) / 2) * ky, t: agora, fase: Math.random() * 6.3 });
      }
    }
    while (r.length && agora - r[0].t > 0.35) r.shift();
    if (r.length > 200) r.splice(0, r.length - 200);
    // O FOGO: começa VERMELHO forte (o olho), passa pelo laranja e apaga no
    // vinho, fininho, balançando de lado e subindo só um pouco
    const FOGO = [[255, 40, 32], [255, 90, 28], [240, 130, 30], [200, 36, 24], [130, 14, 18]];
    for (const p of r) {
      const vida = 1 - (agora - p.t) / 0.35;
      if (vida <= 0) continue;
      const k = Math.min(FOGO.length - 1, Math.floor((1 - vida) * FOGO.length));
      const [cr, cg, cb] = FOGO[k];
      ctx.fillStyle = `rgba(${cr},${cg},${cb},${(0.35 + 0.6 * vida).toFixed(2)})`;
      const lado = vida > 0.6 ? 2 : 1;
      const sobe = (1 - vida) * 3;                                   // sobe só um pouquinho
      const balanca = Math.sin(agora * 22 + p.fase) * (1 - vida) * 0.8;   // a chama tremendo
      ctx.fillRect(Math.round(p.x + balanca - lado / 2), Math.round(p.y - sobe - lado / 2), lado, lado);
    }
  }

  /** é o MISSINGNO. (ou o megado dele)? */
  ehMissingno() { return /missingno|m155ingno/.test(this.foe?.species || ""); }

  /** um 0 ou um 1 saindo do MISSINGNO., pra qualquer lado, caindo devagar */
  soltarBit(forca = 1) {
    const ang = Math.random() * Math.PI * 2, v = (20 + Math.random() * 45) * forca;
    this.fx.push({ t: 0, vida: 0.9 + Math.random() * 0.5, fade: true, forma: "bit",
                   txt: Math.random() < 0.5 ? "0" : "1", cor: Math.random() < 0.66 ? "#59d99b" : "#b455ff",
                   x: 178 + (Math.random() - 0.5) * 30, y: 36 + (Math.random() - 0.5) * 30,
                   vx: Math.cos(ang) * v, vy: Math.sin(ang) * v * 0.8, g: 18, gira: 0, ang: 0 });
  }

  /** A HISTÓRIA DOS LUMINOSOS (DB.STORY.historiaLuminoso): só na primeira vez
   *  que você encontra um. */
  async contarHistoriaLuminoso() {
    const fl = this.st.flags || (this.st.flags = {});
    if (fl.historiaLuminoso || !DB.STORY.historiaLuminoso) return;
    fl.historiaLuminoso = true;
    for (const l of DB.STORY.historiaLuminoso) await this.say(l);
  }

  /** O BRILHO DO SHINY (e do LUMINOSO): duas ondas de estrelas saindo dele,
   *  umas faíscas por cima do corpo e o plim (Audio2.shiny). Uma vez por
   *  entrada: o sprite novo de cada entrada (`newSprite`) zera a marca. */
  async brilhar(who) {
    const mon = who === "p" ? this.mine : this.foe;
    const sp = this.sp[who];
    if (!(mon?.shiny || mon?.luminoso) || sp.brilhou) return;
    sp.brilhou = true;
    const c = who === "f" ? { x: 178, y: 38 } : { x: 46, y: 80 };
    const cores = mon.luminoso ? ["#ffffff", "#fff3b0", "#e8f6ff"] : ["#fff8c0", "#ffe060", "#ffffff"];
    const cor = () => cores[Math.floor(Math.random() * cores.length)];
    if (mon.luminoso) Audio2.luminoso(); else Audio2.shiny();
    for (let onda = 0; onda < 2; onda++) {
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + onda * 0.39;
        const v = 48 + onda * 14;
        this.fx.push({ t: 0, vida: 0.6, fade: false, forma: "estrela", cor: cor(), r: 4 - onda,
                       x: c.x + Math.cos(a) * 5, y: c.y + Math.sin(a) * 5,
                       vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 0, gira: 0, ang: 0 });
      }
      // faíscas piscando em cima do corpo
      for (let i = 0; i < 5; i++) {
        this.fx.push({ t: 0, vida: 0.45, fade: false, forma: "estrela", cor: cor(), r: 2 + Math.round(Math.random() * 2),
                       x: c.x + (Math.random() - 0.5) * 40, y: c.y + (Math.random() - 0.5) * 36,
                       vx: 0, vy: -10, g: 0, gira: 0, ang: 0 });
      }
      await this.wait(0.28);
    }
    await this.wait(0.4);
  }

  /** AS FORMAS DE BATALHA (src/systems/formas.js): se for a hora, troca, com
   *  o clarão e o tremidinho de quem muda de corpo. */
  async trocaDeForma(who) {
    const mon = who === "p" ? this.mine : this.foe;
    const texto = ajustarForma(mon);
    if (!texto) return;
    this.flash = 0.5;
    this.sp[who].dx = who === "p" ? -10 : 10;
    Audio2.tone(392, 0.08, "square", 0.5);
    Audio2.tone(587, 0.12, "square", 0.5);
    this.disp[who] = mon.hp;
    await this.wait(0.35);
    await this.say(texto);
  }

  /** golpe: o sprite avança e volta */
  async lunge(who) {
    if (!DB.CONFIG?.battleAnim) return;
    this.sp[who].lunge = 0.3;
    await this.wait(0.16);
  }

  get st() { return this.game.state; }
  get mine() { return this.st.party[this.playerIdx]; }
  // todo Pokémon que entra na luta passa por aqui: as METAS de um tipo só conferem
  get playerIdx() { return this._playerIdx; }
  set playerIdx(i) {
    // quem sai da luta dynamaxado volta ao tamanho normal
    const antes = this.st.party[this._playerIdx];
    if (i !== this._playerIdx && antes?.dynamax) {
      desdynamaxar(antes);
      if (this.sp?.p) { this.sp.p.dyAlvo = null; this.sp.p.escala = (this.sp.p.escala || DYNAMAX.escala) / DYNAMAX.escala; }
    }
    this._playerIdx = i; metaUsou(this.st, this.st.party[i]);
  }
  get foe() { return this.foeParty[this.foeIdx]; }

  // ------------------------------------------------- helpers de fluxo
  run(promise) {
    this.busy = true;
    promise.then(() => { this.busy = false; }).catch((e) => {
      this.busy = false;
      console.error(e);
      setTimeout(() => { throw e; }); // vira window.onerror -> overlay do dev server
    });
  }
  say(text) { return new Promise((res) => this.dlg.say(text, res)); }
  ask(text, options) { return new Promise((res) => this.dlg.ask(text, options, res)); }
  wait(sec) { return new Promise((res) => this.timers.push({ t: sec, res })); }
  until(fn) { return new Promise((res) => this.waits.push({ fn, res })); }

  /** Espera o chefe terminar de crescer. Quem faz a conta é o `update`: assim o
   *  inchaço anda no relógio do jogo e não numa fila de setTimeout. */
  crescer() {
    if (!this.raid) return Promise.resolve();
    this.crescendo = { t: 0, dur: RAID.cresceEm, de: RAID.cresceDe, para: RAID.tamanho };
    return this.until(() => !this.crescendo);
  }

  /** O CAMINHO DE VOLTA: ele desinfla até sumir. Mesma conta do crescer, ao
   *  contrário — o chefe entra ficando grande e sai ficando pequeno, e é isso
   *  que faz o fim parecer o começo rodando pra trás. */
  encolher() {
    this.crescendo = { t: 0, dur: RAID.cresceEm * 0.55, de: this.sp.f.escala, para: 0 };
    return this.until(() => !this.crescendo);
  }
  syncHp() { return this.until(() => this.disp.p === this.mine.hp && this.disp.f === this.foe.hp); }

  // ---------------------------------------------------------- roteiro
  async intro() {
    await this.wait(0.6);
    if (this.trainer) {
      await this.say(`${this.trainer.name} QUER BATALHAR!`);
      await this.trainerOut();
      await this.say(`${this.trainer.name} ENVIOU ${this.foe.nickname}!`);
    } else if (this.totem) {
      // as falas de acordar são da provação (src/data/provacoes.js): o que sobe
      // da marca muda de uma pra outra, e é isso que faz dezoito lutas de chefe
      // não serem a mesma luta dezoito vezes
      Audio2.tone(147, 0.3, "triangle", 0.5);
      for (const linha of this.totem.acorda || []) await this.say(linha);
      await this.say((DB.PROVACOES_TEXTO?.apareceu || "O TOTEM {MON} SE LEVANTA!")
        .replace("{MON}", this.foe.nickname));
    } else if (this.descontrolada) {
      const T = this.textosDescontrolada();
      this.flash = 0.6;
      Audio2.tone(98, 0.5, "sawtooth", 0.5);
      await this.say(T.entra.replace("{MON}", this.foe.nickname));
      await this.say(T.furia);
    } else if (this.raid) {
      // a GLITCH RAID nunca tinha se apresentado: `raidApareceu` estava escrito
      // no story.js e não era dito por ninguém
      if (DB.CONFIG?.sustos && !this.raid.ultra) { Glitch.hit(3); Audio2.glitch(); }
      else Audio2.tone(147, 0.3, "triangle", 0.5);
      await this.say(this.textosDaRaid().raidApareceu);
      await this.crescer();
      if (this.foe.shiny) { await this.wait(0.3); await this.brilhar("f"); }
      await this.say(`${this.foe.nickname} ESTÁ NO CAMINHO.`);
      const n = this.raid.estrelas || 1;
      await this.say(`É UMA ${this.raid.ultra ? "ULTRA " : ""}RAID DE ${n} ESTRELA${n > 1 ? "S" : ""}!`);
      await this.say(this.textosDaRaid().raidBugado.replace("{NOME}", this.foe.nickname));
    } else if (this.isGlitch) {
      Glitch.hit(2);
      if (this.ehMissingno()) for (let i = 0; i < 40; i++) this.soltarBit(2.2);   // a rajada da chegada
      if (this.foe.shiny || this.foe.luminoso) { await this.wait(0.5); await this.brilhar("f"); }
      await this.say(`UM ${this.foe.nickname} SELVAGEM APARECEU!`);
      const sp = DB.SPECIES[this.foe.species];
      if (this.foe.luminoso) await this.say("A LUZ DELE NÃO VEM DE LUGAR NENHUM. ELE É A LUZ.");
      if (this.foe.luminoso) await this.contarHistoriaLuminoso();
      else if (this.foe.shiny) await this.say("A COR DELE ESTÁ ERRADA. OU CERTA DEMAIS. ELE BRILHA.");
      // cada espécie da fenda tem a frase dela (src/data/extra.js -> LORE)
      if (sp?.lore) await this.say(sp.dexText);
      else if (sp?.foreign) await this.say("ESTE POKÉMON NÃO É DE KANTO. NEM DESTE MUNDO.");
      else if (!this.foe.shiny && !this.foe.luminoso) await this.say("ESTE POKÉMON NÃO CONSTA NA POKÉDEX. NEM NO CARTUCHO.");
    } else {
      // o SHINY brilha assim que chega, antes de qualquer texto
      if (this.foe.shiny || this.foe.luminoso) { await this.wait(0.5); await this.brilhar("f"); }
      await this.say(`UM ${this.foe.nickname}${this.foe.alfa ? " ALFA" : ""} SELVAGEM APARECEU!`);
      if (this.novoVisto) { Audio2.tone(880, 0.05); Audio2.tone(1175, 0.08); await this.say(`${this.foe.nickname} FOI ANOTADO NA POKÉDEX: VISTO!`); }
      // um que VOCÊ SOLTOU (src/systems/soltos.js): é ele mesmo, de volta
      if (this.foe.soltoId) await this.say(`ESPERA... É O ${this.foe.nickname} QUE VOCÊ SOLTOU AQUI!`);
      if (this.foe.alfa) { Glitch.hit(0.6); await this.say("ELE É MAIOR QUE O NORMAL. E NÃO VAI FUGIR."); }
      if (this.foe.luminoso) await this.say("ESSE NÃO TEM COR: TEM LUZ. UM EM 9999 NASCE ASSIM.");
      if (this.foe.luminoso) await this.contarHistoriaLuminoso();
      else if (this.foe.shiny) await this.say("A COR DELE NÃO É A DE SEMPRE. ESSE AÍ É RARO.");
    }
    await this.say(`VAI, ${this.mine.nickname}!`);
    if (this.clima) await this.say(DB.CLIMA_TEXTO[this.clima.tipo].continua);
    await this.entrou("f");
    if (this.totem) await this.auraDoTotem();
    await this.entrou("p");
    this.menu = { type: "main", index: 0 };
  }

  /** A AURA DO TOTEM: um atributo dele já começa um estágio acima.
   *
   *  É pouco no papel (1,5x em um número só) e é muito na mão: o time de
   *  pós-jogo que passa por cima de qualquer selvagem precisa, aqui, olhar QUAL
   *  número subiu antes de escolher o golpe. Era isso ou dar mais HP pro totem
   *  — e mais HP não faz ninguém pensar, só faz a luta durar. */
  async auraDoTotem() {
    const k = this.totem?.aura;
    if (!k) return;
    const T = DB.PROVACOES_TEXTO || {};
    this.fStages[k] = Math.min(6, (this.fStages[k] || 0) + (DB.TOTEM?.aura ?? 1));
    Audio2.tone(392, 0.08); Audio2.tone(523, 0.14);
    await this.say((T.aura || "{STAT} DE {MON} AUMENTOU!")
      .replace("{STAT}", DB.NOME_STAT?.[k] || k)
      .replace("{MON}", this.foe.nickname));
  }

  /** O AVISO DA HABILIDADE (pedido do CAIO): uma faixa entra deslizando do
   *  lado do Pokémon — o nome dele em cima, "HABILIDADE <NOME>" embaixo — com
   *  um brilho em volta dele e um plim. `esperar` = segura a batalha um
   *  instante pra faixa ser lida (falso nos multiplicadores de dano, que
   *  aparecem junto com o golpe e não podem atrasar cada pancada). */
  async mostrarHabilidade(mon, hab, esperar = true) {
    if (!mon || !hab) return;
    const lado = mon === this.mine ? "p" : "f";
    // a mesma habilidade já na tela: só renova o tempo dela
    const ja = this.habPops?.find((h) => h.lado === lado && h.nome === hab.nome);
    if (ja) ja.t = Math.min(ja.t, 0.25);
    else (this.habPops ||= []).push({ lado, mon: mon.nickname, nome: hab.nome, t: 0, dur: 2.2 });
    Audio2.tone(523, 0.07, "square", 0.25);
    setTimeout(() => Audio2.tone(784, 0.1, "square", 0.25), 70);
    if (esperar) await this.wait(0.55);
  }

  /** desenha as faixas de habilidade (no render, por cima de tudo menos a fala) */
  drawHabPops(ctx) {
    for (const h of this.habPops || []) {
      const linha2 = "HABILIDADE " + h.nome;
      const w = Math.max(h.mon.length, linha2.length) * 6 + 14, alt = 25;
      // entra em 0,18 s, fica, e sai nos últimos 0,25 s
      const k = Math.min(1, h.t / 0.18, Math.max(0, (h.dur - h.t) / 0.25));
      const ease = 1 - Math.pow(1 - k, 3);
      const x = h.lado === "p" ? Math.round(-w + (w + 2) * ease) : Math.round(240 - (w + 2) * ease);
      const y = h.lado === "p" ? 52 : 38;   // a do seu lado fica acima da sua barra de HP
      // o brilho em volta do Pokémon, enquanto a faixa está entrando
      if (h.t < 0.5) {
        const a = 0.5 * (1 - h.t / 0.5);
        const [cx, cy] = h.lado === "p" ? [46, 80] : [178, 46];
        const g = ctx.createRadialGradient(cx, cy, 2, cx, cy, 34);
        g.addColorStop(0, `rgba(255,240,140,${a})`);
        g.addColorStop(1, "rgba(255,240,140,0)");
        ctx.fillStyle = g;
        ctx.fillRect(cx - 36, cy - 36, 72, 72);
      }
      panel(ctx, x, y, w, alt);
      // a tirinha colorida do lado de onde ela veio
      ctx.fillStyle = h.lado === "p" ? "#e8504a" : "#4a7ae8";
      ctx.fillRect(h.lado === "p" ? x + w - 4 : x + 1, y + 2, 3, alt - 4);
      drawText(ctx, h.mon, x + 7, y + 4, PAL.ink);
      drawText(ctx, "HABILIDADE ", x + 7, y + 14, PAL.ink);
      drawText(ctx, h.nome, x + 7 + 11 * 6, y + 14, PAL.glitch);
    }
  }

  /** O QUE A HABILIDADE FAZ AO ENTRAR EM CAMPO: GAROA/SECA mudam o clima,
   *  INTIMIDAR derruba o ATAQUE do outro (src/data/habilidades.js). */
  async entrou(who) {
    const mon = who === "p" ? this.mine : this.foe;
    await this.brilhar(who);  // shiny entra brilhando, antes do grito
    tocarGrito(mon);
    await this.trocaDeForma(who);   // WISHIWASHI vira CARDUME, PALAFIN volta HERÓI          // todo Pokémon que entra em campo grita (src/data/gritos.js)
    const outro = who === "p" ? this.foe : this.mine;
    const oStages = who === "p" ? this.fStages : this.pStages;
    const e = entradaDaHabilidade(mon);
    if (!e) return;
    const h = habilidadeDoMon(mon);
    const T = DB.CLIMA_TEXTO;
    // QUEBRA-MOLDE e quem mais só se anuncia ao entrar
    if (e.anuncio) {
      await this.mostrarHabilidade(mon, h);
      await this.say(e.anuncio.replace("{MON}", mon.nickname));
    }
    if (e.clima && this.clima?.tipo !== e.clima) {
      await this.mostrarHabilidade(mon, h);
      await this.say(`${h.nome} DE ${mon.nickname}!`);
      await this.mudarClima(e.clima);
    }
    if (e.temporal) {
      await this.mostrarHabilidade(mon, h);
      this.temporal = { dono: mon };
      this.flash = 0.6;
      Audio2.noise(0.5, 0.7);
      Audio2.tone(60, 0.4, "sawtooth", 0.6);
      await this.say(T.temporal.comeca.replace("{MON}", mon.nickname));
    }
    if (e.intimidar && !habilidadeDoMon(outro)?.semQueda) {
      await this.mostrarHabilidade(mon, h);
      oStages.atk = Math.max(-6, (oStages.atk || 0) - 1);
      await this.say(T.intimidar.replace("{HAB}", h.nome).replace("{MON}", mon.nickname).replace("{ALVO}", outro.nickname));
    }
  }

  /** O TEMPORAL (a habilidade do TILAPISH): vale enquanto o dono estiver em
   *  campo e de pé. Devolve o dono, ou null. */
  temporalAtivo() {
    const d = this.temporal?.dono;
    return d && (d === this.mine || d === this.foe) && d.hp > 0 ? d : null;
  }

  async mudarClima(tipo) {
    const T = DB.CLIMA_TEXTO;
    if (this.clima?.turnos === Infinity && this.clima.tipo !== tipo) {
      // a TEMPESTADE não obedece a ninguém
      return void this.say("A TEMPESTADE NÃO DEIXA.");
    }
    this.clima = { tipo, turnos: T.turnos };
    this.flash = tipo === "sol" ? 0.5 : 0.25;
    Audio2.tone(tipo === "sol" ? 880 : 330, 0.12, tipo === "sol" ? "triangle" : "sine", 0.5);
    await this.say(T[tipo].comeca);
  }

  /** o retrato sai deslizando pra direita e o primeiro Pokémon entra no lugar */
  async trainerOut() {
    if (!this.showTrainer) return;
    if (trainerArt(this.trainer?.sprite) && DB.CONFIG?.battleAnim) {
      this.tOut = 0.001;
      await this.until(() => this.tOut >= 1);
    }
    this.showTrainer = false;
    this.tOut = 0;
    this.sp.f = this.newSprite(90);
  }

  /** CAPTURADO (pokésave): quem luta é você, e quem manda é o seu dono. */
  souDeAlguem() { return !!(this.st.capturado && this.mine?.eu && !this.trainer); }

  /** A ORDEM DO DONO: ele escolhe um golpe seu (o de mais poder, na maioria
   *  das vezes; às vezes qualquer um — dono nenhum acerta sempre). */
  ordemDoDono() {
    // a mesma cabeça que escolhe o golpe do inimigo: tipo contra tipo, STAB,
    // e um pouco de sorte — dono nenhum acerta sempre, mas este pensa
    const mv = chooseAiMove(this.mine, this.foe, this.pStages, this.fStages);
    const slot = mv ? this.mine.moves.indexOf(mv) : 0;
    return { slot: Math.max(0, slot) };
  }

  /** Ele joga a bola quando VALE: bicho fraco (quanto mais fraco, mais), com
   *  status, e que mereça um lugar na equipe dele (se ela está cheia, só o
   *  que é melhor que o pior dele). */
  donoQuerBola() {
    if (this.trainer || this.boss || this.raid) return false;
    const c = this.st.cacador, eq = c?.equipe || [];
    const pct = hpPct(this.foe);
    if (eq.length >= 6) {
      const pior = Math.min(...eq.map((e) => e.lvl));
      if (this.foe.level <= pior && !this.foe.shiny && !this.foe.alfa) return false;
    }
    let chance = pct < 0.15 ? 0.9 : pct < 0.3 ? 0.6 : pct < 0.5 ? 0.3 : 0;
    if (this.foe.status) chance += 0.2;
    if (this.foe.shiny || this.foe.luminoso || this.foe.alfa) chance += 0.2;
    return Math.random() < chance;
  }

  /** O DONO JOGA UMA BOLA no selvagem — pra equipe DELE, não pra sua. Se
   *  pega, a batalha acaba e ele ganha um Pokémon; se escapa, o turno segue. */
  async bolaDoDono() {
    this.menu = null;
    const cap = this.st.capturado;
    await this.say(`${cap.nome} JOGOU UMA POKÉ BOLA!`);
    this.ballAnim = { t: 0, shakes: 0 };
    const shakes = catchAttempt(this.foe, 1);
    await this.wait(0.7);
    for (let i = 0; i < Math.min(3, shakes); i++) {
      this.ballAnim.shakes = i + 1;
      Audio2.tone(300 + i * 60, 0.08);
      await this.wait(0.55);
    }
    if (shakes >= 4) {
      Audio2.heal();
      this.ballAnim.caught = true;
      const msg = cacadorPegou(this.st, { mon: this.foe });
      await this.say([`GOTCHA! ${msg || `${cap.nome} PEGOU ${this.foe.nickname}!`}`, `${this.foe.nickname} FOI PRA EQUIPE DE ${cap.nome}.`]);
      return this.finish();
    }
    this.ballAnim = null;
    await this.say("O POKÉMON ESCAPOU DA BOLA DELE!");
    const fMove = chooseAiMove(this.foe, this.mine, this.fStages, this.pStages, this.clima?.tipo);
    if (fMove) await this.useMove("f", fMove);
    await this.checkFaints();
  }

  /** Obedeceu: conta pra acalmar o dono (três seguidas tiram um ponto). */
  async obedecerOrdem(slot) {
    this.menu = null;
    if (obedeceu(this.st)) await this.say(RAIVA.acalmou.replace("{TREINADOR}", this.st.capturado.nome));
    return this.playerTurn(slot);
  }

  /** DESOBEDECER: você escolheu o que fazer em vez de obedecer (a lista é
   *  DESOBEDIENCIA, em src/systems/pokesave.js). Cada vez conta — e a bola
   *  segura menos a cada uma. */
  async desobedecer(slotOrdem, d) {
    this.menu = null;
    const cap = this.st.capturado;
    const vezes = cap.desobedeceu || 0;
    const raiva = nivelDeRaiva(desobedeceu(this.st));   // cada vez, mais bravo
    const fill = (t) => t.replace("{MON}", this.mine.nickname).replace("{TREINADOR}", cap.nome);
    if (RAIVA.grito[raiva]) {
      Glitch.hit(0.3 * raiva);
      await this.say(fill(RAIVA.grito[raiva]));
      // do nível 2 em diante ele aperta a bola, e a bola é você
      if (raiva >= 2 && d.id !== "escapa") {
        this.mine.hp = Math.max(1, this.mine.hp - Math.ceil(this.mine.maxHp * RAIVA.aperta));
      }
    }
    if (d.id === "escapa" && Math.random() >= chanceDeEscapar(vezes)) {
      Audio2.bump();
      await this.say(fill(d.falhou));
      const fMove = chooseAiMove(this.foe, this.mine, this.fStages, this.pStages, this.clima?.tipo);
      if (fMove && !isFainted(this.foe)) await this.useMove("f", fMove);
      return this.checkFaints();
    }
    const texto = fill(d.texto);
    const inimigoBate = async () => {
      const fMove = chooseAiMove(this.foe, this.mine, this.fStages, this.pStages, this.clima?.tipo);
      if (fMove && !isFainted(this.foe)) await this.useMove("f", fMove);
      await this.checkFaints();
    };
    Glitch.hit(0.4);
    await this.say(texto);
    if (d.id === "soneca") {
      this.mine.hp = Math.min(this.mine.maxHp, this.mine.hp + Math.ceil(this.mine.maxHp * 0.12));
      const doce = aoSerCurado(this.mine, this.pStages);
      if (doce) await this.say(doce);
      return inimigoBate();
    }
    if (d.id === "recusa") return inimigoBate();
    if (d.id === "morde") {
      this.st.money = (this.st.money || 0) + 200;
      await this.say("VOCÊ PEGOU $200 DO CHÃO.");
      return inimigoBate();
    }
    if (d.id === "outro") {
      const outros = this.mine.moves.map((mv, i) => i).filter((i) => i !== slotOrdem && this.mine.moves[i].pp > 0);
      return this.playerTurn(outros.length ? outros[Math.floor(Math.random() * outros.length)] : slotOrdem);
    }
    if (d.id === "tudo") {
      const forte = this.mine.moves.map((mv, i) => i).filter((i) => this.mine.moves[i].pp > 0)
        .sort((a, b) => (DB.MOVES[this.mine.moves[b].id]?.power || 0) - (DB.MOVES[this.mine.moves[a].id]?.power || 0))[0];
      this.pStages.atk = Math.min(6, (this.pStages.atk || 0) + 1);
      this.pStages.spa = Math.min(6, (this.pStages.spa || 0) + 1);
      return this.playerTurn(forte ?? slotOrdem);
    }
    if (d.id === "foge") return this.finish();
    if (d.id === "escapa") {
      Glitch.hit(2); Audio2.glitch();
      escapar(this.st);
      await this.say(`${cap.nome} FICOU OLHANDO A BOLA QUEBRADA. VOCÊ NÃO OLHOU PRA TRÁS.`);
      return this.finish();
    }
  }

  async playerTurn(moveSlot) {
    this.menu = null;
    // a MEGA acontece antes de qualquer golpe do turno — inclusive antes do
    // golpe do inimigo, e é com os stats novos que a ordem é calculada
    if (this.megaArmada) {
      const regra = this.megaArmada;
      this.megaArmada = null;
      await this.fazerMega("p", regra);
    }
    if (this.dyArmado) { this.dyArmado = false; await this.fazerDynamax("p"); }
    // o LÍDER (ginásio, liga) dynamaxa o último Pokémon dele
    if (!this.dyUsado.f && (lutaGrande(this.trainer) || this.dyTeste) && this.foeIdx === this.foeParty.length - 1 && !isFainted(this.foe)) await this.fazerDynamax("f");
    let pMove = this.mine.moves[moveSlot];
    // O GOLPE Z: armado com Q e com o cristal do tipo do golpe escolhido. O
    // golpe original NÃO gasta PP — quem foi usado foi o cristal, e a vez dele
    // é uma por batalha.
    const cristal = this.zArmado ? this.zPara(pMove) : null;
    this.zArmado = false;
    if (cristal) {
      this.cristalUsado = true;
      Glitch.hit(1);
      this.flash = 0.5;
      Audio2.tone(988, 0.08, "square", 0.6);
      Audio2.tone(1318, 0.14, "square", 0.5);
      await this.say(DB.STORY.zcristal.usou
        .replace("{MON}", this.mine.nickname).replace("{TIPO}", cristal.tipo));
      pMove = { id: cristal.golpe, pp: 1 };
      // o golpe Z da MONSTELA tem a cena dele (desenhada pelo CAIO, em palavras)
      if (cristal.golpe === "zmonstelium") await this.cenaMonstelium();
    }
    let fMoveRef = chooseAiMove(this.foe, this.mine, this.fStages, this.pStages, this.clima?.tipo);
    // DYNAMAXADO: todo golpe vira GOLPE MAX (o PP sai do golpe de verdade)
    if (this.mine.dynamax && pMove && !cristal) { pMove.pp = Math.max(0, pMove.pp - 1); pMove = { id: golpeMax(pMove.id, this.mine), pp: 99 }; }
    if (this.foe.dynamax && fMoveRef) fMoveRef = { id: golpeMax(fMoveRef.id, this.foe), pp: 99 };

    const pSpe = effectiveStat(this.mine, "spe", this.pStages, this.clima?.tipo);
    const fSpe = effectiveStat(this.foe, "spe", this.fStages, this.clima?.tipo);
    // a PRIORIDADE vem antes da velocidade (o ATAQUE RÁPIDO sai primeiro)
    const pPri = DB.MOVES[pMove?.id]?.priority || 0, fPri = DB.MOVES[fMoveRef?.id]?.priority || 0;
    let playerFirst = pPri !== fPri ? pPri > fPri : pSpe === fSpe ? Math.random() < 0.5 : pSpe > fSpe;
    // a GARRA RÁPIDA: às vezes quem segura sai primeiro (na mesma prioridade)
    if (pPri === fPri) {
      const gp = garraBrilhou(this.mine), gf = garraBrilhou(this.foe);
      if (gp !== gf) {
        playerFirst = gp;
        await this.say(DB.SEGURAR_TEXTO.garra.replace("{MON}", (gp ? this.mine : this.foe).nickname));
      }
    }

    const order = playerFirst
      ? [["p", pMove], ["f", fMoveRef]]
      : [["f", fMoveRef], ["p", pMove]];

    for (const [who, mv] of order) {
      if (isFainted(this.mine) || isFainted(this.foe)) break;
      if (!mv) continue;
      await this.useMove(who, mv);
    }
    if (!isFainted(this.mine) && !isFainted(this.foe)) await this.endOfTurn();
    await this.checkFaints();
  }

  /** C liga/desliga a MEGA — e passa pela segunda forma, no CHARIZARD e no
   *  MEWTWO. Vale nos dois menus; a evolução só acontece quando o golpe sai. */
  tentarArmarMega() {
    const megas = this.megasDisponiveis();
    if (!megas.length || !Input.consume("select")) return;
    const atual = this.megaArmada ? megas.findIndex((r) => r.to === this.megaArmada.to) : -1;
    this.megaArmada = megas[atual + 1] || null;
    Audio2.tone(this.megaArmada ? 880 : 320, 0.07, "square", 0.45);
  }

  /** O CRISTAL Z se arma com Q, do mesmo jeito que a MEGA se arma com C. Um
   *  jogo que ensina um gesto uma vez e o reaproveita pede menos da cabeça de
   *  quem joga do que um gesto novo por sistema. */
  tentarArmarZ() {
    if (!Input.consume("z")) return;
    if (this.cristalUsado || !this.cristaisAqui().length) return void Audio2.cancel();
    this.zArmado = !this.zArmado;
    Audio2.tone(this.zArmado ? 988 : 330, 0.07, "square", 0.45);
  }

  /** as nuvens vermelhas do DYNAMAX, pulsando atrás dele (GIGANTAMAX: douradas) */
  auraDynamax(ctx, cx, cy, r, gmax = false) {
    const a = 0.75 + 0.2 * Math.sin(this.t * 6);
    const g = ctx.createRadialGradient(cx, cy, 4, cx, cy, r);
    const [c1, c2, c3] = gmax ? ["255,210,60", "255,80,170", "230,140,40"] : ["255,60,90", "200,0,60", "230,20,70"];
    g.addColorStop(0, `rgba(${c1},${a})`);
    g.addColorStop(0.6, `rgba(${c2},${a * 0.6})`);
    g.addColorStop(1, `rgba(${c2},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    // as nuvenzinhas girando em volta
    for (let i = 0; i < 6; i++) {
      const ang = this.t * 1.5 + i * Math.PI / 3, rx = cx + Math.cos(ang) * r * 0.8, ry = cy + Math.sin(ang) * r * 0.35 + 10;
      ctx.fillStyle = `rgba(${c3},${0.8 + 0.2 * Math.sin(this.t * 4 + i)})`;
      ctx.beginPath(); ctx.ellipse(rx, ry, 9, 5, 0, 0, Math.PI * 2); ctx.fill();
    }
  }

  /** V liga/desliga o DYNAMAX (com a PULSEIRA, em ginásio, liga ou raid; uma vez por batalha) */
  tentarArmarDynamax() {
    if (!Input.consume("dynamax")) return;
    if (this.dyUsado.p || this.mine.dynamax || !podeDynamaxAqui(this.st, this)) return void Audio2.cancel();
    this.dyArmado = !this.dyArmado;
    Audio2.tone(this.dyArmado ? 220 : 330, 0.12, "sawtooth", 0.45);
  }

  /** O Pokémon cresce, fica vermelho, o HP dobra */
  async fazerDynamax(who) {
    const mon = who === "p" ? this.mine : this.foe;
    if (!dynamaxar(mon)) return;
    this.dyUsado[who] = true;
    const giganta = !!mon.gmaxDe;   // tomou a SOPA MAX: virou a forma GIGANTAMAX (src/systems/dynamax.js)
    const quem = who === "p" ? "VOCÊ" : (this.trainer?.name || "O INIMIGO");
    await this.say(`${quem} CHAMOU ${mon.nickname} DE VOLTA PRA BOLA... A BOLA FICOU GIGANTE!`);
    this.sp[who].dyAlvo = (this.sp[who].escala || 1) * DYNAMAX.escala;
    this.flash = 0.7; this.shake = 0.5;
    Audio2.tone(110, 0.4, "sawtooth", 0.5); Audio2.tone(82, 0.6, "sawtooth", 0.5);
    await this.wait(0.8);
    this.disp[who] = mon.hp;
    await this.say(giganta ? `${mon.nickname} GIGANTAMAXOU!` : `${mon.nickname} DYNAMAXOU!`);
  }

  /** acabou o tempo (ou saiu da luta): volta ao tamanho normal */
  async acabarDynamax(who, falar = true) {
    const mon = who === "p" ? this.mine : this.foe;
    if (!desdynamaxar(mon)) return;
    this.sp[who].dyAlvo = (this.sp[who].escala || DYNAMAX.escala) / DYNAMAX.escala;
    this.disp[who] = mon.hp;
    if (falar) { Audio2.tone(330, 0.2, "triangle", 0.4); await this.say(`${mon.nickname} VOLTOU AO TAMANHO NORMAL!`); }
  }

  /** Os cristais que servem AGORA: você tem o cristal, e o bicho na frente sabe
   *  um golpe daquele tipo. Ter o cristal sem o golpe não serve de nada. */
  cristaisAqui() {
    const tipos = new Set((this.mine?.moves || []).map((m) => DB.MOVES[m.id]?.type));
    return (DB.ZCRISTAIS || []).filter((c) => {
      if (!(this.st.items?.[c.item] || 0)) return false;
      if (!tipos.has(c.tipo)) return false;
      // cristal de ESPÉCIE serve a um bicho só; o de tipo serve a quem souber
      // um golpe daquele tipo. A fusão vale pelos dois lados dela, como em todo
      // o resto do jogo — um PIKACHU fundido continua sendo um PIKACHU dentro.
      if (!c.especie) return true;
      const p = partes(this.mine.species);
      return this.mine.species === c.especie
        || (p && (p.cabeca === c.especie || p.corpo === c.especie));
    });
  }

  /** O golpe Z daquele golpe, se houver cristal pra ele. */
  zPara(mv) {
    const tipo = DB.MOVES[mv?.id]?.type;
    return this.cristaisAqui().find((c) => c.tipo === tipo) || null;
  }

  /** formas que o Pokémon na frente pode assumir agora (anel + pedra + 1 por luta) */
  megasDisponiveis() {
    return this.megou.p ? [] : opcoesMega(this.st, this.mine);
  }

  /** Mega evolui quem está na frente. `anel` desligado = ninguém deu pedra a
   *  ele (o MISSINGNO. da caçada final se vira sozinho). */
  async fazerMega(who, regra, anel = true) {
    const M = DB.STORY.mega;
    const mon = who === "p" ? this.mine : this.foe;
    const troca = (t) => t.replace("{PEDRA}", regra.pedra.toUpperCase()).replace("{MON}", mon.nickname);
    if (anel && regra.emprestada) { await this.say(troca(M.reagemErrada)); await this.say(troca(M.puxaErrada)); }
    else if (anel) await this.say(M.reagem.replace("{PEDRA}", regra.pedra.toUpperCase()));
    // a cutscene da MEGA (src/scenes/mega.js); a do MISSINGNO, sem anel, não
    // tem — ele não mega evolui, ele se sobrescreve
    if (anel) await tocarMega(this.game, mon, regra.to);
    const r = megaEvoluir(mon, regra.to);
    if (!r) return;
    this.megou[who] = true;
    this.flash = 0.6;
    this.sp[who].dx = who === "p" ? -14 : 14;
    Audio2.tone(520, 0.1, "square", 0.5);
    Audio2.tone(760, 0.12, "square", 0.5);
    if (anel) Audio2.heal(); else { Audio2.glitch(); Glitch.hit(2.5); }
    await this.wait(0.45);
    this.disp[who] = mon.hp;
    await this.say((regra.emprestada ? troca(M.evoluiuErrada) : M.evoluiu.replace("{MON}", mon.nickname)).replace("{FORMA}", r.forma));
  }

  /** O FENÔMENO DE VÍNCULO: a água (CAIO) ou o rosa (LARA) sobe em volta
   *  dele, o clarão, e ele volta com o corpo novo. */
  async fazerVinculo() {
    const mon = this.mine;
    this.auraVinculo = 1.2;
    Audio2.tone(330, 0.12, "square", 0.5);
    Audio2.tone(494, 0.12, "square", 0.5);
    await this.wait(0.5);
    const falas = virarVinculo(this.st, mon);
    if (!falas) return;
    this.flash = 0.7;
    this.sp.p.dx = -14;
    Audio2.tone(659, 0.1, "square", 0.5);
    Audio2.tone(988, 0.16, "square", 0.5);
    Audio2.heal();
    this.disp.p = mon.hp;
    await this.wait(0.45);
    // o grito novo: 3/4 o do Pokémon, 1/4 o do treinador (src/systems/gritos.js)
    const dur = tocarGrito(mon);
    await this.wait(Math.min(2.5, dur || 0));
    for (const f of falas) await this.say(f);
  }

  /** O ETERNAMAX (pedido do CAIO, nov/2026: "transformar eternatus em
   *  eternamax ser usar o golpe eternabeam"): a tela escurece em vermelho, ele
   *  puxa a energia (o chão treme), o clarão, e volta gigante. Ele FICA
   *  ETERNAMAX depois da luta: só volta a ser ETERNATUS se desmaiar ou no
   *  CENTRO POKÉMON (src/systems/formas.js `virarEternamax`). */
  async virarEternamax(who) {
    const mon = who === "p" ? this.mine : this.foe;
    this.eternamax = { t: 0, who };
    Audio2.tone(110, 0.5, "sawtooth", 0.5);
    Audio2.tone(82, 0.7, "square", 0.4);
    for (let i = 0; i < 4; i++) { this.shake = Math.max(this.shake, 0.3); await this.wait(0.3); }
    virarEternamax(mon);
    this.disp[who] = mon.hp;
    this.flash = 1;
    Glitch.hit(0.8);
    Audio2.tone(196, 0.3, "sawtooth", 0.6);
    Audio2.tone(147, 0.5, "sawtooth", 0.5);
    await this.wait(0.5);
    const dur = tocarGrito(mon);
    await this.wait(Math.min(2, dur || 0.6));
    this.eternamax = null;
    await this.say(`${mon.nickname} PUXOU A ENERGIA DA ESCURIDÃO E VIROU ETERNATUS ETERNAMAX!`);
  }

  async useMove(who, moveRef) {
    // em TEMPO REAL o inimigo ataca sozinho na arena: a "vez dele" depois de
    // uma bola, poção ou troca não existe
    if ((this.modoReal || this.modoExplosivo) && who === "f") return;
    const user = who === "p" ? this.mine : this.foe;
    const target = who === "p" ? this.foe : this.mine;
    const uStages = who === "p" ? this.pStages : this.fStages;
    const tStages = who === "p" ? this.fStages : this.pStages;
    const mv = DB.MOVES[moveRef.id];

    if (user.status === "paralisia" && Math.random() < 0.25) {
      await this.say(`${user.nickname} ESTÁ PARALISADO E NÃO CONSEGUE SE MEXER!`);
      return;
    }
    // O FENÔMENO DE VÍNCULO (src/systems/vinculo.js): o golpe mais forte, com
    // a amizade acima do máximo — ele muda de corpo antes de bater
    if (who === "p" && podeVirar(this.st, user, moveRef.id)) await this.fazerVinculo();
    // o RAIO ETERNO: o ETERNATUS vira ETERNATUS ETERNAMAX antes de soltar ele
    if (moveRef.id === "raioeterno" && user.species === "eternatus" && !user.megaDe && !user.eternamaxDe && DB.SPECIES.eternatuseternamax) await this.virarEternamax(who);
    moveRef.pp = Math.max(0, moveRef.pp - 1);
    await this.say(`${user.nickname} USOU ${mv.name}!`);
    contarPesquisa(this.st, user.transformado ? "ditto" : user.species, "golpe:" + moveRef.id);   // as MISSÕES DA POKÉDEX: viu ele usar
    if (who === "p") { this.ultimoEff = 1; this.nTurno = (this.nTurno || 0) + 1; }   // (a TIMER BALL e a QUICK BALL contam os turnos)

    // a LENTE DE MIRA: errou? ela dá mais uma chance de acertar
    // SEM GUARDA (acerta sempre) e OLHOS COMPOSTOS (erra menos): src/systems/habilidades.js
    const prec = precisao(user, target);
    if (prec.hab && mv.acc < 100) this.mostrarHabilidade(prec.dono, prec.hab, false);
    if (!accuracyCheck(moveRef.id, uStages, tStages, prec) && !(segura(user, "mira") && accuracyCheck(moveRef.id, uStages, tStages, prec))) {
      await this.say("MAS ERROU O ALVO!");
      return;
    }

    await this.cutscene(who, moveRef.id, mv);

    if (mv.corrupt && DB.CONFIG?.glitchMode) {
      Glitch.hit(1.2);
      Audio2.glitch();
      this.st.corruption = Math.min(100, this.st.corruption + mv.corrupt * 0.25);
    }

    // DANÇA DA CHUVA / DIA DE SOL: zero de dano, o clima muda
    if (mv.clima) return this.mudarClima(mv.clima);
    // A TRANSFORMAÇÃO: vira a cópia de quem está na frente (src/systems/formas.js)
    if (mv.transformar) {
      if (user.transformado || target.transformado || !transformar(user, target)) return void await this.say("MAS NÃO DEU CERTO!");
      Audio2.tone(330, 0.1, "sine", 0.4); Audio2.tone(494, 0.12, "sine", 0.4); Audio2.tone(660, 0.16, "sine", 0.4);
      this.flash = Math.max(this.flash, 0.4);
      if (who === "p") this.pStages = { ...tStages }; else this.fStages = { ...tStages };   // copia os níveis também
      return void await this.say(`${user.nickname} SE TRANSFORMOU EM ${DB.SPECIES[target.species]?.name || target.nickname}!`);
    }

    const res = calcDamage(user, target, moveRef.id, uStages, tStages, this.clima?.tipo);
    if (res.anuncia) {
      // de quem é a habilidade que falou (a CHUVA DE LAVA é de quem bate; o DOCE DE POKÉMON, de quem apanha)
      const dono = res.hab && habilidadeDoMon(target)?.id === res.hab.id && habilidadeDoMon(user)?.id !== res.hab.id ? target : user;
      await this.mostrarHabilidade(dono, res.hab || habilidadeDoMon(dono));
      this.flash = 0.35; Audio2.tone(196, 0.16, "sawtooth", 0.4); await this.say(res.anuncia);
    } else if (res.dmg > 0) {
      // TÉCNICO, FORÇA ENORME, MULTIESCAMAS...: mudaram o dano, a faixa aparece junto com o golpe
      if (res.doAtk) this.mostrarHabilidade(user, res.doAtk, false);
      if (res.doDef) this.mostrarHabilidade(target, res.doDef, false);
    }
    if (res.dmg > 0) {
      // o baque (avanço, tremida, piscada) já veio da cutscene; sem ela, aqui
      if (!(DB.CONFIG?.battleAnim ?? 1)) {
        Audio2.hit();
        this.shake = 0.25;
        this.sp[who === "p" ? "f" : "p"].blink = 0.45;
      }
      // o SANDUÍCHE PICANTE bate mais forte — e só do seu lado da tela
      // o PICANTE bate mais forte no seu turno; o UMAMI segura o que vem no do
      // outro. Os dois só valem pro seu lado da tela.
      // ...e a DIFICULDADE mexe nos dois sentidos (src/systems/dificuldade.js)
      let dano = Math.max(1, Math.round(res.dmg * fatorDano(who === "p") * (who === "p"
        ? fator(this.st, "ataque")
        : fator(this.st, "defesa"))));

      // GLITCH RAID: enquanto a casca está de pé, o golpe bate NELA. É isso que
      // faz do chefe uma luta de duas partes, e não um selvagem com muito HP.
      if (who === "p" && this.raid?.escudo > 0) {
        const r = bater(this.raid, dano);
        dano = r.noBicho;
        this.quebrou = r.quebrou;
      }
      // a FAIXA DO FOCO: com HP cheio, o golpe que ia derrubar deixa 1
      // ROBUSTEZ: com o HP cheio, o golpe que derrubaria deixa 1
      const rob = robustez(target, user, dano);
      dano = rob.dano;
      const foco = segurarComFoco(target, dano);
      dano = foco.dano;
      target.hp = Math.max(0, target.hp - dano);
      if (foco.segurou) { await this.syncHp(); await this.say(DB.SEGURAR_TEXTO.foco.replace("{MON}", target.nickname)); }
      if (rob.segurou) {
        await this.syncHp();
        await this.mostrarHabilidade(target, rob.hab);
        await this.say(`${target.nickname} AGUENTOU FIRME!`);
      }
      marcarSecreta(target, mv, this.st.player.map, moveRef.id);   // o PARASECTROM (src/data/secretas.js)
      await this.syncHp();
      // ORBE DA VIDA, SINO DA CONCHA, CAPACETE ROCHOSO (src/systems/segurar.js)
      const doItemFalas = depoisDoGolpe(user, target, dano, mv);
      if (doItemFalas.length) { await this.syncHp(); for (const t of doItemFalas) await this.say(t); }
      // CONTRA-ATAQUE (o GINGÃO): quem bateu com o dano guardado zera a conta;
      // quem apanhou guarda o golpe e sobe a defesa
      const devolve = devolveu(user, uStages, res);
      if (devolve) { await this.mostrarHabilidade(user, habilidadeDoMon(user)); await this.say(devolve); }
      const guardou = aoApanhar(target, tStages, dano);
      if (guardou) { await this.mostrarHabilidade(target, habilidadeDoMon(target)); await this.say(guardou); }
      if (res.mirror) {
        Glitch.hit(1.5);
        Audio2.glitch();
        await this.say(`O DADO DE ${target.nickname} NÃO SUPORTA VER A SI MESMO!`);
        await this.say("O GOLPE BATEU OITO VEZES DE UMA VEZ SÓ!");
      }
      const G = DB.STORY.glitch;
      if (this.quebrou) {
        this.quebrou = false;
        if (DB.CONFIG?.sustos) { Glitch.hit(2.5); Audio2.glitch(); this.flash = 0.6; }
        else Audio2.hit();
        await this.say(this.textosDaRaid().escudoQuebrou);
      }
      // O GLITCHBOOSTER come o dano que quem levou o golpe tomou e devolve em
      // atributo. Vale pros DOIS LADOS: do seu, quando você usou o item; do
      // outro, quando é uma GLITCH RAID — o chefe já entra bugado.
      //
      // A FALA POR PANCADA É SÓ DO SEU LADO. No seu, ela é a informação que
      // decide se você continua apanhando ou recua. No lado do chefe, ela
      // apareceria a cada golpe seu numa luta de cinco vidas de HP: viraria uma
      // caixa de texto entre você e o botão. O que ele ganhou está nos números
      // dele; o que precisa ser dito alto é a VIRADA DO BYTE, e essa continua
      // sendo dita dos dois lados.
      if (bugado(target)) {
        const antes = bonusDe(target);
        const r = acumular(target, dano);
        if (r.virou) {
          if (DB.CONFIG?.sustos) { Glitch.hit(3); Audio2.glitch(); }
          else Audio2.faint();
          await this.say(G.virouByte.replace("{NOME}", target.nickname));
        } else if (who === "f" && r.bonus > antes) {
          Glitch.hit(0.6);
          await this.say(G.comeu.replace("{NOME}", target.nickname).replace("{N}", r.bonus));
        }
      }
      if (res.pegouAlma) { Audio2.glitch(); await this.say(`${user.nickname} PEGOU A ALMA DE ${target.nickname}!`); }
      if (res.crit) await this.say("ACERTO CRÍTICO!");
      const et = effText(res.eff);
      if (who === "p") this.ultimoEff = res.eff;
      if (et && !res.pegouAlma) await this.say(et);
      // DRENO (a linha do TRONKY): todo golpe que acerta puxa 10-20 de HP pra
      // quem bateu. Embaixo do TEMPORAL não tem cura: ele tenta e não vem nada.
      const hu = habilidadeDoMon(user);
      if (hu?.dreno && dano > 0 && user.hp > 0 && user.hp < user.maxHp) {
        const T = DB.CLIMA_TEXTO;
        if (this.temporalAtivo()) await this.say(T.temporal.semCura.replace("{MON}", user.nickname));
        else {
          const [a, b] = hu.dreno;
          const n = Math.min(user.maxHp - user.hp, a + Math.floor(Math.random() * (b - a + 1)));
          user.hp += n;
          await this.syncHp();
          await this.mostrarHabilidade(user, hu);
          await this.say(T.temporal.dreno.replace("{HAB}", hu.nome).replace("{MON}", user.nickname).replace("{N}", n));
          const doce = aoSerCurado(user, uStages);
          if (doce) await this.say(doce);
        }
      }
      // o DRENO do golpe (o GIGA DRENO): cura uma parte do que bateu
      if (mv.drena && dano > 0 && user.hp > 0 && user.hp < user.maxHp) {
        const cura = Math.max(1, Math.floor(dano * mv.drena));
        user.hp = Math.min(user.maxHp, user.hp + cura);
        await this.syncHp();
        await this.say(`${target.nickname} TEVE A ENERGIA SUGADA!`);
      }
      if (mv.recoil) {
        const rec = Math.max(1, Math.floor(dano * mv.recoil));
        user.hp = Math.max(0, user.hp - rec);
        await this.syncHp();
        await this.say(`${user.nickname} SOFREU O RECUO!`);
      }
      // EXPLOSÃO: quem usou vai junto
      if (mv.explode && user.hp > 0) {
        user.hp = 0;
        await this.syncHp();
        await this.say(`${user.nickname} EXPLODIU E DESMAIOU!`);
      }
      // o PREÇO do golpe (o PEGA ALMA): HP fixo, pegando alma ou não
      if (mv.custoHp) {
        user.hp = Math.max(0, user.hp - mv.custoHp);
        await this.syncHp();
        await this.say(`${user.nickname} PERDEU ${mv.custoHp} DE HP!`);
      }
      // AUTOCONFIANÇA / FERA SUPREMA: derrubou, sobe
      if (isFainted(target)) {
        const sobe = aoDerrubar(user, uStages);
        if (sobe) { await this.mostrarHabilidade(user, sobe.hab); await this.say(`${sobe.nome} DE ${user.nickname} SUBIU!`); }
      }
    } else if (res.imune) {
      // LEVITAR, PARA-RAIOS, ESPONJA, CHAMA VIVA: a habilidade segurou o golpe
      const T = DB.CLIMA_TEXTO;
      await this.mostrarHabilidade(target, res.imune);
      if (res.cura && target.hp < target.maxHp && this.temporalAtivo()) {
        await this.say(T.imune.replace("{HAB}", res.imune.nome).replace("{MON}", target.nickname));
        await this.say(T.temporal.semCura.replace("{MON}", target.nickname));
      } else if (res.cura && target.hp < target.maxHp) {
        target.hp = Math.min(target.maxHp, target.hp + Math.ceil(target.maxHp * res.cura));
        await this.syncHp();
        await this.say(T.absorve.replace("{HAB}", res.imune.nome).replace("{MON}", target.nickname));
        const doce = aoSerCurado(target, who === "p" ? this.fStages : this.pStages);
        if (doce) await this.say(doce);
      } else await this.say(T.imune.replace("{HAB}", res.imune.nome).replace("{MON}", target.nickname));
      return;
    } else if (res.eff === 0) {
      await this.say(`NÃO AFETA ${target.nickname}...`);
      return;
    }

    for (const m of applyMoveEffects(mv, user, target, uStages, tStages)) await this.say(m);
    // AS BERRIES SEGURADAS: quem apanhou (e quem bateu, com recuo) come se precisar
    await this.berries(target, user);

    // ESTÁTICA, PONTO VENENOSO, CORPO EM CHAMAS: quem encostou pode pagar
    if (res.dmg > 0 && !isFainted(target)) {
      const status = contatoDaHabilidade(mv, user, target);
      if (status) {
        const T = DB.CLIMA_TEXTO;
        await this.mostrarHabilidade(target, habilidadeDoMon(target));
        user.status = status;
        await this.say(T.contato.replace("{HAB}", habilidadeDoMon(target).nome).replace("{MON}", target.nickname)
          .replace("{ALVO}", user.nickname).replace("{STATUS}", T.statusNomes[status]));
      }
    }
    // PELE ÁSPERA: quem encostou se machuca
    if (res.dmg > 0) {
      const pele = peleAspera(mv, user, target);
      if (pele.dano > 0) {
        await this.mostrarHabilidade(target, pele.hab);
        user.hp = Math.max(0, user.hp - pele.dano);
        await this.syncHp();
        await this.say(`${user.nickname} SE MACHUCOU NA PELE ÁSPERA DE ${target.nickname}!`);
      }
    }
  }

  /** quem está segurando berry come, se for a hora (src/systems/segurar.js) */
  async berries(...mons) {
    for (const mon of mons) {
      const fala = comerBerry(mon);
      if (fala) { Audio2.heal(); await this.syncHp(); await this.say(fala); }
    }
  }

  async endOfTurn() {
    await this.passaTurnoDoPokebloco();
    // O DYNAMAX dura 3 turnos
    for (const who of ["p", "f"]) {
      const mon = who === "p" ? this.mine : this.foe;
      if (mon?.dynamax && --mon.dynamax.turnos <= 0) await this.acabarDynamax(who);
    }
    // O TEMPORAL: o dono saiu ou caiu, a chuva passa; senão, ela bate nos outros
    const T = DB.CLIMA_TEXTO;
    if (this.temporal && !this.temporalAtivo()) {
      await this.say(T.temporal.para.replace("{MON}", this.temporal.dono.nickname));
      this.temporal = null;
    }
    const dono = this.temporalAtivo();
    if (dono) {
      for (const mon of [this.mine, this.foe]) {
        if (mon === dono || mon.hp <= 0) continue;
        mon.hp = Math.max(0, mon.hp - Math.max(1, Math.floor(mon.maxHp / 16)));
        Audio2.noise(0.15, 0.4);
        await this.syncHp();
        await this.say(T.temporal.dano.replace("{MON}", mon.nickname));
      }
    }
    for (const mon of [this.mine, this.foe]) {
      const d = statusTickDamage(mon);
      if (d > 0) {
        mon.hp = Math.max(0, mon.hp - d);
        await this.syncHp();
        await this.say(`${mon.nickname} SOFRE COM ${mon.status === "envenenado" ? "O VENENO" : "A QUEIMADURA"}!`);
      }
      // REGENERAÇÃO, CORPO GELADO: cura no fim do turno
      const f = curaDoTurno(mon, this.clima?.tipo);
      if (f > 0 && mon.hp > 0 && mon.hp < mon.maxHp && dono) {
        await this.say(T.temporal.semCura.replace("{MON}", mon.nickname));
      } else if (f > 0 && mon.hp > 0 && mon.hp < mon.maxHp) {
        mon.hp = Math.min(mon.maxHp, mon.hp + Math.max(1, Math.floor(mon.maxHp * f)));
        await this.syncHp();
        await this.mostrarHabilidade(mon, habilidadeDoMon(mon));
        await this.say(DB.CLIMA_TEXTO.cura.replace("{HAB}", habilidadeDoMon(mon).nome).replace("{MON}", mon.nickname));
        const doce = aoSerCurado(mon, mon === this.mine ? this.pStages : this.fStages);
        if (doce) await this.say(doce);
      }
    }
    // ACELERAR: no fim do turno, a velocidade sobe
    for (const mon of [this.mine, this.foe]) {
      const sobe = fimDoTurno(mon, mon === this.mine ? this.pStages : this.fStages);
      if (sobe) { await this.mostrarHabilidade(mon, sobe.hab); await this.say(`${sobe.nome} DE ${mon.nickname} SUBIU!`); }
    }
    // AS SOBRAS e as BERRIES segurados, no fim do turno
    for (const mon of [this.mine, this.foe]) {
      const n = dono ? 0 : curaDasSobras(mon);
      if (n > 0) {
        mon.hp = Math.min(mon.maxHp, mon.hp + n);
        await this.syncHp();
        await this.say(DB.SEGURAR_TEXTO.sobras.replace("{MON}", mon.nickname));
      }
    }
    await this.berries(this.mine, this.foe);
    // o CARDUME do WISHIWASHI se confere no fim de cada turno
    for (const who of ["p", "f"]) await this.trocaDeForma(who);
    // o clima conta os turnos dele (a TEMPESTADE tem Infinity: não acaba)
    if (this.clima && this.clima.turnos !== Infinity) {
      this.clima.turnos--;
      const T = DB.CLIMA_TEXTO[this.clima.tipo];
      if (this.clima.turnos <= 0) { await this.say(T.para); this.clima = null; }
      else await this.say(T.continua);
    }
    // Caçada final: na metade da vida o MISSINGNO. acha uma pedra que não está
    // na tabela. Ninguém entregou nada a ele.
    if (!this.megou.f && this.st.flags?.glitchWorld && this.foe.species === "missingno"
        && this.foe.hp > 0 && this.foe.hp <= this.foe.maxHp / 2) {
      const regra = (DB.MEGAS?.missingno || [])[0];
      if (regra) {
        await this.say(DB.STORY.mega.missingno);
        await this.fazerMega("f", regra, false);
      }
    }
    if (this.isGlitch && DB.CONFIG?.glitchMode && Math.random() < 0.35) {
      Glitch.hit(1);
      Audio2.glitch();
      await this.say(["A TELA PISCA.", "OS DADOS DE ALGUÉM FORAM TROCADOS DE LUGAR."][Math.random() < 0.5 ? 0 : 1]);
    }
  }

  async checkFaints() {
    if (isFainted(this.foe)) return this.onFoeFaint();
    if (isFainted(this.mine)) return this.onPlayerFaint();
    this.menu = { type: "main", index: 0 };
  }

  /** O MISSINGNO DE BRAGLITCH vencido (derrubado ou pego), depois de ele
   *  chegar lá: é o que abre a LIGA (src/data/braglitch-liga.js). */
  marcarMissingnoBrag() {
    if (this.foe?.species === "missingno" && this.st.flags?.bragGlitch && emBraglitch(this.st.player.map)) {
      this.st.flags.bragMissingnoVencido = true;
    }
  }

  /** os textos da descontrolada: os de sempre, com os dela por cima */
  textosDescontrolada() {
    return { ...DB.DESCONTROLADAS.textos, ...(this.descontrolada?.textos || {}) };
  }

  /** A DESCONTROLADA caiu: a aura apaga, ela volta ao normal e vai embora, e
   *  a PEDRA MEGA dela fica (ou vira dinheiro, se você já tem uma). */
  async acalmouDescontrolada() {
    const T = this.textosDescontrolada(), d = this.descontrolada;
    for (const linha of T.acalmou) await this.say(linha.replace("{BASE}", d.base));
    if (!d.pedra) return;
    await this.say(T.deixou);
    const nome = d.pedra.toUpperCase();
    if ((this.st.items[d.pedra] || 0) > 0) {
      this.st.money += T.dinheiro;
      return void (await this.say(T.jaTinha.replace("{PEDRA}", nome).replace("{DIN}", T.dinheiro)));
    }
    this.st.items[d.pedra] = 1;
    Audio2.heal();
    await this.say(T.pedra.replace("{PEDRA}", nome));
  }

  /** O MURAL DE PROCURADOS (src/systems/bicos.js): o selvagem derrubado ou
   *  capturado estava lá? a recompensa cai na hora */
  async pagarProcurado() {
    const valor = cumprirProcurado(this.st, this.foe);
    if (!valor) return;
    Audio2.heal();
    await this.say(DB.BICOS.textos.pago.replace("{MON}", this.foe.nickname).replace("{VALOR}", valor));
  }

  async onFoeFaint() {
    // A GLITCH RAID NÃO DESMAIA: ELA VIRA BOLA. Derrubar o chefe é a captura —
    // ele desinfla até sumir, a bola cai no lugar onde ele estava, e ele é seu.
    //
    // É a única luta do jogo em que ganhar É pegar, e é de propósito: o chefe
    // tem cinco vidas de HP, uma casca na frente e engorda a cada pancada. Quem
    // chegou ao fim disso já fez por merecer, e mandar essa pessoa jogar bola
    // num bicho que ela acabou de derrubar seria cobrar o preço duas vezes.
    if (this.raid) return this.raidVirouBola();

    // (na LUTA NO MAPA ele já caiu lá no mapa, na frente de todo mundo)
    if (!this.noMapa) {
      await this.desmaia("f");
      contarVitoria(this.st, this.foe, this.ultimoEff);   // as MISSÕES DA POKÉDEX
      await this.say(`${this.trainer ? "O " + this.foe.nickname + " INIMIGO" : this.foe.nickname + " SELVAGEM"} DESMAIOU!`);
    }
    // o SURTO EM MASSA conta quem você venceu (src/systems/surtos.js)
    if (!this.trainer) { const t = contarSurto(this.st, this.foe); if (t) await this.say(t); }
    this.marcarMissingnoBrag();

    await this.premiarExp();
    if (!this.trainer) await this.pagarProcurado();   // o MURAL DE PROCURADOS (src/data/bicos.js)
    venceuAmizade(this.mine);          // vencer aproxima (src/systems/creche.js)
    await this.dropDoAlfa();

    if (this.trainer && this.foeIdx < this.foeParty.length - 1) {
      await this.perguntaTroca(this.foeParty[this.foeIdx + 1]);
      this.foeIdx++;
      this.fStages = newStages();
      this.disp.f = this.foe.hp;
      this.sp.f = this.newSprite(90);
      await this.say(`${this.trainer.name} ENVIOU ${this.foe.nickname}!`);
      await this.entrou("f");
      this.menu = { type: "main", index: 0 };
      return;
    }
    if (this.trainer) {
      // a MOEDA AMULETO: alguém da equipe que lutou segura? o prêmio dobra
      const moeda = this.st.party.some((m) => segura(m, "moeda") && !isFainted(m));
      const prize = (this.trainer.prize || 100) * (moeda ? 2 : 1);
      this.st.money += prize;
      if (moeda) await this.say(DB.SEGURAR_TEXTO.moeda);
      if (this.npcKey) (this.st.npcState[this.npcKey] ||= {}).defeated = true;
      await this.say(`VOCÊ DERROTOU ${this.trainer.name}!`);
      await this.say(`VOCÊ GANHOU $${prize}!`);
      // A CÂMERA DO ROTOMFONE (src/systems/fotos.js): líder, rival, amigo, gêmeo → foto juntos
      { const foto = fotoDaLuta(this.st, this.trainer); if (foto) await this.say(foto.tipo === "campeao" ? FOTO_TEXTO.campeao : FOTO_TEXTO.luta); }
      // AS INSÍGNIAS DE BRAGLITCH moram à parte (src/data/braglitch-mundo.js):
      // a história de Kanto conta as oito dela e não pode contar estas
      const bb = this.trainer.bragBadge;
      if (bb && !(this.st.bragBadges ||= []).includes(bb)) {
        this.st.bragBadges.push(bb);
        const b = (DB.INSIGNIAS_BRAG || []).find((x) => x.id === bb);
        Audio2.heal();
        await this.say(DB.BRAGLITCH_TEXTO.insignia.replace("{NOME}", b ? b.name : "INSÍGNIA"));
        this.st.flags.encaixePendente = bb;        // o ENCAIXE no estojo (src/scenes/encaixe.js), na volta pro mapa
      }
      // AS INSÍGNIAS DE JOHTO (src/data/johto.js) também moram à parte
      const jb = this.trainer.johtoBadge;
      if (jb && !(this.st.johtoBadges ||= []).includes(jb)) {
        this.st.johtoBadges.push(jb);
        const b = (DB.INSIGNIAS_JOHTO || []).find((x) => x.id === jb);
        Audio2.heal();
        await this.say(`VOCÊ RECEBEU A ${b ? b.name : "INSÍGNIA"}!`);
      }
      // AS INSÍGNIAS SECRETAS (a do VOID, src/data/void.js) não contam pra
      // história de lado nenhum: ficam numa flag, só de quem achou
      const sec = this.trainer.insigniaSecreta;
      if (sec && !this.st.flags[`insignia_${sec.id}`]) {
        this.st.flags[`insignia_${sec.id}`] = true;
        Audio2.heal();
        await this.say(`VOCÊ RECEBEU A ${sec.nome}!`);
      }
      if (this.trainer.badge && !this.st.badges.includes(this.trainer.badge)) {
        this.st.badges.push(this.trainer.badge);
        const b = DB.STORY.badges.find((x) => x.id === this.trainer.badge);
        Audio2.heal();
        await this.say(`VOCÊ RECEBEU A ${b ? b.name : "INSÍGNIA"}!`);
        // e a MT do líder (src/data/maquinas.js)
        const nMt = MT_DO_LIDER[this.trainer.badge];
        if (nMt) {
          const it = itemDaMT(nMt);
          this.st.items[it] = (this.st.items[it] || 0) + 1;
          await this.say(MAQ_TEXTO.lider);
          await this.say(MAQ_TEXTO.ganhou.replace("{ITEM}", it.toUpperCase()));
        }
        this.st.flags.oakPending = true;
        this.st.flags.escortPending = true;   // o assistente vem te buscar
      }
      // A SALA DA LIGA: venceu a etapa → a sala se transforma pra próxima
      // (a cena é do overworld, `trocaDaLiga`); o campeão é a última
      if (this.trainer.etapaLiga != null && this.trainer.etapaLiga < 4) {
        this.st.flags.ligaPendente = this.trainer.etapaLiga + 1;
      }
      // A LIGA DE BRAGLITCH (src/data/braglitch-liga.js): venceu um dos 4 líderes →
      // os braços robóticos trocam a sala pra próxima (src/systems/ligabrag.js)
      if (this.trainer.etapaLigaBrag != null) this.st.flags.ligaBragPendente = this.trainer.etapaLigaBrag + 1;
      // a LIGA DO VOID (src/data/liga-void.js): a sala derrete pro próximo; o último é o CAMPEÃO
      if (this.trainer.etapaLigaVoid != null) {
        const LV = DB.LIGA_VOID;
        if (this.trainer.etapaLigaVoid < LV.membros.length) this.st.flags.ligaVoidPendente = this.trainer.etapaLigaVoid + 1;
        else if (!this.st.flags.campeaoVoid) {
          this.st.flags.campeaoVoid = true;
          Audio2.heal();
          await this.say(LV.venceu);
          const pr = LV.premio;
          this.st.money = (this.st.money || 0) + (pr.dinheiro || 0);
          if (pr.item) { this.st.items[pr.item] = (this.st.items[pr.item] || 0) + (pr.qtd || 1); await this.say(`VOCÊ RECEBEU ${pr.item.toUpperCase()}!`); }
        }
      }
      // A LIGA DE KANTO (src/data/liga-kanto.js): venceu o AZUL campeão
      if (this.trainer.ligaKanto && this.st.flags.kantoCampeao) this.st.flags.hallPendente = true;
      if (this.trainer.ligaKanto && !this.st.flags.kantoCampeao) {
        this.st.flags.kantoCampeao = true;
        this.st.flags.hallPendente = true;    // o HALL DA FAMA registra o time (src/scenes/halldafama.js)
        Audio2.heal();
        await this.say(`${this.st.player?.name || "VOCÊ"} VIROU CAMPEÃO DE KANTO!`);
        await this.say("AGORA AS LOJAS VENDEM MASTER BALL PRA VOCÊ!");
      }
    }
    if (this.boss && this.npcKey) (this.st.npcState[this.npcKey] ||= {}).defeated = true;
    if (this.flagVitoria) this.st.flags[this.flagVitoria] = true;
    if (this.descontrolada) await this.acalmouDescontrolada();
    if (this.isGlitch && !this.boss) {
      this.st.corruption = Math.min(100, this.st.corruption + 8);
      await this.say("O CORPO DELE SE DESFAZ EM PIXELS QUE NÃO SOMEM DA TELA.");
    }
    // AS TÉCNICAS DO VÍNCULO (src/systems/vinculo.js): quem venceu no fim do
    // HP ganha muito; e o carinho logo depois da luta também vale
    const aguentou = aguentouJunto(this.st, this.mine);
    if (aguentou) { Audio2.heal(); for (const f of aguentou) await this.say(f); }
    marcarVitoria(this.mine);
    await this.finish();
  }

  async onPlayerFaint() {
    await this.desmaia("p");
    await this.say(`${this.mine.nickname} DESMAIOU!`);
    const next = this.st.party.findIndex((m) => !isFainted(m));
    if (next >= 0) {
      this.megaArmada = null;
      this.playerIdx = next;
      this.pStages = newStages();
      this.disp.p = this.mine.hp;
      this.sp.p = this.newSprite(-90);
      await this.say(`VAI, ${this.mine.nickname}!`);
      await this.entrou("p");
      this.menu = { type: "main", index: 0 };
      return;
    }
    await this.say("VOCÊ NÃO TEM MAIS POKÉMON EM CONDIÇÕES DE LUTAR!");
    await this.say("TUDO ESCURECE...");
    this.st.party.forEach(heal);
    this.st.surfando = null;          // você não volta pro centro em cima do LAPRAS
    const back = this.st.respawn || { map: DB.START_MAP, ...DB.MAPS[DB.START_MAP].spawn };
    Object.assign(this.st.player, { map: back.map, x: back.x, y: back.y, dir: back.dir || "down" });
    this.st.corruption = Math.min(100, this.st.corruption + 3);
    await this.say("VOCÊ VOLTOU PRO ÚLTIMO LUGAR SEGURO.");
    await this.finish();
  }

  /** O que dá pra usar em batalha. A GLITCHBALL só aparece se você tiver uma. */
  itensMochila() {
    const g = DB.STORY.glitchball;
    // A POKÉ BOLA está sempre na lista (mesmo zerada: é ela que diz "VOCÊ NÃO
    // TEM POKÉ BOLAS!"); as outras só aparecem com pelo menos uma na mochila.
    // Bola que você não tem ocupando linha é linha a menos pro que dá pra usar.
    const out = (DB.BOLAS || []).filter((b) => (b.insignias === 0 && !b.fabricada) || (this.st.items[b.item] || 0) > 0)
      .map((b) => ({ item: b.item, label: b.label, bola: true, bolso: "BOLAS" }));
    if (g && (this.st.items[g.item] || 0) > 0) {
      out.push({ item: g.item, label: g.item.toUpperCase(), bola: true, glitch: true, bolso: "BOLAS" });
    }
    // a MASTER BALL (e outra bola que a tabela não conhece) também joga
    if ((this.st.items["master ball"] || 0) > 0 && !out.some((o) => o.item === "master ball")) {
      out.push({ item: "master ball", label: "MASTER BALL", bola: true, bolso: "BOLAS" });
    }
    // A CURA e os X da batalha (src/data/itens-uso.js): a POÇÃO sempre (é ela
    // que diz "VOCÊ NÃO TEM POÇÕES!"); os outros só com algum na mochila
    // o CUBO ZYGARDE contra uma CÉLULA: ele GUARDA a célula (a missão O Z DO DNA pede 200)
    const cubo = DB.CUBO_ZYGARDE?.item;
    if (cubo && (this.st.items[cubo] || 0) > 0 && this.foe?.species === "celulazygarde" && !this.trainer)
      out.unshift({ item: cubo, label: "CUBO ZYGARDE", cubo: true, bolso: "BOLAS" });
    for (const item of Object.keys(DB.ITENS_CURA || {})) {
      if (item === "poção" || (this.st.items[item] || 0) > 0) out.push({ item, label: item.toUpperCase(), cura: true, bolso: "CURA" });
    }
    for (const item of Object.keys(DB.ITENS_BATALHA || {})) {
      if ((this.st.items[item] || 0) > 0) out.push({ item, label: item.toUpperCase(), xis: true, bolso: "BATALHA" });
    }
    // o GLITCHBOOSTER só aparece na mochila da batalha quando dá pra usar: com
    // o visor no rosto e o professor já tendo explicado o que é isso
    // O CRISTAL Z: só aparece com um PIKACHU DE BONÉ na frente e uma vez por
    // batalha. Aparecer sem poder ser usado seria oferecer o que não existe.
    const C = DB.CRISTAL;
    if (C && (this.st.items?.[C.item] || 0) > 0 && DB.EH_BONE?.has(this.mine.species)
        && !this.cristalUsado) {
      out.push({ item: C.item, label: "PIKASHUNIUM Z", bola: false, cristal: true, bolso: "OUTROS" });
    }
    if (podeUsarBooster(this.st) && !bugado(this.mine)) {
      out.push({ item: GLITCHBOOSTER.item, label: "GLITCHBOOSTER", bola: false, booster: true, bolso: "OUTROS" });
    }
    // OS POKÉBLOCOS (src/data/pokeblocos.js): só contra selvagem, e com algum no estojo
    const PB = DB.POKEBLOCOS;
    if (PB && !this.trainer && (this.st.items[PB.ESTOJO] || 0) > 0 && (this.st.pokeblocos || []).length) {
      out.push({ item: PB.ESTOJO, label: "POKÉBLOCOS", bola: false, pokebloco: true, bolso: "OUTROS" });
    }
    return out;
  }

  /** OS BOLSOS DA MOCHILA DA BATALHA (◀ ▶): só os que têm alguma coisa */
  bolsosDaBatalha() {
    const todos = this.itensMochila();
    return ["CURA", "BOLAS", "BATALHA", "OUTROS"].filter((b) => todos.some((it) => it.bolso === b));
  }

  /** os itens do bolso da vez (`m.bolso`, índice em bolsosDaBatalha) */
  itensDoBolso(m) {
    const bolsos = this.bolsosDaBatalha();
    m.bolso = Math.min(m.bolso || 0, Math.max(0, bolsos.length - 1));
    return this.itensMochila().filter((it) => it.bolso === bolsos[m.bolso]);
  }

  /** O CUBO ZYGARDE GUARDA A CÉLULA (pedido do CAIO, nov/2026): ela vira luz
   *  verde e entra no cubo; o cubo conta (`st.celulasZygarde`). Com 200, a
   *  CAÇADA da missão O Z DO DNA começa (src/data/extra.js, ZYGARDE_CACADA). */
  async guardarCelula() {
    this.menu = null;
    const Z = DB.ZYGARDE_CACADA, precisa = Z?.precisa || 200;
    const n = (this.st.celulasZygarde = (this.st.celulasZygarde || 0) + 1);
    Audio2.tone(660, 0.08, "triangle", 0.5); Audio2.tone(990, 0.12, "triangle", 0.5);
    this.flash = 0.5;
    this.sp.f.alpha = 0;
    await this.say("O CUBO ZYGARDE ACENDEU VERDE! A CÉLULA VIROU LUZ E ENTROU NELE.");
    if (n < precisa) await this.say(`O CUBO TEM ${n} DE ${precisa} CÉLULAS.`);
    else if (n === precisa) await this.say([`O CUBO TEM ${precisa} CÉLULAS! ELE ESTÁ PULSANDO...`, "PARECE QUE ELAS QUEREM IR PRA ALGUM LUGAR. LÁ PRO TÚNEL ROCHA!"]);
    else await this.say(`O CUBO JÁ TEM ${n} CÉLULAS.`);
    await this.finish();
  }

  /** O CURTO-CIRCUITO EXPLOSIVO DE PIXELS (o golpe Z da MONSTELA, ideia do
   *  CAIO): 1) ela recolhe braços e pernas e vira só um monitor; 2) na tela
   *  preta acende um Wi-Fi de pixels azuis com as 4 barrinhas; 3) as barrinhas
   *  caem, 3... 2... 1..., com estática e rachadura; 4) sem sinal: ERRO
   *  vermelho e o curto-circuito por dentro; 5) BUM! uma explosão de pixels que
   *  cobre a tela, e ela volta. Quem desenha é `desenharMonstelium`. */
  async cenaMonstelium() {
    this.zMonst = { ini: this.t };
    const tom = (f, d, tipo = "square", v = 0.4, em = 0) => setTimeout(() => Audio2.tone(f, d, tipo, v), em);
    tom(660, 0.12, "triangle", 0.4); tom(440, 0.12, "triangle", 0.4, 300);              // recolhendo
    [523, 587, 659, 784].forEach((f, i) => tom(f, 0.08, "square", 0.35, 900 + i * 220));   // o Wi-Fi enchendo
    [784, 587, 440, 330].forEach((f, i) => tom(f, 0.1, "sawtooth", 0.35, 2050 + i * 340));  // as barrinhas caindo
    tom(110, 0.6, "sawtooth", 0.5, 3450); setTimeout(() => Audio2.noise(0.6, 0.5), 3500); // ERRO
    setTimeout(() => { Audio2.noise(0.9, 0.8); Glitch.hit(2.5); this.shake = 0.6; }, 4250); // BUM!
    await this.wait(5.4);
    this.zMonst = null;
    this.sp.p.alpha = 1;
  }

  desenharMonstelium(ctx) {
    const t = this.t - this.zMonst.ini;
    const cx = 120, cy = 58;                 // o monitor vai pro meio da tela
    // 1) RECOLHIMENTO: ela some do lugar dela e o monitor cresce do lugar dela pro meio
    this.sp.p.alpha = t < 0.8 ? 1 - t / 0.8 : t > 5 ? 1 : 0;
    const k = Math.min(1, t / 0.8), mx = 46 + (cx - 46) * k, my = 80 + (cy - 80) * k;
    const mw = Math.round(20 + 40 * k), mh = Math.round(16 + 30 * k);
    if (t < 4.25) {
      const tremor = t > 3.4 ? Math.round(Math.sin(t * 80) * 2) : 0;
      const x0 = Math.round(mx - mw / 2) + tremor, y0 = Math.round(my - mh / 2);
      // a moldura e a tela preta
      ctx.fillStyle = "#202028"; ctx.fillRect(x0 - 3, y0 - 3, mw + 6, mh + 6);
      ctx.fillStyle = "#6a6a78"; ctx.fillRect(x0 - 2, y0 - 2, mw + 4, mh + 4);
      ctx.fillStyle = "#08080c"; ctx.fillRect(x0, y0, mw, mh);
      ctx.fillStyle = "#6a6a78"; ctx.fillRect(Math.round(mx - 4) + tremor, y0 + mh + 2, 8, 4);
      const px = (x, y, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), 2, 2); };
      if (t >= 0.8 && t < 3.4) {
        // 2) O WI-FI: 4 arcos de pixels azuis + o pontinho; 3) caem de um em um
        let barras = 4;
        if (t < 2.0) barras = Math.min(4, Math.floor((t - 0.8) / 0.22) + 1);
        else barras = Math.max(0, 4 - Math.floor((t - 2.05) / 0.34) - 1);
        if (t >= 2.0 && t < 2.05) barras = 4;
        const bx = cx + tremor, by = cy + 12;
        px(bx - 1, by - 1, "#9ad8ff");
        for (let b = 1; b <= 4; b++) {
          const r = b * 6, acesa = b <= barras;
          const pisca = t > 2.0 && b === barras + 1 && Math.floor(t * 20) % 2;
          for (let a = -2.36; a <= -0.78; a += 0.26 / b) {
            px(bx + Math.cos(a) * r - 1, by + Math.sin(a) * r - 1, acesa ? (b % 2 ? "#40a8ff" : "#7cc8ff") : pisca ? "#ffffff" : "#1a2238");
          }
        }
        if (t >= 2.0) {
          // a contagem e a estática em volta
          const n = Math.max(1, 3 - Math.floor((t - 2.05) / 0.45));
          drawText(ctx, `${n}...`, x0 + 2, y0 + 2, "#ffd166");
          for (let i = 0; i < 40; i++) {
            const a = Math.random() * Math.PI * 2, r = 30 + Math.random() * 22;
            ctx.fillStyle = ["#ffffff", "#ffd166", "#ff5d8f", "#40a8ff"][i % 4];
            ctx.fillRect(Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r * 0.7), 1, 1);
          }
          // a rachadura crescendo na tela
          const rach = Math.min(1, (t - 2.0) / 1.4);
          ctx.strokeStyle = "#c8c8d8"; ctx.lineWidth = 1; ctx.beginPath();
          ctx.moveTo(x0 + mw * 0.7, y0); ctx.lineTo(x0 + mw * 0.6, y0 + mh * 0.35 * rach);
          ctx.lineTo(x0 + mw * 0.75, y0 + mh * 0.6 * rach); ctx.lineTo(x0 + mw * 0.65, y0 + mh * rach); ctx.stroke();
        }
      }
      if (t >= 3.4) {
        // 4) O CURTO-CIRCUITO: ERRO vermelho piscando e raios por dentro
        if (Math.floor(t * 12) % 2) { ctx.fillStyle = "#a01010"; ctx.fillRect(x0, y0, mw, mh); }
        drawText(ctx, "ERRO!", Math.round(mx - 15) + tremor, Math.round(my - 4), "#ff4040", { shadow: "#000000" });
        ctx.strokeStyle = "#fff27a"; ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath(); let x = x0 + Math.random() * mw, y = y0;
          ctx.moveTo(x, y);
          while (y < y0 + mh) { x += (Math.random() - 0.5) * 10; y += 4 + Math.random() * 4; ctx.lineTo(x, Math.min(y, y0 + mh)); }
          ctx.stroke();
        }
      }
    } else if (t < 5.4) {
      // 5) BUM!: um cogumelo de pixels coloridos crescendo até cobrir tudo
      const e = (t - 4.25) / 1.15;
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0, 1 - e * 2)})`; ctx.fillRect(0, 0, 240, 160);
      const cores = ["#ffffff", "#40a8ff", "#ff5d8f", "#ffd166", "#7cff9a", "#b070ff"];
      for (let i = 0; i < 260; i++) {
        const a = (i * 2.399) % (Math.PI * 2), r = e * (40 + (i % 13) * 14);
        const lado = 2 + (i % 4);
        ctx.fillStyle = cores[i % cores.length];
        ctx.fillRect(Math.round(cx + Math.cos(a) * r * 1.4), Math.round(cy + Math.sin(a) * r * 0.9 - e * 20), lado, lado);
      }
      if (e < 0.6) drawText(ctx, "BUM!", 108, 54, "#ffffff", { shadow: "#b070ff" });
    }
  }

  /** Liga a GLITCHFORM em quem está na frente: daqui pra frente o dano que ele
   *  tomar vira atributo. Gasta o turno, como qualquer item. */
  /** O GOLPE Z. Uma vez por batalha, e ele não gasta o cristal — o cristal é
   *  item-chave, como o GLITCHBOOSTER: o que acaba é a vez, não o objeto. */
  async usarCristalZ() {
    const C = DB.CRISTAL;
    this.menu = null;
    if (!DB.EH_BONE?.has(this.mine.species)) return void this.say(C.semDono);
    if (this.cristalUsado) return void this.say(C.jaUsou);
    this.cristalUsado = true;
    Glitch.hit(1.2);
    this.flash = 0.6;
    Audio2.tone(880, 0.08, "square", 0.7);
    Audio2.tone(1318, 0.14, "square", 0.6);
    await this.say(C.usou.replace("{MON}", this.mine.nickname));
    // um `moveRef` descartável: o `useMove` procura o golpe pelo id, e o PP
    // deste aqui não é de ninguém — quem controla o uso único é `cristalUsado`
    await this.useMove("p", { id: C.golpe, pp: 1 });
    await this.checkFaints();
    if (this.foe.hp > 0 && !isFainted(this.mine)) {
      const fMove = chooseAiMove(this.foe, this.mine, this.fStages, this.pStages, this.clima?.tipo);
      if (fMove) await this.useMove("f", fMove);
      await this.checkFaints();
    }
  }

  async usarBooster() {
    const G = DB.STORY.glitch;
    this.menu = null;
    if (!ligar(this.st, this.mine)) return void this.say(G.semUso);
    Glitch.hit(2.5);
    Audio2.glitch();
    this.flash = 0.5;
    this.sp.p.blink = 0.5;
    await this.say(G.usou.replace("{NOME}", this.mine.nickname));
    const fMove = chooseAiMove(this.foe, this.mine, this.fStages, this.pStages, this.clima?.tipo);
    if (fMove) await this.useMove("f", fMove);
    await this.checkFaints();
  }

  async tryCatch(item = "poké bola") {
    this.menu = null;
    // GLITCH RAID: primeiro se quebra a casca, depois se conversa
    if (!podeCapturar(this.raid)) {
      Audio2.cancel();
      return void this.say(this.textosDaRaid().raidSemBola);
    }
    // A DESCONTROLADA não entra em bola nenhuma: a aura rebate
    if (this.descontrolada) {
      Audio2.cancel();
      return void this.say(this.textosDescontrolada().semBola);
    }
    // O TOTEM NÃO É PRÊMIO: ele é porteiro. Nenhuma bola funciona nele — nem a
    // GLITCHBALL, que pega tudo. O que se leva da marca é o cristal.
    if (this.totem) {
      Audio2.cancel();
      return void this.say(DB.PROVACOES_TEXTO?.semBola || "A BOLA VOLTA PRA SUA MÃO.");
    }
    const g = DB.STORY.glitchball;
    const ehGlitch = !!g && item === g.item;
    if (this.trainer) {
      await this.say("NÃO SE ROUBA O POKÉMON DOS OUTROS!");
      this.menu = { type: "main", index: 0 };
      return;
    }
    const bola = bolaPorItem(item);
    if ((this.st.items[item] || 0) <= 0) {
      await this.say(ehGlitch ? "VOCÊ NÃO TEM NENHUMA GLITCHBALL!"
                              : `VOCÊ NÃO TEM NENHUMA ${(bola?.label || item).toUpperCase()}!`);
      this.menu = { type: "main", index: 0 };
      return;
    }
    this.gastar(item);
    if (ehGlitch) { Glitch.hit(2); Audio2.glitch(); }
    await this.say(ehGlitch ? g.jogou : jogouBola(item));
    this.ballAnim = { t: 0, shakes: 0 };
    // o bônus da bola entra na mesma fórmula de sempre (`catchAttempt`): 1 na
    // comum, 1,5 na GREAT e 2 na ULTRA, como no jogo original
    // a MASTER BALL pega sempre
    const bonusBola = bonusDaBola(bola, this);       // (as da FÁBRICA dependem da batalha: src/systems/bolas.js)
    let shakes = ehGlitch ? catchGlitchball(this.foe) : item === "master ball" ? 4 : catchAttempt(this.foe, bonusBola * fatorCaptura());
    // FICA! (a linha do DIGGLE, se for ele que está em campo): a bola ia abrir,
    // ele late o comando e o selvagem fica lá dentro. O bônus é 25% do nível,
    // SOMADO à chance da bola (ver `ficaNaBola`).
    let ficou = false;
    if (!ehGlitch && shakes < 4 && ficaNaBola(this.mine, chanceDeCaptura(this.foe, bonusBola * fatorCaptura()))) {
      shakes = 4; ficou = true;
      this.mostrarHabilidade(this.mine, habilidadeDoMon(this.mine), false);
    }
    await this.wait(0.7);
    // SEGURAR A TAMPA (src/systems/tampa.js), a técnica secreta: a bola fechou
    // e a sua mão pode ficar em cima. Antes de cada chacoalhada vem uma
    // pausinha; a chacoalhada que ia falhar ganha um sorteio pequeno a mais com
    // a ajuda da mão. A GLITCHBALL não precisa.
    const usaMao = !ehGlitch;
    if (usaMao) this.ballAnim.mao = { segura: false, apertouEm: null, sinalEm: Infinity, jeito: null, efeito: 0 };
    let feitas = 0;
    for (let i = 0; i < 4; i++) {
      let vale = i < shakes;
      const m = this.ballAnim.mao;
      if (m) {
        m.sinalEm = this.t;
        await this.wait(TAMPA.janela);
        m.jeito = jeitoDaMao(m.segura, m.apertouEm, m.sinalEm);
        if (m.jeito) m.efeito = 0.35;
        if (m.jeito === "apertao") Audio2.tone(880, 0.06);
        if (!vale && Math.random() < ajudaDaMao(m.jeito)) { vale = true; }
      }
      if (!vale) break;
      feitas = i + 1;
      if (i < 3) {
        this.ballAnim.shakes = i + 1;
        Audio2.tone(300 + i * 60, 0.08);
        await this.wait(m ? 0.55 - TAMPA.janela : 0.55);
      }
    }
    shakes = feitas;
    // a mão sai antes das falas (senão o A que passa o texto ia pra ela)
    this.ballAnim.mao = null;
    if (shakes >= 4) {
      Audio2.heal();
      this.ballAnim.caught = true;
      if (ficou) await this.say(DB.CLIMA_TEXTO?.fica?.replace("{MON}", this.mine.nickname).replace("{FOE}", this.foe.nickname)
        || `${this.mine.nickname}: FICA! E ${this.foe.nickname} FICOU NA BOLA.`);
      await this.say(`GOTCHA! ${this.foe.nickname} FOI CAPTURADO!`);
      // dentro da bola ninguém fica megado: o que entra na equipe é a espécie
      // de verdade (e é ela que conta pra Pokédex e pro fim do arco)
      if (reverterMega(this.foe)) {
        await this.say(DB.STORY.mega.voltou.replace("{MON}", this.foe.nickname));
      }
      await this.guardarCapturado();
      return;
    }
    this.ballAnim = null;
    const msgs = ["OH, NÃO! O POKÉMON ESCAPOU!", "DROGA! QUASE!", "ARGH! QUASE PEGUEI!"];
    await this.say(msgs[Math.min(shakes, 2)]);
    const fMove = chooseAiMove(this.foe, this.mine, this.fStages, this.pStages, this.clima?.tipo);
    if (fMove) await this.useMove("f", fMove);
    await this.checkFaints();
    if (!isFainted(this.foe)) await this.passaTurnoDoPokebloco();
  }

  /** O ALFA derruba um item quando cai (config.js, `alfaDrops`): é o que faz
   *  valer a pena enfrentar um em vez de contornar. Só selvagem — o de
   *  treinador é dele. */
  async dropDoAlfa() {
    if (!this.foe?.alfa || this.trainer) return;
    const tabela = DB.CONFIG?.alfaDrops || [];
    const total = tabela.reduce((a, d) => a + (d.w || 1), 0);
    let r = Math.random() * total;
    const d = tabela.find((x) => (r -= x.w || 1) <= 0) || tabela[0];
    if (!d) return;
    const qtd = randRange(d.qty?.[0] ?? 1, d.qty?.[1] ?? 1);
    this.st.items[d.item] = Math.min(999, (this.st.items[d.item] || 0) + qtd);
    Audio2.heal();
    await this.say(`O ${this.foe.nickname} ALFA DEIXOU CAIR ${qtd} ${d.item.toUpperCase()}!`);
  }

  /** A EXPERIÊNCIA de derrubar aquele bicho. Virou método porque a GLITCH RAID
   *  não passa mais pelo desmaio (ela vira bola), e sem isto ela deixaria de
   *  dar experiência nenhuma — o chefe mais difícil do jogo pagando menos que
   *  um pidgey. */
  async premiarExp() {
    // o SANDUÍCHE DOCE do acampamento entra aqui, multiplicando o que se aprende
    const xp = Math.floor(xpYieldFor(this.foe) * (this.trainer ? 1.5 : 1)
                          * fator(this.st, "xp") * (this.raid?.xp || 1) * fatorXp());
    const share = DB.CONFIG?.shareXp !== false;
    // desmaiado não ganha experiência (senão ele subiria de nível dentro da bola)
    const winners = (share ? this.st.party : [this.mine]).filter((m) => !isFainted(m));
    const ativo = isFainted(this.mine) ? null : this.mine;   // pode ter caído junto

    if (ativo) await this.say(`${ativo.nickname} GANHOU ${xp} DE EXP.!`);
    const outros = winners.filter((m) => m !== ativo).length;
    if (share && outros) {
      await this.say(`${ativo ? "O RESTO DA EQUIPE TAMBÉM GANHOU" : "A EQUIPE GANHOU"} ${xp} DE EXP.!`);
    }
    for (const mon of winners) {
      if (mon.trunfo) await this.say(DB.TRUNFO_TEXTO.dobro.replace("{MON}", mon.nickname));
      // o OVO DA SORTE segurado: mais experiência pra quem segura
      for (const ev of gainXp(mon, Math.floor(xp * fatorXpItem(mon)))) {
        if (ev.type === "level") {
          Audio2.heal();
          await this.say(`${mon.nickname} SUBIU PARA O NÍVEL ${ev.level}!`);
        }
        if (ev.type === "move") await this.say(`${mon.nickname} APRENDEU ${DB.MOVES[ev.id].name}!`);
        if (ev.type === "moveFull") {
          await this.say(`${mon.nickname} TENTOU APRENDER ${DB.MOVES[ev.id].name}, MAS JÁ SABE 4 GOLPES.`);
        }
      }
    }
  }

  /** Os textos da raid: os da GLITCH RAID, com os da ULTRA RAID por cima
   *  quando ela veio de um ultra buraco (src/data/story.js, `ultra`). */
  textosDaRaid() {
    return this.raid?.ultra ? { ...DB.STORY.glitch, ...DB.STORY.ultra } : DB.STORY.glitch;
  }

  /** O CHEFE VIRANDO BOLA. Ele encolhe até sumir, a bola cai, e a captura é
   *  a mesma de sempre daí pra frente. */
  async raidVirouBola() {
    const G = this.textosDaRaid();
    const pr = premioRaid();
    this.st.money = Math.min(999999, (this.st.money || 0) + pr.dinheiro);
    this.raid.xp = pr.xp;
    if (DB.CONFIG?.sustos) { Glitch.hit(2); Audio2.glitch(); }
    else Audio2.tone(392, 0.16, "triangle", 0.5);
    await this.say(G.raidCaiu.replace("{NOME}", this.foe.nickname));
    await this.premiarExp();                 // a experiência do chefe vem antes da bola

    await this.encolher();                   // desinfla até sumir
    this.sp.f.alpha = 0;
    Audio2.tone(700, 0.06, "square", 0.6);
    this.ballAnim = { t: 0.7, shakes: 0 };   // a bola já no chão, sem o arco
    await this.wait(0.5);
    for (let i = 0; i < 3; i++) {            // os três chacoalhos, por costume
      this.ballAnim.shakes = i + 1;
      Audio2.tone(300 + i * 60, 0.08);
      await this.wait(0.45);
    }
    this.ballAnim.caught = true;
    Audio2.heal();
    await this.say(G.raidGanhou.replace("{DINHEIRO}", pr.dinheiro));
    await this.say(`GOTCHA! ${this.foe.nickname} FOI CAPTURADO!`);

    // Ele entra INTEIRO. Estava em zero porque você acabou de derrubar, e um
    // prêmio que chega desmaiado é um prêmio que você não pode usar até o
    // próximo Centro — o que transforma a recompensa em ida e volta.
    heal(this.foe);
    if (reverterMega(this.foe)) {
      await this.say(DB.STORY.mega.voltou.replace("{MON}", this.foe.nickname));
    }
    await this.guardarCapturado();
  }

  /** O QUE ACONTECE DEPOIS DE PEGAR. Vale pra bola jogada por você e pra GLITCH
   *  RAID derrubada — os dois terminam no mesmo lugar, e um jeito só de guardar
   *  é um jeito só de errar. */
  async guardarCapturado() {
    // O CARDUME (src/systems/cardume.js): a bola não cabe um cardume inteiro —
    // cabe um peixe dele. O resto se espalha.
    const base = baseDoCardume(this.foe.species);
    if (base && DB.SPECIES[base]) {
      const nomeCardume = this.foe.nickname;
      this.foe.species = base;
      this.foe.nickname = DB.SPECIES[base].name;
      recalc(this.foe);
      this.foe.hp = this.foe.maxHp;
      await this.say(`O ${nomeCardume} SE DESFEZ! UM ${DB.SPECIES[base].name} FICOU NA BOLA E O RESTO DO CARDUME FUGIU.`);
    }
    // OS POKÉBLOCOS: quem comeu pesado ganha o garfo no nome (e o resto some)
    const marca = aoCapturar(this.foe);
    if (marca) await this.say(marca);
    // NADA PASSA DE 100 FORA DA FENDA: o que nasceu na GLITCH DIMENSION
    // EXTREMA (dlc/extrema.js) com nível +100 sai dela com os 100 de volta —
    // o 101 vira 1, o GIRATINA de 170 vira 70
    if (this.foe.level > 100) {
      const cheio = this.foe.hp / Math.max(1, this.foe.maxHp);
      this.foe.level -= 100;
      this.foe.xp = xpForLevel(this.foe.level);
      recalc(this.foe);
      this.foe.hp = Math.max(1, Math.round(this.foe.maxHp * cheio));
    }
    if (!this.trainer) await this.pagarProcurado();   // capturar também vale pro MURAL
    // o PRIMEIRO MISSINGNO. capturado (qualquer forma) traz a PEDRA BUGADA junto
    if (this.ehMissingno() && !(this.st.items[PEDRA_BUGADA.item] > 0)) {
      this.st.items[PEDRA_BUGADA.item] = 1;
      Glitch.hit(1);
      Audio2.heal();
      await this.say(PEDRA_BUGADA.ganhou);
    }
    // A SEMANA DO SHINY (src/data/eventos.js, `lumiACada`): a cada 10 shinies
    // pegos na semana, um LUMINOSO nasce no mato perto de você (o overworld
    // solta ele: `flags.lumiPendente`)
    const semana = this.foe.shiny && shinyDoEvento();
    if (semana?.lumiACada) {
      const f = this.st.flags, chave = `${semana.id}_${hojeDoEvento().getFullYear()}`;
      f.shiniesDaSemana = f.shiniesDaSemana?.chave === chave ? f.shiniesDaSemana : { chave, n: 0 };
      f.shiniesDaSemana.n++;
      const faltam = semana.lumiACada - (f.shiniesDaSemana.n % semana.lumiACada);
      if (faltam === semana.lumiACada) { f.lumiPendente = true; await this.say(semana.lumiVem); }
      else await this.say(semana.lumiFalta.replace("{N}", faltam));
    }
    // o SURTO EM MASSA conta quem você pegou (src/systems/surtos.js)
    { const t = contarSurto(this.st, this.foe); if (t) await this.say(t); }
    // as MISSÕES DA POKÉDEX (src/systems/pesquisa.js): pegou (de noite? alfa?)
    contarCaptura(this.st, this.foe);
    // um LENDÁRIO ou um SHINY: foto com ele na CÂMERA do ROTOMFONE
    if (fotoDaCaptura(this.st, this.foe)) await this.say(FOTO_TEXTO.captura.replace("{MON}", this.foe.nickname));
    // espécie nova: a POKÉDEX anota, e diz que anotou (src/data/pokedex.js)
    const novo = !this.st.caught[this.foe.species] && !!this.st.flags?.pokedex;
    this.st.caught[this.foe.species] = true;
    if (novo && DB.POKEDEX_TEXTO?.registrou) {
      Audio2.tone(660, 0.06); Audio2.tone(990, 0.1);
      await this.say(DB.POKEDEX_TEXTO.registrou.replace("{MON}", this.foe.nickname));
    }
    // o selvagem que vinha segurando: o item vem junto
    if (this.foe.item) await this.say(DB.SEGURAR_TEXTO.capturouCom.replace("{MON}", this.foe.nickname).replace("{ITEM}", this.foe.item.toUpperCase()));
    if (this.boss && this.npcKey) (this.st.npcState[this.npcKey] ||= {}).defeated = true;
    if (this.flagVitoria) this.st.flags[this.flagVitoria] = true;
    if (this.flagCaptura) this.st.flags[this.flagCaptura] = true;
    if (this.st.party.length < 6) {
      this.st.party.push(this.foe);
      await this.say(`${this.foe.nickname} ENTROU NA EQUIPE.`);
    } else {
      await this.say(`${this.foe.nickname} FOI ENVIADO AO PC.`);
      this.st.box.push(this.foe);
    }
    if (this.boss) await this.say(this.falaCaptura || DB.STORY.dimension.caught);
    // RAID DE EVENTO (src/data/eventos.js): pegou, fecha até o ano que vem
    if (this.raid?.evento) {
      marcarRaidDeEvento(this.st, this.raid.evento);
      if (this.raid.pegou) await this.say(this.raid.pegou);
    }
    this.marcarMissingnoBrag();
    if (this.foe.species === "missingno" && emBraglitch(this.st.player.map)) {
      // em BRAGLITCH ele é só mais um glitch solto: não conserta Kanto
      // (src/systems/regionais.js, `glitchDeVerdade`)
      const T = DB.BRAGLITCH_TEXTO?.missingnoPego;
      if (T) await this.say(T.replace("{MON}", this.foe.nickname));
    } else if (this.foe.species === "missingno") {
      // fim do arco: o mundo volta ao normal
      this.st.flags.caughtMissingno = true;
      this.st.flags.glitchWorld = false;
      this.st.corruption = 0;
      Glitch.forced = false;
      Glitch.burst = 0;
      for (const line of DB.STORY.ending) await this.say(line);
    }
    // PEGOU O MISSINGNO. pela 1ª vez: de volta no mapa, o CARVALHO liga e manda
    // a foto do PIKACHU SURPRESO (src/data/rotomfone.js, LIGACAO_MISSINGNO)
    if (this.foe.species === "missingno" && !this.st.flags.ligouMissingno) this.st.flags.ligouMissingno = "pendente";
    await this.finish();
  }

  async tryFlee() {
    this.menu = null;
    if (this.totem) {
      await this.say(DB.PROVACOES_TEXTO?.fuga || "A MARCA NÃO DEIXA VOCÊ SAIR.");
      this.menu = { type: "main", index: 0 };
      return;
    }
    if (this.boss) {
      await this.say(this.descontrolada ? this.textosDescontrolada().semFuga
                                        : "A FENDA SE FECHOU ATRÁS DE VOCÊ. NÃO TEM PRA ONDE FUGIR!");
      this.menu = { type: "main", index: 0 };
      return;
    }
    if (this.trainer) {
      await this.say("NÃO DÁ PRA FUGIR DE UMA BATALHA DE TREINADOR!");
      this.menu = { type: "main", index: 0 };
      return;
    }
    this.fleeTries++;
    if (this.isGlitch && Math.random() < 0.5) {
      Glitch.hit(1.5);
      await this.say("VOCÊ TENTA FUGIR... MAS A SAÍDA NÃO ESTÁ CARREGADA.");
      const fMove = chooseAiMove(this.foe, this.mine, this.fStages, this.pStages, this.clima?.tipo);
      if (fMove) await this.useMove("f", fMove);
      await this.checkFaints();
      return;
    }
    // o SANDUÍCHE AZEDO conta como tentativas a mais: sair fica mais fácil
    if (canFlee(this.mine, this.foe, this.fleeTries * fator(this.st, "fuga"))) {
      await this.say("VOCÊ FUGIU EM SEGURANÇA!");
      await this.finish();
    } else {
      await this.say("NÃO CONSEGUIU FUGIR!");
      const fMove = chooseAiMove(this.foe, this.mine, this.fStages, this.pStages, this.clima?.tipo);
      if (fMove) await this.useMove("f", fMove);
      await this.checkFaints();
    }
  }

  async usePotion() { return this.usarCura("poção"); }

  /** item sem efeito: avisa e volta pro menu, sem gastar o turno */
  async semEfeito(texto = "NÃO VAI FAZER EFEITO NENHUM.") {
    this.menu = null;
    await this.say(texto);
    this.menu = { type: "main", index: 0 };
  }

  /** A CURA (src/data/itens-uso.js): no da frente, ou `alvo` (o REVIVER) */
  async usarCura(item, alvo = this.mine) {
    this.menu = null;
    const d = DB.ITENS_CURA?.[item] || { hp: 20 };
    if ((this.st.items[item] || 0) <= 0) {
      return this.semEfeito(item === "poção" ? "VOCÊ NÃO TEM POÇÕES!" : `VOCÊ NÃO TEM ${item.toUpperCase()}!`);
    }
    const caido = isFainted(alvo);
    if (d.reviver ? !caido : caido) return this.semEfeito(caido ? `${alvo.nickname} ESTÁ DESMAIADO. ISSO NÃO RESOLVE.` : undefined);
    const curaStatus = d.status && alvo.status && (d.status === "*" || d.status === alvo.status);
    const curaHp = d.hp && alvo.hp < alvo.maxHp;
    if (!d.reviver && !curaStatus && !curaHp) {
      return this.semEfeito(d.hp && !d.status ? `${alvo.nickname} JÁ ESTÁ COM O HP CHEIO!` : undefined);
    }
    this.gastar(item);
    Audio2.heal();
    const falas = [];
    if (d.reviver) {
      alvo.hp = Math.max(1, Math.floor(alvo.maxHp * d.reviver));
      alvo.status = null;
      falas.push(`${alvo.nickname} LEVANTOU!`);
    }
    if (curaHp) {
      const antes = alvo.hp;
      alvo.hp = d.hp === "max" ? alvo.maxHp : Math.min(alvo.maxHp, alvo.hp + d.hp);
      falas.push(`${alvo.nickname} RECUPEROU ${alvo.hp - antes} DE HP!`);
    }
    if (curaStatus) { alvo.status = null; falas.push(`${alvo.nickname} FICOU BOM!`); }
    await this.syncHp();
    for (const f of falas) await this.say(f);
    if (alvo === this.mine && curaHp) {
      const doce = aoSerCurado(this.mine, this.pStages);
      if (doce) await this.say(doce);
    }
    const fMove = chooseAiMove(this.foe, this.mine, this.fStages, this.pStages, this.clima?.tipo);
    if (fMove) await this.useMove("f", fMove);
    await this.checkFaints();
    await this.passaTurnoDoPokebloco();
  }

  /** OS X DA BATALHA (X ATAQUE...): +1 nível no atributo do da frente */
  async usarX(item) {
    this.menu = null;
    const d = DB.ITENS_BATALHA?.[item];
    if (!d || (this.st.items[item] || 0) <= 0) return this.semEfeito();
    if ((this.pStages[d.stat] || 0) >= 6) return this.semEfeito(`O ${d.nome} DE ${this.mine.nickname} NÃO SOBE MAIS!`);
    this.gastar(item);
    this.pStages[d.stat] = (this.pStages[d.stat] || 0) + 1;
    Audio2.heal();
    await this.say(`O ${d.nome} DE ${this.mine.nickname} SUBIU!`);
    const fMove = chooseAiMove(this.foe, this.mine, this.fStages, this.pStages, this.clima?.tipo);
    if (fMove) await this.useMove("f", fMove);
    await this.checkFaints();
    await this.passaTurnoDoPokebloco();
  }

  /** As cores de pokébloco que tem no estojo: [cor, quantos] */
  coresDePokebloco() {
    const blocos = this.st.pokeblocos || [];
    return [...new Set(blocos.map((b) => b.cor))].map((c) => [c, blocos.filter((b) => b.cor === c).length]);
  }

  /** JOGAR UM POKÉBLOCO no selvagem (src/systems/pokeblocos.js): ele come — o
   *  mais forte daquela cor —, fica mais fácil de pegar, e gasta o turno. */
  async jogarPokebloco(cor) {
    this.menu = null;
    const PB = DB.POKEBLOCOS, T = PB.POKEBLOCO_TEXTO;
    if (this.trainer) { await this.say(T.soSelvagem); this.menu = { type: "main", index: 0 }; return; }
    const blocos = this.st.pokeblocos || [];
    const b = blocos.filter((x) => x.cor === cor).sort((x, y) => y.nivel - x.nivel)[0];
    if (!b) { this.menu = { type: "main", index: 0 }; return; }
    const r = darAoSelvagem(this.foe, b, this.fStages);
    if (!r) { await this.say(T.cheio.replace("{MON}", this.foe.nickname)); this.menu = { type: "main", index: 0 }; return; }
    blocos.splice(blocos.indexOf(b), 1);
    Audio2.heal();
    this.atualizaLargura();
    await this.say(r.falas);
    const fMove = chooseAiMove(this.foe, this.mine, this.fStages, this.pStages, this.clima?.tipo);
    if (fMove) await this.useMove("f", fMove);
    await this.checkFaints();
  }

  /** Um turno a menos de pokébloco no selvagem (e a largura dele acompanha) */
  async passaTurnoDoPokebloco() {
    const fala = passaTurnoPokebloco(this.foe);
    this.atualizaLargura();
    if (fala) await this.say(fala);
  }
  /** comeu pokébloco PESADO e o efeito vale: ele fica mais largo */
  atualizaLargura() {
    this.sp.f.largura = largoDoPokebloco(this.foe) ? DB.POKEBLOCOS.BATALHA.largura : 1;
  }

  /** tira um item do bolso; no zero ele some da mochila (igual ao overworld) */
  gastar(item) {
    this.st.items[item] -= 1;
    if (this.st.items[item] <= 0) delete this.st.items[item];
  }

  async finish() {
    // a TRANSFORMAÇÃO do DITTO dura só a batalha
    for (const m of [...this.st.party, ...this.foeParty]) desfazerTransformacao(m);
    // a MEGA dura só a batalha: ninguém sai daqui megado (nem o save)
    this.foeParty.forEach(reverterMega);
    for (const m of [...this.st.party, ...this.foeParty]) desdynamaxar(m);   // o DYNAMAX também
    reverterTudo(this.st);
    limparTudo(this.st);          // o bug do GLITCHBOOSTER dura só esta batalha
    // e o do CHEFE some junto. Sem isto, capturar um chefe de GLITCH RAID
    // guardava no save um Pokémon com o bônus do bug congelado pra sempre —
    // `limparTudo` só varre a equipe, e o recém-capturado pode ter ido pro PC.
    limpar(this.foe);
    this.foeParty.forEach(limpar);
    Audio2.stopLoop();
    this.fadeDir = 1;
    await this.until(() => this.fadeA >= 1);
    this.game.scenes.pop();
  }

  // ---------------------------------------------------------- update
  update(dt) {
    // o CARDUME encolhe junto com a barra de HP (os peixinhos se espalhando)
    if (this.foe && this.sp?.f && baseDoCardume(this.foe.species)) {
      const k = this.foe.maxHp ? Math.max(0, (this.disp?.f ?? this.foe.hp) / this.foe.maxHp) : 1;
      this.sp.f.escala = escalaDoCardume({ hp: k, maxHp: 1 });
    }
    this.t += dt;
    this.shake = Math.max(0, this.shake - dt);
    // as faixas de habilidade passam e somem
    if (this.habPops?.length) {
      for (const h of this.habPops) h.t += dt;
      this.habPops = this.habPops.filter((h) => h.t < h.dur);
    }
    if (this.auraVinculo > 0) this.auraVinculo = Math.max(0, this.auraVinculo - dt);

    if (this.fadeDir) {
      this.fadeA = Math.max(0, Math.min(1, this.fadeA + this.fadeDir * dt * 3));
      if (this.fadeDir < 0 && this.fadeA <= 0) this.fadeDir = 0;
    }
    if (this.ballAnim) this.ballAnim.t += dt;
    const mao = this.ballAnim?.mao;
    if (mao) {
      mao.segura = Input.held("a");
      if (Input.consume("a")) mao.apertouEm = this.t;
      mao.efeito = Math.max(0, mao.efeito - dt);
    }
    // O CHEFE INCHANDO. Ele não aparece pronto: vem do tamanho errado e vai até
    // o certo, dando solavanco no caminho. É o único momento em que a tela diz
    // o tamanho da coisa antes de qualquer número aparecer.
    if (this.crescendo) {
      const c = this.crescendo;
      c.t += dt;
      const k = Math.min(1, c.t / c.dur);
      const macio = k * k * (3 - 2 * k);
      this.sp.f.escala = c.de + macio * (c.para - c.de);
      // O TREMOR E O ESTOURO SÃO SUSTO. Sem eles ele cresce liso e para: o
      // tamanho continua dizendo o que ele é, sem sacudir a tela pra dizer.
      const susto = !!DB.CONFIG?.sustos;
      if (susto && Math.random() < dt * 8) { Glitch.hit(0.7); this.shake = 0.14; }
      if (k >= 1) {
        this.crescendo = null;
        if (susto) { this.shake = 0.45; this.flash = 0.55; Glitch.hit(2.5); Audio2.glitch(); }
        else Audio2.tone(196, 0.22, "triangle", 0.5);
      }
    }
    // o DYNAMAX crescendo (ou voltando)
    for (const k of ["p", "f"]) {
      const sp = this.sp[k];
      if (sp?.dyAlvo == null) continue;
      const e = sp.escala || 1;
      sp.escala = e + (sp.dyAlvo - e) * Math.min(1, dt * 5);
      if (Math.abs(sp.escala - sp.dyAlvo) < 0.01) { sp.escala = sp.dyAlvo; sp.dyAlvo = null; }
    }
    this.flash = Math.max(0, this.flash - dt * 1.6);
    if (this.tOut > 0 && this.tOut < 1) this.tOut = Math.min(1, this.tOut + dt * 4);

    // O MISSINGNO. VAZA DADO: enquanto ele está em campo, sai 0 e 1 dele sem parar
    if (this.ehMissingno() && !this.sp.f.faint && !this.showTrainer && this.sp.f.alpha > 0) {
      this.bitsT = (this.bitsT || 0) + dt;
      while (this.bitsT > 0.07) { this.bitsT -= 0.07; this.soltarBit(); }
    }
    for (let i = this.fx.length - 1; i >= 0; i--) {
      const e = this.fx[i];
      e.t += dt;
      e.x += e.vx * dt;
      e.y += e.vy * dt;
      e.vy += e.g * dt;
      e.ang += e.gira * dt;
      if (e.cresce) e.r += e.cresce * dt;
      if (e.t >= e.vida) this.fx.splice(i, 1);
    }

    for (const k of ["p", "f"]) {
      const s2 = this.sp[k];
      if (s2.dx) { s2.dx *= Math.max(0, 1 - dt * 9); if (Math.abs(s2.dx) < 0.6) s2.dx = 0; }
      s2.blink = Math.max(0, s2.blink - dt);
      s2.lunge = Math.max(0, s2.lunge - dt);
      if (s2.desmaio) s2.desmaio.t += dt;
      else if (s2.faint) s2.alpha = 0;
    }

    // barras de HP animadas
    for (const [k, mon] of [["p", this.mine], ["f", this.foe]]) {
      const target = mon.hp;
      if (this.disp[k] !== target) {
        const speed = Math.max(6, mon.maxHp / 1.2);
        const d = Math.sign(target - this.disp[k]) * speed * dt;
        this.disp[k] = Math.abs(target - this.disp[k]) <= Math.abs(d) ? target : this.disp[k] + d;
      }
    }

    for (let i = this.timers.length - 1; i >= 0; i--) {
      this.timers[i].t -= dt;
      if (this.timers[i].t <= 0) { this.timers[i].res(); this.timers.splice(i, 1); }
    }
    for (let i = this.waits.length - 1; i >= 0; i--) {
      if (this.waits[i].fn()) { this.waits[i].res(); this.waits.splice(i, 1); }
    }

    if (this.dlg.update(dt)) return;
    // TEMPO REAL: toda vez que a batalha chegaria no menu de turno, é a arena
    if (this.modoExplosivo) {
      if (this.menu?.type === "main") { this.menu = null; iniciarExplosiva(this); }
      if (!this.busy && this.explosiva) atualizarExplosiva(this, dt);
      return;
    }
    if (this.modoReal) {
      if (this.menu?.type === "main") { this.menu = null; iniciarReal(this); }
      if (!this.busy && this.arena) atualizarReal(this, dt);
      return;
    }
    // (a lista da troca do ALTERNAR anda mesmo com a batalha ocupada)
    if ((this.busy && !this.menu?.livre) || !this.menu) return;
    this.updateMenu();
  }

  updateMenu() {
    const m = this.menu;
    // de alguém: o menu principal vira a ORDEM do dono — obedecer ou não
    if (m.type === "main" && this.souDeAlguem()) {
      // o selvagem fraco na frente dele: o dono joga a bola DELE (é caçador)
      if (this.donoQuerBola()) {
        this.run(this.bolaDoDono());
        return;
      }
      // bravo o bastante, às vezes ele aperta a bola e a ordem vem sem escolha
      this.menu = { type: "ordem", index: 0, forcada: ordemForcada(this.st), ...this.ordemDoDono() };
      return;
    }
    if (m.type === "main") {
      const items = ["LUTAR", "MOCHILA", "POKÉMON", "FUGIR"];
      const move = (d) => { m.index = (m.index + d + 4) % 4; Audio2.blip(); };
      this.tentarArmarMega();
      this.tentarArmarZ();
      this.tentarArmarDynamax();
      if (Input.consume("up")) move(-2);
      if (Input.consume("down")) move(2);
      if (Input.consume("left")) move(-1);
      if (Input.consume("right")) move(1);
      if (Input.consume("a")) {
        Audio2.select();
        if (m.index === 0) this.menu = { type: "moves", index: 0 };
        else if (m.index === 1) this.menu = { type: "bag", index: 0 };
        else if (m.index === 2) this.menu = { type: "party", index: this.playerIdx };
        else this.run(this.tryFlee());
      }
      return;
    }
    if (m.type === "ordem") {
      if (!m.forcada && (Input.consume("up") || Input.consume("down"))) { m.index = 1 - m.index; Audio2.blip(); }
      if (Input.consume("a")) {
        Audio2.select();
        if (m.index === 0 || m.forcada) this.run(this.obedecerOrdem(m.slot));
        else this.menu = { type: "desobedecer", index: 0, slot: m.slot };
      }
      return;
    }
    if (m.type === "desobedecer") {
      const n = DESOBEDIENCIA.length;
      const move = (d) => { m.index = (m.index + d + n) % n; Audio2.blip(); };
      if (Input.consume("up")) move(-2);
      if (Input.consume("down")) move(2);
      if (Input.consume("left")) move(-1);
      if (Input.consume("right")) move(1);
      if (Input.consume("b")) { this.menu = { type: "ordem", index: 0, slot: m.slot }; Audio2.cancel(); }
      if (Input.consume("a")) { Audio2.select(); this.run(this.desobedecer(m.slot, DESOBEDIENCIA[m.index])); }
      return;
    }
    if (m.type === "moves") {
      const n = this.mine.moves.length;
      const move = (d) => { m.index = (m.index + d + n) % n; Audio2.blip(); };
      this.tentarArmarMega();
      this.tentarArmarZ();
      this.tentarArmarDynamax();
      if (Input.consume("up")) move(-2);
      if (Input.consume("down")) move(2);
      if (Input.consume("left")) move(-1);
      if (Input.consume("right")) move(1);
      if (Input.consume("b")) { this.menu = { type: "main", index: 0 }; Audio2.cancel(); }
      if (Input.consume("a")) {
        const mv = this.mine.moves[m.index];
        if (mv.pp <= 0) { Audio2.cancel(); return; }
        Audio2.select();
        this.run(this.playerTurn(m.index));
      }
      return;
    }
    if (m.type === "bag") {
      // ◀ ▶ troca de bolso
      const nb = this.bolsosDaBatalha().length;
      if (nb > 1 && Input.consume("left")) { m.bolso = ((m.bolso || 0) + nb - 1) % nb; m.index = 0; Audio2.blip(); }
      if (nb > 1 && Input.consume("right")) { m.bolso = ((m.bolso || 0) + 1) % nb; m.index = 0; Audio2.blip(); }
      const itens = this.itensDoBolso(m);
      const n = Math.max(1, itens.length);
      if (Input.consume("up")) { m.index = (m.index + n - 1) % n; Audio2.blip(); }
      if (Input.consume("down")) { m.index = (m.index + 1) % n; Audio2.blip(); }
      if (Input.consume("b")) { this.menu = { type: "main", index: 1 }; Audio2.cancel(); }
      if (Input.consume("a")) {
        Audio2.select();
        const it = itens[Math.min(m.index, n - 1)];
        if (it.pokebloco) { this.menu = { type: "pokeblocos", index: 0 }; return; }
        if (!it) return;
        if (it.cura && DB.ITENS_CURA[it.item]?.reviver) {
          // o REVIVER escolhe quem levantar (entre os desmaiados)
          if ((this.st.items[it.item] || 0) <= 0) { Audio2.cancel(); return; }
          if (!this.st.party.some((p) => isFainted(p))) { this.run(this.semEfeito()); return; }
          this.menu = { type: "reviver", item: it.item, index: 0, volta: { ...m } };
          return;
        }
        this.run(it.cubo ? this.guardarCelula()
          : it.cristal ? this.usarCristalZ()
          : it.booster ? this.usarBooster()
            : it.xis ? this.usarX(it.item)
              : it.bola ? this.tryCatch(it.item) : this.usarCura(it.item));
      }
      return;
    }
    if (m.type === "reviver") {
      const caidos = this.st.party.filter((p) => isFainted(p));
      const n = Math.max(1, caidos.length);
      if (Input.consume("up")) { m.index = (m.index + n - 1) % n; Audio2.blip(); }
      if (Input.consume("down")) { m.index = (m.index + 1) % n; Audio2.blip(); }
      if (Input.consume("b")) { this.menu = m.volta || { type: "bag", index: 0 }; Audio2.cancel(); }
      if (Input.consume("a") && caidos[m.index]) { Audio2.select(); this.run(this.usarCura(m.item, caidos[m.index])); }
      return;
    }
    if (m.type === "pokeblocos") {
      const cores = this.coresDePokebloco();
      const n = cores.length;
      if (!n) { this.menu = { type: "bag", index: 0 }; return; }
      if (Input.consume("up")) { m.index = (m.index + n - 1) % n; Audio2.blip(); }
      if (Input.consume("down")) { m.index = (m.index + 1) % n; Audio2.blip(); }
      if (Input.consume("b")) { this.menu = { type: "bag", index: 0 }; Audio2.cancel(); }
      if (Input.consume("a")) { Audio2.select(); this.run(this.jogarPokebloco(cores[Math.min(m.index, n - 1)][0])); }
      return;
    }
    if (m.type === "party") {
      const n = this.st.party.length;
      if (Input.consume("up")) { m.index = (m.index + n - 1) % n; Audio2.blip(); }
      if (Input.consume("down")) { m.index = (m.index + 1) % n; Audio2.blip(); }
      // (`livre`: a escolha do ALTERNAR — devolve o número, ou -1 se voltou)
      if (Input.consume("b")) { Audio2.cancel(); if (m.livre) return m.livre(-1); this.menu = { type: "main", index: 2 }; }
      if (Input.consume("a")) {
        const target = this.st.party[m.index];
        if (m.index === this.playerIdx || isFainted(target)) { Audio2.cancel(); return; }
        Audio2.select();
        if (m.livre) return m.livre(m.index);
        this.run(this.switchTo(m.index));
      }
    }
  }

  /** O ESTILO ALTERNAR (OPÇÕES → ESTILO DE TROCA, como no FireRed): o
   *  treinador vai mandar o próximo, e você pode trocar antes, sem perder a
   *  vez. No SET o jogo não pergunta. */
  async perguntaTroca(proximo) {
    if (Opcoes.get("estiloTroca") === "set" || !proximo) return;
    // (na EXPLOSIVA e no TEMPO REAL a arena tem o jeito dela: sem pergunta)
    if (this.modoReal || this.modoExplosivo) return;
    if (!this.st.party.some((m, i) => i !== this.playerIdx && !isFainted(m))) return;
    await this.say(`${this.trainer.name} VAI ENVIAR ${proximo.nickname}.`);
    const r = await this.ask(`${this.st.player?.name || "VOCÊ"} QUER TROCAR DE POKÉMON?`, ["SIM", "NÃO"]);
    if (r !== 0) return;
    // a batalha continua OCUPADA (nada anda sozinho: o inimigo ainda está
    // desmaiado ali); só a lista responde — ver o `livre` no `update`
    const idx = await new Promise((res) => { this.menu = { type: "party", index: this.playerIdx, livre: res }; });
    this.menu = null;
    if (idx >= 0) await this.switchTo(idx, false);
  }

  async switchTo(idx, comTurno = true) {
    this.menu = null;
    this.megaArmada = null;      // a pedra reage com quem estava na frente
    await this.say(`VOLTE, ${this.mine.nickname}!`);
    saiuDaLuta(this.mine);       // o PALAFIN que sai volta HERÓI
    this.playerIdx = idx;
    this.pStages = newStages();
    this.disp.p = this.mine.hp;
    this.sp.p = this.newSprite(-90);
    await this.say(`VAI, ${this.mine.nickname}!`);
    await this.entrou("p");
    if (!comTurno) return;              // (a troca do ALTERNAR não dá a vez pro inimigo)
    const fMove = chooseAiMove(this.foe, this.mine, this.fStages, this.pStages, this.clima?.tipo);
    if (fMove) await this.useMove("f", fMove);
    await this.checkFaints();
  }

  // ---------------------------------------------------------- render
  render(ctx) {
    if (this.noMapa) return void this.dlg.render(ctx);    // o mapa aparece por baixo
    if (this.modoReal && this.arena) return this.renderReal(ctx);
    if (this.modoExplosivo && this.explosiva) return this.renderExplosiva(ctx);
    const sx = this.shake > 0 ? Math.round(Math.sin(this.t * 90) * 3 * (this.shake / 0.25)) : 0;
    ctx.save();
    ctx.translate(sx, 0);

    // cenario
    const g = ctx.createLinearGradient(0, 0, 0, 110);
    g.addColorStop(0, this.isGlitch ? "#2a1040" : "#9fd8f0");
    g.addColorStop(1, this.isGlitch ? "#120820" : "#dff0f8");
    ctx.fillStyle = g;
    ctx.fillRect(-8, 0, W + 16, 110);
    // O CLIMA por cima do céu: a chuva risca a tela, o sol amarela ela
    if (this.clima?.tipo === "chuva") {
      ctx.fillStyle = "rgba(40,60,110,0.28)";
      ctx.fillRect(-8, 0, W + 16, 110);
      ctx.strokeStyle = "rgba(200,225,255,0.55)";
      ctx.lineWidth = 1;
      const t = this.t * 160;
      for (let i = 0; i < 26; i++) {
        const x = ((i * 37 + t * 0.6) % (W + 40)) - 20, y = ((i * 53 + t) % 130) - 20;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 3, y + 9); ctx.stroke();
      }
    } else if (this.clima?.tipo === "sol") {
      ctx.fillStyle = "rgba(255,210,80,0.22)";
      ctx.fillRect(-8, 0, W + 16, 110);
    }
    // O TEMPORAL: céu fechado, chuva grossa e inclinada, e relâmpago de vez em quando
    if (this.temporalAtivo()) {
      ctx.fillStyle = "rgba(20,24,48,0.5)";
      ctx.fillRect(-8, 0, W + 16, 110);
      ctx.strokeStyle = "rgba(190,210,255,0.7)";
      ctx.lineWidth = 1;
      const t = this.t * 260;
      for (let i = 0; i < 48; i++) {
        const x = ((i * 29 + t * 0.9) % (W + 60)) - 30, y = ((i * 47 + t) % 140) - 20;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 6, y + 14); ctx.stroke();
      }
      if (Math.sin(this.t * 1.7) > 0.985 || Math.sin(this.t * 2.9 + 1) > 0.993) {
        ctx.fillStyle = "rgba(230,235,255,0.55)";
        ctx.fillRect(-8, 0, W + 16, 110);
      }
    }
    if (isoLigado()) {
      // NO ISOMÉTRICO: piso de losangos e plataformas em bloco (src/core/isometrico.js)
      chaoDeBatalhaIso(ctx, W, 52, 110, this.isGlitch ? ["#1d0e30", "#26123d"] : ["#b9e2a0", "#a8d68c"]);
      const cor = this.isGlitch ? "#3a1d5c" : "#8fd06a";
      plataformaIso(ctx, 178, 64, 46, cor);
      plataformaIso(ctx, 48, 104, 56, cor, 8);
    } else {
      ctx.fillStyle = this.isGlitch ? "#3a1d5c" : "#8fd06a";
      ctx.beginPath(); ctx.ellipse(178, 66, 46, 12, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(48, 106, 54, 14, 0, 0, Math.PI * 2); ctx.fill();
    }

    // sprites em 64x64 (tamanho nativo dos de batalha do FireRed), com animação
    const bob = Math.sin(this.t * 2) * 1.5;
    // A escala cresce a partir dos PÉS e do centro: o bicho incha no lugar em
    // vez de escorregar pro canto de cima, que é o que dá se a gente só mudar a
    // largura e a altura do drawImage.
    // `nativo`: o quadro ANIMADO do Black/White (Assets.monAnim) vem no tamanho
    // dele, não no 64x64 — fica de pé no mesmo chão, centrado no mesmo lugar.
    const drawMon = (img, x, y, sp, dir, nativo = false) => {
      if (sp.blink > 0 && Math.floor(sp.blink * 22) % 2 === 0) return;
      const l = sp.lunge > 0 ? Math.sin((0.3 - sp.lunge) / 0.3 * Math.PI) * 12 * dir : 0;
      const e = sp.escala ?? 1;
      // os animados enormes (o CARDUME, o PYROAR) encolhem pra caber em 80: maior
      // que isso cobre a caixa do outro lado
      const cabe = nativo ? Math.min(1, 80 / Math.max(img.width, img.height)) : 1;
      // `largura`: o selvagem que comeu pokébloco pesado fica mais largo
      const w = Math.round((nativo ? img.width : 64) * e * cabe * (sp.largura ?? 1)), h = Math.round((nativo ? img.height : 64) * e * cabe);
      ctx.globalAlpha = sp.alpha;
      const dx = Math.round(x + sp.dx + l + 32 - w / 2), dy = Math.round(y + sp.dy + 64 - h);
      if (sp.desmaio) { this.drawDesmaio(ctx, img, dx, dy, w, h, sp.desmaio); ctx.globalAlpha = 1; return { img, dx, dy, w, h }; }
      // no ISOMÉTRICO o Pokémon é a plaquinha grossa em pé, como os do mapa
      if (isoLigado()) emPeIso(ctx, img, dx, dy, w, h);
      else ctx.drawImage(img, dx, dy, w, h);
      ctx.globalAlpha = 1;
      return { img, dx, dy, w, h };
    };
    const tart = this.showTrainer ? trainerArt(this.trainer?.sprite) : null;
    if (tart) {
      ctx.drawImage(tart, Math.round(146 + this.tOut * 110), Math.round(4 + bob), 64, 64);
    } else if (!this.showTrainer && (!isFainted(this.foe) || this.disp.f > 0 || this.sp.f.alpha > 0)) {
      const fimg = Assets.mon(this.foe.species, this.foe.seed);
      if (this.totem && this.foe.species === "diglett") this.drawDiglettBombado(ctx, fimg, bob);
      else {
        // a aura roxa da MEGA DESCONTROLADA, pulsando atrás dela
        if (this.descontrolada && !this.sp.f.faint) {
          const a = 0.35 + 0.25 * Math.sin(this.t * 9);
          const g = ctx.createRadialGradient(178, 40, 6, 178, 40, 52);
          g.addColorStop(0, `rgba(200,70,255,${a})`);
          g.addColorStop(1, "rgba(200,70,255,0)");
          ctx.fillStyle = g;
          ctx.fillRect(122, -12, 112, 104);
        }
        if (this.foe.dynamax && !this.sp.f.faint) this.auraDynamax(ctx, 178, 44, 58, !!this.foe.gmaxDe);
        // animado, ele já se mexe sozinho: o sobe-e-desce é só de quem é parado
        const fa = !this.foe.transformado && Assets.monAnim(this.foe, false, this.t * 1000 + 500);
        const fbase = this.foe.transformado ? Assets.caraDeDitto(Assets.comCor(fimg, this.foe), this.foe.species) : Assets.comCor(fimg, this.foe);
        const onde = drawMon(fa || fbase, 146,
                4 + (fa ? 0 : bob) + (this.raid ? RAID.desce : 0), this.sp.f, -1, !!fa);
        this.rastroDosOlhos(ctx, onde);
      }
    }
    if (this.ballAnim) this.drawBall(ctx);
    if (this.sp.p.alpha > 0) {
      // a AURA DO VÍNCULO: na cor de quem joga, pulsando atrás dele (e
      // crescendo na hora em que ele vira)
      const naForma = DB.SPECIES[this.mine.species]?.vinculo;
      if ((naForma || this.auraVinculo > 0) && !this.sp.p.faint) {
        const [r, g, b] = corDoVinculo(this.st);
        const a = Math.min(1, 0.7 + 0.2 * Math.sin(this.t * 7) + (this.auraVinculo || 0) * 0.3);
        const raio = 44 + 4 * Math.sin(this.t * 7) + (this.auraVinculo || 0) * 30;
        const gr = ctx.createRadialGradient(46, 80, 4, 46, 80, raio);
        gr.addColorStop(0, `rgba(255,255,255,${a})`);
        gr.addColorStop(0.35, `rgba(${r},${g},${b},${a})`);
        gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = gr;
        ctx.fillRect(46 - raio, 80 - raio, raio * 2, raio * 2);
        // o anel que pulsa pra fora, como uma onda
        const fase = (this.t * 0.9) % 1;
        ctx.strokeStyle = `rgba(${r},${g},${b},${(1 - fase) * 0.9})`;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(46, 104, 20 + fase * 30, 6 + fase * 8, 0, 0, Math.PI * 2); ctx.stroke();
      }
      if (this.mine.dynamax && !this.sp.p.faint) this.auraDynamax(ctx, 46, 82, 58, !!this.mine.gmaxDe);
      // o SEU DITTO transformado vira DE FRENTE pra você: dá pra ver a carinha de DITTO
      const dittoMeu = !!this.mine.transformado;
      // a sua FUSÃO também fica DE FRENTE pra você (pedido do CAIO): a montagem
      // pela cara só existe de frente, e é de frente que dá pra ver quem está junto
      const fusaoMinha = !!DB.SPECIES[this.mine.species]?.fusao;
      const deFrente = dittoMeu || fusaoMinha;
      const pimg = deFrente ? Assets.mon(this.mine.species, this.mine.seed) : Assets.monBack(this.mine.species, this.mine.seed);
      const pa = !deFrente && Assets.monAnim(this.mine, true, this.t * 1000);
      const pbase = dittoMeu ? Assets.caraDeDitto(Assets.comCor(pimg, this.mine), this.mine.species)
        : fusaoMinha ? Assets.comCor(pimg, this.mine) : Assets.comCor(pimg, this.mine, true);
      drawMon(pa || pbase, 14, 46 - (pa ? 0 : bob), this.sp.p, 1, !!pa);
    }

    if (this.fx.length) this.drawFx(ctx);
    if (this.animDesenho) this.drawAnimDesenhada(ctx);
    // o ETERNAMAX chegando: a tela escurece em vermelho, pulsando, com o brilho em volta dele
    if (this.eternamax) {
      const e = this.eternamax, a = Math.min(0.55, (e.t += 1 / 60) * 0.5);
      ctx.fillStyle = `rgba(60,0,24,${a})`;
      ctx.fillRect(-8, 0, W + 16, 112);
      const [cx, cy] = e.who === "p" ? [46, 80] : [178, 36];
      const r = 30 + 10 * Math.sin(this.t * 9) + e.t * 20;
      const g = ctx.createRadialGradient(cx, cy, 2, cx, cy, r);
      g.addColorStop(0, "rgba(255,80,120,0.9)"); g.addColorStop(0.5, "rgba(200,20,70,0.5)"); g.addColorStop(1, "rgba(120,0,40,0)");
      ctx.fillStyle = g; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    }

    // a batalha acontece no mesmo mundo lá fora: se está de noite no mapa, está
    // de noite aqui. A fenda não entra — lá o céu já é outro.
    if (!this.isGlitch && temCeu(DB.MAPS?.[this.st.player?.map])) {
      const noturno = veu();
      if (noturno.alpha > 0) fade(ctx, noturno.alpha, noturno.cor);
    }

    // caixas de status (a do inimigo só depois que ele solta o Pokémon)
    if (!this.showTrainer) this.statusBox(ctx, 6, 6, this.foe, this.disp.f, false);
    if (this.raid) this.drawEscudo(ctx);
    this.statusBox(ctx, 122, 68, this.mine, this.disp.p, true);

    ctx.restore();

    if (this.habPops?.length) this.drawHabPops(ctx);
    if (this.zMonst) this.desenharMonstelium(ctx);

    if (!this.dlg.active && !this.dlg.choice) {
      if (this.menu) this.drawMenu(ctx);
      else panel(ctx, 2, 110, 236, 48); // caixa de texto vazia (nunca deixa buraco preto)
    }
    this.dlg.render(ctx);
    if (this.flash > 0) fade(ctx, this.flash, "#ffffff");
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }

  /** Desenha os efeitos das cutscenes. Um lugar só, seis formas: assim uma cena
   *  nova são dez linhas em src/systems/cutscenes.js, e nunca um render novo.
   *  Nada de antialias — em 240x160 borda borrada vira sujeira. */
  /** a arena do TEMPO REAL (src/systems/batalhareal.js), com a fala e o fade de sempre por cima */
  renderExplosiva(ctx) {
    ctx.save();
    if (this.shake > 0) ctx.translate(Math.round((Math.random() - 0.5) * 5), Math.round((Math.random() - 0.5) * 5));
    desenharExplosiva(this, ctx);
    ctx.restore();
    this.dlg.render(ctx);
    if (this.flash > 0) fade(ctx, this.flash, "#ffffff");
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }

  renderReal(ctx) {
    ctx.save();
    if (this.shake > 0) ctx.translate(Math.round((Math.random() - 0.5) * 4), Math.round((Math.random() - 0.5) * 4));
    desenharReal(this, ctx);
    ctx.restore();
    this.dlg.render(ctx);
    if (this.flash > 0) fade(ctx, this.flash, "#ffffff");
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }

  /** toca os quadros desenhados. Feitos com o SEU Pokémon atacando; quando é o
   *  inimigo, a tela gira meia volta em volta do meio entre os dois (o seu lugar
   *  vira o dele e o dele vira o seu). */
  async tocarAnimDesenhada(ad, who, alvo, vel = 1) {
    try {
      for (let i = 0; i < ad.quadros.length; i++) {
        const q = ad.quadros[i];
        this.animDesenho = { img: ad.img, i, gira: who !== "p" };
        if (q.treme) this.shake = Math.max(this.shake || 0, q.dura / 1000);
        if (q.clarao) this.flash = Math.max(this.flash || 0, 0.6);
        if (q.pisca) this.sp[alvo].blink = Math.max(this.sp[alvo].blink, q.dura / 1000);
        this.sp[who].alpha = q.esconde ? 0 : 1;
        await this.wait(q.dura / 1000 / vel);
      }
    } finally {
      this.animDesenho = null;
    }
  }

  drawAnimDesenhada(ctx) {
    const a = this.animDesenho;
    if (!a) return;
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    if (a.gira) { ctx.translate(224, 114); ctx.rotate(Math.PI); }
    ctx.drawImage(a.img, a.i * 240, 0, 240, 160, 0, 0, 240, 160);
    ctx.restore();
  }

  drawFx(ctx) {
    for (const e of this.fx) {
      ctx.globalAlpha = e.fade ? Math.max(0, 1 - e.t / e.vida) : 1;
      ctx.fillStyle = ctx.strokeStyle = e.cor || "#ffffff";
      const x = Math.round(e.x), y = Math.round(e.y);
      if (e.forma === "bola") {
        ctx.beginPath();
        ctx.arc(x, y, Math.max(1, e.r), 0, Math.PI * 2);
        ctx.fill();
      } else if (e.forma === "anel") {
        ctx.lineWidth = e.h || 2;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(1, e.r), 0, Math.PI * 2);
        ctx.stroke();
      } else if (e.forma === "quadro") {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(e.ang || 0);
        ctx.fillRect(-e.w / 2, -e.h / 2, e.w, e.h);
        ctx.restore();
      } else if (e.forma === "risco") {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(e.ang || 0);
        ctx.fillRect(0, -(e.h || 2) / 2, e.w, e.h || 2);
        ctx.restore();
      } else if (e.forma === "raio") {
        // zigue-zague: o mesmo caminho toda vez que este efeito é desenhado,
        // porque o desvio sai da posição, não de um sorteio novo por quadro
        ctx.lineWidth = e.h || 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        const passos = 6;
        for (let i = 1; i <= passos; i++) {
          const k = i / passos;
          const lado = i === passos ? 0 : (i % 2 ? 5 : -5);
          ctx.lineTo(Math.round(x + (e.x2 - x) * k + lado), Math.round(y + (e.y2 - y) * k));
        }
        ctx.stroke();
      } else if (e.forma === "barra") {
        ctx.fillRect(x, y, e.w, e.h);
      } else if (e.forma === "bit") {
        // o 0 ou o 1 que vaza do MISSINGNO.
        drawText(ctx, e.txt, x - 3, y - 4, e.cor || "#59d99b");
      } else if (e.forma === "estrela") {
        // a estrelinha de 4 pontas do shiny: cresce e some piscando
        const s = Math.round((e.r || 3) * Math.sin(Math.min(1, e.t / e.vida) * Math.PI));
        if (s > 0) {
          ctx.fillRect(x - s, y, s * 2 + 1, 1);
          ctx.fillRect(x, y - s, 1, s * 2 + 1);
          if (s > 1) { ctx.fillRect(x - 1, y - 1, 3, 3); }
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
    ctx.globalAlpha = 1;
    ctx.lineWidth = 1;
  }

  /** A CASCA da GLITCH RAID, logo abaixo da barra dele. Enquanto ela tem
   *  pedaço, o dano não chega no bicho — e a barra some quando ela cai, pra não
   *  sobrar um zero na tela dizendo nada. */
  drawEscudo(ctx) {
    this.drawEstrelas(ctx);
    if (this.raid.escudo <= 0) return;
    const larg = 100, x = 6, y = 30;
    ctx.fillStyle = "#1a1030";
    ctx.fillRect(x, y, larg, 5);
    // na ULTRA RAID é a barreira de ultra energia, amarela
    const cor = this.raid.ultra ? "#f8c830" : "#b455ff";
    ctx.fillStyle = cor;
    ctx.fillRect(x, y, Math.max(1, Math.round(larg * this.raid.escudo / this.raid.escudoMax)), 5);
    drawText(ctx, this.raid.ultra ? "BARREIRA" : "CASCA", x + larg + 4, y - 2, cor);
  }

  /** AS ESTRELAS da raid, embaixo da caixa dele: uma a cada 10 níveis. A
   *  fonte não tem estrela, então ela é desenhada pixel por pixel. */
  drawEstrelas(ctx) {
    const ESTRELA = ["..#..", "..#..", "#####", ".###.", ".#.#."];
    const n = this.raid.estrelas || 1;
    for (let i = 0; i < n; i++) {
      const x0 = 8 + i * 7, y0 = 38;
      ctx.fillStyle = "#3a2a10";               // contorno escuro, pra ler em qualquer fundo
      for (let yy = 0; yy < 5; yy++) for (let xx = 0; xx < 5; xx++) {
        if (ESTRELA[yy][xx] === "#") ctx.fillRect(x0 + xx - 1, y0 + yy - 1, 3, 3);
      }
      ctx.fillStyle = "#ffd84a";
      for (let yy = 0; yy < 5; yy++) for (let xx = 0; xx < 5; xx++) {
        if (ESTRELA[yy][xx] === "#") ctx.fillRect(x0 + xx, y0 + yy, 1, 1);
      }
    }
  }

  statusBox(ctx, x, y, mon, disp, showHp) {
    const marca = mon.luminoso ? "☼" : mon.shiny ? "*" : "";
    // NOME COMPRIDO (COELHATRASADO, BRIGADEIRINHO...): em vez de cortar em 10
    // letras, a caixa cresce o que precisar (até 6 letras a mais). A do
    // adversário (em cima, à esquerda) cresce pra direita; a sua (embaixo, à
    // direita) cresce pra esquerda, pra não sair da tela.
    const nome = marca + mon.nickname.slice(0, 16);
    const extra = Math.min(6, Math.max(0, [...nome].length - 10)) * 6;
    const w = (showHp ? 112 : 100) + extra;
    const h = showHp ? 40 : 30;
    if (x > 100) x -= extra;
    panel(ctx, x, y, w, h);
    drawText(ctx, nome, x + 6, y + 5,
      mon.luminoso ? "#fff3b0" : mon.shiny ? "#d8a828" : mon.corrupt ? PAL.glitch : PAL.ink);
    // o "M" é da MEGA; as formas de batalha (CARDUME, HERÓI) usam o mesmo
    // caminho e não são MEGA
    if (mon.megaDe && !DB.SPECIES[mon.species]?.formaDe) drawText(ctx, "M", x + w - 34, y + 5, PAL.glitch);
    else if (mon.alfa) drawText(ctx, "A", x + w - 34, y + 5, "#e0242a");
    drawText(ctx, `N${mon.level}`, x + w - 24, y + 5, PAL.ink);
    drawText(ctx, "HP", x + 6, y + 16, PAL.ink2);
    const pct = Math.max(0, disp) / mon.maxHp;
    bar(ctx, x + 22, y + 18, w - 34, 4, pct, hpColor(pct));
    if (showHp) {
      drawText(ctx, `${Math.ceil(Math.max(0, disp))}/${mon.maxHp}`, x + w - 52, y + 26, PAL.ink);
      const need = xpForLevel(mon.level + 1) - xpForLevel(mon.level);
      const have = mon.xp - xpForLevel(mon.level);
      bar(ctx, x + 6, y + h - 6, w - 12, 2, Math.max(0, Math.min(1, have / need)), "#4aa3e0");
    }
    if (mon.status) {
      drawText(ctx, mon.status.slice(0, 3), x + 6, y + 25, "#e0524a");
    }
  }

  /** o Pokémon desmaiando (ver `desmaia`): de costas no chão e encolhendo */
  drawDesmaio(ctx, img, dx, dy, w, h, d) {
    // o ponto em que ele gira: os pés, no meio
    const px = dx + w / 2, py = dy + h;
    let ang = Math.PI / 2, k = 1, verm = 0;
    if (d.fase === "grito") ang = 0;
    else if (d.fase === "cai") {
      const p = Math.min(1, d.t / DESMAIO.cai);
      ang = p * p * (Math.PI / 2);                        // acelera, como quem tomba
      // bateu no chão: um quiquinho de volta
      const depois = d.t - DESMAIO.cai;
      if (depois > 0 && depois < 0.2) ang -= Math.sin((depois / 0.2) * Math.PI) * 0.14;
    } else {
      const p = Math.min(1, d.t / DESMAIO.volta);
      k = Math.max(0, 1 - p * p);
      verm = Math.min(1, p * 3);
    }
    // deitado, ele fica em cima do chão (e não metade enterrado)
    const cx = px, cy = py - (Math.min(w, h) / 2) * Math.sin(ang) * 0.8;
    if (k > 0) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ang * d.dir);
      ctx.translate(0, -h / 2);                           // encolhe pro meio dele
      ctx.scale(k, k);
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
      if (verm > 0) { ctx.globalAlpha *= verm * 0.85; ctx.drawImage(this.vermelho(img), -w / 2, -h / 2, w, h); }
      ctx.restore();
    }
    // O RAIO VERMELHO, do treinador até o Pokémon (o meio dele, deitado)
    if (d.fase === "volta" && d.raio && d.t < DESMAIO.volta) {
      const meioX = cx + d.dir * (h / 2), meioY = cy;
      const de = d.who === "p" ? { x: -10, y: 150 } : { x: 250, y: 6 };
      const pisca = 0.75 + 0.25 * Math.sin(this.t * 60);
      ctx.save();
      ctx.globalAlpha = pisca;
      ctx.strokeStyle = "#e8202c"; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(de.x, de.y); ctx.lineTo(meioX, meioY); ctx.stroke();
      ctx.strokeStyle = "#ffb0a8"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(de.x, de.y); ctx.lineTo(meioX, meioY); ctx.stroke();
      ctx.fillStyle = "#ff5a50";
      ctx.beginPath(); ctx.arc(meioX, meioY, 3 + 2 * pisca, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  }

  /** a mesma imagem toda VERMELHA (o raio puxando ele pra bola), guardada */
  vermelho(img) {
    const cache = (this._vermelho ||= new WeakMap());
    let cv = cache.get(img);
    if (cv) return cv;
    cv = document.createElement("canvas");
    cv.width = img.width; cv.height = img.height;
    const g = cv.getContext("2d");
    g.drawImage(img, 0, 0);
    g.globalCompositeOperation = "source-atop";
    g.fillStyle = "#ff3a30";
    g.fillRect(0, 0, cv.width, cv.height);
    cache.set(img, cv);
    return cv;
  }

  drawBall(ctx) {
    const a = this.ballAnim;
    const t = Math.min(1, a.t / 0.7);
    const x = 40 + (170 - 40) * t;
    const y = 90 - Math.sin(t * Math.PI) * 60 + (a.t > 0.7 ? 0 : 0);
    const wob = a.shakes ? Math.sin(a.t * 22) * 3 : 0;
    ctx.save();
    ctx.translate(x + wob, Math.min(y, 52));
    if (a.mao) this.drawMao(ctx, a.mao);
    else ctx.drawImage(Assets.ball, -4, -4, 12, 12);
    ctx.restore();
  }

  /** A bola fechada com a sua mão em cima. Segurando, a mão fica na parte de
   *  cima; no APERTÃO a bola amassa e solta estrelinha. Nenhum aviso: é
   *  segredo, quem descobre vê a mão aparecer. */
  drawMao(ctx, m) {
    const amassa = m.jeito === "apertao" && m.efeito > 0 ? m.efeito / 0.35 : 0;
    const sobe = Math.round(amassa * 4);
    ctx.drawImage(Assets.ball, -4 - sobe / 2, -4 + sobe, 12 + sobe, 12 - sobe);
    if (m.segura || m.efeito > 0) {
      const my = -9 + sobe;
      ctx.fillStyle = "#1c2030"; ctx.fillRect(-3, my - 1, 10, 7);
      ctx.fillStyle = "#f2c29a"; ctx.fillRect(-2, my, 8, 5);
      ctx.fillStyle = "#c98c66";
      for (let d = 0; d < 4; d++) ctx.fillRect(-1 + d * 2, my + 4, 1, 1);
    }
    if (amassa > 0) {
      ctx.fillStyle = Math.floor(this.t * 20) % 2 ? "#fff4a0" : "#f8c830";
      const r = 9 + (1 - amassa) * 6;
      for (let k = 0; k < 6; k++) {
        const ang = k * Math.PI / 3 + this.t * 3;
        ctx.fillRect(Math.round(2 + Math.cos(ang) * r), Math.round(2 + Math.sin(ang) * r * 0.7), 2, 2);
      }
    }
  }

  /** "MEGA" + a tecla (ou a forma escolhida) — só quando dá pra usar */
  marcaMega(ctx, x, y, compacto = false) {
    const megas = this.megasDisponiveis();
    if (!megas.length) return;
    const armada = this.megaArmada;
    // CHARIZARD e MEWTWO têm duas formas: o X/Y do fim do nome vira a marca
    // a MEGA EMPRESTADA mostra o começo da pedra (BLA = blastoisita)
    const marca = armada ? (armada.emprestada ? armada.pedra.slice(0, 3).toUpperCase()
      : / [XY]$/.test(armada.nome) ? armada.nome.slice(-1) : "ON") : "C";
    if (compacto) {                       // uma linha só (cabe no menu principal)
      const txt = `MEGA ${marca}`;
      if (armada) { ctx.fillStyle = PAL.glitch; ctx.fillRect(x - 2, y - 2, txt.length * 6 + 3, 12); }
      drawText(ctx, txt, x, y, armada ? "#ffffff" : PAL.glitch);
      return;
    }
    if (armada) { ctx.fillStyle = PAL.glitch; ctx.fillRect(x - 1, y - 2, 28, 22); }
    drawText(ctx, "MEGA", x, y, armada ? "#ffffff" : PAL.glitch);
    drawText(ctx, marca, x + (marca.length === 1 ? 9 : 6), y + 11, armada ? "#ffffff" : PAL.ink2);
  }

  drawMenu(ctx) {
    const m = this.menu;
    if (m.type === "ordem") {
      const golpe = DB.MOVES[this.mine.moves[m.slot]?.id]?.name || "?";
      panel(ctx, 2, 110, 236, 48);
      drawText(ctx, `${this.st.capturado.nome.slice(0, 14)}:`, 10, 116, "#e0242a");
      drawText(ctx, `"${this.mine.nickname}, ${golpe}!"`, 10, 128, PAL.ink, { maxChars: 20 });
      const ops = m.forcada ? ["OBEDECER"] : ["OBEDECER", "DESOBEDECER"];
      ops.forEach((it, i) => {
        const y = 116 + i * LINE_H;
        drawText(ctx, it, 152, y, PAL.ink);
        if (i === m.index) cursor(ctx, 144, y);
      });
      if (m.forcada) drawText(ctx, "A BOLA APERTA", 152, 116 + LINE_H, "#e0242a");
      // a raiva dele, em barrinhas: quanto mais, mais ele força
      const raiva = this.st.capturado.raiva || 0;
      drawText(ctx, `X${this.st.capturado.desobedeceu || 0}`, 10, 146, PAL.ink2);
      for (let i = 0; i < RAIVA.max; i++) {
        ctx.fillStyle = i < nivelDeRaiva(raiva) ? "#e0242a" : "#c8c8d0";
        ctx.fillRect(40 + i * 7, 148, 5, 5);
      }
      if (raiva >= 1000) drawText(ctx, `RAIVA ${raiva}`, 80, 146, "#e0242a");
      return;
    }
    if (m.type === "desobedecer") {
      panel(ctx, 2, 110, 236, 48);
      const pct = Math.round(chanceDeEscapar(this.st.capturado.desobedeceu || 0) * 100);
      DESOBEDIENCIA.forEach((d, i) => {
        const x = 8 + (i % 2) * 118, y = 114 + Math.floor(i / 2) * 11;
        const rot = d.id === "escapa" ? `${d.rotulo} ${pct}%` : d.rotulo;
        drawText(ctx, rot, x + 8, y, d.id === "escapa" ? "#e0242a" : PAL.ink);
        if (i === m.index) cursor(ctx, x, y);
      });
      return;
    }
    if (m.type === "main") {
      const items = ["LUTAR", "MOCHILA", "POKÉMON", "FUGIR"];
      panel(ctx, 2, 110, 236, 48);
      drawText(ctx, "O QUE", 10, 122, PAL.ink);
      drawText(ctx, `${this.mine.nickname} FARÁ?`, 10, 134, PAL.ink);
      const bx = 128, by = 116;
      items.forEach((it, i) => {
        const x = bx + (i % 2) * 56, y = by + Math.floor(i / 2) * LINE_H;
        drawText(ctx, it, x + 8, y, PAL.ink);
        if (i === m.index) cursor(ctx, x, y);
      });
      this.marcaMega(ctx, 10, 146, true);
      if (this.zArmado) drawText(ctx, "Z!", 92, 146, "#ffd166", { shadow: "#7a4a10" });
      if (this.dyArmado) drawText(ctx, "MAX!", 60, 146, "#ff4060", { shadow: "#5a0010" });
      return;
    }
    if (m.type === "moves") {
      panel(ctx, 2, 110, 236, 48);
      this.mine.moves.forEach((mv, i) => {
        const d = DB.MOVES[mv.id];
        const x = 8 + (i % 2) * 108, y = 116 + Math.floor(i / 2) * LINE_H;
        drawText(ctx, d.name.slice(0, 14), x + 8, y, mv.pp > 0 ? PAL.ink : "#b04040");
        if (i === m.index) cursor(ctx, x, y);
      });
      this.marcaMega(ctx, 203, 116);
      const sel = this.mine.moves[m.index];
      const d = DB.MOVES[sel.id];
      drawText(ctx, `PP ${sel.pp}/${sel.ppMax}`, 10, 140, PAL.ink2);
      drawText(ctx, d.type, 80, 140, DB.TYPE_COLOR[d.type] || PAL.ink2);
      drawText(ctx, d.power ? `PWR ${d.power}` : "STATUS", 170, 140, PAL.ink2);
      return;
    }
    if (m.type === "bag") {
      panel(ctx, 2, 110, 236, 48);
      // A CAIXA SÓ TEM TRÊS LINHAS. Com as duas bolas novas, o CRISTAL Z e o
      // GLITCHBOOSTER a lista chega a sete itens, e o que passava da terceira
      // linha era desenhado POR CIMA da borda e do "X VOLTA" — item que existe,
      // dá pra escolher com a seta e não aparece. Agora a lista anda: a janela
      // segue o cursor e as setinhas da direita dizem que tem mais.
      const itens = this.itensDoBolso(m);
      // o BOLSO da vez, em cima da caixa (◀ ▶ troca)
      const bolsos = this.bolsosDaBatalha();
      if (bolsos.length) {
        panel(ctx, 2, 96, 120, 16);
        drawText(ctx, `${bolsos.length > 1 ? "◀ " : ""}${bolsos[m.bolso || 0]}${bolsos.length > 1 ? " ▶" : ""}`, 10, 100, PAL.ink);
      }
      const JANELA = 3;
      const inicio = Math.max(0, Math.min(itens.length - JANELA, m.index - 1));
      itens.slice(inicio, inicio + JANELA).forEach((it, k) => {
        const i = inicio + k, y = 116 + k * LINE_H;
        const q = this.st.items[it.item] || 0;
        drawText(ctx, `${it.label}  x${q}`, 24, y, it.bola && it.glitch ? PAL.glitch : PAL.ink);
        if (i === m.index) cursor(ctx, 12, y);
      });
      if (inicio > 0) drawText(ctx, "▲", 224, 116, PAL.ink2);
      if (inicio + JANELA < itens.length) drawText(ctx, "▼", 224, 140, PAL.ink2);
      const sel = itens[Math.min(m.index, itens.length - 1)];
      if (sel) desenharItem(ctx, sel.item, 186, 114, 2);   // o desenho do item da vez
      drawText(ctx, "B VOLTA", 168, 148, PAL.ink2);
      return;
    }
    if (m.type === "reviver") {
      panel(ctx, 2, 110, 236, 48);
      const caidos = this.st.party.filter((p) => isFainted(p));
      drawText(ctx, "QUEM VAI LEVANTAR?", 12, 104 - 10, PAL.ink);
      caidos.slice(0, 3).forEach((p, k) => {
        drawText(ctx, p.nickname, 24, 116 + k * LINE_H, PAL.ink);
        if (k === m.index) cursor(ctx, 12, 116 + k * LINE_H);
      });
      drawText(ctx, "B VOLTA", 168, 148, PAL.ink2);
      return;
    }
    if (m.type === "pokeblocos") {
      panel(ctx, 2, 110, 236, 48);
      const PB = DB.POKEBLOCOS;
      const cores = this.coresDePokebloco();
      const JANELA = 3;
      const inicio = Math.max(0, Math.min(cores.length - JANELA, m.index - 1));
      cores.slice(inicio, inicio + JANELA).forEach(([cor, q], k) => {
        const i = inicio + k, y = 116 + k * LINE_H;
        drawText(ctx, `${PB.CORES[cor].nome}  x${q}`, 24, y, PAL.ink);
        if (i === m.index) cursor(ctx, 12, y);
      });
      if (inicio > 0) drawText(ctx, "▲", 224, 116, PAL.ink2);
      if (inicio + JANELA < cores.length) drawText(ctx, "▼", 224, 140, PAL.ink2);
      const sel = cores[Math.min(m.index, cores.length - 1)];
      if (sel) desenharPokebloco(ctx, PB.CORES[sel[0]].cor, 190, 116, 2);
      drawText(ctx, "B VOLTA", 168, 148, PAL.ink2);
      return;
    }
    if (m.type === "party") {
      panel(ctx, 2, 110, 236, 48);
      this.st.party.forEach((mon, i) => {
        const y = 114 + i * LINE_H;
        if (y > 146) return;
        drawText(ctx, `${mon.nickname}  N${mon.level}  ${mon.hp}/${mon.maxHp}`, 16, y,
          isFainted(mon) ? "#b04040" : PAL.ink);
        if (i === m.index) cursor(ctx, 6, y);
      });
      return;
    }
  }
}
