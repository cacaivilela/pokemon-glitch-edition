// OS GRITOS DESTE APARELHO: o que se faz no ESTÚDIO DE GRITOS (estudio/).
//
// Lá você edita o grito de um Pokémon, guarda numa GALERIA e ATIVA: daí em
// diante, NESTE jogo, NESTE navegador, aquele Pokémon grita do seu jeito — na
// batalha, no mapa, falando com o companheiro, em todo lugar que chama
// `gritoDe` (src/systems/gritos.js).
//
// Mora no localStorage, como as opções (src/core/opcoes.js), e pelo mesmo
// motivo: é de quem está na frente da tela, não da partida. Nada vai pro save,
// pro servidor ou pros outros jogadores — quem joga no seu save em outro
// aparelho, ou com você na sala online, ouve o grito de sempre. Pra mostrar um
// grito pra alguém, o estúdio dá um CÓDIGO que a pessoa cola na galeria dela.
//
// Formato: { galeria: [{ id, nome, alvo, som, s, arquivo?, edita?, criado }], ativos: { espécie: id } }
// `s` é a lista de sílabas do sintetizador (src/core/audio.js, `grito`):
// [freq. inicial, freq. final, ms, onda, vibrato, ruído].
import { TIMBRES } from "./timbres.js";

const CHAVE = "pge.gritos";
// as oito ondas de sempre e os timbres a mais (src/core/timbres.js)
export const ONDAS = ["q", "p", "f", "t", "s", "o", "n", "_", ...Object.keys(TIMBRES)];

let memo = null;

/** Uma sílaba que veio de fora (localStorage velho, código colado) entra
 *  sempre dentro da faixa do sintetizador, ou não entra. */
export function silabaLimpa(x) {
  if (!Array.isArray(x)) return null;
  const n = (v, a, b, p) => (Number.isFinite(+v) ? Math.min(b, Math.max(a, +v)) : p);
  const onda = ONDAS.includes(x[3]) ? x[3] : "q";
  return [Math.round(n(x[0], 20, 12000, 440)), Math.round(n(x[1], 20, 12000, n(x[0], 20, 12000, 440))),
          Math.round(n(x[2], 4, 1200, 100) * 10) / 10, onda, Math.round(n(x[4], 0, 80, 0)), Math.round(n(x[5], 0, 1, 0) * 100) / 100];
}

// O GRITO DE VERDADE (nov/2026: "no editor de sons dá os gritos velhos"): em vez
// de sílabas, o grito guardado pode ser o ARQUIVO do grito original (o do
// Switch, assets/gritos/) com EFEITOS por cima (`edita`, o mesmo editarGrito do
// jogo, src/core/audio.js). Aqui só entram os efeitos que existem.
export const EFEITOS_TIPO = ["NORMAL", "FOGO", "ÁGUA", "PLANTA", "ELÉTRICO", "GELO", "LUTADOR", "VENENO", "TERRA",
  "VOADOR", "PSÍQUICO", "INSETO", "PEDRA", "FANTASMA", "DRAGÃO", "SOMBRIO", "AÇO", "FADA"];
export const EFEITOS_MAIS = ["robo", "choque", "invertido", "hack", "raio", "ecoRaio", "raioJunto", "espelho"];
const ARQUIVO_OK = /^assets\/gritos\/[a-z0-9_\/-]+\.mp3$/i;

export function editaLimpa(e) {
  if (!e || typeof e !== "object") return { tipos: [], puro: true, semente: 1 };
  const r = { tipos: (Array.isArray(e.tipos) ? e.tipos : []).filter((t) => EFEITOS_TIPO.includes(t)).slice(0, 8), puro: e.puro !== false,
              semente: (+e.semente >>> 0) || 1 };
  for (const k of EFEITOS_MAIS) if (e[k]) r[k] = true;
  if (Number.isFinite(+e.tom) && +e.tom !== 1) r.tom = Math.min(4, Math.max(0.25, +e.tom));
  if (Number.isFinite(+e.traco) && +e.traco > 0) r.traco = Math.min(1, +e.traco);
  if (Number.isFinite(+e.chiado) && +e.chiado > 0) r.chiado = Math.min(0.2, +e.chiado);
  return r;
}

