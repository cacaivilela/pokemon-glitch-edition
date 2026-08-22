// OFICINA DE GENOMA — o estúdio de sprite do jogador.
//
// Três abas (TAB, ou clique no nome):
//   DESENHO  uma tela de 64x64 — o MESMO tamanho que a batalha desenha, então
//            o que você pinta é pixel por pixel o que aparece no jogo. Tem
//            mouse, pincel, balde, conta-gotas e as
//            PEÇAS: os sprites dos dois Pokémon, pra encaixar cabeça, corpo e
//            metades onde quiser. Sete paletas de cores, e a primeira é feita
//            na hora com as cores dos dois.
//   FICHA    nome e os dois tipos.
//   STATS    quanto cada atributo VALE no nível 0 e quanto SOBE por nível — é
//            essa conta que a batalha usa (sem stats-base, sem IV).
//
// Nada é gravado enquanto você mexe: sair pergunta. Gravou, a espécie é
// remontada e quem já é daquela fusão muda na hora (salvarFicha, em
// src/systems/fusao.js).
import { DB } from "../data/index.js";
import { Assets, makeCanvas } from "../core/assets.js";
import { Audio2 } from "../core/audio.js";
import { Input, Texto, Mouse } from "../core/input.js";
import { Save } from "../core/save.js";
import { Glitch } from "../systems/glitchfx.js";
import { Dialogue } from "../systems/dialogue.js";
import { fichaParaEditar, salvarFicha, apagarFicha, temFicha, montarEspecie,
         fichaInvertida, copiarInvertida, publicarFicha, mandarProMundo } from "../systems/fusao.js";
import { panel, drawText, cursor, PAL } from "../core/gfx.js";

const W = 240, H = 160;
const ABAS = ["DESENHO", "FICHA", "STATS"];
const FERRAMENTAS = ["PINCEL", "BORRACHA", "BALDE", "PIPETA", "PEÇA"];
const PECA = 4;                    // índice da ferramenta de encaixar sprite
const STATS = [
  ["hp", "HP"], ["atk", "ATAQUE"], ["def", "DEFESA"],
  ["spa", "ESP.ATK"], ["spd", "ESP.DEF"], ["spe", "VELOC."],
];
// A janela do desenho. No zoom 0.5 os 256x256 aparecem INTEIROS aqui dentro;
// dando zoom ela vira uma lupa que anda junto com o cursor.
const VIS = { x: 4, y: 18, w: 128, h: 128 };
const COL = 136;                   // a coluna de ferramentas, à direita
const REPETE = 0.09;               // segurando a seta, um passo a cada tanto

/** retângulo clicável */
const dentro = (r, x, y) => x >= r.x && y >= r.y && x < r.x + r.w && y < r.y + r.h;

export class FusaoEditorScene {
  enter(args = {}) {
    const F = DB.STORY.fusao;
    this.cabeca = args.cabeca;
    this.corpo = args.corpo;
    this.dlg = new Dialogue();
    this.aba = 0;
    this.linha = 0;
    this.coluna = 0;
    this.t = 0;
    this.sujo = false;

    this.ficha = fichaParaEditar(this.cabeca, this.corpo);
    this.sp = montarEspecie(this.cabeca, this.corpo);
    if (!this.ficha || !this.sp) {
      this.erro = true;
      return void this.dlg.say(F.naoDaParaFundir, () => this.game.scenes.pop());
    }
    this.ficha.inicial ||= {};
    this.ficha.crescimento ||= {};
    DB.SPECIES[this.sp.id] = this.sp;

    const lado = DB.FUSAO.editor.tamanho;
    const { cv, ctx } = makeCanvas(lado, lado);
    this.cv = cv; this.ctx = ctx;
    this.ctx.imageSmoothingEnabled = false;
    this.semearDesenho();

    this.paletas = [{ nome: "DOS DOIS", cores: this.coresDosPais() }, ...DB.FUSAO.editor.paletas];
    this.paletaI = 0;
    this.cor = 0;
    this.ferramenta = 0;
    this.zoomI = DB.FUSAO.editor.zoomInicial ?? 0;
    this.pincelI = 1;
    this.cx = lado / 2;
    this.cy = lado / 2;
    this.repete = 0;
    this.pintando = false;
    this.undos = [];
    this.pecaI = 0;
    this.pecaEsc = 1;              // tamanho da peça, em fração do desenho
    this.pecaEspelha = false;
    Audio2.select();
  }

  exit() { Glitch.burst = 0; }

