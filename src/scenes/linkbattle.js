// BATALHA LINK: dois jogadores de verdade, um contra o outro.
//
// Como funciona o combinado (e por que é assim):
//
// Um lado MANDA (quem convidou, o "dono") e o outro ESPELHA. O dono é o único
// que roda as contas — dano, acerto, ordem por velocidade, status. O convidado
// escolhe o que fazer, manda a escolha e depois só desenha o que voltou.
//
// A alternativa seria os dois calcularem o turno e conferirem no fim. Isso
// exige que os dois sorteiem os MESMOS números (crítico, acerto, dano), e o
// motor do jogo usa Math.random solto em vários lugares. Ou eu mexia no motor
// inteiro, arriscando a batalha normal de um jogador só, ou eu deixava um lado
// mandando. Deixei um lado mandando: a batalha de sempre não foi tocada.
//
// O que a batalha link TEM: golpes, tipos, crítico, status, ordem por
// velocidade, troca de Pokémon e desistência.
//
// DOIS FORMATOS: 1X1 (o de sempre) e 2X2 (`formato: "dupla"`, escolhido por
// quem desafia e mandado junto com o convite). No 2X2 cada lado tem duas vagas,
// cada vaga escolhe golpe e ALVO, os golpes de área (src/data/duplas.js) pegam
// mais de um, e quem cai é trocado SOZINHO pelo próximo da equipe — escolher o
// substituto no meio do turno faria os dois lados esperarem um pelo outro.
// O que ela NÃO tem: item, captura, XP e dinheiro. Ninguém sai daqui mais forte
// nem mais fraco — os dois lados lutam com CÓPIAS da equipe, então o save não é
// tocado em nenhum momento.
import { DB } from "../data/index.js";
import { Input } from "../core/input.js";
import { Net } from "../core/net.js";
import { Audio2 } from "../core/audio.js";
import { Assets } from "../core/assets.js";
import { Online } from "../systems/online.js";
import { Dialogue } from "../systems/dialogue.js";
import {
  newStages, effectiveStat, calcDamage, accuracyCheck, applyMoveEffects,
  statusTickDamage, effText,
} from "../systems/battle-engine.js";
import { isFainted, hpPct } from "../systems/mon.js";
import { panel, bar, hpColor, drawText, cursor, fade, PAL, LINE_H } from "../core/gfx.js";

const W = 240, H = 160;
const txt = (k, vars = {}) =>
  String(DB.ONLINE_TEXTO?.[k] || k).replace(/\{(\w+)\}/g, (m, n) => vars[n] ?? m);

export class LinkBattleScene {
  enter(args = {}) {
    this.parceiro = { id: args.id, nome: (args.nome || "?").toUpperCase() };
    this.dono = args.papel === "dono";
    this.dupla = args.formato === "dupla";
    this.dlg = new Dialogue();
    this.fase = "juntando";      // juntando | escolhendo | esperando | rolando | fim
    this.turno = 0;
    this.menu = { tipo: "raiz", index: 0 };
    this.soTroca = false;        // desmaiou: só dá pra trocar
    this.fadeA = 1;
    this.fadeDir = -1;
    this.vencedor = null;

    // as cópias: o save não entra nesta batalha em momento nenhum
    this.meuTime = (this.game.state.party || [])
      .map((m) => Online.copiaPraBatalha(m))
      .filter(Boolean);
    this.estado = null;          // o que está na tela (vem do dono)
    this.lados = null;           // só o dono tem: a verdade da batalha

    this.desinscreve = [
      Online.on("batalha", (m) => this.recebeu(m)),
      Online.on("parceiroSumiu", () => this.fim(true, txt("sumiu", { NOME: this.parceiro.nome }))),
    ];

    Audio2.stopLoop();
    this.dlg.say(txt("batalhaComeca", { NOME: this.parceiro.nome }));
    // As duas cenas não abrem no mesmo instante, e os dois POSTs saem por
    // conexões diferentes — o time de um lado pode chegar ANTES da outra cena
    // existir. Por isso o time é pedido, e não só mandado: quem recebe um
    // pedido responde com o seu. `esperaTime` insiste até chegar.
    this.tentativas = 0;
    this.esperaTime = 0;
    this.mandaTime(true);
  }

  exit() {
    this.desinscreve.forEach((f) => f());
    Online.liberar();
  }

  manda(tipo, dados) { Net.manda(tipo, dados, this.parceiro.id); }

  mandaTime(pede) {
    this.manda("batalhaTime", { time: this.meuTime.map((m) => Online.empacota(m)), pede: !!pede });
  }

