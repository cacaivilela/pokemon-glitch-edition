// O CANHÃO DE RAIOS (ideia do CAIO, 07/nov/2026): o minigame dos COGUMELOS
// MAX. Do lado esquerdo, no chão, o canhão; em cima dele uma CÚPULA de vidro
// com um PIKACHU dentro — é ele que gera os raios. ↑↓ miram, Z atira uma
// bola de choque. SEGURANDO Z o PIKACHU carrega o RAIO GRANDE (atravessa
// tudo, gasta 3 de carga). Os CRAMORANT passam voando; o que leva choque
// cospe um COGUMELO MAX (o dourado, shiny, cospe 3). Alguns cospem um
// ARROKUDA de volta: se ele acerta a cúpula, o PIKACHU fica tonto e perde a
// carga. No fim, os cogumelos vão pra mochila; a PESQUISADORA DO DYNAMAX
// (Saffron) faz a SOPA MAX com SOPA_CUSTA deles.
import { Assets } from "../core/assets.js";
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { drawText, fade } from "../core/gfx.js";
import { Dialogue } from "../systems/dialogue.js";
import { reduzido } from "../core/reduzir.js";
import { iconeItem } from "../core/itens.js";

export const SOPA_CUSTA = 5;                      // cogumelos max pra uma SOPA MAX
const W = 240, H = 160;
const CHAO = 140;                                 // onde começa a grama
const TEMPO = 60;
const CARGA_MAX = 6, CARGA_POR_S = 1.5;
const SEGURA_GRANDE = 0.7;                        // segundos segurando Z pro RAIO GRANDE
const BOLA_VEL = 230;
// o canhão: a cúpula fica em cima da base, o cano sai do meio dela
const CX = 34, CY = 116;                          // o pivô do cano (o meio da cúpula)
const CANO = 24;

const TEXTO = {
  comeca: [
    "O CANHÃO DE RAIOS! O PIKACHU NA CÚPULA GERA A ELETRICIDADE.",
    "↑↓ MIRAM, Z ATIRA. SEGURE Z PRO RAIO GRANDE! CUIDADO COM O ARROKUDA QUE ELES CUSPEM.",
  ],
  fim: "ACABOU! VOCÊ JUNTOU {N} COGUMELO{S} MAX!",
  nada: "NENHUM COGUMELO... O PIKACHU FICOU TRISTE. TENTA DE NOVO!",
  total: "AGORA VOCÊ TEM {T} COGUMELO{S} MAX. COM " + SOPA_CUSTA + " A PESQUISADORA FAZ UMA SOPA MAX!",
};

export class CanhaoMaxScene {
  enter() {
    this.dlg = new Dialogue();
    this.t = 0;
    this.fadeA = 1; this.fadeDir = -1;
    this.jogando = false; this.fim = false;
    this.tempo = TEMPO;
    this.ang = -0.6;                               // pra cima e pra direita
    this.carga = CARGA_MAX;
    this.segura = 0;                               // há quanto tempo o Z está apertado
    this.tonto = 0;                                // o PIKACHU depois de levar ARROKUDA
    this.recuo = 0;
    this.pegou = 0;
    this.bichos = [];                              // os CRAMORANT
    this.tiros = [];                               // bolas de choque e raios grandes
    this.peixes = [];                              // os ARROKUDA cuspidos
    this.cogus = [];                               // cogumelos caindo / voando pro placar
    this.faiscas = [];
    this.nasce = 0.5;
    this.nuvens = Array.from({ length: 6 }, (_, i) => ({ x: i * 50 + Math.random() * 30, y: 8 + Math.random() * 60, v: 4 + Math.random() * 6, w: 18 + Math.random() * 20 }));
    this.dlg.say(TEXTO.comeca, () => { this.jogando = true; });
  }
  exit() {}
  get st() { return this.game.state; }

