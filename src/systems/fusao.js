// FUSÃO — a parte viva. As regras (nome, atributos, tipos, golpes) estão em
// src/data/fusao.js e têm hot-swap; aqui é o que mexe no save.
//
// Uma fusão é uma ESPÉCIE de verdade, com id `fus-<cabeça>-<corpo>`. Ela não
// está em src/data/: é montada na hora e registrada em DB.SPECIES, porque
// existem 255x256 combinações possíveis e guardar todas seria guardar um
// catálogo pra usar três linhas dele. Como o id carrega os dois lados, dá pra
// remontar a espécie só de olhar pro save — é o que `registrarDoEstado` faz ao
// carregar a partida, ao adotar um save de fora e a cada hot-swap dos dados.
//
// Diferente da MEGA, a fusão FICA: ela é gravada. O que também é gravado são os
// dois Pokémon originais, inteiros, dentro de `mon.fusao` — separar é devolver
// os dois de volta, não montar cópias parecidas.
import { url as arquivo } from "../core/base.js";
import { DB } from "../data/index.js";
import { createMon, recalc, xpForLevel, learnableMoves, darClarao, evolutionFor } from "./mon.js";
import { todosGuardados } from "./box.js";
import { ehBizarro, garantirBizarro } from "./bizarro.js";

const cfg = () => DB.FUSAO || {};
const PREFIXO = "fus";

// ---------------------------------------------------------------- fichas
// A FICHA é a fusão que o JOGADOR criou na oficina: nome, tipos, quanto cada
// atributo sobe por nível e o desenho de 256x256. Ela mora no save
// (`state.fusoes`, indexada por "cabeça+corpo") e ganha da fusão automática
// sempre que aquele par for fundido — inclusive nos que já estão fundidos, que
// passam a valer pela ficha nova no instante em que ela é gravada.
//
// Quem escreve aqui é o editor; quem lê é `montarEspecie`. Como o DB.SPECIES é
// remontado do zero a cada hot-swap, o sistema guarda uma referência ao estado
// da partida pra saber de onde vêm as fichas.
let estado = null;

// FUSÃO TRIPLA: um terceiro Pokémon, as PERNAS. A chave vira "cabeça+meio+pernas"
// e o id "fus-cabeça-meio-pernas" — sem pernas, tudo continua como sempre foi.
export const chaveFicha = (cabeca, corpo, pernas = "") => `${cabeca}+${corpo}` + (pernas ? `+${pernas}` : "");

/** Diz de qual partida as fichas vêm (chamado junto com registrarDoEstado). */
export function ligarEstado(st) { if (st?.player || st?.party) estado = st; }

export const fichaDe = (cabeca, corpo, pernas = "") => estado?.fusoes?.[chaveFicha(cabeca, corpo, pernas)] || null;
export const temFicha = (cabeca, corpo) => !!fichaDe(cabeca, corpo);
/** A ficha do MESMO par, mas com os lados trocados. Fazer a ficha de A+B e
 *  depois fundir B+A é o erro mais fácil de cometer aqui — a máquina passou a
 *  avisar em vez de ignorar o desenho calada. */
export const fichaInvertida = (cabeca, corpo) => fichaDe(corpo, cabeca);

/** Quantas versões existem com os lados TROCADOS — a sua ficha e as escritas
 *  (do jogo ou publicadas). Fazer a fusão de A+B e depois fundir B+A é o erro
 *  mais fácil daqui, e antes o aviso só olhava pra sua própria ficha: uma
 *  versão publicada no par invertido não aparecia e ninguém dizia nada. */
export function versoesInvertidas(cabeca, corpo) {
  const lista = fichasProntas(corpo, cabeca);
  const minha = fichaDe(corpo, cabeca);
  return { quantas: lista.length + (minha ? 1 : 0), nome: (minha || lista[0])?.nome || "" };
}

// O id da fusão carrega a dupla e, depois do ~, a VARIANTE: qual das fusões
// daquela dupla é esta. Sem variante é a fusão da própria partida — a que a
// máquina calcula, ou a ficha que você fez na oficina. Com variante é uma das
// que já existem no jogo (src/data/fusoes.js) ou que um jogador publicou
// (src/data/fusoes-feitas.js).
export const idFusao = (cabeca, corpo, variante = "", pernas = "") =>
  `${PREFIXO}-${cabeca}-${corpo}` + (pernas ? `-${pernas}` : "") + (variante ? `~${variante}` : "");

/** { cabeca, corpo, pernas, variante } de um id de fusão, ou null se não for
 *  um. `pernas` só existe na fusão tripla (senão é ""). */
/** OS NOMES ESCOLHIDOS À MÃO (o CAIO: "mudkip + cubchoo vai ser o mudchoo"):
 *  "cabeca+corpo" (ou "cabeca+meio+pernas") -> o nome */