  // =================================================================== rede
  recebeu(m) {
    if (m.de !== this.parceiro.id) return;
    switch (m.tipo) {
      case "batalhaTime": {
        if (m.pede) this.mandaTime(false);          // ele chegou depois: toma o meu
        if (this.timeDele) break;                   // já tenho: ignoro repetição
        const time = (m.time || []).map((c) => Online.sanea(c)).filter(Boolean);
        if (!time.length) return this.fim(true, "O TIME QUE VEIO NÃO FAZ SENTIDO.");
        this.timeDele = time;
        if (this.dono) this.tentaComecar();
        break;
      }
      case "batalhaVez":                       // o dono está pedindo minha escolha
        this.turno = m.turno;
        if (m.dupla) { this.comecaEscolhaDupla(); break; }
        this.soTroca = !!m.soTroca;
        if (m.espera) {                        // o outro lado está trocando: eu passo
          this.fase = "esperando";
          this.manda("batalhaAcao", { turno: this.turno, acao: { tipo: "nada" } });
          break;
        }
        this.fase = "escolhendo";
        this.menu = { tipo: this.soTroca ? "trocar" : "raiz", index: 0 };
        break;
      case "batalhaAcao":                      // chegou a escolha do convidado
        if (this.dono) this.acaoDele = m.acao;
        break;
      case "batalhaEstado":                    // o dono contou o que aconteceu
        this.estado = m.estado;
        this.sincronizaTime();
        this.fase = "rolando";
        // se a vez do próximo turno chegou enquanto as falas rolavam, a
        // escolha já está aberta: o fim da fala não pode fechar ela de novo
        this.dlg.say(m.falas || [], () => { if (this.fase === "rolando") this.fase = "esperando"; });
        break;
      case "batalhaFim":
        this.fim(!m.donoGanhou, m.motivo);     // quem recebe isto é sempre o convidado
        break;
      default: break;
    }
  }

  /** o dono só começa quando tem os dois times na mão */
  tentaComecar() {
    if (!this.dono || !this.timeDele || this.fase !== "juntando") return;
    if (this.dupla) return this.comecaDupla();
    this.lados = {
      a: { time: this.meuTime, ativo: 0, stages: newStages(), nome: (this.game.state.player.name || "VOCÊ").toUpperCase() },
      b: { time: this.timeDele, ativo: 0, stages: newStages(), nome: this.parceiro.nome },
    };
    // o primeiro retrato vai ANTES da primeira vez: sem ele o convidado
    // escolheria o golpe olhando pra uma tela vazia
    this.publicaEstado([
      `${this.lados.a.nome} MANDOU ${this.lados.a.time[0].nickname}!`,
      `${this.lados.b.nome} MANDOU ${this.lados.b.time[0].nickname}!`,
    ]);
    this.novoTurno();
  }

  // ============================================================ o dono manda
  novoTurno() {
    if (this.dupla) return this.novoTurnoDupla();
    this.turno++;
    this.acaoDele = null;
    this.acaoMinha = null;
    const a = this.lados.a, b = this.lados.b;
    const caiuA = isFainted(a.time[a.ativo]), caiuB = isFainted(b.time[b.ativo]);
    // Turno de troca: alguém desmaiou e só entra outro no lugar. O lado que
    // está de pé NÃO ataca nesta rodada — senão desmaiar dava um golpe de
    // graça pro outro, que não é como o jogo funciona.
    this.turnoDeTroca = caiuA || caiuB;

    this.manda("batalhaVez", {
      turno: this.turno, soTroca: caiuB, espera: this.turnoDeTroca && !caiuB,
    });

    this.soTroca = caiuA;
    if (this.turnoDeTroca && !caiuA) {
      this.fase = "esperando";
      this.acaoMinha = { tipo: "nada" };
    } else {
      this.fase = "escolhendo";
      this.menu = { tipo: caiuA ? "trocar" : "raiz", index: 0 };
    }
  }

  /** as duas escolhas chegaram: roda o turno e conta pro outro lado */
  rodaTurno() {
    if (this.dupla) return this.rodaTurnoDupla();
    const falas = [];
    const a = this.lados.a, b = this.lados.b;

    // 1. troca sai antes de qualquer golpe
    for (const [lado, acao] of [[a, this.acaoMinha], [b, this.acaoDele]]) {
      if (acao?.tipo !== "trocar") continue;
      const i = Math.max(0, Math.min(lado.time.length - 1, acao.i | 0));
      if (isFainted(lado.time[i]) || i === lado.ativo) continue;
      lado.ativo = i;
      lado.stages = newStages();
      falas.push(`${lado.nome} MANDOU ${lado.time[i].nickname}!`);
    }

    if (this.turnoDeTroca) {                 // rodada só de trocar: nada mais acontece
      this.publicaEstado(falas);
      return this.novoTurno();
    }

    // 2. desistência acaba na hora
    for (const [lado, outro, acao] of [[a, b, this.acaoMinha], [b, a, this.acaoDele]]) {
      if (acao?.tipo === "desistir") {
        falas.push(txt("batalhaFugiu", { NOME: lado.nome }));
        return this.acabou(outro === a, falas);
      }
    }

    // 3. golpes, na ordem da velocidade
    const ordem = [[a, b, this.acaoMinha], [b, a, this.acaoDele]].sort((x, y) => {
      const vx = effectiveStat(x[0].time[x[0].ativo], "spe", x[0].stages);
      const vy = effectiveStat(y[0].time[y[0].ativo], "spe", y[0].stages);
      return vy - vx || (Math.random() < 0.5 ? -1 : 1);
    });
    for (const [lado, alvo, acao] of ordem) {
      if (acao?.tipo !== "golpe") continue;
      const mon = lado.time[lado.ativo], alvoMon = alvo.time[alvo.ativo];
      if (isFainted(mon) || isFainted(alvoMon)) continue;
      this.usaGolpe(lado, alvo, acao.i | 0, falas);
      if (isFainted(alvoMon)) {
        falas.push(`${alvoMon.nickname} DESMAIOU!`);
        Audio2.faint();
        if (!alvo.time.some((m) => !isFainted(m))) return this.acabou(alvo === b, falas);
      }
    }

    // 4. queimadura e veneno no fim do turno
    for (const lado of [a, b]) {
      const mon = lado.time[lado.ativo];
      if (isFainted(mon)) continue;
      const d = statusTickDamage(mon);
      if (!d) continue;
      mon.hp = Math.max(0, mon.hp - d);
      falas.push(`${mon.nickname} SOFRE COM ${mon.status === "envenenado" ? "O VENENO" : "A QUEIMADURA"}!`);
      if (isFainted(mon)) {
        falas.push(`${mon.nickname} DESMAIOU!`);
        if (!lado.time.some((m) => !isFainted(m))) return this.acabou(lado === b, falas);
      }
    }

    this.publicaEstado(falas);
    this.novoTurno();
  }

