// DLC: GLITCH DIMENSION EXTREMA.
//
// UM ANO DEPOIS. Faz um ano que o MISSINGNO foi pego em Kanto (a fenda
// fechou), ou que Braglitch ganhou um campeão — o pacote começa quando UMA
// das duas histórias acabou (`caughtMissingno` ou `bragCampeao`; não precisa
// das duas). Aí a tela diz "UM ANO DEPOIS...", e uma carteira traz o convite
// da festa dos professores.
//
// A HISTÓRIA tem dois caminhos, porque quem começou em Kanto e quem começou
// em Braglitch conhecem gente diferente:
//
//   KANTO     a carteira na CIDADE DE PALLET → levar o convite pro AZUL, que passou
//             o ano treinando na frente de casa → a festa no lab do CARVALHO
//   BRAGLITCH a carteira em SÃO LUCARIO → levar o convite pro VÍTOR e o ANDRÉ,
//             que estão no píer com a lancha que o VÍTOR prometeu → a festa no
//             lab da IPÊ
//
// Na festa a máquina (ou o computador da IPÊ) apita e sai de lá VOCÊ DE UM ANO
// ATRÁS, com o inicial no nível 5, querendo lutar. Ele veio porque o tempo
// entortou: o MISSINGNO ABSORVEU O GIRATINA, e a GLITCH DIMENSION e o MUNDO
// DISTORCIDO viraram uma coisa só. Quem conta é o GLITNEXY, que sai da máquina
// logo depois.
//
// O PÓS-GAME é a fenda fundida, a GLITCH DIMENSION EXTREMA — que, misturada
// com o Mundo Distorcido, virou uma KANTO DISTORCIDA: um pedaço de Kanto de
// cabeça pra baixo, com as cores trocadas e os barrancos subindo. Ela MUDA:
// são sete CAPÍTULOS (PALLET, ROTA 1, VIRIDIAN, ROTA 2, PEWTER, MT MOON e o
// fundo do MT MOON), um chefe em cada; vencido o chefe, a fenda muda de
// lugar, e o PROFESSOR te puxa pra fora antes — quem ficasse lá dentro ia
// mudar junto com ela:
//   - a máquina e os fragmentos não levam mais lá (`DB.FENDA_TRANCADA`); quem
//     leva é o GLITNEXY, e ele só leva quem dá um ESPETINHO DE BERRIES (donut
//     não: ele mora num buraco, não come outro);
//   - quem faz o espetinho é ele: três berries, de até três tipos (uma por
//     vez, ele pergunta), e um TEMPERO se quiser (um ingrediente de
//     sanduíche), que ele assa e come. O espetinho decide QUANTO TEMPO você
//     fica lá (o relógio FENDA da tela); misturado, ele tem NOME — e algumas
//     misturas são receitas, com bônus (o RAYQUAZA é a melhor: 50 minutos). As berries se compram em toda loja, e o professor dá dez ORAN e
//     dez CHESTO quando você aceita o pedido;
//   - lá dentro todo selvagem tem +100 níveis (101, 150...), e capturado ele
//     devolve os 100 (o 101 vira 1 — src/scenes/battle.js `guardarCapturado`);
//   - o espetinho empresta níveis pra sua equipe enquanto você está lá
//     (`nivelEmprestado`), e eles voltam quando você sai; também dá atributos
//     a mais e um PODERZINHO (QUASE INÚTIL, POUCO ÚTIL ou ÚTIL), que valem como
//     as PEDRAS de Braglitch (src/systems/pedras.js) só durante a viagem;
//   - SEIS CHEFES (Pokémon raros, não lendários, nível 155-160), um por
//     capítulo, no ponto mais longe da chegada; com os seis vencidos, o
//     sétimo capítulo é o GIRATINA, nível 170, ainda com o MISSINGNO dentro.
//
// Os NPCs entram pelo `aplicar` (e não pela seção `npcs`) porque alguns têm
// time e desenho que dependem do save — o VOCÊ DE UM ANO ATRÁS tem a sua cara
// e o seu inicial —, e a seção `npcs` copia o objeto e congelaria isso.
import { DB } from "../src/data/index.js";
import { garantirEspecie } from "../src/systems/fusao.js";
import { montarTime } from "../src/systems/rival.js";
import { estado as estadoMissao } from "../src/systems/missoes.js";
import { createMon, recalc, xpForLevel } from "../src/systems/mon.js";
import { todosGuardados, guardar, cheio } from "../src/systems/box.js";
import { BattleScene } from "../src/scenes/battle.js";
import { Audio2 } from "../src/core/audio.js";
import { Glitch } from "../src/systems/glitchfx.js";
import { INGREDIENTES } from "../src/data/acampamento.js";
import { SpriteStore, loadImage, arquivoMapa } from "../src/core/sprites.js";
import { makeCanvas, TILE } from "../src/core/assets.js";
import { url } from "../src/core/base.js";

const CATECHU = "fus-caterpie-pikachu";
const eu = () => globalThis.game?.state;
const R = (st) => (st?.regiao === "braglitch" ? "b" : "k");

// ------------------------------------------------------------ os espetinhos
/** As berries do espetinho. Quem faz é o GLITNEXY: POR_ESPETINHO berries, de
 *  até três tipos. O espetinho empresta pra sua equipe, enquanto você está na
 *  fenda extrema, a MÉDIA dos `niveis` e dos `atributos` (x em tudo) das
 *  berries que foram nele — e cada TIPO diferente dá o PODERZINHO dele, com a
 *  classe que ele tem (que é honesta). */
const POR_ESPETINHO = 3;
const BERRIES = [
  { berry: "cheri berry", preco: 250, niveis: 55, atributos: 1.04,
    classe: "QUASE INÚTIL", poder: { atributo: { spe: 1.02 } }, efeito: "+2% DE VELOCIDADE",
    texto: "VERMELHA E PICANTE. DESTRAVA QUEM ESTÁ PARALISADO E TRAVA A LÍNGUA DE QUEM COME." },
  { berry: "rawst berry", preco: 250, niveis: 56, atributos: 1.04,
    classe: "QUASE INÚTIL", poder: { atributo: { def: 1.02 } }, efeito: "+2% DE DEFESA",
    texto: "VERDE E AMARGA. ESFRIA QUEIMADURA. NÃO ESFRIA O HUMOR." },
  { berry: "aspear berry", preco: 250, niveis: 57, atributos: 1.04,
    classe: "QUASE INÚTIL", poder: { captura: 1.01 }, efeito: "+1% NA CAPTURA",
    texto: "AMARELA E DURA. DESCONGELA QUEM ESTÁ CONGELADO, SE DER PRA MORDER." },
  { berry: "persim berry", preco: 300, niveis: 58, atributos: 1.05,
    classe: "QUASE INÚTIL", poder: { xp: 1.02 }, efeito: "+2% DE EXPERIÊNCIA",
    texto: "ROSA E SEM GRAÇA. DIZEM QUE TIRA A CONFUSÃO. TAMBÉM DÁ UMA." },
  { berry: "oran berry", preco: 300, niveis: 60, atributos: 1.05,
    classe: "QUASE INÚTIL", poder: { captura: 1.02 }, efeito: "+2% NA CAPTURA",
    texto: "AZUL E REDONDA. GOSTO DE NADA EM ESPECIAL, QUE É O GOSTO DE QUASE TUDO." },
  { berry: "nanab berry", preco: 300, niveis: 60, atributos: 1.05,
    classe: "QUASE INÚTIL", poder: { atributo: { spd: 1.03 } }, efeito: "+3% DE DEFESA ESPECIAL",
    texto: "PARECE UMA BANANA PEQUENA. É UMA BANANA PEQUENA." },
  { berry: "pinap berry", preco: 350, niveis: 62, atributos: 1.06,
    classe: "QUASE INÚTIL", poder: { captura: 1.03 }, efeito: "+3% NA CAPTURA",
    texto: "UM ABACAXI DE BOLSO. COM COROA E TUDO." },
  { berry: "chesto berry", preco: 400, niveis: 65, atributos: 1.07,
    classe: "QUASE INÚTIL", poder: { xp: 1.03 }, efeito: "+3% DE EXPERIÊNCIA",
    texto: "ROXA E DURA. ACORDA QUALQUER POKÉMON QUE ESTIVER DORMINDO, E QUALQUER PESSOA QUE MORDER." },
  { berry: "leppa berry", preco: 500, niveis: 66, atributos: 1.08,
    classe: "POUCO ÚTIL", poder: { atributo: { spa: 1.08 } }, efeito: "+8% DE ATAQUE ESPECIAL",
    texto: "VERMELHA E SUCULENTA. DIZEM QUE DEVOLVE O FÔLEGO DOS GOLPES." },
  { berry: "figy berry", preco: 550, niveis: 68, atributos: 1.08,
    classe: "POUCO ÚTIL", poder: { atributo: { atk: 1.08 } }, efeito: "+8% DE ATAQUE",
    texto: "AZEDA DE TORCER A CARA. QUEM GOSTA, GOSTA MUITO." },
  { berry: "pecha berry", preco: 600, niveis: 70, atributos: 1.10,
    classe: "POUCO ÚTIL", poder: { dano: 0.9 }, efeito: "-10% NO DANO RECEBIDO",
    texto: "ROSA E MOLE. DOCE COMO PÊSSEGO, SÓ QUE NÃO É PÊSSEGO." },
  { berry: "lum berry", preco: 900, niveis: 75, atributos: 1.12,
    classe: "POUCO ÚTIL", poder: { dano: 0.92 }, efeito: "-8% NO DANO RECEBIDO",
    texto: "VERDE-CLARA E RARA. CURA QUASE TUDO, MENOS SAUDADE." },
  { berry: "sitrus berry", preco: 1200, niveis: 85, atributos: 1.15,
    classe: "POUCO ÚTIL", poder: { xp: 1.25 }, efeito: "+25% DE EXPERIÊNCIA",
    texto: "AMARELA, AZEDINHA E PESADA. TEM MAIS SUCO DO QUE CABE NELA." },
  { berry: "ganlon berry", preco: 1500, niveis: 88, atributos: 1.15,
    classe: "POUCO ÚTIL", poder: { atributo: { def: 1.12 } }, efeito: "+12% DE DEFESA",
    texto: "UMA CASCA DURA COM DOCE POR DENTRO." },
  { berry: "apicot berry", preco: 1500, niveis: 88, atributos: 1.15,
    classe: "POUCO ÚTIL", poder: { atributo: { spd: 1.12 } }, efeito: "+12% DE DEFESA ESPECIAL",
    texto: "AZUL-ESCURA. PARECE UMA AMEIXA QUE VIU COISA DEMAIS." },
  { berry: "salac berry", preco: 2200, niveis: 95, atributos: 1.18,
    classe: "ÚTIL", poder: { atributo: { spe: 1.2 } }, efeito: "+20% DE VELOCIDADE",
    texto: "VERDE E ESPINHOSA. QUEM COME CORRE. NINGUÉM SABE DO QUÊ." },
  { berry: "petaya berry", preco: 2200, niveis: 95, atributos: 1.18,
    classe: "ÚTIL", poder: { atributo: { spa: 1.2 } }, efeito: "+20% DE ATAQUE ESPECIAL",
    texto: "ROSA-CHOQUE E CHEIA DE GOMO. BRILHA NO ESCURO DA FENDA." },
  { berry: "liechi berry", preco: 2500, niveis: 100, atributos: 1.20,
    classe: "ÚTIL", poder: { captura: 1.5 }, efeito: "+50% NA CAPTURA",
    texto: "VERMELHA E RARA. DIZEM QUE CAI DE UMA ÁRVORE QUE SÓ DÁ FRUTO QUANDO O MAR FICA PARADO." },
  { berry: "lansat berry", preco: 3000, niveis: 100, atributos: 1.20,
    classe: "ÚTIL", poder: { xp: 1.4 }, efeito: "+40% DE EXPERIÊNCIA",
    texto: "LARANJA E LENDÁRIA. DIZEM QUE SÓ CRESCE ONDE ALGUÉM FEZ ALGO DIFÍCIL." },
  { berry: "starf berry", preco: 4000, niveis: 105, atributos: 1.22,
    classe: "ÚTIL", poder: { dano: 0.8 }, efeito: "-20% NO DANO RECEBIDO",
    texto: "TEM FORMATO DE ESTRELA. NINGUÉM NUNCA VIU A ÁRVORE DELA." },
];
const daBerry = (id) => BERRIES.find((b) => b.berry === id);
/** Quanto tempo de fenda cada berry vale, pela classe (o espetinho é a média;
 *  o tempero soma TEMPERO_MIN). */
const MIN_DA_CLASSE = { "QUASE INÚTIL": 5, "POUCO ÚTIL": 10, "ÚTIL": 15 };
const TEMPERO_MIN = 3;

/** AS RECEITAS: misturas exatas (as três berries, em qualquer ordem, e o
 *  tempero) que têm nome e valem mais que a média. A melhor é a RAYQUAZA. */
const RECEITAS = [
  { nome: "RAYQUAZA", berries: ["petaya", "salac", "starf"], tempero: "hortelã", minutos: 50, niveis: 130, atributos: 1.35 },
  { nome: "GROUDON", berries: ["figy", "liechi", "ganlon"], tempero: "pimenta", minutos: 35, niveis: 115, atributos: 1.28 },
  { nome: "KYOGRE", berries: ["oran", "sitrus", "apicot"], tempero: "limão", minutos: 35, niveis: 115, atributos: 1.28 },
  { nome: "MEW", berries: ["lum", "lansat", "persim"], tempero: "morango", minutos: 30, niveis: 105, atributos: 1.25 },
  { nome: "DARKRAI", berries: ["chesto", "chesto", "chesto"], tempero: "café", minutos: 25, niveis: 90, atributos: 1.15 },
  { nome: "SNORLAX", berries: ["oran", "oran", "oran"], tempero: "mel", minutos: 20, niveis: 80, atributos: 1.12 },
  { nome: "PIKACHU", berries: ["cheri", "pinap", "nanab"], tempero: "banana", minutos: 20, niveis: 80, atributos: 1.12 },
];
/** A mistura que não é receita ganha nome de Pokémon também — sempre o mesmo
 *  pra mesma mistura (sai da conta das letras), pra dar pra lembrar e repetir. */
const NOMES_DE_MISTURA = ["PIDGEY", "RATTATA", "ODDISH", "PSYDUCK", "EEVEE", "JIGGLYPUFF", "MACHOP",
  "GEODUDE", "SLOWPOKE", "DITTO", "TOGEPI", "MARILL", "WOOPER", "TEDDIURSA", "SWABLU",
  "SKITTY", "BIDOOF", "PACHIRISU", "BUNEARY", "MUNCHLAX"];
const curto = (b) => b.berry.replace(" berry", "").toUpperCase();
const pct = (x) => Math.round((x - 1) * 100);
const media = (lista, f) => lista.reduce((n, b) => n + f(b), 0) / lista.length;

/** O espetinho que sai daquelas berries (objetos de BERRIES, com repetição) e
 *  do tempero (id de ingrediente, ou null). */
