// A BATALHA EM TEMPO REAL, no jeito do POKÉMON LEGENDS: Z-A. Liga no OPÇÕES
// (BATALHA: TEMPO REAL, `flags.batalhaReal`, é do save).
//
// Não tem turno. A luta é numa arena vista de cima: você anda com o treinador
// (setas/WASD), o seu Pokémon vai junto, e cada golpe tem RECARGA — usou, ele
// fica um tempo esfriando (mais forte, mais tempo). O inimigo faz o mesmo, por
// conta própria, sem esperar você escolher nada.
//
//   1 2 3 4   usa o golpe        Z  usa o golpe marcado    C  marca o próximo
//   SHIFT     pulo pro lado (desvia)                       X  pausa: bola, poção, trocar, fugir
//
// Golpe FÍSICO é de perto: o bicho avança e bate (longe demais, não sai).
// ESPECIAL vira um tiro que voa até onde o alvo ESTAVA — dá pra sair da frente.
// De STATUS age na hora, se o alvo estiver perto. Antes de atacar, o inimigo
// PISCA: é o aviso pra desviar.
//
// Tudo o que não é a luta em si é da batalha de sempre (src/scenes/battle.js):
// a entrada, a captura, a EXP, o desmaio, a troca, o prêmio, as insígnias. Ela
// chama `iniciar` quando chegaria no menu de turno, e as falas pausam o tempo.
import { DB } from "../data/index.js";
import { Assets } from "../core/assets.js";
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { drawText, panel, bar, hpColor, PAL } from "../core/gfx.js";
import { reduzido } from "../core/reduzir.js";
import { calcDamage, accuracyCheck, applyMoveEffects, statusTickDamage, chooseAiMove, effectiveStat } from "./battle-engine.js";
import { isFainted, hpPct } from "./mon.js";
import { fatorDano } from "./dificuldade.js";
import { fator } from "./acampamento.js";

const W = 240, CAMPO = 112;                // a arena é a tela de cima; embaixo, o painel
const PERTO = 30, ALCANCE_FISICO = 64, ALCANCE_STATUS = 96;
const AVISO = 0.4;                          // quanto tempo o inimigo pisca antes de atacar

/** essa batalha pode ser em tempo real? (raid, totem e descontrolada têm regra própria) */
export function podeSerReal(b) {
  return !!b.st.flags?.batalhaReal && !b.raid && !b.totem && !b.descontrolada;
}

/** quanto o golpe demora pra voltar: mais forte, mais recarga */
const recarga = (mv) => (mv.category === "status" ? 3 : 1 + (mv.power || 40) / 55);
const tipoDoGolpe = (mv) => (mv.category === "status" ? "status" : mv.category === "especial" ? "tiro" : "perto");
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

/** a batalha chegou onde seria o menu de turno: liga (ou religa) a arena */
export function iniciar(b) {
  const novo = !b.arena;
  b.arena ||= { textos: [], tiros: [], tStatus: 0, t: 0 };
  const A = b.arena;
  // quem ENTROU AGORA começa no lugar dele (e com a recarga zerada); quem já
  // estava (voltando de uma poção, de uma bola que falhou) fica onde estava
  A.tr ||= { x: 46, y: 86, dir: "right", passo: 0, pulo: 0, tPulo: 0 };
  if (A.eu?.mon !== b.mine) A.eu = { x: A.tr.x + 22, y: A.tr.y - 12, cd: [0, 0, 0, 0], sel: 0, flash: 0, bote: null, mon: b.mine };
  if (A.ele?.mon !== b.foe) A.ele = { x: 178, y: 44, cd: [0, 0, 0, 0], flash: 0, bote: null, aviso: 0, golpe: null, mon: b.foe, pensa: 0.8 };
  A.eu.bote = null; A.ele.bote = null; A.ele.aviso = 0; A.ele.golpe = null; A.tiros = [];
  if (novo) texto(b, W / 2, CAMPO / 2, "TEMPO REAL!", "#ffe060", 1.4);
}

