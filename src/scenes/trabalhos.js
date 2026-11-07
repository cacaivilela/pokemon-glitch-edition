// A TELA DOS POKÉTRABALHOS (ROTOMFONE → TRABALHOS; src/systems/trabalhos.js).
// A lista dos trabalhos (livre / volta em X / pronto); escolher um livre pede
// QUEM VAI (do BOX, até 3 — a estrela marca quem é do tipo que o trabalho pede)
// e QUANTO TEMPO. Pronto: A busca, e as falas contam o que eles trouxeram.
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { panel } from "../core/gfx.js";
import { drawText } from "../core/font.js";
import { TRABALHOS as T } from "../data/trabalhos.js";
import { trabalhosNaTela, falta, textoTempo, doBox, mandar, buscar } from "../systems/trabalhos.js";

const W = 240, H = 160, X = T.texto;
// quantas linhas cabem em cada tela (embaixo da lista vai o texto de ajuda)
const POR = { lista: 6, mons: 7, tempo: 6 };

export class TrabalhosScene {
  enter() { this.modo = "lista"; this.i = 0; this.top = 0; this.falas = []; this.sel = new Set(); }

  get st() { return this.game.state; }

  ir(modo, i = 0) { this.modo = modo; this.i = i; this.top = 0; }

  dizer(falas, depois = "lista") { this.falas = [].concat(falas); this.depois = depois; this.modo = "fala"; }

  linhas() {
    if (this.modo === "lista") return trabalhosNaTela(this.st).length;
    if (this.modo === "mons") return doBox(this.st).length + 1;
    if (this.modo === "tempo") return T.tempos.length;
    return 0;
  }

  update() {
    if (this.modo === "fala") {
      if (Input.consume("a") || Input.consume("b")) {
        Audio2.select?.();
        this.falas.shift();
        if (!this.falas.length) this.ir(this.depois);
      }
      return;
    }
    if (Input.consume("b")) {
      Audio2.cancel?.();
      if (this.modo === "tempo") return this.ir("mons");
      if (this.modo === "mons") return this.ir("lista");
      this.game.autosave?.(true);
      return void this.game.scenes.pop();
    }
    const n = this.linhas();
    if (!n) return;
    if (Input.consume("up")) { this.i = (this.i + n - 1) % n; Audio2.blip(); }
    if (Input.consume("down")) { this.i = (this.i + 1) % n; Audio2.blip(); }
    if (this.i < this.top) this.top = this.i;
    const P = POR[this.modo] || 6;
    if (this.i >= this.top + P) this.top = this.i - P + 1;
    if (!Input.consume("a")) return;
    Audio2.select?.();
    if (this.modo === "lista") {
      const job = trabalhosNaTela(this.st)[this.i], f = falta(this.st, job.id);
      this.job = job;
      if (f === 0) { const falas = buscar(this.st, job.id); Audio2.heal?.(); this.game.autosave?.(true); return this.dizer(falas || []); }
      if (f != null) return this.dizer(X.ainda.replace("{T}", textoTempo(f)));
      if (!doBox(this.st).length) return this.dizer(X.semBox);
      this.sel = new Set();
      return this.ir("mons");
    }
    if (this.modo === "mons") {
      if (this.i === 0) {
        if (!this.sel.size) return this.dizer(X.nenhum, "mons");
        return this.ir("tempo");
      }
      const mon = doBox(this.st)[this.i - 1];
      if (this.sel.has(mon)) this.sel.delete(mon);
      else if (this.sel.size < T.maxMons) this.sel.add(mon);
      return;
    }
    if (this.modo === "tempo") {
      const t = T.tempos[this.i], vao = mandar(this.st, this.job.id, [...this.sel], t.min) || [];
      this.game.autosave?.(true);
      const nomes = vao.map((m) => m.nickname).join(", ");
      return this.dizer((vao.length > 1 ? X.foram : X.foi).replace("{MONS}", nomes).replace("{T}", t.nome));
    }
  }

  lista(ctx, itens, P = 6) {
    for (let k = 0; k < P && this.top + k < itens.length; k++) {
      const it = itens[this.top + k], y = 26 + k * 13;
      if (this.top + k === this.i) { ctx.fillStyle = "#ffe9a0"; ctx.fillRect(9, y - 2, 222, 12); }
      drawText(ctx, it.txt.slice(0, 36), 12, y, it.cor || "#202020");
    }
  }

  render(ctx) {
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#2a3a5a"; ctx.fillRect(0, 0, W, H);
    for (let y = 0; y < H; y += 8) { ctx.fillStyle = (y / 8) % 2 ? "#2e4064" : "#283656"; ctx.fillRect(0, y, W, 8); }
    drawText(ctx, X.titulo, 8, 6, "#ffd860");
    panel(ctx, 6, 20, 228, 114);
    let ajuda = X.ajuda;
    if (this.modo === "lista" || (this.modo === "fala" && this.depois === "lista")) {
      const jobs = trabalhosNaTela(this.st);
      const itens = jobs.map((j) => {
        const f = falta(this.st, j.id);
        return { txt: `${j.nome}`, cor: f === 0 ? "#208030" : f != null ? "#7a5a20" : null };
      });
      this.lista(ctx, itens, POR.lista);
      // embaixo: os tipos que o escolhido pede e como ele está
      const j = jobs[this.i];
      if (j && this.modo === "lista") {
        const f = falta(this.st, j.id);
        const como = f === 0 ? X.pronto : f != null ? X.volta.replace("{T}", textoTempo(f)) : X.livre;
        drawText(ctx, `PEDE: ${j.tipos.join(" ")}`.slice(0, 37), 12, 112, "#304080");
        drawText(ctx, como, 12, 122, f === 0 ? "#208030" : "#202020");
      }
    } else if (this.modo === "mons" || (this.modo === "fala" && this.depois === "mons")) {
      const job = this.job;
      drawText(ctx, X.escolha, 12, 122, "#304080");
      const itens = [{ txt: X.mandar, cor: "#c03030" }, ...doBox(this.st).map((m) => {
        const tipo = (m.types || []).some((tp) => job.tipos.includes(tp));
        return { txt: `${this.sel.has(m) ? "[X]" : "[ ]"} ${m.nickname} NV${m.level}${tipo ? " ★" : ""}` };
      })];
      this.lista(ctx, itens, POR.mons);
    } else if (this.modo === "tempo") {
      drawText(ctx, X.quantoTempo, 12, 122, "#304080");
      this.lista(ctx, T.tempos.map((t) => ({ txt: t.nome })), POR.tempo);
    }
    if (this.modo === "fala") {
      // a caixa da fala por cima, embaixo
      ctx.fillStyle = "#ffffff"; ctx.fillRect(4, 116, 232, 40);
      ctx.strokeStyle = "#283656"; ctx.strokeRect(4.5, 116.5, 231, 39);
      const txt = this.falas[0] || "";
      const linhas = txt.match(/.{1,36}(\s|$)/g) || [txt];
      linhas.slice(0, 3).forEach((l, k) => drawText(ctx, l.trim(), 10, 121 + k * 11, "#202020"));
      ajuda = "A: CONTINUAR";
    }
    if (this.modo !== "fala") drawText(ctx, ajuda, 8, 148, "#c8d8ff");
  }
}
