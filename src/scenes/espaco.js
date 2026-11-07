// O ESPAÇO SIDERAL EM 3D (pedido do CAIO, nov/2026: "uma nave 3d no espaço 3d
// e pkmn vai ter um sistema solar diferente que o da terra"). Os planetas são
// os de src/data/espaco.js.
//
// Igual ao RAYQUAZA de src/core/gigante3d.js: tudo é rasterizado aqui, sem
// biblioteca, NA RESOLUÇÃO DO JOGO (240x160): cada pixel do 3D é um pixel da
// tela, a luz cai em DEGRAUS (como alguém pintando à mão) e as coisas têm o
// contorno escuro de 1 pixel dos sprites.
//   - as ESTRELAS ficam no infinito (só giram com a câmera);
//   - o SOL e os PLANETAS são bolas: por pixel sai a normal, a luz do sol e o
//     desenho de cada um (continente, cratera, faixa, rachadura de lava...);
//     o ANELLUS tem anéis;
//   - a NAVE é um modelinho de triângulos, com a câmera atrás dela.
// ◀▶ vira, ▲▼ sobe/desce o nariz, A acelera, B freia. Chegando perto de um
// planeta ele pergunta se quer pousar.
import { DB } from "../data/index.js";
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { drawText, fade, PAL } from "../core/gfx.js";
import { Dialogue } from "../systems/dialogue.js";
import { makeRng } from "../core/rng.js";

const W = 240, H = 160, F = 150;          // F: o "zoom" da câmera
// VMAX 999,9 = 9999 KM/S no painel (pedido do CAIO): segurando A ela acelera
// cada vez mais rápido (ACEL + a velocidade), e chega lá depois de um tempo
const VMAX = 999.9, ACEL = 60, ACEL_MAIS = 0.35, FREIO = 200, GIRA = 1.5;   // FREIO 200 = 2000 KM/S por segundo

// ------------------------------------------------------------------ vetores
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const norm = (a) => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

// a "nuvem" de cada planeta: uma soma de senos em 3D (dá continente, mancha, rachadura)
const ruido = (x, y, z, s) => Math.sin(x * 3.1 * s + 1.7) * Math.sin(y * 2.7 * s + 0.3) * Math.sin(z * 3.3 * s + 2.1)
  + 0.5 * Math.sin(x * 7.3 * s + y * 5.1 * s) * Math.sin(z * 6.7 * s + 1.1);

// ------------------------------------------------------------- as REGIÕES
// O PLANETA POKÉMON com o formato das regiões (pedido do CAIO): contornos em
// [longitude, latitude], no lugar do mundo de verdade em que cada uma se
// inspira, e aumentados (`k`) em volta do meio de cada grupo pra aparecer do
// espaço (`vai`: e chegados pra perto do meio do planeta, longe do gelo dos
// polos). HOENN ficou de fora (foi tirada do jogo).
const REGIOES = [
  { nome: "JOHTO", cor: [88, 168, 72], k: 4.5, meio: [137, 37], vai: [137, 28], pts: [[131, 34], [132.5, 35.5], [135, 35.8], [136.5, 36.6], [137.2, 35], [135, 33.6], [133, 33.9]] },
  { nome: "KANTO", cor: [104, 184, 80], k: 4.5, meio: [137, 37], vai: [137, 28], pts: [[137.2, 35], [136.5, 36.6], [138.5, 37.8], [140, 38.6], [141, 37.5], [140.8, 35.7], [139.8, 35], [138.5, 34.6]] },
  { nome: "SINNOH", cor: [96, 160, 104], k: 4.5, meio: [137, 37], vai: [137, 28], pts: [[140, 41.5], [140.5, 43], [141.6, 45.4], [143, 44.5], [145.5, 43.4], [143.5, 42], [141, 42.3]] },
  { nome: "UNOVA", cor: [120, 176, 72], k: 5, meio: [-75, 42], vai: [-78, 26], pts: [[-79, 40], [-79, 43], [-75, 45], [-72, 42], [-71, 41.2], [-74, 40.5], [-75, 39]] },
  { nome: "KALOS", cor: [96, 176, 88], k: 3.2, meio: [2, 47], vai: [6, 28], pts: [[-4.5, 48.4], [-1.5, 49.6], [2.5, 51], [8, 49], [7.5, 47.5], [6.5, 45], [7.5, 43.7], [3, 42.5], [-1.5, 43.4], [-1.2, 46]] },
  { nome: "GALAR", cor: [80, 152, 80], k: 3.2, meio: [2, 47], vai: [6, 28], pts: [[-5.7, 50], [-3, 50.6], [1.7, 51.2], [1.7, 52.8], [-0.3, 54], [-1.6, 55.6], [-2, 57.6], [-3.3, 58.6], [-5, 58.6], [-6, 56.5], [-4.9, 55], [-3, 54.4], [-4.5, 53.2], [-4.6, 52], [-5.1, 51.7], [-4, 51.5]] },
  { nome: "PALDEA", cor: [168, 176, 88], k: 3.2, meio: [2, 47], vai: [6, 28], pts: [[-9, 43], [-1.5, 43.4], [3.2, 42.3], [0.2, 40], [-0.3, 38.7], [-2, 36.7], [-5.6, 36], [-7.5, 37.2], [-9, 38.7]] },
  { nome: "BRAGLITCH", cor: [72, 160, 64], k: 1.4, meio: [-52, -12], vai: [-52, -18], pts: [[-60, 5], [-51, 4], [-35, -5], [-39, -13], [-41, -22], [-48, -26], [-53, -33.7], [-57, -30], [-54, -25], [-58, -20], [-60, -14], [-73, -9], [-70, -4], [-67, 2]] },
];
// ALOLA: as ilhas (círculos), aumentadas em volta do meio delas
const ALOLA = { cor: [120, 192, 96], k: 7, meio: [-157, 21], vai: [-157, 4], ilhas: [[-159.5, 22, 0.6], [-157.9, 21.5, 0.5], [-156.5, 20.8, 0.8], [-155.5, 19.6, 1.2]] };

