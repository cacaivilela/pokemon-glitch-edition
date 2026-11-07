// A FALA DO PROF. CARVALHO, no jogo novo de KANTO — a do FireRed: ele se
// apresenta, um PIKACHU aparece, ele conta dos Pokémon, pergunta o SEU nome,
// mostra o neto (o rival) e pergunta o dele, e no fim você encolhe e acorda no
// seu QUARTO. A música é a dele no FireRed (`frIntroCarvalho`).
//
//   game.scenes.replace(new IntroCarvalhoScene(), { onDone })
import { DB } from "../data/index.js";
import { Assets } from "../core/assets.js";
import { trainerArt } from "../core/sprites.js";
import { Input, Texto } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { drawText, panel, fade, PAL } from "../core/gfx.js";
import { Dialogue, setTextVars } from "../systems/dialogue.js";

const W = 240, H = 160;
const NOME_MAX = 10;

/** As falas, uma "cena" de cada vez: quem está na tela e o que ele diz.
 *  `digita`: no fim das falas, pede um nome ("eu" ou "rival"). */
const CENAS = [
  { arte: "prof", fala: [
    "OLÁ! QUE BOM TE CONHECER!",
    "BEM-VINDO AO MUNDO DOS POKÉMON!",
    "MEU NOME É CARVALHO. MAS TODO MUNDO ME CHAMA DE PROFESSOR POKÉMON.",
  ] },
  { arte: "prof", bicho: "pikachu", fala: [
    "ESTE MUNDO...",
    "...É CHEIO DE CRIATURAS CHAMADAS POKÉMON!",
    "NÓS, HUMANOS, VIVEMOS JUNTO COM OS POKÉMON. ÀS VEZES COMO AMIGOS DE BRINCADEIRA, ÀS VEZES COMO PARCEIROS DE TRABALHO.",
    "E ÀS VEZES A GENTE SE JUNTA PRA BATALHAR CONTRA OUTROS IGUAIS A NÓS.",
    "MAS MESMO TÃO PERTO, A GENTE NÃO SABE TUDO SOBRE OS POKÉMON. TEM MUITOS, MUITOS SEGREDOS.",
    "PRA DESVENDAR ESSES MISTÉRIOS, EU FAÇO PESQUISA. É ISSO QUE EU FAÇO.",
  ] },
  { arte: "voce", digita: "eu", fala: [
    "E VOCÊ? VAMOS COMEÇAR PELO SEU NOME. QUAL É?",
  ] },
  { arte: "voce", fala: ["CERTO... ENTÃO O SEU NOME É {NOME}."] },
  { arte: "rival", digita: "rival", fala: [
    "ESTE É O MEU NETO.",
    "ELE É SEU RIVAL DESDE QUE VOCÊS ERAM BEBÊS.",
    "...HUM, COMO ERA MESMO O NOME DELE?",
  ] },
  { arte: "rival", fala: ["ISSO MESMO! AGORA LEMBREI! O NOME DELE É {RIVAL}!"] },
  { arte: "voce", fim: true, fala: [
    "{NOME}!",
    "A SUA PRÓPRIA LENDA POKÉMON ESTÁ PRESTES A COMEÇAR!",
    "UM MUNDO DE SONHOS E AVENTURAS COM POKÉMON TE ESPERA!",
    "VAMOS LÁ!",
  ] },
];

export class IntroCarvalhoScene {
  enter({ onDone } = {}) {
    this.onDone = onDone;
    this.st = this.game.state;
    this.voce = this.st.player?.genero === "menina" ? "heroina" : "hero";
    this.i = -1;
    this.t = 0;
    this.fadeA = 1;            // começa no preto e clareia
    this.digitando = null;
    this.encolhe = 0;          // 0 a 1: você virando pequenininho
    this.dlg = new Dialogue();
    trainerArt("prof"); trainerArt("rival"); trainerArt(this.voce); Assets.mon("pikachu");
    setTextVars({ NOME: this.st.player.name, RIVAL: this.st.rivalNome || DB.RIVAL?.nome || "AZUL" });
    if (DB.MUSIC?.frIntroCarvalho) Audio2.playMusic("frIntroCarvalho", DB.MUSIC.frIntroCarvalho);
    this.proxima();
  }

  get cena() { return CENAS[this.i]; }

