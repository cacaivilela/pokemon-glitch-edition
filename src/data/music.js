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

  // AS TRÊS ERAS (src/data/eras.js). São três faixas e não uma porque o lugar é
  // o mesmo três vezes: se o mapa é o mesmo vale em anos diferentes, o que
  // conta pro jogador que ele viajou é o OUVIDO.

  // 66 MILHÕES DE ANOS ATRÁS: grave, lenta e sem semitom nenhum — a melodia é
  // pentatônica, que é a escala que soa "antes de tudo". O tambor é o dobro do
  // resto: aqui embaixo, o que existe é passo de bicho grande.
  era_fosseis: {
    bpm: 76,
    tracks: [
      { ...melodia(0.34), notes: [
        ["D3", 3], ["F3", 1], ["G3", 2], ["D3", 2],
        ["A3", 3], ["G3", 1], ["F3", 2], ["D3", 2],
        ["C3", 4], ["D3", 4],
      ] },
      { ...contra(0.14), notes: [
        ["D4", 1], ["-", 1], ["F4", 1], ["-", 1], ["C4", 1], ["-", 1], ["D4", 1], ["-", 1],
      ] },
      { ...baixo(0.62), notes: [...raiz("D1", "D1", "F1", "D1"), ...raiz("C1", "C1", "D1", "D1")] },
      { wave: "ruido", vol: 0.5, notes: [
        ["x", 2], ["-", 2], ["x", 1], ["x", 1], ["-", 2],
        ["x", 2], ["-", 2], ["x", 1], ["-", 3],
      ] },
    ],
  },

  // 4 MILHÕES: o vale dos PARADOXOS. Mesma pentatônica de cima, um tom acima e
  // três vezes mais rápida — é o mesmo mundo já com pressa. O `glitch` baixinho
  // é a única coisa que lembra de onde esses bichos saíram.
  era_paradoxo: {
    bpm: 104,
    glitch: 0.03,
    tracks: [
      { ...melodia(0.42), notes: [
        ["E4", 1], ["G4", 0.5], ["A4", 0.5], ["B4", 1], ["A4", 1],
        ["G4", 1], ["E4", 0.5], ["D4", 0.5], ["E4", 2],
        ["B4", 1], ["D5", 0.5], ["E5", 0.5], ["D5", 1], ["B4", 1],
        ["A4", 1.5], ["G4", 0.5], ["E4", 2],
      ] },
      { ...contra(0.2), notes: contratempo("B3", "E4", "G4", "E4") },
      { ...baixo(0.55), notes: [...anda("E1", "B1"), ...anda("C2", "G1")] },
      bateria(0.4),
    ],
  },

  // O FUTURO: nada de tambor de pele — a percussão é chiado curto, o baixo é
  // serra e a melodia anda em quartas, que é o intervalo que não escolhe se é
  // alegre ou triste. A faixa é mais rápida que as duas e mesmo assim soa
  // parada: tudo aqui é repetição exata, de propósito.
  era_futuro: {
    bpm: 138,
    glitch: 0.05,
    tracks: [
      { ...melodia(0.38), notes: [
        ["A4", 1], ["D5", 1], ["A4", 1], ["E5", 1],
        ["A4", 1], ["D5", 1], ["G5", 1.5], ["F5", 0.5],
        ["E5", 2], ["A4", 2],
      ] },
      { wave: "sawtooth", vol: 0.16, legato: 0.4, notes: [
        ["A3", 0.25], ["E4", 0.25], ["A4", 0.25], ["E4", 0.25],
        ["G3", 0.25], ["D4", 0.25], ["G4", 0.25], ["D4", 0.25],
      ] },
      { wave: "triangle", vol: 0.6, notes: [...oitavos("A1"), ...oitavos("G1")] },
      { wave: "ruido", vol: 0.2, notes: [
        ["x", 0.5], ["-", 0.5], ["x", 0.25], ["x", 0.25], ["-", 0.5],
        ["x", 0.5], ["-", 1], ["x", 0.5],
      ] },
    ],
  },
};

/** música de cada tipo de mapa; o que não estiver aqui cai em pallet */
export const MUSIC_ALIAS = {};