function espetinho(lista, tempero = null) {
  const tipos = [...new Set(lista)];
  const chave = lista.map((b) => b.berry.replace(" berry", "")).sort();
  const receita = RECEITAS.find((r) => r.tempero === tempero && [...r.berries].sort().join() === chave.join());
  const base = {
    berries: lista.map((b) => b.berry), tipos, tempero, receita: receita?.nome || null,
    niveis: Math.round(media(lista, (b) => b.niveis)),
    atributos: Math.round(media(lista, (b) => b.atributos) * 1000) / 1000,
    minutos: Math.round(media(lista, (b) => MIN_DA_CLASSE[b.classe] || 5)) + (tempero ? TEMPERO_MIN : 0),
  };
  if (receita) return { ...base, niveis: receita.niveis, atributos: receita.atributos, minutos: receita.minutos, nome: `ESPETINHO ${receita.nome}` };
  const com = tempero ? ` COM ${tempero.toUpperCase()}` : "";
  if (tipos.length === 1) return { ...base, nome: `ESPETINHO DE ${curto(tipos[0])}${com}` };
  const conta = [...chave.join(), ...(tempero || "")].reduce((n, c) => (n * 31 + c.charCodeAt(0)) % 9973, 7);
  return { ...base, nome: `ESPETINHO ${NOMES_DE_MISTURA[conta % NOMES_DE_MISTURA.length]}` };
}

/** Os PODERES valem como "pedras" (src/systems/pedras.js): um item na mochila
 *  que vale em toda batalha — e que só existe durante a viagem. Um por tipo de
 *  berry do espetinho, mais a FORÇA (os atributos, que mudam a cada espetinho). */
const itemDoPoder = (b) => `poder da ${b.berry}`;
const PODERES = BERRIES.map((b) => ({
  item: itemDoPoder(b), ...b.poder,
  texto: `PODER ${b.classe} DA ${b.berry.toUpperCase()}: ${b.efeito}. SÓ VALE NA GLITCH DIMENSION EXTREMA.`,
}));
const FORCA = {
  item: "força do espetinho",
  atributo: { atk: 1, def: 1, spa: 1, spd: 1, spe: 1 },
  get texto() { return `FORÇA DO ESPETINHO: +${pct(this.atributo.atk)}% EM TODOS OS ATRIBUTOS. SÓ VALE NA GLITCH DIMENSION EXTREMA.`; },
};
/** O que o professor dá quando você aceita o pedido da fenda. */
const PRESENTE = [["oran berry", 10], ["chesto berry", 10]];

// ------------------------------------------------------------ os lugares
const LAB = { k: "lab", b: "bra_lab" };
const CARTEIRA = { k: { mapa: "pallet", x: 8, y: 8 }, b: { mapa: "sao_lucario", x: 6, y: 12 } };

// O AZUL de um ano depois, em PALLET, com o time da ROTA 23 crescido.
// `INICIAL` e `FUSAO:` são montados pelo mesmo `montarTime` do rival.
const AZUL_TIME = [
  { id: "pidgeot", lvl: 72 },
  { id: "alakazam", lvl: 72 },
  { id: "FUSAO:gyarados+arcanine", lvl: 74 },
  { id: "rhyperior", lvl: 72 },
  { id: "INICIAL", lvl: 76 },
];
const VITOR_TIME = [["applin", 72], ["klinklang", 73], ["magnezone", 73], ["rotom", 72], [CATECHU, 75]];

/** A sua cara: o desenho do jogador (VERMELHO/FOLHA ou CAIO/LARA). */
function spriteDoJogador(st) {
  const menina = st?.player?.genero === "menina";
  if (st?.regiao === "braglitch") return menina ? "heroina_brag" : "hero_brag";
  return menina ? "heroina" : "hero";
}

/** O seu inicial, na forma de um ano atrás. */
function inicialDoJogador(st) {
  if (st?.flags?.meuInicial) return st.flags.meuInicial;
  for (const base of Object.keys(DB.RIVAL?.linhas || {})) if (st?.caught?.[base]) return base;
  return st?.regiao === "braglitch" ? "tronky" : "pikachu";
}

// ------------------------------------------------------------ as falas
const T = {
  k: {
    convite: {
      oferta: [
        "CARTA PRA VOCÊ! QUER DIZER... CONVITE. TEM CORAÇÃOZINHO NO ENVELOPE.",
        "\"FAZ UM ANO QUE A FENDA FECHOU. FESTA NO LABORATÓRIO! ASSINADO: CARVALHO E IPÊ\"",
        "TEM UM SEGUNDO ENVELOPE AQUI. É PRO AZUL. ELE TÁ AQUI EM PALLET, NA FRENTE DA CASA DELE, TREINANDO.",
        "MAS ELE NÃO PARA QUIETO PRA LER CARTA. LEVA PRA ELE? VOCÊ ELE ESCUTA.",
      ],
      resumo: "LEVAR O CONVITE DA FESTA PRO AZUL, NA FRENTE DA CASA DELE EM PALLET.",
      lembrete: ["O AZUL TÁ AQUI MESMO EM PALLET, NA FRENTE DA CASA DELE. ELE NÃO PARA QUIETO."],
      entrega: [
        "ELE VAI? O AZUL VAI NA FESTA? ...EU PERDI UMA APOSTA COM O PROFESSOR.",
        "TOMA. É O QUE SOBROU DA APOSTA.",
      ],
    },
    festa: {
      oferta: [
        "A FESTA JÁ COMEÇOU! O LABORATÓRIO TÁ CHEIO.",
        "A PROFESSORA IPÊ VEIO DE BRAGLITCH DE LANCHA. O AZUL CHEGOU PRIMEIRO, CLARO.",
        "VAI LÁ! E ME TRAZ UM PEDAÇO DE BOLO DEPOIS?",
      ],
      resumo: "IR À FESTA DE UM ANO NO LABORATÓRIO DO PROF. CARVALHO.",
      lembrete: ["VOCÊ AINDA NÃO FOI NA FESTA? O BOLO VAI ACABAR. O AZUL JÁ TÁ NO TERCEIRO PEDAÇO."],
      entrega: [
        "VOCÊ VOLTOU COM CARA DE QUEM VIU UM FANTASMA.",
        "...VIU VOCÊ MESMO? DE UM ANO ATRÁS? E AINDA GANHOU DE VOCÊ?",
        "QUE FESTA. TOMA: A FOTO. O PROFESSOR PEDIU PRA EU TE ENTREGAR.",
      ],
    },
  },
  b: {
    convite: {
      oferta: [
        "CARTA PRA VOCÊ! TEM CHEIRO DE AÇAÍ. DEVE SER DA PROFESSORA.",
        "\"FAZ UM ANO QUE BRAGLITCH GANHOU UM CAMPEÃO. FESTA NO MEU LAB! ASSINADO: IPÊ E CARVALHO\"",
        "E TEM MAIS DOIS: PRO VÍTOR E PRO ANDRÉ. ELES TÃO NO PÍER FAZ UMA SEMANA, MEXENDO NUMA LANCHA.",
        "LEVA PRA ELES? EU TENHO MEDO DO FIO SOLTO.",
      ],
      resumo: "LEVAR O CONVITE DA FESTA PRO VÍTOR E O ANDRÉ, NO PÍER DE SÃO LUCARIO.",
      lembrete: ["OS DOIS TÃO NO PÍER, DO LADO DA LANCHA. É SÓ SEGUIR O BARULHO DE CHAVE DE FENDA."],
      entrega: [
        "ELES VÃO? O VÍTOR VAI LEVAR O PLACAR DA ARENA PRA FESTA? DENTRO DO LAB?",
        "...TOMARA QUE TENHA TOMADA. TOMA, PELO CORREIO EXPRESSO.",
      ],
    },
    festa: {
      oferta: [
        "A FESTA JÁ COMEÇOU! O LAB DA IPÊ TÁ CHEIO.",
        "O PROFESSOR CARVALHO VEIO DE KANTO, E O ANDRÉ TROUXE O BOLO. DE ROLO. EU ACHO.",
        "VAI LÁ! E ME TRAZ UM PEDAÇO DEPOIS?",
      ],
      resumo: "IR À FESTA DE UM ANO NO LAB DA PROFA. IPÊ.",
      lembrete: ["VOCÊ AINDA NÃO FOI NA FESTA? O ANDRÉ VAI COMER O BOLO INTEIRO E CHAMAR DE OUTRO NOME."],
      entrega: [
        "VOCÊ VOLTOU COM CARA DE QUEM VIU UM FANTASMA.",
        "...VIU VOCÊ MESMO? DE UM ANO ATRÁS? SAIU DO COMPUTADOR DA IPÊ?",
        "QUE FESTA. TOMA: A FOTO. A PROFESSORA PEDIU PRA EU TE ENTREGAR.",
      ],
    },
  },
  extrema: {
    oferta: [
      "O GLITNEXY CONTOU TUDO PRA GENTE. FAZ SENTIDO DEMAIS, E ISSO ME ASSUSTA.",
      "O MISSINGNO QUE VOCÊ ENFRENTOU DEIXOU UM PEDAÇO NA FENDA. E O PEDAÇO ACHOU O GIRATINA.",
      "ELE ABSORVEU O GIRATINA. E O MUNDO DISTORCIDO, QUE É A CASA DO GIRATINA, VEIO JUNTO.",
      "AGORA A FENDA E O MUNDO DISTORCIDO SÃO UMA COISA SÓ: A GLITCH DIMENSION EXTREMA.",
      "LÁ DENTRO TUDO TEM CEM NÍVEIS A MAIS. ATÉ O MAIS FRACO.",
      "A MÁQUINA NÃO CHEGA MAIS LÁ. SÓ O GLITNEXY SABE O CAMINHO. E ELE SÓ VAI DE BARRIGA CHEIA.",
      "ELE MESMO FAZ O ESPETINHO: TRÊS BERRIES, DE ATÉ TRÊS TIPOS. SE TOPAR, EU TE DOU DEZ ORAN E DEZ CHESTO PRA COMEÇAR.",
      "VAI ATÉ O FUNDO E SOLTA O GIRATINA. VOCÊ TOPA?",
    ],
    resumo: "ENTRAR NA GLITCH DIMENSION EXTREMA (COM O GLITNEXY) E LIBERTAR O GIRATINA.",
    lembrete: [
      "O GLITNEXY FAZ O ESPETINHO NA HORA: É SÓ LEVAR TRÊS BERRIES. PODE MISTURAR.",
      "ACABARAM AS SUAS? TEM BERRY EM QUALQUER LOJA.",
      "QUANTO MELHOR A BERRY, MAIS ELE EMPRESTA PRA SUA EQUIPE LÁ DENTRO. E CADA TIPO DÁ UM PODERZINHO.",
      "LÁ DENTRO TEM SEIS CHEFES. O GIRATINA SÓ APARECE DEPOIS QUE OS SEIS CAÍREM.",
      "O ESPETINHO TAMBÉM DECIDE QUANTO TEMPO VOCÊ FICA LÁ. E CERTAS MISTURAS TÊM NOME.",
      "A MELHOR É O ESPETINHO RAYQUAZA: PETAYA, SALAC, STARF E UMA FOLHA DE HORTELÃ. CINQUENTA MINUTOS.",
    ],
    entrega: [
      "O GIRATINA ESTÁ LIVRE. E A FENDA... CONTINUA ABERTA. MAS AGORA É SÓ UMA FENDA.",
      "UM ANO ATRÁS VOCÊ FECHOU UM BURACO NO MUNDO. HOJE VOCÊ ENTROU NELE DE PROPÓSITO.",
      "TOMA. VOCÊ MERECE MAIS QUE BOLO.",
    ],
  },
};

