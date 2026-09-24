// BATALHA EM GRUPO: dois contra dois, ou três contra três.
//
// A batalha de um contra um (src/scenes/battle.js) foi escrita inteira em volta
// de "o meu" e "o dele": `this.mine`, `this.foe`, uma caixa de cada lado. Dobrar
// isso lá dentro seria mexer em raid, pokésave, captura, MEGA e GLITCHBOOSTER
// de uma vez só — então a batalha em grupo é uma cena própria, e o que as duas
// dividem é o MOTOR (src/systems/battle-engine.js), as cutscenes de golpe, as
// habilidades e as regras de prêmio e derrota, que aqui são as mesmas.
//
// Quem abre esta cena (e com quantos por lado) está em src/data/duplas.js.
//
// O QUE TEM AQUI: golpe com ALVO escolhido, golpe que pega MAIS DE UM (ESPALHA),
// ordem por prioridade e velocidade entre todos, troca, poção, o CRISTAL Z (uma
// vez por batalha, armado com Q), clima, habilidades de entrada e de contato,
// status, XP, dinheiro, insígnia e o TOTEM das provações com os ajudantes.
// O QUE NÃO TEM: captura (é sempre treinador ou totem — ninguém aqui é de
// pegar), fuga pelo mesmo motivo, MEGA e GLITCHBOOSTER, que continuam sendo
// coisa de um contra um.
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
import { limpar, limparTudo } from "../systems/glitchboost.js";
import { reverterMega, reverterTudo } from "../systems/mega.js";
import { venceu as venceuAmizade } from "../systems/creche.js";
import { isFainted, gainXp, xpYieldFor, heal, createMon } from "../systems/mon.js";
import {
  calcDamage, accuracyCheck, applyMoveEffects, statusTickDamage, effText,
  newStages, effectiveStat,
} from "../systems/battle-engine.js";
import { habilidadeDoMon, entrada as entradaDaHabilidade, contato as contatoDaHabilidade, curaDoTurno } from "../systems/habilidades.js";
import { BattleScene } from "./battle.js";

const W = 240, H = 160;

/** Onde cada vaga fica na tela. `cx` é o centro, `pe` a linha dos pés, `tam` o
 *  lado do sprite. A vaga 0 do outro lado é a do meio no trio: é onde o totem
 *  fica, que é quem tem que aparecer primeiro.
 *
 *  TODO MUNDO EM 64, o tamanho de verdade do sprite. Encolher pra caber três
 *  lado a lado (era 46, 50, 52...) fazia o navegador jogar linhas e colunas
 *  fora — e com elas a pupila, o olho, a boca: o bicho mudava de expressão.
 *  Os sprites têm margem transparente dos lados, então eles se encostam sem
 *  se tapar. */
const PALCO = {
  2: {
    f: [{ cx: 148, pe: 64, tam: 64 }, { cx: 204, pe: 58, tam: 64 }],
    p: [{ cx: 30, pe: 112, tam: 64 }, { cx: 90, pe: 112, tam: 64 }],
  },
  3: {
    f: [{ cx: 170, pe: 62, tam: 64 }, { cx: 124, pe: 58, tam: 64 }, { cx: 214, pe: 54, tam: 64 }],
    p: [{ cx: 22, pe: 112, tam: 64 }, { cx: 62, pe: 112, tam: 64 }, { cx: 102, pe: 112, tam: 64 }],
  },
};

const txt = (k, vars = {}) =>
  String(DB.DUPLA_TEXTO?.[k] || k).replace(/\{(\w+)\}/g, (m, n) => vars[n] ?? m);

export class GrupoBattleScene {
  /** args: { tamanho: 2|3, trainer?, npcKey?, foes? (os bichos prontos, pro
   *  totem), totem? (a provação, pra saber que não tem bola nem fuga) } */
  enter(args = {}) {
    const st = this.game.state;
    this.n = args.tamanho === 3 ? 3 : 2;
    this.trainer = args.trainer || null;
    this.npcKey = args.npcKey || null;
    this.foeParty = this.trainer
      ? this.trainer.party.map((p) => createMon(p.id, p.lvl, { corrupt: !!p.corrupt }))
      : (args.foes || []).filter(Boolean);
    this.totem = this.foeParty[0]?.totem || null;
    this.isGlitch = !!args.glitch;

    adiantarMons([...this.foeParty, ...st.party].filter(Boolean)
      .map((m) => DB.SPECIES[m.species]).filter(Boolean)
      .map((sp) => ({ id: sp.id, dex: sp.spriteDex || sp.dex })));

    // AS VAGAS. Cada lado tem `n` vagas; cada vaga aponta pra um índice da
    // equipe (ou null, quando ninguém sobrou pra ocupar). Do seu lado saem
    // tantos quanto os do outro — e, se você não tem tantos em pé, sai quem tem.
    const vagas = (time) => {
      const out = [];
      time.forEach((m, i) => { if (out.length < this.n && !isFainted(m)) out.push(i); });
      while (out.length < this.n) out.push(null);
      return out.map((idx) => ({ idx, stages: newStages(), sp: this.newSprite(), disp: 0 }));
    };
    this.lado = { p: vagas(st.party), f: vagas(this.foeParty) };
    for (const k of ["p", "f"]) for (const v of this.lado[k]) v.disp = this.monDe(k, v)?.hp || 0;
    // o totem é grande; os ajudantes não
    if (this.totem) this.lado.f[0].sp.escala = this.n === 3 ? 1.15 : DB.TOTEM?.tamanho || 1.35;

    this.dlg = new Dialogue();
    this.timers = [];
    this.waits = [];
    this.busy = true;
    this.menu = null;
    this.fx = [];
    this.flash = 0;
    this.shake = 0;
    this.t = 0;
    this.fadeA = 1;
    this.fadeDir = -1;
    this.showTrainer = !!this.trainer;
    this.tOut = 0;
    trainerArt(this.trainer?.sprite);
    this.cristalUsado = false;
    this.clima = st.player?.map === "tempestade" ? { tipo: "chuva", turnos: Infinity } : null;
    this.escolhas = [];
    this.escolhendo = 0;
    this.xpPendente = 0;
    for (const m of this.foeParty.slice(0, this.n)) if (m) st.seen[m.species] = true;

    Audio2.playMusic("batalha", DB.MUSIC?.batalha);
    this.run(this.intro());
  }

  exit() { Audio2.stopLoop(); }

  newSprite() { return { dx: 0, dy: 0, alpha: 1, blink: 0, lunge: 0, faint: false, escala: 1 }; }