export function gritoLimpo(g) {
  if (!g || typeof g !== "object") return null;
  const s = (Array.isArray(g.s) ? g.s : []).map(silabaLimpa).filter(Boolean).slice(0, 200);
  const ok = (a) => typeof a === "string" && ARQUIVO_OK.test(a) && !a.includes("..");
  // `partes`: o grito EMENDADO de vários arquivos (o MISSINGNO. FANTASMA)
  const partes = (Array.isArray(g.partes) ? g.partes : []).filter((p) => ok(p?.arquivo)).slice(0, 4)
    .map((p) => (p.edita ? { arquivo: p.arquivo, edita: editaLimpa(p.edita) } : { arquivo: p.arquivo }));
  const arquivo = ok(g.arquivo) ? g.arquivo : partes.length ? "" : null;
  if (!s.length && arquivo === null) return null;
  if (arquivo !== null) return {
    id: String(g.id || ""),
    nome: String(g.nome || "SEM NOME").toUpperCase().slice(0, 32),
    alvo: String(g.alvo || ""),
    som: String(g.som || "").toUpperCase().slice(0, 40),
    s: [], arquivo, ...(partes.length && !arquivo ? { partes } : {}), edita: editaLimpa(g.edita),
    criado: +g.criado || Date.now(),
  };
  return {
    id: String(g.id || ""),
    nome: String(g.nome || "SEM NOME").toUpperCase().slice(0, 32),
    alvo: String(g.alvo || ""),
    som: String(g.som || "").toUpperCase().slice(0, 40),
    s,
    criado: +g.criado || Date.now(),
  };
}

export function lerGritos() {
  if (memo) return memo;
  memo = { galeria: [], ativos: {} };
  try {
    const cru = JSON.parse(localStorage.getItem(CHAVE) || "null");
    if (cru && typeof cru === "object") {
      memo.galeria = (Array.isArray(cru.galeria) ? cru.galeria : []).map(gritoLimpo).filter((g) => g && g.id);
      const ids = new Set(memo.galeria.map((g) => g.id));
      for (const [esp, id] of Object.entries(cru.ativos || {})) if (ids.has(id)) memo.ativos[esp] = id;
    }
  } catch { /* navegador sem localStorage: ninguém ativou nada */ }
  return memo;
}

export function gravarGritos(d) {
  memo = d;
  try { localStorage.setItem(CHAVE, JSON.stringify(d)); } catch {}
}

/** O grito que ESTE aparelho ativou pra essa espécie, ou null. */
export function gritoAtivo(especie) {
  const d = lerGritos();
  const id = d.ativos[especie];
  return id ? d.galeria.find((g) => g.id === id) || null : null;
}

// o estúdio aberto noutra aba mudou a galeria: o jogo lê de novo na hora
try {
  addEventListener("storage", (e) => { if (e.key === CHAVE) memo = null; });
} catch { /* fora do navegador */ }

// ------------------------------------------------------------ o CÓDIGO
// Um grito vira um texto pra colar: "PGE-GRITO:" + JSON em base64. Quem cola
// ganha uma CÓPIA na galeria dela (desativada: ativar é escolha de cada um).
const PREFIXO = "PGE-GRITO:";

export function codigoDoGrito(g) {
  const json = JSON.stringify(g.arquivo ? { n: g.nome, a: g.alvo, o: g.som, r: g.arquivo, p: g.partes, e: g.edita } : { n: g.nome, a: g.alvo, o: g.som, s: g.s });
  return PREFIXO + btoa(unescape(encodeURIComponent(json)));
}

export function gritoDoCodigo(txt) {
  const t = String(txt || "").trim();
  const i = t.indexOf(PREFIXO);
  if (i < 0) return null;
  try {
    const d = JSON.parse(decodeURIComponent(escape(atob(t.slice(i + PREFIXO.length).replace(/\s+/g, "")))));
    return gritoLimpo({ id: "x", nome: d.n, alvo: d.a, som: d.o, s: d.s, arquivo: d.r, partes: d.p, edita: d.e });
  } catch { return null; }
}
