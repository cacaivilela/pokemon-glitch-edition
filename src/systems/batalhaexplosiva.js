// A BATALHA EXPLOSIVA, no jeito do SUPER SMASH BROS. — e com o cenário
// inteiro destrutível. Liga no OPÇÕES (BATALHA: EXPLOSIVA, `flags.batalhaExplosiva`).
//
// A luta é vista DE LADO, numa arena de terra com plataformas e paredes. Você
// controla o seu Pokémon direto, e TUDO apanha: o chão, a parede e, claro, o
// outro. O inimigo faz o mesmo, por conta própria.
//
//   ←/→   anda        ↑   pula (dá pra pular de novo no ar)     ↓   desce mais rápido
//   Z     usa o golpe marcado    C  marca o próximo    1 2 3 4  usa direto
//   SHIFT esquiva (um tiro rápido pro lado)            X  pausa: bola, poção, trocar, fugir
//
// Golpe FÍSICO: o bicho avança e bate — no inimigo e no que estiver na frente
// (quebra chão e parede). ESPECIAL: um projétil que EXPLODE onde bater, abre
// cratera e arremessa quem estiver perto (segurando ↑ ou ↓ ele sai na
// diagonal). STATUS: uma onda em volta que pega se o outro estiver perto.
// Quanto MENOS HP, mais longe o bicho voa quando apanha — e se o chão sumir e
// ele cair pra fora da arena, perde um bom pedaço de HP e volta caindo do alto.
//
// O resto é da batalha de sempre (src/scenes/battle.js): a entrada, a captura,
// a EXP, o desmaio, a troca, o prêmio. Ela chama `iniciar` quando chegaria no
// menu de turno, e as falas pausam o tempo.
import { DB } from "../data/index.js";
import { Assets } from "../core/assets.js";
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { drawText, panel, bar, hpColor, PAL } from "../core/gfx.js";
import { calcDamage, accuracyCheck, applyMoveEffects, statusTickDamage, effectiveStat } from "./battle-engine.js";
import { isFainted, hpPct } from "./mon.js";
import { fatorDano } from "./dificuldade.js";
import { fator } from "./acampamento.js";
import { pesoDe } from "./habilidades.js";

const W = 240, ALT = 124;                  // a arena; embaixo, o painel
const T = 4, COLS = W / T, LINS = ALT / T; // o terreno é uma grade de 4x4 px
const G = 520;                              // gravidade (px/s²)
const LARG = 12, ALTURA = 16;               // a caixa de colisão do bicho
const QUEDA = 0.3;                          // cair pra fora custa 30% do HP máximo

/** essa batalha pode ser explosiva? (raid, totem e descontrolada têm regra própria) */
export function podeSerExplosiva(b) {
  return !!b.st.flags?.batalhaExplosiva && !b.raid && !b.totem && !b.descontrolada;
}

const recarga = (mv) => (mv.category === "status" ? 2.6 : 0.7 + (mv.power || 40) / 70);
const corDoTipo = (tp) => DB.TYPE_COLOR?.[tp] || "#ffffff";

// ------------------------------------------------------------ o terreno
/** a arena: chão grosso com um morrinho, duas plataformas e duas paredes */
function montarTerreno(semente) {
  const t = new Uint8Array(COLS * LINS);
  const poe = (c, l, v = 1) => { if (c >= 0 && c < COLS && l >= 0 && l < LINS) t[l * COLS + c] = v; };
  for (let c = 0; c < COLS; c++) {
    const morro = Math.round(2 * Math.sin((c + semente) / 7));
    for (let l = 23 + morro; l < LINS; l++) poe(c, l, l === 23 + morro ? 2 : 1);   // 2 = grama
  }
  for (let c = 8; c < 20; c++) { poe(c, 13, 2); poe(c, 14); }          // plataforma esquerda
  for (let c = 40; c < 52; c++) { poe(c, 13, 2); poe(c, 14); }         // plataforma direita
  for (let l = 15; l < 23; l++) { poe(27, l); poe(28, l); poe(31, l); poe(32, l); }   // as duas paredes do meio
  return t;
}

