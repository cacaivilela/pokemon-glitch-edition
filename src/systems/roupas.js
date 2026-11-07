// AS ROUPAS NO BONECO (src/data/roupas.js). O quadro do jogador ganha uma cópia
// vestida: a peça de CABEÇA troca o boné pelo cabelo e põe a peça em cima; a de
// CORPO pinta a blusa nos três tons dela; ROSTO, CINTURA e MÃO vão por cima.
// Tudo contado do TOPO DA CABEÇA do quadro, então nos quadros de passo (a cabeça
// 1 pixel mais baixa) o desenho desce junto.
import { ROUPAS, CABELO } from "../data/roupas.js";

const POR_ID = Object.fromEntries(ROUPAS.map((r) => [r.id, r]));
export const roupa = (id) => POR_ID[id] || null;

/** as roupas que o jogador tem: as grátis, as dos líderes vencidos e as compradas */
export function roupasDoJogador(st) {
  const ins = new Set(st?.badges || []);
  return ROUPAS.filter((r) => r.gratis || (r.insignia && ins.has(r.insignia)) || st?.roupas?.[r.id]);
}

/** as dos líderes que ainda não foram avisadas (pra dizer "VOCÊ GANHOU") */
export function roupasNovas(st) {
  const ins = new Set(st?.badges || []);
  return ROUPAS.filter((r) => r.insignia && ins.has(r.insignia) && !st.roupasAvisadas?.[r.id]);
}

export function vestidas(st) { return st?.roupaVestida || {}; }

/** veste ou tira (a mesma de novo tira) */
export function trocarRoupa(st, id) {
  const r = roupa(id);
  if (!r) return;
  st.roupaVestida ||= {};
  if (st.roupaVestida[r.parte] === id) delete st.roupaVestida[r.parte];
  else st.roupaVestida[r.parte] = id;
}

// a pele, o contorno e o cabelo não são pintados pela roupa de corpo
const NAO_PINTA = new Set(["0,0,0", "222,148,115", "255,197,148", "246,189,148", "123,65,65", "172,123,65", "189,156,57", "255,222,90"]);

function topo(img) {
  const g = img.getContext ? img.getContext("2d") : null;
  if (!g) return 12;
  const d = g.getImageData(0, 0, img.width, img.height).data;
  for (let y = 0; y < img.height; y++) for (let x = 0; x < img.width; x++) if (d[(y * img.width + x) * 4 + 3]) return y;
  return 12;
}

const cache = new WeakMap();

/** o quadro vestido (ou o mesmo, sem roupa). `dir` é a direção pra onde ele olha;
 *  `folha` é qual boneco ("hero", "heroina"...) — o cabelo sem boné só existe nesses dois. */
export function vestirQuadro(img, st, dir, folha) {
  const v = vestidas(st);
  const ids = Object.values(v).filter((id) => POR_ID[id]);
  if (!img || !ids.length) return img;
  const chave = `${folha}|${dir}|${ids.sort().join(",")}`;
  let m = cache.get(img);
  if (!m) cache.set(img, (m = new Map()));
  if (m.has(chave)) return m.get(chave);

  const cv = document.createElement("canvas");
  cv.width = img.width; cv.height = img.height;
  const g = cv.getContext("2d");
  g.imageSmoothingEnabled = false;
  g.drawImage(img, 0, 0);
  const t = topo(cv);
  const W = cv.width, ox = Math.floor((W - 16) / 2);
  const dados = g.getImageData(0, 0, W, cv.height), px = dados.data;
  const espelha = dir === "right";
  const lado = dir === "right" ? "left" : dir;
  const pinta = (linhas, cores) => {
    for (const [k, txt] of Object.entries(linhas || {})) {
      const y = t + Number(k);
      if (y < 0 || y >= cv.height) continue;
      for (let i = 0; i < 16; i++) {
        const ch = txt[espelha ? 15 - i : i];
        if (!ch || ch === ".") continue;
        const c = ch === "e" && !cores.e ? [0, 0, 0] : cores[ch];
        if (!c) continue;
        const o = (y * W + ox + i) * 4;
        px[o] = c[0]; px[o + 1] = c[1]; px[o + 2] = c[2]; px[o + 3] = 255;
      }
    }
  };
  // CORPO: a blusa nos três tons (do escuro pro claro), da linha 11 à 15 da cabeça
  const corpo = POR_ID[v.corpo];
  if (corpo?.tons) {
    for (let y = t + 11; y <= t + 15 && y < cv.height; y++) {
      for (let x = 0; x < W; x++) {
        const o = (y * W + x) * 4;
        if (!px[o + 3] || NAO_PINTA.has(`${px[o]},${px[o + 1]},${px[o + 2]}`)) continue;
        const l = 0.3 * px[o] + 0.59 * px[o + 1] + 0.11 * px[o + 2];
        const c = corpo.tons[l < 90 ? 0 : l < 170 ? 1 : 2];
        px[o] = c[0]; px[o + 1] = c[1]; px[o + 2] = c[2];
      }
    }
  }
  // CABEÇA: some o boné (as linhas 0 a 8), entra o cabelo, e a peça por cima
  const cab = POR_ID[v.cabeca], cabelo = CABELO[folha];
  if (cab && cabelo) {
    for (let y = t; y <= t + 8 && y < cv.height; y++) for (let x = 0; x < W; x++) px[(y * W + x) * 4 + 3] = 0;
    pinta(cabelo.linhas[lado], cabelo.cores);
    pinta(cab.linhas?.[lado], cab.cores || {});
  }
  if (corpo) pinta(corpo.linhas?.[lado], corpo.cores || {});
  for (const parte of ["rosto", "cintura", "mao"]) {
    const r = POR_ID[v[parte]];
    if (r) pinta(r.linhas?.[lado], r.cores || {});
  }
  g.putImageData(dados, 0, 0);
  m.set(chave, cv);
  return cv;
}