  // --------------------------------------------------------------- desenho
  semearDesenho() {
    const lado = this.cv.width;
    if (this.ficha.sprite) {
      const img = new Image();
      img.onload = () => {
        this.ctx.clearRect(0, 0, lado, lado);
        // ficha gravada quando a tela era 256: entra reduzida, uma vez só
        const encolhe = img.width > lado;
        this.ctx.imageSmoothingEnabled = encolhe;
        if (encolhe) this.ctx.imageSmoothingQuality = "high";
        this.ctx.drawImage(img, 0, 0, lado, lado);
        this.ctx.imageSmoothingEnabled = false;
      };
      img.onerror = () => this.semearAuto();
      img.src = this.ficha.sprite;
      return;
    }
    this.semearAuto();
  }

  semearAuto() {
    const lado = this.cv.width;
    this.ctx.clearRect(0, 0, lado, lado);
    const auto = Assets.mon(this.sp.id, 7);
    if (auto) this.ctx.drawImage(auto, 0, 0, lado, lado);
  }

  /** A paleta "DOS DOIS": as cores mais usadas nos sprites da cabeça e do
   *  corpo. É com elas que a fusão já está pintada — repintar à mão sem elas
   *  daria um bicho de duas paletas diferentes. */
  coresDosPais() {
    const { ctx } = makeCanvas(64, 32);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(Assets.mon(this.cabeca, 7), 0, 0, 32, 32);
    ctx.drawImage(Assets.mon(this.corpo, 7), 32, 0, 32, 32);
    const conta = new Map();
    try {
      const d = ctx.getImageData(0, 0, 64, 32).data;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] < 128) continue;
        const hex = "#" + [d[i], d[i + 1], d[i + 2]]
          .map((v) => (v & 0xf8).toString(16).padStart(2, "0")).join("");
        conta.set(hex, (conta.get(hex) || 0) + 1);
      }
    } catch { /* canvas sujo: cai na paleta fixa */ }
    const cores = [...conta.entries()].sort((a, b) => b[1] - a[1]).slice(0, 14).map(([c]) => c);
    while (cores.length < 14) cores.push("#5a6270");
    return ["#000000", ...cores, "#ffffff"];
  }

  get zoom() { return DB.FUSAO.editor.zooms[this.zoomI]; }
  get pincel() { return DB.FUSAO.editor.pinceis[this.pincelI]; }
  get paleta() { return this.paletas[this.paletaI].cores; }
  corAtual() { return this.paleta[this.cor] || "#000000"; }

  /** As peças que dá pra encaixar: os dois sprites inteiros e as duas metades
   *  que a máquina usaria sozinha. */
  pecas() {
    const cab = Assets.mon(this.cabeca, 7);
    const cor = Assets.mon(this.corpo, 7);
    const k = DB.FUSAO.corte ?? 0.46;
    return [
      { nome: "CABEÇA", img: cab, sy: 0, sh: 1 },
      { nome: "CORPO", img: cor, sy: 0, sh: 1 },
      { nome: "TOPO", img: cab, sy: 0, sh: k },
      { nome: "BASE", img: cor, sy: k, sh: 1 - k },
    ];
  }

  guardarUndo() {
    this.undos.push(this.ctx.getImageData(0, 0, this.cv.width, this.cv.height));
    if (this.undos.length > (DB.FUSAO.editor.undo || 12)) this.undos.shift();
  }

  desfazer() {
    const img = this.undos.pop();
    if (!img) return void Audio2.cancel();
    this.ctx.putImageData(img, 0, 0);
    this.sujo = true;
    Audio2.blip();
  }

  limparTudo() {
    const F = DB.STORY.fusao;
    this.dlg.ask(F.limparTudo, F.opcoesLimpar, (i) => {
      if (i !== 0) return;
      this.guardarUndo();
      this.ctx.clearRect(0, 0, this.cv.width, this.cv.height);
      this.sujo = true;
      Audio2.glitch();
      Glitch.hit(0.8);
      this.dlg.say(F.limpou);
    });
  }

  pintar(novoTraco) {
    const n = this.pincel;
    const x = Math.max(0, Math.min(this.cv.width - n, this.cx - (n >> 1)));
    const y = Math.max(0, Math.min(this.cv.height - n, this.cy - (n >> 1)));
    if (novoTraco) this.guardarUndo();
    if (this.ferramenta === 1) this.ctx.clearRect(x, y, n, n);
    else { this.ctx.fillStyle = this.corAtual(); this.ctx.fillRect(x, y, n, n); }
    this.sujo = true;
  }

  pipeta() {
    const d = this.ctx.getImageData(this.cx, this.cy, 1, 1).data;
    if (d[3] < 8) return void Audio2.cancel();
    this.paleta[this.cor] = "#" + [d[0], d[1], d[2]].map((v) => v.toString(16).padStart(2, "0")).join("");
    Audio2.blip();
  }

  balde() {
    const lado = this.cv.width;
    const img = this.ctx.getImageData(0, 0, lado, lado);
    const d = img.data;
    const i0 = (this.cy * lado + this.cx) * 4;
    const alvo = [d[i0], d[i0 + 1], d[i0 + 2], d[i0 + 3]];
    const hex = this.corAtual();
    const novo = this.ferramenta === 1 ? [0, 0, 0, 0] : [
      parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16), 255,
    ];
    const igual = (i, c) => Math.abs(d[i] - c[0]) < 10 && Math.abs(d[i + 1] - c[1]) < 10
      && Math.abs(d[i + 2] - c[2]) < 10 && Math.abs(d[i + 3] - c[3]) < 10;
    if (igual(i0, novo)) return void Audio2.cancel();
    this.guardarUndo();
    const pilha = [this.cy * lado + this.cx];
    while (pilha.length) {
      const p = pilha.pop();
      const i = p * 4;
      if (!igual(i, alvo)) continue;
      d[i] = novo[0]; d[i + 1] = novo[1]; d[i + 2] = novo[2]; d[i + 3] = novo[3];
      const x = p % lado, y = (p / lado) | 0;
      if (x > 0) pilha.push(p - 1);
      if (x < lado - 1) pilha.push(p + 1);
      if (y > 0) pilha.push(p - lado);
      if (y < lado - 1) pilha.push(p + lado);
    }
    this.ctx.putImageData(img, 0, 0);
    this.sujo = true;
    Audio2.heal();
  }

  /** onde a peça cai, no tamanho e no lugar em que ela está sendo mostrada */
  areaPeca() {
    const lado = this.cv.width;
    const p = this.pecas()[this.pecaI];
    const w = Math.round(lado * this.pecaEsc);
    const h = Math.round(w * (p.sh || 1));
    return { x: Math.round(this.cx - w / 2), y: Math.round(this.cy - h / 2), w, h, p };
  }

  /** encaixa a peça no desenho */
  colarPeca() {
    const { x, y, w, h, p } = this.areaPeca();
    if (!p.img) return void Audio2.cancel();
    this.guardarUndo();
    const c = this.ctx;
    c.save();
    if (this.pecaEspelha) { c.translate(x + w, y); c.scale(-1, 1); c.translate(-x, -y); }
    c.drawImage(p.img, 0, Math.round(p.img.height * p.sy), p.img.width, Math.round(p.img.height * p.sh),
                x, y, w, h);
    c.restore();
    this.sujo = true;
    Audio2.heal();
    Glitch.hit(0.4);
  }

  // ------------------------------------------------------------------ saída
  sair() {
    const F = DB.STORY.fusao;
    if (!this.sujo) return void this.game.scenes.pop();
    this.dlg.ask(F.gravarAoSair, F.opcoesSaida, (i) => {
      if (i === 0) this.gravar(true);
      else if (i === 1) this.game.scenes.pop();
    });
  }

  gravar(saindo = false) {
    const F = DB.STORY.fusao;
    this.ficha.sprite = this.cv.toDataURL("image/png");
    const sp = salvarFicha(this.game.state, this.cabeca, this.corpo, this.ficha);
    this.sujo = false;
    Audio2.heal();
    Glitch.hit(1.1);
    this.game.autosave?.(true);
    this.dlg.say(F.gravou.replace("{NOME}", sp?.name || this.ficha.nome), () => {
      if (saindo) this.game.scenes.pop();
    });
  }

  apagar() {
    const F = DB.STORY.fusao;
    this.dlg.ask(F.apagarFicha, F.opcoesApagar, (i) => {
      if (i !== 0) return;
      apagarFicha(this.game.state, this.cabeca, this.corpo);
      this.game.autosave?.(true);
      Audio2.cancel();
      this.dlg.say(F.apagou, () => this.game.scenes.pop());
    });
  }

  // ----------------------------------------------------------------- update
  update(dt) {
    this.t += dt;
    const ocupado = this.dlg.update(dt);
    if (this.erro || ocupado) return;
    if (Texto.ativo()) return this.digitando();

    if (Input.consomeTecla("Tab")) return this.trocaAba(1);
    if (this.aba === 0) return this.updateDesenho(dt);
    if (this.aba === 1) return this.updateFicha();
    return this.updateStats();
  }

  trocaAba(d) {
    this.aba = (this.aba + d + ABAS.length) % ABAS.length;
    this.linha = 0;
    Audio2.select();
  }

  digitando() {
    if (!Texto.estado()) return;
    const txt = Texto.termina();
    if (txt !== null) {
      this.ficha.nome = txt.trim().slice(0, DB.FUSAO.nomeMax) || this.ficha.nome;
      this.sujo = true;
      Audio2.select();
    }
  }

  // as caixas clicáveis da coluna da direita (e as abas lá em cima)
  areas() {
    return {
      abas: ABAS.map((a, i) => ({ x: 60 + i * 60, y: 2, w: a.length * 6 + 4, h: 12, i })),
      ferramentas: FERRAMENTAS.map((f, i) => ({ x: COL + i * 20, y: VIS.y, w: 19, h: 16, i })),
      cores: this.paleta.map((c, i) => ({ x: COL + (i % 8) * 12, y: VIS.y + 20 + Math.floor(i / 8) * 11, w: 12, h: 11, i })),
      antes: { x: COL, y: VIS.y + 44, w: 10, h: 10 },
      depois: { x: COL + 88, y: VIS.y + 44, w: 10, h: 10 },
      pecas: this.pecas().map((p, i) => ({ x: COL + i * 25, y: VIS.y + 58, w: 24, h: 24, i })),
      tela: { x: VIS.x, y: VIS.y, w: VIS.w, h: VIS.h },
    };
  }

  /** o pixel do desenho que está debaixo do ponto (x,y) da tela */
  pixelEm(x, y) {
    const z = this.zoom, lado = this.cv.width;
    const visW = Math.min(lado, Math.ceil(VIS.w / z));
    const visH = Math.min(lado, Math.ceil(VIS.h / z));
    const ox = Math.max(0, Math.min(lado - visW, this.cx - Math.floor(visW / 2)));
    const oy = Math.max(0, Math.min(lado - visH, this.cy - Math.floor(visH / 2)));
    const cx0 = VIS.x + Math.floor((VIS.w - Math.round(visW * z)) / 2);
    const cy0 = VIS.y + Math.floor((VIS.h - Math.round(visH * z)) / 2);
    return {
      x: Math.max(0, Math.min(lado - 1, ox + Math.floor((x - cx0) / z))),
      y: Math.max(0, Math.min(lado - 1, oy + Math.floor((y - cy0) / z))),
      ox, oy, cx0, cy0, visW, visH,
    };
  }

  updateDesenho(dt) {
    const lado = this.cv.width;
    const A = this.areas();

    // ------------------------------------------------------------- mouse
    if (Mouse.dentro) {
      if (dentro(A.tela, Mouse.x, Mouse.y)) {
        const p = this.pixelEm(Mouse.x, Mouse.y);
        this.cx = p.x; this.cy = p.y;
        if (Mouse.clicou) this.acao(true);
        else if (Mouse.botao && this.ferramenta <= 1) this.pintar(false);
        if (Mouse.roda) this.roda(-Mouse.roda);
      } else if (Mouse.clicou) {
        for (const b of A.ferramentas) if (dentro(b, Mouse.x, Mouse.y)) { this.ferramenta = b.i; Audio2.blip(); }
        for (const b of A.cores) if (dentro(b, Mouse.x, Mouse.y)) {
          this.cor = b.i;
          if (this.ferramenta === 1) this.ferramenta = 0;
          Audio2.blip();
        }
        for (const b of A.pecas) if (dentro(b, Mouse.x, Mouse.y)) { this.pecaI = b.i; this.ferramenta = PECA; Audio2.blip(); }
        for (const b of A.abas) if (dentro(b, Mouse.x, Mouse.y)) { this.aba = b.i; this.linha = 0; Audio2.select(); }
        if (dentro(A.antes, Mouse.x, Mouse.y)) this.trocaPaleta(-1);
        if (dentro(A.depois, Mouse.x, Mouse.y)) this.trocaPaleta(1);
      }
    }
    if (!Mouse.botao && !Input.held("a")) this.pintando = false;

    // ----------------------------------------------------------- teclado
    const passo = Input.held("run") ? 8 : 1;
    const dir = Input.dir();
    this.repete -= dt;
    if (dir && (this.repete <= 0 || Input.pressed(dir))) {
      this.repete = REPETE;
      const dx = dir === "left" ? -1 : dir === "right" ? 1 : 0;
      const dy = dir === "up" ? -1 : dir === "down" ? 1 : 0;
      this.cx = Math.max(0, Math.min(lado - 1, this.cx + dx * passo));
      this.cy = Math.max(0, Math.min(lado - 1, this.cy + dy * passo));
      if (this.pintando && this.ferramenta <= 1) this.pintar(false);
    }
    if (Input.pressed("a")) this.acao(true);
    if (Input.consume("select")) { this.ferramenta = (this.ferramenta + 1) % FERRAMENTAS.length; Audio2.blip(); }
    if (Input.consomeTecla("KeyQ")) this.roda(-1);
    if (Input.consomeTecla("KeyE")) this.roda(1);
    if (Input.consomeTecla("KeyR")) { this.pincelI = (this.pincelI + 1) % DB.FUSAO.editor.pinceis.length; Audio2.blip(); }
    if (Input.consomeTecla("KeyP")) this.trocaPaleta(1);
    if (Input.consomeTecla("KeyH")) { this.pecaEspelha = !this.pecaEspelha; Audio2.blip(); }
    if (Input.consomeTecla("KeyU")) this.desfazer();
    if (Input.consomeTecla("KeyD")) { Input.consume("right"); return void this.limparTudo(); }
    for (let i = 0; i < 8; i++) {
      if (Input.consomeTecla(`Digit${i + 1}`)) {
        this.cor = (this.cor >= 8 ? 8 : 0) + i;
        if (this.ferramenta === 1) this.ferramenta = 0;
        Audio2.blip();
      }
    }
    if (Input.consomeTecla("Digit9")) { this.cor = this.cor >= 8 ? this.cor - 8 : this.cor + 8; Audio2.blip(); }
    if (Input.consume("b")) this.sair();
  }

  /** Z ou clique dentro da tela: o que a ferramenta faz */
  acao() {
    if (this.ferramenta === 2) return this.balde();
    if (this.ferramenta === 3) return this.pipeta();
    if (this.ferramenta === PECA) return this.colarPeca();
    this.pintando = true;
    this.pintar(true);
  }

  /** a rodinha (e Q/E): zoom no desenho, tamanho na peça */
  roda(d) {
    if (this.ferramenta === PECA) {
      this.pecaEsc = Math.max(0.1, Math.min(2, Math.round((this.pecaEsc + d * 0.1) * 10) / 10));
    } else {
      this.zoomI = Math.max(0, Math.min(DB.FUSAO.editor.zooms.length - 1, this.zoomI + d));
    }
    Audio2.blip();
  }

  trocaPaleta(d) {
    this.paletaI = (this.paletaI + d + this.paletas.length) % this.paletas.length;
    this.cor = Math.min(this.cor, this.paleta.length - 1);
    Audio2.blip();
  }

  /** Traz a ficha que você fez com os lados trocados (o desenho vem junto). */
  puxarInvertida() {
    const F = DB.STORY.fusao;
    const outra = fichaInvertida(this.cabeca, this.corpo);
    if (!outra) return void Audio2.cancel();
    copiarInvertida(this.game.state, this.cabeca, this.corpo);
    this.ficha = fichaParaEditar(this.cabeca, this.corpo);
    this.ficha.inicial ||= {};
    this.ficha.crescimento ||= {};
    this.semearDesenho();
    this.sujo = false;
    this.game.autosave?.(true);
    Audio2.heal();
    Glitch.hit(0.8);
    this.dlg.say(F.copiou.replace("{NOME}", outra.nome || "?"));
  }

  /** As linhas da aba FICHA. As duas últimas só aparecem quando fazem sentido:
   *  publicar depois de gravar, copiar quando existe a ficha do outro lado. */
  linhasFicha() {
    const F = DB.STORY.fusao;
    const gravada = temFicha(this.cabeca, this.corpo);
    const linhas = [
      { id: "nome", rot: "NOME", val: this.ficha.nome || "—" },
      { id: "tipo1", rot: "TIPO 1", val: this.ficha.tipos?.[0] || "—" },
      { id: "tipo2", rot: "TIPO 2", val: this.ficha.tipos?.[1] || "—" },
      { id: "gravar", rot: "GRAVAR FICHA", val: gravada ? "(C APAGA)" : "", fraco: true },
    ];
    if (gravada) linhas.push({ id: "publicar", rot: F.publicar, val: "", fraco: true });
    const outra = fichaInvertida(this.cabeca, this.corpo);
    if (outra) linhas.push({ id: "inverter", rot: F.copiarInvertida, val: outra.nome || "" });
    return linhas;
  }

  /** PUBLICAR: a ficha vira código (src/data/fusoes-feitas.js), pelo servidor. */
  async publicar() {
    const F = DB.STORY.fusao;
    if (Save.offline()) return void this.dlg.say(F.semServidor);
    if (!temFicha(this.cabeca, this.corpo)) return void this.dlg.say(F.precisaGravar);
    const nome = this.ficha.nome || "?";
    this.dlg.ask(F.confirmaPublicar.replace("{NOME}", nome), F.opcoesPublicar, async (i) => {
      if (i !== 0) return;
      const r = await publicarFicha(this.cabeca, this.corpo, this.ficha,
                                    this.game.state.player?.name || "");
      Audio2[r.ok ? "heal" : "cancel"]();
      if (!r.ok) return void this.dlg.say(F.falhouPublicar);
      Glitch.hit(1.4);
      this.dlg.say([
        F.publicou.replace("{NOME}", nome),
        F.publicouRede.replace("{N}", r.aparelhos).replace("{S}", r.aparelhos === 1 ? "" : "S"),
      ], () => this.oferecerMundo(nome));
    });
  }

  /** O passo seguinte do publicar: mandar a ficha pro repositório do jogo — o
   *  "mundo" daqui. Quem baixar ou atualizar o jogo recebe ela junto. Não deu
   *  (sem permissão de escrita lá, sem internet), a ficha continua valendo
   *  nesta casa: o publicar já aconteceu. */
  oferecerMundo(nome) {
    const F = DB.STORY.fusao;
    this.dlg.ask(F.perguntaMundo.replace("{NOME}", nome), F.opcoesMundo, async (i) => {
      if (i !== 0) return;
      this.dlg.say(F.mundoBuscando);
      const r = await mandarProMundo(nome, this.game.state.player?.name || "");
      Audio2[r.ok ? "heal" : "cancel"]();
      if (r.ok) Glitch.hit(2);
      this.dlg.say(r.ok ? F.mundoEnviou.replace("{NOME}", nome)
                        : F.mundoRecusou.replace("{ERRO}", r.erro || "?"));
    });
  }

  updateFicha() {
    const linhas = this.linhasFicha().length;
    const A = this.areas();
    if (Mouse.dentro && Mouse.clicou) {
      for (const b of A.abas) if (dentro(b, Mouse.x, Mouse.y)) { this.aba = b.i; this.linha = 0; Audio2.select(); return; }
      for (let i = 0; i < linhas; i++) {
        if (Mouse.y >= 20 + i * 17 && Mouse.y < 37 + i * 17) { this.linha = i; Audio2.blip(); }
      }
    }
    if (Input.consume("up")) { this.linha = (this.linha + linhas - 1) % linhas; Audio2.blip(); }
    if (Input.consume("down")) { this.linha = (this.linha + 1) % linhas; Audio2.blip(); }
    const tipos = ["—", ...DB.TYPES];
    const mexeTipo = (slot, d) => {
      const lista = [...(this.ficha.tipos || [])];
      const i = Math.max(0, tipos.indexOf(lista[slot] || "—"));
      lista[slot] = tipos[(i + d + tipos.length) % tipos.length];
      this.ficha.tipos = lista.filter((t) => t && t !== "—");
      this.sujo = true;
      Audio2.blip();
    };
    const alvoAgora = this.linhasFicha()[this.linha]?.id;
    if (alvoAgora === "tipo1" || alvoAgora === "tipo2") {
      const slot = alvoAgora === "tipo1" ? 0 : 1;
      if (Input.consume("left")) mexeTipo(slot, -1);
      if (Input.consume("right")) mexeTipo(slot, 1);
    }
    if (Input.consume("a")) {
      const alvo = this.linhasFicha()[this.linha]?.id;
      if (alvo === "nome") { Texto.comeca(this.ficha.nome || "", DB.FUSAO.nomeMax); Audio2.select(); }
      else if (alvo === "gravar") this.gravar(false);
      else if (alvo === "publicar") this.publicar();
      else if (alvo === "inverter") this.puxarInvertida();
    }
    if (Input.consume("select") && temFicha(this.cabeca, this.corpo)) this.apagar();
    if (Input.consume("b")) this.sair();
  }

  updateStats() {
    const n = STATS.length;
    const A = this.areas();
    if (Mouse.dentro && Mouse.clicou) {
      for (const b of A.abas) if (dentro(b, Mouse.x, Mouse.y)) { this.aba = b.i; this.linha = 0; Audio2.select(); return; }
      for (let i = 0; i < n; i++) if (Mouse.y >= 32 + i * 15 && Mouse.y < 47 + i * 15) { this.linha = i; Audio2.blip(); }
      if (Mouse.x >= 70 && Mouse.x < 100) this.coluna = 1;
      else if (Mouse.x >= 100 && Mouse.x < 136) this.coluna = 0;
    }
    if (Input.consume("up")) { this.linha = (this.linha + n - 1) % n; Audio2.blip(); }
    if (Input.consume("down")) { this.linha = (this.linha + 1) % n; Audio2.blip(); }
    const k = STATS[this.linha][0];
    const grosso = Input.held("run");
    const mexe = (d) => {
      if (this.coluna) {
        const v = (this.ficha.inicial[k] ?? (k === "hp" ? 10 : 5)) + d * (grosso ? 10 : 1);
        this.ficha.inicial[k] = Math.max(0, Math.min(200, Math.round(v)));
      } else {
        const v = (this.ficha.crescimento[k] ?? 1) + d * (grosso ? 1 : 0.1);
        this.ficha.crescimento[k] = Math.max(0, Math.min(9, Math.round(v * 10) / 10));
      }
      this.sujo = true;
      Audio2.blip();
    };
    if (Input.consume("left")) mexe(-1);
    if (Input.consume("right")) mexe(1);
    if (Mouse.roda) mexe(-Math.sign(Mouse.roda));
    if (Input.consume("a")) { this.coluna = this.coluna ? 0 : 1; Audio2.select(); }
    if (Input.consume("select")) this.gravar(false);
    if (Input.consume("b")) this.sair();
  }

  // ----------------------------------------------------------------- render
  render(ctx) {
    ctx.fillStyle = "#12121c";
    ctx.fillRect(0, 0, W, H);
    drawText(ctx, "OFICINA", 6, 4, PAL.glitch);
    ABAS.forEach((a, i) => {
      const x = 62 + i * 60;
      drawText(ctx, a, x, 4, i === this.aba ? "#00ffcc" : PAL.ink2);
      if (i === this.aba) { ctx.fillStyle = "#00ffcc"; ctx.fillRect(x, 12, a.length * 6, 1); }
    });
    if (this.erro) return void this.dlg.render(ctx);

    if (this.aba === 0) this.renderDesenho(ctx);
    else if (this.aba === 1) this.renderFicha(ctx);
    else this.renderStats(ctx);

    this.dlg.render(ctx);
  }

  renderDesenho(ctx) {
    const z = this.zoom;
    const lado = this.cv.width;
    const g = this.pixelEm(VIS.x, VIS.y);          // só pra pegar a janela atual
    const larg = Math.round(g.visW * z), alt = Math.round(g.visH * z);
    const cx0 = g.cx0, cy0 = g.cy0;

    // xadrez: é assim que se enxerga o que é transparente
    for (let y = 0; y < VIS.h; y += 8) {
      for (let x = 0; x < VIS.w; x += 8) {
        ctx.fillStyle = ((x + y) / 8) % 2 ? "#1c1c28" : "#242432";
        ctx.fillRect(VIS.x + x, VIS.y + y, 8, 8);
      }
    }
    ctx.drawImage(this.cv, g.ox, g.oy, g.visW, g.visH, cx0, cy0, larg, alt);
    ctx.strokeStyle = "#4c5468";
    ctx.strokeRect(cx0 - 0.5, cy0 - 0.5, larg + 1, alt + 1);

    if (this.ferramenta === PECA) {
      // a peça em cima do desenho, transparente, esperando o clique
      const a = this.areaPeca();
      const p = a.p;
      if (p.img) {
        ctx.save();
        ctx.globalAlpha = 0.55;
        const dx = cx0 + (a.x - g.ox) * z, dy = cy0 + (a.y - g.oy) * z;
        if (this.pecaEspelha) { ctx.translate(dx + a.w * z, dy); ctx.scale(-1, 1); ctx.translate(-dx, -dy); }
        ctx.drawImage(p.img, 0, Math.round(p.img.height * p.sy), p.img.width, Math.round(p.img.height * p.sh),
                      dx, dy, a.w * z, a.h * z);
        ctx.restore();
        ctx.strokeStyle = "#00ffcc";
        ctx.strokeRect(Math.round(dx) + 0.5, Math.round(dy) + 0.5, Math.round(a.w * z) - 1, Math.round(a.h * z) - 1);
      }
    } else {
      const n = this.pincel;
      const px = cx0 + (this.cx - (n >> 1) - g.ox) * z;
      const py = cy0 + (this.cy - (n >> 1) - g.oy) * z;
      ctx.strokeStyle = (this.t * 6) % 2 > 1 ? "#ffffff" : "#ff0066";
      ctx.strokeRect(Math.round(px) + 0.5, Math.round(py) + 0.5, Math.max(2, n * z) - 1, Math.max(2, n * z) - 1);
    }

    const A = this.areas();
    // ferramentas
    A.ferramentas.forEach((b) => {
      const on = b.i === this.ferramenta;
      ctx.fillStyle = on ? "#00ffcc" : "#2a2a3a";
      ctx.fillRect(b.x, b.y, b.w, b.h);
      drawText(ctx, FERRAMENTAS[b.i].slice(0, 3), b.x + 1, b.y + 5, on ? "#12121c" : PAL.ink2);
    });
    // paleta
    A.cores.forEach((b) => {
      ctx.fillStyle = "#12121c";
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.fillStyle = this.paleta[b.i] || "#000";
      ctx.fillRect(b.x + 1, b.y + 1, b.w - 2, b.h - 2);
      if (b.i === this.cor) { ctx.strokeStyle = "#ffffff"; ctx.strokeRect(b.x + 0.5, b.y + 0.5, b.w - 1, b.h - 1); }
    });
    drawText(ctx, "<", A.antes.x + 2, A.antes.y + 2, PAL.paper);
    drawText(ctx, this.paletas[this.paletaI].nome.slice(0, 12), COL + 12, A.antes.y + 2, PAL.ink2);
    drawText(ctx, ">", A.depois.x + 2, A.depois.y + 2, PAL.paper);
    // peças
    A.pecas.forEach((b) => {
      const p = this.pecas()[b.i];
      ctx.fillStyle = b.i === this.pecaI && this.ferramenta === PECA ? "#0a3a34" : "#0a0614";
      ctx.fillRect(b.x, b.y, b.w, b.h);
      if (p.img) {
        ctx.drawImage(p.img, 0, Math.round(p.img.height * p.sy), p.img.width, Math.round(p.img.height * p.sh),
                      b.x + 1, b.y + 1, b.w - 2, Math.max(2, Math.round((b.h - 2) * p.sh)));
      }
      if (b.i === this.pecaI) { ctx.strokeStyle = "#00ffcc"; ctx.strokeRect(b.x + 0.5, b.y + 0.5, b.w - 1, b.h - 1); }
    });
    // números e o resultado
    const info = this.ferramenta === PECA
      ? `${this.pecas()[this.pecaI].nome} ${Math.round(this.pecaEsc * 100)}%${this.pecaEspelha ? " <>" : ""}`
      : `${FERRAMENTAS[this.ferramenta]} ${this.pincel}  ${this.zoom}x`;
    drawText(ctx, info.slice(0, 16), COL, VIS.y + 86, "#00ffcc");
    drawText(ctx, `${this.cx},${this.cy}`, COL, VIS.y + 96, PAL.ink2);
    ctx.fillStyle = "#0a0614";
    ctx.fillRect(COL, VIS.y + 106, 42, 42);
    ctx.drawImage(this.cv, COL + 1, VIS.y + 107, 40, 40);
    drawText(ctx, "PRÉVIA", COL + 46, VIS.y + 112, PAL.ink2);
    drawText(ctx, `${lado}x${lado}`, COL + 46, VIS.y + 122, PAL.ink2);
    this.dica(ctx, DB.STORY.fusao.ajudaDesenho);
  }

  /** A linha de ajuda. Quando é uma lista, as linhas se revezam sozinhas —
   *  não cabe tudo de uma vez numa tela de 240 pixels. */
  dica(ctx, texto) {
    const linhas = [].concat(texto || []);
    const i = Math.floor(this.t / 3) % linhas.length;
    drawText(ctx, linhas[i], 4, H - 8, PAL.ink2);
  }

  renderFicha(ctx) {
    const F = DB.STORY.fusao;
    panel(ctx, 4, 16, W - 8, 118);
    const linhas = this.linhasFicha();
    linhas.forEach((l, i) => {
      const y = 22 + i * 17;
      if (i === this.linha) cursor(ctx, 10, y);
      drawText(ctx, String(l.rot).slice(0, 18), 22, y, PAL.ink);
      drawText(ctx, String(l.val).slice(0, 10), 130, y, l.fraco ? PAL.ink2 : PAL.glitch);
    });
    ctx.drawImage(this.cv, 190, 26, 40, 40);
    drawText(ctx, this.sp.codigo || "", 186, 70, PAL.ink2);
    if (Texto.ativo()) {
      panel(ctx, 30, 60, 180, 30);
      drawText(ctx, (Texto.buf() + ((this.t * 3) % 1 > 0.5 ? "_" : "")).slice(0, 22), 40, 70, PAL.ink);
      drawText(ctx, F.ajudaTeclado, 40, 80, PAL.ink2);
    }
    this.dica(ctx, F.ajudaFicha);
  }

  renderStats(ctx) {
    const F = DB.STORY.fusao;
    panel(ctx, 4, 16, W - 8, 118);
    drawText(ctx, "ATRIBUTO   NV0  /NÍVEL   N5  N50 N100", 10, 22, PAL.ink2);
    STATS.forEach(([k, rot], i) => {
      const y = 34 + i * 15;
      if (i === this.linha) cursor(ctx, 8, y);
      drawText(ctx, rot, 18, y, PAL.ink);
      const ini = this.ficha.inicial[k] ?? (k === "hp" ? 10 : 5);
      const cre = this.ficha.crescimento[k] ?? 1;
      drawText(ctx, String(ini).padStart(3, " "), 76, y, i === this.linha && this.coluna ? "#00ffcc" : PAL.ink);
      drawText(ctx, cre.toFixed(1).padStart(4, " "), 104, y, i === this.linha && !this.coluna ? "#00ffcc" : PAL.ink);
      [5, 50, 100].forEach((nv, j) => {
        drawText(ctx, String(DB.FUSAO.valor(this.ficha, k, nv)).padStart(3, " "), 142 + j * 26, y, PAL.ink2);
      });
    });
    this.dica(ctx, F.ajudaStats);
  }
}
