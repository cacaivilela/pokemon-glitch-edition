// SIDE QUESTS — a parte viva. Os pedidos estão em src/data/missoes.js.
//
// Regra que decidiu o desenho todo: nenhuma missão precisa de gatilho espalhado
// pelo jogo. Cada objetivo é uma PERGUNTA que se responde olhando o save agora
// — "você tem um MAGIKARP?", "você já capturou cinco insetos diferentes?" — e
// ela é feita quando você fala com o NPC ou abre o diário. Assim dá pra
// cumprir uma missão sem saber que ela existe, aceitar depois e entregar na
// hora; e nada quebra se o save vier de uma versão anterior.
import { DB } from "../data/index.js";
import { todosGuardados } from "./box.js";
import { partes } from "./fusao.js";

/** Todo mundo que está com você: equipe + PC. */
const todos = (st) => [...(st?.party || []), ...todosGuardados(st)];

/** { feito, atual, alvo } de cada tipo de objetivo. `alvo` maior que 1 vira
 *  contador no diário ("3/5"). */
const OBJETIVOS = {
  /** tem essa espécie com você (a fusão conta pelos dois lados dela) */
  "tem-especie": (st, o) => {
    const tem = todos(st).some((m) => {
      if (m.species === o.especie) return true;
      const p = partes(m.species);
      return p && (p.cabeca === o.especie || p.corpo === o.especie);
    });
    return { feito: tem, atual: tem ? 1 : 0, alvo: 1 };
  },

  /** capturada de verdade (registrada na Pokédex), não só vista */
  "capturou-especie": (st, o) => {
    const tem = !!st?.caught?.[o.especie];
    return { feito: tem, atual: tem ? 1 : 0, alvo: 1 };
  },

  /** uma de cada linhagem, ao mesmo tempo */
  "tem-linhagens": (st, o) => {
    const donos = new Set(todos(st).flatMap((m) => {
      const p = partes(m.species);
      return p ? [p.cabeca, p.corpo] : [m.megaDe || m.species];
    }));
    const n = (o.linhagens || []).filter((linha) => linha.some((id) => donos.has(id))).length;
    return { feito: n >= (o.linhagens || []).length, atual: n, alvo: (o.linhagens || []).length };
  },

  /** qualquer fusão pronta com você */
  "tem-fusao": (st) => {
    const tem = todos(st).some((m) => partes(m.species));
    return { feito: tem, atual: tem ? 1 : 0, alvo: 1 };
  },

  /** uma ficha da oficina, com desenho seu */
  "tem-ficha-desenhada": (st) => {
    const tem = Object.values(st?.fusoes || {}).some((f) => f?.sprite);
    return { feito: tem, atual: tem ? 1 : 0, alvo: 1 };
  },

  /** a melhor nota que você já tirou no concurso de Cinnabar */
  "recorde-concurso": (st, o) => {
    const r = st?.flags?.concursoRecorde || 0;
    return { feito: r >= o.nota, atual: Math.floor(r), alvo: o.nota };
  },

  /** espécies DIFERENTES daquele tipo, capturadas (repetido não conta) */
  "capturou-tipo": (st, o) => {
    const n = Object.keys(st?.caught || {})
      .filter((id) => DB.SPECIES[id]?.types?.includes(o.tipoPokemon)).length;
    return { feito: n >= o.quantos, atual: n, alvo: o.quantos };
  },

  /** espécies capturadas que não são das 151 (as da fenda) */
  "capturou-fenda": (st, o) => {
    const n = Object.keys(st?.caught || {})
      .filter((id) => DB.SPECIES[id] && !DB.GEN1[id] && !DB.SPECIES[id].mega && !partes(id)).length;
    return { feito: n >= (o.quantos || 1), atual: n, alvo: o.quantos || 1 };
  },
};

export const missaoPorId = (id) => (DB.MISSOES || []).find((m) => m.id === id) || null;