/** AS PÁGINAS ESCRITAS À MÃO (pelo Claude, nov/2026), das fusões que o CAIO
 *  achou na calculadora: "cabeça+corpo" -> o texto. As outras são misturadas
 *  sozinhas (`misturarDex`). */
export const DEX_ESCRITOS = {
  "cacnea+cacturne": "TODO MUNDO ACHA QUE ELE É UMA COMIDA. ELE ODEIA O PRÓPRIO NOME E SE ESCONDE NO DESERTO NA HORA DO ALMOÇO.",
  "zekrom+kadabra": "ELE QUERIA TER LISTRAS. TENTOU COM A COLHER, COM O PENSAMENTO E COM UM RAIO. CONTINUA TODO PRETO.",
  "furfrou+altaria": "FICA BRAVO QUANDO DESPENTEIAM O PELO DELE. COMO O PELO É DE NUVEM, VIVE BRAVO EM DIA DE VENTO.",
  "baltoy+roggenrola": "GIRA TÃO RÁPIDO QUE SAI VOANDO IGUAL UMA BALA. TEM GENTE QUE JÁ TENTOU CHUPAR. QUEBROU O DENTE.",
  "gogoat+noivern": "ACHA QUE MANDA NA FLORESTA INTEIRA. DE NOITE, VOA EM CIMA DAS ÁRVORES PRA VER SE TODO MUNDO OBEDECEU.",
  "machop+sprigatito": "TREINA NO MEIO DO MATO TODO DIA. O CHEIRO DOCE DO PELO FAZ O ADVERSÁRIO DORMIR ANTES DA LUTA COMEÇAR.",
  "eternatus+magikarp": "TEM PODER PRA ACABAR COM O MUNDO INTEIRO. MAS SÓ SABE USAR SPLASH, ENTÃO FICA PULANDO NO LUGAR PRA SEMPRE.",
  "gothitelle+nosepass": "MORA NO ALTO DA TORRE POKÉMON. QUANDO ELE GRITA, PARECE A MÚSICA DE UM FILME DE TERROR BEM ANTIGO.",
  "servine+raichuhack": "ENTRA NOS SERVIDORES PELO FIO DA TOMADA. JÁ DERRUBOU O ONLINE TRÊS VEZES SÓ PRA VER O QUE ACONTECIA.",
  "cacnea+vullaby": "ESPERA SEM SE MEXER ATÉ ALGUÉM CHEGAR PERTO. AÍ ABRE AS ASAS DE ESPINHO E DÁ UM SUSTO QUE GELA A ESPINHA.",
  "darmanitan+pichu": "PARECE UM BEBÊ FOFINHO. QUANDO FICA BRAVO, O FOGO DA TESTA ACENDE E OS CHOQUES SAEM PRA TODO LADO.",
  "froslass+gyarados": "APARECE NO MEIO DA NEVASCA, BEM ATRÁS DE QUEM SE PERDEU. NINGUÉM SABE SE É UM FANTASMA OU UM DRAGÃO.",
  "pikachu+charmander": "A CAUDA SOLTA FOGO E AS BOCHECHAS SOLTAM CHOQUE. QUANDO ESPIRRA, SAI OS DOIS AO MESMO TEMPO.",
  "mudkip+cubchoo": "O NARIZ ESCORRE SEM PARAR. ELE USA O CATARRO PRA SENTIR A ÁGUA E O GELO, ENTÃO NUNCA LIMPA.",
  "eevee+dhelmise": "UM EEVEE QUE CAIU NO MAR E VIROU ÂNCORA. PUXA OS NAVIOS PRO FUNDO SÓ PRA TER COM QUEM BRINCAR.",
  "roaringmoon+tangrowth": "AS VINHAS VERMELHAS CRESCEM UM METRO POR NOITE. QUEM ENTRA NA MATA DELE NÃO ACHA MAIS A SAÍDA.",
};

export const NOMES_ESCOLHIDOS = {
  "mudkip+cubchoo": "MUDCHOO",
  "pikachu+charmander": "PICHANDER",
};
let nomesReais = null;
/** o nome da fusão: o escolhido à mão, ou o da conta (começo da cabeça + fim do
 *  corpo) — e se a conta der o nome de um Pokémon DE VERDADE (PIDOVE + PIDGEY
 *  dava "PIDGEY"), ele pega uma letra a mais da cabeça até ficar diferente */
/** A PÁGINA DA POKÉDEX DA FUSÃO: um pedaço da página de quem dá a cabeça e um
 *  da de quem dá o corpo (as pernas, na tripla, entram no fim). Com duas frases
 *  cada, vai a primeira de um e a última do outro; com uma frase só, ela é
 *  cortada na vírgula (ou no " E ") e o começo de um emenda no fim do outro.
 *  O nome de cada um, no meio do texto, vira o nome da fusão. */
