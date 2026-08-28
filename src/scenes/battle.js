// Cena de batalha por turnos. O fluxo usa async/await: cada `await this.say()`
// espera o jogador apertar Z, o que deixa a logica linear e facil de estender.
import { DB } from "../data/index.js";
import { Assets } from "../core/assets.js";
import { trainerArt, adiantarMons } from "../core/sprites.js";
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { panel, drawText, cursor, bar, hpColor, fade, PAL, LINE_H } from "../core/gfx.js";
import { Dialogue } from "../systems/dialogue.js";
import { Glitch } from "../systems/glitchfx.js";
import { cenaDoGolpe } from "../systems/cutscenes.js";
import { veu, temCeu } from "../systems/ciclo.js";
import { fator } from "../systems/acampamento.js";
import { partes } from "../systems/fusao.js";
import { podeUsarBooster, ligar, acumular, bugado, bonusDe, limpar, limparTudo } from "../systems/glitchboost.js";
import { bater, podeCapturar, premio as premioRaid, RAID } from "../systems/raid.js";
import { GLITCHBOOSTER } from "../data/glitch.js";
import { hpPct, isFainted, gainXp, xpYieldFor, xpForLevel, heal, createMon } from "../systems/mon.js";
import {
  calcDamage, accuracyCheck, applyMoveEffects, statusTickDamage, effText,
  chooseAiMove, catchAttempt, catchGlitchball, canFlee, newStages, effectiveStat,
} from "../systems/battle-engine.js";
import { opcoesMega, megaEvoluir, reverterMega, reverterTudo } from "../systems/mega.js";

const W = 240, H = 160;

export class BattleScene {
  enter(args = {}) {
    const st = this.game.state;
    this.trainer = args.trainer || null;
    this.npcKey = args.npcKey || null;
    this.isGlitch = !!args.glitch;
    this.boss = !!args.boss;
    this.foeParty = this.trainer
      ? this.trainer.party.map((p) => createMon(p.id, p.lvl, { corrupt: !!p.corrupt }))
      : [args.foe];
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
    this.megaArmada = null;
    this.flash = 0;
    this.fx = [];                 // os efeitos das cutscenes de golpe
    this.raid = args.raid || null;   // GLITCH RAID: a casca do chefe
    this.cristalUsado = false;       // o GOLPE Z é uma vez por batalha
    this.zArmado = false;
    this.disp = { p: this.mine.hp, f: this.foe.hp };
    this.sp = { p: this.newSprite(-90), f: this.newSprite(90) };
    // o chefe entra do tamanho de um filhote; `crescer()` faz o resto
    if (this.raid) this.sp.f.escala = RAID.cresceDe;
    this.crescendo = null;
    st.seen[this.foe.species] = true;

    Audio2.playMusic(this.isGlitch ? "batalhaGlitch" : "batalha",
                     this.isGlitch ? DB.MUSIC?.batalhaGlitch : DB.MUSIC?.batalha);

    this.run(this.intro());
  }

  exit() { Audio2.stopLoop(); }

