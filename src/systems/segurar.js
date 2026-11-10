// OS ITENS DE SEGURAR — as regras (os dados estão em src/data/segurar.js).
// O item segurado é o campo `item` do Pokémon (o nome do item, como na
// mochila). A batalha (src/scenes/battle.js e src/systems/battle-engine.js)
// pergunta aqui o que cada um faz.
import { DB } from "../data/index.js";

export const seguravel = (item) => !!DB.SEGURAVEIS?.[item];
/** o que o item segurado faz ({ efeito, tipo, ... }), ou null */
export const doItem = (mon) => (mon?.item && DB.SEGURAVEIS?.[mon.item]) || null;
export const segura = (mon, efeito) => doItem(mon)?.efeito === efeito;
const C = () => DB.SEGURAR_CONFIG || {};

/** A FRASE do que o item faz: a escrita no dado, ou montada (os de tipo e as berries) */
export function descDoItem(item) {
  const d = DB.SEGURAVEIS?.[item];
  if (!d) return null;
  if (d.desc) return d.desc;
  if (d.tipo) return `OS GOLPES DE ${d.tipo} FICAM 20% MAIS FORTES.`;
  if (d.cura || d.curaPct) return "COM METADE DO HP OU MENOS, ELE COME E SE CURA.";
  if (d.status) return d.status.length > 1 ? "ELE COME SOZINHO E SE CURA DE QUALQUER PROBLEMA." : "ELE COME SOZINHO QUANDO FICA " + ({ paralisia: "PARALISADO", envenenado: "ENVENENADO", queimadura: "QUEIMADO" }[d.status[0]] || "MAL") + ".";
  return null;
}

/** A PEDRA DO TROVÃO que ficou com um FANTASMA volta ASSOMBRADA: é ela que
 *  evolui o MONSTELITO em MONSTELA (src/data/braglitch.js). FANTASMA é quem é
 *  do tipo FANTASMA ou sabe um golpe FANTASMA. */
export const PEDRA_ASSOMBRADA = "pedra do trovão assombrada";
export function ehFantasma(mon) {
  if ((DB.SPECIES?.[mon?.species]?.types || []).includes("FANTASMA")) return true;
  return (mon?.moves || []).some((m) => DB.MOVES?.[m?.id]?.type === "FANTASMA");
}
/** o item que volta pra mochila quando sai da mão deste Pokémon */
export const devolvido = (mon, it) => (it === "pedra do trovão" && ehFantasma(mon) ? PEDRA_ASSOMBRADA : it);

/** DAR PRA SEGURAR: sai 1 da mochila; o que ele segurava volta pra ela.
 *  Devolve o item velho (ou null). */
export function darItem(st, mon, item) {
  if (!(st.items[item] > 0)) return null;
  st.items[item] -= 1;
  if (st.items[item] <= 0) delete st.items[item];
  const velho = mon.item ? devolvido(mon, mon.item) : null;
  if (velho) st.items[velho] = (st.items[velho] || 0) + 1;
  mon.item = item;
  return velho;
}

/** TIRAR: volta pra mochila. Devolve o item, ou null. */
export function tirarItem(st, mon) {
  if (!mon.item) return null;
  const it = devolvido(mon, mon.item);
  st.items[it] = (st.items[it] || 0) + 1;
  delete mon.item;
  return it;
}

/** o item DO TIPO do golpe: +20% (o CARVÃO num golpe de FOGO...) */
export function bonusDoTipo(atk, mv) {
  const d = doItem(atk);
  return d?.tipo && d.tipo === mv?.type ? (C().bonusTipo ?? 1.2) : 1;
}

/** OS NOVOS DE DANO: ORBE DA VIDA (+30%), CINTO EXPERT (+20% no super
 *  efetivo), FAIXA DE FORÇA (+10% físico), ÓCULOS SÁBIOS (+10% especial) */
export function fatorDoItem(atk, mv, eff) {
  const e = doItem(atk)?.efeito;
  if (e === "orbe") return 1.3;
  if (e === "cinto") return eff > 1 ? 1.2 : 1;
  if (e === "forca") return mv?.category === "fisico" ? 1.1 : 1;
  if (e === "sabio") return mv?.category === "especial" ? 1.1 : 1;
  return 1;
}

/** DEPOIS DO GOLPE QUE ACERTOU (`dano` > 0): o ORBE DA VIDA tira 10% de quem
 *  bateu, o SINO DA CONCHA cura 1/8 do dano, o CAPACETE ROCHOSO de quem
 *  apanhou machuca quem bateu com golpe físico (1/6). Devolve as falas. */
