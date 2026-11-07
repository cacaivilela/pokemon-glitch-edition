// O ENCAIXE DA INSÍGNIA (pedido do CAIO, nov/2026: "ao ganhar uma insígnia de
// braglitch dá uma cutscene de uma insígnia se juntar com aquela formação e o
// negócio preto do fundo tem encaixes com o formato da insígnia" / "a insígnia
// é botada virada pra formar a imagem").
//
// O ESTOJO DE BRAGLITCH SOBE do fundo. A insígnia nova aparece no meio com
// RAIOS de luz girando atrás, gira de frente, VIRA no ar (mostra as costas: o
// pedaço do SÍMBOLO DA LIGA no formato dela — src/core/insigniascorpo.js) e
// VOA até o encaixe dela, que tem o formato dela no preto. Bate: tela treme,
// faíscas, onda de luz. Na formação todas ficam viradas: as costas juntas são
// o símbolo. Com as 8, o meio acende e o símbolo inteiro pulsa.
import { DB } from "../data/index.js";
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { drawText, fade } from "../core/gfx.js";
import { ORDEM, LUGARES, imagemInsignia, silhueta, costasDaInsignia, temMeio } from "../core/insigniascorpo.js";

const W = 240, H = 160;
const L = 32, A = 32;                       // os encaixes se tocam: as costas juntas formam o símbolo inteiro
const GX = (W - 3 * A) / 2, GY = 34;
const SOBE = 0.6, BRILHA = 1.4, VIRA = 0.7, VOA = 0.7;
const T_CLAC = SOBE + BRILHA + VIRA + VOA;
const suave = (k) => k * k * (3 - 2 * k);

export class EncaixeScene {
  /** args: { id, aoFim? } */
  enter(args = {}) {
    this.id = args.id;
    this.aoFim = args.aoFim || null;
    this.meio = this.id === "meio";
    this.i = this.meio ? -1 : Math.max(0, ORDEM.indexOf(this.id));
    this.t = 0; this.fadeA = 1; this.fadeDir = -1; this.saindo = false;
    this.clac = false; this.flash = 0; this.treme = 0; this.faiscas = []; this.onda = -1;
    const st = this.game.state;
    this.antes = new Set((st.bragBadges || []).filter((b) => b !== this.id));
    if (temMeio(st) && !this.meio) this.antes.add("meio");     // o MEIO vem com o inicial
    this.completo = [...ORDEM, "meio"].every((id) => id === this.id || this.antes.has(id));
    this.somVira = false;
    Audio2.tone(392, 0.15, "triangle", 0.35);
  }

  update(dt) {
    this.t += dt;
    if (this.fadeDir) {
      this.fadeA = Math.max(0, Math.min(1, this.fadeA + this.fadeDir * dt * 2.5));
      if (this.fadeDir < 0 && this.fadeA <= 0) this.fadeDir = 0;
    }
    this.flash = Math.max(0, this.flash - dt * 2.5);
    this.treme = Math.max(0, this.treme - dt);
    if (this.onda >= 0) this.onda += dt;
    for (const f of this.faiscas) { f.t += dt; f.x += f.vx * dt; f.y += f.vy * dt; f.vy += 140 * dt; }
    this.faiscas = this.faiscas.filter((f) => f.t < 0.8);
    if (this.saindo) { if (this.fadeA >= 1) { this.game.scenes.pop(); this.aoFim?.(); } return; }
    // o brilho subindo de tom enquanto ela gira
    if (this.t > SOBE && this.t < SOBE + BRILHA && Math.floor(this.t * 8) !== this._s) { this._s = Math.floor(this.t * 8); Audio2.tone(500 + (this.t - SOBE) * 400, 0.05, "triangle", 0.2); }
    if (!this.somVira && this.t > SOBE + BRILHA) { this.somVira = true; Audio2.tone(880, 0.08, "square", 0.25); Audio2.tone(660, 0.12, "square", 0.25); }
    if (!this.clac && this.t >= T_CLAC) {
      this.clac = true; this.flash = 1; this.treme = 0.35; this.onda = 0;
      Audio2.tone(90, 0.08, "square", 0.6); Audio2.tone(1800, 0.05, "square", 0.25);
      setTimeout(() => { Audio2.tone(659, 0.1, "triangle", 0.4); Audio2.tone(988, 0.3, "triangle", 0.4); }, 160);
      if (this.completo) setTimeout(() => { for (const [k, n] of [[0, 523], [1, 659], [2, 784], [3, 1046]]) setTimeout(() => Audio2.tone(n, 0.25, "triangle", 0.45), k * 140); }, 500);
      const [cx, cy] = this.buraco();
      for (let k = 0; k < 40; k++) {
        const a = Math.random() * Math.PI * 2, v = 40 + Math.random() * 90;
        this.faiscas.push({ x: cx + L / 2, y: cy + L / 2, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 40, t: 0 });
      }
    }
    if (this.clac && this.t > T_CLAC + 1.4 && (Input.consume("a") || Input.consume("b") || this.t > T_CLAC + 4)) {
      this.saindo = true; this.fadeDir = 1;
    }
  }

  buraco(i = this.i) { const [x, y] = i < 0 ? [1, 1] : LUGARES[i] || [1, 1]; return [GX + x * A, GY + y * A]; }