  proxima() {
    this.i++;
    this.t = 0;
    const c = this.cena;
    if (!c) return;
    if (c.bicho) { Audio2.tone(700, 0.06, "square", 0.5); Audio2.tone(1050, 0.1, "square", 0.4); }
    this.dlg.say(c.fala, () => {
      if (c.digita) return this.pedirNome(c.digita);
      if (c.fim) return this.terminar();
      this.proxima();
    });
  }

  pedirNome(quem) {
    this.digitando = quem;
    const padrao = quem === "eu" ? this.st.player.name : this.st.rivalNome || DB.RIVAL?.nome || "AZUL";
    Texto.comeca(padrao, NOME_MAX);
  }

  terminar() {
    this.saindo = true;
    Audio2.stopLoop();
    if (DB.MUSIC?.frIntroSaida) Audio2.playMusic("frIntroSaida", DB.MUSIC.frIntroSaida);
  }

  update(dt) {
    this.t += dt;
    if (this.fadeA > 0 && !this.saindo) this.fadeA = Math.max(0, this.fadeA - dt * 1.5);
    if (this.saindo) {
      // você encolhe até sumir, a tela escurece e o jogo começa no quarto
      this.encolhe = Math.min(1, this.encolhe + dt * 0.9);
      if (this.encolhe >= 1) {
        this.fadeA = Math.min(1, this.fadeA + dt * 1.6);
        if (this.fadeA >= 1) {
          Audio2.stopLoop();
          this.saindo = false;
          this.onDone?.();
        }
      }
      return;
    }
    if (this.digitando) return this.updateNome();
    this.dlg.update(dt);
  }

  updateNome() {
    const estado = Texto.estado();
    if (!estado) return;
    const nome = (Texto.termina() || "").trim();
    Audio2.select();
    if (this.digitando === "eu") this.st.player.name = nome || this.st.player.name;
    else this.st.rivalNome = nome || DB.RIVAL?.nome || "AZUL";
    setTextVars({ NOME: this.st.player.name, RIVAL: this.st.rivalNome || DB.RIVAL?.nome || "AZUL" });
    this.digitando = null;
    this.proxima();
  }

  render(ctx) {
    // o fundo do FireRed: claro em cima, um chão redondo embaixo de quem fala
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#f8f8f0"); g.addColorStop(1, "#c8d8e8");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const c = this.cena || CENAS[CENAS.length - 1];
    const arte = c.arte === "voce" ? this.voce : c.arte;
    const comBicho = !!c.bicho;
    const cx = comBicho ? 150 : 120;
    ctx.fillStyle = "rgba(90,110,140,.25)";
    ctx.beginPath(); ctx.ellipse(cx, 96, 30, 6, 0, 0, Math.PI * 2); ctx.fill();
    const img = trainerArt(arte);
    if (img) {
      const s = 64 * (1 - (c.fim ? this.encolhe : 0));
      if (s > 1) ctx.drawImage(img, Math.round(cx - s / 2), Math.round(96 - s), Math.round(s), Math.round(s));
    }
    if (comBicho) {
      // o PIKACHU pula pra fora da bola no começo da cena
      const p = Math.min(1, this.t * 2.5);
      const mon = Assets.mon(c.bicho);
      ctx.fillStyle = "rgba(90,110,140,.25)";
      ctx.beginPath(); ctx.ellipse(70, 96, 24, 5, 0, 0, Math.PI * 2); ctx.fill();
      if (mon) {
        const s = Math.round(56 * p), pulo = Math.round(Math.sin(p * Math.PI) * 10);
        ctx.drawImage(mon, 70 - s / 2, 96 - s - pulo, s, s);
      }
    }
    if (this.digitando) this.renderNome(ctx);
    else this.dlg.render(ctx);
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }

  renderNome(ctx) {
    const rival = this.digitando === "rival";
    panel(ctx, 8, 104, 224, 52);
    drawText(ctx, rival ? "O NOME DO SEU RIVAL:" : "O SEU NOME:", 16, 110, PAL.ink2);
    const piscando = ((performance.now() / 400) | 0) % 2 === 0;
    drawText(ctx, Texto.buf() + (piscando ? "_" : ""), 16, 124, PAL.ink);
    drawText(ctx, "DIGITE E APERTE ENTER", 16, 140, PAL.ink2);
  }
}
