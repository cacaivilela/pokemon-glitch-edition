// AS TRÊS ERAS: o pós-jogo, viajando com CELEBI.
//
// MISSINGNO. foi capturado, a 011GLITCHDIMENSION110 fechou — e o buraco que ela
// deixou não foi no espaço, foi no TEMPO. Quem aparece na FLORESTA VIRIDIAN
// depois disso é o CELEBI, e ele não leva você pra outro lugar: leva pra outro
// QUANDO. São três viagens, nesta ordem, cada uma liberada pela anterior:
//
//   1. 66 MILHÕES DE ANOS ATRÁS — os fósseis ainda não são fósseis. É aqui que
//      LILEEP, ANORITH, TIRTOUGA e ARCHEN finalmente têm as evoluções deles
//      (CRADILY, ARMALDO, CARRACOSTA, ARCHEOPS): eles moravam na fenda desde
//      sempre com meia linhagem, subindo de nível esperando virar uma coisa
//      que não existia (o mesmo aviso que está no alto de src/data/extra.js).
//      Os quatro remontados errado — DRACOZOLT, DRACOVISH, ARCTOZOLT e
//      ARCTOVISH — NÃO estão aqui, de propósito: eles nunca existiram. Eles são
//      erro de museu, não bicho do passado, e o passado é justamente o lugar
//      onde essa mentira não cabe.
//   2. 4 MILHÕES DE ANOS ATRÁS — os PARADOXOS DO PASSADO de Paldea, num vale
//      que ninguém devia ter achado. Quem manda é o KORAIDON.
//   3. O FUTURO — o MESMO vale, com o MESMO desenho de chão (é o mesmo `seed`
//      lá embaixo: o buraco é o mesmo buraco), só que de metal. Os PARADOXOS DO
//      FUTURO, e o MIRAIDON no fundo.
//
// O guardião de cada era é um NPC parado, como os de ESTATICOS: você anda até
// ele e encosta. Derrubar sem capturar não fecha a era — ele volta na próxima
// viagem, porque a viagem inteira entre você e a segunda chance já é preço
// suficiente. CAPTURAR é o que abre a era seguinte.
//
// Tudo aqui tem hot-swap: dá pra reescrever fala, nível e tabela com o jogo
// aberto. Os três mapas são gerados em código (src/data/index.js), e a arte
// deles também (Assets.eraArt, em src/core/assets.js).

