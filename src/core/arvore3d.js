// AS ÁRVORES 3D DE BRAGLITCH (pedido do CAIO, nov/2026: "modelo 3d que pareça
// muuuuito a pixelart").
//
// O modelo é o PRÓPRIO DESENHO DO FIRERED empilhado (src/core/fr-blocos.js):
// cada fileira de pixels do sprite vira uma FATIA REDONDA, com a largura e as
// cores daquela fileira, na altura dela. Olhando de frente (a árvore no meio da
// tela) a pilha é o desenho do FireRed, pixel por pixel; longe do meio, as
// fatias de cima escorregam pra fora — como uma árvore alta vista de cima, numa
// câmera de verdade —, e aparece o lado dela. Nada de suavizar: cada fatia é
// pixel, com as cores do sprite.
//
// Desenhar fatia por fatia todo quadro pesaria: a árvore pronta de cada
// inclinação (em degraus de 8 pixels de distância do meio da tela) fica guardada.
import { Assets } from "./assets.js";

const INCLINA = 0.0022;   // quanto a fatia anda pra fora por pixel de altura e de distância do meio
const PASSO = 8;          // degrau da distância (as inclinações guardadas)
const MARGEM = 32;        // folga em volta do sprite (pra fatia que escorrega, e as 18 camadas)
// AS CAMADAS (o CAIO: "8 camadas na normal e as de floresta de viridian/grandes
// 18"): quantas cópias empilhadas no meio da árvore, onde ela é mais larga; nas
// beiradas, menos. Quem escolhe é o overworld (`copias`, pelo lugar)
export const CAMADAS_NORMAL = 5, CAMADAS_GRANDE = 11;

// por tipo: a fileira do chão (a partir de baixo) e o quanto a fatia é funda
const JEITO = {};
const fatias = new Map();
const prontas = new Map();

/** as fatias do sprite: cada fileira opaca, com as cores dela */
function fatiasDe(tipo) {
  if (fatias.has(tipo)) return fatias.get(tipo);
  const spr = Assets.blocosFR()[tipo];
  const w = spr.width, h = spr.height;
  const d = spr.getContext("2d").getImageData(0, 0, w, h).data;
  const linhas = [];
  for (let r = 0; r < h; r++) {
    let x0 = -1, x1 = -1;
    for (let x = 0; x < w; x++) if (d[(r * w + x) * 4 + 3]) { if (x0 < 0) x0 = x; x1 = x; }
    if (x0 < 0) continue;
    const cores = [];
    for (let x = x0; x <= x1; x++) cores.push(d.slice((r * w + x) * 4, (r * w + x) * 4 + 4));
    linhas.push({ r, x0, x1, cores });
  }
  // o chão: a fileira do pé, um pouco acima da última (a sombra redonda fica no chão)
  const j = JEITO[tipo] || { chao: 4 };
  const raioMax = Math.max(1, ...linhas.map((l) => (l.x1 - l.x0 + 1) / 2));
  const f = { w, h, chao: h - j.chao, raioMax, linhas: linhas.reverse() };   // de baixo pra cima
  fatias.set(tipo, f);
  return f;
}

/** A árvore `tipo` ("arvore", "fininha", "moita") vista com o meio da tela a
 *  (dx, dy) pixels do pé dela. Devolve { img, ox, oy }: o desenho e onde ele
 *  fica em relação ao canto de cima do sprite original. */
/** `vento` (pedido do CAIO: "faz o vento mexer as camadas das árvores"):
 *  { forca, fase } — cada CAMADA anda pro lado separada: a de baixo quase não
 *  mexe, a do alto mexe muito (forca, em pixels no topo, com sinal = o lado do
 *  vento), e uma ONDA sobe pela copa (fase, 0 a 7). Arredondado pra caber no
 *  guarda-desenhos. */
export function arvore3d(tipo, dx, dy, vento = null, copias = CAMADAS_NORMAL) {
  const kx = Math.max(-20, Math.min(20, Math.round(dx / PASSO)));
  const ky = Math.max(-14, Math.min(14, Math.round(dy / PASSO)));
  const vf = vento ? Math.max(-6, Math.min(6, Math.round(vento.forca))) : 0;
  const vp = vento ? (((Math.round(vento.fase) % 8) + 8) % 8) : 0;
  const chave = `${tipo}:${kx}:${ky}:${vf}:${vp}:${copias}`;
  const pronta = prontas.get(chave);
  if (pronta) return pronta;
  const F = fatiasDe(tipo);
  const W = F.w + MARGEM * 2, H = F.h + MARGEM * 2;
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const c = cv.getContext("2d");
  const img = c.createImageData(W, H), o = img.data;
  const lx = -kx * PASSO * INCLINA, ly = -ky * PASSO * INCLINA;   // pra fora do meio da tela
  for (const { r, x0, x1, cores } of F.linhas) {
    const alt = Math.max(0, F.chao - r);
    const raio = (x1 - x0 + 1) / 2, meio = (x0 + x1) / 2;
    // AS FILEIRAS também (o CAIO: "mas as fileiras da pixelart tbm"): uma onda
    // suave subindo pela árvore — o pé quase parado, o alto indo mais
    const fr = F.chao > 0 ? alt / F.chao : 0;
    const onda = vento ? vf * 0.5 * fr * fr + Math.sin(vp / 8 * Math.PI * 2 - fr * 3) * 0.8 * fr : 0;
    const ox = Math.round(alt * lx + onda), oy = Math.round(alt * ly);
    for (let x = x0; x <= x1; x++) {
      const cor = cores[x - x0];
      if (!cor[3]) continue;      // buraco na fileira: fica vazio (senão vira pixel preto)
      // a fatia é um disco achatado: a coluna x vai de trás (em cima) pra frente
      // (a da floresta é em pedaços: topo, meio e pé são iguais entre si, com a
      // grossura inteira, senão um pedaço fica diferente do resto da árvore)
      const perfil = Math.sqrt(Math.max(0, 1 - ((x - meio) / (raio + 0.5)) ** 2)) * (tipo.startsWith("grande") ? 1 : raio / F.raioMax);
      const fundo = Math.max(0, Math.round(copias * perfil) - 1);
      for (let k = -fundo; k <= 0; k++) {
        // O VENTO NAS CÓPIAS EMPILHADAS (o CAIO: "as pixelarts de árvores
        // empilhadas mexessem separadamente"): a da frente (k = 0) fica inteira,
        // parada; cada cópia de trás vai pro lado do vento e balança no tempo
        // dela — quanto mais pra trás, mais ela vai
        const prof = Math.min(1, -k / 8);   // a mesma pra cópia inteira (não depende da coluna)
        const vai = vento && k < 0 ? Math.round(vf * prof + Math.sin(vp / 8 * Math.PI * 2 + k * 1.3) * (0.6 + Math.abs(vf) * 0.35) * prof) : 0;
        const X = x + MARGEM + ox + vai;
        if (X < 0 || X >= W) continue;
        const Y = r + MARGEM + oy + k;
        if (Y < 0 || Y >= H) continue;
        const i = (Y * W + X) * 4;
        o[i] = cor[0]; o[i + 1] = cor[1]; o[i + 2] = cor[2]; o[i + 3] = 255;
      }
    }
  }
  c.putImageData(img, 0, 0);
  const out = { img: cv, ox: -MARGEM, oy: -MARGEM };
  if (prontas.size > 6000) prontas.clear();
  prontas.set(chave, out);
  return out;
}
