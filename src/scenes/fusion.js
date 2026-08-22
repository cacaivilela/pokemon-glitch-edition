// Tela do DECODIFICADOR DE GENOMA: a fusão e a separação acontecendo.
// Fundir: os dois sprites entram pelos lados, se encontram no meio, clarão, e
// quem sai é um só. Separar é o mesmo filme de trás pra frente.
//
// A mecânica (o que vira o quê) está em src/systems/fusao.js; aqui só tem
// tempo, som e o que a tela mostra. Quem mexe na equipe é esta cena, no
// instante do clarão — antes disso nada foi gravado.
import { DB } from "../data/index.js";
import { Assets } from "../core/assets.js";
import { Audio2 } from "../core/audio.js";
import { Glitch } from "../systems/glitchfx.js";
import { Dialogue } from "../systems/dialogue.js";
import { fundir, separar, partes } from "../systems/fusao.js";
import { guardar } from "../systems/box.js";
import { drawText, fade, PAL } from "../core/gfx.js";

const W = 240, H = 160;
const DUR = 1.5;            // quanto dura o encontro (ou a abertura)
const CENTRO = { x: 120, y: 62 };
const LADO = 64;            // tamanho do sprite na tela
const FITA = "0123456789ABCDEF";

export class FusionScene {
  enter(args = {}) {
    const F = () => DB.STORY.fusao;
    this.modo = args.modo === "separar" ? "separar" : "fundir";
    this.dlg = new Dialogue();
    this.t = 0;
    this.k = 0;               // 0 = separados, 1 = juntos
    this.fase = "texto";
    this.flash = 0;
    this.fadeA = 1;
    this.fadeDir = -1;
    this.saindo = false;

    if (this.modo === "fundir") {
      this.cabeca = args.cabeca;
      this.corpo = args.corpo;
      this.fus = fundir(this.cabeca, this.corpo, args.variante || "");
      if (!this.fus) return void this.desistir(F().naoDaParaFundir);
      this.sp = DB.SPECIES[this.fus.species];
      this.esq = Assets.mon(this.cabeca.species, this.cabeca.seed);
      this.dir = Assets.mon(this.corpo.species, this.corpo.seed);
      this.meio = Assets.mon(this.fus.species, this.fus.seed);
      this.nomes = [this.cabeca.nickname, this.corpo.nickname];
      this.dlg.say(F().fundindo, () => { this.fase = "andando"; });
    } else {
      this.mon = args.mon;
      const p = partes(this.mon?.species);
      this.partido = separar(this.mon);
      if (!p || !this.partido) return void this.desistir(F().naoDaParaFundir);
      this.sp = DB.SPECIES[this.mon.species];
      this.k = 1;
      this.esq = Assets.mon(p.cabeca, this.mon.seed);
      this.dir = Assets.mon(p.corpo, this.mon.seed);
      this.meio = Assets.mon(this.mon.species, this.mon.seed);
      this.nomes = this.partido.map((m) => m.nickname);
      this.dlg.say(F().separando, () => { this.fase = "andando"; });
    }
    Audio2.glitch();
  }

  /** deu ruim antes de começar (dados mudaram no meio): avisa e volta */
  desistir(msg) {
    this.fase = "erro";
    this.dlg.say(msg, () => { this.fadeDir = 1; this.saindo = true; });
  }