const solido = (A, x, y) => {
  if (x < 0 || x >= W) return true;              // as bordas da tela seguram
  if (y < 0 || y >= ALT) return false;           // em cima e embaixo, vazio
  return A.terreno[Math.floor(y / T) * COLS + Math.floor(x / T)] > 0;
};

/** a caixa do bicho bate em terreno? */
function bate(A, x, y) {
  for (let dx = -LARG / 2; dx <= LARG / 2; dx += 3) {
    for (let dy = -ALTURA; dy <= -1; dy += 3) if (solido(A, x + dx, y + dy)) return true;
    if (solido(A, x + dx, y - 1)) return true;
  }
  return false;
}

/** EXPLODE: abre uma cratera de raio `r` (px) e solta os pedaços */
function cratera(A, x, y, r, cor = "#8a5a32") {
  const c0 = Math.floor((x - r) / T), c1 = Math.floor((x + r) / T);
  const l0 = Math.floor((y - r) / T), l1 = Math.floor((y + r) / T);
  let quebrou = 0;
  for (let l = l0; l <= l1; l++) for (let c = c0; c <= c1; c++) {
    if (c < 0 || c >= COLS || l < 0 || l >= LINS) continue;
    const cx = c * T + T / 2, cy = l * T + T / 2;
    if (Math.hypot(cx - x, cy - y) <= r && A.terreno[l * COLS + c]) {
      A.terreno[l * COLS + c] = 0;
      quebrou++;
      if (Math.random() < 0.5) A.cacos.push({ x: cx, y: cy, vx: (cx - x) * 4 + (Math.random() - 0.5) * 60, vy: -80 - Math.random() * 120, vida: 0.8, cor });
    }
  }
  // a grama fica por cima do que sobrou
  for (let c = Math.max(0, c0); c <= Math.min(COLS - 1, c1); c++) {
    for (let l = 0; l < LINS; l++) {
      const i = l * COLS + c;
      if (A.terreno[i]) { if (l > 0 && !A.terreno[i - COLS]) A.terreno[i] = 2; break; }
    }
  }
  return quebrou;
}

// ------------------------------------------------------------ a luta
/** a batalha chegou onde seria o menu de turno: liga (ou religa) a arena */
export function iniciar(b) {
  const novo = !b.explosiva;
  b.explosiva ||= { terreno: montarTerreno(Math.floor(Math.random() * 40)), tiros: [], cacos: [], textos: [], fumaca: [], tStatus: 0, t: 0 };
  const A = b.explosiva;
  // quem ENTROU AGORA começa no lugar dele; quem já estava (voltando de uma
  // poção, de uma bola que falhou) fica onde estava
  if (A.eu?.mon !== b.mine) A.eu = lutador(b.mine, 40, "right");
  if (A.ele?.mon !== b.foe) A.ele = { ...lutador(b.foe, 200, "left"), pensa: 0.9, aviso: 0, golpe: null };
  A.tiros = [];
  if (novo) texto(A, W / 2, 40, "BATALHA EXPLOSIVA!", "#ffb040", 1.6);
}

function lutador(mon, x, dir) {
  return { mon, x, y: 20, vx: 0, vy: 0, chao: false, pulos: 0, dir, cd: [0, 0, 0, 0], sel: 0,
           flash: 0, atordoado: 0, ataque: null, esquiva: 0, tEsquiva: 0, invul: 0, passo: 0 };
}

function texto(A, x, y, t, cor = "#fff", vida = 0.9) {
  A.textos.push({ x, y, t, cor, vida, v: vida });
}