  get st() { return this.game.state; }

  // ------------------------------------------------------------ as vagas
  timeDe(k) { return k === "p" ? this.st.party : this.foeParty; }
  monDe(k, v) { return v && v.idx != null ? this.timeDe(k)[v.idx] : null; }
  /** as vagas com alguém de pé */
  vivas(k) { return this.lado[k].filter((v) => { const m = this.monDe(k, v); return m && !isFainted(m); }); }
  outro(k) { return k === "p" ? "f" : "p"; }
  /** alguém do time ainda pode lutar (na vaga ou no banco)? */
  temAlguem(k) { return this.timeDe(k).some((m) => m && !isFainted(m)); }
  /** quem está no banco e pode entrar */
  banco(k) {
    const usados = new Set(this.lado[k].map((v) => v.idx));
    return this.timeDe(k).map((m, i) => ({ m, i })).filter(({ m, i }) => m && !isFainted(m) && !usados.has(i));
  }
  nomes(lista) { return lista.map((m) => m.nickname); }

  // ------------------------------------------------- helpers de fluxo
  run(promise) {
    this.busy = true;
    promise.then(() => { this.busy = false; }).catch((e) => {
      this.busy = false;
      console.error(e);
      setTimeout(() => { throw e; });
    });
  }
  say(text) { return new Promise((res) => this.dlg.say(text, res)); }
  wait(sec) { return new Promise((res) => this.timers.push({ t: sec, res })); }
  until(fn) { return new Promise((res) => this.waits.push({ fn, res })); }
  syncHp() {
    return this.until(() => ["p", "f"].every((k) => this.lado[k].every((v) => {
      const m = this.monDe(k, v);
      return !m || v.disp === m.hp;
    })));
  }

  // ---------------------------------------------------------- roteiro
  async intro() {
    await this.wait(0.6);
    const T = DB.DUPLA_TEXTO || {};
    const deles = this.nomes(this.lado.f.map((v) => this.monDe("f", v)).filter(Boolean));
    if (this.trainer) {
      await this.say(this.trainer.dupla ? txt("desafio", { NOME: this.trainer.name })
                                        : `${this.trainer.name} QUER BATALHAR!`);
      await this.trainerOut();
      await this.say(this.enviou(this.trainer.name, deles));
    } else if (this.totem) {
      Audio2.tone(147, 0.3, "triangle", 0.5);
      for (const linha of this.totem.acorda || []) await this.say(linha);
      await this.say((DB.PROVACOES_TEXTO?.apareceu || "O TOTEM {MON} SE LEVANTA!").replace("{MON}", deles[0]));
      if (deles.length > 1) {
        Audio2.tone(330, 0.1, "square", 0.4);
        await this.say(txt("chamou", { MON: deles[0] }));
        for (const nome of deles.slice(1)) await this.say(txt("ajudante", { MON: nome }));
      }
    }
    const meus = this.nomes(this.lado.p.map((v) => this.monDe("p", v)).filter(Boolean));
    await this.say(meus.length > 1
      ? (T.vai || "VAI, {A} E {B}!").replace("{A}", meus.slice(0, -1).join(", ")).replace("{B}", meus.at(-1))
      : txt("vaiUm", { A: meus[0] }));
    if (this.clima) await this.say(DB.CLIMA_TEXTO[this.clima.tipo].continua);
    for (const v of this.lado.f) await this.entrou("f", v);
    if (this.totem) await this.auraDoTotem();
    for (const v of this.lado.p) await this.entrou("p", v);
    this.comecarEscolha();
  }

  enviou(nome, lista) {
    if (lista.length === 1) return txt("enviouUm", { NOME: nome, A: lista[0] });
    return txt("enviou", { NOME: nome, A: lista.slice(0, -1).join(", "), B: lista.at(-1) });
  }

  async trainerOut() {
    if (!this.showTrainer) return;
    if (trainerArt(this.trainer?.sprite) && DB.CONFIG?.battleAnim) {
      this.tOut = 0.001;
      await this.until(() => this.tOut >= 1);
    }
    this.showTrainer = false;
    this.tOut = 0;
  }

  async auraDoTotem() {
    const k = this.totem?.aura;
    const v = this.lado.f[0];
    const mon = this.monDe("f", v);
    if (!k || !mon) return;
    const T = DB.PROVACOES_TEXTO || {};
    v.stages[k] = Math.min(6, (v.stages[k] || 0) + (DB.TOTEM?.aura ?? 1));
    Audio2.tone(392, 0.08); Audio2.tone(523, 0.14);
    await this.say((T.aura || "{STAT} DE {MON} AUMENTOU!")
      .replace("{STAT}", DB.NOME_STAT?.[k] || k).replace("{MON}", mon.nickname));
  }

  /** GAROA/SECA mudam o clima; INTIMIDAR derruba o ATAQUE de TODOS do outro lado */
  async entrou(k, v) {
    const mon = this.monDe(k, v);
    if (!mon || isFainted(mon)) return;
    const e = entradaDaHabilidade(mon);
    if (!e) return;
    const h = habilidadeDoMon(mon);
    const T = DB.CLIMA_TEXTO;
    if (e.clima && this.clima?.tipo !== e.clima) {
      await this.say(`${h.nome} DE ${mon.nickname}!`);
      await this.mudarClima(e.clima);
    }
    if (e.intimidar) {
      for (const o of this.vivas(this.outro(k))) {
        const alvo = this.monDe(this.outro(k), o);
        if (habilidadeDoMon(alvo)?.semQueda) continue;
        o.stages.atk = Math.max(-6, (o.stages.atk || 0) - 1);
        await this.say(T.intimidar.replace("{HAB}", h.nome).replace("{MON}", mon.nickname).replace("{ALVO}", alvo.nickname));
      }
    }
  }

  async mudarClima(tipo) {
    const T = DB.CLIMA_TEXTO;
    if (this.clima?.turnos === Infinity && this.clima.tipo !== tipo) return void (await this.say("A TEMPESTADE NÃO DEIXA."));
    this.clima = { tipo, turnos: T.turnos };
    this.flash = tipo === "sol" ? 0.5 : 0.25;
    Audio2.tone(tipo === "sol" ? 880 : 330, 0.12, tipo === "sol" ? "triangle" : "sine", 0.5);
    await this.say(T[tipo].comeca);
  }

