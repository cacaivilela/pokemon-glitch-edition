// AS REGRAS DO ACAMPAMENTO: quem pode acampar, o que sai da panela e por
// quanto tempo aquilo vale. A tela não decide nada disto (src/scenes/acampamento.js),
// e as tabelas estão em src/data/acampamento.js.
import { DB } from "../data/index.js";
import { heal } from "./mon.js";
import { INGREDIENTES, BARRACA, SABORES, COMBOS, MISTO, MISTURA, ESTRELAS, FORCA } from "../data/acampamento.js";

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

/** Os sabores da tábua, do que mais aparece pro que menos. */
export function contarSabores(ingredientes) {
  const conta = {};
  for (const i of ingredientes) {
    const s = INGREDIENTES[i]?.sabor;
    if (s) conta[s] = (conta[s] || 0) + 1;
  }
  return Object.entries(conta).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

/** O sabor do sanduíche: um só quando alguém ganha, o PAR quando dois empatam
 *  na frente ("doce+salgado" é o agridoce), e nenhum quando não dá pra decidir —
 *  três empatados, ou tábua sem sabor nenhum. */
export function saborDe(ingredientes) {
  const ordem = contarSabores(ingredientes);
  if (!ordem.length) return "nenhum";
  if (ordem.length === 1 || ordem[0][1] > ordem[1][1]) return ordem[0][0];
  // dois na frente viram par; três na frente não viram nada
  if (ordem.length > 2 && ordem[1][1] === ordem[2][1]) return "nenhum";
  return [ordem[0][0], ordem[1][0]].sort().join("+");
}

/** A nota do minijogo (0..1) vira estrela. */
export function estrelaDe(acerto) {
  let achada = ESTRELAS[0];
  for (const e of ESTRELAS) if (acerto >= e.min) achada = e;
  return { ...achada, indice: ESTRELAS.indexOf(achada) + 1, total: ESTRELAS.length };
}

const efeitoDe = (sabor, estrela, parte = 1) => ({
  efeito: SABORES[sabor].efeito,
  forca: (FORCA[SABORES[sabor].efeito] || 0) * estrela.forca * parte,
});

/** Monta o sanduíche: o que ele é, o que faz e o quanto faz. Não aplica nada.
 *
 *  Sabor único dá um efeito inteiro. Par dá OS DOIS, cada um valendo `MISTURA`
 *  do que valeria sozinho — comer bem de duas coisas ao mesmo tempo não é comer
 *  o dobro. Os minutos do par são os do mais curto: quando um acaba, acabou. */
export function cozinhar(ingredientes, acerto) {
  const sabor = saborDe(ingredientes);
  const estrela = estrelaDe(acerto);

  if (sabor.includes("+")) {
    const [a, b] = sabor.split("+");
    const nomeado = COMBOS[sabor] || MISTO;
    const efeitos = [efeitoDe(a, estrela, MISTURA), efeitoDe(b, estrela, MISTURA)];
    const minutos = Math.min(...[a, b].map((x) => SABORES[x].minutos).filter((m) => m > 0));
    const hud = [SABORES[a].hud, SABORES[b].hud].filter(Boolean).join(" ");
    return {
      sabor, combinado: true,
      nome: nomeado.nome, texto: nomeado.texto,
      efeitos, minutos: Number.isFinite(minutos) ? minutos : 0, hud, estrela,
      // os dois de sempre, pra quem só quer saber "o principal"
      efeito: efeitos[0].efeito, forca: efeitos[0].forca,
    };
  }

  const receita = SABORES[sabor] || SABORES.nenhum;
  const um = { efeito: receita.efeito, forca: (FORCA[receita.efeito] || 0) * estrela.forca };
  return {
    sabor, combinado: false,
    nome: receita.nome, texto: receita.texto,
    efeitos: [um], minutos: receita.minutos, hud: receita.hud, estrela,
    efeito: um.efeito, forca: um.forca,
  };
}

/** Come: gasta os ingredientes, cura ou marca o efeito no save.
 *  O efeito é UM só — comer de novo troca o de antes, não empilha. */
export function comer(st, sanduiche, ingredientes) {
  for (const i of ingredientes) {
    st.items[i] = Math.max(0, (st.items[i] || 0) - 1);
    if (!st.items[i]) delete st.items[i];
  }
  const efeitos = sanduiche.efeitos || [{ efeito: sanduiche.efeito, forca: sanduiche.forca }];

  // a cura acontece na hora e não tem prazo: ela sai da lista e o resto vale
  const curou = efeitos.some((e) => e.efeito === "cura");
  if (curou) for (const mon of st.party) heal(mon);

  const duram = efeitos.filter((e) => e.efeito !== "cura" && e.efeito !== "nada");
  if (!duram.length || !sanduiche.minutos) return { curou };
  st.buff = {
    efeitos: duram,
    nome: sanduiche.nome,
    hud: sanduiche.hud,
    ate: Date.now() + sanduiche.minutos * 60000,
  };
  return { curou };
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
  if (!b) return 1;
  // save antigo guardava um efeito só, no próprio buff; save novo guarda a
  // lista. Os dois continuam valendo — ninguém perde o sanduíche na atualização.
  const lista = b.efeitos || [{ efeito: b.efeito, forca: b.forca }];
  const achado = lista.find((e) => e.efeito === efeito);
  if (!achado) return 1;
  if (efeito === "fuga" || efeito === "sorte") return achado.forca;   // multiplicam
  if (efeito === "defesa" || efeito === "calmaria") return 1 - achado.forca;  // diminuem
  return 1 + achado.forca;                                           // somam por cima
}

/** Descansar na barraca: cura a equipe inteira. É o Centro Pokémon que você
 *  carrega — e é por isso que a barraca custa caro. */
export function descansar(st) {
  for (const mon of st.party) heal(mon);
  return st.party.length;
}

export { BARRACA, INGREDIENTES };