// Formato igual ao de gen1.js e extra.js: dex NOME TIPO1[/TIPO2] HP ATK DEF SPA SPD SPE
//
// COM UMA DIFERENÇA, E ELA É O MOTIVO DESTE PARSER EXISTIR: metade dos
// PARADOXOS tem nome de DUAS PALAVRAS (GREAT TUSK, IRON HANDS). O parser do
// extra.js corta a linha em pedaços e lê o segundo como nome inteiro — com
// "GREAT TUSK" ele leria "GREAT" e tomaria "TUSK" por lista de tipos, e o jogo
// morreria montando a espécie. Aqui a linha é lida DAS PONTAS PRO MEIO: o
// primeiro pedaço é o número, os seis últimos são os atributos, o que vem antes
// deles são os tipos, e TODO O RESTO é o nome. Nome com espaço deixa de ser um
// caso especial e vira o caso normal.
const TABELA = `
251 CELEBI PSÍQUICO/PLANTA 100 100 100 100 100 100

346 CRADILY PEDRA/PLANTA 86 81 97 81 107 43
348 ARMALDO PEDRA/INSETO 75 125 100 70 80 45
565 CARRACOSTA ÁGUA/PEDRA 74 108 133 83 65 32
567 ARCHEOPS PEDRA/VOADOR 75 140 65 112 65 110
696 TYRUNT PEDRA/DRAGÃO 58 89 77 45 45 48
697 TYRANTRUM PEDRA/DRAGÃO 82 121 119 69 59 71
698 AMAURA PEDRA/GELO 77 59 50 67 63 46
699 AURORUS PEDRA/GELO 123 77 72 99 92 58
369 RELICANTH ÁGUA/PEDRA 100 90 130 45 65 55

984 GREAT TUSK TERRA/LUTADOR 115 131 131 53 53 87
985 SCREAM TAIL FADA/PSÍQUICO 115 65 99 65 115 111
986 BRUTE BONNET PLANTA/SOMBRIO 111 127 99 79 99 55
987 FLUTTER MANE FANTASMA/FADA 55 55 55 135 135 135
988 SLITHER WING INSETO/LUTADOR 85 135 79 85 105 81
989 SANDY SHOCKS ELÉTRICO/TERRA 85 81 97 121 85 101
1005 ROARING MOON DRAGÃO/SOMBRIO 105 139 71 55 101 119
1009 WALKING WAKE ÁGUA/DRAGÃO 99 83 91 125 83 109
1020 GOUGING FIRE FOGO/DRAGÃO 105 115 121 65 93 91
1021 RAGING BOLT ELÉTRICO/DRAGÃO 125 73 91 137 89 75
1007 KORAIDON LUTADOR/DRAGÃO 100 135 115 85 100 135

990 IRON TREADS TERRA/AÇO 90 112 120 72 70 106
991 IRON BUNDLE GELO/ÁGUA 56 80 114 124 60 136
992 IRON HANDS LUTADOR/ELÉTRICO 154 140 108 50 68 50
993 IRON JUGULIS SOMBRIO/VOADOR 94 80 86 122 80 108
994 IRON MOTH FOGO/VENENO 80 70 60 140 110 110
995 IRON THORNS PEDRA/ELÉTRICO 100 134 110 70 84 72
1006 IRON VALIANT FADA/LUTADOR 74 130 90 120 60 116
1010 IRON LEAVES PLANTA/PSÍQUICO 90 130 88 70 108 104
1022 IRON BOULDER PEDRA/PSÍQUICO 90 120 80 68 108 124
1023 IRON CROWN AÇO/PSÍQUICO 90 72 100 122 108 98
1008 MIRAIDON ELÉTRICO/DRAGÃO 100 85 100 135 115 135
`;

/** A frase da Pokédex de cada um. Uma pra cada, nada de texto genérico — é a
 *  mesma regra do LORE em src/data/extra.js. */
