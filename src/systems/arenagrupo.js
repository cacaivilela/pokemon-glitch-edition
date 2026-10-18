// AS BATALHAS EM GRUPO (duplas, trios e HORDA) em TEMPO REAL e EXPLOSIVA.
// Liga junto com o estilo de batalha do OPÇÕES (`flags.batalhaReal` /
// `flags.batalhaExplosiva`, é do save): o que vale pro um contra um
// (src/systems/batalhareal.js, src/systems/batalhaexplosiva.js) vale aqui,
// com todo mundo na mesma arena ao mesmo tempo.
//
// Você controla UM dos seus (o marcado com a setinha amarela); o outro da dupla
// e o do aliado lutam sozinhos, do seu lado. O alvo é sempre o inimigo mais
// perto (a setinha vermelha).
//
//   Q     passa o controle pro outro da dupla       X  pausa: poção, trocar, fugir
//   (o resto das teclas é o mesmo do estilo escolhido)
//
// O que muda com mais gente:
//   - GOLPE DE ÁREA (src/data/duplas.js, ESPALHA) vira uma ONDA em volta de
//     quem usou: pega todo inimigo que estiver perto — e, se for "todos"
//     (TERREMOTO, SURFAR), o seu parceiro também.
//   - Na EXPLOSIVA, o tiro estoura em quem estiver no raio: dá pra derrubar
//     metade da horda com uma bola bem colocada.
//   - Na HORDA eles não batem todos de uma vez: no máximo dois avisando ao
//     mesmo tempo (senão é só apanhar).
//
// O resto é da cena de grupo (src/scenes/grupobattle.js): a entrada, quem
// entra no lugar de quem caiu, a XP, o prêmio, a HORDA que vira um contra um
// quando sobra um (e lá as bolas funcionam). Ela chama `iniciar` quando
// chegaria no menu de turno; as falas pausam o tempo. O TOTEM fica por turno:
// provação tem regra própria. MEGA e CRISTAL Z também não entram na arena.
import { DB } from "../data/index.js";
import { Assets } from "../core/assets.js";
import { Input } from "../core/input.js";
import { Audio2 } from "../core/audio.js";
import { drawText, panel, bar, hpColor, PAL } from "../core/gfx.js";
import { reduzido } from "../core/reduzir.js";
import { calcDamage, accuracyCheck, applyMoveEffects, statusTickDamage, chooseAiMove, effectiveStat } from "./battle-engine.js";
import { curaDoTurno, pesoDe } from "./habilidades.js";
import { isFainted, hpPct } from "./mon.js";
import { fatorDano } from "./dificuldade.js";
import { fator } from "./acampamento.js";
import { ALT, T, COLS, LINS, G, LARG, ALTURA, QUEDA, montarTerreno, solido, bate, cratera } from "./batalhaexplosiva.js";

const W = 240, CAMPO = 112;                 // TEMPO REAL: a arena é a tela de cima
const PERTO = 30, ALCANCE_FISICO = 64, ALCANCE_STATUS = 96, ALCANCE_AREA = 70;

/** a batalha em grupo vira arena? qual? (o totem fica por turno) */
export function estiloDoGrupo(b) {
  if (b.totem) return null;
  const f = b.st.flags || {};
  return f.batalhaExplosiva ? "explosiva" : f.batalhaReal ? "real" : null;
}

const vivo = (q) => q && q.mon.hp > 0;
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const corDoTipo = (tp) => DB.TYPE_COLOR?.[tp] || "#ffffff";
const recarga = (A, mv) => A.estilo === "real"
  ? (mv.category === "status" ? 3 : 1 + (mv.power || 40) / 55)
  : (mv.category === "status" ? 2.6 : 0.7 + (mv.power || 40) / 70);
const tipoDoGolpe = (id, mv) => (DB.ESPALHA?.[id] ? "area" : mv.category === "status" ? "status"
  : mv.category === "especial" ? "tiro" : "perto");
const praSi = (mv) => mv.category === "status" && mv.stat?.target === "self";

const inimigos = (A, q) => A.lutadores.filter((o) => o.k !== q.k && vivo(o));
const maisPerto = (q, lista) => lista.reduce((m, o) => (!m || dist(q, o) < dist(q, m) ? o : m), null);
/** quem você controla agora (a vaga é o que fica: o bicho dela pode trocar) */
const controlado = (A) => A.lutadores.find((q) => q.v === A.controle && vivo(q)) || null;

function texto(A, x, y, t, cor = "#fff", vida = 0.9) {
  A.textos.push({ x, y, t, cor, vida, v: vida });
}

// ------------------------------------------------------------ montar
/** a batalha chegou onde seria o menu de turno: liga (ou religa) a arena */
export function iniciar(b) {
  const novo = !b.arenaG;
  const estilo = b.estilo;
  b.arenaG ||= {
    estilo, lutadores: [], tiros: [], textos: [], fumaca: [], cacos: [], t: 0, tStatus: 0, tClima: 0, controle: null,
    terreno: estilo === "explosiva" ? montarTerreno(Math.floor(Math.random() * 40)) : null,
    tr: estilo === "real" ? { x: 40, y: 92, dir: "right", passo: 0, pulo: 0, tPulo: 0 } : null,
  };
  const A = b.arenaG;
  sincronizar(b);
  for (const q of A.lutadores) { q.bote = null; q.ataque = null; q.aviso = 0; q.golpe = null; }
  A.tiros = [];
  if (novo) {
    const grupo = b.horda ? "HORDA" : b.n === 3 ? "TRIO" : "DUPLA";
    texto(A, W / 2, 40, estilo === "real" ? `${grupo} EM TEMPO REAL!` : `${grupo} EXPLOSIVA!`,
      estilo === "real" ? "#ffe060" : "#ffb040", 1.6);
  }
}

/** um lutador pra cada vaga ocupada: quem ENTROU AGORA nasce no lugar dele,
 *  quem já estava fica onde estava (voltando de uma poção, de uma fala) */
function sincronizar(b) {
  const A = b.arenaG, novos = [];
  for (const k of ["p", "f"]) {
    b.lado[k].forEach((v, i) => {
      const mon = b.monDe(k, v);
      if (!mon) return;
      const q = A.lutadores.find((x) => x.v === v);
      if (q && q.mon === mon) return void novos.push(q);
      if (!isFainted(mon)) novos.push(lutador(b, k, v, mon, i));
    });
  }
  A.lutadores = novos;
  const meus = novos.filter((q) => q.v.t === "p" && vivo(q));
  if (!meus.some((q) => q.v === A.controle)) A.controle = meus[0]?.v || null;
}

