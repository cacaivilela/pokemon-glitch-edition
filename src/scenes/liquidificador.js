// O LIQUIDIFICADOR DE BERRIES (os POKÉBLOCOS, src/data/pokeblocos.js): três
// partes.
// 1. ESCOLHER: até quatro berries diferentes da mochila (A põe, B tira; a
//    mesma duas vezes estraga e sai PRETO).
// 2. BATER: a seta gira, cada vez mais rápido; aperte A quando ela passar no
//    verde de cima. Oito voltas: ÓTIMO vale 1, BOM vale meio, errar vale nada —
//    é a QUALIDADE, que deixa o pokébloco mais forte e mais macio.
// 3. PRONTO: o pokébloco que saiu vai pro estojo, com a DUREZA (quantos turnos
//    o selvagem fica mastigando) e o PESO (em vermelho quando é pesado).
//
//   game.scenes.push(new LiquidificadorScene(), { onDone })
import { DB } from "../data/index.js";
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { panel, drawText, PAL } from "../core/gfx.js";
import { berriesNaMochila, misturar } from "../systems/pokeblocos.js";
import { doceDaCor, doceDaReceita } from "../systems/doces.js";

const W = 240, H = 160;
const VOLTAS = 8;
const CX = 150, CY = 74, R = 44;       // o copo do liquidificador

// o POKÉBLOCO desenhado: um cubinho de doce. L é o lado de cima (claro), M a
// frente (a cor dele), D o lado (escuro), a o contorno
const CUBO = [
  "...aaaaaa...",
  "..aLLLLLLa..",
  ".aLLLLLLLLa.",
  "aLLLLLLLLLDa",
  "aMLLLLLLLDDa",
  "aMMMMMMMMDDa",
  "aMMwMMMMMDDa",
  "aMMMMMMMMDDa",
  "aMMMMMMMMDDa",
  "aMMMMMMMMDDa",
  ".aMMMMMMMDa.",
  "..aaaaaaaa..",
];

const mistura = (hex, alvo, k) => {
  const a = parseInt(hex.slice(1), 16), b = parseInt(alvo.slice(1), 16);
  const c = [16, 8, 0].map((s) => Math.round(((a >> s) & 255) * (1 - k) + ((b >> s) & 255) * k));
  return `rgb(${c.join(",")})`;
};

/** desenha o pokébloco de cor `hex` em (x, y), com `px` de lado por pixel */
export function desenharPokebloco(ctx, hex, x, y, px = 2) {
  const cores = { a: "#181420", L: mistura(hex, "#ffffff", 0.45), M: hex, D: mistura(hex, "#000000", 0.4), w: "#ffffff" };
  CUBO.forEach((linha, j) => [...linha].forEach((ch, i) => {
    if (ch === ".") return;
    ctx.fillStyle = cores[ch];
    ctx.fillRect(x + i * px, y + j * px, px, px);
  }));
}

export class LiquidificadorScene {
  enter(args = {}) {
    this.onDone = args.onDone;
    // modo DOCE (src/data/doces.js): a cor que sairia no pokébloco vira o doce dela
    this.modo = args.modo || "pokebloco";
    this.st = this.game.state;
    this.fase = "escolher";
    this.escolhidas = [];
    this.cursor = 0;
    this.t = 0;
    this.lista = berriesNaMochila(this.st);
  }

  get P() { return DB.POKEBLOCOS; }

  /** quantas daquela berry ainda dá pra pôr */
  sobra(b) {
    const tem = this.st.items[b] || 0;
    return tem - this.escolhidas.filter((x) => x === b).length;
  }

  sair() {
    this.game.scenes.pop();
    this.onDone?.(this.bloco || null);
  }

  update(dt) {
    this.t += dt;
    if (this.fase === "escolher") return this.atualizaEscolha();
    if (this.fase === "bater") return this.atualizaBater(dt);
    if (this.fase === "pronto" && (Input.consume("a") || Input.consume("b"))) this.sair();
  }

