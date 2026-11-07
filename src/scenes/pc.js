// O PC DO JEITO OFICIAL: a CAIXA em grade (6 x 5, com o nome em cima e as
// setas pra trocar de caixa, num papel de parede), e do lado esquerdo quem está
// debaixo do cursor, grande. A mesma tela serve pros POKÉMON (as boxes do PC)
// e pros ITENS (o PC do quarto, 5 caixas).
//
//   game.scenes.push(new PcScene(), { modo: "mons" | "itens", onDone })
//
// POKÉMON: a lista guardada continua sendo `state.box` (o resto do jogo lê
// ela); cada caixa mostra 30 dela. Quem tinha ido pras boxes de dentro
// (`state.boxes`, o GO PARK) volta pra lista ao abrir. Z num Pokémon: PÔR NA
// EQUIPE, MOVER ou SOLTAR; o botão EQUIPE mostra a equipe pra GUARDAR alguém.
// ITENS: `state.pcItens` = [{ item: qtd }, ...] — Z num item: RETIRAR.
import { DB } from "../data/index.js";
import { Assets } from "../core/assets.js";
import { reduzido } from "../core/reduzir.js";
import { desenharItem } from "../core/itens.js";
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { drawText, panel, PAL, bar, hpColor } from "../core/gfx.js";
import { Dialogue } from "../systems/dialogue.js";

const COLS = 6, ROWS = 5, POR_CAIXA = COLS * ROWS;
const GX = 89, GY = 25, CW = 24, CH = 20;     // a grade: onde começa e o tamanho da casa
const CAIXAS_MONS = () => DB.BOX?.count || 14;

/** o desenho do Pokémon com a cor dele (shiny, alfa), no tamanho pedido */
const arteMon = (mon, lado) => {
  const img = Assets.mon(mon.species, mon.seed);
  return img ? reduzido(Assets.comCor(img, mon), lado) : null;
};

export class PcScene {
  enter({ modo = "mons", onDone, soltar } = {}) {
    this.modo = modo;
    this.onDone = onDone;
    this.soltar = soltar;        // SOLTAR é da cena do mapa (a cutscene é dela)
    this.st = this.game.state;
    this.dlg = new Dialogue();
    this.caixa = 0;
    this.area = "grade";         // "topo" (o nome da caixa) | "grade" | "botoes" | "equipe"
    this.i = 0;                  // a casa da grade, ou o botão, ou o da equipe
    this.segurando = null;       // MOVER: o índice (na lista) de quem está na mão
    this.t = 0;
    if (modo === "mons") {
      this.st.box ||= [];
      // quem foi pras boxes de dentro (GO PARK) volta pra lista, que é o que o jogo lê
      for (const b of this.st.boxes || []) {
        for (let k = 0; k < (b.mons || []).length; k++) {
          if (b.mons[k]) { this.st.box.push(b.mons[k]); b.mons[k] = null; }
        }
      }
      this.caixa = Math.min(this.st.boxAtual | 0, CAIXAS_MONS() - 1);
    }
    Audio2.tone(660, 0.05); Audio2.tone(990, 0.08);
  }

  // ------------------------------------------------------------- os dados
  get nCaixas() { return this.modo === "mons" ? CAIXAS_MONS() : this.st.pcItens.length; }
  nomeCaixa(k) {
    return this.modo === "mons" ? (DB.BOX?.nomePadrao || "BOX {N}").replace("{N}", k + 1) : `CAIXA ${k + 1}`;
  }
  papel(k) {
    const P = DB.BOX_PAPEIS || [];
    return P[(this.modo === "mons" ? k : k + 2) % Math.max(1, P.length)] || { fundo: "#8fa6c8", detalhe: "#7690b6" };
  }
  /** o que está em cada uma das 30 casas da caixa `k` (null = vazia) */
  casas(k = this.caixa) {
    if (this.modo === "mons") {
      return Array.from({ length: POR_CAIXA }, (_, j) => this.st.box[k * POR_CAIXA + j] || null);
    }
    const lista = Object.entries(this.st.pcItens[k] || {}).filter(([, q]) => q > 0)
      .map(([item, qtd]) => ({ item, qtd }));
    return Array.from({ length: POR_CAIXA }, (_, j) => lista[j] || null);
  }
  /** quem está debaixo do cursor agora */
  get sob() {
    if (this.area === "equipe") return this.st.party[this.i] || null;
    if (this.area !== "grade") return null;
    return this.casas()[this.i];
  }
  get botoes() { return this.modo === "mons" ? ["EQUIPE", "FECHAR"] : ["FECHAR"]; }