function lutador(b, k, v, mon, i) {
  const A = b.arenaG;
  const q = { k, v, mon, x: 0, y: 0, vx: 0, vy: 0, cd: [0, 0, 0, 0], sel: 0, flash: 0, aviso: 0, golpe: null,
              alvo: null, pensa: 0.7 + i * 0.4 + Math.random() * 0.4, parado: 0, bote: null, ataque: null,
              chao: false, pulos: 0, dir: k === "p" ? "right" : "left", atordoado: 0, esquiva: 0, tEsquiva: 0,
              invul: 0, passo: 0, tPisao: 0 };
  if (A.estilo === "real") {
    if (k === "p") { q.x = 62 + (i % 2) * 18; q.y = 52 + i * 26; }
    else { q.x = 196 - (i % 3) * 24 + (i > 2 ? 12 : 0); q.y = 30 + ((i * 31) % 70); }
  } else {
    q.x = k === "p" ? 30 + i * 22 : 210 - i * 24;
    q.y = 10 - i * 10;                                   // entram caindo do alto
  }
  return q;
}

// ------------------------------------------------------------ update
export function atualizar(b, dt) {
  const A = b.arenaG;
  if (!A) return;
  dt = Math.min(dt, 1 / 30);
  A.t += dt;
  if (Input.consume("b")) return void b.run(pausa(b));
  sincronizar(b);
  // Q: o controle passa pro outro dos SEUS (o do aliado é do aliado)
  if (Input.consume("z")) {
    const meus = A.lutadores.filter((q) => q.v.t === "p" && vivo(q));
    if (meus.length > 1) {
      const i = meus.findIndex((q) => q.v === A.controle);
      A.controle = meus[(i + 1) % meus.length].v;
      Audio2.tone(784, 0.05, "square", 0.35);
    }
  }
  const eu = controlado(A);
  if (A.estilo === "real") {
    if (controlarReal(b, eu, dt)) return;
    for (const q of A.lutadores) if (vivo(q) && q !== eu) pensarReal(b, q, dt);
    for (const q of A.lutadores) {
      q.cd = q.cd.map((c) => Math.max(0, c - dt));
      q.flash = Math.max(0, q.flash - dt);
      if (q.bote) andarBote(b, q, dt);
    }
    afastar(A, dt);
    tirosReal(b, dt);
  } else {
    controlarExplosiva(b, eu, dt);
    for (const q of A.lutadores) if (vivo(q) && q !== eu) pensarExplosiva(b, q, dt);
    for (const q of A.lutadores) { q.vyAntes = q.vy; q.tPisao = Math.max(0, q.tPisao - dt); andarExplosiva(b, q, dt); }
    for (const q of A.lutadores) for (const o of A.lutadores) if (q.k !== o.k) pisao(b, q, o);
    tirosExplosiva(b, dt);
    for (const c of A.cacos) { c.vy += G * dt; c.x += c.vx * dt; c.y += c.vy * dt; c.vida -= dt; }
    A.cacos = A.cacos.filter((c) => c.vida > 0);
  }
  for (const f of A.fumaca) { f.r += dt * (f.cresce || 30); f.vida -= dt; }
  A.fumaca = A.fumaca.filter((f) => f.vida > 0);
  for (const t of A.textos) { t.vida -= dt; t.y -= dt * 14; }
  A.textos = A.textos.filter((t) => t.vida > 0);

  // veneno e queimadura doem (e a habilidade cura) a cada 4 s
  A.tStatus += dt;
  if (A.tStatus >= 4) {
    A.tStatus = 0;
    for (const q of A.lutadores.filter(vivo)) {
      const d = statusTickDamage(q.mon);
      if (d > 0) { q.mon.hp = Math.max(0, q.mon.hp - d); texto(A, q.x, q.y - 22, `-${d}`, "#c080ff"); }
      const f = q.mon.hp > 0 ? curaDoTurno(q.mon, b.clima?.tipo) : 0;
      if (f > 0 && q.mon.hp < q.mon.maxHp) {
        const c = Math.max(1, Math.floor(q.mon.maxHp * f));
        q.mon.hp = Math.min(q.mon.maxHp, q.mon.hp + c);
        texto(A, q.x, q.y - 22, `+${c}`, "#80ffa0");
      }
    }
  }
  // o clima conta "turno" a cada 6 s (a TEMPESTADE não acaba)
  if (b.clima && b.clima.turnos !== Infinity) {
    A.tClima += dt;
    if (A.tClima >= 6) {
      A.tClima = 0;
      if (--b.clima.turnos <= 0) { texto(A, W / 2, 30, "O CLIMA VOLTOU AO NORMAL", "#c0e0ff", 1.4); b.clima = null; }
    }
  }
  for (const q of A.lutadores) q.v.disp = q.mon.hp;

  // alguém caiu: a arena para, e a cena de grupo faz o resto
  const caidos = A.lutadores.filter((q) => !vivo(q) && !q.caiu);
  if (caidos.length) {
    caidos.forEach((q) => { q.caiu = true; });
    b.run(caiu(b, caidos));
  }
}

/** quem caiu: a XP, quem entra no lugar, o fim (ou a HORDA que vira 1 contra 1) */
async function caiu(b, caidos) {
  // os de lá primeiro: se os dois lados caírem juntos, a XP vem antes da derrota
  caidos.sort((x, y) => (x.k === "f" ? -1 : 1) - (y.k === "f" ? -1 : 1));
  for (const q of caidos) await b.desmaiou(q.k, q.v);
  if (await b.acabou()) return;
  await b.reporVagas();
  if (await b.acabou()) return;
  if (b.horda && b.vivas("f").length === 1 && !b.banco("f").length) return b.sobrouUm();
  b.comecarEscolha();
}

