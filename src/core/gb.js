// O CHIP DE SOM DO GAME BOY, o bastante pra tocar os gritos do Red/Blue e do
// Crystal como eles eram (src/data/gritos-gb.js, tirado do pret/pokered e do
// pret/pokecrystal).
//
// Três canais tocando juntos: duas ONDAS QUADRADAS e um CHIADO. O motor de som
// do jogo anda em QUADROS (59,7275 por segundo): a cada quadro ele desconta a
// nota de cada canal e, quando ela acaba, lê a próxima. O que o motor faz e
// aqui é imitado igual:
// - a duração da nota em quadros é (duração + 1) × andamento ÷ 256, com a
//   sobra guardada pra próxima; nas quadradas o andamento é o do Pokémon (no
//   Red/Blue, $80 + a velocidade; no Crystal, a velocidade), no chiado é
//   sempre $100;
// - o TOM do Pokémon é somado à frequência das quadradas e ao número do chiado
//   (um canal pode trocar o tom dele no meio: `po`);
// - na quadrada 1 o tom pode ESCORREGAR sozinho (o `pitch_sweep` do Crystal):
//   a cada período/128 s a frequência anda frequência >> passo;
// - o FORMATO da quadrada (12,5%, 25%, 50% ou 75%) troca a cada quadro, na
//   ordem do `duty_cycle_pattern`;
// - o VOLUME começa no da nota e sobe ou desce um degrau a cada `fade`/64 s;
// - o chiado é o registrador de 15 bits do Game Boy (ou de 7, mais "afinado").
const QUADRO = 1 / 59.7275;
const FORMATOS = [0.125, 0.25, 0.5, 0.75];

/** Os quadros de um canal: o que ele está tocando em cada quadro, até acabar.
 *  Cada quadro é { nota, novo } (`novo`: a nota começou neste quadro). */
function quadrosDoCanal(cmds, andamento, tom, chiado) {
  const out = [];
  let sobra = 0, formato = { fixo: 2, padrao: null }, varre = null;
  for (const c of cmds) {
    if (c[0] === "dp") { formato = { fixo: null, padrao: c.slice(1) }; continue; }
    if (c[0] === "d") { formato = { fixo: (c[1] >> 6) & 3, padrao: null }; continue; }
    if (c[0] === "po") { tom = c[1]; continue; }
    if (c[0] === "s") { varre = c[1] ? { periodo: c[1], desce: c[2], passo: c[3] } : null; continue; }
    const [, dur, vol, fade, valor] = c;
    const total = (dur + 1) * andamento + sobra;
    const n = total >> 8;
    sobra = total & 0xff;
    const nota = {
      vol, fade,
      valor: chiado ? (valor + tom) & 0xff : (valor + tom) & 0x7ff,
      formato, varre,
    };
    for (let k = 0; k < n; k++) out.push({ nota, novo: k === 0 });
  }
  return out;
}

/** O grito-base `base` com `tom` e `andamento` (os números do cries.asm, com
 *  o andamento já feito), em amostras de `taxa` por segundo. */
