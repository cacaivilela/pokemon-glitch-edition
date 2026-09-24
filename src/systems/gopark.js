// O GO PARK — a parte viva. As tabelas e os textos estão em src/data/gopark.js.
import { DB } from "../data/index.js";
import { Assets } from "../core/assets.js";
import { url } from "../core/base.js";
import { createMon, learnableMoves } from "./mon.js";
import { garantirBoxes, todosGuardados, guardar as guardarNoBox, cheio as boxCheio } from "./box.js";
import { desenhar as desenharQR, lerDe as lerQR } from "./qr.js";

const G = () => DB.GO_PARK;

// ------------------------------------------------------------ o complexo
// O parque virou COMPLEXO, como o GO PARK COMPLEX do LET'S GO: são vários
// parques, cada um com as suas vagas, e você escolhe em qual entrar. O save
// antigo guardava uma lista só (`st.goPark = [mon, ...]`); ela vira o primeiro
// parque sem perder ninguém.
function nomeParque(i) { return (DB.GO_PARQUE_NOME || "PARQUE {N}").replace("{N}", i + 1); }

/** Os parques, já no formato de hoje. Migra o save antigo na primeira chamada. */
export function complexo(st) {
  if (!st) return [];
  const n = G().parques, tam = G().porParque;
  let parques;
  if (Array.isArray(st.goPark)) parques = [{ nome: nomeParque(0), mons: st.goPark.filter(Boolean) }];
  else parques = (st.goPark?.parques || []).map((p, i) => ({ nome: p?.nome || nomeParque(i), mons: (p?.mons || []).filter(Boolean) }));

  while (parques.length < n) parques.push({ nome: nomeParque(parques.length), mons: [] });
  // se a configuração encolheu, quem sobrou se espalha pelo que existe — e
  // quem não couber volta pra lista de espera em vez de sumir
  const sobra = parques.slice(n).flatMap((p) => p.mons);
  parques = parques.slice(0, n);
  for (const p of parques) { while (p.mons.length > tam) sobra.push(p.mons.pop()); }
  const presos = [];
  for (const mon of sobra) {
    const p = parques.find((p) => p.mons.length < tam);
    if (p) p.mons.push(mon); else presos.push(mon);
  }
  st.goPark = { parques };
  if (presos.length) { st.goParkEspera = [...(st.goParkEspera || []), ...presos]; console.warn(`[gopark] ${presos.length} sem vaga no complexo`); }
  return parques;
}

export const parque = (st, i = 0) => complexo(st)[i] || { nome: nomeParque(i), mons: [] };
export const moradores = (st) => complexo(st).flatMap((p) => p.mons);
export const totalNoParque = (st) => moradores(st).length;
export const vagasNoParque = (st) => complexo(st).reduce((n, p) => n + (G().porParque - p.mons.length), 0);
/** O primeiro parque com vaga, ou null se o complexo inteiro está lotado. */
export const parqueComVaga = (st) => complexo(st).find((p) => p.mons.length < G().porParque) || null;
export const parqueDe = (st, mon) => complexo(st).find((p) => p.mons.includes(mon)) || null;

// ------------------------------------------------------- os números do GO
/** Os atributos do GO a partir dos daqui: é a conversão oficial (a que a
 *  Niantic usa quando um bicho novo entra no GO). A velocidade entra como um
 *  ajuste em cima de ataque e defesa, porque no GO não existe velocidade. */
