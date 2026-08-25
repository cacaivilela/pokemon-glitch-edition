// AS REGRAS DO ACAMPAMENTO: quem pode acampar, o que sai da panela e por
// quanto tempo aquilo vale. A tela não decide nada disto (src/scenes/acampamento.js),
// e as tabelas estão em src/data/acampamento.js.
import { DB } from "../data/index.js";
import { heal } from "./mon.js";
import { INGREDIENTES, BARRACA, SABORES, ESTRELAS, FORCA } from "../data/acampamento.js";

/** Dá pra montar barraca aqui? Precisa da barraca na mochila e de chão de fora:
 *  dentro de casa não cabe, e dentro da fenda o chão não é chão. */
export function podeAcampar(st, mapa) {
  if (!st || (st.items?.[BARRACA.item] || 0) <= 0) return { ok: false, erro: "semBarraca" };
  if (st.player?.map === "glitchdim") return { ok: false, erro: "fenda" };
  if (mapa?.interior) return { ok: false, erro: "dentro" };
  if (!st.party?.length) return { ok: false, erro: "semEquipe" };
  return { ok: true };
}

/** Os ingredientes que você tem na mochila, na ordem da tabela. */
export function naMochila(st) {
  return Object.keys(INGREDIENTES).filter((i) => (st.items?.[i] || 0) > 0);
}

/** O sabor que aparecer mais entre os ingredientes. Empate não vira sabor
 *  nenhum: sanduíche não sabe negociar. */
export function saborDe(ingredientes) {
  const conta = {};
  for (const i of ingredientes) {
    const s = INGREDIENTES[i]?.sabor;
    if (s) conta[s] = (conta[s] || 0) + 1;
  }
  const ordem = Object.entries(conta).sort((a, b) => b[1] - a[1]);
  if (!ordem.length) return "nenhum";
  if (ordem.length > 1 && ordem[0][1] === ordem[1][1]) return "nenhum";
  return ordem[0][0];
}

/** A nota do minijogo (0..1) vira estrela. */
export function estrelaDe(acerto) {
  let achada = ESTRELAS[0];
  for (const e of ESTRELAS) if (acerto >= e.min) achada = e;
  return { ...achada, indice: ESTRELAS.indexOf(achada) + 1, total: ESTRELAS.length };
}

/** Monta o sanduíche: o que ele é, o que faz e o quanto faz. Não aplica nada. */
export function cozinhar(ingredientes, acerto) {
  const sabor = saborDe(ingredientes);
  const receita = SABORES[sabor] || SABORES.nenhum;
  const estrela = estrelaDe(acerto);
  return {
    sabor,
    nome: receita.nome,
    texto: receita.texto,
    efeito: receita.efeito,
    minutos: receita.minutos,
    hud: receita.hud,
    estrela,
    forca: (FORCA[receita.efeito] || 0) * estrela.forca,
  };
}

/** Come: gasta os ingredientes, cura ou marca o efeito no save.
 *  O efeito é UM só — comer de novo troca o de antes, não empilha. */
export function comer(st, sanduiche, ingredientes) {
  for (const i of ingredientes) {
    st.items[i] = Math.max(0, (st.items[i] || 0) - 1);
    if (!st.items[i]) delete st.items[i];
  }
  if (sanduiche.efeito === "cura") {
    for (const mon of st.party) heal(mon);
    return { curou: true };
  }
  if (sanduiche.efeito === "nada" || !sanduiche.minutos) return { curou: false };
  st.buff = {
    efeito: sanduiche.efeito,
    forca: sanduiche.forca,
    nome: sanduiche.nome,
    hud: sanduiche.hud,
    ate: Date.now() + sanduiche.minutos * 60000,
  };
  return { curou: false };
}

/** O efeito que está valendo agora, ou null. Ele vence sozinho: quem pergunta
 *  primeiro é quem limpa, então não existe "buff eterno" esquecido no save. */
export function buff(st) {
  const b = st?.buff;
  if (!b) return null;
  if (Date.now() >= b.ate) { delete st.buff; return null; }
  return b;
}

/** Quanto falta do efeito, em minutos (pro HUD). */
export function minutosDoBuff(st) {
  const b = buff(st);
  return b ? Math.max(0, (b.ate - Date.now()) / 60000) : 0;
}

/** O multiplicador daquele efeito agora: 1 quando não há nada valendo.
 *  É por aqui que o resto do jogo pergunta — batalha, fuga, encontro. */
export function fator(st, efeito) {
  const b = buff(st);
  if (!b || b.efeito !== efeito) return 1;
  if (efeito === "fuga" || efeito === "sorte") return b.forca;   // multiplicam
  return 1 + b.forca;                                            // somam por cima
}

/** Descansar na barraca: cura a equipe inteira. É o Centro Pokémon que você
 *  carrega — e é por isso que a barraca custa caro. */
export function descansar(st) {
  for (const mon of st.party) heal(mon);
  return st.party.length;
}

export { BARRACA, INGREDIENTES };
