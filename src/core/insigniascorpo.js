// AS INSÍGNIAS NO CORPO (pedido do CAIO, nov/2026): "essa imagem da junção das
// insígnias fica no peito dos desafiantes da liga de braglitch" / "cada
// insígnia bota um pedaço da imagem" / "as insígnias do void ficam na perna" /
// "vão ser modelos 3d no peito/perna".
//
// O SÍMBOLO DA LIGA DE BRAGLITCH é o desenho dele (assets/sprites/insignias/
// simbolo_liga_brag.png, 96x96), em 3x3 pedaços: as 8 insígnias de Braglitch
// em volta (no sentido do relógio a partir de cima-esquerda) e o MEIO, que
// aparece com as 8. No peito ele vira uma PLAQUINHA 3D de 9x9 pixels, com
// espessura dourada: de frente, de frente; de lado, gira e mostra a borda;
// de costas não aparece. Um brilho passa por ela de vez em quando.
// As do VOID (a do SACI.EXE e a do CAMPEÃO DO VOID) são MOEDINHAS 3D na perna.
import { url } from "./base.js";

export const ORDEM_KANTO = ["pedra", "cascata", "trovao", "arcoiris", "alma", "pantano", "vulcao", "terra"];
export const ORDEM = ["samauma", "mangue", "berimbau", "fogueira", "tomada", "lampiao", "pandeiro", "cupula"];
export const LUGARES = [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2], [0, 1]];
const LADO = 6;                    // o símbolo no peito: 6x6 (cada pedaço 2x2)

const imgs = {};
function img(nome) {
  if (nome in imgs) return imgs[nome];
  imgs[nome] = null;
  if (typeof Image === "undefined") return null;
  const im = new Image();
  im.onload = () => { imgs[nome] = im; };
  im.src = url(`assets/sprites/insignias/${nome}.png`);
  return null;
}

/** o desenho de uma insígnia ("simbolo" = o símbolo da liga), ou null enquanto carrega */
export const imagemInsignia = (id) => img(id === "simbolo" ? "simbolo_liga_brag" : id === "simbolokanto" ? "simbolo_liga_kanto" : `insignia_${id}`);

/** O ENCAIXE com o formato da insígnia: o buraco (`fundo`) e a beirinha clara
 *  (`luz`), do tamanho `L` — sai do contorno do próprio desenho dela */
const silhuetas = new Map();
export function silhueta(id, L) {
  const k = id + ":" + L;
  if (silhuetas.has(k)) return silhuetas.get(k);
  const m = imagemInsignia(id);
  if (!m) return null;
  const pinta = (cor) => {
    const c = document.createElement("canvas"); c.width = c.height = L;
    const g = c.getContext("2d"); g.imageSmoothingEnabled = false;
    g.drawImage(m, 0, 0, L, L);
    g.globalCompositeOperation = "source-in"; g.fillStyle = cor; g.fillRect(0, 0, L, L);
    return c;
  };
  const r = { fundo: pinta("#050201"), luz: pinta("#6a3a1c") };
  silhuetas.set(k, r);
  return r;
}

/** AS COSTAS da insígnia: QUADRADAS (o CAIO: "as insígnias vão ser quadradas
 *  atrás"), com o pedaço do SÍMBOLO DA LIGA dela inteiro — é virada assim que
 *  entra na formação, e as costas de todas juntas fazem o símbolo */