/** o mapa do planeta: 360x180, 1 grau por pixel; o valor é a cor da região (ou null = mar) */
let MAPA_MUNDO = null;
function mapaMundo() {
  if (MAPA_MUNDO) return MAPA_MUNDO;
  const m = new Array(360 * 180).fill(null);
  const dentro = (x, y, pts) => { let c = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; };
  const regs = REGIOES.map((r) => ({ ...r, pts: r.pts.map(([x, y]) => [(r.vai || r.meio)[0] + (x - r.meio[0]) * r.k, (r.vai || r.meio)[1] + (y - r.meio[1]) * r.k]) }));
  const ilhas = ALOLA.ilhas.map(([x, y, raio]) => [ALOLA.vai[0] + (x - ALOLA.meio[0]) * ALOLA.k, ALOLA.vai[1] + (y - ALOLA.meio[1]) * ALOLA.k, raio * ALOLA.k]);
  for (let j = 0; j < 180; j++) for (let i = 0; i < 360; i++) {
    const lon = i - 180 + 0.5, lat = 90 - j - 0.5;
    for (const r of regs) if (dentro(lon, lat, r.pts)) { m[j * 360 + i] = r.cor; break; }
    if (!m[j * 360 + i]) for (const [x, y, raio] of ilhas) if (Math.hypot(lon - x, lat - y) < raio) { m[j * 360 + i] = ALOLA.cor; break; }
  }
  MAPA_MUNDO = m;
  return m;
}

// ------------------------------------------------------------------ a nave
// x pra direita, y pra cima, z pra frente (o nariz)
const NV = [
  [0, 0, 4.2],                                          // 0 nariz
  [-1, 0, 0.6], [0, 0.9, 0.6], [1, 0, 0.6], [0, -0.7, 0.6],   // 1-4 o anel da cabine
  [-0.9, 0, -2.6], [0, 0.8, -2.6], [0.9, 0, -2.6], [0, -0.6, -2.6], // 5-8 o rabo
  [-3.6, -0.2, -2.4], [3.6, -0.2, -2.4],                // 9-10 as pontas das asas
  [0, 2, -3],                                           // 11 a barbatana
];
// [a, b, c, cor] — cores: 0 casco, 1 faixa, 2 cabine, 3 asa, 4 motor
const NF = [
  [0, 1, 2, 2], [0, 2, 3, 2], [0, 3, 4, 0], [0, 4, 1, 0],
  [1, 5, 6, 0], [1, 6, 2, 1], [2, 6, 7, 1], [2, 7, 3, 0], [3, 7, 8, 0], [3, 8, 4, 0], [4, 8, 5, 0], [4, 5, 1, 0],
  [5, 8, 7, 4], [5, 7, 6, 4],
  [1, 9, 5, 3], [3, 7, 10, 3],
  [2, 11, 6, 1],
];
const COR_NAVE = [
  ["#3a4050", "#8a94a8", "#d0d8e8", "#ffffff"],   // casco
  ["#6a1010", "#b02828", "#e85050", "#ff9a9a"],   // faixa vermelha
  ["#102a5a", "#2a5ab0", "#5aa0f0", "#c8f0ff"],   // cabine
  ["#2a3040", "#5a6478", "#9aa4b8", "#d8e0f0"],   // asa
  ["#2a2a2a", "#4a4a4a", "#6a6a6a", "#8a8a8a"],   // a boca do motor
].map((p) => p.map(hex));

