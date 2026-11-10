// A CÂMERA DE VERDADE DO ROTOMFONE (pedido do CAIO, 08/nov/2026: "um modo que
// vc escolhe um pkmn e sua câmera do dispositivo abre tira uma foto e vc
// aparece [...] com o pkmn escolhido").
//
// Menu START → CÂMERA → FOTO DE VERDADE. Abre a webcam do computador (o
// navegador pergunta antes) e mostra você AO VIVO, foto normal, sem efeito
// (ele pediu pixel art, 4x, 16x, e no fim "foto normal"), numa camada nítida
// por cima do jogo (src/core/camada.js), com o Pokémon escolhido.
//   ← →  troca o Pokémon (a equipe primeiro, depois todos); ↑ ↓ pula 25;
//        os NÚMEROS do teclado digitam o nº da Pokédex (25 = PIKACHU)
//   SHIFT + setas, ou ARRASTAR com o mouse: move o Pokémon; RODINHA: tamanho
//   A (ou Z, ou a letra A): tira a foto e já guarda no ÁLBUM (f.foto, JPEG)
//   C: o BONEQUINHO (src/systems/boneco.js), opcional — "não precisar montar"
//   B: sai
import { Input, Mouse } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { drawText } from "../core/font.js";
import { Assets } from "../core/assets.js";
import { DB } from "../data/index.js";
import { tirarFoto } from "../systems/fotos.js";
import { PARTES, CORES_EDITAR, lerCores, desenharFotoBoneco } from "../systems/boneco.js";
import { ESCALA, criarCamada, prepararCamada, esconderCamada } from "../core/camada.js";

const W = 240, H = 160;
export const FOTO_PX = { w: 172, h: 112 };
// onde a foto fica na tela (o porta-retrato), igual ao álbum
const FX = 34, FY = 14;

const T = {
  titulo: "FOTO DE VERDADE",
  ligando: ["LIGANDO A CÂMERA...", "SE O NAVEGADOR PERGUNTAR,", "CLIQUE EM PERMITIR!"],
  erro: ["NÃO DEU PRA ABRIR A CÂMERA.", "VEJA SE ELA ESTÁ LIGADA E SE", "VOCÊ DEIXOU O JOGO USAR."],
  ajuda: "A:FOTO C:BONECO SHIFT+SETA:MOVER",
  editar: "↑↓ PARTE  ←→ COR  A: GUARDAR",
  salva: "FOTO GUARDADA NO ÁLBUM!",
};

/** todos os Pokémon que dá pra escolher: a sua equipe primeiro, depois a Pokédex inteira */
function listaDeMons(st) {
  const equipe = (st.party || []).map((m) => m.species).filter((s) => DB.SPECIES[s]);
  const todos = Object.values(DB.SPECIES).filter((sp) => sp.dex > 0 && sp.dex <= 1200 && !sp.fusao
    && !/mega|gmax|vinculo|carnaval/.test(sp.id)).sort((a, b) => a.dex - b.dex).map((sp) => sp.id);
  return [...new Set([...equipe, ...todos])];
}

/** o recorte da webcam do tamanho da foto, espelhado, SEM filtro (pra ler as cores) */
export function recortar(fonte, sw, sh) {
  const { w, h } = FOTO_PX;
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const g = c.getContext("2d", { willReadFrequently: true });
  const prop = w / h;
  let cw = sw, ch = sw / prop;
  if (ch > sh) { ch = sh; cw = sh * prop; }
  g.translate(w, 0); g.scale(-1, 1);
  g.drawImage(fonte, (sw - cw) / 2, (sh - ch) / 2, cw, ch, 0, 0, w, h);
  return c;
}

export class CameraRealScene {
  enter() {
    const st = this.game.state;
    this.mons = listaDeMons(st);
    const segue = (st.party || [])[0]?.species;
    this.i = Math.max(0, this.mons.indexOf(segue));
    this.modo = "ligando";
    this.t = 0; this.flash = 0; this.aviso = 0;
    // o Pokémon: onde fica dentro da foto (pontos do jogo) e o tamanho
    this.L = 72;
    this.pos = { x: FOTO_PX.w - this.L - 4, y: FOTO_PX.h - this.L };
    this.video = document.createElement("video");
    this.video.muted = true; this.video.playsInline = true;
    if (!navigator.mediaDevices?.getUserMedia) { this.modo = "erro"; return; }
    navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" }, audio: false })
      .then((s) => {
        if (this.saiu) return s.getTracks().forEach((t) => t.stop());
        this.stream = s; this.video.srcObject = s;
        return this.video.play().then(() => { this.modo = "aovivo"; });
      })
      .catch((e) => { console.warn("câmera:", e); this.modo = "erro"; });
  }

