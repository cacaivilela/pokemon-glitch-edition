// Espécies que NÃO são de Kanto — elas vazam de outras regiões pela
// 011GLITCHDIMENSION110 e só aparecem lá dentro. Três famílias:
//   - dados soltos: PORYGON2/-Z, UNOWN, SHEDINJA, ROTOM, BRONZOR, KLINK
//   - fósseis remontados errado: CRANIDOS, SHIELDON, LILEEP, ANORITH,
//     TIRTOUGA, ARCHEN, DRACOZOLT, DRACOVISH
//   - coisas que não deviam caber aqui: LUNATONE, SOLROCK, CRYOGONAL, GOLETT
// Os lendários ficam por último (ver WEATHER_TRIO, RARE_LEGEND e TEMPESTADE).
// TORNADUS, THUNDURUS e LANDORUS não aparecem na grama de lugar nenhum: eles
// moram na tempestade que não acaba, no mar perto de BIRTH ISLAND, e só se
// chega lá de barco (as side quests do marinheiro — src/data/missoes.js).
// Formato igual ao de gen1.js: dex NOME TIPO1[/TIPO2] HP ATK DEF SPA SPD SPE
//
// E OS MORADORES DOS LUGARES NOVOS (as 33 primeiras linhas da tabela). Não vazam
// da GLITCHDIMENSION como os de cima: eles já estavam nas tabelas de encontro do
// FireRed dos lugares que entraram agora — a MISDREAVUS mora nas quatorze salas
// da CAVERNA PERDIDA, o HERACROSS no MATO DOS DESENHOS, o LARVITAR no CÂNION.
// Sem eles o jogo QUEBRAVA ao sortear o encontro: montar um Pokémon de espécie
// que não existe estoura na hora de ler os stats-base. Lugar importado traz os
// bichos dele junto, ou não é lugar — é cenário vazio com armadilha dentro.
// E CADA UM VEIO COM A LINHAGEM INTEIRA: quem tem NATU tem XATU, quem tem YANMA
// tem YANMEGA, quem tem LEDYBA tem LEDIAN. Meia linhagem é uma espécie que sobe
// de nível a vida toda esperando virar uma coisa que não existe — e o jogo cala,
// porque `evolutionFor` simplesmente não acha regra nenhuma.
const TABLE = `
161 SENTRET NORMAL 35 46 34 35 45 20
165 LEDYBA INSETO/VOADOR 40 20 30 40 80 55
167 SPINARAK INSETO/VENENO 40 60 40 40 40 30
177 NATU PSÍQUICO/VOADOR 40 50 45 70 45 70
183 MARILL ÁGUA/FADA 70 20 50 20 50 40
187 HOPPIP PLANTA/VOADOR 35 35 40 35 55 50
193 YANMA INSETO/VOADOR 65 65 45 75 45 95
200 MISDREAVUS FANTASMA 60 60 60 85 85 85
202 WOBBUFFET PSÍQUICO 190 33 58 33 58 33
206 DUNSPARCE NORMAL 100 70 70 65 65 45
214 HERACROSS INSETO/LUTADOR 80 125 75 40 95 85
231 PHANPY TERRA 90 60 60 40 40 40
246 LARVITAR PEDRA/TERRA 50 64 50 45 50 41
162 FURRET NORMAL 85 76 64 45 55 90
166 LEDIAN INSETO/VOADOR 55 35 50 55 110 85
168 ARIADOS INSETO/VENENO 70 90 70 60 70 40
178 XATU PSÍQUICO/VOADOR 65 75 70 95 70 95
184 AZUMARILL ÁGUA/FADA 100 50 80 60 80 50
188 SKIPLOOM PLANTA/VOADOR 55 45 50 45 65 80
189 JUMPLUFF PLANTA/VOADOR 75 55 70 55 95 110
232 DONPHAN TERRA 90 120 120 60 60 50
247 PUPITAR PEDRA/TERRA 70 84 70 65 70 51
248 TYRANITAR PEDRA/SOMBRIO 100 134 110 95 100 61
429 MISMAGIUS FANTASMA 60 60 60 105 105 105
469 YANMEGA INSETO/VOADOR 86 76 86 116 56 95
982 DUDUNSPARCE NORMAL 125 100 80 85 75 55
215 SNEASEL SOMBRIO/GELO 55 95 55 35 75 115
461 WEAVILE SOMBRIO/GELO 70 120 65 45 85 125
218 SLUGMA FOGO 40 40 40 70 40 20
219 MAGCARGO FOGO/PEDRA 60 50 120 90 80 30
220 SWINUB GELO/TERRA 50 50 40 30 30 50
221 PILOSWINE GELO/TERRA 100 100 80 60 60 50
473 MAMOSWINE GELO/TERRA 110 130 80 70 60 80
233 PORYGON2 NORMAL 85 80 90 105 95 60
474 PORYGON-Z NORMAL 85 80 70 135 75 90
408 CRANIDOS PEDRA 67 125 40 30 30 58
409 RAMPARDOS PEDRA 97 165 60 65 50 58
410 SHIELDON PEDRA/AÇO 30 42 118 42 88 30
411 BASTIODON PEDRA/AÇO 60 52 168 47 138 30
345 LILEEP PEDRA/PLANTA 66 41 77 61 87 23
347 ANORITH PEDRA/INSETO 45 95 50 40 50 75
564 TIRTOUGA ÁGUA/PEDRA 54 78 103 53 45 22
566 ARCHEN PEDRA/VOADOR 55 112 45 74 45 70
880 DRACOZOLT ELÉTRICO/DRAGÃO 90 100 90 80 70 75
882 DRACOVISH ÁGUA/DRAGÃO 90 90 100 70 80 75
201 UNOWN PSÍQUICO 48 72 48 72 48 48
292 SHEDINJA INSETO/FANTASMA 1 90 45 30 30 40
479 ROTOM ELÉTRICO/FANTASMA 50 50 77 95 77 91
436 BRONZOR AÇO/PSÍQUICO 57 24 86 24 86 23
599 KLINK AÇO 40 55 70 45 60 30
615 CRYOGONAL GELO 80 50 50 95 135 105
622 GOLETT TERRA/FANTASMA 59 74 50 35 50 35
337 LUNATONE PEDRA/PSÍQUICO 90 55 65 95 85 70
338 SOLROCK PEDRA/PSÍQUICO 90 95 85 55 65 70
382 KYOGRE ÁGUA 100 100 90 150 140 90
383 GROUDON TERRA 100 150 140 100 90 90
384 RAYQUAZA DRAGÃO/VOADOR 105 150 90 150 90 95
386 DEOXYS PSÍQUICO 50 150 50 150 50 150
881 ARCTOZOLT ELÉTRICO/GELO 90 100 90 90 80 55
883 ARCTOVISH ÁGUA/GELO 90 90 100 80 90 55
607 LITWICK FANTASMA/FOGO 50 30 55 65 55 20
608 LAMPENT FANTASMA/FOGO 60 40 60 95 60 55
609 CHANDELURE FANTASMA/FOGO 60 55 90 145 90 80
605 ELGYEM PSÍQUICO 55 55 55 85 55 30
606 BEHEEYEM PSÍQUICO 75 75 75 125 95 40
649 GENESECT INSETO/AÇO 71 120 95 120 95 99
808 MELTAN AÇO 46 65 65 55 35 34
809 MELMETAL AÇO 135 143 143 80 65 34
235 SMEARGLE NORMAL 55 20 35 20 45 75
483 DIALGA AÇO/DRAGÃO 100 120 120 150 100 90
484 PALKIA ÁGUA/DRAGÃO 90 120 100 150 120 100
493 ARCEUS NORMAL 120 120 120 120 120 120
716 XERNEAS FADA 126 131 95 131 98 99
717 YVELTAL SOMBRIO/VOADOR 126 131 95 131 98 99
718 ZYGARDE DRAGÃO/TERRA 108 100 121 81 95 95
641 TORNADUS VOADOR 79 115 70 125 80 111
172 PICHU ELÉTRICO 20 40 15 35 35 60
173 CLEFFA FADA 50 25 28 45 55 15
174 IGGLYBUFF NORMAL/FADA 90 30 15 40 20 15
238 SMOOCHUM GELO/PSÍQUICO 45 30 15 85 65 65
239 ELEKID ELÉTRICO 45 63 37 65 55 95
240 MAGBY FOGO 45 75 37 70 55 83
298 AZURILL NORMAL/FADA 50 20 40 20 40 20
360 WYNAUT PSÍQUICO 95 23 48 23 48 23
439 MIME-JR. PSÍQUICO/FADA 20 25 45 70 90 60
440 HAPPINY NORMAL 100 5 5 15 65 30
446 MUNCHLAX NORMAL 135 85 40 40 85 5
642 THUNDURUS ELÉTRICO/VOADOR 79 115 70 125 80 111
645 LANDORUS TERRA/VOADOR 89 125 90 115 80 101
386 DEOXYS-ATAQUE PSÍQUICO 50 180 20 180 20 150
386 DEOXYS-DEFESA PSÍQUICO 50 70 160 70 160 90
386 DEOXYS-VELOCIDADE PSÍQUICO 50 95 90 95 90 180
718 ZYGARDE-10% DRAGÃO/TERRA 54 100 71 61 85 115
718 ZYGARDE-COMPLETO DRAGÃO/TERRA 216 100 121 91 95 85
718 ZYGARDE-200% DRAGÃO/TERRA 250 160 150 130 140 110
`;
/** os três só aparecem no terreno certo, e quase nunca */
export const WEATHER_TRIO = { agua: "kyogre", terra: "groudon", ar: "rayquaza" };