export function statsGO(mon) {
  const b = DB.SPECIES[mon.species]?.base || { hp: 50, atk: 50, def: 50, spa: 50, spd: 50, spe: 50 };
  const velMod = 1 + (b.spe - 75) / 500;
  const atk = Math.round(Math.round(2 * (7 / 8 * Math.max(b.atk, b.spa) + 1 / 8 * Math.min(b.atk, b.spa))) * velMod);
  const def = Math.round(Math.round(2 * (5 / 8 * Math.max(b.def, b.spd) + 3 / 8 * Math.min(b.def, b.spd))) * velMod);
  let sta = Math.floor(1.75 * b.hp + 50);
  // o "nerf" do GO: quem passaria de 4000 de CP no nível 40 perfeito leva 0,91
  // em tudo (é o que faz o MEWTWO dar 4178, e não 4995)
  const m40 = DB.CPM[40];
  let A = atk, D = def;
  if (Math.floor((A + 15) * Math.sqrt(D + 15) * Math.sqrt(sta + 15) * m40 * m40 / 10) > 4000) { A = Math.round(A * 0.91); D = Math.round(D * 0.91); sta = Math.round(sta * 0.91); }
  const iv = (k) => Math.floor((mon.ivs?.[k] ?? 15) / 2);     // 0-31 daqui vira 0-15 de lá
  return { atk: A, def: D, sta, ivAtk: iv("atk"), ivDef: iv("def"), ivSta: iv("hp") };
}

export const nivelGO = (mon) => Math.max(1, Math.min(G().nivelMax, mon.level));

/** O CP: (ATK) * sqrt(DEF) * sqrt(STA) * CPM² / 10, nunca abaixo de 10. */
export function cpDe(mon) {
  const s = statsGO(mon), m = DB.CPM[nivelGO(mon)];
  return Math.max(10, Math.floor((s.atk + s.ivAtk) * Math.sqrt(s.def + s.ivDef) * Math.sqrt(s.sta + s.ivSta) * m * m / 10));
}
export const psDe = (mon) => { const s = statsGO(mon); return Math.max(10, Math.floor((s.sta + s.ivSta) * DB.CPM[nivelGO(mon)])); };

/** O caminho de volta: que NÍVEL dá esse CP, para essa espécie com esses IVs.
 *  É o que faz o cartão do GO virar um Pokémon daqui — você lê o CP na tela do
 *  GO e o nível sai por conta. Varre os 50 níveis e fica com o mais perto. */
export function nivelPorCP(species, ivsGO, cp) {
  const falso = { species, ivs: deIVsGO(ivsGO), level: 1 };
  let melhor = 1, erro = Infinity;
  for (let n = 1; n <= G().nivelMax; n++) {
    falso.level = n;
    const d = Math.abs(cpDe(falso) - cp);
    if (d < erro) { erro = d; melhor = n; }
  }
  return { level: melhor, erro };
}

/** Os IVs do GO (0 a 15, três barras) viram os seis daqui (0 a 31).
 *  ATAQUE cobre ataque e ataque especial, DEFESA cobre as duas defesas, e a
 *  velocidade — que não existe no GO — fica na média das duas. `g*2+1` é o
 *  inverso exato do `floor(iv/2)` que o statsGO faz na ida. */
export function deIVsGO({ atk = 15, def = 15, sta = 15 } = {}) {
  const v = (g) => Math.max(0, Math.min(31, Math.round(g) * 2 + 1));
  return { hp: v(sta), atk: v(atk), def: v(def), spa: v(atk), spd: v(def), spe: v((atk + def) / 2) };
}

const COR_TIPO = (t) => DB.TYPE_COLOR?.[t] || "#888";

// ------------------------------------------------- o código do cartão
// O que vai dentro do QR. Texto puro, separado por barra, pra dar pra ler a
// olho nu e depurar sem ferramenta:
//   PGE1|especie|APELIDO|nivel|hp.atk.def.spa.spd.spe|marcas|semente|TREINADOR|crc
// As marcas são letras: s=shiny, l=luminoso, a=alfa, c=corrompido, g=veio do GO.
// Os GOLPES NÃO VÃO no código — o destino remonta pelo learnset do nível, que é
// o que o LET'S GO também faz com quem chega do GO: o bicho vem, os golpes são
// os de lá. Isso mantém o QR pequeno o bastante pra caber no canto do cartão.
const CRC = (txt) => {
  let c = 0xffff;
  for (let i = 0; i < txt.length; i++) {
    c ^= txt.charCodeAt(i) << 8;
    for (let k = 0; k < 8; k++) c = (c & 0x8000) ? ((c << 1) ^ 0x1021) & 0xffff : (c << 1) & 0xffff;
  }
  return c.toString(16).padStart(4, "0");
};
const ORDEM_IV = ["hp", "atk", "def", "spa", "spd", "spe"];
const limpar = (s, n) => String(s ?? "").replace(/[|\n\r]/g, " ").trim().slice(0, n);