export class EspacoScene {
  /** args: { de } — o id do planeta de onde a nave saiu */
  enter(args = {}) {
    this.st = this.game.state;
    this.aoPousar = args.aoPousar || null;
    // a GALÁXIA de onde a nave sai: a que tem o planeta dela
    const gs = DB.GALAXIAS || [{ id: "pokemon", sol: DB.SOL, planetas: DB.PLANETAS, fundo: [6, 6, 18] }];
    const g = gs.find((x) => x.planetas.some((p) => p.id === (args.de || "casa"))) || gs[0];
    this.t = 0;
    this.carregarGalaxia(g.id);
    const de = this.planetas.find((p) => p.id === (args.de || "casa")) || this.planetas[0];
    // a nave sai do lado do planeta, de frente pro sol
    const fora = norm(sub(de.pos, this.sol.pos));
    this.pos = add(de.pos, mul(fora, de.raio + 14));
    // pra onde a nave aponta: a FRENTE e o CIMA dela (giram juntos, sem trava:
    // dá pra dar volta inteira pra qualquer lado)
    this.apontar(mul(fora, -1)); this.roll = 0;
    this.vel = 0;
    this.perto = de.id;                    // não pergunta de novo do planeta de onde saiu
    this.fadeA = 1; this.fadeDir = -1; this.saindo = null; this.hiper = null;
    this.dlg = new Dialogue();
    this.buf = new ImageData(W, H);
    this.zb = new Float32Array(W * H);
    const r = makeRng(777);
    this.estrelas = Array.from({ length: 420 }, () => {
      const z = r() * 2 - 1, a = r() * Math.PI * 2, s = Math.sqrt(1 - z * z);
      return { d: [s * Math.cos(a), z, s * Math.sin(a)], b: r(), cor: r.pick([[255, 255, 255], [255, 240, 200], [200, 220, 255], [255, 210, 210]]) };
    });
    if (DB.MUSIC?.era_futuro) Audio2.playMusic("era_futuro", DB.MUSIC.era_futuro);
  }

  /** troca de GALÁXIA (src/data/espaco.js, GALAXIAS): outro sol, outros planetas, outro fundo */
  carregarGalaxia(id) {
    const gs = DB.GALAXIAS || [];
    const g = gs.find((x) => x.id === id) || gs[0];
    this.galaxia = g;
    this.planetas = g.planetas.map((p) => ({ ...p, pos: p.pos || [0, 0, 0], c: p.cores.map(hex) }));
    this.sol = { ...(g.sol || DB.SOL || {}), pos: [0, 0, 0], c: ((g.sol || DB.SOL)?.cores || ["#ffffff"]).map(hex) };
    this.fundo = g.fundo || [6, 6, 18];
    this.orbitar();
  }

  /** os planetas que giram em volta de um ponto (os PRIMAIS) */
  orbitar() {
    for (const p of this.planetas) {
      const o = p.orbita;
      if (!o) continue;
      const a = o.fase + this.t * o.vel;
      p.pos = [o.centro[0] + Math.cos(a) * o.raio, o.centro[1] + Math.sin(a) * o.raio * 0.15, o.centro[2] + Math.sin(a) * o.raio];
    }
  }

  // ------------------------------------------------------------- a câmera
  /** aponta a nave pra `dir`, com o cima o mais pra cima possível */
  apontar(dir) {
    this.f = norm(dir);
    const cima = Math.abs(this.f[1]) > 0.95 ? [0, 0, 1] : [0, 1, 0];
    this.u = norm(cross(this.f, norm(cross(cima, this.f))));
  }
  frente() { return this.f; }
  /** gira a nave: `a` pro lado (em volta do cima dela), `b` o nariz (em volta da direita dela) */
  girar(a, b) {
    let f = this.f, u = this.u;
    const r = norm(cross(u, f));
    if (a) f = add(mul(f, Math.cos(a)), mul(r, Math.sin(a)));
    if (b) { const f2 = add(mul(f, Math.cos(b)), mul(u, Math.sin(b))); u = add(mul(u, Math.cos(b)), mul(f, -Math.sin(b))); f = f2; }
    this.f = norm(f);
    this.u = norm(cross(this.f, norm(cross(u, this.f))));   // (endireita: fica tudo em ângulo reto)
  }
  base() {
    const f = this.f, u0 = this.u;
    const r = norm(cross(u0, f));
    const u = cross(f, r);
    return { f, r, u };
  }

