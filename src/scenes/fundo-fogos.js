// O FUNDO DA TELA DE TÍTULO DO VOL. 7 (o CAIO escolheu "FOGOS DE POKÉMON"):
// céu de noite em cima de uma cidade apagada, foguetes subindo com rastro, e
// cada um explode em faíscas que voam até formar o DESENHO de um Pokémon
// sorteado, nas cores dele. O desenho brilha um tempinho, as faíscas caem com
// a gravidade e somem. De vez em quando sai um SHINY (com o desenho shiny e
// estrelinhas em volta).
//
// As faíscas saem do próprio sprite: um pixel a cada `passo`, na cor dele
// (clareada, que fogo é luz). Espécie cujo desenho ainda não chegou fica pra
// depois: o sorteio só usa quem já está carregado (e vai pedindo os próximos).
import { DB } from "../data/index.js";
import { Assets, makeCanvas } from "../core/assets.js";
import { SpriteStore } from "../core/sprites.js";
import { Audio2 } from "../core/audio.js";
import { tocarGrito } from "../systems/gritos.js";

const W = 240, H = 160;
// O TAMANHO de cada fogo: o GRANDE é o sprite inteiro, pixel por pixel (uma
// faísca por pixel: dá pra reconhecer quem é); o PEQUENO é metade, uma faísca
// a cada 2 pixels. Antes era 1 a cada 3, e o desenho saía esburacado.
const TAMANHOS = [
  { passo: 1, escala: 1, peso: 3 },
  { passo: 2, escala: 0.5, peso: 2 },
];
const INTERVALO = [0.45, 1.1];    // segundos entre um foguete e o próximo
const NO_CEU = 7;                 // quantos fogos ao mesmo tempo, no máximo
// O FINAL: a cada tanto tempo, vários sobem juntos
const FINAL_A_CADA = [16, 24], FINAL_QTOS = [4, 6];
// shiny é raro no jogo (src/data/config.js) — no fundo também
const SHINY = 1 / 30;
const MONTA = 0.7, BRILHA = 1.6, CAI = 1.6;   // as fases das faíscas

export class FundoDeFogos {
  constructor() {
    this.t = 0;
    this.foguetes = [];
    this.estouros = [];
    this.proximo = 0.3;
    this.final = FINAL_A_CADA[0];
    // as estrelas fixas do céu e os prédios da cidade lá embaixo
    this.estrelas = Array.from({ length: 50 }, () => ({ x: Math.random() * W, y: Math.random() * 110, f: Math.random() * 6 }));
    this.predios = [];
    for (let x = 0; x < W;) {
      const w = 10 + Math.floor(Math.random() * 18), h = 10 + Math.floor(Math.random() * 26);
      this.predios.push({ x, w, h, janelas: Array.from({ length: 6 }, () => Math.random() < 0.35) });
      x += w + 1;
    }
    // quem pode aparecer: as espécies de dex comum (fusão e forma inventada fora)
    this.especies = Object.values(DB.SPECIES || {}).filter((s) => s.dex && s.dex <= 1025 && !s.fusao && !s.spriteUrl).map((s) => s.id);
    this.fila = [];
    for (let i = 0; i < 16; i++) this.pedirUm();      // uma reserva boa: o FINAL pede vários de uma vez
  }

  /** pede o desenho de um sorteado (ele entra na fila quando chegar) */
  pedirUm() {
    if (!this.especies.length) return;
    const id = this.especies[Math.floor(Math.random() * this.especies.length)];
    Assets.mon(id, 1);
    Assets.monShiny?.(id);
    this.fila.push(id);
  }

  /** o primeiro da fila que já carregou (e já pede outro pro lugar dele) */
  escolher() {
    const i = this.fila.findIndex((id) => SpriteStore.pokemon[id]);
    if (i < 0) return null;
    const [id] = this.fila.splice(i, 1);
    this.pedirUm();
    return id;
  }

  /** as faíscas de um desenho: posição (em volta do centro) e cor */
  faiscasDe(img, passo, escala) {
    const { cv, ctx } = makeCanvas(img.width, img.height);
    ctx.drawImage(img, 0, 0);
    let d;
    try { d = ctx.getImageData(0, 0, cv.width, cv.height).data; } catch { return []; }
    const out = [];
    for (let y = 0; y < cv.height; y += passo) {
      for (let x = 0; x < cv.width; x += passo) {
        const i = (y * cv.width + x) * 4;
        if (d[i + 3] < 100) continue;
        // fogo é luz: a cor do bicho clareada, e o contorno preto vira brasa
        let r = d[i], g = d[i + 1], b = d[i + 2];
        if (r + g + b < 90) { r = 120; g = 60; b = 30; }
        const k = 0.35;
        out.push({ dx: Math.round((x - cv.width / 2) * escala), dy: Math.round((y - cv.height / 2) * escala),
                   cor: `rgb(${Math.round(r + (255 - r) * k)},${Math.round(g + (255 - g) * k)},${Math.round(b + (255 - b) * k)})` });
      }
    }
    return out;
  }