  atualizaEscolha() {
    const opcoes = this.lista.length + (this.escolhidas.length ? 1 : 0);   // a última é BATER!
    if (Input.consume("up")) { this.cursor = (this.cursor + opcoes - 1) % opcoes; Audio2.select?.(); }
    if (Input.consume("down")) { this.cursor = (this.cursor + 1) % opcoes; Audio2.select?.(); }
    if (Input.consume("b")) {
      if (this.escolhidas.length) { this.escolhidas.pop(); Audio2.cancel?.(); }
      else return this.sair();
    }
    if (!Input.consume("a")) return;
    if (this.cursor >= this.lista.length) return this.comecarBater();
    const [b] = this.lista[this.cursor];
    if (this.escolhidas.length >= 4 || this.sobra(b) <= 0) { Audio2.cancel?.(); return; }
    this.escolhidas.push(b);
    Audio2.tone?.(520 + this.escolhidas.length * 90, 0.06, "square", 0.4);
  }

  comecarBater() {
    this.fase = "bater";
    this.angulo = -Math.PI / 2 + 0.6;     // começa logo depois do verde
    this.volta = 0;
    this.velocidade = 3.2;                // radianos por segundo
    this.acertos = 0;
    this.apertouNaVolta = false;
    this.aviso = null;
    Audio2.select?.();
  }

  atualizaBater(dt) {
    const antes = this.angulo;
    this.angulo += this.velocidade * dt;
    // passou de novo pelo topo: uma volta a mais
    const topo = (a) => Math.floor((a + Math.PI / 2 + Math.PI) / (2 * Math.PI));
    if (topo(this.angulo) > topo(antes)) {
      this.volta++;
      this.apertouNaVolta = false;
      this.velocidade += 0.55;
      if (this.volta >= VOLTAS) return this.terminar();
    }
    if (this.aviso) this.aviso.t -= dt;
    if (Input.consume("a") && !this.apertouNaVolta) {
      this.apertouNaVolta = true;
      // a distância da seta até o topo (o verde)
      let d = (this.angulo + Math.PI / 2) % (2 * Math.PI);
      if (d > Math.PI) d -= 2 * Math.PI;
      d = Math.abs(d);
      if (d < 0.22) { this.acertos += 1; this.aviso = { txt: "ÓTIMO!", cor: "#00ff41", t: 0.5 }; Audio2.tone?.(990, 0.08, "square", 0.45); }
      else if (d < 0.55) { this.acertos += 0.5; this.aviso = { txt: "BOM", cor: "#ffe46a", t: 0.5 }; Audio2.tone?.(700, 0.06, "square", 0.4); }
      else { this.aviso = { txt: "ERROU", cor: "#ff5566", t: 0.5 }; Audio2.tone?.(180, 0.1, "square", 0.4); }
    }
  }

  terminar() {
    const P = this.P;
    const qualidade = this.acertos / VOLTAS;
    this.bloco = misturar(this.escolhidas, qualidade);
    this.qualidade = qualidade;
    for (const b of this.escolhidas) {
      this.st.items[b] -= 1;
      if (this.st.items[b] <= 0) delete this.st.items[b];
    }
    // no modo DOCE, a RECEITA certa (os doces do Brasil) ganha da cor
    this.doce = this.modo === "doce" ? doceDaReceita(this.escolhidas) || doceDaCor(this.bloco.cor) : null;
    if (this.doce) this.st.items[this.doce.item] = (this.st.items[this.doce.item] || 0) + 1;
    else {
      (this.st.pokeblocos ||= []).push(this.bloco);
      if (this.st.pokeblocos.length > P.ESTOJO_MAX) this.st.pokeblocos.length = P.ESTOJO_MAX;
    }
    this.fase = "pronto";
    Audio2.heal?.();
    this.game.autosave?.(true);
  }