  exit() {
    this.camada?.remove(); this.camada = null;
    this.saiu = true;
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
  }

  get mon() { return { species: this.mons[this.i] }; }

  /** a foto que está sendo editada no bonequinho: o boneco, o Pokémon e onde você está */
  fotoAtual() {
    const p = this.game.state.player || {};
    return { boneco: this.cores, mon: this.mon.species, mapa: p.map, x: p.x, y: p.y };
  }

  /** o Pokémon não sai inteiro da foto (pelo menos metade dele fica dentro) */
  prender() {
    const { w, h } = FOTO_PX, m = this.L / 2;
    this.pos.x = Math.max(-m, Math.min(w - m, this.pos.x));
    this.pos.y = Math.max(-m, Math.min(h - m, this.pos.y));
  }

  /** A FOTO: a webcam (como espelho) e o Pokémon por cima, com 4x mais pontos,
   *  num JPEG que vai pro álbum */
  fotografar() {
    const { w, h } = FOTO_PX;
    const c = document.createElement("canvas"); c.width = w * ESCALA; c.height = h * ESCALA;
    const g = c.getContext("2d");
    desenharWebcam(g, this.video, 0, 0, w * ESCALA, h * ESCALA);
    g.setTransform(ESCALA, 0, 0, ESCALA, 0, 0);
    g.imageSmoothingEnabled = false;
    Assets.desenhaVivo(g, this.mon, Math.round(this.pos.x), Math.round(this.pos.y), this.L);
    return c.toDataURL("image/jpeg", 0.85);
  }

