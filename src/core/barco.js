// O BARCO DO RESGATE do PÓS-PÓS-GAME e o ROBÔ DO PROF. CARVALHO que dirige ele
// (ideia do CAIO). Pixel por pixel: o barco é montado de três peças
// desenhadas à mão — a PROA (a ponta, virada pra esquerda), o MEIO (repetido
// pra ele caber todo mundo) e a POPA, com o motor de popa saindo pra trás —,
// mais o PAINEL do leme. O robô é uma grade só, de frente.
const COR = {
  k: "#1a1a2a", W: "#f2f2f6", w: "#c4c8d6", B: "#2a5ad0", b: "#1a3a90",
  D: "#9a6e44", d: "#7a5232", M: "#5a5e6a", m: "#8a8e9a", Y: "#f0c830", R: "#e04040",
  c: "#38d8f0", g: "#c8ccd8", G: "#8a90a0", y: "#ffd040",
};

const PROA = [
  "..............kkkkkkkkkk",
  "...........kkkWWWWWWWWWW",
  ".........kkWWWWWWwwwwwww",
  ".......kkWWWwwkDDDDDDDDD",
  "......kWWWwkkDDDDDDDDDDD",
  ".....kWWwkkDDDDDDDDDDDDD",
  "....kWWwkDDDDDDDDDDDDDDD",
  "....kWwkDDDDDDDDDDDDDDDD",
  "...kWWkDDDdddddddddddddd",
  "...kWwkDDDDDDDDDDDDDDDDD",
  "..kWWkDDDDDDDDDDDDDDDDDD",
  "..kWwkDDDDDDDDDDDDDDDDDD",
  "..kWwkDDDDDDDDDDDDDDDDDD",
  ".kWWkDDDDDDDDDDDDDDDDDDD",
  ".kWwkDDDDDDDDDDDDDDDDDDD",
  ".kWwkDDDdddddddddddddddd",
  "kWWkDDDDDDDDDDDDDDDDDDDD",
  "kWwkDDDDDDDDDDDDDDDDDDDD",
  "kWwkDDDDDDDDDDDDDDDDDDDD",
  "kWWkDDDDDDDDDDDDDDDDDDDD",
  ".kWwkDDDDDDDDDDDDDDDDDDD",
  ".kWwkDDDdddddddddddddddd",
  ".kWWkDDDDDDDDDDDDDDDDDDD",
  "..kWwkDDDDDDDDDDDDDDDDDD",
  "..kWwkDDDDDDDDDDDDDDDDDD",
  "..kWWkDDDDDDDDDDDDDDDDDD",
  "...kWwkDDDDDDDDDDDDDDDDD",
  "...kWWkDDDDDDDDDDDDDDDDD",
  "....kWwkkkkkkkkkkkkkkkkk",
  "....kWWWWWWWWWWWWWWWWWWW",
  ".....kWWwwwwwwwwwwwwwwww",
  ".....kBBBBBBBBBBBBBBBBBB",
  "......kBBbbbbbbbbbbbbbbb",
  "......kWWWWWWWWWWWWWWWWW",
  ".......kWwwwwwwwwwwwwwww",
  "........kwwwwwwwwwwwwwww",
  ".........kkkkkkkkkkkkkkk",
];
const MEIO = [
  "kkkkkkkkkkkkkkkk",
  "WWWWWWWWWWWWWWWW",
  "wwwwwwwwwwwwwwww",
  "DDDDDDDDDDDDDDDD",
  "DDDDDDDDDDDDDDDD",
  "DDDDDDDdDDDDDDDD",
  "DDDDDDDdDDDDDDDD",
  "DDDDDDDdDDDDDDDD",
  "dddddddddddddddd",
  "DDDDDDDDDDDDDDDd",
  "DDDDDDDDDDDDDDDd",
  "DDDDDDDDDDDDDDDd",
  "DDDDDDDDDDDDDDDd",
  "DDDDDDDDDDDDDDDd",
  "DDDDDDDDDDDDDDDd",
  "dddddddddddddddd",
  "DDDDDDDdDDDDDDDD",
  "DDDDDDDdDDDDDDDD",
  "DDDDDDDdDDDDDDDD",
  "DDDDDDDdDDDDDDDD",
  "DDDDDDDdDDDDDDDD",
  "dddddddddddddddd",
  "DDDDDDDDDDDDDDDd",
  "DDDDDDDDDDDDDDDd",
  "DDDDDDDDDDDDDDDd",
  "DDDDDDDDDDDDDDDd",
  "DDDDDDDDDDDDDDDd",
  "DDDDDDDDDDDDDDDd",
  "kkkkkkkkkkkkkkkk",
  "WWWWWWWWWWWWWWWW",
  "wwwwwwwwwwwwwwww",
  "BBBBBBBBBBBBBBBB",
  "bbbbbbbbbbbbbbbb",
  "WWWWWWWWWWWWWWWW",
  "wwwwwwwwwwwwwwww",
  "wwwwwwwwwwwwwwww",
  "kkkkkkkkkkkkkkkk",
];
const POPA = [
  "kkkkkkkkkk......",
  "WWWWWWWWWk......",
  "wwwwwwwwWk......",
  "DDDDDDDkWk......",
  "DDDDDDDkWk......",
  "DDDDDDDkWk......",
  "DDDDDDDkWk......",
  "DDDDDDDkWk......",
  "ddddddDkWk......",
  "DDDDDDDkWk......",
  "DDDDDDDkWkkkk...",
  "DDDDDDDkWkmmmk..",
  "DDDDDDDkWkmMMMk.",
  "DDDDDDDkWkmMYMk.",
  "DDDDDDDkWkmMMMk.",
  "ddddddDkWkmMMMk.",
  "DDDDDDDkWkmMMMk.",
  "DDDDDDDkWkmMMMk.",
  "DDDDDDDkWkkMMkk.",
  "DDDDDDDkWk.kMk..",
  "DDDDDDDkWk.kMk..",
  "ddddddDkWk.kkk..",
  "DDDDDDDkWk......",
  "DDDDDDDkWk......",
  "DDDDDDDkWk......",
  "DDDDDDDkWk......",
  "DDDDDDDkWk......",
  "DDDDDDDkWk......",
  "kkkkkkkkWk......",
  "WWWWWWWWWk......",
  "wwwwwwwwWk......",
  "BBBBBBBBBk......",
  "bbbbbbbbk.......",
  "WWWWWWWk........",
  "wwwwwwk.........",
  "wwwwwk..........",
  "kkkkk...........",
];
// o PAINEL do leme (onde o robô fica), com o volante e as luzinhas
const PAINEL = [
  "..kkkkkkkk..",
  ".kMMMMMMMMk.",
  "kMmmmmmmmmMk",
  "kMmRmYmcmmMk",
  "kMmmmmmmmmMk",
  "kMMMkkkkMMMk",
  "kMMkGGGGkMMk",
  "kMMkGkkGkMMk",
  "kMMMkGGkMMMk",
  "kkkkkkkkkkkk",
];
// O ROBÔ DO PROF. CARVALHO: cabeça quadrada com a antena acesa, os olhos de
// visor, a grade da boca, o peito com a luz vermelha (a do laboratório)
const ROBO = [
  ".......y........",
  ".......k........",
  "....kkkkkkkk....",
  "...kggggggggk...",
  "...kgccggccgk...",
  "...kgccggccgk...",
  "...kggggggggk...",
  "...kgkGkGkGgk...",
  "....kkkkkkkk....",
  "......kGGk......",
  "..kkkkkkkkkkkk..",
  ".kgGGGGGGGGGGgk.",
  "kgkGGGRRGGGGkgk.",
  "kgkGGGRRGGGGkgk.",
  "kgkGGGGGGGGGkgk.",
  ".kkGGGGGGGGGkk..",
  "..kGGGGGGGGGk...",
  "..kkkkkkkkkkk...",
  "...kGGk..kGGk...",
  "...kGGk..kGGk...",
  "...kkkk..kkkk...",
];