const TXT = {
  cartaoInicio: ["UM ANO DEPOIS..."],
  cartaoFundiu: ["O MISSINGNO ABSORVEU O GIRATINA.", "A GLITCH DIMENSION E O MUNDO DISTORCIDO", "VIRARAM UMA COISA SÓ."],
  cartaoEntrou: (e) => ["GLITCH DIMENSION EXTREMA", "(UMA KANTO DE CABEÇA PRA BAIXO)", e.nome,
    `+${e.niveis} NÍVEIS E +${pct(e.atributos)}% NOS ATRIBUTOS`, `TEMPO NA FENDA: ${e.minutos} MIN`,
    ...e.tipos.map((b) => `${b.classe}: ${b.efeito}`)],
  presente: (quem) => `${quem} TE DEU ${PRESENTE.map(([i, n]) => `${n} ${i.toUpperCase()}`).join(" E ")}!`,
  cartaoFim: ["GLITCH DIMENSION EXTREMA", "FIM.", "...ATÉ O ANO QUE VEM."],
  fendaTrancada: [
    "A MÁQUINA CHIA, PISCA... E NÃO ABRE NADA.",
    "DO OUTRO LADO NÃO É MAIS SÓ A FENDA. SÓ O GLITNEXY SABE O CAMINHO AGORA.",
  ],
  azul: {
    antes: [
      "OLHA QUEM APARECEU. FAZ UM ANO, SABIA? EU CONTEI.",
      "EU PASSEI O ANO INTEIRO TREINANDO AQUI NA FRENTE DE CASA. OS VIZINHOS RECLAMARAM.",
      "E EU DESCOBRI O QUE EU LIA ERRADO NA TABELA DE TIPOS: EU LIA DE CABEÇA PRA BAIXO.",
      "AGORA EU LEIO DO JEITO CERTO. VEM. HOJE A CONTA FECHA.",
    ],
    depois: [
      "...A TABELA TAVA CERTA. QUEM TAVA DE CABEÇA PRA BAIXO ERA EU.",
      "FOI O SOL. BATE BEM NA CARA AQUI EM PALLET ESSA HORA.",
    ],
    conta: [
      "UM CONVITE? DO MEU AVÔ? COM CORAÇÃOZINHO?",
      "...EU VOU. MAS SÓ PORQUE TEM BOLO. E PRA CHEGAR NA FILA DO BOLO ANTES DE VOCÊ.",
    ],
    festa: ["AZUL: EU CHEGUEI PRIMEIRO. COMO SEMPRE.", "AZUL: JÁ COMI TRÊS PEDAÇOS DE BOLO. É CONTA, NÃO É FOME."],
    fim: [
      "A FENDA ABRIU DE NOVO E EU NÃO FUI CHAMADO. DE NOVO.",
      "TUDO BEM. EU FICO AQUI EM PALLET TREINANDO. DE NOVO, EU FIQUEI SEGURANDO A PORTA.",
    ],
  },
  vitor: {
    antes: [
      "VÍTOR: OI! OLHA! OLHA ISSO!",
      "VÍTOR: LEMBRA DA LANCHA? COM MOTOR DE VERDADE, NÃO DE VENTILADOR? TÁ PRONTA. QUER DIZER... QUASE.",
      "VÍTOR: O MOTOR É UM ROTOM DENTRO DE UMA MÁQUINA DE LAVAR. ELE GIRA A HÉLICE NO CENTRIFUGAR.",
      "VÍTOR: ANTES DE TESTAR NO MAR, EU TESTO EM VOCÊ. UM ANO DE TREINO. VEM!",
    ],
    depois: ["VÍTOR: PERDI. TÁ TUDO CERTO. A LANCHA TAMBÉM NÃO LIGOU."],
    conta: [
      "VÍTOR: UM CONVITE? FESTA NO LAB DA IPÊ?",
      "VÍTOR: A GENTE VAI! EU LEVO O PLACAR DA ARENA. ELE MOSTRA O SEU NOME, LEMBRA?",
      "ANDRÉ: E EU LEVO O BOLO! DE ROLO! OU DE... DE ROLHA?",
    ],
    festa: [
      "VÍTOR: O PLACAR NÃO COUBE NA PORTA. EU LIGUEI ELE NA CALÇADA.",
      "VÍTOR: ...O COMPUTADOR DA IPÊ TÁ FAZENDO UM BARULHO QUE EU NÃO CONHEÇO. E EU CONHEÇO TODOS.",
    ],
    fim: [
      "VÍTOR: A LANCHA LIGOU! O ROTOM ACEITOU CENTRIFUGAR PRA FRENTE.",
      "VÍTOR: AS ILHAS SEM NOME FICAM PRO ANO QUE VEM. AGORA TEM UMA FENDA ABERTA E UM BICHO DE WI-FI COM FOME.",
      "VÍTOR: SE PRECISAR, EU FAÇO UM DETECTOR DE ESPETINHO. JÁ TENHO A ANTENA.",
    ],
  },
  andre: {
    antes: [
      "[pensa:rotom]ANDRÉ: O MOTOR DA LANCHA É UM... UM FANTASMINHA DE TOMADA. O ROTO. O ROTOMATE.",
      "ANDRÉ: EU NÃO SEI NADAR, MAS EU SEI CHUTAR A ÁGUA. ISSO CONTA COMO REMO?",
      "[pensa:dragonite]ANDRÉ: O MEU CHARIZARD JÁ VOA MAIS ALTO QUE O PRÉDIO DA IPÊ. O DRAGÃO LARANJA. ESSE.",
    ],
    festa: [
      "ANDRÉ: EU TROUXE O BOLO DE ROLO! QUER DIZER, DE ROLA. DE RODA. É UM BOLO REDONDO.",
      "[pensa:guzzlord]ANDRÉ: O BOCÃO QUERIA COMER A MESA JUNTO. EU DEIXEI ELE NA BOLA.",
    ],
    fim: [
      "[pensa:glitnexy]ANDRÉ: AQUELE BICHINHO DE INTERNET... O GLITCHEXY. O WI-FIZINHO. O GLINEXO.",
      "ANDRÉ: ELE COMEU O MEU ESPETINHO E NEM AGRADECEU. ESTOU BRAVO E COM FOME.",
    ],
  },
  ipe: {
    festa: [
      "IPÊ: VIM DE LANCHA! O CARVALHO DISSE QUE ERA FESTA SURPRESA. SURPRESA!",
      "IPÊ: UM ANO. PARECE QUE FOI ONTEM QUE VOCÊ SAIU COM UM POKÉMON SÓ.",
      "IPÊ: ...ESSA MÁQUINA DO CANTO SEMPRE APITA ASSIM?",
    ],
  },
  carvalho: {
    festa: [
      "CARVALHO: ATRAVESSEI O MAR PRA COMER BOLO. NA MINHA IDADE, ISSO É AVENTURA.",
      "CARVALHO: UM ANO. A IPÊ E EU ESCREVEMOS UM LIVRO: \"FORMAS E FENDAS\". VENDEU TRÊS. DOIS FORAM PRA MÃE DELA.",
      "CARVALHO: ...O COMPUTADOR DELA SEMPRE FEZ ESSE BARULHO?",
    ],
  },
  passado: {
    // {SAIU} é de onde ele saiu: da máquina (Kanto) ou do computador (Braglitch)
    antes: [
      "...ONDE EU TÔ? EU SÓ APERTEI {SAIU}.",
      "VOCÊ... TEM A MINHA CARA. SÓ QUE MAIS ALTO.",
      "EU ACABEI DE PEGAR O MEU PRIMEIRO POKÉMON! QUER VER? QUER LUTAR? VAMOS LUTAR!",
    ],
    depois: ["EU PERDI... MAS FOI MUITO LEGAL."],
    conta: [
      "ME FALA UMA COISA. EU VOU CONSEGUIR? AS INSÍGNIAS? O... TUDO?",
      "...",
      "VOCÊ FICOU SORRINDO. ENTÃO É SIM.",
      "{SAIU2} TÁ PISCANDO. ACHO QUE É A MINHA HORA DE VOLTAR.",
      "TCHAU, EU! CUIDA BEM DELE. DO MEU... DO NOSSO.",
      "(O VOCÊ DE UM ANO ATRÁS SUMIU NUM CLARÃO ROXO. E NO LUGAR DELE CAIU UMA COISA REDONDA COM ASA DE WI-FI.)",
      "{PROF1}: QUEM É ESSE POKÉMON?!",
      "GLITNEXY: GLITCH! GLITNEXY!",
      "(TODAS AS LUZES DO LABORATÓRIO PISCARAM DE UMA VEZ. POR UM SEGUNDO, O CHÃO FICOU DE CABEÇA PRA BAIXO.)",
      "{PROF2}: OH-OH... O MUNDO DISTORCIDO E A GLITCH DIMENSION VIRARAM UM SÓ.",
      "(A FESTA ACABOU AÍ MESMO. TODO MUNDO FOI EMBORA CORRENDO, MENOS OS PROFESSORES... E O GLITNEXY.)",
    ],
    // quem grita primeiro e quem entende primeiro, em cada laboratório
    profs: { k: ["CARVALHO", "IPÊ"], b: ["IPÊ", "CARVALHO"] },
    saiu: { k: ["O BOTÃO GRANDE DA MÁQUINA", "A MÁQUINA"], b: ["UMA TECLA DO COMPUTADOR DA IPÊ", "O COMPUTADOR"] },
  },
  glitnexy: {
    semComida: [
      "GLIT! GLIT GLIT!",
      "(O GLITNEXY ABRE A BOCONA E APONTA PRA ELA. DEPOIS APONTA PRA FENDA. DEPOIS PRA BOCA DE NOVO.)",
      "(ELE QUER UM ESPETINHO DE BERRIES: TRÊS BERRIES, QUE ELE MESMO ASSA. DONUT NÃO: DONUT É COMIDA DE HOOPA, PRA IR PRO HIPERESPAÇO. ELE VAI PRA FENDA.)",
      "(BERRY TEM EM QUALQUER LOJA.)",
    ],
    cheirou: ["GLIT?! GLIIIT!", "(O GLITNEXY SENTIU O CHEIRO DAS BERRIES NA SUA MOCHILA. AS ASAS DE WI-FI ACENDERAM TODAS.)"],
    qual: (n) => `QUAL BERRY VAI NO ESPETINHO? (${n} DE 3)`,
    tempero: "E O TEMPERO?",
    semTempero: "SEM TEMPERO",
    nada: "(O GLITNEXY FICOU OLHANDO PRA SUA MOCHILA COM AS TRÊS BARRINHAS DE SINAL ABAIXADAS.)",
    comeu: (e) => [
      `(O GLITNEXY ESPETOU AS TRÊS BERRIES NA ANTENA${e.tempero ? `, JOGOU ${e.tempero.toUpperCase()} POR CIMA` : ""} E ASSOU NO PRÓPRIO WI-FI.)`,
      ...(e.receita ? [`(UMA RECEITA! SAIU O ${e.nome}!)`] : []),
      `NHAC! (COMEU O ${e.nome} INTEIRO. COM O PALITO.)`,
      `(LÁ DENTRO, SUA EQUIPE GANHA +${e.niveis} NÍVEIS E +${pct(e.atributos)}% NOS ATRIBUTOS.)`,
      `(A FENDA FICA ABERTA PRA VOCÊ POR ${e.minutos} MINUTOS.)`,
      ...e.tipos.map((b) => `(PODER ${b.classe} DA ${b.berry.toUpperCase()}: ${b.efeito}.)`),
      "GLIT GLIT GLIT! (ELE ABRIU A BOCONA... E A BOCONA É UMA PORTA.)",
    ],
  },
  apagar: {
    nome: "APAGAR DLC",
    pergunta: "APAGAR O PROGRESSO DO DLC? VOCÊ PERDE TODAS AS BERRIES E OS POKÉMON PEGOS NELE.",
    opcoes: ["NÃO", "APAGAR"],
    certeza: "TEM CERTEZA? NÃO DÁ PRA DESFAZER.",
    opcoes2: ["NÃO", "SIM, APAGAR"],
  },
  apagado: (berries, mons) => [
    "PROGRESSO DO DLC APAGADO.",
    `FORAM EMBORA ${berries} BERRIES E ${mons} POKÉMON PEGOS NO DLC.`,
    "UM ANO DEPOIS... DE NOVO. (Z VOLTA)",
  ],
  cartaoChefes: ["OS SEIS CHEFES CAÍRAM.", "NO FUNDO DA FENDA, O GIRATINA ACORDOU."],
  // o PROFESSOR te puxa pra fora quando um chefe cai: a fenda muda de lugar
  puxao: [
    "(O CHÃO COMEÇOU A ESCORRER PRA CIMA. AS CORES ESTÃO TROCANDO DE LUGAR. A FENDA ESTÁ MUDANDO!)",
    "CARVALHO (PELO RÁDIO DA POKÉDEX): SEGURA FIRME! VOU TE PUXAR DAÍ!",
    "CARVALHO: SE VOCÊ FICAR AÍ DENTRO, VAI MUDAR JUNTO COM A FENDA!",
  ],
  puxado: (nome, ultimo) => [
    "CARVALHO: UFA! DEU TEMPO. VOCÊ CONTINUA COM UMA CABEÇA SÓ. ACHO.",
    `CARVALHO: A FENDA VIROU OUTRO LUGAR. O MONITOR DIZ: ${nome}.`,
    ultimo ? "CARVALHO: E LÁ NO FUNDO TEM UMA COISA ENORME ACORDANDO. É O GIRATINA. E O MISSINGNO JUNTO."
           : "CARVALHO: E TEM OUTRO CHEFE LÁ DENTRO. DÁ PRA SENTIR DAQUI.",
    "CARVALHO: QUANDO QUISER VOLTAR, FAZ OUTRO ESPETINHO PRO GLITNEXY.",
  ],
  cartaoMudou: (nome) => ["A FENDA MUDOU DE LUGAR", nome],
  roteador: "O SEU GLITNEXY CUSPIU UMA COISA: O ROTEADOR EXTREMO 999G! USE NELE PELA MOCHILA.",
  primo: {
    oi: [
      "GLIT! GLIT GLIT GLIT!",
      "(UM GLITNEXY BRILHANDO, DE ASAS COR-DE-ROSA. É O PRIMO DO GLITNEXY DO LABORATÓRIO, AQUELE QUE TE LEVOU PRA FENDA.)",
      "(O GLITNEXY DO LABORATÓRIO EMPURRA O PRIMO PRA FRENTE COM A ASA.) GLIT!",
      "(O PRIMO APONTA PRA SUA MOCHILA, DEPOIS PRA ELE MESMO. ELE QUER IR COM VOCÊ!)",
    ],
    semBola: "(...MAS VOCÊ NÃO TEM NENHUMA POKÉ BOLA. ELE ESPERA AQUI. AS LOJAS VENDEM.)",
    pergunta: "JOGAR UMA POKÉ BOLA NELE?",
    opcoes: ["JOGAR!", "AGORA NÃO"],
    depois: "GLIT... (ELE FICA ESPERANDO, BALANÇANDO AS ASAS.)",
    jogou: (bola) => [
      `VOCÊ JOGOU A ${bola.toUpperCase()}... ELE MESMO ABRIU A BOLA E PULOU DENTRO!`,
      "PLIM... PLIM... PLIM... CLIQUE!",
      "VOCÊ PEGOU O GLITNEXY BRILHANTE!",
    ],
    equipe: "ELE ENTROU NA SUA EQUIPE. O PRIMO DELE, NO LABORATÓRIO, FICOU ACENANDO COM A ASA.",
    pc: "A EQUIPE ESTÁ CHEIA: ELE FOI PRO PC.",
    semVaga: "(...A SUA EQUIPE E O PC ESTÃO CHEIOS! ELE ESPERA AQUI ATÉ ABRIR UMA VAGA.)",
  },
  forma: {
    pergunta: "{MON} OLHA PRO ROTEADOR COM AS ANTENAS ACESAS. LIGAR?",
    virou: "999G! O SINAL FOI NO MÁXIMO, E ELE VIROU O GLITNEXY EXTREMO! (O BAIXAR TUDO VIROU SINAL 999G.)",
    saiu: "O ROTEADOR DESLIGOU. ELE VOLTOU A SER O GLITNEXY DE SEMPRE.",
    jaE: "{MON} JÁ ESTÁ ASSIM.",
    nada: "O ROTEADOR PISCA, MAS NADA ACONTECE. SÓ UM GLITNEXY PEGA ESSE SINAL.",
  },
  chefePego: "LONGE DA FENDA, ELE SE ACALMOU. O NÍVEL VOLTOU AO NORMAL.",
  giratina: {
    antes: [
      "(UMA SOMBRA ENORME, DE CABEÇA PRA BAIXO. METADE DELA É GIRATINA. A OUTRA METADE SÃO PIXELS QUE NÃO SABEM O QUE SÃO.)",
      "(NO MEIO DO PEITO DELE PISCA UM NÚMERO: 0x3F. O MISSINGNO ESTÁ AÍ DENTRO.)",
      "GRRRAAA4A4AAA!!",
    ],
    pego: "O MISSINGNO SE SOLTOU DO GIRATINA E SE DESFEZ NO AR. O GIRATINA OLHOU PRA VOCÊ... E ENTROU NA BOLA SOZINHO.",
  },
};

// ------------------------------------------------------------ o GLITNEXY
const GLITNEXY = {
  dex: 0, name: "GLITNEXY", types: ["GLITCH", "PSÍQUICO"],
  base: { hp: 85, atk: 70, def: 65, spa: 110, spd: 80, spe: 105 },
  catchRate: 25, xpYield: 180,
  learnset: [[1, "mordida"], [1, "rajadadevento"], [8, "confusao"], [15, "ruidobranco"],
             [22, "corrompida"], [30, "ataquedeasa"], [38, "psiquico"], [46, "baixartudo"]],
  dexText: "TEM O FORMATO DO SINAL DE INTERNET: O PONTINHO É A BOCA, OS ARCOS SÃO AS ASAS. COME DE TUDO, MENOS DONUT. QUANDO ESTÁ DE BARRIGA CHEIA, A BOCA VIRA UMA PORTA PRA FENDA.",
  sprite: "dlc/glitnexy.png", spriteBack: "dlc/glitnexy_costas.png",
};

