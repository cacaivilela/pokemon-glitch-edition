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

// Atalhos de arranjo — repetir compasso inteiro à mão em faixa de 200 tempos
// (a ABERTURA) é onde o erro de conta aparece. Cada um devolve UM compasso de
// 4 tempos, menos os que recebem quantidade.

/** um compasso de contratempo: pausa-nota, pausa-nota... o "um-PÁ um-PÁ" */
const contratempo = (a, b, c, d) =>
  [["-", 0.5], [a, 0.5], ["-", 0.5], [b, 0.5], ["-", 0.5], [c, 0.5], ["-", 0.5], [d, 0.5]];
/** um compasso martelando a mesma nota no tempo forte */
const martelo = (n) => [[n, 0.5], ["-", 0.5], [n, 0.5], ["-", 0.5], [n, 0.5], ["-", 0.5], [n, 0.5], ["-", 0.5]];
/** um compasso de quatro semínimas — o baixo parado em cima do acorde */
const raiz = (a, b, c, d) => [[a, 1], [b, 1], [c, 1], [d, 1]];
/** um compasso de baixo caminhando: tônica, tônica, quinta, tônica (x2) */
const anda = (r, q) => [[r, 0.5], [r, 0.5], [q, 0.5], [r, 0.5], [r, 0.5], [r, 0.5], [q, 0.5], [r, 0.5]];
/** n colcheias na mesma nota (padrão: um compasso cheio) */
const oitavos = (n, qtd = 8) => Array.from({ length: qtd }, () => [n, 0.5]);
/** n compassos de marcha: bumbo no tempo, caixa no contratempo */
const marcha = (n) => Array.from({ length: n },
  () => [["x", 1], ["x", 0.5], ["-", 0.5], ["x", 1], ["x", 0.5], ["x", 0.5]]).flat();
/** n compassos de galope: o dobro de batida, pro DUELO ficar ofegante */
const galope = (n) => Array.from({ length: n },
  () => [["x", 0.5], ["x", 0.5], ["x", 0.5], ["x", 0.5], ["x", 0.5], ["x", 0.5], ["x", 0.25], ["x", 0.25], ["x", 0.5]]).flat();
/** um compasso de bateria desmontada, pro CAOS */
const quebrado = () => [["x", 0.25], ["x", 0.25], ["-", 0.5], ["x", 0.25], ["-", 0.75], ["x", 0.5], ["-", 1.5]];

