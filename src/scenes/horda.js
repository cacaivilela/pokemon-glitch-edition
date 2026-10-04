// A CUTSCENE DA HORDA: antes da luta de 1 contra 3 a 5 (src/scenes/grupobattle.js,
// `horda`). Uns 3,5 segundos, sempre retos (o isométrico não entra aqui):
//
//   FARFALHA  o mato alto, de noite ou de dia, e as moitas começando a tremer
//             — uma por bicho, cada uma com um "!" pulando em cima.
//   PULAM     de cada moita sai uma SILHUETA preta num arco, uma depois da
//             outra, e cai no lugar dela levantando poeira; a tela treme a
//             cada pouso.
//   REVELA    as silhuetas ganham cor de uma vez, um contorno vermelho pisca
//             em volta de todos e o "HORDA!" cai do alto com um soco de zoom.
//
// Quem chama: o mato (src/scenes/overworld.js, `startHorda`), com `aoFim`
// abrindo a batalha; e o site das cutscenes (cutscenes.html, ?hordacena=),
// com `sozinha: true` — aí a frase aparece no fim e a cena espera o A.
import { DB } from "../data/index.js";
import { Assets } from "../core/assets.js";
import { Audio2 } from "../core/audio.js";
import { Dialogue } from "../systems/dialogue.js";
import { drawText, fade } from "../core/gfx.js";

const W = 240, H = 160;
const FASES = [["farfalha", 1.1], ["pulam", 1.6], ["revela", 1.0]];
/** onde cada um cai (de trás pra frente), e de que moita sai, por tamanho */
const POSICOES = {
  3: [[70, 96], [120, 84], [170, 96]],
  4: [[60, 98], [104, 84], [146, 84], [188, 98]],
  5: [[44, 100], [84, 84], [120, 98], [156, 84], [196, 100]],
};
const prende = (t) => Math.max(0, Math.min(1, t));

export class HordaScene {
  /** args: { foes, aoFim?, sozinha? } */
  enter(args = {}) {
    this.foes = (args.foes || []).filter(Boolean).slice(0, 5);
    this.aoFim = args.aoFim || null;
    this.sozinha = !!args.sozinha;
    for (const m of this.foes) Assets.mon(m.species, m.seed);
    const pos = POSICOES[Math.max(3, Math.min(5, this.foes.length))] || POSICOES[5];
    // cada bicho: a moita (embaixo, onde ele estava escondido) e o lugar do pouso
    this.bichos = this.foes.map((mon, i) => {
      const [x, y] = pos[i] || pos[pos.length - 1];
      return { mon, x, y, moitaX: x + (i % 2 ? 14 : -14), moitaY: 140, atraso: i * 0.22, pousou: false };
    });
    this.dlg = new Dialogue();
    this.t = 0;
    this.i = 0;
    this.tf = 0;
    this.poeira = [];
    this.folhas = [];
    this.tremor = 0;
    this.flash = 0;
    this.fadeA = 1;
    this.fadeDir = -1;
    this.saindo = false;
    this.acabou = false;
    this.noite = false;
    Audio2.stopLoop();
    Audio2.noise(0.4, 0.3);
  }

  get fase() { return FASES[this.i]?.[0] || "fim"; }
  get k() { return prende(this.tf / (FASES[this.i]?.[1] || 1)); }