/** o golpe pegou: a conta de sempre, os números voando e (na EXPLOSIVA) o arremesso */
function acertar(b, atk, alvoQ, golpeId, op = {}) {
  const A = b.arenaG;
  const user = atk.mon, target = alvoQ.mon, mv = DB.MOVES[golpeId];
  if (!mv || user.hp <= 0 || target.hp <= 0 || alvoQ.invul > 0) return;
  const uSt = atk.v.stages, tSt = alvoQ.v.stages;
  if (!praSi(mv) && !accuracyCheck(golpeId, uSt, tSt)) return void texto(A, alvoQ.x, alvoQ.y - 24, "ERROU!", "#c0c0c0");
  if (mv.category !== "status") {
    const res = calcDamage(user, target, golpeId, uSt, tSt, b.clima?.tipo);
    if (res.dmg > 0) {
      // o mesmo fator da batalha em grupo por turno: área tira 1/4, e os
      // sanduíches e a DIFICULDADE valem pro SEU lado
      let dano = res.dmg * (op.espalhado ? (DB.FORCA_ESPALHADA ?? 0.75) : 1) * Math.max(0.35, op.perto ?? 1);
      dano = Math.max(1, Math.round(dano * (atk.k === "p" ? fator(b.st, "ataque") * fatorDano(true) : 1)
                                        / (alvoQ.k === "p" ? fator(b.st, "defesa") : 1)
                                        * (alvoQ.k === "p" ? fatorDano(false) : 1)));
      target.hp = Math.max(0, target.hp - dano);
      alvoQ.flash = 0.35;
      b.shake = Math.max(b.shake, 0.12);
      Audio2.hit();
      texto(A, alvoQ.x, alvoQ.y - 20, `-${dano}`, res.crit ? "#ffe060" : alvoQ.k === atk.k ? "#ff8080" : "#ffffff");
      if (res.eff > 1) texto(A, alvoQ.x, alvoQ.y - 32, "SUPER EFETIVO!", "#ff9040", 1);
      else if (res.eff > 0 && res.eff < 1) texto(A, alvoQ.x, alvoQ.y - 32, "POUCO EFETIVO", "#a0a0c0", 1);
      if (mv.recoil && user.hp > 0) {
        const r = Math.max(1, Math.floor(dano * mv.recoil));
        user.hp = Math.max(0, user.hp - r);
        texto(A, atk.x, atk.y - 22, `RECUO -${r}`, "#ff8080");
      }
      if (A.estilo === "explosiva") {
        // o ARREMESSO: mais forte quanto mais doeu e quanto menos HP sobrou
        const machucado = 1 + (1 - hpPct(target)) * 1.8;
        const forca = (90 + Math.min(160, (dano / target.maxHp) * 600)) * machucado;
        alvoQ.vx = (op.dirX ?? (Math.sign(alvoQ.x - atk.x) || 1)) * forca;
        alvoQ.vy = (op.dirY ?? -0.6) * forca * 0.9;
        alvoQ.atordoado = 0.25 + machucado * 0.12;
        alvoQ.ataque = null;
        alvoQ.aviso = 0; alvoQ.golpe = null;       // apanhou: perdeu o golpe que ia dar
      }
    } else if (res.imune) {
      if (res.cura && target.hp < target.maxHp) {
        target.hp = Math.min(target.maxHp, target.hp + Math.ceil(target.maxHp * res.cura));
        texto(A, alvoQ.x, alvoQ.y - 20, "ABSORVEU!", "#80ffa0");
      } else texto(A, alvoQ.x, alvoQ.y - 20, "IMUNE!", "#a0a0c0");
      return;
    } else if (res.eff === 0) return void texto(A, alvoQ.x, alvoQ.y - 24, "NÃO AFETA!", "#a0a0c0");
  }
  if (target.hp > 0 || praSi(mv)) {
    for (const m of applyMoveEffects(mv, user, target, uSt, tSt) || []) {
      texto(A, alvoQ.x, alvoQ.y - 40, String(m).slice(0, 24), "#c0e0ff", 1.2);
    }
  }
}

/** golpe de clima (DANÇA DA CHUVA, DIA DE SOL) */
function mudarClima(b, tipo) {
  const A = b.arenaG, T2 = DB.CLIMA_TEXTO || {};
  if (b.clima?.turnos === Infinity && b.clima.tipo !== tipo) return void texto(A, W / 2, 30, "A TEMPESTADE NÃO DEIXA.", "#c0c0d0", 1.2);
  b.clima = { tipo, turnos: T2.turnos || 5 };
  A.tClima = 0;
  b.flash = tipo === "sol" ? 0.5 : 0.25;
  texto(A, W / 2, 30, tipo === "sol" ? "O SOL FICOU FORTE!" : "COMEÇOU A CHOVER!", "#c0e0ff", 1.4);
}

/** o começo de todo golpe: recarga, PP, paralisia. Devolve o golpe, ou null */
function preparar(b, q, i) {
  const A = b.arenaG;
  const slot = q.mon.moves[i];
  if (!slot || q.cd[i] > 0 || q.bote || q.ataque) return null;
  const eu = q === controlado(A);
  if (slot.pp <= 0) { if (eu) texto(A, q.x, q.y - 26, "SEM PP!", "#ff8080"); return null; }
  if (q.mon.status === "paralisia" && Math.random() < 0.25) {
    q.cd[i] = 0.8;
    texto(A, q.x, q.y - 26, "PARALISADO!", "#f0e040");
    return null;
  }
  return slot;
}

/** a ONDA dos golpes de área: todo inimigo perto (e o parceiro, se é "todos") */
function onda(b, q, golpeId, raio) {
  const A = b.arenaG, mv = DB.MOVES[golpeId];
  const todos = DB.ESPALHA?.[golpeId] === "todos";
  A.fumaca.push({ x: q.x, y: q.y - 8, r: 6, vida: 0.5, cor: corDoTipo(mv.type), cresce: raio * 2 });
  b.shake = Math.max(b.shake, 0.18);
  Audio2.tone(110, 0.2, "sawtooth", 0.5);
  for (const o of A.lutadores) {
    if (o === q || !vivo(o) || (o.k === q.k && !todos)) continue;
    if (dist(o, q) > raio) continue;
    acertar(b, q, o, golpeId, { espalhado: true, dirX: Math.sign(o.x - q.x) || 1, dirY: -0.8 });
  }
}

// ======================================================= TEMPO REAL
/** você anda com o treinador; o bicho que você controla vai junto */
function controlarReal(b, eu, dt) {
  const A = b.arenaG, tr = A.tr;
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
  // da HORDA dá pra fugir: é sair pela beirada esquerda
  if (b.horda && tr.x <= 8 && vx < 0) { b.run(b.fugirDaHorda()); return true; }
  if (!eu) return false;

  eu.alvo = maisPerto(eu, inimigos(A, eu));
  if (!eu.bote) {
    const ref = eu.alvo || { x: W, y: CAMPO / 2 };
    const ang = Math.atan2(ref.y - tr.y, ref.x - tr.x);
    const para = { x: tr.x + Math.cos(ang) * 22, y: tr.y - 10 + Math.sin(ang) * 14 };
    const k = Math.min(1, dt * 5 * (tr.pulo > 0 ? 6 : 1));
    eu.x += (para.x - eu.x) * k;
    eu.y += (para.y - eu.y) * k;
  }
  if (Input.consume("select")) eu.sel = (eu.sel + 1) % Math.max(1, eu.mon.moves.length);
  for (let i = 0; i < 4; i++) if (Input.consomeTecla(`Digit${i + 1}`)) usarReal(b, eu, i);
  if (Input.consume("a")) usarReal(b, eu, eu.sel);
  return false;
}