  /** O chefe de GLITCH RAID nasce com a escala dele: se ele voltar pra tela por
   *  outro caminho (trocar de bicho, reviver), volta grande, e não do tamanho
   *  de um selvagem. */
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
      await cenaDoGolpe(id, mv)(palco);
    } finally {
      // cena que esconde alguém e quebra no meio não pode deixar o bicho sumido
      if (!this.sp[who].faint) this.sp[who].alpha = 1;
    }
  }

  /** golpe: o sprite avança e volta */
  async lunge(who) {
    if (!DB.CONFIG?.battleAnim) return;
    this.sp[who].lunge = 0.3;
    await this.wait(0.16);
  }

  get st() { return this.game.state; }
  get mine() { return this.st.party[this.playerIdx]; }
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
    } else if (this.raid) {
      // a GLITCH RAID nunca tinha se apresentado: `raidApareceu` estava escrito
      // no story.js e não era dito por ninguém
      if (DB.CONFIG?.sustos) { Glitch.hit(3); Audio2.glitch(); }
      else Audio2.tone(147, 0.3, "triangle", 0.5);
      await this.say(DB.STORY.glitch.raidApareceu);
      await this.crescer();
      await this.say(`${this.foe.nickname} ESTÁ NO CAMINHO.`);
      await this.say(DB.STORY.glitch.raidBugado.replace("{NOME}", this.foe.nickname));
    } else if (this.isGlitch) {
      Glitch.hit(2);
      await this.say(`UM ${this.foe.nickname} SELVAGEM APARECEU!`);
      const sp = DB.SPECIES[this.foe.species];
      if (this.foe.shiny) await this.say("A COR DELE ESTÁ ERRADA. OU CERTA DEMAIS. ELE BRILHA.");
      // cada espécie da fenda tem a frase dela (src/data/extra.js -> LORE)
      if (sp?.lore) await this.say(sp.dexText);
      else if (sp?.foreign) await this.say("ESTE POKÉMON NÃO É DE KANTO. NEM DESTE MUNDO.");
      else if (!this.foe.shiny) await this.say("ESTE POKÉMON NÃO CONSTA NA POKÉDEX. NEM NO CARTUCHO.");
    } else {
      await this.say(`UM ${this.foe.nickname} SELVAGEM APARECEU!`);
      if (this.foe.shiny) await this.say("A COR DELE NÃO É A DE SEMPRE. ESSE AÍ É RARO.");
    }
    await this.say(`VAI, ${this.mine.nickname}!`);
    this.menu = { type: "main", index: 0 };
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

  async playerTurn(moveSlot) {
    this.menu = null;
    // a MEGA acontece antes de qualquer golpe do turno — inclusive antes do
    // golpe do inimigo, e é com os stats novos que a ordem é calculada
    if (this.megaArmada) {
      const regra = this.megaArmada;
      this.megaArmada = null;
      await this.fazerMega("p", regra);
    }
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
    }
    const fMoveRef = chooseAiMove(this.foe, this.mine, this.fStages, this.pStages);

    const pSpe = effectiveStat(this.mine, "spe", this.pStages);
    const fSpe = effectiveStat(this.foe, "spe", this.fStages);
    const playerFirst = pSpe === fSpe ? Math.random() < 0.5 : pSpe > fSpe;

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
    if (anel) await this.say(M.reagem.replace("{PEDRA}", regra.pedra.toUpperCase()));
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
    await this.say(M.evoluiu.replace("{MON}", mon.nickname).replace("{FORMA}", r.forma));
  }

  async useMove(who, moveRef) {
    const user = who === "p" ? this.mine : this.foe;
    const target = who === "p" ? this.foe : this.mine;
    const uStages = who === "p" ? this.pStages : this.fStages;
    const tStages = who === "p" ? this.fStages : this.pStages;
    const mv = DB.MOVES[moveRef.id];

    if (user.status === "paralisia" && Math.random() < 0.25) {
      await this.say(`${user.nickname} ESTÁ PARALISADO E NÃO CONSEGUE SE MEXER!`);
      return;
    }
    moveRef.pp = Math.max(0, moveRef.pp - 1);
    await this.say(`${user.nickname} USOU ${mv.name}!`);

    if (!accuracyCheck(moveRef.id, uStages, tStages)) {
      await this.say("MAS ERROU O ALVO!");
      return;
    }

    await this.cutscene(who, moveRef.id, mv);

    if (mv.corrupt && DB.CONFIG?.glitchMode) {
      Glitch.hit(1.2);
      Audio2.glitch();
      this.st.corruption = Math.min(100, this.st.corruption + mv.corrupt * 0.25);
    }

    const res = calcDamage(user, target, moveRef.id, uStages, tStages);
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
      let dano = Math.max(1, Math.round(res.dmg * (who === "p"
        ? fator(this.st, "ataque")
        : fator(this.st, "defesa"))));

      // GLITCH RAID: enquanto a casca está de pé, o golpe bate NELA. É isso que
      // faz do chefe uma luta de duas partes, e não um selvagem com muito HP.
      if (who === "p" && this.raid?.escudo > 0) {
        const r = bater(this.raid, dano);
        dano = r.noBicho;
        this.quebrou = r.quebrou;
      }
      target.hp = Math.max(0, target.hp - dano);
      await this.syncHp();
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
        await this.say(G.escudoQuebrou);
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
      if (res.crit) await this.say("ACERTO CRÍTICO!");
      const et = effText(res.eff);
      if (et) await this.say(et);
      if (mv.recoil) {
        const rec = Math.max(1, Math.floor(dano * mv.recoil));
        user.hp = Math.max(0, user.hp - rec);
        await this.syncHp();
        await this.say(`${user.nickname} SOFREU O RECUO!`);
      }
    } else if (res.eff === 0) {
      await this.say(`NÃO AFETA ${target.nickname}...`);
      return;
    }

    for (const m of applyMoveEffects(mv, user, target, uStages, tStages)) await this.say(m);
  }

  async endOfTurn() {
    for (const mon of [this.mine, this.foe]) {
      const d = statusTickDamage(mon);
      if (d > 0) {
        mon.hp = Math.max(0, mon.hp - d);
        await this.syncHp();
        await this.say(`${mon.nickname} SOFRE COM ${mon.status === "envenenado" ? "O VENENO" : "A QUEIMADURA"}!`);
      }
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

  async onFoeFaint() {
    // A GLITCH RAID NÃO DESMAIA: ELA VIRA BOLA. Derrubar o chefe é a captura —
    // ele desinfla até sumir, a bola cai no lugar onde ele estava, e ele é seu.
    //
    // É a única luta do jogo em que ganhar É pegar, e é de propósito: o chefe
    // tem cinco vidas de HP, uma casca na frente e engorda a cada pancada. Quem
    // chegou ao fim disso já fez por merecer, e mandar essa pessoa jogar bola
    // num bicho que ela acabou de derrubar seria cobrar o preço duas vezes.
    if (this.raid) return this.raidVirouBola();

    Audio2.faint();
    this.sp.f.faint = true;
    await this.wait(0.7);
    await this.say(`${this.trainer ? "O " + this.foe.nickname + " INIMIGO" : this.foe.nickname + " SELVAGEM"} DESMAIOU!`);

    await this.premiarExp();

    if (this.trainer && this.foeIdx < this.foeParty.length - 1) {
      this.foeIdx++;
      this.fStages = newStages();
      this.disp.f = this.foe.hp;
      this.sp.f = this.newSprite(90);
      await this.say(`${this.trainer.name} ENVIOU ${this.foe.nickname}!`);
      this.menu = { type: "main", index: 0 };
      return;
    }
    if (this.trainer) {
      const prize = this.trainer.prize || 100;
      this.st.money += prize;
      if (this.npcKey) (this.st.npcState[this.npcKey] ||= {}).defeated = true;
      await this.say(`VOCÊ DERROTOU ${this.trainer.name}!`);
      await this.say(`VOCÊ GANHOU $${prize}!`);
      if (this.trainer.badge && !this.st.badges.includes(this.trainer.badge)) {
        this.st.badges.push(this.trainer.badge);
        const b = DB.STORY.badges.find((x) => x.id === this.trainer.badge);
        Audio2.heal();
        await this.say(`VOCÊ RECEBEU A ${b ? b.name : "INSÍGNIA"}!`);
        this.st.flags.oakPending = true;
        this.st.flags.escortPending = true;   // o assistente vem te buscar
      }
    }
    if (this.boss && this.npcKey) (this.st.npcState[this.npcKey] ||= {}).defeated = true;
    if (this.isGlitch && !this.boss) {
      this.st.corruption = Math.min(100, this.st.corruption + 8);
      await this.say("O CORPO DELE SE DESFAZ EM PIXELS QUE NÃO SOMEM DA TELA.");
    }
    await this.finish();
  }

  async onPlayerFaint() {
    Audio2.faint();
    this.sp.p.faint = true;
    await this.wait(0.7);
    await this.say(`${this.mine.nickname} DESMAIOU!`);
    const next = this.st.party.findIndex((m) => !isFainted(m));
    if (next >= 0) {
      this.megaArmada = null;
      this.playerIdx = next;
      this.pStages = newStages();
      this.disp.p = this.mine.hp;
      this.sp.p = this.newSprite(-90);
      await this.say(`VAI, ${this.mine.nickname}!`);
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
    const out = [{ item: "poké bola", label: "POKÉ BOLA", bola: true }];
    if (g && (this.st.items[g.item] || 0) > 0) {
      out.push({ item: g.item, label: g.item.toUpperCase(), bola: true, glitch: true });
    }
    out.push({ item: "poção", label: "POÇÃO", bola: false });
    // o GLITCHBOOSTER só aparece na mochila da batalha quando dá pra usar: com
    // o visor no rosto e o professor já tendo explicado o que é isso
    // O CRISTAL Z: só aparece com um PIKACHU DE BONÉ na frente e uma vez por
    // batalha. Aparecer sem poder ser usado seria oferecer o que não existe.
    const C = DB.CRISTAL;
    if (C && (this.st.items?.[C.item] || 0) > 0 && DB.EH_BONE?.has(this.mine.species)
        && !this.cristalUsado) {
      out.push({ item: C.item, label: "PIKASHUNIUM Z", bola: false, cristal: true });
    }
    if (podeUsarBooster(this.st) && !bugado(this.mine)) {
      out.push({ item: GLITCHBOOSTER.item, label: "GLITCHBOOSTER", bola: false, booster: true });
    }
    return out;
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
      const fMove = chooseAiMove(this.foe, this.mine, this.fStages, this.pStages);
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
    const fMove = chooseAiMove(this.foe, this.mine, this.fStages, this.pStages);
    if (fMove) await this.useMove("f", fMove);
    await this.checkFaints();
  }

  async tryCatch(item = "poké bola") {
    this.menu = null;
    // GLITCH RAID: primeiro se quebra a casca, depois se conversa
    if (!podeCapturar(this.raid)) {
      Audio2.cancel();
      return void this.say(DB.STORY.glitch.raidSemBola);
    }
    const g = DB.STORY.glitchball;
    const ehGlitch = !!g && item === g.item;
    if (this.trainer) {
      await this.say("NÃO SE ROUBA O POKÉMON DOS OUTROS!");
      this.menu = { type: "main", index: 0 };
      return;
    }
    if ((this.st.items[item] || 0) <= 0) {
      await this.say(ehGlitch ? "VOCÊ NÃO TEM NENHUMA GLITCHBALL!" : "VOCÊ NÃO TEM POKÉ BOLAS!");
      this.menu = { type: "main", index: 0 };
      return;
    }
    this.gastar(item);
    if (ehGlitch) { Glitch.hit(2); Audio2.glitch(); }
    await this.say(ehGlitch ? g.jogou : "VOCÊ JOGOU UMA POKÉ BOLA!");
    this.ballAnim = { t: 0, shakes: 0 };
    const shakes = ehGlitch ? catchGlitchball(this.foe) : catchAttempt(this.foe);
    await this.wait(0.7);
    for (let i = 0; i < Math.min(3, shakes); i++) {
      this.ballAnim.shakes = i + 1;
      Audio2.tone(300 + i * 60, 0.08);
      await this.wait(0.55);
    }
    if (shakes >= 4) {
      Audio2.heal();
      this.ballAnim.caught = true;
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
    const fMove = chooseAiMove(this.foe, this.mine, this.fStages, this.pStages);
    if (fMove) await this.useMove("f", fMove);
    await this.checkFaints();
  }

  /** A EXPERIÊNCIA de derrubar aquele bicho. Virou método porque a GLITCH RAID
   *  não passa mais pelo desmaio (ela vira bola), e sem isto ela deixaria de
   *  dar experiência nenhuma — o chefe mais difícil do jogo pagando menos que
   *  um pidgey. */
  async premiarExp() {
    // o SANDUÍCHE DOCE do acampamento entra aqui, multiplicando o que se aprende
    const xp = Math.floor(xpYieldFor(this.foe) * (this.trainer ? 1.5 : 1)
                          * fator(this.st, "xp") * (this.raid?.xp || 1));
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
      for (const ev of gainXp(mon, xp)) {
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

  /** O CHEFE VIRANDO BOLA. Ele encolhe até sumir, a bola cai, e a captura é
   *  a mesma de sempre daí pra frente. */
  async raidVirouBola() {
    const G = DB.STORY.glitch;
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
    this.st.caught[this.foe.species] = true;
    if (this.boss && this.npcKey) (this.st.npcState[this.npcKey] ||= {}).defeated = true;
    if (this.st.party.length < 6) {
      this.st.party.push(this.foe);
      await this.say(`${this.foe.nickname} ENTROU NA EQUIPE.`);
    } else {
      await this.say(`${this.foe.nickname} FOI ENVIADO AO PC.`);
      this.st.box.push(this.foe);
    }
    if (this.boss) await this.say(DB.STORY.dimension.caught);
    if (this.foe.species === "missingno") {
      // fim do arco: o mundo volta ao normal
      this.st.flags.caughtMissingno = true;
      this.st.flags.glitchWorld = false;
      this.st.corruption = 0;
      Glitch.forced = false;
      Glitch.burst = 0;
      for (const line of DB.STORY.ending) await this.say(line);
    }
    await this.finish();
  }

  async tryFlee() {
    this.menu = null;
    if (this.boss) {
      await this.say("A FENDA SE FECHOU ATRÁS DE VOCÊ. NÃO TEM PRA ONDE FUGIR!");
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
      const fMove = chooseAiMove(this.foe, this.mine, this.fStages, this.pStages);
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
      const fMove = chooseAiMove(this.foe, this.mine, this.fStages, this.pStages);
      if (fMove) await this.useMove("f", fMove);
      await this.checkFaints();
    }
  }

  async usePotion() {
    this.menu = null;
    if ((this.st.items["poção"] || 0) <= 0) {
      await this.say("VOCÊ NÃO TEM POÇÕES!");
      this.menu = { type: "main", index: 0 };
      return;
    }
    if (this.mine.hp >= this.mine.maxHp) {
      await this.say(`${this.mine.nickname} JÁ ESTÁ COM O HP CHEIO!`);
      this.menu = { type: "main", index: 0 };
      return;
    }
    this.gastar("poção");
    this.mine.hp = Math.min(this.mine.maxHp, this.mine.hp + 20);
    Audio2.heal();
    await this.syncHp();
    await this.say(`${this.mine.nickname} RECUPEROU 20 DE HP!`);
    const fMove = chooseAiMove(this.foe, this.mine, this.fStages, this.pStages);
    if (fMove) await this.useMove("f", fMove);
    await this.checkFaints();
  }

  /** tira um item do bolso; no zero ele some da mochila (igual ao overworld) */
  gastar(item) {
    this.st.items[item] -= 1;
    if (this.st.items[item] <= 0) delete this.st.items[item];
  }

  async finish() {
    // a MEGA dura só a batalha: ninguém sai daqui megado (nem o save)
    this.foeParty.forEach(reverterMega);
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
    this.t += dt;
    this.shake = Math.max(0, this.shake - dt);

    if (this.fadeDir) {
      this.fadeA = Math.max(0, Math.min(1, this.fadeA + this.fadeDir * dt * 3));
      if (this.fadeDir < 0 && this.fadeA <= 0) this.fadeDir = 0;
    }
    if (this.ballAnim) this.ballAnim.t += dt;
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
    this.flash = Math.max(0, this.flash - dt * 1.6);
    if (this.tOut > 0 && this.tOut < 1) this.tOut = Math.min(1, this.tOut + dt * 4);

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
      if (s2.faint) { s2.dy += dt * 90; s2.alpha = Math.max(0, s2.alpha - dt * 2.2); }
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
    if (this.busy || !this.menu) return;
    this.updateMenu();
  }

  updateMenu() {
    const m = this.menu;
    if (m.type === "main") {
      const items = ["LUTAR", "MOCHILA", "POKÉMON", "FUGIR"];
      const move = (d) => { m.index = (m.index + d + 4) % 4; Audio2.blip(); };
      this.tentarArmarMega();
      this.tentarArmarZ();
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
    if (m.type === "moves") {
      const n = this.mine.moves.length;
      const move = (d) => { m.index = (m.index + d + n) % n; Audio2.blip(); };
      this.tentarArmarMega();
      this.tentarArmarZ();
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
      const itens = this.itensMochila();
      const n = itens.length;
      if (Input.consume("up")) { m.index = (m.index + n - 1) % n; Audio2.blip(); }
      if (Input.consume("down")) { m.index = (m.index + 1) % n; Audio2.blip(); }
      if (Input.consume("b")) { this.menu = { type: "main", index: 1 }; Audio2.cancel(); }
      if (Input.consume("a")) {
        Audio2.select();
        const it = itens[Math.min(m.index, n - 1)];
        this.run(it.cristal ? this.usarCristalZ()
          : it.booster ? this.usarBooster()
                 : it.bola ? this.tryCatch(it.item) : this.usePotion());
      }
      return;
    }
    if (m.type === "party") {
      const n = this.st.party.length;
      if (Input.consume("up")) { m.index = (m.index + n - 1) % n; Audio2.blip(); }
      if (Input.consume("down")) { m.index = (m.index + 1) % n; Audio2.blip(); }
      if (Input.consume("b")) { this.menu = { type: "main", index: 2 }; Audio2.cancel(); }
      if (Input.consume("a")) {
        const target = this.st.party[m.index];
        if (m.index === this.playerIdx || isFainted(target)) { Audio2.cancel(); return; }
        Audio2.select();
        this.run(this.switchTo(m.index));
      }
    }
  }

  async switchTo(idx) {
    this.menu = null;
    this.megaArmada = null;      // a pedra reage com quem estava na frente
    await this.say(`VOLTE, ${this.mine.nickname}!`);
    this.playerIdx = idx;
    this.pStages = newStages();
    this.disp.p = this.mine.hp;
    this.sp.p = this.newSprite(-90);
    await this.say(`VAI, ${this.mine.nickname}!`);
    const fMove = chooseAiMove(this.foe, this.mine, this.fStages, this.pStages);
    if (fMove) await this.useMove("f", fMove);
    await this.checkFaints();
  }

  // ---------------------------------------------------------- render
  render(ctx) {
    const sx = this.shake > 0 ? Math.round(Math.sin(this.t * 90) * 3 * (this.shake / 0.25)) : 0;
    ctx.save();
    ctx.translate(sx, 0);

    // cenario
    const g = ctx.createLinearGradient(0, 0, 0, 110);
    g.addColorStop(0, this.isGlitch ? "#2a1040" : "#9fd8f0");
    g.addColorStop(1, this.isGlitch ? "#120820" : "#dff0f8");
    ctx.fillStyle = g;
    ctx.fillRect(-8, 0, W + 16, 110);
    ctx.fillStyle = this.isGlitch ? "#3a1d5c" : "#8fd06a";
    ctx.beginPath(); ctx.ellipse(178, 66, 46, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(48, 106, 54, 14, 0, 0, Math.PI * 2); ctx.fill();

    // sprites em 64x64 (tamanho nativo dos de batalha do FireRed), com animação
    const bob = Math.sin(this.t * 2) * 1.5;
    // A escala cresce a partir dos PÉS e do centro: o bicho incha no lugar em
    // vez de escorregar pro canto de cima, que é o que dá se a gente só mudar a
    // largura e a altura do drawImage.
    const drawMon = (img, x, y, sp, dir) => {
      if (sp.blink > 0 && Math.floor(sp.blink * 22) % 2 === 0) return;
      const l = sp.lunge > 0 ? Math.sin((0.3 - sp.lunge) / 0.3 * Math.PI) * 12 * dir : 0;
      const e = sp.escala ?? 1;
      const lado = 64 * e;
      ctx.globalAlpha = sp.alpha;
      ctx.drawImage(img, Math.round(x + sp.dx + l + (64 - lado) / 2),
                    Math.round(y + sp.dy + (64 - lado)), lado, lado);
      ctx.globalAlpha = 1;
    };
    const tart = this.showTrainer ? trainerArt(this.trainer?.sprite) : null;
    if (tart) {
      ctx.drawImage(tart, Math.round(146 + this.tOut * 110), Math.round(4 + bob), 64, 64);
    } else if (!this.showTrainer && (!isFainted(this.foe) || this.disp.f > 0 || this.sp.f.alpha > 0)) {
      const fimg = Assets.mon(this.foe.species, this.foe.seed);
      drawMon(this.foe.shiny ? Assets.shiny(fimg) : fimg, 146,
              4 + bob + (this.raid ? RAID.desce : 0), this.sp.f, -1);
    }
    if (this.ballAnim) this.drawBall(ctx);
    if (this.sp.p.alpha > 0) {
      const pimg = Assets.monBack(this.mine.species, this.mine.seed);
      drawMon(this.mine.shiny ? Assets.shiny(pimg) : pimg, 14, 46 - bob, this.sp.p, 1);
    }

    if (this.fx.length) this.drawFx(ctx);

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
      }
    }
    ctx.globalAlpha = 1;
    ctx.lineWidth = 1;
  }

  /** A CASCA da GLITCH RAID, logo abaixo da barra dele. Enquanto ela tem
   *  pedaço, o dano não chega no bicho — e a barra some quando ela cai, pra não
   *  sobrar um zero na tela dizendo nada. */
  drawEscudo(ctx) {
    if (this.raid.escudo <= 0) return;
    const larg = 100, x = 6, y = 30;
    ctx.fillStyle = "#1a1030";
    ctx.fillRect(x, y, larg, 5);
    ctx.fillStyle = "#b455ff";
    ctx.fillRect(x, y, Math.max(1, Math.round(larg * this.raid.escudo / this.raid.escudoMax)), 5);
    drawText(ctx, "CASCA", x + larg + 4, y - 2, "#b455ff");
  }

  statusBox(ctx, x, y, mon, disp, showHp) {
    const w = showHp ? 112 : 100;
    const h = showHp ? 40 : 30;
    panel(ctx, x, y, w, h);
    drawText(ctx, (mon.shiny ? "*" : "") + mon.nickname.slice(0, 10), x + 6, y + 5,
      mon.shiny ? "#d8a828" : mon.corrupt ? PAL.glitch : PAL.ink);
    if (mon.megaDe) drawText(ctx, "M", x + w - 34, y + 5, PAL.glitch);
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

  drawBall(ctx) {
    const a = this.ballAnim;
    const t = Math.min(1, a.t / 0.7);
    const x = 40 + (170 - 40) * t;
    const y = 90 - Math.sin(t * Math.PI) * 60 + (a.t > 0.7 ? 0 : 0);
    const wob = a.shakes ? Math.sin(a.t * 22) * 3 : 0;
    ctx.save();
    ctx.translate(x + wob, Math.min(y, 52));
    ctx.drawImage(Assets.ball, -4, -4, 12, 12);
    ctx.restore();
  }

  /** "MEGA" + a tecla (ou a forma escolhida) — só quando dá pra usar */
  marcaMega(ctx, x, y, compacto = false) {
    const megas = this.megasDisponiveis();
    if (!megas.length) return;
    const armada = this.megaArmada;
    // CHARIZARD e MEWTWO têm duas formas: o X/Y do fim do nome vira a marca
    const marca = armada ? (/ [XY]$/.test(armada.nome) ? armada.nome.slice(-1) : "ON") : "C";
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
      this.itensMochila().forEach((it, i) => {
        const q = this.st.items[it.item] || 0;
        drawText(ctx, `${it.label}  x${q}`, 24, 118 + i * LINE_H, it.bola && it.glitch ? PAL.glitch : PAL.ink);
        if (i === m.index) cursor(ctx, 12, 118 + i * LINE_H);
      });
      drawText(ctx, "X VOLTA", 180, 140, PAL.ink2);
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