/** A frase que o jogo diz quando você encontra a espécie pela primeira vez
 *  dentro da fenda. Uma pra cada — nada de texto genérico. */
export const LORE = {
  porygon2: "ESTE POKÉMON VEIO DE JOGOS ATUALIZADOS.",
  arctozolt: "A METADE DE CIMA CONGELA E A DE BAIXO SOLTA FAÍSCA. AS DUAS BRIGAM ENTRE SI.",
  arctovish: "CABEÇA DE PEIXE, CORPO DE GELO, E A BOCA NO LUGAR ERRADO. ELE NEM CONSEGUE MASTIGAR.",
  elgyem: "APARECEU NUM DESERTO SEM PEGADA NENHUMA EM VOLTA.",
  beheeyem: "OS DEDOS PISCAM EM SEQUÊNCIA. É UM ENDEREÇO SENDO DIGITADO.",
  genesect: "UM FÓSSIL QUE ALGUÉM ABRIU E REESCREVEU. O CANHÃO NÃO ESTAVA NO ORIGINAL.",
  meltan: "UMA GOTA DE METAL LÍQUIDO COM UMA PORCA DE CABEÇA. COME PREGO, PARAFUSO E O QUE MAIS FOR DE FERRO.",
  melmetal: "TREZENTAS GOTAS QUE SE JUNTARAM. É DE FERRO ATÉ O MIOLO, E FERRO NENHUM PASSA POR ELE SEM FICAR.",
  smeargle: "ELE COPIA QUALQUER GOLPE QUE VÊ. AQUI DENTRO, COPIA COISA QUE NEM É GOLPE.",
  deoxysataque: "TODO O CORPO VIROU ARMA. NÃO SOBROU NADA PRA SE DEFENDER.",
  deoxysdefesa: "ELE SE FECHOU. AGORA AGUENTA O QUE VIER — E NÃO DEVOLVE QUASE NADA.",
  deoxysvelocidade: "FINO, LEVE E RÁPIDO DEMAIS PRA TELA ACOMPANHAR.",
  zygarde10: "SÓ UM DÉCIMO DAS CÉLULAS. VIRA UM CACHORRO MAGRO E CORRE MAIS QUE QUALQUER COISA NO TÚNEL.",
  zygardecompleto: "TODAS AS CÉLULAS JUNTAS. É ALTO COMO UM PRÉDIO, E O NÚCLEO NO PEITO BRILHA QUANDO ALGUÉM ESTRAGA A NATUREZA.",
  zygarde200: "PUXOU TODAS AS CÉLULAS DE KALOS E ALOLA. TEM UMA FORTE RELAÇÃO DE FORMATO COM GUZZLORD. É ABSURDAMENTE FORTE E INTELIGENTE: VÊ A MAIOR FRAQUEZA DO OPONENTE EM UM MILISSEGUNDO, ATACA NO MILISSEGUNDO SEGUINTE, E UM SEGUNDO DEPOIS O OPONENTE GERALMENTE ESTÁ NO CHÃO, DESMAIADO.",
  porygonz: "NÃO DÁ PRA CHAMAR ISSO DE POKÉMON. SÓ DE GLITCH.",
  cranidos: "CRÂNIO DURO DEMAIS PRA UM BICHO QUE NÃO EXISTE MAIS.",
  rampardos: "BATE DE CABEÇA EM TUDO. O QUE QUEBRA NUNCA É A CABEÇA.",
  shieldon: "A CARA DELE É UM ESCUDO. O RESTO NEM TERMINOU DE CARREGAR.",
  bastiodon: "DE FRENTE NÃO PASSA NADA. POR ISSO ELE NUNCA APRENDEU A VIRAR.",
  lileep: "UMA PLANTA QUE CAÇA. FICOU PRESA NA PEDRA E NO TEMPO.",
  anorith: "AS GARRAS SÃO DE UM MAR QUE SECOU ANTES DE KANTO EXISTIR.",
  tirtouga: "O CASCO AGUENTA MIL METROS DE PRESSÃO. AQUI NÃO TEM FUNDO NENHUM.",
  archen: "TENTA VOAR E NÃO CONSEGUE: FALTA O DADO QUE ENSINA.",
  dracozolt: "METADE DE CIMA DE UM BICHO, METADE DE BAIXO DE OUTRO. REMONTARAM ERRADO.",
  dracovish: "REMONTARAM ELE DE CABEÇA PRA BAIXO E NINGUÉM CORRIGIU.",
  unown: "SÃO LETRAS. ALGUÉM ESTÁ TENTANDO ESCREVER ALGUMA COISA COM ELES.",
  shedinja: "A CASCA ESTÁ AQUI. O POKÉMON, NÃO. NÃO OLHE PELAS COSTAS DELE.",
  rotom: "MORA DENTRO DE APARELHO LIGADO. AGORA MORA DENTRO DESTE JOGO.",
  bronzor: "O ESPELHO NÃO MOSTRA VOCÊ. MOSTRA O QUE ESTAVA AQUI ANTES.",
  klink: "DUAS ENGRENAGENS QUE NASCERAM JUNTAS. SEPAROU, PARA TUDO.",
  cryogonal: "CORRENTES DE GELO NUM LUGAR QUE NÃO TEM TEMPERATURA NENHUMA.",
  golett: "BARRO ANTIGO MOVIDO POR UMA ENERGIA QUE NINGUÉM SABE DESLIGAR.",
  lunatone: "CHEGOU NUMA CHUVA DE METEORO. NÃO É DAQUI E NEM FINGE QUE É.",
  solrock: "GIRA PARADO NO AR E ESQUENTA A TELA INTEIRA.",
  kyogre: "O MAR INTEIRO NUM ARQUIVO SÓ. A DIMENSÃO NÃO TEM ONDE GUARDAR ISSO.",
  groudon: "O CONTINENTE VEIO JUNTO COM ELE. E NÃO CABE AQUI.",
  rayquaza: "VIVE NA CAMADA MAIS ALTA DO CÉU. AQUI NÃO EXISTE CÉU.",
  deoxys: "UM VÍRUS QUE VIROU BICHO. ELE MUDA DE FORMA CONFORME LÊ VOCÊ.",
  dialga: "O TEMPO ANDA PORQUE ELE ANDA. QUANDO ELE PARA, NINGUÉM PERCEBE — INCLUSIVE VOCÊ.",
  // OS BEBÊS: a forma mínima das linhas de Kanto. Não nascem na grama nem na
  // fenda — só de OVO, na creche da ROTA 5 (src/systems/creche.js). Os que
  // evoluem por AMIZADE precisam gostar de você primeiro (src/data/evolution.js).
  pichu: "AINDA NÃO SEGURA A PRÓPRIA ELETRICIDADE. QUANDO SE ASSUSTA, CHOCA QUEM ESTÁ PERTO — E ELE MESMO.",
  cleffa: "DIZEM QUE VEM DE UMA ESTRELA CADENTE. APARECE MAIS EM NOITE DE CHUVA DE METEOROS.",
  igglybuff: "O CORPO É MACIO E QUICA. QUANDO COMEÇA A QUICAR, NÃO CONSEGUE PARAR.",
  smoochum: "TESTA TUDO COM OS LÁBIOS. É ASSIM QUE ELA LEMBRA DAS COISAS.",
  elekid: "GIRA OS BRAÇOS PRA GERAR ELETRICIDADE. QUANDO TROVEJA, FICA ANIMADO.",
  magby: "A CHAMA QUE SOLTA PELA BOCA DIZ COMO ELE ESTÁ: AMARELA É SAÚDE, COM FUMAÇA É CANSAÇO.",
  azurill: "O RABO É MAIOR QUE O CORPO E CHEIO DE NUTRIENTES. ELE QUICA NELE PRA ANDAR.",
  wynaut: "SEMPRE SORRINDO. PRA SABER SE ESTÁ BRAVO, OLHE O RABO.",
  mimejr: "IMITA QUEM VÊ. QUEM RI DA IMITAÇÃO É QUEM ELE ESTAVA IMITANDO.",
  happiny: "CARREGA UMA PEDRA REDONDA NO BOLSO DA BARRIGA, FINGINDO QUE É UM OVO.",
  munchlax: "ESCONDE COMIDA EMBAIXO DO PELO E ESQUECE ONDE PÔS. COME O DIA INTEIRO MESMO ASSIM.",
  palkia: "O ESPAÇO É UM PANO ESTICADO, E ELE É QUEM SEGURA AS PONTAS. ELE JÁ SOLTOU UMA VEZ.",
};

