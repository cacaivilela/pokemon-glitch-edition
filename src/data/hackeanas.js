// AS FORMAS HACKEANAS: o mesmo bicho, lido por um cartucho adulterado.
//
// ALOLA é o mesmo dado criado em outro LUGAR (src/data/regionais.js). HACK é o
// mesmo dado lido em outro ESTADO: ninguém levou este RHYDON pra região nenhuma
// — alguém mexeu no arquivo onde ele estava guardado, e o bicho voltou assim.
// Num jogo chamado GLITCH EDITION, essa é a região que faltava, e ela não fica
// no mapa: fica no cartucho.
//
// A REGRA DOS ATRIBUTOS, e ela é a peça inteira: a forma hackeana tem OS MESMOS
// SEIS NÚMEROS da base, EM OUTRA ORDEM. Nada é inventado, nada é inflado — o
// total de status é idêntico ao do original, até o último ponto. É o que
// acontece de verdade quando um programa lê uma estrutura com o deslocamento
// errado: os bytes são os mesmos, o significado é que escorregou uma casa. Daí
// sai um KADABRA com 120 de HP e 30 de velocidade, e um PIKACHU que aguenta
// pancada e não corre. A piada e o balanceamento são a MESMA regra, o que
// significa que não existe forma hackeana forte demais por acidente.
//
// (O DITTO e o MEW saem iguais à base, e isso não é bug: os seis números deles
// já são o mesmo número. Num bicho perfeitamente simétrico o erro não tem por
// onde entrar — e o DITTO, ainda por cima, é o bicho cujo trabalho é copiar.)
//
// O TIPO. Toda forma hackeana é METADE GLITCH: ela fica com um tipo do original
// e o outro vira GLITCH. É o que se vê na tela antes de qualquer número, e é o
// que as liga ao resto do jogo — inclusive ao GLITCHINIUM da última provação,
// que precisa de alguém de GLITCH na equipe (src/data/provacoes.js).
//
// COM UMA EXCEÇÃO, e ela está marcada lá embaixo: o MEWTWO-HACK é ELÉTRICO, um
// tipo que o MEWTWO nunca teve. Nas outras o deslocamento pegou só os números;
// nele pegou o tipo também. Uma exceção anunciada vale mais que uma regra que
// nunca se quebra: é ela que diz que o erro não tem obrigação de ser educado.
//
// O SPRITE é o da base, corrompido em código na hora de carregar
// (`corromperSprite`, em src/core/sprites.js): nenhuma arte nova, e o desenho
// que aparece é literalmente o desenho original lido errado — que é a mesma
// coisa que os atributos estão fazendo. Nenhum arquivo novo em assets/.
//
// ELAS EVOLUEM, E A LINHA INTEIRA É HACKEANA. Um KADABRA-HACK vira
// ALAKAZAM-HACK, nunca um ALAKAZAM de Kanto — a mesma regra das formas
// regionais (MEOWTH-ALOLA vira PERSIAN-ALOLA). O GATILHO É O MESMO GATILHO da
// base: se o KADABRA comum evolui no nível 37, o hackeano também. O que muda é
// quem sai do outro lado, e isso é o bastante: evoluir não conserta o arquivo,
// só escreve por cima com o mesmo deslocamento errado.
//
// E o erro é O MESMO ERRO ao longo da linha: os três NIDORAN escorregam uma
// casa, os dois PORYGON escorregam duas, o KADABRA e o ALAKAZAM escorregam
// três. Uma linhagem com um deslocamento diferente por estágio seriam três
// acidentes; assim é um acidente só, que ficou.
//
// ONDE ELAS APARECEM: na 011GLITCHDIMENSION110, por terreno, como todo o resto
// que não é de Kanto — e sempre CORROMPIDAS (`corrupt`), porque é literalmente
// o que elas são.
import { GEN1, slugify } from "./gen1.js";
import { EXTRA } from "./extra.js";
import { MAIS } from "./mais.js";
import { MEGA_FORMS } from "./mega.js";

/** De onde saem os números da base. As linhas não cabem todas em Kanto: o
 *  PORYGON2 e o PORYGON-Z moram em extra.js e o RHYPERIOR em mais.js. */
const FONTE = { ...GEN1, ...EXTRA, ...MAIS };

