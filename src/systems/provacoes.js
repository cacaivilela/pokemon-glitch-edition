// AS PROVAÇÕES — a parte viva. Os dezoito pedidos estão em src/data/provacoes.js.
//
// A regra de desenho é a mesma das side quests (src/systems/missoes.js): nada
// aqui precisa de gatilho espalhado pelo jogo. O estado de uma provação é uma
// PERGUNTA que se responde olhando o save agora — "o pós-jogo abriu?", "tem
// alguém de ÁGUA na equipe?", "o cristal já está na mochila?" —, e ela é feita
// quando você encosta na marca. Assim um save antigo, que catou os cristais do
// chão quando eles ficavam largados por aí, chega aqui com as provações já
// fechadas em vez de quebrado: ter o cristal É ter passado.
import { DB } from "../data/index.js";
import { createMon } from "./mon.js";

/** A ilha só acorda no pós-jogo, e o pós-jogo deste jogo é um só: MISSINGNO.
 *  capturado. A mesma bandeira que põe o CELEBI na clareira (src/data/eras.js)
 *  — se as duas coisas começam no mesmo instante, elas não deviam depender de
 *  duas contas diferentes. */
export const ilhaAcordou = (st) => !!st?.flags?.caughtMissingno;

/** Essa provação já foi passada? O cristal na mochila vale como sim: quem pegou
 *  o dele do chão na versão antiga não precisa lutar de novo pelo que já tem. */
export const feita = (st, p) => !!st?.provacoes?.[p.id]?.feita || !!st?.items?.[p.item];

/** Quantas foram passadas. */
export const feitas = (st) => (DB.PROVACOES || []).filter((p) => feita(st, p)).length;

/** A próxima da fila: a primeira, NA ORDEM, que ainda não foi feita. É a única
 *  que acorda — as outras esperam a vez delas. null quando acabou tudo. */
export const proxima = (st) => (DB.PROVACOES || []).find((p) => !feita(st, p)) || null;

/** A GUARDIÃ já espalhou as marcas por Kanto? Antes da primeira conversa com
 *  ela, não tem marca em lugar nenhum. */
export const espalhadas = (st) => !!st?.flags?.provacoesEspalhadas;

/** A primeira conversa com a GUARDIÃ no pós-jogo: é ela que manda as marcas
 *  pra Kanto. Devolve true se espalhou agora (e false se já tinha espalhado,
 *  ou se o pós-jogo ainda não começou). */
export function espalhar(st) {
  if (!ilhaAcordou(st) || espalhadas(st)) return false;
  (st.flags ||= {}).provacoesEspalhadas = true;
  return true;
}

/** Tem alguém do tipo dela andando com você? A equipe basta — o que está no PC
 *  não está andando com ninguém. Desmaiado conta: a marca olha quem você
 *  escolheu levar, não quem está de pé. */
export const temOTipo = (st, p) =>
  (st?.party || []).some((m) => DB.SPECIES[m?.species]?.types?.includes(p.tipo));

/** Como está esta provação pra este save:
 *    "feita"    — o cristal é seu
 *    "fechada"  — o pós-jogo ainda não começou
 *    "travada"  — ainda não é a vez dela: tem uma antes na fila
 *    "semtipo"  — falta alguém do tipo dela na equipe
 *    "pronta"   — é só encostar */
export function estado(st, p) {
  if (feita(st, p)) return "feita";
  if (!ilhaAcordou(st)) return "fechada";
  if (proxima(st) !== p) return "travada";
  if (!temOTipo(st, p)) return "semtipo";
  return "pronta";
}

/** As que aparecem no mapa agora: as que ainda não foram passadas, depois de
 *  a GUARDIÃ espalhar. As travadas e as sem-tipo APARECEM — a marca está lá, e
 *  é ela que conta o que falta. Marca que some é marca que não ensina nada. */
export const noMapa = (st, mapa) =>
  (DB.PROVACOES || []).filter((p) => p.mapa === mapa && ilhaAcordou(st) && espalhadas(st) && !feita(st, p));

/** A chave do totem daquela provação no `npcState`. Uma função só porque ela é
 *  escrita em dois lugares (quem monta o NPC e quem confere a vitória), e duas
 *  cópias de uma chave é um bug esperando o dia dele. */
export const chaveDoTotem = (p) => `${p.mapa}.totem_${p.id}`;

