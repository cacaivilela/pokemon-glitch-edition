// O HALL DA FAMA DE KANTO (pedido do CAIO, nov/2026: "agora o hall da fama").
//
// Depois de vencer o AZUL na SALA DA LIGA (src/data/liga-kanto.js), a porta de
// cima leva pro HALL DA FAMA. Lá o PROF. CARVALHO registra o seu time na
// máquina, no mesmo jeito tecnológico da sala da Liga:
//
//   ABRE    a tela escura com a grade de luz, e o título se escrevendo
//   UM      cada Pokémon do time, um de cada vez: aparece como HOLOGRAMA azul
//           e vira de verdade (uma linha de luz passa e deixa ele colorido),
//           com o grito, o nome e o nível
//   TODOS   o time inteiro junto, com o seu nome de CAMPEÃO e o número do
//           registro
//
// O registro fica salvo em `st.hallDaFama` (uma lista: cada vitória é uma
// entrada com o time daquele dia). `aoFim` roda depois.
//
// O DE BRAGLITCH (`garras: true`, pedido do CAIO, nov/2026: "a cutscene de
// aparecer o pkmn vai ser umas 20 garras montam a pixelart, e vai aparecer o
// personagem que vc não escolheu"): cada Pokémon chega em VINTE PEDAÇOS (5x4),
// cada um trazido por uma GARRA que desce do teto, encaixa e sobe; e no fim o
// GÊMEO (`gemeo`: o nome dele) fica do seu lado na foto do time.
import { Assets } from "../core/assets.js";
import { Audio2 } from "../core/audio.js";
import { Dialogue } from "../systems/dialogue.js";
import { gritoDe, tocarGrito } from "../systems/gritos.js";
import { fade, drawText } from "../core/gfx.js";
import { DB } from "../data/index.js";

const W = 240, H = 160;
const prende = (t) => Math.max(0, Math.min(1, t));
const T_ABRE = 1.6, T_UM = 2.2, T_TODOS = 3.5;
// AS GARRAS (o de Braglitch): 20 pedaços, um a cada GARRA_PASSO, cada viagem GARRA_VIAGEM
const GARRA_PASSO = 0.07, GARRA_VIAGEM = 0.5, GARRA_FIM = 19 * GARRA_PASSO + GARRA_VIAGEM, T_GARRAS = GARRA_FIM + 1.4;

/** a GARRINHA que carrega um pedaço: o cabo até o teto, a cabeça e os dedos */
function garrinha(ctx, x, y, aberta) {
  ctx.fillStyle = "#3a3e48"; ctx.fillRect(Math.round(x), -2, 1, Math.max(0, Math.round(y) + 2));
  ctx.fillStyle = "#202430"; ctx.fillRect(Math.round(x) - 3, Math.round(y) - 4, 7, 3);
  ctx.fillStyle = "#f0c020"; ctx.fillRect(Math.round(x) - 2, Math.round(y) - 4, 5, 1);
  const a = aberta ? 4 : 2;
  ctx.fillStyle = "#a8aeb8";
  ctx.fillRect(Math.round(x) - a, Math.round(y) - 1, 1, 3); ctx.fillRect(Math.round(x) + a, Math.round(y) - 1, 1, 3);
}

export class HallDaFamaScene {
  /** args: { st, aoFim?, garras?, gemeo?, titulo? } */
  enter(args = {}) {
    this.st = args.st;
    this.aoFim = args.aoFim || null;
    this.garras = !!args.garras;
    this.gemeo = args.gemeo || null;
    this.titulo = args.titulo || "HALL DA FAMA";
    this.T_UM = this.garras ? T_GARRAS : T_UM;
    this.time = (this.st.party || []).filter(Boolean);
    // em BRAGLITCH a luta foi em DUPLA: o time do GÊMEO entra também (os 12)
    this.doGemeo = new Set();
    for (const m of args.timeGemeo || []) { this.time.push(m); this.doGemeo.add(m); }
    this.time.forEach((m) => { Assets.mon(m.species, m.seed); Assets.vivo(m); });
    // O REGISTRO: o time de hoje entra no HALL (salvo no jogo)
    const lista = (this.st.hallDaFama ||= []);
    lista.push({
      quando: Date.now(), nome: this.st.player?.name || "VOCÊ",
      time: this.time.map((m) => ({ species: m.species, nickname: m.nickname, level: m.level, shiny: !!m.shiny, luminoso: !!m.luminoso, seed: m.seed,
                                    ...(this.doGemeo.has(m) ? { doGemeo: true } : {}) })),
      ...(this.garras ? { regiao: "braglitch", gemeo: this.gemeo } : {}),
    });
    this.numero = lista.length;
    this.dlg = new Dialogue();
    this.t = 0;
    this.fadeA = 1; this.fadeDir = -1;
    this.saindo = false; this.acabou = false;
    this.gritou = -1;
    this.flash = 0;
    Audio2.stopLoop();
    Audio2.tone(523, 0.1); Audio2.tone(659, 0.1); Audio2.tone(784, 0.2);
  }

