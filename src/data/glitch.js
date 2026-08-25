// GLITCHBOOSTER e GLITCH RAID: as duas coisas que só existem porque este jogo
// se chama GLITCH EDITION.
//
// GLITCHBOOSTER
// Item-chave: um só, comprado uma vez, e ele não gasta.
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
//
// E ela não mora mais dentro da fenda. A raid era um encontro raro lá dentro,
// onde ninguém entra por acaso: quem chegava até lá já tinha visto tudo, e o
// chefe virava mais um bicho da tabela. Agora ela vem POR UM RASGO, aberto NO
// CHÃO de Kanto — a fenda deixou de ser um lugar aonde você vai e virou uma
// coisa que vaza pra cá. O rasgo suja a tela seis vezes mais do que o mundo
// normalmente suja, então dá pra saber que um abriu sem olhar o mapa.
//
// ELE NÃO TEM NADA A VER COM GRAMA ALTA. Não é encontro selvagem: é uma coisa
// no chão, e você interage com ela. Sortear na grama amarrava o rasgo à mesma
// tabela de sempre — o que já existe é o mato dar bicho; o que o rasgo faz é o
// CHÃO dar chefe, e essas duas coisas não podem morar no mesmo tile por acaso.

/** O item. É ITEM-CHAVE: compra-se UMA vez e ele não gasta nunca mais, igual ao
 *  DECODIFICADOR DE GENOMA e ao VISOR-G.L.I.T.C.H. O que continua acabando é o
 *  EFEITO — o bug dura aquela batalha e some no fim dela.
 *
 *  `unico` é o que tira ele da prateleira depois de comprado: item que não gasta
 *  e continua à venda é uma armadilha de 2500 na cara de quem não percebeu. */
export const GLITCHBOOSTER = { item: "glitchbooster", preco: 2500, unico: true };

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

/** O RASGO: por onde a raid chega. */
export const PORTAL = {
  /** Chance de abrir a cada passo dado do lado de fora, com o mundo já
    *  quebrado. Vale em QUALQUER passo, não só no mato: quando ela só valia na
    *  grama, o número tinha que ser alto pra compensar os passos que não
    *  contavam. Agora todo passo conta e 2% dá um rasgo a cada cinquenta —
    *  raro, mas não ausente, que é a diferença que importa. */
  chance: 0.02,
  /** quanto ele fica aberto antes de se fechar sozinho, em minutos de relógio */
  minutos: 5,
  /** Distância mínima e máxima de onde você está, em tiles. Perto demais e ele
   *  nasce debaixo do seu pé; longe demais e você nunca acha antes de fechar.
   *  Ele abre em chão andável — nunca em parede, água, barranco ou porta. */
  perto: 3,
  longe: 7,
  /** A TELA PERTO DELE FICA 6X MAIS CORROMPIDA QUE O NORMAL. */
  corrupcao: 6,
  /** ...e o "normal" nunca é zero, senão seis vezes zero continua zero e o
   *  rasgo abriria sem sujar nada num save limpo. */
  piso: 16,
  /** Em quantos tiles a sujeira sobe. Colado nele é o 6x cheio; a `alcance`
   *  tiles de distância a tela é a de sempre, e no meio ela vai piorando.
   *  É o que faz o rasgo ser um LUGAR e não um interruptor: você vê a tela
   *  estragando conforme anda pra lá, e é assim que se acha o buraco. Também é
   *  o que impede três minutos de tela no talo virarem castigo. */
  alcance: 14,
};