// ---------------------------------------------------------------- EVOLUÇÃO
// Tema ORIGINAL (nada transcrito), no espírito das evoluções de GBA: ostinato
// insistente de duas notas, solo "tam, tam, tam... ta-RAM", e a frase
// inteira subindo de tom (E -> F# -> G# -> B) pra tensão ir crescendo enquanto
// o bicho se desmancha. Arranjo de banda: guitarra solo, guitarra base, pulso
// no ostinato, baixo e bateria em meio-tempo. Um arquivo seu em
// assets/music/evolucao.ogg toca no lugar (é só pra sua máquina, .gitignore).
const NOMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
/** "E2" + 7 semitons -> "B2" */
function sobe(nota, semi) {
  const m = /^([A-G]#?)(-?\d)$/.exec(nota);
  const n = NOMES.indexOf(m[1]) + (+m[2]) * 12 + semi;
  return NOMES[((n % 12) + 12) % 12] + Math.floor(n / 12);
}
const TONS = [0, 2, 4, 7];                       // E, F#, G#, B: sobe a cada frase
// [semitons acima da raiz | null = pausa, tempos]; cada frase tem 8 tempos
// (2 compassos), então as quatro somam 32 tempos = 12,8 s a 150 bpm.
// Ostinato: quinta e sexta menor se revezando sem parar — a "agonia" da mudança.
const OSTINATO = Array.from({ length: 16 }, (_, i) => [i % 2 ? 20 : 19, 0.5]);
// Solo no ritmo "tam, tam, tam, tam, tam, tam, tam, ta-RAM": sete batidas
// curtas e iguais, e um floreio rápido subindo no fim de cada frase.
const SOLO = [[12, 1], [12, 1], [12, 1], [12, 1], [15, 1], [15, 1], [15, 1], [17, 0.25], [19, 0.75]];
// Base: um acorde por compasso (raiz, depois a sexta menor), deixando soar.
const BASE = [[0, 4], [8, 4]];
const BAIXO = [0, 0, 12, 0, 0, 0, 12, 0, 8, 8, 20, 8, 8, 8, 20, 8].map((o) => [o, 0.5]);
// Bateria acompanhando os "tam" (bumbo e caixa revezando em cada um) e
// batendo junto no "ta-RAM"; virada de tons na última frase.
const TAMS = ["KC", "H", "S", "H", "K", "H", "S", "H", "K", "H", "S", "H", "K", "H"].map((p) => [p, 0.5]);
const TARAM = [["S", 0.25], ["KS", 0.75]];
const VIRADA = ["KC", "H", "S", "H", "K", "H", "S", "H", "T", "T", "T", "S", "S", "S"].map((p) => [p, 0.5]);
const frase = (raiz, pares) => TONS.flatMap((t) => pares.map(([o, d]) => [o === null ? "-" : sobe(raiz, t + o), d]));

MUSIC.evolucao = {
  bpm: 150,
  tracks: [
    { guitarra: true, acorde: [0, 12], ganho: 40, vol: 0.6, eco: true, legato: 0.55,
      vibrato: { hz: 5.5, cents: 30 }, notes: frase("E3", SOLO) },
    { wave: "pulso", duty: 0.125, vol: 0.12, legato: 0.6, eco: true, notes: frase("E3", OSTINATO) },
    { guitarra: true, acorde: [0, 7, 12], ganho: 25, vol: 0.38, legato: 0.98, notes: frase("E2", BASE) },
    { wave: "triangle", vol: 0.6, legato: 0.8, notes: frase("E2", BAIXO) },
    { wave: "bateria", vol: 0.55,
      notes: [...TAMS, ...TARAM, ...TAMS, ...TARAM, ...TAMS, ...TARAM, ...VIRADA, ...TARAM] },
  ],
};

// a fanfarra do BUUM: toca uma vez (a pausa longa no fim segura o loop)
const UMA_VEZ = ["-", 64];
MUSIC.evolucao_fanfarra = {
  bpm: 150,
  tracks: [
    { guitarra: true, acorde: [0, 12], ganho: 40, vol: 0.6, eco: true, legato: 0.95,
      vibrato: { hz: 5.5, cents: 35 },
      notes: [["B4", 0.5], ["B4", 0.5], ["B4", 0.5], ["E5", 1.5], ["D#5", 0.5], ["E5", 0.5], ["G#5", 0.5], ["B5", 3], UMA_VEZ] },
    { guitarra: true, acorde: [0, 7, 12], ganho: 25, vol: 0.5, legato: 0.95,
      notes: [["E2", 0.5], ["E2", 0.5], ["E2", 0.5], ["E2", 1.5], ["B1", 1.5], ["E2", 3], UMA_VEZ] },
    { wave: "triangle", vol: 0.6, legato: 0.9,
      notes: [["E2", 0.5], ["E2", 0.5], ["E2", 0.5], ["E2", 1.5], ["B1", 1.5], ["E2", 3], UMA_VEZ] },
    { wave: "bateria", vol: 0.6,
      notes: [["S", 0.5], ["S", 0.5], ["S", 0.5], ["KC", 1.5], ["S", 0.5], ["S", 0.5], ["S", 0.5], ["KC", 3], UMA_VEZ] },
  ],
};

// a festa depois da fanfarra: toca em loop enquanto o "PARABÉNS! SEU X
// EVOLUIU PARA Y!" está na tela. Tema ORIGINAL em E maior, I-vi-IV-V
// (E, C#m, A, B), 8 compassos: guitarra mais limpa no solo, arpejo no pulso,
// guitarra base abafada, baixo e bateria animada.
const ACORDES = [
  ["E4", "G#4", "B4", "G#4"], ["C#4", "E4", "G#4", "E4"],
  ["A3", "C#4", "E4", "C#4"], ["B3", "D#4", "F#4", "D#4"],
];
const RAIZES = ["E2", "C#2", "A1", "B1"];
const doisCiclos = (f) => [...ACORDES.flatMap(f), ...ACORDES.flatMap(f)];
MUSIC.evolucao_festa = {
  bpm: 150,
  tracks: [
    { guitarra: true, acorde: [0, 12], ganho: 12, vol: 0.5, eco: true, legato: 0.9,
      vibrato: { hz: 5.5, cents: 20 },
      notes: [
        ["B4", 1], ["G#4", 0.5], ["B4", 0.5], ["E5", 1], ["D#5", 1],
        ["C#5", 1.5], ["B4", 0.5], ["G#4", 2],
        ["A4", 0.5], ["B4", 0.5], ["C#5", 1], ["E5", 1], ["C#5", 1],
        ["D#5", 1], ["F#5", 1], ["E5", 0.5], ["D#5", 0.5], ["B4", 1],
        ["E5", 1], ["G#5", 1], ["F#5", 0.5], ["E5", 0.5], ["B4", 1],
        ["C#5", 1], ["E5", 1], ["G#5", 2],
        ["F#5", 1], ["E5", 0.5], ["C#5", 0.5], ["A4", 1], ["C#5", 1],
        ["B4", 1], ["D#5", 1], ["E5", 2],
      ] },
    { wave: "pulso", duty: 0.125, vol: 0.18, legato: 0.5, eco: true,
      notes: doisCiclos((a) => [...a, ...a].map((n) => [n, 0.5])) },
    { guitarra: true, acorde: [0, 7, 12], abafado: true, ganho: 18, vol: 0.32, legato: 0.5,
      notes: [...RAIZES, ...RAIZES].flatMap((r) => Array.from({ length: 8 }, () => [sobe(r, 12), 0.5])) },
    { wave: "triangle", vol: 0.6, legato: 0.8,
      notes: [...RAIZES, ...RAIZES].flatMap((r) => [r, r, sobe(r, 12), r, r, r, sobe(r, 12), sobe(r, 7)].map((n) => [n, 0.5])) },
    { wave: "bateria", vol: 0.5,
      notes: [
        ...["KC", "H", "S", "H", "K", "K", "S", "H"],
        ...Array.from({ length: 6 }, () => ["K", "H", "S", "H", "K", "K", "S", "O"]).flat(),
        ...["K", "H", "S", "H", "S", "S", "T", "T"],
      ].map((p) => [p, 0.5]) },
  ],
};

// ------------------------------------------- A FUSÃO E A TROCA (as cutscenes)
// Temas ORIGINAIS, no arranjo de banda da EVOLUÇÃO: guitarra solo com eco e
// vibrato, uma segunda voz harmonizando, pulso no ostinato, guitarra base
// abafada, baixo em triângulo e bateria. Cada parte da música cai numa parte do
// filme (os tempos estão nas cenas), e as duas tocam UMA vez (a pausa longa no
// fim segura o loop); o BUUM é a fanfarra, e depois dela a festa da evolução.
const NADA = ["-", 64];
const vezes = (n, pares) => Array.from({ length: n }, () => pares).flat();
const em = (nomes, d) => nomes.map((n) => [n, d]);
/** um compasso de baixo andando: raiz, raiz, oitava, raiz... (como o da evolução) */
const baixoAndando = (r) => [r, r, sobe(r, 12), r, r, r, sobe(r, 12), sobe(r, 7)].map((n) => [n, 0.5]);
/** um compasso de guitarra base abafada: a raiz em colcheia */
const abafada = (r) => vezes(8, [[r, 0.5]]);
/** um compasso de arpejo em semicolcheia, subindo e descendo pelo acorde */
const arpejo = (notas) => em([...notas, ...notas.slice().reverse()].concat(notas, notas.slice().reverse()).slice(0, 16), 0.25);

// --- A FUSÃO (src/scenes/fusion.js): 32 tempos a 150 bpm = 12,8 s, em mi menor
//   0-8   ENCARAM-SE e se DESFAZEM: o chamado de quatro notas, abafado e bumbo
//   8-24  O REDEMOINHO: o tema (Em, C, D, B), com a segunda voz e o arpejo girando
//   24-28 SE JUNTAM: dó maior, as duas vozes subindo juntas
//   28-32 CARREGANDO: escala cromática, a caixa acelerando e — silêncio — BUUM
const FUS_TEMA = [
  ["B4", 0.5], ["E5", 0.5], ["G5", 0.75], ["F#5", 0.25], ["E5", 1], ["B4", 1],
  ["C5", 0.5], ["E5", 0.5], ["G5", 0.75], ["A5", 0.25], ["G5", 1], ["E5", 1],
  ["D5", 0.5], ["F#5", 0.5], ["A5", 0.75], ["G5", 0.25], ["F#5", 1], ["D5", 1],
  ["D#5", 0.5], ["F#5", 0.5], ["B5", 1.5], ["A5", 0.25], ["G5", 0.25], ["F#5", 1],
];
const FUS_SOBE = [["E5", 0.5], ["G5", 0.5], ["C6", 1], ["B5", 0.5], ["G5", 0.5], ["E5", 0.5], ["G5", 0.5]];
const CROMATICA = ["E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5"];
MUSIC.fusao = {
  bpm: 150,
  tracks: [
    // a guitarra solo: o chamado, o tema e a escalada
    { guitarra: true, acorde: [0, 12], ganho: 40, vol: 0.55, eco: true, legato: 0.6, vibrato: { hz: 5.5, cents: 30 },
      notes: [["-", 4], ["E5", 1], ["D#5", 1], ["E5", 1], ["B4", 1],
              ...FUS_TEMA, ...FUS_SOBE, ...em(CROMATICA, 0.25), ["B5", 1.5], ["-", 0.5], NADA] },
    // a segunda voz: uma terça abaixo no tema, uníssono na escalada
    { wave: "pulso", duty: 0.25, vol: 0.2, eco: true, detune: 6, legato: 0.7, vibrato: { hz: 6, cents: 15 },
      notes: [["-", 8], ...FUS_TEMA.map(([n, d]) => [sobe(n, -3), d]), ...FUS_SOBE.map(([n, d]) => [sobe(n, -4), d]),
              ...em(CROMATICA, 0.25), ["B5", 1.5], ["-", 0.5], NADA] },
    // o ostinato: a quinta e a sexta menor revezando (a agonia) e, no redemoinho, o arpejo girando
    { wave: "pulso", duty: 0.125, vol: 0.15, legato: 0.5, eco: true,
      notes: [...vezes(8, [["B4", 0.5], ["C5", 0.5]]),
              ...arpejo(["E4", "G4", "B4", "E5"]), ...arpejo(["C4", "E4", "G4", "C5"]),
              ...arpejo(["D4", "F#4", "A4", "D5"]), ...arpejo(["B3", "D#4", "F#4", "B4"]),
              ...arpejo(["C4", "E4", "G4", "C5"]), ...em(["B3", "D#4", "F#4", "B4"].concat(["D#5", "F#5", "B5", "F#5"]), 0.25),
              ...vezes(8, [["B4", 0.25]]), NADA] },
    // a guitarra base: o acorde soando no começo, depois abafada em colcheia
    { guitarra: true, acorde: [0, 7, 12], ganho: 25, vol: 0.36, legato: 0.95,
      notes: [["E2", 4], ["E2", 4], ["E2", 4], ["C2", 4], ["D2", 4], ["B1", 4], ["C2", 4], ["B1", 3.5], ["-", 0.5], NADA] },
    { guitarra: true, acorde: [0, 7, 12], abafado: true, ganho: 18, vol: 0.28, legato: 0.5,
      notes: [["-", 4], ...abafada("E3"), ...abafada("E3"), ...abafada("C3"), ...abafada("D3"), ...abafada("B2"),
              ...abafada("C3"), ...vezes(14, [["B2", 0.25]]), ["-", 0.5], NADA] },
    // o baixo andando
    { wave: "triangle", vol: 0.6, legato: 0.8,
      notes: [...vezes(8, [["E2", 0.5]]), ...baixoAndando("E2"), ...baixoAndando("E2"), ...baixoAndando("C2"),
              ...baixoAndando("D2"), ...baixoAndando("B1"), ...baixoAndando("C2"), ...vezes(14, [["B1", 0.25]]), ["-", 0.5], NADA] },
    // a bateria: bumbo e tons no começo, rock com prato no tema, a caixa dobrando e o rufo até o silêncio
    { wave: "bateria", vol: 0.55,
      notes: [...em(["K", "-", "K", "-", "K", "-", "K", "K"], 0.5), ...em(["K", "H", "K", "H", "T", "T", "S", "S"], 0.5),
              ...vezes(4, em(["KC", "H", "S", "H", "K", "K", "S", "O"], 0.5)),
              ...em(["KC", "S", "K", "S", "K", "S", "S", "S"], 0.5),
              ...vezes(2, [["S", 0.5]]), ...vezes(4, [["S", 0.25]]), ...vezes(8, [["S", 0.125]]), ["KC", 0.5], ["-", 0.5], NADA] },
  ],
};

// o BUUM da fusão: o mi maior estourando, com a segunda voz por baixo
MUSIC.fusao_fanfarra = {
  bpm: 150,
  tracks: [
    { guitarra: true, acorde: [0, 12], ganho: 40, vol: 0.6, eco: true, legato: 0.95, vibrato: { hz: 5.5, cents: 35 },
      notes: [["B4", 0.5], ["B4", 0.5], ["B4", 0.5], ["E5", 1.5], ["G#5", 0.5], ["F#5", 0.5], ["G#5", 0.5], ["B5", 3], NADA] },
    { wave: "pulso", duty: 0.25, vol: 0.22, eco: true, legato: 0.9,
      notes: [["G#4", 0.5], ["G#4", 0.5], ["G#4", 0.5], ["B4", 1.5], ["E5", 0.5], ["D#5", 0.5], ["E5", 0.5], ["G#5", 3], NADA] },
    { guitarra: true, acorde: [0, 7, 12], ganho: 25, vol: 0.5, legato: 0.95,
      notes: [["E2", 0.5], ["E2", 0.5], ["E2", 0.5], ["E2", 1.5], ["B1", 1.5], ["E2", 3], NADA] },
    { wave: "triangle", vol: 0.6, legato: 0.9, notes: [["E2", 1.5], ["E2", 1.5], ["B1", 1.5], ["E1", 3], NADA] },
    { wave: "bateria", vol: 0.6,
      notes: [["S", 0.5], ["S", 0.5], ["S", 0.5], ["KC", 1.5], ["S", 0.5], ["S", 0.5], ["S", 0.5], ["KC", 3], NADA] },
  ],
};

// --- A TROCA (src/scenes/trocanpc.js): 29 tempos a 150 bpm. Banda inteira
// desde o primeiro tempo, com o pulso fazendo o FLUXO DE DADOS do cabo em
// semicolcheia sem parar. PERGUNTA na guitarra solo (você), RESPOSTA no pulso
// brilhante (quem troca), e a frase SUBINDO DE TOM a cada parte, como a da
// evolução, até as duas vozes se trombarem no BIZARRO:
//   0-4   OS DOIS NA TELA (sol)    4-8 RACHAM (lá)    8-12 SE DESFAZEM (si)
//   12-20 SE MISTURAM: o tema, guitarra e harmonia (Em, C, D, G)
//   20-24 O BIZARRO: trilo de trítono, cromática despencando, tons rolando
//   24-25 BUUM    25-29 SE SEPARAM: a escala triunfal subindo, e a fanfarra
const tr = (pares, semi) => pares.map(([n, d]) => [n === "-" ? n : sobe(n, semi), d]);
const TR_PERGUNTA = [["D5", 0.25], ["D5", 0.25], ["G5", 0.5], ["B5", 1]];
const TR_RESPOSTA = [["C6", 0.25], ["B5", 0.25], ["A5", 0.5], ["G5", 1]];
// o tema: dois tempos por acorde (Em, C, D, G), subindo e caindo no fim de cada um
const TR_TEMA = [
  ["E5", 0.5], ["G5", 0.5], ["B5", 0.75], ["A5", 0.25],
  ["C5", 0.5], ["E5", 0.5], ["G5", 0.75], ["F#5", 0.25],
  ["D5", 0.5], ["F#5", 0.5], ["A5", 0.75], ["G5", 0.25],
  ["G5", 0.5], ["B5", 0.5], ["D6", 1],
];
/** 16 semicolcheias rodando num acorde: o fluxo de dados do cabo */
const fluxo = (a, b, c, n = 16) => em(Array.from({ length: n }, (_, k) => [a, b, c, b][k % 4]), 0.25);
const SUBIDA = ["G4", "B4", "D5", "G5", "B5", "D6", "G6", "D6"];
MUSIC.troca = {
  bpm: 150,
  tracks: [
    // a guitarra solo (você): a pergunta subindo de tom, o tema, o trilo e a escala triunfal
    { guitarra: true, acorde: [0, 12], ganho: 40, vol: 0.5, eco: true, legato: 0.6, vibrato: { hz: 5.5, cents: 30 },
      notes: [...TR_PERGUNTA, ["-", 2], ...tr(TR_PERGUNTA, 2), ["-", 2], ...tr(TR_PERGUNTA, 4), ["-", 2],
              ...TR_TEMA,
              ...vezes(8, em(["C#5", "G5"], 0.25)),
              ["-", 1],
              ...em(SUBIDA, 0.25), ["G6", 2], NADA] },
    // o pulso brilhante (quem troca): a resposta, a harmonia do tema e o trilo do outro lado
    { wave: "pulso", duty: 0.25, vol: 0.34, eco: true, detune: 8, legato: 0.8, vibrato: { hz: 6.2, cents: 16 },
      notes: [["-", 2], ...TR_RESPOSTA, ["-", 2], ...tr(TR_RESPOSTA, 2), ["-", 2], ...tr(TR_RESPOSTA, 4),
              ...TR_TEMA.map(([n, d]) => [sobe(n, -3), d]),
              ...vezes(8, em(["G4", "C#5"], 0.25)),
              ["-", 1],
              ...em(SUBIDA.slice().reverse().map((n) => sobe(n, -12)), 0.25), ["G4", 2], NADA] },
    // o fluxo de dados do cabo, sem parar
    { wave: "pulso", duty: 0.125, vol: 0.13, eco: true, legato: 0.5,
      notes: [...fluxo("G4", "B4", "D5"), ...fluxo("A4", "C#5", "E5"), ...fluxo("B4", "D#5", "F#5"),
              ...fluxo("E4", "G4", "B4", 8), ...fluxo("C4", "E4", "G4", 8), ...fluxo("D4", "F#4", "A4", 8), ...fluxo("G4", "B4", "D5", 8),
              ...em(Array.from({ length: 16 }, (_, k) => sobe("G5", -k)), 0.25),
              ["-", 1], ...fluxo("G5", "B5", "D6"), NADA] },
    // a guitarra base abafada em colcheia, seguindo o tom
    { guitarra: true, acorde: [0, 7, 12], abafado: true, ganho: 18, vol: 0.3, legato: 0.5,
      notes: [...abafada("G2"), ...abafada("A2"), ...abafada("B2"),
              ...vezes(4, [["E3", 0.5]]), ...vezes(4, [["C3", 0.5]]), ...vezes(4, [["D3", 0.5]]), ...vezes(4, [["G2", 0.5]]),
              ...vezes(16, [["C#3", 0.25]]), ["-", 1], ...abafada("G2"), NADA] },
    // a guitarra base solta: o acorde no começo de cada parte e o golpe do BUUM
    { guitarra: true, acorde: [0, 7, 12], ganho: 28, vol: 0.32, legato: 0.95,
      notes: [["G2", 4], ["A2", 4], ["B2", 4], ["E2", 2], ["C2", 2], ["D2", 2], ["G2", 2], ["-", 4], ["G2", 1], ["G2", 4], NADA] },
    // o baixo andando com o tom, despencando no bizarro
    { wave: "triangle", vol: 0.6, legato: 0.8,
      notes: [...baixoAndando("G1"), ...baixoAndando("A1"), ...baixoAndando("B1"),
              ...em(["E2", "E2", "E3", "E2", "C2", "C2", "C3", "C2", "D2", "D2", "D3", "D2", "G1", "G1", "G2", "D2"], 0.5),
              ["D2", 1], ["C#2", 1], ["C2", 1], ["B1", 1],
              ["G1", 1], ...baixoAndando("G1"), NADA] },
    // a bateria: desde o primeiro tempo, crescendo parte a parte
    { wave: "bateria", vol: 0.52,
      notes: [...em(["K", "H", "H", "H", "K", "H", "S", "H"], 0.5),
              ...em(["KC", "H", "S", "H", "K", "H", "S", "H"], 0.5),
              ...em(["KC", "H", "S", "H", "K", "K", "S", "S"], 0.5),
              ...vezes(2, em(["KC", "H", "S", "H", "K", "K", "S", "O"], 0.5)),
              ...vezes(4, em(["T", "S", "T", "S"], 0.25)),
              ["KC", 1],
              ...em(["KC", "H", "S", "H", "K", "K"], 0.5), ...vezes(4, [["S", 0.25]]), NADA] },
  ],
};

// o fim da troca: o bicho novo aparecendo, em sol maior
MUSIC.troca_fanfarra = {
  bpm: 150,
  tracks: [
    { wave: "pulso", duty: 0.25, vol: 0.48, eco: true, detune: 6, legato: 0.95, vibrato: { hz: 6, cents: 20 },
      notes: [["D5", 0.5], ["D5", 0.5], ["D5", 0.5], ["G5", 1.5], ["F#5", 0.5], ["G5", 0.5], ["A5", 0.5], ["B5", 3], NADA] },
    { wave: "pulso", duty: 0.125, vol: 0.3, eco: true, legato: 0.95,
      notes: [["B4", 0.5], ["B4", 0.5], ["B4", 0.5], ["D5", 1.5], ["D5", 0.5], ["E5", 0.5], ["F#5", 0.5], ["G5", 3], NADA] },
    { guitarra: true, acorde: [0, 7, 12], ganho: 22, vol: 0.45, legato: 0.95,
      notes: [["G2", 1.5], ["G2", 1.5], ["D2", 1.5], ["G2", 3], NADA] },
    { wave: "triangle", vol: 0.6, legato: 0.9, notes: [["G2", 1.5], ["G2", 1.5], ["D2", 1.5], ["G1", 3], NADA] },
    { wave: "bateria", vol: 0.55,
      notes: [["S", 0.5], ["S", 0.5], ["S", 0.5], ["KC", 1.5], ["S", 0.5], ["S", 0.5], ["S", 0.5], ["KC", 3], NADA] },
  ],
};

// A MEGA DESCONTROLADA (src/data/descontroladas.js): metal, a 200 bpm, em MI
// frígio — o semitom de cima (o FÁ) é o que deixa tudo com cara de briga.
// Guitarra base distorcida martelando semicolcheias ("chug") em cima de
// MI-MI-DÓ-RÉ, guitarra solo com vibrato largo, baixo dobrando a base uma
// oitava abaixo, e bateria de bumbo duplo. 12 compassos (48 tempos):
//   ENTRADA 2 · SOLO 8 (a base embaixo) · QUEBRA 2 — e volta.
const S16 = 0.25;
/** um compasso de "chug" na raiz: a palhetada abafada, com o semitom e a
 *  terça menor mordendo no fim do compasso */
const chug = (r) => [0, 0, null, 0, 0, null, 0, 0, 1, null, 0, 0, 3, null, 1, 0]
  .map((o) => [o === null ? "-" : sobe(r, o), S16]);
const DESC_ENTRADA = [
  ["E2", 0.75], ["-", 0.25], ["E2", 0.75], ["-", 0.25], ["F2", 1], ["F#2", 0.5], ["G2", 0.5],
  ["G2", 0.5], ["F#2", 0.5], ["F2", 0.5], ["E2", 0.5], ...oitavos("E2", 4).map(([n]) => [n, 0.5]),
];
const DESC_BASE = ["E2", "E2", "C3", "D3", "E2", "E2", "C3", "B2"].flatMap(chug);
const DESC_QUEBRA = [
  ["E2", 1.5], ["-", 0.5], ["E2", 0.5], ["F2", 0.5], ["E2", 1],
  ["A#2", 1], ["A2", 1], ["G#2", 0.5], ["G2", 0.5], ["F#2", 0.25], ["F2", 0.25], ["E2", 0.5],
];
const DESC_RITMO = [...DESC_ENTRADA, ...DESC_BASE, ...DESC_QUEBRA];
const DESC_SOLO = [
  ["-", 8],
  ["E4", 1], ["G4", 0.5], ["A4", 0.5], ["B4", 1.5], ["A4", 0.25], ["G4", 0.25],
  ["A4", 0.5], ["G4", 0.5], ["F#4", 0.5], ["E4", 0.5], ["F4", 2],
  ["C5", 1], ["B4", 0.5], ["C5", 0.5], ["E5", 1.5], ["D5", 0.5],
  ["D5", 0.5], ["C5", 0.5], ["B4", 0.5], ["A4", 0.5], ["B4", 2],
  ["E5", 0.25], ["D5", 0.25], ["B4", 0.25], ["A4", 0.25], ["E5", 0.25], ["D5", 0.25], ["B4", 0.25], ["A4", 0.25],
  ["G4", 0.5], ["A4", 0.5], ["B4", 1],
  ["E5", 1], ["F5", 1], ["E5", 0.5], ["D5", 0.5], ["B4", 1],
  ["C5", 0.25], ["E5", 0.25], ["G5", 0.25], ["E5", 0.25], ["C5", 0.25], ["E5", 0.25], ["G5", 0.25], ["E5", 0.25],
  ["B4", 1], ["A4", 1],
  ["B4", 0.5], ["C5", 0.5], ["D#5", 1], ["E5", 2],
  ["-", 8],
];
/** um compasso de bumbo duplo: semicolcheias no bumbo, caixa no 2 e no 4 */
const duplo = (prato = false) => [0, 1, 2, 3].flatMap((t) =>
  [t % 2 ? "KS" : t === 0 && prato ? "KC" : "KH", "K", "K", "K"].map((p) => [p, S16]));
const DESC_BATERIA = [
  ["KC", 0.75], ["-", 0.25], ["KC", 0.75], ["-", 0.25], ["KS", 1], ["KS", 0.5], ["KS", 0.5],
  ...Array.from({ length: 8 }, () => ["S", S16]), ...Array.from({ length: 4 }, () => ["T", S16]), ["KC", 1],
  ...Array.from({ length: 8 }, (_, i) => duplo(i % 4 === 0)).flat(),
  ["KC", 1.5], ["-", 0.5], ["K", 0.5], ["K", 0.5], ["KS", 1],
  ["KS", 1], ["KS", 1], ...Array.from({ length: 4 }, () => ["S", S16]), ...Array.from({ length: 4 }, () => ["T", S16]),
];
MUSIC.megaDescontrolada = {
  bpm: 200,
  tracks: [
    { guitarra: true, acorde: [0, 12], ganho: 55, vol: 0.55, eco: true, legato: 0.9,
      vibrato: { hz: 6.5, cents: 40 }, notes: DESC_SOLO },
    { guitarra: true, acorde: [0, 7, 12], ganho: 70, vol: 0.42, legato: 0.7, notes: DESC_RITMO },
    { wave: "triangle", vol: 0.6, legato: 0.8, notes: DESC_RITMO.map(([n, d]) => [n === "-" ? n : sobe(n, -12), d]) },
    { wave: "bateria", vol: 0.6, notes: DESC_BATERIA },
  ],
};
