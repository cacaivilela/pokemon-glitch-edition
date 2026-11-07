// A CENA DA FÁBRICA (pedido do CAIO, nov/2026: "o giovanni entrega as moedas
// pro persian e o persian entrega pros capangas e os capangas jogam um laser
// glitch na máquina que faz as bolas e a máquina se desfaz em pixels e é
// remontada"). Toca toda vez que você paga uma bola nova (src/data/fabrica.js).
//   1. o GIOVANNI joga as MOEDAS pro PERSIAN
//   2. o PERSIAN anda com elas até os OPERÁRIOS e entrega
//   3. os operários disparam o LASER GLITCH na MÁQUINA
//   4. a máquina SE DESFAZ EM PIXELS (voando, de cor errada)
//   5. os pixels VOLTAM e ela se REMONTA — e sai a bola nova na esteira
import { Assets } from "../core/assets.js";
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { drawText, fade } from "../core/gfx.js";
import { desenharItem } from "../core/itens.js";

const W = 240, H = 160;
const T = { moedas: 1.2, anda: 1.8, entrega: 0.5, laser: 1.1, desfaz: 1.2, remonta: 1.3, bola: 1.6 };
const marcos = (() => { let t = 0; const m = {}; for (const [k, d] of Object.entries(T)) { m[k] = [t, t + d]; t += d; } m.fim = t; return m; })();
const suave = (k) => k * k * (3 - 2 * k);
const fase = (t, k) => Math.max(0, Math.min(1, (t - marcos[k][0]) / (marcos[k][1] - marcos[k][0])));

// A MÁQUINA DE FAZER BOLAS, pixel por pixel (64x56): o funil, o corpo com o
// mostrador e as luzes, e a boca de onde sai a bola pra esteira
const MAQ = [
  "......kkkkkkkkkkkkkkkkkkkk......................................",
  "......kssssssssssssssssssk......................................",
  ".......kssssssssssssssssk.......................................",
  "........ksssssssssssssssk.......................................",
  ".........kssssssssssssk.........................................",
  "..........kkkkddddkkkk..........................................",
  "..............kddk..............................................",
  "kkkkkkkkkkkkkkkddkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk..............",
  "krrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrk..............",
  "krwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwrk..............",
  "krwkkkkkkkkkkkkwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwrk..............",
  "krwkggggggggggkwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwrk..............",
  "krwkgGggGgggGgkwwwwwwwkkkkkkkkwwwwwwwwwwwwwwwwwwrk..............",
  "krwkggggggggggkwwwwwwkrrrrrrrrkwwwwwwwwwwwwwwwwwrk..............",
  "krwkgggGggGgggkwwwwwkrrrrrrrrrrkwwwwwwwwwwwwwwwwrk..............",
  "krwkggggggggggkwwwwwkrrrrrrrrrrkwwwwwwwwwwwwwwwwrk..............",
  "krwkkkkkkkkkkkkwwwwwkkkkkkkkkkkkwwwwwwwwwwwwwwwwrk..............",
  "krwwwwwwwwwwwwwwwwwwkwwwwkkwwwwkwwwwwwwwwwwwwwwwrk..............",
  "krwwwyywwbbwwRRwwwwwkwwwkddkwwwkwwwwwwwwwwwwwwwwrk..............",
  "krwwwyywwbbwwRRwwwwwkwwwwkkwwwwkwwwwwwwwwwwwwwwwrk..............",
  "krwwwwwwwwwwwwwwwwwwkwwwwwwwwwwkwwwwwwwwwwwwwwwwrk..............",
  "krwwwwwwwwwwwwwwwwwwwkwwwwwwwwkwwwwwwwwwwwwwwwwwrk..............",
  "krwwwwwwwwwwwwwwwwwwwwkkkkkkkkwwwwwwwwwwwwwwwwwwrk..............",
  "krrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrk..............",
  "kddddddddddddddddddddddddddddddddddddddddddddddddkkkkkkkkkkkkkkk",
  "kdkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkdkdsdsdsdsdsdsdsk",
  "kdk...........................................kdkkkkkkkkkkkkkkkk",
  "kdk...........................................kdk...............",
  "kkk...........................................kkk...............",
];
const COR = { k: "#202028", s: "#9aa4b4", d: "#5a6270", r: "#d03030", w: "#eef0f6", g: "#30e070", G: "#a0ffc0", y: "#ffd040", b: "#3a8ae0", R: "#ff5050" };
const MX = 132, MY = 58;          // onde a máquina fica na tela

