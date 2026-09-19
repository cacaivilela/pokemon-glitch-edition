// DLC: REVOLTA DE DECAMARK.
//
// ?????????? é o que o cartucho mostra quando a espécie não existe: dez
// interrogações no lugar de um nome. NO JOGO SEM DLC SÓ EXISTE UM, e ele é o
// fim da história do REGISTRO 0x3F (src/data/decamark.js): a pesquisadora de
// Cinnabar, os diários da mansão, o Blaine, a fenda e a costa leste da ilha.
//
// Este pacote é a REVOLTA: ele SAIU do lugar dele. Nasce em toda rota e caverna
// de Kanto e das ilhas, sempre corrompido, e não foge — vem pra cima (BRAVOS).
// Na fenda ele mora em todo terreno, e pode ser o chefe de um rasgo. Ligar
// isto é escolher quebrar a regra do "só um" — é o mesmo tipo de escolha que o
// terminal 011GIVEGLITCH110.
//
// A espécie, o sprite, a pesquisadora e o registro moram no jogo base agora;
// aqui só fica o que a revolta acrescenta.
const DECAMARK = "decamark";

export default {
  id: "decamark",
  nome: "REVOLTA DE DECAMARK",

  // vem pra cima de você, como o BEEDRILL
  bravos: [DECAMARK],

  aplicar(DB) {
    // A REVOLTA: em todo mapa de fora (e caverna) que já tem bicho, ele entra
    // também — raro, corrompido, e no nível do lugar (a faixa da tabela dali).
    const eras = new Set((DB.ERAS || []).map((e) => e.mapa));   // outro tempo não é Kanto
    for (const [id, m] of Object.entries(DB.MAPS)) {
      const t = m.encounters;
      if (!t?.length || eras.has(id) || t.some((e) => e.id === DECAMARK)) continue;
      const min = Math.min(...t.map((e) => e.min)), max = Math.max(...t.map((e) => e.max));
      t.push({ id: DECAMARK, min: Math.max(3, min), max: Math.max(min + 4, max + 3), w: 3, corrupt: true, dlc: true });
    }
    // na fenda, em todo terreno — e por isso também na lista de chefe do rasgo
    for (const terreno of ["terra", "agua", "ar"]) {
      const lista = DB.DIM_ENCOUNTERS?.[terreno];
      if (lista && !lista.some((e) => e.id === DECAMARK)) lista.push({ id: DECAMARK, min: 24, max: 40, w: 6 });
    }
    // (as GLITCH ZONES herdam a tabela da fonte, então ele já nasce lá também)
  },
};
