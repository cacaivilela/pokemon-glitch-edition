// AS TRÊS ERAS — a parte viva. Os dados (espécies, mapas, falas e guardiões)
// estão em src/data/eras.js.
//
// Tudo aqui lê `DB.ERAS` e não o módulo de dados direto, pela mesma razão do
// resto do jogo: o live update reconstrói o DB em memória, e quem guardou a
// referência solta continua respondendo com os dados de antes de você salvar.
import { DB } from "../data/index.js";

export const eraPorId = (id) => (DB.ERAS || []).find((e) => e.id === id) || null;
export const eraDoMapa = (mapa) => (DB.ERAS || []).find((e) => e.mapa === mapa) || null;

/** O CELEBI só aparece depois que MISSINGNO. foi capturado. */
export const celebiApareceu = (st) => !!st?.flags?.[DB.CELEBI?.flag || "caughtMissingno"];

/** A chave do guardião daquela era no `npcState` do save. */
export const chaveGuardiao = (era) => `${era.mapa}.guardiao`;

/** Esta era está aberta pra este save?
 *
 *  A primeira pede só a fenda fechada. As outras pedem o guardião da anterior
 *  CAPTURADO — derrubar não conta, e não conta de propósito: derrubar sem
 *  capturar já tem o preço de voltar lá, e se ele valesse como chave a era
 *  seguinte abriria por acidente numa luta que o jogador achou que tinha
 *  perdido. */
export function eraLiberada(st, era) {
  if (!celebiApareceu(st)) return false;
  if (!era?.requer) return true;
  const antes = eraPorId(era.requer);
  return !!(antes && st?.caught?.[antes.guardiao.id]);
}

/** As eras que o CELEBI oferece agora, na ordem escrita. */
export const erasAbertas = (st) => (DB.ERAS || []).filter((e) => eraLiberada(st, e));

/** Todas as três fechadas: o último guardião está na sua equipe. */
export function acabouOTempo(st) {
  const todas = DB.ERAS || [];
  const ultimo = todas[todas.length - 1]?.guardiao?.id;
  return !!(ultimo && st?.caught?.[ultimo]);
}