/** O Pokémon vira o texto que entra no QR. */
export function codificar(mon, treinador = "") {
  const marcas = [mon.shiny && "s", mon.luminoso && "l", mon.alfa && "a", mon.corrupt && "c", mon.doGO && "g"].filter(Boolean).join("") || "-";
  const corpo = [
    "PGE1", mon.species, limpar(mon.nickname, 12), nivelGO(mon),
    ORDEM_IV.map((k) => mon.ivs?.[k] ?? 15).join("."),
    marcas, mon.seed ?? 0, limpar(treinador, 12) || "-",
  ].join("|");
  return `${corpo}|${CRC(corpo)}`;
}

/** O texto do QR vira um Pokémon de verdade. Devolve { mon, treinador } ou
 *  null — e devolve null de propósito quando o código está corrompido ou fala
 *  de uma espécie que este jogo não tem, em vez de inventar um bicho. */
export function decodificar(texto) {
  const partes = String(texto || "").trim().split("|");
  if (partes[0] !== "PGE1" || partes.length < 9) return null;
  const crc = partes.pop();
  if (CRC(partes.join("|")) !== crc) return null;
  const [, species, apelido, nivel, ivs, marcas, semente, treinador] = partes;
  if (!DB.SPECIES[species]) return null;
  const nums = String(ivs).split(".").map(Number);
  if (nums.length !== 6 || nums.some((n) => !Number.isFinite(n) || n < 0 || n > 31)) return null;
  const level = Math.max(1, Math.min(100, Number(nivel) || 1));
  const mon = createMon(species, level, {
    ivs: Object.fromEntries(ORDEM_IV.map((k, i) => [k, nums[i]])),
    nickname: apelido || DB.SPECIES[species].name,
    seed: Number(semente) || 0,
    shiny: marcas.includes("s"), luminoso: marcas.includes("l"),
    alfa: marcas.includes("a"), corrupt: marcas.includes("c"),
  });
  if (marcas.includes("g")) mon.doGO = true;
  return { mon, treinador: treinador === "-" ? "" : treinador };
}

// ------------------------------------------------------------- o cartão
/** O CARTÃO: um canvas do tamanho da tela do GO, desenhado do zero, com o QR
 *  do Pokémon no rodapé — é ele que outro save lê pra trazer o bicho. */