function misturarDex(cab, cor, per, nome) {
  // (frase curtinha, tipo "FILHOTE.", gruda na seguinte: sozinha não diz nada)
  const frases = (t) => String(t || "").trim().split(/(?<=[.!?])\s+/).filter(Boolean)
    .reduce((out, f) => { if (out.length && out[out.length - 1].length < 16) out[out.length - 1] += " " + f; else out.push(f); return out; }, []);
  const A = frases(cab.dexText), B = frases(cor.dexText);
  if (!A.length || !B.length) return "";
  // corta uma frase em duas: [começo, emenda, resto]
  const cortar = (f) => {
    const m = f.match(/^(.{8,}?)(, | E | QUE | MAS )(.{8,})$/);
    return m ? [m[1], m[2], m[3]] : null;
  };
  let texto;
  if (A.length >= 2 && B.length >= 2) texto = `${A[0]} ${B[B.length - 1]}`;
  else {
    const a = cortar(A[0]), b = cortar(B[B.length - 1]);
    if (a && b) texto = `${a[0]}${b[1]}${b[2]}` + (A.length >= 2 ? ` ${A[1]}` : "") ;
    else texto = A[0] === B[B.length - 1] ? A[0] : `${A[0]} ${B[B.length - 1]}`;
  }
  if (per) {
    const P = frases(per.dexText);
    if (P.length && !texto.includes(P[P.length - 1])) texto += ` ${P[P.length - 1]}`;
  }
  for (const n of [cab.name, cor.name, per?.name].filter(Boolean)) texto = texto.split(n).join(nome);
  return texto;
}

function nomeDaFusao(F, cab, cor, per) {
  const chave = [cab.id, cor.id, per?.id].filter(Boolean).join("+");
  if (NOMES_ESCOLHIDOS[chave]) return NOMES_ESCOLHIDOS[chave];
  let nome = per ? F.nome3(cab.name, cor.name, per.name) : F.nome(cab.name, cor.name);
  nomesReais ||= new Set(Object.values(DB.SPECIES || {}).filter((x) => !x.fusao).map((x) => x.name));
  // o pedaço que veio da cabeça é o começo em comum com o nome dela; a conta
  // cresce esse pedaço uma letra por vez, e o fim (do corpo) fica igual
  const A = String(cab.name);
  let k = 0;
  while (k < nome.length && k < A.length && nome[k] === A[k]) k++;
  const fim = nome.slice(k), base = nome;
  for (let extra = 1; nomesReais.has(nome) && k + extra <= A.length; extra++) nome = A.slice(0, k + extra) + fim;
  return nomesReais.has(nome) ? base + "X" : nome;
}

export function partes(id) {
  if (typeof id !== "string" || !id.startsWith(PREFIXO + "-")) return null;
  const [base, variante = ""] = id.split("~");
  const [, cabeca, corpo, pernas = ""] = base.split("-");   // ids de espécie são só [a-z0-9]
  return cabeca && corpo ? { cabeca, corpo, pernas, variante } : null;
}

/** As fusões daquela dupla que já vêm escritas: as do jogo primeiro, depois as
 *  que jogadores publicaram pela oficina. */
export function fichasProntas(cabeca, corpo, pernas = "") {
  const k = chaveFicha(cabeca, corpo, pernas);
  const lista = [
    ...(DB.FUSOES?.[k] || []).map((f) => ({ ...f, origem: "jogo" })),
    ...(DB.FUSOES_FEITAS?.[k] || []).map((f) => ({ ...f, origem: "jogador" })),
  ].filter((f) => f?.id);
  // mesma ficha no arquivo e no download: a do arquivo manda
  const vistas = new Set();
  return lista.filter((f) => !vistas.has(f.id) && vistas.add(f.id));
}

export const fichaPronta = (cabeca, corpo, variante, pernas = "") =>
  fichasProntas(cabeca, corpo, pernas).find((f) => f.id === variante) || null;

/** Tudo que aquela dupla pode virar, na ordem em que o C passa por elas. */
export function variantes(cabeca, corpo, pernas = "") {
  const minha = fichaDe(cabeca, corpo, pernas);
  const lista = [{
    variante: "", ficha: minha, origem: minha ? "sua" : "auto",
    rotulo: minha ? "SUA FICHA" : "AUTOMÁTICA",
  }];
  for (const f of fichasProntas(cabeca, corpo, pernas)) {
    lista.push({
      variante: f.id, ficha: f, origem: f.origem,
      rotulo: f.origem === "jogo" ? "DO JOGO" : `DE ${(f.autor || "ALGUÉM").slice(0, 8)}`,
    });
  }
  return lista;
}

export const ehFusao = (mon) => !!partes(mon?.species);