export const LORE = {
  celebi: "ELE ATRAVESSA O TEMPO COMO QUEM ATRAVESSA UM CÔMODO. PRA ELE, ONTEM É UMA PORTA.",

  cradily: "O LILEEP CRESCEU. AGORA ELE ANDA — DEVAGAR, MAS ANDA — E CONTINUA CAÇANDO PARADO.",
  armaldo: "AS DUAS GARRAS FECHAM ANTES DE VOCÊ VER QUE ELAS ABRIRAM.",
  carracosta: "O CASCO DELE AGUENTA O FUNDO DO MAR. A MORDIDA QUEBRA O CASCO DOS OUTROS.",
  archeops: "AQUI ELE VOA. O QUE FALTAVA NUNCA FOI ASA: ERA O CÉU DESTE ANO.",
  tyrunt: "FILHOTE. JÁ MORDE COMO SE FOSSE DONO DO VALE INTEIRO, E DAQUI A POUCO VAI SER.",
  tyrantrum: "O REI. NINGUÉM DISSE ISSO PRA ELE — ELE É QUE NÃO DEIXOU NINGUÉM DIZER OUTRA COISA.",
  amaura: "O CORPO SOLTA UM FRIO AZUL. ONDE ELE DORME, A NOITE FICA UM PALMO MAIS FRIA.",
  aurorus: "AS PLACAS DO PESCOÇO ACENDEM EM ONDA. É COM ISSO QUE ELE CONVERSA.",
  relicanth: "CEM MILHÕES DE ANOS SEM MUDAR UM OSSO. ELE NÃO PRECISOU.",

  greattusk: "GRANDE DEMAIS PRA SER O QUE ELE PARECE SER. AS PRESAS ABREM CAMINHO ONDE NÃO TEM.",
  screamtail: "O GRITO DELE VEM ANTES DELE. QUANDO CHEGA O BICHO, VOCÊ JÁ ESTÁ COM MEDO.",
  brutebonnet: "O CHAPÉU SOLTA PÓ. QUEM RESPIRA PARA DE ANDAR E FICA OLHANDO.",
  fluttermane: "ELE NÃO TOCA O CHÃO E NÃO FAZ SOMBRA. A JUBA MEXE SEM VENTO NENHUM.",
  slitherwing: "AS ASAS NÃO SÃO PRA VOAR. SÃO PRA BATER, E ELAS BATEM MUITO.",
  sandyshocks: "OS FIOS DA CABEÇA SE ARREPIAM SOZINHOS. A AREIA EM VOLTA FICA DE PÉ JUNTO.",
  roaringmoon: "UM RUGIDO NO CÉU DE NOITE. QUEM OLHA PRA CIMA A TEMPO NÃO CONTA DEPOIS.",
  walkingwake: "ELE ANDA E A ÁGUA VAI JUNTO. NÃO É CHUVA: É ELE CHEGANDO.",
  gougingfire: "CADA PASSO DEIXA UM RASGO ACESO NO CHÃO. O RASGO DEMORA A APAGAR.",
  ragingbolt: "O PESCOÇO É UM PARA-RAIOS AO CONTRÁRIO: O RAIO SAI DELE.",

  irontreads: "ELE SE ENROLA E VIRA RODA. O CHÃO É QUE DECIDE SE AGUENTA.",
  ironbundle: "UMA MOCHILA DE GELO ANDANDO SOZINHA. DENTRO DELA TEM MAIS FRIO DO QUE CABE.",
  ironhands: "AS MÃOS SÃO MAIORES QUE O RESTO. O RESTO EXISTE PRA CARREGAR AS MÃOS.",
  ironjugulis: "TRÊS CABEÇAS OLHANDO PRA TRÊS LADOS. NENHUMA DELAS PISCA.",
  ironmoth: "AS ASAS SÃO DUAS TELAS ACESAS. O PÓ QUE CAI DELAS QUEIMA.",
  ironthorns: "PEDRA E FIO NO MESMO CORPO. QUANDO ELE ANDA, DÁ INTERFERÊNCIA.",
  ironvaliant: "DUAS ESPADAS E NENHUMA DÚVIDA. FOI DESENHADO PRA ISSO E SÓ PRA ISSO.",
  ironleaves: "A LÂMINA VERDE NÃO É FOLHA. É METAL PINTADO DE FOLHA.",
  ironboulder: "UMA PEDRA QUE ALGUÉM MOTORIZOU. ELA CHEGA ANTES DO BARULHO DELA.",
  ironcrown: "A COROA É A CABEÇA. NÃO TEM NADA POR BAIXO PRA COROAR.",

  koraidon: "O QUE ANDAVA AQUI ANTES DE TODO MUNDO. ELE NÃO PERGUNTA POR ONDE: ELE PASSA.",
  miraidon: "O QUE VAI ANDAR AQUI DEPOIS DE TODO MUNDO. ELE NÃO FAZ BARULHO NENHUM.",
};

export const ERAS_ESPECIES = {};
// Linha vazia é PULADA — o mesmo cuidado do extra.js, e pelo mesmo motivo: um
// separador em branco entre dois blocos derrubava o jogo inteiro com um
// "name is undefined" que não dizia nada sobre tabela nenhuma.
for (const linha of TABELA.trim().split("\n")) {
  if (!linha.trim()) continue;
  const p = linha.trim().split(/\s+/);
  const [hp, atk, def, spa, spd, spe] = p.slice(-6).map(Number);
  const tipos = p[p.length - 7];
  const nome = p.slice(1, p.length - 7).join(" ");
  const base = { hp, atk, def, spa, spd, spe };
  const bst = Object.values(base).reduce((a, b) => a + b, 0);
  const id = nome.toLowerCase().replace(/[^a-z0-9]+/g, "");
  ERAS_ESPECIES[id] = {
    id, dex: +p[0], name: nome, types: tipos.split("/"), base, bst, foreign: true,
    dexText: LORE[id],
    catchRate: bst >= 600 ? 3 : bst >= 500 ? 45 : 120,
    xpYield: Math.floor(bst / 4),
  };
}