export function cartao(mon, treinador = "") {
  const sp = DB.SPECIES[mon.species], s = statsGO(mon), cp = cpDe(mon);
  const W = 360, H = 600, c = document.createElement("canvas");
  c.width = W; c.height = H;
  const x = c.getContext("2d");
  const cor = COR_TIPO(sp.types[0]);
  const g = x.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, cor); g.addColorStop(0.45, "#f4f6f8"); g.addColorStop(1, "#e2e6ea");
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.fillStyle = "rgba(255,255,255,.25)"; x.beginPath(); x.arc(W / 2, 175, 118, 0, Math.PI * 2); x.fill();
  x.textAlign = "center"; x.fillStyle = "#fff";
  x.font = "bold 14px system-ui, sans-serif"; x.fillText("CP", W / 2 - 34, 36);
  x.font = "bold 40px system-ui, sans-serif"; x.fillText(String(cp), W / 2 + 6, 42);
  // na cor DELE: um shiny que foi pro GO tem que sair shiny no cartão
  const img = Assets.comCor(Assets.mon(mon.species, mon.seed), mon);
  x.imageSmoothingEnabled = false;
  if (img) x.drawImage(img, W / 2 - 92, 80, 184, 184);
  x.fillStyle = "#222"; x.font = "bold 26px system-ui, sans-serif"; x.fillText(mon.nickname || sp.name, W / 2, 302);
  if ((mon.nickname || sp.name) !== sp.name) { x.font = "14px system-ui, sans-serif"; x.fillStyle = "#666"; x.fillText(sp.name, W / 2, 321); }
  x.font = "16px system-ui, sans-serif"; x.fillStyle = "#444";
  x.fillText(`${psDe(mon)} / ${psDe(mon)} PS`, W / 2, 346);
  // os tipos, em pílulas
  const tipos = sp.types;
  tipos.forEach((t, i) => {
    const px = W / 2 + (i - (tipos.length - 1) / 2) * 110, py = 362;
    x.fillStyle = COR_TIPO(t); roundRect(x, px - 48, py, 96, 26, 13); x.fill();
    x.fillStyle = "#fff"; x.font = "bold 13px system-ui, sans-serif"; x.fillText(t, px, py + 18);
  });
  // a avaliação: as três barras de IV, como no GO
  const barras = [["ATAQUE", s.ivAtk], ["DEFESA", s.ivDef], ["PS", s.ivSta]];
  barras.forEach(([nome, iv], i) => {
    const py = 406 + i * 26;
    x.textAlign = "left"; x.fillStyle = "#333"; x.font = "13px system-ui, sans-serif"; x.fillText(nome, 34, py + 12);
    x.fillStyle = "#cfd4da"; roundRect(x, 112, py, 186, 14, 7); x.fill();
    x.fillStyle = iv === 15 ? "#f2a33a" : "#e0524a"; roundRect(x, 112, py, Math.max(8, 186 * iv / 15), 14, 7); x.fill();
    x.textAlign = "right"; x.fillStyle = "#333"; x.fillText(`${iv}/15`, 310, py + 12);
  });
  x.textAlign = "center"; x.fillStyle = "#666"; x.font = "12px system-ui, sans-serif";
  x.fillText(`NÍVEL ${nivelGO(mon)} · ATK ${s.atk} · DEF ${s.def} · STA ${s.sta}`, W / 2, 496);

  // O QR: é o Pokémon inteiro. Fundo branco por baixo com folga, senão o
  // gradiente do cartão estraga o contraste que o leitor precisa.
  try {
    const qr = desenharQR(codificar(mon, treinador), { escala: 4, margem: 3 });
    const qx = W - qr.width - 14, qy = H - qr.height - 14;
    x.fillStyle = "#fff"; x.fillRect(qx - 4, qy - 4, qr.width + 8, qr.height + 8);
    x.drawImage(qr, qx, qy);
    x.textAlign = "left"; x.fillStyle = "#555"; x.font = "11px system-ui, sans-serif";
    x.fillText("APONTE ISTO PRO GO PARK", 18, H - 46);
    x.fillText("DE OUTRO SAVE PRA TRAZER", 18, H - 32);
    x.fillText("ESTE POKÉMON.", 18, H - 18);
  } catch (e) { console.warn("[gopark] QR do cartão:", e); }
  x.textAlign = "center"; x.fillStyle = "#999"; x.font = "11px system-ui, sans-serif";
  x.fillText("POKÉMON GLITCH EDITION · GO PARK", W / 2, 520);
  return c;
}
function roundRect(x, px, py, w, h, r) {
  x.beginPath(); x.moveTo(px + r, py); x.arcTo(px + w, py, px + w, py + h, r); x.arcTo(px + w, py + h, px, py + h, r);
  x.arcTo(px, py + h, px, py, r); x.arcTo(px, py, px + w, py, r); x.closePath();
}

/** baixa o cartão como PNG; devolve o nome do arquivo */
export function baixarCartao(mon, treinador = "") {
  const nome = `GO-${(mon.nickname || DB.SPECIES[mon.species]?.name || "pokemon").replace(/[^A-Za-z0-9]+/g, "_")}-CP${cpDe(mon)}.png`;
  try {
    const a = document.createElement("a");
    a.href = cartao(mon, treinador).toDataURL("image/png");
    a.download = nome;
    a.click();
  } catch (e) { console.warn("[gopark] cartão:", e); }
  return nome;
}

// -------------------------------------------------------------- ir e vir
/** Quem pode ir pro GO: a equipe inteira (menos o último, que não dá pra ficar
 *  sem ninguém) e TODO MUNDO QUE ESTÁ GUARDADO NO PC. É o que faz um Pokémon
 *  capturado há cem horas e esquecido na box 7 poder ir pro parque. */