export function tocarGB(bases, base, tom, andamento, taxa) {
  const b = bases[base];
  if (!b) return new Float32Array(0);
  const canais = [
    quadrosDoCanal(b[0], andamento, tom, false),
    quadrosDoCanal(b[1], andamento, tom, false),
    quadrosDoCanal(b[2], 0x100, tom, true),
  ];
  const nQuadros = Math.max(...canais.map((c) => c.length));
  const n = Math.ceil((nQuadros * QUADRO + 0.03) * taxa);
  const out = new Float32Array(n);
  const estado = canais.map(() => ({ fase: 0, vol: 0, env: 0, quadroFormato: 0, lfsr: 0x7fff, passo: 0 }));
  for (let i = 0; i < n; i++) {
    const t = i / taxa;
    const q = Math.floor(t / QUADRO);
    let soma = 0;
    for (let c = 0; c < 3; c++) {
      const f = canais[c][q];
      if (!f) continue;
      const e = estado[c], nota = f.nota;
      // a nota começou: o volume volta pro da nota, e o relógio do volume zera
      if (f.novo && e.ultimo !== q) {
        e.ultimo = q; e.vol = nota.vol; e.env = 0; e.inicio = q;
        e.freq = nota.valor; e.varreT = 0; e.mudo = false;
      }
      // o volume sobe ou desce um degrau a cada |fade|/64 s
      if (nota.fade) {
        e.env += 1 / taxa;
        const periodo = Math.abs(nota.fade) / 64;
        while (e.env >= periodo) {
          e.env -= periodo;
          e.vol = Math.max(0, Math.min(15, e.vol + (nota.fade > 0 ? -1 : 1)));
        }
      }
      if (!e.vol) continue;
      let alto;
      if (c < 2) {
        // o escorregão: a frequência anda sozinha (e acima de 2047 o canal cala)
        const v = nota.varre;
        if (c === 0 && v) {
          e.varreT += 1 / taxa;
          const periodo = v.periodo / 128;
          while (e.varreT >= periodo && !e.mudo) {
            e.varreT -= periodo;
            const d = e.freq >> v.passo;
            e.freq = v.desce ? e.freq - d : e.freq + d;
            if (e.freq > 2047 || e.freq < 0) e.mudo = true;
          }
          if (e.mudo) continue;
        }
        const hz = 131072 / (2048 - (c === 0 && v ? e.freq : nota.valor));
        e.fase = (e.fase + hz / taxa) % 1;
        const fm = nota.formato;
        // o formato troca a cada quadro, na ordem do padrão (contando de quando
        // o padrão foi posto)
        if (fm !== e.formatoVisto) { e.formatoVisto = fm; e.inicioFormato = q; }
        const d = fm.padrao ? fm.padrao[(q - e.inicioFormato) & 3] : fm.fixo;
        alto = e.fase < FORMATOS[d];
      } else {
        // o CHIADO: o registrador anda no relógio que o número da nota escolhe
        const s = nota.valor >> 4, largo7 = (nota.valor >> 3) & 1, r = nota.valor & 7;
        const hz = s >= 14 ? 0 : 524288 / (r === 0 ? 0.5 : r) / 2 ** (s + 1);
        e.passo += hz / taxa;
        while (e.passo >= 1) {
          e.passo -= 1;
          const x = (e.lfsr ^ (e.lfsr >> 1)) & 1;
          e.lfsr = (e.lfsr >> 1) | (x << 14);
          if (largo7) e.lfsr = (e.lfsr & ~0x40) | (x << 6);
        }
        alto = !(e.lfsr & 1);
      }
      soma += (alto ? 1 : -1) * (e.vol / 15);
    }
    out[i] = soma / 3;
  }
  // tira o "degrau" do começo e do fim (estalo) e o meio-termo fora do zero
  let media = 0;
  for (let i = 0; i < n; i++) media += out[i];
  media /= n || 1;
  const borda = Math.min(n >> 1, Math.round(taxa * 0.003));
  for (let i = 0; i < n; i++) {
    let v = out[i] - media;
    if (i < borda) v *= i / borda;
    if (i > n - borda) v *= (n - i) / borda;
    out[i] = v;
  }
  return out;
}

// ============================================================ AS MÚSICAS
//
// As músicas de batalha de Kanto (src/data/musicas-gb.js, do pret/pokered):
// as mesmas duas quadradas, mais o CANAL DE ONDA — uma forma de onda desenhada
// de 32 pontos (GB_ONDAS), tocada no nível de volume da nota (100%, 50% ou
// 25%) — e o VIBRATO do motor: depois de `espera` quadros a frequência passa a
// alternar entre um pouco acima e um pouco abaixo da nota, a cada `ritmo` + 1
// quadros (mexendo só no byte de baixo, como o jogo).

/** Os quadros de um canal de música: { nota, k } (k = quadros desde o começo) */
function quadrosDaMusica(notas) {
  const out = [];
  for (const nota of notas) for (let k = 0; k < nota[0]; k++) out.push({ nota, k });
  return out;
}

