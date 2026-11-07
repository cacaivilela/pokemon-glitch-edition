// O TORNADO ROUBA PIXELS (pedido do CAIO, nov/2026: "faz o tornado poder roubar
// pixels do mapa que ao sumir caem e os pkmns ajeitam" — "cada pixel pode ser
// roubado" — "pixels de prédios, lojas e centros pkmns saem com 7x mais
// dificuldade" — "de lá vão sair muuuuuitos machokes pra arrumar, tipo uns 100
// á 9999").
//
// Como funciona:
//  1. perto do pé do tornado, ele arranca PIXEL POR PIXEL do que está na tela
//     (o pixel sobe girando pro funil, e no lugar dele fica um BURACO preto);
//     pixel de PRÉDIO (as paredes em volta de uma porta) sai 7x mais difícil;
//  2. o tornado vai embora: os pixels CAEM do céu — quase no lugar, mas tortos
//     (um ou dois pixels pro lado);
//  3. dos prédios do mapa (pelas portas) saem os MACHOKES, de 100 a 9.999, e
//     cada um vai até um cantinho torto e põe os pixels de volta no lugar.
// Cada mapa guarda os seus (`ow.roubos[mapa]`): o tornado te levou pras nuvens?
// Quando você voltar, os pixels ainda estão lá em cima, e caem — e os Machokes vêm.
// Quem chama é o overworld: `roubarPixels` no desenho do tornado, `andarRoubo`
// todo quadro, `desenharRouboChao` (com o chão) e `desenharRouboAr` (por cima).

const TILE = 16, W = 240, H = 160;
const MAX_PIXELS = 12000;
const CELULA = 6;                  // o cantinho que um Machoke arruma de uma vez
const EMPURRA = 1.1;               // quanto tempo ele leva empurrando os pixels pro lugar

// O MACHOKE DO MYSTERY DUNGEON (pedido do CAIO): os sprites do PMD (PMDCollab
// SpriteCollab, assets/sprites/pmd/machoke/) — andar, parado e soco, nas 8
// direções. Desenhado 1:1, ele tem uns 27 px: o TAMANHO REAL (1,5 m a 16 px por
// metro, a mesma conta do WAILORD de 232). Linhas: baixo, baixo-direita,
// direita, cima-direita, cima, cima-esquerda, esquerda, baixo-esquerda.
const PMD = {
  anda:  { arq: "Walk-Anim.png",  w: 32, h: 48, dur: [8, 10, 8, 10] },
  parado: { arq: "Idle-Anim.png", w: 32, h: 48, dur: [40, 4, 4, 4] },
  soco:  { arq: "Punch-Anim.png", w: 64, h: 80, dur: [2, 6, 2, 2, 2, 2, 2, 2, 4] },
  // os outros ATAQUES (pedido do CAIO: "baixe mais animações de ataque"): cada
  // empurrão em você sai com um deles, sorteado
  ataque: { arq: "Attack-Anim.png", w: 72, h: 80, dur: [4, 2, 2, 2, 2, 2, 2, 3, 1, 1, 2, 2, 2, 2] },
  chute:  { arq: "Kick-Anim.png",   w: 72, h: 80, dur: [2, 2, 2, 2, 6, 2, 2, 2, 2, 2, 4, 2] },
  golpe:  { arq: "Swing-Anim.png",  w: 72, h: 88, dur: [2, 1, 2, 2, 3, 2, 2, 1, 1] },
  dupla:  { arq: "Double-Anim.png", w: 56, h: 72, dur: [2, 2, 2, 2, 2, 2, 3, 3, 3, 2, 3, 2, 2, 2, 2, 2] },
};
const ATAQUES = ["soco", "ataque", "chute", "golpe", "dupla"];
const PE_PMD = 7;                  // o pé fica 7 px abaixo do meio do quadro
const imgsPMD = {};
function folhaPMD(nome) {
  if (!imgsPMD[nome]) { const im = new Image(); im.src = `assets/sprites/pmd/machoke/${PMD[nome].arq}`; imgsPMD[nome] = im; }
  const im = imgsPMD[nome];
  return im.complete && im.naturalWidth ? im : null;
}
/** a linha da folha pra direção (vx, vy) */
export function linhaPMD(vx, vy) {
  if (!vx && !vy) return 0;
  const a = Math.atan2(vy, vx);                          // 0 = direita, PI/2 = baixo
  const oito = Math.round(a / (Math.PI / 4));            // -4..4
  return { 2: 0, 1: 1, 0: 2, "-1": 3, "-2": 4, "-3": 5, 4: 6, "-4": 6, 3: 7 }[oito] ?? 0;
}
/** o quadro da animação no tempo `t` (em segundos) */
function quadroPMD(nome, t, roda = true) {
  const d = PMD[nome].dur, total = d.reduce((a, b) => a + b, 0);
  let k = Math.floor(t * 60);
  k = roda ? k % total : Math.min(total - 1, k);
  for (let i = 0; i < d.length; i++) { if (k < d[i]) return i; k -= d[i]; }
  return d.length - 1;
}
// A HITBOX: o corpo dele (14 de largura, do pé até 26 px pra cima), e você
// conta com uns 5 px pra cada lado
const HIT = { lado: 7 + 5, cima: 26, baixo: 4 };

