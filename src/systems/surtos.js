// OS SURTOS EM MASSA (pedido do CAIO, nov/2026: "adicione os surtos em massa"),
// como no LEGENDS ARCEUS e no SCARLET/VIOLET: de tempos em tempos, num mapa com
// mato PERTO DE VOCÊ (quase sempre o mapa onde você está ou um vizinho; raro, a
// dois mapas — o CAIO: "é sempre perto de onde vc tá... é raro tar a 2 mapas"),
// UMA ESPÉCIE de lá aparece aos montes: quase todo bicho que nasce no mato é ela,
// nascendo mais depressa, e com a chance de SHINY 8 vezes maior. Vencer ou pegar
// QUARENTA acaba com o surto; se ninguém mexer, ele passa sozinho em 30 minutos.
//
// O estado mora no save (`st.surto`: { mapa, especie, restam, ate }) e o próximo
// começa sozinho depois de um tempo (`st.surtoDepois`). Quem usa: src/scenes/
// overworld.js (nascer, avisar) e src/scenes/battle.js (`contarSurto`).
import { DB } from "../data/index.js";

export const SURTO = {
  quantos: 40,                     // vencidos ou pegos pra acabar
  dura: 30 * 60 * 1000,            // ou acaba sozinho depois disso
  intervalo: [4, 9],               // minutos até o próximo começar
  daEspecie: 0.85,                 // no mapa do surto, quase todo nascimento é dele
  sorteShiny: 8,                   // a chance de shiny dele é 8x maior
  doisMapas: 0.15,                 // raro: o surto a DOIS mapas de você
  textos: {
    comecou: "SURTO EM MASSA! MUITOS {MON} APARECERAM EM {LUGAR}!",
    aqui: "SURTO EM MASSA AQUI: {MON} POR TODO LADO! (FALTAM {N})",
    acabou: "O SURTO DE {MON} ACABOU!",
    falta: "SURTO: FALTAM {N} {MON}.",
  },
};

const agora = () => Date.now();

/** o surto que está valendo agora (ou null: e se passou da hora, ele acaba) */
export function surtoAtivo(st) {
  const s = st?.surto;
  if (!s) return null;
  // (passou da hora, o mapa sumiu, ou é um bicho que não pode ter surto — o de
  // DECAMARK que começou antes da regra: acaba)
  if (agora() > s.ate || !DB.MAPS[s.mapa] || !podeTerSurto(s.especie)) { st.surto = null; st.surtoDepois = agora() + espera(); return null; }
  return s;
}

const espera = () => (SURTO.intervalo[0] + Math.random() * (SURTO.intervalo[1] - SURTO.intervalo[0])) * 60000;

/** os mapas a 0, 1 e 2 passos do mapa `de`, pelas ligações dos mapas (a borda
 *  de um leva no outro) */
function vizinhanca(de) {
  const dist = new Map([[de, 0]]), fila = [de];
  while (fila.length) {
    const m = fila.shift(), d = dist.get(m);
    if (d >= 2) continue;
    for (const c of DB.KANTO?.[m]?.connections || []) {
      if (!c.to || dist.has(c.to)) continue;
      dist.set(c.to, d + 1); fila.push(c.to);
    }
  }
  return dist;
}

/** essa espécie pode ter SURTO? Bicho comum, sim. O raro, o secreto e o
 *  quebrado não (o DECAMARK, "??????????", apareceu num surto: o CAIO achou
 *  estranho): nem lendário, nem GLITCH, nem MISSINGNO., nem fusão, nem o que é
 *  difícil de pegar (catchRate 3, o dos lendários) */
function podeTerSurto(id) {
  const sp = DB.SPECIES[id];
  if (!sp || sp.fusao || sp.hack || sp.secreto || sp.lenda || sp.paradoxo) return false;
  if (id === "decamark" || id.startsWith("missingno") || (sp.types || []).includes("GLITCH")) return false;
  if ((sp.catchRate ?? 255) <= 3 || /\?/.test(sp.name || "")) return false;
  return true;
}

/** dá pra ter surto nesse mapa? (tem mato com bicho comum, e não é a fenda) */
const temMato = (m) => m !== "glitchdim" && (DB.MAPS[m]?.encounters || []).some((e) => podeTerSurto(e.id));

/** Começa um surto perto de você, se for a hora. Devolve o surto novo (pra
 *  avisar) ou null. */
export function talvezComecarSurto(st) {
  if (!st?.player?.map || surtoAtivo(st)) return null;
  if (st.surtoDepois == null) { st.surtoDepois = agora() + espera() / 3; return null; }   // o primeiro vem mais rápido
  if (agora() < st.surtoDepois) return null;
  const dist = vizinhanca(st.player.map);
  const perto = [...dist].filter(([m, d]) => d <= 1 && temMato(m)).map(([m]) => m);
  const longe = [...dist].filter(([m, d]) => d === 2 && temMato(m)).map(([m]) => m);
  const lista = (Math.random() < SURTO.doisMapas && longe.length) || !perto.length ? longe : perto;
  if (!lista.length) { st.surtoDepois = agora() + 60000; return null; }   // sem mato por perto: tenta daqui a 1 minuto
  const mapa = lista[Math.floor(Math.random() * lista.length)];
  const tabela = DB.MAPS[mapa].encounters.filter((e) => podeTerSurto(e.id));
  if (!tabela.length) { st.surtoDepois = agora() + 60000; return null; }
  const e = tabela[Math.floor(Math.random() * tabela.length)];
  st.surto = { mapa, especie: e.id, min: e.min || 5, max: e.max || e.min || 5, restam: SURTO.quantos, ate: agora() + SURTO.dura };
  return st.surto;
}

/** o nome do lugar e do bicho, pros textos */
export function textoDoSurto(chave, s, extra = {}) {
  const mon = DB.SPECIES[s.especie]?.name || s.especie.toUpperCase();
  const lugar = DB.MAPS[s.mapa]?.name || s.mapa;
  return SURTO.textos[chave].replace("{MON}", mon).replace("{LUGAR}", lugar).replace("{N}", extra.n ?? s.restam);
}

/** um bicho do surto venceu ou foi pego: conta. Devolve o texto pra batalha
 *  dizer (ou null se não era do surto). */
export function contarSurto(st, mon) {
  const s = surtoAtivo(st);
  if (!s || !mon || mon.species !== s.especie || st.player?.map !== s.mapa) return null;
  s.restam--;
  if (s.restam <= 0) {
    const t = textoDoSurto("acabou", s);
    st.surto = null; st.surtoDepois = agora() + espera();
    return t;
  }
  return s.restam % 10 === 0 ? textoDoSurto("falta", s) : null;
}