const costasCache = new Map();
export function costasDaInsignia(id, L) {
  const k = id + ":" + L;
  if (costasCache.has(k)) return costasCache.get(k);
  // as de KANTO formam o SÍMBOLO DE KANTO (o desenho do CAIO); as de Braglitch, o da Liga de lá
  const kanto = ORDEM_KANTO.includes(id) || id === "meiokanto";
  const s = imagemInsignia(kanto ? "simbolokanto" : "simbolo"), i = (kanto ? ORDEM_KANTO : ORDEM).indexOf(id);
  if (!s || (i < 0 && id !== "meio" && id !== "meiokanto")) return null;
  const [x, y] = id === "meio" || id === "meiokanto" ? [1, 1] : LUGARES[i];
  const c = document.createElement("canvas"); c.width = c.height = L;
  const g = c.getContext("2d"); g.imageSmoothingEnabled = false;
  g.drawImage(s, x * 32, y * 32, 32, 32, 0, 0, L, L);
  costasCache.set(k, c);
  return c;
}

/** os pedaços (0-8, 4 = o meio) que quem tem essas insígnias leva no peito */
export function pecasDe(bragBadges, comMeio = false) {
  const tem = new Set(bragBadges || []);
  const p = new Set();
  ORDEM.forEach((id, i) => { if (tem.has(id)) { const [x, y] = LUGARES[i]; p.add(y * 3 + x); } });
  // o MEIO vem com o INICIAL (o CAIO: "ao pegar seu inicial vc ganha")
  if (comMeio) p.add(4);
  return p;
}
/** tem o MEIO? (o inicial: ou a marca de quem escolheu, ou já ter algum Pokémon na equipe) */
// (só quem é de BRAGLITCH — ou já pegou insígnia de lá: no save de KANTO o inicial
// não traz pedaço nenhum do símbolo da Liga de Braglitch)
export const temMeio = (st) => (st?.regiao === "braglitch" || (st?.bragBadges || []).length > 0)
  && (!!st?.flags?.starterChosen || (st?.party || []).some(Boolean));
