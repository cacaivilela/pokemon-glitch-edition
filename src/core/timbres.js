// OS TIMBRES A MAIS do sintetizador de gritos (src/core/audio.js, `grito`).
//
// Os oito de sempre são as ondas básicas do GBA (quadrada, pulso, fina,
// triângulo, serra, seno, chiado, silêncio) e moram no próprio audio.js.
// Estes vinte vieram pro ESTÚDIO DE GRITOS (estudio/): cada um é uma RECEITA
// de som, não uma gravação — o jogo monta na hora com os mesmos osciladores,
// então tocam igual no estúdio e no jogo, e um grito com eles cabe num código.
//
// O que cada campo da receita faz (quem lê é `grito`, em audio.js):
// - `harm`: a forma da onda pelos harmônicos (o 1º é o tom, o 2º uma oitava
//   acima...). É o que diferencia um órgão de uma flauta tocando a mesma nota;
// - `base`: uma onda pronta do navegador ("sine", "triangle", "sawtooth", "square");
// - `fm`: um segundo oscilador sacudindo o primeiro (`r`: quantas vezes mais
//   rápido; `i`: com que força; `cai`: a força diminui) — sino e metal;
// - `formantes`: filtros nas frequências em que a boca ressoa: vogais;
// - `distorce`, `degraus`, `anel`, `coro`: distorção, onda em escada,
//   modulação em anel (voz de máquina) e várias cópias desafinadas;
// - `decai`: a sílaba bate forte e vai sumindo (quanto maior, mais rápido);
// - `sopro`: um pouco de chiado junto; `vibAuto`: tremido próprio;
// - `bolha`: o tom dá um pulo pra cima no começo; `vento`: só chiado macio;
// - `vol`: o volume, pra todos soarem do mesmo tamanho.
const harmonicos = (n, f) => Array.from({ length: n + 1 }, (_, k) => (k ? f(k) : 0));

export const TIMBRES = {
  org: { nome: "órgão", desc: "de igreja, cheio e parado", harm: [0, 1, 0.5, 0, 0.3, 0, 0, 0, 0.2], vol: 0.3, cor: "#c08a5a" },
  flt: { nome: "flauta", desc: "suave, com um pouco de sopro", harm: [0, 1, 0.12, 0.04], sopro: 0.12, vol: 0.42, cor: "#9fd8c8" },
  cla: { nome: "clarinete", desc: "oco e redondo", harm: [0, 1, 0, 0.45, 0, 0.25, 0, 0.12, 0, 0.06], vol: 0.34, cor: "#6f9fd8" },
  vio: { nome: "violino", desc: "de corda, com tremidinho", harm: harmonicos(16, (k) => 1 / Math.pow(k, 1.1)), vibAuto: [5.5, 0.012], vol: 0.26, cor: "#d86f6f" },
  bx:  { nome: "baixo", desc: "grave e encorpado", harm: [0, 1, 0.7, 0.25, 0.1], vol: 0.45, cor: "#8a6fd8" },
  pno: { nome: "piano", desc: "bate e vai sumindo", harm: [0, 1, 0.55, 0.3, 0.15, 0.1], decai: 1, vol: 0.42, cor: "#e8e8f0" },
  mar: { nome: "marimba", desc: "de madeira, curtinho", harm: [0, 1, 0, 0, 0.35], decai: 3, vol: 0.5, cor: "#d8a86f" },
  xil: { nome: "xilofone", desc: "madeira dura, brilhante e bem curtinho", harm: [0, 1, 0, 0.55, 0, 0, 0, 0, 0, 0.22], decai: 4.5, vol: 0.46, cor: "#e8c070" },
  plk: { nome: "harpa", desc: "corda beliscada, some rápido", base: "triangle", decai: 2.2, vol: 0.55, cor: "#f0d080" },
  sin: { nome: "sino", desc: "metálico, ecoando longe", base: "sine", fm: { r: 3.5, i: 4, cai: true }, decai: 0.8, vol: 0.42, cor: "#ffe08a" },
  mtl: { nome: "metal", desc: "lata batendo, áspero", base: "sine", fm: { r: 1.41, i: 6 }, vol: 0.3, cor: "#a0a8b8" },
  va:  { nome: "voz A", desc: "parece alguém dizendo aaa", base: "sawtooth", formantes: [800, 1150], vol: 0.95, cor: "#ff8ab4" },
  vo:  { nome: "voz O", desc: "parece alguém dizendo ooo", base: "sawtooth", formantes: [450, 800], vol: 0.95, cor: "#ff6a9a" },
  vi:  { nome: "voz I", desc: "parece alguém dizendo iii", base: "sawtooth", formantes: [300, 2300], vol: 0.95, cor: "#ffaad0" },
  kaz: { nome: "kazoo", desc: "zumbido nasal de sopro", base: "sawtooth", formantes: [1100], sopro: 0.18, vol: 0.75, cor: "#e0c060" },
  dst: { nome: "guitarra", desc: "distorcida, de rock", base: "sawtooth", distorce: 8, vol: 0.2, cor: "#ff7a3a" },
  crs: { nome: "8 bits sujo", desc: "em degraus, de videogame velho", base: "triangle", degraus: 5, vol: 0.4, cor: "#7ad83a" },
  rng: { nome: "máquina", desc: "voz metálica de robô", base: "square", anel: 55, vol: 0.5, cor: "#5ac8c8" },
  sup: { nome: "super serra", desc: "três serras juntas, largão", base: "sawtooth", coro: [-14, 0, 14], vol: 0.15, cor: "#ffb03a" },
  bol: { nome: "bolha", desc: "bloop, o tom pula pra cima", base: "sine", bolha: true, vol: 0.5, cor: "#5ab4ff" },
  vnt: { nome: "vento", desc: "sopro macio, sem voz", vento: true, vol: 1.1, cor: "#c8d8e8" },
  // a banda de jazz-funk de LUMIOSE (o arranjo do Legends Z-A: src/data/musica-lumiose.js)
  sax: { nome: "saxofone", desc: "de jazz, com sopro e tremidinho", base: "sawtooth", formantes: [520, 1180, 2500],
         sopro: 0.07, vibAuto: [5.2, 0.009], vol: 0.85, cor: "#e0a040" },
  epi: { nome: "piano elétrico", desc: "redondo, com um sininho que some", base: "sine", fm: { r: 1, i: 1.6, cai: true },
         decai: 1.1, vol: 0.45, cor: "#c890e0" },
  bra: { nome: "metais", desc: "trompete e trombone juntos, brilhante", harm: harmonicos(14, (k) => 1 / Math.pow(k, 0.75)),
         vol: 0.2, cor: "#f0c040" },
  slp: { nome: "baixo funk", desc: "beliscado e estalado", harm: [0, 1, 0.85, 0.5, 0.35, 0.22, 0.12], decai: 1.6,
         vol: 0.5, cor: "#7a5ad8" },
};