function texto(b, x, y, t, cor = "#fff", vida = 0.9) {
  b.arena.textos.push({ x, y, t, cor, vida, v: vida });
}

// ------------------------------------------------------------------- update
export function atualizar(b, dt) {
  const A = b.arena;
  if (!A) return;
  A.t += dt;
  // o painel de pausa e as falas param o tempo
  if (Input.consume("b")) return void b.run(pausa(b));
  const tr = A.tr, eu = A.eu, ele = A.ele;
  eu.mon = b.mine; ele.mon = b.foe;

  // o treinador anda; SHIFT dá o pulo (rápido, com recarga) pra desviar
  tr.tPulo = Math.max(0, tr.tPulo - dt);
  let vx = 0, vy = 0;
  if (Input.held("left")) vx--;
  if (Input.held("right")) vx++;
  if (Input.held("up")) vy--;
  if (Input.held("down")) vy++;
  if (vx || vy) {
    const n = Math.hypot(vx, vy);
    vx /= n; vy /= n;
    tr.dir = Math.abs(vx) > Math.abs(vy) ? (vx > 0 ? "right" : "left") : (vy > 0 ? "down" : "up");
    tr.passo += dt * 8;
  }
  if (Input.consume("run") && tr.tPulo <= 0 && (vx || vy)) { tr.pulo = 0.18; tr.tPulo = 0.9; Audio2.tone(520, 0.05, "square", 0.4); }
  const vel = tr.pulo > 0 ? 230 : 72;
  tr.pulo = Math.max(0, tr.pulo - dt);
  tr.x = Math.max(8, Math.min(W - 8, tr.x + vx * vel * dt));
  tr.y = Math.max(20, Math.min(CAMPO - 4, tr.y + vy * vel * dt));
  // FUGIR É SAIR PELA BEIRADA (só de selvagem): encostou na borda esquerda
  if (!b.trainer && tr.x <= 8 && vx < 0) return void b.run(fugir(b));

  // o seu Pokémon vai junto: um passo à frente do treinador, na direção do inimigo
  if (!eu.bote) {
    const ang = Math.atan2(ele.y - tr.y, ele.x - tr.x);
    const alvo = { x: tr.x + Math.cos(ang) * 22, y: tr.y - 10 + Math.sin(ang) * 14 };
    const pulo = tr.pulo > 0 ? 6 : 1;
    eu.x += (alvo.x - eu.x) * Math.min(1, dt * 5 * pulo);
    eu.y += (alvo.y - eu.y) * Math.min(1, dt * 5 * pulo);
  }

  // os golpes: 1-4 direto, ou Z no marcado (C troca o marcado)
  if (Input.consume("select")) eu.sel = (eu.sel + 1) % Math.max(1, b.mine.moves.length);
  for (let i = 0; i < 4; i++) if (Input.consomeTecla(`Digit${i + 1}`)) usar(b, "p", i);
  if (Input.consume("a")) usar(b, "p", eu.sel);

  pensarInimigo(b, dt);
  for (const q of [eu, ele]) {
    q.cd = q.cd.map((c) => Math.max(0, c - dt));
    q.flash = Math.max(0, q.flash - dt);
    if (q.bote) andarBote(b, q, dt);
  }
  andarTiros(b, dt);
  for (const t of A.textos) { t.vida -= dt; t.y -= dt * 14; }
  A.textos = A.textos.filter((t) => t.vida > 0);

  // veneno e queimadura doem a cada 4 s
  A.tStatus += dt;
  if (A.tStatus >= 4) {
    A.tStatus = 0;
    for (const [q, mon] of [[eu, b.mine], [ele, b.foe]]) {
      const d = statusTickDamage(mon);
      if (d > 0 && mon.hp > 0) { mon.hp = Math.max(0, mon.hp - d); texto(b, q.x, q.y - 20, `-${d}`, "#c080ff"); }
    }
  }
  b.disp.p = b.mine.hp; b.disp.f = b.foe.hp;
  if (isFainted(b.foe) || isFainted(b.mine)) b.run(b.checkFaints());
}

