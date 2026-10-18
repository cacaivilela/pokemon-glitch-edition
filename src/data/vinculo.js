// O FENÔMENO DE VÍNCULO: como o GRENINJA do ASH, o Pokémon fica tão ligado a
// quem joga que muda de corpo no meio da luta. A regra viva está em
// src/systems/vinculo.js; aqui ficam as listas, os números e os textos.
//
// QUEM PODE depende do TREINADOR (o gênero + onde a jornada começou,
// st.regiao), e cada um tem a sua lista, sem repetir:
//   CAIO (menino, BRAGLITCH): os iniciais de ÁGUA na forma final (menos a
//     PRIMARINA, que virou o RILLABOOM), o TILAPIRAÇU de BRAGLITCH e o RAICHU
//   LARA (menina, BRAGLITCH): os fofos na forma final, e o LOPUNNY
//   VERMELHO (menino, KANTO): dez de Kanto sorteados
//   FOLHA (menina, KANTO): outros dez de Kanto sorteados
// Cada forma puxa o visual de quem treina, como o GRENINJA-ASH puxa o boné
// do ASH.
//
// COMO ACONTECE: o Pokémon usa o golpe MAIS FORTE que ele sabe (o de maior
// poder da lista dele) com a AMIZADE ACIMA DO MÁXIMO. O máximo de sempre é
// 255 — passear, vencer e subir de nível param aí. Passar disso só com as
// TÉCNICAS DO VÍNCULO, que sobem a amizade muito rápido:
//   CRISTAL DO VÍNCULO   (item, toda loja)       +40
//   CARINHO DA VITÓRIA   (falar com ele logo depois de vencer)  +15
//   AGUENTOU JUNTO       (vencer com ele no fim do HP)          +20
//
// Como a MEGA, a forma só existe dentro da luta: `mon.megaDe` guarda a
// espécie de sempre e o fim da batalha devolve (src/systems/mega.js).
//
// Os sprites são desenhos novos (tools/vinculo_desenhos/, gravados por
// tools/vinculo_sprites.py). O CAIO-GRENINJA é ÁGUA/ELÉTRICO e leva dois
// JOY-CON em X no lugar da estrela de água. Na luta, a AURA do vínculo
// (src/scenes/battle.js) vem na cor do treinador.

export const VINCULO = {
  max: 255,          // o máximo de sempre: daqui pra cima, só as técnicas
  precisa: 300,      // a partir daqui o vínculo acontece
  teto: 300,
  especies: {
    caio: ["blastoise", "feraligatr", "swampert", "empoleon", "samurott",
      "greninja", "rillaboom", "inteleon", "quaquaval", "raichu", "tilapiracu"],
    lara: ["lopunny", "clefable", "wigglytuff", "togekiss", "sylveon", "azumarill",
      "alcremie", "whimsicott", "cinccino", "ribombee"],
    red: ["venomoth", "ninetales", "beedrill", "primeape", "pinsir",
      "hypno", "marowak", "weezing", "tentacruel", "electabuzz"],
    leaf: ["mew", "machamp", "exeggutor", "farfetchd", "butterfree",
      "nidoqueen", "muk", "moltres", "lapras", "kingler"],
  },
  // os quatro treinadores: de qual lista, o nome, a cor da aura e o SOM dele
  // (no formato dos gritos, src/data/gritos.js). O grito da forma de vínculo
  // é 3/4 o do Pokémon e 1/4 o do treinador (src/systems/gritos.js).
  treinadores: {
    // o clique do JOY-CON encaixando e um "YEAH!" subindo
    caio: { genero: "menino", nome: "CAIO", cor: [70, 160, 255],
      grito: [[2400, 1800, 25, "n"], [0, 0, 20, "_"], [520, 780, 80, "q"], [780, 1040, 90, "q", 4]] },
    // um "hihi" doce, de sininho
    lara: { genero: "menina", nome: "LARA", cor: [255, 120, 200],
      grito: [[1047, 1319, 70, "t", 6], [0, 0, 20, "_"], [1319, 1568, 100, "t", 6]] },
    // o RED quase não fala: a passada no boné e um "hm!" grave e decidido
    red: { genero: "menino", nome: "VERMELHO", cor: [240, 64, 56],
      grito: [[2600, 1200, 40, "n"], [196, 247, 90, "s"], [247, 220, 110, "s", 3]] },
    // um assobio alegre, que sobe e desce
    leaf: { genero: "menina", nome: "FOLHA", cor: [110, 210, 240],
      grito: [[880, 1175, 80, "t"], [1175, 988, 100, "t", 5]] },
  },
  // os números oficiais do GRENINJA-ASH; os outros, a conta de `formaDeVinculo`
  stats: { greninja: { hp: 72, atk: 145, def: 67, spa: 153, spd: 71, spe: 132 } },
  // tipos que mudam no vínculo: o CAIO-GRENINJA é ÁGUA/ELÉTRICO
  tipos: { caio: { greninja: ["ÁGUA", "ELÉTRICO"] } },
  // GRITO PRÓPRIO de uma forma: no lugar do grito do Pokémon (os 3/4), este;
  // o som do treinador (o 1/4) vem depois do mesmo jeito.
  gritos: {
    leaf: {
      // FOLHA-MACHAMP canta, na voz grossa dele: "WE ARE THE CHAMP-I-ONS"
      machamp: { som: "UÍ-ÁR-DÂ-CHAMP-I-ONS!", s: [
        [262, 262, 170, "s"], [0, 0, 25, "_"], [247, 247, 130, "s"], [0, 0, 20, "_"],
        [262, 262, 150, "s"], [0, 0, 20, "_"], [247, 247, 280, "s", 3], [0, 0, 25, "_"],
        [196, 196, 150, "s"], [0, 0, 20, "_"], [165, 165, 480, "s", 5],
      ] },
    },
  },
  // o CODINOME de cada forma (os do RAICHU, RILLABOOM e LOPUNNY são do CAIO;
  // os outros, sugestões)
  codinomes: {
    caio: {
      raichu: "PIKAPK-RENEW",
      blastoise: "BLASTBALL-CANNON",
      feraligatr: "FERACURL-CHOMP",
      swampert: "SWAMPCURL-QUAKE",
      empoleon: "EMPOJOY-CON",
      samurott: "SAMURED-BLADE",
      greninja: "GRENSWITCH-VOLT",
      rillaboom: "DRUMS-KABOOM-SONG",
      inteleon: "INTELBALL-AGENT",
      quaquaval: "QUAQUACURL-DANCE",
      tilapiracu: "TILAPIBALL-PUNCH",
    },
    lara: {
      lopunny: "ORAL-MELODY",
      clefable: "CLEFLOCK-MOON",
      wigglytuff: "WIGGLEBANG-SONG",
      togekiss: "KISSCROWN-SKY",
      sylveon: "SYLVRIBBON-CHARM",
      azumarill: "AZUBUN-SPLASH",
      alcremie: "CREAMHOOD-SWEET",
      whimsicott: "WHIMCURL-BREEZE",
      cinccino: "CINCBANG-SILK",
      ribombee: "RIBBEE-POLLEN",
    },
  },

  cristal: { item: "cristal do vínculo", preco: 2500, ganho: 40 },
  carinho: { segundos: 30, ganho: 15 },
  aguentou: { fracao: 0.25, ganho: 20 },

  textos: {
    sintonia: "{MON} E {NOME} ESTÃO EM SINTONIA TOTAL!",
    virou: "FENÔMENO DE VÍNCULO! {MON} VIROU {NOME}-{ESPECIE}!",
    tipo: "{MON} AGORA É {TIPOS}!",
    codinome: "CODINOME: {CODINOME}!",
    cristal: "O CRISTAL DO VÍNCULO BRILHOU NA MÃO DE {MON}! AMIZADE {AMZ}/{TETO}.",
    cristalCheio: "{MON} JÁ ESTÁ NO VÍNCULO MÁXIMO. O CRISTAL NEM BRILHA.",
    carinho: "{MON} SENTIU QUE VENCERAM JUNTOS! (AMIZADE {AMZ}/{TETO})",
    aguentou: "{MON} AGUENTOU ATÉ O FIM POR VOCÊ! (AMIZADE {AMZ}/{TETO})",
    pronto: "{MON} ESTÁ PRONTO PRO VÍNCULO. USE O GOLPE MAIS FORTE DELE NA LUTA!",
  },
};

