import { url as arquivo } from "./base.js";
import { TIMBRES } from "./timbres.js";
import { tocarGB, tocarMusicaGB } from "./gb.js";
import { GB_BASES, GBC_BASES } from "../data/gritos-gb.js";
import { GB_MUSICAS, GB_ONDAS } from "../data/musicas-gb.js";
import { VOLUMES_MUSICA } from "../data/volumes-musica.js";
// Chiptune com WebAudio: bleeps, e musica de varios canais (melodia, contracanto,
// baixo e percussao) agendada no relogio do proprio audio — sem setTimeout no meio,
// que e o que fazia a musica antiga tropecar quando a aba engasgava.
let ctxA = null;
let master = null;
// as músicas do Game Boy já geradas (nome -> { buf, inicio, fim })
const musicasGB = new Map();
// os gritos em arquivo já carregados (url -> AudioBuffer, ou null se não tem)
const gritosArquivo = new Map(), gritosPedidos = new Map();
let muted = false;
let loopTimer = null;
let musica = null;       // { song, beat, pos[], t[] }
let musicaTimer = null;
let tocando = [];        // osciladores agendados, pra conseguir cortar na hora
let elMusica = null;     // <audio> com arquivo do jogador, quando existir
let faixaAtual = null;
const arquivos = new Map();   // nome -> url do arquivo (ou null: nao tem)
const EXTS = ["ogg", "mp3", "wav", "m4a"];

/** procura assets/music/<nome>.<ext>; devolve a url ou null */
async function procurarArquivo(nome) {
  for (const ext of EXTS) {
    const url = arquivo(`assets/music/${nome}.${ext}`);
    try {
      const r = await fetch(url, { method: "HEAD" });
      if (r.ok) return url;
    } catch { /* servidor fora: segue no chiptune */ }
  }
  return null;
}