/** o inimigo: chega na distância boa pro golpe dele, pisca, e ataca */
function pensarInimigo(b, dt) {
  const { ele, eu } = b.arena;
  const mon = b.foe;
  const vel = 30 + Math.min(70, effectiveStat(mon, "spe", b.fStages) / 3);
  if (ele.aviso > 0) {                      // piscando: vai atacar
    ele.aviso -= dt;
    if (ele.aviso <= 0 && ele.golpe != null) { usar(b, "f", ele.golpe); ele.golpe = null; }
    return;
  }
  ele.pensa -= dt;
  if (ele.golpe == null && ele.pensa <= 0) {
    ele.pensa = 0.3;
    const ref = chooseAiMove(mon, b.mine, b.fStages, b.pStages, b.clima?.tipo);
    const i = ref ? mon.moves.indexOf(ref) : -1;
    if (i >= 0 && ele.cd[i] <= 0) ele.golpe = i;
  }
  // anda: de perto pra golpe físico, a meia distância pro resto
  const mv = ele.golpe != null ? DB.MOVES[mon.moves[ele.golpe].id] : null;
  const quer = mv && tipoDoGolpe(mv) === "perto" ? PERTO - 4 : 70;
  const d = dist(ele, eu);
  if (!ele.bote) {
    const sinal = d > quer + 6 ? 1 : d < quer - 10 ? -1 : 0;
    const ang = Math.atan2(eu.y - ele.y, eu.x - ele.x) + Math.sin(b.arena.t * 1.3) * 0.6 * (sinal ? 1 : 0);
    ele.x = Math.max(14, Math.min(W - 14, ele.x + Math.cos(ang) * vel * sinal * dt + (sinal ? 0 : Math.cos(b.arena.t * 2) * 12 * dt)));
    ele.y = Math.max(22, Math.min(CAMPO - 10, ele.y + Math.sin(ang) * vel * sinal * dt));
  }
  // na distância (ou o golpe é de status/tiro): pisca e ataca
  if (mv && (tipoDoGolpe(mv) !== "perto" || d <= ALCANCE_FISICO) && (tipoDoGolpe(mv) !== "status" || d <= ALCANCE_STATUS)) {
    ele.aviso = AVISO;
  }
}

/** usar o golpe `i` de quem (p = você, f = o inimigo) */
function usar(b, who, i) {
  const A = b.arena, q = who === "p" ? A.eu : A.ele, alvo = who === "p" ? A.ele : A.eu;
  const mon = who === "p" ? b.mine : b.foe;
  const slot = mon.moves[i];
  if (!slot) return;
  const mv = DB.MOVES[slot.id];
  if (q.cd[i] > 0 || q.bote) return;
  if (slot.pp <= 0) { if (who === "p") texto(b, q.x, q.y - 22, "SEM PP!", "#ff8080"); return; }
  const tipo = tipoDoGolpe(mv), d = dist(q, alvo);
  if (tipo === "perto" && d > ALCANCE_FISICO) { if (who === "p") texto(b, q.x, q.y - 22, "LONGE!", "#ffb060", 0.6); return; }
  if (tipo === "status" && d > ALCANCE_STATUS) { if (who === "p") texto(b, q.x, q.y - 22, "LONGE!", "#ffb060", 0.6); return; }
  slot.pp--;
  q.cd[i] = recarga(mv);
  texto(b, q.x, q.y - 24, mv.name, who === "p" ? "#ffffff" : "#ffb0b0", 0.8);
  if (tipo === "perto") {
    q.bote = { de: { x: q.x, y: q.y }, para: { x: alvo.x, y: alvo.y }, t: 0, golpe: slot.id, who, bateu: false };
    Audio2.tone(330, 0.05, "square", 0.5);
  } else if (tipo === "tiro") {
    const ang = Math.atan2(alvo.y - q.y, alvo.x - q.x);
    A.tiros.push({ x: q.x, y: q.y, vx: Math.cos(ang) * 150, vy: Math.sin(ang) * 150, vida: 1.4, golpe: slot.id, who,
                   cor: DB.TYPE_COLOR?.[mv.type] || "#fff" });
    Audio2.tone(660, 0.06, "triangle", 0.5);
  } else {
    acertar(b, who, slot.id);
  }
}

