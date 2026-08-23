// A ARTISTA — a máquina desenhando sozinha.
//
// Ela faz o que você faz na oficina: escolhe uma dupla, desenha o bicho, dá
// nome, escolhe os tipos, decide quanto cada atributo sobe por nível, escreve
// uma linha de Pokédex e publica. Sem parar, uma atrás da outra.
//
// Não é sorteio. Cada passo tem critério:
//
//   ESCOLHER  ela sorteia várias duplas e fica com a MELHOR: tipos que se
//             cobrem, nome que soa bem, atributos que não desandam, e que
//             ninguém tenha feito ainda.
//   PINTAR    o corpo recolorido com a paleta da cabeça, a cabeça por cima num
//             corte que muda de dupla pra dupla, contorno escuro em volta (é o
//             contorno que faz parecer desenho e não recorte) e um detalhe do
//             tipo: brasa, gota, faísca, folha, espinho...
//   FICHA     um TEMPERAMENTO sorteado (BRUTO, RELÂMPAGO, MURALHA, MÍSTICO,
//             EQUILIBRADO) empurra dois atributos pra cima e um pra baixo,
//             mantendo o total perto do que a dupla daria — então cada ficha
//             dela é diferente sem ser desequilibrada.
//
// Ela publica no SEU aparelho (a rota /__ficha do dev_server), com o nome dela
// no campo `autor`. Nada sai daqui pra lugar nenhum.
import { DB } from "../data/index.js";
import { Assets, makeCanvas } from "../core/assets.js";
import { montarEspecie, chaveFicha, fichasProntas, fichaDe } from "./fusao.js";
import { notaHarmonia } from "./concurso.js";

export const ASSINATURA = "A MÁQUINA";

/** rng com semente: a mesma dupla dá sempre o mesmo bicho */
function semente(txt) {
  let h = 2166136261;
  for (let i = 0; i < txt.length; i++) { h ^= txt.charCodeAt(i); h = Math.imul(h, 16777619); }
  return () => {
    h ^= h << 13; h ^= h >>> 17; h ^= h << 5; h |= 0;
    return ((h >>> 0) % 100000) / 100000;
  };
}

const STATS = ["hp", "atk", "def", "spa", "spd", "spe"];

/** Os cinco jeitos de ser: dois atributos pra cima, um pra baixo. */
export const TEMPERAMENTOS = [
  { id: "bruto", nome: "BRUTO", sobe: ["atk", "def"], desce: "spe",
    lore: "TUDO NELE É PESO. QUANDO ACERTA, ACERTA UMA VEZ SÓ." },
  { id: "relampago", nome: "RELÂMPAGO", sobe: ["spe", "spa"], desce: "hp",
    lore: "CHEGA ANTES DO PRÓPRIO BARULHO. E NÃO AGUENTA DOIS GOLPES." },
  { id: "muralha", nome: "MURALHA", sobe: ["hp", "def"], desce: "spa",
    lore: "NÃO GANHA RÁPIDO. SÓ NÃO PERDE — E ISSO CANSA QUEM ESTÁ DO OUTRO LADO." },
  { id: "mistico", nome: "MÍSTICO", sobe: ["spa", "spd"], desce: "atk",
    lore: "ELE NÃO ENCOSTA EM VOCÊ. NÃO PRECISA." },
  { id: "equilibrado", nome: "EQUILIBRADO", sobe: ["hp", "spe"], desce: "def",
    lore: "NADA NELE CHAMA ATENÇÃO, E É POR ISSO QUE ELE DURA." },
];

/** Todas as espécies que podem entrar numa fusão. */
function elenco() {
  return Object.values(DB.SPECIES || {})
    .filter((sp) => !sp.mega && !sp.fusao && sp.base && sp.types?.length);
}

/** Essa dupla já foi feita (por você ou por ela)? */
function jaExiste(st, cab, cor) {
  return !!fichaDe(cab, cor) || fichasProntas(cab, cor).length > 0
    || !!st?.fusoes?.[chaveFicha(cab, cor)];
}

/** Nota de "vale a pena desenhar": tipos que se cobrem, nome que soa bem,
 *  atributos que não desandam. É com ela que a artista escolhe. */