  // --------------------------------------------------------------- update
  update(dt) {
    this.t += dt;
    if (this.fadeDir) {
      this.fadeA = Math.max(0, Math.min(1, this.fadeA + this.fadeDir * dt * 3));
      if (this.fadeDir < 0 && this.fadeA <= 0) this.fadeDir = 0;
      if (this.fadeDir > 0 && this.fadeA >= 1) return void this.game.scenes.pop();
    }
    for (const n of this.nuvens) { n.x -= n.v * dt; if (n.x < -n.w - 10) { n.x = W + 10; n.y = 8 + Math.random() * 60; } }
    this.updateFaiscas(dt);
    this.updateCogus(dt);
    if (this.dlg.update(dt)) return;
    if (!this.jogando || this.fim) return;

    this.tempo -= dt;
    this.recuo = Math.max(0, this.recuo - dt * 6);
    this.tonto = Math.max(0, this.tonto - dt);
    if (!this.tonto) this.carga = Math.min(CARGA_MAX, this.carga + CARGA_POR_S * dt);

    // a mira
    if (Input.held("up")) this.ang -= 1.6 * dt;
    if (Input.held("down")) this.ang += 1.6 * dt;
    this.ang = Math.max(-1.45, Math.min(0.05, this.ang));
    // Z: aperta e solta = bola; segura = RAIO GRANDE
    if (Input.held("a") && !this.tonto) {
      this.segura += dt;
      if (this.segura >= SEGURA_GRANDE && this.carga >= 3 && Math.random() < 0.6) this.faisca(CX, CY - 2, "#fff27a", 10);
    } else if (this.segura > 0) {
      if (this.segura >= SEGURA_GRANDE && this.carga >= 3) this.atirar(true);
      else if (this.carga >= 1) this.atirar(false);
      else Audio2.bump();
      this.segura = 0;
    }
    Input.consume("a");

    this.nasce -= dt;
    if (this.nasce <= 0) {
      this.novoBicho();
      // fica mais cheio no fim
      this.nasce = 0.6 + Math.random() * (1.4 - 0.7 * (1 - this.tempo / TEMPO));
    }
    this.updateBichos(dt);
    this.updateTiros(dt);
    this.updatePeixes(dt);

    if (this.tempo <= 0) this.acabou();
  }

  novoBicho() {
    const shiny = Math.random() < 0.08;
    const y = 18 + Math.random() * 80;
    this.bichos.push({
      x: W + 20, y, y0: y, vx: -(28 + Math.random() * 34) * (shiny ? 1.4 : 1),
      fase: Math.random() * 6, shiny, seed: Math.floor(Math.random() * 9999),
      cuspiu: Math.random() < 0.55 ? false : true,   // nem todo mundo cospe ARROKUDA
      zap: 0, caindo: false, vy: 0, giro: 0,
    });
  }

  atirar(grande) {
    const dx = Math.cos(this.ang), dy = Math.sin(this.ang);
    const x = CX + dx * (CANO + 2), y = CY + dy * (CANO + 2);
    this.carga -= grande ? 3 : 1;
    this.recuo = 1;
    this.tiros.push({ x, y, vx: dx * BOLA_VEL * (grande ? 1.3 : 1), vy: dy * BOLA_VEL * (grande ? 1.3 : 1), grande, vida: grande ? 1.4 : 1.1, rastro: [] });
    // o PIKACHU solta o choque: raio da cúpula pro cano
    this.flash = grande ? 0.25 : 0.1;
    for (let i = 0; i < (grande ? 14 : 6); i++) this.faisca(x, y, i % 2 ? "#fff27a" : "#ffffff", grande ? 60 : 35);
    if (grande) { Audio2.tone(180, 0.25, "sawtooth", 0.5); Audio2.noise(0.25, 0.5); }
    else { Audio2.tone(900, 0.05, "square", 0.3); Audio2.tone(1400, 0.04, "square", 0.2); }
  }