/** o bote do golpe físico: vai até o alvo, bate, e volta */
function andarBote(b, q, dt) {
  const bt = q.bote, A = b.arena;
  bt.t += dt / 0.32;
  const ida = bt.t < 0.5 ? bt.t * 2 : (1 - bt.t) * 2;
  const alvo = bt.who === "p" ? A.ele : A.eu;
  q.x = bt.de.x + (alvo.x - bt.de.x) * ida * 0.85;
  q.y = bt.de.y + (alvo.y - bt.de.y) * ida * 0.85;
  if (!bt.bateu && bt.t >= 0.5) {
    bt.bateu = true;
    // desviou? o alvo saiu de perto enquanto o bote vinha
    if (dist(q, alvo) <= PERTO + 8) acertar(b, bt.who, bt.golpe);
    else texto(b, alvo.x, alvo.y - 20, "DESVIOU!", "#80e0ff");
  }
  if (bt.t >= 1) { q.x = bt.de.x; q.y = bt.de.y; q.bote = null; }
}

function andarTiros(b, dt) {
  const A = b.arena;
  for (const t of A.tiros) {
    t.x += t.vx * dt; t.y += t.vy * dt; t.vida -= dt;
    const alvo = t.who === "p" ? A.ele : A.eu;
    if (dist(t, alvo) < 13) { t.vida = 0; acertar(b, t.who, t.golpe); }
    if (t.x < -10 || t.x > W + 10 || t.y < -10 || t.y > CAMPO + 10) t.vida = 0;
  }
  A.tiros = A.tiros.filter((t) => t.vida > 0);
}

/** o golpe pegou (ou errou): dano, efeito, números voando */
function acertar(b, who, golpeId) {
  const A = b.arena;
  const user = who === "p" ? b.mine : b.foe, target = who === "p" ? b.foe : b.mine;
  const uSt = who === "p" ? b.pStages : b.fStages, tSt = who === "p" ? b.fStages : b.pStages;
  const qa = who === "p" ? A.ele : A.eu;
  const mv = DB.MOVES[golpeId];
  if (user.hp <= 0 || target.hp <= 0) return;
  if (!accuracyCheck(golpeId, uSt, tSt)) return void texto(b, qa.x, qa.y - 20, "ERROU!", "#c0c0c0");
  if (mv.category !== "status") {
    const res = calcDamage(user, target, golpeId, uSt, tSt, b.clima?.tipo);
    if (res.dmg > 0) {
      const dano = Math.max(1, Math.round(res.dmg * fatorDano(who === "p")
        * (who === "p" ? fator(b.st, "ataque") : fator(b.st, "defesa"))));
      target.hp = Math.max(0, target.hp - dano);
      qa.flash = 0.35;
      b.shake = 0.12;
      Audio2.hit();
      texto(b, qa.x, qa.y - 16, `-${dano}`, res.crit ? "#ffe060" : "#ffffff");
      if (res.eff > 1) texto(b, qa.x, qa.y - 28, "SUPER EFETIVO!", "#ff9040", 1);
      else if (res.eff > 0 && res.eff < 1) texto(b, qa.x, qa.y - 28, "POUCO EFETIVO", "#a0a0c0", 1);
    } else if (res.eff === 0) texto(b, qa.x, qa.y - 20, "NÃO AFETA!", "#a0a0c0");
  }
  if (target.hp > 0) {
    for (const m of applyMoveEffects(mv, user, target, uSt, tSt) || []) texto(b, qa.x, qa.y - 34, String(m).slice(0, 22), "#c0e0ff", 1.2);
  }
}

