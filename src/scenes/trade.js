// Troca de Pokémon entre dois jogadores da sala.
//
// O combinado é simétrico — não existe "dono" aqui, os dois lados rodam o mesmo
// código e o mesmo passo a passo:
//
//   1. cada um escolhe um Pokémon      -> trocaOferta {mon}
//   2. os dois veem as duas ofertas    -> trocaPronto  quando confirma
//   3. quem já mandou o PRONTO e recebeu o PRONTO do outro faz a troca
//
// O passo 3 é o delicado: se a conexão cair exatamente entre um PRONTO e o
// outro, um lado podia trocar e o outro não. Por isso a troca só acontece
// depois que os DOIS prontos estão na mesa, e quem sai antes disso cancela pros
// dois lados (`trocaCancela`). Depois de trocar, o save é gravado na hora.
//
// Nada do que chega da rede entra no save sem passar por `Online.sanea`.
import { DB } from "../data/index.js";
import { Input } from "../core/input.js";
import { Net } from "../core/net.js";
import { Audio2 } from "../core/audio.js";
import { Assets } from "../core/assets.js";
import { Online } from "../systems/online.js";
import { Dialogue } from "../systems/dialogue.js";
import { panel, drawText, cursor, fade, PAL, LINE_H } from "../core/gfx.js";

const W = 240, H = 160;
const txt = (k, vars = {}) =>
  String(DB.ONLINE_TEXTO?.[k] || k).replace(/\{(\w+)\}/g, (m, n) => vars[n] ?? m);

export class TradeScene {
  enter(args = {}) {
    this.parceiro = { id: args.id, nome: args.nome || "?" };
    this.dlg = new Dialogue();
    this.fase = "escolher";      // escolher | esperando | confirmar | trocando | fim
    this.index = 0;
    this.meu = null;             // índice na equipe do que eu ofereci
    this.minhaOferta = null;
    this.oferta = null;          // o que ele ofereceu (já saneado)
    this.euPronto = false;
    this.elePronto = false;
    this.t = 0;
    this.fadeA = 1;
    this.fadeDir = -1;

    this.desinscreve = [
      Online.on("troca", (m) => this.recebeu(m)),
      Online.on("parceiroSumiu", () => this.aborta(txt("sumiu", { NOME: this.parceiro.nome }))),
    ];
    Audio2.stopLoop();
    this.dlg.say(`TROCA COM ${this.parceiro.nome}. ESCOLHA QUEM VAI.`);
  }

  exit() {
    this.desinscreve.forEach((f) => f());
    Online.liberar();
  }

  get st() { return this.game.state; }

  // ------------------------------------------------------------ mensagens
  recebeu(m) {
    if (m.de !== this.parceiro.id) return;
    if (m.tipo === "trocaOferta") {
      const mon = Online.sanea(m.mon);
      if (!mon) return void this.aborta("O QUE VEIO DO OUTRO LADO NÃO FAZ SENTIDO.");
      this.oferta = mon;
      this.elePronto = false;
      this.confere();
      return;
    }
    if (m.tipo === "trocaPronto") {
      this.elePronto = true;
      this.confere();
      return;
    }
    if (m.tipo === "trocaCancela") {
      this.aborta(txt("trocaCancelou", { NOME: this.parceiro.nome }));
    }
  }

  /** os dois ofereceram e os dois confirmaram? então troca. */
  confere() {
    if (this.fase === "trocando" || this.fase === "fim") return;
    if (this.minhaOferta && this.oferta) this.fase = this.euPronto ? this.fase : "confirmar";
    if (this.euPronto && this.elePronto && this.minhaOferta && this.oferta) this.efetiva();
  }

  aborta(motivo) {
    if (this.fase === "fim") return;
    this.fase = "fim";
    this.dlg.say(motivo, () => this.game.scenes.pop());
  }

  // --------------------------------------------------------------- troca
  efetiva() {
    this.fase = "trocando";
    this.t = 0;
    Audio2.select();
    const entrando = this.oferta;
    const saindo = this.st.party[this.meu];
    // segurança: se a equipe mudou embaixo do pano, cai fora sem estragar nada
    if (!saindo || saindo !== this.minhaOfertaRef) return void this.aborta("A EQUIPE MUDOU. TROCA CANCELADA.");
    this.st.party[this.meu] = entrando;
    this.recebido = entrando;
    this.mandado = saindo;
    this.game.save?.();
  }

