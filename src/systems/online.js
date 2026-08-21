// A parte viva do online: quem está na sala, onde cada um está andando, os
// convites, o chat e os dois protocolos (troca e batalha link).
//
// O transporte é o src/core/net.js; os números e as frases são src/data/online.js
// (com hot-swap). Aqui fica a única coisa que não dá pra mudar sem pensar: o
// COMBINADO entre os dois lados.
//
// Regra que vale pra tudo: NADA que chega da rede é confiável. Todo Pokémon que
// vem de fora passa por `sanea` antes de encostar no save — espécie que existe,
// nível de 1 a 100, HP que cabe, golpes que existem. Um cliente adulterado
// consegue mandar lixo; o que ele não consegue é gravar lixo no seu arquivo.
import { DB } from "../data/index.js";
import { Net } from "../core/net.js";
import { createMon, recalc } from "./mon.js";

const cfg = () => DB.ONLINE || {};
const txt = (k, vars = {}) =>
  String(DB.ONLINE_TEXTO?.[k] || k).replace(/\{(\w+)\}/g, (m, n) => vars[n] ?? m);

/** o que o jogador está fazendo agora: um convite por vez */
const LIVRE = "livre";

export const Online = {
  pronto: false,
  game: null,
  peers: new Map(),        // id -> jogador com posição já suavizada pra desenhar
  ocupacao: LIVRE,         // livre | troca | batalha
  convitePendente: null,   // convite que CHEGOU e ainda não foi respondido
  conviteEnviado: null,    // convite que EU mandei e ainda não voltou
  aviso: null,             // frase curta pro canto da tela
  avisoT: 0,

  _ouvintes: new Map(),
  _tPos: 0,
  _ultimaPos: "",
  _semSinalT: 0,
  _tinhaSinal: true,

  // -------------------------------------------------------------- ligação
  init(game) {
    this.game = game;
    if (this.pronto) return;
    this.pronto = true;

    Net.on("*", (msg) => this._doJogo(msg));
    Net.on("entrou", (m) => this._avisaTela(txt("entrou", { NOME: m.jogador?.nome || "?" })));
    Net.on("saiu", (m) => {
      const p = this.peers.get(m.id);
      this.peers.delete(m.id);
      if (p) this._avisaTela(txt("saiu", { NOME: p.nome }));
      this._perdeuOParceiro(m.id);
    });
    Net.on("caiu", () => this._avisaTela(txt("caiu")));
    Net.on("sala", () => {
      this._avisaTela(txt("voltou", { SALA: Net.sala.toUpperCase() }));
      this._sincronizaPeers();
    });

    if (cfg().ativo) this.conectar();
    addEventListener("pagehide", () => Net.avisaSaida());
  },

  conectar(sala, privada = false) {
    // Não pergunto ao navegador se "tem internet": o servidor pode ser esta
    // máquina, ou a do lado num cabo. `navigator.onLine` fala do mundo lá fora,
    // que não tem nada a ver com quem está do outro lado da sala.
    const nome = (this.game?.state?.player?.name || "?").slice(0, 12);
    return Net.conectar(sala || Net.sala || cfg().salaPadrao || "kanto", nome, privada);
  },

  /** Cria uma sala com um código curto e entra nela. */
  criarSala(privada = false) {
    const alfabeto = cfg().alfabetoSala || "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const n = cfg().tamanhoCodigo || 5;
    let codigo = "";
    for (let i = 0; i < n; i++) codigo += alfabeto[Math.floor(Math.random() * alfabeto.length)];
    return this.conectar(codigo.toLowerCase(), privada) ? codigo : null;
  },

  // ------------------------------------------------------------------ sinal
  // Quantas barras AGORA: é o tempo de ida e volta até o servidor, e mais nada.
  // Isto NÃO é uma porteira — o online aqui não depende de internet, depende do
  // servidor, que pode ser esta máquina. Ver `podeOnline`.

  /** O servidor está respondendo? É a única coisa que importa — e é medida
   *  pelo ping, não pelo que o navegador acha da internet. */
  temRede() {
    if (!this.naSala()) return true;                // ainda não perguntei a ninguém
    return Net.estado === "on" && Net.falhas < (cfg().sinal?.quedasPraCair || 3);
  },

  /** teto de barras pelo tipo de rede que o navegador declara */
  _teto() {
    try {
      const tipo = navigator.connection?.effectiveType;
      if (tipo === "slow-2g") return 1;
      if (tipo === "2g") return 2;
      if (tipo === "3g") return 3;
    } catch { /* navegador sem Network Information: sem teto */ }
    return 4;
  },

  barras() {
    const s = cfg().sinal || {};
    const escala = s.escala || [140, 320, 700, 1500];
    if (!Net.sala || Net.estado === "off") return this._teto();   // ainda não entrei
    if (Net.estado !== "on") return 0;                            // caiu/religando
    if (Net.falhas >= (s.quedasPraCair || 3)) return 0;
    if (Net.rtt == null) return Math.min(this._teto(), escala.length);
    // Já medi: o que vale é o tempo do servidor, não o palpite do navegador
    // sobre a rede. Num cabo entre duas máquinas ele erraria pra baixo.
    let b = 0;
    for (let i = 0; i < escala.length; i++) {
      if (Net.rtt <= escala[i]) { b = escala.length - i; break; }
    }
    return b;
  },

  minimoBarras() { return cfg().sinal?.minimoBarras ?? 0; },

  /** Dá pra usar o online agora?
   *
   *  Com `minimoBarras: 0` (o padrão) a resposta é SEMPRE SIM — nem o ping nem
   *  o navegador podem impedir nada. As barras continuam sendo desenhadas, mas
   *  como informação: elas dizem se está rápido, não se está permitido. Quem
   *  quiser a porteira de volta põe 1 em src/data/online.js. */
  podeOnline() {
    const min = this.minimoBarras();
    return min <= 0 || this.barras() >= min;
  },

  /** a frase pra mostrar quando a porteira está ligada e barra o acesso */
  motivoSemSinal() {
    return this.temRede()
      ? txt("semSinal", { MIN: this.minimoBarras() })
      : txt("semRede");
  },

  sair() {
    Net.desconectar();
    this.peers.clear();
    this.ocupacao = LIVRE;
    this.convitePendente = this.conviteEnviado = null;
  },

  ligado: () => Net.ligado(),
  sala: () => Net.sala,
  /** estou numa sala (ainda que a conexão esteja caindo e voltando)? */
  naSala: () => !!Net.sala && Net.estado !== "off",
  euId: () => Net.id,

  /** on("convite" | "chat" | "cartao" | "troca" | "batalha", cb) */
  on(tipo, cb) {
    if (!this._ouvintes.has(tipo)) this._ouvintes.set(tipo, new Set());
    this._ouvintes.get(tipo).add(cb);
    return () => this._ouvintes.get(tipo)?.delete(cb);
  },
  _emite(tipo, dados) {
    for (const cb of this._ouvintes.get(tipo) || []) {
      try { cb(dados); } catch (e) { console.error("[online]", tipo, e); }
    }
  },

  /** Aviso no canto da tela.
   *
   *  `sistema` marca o que é recado do JOGO — quem entrou, quem saiu, a
   *  conexão. Esses ficam invisíveis por padrão (`avisosDoSistema` em
   *  src/data/online.js): a sala tem que parecer o mapa de sempre, não um
   *  chat de servidor. O que vem de GENTE — a resposta de quem você chamou, o
   *  balão de fala — aparece sempre. */
  _avisaTela(frase, sistema = true) {
    if (sistema && !cfg().avisosDoSistema) return;
    this.aviso = frase;
    this.avisoT = 3.2;
  },

  // --------------------------------------------------------------- presença
  _sincronizaPeers() {
    for (const [id, j] of Net.jogadores) {
      if (id === Net.id) continue;
      if (!this.peers.has(id)) this.peers.set(id, this._novoPeer(j));
      else Object.assign(this.peers.get(id), j);
    }
    for (const id of [...this.peers.keys()]) if (!Net.jogadores.has(id)) this.peers.delete(id);
  },

  _novoPeer(j) {
    return {
      ...j,
      px: (j.x || 0) * 16, py: (j.y || 0) * 16,
      passo: 0, balao: null, emote: null,
    };
  },

  _doJogo(msg) {
    switch (msg.tipo) {
      case "sala": case "entrou": this._sincronizaPeers(); break;
      case "pos": {
        const j = Net.jogadores.get(msg.de);
        if (!j) break;
        if (!this.peers.has(msg.de)) this.peers.set(msg.de, this._novoPeer(j));
        else Object.assign(this.peers.get(msg.de), j);
        break;
      }
      case "chat": {
        const p = this.peers.get(msg.de);
        const texto = String(msg.texto || "").slice(0, cfg().maxChat || 40);
        if (p) p.balao = { texto, t: cfg().balao || 4 };
        this._emite("chat", { de: msg.de, nome: p?.nome || "?", texto });
        break;
      }
      case "emote": {
        const p = this.peers.get(msg.de);
        if (p) p.emote = { i: msg.i | 0, t: 1.6 };
        break;
      }
      case "convite": this._chegouConvite(msg); break;
      case "resposta": this._voltouResposta(msg); break;
      case "cartao": this._emite("cartao", msg.cartao); break;
      default:
        // troca* e batalha* são das cenas: elas se inscrevem e leem direto
        if (msg.tipo?.startsWith("troca")) this._emite("troca", msg);
        else if (msg.tipo?.startsWith("batalha")) this._emite("batalha", msg);
        break;
    }
  },

  /** Manda a posição — no máximo `ritmoPos` por segundo, e só se mudou algo. */
  mandaPos(dt, player, andando) {
    if (!Net.ligado()) return;
    this._tPos -= dt;
    const chave = `${player.map}|${player.x}|${player.y}|${player.dir}|${andando ? 1 : 0}`;
    if (this._tPos > 0 || chave === this._ultimaPos) return;
    this._tPos = cfg().ritmoPos || 0.12;
    this._ultimaPos = chave;
    Net.manda("pos", {
      mapa: player.map, x: player.x, y: player.y, dir: player.dir,
      sprite: "hero", andando: !!andando,
    });
  },

  update(dt) {
    if (this.avisoT > 0 && (this.avisoT -= dt) <= 0) this.aviso = null;
    this._vigiaSinal(dt);

    const suave = cfg().suavizacao || 0.14;
    for (const p of this.peers.values()) {
      const ax = (p.x || 0) * 16, ay = (p.y || 0) * 16;
      const k = Math.min(1, dt / suave);
      const dx = ax - p.px, dy = ay - p.py;
      p.px += dx * k;
      p.py += dy * k;
      const parado = Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5;
      p.passo = parado ? 0 : (p.passo + dt * 7) % 4;
      if (p.balao && (p.balao.t -= dt) <= 0) p.balao = null;
      if (p.emote && (p.emote.t -= dt) <= 0) p.emote = null;
    }

    for (const c of [this.convitePendente, this.conviteEnviado]) {
      if (c && (c.t -= dt) <= 0) {
        if (c === this.convitePendente) this.convitePendente = null;
        else { this.conviteEnviado = null; this._avisaTela(txt("recusou", { NOME: c.nome }), false); }
      }
    }
  },

  /** Servidor mudo por tempo demais: encerra o que estava aberto pra você não
   *  ficar preso numa tela de troca esperando alguém que não vem. A conexão em
   *  si continua tentando voltar sozinha, e quando volta o jogo avisa. Isto não
   *  bloqueia nada — é só não deixar você travado. */
  _vigiaSinal(dt) {
    if (!this.naSala()) { this._semSinalT = 0; return; }
    if (this.temRede()) {
      if (!this._tinhaSinal) this._avisaTela(txt("sinalVoltou"));
      this._tinhaSinal = true;
      this._semSinalT = 0;
      this._jaAvisei = false;
      return;
    }
    this._tinhaSinal = false;
    this._semSinalT += dt;
    if (this._semSinalT < (cfg().sinal?.segundosPraSair ?? 8) || this._jaAvisei) return;
    this._jaAvisei = true;
    this.peers.clear();                          // não dá pra confiar em onde eles estão
    this._avisaTela(txt("sinalCaiu"));
    if (!this.livre()) this._emite("parceiroSumiu", { id: null });   // fecha troca/batalha
  },

  /** os outros jogadores que estão neste mapa (é o que o overworld desenha) */
  noMapa(mapa) {
    const out = [];
    for (const p of this.peers.values()) if (p.mapa === mapa) out.push(p);
    return out;
  },

  // ------------------------------------------------------------------ chat
  falar(texto) {
    const limpo = String(texto || "").toUpperCase().slice(0, cfg().maxChat || 40).trim();
    if (!limpo || !this.podeOnline()) return false;
    Net.manda("chat", { texto: limpo });
    return limpo;
  },

  emote(i) { if (this.podeOnline()) Net.manda("emote", { i: i | 0 }); },

  // -------------------------------------------------------------- convites
  livre() { return this.ocupacao === LIVRE; },

  convidar(id, modo) {
    if (!Net.ligado() || !this.livre() || !this.podeOnline()) return false;
    const alvo = this.peers.get(id);
    if (!alvo) return false;
    this.conviteEnviado = { id, nome: alvo.nome, modo, t: cfg().convite || 30 };
    Net.manda("convite", { modo, nome: Net.nome }, id);
    return true;
  },

  _chegouConvite(msg) {
    if (!this.livre() || this.convitePendente) {
      return void Net.manda("resposta", { modo: msg.modo, ok: false, motivo: "ocupado" }, msg.de);
    }
    const p = this.peers.get(msg.de);
    this.convitePendente = {
      id: msg.de, nome: msg.nome || p?.nome || "?", modo: msg.modo, t: cfg().convite || 30,
    };
    this._emite("convite", this.convitePendente);
  },

  responder(aceita) {
    const c = this.convitePendente;
    if (!c) return null;
    this.convitePendente = null;
    Net.manda("resposta", { modo: c.modo, ok: !!aceita }, c.id);
    if (!aceita) return null;
    this.ocupacao = c.modo;
    return { ...c, papel: "convidado" };     // quem convidou manda na batalha
  },

  _voltouResposta(msg) {
    const c = this.conviteEnviado;
    if (!c || c.id !== msg.de) return;
    this.conviteEnviado = null;
    if (!msg.ok) {
      return this._avisaTela(txt(msg.motivo === "ocupado" ? "ocupado" : "recusou", { NOME: c.nome }), false);
    }
    this.ocupacao = c.modo;
    this._emite("comecar", { ...c, papel: "dono" });
  },

  /** o parceiro sumiu no meio de uma troca/batalha */
  _perdeuOParceiro(id) {
    if (this.conviteEnviado?.id === id) this.conviteEnviado = null;
    if (this.convitePendente?.id === id) this.convitePendente = null;
    if (this.ocupacao !== LIVRE) this._emite("parceiroSumiu", { id });
  },

  liberar() { this.ocupacao = LIVRE; },

  // ------------------------------------------------- Pokémon vindo de fora
  /** Serializa um Pokémon do save pra mandar pela rede. */
  empacota(mon) {
    return {
      species: mon.species, nickname: mon.nickname, level: mon.level, xp: mon.xp,
      ivs: mon.ivs, moves: (mon.moves || []).map((m) => ({ id: m.id, pp: m.pp, ppMax: m.ppMax })),
      status: mon.status || null, shiny: !!mon.shiny, corrupt: !!mon.corrupt,
      seed: mon.seed | 0, hp: mon.hp,
    };
  },

  /** Devolve um Pokémon SEGURO a partir do que veio da rede — ou null. */
  sanea(cru) {
    try {
      if (!cru || typeof cru !== "object") return null;
      const sp = DB.SPECIES[cru.species];
      if (!sp || sp.mega) return null;             // MEGA só existe dentro da batalha
      const level = Math.max(1, Math.min(100, Math.round(+cru.level || 1)));
      const ivs = {};
      for (const k of ["hp", "atk", "def", "spa", "spd", "spe"]) {
        ivs[k] = Math.max(0, Math.min(31, Math.round(+cru.ivs?.[k] || 0)));
      }
      const golpes = (Array.isArray(cru.moves) ? cru.moves : [])
        .filter((m) => DB.MOVES[m?.id])
        .slice(0, 4)
        .map((m) => {
          const max = DB.MOVES[m.id].pp;
          return { id: m.id, ppMax: max, pp: Math.max(0, Math.min(max, Math.round(+m.pp || 0))) };
        });
      const mon = createMon(cru.species, level, {
        ivs,
        moves: golpes.length ? golpes.map((g) => g.id) : undefined,
        nickname: String(cru.nickname || sp.name).slice(0, 12),
        shiny: !!cru.shiny,
        corrupt: !!cru.corrupt,
        seed: Math.max(0, Math.min(9999, cru.seed | 0)),
      });
      if (golpes.length) mon.moves = golpes;
      mon.status = ["queimadura", "paralisia", "envenenado"].includes(cru.status) ? cru.status : null;
      recalc(mon);
      mon.hp = Math.max(0, Math.min(mon.maxHp, Math.round(+cru.hp ?? mon.maxHp)));
      return mon;
    } catch (e) {
      console.warn("[online] Pokémon de fora recusado:", e);
      return null;
    }
  },

  /** Uma cópia pra batalha link: ninguém sai machucado de verdade. */
  copiaPraBatalha(mon) {
    const c = this.sanea(this.empacota(mon));
    return c;
  },
};