const SEMI = { C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5, "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11 };

// O canal de pulso do GBA tem 4 larguras (12,5% / 25% / 50% / 75%). E cada uma
// tem um "caráter" — 12,5% é fininho e nasal, 50% é a onda quadrada cheia.
const pulsos = new Map();
/** A onda de um TIMBRE A MAIS (src/core/timbres.js) pelos harmônicos, feita uma vez */
const ondasFeitas = new Map();
function ondaHarm(cod, h) {
  if (ondasFeitas.has(cod)) return ondasFeitas.get(cod);
  const w = ac().createPeriodicWave(new Float32Array(h.length), Float32Array.from(h));
  ondasFeitas.set(cod, w);
  return w;
}
/** uma curva de distorção (`fn` de -1..1 pra -1..1), feita uma vez */
const curvasTimbre = new Map();
function curvaTimbre(chave, fn) {
  if (!curvasTimbre.has(chave)) {
    const n = 1024, k = new Float32Array(n);
    for (let i = 0; i < n; i++) k[i] = fn((i / (n - 1)) * 2 - 1);
    curvasTimbre.set(chave, k);
  }
  return curvasTimbre.get(chave);
}

function ondaPulso(duty) {
  if (pulsos.has(duty)) return pulsos.get(duty);
  const n = 24, real = new Float32Array(n), imag = new Float32Array(n);
  for (let k = 1; k < n; k++) {                 // série de Fourier de uma onda de pulso
    imag[k] = (2 / (k * Math.PI)) * Math.sin(Math.PI * k * duty);
  }
  const w = ac().createPeriodicWave(real, imag, { disableNormalization: false });
  pulsos.set(duty, w);
  return w;
}

/** eco curto: é o que dá "espaço" nas trilhas de GBA sem gastar canal */
let eco = null;
// O FIO DAS MÚSICAS: toda nota de música passa por aqui antes do master. O
// ganho dele é o AJUSTE da música que está tocando (src/data/volumes-musica.js),
// medido pra todas soarem na mesma altura (dev/volumes.html)
let fioMusica = null;
function saidaMusica() {
  if (fioMusica) return fioMusica;
  fioMusica = ac().createGain();
  fioMusica.gain.value = 1;
  fioMusica.connect(master);
  return fioMusica;
}

/** O GRITO VIRANDO ESTOURO DE FOGO (o fundo do título, src/scenes/fundo-fogos.js):
 *  a voz passa por uma saturação forte (estoura, chia) e por um passa-baixa
 *  que começa aberto e vai fechando — o grito vira um BUUUM que abafa. É o
 *  grito daquele Pokémon, só que com cara de explosão. Devolve a entrada e a
 *  saída da cadeia. */
function cadeiaEstouro(c, dur) {
  const satura = c.createWaveShaper();
  const n = 1024, curva = new Float32Array(n);
  for (let i = 0; i < n; i++) { const x = (i / (n - 1)) * 2 - 1; curva[i] = Math.tanh(x * 6); }
  satura.curve = curva;
  const abafa = c.createBiquadFilter();
  abafa.type = "lowpass";
  abafa.Q.value = 2;
  const t = c.currentTime;
  // (nov/2026, "mais pra uma explosão do que pro grito"): o grito fica bem
  // abafado e baixo, por baixo do estouro de verdade (Audio2.fogoDeArtificio)
  abafa.frequency.setValueAtTime(2200, t);
  abafa.frequency.exponentialRampToValueAtTime(260, t + Math.max(0.3, dur * 1.1));
  const vol = c.createGain();
  vol.gain.value = 0.025;              // era 0.45, 0.18, 0.07: agora quem manda é o estouro
  satura.connect(abafa).connect(vol);
  return { entrada: satura, saida: vol };
}

/** O GRITO DA MEGA (pedido do CAIO, nov/2026: "o grito do pkmn mega, tipo o
 *  grito vindo de uma câmara de metal"): a voz batendo em paredes de metal —
 *  três ecos curtinhos que voltam muitas vezes (o "zumbido" do metal), um
 *  realce no agudo e a voz de verdade junto. */
function cadeiaMetal(c) {
  const entrada = c.createGain(), saida = c.createGain();
  saida.gain.value = 0.9;
  const seco = c.createGain(); seco.gain.value = 0.55;
  entrada.connect(seco).connect(saida);
  for (const [tempo, volta] of [[0.0071, 0.72], [0.0113, 0.68], [0.0173, 0.62]]) {
    const atraso = c.createDelay(0.05); atraso.delayTime.value = tempo;
    const fb = c.createGain(); fb.gain.value = volta;
    const sai = c.createGain(); sai.gain.value = 0.3;
    entrada.connect(atraso); atraso.connect(fb).connect(atraso); atraso.connect(sai).connect(saida);
  }
  const brilho = c.createBiquadFilter();
  brilho.type = "peaking"; brilho.frequency.value = 2600; brilho.Q.value = 1.2; brilho.gain.value = 7;
  const fim = c.createGain();
  saida.connect(brilho).connect(fim);
  return { entrada, saida: fim };
}

/** pra onde o grito sai (o MASTER; na mistura da fusão, o volume daquela parte) */
let saidaGrito = null;

/** os sons em arquivo já carregados (Audio2.somArquivo): caminho -> AudioBuffer */
const sonsArquivo = new Map();

function barramentoEco() {
  if (eco) return eco;
  const c = ac();
  const entrada = c.createGain();
  const atraso = c.createDelay(1);
  atraso.delayTime.value = 0.19;
  const realim = c.createGain();
  realim.gain.value = 0.24;
  const nivel = c.createGain();
  nivel.gain.value = 0.5;
  entrada.connect(atraso);
  atraso.connect(realim).connect(atraso);
  atraso.connect(nivel).connect(master);
  eco = entrada;
  return eco;
}

/** "A4" / "C#3" -> Hz. "-" (ou vazio) e pausa. */
export function nota(n) {
  if (!n || n === "-") return 0;
  const m = /^([A-G]#?)(-?\d)$/.exec(n);
  if (!m) return 0;
  return 440 * Math.pow(2, (SEMI[m[1]] + (+m[2] + 1) * 12 - 69) / 12);
}

/** curva do pedal de distorção: quanto maior o ganho, mais quadrada e suja */
const curvas = new Map();
function curvaDistorcao(ganho) {
  if (curvas.has(ganho)) return curvas.get(ganho);
  const n = 2048, curva = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1;
    curva[i] = Math.tanh(x * ganho) * 0.8;
  }
  curvas.set(ganho, curva);
  return curva;
}

function ac() {
  if (!ctxA) {
    ctxA = new (window.AudioContext || window.webkitAudioContext)();
    master = ctxA.createGain();
    master.gain.value = 0.16;
    master.connect(ctxA.destination);
    // os sons em arquivo já vêm carregando, pra a primeira vez não sair o
    // som reserva (o SHINY do LEGENDS ARCEUS)
    setTimeout(() => { for (const c of ["assets/sons/shiny-pla.wav", "assets/sons/shiny-pla.mp3", "assets/sons/miniors-shiny.mp3"]) if (!sonsArquivo.has(c)) Audio2.somArquivoCarregar?.(c); }, 0);
  }
  if (ctxA.state === "suspended" && !document.hidden) ctxA.resume();
  return ctxA;
}

// aba escondida, fechada ou computador dormindo: o som todo para; volta
// quando a aba aparece de novo
let pausadoPorSumir = false;
function somSome() {
  if (ctxA && ctxA.state === "running") ctxA.suspend();
  if (elMusica && !elMusica.paused) { elMusica.pause(); pausadoPorSumir = true; }
}
function somVolta() {
  if (ctxA && ctxA.state === "suspended") ctxA.resume();
  if (elMusica && pausadoPorSumir) elMusica.play().catch(() => {});
  pausadoPorSumir = false;
}
if (typeof document !== "undefined" && document.addEventListener) {
  document.addEventListener("visibilitychange", () => (document.hidden ? somSome() : somVolta()));
  addEventListener("pagehide", somSome);
  document.addEventListener("freeze", somSome);
  addEventListener("pageshow", () => { if (!document.hidden) somVolta(); });
}

/** O GRITO EDITADO DAS FORMAS -BRAG E -HACK (pedido do CAIO, nov/2026: "depende
 *  do pokémon, muda de jeito diferente"): o grito ORIGINAL do Pokémon, mudado
 *  pelos TIPOS da forma — cada tipo tem o seu jeito (ÁGUA borbulha, FOGO
 *  estala, FANTASMA toca ao contrário...) — e a -HACK ainda ganha o GLITCH
 *  (engasga, vira chip estragado, um pedaço ao contrário). `semente` (do id)
 *  varia um pouco de bicho pra bicho, sempre igual pro mesmo.
 *  Recebe as amostras (mono) e devolve { dados, tom }. */
function editarGrito(dados, sr, ed) {
  let x = Float32Array.from(dados), tom = 1;
  let seed = ed.semente >>> 0 || 1;
  const rnd = () => { seed = (seed * 1103515245 + 12345) >>> 0; return seed / 4294967296; };
  const n = () => x.length;
  const eco = (ms, ganho, vezes = 1) => {
    const d = Math.round(sr * ms / 1000), y = new Float32Array(n() + d * vezes);
    for (let i = 0; i < n(); i++) for (let k = 0; k <= vezes; k++) y[i + d * k] += x[i] * Math.pow(ganho, k);
    x = y;
  };
  const tremolo = (hz, fundo) => { for (let i = 0; i < n(); i++) x[i] *= 1 - fundo * (0.5 + 0.5 * Math.sin(2 * Math.PI * hz * i / sr)); };
  const abafa = (janela) => { const y = new Float32Array(n()); let soma = 0; for (let i = 0; i < n(); i++) { soma += x[i]; if (i >= janela) soma -= x[i - janela]; y[i] = soma / janela; } x = y; };
  const satura = (forca) => { for (let i = 0; i < n(); i++) x[i] = Math.tanh(x[i] * forca) / Math.tanh(forca); };
  const pente = (ms, volta) => { const d = Math.max(1, Math.round(sr * ms / 1000)); for (let i = d; i < n(); i++) x[i] += x[i - d] * volta; };
  const vibrato = (hz, ms) => { const y = new Float32Array(n()); const fundo = sr * ms / 1000; for (let i = 0; i < n(); i++) { const j = i - fundo * (1 + Math.sin(2 * Math.PI * hz * i / sr)); const a = Math.floor(j), f = j - a; y[i] = a >= 0 && a + 1 < n() ? x[a] * (1 - f) + x[a + 1] * f : 0; } x = y; };
  const aoContrario = (de = 0, ate = n()) => { const y = x.slice(de, ate).reverse(); x.set(y, de); };
  const oitavaAcima = (ganho) => { for (let i = 0; i < n(); i++) x[i] += (x[(i * 2) % n()] || 0) * ganho; };
  const TIPOS = {
    "ÁGUA": () => { abafa(6); tremolo(10 + rnd() * 6, 0.5); },
    FOGO: () => { satura(2.2); for (let i = 0; i < n(); i++) if (rnd() < 0.0025) x[i] += (rnd() - 0.5) * 1.4; },
    "ELÉTRICO": () => { const hz = 70 + rnd() * 60; for (let i = 0; i < n(); i++) x[i] *= 0.55 + 0.45 * Math.sign(Math.sin(2 * Math.PI * hz * i / sr)); },
    FANTASMA: () => { aoContrario(); eco(140, 0.45, 3); },
    PLANTA: () => { vibrato(1.5, 6); eco(22, 0.6); },
    PEDRA: () => { pente(4 + rnd() * 2, 0.55); },
    "AÇO": () => { pente(2.5 + rnd(), 0.65); },
    VOADOR: () => { tom *= 1.12; tremolo(16 + rnd() * 6, 0.35); },
    INSETO: () => { tremolo(32 + rnd() * 10, 0.7); },
    "PSÍQUICO": () => { vibrato(5 + rnd() * 3, 2.5); },
    VENENO: () => { tremolo(5 + rnd() * 2, 0.45); abafa(4); },
    GELO: () => { oitavaAcima(0.3); eco(110, 0.35, 2); },
    "DRAGÃO": () => { tom *= 0.8; satura(1.8); },
    LUTADOR: () => { satura(3); x = x.slice(0, Math.max(1, Math.round(n() * 0.75))); },
    SOMBRIO: () => { tom *= 0.85; const cauda = x.slice().reverse(); eco(0, 0); const y = new Float32Array(n() + cauda.length); y.set(x); for (let i = 0; i < cauda.length; i++) y[n() + i] += cauda[i] * 0.3 * (1 - i / cauda.length); x = y; },
    FADA: () => { tom *= 1.15; eco(70, 0.4, 2); },
    TERRA: () => { tom *= 0.85; abafa(10); },
    NORMAL: () => { eco(35, 0.5); },
    // ROBÔ (o PARASECTROM): a voz passa num motor — metálica (modulada num
    // seno grave, com ressonância de lata). Sem o "chip rachado": ele chiava
    // (o CAIO pediu pra tirar o chiado)
    ROBO: () => {
      const hz = 140 + rnd() * 40;
      for (let i = 0; i < n(); i++) x[i] *= Math.sin(2 * Math.PI * hz * i / sr) * 0.7 + 0.3;
      pente(3, 0.6);
    },
    // ELETROCUTADO: a voz treme e corta com o choque — picotada em pedacinhos
    // de silêncio, com o tom pulando, chiado de faísca e estalos fortes
    CHOQUE: () => {
      const corte = Math.round(sr * 0.018);
      for (let i = 0; i < n(); i++) {
        const bloco = Math.floor(i / corte);
        if (((bloco * 2654435761) >>> 0) % 5 === 0) x[i] *= 0.08;                 // o choque corta a voz
        x[i] += Math.sign(Math.sin(2 * Math.PI * 1900 * i / sr)) * 0.07 * Math.abs(x[i] * 3);   // o zumbido em cima da voz
        if (rnd() < 0.004) x[i] += (rnd() - 0.5) * 1.6;                          // os estalos
      }
      vibrato(28 + rnd() * 10, 1.2);                                              // o tom tremendo
    },
    // INVERTIDO: o grito inteiro de trás pra frente
    INVERTIDO: () => aoContrario(),
    GLITCH: () => {
      // engasga: o comecinho repete
      const pedaco = Math.round(sr * (0.04 + rnd() * 0.04)), vezes = 2 + Math.floor(rnd() * 2);
      const ini = x.slice(0, pedaco), y = new Float32Array(n() + pedaco * vezes);
      for (let k = 0; k < vezes; k++) y.set(ini, k * pedaco);
      y.set(x, pedaco * vezes); x = y;
      // chip estragado: poucos degraus e amostra segurada
      const segura = 2 + Math.floor(rnd() * 3); let ultimo = 0;
      for (let i = 0; i < n(); i++) { if (i % segura === 0) ultimo = Math.round(x[i] * 7) / 7; x[i] = ultimo; }
      // um pedaço do meio ao contrário
      const m = Math.round(n() * (0.4 + rnd() * 0.2)), t2 = Math.round(sr * 0.08);
      aoContrario(m, Math.min(n(), m + t2));
    },
  };
  for (const tipo of ed.tipos || []) TIPOS[tipo]?.();
  if (ed.choque) TIPOS.CHOQUE();
  if (ed.robo) TIPOS.ROBO();
  if (ed.invertido) TIPOS.INVERTIDO();
  // UM TRAÇO DO ORIGINAL (`traco`, de 0 a 1): o grito de sempre, pra frente e
  // sem efeito nenhum, misturado baixinho por baixo — dá pra reconhecer quem é
  if (ed.traco) {
    const y = new Float32Array(Math.max(n(), dados.length));
    y.set(x);
    for (let i = 0; i < dados.length; i++) y[i] = y[i] * (1 - ed.traco * 0.5) + dados[i] * ed.traco;
    x = y;
  }
  if (ed.hack) TIPOS.GLITCH();
  // O RAIO NO FIM (`raio`): depois do grito, a EXPLOSÃO do trovão rolando e
  // apagando (ruído grave). Sem o estalo nem os estalinhos: o CAIO tirou
  if (ed.raio) {
    const dur = Math.round(sr * 0.95), trovao = new Float32Array(dur);
    let grave = 0, medio = 0;
    for (let i = 0; i < dur; i++) {
      const branco = rnd() * 2 - 1;
      grave += (branco - grave) * 0.02;            // o ronco: ruído bem abafado
      medio += (branco - medio) * 0.15;
      const apaga = Math.exp(-i / (sr * 0.28)) * (0.85 + 0.15 * Math.sin(i / (sr * 0.045)));   // rola enquanto apaga
      let v = grave * 5 * apaga + medio * 0.6 * Math.exp(-i / (sr * 0.08));
      trovao[i] = Math.max(-1, Math.min(1, v));
    }
    // `ecoRaio`: o estrondo ECOA três vezes, cada vez mais longe (as MEGAS)
    let fimTrovao = trovao;
    if (ed.ecoRaio) {
      const passo = Math.round(sr * 0.28), ecoado = new Float32Array(dur + passo * 3);
      for (let k = 0; k <= 3; k++) for (let i = 0; i < dur; i++) ecoado[i + passo * k] += trovao[i] * Math.pow(0.45, k);
      fimTrovao = ecoado;
    }
    if (ed.raioJunto) {
      // `raioJunto` (as MEGAS): a explosão começa JUNTO com o grito, misturada
      const y = new Float32Array(Math.max(n(), fimTrovao.length));
      y.set(x);
      for (let i = 0; i < fimTrovao.length; i++) y[i] += fimTrovao[i];
      x = y;
    } else {
      const y = new Float32Array(n() + fimTrovao.length);
      y.set(x); y.set(fimTrovao, n()); x = y;
    }
  }
  // CHIADO (`chiado`, de 0 a 1 do volume máximo): um ruído bem baixinho por baixo
  if (ed.chiado) for (let i = 0; i < n(); i++) x[i] += (rnd() * 2 - 1) * ed.chiado;
  if (!ed.puro) tom *= 0.94 + rnd() * 0.12;   // e um tiquinho de tom de cada um (`puro`: sem)
  // `tom` (o ESTÚDIO DE GRITOS, nov/2026): mais fino ou mais grosso, escolhido no deslizante
  if (Number.isFinite(ed.tom) && ed.tom > 0) tom *= ed.tom;
  // `espelho` (o botão AO CONTRÁRIO do site dos gritos): o grito PRONTO, com todos
  // os efeitos, de trás pra frente — o que já era invertido volta pro normal
  if (ed.espelho) x.reverse();
  // sem estourar: o mais alto volta pra perto de 1
  let pico = 0; for (let i = 0; i < n(); i++) pico = Math.max(pico, Math.abs(x[i]));
  if (pico > 1) for (let i = 0; i < n(); i++) x[i] /= pico;
  return { dados: x, tom };
}
const gritosEditados = new Map();

/** O GRITO EMENDADO: `partes` = [{ arquivo, edita? }, ...]. Cada arquivo é
 *  editado sozinho (editarGrito, com o `tom` dele) e dá a SUA fatia: com 3
 *  partes, o começo do 1º, o meio do 2º e o fim do 3º (como as sílabas da
 *  fusão tripla). As emendas têm um cruzamento curtinho, sem estalo. */
async function juntarPartes(c, partes) {
  const bufs = await Promise.all(partes.map((p) => fetch(arquivo(p.arquivo))
    .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject())).then((b) => c.decodeAudioData(b))));
  const sr = c.sampleRate, n = partes.length, fatias = [];
  bufs.forEach((buf, i) => {
    let d = buf.getChannelData(0), t = 1;
    if (partes[i].edita) { const r = editarGrito(d, buf.sampleRate, partes[i].edita); d = r.dados; t = r.tom; }
    if (t !== 1) {             // o tom da parte: reamostrada (mais fina = mais curta)
      const y = new Float32Array(Math.max(1, Math.floor(d.length / t)));
      for (let k = 0; k < y.length; k++) { const j = k * t, a = Math.floor(j), f = j - a; y[k] = (d[a] || 0) * (1 - f) + (d[a + 1] || 0) * f; }
      d = y;
    }
    // sem o silêncio do começo e do fim, pra fatia cair no som
    let ini = 0, fim = d.length;
    while (ini < fim && Math.abs(d[ini]) < 0.01) ini++;
    while (fim > ini && Math.abs(d[fim - 1]) < 0.01) fim--;
    const L = fim - ini;
    fatias.push(d.subarray(ini + Math.floor((L * i) / n), ini + Math.floor((L * (i + 1)) / n)));
  });
  const cruza = Math.round(sr * 0.012);
  const total = fatias.reduce((a, f) => a + f.length, 0) - cruza * (n - 1);
  const out = new Float32Array(Math.max(1, total));
  let pos = 0;
  fatias.forEach((f, i) => {
    for (let k = 0; k < f.length; k++) {
      let g = 1;
      if (i > 0 && k < cruza) g = k / cruza;
      if (i < n - 1 && k >= f.length - cruza) g = (f.length - k) / cruza;
      if (pos + k < out.length) out[pos + k] += f[k] * g;
    }
    pos += f.length - cruza;
  });
  const b = c.createBuffer(1, out.length, sr);
  b.copyToChannel(out, 0);
  return b;
}
const ruidosProntos = new Map();
// os atrasos MEDIDOS (dev/atrasos.html, nov/2026), em segundos: quanto cada
// instrumento demora pra soar depois do instante pedido (a bateria: 0)
let ADIANTA_GUITARRA = 0.0043;
let ADIANTA_NOTA = 0.0089;   // os chiados da bateria, por duração (_bateriaEm)
/** O VOLUME DOS GRITOS EM ARQUIVO IGUAL AO DOS DO GAME BOY (pedido do CAIO, nov/2026):
 *  cada arquivo (Hoenn em diante, os do Switch, as formas) tem um volume; aqui
 *  sai o ganho que deixa o barulho dele (onde tem som, sem os silêncios) na
 *  altura média dos gritos do Game Boy no jogo (medida: 0,185). */
