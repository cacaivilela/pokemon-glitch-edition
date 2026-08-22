// A tela do CONCURSO DE FUSÃO de Cinnabar: o palco, os três cientistas e as
// notas saindo uma a uma.
//
// A dupla NÃO é fundida de verdade — a máquina do concurso lê os dois, mostra
// o que sairia e devolve. Quem entra com uma fusão pronta mostra ela mesma.
// As contas estão em src/systems/concurso.js; jurados, rivais e prêmios em
// src/data/concurso.js.
import { DB } from "../data/index.js";
import { Assets } from "../core/assets.js";
import { Audio2 } from "../core/audio.js";
import { Glitch } from "../systems/glitchfx.js";
import { Dialogue } from "../systems/dialogue.js";
import { julgar, rodada, premio, faixa } from "../systems/concurso.js";
import { panel, drawText, fade, PAL, LINE_H } from "../core/gfx.js";

const W = 240, H = 160;
const PALCO = { x: 120, y: 58 };

export class ConcursoScene {
  enter(args = {}) {
    const C = DB.CONCURSO;
    this.dlg = new Dialogue();
    this.t = 0;
    this.fadeA = 1;
    this.fadeDir = -1;
    this.saindo = false;
    this.notasNaTela = [];        // as notas já anunciadas da entrada atual

    const j = julgar(args.cabeca, args.corpo, args.variante || "");
    if (!j) {
      this.erro = true;
      return void this.dlg.say(DB.STORY.fusao.naoDaParaFundir, () => this.game.scenes.pop());
    }
    this.minha = {
      ...j,
      dono: this.game.state.player?.name || "VOCÊ",
      sprite: "hero",
      cabeca: args.cabeca,
      corpo: args.corpo,
      variante: args.variante || "",
    };
    const r = rodada(this.game.state, this.minha);
    this.entradas = r.entradas;
    this.ordem = r.ordem;
    this.colocacao = r.colocacao;
    this.i = 0;                   // entrada no palco
    this.fase = "abre";
    Audio2.stopLoop();
    this.game.music?.("gym");
    this.dlg.say(C.texto.comeca, () => this.apresentar());
  }

  exit() { Glitch.burst = 0; }

  get atual() { return this.entradas[this.i]; }

  /** Uma entrada sobe no palco. */
  apresentar() {
    const C = DB.CONCURSO;
    const e = this.atual;
    if (!e) return this.resultado();
    this.fase = "palco";
    this.notasNaTela = [];
    this.jurado = 0;
    const fala = (e === this.minha ? C.texto.suaVez : C.texto.entra)
      .replace("{DONO}", e.dono).replace("{NOME}", e.sp.name);
    Audio2.select();
    this.dlg.say(fala, () => this.julgarProximo());
  }

  /** Um jurado por vez: comentário + nota. */
  julgarProximo() {
    const C = DB.CONCURSO;
    const jurados = C.jurados;
    if (this.jurado >= jurados.length) {
      const e = this.atual;
      return void this.dlg.say(C.texto.notaFinal.replace("{TOTAL}", e.total.toFixed(1)), () => {
        this.i++;
        this.apresentar();
      });
    }
    const jur = jurados[this.jurado];
    const nota = this.atual.notas[jur.criterio];
    const falas = jur.fala[faixa(nota)] || [];
    const frase = falas[Math.floor(Math.random() * falas.length)] || "...";
    this.jurado++;
    this.notasNaTela.push({ jurado: jur, nota });
    Audio2.tone(520 + nota * 40, 0.06, "square", 0.5);
    this.dlg.say(`${jur.nome}: ${frase}`, () => this.dlg.say(`${jur.titulo}: ${nota.toFixed(1)}`, () => this.julgarProximo()));
  }

