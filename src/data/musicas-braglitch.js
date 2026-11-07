// AS MÚSICAS DOS LUGARES DE BRAGLITCH (nov/2026, pedido do CAIO: "melhore as
// músicas dos mapas de braglitch" — uma pra cada lugar, com o ritmo de lá).
//
// Antes eram duas pra tudo: a bossa `saolucario` nas cidades e o forró `br101`
// nas rotas, cada uma com uns 8 segundos de laço. Agora cada cidade tem o
// ritmo da cidade de verdade (frevo em RECIFEEBAS, axé em SALVADITTO...), as
// rotas têm uma por paisagem (mata, litoral, sertão, cerrado...), e o centro,
// a loja, o ginásio e o fundo do mar ganharam versões de Braglitch.
// A MATA DO SACI NÃO MUDA (o CAIO: "nem pense em mudar a da mata do saci").
//
// COMO SE ESCREVE: cada música tem uma PROGRESSÃO de acordes; o baixo e o
// acompanhamento saem dela por um PADRÃO (os graus do acorde: 0 a tônica, 1 a
// terça, 2 a quinta, 3 a sétima — ou a tônica uma oitava acima, nos acordes de
// três notas). A melodia é escrita nota a nota: "E5/1.5" = mi 5 por um tempo e
// meio; sem a barra, o tempo padrão. A bateria é uma letra por semicolcheia
// (K bumbo, S caixa, H chimbal, O chimbal aberto, C prato, T tom; "." nada).
// Toda faixa de uma música tem o MESMO tamanho (dev/musicasbragcheck confere),
// senão uma escorrega da outra a cada volta.

// ------------------------------------------------------------- as ferramentas
const NOMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const nomeDe = (s) => NOMES[((s % 12) + 12) % 12] + Math.floor(s / 12);

/** "E5/1.5 D5/.5 B4" -> [["E5", 1.5], ["D5", 0.5], ["B4", d]] */
const L = (s, d = 1) => s.replace(/\|/g, " ").trim().split(/\s+/).map((t) => {
  const [n, b] = t.split("/");
  return [n, b ? +b : d];
});
const rep = (lista, n) => Array.from({ length: n }, () => lista).flat();