/** O GLITNEXY EXTREMO: a forma solta, como o HOOPA desacorrentado. Quem
 *  troca é o ROTEADOR EXTREMO 999G (vai e volta, não se gasta), e na troca o
 *  BAIXAR TUDO vira o SINAL 999G. Desenho: tools/extrema_desenhos/glitnexy_extremo.py */
const ROTEADOR = "roteador extremo 999g";
const GLITNEXY_EXTREMO = {
  ...GLITNEXY,
  name: "GLITNEXY EXTREMO", types: ["GLITCH", "SOMBRIO"], formaDe: "glitnexy",
  base: { hp: 85, atk: 120, def: 65, spa: 160, spd: 80, spe: 95 },
  learnset: GLITNEXY.learnset.map(([n, g]) => [n, g === "baixartudo" ? "sinal999g" : g]),
  dexText: "COM O SINAL NO MÁXIMO, OS ARCOS VIRAM QUATRO, A BOCONA VIRA UM PORTAL E SAEM DOIS BRAÇOS DE CABO DE REDE. CADA MÃO SEGURA UM ANEL DA FENDA. FICA BRAVO E COM FOME AO MESMO TEMPO.",
  sprite: "dlc/glitnexy_extremo.png", spriteBack: "dlc/glitnexy_extremo_costas.png",
};
/** troca o golpe da forma: BAIXAR TUDO <-> SINAL 999G */
function golpeDaForma(mon, nova) {
  const [sai, entra] = nova === "glitnexyextremo" ? ["baixartudo", "sinal999g"] : ["sinal999g", "baixartudo"];
  const i = mon.moves.findIndex((m) => m.id === sai);
  const novo = { id: entra, pp: DB.MOVES[entra].pp, ppMax: DB.MOVES[entra].pp };
  if (i >= 0) mon.moves[i] = novo;
  else if (nova === "glitnexyextremo" && mon.moves.length < 4 && !mon.moves.some((m) => m.id === entra)) mon.moves.push(novo);
}

/** OS CAPÍTULOS da KANTO DISTORCIDA: o pedaço de Kanto que a fenda virou de
 *  cabeça pra baixo, um por chefe (o i-ésimo chefe mora no i-ésimo; o último
 *  é o do GIRATINA). Cada um é um mapa próprio: quem salva lá dentro volta
 *  pro mesmo capítulo. */
const CAPITULOS = [
  { id: "kanto_distorcida_1", fonte: "pallet", nome: "PALLET DE PONTA-CABEÇA" },
  { id: "kanto_distorcida_2", fonte: "route1", nome: "ROTA 1 DE PONTA-CABEÇA" },
  { id: "kanto_distorcida_3", fonte: "viridian", nome: "VIRIDIAN DE PONTA-CABEÇA" },
  { id: "kanto_distorcida_4", fonte: "route2", nome: "ROTA 2 DE PONTA-CABEÇA" },
  { id: "kanto_distorcida_5", fonte: "pewter_city", nome: "PEWTER DE PONTA-CABEÇA" },
  { id: "kanto_distorcida_6", fonte: "mt_moon_1f", nome: "MT MOON DE PONTA-CABEÇA" },
  { id: "kanto_distorcida_7", fonte: "mt_moon_b2f", nome: "O FUNDO DA FENDA" },
];
const capitulo = (map) => CAPITULOS.findIndex((c) => c.id === map);
/** Os do MUNDO DISTORCIDO, que vieram junto com o GIRATINA, no mato dela — com
 *  os da ROTA 1, que continuam lá (de nível 102 pra cima: pegos, voltam a 2). */
const DISTORCIDOS = [
  { id: "sableye", min: 30, max: 50, w: 12 }, { id: "dusclops", min: 35, max: 50, w: 10 },
  { id: "dusknoir", min: 45, max: 60, w: 4 }, { id: "spiritomb", min: 40, max: 55, w: 4 },
  { id: "drifloon", min: 28, max: 42, w: 12 }, { id: "drifblim", min: 40, max: 55, w: 6 },
  { id: "mismagius", min: 40, max: 55, w: 6 }, { id: "honchkrow", min: 40, max: 55, w: 6 },
  { id: "frillish", min: 30, max: 45, w: 6 },   // GLITNEXY selvagem não existe: o seu é o PRIMO
];

/** OS SEIS CHEFES da fenda extrema: raros, nenhum lendário, e todos do lado
 *  do GIRATINA (FANTASMA e DRAGÃO). Derrubar conta pra acordar o GIRATINA;
 *  sem captura, o chefe está de pé de novo na próxima viagem. Pego, devolve
 *  os 100 níveis como qualquer um de lá. */
// Na ordem em que aparecem: um por capítulo, cada um mais forte.
const CHEFES = [
  { id: "dragapult", lvl: 155,
    antes: ["(UM DRAGAPULT DE OLHOS VERMELHOS. OS DREEPY NOS CHIFRES DELE ESTÃO DE CABEÇA PRA BAIXO.)"] },
  { id: "mimikyu", lvl: 155,
    antes: ["(UM MIMIKYU COM A FANTASIA MEIO GLITCHADA. O PIKACHU DO PANO É UM MISSINGNO.)"] },
  { id: "spiritomb", lvl: 158,
    antes: ["(CENTO E OITO VOZES SUSSURRAM AO MESMO TEMPO: \"QUEM ENTROU?\")"] },
  { id: "dusknoir", lvl: 158,
    antes: ["(O DUSKNOIR ABRE A BOCA DA BARRIGA. DE DENTRO SAI UM VENTO QUE PUXA PRA BAIXO.)"] },
  { id: "garchomp", lvl: 160,
    antes: ["(UM GARCHOMP CAVANDO O CHÃO DE CABEÇA PRA BAIXO. O CHÃO NÃO TEM FUNDO, MAS ELE CONTINUA CAVANDO.)"] },
  { id: "hydreigon", lvl: 160,
    antes: ["(AS TRÊS CABEÇAS DO HYDREIGON BRIGAVAM ENTRE SI... ATÉ VEREM VOCÊ.)"] },
];
/** Vencido em qualquer capítulo (o npcState é por mapa). */
const venceu = (st, npcId) => CAPITULOS.some((c) => st?.npcState?.[`${c.id}.${npcId}`]?.defeated);
const vencidos = (st) => CHEFES.filter((c) => st?.flags?.[`gdeChefe_${c.id}`]).length;
/** Pra onde a fenda leva agora: o capítulo do primeiro chefe de pé. */
const capituloDaVez = (st) => CAPITULOS[Math.min(vencidos(st), CAPITULOS.length - 1)];

// ------------------------------------------------------------ as tirinhas
/** AS TIRINHAS DE UM ANO DEPOIS: entram no fim do caderno do VÍTOR
 *  (src/data/amigos.js `TIRINHAS`), e a primeira vez que o pacote roda o
 *  caderno abre nelas. A primeira é do CAIO (o PATO NA PANELA); as outras são
 *  minhas. Coordenadas no quadro de 224x122 (chão em y=114). */