  update(dt) {
    this.t += dt;
    this.tf += dt;
    if (this.fadeDir) {
      this.fadeA = prende(this.fadeA + this.fadeDir * dt * (this.saindo ? 4 : 4));
      if (this.fadeDir < 0 && this.fadeA <= 0) this.fadeDir = 0;
    }
    this.flash = Math.max(0, this.flash - dt * 3);
    this.tremor = Math.max(0, this.tremor - dt * 10);
    this.dlg.update(dt);
    if (this.saindo) {
      if (this.fadeA >= 1) { this.game.scenes.pop(); this.aoFim?.(); }
      return;
    }
    if (!this.acabou && this.tf >= (FASES[this.i]?.[1] || 0)) {
      this.i++;
      this.tf = 0;
      if (this.fase === "revela") {
        this.flash = 0.8;
        this.tremor = 4;
        Audio2.tone(196, 0.2, "square", 0.5); Audio2.tone(392, 0.25, "square", 0.45);
      }
      if (this.fase === "fim") this.terminar();
    }
    // as folhas voando das moitas que tremem
    if (this.fase === "farfalha" || (this.fase === "pulam" && this.tf < 0.6)) {
      for (const b of this.bichos) {
        if (Math.random() < dt * 9) {
          this.folhas.push({ x: b.moitaX + (Math.random() - 0.5) * 16, y: b.moitaY - 8, vx: (Math.random() - 0.5) * 40,
                             vy: -30 - Math.random() * 40, vida: 1 });
        }
      }
      if (Math.random() < dt * 6) Audio2.noise(0.05, 0.15);
    }
    for (const f of this.folhas) { f.x += f.vx * dt; f.y += f.vy * dt; f.vy += 90 * dt; f.vida -= dt * 1.2; }
    this.folhas = this.folhas.filter((f) => f.vida > 0);
    // os pousos: poeira e tremor
    if (this.fase === "pulam") {
      for (const b of this.bichos) {
        if (!b.pousou && this.tf - b.atraso >= 0.55) {
          b.pousou = true;
          this.tremor = Math.max(this.tremor, 2.5);
          Audio2.tone(110 + Math.random() * 30, 0.08, "triangle", 0.5);
          for (let j = 0; j < 10; j++) {
            this.poeira.push({ x: b.x + (Math.random() - 0.5) * 30, y: b.y, vx: (Math.random() - 0.5) * 50, vy: -Math.random() * 18, vida: 1 });
          }
        }
      }
    }
    for (const p of this.poeira) { p.x += p.vx * dt; p.y += p.vy * dt; p.vida -= dt * 1.8; }
    this.poeira = this.poeira.filter((p) => p.vida > 0);
  }

  terminar() {
    if (this.acabou) return;
    this.acabou = true;
    if (this.sozinha) {
      const nome = this.foes[0]?.nickname || DB.SPECIES[this.foes[0]?.species]?.name || "?";
      const frase = (DB.DUPLA_TEXTO?.horda || "UMA HORDA DE {MON} APARECEU!").replace("{MON}", nome);
      this.dlg.say(frase, () => { this.saindo = true; this.fadeDir = 1; });
    } else { this.saindo = true; this.fadeDir = 1; }
  }

  render(ctx) {
    ctx.save();
    if (this.tremor > 0) ctx.translate(Math.round((Math.random() - 0.5) * this.tremor), Math.round((Math.random() - 0.5) * this.tremor));
    this.fundo(ctx);
    for (const b of this.bichos) this.moita(ctx, b);
    // os bichos, de trás (mais alto na tela) pra frente
    for (const b of [...this.bichos].sort((a, c) => a.y - c.y)) this.bicho(ctx, b);
    for (const f of this.folhas) {
      ctx.globalAlpha = prende(f.vida);
      ctx.fillStyle = "#4fa04a";
      ctx.fillRect(Math.round(f.x), Math.round(f.y), 2, 1);
    }
    for (const p of this.poeira) {
      ctx.globalAlpha = prende(p.vida) * 0.7;
      ctx.fillStyle = "#d8c8a0";
      ctx.fillRect(Math.round(p.x), Math.round(p.y), 2, 2);
    }
    ctx.globalAlpha = 1;
    if (this.fase === "revela" || this.fase === "fim") this.letreiro(ctx);
    ctx.restore();
    if (this.flash > 0) fade(ctx, this.flash, "#ffffff");
    this.dlg.render(ctx);
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }

  /** o campo: céu, horizonte e as fileiras de mato alto */
  fundo(ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, 70);
    g.addColorStop(0, "#5aa8e0");
    g.addColorStop(1, "#bfe4f2");
    ctx.fillStyle = g;
    ctx.fillRect(-8, 0, W + 16, 70);
    ctx.fillStyle = "#3d8a3a";
    ctx.fillRect(-8, 66, W + 16, H);
    for (let fil = 0; fil < 6; fil++) {
      const y = 70 + fil * 16;
      ctx.fillStyle = fil % 2 ? "#2f7a30" : "#357f34";
      for (let x = -8 + (fil % 2) * 6; x < W + 8; x += 12) {
        const balanco = Math.sin(this.t * 3 + x * 0.1 + fil) * 1.5;
        ctx.beginPath();
        ctx.moveTo(x, y + 10); ctx.lineTo(x + 3 + balanco, y); ctx.lineTo(x + 6, y + 10); ctx.fill();
      }
    }
    // um véu escurecendo as bordas: o olho vai pro meio
    const v = ctx.createRadialGradient(W / 2, 90, 40, W / 2, 90, 170);
    v.addColorStop(0, "rgba(0,0,0,0)");
    v.addColorStop(1, "rgba(0,0,0,.45)");
    ctx.fillStyle = v;
    ctx.fillRect(-8, -8, W + 16, H + 16);
  }

  /** a moita de onde o bicho sai: treme antes e com o "!" pulando em cima */
  moita(ctx, b) {
    const treme = this.fase === "farfalha" || (this.fase === "pulam" && this.tf < b.atraso + 0.1);
    const dx = treme ? Math.round(Math.sin(this.t * 40 + b.x) * 2) : 0;
    ctx.fillStyle = "#256b27";
    ctx.beginPath();
    ctx.ellipse(b.moitaX + dx, b.moitaY, 16, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#3f9a3c";
    for (let j = -2; j <= 2; j++) {
      ctx.beginPath();
      ctx.moveTo(b.moitaX + j * 6 + dx - 3, b.moitaY);
      ctx.lineTo(b.moitaX + j * 6 + dx, b.moitaY - 12 - Math.abs(j) * -2);
      ctx.lineTo(b.moitaX + j * 6 + dx + 3, b.moitaY);
      ctx.fill();
    }
    // o "!" de susto, um pouco depois que a moita começa a tremer
    const tExcl = this.fase === "farfalha" ? this.tf - b.atraso * 0.6 : this.fase === "pulam" && this.tf < b.atraso ? 1 : -1;
    if (tExcl > 0) {
      const pulo = Math.round(Math.abs(Math.sin(Math.min(tExcl, 0.3) / 0.3 * Math.PI)) * 4);
      drawText(ctx, "!", b.moitaX - 2, b.moitaY - 30 - pulo, "#ffd166", { shadow: "#7a1010" });
    }
  }

  /** o bicho: escondido na farfalhada, silhueta no pulo, cor na revelação */
  bicho(ctx, b) {
    const img = Assets.mon(b.mon.species, b.mon.seed);
    if (!img || this.fase === "farfalha") return;
    const cor = img && Assets.comCor(img, b.mon);
    let x = b.x, y = b.y;
    if (this.fase === "pulam") {
      const k = prende((this.tf - b.atraso) / 0.55);
      if (k <= 0) return;
      // o arco: sai da moita, sobe e cai no lugar
      x = b.moitaX + (b.x - b.moitaX) * k;
      y = b.moitaY + (b.y - b.moitaY) * k - Math.sin(k * Math.PI) * 34;
    }
    const lado = 48, dx = Math.round(x - lado / 2), dy = Math.round(y - lado);
    // a sombra no chão
    ctx.fillStyle = "rgba(0,0,0,.3)";
    ctx.beginPath(); ctx.ellipse(b.x, b.y, 14, 4, 0, 0, Math.PI * 2); ctx.fill();
    const sil = Assets.silhueta(img);
    if (this.fase === "pulam") {
      ctx.save(); ctx.filter = "brightness(0)"; ctx.drawImage(sil, dx, dy, lado, lado); ctx.restore();
      return;
    }
    ctx.drawImage(cor, dx, dy, lado, lado);
    // o preto saindo de cima da cor, e o contorno vermelho piscando
    const preto = Math.max(0, 1 - this.tf * 3);
    if (preto > 0) { ctx.save(); ctx.globalAlpha = preto; ctx.filter = "brightness(0)"; ctx.drawImage(sil, dx, dy, lado, lado); ctx.restore(); }
    if (Math.floor(this.t * 8) % 2 === 0) {
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.globalCompositeOperation = "destination-over";
      ctx.filter = "drop-shadow(0 0 2px #e0242a)";
      ctx.drawImage(cor, dx, dy, lado, lado);
      ctx.restore();
    }
  }

  /** o "HORDA!" caindo do alto, com soco de zoom */
  letreiro(ctx) {
    const t = this.fase === "revela" ? this.tf : 1;
    const z = 1 + 1.2 * Math.exp(-7 * t) * Math.cos(16 * t);
    const texto = "HORDA!";
    ctx.save();
    ctx.translate(W / 2, 30);
    ctx.scale(z * 2, z * 2);
    drawText(ctx, texto, -texto.length * 3, -4, "#ff5a5a", { shadow: "#3a0a0a" });
    ctx.restore();
  }
}
