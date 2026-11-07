// A LUTA NO MAPA: o novo estilo TEMPO REAL (pedido do CAIO, nov/2026). Com
// BATALHA: TEMPO REAL ligada no OPÇÕES, a luta contra selvagens e treinadores
// acontece no próprio mapa, sem abrir a tela de batalha:
//
//   1 2 3 4   quem te segue usa aquele golpe (K repete o último)
//   L         joga uma bola no selvagem mais perto
//
// Cada golpe tem RECARGA (mais forte, mais tempo). Quem te segue pula pra 1 tile
// na sua frente e bate, com a animação de ataque do MYSTERY DUNGEON. O inimigo
// anda até você, PISCA (é o aviso) e ataca do mesmo jeito. Caiu o seu, entra o
// próximo da equipe; caiu a equipe inteira, é o apagão de sempre.
//
// Quem luta fica em `ow.lutadores`: o selvagem sai de `ow.selvagens` e entra lá,
// e o treinador solta um Pokémon de cada vez do lado dele.
//
// Sem menu e sem tela de batalha, como no LEGENDS: Z-A. O que acontece depois da
// luta continua em src/scenes/battle.js, mas a cena entra TRANSPARENTE, só com as
// falas por cima do mapa (`capturadoNoMapa`, `venceuNoMapa`). Assim a Pokédex, as
// missões, o MURAL, as insígnias e a liga continuam num lugar só.
import { DB } from "../data/index.js";
import { Assets } from "../core/assets.js";
import { Audio2 } from "../core/audio.js";
import { Input } from "../core/input.js";
import { drawText, bar, hpColor } from "../core/gfx.js";
import { reduzido } from "../core/reduzir.js";
import { calcDamage, accuracyCheck, applyMoveEffects, chooseAiMove, catchAttempt, newStages } from "./battle-engine.js";
import { createMon, gainXp, xpYieldFor } from "./mon.js";
import { fatorDano } from "./dificuldade.js";
import { fator } from "./acampamento.js";
import { bonusDaBola } from "./bolas.js";
import { fatorCaptura, fatorXp } from "./pedras.js";
import { fatorXp as fatorXpItem } from "./segurar.js";
import { contarVitoria } from "./pesquisa.js";
import { contarSurto } from "./surtos.js";
import { garantirEspecie } from "./fusao.js";
import { linhaPMD } from "./roubopixels.js";

const TILE = 16, W = 240, H = 160;
const AVISO = 0.4;                 // quanto tempo o inimigo pisca antes de atacar
const BATE = 0.3;                  // o golpe acerta esse tempo depois de começar
const LONGE = 13;                  // selvagem a essa distância (em tiles) desiste
const recarga = (mv) => (mv.category === "status" ? 3 : 1 + (mv.power || 40) / 55);
const alcance = (mv) => (mv.category === "especial" ? 6 : mv.category === "status" ? 4 : 3);

export const ligada = (ow) => !!ow.st.flags?.batalhaReal;

/** esse selvagem luta no mapa? (a horda, o glitch e o MISSINGNO têm tela própria) */
export const podeLutar = (ow, b) => ligada(ow) && !b.horda && !b.glitch && !b.mon?.totem && !b.mon?.corrupt
  && b.mon?.species !== "missingno" && !!ow.quemSegue() && !ow.st.surfando && !ow.st.voando;

/** esse treinador luta no mapa? (dupla, espelho e quem não tem quem te siga: tela de sempre) */
export const podeLutarTreinador = (ow, trainer) => ligada(ow) && !trainer.dupla && !trainer.espelho && !ow.st.flags?.todasDuplas
  && (trainer.party || []).length > 0 && !!ow.quemSegue() && !ow.st.surfando && !ow.st.voando;