/** quantos do mesmo lado já estão avisando ou batendo (a HORDA espera a vez) */
const ocupados = (A, q) => A.lutadores.filter((o) => o.k === q.k && vivo(o) && (o.aviso > 0 || o.bote || o.ataque)).length;

/** a IA de todo mundo que você não controla (inimigo, parceiro, aliado) */
function pensarReal(b, q, dt) {
  const A = b.arenaG, mon = q.mon;
  const alvos = inimigos(A, q);
  if (!alvos.length || q.bote) return;
  if (!alvos.includes(q.alvo)) q.alvo = q.k === "f" && Math.random() < 0.3 ? alvos[Math.floor(Math.random() * alvos.length)] : maisPerto(q, alvos);
  const alvo = q.alvo;
  if (q.aviso > 0) {                      // piscando: vai atacar
    q.aviso -= dt;
    if (q.aviso <= 0 && q.golpe != null) { usarReal(b, q, q.golpe); q.golpe = null; }
    return;
  }
  q.pensa -= dt;
  if (q.golpe == null && q.pensa <= 0) {
    q.pensa = 0.3 + (b.horda && q.k === "f" ? Math.random() * 0.9 : 0);
    const ref = chooseAiMove(mon, alvo.mon, q.v.stages, alvo.v.stages, b.clima?.tipo);
    const i = ref ? mon.moves.indexOf(ref) : -1;
    if (i >= 0 && q.cd[i] <= 0) q.golpe = i;
  }
  const slot = q.golpe != null ? mon.moves[q.golpe] : null;
  const tipo = slot ? tipoDoGolpe(slot.id, DB.MOVES[slot.id]) : null;
  const quer = tipo === "perto" ? PERTO - 4 : tipo === "area" ? 40 : 70;
  const d = dist(q, alvo);
  const vel = 30 + Math.min(70, effectiveStat(mon, "spe", q.v.stages) / 3);
  const sinal = d > quer + 6 ? 1 : d < quer - 10 ? -1 : 0;
  const ang = Math.atan2(alvo.y - q.y, alvo.x - q.x) + Math.sin(A.t * 1.3 + q.pensa) * 0.6 * (sinal ? 1 : 0);
  q.x = Math.max(14, Math.min(W - 14, q.x + Math.cos(ang) * vel * sinal * dt + (sinal ? 0 : Math.cos(A.t * 2) * 12 * dt)));
  q.y = Math.max(22, Math.min(CAMPO - 10, q.y + Math.sin(ang) * vel * sinal * dt));
  if (!slot) return;
  if (b.horda && q.k === "f" && ocupados(A, q) >= 2) return;
  const mv = DB.MOVES[slot.id];
  const noAlcance = tipo === "perto" ? d <= ALCANCE_FISICO : tipo === "area" ? d <= ALCANCE_AREA - 10
    : tipo === "status" ? praSi(mv) || d <= ALCANCE_STATUS : true;
  if (noAlcance) q.aviso = q.k === "f" ? (b.horda ? 0.55 : 0.4) : 0.15;   // o aviso é pra você desviar
}

/** ninguém fica em cima de ninguém do mesmo lado */
function afastar(A, dt) {
  const vivos = A.lutadores.filter(vivo);
  for (const a of vivos) for (const c of vivos) {
    if (a === c || a.k !== c.k || a.bote || c.bote) continue;
    const d = dist(a, c);
    if (d > 0 && d < 20) { a.x += ((a.x - c.x) / d) * 30 * dt; a.y += ((a.y - c.y) / d) * 30 * dt; }
  }
}

function usarReal(b, q, i) {
  const A = b.arenaG;
  const slot = preparar(b, q, i);
  if (!slot) return;
  const mv = DB.MOVES[slot.id], tipo = tipoDoGolpe(slot.id, mv);
  const eu = q === controlado(A);
  const alvo = vivo(q.alvo) && q.alvo.k !== q.k ? q.alvo : maisPerto(q, inimigos(A, q));
  if (!alvo && !praSi(mv) && !mv.clima) return;
  const d = alvo ? dist(q, alvo) : 0;
  const longe = (tipo === "perto" && d > ALCANCE_FISICO) || (tipo === "status" && !praSi(mv) && !mv.clima && d > ALCANCE_STATUS);
  if (longe) { if (eu) texto(A, q.x, q.y - 22, "LONGE!", "#ffb060", 0.6); return; }
  slot.pp--;
  q.cd[i] = recarga(A, mv);
  texto(A, q.x, q.y - 24, mv.name, q.k === "p" ? "#ffffff" : "#ffb0b0", 0.8);
  if (mv.clima) return mudarClima(b, mv.clima);
  if (tipo === "area") return onda(b, q, slot.id, ALCANCE_AREA);
  if (tipo === "perto") {
    q.bote = { de: { x: q.x, y: q.y }, alvo, t: 0, golpe: slot.id, bateu: false };
    Audio2.tone(330, 0.05, "square", 0.5);
  } else if (tipo === "tiro") {
    const ang = Math.atan2(alvo.y - q.y, alvo.x - q.x);
    A.tiros.push({ x: q.x, y: q.y - 6, vx: Math.cos(ang) * 150, vy: Math.sin(ang) * 150, vida: 1.4, golpe: slot.id,
                   dono: q, cor: corDoTipo(mv.type) });
    Audio2.tone(660, 0.06, "triangle", 0.5);
  } else {
    acertar(b, q, praSi(mv) ? q : alvo, slot.id);
  }
}

/** o bote do golpe físico: vai até o alvo, bate, e volta */
function andarBote(b, q, dt) {
  const bt = q.bote, alvo = bt.alvo;
  bt.t += dt / 0.32;
  const ida = bt.t < 0.5 ? bt.t * 2 : (1 - bt.t) * 2;
  q.x = bt.de.x + (alvo.x - bt.de.x) * ida * 0.85;
  q.y = bt.de.y + (alvo.y - bt.de.y) * ida * 0.85;
  if (!bt.bateu && bt.t >= 0.5) {
    bt.bateu = true;
    if (vivo(alvo) && dist(q, alvo) <= PERTO + 8) acertar(b, q, alvo, bt.golpe);
    else if (vivo(alvo)) texto(b.arenaG, alvo.x, alvo.y - 20, "DESVIOU!", "#80e0ff");
  }
  if (bt.t >= 1) {
    if (q !== controlado(b.arenaG)) { q.x = bt.de.x; q.y = bt.de.y; }
    q.bote = null;
  }
}

