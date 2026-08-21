// O modelo do SISTEMA DE ARMAZENAMENTO. A tela dele é src/scenes/box.js.
//
// state.boxes = [{ nome, papel, mons: [ ...30 lugares, null = vazio ] }, ...]
// state.boxAtual = índice da box aberta por último
//
// Os lugares são FIXOS: guardar no meio da grade deixa buraco dos dois lados,
// como no jogo original. A equipe (state.party) continua sendo uma lista densa
// de no máximo 6 — o resto do código conta com isso.
import { DB } from "../data/index.js";

export const boxCount = () => DB.BOX?.count || 14;
export const boxSize = () => DB.BOX?.size || 30;
export const papeis = () => DB.BOX_PAPEIS || [];

export function nomePadrao(i) {
  return (DB.BOX?.nomePadrao || "BOX {N}").replace("{N}", i + 1);
}

/** Primeiro lugar vago a partir de `inicio`, dando a volta. */
function encaixar(boxes, mon, inicio = 0) {
  const n = boxes.length;
  for (let k = 0; k < n; k++) {
    const i = (inicio + k) % n;
    const slot = boxes[i].mons.indexOf(null);
    if (slot >= 0) {
      boxes[i].mons[slot] = mon;
      return { box: i, slot, nome: boxes[i].nome };
    }
  }
  return null;
}

function formatoOk(state) {
  const n = boxCount(), tam = boxSize();
  return Array.isArray(state.boxes) && state.boxes.length === n
    && state.boxes.every((b) => Array.isArray(b?.mons) && b.mons.length === tam);
}

/** Põe state.boxes no formato atual. Absorve o save antigo (state.box era uma
 *  lista única e infinita) e o que sobrar de uma configuração maior. Quem não
 *  couber fica em state.box esperando vaga — nada é apagado. */
export function garantirBoxes(state) {
  if (!state) return [];
  if (formatoOk(state) && !state.box?.length) return state.boxes;

  const n = boxCount(), tam = boxSize();
  const antigas = Array.isArray(state.boxes) ? state.boxes : [];
  const boxes = [];
  for (let i = 0; i < n; i++) {
    const b = antigas[i] || {};
    const mons = (Array.isArray(b.mons) ? b.mons.slice(0, tam) : []).map((m) => m || null);
    while (mons.length < tam) mons.push(null);
    boxes.push({
      nome: b.nome || nomePadrao(i),
      papel: Number.isInteger(b.papel) ? b.papel : i % Math.max(1, papeis().length),
      mons,
    });
  }
  // sobra: box antigo (lista plana) + quem estava numa box que não existe mais
  const sobra = [
    ...(Array.isArray(state.box) ? state.box.filter(Boolean) : []),
    ...antigas.slice(n).flatMap((b) => (b?.mons || []).filter(Boolean)),
    ...antigas.slice(0, n).flatMap((b) => (Array.isArray(b?.mons) ? b.mons.slice(tam) : []).filter(Boolean)),
  ];
  state.boxes = boxes;
  const presos = [];
  for (const mon of sobra) if (!encaixar(boxes, mon, 0)) presos.push(mon);
  if (presos.length) {
    state.box = presos;
    console.warn(`[box] ${presos.length} Pokémon sem vaga: esperando numa box nova`);
  } else delete state.box;
  state.boxAtual = Math.min(Math.max(0, state.boxAtual | 0), n - 1);
  return boxes;
}

/** Guarda um Pokémon no PC. Devolve { box, slot, nome } ou null (tudo cheio). */
export function guardar(state, mon) {
  const boxes = garantirBoxes(state);
  return encaixar(boxes, mon, state.boxAtual || 0);
}

/** Todo mundo que está guardado, em ordem de box. */
export function todosGuardados(state) {
  return (state?.boxes || []).flatMap((b) => (b.mons || []).filter(Boolean))
    .concat((state?.box || []).filter(Boolean));
}

export const ocupados = (box) => (box?.mons || []).filter(Boolean).length;
export const totalGuardados = (state) => todosGuardados(state).length;
export const vagas = (state) =>
  (state?.boxes || []).reduce((n, b) => n + b.mons.filter((m) => !m).length, 0);
export const cheio = (state) => vagas(state) === 0;