/** os tiles de PRÉDIO do mapa: as paredes ligadas a uma porta (warp com parede em cima) */
function prediosDoMapa(ow) {
  const id = ow.st.player.map;
  if (ow._prediosRoubo?.id === id) return ow._prediosRoubo;
  const set = new Set(), portas = [];
  const g = ow.geo, BLOCK = 1;
  if (g && !ow.map?.interior) {
    for (const w of g.warps || []) {
      if (ow.tagAt(w.x, w.y - 1) !== BLOCK) continue;
      portas.push({ x: w.x * TILE + 8, y: w.y * TILE + 12 });
      // as paredes ligadas à de cima da porta, perto dela (pra não pegar a mata toda)
      const pilha = [[w.x, w.y - 1]];
      while (pilha.length) {
        const [x, y] = pilha.pop(), k = `${x},${y}`;
        if (set.has(k) || Math.abs(x - w.x) > 5 || y > w.y || y < w.y - 7 || ow.tagAt(x, y) !== BLOCK) continue;
        set.add(k);
        pilha.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
      }
    }
  }
  return (ow._prediosRoubo = { id, set, portas });
}

function estado(ow) {
  const mapa = ow.st.player.map;
  ow.roubos ||= {};
  return (ow.roubos[mapa] ||= { mapa, px: [], buraco: new Set(), sobra: 0, semTornado: 0, machokes: [], faltam: 0, vieram: 0, roubados: 0 });
}

/** chamado pelo desenho do tornado: arranca pixels em volta do pé dele.
 *  `X`, `base`: o pé do tornado na tela; `sc`: o tamanho (1 = 290 px) */
export function roubarPixels(ow, ctx, X, base, sc, dt) {
  const R = estado(ow);
  if (R.px.length >= MAX_PIXELS) return;
  const rx = Math.min(W, Math.max(6, 14 * sc)), ry = Math.max(3, Math.min(H, 4 * sc));
  const x0 = Math.max(0, Math.floor(X - rx)), x1 = Math.min(W, Math.ceil(X + rx));
  const y0 = Math.max(0, Math.floor(base - ry)), y1 = Math.min(H, Math.ceil(base + ry));
  if (x1 - x0 < 1 || y1 - y0 < 1) return;
  // quantos por segundo: o maior arranca mais (até 600 por segundo)
  R.sobra += Math.min(600, 40 * Math.sqrt(sc)) * dt;
  let n = Math.floor(R.sobra);
  if (!n) return;
  R.sobra -= n;
  let img;
  try { img = ctx.getImageData(x0, y0, x1 - x0, y1 - y0); } catch { return; }
  const cx = Math.round(ow.cam?.x || 0), cy = Math.round(ow.cam?.y || 0);
  const P = prediosDoMapa(ow);
  for (let tent = 0; n > 0 && tent < n * 4; tent++) {
    const sx = x0 + Math.floor(Math.random() * (x1 - x0)), sy = y0 + Math.floor(Math.random() * (y1 - y0));
    const gx = cx + sx, gy = cy + sy, k = gx * 65536 + gy;
    if (R.buraco.has(k)) continue;
    // PRÉDIO, LOJA, CENTRO: 7x mais difícil de arrancar
    const predio = P.set.has(`${Math.floor(gx / TILE)},${Math.floor(gy / TILE)}`);
    if (predio && Math.random() > 1 / 7) { n--; continue; }
    const o = ((sy - y0) * (x1 - x0) + (sx - x0)) * 4, d = img.data;
    if (d[o + 3] < 20) continue;
    R.buraco.add(k);
    R.px.push({ gx, gy, c: `rgb(${d[o]},${d[o + 1]},${d[o + 2]})`, fase: "sobe", t: 0, sx, sy, a: Math.random() * 6.28 });
    R.roubados++;
    n--;
  }
}

