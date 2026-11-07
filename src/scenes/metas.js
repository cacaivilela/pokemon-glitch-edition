// A TELA DAS METAS (menu START → METAS, src/systems/metas.js). A lista das
// suas metas com NOVA META em cima. A escolhe, B volta.
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { Assets } from "../core/assets.js";
import { panel } from "../core/gfx.js";
import { drawText } from "../core/font.js";
import { DB } from "../data/index.js";
import { KINDS, metas, criarMeta, apagarMeta, textoDaMeta } from "../systems/metas.js";

const W = 240, H = 160, POR_TELA = 8;
const COR = { feita: "#208030", quebrada: "#c03030" };

export class MetasScene {
  enter() {
    this.modo = "lista"; this.i = 0; this.top = 0;
    // QUALQUER POKÉMON em cima, depois as espécies em ordem de nome
    this.quem = [null, ...Object.keys(DB.SPECIES).filter((id) => !DB.SPECIES[id].fusao)
      .sort((a, b) => DB.SPECIES[a].name.localeCompare(DB.SPECIES[b].name))];
  }

  /** os lados pulam pra próxima letra da lista de Pokémon */
  pularLetra(d) {
    const letra = (i) => (this.quem[i] ? DB.SPECIES[this.quem[i]].name[0] : "");
    const n = this.quem.length, de = letra(this.i);
    let i = this.i;
    do { i = (i + d + n) % n; } while (i !== this.i && letra(i) === de);
    if (d < 0) while (letra((i + n - 1) % n) === letra(i) && i > 0) i--;
    this.i = i; Audio2.blip();
  }

  get st() { return this.game.state; }

  /** quantas linhas tem a tela de agora */
  linhas() {
    if (this.modo === "lista") return metas(this.st).length + 1;
    if (this.modo === "kind") return KINDS.length;
    if (this.modo === "tipo") return DB.TYPES.length;
    if (this.modo === "quem") return this.quem.length;
    return 0;
  }

  ir(modo, i = 0) { this.modo = modo; this.i = i; this.top = 0; }

  update() {
    if (this.modo === "numero") return this.updateNumero();
    if (this.modo === "apagar") return this.updateApagar();
    if (Input.consume("b")) {
      Audio2.cancel?.();
      if (this.modo === "tipo" || this.modo === "quem") return this.ir("kind");
      if (this.modo === "kind") return this.ir("lista");
      this.game.autosave?.();
      return void this.game.scenes.pop();
    }
    const n = this.linhas();
    if (Input.consume("up")) { this.i = (this.i + n - 1) % n; Audio2.blip(); }
    if (Input.consume("down")) { this.i = (this.i + 1) % n; Audio2.blip(); }
    if (this.modo === "quem") {
      if (Input.consume("right")) this.pularLetra(1);
      if (Input.consume("left")) this.pularLetra(-1);
    }
    if (this.i < this.top) this.top = this.i;
    if (this.i >= this.top + POR_TELA) this.top = this.i - POR_TELA + 1;
    if (!Input.consume("a")) return;
    Audio2.select();
    if (this.modo === "lista") {
      if (this.i === 0) this.ir("kind");
      else this.ir("apagar", this.i);
    } else if (this.modo === "kind") {
      this.kind = KINDS[this.i];
      this.esp = null; this.alvo = this.kind.alvo;
      if (this.kind.k === "tipo") this.ir("tipo");
      else if (this.kind.k === "derrotar") this.ir("quem");
      else this.ir("numero");
    } else if (this.modo === "quem") {
      this.esp = this.quem[this.i];
      this.ir("numero");
    } else if (this.modo === "tipo") {
      criarMeta(this.st, { k: "tipo", tipo: DB.TYPES[this.i] });
      this.ir("lista");
    }
  }

  updateNumero() {
    const { min, max } = this.kind;
    let d = 0;
    if (Input.consume("up")) d = 1;
    if (Input.consume("down")) d = -1;
    if (Input.consume("right")) d = 10;
    if (Input.consume("left")) d = -10;
    if (d) { this.alvo = Math.min(max, Math.max(min, this.alvo + d)); Audio2.blip(); }
    if (Input.consume("b")) { Audio2.cancel?.(); return this.ir("kind"); }
    if (Input.consume("a")) {
      Audio2.select();
      criarMeta(this.st, { k: this.kind.k, alvo: this.alvo, ...(this.esp ? { esp: this.esp } : {}) });
      this.ir("lista");
    }
  }

  updateApagar() {
    if (Input.consume("b")) { Audio2.cancel?.(); return this.ir("lista", this.i); }
    if (Input.consume("a")) {
      Audio2.select();
      apagarMeta(this.st, this.i - 1);
      this.ir("lista");
    }
  }

  /** `de`: a lista já vem cortada a partir dessa linha */
  lista(ctx, itens, de = null) {
    for (let k = 0; k < POR_TELA && this.top + k < (de ?? 0) + itens.length; k++) {
      const it = itens[de === null ? this.top + k : k], y = 28 + k * 13;
      if (this.top + k === this.i) { ctx.fillStyle = "#ffe9a0"; ctx.fillRect(9, y - 2, 222, 12); }
      drawText(ctx, it.txt, 12, y, it.cor || "#202020");
    }
  }

  render(ctx) {
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#2a3a5a"; ctx.fillRect(0, 0, W, H);
    for (let y = 0; y < H; y += 8) { ctx.fillStyle = (y / 8) % 2 ? "#2e4064" : "#283656"; ctx.fillRect(0, y, W, 8); }
    drawText(ctx, "METAS", 8, 6, "#ffd860");
    panel(ctx, 6, 20, 228, 114);
    let ajuda = "A: ESCOLHER  B: VOLTAR";
    if (this.modo === "lista") {
      this.lista(ctx, [{ txt: "+ NOVA META" }, ...metas(this.st).map((m) => ({
        txt: textoDaMeta(m) + (m.fim === "feita" ? " FEITA!" : m.fim === "quebrada" ? " QUEBROU" : ""),
        cor: COR[m.fim],
      }))]);
      ajuda = "A: ESCOLHER/APAGAR  B: SAIR";
    } else if (this.modo === "kind") {
      this.lista(ctx, KINDS.map((k) => ({ txt: k.nome })));
    } else if (this.modo === "tipo") {
      this.lista(ctx, DB.TYPES.map((t) => ({ txt: t })));
      ajuda = "OUTRO TIPO NA LUTA QUEBRA A META";
    } else if (this.modo === "quem") {
      this.lista(ctx, this.quem.slice(this.top, this.top + POR_TELA).map((id) => ({ txt: id ? DB.SPECIES[id].name : "QUALQUER POKÉMON" })), this.top);
      const img = this.quem[this.i] && Assets.mon(this.quem[this.i], 1);
      if (img) ctx.drawImage(img, 162, 44, 64, 64);
      ajuda = "LADOS: PULA DE LETRA  A: ESCOLHER";
    } else if (this.modo === "numero") {
      drawText(ctx, this.esp ? `DERROTAR ${DB.SPECIES[this.esp].name}` : this.kind.nome, 14, 44, "#202020");
      drawText(ctx, String(this.alvo), 14, 66, "#c03030");
      ajuda = "CIMA/BAIXO: 1  LADOS: 10  A: OK";
    } else {
      drawText(ctx, "APAGAR ESTA META?", 14, 44, "#202020");
      drawText(ctx, textoDaMeta(metas(this.st)[this.i - 1]), 14, 66, "#c03030");
      ajuda = "A: APAGAR  B: NÃO";
    }
    drawText(ctx, ajuda, 8, 142, "#c8d8ff");
  }
}
