// DESCER O CUME SEM ESCADA.
//
// Subir a ROCHA NAVEL é dezessete andares de escada. Descer de novo, os mesmos
// dezessete — e ninguém volta duas vezes num lugar que só tem escada. Do topo
// dá pra descer DIRETO, se você tiver com quem.
//
// QUEM SERVE, e por quê:
//   - TIPO PEDRA: eles SÃO a pedra. Descer por uma parede é descer por casa.
//   - TIPO AÇO: garra, casco e peso que agarram onde não tem onde agarrar.
//   - PARKOUR: os que não são de pedra nem de aço, mas se viram — o GRENINJA
//     pula por qualquer coisa, o SCEPTILE gruda em parede lisa, o HITMONLEE
//     desce em três saltos. É uma LISTA e não uma regra de tipo porque a
//     habilidade aqui é do bicho, não do elemento dele: nem todo tipo ÁGUA
//     desce um penhasco, mas o GRENINJA desce.
//
// FUSÃO HERDA: basta uma das metades servir. Um GEODUDE fundido com o que for
// continua sendo pedra do lado de dentro.
export const DESCIDA = {
  mapa: "navel_rock_summit",
  /** o tile mais alto do cume; a descida é encostando pra CIMA a partir dele */
  de: { x: 9, y: 11 },
  para: { mapa: "navel_rock_exterior", x: 9, y: 10, dir: "down" },

  tipos: ["PEDRA", "AÇO"],
  parkour: [
    // os que pulam
    "greninja", "frogadier", "froakie", "hitmonlee", "hitmonchan",
    "scyther", "persian", "meowth", "primeape", "mankey",
    // os que grudam e escalam
    "sceptile", "grovyle", "treecko", "sandslash", "sandshrew",
    "machamp", "machoke", "machop", "cinderace", "raboot", "scorbunny",
    "decidueye", "dartrix", "rowlet", "meowscarada", "floragato", "sprigatito",
  ],

  pergunta: "DAQUI A ROCHA DESCE RETO. {MON} CONSEGUE LEVAR VOCÊ. DESCER?",
  opcoes: ["DESCER", "AGORA NÃO"],
  desceu: ["{MON} SEGURA VOCÊ E DESCE PELA PAREDE.", "DEZESSETE ANDARES EM MEIO MINUTO."],
  semNinguem: [
    "DAQUI A ROCHA DESCE RETO. É LONGE.",
    "COM ALGUÉM DE PEDRA OU DE AÇO — OU ALGUÉM QUE PULE MUITO BEM — DAVA PRA DESCER SEM VOLTAR PELA ESCADA.",
  ],
};