  // ------------------------------------------------------------- desenho
  render(ctx) {
    ctx.fillStyle = "#1c1824";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#2a2434";
    ctx.fillRect(0, 118, W, H - 118);
    this.desenhaLiquidificador(ctx);
    if (this.fase === "escolher") this.desenhaEscolha(ctx);
    else if (this.fase === "bater") this.desenhaBater(ctx);
    else this.desenhaPronto(ctx);
  }

  desenhaLiquidificador(ctx) {
    const P = this.P;
    // o copo, com as berries rodando dentro (cada uma uma fatia da cor dela)
    const giro = this.fase === "bater" ? this.angulo * 2 : this.t * 0.5;
    const cores = this.escolhidas.map((b) => P.BERRIES_SABOR[b].cor);
    ctx.fillStyle = "#3a3448";
    ctx.beginPath(); ctx.arc(CX, CY, R + 4, 0, Math.PI * 2); ctx.fill();
    if (cores.length) {
      const n = cores.length * 3;
      for (let k = 0; k < n; k++) {
        ctx.fillStyle = cores[k % cores.length];
        ctx.beginPath();
        ctx.moveTo(CX, CY);
        ctx.arc(CX, CY, R, giro + (k / n) * Math.PI * 2, giro + ((k + 1) / n) * Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.fillStyle = "#4a4458";
      ctx.beginPath(); ctx.arc(CX, CY, R, 0, Math.PI * 2); ctx.fill();
    }
    // o verde de cima: onde tem que apertar
    ctx.strokeStyle = "#00ff41";
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(CX, CY, R + 2, -Math.PI / 2 - 0.22, -Math.PI / 2 + 0.22); ctx.stroke();
    ctx.strokeStyle = "#ffe46a";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(CX, CY, R + 2, -Math.PI / 2 - 0.55, -Math.PI / 2 - 0.22); ctx.stroke();
    ctx.beginPath(); ctx.arc(CX, CY, R + 2, -Math.PI / 2 + 0.22, -Math.PI / 2 + 0.55); ctx.stroke();
    ctx.lineWidth = 1;
    // a base da máquina
    ctx.fillStyle = "#c8c0d8";
    ctx.fillRect(CX - 30, CY + R + 4, 60, 10);
    ctx.fillStyle = "#8a82a0";
    ctx.fillRect(CX - 30, CY + R + 12, 60, 3);
  }

  desenhaEscolha(ctx) {
    const P = this.P;
    panel(ctx, 4, 4, 92, 152);
    drawText(ctx, "BERRIES", 10, 9, PAL.glitch);
    const visiveis = 10;
    const ini = Math.max(0, Math.min(this.cursor - 4, this.lista.length + 1 - visiveis));
    const linhas = [...this.lista.map(([b]) => b), ...(this.escolhidas.length ? ["BATER!"] : [])];
    linhas.slice(ini, ini + visiveis).forEach((b, k) => {
      const i = ini + k, y = 22 + k * 12;
      if (i === this.cursor) drawText(ctx, ">", 9, y, PAL.ink);
      if (b === "BATER!") return drawText(ctx, "BATER!", 18, y, "#2a8a3a");
      drawText(ctx, b.replace(" berry", "").toUpperCase(), 18, y, this.sobra(b) > 0 ? PAL.ink : PAL.ink2);
      drawText(ctx, String(this.sobra(b)), 82, y, PAL.ink2);
    });
    // as escolhidas, embaixo do copo
    drawText(ctx, `NO COPO (${this.escolhidas.length}/4):`, 104, 132, "#d6dde6");
    drawText(ctx, this.escolhidas.map((b) => b.replace(" berry", "").toUpperCase()).join(" ") || "NADA", 104, 144, "#ffe46a");
    if (this.lista.length) {
      const [b] = this.lista[Math.min(this.cursor, this.lista.length - 1)];
      const s = P.BERRIES_SABOR[b].sabor;
      const txt = s.map((v, i) => (v ? `${P.SABORES[i].nome.slice(0, 3)} ${v}` : "")).filter(Boolean).join(" ");
      drawText(ctx, txt, 104, 8, "#9fb0c4");
    }
  }

  desenhaBater(ctx) {
    // a seta
    const x = CX + Math.cos(this.angulo) * (R - 2), y = CY + Math.sin(this.angulo) * (R - 2);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(CX, CY); ctx.lineTo(x, y); ctx.stroke();
    ctx.lineWidth = 1;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(CX, CY, 4, 0, Math.PI * 2); ctx.fill();
    panel(ctx, 4, 4, 82, 40);
    drawText(ctx, "APERTE A NO", 10, 10, PAL.ink);
    drawText(ctx, "VERDE!", 10, 22, "#2a8a3a");
    drawText(ctx, `VOLTA ${Math.min(VOLTAS, this.volta + 1)}/${VOLTAS}`, 10, 132, "#d6dde6");
    if (this.aviso && this.aviso.t > 0) drawText(ctx, this.aviso.txt, CX - 18, 8, this.aviso.cor, { shadow: "#000" });
  }

  desenhaPronto(ctx) {
    const P = this.P, b = this.bloco;
    if (this.doce) return this.desenhaDoce(ctx);
    panel(ctx, 4, 4, 100, 116);
    drawText(ctx, "SAIU UM", 12, 10, PAL.ink);
    drawText(ctx, "POKÉBLOCO", 12, 22, PAL.ink);
    drawText(ctx, P.CORES[b.cor].nome + "!", 12, 34, PAL.glitch);
    desenharPokebloco(ctx, P.CORES[b.cor].cor, 30, 50, 3);
    const sab = b.sabor.map((v, i) => (v ? `${P.SABORES[i].nome.slice(0, 3)} ${v}` : "")).filter(Boolean);
    sab.forEach((t, k) => drawText(ctx, t, 12 + (k % 2) * 46, 86 + Math.floor(k / 2) * 9, PAL.ink2));
    const pesado = b.peso >= P.BATALHA.pesado;
    drawText(ctx, `DURO ${b.resistencia}  PESO ${b.peso}`, 12, 110, pesado ? "#c02020" : PAL.ink);
    drawText(ctx, `RITMO: ${Math.round(this.qualidade * 100)}%`, 104, 132, "#d6dde6");
    drawText(ctx, "A: GUARDAR NO ESTOJO", 104, 144, "#ffe46a");
    // o pokébloco grande no copo
    desenharPokebloco(ctx, P.CORES[b.cor].cor, CX - 18, CY - 18, 3);
  }

  /** o DOCE que saiu: o nome e a cor do creme que ele dá */
  desenhaDoce(ctx) {
    const d = this.doce;
    panel(ctx, 4, 4, 100, 116);
    drawText(ctx, DB.DOCES_TEXTO.saiuDoce, 12, 10, PAL.ink);
    drawText(ctx, d.brasil ? "DOCE DO BRASIL:" : "DOCE DE", 12, 22, PAL.ink);
    drawText(ctx, (d.nome + "!").slice(0, 15), 12, 34, PAL.glitch);
    // o doce: um bolinho de creme da cor dele, com o morango em cima
    const doce = (x, y, k) => {
      ctx.fillStyle = "#101010"; ctx.fillRect(x - k, y + 4 * k, 12 * k, 6 * k);
      ctx.fillStyle = d.creme; ctx.fillRect(x, y + 5 * k, 10 * k, 4 * k);
      ctx.fillStyle = "#101010"; ctx.fillRect(x + k, y + k, 8 * k, 5 * k);
      ctx.fillStyle = d.creme; ctx.fillRect(x + 2 * k, y + 2 * k, 6 * k, 4 * k);
      ctx.fillStyle = "#fb5d74"; ctx.fillRect(x + 4 * k, y - k, 2 * k, 2 * k);
    };
    doce(30, 56, 4);
    drawText(ctx, `RITMO: ${Math.round(this.qualidade * 100)}%`, 104, 132, "#d6dde6");
    drawText(ctx, "A: GUARDAR NA MOCHILA", 104, 144, "#ffe46a");
    doce(CX - 20, CY - 18, 4);
  }
}