export function nota(sp) {
  if (!sp) return -1;
  let n = notaHarmonia(sp.types) * 1.2;                 // 0..12
  if (sp.types.length === 2) n += 2;                    // mistura é melhor que monotipo
  const nome = sp.name || "";
  if (nome.length >= 6 && nome.length <= 11) n += 2;    // nome que cabe e não é sílaba solta
  if (/(.)\1\1/.test(nome)) n -= 3;                     // AAA no meio do nome: feio
  if (/[AEIOU]{3}/.test(nome)) n -= 1.5;
  const soma = Object.values(sp.base).reduce((a, b) => a + b, 0);
  n += soma > 300 && soma < 520 ? 2 : 0;                // nem fraquinho nem absurdo
  const menor = Math.min(...Object.values(sp.base));
  if (menor < 25) n -= 1.5;                             // um atributo largado atrás
  return n;
}

/** Sorteia várias duplas e devolve a melhor que ainda não existe. */
export function escolherDupla(st, tentativas = 24) {
  const lista = elenco();
  if (lista.length < 2) return null;
  let melhor = null;
  for (let i = 0; i < tentativas; i++) {
    const cab = lista[Math.floor(Math.random() * lista.length)];
    const cor = lista[Math.floor(Math.random() * lista.length)];
    if (!cab || !cor || cab.id === cor.id) continue;
    if (jaExiste(st, cab.id, cor.id)) continue;
    const sp = montarEspecie(cab.id, cor.id);
    if (!sp) continue;
    const n = nota(sp);
    if (!melhor || n > melhor.n) melhor = { n, cabeca: cab.id, corpo: cor.id, sp };
  }
  return melhor;
}

/** A ficha inteira daquela dupla: nome, tipos, crescimento e a linha da
 *  Pokédex. O desenho vem em `desenhar`. */
export function inventarFicha(cabecaId, corpoId) {
  const sp = montarEspecie(cabecaId, corpoId);
  if (!sp) return null;
  const r = semente(`${cabecaId}+${corpoId}`);
  const base = DB.FUSAO.ficha(sp);                 // o que a máquina calcularia
  const t = TEMPERAMENTOS[Math.floor(r() * TEMPERAMENTOS.length)];

  // o temperamento empurra dois pra cima e um pra baixo, sem inflar o total
  const cresc = { ...base.crescimento };
  for (const k of t.sobe) cresc[k] = Math.round(Math.min(9, cresc[k] * (1.28 + r() * 0.16)) * 10) / 10;
  cresc[t.desce] = Math.round(Math.max(0.3, cresc[t.desce] * (0.62 - r() * 0.12)) * 10) / 10;
  const antes = STATS.reduce((n, k) => n + base.crescimento[k], 0);
  const agora = STATS.reduce((n, k) => n + cresc[k], 0);
  const ajuste = agora > 0 ? antes / agora : 1;
  for (const k of STATS) cresc[k] = Math.round(Math.max(0.3, cresc[k] * ajuste) * 10) / 10;

  const cab = DB.SPECIES[cabecaId], cor = DB.SPECIES[corpoId];
  return {
    nome: sp.name,
    tipos: [...sp.types],
    inicial: { ...base.inicial },
    crescimento: cresc,
    lore: `${cab.name} NA CABEÇA, ${cor.name} NO CORPO. ${t.lore}`,
    temperamento: t,
  };
}

// ---------------------------------------------------------------- o desenho
const px = (ctx, cor, x, y, w = 1, h = 1) => { ctx.fillStyle = cor; ctx.fillRect(x, y, w, h); };

/** A cor média dos pixels opacos de um sprite. */
function corMedia(img) {
  const { ctx } = makeCanvas(16, 16);
  ctx.drawImage(img, 0, 0, 16, 16);
  let r = 0, g = 0, b = 0, n = 0;
  try {
    const d = ctx.getImageData(0, 0, 16, 16).data;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 128) continue;
      r += d[i]; g += d[i + 1]; b += d[i + 2]; n++;
    }
  } catch { return null; }
  return n ? `rgb(${Math.round(r / n)},${Math.round(g / n)},${Math.round(b / n)})` : null;
}

