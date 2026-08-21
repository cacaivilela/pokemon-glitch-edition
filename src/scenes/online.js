// As telas do ONLINE: a sala (quem está aqui, convidar, conversar) e o
// PRESENTE MISTERIOSO.
//
// As duas são cenas transparentes: elas desenham por cima do mapa, como o menu
// normal do jogo. Quem está no meio de uma troca ou de uma batalha link não
// entra aqui — a cena de lá é que manda.
import { DB } from "../data/index.js";
import { Input, Texto } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { Net } from "../core/net.js";
import { Online } from "../systems/online.js";
import { Dialogue } from "../systems/dialogue.js";
import { guardar, cheio } from "../systems/box.js";
import { createMon } from "../systems/mon.js";
import { panel, menuBox, drawText, cursor, sinal, PAL, LINE_H } from "../core/gfx.js";

const W = 240, H = 160;
const txt = (k, vars = {}) =>
  String(DB.ONLINE_TEXTO?.[k] || k).replace(/\{(\w+)\}/g, (m, n) => vars[n] ?? m);
const gtxt = (k, vars = {}) =>
  String(DB.GIFT_TEXTO?.[k] || k).replace(/\{(\w+)\}/g, (m, n) => vars[n] ?? m);

/** Caixa de digitar: usada pro nome da sala e pro chat. */
function caixaTexto(ctx, titulo, buf, y = 96) {
  panel(ctx, 8, y, W - 16, 40);
  drawText(ctx, titulo, 16, y + 6, PAL.ink2);
  const piscando = ((performance.now() / 400) | 0) % 2 === 0;
  drawText(ctx, buf + (piscando ? "_" : ""), 16, y + 20, PAL.ink);
}

// =====================================================================
// A SALA
// =====================================================================
export class OnlineMenuScene {
  constructor() { this.transparent = true; }

  enter() {
    this.dlg = new Dialogue();
    this.modo = "menu";
    this.index = 0;
    this.alvo = 0;
    this.desinscreve = [
      Online.on("chat", (m) => this.dlg.say(`${m.nome}: ${m.texto}`)),
      Online.on("cartao", (c) => this.dlg.say(gtxt("chegou", { TITULO: c.titulo }))),
    ];
  }

  exit() { this.desinscreve.forEach((f) => f()); }

  get st() { return this.game.state; }

  itens() {
    const ligado = Online.ligado();
    return [
      ligado ? `SALA: ${Net.sala.toUpperCase()}` : "SALA",
      "QUEM ESTÁ AQUI",
      "CONVERSAR",
      "FRASES PRONTAS",
      "EMOTE",
      DB.GIFT_TEXTO.titulo,
      "VOLTAR",
    ];
  }

  /** submenu da sala: criar, entrar por código, procurar, sair */
  itensSala() {
    const base = ["CRIAR SALA", "ENTRAR POR CÓDIGO", "SALAS ABERTAS"];
    if (Online.ligado()) base.push("SAIR DA SALA");
    base.push("VOLTAR");
    return base;
  }

  /** Porteira opcional. Com `minimoBarras: 0` (o padrão) ela deixa tudo passar
   *  — o online aqui não depende de internet, depende do servidor. */
  comSinal(fn) {
    if (!Online.podeOnline()) return void this.dlg.say(Online.motivoSemSinal());
    fn();
  }

  outros() { return [...Online.peers.values()]; }

  update(dt) {
    if (this.dlg.update(dt)) return;

    if (this.modo === "sala") return this.updateSala();
    if (this.modo === "criar") return this.updateCriar();
    if (this.modo === "lista") return this.updateLista2();
    if (this.modo === "digitando") return this.updateDigitando();
    if (this.modo === "chat") return this.updateChat();
    if (this.modo === "jogadores") return this.updateJogadores();
    if (this.modo === "oque") return this.updateOque();
    if (this.modo === "frases") return this.updateLista(DB.FRASES || [], (f) => {
      Online.falar(f);
      this.dlg.say(`VOCÊ: ${f}`);
      this.modo = "menu";
    });
    if (this.modo === "emotes") return this.updateLista(DB.EMOTES || [], (e, i) => {
      Online.emote(i);
      this.modo = "menu";
    });
    return this.updateMenu();
  }