function estado(ow) {
  return (ow.luta ||= { sel: 0, cd: new WeakMap(), st: newStages(), textos: [], tiros: [], bola: null });
}
const cdDe = (L, mon) => { let c = L.cd.get(mon); if (!c) L.cd.set(mon, (c = [0, 0, 0, 0])); return c; };
const posJogador = (ow) => {
  const p = ow.st.player, s = ow.sub && ow.subMapa === p.map ? ow.sub : { x: 0, y: 0 };
  return { x: p.x + s.x / TILE, y: p.y + s.y / TILE };
};
function texto(L, x, y, t, cor = "#ffffff", vida = 0.9) { L.textos.push({ x, y, t, cor, vida, v: vida }); }

function lutador(mon, x, y, extra = {}) {
  return { mon, x, y, st: newStages(), cd: 0.6, aviso: 0, golpe: null, atk: null, flash: 0, ...extra };
}

/** o selvagem entra na luta (saiu da lista dos que andam no mato) */
export function comecar(ow, b) {
  if (b.lutando) return null;
  estado(ow);
  ow.selvagens = ow.selvagens.filter((o) => o !== b);
  ow.st.seen[b.mon.species] = true;
  for (const f of DB.GANCHOS?.encontrar || []) f(ow.st, b);
  const f = lutador(b.mon, b.x, b.y, { selvagem: true });
  (ow.lutadores ||= []).push(f);
  return f;
}

/** o treinador solta o primeiro Pokémon do lado dele */
export function comecarTreinador(ow, npc, key, trainer) {
  const L = estado(ow);
  const time = trainer.party.map((p) => {
    if (String(p.id).startsWith("fus-")) garantirEspecie(p.id);
    return createMon(p.id, p.lvl, { corrupt: !!p.corrupt, shiny: !!p.shiny });
  });
  L.treinador = { trainer, key, npc, time, i: 0 };
  ow.avisar(`${trainer.name}: VAI!`);
  soltarDoTreinador(ow);
}

function soltarDoTreinador(ow) {
  const L = ow.luta, T = L.treinador, mon = T.time[T.i], n = T.npc;
  ow.st.seen[mon.species] = true;
  const p = posJogador(ow);
  // do lado do treinador, um passo na sua direção
  const nx = n.fx ?? n.x, ny = n.fy ?? n.y, d = Math.hypot(p.x - nx, p.y - ny) || 1;
  (ow.lutadores ||= []).push(lutador(mon, nx + (p.x - nx) / d, ny + (p.y - ny) / d, { doTreinador: true }));
  Audio2.select();
  texto(L, nx, ny - 1, `VAI, ${mon.nickname}!`, "#ffe060", 1.2);
}

/** trocou de mapa: a luta acaba (o selvagem fica pra trás, o treinador espera) */
export function largarLuta(ow) {
  ow.lutadores = [];
  if (ow.luta) { ow.luta.treinador = null; ow.luta.bola = null; ow.luta.tiros = []; ow.luta.textos = []; }
}

const noMato = (ow, x, y) => {
  const t = ow.tagAt(Math.round(x), Math.round(y));
  return t === DB.TAG.FREE || t === DB.TAG.GRASS || t === DB.TAG.ICE;
};

/** o mais perto de você dentro de `raio` tiles: quem já luta primeiro; senão, o
 *  selvagem do mato (que entra na luta na hora) */
function alvoMaisPerto(ow, raio) {
  const p = posJogador(ow);
  const perto = (lista) => lista.map((o) => [o, Math.hypot(o.x - p.x, o.y - p.y)]).filter(([, d]) => d <= raio).sort((a, b) => a[1] - b[1])[0]?.[0];
  const f = perto((ow.lutadores || []).filter((o) => o.mon.hp > 0));
  if (f) return f;
  const b = perto((ow.selvagens || []).filter((o) => podeLutar(ow, o)));
  return b ? comecar(ow, b) : null;
}