/** o tiro voa reto e pega o primeiro do outro lado que encontrar */
function tirosReal(b, dt) {
  const A = b.arenaG;
  for (const t of A.tiros) {
    t.x += t.vx * dt; t.y += t.vy * dt; t.vida -= dt;
    const quem = A.lutadores.find((o) => o.k !== t.dono.k && vivo(o) && Math.hypot(o.x - t.x, o.y - 8 - t.y) < 13);
    if (quem) { t.vida = 0; acertar(b, t.dono, quem, t.golpe); }
    if (t.x < -10 || t.x > W + 10 || t.y < -10 || t.y > CAMPO + 10) t.vida = 0;
  }
  A.tiros = A.tiros.filter((t) => t.vida > 0);
}

// ======================================================= EXPLOSIVA
/** você controla o bicho direto: anda, pula, esquiva e bate */
function controlarExplosiva(b, eu, dt) {
  if (!eu || eu.atordoado > 0 || eu.ataque) return;
  let ir = 0;
  if (Input.held("left")) ir--;
  if (Input.held("right")) ir++;
  if (ir) { eu.dir = ir > 0 ? "right" : "left"; eu.passo += dt * 10; }
  const vel = 60 + Math.min(60, effectiveStat(eu.mon, "spe", eu.v.stages) / 4);
  eu.vx = eu.esquiva > 0 ? eu.vx : ir * vel;
  if (Input.consume("up") && eu.pulos < 2) { eu.vy = eu.pulos ? -190 : -230; eu.pulos++; Audio2.tone(eu.pulos > 1 ? 660 : 520, 0.05, "square", 0.3); }
  if (Input.held("down") && !eu.chao) eu.vy += G * dt * 1.4;
  if (Input.consume("run") && eu.tEsquiva <= 0) {
    eu.esquiva = 0.18; eu.tEsquiva = 0.8; eu.invul = 0.25;
    eu.vx = (eu.dir === "right" ? 1 : -1) * 260;
    Audio2.tone(380, 0.05, "square", 0.3);
  }
  eu.alvo = maisPerto(eu, inimigos(b.arenaG, eu));
  if (Input.consume("select")) eu.sel = (eu.sel + 1) % Math.max(1, eu.mon.moves.length);
  for (let i = 0; i < 4; i++) if (Input.consomeTecla(`Digit${i + 1}`)) usarExplosiva(b, eu, i);
  if (Input.consume("a")) usarExplosiva(b, eu, eu.sel);
}

/** o ponto (x, y) está dentro do desenho do bicho? */
function dentro(q, x, y, folga = 2) {
  const { w, h } = q.caixa || { w: 24, h: 28 };
  return Math.abs(x - q.x) <= w / 2 + folga && y >= q.y - h - folga && y <= q.y + folga;
}

/** a física: gravidade, terreno, o bote em andamento e a queda */
function andarExplosiva(b, q, dt) {
  const A = b.arenaG;
  for (const k of ["flash", "atordoado", "esquiva", "tEsquiva", "invul"]) q[k] = Math.max(0, q[k] - dt);
  q.cd = q.cd.map((c) => Math.max(0, c - dt));
  if (q.ataque) {
    // o bote: avança, e a frente dele quebra tudo — e bate em todo mundo do outro lado no caminho
    q.ataque.t -= dt;
    const dx = q.dir === "right" ? 1 : -1;
    q.vx = dx * 200;
    const fx = q.x + dx * 10;
    if (cratera(A, fx, q.y - 8, 7)) b.shake = Math.max(b.shake, 0.05);
    for (const o of A.lutadores) {
      if (o.k === q.k || !vivo(o) || q.ataque.pegou.includes(o)) continue;
      if (dentro(o, fx, q.y - 8, 6) || dentro(o, fx, q.y - 16, 6)) {
        q.ataque.pegou.push(o);
        acertar(b, q, o, q.ataque.golpe, { dirX: dx, dirY: -0.6 });
      }
    }
    if (q.ataque && q.ataque.t <= 0) { q.ataque = null; q.vx = 0; }
  }
  if (q.atordoado <= 0 && !q.ataque && q.esquiva <= 0 && q !== controlado(A)) q.vx *= Math.pow(0.02, dt);
  q.vy = Math.min(420, q.vy + G * dt);
  const passos = Math.ceil(Math.max(Math.abs(q.vx), Math.abs(q.vy)) * dt) || 1;
  const sx = (q.vx * dt) / passos, sy = (q.vy * dt) / passos;
  q.chao = false;
  for (let i = 0; i < passos; i++) {
    if (!bate(A, q.x + sx, q.y)) q.x += sx;
    else if (!bate(A, q.x + sx, q.y - 4)) { q.x += sx; q.y -= 4; }
    else q.vx = q.atordoado > 0 ? -q.vx * 0.4 : 0;
    if (!bate(A, q.x, q.y + sy)) q.y += sy;
    else { if (sy > 0) { q.chao = true; q.pulos = 0; } q.vy = 0; break; }
  }
  q.x = Math.max(LARG / 2, Math.min(W - LARG / 2, q.x));
  // CAIU PRA FORA: perde um pedaço do HP e volta do alto
  if (q.y > ALT + 40 && vivo(q)) {
    const d = Math.max(1, Math.round(q.mon.maxHp * QUEDA));
    q.mon.hp = Math.max(0, q.mon.hp - d);
    Audio2.tone(200, 0.2, "sawtooth", 0.4);
    b.shake = 0.2;
    texto(A, W / 2, 30, `${q.mon.nickname} CAIU! -${d}`, "#ff6060", 1.4);
    q.x = W / 2 + (q.k === "p" ? -30 : 30) + (Math.random() - 0.5) * 30; q.y = -10;
    q.vx = 0; q.vy = 0; q.invul = 1.5; q.atordoado = 0;
  }
}

/** O PISÃO: cair na cabeça de quem é do outro lado dói pelo PESO de quem caiu */
function pisao(b, pisa, alvo) {
  const A = b.arenaG;
  if (pisa.tPisao > 0 || alvo.invul > 0 || (pisa.vyAntes || 0) < 40 || !vivo(pisa) || !vivo(alvo)) return;
  const topo = alvo.y - ALTURA;
  if (Math.abs(pisa.x - alvo.x) > 11 || pisa.y < topo - 6 || pisa.y > topo + 9) return;
  const kg = pesoDe(pisa.mon.species);
  const dano = Math.max(1, Math.round((2 + Math.sqrt(kg) * 3) * (0.5 + pisa.mon.level / 50) * fatorDano(pisa.k === "p")));
  alvo.mon.hp = Math.max(0, alvo.mon.hp - dano);
  alvo.atordoado = 0.4; alvo.flash = 0.35; alvo.vy = 80; alvo.ataque = null; alvo.aviso = 0; alvo.golpe = null;
  pisa.vy = -210; pisa.pulos = 1; pisa.tPisao = 0.35;
  if (kg >= 100) cratera(A, alvo.x, alvo.y + 2, 6 + Math.min(14, kg / 40));
  b.shake = Math.max(b.shake, Math.min(0.3, 0.08 + kg / 2000));
  Audio2.tone(Math.max(50, 160 - kg / 4), 0.12, "square", 0.5);
  texto(A, alvo.x, alvo.y - 24, `PISÃO! -${dano}`, "#ffd040", 1.1);
}

