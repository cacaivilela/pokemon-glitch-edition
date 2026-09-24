// ENCOLHER PIXEL ART SEM PERDER O OLHO.
//
// Desenhar um sprite de 64x64 em 24x24 com `imageSmoothingEnabled = false` faz
// o navegador pegar UM pixel de origem pra cada pixel novo e jogar os outros
// fora. Com a escala quebrada (64 -> 46, 64 -> 26), quem é jogado fora muda de
// linha pra linha — e é assim que uma pupila de dois pixels some, um olho vira
// um "+" e a boca muda de lado: o bicho fica com outra EXPRESSÃO.
//
// Aqui cada pixel novo olha o PEDAÇO inteiro da imagem que ele cobre (com as
// frações de pixel nas bordas) e fica com a cor que ocupa MAIS ÁREA nesse
// pedaço. Um detalhe encolhe na mesma proporção do resto, em vez de sumir ou
// não sumir por sorte. No empate (até 10% de diferença) ganha a cor mais
// escura, que é quase sempre o detalhe: pupila, boca, contorno.
//
// Ainda assim, encolher é perder: o que é GRANDE na tela (batalha, título,
// troca) é desenhado no tamanho de verdade, 64x64. Isto aqui é pros ícones.
//
// O resultado fica guardado por imagem e por tamanho — é uma conta por sprite,
// não por quadro.

const guardados = new WeakMap();

const brilho = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;

/** O sprite `img` encolhido pra `w` x `h`, ou o próprio `img` quando não é
 *  encolhimento (ou quando a imagem ainda não carregou). */
export function reduzido(img, w, h = w) {
  w = Math.round(w); h = Math.round(h);
  const iw = img?.width | 0, ih = img?.height | 0;
  if (!iw || !ih || (w >= iw && h >= ih) || w < 1 || h < 1) return img;
  let porTamanho = guardados.get(img);
  if (!porTamanho) guardados.set(img, (porTamanho = new Map()));
  const chave = `${w}x${h}`;
  const pronto = porTamanho.get(chave);
  if (pronto) return pronto;

  let dados;
  try {
    const fonte = document.createElement("canvas");
    fonte.width = iw; fonte.height = ih;
    const fc = fonte.getContext("2d");
    fc.drawImage(img, 0, 0);
    dados = fc.getImageData(0, 0, iw, ih).data;
  } catch {
    return img;                     // canvas sem leitura de pixel: fica como era
  }
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  const ctx = cv.getContext("2d");
  const saida = ctx.createImageData(w, h);
  const o = saida.data;
  const sx = iw / w, sy = ih / h;
  const peso = new Map();

  for (let Y = 0; Y < h; Y++) {
    const fy0 = Y * sy, fy1 = (Y + 1) * sy;
    for (let X = 0; X < w; X++) {
      const fx0 = X * sx, fx1 = (X + 1) * sx;
      peso.clear();
      let maior = 0;
      for (let y = Math.floor(fy0); y < Math.min(ih, Math.ceil(fy1)); y++) {
        const wy = Math.min(fy1, y + 1) - Math.max(fy0, y);
        if (wy <= 0) continue;
        for (let x = Math.floor(fx0); x < Math.min(iw, Math.ceil(fx1)); x++) {
          const wx = Math.min(fx1, x + 1) - Math.max(fx0, x);
          if (wx <= 0) continue;
          const i = (y * iw + x) * 4;
          // transparente é uma "cor" só; o resto, pelo RGB
          const k = dados[i + 3] < 128 ? -1 : (dados[i] << 16) | (dados[i + 1] << 8) | dados[i + 2];
          const v = (peso.get(k) || 0) + wx * wy;
          peso.set(k, v);
          if (v > maior) maior = v;
        }
      }
      // as candidatas: quem chegou perto da maior área
      let escolhida = null, escura = Infinity, soTransparente = true;
      for (const [k, v] of peso) {
        if (v < maior * 0.9) continue;
        if (k === -1) continue;
        soTransparente = false;
        const b = brilho(k >> 16, (k >> 8) & 255, k & 255);
        if (b < escura) { escura = b; escolhida = k; }
      }
      if (soTransparente || escolhida === null) continue;
      const j = (Y * w + X) * 4;
      o[j] = escolhida >> 16; o[j + 1] = (escolhida >> 8) & 255; o[j + 2] = escolhida & 255; o[j + 3] = 255;
    }
  }
  ctx.putImageData(saida, 0, 0);
  porTamanho.set(chave, cv);
  return cv;
}