/** K: quem te segue usa o golpe escolhido. Devolve false se não dá pra atacar. */
export function atacar(ow) {
  const L = estado(ow), mon = ow.quemSegue();
  if (!mon || !ow.compa || ow.compaAtaque || ow.st.surfando || ow.st.voando) return false;
  let i = L.sel;
  if (!mon.moves[i]) i = L.sel = 0;
  const g = mon.moves[i], mv = g && DB.MOVES[g.id];
  if (!mv) return false;
  const cd = cdDe(L, mon);
  if (cd[i] > 0) { Audio2.bump(); return true; }
  if (g.pp <= 0) { ow.avisar(`${mv.name} ESTÁ SEM PP!`); Audio2.bump(); return true; }
  const alvo = alvoMaisPerto(ow, alcance(mv));
  if (!alvo) { ow.avisar("NINGUÉM POR PERTO!"); return true; }
  g.pp--;
  cd[i] = recarga(mv);
  // vira pra quem vai apanhar
  const p = posJogador(ow), dx = alvo.x - p.x, dy = alvo.y - p.y;
  const dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up");
  ow.st.player.dir = dir;
  ow.compaAtacar();
  texto(L, p.x, p.y - 1.4, mv.name, "#c0e0ff", 0.8);
  L.golpe = { t: 0, mon, g: g.id, alvo, tiro: mv.category === "especial" };
  return true;
}

/** o golpe de `user` em `target`; `f` é o lutador inimigo */
function acertar(ow, L, f, user, target, id, meu) {
  const mv = DB.MOVES[id], uSt = meu ? L.st : f.st, tSt = meu ? f.st : L.st;
  const px = posJogador(ow), qx = meu ? f.x : px.x, qy = meu ? f.y : px.y;
  if (user.hp <= 0 || target.hp <= 0) return;
  if (!accuracyCheck(id, uSt, tSt)) return void texto(L, qx, qy - 1, "ERROU!", "#c0c0c0");
  if (mv.category !== "status") {
    const res = calcDamage(user, target, id, uSt, tSt, null);
    if (res.dmg > 0) {
      const dano = Math.max(1, Math.round(res.dmg * fatorDano(meu) * (meu ? fator(ow.st, "ataque") : fator(ow.st, "defesa"))));
      target.hp = Math.max(0, target.hp - dano);
      if (meu) f.flash = 0.35; else ow.tremor = Math.max(ow.tremor || 0, 0.3);
      Audio2.hit();
      texto(L, qx, qy - 1, `-${dano}`, res.crit ? "#ffe060" : "#ffffff");
      if (res.eff > 1) texto(L, qx, qy - 1.8, "SUPER EFETIVO!", "#ff9040", 1);
      else if (res.eff > 0 && res.eff < 1) texto(L, qx, qy - 1.8, "NÃO FOI MUITO EFETIVO", "#a0a0b0", 1);
    } else if (res.eff === 0) texto(L, qx, qy - 1, "NÃO AFETA!", "#a0a0b0");
  }
  if (target.hp > 0) for (const m of applyMoveEffects(mv, user, target, uSt, tSt) || []) texto(L, qx, qy - 2.4, String(m).slice(0, 24), "#c0e0ff", 1.2);
}