export function atualizar(b, dt) {
  const A = b.explosiva;
  if (!A) return;
  dt = Math.min(dt, 1 / 30);
  A.t += dt;
  if (Input.consume("b")) return void b.run(pausa(b));
  const eu = A.eu, ele = A.ele;
  eu.mon = b.mine; ele.mon = b.foe;

  // VOCÊ: anda, pula, esquiva e bate
  if (eu.atordoado <= 0 && !eu.ataque) {
    let ir = 0;
    if (Input.held("left")) ir--;
    if (Input.held("right")) ir++;
    if (ir) { eu.dir = ir > 0 ? "right" : "left"; eu.passo += dt * 10; }
    const vel = 60 + Math.min(60, effectiveStat(b.mine, "spe", b.pStages) / 4);
    eu.vx = eu.esquiva > 0 ? eu.vx : ir * vel;
    if (Input.consume("up") && eu.pulos < 2) { eu.vy = eu.pulos ? -190 : -230; eu.pulos++; Audio2.tone(eu.pulos > 1 ? 660 : 520, 0.05, "square", 0.3); }
    if (Input.held("down") && !eu.chao) eu.vy += G * dt * 1.4;
    if (Input.consume("run") && eu.tEsquiva <= 0) {
      eu.esquiva = 0.18; eu.tEsquiva = 0.8; eu.invul = 0.25;
      eu.vx = (eu.dir === "right" ? 1 : -1) * 260;
      Audio2.tone(380, 0.05, "square", 0.3);
    }
    if (Input.consume("select")) eu.sel = (eu.sel + 1) % Math.max(1, b.mine.moves.length);
    for (let i = 0; i < 4; i++) if (Input.consomeTecla(`Digit${i + 1}`)) usar(b, "p", i);
    if (Input.consume("a")) usar(b, "p", eu.sel);
  }
  pensarInimigo(b, dt);
  for (const q of [eu, ele]) { q.vyAntes = q.vy; q.tPisao = Math.max(0, (q.tPisao || 0) - dt); andar(b, q, dt); }
  pisao(b, eu, ele, "p");
  pisao(b, ele, eu, "f");
  andarTiros(b, dt);
  for (const c of A.cacos) { c.vy += G * dt; c.x += c.vx * dt; c.y += c.vy * dt; c.vida -= dt; }
  A.cacos = A.cacos.filter((c) => c.vida > 0);
  for (const f of A.fumaca) { f.r += dt * 30; f.vida -= dt; }
  A.fumaca = A.fumaca.filter((f) => f.vida > 0);
  for (const t of A.textos) { t.vida -= dt; t.y -= dt * 14; }
  A.textos = A.textos.filter((t) => t.vida > 0);

  // veneno e queimadura doem a cada 4 s
  A.tStatus += dt;
  if (A.tStatus >= 4) {
    A.tStatus = 0;
    for (const q of [eu, ele]) {
      const d = statusTickDamage(q.mon);
      if (d > 0 && q.mon.hp > 0) { q.mon.hp = Math.max(0, q.mon.hp - d); texto(A, q.x, q.y - 22, `-${d}`, "#c080ff"); }
    }
  }
  b.disp.p = b.mine.hp; b.disp.f = b.foe.hp;
  if (isFainted(b.foe) || isFainted(b.mine)) b.run(b.checkFaints());
}