  // ------------------------------------------------------------- update
  update(dt) {
    this.t += dt;
    if (this.dlg.active || this.dlg.choice) return void this.dlg.update(dt);
    if (Input.consume("b")) {
      if (this.segurando != null) { this.segurando = null; return void Audio2.cancel(); }
      if (this.area === "equipe") { this.area = "botoes"; this.i = 0; return void Audio2.cancel(); }
      return this.fechar();
    }
    const cima = Input.consume("up"), baixo = Input.consume("down");
    const esq = Input.consume("left"), dir = Input.consume("right");
    const mexeu = cima || baixo || esq || dir;
    if (this.area === "topo") {
      if (esq || dir) this.trocaCaixa(dir ? 1 : -1);
      if (baixo) { this.area = "grade"; this.i = Math.min(this.i, COLS - 1); }
    } else if (this.area === "grade") {
      const c = this.i % COLS, r = (this.i / COLS) | 0;
      if (esq) { if (c > 0) this.i--; else this.trocaCaixa(-1, () => (this.i += COLS - 1)); }
      if (dir) { if (c < COLS - 1) this.i++; else this.trocaCaixa(1, () => (this.i -= COLS - 1)); }
      if (cima) { if (r > 0) this.i -= COLS; else this.area = "topo"; }
      if (baixo) { if (r < ROWS - 1) this.i += COLS; else { this.area = "botoes"; this.i = 0; } }
    } else if (this.area === "botoes") {
      if (esq || dir) this.i = (this.i + 1) % this.botoes.length;
      if (cima) { this.area = "grade"; this.i = POR_CAIXA - COLS; }
    } else if (this.area === "equipe") {
      const n = Math.max(1, this.st.party.length);
      if (cima) this.i = (this.i + n - 1) % n;
      if (baixo) this.i = (this.i + 1) % n;
    }
    if (mexeu) Audio2.blip();
    if (Input.consume("a")) this.apertou();
  }

  trocaCaixa(d, depois) {
    this.caixa = (this.caixa + d + this.nCaixas) % this.nCaixas;
    if (this.modo === "mons") this.st.boxAtual = this.caixa;
    depois?.();
  }

  apertou() {
    if (this.area === "botoes") {
      const b = this.botoes[this.i];
      if (b === "FECHAR") return this.fechar();
      if (b === "EQUIPE") { Audio2.select(); this.area = "equipe"; this.i = 0; }
      return;
    }
    if (this.area === "topo") return;
    if (this.area === "equipe") return this.acoesDaEquipe();
    const idx = this.caixa * POR_CAIXA + this.i;
    if (this.modo === "mons" && this.segurando != null) return this.soltarAqui(idx);
    const x = this.sob;
    if (!x) return;
    Audio2.select();
    if (this.modo === "itens") {
      return void this.dlg.ask(`${x.item.toUpperCase()} X${x.qtd}`, ["RETIRAR", "VOLTAR"], (k) => {
        if (k !== 0) return;
        this.st.items[x.item] = Math.min(999, (this.st.items[x.item] || 0) + x.qtd);
        delete this.st.pcItens[this.caixa][x.item];
        Audio2.heal();
        this.game.autosave?.(true);
        this.dlg.say(`VOCÊ RETIROU ${x.item.toUpperCase()} X${x.qtd}!`);
      });
    }
    const opcoes = ["PÔR NA EQUIPE", "MOVER", ...(this.soltar ? ["SOLTAR"] : []), "VOLTAR"];
    this.dlg.ask(`O QUE FAZER COM ${x.nickname}?`, opcoes, (k) => {
      if (opcoes[k] === "SOLTAR") {
        this.game.scenes.pop();
        return this.soltar(this.st.box, idx);
      }
      const B = DB.STORY.box || {};
      if (k === 0) {
        if (this.st.party.length >= 6) return void this.dlg.say(B.equipeCheia || "A EQUIPE ESTÁ CHEIA.");
        this.st.box.splice(idx, 1);
        this.st.party.push(x);
        Audio2.heal();
        this.game.autosave?.(true);
        return void this.dlg.say((B.tirou || "{MON} ENTROU NA EQUIPE.").replace("{MON}", x.nickname));
      }
      if (k === 1) this.segurando = idx;
    });
  }