/** caiu o inimigo: EXP pra equipe, e o próximo do treinador (ou a vitória) */
function caiu(ow, L, f) {
  ow.lutadores = ow.lutadores.filter((o) => o !== f);
  const st = ow.st, ultimo = f.doTreinador && L.treinador && L.treinador.i >= L.treinador.time.length - 1;
  contarVitoria(st, f.mon, 1);       // (conta o último do treinador também: a cena transparente não conta)
  texto(L, f.x, f.y - 1, `${f.mon.nickname} DESMAIOU!`, "#ffe060", 1.3);
  Audio2.tone(180, 0.2, "square", 0.4);
  if (ultimo) {
    // a EXP do último quem paga é a tela da vitória (`venceuNoMapa`)
    const T = L.treinador;
    L.treinador = null;
    ow.vitoriaNoMapa(T);
    return;
  }
  if (!f.doTreinador) { const t = contarSurto(st, f.mon); if (t) ow.avisar(t); }
  const xp = Math.floor(xpYieldFor(f.mon) * (f.doTreinador ? 1.5 : 1) * fator(st, "xp") * fatorXp());
  const quem = DB.CONFIG?.shareXp !== false ? st.party.filter((m) => m.hp > 0) : [ow.quemSegue()].filter(Boolean);
  let falou = false;
  for (const m of quem) {
    for (const ev of gainXp(m, Math.floor(xp * fatorXpItem(m)))) {
      if (ev.type === "level") { Audio2.heal(); ow.avisar(`${m.nickname} SUBIU PARA O NÍVEL ${ev.level}!`); falou = true; }
      if (ev.type === "move") ow.avisar(`${m.nickname} APRENDEU ${DB.MOVES[ev.id].name}!`);
      if (ev.type === "moveFull") ow.avisar(`${m.nickname} JÁ SABE 4 GOLPES.`);
    }
  }
  if (!falou) { const p = posJogador(ow); texto(L, p.x, p.y - 1.4, `+${xp} EXP`, "#80f080", 1.1); }
  ow.game.autosave?.();
  if (f.doTreinador) { L.treinador.i++; soltarDoTreinador(ow); }
  else if (!ow.lutadores.length) ow.rodarEvolucao();
}

/** L: joga a primeira bola da mochila no selvagem mais perto */
export function jogarBola(ow) {
  const L = estado(ow);
  if (L.bola) return;
  const bola = (DB.BOLAS || []).find((b) => (ow.st.items[b.item] || 0) > 0)
    || ((ow.st.items["master ball"] || 0) > 0 ? { item: "master ball", label: "MASTER BALL", bonus: 255 } : null);
  if (!bola) return void ow.avisar("VOCÊ NÃO TEM POKÉ BOLAS!");
  const alvo = alvoMaisPerto(ow, 6);
  if (!alvo) return void ow.avisar("NINGUÉM POR PERTO!");
  if (alvo.doTreinador) { Audio2.bump(); return void ow.avisar("NÃO DÁ PRA PEGAR POKÉMON DE TREINADOR!"); }
  ow.st.items[bola.item] -= 1;
  if (ow.st.items[bola.item] <= 0) delete ow.st.items[bola.item];
  const mine = ow.quemSegue();
  const bonus = bonusDaBola(bola, { foe: alvo.mon, mine, st: ow.st, nTurno: 1 });
  const chacoalhadas = bola.item === "master ball" ? 4 : catchAttempt(alvo.mon, bonus * fatorCaptura());
  const p = posJogador(ow);
  L.bola = { t: 0, de: { x: p.x, y: p.y }, alvo, chacoalhadas, item: bola.item };
  alvo.preso = true;
  Audio2.tone(500, 0.08, "square", 0.3);
  ow.avisar(`VOCÊ JOGOU ${bola.label}!`);
}

function andarBola(ow, L, dt) {
  const B = L.bola;
  B.t += dt;
  // voa 0,4 s; depois cada chacoalhada leva 0,5 s
  const n = Math.floor((B.t - 0.4) / 0.5);
  if (n >= 0 && n !== B.som && n < Math.min(3, B.chacoalhadas)) { B.som = n; Audio2.tone(300 + n * 60, 0.08); }
  const fim = 0.4 + Math.min(3, B.chacoalhadas) * 0.5 + 0.2;
  if (B.t < fim) return;
  L.bola = null;
  if (B.chacoalhadas >= 4) {
    ow.lutadores = ow.lutadores.filter((o) => o !== B.alvo);
    Audio2.heal();
    ow.capturaNoMapa(B.alvo.mon);
    return;
  }
  B.alvo.preso = false;
  B.alvo.cd = 0.3;
  ow.avisar(["OH, NÃO! O POKÉMON ESCAPOU!", "DROGA! QUASE!", "ARGH! QUASE PEGUEI!"][Math.min(B.chacoalhadas, 2)]);
}

