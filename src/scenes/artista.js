// A ARTISTA TRABALHANDO — a tela onde a máquina desenha sozinha.
//
// Ela escolhe uma dupla, desenha, escreve a ficha e publica no SEU aparelho.
// Depois começa outra. Enquanto isso você fica olhando: dá pra ver a dupla que
// ela pegou, o bicho aparecendo, o temperamento que ela deu e a nota que ela
// mesma se deu. `X` para quando quiser — ela termina o que está fazendo e sai.
//
// As contas e o desenho estão em src/systems/artista.js; aqui é o tempo e o
// que a tela mostra.
import { DB } from "../data/index.js";
import { Assets } from "../core/assets.js";
import { Audio2 } from "../core/audio.js";
import { Input } from "../core/input.js";
import { Save } from "../core/save.js";
import { Glitch } from "../systems/glitchfx.js";
import { Dialogue } from "../systems/dialogue.js";
import { criar, nota, ASSINATURA } from "../systems/artista.js";
import { publicarFicha, montarEspecie } from "../systems/fusao.js";
import { panel, drawText, fade, PAL } from "../core/gfx.js";

const W = 240, H = 160;
const PINTANDO = 1.6;      // quanto tempo o desenho leva pra aparecer
const MOSTRANDO = 2.2;     // quanto tempo a ficha fica na tela antes da próxima

export class ArtistaScene {
  enter() {
    this.dlg = new Dialogue();
    this.t = 0;
    this.fadeA = 1;
    this.fadeDir = -1;
    this.saindo = false;
    this.feitas = 0;
    this.falhou = null;
    this.fase = "abrindo";
    this.obra = null;
    this.fT = 0;
    this.pedirParar = false;
    Audio2.stopLoop();
    const A = DB.STORY.artista;
    this.dlg.say(Save.offline() ? A.semServidor : A.abertura, () => {
      if (Save.offline()) { this.fadeDir = 1; this.saindo = true; return; }
      this.proxima();
    });
  }

  exit() { Glitch.burst = 0; }

  /** Começa uma obra nova: escolhe a dupla e já deixa o desenho pronto — o que
   *  a tela mostra depois é ele aparecendo aos poucos. */
  proxima() {
    const A = DB.STORY.artista;
    if (this.pedirParar) return this.terminar();
    const obra = criar(this.game.state);
    if (!obra) {
      this.falhou = A.semDupla;
      return this.terminar();
    }
    this.obra = obra;
    this.obra.nota = nota(obra.sp);
    this.fase = "pintando";
    this.fT = 0;
    Audio2.tone(300 + Math.random() * 200, 0.05, "square", 0.35);
  }

  /** Desenhou: escreve a ficha, publica no aparelho e mostra o resultado. */
  async publicar() {
    const A = DB.STORY.artista;
    this.fase = "mostrando";
    this.fT = 0;
    const o = this.obra;
    const r = await publicarFicha(o.cabeca, o.corpo, o.ficha, ASSINATURA);
    if (!r.ok) {
      this.falhou = A.naoPublicou;
      return this.terminar();
    }
    this.feitas++;
    Audio2.heal();
    Glitch.hit(0.5);
    // a espécie passa a valer na hora, com o desenho dela
    const sp = montarEspecie(o.cabeca, o.corpo, o.ficha.id || "");
    if (sp) DB.SPECIES[sp.id] = sp;
  }

  terminar() {
    const A = DB.STORY.artista;
    this.fase = "fim";
    const msg = this.falhou ? [this.falhou] : [A.parou.replace("{N}", this.feitas)];
    if (!this.falhou && this.feitas) msg.push(A.ondeEstao);
    this.dlg.say(msg, () => { this.fadeDir = 1; this.saindo = true; });
  }

