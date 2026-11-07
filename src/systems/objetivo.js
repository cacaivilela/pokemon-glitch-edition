// O OBJETIVO: o próximo passo da história, numa frase.
//
// Aparece no canto de cima quando você fica parado (src/scenes/overworld.js,
// `drawObjetivo`). É lido do estado, e não guardado: cada flag que a história
// já grava diz em que ponto você está, e a frase sai daí. Uma frase gravada
// no save envelheceria no primeiro caminho que a história ganhasse.
//
// A região é a do mapa em que você está: em Braglitch, a história de lá; em
// qualquer outro lugar, a de Kanto. Quem vai e volta de barco vê as duas.
import { DB } from "../data/index.js";
import { ilhas, ilhaEntregue, ilhaCompleta, formasPegas } from "./ilhas.js";

/** A frase do objetivo agora, ou null quando não há o que dizer. `regiao` é
 *  a do mapa ("kanto" ou "braglitch" — `regiaoDoMapa` em
 *  src/systems/regionais.js; `true` ainda vale por "braglitch"). */
export function objetivoAtual(st, regiao) {
  if (!st?.flags) return null;
  // um DLC com história própria fala primeiro (`DB.OBJETIVO_DLC(st, regiao)`;
  // null devolve a vez pra história da região — dlc/extrema.js)
  const doDlc = DB.OBJETIVO_DLC?.(st, regiao);
  if (doDlc) return doDlc;
  // KALOS (src/data/kalos.js): a Z-A ROYALE e a história da LUMIOSE
  if (regiao === "kalos") return DB.OBJETIVO_KALOS?.(st) ?? null;
  if (regiao === true || regiao === "braglitch") return objetivoBraglitch(st);
  return objetivoKanto(st);
}

function objetivoKanto(st) {
  const f = st.flags;
  if (!f.starterChosen) return "VÁ AO LABORATÓRIO DO PROF. CARVALHO, NO SUL DA CIDADE DE PALLET.";
  if (f.caughtMissingno) return "KANTO ESTÁ EM PAZ. AGORA É COMPLETAR A POKÉDEX!";
  if (f.glitchWorld) return "O MUNDO QUEBROU. PEGUE A GLITCHBALL COM O PROF. CARVALHO E CAPTURE O MISSINGNO.";
  if (st.mission) return "VOCÊ ESTÁ NA FENDA. EXPLORE E VOLTE PELO PORTAL.";
  if (f.oakPending) return "VOLTE AO LABORATÓRIO DO PROF. CARVALHO: ELE TEM NOVIDADES.";
  if (f.missionReady) return "FALE COM O PROF. CARVALHO PRA ENTRAR NA FENDA.";
  const zyg = dicaZygarde(st);
  if (zyg) return zyg;
  const tem = st.badges || [];
  const prox = (DB.STORY?.badges || []).find((b) => !tem.includes(b.id));
  if (!prox) return "AS OITO INSÍGNIAS! VOLTE AO PROF. CARVALHO.";
  return `PRÓXIMO GINÁSIO: CIDADE DE ${prox.city} (${prox.name}).`;
}

/** A CAÇADA DO ZYGARDE (src/data/extra.js, ZYGARDE_CACADA): onde ele está
 *  agora. Depois que ele foge vale em qualquer lugar (ele é o que você está
 *  caçando); antes, só no TÚNEL ROCHA e na ROTA 10, pra não tapar o ginásio. */
function dicaZygarde(st) {
  const Z = DB.ZYGARDE_CACADA;
  if (!Z || st.missoes?.[Z.missao]?.estado !== "ativa" || st.caught?.zygardecompleto) return null;
  const e = st.flags.zygEtapa || 0, p = Z.etapas[e];
  if (!p?.dica) return null;
  if (e === 0 && !Z.etapas.some((x) => x.mapa === st.player?.map)) return null;
  return p.dica;
}

function objetivoBraglitch(st) {
  const f = st.flags;
  if (!f.starterChosen) return "VÁ AO LAB DA PROFA. IPÊ, O PRÉDIO BRANCO DE SÃO LUCARIO DO SUL.";
  // o MISSINGNO chegou: isso passa na frente das ilhas — é o que mudou no
  // mundo inteiro de lá (src/systems/regionais.js)
  if (f.bragGlitch && !f.bragMissingnoVencido) return "O MISSINGNO CHEGOU EM BRAGLITCH: AQUI O GLITCH NÃO VIRA MAIS LENDA.";
  if (!f.bragMissao) return "FALE COM A PROFA. IPÊ NO LABORATÓRIO DELA.";
  // AS ILHAS (src/systems/ilhas.js): a primeira que ainda não foi entregue
  const ilha = ilhas().find((i) => !ilhaEntregue(st, i));
  if (ilha) {
    if (ilhaCompleta(st, ilha)) return `ILHA COMPLETA: ${ilha.nome}! FALE COM A PROFA. IPÊ NA LANCHA.`;
    if (st.player?.map !== ilha.id) return `PRÓXIMA ILHA: ${ilha.nome}. A PROFA. IPÊ TE LEVA NA LANCHA, NO PÍER.`;
    const n = formasPegas(st, ilha), t = ilha.formas.length;
    return `${ilha.nome}: VENÇA O CHEFE DA ILHA. (FORMAS -BRAG: ${n}/${t})`;
  }
  if (!f.bragIlhasFim) return "AS OITO ILHAS! FALE COM A PROFA. IPÊ NA LANCHA.";
  const lendas = (DB.LENDAS_BRAG || []).filter((l) => !st.caught?.[l.id]
    && (l.requer?.pegos || []).every((id) => st.caught?.[id]));   // só as que já apareceram
  if (lendas.length) {
    const nomes = lendas.map((l) => DB.SPECIES[l.id]?.name || l.id.toUpperCase()).join(", ");
    return `AS LENDAS ESTÃO SOLTAS NAS ESTRADAS: ${nomes}.`;
  }
  return "BRAGLITCH INTEIRA É SUA. AGORA É COMPLETAR A POKÉDEX!";
}