/** a IA de lado: chega na distância do golpe, pula parede, pisca e bate. O
 *  inimigo é fraco de propósito (como no 1 contra 1); o seu parceiro, nem tanto */
function pensarExplosiva(b, q, dt) {
  const A = b.arenaG;
  if (q.atordoado > 0 || q.ataque) return;
  const alvos = inimigos(A, q);
  if (!alvos.length) return;
  if (!alvos.includes(q.alvo)) q.alvo = maisPerto(q, alvos);
  const alvo = q.alvo, deLa = q.k === "f";
  const dx = alvo.x - q.x, d = Math.abs(dx);
  q.dir = dx > 0 ? "right" : "left";
  if (q.aviso > 0) {
    q.aviso -= dt;
    q.vx = 0;
    if (q.aviso <= 0 && q.golpe != null) { usarExplosiva(b, q, q.golpe); q.golpe = null; }
    return;
  }
  q.pensa -= dt;
  const golpes = q.mon.moves.map((g, i) => [g, i, DB.MOVES[g.id]]).filter(([g, i]) => g.pp > 0 && q.cd[i] <= 0);
  const area = golpes.find(([g]) => DB.ESPALHA?.[g.id]);
  const fisico = golpes.find(([g, , mv]) => mv.category === "fisico" && !DB.ESPALHA?.[g.id]);
  const especial = golpes.find(([g, , mv]) => mv.category === "especial" && !DB.ESPALHA?.[g.id]);
  const status = golpes.find(([, , mv]) => mv.category === "status");
  const vel = (deLa ? 28 : 46) + Math.min(32, effectiveStat(q.mon, "spe", q.v.stages) / 6);
  if (q.parado > 0) { q.parado -= dt; q.vx = 0; return; }
  let quer = especial && !fisico ? 90 : 18;
  if (fisico && especial) quer = q.mon.hp < q.mon.maxHp * 0.4 ? 90 : 18;
  q.vx = d > quer + 8 ? Math.sign(dx) * vel : d < quer - 20 ? -Math.sign(dx) * vel * 0.7 : 0;
  const parede = solido(A, q.x + Math.sign(q.vx || dx) * 10, q.y - 10);
  if (q.chao && (parede || (alvo.y < q.y - 30 && Math.random() < dt * (deLa ? 0.3 : 1.2)))) { q.vy = -200; q.pulos = 1; }
  if (q.pensa > 0) return;
  q.pensa = deLa ? 1.1 + Math.random() * 1.1 : 0.6 + Math.random() * 0.5;
  if (deLa && Math.random() < 0.35) { q.parado = 0.6 + Math.random() * 0.8; return; }
  if (b.horda && deLa && ocupados(A, q) >= 2) return;
  const perto = alvos.filter((o) => dist(o, q) < 46).length;
  let escolha = null;
  if (area && (perto >= 2 || (perto >= 1 && Math.random() < 0.5))) escolha = area;
  else if (fisico && d < 34 && Math.abs(alvo.y - q.y) < 20) escolha = fisico;
  else if (especial && Math.abs(alvo.y - q.y) < 50) escolha = especial;
  else if (status && d < 60 && Math.random() < 0.3) escolha = status;
  else if (fisico && parede) escolha = fisico;
  if (escolha) { q.golpe = escolha[1]; q.aviso = deLa ? 0.7 : 0.2; }
}

function usarExplosiva(b, q, i) {
  const A = b.arenaG;
  const slot = preparar(b, q, i);
  if (!slot) return;
  const mv = DB.MOVES[slot.id], tipo = tipoDoGolpe(slot.id, mv);
  slot.pp--;
  q.cd[i] = recarga(A, mv);
  texto(A, q.x, q.y - 30, mv.name, q.k === "p" ? "#ffffff" : "#ffb0b0", 0.7);
  if (mv.clima) return mudarClima(b, mv.clima);
  const alvo = vivo(q.alvo) && q.alvo.k !== q.k ? q.alvo : maisPerto(q, inimigos(A, q));
  if (tipo === "area") {
    // ÁREA: a explosão é em volta de quem usou — e o chão em volta vai junto
    cratera(A, q.x, q.y + 2, 16);
    return onda(b, q, slot.id, 52);
  }
  if (tipo === "perto") {
    q.ataque = { golpe: slot.id, t: 0.18, pegou: [] };
    Audio2.tone(300, 0.06, "square", 0.4);
  } else if (tipo === "tiro") {
    const dx = q.dir === "right" ? 1 : -1;
    let sobe;
    if (q === controlado(A)) sobe = Input.held("up") ? -1 : Input.held("down") ? 1 : 0;
    else {
      const mira = alvo ? Math.sign(Math.round((alvo.y - q.y) / 40)) : 0;
      // o inimigo mira torto quase metade das vezes; o seu parceiro, não
      sobe = q.k === "f" && Math.random() < 0.45 ? [-1, 0, 1][Math.floor(Math.random() * 3)] : mira;
    }
    const n = Math.hypot(1, sobe * 0.7);
    A.tiros.push({ dono: q, golpe: slot.id, x: q.x + dx * 8, y: q.y - 9, vx: (dx * 190) / n, vy: (sobe * 0.7 * 190) / n,
                   cor: corDoTipo(mv.type), vida: 2, forca: mv.power || 50 });
    Audio2.tone(620, 0.05, "triangle", 0.4);
  } else {
    A.fumaca.push({ x: q.x, y: q.y - 8, r: 6, vida: 0.4, cor: corDoTipo(mv.type) });
    if (praSi(mv)) acertar(b, q, q, slot.id);
    else if (alvo && dist(alvo, q) < 70) acertar(b, q, alvo, slot.id, { dirX: 0, dirY: 0 });
    else texto(A, q.x, q.y - 26, "LONGE DEMAIS", "#a0a0c0");
  }
}

function tirosExplosiva(b, dt) {
  const A = b.arenaG;
  for (const t of A.tiros) {
    t.vida -= dt;
    const n = Math.max(1, Math.ceil(Math.hypot(t.vx, t.vy) * dt / 3));
    for (let k = 0; k < n && t.vida > 0; k++) {
      t.x += (t.vx * dt) / n; t.y += (t.vy * dt) / n;
      const naCara = A.lutadores.some((o) => o.k !== t.dono.k && vivo(o) && o.invul <= 0 && dentro(o, t.x, t.y));
      if (naCara || solido(A, t.x, t.y) || t.x < 0 || t.x > W) t.vida = 0;
    }
    if (t.vida <= 0) explodir(b, t);
  }
  A.tiros = A.tiros.filter((t) => t.vida > 0);
}