/** a física de um lutador: gravidade, terreno, ataque em andamento e a queda */
function andar(b, q, dt) {
  const A = b.explosiva;
  for (const k of ["flash", "atordoado", "esquiva", "tEsquiva", "invul"]) q[k] = Math.max(0, q[k] - dt);
  q.cd = q.cd.map((c) => Math.max(0, c - dt));
  if (q.ataque) {
    // o bote do golpe físico: avança, e a frente dele quebra tudo
    q.ataque.t -= dt;
    q.vx = (q.dir === "right" ? 1 : -1) * 200;
    const fx = q.x + (q.dir === "right" ? 10 : -10);
    if (cratera(A, fx, q.y - 8, 7)) b.shake = Math.max(b.shake, 0.05);
    const alvo = q === A.eu ? A.ele : A.eu;
    if (!q.ataque.acertou && Math.abs(alvo.x - fx) < 14 && Math.abs((alvo.y - 8) - (q.y - 8)) < 16) {
      q.ataque.acertou = true;
      acertar(b, q === A.eu ? "p" : "f", q.ataque.golpe, q.dir === "right" ? 1 : -1, -0.6);
    }
    if (q.ataque.t <= 0) { q.ataque = null; q.vx = 0; }
  }
  // atordoado (voando do golpe): sem atrito; senão o chão freia
  if (q.atordoado <= 0 && !q.ataque && q.esquiva <= 0 && q !== A.eu) q.vx *= Math.pow(0.02, dt);
  q.vy = Math.min(420, q.vy + G * dt);
  // anda em passinhos de 1 px pra não atravessar parede fina
  const passos = Math.ceil(Math.max(Math.abs(q.vx), Math.abs(q.vy)) * dt) || 1;
  const sx = (q.vx * dt) / passos, sy = (q.vy * dt) / passos;
  q.chao = false;
  for (let i = 0; i < passos; i++) {
    if (!bate(A, q.x + sx, q.y)) q.x += sx;
    else if (!bate(A, q.x + sx, q.y - 4)) { q.x += sx; q.y -= 4; }          // degrau
    else q.vx = q.atordoado > 0 ? -q.vx * 0.4 : 0;                       // parede: quica se voando
    if (!bate(A, q.x, q.y + sy)) q.y += sy;
    else { if (sy > 0) { q.chao = true; q.pulos = 0; } q.vy = 0; break; }
  }
  q.x = Math.max(LARG / 2, Math.min(W - LARG / 2, q.x));
  // CAIU PRA FORA: perde um pedaço do HP e volta do alto
  if (q.y > ALT + 40) {
    const mon = q.mon;
    const d = Math.max(1, Math.round(mon.maxHp * QUEDA));
    mon.hp = Math.max(0, mon.hp - d);
    Audio2.tone(200, 0.2, "sawtooth", 0.4);
    b.shake = 0.2;
    texto(A, W / 2, 30, `${mon.nickname} CAIU! -${d}`, "#ff6060", 1.4);
    q.x = W / 2 + (q === A.eu ? -30 : 30); q.y = -10; q.vx = 0; q.vy = 0; q.invul = 1.5; q.atordoado = 0;
  }
}

/** O PISÃO: cair em cima da cabeça do outro dói — e dói pelo PESO de quem
 *  caiu (src/data/pesos.js). Um PIDGEY quase não faz cócegas; um SNORLAX de
 *  460 kg afunda o outro no chão (acima de 100 kg, o chão embaixo racha). Quem
 *  pisou quica pra cima e ganha o pulo de volta. */
function pisao(b, pisa, alvo, who) {
  const A = b.explosiva;
  if (pisa.tPisao > 0 || alvo.invul > 0 || (pisa.vyAntes || 0) < 40) return;
  if (pisa.mon.hp <= 0 || alvo.mon.hp <= 0) return;
  const topo = alvo.y - ALTURA;
  if (Math.abs(pisa.x - alvo.x) > 11 || pisa.y < topo - 6 || pisa.y > topo + 9) return;
  const kg = pesoDe(pisa.mon.species);
  const dano = Math.max(1, Math.round((2 + Math.sqrt(kg) * 3) * (0.5 + pisa.mon.level / 50) * fatorDano(who === "p")));
  alvo.mon.hp = Math.max(0, alvo.mon.hp - dano);
  alvo.atordoado = 0.4; alvo.flash = 0.35; alvo.vy = 80; alvo.ataque = null;
  pisa.vy = -210; pisa.pulos = 1; pisa.tPisao = 0.35;
  if (kg >= 100) cratera(A, alvo.x, alvo.y + 2, 6 + Math.min(14, kg / 40));
  b.shake = Math.max(b.shake, Math.min(0.3, 0.08 + kg / 2000));
  Audio2.tone(Math.max(50, 160 - kg / 4), 0.12, "square", 0.5);
  texto(A, alvo.x, alvo.y - 24, `PISÃO! -${dano}`, "#ffd040", 1.1);
  texto(A, alvo.x, alvo.y - 36, `${kg} KG`, "#c0c0d0", 1.1);
}