  updateBichos(dt) {
    for (const b of this.bichos) {
      if (b.caindo) {
        b.vy += 260 * dt; b.y += b.vy * dt; b.x += b.vx * 0.3 * dt; b.giro += dt * 8;
        if (b.y > H + 30) b.morto = true;
        continue;
      }
      b.fase += dt * 3;
      b.x += b.vx * dt;
      b.y = b.y0 + Math.sin(b.fase) * 6;
      // cospe um ARROKUDA quando passa por cima do canhão
      if (!b.cuspiu && b.x < 150 && b.x > 60) {
        b.cuspiu = true;
        const tx = CX - b.x, ty = CY - b.y, d = Math.hypot(tx, ty) || 1;
        this.peixes.push({ x: b.x - 8, y: b.y + 2, vx: tx / d * 70, vy: ty / d * 70 - 30, giro: 0 });
        Audio2.tone(300, 0.06, "triangle", 0.4);
      }
      if (b.x < -30) b.morto = true;
    }
    this.bichos = this.bichos.filter((b) => !b.morto);
  }

  updateTiros(dt) {
    for (const s of this.tiros) {
      s.rastro.push({ x: s.x, y: s.y });
      if (s.rastro.length > (s.grande ? 10 : 5)) s.rastro.shift();
      s.x += s.vx * dt; s.y += s.vy * dt; s.vida -= dt;
      if (s.vida <= 0 || s.x > W + 10 || s.x < -10 || s.y < -10 || s.y > CHAO) { s.morto = true; continue; }
      const raio = s.grande ? 16 : s.mini ? 8 : 14;
      for (const b of this.bichos) {
        if (b.caindo || Math.hypot(b.x - s.x, b.y - s.y) > raio) continue;
        this.acertou(b);
        // o RAIO GRANDE atravessa, e onde bate solta 5 BOLINHAS ELÉTRICAS em estrela
        if (s.grande) this.estoura(b.x, b.y);
        else { s.morto = true; break; }
      }
      // e derruba ARROKUDA no caminho
      for (const p of this.peixes) if (!p.morto && Math.hypot(p.x - s.x, p.y - s.y) < raio - 3) {
        p.morto = true; this.faisca(p.x, p.y, "#fff27a", 30); Audio2.tone(700, 0.04);
      }
    }
    this.tiros = this.tiros.filter((s) => !s.morto);
  }

  /** as 5 BOLINHAS que o RAIO GRANDE solta quando acerta: em estrela, cada uma
   *  derruba um CRAMORANT (mas não solta mais bolinhas) */
  estoura(x, y) {
    const giro = Math.random() * Math.PI * 2;
    for (let i = 0; i < 5; i++) {
      const a = giro + (i / 5) * Math.PI * 2;
      this.tiros.push({ x, y, vx: Math.cos(a) * 150, vy: Math.sin(a) * 150, mini: true, vida: 0.7, rastro: [] });
    }
    Audio2.tone(1600, 0.06, "square", 0.25);
  }

  acertou(b) {
    b.caindo = true; b.vy = -60; b.zap = 0.6;
    for (let i = 0; i < 10; i++) this.faisca(b.x, b.y, i % 2 ? "#fff27a" : "#ffffff", 50);
    Audio2.noise(0.08, 0.5); Audio2.tone(1200, 0.05, "square", 0.3);
    // ele cospe o COGUMELO MAX que tinha engolido
    const n = b.shiny ? 3 : 1;
    for (let i = 0; i < n; i++) this.cogus.push({ x: b.x - 6, y: b.y, vx: -20 + Math.random() * 40, vy: -70 - Math.random() * 30, chao: false, espera: 0.6, voa: false });
  }

  updatePeixes(dt) {
    for (const p of this.peixes) {
      p.vy += 60 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.giro += dt * 10;
      if (Math.hypot(p.x - CX, p.y - (CY - 4)) < 14) {
        p.morto = true;
        this.tonto = 1.8; this.carga = 0; this.segura = 0;
        Audio2.hit();
        for (let i = 0; i < 8; i++) this.faisca(CX, CY - 6, "#9ad7ff", 40);
      }
      if (p.y > CHAO + 4 || p.x < -20) p.morto = true;
    }
    this.peixes = this.peixes.filter((p) => !p.morto);
  }

