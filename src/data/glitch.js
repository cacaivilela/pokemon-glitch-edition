// GLITCHBOOSTER e GLITCH RAID: as duas coisas que só existem porque este jogo
// se chama GLITCH EDITION.
//
// GLITCHBOOSTER
// Usado na batalha, ele transforma o seu Pokémon num BUG: a partir dali, todo
// dano que ele TOMA vira ponto de atributo. Levou 20, ganha 20 em ataque,
// defesa, ataque especial, defesa especial e velocidade — em tudo menos no HP,
// que continua caindo normalmente. Quanto mais apanha, mais forte fica.
//
// E aí está a piada, que é também o risco: o número que segura isso é de um
// byte. Passou de 255, VOLTA PRO ZERO. Apanhar demais não deixa invencível —
// deixa zerado. É o único jeito honesto de um jogo chamado Glitch Edition
// implementar "acumula dano e vira força".
//
// GLITCH RAID
// Um chefe que não devia caber na tela: HP multiplicado, atributos inflados e
// um ESCUDO na frente. Enquanto o escudo estiver de pé ele não pode ser
// capturado — primeiro se quebra a casca, depois se conversa.

/** O item. Gasta-se um por uso, e o efeito dura só aquela batalha. */
export const GLITCHBOOSTER = { item: "glitchbooster", preco: 2500 };

export const BOOSTER = {
  /** o teto do byte: passou disto, o bônus volta pro começo */
  byte: 256,
  /** os atributos que sobem. HP fica de fora: o dano tem que continuar doendo */
  sobem: ["atk", "def", "spa", "spd", "spe"],
  /** o quanto de bônus cada ponto de dano vira */
  porDano: 1,
};

/** As GLITCH RAIDS: chefes da 011GLITCHDIMENSION110. */
export const RAID = {
  /** chance de, na fenda, o encontro virar raid */
  chance: 0.06,
  /** o HP do chefe vezes isto */
  vidas: 5,
  /** o escudo, em fração do HP total dele */
  escudo: 0.45,
  /** o quanto os atributos dele sobem */
  forca: 1.35,
  /** nível: de tanto a tanto */
  nivel: [35, 55],
  /** o prêmio de derrubar um */
  premio: { dinheiro: [1200, 3000], xp: 2 },
  /** a cada quantos golpes o escudo se refaz um pouco (0 desliga) */
  regenera: 0,
};
