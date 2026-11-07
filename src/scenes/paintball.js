// O PAINTBALL DE CELADON (ideia do CAIO): a arena vista de cima, dentro da
// loja de departamento. Do lado esquerdo VOCÊ (setas andam, Z atira) e 2
// Pokémon da sua equipe jogando sozinhos; do direito, um treinador e 2
// Pokémon dele. Cada bola de tinta que acerta pinta um pouco; com
// DB.PAINTBALL.tiros bolas o jogador fica todo pintado e sai. Ganha o time que
// sobrar (ou, no fim do tempo, o que levou menos tiro). O prêmio são FICHAS
// DO CASSINO (st.fichas). As regras e as falas estão em src/data/paintball.js.
import { DB } from "../data/index.js";
import { Assets } from "../core/assets.js";
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { drawText, fade, PAL } from "../core/gfx.js";
import { Dialogue } from "../systems/dialogue.js";
import { reduzido } from "../core/reduzir.js";

const W = 240, H = 160;
const TILE = 16;
const TOPO = 16;                                   // a faixa do placar em cima
const COLS = 15, ROWS = 9;                          // a arena: 240 x 144
const RAIO = 5;                                    // o "corpo" de cada um, pra bater em caixote
const BALA_VEL = 150, BALA_ALCANCE = 170;
const RECARGA_VOCE = 0.35;
// A IA DE CADA TIME: [0] = os seus Pokémon, [1] = o time do computador. O
// CAIO pediu o computador PIOR: atira menos, erra mais, enxerga mais perto,
// demora mais pra decidir e anda um pouco mais devagar.
const IA = [
  { recarga: [0.9, 1.5], erro: 0.35, alcance: 170, pensa: [0.4, 0.9], vel: 1 },
  { recarga: [1.8, 2.8], erro: 0.9, alcance: 110, pensa: [0.8, 1.6], vel: 0.8 },
];
// os CAIXOTES, simétricos pros dois lados ("#" = caixote)
const PLANTA = [
  "...............",
  "...#.......#...",
  "...#...#...#...",
  ".......#.......",
  "..#.........#..",          // (a coluna 1 e a 13 ficam livres: é onde os treinadores largam)
  ".......#.......",
  "...#...#...#...",
  "...#.......#...",
  "...............",
];

export class PaintballScene {
  enter(args = {}) {
    this.P = DB.PAINTBALL;
    this.T = this.P.texto;
    this.dlg = new Dialogue();
    this.t = 0;
    this.fadeA = 1; this.fadeDir = -1;
    this.fim = false;
    this.jogando = false;
    this.tempo = this.P.tempo;
    this.balas = [];
    this.manchas = [];                              // a tinta no chão
    this.caixas = [];
    PLANTA.forEach((linha, y) => [...linha].forEach((c, x) => { if (c === "#") this.caixas.push({ x, y }); }));
    this.rival = args.rival || this.P.rivais[Math.floor(Math.random() * this.P.rivais.length)];
    const meus = (args.mons || []).slice(0, 2);
    const meio = TOPO + (ROWS * TILE) / 2;
    // os dois times: [0] é o seu (esquerda), [1] o do rival (direita)
    this.gente = [
      this.treinador(0, "VOCÊ", "hero", 24, meio, true),
      ...meus.map((m, i) => this.bicho(0, m.species, m.seed, m.nickname, 24, meio + (i ? 52 : -52), m.stats?.spe)),
      this.treinador(1, this.rival.nome, this.rival.sprite, W - 24, meio, false),
      ...this.rival.mons.map((id, i) => this.bicho(1, id, 1000 + i, DB.SPECIES[id]?.name || id.toUpperCase(), W - 24, meio + (i ? 52 : -52), DB.SPECIES[id]?.base?.spe)),
    ];
    // ninguém começa dentro de caixote: quem caiu em cima de um vai pro lugar
    // livre mais perto (o CAIO ficou preso, com a planta antiga)
    for (const u of this.gente) this.desencalhar(u);
    this.voce = this.gente[0];
    this.recarga = 0;
    const mus = DB.MUSIC?.frTreinador;
    if (mus) Audio2.playMusic("frTreinador", mus);
    this.dlg.say(this.T.comeca.replace("{RIVAL}", this.rival.nome), () => { this.jogando = true; });
  }

