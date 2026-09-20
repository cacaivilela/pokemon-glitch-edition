// O GO PARK — a parte viva. As tabelas e os textos estão em src/data/gopark.js.
import { DB } from "../data/index.js";
import { Assets } from "../core/assets.js";
import { url } from "../core/base.js";

const G = () => DB.GO_PARK;
export const parque = (st) => (st.goPark ||= []);

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

const COR_TIPO = (t) => DB.TYPE_COLOR?.[t] || "#888";

/** O CARTÃO: um canvas do tamanho da tela do GO, desenhado do zero. */
export function cartao(mon) {
  const sp = DB.SPECIES[mon.species], s = statsGO(mon), cp = cpDe(mon);
  const W = 360, H = 600, c = document.createElement("canvas");
  c.width = W; c.height = H;
  const x = c.getContext("2d");
  const cor = COR_TIPO(sp.types[0]);
  const g = x.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, cor); g.addColorStop(0.45, "#f4f6f8"); g.addColorStop(1, "#e2e6ea");
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.fillStyle = "rgba(255,255,255,.25)"; x.beginPath(); x.arc(W / 2, 190, 120, 0, Math.PI * 2); x.fill();
  x.textAlign = "center"; x.fillStyle = "#fff";
  x.font = "bold 14px system-ui, sans-serif"; x.fillText("CP", W / 2 - 34, 40);
  x.font = "bold 40px system-ui, sans-serif"; x.fillText(String(cp), W / 2 + 6, 46);
  const img = Assets.mon(mon.species, mon.seed);
  x.imageSmoothingEnabled = false;
  if (img) x.drawImage(img, W / 2 - 96, 90, 192, 192);
  x.fillStyle = "#222"; x.font = "bold 26px system-ui, sans-serif"; x.fillText(mon.nickname || sp.name, W / 2, 330);
  if ((mon.nickname || sp.name) !== sp.name) { x.font = "14px system-ui, sans-serif"; x.fillStyle = "#666"; x.fillText(sp.name, W / 2, 350); }
  x.font = "16px system-ui, sans-serif"; x.fillStyle = "#444";
  x.fillText(`${psDe(mon)} / ${psDe(mon)} PS`, W / 2, 378);
  // os tipos, em pílulas
  const tipos = sp.types;
  tipos.forEach((t, i) => {
    const px = W / 2 + (i - (tipos.length - 1) / 2) * 110, py = 400;
    x.fillStyle = COR_TIPO(t); roundRect(x, px - 48, py, 96, 26, 13); x.fill();
    x.fillStyle = "#fff"; x.font = "bold 13px system-ui, sans-serif"; x.fillText(t, px, py + 18);
  });
  // a avaliação: as três barras de IV, como no GO
  const barras = [["ATAQUE", s.ivAtk], ["DEFESA", s.ivDef], ["PS", s.ivSta]];
  barras.forEach(([nome, iv], i) => {
    const py = 452 + i * 30;
    x.textAlign = "left"; x.fillStyle = "#333"; x.font = "13px system-ui, sans-serif"; x.fillText(nome, 40, py + 12);
    x.fillStyle = "#cfd4da"; roundRect(x, 120, py, 200, 14, 7); x.fill();
    x.fillStyle = iv === 15 ? "#f2a33a" : iv >= 13 ? "#e0524a" : "#f2a33a"; roundRect(x, 120, py, Math.max(8, 200 * iv / 15), 14, 7); x.fill();
    x.textAlign = "right"; x.fillStyle = "#333"; x.fillText(`${iv}/15`, 330, py + 12);
  });
  x.textAlign = "center"; x.fillStyle = "#666"; x.font = "12px system-ui, sans-serif";
  x.fillText(`NÍVEL ${nivelGO(mon)} · ATK ${s.atk} · DEF ${s.def} · STA ${s.sta}`, W / 2, 556);
  x.fillStyle = "#999"; x.font = "11px system-ui, sans-serif";
  x.fillText("TRANSFERIDO DE POKÉMON GLITCH EDITION · KANTO", W / 2, 580);
  return c;
}
function roundRect(x, px, py, w, h, r) {
  x.beginPath(); x.moveTo(px + r, py); x.arcTo(px + w, py, px + w, py + h, r); x.arcTo(px + w, py + h, px, py + h, r);
  x.arcTo(px, py + h, px, py, r); x.arcTo(px, py, px + w, py, r); x.closePath();
}

/** baixa o cartão como PNG; devolve o nome do arquivo */
export function baixarCartao(mon) {
  const nome = `GO-${(mon.nickname || DB.SPECIES[mon.species]?.name || "pokemon").replace(/[^A-Za-z0-9]+/g, "_")}-CP${cpDe(mon)}.png`;
  try {
    const a = document.createElement("a");
    a.href = cartao(mon).toDataURL("image/png");
    a.download = nome;
    a.click();
  } catch (e) { console.warn("[gopark] cartão:", e); }
  return nome;
}

/** ENVIAR PRO GO: sai da equipe, entra no parque. Devolve o Pokémon, ou null. */
export function enviar(st, idx) {
  if (st.party.length <= 1) return null;
  if (parque(st).length >= G().vagas) return null;
  const [mon] = st.party.splice(idx, 1);
  mon.cpGO = cpDe(mon);
  parque(st).push(mon);
  return mon;
}

/** VOLTAR: sai do parque, entra na equipe ou no box. */
export function voltar(st, mon, guardarNoBox, boxCheio) {
  if (st.party.length >= 6 && boxCheio(st)) return null;
  const i = parque(st).indexOf(mon);
  if (i < 0) return null;
  parque(st).splice(i, 1);
  delete mon.cpGO;
  if (st.party.length < 6) { st.party.push(mon); return "equipe"; }
  guardarNoBox(st, mon);
  return "box";
}

/** o minijogo que este Pokémon libera no GO PLACE */
export function minijogoDe(mon) {
  const sp = DB.SPECIES[mon.species];
  const id = DB.MINIJOGO_POR_TIPO[sp?.types?.[0]] || "corrida";
  return { id, ...DB.MINIJOGOS_GO[id] };
}

/** a chance de a bola segurar, pela qualidade do arremesso (0 a 1) */
export const chanceCaptura = (qualidade) => 0.3 + 0.65 * qualidade;

export const spriteUrl = (dex) => url(`assets/sprites/pokemon/${String(dex).padStart(3, "0")}.png`);
