// AS POKÉMÁQUINAS — as regras (os dados estão em src/data/pokemaquinas.js).
//
// O JOGADOR INVENTA: com a CAIXA DE FERRAMENTAS (usada pela mochila) abre a
// OFICINA (src/scenes/construcao.js), encaixa as peças numa GRADE como quiser e
// escolhe o TIPO de Pokémon que move a máquina. `avaliar` diz o que aquilo vira;
// `desenhoDaGrade` faz o desenho dela no mapa a partir da própria grade.
// Construída, ela fica em state.pokemaquinas = [{ uid, mapa, x, y, grade, tipo }]
// e vira um NPC desenhado (overworld: `npcsHere` -> `maquinasNoMapa`). Falando
// com ela: USAR ou DESMONTAR (as peças voltam). Quando cada uma foi usada fica em
// state.maquinas[uid].
import { DB } from "../data/index.js";
import { Audio2 } from "../core/audio.js";
import { heal, amizade } from "./mon.js";
import { ConstrucaoScene } from "../scenes/construcao.js";

const C = () => DB.POKEMAQUINAS_CONFIG || {};
const T = () => DB.POKEMAQUINAS_TEXTO || {};
const G = () => DB.POKEMAQUINAS_GRADE;
const tiposDe = (mon) => mon.types || DB.SPECIES[mon.species]?.types || [];

/** a "planta" do tipo: o que uma máquina movida por ele produz, a fala e o verbo */
export const plantaDoTipo = (tipo) => (DB.POKEMAQUINAS || []).find((x) => x.tipos.includes(tipo)) || DB.POKEMAQUINAS_GENERICA;
export const nomeDaMaquina = (tipo) => DB.POKEMAQUINAS_NOMES?.[tipo] || "MÁQUINA";

/** quantas peças de cada uma a grade tem ({ "motor": 2, ... }) */
export function pecasDaGrade(grade) {
  const n = {};
  for (const ch of grade || "") {
    const p = G().codigos[ch];
    if (p) n[p] = (n[p] || 0) + 1;
  }
  return n;
}

/** O QUE A MÁQUINA FAZ, pelo que tem na grade. Sem peça nenhuma é a BÁSICA (1 por
 *  uso, a espera normal, sem bônus); cada peça é uma melhoria. */
export function avaliar(grade, tipo) {
  const g = G(), n = pecasDaGrade(grade);
  const total = Object.values(n).reduce((s, v) => s + v, 0);
  return {
    ok: true, total, pecas: n, planta: plantaDoTipo(tipo), tipo, nome: nomeDaMaquina(tipo),
    qtd: Math.min(g.qtdMax, 1 + (n["motor"] || 0) * g.qtdPorMotor),
    espera: Math.max(g.esperaMin, (C().espera ?? 10) - (n["engrenagem"] || 0) * g.esperaPorEngrenagem),
    sorte: Math.min(g.sorteMax, (n["fio"] || 0) * g.sortePorFio),
    dobro: Math.min(g.dobroMax, (n["parafuso"] || 0) * g.dobroPorParafuso),
    amizade: Math.min(g.amizadeMax, (n["placa de metal"] || 0) * g.amizadePorPlaca),
  };
}

// ---------------- o DESENHO da máquina, a partir da grade (32x32, pés no chão)
// cada peça vira um quadradinho de 5x6 com a "cara" dela; depois o contorno escuro por fora
const PIX = {
  b: ["#7d6a52", "#a48c6c", "#56483a"],          // a CARCAÇA da básica (madeira e lata)
  p: ["#9aa2b0", "#c8cdd6", "#6c7484"],          // placa de metal: base, luz, sombra
  e: ["#8a8f9a", "#b9bec8", "#5a5f6a"],          // engrenagem
  f: ["#d07a3c", "#f2a868", "#8a4a1e"],          // fio de cobre
  m: ["#4a78d0", "#7aa4ee", "#2c4c98"],          // motor
  r: ["#7a808c", "#a8aeb8", "#4c5260"],          // parafuso
};
function celula(ctx, ch, x, y) {
  const [b, l, s] = PIX[ch];
  const px = (dx, dy, c) => { ctx.fillStyle = c; ctx.fillRect(x + dx, y + dy, 1, 1); };
  for (let dy = 0; dy < 6; dy++) for (let dx = 0; dx < 5; dx++) px(dx, dy, dx === 0 || dy === 0 ? l : dx === 4 || dy === 5 ? s : b);
  if (ch === "b") { px(2, 2, s); px(2, 3, s); }                                     // as tábuas da carcaça
  if (ch === "p") { px(1, 1, s); px(3, 4, s); }                                     // os rebites
  if (ch === "e") { px(2, 1, s); px(1, 2, s); px(3, 2, s); px(2, 3, "#2a2d34"); px(1, 3, s); px(3, 3, s); px(2, 4, s); }   // o dente e o furo
  if (ch === "f") { px(1, 1, l); px(2, 2, l); px(3, 3, l); px(2, 4, l); px(1, 5, l); }   // o fio enrolado
  if (ch === "m") { px(1, 2, "#1c2c58"); px(2, 2, "#1c2c58"); px(3, 2, "#1c2c58"); px(2, 4, "#e8ecf4"); }   // as aletas e o eixo
  if (ch === "r") { px(1, 2, "#2a2d34"); px(2, 2, "#2a2d34"); px(3, 2, "#2a2d34"); px(2, 3, "#2a2d34"); }   // a fenda do parafuso
}
const desenhos = new Map();
/** a grade com a CARCAÇA da básica nas casas vazias dela (`b`): é o que aparece no desenho */
export function comCarcaca(grade) {
  const g = G(), [x0, y0, x1, y1] = g.carcaca;
  return [...grade].map((ch, i) => {
    const x = i % g.w, y = Math.floor(i / g.w);
    return ch === "." && x >= x0 && x <= x1 && y >= y0 && y <= y1 ? "b" : ch;
  }).join("");
}

