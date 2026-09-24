// Tela de título. Limpa por padrão; o visual corrompido só aparece se
// CONFIG.glitchMode estiver ligado em src/data/config.js.
import { DB } from "../data/index.js";
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { Save } from "../core/save.js";
import { Opcoes } from "../core/opcoes.js";
import { Assets, nullmonSprite } from "../core/assets.js";
import { idFusao, garantirEspecie } from "../systems/fusao.js";
import { drawText, panel, cursor, PAL, LINE_H } from "../core/gfx.js";
import { Glitch } from "../systems/glitchfx.js";
import { OverworldScene } from "./overworld.js";
import { GiftScene } from "./online.js";

/** A VITRINE da tela de título.
 *
 *  Eram os três iniciais, fixos: a mesma foto toda vez que o jogo abre, e a
 *  foto de um jogo que este não é. Agora são três sorteados de Kanto inteira, e
 *  parte deles vem FUNDIDA — a primeira tela do jogo passa a mostrar do que ele
 *  é capaz, em vez de mostrar o que todo Pokémon mostra.
 *
 *  E a fusão que aparece é, de preferência, UMA QUE ALGUÉM FEZ. As fichas
 *  publicadas na oficina (src/data/fusoes-feitas.js) vêm com desenho de gente,
 *  não com a montagem automática das duas metades — e quando uma delas está na
 *  tela, o nome de quem desenhou aparece em cima. A tela de título é o lugar
 *  mais visto do jogo; quem desenhou merece estar nele.
 *
 *  A troca é lenta de propósito: rápida demais vira anúncio piscando, e o menu
 *  fica embaixo dela. */
const VITRINE = {
  quantos: 3,
  troca: 4.5,        // segundos que cada leva fica na tela
  fusao: 0.4,        // parte das vagas que sai fundida
  doJogador: 0.75,   // ...e dessas, quantas saem de uma ficha publicada
  entra: 0.5,        // quanto dura o aparecer de cada leva
};

/** Todas as fichas que os jogadores publicaram, achatadas numa lista só.
 *  Montada uma vez por sorteio — o arquivo é grande e percorrer ele por vaga
 *  seria percorrer três vezes pra nada. */
