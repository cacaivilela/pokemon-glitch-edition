import { PESO_MAXIMO } from "../data/pesos.js";
// AS HABILIDADES — a parte viva. As tabelas estão em src/data/habilidades.js.
import { DB } from "../data/index.js";
import { partes } from "./fusao.js";

/** AS HABILIDADES QUE A ESPÉCIE PODE TER (de 1 a 3, ids de DB.HABILIDADES):
 *  - escrita à mão como LISTA em HABILIDADE_DE: é exatamente ela (o QUAQUAVAL:
 *    TORRENTE ou AUTOCONFIANÇA);
 *  - escrita à mão como UMA só: ela, mais a padrão de cada tipo da espécie —
 *    menos as de ASSINATURA (as inventadas, que são a marca do bicho: ficam sozinhas);
 *  - sem nada escrito: a padrão de cada tipo.
 *  Fusão (nov/2026): as habilidades de TODOS que entraram nela, uma de cada
 *  por vez (cabeça, corpo, pernas), até 3; mega, a da espécie de origem. */
export function habilidadesDe(species) {
  const H = DB.HABILIDADES || {};
  const sp = DB.SPECIES?.[species];
  if (!sp) return [];
  if (sp.megaDe) return habilidadesDe(sp.megaDe);
  const p = partes(species);
  if (p) {
    const listas = [p.cabeca, p.corpo, p.pernas].filter(Boolean).map((id) => habilidadesDe(id));
    const out = [];
    for (let i = 0; out.length < 3 && i < 3; i++) for (const l of listas) if (l[i] && !out.includes(l[i]) && out.length < 3) out.push(l[i]);
    return out.length ? out : ["regeneracao"];
  }
  const escrita = DB.HABILIDADE_DE?.[species];
  if (Array.isArray(escrita)) return escrita.filter((id) => H[id]).slice(0, 3);
  const doTipo = (sp.types || []).map((t) => DB.HABILIDADE_POR_TIPO?.[t]).filter(Boolean);
  const lista = escrita && DB.HABILIDADE_ASSINATURA?.includes(escrita) ? [escrita] : [escrita, ...doTipo];
  const out = [...new Set(lista.filter((id) => id && H[id]))].slice(0, 3);
  return out.length ? out : ["regeneracao"];
}

const comId = (id) => (id && DB.HABILIDADES?.[id] ? { id, ...DB.HABILIDADES[id] } : null);

/** a habilidade "da espécie" (a primeira da lista) — pra quem não tem um Pokémon na mão */
export const habilidadeDe = (species) => comId(habilidadesDe(species)[0]);

/** QUAL DAS HABILIDADES ESTE POKÉMON TEM: a escolhida (`mon.habilidade`, se
 *  ainda estiver na lista da espécie dele) ou a que o SEED dele sorteia — o
 *  seed não muda na evolução, então a posição na lista também não, e os saves
 *  antigos já ganham a deles sem gravar nada. */
export function habilidadeDoMon(mon) {
  if (!mon) return null;
  const lista = habilidadesDe(mon.species);
  if (!lista.length) return null;
  if (mon.habilidade && lista.includes(mon.habilidade)) return comId(mon.habilidade);
  const s = (mon.seed ?? 0) >>> 0;
  return comId(lista[((s ^ (s >>> 16)) >>> 0) % lista.length]);
}

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
  return Math.min(PESO_MAXIMO, DB.PESOS?.[chave] ?? (sp.megaDe ? pesoDe(sp.megaDe) : 10));
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
  const hu = habilidadeDoMon(user);
  // QUEBRA-MOLDE: o golpe dele passa por cima da habilidade do alvo
  const ht = quebra(user) ? null : habilidadeDoMon(target);
  // `doAtk`/`doDef`: a habilidade de quem mudou o dano (pro aviso na tela)
  const out = { mult: 1, imune: false, cura: 0, anuncia: null, hab: null, extra: 0, doAtk: null, doDef: null };
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
    if (m !== 1) out.doAtk = hu;
    out.mult *= m;
  }
  out.mult *= clim;
  if (ht?.defesa) {
    const m = ht.defesa(mv, user, target, clima);
    if (m !== 1) out.doDef = ht;
    out.mult *= m;
  }
  // o dano somado (PAPA-MOSCA): só em golpe que causa dano, e anuncia se tiver o que
  if (hu?.extra && mv.power > 0) {
    out.extra = hu.extra(mv, user, target, clima, Math.min(PESO_MAXIMO, pesoDe(target.species) + (target.pesoExtra || 0)));
    if (out.extra > 0 && hu.anuncia && !out.anuncia) { out.anuncia = hu.anuncia(mv, clima, target); out.hab = hu; }
  }
  return out;
}

