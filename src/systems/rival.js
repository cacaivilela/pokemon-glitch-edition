// AZUL — a parte viva. As falas, os lugares e os times estão em
// src/data/rival.js.
//
// Ele não é um NPC escrito no mapa: é montado na hora, como o DEOXYS da ilha.
// Assim ele aparece só quando é a vez dele (o lugar certo, as insígnias certas)
// e some quando já foi vencido — sem precisar de um NPC morto em cinco mapas
// esperando a hora de acordar.
import { DB } from "../data/index.js";
import { garantirEspecie, idFusao } from "./fusao.js";

const cfg = () => DB.RIVAL || {};

/** O inicial dele. Ele escolhe o que PERDE pro seu achando que ganha, e a
 *  escolha fica gravada no save — se um dia a tabela mudar, o AZUL daquela
 *  partida continua com o bicho que ele já tinha. */
export function inicialDoRival(st) {
  if (st?.flags?.rivalInicial) return st.flags.rivalInicial;
  const meu = st?.flags?.meuInicial;
  const dele = cfg().escolhe?.[meu];
  if (!meu || !dele) return null;
  (st.flags ||= {}).rivalInicial = dele;
  return dele;
}

/** A forma do inicial dele no momento: base, do meio ou final, conforme as
 *  insígnias — ele treina junto com você. */
function formaDoInicial(st) {
  const base = inicialDoRival(st);
  const linha = cfg().linhas?.[base];
  if (!linha) return base;
  const n = (st?.badges || []).length;
  return linha[n >= 6 ? 2 : n >= 3 ? 1 : 0] || base;
}

/** O encontro ainda vale? (o lugar é conferido fora daqui) */
function liberado(st, enc) {
  const r = enc.requer || {};
  if (r.flag && !st?.flags?.[r.flag]) return false;
  if (r.insignias && (st?.badges || []).length < r.insignias) return false;
  return true;
}

const chave = (enc) => `${enc.mapa}.rival_${enc.id}`;
export const jaVenceu = (st, enc) => !!st?.npcState?.[chave(enc)]?.defeated;

/** Monta o time: `INICIAL` vira o inicial dele na forma da vez, e
 *  `FUSAO:a+b` vira uma fusão de verdade, registrada na hora. */
export function montarTime(st, enc) {
  const out = [];
  for (const p of enc.time || []) {
    if (p.id === "INICIAL") {
      out.push({ ...p, id: formaDoInicial(st) });
      continue;
    }
    if (String(p.id).startsWith("FUSAO:")) {
      const [cabeca, corpo] = String(p.id).slice(6).split("+");
      const sp = garantirEspecie(idFusao(cabeca, corpo));
      if (sp) out.push({ ...p, id: sp.id });
      continue;                       // a dupla não existe mais: ele vem sem ela
    }
    if (DB.SPECIES[p.id]) out.push({ ...p });
  }
  return out;
}

/** O AZUL deste mapa agora: o primeiro encontro liberado, no lugar certo, que
 *  ele ainda não perdeu. Devolve um NPC pronto (ou null). */
export function rivalNpc(st) {
  const R = cfg();
  const aqui = st?.player?.map;
  if (!R.encontros || !aqui) return null;

  // na fenda, depois que o mundo bugou, ele está lá só pra conversar
  const f = R.fenda;
  if (f && f.mapa === aqui && liberado(st, f)) {
    return { id: `rival_${f.id}`, x: f.x, y: f.y, dir: f.dir || "down",
             sprite: R.sprite, lines: f.fala };
  }

  for (const enc of R.encontros) {
    if (enc.mapa !== aqui || !liberado(st, enc) || jaVenceu(st, enc)) continue;
    const time = montarTime(st, enc);
    if (!time.length) continue;
    return {
      id: `rival_${enc.id}`, x: enc.x, y: enc.y, dir: enc.dir || "down",
      sprite: R.sprite,
      lines: enc.antes,
      afterLines: enc.depois,
      trainer: { name: R.nome, prize: enc.premio || 500, sprite: R.sprite, party: time },
    };
  }
  return null;
}