  // ----------------------------------------------------- as escolhas
  /** Começa o turno: cada vaga sua com alguém de pé escolhe, uma depois da outra. */
  comecarEscolha() {
    this.escolhas = [];
    this.fila = this.lado.p.map((v, i) => i).filter((i) => {
      const m = this.monDe("p", this.lado.p[i]);
      return m && !isFainted(m);
    });
    this.escolhendo = 0;
    this.zArmado = false;
    this.menu = { type: "main", index: 0 };
  }

  /** a vaga que está escolhendo agora */
  get vagaAtual() { return this.lado.p[this.fila[this.escolhendo]]; }
  get monAtual() { return this.monDe("p", this.vagaAtual); }

  escolheu(acao) {
    this.escolhas[this.escolhendo] = { vaga: this.fila[this.escolhendo], ...acao };
    this.zArmado = false;
    this.escolhendo++;
    if (this.escolhendo < this.fila.length) {
      this.menu = { type: "main", index: 0 };
      return;
    }
    this.menu = null;
    this.run(this.rodarTurno());
  }

  /** B no menu principal da segunda vaga volta pra primeira */
  voltarEscolha() {
    if (this.escolhendo === 0) return false;
    this.escolhendo--;
    this.escolhas.length = this.escolhendo;
    this.menu = { type: "main", index: 0 };
    return true;
  }

  /** Os cristais que servem pra quem está escolhendo agora. */
  cristaisAqui(mon = this.monAtual) {
    if (this.cristalUsado || !mon) return [];
    const tipos = new Set((mon.moves || []).map((m) => DB.MOVES[m.id]?.type));
    return (DB.ZCRISTAIS || []).filter((c) => {
      if (!(this.st.items?.[c.item] || 0) || !tipos.has(c.tipo)) return false;
      if (!c.especie) return true;
      const p = partes(mon.species);
      return mon.species === c.especie || (p && (p.cabeca === c.especie || p.corpo === c.especie));
    });
  }

  tentarArmarZ() {
    if (!Input.consume("z")) return;
    // uma vez por batalha, e um só por turno: dois golpes Z no mesmo turno
    // seriam o cristal sendo usado duas vezes
    if (this.escolhas.some((e) => e.z) || !this.cristaisAqui().length) return void Audio2.cancel();
    this.zArmado = !this.zArmado;
    Audio2.tone(this.zArmado ? 988 : 330, 0.07, "square", 0.45);
  }

  // ------------------------------------------------------- o turno
  /** A IA do outro lado: pra cada bicho, o golpe e o alvo que mais prometem.
   *  É a mesma conta do `chooseAiMove` (força x efetividade x STAB, com um
   *  pouco de sorte), só que olhando todos os alvos em vez de um. */
  escolhaDaIA(v) {
    const mon = this.monDe("f", v);
    const alvos = this.vivas("p");
    let melhor = null, nota = -1;
    for (const ref of mon.moves.filter((m) => m.pp > 0)) {
      const mv = DB.MOVES[ref.id];
      if (!mv) continue;
      for (const a of alvos) {
        const alvo = this.monDe("p", a);
        let s = (mv.power || 25) * DB.effectiveness(mv.type, alvo.types) * (mon.types.includes(mv.type) ? 1.5 : 1);
        if (mv.category === "status") s = 30 + Math.random() * 20;
        if (mv.clima) s = this.clima?.tipo === mv.clima ? 0 : 60 + Math.random() * 20;
        // golpe que pega todo mundo vale pelos dois — menos se acerta o parceiro
        const esp = DB.ESPALHA?.[ref.id];
        if (esp) s *= (esp === "todos" && this.vivas("f").length > 1 ? 1.1 : 1.5);
        s *= 0.8 + Math.random() * 0.4;
        if (s > nota) { nota = s; melhor = { ref, alvo: this.lado.p.indexOf(a) }; }
      }
    }
    return melhor;
  }

  async rodarTurno() {
    const acoes = [];
    for (const e of this.escolhas) acoes.push({ k: "p", vaga: e.vaga, ...e });
    for (const v of this.vivas("f")) {
      const e = this.escolhaDaIA(v);
      if (e) acoes.push({ k: "f", vaga: this.lado.f.indexOf(v), tipo: "golpe", ref: e.ref, alvo: e.alvo });
    }

    // 1. trocas e poções saem antes de qualquer golpe
    for (const a of acoes.filter((x) => x.tipo === "trocar")) await this.trocar(a.vaga, a.para);
    for (const a of acoes.filter((x) => x.tipo === "pocao")) await this.pocao(a.vaga);

    // 2. golpes: prioridade, depois velocidade, e sorteio no empate
    const golpes = acoes.filter((x) => x.tipo === "golpe").map((a) => {
      const v = this.lado[a.k][a.vaga];
      const mon = this.monDe(a.k, v);
      return {
        ...a,
        pri: DB.MOVES[a.ref?.id]?.priority || 0,
        vel: mon ? effectiveStat(mon, "spe", v.stages, this.clima?.tipo) : 0,
        sorte: Math.random(),
      };
    }).sort((x, y) => y.pri - x.pri || y.vel - x.vel || x.sorte - y.sorte);

    for (const a of golpes) {
      const v = this.lado[a.k][a.vaga];
      const mon = this.monDe(a.k, v);
      if (!mon || isFainted(mon)) continue;
      await this.usarGolpe(a.k, a.vaga, a);
      if (await this.acabou()) return;
    }

    await this.fimDoTurno();
    if (await this.acabou()) return;
    await this.reporVagas();
    if (await this.acabou()) return;
    this.comecarEscolha();
  }

  async trocar(i, para) {
    const v = this.lado.p[i];
    const antes = this.monDe("p", v);
    if (!antes || isFainted(this.st.party[para])) return;
    await this.say(`VOLTE, ${antes.nickname}!`);
    v.idx = para;
    v.stages = newStages();
    v.disp = this.st.party[para].hp;
    v.sp = this.newSprite();
    await this.say(`VAI, ${this.st.party[para].nickname}!`);
    await this.entrou("p", v);
  }

  async pocao(i) {
    const mon = this.monDe("p", this.lado.p[i]);
    if (!mon || isFainted(mon) || (this.st.items["poção"] || 0) <= 0) return;
    this.st.items["poção"] -= 1;
    if (this.st.items["poção"] <= 0) delete this.st.items["poção"];
    mon.hp = Math.min(mon.maxHp, mon.hp + 20);
    Audio2.heal();
    await this.syncHp();
    await this.say(`${mon.nickname} RECUPEROU 20 DE HP!`);
  }