/** o tiro estourou: cratera, fumaça, e TODO MUNDO do outro lado no raio voa */
function explodir(b, t) {
  const A = b.arenaG;
  const r = 8 + Math.round(t.forca / 12);
  cratera(A, t.x, t.y, r);
  A.fumaca.push({ x: t.x, y: t.y, r: 4, vida: 0.45, cor: t.cor });
  b.shake = Math.max(b.shake, 0.14);
  Audio2.tone(90, 0.15, "sawtooth", 0.5);
  let quantos = 0;
  for (const o of A.lutadores) {
    if (o.k === t.dono.k || !vivo(o)) continue;
    const h = o.caixa?.h || 28;
    const d = dentro(o, t.x, t.y, 4) ? 0 : Math.hypot(o.x - t.x, o.y - h / 2 - t.y) - (o.caixa?.w || 24) / 2;
    if (d >= r + 6) continue;
    acertar(b, t.dono, o, t.golpe, { dirX: Math.sign(o.x - t.x) || 1, dirY: -0.9, perto: Math.min(1, 1 - Math.max(0, d) / (r + 22)) });
    quantos++;
  }
  if (quantos >= 2) texto(A, t.x, t.y - 30, `${quantos} DE UMA VEZ!`, "#ffd040", 1.2);
}

// --------------------------------------------------------- pausa
async function pausa(b) {
  const A = b.arenaG;
  const ask = (t, o) => new Promise((res) => b.dlg.ask(t, o, res));
  const opcoes = ["POÇÃO", "TROCAR", b.horda ? "FUGIR" : null, "VOLTAR"].filter(Boolean);
  const o = opcoes[await ask("PAUSA. O QUE VAI FAZER?", opcoes)];
  const i = b.lado.p.findIndex((v) => v === A.controle);
  if (o === "POÇÃO") {
    const mon = b.monDe("p", b.lado.p[i]);
    if ((b.st.items["poção"] || 0) <= 0) return void (await b.say("VOCÊ NÃO TEM POÇÕES!"));
    if (!mon || mon.hp >= mon.maxHp) return void (await b.say(`${mon?.nickname || "ELE"} JÁ ESTÁ COM O HP CHEIO!`));
    return b.pocao(i);
  }
  if (o === "TROCAR") {
    const banco = b.banco("p");
    if (i < 0 || !banco.length) return void (await b.say("NÃO TEM MAIS NINGUÉM PRA ENTRAR!"));
    const k = await ask("QUEM ENTRA?", [...banco.map(({ m }) => `${m.nickname} N${m.level}`), "VOLTAR"]);
    if (banco[k]) return b.trocar(i, banco[k].i);
    return;
  }
  if (o === "FUGIR") return b.fugirDaHorda();
}

// ------------------------------------------------------------------- render
function sombra(ctx, x, y, w) {
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath(); ctx.ellipse(Math.round(x), Math.round(y), w, w * 0.35, 0, 0, Math.PI * 2); ctx.fill();
}

/** a vidinha em cima da cabeça, e as setinhas: amarela = você, vermelha = o alvo */
function emCima(ctx, A, q, topo) {
  if (!vivo(q)) return;
  const pct = hpPct(q.mon), x = Math.round(q.x - 12), y = Math.round(topo - 5);
  ctx.fillStyle = "rgba(0,0,0,.55)";
  ctx.fillRect(x - 1, y - 1, 26, 4);
  bar(ctx, x, y, 24, 2, pct, hpColor(pct));
  const eu = controlado(A);
  const seta = q === eu ? "#ffd040" : eu && q === eu.alvo ? "#ff3030" : null;
  if (seta && Math.floor(A.t * 4) % 2 === 0) {
    ctx.fillStyle = seta;
    ctx.beginPath(); ctx.moveTo(q.x - 4, y - 7); ctx.lineTo(q.x + 4, y - 7); ctx.lineTo(q.x, y - 2); ctx.fill();
  }
}

function desenhaReal(ctx, b, q) {
  const A = b.arenaG, mon = q.mon;
  const costas = q.k === "p";
  ctx.globalAlpha = vivo(q) ? 1 : Math.max(0, q.v.sp?.alpha ?? 0);
  if (ctx.globalAlpha <= 0) return void (ctx.globalAlpha = 1);
  const anim = Assets.monAnim(mon, costas, A.t * 1000 + q.x * 37);
  const img = anim || Assets.comCor(costas ? Assets.monBack(mon.species, mon.seed) : Assets.mon(mon.species, mon.seed), mon, costas);
  if (!img) return void (ctx.globalAlpha = 1);
  const lado = b.horda && q.k === "f" ? 32 : 34;
  const k = lado / Math.max(img.width, img.height);
  const w = Math.round(img.width * k), h = Math.round(img.height * k);
  sombra(ctx, q.x, q.y + 2, w * 0.35);
  const pisca = q.flash > 0 && Math.floor(q.flash * 20) % 2;
  if (!pisca) {
    if (q.aviso > 0 && Math.floor(q.aviso * 16) % 2) ctx.drawImage(Assets.silhueta(img), Math.round(q.x - w / 2), Math.round(q.y - h + 2), w, h);
    else ctx.drawImage(costas || anim ? img : reduzido(img, Math.max(w, h)), Math.round(q.x - w / 2), Math.round(q.y - h + 2), w, h);
  }
  ctx.globalAlpha = 1;
  emCima(ctx, A, q, q.y - h);
}

function desenhaLado(ctx, b, q) {
  const A = b.arenaG, mon = q.mon;
  if (q.invul > 0 && Math.floor(A.t * 20) % 2) return;
  const alpha = vivo(q) ? 1 : Math.max(0, q.v.sp?.alpha ?? 0);
  if (alpha <= 0) return;
  const anim = Assets.monAnim(mon, false, A.t * 1000 + q.x * 37);
  const img = anim || Assets.comCor(Assets.mon(mon.species, mon.seed), mon);
  if (!img) return;
  const lado = b.horda && q.k === "f" ? 30 : 34;
  const k = Math.min(lado / img.width, lado / img.height);
  const w = Math.round(img.width * k), h = Math.round(img.height * k);
  q.caixa = { w: Math.max(12, w * 0.8), h: Math.max(14, h * 0.9) };
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(Math.round(q.x - w / 3), Math.round(q.y), Math.round((w * 2) / 3), 2);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(Math.round(q.x), Math.round(q.y));
  if (q.dir === "right") ctx.scale(-1, 1);
  const pulo = q.chao && Math.abs(q.vx) > 5 ? -Math.abs(Math.sin(q.passo)) * 2 : 0;
  if (q.flash > 0 && Math.floor(q.flash * 30) % 2) ctx.filter = "brightness(2.6)";
  ctx.drawImage(img, -Math.round(w / 2), -h + pulo, w, h);
  ctx.filter = "none";
  ctx.restore();
  if (q.aviso > 0 && q.k === "f") drawText(ctx, "!", Math.round(q.x - 2), Math.round(q.y - h - 16), "#ff4040", { shadow: "#000" });
  emCima(ctx, A, q, q.y - h);
}

