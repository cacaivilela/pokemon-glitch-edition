// Save do jogador.
//
// UM save por computador: ele mora no arquivo save/save.json, servido pelo
// dev_server.py em /__save. Antes ficava no localStorage do navegador, que é
// separado por ORIGEM — abrir o jogo em outra porta (5173, 5178...) criava uma
// partida paralela sem querer. Com o arquivo, a porta não importa mais.
const HOT_KEY = "pge.hotstate";     // estado volátil do live update (por aba)

// UM SAVE POR COMPUTADOR continua valendo: o servidor escolhe o arquivo por
// QUEM pediu (esta máquina, ou o IP de quem entrou pela rede). O ?perfil= da
// URL força um arquivo separado — é o jeito de abrir dois jogadores aqui
// mesmo, pra testar as funções online sem uma segunda máquina.
function perfil() {
  try { return new URLSearchParams(location.search).get("perfil") || ""; } catch { return ""; }
}
const URL_SAVE = "/__save" + (perfil() ? `?perfil=${encodeURIComponent(perfil())}` : "");
const LEGADO = /^pge\.(save|slot)/; // saves antigos que ficaram no navegador

let cache = null;      // último estado conhecido (o jogo lê isto, sem esperar)
let carregado = false;
let versao = 0;        // versão do save no servidor, pra detectar escrita alheia
let meuPerfil = perfil() || "principal";   // qual arquivo é o meu, segundo o servidor
const EU = Math.random().toString(36).slice(2, 10);   // id desta aba

/** apaga qualquer save velho preso no localStorage desta origem */
function limpaLegado() {
  try {
    for (const k of Object.keys(localStorage)) {
      if (LEGADO.test(k)) { localStorage.removeItem(k); console.warn("[save] save antigo do navegador apagado:", k); }
    }
  } catch {}
}

export const Save = {
  /** Chamado uma vez no boot, antes de montar as cenas. */
  async load() {
    limpaLegado();
    try {
      const r = await fetch(URL_SAVE, { cache: "no-store" });
      cache = r.ok ? await r.json() : null;
      versao = +(r.headers.get("X-Save-Version") || 0);
      meuPerfil = r.headers.get("X-Save-Perfil") || meuPerfil;
    } catch {
      cache = null;
      console.warn("[save] servidor fora do ar: a partida não vai ser gravada");
    }
    carregado = true;
    return cache;
  },

  read() { return cache; },
  exists() { return !!cache?.player; },
  pronto() { return carregado; },
  id() { return EU; },
  versao() { return versao; },
  perfil() { return meuPerfil; },

  /** Grava. Devolve "ok", "conflito" (alguém gravou algo mais novo — não
   *  sobrescrevi) ou "erro". O conflito é o giveglitch tendo colocado um
   *  Pokémon no arquivo enquanto esta aba jogava. */
  async write(data) {
    try {
      const r = await fetch(URL_SAVE, {
        method: "POST", keepalive: true,
        headers: {
          "Content-Type": "application/json",
          "X-Save-Base": String(versao),
          "X-Client": EU,
        },
        body: JSON.stringify(data),
      });
      if (r.status === 409) {
        versao = +(r.headers.get("X-Save-Version") || versao);
        console.warn("[save] o arquivo tem algo mais novo — não gravei por cima");
        return "conflito";
      }
      if (!r.ok) return "erro";
      cache = data;
      versao = +(r.headers.get("X-Save-Version") || versao + 1);
      return "ok";
    } catch { return "erro"; }
  },

  /** gravação de saída (fechar a aba): sendBeacon sobrevive ao unload */
  flush(data) {
    cache = data;
    try {
      const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
      if (navigator.sendBeacon?.(URL_SAVE, blob)) return true;
    } catch {}
    return this.write(data);
  },

  clear() {
    cache = null;
    limpaLegado();
    try {
      fetch(URL_SAVE + (URL_SAVE.includes("?") ? "&" : "?") + "clear=1",
            { method: "POST", keepalive: true, body: "null" }).catch(() => {});
    } catch {}
  },

  // estado volatil que sobrevive a um reload do live update (por aba, não é save)
  stash(data) { try { sessionStorage.setItem(HOT_KEY, JSON.stringify(data)); } catch {} },
  popStash() {
    try {
      const raw = sessionStorage.getItem(HOT_KEY);
      sessionStorage.removeItem(HOT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },
};