  usaGolpe(lado, alvo, i, falas) {
    const mon = lado.time[lado.ativo], alvoMon = alvo.time[alvo.ativo];
    const ref = mon.moves[Math.max(0, Math.min(mon.moves.length - 1, i))];
    if (!ref) return;
    const mv = DB.MOVES[ref.id];

    if (mon.status === "paralisia" && Math.random() < 0.25) {
      return void falas.push(`${mon.nickname} ESTÁ PARALISADO E NÃO CONSEGUE SE MEXER!`);
    }
    if (ref.pp <= 0) return void falas.push(`${mon.nickname} NÃO TEM PP PRA ${mv.name}!`);
    ref.pp = Math.max(0, ref.pp - 1);
    falas.push(`${mon.nickname} USOU ${mv.name}!`);

    if (!accuracyCheck(ref.id, lado.stages, alvo.stages)) return void falas.push("MAS ERROU O ALVO!");

    if (mv.power > 0) {
      const r = calcDamage(mon, alvoMon, ref.id, lado.stages, alvo.stages);
      alvoMon.hp = Math.max(0, alvoMon.hp - r.dmg);
      if (r.crit) falas.push("ACERTO CRÍTICO!");
      if (r.mirror) falas.push("O DADO DELE ENTROU EM CONFLITO CONSIGO MESMO!");
      const e = effText(r.eff);
      if (e) falas.push(e);
    }
    const extra = applyMoveEffects(mv, mon, alvoMon, lado.stages, alvo.stages);
    for (const f of extra || []) falas.push(f);
  }

  /** manda pro outro lado o retrato da batalha depois do turno */
  publicaEstado(falas) {
    const foto = (lado) => ({
      ativo: lado.ativos ? (lado.ativos.find((i) => i != null) ?? 0) : lado.ativo,
      ...(lado.ativos ? { ativos: lado.ativos } : {}),
      time: lado.time.map((m) => ({
        species: m.species, nickname: m.nickname, level: m.level,
        hp: m.hp, maxHp: m.maxHp, status: m.status, shiny: !!m.shiny,
        luminoso: !!m.luminoso, seed: m.seed,
        pps: (m.moves || []).map((g) => g.pp),
      })),
    });
    this.estado = { a: foto(this.lados.a), b: foto(this.lados.b), turno: this.turno };
    this.sincronizaTime();
    this.manda("batalhaEstado", { estado: this.estado, falas });
    if (falas.length) this.dlg.say(falas);
  }

  acabou(donoGanhou, falas) {
    this.publicaEstado(falas);
    this.manda("batalhaFim", { donoGanhou, motivo: null });
    this.fim(donoGanhou);
  }

  fim(euGanhei, motivo) {
    if (this.fase === "fim") return;
    this.fase = "fim";
    this.vencedor = euGanhei;
    const frase = motivo || (euGanhei
      ? txt("batalhaGanhou", { NOME: this.parceiro.nome })
      : txt("batalhaPerdeu", { NOME: this.parceiro.nome }));
    this.dlg.say([frase, txt("batalhaNadaVale")], () => this.game.scenes.pop());
  }

  // ================================================================ escolha
  /** O meu lado também vem do dono: HP, status e PP. Sem isto o menu do
   *  convidado mentiria — ele ofereceria pra trocar por quem já desmaiou. */
  sincronizaTime() {
    const meu = this.meuLado();
    if (!meu) return;
    meu.time.forEach((foto, i) => {
      const local = this.meuTime[i];
      if (!local) return;
      local.hp = foto.hp;
      local.status = foto.status;
      (foto.pps || []).forEach((pp, k) => { if (local.moves[k]) local.moves[k].pp = pp; });
    });
  }

  meuLado() { return this.estado ? (this.dono ? this.estado.a : this.estado.b) : null; }
  ladoDele() { return this.estado ? (this.dono ? this.estado.b : this.estado.a) : null; }

  monAtivo() {
    const l = this.meuLado();
    return l ? this.meuTime[l.ativo] : this.meuTime[0];
  }

  escolheu(acao) {
    this.fase = "esperando";
    if (this.dono) {
      this.acaoMinha = acao;
      if (this.acaoDele) this.rodaTurno();
    } else {
      this.manda("batalhaAcao", { turno: this.turno, acao });
    }
  }