/** QUEBRA-MOLDE: os golpes de `mon` ignoram a habilidade do alvo */
export const quebra = (mon) => !!habilidadeDoMon(mon)?.quebraMolde;
// as proteções do alvo; `atacante` (opcional) com QUEBRA-MOLDE passa por cima
export const semCrit = (mon, atacante) => !quebra(atacante) && !!habilidadeDoMon(mon)?.semCrit;
export const semStatus = (mon, atacante) => !quebra(atacante) && !!habilidadeDoMon(mon)?.semStatus;
export const semQueda = (mon, atacante) => !quebra(atacante) && !!habilidadeDoMon(mon)?.semQueda;

/** A PRECISÃO com as habilidades dos dois: { sempre, mult } — SEM GUARDA de
 *  qualquer um dos dois acerta sempre; OLHOS COMPOSTOS multiplica. E a
 *  habilidade que agiu, pro aviso (ou null). */
export function precisao(user, target) {
  const hu = habilidadeDoMon(user), ht = habilidadeDoMon(target);
  if (hu?.semGuarda) return { sempre: true, mult: 1, hab: hu, dono: user };
  if (ht?.semGuarda) return { sempre: true, mult: 1, hab: ht, dono: target };
  if (hu?.mira) return { sempre: false, mult: hu.mira, hab: hu, dono: user };
  return { sempre: false, mult: 1, hab: null, dono: null };
}

/** ROBUSTEZ: com o HP cheio, o golpe que ia derrubar deixa 1. Devolve o dano
 *  que fica (e se segurou). QUEBRA-MOLDE passa por cima. */
export function robustez(alvo, atacante, dano) {
  const h = habilidadeDoMon(alvo);
  if (!h?.robustez || quebra(atacante) || alvo.hp < alvo.maxHp || dano < alvo.hp) return { dano, segurou: false };
  return { dano: alvo.hp - 1, segurou: true, hab: h };
}

/** AUTOCONFIANÇA / FERA SUPREMA: `user` derrubou alguém. Sobe o atributo e
 *  devolve { hab, chave, nome } (ou null). */
export function aoDerrubar(user, stages) {
  const h = habilidadeDoMon(user);
  if (!h?.aoDerrubar || !stages || !user || user.hp <= 0) return null;
  let chave = h.aoDerrubar;
  if (chave === "maior") {
    chave = ["atk", "def", "spa", "spd", "spe"].reduce((a, b) => ((user.stats?.[b] || 0) > (user.stats?.[a] || 0) ? b : a), "atk");
  }
  const antes = stages[chave] || 0;
  stages[chave] = Math.min(6, antes + 1);
  if (stages[chave] === antes) return null;
  return { hab: h, chave, nome: NOME_ATRIBUTO[chave] };
}
export const NOME_ATRIBUTO = { atk: "ATAQUE", def: "DEFESA", spa: "ATAQUE ESP.", spd: "DEFESA ESP.", spe: "VELOCIDADE" };

/** ACELERAR: no fim do turno, o atributo sobe. Devolve { hab, chave, nome } ou null. */
export function fimDoTurno(mon, stages) {
  const h = habilidadeDoMon(mon);
  if (!h?.fimDoTurno || !stages || !mon || mon.hp <= 0) return null;
  const [chave, n] = Object.entries(h.fimDoTurno)[0];
  const antes = stages[chave] || 0;
  stages[chave] = Math.max(-6, Math.min(6, antes + n));
  if (stages[chave] === antes) return null;
  return { hab: h, chave, nome: NOME_ATRIBUTO[chave] };
}

/** PELE ÁSPERA: quem encostou (golpe físico) perde essa fração do HP. Devolve
 *  o dano (0 = nada) e a habilidade. */
export function peleAspera(mv, atacante, alvo) {
  const h = habilidadeDoMon(alvo);
  if (!h?.peleAspera || mv.category !== "fisico" || !atacante || atacante.hp <= 0) return { dano: 0 };
  return { dano: Math.max(1, Math.floor(atacante.maxHp * h.peleAspera)), hab: h };
}
export const fatorVelocidade = (mon, clima) => habilidadeDoMon(mon)?.velocidade?.(clima) ?? 1;

/** Quanto o FICA! soma na chance de captura: 25% do nível de quem está em
 *  campo (nível 40 = 0,10). Zero pra quem não tem a habilidade ou desmaiou. */
export function bonusFica(mon) {
  const h = habilidadeDoMon(mon);
  if (!h?.fica || !mon || mon.hp <= 0) return 0;
  return Math.min(1, (mon.level * h.fica) / 100);
}

/** O FICA! na hora da bola: `pBola` é a chance que a bola tinha sozinha. O
 *  bônus SOMA nela (30% + 10% = 40%). Como ele só é sorteado quando a bola já
 *  falhou, o sorteio usa bônus / (1 - pBola) — que dá exatamente a soma. */
export function ficaNaBola(mon, pBola = 0) {
  const e = bonusFica(mon);
  if (!e) return false;
  if (pBola >= 1) return true;
  return Math.random() < Math.min(1, e / (1 - pBola));
}

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