/** o inimigo: anda até você, pisca e ataca */
function andarInimigo(ow, L, f, dt, mine) {
  f.flash = Math.max(0, f.flash - dt);
  if (f.preso) return;
  const p = posJogador(ow), dx = p.x - f.x, dy = p.y - f.y, d = Math.hypot(dx, dy) || 0.01;
  f.vx = dx; f.vy = dy;
  if (f.atk) {
    f.atk.t += dt;
    if (!f.atk.bateu && f.atk.t >= BATE) {
      f.atk.bateu = true;
      if (d <= alcance(DB.MOVES[f.atk.id]) + 1.5) acertar(ow, L, f, f.mon, mine, f.atk.id, false);
      else texto(L, p.x, p.y - 1, "DESVIOU!", "#80f0ff");
    }
    if (f.atk.t > 0.8) { f.atk = null; f.cd = recarga(DB.MOVES[f.golpe || "investida"] || { power: 40 }); f.golpe = null; }
    return;
  }
  if (f.aviso > 0) {
    f.aviso -= dt;
    if (f.aviso <= 0) {
      const sp = DB.SPECIES[f.mon.species], base = DB.SPECIES[sp?.fusao?.cabeca || f.mon.species];
      f.atk = { t: 0, id: f.golpe, n: base?.spriteDex || base?.dex, t0: performance.now() / 1000 };
      const g = f.mon.moves.find((m) => m.id === f.golpe);
      if (g && g.pp > 0) g.pp--;
    }
    return;
  }
  f.cd -= dt;
  if (!f.golpe) f.golpe = chooseAiMove(f.mon, mine, f.st, L.st, null)?.id || null;
  const mv = f.golpe && DB.MOVES[f.golpe], quer = mv ? alcance(mv) - 1 : 1.5;
  f.andou = d > quer;
  if (d > quer) {
    const v = Math.min(4, 2 + (f.mon.stats?.spe || 50) / 60) * dt;
    const nx = f.x + dx / d * v, ny = f.y + dy / d * v;
    if (noMato(ow, nx, f.y)) f.x = nx;
    if (noMato(ow, f.x, ny)) f.y = ny;
  } else if (mv && f.cd <= 0) f.aviso = AVISO;
}

/** todo quadro, com o jogador livre: as teclas, as recargas, os inimigos */
export function andarLuta(ow, dt) {
  if (!ligada(ow)) return;
  const L = estado(ow);
  // os NÚMEROS são as teclas de atacar: cada um usa o golpe dele na hora
  for (let i = 0; i < 4; i++) if (Input.consomeTecla(`Digit${i + 1}`)) { L.sel = i; atacar(ow); }
  if (Input.consomeTecla("KeyL")) jogarBola(ow);
  for (const m of ow.st.party) { const c = L.cd.get(m); if (c) for (let i = 0; i < 4; i++) c[i] = Math.max(0, c[i] - dt); }
  for (const t of L.textos) t.v -= dt;
  L.textos = L.textos.filter((t) => t.v > 0);
  if (L.bola) andarBola(ow, L, dt);
  // o seu golpe: acerta um instante depois de sair
  if (L.golpe) {
    L.golpe.t += dt;
    if (L.golpe.t >= BATE) {
      const G = L.golpe; L.golpe = null;
      if (G.alvo.mon.hp > 0 && ow.lutadores?.includes(G.alvo)) acertar(ow, L, G.alvo, G.mon, G.alvo.mon, G.g, true);
    }
  }
  const lista = ow.lutadores || [];
  if (!lista.length) return;
  const mine = ow.quemSegue();
  if (!mine) return ow.equipeCaiuNoMapa();
  const hpAntes = mine.hp, p = posJogador(ow);
  for (const f of [...lista]) {
    if (f.mon.hp <= 0) { caiu(ow, L, f); continue; }
    // selvagem que ficou pra trás desiste (o do treinador, não)
    if (f.selvagem && Math.hypot(f.x - p.x, f.y - p.y) > LONGE) { ow.lutadores = ow.lutadores.filter((o) => o !== f); continue; }
    andarInimigo(ow, L, f, dt, mine);
  }
  if (hpAntes > 0 && mine.hp <= 0) {
    texto(L, p.x, p.y - 1.4, `${mine.nickname} DESMAIOU!`, "#ff8080", 1.3);
    Audio2.tone(140, 0.25, "square", 0.4);
    const prox = ow.quemSegue();
    if (prox) ow.avisar(`VAI, ${prox.nickname}!`);
    else ow.equipeCaiuNoMapa();
  }
}