const TIRINHAS = [
  {
    titulo: "PATO NA PANELA",
    quadros: [
      { legenda: "UM ANO DEPOIS, NO PÍER DE SÃO LUCARIO",
        bichos: [["guzzlord", 4, { v: true, s: 96 }], ["farfetchd", 150]],
        falas: [[1, "QUE DIA LINDO PRA NADAR!"]] },
      { legenda: "O BOCÃO (O GUZZLORD DO ANDRÉ) ENCHEU A BOCA DE ÁGUA DO MAR",
        bichos: [["guzzlord", 4, { v: true, s: 96 }], ["farfetchd", 150]],
        agua: [24, 62, 72, 20],
        falas: [[1, "...POR QUE VOCÊ TÁ ME OLHANDO ASSIM?"]] },
      { // a boca do BOCÃO vai de y=62 a 82: o pato boia nela (sem legenda, pro balão ficar lá em cima)
        bichos: [["guzzlord", 4, { v: true, s: 96 }], ["farfetchd", 36, { s: 56, dy: -36 }], ["charmander", 158, { s: 56 }]],
        agua: [24, 62, 72, 20], fogo: [[104, 82], [118, 86], [132, 89], [146, 92]], colunas: 30,
        falas: [[1, "QUEM INVENTOU DE COZINHAR PATO COM ALHO-PORÓ?!"]], fx: "treme" },
    ],
    fim: ["VÍTOR: CALMA! O FARFETCH'D TÁ BEM. O ANDRÉ FEZ O BOCÃO CUSPIR ELE.", "VÍTOR: ...DEPOIS DE PROVAR O CALDO."],
  },
  {
    titulo: "DONUT NÃO",
    quadros: [
      { bichos: [["hoopa", 24, { v: true }], ["glitnexy", 140]],
        falas: [[0, "TROUXE UM DONUT PRA VOCÊ!"], [1, "GLIT GLIT."]] },
      { legenda: "O GLITNEXY SÓ COME ESPETINHO DE BERRY",
        bichos: [["hoopa", 24, { v: true }], ["glitnexy", 140]],
        falas: [[0, "NEM UM PEDACINHO?"], [1, "GLIT."]] },
      { bichos: [["hoopa", 24, { v: true }], ["glitnexy", 140]],
        falas: [[0, "ENTÃO É MEU! NHAC!"]], fx: "flash" },
      { legenda: "QUEM COME DONUT VAI PRO HIPERESPAÇO",
        bichos: [["glitnexy", 140]],
        falas: [[0, "...GLIT. (EU AVISEI.)"]] },
    ],
  },
  {
    titulo: "QUEM TÁ DE CABEÇA PRA BAIXO",
    quadros: [
      { legenda: "NA KANTO DISTORCIDA",
        bichos: [["rattata", 30, { v: true }], ["pidgey", 140, { vc: true, dy: 16 }]],
        falas: [[0, "POR QUE VOCÊ TÁ DE CABEÇA PRA BAIXO?"], [1, "EU? É VOCÊ!"]] },
      { legenda: "3 HORAS DE DISCUSSÃO DEPOIS",
        bichos: [["rattata", 30, { v: true }], ["pidgey", 140, { vc: true, dy: 16 }]],
        falas: [[0, "É VOCÊ!"], [1, "É VOCÊ!"]], fx: "treme" },
      { bichos: [["giratina", 66, { s: 92 }]],
        falas: [[0, "SÃO OS DOIS. E O CHÃO. E O CÉU."]] },
      { bichos: [["rattata", 30, { v: true, vc: true, dy: 16 }], ["pidgey", 140, { vc: true, dy: 16 }]],
        falas: [[0, "...AGORA FICOU NORMAL."], [1, "MUITO NORMAL."]] },
    ],
  },
  {
    titulo: "A FANTASIA",
    quadros: [
      { bichos: [["pikachu", 24, { v: true }], ["mimikyu", 140]],
        falas: [[0, "POR QUE VOCÊ SE VESTE DE MIM?"], [1, "PRA TODO MUNDO GOSTAR DE MIM."]] },
      { bichos: [["pikachu", 24, { v: true }], ["mimikyu", 140]],
        falas: [[0, "MAS DÁ PRA GOSTAR DE VOCÊ DO JEITO QUE VOCÊ É!"]] },
      { bichos: [["pikachu", 24, { v: true }], ["mimikyu", 140]],
        falas: [[1, "QUE FOFO. ENTÃO ME EMPRESTA O SEU RABO? O MEU É DE PANO."]], colunas: 26 },
      { bichos: [["mimikyu", 140]],
        falas: [[0, "...ELE FOI EMBORA CORRENDO. DE NOVO."]] },
    ],
  },
  {
    titulo: "O BOCÃO NO RESTAURANTE",
    quadros: [
      { bichos: [["@andre", 20, { v: true }], ["guzzlord", 120, { s: 90 }]],
        falas: [[0, "BOCÃO, É UM RESTAURANTE CHIQUE. COMPORTE-SE."], [1, "GRUM."]], colunas: 22 },
      { legenda: "O GARÇOM TROUXE O CARDÁPIO",
        bichos: [["@andre", 20, { v: true }], ["guzzlord", 120, { s: 90 }]],
        falas: [[1, "NHAC!"]], fx: "treme" },
      { bichos: [["@andre", 20, { v: true }], ["guzzlord", 120, { s: 90 }]],
        falas: [[0, "VOCÊ COMEU O CARDÁPIO?!"], [1, "E A MESA."]] },
      { legenda: "A CONTA",
        bichos: [["@andre", 20, { v: true }], ["guzzlord", 120, { s: 90 }]],
        falas: [[0, "...ELE COMEU A CONTA TAMBÉM. ENTÃO TÁ PAGO, NÉ?"]], colunas: 26 },
    ],
  },
  {
    titulo: "UM ANO NO NÍVEL 19",
    quadros: [
      { legenda: "UM ANO DEPOIS", bichos: [["magikarp", 24, { v: true }], ["goldeen", 140]],
        falas: [[0, "FAZ UM ANO QUE EU TÔ NO NÍVEL 19."], [1, "POR QUÊ?"]] },
      { bichos: [["magikarp", 24, { v: true }], ["goldeen", 140]],
        falas: [[0, "SE EU EVOLUIR, NINGUÉM VAI ME ACHAR FOFO."]] },
      { legenda: "AÍ CHEGOU O GYARADOS", bichos: [["magikarp", 24, { v: true }], ["gyarados", 120, { s: 84 }]],
        falas: [[1, "EU TAMBÉM PENSAVA ASSIM."]] },
      { bichos: [["magikarp", 24, { v: true }], ["gyarados", 120, { s: 84 }]],
        falas: [[0, "E AGORA?"], [1, "AGORA EU SOU FOFO E GIGANTE."]], fx: "treme" },
    ],
  },
  {
    titulo: "ESPETINHO RAYQUAZA",
    quadros: [
      { bichos: [["rayquaza", 4, { v: true, s: 84 }], ["glitnexy", 150]],
        falas: [[0, "FIZERAM UM ESPETINHO DE MIM?!"], [1, "GLIT! (É SÓ O NOME!)"]], fx: "treme" },
      { bichos: [["rayquaza", 4, { v: true, s: 84 }], ["glitnexy", 150]],
        falas: [[0, "AH, BOM. E TÁ GOSTOSO?"], [1, "GLIT GLIT GLIT!"]] },
      { legenda: "NO DIA SEGUINTE", bichos: [["groudon", 6, { v: true }], ["kyogre", 140]],
        falas: [[0, "CADÊ O ESPETINHO GROUDON?"], [1, "E O ESPETINHO KYOGRE?"]] },
      { bichos: [["glitnexy", 80]],
        falas: [[0, "...GLIT. (COMI OS DOIS.)"]] },
    ],
  },
  {
    titulo: "+100 NÍVEIS",
    quadros: [
      { legenda: "NA FENDA, TODO POKÉMON GANHA +100 NÍVEIS", bichos: [["snorlax", 70, { s: 80 }]],
        falas: [[0, "ZZZ..."]], fx: "zzz" },
      { legenda: "SNORLAX NÍVEL 130", bichos: [["snorlax", 70, { s: 80 }]],
        falas: [[0, "ZZZ..."]], fx: "zzz" },
      { legenda: "O QUE MUDOU", bichos: [["snorlax", 70, { s: 80 }]],
        falas: [[0, "ZZZ... MAIS FORTE."]], fx: "zzz" },
    ],
  },
  {
    titulo: "PRA CIMA É PRA BAIXO",
    quadros: [
      { bichos: [["dreepy", 24, { v: true, s: 48 }], ["dragapult", 120, { s: 84 }]],
        falas: [[0, "TIO DRAGAPULT, ME LANÇA DE NOVO!"], [1, "LÁ VAI!"]] },
      { legenda: "FIUUUUUU", bichos: [["dragapult", 120, { s: 84 }]], fx: "flash" },
      { legenda: "MAS NA KANTO DISTORCIDA, PRA CIMA É PRA BAIXO",
        bichos: [["dreepy", 24, { s: 48, vc: true, dy: 12 }], ["arceus", 130, { s: 80 }]],
        falas: [[0, "TIO... MORRI! CAÍ PRO CÉU. OI, ARCEUS!"]], colunas: 24 },
    ],
  },
  {
    titulo: "DESENHANDO O SPIRITOMB",
    quadros: [
      { bichos: [["@vitor", 20, { v: true }], ["spiritomb", 140]],
        falas: [[0, "HOJE EU VOU DESENHAR O SPIRITOMB!"], [1, "..."]] },
      { legenda: "O SPIRITOMB TEM 108 ALMAS", bichos: [["@vitor", 20, { v: true }], ["spiritomb", 140]],
        falas: [[0, "UMA... DUAS... TRÊS..."]] },
      { legenda: "6 HORAS DEPOIS", bichos: [["@vitor", 20, { v: true }], ["spiritomb", 140]],
        falas: [[0, "...CENTO E SETE."]], fx: "zzz" },
      { bichos: [["@vitor", 20, { v: true }], ["spiritomb", 140]],
        falas: [[1, "PRONTO? AGORA ME DESENHA SORRINDO."]], fx: "treme" },
    ],
  },
  {
    titulo: "SEM SINAL",
    quadros: [
      { legenda: "O GLITNEXY ENTROU NO MT MOON", bichos: [["glitnexy", 80]], falas: [[0, "GLIT GLIT!"]] },
      { legenda: "LÁ DENTRO NÃO PEGA SINAL", bichos: [["glitnexy", 80, { dy: 20 }]], falas: [[0, "GL... T..."]], fx: "zzz" },
      { legenda: "SAIU DA CAVERNA", bichos: [["glitnexy", 80]], falas: [[0, "GLIT GLIT GLIT GLIT GLIT!!!"]], fx: "flash" },
    ],
  },
  {
    titulo: "A SENHA DO WI-FI",
    quadros: [
      { bichos: [["@andre", 20, { v: true }], ["glitnexy", 140]],
        falas: [[0, "QUAL É A SENHA DO SEU WI-FI?"], [1, "GLIT."]] },
      { bichos: [["@andre", 20, { v: true }], ["glitnexy", 140]],
        falas: [[0, "SÓ ISSO? GLIT?"], [1, "GLIT GLIT."]] },
      { legenda: "CONECTOU!", bichos: [["glitnexy", 140]], fx: "flash" },
      { legenda: "O ANDRÉ FOI PARAR NA FENDA", bichos: [["@andre", 80, { vc: true, dy: -8 }]],
        falas: [[0, "...ALGUÉM ME DESVIRA?"]], colunas: 22 },
    ],
  },
  {
    titulo: "O ASPIRADOR",
    quadros: [
      { bichos: [["@vitor", 20, { v: true }], ["dusknoir", 130, { s: 76 }]],
        falas: [[0, "MEU QUARTO TÁ UMA BAGUNÇA."], [1, "DEIXA COMIGO."]] },
      { legenda: "O DUSKNOIR ABRIU A BOCA DA BARRIGA", bichos: [["dusknoir", 130, { s: 76 }]], fx: "treme" },
      { bichos: [["@vitor", 20, { v: true }], ["dusknoir", 130, { s: 76 }]],
        falas: [[0, "...O MEU CADERNO DE TIRINHAS TAMBÉM?!"], [1, "OPS."]] },
    ],
  },
  {
    titulo: "TRÊS CABEÇAS",
    quadros: [
      { bichos: [["hydreigon", 76, { s: 72 }]],     // sem legenda: os três balões precisam do alto
        falas: [[0, "DIREITA!"], [0, "ESQUERDA!"], [0, "EU QUERIA LANCHE."]], colunas: 20 },
      { legenda: "EMPATE", bichos: [["hydreigon", 76, { s: 72 }]], fx: "treme" },
      { legenda: "FORAM LANCHAR", bichos: [["hydreigon", 76, { s: 72 }]],
        falas: [[0, "NHAC NHAC NHAC."]] },
    ],
  },
  {
    titulo: "O MAIS RÁPIDO",
    quadros: [
      { bichos: [["garchomp", 14, { v: true, s: 80 }], ["ninjask", 150]],
        falas: [[0, "EU SOU O MAIS RÁPIDO DA FENDA!"], [1, "DUVIDO."]] },
      { legenda: "A CORRIDA", bichos: [["garchomp", 70, { v: true, s: 80 }]], fx: "flash" },
      { legenda: "NA CHEGADA", bichos: [["garchomp", 14, { v: true, s: 80 }], ["ninjask", 150]],
        falas: [[1, "CHEGUEI FAZ DEZ MINUTOS."]] },
    ],
  },
  {
    titulo: "A CHESTO BERRY",
    quadros: [
      { legenda: "A CHESTO BERRY ACORDA QUALQUER UM", bichos: [["@andre", 20, { v: true }], ["snorlax", 130, { s: 80 }]],
        falas: [[0, "COME ESSA, SNORLAX!"]], fx: "zzz" },
      { bichos: [["@andre", 20, { v: true }], ["snorlax", 130, { s: 80 }]], falas: [[1, "NHAC."]], fx: "flash" },
      { bichos: [["@andre", 20, { v: true }], ["snorlax", 130, { s: 80 }]], falas: [[1, "BOM DIA!"]] },
      { legenda: "5 SEGUNDOS DEPOIS", bichos: [["@andre", 20, { v: true }], ["snorlax", 130, { s: 80 }]],
        falas: [[1, "ZZZ..."]], fx: "zzz" },
    ],
  },
  {
    titulo: "DAQUI A UM ANO",
    quadros: [
      { bichos: [["bulbasaur", 24, { v: true }], ["venusaur", 120, { s: 84 }]],
        falas: [[0, "QUEM É VOCÊ?"], [1, "SOU VOCÊ DAQUI A UM ANO."]] },
      { bichos: [["bulbasaur", 24, { v: true }], ["venusaur", 120, { s: 84 }]],
        falas: [[0, "EU VOU TER UMA ÁRVORE NAS COSTAS?!"]], fx: "treme" },
      { bichos: [["bulbasaur", 24, { v: true }], ["venusaur", 120, { s: 84 }]],
        falas: [[1, "E ELA PESA."]] },
    ],
  },
  {
    titulo: "O PRIMO",
    quadros: [
      { bichos: [["pikachu", 24, { v: true }], ["raichu", 140]],
        falas: [[0, "VOCÊ É O MEU PRIMO?"], [1, "SOU VOCÊ COM UMA PEDRA DO TROVÃO."]] },
      { bichos: [["pikachu", 24, { v: true }], ["raichu", 140]],
        falas: [[0, "EU VOU FICAR LARANJA?!"]], fx: "treme" },
      { bichos: [["pikachu", 24, { v: true }], ["raichu", 140]],
        falas: [[1, "E O RABO VIRA UMA COLHER."]] },
    ],
  },
  {
    titulo: "QUAL É O VERDADEIRO",
    quadros: [
      { bichos: [["ditto", 24, { v: true }], ["glitnexy", 140]], falas: [[0, "OLHA O QUE EU SEI FAZER!"]] },
      { bichos: [["glitnexy", 24, { v: true }], ["glitnexy", 140]], falas: [[0, "GLIT! QUAL É O VERDADEIRO?"]], fx: "flash" },
      { legenda: "O TREINADOR TROUXE UM ESPETINHO", bichos: [["glitnexy", 24, { v: true }], ["glitnexy", 140]],
        falas: [[0, "GLIT!"], [1, "GLIT!"]] },
      { bichos: [["ditto", 24, { v: true }], ["glitnexy", 140]],
        falas: [[0, "...EU NÃO SEI ASSAR ESPETINHO NO WI-FI."]] },
    ],
  },
  {
    titulo: "NÚMERO ZERO",
    quadros: [
      { bichos: [["porygon", 24, { v: true }], ["missingno", 140]],
        falas: [[0, "QUAL É O SEU NÚMERO NA POKÉDEX?"], [1, "0."]] },
      { bichos: [["porygon", 24, { v: true }], ["missingno", 140]],
        falas: [[0, "E O SEU TIPO?"], [1, "SIM."]] },
      { bichos: [["porygon", 24, { v: true }], ["missingno", 140]],
        falas: [[0, "ERRO! ERRO! ERRO!"]], fx: "treme" },
    ],
  },
  {
    titulo: "DOR DE CABEÇA",
    quadros: [
      { bichos: [["psyduck", 24, { v: true }], ["glitnexy", 140]],
        falas: [[0, "AI... WI-FI ME DÁ DOR DE CABEÇA."], [1, "GLIT?"]] },
      { legenda: "O GLITNEXY DESLIGOU O WI-FI", bichos: [["psyduck", 24, { v: true }], ["glitnexy", 140]] },
      { bichos: [["psyduck", 24, { v: true }], ["glitnexy", 140]],
        falas: [[0, "...AGORA DÓI DE TÉDIO."]] },
    ],
  },
  {
    titulo: "ÓCULOS NOVOS",
    quadros: [
      { bichos: [["@vitor", 20, { v: true }], ["sableye", 140]],
        falas: [[0, "OLHA OS MEUS ÓCULOS NOVOS!"], [1, "OOOH. BRILHANTE."]] },
      { legenda: "NHAC", bichos: [["@vitor", 20, { v: true }], ["sableye", 140]], fx: "flash" },
      { bichos: [["@vitor", 20, { v: true }], ["sableye", 140]],
        falas: [[0, "...EU NÃO ENXERGO NADA."], [1, "TÁ CROCANTE."]] },
    ],
  },
  {
    titulo: "BALÃO",
    quadros: [
      { bichos: [["drifloon", 24, { v: true }], ["@andre", 130]],
        falas: [[0, "QUER BRINCAR?"], [1, "QUERO!"]] },
      { legenda: "O DRIFLOON SEGUROU A MÃO DO ANDRÉ", bichos: [["drifloon", 60, { dy: -30 }], ["@andre", 130, { dy: -20 }]] },
      { legenda: "NA KANTO DISTORCIDA, BALÃO CAI PRA CIMA", bichos: [["@andre", 80, { vc: true, dy: -8 }]],
        falas: [[0, "SOCORRO! TÔ CAINDO PRO CÉU!"]], colunas: 28, fx: "treme" },
    ],
  },
  {
    titulo: "O CONCURSO",
    quadros: [
      { legenda: "CONCURSO DE QUEM COME MAIS", bichos: [["guzzlord", 4, { v: true, s: 90 }], ["glitnexy", 150]],
        falas: [[0, "GRUM!"], [1, "GLIT!"]] },
      { legenda: "O BOCÃO COMEU 300 ESPETINHOS", bichos: [["guzzlord", 4, { v: true, s: 90 }], ["glitnexy", 150]], fx: "treme" },
      { legenda: "O GLITNEXY COMEU 301. E O TROFÉU.", bichos: [["guzzlord", 4, { v: true, s: 90 }], ["glitnexy", 150]],
        falas: [[0, "GRUM..."], [1, "GLIT."]] },
    ],
  },
  {
    titulo: "ATRASADO",
    quadros: [
      { legenda: "O CONVITE DA FESTA DE UM ANO", bichos: [["slowpoke", 80]], falas: [[0, "OBA. FESTA."]] },
      { legenda: "UM ANO DEPOIS", bichos: [["slowpoke", 80]], falas: [[0, "...CHEGUEI. CADÊ O BOLO?"]] },
      { legenda: "ERA A FESTA DE DOIS ANOS", bichos: [["slowpoke", 80]], falas: [[0, "...ENTÃO EU TÔ ADIANTADO?"]] },
    ],
  },
  {
    titulo: "PATO NA PANELA 2",
    quadros: [
      { bichos: [["farfetchd", 24, { v: true }], ["charmander", 140]],
        falas: [[0, "VOCÊ DE NOVO?!"], [1, "EU SÓ QUERIA ASSAR UM ESPETINHO!"]] },
      { legenda: "O CHARMANDER ASSOU O ESPETINHO", bichos: [["farfetchd", 24, { v: true }], ["charmander", 140]],
        fogo: [[120, 112], [130, 112], [125, 108]] },
      { bichos: [["farfetchd", 24, { v: true }], ["charmander", 140]],
        falas: [[0, "...ME DÁ UM PEDAÇO?"], [1, "TEM ALHO-PORÓ."]] },
    ],
  },
  {
    titulo: "O HOOPA VOLTOU",
    quadros: [
      { legenda: "O HOOPA VOLTOU DO HIPERESPAÇO", bichos: [["hoopa", 24, { v: true }], ["glitnexy", 140]],
        falas: [[0, "TROUXE OUTRO DONUT!"], [1, "GLIT GLIT."]] },
      { bichos: [["hoopa", 24, { v: true }], ["glitnexy", 140]],
        falas: [[0, "ESSE É DE BERRY!"], [1, "...GLIT?"]] },
      { bichos: [["hoopa", 24, { v: true }], ["glitnexy", 140]], falas: [[1, "NHAC!"]], fx: "flash" },
      { legenda: "QUEM COME DONUT VAI PRO HIPERESPAÇO", bichos: [["hoopa", 24, { v: true }]],
        falas: [[0, "...AGORA QUEM SUMIU FOI ELE."]] },
    ],
  },
  {
    titulo: "POSE",
    quadros: [
      { bichos: [["@vitor", 20, { v: true }], ["giratina", 120, { s: 90 }]],
        falas: [[0, "GIRATINA, FAZ POSE PRO DESENHO!"]] },
      { bichos: [["@vitor", 20, { v: true }], ["giratina", 120, { s: 90, vc: true }]],
        falas: [[0, "NÃO! DO OUTRO JEITO!"]], fx: "treme" },
      { bichos: [["@vitor", 20, { v: true }], ["giratina", 120, { s: 90 }]],
        falas: [[0, "AGORA SIM!"]] },
      { legenda: "NA KANTO DISTORCIDA", bichos: [["@vitor", 20, { v: true, vc: true, dy: -8 }], ["giratina", 120, { s: 90 }]],
        falas: [[0, "...POR QUE EU FIQUEI DE CABEÇA PRA BAIXO?"]], colunas: 22 },
    ],
  },
  {
    titulo: "NÍVEL 119",
    quadros: [
      { legenda: "NA FENDA, O MAGIKARP FICOU NÍVEL 119", bichos: [["magikarp", 80]],
        falas: [[0, "AGORA EU SOU O MAIS FORTE!"]] },
      { legenda: "SPLASH!", bichos: [["magikarp", 80, { dy: -20 }]], fx: "treme" },
      { legenda: "NÃO ACONTECEU NADA", bichos: [["magikarp", 80]],
        falas: [[0, "...NEM COM CEM NÍVEIS?"]] },
    ],
  },
  {
    titulo: "O FANTASMA DO LAB",
    quadros: [
      { bichos: [["@andre", 20, { v: true }], ["gastly", 140]],
        falas: [[0, "ESSE LAB TEM FANTASMA?"], [1, "NÃO."]] },
      { bichos: [["@andre", 20, { v: true }], ["gastly", 140]], falas: [[0, "AH, BOM."]] },
      { bichos: [["@andre", 20, { v: true }], ["gastly", 140]],
        falas: [[0, "...ESPERA. QUEM FALOU?"], [1, "NINGUÉM."]] },
      { bichos: [["@andre", 20, { v: true }], ["gastly", 140]],
        falas: [[0, "AAAAAAAH!"], [1, "KKKKK... COVARDE!"]], fx: "treme" },
      { bichos: [["missingno", 24], ["gastly", 140]],
        falas: [[0, "BO0!"], [1, "AAAAAAAAAAAAAH!"]], fx: "treme" },
    ],
  },
];