export const EXTRA = {};
// Linha vazia é PULADA. Sem isto, uma linha em branco no meio da tabela faz
// `name` sair `undefined`, e a primeira coisa que se faz com ele é chamar
// `.toLowerCase()` — o arquivo inteiro morre, o DB não monta e O JOGO NÃO ABRE,
// por um espaço. Já aconteceu: um separador em branco entre dois blocos de
// espécies derrubou o jogo inteiro, e o erro que aparecia era "name is
// undefined", que não diz nada sobre tabela nenhuma.
for (const line of TABLE.trim().split("\n")) {
  if (!line.trim()) continue;
  const [dex, name, types, hp, atk, def, spa, spd, spe] = line.trim().split(/\s+/);
  const base = { hp: +hp, atk: +atk, def: +def, spa: +spa, spd: +spd, spe: +spe };
  const bst = Object.values(base).reduce((a, b) => a + b, 0);
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "");
  EXTRA[id] = {
    id, dex: +dex, name, types: types.split("/"), base, bst, foreign: true,
    dexText: LORE[id],
    catchRate: bst >= 600 ? 3 : bst >= 500 ? 45 : 120,
    xpYield: Math.floor(bst / 4),
  };
}

// as formas do ZYGARDE têm desenho próprio (ids de FORMA da PokeAPI, baixados
// por tools/fetch_sprites.py): o 10% é um cachorro, o COMPLETO é um gigante
EXTRA.zygarde10.spriteDex = 10181;
EXTRA.zygardecompleto.spriteDex = 10120;
// AS FORMAS DO DEOXYS com o desenho delas (pedido do CAIO, nov/2026: "baixe todos os
// sprites do deoxys"): o do BLACK/WHITE parado, de costas e shiny, o animado (gen5ani)
// e o de andar/voar do PMD. Antes as três usavam o desenho do DEOXYS normal.
EXTRA.deoxysataque.spriteDex = 10001;
EXTRA.deoxysdefesa.spriteDex = 10002;
EXTRA.deoxysvelocidade.spriteDex = 10003;