export class FabricaScene {
  /** args: { bola, aoFim } */
  enter(args = {}) {
    this.bola = args.bola; this.aoFim = args.aoFim || null;
    this.t = 0; this.fadeA = 1; this.fadeDir = -1; this.saindo = false; this.sons = new Set();
    // cada pixel da máquina: de onde ele voa quando ela se desfaz
    this.px = [];
    MAQ.forEach((l, y) => [...l].forEach((ch, x) => {
      if (!COR[ch]) return;
      const a = Math.random() * Math.PI * 2, d = 40 + Math.random() * 90;
      this.px.push({ x, y, c: COR[ch], vx: Math.cos(a) * d, vy: Math.sin(a) * d - 30, g: Math.random() < 0.3 });
    }));
  }

  som(k, f) { if (!this.sons.has(k)) { this.sons.add(k); f(); } }

  update(dt) {
    this.t += dt;
    if (this.fadeDir) {
      this.fadeA = Math.max(0, Math.min(1, this.fadeA + this.fadeDir * dt * 2.5));
      if (this.fadeDir < 0 && this.fadeA <= 0) this.fadeDir = 0;
    }
    if (this.saindo) { if (this.fadeA >= 1) { this.game.scenes.pop(); this.aoFim?.(); } return; }
    const t = this.t;
    if (t > 0.2) this.som("moeda", () => { for (let k = 0; k < 4; k++) setTimeout(() => Audio2.tone(1400 + k * 200, 0.05, "square", 0.25), k * 120); });
    if (t > marcos.entrega[0]) this.som("entrega", () => { Audio2.tone(1600, 0.06, "square", 0.25); Audio2.tone(2000, 0.08, "square", 0.25); });
    if (t > marcos.laser[0]) this.som("laser", () => { for (let k = 0; k < 10; k++) setTimeout(() => Audio2.tone(300 + Math.random() * 900, 0.06, "sawtooth", 0.3), k * 100); });
    if (t > marcos.desfaz[0]) this.som("desfaz", () => { Audio2.tone(90, 0.5, "sawtooth", 0.45); });
    if (t > marcos.remonta[1] - 0.2) this.som("remonta", () => { Audio2.tone(523, 0.1, "triangle", 0.4); Audio2.tone(784, 0.18, "triangle", 0.4); });
    if (t > marcos.bola[0] + 0.6) this.som("bola", () => { Audio2.tone(988, 0.12, "triangle", 0.4); Audio2.tone(1318, 0.25, "triangle", 0.4); });
    if (t > marcos.fim && (Input.consume("a") || Input.consume("b") || t > marcos.fim + 2)) { this.saindo = true; this.fadeDir = 1; }
  }

  boneco(ctx, nome, x, y, dir, andando) {
    const sets = Assets.actor(nome) || Assets.actor("rocket");
    const set = sets?.[dir] || sets?.down;
    const q = set?.[andando ? Math.floor(this.t * 6) % set.length : 0];
    if (q) ctx.drawImage(q, Math.round(x), Math.round(y) - q.height);
  }