export function candidatos(st) {
  garantirBoxes(st);
  const daEquipe = st.party.map((mon, i) => ({ mon, origem: "equipe", i }));
  const daBox = todosGuardados(st).map((mon) => ({ mon, origem: "box" }));
  return [...daEquipe, ...daBox];
}

/** Tira o Pokémon de onde ele estiver (equipe ou box). Devolve true se achou. */
function retirar(st, mon) {
  const i = st.party.indexOf(mon);
  if (i >= 0) { st.party.splice(i, 1); return true; }
  for (const b of st.boxes || []) {
    const k = b.mons.indexOf(mon);
    if (k >= 0) { b.mons[k] = null; return true; }
  }
  const e = (st.box || []).indexOf(mon);
  if (e >= 0) { st.box.splice(e, 1); return true; }
  return false;
}

/** ENVIAR PRO GO: sai da equipe ou da box, entra num parque com vaga.
 *  Devolve o Pokémon, ou null (último da equipe, ou complexo lotado). */
export function enviar(st, mon) {
  if (!mon) return null;
  if (st.party.length <= 1 && st.party.includes(mon)) return null;
  const p = parqueComVaga(st);
  if (!p) return null;
  if (!retirar(st, mon)) return null;
  mon.cpGO = cpDe(mon);
  p.mons.push(mon);
  return mon;
}

/** VOLTAR: sai do parque, entra na equipe ou no box. */
export function voltar(st, mon, guardar = guardarNoBox, cheio = boxCheio) {
  if (st.party.length >= 6 && cheio(st)) return null;
  const p = parqueDe(st, mon);
  if (!p) return null;
  p.mons.splice(p.mons.indexOf(mon), 1);
  delete mon.cpGO;
  if (st.party.length < 6) { st.party.push(mon); return "equipe"; }
  guardar(st, mon);
  return "box";
}

/** CHEGAR: um Pokémon de fora (do GO ou de outro save) entra num parque. */
export function receber(st, mon) {
  const p = parqueComVaga(st);
  if (!p) return null;
  mon.cpGO = cpDe(mon);
  p.mons.push(mon);
  return p;
}

// ------------------------------------------------------- vindo do POKÉMON GO
// Aqui é a entrada do complexo: o que chega DE FORA. Duas portas, e as duas
// funcionam sem falar com a Niantic — porque não existe falar com a Niantic.
//
//   1. O CARTÃO deste jogo (o QR ou o texto PGE1), que é outro save mandando.
//   2. OS SEUS DADOS DO GO. A Niantic não publica formato nenhum e não tem
//      exportação automática: dá pra pedir a sua cópia pelo privacy@nianticlabs
//      .com, e o que volta é um arquivo. Como não existe esquema documentado
//      pra escrever contra, o leitor aqui é TOLERANTE: ele aceita JSON ou CSV
//      e procura as colunas pelo nome, em inglês ou português, em qualquer
//      arrumação. O que ele precisa achar é a espécie e mais ou menos isto:
//      CP e as três barras da avaliação. Com CP e IVs ele descobre o nível
//      sozinho (nivelPorCP), que é a mesma conta do GO ao contrário.
//
// O que NÃO tem aqui, de propósito: nada que peça a sua senha ou o seu token do
// GO. As ferramentas que "extraem da conta" fazem login no seu lugar, e isso
// derruba conta. Se você não tem arquivo nenhum, dá pra digitar o que está na
// tela: espécie e CP bastam.

const semAcento = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "");
const chaveNorm = (s) => semAcento(s).toLowerCase().replace(/[^a-z0-9]/g, "");

/** Pega o primeiro campo que existir, testando os nomes sem ligar pra acento,
 *  maiúscula, espaço ou underscore. */
function campo(reg, nomes) {
  const mapa = {};
  for (const k of Object.keys(reg || {})) mapa[chaveNorm(k)] = reg[k];
  for (const n of nomes) { const v = mapa[chaveNorm(n)]; if (v !== undefined && v !== null && v !== "") return v; }
  return undefined;
}
/** Número de um campo bagunçado ("1.234 CP", "15/15"). Devolve undefined —
 *  NUNCA 0 — quando não tem dígito nenhum: `String(undefined)` limpo vira ""
 *  e `Number("")` é 0, e 0 é a Pokédex do MISSINGNO. Sem esta guarda, todo
 *  nome que o importador não conhecia virava um MISSINGNO. */
