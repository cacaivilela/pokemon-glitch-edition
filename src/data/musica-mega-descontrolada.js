// A BATALHA CONTRA MEGA DESCONTROLADA: o "Rogue Mega Evolution Theme" do
// Legends Z-A, COPIADO da partitura de piano do MuseScore (score de 37rubidium85,
// salva pelo CAIO em nov/2026 e apagada depois de lida). DÓ menor, 4/4, 175 bpm,
// 32 compassos (128 tempos): a introdução é o riff grave (a mão esquerda,
// compassos 1-8), depois a melodia (mão direita, 9-32), com o riff voltando
// embaixo nos compassos 17-24. Tocada por uma banda pesada: guitarra solo
// distorcida na melodia, guitarra abafada nos acordes, baixo e bateria.
// TODOS os canais têm 128 tempos: a volta é redonda.
const SEMI = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
function sobe(n, s) {
  const m = /^([A-G]#?)(-?\d)$/.exec(n);
  if (!m) return n;
  const k = SEMI.indexOf(m[1]) + (+m[2]) * 12 + s;
  return SEMI[((k % 12) + 12) % 12] + Math.floor(k / 12);
}
const oitava = (lista, o) => lista.map(([n, d]) => [sobe(n, 12 * o), d]);

// O RIFF (mão esquerda, compassos 1-8, como está escrito)
const R1 = [["C4", 0.75], ["G3", 0.75], ["C#4", 0.5], ["C4", 2]];
const R2 = [["C4", 0.75], ["G3", 0.75], ["D#4", 0.5], ["C#4", 0.75], ["C4", 0.75], ["B3", 0.5]];
const R3 = [["C4", 0.75], ["G3", 0.75], ["F3", 0.5], ["E3", 2]];
const R4 = [["E3", 3], ["-", 1]];
const R6 = [["C4", 0.75], ["G3", 0.75], ["F4", 0.5], ["D#4", 0.75], ["F4", 0.75], ["F#4", 0.5]];
const RIFF_1 = [...R1, ...R2, ...R3, ...R4, ...R1, ...R6, ["G4", 1.5], ["C5", 2.5], ["C5", 3], ["-", 1]];
const RIFF_2 = [...R1, ...R2, ...R3, ...R4, ...R1, ...R6, ["D#4", 1.5], ["C5", 2.5], ["C5", 3], ["-", 1]];

// A MELODIA (mão direita, compassos 9-32)
const MELODIA = [
  ["-", 32],                                                                                    // 1-8: só o riff
  ["D#5", 2], ["C#5", 2],                                                                       // 9
  ["C5", 2], ["A#4", 2],                                                                        // 10
  ["C#5", 1], ["C5", 0.5], ["G4", 0.5], ["-", 0.5], ["G4", 0.5], ["C#5", 1],                    // 11
  ["C5", 0.5], ["G4", 0.5], ["-", 0.5], ["G4", 0.5], ["-", 2],                                  // 12
  ["D5", 2], ["C5", 2],                                                                         // 13
  ["B4", 2], ["G#4", 2],                                                                        // 14
  ["C5", 1.5], ["B4", 0.5], ["-", 0.5], ["B4", 0.5], ["D#5", 1.5],                              // 15 (o MI♭ amarrado)
  ["D5", 0.5], ["-", 0.5], ["D5", 0.5], ["-", 2],                                               // 16
  ["F#5", 0.75], ["C#5", 0.75], ["G5", 0.5], ["F#5", 2],                                        // 17
  ["F#5", 0.75], ["C#5", 0.75], ["A5", 0.5], ["G5", 0.75], ["F#5", 0.75], ["F5", 0.5],          // 18
  ["F#5", 0.75], ["C#5", 0.75], ["B4", 0.5], ["A#4", 2],                                        // 19
  ["A#4", 3], ["-", 1],                                                                         // 20
  ["F#5", 0.75], ["C#5", 0.75], ["G5", 0.5], ["F#5", 2],                                        // 21
  ["F#5", 0.75], ["C#5", 0.75], ["B5", 0.5], ["A5", 0.75], ["A#5", 0.75], ["C6", 0.5],          // 22
  ["C#6", 1.5], ["A#6", 2.5],                                                                   // 23
  ["A#6", 3], ["-", 1],                                                                         // 24
  ["G5", 2], ["F5", 2],                                                                         // 25
  ["E5", 2], ["D5", 2],                                                                         // 26
  ["F5", 1], ["E5", 0.5], ["B4", 0.5], ["-", 0.5], ["B4", 0.5], ["F5", 1],                      // 27
  ["E5", 0.5], ["B4", 0.5], ["-", 0.5], ["B4", 0.5], ["-", 2],                                  // 28
  ["F5", 2], ["D#5", 2],                                                                        // 29
  ["D5", 2], ["B4", 2],                                                                         // 30
  ["G5", 0.5], ["G5", 0.5], ["-", 1], ["G#5", 0.5], ["G5", 0.5], ["-", 1],                      // 31
  ["G5", 0.5], ["G5", 0.5], ["G#5", 0.5], ["G5", 0.5], ["A5", 0.5], ["G5", 0.5], ["B5", 0.5], ["G5", 0.5],   // 32
];

// os acordes de cada compasso (as cifras da partitura) e a guitarra socando em colcheias
const ACORDES = ["C", "C", "C", "C", "C", "C", "C", "C", "A#", "A#", "C", "C", "D", "D", "G", "G",
                 "C", "C", "C", "C", "C", "C", "C", "C", "A#", "A#", "C", "C", "D", "D", "G", "G"];
const soca = (raiz, o) => Array.from({ length: 8 }, () => [raiz + o, 0.5]);
const RITMO = [
  ...oitava(RIFF_1, -1),                                                     // 1-8: o riff, grave
  ...ACORDES.slice(8, 16).flatMap((r) => soca(r, 3)),                         // 9-16
  ...oitava(RIFF_2, -1),                                                     // 17-24: o riff de volta
  ...ACORDES.slice(24).flatMap((r) => soca(r, 3)),                            // 25-32
];
const BAIXO = RITMO.map(([n, d]) => [n === "-" ? n : sobe(n, -12), d]);
const compasso = (prato) => [prato ? "KC" : "K", "K", "KS", "K", "K", "K", "KS", "K"].map((p) => [p, 0.5]);
const BATERIA = Array.from({ length: 32 }, (_, c) => compasso(c % 4 === 0)).flat();

export const MEGA_DESC_MUSIC = {
  megaDescontrolada: {
    bpm: 175,
    tracks: [
      { guitarra: true, acorde: [0, 12], ganho: 65, vol: 0.5, legato: 0.92, vibrato: { hz: 6.5, cents: 30 }, notes: MELODIA },
      { guitarra: true, abafado: true, acorde: [0, 7, 12], ganho: 85, vol: 0.4, legato: 0.7, notes: RITMO },
      { wave: "triangle", vol: 0.62, legato: 0.8, notes: BAIXO },
      { wave: "bateria", vol: 0.6, notes: BATERIA },
    ],
  },
};