  update(dt) {
    this.t += dt;
    this.flash = Math.max(0, this.flash - dt * 3);
    this.aviso = Math.max(0, this.aviso - dt);
    const n = this.mons.length;
    // a LETRA A do teclado (no jogo ela é "esquerda", do WASD) aqui é o botão A:
    // tira a foto, e não troca o Pokémon (o CAIO apertava A e só trocava)
    const letraA = Input.consomeTecla("KeyA");
    if (letraA) Input.consume("left");
    const apertouA = () => Input.consume("a") || letraA;
    if (this.modo === "ligando") { if (Input.consume("b")) this.game.scenes.pop(); return; }
    if (this.modo === "erro") { if (Input.consume("b") || apertouA()) this.game.scenes.pop(); return; }
    if (this.modo === "editar") {
      // O BONEQUINHO: ↑↓ a parte, ←→ a cor dela (a 1ª é a que veio da foto)
      const m = PARTES.length;
      if (Input.consume("up")) { this.parte = (this.parte + m - 1) % m; Audio2.blip(); }
      if (Input.consume("down")) { this.parte = (this.parte + 1) % m; Audio2.blip(); }
      const id = PARTES[this.parte].id, opcoes = [this.daFoto[id], ...CORES_EDITAR];
      const k = Math.max(0, opcoes.indexOf(this.cores[id]));
      if (Input.consume("left")) { this.cores = { ...this.cores, [id]: opcoes[(k + opcoes.length - 1) % opcoes.length] }; Audio2.blip(); }
      if (Input.consume("right")) { this.cores = { ...this.cores, [id]: opcoes[(k + 1) % opcoes.length] }; Audio2.blip(); }
      if (apertouA()) {
        tirarFoto(this.game.state, { mon: this.mon.species, nome: DB.SPECIES[this.mon.species]?.name, boneco: { ...this.cores } });
        this.game.autosave?.(true);
        Audio2.blip(); this.aviso = 1.5; this.modo = "aovivo";
      } else if (Input.consume("b")) { Audio2.blip(); this.modo = "aovivo"; }
      return;
    }
    // AO VIVO
    if (Input.consume("b")) return void this.game.scenes.pop();
    const v = this.video;
    if (Input.held("run")) {
      // SHIFT + setas: anda com o Pokémon pela foto
      for (const d of ["left", "right", "up", "down"]) Input.consume(d);
      const vel = 70 * dt;
      if (Input.held("left")) this.pos.x -= vel;
      if (Input.held("right")) this.pos.x += vel;
      if (Input.held("up")) this.pos.y -= vel;
      if (Input.held("down")) this.pos.y += vel;
      this.prender();
    } else {
      if (Input.consume("left")) { this.i = (this.i + n - 1) % n; Audio2.blip(); }
      if (Input.consume("right")) { this.i = (this.i + 1) % n; Audio2.blip(); }
      if (Input.consume("up")) { this.i = (this.i + n - 25) % n; Audio2.blip(); }
      if (Input.consume("down")) { this.i = (this.i + 25) % n; Audio2.blip(); }
    }
    // ARRASTAR com o mouse: pega o Pokémon e leva; a RODINHA muda o tamanho
    const mx = Mouse.x - FX, my = Mouse.y - FY;
    if (Mouse.clicou && mx >= this.pos.x && my >= this.pos.y && mx < this.pos.x + this.L && my < this.pos.y + this.L) {
      this.arrasto = { dx: mx - this.pos.x, dy: my - this.pos.y };
    }
    if (this.arrasto && Mouse.botao) { this.pos.x = mx - this.arrasto.dx; this.pos.y = my - this.arrasto.dy; this.prender(); }
    if (!Mouse.botao) this.arrasto = null;
    if (Mouse.roda && Mouse.dentro) {
      const antes = this.L;
      this.L = Math.max(24, Math.min(160, this.L - Mouse.roda * 8));
      // cresce pelo meio
      this.pos.x -= (this.L - antes) / 2; this.pos.y -= (this.L - antes) / 2;
      this.prender();
    }
    // o NÚMERO da Pokédex: digita (até 4 algarismos) e ele pula pro Pokémon
    for (let k = 0; k <= 9; k++) {
      if (!Input.consomeTecla(`Digit${k}`) && !Input.consomeTecla(`Numpad${k}`)) continue;
      this.numero = ((this.numero || "") + k).replace(/^0+/, "").slice(-4);
      this.numeroT = 1.5;
      const achou = this.mons.findIndex((id) => DB.SPECIES[id]?.dex === Number(this.numero));
      if (achou >= 0) { this.i = achou; Audio2.blip(); }
    }
    if (this.numeroT > 0 && (this.numeroT -= dt) <= 0) this.numero = "";
    if (!v.videoWidth) return;
    // A: CLIQUE! a foto normal, direto pro álbum
    if (apertouA()) {
      tirarFoto(this.game.state, { mon: this.mon.species, nome: DB.SPECIES[this.mon.species]?.name, foto: this.fotografar() });
      this.game.autosave?.(true);
      this.flash = 1; this.aviso = 1.5;
      Audio2.blip?.();
    }
    // C: o BONEQUINHO (opcional): lê as cores do rosto/cabelo/camisa
    if (Input.consume("select")) {
      this.daFoto = lerCores(recortar(v, v.videoWidth, v.videoHeight));
      this.cores = { ...this.daFoto };
      this.parte = 0;
      this.flash = 1; this.modo = "editar";
      Audio2.blip?.();
    }
  }