const num = (v) => {
  const t = String(v ?? "").replace(/[^\d.\-]/g, "");
  if (!/\d/.test(t)) return undefined;
  const n = Number(t);
  return Number.isFinite(n) ? n : undefined;
};

const REGIOES = [["alolan", "alola"], ["alola", "alola"], ["galarian", "galar"], ["galar", "galar"],
  ["hisuian", "hisui"], ["hisui", "hisui"], ["paldean", "paldea"], ["paldea", "paldea"]];

/** O nome que veio do GO vira um id de espécie daqui. Entende "Alolan Vulpix",
 *  "Vulpix (Alolan)", "VULPIX-ALOLA", o id cru e o número da Pokédex. */
export function especieDe(nome, dex) {
  const S = DB.SPECIES;
  if (nome) {
    const cru = String(nome).trim();
    if (S[cru]) return cru;
    const k = chaveNorm(cru);
    if (S[k]) return k;
    for (const id of Object.keys(S)) if (chaveNorm(S[id].name) === k) return id;
    // forma regional escrita de qualquer jeito: acha a região e cola no fim
    for (const [palavra, sufixo] of REGIOES) {
      if (!k.includes(palavra)) continue;
      const base = k.replace(palavra, "");
      if (S[base + sufixo]) return base + sufixo;
      for (const id of Object.keys(S)) if (chaveNorm(S[id].name) === base + sufixo) return id;
    }
  }
  const d = num(dex);
  if (d !== undefined && d >= 1) {                   // dex 0 é o MISSINGNO: só por nome, nunca por acidente
    const achado = Object.keys(S).find((id) => S[id].dex === d && !S[id].foreign && !S[id].mega && !S[id].fusao);
    if (achado) return achado;
  }
  return null;
}

/** Uma linha do seu arquivo do GO vira um Pokémon daqui. Devolve
 *  { mon, cp, nivelEstimado } ou null com o motivo em `erro`. */
export function monDoGO(reg) {
  const nome = campo(reg, ["name", "species", "pokemon", "pokemonname", "nome", "especie", "displayname", "pokemondisplayname"]);
  const dex = campo(reg, ["dex", "pokedex", "pokedexnumber", "pokemonid", "dexnumber", "num", "numero"]);
  const species = especieDe(nome, dex);
  if (!species) return { erro: "especie", nome: String(nome ?? dex ?? "?") };

  const ivs = {
    atk: num(campo(reg, ["ivattack", "individualattack", "atkiv", "attack", "atk", "ataque"])) ?? 15,
    def: num(campo(reg, ["ivdefense", "individualdefense", "defiv", "defense", "def", "defesa"])) ?? 15,
    sta: num(campo(reg, ["ivstamina", "individualstamina", "staiv", "stamina", "hp", "sta", "ps", "vigor"])) ?? 15,
  };
  // se vierem em 0-31 (alguém exportou já convertido), corta pra escala do GO
  for (const k of Object.keys(ivs)) if (ivs[k] > 15) ivs[k] = Math.floor(ivs[k] / 2);
  for (const k of Object.keys(ivs)) ivs[k] = Math.max(0, Math.min(15, Math.round(ivs[k])));

  const cp = num(campo(reg, ["cp", "combatpower", "combat_power", "pc", "poderdecombate"]));
  let level = num(campo(reg, ["level", "lvl", "nivel", "pokemonlevel"]));
  let estimado = false;
  if (level === undefined || level <= 0) {
    if (cp === undefined) return { erro: "semdados", nome: String(nome ?? species) };
    level = nivelPorCP(species, ivs, cp).level;
    estimado = true;
  }
  level = Math.max(1, Math.min(G().nivelMax, Math.round(level)));   // o GO tem meio nível; aqui não

  const apelido = campo(reg, ["nickname", "nick", "apelido", "nome_dado"]);
  const brilho = campo(reg, ["shiny", "isshiny", "brilhante"]);
  const mon = createMon(species, level, {
    ivs: deIVsGO(ivs),
    nickname: String(apelido || DB.SPECIES[species].name).toUpperCase().slice(0, 12),
    moves: learnableMoves(species, level).slice(-4),
    shiny: brilho === true || /^(1|true|sim|yes|y|s)$/i.test(String(brilho ?? "")),
  });
  mon.doGO = true;                                   // a marca de quem veio de lá
  return { mon, cp: cp ?? cpDe(mon), nivelEstimado: estimado };
}