/** As evoluções que faltavam. LILEEP, ANORITH, TIRTOUGA e ARCHEN estavam no
 *  jogo desde a fenda, cada um sem a segunda metade da linhagem; agora que a
 *  segunda metade existe, a regra existe junto. (Entram em EVOLUTIONS por
 *  src/data/evolution.js — escrever aqui é escrever no lugar em que a espécie
 *  nasceu.) */
export const EVO_ERAS = {
  lileep: [{ lvl: 40, to: "cradily" }],
  anorith: [{ lvl: 40, to: "armaldo" }],
  tirtouga: [{ lvl: 37, to: "carracosta" }],
  archen: [{ lvl: 37, to: "archeops" }],
  tyrunt: [{ lvl: 39, to: "tyrantrum" }],
  amaura: [{ lvl: 39, to: "aurorus" }],
};

/** O CELEBI, parado na FLORESTA VIRIDIAN. Ele só aparece depois que
 *  MISSINGNO. foi capturado (`flags.caughtMissingno`) — antes disso a clareira
 *  é só clareira. Ele NÃO é capturável: ele é a porta. */
export const CELEBI = {
  mapa: "viridian_forest", x: 21, y: 22, sprite: "mon:celebi",
  flag: "caughtMissingno",
  primeira: [
    "TEM UMA CLAREIRA NO MEIO DA FLORESTA QUE VOCÊ JURARIA NÃO TER PASSADO ANTES.",
    "O AR AQUI DENTRO ESTÁ PARADO. AS FOLHAS CAEM E FICAM NO MEIO DO CAMINHO.",
    "UMA COISA VERDE E PEQUENA ABRE OS OLHOS. AS FOLHAS VOLTAM A CAIR.",
    "CELEBI: A FENDA FECHOU DO LADO DE LÁ. DO LADO DE CÁ ELA DEIXOU UM BURACO.",
    "CELEBI: O BURACO NÃO É NUM LUGAR. É NUM QUANDO.",
    "CELEBI: EU SEI ATRAVESSAR. VOCÊ AGUENTA O QUE TEM DO OUTRO LADO?",
  ],
  falas: ["CELEBI SEGURA A FOLHA NO AR E ESPERA VOCÊ ESCOLHER."],
  pergunta: "PRA QUANDO?",
  agora: "FICAR AQUI",
  recusa: "A FOLHA CAI. ELE FECHA OS OLHOS DE NOVO.",
  trancada: "CELEBI: AINDA NÃO. DE LÁ PRA CÁ TEM UM BICHO NO CAMINHO, E ELE É SEU.",
  /** o que ele diz quando as três já foram feitas e você volta pra conversar */
  fim: [
    "CELEBI: VOCÊ VIU O PRIMEIRO DIA E VIU O ÚLTIMO.",
    "CELEBI: OS DOIS TINHAM BICHO ANDANDO. ISSO É A ÚNICA COISA QUE NÃO MUDA.",
    "CELEBI: AS PORTAS FICAM ABERTAS. VOLTA QUANDO QUISER.",
  ],
};

/** O texto solto da viagem (fica aqui pra ter hot-swap junto com o resto). */
export const ERAS_TEXTO = {
  indo: [
    "CELEBI ABRE AS ASAS E O VERDE DA FLORESTA ESCORRE PRA CIMA.",
    "NÃO É QUE A TELA APAGA: É QUE ELA VOLTA MUITO DEPOIS.",
  ],
  espera: ["CELEBI ESTÁ SENTADO NO AR, DE OLHO ABERTO. ELE VOLTA QUANDO VOCÊ QUISER."],
  perguntaVolta: "VOLTAR PRO SEU ANO?",
  opcoesVolta: ["VOLTAR", "FICAR MAIS"],
  ficar: "ELE FECHA OS OLHOS DE NOVO E ESPERA.",
};

