// A VOZ DA POKÉDEX (pedido do CAIO, 09/nov/2026). Usa o leitor de texto do
// próprio navegador (speechSynthesis); quem escolhe a voz e os ajustes é ele,
// em dev/vozes.html. A escolha fica no localStorage ("pokedex:voz"):
//   nome, tom, vel, volume, robo (palavra por palavra, tom pulando),
//   eco (repete baixinho no fim), zumbido (o "BZZT!" vira um zumbido)
// Este arquivo não depende do jogo: a página das vozes usa ele igualzinho.

export const CHAVE = "pokedex:voz";
export const PADRAO = { tom: 1.6, vel: 1.15, volume: 1, robo: false, eco: false, zumbido: true, idioma: "pt" };

/** as línguas que a Pokédex fala (o texto na tela continua em português) */
export const IDIOMAS = {
  pt: { nome: "PORTUGUÊS", teste: "BZZT! VAMOS ACHAR MAIS POKÉMON!", combina: (v) => /^pt[-_]br/i.test(v.lang) || /brasil|brazil/i.test(v.name) },
  en: { nome: "INGLÊS", teste: "BZZT! LET'S FIND MORE POKÉMON!", combina: (v) => /^en/i.test(v.lang) },
  es: { nome: "ESPANHOL", teste: "¡BZZT! ¡VAMOS A ENCONTRAR MÁS POKÉMON!", combina: (v) => /^es/i.test(v.lang) },
};

/** os jeitos prontos (os botões da página) */
export const PRONTOS = {
  "NORMAL": { tom: 1.6, vel: 1.15, volume: 1, robo: false, eco: false, zumbido: true },
  "VOZ GROSSA": { tom: 0.6, vel: 1.0, volume: 1, robo: false, eco: false, zumbido: true },
  "ROBÔ GRANDÃO": { tom: 0.5, vel: 0.85, volume: 1, robo: true, eco: true, zumbido: true },
  "ROBOZINHO": { tom: 2.0, vel: 1.4, volume: 0.9, robo: true, eco: false, zumbido: true },
};

