// A TELA DA POKÉDEX. As regras (listas, visto/pego, onde vive, evolução,
// marcos) estão em src/systems/pokedex.js; as falas, em src/data/pokedex.js.
//
// Duas telas: a LISTA (com as três abas) e a FICHA de um bicho, em três
// páginas. O que você só VIU aparece desenhado e com nome; o que você PEGOU
// mostra tudo. O que você nunca viu é um tracinho — a Pokédex não adivinha.
import { progresso, completa } from "../systems/pesquisa.js";
import { DB } from "../data/index.js";
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { tocarGrito } from "../systems/gritos.js";
import { Assets } from "../core/assets.js";
import { panel, drawText, cursor, bar, fade, PAL, LINE_H, wrapText } from "../core/gfx.js";
import { Dialogue } from "../systems/dialogue.js";
import { idFusao, garantirEspecie } from "../systems/fusao.js";

// A DEX INFINITA (pedido do CAIO: "faz a dex infinita que é gerada pra fusões
// na hora"): cada CABEÇA x CORPO dos Pokémon de verdade tem um número — o da
// cabeça vezes quantos são, mais o do corpo. A ficha nasce quando o cursor
// passa por ela (garantirEspecie): ninguém guarda um milhão de fusões.
let BASE_INF = null;
const baseInfinita = () => (BASE_INF ||= Object.values(DB.SPECIES).filter((sp) => sp.dex > 0 && sp.dex <= 1025 && !sp.fusao
  && (sp.spriteDex || sp.dex) === sp.dex && !/mega|gmax|brag|vinculo|carnaval|-/.test(sp.id)).sort((a, b) => a.dex - b.dex).map((sp) => sp.id));
const fusaoDoNumero = (i) => { const B = baseInfinita(), n = B.length; return idFusao(B[Math.floor(i / n) % n], B[i % n]); };
/** o número de uma fusão na DEX INFINITA (0 = a primeira), ou -1 se ela não tem (tripla, forma) */
function numeroDaFusao(id) {
  const m = /^fus-([a-z0-9]+)-([a-z0-9]+)$/.exec(String(id).split("~")[0]);
  if (!m) return -1;
  const B = baseInfinita(), a = B.indexOf(m[1]), b = B.indexOf(m[2]);
  return a < 0 || b < 0 ? -1 : a * B.length + b;
}
/** SÓ AS QUE VOCÊ VIU (o CAIO: "só vi a fusão nº 4, aí só aparece a 4"): [{ i, id }] em ordem de número */
function fusoesVistas(st) {
  const vistas = new Set([...Object.keys(st.seen || {}), ...Object.keys(st.caught || {})].filter((k) => k.startsWith("fus-")));
  return [...vistas].map((id) => ({ id, i: numeroDaFusao(id) })).filter((x) => x.i >= 0).sort((a, b) => a.i - b.i);
}
import {
  listas, estado, contagem, sincronizar, onde, cadeia, peso, marcosDevidos, pagarMarco, proximoMarcoNacional, numeroNaDex, ABAS_DA_DEX,
} from "../systems/pokedex.js";

const W = 240, H = 160;
const LINHAS = 9;
const NOMES_STAT = [["hp", "HP"], ["atk", "ATAQUE"], ["def", "DEFESA"], ["spa", "ESP.ATQ"], ["spd", "ESP.DEF"], ["spe", "VELOC."]];
const num = (n) => String(Math.max(0, n | 0)).padStart(4, "0");
const T = () => DB.POKEDEX_TEXTO || {};

export class PokedexScene {
  enter(args = {}) {
    this.st = this.game.state;
    sincronizar(this.st);
    this.dlg = new Dialogue();
    this.aba = 0;
    this.index = 0;
    this.topo = 0;
    this.ficha = null;         // { id, pagina }
    this.fadeA = 1;
    this.t = 0;
    const alvo = args.especie;
    if (alvo) {
      // aberta direto na ficha de alguém (a captura de uma espécie nova)
      const lista = this.lista();
      const i = lista.indexOf(alvo);
      if (i >= 0) { this.index = i; this.topo = Math.max(0, i - 4); }
      this.ficha = { id: alvo, pagina: 0 };
    }
    this.avaliar();
  }