/** Monta a espécie da fusão. Devolve null se um dos lados não existe mais. */
export function montarEspecie(cabecaId, corpoId, variante = "", pernasId = "") {
  const cab = DB.SPECIES?.[cabecaId];
  const cor = DB.SPECIES?.[corpoId];
  const per = pernasId ? DB.SPECIES?.[pernasId] : null;
  if (!cab || !cor || cab.mega || cor.mega || partes(cabecaId) || partes(corpoId)) return null;
  if (pernasId && (!per || per.mega || partes(pernasId))) return null;
  const F = cfg();
  const id = idFusao(cabecaId, corpoId, variante, pernasId);
  const base = per ? F.stats3(cab.base, cor.base, per.base) : F.stats(cab.base, cor.base);
  const bst = Object.values(base).reduce((a, b) => a + b, 0);
  const sp = {
    id,
    dex: 0,                                    // fusão não entra na Pokédex de Kanto
    name: nomeDaFusao(F, cab, cor, per),
    types: per ? F.tipos3(cab, cor, per) : F.tipos(cab, cor),
    base,
    bst,
    catchRate: Math.floor(((cab.catchRate || 45) + (cor.catchRate || 45)) / 2),
    xpYield: Math.floor(((cab.xpYield || 60) + (cor.xpYield || 60) + (per ? per.xpYield || 60 : 0)) / (per ? 2.5 : 2)),
    learnset: F.learnset(cab, cor, per),
    dexText: "",
    lore: true,
    codigo: F.codigo(cab, cor) + (per ? ((per.dex || 0) % 256).toString(16).toUpperCase().padStart(2, "0") : ""),
    fusao: { cabeca: cabecaId, corpo: corpoId, variante, ...(per ? { pernas: pernasId } : {}) },
  };
  // a página da Pokédex: as duas páginas misturadas (pedido do CAIO, nov/2026)
  sp.dexText = (!per && DEX_ESCRITOS[`${cabecaId}+${corpoId}`]) || misturarDex(cab, cor, per, sp.name) || String((per && F.dexText3) || F.dexText || "")
    .replace("{CABECA}", cab.name).replace("{CORPO}", cor.name).replace("{PERNAS}", per?.name || "");
  // sem variante vale a sua ficha (a da oficina, que mora no save); com
  // variante vale a ficha escrita no código
  const ficha = variante ? fichaPronta(cabecaId, corpoId, variante, pernasId) : fichaDe(cabecaId, corpoId, pernasId);
  if (variante && !ficha) return null;          // variante que não existe mais
  return comFicha(sp, ficha);
}

/** Põe a ficha do jogador por cima da fusão automática. O que ele não mexeu
 *  continua vindo dos dois Pokémon. */
function comFicha(sp, ficha) {
  if (!ficha) return sp;
  if (ficha.nome) sp.name = String(ficha.nome).slice(0, cfg().nomeMax || 11);
  if (ficha.tipos?.length) sp.types = ficha.tipos.slice(0, sp.fusao?.pernas ? 3 : 2);
  if (ficha.crescimento) {
    // com crescimento, `recalc` larga a fórmula das espécies e usa esta conta:
    // valor = inicial + crescimento x nível (ver src/systems/mon.js)
    sp.crescimento = { ...ficha.crescimento };
    sp.inicial = { ...(ficha.inicial || {}) };
    const F = cfg();
    sp.bst = ["hp", "atk", "def", "spa", "spd", "spe"]
      .reduce((n, k) => n + F.valor(ficha, k, 50), 0);      // "TOTAL" = a soma no nível 50
  }
  if (ficha.sprite) sp.spriteCustom = ficha.sprite;
  if (ficha.lore) sp.dexText = ficha.lore;
  if (ficha.autor) sp.autor = ficha.autor;
  sp.ficha = true;
  return sp;
}

/** Garante que a espécie daquele id existe em DB.SPECIES. Devolve a espécie.
 *
 *  Se a VARIANTE não existe mais — a faxina apagou aquela ficha, ou o save veio
 *  de outra máquina que tinha uma versão que esta não tem — ela cai na fusão
 *  automática da mesma dupla, mantendo o id que está gravado no Pokémon. Sem
 *  isso, um bicho da sua equipe apontaria pra uma espécie inexistente, `isValid`
 *  reprovaria o save inteiro e o jogo começaria do zero. Perder o desenho de uma
 *  fusão é chato; perder a partida por causa disso seria absurdo. */
export function garantirEspecie(id) {
  if (DB.SPECIES?.[id]) return DB.SPECIES[id];
  if (ehBizarro(id)) return garantirBizarro(id);     // o BIZARRO do PORTAL PARADOXO: sai da semente do id
  const p = partes(id);
  if (!p) return null;
  let sp = montarEspecie(p.cabeca, p.corpo, p.variante, p.pernas);
  if (!sp && p.variante) {
    sp = montarEspecie(p.cabeca, p.corpo, "", p.pernas);      // a versão sumiu: vale a automática
    if (sp) sp.id = id;                          // mas o Pokémon continua sendo o mesmo
  }
  if (sp) DB.SPECIES[id] = sp;
  return sp;
}

/** Registra as fusões que este save tem (equipe, PC e quem estiver em batalha).
 *  Chamado no boot, ao adotar um save de fora e depois de cada hot-swap — o
 *  DB.SPECIES é remontado do zero nessas horas e levaria as fusões junto. */
