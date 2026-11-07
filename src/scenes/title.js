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
import { CHAR_W } from "../core/font.js";
import { Glitch } from "../systems/glitchfx.js";
import { OverworldScene } from "./overworld.js";
import { IntroCarvalhoScene } from "./introcarvalho.js";
import { FundoDeFogos } from "./fundo-fogos.js";
import { GiftScene } from "./online.js";
import { DIFICULDADES } from "../systems/dificuldade.js";
import { analisar, resumo, quando } from "../systems/recuperar.js";

/** As duas portas de entrada do jogo novo (ver `newGame` em src/main.js). */
const REGIOES_INICIO = [
  { id: "kanto", nome: "KANTO", texto: ["CIDADE DE PALLET. PROF. CARVALHO,", "OS 151 E A FENDA DO GLITCH."] },
  { id: "braglitch", nome: "BRAGLITCH", texto: ["SÃO LUCARIO DO SUL. PROFA. IPÊ,", "AS OITO ILHAS -BRAG."] },
];

/** Quem joga: o desenho no mapa sai daqui (ver `Assets.actor("hero")`). */
const GENEROS = [
  { id: "menino", nome: "MENINO", brag: "CAIO", sprite: "hero" },
  { id: "menina", nome: "MENINA", brag: "LARA", sprite: "heroina" },
];

/** Quebra um texto em linhas de até `n` letras, sem partir palavra. */
function quebrar(texto, n) {
  const out = [""];
  for (const p of String(texto).split(" ")) {
    const l = out[out.length - 1];
    if (l && (l + " " + p).length > n) out.push(p);
    else out[out.length - 1] = l ? `${l} ${p}` : p;
  }
  return out;
}

export class TitleScene {
  enter() {
    this.t = 0;
    this.index = 0;
    this.tela = "menu";      // menu | comandos
    this.topo = 0;           // primeira linha visível da lista de comandos
    this.montarItens();
    Glitch.level = DB.CONFIG?.glitchMode ? 45 : 0;
    // o fundo do VOL. 7: FOGOS DE POKÉMON (src/scenes/fundo-fogos.js)
    this.fundo = new FundoDeFogos();
    Audio2.playMusic("titulo", DB.MUSIC?.titulo);
  }

  montarItens() {
    this.hasSave = Save.exists();
    // O PRESENTE MISTERIOSO fica aqui, como nos jogos de verdade. Só aparece
    // com uma partida gravada: o presente precisa de um save pra entrar.
    this.items = this.hasSave ? ["CONTINUAR", "NOVO JOGO", DB.GIFT_TEXTO.titulo] : ["NOVO JOGO"];
    // o que um DLC ligado põe aqui (`DB.TITULO_DLC` — o APAGAR DLC da GLITCH
    // DIMENSION EXTREMA): mexe na partida gravada, então só com save
    if (this.hasSave) for (const o of DB.TITULO_DLC || []) this.items.push(o.nome);
    // a IA que lê as cópias do save (src/systems/recuperar.js): aparece
    // sempre, porque é justamente sem save que ela mais faz falta
    this.items.push("RECUPERAR SAVE");
    this.items.push(DB.STORY.comandos.titulo);
    this.items.push("UNIQUEMON");   // o site de desenhar FORMA ÚNICA (uniquemon/), numa aba nova
    this.items.push("IDIOMA");   // dá pra escolher antes de começar qualquer coisa
  }

  exit() { Audio2.stopLoop(); }