  lancar() {
    const id = this.escolher();
    if (!id) return;
    const shiny = Math.random() < SHINY;
    const img = (shiny && Assets.monShiny?.(id)) || Assets.mon(id, 1);
    const total = TAMANHOS.reduce((n, t) => n + t.peso, 0);
    let r = Math.random() * total;
    const tam = TAMANHOS.find((t) => (r -= t.peso) < 0) || TAMANHOS[0];
    // o lugar no céu: longe dos que já estão lá (pra um desenho não cobrir o outro)
    const ocupados = [...this.foguetes.map((f) => f.alvo), ...this.estouros.filter((e) => e.t < 3).map((e) => e)];
    let alvo = null;
    for (let i = 0; i < 12 && !alvo; i++) {
      const c = { x: 36 + Math.random() * (W - 72), y: 30 + Math.random() * 50 };
      if (ocupados.every((o) => Math.hypot(o.x - c.x, o.y - c.y) > 50 * tam.escala + 20)) alvo = c;
    }
    alvo ||= { x: 36 + Math.random() * (W - 72), y: 30 + Math.random() * 50 };
    this.foguetes.push({ x: alvo.x + (Math.random() - 0.5) * 30, y: H, alvo, id, img, shiny, tam, rastro: [],
                         vel: 100 + Math.random() * 50 });
  }

  estourar(f) {
    const faiscas = this.faiscasDe(f.img, f.tam.passo, f.tam.escala).map((p) => {
      const a = Math.random() * Math.PI * 2, v = 20 + Math.random() * 40;
      // começa num círculo em volta do centro e voa até o lugar dela no desenho
      return { ...p, sx: Math.cos(a) * v * 0.15, sy: Math.sin(a) * v * 0.15, ox: Math.cos(a) * v, oy: Math.sin(a) * v, vy: 0, cai: Math.random() * 0.5 };
    });
    this.estouros.push({ x: f.alvo.x, y: f.alvo.y, t: 0, faiscas, shiny: f.shiny, flash: 1, escala: f.tam.escala });
    // O ESTOURO PARECIDO COM O GRITO (pedido do CAIO: "parecido", não o
    // grito): a voz do Pokémon do desenho, mais grave e passada pela cadeia de
    // EXPLOSÃO do som (estoura, chia e vai abafando — src/core/audio.js,
    // cadeiaEstouro), um "bum" no começo e os estalinhos das faíscas no fim.
    // O fogo pequeno estoura mais agudo; o shiny ganha o plim do brilho.
    // (nov/2026, "mais pra uma explosão do que pro grito"): agora o som é o
    // ESTOURO DE VERDADE (bum, chiado e estalinhos — Audio2.fogoDeArtificio), e
    // o grito ficou só um resto abafado por baixo. Baixinho, como sempre.
    Audio2.fogoDeArtificio(f.tam.escala, 0.12);
    tocarGrito(f.id, f.tam.escala < 1 ? 0.7 : 0.5, "estouro");
    // o shiny: o som do LEGENDS ARCEUS, baixinho como o resto dos fogos
    if (f.shiny) Audio2.somEditado("shiny-pla", 0.3);
  }

  update(dt) {
    this.t += dt;
    this.proximo -= dt;
    if (this.proximo <= 0 && this.foguetes.length + this.estouros.length < NO_CEU) {
      this.proximo = INTERVALO[0] + Math.random() * (INTERVALO[1] - INTERVALO[0]);
      this.lancar();
    }
    // O FINAL: vários de uma vez
    this.final -= dt;
    if (this.final <= 0) {
      this.final = FINAL_A_CADA[0] + Math.random() * (FINAL_A_CADA[1] - FINAL_A_CADA[0]);
      const n = FINAL_QTOS[0] + Math.floor(Math.random() * (FINAL_QTOS[1] - FINAL_QTOS[0] + 1));
      for (let i = 0; i < n; i++) this.lancar();
      this.proximo = 2.5;                       // um respiro depois do final
    }
    for (const f of this.foguetes) {
      const v = f.vel;
      const dx = f.alvo.x - f.x, dy = f.alvo.y - f.y, d = Math.hypot(dx, dy) || 1;
      f.rastro.push({ x: f.x, y: f.y });
      if (f.rastro.length > 10) f.rastro.shift();
      if (d < v * dt) { f.feito = true; this.estourar(f); continue; }
      f.x += dx / d * v * dt + Math.sin(this.t * 20) * 0.3;
      f.y += dy / d * v * dt;
    }
    this.foguetes = this.foguetes.filter((f) => !f.feito);
    for (const e of this.estouros) {
      e.t += dt;
      e.flash = Math.max(0, e.flash - dt * 4);
      if (e.t > MONTA + BRILHA) for (const p of e.faiscas) { if (e.t > MONTA + BRILHA + p.cai) p.vy += 60 * dt; p.dy += p.vy * dt; }
    }
    this.estouros = this.estouros.filter((e) => e.t < MONTA + BRILHA + CAI + 0.6);
  }

