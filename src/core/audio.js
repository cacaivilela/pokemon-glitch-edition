// Chiptune com WebAudio: bleeps, e musica de varios canais (melodia, contracanto,
// baixo e percussao) agendada no relogio do proprio audio — sem setTimeout no meio,
// que e o que fazia a musica antiga tropecar quando a aba engasgava.
let ctxA = null;
let master = null;
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
    const url = `/assets/music/${nome}.${ext}`;
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

function ac() {
  if (!ctxA) {
    ctxA = new (window.AudioContext || window.webkitAudioContext)();
    master = ctxA.createGain();
    master.gain.value = 0.16;
    master.connect(ctxA.destination);
  }
  if (ctxA.state === "suspended") ctxA.resume();
  return ctxA;
}

export const Audio2 = {
  unlock() { ac(); },
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

  blip() { this.tone(880, 0.03, "square", 0.5); },
  select() { this.tone(660, 0.05); this.tone(990, 0.06); },
  cancel() { this.tone(330, 0.07, "square", 0.7); },
  bump() { this.tone(140, 0.06, "square", 0.6); },
  hit() { this.noise(0.1, 0.9); },
  faint() { for (let i = 0; i < 6; i++) setTimeout(() => this.tone(500 - i * 70, 0.09, "sawtooth", 0.6), i * 55); },
  heal() { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => this.tone(f, 0.1), i * 70)); },
  glitch() {
    if (muted) return;
    for (let i = 0; i < 8; i++) {
      setTimeout(() => this.tone(60 + Math.random() * 1800, 0.03, Math.random() < 0.5 ? "square" : "sawtooth", 0.5), i * 25);
    }
    this.noise(0.18, 0.5);
  },

  /** Nota agendada pra um instante exato do relogio do audio.
   *  tr: { wave, duty, vibrato, detune, eco, vol } — o "instrumento" do canal. */
  _notaEm(freq, quando, dur, tr, vol) {
    if (muted || !freq) return;
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
    g.connect(master);
    if (tr.eco) g.connect(barramentoEco());
    if (tocando.length > 96) tocando = tocando.slice(-96);
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
    src.connect(g).connect(master);
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
      const horizonte = ac().currentTime + 0.4;      // agenda 0,4s a frente
      musica.song.tracks.forEach((tr, i) => {
        let guarda = 0;
        while (musica.t[i] < horizonte && guarda++ < 64) {
          const seq = tr.notes;
          let [n, beats = 1] = seq[musica.pos[i] % seq.length];
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
          if (canal.wave === "ruido") { if (n !== "-") this._ruidoEm(musica.t[i], Math.min(0.09, solto), canal.vol ?? 0.5); }
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
  stopLoop() {
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