  update(dt) {
    this.t += dt;
    if (this.fadeDir) {
      this.fadeA = Math.max(0, Math.min(1, this.fadeA + this.fadeDir * dt * 2));
      if (this.fadeDir < 0 && this.fadeA <= 0) this.fadeDir = 0;
    }
    if (this.saindo) { if (this.fadeA >= 1) this.sair(); return; }
    this.orbitar();
    // o HIPERESPAÇO: as estrelas viram risco; no fim, escolhe a galáxia
    if (this.hiper) {
      this.hiper.t += dt;
      if (this.hiper.t > 1.8 && !this.hiper.perguntou) {
        this.hiper.perguntou = true;
        const T = DB.ESPACO.textos, outras = (DB.GALAXIAS || []).filter((g) => g.id !== this.galaxia.id);
        this.dlg.ask(T.perguntaHiper, [...outras.map((g) => g.nome), "FICAR AQUI"], (i) => {
          const g = outras[i];
          if (g) {
            this.carregarGalaxia(g.id);
            // sai do hiperespaço perto do primeiro planeta de lá
            const alvo = this.planetas[0];
            this.pos = add(alvo.pos, [0, alvo.raio * 0.6, -(alvo.raio * 4 + 120)]);
            this.apontar(sub(alvo.pos, this.pos));
            this.perto = null;
            Audio2.tone(880, 0.2, "triangle", 0.4);
            this.dlg.say(T.chegouHiper(g.nome));
          }
          this.vel = 100;
          this.hiper = null;
        });
      }
      this.dlg.update(dt);
      return;
    }
    if (this.dlg.update(dt)) return;
    if (this.vel >= VMAX - 0.5 && Input.consume("select")) {
      this.hiper = { t: 0 };
      for (let k = 0; k < 14; k++) setTimeout(() => Audio2.tone(200 + k * 60, 0.08, "sawtooth", 0.3), k * 90);
      return;
    }
    // os controles
    const vira = (Input.held("right") ? 1 : 0) - (Input.held("left") ? 1 : 0);   // ▶ vira pra direita
    const sobe = (Input.held("up") ? 1 : 0) - (Input.held("down") ? 1 : 0);
    this.girar(vira * GIRA * dt, sobe * GIRA * 0.8 * dt);
    this.roll += ((vira * 0.6) - this.roll) * Math.min(1, dt * 5);
    // o FREIO ganha do acelerador: segurando os dois, freia (1000 KM/S a cada segundo)
    const freando = Input.held("b") || Input.held("run");   // B (X, Backspace, Esc) ou SHIFT
    this.acelerando = Input.held("a") && !freando;
    this.freando = freando && this.vel > 0;
    if (freando) this.vel = Math.max(0, this.vel - FREIO * dt);
    else if (this.acelerando) this.vel = Math.min(VMAX, this.vel + (ACEL + this.vel * ACEL_MAIS) * dt);
    else this.vel = Math.max(0, this.vel - 8 * dt);
    if (this.acelerando && Math.floor(this.t * 12) !== this._som) { this._som = Math.floor(this.t * 12); Audio2.tone(55 + Math.min(400, this.vel * 0.3), 0.05, "sawtooth", 0.15); }
    // anda em passinhos de 4 mil km: a 9999 KM/S ela atravessaria um planeta
    // inteiro num quadro só
    const total = this.vel * dt, passos = Math.max(1, Math.ceil(total / 4));
    let algum = null;
    for (let passo = 0; passo < passos; passo++) {
      this.pos = add(this.pos, mul(this.frente(), total / passos));
      // o SOL queima: empurra pra fora
      const ds = sub(this.pos, this.sol.pos), dsol = len(ds);
      // (encostou: a nave dá meia-volta sozinha e sai de ré do calor — antes ela
      // ficava presa, empurrando de cara pro sol)
      if (dsol < this.sol.raio * 1.5) {
        const fora = norm(ds);
        this.pos = add(this.sol.pos, mul(fora, this.sol.raio * 1.5 + 1));
        this.apontar(fora);
        this.vel = 45;
        if (!this.queimou) { this.queimou = true; this.dlg.say("QUENTE DEMAIS! A NAVE DEU MEIA-VOLTA SOZINHA PRA NÃO DERRETER."); }
        break;
      } else if (dsol > this.sol.raio * 2.2) this.queimou = false;
      // longe demais: o fim do sistema solar
      // (bem longe, pra dar pra chegar a 9999 KM/S; no fim ela dá meia-volta)
      if (dsol > 9000) {
        this.pos = mul(norm(ds), 8990); this.apontar(mul(norm(ds), -1)); this.vel = Math.min(this.vel, 200);
        if (!this.dlg.active) this.dlg.say("AQUI ACABA O SISTEMA SOLAR. DEPOIS DISTO É SÓ ESCURO. A NAVE DEU MEIA-VOLTA.");
        break;
      }
      // os planetas: não atravessa, e chegando perto pergunta se pousa
      algum = null;
      let bateu = false;
      for (const p of this.planetas) {
        const d = sub(this.pos, p.pos), dist = len(d);
        if (dist < p.raio + 6) { this.pos = add(p.pos, mul(norm(d), p.raio + 6)); this.vel = Math.min(this.vel, 15); bateu = true; }
        if (dist < p.raio * 1.6 + 12) algum = p;
      }
      if (bateu) break;
      if (algum && algum.id !== this.perto) break;
    }
    if (!algum) this.perto = null;
    else if (algum.id !== this.perto) {
      this.perto = algum.id;
      const T = DB.ESPACO.textos;
      this.vel = Math.min(this.vel, 20);
      this.dlg.say(algum.texto, () => this.dlg.ask(T.perguntaPousar(algum.nome), T.opcoesPousar, (i) => {
        if (i !== 0) return;
        Audio2.tone(330, 0.1, "square", 0.3); Audio2.tone(220, 0.2, "square", 0.3);
        this.saindo = algum; this.fadeDir = 1;
      }));
    }
  }