function efeitos(ctx, A) {
  for (const f of A.fumaca) {
    ctx.globalAlpha = Math.max(0, Math.min(1, f.vida * 2));
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
}

export function desenhar(b, ctx) {
  const A = b.arenaG;
  if (A.estilo === "real") {
    ctx.fillStyle = b.isGlitch ? "#2a1846" : "#7cc45a";
    ctx.fillRect(0, 0, W, CAMPO);
    ctx.fillStyle = b.isGlitch ? "#3a2460" : "#68b04a";
    for (let i = 0; i < 70; i++) ctx.fillRect((i * 53) % W, (i * 37) % CAMPO, 2, 1);
    if (b.horda) { ctx.fillStyle = "rgba(0,0,0,0.12)"; ctx.fillRect(0, 0, 4, CAMPO); }
    const tr = A.tr;
    const coisas = [
      { y: tr.y, f: () => {
        const set = Assets.actor("hero");
        const frames = set?.[tr.dir] || set?.down;
        sombra(ctx, tr.x, tr.y, 6);
        if (frames) ctx.drawImage(frames[Math.floor(tr.passo) % frames.length], Math.round(tr.x - 8), Math.round(tr.y - 30));
      } },
      ...A.lutadores.map((q) => ({ y: q.y, f: () => desenhaReal(ctx, b, q) })),
    ].sort((a, c) => a.y - c.y);
    coisas.forEach((c) => c.f());
    for (const t of A.tiros) {
      ctx.fillStyle = t.cor;
      ctx.beginPath(); ctx.arc(Math.round(t.x), Math.round(t.y), 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.fillRect(Math.round(t.x) - 1, Math.round(t.y) - 1, 2, 2);
    }
  } else {
    const ceu = ctx.createLinearGradient(0, 0, 0, ALT);
    ceu.addColorStop(0, b.isGlitch ? "#2a1040" : "#5a8ad8"); ceu.addColorStop(1, b.isGlitch ? "#120820" : "#b8d8f0");
    ctx.fillStyle = ceu;
    ctx.fillRect(0, 0, W, ALT);
    ctx.fillStyle = "#1a0e08";
    ctx.fillRect(0, ALT, W, 160 - ALT);
    for (let l = 0; l < LINS; l++) for (let c = 0; c < COLS; c++) {
      const v = A.terreno[l * COLS + c];
      if (!v) continue;
      ctx.fillStyle = v === 2 ? "#58b040" : (c + l) % 3 ? "#8a5a32" : "#7a4e2a";
      ctx.fillRect(c * T, l * T, T, T);
    }
    for (const t of A.tiros) {
      ctx.fillStyle = t.cor;
      ctx.fillRect(Math.round(t.x - 3), Math.round(t.y - 3), 6, 6);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(Math.round(t.x - 1), Math.round(t.y - 1), 2, 2);
    }
    // os de lá atrás, os seus na frente, e quem você controla por cima de todos
    const eu = controlado(A);
    for (const q of A.lutadores.filter((q) => q.k === "f")) desenhaLado(ctx, b, q);
    for (const q of A.lutadores.filter((q) => q.k === "p" && q !== eu)) desenhaLado(ctx, b, q);
    if (eu) desenhaLado(ctx, b, eu);
  }
  efeitos(ctx, A);
  if (!b.dlg.active && !b.dlg.choice && !b.menu) painel(ctx, b);
}

/** o painel de baixo: quem você controla, os golpes com a recarga, e o resto */
function painel(ctx, b) {
  const A = b.arenaG, eu = controlado(A);
  const y0 = A.estilo === "real" ? CAMPO : ALT;
  const alto = 160 - y0;
  panel(ctx, 0, y0, W, alto, { fill: "#1c1a28", edge: "#000", inner: "#3a3650" });
  if (!eu) return;
  const mon = eu.mon;
  drawText(ctx, mon.nickname.slice(0, 10), 6, y0 + 4, "#80e0ff");
  drawText(ctx, `N${mon.level}`, 70, y0 + 4, "#c0c0d0");
  bar(ctx, 6, y0 + 13, 84, 4, hpPct(mon), hpColor(hpPct(mon)));
  // no meio: o parceiro (ou, sem parceiro, quantos sobram do outro lado)
  const outro = A.lutadores.find((q) => q.k === "p" && q !== eu && vivo(q));
  if (outro) {
    drawText(ctx, outro.mon.nickname.slice(0, 8), 100, y0 + 4, "#a0c0d0");
    bar(ctx, 100, y0 + 13, 50, 3, hpPct(outro.mon), hpColor(hpPct(outro.mon)));
    if (outro.v.t === "p") drawText(ctx, "Q TROCA", 166, y0 + 4, "#9090a8");
  } else {
    const deLa = A.lutadores.filter((q) => q.k === "f" && vivo(q)).length + b.banco("f").length + (b.trainer2 ? b.banco("g").length : 0);
    drawText(ctx, `RESTAM ${deLa}`, 100, y0 + 4, "#ff9080");
  }
  drawText(ctx, "X PAUSA", 166, y0 + 12, "#9090a8");
  const y = y0 + (A.estilo === "real" ? 26 : 22);
  mon.moves.forEach((g, i) => {
    const mv = DB.MOVES[g.id], x = 6 + i * 58;
    const pronto = eu.cd[i] <= 0 && g.pp > 0;
    ctx.fillStyle = i === eu.sel ? "#4a4470" : "#2a2640";
    ctx.fillRect(x - 2, y - 2, 56, A.estilo === "real" ? 16 : 11);
    ctx.fillStyle = corDoTipo(mv.type);
    ctx.fillRect(x - 2, y + 8, Math.round(54 * (1 - Math.min(1, eu.cd[i] / recarga(A, mv)))), 1);
    drawText(ctx, `${i + 1}${mv.name}`.slice(0, 9), x, y, pronto ? "#ffffff" : "#70708a");
    if (A.estilo === "real") drawText(ctx, `${g.pp}${DB.ESPALHA?.[g.id] ? " ÁREA" : ""}`, x, y + 9, DB.ESPALHA?.[g.id] ? "#e0524a" : "#9090a8");
  });
}