  update(dt) {
    // (o Online.update roda no laço principal, em src/main.js)
    if (this.fase === "juntando" && !this.timeDele) {
      this.esperaTime -= dt;
      if (this.esperaTime <= 0) {
        this.esperaTime = 1.5;
        if (++this.tentativas > 6) return this.fim(true, "O OUTRO LADO NÃO RESPONDEU.");
        this.mandaTime(true);
      }
    }
    if (this.fadeDir) {
      this.fadeA += this.fadeDir * dt * 3.2;
      if (this.fadeA <= 0) { this.fadeA = 0; this.fadeDir = 0; }
    }
    if (this.dlg.update(dt)) return;
    if (this.fase === "fim") return;

    // o dono roda o turno assim que as duas escolhas estão na mesa
    if (this.dono && this.acaoMinha && this.acaoDele && this.fase !== "rolando") {
      this.fase = "rolando";
      return void this.rodaTurno();
    }
    if (this.fase !== "escolhendo") return;

    const m = this.menu;
    if (this.dupla) return this.menuDupla(m);
    if (m.tipo === "raiz") return this.menuRaiz(m);
    if (m.tipo === "golpes") return this.menuGolpes(m);
    if (m.tipo === "trocar") return this.menuTrocar(m);
  }

  menuRaiz(m) {
    const op = ["LUTAR", "TROCAR", "DESISTIR"];
    if (Input.consume("up")) { m.index = (m.index + op.length - 1) % op.length; Audio2.blip(); }
    if (Input.consume("down")) { m.index = (m.index + 1) % op.length; Audio2.blip(); }
    if (!Input.consume("a")) return;
    Audio2.select();
    if (op[m.index] === "LUTAR") this.menu = { tipo: "golpes", index: 0 };
    else if (op[m.index] === "TROCAR") this.menu = { tipo: "trocar", index: 0 };
    else this.escolheu({ tipo: "desistir" });
  }

  menuGolpes(m) {
    const mon = this.monAtivo();
    const golpes = mon?.moves || [];
    if (!golpes.length) return void this.escolheu({ tipo: "golpe", i: 0 });
    if (Input.consume("up")) { m.index = (m.index + golpes.length - 1) % golpes.length; Audio2.blip(); }
    if (Input.consume("down")) { m.index = (m.index + 1) % golpes.length; Audio2.blip(); }
    if (Input.consume("b")) { this.menu = { tipo: "raiz", index: 0 }; return void Audio2.cancel(); }
    if (Input.consume("a")) { Audio2.select(); this.escolheu({ tipo: "golpe", i: m.index }); }
  }

  menuTrocar(m) {
    const meu = this.meuLado();
    const vivos = this.meuTime.map((mon, i) => ({ mon, i }))
      .filter(({ mon, i }) => mon.hp > 0 && i !== (meu?.ativo ?? 0));
    if (!vivos.length) {
      this.menu = { tipo: this.soTroca ? "trocar" : "raiz", index: 0 };
      if (this.soTroca) return;                      // não tem pra onde trocar
      return void this.dlg.say("NÃO TEM MAIS NINGUÉM EM PÉ.");
    }
    m.index = Math.min(m.index, vivos.length - 1);
    if (Input.consume("up")) { m.index = (m.index + vivos.length - 1) % vivos.length; Audio2.blip(); }
    if (Input.consume("down")) { m.index = (m.index + 1) % vivos.length; Audio2.blip(); }
    if (!this.soTroca && Input.consume("b")) { this.menu = { tipo: "raiz", index: 0 }; return void Audio2.cancel(); }
    if (Input.consume("a")) { Audio2.select(); this.escolheu({ tipo: "trocar", i: vivos[m.index].i }); }
  }

  // ================================================================= render
  render(ctx) {
    if (this.dupla) return this.renderDupla(ctx);
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#7fb0e0");
    g.addColorStop(1, "#d8ecb8");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    const meu = this.meuLado(), dele = this.ladoDele();
    // no tamanho de verdade (64): encolher o sprite apagava pupila e boca
    if (dele) this.desenhaMon(ctx, dele.time[dele.ativo], 144, 4, 64, false);
    if (meu) this.desenhaMon(ctx, meu.time[meu.ativo], 18, 50, 64, true);
    if (dele) this.placa(ctx, dele.time[dele.ativo], 8, 10, this.parceiro.nome, dele);
    if (meu) this.placa(ctx, meu.time[meu.ativo], 120, 74, "VOCÊ", meu);

    if (this.fase === "escolhendo") this.desenhaMenu(ctx);
    else if (this.fase === "esperando") {
      panel(ctx, 2, 110, 236, 26);
      drawText(ctx, txt("batalhaEspera", { NOME: this.parceiro.nome }), 10, 118, PAL.ink);
    } else if (this.fase === "juntando") {
      panel(ctx, 2, 110, 236, 26);
      drawText(ctx, "JUNTANDO AS EQUIPES...", 10, 118, PAL.ink);
    }

    this.dlg.render(ctx);
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }

  desenhaMon(ctx, foto, x, y, tam, meuLado) {
    if (!foto) return;
    const img = meuLado ? Assets.monBack(foto.species, foto.seed) : Assets.mon(foto.species, foto.seed);
    const arte = Assets.comCor(img, foto, !!meuLado);
    if (foto.hp <= 0) ctx.globalAlpha = 0.35;
    ctx.drawImage(arte, x, y, tam, tam);
    ctx.globalAlpha = 1;
  }

  placa(ctx, foto, x, y, quem, lado) {
    if (!foto) return;
    panel(ctx, x, y, 112, 34);
    drawText(ctx, foto.nickname, x + 6, y + 4, PAL.ink);
    drawText(ctx, `Nv${foto.level}`, x + 82, y + 4, PAL.ink2);
    const pct = Math.max(0, foto.hp / Math.max(1, foto.maxHp));
    bar(ctx, x + 6, y + 18, 100, 4, pct, hpColor(pct));
    if (foto.status) drawText(ctx, foto.status.slice(0, 3).toUpperCase(), x + 6, y + 24, PAL.hpRed);
    // bolinhas de quem ainda está em pé
    lado.time.forEach((m, i) => {
      ctx.fillStyle = m.hp > 0 ? "#4cd06a" : "#7c8496";
      ctx.fillRect(x + 6 + i * 6, y + 28, 4, 4);
    });
  }

  desenhaMenu(ctx) {
    const m = this.menu;
    if (m.tipo === "raiz") {
      const op = ["LUTAR", "TROCAR", "DESISTIR"];
      panel(ctx, 140, 108, 98, op.length * LINE_H + 8);
      op.forEach((o, i) => {
        drawText(ctx, o, 154, 112 + i * LINE_H, PAL.ink);
        if (i === m.index) cursor(ctx, 146, 112 + i * LINE_H);
      });
      return;
    }
    if (m.tipo === "golpes") {
      const mon = this.monAtivo();
      const golpes = mon?.moves || [];
      panel(ctx, 4, 108, 234, golpes.length * LINE_H + 8);
      golpes.forEach((g, i) => {
        const mv = DB.MOVES[g.id];
        drawText(ctx, mv?.name || g.id, 18, 112 + i * LINE_H, PAL.ink);
        drawText(ctx, `PP ${g.pp}/${g.ppMax}`, 170, 112 + i * LINE_H, g.pp ? PAL.ink2 : PAL.hpRed);
        if (i === m.index) cursor(ctx, 10, 112 + i * LINE_H);
      });
      return;
    }
    const meu = this.meuLado();
    const vivos = this.meuTime.map((mon, i) => ({ mon, i }))
      .filter(({ mon, i }) => mon.hp > 0 && i !== (meu?.ativo ?? 0));
    panel(ctx, 4, 108, 234, Math.max(1, vivos.length) * LINE_H + 8);
    if (!vivos.length) drawText(ctx, "NINGUÉM EM PÉ.", 18, 112, PAL.ink);
    vivos.forEach(({ mon }, i) => {
      drawText(ctx, `${mon.nickname} Nv${mon.level} ${mon.hp}/${mon.maxHp}`, 18, 112 + i * LINE_H, PAL.ink);
      if (i === m.index) cursor(ctx, 10, 112 + i * LINE_H);
    });
  }

  // =================================================================== 2X2
  /** as duas primeiras de pé de cada time */
  primeirosDois(time) {
    const out = [];
    time.forEach((m, i) => { if (out.length < 2 && !isFainted(m)) out.push(i); });
    while (out.length < 2) out.push(null);
    return out;
  }

  comecaDupla() {
    const lado = (time, nome) => ({ time, nome, ativos: this.primeirosDois(time), stages: [newStages(), newStages()] });
    this.lados = {
      a: lado(this.meuTime, (this.game.state.player.name || "VOCÊ").toUpperCase()),
      b: lado(this.timeDele, this.parceiro.nome),
    };
    const manda = (l) => {
      const nomes = l.ativos.filter((i) => i != null).map((i) => l.time[i].nickname);
      return `${l.nome} MANDOU ${nomes.join(" E ")}!`;
    };
    this.publicaEstado([manda(this.lados.a), manda(this.lados.b)]);
    this.novoTurno();
  }

  novoTurnoDupla() {
    this.turno++;
    this.acaoDele = null;
    this.acaoMinha = null;
    this.manda("batalhaVez", { turno: this.turno, dupla: true });
    this.comecaEscolhaDupla();
  }

  /** As vagas minhas com alguém de pé escolhem, uma de cada vez. */
  comecaEscolhaDupla() {
    const meu = this.meuLado();
    const ativos = meu?.ativos || [0, null];
    this.vagasMinhas = [0, 1].filter((k) => ativos[k] != null && this.meuTime[ativos[k]]?.hp > 0);
    this.escolhasDupla = [];
    this.fase = "escolhendo";
    this.menu = { tipo: "raiz", index: 0 };
  }

  get vagaDaVez() { return this.vagasMinhas?.[(this.escolhasDupla || []).length]; }
  monDaVez() {
    const i = this.meuLado()?.ativos?.[this.vagaDaVez];
    return i != null ? this.meuTime[i] : null;
  }

