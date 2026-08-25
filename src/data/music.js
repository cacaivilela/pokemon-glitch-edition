// Trilha do jogo — músicas ORIGINAIS escritas no estilo das faixas de GBA:
// melodia em onda quadrada, contracanto/arpejo, baixo em triângulo e um
// chiadinho de percussão. Não são as músicas do FireRed (essas são da Nintendo /
// Game Freak e do Junichi Masuda); a ideia é soar do mesmo tempo e do mesmo
// aparelho, não copiar as melodias.
//
// Formato: { bpm, tracks: [{ wave, duty, vol, legato, vibrato, detune, eco, notes }] }
//   wave:    "pulso" (canal de pulso do GBA) | "triangle" | "sawtooth" | "ruido"
//   duty:    largura do pulso — 0.125 fininho e nasal, 0.25 clássico, 0.5 cheio
//   vibrato: { hz, cents } — entra depois do ataque, como nos sintetizadores da época
//   detune:  duas vozes afastadas N cents; engorda a melodia
//   eco:     manda o canal pro delay curto (o "espaço" das trilhas de GBA)
//   "-" é pausa.
//
// O arranjo segue o costume da época: melodia no pulso 25% com vibrato e eco,
// acompanhamento no pulso 12,5% tocando nos CONTRATEMPOS (o "um-PÁ um-PÁ"),
// baixo caminhando em colcheias no triângulo, e ruído fazendo bumbo e caixa.
// Cada canal roda no próprio comprimento: comprimentos diferentes fazem a
// repetição demorar a ficar óbvia.

/** bumbo no tempo, caixa no contratempo — o padrão que segura qualquer faixa */
const bateria = (vol = 0.4) => ({
  wave: "ruido", vol,
  notes: [["x", 1], ["x", 0.5], ["-", 0.5], ["x", 1], ["x", 0.5], ["x", 0.5]],
});

/** instrumentos prontos, pra não repetir os parâmetros em toda faixa */
const melodia = (vol = 0.5) => ({ wave: "pulso", duty: 0.25, vol, detune: 6, eco: true,
                                  vibrato: { hz: 6.2, cents: 13 } });
const contra = (vol = 0.2) => ({ wave: "pulso", duty: 0.125, vol, legato: 0.34 });
const baixo = (vol = 0.55) => ({ wave: "triangle", vol, legato: 0.9 });