  exit() {}
  get st() { return this.game.state; }

  treinador(time, nome, sprite, x, y, voce) {
    return { time, nome, sprite, x, y, dx: time ? -1 : 1, dy: 0, tiros: 0, fora: false, voce, treinador: true,
             vel: 52, recarga: 1 + Math.random(), pensa: 0, quer: { x: 0, y: 0 }, andou: 0 };
  }
  bicho(time, especie, seed, nome, x, y, spe = 60) {
    // o mais rápido anda mais rápido (até um limite: ninguém atravessa a arena num piscar)
    const vel = Math.max(38, Math.min(72, 34 + (spe || 60) * 0.35));
    return { time, nome, especie, seed, x, y, dx: time ? -1 : 1, dy: 0, tiros: 0, fora: false, voce: false,
             vel, recarga: 0.6 + Math.random(), pensa: 0, quer: { x: 0, y: 0 }, andou: 0 };
  }

  // --------------------------------------------------------------- mundo
  /** tem caixote (ou parede) no pixel (x, y)? */
  solido(x, y) {
    if (x < 0 || x >= W || y < TOPO || y >= H) return true;
    const cx = Math.floor(x / TILE), cy = Math.floor((y - TOPO) / TILE);
    return PLANTA[cy]?.[cx] === "#";
  }
  livre(x, y) {
    return !this.solido(x - RAIO, y - RAIO) && !this.solido(x + RAIO, y - RAIO)
      && !this.solido(x - RAIO, y + RAIO) && !this.solido(x + RAIO, y + RAIO);
  }
  /** procura em volta, de 4 em 4 pixels, o lugar livre mais perto */
  desencalhar(u) {
    if (this.livre(u.x, u.y)) return;
    for (let r = 4; r < 80; r += 4) {
      for (let a = 0; a < 16; a++) {
        const x = u.x + Math.cos(a * Math.PI / 8) * r, y = u.y + Math.sin(a * Math.PI / 8) * r;
        if (this.livre(x, y)) { u.x = x; u.y = y; return; }
      }
    }
  }
  /** anda o quanto der: se bater em X, ainda tenta Y (escorrega no caixote) */
  mover(u, vx, vy, dt) {
    const nx = u.x + vx * dt, ny = u.y + vy * dt;
    let andou = false;
    if (this.livre(nx, u.y)) { u.x = nx; andou = andou || vx !== 0; }
    if (this.livre(u.x, ny)) { u.y = ny; andou = andou || vy !== 0; }
    if (andou) u.andou += Math.hypot(vx, vy) * dt;
    return andou;
  }
  /** a linha de (a) até (b) passa por caixote? */
  limpo(a, b) {
    const d = Math.hypot(b.x - a.x, b.y - a.y), n = Math.ceil(d / 4);
    for (let i = 1; i < n; i++) {
      if (this.solido(a.x + (b.x - a.x) * i / n, a.y + (b.y - a.y) * i / n)) return false;
    }
    return true;
  }
  atirar(u, dx, dy) {
    const d = Math.hypot(dx, dy) || 1;
    this.balas.push({ x: u.x + dx / d * 6, y: u.y - 4 + dy / d * 6, vx: dx / d * BALA_VEL, vy: dy / d * BALA_VEL,
                      time: u.time, anda: 0 });
    Audio2.tone(u.time ? 520 : 760, 0.04, "square", 0.15);
  }
  mancha(x, y, time, r = 3 + Math.random() * 3) {
    this.manchas.push({ x, y, r, cor: time ? this.P.corEles : this.P.corVoce });
    if (this.manchas.length > 400) this.manchas.shift();
  }

