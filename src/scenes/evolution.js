// Tela de evolução. Sai da batalha, entra aqui: fundo escuro, as duas formas
// piscando uma na outra cada vez mais rápido, clarão e o nome novo.
import { DB } from "../data/index.js";
import { Assets } from "../core/assets.js";
import { Audio2 } from "../core/audio.js";
import { Glitch } from "../systems/glitchfx.js";
import { Dialogue } from "../systems/dialogue.js";
import { evolveTo } from "../systems/mon.js";
import { drawText, fade, PAL } from "../core/gfx.js";

const W = 240, H = 160;
const TROCA_INICIO = 0.42;   // intervalo entre as trocas, no começo
const TROCA_FIM = 0.055;     // ...e no fim, quando já está frenético
const TROCAS = 14;           // quantas trocas até o clarão

export class EvolutionScene {
  enter(args = {}) {
    const { mon, to, estranho = false } = args;
    this.mon = mon;
    this.to = to;
    this.estranho = estranho;                       // pedra da fenda: evolução torta
    this.velho = Assets.mon(mon.species, mon.seed);
    this.novo = Assets.mon(to, mon.seed);
    this.nomeVelho = DB.SPECIES[mon.species].name;
    this.nomeNovo = DB.SPECIES[to].name;
    this.dlg = new Dialogue();
    this.t = 0;
    this.fase = "chegando";
    this.trocas = 0;
    this.proxima = TROCA_INICIO;
    this.acumulado = 0;
    this.mostraNovo = false;
    this.flash = 0;
    this.fadeA = 1;
    this.fadeDir = -1;
    Audio2.stopLoop();
    this.dlg.say(`O QUÊ? ${this.mon.nickname} ESTÁ EVOLUINDO!`, () => { this.fase = "trocando"; });
  }

  exit() { Glitch.burst = 0; }

  /** intervalo atual: encurta a cada troca (a evolução "acelera") */
  get intervalo() {
    const k = this.trocas / TROCAS;
    return TROCA_INICIO + (TROCA_FIM - TROCA_INICIO) * k;
  }

  update(dt) {
    this.t += dt;
    if (this.fadeDir) {
      this.fadeA = Math.max(0, Math.min(1, this.fadeA + this.fadeDir * dt * 3));
      if (this.fadeDir < 0 && this.fadeA <= 0) this.fadeDir = 0;
    }
    this.dlg.update(dt);
    if (this.saindo && this.fadeA >= 1) {
      this.saindo = false;
      this.game.scenes.pop();
      return;
    }
    if (this.flash > 0) this.flash = Math.max(0, this.flash - dt * 2.2);

    if (this.fase === "trocando") {
      this.acumulado += dt;
      if (this.acumulado >= this.proxima) {
        this.acumulado = 0;
        this.trocas++;
        this.mostraNovo = !this.mostraNovo;
        this.proxima = this.intervalo;
        Audio2.tone(this.mostraNovo ? 880 : 660, 0.04, "square", 0.5);
        if (this.estranho) Glitch.hit(0.6);
        if (this.trocas >= TROCAS) this.concluir();
      }
    }
  }

  /** aplica a evolução de verdade e anuncia */
  concluir() {
    this.fase = "pronto";
    this.mostraNovo = true;
    this.flash = 1;
    const st = this.game.state;
    const evo = evolveTo(this.mon, this.to);
    if (evo) {
      st.seen[this.mon.species] = true;
      st.caught[this.mon.species] = true;
    }
    Glitch.hit(this.estranho ? 2.4 : 1.2);
    Audio2.heal();
    this.game.autosave?.(true);
    this.dlg.say(`PARABÉNS! SEU ${this.nomeVelho} EVOLUIU PARA ${this.nomeNovo}!`, () => {
      this.fadeDir = 1;
      this.saindo = true;
    });
  }

  render(ctx) {
    ctx.fillStyle = this.estranho ? "#160a24" : "#101018";
    ctx.fillRect(0, 0, W, H);

    // brilho atrás do sprite, girando devagar
    const raio = 46 + Math.sin(this.t * 3) * 3;
    const g = ctx.createRadialGradient(W / 2, 62, 4, W / 2, 62, raio);
    g.addColorStop(0, this.estranho ? "rgba(180,85,255,.55)" : "rgba(255,255,255,.35)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(W / 2 - raio, 62 - raio, raio * 2, raio * 2);

    const img = this.mostraNovo ? this.novo : this.velho;
    // enquanto troca, as duas formas aparecem como silhueta; no fim, colorida
    const arte = this.fase === "pronto" ? img : Assets.silhueta(img);
    // a forma nova entra crescendo, a velha sai encolhendo
    const k = this.fase === "trocando" ? this.trocas / TROCAS : 1;
    const esc = this.fase === "pronto" ? 1 : (this.mostraNovo ? 0.8 + 0.2 * k : 1 - 0.2 * k);
    const lado = 64 * esc;
    ctx.drawImage(arte, Math.round(W / 2 - lado / 2), Math.round(62 - lado / 2), lado, lado);

    if (this.fase === "pronto") {
      drawText(ctx, this.nomeNovo, W / 2 - this.nomeNovo.length * 3, 102, PAL.ink);
    }

    this.dlg.render(ctx);

    if (this.flash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${Math.min(1, this.flash)})`;
      ctx.fillRect(0, 0, W, H);
    }
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }
}
