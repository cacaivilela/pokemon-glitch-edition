// A OFICINA DE POKÉMÁQUINA (src/data/pokemaquinas.js, src/systems/pokemaquinas.js).
// O jogador escolhe o TIPO de Pokémon que move a máquina e CONSTRÓI — de graça:
// sem peça nenhuma ela é a BÁSICA. As peças da mochila, encaixadas na GRADE, são
// MELHORIAS. Do lado, a PRÉVIA: o desenho que ela vai ter no mapa (a carcaça com
// as peças por cima) e o que ela vai fazer. Também abre pra MELHORAR uma máquina
// que já existe (`args.grade`, `args.tipo`): aí SAIR desfaz o que mexeu.
//
//   setas   andam na grade          A       põe a peça escolhida (sai da mochila)
//   SELECT  troca a peça            B       tira a peça (volta pra mochila); na casa vazia, o MENU
//   no MENU: o TIPO (< >), CONSTRUIR e SAIR (as peças encaixadas voltam)
import { DB } from "../data/index.js";
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { drawText, fade, panel, PAL } from "../core/gfx.js";
import { avaliar, desenhoDaGrade } from "../systems/pokemaquinas.js";

const W = 240, H = 160;
const CEL_W = 12, CEL_H = 14, GX = 10, GY = 24;

export class ConstrucaoScene {
  /** args: { st, aoConstruir(grade, tipo), grade?, tipo? (MELHORAR uma que já existe) } */
  enter(args = {}) {
    this.st = args.st;
    this.aoConstruir = args.aoConstruir;
    const g = DB.POKEMAQUINAS_GRADE;
    this.g = g;
    this.original = args.grade || null;                       // MELHORAR: a grade de antes
    this.grade = (args.grade || ".".repeat(g.w * g.h)).split("");
    this.cx = 0; this.cy = 0;
    this.codigos = Object.keys(g.codigos);                  // p e f m r
    this.peca = Math.max(0, this.codigos.findIndex((c) => this.st.items[g.codigos[c]] > 0));
    this.tipos = DB.POKEMAQUINAS_TIPOS;
    // começa no tipo do primeiro da equipe (é quem vai mover ela, provavelmente)
    const t0 = args.tipo || (this.st.party?.[0]?.types || DB.SPECIES[this.st.party?.[0]?.species]?.types || [])[0];
    this.tipo = Math.max(0, this.tipos.indexOf(t0));
    // sem peça nenhuma não tem o que encaixar: já abre no menu, em CONSTRUIR (a BÁSICA é de graça)
    const temPeca = this.codigos.some((c) => this.qtdPeca(c) > 0);
    this.modo = temPeca ? "grade" : "menu"; this.menuI = temPeca ? 0 : 1;
    this.t = 0; this.fadeA = 1; this.fadeDir = -1; this.saindo = null; this.aviso = ""; this.avisoT = 0;
  }

  get gradeStr() { return this.grade.join(""); }
  get av() { return avaliar(this.gradeStr, this.tipos[this.tipo]); }
  qtdPeca(c) { return this.st.items[this.g.codigos[c]] || 0; }
  avisa(t) { this.aviso = t; this.avisoT = 2.2; }

  update(dt) {
    this.t += dt;
    this.avisoT = Math.max(0, this.avisoT - dt);
    if (this.fadeDir) {
      this.fadeA = Math.max(0, Math.min(1, this.fadeA + this.fadeDir * dt * 3));
      if (this.fadeDir < 0 && this.fadeA <= 0) this.fadeDir = 0;
    }
    if (this.saindo) {
      if (this.fadeA >= 1) { const fim = this.saindo; this.saindo = null; this.game.scenes.pop(); fim(); }
      return;
    }
    if (this.modo === "menu") return this.updateMenu();
    const g = this.g, i = this.cy * g.w + this.cx;
    if (Input.consume("up")) { this.cy = (this.cy + g.h - 1) % g.h; Audio2.select(); }
    if (Input.consume("down")) { this.cy = (this.cy + 1) % g.h; Audio2.select(); }
    if (Input.consume("left")) { this.cx = (this.cx + g.w - 1) % g.w; Audio2.select(); }
    if (Input.consume("right")) { this.cx = (this.cx + 1) % g.w; Audio2.select(); }
    if (Input.consume("select")) {
      // a próxima peça que você TEM
      for (let k = 1; k <= this.codigos.length; k++) {
        const n = (this.peca + k) % this.codigos.length;
        if (this.qtdPeca(this.codigos[n]) > 0 || k === this.codigos.length) { this.peca = n; break; }
      }
      Audio2.select();
    }
    if (Input.consume("a")) {
      const c = this.codigos[this.peca], item = g.codigos[c];
      if (!(this.st.items[item] > 0)) { Audio2.cancel(); return this.avisa("SEM ESSA PEÇA. B > CONSTRUIR"); }
      if (this.grade[i] !== ".") this.devolve(i);           // trocou a peça: a velha volta
      this.st.items[item] -= 1;
      if (this.st.items[item] <= 0) delete this.st.items[item];
      this.grade[i] = c;
      Audio2.tone(700, 0.04, "square", 0.4);
    }
    if (Input.consume("b")) {
      if (this.grade[i] !== ".") { this.devolve(i); Audio2.tone(400, 0.04, "square", 0.4); }
      else { this.modo = "menu"; this.menuI = 0; Audio2.select(); }
    }
  }