/** A frequência no quadro `k` da nota, com o vibrato */
function comVibrato(f, vib, k) {
  if (!vib) return f;
  const [espera, sobe, desce, ritmo] = vib;
  if (k < espera) return f;
  const lado = Math.floor((k - espera) / (ritmo + 1)) % 2;
  const baixo = f & 0xff, alto = f & 0x700;
  return alto | (lado ? Math.max(0, baixo - desce) : Math.min(255, baixo + sobe));
}

/** A música `m` ({ canais, laco: [começo, fim] em quadros }) em amostras;
 *  devolve { amostras, inicioLaco, fimLaco } (os dois em segundos). */
export function tocarMusicaGB(m, ondas, taxa) {
  const canais = m.canais.map(quadrosDaMusica);
  const nQuadros = m.laco[1] || Math.max(...canais.map((c) => c.length));
  const n = Math.ceil(nQuadros * QUADRO * taxa);
  const out = new Float32Array(n);
  const estado = canais.map(() => ({ fase: 0, vol: 0, env: 0, ultima: null, lfsr: 0x7fff, passo: 0 }));
  for (let i = 0; i < n; i++) {
    const q = Math.floor(i / taxa / QUADRO);
    let soma = 0;
    for (let c = 0; c < canais.length; c++) {
      const f = canais[c][q];
      if (!f || f.nota.length === 1) continue;      // pausa
      const e = estado[c], [, freq, vol, fade, formato, vib] = f.nota;
      if (e.ultima !== f.nota) { e.ultima = f.nota; e.vol = vol; e.env = 0; e.lfsr = 0x7fff; }
      const fr = comVibrato(freq, vib, f.k);
      if (c === 3) {
        // o CHIADO (canal 4): o mesmo registrador dos gritos, com o volume em degraus
        if (fade) {
          e.env += 1 / taxa;
          const periodo = Math.abs(fade) / 64;
          while (e.env >= periodo) { e.env -= periodo; e.vol = Math.max(0, Math.min(15, e.vol + (fade > 0 ? -1 : 1))); }
        }
        if (!e.vol) continue;
        const sh = freq >> 4, largo7 = (freq >> 3) & 1, r = freq & 7;
        e.passo += (sh >= 14 ? 0 : 524288 / (r === 0 ? 0.5 : r) / 2 ** (sh + 1)) / taxa;
        while (e.passo >= 1) {
          e.passo -= 1;
          const x = (e.lfsr ^ (e.lfsr >> 1)) & 1;
          e.lfsr = (e.lfsr >> 1) | (x << 14);
          if (largo7) e.lfsr = (e.lfsr & ~0x40) | (x << 6);
        }
        soma += (e.lfsr & 1 ? -1 : 1) * (e.vol / 15);
        continue;
      }
      if (c < 2) {
        if (fade) {
          e.env += 1 / taxa;
          const periodo = Math.abs(fade) / 64;
          while (e.env >= periodo) {
            e.env -= periodo;
            e.vol = Math.max(0, Math.min(15, e.vol + (fade > 0 ? -1 : 1)));
          }
        }
        if (!e.vol) continue;
        e.fase = (e.fase + 131072 / (2048 - fr) / taxa) % 1;
        soma += (e.fase < FORMATOS[formato] ? 1 : -1) * (e.vol / 15);
      } else {
        // o canal de onda: `vol` é o nível (1 = 100%, 2 = 50%, 3 = 25%) e `fade`
        // é qual das ondas desenhadas
        if (!vol) continue;
        const onda = ondas[fade] || ondas[0];
        e.fase = (e.fase + 65536 / (2048 - fr) / taxa) % 1;
        const v = (onda[Math.floor(e.fase * 32)] - 7.5) / 7.5;
        soma += v / (1 << (vol - 1));
      }
    }
    out[i] = soma / 3;
  }
  return { amostras: out, inicioLaco: m.laco[0] * QUADRO, fimLaco: nQuadros * QUADRO };
}