  updateMenu() {
    const itens = this.itens();
    this.index = Math.min(this.index, itens.length - 1);
    if (Input.consume("up")) { this.index = (this.index + itens.length - 1) % itens.length; Audio2.blip(); }
    if (Input.consume("down")) { this.index = (this.index + 1) % itens.length; Audio2.blip(); }
    if (Input.consume("b")) { Audio2.cancel(); return void this.game.scenes.pop(); }
    if (!Input.consume("a")) return;
    Audio2.select();

    const pick = itens[this.index];
    if (pick.startsWith("SALA")) { this.modo = "sala"; this.index2 = 0; return; }
    if (pick === DB.GIFT_TEXTO.titulo) return void this.game.scenes.push(new GiftScene());
    if (pick === "VOLTAR") return void this.game.scenes.pop();

    // daqui pra baixo tudo depende da sala E do sinal
    if (!Online.ligado()) return void this.dlg.say(txt("semServidor"));
    this.comSinal(() => {
      if (pick === "QUEM ESTÁ AQUI") {
        if (!this.outros().length) return void this.dlg.say(txt("sozinho"));
        this.modo = "jogadores"; this.alvo = 0;
      } else if (pick === "CONVERSAR") { this.modo = "chat"; this.index2 = 0; }
      else if (pick === "FRASES PRONTAS") { this.modo = "frases"; this.index2 = 0; }
      else if (pick === "EMOTE") { this.modo = "emotes"; this.index2 = 0; }
    });
  }

  // ---------------------------------------------------------------- a sala
  updateSala() {
    const itens = this.itensSala();
    this.index2 = Math.min(this.index2, itens.length - 1);
    if (Input.consume("up")) { this.index2 = (this.index2 + itens.length - 1) % itens.length; Audio2.blip(); }
    if (Input.consume("down")) { this.index2 = (this.index2 + 1) % itens.length; Audio2.blip(); }
    if (Input.consume("b")) { this.modo = "menu"; return void Audio2.cancel(); }
    if (!Input.consume("a")) return;
    Audio2.select();
    const pick = itens[this.index2];
    if (pick === "VOLTAR") { this.modo = "menu"; return; }
    if (pick === "SAIR DA SALA") {
      Online.sair();
      this.modo = "menu";
      return void this.dlg.say("VOCÊ SAIU DA SALA.");
    }
    this.comSinal(() => {
      if (pick === "CRIAR SALA") { this.modo = "criar"; this.index3 = 0; }
      else if (pick === "ENTRAR POR CÓDIGO") {
        this.modo = "digitando";
        Texto.comeca(Net.sala || DB.ONLINE?.salaPadrao || "kanto", 20);
      } else if (pick === "SALAS ABERTAS") {
        this.modo = "lista"; this.index3 = 0; this.salas = null;
        this.procuraSalas();
      }
    });
  }

  /** CRIAR SALA: sorteia um código e escolhe se ela aparece na lista. */
  updateCriar() {
    const op = ["ABERTA (APARECE NA LISTA)", "PRIVADA (SÓ COM O CÓDIGO)", "VOLTAR"];
    if (Input.consume("up")) { this.index3 = (this.index3 + op.length - 1) % op.length; Audio2.blip(); }
    if (Input.consume("down")) { this.index3 = (this.index3 + 1) % op.length; Audio2.blip(); }
    if (Input.consume("b")) { this.modo = "sala"; return void Audio2.cancel(); }
    if (!Input.consume("a")) return;
    Audio2.select();
    if (this.index3 === 2) { this.modo = "sala"; return; }
    const privada = this.index3 === 1;
    this.modo = "menu";
    const codigo = Online.criarSala(privada);
    if (!codigo) return void this.dlg.say(Online.motivoSemSinal());
    this.dlg.say([
      txt("salaCriada", { SALA: codigo }),
      privada ? txt("salaPrivada") : txt("salaAberta"),
    ]);
  }