/** A ordem dos seis números. Girar esta lista é o erro de leitura. */
const CHAVES = ["hp", "atk", "def", "spa", "spd", "spe"];

//   base | gira | o tipo que sobrou | a frase
//
// `gira` é de quantas casas o erro escorregou. Cada uma tem a sua porque cada
// uma dá uma piada diferente: o RHYDON vira frágil e especial, o KADABRA vira
// gordo e lento, o MEWTWO vira um lutador de porrada.
const LISTA = [
  // ---------------------------------------------------- linha do RHYDON (3)
  ["rhydon", 3, "PEDRA",
   "O PRIMEIRO BICHO QUE ALGUÉM PROGRAMOU. ESTÁ NA BASE DE TODOS OS OUTROS — E ALGUÉM MEXEU NA BASE."],
  ["rhyperior", 3, "PEDRA",
   "A ARMADURA FOI PARAFUSADA POR CIMA DO ERRO. AGORA O ERRO TEM BLINDAGEM."],
  ["ditto", 1, "NORMAL",
   "ELE COPIA O QUE VÊ. DESTA VEZ O QUE ELE VIU NÃO ERA UM POKÉMON, ERA MEMÓRIA."],
  ["mew", 1, "PSÍQUICO",
   "ESTAVA EMBAIXO DO CAMINHÃO ESSE TEMPO TODO. NÃO DO JEITO QUE CONTAVAM: DESTE."],
  // --------------------------------------------------- linha do PORYGON (2)
  ["porygon", 2, "NORMAL",
   "O ÚNICO POKÉMON FEITO DE CÓDIGO. É O ÚNICO QUE SABE O QUE FIZERAM COM ELE."],
  ["porygon2", 2, "NORMAL",
   "A ATUALIZAÇÃO CONSERTOU TUDO MENOS O QUE ESTAVA ERRADO. ELE SÓ FICOU MAIS RÁPIDO PRA ERRAR."],
  ["porygonz", 2, "NORMAL",
   "O PROGRAMA QUE INSTALARAM NELE NUNCA FOI TESTADO POR NINGUÉM. E ELE SABE."],
  ["farfetchd", 4, "VOADOR",
   "TEM UM APÓSTROFO NO NOME. NENHUM PROGRAMA DESTE MUNDO LEU ESSE NOME INTEIRO."],
  ["mrmime", 3, "PSÍQUICO",
   "UM PONTO E UM ESPAÇO NO NOME. FOI POR ONDE O ERRO ENTROU, E ELE ENTROU INTEIRO."],
  // -------------------------------------------------- linha do NIDORAN-F (1)
  ["nidoranf", 1, "VENENO",
   "O SÍMBOLO NO FIM DO NOME NÃO É LETRA. PRA QUEM LÊ O ARQUIVO, ELE É OUTRA COISA."],
  ["nidorina", 1, "VENENO",
   "CRESCEU, E O SÍMBOLO CRESCEU JUNTO. O PROGRAMA CONTINUA SEM SABER LER."],
  ["nidoqueen", 1, "VENENO",
   "A COROA É DE VERDADE. O NOME É QUE NUNCA COUBE NO CAMPO ONDE ELE FOI ESCRITO."],
  ["gengar", 5, "FANTASMA",
   "DIZIAM QUE ELE ERA A EVOLUÇÃO DO MEW. NÃO ERA. MAS ALGUÉM TENTOU ESCREVER ISSO."],
  // --------------------------------------------------- linha do PIKACHU (5)
  ["pikachu", 5, "ELÉTRICO",
   "O PRIMEIRO NOME QUE TODO MUNDO PROCURA PRA EDITAR. ESTE AQUI FOI EDITADO DEMAIS."],
  ["raichu", 5, "ELÉTRICO",
   "A PEDRA SUBIU O NÍVEL DELE E SUBIU O ERRO JUNTO. O ERRO SUBIU MAIS."],
  // A EXCEÇÃO DA CASA. Nas outras dezenove o tipo que sobrou é um tipo do
  // original; neste não. O MEWTWO-HACK é ELÉTRICO, e ele nunca foi elétrico em
  // lugar nenhum — o byte do TIPO também foi lido errado. É o bicho certo pra
  // isso acontecer: é o que mais aparece em save adulterado, o que mais chega
  // "pronto" na mão de quem não lutou, e a única coisa que ainda batia nele era
  // o tipo. Agora não bate mais nada.
  ["mewtwo", 2, "ELÉTRICO",
   "VEIO PRONTO DE FORA, NÍVEL CEM E DE UM TIPO QUE ELE NUNCA TEVE. NINGUÉM CONFERIU."],
  // --------------------------------------------------- linha do KADABRA (3)
  ["kadabra", 3, "PSÍQUICO",
   "EVOLUI POR TROCA. A TROCA NUNCA CHEGOU, E ALGUÉM RESOLVEU ISSO NA MARRA."],
  ["alakazam", 3, "PSÍQUICO",
   "AS CINCO COLHERES ESTÃO TODAS AQUI. O NÚMERO DA INTELIGÊNCIA DELE É QUE NÃO CABE."],
  // --------------------------------------------------- linha do VOLTORB (4)
  ["voltorb", 4, "ELÉTRICO",
   "UM ITEM QUE FINGE SER BICHO. NUM CARTUCHO FURADO, OS DOIS MORAM NA MESMA GAVETA."],
  ["electrode", 4, "ELÉTRICO",
   "ELE EXPLODE QUANDO ALGUÉM OLHA. ESTE AQUI NEM PRECISA MAIS DE ALGUÉM OLHANDO."],
];