  render(ctx) {
    ctx.imageSmoothingEnabled = false;
    const sx = this.treme > 0 ? Math.round((Math.random() - 0.5) * 8 * this.treme / 0.35) : 0;
    ctx.save(); ctx.translate(sx, 0);
    // o fundo: o veludo escuro
    ctx.fillStyle = "#140804"; ctx.fillRect(-8, 0, W + 16, H);
    for (let y = 0; y < H; y += 4) { ctx.fillStyle = y % 8 ? "#1c0a05" : "#120603"; ctx.fillRect(-8, y, W + 16, 2); }
    // o ESTOJO subindo do fundo
    const sobe = (1 - suave(Math.min(1, this.t / SOBE))) * 140;
    const tem = this.clac ? new Set([...this.antes, this.id]) : this.antes;
    ctx.save(); ctx.translate(0, sobe);
    ctx.fillStyle = "#c89a3a"; ctx.fillRect(GX - 6, GY - 6, 3 * A + 12, 3 * A + 12);
    ctx.fillStyle = "#e8c060"; ctx.fillRect(GX - 6, GY - 6, 3 * A + 12, 2);
    ctx.fillStyle = "#0a0402"; ctx.fillRect(GX - 3, GY - 3, 3 * A + 6, 3 * A + 6);
    // os ENCAIXES (o formato de cada uma) e as que já estão: VIRADAS
    ORDEM.forEach((id, i) => {
      const [x, y] = this.buraco(i);
      const sil = silhueta(id, L);
      if (sil) { ctx.drawImage(sil.luz, x, y + 1); ctx.drawImage(sil.fundo, x, y); }
      if (tem.has(id)) { const c = costasDaInsignia(id, L); if (c) ctx.drawImage(c, x, y); }
    });
    // o MEIO: acende com as 8
    const s9 = imagemInsignia("simbolo");
    if (s9 && tem.has("meio")) ctx.drawImage(s9, 32, 32, 32, 32, GX + A, GY + A, A, A);
    else { ctx.fillStyle = "#050201"; ctx.fillRect(GX + A + 8, GY + A + 8, A - 16, A - 16); }
    if (s9 && [...ORDEM, "meio"].every((id) => tem.has(id))) {
      // o símbolo inteiro pulsando
      const k = 0.25 + 0.2 * Math.sin(this.t * 6);
      ctx.fillStyle = `rgba(255,240,170,${k})`; ctx.fillRect(GX - 3, GY - 3, 3 * A + 6, 3 * A + 6);
    }
    // a ONDA de luz do encaixe
    if (this.onda >= 0 && this.onda < 0.6) {
      const [bx, by] = this.buraco();
      ctx.strokeStyle = `rgba(255,240,170,${1 - this.onda / 0.6})`; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(bx + L / 2, by + L / 2, 6 + this.onda * 90, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
    drawText(ctx, "O ESTOJO DE BRAGLITCH", 57, 10, "#ffd860");
    // A NOVA
    if (!this.clac && this.t > SOBE * 0.6) {
      const costas = costasDaInsignia(this.id, L), im = this.meio ? costas : imagemInsignia(this.id);
      const t = this.t - SOBE * 0.6;
      let cx = W / 2, cy = H / 2 + 2, tam = 64, giro = t * 6, verso = false;
      // os RAIOS girando atrás
      if (this.t < SOBE + BRILHA + VIRA) {
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(this.t * 1.5);
        for (let k = 0; k < 10; k++) {
          ctx.rotate(Math.PI / 5);
          ctx.fillStyle = k % 2 ? "rgba(255,230,120,0.22)" : "rgba(255,250,210,0.14)";
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-10, -120); ctx.lineTo(10, -120); ctx.fill();
        }
        ctx.restore();
      }
      if (this.t > SOBE + BRILHA) {
        // VIRA: meia volta, e aparece o verso
        const k = Math.min(1, (this.t - SOBE - BRILHA) / VIRA);
        giro = Math.PI * suave(k); verso = k > 0.5;
      } else giro = Math.sin(t * 5) * 0.5;               // balança de frente, brilhando
      if (this.t > SOBE + BRILHA + VIRA) {
        const k = suave(Math.min(1, (this.t - SOBE - BRILHA - VIRA) / VOA));
        const [bx, by] = this.buraco();
        cx += (bx + L / 2 - cx) * k; cy += (by + L / 2 + sobe - cy) * k - Math.sin(k * Math.PI) * 26;
        tam = 64 + (L - 64) * k; giro = Math.PI; verso = true;
      }
      const face = verso ? costas : im;
      if (face) {
        const lw = Math.max(2, Math.round(tam * Math.abs(Math.cos(giro))));
        const esp = Math.round(5 * Math.abs(Math.sin(giro)) * tam / 64);
        if (esp) { ctx.fillStyle = "#a86a10"; ctx.fillRect(Math.round(cx - lw / 2 - esp), Math.round(cy - tam / 2), esp, tam); }
        ctx.drawImage(face, Math.round(cx - lw / 2), Math.round(cy - tam / 2), lw, tam);
      }
      const nome = this.meio ? "O MEIO DO SÍMBOLO" : (DB.INSIGNIAS_BRAG || []).find((b) => b.id === this.id)?.name || "";
      if (this.t < SOBE + BRILHA + VIRA) drawText(ctx, nome, Math.round(W / 2 - nome.length * 3), H - 14, "#ffffff");
    } else if (this.clac) {
      const txt = this.completo ? "O SÍMBOLO DA LIGA ESTÁ COMPLETO!" : "ENCAIXOU!";
      drawText(ctx, txt, Math.round(W / 2 - txt.length * 3), H - 14, this.completo ? "#ffd860" : "#7dff7a");
    }
    for (const f of this.faiscas) { ctx.fillStyle = f.t < 0.3 ? "#fff6c0" : "#e8a820"; ctx.fillRect(Math.round(f.x), Math.round(f.y), 2, 2); }
    ctx.restore();
    if (this.flash > 0) fade(ctx, this.flash * 0.7, "#ffffff");
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }
}