/** "Am7" -> { r: 9, int: [0, 3, 7, 10] } */
function acorde(c) {
  const m = c.match(/^([A-G]#?)(m|dim)?(maj7|7|6)?$/);
  if (!m) throw new Error("acorde estranho: " + c);
  const t = m[2] ? 3 : 4, q = m[2] === "dim" ? 6 : 7;
  const s = { maj7: 11, 7: 10, 6: 9 }[m[3]];
  return { r: NOMES.indexOf(m[1]), int: s != null ? [0, t, q, s] : [0, t, q] };
}
/** "Am:4 F:4" -> [{ ac, d }] */
const P = (s) => s.replace(/\|/g, " ").trim().split(/\s+/).map((t) => {
  const [c, d] = t.split(":");
  return { ac: acorde(c), d: +d };
});

/** o PADRÃO por cima de cada acorde, na oitava `oit` (repete até o acorde acabar) */
function sobre(prog, padrao, oit) {
  const pad = L(padrao, 0.5), out = [];
  for (const { ac, d } of prog) {
    let t = 0, i = 0;
    while (t < d - 1e-6) {
      let [g, b] = pad[i++ % pad.length];
      b = Math.min(b, d - t);
      if (g === "-") out.push(["-", b]);
      else {
        const k = +g, n = ac.int.length;
        out.push([nomeDe(ac.r + ac.int[k % n] + 12 * Math.floor(k / n) + 12 * oit), b]);
      }
      t += b;
    }
  }
  return out;
}
/** a bateria: uma peça por passo ("." = nada) */
const bat = (s, passo = 0.25) => s.replace(/\|/g, " ").trim().split(/\s+/).map((t) => [t === "." ? "-" : t, passo]);

// os instrumentos
const T = (timbre, vol, extra = {}) => ({ timbre, vol, legato: 0.85, ...extra });
const chip = (vol) => ({ wave: "pulso", duty: 0.25, vol, detune: 6, eco: true, vibrato: { hz: 6.2, cents: 13 } });
const sanfona = (vol) => ({ wave: "pulso", duty: 0.5, vol, detune: 9, eco: true, vibrato: { hz: 5.4, cents: 18 } });
const triangulo = (vol = 0.08) => ({ wave: "pulso", duty: 0.125, vol, legato: 0.2 });
const tri = (vol = 0.5) => ({ wave: "triangle", vol, legato: 0.9 });
const ganza = (vol, n) => ({ wave: "ruido", vol, notes: rep([["x", 0.25]], n) });
const DRUM = (vol, padrao, n) => ({ wave: "bateria", vol, notes: rep(bat(padrao), n) });

/** monta a música: melodia A+B, a progressão inteira e o resto */
function musica(bpm, prog, faixas) {
  return { bpm, tracks: faixas.map((f) => (typeof f === "function" ? f(prog) : f)) };
}

// ======================================================== AS CIDADES
// SÃO LUCARIO DO SUL: a bossa de antes, agora com a segunda parte (mi menor)
const pSaoLucario = P("Em7:4 A7:4 Dmaj7:4 Gmaj7:4 | Cmaj7:4 F#m7:2 B7:2 Em7:4 B7:4");
const bragSaoLucario = musica(92, pSaoLucario, [
  { ...chip(0.4), notes: L(`E5/1.5 D5/.5 B4 A4 | B4/.5 C#5 B4/.5 A4/2 | F#5/1.5 E5/.5 D5 C#5 | D5/.5 E5 F#5/.5 G5/2
                            E5/1.5 G5/.5 F#5 E5 | D5/.5 E5 C#5/.5 F#4/2 | G4/.5 A4/.5 B4/.5 E5/.5 G5 F#5 | D#5/3 -/1`) },
  (p) => ({ ...T("plk", 0.24), notes: sobre(p, "0/.5 -/.25 2/.5 3/.25 -/.5 2/.5 -/.25 3/.75 1/.5", 3) }),
  (p) => ({ ...T("epi", 0.1, { legato: 0.95 }), notes: sobre(p, "1/2 3/2", 4) }),
  (p) => ({ ...T("bx", 0.5), notes: sobre(p, "0/1.5 2/.5 0/1 2/1", 2) }),
  DRUM(0.16, "K . H . S . K H | . . S . K . H .", 8),
]);

// BELÉM DO PARASECT: CARIMBÓ — a flauta e o tambor curimbó, em sol
const pBelem = P("G:4 C:4 D7:4 G:4 | Em:4 C:4 A7:4 D7:4");
const bragBelem = musica(120, pBelem, [
  { ...T("flt", 0.42, { eco: true }), notes: L(`D5/.5 B4/.5 G4/.5 B4/.5 D5 E5 | E5/.5 C5/.5 E5/.5 G5/.5 E5 C5 | A4/.5 C5/.5 F#4/.5 A4/.5 D5 C5 | B4 G4/.5 A4/.5 B4/2
                                                B4/.5 E5/.5 G5/.5 E5/.5 B4 G4 | C5/.5 E5/.5 G5/.5 E5/.5 C5 E5 | C#5/.5 E5/.5 A5/.5 G5/.5 E5 C#5 | D5/1.5 E5/.5 F#5 A5`) },
  (p) => ({ ...T("plk", 0.22), notes: sobre(p, "0/.5 1/.5 2/.5 1/.5", 4) }),
  (p) => ({ ...T("bx", 0.5), notes: sobre(p, "0/1 -/.5 0/.5 2/1 0/1", 2) }),
  DRUM(0.3, "K . T . S T . T | K . T . S T T .", 8),
  ganza(0.08, 128),
]);

// RECIFEEBAS: FREVO — os metais correndo em semicolcheia, rápido
const pRecife = P("G:4 D7:4 D7:4 G:4 | C:4 G:4 A7:4 D7:4");
const bragRecife = musica(160, pRecife, [
  { ...T("bra", 0.34, { eco: true }), notes: L(`B4/.5 D5/.5 G5/.5 F#5/.5 G5/.5 B5/.5 A5/.5 G5/.5 | F#5/.5 E5/.5 D5/.5 C5/.5 A4/.5 C5/.5 F#5/.5 A5/.5
                                                 G5/.5 F#5/.5 E5/.5 D5/.5 C5/.5 A4/.5 F#4/.5 A4/.5 | G4/1 B4/.5 D5/.5 G5/2
                                                 E5/.5 G5/.5 C6/.5 G5/.5 E5/.5 G5/.5 C6/1 | D5/.5 G5/.5 B5/.5 G5/.5 D5/.5 G5/.5 B5/1
                                                 C#5/.5 E5/.5 A5/.5 G5/.5 E5/.5 C#5/.5 A4/1 | D5/.5 F#5/.5 A5/.5 C6/.5 A5/1 F#5/1`) },
  (p) => ({ ...T("bra", 0.14), notes: sobre(p, "-/.5 1/.5 -/.5 2/.5", 3) }),
  (p) => ({ ...T("bx", 0.5), notes: sobre(p, "0/.5 2/.5", 2) }),
  DRUM(0.28, "K S . S K S . S | K S . S K S S S", 8),
]);

// SALVADITTO: AXÉ / SAMBA-REGGAE — o surdo pesado e o timbal
const pSalvador = P("C:4 F:4 G:4 C:4 | Am:4 F:4 G:4 G7:4");
const bragSalvador = musica(105, pSalvador, [
  { ...T("bra", 0.34, { eco: true }), notes: L(`G4/.5 C5/.5 E5/.5 G5/1 E5/.5 C5/1 | A4/.5 C5/.5 F5/.5 A5/1 F5/.5 C5/1 | B4/.5 D5/.5 G5/.5 B5/1 G5/.5 D5/1 | C5/1.5 E5/.5 G5/2
                                                 A4/1 C5/.5 E5/1 A5/.5 G5/1 | F5/1 A5/.5 C6/1 A5/.5 F5/1 | G5/.5 F5/.5 E5/.5 D5/.5 B4/1 G4/1 | G4/.5 B4/.5 D5/.5 F5/.5 G5/2`) },
  (p) => ({ ...T("plk", 0.18), notes: sobre(p, "-/.5 0/.25 1/.25 -/.5 2/.5", 4) }),
  (p) => ({ ...T("bx", 0.55), notes: sobre(p, "0/1.5 0/.5 2/1 0/1", 2) }),
  DRUM(0.36, "K . . . . . S . | K . K . . . S .", 8),
  DRUM(0.16, "T . T T . T . T | T . T . T T . .", 8),
]);

// CARUARU DO MAGMAR: FORRÓ PÉ-DE-SERRA — sanfona, zabumba e triângulo, em ré mixolídio
const pCaruaru = P("D:4 D:4 G:4 A7:4 | D:4 C:4 G:4 A7:4");
const bragCaruaru = musica(125, pCaruaru, [
  { ...sanfona(0.4), notes: L(`A4/.5 D5/.5 F#5/.5 A5/.5 G5/.5 F#5/.5 E5/1 | D5/.5 E5/.5 F#5/.5 D5/.5 A4/2 | B4/.5 D5/.5 G5/.5 B5/.5 A5/.5 G5/.5 F#5/.5 E5/.5 | C#5/.5 E5/.5 A5/.5 G5/.5 E5/2
                               F#5/.5 A5/.5 D6/1 C6/.5 A5/.5 F#5/1 | E5/.5 G5/.5 C6/1 A5/.5 G5/.5 E5/1 | D5/.5 B4/.5 G4/.5 B4/.5 D5/1 G5/1 | E5/.5 F#5/.5 G5/.5 E5/.5 C#5/.5 A4/.5 E5/1`) },
  { ...triangulo(), notes: rep(L("A6/.5 E7/.5"), 32) },
  (p) => ({ ...tri(0.55), notes: sobre(p, "0/.75 -/.25 0/.5 2/.5 0/.75 -/.25 2/1", 2) }),
  DRUM(0.32, "K . . K . . S . | K . . K . . S .", 8),
]);

// SAMPIKACHU: SAMBA-ROCK da cidade grande — baixo funk e piano elétrico
const pSampa = P("Am7:4 D7:4 Am7:4 D7:4 | Fmaj7:4 E7:4 Am7:4 E7:4");
const bragSampa = musica(112, pSampa, [
  { ...T("sax", 0.3, { eco: true }), notes: L(`A4/.5 C5/.5 E5/.5 G5/1 E5/.5 D5/1 | F#5/.5 E5/.5 D5/.5 C5/.5 A4/2 | A4/.5 C5/.5 E5/.5 A5/1 G5/.5 E5/1 | F#5/1 D5/.5 C5/.5 A4/2
                                                 A5/1 G5/.5 F5/.5 E5/1 C5/1 | B4/.5 D5/.5 G#5/1 E5/2 | C5/.5 E5/.5 G5/.5 A5/.5 G5/1 E5/1 | D5/.5 E5/.5 G#4/1 B4/2`) },
  (p) => ({ ...T("epi", 0.14), notes: sobre(p, "-/.5 1/.25 3/.25 -/1 -/.5 2/.25 3/.25 -/1", 4) }),
  (p) => ({ ...T("slp", 0.5, { legato: 0.7 }), notes: sobre(p, "0/.5 -/.25 3/.25 0/.5 2/.5 -/.5 0/.5 2/.5 1/.5", 2) }),
  DRUM(0.32, "K . H . S . H K | . K H . S . H .", 8),
]);

// OURO GASTLY: SERESTA DE ASSOMBRAÇÃO — valsa lenta em ré menor, violino,
// violão e um sino de igreja ao longe (a cidade da contadora de causos)
const pOuroPreto = P("Dm:3 A7:3 Dm:3 Gm:3 Dm:3 A7:3 Dm:6 | F:3 C:3 A#:3 F:3 Gm:3 Dm:3 A7:6");
const bragOuroPreto = musica(84, pOuroPreto, [
  { ...T("vio", 0.3, { eco: true }), notes: L(`A4/2 D5/1 | C#5/2 E5/1 | F5/2 E5/1 | D5/1.5 A#4/.5 G4/1 | A4/2 F5/1 | E5/1.5 D5/.5 C#5/1 | D5/3 | -/3
                                                 C5/2 F5/1 | E5/2 G5/1 | F5/1 D5/1 A#4/1 | A4/3 | A#4/1.5 D5/.5 G5/1 | F5/2 D5/1 | E5/2 C#5/1 | A4/3`) },
  (p) => ({ ...T("plk", 0.22), notes: sobre(p, "0/1 1/1 2/1", 3) }),
  (p) => ({ ...T("org", 0.06, { legato: 1 }), notes: sobre(p, "1/3", 4) }),
  (p) => ({ ...T("bx", 0.45), notes: sobre(p, "0/1 -/2", 2) }),
  { ...T("sin", 0.16, { eco: true }), notes: L("-/21 A5/3 -/21 D6/3") },
]);

// RIO DE JANEEVEE: SAMBA — cavaquinho, violão de 7 e a bateria da escola
const pRio = P("G:4 E7:4 Am:4 D7:4 | G7:4 C:4 A7:4 D7:4");
const bragRio = musica(100, pRio, [
  { ...T("sax", 0.3, { eco: true }), notes: L(`D5/.5 E5/.5 G5/1 G5/.5 B5/.5 A5/1 | G#5/.5 B5/.5 E5/1 D5/.5 B4/.5 G#4/1 | A4/.5 C5/.5 E5/.5 A5/.5 G5/.5 E5/.5 C5/1 | D5/1.5 C5/.5 B4/1 A4/1
                                                 F5/.5 G5/.5 B5/.5 G5/.5 F5/1 D5/1 | E5/.5 G5/.5 C6/1 B5/.5 A5/.5 G5/1 | C#5/.5 E5/.5 G5/.5 A5/.5 G5/1 E5/1 | F#5/.5 A5/.5 D5/.5 E5/.5 F#5/2`) },
  (p) => ({ ...T("plk", 0.15), notes: sobre(p, "1/.25 2/.25 3/.25 2/.25", 4) }),
  (p) => ({ ...T("bx", 0.5), notes: sobre(p, "0/1 2/.5 0/.5 4/1 2/1", 2) }),
  DRUM(0.3, "K . S H . S H . | K S . H S . H S", 8),
  ganza(0.07, 128),
]);

// BASCULINHA: A CIDADE DO SERVIDOR — eletrônica, arpejo de chip e baixo funk
const pBasculinha = P("Em:4 C:4 G:4 D:4 | Am:4 C:4 Em:4 B7:4");
const bragBasculinha = musica(118, pBasculinha, [
  { ...chip(0.36), notes: L(`B4/1 E5/1 G5/1.5 F#5/.5 | E5/1 G5/.5 C6/1.5 B5/1 | B5/1 D5/1 G5/1.5 A5/.5 | F#5/2 D5/2
                            A5/1.5 G5/.5 E5/1 C5/1 | E5/.5 G5/.5 C6/1 B5/1 G5/1 | B5/1 G5/1 E5/1 B4/1 | D#5/1 F#5/1 B5/2`) },
  (p) => ({ ...T("crs", 0.12), notes: sobre(p, "0/.25 1/.25 2/.25 3/.25", 4) }),
  (p) => ({ ...T("sup", 0.05, { legato: 1, eco: true }), notes: sobre(p, "1/4", 3) }),
  (p) => ({ ...T("slp", 0.5, { legato: 0.7 }), notes: sobre(p, "0/.5 0/.5 3/.5 0/.5", 2) }),
  DRUM(0.3, "K . H . S . H . | K . H . S . H H", 8),
]);

// CURITIMBURR: VALSA DE INVERNO — piano e violino na neblina
const pCuritiba = P("C:3 Am:3 F:3 G:3 C:3 Em:3 F:3 G:3 | Am:3 Em:3 F:3 C:3 Dm:3 G:3 C:6");
const bragCuritiba = musica(126, pCuritiba, [
  { ...T("pno", 0.4, { eco: true }), notes: L(`E5/2 G5/1 | C5/2 E5/1 | A5/2 G5/1 | F5/1 E5/1 D5/1 | E5/2 C5/1 | B4/2 E5/1 | A4/1 C5/1 F5/1 | D5/3
                                                 C5/2 E5/1 | B4/2 G4/1 | A4/1 C5/1 F5/1 | E5/3 | F5/2 A5/1 | G5/2 B4/1 | C5/3 | -/3`) },
  (p) => ({ ...T("pno", 0.14), notes: sobre(p, "-/1 1/1 2/1", 4) }),
  (p) => ({ ...T("vio", 0.1, { legato: 1 }), notes: sobre(p, "0/3", 4) }),
  (p) => ({ ...T("bx", 0.45), notes: sobre(p, "0/1 -/2", 2) }),
]);

// FLORIPACHIRISU: SURF ROCK — guitarra com eco, bateria rápida
const pFloripa = P("E:4 A:4 E:4 B7:4 | C#m:4 A:4 F#m:4 B7:4");
const bragFloripa = musica(150, pFloripa, [
  { ...T("dst", 0.14, { eco: true }), notes: L(`E5/.5 E5/.5 G#5/.5 B5/.5 E6/1 B5/1 | A5/.5 G#5/.5 F#5/.5 E5/.5 C#5/2 | E5/.5 G#5/.5 B5/.5 G#5/.5 E5/1 B4/1 | D#5/.5 F#5/.5 A5/.5 F#5/.5 D#5/2
                                                 C#5/1 E5/.5 G#5/1 E5/.5 C#5/1 | A4/1 C#5/.5 E5/1 F#5/.5 E5/1 | F#5/1 A5/.5 C#6/1 A5/.5 F#5/1 | D#5/.5 F#5/.5 A5/.5 B5/.5 B5/2`) },
  (p) => ({ ...T("plk", 0.16), notes: sobre(p, "0/.5 2/.5 3/.5 2/.5", 3) }),
  (p) => ({ ...T("bx", 0.5), notes: sobre(p, "0/.5 0/.5 2/.5 0/.5", 2) }),
  DRUM(0.3, "K . H . S . H . | K K H . S . H .", 8),
]);

// CARVORIÚ: ELETRÔNICA DE PRAIA — marimba, chimbal aberto no contratempo
const pCarvoriu = P("Am:4 F:4 C:4 G:4 | F:4 G:4 Am:4 Am:4");
const bragCarvoriu = musica(112, pCarvoriu, [
  { ...T("mar", 0.46, { eco: true }), notes: L(`E5/.75 C5/.75 A4/.5 E5/.5 G5/.5 E5/1 | F5/.75 C5/.75 A4/.5 F5/.5 A5/.5 F5/1 | E5/.75 C5/.75 G4/.5 E5/.5 G5/.5 C6/1 | B5/.75 G5/.75 D5/.5 B4/.5 D5/.5 G5/1
                                                 A5/.5 A5/.5 C6/.5 A5/.5 F5/2 | G5/.5 G5/.5 B5/.5 G5/.5 D5/2 | E5/.5 A5/.5 C6/.5 E6/.5 D6/.5 C6/.5 B5/.5 A5/.5 | E5/2 -/2`) },
  (p) => ({ ...T("sup", 0.05, { legato: 1, eco: true }), notes: sobre(p, "1/4", 3) }),
  (p) => ({ ...T("slp", 0.5, { legato: 0.6 }), notes: sobre(p, "-/.5 0/.5 -/.5 0/.5 -/.5 0/.5 -/.5 3/.5", 2) }),
  DRUM(0.3, "K . O . KS . O . | K . O . KS . O .", 8),
]);

// PRAIA DO LARVANJAL: REGGAE — devagar, o violão batendo no contratempo
const pLarvanjal = P("G:4 C:4 G:4 D:4 | Em:4 C:4 G:4 D:4");
const bragLarvanjal = musica(80, pLarvanjal, [
  { ...T("flt", 0.4, { eco: true }), notes: L(`B4/1 D5/1 G5/1.5 E5/.5 | E5/1 C5/1 G4/2 | B4/.5 C5/.5 D5/1 G5/1 B5/1 | A5/2 F#5/2
                                                 G5/1.5 F#5/.5 E5/1 B4/1 | C5/1 E5/1 G5/1 E5/1 | D5/1.5 B4/.5 G4/1 B4/1 | A4/1 D5/1 F#5/1 A5/1`) },
  (p) => ({ ...T("epi", 0.16), notes: sobre(p, "-/1 1/.5 -/.5", 4) }),
  (p) => ({ ...T("epi", 0.12), notes: sobre(p, "-/1 2/.5 -/.5", 4) }),
  (p) => ({ ...T("bx", 0.55), notes: sobre(p, "0/1.5 2/.5 -/.5 3/.5 2/1", 2) }),
  DRUM(0.26, "H . H . H . H . | KS . H . H . H .", 8),
]);

// NATALTAIR: CÔCO — ganzá, pandeiro e a roda batendo o pé, em dó mixolídio
const pNatal = P("C:4 A#:4 C:4 G:4 | F:4 C:4 G7:4 C:4");
const bragNatal = musica(132, pNatal, [
  { ...T("cla", 0.42, { eco: true }), notes: L(`G4/.5 C5/.5 E5/.5 G5/.5 G5/1 E5/1 | F5/.5 D5/.5 A#4/.5 D5/.5 F5/2 | E5/.5 G5/.5 C6/.5 A#5/.5 G5/1 E5/1 | D5/.5 B4/.5 G4/.5 B4/.5 D5/2
                                                 A4/.5 C5/.5 F5/1 A5/1 F5/1 | G5/.5 E5/.5 C5/1 E5/1 G5/1 | F5/.5 D5/.5 B4/.5 D5/.5 F5/1 G5/1 | E5/.5 D5/.5 C5/1 C5/2`) },
  (p) => ({ ...T("plk", 0.18), notes: sobre(p, "0/.5 2/.5 1/.5 2/.5", 4) }),
  (p) => ({ ...T("bx", 0.5), notes: sobre(p, "0/.5 -/.5 2/.5 0/.5 -/.5 0/.5 2/1", 2) }),
  DRUM(0.3, "K H S H K H S H | K H S H K S S H", 8),
  ganza(0.09, 128),
]);

// FORTALEZARD: BAIÃO — sanfona em sol mixolídio (o fá natural), zabumba e triângulo
const pFortaleza = P("G:4 F:4 G:4 D7:4 | C:4 G:4 D7:4 G:4");
const bragFortaleza = musica(112, pFortaleza, [
  { ...sanfona(0.4), notes: L(`D5/.75 D5/.75 B4/.5 D5/.5 G5/.5 F5/1 | F5/.75 E5/.75 C5/.5 A4/.5 C5/.5 F5/1 | G5/.75 F5/.75 D5/.5 B4/.5 D5/.5 G5/1 | A5/.75 F#5/.75 D5/.5 C5/.5 A4/.5 D5/1
                               E5/.5 G5/.5 C6/1 B5/.5 G5/.5 E5/1 | D5/.5 G5/.5 B5/1 A5/.5 G5/.5 F5/1 | F#5/.5 A5/.5 C6/1 A5/.5 F#5/.5 D5/1 | G5/1.5 D5/.5 G4/2`) },
  { ...triangulo(), notes: rep(L("G6/.5 D7/.5"), 32) },
  (p) => ({ ...tri(0.55), notes: sobre(p, "0/.75 2/.25 -/.5 2/.5 0/.75 2/.25 -/1", 2) }),
  DRUM(0.32, "K . . K . . S . | K . . K . S S .", 8),
]);

// MANAUSQUIRTLE: BOI-BUMBÁ — a toada de Parintins, tambor grande e violino épico
const pManaus = P("Am:4 G:4 F:4 E7:4 | Am:4 Dm:4 G:4 C:2 E7:2");
const bragManaus = musica(116, pManaus, [
  { ...T("vio", 0.32, { eco: true }), notes: L(`A4/1 C5/1 E5/1.5 D5/.5 | D5/1 B4/1 G4/2 | A4/.5 C5/.5 F5/1 E5/1 D5/1 | B4/1 G#4/1 E4/2
                                                 E5/1 A5/1 C6/1.5 B5/.5 | A5/1 F5/1 D5/2 | D5/.5 G5/.5 B5/1 A5/1 G5/1 | E5/1 G5/1 G#5/2`) },
  (p) => ({ ...T("sup", 0.05, { legato: 1, eco: true }), notes: sobre(p, "0/4", 3) }),
  (p) => ({ ...T("bx", 0.55), notes: sobre(p, "0/1 0/1 2/1 0/1", 2) }),
  DRUM(0.36, "K . K . S . K S | K . K . S S S S", 8),
]);

// CUIABULBA: RASQUEADO — viola caipira em seis por oito
const pCuiaba = P("D:6 A7:6 A7:6 D:6 | G:6 D:6 A7:6 D:6");
const bragCuiaba = musica(200, pCuiaba, [
  { ...sanfona(0.38), notes: L(`F#5/2 A5/1 D6/2 A5/1 | G5/2 E5/1 C#5/2 A4/1 | E5/1 F#5/1 G5/1 A5/2 G5/1 | F#5/3 D5/3
                               G5/2 B5/1 D6/2 B5/1 | A5/2 F#5/1 D5/3 | E5/1 G5/1 A5/1 C#6/2 A5/1 | D6/3 -/3`) },
  (p) => ({ ...T("plk", 0.22), notes: sobre(p, "0/1 2/1 1/1", 4) }),
  (p) => ({ ...T("bx", 0.5), notes: sobre(p, "0/3 2/3", 2) }),
  { wave: "bateria", vol: 0.28, notes: rep(bat("K H H S H H", 1), 8) },
]);

// AS 8 ILHAS: o mar calmo — harpa, flauta e um sino de boia
const pIlhas = P("F:4 Dm:4 A#:4 C:4 | Am:4 Dm:4 A#:4 C7:4");
const bragIlhas = musica(84, pIlhas, [
  { ...T("flt", 0.4, { eco: true }), notes: L(`C5/1.5 F5/.5 A5/2 | A5/1 G5/.5 F5/.5 D5/2 | D5/1 F5/1 A#5/1.5 A5/.5 | G5/3 -/1
                                                 E5/1.5 A5/.5 C6/2 | D6/1 C6/.5 A#5/.5 A5/2 | G5/1 F5/1 D5/1.5 F5/.5 | E5/2 G5/2`) },
  (p) => ({ ...T("plk", 0.22), notes: sobre(p, "0/.5 1/.5 2/.5 3/.5", 4) }),
  (p) => ({ ...T("bx", 0.45), notes: sobre(p, "0/2 2/2", 2) }),
  { ...T("sin", 0.14, { eco: true }), notes: L("-/15 C6/1 -/15 F6/1") },
]);

// A ESPLANADA DA LIGA: o hino — metais, órgão e tímpano
const pLiga = P("C:4 G:4 Am:4 F:4 | F:4 G:4 C:4 G:4");
const bragLiga = musica(96, pLiga, [
  { ...T("bra", 0.36, { eco: true }), notes: L(`G4/1.5 C5/.5 E5/1 G5/1 | G5/1.5 F5/.5 D5/2 | E5/1 C5/1 A4/1 C5/1 | F5/2 A5/2
                                                 A5/1.5 G5/.5 F5/1 A5/1 | G5/1.5 F5/.5 D5/1 B4/1 | C5/1 E5/1 G5/1 C6/1 | B5/2 D6/2`) },
  (p) => ({ ...T("org", 0.1, { legato: 1 }), notes: sobre(p, "1/4", 4) }),
  (p) => ({ ...T("bra", 0.12), notes: sobre(p, "2/1 -/.5 2/.5 1/2", 3) }),
  (p) => ({ ...T("bx", 0.5), notes: sobre(p, "0/1 0/.5 0/.5 2/2", 2) }),
  DRUM(0.3, "KC . . . T . T . | S . . . T T T T", 8),
]);

// ========================================================== AS ROTAS
// A BR-101: o forró de antes, mais comprido (ganhou a segunda parte) e com violão
const pBr101 = P("Am:2 G:2 Am:2 D:2 C:2 Am:2 G:2 Am:2 | C:2 G:2 C:2 G:2 Am:2 C:2 G:2 Am:2");
const bragBr101 = musica(128, pBr101, [
  { ...sanfona(0.4), notes: L(`A4/.5 C5/.5 D5/1 C5/.5 A4/.5 G4/1 | A4/.5 C5/.5 E5/1 D5/1 -/1 | E5/.5 G5/.5 E5/.5 D5/.5 C5/1 A4/1 | G4/.5 A4/.5 C5/.5 G4/.5 A4/2
                               C5/.5 E5/.5 G5/1 E5/.5 C5/.5 D5/1 | E5/.5 D5/.5 C5/.5 A4/.5 G4/2 | A4/.5 C5/.5 E5/.5 A5/.5 G5/1 E5/1 | D5/.5 E5/.5 C5/.5 B4/.5 A4/2`) },
  { ...triangulo(0.1), notes: rep(L("A6/.5 E7/.5"), 32) },
  (p) => ({ ...T("plk", 0.16), notes: sobre(p, "-/.5 1/.5 -/.5 2/.5", 3) }),
  (p) => ({ ...tri(0.58), notes: sobre(p, "0/.75 -/.25 0/.5 2/.5", 2) }),
  DRUM(0.3, "K . . K . . S . | K . . K . . S .", 8),
]);

// A MATA (MATA ATLÂNTICA, FERNÃO DIAS, ESTRADA REAL, FLORESTA AMAZÔNICA):
// flauta, marimba e passarinho
const pMata = P("Em:4 D:4 C:4 B7:4 | Am:4 Em:4 C:4 D:4");
const bragMata = musica(100, pMata, [
  { ...T("flt", 0.4, { eco: true }), notes: L(`E5/1 G5/.5 B5/1.5 A5/1 | F#5/1 D5/1 A4/2 | G4/.5 A4/.5 C5/1 E5/1 G5/1 | F#5/1.5 D#5/.5 B4/2
                                                 C5/1 E5/.5 A5/1.5 G5/1 | G5/1 E5/1 B4/2 | C5/.5 E5/.5 G5/1 C6/1 B5/1 | A5/1 F#5/1 D5/2`) },
  { ...T("xil", 0.2, { eco: true }), notes: rep(L("-/3.5 B6/.25 G6/.25 -/7.5 E7/.25 D7/.25 -/4"), 2) },
  (p) => ({ ...T("mar", 0.24), notes: sobre(p, "0/.5 2/.5 1/.5 2/.5", 3) }),
  (p) => ({ ...T("bx", 0.45), notes: sobre(p, "0/2 2/2", 2) }),
  DRUM(0.18, "K . . H . . T . | K . . H . T . .", 8),
]);

// O LITORAL (BR-232, BR-101 NORTE): estrada de praia, sol e vento
const pLitoral = P("D:4 Bm:4 G:4 A:4 | G:4 A:4 F#m:4 Bm:2 A:2");
const bragLitoral = musica(116, pLitoral, [
  { ...chip(0.38), notes: L(`A4/.5 D5/.5 F#5/1 E5/.5 D5/.5 A5/1 | F#5/1 D5/.5 B4/.5 F#4/2 | G4/.5 B4/.5 D5/1 G5/1 B5/1 | A5/1.5 G5/.5 E5/2
                            B5/1 A5/.5 G5/.5 D5/2 | C#5/.5 E5/.5 A5/1 G5/1 E5/1 | F#5/1 E5/.5 C#5/.5 A4/2 | B4/.5 D5/.5 F#5/1 E5/1 C#5/1`) },
  (p) => ({ ...T("plk", 0.2), notes: sobre(p, "0/.5 1/.5 2/.5 1/.5", 4) }),
  (p) => ({ ...T("bx", 0.5), notes: sobre(p, "0/1 2/.5 0/.5 3/1 2/1", 2) }),
  DRUM(0.28, "K . H . S . H K | . K H . S . H .", 8),
]);

// O SERTÃO (BR-324): seco e parado, o pífano e a viola, em mi com o fá do nordeste
const pSertao = P("E:4 F:4 E:4 Dm:4 | Am:4 G:4 F:4 E:4");
const bragSertao = musica(88, pSertao, [
  { ...T("flt", 0.4, { eco: true }), notes: L(`E5/1 G#5/.5 B5/1.5 A5/1 | A5/1 F5/1 C5/2 | B4/.5 E5/.5 G#5/1 F5/1 E5/1 | D5/1.5 F5/.5 A5/2
                                                 A5/1 C6/.5 E6/1.5 D6/1 | D6/1 B5/1 G5/2 | F5/.5 A5/.5 C6/1 B5/1 A5/1 | G#5/2 E5/2`) },
  (p) => ({ ...T("plk", 0.22), notes: sobre(p, "0/1 -/.5 2/.5 1/1 2/1", 3) }),
  (p) => ({ ...T("bx", 0.45), notes: sobre(p, "0/4", 2) }),
  DRUM(0.22, "K . . . . . T . | . . K . T . . .", 8),
]);

// O CERRADO (BR-116, BR-040): o campo dourado, moda de viola
const pCerrado = P("A:4 E:4 D:4 E:4 | F#m:4 D:4 A:4 E7:4");
const bragCerrado = musica(96, pCerrado, [
  { ...T("cla", 0.4, { eco: true }), notes: L(`C#5/1 E5/1 A5/1.5 G#5/.5 | G#5/1 E5/1 B4/2 | A4/.5 B4/.5 D5/1 F#5/1 A5/1 | G#5/1.5 F#5/.5 E5/2
                                                 F#5/1 A5/.5 C#6/1.5 B5/1 | A5/1 F#5/1 D5/2 | C#5/.5 E5/.5 A5/1 G#5/1 E5/1 | D5/1 E5/1 G#5/2`) },
  (p) => ({ ...T("plk", 0.2), notes: sobre(p, "0/.5 1/.5 2/.5 1/.5", 4) }),
  (p) => ({ ...T("bx", 0.45), notes: sobre(p, "0/1.5 2/.5 0/2", 2) }),
  DRUM(0.18, "K . H . S . H . | K . H . S . H H", 8),
]);

// O MONTE SERRA: frio e alto — trompa, órgão e tambor de longe
const pSerra = P("Dm:4 C:4 A#:4 A7:4 | Gm:4 Dm:4 A#:2 C:2 Dm:4");
const bragSerra = musica(90, pSerra, [
  { ...T("bra", 0.32, { eco: true }), notes: L(`D5/1.5 E5/.5 F5/2 | E5/1 C5/1 G4/2 | F4/1 A#4/1 D5/1.5 C5/.5 | C#5/2 E5/2
                                                 D5/1 G5/1 A#5/1.5 A5/.5 | A5/1 F5/1 D5/2 | D5/1 F5/1 E5/1 G5/1 | F5/1 E5/.5 C#5/.5 D5/2`) },
  (p) => ({ ...T("org", 0.09, { legato: 1 }), notes: sobre(p, "1/4", 3) }),
  (p) => ({ ...T("vio", 0.12, { eco: true }), notes: sobre(p, "0/1 1/1 2/1 1/1", 4) }),
  (p) => ({ ...T("bx", 0.5), notes: sobre(p, "0/4", 2) }),
  DRUM(0.24, "T . . . . . . . | K . . . T . T .", 8),
]);

// O PANTANAL: manhã alagada — marimba, flauta e os passarinhos
const pPantanal = P("G:4 Em:4 C:4 D:4 | C:4 D:4 Bm:4 Em:2 D:2");
const bragPantanal = musica(92, pPantanal, [
  { ...T("flt", 0.4, { eco: true }), notes: L(`D5/1 G5/1 B5/1.5 A5/.5 | G5/1 E5/1 B4/2 | C5/.5 E5/.5 G5/1 A5/1 G5/1 | F#5/2 A5/2
                                                 E5/1 G5/.5 C6/1.5 B5/1 | A5/1 F#5/1 D5/2 | D5/.5 F#5/.5 B5/1 A5/1 F#5/1 | E5/1 G5/1 F#5/2`) },
  { ...T("xil", 0.18, { eco: true }), notes: rep(L("-/5.5 D7/.25 B6/.25 -/5.5 G7/.25 E7/.25 -/4"), 2) },
  (p) => ({ ...T("mar", 0.24), notes: sobre(p, "0/.5 1/.5 2/.5 1/.5", 3) }),
  (p) => ({ ...T("bx", 0.45), notes: sobre(p, "0/2 2/2", 2) }),
  ganza(0.06, 128),
]);

// A CHAPADA DOS VEADEIROS: as pedras de cristal — sinos e piano elétrico
const pChapada = P("Dm7:4 Em7:4 Fmaj7:4 Em7:4 | Dm7:4 Em7:4 Fmaj7:4 G:4");
const bragChapada = musica(80, pChapada, [
  { ...T("epi", 0.36, { eco: true }), notes: L(`A5/1.5 G5/.5 F5/1 D5/1 | E5/1 G5/1 B5/2 | C6/1 A5/1 F5/1 E5/1 | E5/2 B4/2
                                                 D5/1 F5/1 A5/1 C6/1 | B5/1.5 G5/.5 E5/2 | F5/.5 A5/.5 C6/1 E6/1 C6/1 | B5/2 D6/2`) },
  (p) => ({ ...T("sin", 0.08, { eco: true }), notes: sobre(p, "0/.5 1/.5 2/.5 3/.5", 5) }),
  (p) => ({ ...T("sup", 0.04, { legato: 1, eco: true }), notes: sobre(p, "0/4", 3) }),
  (p) => ({ ...T("bx", 0.45), notes: sobre(p, "0/4", 2) }),
]);

// ===================================================== OS LUGARES DE DENTRO
// O CENTRO POKÉMON: calminho, piano elétrico
const pCentro = P("Cmaj7:4 Am7:4 Dm7:4 G7:4 | Em7:4 A7:4 Dm7:4 G7:4");
const bragCentro = musica(100, pCentro, [
  { ...T("epi", 0.36, { eco: true }), notes: L(`E5/1 G5/1 B5/1.5 A5/.5 | G5/1 E5/1 C5/2 | D5/.5 F5/.5 A5/1 C6/1 A5/1 | B5/2 G5/2
                                                 G5/1 B5/1 D6/1.5 B5/.5 | C#6/1 A5/1 E5/2 | F5/.5 A5/.5 C6/1 D6/1 C6/1 | B5/1 D6/1 G5/2`) },
  (p) => ({ ...T("pno", 0.14), notes: sobre(p, "0/1 2/.5 1/.5 3/1 2/1", 3) }),
  (p) => ({ ...T("bx", 0.45), notes: sobre(p, "0/2 2/2", 2) }),
  DRUM(0.1, "H . H . S . H . | H . H . S . H .", 8),
]);

// A LOJA: musiquinha de propaganda, marimba saltitante
const pLoja = P("G:4 Em:4 Am:4 D7:4 | C:4 D:4 Bm:4 E7:2 A7:2");
const bragLoja = musica(120, pLoja, [
  { ...T("mar", 0.46, { eco: true }), notes: L(`B4/.5 D5/.5 G5/.5 B5/.5 A5/1 G5/1 | E5/.5 G5/.5 B5/1 G5/1 E5/1 | C5/.5 E5/.5 A5/1 G5/.5 E5/.5 C5/1 | D5/.5 F#5/.5 A5/.5 C6/.5 B5/1 A5/1
                                                 C5/.5 E5/.5 G5/1 E5/1 C5/1 | D5/.5 F#5/.5 A5/1 F#5/1 D5/1 | D5/.5 F#5/.5 B5/1 A5/1 F#5/1 | G#5/.5 B5/.5 E5/1 C#5/.5 E5/.5 G5/1`) },
  (p) => ({ ...T("plk", 0.18), notes: sobre(p, "-/.5 1/.5 -/.5 2/.5", 4) }),
  (p) => ({ ...T("bx", 0.45), notes: sobre(p, "0/1 2/1", 2) }),
  DRUM(0.2, "K . H . S . H . | K . H K S . H .", 8),
]);

// O GINÁSIO: tenso e com pressa — metais, guitarra e bateria cheia
const pGinasio = P("Em:4 C:4 D:4 B7:4 | Am:4 Em:4 C:2 D:2 B7:4");
const bragGinasio = musica(140, pGinasio, [
  { ...T("bra", 0.34, { eco: true }), notes: L(`E5/.5 E5/.5 G5/.5 B5/.5 A5/1 G5/1 | E5/.5 G5/.5 C6/1 B5/1 G5/1 | F#5/.5 F#5/.5 A5/.5 D6/.5 C6/1 A5/1 | B5/1 A5/.5 F#5/.5 D#5/2
                                                 C5/.5 E5/.5 A5/1 G5/1 E5/1 | B4/.5 E5/.5 G5/1 B5/1 E6/1 | C6/1 B5/1 A5/1 F#5/1 | D#5/.5 F#5/.5 A5/.5 B5/.5 B5/2`) },
  (p) => ({ ...T("dst", 0.09), notes: sobre(p, "0/.5 0/.5 -/.5 0/.5", 3) }),
  (p) => ({ ...T("bx", 0.5), notes: sobre(p, "0/.5", 2) }),
  DRUM(0.32, "K . H . S . H K | K . H . S . H S", 8),
]);

// O FUNDO DO MAR DE BRAGLITCH: devagar, bolhas subindo
const pFundo = P("Am:4 Fmaj7:4 Dm7:4 E7:4 | Am:4 C:4 Dm7:4 E7:4");
const bragFundo = musica(72, pFundo, [
  { ...T("epi", 0.34, { eco: true }), notes: L(`E5/2 C5/1 A4/1 | A5/2 G5/1 E5/1 | F5/1.5 E5/.5 D5/1 C5/1 | B4/2 G#4/2
                                                 A4/1 C5/1 E5/2 | G5/1 E5/1 C5/2 | D5/1 F5/1 A5/1.5 G5/.5 | G#5/4`) },
  { ...T("bol", 0.18, { eco: true }), notes: rep(L("-/1.5 A5/.25 C6/.25 -/2"), 8) },
  (p) => ({ ...T("sup", 0.05, { legato: 1, eco: true }), notes: sobre(p, "0/4", 3) }),
  (p) => ({ ...T("bx", 0.45), notes: sobre(p, "0/4", 2) }),
]);

// A CAVERNA DO MONTE SERRA (src/data/caverna-serra.js): escuro e com eco —
// gota pingando, o baixo bem embaixo e a flauta perdida lá no fundo
const pCaverna = P("Em:4 Cmaj7:4 Am:4 B7:4 | Em:4 F#m:4 G:4 B7:4");
const bragCaverna = musica(76, pCaverna, [
  { ...T("flt", 0.3, { eco: true }), notes: L(`B4/2 E5/1 G5/1 | F#5/1.5 E5/.5 B4/2 | C5/1 E5/1 A5/1.5 G5/.5 | F#5/2 D#5/2
                                                -/1 G5/1 B5/1.5 A5/.5 | A5/1 F#5/1 C#5/2 | D5/1 G5/1 B5/1 D6/1 | D#6/3 -/1`) },
  { ...T("xil", 0.18, { eco: true }), notes: rep(L("-/2.5 E7/.5 -/3 B6/.5 -/1.5 -/4 G7/.25 -/3.75"), 2) },
  (p) => ({ ...T("sup", 0.04, { legato: 1, eco: true }), notes: sobre(p, "0/4", 3) }),
  (p) => ({ ...T("bx", 0.5), notes: sobre(p, "0/2 -/1 2/1", 1) }),
  DRUM(0.16, "K . . . . . . . | . . T . . . . .", 8),
]);

export const MUSICAS_BRAGLITCH = {
  bragSaoLucario, bragBelem, bragRecife, bragSalvador, bragCaruaru, bragSampa, bragOuroPreto, bragRio,
  bragBasculinha, bragCuritiba, bragFloripa, bragCarvoriu, bragLarvanjal, bragNatal, bragFortaleza,
  bragManaus, bragCuiaba, bragIlhas, bragLiga,
  bragBr101, bragMata, bragLitoral, bragSertao, bragCerrado, bragSerra, bragPantanal, bragChapada,
  bragCentro, bragLoja, bragGinasio, bragFundo, bragCaverna,
  // os nomes das músicas antigas (que saíram): quem ainda pedir por eles toca a nova
  saolucario: bragSaoLucario, br101: bragBr101,
};

/** QUAL MÚSICA EM QUAL MAPA. A MATA DO SACI fica de fora de propósito. */
export const MUSICA_DO_MAPA_BRAG = {
  sao_lucario: "bragSaoLucario", belem: "bragBelem", recife: "bragRecife", salvador: "bragSalvador",
  caruaru: "bragCaruaru", sampa: "bragSampa", ouropreto: "bragOuroPreto", rio: "bragRio",
  brasilia: "bragBasculinha", curitiba: "bragCuritiba", floripa: "bragFloripa", carvoriu: "bragCarvoriu",
  larvanjal: "bragLarvanjal", natal: "bragNatal", fortaleza: "bragFortaleza", manaus: "bragManaus",
  cuiaba: "bragCuiaba", esplanada: "bragLiga",
  ilha_do_mel: "bragIlhas", ilhabela: "bragIlhas", queimada_grande: "bragIlhas", ilha_grande: "bragIlhas",
  itaparica: "bragIlhas", marajo: "bragIlhas", atol: "bragIlhas", noronha: "bragIlhas",
  rota_br101: "bragBr101",
  transamazonica: "bragMata", br381: "bragMata", estrada_real: "bragMata", floresta_amazonica: "bragMata",
  br232: "bragLitoral", br101n: "bragLitoral", br324: "bragSertao", br116: "bragCerrado", br040: "bragCerrado",
  monte_serra: "bragSerra", pantanal: "bragPantanal", chapada: "bragChapada",
};
/** e por dentro: a música de sempre -> a de Braglitch */
export const MUSICA_TROCADA_BRAG = { center: "bragCentro", mart: "bragLoja", gym: "bragGinasio", fundoMar: "bragFundo" };

/** troca a música dos mapas de Braglitch (`ids` = os mapas de lá) */
export function aplicarMusicasBrag(maps, ids) {
  for (const id of ids) {
    const m = maps[id];
    if (!m || id === "mata_do_saci") continue;
    const nova = MUSICA_DO_MAPA_BRAG[id] || MUSICA_TROCADA_BRAG[m.music];
    if (nova) m.music = nova;
  }
  return maps;
}