  /** pousou: o mapa do planeta (ou Cinnabar, se é o planeta Pokémon) */
  sair() {
    const p = this.saindo, E = DB.ESPACO;
    const pl = this.st.player;
    let fala;
    if (p.casa) { Object.assign(pl, { map: E.base.mapa, x: E.base.chega.x, y: E.base.chega.y, dir: E.base.chega.dir }); fala = E.textos.voltou; }
    else {
      const sp = DB.MAPS[p.mapa]?.spawn || { x: 2, y: 2, dir: "down" };
      Object.assign(pl, { map: p.mapa, x: sp.x, y: sp.y, dir: sp.dir || "down" }); fala = E.textos.pousou(p.nome);
    }
    this.game.scenes.pop();
    this.aoPousar?.(fala);
  }

  // ------------------------------------------------------------- o desenho
  render(ctx) {
    const d = this.buf.data;
    // o fundo: quase preto, com um azul bem fundo
    const [f0, f1, f2] = this.fundo || [6, 6, 18];
    for (let i = 0; i < W * H; i++) { d[i * 4] = f0; d[i * 4 + 1] = f1; d[i * 4 + 2] = f2; d[i * 4 + 3] = 255; }
    const B = this.base();
    const cam = sub(add(this.pos, mul(B.u, 2.6)), mul(B.f, 13));
    this.cam = cam; this.B = B;
    // as ESTRELAS (no infinito)
    for (const s of this.estrelas) {
      const z = dot(s.d, B.f);
      if (z <= 0.05) continue;
      const x = Math.round(W / 2 + dot(s.d, B.r) / z * F), y = Math.round(H / 2 - dot(s.d, B.u) / z * F);
      if (x < 0 || y < 0 || x >= W || y >= H) continue;
      const k = 0.45 + 0.55 * Math.abs(Math.sin(this.t * (0.6 + s.b * 2) + s.b * 40)) * s.b + 0.2;
      // no HIPERESPAÇO a estrela vira um risco pra fora do meio da tela
      const comp = this.hiper ? Math.min(60, this.hiper.t ** 2 * 30) : 0;
      const dx = x - W / 2, dy = y - H / 2, dl = Math.hypot(dx, dy) || 1;
      for (let q = 0; q <= comp; q++) {
        const X = Math.round(x + dx / dl * q), Y = Math.round(y + dy / dl * q);
        if (X < 0 || Y < 0 || X >= W || Y >= H) break;
        const i = (Y * W + X) * 4, kk = this.hiper ? 1 - q / (comp + 1) * 0.6 : k;
        d[i] = Math.max(d[i], s.cor[0] * kk); d[i + 1] = Math.max(d[i + 1], s.cor[1] * kk); d[i + 2] = Math.max(d[i + 2], 255 * kk);
      }
    }
    if (this.hiper) { this.zb.fill(1e9); this.nave(); this.mostrar(ctx); return; }
    // o SOL e os PLANETAS, de longe pra perto
    const bolas = [{ ...this.sol, sol: true }, ...this.planetas].map((p) => ({ p, z: dot(sub(p.pos, cam), B.f) })).filter((o) => o.z > 1).sort((a, b) => b.z - a.z);
    for (const { p } of bolas) this.bola(p);
    // a NAVE
    this.zb.fill(1e9);
    this.nave();
    this.mostrar(ctx);
  }

  /** o quadro pronto na tela, o painel e as falas */
  mostrar(ctx) {
    // o quadro vai pra uma tela de 240x160 e ela é desenhada com o zoom do jogo
    // (putImageData direto ignora o zoom: saía pequenininho no canto)
    if (!this.tela) { this.tela = document.createElement("canvas"); this.tela.width = W; this.tela.height = H; this.telaCtx = this.tela.getContext("2d"); }
    this.telaCtx.putImageData(this.buf, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this.tela, 0, 0);
    this.hud(ctx);
    this.dlg.render(ctx);
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }

  /** projeta um ponto do mundo: [x, y, z] na tela (z = profundidade) */
  proj(q) {
    const v = sub(q, this.cam), z = dot(v, this.B.f);
    return [W / 2 + dot(v, this.B.r) / z * F, H / 2 - dot(v, this.B.u) / z * F, z];
  }