/** O TOTEM: o mesmo bicho de sempre, grande demais.
 *
 *  Os atributos são mexidos em `stats` e não em `base`, como na GLITCH RAID
 *  (src/systems/raid.js): assim a conta de dano do jogo não muda em lugar
 *  nenhum — ele só é grande. A aura viaja DENTRO do bicho (`mon.totem`) porque
 *  quem precisa dela é a cena de batalha, e passar por argumento seria mais um
 *  caminho pra mesma informação chegar torta. */
export function montarTotem(p) {
  const T = DB.TOTEM;
  const mon = createMon(p.totem, p.nivel);
  // `vidas` por provação existe por causa de UMA: o DIGLETT tem 10 de HP-base e
  // sairia da conta geral com um terço do fôlego dos outros dezessete. E a
  // provação dele é justamente a do bicho que estava INTEIRO embaixo da terra —
  // dar corpo a ele é a regra do jogo concordando com a piada.
  mon.maxHp = Math.round(mon.maxHp * (p.vidas ?? T.vidas));
  mon.hp = mon.maxHp;
  for (const k of ["atk", "def", "spa", "spd", "spe"]) {
    mon.stats[k] = Math.round(mon.stats[k] * T.forca);
  }
  mon.totem = {
    tipo: p.tipo,
    aura: p.aura,
    acorda: [p.acorda, ...(p.acordaExtra || [])].filter(Boolean),
  };
  return mon;
}

/** DUPLA OU TRIO: a partir da posição `TRIO_A_PARTIR` da fila o totem vem
 *  com dois ajudantes (src/data/duplas.js). */
export const tamanhoDoGrupo = (p) =>
  ((DB.PROVACOES || []).indexOf(p) + 1 >= (DB.TRIO_A_PARTIR ?? Infinity) ? 3 : 2);

/** O GRUPO INTEIRO da provação: o totem na frente e os ajudantes do lado, sem
 *  aura e sem tamanho de chefe, uns níveis abaixo dele. */
export function montarGrupoDoTotem(p) {
  const totem = montarTotem(p);
  const lista = DB.AJUDANTES?.[p.tipo] || [];
  const nivel = Math.max(1, p.nivel - (DB.AJUDANTE_ABAIXO ?? 5));
  const ajudantes = lista.slice(0, tamanhoDoGrupo(p) - 1)
    .filter((id) => DB.SPECIES[id])
    .map((id) => createMon(id, nivel, { corrupt: p.tipo === "GLITCH" }));
  return [totem, ...ajudantes];
}

/** Derrubou: o cristal sai do chão. Devolve as falas do prêmio, ou null se não
 *  havia nada a pagar (ela já tinha sido paga). */
export function pagar(st, p) {
  if (feita(st, p)) return null;
  const T = DB.PROVACOES_TEXTO;
  (st.provacoes ||= {})[p.id] = { feita: true, quando: Math.floor(st.playtime || 0) };
  st.items[p.item] = Math.min(999, (st.items[p.item] || 0) + 1);
  return [
    p.venceu,
    p.premioTexto || T.premio.replace("{TIPO}", p.tipo),
    T.comoUsa,
  ];
}

/** A provação cujo totem caiu e ainda não foi paga, ou null. É o que o
 *  overworld pergunta ao voltar da batalha. */
export function aPagar(st) {
  return (DB.PROVACOES || []).find(
    (p) => !feita(st, p) && st?.npcState?.[chaveDoTotem(p)]?.defeated) || null;
}

/** O que a GUARDIÃ tem pra dizer agora. Na primeira conversa do pós-jogo
 *  ela espalha as marcas (quem chama é o overworld, com `espalhar`, e passa
 *  `acabouDeEspalhar`); nas outras ela é o placar e diz qual é a próxima. */
export function falaDaGuardia(st, acabouDeEspalhar = false) {
  const T = DB.PROVACOES_TEXTO;
  const todas = DB.PROVACOES || [];
  const n = feitas(st);
  if (n >= todas.length) return T.todas;
  const p = proxima(st);
  const onde = (x) => x.replace("{TIPO}", p.tipo).replace("{LUGAR}", p.lugar);
  const linhas = acabouDeEspalhar ? [...T.guardia, T.espalhou, ...T.regra] : [T.denovo];
  if (n > 0) linhas.push(T.contagem.replace("{N}", n).replace("{T}", todas.length));
  if (p.tipo === "GLITCH") return [...linhas, onde(T.ultima)];
  linhas.push(onde(T.proxima));
  const depois = todas.filter((x) => !feita(st, x) && x !== p).slice(0, 3)
    .map((x) => `${x.tipo} (${x.lugar})`);
  if (depois.length) linhas.push(T.depois.replace("{LISTA}", depois.join(", ")));
  return linhas;
}