// AS PRONÚNCIAS (pedido do CAIO): nome -> como ele soa, ex.: CHARIZARD -> "tcha-ri-zárd".
// Ficam no localStorage ("pokedex:pronuncias") e valem em toda fala.
export const CHAVE_PRONUNCIA = "pokedex:pronuncias";
export function lerPronuncias() {
  try { return JSON.parse(localStorage.getItem(CHAVE_PRONUNCIA) || "{}"); } catch { return {}; }
}
export function salvarPronuncias(mapa) {
  try { localStorage.setItem(CHAVE_PRONUNCIA, JSON.stringify(mapa)); } catch {}
}
/** troca cada nome (a palavra inteira, sem ligar pra maiúscula) pelo jeito de falar */
export function aplicarPronuncias(txt, mapa = lerPronuncias()) {
  // TODOS DE UMA VEZ (uma passada só), os compridos primeiro: assim PORYGON-Z e
  // PORYGON2 ganham do PORYGON, e o que já foi trocado não é trocado de novo
  const pares = Object.entries(mapa).filter(([n, s]) => n.trim() && s.trim())
    .map(([n, s]) => [n.trim().toUpperCase(), s.trim()])
    .sort((x, y) => y[0].length - x[0].length);
  if (!pares.length) return String(txt);
  const som = Object.fromEntries(pares);
  const esc = (n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(^|[^\\p{L}\\p{N}])(${pares.map(([n]) => esc(n)).join("|")})(?=[^\\p{L}\\p{N}]|$)`, "giu");
  return String(txt).replace(re, (m, antes, nome) => antes + (som[nome.toUpperCase()] ?? nome));
}

export function lerConfig() {
  try { return { ...PADRAO, ...JSON.parse(localStorage.getItem(CHAVE) || "{}") }; } catch { return { ...PADRAO }; }
}
export function salvarConfig(cfg) {
  try { localStorage.setItem(CHAVE, JSON.stringify(cfg)); } catch {}
}

// A ESCOLHA QUE ESTÁ NO SERVIDOR: a página das vozes grava a escolha também em
// dev/captures/voz_pokedex.log (e as pronúncias em pronuncias_pokedex.log). O
// localStorage é de cada endereço (localhost e 127.0.0.1 são dois), então o
// jogo aberto por outro endereço caía na voz padrão — "a voz errada". Aqui ele
// puxa a cópia do servidor e ela vale. Sem servidor (arquivo solto), fica a local.
export async function puxarDoServidor() {
  if (typeof location === "undefined" || location.protocol === "file:") return;
  const base = new URL("../../", import.meta.url);
  const pega = async (nome) => {
    try {
      const r = await fetch(new URL(`dev/captures/${nome}.log`, base) + `?t=${Date.now()}`);
      return r.ok ? JSON.parse(await r.text()) : null;
    } catch { return null; }
  };
  const [voz, pron] = await Promise.all([pega("voz_pokedex"), pega("pronuncias_pokedex")]);
  try {
    if (voz && typeof voz === "object") localStorage.setItem(CHAVE, JSON.stringify(voz));
    if (pron && typeof pron === "object") localStorage.setItem(CHAVE_PRONUNCIA, JSON.stringify(pron));
  } catch {}
}
puxarDoServidor();

export function vozesDoIdioma(idioma = "pt") {
  if (!window.speechSynthesis) return [];
  const I = IDIOMAS[idioma] || IDIOMAS.pt;
  return speechSynthesis.getVoices().filter(I.combina);
}
export const vozesPtBr = () => vozesDoIdioma("pt");

let somCtx = null;
/** o ZUMBIDO do "BZZT!": dois tons ásperos bem curtinhos */
function zumbido(volume = 1) {
  try {
    somCtx ||= new (window.AudioContext || window.webkitAudioContext)();
    const agora = somCtx.currentTime;
    for (const [f, ini, dur] of [[170, 0, 0.09], [230, 0.07, 0.07]]) {
      const o = somCtx.createOscillator(), g = somCtx.createGain();
      o.type = "sawtooth"; o.frequency.value = f;
      g.gain.setValueAtTime(0.08 * volume, agora + ini);
      g.gain.exponentialRampToValueAtTime(0.001, agora + ini + dur);
      o.connect(g).connect(somCtx.destination);
      o.start(agora + ini); o.stop(agora + ini + dur + 0.02);
    }
  } catch {}
}

/** FALA `txt` com a configuração `cfg` (sem `cfg`, a que o CAIO salvou) */
export function falar(txt, cfg = lerConfig()) {
  if (!window.speechSynthesis) return;
  const vozes = speechSynthesis.getVoices();
  const voz = vozes.find((v) => v.name === cfg.nome) || vozesDoIdioma(cfg.idioma)[0] || null;
  const temBzzt = /BZZT/i.test(txt);
  const frase = aplicarPronuncias(String(txt).replace(/¡?BZZT!?/gi, "").trim().toLowerCase());
  if (!frase) return;
  const fala = (texto, tom, volume) => {
    const u = new SpeechSynthesisUtterance(texto);
    if (voz) { u.voice = voz; u.lang = voz.lang; } else u.lang = { en: "en-US", es: "es-ES" }[cfg.idioma] || "pt-BR";
    u.pitch = Math.max(0, Math.min(2, tom)); u.rate = cfg.vel; u.volume = Math.max(0, Math.min(1, volume));
    speechSynthesis.speak(u);
  };
  speechSynthesis.cancel();
  if (temBzzt && cfg.zumbido) zumbido(cfg.volume);
  setTimeout(() => {
    if (cfg.robo) {
      // JEITO ROBÔ: palavra por palavra, o tom pulando um pouquinho
      frase.split(/\s+/).forEach((p, i) => fala(p, cfg.tom + (i % 2 ? 0.15 : -0.1), cfg.volume));
    } else fala(frase, cfg.tom, cfg.volume);
    // ECO: a última parte de novo, baixinho
    if (cfg.eco) fala(frase.split(/\s+/).slice(-2).join(" "), cfg.tom - 0.1, cfg.volume * 0.3);
  }, temBzzt && cfg.zumbido ? 180 : 0);
}