  /** uma BOLA (o sol ou um planeta), pixel por pixel */
  bola(p) {
    const d = this.buf.data, B = this.B;
    const [cx, cy, z] = this.proj(p.pos);
    const R = p.raio * F / z, RY = R * (p.ovo ? 1.3 : 1);   // o OVO é mais alto que largo
    if (R < 0.6) { const x = Math.round(cx), y = Math.round(cy); if (x >= 0 && y >= 0 && x < W && y < H) { const i = (y * W + x) * 4, c = p.c[2]; d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; } return; }
    if (cx + R * 2.4 < 0 || cx - R * 2.4 > W || cy + R * 2.4 < 0 || cy - R * 2.4 > H) return;
    const L = p.sol ? null : norm(sub(this.sol.pos, p.pos));
    const giro = this.t * 0.05 + p.raio;               // o planeta gira devagarzinho
    const cg = Math.cos(giro), sg = Math.sin(giro);
    const pinta = (x, y, c) => { const i = (y * W + x) * 4; d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; };
    // os ANÉIS de trás (os da frente vêm depois da bola)
    const aneis = p.aneis ? this.aneis(p, z) : null;
    if (aneis) for (const a of aneis) if (a.atras) pinta(a.x, a.y, a.c);
    // o brilho em volta do sol
    if (p.sol) {
      for (let y = Math.max(0, Math.floor(cy - R * 2)); y <= Math.min(H - 1, cy + R * 2); y++)
        for (let x = Math.max(0, Math.floor(cx - R * 2)); x <= Math.min(W - 1, cx + R * 2); x++) {
          const q = Math.hypot(x - cx, y - cy) / R;
          if (q < 1 || q > 2) continue;
          const a = (2 - q) ** 2 * 0.5, i = (y * W + x) * 4;
          d[i] += (255 - d[i]) * a; d[i + 1] += (200 - d[i + 1]) * a; d[i + 2] += (90 - d[i + 2]) * a * 0.6;
        }
    }
    for (let y = Math.max(0, Math.floor(cy - RY)); y <= Math.min(H - 1, Math.ceil(cy + RY)); y++) {
      for (let x = Math.max(0, Math.floor(cx - R)); x <= Math.min(W - 1, Math.ceil(cx + R)); x++) {
        const dx = (x - cx) / R, dy = (y - cy) / RY, q = dx * dx + dy * dy;
        if (q > 1) continue;
        // o CONTORNO de 1 pixel
        if (R > 3 && Math.sqrt(q) > 1 - 1.2 / R) { pinta(x, y, p.sol ? p.c[3] : [10, 10, 20]); continue; }
        const nz = Math.sqrt(1 - q);
        if (p.sol) { const k = q < 0.3 ? 0 : q < 0.65 ? 1 : 2; pinta(x, y, p.c[k + Math.round(Math.sin(this.t * 3 + x * 0.3 + y * 0.2) * 0.4 + 0.3) > 3 ? 3 : k]); continue; }
        // a normal no mundo
        const n = add(add(mul(B.r, dx), mul(B.u, -dy)), mul(B.f, -nz));
        const luz = dot(n, L);
        // a normal "do planeta", girando no eixo dele
        const lx = n[0] * cg - n[2] * sg, ly = n[1], lz = n[0] * sg + n[2] * cg;
        let tom = this.desenho(p, lx, ly, lz);
        if (tom.brilha) { pinta(x, y, tom); continue; }    // a RACHADURA de luz do ovo não tem sombra
        // a LUZ em degraus
        const deg = luz < -0.05 ? 0.28 : luz < 0.25 ? 0.55 : luz < 0.6 ? 0.82 : 1;
        pinta(x, y, [tom[0] * deg, tom[1] * deg, tom[2] * deg]);
      }
    }
    if (aneis) for (const a of aneis) if (!a.atras) pinta(a.x, a.y, a.c);
  }