  /** MOVER: larga quem está na mão aqui — troca com quem estiver, ou vai pra
   *  primeira vaga da caixa (a lista não tem buraco) */
  soltarAqui(idx) {
    const de = this.segurando, box = this.st.box;
    this.segurando = null;
    if (de === idx) return void Audio2.cancel();
    if (box[idx]) [box[de], box[idx]] = [box[idx], box[de]];
    else {
      const [mon] = box.splice(de, 1);
      box.splice(Math.min(idx, box.length), 0, mon);
    }
    Audio2.select();
    this.game.autosave?.(true);
  }

  acoesDaEquipe() {
    const mon = this.st.party[this.i];
    if (!mon) return;
    const B = DB.STORY.box || {};
    Audio2.select();
    this.dlg.ask(`O QUE FAZER COM ${mon.nickname}?`, ["GUARDAR", "VOLTAR"], (k) => {
      if (k !== 0) return;
      if (this.st.party.length <= 1) return void this.dlg.say(B.ultimo || "ELE É O ÚLTIMO DA EQUIPE.");
      if (mon.hp > 0 && this.st.party.filter((p) => p.hp > 0).length <= 1) {
        return void this.dlg.say(B.semLutador || "VOCÊ FICARIA SEM NINGUÉM PRA LUTAR.");
      }
      this.st.party.splice(this.i, 1);
      // entra no fim da caixa aberta
      this.st.box.splice(Math.min((this.caixa + 1) * POR_CAIXA, this.st.box.length), 0, mon);
      this.i = Math.min(this.i, this.st.party.length - 1);
      Audio2.heal();
      this.game.autosave?.(true);
      this.dlg.say((B.guardou || "{MON} FOI GUARDADO.").replace("{MON}", mon.nickname));
    });
  }

  fechar() {
    Audio2.cancel();
    this.game.scenes.pop();
    this.onDone?.();
  }

  // ------------------------------------------------------------- render
  render(ctx) {
    ctx.fillStyle = "#283848"; ctx.fillRect(0, 0, 240, 160);
    this.renderInfo(ctx);
    this.renderCaixa(ctx);
    // os botões de baixo
    panel(ctx, 86, 128, 152, 30);
    this.botoes.forEach((b, k) => {
      const x = 96 + k * 70;
      const on = this.area === "botoes" && this.i === k;
      if (on) { ctx.fillStyle = "#f8d030"; ctx.fillRect(x - 4, 136, b.length * 6 + 8, 13); }
      drawText(ctx, b, x, 139, PAL.ink);
    });
    if (this.area === "equipe") this.renderEquipe(ctx);
    this.dlg.render(ctx);
  }