  render(ctx) {
    // o céu de noite
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#05060f"); g.addColorStop(0.7, "#141a3a"); g.addColorStop(1, "#2a1f3e");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    for (const s of this.estrelas) {
      ctx.fillStyle = `rgba(255,255,255,${0.25 + 0.25 * Math.sin(this.t * 1.5 + s.f)})`;
      ctx.fillRect(Math.round(s.x), Math.round(s.y), 1, 1);
    }
    // o clarão dos estouros pinta o céu um pouquinho
    for (const e of this.estouros) {
      if (e.flash <= 0) continue;
      const r = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, 70);
      r.addColorStop(0, `rgba(255,240,200,${0.35 * e.flash})`); r.addColorStop(1, "rgba(255,240,200,0)");
      ctx.fillStyle = r; ctx.fillRect(e.x - 70, e.y - 70, 140, 140);
    }
    // os foguetes subindo, com o rastro
    for (const f of this.foguetes) {
      f.rastro.forEach((p, i) => {
        ctx.fillStyle = `rgba(255,200,120,${(i + 1) / f.rastro.length * 0.6})`;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), 1, 2);
      });
      ctx.fillStyle = "#fff6d0";
      ctx.fillRect(Math.round(f.x) - 1, Math.round(f.y) - 1, 2, 3);
    }
    // as faíscas: voando até o desenho, brilhando nele, caindo
    for (const e of this.estouros) {
      const k = Math.min(1, e.t / MONTA), ease = 1 - Math.pow(1 - k, 3);
      const some = e.t > MONTA + BRILHA ? Math.max(0, 1 - (e.t - MONTA - BRILHA) / CAI) : 1;
      // o desenho pisca inteiro enquanto brilha (um alpha por fogo, e não por
      // faísca: são milhares de faíscas no céu)
      const pisca = e.t > MONTA && e.t < MONTA + BRILHA ? 0.8 + 0.2 * Math.sin(this.t * 12 + e.x) : 1;
      ctx.globalAlpha = some * pisca;
      for (const p of e.faiscas) {
        // da explosão (em volta) até o lugar no desenho, passando por fora
        const fora = Math.sin(k * Math.PI) * 0.6;
        const x = e.x + p.sx + (p.dx - p.sx) * ease + p.ox * fora;
        const y = e.y + p.sy + (p.dy - p.sy) * ease + p.oy * fora;
        ctx.fillStyle = p.cor;
        // enquanto voa, a faísca é um pouco maior; no desenho, 1 pixel cada
        const t2 = k < 1 ? 2 : 1;
        ctx.fillRect(Math.round(x), Math.round(y), t2, t2);
      }
      // o SHINY: estrelinhas em volta do desenho enquanto ele brilha
      if (e.shiny && e.t > MONTA && e.t < MONTA + BRILHA) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#fff8a0";
        for (let i = 0; i < 5; i++) {
          const a = this.t * 2 + i * 1.256, r = 44 * (e.escala || 1);
          const sx = Math.round(e.x + Math.cos(a) * r), sy = Math.round(e.y + Math.sin(a) * r * 0.8);
          ctx.fillRect(sx - 2, sy, 5, 1); ctx.fillRect(sx, sy - 2, 1, 5);
        }
      }
      ctx.globalAlpha = 1;
    }
    // a cidade apagada lá embaixo, com umas janelas acesas
    for (const p of this.predios) {
      const y = H - p.h;
      ctx.fillStyle = "#0a0b18";
      ctx.fillRect(p.x, y, p.w, p.h);
      ctx.fillStyle = "#f0c860";
      p.janelas.forEach((acesa, i) => {
        if (!acesa) return;
        const jx = p.x + 2 + (i % 2) * Math.max(3, p.w - 6), jy = y + 3 + Math.floor(i / 2) * 6;
        if (jy < H - 2) ctx.fillRect(jx, jy, 2, 2);
      });
    }
  }
}