  async procuraSalas() {
    try {
      const r = await fetch("/__salas", { cache: "no-store" });
      const dados = await r.json();
      this.salas = dados.salas || [];
    } catch {
      this.salas = [];
    }
  }

  updateLista2() {
    if (this.salas === null) return;                  // ainda procurando
    if (!this.salas.length) {
      this.modo = "sala";
      return void this.dlg.say(txt("nenhumaSala"));
    }
    const lista = this.salas;
    this.index3 = Math.min(this.index3, lista.length - 1);
    if (Input.consume("up")) { this.index3 = (this.index3 + lista.length - 1) % lista.length; Audio2.blip(); }
    if (Input.consume("down")) { this.index3 = (this.index3 + 1) % lista.length; Audio2.blip(); }
    if (Input.consume("b")) { this.modo = "sala"; return void Audio2.cancel(); }
    if (!Input.consume("a")) return;
    Audio2.select();
    const alvo = lista[this.index3];
    this.modo = "menu";
    this.comSinal(() => {
      Online.conectar(alvo.sala);
      this.dlg.say(txt("entrando", { SALA: String(alvo.sala).toUpperCase() }));
    });
  }

  updateDigitando() {
    const estado = Texto.estado();
    if (!estado) return;
    const nome = Texto.termina();
    this.modo = "menu";
    if (nome === null) return void Audio2.cancel();
    Audio2.select();
    const ok = Online.conectar(nome.toLowerCase().replace(/[^a-z0-9_-]/g, "") || "kanto");
    this.dlg.say(ok ? txt("entrando", { SALA: nome.toUpperCase() }) : Online.motivoSemSinal());
  }

  updateChat() {
    // ENTER manda, ESC volta. Enquanto se digita o teclado é todo texto, então
    // as frases prontas ficam no menu, e não num botão daqui.
    if (!Texto.ativo()) {
      Texto.comeca("", DB.ONLINE?.maxChat || 40);
      return;
    }
    const estado = Texto.estado();
    if (!estado) return;
    const frase = Texto.termina();
    this.modo = "menu";
    if (frase === null) return void Audio2.cancel();
    const dito = Online.falar(frase);
    if (dito) this.dlg.say(`VOCÊ: ${dito}`);
  }

  updateLista(lista, escolheu) {
    if (Input.consume("up")) { this.index2 = (this.index2 + lista.length - 1) % lista.length; Audio2.blip(); }
    if (Input.consume("down")) { this.index2 = (this.index2 + 1) % lista.length; Audio2.blip(); }
    if (Input.consume("b")) { this.modo = "menu"; return void Audio2.cancel(); }
    if (Input.consume("a")) { Audio2.select(); escolheu(lista[this.index2], this.index2); }
  }

  updateJogadores() {
    const lista = this.outros();
    if (!lista.length) { this.modo = "menu"; return; }
    this.alvo = Math.min(this.alvo, lista.length - 1);
    if (Input.consume("up")) { this.alvo = (this.alvo + lista.length - 1) % lista.length; Audio2.blip(); }
    if (Input.consume("down")) { this.alvo = (this.alvo + 1) % lista.length; Audio2.blip(); }
    if (Input.consume("b")) { this.modo = "menu"; return void Audio2.cancel(); }
    if (Input.consume("a")) { Audio2.select(); this.modo = "oque"; this.index2 = 0; }
  }

  updateOque() {
    const opcoes = ["CHAMAR PRA TROCAR", "DESAFIAR", "VOLTAR"];
    const lista = this.outros();
    const alvo = lista[this.alvo];
    if (!alvo) { this.modo = "menu"; return; }
    if (Input.consume("up")) { this.index2 = (this.index2 + opcoes.length - 1) % opcoes.length; Audio2.blip(); }
    if (Input.consume("down")) { this.index2 = (this.index2 + 1) % opcoes.length; Audio2.blip(); }
    if (Input.consume("b")) { this.modo = "jogadores"; return void Audio2.cancel(); }
    if (!Input.consume("a")) return;
    Audio2.select();
    const pick = opcoes[this.index2];
    if (pick === "VOLTAR") { this.modo = "jogadores"; return; }
    const modo = pick === "DESAFIAR" ? "batalha" : "troca";
    if (modo === "batalha" && !this.st.party.some((m) => m.hp > 0)) {
      return void this.dlg.say(txt("batalhaSemTime"));
    }
    if (modo === "troca" && this.st.party.length < 2) {
      return void this.dlg.say(txt("trocaUltimo"));
    }
    if (!Online.convidar(alvo.id, modo)) return void this.dlg.say(txt("semServidor"));
    this.modo = "menu";
    this.dlg.say(txt("convidou", { NOME: alvo.nome }));
  }