export function registrarDoEstado(st) {
  if (!st || !DB.SPECIES) return 0;
  ligarEstado(st);
  let n = 0;
  for (const mon of [...(st.party || []), ...(st.box || []), ...todosGuardados(st)]) {
    if ((ehFusao(mon) || ehBizarro(mon.species)) && garantirEspecie(mon.species)) n++;
  }
  return n;
}

/** A fração de HP que o Pokémon tem agora (pra fusão e separação não curarem). */
const fracao = (mon) => (mon.maxHp > 0 ? Math.max(0, Math.min(1, mon.hp / mon.maxHp)) : 0);
const clone = (mon) => JSON.parse(JSON.stringify(mon));

/** Os golpes que a fusão leva: os da cabeça primeiro, os do corpo depois, sem
 *  repetir, até quatro. Se os dois não souberem nada, cai no learnset. */
function golpesDaFusao(cab, cor, sp, level, per = null) {
  const escolhidos = [];
  for (const mv of [...(cab.moves || []), ...(cor.moves || []), ...(per?.moves || [])]) {
    if (escolhidos.length >= 4 || escolhidos.some((m) => m.id === mv.id)) continue;
    if (!DB.MOVES[mv.id]) continue;
    escolhidos.push({ id: mv.id, pp: mv.pp, ppMax: mv.ppMax });
  }
  if (escolhidos.length) return escolhidos;
  return learnableMoves(sp.id, level).slice(-4)
    .map((id) => ({ id, pp: DB.MOVES[id].pp, ppMax: DB.MOVES[id].pp }));
}

/** FUNDIR: `cabeca` e `corpo` viram um Pokémon só. Os dois originais vão
 *  inteiros pra dentro dele — é deles que a separação sai. */
export function fundir(cabeca, corpo, variante = "", pernas = null) {
  if (!cabeca || !corpo || cabeca === corpo) return null;
  if (ehFusao(cabeca) || ehFusao(corpo)) return null;
  if (pernas && (pernas === cabeca || pernas === corpo || ehFusao(pernas))) return null;
  const sp = montarEspecie(cabeca.species, corpo.species, variante, pernas?.species || "");
  if (!sp) return null;
  DB.SPECIES[sp.id] = sp;

  const todos = [cabeca, corpo, pernas].filter(Boolean);
  const level = Math.max(...todos.map((m) => m.level));
  const ivs = {};
  for (const k of ["hp", "atk", "def", "spa", "spd", "spe"]) {
    ivs[k] = Math.round(todos.reduce((n, m) => n + (m.ivs?.[k] || 0), 0) / todos.length);
  }
  const mon = createMon(sp.id, level, {
    ivs,
    shiny: todos.some((m) => m.shiny),
    luminoso: todos.some((m) => m.luminoso),
    corrupt: todos.some((m) => m.corrupt),
    seed: cabeca.seed,
  });
  mon.moves = golpesDaFusao(cabeca, corpo, sp, level, pernas);
  mon.status = todos.map((m) => m.status).find(Boolean) || null;
  mon.hp = Math.max(1, Math.round(mon.maxHp * (todos.reduce((n, m) => n + fracao(m), 0) / todos.length)));
  mon.fusao = { cabeca: clone(cabeca), corpo: clone(corpo), ...(pernas ? { pernas: clone(pernas) } : {}) };
  // O BRILHO PEGA. Fundir um shiny com um comum não deixa a cor de um deles
  // pra trás: a fusão sai shiny e os DOIS que estão guardados lá dentro saem
  // shiny também — separar depois devolve os dois brilhando. É a única coisa
  // que a máquina escreve por cima do que entrou.
  if (mon.shiny) {
    mon.fusao.cabeca.shiny = true;
    mon.fusao.corpo.shiny = true;
    if (mon.fusao.pernas) mon.fusao.pernas.shiny = true;
    mon.brilhouNaFusao = !todos.every((m) => m.shiny);    // um só era: pegou nos outros
  }
  // A LUZ PEGA IGUAL, e ganha do shiny: um luminoso fundido com um shiny devolve
  // luminosos. Ela é a cor mais rara do jogo — sair de dentro da máquina
  // valendo menos do que entrou seria a máquina cobrando pra fundir.
  if (mon.luminoso) {
    mon.shiny = false;
    for (const k of ["cabeca", "corpo", "pernas"]) {
      if (mon.fusao[k]) { mon.fusao[k].luminoso = true; mon.fusao[k].shiny = false; }
    }
    mon.brilhouNaFusao = !todos.every((m) => m.luminoso);
    darClarao(mon);   // os golpes da fusão vêm depois do createMon: o clarão volta aqui
  }
  return mon;
}

/** TROCAR A VERSÃO de quem já está fundido.
 *
 *  Fundir escolhe a versão no `C` — mas quem já fundiu (ou publicou uma ficha
 *  depois de fundir) ficava preso na que pegou. Aqui a espécie do Pokémon passa
 *  a ser a outra variante da MESMA dupla: ele continua sendo ele (nível, HP,
 *  golpes, e os dois guardados lá dentro), muda o que a variante manda — nome,
 *  tipos, desenho e crescimento. */