  /** Pra quem o golpe vai. Golpe de um alvo cujo alvo já caiu procura outro do
   *  mesmo lado — no jogo de verdade também é assim. */
  alvosDe(k, vaga, a, mv) {
    const o = this.outro(k);
    const esp = DB.ESPALHA?.[a.ref.id];
    const vivosDeLa = this.vivas(o);
    if (esp === "inimigos") return vivosDeLa.map((v) => [o, v]);
    if (esp === "todos") {
      const parceiros = this.vivas(k).filter((v) => v !== this.lado[k][vaga]).map((v) => [k, v]);
      return [...vivosDeLa.map((v) => [o, v]), ...parceiros];
    }
    let alvo = this.lado[o][a.alvo ?? 0];
    const m = this.monDe(o, alvo);
    if (!m || isFainted(m)) alvo = vivosDeLa[0];
    return alvo ? [[o, alvo]] : [];
  }

  async usarGolpe(k, vaga, a) {
    const v = this.lado[k][vaga];
    const user = this.monDe(k, v);
    let ref = a.ref;
    let mv = DB.MOVES[ref?.id];
    if (!mv) return;

    if (user.status === "paralisia" && Math.random() < 0.25) {
      return void (await this.say(`${user.nickname} ESTÁ PARALISADO E NÃO CONSEGUE SE MEXER!`));
    }

    // o CRISTAL Z: o golpe escolhido vira o golpe Z do tipo dele, sem gastar PP
    if (a.z) {
      const c = this.cristaisAqui(user).find((x) => x.tipo === mv.type);
      if (c) {
        this.cristalUsado = true;
        Glitch.hit(1);
        this.flash = 0.5;
        Audio2.tone(988, 0.08, "square", 0.6);
        Audio2.tone(1318, 0.14, "square", 0.5);
        await this.say(DB.STORY.zcristal.usou.replace("{MON}", user.nickname).replace("{TIPO}", c.tipo));
        ref = { id: c.golpe, pp: 1 };
        mv = DB.MOVES[c.golpe];
      }
    }
    if (ref.pp <= 0) return void (await this.say(`${user.nickname} NÃO TEM PP PRA ${mv.name}!`));
    ref.pp = Math.max(0, ref.pp - 1);
    await this.say(`${user.nickname} USOU ${mv.name}!`);

    if (mv.clima) return this.mudarClima(mv.clima);

    const alvos = this.alvosDe(k, vaga, { ...a, ref }, mv);
    if (!alvos.length) return void (await this.say("MAS NÃO TINHA NINGUÉM PRA ACERTAR!"));
    const espalhou = alvos.length > 1;
    if (espalhou) await this.say(DB.ESPALHA?.[ref.id] === "todos" ? txt("todos") : txt("inimigos"));

    // golpe que só mexe em quem usou (ENDURECER): nada de alvo
    if (mv.category === "status" && mv.stat?.target === "self") {
      await this.cutscene(k, v, alvos[0], mv, ref.id);
      for (const msg of applyMoveEffects(mv, user, user, v.stages, v.stages)) await this.say(msg);
      return;
    }

    await this.cutscene(k, v, alvos[0], mv, ref.id);
    let recuo = 0;
    for (const [ko, vo] of alvos) {
      const alvo = this.monDe(ko, vo);
      if (!alvo || isFainted(alvo)) continue;
      if (!accuracyCheck(ref.id, v.stages, vo.stages)) {
        await this.say(espalhou ? `${alvo.nickname} DESVIOU!` : "MAS ERROU O ALVO!");
        continue;
      }
      const res = calcDamage(user, alvo, ref.id, v.stages, vo.stages, this.clima?.tipo);
      if (res.anuncia) { this.flash = 0.35; await this.say(res.anuncia); }
      if (res.dmg > 0) {
        let dano = res.dmg * (espalhou ? (DB.FORCA_ESPALHADA ?? 0.75) : 1);
        // os sanduíches do acampamento valem pro SEU lado, como no um contra um
        dano = Math.max(1, Math.round(dano * (k === "p" ? fator(this.st, "ataque") : 1)
                                          / (ko === "p" ? fator(this.st, "defesa") : 1)));
        if (!(DB.CONFIG?.battleAnim ?? 1)) { Audio2.hit(); this.shake = 0.25; }
        vo.sp.blink = Math.max(vo.sp.blink, 0.45);
        alvo.hp = Math.max(0, alvo.hp - dano);
        await this.syncHp();
        if (res.mirror) { Glitch.hit(1.5); Audio2.glitch(); await this.say(`O DADO DE ${alvo.nickname} NÃO SUPORTA VER A SI MESMO!`); }
        if (res.crit) await this.say(espalhou ? `ACERTO CRÍTICO EM ${alvo.nickname}!` : "ACERTO CRÍTICO!");
        const et = effText(res.eff);
        if (et) await this.say(espalhou ? `${alvo.nickname}: ${et}` : et);
        if (mv.recoil) recuo += Math.max(1, Math.floor(dano * mv.recoil));
      } else if (res.imune) {
        const T = DB.CLIMA_TEXTO;
        if (res.cura && alvo.hp < alvo.maxHp) {
          alvo.hp = Math.min(alvo.maxHp, alvo.hp + Math.ceil(alvo.maxHp * res.cura));
          await this.syncHp();
          await this.say(T.absorve.replace("{HAB}", res.imune.nome).replace("{MON}", alvo.nickname));
        } else await this.say(T.imune.replace("{HAB}", res.imune.nome).replace("{MON}", alvo.nickname));
        continue;
      } else if (res.eff === 0) {
        await this.say(`NÃO AFETA ${alvo.nickname}...`);
        continue;
      }
      for (const msg of applyMoveEffects(mv, user, alvo, v.stages, vo.stages)) await this.say(msg);
      if (res.dmg > 0 && !isFainted(alvo)) {
        const status = contatoDaHabilidade(mv, user, alvo);
        if (status && !user.status) {
          const T = DB.CLIMA_TEXTO;
          user.status = status;
          await this.say(T.contato.replace("{HAB}", habilidadeDoMon(alvo).nome).replace("{MON}", alvo.nickname)
            .replace("{ALVO}", user.nickname).replace("{STATUS}", T.statusNomes[status]));
        }
      }
      if (isFainted(alvo)) await this.desmaiou(ko, vo);
    }
    if (recuo && !isFainted(user)) {
      user.hp = Math.max(0, user.hp - recuo);
      await this.syncHp();
      await this.say(`${user.nickname} SOFREU O RECUO!`);
      if (isFainted(user)) await this.desmaiou(k, v);
    }
  }