// OS BICHOS NO JEITO DO MYSTERY DUNGEON: durante a luta, andar e parado também
// são os do PMD (tools/pmd/baixar_movimento.py), não só o golpe. Fusão, shiny e
// luminoso têm cor e forma próprias: esses ficam com o sprite deles.
const MOV = { idx: null, pedindo: false, imgs: {} };
function pedirMovimento() {
  if (MOV.pedindo) return;
  MOV.pedindo = true;
  fetch("assets/sprites/pmd/movimento.json").then((r) => r.json()).then((j) => { MOV.idx = j; }).catch(() => { MOV.idx = {}; });
}
const numeroPMD = (mon) => {
  const sp = DB.SPECIES[mon.species];
  if (!sp || sp.fusao || mon.shiny || mon.luminoso || mon.corrupt) return null;
  return sp.spriteDex || sp.dex || null;
};
/** desenha `mon` andando ou parado no jeito do PMD, com o pé em (px, py); false = não tem */
export function desenharMovimentoPMD(ctx, mon, anda, t, vx, vy, px, py) {
  pedirMovimento();
  const n = numeroPMD(mon), reg = n && MOV.idx?.[n];
  if (!reg) return false;
  const tipo = anda && reg.anda ? "anda" : reg.parado ? "parado" : "anda", info = reg[tipo];
  if (!info) return false;
  const chave = `${tipo}/${n}`;
  let img = MOV.imgs[chave];
  if (!img) { img = MOV.imgs[chave] = new Image(); img.src = `assets/sprites/pmd/${chave}.png`; }
  if (!img.complete || !img.naturalWidth) return false;
  const [w, h, dur] = info, total = dur.reduce((a, b) => a + b, 0);
  let k = Math.floor(t * 60) % total, q = 0;
  for (let i = 0; i < dur.length; i++) { if (k < dur[i]) { q = i; break; } k -= dur[i]; }
  ctx.drawImage(img, q * w, linhaPMD(vx, vy) * h, w, h, Math.round(px - w / 2), Math.round(py - h / 2 - 4), w, h);
  return true;
}
/** tem luta acontecendo agora? (quem te segue também fica no jeito do PMD) */
export const emLuta = (ow) => ligada(ow) && !!ow.lutadores?.length;

/** quem luta entra na fila dos atores (pra ficar na frente/atrás certo) */
export function atoresDaLuta(ow, actors, ctx, cx, cy) {
  for (const f of ow.lutadores || []) {
    actors.push({ x: f.x, y: f.y, dir: "down", draw: (c = ctx) => desenharLutador(ow, c, f, cx, cy) });
  }
}