export function trocarVariante(mon, variante = "") {
  const p = partes(mon?.species);
  if (!p) return null;
  const sp = montarEspecie(p.cabeca, p.corpo, variante, p.pernas);
  if (!sp) return null;
  DB.SPECIES[sp.id] = sp;
  const nomeAntigo = mon.name;
  const frac = fracao(mon);
  mon.species = sp.id;
  if (mon.nickname === nomeAntigo) mon.nickname = sp.name;   // apelido próprio fica
  recalc(mon);
  mon.hp = Math.max(mon.hp > 0 ? 1 : 0, Math.round(mon.maxHp * frac));
  return sp;
}

/** SEPARAR: devolve [cabeça, corpo] (ou [cabeça, meio, pernas]) como eram — mas com o que a fusão viveu.
 *  Nível, HP e status voltam pros dois; ninguém sai da máquina mais fraco do
 *  que entrou nem curado de graça. */
export function separar(fus) {
  const p = partes(fus?.species);
  if (!p) return null;
  const guardados = fus.fusao || {};
  const frac = fracao(fus);
  const sair = (guardado, especie) => {
    let mon = null;
    if (guardado && DB.SPECIES[guardado.species]) mon = clone(guardado);
    else if (DB.SPECIES[especie]) mon = createMon(especie, fus.level);   // save mexido à mão
    if (!mon) return null;
    delete mon.fusao;
    mon.level = Math.max(1, Math.min(100, Math.max(mon.level || 1, fus.level)));
    mon.xp = Math.max(mon.xp || 0, xpForLevel(mon.level));
    recalc(mon);
    mon.hp = Math.max(fus.hp > 0 ? 1 : 0, Math.round(mon.maxHp * frac));
    mon.status = fus.status || null;
    if (fus.shiny) mon.shiny = true;
    if (fus.luminoso) { mon.luminoso = true; mon.shiny = false; }
    return mon;
  };
  const cabeca = sair(guardados.cabeca, p.cabeca);
  const corpo = sair(guardados.corpo, p.corpo);
  if (!cabeca || !corpo) return null;
  if (!p.pernas) return [cabeca, corpo];
  const pernas = sair(guardados.pernas, p.pernas);
  return pernas ? [cabeca, corpo, pernas] : null;
}

/** Quem na equipe pode entrar na máquina (fusão de fusão, não). */
export const fundivel = (mon) => !!mon && !ehFusao(mon);

/** O nome que a fusão VAI ter, pra máquina mostrar antes de você confirmar. */
export function previsao(cabeca, corpo, variante = "", pernas = null) {
  if (!cabeca || !corpo || cabeca === corpo) return null;
  const sp = montarEspecie(cabeca.species, corpo.species, variante, pernas?.species || "");
  // registra: é assim que a máquina consegue DESENHAR o resultado antes de
  // você confirmar (Assets.mon monta o sprite a partir da espécie)
  if (sp) DB.SPECIES[sp.id] = sp;
  return sp;
}

/** IMPORTAR uma ficha que veio de fora (o arquivo que o FUSIONGLITCH baixa).
 *  Confere tudo antes de deixar entrar: a dupla existe, o nome cabe, os tipos
 *  existem, os números estão na faixa e o desenho é PNG. Um arquivo estragado
 *  (ou de outra coisa) não vira nada — devolve o motivo. */