/** A missão está liberada? `requer` pode pedir insígnias e/ou outra missão
 *  entregue — é assim que as três da tempestade viram uma fila: cada uma só
 *  aparece quando a anterior já foi paga. */
export function liberada(st, missao) {
  const r = missao?.requer;
  if (!r) return true;
  if (r.insignias && (st?.badges || []).length < r.insignias) return false;
  if (r.missao && st?.missoes?.[r.missao]?.estado !== "feita") return false;
  return true;
}

/** As missões daquele MESMO NPC (mesmo mapa e mesmo tile), na ordem escrita.
 *  O marinheiro de VERMILION tem três, uma depois da outra. */
export function cadeia(missao) {
  return (DB.MISSOES || []).filter((m) => m.mapa === missao.mapa && m.x === missao.x && m.y === missao.y);
}

/** O que ESTE NPC tem pra falar agora: a primeira da fila dele que ainda não
 *  foi entregue. Devolve { missao, travada } — travada quando ela existe mas
 *  ainda não foi liberada. */
export function daVez(st, id) {
  const base = missaoPorId(id);
  if (!base) return { missao: null, travada: false };
  for (const m of cadeia(base)) {
    if (st?.missoes?.[m.id]?.estado === "feita") continue;
    return { missao: m, travada: !liberada(st, m) };
  }
  return { missao: null, travada: false };
}

/** Como está aquela missão pra este save: null (nem ofereceram), "ativa",
 *  "pronta" (feita, mas não entregue) ou "feita". */
export function estado(st, id) {
  const guardado = st?.missoes?.[id];
  if (!guardado) return null;
  if (guardado.estado === "feita") return "feita";
  return progresso(st, id).feito ? "pronta" : "ativa";
}

/** O andamento do objetivo agora, olhando o save. */
export function progresso(st, id) {
  const missao = missaoPorId(id);
  const checa = missao && OBJETIVOS[missao.objetivo?.tipo];
  if (!checa) return { feito: false, atual: 0, alvo: 1 };
  try {
    return checa(st, missao.objetivo);
  } catch {
    return { feito: false, atual: 0, alvo: 1 };   // dado velho: a missão só espera
  }
}

export function aceitar(st, id) {
  (st.missoes ||= {})[id] = { estado: "ativa", desde: Math.floor(st.playtime || 0) };
  return st.missoes[id];
}

/** Entrega: marca como feita e paga. Devolve as linhas do prêmio. */
export function entregar(st, id) {
  const missao = missaoPorId(id);
  if (!missao) return [];
  (st.missoes ||= {})[id] = { ...(st.missoes[id] || {}), estado: "feita" };
  const T = DB.MISSAO_TEXTO;
  const premio = missao.premio || {};
  const linhas = [T.feita.replace("{NOME}", missao.nome)];
  if (premio.dinheiro) {
    st.money = Math.min(999999, (st.money || 0) + premio.dinheiro);
    linhas.push(T.ganhou.replace("{DINHEIRO}", premio.dinheiro));
  }
  if (premio.item) {
    const qtd = premio.qtd || 1;
    st.items[premio.item] = Math.min(999, (st.items[premio.item] || 0) + qtd);
    linhas.push(T.ganhouItem.replace("{QTD}", qtd).replace("{ITEM}", premio.item.toUpperCase()));
  }
  return linhas;
}

/** O diário: as missões que você conhece, prontas na frente. */
export function diario(st) {
  return (DB.MISSOES || [])
    .filter((m) => liberada(st, m) || st?.missoes?.[m.id])
    .map((m) => ({ missao: m, estado: estado(st, m.id), progresso: progresso(st, m.id) }))
    .filter((l) => l.estado)
    .sort((a, b) => ordem(a.estado) - ordem(b.estado));
}

const ordem = (e) => (e === "pronta" ? 0 : e === "ativa" ? 1 : 2);

/** Quantas você já entregou (pro cabeçalho do diário). */
export const feitas = (st) =>
  (DB.MISSOES || []).filter((m) => st?.missoes?.[m.id]?.estado === "feita").length;
