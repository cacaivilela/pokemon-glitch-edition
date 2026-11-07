// O TEMPO DO MUNDO (pedido do CAIO, nov/2026: "faz ter chuva, temporais,
// tornados, dias com muito sol, etc."). Um tempo de cada vez, que dura uns
// minutos e troca sozinho; fica no save (`st.tempo`). O overworld desenha
// (src/scenes/overworld.js, drawTempo) e o VENTO obedece a ele; a batalha começa
// com CHUVA no temporal e na chuva, e com SOL no dia de sol forte.
export const TEMPOS = {
  limpo:    { nome: "TEMPO BOM",      peso: 38, vento: 1 },
  sol:      { nome: "SOL FORTE",      peso: 14, vento: 0.5 },
  nublado:  { nome: "VENTANIA",       peso: 12, vento: 1.4 },
  chuva:    { nome: "CHUVA",          peso: 16, vento: 1.2 },
  temporal: { nome: "TEMPORAL",       peso: 8,  vento: 1.7 },
  tornado:  { nome: "TORNADO",        peso: 4,  vento: 2 },
  neblina:  { nome: "NEBLINA",        peso: 8,  vento: 0.3 },
};

function sortear() {
  const lista = Object.entries(TEMPOS), total = lista.reduce((a, [, t]) => a + t.peso, 0);
  let r = Math.random() * total;
  for (const [id, t] of lista) if ((r -= t.peso) < 0) return id;
  return "limpo";
}

/** o tempo agora (troca sozinho quando acaba: 3 a 6 minutos cada) */
export function tempoAgora(st) {
  if (!st) return "limpo";
  const agora = Date.now();
  if (!st.tempo || !TEMPOS[st.tempo.tipo] || agora > st.tempo.ate) {
    const tipo = sortear();
    st.tempo = { tipo, ate: agora + (3 + Math.random() * 3) * 60000 };
  }
  return st.tempo.tipo;
}

/** força o tempo (o atalho de teste ?tempo=chuva) */
export function porTempo(st, tipo, minutos = 30) {
  if (TEMPOS[tipo]) st.tempo = { tipo, ate: Date.now() + minutos * 60000 };
}