/** todo quadro: os pixels subindo, caindo, e os MACHOKES trabalhando.
 *  `ativo`: o tornado está aqui agora (`tor`: o pé dele na tela) */
export function andarRoubo(ow, dt, ativo) {
  const R = ow.roubos?.[ow.st.player.map];
  if (!R) return;
  if (!R.px.length && !R.machokes.length) { delete ow.roubos[ow.st.player.map]; return; }
  R.semTornado = ativo ? 0 : R.semTornado + dt;
  let caindoAgora = 0;
  for (const p of R.px) {
    p.t += dt;
    if (p.fase === "sobe" && p.t > 1.4) { p.fase = "ceu"; p.t = 0; }
    else if (p.fase === "ceu" && R.semTornado > 1.5 && caindoAgora < 400 * dt + 1) {
      // CAI fora do lugar (uns pixels pro lado): os MACHOKES empurram de volta
      p.fase = "cai"; p.t = 0; p.dur = 0.5 + Math.random() * 0.7; caindoAgora++;
      p.lx = p.gx + Math.round((Math.random() - 0.5) * 20); p.ly = p.gy + Math.round((Math.random() - 0.5) * 8);
    } else if (p.fase === "cai" && p.t >= p.dur) { p.fase = "torto"; p.t = 0; }
    else if (p.fase === "ajeita" && p.t >= EMPURRA) p.fase = "ok";
  }
  // os que voltaram pro lugar saem da lista (e o buraco fecha)
  if (R.px.some((p) => p.fase === "ok")) {
    R.px = R.px.filter((p) => { if (p.fase !== "ok") return true; R.buraco.delete(p.gx * 65536 + p.gy); return false; });
  }
  // OS MACHOKES: quando começa a cair, decide quantos vêm (de 100 a 9.999 —
  // mais pixel roubado, mais Machoke) e eles vão saindo das portas
  const tortos = R.px.filter((p) => p.fase === "torto");
  if (tortos.length && !R.faltam && !R.vieram) R.faltam = Math.max(100, Math.min(9999, Math.round(R.roubados / 3)));
  if (R.faltam > 0) {
    const P = prediosDoMapa(ow), cx = ow.cam?.x || 0, cy = ow.cam?.y || 0;
    const sai = Math.min(R.faltam, Math.ceil(dt * 90));
    for (let i = 0; i < sai; i++) {
      // de uma porta (de um prédio); sem prédio no mapa, da beirada da tela
      const porta = P.portas.length ? P.portas[Math.floor(Math.random() * P.portas.length)]
        : { x: cx + (Math.random() < 0.5 ? -12 : W + 12), y: cy + 20 + Math.random() * (H - 40) };
      R.machokes.push({ x: porta.x + (Math.random() - 0.5) * 6, y: porta.y, casa: porta, alvo: null, estado: "vai", t: 0, vel: 45 + Math.random() * 30 });
    }
    R.faltam -= sai; R.vieram += sai;
  }
  // cada um pega um cantinho torto, vai até lá e põe os pixels no lugar
  let livres = null;
  for (const m of R.machokes) {
    m.t += dt;
    if (m.estado === "vai" && !m.alvo) {
      livres ||= tortos.filter((p) => !p.dono);
      const p = livres.length ? livres[Math.floor(Math.random() * livres.length)] : null;
      if (p) {
        // o montinho dele, e pra onde ele tem que EMPURRAR (do caído pro lugar certo)
        let sx = 0, sy = 0, dx = 0, dy = 0, n = 0;
        for (const q of livres) if (!q.dono && Math.abs(q.lx - p.lx) <= CELULA && Math.abs(q.ly - p.ly) <= CELULA) {
          q.dono = m; sx += q.lx; sy += q.ly; dx += q.gx - q.lx; dy += q.gy - q.ly; n++;
        }
        sx /= n; sy /= n; dx /= n; dy /= n;
        const d = Math.hypot(dx, dy) || 1;
        // ele fica ATRÁS do montinho (do lado contrário de onde vai empurrar)
        m.alvo = { x: sx - dx / d * 9, y: sy - dy / d * 5 + 4 };
        m.empurrao = { dx, dy };
        livres = null;
      } else if (!R.px.some((q) => q.fase === "ceu" || q.fase === "cai" || q.fase === "sobe")) m.estado = "volta";
    }
    const alvo = m.estado === "volta" ? m.casa : m.alvo;
    if (!alvo) continue;
    const dx = alvo.x - m.x, dy = alvo.y - (m.y - 4), d = Math.hypot(dx, dy);
    m.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up");
    if (d > 2) { const s = Math.min(d, m.vel * dt); m.x += dx / d * s; m.y += dy / d * s; m.vx = dx / d; m.vy = dy / d; m.anda = true; continue; }
    m.anda = false;
    if (m.estado === "volta") { m.fim = true; continue; }
    if (m.estado === "vai") {
      // chegou atrás do montinho: EMPURRA — anda junto com os pixels até o lugar certo
      m.estado = "arruma"; m.t = 0; m.de = { x: m.x, y: m.y };
      if (m.empurrao) m.dir = Math.abs(m.empurrao.dx) >= Math.abs(m.empurrao.dy) * 0.5 ? (m.empurrao.dx > 0 ? "right" : "left") : m.dir;
      for (const p of R.px) if (p.dono === m && p.fase === "torto") { p.fase = "ajeita"; p.t = 0; }
    } else if (m.estado === "arruma") {
      const k = Math.min(1, m.t / EMPURRA), e = m.empurrao || { dx: 0, dy: 0 };
      m.x = m.de.x + e.dx * k; m.y = m.de.y + e.dy * k;
      if (m.t > EMPURRA + 0.2) { m.estado = "vai"; m.alvo = null; m.empurrao = null; }
    }
  }
  if (R.machokes.some((m) => m.fim)) R.machokes = R.machokes.filter((m) => !m.fim);
  // eles EMPURRAM VOCÊ também — COM FORÇA (pedido do CAIO): esbarrou num Machoke,
  // ele te dá um EMPURRÃO que te joga uns 2 ou 3 tiles pra longe (e o que está
  // empurrando pixel empurra mais forte ainda)
  if (ow.sub && !ow.dlg?.active && !ow.menu) {
    const p = ow.st.player, px = p.x * TILE + 8 + (ow.subMapa === p.map ? ow.sub.x : 0), py = p.y * TILE + 12 + (ow.subMapa === p.map ? ow.sub.y : 0);
    R.esperaEmpurrao = Math.max(0, (R.esperaEmpurrao || 0) - dt);
    if (!R.esperaEmpurrao) {
      for (const m of R.machokes) {
        // a HITBOX do corpo: você dentro do retângulo dele
        if (Math.abs(px - m.x) > HIT.lado || py < m.y - HIT.cima || py > m.y + HIT.baixo) continue;
        // empurra pra fora do meio do corpo dele
        const dx = px - m.x, dy = py - (m.y - 12), d = Math.hypot(dx, dy) || 1;
        const forca = m.estado === "arruma" ? 320 : 230;
        R.empurrao = { vx: dx / d * forca, vy: dy / d * forca };
        // e ATACA (uma das animações de ataque do PMD, sorteada)
        m.soco = 0; m.socoX = dx / d; m.socoY = dy / d; m.golpe = ATAQUES[Math.floor(Math.random() * ATAQUES.length)];
        R.esperaEmpurrao = 0.7;
        ow.tremor = Math.max(ow.tremor || 0, 0.25);
        ow.somEmpurrao?.();
        break;
      }
    }
    // o empurrão vai perdendo força (em uns 0,4 s)
    if (R.empurrao) {
      const e = ow.empurraoVento || { x: 0, y: 0 };
      ow.empurraoVento = { x: e.x + R.empurrao.vx * dt, y: e.y + R.empurrao.vy * dt };
      const k = Math.pow(0.0005, dt);
      R.empurrao.vx *= k; R.empurrao.vy *= k;
      if (Math.hypot(R.empurrao.vx, R.empurrao.vy) < 10) R.empurrao = null;
    }
  }
  // os que ficaram sem dono (o dono foi embora antes): voltam pra fila
  for (const p of tortos) if (p.dono && !R.machokes.includes(p.dono)) p.dono = null;
}