  get total() { return T_ABRE + this.time.length * this.T_UM + T_TODOS; }

  update(dt) {
    this.t += dt;
    if (this.fadeDir) {
      this.fadeA = prende(this.fadeA + this.fadeDir * dt * 2.5);
      if (this.fadeDir < 0 && this.fadeA <= 0) this.fadeDir = 0;
    }
    this.flash = Math.max(0, this.flash - dt * 2.5);
    this.dlg.update(dt);
    if (this.saindo) {
      if (this.fadeA >= 1) { this.game.scenes.pop(); this.aoFim?.(); }
      return;
    }
    // o GRITO de cada um quando ele vira de verdade
    const i = Math.floor((this.t - T_ABRE) / this.T_UM);
    const dentro = this.t - T_ABRE - i * this.T_UM;
    // (com as garras ele grita quando o último pedaço encaixa)
    if (i >= 0 && i < this.time.length && dentro > (this.garras ? GARRA_FIM : 0.7) && this.gritou < i) {
      this.gritou = i;
      tocarGrito(this.time[i]);
    }
    if (!this.todos && this.t >= T_ABRE + this.time.length * this.T_UM) {
      this.todos = true; this.flash = 1;
      Audio2.tone(784, 0.12); Audio2.tone(988, 0.12); Audio2.tone(1319, 0.3);
    }
    if (!this.acabou && this.t >= this.total) {
      this.acabou = true;
      this.dlg.say([`REGISTRO Nº ${this.numero} DO HALL DA FAMA:`, `${this.st.player?.name || "VOCÊ"} E O SEU TIME, CAMPEÕES DE KANTO!`],
        () => { this.saindo = true; this.fadeDir = 1; });
    }
  }

  /** a imagem do Pokémon (o quadro animado, ou o parado com a cor dele) */
  arte(m) {
    return Assets.vivo(m) || (Assets.mon(m.species, m.seed) && Assets.comCor(Assets.mon(m.species, m.seed), m, false));
  }

  /** a mesma imagem em HOLOGRAMA (azul, com linhas) */
  holo(img) {
    const cache = (this._holo ||= new WeakMap());
    if (cache.has(img)) return cache.get(img);
    const cv = document.createElement("canvas");
    cv.width = img.width; cv.height = img.height;
    const g = cv.getContext("2d");
    g.drawImage(img, 0, 0);
    g.globalCompositeOperation = "source-atop";
    g.fillStyle = "rgba(90,230,255,0.85)";
    g.fillRect(0, 0, cv.width, cv.height);
    g.globalCompositeOperation = "destination-out";
    g.fillStyle = "rgba(0,0,0,0.55)";
    for (let y = 1; y < cv.height; y += 2) g.fillRect(0, y, cv.width, 1);
    cache.set(img, cv);
    return cv;
  }

