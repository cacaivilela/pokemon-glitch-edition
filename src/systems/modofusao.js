// O MODO FUSÃO (pedido do CAIO, nov/2026: "uma opção de início de save que pode
// ser mudada" — `st.flags.modoFusao`, a 4ª pergunta do jogo novo e OPÇÕES →
// MODO FUSÃO). Ligado: todo Pokémon SELVAGEM nasce fundido com outro do mesmo
// lugar (ou um qualquer, se o lugar só tem ele), e o INICIAL se funde com um
// Pokémon surpresa. Quem é a CABEÇA e quem é o CORPO é sorteado.
import { DB } from "../data/index.js";
import { createMon } from "./mon.js";
import { fundir, ehFusao } from "./fusao.js";
import { LENDARIOS } from "../data/leilao.js";
import { RAROS } from "../data/forasteiros.js";

/** é ESTÁGIO 0? (não é evolução de ninguém) */
export function ehBasico(id) {
  return !Object.values(DB.EVOLUTIONS || {}).some((regras) => regras.some((r) => r.to === id));
}

/** um Pokémon qualquer pra fundir: espécie de verdade (sem lendário, mega, forma, fusão ou glitch) */
export function especieSurpresa(excluir = null, soBasico = false) {
  // `soBasico` (o INICIAL, pedido do CAIO): só ESTÁGIO 0 — quem não é evolução de ninguém
  const evoluidos = soBasico ? new Set(Object.values(DB.EVOLUTIONS || {}).flat().map((r) => r.to)) : null;
  const lista = Object.values(DB.SPECIES || {}).filter((sp) => sp.dex > 0 && sp.dex <= 1025 && !sp.fusao
    && sp.id !== excluir && !LENDARIOS.has(sp.id) && !RAROS.has(sp.id) && !/mega|gmax|totem|alola|galar|hisui|paldea|brag|vinculo|carnaval|-/.test(sp.id)
    && !(sp.types || []).includes("GLITCH") && !(sp.spriteDex && sp.spriteDex !== sp.dex) && (sp.bst || 0) < 580
    && !(evoluidos && evoluidos.has(sp.id)) && /^[A-ZÀ-Ú]/.test(String(sp.name || "")));
  return lista.length ? lista[Math.floor(Math.random() * lista.length)].id : null;
}

/** dá pra fundir com ele? Só Pokémon DE VERDADE: com número, com nome de letras
 *  (o "?RATTATA" e o "PIDGEY" verde eram um parceiro sem nome nem desenho — um
 *  bicho de pacote que ainda não tinha chegado) */
export const parceiroValido = (id) => {
  const sp = DB.SPECIES[id];
  // (os da fenda, tipo GLITCH, também valem — o que não vale é bicho sem número nem nome)
  return !!sp && sp.dex > 0 && sp.dex <= 1025 && !sp.fusao && /^[A-ZÀ-Ú]/.test(String(sp.name || "")) && !LENDARIOS.has(id);
};

/** funde `mon` com `outroId` (no mesmo nível); se não der, devolve o `mon` mesmo */
export function fundirCom(mon, outroId) {
  if (!mon || !outroId || ehFusao(mon) || !parceiroValido(outroId) || !parceiroValido(mon.species) || outroId === mon.species) return mon;
  const outro = createMon(outroId, mon.level || 5);
  const [cabeca, corpo] = Math.random() < 0.5 ? [mon, outro] : [outro, mon];
  const f = fundir(cabeca, corpo);
  if (!f) return mon;
  if (mon.alfa) f.alfa = true;
  if (mon.mini) { f.mini = true; f.nickname = `MINI ${f.nickname}`; }
  return f;
}

/** o selvagem do MODO FUSÃO: o parceiro sai da tabela do lugar */
export function fundirSelvagem(st, mon, tabela = []) {
  if (!st?.flags?.modoFusao || !mon || ehFusao(mon) || mon.soltoId) return mon;
  const outros = (tabela || []).map((e) => e.id).filter((id) => id !== mon.species && parceiroValido(id));
  const outroId = outros.length ? outros[Math.floor(Math.random() * outros.length)] : especieSurpresa(mon.species);
  return fundirCom(mon, outroId);
}