function fichasDeJogadores() {
  const out = [];
  for (const [dupla, fichas] of Object.entries(DB.FUSOES_FEITAS || {})) {
    const [cabeca, corpo] = String(dupla).split("+");
    if (!cabeca || !corpo) continue;
    for (const f of fichas || []) if (f?.id) out.push({ cabeca, corpo, ficha: f });
  }
  return out;
}

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
    this.items.push("IDIOMA");   // dá pra escolher antes de começar qualquer coisa
    Glitch.level = DB.CONFIG?.glitchMode ? 45 : 0;
    // Duas levas desde o começo: a que está na tela e a PRÓXIMA. Sortear já
    // pede os desenhos, então quando chegar a vez da próxima a arte já chegou —
    // sem isso a vitrine trocava pra três silhuetas provisórias a cada volta.
    this.vitrine = this.sortear();
    this.proxima = this.sortear();
    this.trocaT = 0;
    Audio2.playMusic("titulo", DB.MUSIC?.titulo);
  }

  /** Uma leva: `quantos` bichos de Kanto, parte deles fundida. Pede o desenho
   *  de cada um (e das duas metades, quando é fusão) na hora do sorteio. */
  sortear() {
    const base = Object.keys(DB.GEN1 || {}).filter((id) => DB.SPECIES?.[id]);
    if (base.length < 2) return (DB.STARTERS || []).map((id) => ({ id }));
    const um = () => base[Math.floor(Math.random() * base.length)];
    const publicadas = fichasDeJogadores();
    const leva = [];
    for (let i = 0; i < VITRINE.quantos; i++) {
      if (Math.random() < VITRINE.fusao) {
        // Ficha de jogador tem preferência: ela foi DESENHADA, e a graça de
        // mostrar fusão na abertura é mostrar a que alguém fez, não a média de
        // dois sprites. Só cai na automática quando não tem ficha publicada.
        const p = publicadas.length && Math.random() < VITRINE.doJogador
          ? publicadas[Math.floor(Math.random() * publicadas.length)]
          : null;
        const cabeca = p ? p.cabeca : um();
        const corpo = p ? p.corpo : um();
        // as duas metades primeiro: o desenho da fusão é montado a partir delas,
        // e pedir só a fusão montaria ela em cima de arte provisória
        Assets.mon(cabeca, 1);
        Assets.mon(corpo, 1);
        const id = idFusao(cabeca, corpo, p ? p.ficha.id : "");
        const sp = garantirEspecie(id);
        if (sp) { leva.push({ id, autor: sp.autor || "" }); Assets.mon(id, 1); continue; }
      }
      const id = um();
      Assets.mon(id, 1);
      leva.push({ id });
    }
    return leva;
  }
  exit() { Audio2.stopLoop(); }

  update(dt) {
    this.t += dt;
    this.trocaT += dt;
    if (this.trocaT >= VITRINE.troca) {
      this.trocaT = 0;
      this.vitrine = this.proxima;
      this.proxima = this.sortear();      // e já pede os desenhos da leva seguinte
    }
    if (DB.CONFIG?.glitchMode && Math.random() < dt * 1.4) Glitch.hit(0.35);
    if (this.tela === "comandos") return this.updateComandos();
    if (Input.consume("up")) { this.index = (this.index + this.items.length - 1) % this.items.length; Audio2.blip(); }
    if (Input.consume("down")) { this.index = (this.index + 1) % this.items.length; Audio2.blip(); }
    if (Input.consume("a")) {
      Audio2.unlock();
      Audio2.select();
      if (this.items[this.index] === "IDIOMA") return this.trocaIdioma();
      if (this.items[this.index] === DB.STORY.comandos.titulo) {
        this.tela = "comandos";
        this.topo = 0;
        return;
      }
      if (this.items[this.index] === DB.GIFT_TEXTO.titulo) {
        this.game.loadGame();                 // o cartão entra na partida gravada
        return void this.game.scenes.push(new GiftScene());
      }
      if (this.items[this.index] === "CONTINUAR") this.game.loadGame();
      else this.game.newGame();
      Glitch.level = this.game.state.corruption;
      this.game.scenes.replace(new OverworldScene());
    }
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

  /** O FUNDO DO MENU PRINCIPAL: a fenda, a 011GLITCHDIMENSION110. Roxo
   *  escuro, faixas de cor escorregando de lado devagar e pixels caindo — tudo
   *  com posição tirada do relógio e do índice, sem sorteio nenhum: é o visual
   *  corrompido SEM o chuvisco, que pisca e cansa a vista numa tela parada. */
  fundoFenda(ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, 160);
    g.addColorStop(0, "#140a24");
    g.addColorStop(0.6, "#2a1040");
    g.addColorStop(1, "#0a0612");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 240, 160);

    // as linhas escorregando: faixas finas que andam de lado, cada uma no seu passo
    for (let i = 0; i < 7; i++) {
      const y = 10 + i * 21 + (i % 2) * 5;
      const w = 50 + ((i * 37) % 70);
      const x = ((this.t * (8 + i * 5) + i * 83) % (240 + w)) - w;
      ctx.fillStyle = i % 3 === 0 ? "rgba(180,85,255,0.22)" : "rgba(106,58,176,0.28)";
      ctx.fillRect(Math.round(x), y, w, i % 2 ? 1 : 2);
      // o pedaço que ficou pra trás, deslocado: é o que faz parecer linha lida errado
      ctx.fillStyle = "rgba(180,85,255,0.12)";
      ctx.fillRect(Math.round(x - w * 0.6), y + 3, Math.round(w * 0.4), 1);
    }

    // os pixels caindo, devagar e sempre no mesmo desenho
    for (let i = 0; i < 34; i++) {
      const x = (i * 53 + (i % 4) * 11) % 240;
      const vel = 10 + (i % 3) * 7;
      const y = ((i * 37 + this.t * vel) % 176) - 8;
      ctx.fillStyle = i % 7 === 0 ? "#f4f4ff" : i % 2 ? "#b455ff" : "#6a3ab0";
      const lado = i % 5 === 0 ? 2 : 1;
      ctx.fillRect(x, Math.round(y), lado, lado);
      // o rastro: dois pixels mais apagados em cima de quem cai
      ctx.globalAlpha = 0.35;
      ctx.fillRect(x, Math.round(y) - 3, lado, 1);
      ctx.globalAlpha = 1;
    }
  }

  render(ctx) {
    const glitch = !!DB.CONFIG?.glitchMode;
    this.fundoFenda(ctx);

    // Quem desenhou a fusão que está na tela. Vai ACIMA do logo porque é a
    // única faixa livre: o painel do menu sobe até a altura dos bichos quando a
    // lista está cheia, e não sobra linha entre eles e ele.
    const autores = [...new Set((this.vitrine || []).map((v) => v.autor).filter(Boolean))];
    if (autores.length) {
      const linha = `${autores.length > 1 ? "FUSÕES" : "FUSÃO"} DE ${autores.join(" E ")}`;
      ctx.globalAlpha = 0.55 + Math.sin(this.t * 1.6) * 0.15;
      drawText(ctx, linha, Math.round((240 - linha.length * 6) / 2), 6,
               "#8f6bd8");
      ctx.globalAlpha = 1;
    }

    const wob = Math.sin(this.t * 2) * 1.5;
    drawText(ctx, "POKÉMON", 74, 20 + wob, "#ffd166", { shadow: "#7a4a10" });
    drawText(ctx, "GLITCH EDITION", 60, 36 + wob, "#f4f4ff", { shadow: "#5b32b0" });
    // o VOLUME (src/data/versao.js), pequeno, na ponta da linha de baixo
    if (DB.VOLUME) drawText(ctx, DB.VOLUME, 188 - DB.VOLUME.length * 6, 51, "#ffd166", { shadow: "#7a4a10" });
    ctx.fillStyle = "#b455ff";
    ctx.fillRect(52, 48, 136, 1);

    // a VITRINE: sorteados de Kanto, alguns fundidos. Cada um entra com um
    // atraso próprio, senão a troca é um estalo de três bichos de uma vez.
    (this.vitrine || []).forEach((v, i) => {
      const bob = Math.sin(this.t * 2.2 + i * 1.4) * 2;
      const img = Assets.mon(v.id, 1);
      if (!img) return;
      const entrou = Math.min(1, Math.max(0, (this.trocaT - i * 0.12) / VITRINE.entra));
      ctx.globalAlpha = entrou;
      // sobe um tiquinho enquanto aparece: dá o "pousar" que o corte não tem
      // no tamanho de verdade (64): encolher apagava pupila e boca
      ctx.drawImage(img, 20 + i * 70, 48 + bob + (1 - entrou) * 6, 64, 64);
      ctx.globalAlpha = 1;
    });
    if (glitch) ctx.drawImage(nullmonSprite(((this.t * 6) | 0) * 31 + 5), 96, 60, 48, 48);

    if (this.tela === "comandos") return this.renderComandos(ctx);

    const w = 96, x = 120 - w / 2, y = 114 - (this.items.length - 3) * LINE_H;
    panel(ctx, x, y, w, this.items.length * LINE_H + 8);
    const idioma = (DB.IDIOMAS || []).find((l) => l.id === Opcoes.get("idioma"));
    this.items.forEach((it, i) => {
      const texto = it === "IDIOMA" ? (idioma?.nome || "PORTUGUÊS") : it;
      drawText(ctx, texto, x + 16, y + 4 + i * LINE_H, PAL.ink);
      if (i === this.index) cursor(ctx, x + 7, y + 4 + i * LINE_H);
    });

    drawText(ctx, "FANGAME NÃO OFICIAL - VOL. 4", 30, 150, "#8f7ab0");
  }
}