/** Contorno escuro em volta do que está desenhado. É ele que faz a fusão
 *  parecer um bicho desenhado, e não dois pedaços colados. */
function contornar(cv, cor = "rgba(12,10,20,.85)") {
  const lado = cv.width;
  const ctx = cv.getContext("2d");
  let dados;
  try { dados = ctx.getImageData(0, 0, lado, lado).data; } catch { return; }
  const cheio = (x, y) => x >= 0 && y >= 0 && x < lado && y < lado && dados[(y * lado + x) * 4 + 3] > 40;
  ctx.fillStyle = cor;
  for (let y = 0; y < lado; y++) {
    for (let x = 0; x < lado; x++) {
      if (cheio(x, y)) continue;
      if (cheio(x - 1, y) || cheio(x + 1, y) || cheio(x, y - 1) || cheio(x, y + 1)) ctx.fillRect(x, y, 1, 1);
    }
  }
}

/** O detalhe do tipo: o que faz cada fusão ter cara de alguma coisa. */
const DETALHES = {
  FOGO: (c, l, r) => { for (let i = 0; i < 6; i++) px(c, i % 2 ? "#ffd166" : "#f5731f", 12 + Math.floor(r() * 40), 4 + Math.floor(r() * 10), 2, 2); },
  "ÁGUA": (c, l, r) => { for (let i = 0; i < 5; i++) { const x = 6 + Math.floor(r() * 52), y = l - 16 + Math.floor(r() * 12); px(c, "#9adcf6", x, y, 1, 2); px(c, "#e6faff", x, y, 1, 1); } },
  "ELÉTRICO": (c, l, r) => { for (let i = 0; i < 3; i++) { const x = r() < 0.5 ? 5 : l - 9, y = 14 + Math.floor(r() * 24); for (let k = 0; k < 5; k++) px(c, "#ffe14d", x + (k % 2 ? 2 : 0), y + k, 2, 1); } },
  PLANTA: (c, l, r) => { for (const lado of [-1, 1]) { const x = l / 2 + lado * (8 + Math.floor(r() * 6)); for (let k = 0; k < 5; k++) px(c, k < 2 ? "#79c45a" : "#31782a", x + lado * k, 6 + k, 2, 2); } },
  VENENO: (c, l, r) => { for (let i = 0; i < 5; i++) px(c, i % 2 ? "#d43cd4" : "#8a1c8a", 8 + Math.floor(r() * 48), l - 18 + Math.floor(r() * 14), 3, 3); },
  "PSÍQUICO": (c, l, r) => { for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; px(c, "#ff9ec4", Math.round(l / 2 + Math.cos(a) * 22), Math.round(16 + Math.sin(a) * 10), 2, 2); } },
  FANTASMA: (c, l) => { const ctx = c; ctx.globalCompositeOperation = "destination-out"; for (let y = l - 12; y < l; y++) { ctx.globalAlpha = (y - (l - 12)) / 14; ctx.fillRect(0, y, l, 1); } ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over"; },
  PEDRA: (c, l, r) => { for (let i = 0; i < 6; i++) px(c, "#877560", 6 + Math.floor(r() * 52), l - 8 + Math.floor(r() * 6), 3, 2); },
  TERRA: (c, l, r) => { for (let i = 0; i < 7; i++) px(c, "#c9a227", 6 + Math.floor(r() * 52), l - 10 + Math.floor(r() * 8), 2, 2); },
  GELO: (c, l, r) => { for (let i = 0; i < 5; i++) { const x = 10 + Math.floor(r() * 44), y = 8 + Math.floor(r() * 14); px(c, "#e6faff", x, y - 2, 1, 5); px(c, "#e6faff", x - 2, y, 5, 1); } },
  VOADOR: (c, l, r) => { for (const lado of [-1, 1]) for (let k = 0; k < 6; k++) px(c, k < 3 ? "#f4f4ff" : "#c8ccd4", l / 2 + lado * (14 + k), 22 + k * 2, 3, 2); },
  SOMBRIO: (c, l) => { const g = c.createRadialGradient(l / 2, l / 2, l * 0.2, l / 2, l / 2, l * 0.6); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(10,6,20,.55)"); c.fillStyle = g; c.fillRect(0, 0, l, l); },
  FADA: (c, l, r) => { for (let i = 0; i < 7; i++) { const x = 6 + Math.floor(r() * 52), y = 6 + Math.floor(r() * 40); px(c, "#ffd6ea", x, y - 1, 1, 3); px(c, "#ffd6ea", x - 1, y, 3, 1); } },
  "AÇO": (c, l, r) => { for (let i = 0; i < 3; i++) { const y = 18 + i * 8 + Math.floor(r() * 4); px(c, "rgba(255,255,255,.7)", 18, y, 12, 1); } },
  "DRAGÃO": (c, l, r) => { for (let k = 0; k < 5; k++) px(c, "#7038f8", l / 2 - 2 + k, 8 + k * 3, 3, 3); },
  GLITCH: (c, l, r) => { for (let i = 0; i < 10; i++) { const y = Math.floor(r() * l), h = 1 + Math.floor(r() * 3); c.drawImage(c.canvas, 0, y, l, h, Math.floor(r() * 9) - 4, y, l, h); } },
};

/** Desenha a fusão: corpo recolorido, cabeça por cima, contorno e o detalhe do
 *  tipo. Devolve um canvas do tamanho do sprite do jogo. */
export function desenhar(cabecaId, corpoId) {
  const lado = DB.FUSAO?.editor?.tamanho || 64;
  const r = semente(`arte:${cabecaId}+${corpoId}`);
  const cab = Assets.mon(cabecaId, 7);
  const cor = Assets.mon(corpoId, 7);
  const { cv, ctx } = makeCanvas(lado, lado);
  ctx.imageSmoothingEnabled = false;

  // 1. o corpo, esticado de leve e pintado com a paleta da cabeça
  const esc = 0.95 + r() * 0.12;
  const alt = Math.round(lado * esc);
  ctx.drawImage(cor, 0, lado - alt, lado, alt);
  const tinta = corMedia(cab);
  if (tinta) {
    ctx.save();
    ctx.globalAlpha = 0.35 + r() * 0.3;
    ctx.globalCompositeOperation = "color";
    ctx.fillStyle = tinta;
    ctx.fillRect(0, 0, lado, lado);
    ctx.globalCompositeOperation = "destination-in";
    ctx.globalAlpha = 1;
    ctx.drawImage(cor, 0, lado - alt, lado, alt);
    ctx.restore();
  }

  // 2. a cabeça, num corte que muda de dupla pra dupla
  const corte = 0.4 + r() * 0.16;
  const alturaCab = Math.max(1, Math.round(cab.height * corte));
  const espelha = r() < 0.25;
  ctx.save();
  if (espelha) { ctx.translate(lado, 0); ctx.scale(-1, 1); }
  ctx.drawImage(cab, 0, 0, cab.width, alturaCab, 0, 0, lado, Math.round(lado * corte));
  ctx.restore();

  // 3. a costura e o contorno
  ctx.save();
  ctx.globalCompositeOperation = "source-atop";
  ctx.fillStyle = "rgba(0,0,0,.22)";
  ctx.fillRect(0, Math.round(lado * corte) - 1, lado, 1);
  ctx.restore();
  contornar(cv);

  // 4. o detalhe do tipo (o segundo tipo, se houver — é o que dá a cara)
  const sp = montarEspecie(cabecaId, corpoId);
  const tipo = sp?.types?.[1] || sp?.types?.[0];
  DETALHES[tipo]?.(ctx, lado, r);
  return cv;
}

/** Tudo junto: a dupla escolhida, a ficha inventada e o desenho pronto. */
export function criar(st) {
  const escolha = escolherDupla(st);
  if (!escolha) return null;
  const ficha = inventarFicha(escolha.cabeca, escolha.corpo);
  if (!ficha) return null;
  const cv = desenhar(escolha.cabeca, escolha.corpo);
  ficha.sprite = cv.toDataURL("image/png");
  return { ...escolha, ficha, canvas: cv };
}