  escolheuDupla(acao) {
    if (acao.tipo === "desistir") return this.escolheu({ tipo: "desistir" });
    this.escolhasDupla.push({ vaga: this.vagaDaVez, ...acao });
    if (this.escolhasDupla.length < this.vagasMinhas.length) {
      this.menu = { tipo: "raiz", index: 0 };
      return;
    }
    this.escolheu({ tipo: "dupla", acoes: this.escolhasDupla });
  }

  menuDupla(m) {
    const mon = this.monDaVez();
    if (!mon) return this.escolheu({ tipo: "dupla", acoes: this.escolhasDupla || [] });
    const lista = (n) => {
      if (Input.consume("up")) { m.index = (m.index + n - 1) % n; Audio2.blip(); }
      if (Input.consume("down")) { m.index = (m.index + 1) % n; Audio2.blip(); }
    };
    if (m.tipo === "raiz") {
      lista(3);
      if (Input.consume("b") && this.escolhasDupla.length) {
        this.escolhasDupla.pop();
        return void Audio2.cancel();
      }
      if (!Input.consume("a")) return;
      Audio2.select();
      if (m.index === 0) this.menu = { tipo: "golpes", index: 0 };
      else if (m.index === 1) this.menu = { tipo: "trocar", index: 0 };
      else this.escolheuDupla({ tipo: "desistir" });
      return;
    }
    if (m.tipo === "golpes") {
      const golpes = mon.moves || [];
      if (!golpes.length) return this.escolheuDupla({ tipo: "golpe", i: 0, alvo: 0 });
      lista(golpes.length);
      if (Input.consume("b")) { this.menu = { tipo: "raiz", index: 0 }; return void Audio2.cancel(); }
      if (!Input.consume("a")) return;
      Audio2.select();
      const dele = this.ladoDele();
      const vivos = [0, 1].filter((k) => dele?.ativos?.[k] != null && dele.time[dele.ativos[k]].hp > 0);
      const id = golpes[m.index].id;
      if (vivos.length > 1 && !DB.ESPALHA?.[id] && DB.MOVES[id]?.stat?.target !== "self") {
        this.menu = { tipo: "alvo", index: 0, golpe: m.index, vivos };
      } else this.escolheuDupla({ tipo: "golpe", i: m.index, alvo: vivos[0] ?? 0 });
      return;
    }
    if (m.tipo === "alvo") {
      if (Input.consume("left") || Input.consume("up") || Input.consume("right") || Input.consume("down")) {
        m.index = 1 - m.index; Audio2.blip();
      }
      if (Input.consume("b")) { this.menu = { tipo: "golpes", index: m.golpe }; return void Audio2.cancel(); }
      if (Input.consume("a")) { Audio2.select(); this.escolheuDupla({ tipo: "golpe", i: m.golpe, alvo: m.vivos[m.index] }); }
      return;
    }
    if (m.tipo === "trocar") {
      const banco = this.bancoDupla();
      if (!banco.length) { this.menu = { tipo: "raiz", index: 0 }; return void this.dlg.say("NÃO TEM MAIS NINGUÉM EM PÉ."); }
      m.index = Math.min(m.index, banco.length - 1);
      lista(banco.length);
      if (Input.consume("b")) { this.menu = { tipo: "raiz", index: 0 }; return void Audio2.cancel(); }
      if (Input.consume("a")) { Audio2.select(); this.escolheuDupla({ tipo: "trocar", i: banco[m.index].i }); }
    }
  }

  /** quem está no banco: de pé, fora das vagas e sem já ter sido chamado */
  bancoDupla() {
    const ativos = this.meuLado()?.ativos || [];
    const chamados = new Set((this.escolhasDupla || []).filter((e) => e.tipo === "trocar").map((e) => e.i));
    return this.meuTime.map((mon, i) => ({ mon, i }))
      .filter(({ mon, i }) => mon.hp > 0 && !ativos.includes(i) && !chamados.has(i));
  }

