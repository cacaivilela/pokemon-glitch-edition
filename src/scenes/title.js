// Tela de título. Limpa por padrão; o visual corrompido só aparece se
// CONFIG.glitchMode estiver ligado em src/data/config.js.
import { DB } from "../data/index.js";
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { Save } from "../core/save.js";
import { Opcoes } from "../core/opcoes.js";
import { url } from "../core/base.js";
import { Assets, nullmonSprite } from "../core/assets.js";
import { drawText, panel, cursor, PAL, LINE_H } from "../core/gfx.js";
import { Glitch } from "../systems/glitchfx.js";
import { OverworldScene } from "./overworld.js";
import { FundoDeEvolucoes } from "./fundo-evolucoes.js";
import { GiftScene } from "./online.js";

/** As duas portas de entrada do jogo novo (ver `newGame` em src/main.js). */
const REGIOES_INICIO = [
  { id: "kanto", nome: "KANTO", texto: ["VILA PALETA. PROF. CARVALHO,", "OS 151 E A FENDA DO GLITCH."] },
  { id: "braglitch", nome: "BRAGLITCH", texto: ["SÃO LUCARIO DO SUL. PROFA. IPÊ,", "AS OITO ILHAS -BRAG."] },
];

/** Quem joga: o desenho no mapa sai daqui (ver `Assets.actor("hero")`). */
const GENEROS = [
  { id: "menino", nome: "MENINO", brag: "CAIO", sprite: "hero" },
  { id: "menina", nome: "MENINA", brag: "LARA", sprite: "heroina" },
];

export class TitleScene {
  enter() {
    this.t = 0;
    this.index = 0;
    this.tela = "menu";      // menu | comandos
    this.topo = 0;           // primeira linha visível da lista de comandos
    this.hasSave = Save.exists();
    // O PRESENTE MISTERIOSO fica aqui, como nos jogos de verdade. Só aparece
    // com uma partida gravada: o presente precisa de um save pra entrar.
    this.items = this.hasSave ? ["CONTINUAR", "NOVO JOGO", DB.GIFT_TEXTO.titulo] : ["NOVO JOGO"];
    this.items.push(DB.STORY.comandos.titulo);
    this.items.push("UNIQUEMON");   // o site de desenhar FORMA ÚNICA (uniquemon/), numa aba nova
    this.items.push("IDIOMA");   // dá pra escolher antes de começar qualquer coisa
    Glitch.level = DB.CONFIG?.glitchMode ? 45 : 0;
    // o fundo: duas evoluções sorteadas ao mesmo tempo (src/scenes/fundo-evolucoes.js)
    this.fundo = new FundoDeEvolucoes();
    Audio2.playMusic("titulo", DB.MUSIC?.titulo);
  }

  exit() { Audio2.stopLoop(); }

  update(dt) {
    this.t += dt;
    this.fundo.update(dt);
    if (DB.CONFIG?.glitchMode && Math.random() < dt * 1.4) Glitch.hit(0.35);
    if (this.tela === "comandos") return this.updateComandos();
    if (this.tela === "regiao") return this.updateRegiao();
    if (this.tela === "genero") return this.updateGenero();
    if (Input.consume("up")) { this.index = (this.index + this.items.length - 1) % this.items.length; Audio2.blip(); }
    if (Input.consume("down")) { this.index = (this.index + 1) % this.items.length; Audio2.blip(); }
    if (Input.consume("a")) {
      Audio2.unlock();
      Audio2.select();
      if (this.items[this.index] === "IDIOMA") return this.trocaIdioma();
      if (this.items[this.index] === "UNIQUEMON") return void window.open(url("uniquemon/"), "_blank");
      if (this.items[this.index] === DB.STORY.comandos.titulo) {
        this.tela = "comandos";
        this.topo = 0;
        return;
      }
      if (this.items[this.index] === DB.GIFT_TEXTO.titulo) {
        this.game.loadGame();                 // o cartão entra na partida gravada
        return void this.game.scenes.push(new GiftScene());
      }
      if (this.items[this.index] !== "CONTINUAR") {
        // JOGO NOVO pergunta onde começa: KANTO ou BRAGLITCH
        this.tela = "regiao";
        this.regiaoIdx = 0;
        return;
      }
      this.game.loadGame();
      this.comecar();
    }
  }

  comecar() {
    Glitch.level = this.game.state.corruption;
    this.game.scenes.replace(new OverworldScene());
  }

  /** ONDE COMEÇA A JORNADA. As duas regiões se ligam por barco, então a
   *  escolha não prende ninguém: decide só a casa, a professora e os três da
   *  mesa. */
  updateRegiao() {
    const n = REGIOES_INICIO.length;
    if (Input.consume("up")) { this.regiaoIdx = (this.regiaoIdx + n - 1) % n; Audio2.blip(); }
    if (Input.consume("down")) { this.regiaoIdx = (this.regiaoIdx + 1) % n; Audio2.blip(); }
    if (Input.consume("b")) { this.tela = "menu"; Audio2.cancel(); return; }
    if (Input.consume("a")) {
      Audio2.select();
      this.tela = "genero";
      this.generoIdx = 0;
    }
  }

  /** MENINO OU MENINA: a segunda pergunta do jogo novo, depois da região. */
  updateGenero() {
    if (Input.consume("up") || Input.consume("down") || Input.consume("left") || Input.consume("right")) {
      this.generoIdx = 1 - this.generoIdx; Audio2.blip();
    }
    if (Input.consume("b")) { this.tela = "regiao"; Audio2.cancel(); return; }
    if (Input.consume("a")) {
      Audio2.select();
      this.game.newGame(REGIOES_INICIO[this.regiaoIdx].id, GENEROS[this.generoIdx].id);
      this.comecar();
    }
  }