// ------------------------------------------------------------ o estado
let cartao = null;                 // a tela preta com texto: { linhas, ate }
const mostrar = (linhas, ms = 4500) => { cartao = { linhas, ate: Date.now() + ms, ms }; };
let aviso = null;                  // uma faixa no alto da tela: { texto, ate }
const avisar = (texto, ms = 4000) => { aviso = { texto, ate: Date.now() + ms }; };
// estar lá é o que conta (os chefes aparecem); o empréstimo é do espetinho
const naExtrema = (st) => capitulo(st?.player?.map) >= 0;

/** As marcas da história que não se gravam por conta própria: elas são lidas
 *  do save (missões, quem foi vencido) a cada quadro, e os NPCs aparecem e
 *  somem por `comFlag`/`someComFlag`. */
function marcar(st) {
  const f = st?.flags;
  if (!f) return;
  if (!f.gdeUmAno) {
    if (!f.caughtMissingno && !f.bragCampeao) return;      // basta UMA das histórias
    f.gdeUmAno = true;
    mostrar(TXT.cartaoInicio);
  }
  // o caderno do VÍTOR abre nas tirinhas de um ano depois (uma vez só)
  const lista = DB.TIRINHAS?.lista || [];
  const primeira = lista.findIndex((t) => t.titulo === TIRINHAS[0].titulo);
  if (!f.gdeTirinhas && primeira >= 0) { f.gdeTirinhas = true; st.tirinhaVitor = primeira; }
  const r = R(st);
  f.gde_k = r === "k";
  f.gde_b = r === "b";
  const festa = estadoMissao(st, `gde_${r}_festa`);
  f[`gde_${r}_festa`] = !!festa;
  if (f[`gde_${r}_passado`] && !f.gdeFundida) {
    f.gdeFundida = true;
    Glitch.hit(2);
    mostrar(TXT.cartaoFundiu, 6000);
  }
  f[`gde_${r}_fundiu`] = !!f.gdeFundida;      // a festa acaba quando os mundos se fundem
  f.gdeNaExtrema = naExtrema(st);
  // o PRESENTE do professor: dez ORAN e dez CHESTO, pra quem aceitou o pedido
  // da fenda (inclusive quem aceitou antes deste presente existir)
  if (estadoMissao(st, `gde_${r}_extrema`) && !f.gdeBerries) {
    f.gdeBerries = true;
    for (const [item, n] of PRESENTE) st.items[item] = Math.min(999, (st.items[item] || 0) + n);
    Audio2.heal();
    avisar(TXT.presente(r === "k" ? "A PROFA. IPÊ" : "O PROF. CARVALHO"));
  }
  // os SEIS CHEFES: vencer uma vez já conta; pego, não volta mais
  const meus = [...(st.party || []), ...todosGuardados(st)];
  // o ROTEADOR EXTREMO 999G: chega junto com o primeiro GLITNEXY que é seu
  if (!f.gdeRoteador && meus.some((m) => m && (m.megaDe || m.species) === "glitnexy")) {
    f.gdeRoteador = true;
    st.items[ROTEADOR] = 1;
    Audio2.heal();
    avisar(TXT.roteador, 6000);
  }
  for (const c of CHEFES) {
    if (venceu(st, `gde_chefe_${c.id}`)) f[`gdeChefe_${c.id}`] = true;
    if (!f[`gdePego_${c.id}`] && meus.some((m) => m?.gdeChefe === c.id)) f[`gdePego_${c.id}`] = true;
  }
  // UM POR CAPÍTULO: o chefe da vez mora no capítulo dele; os que caíram
  // sem ser pegos esperam no capítulo de agora, pra quem quiser capturar
  const n = vencidos(st);
  CHEFES.forEach((c, i) => { f[`gdeMostra_${c.id}`] = f.gdeNaExtrema && i <= n && !f[`gdePego_${c.id}`]; });
  if (n > (f.gdeAvisados || 0)) f.gdeAvisados = n;
  if (n >= CHEFES.length) f.gdeChefes = true;   // o cartão sai no puxão do professor
  f.gdeGiratinaAparece = f.gdeNaExtrema && !!f.gdeChefes;
  if (venceu(st, "gde_giratina") && !f.gdeLivre) {
    f.gdeLivre = true;
  }
  if (!f.gdeGiratinaPego && meus.some((m) => m?.gdeLiberto || m?.gdeChefe === "giratina")) {
    f.gdeGiratinaPego = true;
  }
  if (f.gdeLivre && estadoMissao(st, `gde_${r}_extrema`) === "feita" && !f.gdeFimVisto) {
    f.gdeFimVisto = true;
    mostrar(TXT.cartaoFim, 6000);
  }
}

/** A equipe ganha os níveis do espetinho (uma vez por viagem). */
function emprestar(st) {
  const e = st.extrema;
  if (!e || e.aplicado) return;
  e.aplicado = true;
  for (const mon of st.party || []) {
    if (mon.nivelEmprestado) continue;
    const cheio = mon.hp / Math.max(1, mon.maxHp);
    mon.nivelEmprestado = e.bonus;
    mon.level += e.bonus;
    recalc(mon);
    mon.hp = mon.hp > 0 ? Math.max(1, Math.round(mon.maxHp * cheio)) : 0;
  }
  // os PODERES e a FORÇA: "pedras" na mochila enquanto durar
  const esp = espetinho((e.berries || []).map(daBerry).filter(Boolean), e.tempero || null);
  for (const b of esp.tipos) st.items[itemDoPoder(b)] = 1;
  st.items[FORCA.item] = 1;
  Glitch.hit(1.5);
  Audio2.glitch?.();
  mostrar(TXT.cartaoEntrou(esp), 5000);
}

/** ...e devolve quando sai (pelo portal, apagando, voltando pro Centro). A XP
 *  que juntou fica: o nível de verdade sobe na próxima batalha. */
function devolver(st) {
  for (const mon of [...(st.party || []), ...todosGuardados(st)]) {
    if (!mon?.nivelEmprestado) continue;
    const cheio = mon.hp / Math.max(1, mon.maxHp);
    mon.level -= mon.nivelEmprestado;
    delete mon.nivelEmprestado;
    recalc(mon);
    mon.hp = mon.hp > 0 ? Math.max(1, Math.round(mon.maxHp * cheio)) : 0;
  }
  for (const b of BERRIES) delete st.items[itemDoPoder(b)];
  delete st.items[FORCA.item];
  st.extrema = null;
}

function cuidar(st) {
  marcar(st);
  if (naExtrema(st)) emprestar(st);
  // fora dela, devolve — mas só o que foi emprestado: entre dar o espetinho e
  // chegar lá, o `st.extrema` já existe e ainda não valeu nada
  else if (st?.extrema?.aplicado || (st?.party || []).some((m) => m?.nivelEmprestado)
           || st?.items?.[FORCA.item]) devolver(st);
  // a FORÇA vale o que o espetinho desta viagem vale (e 1 fora dela)
  const a = st?.extrema?.atributos || 1;
  for (const k of Object.keys(FORCA.atributo)) FORCA.atributo[k] = a;
  // a viagem acabou por um caminho que não passa pelo vão (desmaiar na
  // batalha te leva pro Centro): a missão da fenda não fica pendurada. Só
  // DEPOIS de ter chegado lá — durante o escuro da ida você ainda está no
  // laboratório, e limpar ali cancelava a viagem antes de ela começar
  if (st?.mission?.extrema && naExtrema(st)) st.mission.chegou = true;
  if (st?.mission?.extrema && st.mission.chegou && !naExtrema(st)) {
    st.mission = null;
    if (!st.flags?.glitchWorld) { Glitch.forced = false; Glitch.burst = 0; }
  }
}

/** O PUXÃO: você está num capítulo que já acabou (o chefe dele caiu) — a
 *  fenda está virando o próximo, e o CARVALHO te tira de lá antes. Espera a
 *  batalha e as falas terminarem (só roda com o mapa na frente, parado). */
let puxando = false;
function puxar(st, cena) {
  const i = capitulo(st?.player?.map);
  if (i < 0 || puxando || !cena?.dlg || cena.game?.scenes?.top !== cena) return;
  const novo = capituloDaVez(st);
  if (i >= capitulo(novo.id)) return;                // a fenda ainda é esta
  if (cena.dlg.active || cena.fx || cena.fadeDir || cena.pending || cena.menu) return;
  puxando = true;
  Glitch.hit(2.5);
  Audio2.glitch?.();
  cena.dlg.say(TXT.puxao, () => {
    cena.transition(() => {
      const back = st.mission?.back || { map: LAB[R(st)], x: 6, y: 11, dir: "up" };
      Object.assign(st.player, back);
      st.mission = null;
      if (!st.flags?.glitchWorld) { Glitch.forced = false; Glitch.burst = 0; }
      cena.justWarped = true;
      cena.afterTravel();
      cena.game.autosave?.(true);
      puxando = false;
      const ultimo = capitulo(novo.id) === CAPITULOS.length - 1;
      mostrar(ultimo ? TXT.cartaoChefes : TXT.cartaoMudou(novo.nome), 4500);
      cena.dlg.say(TXT.puxado(novo.nome, ultimo));
    });
  });
}

// ------------------------------------------------------------ a KANTO DISTORCIDA
/** O chão livre (chão ou mato) mais perto de (x0, y0), em anéis. */
function chaoPerto(geo, x0, y0, usados = new Set()) {
  for (let r = 0; r < 12; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const x = x0 + dx, y = y0 + dy;
        if (x < 0 || y < 0 || x >= geo.w || y >= geo.h || usados.has(`${x},${y}`)) continue;
        if ("02".includes(geo.tags[y * geo.w + x])) return { x, y };
      }
    }
  }
  return { x: x0, y: y0 };
}

/** O chão de onde dá pra andar (chão ou mato; barranco é mão única e fica
 *  de fora), a partir de (x, y): a distância de cada tile, em passos. */
function andaveis(geo, x, y) {
  const dist = new Map([[`${x},${y}`, 0]]);
  const fila = [[x, y]];
  while (fila.length) {
    const [cx, cy] = fila.shift();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = cx + dx, ny = cy + dy, k = `${nx},${ny}`;
      if (nx < 0 || ny < 0 || nx >= geo.w || ny >= geo.h || dist.has(k)) continue;
      if (!"02".includes(geo.tags[ny * geo.w + nx])) continue;
      dist.set(k, dist.get(`${cx},${cy}`) + 1);
      fila.push([nx, ny]);
    }
  }
  return dist;
}

/** A geometria de um capítulo: a fonte virada de cabeça pra baixo. O que era
 *  em cima fica embaixo — e os barrancos que pulavam pra baixo pulam pra cima
 *  (tag 4 vira 7: src/data/maps.js `LEDGE_DIR`). Sem portas e sem conexões:
 *  daqui só se sai pelo vão, pelo relógio da fenda... ou pelo professor.
 *  Chega-se no maior pedaço de chão, na ponta de cima; o chefe fica na ponta
 *  mais longe dela (`cap.longe`, os tiles em ordem de distância). */
function montarCapitulo(cap) {
  const g = DB.KANTO[cap.fonte];
  if (!g) return;
  const w = g.w;
  const linhas = [];
  for (let y = 0; y < g.h; y++) linhas.push(g.tags.slice(y * w, (y + 1) * w));
  linhas.reverse();
  const tags = linhas.join("").replace(/[47]/g, (c) => (c === "4" ? "7" : "4"));
  const geo = DB.KANTO[cap.id] = { w, h: linhas.length, tags, warps: [], connections: [], signs: [], objects: [] };
  // o maior pedaço de chão (uma ilha de mato fechada não serve de chegada)
  const visto = new Set();
  let maior = null;
  for (let y = 0; y < geo.h; y++) {
    for (let x = 0; x < w; x++) {
      if (visto.has(`${x},${y}`) || !"02".includes(tags[y * w + x])) continue;
      const d = andaveis(geo, x, y);
      for (const k of d.keys()) visto.add(k);
      if (!maior || d.size > maior.size) maior = d;
    }
  }
  if (!maior) return;
  // a chegada: o chão mais de cima (de preferência chão, não mato), no meio
  const pts = [...maior.keys()].map((k) => k.split(",").map(Number));
  const nota = ([x, y]) => y * 4 + Math.abs(x - w / 2) / 4 + (tags[y * w + x] === "2" ? 6 : 0);
  const [sx, sy] = pts.reduce((a, b) => (nota(b) < nota(a) ? b : a));
  const dist = andaveis(geo, sx, sy);
  cap.longe = [...dist.entries()].sort((a, b) => b[1] - a[1]).map(([k]) => k.split(",").map(Number));
  cap.spawn = { x: sx, y: sy, dir: "down" };
  DB.MAPS[cap.id] = {
    // a música: a caixinha de música quebrada (src/data/music.js, `glitchdimExtrema`)
    name: cap.nome, music: DB.MUSIC?.glitchdimExtrema ? "glitchdimExtrema" : "cave", interior: false, fenda: true, npcs: [],
    encounters: [...(DB.MAPS[cap.fonte]?.encounters || []), ...DISTORCIDOS.filter((e) => DB.SPECIES[e.id])],
    lockedWarps: {}, signs: {}, spawn: cap.spawn,
  };
  arteDistorcida(cap);
}

/** O desenho: o PNG da fonte virado de cabeça pra baixo, com as cores do
 *  Mundo Distorcido (o verde vira roxo, o céu vira breu) e umas fatias
 *  deslocadas. Feito uma vez e guardado no SpriteStore — o `in` é o que
 *  impede o mapArt de procurar assets/maps/kanto_distorcida_N.png. */
