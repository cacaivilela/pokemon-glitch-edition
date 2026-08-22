// Transporte das funções online. Uma SSE aberta pra receber (/__net) e um POST
// pra falar (/__net) — o mesmo par que o live update já usava, então não entra
// dependência nenhuma e funciona em qualquer navegador.
//
// Este arquivo não sabe nada do jogo: ele conecta, mantém a lista de quem está
// na sala e entrega as mensagens pra quem se inscreveu. As regras (troca,
// batalha, chat) ficam em src/systems/online.js, que tem hot-swap dos dados.
//
// O id é gravado no navegador e não muda: quem dá F5 no meio de uma troca volta
// a ser a MESMA pessoa pro outro lado, e o servidor troca a conexão velha pela
// nova em vez de criar um fantasma na sala.
import { url as arquivo } from "./base.js";
const CHAVE_ID = "pge.netid";
const PING = 5000;          // sinal de vida (o servidor derruba com 20s de silêncio)
// Espera antes de tentar de novo. A primeira é quase imediata: a maior parte
// das quedas é uma piscada (o servidor recarregou, o wifi engasgou), e esperar
// 1,2s pra descobrir isso era tempo jogado fora. As seguintes vão abrindo pra
// não martelar um servidor que está mesmo fora.
const RELIGA = [150, 600, 1500, 4000, 8000];

function idFixo() {
  try {
    const guardado = localStorage.getItem(CHAVE_ID);
    if (guardado) return guardado;
    const novo = "j" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem(CHAVE_ID, novo);
    return novo;
  } catch {
    return "j" + Math.random().toString(36).slice(2, 10);   // aba anônima
  }
}

export const Net = {
  id: idFixo(),
  nome: "?",
  sala: null,
  estado: "off",              // off | ligando | on | caiu
  jogadores: new Map(),       // id -> { id, nome, mapa, x, y, dir, sprite, andando }
  erro: null,
  privada: false,
  rtt: null,                  // ida e volta do último ping, em ms (é o sinal)
  falhas: 0,                  // pings seguidos que não voltaram

  _es: null,
  _ping: null,
  _tentativa: 0,
  _saindo: false,
  _ouvintes: new Map(),       // tipo -> Set(cb)

  ligado() { return this.estado === "on"; },

  /** on("chat", cb) — devolve a função que cancela a inscrição. */
  on(tipo, cb) {
    if (!this._ouvintes.has(tipo)) this._ouvintes.set(tipo, new Set());
    this._ouvintes.get(tipo).add(cb);
    return () => this._ouvintes.get(tipo)?.delete(cb);
  },

  _avisa(tipo, msg) {
    for (const cb of this._ouvintes.get(tipo) || []) {
      try { cb(msg); } catch (e) { console.error("[net] ouvinte de", tipo, e); }
    }
    for (const cb of this._ouvintes.get("*") || []) {
      try { cb(msg); } catch { /* o "*" é só pra depurar */ }
    }
  },

  // ------------------------------------------------------------- conexão
  conectar(sala, nome, privada = false) {
    if (!location.protocol.startsWith("http")) return false;   // file://: sem servidor
    const alvo = String(sala || "padrao").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32) || "padrao";
    if (this.estado === "on" && this.sala === alvo) return true;   // já estou nela
    this.desconectar(true);
    this._saindo = false;
    this.sala = String(sala || "padrao").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32) || "padrao";
    this.nome = String(nome || "?").slice(0, 12);
    this.privada = !!privada;
    this.rtt = null;
    this.falhas = 0;
    this._abre();
    return true;
  },

  _abre() {
    this.estado = "ligando";
    this.erro = null;
    const url = arquivo(`__net?sala=${encodeURIComponent(this.sala)}`)
      + `&id=${encodeURIComponent(this.id)}&nome=${encodeURIComponent(this.nome)}`
      + (this.privada ? "&privada=1" : "");
    let es;
    try {
      es = new EventSource(url);
    } catch (e) {
      this.estado = "caiu";
      this.erro = String(e);
      return;
    }
    this._es = es;
    es.onmessage = (ev) => {
      let msg;
      try { msg = JSON.parse(ev.data); } catch { return; }
      this._trata(msg);
    };
    es.onerror = () => {
      es.close();
      if (this._es === es) this._es = null;
      if (this._saindo) return;
      this.estado = "caiu";
      const espera = RELIGA[Math.min(this._tentativa++, RELIGA.length - 1)];
      this._avisa("caiu", { espera });
      setTimeout(() => { if (!this._saindo && !this._es) this._abre(); }, espera);
    };
    clearInterval(this._ping);
    this._ping = setInterval(() => this.pinga(), PING);
  },

  /** O ping é o medidor de sinal: o que interessa é quanto ele demora a voltar.
   *  A média é amaciada pra uma engasgada só não derrubar as barras. */
  async pinga() {
    const t0 = performance.now();
    const ok = await this.manda("ping");
    const gasto = performance.now() - t0;
    if (ok) {
      this.rtt = this.rtt == null ? gasto : this.rtt * 0.6 + gasto * 0.4;
      this.falhas = 0;
    } else {
      this.falhas++;
    }
    return ok;
  },

  desconectar(silencioso = false) {
    this._saindo = true;
    clearInterval(this._ping);
    this._ping = null;
    if (this._es) {
      if (!silencioso) this.manda("sai");
      this._es.close();
      this._es = null;
    }
    this.jogadores.clear();
    this.estado = "off";
    if (!silencioso) this._avisa("desligou", {});
  },

  // ------------------------------------------------------------ mensagens
  _trata(msg) {
    switch (msg.tipo) {
      case "sala":
        this._tentativa = 0;
        this.estado = "on";
        this.pinga();            // mede o sinal já na entrada, sem esperar 5s
        this.jogadores.clear();
        for (const j of msg.jogadores || []) this.jogadores.set(j.id, j);
        break;
      case "entrou":
        if (msg.jogador?.id) this.jogadores.set(msg.jogador.id, msg.jogador);
        break;
      case "saiu":
        this.jogadores.delete(msg.id);
        break;
      case "renomeou": {
        const j = this.jogadores.get(msg.id);
        if (j) j.nome = msg.nome;
        break;
      }
      case "pos": {
        const j = this.jogadores.get(msg.de);
        if (j) Object.assign(j, {
          mapa: msg.mapa, x: msg.x, y: msg.y, dir: msg.dir,
          sprite: msg.sprite, andando: msg.andando,
        });
        break;
      }
      default: break;
    }
    this._avisa(msg.tipo, msg);
  },

  /** Manda uma mensagem pra sala (ou pra um jogador só, com `para`). */
  async manda(tipo, dados = {}, para = null) {
    if (!this.sala || this.estado === "off") return false;
    const corpo = { ...dados, sala: this.sala, de: this.id, tipo };
    if (para) corpo.para = para;
    try {
      const r = await fetch(arquivo("__net"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo),
      });
      if (r.status === 409) {
        // o servidor não me conhece mais (dormi demais e caí da sala): volto
        if (!this._saindo && this.estado !== "ligando") this._abre();
        return false;
      }
      return r.ok;
    } catch {
      return false;
    }
  },

  /** Manda a saída de forma que sobreviva ao fechar a aba. */
  avisaSaida() {
    if (!this.sala || this.estado === "off") return;
    try {
      const blob = new Blob([JSON.stringify({ sala: this.sala, de: this.id, tipo: "sai" })],
                           { type: "application/json" });
      navigator.sendBeacon?.(arquivo("__net"), blob);
    } catch { /* fechando a aba: não dá pra fazer mais nada */ }
  },
};