  renderCaixa(ctx) {
    // o nome, com as setas
    panel(ctx, 86, 2, 152, 22);
    const nome = this.nomeCaixa(this.caixa);
    const on = this.area === "topo";
    if (on) { ctx.fillStyle = "#f8d030"; ctx.fillRect(98, 6, 128, 14); }
    drawText(ctx, "<", 92, 9, PAL.ink);
    drawText(ctx, ">", 228, 9, PAL.ink);
    drawText(ctx, nome, 162 - nome.length * 3, 9, PAL.ink);
    // o papel de parede
    const p = this.papel(this.caixa);
    ctx.fillStyle = p.fundo; ctx.fillRect(GX - 1, GY - 1, COLS * CW + 2, ROWS * CH + 2);
    ctx.fillStyle = p.detalhe;
    for (let y = 0; y < ROWS * CH; y += 8) {
      for (let x = (y / 8) % 2 ? 4 : 0; x < COLS * CW; x += 8) ctx.fillRect(GX + x, GY + y, 2, 2);
    }
    // as casas
    const casas = this.casas();
    casas.forEach((x, j) => {
      const cx = GX + (j % COLS) * CW, cy = GY + ((j / COLS) | 0) * CH;
      if (!x) return;
      const idx = this.caixa * POR_CAIXA + j;
      if (this.segurando === idx) ctx.globalAlpha = 0.35;
      if (this.modo === "mons") {
        const img = arteMon(x, 22);
        if (img) ctx.drawImage(img, cx + 1, cy - 2, 22, 22);
      } else {
        desenharItem(ctx, x.item, cx + 4, cy + 2);
      }
      ctx.globalAlpha = 1;
    });
    // o cursor: a casa acesa e a mãozinha em cima
    if (this.area === "grade") {
      const cx = GX + (this.i % COLS) * CW, cy = GY + ((this.i / COLS) | 0) * CH;
      ctx.strokeStyle = "#f8f8f8"; ctx.lineWidth = 1;
      ctx.strokeRect(cx + 0.5, cy + 0.5, CW - 1, CH - 1);
      const pulo = Math.round(Math.sin(this.t * 6) * 1.5);
      ctx.fillStyle = "#f8d030";
      for (let k = 0; k < 4; k++) ctx.fillRect(cx + 9 + k, cy - 6 + k + pulo, 6 - 2 * k, 1);
      // quem está na mão vai junto com o cursor
      if (this.segurando != null && this.st.box[this.segurando]) {
        const img = arteMon(this.st.box[this.segurando], 22);
        if (img) ctx.drawImage(img, cx + 1, cy - 12 + pulo, 22, 22);
      }
    }
  }

  renderInfo(ctx) {
    panel(ctx, 2, 2, 82, 156);
    const x = this.sob;
    if (!x) {
      drawText(ctx, this.modo === "mons" ? "PC DE" : "PC DE", 10, 10, PAL.ink2);
      drawText(ctx, this.modo === "mons" ? "POKÉMON" : "ITENS", 10, 22, PAL.ink2);
      drawText(ctx, "Z ESCOLHE", 10, 128, PAL.ink2);
      drawText(ctx, "X SAI", 10, 140, PAL.ink2);
      return;
    }
    if (this.modo === "itens") {
      desenharItem(ctx, x.item, 11, 14, 4);
      const nome = x.item.toUpperCase();
      drawText(ctx, nome.slice(0, 12), 8, 86, PAL.ink);
      if (nome.length > 12) drawText(ctx, nome.slice(12, 24), 8, 98, PAL.ink);
      drawText(ctx, `X${x.qtd}`, 8, 112, PAL.ink2);
      return;
    }
    const img = arteMon(x, 64);
    if (img) ctx.drawImage(img, 11, 8, 64, 64);
    drawText(ctx, (x.shiny ? "*" : "") + x.nickname.slice(0, 11), 8, 76, x.shiny ? "#d8a828" : PAL.ink);
    drawText(ctx, `NV ${x.level}`, 8, 88, PAL.ink2);
    const tipos = DB.SPECIES[x.species]?.types || [];
    tipos.forEach((t, k) => drawText(ctx, t, 8, 100 + k * (tipos.length > 2 ? 8 : 11), DB.TYPE_COLOR?.[t] || PAL.ink2));   // a tripla tem 3
    const pct = x.maxHp ? x.hp / x.maxHp : 0;
    drawText(ctx, "HP", 8, 126, PAL.ink2);
    bar(ctx, 22, 128, 54, 4, pct, hpColor(pct));
  }

  renderEquipe(ctx) {
    // a equipe por cima da caixa, pra escolher quem GUARDAR
    panel(ctx, 86, 26, 152, 100);
    drawText(ctx, "EQUIPE", 94, 30, PAL.ink2);
    this.st.party.forEach((mon, k) => {
      const y = 42 + k * 14;
      if (k === this.i) { ctx.fillStyle = "#f8d030"; ctx.fillRect(90, y - 2, 144, 13); }
      const img = arteMon(mon, 16);
      if (img) ctx.drawImage(img, 92, y - 3, 16, 16);
      drawText(ctx, `${mon.nickname.slice(0, 10)}`, 112, y, mon.hp > 0 ? PAL.ink : "#b04040");
      drawText(ctx, `N${mon.level}`, 206, y, PAL.ink2);
    });
  }
}