/** COMO ELAS EVOLUEM. O gatilho é copiado da base de propósito — e o
 *  `dev/hackeanascheck.html` confere, um por um, se ele continua sendo o mesmo
 *  que a base tem hoje. Se alguém mudar o KADABRA de nível, o teste acusa aqui
 *  em vez de a linha hackeana ficar com a regra velha calada. */
export const EVO_HACKEANAS = {
  rhydonhack: [{ lvl: 36, onde: "fora", to: "rhyperiorhack" }],
  porygonhack: [{ item: "up-grade", to: "porygon2hack" }],
  porygon2hack: [{ item: "dubious disc", to: "porygonzhack" }],
  nidoranfhack: [{ lvl: 16, to: "nidorinahack" }],
  nidorinahack: [{ item: "pedra da lua", to: "nidoqueenhack" }],
  pikachuhack: [{ item: "pedra do trovão", to: "raichuhack" }],
  kadabrahack: [{ lvl: 37, to: "alakazamhack" }],
  voltorbhack: [{ lvl: 30, to: "electrodehack" }],
  // A ÚNICA LINHA SEM GATILHO NA BASE: o MEWTWO não evolui em lugar nenhum, então
  // não tem regra pra copiar e ela não entra no GATILHO_DA_BASE. Ver o MEWTHREE
  // lá embaixo.
  mewtwohack: [{ lvl: 70, to: "mewthree" }],
};

/** forma hackeana -> a base de onde ela saiu, pro teste conferir o gatilho. */
export const GATILHO_DA_BASE = {
  rhydonhack: "rhydon", porygonhack: "porygon", porygon2hack: "porygon2",
  nidoranfhack: "nidoranf", nidorinahack: "nidorina", pikachuhack: "pikachu",
  kadabrahack: "kadabra", voltorbhack: "voltorb",
};

/** O nome da região, pro rótulo da Pokédex. */
export const REGIAO_HACK = "HACK";

/** As espécies, no formato do DB.SPECIES. */
export const HACKEANAS = {};

/** id da forma -> id da base. Quem desenha usa isto pra saber QUAL sprite
 *  corromper (src/core/sprites.js). */
export const BASE_DE = {};

for (const [baseId, gira, tipo, frase] of LISTA) {
  const base = FONTE[baseId];
  if (!base) continue;                       // dado velho: a forma só não existe
  const nome = `${base.name}-HACK`;
  const id = slugify(nome);
  // os mesmos seis números, começando de outro lugar
  const valores = CHAVES.map((k) => base.base[k]);
  const stats = {};
  CHAVES.forEach((k, i) => { stats[k] = valores[(i + gira) % CHAVES.length]; });
  const bst = Object.values(stats).reduce((a, b) => a + b, 0);
  HACKEANAS[id] = {
    id, dex: base.dex, name: nome, types: [tipo, "GLITCH"], base: stats, bst,
    foreign: true, hack: true, regiao: REGIAO_HACK,
    // o sprite é o da base — quem corrompe é o carregador
    spriteDex: base.dex,
    dexText: frase,
    // o mesmo cálculo das formas regionais, pra não inventar uma segunda regra
    catchRate: bst >= 600 ? 3 : bst >= 500 ? 45 : 120,
    xpYield: Math.floor(bst / 4),
  };
  BASE_DE[id] = baseId;
}