  update(dt) {
    this.t += dt;
    this.fundo.update(dt);
    if (DB.CONFIG?.glitchMode && Math.random() < dt * 1.4) Glitch.hit(0.35);
    if (this.tela === "comandos") return this.updateComandos();
    if (this.tela === "regiao") return this.updateRegiao();
    if (this.tela === "genero") return this.updateGenero();
    if (this.tela === "dificuldade") return this.updateDificuldade();
    if (this.tela === "fusao") return this.updateModoFusao();
    if (this.tela === "dlc") return this.updateDlc();
    if (this.tela === "recuperar") return this.updateRecuperar(dt);
    if (Input.consume("up")) { this.index = (this.index + this.items.length - 1) % this.items.length; Audio2.blip(); }
    if (Input.consume("down")) { this.index = (this.index + 1) % this.items.length; Audio2.blip(); }
    if (Input.consume("a")) {
      Audio2.unlock();
      Audio2.select();
      if (this.items[this.index] === "IDIOMA") return this.trocaIdioma();
      if (this.items[this.index] === "RECUPERAR SAVE") return this.abrirRecuperar();
      if (this.items[this.index] === "UNIQUEMON") return void window.open(url("uniquemon/"), "_blank");
      if (this.items[this.index] === DB.STORY.comandos.titulo) {
        this.tela = "comandos";
        this.topo = 0;
        return;
      }
      const doDlc = (DB.TITULO_DLC || []).find((o) => o.nome === this.items[this.index]);
      if (doDlc) {
        this.tela = "dlc";
        this.dlc = { o: doDlc, passo: 0, idx: 0 };
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

  /** Um pedido de DLC (`DB.TITULO_DLC`: { nome, pergunta, certeza,
   *  aoConfirmar(st) -> linhas }): pergunta DUAS vezes (NÃO vem marcado), faz
   *  na partida gravada, grava, e mostra o que fez. */
  updateDlc() {
    const d = this.dlc;
    if (d.linhas) {
      if (Input.consume("a") || Input.consume("b")) { this.tela = "menu"; Audio2.select(); }
      return;
    }
    if (Input.consume("up") || Input.consume("down") || Input.consume("left") || Input.consume("right")) {
      d.idx = 1 - d.idx; Audio2.blip();
    }
    if (Input.consume("b")) { this.tela = "menu"; Audio2.cancel(); return; }
    if (!Input.consume("a")) return;
    if (d.idx === 0) { this.tela = "menu"; Audio2.cancel(); return; }
    if (d.passo === 0) { d.passo = 1; d.idx = 0; Audio2.select(); return; }
    this.game.loadGame();
    d.linhas = d.o.aoConfirmar(this.game.state);
    this.game.save();
    Glitch.hit(1.5);
    Audio2.glitch();
  }

  renderDlc(ctx) {
    const d = this.dlc;
    const linhas = (d.linhas || [d.passo === 0 ? d.o.pergunta : d.o.certeza]).flatMap((t) => quebrar(t, 36));
    const h = linhas.length * LINE_H + 8 + (d.linhas ? 0 : LINE_H + 4);
    const y = 144 - h;
    panel(ctx, 8, y, 224, h);
    linhas.forEach((l, i) => drawText(ctx, l, 14, y + 4 + i * LINE_H, PAL.ink));
    if (d.linhas) return;
    const oy = y + 4 + linhas.length * LINE_H + 4;
    const opcoes = d.passo === 0 ? d.o.opcoes : d.o.opcoes2;
    opcoes.forEach((o, i) => {
      const ox = 30 + i * 100;
      drawText(ctx, o, ox, oy, PAL.ink);
      if (i === d.idx) cursor(ctx, ox - 9, oy);
    });
  }

  /** RECUPERAR SAVE: a IA "pensa" (lê as cópias no servidor), diz o que
   *  achou e deixa escolher; voltar uma cópia pergunta antes (NÃO marcado). */
  abrirRecuperar() {
    const r = this.rec = { fase: "lendo", t: 0, copias: null, idx: 0, topo: 0 };
    this.tela = "recuperar";
    Save.copias().then((c) => {
      r.copias = c;
      r.ia = analisar(c, Save.read());
      r.idx = Math.max(0, r.ia.escolhida);
    });
  }

  updateRecuperar(dt) {
    const r = this.rec;
    r.t += dt;
    if (r.fase === "lendo") {
      if (Input.consume("b")) { this.tela = "menu"; Audio2.cancel(); return; }
      // pensa pelo menos um pouquinho, mesmo com o servidor respondendo na hora
      if (r.copias && r.t > 1.8) { r.fase = "lista"; Audio2.select(); }
      return;
    }
    if (r.fase === "feito") {
      if (Input.consume("a") || Input.consume("b")) { this.tela = "menu"; Audio2.select(); }
      return;
    }
    if (r.fase === "certeza") {
      if (Input.consume("left") || Input.consume("right") || Input.consume("up") || Input.consume("down")) {
        r.sim = !r.sim; Audio2.blip();
      }
      if (Input.consume("b") || (Input.consume("a") && !r.sim)) { r.fase = "lista"; Audio2.cancel(); return; }
      if (!r.sim || r.gravando) return;
      r.gravando = true;
      const c = r.copias[r.idx];
      Save.write(c.save).then((res) => {
        r.gravando = false;
        r.fase = "feito";
        r.final = res === "ok"
          ? [`PRONTO! O SAVE DE ${quando(c.quando)} VOLTOU INTEIRO.`, "O DE ANTES TAMBÉM FICOU GUARDADO NAS CÓPIAS.", "ESCOLHE CONTINUAR."]
          : ["NÃO CONSEGUI GRAVAR. O SERVIDOR (RUN.SH) ESTÁ LIGADO?"];
        if (res === "ok") {
          this.montarItens();
          this.index = 0;
          Glitch.hit(1.2);
          Audio2.glitch();
        }
      });
      return;
    }
    const n = r.copias.length;
    if (Input.consume("b") || (!n && Input.consume("a"))) { this.tela = "menu"; Audio2.cancel(); return; }
    if (!n) return;
    if (Input.consume("up")) { r.idx = (r.idx + n - 1) % n; Audio2.blip(); }
    if (Input.consume("down")) { r.idx = (r.idx + 1) % n; Audio2.blip(); }
    if (Input.consume("a")) { r.fase = "certeza"; r.sim = false; Audio2.select(); }
  }

  renderRecuperar(ctx) {
    const r = this.rec;
    panel(ctx, 4, 4, 232, 152);
    drawText(ctx, "RECUPERAR SAVE", 12, 10, PAL.glitch);
    if (r.fase === "lendo") {
      const pontos = ".".repeat(1 + (Math.floor(r.t * 3) % 3));
      drawText(ctx, "A IA ESTÁ LENDO AS CÓPIAS" + pontos, 12, 30, PAL.ink);
      // as "contas" dela passando
      for (let i = 0; i < 6; i++) {
        const k = Math.floor(r.t * 12) + i * 7;
        const linha = Array.from({ length: 30 }, (_, j) => "01#%?*"[(k * 13 + j * 7 + i) % 6]).join("");
        drawText(ctx, linha, 12, 52 + i * LINE_H, PAL.ink2);
      }
      return;
    }
    if (r.fase === "feito") {
      r.final.flatMap((t) => quebrar(t, 36)).forEach((l, i) => drawText(ctx, l, 12, 30 + i * LINE_H, PAL.ink));
      drawText(ctx, "A: OK", 12, 142, PAL.ink2);
      return;
    }
    // o que a IA acha, em cima
    const falas = r.ia.falas.flatMap((t) => quebrar(t, 36)).slice(0, r.copias.length ? 3 : 9);
    falas.forEach((l, i) => drawText(ctx, l, 12, 24 + i * LINE_H, PAL.ink));
    const n = r.copias.length;
    if (!n) { drawText(ctx, "B: VOLTAR", 12, 142, PAL.ink2); return; }
    // a lista das cópias (cabem 3), a recomendada com estrela
    const y0 = 28 + falas.length * LINE_H;
    const cabem = 3;
    r.topo = Math.min(Math.max(r.topo, r.idx - cabem + 1), r.idx);
    r.copias.slice(r.topo, r.topo + cabem).forEach((c, k) => {
      const i = r.topo + k, y = y0 + k * LINE_H;
      const st = c.save;
      const txt = `${quando(c.quando)}  ${st?.badges?.length || 0} INS.  ${st?.caught?.length || 0} DEX`;
      drawText(ctx, txt, 22, y, i === r.ia.escolhida ? PAL.glitch : PAL.ink);
      if (i === r.ia.escolhida) drawText(ctx, "*", 216, y, PAL.glitch);
      if (i === r.idx) cursor(ctx, 13, y);
    });
    if (r.topo + cabem < n) drawText(ctx, "+", 224, y0 + (cabem - 1) * LINE_H, PAL.ink2);
    // o save da cópia marcada, embaixo
    const yr = y0 + cabem * LINE_H + 3;
    ctx.fillStyle = PAL.ink2;
    ctx.fillRect(12, yr - 2, 216, 1);
    resumo(r.copias[r.idx].save).flatMap((t) => quebrar(t, 36)).slice(0, 4)
      .forEach((l, i) => drawText(ctx, l, 12, yr + 1 + i * LINE_H, PAL.ink2));
    if (r.fase === "certeza") {
      panel(ctx, 10, 100, 220, 40);
      drawText(ctx, "TROCAR O SAVE DE AGORA POR ESTE?", 24, 106, PAL.ink);
      ["NÃO", "SIM"].forEach((o, i) => {
        const ox = 60 + i * 80;
        drawText(ctx, o, ox, 122, PAL.ink);
        if ((i === 1) === !!r.sim) cursor(ctx, ox - 9, 122);
      });
      return;
    }
    drawText(ctx, "A: VOLTAR ESTE   B: SAIR", 12, 142, PAL.ink2);
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
      this.tela = "dificuldade";
      this.difIdx = DIFICULDADES.findIndex((d) => d.id === "medio");
    }
  }

  /** A DIFICULDADE: a terceira pergunta (src/systems/dificuldade.js). Dá pra
   *  trocar depois no OPÇÕES, então não prende ninguém. */
  updateDificuldade() {
    const n = DIFICULDADES.length;
    if (Input.consume("up")) { this.difIdx = (this.difIdx + n - 1) % n; Audio2.blip(); }
    if (Input.consume("down")) { this.difIdx = (this.difIdx + 1) % n; Audio2.blip(); }
    if (Input.consume("b")) { this.tela = "genero"; Audio2.cancel(); return; }
    if (Input.consume("a")) {
      Audio2.select();
      this.tela = "fusao";
      this.fusaoIdx = 0;
    }
  }

  /** O MODO FUSÃO: a quarta pergunta (pedido do CAIO, nov/2026). Ligado, todo
   *  Pokémon selvagem nasce FUNDIDO com outro e o inicial se funde com um
   *  aleatório (src/systems/modofusao.js). Dá pra trocar depois no OPÇÕES. */
  updateModoFusao() {
    if (Input.consume("up") || Input.consume("down")) { this.fusaoIdx = 1 - this.fusaoIdx; Audio2.blip(); }
    if (Input.consume("b")) { this.tela = "dificuldade"; Audio2.cancel(); return; }
    if (Input.consume("a")) {
      Audio2.select();
      const st = this.game.newGame(REGIOES_INICIO[this.regiaoIdx].id, GENEROS[this.generoIdx].id, DIFICULDADES[this.difIdx].id);
      st.flags ||= {};
      st.flags.modoFusao = this.fusaoIdx === 1;
      // KANTO: como no FireRed, o PROF. CARVALHO fala, pergunta o seu nome e
      // o do rival, e o jogo começa no seu quarto (src/scenes/introcarvalho.js)
      if (st.regiao === "kanto") {
        Glitch.level = st.corruption;
        return void this.game.scenes.replace(new IntroCarvalhoScene(), {
          onDone: () => this.game.scenes.replace(new OverworldScene()),
        });
      }
      this.comecar();
    }
  }

  renderModoFusao(ctx) {
    panel(ctx, 8, 52, 224, 104);
    drawText(ctx, "MODO FUSÃO? (MUDA NO OPÇÕES)", 16, 56, PAL.glitch);
    [["NORMAL", "OS POKÉMON DE SEMPRE."], ["FUSÕES", "TODO SELVAGEM É UMA FUSÃO, E O SEU INICIAL SE FUNDE COM UM POKÉMON SURPRESA!"]].forEach(([nome], i) => {
      const y = 72 + i * LINE_H;
      drawText(ctx, nome, 30, y, i === 1 ? PAL.glitch : PAL.ink);
      if (i === this.fusaoIdx) cursor(ctx, 20, y);
    });
    const dica = this.fusaoIdx ? "TODO SELVAGEM É UMA FUSÃO E O SEU INICIAL" : "OS POKÉMON DE SEMPRE.";
    drawText(ctx, dica, 16, 106, PAL.ink2);
    if (this.fusaoIdx) drawText(ctx, "SE FUNDE COM UM POKÉMON SURPRESA!", 16, 116, PAL.ink2);
    drawText(ctx, "Z ESCOLHE   X VOLTA", 16, 146, PAL.ink2);
  }

  renderDificuldade(ctx) {
    panel(ctx, 8, 52, 224, 104);
    drawText(ctx, "DIFICULDADE? (MUDA NO OPÇÕES)", 16, 56, PAL.glitch);
    DIFICULDADES.forEach((d, i) => {
      const y = 68 + i * LINE_H;
      drawText(ctx, d.nome, 30, y, i === DIFICULDADES.length - 1 ? PAL.glitch : PAL.ink);
      if (i === this.difIdx) cursor(ctx, 20, y);
    });
    drawText(ctx, DIFICULDADES[this.difIdx].dica, 16, 68 + 6 * LINE_H + 2, PAL.ink2);
    drawText(ctx, "Z ESCOLHE   X VOLTA", 16, 146, PAL.ink2);
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
    if (this.tela === "dificuldade") return this.renderDificuldade(ctx);
    if (this.tela === "fusao") return this.renderModoFusao(ctx);
    if (this.tela === "dlc") return this.renderDlc(ctx);
    if (this.tela === "recuperar") return this.renderRecuperar(ctx);

    // lista comprida (save + DLC + RECUPERAR SAVE) sobe pra não cobrir a
    // linha do FANGAME embaixo
    const w = Math.max(96, ...this.items.map((it) => it.length * CHAR_W + 24)), x = 120 - w / 2;
    const y = Math.min(114 - (this.items.length - 3) * LINE_H, 140 - this.items.length * LINE_H);
    panel(ctx, x, y, w, this.items.length * LINE_H + 8);
    const idioma = (DB.IDIOMAS || []).find((l) => l.id === Opcoes.get("idioma"));
    this.items.forEach((it, i) => {
      const texto = it === "IDIOMA" ? (idioma?.nome || "PORTUGUÊS") : it;
      drawText(ctx, texto, x + 16, y + 4 + i * LINE_H, PAL.ink);
      if (i === this.index) cursor(ctx, x + 7, y + 4 + i * LINE_H);
    });

    drawText(ctx, "FANGAME NÃO OFICIAL - VOL. 7", 30, 150, "#8f7ab0");
  }
}