  /** a peça da casa `i` volta pra mochila */
  devolve(i) {
    const item = this.g.codigos[this.grade[i]];
    if (item) this.st.items[item] = Math.min(999, (this.st.items[item] || 0) + 1);
    this.grade[i] = ".";
  }

  updateMenu() {
    const n = 3;
    if (Input.consume("up")) { this.menuI = (this.menuI + n - 1) % n; Audio2.select(); }
    if (Input.consume("down")) { this.menuI = (this.menuI + 1) % n; Audio2.select(); }
    if (this.menuI === 0) {
      if (Input.consume("left")) { this.tipo = (this.tipo + this.tipos.length - 1) % this.tipos.length; Audio2.select(); }
      if (Input.consume("right")) { this.tipo = (this.tipo + 1) % this.tipos.length; Audio2.select(); }
    }
    if (Input.consume("b")) { this.modo = "grade"; Audio2.cancel(); return; }
    if (!Input.consume("a")) return;
    if (this.menuI === 0) { this.tipo = (this.tipo + 1) % this.tipos.length; return void Audio2.select(); }
    if (this.menuI === 1) {
      const grade = this.gradeStr, tipo = this.tipos[this.tipo];
      Audio2.tone(523, 0.08, "square", 0.5); Audio2.tone(784, 0.12, "square", 0.5);
      this.fadeDir = 1;
      this.saindo = () => this.aoConstruir?.(grade, tipo);
      return;
    }
    // SAIR: tudo que foi encaixado volta pra mochila — e, MELHORANDO, a máquina volta
    // a ser como era (as peças dela saem da mochila de novo: elas estavam lá)
    for (let i = 0; i < this.grade.length; i++) if (this.grade[i] !== ".") this.devolve(i);
    if (this.original) for (const ch of this.original) {
      const item = this.g.codigos[ch];
      if (!item) continue;
      this.st.items[item] -= 1;
      if (this.st.items[item] <= 0) delete this.st.items[item];
    }
    Audio2.cancel();
    this.fadeDir = 1;
    this.saindo = () => {};
  }