export const MUSIC = {
  // ABERTURA: a fanfarra de antes do título. É a mesma ideia das aberturas de
  // GBA — metal em fanfarra, tímpano, uma subida e um acorde final que segura —,
  // mas a melodia é nossa: a regra do arquivo vale aqui também.
  abertura: {
    bpm: 132,
    tracks: [
      { ...melodia(0.55), notes: [
        // a chamada: três notas subindo, que é como toda abertura avisa que vai começar
        ["G4", 0.5], ["C5", 0.5], ["E5", 1], ["-", 0.5],
        ["G5", 0.5], ["E5", 0.5], ["C5", 1],
        ["A4", 0.5], ["D5", 0.5], ["F5", 1], ["-", 0.5],
        ["A5", 0.5], ["F5", 0.5], ["D5", 1],
        // o duelo: as duas notas se batendo, uma alta e uma baixa
        ["E5", 0.5], ["B4", 0.5], ["E5", 0.5], ["B4", 0.5],
        ["F5", 0.5], ["C5", 0.5], ["F5", 0.5], ["C5", 0.5],
        ["G5", 0.5], ["D5", 0.5], ["G5", 0.5], ["B5", 0.5],
        // e o acorde que abre pro logo
        ["C6", 3], ["-", 1],
      ] },
      { ...contra(0.22), notes: [
        ["-", 0.5], ["E4", 0.5], ["-", 0.5], ["G4", 0.5],
        ["-", 0.5], ["E4", 0.5], ["-", 0.5], ["C4", 0.5],
        ["-", 0.5], ["F4", 0.5], ["-", 0.5], ["A4", 0.5],
        ["-", 0.5], ["F4", 0.5], ["-", 0.5], ["D4", 0.5],
        ["G4", 0.5], ["-", 0.5], ["G4", 0.5], ["-", 0.5],
        ["A4", 0.5], ["-", 0.5], ["A4", 0.5], ["-", 0.5],
        ["B4", 0.5], ["-", 0.5], ["D5", 0.5], ["-", 0.5],
        ["E5", 3], ["-", 1],
      ] },
      { ...baixo(0.6), notes: [
        ["C3", 1], ["C3", 1], ["G2", 1], ["G2", 1],
        ["F2", 1], ["F2", 1], ["C3", 1], ["C3", 1],
        ["E2", 1], ["E2", 1], ["F2", 1], ["F2", 1],
        ["G2", 1], ["G2", 1], ["G2", 0.5], ["B2", 0.5],
        ["C3", 3], ["-", 1],
      ] },
      // o tímpano: bate junto com a chamada e some no acorde final
      { wave: "ruido", vol: 0.5, notes: [
        ["x", 0.5], ["-", 0.5], ["x", 0.5], ["-", 0.5],
        ["x", 1], ["x", 0.5], ["x", 0.5],
        ["x", 0.5], ["-", 0.5], ["x", 0.5], ["-", 0.5],
        ["x", 1], ["x", 0.5], ["x", 0.5],
        ["x", 0.25], ["x", 0.25], ["x", 0.5], ["x", 0.5], ["x", 0.5],
        ["x", 0.25], ["x", 0.25], ["x", 0.5], ["x", 1],
        ["x", 0.5], ["-", 3.5],
      ] },
    ],
  },

  // Tela de título: solene, com o baixo entrando devagar
  titulo: {
    bpm: 100,
    tracks: [
      { ...melodia(0.5), notes: [
        ["C5", 1], ["E5", 1], ["G5", 1.5], ["E5", 0.5], ["F5", 2],
        ["D5", 1], ["F5", 1], ["A5", 1.5], ["G5", 0.5], ["E5", 2],
        ["C5", 1], ["G4", 1], ["C5", 4],
      ] },
      { ...contra(0.16), notes: [
        ["C4", 0.5], ["G4", 0.5], ["E4", 0.5], ["G4", 0.5],
        ["F4", 0.5], ["A4", 0.5], ["C5", 0.5], ["A4", 0.5],
      ] },
      { wave: "triangle", vol: 0.55, notes: [["C3", 4], ["F2", 4], ["G2", 2], ["C3", 2]] },
    ],
  },

  // Vila Paleta: devagar, acolhedor, quase uma canção de ninar
  pallet: {
    bpm: 104,
    tracks: [
      { ...melodia(0.5), notes: [
        ["G4", 1], ["A4", 0.5], ["B4", 1.5], ["A4", 1], ["G4", 1],
        ["E4", 1.5], ["D4", 0.5], ["E4", 2],
        ["G4", 1], ["B4", 0.5], ["D5", 1.5], ["C5", 1], ["B4", 1],
        ["A4", 2], ["-", 2],
      ] },
      { ...contra(0.22), notes: [
        ["D4", 0.5], ["G4", 0.5], ["B4", 0.5], ["G4", 0.5],
        ["C4", 0.5], ["E4", 0.5], ["G4", 0.5], ["E4", 0.5],
      ] },
      { ...baixo(0.55), notes: [
        ["G2", 2], ["D3", 2], ["C3", 2], ["E3", 2],
      ] },
    ],
  },

  // Rota: marcha, o passo de quem está indo pra algum lugar
  route: {
    bpm: 142,
    tracks: [
      { ...melodia(0.5), notes: [
        ["C5", 0.5], ["E5", 0.5], ["G5", 1], ["E5", 0.5], ["C5", 0.5], ["D5", 1],
        ["E5", 0.5], ["F5", 0.5], ["G5", 1], ["A5", 0.5], ["G5", 0.5], ["E5", 1],
        ["F5", 0.5], ["A5", 0.5], ["G5", 1], ["E5", 0.5], ["D5", 0.5], ["C5", 1],
        ["D5", 1], ["E5", 1], ["C5", 2],
      ] },
      { ...contra(0.2), notes: [
        ["G3", 0.5], ["C4", 0.5], ["E4", 0.5], ["C4", 0.5],
        ["A3", 0.5], ["D4", 0.5], ["F4", 0.5], ["D4", 0.5],
        ["G3", 0.5], ["B3", 0.5], ["D4", 0.5], ["B3", 0.5],
      ] },
      { ...baixo(0.6), notes: [
        ["C3", 1], ["C3", 0.5], ["G2", 0.5], ["A2", 1], ["A2", 1],
        ["F2", 1], ["F2", 0.5], ["C3", 0.5], ["G2", 2],
      ] },
      bateria(0.35),
    ],
  },

  // Cidade: saltitante. O acompanhamento cai só nos contratempos (o "um-PÁ"),
  // o baixo caminha em colcheias e a melodia anda em terças — o jeitão de tema
  // de cidade de GBA, sem ser tema nenhum em particular.
  viridian: {
    bpm: 138,
    tracks: [
      { ...melodia(0.5), notes: [
        ["E5", 0.5], ["F5", 0.25], ["E5", 0.25], ["C5", 0.5], ["E5", 0.5],
        ["D5", 0.5], ["C5", 0.25], ["B4", 0.25], ["A4", 1],
        ["C5", 0.5], ["D5", 0.25], ["C5", 0.25], ["A4", 0.5], ["C5", 0.5],
        ["B4", 0.5], ["A4", 0.25], ["G4", 0.25], ["E4", 1],
        ["G4", 0.5], ["A4", 0.5], ["C5", 0.5], ["D5", 0.5],
        ["E5", 1], ["D5", 0.5], ["C5", 0.5],
        ["B4", 0.5], ["D5", 0.5], ["C5", 1], ["A4", 2],
      ] },
      { ...contra(0.22), notes: [       // só nos contratempos
        ["-", 0.5], ["A3", 0.5], ["-", 0.5], ["C4", 0.5],
        ["-", 0.5], ["G3", 0.5], ["-", 0.5], ["B3", 0.5],
        ["-", 0.5], ["F3", 0.5], ["-", 0.5], ["A3", 0.5],
        ["-", 0.5], ["E3", 0.5], ["-", 0.5], ["G3", 0.5],
      ] },
      { ...baixo(0.58), notes: [        // baixo caminhando
        ["A2", 0.5], ["E3", 0.5], ["A2", 0.5], ["C3", 0.5],
        ["G2", 0.5], ["D3", 0.5], ["G2", 0.5], ["B2", 0.5],
        ["F2", 0.5], ["C3", 0.5], ["F2", 0.5], ["A2", 0.5],
        ["E2", 0.5], ["B2", 0.5], ["E2", 0.5], ["G2", 0.5],
      ] },
      bateria(0.32),
    ],
  },

  // Laboratório: científico, meio suspenso no ar
  lab: {
    bpm: 96,
    tracks: [
      { ...melodia(0.4), notes: [
        ["E4", 1], ["G4", 1], ["B4", 1], ["A4", 1],
        ["D4", 1], ["F4", 1], ["A4", 2],
      ] },
      { ...contra(0.18), notes: [
        ["E5", 0.25], ["B4", 0.25], ["E5", 0.25], ["G5", 0.25],
        ["D5", 0.25], ["A4", 0.25], ["D5", 0.25], ["F5", 0.25],
      ] },
      { wave: "triangle", vol: 0.5, notes: [["E2", 2], ["E2", 2], ["D2", 2], ["D2", 2]] },
    ],
  },

  // Sua casa: pequena, quentinha, quatro compassos e pronto
  casa: {
    bpm: 92,
    tracks: [
      { ...melodia(0.42), notes: [
        ["F4", 1], ["A4", 1], ["C5", 1.5], ["A4", 0.5],
        ["G4", 1], ["E4", 1], ["F4", 2],
      ] },
      { wave: "triangle", vol: 0.5, notes: [["F2", 2], ["C3", 2], ["G2", 2], ["C3", 2]] },
    ],
  },

  // Centro Pokémon: o alívio de chegar
  center: {
    bpm: 108,
    tracks: [
      { ...melodia(0.45), notes: [
        ["C5", 0.5], ["D5", 0.5], ["E5", 1], ["G5", 1], ["E5", 1],
        ["D5", 0.5], ["C5", 0.5], ["D5", 1], ["E5", 2],
      ] },
      { ...contra(0.18), notes: [
        ["C4", 0.5], ["E4", 0.5], ["G4", 0.5], ["E4", 0.5],
        ["F4", 0.5], ["A4", 0.5], ["C5", 0.5], ["A4", 0.5],
      ] },
      { wave: "triangle", vol: 0.5, notes: [["C3", 2], ["F2", 2], ["G2", 2], ["C3", 2]] },
    ],
  },

  // Loja: curtinha e repetitiva de propósito, como toda loja
  mart: {
    bpm: 132,
    tracks: [
      { ...melodia(0.44), notes: [
        ["G4", 0.5], ["B4", 0.5], ["D5", 0.5], ["B4", 0.5],
        ["C5", 0.5], ["E5", 0.5], ["G5", 1],
        ["F5", 0.5], ["D5", 0.5], ["B4", 1],
      ] },
      { wave: "triangle", vol: 0.5, notes: [["G2", 1], ["D3", 1], ["C3", 1], ["G2", 1]] },
      bateria(0.28),
    ],
  },

  // Birth Island: mar aberto, ninguém por perto. Lento, suspenso, um pouco errado
  // (o acompanhamento anda meio tom acima do que o baixo espera).
  ilha: {
    bpm: 88,
    glitch: 0.04,
    tracks: [
      { ...melodia(0.42), notes: [
        ["A4", 2], ["C5", 1], ["D5", 1], ["E5", 2], ["D5", 2],
        ["C5", 1.5], ["A4", 0.5], ["G4", 2], ["A4", 4],
      ] },
      { ...contra(0.16), notes: [
        ["E4", 0.5], ["A4", 0.5], ["B4", 0.5], ["A4", 0.5],
        ["F4", 0.5], ["A#4", 0.5], ["C5", 0.5], ["A#4", 0.5],
      ] },
      { ...baixo(0.5), notes: [["A1", 4], ["F1", 4], ["G1", 4], ["A1", 4]] },
      { wave: "ruido", vol: 0.12, notes: [["x", 3], ["-", 5], ["x", 2], ["-", 6]] },
    ],
  },


  // Caverna: grave, escuro, sem pressa
  cave: {
    bpm: 84,
    tracks: [
      { ...melodia(0.36), notes: [
        ["A3", 2], ["C4", 1], ["B3", 1], ["A3", 2], ["G3", 2],
        ["E3", 3], ["A3", 1],
      ] },
      { wave: "triangle", vol: 0.6, notes: [["A1", 2], ["A1", 2], ["F1", 2], ["G1", 2]] },
      { wave: "ruido", vol: 0.16, notes: [["x", 4], ["-", 4], ["x", 2], ["-", 6]] },
    ],
  },

  // Ginásio: marcial, quase uma provocação
  gym: {
    bpm: 150,
    tracks: [
      { ...melodia(0.5), notes: [
        ["E4", 0.5], ["E4", 0.5], ["G4", 1], ["E4", 0.5], ["A4", 0.5], ["G4", 1],
        ["E4", 0.5], ["E4", 0.5], ["B4", 1], ["A4", 0.5], ["G4", 0.5], ["E4", 1],
      ] },
      { wave: "sawtooth", vol: 0.2, legato: 0.5, notes: [
        ["E3", 0.5], ["B3", 0.5], ["E4", 0.5], ["B3", 0.5],
      ] },
      { wave: "triangle", vol: 0.6, notes: [["E2", 1], ["E2", 1], ["D2", 1], ["E2", 1]] },
      bateria(0.42),
    ],
  },

  // 011GLITCHDIMENSION110: pesada e quebrada de propósito.
  //  - a melodia anda em trítono e cromatismo (nada resolve);
  //  - os canais têm comprimentos diferentes (6, 5, 4 e 3 tempos), então eles se
  //    desencontram e o ciclo inteiro só fecha a cada 60 tempos (~24s);
  //  - `glitch: 0.16` faz o motor engolir, desafinar ou apressar notas soltas.
  glitchdim: {
    bpm: 152,
    glitch: 0.16,
    tracks: [
      { wave: "sawtooth", vol: 0.42, detune: 22, eco: true, vibrato: { hz: 7.5, cents: 30 },
        notes: [                                    // 7 tempos
          ["D3", 0.5], ["G#3", 0.5], ["D3", 0.25], ["D4", 0.25], ["G#3", 0.5],
          ["C4", 0.5], ["F#4", 1], ["E4", 0.5], ["A#3", 0.5],
          ["D4", 0.25], ["D5", 0.25], ["G#4", 1],
        ] },
      { wave: "pulso", duty: 0.125, vol: 0.24, legato: 0.3, glitch: 1.6,
        notes: [                                    // 5 tempos, arpejo nervoso
          ["D5", 0.25], ["G#5", 0.25], ["A#5", 0.25], ["G#5", 0.25],
          ["F#5", 0.25], ["C6", 0.25], ["D5", 0.25], ["A#5", 0.25],
          ["G#5", 0.5], ["-", 0.5], ["D6", 0.5], ["C6", 0.5], ["-", 1],
        ] },
      { wave: "triangle", vol: 0.62, legato: 0.95,
        notes: [                                    // 4 tempos, grave e teimoso
          ["D1", 1], ["D1", 0.5], ["G#1", 0.5], ["D1", 1], ["A#1", 1],
        ] },
      { wave: "ruido", vol: 0.5, glitch: 2,
        notes: [                                    // 3 tempos: nunca cai no lugar
          ["x", 0.5], ["x", 0.25], ["-", 0.25], ["x", 0.5],
          ["-", 0.5], ["x", 0.25], ["x", 0.75],
        ] },
    ],
  },

  // Batalha selvagem: rápida, sem tempo pra pensar
  batalha: {
    bpm: 168,
    tracks: [
      { ...melodia(0.5), notes: [
        ["A4", 0.5], ["A4", 0.25], ["A4", 0.25], ["C5", 0.5], ["E5", 0.5],
        ["D5", 0.5], ["C5", 0.5], ["B4", 1],
        ["G4", 0.5], ["B4", 0.5], ["D5", 0.5], ["F5", 0.5],
        ["E5", 1], ["C5", 1],
      ] },
      { ...contra(0.22), notes: [
        ["A3", 0.25], ["E4", 0.25], ["A3", 0.25], ["C4", 0.25],
        ["G3", 0.25], ["D4", 0.25], ["G3", 0.25], ["B3", 0.25],
      ] },
      { wave: "triangle", vol: 0.6, notes: [
        ["A2", 0.5], ["A2", 0.5], ["A2", 0.5], ["G2", 0.5],
        ["F2", 0.5], ["F2", 0.5], ["E2", 1],
      ] },
      { wave: "ruido", vol: 0.45, notes: [["x", 0.5], ["x", 0.5], ["x", 0.25], ["-", 0.25], ["x", 0.5]] },
    ],
  },

  // Batalha do outro lado da fenda: a mesma pressa, com as notas erradas
  batalhaGlitch: {
    bpm: 172,
    glitch: 0.12,
    tracks: [
      { wave: "sawtooth", vol: 0.42, notes: [
        ["A4", 0.5], ["A#4", 0.25], ["A4", 0.25], ["D#5", 0.5], ["E5", 0.5],
        ["C5", 0.5], ["B4", 0.5], ["F#4", 1],
        ["A4", 0.25], ["D#5", 0.25], ["A4", 0.5], ["G#4", 1],
      ] },
      { ...contra(0.2), notes: [
        ["A2", 0.25], ["A#5", 0.25], ["A2", 0.25], ["D#5", 0.25],
      ] },
      { wave: "triangle", vol: 0.6, notes: [["A1", 0.5], ["A1", 0.5], ["A#1", 1], ["G1", 1]] },
      { wave: "ruido", vol: 0.5, notes: [["x", 0.5], ["x", 0.25], ["x", 0.25], ["-", 0.5]] },
    ],
  },
};

/** música de cada tipo de mapa; o que não estiver aqui cai em pallet */
export const MUSIC_ALIAS = {};
