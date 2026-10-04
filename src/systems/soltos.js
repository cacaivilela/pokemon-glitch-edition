// OS POKÉMON SOLTOS. Soltar (na equipe ou no PC, src/scenes/overworld.js) não
// apaga o bicho: ele vai morar no mato do último lugar ao ar livre em que você
// estava, e fica guardado em `st.soltos` — o MESMO bicho, com apelido, nível,
// golpes, cor e tudo. No mato daquele lugar, às vezes quem nasce é ele
// (`soltoParaNascer`), e dá pra capturar de novo.
//
// O jogo guarda os 30 mais recentes; soltar o 31º apaga o mais antigo de vez.
import { DB } from "../data/index.js";

export const MAX_SOLTOS = 30;

/** Guarda o bicho como solto naquele mapa. Devolve o que caiu do fim da fila
 *  (o mais antigo, se passou de 30), ou null. */
export function soltar(st, mon, mapa) {
  mon.soltoId = `${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;
  mon.trunfo = false;
  (st.soltos ||= []).push({ mon, mapa, quando: Date.now() });
  let caiu = null;
  while (st.soltos.length > MAX_SOLTOS) caiu = st.soltos.shift();
  return caiu;
}

/** Pra onde vai quem é solto agora: este mapa, se tem mato; senão o último
 *  lugar ao ar livre com mato em que você esteve. */
export function lugarDoSolto(st, mapa) {
  const temMato = (m) => (DB.MAPS[m]?.encounters || []).length > 0;
  if (temMato(mapa)) return mapa;
  if (st.ultimoComMato && temMato(st.ultimoComMato)) return st.ultimoComMato;
  return DB.START_MAP;
}

/** Às vezes, no mato deste mapa, nasce um bicho que você soltou aqui (um que
 *  não esteja já andando por perto). Ele volta curado. */
export function soltoParaNascer(st, mapa, presentes = new Set()) {
  const daqui = (st.soltos || []).filter((s) => s.mapa === mapa && !presentes.has(s.mon.soltoId));
  if (!daqui.length || Math.random() >= (DB.CONFIG?.soltoChance ?? 0.2)) return null;
  const s = daqui[Math.floor(Math.random() * daqui.length)];
  s.mon.hp = s.mon.maxHp;
  s.mon.status = null;
  return s.mon;
}

/** Quem foi capturado de volta sai da lista de soltos. */
export function limparRecapturados(st) {
  if (!st.soltos?.length) return;
  const meus = new Set([...(st.party || []), ...(st.box || [])].map((m) => m?.soltoId).filter(Boolean));
  st.soltos = st.soltos.filter((s) => !meus.has(s.mon.soltoId));
}