const ALTURA_DO_GB = 0.185;
const ganhos = new WeakMap();
function ganhoDoGrito(buf) {
  if (ganhos.has(buf)) return ganhos.get(buf);
  const d = buf.getChannelData(0);
  let soma = 0, n = 0;
  for (let i = 0; i < d.length; i++) if (Math.abs(d[i]) > 0.01) { soma += d[i] * d[i]; n++; }
  const g = n ? Math.max(0.2, Math.min(3, ALTURA_DO_GB / Math.sqrt(soma / n))) : 0.85;
  ganhos.set(buf, g);
  return g;
}

// medindo o volume (dev/volumes.html): o ajuste fica em 1
let medindo = false;

export const Audio2 = {
  unlock() { ac(); },
  /** MEDE O ATRASO de cada instrumento (dev/atrasos.html): toca, num áudio de
   *  mentira (OfflineAudioContext), só aquele instrumento no instante 0,5 s e
   *  devolve em que milésimo ele começa a soar de verdade (o primeiro ponto
   *  acima de 10% do mais alto). Nada sai no alto-falante. */
  async medirAtrasos(casos) {
    const salvo = { ctxA, master, fioMusica, eco, muted };
    const out = {};
    try {
      for (const [nome, tocar] of Object.entries(casos)) {
        const off = new OfflineAudioContext(1, 44100 * 1.5, 44100);
        ctxA = off; master = off.createGain(); master.connect(off.destination);
        fioMusica = null; eco = null; muted = false;
        tocar(this, 0.5);
        const buf = await off.startRendering();
        const d = buf.getChannelData(0);
        let pico = 0;
        for (let i = 0; i < d.length; i++) pico = Math.max(pico, Math.abs(d[i]));
        let i0 = d.findIndex((v) => Math.abs(v) > pico * 0.1);
        out[nome] = { comeca_ms: +((i0 / 44100 - 0.5) * 1000).toFixed(2), pico: +pico.toFixed(3) };
      }
    } finally {
      ({ ctxA, master, fioMusica, eco, muted } = salvo);
    }
    return out;
  },
  /** o quanto a guitarra começa adiantada (segundos) — o medido */
  set adiantaGuitarra(s) { ADIANTA_GUITARRA = s; },
  set adiantaNota(s) { ADIANTA_NOTA = s; },
  /** PRA MEDIR (dev/volumes.html): desliga os ajustes (ou não, `comAjuste`, pra
   *  conferir) e devolve um analisador ligado no fio das músicas */
  medidorMusica(comAjuste = false) {
    medindo = !comAjuste;
    const c = ac();
    // o ouvido escuta menos o grave e mais o meio e o agudo: antes de medir, o
    // som passa pelo mesmo "filtro de ouvido" que as rádios usam pra medir
    // volume (um corta-grave e um reforço em cima, a curva K)
    const corta = c.createBiquadFilter();
    corta.type = "highpass"; corta.frequency.value = 120; corta.Q.value = 0.7;
    const reforco = c.createBiquadFilter();
    reforco.type = "highshelf"; reforco.frequency.value = 1500; reforco.gain.value = 4;
    const a = c.createAnalyser();
    a.fftSize = 2048;
    saidaMusica().connect(corta).connect(reforco).connect(a);
    return a;
  },
  get musicaAtual() { return musica?.song || null; },
  toggleMute() {
    muted = !muted;
    if (master) master.gain.value = muted ? 0 : 0.16;
    if (elMusica) elMusica.volume = muted ? 0 : 0.5;
    return muted;
  },
  get muted() { return muted; },

  tone(freq, dur = 0.08, type = "square", vol = 1) {
    if (muted || !freq) return;
    const c = ac();
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.35 * vol, c.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    o.connect(g).connect(master);
    o.start();
    o.stop(c.currentTime + dur + 0.02);
  },

  noise(dur = 0.12, vol = 0.6) {
    if (muted) return;
    const c = ac();
    const n = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, n, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = c.createBufferSource();
    const g = c.createGain();
    g.gain.value = 0.3 * vol;
    src.buffer = buf;
    src.connect(g).connect(master);
    src.start();
  },

  /** O ESTOURO DE UM FOGO DE ARTIFÍCIO (o fundo do título, src/scenes/fundo-fogos.js):
   *  o BUM grave que desce, o chiado da pólvora abafando e os estalinhos das
   *  faíscas caindo. `escala` < 1 = fogo pequeno (mais agudo e mais curto). */
  fogoDeArtificio(escala = 1, vol = 1) {
    if (muted) return;
    const c = ac(), t = c.currentTime, peq = escala < 1;
    const saida = c.createGain();
    saida.gain.value = 0.55 * vol;
    saida.connect(master);
    // 1. o BUM: um seno que despenca do grave pro mais grave
    const o = c.createOscillator(), go = c.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(peq ? 150 : 95, t);
    o.frequency.exponentialRampToValueAtTime(peq ? 60 : 32, t + 0.45);
    go.gain.setValueAtTime(0.0001, t);
    go.gain.exponentialRampToValueAtTime(peq ? 0.5 : 0.9, t + 0.01);
    go.gain.exponentialRampToValueAtTime(0.0001, t + (peq ? 0.45 : 0.75));
    o.connect(go).connect(saida);
    o.start(t); o.stop(t + 0.8);
    // 2. o chiado da explosão: ruído que começa aberto e vai abafando
    const dur = peq ? 0.6 : 1.1;
    const n = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const r = c.createBufferSource(), f = c.createBiquadFilter(), gr = c.createGain();
    r.buffer = buf;
    f.type = "lowpass";
    f.frequency.setValueAtTime(peq ? 6000 : 4000, t);
    f.frequency.exponentialRampToValueAtTime(peq ? 500 : 250, t + dur);
    gr.gain.setValueAtTime(0.0001, t);
    gr.gain.exponentialRampToValueAtTime(peq ? 0.35 : 0.55, t + 0.008);
    gr.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    r.connect(f).connect(gr).connect(saida);
    r.start(t);
    // 3. os estalinhos: cliques curtos e agudos espalhados enquanto as faíscas caem
    const qtos = peq ? 7 : 14;
    for (let k = 0; k < qtos; k++) {
      const q = t + 0.25 + Math.random() * (peq ? 0.6 : 1.1);
      const cn = Math.floor(c.sampleRate * 0.012), cb = c.createBuffer(1, cn, c.sampleRate), cd = cb.getChannelData(0);
      for (let i = 0; i < cn; i++) cd[i] = (Math.random() * 2 - 1) * (1 - i / cn);
      const cs = c.createBufferSource(), cf = c.createBiquadFilter(), cg = c.createGain();
      cs.buffer = cb;
      cf.type = "highpass"; cf.frequency.value = 2500 + Math.random() * 3000;
      cg.gain.value = 0.08 + Math.random() * 0.12;
      cs.connect(cf).connect(cg).connect(saida);
      cs.start(q);
    }
  },

  blip() { this.tone(880, 0.03, "square", 0.5); },
  select() { this.tone(660, 0.05); this.tone(990, 0.06); },
  cancel() { this.tone(330, 0.07, "square", 0.7); },
  bump() { this.tone(140, 0.06, "square", 0.6); },
  hit() { this.noise(0.1, 0.9); },
  faint() { for (let i = 0; i < 6; i++) setTimeout(() => this.tone(500 - i * 70, 0.09, "sawtooth", 0.6), i * 55); },
  /** O BAQUE de quem caiu de costas no chão (a animação de desmaio, nov/2026) */
  baque() {
    if (muted) return;
    const c = ac(), t = c.currentTime + 0.01;
    const o = c.createOscillator(), g = c.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.18);
    g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    o.connect(g).connect(master); o.start(t); o.stop(t + 0.25);
    this.noise(0.07, 0.5);
  },
  /** VOLTANDO PRA POKÉBOLA: o "fiuuum" do raio que puxa o Pokémon pra dentro
   *  (sobe rápido e desce, com um chiado de energia por baixo) */
  voltaBola() {
    if (muted) return;
    const c = ac(), t = c.currentTime + 0.01, dur = 0.42;
    for (const [tipo, vol, mult] of [["square", 0.16, 1], ["sawtooth", 0.08, 1.5]]) {
      const o = c.createOscillator(), g = c.createGain(), f = c.createBiquadFilter();
      o.type = tipo;
      o.frequency.setValueAtTime(300 * mult, t);
      o.frequency.exponentialRampToValueAtTime(1500 * mult, t + 0.1);
      o.frequency.exponentialRampToValueAtTime(220 * mult, t + dur);
      f.type = "lowpass"; f.frequency.value = 5000;
      g.gain.setValueAtTime(0.001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.03);
      g.gain.setValueAtTime(vol, t + dur * 0.6); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(f).connect(g).connect(master); o.start(t); o.stop(t + dur + 0.02);
    }
    // o chiado do raio
    const n = Math.floor(c.sampleRate * dur), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * i / n) * 0.35;
    const src = c.createBufferSource(), bp = c.createBiquadFilter();
    src.buffer = b; bp.type = "bandpass"; bp.Q.value = 2;
    bp.frequency.setValueAtTime(1200, t); bp.frequency.exponentialRampToValueAtTime(4000, t + 0.1); bp.frequency.exponentialRampToValueAtTime(600, t + dur);
    src.connect(bp).connect(master); src.start(t);
  },
  heal() { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => this.tone(f, 0.1), i * 70)); },
  /** O PLIM DO SHINY: um brilho subindo bem agudo, e o eco dele mais baixo */
  shiny() {
    // O SOM DO SHINY DO LEGENDS ARCEUS (o CAIO pediu: "copie o som de shiny do
    // legends arceus"), em assets/sons/shiny-pla.mp3. Enquanto o arquivo não
    // chega (ou se ele faltar), o plim inventado de antes.
    // (o que você editou no EDITOR DE SONS, dev/editorsom.html, vem antes: .wav)
    if (this.somEditado("shiny-pla", 0.8)) return;
    [2093, 2637, 3136, 4186, 3136, 4186].forEach((f, i) => setTimeout(() => this.tone(f, 0.07, "triangle", 0.55), i * 45));
    [2637, 3136, 4186].forEach((f, i) => setTimeout(() => this.tone(f, 0.09, "square", 0.18), 330 + i * 60));
  },

  /** O SOM DO LUMINOSO, feito do som do SHINY (o do LEGENDS ARCEUS, ou o que
   *  você editou). "Tá parecido d+" (CAIO): então primeiro o shiny DE TRÁS PRA
   *  FRENTE (a luz sendo sugada), aí ele inteiro mais agudo com uma oitava em
   *  cima (acende), e um acorde tremendo que fica no ar. Sem o arquivo ainda:
   *  o plim inventado, aceso. */
  luminoso() {
    if (muted) return;
    const c = ac();
    const wav = sonsArquivo.get("assets/sons/shiny-pla.wav");
    const buf = wav || sonsArquivo.get("assets/sons/shiny-pla.mp3");
    if (wav === undefined) this.somArquivoCarregar("assets/sons/shiny-pla.wav");
    if (!buf) {
      if (buf === undefined) this.somArquivoCarregar("assets/sons/shiny-pla.mp3");
      this.shiny();
      [4186, 5274, 6272].forEach((f, i) => setTimeout(() => this.tone(f, 0.16, "sine", 0.4), 420 + i * 90));
      return;
    }
    const t = c.currentTime + 0.01;
    // o eco da luz: volta várias vezes, cada vez mais fraco e mais agudo
    const atraso = c.createDelay(1), realim = c.createGain(), corta = c.createBiquadFilter(), sai = c.createGain();
    atraso.delayTime.value = 0.17;
    realim.gain.value = 0.5;
    corta.type = "highpass"; corta.frequency.value = 1200;
    sai.gain.value = 0.3;
    atraso.connect(corta).connect(realim).connect(atraso);
    corta.connect(sai).connect(master);
    const toca = (b, tom, quando, vol, comEco) => {
      const src = c.createBufferSource(), g = c.createGain();
      src.buffer = b;
      src.playbackRate.value = tom;
      g.gain.value = vol;
      src.connect(g).connect(master);
      if (comEco) g.connect(atraso);
      src.start(t + quando);
      return b.duration / tom;
    };
    // 1. A LUZ SENDO SUGADA: o shiny de trás pra frente (guardado na 1ª vez)
    if (!this._shinyAoContrario || this._shinyAoContrario.de !== buf) {
      const r = c.createBuffer(buf.numberOfChannels, buf.length, buf.sampleRate);
      for (let k = 0; k < buf.numberOfChannels; k++) r.copyToChannel(buf.getChannelData(k).slice().reverse(), k);
      this._shinyAoContrario = { de: buf, r };
    }
    const sugada = toca(this._shinyAoContrario.r, 1.26, 0, 0.45, false);
    // 2. ACENDE: o shiny inteiro mais agudo, com a cópia uma oitava acima
    const acende = sugada - 0.05;
    toca(buf, 1.26, acende, 0.7, true);
    toca(buf, 2.52, acende + 0.04, 0.2, true);
    // 3. O ACORDE QUE FICA NO AR, tremendo de leve
    const quando = t + acende + 0.25;
    [1568, 1976, 2349, 3136].forEach((f, i) => {
      const o = c.createOscillator(), g = c.createGain(), lfo = c.createOscillator(), prof = c.createGain();
      o.type = "sine"; o.frequency.value = f;
      lfo.frequency.value = 6 + i * 0.7; prof.gain.value = 0.03;
      lfo.connect(prof).connect(g.gain);
      g.gain.setValueAtTime(0.0001, quando);
      g.gain.exponentialRampToValueAtTime(0.06, quando + 0.15 + i * 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, quando + 1.8);
      o.connect(g).connect(master); g.connect(atraso);
      o.start(quando); lfo.start(quando);
      o.stop(quando + 1.9); lfo.stop(quando + 1.9);
    });
  },

  /** Um SOM EM ARQUIVO (assets/sons/): toca se já carregou e devolve true;
   *  se não, pede (pra próxima vez) e devolve false. Fica guardado. */
  /** Um SOM DO JOGO que dá pra editar: o assets/sons/<nome>.wav que o EDITOR
   *  DE SONS salvou, se existe; senão o <nome>.mp3 original. */
  somEditado(nome, vol = 1) {
    const wav = `assets/sons/${nome}.wav`, mp3 = `assets/sons/${nome}.mp3`;
    const w = sonsArquivo.get(wav);
    if (w === undefined) this.somArquivoCarregar(wav);
    // o editado já carregado ganha; carregando ainda, ou sem editado: o original
    return w ? this.somArquivo(wav, vol) : this.somArquivo(mp3, vol);
  },

  /** só carrega o som (sem tocar) */
  somArquivoCarregar(caminho) {
    if (sonsArquivo.has(caminho)) return;
    sonsArquivo.set(caminho, null);
    fetch(arquivo(caminho)).then((r) => (r.ok ? r.arrayBuffer() : Promise.reject()))
      .then((b) => ac().decodeAudioData(b)).then((buf) => sonsArquivo.set(caminho, buf))
      .catch(() => sonsArquivo.set(caminho, false));
  },

  somArquivo(caminho, vol = 1) {
    if (muted) return true;
    const c = ac();
    const pronto = sonsArquivo.get(caminho);
    if (pronto) {
      const src = c.createBufferSource(), g = c.createGain();
      src.buffer = pronto;
      g.gain.value = vol;
      src.connect(g).connect(master);
      src.start(c.currentTime + 0.01);
      return true;
    }
    if (pronto === undefined) this.somArquivoCarregar(caminho);
    return false;
  },
  glitch() {
    if (muted) return;
    for (let i = 0; i < 8; i++) {
      setTimeout(() => this.tone(60 + Math.random() * 1800, 0.03, Math.random() < 0.5 ? "square" : "sawtooth", 0.5), i * 25);
    }
    this.noise(0.18, 0.5);
  },

  /** Nota agendada pra um instante exato do relogio do audio.
   *  tr: { wave, duty, vibrato, detune, eco, vol } — o "instrumento" do canal. */
  _notaEm(freq, quando0, dur, tr, vol) {
    if (muted || !freq) return;
    // a nota comum começa adiantada o quanto o ataque dela atrasa (MEDIDO)
    const quando = tr.guitarra || tr.timbre || tr.xilofone ? quando0 : Math.max(ac().currentTime, quando0 - ADIANTA_NOTA);
    if (tr.timbre && TIMBRES[tr.timbre]) return this._timbreEm(freq, quando, dur, tr, vol);
    if (tr.guitarra) return this._guitarraEm(freq, quando, dur, tr, vol);
    if (tr.xilofone) return this._xilofoneEm(freq, quando, tr, vol);
    const c = ac();
    const g = c.createGain();
    const vozes = tr.detune ? [-tr.detune, tr.detune] : [0];   // duas vozes = som mais gordo
    for (const cents of vozes) {
      const o = c.createOscillator();
      if (tr.wave === "pulso" || tr.duty) o.setPeriodicWave(ondaPulso(tr.duty ?? 0.25));
      else o.type = tr.wave || "square";
      o.frequency.setValueAtTime(freq, quando);
      o.detune.setValueAtTime(cents, quando);
      if (tr.vibrato) {                                  // atraso do vibrato: entra depois
        const lfo = c.createOscillator();
        const amp = c.createGain();
        lfo.frequency.value = tr.vibrato.hz ?? 6;
        amp.gain.setValueAtTime(0, quando);
        amp.gain.linearRampToValueAtTime(tr.vibrato.cents ?? 14, quando + Math.min(dur * 0.6, 0.18));
        lfo.connect(amp).connect(o.detune);
        lfo.start(quando);
        lfo.stop(quando + dur + 0.03);
        tocando.push(lfo);
      }
      o.connect(g);
      o.start(quando);
      o.stop(quando + dur + 0.03);
      tocando.push(o);
    }
    const pico = (0.3 * vol) / vozes.length;
    g.gain.setValueAtTime(0.0001, quando);
    g.gain.exponentialRampToValueAtTime(pico, quando + 0.012);          // ataque curto
    g.gain.exponentialRampToValueAtTime(pico * 0.7, quando + Math.min(dur * 0.5, 0.2));  // sustain
    g.gain.exponentialRampToValueAtTime(0.0001, quando + Math.max(0.05, dur));
    g.connect(saidaMusica());
    if (tr.eco) g.connect(barramentoEco());
    if (tocando.length > 96) tocando = tocando.slice(-96);
  },

  /** Uma nota de música num dos TIMBRES (src/core/timbres.js) — os mesmos dos
   *  gritos: saxofone, piano elétrico, metais, violino, marimba... (`tr.timbre`).
   *  Quem "bate e some" (piano, marimba, baixo funk) cai sozinho; os outros
   *  seguram a nota e soltam no fim. */
  _timbreEm(freq, quando, dur, tr, vol) {
    const c = ac(), R = TIMBRES[tr.timbre];
    const g = c.createGain();
    const pico = Math.max(0.0002, vol * R.vol * 0.75);
    g.gain.setValueAtTime(0.0001, quando);
    if (R.decai) {
      g.gain.exponentialRampToValueAtTime(pico, quando + 0.004);
      g.gain.setTargetAtTime(0.0001, quando + 0.006, Math.max(0.05, dur) / (R.decai * 1.6));
    } else {
      g.gain.exponentialRampToValueAtTime(pico, quando + 0.02);
      g.gain.setValueAtTime(pico * 0.85, quando + Math.max(0.03, dur * 0.8));
      g.gain.exponentialRampToValueAtTime(0.0001, quando + Math.max(0.05, dur));
    }
    // o sopro do sax: um chiado na altura da nota
    const chiado = (nivel, tipo = "bandpass", q = 0.8) => {
      const n = Math.floor(c.sampleRate * dur) + 1;
      const buf = c.createBuffer(1, n, c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
      const src = c.createBufferSource();
      src.buffer = buf;
      const fl = c.createBiquadFilter();
      fl.type = tipo; fl.Q.value = q; fl.frequency.value = Math.min(9000, freq * 2);
      const gn = c.createGain();
      gn.gain.value = nivel;
      src.connect(fl).connect(gn).connect(g);
      src.start(quando);
      src.stop(quando + dur + 0.02);
    };
    this.timbre(c, R, tr.timbre, freq, freq, quando, Math.max(0.05, dur), 0, g, chiado, 0);
    g.connect(saidaMusica());
    if (tr.eco) g.connect(barramentoEco());
  },

  /** XILOFONE: uma batida na tecla de madeira. A fundamental em seno e o
   *  harmônico que a tecla de xilofone tem (perto de 4x, um pouco abaixo),
   *  bem mais curto — é ele que faz o "toc" de madeira. Ataque instantâneo e
   *  o som morrendo sozinho, do tamanho que for a nota: tecla batida não
   *  sustenta. tr.acorde: as notas batidas juntas (semitons). */
  _xilofoneEm(freq, quando, tr, vol) {
    const c = ac();
    const g = c.createGain();
    const soa = tr.soa ?? 0.55;                 // quanto a tecla fica soando
    for (const semi of tr.acorde || [0]) {
      const f = freq * Math.pow(2, semi / 12);
      for (const [mult, ganho, dura] of [[1, 1, soa], [3.93, 0.32, soa * 0.25]]) {
        const o = c.createOscillator();
        const v = c.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime(f * mult, quando);
        v.gain.setValueAtTime(0.0001, quando);
        v.gain.exponentialRampToValueAtTime(ganho, quando + 0.002);
        v.gain.exponentialRampToValueAtTime(0.0001, quando + dura);
        o.connect(v).connect(g);
        o.start(quando);
        o.stop(quando + dura + 0.02);
        tocando.push(o);
      }
    }
    g.gain.value = (0.34 * vol) / Math.sqrt((tr.acorde || [0]).length);
    g.connect(saidaMusica());
    if (tr.eco) g.connect(barramentoEco());
    if (tocando.length > 160) tocando = tocando.slice(-160);
  },

  /** GUITARRA: serras desafinadas -> distorção -> passa-baixa (a "caixa" do
   *  amplificador). tr.acorde: intervalos em semitons tocados juntos — [0, 7, 12]
   *  é o power chord. tr.abafado: palm mute (corta o agudo e encurta). */
  _guitarraEm(freq, quando0, dur, tr, vol) {
    const c = ac();
    // a guitarra começa ADIANTADA o quanto ela atrasa (MEDIDO em dev/atrasos.html:
    // a distorção, o filtro e o ataque) — o CAIO ouviu ela atrás da bateria
    const quando = Math.max(c.currentTime, quando0 - ADIANTA_GUITARRA);
    const pre = c.createGain();
    pre.gain.value = 1;
    const dist = c.createWaveShaper();
    dist.curve = curvaDistorcao(tr.ganho ?? 30);
    dist.oversample = "2x";
    const caixa = c.createBiquadFilter();
    caixa.type = "lowpass";
    caixa.frequency.value = tr.abafado ? 1100 : 3400;
    caixa.Q.value = 0.9;
    const g = c.createGain();
    for (const semi of tr.acorde || [0]) {
      for (const cents of [-7, 7]) {
        const o = c.createOscillator();
        o.type = "sawtooth";
        o.frequency.setValueAtTime(freq * Math.pow(2, semi / 12), quando);
        o.detune.setValueAtTime(cents, quando);
        if (tr.vibrato && dur > 0.3) {
          const lfo = c.createOscillator(), amp = c.createGain();
          lfo.frequency.value = tr.vibrato.hz ?? 5.5;
          amp.gain.setValueAtTime(0, quando);
          amp.gain.linearRampToValueAtTime(tr.vibrato.cents ?? 25, quando + Math.min(dur * 0.7, 0.35));
          lfo.connect(amp).connect(o.detune);
          lfo.start(quando); lfo.stop(quando + dur + 0.05);
          tocando.push(lfo);
        }
        o.connect(pre);
        o.start(quando);
        o.stop(quando + dur + 0.05);
        tocando.push(o);
      }
    }
    pre.connect(dist).connect(caixa).connect(g);
    const pico = 0.22 * vol;
    const fim = quando + Math.max(0.05, tr.abafado ? Math.min(dur, 0.12) : dur);
    g.gain.setValueAtTime(0.0001, quando);
    g.gain.exponentialRampToValueAtTime(pico, quando + 0.006);
    g.gain.exponentialRampToValueAtTime(pico * 0.75, quando + Math.min(dur * 0.4, 0.15));
    g.gain.exponentialRampToValueAtTime(0.0001, fim + 0.03);
    g.connect(saidaMusica());
    if (tr.eco) g.connect(barramentoEco());
    if (tocando.length > 160) tocando = tocando.slice(-160);
  },

  /** BATERIA: cada letra da "nota" é uma peça tocada naquele instante.
   *  K bumbo, S caixa, H chimbal, O chimbal aberto, C prato, T tom. "KC" = os dois. */
  _bateriaEm(pecas, quando, vol) {
    if (muted) return;
    const c = ac();
    const ruido = (dur, filtro, freqF, v, q = 0.7) => {
      // o chiado de cada duração é feito UMA vez e reaproveitado: gerar um novo a
      // cada batida pesava nas músicas rápidas (a MEGA DESCONTROLADA saía do tempo)
      const chave = Math.round(dur * 1000);
      let buf = ruidosProntos.get(chave);
      if (!buf) {
        const n = Math.max(1, Math.floor(c.sampleRate * dur));
        buf = c.createBuffer(1, n, c.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
        ruidosProntos.set(chave, buf);
      }
      const src = c.createBufferSource();
      src.buffer = buf;
      const f = c.createBiquadFilter();
      f.type = filtro; f.frequency.value = freqF; f.Q.value = q;
      const g = c.createGain();
      g.gain.setValueAtTime(v * vol, quando);
      g.gain.exponentialRampToValueAtTime(0.0001, quando + dur);
      src.connect(f).connect(g).connect(saidaMusica());
      src.start(quando);
      tocando.push(src);
    };
    const tom = (f0, f1, dur, v) => {
      const o = c.createOscillator(), g = c.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(f0, quando);
      o.frequency.exponentialRampToValueAtTime(f1, quando + dur * 0.8);
      g.gain.setValueAtTime(v * vol, quando);
      g.gain.exponentialRampToValueAtTime(0.0001, quando + dur);
      o.connect(g).connect(saidaMusica());
      o.start(quando); o.stop(quando + dur + 0.02);
      tocando.push(o);
    };
    for (const p of pecas) {
      if (p === "K") { tom(160, 42, 0.32, 1.6); ruido(0.012, "lowpass", 3000, 0.5); }
      else if (p === "S") { tom(220, 160, 0.1, 0.5); ruido(0.18, "bandpass", 1800, 1.1, 0.6); }
      else if (p === "H") ruido(0.04, "highpass", 7500, 0.35);
      else if (p === "O") ruido(0.22, "highpass", 6500, 0.3);
      else if (p === "C") ruido(1.4, "highpass", 4500, 0.55, 0.4);
      else if (p === "T") tom(140, 80, 0.25, 1.0);
      else if (p === "A") this._trianguloEm(quando, vol, 1.6);   // triângulo aberto
      else if (p === "M") this._trianguloEm(quando, vol, 0.14);  // triângulo abafado (a mão segura)
    }
  },

  /** O TRIÂNGULO (o instrumento de metal): uma barra de aço dobrada não tem
   *  harmônicos certinhos, então são cinco senos em proporções "erradas", cada
   *  um em par levemente desafinado (é o batimento que faz ele cintilar), os
   *  agudos morrendo antes dos graves, e um estalinho da baqueta no começo.
   *  `dur` é quanto ele soa: aberto vibra mais de um segundo, abafado some já. */
  _trianguloEm(quando, vol, dur) {
    if (muted) return;
    const c = ac();
    const PARCIAIS = [[1240, 0.5], [3360, 0.36], [5180, 0.3], [7020, 0.2], [8840, 0.12]];
    for (const [f, a] of PARCIAIS) {
      for (const desvio of [-1.6, 1.6]) {
        const o = c.createOscillator(), g = c.createGain();
        o.type = "sine";
        o.frequency.value = f + desvio * (f / 1240);
        const fim = quando + dur * (1240 / f) ** 0.35;
        g.gain.setValueAtTime(0.0001, quando);
        g.gain.linearRampToValueAtTime(a * 0.6 * vol, quando + 0.002);
        g.gain.exponentialRampToValueAtTime(0.0001, fim);
        o.connect(g).connect(saidaMusica());
        o.start(quando); o.stop(fim + 0.02);
        tocando.push(o);
      }
    }
    // a baqueta encostando: um tic bem agudo e curtinho
    const n = Math.max(1, Math.floor(c.sampleRate * 0.008));
    const buf = c.createBuffer(1, n, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    src.buffer = buf; f.type = "highpass"; f.frequency.value = 8000;
    g.gain.value = 0.12 * vol;
    src.connect(f).connect(g).connect(saidaMusica());
    src.start(quando);
    tocando.push(src);
  },

  /** Percussao: um estalo de ruido agendado. */
  _ruidoEm(quando, dur, vol) {
    if (muted) return;
    const c = ac();
    const n = Math.max(1, Math.floor(c.sampleRate * dur));
    const buf = c.createBuffer(1, n, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = c.createBufferSource();
    const g = c.createGain();
    g.gain.value = 0.22 * vol;
    src.buffer = buf;
    src.connect(g).connect(saidaMusica());
    src.start(quando);
    tocando.push(src);
  },

  /** Toca uma musica de varios canais (ver src/data/music.js).
   *  { bpm, tracks: [{ wave, vol, notes: [["A4", 1], ["-", 0.5], ...] }] }
   *  Cada canal roda no proprio comprimento: com tamanhos diferentes, o loop
   *  demora pra se repetir igual — e a musica nao fica obviamente em looping. */
  playSong(song) {
    this.stopLoop();
    if (!song?.tracks?.length) return;
    const c = ac();
    musica = {
      song,
      beat: 60 / (song.bpm || 120),
      pos: song.tracks.map(() => 0),
      t: song.tracks.map(() => c.currentTime + 0.1),
    };
    const passo = () => {
      if (!musica) return;
      const horizonte = ac().currentTime + 0.6;      // agenda 0,6s a frente (aguenta uma travadinha)
      const agora = ac().currentTime;
      // ficou pra trás (o computador dormiu, a aba travou um pouco): pula as
      // notas perdidas em vez de tocar todas juntas — era isso o BUUUUM. E pula
      // TODOS os canais a mesma coisa: pulando só o atrasado, a bateria saía do
      // tempo dos outros e ficava fora pra sempre
      const atrasado = Math.min(...musica.t);
      if (atrasado < agora - 0.25) {
        const pulo = agora + 0.05 - atrasado;
        for (let i = 0; i < musica.t.length; i++) musica.t[i] += pulo;
      }
      musica.song.tracks.forEach((tr, i) => {
        let guarda = 0;
        while (musica.t[i] < horizonte && guarda++ < 64) {
          // a INTRODUÇÃO (`intro`) toca uma vez, e o laço (`notes`) depois dela
          const seq = tr.notes, intro = tr.intro || [], p = musica.pos[i];
          let [n, beats = 1] = p < intro.length ? intro[p] : seq[(p - intro.length) % seq.length];
          // "corrupção": de vez em quando a faixa engole, desafina ou apressa uma
          // nota. Como cada canal tem comprimento próprio, o estrago desencaixa
          // os canais entre si e a música nunca repete igual.
          let canal = tr;
          const bug = (musica.song.glitch || 0) * (tr.glitch ?? 1);
          if (bug && Math.random() < bug) {
            const r = Math.random();
            if (r < 0.28) n = "-";                                        // engoliu
            else if (r < 0.62) canal = { ...tr, detune: (tr.detune || 0) + 30 + Math.random() * 70 };
            else if (r < 0.85) beats = beats / 2;                         // apressou
            else beats = beats * 1.5;                                     // travou
          }
          const dur = musica.beat * beats;
          const solto = (canal.legato ?? 0.85) * dur;
          if (canal.wave === "bateria") { if (n !== "-") this._bateriaEm(n, musica.t[i], canal.vol ?? 0.5); }
          else if (canal.wave === "ruido") { if (n !== "-") this._ruidoEm(musica.t[i], Math.min(0.09, solto), canal.vol ?? 0.5); }
          else this._notaEm(nota(n), musica.t[i], solto, canal, canal.vol ?? 0.5);
          musica.t[i] += dur;
          musica.pos[i]++;
        }
      });
    };
    passo();
    musicaTimer = setInterval(passo, 60);
  },

  /** Toca a faixa `nome`: se existir um arquivo de audio seu em
   *  assets/music/<nome>.(ogg|mp3|wav), ele ganha; senao toca o chiptune de
   *  src/data/music.js. Os arquivos ficam so na sua maquina (.gitignore). */
  playMusic(nome, song) {
    if (!nome) return this.playSong(song);
    // o ajuste desta música, pra ela soar na mesma altura das outras
    ac();
    const ajuste = medindo ? 1 : (VOLUMES_MUSICA[nome] ?? 1);
    saidaMusica().gain.setTargetAtTime(ajuste, ac().currentTime, 0.05);
    if (elMusica) elMusica.volume = muted ? 0 : Math.min(1, 0.5 * ajuste);
    // a música do Red/Blue (`gb`), se não tiver arquivo seu com o mesmo nome
    if (song?.gb && !arquivos.get(nome)) return this.playGB(nome, song.gb);
    const achado = arquivos.get(nome);
    if (achado === undefined) {                 // primeira vez: procura o arquivo
      arquivos.set(nome, null);                 // enquanto isso, toca o chiptune
      procurarArquivo(nome).then((url) => {
        arquivos.set(nome, url);
        if (url && faixaAtual === nome) this.playMusic(nome, song);
      });
      this.playSong(song);
      faixaAtual = nome;
      return;
    }
    this.stopLoop();
    faixaAtual = nome;
    if (!achado) return this.playSong(song);
    elMusica = elMusica || new Audio();
    elMusica.src = achado;
    elMusica.loop = true;
    elMusica.volume = muted ? 0 : 0.5;
    elMusica.play().catch(() => this.playSong(song));
  },

  /** Toca uma MÚSICA DO GAME BOY (src/data/musicas-gb.js): gerada uma vez pelo
   *  imitador do chip (src/core/gb.js) e tocada em laço, voltando no mesmo
   *  ponto em que o jogo voltava (a introdução só toca uma vez). */
  playGB(nome, qual) {
    const m = GB_MUSICAS[qual];
    if (!m) return;
    if (faixaAtual === nome && tocando.some((o) => o.gb === qual)) return;   // já está tocando
    this.stopLoop();
    faixaAtual = nome;
    const c = ac();
    let r = musicasGB.get(qual);
    if (!r) {
      const x = tocarMusicaGB(m, GB_ONDAS, c.sampleRate);
      const buf = c.createBuffer(1, x.amostras.length, c.sampleRate);
      buf.copyToChannel(x.amostras, 0);
      r = { buf, inicio: x.inicioLaco, fim: x.fimLaco };
      musicasGB.set(qual, r);
    }
    const src = c.createBufferSource();
    src.buffer = r.buf;
    src.loop = true;
    src.loopStart = r.inicio;
    src.loopEnd = r.fim;
    src.gb = qual;
    // mais baixa que as outras: o chip do Game Boy toca três canais cheios o
    // tempo todo, e a mesma altura das músicas do jogo cobria tudo
    const g = c.createGain();
    g.gain.value = 0.45;
    src.connect(g).connect(saidaMusica());
    src.start(c.currentTime + 0.05);
    tocando.push(src);
  },

  /** Sequencia simples de 1 canal: [[freq|0, beats], ...] em bpm. */
  playLoop(notes, bpm = 120, type = "square") {
    this.stopLoop();
    const beat = 60 / bpm;
    let i = 0;
    const step = () => {
      const [f, b] = notes[i % notes.length];
      this.tone(f, beat * b * 0.9, type, 0.45);
      i++;
      loopTimer = setTimeout(step, beat * b * 1000);
    };
    step();
  },
  /** O GRITO ORIGINAL do Red/Blue ou do Crystal: [grito-base, tom, andamento,
   *  "gsc" se for do Crystal] (src/data/gritos-gb.js), tocado pelo imitador do
   *  chip do Game Boy (src/core/gb.js)
   *  e mandado pelo mesmo canal dos outros gritos (o passa-baixa e o eco).
   *  `tom` acelera ou desacelera tudo junto. Devolve a duração em segundos. */
  gritoGB([base, tomGB, andamento, jogo], tom = 1, efeito = null, edita = null) {
    if (muted) return 0;
    const c = ac();
    let amostras = tocarGB(jogo === "gsc" ? GBC_BASES : GB_BASES, base, tomGB, andamento, c.sampleRate);
    if (edita && amostras.length) { const e = editarGrito(amostras, c.sampleRate, edita); amostras = e.dados; tom *= e.tom; }
    if (!amostras.length) return 0;
    const buf = c.createBuffer(1, amostras.length, c.sampleRate);
    buf.copyToChannel(amostras, 0);
    const src = c.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = tom;
    const passa = c.createBiquadFilter();
    passa.type = "lowpass";
    passa.frequency.value = 7000;
    passa.Q.value = 0.5;
    const canal = c.createGain();
    canal.gain.value = 0.55;
    const fx = efeito === "estouro" ? cadeiaEstouro(c, amostras.length / c.sampleRate / tom) : efeito === "metal" ? cadeiaMetal(c) : null;
    if (fx) {
      src.connect(canal).connect(fx.entrada); fx.saida.connect(saidaGrito || master);
    } else src.connect(canal).connect(passa).connect(saidaGrito || master);
    const eco = c.createGain();
    eco.gain.value = 0.18;
    canal.connect(eco).connect(barramentoEco());
    src.start(c.currentTime + 0.02);
    return amostras.length / c.sampleRate / tom;
  },

  /** O GRITO ORIGINAL em arquivo (assets/gritos/<dex>.mp3: os de Hoenn em
   *  diante, que desde o GBA são gravação e não nota). Fica guardado depois da
   *  primeira vez. Enquanto o arquivo chega, toca quando chegar; se não
   *  existir, toca as sílabas de sempre (`spec.s`). Devolve a duração em
   *  segundos (uma estimativa na primeira vez). */
  gritoArquivo(spec, tom = 1, efeito = null) {
    if (muted) return 0;
    const c = ac();
    // O GRITO EMENDADO (`partes`, nov/2026: o MISSINGNO. FANTASMA = GASTLY +
    // HAUNTER + MISSINGNO.): um pedaço de cada arquivo, em ordem (juntarPartes)
    if (!spec.arquivo && Array.isArray(spec.partes) && spec.partes.length) spec = { ...spec, arquivo: "partes:" + JSON.stringify(spec.partes) };
    const tocar = (buf0) => {
      let buf = buf0, t = tom;
      if (spec.edita) {
        const chave = spec.arquivo + "|" + JSON.stringify(spec.edita);
        let e = gritosEditados.get(chave);
        if (!e) {
          const r = editarGrito(buf0.getChannelData(0), buf0.sampleRate, spec.edita);
          const b = c.createBuffer(1, r.dados.length, buf0.sampleRate);
          b.copyToChannel(r.dados, 0);
          e = { buf: b, tom: r.tom };
          gritosEditados.set(chave, e);
        }
        buf = e.buf; t = tom * e.tom;
      }
      const src = c.createBufferSource();
      src.buffer = buf;
      src.playbackRate.value = t;
      const canal = c.createGain();
      canal.gain.value = ganhoDoGrito(buf);     // na altura dos do Game Boy
      const fx = efeito === "estouro" ? cadeiaEstouro(c, buf.duration / t) : efeito === "metal" ? cadeiaMetal(c) : null;
      if (fx) {
        src.connect(canal).connect(fx.entrada); fx.saida.connect(saidaGrito || master);
      } else src.connect(canal).connect(saidaGrito || master);
      const eco = c.createGain();
      eco.gain.value = 0.12;
      canal.connect(eco).connect(barramentoEco());
      src.start(c.currentTime + 0.01);
      return buf.duration / t;
    };
    const pronto = gritosArquivo.get(spec.arquivo);
    if (pronto) return tocar(pronto);
    if (pronto === null) return this.grito({ ...spec, arquivo: null, partes: null }, tom, efeito);
    if (!gritosPedidos.has(spec.arquivo)) {
      gritosPedidos.set(spec.arquivo, (spec.arquivo.startsWith("partes:") ? juntarPartes(c, JSON.parse(spec.arquivo.slice(7)))
        : fetch(arquivo(spec.arquivo)).then((r) => (r.ok ? r.arrayBuffer() : Promise.reject())).then((b) => c.decodeAudioData(b)))
        .then((buf) => { gritosArquivo.set(spec.arquivo, buf); return buf; })
        .catch(() => { gritosArquivo.set(spec.arquivo, null); return null; }));
    }
    gritosPedidos.get(spec.arquivo).then((buf) => (buf ? tocar(buf) : this.grito({ ...spec, arquivo: null, partes: null }, tom, efeito)));
    return 1;
  },

  /** O GRITO de um Pokémon (src/data/gritos.js): sílabas sintetizadas uma
   *  atrás da outra. Cada sílaba é [f0, f1, ms, onda, vibrato, ruído]:
   *    f0 -> f1   a frequência (Hz) desliza de f0 até f1 durante a sílaba
   *    ms         a duração
   *    onda       "q" quadrada, "p" pulso 25%, "f" pulso 12,5% (fininha),
   *               "t" triângulo, "s" serra, "o" seno, "n" ruído filtrado
   *               em f0 -> f1 (chiado, sopro, rugido), "_" silêncio
   *    vibrato    Hz do tremido (0 = sem)
   *    ruído      0..1 de chiado misturado (voz rouca)
   *  `tom` multiplica todas as frequências. Devolve a duração em segundos. */
  /** O GRITO DA FUSÃO (pedido do CAIO: "uma boa mistura do grito dos 2/3"): os
   *  gritos de verdade das partes TOCAM JUNTOS, e o volume passa de um pro
   *  outro — no começo a CABEÇA na frente, no fim o CORPO (na tripla, a cabeça,
   *  o meio e as pernas, uma de cada vez na frente). Os de trás nunca somem de
   *  vez: é isso que faz soar como um bicho só. Devolve a duração. */
  gritoMisturado(specs, toms = []) {
    if (muted || !specs?.length) return 0;
    const c = ac(), t0 = c.currentTime + 0.02, n = specs.length, T = 0.75;
    let dur = 0;
    specs.forEach((spec, i) => {
      const g = c.createGain();
      const baixo = 0.32, alto = 1 / Math.max(1, n * 0.75);
      // a vez de cada um: [começo, fim] da linha do tempo de T segundos
      const a = (i / n) * T, b = ((i + 1) / n) * T;
      g.gain.setValueAtTime(i === 0 ? alto : baixo * alto, t0);
      if (i > 0) { g.gain.setValueAtTime(baixo * alto, t0 + Math.max(0, a - 0.12)); g.gain.linearRampToValueAtTime(alto, t0 + a + 0.08); }
      if (i < n - 1) { g.gain.setValueAtTime(alto, t0 + Math.max(0, b - 0.12)); g.gain.linearRampToValueAtTime(baixo * alto, t0 + b + 0.08); }
      g.connect(master);
      saidaGrito = g;
      try { dur = Math.max(dur, this.grito(spec, toms[i] || 1) || 0); } finally { saidaGrito = null; }
    });
    return dur;
  },

  grito(spec, tom = 1, efeito = null) {
    // os de KANTO e JOHTO tocam o grito ORIGINAL, no chip do Game Boy; os de
    // HOENN em diante, o arquivo do grito original (assets/gritos/)
    // (`efeito: "estouro"`: a voz vira explosão de fogo — cadeiaEstouro)
    if (spec?.gb) return this.gritoGB(spec.gb, tom, efeito, spec.edita || null);
    if (spec?.arquivo || spec?.partes?.length) return this.gritoArquivo(spec, tom, efeito);
    const silabas = spec?.s;
    if (muted || !Array.isArray(silabas) || !silabas.length) return 0;
    const c = ac();
    const inicio = c.currentTime + 0.02;
    let t = inicio;
    // O CANAL DO GRITO: tudo passa por um passa-baixa (quadrada e serra em nota
    // alta viram chiado de agulha sem ele) e manda um pouco pro eco curto das
    // músicas — é o que faz o grito soar dentro do jogo, e não colado na tela
    const passa = c.createBiquadFilter();
    passa.type = "lowpass";
    passa.frequency.value = 6500;
    passa.Q.value = 0.6;
    const canal = c.createGain();
    canal.gain.value = 1;
    const fx = efeito === "estouro" ? cadeiaEstouro(c, silabas.reduce((n, x) => n + (x[2] || 100), 0) / 1000) : efeito === "metal" ? cadeiaMetal(c) : null;
    if (fx) {
      canal.connect(fx.entrada); fx.saida.connect(saidaGrito || master);
    } else canal.connect(passa).connect(saidaGrito || master);
    const eco = c.createGain();
    eco.gain.value = 0.22;
    canal.connect(eco).connect(barramentoEco());
    // o ouvido escuta menos o grave e mais o agudo: compensa pela altura da
    // nota, pra um ronco de 100 Hz e um piado de 3 kHz soarem do mesmo tamanho
    const pelaAltura = (f) => (f < 130 ? 1.6 : f < 220 ? 1.35 : f < 400 ? 1.12 : f > 3500 ? 0.62 : f > 2200 ? 0.75 : f > 1400 ? 0.88 : 1);
    for (const sil of silabas) {
      const [f0 = 440, f1 = f0, ms = 100, onda = "q", vib = 0, ruido = 0] = sil;
      // o piso é 4 ms: só o grito do REGIGLITCH (dez vezes acelerado) chega perto
      const d = Math.max(0.004, Math.min(1.2, ms / 1000));
      if (onda === "_") { t += d; continue; }
      const a = Math.max(20, Math.min(12000, f0 * tom)), b = Math.max(20, Math.min(12000, f1 * tom));
      const g = c.createGain();
      const R = TIMBRES[onda] || null;              // um dos timbres a mais (src/core/timbres.js)
      const vol = R ? R.vol * (R.vento ? 1 : pelaAltura(Math.sqrt(a * b)))
        : (onda === "n" ? 0.5 : onda === "o" || onda === "t" ? 0.42 : onda === "s" ? 0.26 : 0.3)
          * (onda === "n" ? 1 : pelaAltura(Math.sqrt(a * b)));
      g.gain.setValueAtTime(0.0001, t);
      if (R?.decai) {
        // bate e some: piano, harpa, sino, marimba
        g.gain.exponentialRampToValueAtTime(vol, t + Math.min(0.005, d / 4));
        g.gain.setTargetAtTime(0.0001, t + Math.min(0.006, d / 3), d / (R.decai * 2.2));
      } else {
        g.gain.exponentialRampToValueAtTime(vol, t + Math.min(0.012, d / 4));
        g.gain.setValueAtTime(vol, t + d * 0.7);
        g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      }
      g.connect(canal);
      const chiado = (nivel, tipo = "bandpass", q = onda === "n" ? 3 : 0.8) => {
        const n = Math.floor(c.sampleRate * d) + 1;
        const buf = c.createBuffer(1, n, c.sampleRate);
        const dd = buf.getChannelData(0);
        for (let i = 0; i < n; i++) dd[i] = Math.random() * 2 - 1;
        const src = c.createBufferSource();
        src.buffer = buf;
        const fl = c.createBiquadFilter();
        fl.type = tipo;
        fl.Q.value = q;
        fl.frequency.setValueAtTime(a, t);
        fl.frequency.exponentialRampToValueAtTime(b, t + d);
        const gn = c.createGain();
        gn.gain.value = nivel;
        src.connect(fl).connect(gn).connect(g);
        src.start(t);
        src.stop(t + d + 0.02);
      };
      if (onda === "n") chiado(1.6);
      else if (R) this.timbre(c, R, onda, a, b, t, d, vib, g, chiado, ruido);
      else {
        const o = c.createOscillator();
        if (onda === "p") o.setPeriodicWave(ondaPulso(0.25));
        else if (onda === "f") o.setPeriodicWave(ondaPulso(0.125));
        else o.type = { q: "square", t: "triangle", s: "sawtooth", o: "sine" }[onda] || "square";
        o.frequency.setValueAtTime(a, t);
        o.frequency.exponentialRampToValueAtTime(b, t + d);
        if (vib > 0) {
          const lfo = c.createOscillator(), prof = c.createGain();
          lfo.frequency.value = vib;
          prof.gain.value = a * 0.05;
          lfo.connect(prof).connect(o.frequency);
          lfo.start(t); lfo.stop(t + d + 0.02);
        }
        o.connect(g);
        o.start(t);
        o.stop(t + d + 0.02);
        if (ruido > 0) chiado(Math.min(1, ruido) * 0.9);
      }
      t += d;
      if (t - inicio > 2.5) break;          // grito não é música: no máximo 2,5 s
    }
    return t - inicio;
  },

  /** Uma sílaba num TIMBRE A MAIS (src/core/timbres.js): monta a receita com
   *  osciladores, filtros e distorção, e liga tudo em `g` (o volume da sílaba). */
  timbre(c, R, cod, a, b, t, d, vib, g, chiado, ruido) {
    const fim = t + d + 0.02;
    // um oscilador seguindo o tom da sílaba (de `a` até `b`)
    const fonte = (mul = 1, desafina = 0) => {
      const o = c.createOscillator();
      if (R.harm) o.setPeriodicWave(ondaHarm(cod, R.harm));
      else o.type = R.base || "sine";
      const fa = Math.min(12000, a * mul), fb = Math.min(12000, b * mul);
      o.frequency.setValueAtTime(fa, t);
      if (R.bolha) {                                  // o bloop: pula pra cima e assenta
        o.frequency.exponentialRampToValueAtTime(Math.min(12000, fb * 3), t + d * 0.35);
        o.frequency.exponentialRampToValueAtTime(Math.min(12000, fb * 1.4), t + d);
      } else o.frequency.exponentialRampToValueAtTime(fb, t + d);
      if (desafina) o.detune.value = desafina;
      const v = vib > 0 ? [vib, 0.05] : R.vibAuto;
      if (v) {
        const lfo = c.createOscillator(), prof = c.createGain();
        lfo.frequency.value = v[0];
        prof.gain.value = fa * v[1];
        lfo.connect(prof).connect(o.frequency);
        lfo.start(t); lfo.stop(fim);
      }
      o.start(t); o.stop(fim);
      return o;
    };
    if (R.vento) chiado(R.vol, "lowpass", 0.7);
    else if (R.fm) {
      const car = fonte(), mod = c.createOscillator(), forca = c.createGain();
      mod.frequency.setValueAtTime(Math.min(12000, a * R.fm.r), t);
      mod.frequency.exponentialRampToValueAtTime(Math.min(12000, b * R.fm.r), t + d);
      forca.gain.setValueAtTime(a * R.fm.i, t);
      if (R.fm.cai) forca.gain.exponentialRampToValueAtTime(Math.max(1, a * 0.3), t + d);
      mod.connect(forca).connect(car.frequency);
      mod.start(t); mod.stop(fim);
      car.connect(g);
    } else if (R.formantes) {
      const o = fonte();
      for (const f of R.formantes) {
        const bp = c.createBiquadFilter();
        bp.type = "bandpass"; bp.frequency.value = f; bp.Q.value = 5;
        o.connect(bp).connect(g);
      }
    } else if (R.distorce) {
      const ws = c.createWaveShaper(), lp = c.createBiquadFilter();
      ws.curve = curvaTimbre(`d${R.distorce}`, (x) => Math.tanh(x * R.distorce));
      lp.type = "lowpass"; lp.frequency.value = 3200;
      fonte().connect(ws).connect(lp).connect(g);
    } else if (R.degraus) {
      const ws = c.createWaveShaper();
      ws.curve = curvaTimbre(`e${R.degraus}`, (x) => Math.round(x * R.degraus) / R.degraus);
      fonte().connect(ws).connect(g);
    } else if (R.anel) {
      const am = c.createGain(), lfo = c.createOscillator();
      am.gain.value = 0;
      lfo.frequency.value = R.anel;
      lfo.connect(am.gain);
      lfo.start(t); lfo.stop(fim);
      fonte().connect(am).connect(g);
    } else if (R.coro) {
      for (const cents of R.coro) fonte(1, cents).connect(g);
    } else fonte().connect(g);
    if (R.sopro) chiado(R.sopro);
    if (ruido > 0) chiado(Math.min(1, ruido) * 0.9);
  },

  /** Essa música já está tocando? (A entrada da batalha começa a música no
   *  mapa; a cena da batalha pergunta isto pra não começar de novo.) */
  estaTocando(nome) {
    return !!nome && faixaAtual === nome && !!(tocando.length || musica || (elMusica && !elMusica.paused));
  },

  stopLoop() {
    faixaAtual = null;
    if (elMusica) { elMusica.pause(); elMusica.currentTime = 0; }
    if (loopTimer) clearTimeout(loopTimer);
    loopTimer = null;
    if (musicaTimer) clearInterval(musicaTimer);
    musicaTimer = null;
    musica = null;
    for (const o of tocando) { try { o.stop(); } catch {} }
    tocando = [];
  },
};
