// SEGURAR A TAMPA — TÉCNICA SECRETA. Nada na tela fala dela. A bola fechou
// com o bicho dentro: segurar o A põe a sua mão em cima da parte de cima, e a
// chance sobe um tico.
//
// O jeito esperto: logo antes de cada chacoalhada tem uma pausinha — é ali que
// o bicho vai empurrar. Quem SOLTA e APERTA DE NOVO nessa pausa dá um APERTÃO
// (a bola amassa e solta estrelinha) e ajuda mais.
//
// É AJUDA, não é o que decide: cada chacoalhada que ia falhar ganha um
// sorteio pequeno a mais. Quem não sabe da técnica pega igual sempre pegou.

export const TAMPA = {
  segurando: 0.08,    // chance de salvar a chacoalhada só com a mão em cima
  apertao: 0.18,      // apertou o A na pausinha antes da chacoalhada
  janela: 0.2,        // segundos da pausinha (é quando vale o apertão)
};

/** Como a mão estava quando o bicho empurrou: "apertao", "segurando" ou null. */
export function jeitoDaMao(segura, apertouEm, sinalEm) {
  if (apertouEm != null && apertouEm >= sinalEm) return "apertao";
  return segura ? "segurando" : null;
}

/** Chance da mão salvar uma chacoalhada que ia falhar. */
export const ajudaDaMao = (jeito) => TAMPA[jeito] || 0;
