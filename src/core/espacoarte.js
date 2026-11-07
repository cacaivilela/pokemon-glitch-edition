// O DESENHO DOS PLANETAS (src/data/espaco.js): um pintor só, com as cores e o
// jeito de cada planeta. As letras da planta estão explicadas lá.
import { makeRng } from "./rng.js";
import { PLANETAS, TODOS_PLANETAS } from "../data/espaco.js";

/** as cores de cada chão, pelo `estilo` do planeta */
const JEITO = {
  // o CÉU DAS NUVENS: chão de nuvem branquinha, mato de nuvem fofa, o azul do céu embaixo
  nuvem:    { chao: ["#f4f8ff", "#eaf2ff", "#ffffff", "#dce8f8"], mato: ["#ffffff", "#dde9fa", "#b8cce8"], pedra: ["#a8c0e0", "#c8dcf4", "#ffffff", "#7890b8"],
              liq: ["#7ab8f0", "#a8d4fa", "#ffffff"], arvore: ["#ffffff", "#dde9fa", "#a8c0e0"] },
  crateras: { chao: ["#8a8a98", "#94949f", "#7e7e8c", "#a0a0ac"], mato: ["#c8c8e0", "#9a9ab8", "#6a6a8a"], pedra: ["#4a4a58", "#6a6a78", "#9a9aa8", "#2a2a36"],
              liq: ["#2a2a40", "#3a3a58", "#5a5a80"], arvore: ["#e8e8ff", "#b0b0d8", "#7070a0"] },
  oceano:   { chao: ["#e8d8a0", "#f0e0b0", "#d8c890", "#f8ecc0"], mato: ["#58d0a0", "#2a9a78", "#1a6a58"], pedra: ["#5a6a7a", "#7a8a9a", "#a8b8c8", "#2a3a4a"],
              liq: ["#1a5ab0", "#2a7ad0", "#5ab0f0"], arvore: ["#ff8a9a", "#e05a7a", "#a83a5a"] },
  lava:     { chao: ["#3a2a2a", "#443030", "#302424", "#4e3838"], mato: ["#ff9a40", "#c85a20", "#7a2a10"], pedra: ["#2a1a1a", "#4a3030", "#6a4a40", "#140a0a"],
              liq: ["#e85a18", "#ff8a28", "#ffd060"], arvore: ["#ffb040", "#e06020", "#8a2a10"] },
  gelo:     { chao: ["#e0f0ff", "#eaf6ff", "#d0e6f8", "#f4faff"], mato: ["#9ad0f0", "#5a9ad0", "#3a6aa0"], pedra: ["#5a7a9a", "#7a9aba", "#b0d0ea", "#2a4a6a"],
              liq: ["#9ad8f8", "#c0eaff", "#ffffff"], arvore: ["#ffffff", "#b8e0ff", "#6aa0d0"] },
  faixas:   { chao: ["#f0d8b0", "#f8e4c0", "#e4c8a0", "#fff0d8"], mato: ["#e0a070", "#b0703a", "#7a4a20"], pedra: ["#a07050", "#c09070", "#e8c8a0", "#5a3a20"],
              liq: ["#c8905a", "#e0b080", "#fff0d8"], arvore: ["#fff8e8", "#e8c8a0", "#a07050"] },
  cristal:  { chao: ["#3a2a50", "#44325c", "#322446", "#4e3a68"], mato: ["#e070d8", "#a040a8", "#6a2a78"], pedra: ["#2a1a40", "#4a3060", "#7a5aa0", "#140a24"],
              liq: ["#8a4ac8", "#b070e8", "#ffe0ff"], arvore: ["#ffe0ff", "#e070d8", "#8a4ac8"] },
  dna:      { chao: ["#2a4a3a", "#305444", "#244034", "#3a6050"], mato: ["#c080f0", "#8a40c0", "#5a2a8a"], pedra: ["#1a2a20", "#2a4a3a", "#50a070", "#0a140e"],
              liq: ["#3ac080", "#70f0b0", "#e0ffe8"], arvore: ["#e0a0ff", "#a050d0", "#50e0a0"] },
  ovo:      { chao: ["#f0d060", "#f8e080", "#e0c050", "#fff0a0"], mato: ["#fff8d0", "#e8c860", "#b08a30"], pedra: ["#8a6a20", "#b08a30", "#f0d060", "#5a4010"],
              liq: ["#fff8d0", "#ffffff", "#ffffff"], arvore: ["#ffffff", "#fff0a0", "#e0b040"] },
  ultra:    { chao: ["#2a1a40", "#30204a", "#241634", "#3a2a5a"], mato: ["#60f0e0", "#30a0b0", "#205a70"], pedra: ["#1a1030", "#4a2a7a", "#8a5ac0", "#0a0618"],
              liq: ["#c070f0", "#60f0e0", "#ffffff"], arvore: ["#60f0e0", "#c070f0", "#ff70c0"] },
  metal:    { chao: ["#6a7280", "#747c8a", "#606876", "#7e8694"], mato: ["#9ae0c0", "#4aa088", "#2a6a5a"], pedra: ["#3a3e48", "#5a6270", "#9aa4b4", "#1a1e26"],
              liq: ["#2a2e38", "#3a4250", "#5ae0ff"], arvore: ["#e0e8f0", "#9aa4b4", "#ff4a4a"] },
};