// A CÉLULA DE ZYGARDE (pedido do CAIO, nov/2026: o MINI ZYGARDE do espaço vira
// CÉLULA): a gotinha verde com o núcleo vermelho. Desenho meu, pixel por pixel
// (tools/celula/desenha.py: frente, costas e andando). O grito é o do 10% bem fininho.
EXTRA.celulazygarde = {
  id: "celulazygarde", dex: 718, name: "CÉLULA ZYGARDE", types: ["DRAGÃO", "TERRA"], spriteDex: 31050, foreign: true,
  formaDe: "zygarde", learnsetDe: "zygarde10",
  base: { hp: 20, atk: 25, def: 30, spa: 20, spd: 30, spe: 40 }, bst: 165, catchRate: 200, xpYield: 40,
  dexText: "UM PEDACINHO DO ZYGARDE. SOZINHA NÃO PENSA EM NADA, MAS SENTE AS OUTRAS CÉLULAS DE LONGE.",
};
// o 200% não existe em jogo nenhum: a base é do CAIO (tools/zygarde200_base.png,
// desenhada em dev/pixelart.html) e o acabamento é tools/acabar_zygarde200.py.
// O desenho, nas palavras dele: o azul do peito é a BOCA, e o ponto branco
// dentro dela é o NÚCLEO BRANCO; os detalhes vermelhos são do NÚCLEO VERMELHO
// (Z1) e os azuis, do NÚCLEO AZUL (Z2) — a capa de um lado e do outro, as
// marcas dos braços e os olhos das pontas da crista.
EXTRA.zygarde200.spriteUrl = "assets/sprites/pokemon/zygarde200.png";
// as costas: o mesmo corpo visto de trás (tools/costas_zygarde200.py)
EXTRA.zygarde200.spriteCostasUrl = "assets/sprites/pokemon/back/zygarde200.png";
// A LUZ NULA é o golpe das células: toda forma aprende no 50. No 200% ela
// vira a EXPLOSÃO DA VIDA OU MORTE (`trocaGolpe`, src/systems/mon.js `evolveTo`),
// e volta a ser LUZ NULA quando ele sai do 200%
for (const id of ["zygarde10", "zygarde", "zygardecompleto"]) EXTRA[id].learnsetExtra = [[50, "luznula"]];
EXTRA.zygarde200.learnsetExtra = [[50, "explosaovidaoumorte"]];
EXTRA.zygarde200.trocaGolpe = { luznula: "explosaovidaoumorte" };

// O ETERNATUS ETERNAMAX (nov/2026, o CAIO pediu um teste com ele): a forma
// gigante do SWORD/SHIELD, com o desenho oficial da PokeAPI (10190, baixado por
// tools/fetch_sprites.py --only 10190) e o andar do PMD (forma "Eternamax")
EXTRA.eternatuseternamax = {
  id: "eternatuseternamax", dex: 890, name: "ETERNATUS ETERNAMAX", types: ["VENENO", "DRAGÃO"], spriteDex: 10190, foreign: true,
  formaDe: "eternatus", learnsetDe: "eternatus",
  base: { hp: 255, atk: 115, def: 250, spa: 125, spd: 250, spe: 130 }, bst: 1125, catchRate: 3, xpYield: 345,
  dexText: "O CORPO DELE CRESCEU ATÉ O CÉU COM A ENERGIA DA ESCURIDÃO. O NÚCLEO NO PEITO NUNCA PARA DE BRILHAR.",
};