// --------------------------------------------------------- pausa e fuga
async function pausa(b) {
  const opcoes = ["BOLA", "POÇÃO", "TROCAR", b.trainer ? null : "FUGIR", "VOLTAR"].filter(Boolean);
  const i = await b.ask("PAUSA. O QUE VAI FAZER?", opcoes);
  const o = opcoes[i];
  if (o === "BOLA") {
    if (b.trainer) { await b.say("NÃO DÁ PRA CAPTURAR O POKÉMON DE UM TREINADOR!"); return; }
    const bolas = ["master ball", "ultra ball", "great ball", "poké bola"].filter((x) => (b.st.items[x] || 0) > 0);
    if (!bolas.length) { await b.say("VOCÊ NÃO TEM BOLAS!"); return; }
    return b.tryCatch(pior(b, bolas));
  }
  if (o === "POÇÃO") return b.usePotion();
  if (o === "TROCAR") {
    const vivos = b.st.party.map((m, k) => [m, k]).filter(([m, k]) => !isFainted(m) && k !== b.playerIdx);
    if (!vivos.length) { await b.say("NÃO TEM MAIS NINGUÉM PRA LUTAR!"); return; }
    const k = await b.ask("QUEM ENTRA?", [...vivos.map(([m]) => `${m.nickname} N${m.level}`), "VOLTAR"]);
    if (vivos[k]) return b.switchTo(vivos[k][1]);
    return;
  }
  if (o === "FUGIR") return fugir(b);
}

/** a bola que vai: a mais barata que você tem (a MASTER fica guardada pro fim) */
function pior(b, bolas) {
  return bolas.filter((x) => x !== "master ball").pop() || bolas[0];
}

async function fugir(b) {
  if (b.trainer) return void (await b.say("NÃO DÁ PRA FUGIR DE UMA BATALHA CONTRA TREINADOR!"));
  Audio2.tone(440, 0.06); Audio2.tone(330, 0.08);
  await b.say("VOCÊ FUGIU!");
  await b.finish();
}

// ------------------------------------------------------------------- render
function sombra(ctx, x, y, w) {
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath(); ctx.ellipse(Math.round(x), Math.round(y), w, w * 0.35, 0, 0, Math.PI * 2); ctx.fill();
}

function desenhaBicho(ctx, b, q, mon, costas, lado) {
  if (!mon || mon.hp <= 0 && !q.flash) return;
  const anim = Assets.monAnim(mon, costas, b.t * 1000 + (costas ? 0 : 500));
  const img = anim || Assets.comCor(costas ? Assets.monBack(mon.species, mon.seed) : Assets.mon(mon.species, mon.seed), mon, costas);
  if (!img) return;
  const k = lado / Math.max(img.width, img.height);
  const w = Math.round(img.width * k), h = Math.round(img.height * k);
  sombra(ctx, q.x, q.y + 2, w * 0.35);
  if (q.flash > 0 && Math.floor(q.flash * 20) % 2) return;
  if (q.aviso > 0 && Math.floor(q.aviso * 16) % 2) {        // o aviso: pisca branco
    ctx.drawImage(Assets.silhueta(img), Math.round(q.x - w / 2), Math.round(q.y - h + 2), w, h);
    return;
  }
  ctx.drawImage(costas || anim ? img : reduzido(img, Math.max(w, h)), Math.round(q.x - w / 2), Math.round(q.y - h + 2), w, h);
}