/** o canvas 32x32 da máquina dessa grade (guardado: a mesma grade é o mesmo desenho).
 *  `soPecas` desenha a grade como está, sem a carcaça (o ícone de uma peça sozinha). */
export function desenhoDaGrade(grade0, soPecas = false) {
  const grade = soPecas ? grade0 : comCarcaca(grade0);
  if (desenhos.has(grade)) return desenhos.get(grade);
  const g = G(), W = g.w * 5, H = g.h * 6;
  const base = document.createElement("canvas"); base.width = W; base.height = H;
  const c = base.getContext("2d");
  for (let i = 0; i < grade.length; i++) if (PIX[grade[i]]) celula(c, grade[i], (i % g.w) * 5, Math.floor(i / g.w) * 6);
  // o contorno por fora, e os pés no chão (a parte de baixo da peça mais baixa encosta no fim do quadro)
  const d = c.getImageData(0, 0, W, H).data, cheio = (x, y) => x >= 0 && y >= 0 && x < W && y < H && d[(y * W + x) * 4 + 3] > 0;
  let baixo = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (cheio(x, y)) baixo = y;
  const out = document.createElement("canvas"); out.width = out.height = 32;
  const o = out.getContext("2d"), ox = 1, oy = 31 - baixo;
  o.fillStyle = "#1c1e26";
  for (let y = -1; y <= H; y++) for (let x = -1; x <= W; x++) {
    if (cheio(x, y)) continue;
    if (cheio(x + 1, y) || cheio(x - 1, y) || cheio(x, y + 1) || cheio(x, y - 1)) o.fillRect(ox + x, oy + y, 1, 1);
  }
  o.drawImage(base, ox, oy);
  desenhos.set(grade, out);
  return out;
}

/** as máquinas construídas NESTE mapa, como NPCs desenhados (o overworld junta no `npcsHere`) */
export function maquinasNoMapa(st, mapa) {
  return (st.pokemaquinas || []).filter((m) => m.mapa === mapa && m.grade).map((m) => ({
    id: `maquina_${m.uid}`, x: m.x, y: m.y, dir: "down", sprite: "canvas", canvas: desenhoDaGrade(m.grade), lado: 32,
    maquinaUid: m.uid,
  }));
}

/** quem da equipe faz a máquina funcionar (de pé, do tipo dela; o jogador-Pokémon não conta) */
export function quemFunciona(st, tipo) {
  return (st.party || []).filter((m) => !m.eu && m.hp > 0 && tiposDe(m).includes(tipo));
}

/** minutos que ainda faltam pra máquina `uid` poder ser usada de novo (0 = pode) */
export function faltaMinutos(st, uid, espera) {
  const ultimo = st.maquinas?.[uid]?.usada || 0;
  return Math.max(0, Math.ceil((ultimo + espera * 60000 - Date.now()) / 60000));
}

const preenche = (s, v = {}) => s.replace("{NOME}", v.nome ?? "").replace("{TIPOS}", v.tipos ?? "").replace("{MIN}", v.min ?? "")
  .replace("{MON}", v.mon ?? "").replace("{ITEM}", (v.item || "").toUpperCase()).replace("{QTD}", v.qtd ?? "");

/** A CAIXA DE FERRAMENTAS: abre a OFICINA, e o que for construído vai pro tile da frente.
 *  `livre(x, y)` diz se dá pra pôr uma máquina ali (o overworld sabe). */