export function importarFicha(st, texto) {
  let cru;
  try {
    cru = typeof texto === "string" ? JSON.parse(texto) : texto;
  } catch { return { ok: false, erro: "NÃO É UM ARQUIVO DE FICHA" }; }

  const chave = String(cru?.chave || "");
  const ficha = cru?.ficha;
  if (!/^[a-z0-9]+\+[a-z0-9]+(\+[a-z0-9]+)?$/.test(chave)) return { ok: false, erro: "SEM A DUPLA DENTRO" };
  if (!ficha || typeof ficha !== "object") return { ok: false, erro: "SEM A FICHA DENTRO" };

  const [cabeca, corpo, pernas = ""] = chave.split("+");
  if (!DB.SPECIES[cabeca] || !DB.SPECIES[corpo] || (pernas && !DB.SPECIES[pernas])) {
    return { ok: false, erro: "ESSA DUPLA NÃO EXISTE AQUI" };
  }

  const nome = String(ficha.nome || "").toUpperCase().slice(0, cfg().nomeMax || 11).trim();
  if (!nome) return { ok: false, erro: "FICHA SEM NOME" };

  const tipos = (Array.isArray(ficha.tipos) ? ficha.tipos : [])
    .map((t) => String(t).toUpperCase())
    .filter((t) => (DB.TYPES || []).includes(t))
    .slice(0, pernas ? 3 : 2);
  if (!tipos.length) return { ok: false, erro: "TIPO QUE NÃO EXISTE" };

  const numeros = (fonte, min, max) => {
    const out = {};
    for (const k of ["hp", "atk", "def", "spa", "spd", "spe"]) {
      const v = Number((fonte || {})[k]);
      if (Number.isFinite(v)) out[k] = Math.max(min, Math.min(max, Math.round(v * 10) / 10));
    }
    return out;
  };

  const sprite = typeof ficha.sprite === "string" ? ficha.sprite : "";
  // vale o desenho embutido (o que vem do site) e o caminho de arquivo (o que
  // as fichas publicadas usam desde que os PNGs saíram de dentro do código)
  const ehArquivo = /^assets\/fusoes\/[\w+~.-]+\.png$/.test(sprite);
  if (sprite && !sprite.startsWith("data:image/png;base64,") && !ehArquivo) {
    return { ok: false, erro: "O DESENHO NÃO É PNG" };
  }
  if (sprite.length > 96 * 1024) return { ok: false, erro: "O DESENHO É GRANDE DEMAIS" };

  const limpa = {
    nome,
    tipos,
    inicial: numeros(ficha.inicial, 0, 200),
    crescimento: numeros(ficha.crescimento, 0, 9),
    ...(sprite ? { sprite } : {}),
    ...(ficha.lore ? { lore: String(ficha.lore).slice(0, 200) } : {}),
    ...(ficha.autor ? { autor: String(ficha.autor).toUpperCase().slice(0, 10) } : {}),
  };
  const sp = salvarFicha(st, cabeca, corpo, limpa, pernas);
  if (!sp) return { ok: false, erro: "NÃO DEU PRA MONTAR A ESPÉCIE" };
  return { ok: true, sp, cabeca, corpo, pernas };
}

/** Acha a espécie por NÚMERO da Pokédex ou por NOME — é assim que a oficina
 *  deixa você desenhar uma dupla que você não tem (e talvez nunca tenha).
 *  Aceita "025", "25", "PIKACHU", "pikachu", "MR. MIME", "NIDORAN M". Formas
 *  MEGA e fusões ficam de fora: elas não são ponto de partida de nada. */
export function especiePorTexto(texto) {
  const cru = String(texto || "").trim();
  if (!cru) return null;
  const candidatos = Object.values(DB.SPECIES || {}).filter((sp) => !sp.mega && !sp.vinculo && !partes(sp.id));

  if (/^\d+$/.test(cru)) {
    const n = parseInt(cru, 10);
    // número da Pokédex: a espécie base ganha da forma alternativa (DEOXYS)
    const iguais = candidatos.filter((sp) => sp.dex === n);
    return iguais.find((sp) => !sp.name.includes("-")) || iguais[0] || null;
  }

  const limpa = (t) => String(t).toLowerCase().replace(/[^a-z0-9]+/g, "");
  const alvo = limpa(cru);
  if (!alvo) return null;
  return candidatos.find((sp) => sp.id === alvo || limpa(sp.name) === alvo)
    || candidatos.find((sp) => sp.id.startsWith(alvo) || limpa(sp.name).startsWith(alvo))
    || null;
}

// ---------------------------------------------------------------- oficina
/** A ficha que o editor abre: a do jogador, se existir, ou a que a máquina
 *  calcularia sozinha pra aquele par. */
export function fichaParaEditar(cabecaId, corpoId) {
  const salva = fichaDe(cabecaId, corpoId);
  if (salva) return JSON.parse(JSON.stringify(salva));
  const auto = montarEspecie(cabecaId, corpoId);
  return auto ? cfg().ficha(auto) : null;
}

/** Grava a ficha no save e faz valer na hora: a espécie é remontada e todo
 *  mundo que já é dessa fusão recalcula (nome, tipos e atributos novos). */
export function salvarFicha(st, cabecaId, corpoId, ficha, pernasId = "") {
  if (!st || !ficha) return null;
  (st.fusoes ||= {})[chaveFicha(cabecaId, corpoId, pernasId)] = ficha;
  ligarEstado(st);
  const sp = montarEspecie(cabecaId, corpoId, "", pernasId);
  if (!sp) return null;
  DB.SPECIES[sp.id] = sp;
  for (const mon of [...(st.party || []), ...todosGuardados(st)]) {
    if (mon.species !== sp.id) continue;
    const antes = mon.maxHp;
    if (mon.nickname === mon.name) mon.nickname = sp.name;   // apelido próprio fica
    recalc(mon);
    mon.hp = Math.max(mon.hp > 0 ? 1 : 0, Math.min(mon.maxHp, mon.hp + (mon.maxHp - antes)));
  }
  return sp;
}

/** Joga a ficha fora: aquele par volta a ser o que a máquina calcula. */
export function apagarFicha(st, cabecaId, corpoId) {
  if (!st?.fusoes) return null;
  delete st.fusoes[chaveFicha(cabecaId, corpoId)];
  ligarEstado(st);
  const sp = montarEspecie(cabecaId, corpoId);
  if (sp) DB.SPECIES[sp.id] = sp;
  for (const mon of [...(st.party || []), ...todosGuardados(st)]) {
    if (mon.species === sp?.id) recalc(mon);
  }
  return sp;
}