/** com o chão: os BURACOS, os pixels caídos tortos (e os que estão voltando), e os MACHOKES */
export function desenharRouboChao(ow, ctx, cx, cy) {
  const R = ow.roubos?.[ow.st.player.map];
  if (!R) return;
  const dentro = (x, y) => x >= -1 && y >= -1 && x <= W && y <= H;
  // os buracos: o vazio onde o pixel estava (piscando uma estrelinha de vez em quando)
  ctx.fillStyle = "#07080f";
  for (const p of R.px) {
    const x = p.gx - cx, y = p.gy - cy;
    if (dentro(x, y)) ctx.fillRect(x, y, 1, 1);
  }
  for (const p of R.px) {
    if (p.fase !== "torto" && p.fase !== "ajeita") continue;
    const k = p.fase === "ajeita" ? Math.min(1, p.t / EMPURRA) : 0;
    const x = Math.round(p.lx + (p.gx - p.lx) * k - cx), y = Math.round(p.ly + (p.gy - p.ly) * k - cy);
    if (!dentro(x, y)) continue;
    ctx.fillStyle = p.c; ctx.fillRect(x, y, 1, 1);
  }
  // OS MACHOKES (só os que estão na tela), com o sprite do MYSTERY DUNGEON
  if (R.machokes.length) {
    const t = performance.now() / 1000;
    for (const m of R.machokes) {
      const x = Math.round(m.x - cx), y = Math.round(m.y - cy);
      if (x < -32 || y < -8 || x > W + 32 || y > H + 40) continue;
      // qual animação: SOCO (acabou de te empurrar), ANDAR (andando ou empurrando pixel) ou PARADO
      let nome = m.anda || m.estado === "arruma" ? "anda" : "parado";
      let vx = m.vx || 0, vy = m.vy || 1;
      if (m.estado === "arruma" && m.empurrao) { vx = m.empurrao.dx; vy = m.empurrao.dy; }
      let tq = t + (m.vel || 0);
      if (m.soco != null) {
        m.soco += 1 / 60;
        const g = PMD[m.golpe] ? m.golpe : "soco", dura = PMD[g].dur.reduce((a, b) => a + b, 0) / 60;
        if (m.soco < dura) { nome = g; vx = m.socoX; vy = m.socoY; tq = m.soco; } else m.soco = null;
      }
      const P = PMD[nome], img = folhaPMD(nome);
      if (!img) continue;
      const q = quadroPMD(nome, tq, nome === "anda" || nome === "parado"), lin = linhaPMD(vx, vy);
      const treme = m.estado === "arruma" ? Math.round(Math.sin(t * 40 + m.vel)) : 0;
      ctx.drawImage(img, q * P.w, lin * P.h, P.w, P.h, x - P.w / 2 + treme, y - PE_PMD - P.h / 2, P.w, P.h);
      // empurrando pixel: poeirinha atrás dos pés
      if (m.estado === "arruma" && m.empurrao) {
        const d = Math.hypot(m.empurrao.dx, m.empurrao.dy) || 1, ex = m.empurrao.dx / d;
        ctx.fillStyle = "rgba(220,210,180,0.7)";
        for (let k = 0; k < 3; k++) { const f = (t * 3 + k / 3 + m.vel) % 1; ctx.fillRect(Math.round(x - ex * (5 + f * 6)), Math.round(y - 1 - f * 3), 1, 1); }
      }
    }
  }
}

/** por cima de tudo: os pixels SUBINDO pro funil e os que estão CAINDO do céu */
export function desenharRouboAr(ow, ctx, cx, cy) {
  const R = ow.roubos?.[ow.st.player.map];
  if (!R) return;
  const tor = ow._tornadoTela;
  for (const p of R.px) {
    let x, y;
    if (p.fase === "sobe") {
      // girando e subindo pro meio do funil
      const k = Math.min(1, p.t / 1.4), alvoX = tor ? tor.x : p.sx, alvoY = (tor ? tor.y : p.sy) - 120;
      const raio = 6 + k * 18, a = p.a + p.t * 9;
      x = p.sx + (alvoX - p.sx) * k + Math.cos(a) * raio * k;
      y = p.sy + (alvoY - p.sy) * k * k + Math.sin(a) * raio * 0.4 * k;
    } else if (p.fase === "cai") {
      const k = Math.min(1, p.t / p.dur);
      x = p.lx - cx + Math.sin(p.a + p.t * 4) * (1 - k) * 4;
      y = p.ly - cy - 170 * (1 - k * k);
    } else continue;
    if (x < 0 || y < 0 || x > W || y > H) continue;
    ctx.fillStyle = p.c; ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
  }
}