  render(ctx) {
    ctx.imageSmoothingEnabled = false;
    const g = this.g, av = this.av;
    // a bancada
    ctx.fillStyle = "#2a2018"; ctx.fillRect(0, 0, W, H);
    for (let y = 0; y < H; y += 8) { ctx.fillStyle = y % 16 ? "#31261c" : "#2a2018"; ctx.fillRect(0, y, W, 4); }
    drawText(ctx, DB.POKEMAQUINAS_TEXTO.titulo, 8, 6, "#ffd860");

    // A GRADE
    ctx.fillStyle = "#14100c"; ctx.fillRect(GX - 3, GY - 3, g.w * CEL_W + 4, g.h * CEL_H + 4);
    for (let y = 0; y < g.h; y++) for (let x = 0; x < g.w; x++) {
      const px = GX + x * CEL_W, py = GY + y * CEL_H, ch = this.grade[y * g.w + x];
      ctx.fillStyle = (x + y) % 2 ? "#1e1912" : "#231d15"; ctx.fillRect(px, py, CEL_W - 2, CEL_H - 2);
      if (ch !== ".") desenhaPeca(ctx, ch, px, py, 2);
    }
    if (this.modo === "grade") {
      const px = GX + this.cx * CEL_W, py = GY + this.cy * CEL_H, pisca = Math.sin(this.t * 8) > -0.3;
      ctx.strokeStyle = pisca ? "#ffd860" : "#a07820"; ctx.lineWidth = 1;
      ctx.strokeRect(px - 1.5, py - 1.5, CEL_W + 1, CEL_H + 1);
    }

    // A PRÉVIA (o desenho que ela vai ter no mapa) e o que ela faz
    panel(ctx, 86, 20, 148, 96);
    ctx.fillStyle = "#88c070"; ctx.fillRect(92, 26, 52, 52);
    ctx.drawImage(desenhoDaGrade(this.gradeStr), 94, 28, 48, 48);
    const pct = (k) => Math.round(k * 100);
    const linhas = av.planta.efeito === "curar"
      ? ["CURA A EQUIPE", `ESPERA ${av.espera} MIN`, `AMIZADE +${av.amizade}`]
      : [`${av.qtd}X POR USO`, `ESPERA ${av.espera} MIN`, `SORTE +${pct(av.sorte)}%`, `DOBRO +${pct(av.dobro)}%`, `AMIZADE +${av.amizade}`];
    linhas.forEach((l, k) => drawText(ctx, l.slice(0, 13), 150, 28 + k * 11, PAL.ink2));
    drawText(ctx, av.nome, 92, 84, PAL.ink);
    const produz = av.planta.efeito === "curar" ? "" : (av.planta.sorteio || []).slice(0, 3).map((x) => x[0]).join(", ");
    if (produz) drawText(ctx, ("FAZ: " + produz).slice(0, 23).toUpperCase(), 92, 95, PAL.ink2);
    const T = DB.POKEMAQUINAS_TEXTO;
    drawText(ctx, (av.total ? T.melhorada.replace("{N}", av.total) : T.basica).slice(0, 23), 92, 106, av.total ? "#208030" : PAL.ink2);

    // AS PEÇAS que você tem (a escolhida acesa)
    this.codigos.forEach((c, k) => {
      const x = 10 + k * 46, y = 124;
      const sel = k === this.peca;
      ctx.fillStyle = sel ? "#5a4418" : "#1e1912"; ctx.fillRect(x - 2, y - 2, 42, 18);
      if (sel) { ctx.strokeStyle = "#ffd860"; ctx.strokeRect(x - 2.5, y - 2.5, 43, 19); }
      desenhaPeca(ctx, c, x, y, 2);
      drawText(ctx, `X${this.qtdPeca(c)}`, x + 14, y + 3, this.qtdPeca(c) ? "#f0e8d8" : "#806858");
    });
    drawText(ctx, DB.POKEMAQUINAS_GRADE.codigos[this.codigos[this.peca]].toUpperCase(), 10, 145, "#f0e8d8");
    drawText(ctx, "SELECT:PEÇA B:CONSTRUIR", 96, 145, "#a89878");

    // O MENU
    if (this.modo === "menu") {
      panel(ctx, 86, 64, 148, 52);
      const ops = [`TIPO: < ${this.tipos[this.tipo]} >`, this.original ? "PRONTO" : "CONSTRUIR", "SAIR"];
      ops.forEach((o, k) => drawText(ctx, (k === this.menuI ? ">" : " ") + o, 92, 70 + k * 14, k === this.menuI ? PAL.ink : PAL.ink2));
    }
    if (this.avisoT > 0) {
      panel(ctx, 20, 60, 200, 22);
      drawText(ctx, this.aviso.slice(0, 31), Math.round(W / 2 - Math.min(31, this.aviso.length) * 3), 68, "#c03030");
    }
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }
}

/** uma peça na tela (a mesma cara que ela tem no desenho da máquina), `k` vezes maior */
function desenhaPeca(ctx, ch, x, y, k) {
  const c = desenhoDaPeca(ch);
  if (c) ctx.drawImage(c, x, y, 5 * k, 6 * k);
}
const pecas = new Map();
function desenhoDaPeca(ch) {
  if (!pecas.has(ch)) pecas.set(ch, desenhoDaGradeUmaPeca(ch));
  return pecas.get(ch);
}
/** só a peça, recortada do desenho de uma grade com ela sozinha no canto */
function desenhoDaGradeUmaPeca(ch) {
  const g = DB.POKEMAQUINAS_GRADE, s = ch + ".".repeat(g.w * g.h - 1);
  const m = desenhoDaGrade(s, true);
  // na grade sozinha ela fica no canto de baixo, encostada no chão: x=1, y=26..31
  const cv = document.createElement("canvas"); cv.width = 5; cv.height = 6;
  cv.getContext("2d").drawImage(m, 1, 26, 5, 6, 0, 0, 5, 6);
  return cv;
}
