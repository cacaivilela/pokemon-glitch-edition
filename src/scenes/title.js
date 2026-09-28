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
import { mapArt, mapArtInteira, mapOverlay } from "../core/sprites.js";
import { isoLigado, origem, noChao, relevo, chaoEm, tilesVisiveis, coluna, fontesDoTeto } from "../core/isometrico.js";
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
/** As duas portas de entrada do jogo novo (ver `newGame` em src/main.js). */
const REGIOES_INICIO = [
  { id: "kanto", nome: "KANTO", texto: ["VILA PALETA. PROF. CARVALHO,", "OS 151 E A FENDA DO GLITCH."] },
  { id: "braglitch", nome: "BRAGLITCH", texto: ["SÃO LUCARIO DO SUL. PROFA. IPÊ,", "O APAGÃO E OS REDEMOINHOS."] },
];

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
    this.andarCamera(dt);
    this.trocaT += dt;
    if (this.trocaT >= VITRINE.troca) {
      this.trocaT = 0;
      this.vitrine = this.proxima;
      this.proxima = this.sortear();      // e já pede os desenhos da leva seguinte
    }
    if (DB.CONFIG?.glitchMode && Math.random() < dt * 1.4) Glitch.hit(0.35);
    if (this.tela === "comandos") return this.updateComandos();
    if (this.tela === "regiao") return this.updateRegiao();
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
      this.game.newGame(REGIOES_INICIO[this.regiaoIdx].id);
      this.comecar();
    }
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

  /** O FUNDO DO MENU PRINCIPAL: a fenda, a 011GLITCHDIMENSION110. Roxo
   *  escuro, faixas de cor escorregando de lado devagar e pixels caindo — tudo
   *  com posição tirada do relógio e do índice, sem sorteio nenhum: é o visual
   *  corrompido SEM o chuvisco, que pisca e cansa a vista numa tela parada. */
  // ------------------------------------------------ O FUNDO: O MUNDO PASSANDO
  // Atrás do logo passa o jogo de verdade: uma câmera que voa sozinha por
  // KANTO ou por BRAGLITCH (sorteado a cada vez que o título abre) e NUNCA
  // PARA. Ela escolhe uma saída do mapa em que está, vai até ela fazendo curva
  // (sem virar de estalo), e atravessa pro vizinho — que já está desenhado
  // colado, como no jogo, então a travessia não tem corte. Voltar por onde veio
  // só quando não tem outra saída.

  /** Os mapas por onde a câmera pode passar: abertos, com desenho, com vizinho. */
  mapasDoPasseio(braglitch) {
    return Object.entries(DB.KANTO || {})
      .filter(([, g]) => !!g.braglitch === braglitch && !g.content?.interior
        && (g.connections || []).some((c) => c.to && DB.KANTO[c.to]))
      .map(([id]) => id);
  }

  comecarPasseio() {
    let brag = Math.random() < 0.5;
    let lista = this.mapasDoPasseio(brag);
    if (!lista.length) { brag = !brag; lista = this.mapasDoPasseio(brag); }
    if (!lista.length) return null;
    const id = lista[(Math.random() * lista.length) | 0];
    const g = DB.KANTO[id];
    const cam = { mapa: id, x: g.w * 8, y: g.h * 8, dx: 1, dy: 0, veio: null, alvo: null };
    this.escolherSaida(cam);
    return cam;
  }

  /** Onde o vizinho `c` começa, nas coordenadas (em tiles) do mapa `g`. */
  origemDoVizinho(g, c) {
    const d = DB.KANTO[c.to];
    if (!d) return null;
    if (c.dir === "up") return { x: c.offset, y: -d.h };
    if (c.dir === "down") return { x: c.offset, y: g.h };
    if (c.dir === "left") return { x: -d.w, y: c.offset };
    return { x: g.w, y: c.offset };
  }

  /** A próxima saída: um ponto já DENTRO do vizinho, no meio da borda que ele
   *  divide com este mapa (atravessar é chegar lá). */
  escolherSaida(cam) {
    const g = DB.KANTO[cam.mapa];
    const saidas = (g.connections || []).filter((c) => c.to && DB.KANTO[c.to]);
    const novas = saidas.filter((c) => c.to !== cam.veio);
    const c = (novas.length ? novas : saidas)[(Math.random() * (novas.length || saidas.length)) | 0];
    if (!c) { cam.alvo = null; return; }
    const o = this.origemDoVizinho(g, c), d = DB.KANTO[c.to];
    // o trecho da borda que os dois mapas dividem, e o meio dele
    const T = 16;
    let ax, ay;
    if (c.dir === "up" || c.dir === "down") {
      const a = Math.max(0, o.x), b = Math.min(g.w, o.x + d.w);
      ax = ((a + b) / 2) * T; ay = c.dir === "up" ? -3 * T : (g.h + 3) * T;
    } else {
      const a = Math.max(0, o.y), b = Math.min(g.h, o.y + d.h);
      ay = ((a + b) / 2) * T; ax = c.dir === "left" ? -3 * T : (g.w + 3) * T;
    }
    cam.alvo = { x: ax, y: ay, c };
    mapArt(c.to);                              // o desenho do vizinho já vem vindo
  }

  andarCamera(dt) {
    if (!this.cam) this.cam = this.comecarPasseio();
    const cam = this.cam;
    if (!cam) return;
    const VIRA = 1.6;                          // quão rápido faz a curva
    const T = 16;
    // DE VEZ EM QUANDO ELA ACELERA OU FREIA: a cada 3 a 8 segundos sorteia uma
    // velocidade nova (entre 10 e 130 pixels por segundo) e chega nela aos
    // poucos. Nunca zero: frear é ir devagar, não parar.
    cam.vel ??= 34;
    cam.velAlvo ??= 34;
    cam.troca = (cam.troca ?? 4) - dt;
    if (cam.troca <= 0) {
      cam.troca = 3 + Math.random() * 5;
      cam.velAlvo = 10 + Math.random() * 120;
    }
    cam.vel += (cam.velAlvo - cam.vel) * Math.min(1, 0.8 * dt);
    const VEL = cam.vel;
    const g = DB.KANTO[cam.mapa];
    // sem saída nenhuma: passeia pelo próprio mapa, de ponto em ponto
    if (!cam.alvo) cam.alvo = { x: Math.random() * g.w * T, y: Math.random() * g.h * T };
    const vx = cam.alvo.x - cam.x, vy = cam.alvo.y - cam.y, dist = Math.hypot(vx, vy) || 1;
    // a direção vira aos poucos pro alvo: curva, não estalo
    const k = Math.min(1, VIRA * dt);
    cam.dx += (vx / dist - cam.dx) * k;
    cam.dy += (vy / dist - cam.dy) * k;
    const n = Math.hypot(cam.dx, cam.dy) || 1;
    cam.dx /= n; cam.dy /= n;
    cam.x += cam.dx * VEL * dt;
    cam.y += cam.dy * VEL * dt;
    if (!cam.alvo.c) { if (dist < 20) cam.alvo = null; return; }
    // passou da borda pra dentro do vizinho: o vizinho vira o mapa da vez
    const o = this.origemDoVizinho(g, cam.alvo.c);
    const d = DB.KANTO[cam.alvo.c.to];
    const tx = cam.x / T - o.x, ty = cam.y / T - o.y;
    if (tx >= 0 && ty >= 0 && tx < d.w && ty < d.h) {
      cam.veio = cam.mapa;
      cam.mapa = cam.alvo.c.to;
      cam.x = tx * T; cam.y = ty * T;
      this.escolherSaida(cam);
    } else if (dist < 6) this.escolherSaida(cam);   // o alvo caiu fora do vizinho: outra saída
  }

  /** Desenha o mundo passando. Devolve false enquanto o desenho do mapa não
   *  chegou (aí fica o fundo da fenda, de antes). */
  fundoMundo(ctx) {
    const cam = this.cam;
    const art = cam && mapArt(cam.mapa);
    if (!art) return false;
    const T = 16, W = 240, H = 160;
    const g = DB.KANTO[cam.mapa];
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
    // o mapa da vez e os vizinhos colados nele
    const pedacos = [{ id: cam.mapa, x: 0, y: 0 }];
    for (const c of g.connections || []) {
      const o = c.to && this.origemDoVizinho(g, c);
      if (o) pedacos.push({ id: c.to, x: o.x * T, y: o.y * T });
    }
    const desenhar = (c, ox, oy) => {
      for (const p of pedacos) {
        const a = mapArt(p.id);
        if (a) c.drawImage(a, p.x - ox, p.y - oy);
        const over = mapOverlay(p.id);
        if (over) c.drawImage(over, p.x - ox, p.y - oy);
      }
    };
    if (isoLigado()) {
      // no ISOMÉTRICO o passeio é o mundo de quina de verdade: o chão girado e
      // as paredes, árvores e prédios subindo em blocos, como no jogo
      const z = chaoEm(relevo(cam.mapa, g), cam.x / T, cam.y / T);
      const o = origem(W, H, cam.x, cam.y, z);
      noChao(ctx, o, (c) => desenhar(c, 0, 0));
      this.blocosDoPasseio(ctx, o, pedacos);
    } else {
      desenhar(ctx, Math.round(cam.x - W / 2), Math.round(cam.y - H / 2));
    }
    // escurece pro logo e o menu continuarem lidos, com um toque do roxo da fenda
    ctx.fillStyle = "rgba(20,10,36,0.45)";
    ctx.fillRect(0, 0, W, H);
    return true;
  }

  /** Os BLOCOS do passeio no isométrico, mapa por mapa (os de trás primeiro),
   *  com a mesma regra do jogo (src/core/isometrico.js): coluna onde o tile
   *  não está no nível zero, e prédio com o telhado e a fachada certos. */
  blocosDoPasseio(ctx, o, pedacos) {
    const T = 16, W = 240, H = 160;
    for (const p of [...pedacos].sort((a, b) => a.x + a.y - (b.x + b.y))) {
      const g = DB.KANTO[p.id];
      const art = mapArtInteira(p.id);
      if (!g || !art) continue;
      const org = { x: o.x + p.x - p.y, y: o.y + (p.x + p.y) / 2 };
      const r = relevo(p.id, g);
      const alt = (x, y) => (x < 0 || y < 0 || x >= g.w || y >= g.h ? 0 : r.topo[y * g.w + x]);
      const tetos = r.teto.some((t) => t >= 0) ? fontesDoTeto(r, art, T) : null;
      for (const t of tilesVisiveis(org, W, H, T, g.w, g.h)) {
        const z = alt(t.x, t.y), sul = alt(t.x, t.y + 1), leste = alt(t.x + 1, t.y);
        if (z === 0 && sul >= 0 && leste >= 0) continue;
        // o prédio: telhado da fileira de cima, fachada das fileiras de baixo
        // (a mesma conta do `fontePredio` de src/scenes/overworld.js)
        const i = t.y * g.w + t.x;
        let fonte = null;
        if (tetos && r.teto[i] >= 0) {
          const blocos = Math.max(1, Math.round((r.topo[i] - r.base[i]) / T));
          const de = Math.max(r.cimaY[i], t.y - blocos + 1), h = (t.y - de + 1) * T;
          fonte = { tampo: [(tetos[i] % g.w) * T, Math.floor(tetos[i] / g.w) * T],
                    sul: [t.x * T, de * T, h], leste: [t.x * T, de * T, h] };
        }
        coluna(ctx, org, art, T, t.x, t.y, z, sul, leste, z !== 0, fonte);
      }
    }
  }

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
    if (!this.fundoMundo(ctx)) this.fundoFenda(ctx);

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
    if (this.tela === "regiao") return this.renderRegiao(ctx);

    const w = 96, x = 120 - w / 2, y = 114 - (this.items.length - 3) * LINE_H;
    panel(ctx, x, y, w, this.items.length * LINE_H + 8);
    const idioma = (DB.IDIOMAS || []).find((l) => l.id === Opcoes.get("idioma"));
    this.items.forEach((it, i) => {
      const texto = it === "IDIOMA" ? (idioma?.nome || "PORTUGUÊS") : it;
      drawText(ctx, texto, x + 16, y + 4 + i * LINE_H, PAL.ink);
      if (i === this.index) cursor(ctx, x + 7, y + 4 + i * LINE_H);
    });

    drawText(ctx, "FANGAME NÃO OFICIAL - VOL. 5", 30, 150, "#8f7ab0");
  }
}