  moeda(ctx, x, y) {
    ctx.fillStyle = "#a87818"; ctx.fillRect(Math.round(x) - 2, Math.round(y) - 2, 5, 5);
    ctx.fillStyle = "#ffd040"; ctx.fillRect(Math.round(x) - 1, Math.round(y) - 2, 3, 4);
    ctx.fillStyle = "#fff6c0"; ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 1, 1);
  }

  render(ctx) {
    ctx.imageSmoothingEnabled = false;
    const t = this.t;
    // a FÁBRICA: parede de metal com canos e o chão de placas
    ctx.fillStyle = "#3a3e48"; ctx.fillRect(0, 0, W, H);
    for (let x = 0; x < W; x += 16) { ctx.fillStyle = "#454a56"; ctx.fillRect(x, 0, 1, 96); }
    ctx.fillStyle = "#6a6270"; ctx.fillRect(0, 22, W, 4); ctx.fillStyle = "#8a8290"; ctx.fillRect(0, 22, W, 1);
    ctx.fillStyle = "#5a6270"; ctx.fillRect(0, 96, W, H - 96);
    for (let x = 0; x < W; x += 24) for (let y = 96; y < H; y += 16) { ctx.fillStyle = "#4a5260"; ctx.fillRect(x, y, 24, 1); ctx.fillRect(x, y, 1, 16); }
    drawText(ctx, "FÁBRICA POCKET", 78, 6, "#ffd860");
    // A MÁQUINA (inteira, desfeita ou se remontando)
    const kd = fase(t, "desfaz"), kr = fase(t, "remonta");
    const inteira = t < marcos.desfaz[0] || t >= marcos.remonta[1];
    if (inteira) {
      MAQ.forEach((l, y) => [...l].forEach((ch, x) => { if (COR[ch]) { ctx.fillStyle = COR[ch]; ctx.fillRect(MX + x, MY + y, 1, 1); } }));
      // as luzes piscando
      if (Math.floor(t * 4) % 2) { ctx.fillStyle = "#ffffff"; ctx.fillRect(MX + 5, MY + 18, 2, 2); }
    } else {
      // voando pra fora (desfaz) e voltando (remonta); um pixel ou outro na cor errada
      const k = t < marcos.desfaz[1] ? suave(kd) : 1 - suave(kr);
      for (const p of this.px) {
        const cor = p.g && Math.floor(t * 12 + p.x) % 3 === 0 ? ["#ff00dc", "#40ff60", "#40e0ff"][(p.x + p.y) % 3] : p.c;
        ctx.fillStyle = cor;
        ctx.fillRect(Math.round(MX + p.x + p.vx * k), Math.round(MY + p.y + p.vy * k + 40 * k * k), 1, 1);
      }
    }
    // A ESTEIRA e a BOLA NOVA saindo
    if (t > marcos.bola[0]) {
      const k = suave(Math.min(1, (t - marcos.bola[0]) / 1.0));
      const bx = MX + 50 + k * 10, by = MY + 18;
      desenharItem(ctx, this.bola?.item, Math.round(bx), Math.round(by));
      if (k >= 1) {
        const nome = this.bola?.label || "";
        drawText(ctx, `${nome}!`, Math.round(W / 2 - (nome.length + 1) * 3), H - 16, "#ffffff");
      }
    }
    // o GIOVANNI na esquerda, os OPERÁRIOS perto da máquina
    this.boneco(ctx, "giovanni", 18, 112, "right", false);
    this.boneco(ctx, "operario", 106, 104, "right", false);
    this.boneco(ctx, "operario", 112, 126, "right", false);
    // o PERSIAN: perto do Giovanni, depois anda até os operários
    const ka = fase(t, "anda");
    const px = 42 + suave(ka) * 44, andandoP = t > marcos.anda[0] && t < marcos.anda[1];
    const voltando = t > marcos.entrega[1];
    const quadro = Assets.monAndando({ species: "persian" }, voltando ? "left" : "right", andandoP ? t * 1000 : 0);
    if (quadro) ctx.drawImage(quadro, Math.round(px - quadro.width / 2), Math.round(118 - quadro.height));
    // AS MOEDAS: do Giovanni pro Persian (arco), na cabeça do Persian, e pros operários
    if (t < marcos.moedas[1]) {
      const k = fase(t, "moedas");
      for (let i = 0; i < 4; i++) {
        const kk = Math.max(0, Math.min(1, k * 1.4 - i * 0.12));
        this.moeda(ctx, 28 + (42 - 28) * kk + i * 2, 92 + (98 - 92) * kk - Math.sin(kk * Math.PI) * 18);
      }
    } else if (t < marcos.entrega[0]) {
      for (let i = 0; i < 4; i++) this.moeda(ctx, px - 4 + i * 3, 96 - (i % 2) * 2);
    } else if (t < marcos.entrega[1]) {
      const k = fase(t, "entrega");
      for (let i = 0; i < 4; i++) this.moeda(ctx, px - 4 + i * 3 + (110 - px) * k, 96 - Math.sin(k * Math.PI) * 10 - (i % 2) * 2);
    }
    // O LASER GLITCH dos operários na máquina
    if (t > marcos.laser[0] && t < marcos.desfaz[0] + 0.3) {
      for (const [ox, oy] of [[118, 92], [124, 114]]) {
        const cores = ["#ff00dc", "#40ff60", "#40e0ff", "#ffffff"];
        for (let s = 0; s < 3; s++) {
          ctx.fillStyle = cores[(Math.floor(t * 20) + s) % cores.length];
          let x = ox, y = oy + s;
          const ax = MX + 18, ay = MY + 20;
          for (let k = 0; k <= 20; k++) {
            const nx = ox + (ax - ox) * (k / 20), ny = oy + (ay - oy) * (k / 20) + (Math.random() - 0.5) * 6;
            ctx.fillRect(Math.round(nx), Math.round(ny) + s, 3, 1);
            x = nx; y = ny;
          }
        }
      }
    }
    if (t > marcos.remonta[1] - 0.05 && t < marcos.remonta[1] + 0.25) fade(ctx, 0.6 * (1 - (t - marcos.remonta[1] + 0.05) / 0.3), "#ffffff");
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }
}