  update(dt) {
    this.t += dt;
    const ocupado = this.dlg.update(dt);
    if (this.fadeDir) {
      this.fadeA = Math.max(0, Math.min(1, this.fadeA + this.fadeDir * dt * 3));
      if (this.fadeDir < 0 && this.fadeA <= 0) this.fadeDir = 0;
    }
    if (this.saindo && this.fadeA >= 1) {
      this.saindo = false;
      this.game.autosave?.(true);
      this.game.scenes.pop();
      return;
    }
    if (ocupado) return;

    // X pede pra parar: ela termina o que está na bancada e vai embora
    if (Input.consume("b") && this.fase !== "fim") {
      this.pedirParar = true;
      Audio2.cancel();
      if (this.fase === "mostrando" || this.fase === "abrindo") return this.terminar();
    }

    this.fT += dt;
    if (this.fase === "pintando") {
      if (Math.floor(this.fT * 12) !== Math.floor((this.fT - dt) * 12)) {
        Audio2.tone(520 + Math.random() * 500, 0.02, "square", 0.18);   // o risco do lápis
      }
      if (this.fT >= PINTANDO) this.publicar();
    } else if (this.fase === "mostrando" && this.fT >= MOSTRANDO) {
      this.proxima();
    }
  }

  render(ctx) {
    ctx.fillStyle = "#0e0b18";
    ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 30; i++) {          // poeira de grafite no ar
      const x = (i * 37 + this.t * 9) % 250 - 5;
      const y = (i * 53) % 150;
      ctx.fillStyle = i % 5 ? "#1a1630" : "#2a2350";
      ctx.fillRect(x | 0, y | 0, 1, 1);
    }
    const A = DB.STORY.artista;
    drawText(ctx, A.titulo, 6, 6, PAL.glitch);
    drawText(ctx, `${this.feitas}`, 224, 6, "#00ffcc");

    const o = this.obra;
    if (o) {
      // os dois que entraram, pequenos, nos cantos de cima
      ctx.drawImage(Assets.mon(o.cabeca, 7), 8, 18, 32, 32);
      ctx.drawImage(Assets.mon(o.corpo, 7), 200, 18, 32, 32);
      drawText(ctx, DB.SPECIES[o.cabeca].name.slice(0, 8), 6, 52, PAL.ink2);
      drawText(ctx, DB.SPECIES[o.corpo].name.slice(0, 8), 198, 52, PAL.ink2);

      // o desenho aparecendo: de cima pra baixo, como quem pinta
      const k = this.fase === "pintando" ? Math.min(1, this.fT / PINTANDO) : 1;
      const lado = 72;
      const x = W / 2 - lado / 2, y = 22;
      ctx.fillStyle = "#0a0614";
      ctx.fillRect(x - 1, y - 1, lado + 2, lado + 2);
      const alturaVisivel = Math.max(1, Math.round(o.canvas.height * k));
      ctx.drawImage(o.canvas, 0, 0, o.canvas.width, alturaVisivel,
                    x, y, lado, Math.round(lado * k));
      if (k < 1) {                       // a linha do lápis, andando pra baixo
        ctx.fillStyle = "#00ffcc";
        ctx.fillRect(x, y + Math.round(lado * k), lado, 1);
      }

      if (this.fase !== "pintando") {
        panel(ctx, 4, 100, W - 8, 44);
        drawText(ctx, o.ficha.nome, 12, 106, PAL.glitch);
        drawText(ctx, o.ficha.tipos.join("/"), 12, 118, PAL.ink2);
        drawText(ctx, o.ficha.temperamento?.nome || "", 12, 130, PAL.ink);
        drawText(ctx, `NOTA ${o.nota.toFixed(1)}`, 150, 106, PAL.ink2);
        drawText(ctx, A.publicada, 150, 118, "#59d99b");
        drawText(ctx, ASSINATURA, 150, 130, PAL.ink2);
      }
    }

    if (this.fase === "pintando") drawText(ctx, A.pintando, 6, H - 12, PAL.ink2);
    else if (this.fase !== "fim") drawText(ctx, A.ajuda, 6, H - 12, PAL.ink2);

    this.dlg.render(ctx);
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }
}