  /** alguém caiu: a animação, a frase e — se foi do outro lado — a XP */
  async desmaiou(k, v) {
    const mon = this.monDe(k, v);
    if (!mon || v.sp.faint) return;
    Audio2.faint();
    v.sp.faint = true;
    await this.wait(0.6);
    await this.say(k === "f"
      ? `${this.trainer ? "O " + mon.nickname + " INIMIGO" : mon.nickname} DESMAIOU!`
      : `${mon.nickname} DESMAIOU!`);
    if (k === "f") await this.premiarExp(mon);
  }

  /** A XP de derrubar um bicho do outro lado. Com o EXP. SHARE ligado ganha a
   *  equipe toda (de pé); sem ele, quem está em campo. */
  async premiarExp(foe) {
    const xp = Math.floor(xpYieldFor(foe) * (this.trainer ? 1.5 : 1) * fator(this.st, "xp"));
    const share = DB.CONFIG?.shareXp !== false;
    const emCampo = this.vivas("p").map((v) => this.monDe("p", v));
    const quem = (share ? this.st.party : emCampo).filter((m) => m && !isFainted(m));
    if (!quem.length) return;
    await this.say(share ? `A EQUIPE GANHOU ${xp} DE EXP.!` : `${this.nomes(emCampo).join(" E ")} GANHARAM ${xp} DE EXP.!`);
    for (const mon of quem) {
      for (const ev of gainXp(mon, xp)) {
        if (ev.type === "level") { Audio2.heal(); await this.say(`${mon.nickname} SUBIU PARA O NÍVEL ${ev.level}!`); }
        if (ev.type === "move") await this.say(`${mon.nickname} APRENDEU ${DB.MOVES[ev.id].name}!`);
        if (ev.type === "moveFull") await this.say(`${mon.nickname} TENTOU APRENDER ${DB.MOVES[ev.id].name}, MAS JÁ SABE 4 GOLPES.`);
      }
      // o HP subiu com o nível: a barra acompanha sem animar do zero
      for (const v of this.lado.p) if (this.monDe("p", v) === mon) v.disp = mon.hp;
    }
    for (const m of emCampo) venceuAmizade(m);
  }

  async fimDoTurno() {
    for (const k of ["p", "f"]) {
      for (const v of this.vivas(k)) {
        const mon = this.monDe(k, v);
        const d = statusTickDamage(mon);
        if (d > 0) {
          mon.hp = Math.max(0, mon.hp - d);
          await this.syncHp();
          await this.say(`${mon.nickname} SOFRE COM ${mon.status === "envenenado" ? "O VENENO" : "A QUEIMADURA"}!`);
          if (isFainted(mon)) { await this.desmaiou(k, v); continue; }
        }
        const f = curaDoTurno(mon, this.clima?.tipo);
        if (f > 0 && mon.hp < mon.maxHp) {
          mon.hp = Math.min(mon.maxHp, mon.hp + Math.max(1, Math.floor(mon.maxHp * f)));
          await this.syncHp();
          await this.say(DB.CLIMA_TEXTO.cura.replace("{HAB}", habilidadeDoMon(mon).nome).replace("{MON}", mon.nickname));
        }
      }
    }
    if (this.clima && this.clima.turnos !== Infinity) {
      this.clima.turnos--;
      const T = DB.CLIMA_TEXTO[this.clima.tipo];
      if (this.clima.turnos <= 0) { await this.say(T.para); this.clima = null; }
      else await this.say(T.continua);
    }
  }

  /** Quem caiu sai da vaga. Do outro lado entra o próximo da equipe; do seu,
   *  você escolhe quem — e, sem ninguém no banco, a vaga fica vazia. */
  async reporVagas() {
    for (const v of this.lado.f) {
      const m = this.monDe("f", v);
      if (m && !isFainted(m)) continue;
      const prox = this.banco("f")[0];
      if (!prox) { v.idx = null; continue; }
      v.idx = prox.i;
      v.stages = newStages();
      v.sp = this.newSprite();
      v.disp = prox.m.hp;
      this.st.seen[prox.m.species] = true;
      await this.say(txt("enviouUm", { NOME: this.trainer?.name || "O TOTEM", A: prox.m.nickname }));
      await this.entrou("f", v);
    }
    for (let i = 0; i < this.lado.p.length; i++) {
      const v = this.lado.p[i];
      const m = this.monDe("p", v);
      if (m && !isFainted(m)) continue;
      const banco = this.banco("p");
      if (!banco.length) { v.idx = null; continue; }
      const escolhido = banco.length === 1 ? banco[0].i : await this.escolherQuemEntra(m, banco);
      v.idx = escolhido;
      v.stages = newStages();
      v.sp = this.newSprite();
      v.disp = this.st.party[escolhido].hp;
      await this.say(txt("vaiUm", { A: this.st.party[escolhido].nickname }));
      await this.entrou("p", v);
    }
  }

  escolherQuemEntra(caiu, banco) {
    return new Promise((res) => {
      this.dlg.say(txt("quemEntra", { MON: caiu?.nickname || "?" }), () => {
        this.menu = { type: "repor", index: 0, banco, res };
        this.busy = false;
      });
    }).then((i) => { this.busy = true; return i; });
  }

  /** Acabou? Vitória com o outro lado inteiro no chão, derrota com o seu. */
  async acabou() {
    if (!this.temAlguem("f")) { await this.venceu(); return true; }
    if (!this.temAlguem("p")) { await this.perdeu(); return true; }
    return false;
  }