  render(ctx) {
    // o FUNDO: escuro com a grade de luz, andando devagar
    ctx.fillStyle = "#04060c";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = `rgba(80,220,255,${0.18 + 0.08 * Math.sin(this.t * 3)})`;
    ctx.lineWidth = 1;
    const anda = (this.t * 6) % 16;
    for (let x = 0; x <= W; x += 16) { ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); ctx.stroke(); }
    for (let y = -16; y <= H; y += 16) { ctx.beginPath(); ctx.moveTo(0, y + anda + 0.5); ctx.lineTo(W, y + anda + 0.5); ctx.stroke(); }
    // o TÍTULO se escrevendo
    const titulo = this.titulo;
    const n = Math.min(titulo.length, Math.floor(this.t * 12));
    drawText(ctx, titulo.slice(0, n), 120 - titulo.length * 3, 8, "#8af4ff");
    if (this.t < T_ABRE) return this.fim(ctx);
    const i = Math.floor((this.t - T_ABRE) / this.T_UM);
    if (!this.todos && i < this.time.length) {
      if (this.garras) this.umDeGarras(ctx, this.time[i], this.t - T_ABRE - i * this.T_UM);
      else this.um(ctx, this.time[i], this.t - T_ABRE - i * this.T_UM);
    } else this.todosJuntos(ctx, this.t - T_ABRE - this.time.length * this.T_UM);
    this.fim(ctx);
  }

  /** UM POKÉMON: holograma → linha de luz passando → de verdade */
  um(ctx, m, e) {
    const img = this.arte(m);
    if (!img) return;
    const L = 72, x = 120 - L / 2, y = 30;
    // o projetor no chão e o feixe
    ctx.save();
    ctx.globalAlpha = 0.7 + 0.3 * Math.sin(this.t * 6);
    ctx.strokeStyle = "#8af4ff";
    ctx.beginPath(); ctx.ellipse(120, y + L + 2, 26, 6, 0, 0, Math.PI * 2); ctx.stroke();
    const g = ctx.createLinearGradient(0, y + L + 2, 0, y - 6);
    g.addColorStop(0, "rgba(90,230,255,0.3)"); g.addColorStop(1, "rgba(90,230,255,0)");
    ctx.globalAlpha = 1; ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(96, y + L + 2); ctx.lineTo(144, y + L + 2); ctx.lineTo(160, y - 6); ctx.lineTo(80, y - 6); ctx.closePath(); ctx.fill();
    ctx.restore();
    // aparecendo (0–0,4), holograma (até 0,7), virando de verdade de baixo pra cima (0,7–1,2)
    const aparece = prende(e / 0.4);
    const vira = prende((e - 0.7) / 0.5);
    const h = Math.round(L * vira);
    ctx.save();
    ctx.globalAlpha = aparece * (0.65 + 0.2 * Math.sin(this.t * 8));
    ctx.drawImage(this.holo(img), 0, 0, img.width, img.height * (1 - vira), x, y, L, L - h);
    ctx.restore();
    if (h > 0) {
      ctx.drawImage(img, 0, img.height * (1 - vira), img.width, img.height * vira, x, y + L - h, L, h);
      if (vira < 1) { ctx.fillStyle = "#c8faff"; ctx.fillRect(x - 4, y + L - h - 1, L + 8, 1); }
    }
    // o NOME e o NÍVEL, entrando depois que ele firmou
    if (e > 1.2) {
      const nome = `${m.nickname}`, nv = `NV ${m.level}`;
      drawText(ctx, nome, 120 - nome.length * 3, 112, "#ffffff");
      drawText(ctx, nv, 120 - nv.length * 3, 122, "#8af4ff");
    }
  }

  /** UM POKÉMON MONTADO PELAS GARRAS: a imagem em 5x4 pedaços; cada pedaço
   *  vem pendurado numa garra lá de cima (cada um sai num tempo e de um lugar),
   *  encaixa, a garra abre e sobe. Depois do último, um brilho e o nome. */
  umDeGarras(ctx, m, e) {
    const img = this.arte(m);
    if (!img) return;
    const L = 72, x0 = 120 - L / 2, y0 = 30;
    const COL = 5, LIN = 4, pw = img.width / COL, ph = img.height / LIN, dw = L / COL, dh = L / LIN;
    // a sombra onde ele vai ficar e a plataforma
    ctx.fillStyle = "rgba(90,230,255,0.18)";
    ctx.beginPath(); ctx.ellipse(120, y0 + L + 2, 30, 6, 0, 0, Math.PI * 2); ctx.fill();
    let n = 0;
    for (let j = LIN - 1; j >= 0; j--) for (let i = 0; i < COL; i++, n++) {
      // de baixo pra cima, cada pedaço um tiquinho depois do outro
      const ini = n * GARRA_PASSO, k = (e - ini) / GARRA_VIAGEM;
      const ax = x0 + i * dw, ay = y0 + j * dh;
      const deX = ((n * 53) % 200) + 20 - dw / 2;              // de onde a garra vem (sempre o mesmo)
      if (k <= 0) continue;
      if (k >= 1) {
        ctx.drawImage(img, i * pw, j * ph, pw, ph, ax, ay, dw, dh);
        // a garra soltando e subindo
        const sobe = Math.min(1, (e - ini - GARRA_VIAGEM) / 0.25);
        if (sobe < 1) garrinha(ctx, ax + dw / 2, ay - 2 - sobe * (ay + 10), true);
        continue;
      }
      const q = k * k * (3 - 2 * k);
      const px = deX + (ax - deX) * q, py = -dh - 6 + (ay + dh + 6) * q;
      ctx.drawImage(img, i * pw, j * ph, pw, ph, Math.round(px), Math.round(py), dw, dh);
      garrinha(ctx, px + dw / 2, py - 2, false);
    }
    // o BRILHO quando o último pedaço encaixa
    const fim = e - GARRA_FIM;
    if (fim > 0 && fim < 0.4) {
      ctx.fillStyle = `rgba(255,255,255,${0.6 * (1 - fim / 0.4)})`;
      ctx.fillRect(x0 - 4, y0 - 4, L + 8, L + 8);
    }
    if (e > GARRA_FIM + 0.2) {
      const nome = `${m.nickname}`, nv = `NV ${m.level}`;
      const dono = this.doGemeo.has(m) ? `DO ${this.gemeo}` : `DE ${this.st.player?.name || "VOCÊ"}`;
      drawText(ctx, nome, 120 - nome.length * 3, 112, "#ffffff");
      drawText(ctx, nv, 120 - nv.length * 3, 122, "#8af4ff");
      drawText(ctx, dono, 120 - dono.length * 3, 132, "#ffe080");
    }
  }

  /** O TIME TODO JUNTO, com o nome do CAMPEÃO */
  todosJuntos(ctx, e) {
    const fileiras = this.time.length > 6
      ? [this.time.filter((m) => !this.doGemeo.has(m)), this.time.filter((m) => this.doGemeo.has(m))]
      : [this.time];
    const L = fileiras.length > 1 ? 26 : 36;
    fileiras.forEach((fila, f) => {
      const larg = fila.length * (L + 2);
      fila.forEach((m, k) => {
        const img = this.arte(m);
        if (!img) return;
        const x = Math.round(120 - larg / 2 + k * (L + 2)), y = (fileiras.length > 1 ? 22 + f * 30 : 44) + (k % 2) * 4;
        const pulo = Math.round(Math.abs(Math.sin(this.t * 4 + k + f)) * 2);
        ctx.drawImage(img, x, y - pulo, L, L);
      });
    });
    // em BRAGLITCH, você e o GÊMEO na frente do time (o personagem que você não escolheu)
    if (this.gemeo) {
      const voce = Assets.actor("hero")?.down?.[0], ele = Assets.actor(DB.GEMEO?.sprite?.[this.gemeo])?.down?.[0];
      const pulo = (k) => Math.round(Math.abs(Math.sin(this.t * 4 + k)) * 2);
      // (com os 12 o time ocupa até a altura 82: vocês dois ficam logo embaixo)
      const pe = this.time.length > 6 ? 98 : 84;
      if (voce) ctx.drawImage(voce, 104 - voce.width, pe - voce.height - pulo(0));
      if (ele) ctx.drawImage(ele, 136, pe - ele.height - pulo(2));
    }
    if (e > 0.6) {
      const a = this.gemeo ? `CAMPEÕES: ${this.st.player?.name || "VOCÊ"} E ${this.gemeo}` : `CAMPEÃO: ${this.st.player?.name || "VOCÊ"}`, b = `REGISTRO Nº ${this.numero}`;
      const ya = this.time.length > 6 ? 102 : 100;
      drawText(ctx, a, 120 - a.length * 3, ya, "#ffe080");
      drawText(ctx, b, 120 - b.length * 3, ya + 12, "#8af4ff");
    }
  }

  fim(ctx) {
    if (this.flash > 0) fade(ctx, this.flash, "#ffffff");
    this.dlg.render(ctx);
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }
}