function arteDistorcida(cap) {
  if (cap.id in SpriteStore.maps) return;
  SpriteStore.maps[cap.id] = null;
  SpriteStore.maps[cap.id + "_over"] = null;
  const geo = DB.KANTO[cap.id];
  const montar = (img) => {
    const { cv, ctx } = makeCanvas(geo.w * TILE, geo.h * TILE);
    ctx.save();
    ctx.translate(0, cv.height);
    ctx.scale(1, -1);                                   // de cabeça pra baixo
    ctx.drawImage(img, 0, 0);
    ctx.restore();
    const d = ctx.getImageData(0, 0, cv.width, cv.height), px = d.data;
    for (let i = 0; i < px.length; i += 4) {
      const r = px[i], g = px[i + 1], b = px[i + 2];
      px[i] = Math.min(255, 0.35 * r + 0.55 * (255 - g) * 0.8);  // o verde vira roxo
      px[i + 1] = Math.min(255, 0.25 * g + 0.15 * b);
      px[i + 2] = Math.min(255, 0.45 * b + 0.5 * (255 - r) * 0.7 + 30);
    }
    ctx.putImageData(d, 0, 0);
    return { cv, ctx };
  };
  const pede = (over) => loadImage(url(arquivoMapa(cap.fonte, over)));
  pede(false).then((img) => {
    if (!img) return;
    const { cv, ctx } = montar(img);
    let s = 7 + capitulo(cap.id);
    const rnd = (n) => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s % n; };
    for (let i = 0; i < geo.h * 1.5; i++) {               // os rasgos
      const yy = rnd(cv.height), hh = 1 + rnd(3);
      ctx.drawImage(cv, 0, yy, cv.width, hh, rnd(12) - 6, yy, cv.width, hh);
    }
    SpriteStore.maps[cap.id] = cv;
  });
  pede(true).then((img) => { if (img) SpriteStore.maps[cap.id + "_over"] = montar(img).cv; });
}

// ------------------------------------------------------------ os NPCs
function por(mapa, npc) {
  const m = DB.MAPS[mapa];
  if (!m) return console.warn(`[dlc extrema] mapa "${mapa}" não existe`);
  m.npcs = [...(m.npcs || []).filter((n) => n.id !== npc.id), { dir: "down", lines: [], ...npc }];
  return m.npcs[m.npcs.length - 1];
}

/** um treinador cujo time é montado na hora (o save só existe no jogo) */
function timeNaHora(npc, montar) {
  const base = npc.trainer;
  npc.trainer = {
    ...base,
    get party() { return montar(eu()); },
  };
  return npc;
}

function npcsDaHistoria() {
  // a CARTEIRA: as duas missões da festa, uma depois da outra (mesmo tile)
  for (const r of ["k", "b"]) {
    const c = CARTEIRA[r];
    por(c.mapa, { id: `missao_gde_${r}_convite`, x: c.x, y: c.y, dir: r === "k" ? "left" : "left",
                  sprite: "garota", missao: `gde_${r}_convite`, comFlag: `gde_${r}`, lines: T[r].convite.oferta });
  }

  // KANTO: o AZUL na frente da casa dele, em PALLET (some na festa, volta depois)
  const azul = (id, extra) => timeNaHora({
    id, x: 17, y: 8, dir: "left", sprite: "rival", lines: TXT.azul.antes, afterLines: TXT.azul.depois,
    trainer: { name: "AZUL", prize: 9000, sprite: "rival", sight: 0 },
    ...extra,
  }, (st) => montarTime(st, { time: AZUL_TIME }));
  por("pallet", azul("gde_azul", {
    comFlag: "gde_k", someComFlag: "gde_k_festa",
    conta: { missao: "gde_k_convite", flag: "gde_k_convidou", lines: TXT.azul.conta },
  }));
  por("pallet", { id: "gde_azul_fim", x: 17, y: 8, dir: "left", sprite: "rival",
                  comFlag: "gde_k_fundiu", lines: TXT.azul.fim });

  // BRAGLITCH: o VÍTOR e o ANDRÉ no píer, com a lancha
  por("sao_lucario", {
    id: "gde_vitor", x: 16, y: 20, dir: "down", sprite: "vitor", comFlag: "gde_b", someComFlag: "gde_b_festa",
    lines: TXT.vitor.antes, afterLines: TXT.vitor.depois,
    trainer: { name: "VÍTOR", prize: 7000, sprite: "vitor", sight: 0,
               party: VITOR_TIME.map(([id, lvl]) => ({ id, lvl })) },
    conta: { missao: "gde_b_convite", flag: "gde_b_convidou", lines: TXT.vitor.conta },
  });
  por("sao_lucario", { id: "gde_andre", x: 18, y: 20, dir: "down", sprite: "andre",
                       comFlag: "gde_b", someComFlag: "gde_b_festa", lines: TXT.andre.antes });
  por("sao_lucario", { id: "gde_vitor_fim", x: 16, y: 20, dir: "down", sprite: "vitor", comFlag: "gde_b_fundiu", lines: TXT.vitor.fim, tirinhas: true });
  por("sao_lucario", { id: "gde_andre_fim", x: 18, y: 20, dir: "down", sprite: "andre", comFlag: "gde_b_fundiu", lines: TXT.andre.fim });

  // A FESTA: quem está em cada laboratório enquanto ela dura
  const festa = (r) => ({ comFlag: `gde_${r}_festa`, someComFlag: `gde_${r}_fundiu` });
  por("lab", { id: "gde_ipe", x: 8, y: 3, sprite: "ipe", lines: TXT.ipe.festa, ...festa("k") });
  por("lab", { id: "gde_azul_festa", x: 4, y: 6, dir: "right", sprite: "rival", lines: TXT.azul.festa, ...festa("k") });
  por("bra_lab", { id: "gde_ipe", x: 6, y: 3, sprite: "ipe", lines: TXT.ipe.festa.slice(1), ...festa("b") });
  por("bra_lab", { id: "gde_carvalho", x: 8, y: 3, sprite: "prof", lines: TXT.carvalho.festa, ...festa("b") });
  por("bra_lab", { id: "gde_vitor_festa", x: 4, y: 6, dir: "right", sprite: "vitor", lines: TXT.vitor.festa, tirinhas: true, ...festa("b") });
  por("bra_lab", { id: "gde_andre_festa", x: 9, y: 6, dir: "left", sprite: "andre", lines: TXT.andre.festa, ...festa("b") });

  // VOCÊ DE UM ANO ATRÁS: a sua cara, o seu inicial no nível 5
  for (const r of ["k", "b"]) {
    const [saiu, saiu2] = TXT.passado.saiu[r];
    const npc = por(LAB[r], {
      id: "gde_passado", x: 3, y: 5, dir: "down", comFlag: `gde_${r}_festa`, someComFlag: `gde_${r}_passado`,
      lines: TXT.passado.antes.map((l) => l.replace("{SAIU}", saiu)), afterLines: TXT.passado.depois,
      conta: { missao: `gde_${r}_festa`, flag: `gde_${r}_passado`,
               lines: [...TXT.passado.depois, ...TXT.passado.conta.map((l) => l.replace("{SAIU2}", saiu2)
                 .replace("{PROF1}", TXT.passado.profs[r][0]).replace("{PROF2}", TXT.passado.profs[r][1]))] },
      trainer: { prize: 5, sight: 0 },
    });
    Object.defineProperty(npc, "sprite", { get: () => spriteDoJogador(eu()), enumerable: true, configurable: true });
    npc.trainer = {
      prize: 5, sight: 0,
      get name() { return `${eu()?.player?.name || "VOCÊ"} (1 ANO ATRÁS)`; },
      get sprite() { return spriteDoJogador(eu()); },
      get party() { return [{ id: inicialDoJogador(eu()), lvl: 5 }]; },
    };
  }

  // O PÓS-GAME: o professor que ficou, com o pedido da fenda; e o GLITNEXY
  por("lab", { id: "missao_gde_k_extrema", x: 8, y: 3, sprite: "ipe", missao: "gde_k_extrema",
               comFlag: "gde_k_fundiu", lines: T.extrema.oferta });
  por("bra_lab", { id: "missao_gde_b_extrema", x: 8, y: 3, sprite: "prof", missao: "gde_b_extrema",
                   comFlag: "gde_b_fundiu", lines: T.extrema.oferta });
  for (const r of ["k", "b"]) {
    por(LAB[r], { id: "gde_glitnexy", x: 3, y: 5, dir: "down", sprite: "mon:glitnexy",
                  comFlag: "gdeFundida", aoFalar: falarGlitnexy });
    // o PRIMO: shiny, do lado dele, depois que o GIRATINA fica livre
    const geo = DB.KANTO[LAB[r]];
    const p = geo ? chaoPerto(geo, 4, 5, new Set(["3,5"])) : { x: 4, y: 5 };
    por(LAB[r], { id: "gde_primo", ...p, dir: "down", sprite: "mon:glitnexy:shiny",
                  comFlag: "gdeLivre", someComFlag: "gdePrimoPego", aoFalar: falarPrimo });
  }

  // OS CAPÍTULOS: em cada um, o vão de volta (do lado da chegada), o chefe
  // dele no ponto mais longe, e os chefes de antes (se caíram sem ser pegos,
  // esperam no capítulo de agora, no meio do caminho); no último, o GIRATINA
  CAPITULOS.forEach((cap, i) => {
    if (!DB.MAPS[cap.id] || !cap.longe?.length) return;
    const sp = cap.spawn, L = cap.longe;
    const usados = new Set([`${sp.x},${sp.y}`]);
    const lugar = ([x, y]) => { const p = chaoPerto(DB.KANTO[cap.id], x, y, usados); usados.add(`${p.x},${p.y}`); return p; };
    por(cap.id, { id: "gde_vao", ...lugar([sp.x - 1, sp.y]), sprite: "portal", portal: true });
    const chefe = (c, ponto, extra = {}) => por(cap.id, {
      id: `gde_chefe_${c.id}`, ...lugar(ponto), dir: "up", sprite: `mon:${c.id}`,
      comFlag: `gdeMostra_${c.id}`, sumirDepois: true, aoFalar: falarChefe,
      chefe: { id: c.id, lvl: c.lvl, antes: c.antes, pego: TXT.chefePego, ...extra } });
    if (CHEFES[i]) chefe(CHEFES[i], L[0]);
    CHEFES.slice(0, i).forEach((c, j) => chefe(c, L[Math.floor(L.length * (0.35 + 0.08 * j))] || L[0]));
    if (i === CAPITULOS.length - 1) {
      por(cap.id, { id: "gde_giratina", ...lugar(L[0]), dir: "up", sprite: "mon:giratina",
                    comFlag: "gdeGiratinaAparece", sumirDepois: true, aoFalar: falarChefe,
                    chefe: { id: "giratina", lvl: 170, corrupt: true, antes: TXT.giratina.antes, pego: TXT.giratina.pego } });
    }
  });
}

function missoes() {
  const out = [];
  for (const r of ["k", "b"]) {
    const c = CARTEIRA[r];
    out.push({
      id: `gde_${r}_convite`, nome: "O CONVITE", mapa: c.mapa, x: c.x, y: c.y, sprite: "garota",
      requer: { flag: `gde_${r}` }, objetivo: { tipo: "bandeira", flag: `gde_${r}_convidou` },
      ...T[r].convite, premio: { dinheiro: 5000 },
    });
    out.push({
      id: `gde_${r}_festa`, nome: "A FESTA DE UM ANO", mapa: c.mapa, x: c.x, y: c.y, sprite: "garota",
      requer: { missao: `gde_${r}_convite` }, objetivo: { tipo: "bandeira", flag: `gde_${r}_passado` },
      ...T[r].festa, premio: { dinheiro: 10000, item: "foto de um ano", qtd: 1 },
    });
    out.push({
      id: `gde_${r}_extrema`, nome: "GLITCH DIMENSION EXTREMA", mapa: LAB[r], x: 8, y: 3,
      sprite: r === "k" ? "ipe" : "prof",
      requer: { flag: `gde_${r}_fundiu` }, objetivo: { tipo: "bandeira", flag: "gdeLivre" },
      ...T.extrema, premio: { dinheiro: 30000, item: "doce raro", qtd: 10 },
    });
  }
  return out;
}

/** O OBJETIVO no canto da tela (src/systems/objetivo.js), enquanto a
 *  história do pacote anda. Acabou, devolve null e a região volta a falar. */
function objetivo(st) {
  const f = st?.flags;
  if (!f?.gdeUmAno) return null;
  const r = R(st), e = (id) => estadoMissao(st, `gde_${r}_${id}`);
  const onde = r === "k" ? "NA CIDADE DE PALLET" : "EM SÃO LUCARIO DO SUL";
  if (e("convite") === "ativa") return r === "k"
    ? "LEVE O CONVITE DA FESTA PRO AZUL, NA FRENTE DA CASA DELE EM PALLET."
    : "LEVE O CONVITE DA FESTA PRO VÍTOR E O ANDRÉ, NO PÍER DE SÃO LUCARIO.";
  if (e("convite") !== "feita") return `UM ANO DEPOIS... A CARTEIRA TEM UMA CARTA PRA VOCÊ, ${onde}.`;
  if (!f[`gde_${r}_fundiu`]) return e("festa")
    ? `A FESTA DE UM ANO É NO ${r === "k" ? "LAB DO PROF. CARVALHO" : "LAB DA PROFA. IPÊ"}.`
    : `VOLTE À CARTEIRA, ${onde}.`;
  const x = e("extrema");
  if (!x) return `FALE COM ${r === "k" ? "A PROFA. IPÊ" : "O PROF. CARVALHO"} NO LABORATÓRIO.`;
  if (x === "feita") return f.gdePrimoPego ? null : "UM GLITNEXY BRILHANTE TE ESPERA NO LABORATÓRIO.";
  if (f.gdeLivre) return "O GIRATINA ESTÁ LIVRE! VOLTE AO LABORATÓRIO.";
  const cap = capituloDaVez(st), chefe = CHEFES[vencidos(st)];
  if (naExtrema(st)) return f.gdeChefes
    ? "O FUNDO DA FENDA: LIBERTE O GIRATINA, NO PONTO MAIS LONGE."
    : `${cap.nome}: VENÇA O ${DB.SPECIES[chefe.id]?.name || chefe.id}, NO PONTO MAIS LONGE (${vencidos(st)}/${CHEFES.length}).`;
  return `A FENDA AGORA É ${cap.nome}. LEVE TRÊS BERRIES AO GLITNEXY PRA IR.`;
}

