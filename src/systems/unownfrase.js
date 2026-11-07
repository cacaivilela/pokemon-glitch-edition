// OS UNOWN DA FRASE: uma fila de UNOWN voando pelo céu de um mapa, nos dias de
// um evento, soletrando uma frase (src/data/eventos.js, `unown`).
//
// Os sprites são os oficiais de cada letra (assets/sprites/pokemon/unown/),
// cortados na beirada do bicho. A fila entra pela direita, atravessa a tela
// ondulando e, quando a última letra sai pela esquerda, começa de novo.
import { DB } from "../data/index.js";
import { url as arquivo } from "../core/base.js";
import { eventoAberto, hojeDoEvento } from "./raid.js";

const W = 240;
const VELOCIDADE = 34;   // pixels por segundo
const ESPACO = 2;        // entre uma letra e outra
const PALAVRA = 14;      // entre uma palavra e outra
const ALTURA = 6;        // onde a fila voa (o topo da tela)

// cada letra, cortada só no bicho (um canvas), ou null enquanto carrega
const letras = new Map();
function letra(l) {
  if (!letras.has(l)) {
    letras.set(l, null);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.width; c.height = img.height;
      const g = c.getContext("2d");
      g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height).data;
      let x0 = c.width, y0 = c.height, x1 = -1, y1 = -1;
      for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) {
        if (d[(y * c.width + x) * 4 + 3] < 10) continue;
        x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
      }
      if (x1 < 0) return;
      const cv = document.createElement("canvas");
      cv.width = x1 - x0 + 1; cv.height = y1 - y0 + 1;
      cv.getContext("2d").drawImage(c, -x0, -y0);
      letras.set(l, cv);
    };
    img.src = arquivo(`assets/sprites/pokemon/unown/${l}.png`);
  }
  return letras.get(l);
}

/** Tira acento e deixa só A-Z e espaço: o UNOWN não tem Á nem número. */
const limpar = (frase) => frase.toUpperCase().normalize("NFD").replace(/[^A-Z ]/g, "");

/** A frase deste mapa agora, se tiver evento com UNOWN aberto. */
function fraseDoMapa(mapa) {
  const hoje = hojeDoEvento();
  for (const ev of DB.EVENTOS || []) {
    if (ev.unown?.mapa === mapa && eventoAberto(ev, hoje)) return limpar(ev.unown.frase);
  }
  return null;
}

/** Desenha a fila (em coordenadas da tela, o céu não anda com o mapa). */
export function desenharUnownFrase(ctx, mapa) {
  const frase = fraseDoMapa(mapa);
  if (!frase) return;
  // a largura de cada pedaço; letra que ainda não carregou conta como 24
  const pedacos = [...frase].map((l) => {
    if (l === " ") return { larg: PALAVRA };
    const cv = letra(l.toLowerCase());
    return { cv, larg: (cv ? cv.width : 24) + ESPACO };
  });
  const total = pedacos.reduce((s, p) => s + p.larg, 0);
  const t = performance.now() / 1000;
  let x = W - ((t * VELOCIDADE) % (total + W));
  let i = 0;
  for (const p of pedacos) {
    if (p.cv && x + p.cv.width > 0 && x < W) {
      // cada um sobe e desce no seu tempo: parece um bando, não uma faixa
      const y = ALTURA + Math.round(Math.sin(t * 2.2 + i * 0.7) * 4);
      ctx.drawImage(p.cv, Math.round(x), y);
    }
    x += p.larg; i++;
  }
}
