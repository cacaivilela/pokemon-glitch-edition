// As contas do CONCURSO DE FUSÃO de Cinnabar. Os dados (jurados, rivais,
// prêmios, pesos) estão em src/data/concurso.js e têm hot-swap; a tela é
// src/scenes/concurso.js.
//
// A mesma função dá nota pra sua dupla e pra dos rivais: ninguém é julgado por
// uma régua diferente. O que muda é que o rival ganha um empurrão por insígnia
// — o concurso fica mais difícil conforme você fica melhor.
import { DB } from "../data/index.js";
import { montarEspecie, fichaDe } from "./fusao.js";

const C = () => DB.CONCURSO;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const arred = (v) => Math.round(v * 10) / 10;

/** HARMONIA: quantos tipos a dupla resiste, quantos ela sofre. */
export function notaHarmonia(tipos) {
  const h = C().harmonia;
  let nota = h.base + (tipos.length < 2 ? h.monotipo : 0);
  for (const atk of DB.TYPES) {
    const m = DB.effectiveness(atk, tipos);
    if (m === 0) nota += h.imunidade;
    else if (m < 1) nota += h.porResistencia;
    else if (m > 1) nota += h.porFraqueza * (m > 2 ? 1.6 : 1);
  }
  return clamp(arred(nota), 0, C().notaMax);
}

/** POTÊNCIA: a soma dos atributos no nível 50 — a mesma conta que a batalha
 *  faz, então uma ficha com crescimento alto pesa aqui de verdade. */
export function notaPotencia(sp) {
  const c = C();
  let soma = 0;
  if (sp.crescimento) {
    for (const k of ["hp", "atk", "def", "spa", "spd", "spe"]) soma += DB.FUSAO.valor(sp, k, 50);
  } else {
    const b = sp.base;
    soma += Math.floor(((2 * b.hp + 16) * 50) / 100) + 60;
    for (const k of ["atk", "def", "spa", "spd", "spe"]) {
      soma += Math.floor(((2 * b[k] + 16) * 50) / 100) + 5;
    }
  }
  const k = (soma - c.potenciaPiso) / (c.potenciaTeto - c.potenciaPiso);
  return clamp(arred(k * c.notaMax), 0, c.notaMax);
}

/** AUTORIA: o que veio da sua mão. Sem ficha, é o cálculo da máquina — e eles
 *  reconhecem o cálculo da máquina de longe. */
export function notaAutoria(cabecaId, corpoId) {
  const a = C().autoria;
  const ficha = fichaDe(cabecaId, corpoId);
  if (!ficha) return clamp(a.automatico, 0, C().notaMax);
  const auto = DB.FUSAO.ficha(montarEspecieBase(cabecaId, corpoId));
  let nota = a.automatico;
  if (ficha.sprite) nota += a.desenho;
  if (ficha.nome && ficha.nome !== auto.nome) nota += a.nome;
  if (JSON.stringify(ficha.tipos || []) !== JSON.stringify(auto.tipos)) nota += a.tipos;
  if (JSON.stringify(ficha.crescimento || {}) !== JSON.stringify(auto.crescimento)) nota += a.crescimento;
  return clamp(arred(nota), 0, C().notaMax);
}

/** A fusão SEM a ficha do jogador — é com ela que a autoria se compara. */
function montarEspecieBase(cabecaId, corpoId) {
  const cab = DB.SPECIES[cabecaId], cor = DB.SPECIES[corpoId];
  const base = DB.FUSAO.stats(cab.base, cor.base);
  return { name: DB.FUSAO.nome(cab.name, cor.name), types: DB.FUSAO.tipos(cab, cor), base };
}

/** A ficha de julgamento de uma dupla: espécie montada + as três notas. */
export function julgar(cabecaId, corpoId, variante = "") {
  const sp = montarEspecie(cabecaId, corpoId, variante);
  if (!sp) return null;
  DB.SPECIES[sp.id] = sp;        // o palco desenha o sprite dela na hora
  const notas = {
    harmonia: notaHarmonia(sp.types),
    potencia: notaPotencia(sp),
    autoria: notaAutoria(cabecaId, corpoId),
  };
  const total = arred(notas.harmonia + notas.potencia + notas.autoria);
  return { sp, notas, total };
}

/** Faixa da fala do jurado pra aquela nota. */
export const faixa = (nota) => (nota >= C().notaMax * 0.7 ? "alto" : nota >= C().notaMax * 0.4 ? "medio" : "baixo");

/** Sorteia os rivais desta rodada e julga cada um. O empurrão por insígnia
 *  entra como nota extra, dividida entre os três jurados. */
export function sortearRivais(state, quantos = C().quantosRivais) {
  const lista = [...C().rivais];
  const insignias = (state?.badges || []).length;
  const escolhidos = [];
  while (escolhidos.length < quantos && lista.length) {
    const r = lista.splice(Math.floor(Math.random() * lista.length), 1)[0];
    if (!DB.SPECIES[r.cabeca] || !DB.SPECIES[r.corpo]) continue;
    const j = julgar(r.cabeca, r.corpo);
    if (!j) continue;
    const empurrao = insignias * 0.35 + Math.random() * 1.5;
    for (const k of Object.keys(j.notas)) {
      j.notas[k] = Math.min(C().notaMax, arred(j.notas[k] + empurrao / 3));
    }
    j.total = arred(j.notas.harmonia + j.notas.potencia + j.notas.autoria);
    escolhidos.push({ ...j, dono: r.nome, sprite: r.sprite, rival: true });
  }
  return escolhidos;
}

/** A rodada inteira: os rivais, você, e a ordem final. Você entra por último —
 *  é o concurso, não uma fila. */
export function rodada(state, minhaEntrada) {
  const rivais = sortearRivais(state);
  const todos = [...rivais, minhaEntrada];
  const ordem = [...todos].sort((a, b) => b.total - a.total);
  return { entradas: todos, ordem, colocacao: ordem.indexOf(minhaEntrada) + 1 };
}

/** O prêmio daquela colocação (o item do 1º lugar só na primeira vitória). */
export function premio(state, colocacao) {
  const c = C();
  const base = c.premios[colocacao - 1];
  if (!base) return c.premioForaDoPodio;
  if (colocacao === 1 && state.flags?.concursoOuro) return c.premioRepetido;
  return base;
}