  render(ctx) {
    const ligado = Online.ligado();
    const barras = Online.barras();
    panel(ctx, 4, 4, 132, 22);
    const cabeca = ligado ? `${Net.sala.toUpperCase()} - ${Online.peers.size + 1}` : "FORA DE SALA";
    drawText(ctx, cabeca, 12, 9, ligado ? PAL.ink : PAL.ink2);
    sinal(ctx, 116, 9, barras);

    if (this.modo === "jogadores" || this.modo === "oque") {
      const lista = this.outros();
      const nomes = lista.map((p) => `${p.nome} ${p.mapa === this.st.player.map ? "(AQUI)" : ""}`.trim());
      menuBox(ctx, 8, 30, 140, nomes.length ? nomes : ["NINGUÉM"], this.alvo);
      if (this.modo === "oque") {
        menuBox(ctx, 100, 78, 132, ["CHAMAR PRA TROCAR", "DESAFIAR", "VOLTAR"], this.index2);
      }
    } else if (this.modo === "frases") {
      menuBox(ctx, 8, 30, 150, DB.FRASES || [], this.index2);
    } else if (this.modo === "emotes") {
      menuBox(ctx, 8, 30, 90, DB.EMOTES || [], this.index2);
    } else if (this.modo === "sala") {
      menuBox(ctx, W - 150, 30, 146, this.itensSala(), this.index2);
    } else if (this.modo === "criar") {
      menuBox(ctx, 8, 30, 224, ["ABERTA (APARECE NA LISTA)", "PRIVADA (SÓ COM O CÓDIGO)", "VOLTAR"], this.index3);
    } else if (this.modo === "lista") {
      if (this.salas === null) {
        panel(ctx, 8, 30, W - 16, 24);
        drawText(ctx, txt("procurando"), 16, 38, PAL.ink2);
      } else {
        const nomes = this.salas.slice(0, 6)
          .map((s2) => `${String(s2.sala).toUpperCase()} (${s2.jogadores})`);
        menuBox(ctx, 8, 30, 160, nomes.length ? nomes : ["(NENHUMA)"], this.index3);
      }
    } else if (this.modo === "digitando") {
      caixaTexto(ctx, "CÓDIGO DA SALA (ENTER=OK, ESC=VOLTA):", Texto.buf(), 60);
    } else if (this.modo === "chat" && Texto.ativo()) {
      caixaTexto(ctx, "FALAR (ENTER=MANDA, ESC=VOLTA):", Texto.buf(), 60);
    } else {
      const itens = this.itens();
      menuBox(ctx, W - 130, 30, 126, itens, this.index);
    }
    this.dlg.render(ctx);
  }
}

// =====================================================================
// PRESENTE MISTERIOSO
// =====================================================================
export class GiftScene {
  constructor() { this.transparent = true; }

  enter() {
    this.dlg = new Dialogue();
    this.modo = "menu";
    this.index = 0;
    this.cartoes = null;
    this.erro = null;
  }

  get st() { return this.game.state; }

  /** ids já recebidos neste save */
  recebidos() {
    this.st.flags.presentes ||= {};
    return this.st.flags.presentes;
  }

