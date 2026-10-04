// AS EVOLUÇÕES SECRETAS: as que nenhum nível, pedra ou amizade dá. Acontecem
// por causa de alguma coisa que ACONTECEU com o bicho, e o jogo não avisa — é
// a Pokédex da forma nova que conta como foi.
//
// A regra leva `secreta: "<marca>"`; a marca é gravada no próprio Pokémon
// (`mon[marca] = true`) por src/systems/secretas.js, na hora em que acontece, e
// a evolução sai na próxima vez que o jogo confere a equipe (depois da batalha).

// AS TRÊS VARIANTES do PARASECTROM: o mesmo bicho, o chapéu de outra cor. O
// choque é o mesmo (um golpe ELÉTRICO derrubando o PARASECT nas SEVII); o que
// decide a cor é o COGUMELO que ele comeu antes (COGUMELOS, embaixo):
//   NORMAL (laranja pálido)  não comeu nada
//   AZUL                     comeu um COGUMELO AZUL
//   AMARELO                  comeu um COGUMELO DOURADO
const LEARNSET_PARASECTROM = [
  [1, "investida"], [1, "fiodeseda"], [1, "picada"], [1, "choquedotrovao"],
  [16, "picadadeveneno"], [30, "ondadechoque"], [45, "trovoada"],
];
const variante = (id, nome, spriteDex, forma, dexText) => ({
  id, dex: 47, name: nome, forma,
  types: ["INSETO", "ELÉTRICO"],
  base: { hp: 80, atk: 105, def: 110, spa: 95, spd: 90, spe: 40 }, bst: 520,
  spriteDex, dexText, catchRate: 45, xpYield: 130, soEvolucao: true,
  learnset: LEARNSET_PARASECTROM,
});

export const SECRETAS_ESPECIES = {
  parasectromazul: variante("parasectromazul", "PARASECTROM-AZUL", 31002, "AZUL",
    "TINHA COMIDO UM COGUMELO AZUL QUANDO LEVOU UM RAIO. O COGUMELO MORREU, MAS FICOU AZUL. ELE TEM CONTROLE DE SI DE VOLTA E AGE COMO UM ROBÔ CALMO."),
  parasectromamarelo: variante("parasectromamarelo", "PARASECTROM-AMARELO", 31003, "AMARELO",
    "TINHA COMIDO UM COGUMELO DOURADO QUANDO LEVOU UM RAIO. O COGUMELO MORREU, MAS FICOU DOURADO. ELE TEM CONTROLE DE SI DE VOLTA E AGE COMO UM ROBÔ QUE BRILHA."),
  /** PARASECTROM: o PARASECT que DESMAIOU com um golpe ELÉTRICO nas ILHAS SEVII
   *  (a variante NORMAL, de chapéu laranja pálido: não comeu cogumelo nenhum).
   *  O cogumelo levou a carga inteira, cresceu de cabeça pra baixo e virou uma
   *  máquina por dentro. INSETO/ELÉTRICO; atributos acima dos do PARASECT, com a
   *  defesa e o ataque especial puxados pelo "robô". */
  parasectrom: {
    id: "parasectrom", dex: 47, name: "PARASECTROM",
    types: ["INSETO", "ELÉTRICO"],
    base: { hp: 80, atk: 105, def: 110, spa: 95, spd: 90, spe: 40 }, bst: 520,
    spriteDex: 31001,
    dexText: "LEVOU UM RAIO E O COGUMELO MORREU. AGORA ELE TEM CONTROLE DE SI DE VOLTA, MAS AGE COMO UM ROBÔ.",
    catchRate: 45,
    xpYield: 130,
    soEvolucao: true,
    forma: "NORMAL",
    learnset: LEARNSET_PARASECTROM,
  },
};

export const EVO_SECRETAS = {
  parasect: [
    { secreta: "choqueSevii", comeu: "cogumelo dourado", to: "parasectromamarelo" },
    { secreta: "choqueSevii", comeu: "cogumelo azul", to: "parasectromazul" },
    { secreta: "choqueSevii", to: "parasectrom" },
  ],
};

/** as marcas: quem, de que golpe (o tipo, ou o golpe exato), onde (`onde`
 *  como em src/systems/regionais.js) e a hora (`noite`). Marcas do mesmo
 *  `grupo` são uma só por bicho, e a lista é lida na ordem: a primeira que
 *  bater vale — por isso a TROVOADA vem antes da noite, e a noite antes do
 *  choque comum. */
export const MARCAS_SECRETAS = [
  { marca: "choqueSevii", grupo: "parasectrom", especie: "parasect", tipo: "ELÉTRICO", onde: "sevii", desmaiou: true },
];

/** OS COGUMELOS do PARASECT: dados pela mochila, ficam no bicho
 *  (`mon.comeu`) até o choque — o último que ele comeu é o que vale. Vendidos
 *  nas lojas das ILHAS SEVII (src/data/index.js gruda no estoque delas). */
export const COGUMELOS = {
  especie: "parasect",
  itens: {
    "cogumelo azul": { preco: 2500, comeu: "{MON} COMEU O COGUMELO AZUL! O CHAPÉU DELE BRILHOU AZUL POR UM INSTANTE." },
    "cogumelo dourado": { preco: 2500, comeu: "{MON} COMEU O COGUMELO DOURADO! O CHAPÉU DELE BRILHOU DOURADO POR UM INSTANTE." },
  },
  naoQuer: "{MON} CHEIROU O COGUMELO E NÃO QUIS. SÓ O PARASECT COME ESSE.",
  jaComeu: "{MON} JÁ COMEU ESSE MESMO COGUMELO. ELE NÃO QUER OUTRO IGUAL.",
};