  // --------------------------------------------------------------- update
  update(dt) {
    this.t += dt;
    if (this.fadeDir) {
      this.fadeA = Math.max(0, Math.min(1, this.fadeA + this.fadeDir * dt * 3));
      if (this.fadeDir < 0 && this.fadeA <= 0) this.fadeDir = 0;
      if (this.fadeDir > 0 && this.fadeA >= 1) return void this.game.scenes.pop();
    }
    if (this.dlg.update(dt)) return;
    if (!this.jogando || this.fim) return;

    this.tempo -= dt;
    if (this.aviso && (this.aviso.t -= dt) <= 0) this.aviso = null;
    this.updateVoce(dt);
    for (const u of this.gente) if (!u.voce && !u.fora) this.updateIA(u, dt);
    this.updateBalas(dt);

    const vivos = (time) => this.gente.filter((u) => u.time === time && !u.fora).length;
    if (!vivos(1)) return this.acabou("venceu");
    if (!vivos(0)) return this.acabou("perdeu");
    if (this.tempo <= 0) {
      const levou = (time) => this.gente.filter((u) => u.time === time).reduce((s, u) => s + u.tiros, 0);
      const a = levou(0), b = levou(1);
      return this.acabou(a < b ? "tempoVoce" : a > b ? "tempoEles" : "empate");
    }
  }

  updateVoce(dt) {
    const u = this.voce;
    this.recarga -= dt;
    if (u.fora) return;
    let vx = 0, vy = 0;
    if (Input.held("left")) vx -= 1;
    if (Input.held("right")) vx += 1;
    if (Input.held("up")) vy -= 1;
    if (Input.held("down")) vy += 1;
    if (vx || vy) {
      const d = Math.hypot(vx, vy);
      u.dx = vx / d; u.dy = vy / d;
      this.mover(u, u.dx * u.vel, u.dy * u.vel, dt);
      u.anda = true;
    } else u.anda = false;
    if (Input.consume("a") && this.recarga <= 0) {
      this.recarga = RECARGA_VOCE;
      this.atirar(u, u.dx, u.dy);
    }
  }