  update(dt) {
    if (this.dlg.update(dt)) return;
    if (this.modo === "codigo") return this.updateCodigo();
    if (this.modo === "servidor") return this.updateServidor();
    if (this.modo === "mandar") return this.updateMandar();

    const itens = DB.GIFT_TEXTO.menu;
    if (Input.consume("up")) { this.index = (this.index + itens.length - 1) % itens.length; Audio2.blip(); }
    if (Input.consume("down")) { this.index = (this.index + 1) % itens.length; Audio2.blip(); }
    if (Input.consume("b")) { Audio2.cancel(); return void this.game.scenes.pop(); }
    if (!Input.consume("a")) return;
    Audio2.select();
    const pick = itens[this.index];
    // POR CÓDIGO é o único que funciona sem internet: as cartas moram no jogo
    if (pick === "POR CÓDIGO") { this.modo = "codigo"; Texto.comeca("", 24); return; }
    if (!Online.podeOnline()) return void this.dlg.say(Online.motivoSemSinal());
    if (pick === "PELO SERVIDOR") { this.modo = "servidor"; this.index2 = 0; this.buscaCartoes(); return; }
    if (pick === "MANDAR UM CARTÃO") { this.modo = "mandar"; this.index2 = 0; return; }
    this.game.scenes.pop();
  }

  updateCodigo() {
    const estado = Texto.estado();
    if (!estado) return;
    const digitado = Texto.termina();
    this.modo = "menu";
    if (digitado === null) return void Audio2.cancel();
    const codigo = String(digitado || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    const cartao = DB.GIFT_CODES?.[codigo];
    if (!cartao) return void this.dlg.say(gtxt("naoExiste"));
    this.entrega({ id: `codigo-${codigo}`, ...cartao });
  }

  async buscaCartoes() {
    try {
      const r = await fetch("/__gift", { cache: "no-store" });
      const dados = await r.json();
      this.cartoes = dados.cartoes || [];
    } catch {
      this.cartoes = [];
      this.erro = gtxt("semServidor");
    }
  }

  updateServidor() {
    if (this.cartoes === null) return;                 // ainda carregando
    if (!this.cartoes.length) {
      this.modo = "menu";
      return void this.dlg.say(this.erro || gtxt("nenhumNoServidor"));
    }
    const lista = this.cartoes;
    this.index2 = Math.min(this.index2, lista.length - 1);
    if (Input.consume("up")) { this.index2 = (this.index2 + lista.length - 1) % lista.length; Audio2.blip(); }
    if (Input.consume("down")) { this.index2 = (this.index2 + 1) % lista.length; Audio2.blip(); }
    if (Input.consume("b")) { this.modo = "menu"; return void Audio2.cancel(); }
    if (Input.consume("a")) { Audio2.select(); this.entrega(lista[this.index2]); this.modo = "menu"; }
  }

  /** MANDAR UM CARTÃO: escolhe um item da mochila e publica pra sala. */
  updateMandar() {
    const itens = Object.entries(this.st.items || {}).filter(([, q]) => q > 0);
    if (!itens.length) { this.modo = "menu"; return void this.dlg.say(gtxt("semItemPraMandar")); }
    this.index2 = Math.min(this.index2, itens.length - 1);
    if (Input.consume("up")) { this.index2 = (this.index2 + itens.length - 1) % itens.length; Audio2.blip(); }
    if (Input.consume("down")) { this.index2 = (this.index2 + 1) % itens.length; Audio2.blip(); }
    if (Input.consume("b")) { this.modo = "menu"; return void Audio2.cancel(); }
    if (!Input.consume("a")) return;
    Audio2.select();
    const [item] = itens[this.index2];
    this.modo = "menu";
    this.publica(item);
  }

  async publica(item) {
    const cartao = {
      titulo: `PRESENTE DE ${(this.st.player.name || "?").toUpperCase()}`,
      texto: "UM JOGADOR DESTA SALA DEIXOU ISTO PRA QUEM CHEGAR DEPOIS.",
      de: (this.st.player.name || "?").toUpperCase(),
      itens: [{ item, qtd: 1 }],
    };
    try {
      const r = await fetch("/__gift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sala: Net.sala, cartao }),
      });
      const dados = await r.json();
      if (!dados.ok) throw new Error(dados.erro);
      // o item sai da SUA mochila: presente é presente
      this.st.items[item] = Math.max(0, (this.st.items[item] || 0) - 1);
      if (!this.st.items[item]) delete this.st.items[item];
      this.game.save?.();          // presente é gravado na hora, sem trava de tempo
      this.dlg.say(gtxt("mandouCartao"));
    } catch {
      this.dlg.say(gtxt("mandarFalhou"));
    }
  }