/** usar um golpe: físico vira bote, especial vira tiro que explode, status vira onda */
function usar(b, who, i) {
  const A = b.explosiva;
  const q = who === "p" ? A.eu : A.ele;
  const golpe = q.mon.moves[i];
  if (!golpe || q.cd[i] > 0 || q.ataque) return;
  if (golpe.pp <= 0) { if (who === "p") texto(A, q.x, q.y - 26, "SEM PP!", "#c0c0c0"); return; }
  const mv = DB.MOVES[golpe.id];
  golpe.pp--;
  q.cd[i] = recarga(mv);
  if (mv.category === "fisico") {
    q.ataque = { golpe: golpe.id, t: 0.18, acertou: false };
    Audio2.tone(300, 0.06, "square", 0.4);
  } else if (mv.category === "especial") {
    // o inimigo mira torto: quase metade das vezes o tiro sai pro lado errado
    const mira = Math.sign(((q === A.eu ? A.ele : A.eu).y - q.y) / 40) | 0;
    const sobe = who === "p" ? (Input.held("up") ? -1 : Input.held("down") ? 1 : 0)
      : Math.random() < 0.45 ? [-1, 0, 1][Math.floor(Math.random() * 3)] : mira;
    const dx = q.dir === "right" ? 1 : -1;
    const n = Math.hypot(1, sobe * 0.7);
    A.tiros.push({ who, golpe: golpe.id, x: q.x + dx * 8, y: q.y - 9, vx: (dx * 190) / n, vy: (sobe * 0.7 * 190) / n,
                   cor: corDoTipo(mv.type), vida: 2, forca: mv.power || 50 });
    Audio2.tone(620, 0.05, "triangle", 0.4);
  } else {
    // STATUS: a onda em volta (pega se o outro estiver a 70 px)
    A.fumaca.push({ x: q.x, y: q.y - 8, r: 6, vida: 0.4, cor: corDoTipo(mv.type) });
    const alvo = q === A.eu ? A.ele : A.eu;
    if (Math.hypot(alvo.x - q.x, alvo.y - q.y) < 70) acertar(b, who, golpe.id, 0, 0);
    else texto(A, q.x, q.y - 26, "LONGE DEMAIS", "#a0a0c0");
  }
}

function andarTiros(b, dt) {
  const A = b.explosiva;
  for (const t of A.tiros) {
    t.vida -= dt;
    t.x += t.vx * dt; t.y += t.vy * dt;
    const alvo = t.who === "p" ? A.ele : A.eu;
    const naCara = Math.abs(alvo.x - t.x) < 10 && Math.abs(alvo.y - 8 - t.y) < 12;
    if (naCara || solido(A, t.x, t.y) || t.x < 0 || t.x > W || t.vida <= 0) {
      t.vida = 0;
      explodir(b, t);
    }
  }
  A.tiros = A.tiros.filter((t) => t.vida > 0);
}

/** o tiro estourou: cratera, fumaça, e quem estiver perto voa */
function explodir(b, t) {
  const A = b.explosiva;
  const r = 8 + Math.round(t.forca / 12);
  cratera(A, t.x, t.y, r);
  A.fumaca.push({ x: t.x, y: t.y, r: 4, vida: 0.45, cor: t.cor });
  b.shake = Math.max(b.shake, 0.14);
  Audio2.tone(90, 0.15, "sawtooth", 0.5);
  const alvo = t.who === "p" ? A.ele : A.eu;
  const d = Math.hypot(alvo.x - t.x, alvo.y - 8 - t.y);
  if (d < r + 10) acertar(b, t.who, t.golpe, Math.sign(alvo.x - t.x) || 1, -0.9, 1 - d / (r + 22));
}