  /** O PROFESSOR AVALIA: cada marco de Kanto que passou e não foi pago ele fala
   *  pela Pokédex e manda o presente. Uma vez cada, na hora em que você abre. */
  avaliar() {
    const devidos = marcosDevidos(this.st);
    if (!devidos.length) return;
    const falas = [];
    for (const m of devidos) {
      if (!pagarMarco(this.st, m)) continue;
      falas.push(T().professor, m.fala,
        (T().mandou || "{QTD} {ITEM}").replace("{QTD}", m.qtd).replace("{ITEM}", m.item.toUpperCase()));
    }
    if (!falas.length) return;
    Audio2.heal();
    this.game.autosave?.(true);
    this.dlg.say(falas);
  }

  // AS ABAS (src/systems/pokedex.js, ABAS_DA_DEX): a GLITCH DEX, uma por
  // região, a NACIONAL e as FORMAS. O SELECT passa pra próxima.
  nomeAba() { return this.infinita() ? "FUSÕES ∞" : ABAS_DA_DEX[this.aba]?.nome || ""; }
  lista() { return listas()[ABAS_DA_DEX[this.aba]?.id] || []; }
  infinita() { return this.aba === ABAS_DA_DEX.length; }

  // --------------------------------------------------------------- update
  update(dt) {
    this.t += dt;
    this.fadeA = Math.max(0, this.fadeA - dt * 4);
    if (this.dlg.update(dt)) return;
    if (this.ficha) return this.updateFicha();
    if (this.infinita()) return this.updateInfinita();
    this.updateLista();
  }

  updateLista() {
    const lista = this.lista();
    const n = lista.length;
    const anda = (d) => {
      const novo = Math.max(0, Math.min(n - 1, this.index + d));
      if (novo !== this.index) { this.index = novo; Audio2.blip(); }
    };
    if (Input.consume("up")) anda(-1);
    if (Input.consume("down")) anda(1);
    if (Input.consume("left")) anda(-10);
    if (Input.consume("right")) anda(10);
    if (Input.consume("select")) {
      this.aba = (this.aba + 1) % (ABAS_DA_DEX.length + 1);     // a última é a DEX INFINITA
      this.index = 0; this.topo = 0;
      Audio2.select();
    }
    if (this.index < this.topo) this.topo = this.index;
    if (this.index >= this.topo + LINHAS) this.topo = this.index - LINHAS + 1;
    if (Input.consume("b")) { Audio2.cancel(); return void this.game.scenes.pop(); }
    if (Input.consume("a")) {
      const id = lista[this.index];
      if (!estado(this.st, id)) return void Audio2.cancel();   // nunca visto: não tem ficha
      Audio2.select();
      this.ficha = { id, pagina: 0 };
      setTimeout(() => tocarGrito(id), 120);    // a ficha abre com o grito dele
    }
  }

  updateFicha() {
    const f = this.ficha;
    const NP = (T().paginas || []).length || 4;
    if (Input.consume("left")) { f.pagina = (f.pagina + NP - 1) % NP; Audio2.blip(); }
    if (Input.consume("right")) { f.pagina = (f.pagina + 1) % NP; Audio2.blip(); }
    // cima/baixo: o anterior/próximo que você já viu, na mesma aba
    const passo = Input.consume("up") ? -1 : Input.consume("down") ? 1 : 0;
    if (passo) {
      const lista = this.lista();
      let i = lista.indexOf(f.id);
      for (let k = 0; k < lista.length; k++) {
        i = (i + passo + lista.length) % lista.length;
        if (estado(this.st, lista[i])) break;
      }
      if (lista[i] && lista[i] !== f.id) {
        f.id = lista[i];
        this.index = i;
        if (i < this.topo || i >= this.topo + LINHAS) this.topo = Math.max(0, i - 4);
        Audio2.blip();
      }
    }
    if (Input.consume("b")) { this.ficha = null; Audio2.cancel(); }
  }