function grade(linhas) {
  const w = Math.max(...linhas.map((l) => l.length)), h = linhas.length;
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  const ctx = cv.getContext("2d");
  linhas.forEach((l, y) => {
    for (let x = 0; x < l.length; x++) {
      const c = COR[l[x]];
      if (c) { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1); }
    }
  });
  return cv;
}

let barco = null, robo = null;
/** o barco inteiro: a proa, `meios` pedaços do meio e a popa */
export function barcoArt(meios = 6) {
  if (barco) return barco;
  const proa = grade(PROA), meio = grade(MEIO), popa = grade(POPA), painel = grade(PAINEL);
  const cv = document.createElement("canvas");
  cv.width = proa.width + meio.width * meios + popa.width;
  cv.height = proa.height;
  const ctx = cv.getContext("2d");
  ctx.drawImage(proa, 0, 0);
  for (let i = 0; i < meios; i++) ctx.drawImage(meio, proa.width + i * meio.width, 0);
  ctx.drawImage(popa, proa.width + meios * meio.width, 0);
  // o painel do leme, perto da popa
  ctx.drawImage(painel, proa.width + meios * meio.width - 14, 6);
  barco = { cv, convesY: 4, convesAlto: 24, leme: proa.width + meios * meio.width - 10 };
  return barco;
}

export const roboArt = () => (robo ||= grade(ROBO));