/** o golpe pegou: dano da conta de sempre, e o ARREMESSO (maior com pouco HP) */
function acertar(b, who, golpeId, dirX, dirY, perto = 1) {
  const A = b.explosiva;
  const user = who === "p" ? b.mine : b.foe, target = who === "p" ? b.foe : b.mine;
  const uSt = who === "p" ? b.pStages : b.fStages, tSt = who === "p" ? b.fStages : b.pStages;
  const qa = who === "p" ? A.ele : A.eu;
  const mv = DB.MOVES[golpeId];
  if (user.hp <= 0 || target.hp <= 0 || qa.invul > 0) return;
  if (!accuracyCheck(golpeId, uSt, tSt)) return void texto(A, qa.x, qa.y - 24, "ERROU!", "#c0c0c0");
  if (mv.category !== "status") {
    const res = calcDamage(user, target, golpeId, uSt, tSt, b.clima?.tipo);
    if (res.dmg > 0) {
      const dano = Math.max(1, Math.round(res.dmg * Math.max(0.35, perto) * fatorDano(who === "p")
        * (who === "p" ? fator(b.st, "ataque") : fator(b.st, "defesa"))));
      target.hp = Math.max(0, target.hp - dano);
      // o ARREMESSO: mais forte quanto mais o golpe doeu e quanto menos HP sobrou
      const machucado = 1 + (1 - hpPct(target)) * 1.8;
      const forca = (90 + Math.min(160, (dano / target.maxHp) * 600)) * machucado;
      qa.vx = dirX * forca;
      qa.vy = dirY * forca * 0.9;
      qa.atordoado = 0.25 + machucado * 0.12;
      qa.flash = 0.35;
      qa.ataque = null;
      b.shake = Math.max(b.shake, 0.12);
      Audio2.hit();
      texto(A, qa.x, qa.y - 20, `-${dano}`, res.crit ? "#ffe060" : "#ffffff");
      if (res.eff > 1) texto(A, qa.x, qa.y - 32, "SUPER EFETIVO!", "#ff9040", 1);
      else if (res.eff > 0 && res.eff < 1) texto(A, qa.x, qa.y - 32, "POUCO EFETIVO", "#a0a0c0", 1);
    } else if (res.eff === 0) texto(A, qa.x, qa.y - 24, "NÃO AFETA!", "#a0a0c0");
  }
  if (target.hp > 0) {
    for (const m of applyMoveEffects(mv, user, target, uSt, tSt) || []) texto(A, qa.x, qa.y - 40, String(m).slice(0, 24), "#c0e0ff", 1.2);
  }
}

/** o inimigo: chega na distância do golpe dele, pula parede e buraco, pisca e bate */
function pensarInimigo(b, dt) {
  const A = b.explosiva, ele = A.ele, eu = A.eu;
  if (ele.atordoado > 0 || ele.ataque) return;
  const dx = eu.x - ele.x, dist = Math.abs(dx);
  ele.dir = dx > 0 ? "right" : "left";
  const golpes = b.foe.moves.map((g, i) => [g, i, DB.MOVES[g.id]]).filter(([g, i]) => g.pp > 0 && ele.cd[i] <= 0);
  const fisico = golpes.find(([, , mv]) => mv.category === "fisico");
  const especial = golpes.find(([, , mv]) => mv.category === "especial");
  const status = golpes.find(([, , mv]) => mv.category === "status");
  // o aviso: ele PISCA antes de bater — é a deixa pra esquivar
  if (ele.aviso > 0) {
    ele.aviso -= dt;
    ele.vx = 0;
    if (ele.aviso <= 0 && ele.golpe != null) { usar(b, "f", ele.golpe); ele.golpe = null; }
    return;
  }
  ele.pensa -= dt;
  // A IA É FRACA DE PROPÓSITO: anda devagar, demora pra pensar, avisa bem
  // antes de bater, se distrai, mira torto e às vezes cai no buraco
  const vel = 28 + Math.min(32, effectiveStat(b.foe, "spe", b.fStages) / 6);
  if (ele.parado > 0) { ele.parado -= dt; ele.vx = 0; return; }     // distraído
  let quer = especial && !fisico ? 90 : 18;              // a distância que ele quer
  if (fisico && especial) quer = b.foe.hp < b.foe.maxHp * 0.4 ? 90 : 18;
  ele.vx = dist > quer + 8 ? Math.sign(dx) * vel : dist < quer - 20 ? -Math.sign(dx) * vel * 0.7 : 0;
  // pula: parede na frente, buraco na frente, ou você lá em cima
  const frente = ele.x + Math.sign(ele.vx || dx) * 10;
  const parede = solido(A, frente, ele.y - 10);
  // só pula parede (buraco ele nem vê), e você lá em cima quase nunca
  if (ele.chao && (parede || (eu.y < ele.y - 30 && Math.random() < dt * 0.3))) { ele.vy = -200; ele.pulos = 1; }
  if (ele.pensa > 0) return;
  ele.pensa = 1.1 + Math.random() * 1.1;
  if (Math.random() < 0.35) { ele.parado = 0.6 + Math.random() * 0.8; return; }
  let escolha = null;
  if (fisico && dist < 34 && Math.abs(eu.y - ele.y) < 20) escolha = fisico;
  else if (especial && Math.abs(eu.y - ele.y) < 50) escolha = especial;
  else if (status && dist < 60 && Math.random() < 0.3) escolha = status;
  else if (fisico && parede) escolha = fisico;               // a parede atrapalha: ele quebra
  if (escolha) { ele.golpe = escolha[1]; ele.aviso = 0.7; }
}