  /** O JOGADOR DA MÁQUINA: escolhe o inimigo mais perto, fica a uma distância
   *  boa dele (chega perto se está longe, anda de lado se está perto) e atira
   *  quando enxerga — com uma mira que erra um pouco. */
  updateIA(u, dt) {
    const ia = IA[u.time];
    u.recarga -= dt;
    u.pensa -= dt;
    const inimigos = this.gente.filter((o) => o.time !== u.time && !o.fora);
    if (!inimigos.length) return;
    const alvo = inimigos.reduce((m, o) => (Math.hypot(o.x - u.x, o.y - u.y) < Math.hypot(m.x - u.x, m.y - u.y) ? o : m));
    const dx = alvo.x - u.x, dy = alvo.y - u.y, dist = Math.hypot(dx, dy) || 1;
    if (u.pensa <= 0) {
      u.pensa = ia.pensa[0] + Math.random() * (ia.pensa[1] - ia.pensa[0]);
      const lado = Math.random() < 0.5 ? 1 : -1;
      if (dist > 80) u.quer = { x: dx / dist, y: dy / dist };                       // chega perto
      else if (dist < 40) u.quer = { x: -dx / dist, y: -dy / dist };                // se afasta
      else u.quer = { x: -dy / dist * lado, y: dx / dist * lado };                  // anda de lado
      if (Math.random() < 0.2) u.quer = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 };
    }
    const q = Math.hypot(u.quer.x, u.quer.y) || 1;
    if (!this.mover(u, u.quer.x / q * u.vel * ia.vel, u.quer.y / q * u.vel * ia.vel, dt)) u.pensa = 0;  // bateu: pensa de novo
    u.anda = true;
    u.dx = dx / dist; u.dy = dy / dist;
    if (u.recarga <= 0 && dist < ia.alcance && this.limpo(u, alvo)) {
      u.recarga = ia.recarga[0] + Math.random() * (ia.recarga[1] - ia.recarga[0]);
      const erro = (Math.random() - 0.5) * ia.erro;                                 // a mira treme
      const ang = Math.atan2(dy, dx) + erro;
      this.atirar(u, Math.cos(ang), Math.sin(ang));
    }
  }

  updateBalas(dt) {
    for (const b of this.balas) {
      b.x += b.vx * dt; b.y += b.vy * dt; b.anda += BALA_VEL * dt;
      if (this.solido(b.x, b.y) || b.anda > BALA_ALCANCE) {
        b.morta = true;
        this.mancha(b.x - b.vx * dt, b.y - b.vy * dt, b.time);
        continue;
      }
      const u = this.gente.find((o) => !o.fora && o.time !== b.time && Math.hypot(o.x - b.x, o.y - 4 - b.y) < 8);
      if (u) {
        b.morta = true;
        u.tiros++;
        this.mancha(u.x, u.y + 3, b.time, 4);
        Audio2.noise(0.06, 0.3);
        if (u.tiros >= this.P.tiros) this.saiu(u);
      }
    }
    this.balas = this.balas.filter((b) => !b.morta);
  }

  saiu(u) {
    u.fora = true;
    for (let i = 0; i < 5; i++) this.mancha(u.x + (Math.random() - 0.5) * 14, u.y + (Math.random() - 0.5) * 10, 1 - u.time, 3 + Math.random() * 4);
    Audio2.tone(200, 0.15, "sawtooth", 0.3);
    // um letreiro rápido, e não caixa de diálogo: o jogo não para
    this.aviso = { txt: this.T.saiu.replace("{NOME}", u.nome), t: 2 };
  }

  acabou(como) {
    this.fim = true;
    this.balas = [];
    const st = this.st;
    const fichas = como === "venceu" || como === "tempoVoce" ? this.P.premio : como === "empate" ? this.P.premioEmpate : 0;
    st.fichas = (st.fichas || 0) + fichas;
    if (fichas) Audio2.heal();
    this.game.autosave?.(true);
    const frase = this.T[como].replace("{RIVAL}", this.rival.nome).replace("{FICHAS}", fichas);
    this.dlg.say([frase, this.T.total.replace("{FICHAS}", st.fichas)], () => { this.fadeDir = 1; });
  }

  // --------------------------------------------------------------- desenho
  render(ctx) {
    // o chão da loja: piso claro em quadrados
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        ctx.fillStyle = (x + y) % 2 ? "#e2d8c2" : "#d8cdb4";
        ctx.fillRect(x * TILE, TOPO + y * TILE, TILE, TILE);
      }
    }
    // a linha do meio
    ctx.fillStyle = "#c2b597";
    ctx.fillRect(W / 2 - 1, TOPO, 2, ROWS * TILE);
    // a tinta no chão
    for (const m of this.manchas) {
      ctx.fillStyle = m.cor;
      ctx.globalAlpha = 0.75;
      ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(m.x - m.r - 1, m.y, 2, 1); ctx.fillRect(m.x + m.r, m.y - 1, 2, 1);
    }
    ctx.globalAlpha = 1;
    // os caixotes
    for (const c of this.caixas) {
      const x = c.x * TILE, y = TOPO + c.y * TILE;
      ctx.fillStyle = "#6b4426"; ctx.fillRect(x, y, TILE, TILE);
      ctx.fillStyle = "#a8703f"; ctx.fillRect(x + 1, y + 1, TILE - 2, TILE - 2);
      ctx.fillStyle = "#8a5a30"; ctx.fillRect(x + 1, y + 7, TILE - 2, 2); ctx.fillRect(x + 7, y + 1, 2, TILE - 2);
    }
    // a gente, de cima pra baixo
    for (const u of [...this.gente].sort((a, b) => a.y - b.y)) this.desenhaGente(ctx, u);
    // as bolas de tinta
    for (const b of this.balas) {
      ctx.fillStyle = "#000";
      ctx.fillRect(Math.round(b.x) - 2, Math.round(b.y) - 2, 4, 4);
      ctx.fillStyle = b.time ? this.P.corEles : this.P.corVoce;
      ctx.fillRect(Math.round(b.x) - 1, Math.round(b.y) - 1, 2, 2);
    }
    this.desenhaPlacar(ctx);
    if (this.aviso && !this.dlg.active) {
      const w = this.aviso.txt.length * 6 + 8;
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(W / 2 - w / 2, H - 22, w, 14);
      drawText(ctx, this.aviso.txt, W / 2 - w / 2 + 4, H - 19, "#ffffff");
    }
    this.dlg.render(ctx);
    if (this.fadeA > 0) fade(ctx, this.fadeA);
  }

  desenhaGente(ctx, u) {
    const x = Math.round(u.x), y = Math.round(u.y);
    ctx.globalAlpha = u.fora ? 0.45 : 1;
    // o anel do time no chão
    ctx.fillStyle = u.time ? this.P.corEles : this.P.corVoce;
    ctx.globalAlpha *= 0.6;
    ctx.beginPath(); ctx.ellipse(x, y + 5, 7, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = u.fora ? 0.45 : 1;
    if (u.treinador) {
      const sets = Assets.actor(u.sprite, u.voce);
      const dir = Math.abs(u.dx) > Math.abs(u.dy) ? (u.dx < 0 ? "left" : "right") : (u.dy < 0 ? "up" : "down");
      const set = sets?.[dir] || sets?.down;
      const passo = u.anda && !u.fora ? [1, 0, 3, 0][Math.floor(u.andou / 6) % 4] : 0;
      const img = set?.[passo] || set?.[0];
      if (img) ctx.drawImage(img, x - Math.round(img.width / 2), y + 6 - img.height);
    } else {
      const img = Assets.mon(u.especie, u.seed);
      if (img) {
        const pula = u.anda && !u.fora ? Math.abs(Math.sin(u.andou / 5)) * 2 : 0;
        // virado pro lado em que está olhando
        if (u.dx > 0.2) {
          ctx.save(); ctx.translate(x, 0); ctx.scale(-1, 1);
          ctx.drawImage(reduzido(img, 24), -12, y + 6 - 24 - pula, 24, 24);
          ctx.restore();
        } else ctx.drawImage(reduzido(img, 24), x - 12, y + 6 - 24 - pula, 24, 24);
      }
    }
    // a tinta que ele já levou: um respingo por tiro, da cor de quem atirou
    const cor = u.time ? this.P.corVoce : this.P.corEles;
    const LUGAR = [[-3, -8], [3, -3], [-1, 1], [4, -11], [-4, -2]];
    for (let i = 0; i < Math.min(u.tiros, LUGAR.length); i++) {
      ctx.fillStyle = "#000";
      ctx.fillRect(x + LUGAR[i][0] - 2, y + LUGAR[i][1] - 2, 5, 5);
      ctx.fillStyle = cor;
      ctx.fillRect(x + LUGAR[i][0] - 1, y + LUGAR[i][1] - 1, 3, 3);
    }
    ctx.globalAlpha = 1;
  }

  desenhaPlacar(ctx) {
    ctx.fillStyle = "#2b2f38";
    ctx.fillRect(0, 0, W, TOPO);
    // as bolinhas de cada um: cheia = no jogo, vazia = pintado
    const bolas = (time, x0, passo) => {
      this.gente.filter((u) => u.time === time).forEach((u, i) => {
        const x = x0 + i * passo;
        ctx.fillStyle = u.fora ? "#555b66" : (time ? this.P.corEles : this.P.corVoce);
        ctx.fillRect(x, 4, 8, 8);
        ctx.fillStyle = "#fff";
        for (let k = 0; k < Math.min(u.tiros, this.P.tiros); k++) ctx.fillRect(x + 1 + k * 2, 10, 1, 1);
      });
    };
    bolas(0, 4, 11);
    bolas(1, W - 4 - 8 - 2 * 11, 11);
    const s = Math.max(0, Math.ceil(this.tempo));
    const txt = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
    drawText(ctx, txt, W / 2 - txt.length * 3, 4, s <= 10 ? "#ff8a8a" : "#ffffff");
    if (this.voce.fora && !this.fim) drawText(ctx, "VOCÊ SAIU", 40, 4, "#ffd04a");
  }
}