/** o planeta dono da planta (a planta é a mesma lista do src/data/espaco.js) */
export const planetaDoMapa = (id) => (id === "espaco_base" ? { estilo: "metal" } : id === "ceu_nuvens" ? { estilo: "nuvem" } : TODOS_PLANETAS.find((p) => p.mapa === id) || PLANETAS[1]);

export function pintarPlaneta(geo, makeCanvas, idMapa) {
  const p = planetaDoMapa(idMapa), J = JEITO[p.estilo] || JEITO.crateras;
  const r = makeRng(9100 + (idMapa || "").length * 31);
  const planta = geo.planta || [];
  const th = planta.length, tw = planta[0]?.length || 0;
  const { cv, ctx } = makeCanvas(tw * 16, th * 16);
  const at = (x, y) => planta[y]?.[x] ?? "#";
  const px = (x, y, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1); };
  const ret = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  const parede = (x, y) => at(x, y) === "#";
  const fundo = (x, y) => "~LV".includes(at(x, y));

  const chao = (x, y) => {
    const X = x * 16, Y = y * 16;
    ret(X, Y, 16, 16, J.chao[0]);
    for (let k = 0; k < 12; k++) px(X + r.int(16), Y + r.int(16), r.pick(J.chao));
    if (p.estilo === "metal") {          // as placas do chão, com rebite
      ret(X, Y, 16, 1, J.chao[3]); ret(X, Y, 1, 16, J.chao[3]); ret(X + 15, Y, 1, 16, J.chao[2]); ret(X, Y + 15, 16, 1, J.chao[2]);
      px(X + 2, Y + 2, J.pedra[3]); px(X + 13, Y + 2, J.pedra[3]); px(X + 2, Y + 13, J.pedra[3]); px(X + 13, Y + 13, J.pedra[3]);
    }
    if (p.estilo === "dna" && (x + y) % 3 === 0) for (let i = 0; i < 14; i++) { px(X + 1 + i, Y + 8 + Math.round(Math.sin(i * 0.9) * 4), "#50e0a0"); px(X + 1 + i, Y + 8 - Math.round(Math.sin(i * 0.9) * 4), "#c080f0"); }
    if (p.estilo === "cristal" && r.chance(0.12)) { const cx = X + 3 + r.int(10), cy = Y + 3 + r.int(10); px(cx, cy, J.liq[2]); px(cx, cy + 1, J.liq[1]); }
    if (p.estilo === "lava" && r.chance(0.18)) { const cx = X + 2 + r.int(12), cy = Y + 2 + r.int(12); ret(cx, cy, 3, 1, "#7a2a10"); px(cx + 1, cy, "#e85a18"); }
    if (parede(x, y - 1)) { ret(X, Y, 16, 3, "rgba(10,10,30,0.3)"); ret(X, Y + 3, 16, 2, "rgba(10,10,30,0.15)"); }
    if (fundo(x, y + 1)) { ret(X, Y + 14, 16, 2, J.pedra[1]); ret(X, Y + 15, 16, 1, J.pedra[3]); }
  };
  const TUFO = ["..a.....a.......", ".ab..a..ab..a...", ".ab.ab..ab.ab...", "abbcab.abbcab...", "abbcabbabbcabb..", "bbcccbbbbcccbb..", "bccccbbbcccccb..", ".dddd...ddddd..."];
  const grade = (X, Y, linhas, cores) => linhas.forEach((l, dy) => [...l].forEach((ch, dx) => { if (cores[ch]) px(X + dx, Y + dy, cores[ch]); }));
  const mato = (x, y) => {
    chao(x, y);
    const c = { a: J.mato[0], b: J.mato[1], c: J.mato[2], d: "rgba(0,0,0,0.28)" };
    grade(x * 16, y * 16, TUFO, c); grade(x * 16 + 4, y * 16 + 8, TUFO, c);
  };
  // o "fundo": água, lava ou o mar de nuvem do planeta de gás
  const liq = (x, y) => {
    const X = x * 16, Y = y * 16, L = at(x, y) === "L" ? JEITO.lava.liq : J.liq;
    ret(X, Y, 16, 16, L[0]);
    for (let k = 0; k < 3; k++) if (r.chance(0.65)) ret(X + r.int(11), Y + 2 + r.int(12), 3 + r.int(4), 1, L[1]);
    if (r.chance(0.35)) px(X + r.int(15), Y + r.int(15), L[2]);
    if (at(x, y) === "V") for (let k = 0; k < 4; k++) ret(X + r.int(10), Y + r.int(14), 4 + r.int(5), 2, k % 2 ? L[1] : L[2]);
    const terra = (dx, dy) => !fundo(x + dx, y + dy) && at(x + dx, y + dy) !== "=";
    if (terra(0, -1)) { ret(X, Y, 16, 2, L[2]); ret(X, Y + 2, 16, 1, L[1]); }
    if (terra(-1, 0)) ret(X, Y, 2, 16, L[1]);
    if (terra(1, 0)) ret(X + 14, Y, 2, 16, L[1]);
  };
  const ponte = (x, y) => {
    liq(x, y);
    const X = x * 16, Y = y * 16, horiz = fundo(x, y - 1) && fundo(x, y + 1);
    const madeira = p.estilo === "metal" || p.estilo === "faixas" ? ["#9aa4b4", "#5a6270", "#e0e8f0"] : ["#8a5a32", "#5a3a1e", "#a8743e"];
    if (horiz) { ret(X, Y + 1, 16, 14, madeira[0]); for (let k = 0; k < 4; k++) { ret(X + k * 4, Y + 1, 1, 14, madeira[1]); ret(X + k * 4 + 1, Y + 2, 1, 12, madeira[2]); } }
    else { ret(X + 1, Y, 14, 16, madeira[0]); for (let k = 0; k < 4; k++) { ret(X + 1, Y + k * 4, 14, 1, madeira[1]); ret(X + 2, Y + k * 4 + 1, 12, 1, madeira[2]); } }
  };
  // o PAREDÃO: pedra em camadas, com a cara virada pro chão
  const pedra = (x, y) => {
    const X = x * 16, Y = y * 16, P = J.pedra;
    const chaoEmbaixo = !parede(x, y + 1), chaoEmCima = !parede(x, y - 1);
    ret(X, Y, 16, 16, P[0]);
    for (let k = 0; k < 3; k++) if (r.chance(0.6)) ret(X + r.int(12), Y + r.int(12), 4, 3, P[1]);
    if (chaoEmbaixo) {
      ret(X, Y + 3, 16, 13, P[1]);
      for (let k = 0; k < 3; k++) { ret(X, Y + 4 + k * 4, 16, 2, k % 2 ? P[0] : P[2]); ret(X + ((x * 7 + k * 5) % 12), Y + 6 + k * 4, 3, 1, P[3]); }
      ret(X, Y + 3, 16, 1, P[2]); ret(X, Y + 15, 16, 1, P[3]);
    }
    if (chaoEmCima) ret(X, Y, 16, 2, P[2]);
  };
  const GELO = (x, y) => { const X = x * 16, Y = y * 16; ret(X, Y, 16, 16, "#b8e4ff"); ret(X + 1, Y + 1, 14, 14, "#cceeff");
    for (let k = 0; k < 2; k++) { const a = r.int(10); for (let i = 0; i < 5; i++) px(X + 2 + a + i, Y + 3 + a - i + k * 5, "#ffffff"); } };
  const CRISTAL = ["................", ".........k......", "........kck.....", "...k....kcmk....", "..kck..kccmk....", "..kcmk.kcmmk..k.", "..kcmk.kcmme.kck",
    ".kccmk.kcmme.kcm", ".kcmmekkcmmekkcm", ".kcmmekcmmmeekmm", ".kcmmekcmmmeekme", "kccmmeekcmmeekme", "kcmmmeekcmmeekee", "kkkkkkkkkkkkkkkk", ".ssssssssssssss.", "................"];
  const cristal = (x, y) => { chao(x, y); const c = p.estilo === "gelo" ? ["#2a4a6a", "#ffffff", "#b8e4ff", "#7ab0e0"] : ["#2a1a40", "#ffe0ff", "#e070d8", "#8a4ac8"];
    grade(x * 16, y * 16, CRISTAL, { k: c[0], c: c[1], m: c[2], e: c[3], s: "rgba(0,0,0,0.3)" }); };
  const PEDREGULHO = ["................", "................", "................", ".....kkkkkk.....", "...kkllmmmmkk...", "..kllllmmmmmmk..", "..klllmmmmmmmk..", ".kllmmmmmmmmsk..",
    ".klmmmmmmmmmssk.", ".kmmmmmmmmmmssk.", ".kmmmmmmmmmsssk.", ".ksmmmmmmmsssk..", "..kssmmmssssk...", "...kkksssskk....", "..hhhkkkkkhhhh..", "................"];
  const rocha = (x, y) => { chao(x, y); const P = J.pedra; grade(x * 16, y * 16, PEDREGULHO, { k: P[3], l: P[2], m: P[1], s: P[0], h: "rgba(0,0,0,0.25)" }); };
  // a CRATERA: um buraco redondo com borda clara em cima e sombra embaixo
  const cratera = (x, y) => {
    chao(x, y);
    if (p.estilo === "ovo") {             // no OVO: a RACHADURA de luz
      const X = x * 16, Y = y * 16;
      for (let i = 0; i < 12; i++) { const yy = Y + 2 + i, xx = X + 4 + Math.round(Math.sin(i * 1.3) * 3); ret(xx - 1, yy, 3, 1, "#fff8d0"); px(xx, yy, "#ffffff"); }
      return;
    }
    const X = x * 16, Y = y * 16, P = J.pedra;
    ctx.fillStyle = P[0]; ctx.beginPath(); ctx.ellipse(X + 8, Y + 9, 7, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = P[3]; ctx.beginPath(); ctx.ellipse(X + 8, Y + 8, 5, 3, 0, 0, Math.PI * 2); ctx.fill();
    ret(X + 3, Y + 4, 10, 1, P[2]); ret(X + 4, Y + 14, 8, 1, P[2]);
  };
  // a "ÁRVORE" de cada planeta: coral, antena, pinheiro de gelo...
  const arvore = (x, y) => {
    chao(x, y);
    const X = x * 16, Y = y * 16, A = J.arvore;
    ret(X + 5, Y + 14, 8, 2, "rgba(0,0,0,0.3)");
    if (p.estilo === "metal") {         // antena com a luz vermelha
      ret(X + 7, Y + 3, 2, 12, A[1]); ret(X + 4, Y + 6, 8, 1, A[1]); ret(X + 5, Y + 9, 6, 1, A[1]); ret(X + 7, Y + 3, 1, 12, A[0]);
      ret(X + 7, Y + 1, 2, 2, (performance.now?.() || 0) % 2 ? A[2] : A[2]);
    } else if (p.estilo === "gelo") {   // pinheiro de gelo
      for (let i = 0; i < 6; i++) ret(X + 8 - i, Y + 2 + i * 2, i * 2 + 1, 2, i % 2 ? A[1] : A[0]);
      ret(X + 7, Y + 14, 2, 2, A[2]);
    } else {                            // coral (e no resto, uma planta-coral do planeta)
      ret(X + 7, Y + 5, 2, 10, A[1]); ret(X + 4, Y + 3, 2, 8, A[1]); ret(X + 10, Y + 4, 2, 7, A[1]);
      ret(X + 4, Y + 10, 4, 2, A[1]); ret(X + 9, Y + 9, 3, 2, A[1]);
      px(X + 4, Y + 2, A[0]); px(X + 10, Y + 3, A[0]); px(X + 7, Y + 4, A[0]); ret(X + 8, Y + 5, 1, 9, A[2]);
    }
  };
  // a PISTA DE POUSO: placa de metal com o círculo e o X amarelos
  const pistaPouso = (x, y) => {
    const X = x * 16, Y = y * 16;
    ret(X, Y, 16, 16, "#5a6270"); ret(X, Y, 16, 1, "#9aa4b4"); ret(X, Y + 15, 16, 1, "#2a2e38");
    for (let k = 0; k < 4; k++) px(X + r.int(16), Y + r.int(16), "#6a7280");
    if (at(x - 1, y) !== "X") ret(X, Y, 2, 16, "#e8c830");
    if (at(x + 1, y) !== "X") ret(X + 14, Y, 2, 16, "#e8c830");
    if (at(x, y - 1) !== "X") ret(X, Y, 16, 2, "#e8c830");
    if (at(x, y + 1) !== "X") ret(X, Y + 14, 16, 2, "#e8c830");
  };

  for (let y = 0; y < th; y++) for (let x = 0; x < tw; x++) {
    const c = at(x, y);
    if (c === "#") pedra(x, y);
    else if (c === ",") mato(x, y);
    else if ("~LV".includes(c)) liq(x, y);
    else if (c === "=") ponte(x, y);
    else if (c === "g") GELO(x, y);
    else if (c === "k") cristal(x, y);
    else if (c === "o") rocha(x, y);
    else if (c === "c") cratera(x, y);
    else if (c === "t") arvore(x, y);
    else if (c === "X") pistaPouso(x, y);
    else chao(x, y);
  }
  return cv;
}