  exit() { Glitch.burst = 0; }

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
      return;
    }
    if (this.flash > 0) this.flash = Math.max(0, this.flash - dt * 2.2);

    if (this.fase === "andando") {
      const passo = dt / DUR;
      const antes = this.k;
      this.k = this.modo === "fundir" ? Math.min(1, this.k + passo) : Math.max(0, this.k - passo);
      // a fita corre: um bip a cada oitavo do caminho, cada vez mais agudo
      if (Math.floor(antes * 8) !== Math.floor(this.k * 8)) {
        Audio2.tone(420 + Math.round(this.k * 660), 0.04, "square", 0.45);
        Glitch.hit(0.35);
      }
      if (this.modo === "fundir" ? this.k >= 1 : this.k <= 0) this.concluir();
    }
  }

  /** O clarão: é aqui que a equipe muda. */
  concluir() {
    this.fase = "pronto";
    this.flash = 1;
    Glitch.hit(1.8);
    Audio2.heal();
    const F = DB.STORY.fusao;
    const st = this.game.state;
    const msgs = [];

    if (this.modo === "fundir") {
      const i = st.party.indexOf(this.cabeca);
      const j = st.party.indexOf(this.corpo);
      const lugar = Math.min(i, j);
      st.party.splice(Math.max(i, j), 1);
      st.party.splice(lugar, 1);
      st.party.splice(lugar, 0, this.fus);
      msgs.push(F.fundiu
        .replace("{CABECA}", this.nomes[0]).replace("{CORPO}", this.nomes[1])
        .replace("{NOME}", this.fus.nickname));
    } else {
      const [cabeca, corpo] = this.partido;
      const i = st.party.indexOf(this.mon);
      st.party.splice(i, 1, cabeca);
      msgs.push(F.separou
        .replace("{NOME}", this.mon.nickname)
        .replace("{CABECA}", cabeca.nickname).replace("{CORPO}", corpo.nickname));
      if (st.party.length < 6) {
        st.party.splice(i + 1, 0, corpo);
      } else {
        // PC lotado também: ele fica na sobra, esperando vaga (ver box.js)
        if (!guardar(st, corpo)) (st.box ||= []).push(corpo);
        msgs.push(F.foiProBox.replace("{MON}", corpo.nickname));
      }
    }
    this.game.autosave?.(true);
    this.dlg.say(msgs, () => { this.fadeDir = 1; this.saindo = true; });
  }

  /** a fita de código que corre atrás dos sprites */
  desenhaFita(ctx) {
    const y = CENTRO.y + 40;
    ctx.fillStyle = "#0a0614";
    ctx.fillRect(0, y, W, 10);
    const desl = Math.floor(this.t * 60) % 6;
    let linha = "";
    for (let i = 0; i < 40; i++) {
      const n = (i * 7 + Math.floor(this.t * 12) + Math.floor(this.k * 40)) % 16;
      linha += FITA[n];
    }
    drawText(ctx, linha.slice(0, 39), 4 - desl, y + 2, "#00ffcc");
  }

  render(ctx) {
    ctx.fillStyle = "#120a20";
    ctx.fillRect(0, 0, W, H);

    // brilho no ponto de encontro
    const raio = 40 + Math.sin(this.t * 4) * 3 + this.k * 12;
    const g = ctx.createRadialGradient(CENTRO.x, CENTRO.y, 4, CENTRO.x, CENTRO.y, raio);
    g.addColorStop(0, `rgba(180,85,255,${0.25 + this.k * 0.4})`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(CENTRO.x - raio, CENTRO.y - raio, raio * 2, raio * 2);

    this.desenhaFita(ctx);

    const F = DB.STORY.fusao;
    drawText(ctx, F.titulo, 8, 8, PAL.glitch);
    if (this.sp) {
      drawText(ctx, (F.ajudaCatalogo || "")
        .replace("{TOTAL}", String(DB.FUSAO?.combinacoes ?? ""))
        .replace("{CODIGO}", this.sp.codigo || "0x0000"), 8, 18, PAL.ink2);
    }

    if (this.fase === "erro") { this.dlg.render(ctx); if (this.fadeA > 0) fade(ctx, this.fadeA); return; }

    const junto = this.fase === "pronto";
    if (junto) {
      const img = this.modo === "fundir" ? this.meio : null;
      if (img) ctx.drawImage(img, CENTRO.x - LADO / 2, CENTRO.y - LADO / 2, LADO, LADO);
    }
    if (!junto || this.modo === "separar") {
      // os dois lados: longe no começo, colados no fim (a separação é o inverso)
      const dist = Math.round((1 - this.k) * 44);
      const esc = 1 - this.k * 0.12;
      const lado = LADO * esc;
      const dy = CENTRO.y - lado / 2;
      const arte = (img) => (junto || this.k < 0.85 ? img : Assets.silhueta(img));
      ctx.drawImage(arte(this.esq), Math.round(CENTRO.x - dist - lado / 2), dy, lado, lado);
      ctx.drawImage(arte(this.dir), Math.round(CENTRO.x + dist - lado / 2), dy, lado, lado);
    }
    if (!junto && this.modo === "fundir" && this.k > 0.85) {
      // no último instante o resultado já aparece por trás, como silhueta
      const s = Assets.silhueta(this.meio);
      ctx.globalAlpha = (this.k - 0.85) / 0.15;
      ctx.drawImage(s, CENTRO.x - LADO / 2, CENTRO.y - LADO / 2, LADO, LADO);
      ctx.globalAlpha = 1;
    }

    const nome = junto && this.modo === "fundir" ? this.fus.nickname
      : junto ? this.nomes.join(" + ")
      : `${this.nomes[0]} + ${this.nomes[1]}`;
    drawText(ctx, nome, Math.round(W / 2 - nome.length * 3), 104, PAL.paper);

    this.dlg.render(ctx);
    if (this.flash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${Math.min(1, this.flash)})`;
      ctx.fillRect(0, 0, W, H);
    }
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }
}