  // --------------------------------------------------------------- render
  render(ctx) {
    ctx.fillStyle = "#c83838";                     // a carcaça vermelha da Pokédex
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#8a1c1c";
    for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 1);
    if (this.ficha) this.renderFicha(ctx);
    else if (this.infinita()) this.renderInfinita(ctx);
    else this.renderLista(ctx);
    this.dlg.render(ctx);
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }

  bolinha(ctx, x, y) {
    ctx.fillStyle = "#e0242a";
    ctx.beginPath(); ctx.arc(x + 3, y + 3, 3, Math.PI, 0); ctx.fill();
    ctx.fillStyle = "#f4f4f4";
    ctx.beginPath(); ctx.arc(x + 3, y + 3, 3, 0, Math.PI); ctx.fill();
    ctx.fillStyle = "#101010";
    ctx.fillRect(x, y + 3, 7, 1);
  }

  // ------------------------------------------------ A DEX INFINITA
  updateInfinita() {
    const lista = fusoesVistas(this.st), n = lista.length;
    const anda = (d) => { const novo = Math.max(0, Math.min(n - 1, this.index + d)); if (novo !== this.index) { this.index = novo; Audio2.blip(); } };
    if (Input.consume("up")) anda(-1);
    if (Input.consume("down")) anda(1);
    if (Input.consume("left")) anda(-10);
    if (Input.consume("right")) anda(10);
    if (Input.consume("select")) { this.aba = 0; this.index = 0; this.topo = 0; Audio2.select(); return; }
    if (this.index < this.topo) this.topo = this.index;
    if (this.index >= this.topo + LINHAS) this.topo = Math.max(0, this.index - LINHAS + 1);
    if (Input.consume("b")) { Audio2.cancel(); return void this.game.scenes.pop(); }
    if (Input.consume("a") && lista[this.index]) {
      const id = lista[this.index].id;
      if (!garantirEspecie(id)) return void Audio2.cancel();
      Audio2.select();
      this.ficha = { id, pagina: 0 };
      setTimeout(() => tocarGrito(id), 120);
    }
  }

  renderInfinita(ctx) {
    const B = baseInfinita(), N = B.length, lista = fusoesVistas(this.st);
    const pegas = lista.filter((x) => this.st.caught?.[x.id]).length;
    panel(ctx, 4, 3, 232, 24);
    drawText(ctx, `POKÉDEX  < ${this.nomeAba()} >`, 10, 6, PAL.ink);
    drawText(ctx, `VISTAS ${lista.length}   PEGAS ${pegas}   DE ${(N * N).toLocaleString("pt-BR")}`, 10, 16, PAL.ink2);
    panel(ctx, 4, 29, 132, LINHAS * LINE_H + 8);
    if (!lista.length) drawText(ctx, "NENHUMA AINDA", 30, 70, "#9aa0b0");
    for (let k = 0; k < LINHAS; k++) {
      const x = lista[this.topo + k], y = 33 + k * LINE_H;
      if (!x) break;
      const sp = garantirEspecie(x.id), e = estado(this.st, x.id);
      if (e === "pego") this.bolinha(ctx, 17, y + 1);
      drawText(ctx, String(x.i + 1).padStart(7, "0"), 27, y, PAL.ink2);
      drawText(ctx, String(sp?.name || "???").slice(0, 9), 71, y, PAL.ink);
      if (this.topo + k === this.index) cursor(ctx, 8, y);
    }
    panel(ctx, 140, 29, 96, 107);
    const x = lista[this.index], sp = x && garantirEspecie(x.id), e = x && estado(this.st, x.id);
    if (sp) {
      const im = Assets.mon(x.id, 1);
      if (im) ctx.drawImage(im, 156, 34, 64, 64);
      const nm = (q) => DB.SPECIES[q]?.name || q;
      drawText(ctx, `${nm(sp.fusao.cabeca)}`.slice(0, 14), 146, 96, PAL.ink2);
      drawText(ctx, `+ ${nm(sp.fusao.corpo)}`.slice(0, 14), 146, 106, PAL.ink2);
      sp.types.forEach((t, j) => drawText(ctx, t, 148 + j * 44, 116, DB.TYPE_COLOR?.[t] || PAL.ink));
      drawText(ctx, e === "pego" ? "PEGA" : "VISTA", 146, 126, e === "pego" ? "#2a8a3a" : PAL.ink2);
    } else drawText(ctx, "?", 184, 66, "#9aa0b0");
    drawText(ctx, "▲▼ ANDA  ◀▶ DE 10 EM 10  C ABA", 8, 148, "#ffe0e0");
  }

  renderLista(ctx) {
    const lista = this.lista();
    const c = contagem(this.st, lista);
    panel(ctx, 4, 3, 232, 24);
    drawText(ctx, `POKÉDEX  < ${this.nomeAba()} >`, 10, 6, PAL.ink);
    drawText(ctx, `${T().vistos || "VISTOS"} ${c.vistos}   ${T().pegos || "PEGOS"} ${c.pegos}/${c.total}`, 10, 16, PAL.ink2);
    // o PRÓXIMO PRÊMIO da NACIONAL, no canto: quantos você tem / quantos precisa
    const prox = proximoMarcoNacional(this.st);
    if (prox) {
      const txt = `PRÊMIO ${prox.tem}/${prox.n}`;
      drawText(ctx, txt, 230 - txt.length * 6, 6, PAL.glitch);
    }

    panel(ctx, 4, 29, 132, LINHAS * LINE_H + 8);
    lista.slice(this.topo, this.topo + LINHAS).forEach((id, k) => {
      const i = this.topo + k, y = 33 + k * LINE_H;
      const sp = DB.SPECIES[id];
      const e = estado(this.st, id);
      // nas abas regionais (e na GLITCH DEX) o número é a posição nela
      const n = ABAS_DA_DEX[this.aba]?.regional ? i + 1 : numeroNaDex(id);
      const numero = n >= 1 ? num(n) : "????";
      if (e === "pego") this.bolinha(ctx, 17, y + 1);
      if (completa(this.st, id)) drawText(ctx, "★", 124, y, "#c89a10");
      drawText(ctx, numero, 27, y, PAL.ink2);
      drawText(ctx, e ? String(sp.name).slice(0, 11) : "----------", 57, y, e ? PAL.ink : "#9aa0b0");
      if (i === this.index) cursor(ctx, 8, y);
    });
    if (this.topo > 0) drawText(ctx, "▲", 126, 31, PAL.ink2);
    if (this.topo + LINHAS < lista.length) drawText(ctx, "▼", 126, 29 + LINHAS * LINE_H, PAL.ink2);

    // à direita: o desenho de quem está no cursor
    panel(ctx, 140, 29, 96, 107);
    const id = lista[this.index];
    const e = estado(this.st, id);
    if (e) {
      const sp = DB.SPECIES[id];
      Assets.desenhaVivo(ctx, { species: id, seed: 1 }, 156, 34, 64);   // animado, quando tem
      sp.types.forEach((t, j) => drawText(ctx, t, 148, 102 + j * 11, DB.TYPE_COLOR?.[t] || PAL.ink));
      drawText(ctx, e === "pego" ? "PEGO" : "VISTO", 196, 124, e === "pego" ? "#2a8a3a" : PAL.ink2);
    } else {
      drawText(ctx, "?", 184, 66, "#9aa0b0");
    }
    drawText(ctx, T().ajudaLista || "", 8, 148, "#ffe0e0");
  }

  renderFicha(ctx) {
    const { id, pagina } = this.ficha;
    const sp = DB.SPECIES[id];
    const e = estado(this.st, id);
    const pego = e === "pego";
    const paginas = T().paginas || ["DADOS", "ATRIBUTOS", "ONDE"];
    panel(ctx, 4, 3, 232, 18);
    const numero = numeroNaDex(id) >= 1 ? `N.${num(numeroNaDex(id))}` : "N.????";
    drawText(ctx, `${numero} ${sp.name}`.slice(0, 22), 10, 7, PAL.ink);
    if (completa(this.st, id)) drawText(ctx, "★", 10 + Math.min(22, `${numero} ${sp.name}`.length) * 6 + 2, 7, "#c89a10");
    drawText(ctx, `< ${paginas[pagina]} >`, 226 - (paginas[pagina].length + 4) * 6, 7, PAL.ink2);

    panel(ctx, 4, 23, 232, 122);
    if (pagina === 0) {
      Assets.desenhaVivo(ctx, { species: id, seed: 1 }, 12, 26, 64);
      sp.types.forEach((t, j) => drawText(ctx, t, 88, 30 + j * 11, DB.TYPE_COLOR?.[t] || PAL.ink));
      const regiao = DB.REGIAO?.[id] || (sp.dex <= 151 && sp.dex >= 1 ? "KANTO" : sp.foreign ? "DE FORA" : "KANTO");
      drawText(ctx, `REGIÃO ${regiao}`, 88, 54, PAL.ink2);
      const kg = peso(id);
      drawText(ctx, pego && kg != null ? `PESO ${String(kg).replace(".", ",")} KG` : "PESO ???", 88, 65, PAL.ink2);
      drawText(ctx, pego ? "PEGO" : "VISTO", 88, 78, pego ? "#2a8a3a" : PAL.ink2);
      const texto = pego ? sp.dexText : T().semDados;
      // texto que não cabe em 4 linhas passa sozinho, 4 de cada vez, a cada 4 s
      // (o do ZYGARDE 200% tem o dobro dos outros)
      const linhas = wrapText(texto || "", 36), pags = Math.ceil(linhas.length / 4);
      const pag = pags > 1 ? Math.floor(performance.now() / 4000) % pags : 0;
      linhas.slice(pag * 4, pag * 4 + 4).forEach((l, j) => drawText(ctx, l, 12, 96 + j * 11, PAL.ink));
      if (pags > 1) drawText(ctx, `${pag + 1}/${pags}`, 214, 78, PAL.ink2);
    } else if (pagina === 1) {
      if (pego) {
        NOMES_STAT.forEach(([k, nome], j) => {
          const v = sp.base?.[k] || 0;
          const y = 28 + j * 10;
          drawText(ctx, nome, 12, y, PAL.ink2);
          drawText(ctx, String(v), 64, y, PAL.ink);
          bar(ctx, 88, y + 2, 140, 4, Math.min(1, v / 200), v >= 100 ? "#2a8a3a" : v >= 60 ? "#d8a828" : "#e0524a");
        });
        drawText(ctx, `TOTAL ${sp.bst || NOMES_STAT.reduce((a, [k]) => a + (sp.base?.[k] || 0), 0)}`, 12, 90, PAL.ink);
      } else {
        drawText(ctx, T().semDados || "", 12, 40, PAL.ink2);
      }
      // a linha de evolução: o nome de quem você já viu, ??? do resto
      const estagios = cadeia(id);
      drawText(ctx, "EVOLUÇÃO", 12, 104, PAL.ink2);
      if (estagios.length === 1) drawText(ctx, "NÃO EVOLUI.", 12, 116, PAL.ink);
      else {
        const nome = (x) => (estado(this.st, x) ? DB.SPECIES[x].name : "???");
        const linha = estagios.map((grupo) => grupo.map(nome).join("/")).join(" > ");
        wrapText(linha, 36).slice(0, 2).forEach((l, j) => drawText(ctx, l, 12, 116 + j * 11, PAL.ink));
      }
    } else if (pagina === 3) {
      // AS MISSÕES DA POKÉDEX (src/systems/pesquisa.js)
      const lista = progresso(this.st, id), cheia = completa(this.st, id);
      lista.slice(0, 10).forEach((t, j) => {
        const y = 28 + j * 10;
        drawText(ctx, t.feito ? "✓" : "-", 10, y, t.feito ? "#2a8a3a" : PAL.ink2);
        drawText(ctx, t.texto.slice(0, 29), 18, y, t.feito ? "#2a8a3a" : PAL.ink);
        const n = `${t.n}/${t.alvo}`;
        drawText(ctx, n, 230 - n.length * 6, y, t.feito ? "#2a8a3a" : PAL.ink2);
      });
      drawText(ctx, cheia ? "★ COMPLETA! SHINY 3X MAIS" : `FEITAS ${lista.filter((t) => t.feito).length}/${lista.length}`, 12, 132, cheia ? "#c89a10" : PAL.ink2);
    } else {
      const lugares = onde(id);
      if (!lugares.length) {
        wrapText(T().semLugar || "", 36).forEach((l, j) => drawText(ctx, l, 12, 30 + j * 11, PAL.ink2));
      } else {
        const cabe = lugares.length > 10 ? 9 : 10;
        lugares.slice(0, cabe).forEach((l, j) => drawText(ctx, `- ${String(l).slice(0, 34)}`, 12, 28 + j * 11, PAL.ink));
        if (lugares.length > cabe) drawText(ctx, `E MAIS ${lugares.length - cabe}...`, 12, 28 + cabe * 11, PAL.ink2);
      }
    }
    drawText(ctx, T().ajudaFicha || "", 8, 148, "#ffe0e0");
  }
}