const ORDEM_TREINADOR = ["caio", "lara", "red", "leaf"];

/** o número do sprite: 24000 + 100 x treinador + a posição na lista dele
 *  (a mesma conta de tools/vinculo_sprites.py) */
export function spriteVinculo(especie, treinador) {
  return 24000 + 100 * ORDEM_TREINADOR.indexOf(treinador) + VINCULO.especies[treinador].indexOf(especie);
}

/** A FORMA DE VÍNCULO de uma espécie com um treinador: mais força no lado
 *  que ela já usa pra bater, mais velocidade. O GRENINJA tem os números
 *  oficiais. */
function formaDeVinculo(base, treinador) {
  const b = base.base;
  const fisico = b.atk >= b.spa;
  const stats = VINCULO.stats[base.id] || {
    ...b,
    atk: b.atk + (fisico ? 40 : 20),
    spa: b.spa + (fisico ? 20 : 40),
    spe: b.spe + 20,
  };
  const nome = VINCULO.treinadores[treinador].nome;
  return {
    id: base.id + "vinculo" + treinador, dex: base.dex, name: base.name, forma: `VÍNCULO ${nome}`,
    formaDe: base.id, megaDe: base.id, vinculo: treinador,
    codinome: VINCULO.codinomes[treinador]?.[base.id] || null,
    types: [...(VINCULO.tipos[treinador]?.[base.id] || base.types)],
    base: stats, bst: Object.values(stats).reduce((a, n) => a + n, 0),
    spriteDex: spriteVinculo(base.id, treinador),
    foreign: base.foreign, catchRate: base.catchRate, xpYield: base.xpYield, soEvolucao: true,
    dexText: `O VÍNCULO COM ${nome} É TÃO FORTE QUE ${base.name} FICA PARECIDO COM ${nome === "LARA" || nome === "FOLHA" ? "ELA" : "ELE"} NO MEIO DA LUTA.`,
  };
}

/** As espécies das formas de vínculo, montadas a partir das de sempre: uma
 *  por espécie da lista de cada treinador. */
export function especiesVinculo(todas) {
  const out = {};
  for (const t of Object.keys(VINCULO.treinadores)) {
    for (const id of VINCULO.especies[t]) {
      if (todas[id]) out[id + "vinculo" + t] = formaDeVinculo(todas[id], t);
    }
  }
  return out;
}