  renderGenero(ctx) {
    panel(ctx, 8, 60, 224, 96);
    drawText(ctx, "VOCÊ É MENINO OU MENINA?", 16, 66, PAL.glitch);
    GENEROS.forEach((g, i) => {
      const x = 40 + i * 104;
      // a roupa da região escolhida: em BRAGLITCH, a de lá
      const brag = REGIOES_INICIO[this.regiaoIdx].id === "braglitch";
      const folha = Assets.actor(brag ? `${g.sprite}_brag` : g.sprite, false);
      if (folha?.down?.[0]) ctx.drawImage(folha.down[0], x + 8, 76, 32, 64);
      // em BRAGLITCH são os gêmeos de lá
      drawText(ctx, brag ? g.brag : g.nome, x + 4, 140, PAL.ink);
      if (i === this.generoIdx) cursor(ctx, x - 6, 140);
    });
    drawText(ctx, "Z ESCOLHE   X VOLTA", 16, 150, PAL.ink2);
  }

  renderRegiao(ctx) {
    panel(ctx, 8, 60, 224, 96);
    drawText(ctx, "ONDE COMEÇA A SUA JORNADA?", 16, 66, PAL.glitch);
    REGIOES_INICIO.forEach((r, i) => {
      const y = 82 + i * 14;
      drawText(ctx, r.nome, 26, y, PAL.ink);
      if (i === this.regiaoIdx) cursor(ctx, 16, y);
    });
    const r = REGIOES_INICIO[this.regiaoIdx];
    r.texto.forEach((l, i) => drawText(ctx, l, 16, 114 + i * 11, PAL.ink2));
    drawText(ctx, "Z ESCOLHE   X VOLTA", 16, 146, PAL.ink2);
  }

  /** Passa pro próximo idioma. Vale na hora: a própria tela de título já
   *  aparece traduzida no quadro seguinte. */
  trocaIdioma() {
    const lista = DB.IDIOMAS || [{ id: "pt" }];
    const i = lista.findIndex((l) => l.id === Opcoes.get("idioma"));
    const novo = lista[(Math.max(0, i) + 1) % lista.length];
    Opcoes.set("idioma", novo.id);
    this.game.aplicarIdioma();
    Audio2.select();
  }

  /** A lista de comandos rola; ela é maior que a tela de propósito, porque a
   *  oficina de sprite trouxe tecla que o resto do jogo não usa. */
  updateComandos() {
    const C = DB.STORY.comandos;
    const cabem = 9;
    const max = Math.max(0, C.lista.length - cabem);
    if (Input.consume("down")) { this.topo = Math.min(max, this.topo + 1); Audio2.blip(); }
    if (Input.consume("up")) { this.topo = Math.max(0, this.topo - 1); Audio2.blip(); }
    if (Input.consume("b") || Input.consume("a")) { this.tela = "menu"; Audio2.cancel(); }
  }

  renderComandos(ctx) {
    const C = DB.STORY.comandos;
    panel(ctx, 4, 4, 232, 152);
    drawText(ctx, C.titulo, 12, 10, PAL.glitch);
    const cabem = 9;
    C.lista.slice(this.topo, this.topo + cabem).forEach(([tecla, oque], i) => {
      const y = 26 + i * 13;
      drawText(ctx, tecla, 12, y, PAL.ink);
      drawText(ctx, oque, 96, y, PAL.ink2);
    });
    if (this.topo + cabem < C.lista.length) drawText(ctx, "MAIS +", 190, 142, PAL.ink2);
    if (this.topo > 0) drawText(ctx, "-", 224, 10, PAL.ink2);
    drawText(ctx, C.ajuda, 12, 142, PAL.ink2);
  }

  render(ctx) {
    const glitch = !!DB.CONFIG?.glitchMode;
    this.fundo.render(ctx);

    const wob = Math.sin(this.t * 2) * 1.5;
    drawText(ctx, "POKÉMON", 74, 20 + wob, "#ffd166", { shadow: "#7a4a10" });
    drawText(ctx, "GLITCH EDITION", 60, 36 + wob, "#f4f4ff", { shadow: "#5b32b0" });
    // o VOLUME (src/data/versao.js), pequeno, na ponta da linha de baixo
    if (DB.VOLUME) drawText(ctx, DB.VOLUME, 188 - DB.VOLUME.length * 6, 51, "#ffd166", { shadow: "#7a4a10" });
    ctx.fillStyle = "#b455ff";
    ctx.fillRect(52, 48, 136, 1);

    if (glitch) ctx.drawImage(nullmonSprite(((this.t * 6) | 0) * 31 + 5), 96, 60, 48, 48);

    if (this.tela === "comandos") return this.renderComandos(ctx);
    if (this.tela === "regiao") return this.renderRegiao(ctx);
    if (this.tela === "genero") return this.renderGenero(ctx);

    const w = 96, x = 120 - w / 2, y = 114 - (this.items.length - 3) * LINE_H;
    panel(ctx, x, y, w, this.items.length * LINE_H + 8);
    const idioma = (DB.IDIOMAS || []).find((l) => l.id === Opcoes.get("idioma"));
    this.items.forEach((it, i) => {
      const texto = it === "IDIOMA" ? (idioma?.nome || "PORTUGUÊS") : it;
      drawText(ctx, texto, x + 16, y + 4 + i * LINE_H, PAL.ink);
      if (i === this.index) cursor(ctx, x + 7, y + 4 + i * LINE_H);
    });

    drawText(ctx, "FANGAME NÃO OFICIAL - VOL. 6", 30, 150, "#8f7ab0");
  }
}