/** O CUBO ZYGARDE: guarda as células do ZYGARDE. Usado nele, junta ou
 *  espalha as células e ele muda de forma (10%, 50%, COMPLETO ou 200%) — com a
 *  cutscene de evolução, no tema verde das células (src/scenes/evolution.js).
 *  Não se gasta, como o CATÁLOGO ROTOM. Vem da missão O Z DO DNA. O 200% só
 *  aparece pra quem já está COMPLETO (o terceiro item da opção: de quem). */
export const CUBO_ZYGARDE = {
  item: "cubo zygarde",
  aceita: ["zygarde10", "zygarde", "zygardecompleto", "zygarde200"],
  opcoes: [["zygarde10", "10% (CACHORRO)"], ["zygarde", "50%"], ["zygardecompleto", "COMPLETO"],
           ["zygarde200", "200%", ["zygardecompleto", "zygarde200"]]],
  pergunta: "O CUBO PULSA VERDE. QUANTAS CÉLULAS {MON} JUNTA?",
  jaE: "{MON} JÁ ESTÁ NESSA FORMA.",
  nada: "O CUBO FICA APAGADO. SÓ AS CÉLULAS DE UM ZYGARDE RESPONDEM A ELE.",
  // a cutscene: o mesmo filme da evolução, com outras palavras e o tema verde
  cena: {
    tema: "zygarde",
    inicio: "O CUBO ACENDE! AS CÉLULAS DE {MON} ESTÃO SE REORGANIZANDO!",
    fim: "AS CÉLULAS SE ASSENTARAM! {MON} AGORA É {NOVO}!",
  },
};

/** A CAÇADA DO ZYGARDE (a missão O Z DO DNA). Ele não espera parado como os
 *  outros: as CÉLULAS do fundo do TÚNEL ROCHA se juntam num ZYGARDE 10% e ele
 *  FOGE; achado, junta mais células e vira o 50%, e foge; achado de novo,
 *  vira o COMPLETO, e foge também. Cada forma foge tantos tiles quanto a
 *  porcentagem dela (contados a pé): o 10% vai 10 tiles, o 50% vai 50 e o
 *  COMPLETO vai 100 — até a ROTA 10, onde ele espera e luta. Cada etapa é onde
 *  ele está (`forma`) e no que vira quando você chega (`vira`); a última é o
 *  COMPLETO esperando, que é um chefe (src/scenes/overworld.js, `zygardeNpcs`
 *  e `andarZygarde`). `dica` é o que o OBJETIVO diz, e `rastro` é o caminho
 *  das CÉLULAS VERDES no chão até ele: [mapa, de, até] em cada mapa por onde
 *  ele passou (`rastroZygarde`). */
export const ZYGARDE_CACADA = {
  missao: "z-do-dna",
  // antes de tudo: 200 CÉLULAS guardadas no CUBO (pedido do CAIO, nov/2026)
  precisa: 200,
  nivel: 60,
  etapas: [
    {
      mapa: "rock_tunnel_b1f", x: 24, y: 20, forma: "zygardeenxame", vira: "zygarde10",
      dica: "SIGA AS CÉLULAS VERDES ATÉ O FUNDO DO TÚNEL ROCHA (O ANDAR DE BAIXO).",
      // das duas escadas que chegam neste pedaço do B1F
      rastro: [["rock_tunnel_b1f", [38, 28], [24, 20]], ["rock_tunnel_b1f", [33, 3], [24, 20]]],
      lines: [
        "O TÚNEL SE ABRE NUMA SALA QUE NÃO ESTÁ EM MAPA NENHUM.",
        "O CHÃO ESTÁ COBERTO DE PONTINHOS VERDES QUE SE MEXEM JUNTOS.",
        "ELES SENTIRAM VOCÊ. ESTÃO SE JUNTANDO!",
      ],
      virou: ["AS CÉLULAS VIRARAM UM ZYGARDE 10%!", "É UM CACHORRO MAGRO E PRETO. ELE OLHA PRA VOCÊ..."],
      fugiu: ["...E SAI CORRENDO! MAS O 10% É PEQUENO: NÃO DEVE TER IDO LONGE."],
    },
    {
      // 10 tiles dali, no corredor do leste
      mapa: "rock_tunnel_b1f", x: 34, y: 20, forma: "zygarde10", vira: "zygarde",
      dica: "O ZYGARDE 10% FUGIU AQUI PERTO, NO CORREDOR DO LESTE DO TÚNEL ROCHA (ANDAR DE BAIXO).",
      rastro: [["rock_tunnel_b1f", [24, 20], [34, 20]]],
      lines: [
        "O ZYGARDE 10% ESTÁ PARADO NO CORREDOR, OFEGANDO.",
        "MAIS CÉLULAS SAEM DAS PEDRAS E CORREM ATÉ ELE!",
      ],
      virou: ["O ZYGARDE VIROU O 50%!", "AGORA É UMA SERPENTE EM PÉ, COM UM LEQUE ESCURO NA CABEÇA."],
      fugiu: ["ELE SE ENROLA E DESLIZA PRA LONGE, LÁ PRO FUNDO DO SUL DO TÚNEL!"],
    },
    {
      // 50 tiles dali, no canto de baixo do B1F
      mapa: "rock_tunnel_b1f", x: 34, y: 36, forma: "zygarde", vira: "zygardecompleto",
      dica: "O ZYGARDE 50% FUGIU PRO SUL DO ANDAR DE BAIXO DO TÚNEL ROCHA, PERTO DA ESCADA.",
      rastro: [["rock_tunnel_b1f", [34, 20], [34, 36]]],
      lines: [
        "O ZYGARDE 50% ESTÁ NO CANTO DO TÚNEL, ENROLADO.",
        "TODAS AS CÉLULAS DO TÚNEL ESTÃO VINDO PRA CÁ!",
      ],
      virou: ["É O ZYGARDE COMPLETO!", "O NÚCLEO DO PEITO BRILHA..."],
      fugiu: ["...E ELE SOBE A ESCADA CORRENDO! O ZYGARDE COMPLETO SAIU DO TÚNEL, PRA ROTA 10!"],
    },
    {
      // 100 tiles dali: a escada, o 1F inteiro até a saída norte, e a ROTA 10
      // até o canto de cima
      mapa: "route10", x: 3, y: 7, forma: "zygardecompleto",
      dica: "O ZYGARDE COMPLETO SAIU DO TÚNEL ROCHA PELA SAÍDA DE CIMA. ELE ESTÁ NA ROTA 10, NO CANTO DO NORTE.",
      rastro: [["rock_tunnel_b1f", [34, 36], [38, 28]], ["rock_tunnel_1f", [45, 2], [17, 2]], ["route10", [8, 19], [3, 7]]],
      lines: ["O ZYGARDE COMPLETO ESTÁ DE PÉ NO CANTO DA ROTA, ESPERANDO VOCÊ.", "DESSA VEZ ELE NÃO FOGE. ELE VAI LUTAR!"],
    },
  ],
};