function desenharLutador(ow, ctx, f, cx, cy) {
  const X = Math.round(f.x * TILE - cx + 8), Y = Math.round(f.y * TILE - cy + 12);
  const L = ow.luta;
  if (L?.bola?.alvo === f && L.bola.t >= 0.4) return;       // está dentro da bola
  let foi = false;
  if (f.atk) foi = ow.desenharAtaquePMD(ctx, f.atk.n, f.atk.t, f.vx || 0, f.vy || 1, X, Y) === true;
  if (!foi) {
    // o AVISO: pisca antes de atacar; apanhando, pisca também
    const pisca = (f.aviso > 0 || f.flash > 0) && Math.floor(performance.now() / 60) % 2;
    const andando = !f.aviso && !f.preso && !!f.andou;
    if (!pisca && !desenharMovimentoPMD(ctx, f.mon, andando, performance.now() / 1000, f.vx || 0, f.vy || 1, X, Y)) {
      const bruto = Assets.mon(f.mon.species, f.mon.seed);
      if (bruto) {
        const img = Assets.comCor(bruto, f.mon, false), lado = f.mon.alfa ? 38 : 28;
        ctx.drawImage(reduzido(img, lado), X - lado / 2, Y - lado + 4, lado, lado);
      }
    }
  }
  // a vida em cima dele
  const k = Math.max(0, f.mon.hp / Math.max(1, f.mon.maxHp));
  ctx.fillStyle = "#101018"; ctx.fillRect(X - 12, Y - 31, 24, 4);
  ctx.fillStyle = hpColor(k); ctx.fillRect(X - 11, Y - 30, Math.round(22 * k), 2);
}

/** por cima de tudo: os números, a bola voando e o painel dos golpes */
export function desenharLuta(ow, ctx, cx, cy) {
  if (!ligada(ow) || !ow.luta) return;
  const L = ow.luta;
  for (const t of L.textos) {
    const k = 1 - t.v / t.vida, x = Math.round(t.x * TILE - cx + 8 - t.t.length * 3), y = Math.round(t.y * TILE - cy - k * 10);
    drawText(ctx, t.t, x, y, t.cor);
  }
  if (L.bola) {
    const B = L.bola, a = B.alvo, k = Math.min(1, B.t / 0.4);
    const x = (B.de.x + (a.x - B.de.x) * k) * TILE - cx + 8, y = (B.de.y + (a.y - B.de.y) * k) * TILE - cy + 4 - Math.sin(k * Math.PI) * 18;
    const treme = B.t >= 0.4 ? Math.round(Math.sin(B.t * 30) * 1.5) : 0;
    const X = Math.round(x) + treme, Y = Math.round(y);
    ctx.fillStyle = "#101018"; ctx.fillRect(X - 3, Y - 3, 7, 7);
    ctx.fillStyle = "#e04040"; ctx.fillRect(X - 2, Y - 2, 5, 2);
    ctx.fillStyle = "#f0f0f0"; ctx.fillRect(X - 2, Y + 1, 5, 2);
  }
  // SEM MENU, como no LEGENDS: Z-A: só a vida embaixo, à esquerda, e os golpes
  // embaixo, à direita, em cima do mapa (e só com luta por perto)
  const mon = ow.quemSegue();
  if (!mon || !(ow.lutadores || []).length) return;
  const k = Math.max(0, mon.hp / Math.max(1, mon.maxHp));
  ctx.fillStyle = "rgba(10,12,24,0.6)"; ctx.fillRect(4, H - 18, 92, 14);
  drawText(ctx, `${mon.nickname}`.slice(0, 14), 7, H - 17, "#ffffff");
  bar(ctx, 7, H - 8, 86, 2, k, hpColor(k));
  const cd = cdDe(L, mon);
  mon.moves.slice(0, 4).forEach((g, i) => {
    const mv = DB.MOVES[g.id], y = H - 52 + i * 12, x = W - 76;
    ctx.fillStyle = i === L.sel ? "rgba(232,168,32,0.85)" : "rgba(10,12,24,0.6)";
    ctx.fillRect(x, y, 72, 11);
    drawText(ctx, `${i + 1} ${String(mv?.name || "").slice(0, 9)}`, x + 3, y + 1, cd[i] > 0 ? "#8a8a98" : "#ffffff");
    if (cd[i] > 0 && mv) { ctx.fillStyle = "rgba(120,200,255,0.8)"; ctx.fillRect(x, y + 9, Math.round(72 * cd[i] / recarga(mv)), 2); }
  });
}