export const MUSIC = {
  // ABERTURA: a fanfarra de antes do título — e a faixa mais longa do jogo,
  // porque a abertura inteira roda em cima dela. São 200 tempos a 150 bpm, ou
  // seja 80 segundos exatos, divididos em onze trechos que batem um a um com as
  // fases de `src/scenes/abertura.js`. Mexer no comprimento de um trecho aqui
  // exige mexer nos `beats` da fase correspondente lá, senão a imagem
  // desencontra da música — é o único acoplamento do arquivo, e é de propósito.
  //
  //   FANFARRA 10 · FITA 12 · MUNDO 24 · ARRANQUE 14 · DESFILE 24 · LENDÁRIOS 16
  //   TREINADOR 16 · DUELO 28 · RIVAL 14 · CAOS 18 · FINAL 24
  //
  // A melodia é nossa: a regra do cabeçalho vale aqui também. Quem quiser a
  // abertura de verdade tocando põe o arquivo em `assets/music/abertura.ogg`,
  // que o `Audio2.playMusic` prefere o arquivo quando ele existe.
  abertura: {
    bpm: 150,
    tracks: [
      { ...melodia(0.55), notes: [
        // FANFARRA — o metal chamando, três notas subindo e um agudo que segura
        ["G4", 0.5], ["C5", 0.5], ["E5", 0.5], ["G5", 0.5], ["C6", 1.5], ["-", 0.5],
        ["G5", 0.5], ["A5", 0.5], ["G5", 0.5], ["E5", 0.5], ["C5", 1], ["-", 1],
        ["G4", 0.5], ["A#4", 0.5], ["-", 1],
        // FITA — o cartucho sendo lido: nota solta, silêncio, nota solta
        ["-", 1], ["E5", 0.25], ["-", 0.25], ["E5", 0.25], ["-", 0.25], ["D5", 1], ["-", 1],
        ["-", 1], ["G4", 0.5], ["A#4", 0.5], ["C5", 1], ["-", 1],
        ["-", 0.5], ["D#5", 0.25], ["-", 0.25], ["C5", 0.5], ["-", 0.5], ["A#4", 2],
        // MUNDO — abre em maior, o tema largo de quem vê Kanto de cima
        ["C5", 1], ["E5", 0.5], ["G5", 1.5], ["E5", 1],
        ["F5", 1], ["E5", 0.5], ["D5", 1.5], ["C5", 1],
        ["D5", 1], ["F5", 0.5], ["A5", 1.5], ["G5", 1],
        ["E5", 2], ["C5", 2],
        ["G5", 1], ["A5", 0.5], ["C6", 1.5], ["A5", 1],
        ["G5", 1], ["E5", 1], ["F5", 1], ["G5", 1],
        // ARRANQUE — vira menor e acelera: é aqui que a coisa sai correndo
        ["A4", 0.5], ["C5", 0.5], ["E5", 1], ["D5", 0.5], ["C5", 0.5], ["B4", 1],
        ["A4", 0.5], ["C5", 0.5], ["E5", 1], ["G5", 0.5], ["E5", 0.5], ["D5", 1],
        ["C5", 0.5], ["D5", 0.5], ["E5", 0.5], ["G5", 0.5], ["A5", 2],
        ["B5", 0.5], ["A5", 0.5], ["G5", 0.5], ["E5", 0.5],
        // DESFILE — o tema principal, o que a pessoa vai lembrar depois
        ["E5", 0.5], ["A5", 0.5], ["G5", 0.5], ["E5", 0.5], ["D5", 1], ["C5", 1],
        ["D5", 0.5], ["E5", 0.5], ["D5", 0.5], ["C5", 0.5], ["A4", 2],
        ["E5", 0.5], ["A5", 0.5], ["G5", 0.5], ["B5", 0.5], ["A5", 1], ["G5", 1],
        ["F5", 0.5], ["E5", 0.5], ["D5", 0.5], ["C5", 0.5], ["E5", 2],
        ["G5", 0.5], ["A5", 0.5], ["B5", 0.5], ["C6", 0.5], ["B5", 1], ["A5", 1],
        ["G5", 0.5], ["F5", 0.5], ["E5", 0.5], ["D5", 0.5], ["A5", 2],
        // LENDÁRIOS — notas longas, o tempo parece afrouxar sem mudar de bpm
        ["A5", 2], ["G5", 1], ["E5", 1],
        ["F5", 2], ["E5", 1], ["D5", 1],
        ["G5", 1.5], ["A5", 0.5], ["C6", 2],
        ["B5", 1], ["A5", 1], ["E5", 2],
        // TREINADOR — heroico, em fá, o passo de quem chega pra brigar
        ["F5", 0.5], ["G5", 0.5], ["A5", 1], ["G5", 0.5], ["F5", 0.5], ["E5", 1],
        ["D5", 0.5], ["E5", 0.5], ["F5", 1], ["E5", 0.5], ["D5", 0.5], ["C5", 1],
        ["A#5", 0.5], ["A5", 0.5], ["G5", 1], ["F5", 0.5], ["G5", 0.5], ["A5", 1],
        ["C6", 0.5], ["A5", 0.5], ["F5", 0.5], ["A5", 0.5], ["G5", 2],
        // DUELO — ré menor, nota repetida e curta: a faixa fica ofegante
        ["D5", 0.25], ["-", 0.25], ["D5", 0.25], ["-", 0.25], ["F5", 0.5], ["E5", 0.5], ["D5", 1], ["A4", 1],
        ["D5", 0.25], ["-", 0.25], ["D5", 0.25], ["-", 0.25], ["G5", 0.5], ["F5", 0.5], ["E5", 2],
        ["A5", 0.5], ["G5", 0.5], ["F5", 0.5], ["E5", 0.5], ["D5", 0.5], ["C5", 0.5], ["A#4", 1],
        ["A4", 0.5], ["C5", 0.5], ["D5", 0.5], ["F5", 0.5], ["A5", 1], ["D6", 1],
        ["C6", 0.5], ["A#5", 0.5], ["A5", 0.5], ["G5", 0.5], ["F5", 0.5], ["E5", 0.5], ["D5", 1],
        ["D6", 0.5], ["A5", 0.5], ["F5", 0.5], ["D5", 0.5], ["A#5", 1], ["A5", 1],
        ["G5", 0.5], ["A5", 0.5], ["A#5", 0.5], ["C6", 0.5], ["D6", 2],
        // RIVAL — sincopado e metido, com as pausas no lugar do tempo forte
        ["G5", 0.5], ["-", 0.5], ["A#5", 0.5], ["-", 0.5], ["A5", 1], ["G5", 1],
        ["F5", 0.5], ["-", 0.5], ["G5", 0.5], ["-", 0.5], ["D5", 2],
        ["A#4", 0.5], ["D5", 0.5], ["F5", 0.5], ["A#5", 0.5], ["A5", 1], ["F5", 1],
        ["G5", 1], ["D5", 1],
        // CAOS — cromática despencando: a melodia perde o tom de propósito
        ["D#5", 0.25], ["D5", 0.25], ["C#5", 0.25], ["C5", 0.25], ["B4", 0.25], ["A#4", 0.25], ["A4", 0.25], ["G#4", 0.25], ["G4", 1], ["-", 1],
        ["-", 0.5], ["F#5", 0.25], ["-", 0.25], ["C5", 0.25], ["-", 0.25], ["A#5", 0.5], ["-", 0.5], ["E5", 0.25], ["-", 0.25], ["G#4", 1],
        ["C5", 0.25], ["D#5", 0.25], ["F#5", 0.25], ["A5", 0.25], ["C6", 0.25], ["D#6", 0.25], ["F#6", 0.5], ["-", 2],
        ["A#5", 0.25], ["-", 0.25], ["A#5", 0.25], ["-", 0.25], ["E5", 0.25], ["-", 0.25], ["E5", 0.25], ["-", 0.25], ["C#6", 2],
        ["G6", 0.5], ["F#6", 0.5], ["C6", 1],
        // FINAL — volta pra dó maior e sobe até o acorde que entrega o logo
        ["G5", 0.5], ["C6", 0.5], ["E6", 1], ["D6", 0.5], ["C6", 0.5], ["G5", 1],
        ["A5", 0.5], ["C6", 0.5], ["F6", 1], ["E6", 0.5], ["D6", 0.5], ["C6", 1],
        ["E6", 0.5], ["D6", 0.5], ["C6", 0.5], ["G5", 0.5], ["A5", 1], ["B5", 1],
        ["C6", 2], ["G5", 1], ["E5", 1],
        ["G5", 0.5], ["A5", 0.5], ["B5", 0.5], ["C6", 0.5], ["D6", 1], ["E6", 1],
        ["C6", 4],
      ] },
      { ...contra(0.22), notes: [
        // FANFARRA
        ["-", 0.5], ["E4", 0.5], ["-", 0.5], ["G4", 0.5], ["-", 0.5], ["C5", 0.5], ["-", 0.5], ["G4", 0.5],
        ["-", 0.5], ["E4", 0.5], ["-", 0.5], ["C4", 0.5], ["G4", 1], ["-", 1],
        ["-", 2],
        // FITA
        ["-", 4],
        ["-", 0.5], ["D#4", 0.5], ["-", 0.5], ["G4", 0.5], ["-", 2],
        ["-", 0.5], ["C4", 0.5], ["-", 0.5], ["D#4", 0.5], ["-", 2],
        // MUNDO
        ...contratempo("C4", "E4", "G4", "E4"),
        ...contratempo("F4", "A4", "C5", "A4"),
        ...contratempo("D4", "F4", "A4", "F4"),
        ...contratempo("C4", "E4", "G4", "C5"),
        ...contratempo("F4", "A4", "C5", "A4"),
        ...contratempo("G4", "B4", "D5", "G5"),
        // ARRANQUE
        ...contratempo("A4", "E4", "A4", "E4"),
        ...contratempo("G4", "D4", "G4", "B4"),
        ...contratempo("C5", "G4", "E4", "A4"),
        ["-", 0.5], ["E5", 0.5], ["-", 0.5], ["A4", 0.5],
        // DESFILE
        ...contratempo("A4", "C5", "E5", "C5"),
        ...contratempo("F4", "A4", "C5", "A4"),
        ...contratempo("G4", "B4", "D5", "B4"),
        ...contratempo("E4", "G#4", "B4", "E5"),
        ...contratempo("A4", "C5", "E5", "C5"),
        ...contratempo("E4", "G#4", "B4", "E5"),
        // LENDÁRIOS — o contracanto rareia pra deixar a melodia grande
        ["-", 0.5], ["A4", 0.5], ["-", 0.5], ["E5", 0.5], ["-", 0.5], ["A5", 0.5], ["-", 1],
        ["-", 0.5], ["F4", 0.5], ["-", 0.5], ["C5", 0.5], ["-", 0.5], ["F5", 0.5], ["-", 1],
        ["-", 0.5], ["G4", 0.5], ["-", 0.5], ["D5", 0.5], ["-", 0.5], ["G5", 0.5], ["-", 1],
        ["-", 0.5], ["E4", 0.5], ["-", 0.5], ["B4", 0.5], ["-", 0.5], ["E5", 0.5], ["-", 1],
        // TREINADOR
        ...contratempo("F4", "A4", "C5", "A4"),
        ...contratempo("D4", "F4", "A4", "F4"),
        ...contratempo("A#4", "D5", "F5", "D5"),
        ...contratempo("C5", "E5", "G5", "E5"),
        // DUELO — agora no tempo forte, martelando
        ...martelo("D4"), ...martelo("A4"),
        ["A#4", 0.5], ["-", 0.5], ["A#4", 0.5], ["-", 0.5], ["A4", 0.5], ["-", 0.5], ["A4", 0.5], ["-", 0.5],
        ["D5", 0.5], ["-", 0.5], ["F5", 0.5], ["-", 0.5], ["A5", 0.5], ["-", 0.5], ["D5", 0.5], ["-", 0.5],
        ["C5", 0.5], ["-", 0.5], ["A#4", 0.5], ["-", 0.5], ["A4", 0.5], ["-", 0.5], ["G4", 0.5], ["-", 0.5],
        ...martelo("A#4"),
        ["G4", 0.5], ["-", 0.5], ["A4", 0.5], ["-", 0.5], ["A#4", 0.5], ["-", 0.5], ["C5", 0.5], ["-", 0.5],
        // RIVAL
        ...contratempo("G4", "A#4", "D5", "A#4"),
        ...contratempo("D4", "F4", "A4", "F4"),
        ...contratempo("A#4", "D5", "F5", "D5"),
        ["-", 0.5], ["G4", 0.5], ["-", 0.5], ["D5", 0.5],
        // CAOS
        ["-", 0.25], ["G#4", 0.25], ["-", 0.25], ["D5", 0.25], ["-", 0.25], ["G#4", 0.25], ["-", 0.25], ["D5", 0.25], ["-", 2],
        ["C#5", 0.25], ["-", 0.75], ["F#4", 0.25], ["-", 0.75], ["A#4", 0.25], ["-", 1.75],
        ["-", 1], ["D#5", 0.5], ["-", 0.5], ["F#5", 0.5], ["-", 1.5],
        ["A#4", 0.25], ["-", 0.25], ["E4", 0.25], ["-", 0.25], ["A#4", 0.25], ["-", 0.25], ["E4", 0.25], ["-", 0.25], ["-", 2],
        ["-", 2],
        // FINAL
        ...contratempo("E5", "G5", "C6", "G5"),
        ...contratempo("F5", "A5", "C6", "A5"),
        ...contratempo("G5", "B5", "D6", "B5"),
        ...contratempo("E5", "G5", "C6", "E6"),
        ...contratempo("D5", "G5", "B5", "D6"),
        ["E5", 4],
      ] },
      { ...baixo(0.6), notes: [
        // FANFARRA
        ["C3", 1], ["C3", 1], ["G2", 1], ["G2", 1],
        ["C3", 1], ["C3", 1], ["F2", 1], ["F2", 1],
        ["G2", 2],
        // FITA
        ["C3", 2], ["-", 2],
        ["G#2", 2], ["G2", 2],
        ["C3", 2], ["A#2", 2],
        // MUNDO
        ...raiz("C3", "C3", "G2", "C3"),
        ...raiz("F2", "F2", "C3", "F2"),
        ...raiz("D3", "D3", "A2", "D3"),
        ...raiz("C3", "C3", "G2", "E2"),
        ...raiz("F2", "F2", "C3", "F2"),
        ...raiz("G2", "G2", "D3", "G2"),
        // ARRANQUE — o baixo passa a caminhar em colcheias
        ...anda("A2", "E3"), ...anda("G2", "D3"),
        ["F2", 0.5], ["F2", 0.5], ["C3", 0.5], ["F2", 0.5], ["E2", 0.5], ["E2", 0.5], ["B2", 0.5], ["E2", 0.5],
        ["A2", 0.5], ["A2", 0.5], ["A2", 0.5], ["E3", 0.5],
        // DESFILE
        ...raiz("A2", "A2", "E3", "A2"),
        ...raiz("F2", "F2", "C3", "F2"),
        ...raiz("G2", "G2", "D3", "G2"),
        ...raiz("E2", "E2", "B2", "E3"),
        ...raiz("A2", "A2", "E3", "A2"),
        ...raiz("E2", "E2", "E2", "B2"),
        // LENDÁRIOS
        ["A2", 2], ["E3", 2],
        ["F2", 2], ["C3", 2],
        ["G2", 2], ["D3", 2],
        ["E2", 2], ["B2", 2],
        // TREINADOR
        ...raiz("F2", "F2", "C3", "F2"),
        ...raiz("D3", "D3", "A2", "D3"),
        ...raiz("A#2", "A#2", "F3", "A#2"),
        ...raiz("C3", "C3", "G2", "C3"),
        // DUELO — oitavos secos, sem respiro
        ...oitavos("D2"), ...oitavos("D2"),
        ...oitavos("A#2", 4), ...oitavos("A2", 4),
        ...oitavos("D2", 4), ...oitavos("F2", 4),
        ...oitavos("C3", 2), ...oitavos("A#2", 2), ...oitavos("A2", 2), ...oitavos("G2", 2),
        ...oitavos("A#2"),
        ...oitavos("A2", 4), ...oitavos("D2", 4),
        // RIVAL
        ...raiz("G2", "G2", "D3", "G2"),
        ...raiz("D3", "D3", "A2", "D3"),
        ...raiz("A#2", "A#2", "F3", "A#2"),
        ["G2", 1], ["D3", 1],
        // CAOS
        ...oitavos("G#2"),
        ...oitavos("F#2"),
        ["C2", 1], ["D#2", 1], ["F#2", 1], ["A2", 1],
        ...oitavos("C2"),
        ["G2", 1], ["G2", 1],
        // FINAL
        ...raiz("C3", "C3", "G2", "C3"),
        ...raiz("F2", "F2", "C3", "F2"),
        ...raiz("G2", "G2", "D3", "G2"),
        ...raiz("C3", "C3", "G2", "E2"),
        ...raiz("G2", "G2", "G2", "B2"),
        ["C3", 4],
      ] },
      // Percussão: tímpano na fanfarra, bateria de marcha no meio, e no CAOS
      // ela se desmancha junto com a melodia.
      { wave: "ruido", vol: 0.5, notes: [
        // FANFARRA
        ["x", 0.5], ["-", 0.5], ["x", 0.5], ["-", 0.5], ["x", 0.25], ["x", 0.25], ["x", 0.25], ["x", 0.25], ["x", 1],
        ["x", 1], ["-", 1], ["x", 0.5], ["x", 0.5], ["x", 1],
        ["x", 0.25], ["x", 0.25], ["x", 0.25], ["x", 0.25], ["x", 1],
        // FITA — silêncio, pra fita ficar sozinha
        ["-", 4],
        ["-", 3], ["x", 0.5], ["x", 0.5],
        ["x", 0.5], ["-", 1.5], ["x", 0.25], ["x", 0.25], ["x", 0.25], ["x", 0.25], ["-", 1],
        // MUNDO
        ...marcha(6),
        // ARRANQUE
        ...marcha(3),
        ["x", 0.5], ["x", 0.5], ["x", 0.25], ["x", 0.25], ["x", 0.5],
        // DESFILE
        ...marcha(6),
        // LENDÁRIOS
        ["x", 1], ["-", 1], ["x", 0.5], ["x", 0.5], ["x", 1],
        ["x", 1], ["-", 1], ["x", 0.5], ["x", 0.5], ["x", 1],
        ["x", 1], ["-", 1], ["x", 0.5], ["x", 0.5], ["x", 1],
        ["x", 0.25], ["x", 0.25], ["x", 0.25], ["x", 0.25], ["x", 0.5], ["x", 0.5], ["x", 1], ["x", 1],
        // TREINADOR
        ...marcha(4),
        // DUELO — dobra o compasso
        ...galope(7),
        // RIVAL
        ...marcha(3),
        ["x", 0.5], ["x", 0.5], ["x", 0.5], ["x", 0.5],
        // CAOS
        ...quebrado(), ...quebrado(),
        ["x", 0.25], ["x", 0.25], ["x", 0.25], ["x", 0.25], ["x", 0.25], ["x", 0.25], ["x", 0.25], ["x", 0.25],
        ["x", 0.5], ["x", 0.5], ["x", 0.5], ["x", 0.5],
        ...quebrado(),
        ["x", 0.25], ["x", 0.25], ["x", 0.25], ["x", 0.25], ["x", 0.25], ["x", 0.25], ["x", 0.25], ["x", 0.25],
        // FINAL
        ...marcha(5),
        ["x", 0.5], ["-", 3.5],
      ] },
    ],
  },

  // Tela de título: animada. Era solene e devagar, e tela de menu não é lugar
  // de faixa solene — a pessoa fica ali parada escolhendo CONTINUAR, e o que
  // toca embaixo é o que dá o humor do jogo inteiro. Agora tem bateria, o baixo
  // caminha em colcheias e a melodia anda em vez de segurar acorde.
  //
  // Os quatro canais têm comprimentos DIFERENTES de propósito (32, 24, 16 e 12
  // tempos): eles só se reencontram a cada 96 tempos, uns 42 segundos, então
  // ninguém parado no menu ouve o mesmo laço duas vezes seguidas.
  titulo: {
    bpm: 138,
    tracks: [
      { ...melodia(0.52), notes: [
        ["G4", 0.5], ["C5", 0.5], ["E5", 0.5], ["G5", 0.5], ["E5", 1], ["C5", 1],
        ["D5", 0.5], ["E5", 0.5], ["F5", 0.5], ["E5", 0.5], ["D5", 2],
        ["F5", 0.5], ["A5", 0.5], ["G5", 0.5], ["F5", 0.5], ["E5", 1], ["C5", 1],
        ["D5", 0.5], ["E5", 0.5], ["G5", 1], ["C5", 2],
        ["E5", 0.5], ["G5", 0.5], ["C6", 0.5], ["B5", 0.5], ["A5", 1], ["G5", 1],
        ["A5", 0.5], ["G5", 0.5], ["E5", 0.5], ["D5", 0.5], ["C5", 2],
        ["D5", 0.5], ["F5", 0.5], ["A5", 0.5], ["G5", 0.5], ["F5", 1], ["D5", 1],
        ["E5", 0.5], ["D5", 0.5], ["C5", 1], ["G4", 0.5], ["A4", 0.5], ["C5", 1],
      ] },
      { ...contra(0.2), notes: [
        ...contratempo("C4", "E4", "G4", "E4"),
        ...contratempo("F4", "A4", "C5", "A4"),
        ...contratempo("G4", "B4", "D5", "B4"),
        ...contratempo("E4", "G4", "C5", "G4"),
        ...contratempo("D4", "F4", "A4", "F4"),
        ...contratempo("G4", "B4", "D5", "G5"),
      ] },
      { ...baixo(0.58), notes: [
        ...anda("C3", "G2"),
        ...anda("F2", "C3"),
        ...anda("G2", "D3"),
        ["E2", 0.5], ["E2", 0.5], ["B2", 0.5], ["E2", 0.5],
        ["A2", 0.5], ["A2", 0.5], ["E3", 0.5], ["G2", 0.5],
      ] },
      // três compassos, o último com virada: a bateria desencaixa das frases de
      // quatro da melodia e a faixa nunca cai no mesmo lugar duas vezes
      { wave: "ruido", vol: 0.34, notes: [
        ["x", 1], ["x", 0.5], ["-", 0.5], ["x", 1], ["x", 0.5], ["x", 0.5],
        ["x", 1], ["x", 0.5], ["-", 0.5], ["x", 1], ["x", 0.5], ["x", 0.5],
        ["x", 1], ["x", 0.5], ["-", 0.5], ["x", 0.5], ["x", 0.5],
        ["x", 0.25], ["x", 0.25], ["x", 0.25], ["x", 0.25],
      ] },
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
