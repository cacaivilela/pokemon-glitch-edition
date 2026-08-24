// A FAXINA DA SEMANA.
//
// Toda semana a máquina olha o acervo de fusões publicadas e aponta as que MAL
// SAÍRAM DA MONTAGEM AUTOMÁTICA — pra que o acervo não vire um depósito de
// coisa que ninguém desenhou de verdade.
//
// O QUE É "MAL SAIU" AQUI
// Não é gosto: é o quanto o desenho difere da montagem automática. A montagem
// (corpo de um, cabeça do outro) é o PONTO DE PARTIDA da oficina; uma ficha que
// continua igual a ela é uma ficha que ninguém chegou a fazer. A conta é feita
// com o código de verdade do jogo — o mesmo `Assets.mon` que desenha na
// batalha — comparando pixel a pixel. Só entra na faxina quem está em LIMITE%
// ou menos: o resto foi desenhado, e desenho feito não é assunto da faxina.
//
// O QUE ELA NUNCA TOCA
// Ficha marcada com `protegida` em src/data/fusoes-feitas.js não sai, nem aqui
// nem no servidor (a rota de apagar recusa). Todo o acervo que existia quando a
// faxina virou semanal está marcado assim: acelerar a faxina não pode virar
// desculpa pra jogar fora o que já estava feito. A marca põe e tira pelo site,
// com a senha — é uma decisão, não um cadeado.
//
// O cadeado são as ETERNAS (abaixo): essas não saem de jeito nenhum, e soltar
// uma exige editar o código dos dois lados.
//
// E ELA NÃO APAGA SOZINHA. Ela mostra quais são e pergunta. Apagar desenho dos
// outros (ou o seu de três semanas atrás) sem perguntar é o tipo de coisa que um
// programa não deve fazer calado. Um botão a mais, e ninguém perde nada sem
// saber.
import { DB } from "../data/index.js";
import { Assets, makeCanvas } from "../core/assets.js";
import { montarEspecie, chaveFicha } from "./fusao.js";
import { url as arquivo } from "../core/base.js";

/** Quanto o desenho pode diferir da montagem automática e ainda ser "mal saiu
 *  dela", em por cento dos pixels. */
export const LIMITE = 10;

/** quantas ela oferece por semana */
export const POR_SEMANA = 3;

/** A segunda-feira desta semana, no formato que fica gravado no save. É a chave
 *  da semana: quem joga todo dia vê a faxina na segunda; quem só aparece na
 *  quarta vê na quarta — uma vez por semana, e não duas. */
export const semanaAtual = (hoje = new Date()) => {
  const seg = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  seg.setDate(seg.getDate() - ((seg.getDay() + 6) % 7));   // domingo (0) é o dia 6 da semana
  return `${seg.getFullYear()}-${String(seg.getMonth() + 1).padStart(2, "0")}`
       + `-${String(seg.getDate()).padStart(2, "0")}`;
};

/** Virou a semana desde a última faxina? (a primeira vez não conta: o save novo
 *  só marca a semana, pra não fazer faxina no primeiro dia de jogo) */
export function estaNaHora(st) {
  if (!st) return false;
  const agora = semanaAtual();
  if (!st.flags) st.flags = {};
  if (!st.flags.faxina) { st.flags.faxina = agora; return false; }
  return st.flags.faxina !== agora;
}

export function marcarFeita(st) {
  if (st?.flags) st.flags.faxina = semanaAtual();
}

/** AS ETERNAS. Ficha aqui dentro não sai NUNCA — nem sem proteção, nem com a
 *  senha certa, nem por um POST na mão. `protegida` é uma marca que se põe e se
 *  tira; isto aqui é regra escrita no código, e mudar exige mexer no código (nos
 *  dois lados: aqui e no dev_server.py). A LAPROCUNO está aqui porque é a
 *  ocarina do acervo, e ocarina não se joga fora. */
export const ETERNAS = new Set(["laprocuno"]);
export const ehEterna = (ficha) => ETERNAS.has(ficha?.id);

/** Ficha que a faxina pode encostar: sem a marca `protegida` e fora das eternas. */
export const podeSair = (ficha) => !!ficha && !ficha.protegida && !ehEterna(ficha);

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

/** A MONTAGEM AUTOMÁTICA daquela dupla: corpo de um, cabeça do outro, sem ficha
 *  nenhuma por cima. É o ponto de partida da oficina e é contra ela que a faxina
 *  mede — quem quiser mostrar as duas lado a lado pede aqui, pra ser a MESMA
 *  imagem que entra na conta. Devolve a arte pronta, ou null se a dupla não é
 *  dupla de verdade. */