export function desenhar(b, ctx) {
  const A = b.arena;
  // o campo: grama com tufos que não mexem
  ctx.fillStyle = b.isGlitch ? "#2a1846" : "#7cc45a";
  ctx.fillRect(0, 0, W, CAMPO);
  ctx.fillStyle = b.isGlitch ? "#3a2460" : "#68b04a";
  for (let i = 0; i < 70; i++) ctx.fillRect((i * 53) % W, (i * 37) % CAMPO, 2, 1);
  if (!b.trainer) { ctx.fillStyle = "rgba(0,0,0,0.12)"; ctx.fillRect(0, 0, 4, CAMPO); }   // a beirada de fuga

  // de cima pra baixo, quem está mais embaixo na frente
  const coisas = [
    { y: A.tr.y, f: () => {
      const set = Assets.actor("hero");
      const frames = set?.[A.tr.dir] || set?.down;
      sombra(ctx, A.tr.x, A.tr.y, 6);
      if (frames) ctx.drawImage(frames[Math.floor(A.tr.passo) % frames.length], Math.round(A.tr.x - 8), Math.round(A.tr.y - 30));
    } },
    { y: A.eu.y, f: () => desenhaBicho(ctx, b, A.eu, b.mine, true, 34) },
    { y: A.ele.y, f: () => desenhaBicho(ctx, b, A.ele, b.foe, false, b.foe?.alfa ? 46 : 38) },
  ].sort((a, c) => a.y - c.y);
  coisas.forEach((c) => c.f());

  for (const t of A.tiros) {
    ctx.fillStyle = t.cor;
    ctx.beginPath(); ctx.arc(Math.round(t.x), Math.round(t.y), 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.fillRect(Math.round(t.x) - 1, Math.round(t.y) - 1, 2, 2);
  }
  for (const t of A.textos) {
    ctx.globalAlpha = Math.min(1, t.vida / t.v * 2);
    const x = Math.round(t.x - t.t.length * 3);
    drawText(ctx, t.t, x + 1, Math.round(t.y) + 1, "#000");
    drawText(ctx, t.t, x, Math.round(t.y), t.cor);
  }
  ctx.globalAlpha = 1;

  // a vida do inimigo, em cima
  panel(ctx, 2, 2, 104, 18);
  drawText(ctx, `${b.foe.nickname.slice(0, 10)} N${b.foe.level}`, 8, 4, PAL.ink);
  bar(ctx, 8, 14, 92, 3, hpPct(b.foe), hpColor(hpPct(b.foe)));

  // o painel de baixo: o seu e os golpes com a recarga
  if (!b.dlg.active && !b.dlg.choice) {
    panel(ctx, 2, CAMPO, 236, 46);
    drawText(ctx, `${b.mine.nickname.slice(0, 10)} N${b.mine.level}`, 8, CAMPO + 4, PAL.ink);
    bar(ctx, 8, CAMPO + 15, 70, 4, hpPct(b.mine), hpColor(hpPct(b.mine)));
    drawText(ctx, `${b.mine.hp}/${b.mine.maxHp}`, 8, CAMPO + 22, PAL.ink2);
    drawText(ctx, "X PAUSA", 8, CAMPO + 33, PAL.ink2);
    b.mine.moves.forEach((slot, i) => {
      const mv = DB.MOVES[slot.id];
      const x = 84 + (i % 2) * 76, y = CAMPO + 4 + Math.floor(i / 2) * 20;
      const cd = A.eu.cd[i], total = recarga(mv);
      ctx.fillStyle = i === A.eu.sel ? "#ffe9a0" : "#e8e4f4";
      ctx.fillRect(x, y, 72, 17);
      if (cd > 0) { ctx.fillStyle = "rgba(60,50,90,0.45)"; ctx.fillRect(x, y, Math.round(72 * cd / total), 17); }
      ctx.fillStyle = DB.TYPE_COLOR?.[mv.type] || "#888";
      ctx.fillRect(x, y + 15, 72, 2);
      drawText(ctx, `${i + 1} ${mv.name.slice(0, 9)}`, x + 2, y + 1, slot.pp > 0 ? PAL.ink : "#a08080");
      drawText(ctx, `${slot.pp}`, x + 60, y + 8, PAL.ink2);
    });
  }
}
