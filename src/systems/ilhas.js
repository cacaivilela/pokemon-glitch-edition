// AS ILHAS DE BRAGLITCH: as regras da história de lá (src/data/braglitch-ilhas.js).
//
// Tudo aqui é lido do estado, nada é gravado: uma ilha está COMPLETA quando o
// chefe dela caiu (as 14 formas são pra descobrir, não trancam nada); ela está
// ENTREGUE quando a
// PROFA. IPÊ já soube disso — e aí o id dela (`ilha_<id>`) entra em
// `st.bragBadges`, que é o que o menu de INSÍGNIAS mostra em Braglitch.
import { DB } from "../data/index.js";

export const ilhas = () => DB.ILHAS_BRAG || [];

/** O id que a ilha entregue ganha em `st.bragBadges`. */
export const insigniaDaIlha = (ilha) => `ilha_${ilha.id}`;

/** A IPÊ já soube que esta ilha está completa. */
export const ilhaEntregue = (st, ilha) => (st?.bragBadges || []).includes(insigniaDaIlha(ilha));

/** A lancha já leva pra esta ilha: a primeira sempre, as outras depois da anterior entregue. */
export function ilhaAberta(st, ilha) {
  const i = ilhas().indexOf(ilha);
  return i === 0 || (i > 0 && ilhaEntregue(st, ilhas()[i - 1]));
}

/** A forma e tudo o que ela vira (SANDSHREW-BRAG conta pegando o SANDSLASH-BRAG também). */
function linha(id) {
  const out = [id];
  for (let k = 0; k < out.length; k++) for (const r of DB.EVO_BRAGLITCH?.[out[k]] || []) out.push(r.to);
  return out;
}

/** A forma já é sua (ela ou qualquer evolução dela). */
export const formaPega = (st, id) => linha(id).some((x) => st?.caught?.[x]);

/** Quantas das formas da ilha já são suas. */
export const formasPegas = (st, ilha) => ilha.formas.filter((id) => formaPega(st, id)).length;

/** O chefe da ilha caiu (vencido ou capturado: a batalha marca os dois). */
export const chefeVencido = (st, ilha) => !!st?.npcState?.[`${ilha.id}.chefe`]?.defeated;

/** Ilha completa = chefe vencido (ou capturado). As formas contam na Pokédex
 *  e na fala da IPÊ, mas não seguram a próxima ilha. */
export const ilhaCompleta = (st, ilha) => chefeVencido(st, ilha);

/** A ilha em que você está, ou null. */
export const ilhaDoMapa = (mapa) => ilhas().find((i) => i.id === mapa) || null;

/** As oito entregues: o fim da história de Braglitch. */
export const todasEntregues = (st) => ilhas().length > 0 && ilhas().every((i) => ilhaEntregue(st, i));