  render(ctx) {
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#2a2230"; ctx.fillRect(0, 0, W, H);
    for (let y = 0; y < H; y += 8) { ctx.fillStyle = (y / 8) % 2 ? "#30283a" : "#2a2230"; ctx.fillRect(0, y, W, 8); }
    drawText(ctx, T.titulo, 6, 4, "#ffd860");
    if (this.modo === "ligando" || this.modo === "erro") {
      esconderCamada(this.camada);
      const l = this.modo === "erro" ? T.erro : T.ligando;
      l.forEach((s, k) => drawText(ctx, s, (W - s.length * 6) / 2, 60 + k * 12, "#ffffff"));
      drawText(ctx, "X: VOLTAR", 6, H - 10, "#c8c8d8");
      return;
    }
    // o porta-retrato, igual ao do álbum
    const x = FX, y = FY, { w, h } = FOTO_PX;
    const editando = this.modo === "editar";
    ctx.fillStyle = "rgba(0,0,0,0.4)"; ctx.fillRect(x - 4, y - 2, w + 12, h + 30);
    ctx.fillStyle = editando ? "#f4f0e8" : "#16202c"; ctx.fillRect(x - 6, y - 6, w + 12, h + 30);
    if (editando) {
      esconderCamada(this.camada);
      // o bonequinho anda no lugar enquanto você pinta
      desenharFotoBoneco(ctx, this.fotoAtual(), x, y, w, h, Math.floor(this.t * 4));
      const p = PARTES[this.parte], cor = this.cores[p.id];
      const leg = `↑ ${p.nome} ↓  ← COR →`;
      const lx = x + (w - leg.length * 6 - 12) / 2;
      drawText(ctx, leg, lx, y + h + 4, "#303040");
      ctx.fillStyle = "#303040"; ctx.fillRect(lx + leg.length * 6 + 2, y + h + 3, 10, 9);
      ctx.fillStyle = cor; ctx.fillRect(lx + leg.length * 6 + 3, y + h + 4, 8, 7);
      if (this.flash > 0) { ctx.fillStyle = `rgba(255,255,255,${this.flash})`; ctx.fillRect(x, y, w, h); }
    } else {
      this.desenharAoVivo(x, y, w, h);
      const nome = `${DB.SPECIES[this.mon.species]?.name || ""}`;
      const dex = DB.SPECIES[this.mon.species]?.dex;
      const leg = this.numero ? `N.${this.numero}_ ${nome}` : `← N.${dex || "?"} ${nome} →`;
      drawText(ctx, leg, x + (w - leg.length * 6) / 2, y + h + 4, "#ffffff");
    }
    if (this.aviso > 0) drawText(ctx, T.salva, (W - T.salva.length * 6) / 2, y + h + 14, "#60e080");
    drawText(ctx, editando ? T.editar : T.ajuda, 6, H - 10, "#c8c8d8");
  }

  /** O AO VIVO na camada de cima (nítida): a webcam, o Pokémon onde você
   *  colocou, o pontinho vermelho e o clarão */
  desenharAoVivo(x, y, w, h) {
    this.camada ||= criarCamada();
    const g = prepararCamada(this.camada);
    if (!g) return;
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
    desenharWebcam(g, this.video, x * ESCALA, y * ESCALA, w * ESCALA, h * ESCALA);
    g.restore();
    // o Pokémon só aparece dentro da foto
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    Assets.desenhaVivo(g, this.mon, Math.round(x + this.pos.x), Math.round(y + this.pos.y), this.L);
    if (this.arrasto) { g.strokeStyle = "rgba(255,216,96,0.9)"; g.lineWidth = 0.5; g.strokeRect(x + this.pos.x, y + this.pos.y, this.L, this.L); }
    g.restore();
    if (Math.floor(this.t * 2) % 2) { g.fillStyle = "#e03030"; g.fillRect(x + 4, y + 4, 4, 4); }
    if (this.flash > 0) { g.fillStyle = `rgba(255,255,255,${this.flash})`; g.fillRect(x, y, w, h); }
  }
}

/** a webcam como ela é: o meio da imagem na proporção da caixa, espelhada (como espelho) */
export function desenharWebcam(g, v, x, y, w, h) {
  if (!v?.videoWidth) { g.fillStyle = "#16202c"; g.fillRect(x, y, w, h); return; }
  const sw = v.videoWidth, sh = v.videoHeight, prop = w / h;
  let cw = sw, ch = sw / prop;
  if (ch > sh) { ch = sh; cw = sh * prop; }
  g.save();
  g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
  g.translate(x + w, y); g.scale(-1, 1);
  g.drawImage(v, (sw - cw) / 2, (sh - ch) / 2, cw, ch, 0, 0, w, h);
  g.restore();
}

/** o Pokémon na foto antiga (pixelada): grande, embaixo à direita */
export function desenharMonNaFoto(ctx, mon, x, y, w, h) {
  const L = 72;
  Assets.desenhaVivo(ctx, mon, x + w - L - 4, y + h - L, L);
}