/** encontros dentro da dimensão, por terreno */
export const DIM_ENCOUNTERS = {
  // terra: fóssil remontado errado e coisa pesada demais pra flutuar
  terra: [
    { id: "porygon", min: 15, max: 28, w: 14 },   // o alvo do UP-GRADE (ver loot.js)
    { id: "cranidos", min: 18, max: 32, w: 20 },
    { id: "rampardos", min: 30, max: 44, w: 8 },
    { id: "shieldon", min: 18, max: 32, w: 20 },
    { id: "bastiodon", min: 30, max: 44, w: 8 },
    { id: "lileep", min: 18, max: 30, w: 14 },
    { id: "anorith", min: 18, max: 30, w: 14 },
    { id: "golett", min: 20, max: 32, w: 14 },
    { id: "bronzor", min: 18, max: 30, w: 12 },
    { id: "unown", min: 12, max: 40, w: 10 },
    { id: "porygon2", min: 22, max: 36, w: 12 },
    { id: "porygonz", min: 28, max: 42, w: 8 },
    { id: "dracozolt", min: 30, max: 44, w: 20 },
    { id: "arctozolt", min: 30, max: 44, w: 16 },
    { id: "elgyem", min: 20, max: 32, w: 14 },
    { id: "smeargle", min: 18, max: 34, w: 12 },
    { id: "meltan", min: 20, max: 34, w: 14 },      // a gota de metal (IMÃ: come golpe de AÇO)
    { id: "melmetal", min: 40, max: 50, w: 2 },
  ],
  // água: o que a fenda copiou do mar, metade certo
  agua: [
    { id: "tirtouga", min: 18, max: 32, w: 22 },
    { id: "shieldon", min: 18, max: 32, w: 16 },
    { id: "bastiodon", min: 30, max: 44, w: 6 },
    { id: "cryogonal", min: 26, max: 40, w: 12 },
    { id: "klink", min: 18, max: 30, w: 10 },
    { id: "unown", min: 12, max: 40, w: 8 },
    { id: "porygon2", min: 22, max: 36, w: 22 },
    { id: "porygonz", min: 28, max: 42, w: 12 },
    { id: "dracovish", min: 30, max: 44, w: 16 },
    { id: "arctovish", min: 30, max: 44, w: 16 },
  ],
  // ar (o vazio no meio): só o que não precisa de chão
  ar: [
    { id: "porygon", min: 18, max: 30, w: 14 },
    { id: "archen", min: 20, max: 34, w: 16 },
    { id: "rotom", min: 22, max: 36, w: 14 },
    { id: "lunatone", min: 24, max: 38, w: 12 },
    { id: "solrock", min: 24, max: 38, w: 12 },
    { id: "cryogonal", min: 26, max: 40, w: 10 },
    { id: "shedinja", min: 20, max: 34, w: 8 },
    { id: "litwick", min: 18, max: 30, w: 18 },     // as velas: só no vazio,
    { id: "lampent", min: 26, max: 38, w: 12 },     // onde a chama é a única
    { id: "chandelure", min: 34, max: 46, w: 5 },   // coisa que se vê

    { id: "unown", min: 12, max: 40, w: 10 },
    { id: "porygon2", min: 24, max: 38, w: 22 },
    { id: "porygonz", min: 30, max: 45, w: 20 },
    { id: "beheeyem", min: 28, max: 40, w: 12 },
    { id: "genesect", min: 40, max: 52, w: 4 },
  ],
};

/** As formas que o DEOXYS assume em BIRTH ISLAND, na ordem em que ele volta.
 *  Todas com o mesmo nº de Pokédex: o sprite é o mesmo, os atributos não. */
export const DEOXYS_FORMS = ["deoxys", "deoxysataque", "deoxysdefesa", "deoxysvelocidade"];

/** O intruso: não é de terreno nenhum, pode aparecer em qualquer tufo de mato
 *  da dimensão — e é mais raro que os três lendários do clima. */
export const RARE_LEGEND = { id: "deoxys", chance: 0.0008, min: 45, max: 60 };