export function montagemAutomatica(chave, seed = 7) {
  const [cabeca, corpo] = String(chave).split("+");
  const sp = montarEspecie(cabeca, corpo);
  if (!sp) return null;
  // a montagem automática é a espécie SEM ficha: monta uma cópia limpa
  const limpo = { ...sp };
  delete limpo.spriteCustom;
  limpo.id = `${sp.id}#auto`;
  DB.SPECIES[limpo.id] = limpo;
  const arte = Assets.mon(limpo.id, seed);
  delete DB.SPECIES[limpo.id];
  return arte;
}

/** Quantos por cento dos pixels desenhados diferem da montagem automática.
 *  0 = é a montagem inteirinha; 100 = não tem nada a ver com ela. */
export async function quantoFoiDesenhado(chave, ficha) {
  const arte = ficha?.sprite && montagemAutomatica(chave);
  if (!arte) return 100;
  const auto = pixels(arte);
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

/** As que mal saíram da montagem automática, da pior pra melhor — e só as que
 *  podem sair. Fora do LIMITE não é faxina: é desenho feito. */
export async function fracas(quantas = POR_SEMANA) {
  const notas = [];
  for (const { chave, ficha } of publicadas()) {
    if (!podeSair(ficha)) continue;
    const desenhado = await quantoFoiDesenhado(chave, ficha);
    if (desenhado <= LIMITE) notas.push({ chave, ficha, desenhado });
  }
  notas.sort((a, b) => a.desenhado - b.desenhado);
  return notas.slice(0, quantas);
}

/** A senha que o servidor exige pra apagar. A máquina do jogo sabe ela porque é
 *  a outra porta da faxina — a primeira é o site (`faxinamissingno/`), que não sabe:
 *  lá ela é digitada. Não é segredo de verdade (está aqui, no código); é um
 *  passo de propósito, pra apagar desenho nunca ser um acidente. */
const SENHA = "giveglitch";

/** Manda o servidor apagar a ficha (e o desenho dela) do código. */
export async function apagarDoCodigo(chave, id, senha = SENHA) {
  const ficha = (DB.FUSOES_FEITAS?.[chave] || []).find((f) => f.id === id);
  if (ehEterna(ficha) || ETERNAS.has(id)) return { ok: false, erro: "essa ficha não sai nunca" };
  if (ficha && !podeSair(ficha)) return { ok: false, erro: "essa ficha está protegida" };
  try {
    const r = await fetch(arquivo("__ficha"), {
      method: "POST",
      body: JSON.stringify({ acao: "apagar", chave, ficha: { id }, senha }),
    });
    const dado = await r.json().catch(() => ({}));
    if (!r.ok) return { ok: false, erro: dado.erro || "o servidor recusou" };
    // tira da memória também, pra sumir da máquina sem esperar o hot-swap
    const lista = DB.FUSOES_FEITAS?.[chave];
    if (lista) {
      DB.FUSOES_FEITAS[chave] = lista.filter((f) => f.id !== id);
      if (!DB.FUSOES_FEITAS[chave].length) delete DB.FUSOES_FEITAS[chave];
    }
    return { ok: true, ...dado };
  } catch { return { ok: false, erro: "o servidor não respondeu" }; }
}

/** Põe ou tira a marca `protegida`. Tirar é um passo consciente, com a senha —
 *  e não solta as ETERNAS: aquelas não dependem da marca. */
export async function marcarProtecao(chave, id, marcar, senha = SENHA) {
  try {
    const r = await fetch(arquivo("__ficha"), {
      method: "POST",
      body: JSON.stringify({ acao: marcar ? "proteger" : "desproteger", chave, ficha: { id }, senha }),
    });
    const dado = await r.json().catch(() => ({}));
    if (!r.ok || !dado.ok) return { ok: false, erro: dado.erro || "o servidor recusou" };
    const ficha = (DB.FUSOES_FEITAS?.[chave] || []).find((f) => f.id === id);
    if (ficha) {                            // vale já, sem esperar o hot-swap
      if (marcar) ficha.protegida = true;
      else delete ficha.protegida;
    }
    return { ok: true };
  } catch { return { ok: false, erro: "o servidor não respondeu" }; }
}

export const proteger = (chave, id, senha) => marcarProtecao(chave, id, true, senha);
export const desproteger = (chave, id, senha) => marcarProtecao(chave, id, false, senha);

export { chaveFicha };