// O MEWTHREE. O boato mais velho de todos, junto com o MEW embaixo do caminhão:
// "depois do MEWTWO vem o MEWTHREE". Nunca existiu — até alguém abrir o arquivo
// e escrever ele na marra.
//
// Ele segue A REGRA, só que de um jeito que ninguém pediu: não há MEWTHREE de
// base pra girar, então o cartucho girou A COISA MAIS PARECIDA QUE TINHA, a
// MEGA MEWTWO X. Os seis números são os dela, com o MESMO giro do MEWTWO-HACK
// (o erro é o mesmo ao longo da linha), e o tipo ELÉTRICO que o byte errado deu
// ao MEWTWO-HACK veio junto. É a mega que ficou presa: a de verdade volta ao
// normal no fim da luta; esta não volta nunca, porque não tem pra onde voltar.
//
// Fica FORA da fenda: ninguém encontra um MEWTHREE no mato. Ele só existe pra
// quem levou um MEWTWO-HACK até o nível 70.
{
  const mega = MEGA_FORMS.megamewtwox;
  const gira = LISTA.find(([id]) => id === "mewtwo")?.[1] ?? 2;
  if (mega && HACKEANAS.mewtwohack) {
    const valores = CHAVES.map((k) => mega.base[k]);
    const stats = {};
    CHAVES.forEach((k, i) => { stats[k] = valores[(i + gira) % CHAVES.length]; });
    const bst = Object.values(stats).reduce((a, b) => a + b, 0);
    HACKEANAS.mewthree = {
      id: "mewthree", dex: mega.dex, name: "MEWTHREE",
      types: [...HACKEANAS.mewtwohack.types], base: stats, bst,
      foreign: true, hack: true, regiao: REGIAO_HACK,
      // o desenho é o da MEGA MEWTWO X, estragado pelo carregador como os outros
      spriteDex: mega.spriteDex,
      dexText: "TODO MUNDO JURAVA QUE DEPOIS DO DOIS VINHA O TRÊS. NÃO VINHA. ALGUÉM ESCREVEU O TRÊS NO ARQUIVO MESMO ASSIM.",
      catchRate: 3,
      xpYield: Math.floor(bst / 4),
      soEvolucao: true,
    };
    BASE_DE.mewthree = "megamewtwox";
  }
}

/** De que região é cada uma (entra no REGIAO de src/data/regionais.js). */
export const REGIAO_HACKEANAS = Object.fromEntries(
  Object.keys(HACKEANAS).map((id) => [id, REGIAO_HACK]));

// -------------------------------------------- ONDE ELAS APARECEM NA FENDA
//
// Mesma divisão por terreno das formas regionais, e pelo mesmo motivo: derivar
// do tipo em vez de escrever à mão espécie por espécie. O que muda é o peso —
// elas são RARAS, porque uma leitura errada é um acidente, não um bioma — e o
// `corrupt: true`, que faz cada uma nascer corrompida sempre.
const noAr = new Set(["VOADOR", "PSÍQUICO", "FANTASMA", "DRAGÃO"]);
const terrenoDe = (sp) =>
  sp.types.includes("ÁGUA") ? "agua" : sp.types.some((t) => noAr.has(t)) ? "ar" : "terra";

/** { terra: [...], agua: [...], ar: [...] } — colado nas tabelas da fenda por
 *  src/data/index.js. */
export const DIM_HACKEANAS = { terra: [], agua: [], ar: [] };
for (const sp of Object.values(HACKEANAS)) {
  if (sp.soEvolucao) continue;               // o MEWTHREE não nasce no mato
  const faixa = sp.bst >= 600 ? { min: 40, max: 55, w: 0.6 }
              : sp.bst >= 480 ? { min: 32, max: 46, w: 1.2 }
              : { min: 22, max: 38, w: 2 };
  DIM_HACKEANAS[terrenoDe(sp)].push({ id: sp.id, ...faixa, corrupt: true });
}