// ------------------------------------------------------------ as conversas
const POR_PAGINA = 5;
function falarGlitnexy(cena) {
  const st = cena.st, G = TXT.glitnexy;
  const total = BERRIES.reduce((n, b) => n + (st.items?.[b.berry] || 0), 0);
  if (total < POR_ESPETINHO) return void cena.dlg.say(G.semComida);
  // as berries do espetinho, uma de cada vez (repetir pode; o que você não tem, não aparece)
  const escolhidas = [];
  const resta = (b) => (st.items?.[b.berry] || 0) - escolhidas.filter((x) => x === b).length;
  const gasta = (item) => { st.items[item] -= 1; if (!st.items[item]) delete st.items[item]; };
  const fazer = (tempero) => {
    for (const b of escolhidas) gasta(b.berry);
    if (tempero) gasta(tempero);
    const e = espetinho(escolhidas, tempero);
    st.extrema = { bonus: e.niveis, atributos: e.atributos, berries: e.berries, tempero, aplicado: false };
    Audio2.heal();
    cena.dlg.say(G.comeu(e), () => irPraDistorcida(cena, e.minutos * 60));
  };
  // o TEMPERO: um ingrediente de sanduíche que você tenha, ou nenhum
  const temperar = (pagina = 0) => {
    const tem = Object.keys(INGREDIENTES).filter((i) => (st.items?.[i] || 0) > 0);
    if (!tem.length) return fazer(null);
    const daqui = tem.slice(pagina * POR_PAGINA, (pagina + 1) * POR_PAGINA);
    const mais = tem.length > POR_PAGINA;
    const opcoes = [...daqui.map((i) => i.toUpperCase()), ...(mais ? ["MAIS..."] : []), G.semTempero];
    cena.dlg.ask(G.tempero, opcoes, (i) => {
      if (i < daqui.length) return fazer(daqui[i]);
      if (mais && i === daqui.length) return temperar((pagina + 1) * POR_PAGINA >= tem.length ? 0 : pagina + 1);
      fazer(null);
    });
  };
  // a pergunta tem PÁGINAS: com vinte berries a caixa não caberia na tela
  const pedir = (pagina = 0) => {
    if (escolhidas.length >= POR_ESPETINHO) return temperar();
    const tem = BERRIES.filter((b) => resta(b) > 0);
    const daqui = tem.slice(pagina * POR_PAGINA, (pagina + 1) * POR_PAGINA);
    const mais = tem.length > POR_PAGINA;
    const opcoes = [...daqui.map((b) => `${curto(b)} x${resta(b)}`), ...(mais ? ["MAIS..."] : []), "NADA"];
    cena.dlg.ask(G.qual(escolhidas.length + 1), opcoes, (i) => {
      if (i < daqui.length) { escolhidas.push(daqui[i]); return pedir(); }
      // MAIS...: a próxima página (depois da última, volta pra primeira)
      if (mais && i === daqui.length) return pedir((pagina + 1) * POR_PAGINA >= tem.length ? 0 : pagina + 1);
      cena.dlg.say(G.nada);
    });
  };
  cena.dlg.say(G.cheirou, pedir);
}

/** A viagem: a mesma `mission` da fenda (o vão e o relógio FENDA a usam pra
 *  te devolver), só que pro capítulo da vez da KANTO DISTORCIDA. */
function irPraDistorcida(cena, segundos) {
  const st = cena.st, p = st.player;
  const cap = capituloDaVez(st);
  const sp = DB.MAPS[cap.id]?.spawn;
  if (!sp) return void cena.dlg.say("(A BOCONA DO GLITNEXY SE FECHOU. A FENDA NÃO ABRIU.)");
  st.mission = { n: 0, free: true, timed: true, left: segundos, extrema: true,
                 back: { map: p.map, x: p.x, y: p.y, dir: p.dir } };
  Glitch.forced = true;
  Glitch.hit(2);
  Audio2.glitch?.();
  cena.transition(() => {
    Object.assign(p, { map: cap.id, x: sp.x, y: sp.y, dir: sp.dir || "down" });
    cena.justWarped = true;
    cena.afterTravel();
    cena.game.autosave?.(true);
  });
}

/** O PRIMO do GLITNEXY (shiny): pede uma POKÉ BOLA e entra nela. Sem
 *  sorteio — ele QUER ir. É o único GLITNEXY que dá pra ter. */
const NIVEL_DO_PRIMO = 50;
function falarPrimo(cena) {
  const st = cena.st, P = TXT.primo;
  const bola = ["poké bola", "great ball", "ultra ball"].find((b) => (st.items?.[b] || 0) > 0);
  cena.dlg.say(P.oi, () => {
    if (!bola) return void cena.dlg.say(P.semBola);
    if (st.party.length >= 6 && cheio(st)) return void cena.dlg.say(P.semVaga);
    cena.dlg.ask(P.pergunta, P.opcoes, (i) => {
      if (i !== 0) return void cena.dlg.say(P.depois);
      st.items[bola] -= 1;
      if (st.items[bola] <= 0) delete st.items[bola];
      const mon = createMon("glitnexy", NIVEL_DO_PRIMO, { shiny: true });
      mon.gdePrimo = true;
      mon.bola = bola;
      let onde = P.equipe;
      if (st.party.length < 6) st.party.push(mon);
      else { guardar(st, mon); onde = P.pc; }
      st.seen.glitnexy = st.caught.glitnexy = true;
      st.flags.gdePrimoPego = true;
      Glitch.hit(1.5);
      Audio2.heal();
      cena.game.autosave?.(true);
      cena.dlg.say([...P.jogou(bola), onde]);
    });
  });
}

/** Os chefes da fenda (e o GIRATINA): a fala, e a batalha sem fuga. */
function falarChefe(cena, npc) {
  const st = cena.st, c = npc.chefe;
  const chave = `${st.player.map}.${npc.id}`;
  cena.dlg.say(c.antes, () => {
    Audio2.stopLoop();
    Audio2.tone(880, 0.08); Audio2.tone(660, 0.12);
    Glitch.hit(c.corrupt ? 2.5 : 1.5);
    const foe = createMon(c.id, c.lvl, { corrupt: !!c.corrupt });
    foe.gdeChefe = c.id;              // é assim que se sabe, depois, que foi ESTE que você pegou
    cena.fx = {
      t: 0,
      cb: () => cena.game.scenes.push(new BattleScene(), {
        foe, glitch: true, boss: true, npcKey: chave, falaCaptura: c.pego,
      }),
    };
  });
}

// ------------------------------------------------------------ apagar o progresso
/** Foi pego DENTRO do DLC? (os selvagens da KANTO DISTORCIDA levam `_extrema`
 *  do gancho `encontrar`; os chefes e o GIRATINA, `gdeChefe`) */
const doDlc = (m) => !!(m && (m._extrema || m.gdeChefe || m.gdeLiberto || m.gdePrimo));

/** APAGAR DLC (na tela de título, com o pacote ligado e um save gravado): a
 *  história volta pro "UM ANO DEPOIS...", e vão embora todas as berries e todo
 *  Pokémon pego no DLC. O resto da partida não muda. Devolve as falas. */
function apagarProgresso(st) {
  devolver(st);                                    // primeiro, os níveis emprestados
  let berries = 0, mons = 0;
  for (const k of Object.keys(st.items || {})) {
    if (daBerry(k)) berries += st.items[k];
    if (daBerry(k) || k.startsWith("poder da ") || k === FORCA.item || k === "foto de um ano" || k === ROTEADOR) delete st.items[k];
  }
  // os Pokémon: da equipe, das boxes (a vaga fica vazia) e da lista antiga
  const antes = st.party.length;
  st.party = st.party.filter((m) => !doDlc(m));
  mons += antes - st.party.length;
  for (const b of st.boxes || []) b.mons = (b.mons || []).map((m) => { if (doDlc(m)) { mons++; return null; } return m; });
  if (Array.isArray(st.box)) { const n = st.box.length; st.box = st.box.filter((m) => !doDlc(m)); mons += n - st.box.length; }
  // ninguém fica sem equipe: o primeiro do PC sobe
  if (!st.party.length) {
    for (const b of st.boxes || []) {
      const i = (b.mons || []).findIndex(Boolean);
      if (i >= 0) { st.party.push(b.mons[i]); b.mons[i] = null; break; }
    }
  }
  for (const k of Object.keys(st.flags)) if (k.startsWith("gde")) delete st.flags[k];
  for (const k of Object.keys(st.missoes || {})) if (k.startsWith("gde_")) delete st.missoes[k];
  for (const k of Object.keys(st.npcState || {})) if (k.includes(".gde_") || k.includes(".missao_gde_") || CAPITULOS.some((c) => k.startsWith(`${c.id}.`))) delete st.npcState[k];
  st.extrema = null;
  // quem salvou lá dentro sai: a KANTO DISTORCIDA não existe mais pra ele
  if (naExtrema(st)) Object.assign(st.player, st.mission?.back || { map: LAB[R(st)], x: 6, y: 11, dir: "up" });
  if (st.mission?.extrema) st.mission = null;
  return TXT.apagado(berries, mons);
}

// ------------------------------------------------------------ o pacote
export default {
  id: "extrema",
  nome: "GLITCH DIMENSION EXTREMA",

  especies: { glitnexy: GLITNEXY, glitnexyextremo: GLITNEXY_EXTREMO },

  golpes: {
    baixartudo: { name: "BAIXAR TUDO", type: "GLITCH", power: 85, acc: 95, pp: 10, category: "especial" },
    sinal999g: { name: "SINAL 999G", type: "GLITCH", power: 110, acc: 100, pp: 5, category: "especial" },
  },

  itens: {
    ...Object.fromEntries(BERRIES.map((b) => [b.berry, b.texto])),
    [ROTEADOR]: "UM ROTEADOR COM 999 ANTENINHAS. LIGADO PERTO DE UM GLITNEXY, O SINAL VAI NO MÁXIMO E ELE VIRA O GLITNEXY EXTREMO. DESLIGADO, ELE VOLTA. NÃO SE GASTA.",
    "foto de um ano": "A FOTO DA FESTA: OS DOIS PROFESSORES, OS AMIGOS, VOCÊ... E, NO CANTO, MEIO BORRADO, VOCÊ DE UM ANO ATRÁS, ACENANDO.",
  },

  aplicar(DB, api) {
    garantirEspecie(CATECHU);
    garantirEspecie("fus-gyarados-arcanine");

    // as berries, na prateleira de toda loja
    for (const mapa of Object.values(DB.MAPS)) {
      for (const npc of mapa.npcs || []) {
        if (!npc.shop || npc.estoqueFechado) continue;
        for (const b of BERRIES) if (!npc.shop.some((x) => x.item === b.berry)) npc.shop.push({ item: b.berry, price: b.preco });
      }
    }

    // os PODERES dos espetinhos valem como as PEDRAS de Braglitch
    const meus = [...PODERES, FORCA];
    DB.PEDRAS_BRAG = [...(DB.PEDRAS_BRAG || []).filter((p) => !meus.some((x) => x.item === p.item)), ...meus];

    // as tirinhas no fim do caderno do VÍTOR
    if (DB.TIRINHAS) {
      const nomes = new Set(TIRINHAS.map((t) => t.titulo));
      DB.TIRINHAS.lista = [...DB.TIRINHAS.lista.filter((t) => !nomes.has(t.titulo)), ...TIRINHAS];
    }

    // a KANTO DISTORCIDA: a geometria (todo build do DB) e o desenho (uma vez)
    for (const cap of CAPITULOS) montarCapitulo(cap);

    // as missões e quem fala nelas
    const novas = missoes();
    DB.MISSOES = [...(DB.MISSOES || []).filter((m) => !novas.some((n) => n.id === m.id)), ...novas];
    npcsDaHistoria();

    // os amigos de BRAGLITCH saem da ESPLANADA: um ano depois eles estão no
    // píer (e na festa), e quem põe eles lá é este pacote
    const A = DB.AMIGOS;
    if (A && !A.encontros.some((e) => e.id === "gde")) {
      A.encontros.push({ id: "gde", etapa: 11, onde: { mapa: "gde_no_pier" }, requer: { flag: "gde_b" },
                         vitor: { fala: [] }, andre: { fala: [] } });
    }

    // a fenda: só o GLITNEXY abre depois da fusão
    DB.OBJETIVO_DLC = objetivo;
    // o ROTEADOR EXTREMO 999G troca a forma do GLITNEXY (src/scenes/overworld.js `usarCatalogo`)
    DB.ITENS_DE_FORMA = { ...(DB.ITENS_DE_FORMA || {}), [ROTEADOR]: {
      item: ROTEADOR, ...TXT.forma,
      aceita: ["glitnexy", "glitnexyextremo"], bases: ["glitnexy"],
      opcoes: [["glitnexy", "DESLIGAR"], ["glitnexyextremo", "LIGAR NO 999G"]],
      aoTrocar: golpeDaForma,
    } };
    DB.TITULO_DLC = [...(DB.TITULO_DLC || []).filter((o) => o.nome !== TXT.apagar.nome),
                     { ...TXT.apagar, aoConfirmar: apagarProgresso }];
    DB.FENDA_TRANCADA = (st) => (st?.flags?.gdeFundida ? TXT.fendaTrancada : null);

    api.gancho("viajar", (st) => {
      // quem foi derrubado sem ser pego está de pé de novo na próxima viagem
      if (naExtrema(st)) {
        for (const c of CHEFES) if (!st.flags?.[`gdePego_${c.id}`]) delete st.npcState?.[`${st.player.map}.gde_chefe_${c.id}`];
        if (!st.flags?.gdeGiratinaPego) delete st.npcState?.[`${st.player.map}.gde_giratina`];
      }
      cuidar(st);
    });
    api.gancho("encontrar", (st, b) => {
      if (!naExtrema(st) || !b?.mon || b.mon._extrema) return;
      const m = b.mon;
      m._extrema = true;
      m.level += 100;
      m.xp = xpForLevel(m.level);
      recalc(m);
      m.hp = m.maxHp;
    });
    api.gancho("hud", (ctx, st, g) => {
      cuidar(st);
      puxar(st, g.cena);
      if (aviso && aviso.ate > Date.now()) {
        const linhas = [""];
        for (const p of aviso.texto.split(" ")) {
          const l = linhas[linhas.length - 1];
          if (l && (l + " " + p).length * 6 > g.W - 20) linhas.push(p);
          else linhas[linhas.length - 1] = l ? `${l} ${p}` : p;
        }
        g.panel(ctx, 4, 4, g.W - 8, 10 + linhas.length * 11);
        linhas.forEach((l, i) => g.drawText(ctx, l, 10, 9 + i * 11, g.PAL.ink));
      } else aviso = null;
      if (!cartao) return;
      const falta = cartao.ate - Date.now();
      if (falta <= 0) { cartao = null; return; }
      const passou = cartao.ms - falta;
      const a = Math.min(1, passou / 600, falta / 600);
      ctx.save();
      ctx.globalAlpha = Math.max(0, a);
      ctx.fillStyle = "#08040f";
      ctx.fillRect(0, 0, g.W, g.H);
      const y0 = Math.round(g.H / 2 - cartao.linhas.length * 7);
      cartao.linhas.forEach((l, i) => {
        const x = Math.max(4, Math.round((g.W - l.length * 6) / 2));
        g.drawText(ctx, l, x, y0 + i * 14, i === 0 ? "#b455ff" : "#e8e0ff");
      });
      ctx.restore();
    });
  },
};