// A FUSÃO SELVAGEM.
//
// Fusão é coisa de máquina: ela sai do DECODIFICADOR, com dois Pokémon seus
// dentro. Mas uma vez a cada MUITAS a grama devolve uma pronta, já feita, que
// ninguém fundiu — e é a LAPROCUNO, a do acervo, com o desenho e tudo.
//
// A chance é por encontro, não por passo: com a grama chamando 11% das vezes,
// 1/4096 aqui dá um a cada ~37 mil passos no mato. É pra ser história de
// jogador, não item de lista. Se a ficha dela sumir do acervo, a espécie ainda
// existe (`garantirEspecie` remonta a automática) — o encontro não quebra.
/** A FUSÃO SELVAGEM: uma só, raríssima, e ELA TEM ENDEREÇO.
 *
 *  Sem `mapas` ela saía em qualquer grama de Kanto, e um LAPROCUNO — LAPRAS com
 *  ARTICUNO, água e gelo — aparecendo na FLORESTA VIRIDIAN não é raridade, é
 *  erro de lugar. Agora ela mora em volta de CINNABAR, no mar entre a ilha e a
 *  CIDADE DE PALLET.
 *
 *  E A CHANCE SUBIU MUITO, de 1 em 4096 pra 1 em 220. Não é generosidade, é a
 *  troca: raríssima em Kanto inteira, ela era um acidente que ninguém procurava
 *  — e agora que tem endereço, 1 em 4096 num pedaço só de mato seria pior
 *  ainda, porque você saberia ONDE e mesmo assim não acharia. Coisa com lugar
 *  certo tem que ser achável indo até lá; é isso que transforma um número raro
 *  numa história que alguém conta.
 *
 *  A ROTA 21 NORTE É A ÚNICA QUE FUNCIONA HOJE, e é de propósito que as outras
 *  estão escritas: `route21_south` tem tabela mas ainda não tem grama alta, e a
 *  ilha e a ROTA 20 não têm tabela nenhuma. No dia em que ganharem, a fusão já
 *  está esperando lá — e até lá elas não atrapalham, porque o sorteio nem chega
 *  perto num mapa sem tabela. */
export const FUSAO_SELVAGEM = {
  id: "fus-articuno-lapras~laprocuno",
  chance: 1 / 220, min: 30, max: 42,
  mapas: ["route21_north", "route21_south", "route20", "cinnabar_island"],
};

/** chance do lendário aparecer no terreno dele (0.3%) */
export const TRIO_CHANCE = 0.003;

/** a cada N Pokémon vistos na dimensão, um vem shiny */
export const SHINY_EVERY = 2956;

/** As três forças da natureza, na ordem em que a tempestade entrega:
 *  o vento primeiro, o raio quando o vento sai, e o chão quando os dois somem
 *  — que é o que acalma os outros dois. */
export const TEMPESTADE = ["tornadus", "thundurus", "landorus"];

/** OS TRÊS PARADOS EM KANTO.
 *  XERNEAS, YVELTAL e ZYGARDE não aparecem na grama nem vêm da fenda: eles
 *  estão PARADOS, cada um num lugar, esperando. Você anda até lá e encosta.
 *
 *  O DIALGA e o PALKIA entraram na mesma regra. Se o ARCEUS está aqui, os dois
 *  que ele fez pra segurar o TEMPO e o ESPAÇO têm que estar — e num jogo em que
 *  o cartucho já está furado, eles são exatamente o que se procuraria: quem
 *  cuida da hora e quem cuida do lugar, nos dois pontos de Kanto em que a hora e
 *  o lugar pararam de bater (ver a missão de cada um em src/data/missoes.js).
 *
 *  Só que o lugar não se acha sozinho: cada um tem uma missão que conta ONDE
 *  procurar (O X MARCA O LUGAR, O Y DA MORTE, O Z DO DNA — src/data/missoes.js),
 *  e enquanto o pedido não for aceito a clareira é só clareira, a usina é só
 *  usina e o túnel é só túnel.
 *  Derrubar sem capturar não resolve — saia do mapa e volte, e ele está lá de
 *  novo, no mesmo lugar. (A tela que monta esses NPCs é src/scenes/overworld.js;
 *  o nível e as falas saem daqui e têm hot-swap.)
 */
