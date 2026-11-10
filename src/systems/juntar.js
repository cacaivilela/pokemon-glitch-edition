// JUNTAR (ideia do CAIO): dois da MESMA espécie viram um só, com o melhor
// dos dois. PIPLUP SHINY + PIPLUP ALFA = PIPLUP SHINY ALFA.
// Fica no DECODIFICADOR DE GENOMA (menu JUNTAR). O PRIMEIRO escolhido é o que
// fica (nome, golpes, seed); o SEGUNDO entra nele e some — não dá pra desfazer.
import { recalc, darClarao } from "./mon.js";
import { devolvido } from "./segurar.js";

/** pode juntar: mesma espécie e não é o mesmo bicho */
export const juntavel = (a, b) => !!a && !!b && a !== b && a.species === b.species;

/** quem na equipe tem um par da mesma espécie */
export const comPar = (party) => party.filter((m) => party.some((o) => juntavel(m, o)));

/** O RESULTADO, sem mexer em ninguém (a vitrine usa pra mostrar antes) */
export function previaJunta(base, outro) {
  const r = { ...base, ivs: { ...base.ivs } };
  // a COR: o primeiro manda; se ele é comum, pega a do segundo
  if (!base.shiny && !base.luminoso) { r.shiny = !!outro.shiny; r.luminoso = !!outro.luminoso; }
  r.alfa = !!(base.alfa || outro.alfa);
  if ((outro.xp || 0) > (base.xp || 0)) { r.level = outro.level; r.xp = outro.xp; }
  for (const k of Object.keys(r.ivs)) r.ivs[k] = Math.max(r.ivs[k] ?? 0, outro.ivs?.[k] ?? 0);
  if (outro.amizade != null) r.amizade = Math.max(base.amizade || 0, outro.amizade);
  if (outro.garfo) r.garfo = true;
  if (outro.corrupt) r.corrupt = true;
  if (!base.item && outro.item) r.item = outro.item;
  return r;
}

/** O que muda no primeiro, em palavras (pra máquina falar) */
export function oQueGanhou(base, outro) {
  const p = previaJunta(base, outro), g = [];
  if (p.luminoso && !base.luminoso) g.push("LUMINOSO");
  if (p.shiny && !base.shiny) g.push("SHINY");
  if (p.alfa && !base.alfa) g.push("ALFA");
  if (p.level > base.level) g.push(`NÍVEL ${p.level}`);
  if (Object.keys(p.ivs).some((k) => p.ivs[k] > (base.ivs?.[k] ?? 0))) g.push("FORÇA ESCONDIDA");
  if (p.item && !base.item) g.push(p.item.toUpperCase());
  return g;
}

/** JUNTA DE VERDADE: o primeiro recebe tudo, o segundo sai da equipe.
 *  O item do segundo, se o primeiro já segura um, volta pra mochila. */
export function juntar(st, base, outro) {
  if (!juntavel(base, outro)) return null;
  const ganhou = oQueGanhou(base, outro);
  const p = previaJunta(base, outro);
  const pct = base.maxHp ? base.hp / base.maxHp : 1;
  Object.assign(base, {
    shiny: p.shiny, luminoso: p.luminoso, alfa: p.alfa,
    level: p.level, xp: p.xp, ivs: p.ivs,
  });
  if (p.amizade != null) base.amizade = p.amizade;
  if (p.garfo) base.garfo = true;
  if (p.corrupt) base.corrupt = true;
  if (outro.item) {
    if (!base.item) base.item = outro.item;
    else { const it = devolvido(outro, outro.item); st.items[it] = (st.items[it] || 0) + 1; }
  }
  recalc(base);
  base.hp = Math.max(1, Math.round(base.maxHp * pct));
  darClarao(base);                        // virou LUMINOSO: aprende o clarão
  const i = st.party.indexOf(outro);
  if (i >= 0) st.party.splice(i, 1);
  return ganhou;
}