// --------------------------------------------------------- pausa e fuga
async function pausa(b) {
  const opcoes = ["BOLA", "POÇÃO", "TROCAR", b.trainer ? null : "FUGIR", "VOLTAR"].filter(Boolean);
  const i = await b.ask("PAUSA. O QUE VAI FAZER?", opcoes);
  const o = opcoes[i];
  if (o === "BOLA") {
    if (b.trainer) { await b.say("NÃO DÁ PRA CAPTURAR O POKÉMON DE UM TREINADOR!"); return; }
    const bolas = ["poké bola", "great ball", "ultra ball", "master ball"].filter((x) => (b.st.items[x] || 0) > 0);
    if (!bolas.length) { await b.say("VOCÊ NÃO TEM BOLAS!"); return; }
    return b.tryCatch(bolas[0]);
  }
  if (o === "POÇÃO") return b.usePotion();
  if (o === "TROCAR") {
    const vivos = b.st.party.map((m, k) => [m, k]).filter(([m, k]) => !isFainted(m) && k !== b.playerIdx);
    if (!vivos.length) { await b.say("NÃO TEM MAIS NINGUÉM PRA LUTAR!"); return; }
    const k = await b.ask("QUEM ENTRA?", [...vivos.map(([m]) => `${m.nickname} N${m.level}`), "VOLTAR"]);
    if (vivos[k]) return b.switchTo(vivos[k][1]);
    return;
  }
  if (o === "FUGIR") {
    if (b.trainer) return void (await b.say("NÃO DÁ PRA FUGIR DE UMA BATALHA CONTRA TREINADOR!"));
    Audio2.tone(440, 0.06); Audio2.tone(330, 0.08);
    await b.say("VOCÊ FUGIU!");
    return b.finish();
  }
}

// ------------------------------------------------------------------- render
function desenhaLutador(ctx, b, q, costasNao) {
  const mon = q.mon;
  if (!mon || (mon.hp <= 0 && !q.flash)) return;
  if (q.invul > 0 && Math.floor(b.explosiva.t * 20) % 2) return;     // piscando depois de cair
  const anim = Assets.monAnim(mon, false, b.explosiva.t * 1000 + (q === b.explosiva.eu ? 0 : 500));
  const img = anim || Assets.comCor(Assets.mon(mon.species, mon.seed), mon);
  if (!img) return;
  const lado = 34;
  const k = Math.min(lado / img.width, lado / img.height);
  const w = Math.round(img.width * k), h = Math.round(img.height * k);
  // a sombra no chão embaixo dele
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(Math.round(q.x - w / 3), Math.round(q.y), Math.round((w * 2) / 3), 2);
  ctx.save();
  ctx.translate(Math.round(q.x), Math.round(q.y));
  // o sprite de frente olha pra esquerda; virado pra direita, espelha
  if (q.dir === "right") ctx.scale(-1, 1);
  const pulo = q.chao && Math.abs(q.vx) > 5 ? -Math.abs(Math.sin(q.passo)) * 2 : 0;
  // levou golpe: o próprio sprite acende (piscando)
  if (q.flash > 0 && Math.floor(q.flash * 30) % 2) ctx.filter = "brightness(2.6)";
  ctx.drawImage(img, -Math.round(w / 2), -h + pulo, w, h);
  ctx.filter = "none";
  ctx.restore();
  // o aviso do inimigo: um ! em cima
  if (q.aviso > 0) drawText(ctx, "!", Math.round(q.x - 2), Math.round(q.y - h - 10), "#ff4040", { shadow: "#000" });
}