export function depoisDoGolpe(user, target, dano, mv) {
  const T = DB.SEGURAR_TEXTO || {}, falas = [];
  const f = (t, mon) => (t || "").replace("{MON}", mon.nickname);
  if (!(dano > 0) || user.hp <= 0) return falas;
  if (segura(user, "concha") && user.hp < user.maxHp) {
    user.hp = Math.min(user.maxHp, user.hp + Math.max(1, Math.floor(dano / 8)));
    falas.push(f(T.concha, user));
  }
  if (segura(user, "orbe")) {
    user.hp = Math.max(0, user.hp - Math.max(1, Math.floor(user.maxHp / 10)));
    falas.push(f(T.orbe, user));
  }
  if (segura(target, "capacete") && mv?.category === "fisico" && user.hp > 0) {
    user.hp = Math.max(0, user.hp - Math.max(1, Math.floor(user.maxHp / 6)));
    falas.push(f(T.capacete, user));
  }
  return falas;
}

/** o item de tipo que combina com uma espécie (o primeiro tipo dela) */
export function itemDoTipo(especie) {
  const t = DB.SPECIES[especie]?.types?.[0];
  return Object.entries(DB.SEGURAVEIS || {}).find(([, d]) => d.tipo === t)?.[0] || null;
}

/** O SELVAGEM QUE JÁ VEM SEGURANDO: às vezes uma berry, às vezes o item do
 *  tipo dele. Capturou, o item vem junto. */
export function talvezSegurando(mon) {
  const c = C();
  if (!mon || mon.item || Math.random() >= (c.selvagem ?? 0)) return null;
  const bs = c.selvagemBerries || [];
  mon.item = Math.random() < (c.selvagemBerryChance ?? 0.6) && bs.length
    ? bs[Math.floor(Math.random() * bs.length)]
    : itemDoTipo(mon.species) || bs[0] || null;
  return mon.item;
}

/** OS LÍDERES seguram item: o trunfo (o último) a SITRUS, os outros o item
 *  do tipo deles */
export function itensDoLider(party) {
  party.forEach((m, i) => {
    if (m.item) return;
    m.item = i === party.length - 1 ? C().liderTrunfo || null : itemDoTipo(m.species);
  });
}

/** A BERRY SEGURADA: com HP na metade ou menos, a de cura; com o status
 *  dela, a de status. Ele come (a berry acaba). Devolve a fala, ou null. */
export function comerBerry(mon) {
  const d = doItem(mon);
  if (d?.efeito !== "berry" || !mon || mon.hp <= 0) return null;
  const T = DB.SEGURAR_TEXTO, item = mon.item.toUpperCase();
  if ((d.cura || d.curaPct) && mon.hp <= mon.maxHp / 2) {
    const n = d.cura || Math.max(1, Math.floor(mon.maxHp * d.curaPct));
    mon.hp = Math.min(mon.maxHp, mon.hp + n);
    delete mon.item;
    return T.berryCura.replace("{MON}", mon.nickname).replace("{ITEM}", item);
  }
  if (d.status && mon.status && d.status.includes(mon.status)) {
    mon.status = null;
    delete mon.item;
    return T.berryStatus.replace("{MON}", mon.nickname).replace("{ITEM}", item);
  }
  return null;
}

/** AS SOBRAS: quanto cura no fim do turno (0 = nada) */
export function curaDasSobras(mon) {
  if (!segura(mon, "sobras") || mon.hp <= 0 || mon.hp >= mon.maxHp) return 0;
  return Math.max(1, Math.floor(mon.maxHp * (C().sobras ?? 1 / 16)));
}

/** A FAIXA DO FOCO: com HP cheio, um golpe que ia derrubar deixa 1 de HP (e
 *  a faixa se gasta). Devolve o dano que fica. */
export function segurarComFoco(mon, dano) {
  if (!segura(mon, "foco") || mon.hp < mon.maxHp || dano < mon.hp) return { dano, segurou: false };
  delete mon.item;
  return { dano: mon.hp - 1, segurou: true };
}

/** A GARRA RÁPIDA brilhou nesse turno? */
export const garraBrilhou = (mon) => segura(mon, "garra") && Math.random() < (C().garra ?? 0.2);

/** o OVO DA SORTE: o fator do XP */
export const fatorXp = (mon) => (segura(mon, "xp") ? C().xp ?? 1.5 : 1);

/** a PEDRA ETERNA: não evolui por nível nem por amizade */
export const naoEvolui = (mon) => segura(mon, "eterna");

/** o SINO CALMANTE: o fator da amizade que sobe */
export const fatorAmizade = (mon) => (segura(mon, "sino") ? 2 : 1);