  updateCogus(dt) {
    for (const c of this.cogus) {
      if (c.voa) {
        // voa pro contador lá em cima
        const tx = 14, ty = 8, dx = tx - c.x, dy = ty - c.y, d = Math.hypot(dx, dy);
        if (d < 6) { c.morto = true; this.pegou++; Audio2.tone(1046, 0.05); Audio2.tone(1318, 0.06); continue; }
        c.x += dx / d * 260 * dt; c.y += dy / d * 260 * dt;
        continue;
      }
      if (!c.chao) {
        c.vy += 220 * dt; c.x += c.vx * dt; c.y += c.vy * dt;
        if (c.y >= CHAO + 6) { c.y = CHAO + 6; if (Math.abs(c.vy) > 50) c.vy = -c.vy * 0.4; else c.chao = true; }
      } else if ((c.espera -= dt) <= 0) c.voa = true;
    }
    this.cogus = this.cogus.filter((c) => !c.morto);
  }

  faisca(x, y, cor, vel) {
    const a = Math.random() * Math.PI * 2, v = vel * (0.3 + Math.random() * 0.7);
    this.faiscas.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vida: 0.25 + Math.random() * 0.25, cor });
  }
  updateFaiscas(dt) {
    for (const f of this.faiscas) { f.x += f.vx * dt; f.y += f.vy * dt; f.vida -= dt; }
    this.faiscas = this.faiscas.filter((f) => f.vida > 0);
    if (this.flash) this.flash = Math.max(0, this.flash - dt);
  }

  acabou() {
    this.fim = true;
    // os cogumelos que ainda estão no ar também contam
    this.pegou += this.cogus.length;
    this.cogus = [];
    const st = this.st, n = this.pegou;
    if (n) st.items["cogumelo max"] = (st.items["cogumelo max"] || 0) + n;
    this.game.autosave?.(true);
    const S = (k) => (k === 1 ? "" : "S");
    const tot = st.items["cogumelo max"] || 0;
    if (n) Audio2.heal();
    this.dlg.say(n ? [TEXTO.fim.replace("{N}", n).replace("{S}", S(n)), TEXTO.total.replace("{T}", tot).replace("{S}", S(tot))]
      : [TEXTO.nada], () => { this.fadeDir = 1; });
  }

  // --------------------------------------------------------------- desenho
  render(ctx) {
    // o céu: azul em cima, clareando perto do chão
    const g = ctx.createLinearGradient(0, 0, 0, CHAO);
    g.addColorStop(0, "#4f8fe0"); g.addColorStop(1, "#bfe3ff");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, CHAO);
    for (const n of this.nuvens) this.nuvem(ctx, Math.round(n.x), Math.round(n.y), Math.round(n.w));
    // os prédios de Saffron lá longe
    ctx.fillStyle = "#8fb3d6";
    for (const [x, w, h] of [[70, 18, 30], [92, 12, 20], [108, 22, 40], [134, 14, 26], [152, 26, 48], [182, 12, 22], [198, 20, 34], [222, 16, 26]]) ctx.fillRect(x, CHAO - h, w, h);
    ctx.fillStyle = "#a9c7e3";
    for (const [x, w, h] of [[80, 10, 14], [120, 16, 18], [166, 14, 16], [210, 12, 12]]) ctx.fillRect(x, CHAO - h, w, h);
    // a grama
    ctx.fillStyle = "#58a83e"; ctx.fillRect(0, CHAO, W, H - CHAO);
    ctx.fillStyle = "#3f8a2c"; ctx.fillRect(0, CHAO, W, 2);
    for (let x = 3; x < W; x += 9) ctx.fillRect(x, CHAO + 6 + ((x * 7) % 9), 2, 2);

    // os CRAMORANT
    const ms = performance.now();
    for (const b of this.bichos) this.desenhaBicho(ctx, b, ms);
    // os ARROKUDA
    for (const p of this.peixes) {
      const img = Assets.mon("arrokuda", 1);
      if (!img) continue;
      ctx.save(); ctx.translate(Math.round(p.x), Math.round(p.y)); ctx.rotate(p.giro);
      ctx.drawImage(reduzido(img, 18), -9, -9, 18, 18);
      ctx.restore();
    }
    // os tiros
    for (const s of this.tiros) this.desenhaTiro(ctx, s);
    this.desenhaCanhao(ctx, ms);
    // os cogumelos
    const cogu = iconeItem("cogumelo max");
    for (const c of this.cogus) {
      if (cogu) ctx.drawImage(cogu, Math.round(c.x) - 8, Math.round(c.y) - 14);
      else { ctx.fillStyle = "#e22846"; ctx.fillRect(Math.round(c.x) - 5, Math.round(c.y) - 10, 10, 6); }
    }
    for (const f of this.faiscas) { ctx.fillStyle = f.cor; ctx.fillRect(Math.round(f.x), Math.round(f.y), 2, 2); }
    if (this.flash) { ctx.fillStyle = `rgba(255,250,200,${this.flash})`; ctx.fillRect(0, 0, W, H); }

    this.desenhaPlacar(ctx, cogu);
    this.dlg.render(ctx);
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }

  nuvem(ctx, x, y, w) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 4, y, w - 8, 8); ctx.fillRect(x, y + 3, w, 6); ctx.fillRect(x + w / 3, y - 3, w / 3, 4);
    ctx.fillStyle = "#dbeeff"; ctx.fillRect(x + 1, y + 8, w - 2, 1);
  }

  desenhaBicho(ctx, b, ms) {
    const mon = { species: "cramorant", seed: b.seed, shiny: b.shiny };
    const img = Assets.monAnim(mon, false, ms + b.seed * 13) || Assets.mon("cramorant", b.seed);
    if (!img) return;
    const s = 34, x = Math.round(b.x), y = Math.round(b.y);
    ctx.save();
    ctx.translate(x, y);
    if (b.caindo) ctx.rotate(b.giro);
    const r = reduzido(img, s);
    ctx.drawImage(r, -s / 2, -s / 2, s, s);
    // levou choque: pisca amarelo e branco
    if (b.caindo && b.zap > 0 && Math.floor(ms / 50) % 2) {
      // a cópia do desenho pintada de amarelo (só onde tem bicho, não o quadrado)
      const c = (this.amarelo ||= document.createElement("canvas"));
      c.width = c.height = s;
      const g = c.getContext("2d");
      g.drawImage(r, 0, 0, s, s);
      g.globalCompositeOperation = "source-atop";
      g.fillStyle = "#fff27a"; g.fillRect(0, 0, s, s);
      ctx.globalAlpha = 0.75;
      ctx.drawImage(c, -s / 2, -s / 2);
    }
    ctx.restore();
    if (b.caindo) b.zap -= 1 / 60;
    // o brilho do dourado
    if (b.shiny && !b.caindo && Math.floor(ms / 120) % 3 === 0) { ctx.fillStyle = "#fff6a0"; ctx.fillRect(x + 10, y - 12, 2, 2); ctx.fillRect(x - 12, y + 6, 2, 2); }
  }

  /** um zigue-zague de raio de (x1,y1) até (x2,y2) */
  zigue(ctx, x1, y1, x2, y2, pedacos, abre, cor, larg) {
    ctx.strokeStyle = cor; ctx.lineWidth = larg;
    ctx.beginPath(); ctx.moveTo(x1, y1);
    const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d;
    for (let i = 1; i < pedacos; i++) {
      const k = i / pedacos, o = (Math.random() - 0.5) * abre;
      ctx.lineTo(x1 + dx * k + nx * o, y1 + dy * k + ny * o);
    }
    ctx.lineTo(x2, y2); ctx.stroke();
  }

  desenhaTiro(ctx, s) {
    const r0 = s.rastro[0] || s;
    if (s.grande) {
      this.zigue(ctx, r0.x, r0.y, s.x, s.y, 6, 12, "#fff27a", 3);
      this.zigue(ctx, r0.x, r0.y, s.x, s.y, 6, 6, "#ffffff", 1);
      ctx.fillStyle = "#fff27a"; ctx.beginPath(); ctx.arc(s.x, s.y, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(s.x, s.y, 4, 0, Math.PI * 2); ctx.fill();
    } else if (s.mini) {
      // as bolinhas que o RAIO GRANDE solta
      this.zigue(ctx, r0.x, r0.y, s.x, s.y, 2, 3, "#ffe24a", 1);
      ctx.fillStyle = "#ffe24a"; ctx.fillRect(Math.round(s.x) - 2, Math.round(s.y) - 2, 4, 4);
      ctx.fillStyle = "#ffffff"; ctx.fillRect(Math.round(s.x) - 1, Math.round(s.y) - 1, 2, 2);
    } else {
      // a bola de choque normal (maior)
      this.zigue(ctx, r0.x, r0.y, s.x, s.y, 4, 7, "#ffe24a", 2);
      ctx.fillStyle = "#ffe24a"; ctx.beginPath(); ctx.arc(s.x, s.y, 5.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2); ctx.fill();
    }
  }

  desenhaCanhao(ctx, ms) {
    const rec = this.recuo * 3;
    const dx = Math.cos(this.ang), dy = Math.sin(this.ang);
    // o cano: tubo de metal com bobinas de cobre, recua quando atira
    const bx = CX - dx * rec, by = CY - dy * rec;
    ctx.save(); ctx.translate(bx, by); ctx.rotate(this.ang);
    ctx.fillStyle = "#1e2230"; ctx.fillRect(0, -6, CANO + 3, 12);
    ctx.fillStyle = "#6c7a92"; ctx.fillRect(1, -5, CANO + 1, 10);
    ctx.fillStyle = "#97a6bf"; ctx.fillRect(1, -5, CANO + 1, 3);
    for (let k = 8; k < CANO; k += 5) { ctx.fillStyle = "#b8682c"; ctx.fillRect(k, -6, 2, 12); ctx.fillStyle = "#e09a4e"; ctx.fillRect(k, -6, 1, 12); }
    ctx.fillStyle = "#1e2230"; ctx.fillRect(CANO + 1, -7, 4, 14);
    ctx.fillStyle = "#3a4256"; ctx.fillRect(CANO + 2, -6, 2, 12);
    // a carga brilhando na boca do cano
    if (this.segura >= SEGURA_GRANDE && this.carga >= 3) { ctx.fillStyle = Math.floor(ms / 60) % 2 ? "#fff27a" : "#ffffff"; ctx.fillRect(CANO + 2, -4, 3, 8); }
    ctx.restore();

    // a base, com rodas
    ctx.fillStyle = "#1e2230"; ctx.fillRect(12, 122, 46, 18);
    ctx.fillStyle = "#c23a3a"; ctx.fillRect(13, 123, 44, 16);
    ctx.fillStyle = "#e86060"; ctx.fillRect(13, 123, 44, 3);
    ctx.fillStyle = "#8a2424"; ctx.fillRect(13, 136, 44, 3);
    // um raio pintado do lado
    ctx.fillStyle = "#ffd23a";
    for (const [x, y, w] of [[33, 126, 4], [31, 128, 4], [29, 130, 7], [32, 132, 3], [31, 134, 2]]) ctx.fillRect(x, y, w, 2);
    for (const rx of [20, 48]) {
      ctx.fillStyle = "#1e2230"; ctx.beginPath(); ctx.arc(rx, 140, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#555d70"; ctx.beginPath(); ctx.arc(rx, 140, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#9aa3b6"; ctx.fillRect(rx - 1, 139, 2, 2);
    }

    // a CÚPULA: o PIKACHU dentro, o vidro por cima
    const pk = Assets.monAnim({ species: "pikachu", seed: 25 }, false, ms) || Assets.mon("pikachu", 25);
    const tonto = this.tonto > 0;
    // o fundo da cúpula
    ctx.fillStyle = "#1c2a3a";
    ctx.beginPath(); ctx.arc(CX, CY + 6, 15, Math.PI, 0); ctx.fill();
    ctx.fillRect(CX - 15, CY + 6, 30, 2);
    if (pk) {
      const tremido = tonto ? Math.sin(ms / 40) * 1.5 : (this.segura > 0.15 ? (Math.random() - 0.5) * 2 : 0);
      ctx.save();
      ctx.beginPath(); ctx.arc(CX, CY + 6, 14, Math.PI, 0); ctx.closePath(); ctx.clip();
      ctx.drawImage(reduzido(pk, 24), CX - 12 + tremido, CY - 16 + 6, 24, 24);
      ctx.restore();
    }
    // os raios dentro da cúpula: mais quando carrega
    ctx.save();
    ctx.beginPath(); ctx.arc(CX, CY + 6, 14, Math.PI, 0); ctx.closePath(); ctx.clip();
    const zaps = tonto ? 0 : this.segura > 0.1 ? 4 : (Math.random() < this.carga / CARGA_MAX * 0.5 ? 1 : 0);
    for (let i = 0; i < zaps; i++) {
      const a = Math.PI + Math.random() * Math.PI;
      this.zigue(ctx, CX + (Math.random() - 0.5) * 6, CY + 2, CX + Math.cos(a) * 14, CY + 6 + Math.sin(a) * 14, 4, 5, "#fff27a", 1);
    }
    ctx.restore();
    // o vidro
    ctx.strokeStyle = "#1e2230"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(CX, CY + 6, 15, Math.PI, 0); ctx.stroke();
    ctx.fillStyle = "rgba(190,230,255,0.22)";
    ctx.beginPath(); ctx.arc(CX, CY + 6, 14, Math.PI, 0); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillRect(CX - 10, CY - 3, 2, 5); ctx.fillRect(CX - 8, CY - 6, 3, 2);
    // o aro de metal
    ctx.fillStyle = "#1e2230"; ctx.fillRect(CX - 17, CY + 5, 34, 4);
    ctx.fillStyle = "#97a6bf"; ctx.fillRect(CX - 16, CY + 6, 32, 2);
    // tonto: estrelinhas girando
    if (tonto) for (let i = 0; i < 3; i++) {
      const a = ms / 200 + i * 2.1;
      ctx.fillStyle = "#fff27a"; ctx.fillRect(Math.round(CX + Math.cos(a) * 9), Math.round(CY - 12 + Math.sin(a) * 3), 2, 2);
    }
  }

  desenhaPlacar(ctx, cogu) {
    ctx.fillStyle = "rgba(20,24,36,0.75)";
    ctx.fillRect(0, 0, W, 16);
    if (cogu) ctx.drawImage(cogu, 4, 0);
    drawText(ctx, `x${this.pegou}`, 22, 4, "#ffffff");
    // a carga do PIKACHU: 6 risquinhos
    drawText(ctx, "CARGA", 66, 4, this.tonto ? "#9ad7ff" : "#fff27a");
    for (let i = 0; i < CARGA_MAX; i++) {
      const cheio = Math.min(1, Math.max(0, this.carga - i));
      ctx.fillStyle = "#3a4256"; ctx.fillRect(100 + i * 9, 4, 7, 8);
      ctx.fillStyle = "#fff27a"; ctx.fillRect(100 + i * 9, 4 + Math.round(8 * (1 - cheio)), 7, Math.round(8 * cheio));
    }
    if (this.tonto) drawText(ctx, "TONTO!", 158, 4, "#9ad7ff");
    const s = Math.max(0, Math.ceil(this.tempo));
    const txt = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
    drawText(ctx, txt, W - 6 - txt.length * 6, 4, s <= 10 ? "#ff8a8a" : "#ffffff");
  }
}