/** Traz a ficha do par invertido pra este par (o desenho vem junto). */
export function copiarInvertida(st, cabecaId, corpoId) {
  const outra = fichaInvertida(cabecaId, corpoId);
  if (!outra) return null;
  return salvarFicha(st, cabecaId, corpoId, JSON.parse(JSON.stringify(outra)));
}

/** Não existe serviço de fusão em lugar nenhum do mundo: publicar acontece
 *  NESTE aparelho, pelo dev_server que roda aqui. Existiu um servidor aberto
 *  por um tempo e ele foi tirado de propósito — endereço aberto é estranho
 *  mandando desenho pra dentro do seu jogo, e alguém teria que ficar olhando o
 *  que chega. As telas usam isto pra saber que o caminho é o de casa. */
export const servidorMundo = () => "";

/** PUBLICAR: manda a ficha pro dev_server, que escreve ela em
 *  src/data/fusoes-feitas.js. Dali em diante ela é uma variante daquela dupla
 *  em qualquer partida deste computador — inclusive num jogo novo. O hot-swap
 *  faz ela aparecer sem recarregar nada. */

export async function publicarFicha(cabecaId, corpoId, ficha, autor = "") {
  const corpo = {
    chave: chaveFicha(cabecaId, corpoId),
    ficha: {
      id: String(ficha.nome || "ficha").toLowerCase().replace(/[^a-z0-9]+/g, "") || "ficha",
      nome: ficha.nome,
      autor: String(autor || "").slice(0, 10),
      tipos: ficha.tipos,
      inicial: ficha.inicial,
      crescimento: ficha.crescimento,
      sprite: ficha.sprite,
      lore: ficha.lore,
    },
  };
  try {
    const r = await fetch(arquivo("__ficha"), { method: "POST", body: JSON.stringify(corpo) });
    if (!r.ok) return { ok: false, aparelhos: 0 };
    // o servidor diz quantos aparelhos estavam ligados na hora: são eles que
    // recebem a variante nova sem recarregar nada (live update)
    const resposta = await r.json().catch(() => ({}));
    // `codigo` = o servidor já está levando ela pro repositório sozinho
    return { ok: true, aparelhos: resposta.aparelhos || 0, codigo: !!resposta.codigo };
  } catch { return { ok: false, aparelhos: 0 }; }
}

// ------------------------------------------------------------------ o mundo
// Publicar deixa a ficha no servidor desta casa, e todo aparelho ligado nele
// recebe. Pra ir MAIS longe que isso existe um caminho só: o arquivo das fichas
// é código, e o código deste jogo tem endereço — o repositório de onde todo
// mundo baixou ele. Mandar pro mundo é mandar o arquivo pra lá; buscar do mundo
// é trazer o que os outros mandaram e juntar com o que você tem.

/** Manda a sua ficha pro repositório do jogo (commit só desse arquivo + push).
 *  Quem baixar ou atualizar o jogo recebe a sua fusão junto com ele. */
export async function mandarProMundo(nome, autor = "") {
  return chamarMundo({ acao: "enviar", nome, autor });
}

/** Traz o que os outros publicaram. Junta com o que já existe aqui: ficha sua
 *  não é sobrescrita, e nenhum outro arquivo do jogo é tocado. */
export async function buscarDoMundo() {
  return chamarMundo({ acao: "buscar" });
}

async function chamarMundo(corpo) {
  try {
    const r = await fetch(arquivo("__mundo"), { method: "POST", body: JSON.stringify(corpo) });
    const dado = await r.json().catch(() => ({}));
    if (!r.ok) return { ok: false, erro: dado.erro || "o servidor recusou" };
    return dado;
  } catch { return { ok: false, erro: "o servidor não respondeu" }; }
}


/** A FUSÃO EVOLUI (pedido do CAIO, nov/2026): como no Infinite Fusion, CADA
 *  METADE evolui no nível (ou na amizade) dela — um CHARMANDER+PIDGEY vira
 *  CHARMELEON+PIDGEY no 16 e CHARMELEON+PIDGEOTTO no 18. Devolve o id da fusão
 *  nova (já montada), ou null. A variante da ficha não vai junto (é outra dupla). */
export function evolucaoDaFusao(mon, mapa = null) {
  const p = partes(mon?.species);
  if (!p) return null;
  const evo = (id) => (id ? evolutionFor({ ...mon, species: id }, mapa) : null);
  const c = evo(p.cabeca), b = evo(p.corpo), pe = evo(p.pernas);
  if (!c && !b && !pe) return null;
  const id = idFusao(c || p.cabeca, b || p.corpo, "", pe || p.pernas);
  return garantirEspecie(id) ? id : null;
}