  /** a cor de um ponto do planeta (lx, ly, lz: a normal no planeta) */
  desenho(p, lx, ly, lz) {
    const C = p.c, v = ruido(lx, ly, lz, 1);
    switch (p.estilo) {
      case "terra": {
        if (Math.abs(ly) > 0.9) return C[3];                                // os polos
        const nuvem = ruido(lx + 3, ly * 2, lz + 1, 1.6);
        if (nuvem > 0.85) return C[3];                                      // pouca nuvem: pra ver as regiões
        // as REGIÕES no lugar delas (mapaMundo)
        const lat = Math.asin(Math.max(-1, Math.min(1, ly))) * 180 / Math.PI, lon = Math.atan2(lz, lx) * 180 / Math.PI;
        const i = Math.min(359, Math.max(0, Math.floor(lon + 180))), j = Math.min(179, Math.max(0, Math.floor(90 - lat)));
        const terra = mapaMundo()[j * 360 + i];
        if (terra) return terra;
        return v < -0.4 ? C[0] : C[1];                                       // o mar (mais fundo / mais raso)
      }
      case "crateras": {
        const c = ruido(lx * 2, ly * 2, lz * 2, 1.5);
        return c > 0.55 ? C[0] : c > 0.35 ? C[1] : v > 0.3 ? C[3] : C[2];
      }
      case "oceano": return v > 0.72 ? [232, 216, 160] : v > 0.2 ? C[2] : v < -0.4 ? C[0] : C[1];
      case "lava": { const r = Math.abs(Math.sin(lx * 9 + Math.sin(lz * 7) * 2 + ly * 4)); return r < 0.12 ? C[3] : r < 0.25 ? C[2] : v > 0.3 ? C[1] : C[0]; }
      case "gelo": return v > 0.4 ? C[3] : v > -0.1 ? C[2] : C[1];
      case "faixas": { const f = Math.sin(ly * 14 + Math.sin(lx * 3 + lz * 2) * 0.8); return f > 0.55 ? C[3] : f > 0 ? C[2] : f > -0.5 ? C[1] : C[0]; }
      case "cristal": { const fa = Math.floor(lx * 3) + Math.floor(ly * 3) * 3 + Math.floor(lz * 3) * 7; return C[((fa % 4) + 4) % 4]; }
      case "ovo": {
        const r = Math.abs(Math.sin(lx * 6 + Math.sin(ly * 9) * 1.6 + lz * 3));
        if (r < 0.06) return Object.assign([255, 255, 230], { brilha: true });
        return v > 0.4 ? C[3] : v > -0.2 ? C[2] : C[1];
      }
      case "dna": { const h = Math.sin(ly * 10 + Math.atan2(lz, lx) * 2); return Math.abs(h) < 0.2 ? C[2] : h > 0 ? C[1] : C[0]; }
      case "ultra": { const g = Math.abs(Math.sin(lx * 8)) < 0.1 || Math.abs(Math.sin(ly * 8)) < 0.1; return g ? Object.assign([...C[3]], { brilha: true }) : v > 0.3 ? C[2] : C[1]; }
      case "metal": { const g = Math.abs(Math.sin(Math.atan2(lz, lx) * 10)) < 0.08 || Math.abs(Math.sin(ly * 12)) < 0.08; return g ? C[0] : v > 0.4 ? C[3] : C[2]; }
      default: return C[2];
    }
  }

  /** os pontinhos dos anéis do ANELLUS (com quem fica atrás da bola) */
  aneis(p, zc) {
    const eixo = norm([0.25, 1, 0.15]), a1 = norm(cross(eixo, [1, 0, 0])), a2 = cross(eixo, a1);
    const out = [], R = p.raio * F / zc;
    const passos = Math.min(2400, Math.max(160, Math.round(R * 2.25 * Math.PI * 2.2)));
    for (let k = 0; k < passos; k++) {
      const ang = (k / passos) * Math.PI * 2;
      for (let rr = 1.45; rr <= 2.25; rr += 0.8 / Math.max(6, R * 1.1)) {
        if (rr > 1.78 && rr < 1.86) continue;            // a fresta entre os dois anéis
        const q = add(p.pos, mul(add(mul(a1, Math.cos(ang)), mul(a2, Math.sin(ang))), p.raio * rr));
        const [x, y, z] = this.proj(q);
        if (z <= 1) continue;
        const X = Math.round(x), Y = Math.round(y);
        if (X < 0 || Y < 0 || X >= W || Y >= H) continue;
        const c = rr < 1.78 ? p.c[2] : p.c[3];
        out.push({ x: X, y: Y, atras: z > zc, c });
      }
    }
    return out;
  }

