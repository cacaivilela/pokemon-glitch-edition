// AS REGIÕES QUE QUEM JOGA INVENTA.
//
// O jogo vem com nove (KANTO a PALDEA, em src/data/iniciais.js) e elas são
// FIXAS: moram no código, iguais pra todo mundo. Estas aqui são as de quem está
// na frente da tela — nome escolhido, três iniciais escolhidos.
//
// MORAM NO localStorage, e não no save, pelo mesmo motivo que o idioma e a
// velocidade (ver src/core/opcoes.js): uma região que você inventou é SUA, não
// daquela partida. Apagar o save e começar de novo não pode fazer você perder a
// região que você criou — senão ela só serviria pra partida em que nasceu, que é
// justamente a partida em que você ainda não precisava dela.
//
// A LISTA DAS NOVE NÃO É TOCADA. As suas entram DEPOIS delas, e o jogo lê a
// soma (`todas`). Assim nada do que o jogo já trazia pode ser quebrado por uma
// região inventada — o pior caso é sobrar uma opção estranha no fim da lista.
const CHAVE = "pge.regioes";

/** 16 letras. Doze cortava "TERRA DO CAIO" no meio, que é exatamente o tipo de
 *  nome que alguém escreve — e um nome cortado pela metade na caixa de escolha
 *  parece defeito do jogo, não limite. Dezesseis ainda cabe na linha do menu. */
const LIMITE_NOME = 16;
const limpaNome = (s) =>
  String(s || "").toUpperCase().replace(/\s+/g, " ").trim().slice(0, LIMITE_NOME);

let cache = null;

function ler() {
  if (cache) return cache;
  cache = [];
  try {
    const cru = JSON.parse(localStorage.getItem(CHAVE) || "[]");
    // só entra o que TEM a forma certa: nome e exatamente três espécies. Um
    // registro meio escrito (aba fechada no meio, armazenamento cheio) viraria
    // uma região sem inicial, e a caixa de escolha do laboratório quebraria na
    // mão de quem só queria pegar um Pokémon.
    if (Array.isArray(cru)) {
      cache = cru
        .filter((r) => r && typeof r.nome === "string" && Array.isArray(r.mons) && r.mons.length === 3)
        .map((r) => ({ nome: limpaNome(r.nome), mons: r.mons.map(String), minha: true }))
        .filter((r) => r.nome);
    }
  } catch { /* navegador sem localStorage: fica sem região inventada */ }
  return cache;
}

function grava() {
  try { localStorage.setItem(CHAVE, JSON.stringify(cache)); } catch {}
}

export const Regioes = {
  /** só as que esta pessoa inventou */
  minhas: () => [...ler()],

  /** as NOVE do jogo + as suas, na ordem em que a caixa de escolha mostra */
  todas(doJogo) {
    return [...(doJogo || []), ...ler()];
  },

  /** Cria uma. Devolve null se o nome está vazio ou repetido. */
  criar(nome, mons, doJogo) {
    const n = limpaNome(nome);
    if (!n || !Array.isArray(mons) || mons.length !== 3) return null;
    const jaTem = [...(doJogo || []), ...ler()].some((r) => r.nome === n);
    if (jaTem) return null;
    const r = { nome: n, mons: mons.map(String), minha: true };
    ler().push(r);
    grava();
    return r;
  },

  apagar(nome) {
    const n = limpaNome(nome);
    cache = ler().filter((r) => r.nome !== n);
    grava();
  },

  /** Esquece o que estava em memória — o próximo `ler()` volta ao disco. */
  recarregar() { cache = null; },
};

/** Soma de atributos a partir da qual o bicho é forte demais pra nascer nível 5.
 *  580 é onde ficam ARTICUNO, ZAPDOS e MOLTRES — o degrau dos lendários. */
export const LENDARIO = 580;

/** As espécies daquele tipo que podem ser inicial de alguém.
 *
 *  FICA FORA quem não deve nascer na mão de ninguém no nível 5: lendário, mega,
 *  fusão e o MISSINGNO. Não é implicância — um inicial lendário transforma as
 *  oito insígnias num passeio, e quem escolheu isso aos nove anos descobre tarde
 *  demais que estragou o próprio jogo. */
export function candidatos(tipo, especies) {
  const fora = (sp) => sp.megaDe || sp.crescimento || sp.id === "missingno"
    || (sp.bst || 0) >= LENDARIO;
  return Object.values(especies || {})
    .filter((sp) => sp && sp.types?.[0] === tipo && !fora(sp))
    .sort((a, b) => (a.dex || 9999) - (b.dex || 9999));
}
