// CRIAR UMA REGIÃO.
//
// O jogo traz nove regiões de inicial (KANTO a PALDEA) escritas no código. Esta
// tela deixa quem joga fazer a sua: um nome e três Pokémon — um de PLANTA, um de
// FOGO, um de ÁGUA, que é a forma que todo trio inicial tem desde 1996.
//
// POR QUE OS TRÊS TIPOS SÃO FIXOS: não é falta de liberdade, é o que faz a
// escolha ser uma escolha. Trio de três Pokémon de fogo não é um trio, é uma
// lista — quem pegasse não estaria decidindo nada. A graça do inicial é que os
// três se batem entre si.
//
// A região criada entra na caixa do laboratório DEPOIS das nove, e fica guardada
// no navegador e não no save (ver src/core/regioes.js): ela é de quem inventou,
// não da partida.
import { DB } from "../data/index.js";
import { Input, Texto } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { Regioes, candidatos } from "../core/regioes.js";
import { drawText, panel, menuBox, cursor, PAL } from "../core/gfx.js";
import { SpriteStore, pedirMon } from "../core/sprites.js";

const W = 240, H = 160;
const TIPOS = ["PLANTA", "FOGO", "ÁGUA"];

export class RegioesScene {
  enter() {
    this.linha = 0;                 // 0 nome, 1..3 os tipos, 4 criar, 5 voltar
    this.nome = "";
    this.listas = TIPOS.map((t) => candidatos(t, DB.SPECIES));
    this.idx = [0, 0, 0];
    this.recado = "";
    this.pedirSprites();
  }

  /** Os três que estão escolhidos agora, pra mostrar o desenho. */
  escolhidos() {
    return this.idx.map((i, t) => this.listas[t][i]).filter(Boolean);
  }

  pedirSprites() {
    for (const sp of this.escolhidos()) pedirMon(sp.id, sp.spriteDex || sp.dex);
  }

  update() {
    // DIGITANDO O NOME: o teclado vira texto e o mapa de botões desliga sozinho
    // (src/core/input.js). Nada mais desta tela responde enquanto isso.
    if (Texto.ativo()) {
      const fim = Texto.estado();
      if (fim) {
        const escrito = Texto.termina();
        if (escrito !== null) this.nome = escrito;
        Audio2.select();
      }
      return;
    }

    if (Input.consume("up")) { this.linha = (this.linha + 5) % 6; Audio2.blip(); }
    if (Input.consume("down")) { this.linha = (this.linha + 1) % 6; Audio2.blip(); }

    const t = this.linha - 1;
    if (t >= 0 && t <= 2) {
      const lista = this.listas[t];
      const anda = (d) => {
        if (!lista.length) return;
        this.idx[t] = (this.idx[t] + d + lista.length) % lista.length;
        Audio2.blip();
        this.pedirSprites();
      };
      if (Input.consume("left")) anda(-1);
      if (Input.consume("right")) anda(1);
      // segurar CORRER anda de dez em dez: a lista de PLANTA tem dezenas, e
      // atravessar de um em um até o fim é castigo
      if (Input.held("run") && Input.pressed("right")) anda(9);
    }

    if (Input.consume("a")) {
      if (this.linha === 0) { Audio2.select(); Texto.comeca(this.nome, 16); return; }
      if (this.linha === 4) return this.criar();
      if (this.linha === 5) return this.sair();
      Audio2.select();
    }
    if (Input.consume("b")) this.sair();
  }

  criar() {
    const mons = this.escolhidos().map((sp) => sp.id);
    if (mons.length !== 3) return void this.erra("FALTA ESCOLHER OS TRÊS.");
    if (!this.nome.trim()) return void this.erra("A REGIÃO PRECISA DE UM NOME.");
    const r = Regioes.criar(this.nome, mons, DB.REGIOES);
    if (!r) return void this.erra("JÁ EXISTE UMA REGIÃO COM ESSE NOME.");
    Audio2.heal();
    this.recado = `${r.nome} CRIADA! ELA APARECE NO LABORATÓRIO.`;
    this.nome = "";
  }

  erra(texto) {
    Audio2.cancel();
    this.recado = texto;
  }

  sair() {
    Audio2.cancel();
    this.game.scenes.pop();
  }

  render(ctx) {
    ctx.fillStyle = "#101018";
    ctx.fillRect(0, 0, W, H);
    drawText(ctx, "CRIAR REGIÃO", 8, 6, PAL.ink);

    const minhas = Regioes.minhas();
    drawText(ctx, `SUAS: ${minhas.length}`, W - 8 - `SUAS: ${minhas.length}`.length * 6, 6, PAL.ink2);

    // o nome
    panel(ctx, 8, 18, W - 16, 20);
    drawText(ctx, "NOME", 14, 24, PAL.ink2);
    drawText(ctx, this.nome || "(APERTE Z)", 54, 24, this.nome ? PAL.ink : PAL.ink2);
    if (this.linha === 0) cursor(ctx, 4, 24);

    // os três
    TIPOS.forEach((tipo, t) => {
      const y = 44 + t * 24;
      panel(ctx, 8, y, W - 16, 22);
      drawText(ctx, tipo, 14, y + 7, PAL.ink2);
      const sp = this.listas[t][this.idx[t]];
      drawText(ctx, sp ? sp.name : "(NENHUM)", 72, y + 7, PAL.ink);
      drawText(ctx, "<", 62, y + 7, PAL.ink2);
      drawText(ctx, ">", W - 22, y + 7, PAL.ink2);
      if (this.linha === t + 1) cursor(ctx, 4, y + 7);
      // o desenho, pequeno, à direita — ver o bicho é metade da escolha
      const img = sp && SpriteStore.pokemon[sp.id];
      if (img) ctx.drawImage(img, W - 44, y - 1, 24, 24);
    });

    menuBox(ctx, 8, 118, 104, ["CRIAR"], this.linha === 4 ? 0 : -1);
    menuBox(ctx, 124, 118, 108, ["VOLTAR"], this.linha === 5 ? 0 : -1);

    if (this.recado) drawText(ctx, this.recado, 8, 146, PAL.ink2);

    if (Texto.ativo()) {
      panel(ctx, 8, 60, W - 16, 40);
      drawText(ctx, "NOME DA REGIÃO (ENTER=OK, ESC=VOLTA)", 14, 66, PAL.ink2);
      const pisca = ((performance.now() / 400) | 0) % 2 === 0;
      drawText(ctx, Texto.buf() + (pisca ? "_" : ""), 14, 82, PAL.ink);
    }
  }
}