  /** o turno 2X2, rodado só pelo dono */
  rodaTurnoDupla() {
    const falas = [];
    const a = this.lados.a, b = this.lados.b;
    const acoesDe = (acao) => (acao?.tipo === "dupla" ? acao.acoes || [] : []);
    const vivo = (l, k) => l.ativos[k] != null && !isFainted(l.time[l.ativos[k]]);
    const acabouAlguem = () => {
      for (const [l, outro] of [[a, b], [b, a]]) {
        if (!l.time.some((m) => !isFainted(m))) { this.acabou(outro === a, falas); return true; }
      }
      return false;
    };

    // 1. desistência acaba na hora
    for (const [l, outro, acao] of [[a, b, this.acaoMinha], [b, a, this.acaoDele]]) {
      if (acao?.tipo === "desistir") {
        falas.push(txt("batalhaFugiu", { NOME: l.nome }));
        return this.acabou(outro === a, falas);
      }
    }

    // 2. trocas
    for (const [l, acao] of [[a, this.acaoMinha], [b, this.acaoDele]]) {
      for (const e of acoesDe(acao)) {
        if (e.tipo !== "trocar") continue;
        const k = e.vaga === 1 ? 1 : 0;
        const i = Math.max(0, Math.min(l.time.length - 1, e.i | 0));
        if (isFainted(l.time[i]) || l.ativos.includes(i) || !vivo(l, k)) continue;
        l.ativos[k] = i;
        l.stages[k] = newStages();
        falas.push(`${l.nome} MANDOU ${l.time[i].nickname}!`);
      }
    }

    // 3. golpes: prioridade, velocidade, sorteio
    const golpes = [];
    for (const [l, alvo, acao] of [[a, b, this.acaoMinha], [b, a, this.acaoDele]]) {
      for (const e of acoesDe(acao)) {
        if (e.tipo !== "golpe") continue;
        const k = e.vaga === 1 ? 1 : 0;
        if (!vivo(l, k)) continue;
        const mon = l.time[l.ativos[k]];
        const ref = mon.moves[Math.max(0, Math.min(mon.moves.length - 1, e.i | 0))];
        golpes.push({ l, alvo, k, e, pri: DB.MOVES[ref?.id]?.priority || 0,
          vel: effectiveStat(mon, "spe", l.stages[k]), sorte: Math.random() });
      }
    }
    golpes.sort((x, y) => y.pri - x.pri || y.vel - x.vel || x.sorte - y.sorte);
    for (const g of golpes) {
      if (!vivo(g.l, g.k)) continue;
      this.usaGolpeDupla(g.l, g.alvo, g.k, g.e, falas);
      if (acabouAlguem()) return;
    }

    // 4. queimadura e veneno
    for (const l of [a, b]) {
      for (const k of [0, 1]) {
        if (!vivo(l, k)) continue;
        const mon = l.time[l.ativos[k]];
        const d = statusTickDamage(mon);
        if (!d) continue;
        mon.hp = Math.max(0, mon.hp - d);
        falas.push(`${mon.nickname} SOFRE COM ${mon.status === "envenenado" ? "O VENENO" : "A QUEIMADURA"}!`);
        if (isFainted(mon)) falas.push(`${mon.nickname} DESMAIOU!`);
      }
    }
    if (acabouAlguem()) return;

    // 5. quem caiu dá lugar ao próximo em pé, sozinho
    for (const l of [a, b]) {
      for (const k of [0, 1]) {
        if (vivo(l, k)) continue;
        const prox = l.time.findIndex((m, i) => !isFainted(m) && !l.ativos.includes(i));
        if (prox < 0) { l.ativos[k] = null; continue; }
        l.ativos[k] = prox;
        l.stages[k] = newStages();
        falas.push(`${l.nome} MANDOU ${l.time[prox].nickname}!`);
      }
    }

    this.publicaEstado(falas);
    this.novoTurno();
  }

  usaGolpeDupla(l, alvoLado, k, e, falas) {
    const mon = l.time[l.ativos[k]];
    const ref = mon.moves[Math.max(0, Math.min(mon.moves.length - 1, e.i | 0))];
    if (!ref) return;
    const mv = DB.MOVES[ref.id];
    if (mon.status === "paralisia" && Math.random() < 0.25) {
      return void falas.push(`${mon.nickname} ESTÁ PARALISADO E NÃO CONSEGUE SE MEXER!`);
    }
    if (ref.pp <= 0) return void falas.push(`${mon.nickname} NÃO TEM PP PRA ${mv.name}!`);
    ref.pp = Math.max(0, ref.pp - 1);
    falas.push(`${mon.nickname} USOU ${mv.name}!`);

    if (mv.stat?.target === "self" && !mv.power) {
      for (const f of applyMoveEffects(mv, mon, mon, l.stages[k], l.stages[k]) || []) falas.push(f);
      return;
    }
    // os alvos: um só (o escolhido, ou o outro se ele já caiu) ou todos em volta
    const vivos = (lado) => [0, 1].filter((j) => lado.ativos[j] != null && !isFainted(lado.time[lado.ativos[j]]));
    const esp = DB.ESPALHA?.[ref.id];
    let alvos = [];
    if (esp) {
      alvos = vivos(alvoLado).map((j) => [alvoLado, j]);
      if (esp === "todos") alvos.push(...vivos(l).filter((j) => j !== k).map((j) => [l, j]));
    } else {
      const quer = e.alvo === 1 ? 1 : 0;
      const j = vivos(alvoLado).includes(quer) ? quer : vivos(alvoLado)[0];
      if (j != null) alvos = [[alvoLado, j]];
    }
    if (!alvos.length) return void falas.push("MAS NÃO TINHA NINGUÉM PRA ACERTAR!");
    const varios = alvos.length > 1;
    for (const [lo, j] of alvos) {
      const alvoMon = lo.time[lo.ativos[j]];
      if (!accuracyCheck(ref.id, l.stages[k], lo.stages[j])) {
        falas.push(varios ? `${alvoMon.nickname} DESVIOU!` : "MAS ERROU O ALVO!");
        continue;
      }
      if (mv.power > 0) {
        const r = calcDamage(mon, alvoMon, ref.id, l.stages[k], lo.stages[j]);
        const dano = r.dmg ? Math.max(1, Math.round(r.dmg * (varios ? (DB.FORCA_ESPALHADA ?? 0.75) : 1))) : 0;
        alvoMon.hp = Math.max(0, alvoMon.hp - dano);
        if (r.crit) falas.push("ACERTO CRÍTICO!");
        const t = effText(r.eff);
        if (t) falas.push(varios ? `${alvoMon.nickname}: ${t}` : t);
      }
      for (const f of applyMoveEffects(mv, mon, alvoMon, l.stages[k], lo.stages[j]) || []) falas.push(f);
      if (isFainted(alvoMon)) { falas.push(`${alvoMon.nickname} DESMAIOU!`); Audio2.faint(); }
    }
  }