export function abrirCaixa(cena, livre) {
  const st = cena.st, t = T();
  const alvo = cena.facing();
  if (!livre(alvo.x, alvo.y)) return void cena.dlg.say(t.semLugar);
  cena.game.scenes.push(new ConstrucaoScene(), {
    st,
    // construiu: as peças já saíram da mochila (a oficina tira ao encaixar)
    aoConstruir: (grade, tipo) => {
      (st.pokemaquinas ||= []).push({ uid: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`,
        mapa: st.player.map, x: alvo.x, y: alvo.y, grade, tipo });
      cena.game.autosave?.(true);
      Audio2.tone(330, 0.05, "square", 0.5); Audio2.tone(440, 0.05, "square", 0.5); Audio2.tone(660, 0.1, "square", 0.5);
      cena.dlg.say(preenche(t.construiu, { nome: nomeDaMaquina(tipo) }));
    },
  });
}

/** Falar com uma máquina construída: usar ou desmontar. */
export function falarComMaquina(cena, npc) {
  const st = cena.st, t = T();
  const k = (st.pokemaquinas || []).findIndex((m) => m.uid === npc.maquinaUid);
  if (k < 0) return;
  const mq = st.pokemaquinas[k], av = avaliar(mq.grade, mq.tipo);
  cena.dlg.ask(preenche(t.oQueFazer, { nome: av.nome }), t.acoes, (i) => {
    if (i === 0) return usarMaquina(cena, mq, av);
    // MELHORAR: a oficina de novo, com a grade e o tipo dela
    if (i === 1) {
      return void cena.game.scenes.push(new ConstrucaoScene(), {
        st, grade: mq.grade, tipo: mq.tipo,
        aoConstruir: (grade, tipo) => {
          mq.grade = grade; mq.tipo = tipo;
          cena.game.autosave?.(true);
          Audio2.tone(440, 0.05, "square", 0.5); Audio2.tone(660, 0.1, "square", 0.5);
          cena.dlg.say(preenche(t.melhorou, { nome: nomeDaMaquina(tipo) }));
        },
      });
    }
    if (i !== 2) return;
    st.pokemaquinas.splice(k, 1);
    delete st.maquinas?.[mq.uid];
    for (const [p, n] of Object.entries(av.pecas)) st.items[p] = Math.min(999, (st.items[p] || 0) + n);
    Audio2.tone(660, 0.05, "square", 0.5); Audio2.tone(440, 0.05, "square", 0.5); Audio2.tone(330, 0.1, "square", 0.5);
    cena.game.autosave?.(true);
    cena.dlg.say(preenche(t.desmontou, { nome: av.nome }));
  });
}

/** sorteia um prêmio de `[item, qtd, peso]`; com `sorte`, às vezes vai direto pros raros (peso <= 10) */
function sorteia(lista, sorte) {
  const raros = lista.filter((x) => x[2] <= 10);
  const de = raros.length && Math.random() < sorte ? raros : lista;
  const total = de.reduce((s, x) => s + x[2], 0);
  let r = Math.random() * total;
  for (const x of de) { r -= x[2]; if (r <= 0) return x; }
  return de[de.length - 1];
}

/** Usar: explica, escolhe quem, e ela funciona. */
export function usarMaquina(cena, mq, av) {
  const st = cena.st, t = T(), dlg = cena.dlg, pl = av.planta;
  const falta = faltaMinutos(st, mq.uid, av.espera);
  if (falta > 0) return void dlg.say(preenche(t.cansado, { nome: av.nome, min: falta }));
  const lista = quemFunciona(st, mq.tipo);
  if (!lista.length) return void dlg.say(preenche(t.ninguem, { tipos: mq.tipo }));
  const escolhe = (mon) => funcionar(cena, mq, av, mon);
  if (lista.length === 1) return escolhe(lista[0]);
  const op = lista.slice(0, 5);
  dlg.ask(preenche(t.quem, { nome: av.nome }), [...op.map((m) => m.nickname), t.cancelar], (i) => { if (op[i]) escolhe(op[i]); });
}

function funcionar(cena, mq, av, mon) {
  const st = cena.st, t = T(), pl = av.planta, msgs = [pl.verbo.replace("{MON}", mon.nickname)];
  Audio2.tone(523, 0.07, "square", 0.5); Audio2.tone(784, 0.09, "square", 0.5);
  if (pl.efeito === "curar") {
    for (const m of st.party || []) heal(m);
    Audio2.heal();
    msgs.push(t.curou);
  } else {
    const [item, qtd] = sorteia(pl.sorteio || [], av.sorte);
    const n = qtd * av.qtd * (Math.random() < av.dobro ? 2 : 1);
    st.items[item] = Math.min(999, (st.items[item] || 0) + n);
    msgs.push(preenche(t.ganhou, { item, qtd: n }));
    const lore = DB.ITEM_LORE?.[item];
    if (lore) msgs.push(lore);
  }
  amizade(mon, (C().amizade ?? 3) + av.amizade);
  msgs.push(preenche(t.gostou, { mon: mon.nickname }));
  const estado = (st.maquinas ||= {})[mq.uid] ||= {};
  estado.usada = Date.now();
  estado.vezes = (estado.vezes || 0) + 1;
  cena.game.autosave?.(true);
  cena.dlg.say(msgs);
}
