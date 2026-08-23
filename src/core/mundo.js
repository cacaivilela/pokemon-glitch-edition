// O que foi baixado do mundo mora aqui.
//
// As fichas que vêm do servidor NÃO podem virar arquivo: no site não existe
// disco pra escrever. Então elas ficam no navegador (localStorage) e entram na
// lista de variantes junto com as que vieram no código — a fusão não sabe (nem
// precisa saber) de onde a ficha dela veio.
const CHAVE = "pge.mundo";

let cache = null;

function ler() {
  if (cache) return cache;
  cache = { fichas: {}, em: 0 };
  try {
    const cru = JSON.parse(localStorage.getItem(CHAVE) || "null");
    if (cru?.fichas) cache = cru;
  } catch { /* navegador sem localStorage: fica só na memória desta sessão */ }
  return cache;
}

export const Mundo = {
  /** { "cabeca+corpo": [ficha, ...] } do que já foi baixado */
  fichas() { return ler().fichas; },
  de(chave) { return ler().fichas[chave] || []; },
  quando() { return ler().em; },
  total() { return Object.values(ler().fichas).reduce((n, l) => n + l.length, 0); },

  /** Junta o que veio do servidor com o que já estava aqui. Devolve quantas são
   *  novas e quantas trouxeram desenho — é o que a tela mostra. */
  juntar(recebidas, max = 400) {
    const atual = ler();
    let novas = 0, desenhos = 0;
    for (const [chave, lista] of Object.entries(recebidas || {})) {
      const minhas = (atual.fichas[chave] ||= []);
      const ids = new Set(minhas.map((f) => f.id));
      for (const f of lista || []) {
        if (!f?.id || ids.has(f.id)) continue;
        minhas.push(f);
        ids.add(f.id);
        novas++;
        if (f.sprite) desenhos++;
      }
    }
    if (this.total() > max) this.podar(max);
    atual.em = Date.now();
    this.gravar();
    return { novas, desenhos };
  },

  /** Passou do teto: as mais antigas saem (o desenho de cada uma pesa). */
  podar(max) {
    const atual = ler();
    let sobra = this.total() - max;
    for (const chave of Object.keys(atual.fichas)) {
      while (sobra > 0 && atual.fichas[chave].length) {
        atual.fichas[chave].shift();
        sobra--;
      }
      if (!atual.fichas[chave].length) delete atual.fichas[chave];
      if (sobra <= 0) break;
    }
  },

  gravar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(ler())); } catch { /* cheio: fica na memória */ }
  },

  limpar() {
    cache = { fichas: {}, em: 0 };
    try { localStorage.removeItem(CHAVE); } catch {}
  },
};
