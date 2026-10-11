// A BANCADA DE DESENHO: a tela de pixel art do UNIQUEMON (uniquemon/) e do
// REGIOMAKER (regiomaker/). Lápis, borracha, balde, conta-gotas, pincel de 1 a
// 4, espelho, desfazer/refazer (CTRL+Z / CTRL+Y) e botão direito pintando com
// transparente. A tela pode ser retangular (a skin do jogador é 64x96).
//
//   const b = criarBancada({ tela, cor, pincel, espelho, ferramentas, aoMudar, pode });
//   b.tamanho(w, h)  b.carregar(img)  b.limpar()  b.original()  b.dataURL()
//   b.pegar()  b.trocarQuadro(imageData)   (os quadros da animação, no UNIQUEMON)
//
// `cor` (input color), `pincel` (range) e `espelho` (checkbox) são elementos da
// página; `ferramentas` são os botões com data-ferr="lapis|borracha|balde|conta";
// `pode()` diz se dá pra pintar agora (o UNIQUEMON só deixa com espécie escolhida).

export function criarBancada({ tela, cor, pincel, espelho, ferramentas = [], aoMudar = () => {}, aoPegarCor = () => {}, pode = () => true }) {
  const ctx = tela.getContext("2d", { willReadFrequently: true });
  ctx.imageSmoothingEnabled = false;
  let W = tela.width, H = tela.height, ferr = "lapis", original = null;
  const historico = [], futuro = [];

  for (const b of ferramentas) {
    b.onclick = () => { ferr = b.dataset.ferr; ferramentas.forEach((x) => x.classList.toggle("on", x === b)); };
  }
  const corRGBA = () => { const h = cor.value; return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16), 255]; };
  const guardar = () => { historico.push(ctx.getImageData(0, 0, W, H)); if (historico.length > 80) historico.shift(); futuro.length = 0; };

  function pintar(x, y, rgba) {
    const n = +(pincel?.value || 1), d = ctx.getImageData(0, 0, W, H);
    const ponto = (px, py) => {
      for (let dy = 0; dy < n; dy++) for (let dx = 0; dx < n; dx++) {
        const xx = px + dx - Math.floor((n - 1) / 2), yy = py + dy - Math.floor((n - 1) / 2);
        if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
        d.data.set(rgba, (yy * W + xx) * 4);
      }
    };
    ponto(x, y);
    if (espelho?.checked) ponto(W - 1 - x, y);
    ctx.putImageData(d, 0, 0);
  }
  function balde(x, y, rgba) {
    const d = ctx.getImageData(0, 0, W, H), a = d.data, i0 = (y * W + x) * 4;
    const alvo = [a[i0], a[i0 + 1], a[i0 + 2], a[i0 + 3]];
    if (alvo.every((v, k) => v === rgba[k])) return;
    const igual = (i) => alvo.every((v, k) => a[i + k] === v);
    const pilha = [[x, y]];
    while (pilha.length) {
      const [px, py] = pilha.pop();
      if (px < 0 || py < 0 || px >= W || py >= H) continue;
      const i = (py * W + px) * 4;
      if (!igual(i)) continue;
      a.set(rgba, i);
      pilha.push([px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1]);
    }
    ctx.putImageData(d, 0, 0);
  }
  const pos = (ev) => {
    const r = tela.getBoundingClientRect();
    return [Math.floor((ev.clientX - r.left) / r.width * W), Math.floor((ev.clientY - r.top) / r.height * H)];
  };
  let pintando = false, apagando = false;
  tela.addEventListener("contextmenu", (ev) => ev.preventDefault());
  tela.addEventListener("pointerdown", (ev) => {
    if (!pode()) return;
    const [x, y] = pos(ev);
    apagando = ev.button === 2 || ferr === "borracha";
    if (ferr === "conta") {
      const p = ctx.getImageData(x, y, 1, 1).data;
      if (p[3]) { cor.value = "#" + [p[0], p[1], p[2]].map((v) => v.toString(16).padStart(2, "0")).join(""); aoPegarCor(); }
      return;
    }
    guardar();
    if (ferr === "balde") { balde(x, y, apagando ? [0, 0, 0, 0] : corRGBA()); aoMudar(); return; }
    pintando = true;
    tela.setPointerCapture(ev.pointerId);
    pintar(x, y, apagando ? [0, 0, 0, 0] : corRGBA());
    aoMudar();
  });
  tela.addEventListener("pointermove", (ev) => {
    if (!pintando) return;
    const [x, y] = pos(ev);
    pintar(x, y, apagando ? [0, 0, 0, 0] : corRGBA());
    aoMudar();
  });
  tela.addEventListener("pointerup", () => { pintando = false; });

  const b = {
    ctx,
    get w() { return W; },
    get h() { return H; },
    /** muda o tamanho da tela (limpa: mudar o tamanho de um canvas apaga ele) */
    tamanho(w, h = w) {
      if (w === W && h === H) return;
      W = w; H = h;
      tela.width = w; tela.height = h;
      ctx.imageSmoothingEnabled = false;
      historico.length = 0; futuro.length = 0;
    },
    /** põe uma imagem no meio da tela e guarda ela como o ORIGINAL */
    carregar(img) {
      ctx.clearRect(0, 0, W, H);
      if (img) ctx.drawImage(img, Math.floor((W - img.width) / 2), Math.floor((H - img.height) / 2));
      original = ctx.getImageData(0, 0, W, H);
      historico.length = 0; futuro.length = 0;
      aoMudar();
    },
    original() { return original; },
    /** troca o desenho da tela por outro QUADRO da animação (ImageData do
     *  mesmo tamanho): o desfazer começa de novo, o original fica */
    trocarQuadro(dados) {
      if (dados) ctx.putImageData(dados, 0, 0); else ctx.clearRect(0, 0, W, H);
      historico.length = 0; futuro.length = 0;
      aoMudar();
    },
    pegar() { return ctx.getImageData(0, 0, W, H); },
    voltarAoOriginal() { if (original) { guardar(); ctx.putImageData(original, 0, 0); aoMudar(); } },
    limpar() { guardar(); ctx.clearRect(0, 0, W, H); aoMudar(); },
    desfazer() { if (!historico.length) return; futuro.push(ctx.getImageData(0, 0, W, H)); ctx.putImageData(historico.pop(), 0, 0); aoMudar(); },
    refazer() { if (!futuro.length) return; historico.push(ctx.getImageData(0, 0, W, H)); ctx.putImageData(futuro.pop(), 0, 0); aoMudar(); },
    dataURL() { return tela.toDataURL("image/png"); },
    /** quantos pixels mudaram desde o original */
    mudancas() {
      if (!original) return 0;
      const a = original.data, d = ctx.getImageData(0, 0, W, H).data;
      let n = 0;
      for (let i = 0; i < d.length; i += 4) if (d[i] !== a[i] || d[i + 1] !== a[i + 1] || d[i + 2] !== a[i + 2] || d[i + 3] !== a[i + 3]) n++;
      return n;
    },
  };
  document.addEventListener("keydown", (ev) => {
    if (!(ev.ctrlKey || ev.metaKey) || !tela.isConnected || tela.offsetParent === null) return;
    if (ev.key.toLowerCase() === "z") { ev.preventDefault(); b.desfazer(); }
    if (ev.key.toLowerCase() === "y") { ev.preventDefault(); b.refazer(); }
  });
  return b;
}
