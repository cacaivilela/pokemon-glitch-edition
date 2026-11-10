// A CAMADA DE CIMA: um <canvas> por cima da tela do jogo (#screen), no mesmo
// lugar e tamanho, mas com ESCALA vezes mais pontos. A tela do jogo tem só
// 240x160; a FOTO DE VERDADE (src/scenes/camerareal.js) e o ÁLBUM
// (src/scenes/fotos.js) desenham a foto da webcam aqui, nítida.
// Não pega clique (pointer-events: none): o mouse continua indo pro jogo.
export const ESCALA = 4;

export function criarCamada() {
  const tela = document.getElementById("screen");
  if (!tela?.parentElement) return null;
  const c = document.createElement("canvas");
  c.width = 240 * ESCALA; c.height = 160 * ESCALA;
  c.style.cssText = "position:absolute; pointer-events:none; z-index:5;";
  tela.parentElement.appendChild(c);
  return c;
}

/** encaixa a camada em cima da tela do jogo (a janela pode ter mudado de tamanho)
 *  e devolve o contexto já limpo, na escala do jogo (1 = 1 ponto do jogo) */
export function prepararCamada(c) {
  const tela = document.getElementById("screen");
  if (!c || !tela) return null;
  const pai = c.parentElement.getBoundingClientRect(), r = tela.getBoundingClientRect();
  const st = c.style;
  const l = `${r.left - pai.left}px`, t = `${r.top - pai.top}px`, w = `${r.width}px`, h = `${r.height}px`;
  if (st.left !== l) st.left = l;
  if (st.top !== t) st.top = t;
  if (st.width !== w) st.width = w;
  if (st.height !== h) st.height = h;
  if (st.display) st.display = "";
  const g = c.getContext("2d");
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, c.width, c.height);
  g.setTransform(ESCALA, 0, 0, ESCALA, 0, 0);
  g.imageSmoothingEnabled = false;
  return g;
}

export function esconderCamada(c) { if (c && c.style.display !== "none") c.style.display = "none"; }