export const ESTATICOS = [
  // OS 5 MINIORS SHINY da CHUVA DE MINIORS (src/data/missoes.js): um em cada
  // andar da CHAPADA DOS VEADEIROS. Só aparecem depois que caem (a cutscene
  // marca `miniorsCairam`); `chave` separa os cinco (são a mesma espécie)
  // SÓ TRAZER, NÃO PEGAR (o CAIO): encostar não abre batalha — `levar` faz
  // você levar ele com cuidado (marca a bandeira e ele some do chão). Cada um
  // tem um NÚCLEO de uma cor, que é como você escolhe o seu no fim.
  ...[[24, 4], [10, 11], [22, 17], [25, 25], [24, 35]].map(([x, y], i) => ({
    id: "minior", chave: `minior_${i + 1}`, mapa: "chapada", x, y, nivel: 38,
    missao: "chuva-de-miniors", aparece: "miniorsCairam", shiny: true, flagCaptura: `miniorShiny${i + 1}`,
    levar: true,
    lines: ["UM MINIOR CAÍDO DO CÉU, AINDA QUENTE. A CASCA ESTÁ RACHADA E SAI UM BRILHO DE DENTRO.",
            "ELE ESTÁ TONTO DA QUEDA. VOCÊ PEGA ELE NO COLO COM CUIDADO PRA LEVAR PRA ASTRÔNOMA."],
  })),
  {
    // AS CORES TRAVADAS (a missão da CAÇADORA DE CORES de Viridian): o último
    // shiny de Kanto, escondido no lado oeste da ROTA 2. Pegar ele é o que a
    // missão pede; entregar libera os shinys no jogo inteiro (shiniesLiberados,
    // src/systems/mon.js). Derrubou sem pegar? Sai do mapa e ele volta.
    id: "pikachu", mapa: "route2", x: 8, y: 74, nivel: 12,
    missao: "cores-travadas", shiny: true, flagCaptura: "pikachuShinyPego",
    lines: [
      "UM PIKACHU... MAS A COR ESTÁ ERRADA. MAIS LARANJA, MAIS QUENTE.",
      "É O ÚNICO BICHO DE KANTO QUE A TRAVA NÃO PEGOU.",
      "ELE ESTÁ SOLTANDO FAÍSCA. NÃO VAI SE ENTREGAR FÁCIL!",
    ],
  },
  {
    // O TORNADUS no meio do CÉU DAS NUVENS (src/data/espaco.js): o dono do tornado
    id: "tornadus", mapa: "ceu_nuvens", x: 26, y: 3, nivel: 60,
    lines: ["UM VULTO VERDE GIRANDO EM CIMA DE UMA NUVEM. É O TORNADUS, O GÊNIO DO VENTO!", "FOI ELE QUE FEZ O TORNADO. E ELE NÃO GOSTOU NADA DE VOCÊ TER ENTRADO NO OLHO DELE!"],
  },
  {
    // O MITO DO CAMINHÃO (src/core/caminhao.js): embaixo do caminhão do cais de
    // VERMILION. Só aparece depois que você empurra com FORÇA.
    id: "mew", chave: "mew_caminhao", mapa: "vermilion_city", x: 36, y: 30, nivel: 30,
    aparece: "mewCaminhao", flagCaptura: "mewCaminhaoPego",
    lines: ["MEW!", "ELE ESTAVA ESCONDIDO EMBAIXO DO CAMINHÃO ESSE TEMPO TODO!"],
  },
  {
    // O BLACEPHALON CONTRA ARCEUS (a missão do youtuber, src/data/missoes.js): ALFA,
    // e a animação dele fica SÓ nos quadros 0 a 76 — o "six seven" das mãos; os
    // quadros 77+ (a cabeça voando e explodindo) ele nunca faz
    id: "blacephalon", mapa: "route25", x: 50, y: 7, nivel: 67,
    missao: "blacephalon-contra-arceus", alfa: true, soQuadros: [0, 76], flag: "blacephalonContraArceus",
    lines: [
      "UM BLACEPHALON ENORME, DE PÉ NO MEIO DA ROTA.",
      "AS MÃOS DELE SOBEM E DESCEM. SOBEM E DESCEM. SIX... SEVEN... SIX... SEVEN...",
      "ELE NÃO PARA. ELE NUNCA PAROU. ISSO É CONTRA ARCEUS.",
    ],
  },
  {
    // O POKÉMON DIVINO. Ele não está num mapa de Kanto: aparece no meio da
    // 011GLITCHDIMENSION110, no vazio entre as ilhas — o único lugar deste jogo
    // que não foi feito por ninguém. E só depois que a missão o encontra.
    id: "arceus", mapa: "glitchdim", x: 20, y: 20, nivel: 70,
    missao: "pokemon-divino",
    lines: [
      "O CHÃO ACABA E ELE ESTÁ PARADO EM CIMA DE NADA.",
      "NÃO É QUE ELE FLUTUE: O VAZIO É QUE ENCOSTA NELE COMO SE FOSSE CHÃO.",
      "AS PLACAS DO ANEL GIRAM SOZINHAS, UMA DE CADA COR, E NENHUMA REPETE.",
      "ELE ESTAVA AQUI ANTES DA FENDA. TALVEZ ANTES DO JOGO.",
    ],
  },
  {
    id: "xerneas", mapa: "viridian_forest", x: 23, y: 31, nivel: 60,
    missao: "x-marca-o-lugar",
    lines: [
      "NO FUNDO DA FLORESTA TEM UMA CLAREIRA QUE NINGUÉM ABRIU.",
      "O MATO EM VOLTA ESTÁ MAIS VERDE DO QUE DEVIA, EM CÍRCULO.",
      "OS CHIFRES DELE ESTÃO ACESOS E NÃO É LUZ DO SOL.",
    ],
  },
  {
    id: "yveltal", mapa: "power_plant", x: 24, y: 16, nivel: 60,
    missao: "y-da-morte",
    lines: [
      "A USINA NUNCA VOLTOU A FUNCIONAR — E NINGUÉM EXPLICOU POR QUÊ.",
      "AS ASAS DELE ESTÃO ABERTAS EM CIMA DO GERADOR MORTO.",
      "AS PONTAS BRILHAM VERMELHO. É A ÚNICA COISA COM ENERGIA AQUI DENTRO.",
    ],
  },
  {
    // O TEMPO. No último andar da TORRE POKÉMON, que é o andar onde ninguém
    // envelhece — é um cemitério: o que está lá em cima parou de contar os anos
    // antes de você nascer. O nível é o do ARCEUS: os dois vieram da mesma mão.
    id: "dialga", mapa: "pokemon_tower_7f", x: 11, y: 8, nivel: 70,
    missao: "o-tempo-parado",
    lines: [
      "O ÚLTIMO ANDAR DA TORRE ESTÁ EM SILÊNCIO — E O SILÊNCIO TEM UM ZUMBIDO GRAVE.",
      "AS VELAS DAQUI ESTÃO ACESAS HÁ ANOS E NÃO DERRETERAM UM DEDO.",
      "ELE ESTÁ PARADO NO MEIO DA SALA COM A PLACA DO PEITO BATENDO DEVAGAR.",
      "CADA BATIDA É UM SEGUNDO. É ELE QUE ESTÁ CONTANDO.",
    ],
  },
  {
    // O ESPAÇO. No fundo da CAVERNA PERDIDA, que são catorze salas de onze por
    // onze que não fecham conta nenhuma: você sai por uma porta e chega numa
    // sala que não fica do lado dela. A caverna já era assim antes de ele
    // aparecer aqui — ou ela é assim POR ISSO.
    id: "palkia", mapa: "five_island_lost_cave_room11", x: 5, y: 6, nivel: 70,
    missao: "o-espaco-dobrado",
    lines: [
      "ESTA SALA É IGUAL ÀS OUTRAS TREZE. SÓ QUE ELA NÃO CABE ONDE ESTÁ.",
      "A PORTA ATRÁS DE VOCÊ NÃO DEVOLVE PRA SALA DE ONDE VOCÊ VEIO.",
      "AS PÉROLAS DOS OMBROS DELE ESTÃO ABERTAS, E ATRÁS DELAS NÃO TEM PAREDE.",
      "TEM MAIS CAVERNA. MUITO MAIS CAVERNA DO QUE A ILHA INTEIRA COMPORTA.",
    ],
  },
];