  /** a NAVE: os triângulos virados pelo jeito dela, com a luz do sol em degraus */
  nave() {
    const d = this.buf.data, B = this.B;
    const f = this.f, u0 = this.u, r0 = norm(cross(u0, f));
    // o ROLL (inclina quando vira)
    const cr = Math.cos(this.roll), sr = Math.sin(this.roll);
    const r = add(mul(r0, cr), mul(u0, sr)), u = add(mul(u0, cr), mul(r0, -sr));
    const mundo = NV.map(([x, y, z]) => add(this.pos, add(add(mul(r, x), mul(u, y)), mul(f, z))));
    const tela = mundo.map((q) => this.proj(q));
    const L = norm(sub(this.sol.pos, this.pos));
    const mask = new Uint8Array(W * H);
    for (const [a, b, c, cor] of NF) {
      const A = tela[a], Bv = tela[b], Cv = tela[c];
      if (A[2] <= 0.5 || Bv[2] <= 0.5 || Cv[2] <= 0.5) continue;
      const n = norm(cross(sub(mundo[b], mundo[a]), sub(mundo[c], mundo[a])));
      // as duas faces valem (as asas são finas): a normal vira pro lado da câmera
      const pc = sub(mundo[a], this.cam);
      const nn = dot(n, pc) > 0 ? mul(n, -1) : n;
      const luz = dot(nn, L);
      const pal = COR_NAVE[cor];
      const tom = luz < -0.1 ? pal[0] : luz < 0.3 ? pal[1] : luz < 0.7 ? pal[2] : pal[3];
      this.triangulo(A, Bv, Cv, tom, mask);
    }
    // o contorno escuro em volta da nave
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
      const k = y * W + x;
      if (mask[k]) continue;
      if (mask[k - 1] || mask[k + 1] || mask[k - W] || mask[k + W]) { const i = k * 4; d[i] = 12; d[i + 1] = 12; d[i + 2] = 22; }
    }
    // o FOGO do motor, quando acelera
    if (this.acelerando || this.vel > 20) {
      const [x, y] = this.proj(add(this.pos, mul(f, -3.4)));
      const tam = 2 + Math.min(1, this.vel / 140) * 4 + Math.random() * 2;
      for (let j = -tam; j <= tam; j++) for (let i = -tam; i <= tam; i++) {
        const q = Math.hypot(i, j) / tam;
        if (q > 1) continue;
        const X = Math.round(x + i), Y = Math.round(y + j);
        if (X < 0 || Y < 0 || X >= W || Y >= H || mask[Y * W + X]) continue;
        const c = q < 0.4 ? [255, 250, 200] : q < 0.75 ? [255, 180, 60] : [230, 80, 30];
        const o = (Y * W + X) * 4; d[o] = c[0]; d[o + 1] = c[1]; d[o + 2] = c[2];
      }
    }
  }

  triangulo(A, B, C, cor, mask) {
    const d = this.buf.data, zb = this.zb;
    const x0 = Math.max(0, Math.floor(Math.min(A[0], B[0], C[0]))), x1 = Math.min(W - 1, Math.ceil(Math.max(A[0], B[0], C[0])));
    const y0 = Math.max(0, Math.floor(Math.min(A[1], B[1], C[1]))), y1 = Math.min(H - 1, Math.ceil(Math.max(A[1], B[1], C[1])));
    const area = (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0]);
    if (Math.abs(area) < 1e-6) return;
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const px = x + 0.5, py = y + 0.5;
      const w0 = ((B[0] - px) * (C[1] - py) - (B[1] - py) * (C[0] - px)) / area;
      const w1 = ((C[0] - px) * (A[1] - py) - (C[1] - py) * (A[0] - px)) / area;
      const w2 = 1 - w0 - w1;
      if (w0 < 0 || w1 < 0 || w2 < 0) continue;
      const z = w0 * A[2] + w1 * B[2] + w2 * C[2], k = y * W + x;
      if (z >= zb[k]) continue;
      zb[k] = z; mask[k] = 1;
      const i = k * 4; d[i] = cor[0]; d[i + 1] = cor[1]; d[i + 2] = cor[2];
    }
  }

  /** o painel: o planeta mais perto, a distância, a velocidade e a setinha */
  hud(ctx) {
    let melhor = null;
    for (const p of this.planetas) { const dist = len(sub(p.pos, this.pos)) - p.raio; if (!melhor || dist < melhor.dist) melhor = { p, dist }; }
    ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.fillRect(0, 0, W, 12);
    if (melhor) {
      drawText(ctx, `${melhor.p.nome}  ${Math.max(0, Math.round(melhor.dist))} MIL KM`, 4, 3, "#c8f0ff");
      // a setinha pra ele, quando está fora da tela
      const [x, y, z] = this.proj(melhor.p.pos);
      const fora = z <= 1 || x < 0 || x > W || y < 12 || y > H;
      if (fora) {
        let dx = x - W / 2, dy = y - H / 2;
        if (z <= 1) { dx = -dx; dy = -dy; }
        const a = Math.atan2(dy, dx), ex = W / 2 + Math.cos(a) * 100, ey = H / 2 + Math.sin(a) * 60;
        ctx.fillStyle = "#ffe060";
        for (let k = 0; k < 4; k++) ctx.fillRect(Math.round(ex - Math.cos(a) * k * 2), Math.round(ey - Math.sin(a) * k * 2), 3 - (k >> 1), 3 - (k >> 1));
      }
    }
    if (this.vel >= VMAX - 0.5 && !this.hiper && Math.floor(this.t * 3) % 2) drawText(ctx, DB.ESPACO.textos.hiper, W / 2 - 45, 20, "#80ffff");
    if (this.hiper) drawText(ctx, "HIPERESPAÇO!", W / 2 - 36, 20, "#80ffff");
    const v = `${Math.min(9999, Math.round(this.vel * 10))} KM/S`;
    drawText(ctx, v, W - 4 - v.length * 6, 3, PAL.glitch || "#ffe060");
    if (this.freando) drawText(ctx, "FREANDO!", W - 4 - v.length * 6 - 54, 3, "#ff6a6a");
    if (!this.dlg.active) { ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(0, H - 11, W, 11); drawText(ctx, DB.ESPACO.textos.ajuda, 4, H - 9, "#e0e8ff"); }
  }
}