  async venceu() {
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
        this.st.flags.escortPending = true;
      }
    } else if (this.npcKey) {
      // o TOTEM: quem paga o cristal é o overworld, olhando esta marca
      (this.st.npcState[this.npcKey] ||= {}).defeated = true;
    }
    await this.finish();
  }

  async perdeu() {
    await this.say("VOCÊ NÃO TEM MAIS POKÉMON EM CONDIÇÕES DE LUTAR!");
    await this.say("TUDO ESCURECE...");
    this.st.party.forEach(heal);
    this.st.surfando = null;
    const back = this.st.respawn || { map: DB.START_MAP, ...DB.MAPS[DB.START_MAP].spawn };
    Object.assign(this.st.player, { map: back.map, x: back.x, y: back.y, dir: back.dir || "down" });
    this.st.corruption = Math.min(100, this.st.corruption + 3);
    await this.say("VOCÊ VOLTOU PRO ÚLTIMO LUGAR SEGURO.");
    await this.finish();
  }

  async finish() {
    this.foeParty.forEach(reverterMega);
    reverterTudo(this.st);
    limparTudo(this.st);
    this.foeParty.forEach(limpar);
    Audio2.stopLoop();
    this.fadeDir = 1;
    await this.until(() => this.fadeA >= 1);
    this.game.scenes.pop();
  }

  // ------------------------------------------------------ cutscene
  centro(k, v) {
    const i = this.lado[k].indexOf(v);
    const p = PALCO[this.n][k][i];
    return { x: p.cx, y: p.pe - Math.round(p.tam * 0.45) };
  }

  async cutscene(k, v, alvo, mv, id) {
    const vel = DB.CONFIG?.battleAnim ?? 1;
    if (!vel) return;
    const [ka, va] = alvo || [this.outro(k), this.lado[this.outro(k)][0]];
    const palco = {
      de: this.centro(k, v), para: this.centro(ka, va), dir: k === "p" ? 1 : -1,
      som: Audio2,
      cor: DB.TYPE_COLOR?.[mv?.type] || "#ffffff",
      fx: (o) => this.fx.push({ t: 0, vida: 0.4, fade: true, vx: 0, vy: 0, g: 0, gira: 0, ang: 0, ...o }),
      wait: (s) => this.wait(s / vel),
      flash: (a) => { this.flash = Math.max(this.flash, a); },
      shake: (t) => { this.shake = Math.max(this.shake, t); },
      piscaAlvo: (t) => { va.sp.blink = Math.max(va.sp.blink, t); },
      avanca: async () => { v.sp.lunge = 0.3; await this.wait(0.16); },
      somem: () => { v.sp.alpha = 0; },
      voltam: () => { v.sp.alpha = 1; },
      glitch: (n) => Glitch.hit(n),
    };
    try { await cenaDoGolpe(id, mv)(palco); }
    finally { if (!v.sp.faint) v.sp.alpha = 1; }
  }

  // ---------------------------------------------------------- update
  update(dt) {
    this.t += dt;
    this.shake = Math.max(0, this.shake - dt);
    if (this.fadeDir) {
      this.fadeA = Math.max(0, Math.min(1, this.fadeA + this.fadeDir * dt * 3));
      if (this.fadeDir < 0 && this.fadeA <= 0) this.fadeDir = 0;
    }
    this.flash = Math.max(0, this.flash - dt * 1.6);
    if (this.tOut > 0 && this.tOut < 1) this.tOut = Math.min(1, this.tOut + dt * 4);

    for (let i = this.fx.length - 1; i >= 0; i--) {
      const e = this.fx[i];
      e.t += dt; e.x += e.vx * dt; e.y += e.vy * dt; e.vy += e.g * dt; e.ang += e.gira * dt;
      if (e.cresce) e.r += e.cresce * dt;
      if (e.t >= e.vida) this.fx.splice(i, 1);
    }
    for (const k of ["p", "f"]) {
      for (const v of this.lado[k]) {
        const s = v.sp;
        s.blink = Math.max(0, s.blink - dt);
        s.lunge = Math.max(0, s.lunge - dt);
        if (s.faint) { s.dy += dt * 90; s.alpha = Math.max(0, s.alpha - dt * 2.2); }
        const mon = this.monDe(k, v);
        if (!mon || v.disp === mon.hp) continue;
        const speed = Math.max(6, mon.maxHp / 1.2);
        const d = Math.sign(mon.hp - v.disp) * speed * dt;
        v.disp = Math.abs(mon.hp - v.disp) <= Math.abs(d) ? mon.hp : v.disp + d;
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
    if (!this.menu) return;
    if (this.busy && this.menu.type !== "repor") return;
    this.updateMenu();
  }

  updateMenu() {
    const m = this.menu;
    const grade = (n, colunas = 2) => {
      const move = (d) => { m.index = (m.index + d + n) % n; Audio2.blip(); };
      if (Input.consume("up")) move(-colunas);
      if (Input.consume("down")) move(colunas);
      if (Input.consume("left")) move(-1);
      if (Input.consume("right")) move(1);
    };
    const lista = (n) => {
      if (Input.consume("up")) { m.index = (m.index + n - 1) % n; Audio2.blip(); }
      if (Input.consume("down")) { m.index = (m.index + 1) % n; Audio2.blip(); }
    };

    if (m.type === "main") {
      grade(4);
      this.tentarArmarZ();
      if (Input.consume("b")) { if (this.voltarEscolha()) Audio2.cancel(); return; }
      if (!Input.consume("a")) return;
      Audio2.select();
      if (m.index === 0) this.menu = { type: "moves", index: 0 };
      else if (m.index === 1) this.menu = { type: "bag", index: 0 };
      else if (m.index === 2) this.menu = { type: "party", index: 0 };
      else {
        const fala = this.totem ? DB.PROVACOES_TEXTO?.fuga : txt("semFuga");
        this.dlg.say(fala || txt("semFuga"));
      }
      return;
    }
    if (m.type === "moves") {
      const mon = this.monAtual;
      grade(mon.moves.length);
      this.tentarArmarZ();
      if (Input.consume("b")) { this.menu = { type: "main", index: 0 }; return void Audio2.cancel(); }
      if (!Input.consume("a")) return;
      const ref = mon.moves[m.index];
      if (ref.pp <= 0) return void Audio2.cancel();
      Audio2.select();
      const z = this.zArmado && this.cristaisAqui().some((c) => c.tipo === DB.MOVES[ref.id]?.type);
      const vivos = this.vivas("f");
      const mv = DB.MOVES[ref.id];
      const precisaAlvo = !DB.ESPALHA?.[ref.id] && vivos.length > 1
        && !(mv.category === "status" && mv.stat?.target === "self") && !mv.clima;
      if (!precisaAlvo) {
        return this.escolheu({ tipo: "golpe", ref, alvo: this.lado.f.indexOf(vivos[0]), z });
      }
      this.menu = { type: "alvo", index: 0, ref, z, vivos: vivos.map((v) => this.lado.f.indexOf(v)) };
      return;
    }
    if (m.type === "alvo") {
      const n = m.vivos.length;
      if (Input.consume("left") || Input.consume("up")) { m.index = (m.index + n - 1) % n; Audio2.blip(); }
      if (Input.consume("right") || Input.consume("down")) { m.index = (m.index + 1) % n; Audio2.blip(); }
      if (Input.consume("b")) { this.menu = { type: "moves", index: 0 }; return void Audio2.cancel(); }
      if (Input.consume("a")) {
        Audio2.select();
        this.escolheu({ tipo: "golpe", ref: m.ref, alvo: m.vivos[m.index], z: m.z });
      }
      return;
    }
    if (m.type === "bag") {
      if (Input.consume("b")) { this.menu = { type: "main", index: 1 }; return void Audio2.cancel(); }
      if (!Input.consume("a")) return;
      const mon = this.monAtual;
      const jaPediu = this.escolhas.filter((e) => e.tipo === "pocao").length;
      if ((this.st.items["poção"] || 0) - jaPediu <= 0) { Audio2.cancel(); return void this.dlg.say("VOCÊ NÃO TEM POÇÕES!"); }
      if (mon.hp >= mon.maxHp) { Audio2.cancel(); return void this.dlg.say(`${mon.nickname} JÁ ESTÁ COM O HP CHEIO!`); }
      Audio2.select();
      return this.escolheu({ tipo: "pocao" });
    }
    if (m.type === "party") {
      const n = this.st.party.length;
      lista(n);
      if (Input.consume("b")) { this.menu = { type: "main", index: 2 }; return void Audio2.cancel(); }
      if (!Input.consume("a")) return;
      const alvo = this.st.party[m.index];
      const emCampo = this.lado.p.some((v) => v.idx === m.index);
      const jaVai = this.escolhas.some((e) => e.tipo === "trocar" && e.para === m.index);
      if (emCampo || jaVai || !alvo || isFainted(alvo)) return void Audio2.cancel();
      Audio2.select();
      return this.escolheu({ tipo: "trocar", para: m.index });
    }
    if (m.type === "repor") {
      lista(m.banco.length);
      if (!Input.consume("a")) return;
      Audio2.select();
      const escolhido = m.banco[m.index].i;
      this.menu = null;
      m.res(escolhido);
    }
  }

  // ---------------------------------------------------------- render
  render(ctx) {
    const sx = this.shake > 0 ? Math.round(Math.sin(this.t * 90) * 3 * (this.shake / 0.25)) : 0;
    ctx.save();
    ctx.translate(sx, 0);

    const g = ctx.createLinearGradient(0, 0, 0, 110);
    g.addColorStop(0, this.isGlitch ? "#2a1040" : "#9fd8f0");
    g.addColorStop(1, this.isGlitch ? "#120820" : "#dff0f8");
    ctx.fillStyle = g;
    ctx.fillRect(-8, 0, W + 16, 110);
    if (this.clima?.tipo === "chuva") {
      ctx.fillStyle = "rgba(40,60,110,0.28)";
      ctx.fillRect(-8, 0, W + 16, 110);
    } else if (this.clima?.tipo === "sol") {
      ctx.fillStyle = "rgba(255,210,80,0.22)";
      ctx.fillRect(-8, 0, W + 16, 110);
    }
    // as plataformas: uma comprida de cada lado, que cabe o grupo inteiro
    ctx.fillStyle = this.isGlitch ? "#3a1d5c" : "#8fd06a";
    const pf = PALCO[this.n].f, pp = PALCO[this.n].p;
    const meio = (l) => (Math.min(...l.map((p) => p.cx)) + Math.max(...l.map((p) => p.cx))) / 2;
    const larg = (l) => (Math.max(...l.map((p) => p.cx)) - Math.min(...l.map((p) => p.cx))) / 2 + 34;
    ctx.beginPath(); ctx.ellipse(meio(pf), 60, larg(pf), 11, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(meio(pp), 108, larg(pp), 13, 0, 0, Math.PI * 2); ctx.fill();

    const bob = Math.sin(this.t * 2) * 1.5;
    const tart = this.showTrainer ? trainerArt(this.trainer?.sprite) : null;
    if (tart) ctx.drawImage(tart, Math.round(150 + this.tOut * 110), Math.round(4 + bob), 64, 64);
    else {
      // de trás pra frente: a vaga da ponta é desenhada antes da do meio
      const ordem = this.lado.f.map((v, i) => i).sort((a, b) => pf[a].pe - pf[b].pe);
      for (const i of ordem) this.desenhaMon(ctx, "f", this.lado.f[i], pf[i], bob);
    }
    this.lado.p.forEach((v, i) => this.desenhaMon(ctx, "p", v, pp[i], -bob));
    if (this.fx.length) BattleScene.prototype.drawFx.call(this, ctx);

    if (!this.isGlitch && temCeu(DB.MAPS?.[this.st.player?.map])) {
      const noturno = veu();
      if (noturno.alpha > 0) fade(ctx, noturno.alpha, noturno.cor);
    }

    // a seta em cima de quem vai levar o golpe
    if (this.menu?.type === "alvo" && Math.floor(this.t * 4) % 2 === 0) {
      const i = this.menu.vivos[this.menu.index];
      const p = pf[i];
      const topo = Math.max(2, p.pe - p.tam - 6);
      ctx.fillStyle = "#e0242a";
      ctx.beginPath(); ctx.moveTo(p.cx - 5, topo); ctx.lineTo(p.cx + 5, topo); ctx.lineTo(p.cx, topo + 6); ctx.fill();
    }

    if (!this.showTrainer) this.lado.f.forEach((v, i) => this.caixa(ctx, "f", v, 4, 3 + i * 19));
    const base = 110 - this.n * 19;
    this.lado.p.forEach((v, i) => this.caixa(ctx, "p", v, 132, base + i * 19));
    ctx.restore();

    if (!this.dlg.active && !this.dlg.choice) {
      if (this.menu && !this.busy || this.menu?.type === "repor") this.desenhaMenu(ctx);
      else panel(ctx, 2, 110, 236, 48);
    }
    this.dlg.render(ctx);
    if (this.flash > 0) fade(ctx, this.flash, "#ffffff");
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }

  desenhaMon(ctx, k, v, p, bob) {
    const mon = this.monDe(k, v);
    if (!mon) return;
    if (isFainted(mon) && v.disp <= 0 && v.sp.alpha <= 0) return;
    const s = v.sp;
    if (s.blink > 0 && Math.floor(s.blink * 22) % 2 === 0) return;
    // a vaga que está escolhendo sobe e desce um pouco mais: é ela quem manda agora
    const vez = k === "p" && this.menu && !this.busy && this.vagaAtual === v;
    const pulo = vez ? Math.abs(Math.sin(this.t * 5)) * -2 : 0;
    if (k === "f" && mon.totem && mon.species === "diglett") {
      const img = Assets.mon(mon.species, mon.seed);
      return void BattleScene.prototype.drawDiglettBombado.call(this, ctx, img, bob, s, mon, p.cx, p.pe,
        this.n === 3 ? 0.55 : 0.68);
    }
    const img = k === "f" ? Assets.mon(mon.species, mon.seed) : Assets.monBack(mon.species, mon.seed);
    const arte = Assets.comCor(img, mon, k === "p");
    const lado = Math.round(p.tam * (s.escala || 1));
    // (só o totem sai do 64, e ele CRESCE — crescer não perde pixel)
    const dir = k === "p" ? 1 : -1;
    const l = s.lunge > 0 ? Math.sin((0.3 - s.lunge) / 0.3 * Math.PI) * 10 * dir : 0;
    ctx.globalAlpha = s.alpha;
    ctx.drawImage(arte, Math.round(p.cx - lado / 2 + s.dx + l), Math.round(p.pe - lado + s.dy + bob + pulo), lado, lado);
    ctx.globalAlpha = 1;
  }

  /** a caixinha de cada vaga: nome, nível, barra (e os números, do seu lado) */
  caixa(ctx, k, v, x, y) {
    const mon = this.monDe(k, v);
    if (!mon) return;
    const w = 104, h = 18;
    const vez = k === "p" && this.menu && !this.busy && this.vagaAtual === v;
    panel(ctx, x, y, w, h);
    if (vez) { ctx.fillStyle = "#ffd166"; ctx.fillRect(x + 2, y + 2, 2, h - 4); }
    const cor = mon.luminoso ? "#fff3b0" : mon.shiny ? "#d8a828" : mon.corrupt ? PAL.glitch : PAL.ink;
    drawText(ctx, mon.nickname.slice(0, 9), x + 6, y + 3, cor);
    drawText(ctx, `N${mon.level}`, x + w - 26, y + 3, PAL.ink);
    const pct = Math.max(0, v.disp) / mon.maxHp;
    if (k === "p") {
      bar(ctx, x + 6, y + 12, 50, 3, pct, hpColor(pct));
      drawText(ctx, `${Math.ceil(Math.max(0, v.disp))}/${mon.maxHp}`, x + 60, y + 9, PAL.ink2);
    } else {
      bar(ctx, x + 6, y + 12, w - 12, 3, pct, hpColor(pct));
    }
    if (mon.status) drawText(ctx, mon.status.slice(0, 3), x + w - 46, y + 3, "#e0524a");
  }

  desenhaMenu(ctx) {
    const m = this.menu;
    panel(ctx, 2, 110, 236, 48);
    if (m.type === "main") {
      const items = ["LUTAR", "MOCHILA", "POKÉMON", "FUGIR"];
      drawText(ctx, "O QUE", 10, 122, PAL.ink);
      drawText(ctx, `${this.monAtual.nickname} FARÁ?`, 10, 134, PAL.ink, { maxChars: 19 });
      items.forEach((it, i) => {
        const x = 128 + (i % 2) * 56, y = 116 + Math.floor(i / 2) * LINE_H;
        drawText(ctx, it, x + 8, y, PAL.ink);
        if (i === m.index) cursor(ctx, x, y);
      });
      if (this.fila.length > 1) drawText(ctx, `${this.escolhendo + 1}/${this.fila.length}`, 10, 146, PAL.ink2);
      if (this.zArmado) drawText(ctx, "Z!", 92, 146, "#ffd166", { shadow: "#7a4a10" });
      else if (this.cristaisAqui().length && !this.escolhas.some((e) => e.z)) drawText(ctx, "Q: Z", 40, 146, PAL.ink2);
      return;
    }
    if (m.type === "moves") {
      const mon = this.monAtual;
      mon.moves.forEach((mv, i) => {
        const d = DB.MOVES[mv.id];
        const x = 8 + (i % 2) * 108, y = 116 + Math.floor(i / 2) * LINE_H;
        drawText(ctx, d.name.slice(0, 14), x + 8, y, mv.pp > 0 ? PAL.ink : "#b04040");
        if (i === m.index) cursor(ctx, x, y);
      });
      const sel = mon.moves[m.index];
      const d = DB.MOVES[sel.id];
      drawText(ctx, `PP ${sel.pp}/${sel.ppMax}`, 10, 140, PAL.ink2);
      drawText(ctx, d.type, 80, 140, DB.TYPE_COLOR?.[d.type] || PAL.ink2);
      const esp = DB.ESPALHA?.[sel.id];
      drawText(ctx, esp ? "ÁREA" : d.power ? `PWR ${d.power}` : "STATUS", 170, 140, esp ? "#e0524a" : PAL.ink2);
      if (this.zArmado) drawText(ctx, "Z!", 214, 116, "#ffd166", { shadow: "#7a4a10" });
      return;
    }
    if (m.type === "alvo") {
      const alvo = this.monDe("f", this.lado.f[m.vivos[m.index]]);
      drawText(ctx, txt("alvo"), 10, 118, PAL.ink);
      drawText(ctx, `< ${alvo?.nickname || "?"} >`, 10, 132, PAL.ink);
      drawText(ctx, DB.MOVES[m.ref.id]?.name || "", 120, 132, PAL.ink2);
      drawText(ctx, "X VOLTA", 168, 148, PAL.ink2);
      return;
    }
    if (m.type === "bag") {
      drawText(ctx, `POÇÃO  x${this.st.items["poção"] || 0}`, 24, 116, PAL.ink);
      cursor(ctx, 12, 116);
      drawText(ctx, `PRA ${this.monAtual.nickname}`, 24, 128, PAL.ink2);
      drawText(ctx, "SEM BOLA AQUI", 24, 140, PAL.ink2);
      drawText(ctx, "X VOLTA", 168, 148, PAL.ink2);
      return;
    }
    if (m.type === "party" || m.type === "repor") {
      const itens = m.type === "party"
        ? this.st.party.map((mon, i) => ({ mon, i }))
        : m.banco.map(({ m: mon, i }) => ({ mon, i }));
      const JANELA = 3;
      const inicio = Math.max(0, Math.min(itens.length - JANELA, m.index - 1));
      itens.slice(inicio, inicio + JANELA).forEach(({ mon, i }, j) => {
        const y = 116 + j * LINE_H;
        const emCampo = this.lado.p.some((v) => v.idx === i);
        drawText(ctx, `${mon.nickname}  N${mon.level}  ${mon.hp}/${mon.maxHp}${emCampo ? " *" : ""}`, 16, y,
          isFainted(mon) ? "#b04040" : PAL.ink);
        if (inicio + j === m.index) cursor(ctx, 6, y);
      });
      if (inicio > 0) drawText(ctx, "▲", 224, 116, PAL.ink2);
      if (inicio + JANELA < itens.length) drawText(ctx, "▼", 224, 140, PAL.ink2);
    }
  }
}