  // --------------------------------------------------------------- update
  update(dt) {
    this.t += dt;
    if (this.fadeDir) {
      this.fadeA += this.fadeDir * dt * 3.2;
      if (this.fadeA <= 0) { this.fadeA = 0; this.fadeDir = 0; }
    }
    if (this.dlg.update(dt)) return;

    if (this.fase === "trocando") {
      if (this.t > 2.4) {
        this.fase = "fim";
        this.dlg.say([
          `${this.mandado.nickname} FOI PRA ${this.parceiro.nome}.`,
          `${this.recebido.nickname} CHEGOU! ${txt("trocaFeita")}`,
        ], () => this.game.scenes.pop());
      }
      return;
    }
    if (this.fase === "fim") return;

    if (Input.consume("b")) return void this.cancela();

    if (this.fase === "escolher") {
      const n = this.st.party.length;
      if (Input.consume("up")) { this.index = (this.index + n - 1) % n; Audio2.blip(); }
      if (Input.consume("down")) { this.index = (this.index + 1) % n; Audio2.blip(); }
      if (Input.consume("a")) {
        if (n < 2) return void this.dlg.say(txt("trocaUltimo"));
        Audio2.select();
        this.meu = this.index;
        this.minhaOfertaRef = this.st.party[this.index];
        this.minhaOferta = Online.empacota(this.minhaOfertaRef);
        this.fase = this.oferta ? "confirmar" : "esperando";
        this.mandaOferta();
      }
      return;
    }

    if (this.fase === "confirmar" && Input.consume("a")) {
      Audio2.select();
      this.euPronto = true;
      this.manda("trocaPronto", {});
      this.confere();
    }
  }

  mandaOferta() { this.manda("trocaOferta", { mon: this.minhaOferta }); }

  manda(tipo, dados) { Net.manda(tipo, dados, this.parceiro.id); }

  cancela() {
    this.manda("trocaCancela", {});
    this.aborta("VOCÊ CANCELOU A TROCA.");
  }

  // --------------------------------------------------------------- render
  render(ctx) {
    ctx.fillStyle = "#101828";
    ctx.fillRect(0, 0, W, H);
    drawText(ctx, `TROCA - ${this.parceiro.nome}`, 8, 6, PAL.paper);

    if (this.fase === "escolher") {
      const lista = this.st.party.map((m) => `${m.nickname} Nv${m.level}`);
      panel(ctx, 6, 20, 120, lista.length * LINE_H + 8);
      lista.forEach((l, i) => {
        drawText(ctx, l, 18, 24 + i * LINE_H, PAL.ink);
        if (i === this.index) cursor(ctx, 11, 24 + i * LINE_H);
      });
      const m = this.st.party[this.index];
      if (m) ctx.drawImage(Assets.mon(m.species, m.seed), 150, 30, 64, 64);
    } else {
      this.lado(ctx, 18, this.mostrarMeu(), "VOCÊ", this.euPronto);
      this.lado(ctx, 140, this.mostrarDele(), this.parceiro.nome, this.elePronto);
      if (this.fase === "trocando") this.animacao(ctx);
    }

    if (this.fase === "esperando") {
      drawText(ctx, txt("trocaEspera", { NOME: this.parceiro.nome }), 8, 100, PAL.paper);
    } else if (this.fase === "confirmar") {
      drawText(ctx, this.euPronto ? "ESPERANDO O OUTRO LADO..." : "Z CONFIRMA - X CANCELA", 8, 100, PAL.paper);
    }
    if (this.fadeA > 0) fade(ctx, this.fadeA);
    this.dlg.render(ctx);
  }

  mostrarMeu() {
    // durante a animação a equipe JÁ trocou: mostro o que saiu até a metade
    if (this.fase === "trocando") return this.t > 1.2 ? this.recebido : this.mandado;
    return this.st.party[this.meu] || null;
  }

  mostrarDele() {
    if (this.fase === "trocando") return this.t > 1.2 ? this.mandado : this.oferta;
    return this.oferta;
  }

  lado(ctx, x, mon, quem, pronto) {
    panel(ctx, x - 12, 20, 96, 76);
    drawText(ctx, quem, x - 4, 24, PAL.ink2);
    if (!mon) {
      drawText(ctx, "...", x - 4, 50, PAL.ink2);
      return;
    }
    ctx.drawImage(Assets.mon(mon.species, mon.seed), x - 4, 34, 48, 48);
    drawText(ctx, mon.nickname, x - 4, 84, PAL.ink);
    drawText(ctx, `Nv${mon.level}`, x + 52, 84, PAL.ink2);
    if (pronto) drawText(ctx, "PRONTO", x + 30, 24, PAL.hpGreen);
  }

  /** os dois atravessando a tela: bolinha de luz indo e vindo */
  animacao(ctx) {
    const k = Math.min(1, this.t / 1.2);
    const y = 56;
    for (const [dir, cor] of [[1, "#b455ff"], [-1, "#00ffcc"]]) {
      const x = dir > 0 ? 40 + k * 150 : 190 - k * 150;
      ctx.fillStyle = cor;
      ctx.fillRect(x - 3, y - 3 + dir * 10, 6, 6);
      ctx.globalAlpha = 0.4;
      ctx.fillRect(x - 8, y - 1 + dir * 10, 10, 2);
      ctx.globalAlpha = 1;
    }
    if (this.t > 1.1 && this.t < 1.3) fade(ctx, 1 - Math.abs(this.t - 1.2) * 10, "#ffffff");
  }
}