export function desenhar(b, ctx) {
  const A = b.explosiva;
  // o céu
  const ceu = ctx.createLinearGradient(0, 0, 0, ALT);
  ceu.addColorStop(0, "#5a8ad8"); ceu.addColorStop(1, "#b8d8f0");
  ctx.fillStyle = ceu;
  ctx.fillRect(0, 0, W, ALT);
  ctx.fillStyle = "#1a0e08";                      // o fundo do buraco
  ctx.fillRect(0, ALT, W, 160 - ALT);
  // o terreno
  for (let l = 0; l < LINS; l++) for (let c = 0; c < COLS; c++) {
    const v = A.terreno[l * COLS + c];
    if (!v) continue;
    ctx.fillStyle = v === 2 ? "#58b040" : (c + l) % 3 ? "#8a5a32" : "#7a4e2a";
    ctx.fillRect(c * T, l * T, T, T);
  }
  // os tiros
  for (const t of A.tiros) {
    ctx.fillStyle = t.cor;
    ctx.fillRect(Math.round(t.x - 3), Math.round(t.y - 3), 6, 6);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(Math.round(t.x - 1), Math.round(t.y - 1), 2, 2);
  }
  desenhaLutador(ctx, b, A.ele);
  desenhaLutador(ctx, b, A.eu);
  // fumaça e caco
  for (const f of A.fumaca) {
    ctx.globalAlpha = Math.max(0, f.vida * 2);
    ctx.strokeStyle = f.cor; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(Math.round(f.x), Math.round(f.y), f.r, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  for (const c of A.cacos) { ctx.fillStyle = c.cor; ctx.fillRect(Math.round(c.x), Math.round(c.y), 2, 2); }
  for (const t of A.textos) {
    ctx.globalAlpha = Math.min(1, (t.vida / t.v) * 2);
    drawText(ctx, t.t, Math.round(t.x - t.t.length * 3), Math.round(t.y), t.cor, { shadow: "#000" });
    ctx.globalAlpha = 1;
  }
  // o painel: os dois HP e os seus golpes com a recarga
  panel(ctx, 0, ALT, W, 160 - ALT, { fill: "#1c1a28", edge: "#000", inner: "#3a3650" });
  for (const [q, x] of [[A.eu, 6], [A.ele, 124]]) {
    const mon = q.mon;
    drawText(ctx, `${mon.nickname}`.slice(0, 10), x, ALT + 4, q === A.eu ? "#80e0ff" : "#ff9080");
    drawText(ctx, `N${mon.level}`, x + 82, ALT + 4, "#c0c0d0");
    bar(ctx, x, ALT + 13, 108, 4, hpPct(mon), hpColor(hpPct(mon)));
  }
  b.mine.moves.forEach((g, i) => {
    const mv = DB.MOVES[g.id], x = 6 + i * 58, y = ALT + 21;
    const pronto = A.eu.cd[i] <= 0 && g.pp > 0;
    ctx.fillStyle = i === A.eu.sel ? "#4a4470" : "#2a2640";
    ctx.fillRect(x - 2, y - 2, 56, 11);
    ctx.fillStyle = corDoTipo(mv.type);
    ctx.fillRect(x - 2, y + 8, Math.round(54 * (1 - Math.min(1, A.eu.cd[i] / recarga(mv)))), 1);
    drawText(ctx, `${i + 1}${mv.name}`.slice(0, 9), x, y, pronto ? "#ffffff" : "#70708a");
  });
}