  renderDupla(ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#7fb0e0");
    g.addColorStop(1, "#d8ecb8");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    const meu = this.meuLado(), dele = this.ladoDele();
    const foto = (lado, k) => (lado?.ativos?.[k] != null ? lado.time[lado.ativos[k]] : null);
    if (dele) [0, 1].forEach((k) => this.desenhaMon(ctx, foto(dele, k), 116 + k * 58, 6 - k * 4, 64, false));
    if (meu) [0, 1].forEach((k) => this.desenhaMon(ctx, foto(meu, k), 0 + k * 56, 46, 64, true));
    const placa = (f, x, y, vez) => {
      if (!f) return;
      panel(ctx, x, y, 104, 18);
      if (vez) { ctx.fillStyle = "#ffd166"; ctx.fillRect(x + 2, y + 2, 2, 14); }
      drawText(ctx, f.nickname.slice(0, 9), x + 6, y + 3, PAL.ink);
      drawText(ctx, `N${f.level}`, x + 78, y + 3, PAL.ink2);
      const pct = Math.max(0, f.hp / Math.max(1, f.maxHp));
      bar(ctx, x + 6, y + 12, 92, 3, pct, hpColor(pct));
    };
    if (dele) [0, 1].forEach((k) => placa(foto(dele, k), 4, 3 + k * 19, false));
    if (meu) [0, 1].forEach((k) => placa(foto(meu, k), 132, 72 + k * 19,
      this.fase === "escolhendo" && this.vagaDaVez === k));
    if (this.menu?.tipo === "alvo" && this.fase === "escolhendo" && Math.floor(Date.now() / 250) % 2 === 0) {
      const k = this.menu.vivos[this.menu.index];
      const cx = 148 + k * 58;
      ctx.fillStyle = "#e0242a";
      ctx.beginPath(); ctx.moveTo(cx - 5, 2); ctx.lineTo(cx + 5, 2); ctx.lineTo(cx, 8); ctx.fill();
    }

    if (this.fase === "escolhendo") this.desenhaMenuDupla(ctx);
    else if (this.fase === "esperando" || this.fase === "juntando") {
      panel(ctx, 2, 110, 236, 26);
      drawText(ctx, this.fase === "juntando" ? "JUNTANDO AS EQUIPES..."
        : txt("batalhaEspera", { NOME: this.parceiro.nome }), 10, 118, PAL.ink);
    }
    this.dlg.render(ctx);
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }

  desenhaMenuDupla(ctx) {
    const m = this.menu;
    const mon = this.monDaVez();
    if (!mon) return;
    panel(ctx, 2, 110, 236, 48);
    if (m.tipo === "raiz") {
      drawText(ctx, `${mon.nickname}:`, 10, 116, PAL.ink);
      drawText(ctx, `${this.escolhasDupla.length + 1}/${this.vagasMinhas.length}`, 10, 140, PAL.ink2);
      ["LUTAR", "TROCAR", "DESISTIR"].forEach((o, i) => {
        drawText(ctx, o, 150, 116 + i * LINE_H, PAL.ink);
        if (i === m.index) cursor(ctx, 142, 116 + i * LINE_H);
      });
      return;
    }
    if (m.tipo === "golpes") {
      (mon.moves || []).forEach((gp, i) => {
        const mv = DB.MOVES[gp.id];
        const x = 8 + (i % 2) * 112, y = 116 + Math.floor(i / 2) * LINE_H;
        drawText(ctx, (mv?.name || gp.id).slice(0, 13), x + 8, y, gp.pp ? PAL.ink : PAL.hpRed);
        if (i === m.index) cursor(ctx, x, y);
      });
      const sel = mon.moves[m.index];
      if (sel) drawText(ctx, `PP ${sel.pp}/${sel.ppMax}${DB.ESPALHA?.[sel.id] ? "  ÁREA" : ""}`, 10, 142, PAL.ink2);
      return;
    }
    if (m.tipo === "alvo") {
      const dele = this.ladoDele();
      const k = m.vivos[m.index];
      drawText(ctx, "EM QUEM?", 10, 118, PAL.ink);
      drawText(ctx, `< ${dele.time[dele.ativos[k]].nickname} >`, 10, 132, PAL.ink);
      return;
    }
    const banco = this.bancoDupla();
    if (!banco.length) return void drawText(ctx, "NINGUÉM EM PÉ.", 18, 116, PAL.ink);
    const ini = Math.max(0, Math.min(banco.length - 3, m.index - 1));
    banco.slice(ini, ini + 3).forEach(({ mon: b }, j) => {
      drawText(ctx, `${b.nickname} Nv${b.level} ${b.hp}/${b.maxHp}`, 18, 116 + j * LINE_H, PAL.ink);
      if (ini + j === m.index) cursor(ctx, 10, 116 + j * LINE_H);
    });
  }
}
