// AS HABILIDADES — a parte viva. As tabelas estão em src/data/habilidades.js.
import { DB } from "../data/index.js";
import { partes } from "./fusao.js";

/** a habilidade da espécie: escrita à mão, ou a padrão do tipo primário.
 *  Fusão usa a da cabeça; mega, a da espécie de origem. */
export function habilidadeDe(species) {
  const H = DB.HABILIDADES || {};
  const sp = DB.SPECIES?.[species];
  if (!sp) return null;
  if (sp.megaDe) return habilidadeDe(sp.megaDe);
  const p = partes(species);
  if (p) return habilidadeDe(p.cabeca);
  const id = DB.HABILIDADE_DE?.[species]
    || DB.HABILIDADE_POR_TIPO?.[sp.types?.[0]] || DB.HABILIDADE_POR_TIPO?.[sp.types?.[1]] || "regeneracao";
  return H[id] ? { id, ...H[id] } : null;
}

export const habilidadeDoMon = (mon) => (mon ? habilidadeDe(mon.species) : null);

/** O PESO da espécie, em kg (src/data/pesos.js, pela chave do sprite). Fusão
 *  pesa a média dos dois; o que não está na tabela pesa 10. MISSINGNO. pesa o
 *  que sempre pesou: 3507,2 — e o ?????????? não pesa nada, porque não é. */
export function pesoDe(species) {
  const sp = DB.SPECIES?.[species];
  if (!sp) return 10;
  if (species === "missingno") return 3507.2;
  if (species === "decamark") return 0;
  const p = partes(species);
  if (p) return (pesoDe(p.cabeca) + pesoDe(p.corpo)) / 2;
  const chave = sp.spriteDex || sp.dex;
  return DB.PESOS?.[chave] ?? (sp.megaDe ? pesoDe(sp.megaDe) : 10);
}

/** multiplicador de dano do clima no tipo do golpe (chuva/sol) */
export function fatorDoClima(mv, clima) {
  if (clima === "chuva") return mv.type === "ÁGUA" ? 1.5 : mv.type === "FOGO" ? 0.5 : 1;
  if (clima === "sol") return mv.type === "FOGO" ? 1.5 : mv.type === "ÁGUA" ? 0.5 : 1;
  return 1;
}

/** Tudo que as habilidades dos dois lados fazem com este golpe:
 *  { mult, imune, cura, anuncia }. A CHUVA DE LAVA entra no lugar do 0,5x da
 *  chuva, não em cima dele — senão "3x" seria 1,5x. */
export function efeitoNoGolpe(mv, user, target, clima) {
  const hu = habilidadeDoMon(user), ht = habilidadeDoMon(target);
  const out = { mult: 1, imune: false, cura: 0, anuncia: null, hab: null, extra: 0 };
  if (ht?.imune?.includes(mv.type) && mv.power > 0) {
    return { ...out, imune: true, cura: ht.cura || 0, hab: ht };
  }
  let clim = fatorDoClima(mv, clima);
  if (hu?.dano) {
    const m = hu.dano(mv, user, target, clima);
    if (m !== 1 && hu.anuncia) {                 // a habilidade manda no clima
      out.anuncia = hu.anuncia(mv, clima);
      if (out.anuncia) clim = 1;
      out.hab = hu;
    }
    out.mult *= m;
  }
  out.mult *= clim;
  if (ht?.defesa) out.mult *= ht.defesa(mv, user, target, clima);
  // o dano somado (PAPA-MOSCA): só em golpe que causa dano, e anuncia se tiver o que
  if (hu?.extra && mv.power > 0) {
    out.extra = hu.extra(mv, user, target, clima, pesoDe(target.species));
    if (out.extra > 0 && hu.anuncia && !out.anuncia) { out.anuncia = hu.anuncia(mv, clima, target); out.hab = hu; }
  }
  return out;
}

export const semCrit = (mon) => !!habilidadeDoMon(mon)?.semCrit;
export const semStatus = (mon) => !!habilidadeDoMon(mon)?.semStatus;
export const semQueda = (mon) => !!habilidadeDoMon(mon)?.semQueda;
export const fatorVelocidade = (mon, clima) => habilidadeDoMon(mon)?.velocidade?.(clima) ?? 1;

/** o que a habilidade faz ao entrar em campo: { clima } e/ou { intimidar } */
export const entrada = (mon) => habilidadeDoMon(mon)?.entrada || null;

/** quem bate com golpe físico pode ganhar status: devolve o status, ou null */
export function contato(mv, atacante, alvo) {
  const h = habilidadeDoMon(alvo);
  if (!h?.contato || mv.category !== "fisico" || atacante.status || semStatus(atacante)) return null;
  if (h.contato.status === "envenenado" && atacante.types.includes("VENENO")) return null;
  return Math.random() < h.contato.chance ? h.contato.status : null;
}

/** cura de fim de turno: fração do HP máximo, ou 0 */
export function curaDoTurno(mon, clima) {
  const h = habilidadeDoMon(mon);
  if (!h) return 0;
  let f = h.turno || 0;
  if (clima === "chuva") f += h.turnoNaChuva || 0;
  return f;
}