  /** Entrega o conteúdo do cartão pro save — uma vez só. */
  entrega(cartao) {
    const id = cartao.id || cartao.titulo;
    const jaTem = this.recebidos();
    if (jaTem[id]) return void this.dlg.say(gtxt("repetido"));

    const falas = [`${cartao.titulo}`, cartao.texto || ""].filter(Boolean);
    let deuAlgo = false;

    for (const it of cartao.itens || []) {
      const qtd = Math.max(1, Math.min(99, it.qtd | 0 || 1));
      this.st.items[it.item] = Math.min(999, (this.st.items[it.item] || 0) + qtd);
      falas.push(gtxt("recebeuItem", { QTD: qtd, ITEM: String(it.item).toUpperCase() }));
      deuAlgo = true;
    }

    for (const m of cartao.mons || []) {
      if (!DB.SPECIES[m.id]) continue;
      const nv = Math.max(1, Math.min(100, m.nv | 0 || 5));
      const mon = createMon(m.id, nv, { shiny: !!m.shiny, nickname: m.apelido || undefined });
      if (this.st.party.length < 6) {
        this.st.party.push(mon);
        falas.push(gtxt("recebeuMon", { MON: mon.nickname }));
      } else if (!cheio(this.st)) {
        guardar(this.st, mon);
        falas.push(gtxt("foiProBox", { MON: mon.nickname }));
      } else {
        falas.push(gtxt("semVaga"));
        continue;
      }
      deuAlgo = true;
    }

    if (!deuAlgo) return void this.dlg.say(gtxt("naoExiste"));
    jaTem[id] = true;
    Audio2.heal();
    this.game.save?.();          // presente é gravado na hora, sem trava de tempo
    this.dlg.say(falas);
  }

  render(ctx) {
    panel(ctx, 4, 4, 130, 22);
    drawText(ctx, DB.GIFT_TEXTO.titulo, 12, 9, PAL.glitch);

    if (this.modo === "codigo") {
      caixaTexto(ctx, gtxt("pedeCodigo"), Texto.buf(), 60);
    } else if (this.modo === "servidor") {
      if (this.cartoes === null) {
        panel(ctx, 8, 40, W - 16, 26);
        drawText(ctx, "FALANDO COM O SERVIDOR...", 16, 48, PAL.ink2);
      } else if (this.cartoes.length) {
        // o servidor pode ter muitos cartões: mostro uma janela de 6 em volta
        // do cursor, senão a lista passa da tela
        const jaTem = this.recebidos();
        const total = this.cartoes.length;
        const topo = Math.max(0, Math.min(total - 6, this.index2 - 2));
        const janela = this.cartoes.slice(topo, topo + 6);
        const nomes = janela.map((c) => ((jaTem[c.id] ? "* " : "") + c.titulo).slice(0, 34));
        menuBox(ctx, 8, 30, W - 16, nomes, this.index2 - topo);
        const atual = this.cartoes[this.index2];
        const y = 30 + nomes.length * LINE_H + 12;
        panel(ctx, 8, y, W - 16, 22);
        drawText(ctx, `DE ${atual.de || "?"}   ${this.index2 + 1}/${total}`, 16, y + 6, PAL.ink2);
      }
    } else if (this.modo === "mandar") {
      const itens = Object.entries(this.st.items || {}).filter(([, q]) => q > 0)
        .map(([i, q]) => `${i.toUpperCase()} x${q}`);
      drawText(ctx, gtxt("mandarOque"), 10, 28, PAL.paper);
      menuBox(ctx, 8, 38, W - 16, itens.length ? itens : ["(NADA)"], this.index2);
    } else {
      menuBox(ctx, W - 130, 30, 126, DB.GIFT_TEXTO.menu, this.index);
    }
    this.dlg.render(ctx);
  }
}
