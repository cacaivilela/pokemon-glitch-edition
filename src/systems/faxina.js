// A FAXINA DO MÊS.
//
// Uma vez por mês a máquina olha o acervo de fusões publicadas e aponta a mais
// fraca — pra que o acervo não vire um depósito de coisa que ninguém desenhou
// de verdade.
//
// O QUE É "FRACA" AQUI
// Não é gosto: é o quanto o desenho difere da montagem automática. A montagem
// (corpo de um, cabeça do outro) é o PONTO DE PARTIDA da oficina; uma ficha que
// continua igual a ela é uma ficha que ninguém chegou a fazer. A conta é feita
// com o código de verdade do jogo — o mesmo `Assets.mon` que desenha na
// batalha — comparando pixel a pixel.
//
// E ELA NÃO APAGA SOZINHA. Ela mostra qual é e pergunta. Apagar desenho dos
// outros (ou o seu de três meses atrás) sem perguntar é o tipo de coisa que um
// programa não deve fazer calado. Um botão a mais, e ninguém perde nada sem
// saber.
import { DB } from "../data/index.js";
import { Assets, makeCanvas } from "../core/assets.js";
import { montarEspecie, chaveFicha } from "./fusao.js";
import { url as arquivo } from "../core/base.js";

/** o mês de hoje, no formato que fica gravado no save */
export const mesAtual = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

/** Já passou um mês desde a última faxina? (a primeira vez não conta: o save
 *  novo só marca o mês, pra não fazer faxina no primeiro dia de jogo) */
export function estaNaHora(st) {
  if (!st) return false;
  const agora = mesAtual();
  if (!st.flags) st.flags = {};
  if (!st.flags.faxina) { st.flags.faxina = agora; return false; }
  return st.flags.faxina !== agora;
}

export function marcarFeita(st) {
  if (st?.flags) st.flags.faxina = mesAtual();
}

/** Todas as fichas publicadas, com a dupla delas. */
export function publicadas() {
  return Object.entries(DB.FUSOES_FEITAS || {})
    .flatMap(([chave, lista]) => (lista || []).map((ficha) => ({ chave, ficha })));
}

const pixels = (img, lado = 64) => {
  const { cv, ctx } = makeCanvas(lado, lado);
  ctx.drawImage(img, 0, 0, lado, lado);
  try {
    return ctx.getImageData(0, 0, lado, lado).data;
  } catch { return null; }
};

const carregar = (src) => new Promise((resolve) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = () => resolve(null);
  img.src = src.startsWith("data:") ? src : arquivo(src);
});

/** Quantos por cento dos pixels desenhados diferem da montagem automática.
 *  0 = é a montagem inteirinha; 100 = não tem nada a ver com ela. */
export async function quantoFoiDesenhado(chave, ficha) {
  const [cabeca, corpo] = chave.split("+");
  const sp = montarEspecie(cabeca, corpo);
  if (!sp || !ficha?.sprite) return 100;
  // a montagem automática é a espécie SEM ficha: monta uma cópia limpa
  const limpo = { ...sp };
  delete limpo.spriteCustom;
  limpo.id = `${sp.id}#auto`;
  DB.SPECIES[limpo.id] = limpo;
  const auto = pixels(Assets.mon(limpo.id, 7));
  delete DB.SPECIES[limpo.id];
  const img = await carregar(ficha.sprite);
  const meu = img && pixels(img);
  if (!auto || !meu) return 100;

  let dif = 0, pintados = 0;
  for (let i = 0; i < meu.length; i += 4) {
    const a1 = meu[i + 3] > 40, a2 = auto[i + 3] > 40;
    if (a1 || a2) pintados++;
    if (a1 !== a2) { dif++; continue; }
    if (!a1) continue;
    if (Math.abs(meu[i] - auto[i]) > 12 || Math.abs(meu[i + 1] - auto[i + 1]) > 12
        || Math.abs(meu[i + 2] - auto[i + 2]) > 12) dif++;
  }
  return pintados ? Math.round((dif * 100) / pintados) : 100;
}

/** As mais fracas do acervo, da pior pra melhor. */
export async function piores(quantas = 3) {
  const todas = publicadas();
  const notas = [];
  for (const { chave, ficha } of todas) {
    notas.push({ chave, ficha, desenhado: await quantoFoiDesenhado(chave, ficha) });
  }
  notas.sort((a, b) => a.desenhado - b.desenhado);
  return notas.slice(0, quantas);
}

/** Manda o servidor apagar a ficha (e o desenho dela) do código. */
export async function apagarDoCodigo(chave, id) {
  try {
    const r = await fetch(arquivo("__ficha"), {
      method: "POST",
      body: JSON.stringify({ acao: "apagar", chave, ficha: { id } }),
    });
    if (!r.ok) return { ok: false, erro: "o servidor recusou" };
    const dado = await r.json().catch(() => ({}));
    // tira da memória também, pra sumir da máquina sem esperar o hot-swap
    const lista = DB.FUSOES_FEITAS?.[chave];
    if (lista) {
      DB.FUSOES_FEITAS[chave] = lista.filter((f) => f.id !== id);
      if (!DB.FUSOES_FEITAS[chave].length) delete DB.FUSOES_FEITAS[chave];
    }
    return { ok: true, ...dado };
  } catch { return { ok: false, erro: "o servidor não respondeu" }; }
}

export { chaveFicha };