/** Lê um CSV simples (vírgula, ponto-e-vírgula ou tab) com cabeçalho. */
function lerCSV(texto) {
  const linhas = texto.split(/\r?\n/).filter((l) => l.trim());
  if (linhas.length < 2) return null;
  const sep = [",", ";", "\t"].sort((a, b) => linhas[0].split(b).length - linhas[0].split(a).length)[0];
  const corta = (l) => l.split(sep).map((c) => c.trim().replace(/^"(.*)"$/, "$1"));
  const cab = corta(linhas[0]);
  if (cab.length < 2) return null;
  return linhas.slice(1).map((l) => Object.fromEntries(corta(l).map((v, i) => [cab[i] || `c${i}`, v])));
}

/** Acha a lista de Pokémon dentro de um JSON de forma qualquer: ela pode estar
 *  na raiz ou pendurada numa chave (`pokemon`, `inventory`, `data`...). */
function acharLista(obj, fundo = 0) {
  if (Array.isArray(obj)) return obj.every((o) => o && typeof o === "object") ? obj : null;
  if (!obj || typeof obj !== "object" || fundo > 4) return null;
  for (const k of Object.keys(obj)) { const r = acharLista(obj[k], fundo + 1); if (r?.length) return r; }
  return null;
}

/** A PORTA DE ENTRADA. Recebe o texto de um arquivo (ou o conteúdo de um QR) e
 *  devolve { mons, avisos } — nunca joga fora o arquivo inteiro por causa de
 *  uma linha ruim: o que não deu, vira aviso. */
export function importar(texto) {
  const t = String(texto || "").trim();
  if (!t) return { mons: [], avisos: ["vazio"] };

  // 1. cartão deste jogo
  if (t.startsWith("PGE1|")) {
    const r = decodificar(t);
    return r ? { mons: [r.mon], avisos: [], treinador: r.treinador } : { mons: [], avisos: ["cartao"] };
  }

  // 2. JSON ou CSV com a sua coleção do GO
  let linhas = null;
  if (t[0] === "{" || t[0] === "[") { try { linhas = acharLista(JSON.parse(t)); } catch { linhas = null; } }
  if (!linhas) linhas = lerCSV(t);
  if (!linhas?.length) return { mons: [], avisos: ["formato"] };

  const mons = [], avisos = [];
  let estimado = false;
  for (const reg of linhas) {
    const r = monDoGO(reg);
    if (r.erro) { if (avisos.length < 5) avisos.push(`${r.erro}:${r.nome}`); continue; }
    if (r.nivelEstimado) estimado = true;      // veio CP mas não veio nível
    mons.push(r.mon);
  }
  return { mons, avisos, estimado };
}

/** O mesmo, a partir de uma imagem com QR (o cartão de outro save). */
export function importarDeImagem(fonte) {
  const texto = lerQR(fonte);
  if (!texto) return { mons: [], avisos: ["qr"] };
  return importar(texto);
}

// ------------------------------------------------------------- GO PLACE
/** o minijogo que este Pokémon libera no GO PLACE */
export function minijogoDe(mon) {
  const sp = DB.SPECIES[mon.species];
  const id = DB.MINIJOGO_POR_TIPO[sp?.types?.[0]] || "corrida";
  return { id, ...DB.MINIJOGOS_GO[id] };
}

/** a chance de a bola segurar, pela qualidade do arremesso (0 a 1) */
export const chanceCaptura = (qualidade) => 0.3 + 0.65 * qualidade;

export const spriteUrl = (dex) => url(`assets/sprites/pokemon/${String(dex).padStart(3, "0")}.png`);