  /** O quadro final e o prêmio. */
  resultado() {
    const C = DB.CONCURSO;
    const st = this.game.state;
    this.fase = "resultado";
    const p = premio(st, this.colocacao);
    const msgs = [p.fala];
    st.money = Math.min(999999, (st.money || 0) + (p.dinheiro || 0));
    msgs.push(C.texto.ganhou.replace("{DINHEIRO}", p.dinheiro || 0));
    if (p.item) {
      st.items[p.item] = Math.min(999, (st.items[p.item] || 0) + (p.qtd || 1));
      msgs.push(C.texto.ganhouItem.replace("{QTD}", p.qtd || 1).replace("{ITEM}", p.item.toUpperCase()));
    }
    if (this.colocacao === 1) st.flags.concursoOuro = true;
    const antes = st.flags.concursoRecorde || 0;
    if (this.minha.total > antes) {
      st.flags.concursoRecorde = this.minha.total;
      msgs.push(C.texto.novoRecorde.replace("{N}", this.minha.total.toFixed(1)));
    } else {
      msgs.push(C.texto.recorde.replace("{N}", antes.toFixed(1)));
    }
    msgs.push(C.texto.devolve);
    Audio2.heal();
    Glitch.hit(0.6);
    this.game.autosave?.(true);
    this.dlg.say(msgs, () => { this.fadeDir = 1; this.saindo = true; });
  }

  update(dt) {
    this.t += dt;
    this.dlg.update(dt);
    if (this.fadeDir) {
      this.fadeA = Math.max(0, Math.min(1, this.fadeA + this.fadeDir * dt * 3));
      if (this.fadeDir < 0 && this.fadeA <= 0) this.fadeDir = 0;
    }
    if (this.saindo && this.fadeA >= 1) {
      this.saindo = false;
      this.game.scenes.pop();
    }
  }

  render(ctx) {
    // o palco: a ilha do vulcão à noite
    ctx.fillStyle = "#1a0f18";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#2a1420";
    ctx.fillRect(0, 96, W, H - 96);
    ctx.fillStyle = "#3a1c26";
    ctx.fillRect(0, 94, W, 2);
    const brilho = 30 + Math.sin(this.t * 2) * 4;
    const g = ctx.createRadialGradient(PALCO.x, PALCO.y, 6, PALCO.x, PALCO.y, brilho + 40);
    g.addColorStop(0, "rgba(255,180,120,.35)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, 110);

    if (this.erro) return void this.dlg.render(ctx);

    drawText(ctx, DB.CONCURSO.nome, 6, 6, "#ffd166");
    if (this.fase === "resultado") return this.renderResultado(ctx);

    const e = this.atual;
    if (e) {
      const img = Assets.mon(e.sp.id, 7);
      const lado = 64 + Math.sin(this.t * 3) * 2;
      ctx.drawImage(img, Math.round(PALCO.x - lado / 2), Math.round(PALCO.y - lado / 2), lado, lado);
      const nome = `${e.sp.name} (${e.dono})`;
      panel(ctx, 4, 18, Math.min(W - 8, nome.length * 6 + 14), 18);
      drawText(ctx, nome, 12, 24, e === this.minha ? PAL.glitch : PAL.ink);
    }

    // os três cientistas na frente do palco, com a nota que já deram
    DB.CONCURSO.jurados.forEach((jur, i) => {
      const x = 34 + i * 62, y = 108;
      const arte = Assets.actor(jur.sprite)?.up?.[0];
      if (arte) ctx.drawImage(arte, x, y, 16, 16);
      const dada = this.notasNaTela.find((n) => n.jurado.id === jur.id);
      drawText(ctx, jur.titulo.slice(0, 8), x - 10, y + 18, PAL.ink2);
      drawText(ctx, dada ? dada.nota.toFixed(1) : "-", x + 20, y + 4, dada ? "#ffd166" : PAL.ink2);
    });

    this.dlg.render(ctx);
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }

  renderResultado(ctx) {
    const C = DB.CONCURSO;
    panel(ctx, 4, 16, W - 8, 108);
    drawText(ctx, C.texto.resultado, 12, 22, PAL.ink);
    this.ordem.forEach((e, i) => {
      const y = 36 + i * (LINE_H + 2);
      if (y > 112) return;
      const meu = e === this.minha;
      drawText(ctx, `${i + 1}º`, 14, y, meu ? PAL.glitch : PAL.ink2);
      drawText(ctx, e.sp.name.slice(0, 11), 32, y, meu ? PAL.glitch : PAL.ink);
      drawText(ctx, e.dono.slice(0, 12), 106, y, PAL.ink2);
      drawText(ctx, e.total.toFixed(1), 200, y, meu ? "#ffd166" : PAL.ink2);
    });
    this.dlg.render(ctx);
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }
}