export const TUDO = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8]);
/** um desafiante no meio do caminho: uns pedaços, sempre os mesmos pra ele (pelo id) */
export function pecasDoTreinador(id) {
  let h = 0; for (const c of String(id)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const n = 1 + (h % 7), ordem = [0, 1, 2, 3, 4, 5, 6, 7];
  for (let i = 7; i > 0; i--) { h = (h * 1103515245 + 12345) >>> 0; const k = h % (i + 1); [ordem[i], ordem[k]] = [ordem[k], ordem[i]]; }
  return new Set(ordem.slice(0, n).map((i) => LUGARES[i][1] * 3 + LUGARES[i][0]));
}

const cache = new Map();
/** o símbolo 9x9 só com esses pedaços */
function emblema(pecas) {
  const s = img("simbolo_liga_brag");
  if (!s) return null;
  const k = [...pecas].sort().join(",");
  if (cache.has(k)) return cache.get(k);
  const c = document.createElement("canvas"); c.width = c.height = LADO;
  const g = c.getContext("2d"); g.imageSmoothingEnabled = false;
  for (const p of pecas) {
    const x = p % 3, y = Math.floor(p / 3);
    g.drawImage(s, x * 32, y * 32, 32, 32, x * 2, y * 2, 2, 2);
  }
  cache.set(k, c);
  return c;
}

/** a PLAQUINHA 3D: a cara (o desenho) apertada pelo giro, e a ESPESSURA dourada do lado */
// (a tela é 3x: um "pixel" da plaquinha é 1/3 do pixel do jogo — assim ela fica
// do tamanho de um broche no peito, e não do corpo inteiro)
const P = 1 / 3;   // (cada pixel da plaquinha = 1 pixel da tela: 3 pixels do jogo, um broche)
function plaquinha(ctx, face, cx, cy, ang, borda = "#a86a10", brilho = true, base = true) {
  const w = face.width, h = face.height;
  const lw = Math.max(1, Math.round(w * Math.abs(Math.cos(ang))));
  const esp = Math.round(2 * Math.abs(Math.sin(ang)));               // a espessura aparece de lado
  const x0 = Math.round((cx - lw * P / 2) * 3) / 3, y0 = Math.round((cy - h * P / 2) * 3) / 3;
  // o CONTORNO escuro em volta (1 pixel da tela), pra a plaquinha se destacar da roupa
  if (base) { ctx.fillStyle = "#140c04"; ctx.fillRect(x0 - 1 / 3, y0 - 1 / 3, lw * P + 2 / 3, h * P + 2 / 3); }
  if (esp && base) { ctx.fillStyle = borda; ctx.fillRect(ang > 0 ? x0 - esp * P : x0 + lw * P, y0, esp * P, h * P); }
  ctx.drawImage(face, 0, 0, w, h, x0, y0, lw * P, h * P);
  // o BRILHO: uma diagonal clarinha passando de tempos em tempos
  if (brilho) {
    const t = (performance.now() / 90) % 60;
    if (t < lw + h) {
      ctx.fillStyle = "rgba(255,255,230,0.75)";
      for (let j = 0; j < h; j++) { const xx = Math.round(t - j); if (xx >= 0 && xx < lw) ctx.fillRect(x0 + xx * P, y0 + j * P, P, P); }
    }
  }
}

const GIRO = { down: 0, left: -1.15, right: 1.15 };

/** desenha o símbolo no PEITO e as do VOID na PERNA de um boneco.
 *  `quadro`: o desenho do boneco; (dx, dy) onde ele foi desenhado; `topo`: a
 *  primeira fileira com pixel; `dir`: pra onde ele olha. */
export function insigniasNoCorpo(ctx, quadro, dx, dy, topo, dir, { pecas = null, vazio = [] } = {}) {
  if (dir !== "down" || topo < 0) return;                // só DE FRENTE (pedido do CAIO): de lado e de costas não aparece
  const ang = GIRO[dir] ?? 0;
  const meio = dx + quadro.width / 2 + (dir === "left" ? -1 : dir === "right" ? 1 : 0);
  if (pecas && pecas.size) {
    const e = emblema(pecas);
    if (e) plaquinha(ctx, e, meio + 3, dy + topo + 14, ang, "#a86a10");   // (3 pra direita e 1 pra baixo: o CAIO ajustou)
  }
  // as do VOID: moedinhas na perna (a da esquerda e a da direita)
  vazio.forEach((nome, i) => {
    const m = img(`insignia_${nome}`);
    if (!m) return;
    if (!cache.has("m:" + nome)) {
      const c = document.createElement("canvas"); c.width = c.height = 6;
      const g = c.getContext("2d"); g.imageSmoothingEnabled = false; g.drawImage(m, 0, 0, 6, 6);
      cache.set("m:" + nome, c);
    }
    const lado = dir === "down" ? (i ? 2 : -2) : (i ? 1 : -1);
    plaquinha(ctx, cache.get("m:" + nome), meio + lado, dy + topo + 19, ang, "#30303a", false, false);   // (na perna: só o desenho, sem base nenhuma)
  });
}

/** O ESTOJO DO SALVAR (pedido do CAIO: "faz ao salvar mostrar suas insígnias" /
 *  "tipo a formação delas"): KANTO em 2 fileiras de 4; BRAGLITCH NA FORMAÇÃO
 *  (a grade 3x3 do símbolo: as 8 em volta e o MEIO com as 8), e do lado o
 *  SÍMBOLO montado com os pedaços que você tem; o VOID na direita. A que você
 *  tem aparece com o desenho (ou uma bolinha dourada, se não foi desenhada). */
export function desenharEstojo(ctx, st, DB, x, y, drawText) {
  const L = 12, G = 2, A = L + G;
  const H = 3 * A + 18, Wt = 4 * A + 6 + 3 * L + 8 + L + 40;
  // a caixa: madeira escura com a borda dourada
  ctx.fillStyle = "#3a1408"; ctx.fillRect(x, y, Wt, H);
  ctx.fillStyle = "#c89a3a"; ctx.fillRect(x, y, Wt, 1); ctx.fillRect(x, y + H - 1, Wt, 1); ctx.fillRect(x, y, 1, H); ctx.fillRect(x + Wt - 1, y, 1, H);
  const buraco = (xx, yy, id, tem) => {
    const sil = silhueta(id, L);
    if (sil) { ctx.drawImage(sil.luz, xx, yy + 1, L, L); ctx.drawImage(sil.fundo, xx, yy, L, L); }
    else { ctx.fillStyle = "#1a0804"; ctx.fillRect(xx, yy, L, L); }
    if (!tem) return;
    const im = img(`insignia_${id}`);
    if (im) { ctx.imageSmoothingEnabled = false; ctx.drawImage(im, xx, yy, L, L); }
    else { ctx.fillStyle = "#e8a820"; ctx.fillRect(xx + 3, yy + 3, L - 6, L - 6); ctx.fillStyle = "#fff6c0"; ctx.fillRect(xx + 4, yy + 4, 2, 2); }
  };
  const titulo = (t, xx) => drawText(ctx, t, xx, y + 3, "#ffd860");
  // KANTO: também na FORMAÇÃO 3x3 (viradas, formando o SÍMBOLO DE KANTO; o meio vem com o inicial)
  let x0 = x + 5;
  titulo("KANTO", x0);
  const temK = new Set(st.badges || []);
  const pecaK = (id, cx, cy, temEsse) => {
    const xx = x0 + cx * L, yy = y + 14 + cy * L;
    ctx.fillStyle = "#0a0402"; ctx.fillRect(xx, yy, L, L);
    const sil = id !== "meiokanto" && silhueta(id, L);
    if (sil) { ctx.drawImage(sil.luz, xx, yy + 1, L, L); ctx.drawImage(sil.fundo, xx, yy, L, L); }
    const c = temEsse && costasDaInsignia(id, 32);
    if (c) ctx.drawImage(c, xx, yy, L, L);
    else if (temEsse) { const im = img(`insignia_${id}`); if (im) ctx.drawImage(im, xx, yy, L, L); }   // (sem o símbolo desenhado ainda: a frente)
  };
  ORDEM_KANTO.forEach((id, i) => { const [cx, cy] = LUGARES[i]; pecaK(id, cx, cy, temK.has(id)); });
  pecaK("meiokanto", 1, 1, !!st?.flags?.starterChosen || (st?.party || []).some(Boolean));   // (o de KANTO vem com qualquer inicial)
  x0 += 3 * L - 4 * A;      // (a formação 3x3 é mais estreita que as 2 fileiras de 4)
  // BRAGLITCH: a formação 3x3, com as insígnias VIRADAS (as costas quadradas
  // juntas formam o SÍMBOLO DA LIGA); o meio vem com o inicial
  x0 += 4 * A + 6;
  titulo("BRAGLITCH", x0);
  const tem = new Set(st.bragBadges || []);
  const pedaco = (id, cx, cy, temEsse) => {
    const xx = x0 + cx * L, yy = y + 14 + cy * L;
    const sil = id !== "meio" && silhueta(id, L);
    ctx.fillStyle = "#0a0402"; ctx.fillRect(xx, yy, L, L);
    if (sil) { ctx.drawImage(sil.luz, xx, yy + 1, L, L); ctx.drawImage(sil.fundo, xx, yy, L, L); }
    const c = temEsse && costasDaInsignia(id, 32);
    if (c) ctx.drawImage(c, xx, yy, L, L);
  };
  ORDEM.forEach((id, i) => { const [cx, cy] = LUGARES[i]; pedaco(id, cx, cy, tem.has(id)); });
  pedaco("meio", 1, 1, temMeio(st));
  const sx = x0 + 3 * L - 2;
  // VOID
  x0 = sx + 10;
  titulo("VOID", x0);
  buraco(x0, y + 14, "void", !!st.flags?.insignia_void);
  buraco(x0, y + 14 + A, "campeaovoid", !!st.flags?.campeaoVoid);
}
