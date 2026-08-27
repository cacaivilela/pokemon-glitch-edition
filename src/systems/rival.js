// AZUL — a parte viva. As falas, os lugares e os times estão em
// src/data/rival.js.
//
// Ele não é um NPC escrito no mapa: é montado na hora, como o DEOXYS da ilha.
// Assim ele aparece só quando é a vez dele (o lugar certo, as insígnias certas)
// e some quando já foi vencido — sem precisar de um NPC morto em cinco mapas
// esperando a hora de acordar.
import { DB } from "../data/index.js";
import { garantirEspecie, idFusao, partes } from "./fusao.js";
import { todosGuardados } from "./box.js";

const cfg = () => DB.RIVAL || {};

/** Qual foi o SEU inicial.
 *
 *  Normalmente está gravado (`flags.meuInicial`, escrito na hora da escolha).
 *  Um save começado antes dessa marca existir não tem nada ali — e era isso que
 *  quebrava a primeira batalha do AZUL: sem o seu inicial ele não tinha o dele,
 *  e ia pro combate com um Pokémon vazio. Então, faltando a marca, o jogo
 *  DESCOBRE olhando quem você tem: equipe e PC, contando os dois lados de cada
 *  fusão — um CHARIZARD fundido continua dizendo que você começou com
 *  CHARMANDER. */
function meuInicial(st) {
  if (st?.flags?.meuInicial) return st.flags.meuInicial;
  const linhas = cfg().linhas || {};
  const vistos = [];
  for (const mon of [...(st?.party || []), ...todosGuardados(st)]) {
    const p = partes(mon.species);
    vistos.push(...(p ? [p.cabeca, p.corpo] : [mon.megaDe || mon.species]));
  }
  for (const id of Object.keys(st?.caught || {})) vistos.push(id);
  for (const [base, linha] of Object.entries(linhas)) {
    if (vistos.some((id) => linha.includes(id))) {
      (st.flags ||= {}).meuInicial = base;      // achou: grava, e nunca mais procura
      return base;
    }
  }
  return null;
}

/** O inicial dele. Ele escolhe o que PERDE pro seu achando que ganha, e a
 *  escolha fica gravada no save — se um dia a tabela mudar, o AZUL daquela
 *  partida continua com o bicho que ele já tinha. */
/** O QUE PERDE PRO SEU, quando você começou fora de Kanto.
 *
 *  A tabela `escolhe` só conhece os três de Kanto, e desde que dá pra começar
 *  com um FUECOCO ou um ROWLET (src/data/iniciais.js) ela deixaria o AZUL SEM
 *  POKÉMON — ele simplesmente não apareceria, e o rival é metade da história.
 *
 *  A REGRA É A MESMA QUE A TABELA ESCREVE À MÃO, E ELA É AO CONTRÁRIO DO QUE
 *  PARECE: ele pega o que PERDE pro seu, convencido de que fez a conta certa.
 *  É a piada que sustenta o personagem (o cabeçalho de src/data/rival.js
 *  explica), então um atalho que "corrigisse" isso pra escolha esperta faria o
 *  AZUL de fora de Kanto ser um AZUL diferente do de Kanto.
 *
 *  Os três de toda região são PLANTA, FOGO e ÁGUA nessa ordem, e nessa roda
 *  cada um ganha do ANTERIOR — então o que perde pro seu é o anterior a ele. */
function perdeProMeu(id) {
  const r = (DB.REGIOES || []).find((x) => x.mons.includes(id));
  if (!r) return null;
  const i = r.mons.indexOf(id);
  return r.mons[(i + r.mons.length - 1) % r.mons.length];
}

export function inicialDoRival(st) {
  if (st?.flags?.rivalInicial) return st.flags.rivalInicial;
  const meu = meuInicial(st);
  const dele = cfg().escolhe?.[meu] || perdeProMeu(meu);
  if (!dele) return null;
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
      const forma = formaDoInicial(st);
      // sem inicial não dá pra montar o time dele: melhor o AZUL não aparecer
      // do que aparecer com um lugar vazio e derrubar a batalha
      if (forma && DB.SPECIES[forma]) out.push({ ...p, id: forma });
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
  if (!inicialDoRival(st)) return null;     // sem inicial dele, não tem rival
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