/** AS TRÊS ERAS.
 *
 *  `geo` é o que src/data/index.js usa pra desenhar o mapa (ele é gerado, não
 *  vem do FireRed) e `paleta` é o que src/core/assets.js usa pra pintar. As
 *  duas últimas compartilham o MESMO `seed`: quatro milhões de anos depois, o
 *  vale é o mesmo vale — quem olha o chão reconhece o lugar. Isso é de
 *  propósito e não deve ser "consertado". */
export const ERAS = [
  {
    id: "fosseis",
    mapa: "era_fosseis",
    nome: "66 MILHÕES DE ANOS ATRÁS",
    curto: "66 MILHÕES",
    music: "era_fosseis",
    requer: null,                       // a primeira: basta ter fechado a fenda
    geo: {
      w: 42, h: 36, seed: 66000, escala: 7,
      mato: 0.60, pedra: 0.78,
      // a lagoa fica NUM CANTO SÓ (o de baixo, à esquerda): água espalhada pelo
      // mapa inteiro corta o caminho de quem não tem SURFAR, e um mapa sem
      // saída é pior que um mapa sem mar
      lagoa: { x0: 0.00, x1: 0.34, y0: 0.55, y1: 1.00, limite: 0.47 },
      entrada: { x: 20, y: 30 }, guardiao: { x: 20, y: 6 },
    },
    paleta: {
      chao: ["#6b4a2f", "#7a5636", "#5c3f28", "#84603c"],
      mato: ["#2e5a2a", "#3a6b33", "#24471f"],
      pedra: ["#4a423c", "#5b524a", "#3a332e"],
      agua: ["#2a5c52", "#356d61", "#1f4a42"],
      espuma: "#7fd3bd", faisca: "#ffb347", faiscaChance: 0.02,
    },
    chegada: [
      "O CHÃO ESTÁ QUENTE ATRAVÉS DO SAPATO.",
      "O MATO É ALTO DEMAIS E NÃO É MATO: SÃO SAMAMBAIAS DA ALTURA DE UMA CASA.",
      "NÃO TEM PÁSSARO. TEM OUTRA COISA VOANDO, E ELA TEM DENTE.",
      "CELEBI: SESSENTA E SEIS MILHÕES. NENHUM DELES É FÓSSIL AINDA.",
    ],
    guardiao: {
      id: "tyrantrum", nivel: 70,
      lines: [
        "O CHÃO BATE UMA VEZ. DEPOIS DE NOVO, MAIS PERTO.",
        "AS SAMAMBAIAS ABREM SOZINHAS NUMA LINHA RETA VINDO NA SUA DIREÇÃO.",
        "ELE PARA A DOIS PASSOS E ABRE A BOCA — NÃO PRA MORDER, PRA MEDIR.",
        "CELEBI: ESSE AQUI É O DONO. ELE NÃO VAI TE DEIXAR PASSAR SEM SABER QUEM VOCÊ É.",
      ],
      capturado: [
        "CELEBI: O REI SAIU DO ANO DELE.",
        "CELEBI: A PRÓXIMA PORTA JÁ ESTÁ ABERTA. ELA É MAIS PERTO DE CASA — E É PIOR.",
      ],
    },
    encontros: [
      { id: "tyrunt", min: 55, max: 62, w: 14 },
      { id: "amaura", min: 55, max: 62, w: 14 },
      { id: "cranidos", min: 55, max: 62, w: 12 },
      { id: "shieldon", min: 55, max: 62, w: 12 },
      { id: "lileep", min: 55, max: 62, w: 10 },
      { id: "anorith", min: 55, max: 62, w: 10 },
      { id: "tirtouga", min: 55, max: 62, w: 10 },
      { id: "archen", min: 55, max: 62, w: 10 },
      { id: "omanyte", min: 55, max: 62, w: 10 },
      { id: "kabuto", min: 55, max: 62, w: 10 },
      { id: "aurorus", min: 62, max: 68, w: 6 },
      { id: "rampardos", min: 62, max: 68, w: 5 },
      { id: "bastiodon", min: 62, max: 68, w: 5 },
      { id: "cradily", min: 62, max: 68, w: 5 },
      { id: "armaldo", min: 62, max: 68, w: 5 },
      { id: "carracosta", min: 62, max: 68, w: 5 },
      { id: "archeops", min: 62, max: 68, w: 4 },
      { id: "omastar", min: 62, max: 68, w: 4 },
      { id: "kabutops", min: 62, max: 68, w: 4 },
      { id: "relicanth", min: 58, max: 66, w: 6 },
      { id: "aerodactyl", min: 60, max: 70, w: 6 },
    ],
  },
  {
    id: "paradoxo",
    mapa: "era_paradoxo",
    nome: "4 MILHÕES DE ANOS ATRÁS",
    curto: "4 MILHÕES",
    music: "era_paradoxo",
    requer: "fosseis",
    geo: {
      w: 42, h: 36, seed: 40404, escala: 6,
      mato: 0.55, pedra: 0.80,
      lagoa: { x0: 0.66, x1: 1.00, y0: 0.58, y1: 1.00, limite: 0.46 },
      entrada: { x: 20, y: 30 }, guardiao: { x: 20, y: 6 },
    },
    paleta: {
      chao: ["#3d4a2c", "#48582f", "#333f24", "#556634"],
      mato: ["#2a4d1e", "#376226", "#203c17"],
      pedra: ["#5a4b6b", "#6b5a7d", "#463a54"],
      agua: ["#2b4b6b", "#35597d", "#20395a"],
      espuma: "#9fd0ff", faisca: "#c8ff5a", faiscaChance: 0.03,
    },
    chegada: [
      "O VALE É FUNDO E O CÉU APARECE SÓ NUM PEDAÇO REDONDO, LÁ EM CIMA.",
      "AS PAREDES SÃO DE CRISTAL E ELAS ESTÃO MORNAS.",
      "OS BICHOS DAQUI SE PARECEM COM BICHOS QUE VOCÊ CONHECE. SÓ QUE ERRADOS, E MAIORES.",
      "CELEBI: QUATRO MILHÕES. ISSO AQUI É ONTEM PERTO DA OUTRA VIAGEM.",
    ],
    guardiao: {
      id: "koraidon", nivel: 72,
      lines: [
        "O BARULHO VEM DE CIMA: ALGUMA COISA DESCEU A PAREDE DO VALE CORRENDO.",
        "ELE PARA NO MEIO DO CAMINHO, DE LADO, PRA VOCÊ VER O TAMANHO INTEIRO.",
        "NÃO TEM AMEAÇA NENHUMA NO JEITO DELE. É PIOR: É CURIOSIDADE.",
        "CELEBI: ESSE É O PRIMEIRO. TUDO QUE ANDA HOJE ANDA PORQUE ELE ANDOU ANTES.",
      ],
      capturado: [
        "CELEBI: VOCÊ TIROU O PRIMEIRO DO LUGAR DELE E O VALE CONTINUOU EM PÉ.",
        "CELEBI: ENTÃO O VALE AGUENTA. VAMOS VER ELE DAQUI A MUITO TEMPO.",
      ],
    },
    encontros: [
      { id: "greattusk", min: 60, max: 68, w: 14 },
      { id: "screamtail", min: 60, max: 68, w: 14 },
      { id: "brutebonnet", min: 60, max: 68, w: 13 },
      { id: "fluttermane", min: 60, max: 68, w: 12 },
      { id: "slitherwing", min: 60, max: 68, w: 12 },
      { id: "sandyshocks", min: 60, max: 68, w: 12 },
      { id: "roaringmoon", min: 64, max: 70, w: 6 },
      { id: "walkingwake", min: 64, max: 70, w: 5 },
      { id: "gougingfire", min: 64, max: 70, w: 5 },
      { id: "ragingbolt", min: 64, max: 70, w: 5 },
    ],
  },
  {
    id: "futuro",
    mapa: "era_futuro",
    nome: "O FUTURO",
    curto: "O FUTURO",
    music: "era_futuro",
    requer: "paradoxo",
    geo: {
      // MESMO seed da era anterior: é o MESMO VALE, com o mesmo chão, depois de
      // muito tempo. Só o que cresce em cima é que mudou.
      w: 42, h: 36, seed: 40404, escala: 6,
      mato: 0.63, pedra: 0.76,
      lagoa: { x0: 0.66, x1: 1.00, y0: 0.58, y1: 1.00, limite: 0.46 },
      entrada: { x: 20, y: 30 }, guardiao: { x: 20, y: 6 },
    },
    paleta: {
      chao: ["#2b3038", "#343a44", "#22262d", "#3d444f"],
      mato: ["#1e4a44", "#276057", "#173b36"],
      pedra: ["#4e5866", "#5f6a7a", "#3c4552"],
      agua: ["#123a4a", "#17505f", "#0d2b38"],
      espuma: "#66e0ff", faisca: "#66e0ff", faiscaChance: 0.05, linhas: "#7fe8ff",
    },
    chegada: [
      "É O MESMO VALE. O MESMO BURACO REDONDO DE CÉU LÁ EM CIMA.",
      "SÓ QUE O CHÃO É PLACA, O MATO É FIBRA E NADA AQUI CRESCEU: TUDO FOI MONTADO.",
      "OS BICHOS FAZEM UM BARULHINHO CONSTANTE, COMO APARELHO LIGADO.",
      "CELEBI: ELES TÊM A MESMA CARA DOS DE LÁ. NINGUÉM ME EXPLICOU ISSO AINDA.",
    ],
    guardiao: {
      id: "miraidon", nivel: 72,
      lines: [
        "NÃO TEM BARULHO NENHUM. ELE JÁ ESTAVA AQUI QUANDO VOCÊ OLHOU.",
        "AS RODAS NÃO TOCAM O CHÃO. ELAS GIRAM MESMO ASSIM.",
        "ELE INCLINA A CABEÇA E UMA LUZ VARRE VOCÊ DE CIMA A BAIXO, DUAS VEZES.",
        "CELEBI: ESSE É O ÚLTIMO. E ELE JÁ SABE COMO ISSO AQUI TERMINA.",
      ],
      capturado: [
        "CELEBI: PRONTO. O PRIMEIRO E O ÚLTIMO NA MESMA EQUIPE.",
        "CELEBI: ISSO NÃO DEVIA PODER. EU TAMBÉM NÃO DEVIA PODER.",
      ],
    },
    encontros: [
      { id: "irontreads", min: 60, max: 68, w: 14 },
      { id: "ironbundle", min: 60, max: 68, w: 13 },
      { id: "ironhands", min: 60, max: 68, w: 13 },
      { id: "ironjugulis", min: 60, max: 68, w: 12 },
      { id: "ironmoth", min: 60, max: 68, w: 12 },
      { id: "ironthorns", min: 60, max: 68, w: 12 },
      { id: "ironvaliant", min: 64, max: 70, w: 6 },
      { id: "ironleaves", min: 64, max: 70, w: 5 },
      { id: "ironboulder", min: 64, max: 70, w: 5 },
      { id: "ironcrown", min: 64, max: 70, w: 5 },
    ],
  },
];

// As perguntas sobre estado (qual era está aberta, quem é o guardião de qual
// mapa) ficam em src/systems/eras.js: aqui é o que o jogo É, lá é o que o jogo
// SABE do seu save.
