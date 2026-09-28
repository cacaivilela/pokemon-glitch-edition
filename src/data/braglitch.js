// BRAGLITCH — a outra região.
//
// Do outro lado do mar, ao sul de Kanto, tem uma terra que o cartucho nunca
// mostrou. Ela não vem do FireRed: cada mapa daqui é desenhado em código (a
// planta está nas tabelas de texto lá embaixo, e src/core/assets.js pinta), e
// cada bicho que só existe aqui ou foi desenhado do zero (tools/braglitch_sprites.py)
// ou é uma FORMA BRAGLITCHIANA — o mesmo bicho de sempre, criado deste lado.
//
// A HISTÓRIA É OUTRA, E O GLITCH TAMBÉM. Kanto tem a fenda: um buraco pra fora
// do jogo. Braglitch teve O APAGÃO: a luz caiu no meio de uma gravação, e desde
// então os dados da região são lidos meio fora de ordem. O povo não fala em
// "erro de leitura" — fala em SACI. E os dois estão certos: os REDEMOINHOS que
// aparecem na BR-101 trocam bicho de lugar, embaralham o mato, e no meio de
// cada um alguma coisa assobia.
//
// DÁ PRA COMEÇAR AQUI OU EM KANTO (a escolha é na tela de título), e dá pra ir
// e voltar: o BARQUEIRO do píer de SÃO LUCARIO DO SUL e o marinheiro da balsa
// das SEVII fazem a mesma linha — KANTO, BRAGLITCH e as ilhas.

import { slugify } from "./gen1.js";
import * as mundo from "./braglitch-mundo.js";

// ------------------------------------------------------------- A REGIÃO
export const BRAGLITCH = {
  nome: "BRAGLITCH",
  /** onde nasce quem começa aqui: no quarto... na sala de casa, como em Kanto */
  inicio: "bra_casa",
  /** o píer: onde o barqueiro fica e onde o barco te deixa */
  porto: { mapa: "sao_lucario", barqueiro: { x: 15, y: 25, dir: "right" }, chegada: { x: 14, y: 24 } },
  /** os três da mesa da PROFA. IPÊ, na ordem de sempre: PLANTA, FOGO, ÁGUA */
  iniciais: ["tronky", "diggle", "tilapish"],
};

// ------------------------------------------------------- AS ESPÉCIES NOVAS
// Número de Pokédex depois dos três extras da nacional (1026-1028). O sprite é
// o arquivo com esse número (assets/sprites/pokemon/1029.png), desenhado por
// tools/braglitch_sprites.py.
//
//   dex | NOME | TIPOS | HP ATK DEF SPA SPD SPE
const NOVAS = `
1029 | DIGGLE   | FOGO/TERRA     |  45  62  42  55  45  63
1030 | TILAPISH | ÁGUA           |  52  50  52  60  50  50
1031 | TRONKY   | PLANTA/SOMBRIO |  55  58  60  45  55  40
1032 | SACI     | SOMBRIO/GLITCH |  70 100  70 110  80 150
1033 | TRONCUDO       | PLANTA/SOMBRIO   |  70  75  80  55  70  50
1034 | PAUBRASILISCO  | PLANTA/SOMBRIO   |  90 110 100  70  90  70
1035 | BRASEAGLE      | FOGO/TERRA       |  60  80  55  70  55  85
1036 | MAGMASTIM      | FOGO/TERRA       |  85 115  75  90  70  95
1037 | TILAPISCO      | ÁGUA             |  70  65  65  75  65  65
1038 | TILAPIRAÇU     | ÁGUA/LUTADOR     |  95 110  90  80  80  75
1039 | CAPIVARINHA    | NORMAL/ÁGUA      |  60  45  50  35  50  35
1040 | CAPIVARÃO      | NORMAL/ÁGUA      | 100  75  85  55  85  50
1041 | BIQUINHO       | NORMAL/VOADOR    |  40  50  35  30  35  60
1042 | TUCANAÇU       | NORMAL/VOADOR    |  70  90  60  55  60  90
1043 | TATUBOLA       | TERRA            |  50  60  90  20  40  30
1044 | TATURRÃO       | TERRA/AÇO        |  75  95 130  30  65  45
1045 | SAUVINHA       | INSETO/PLANTA    |  40  55  50  25  40  45
1046 | SAUVARAINHA    | INSETO/PLANTA    |  75 100  90  50  70  60
1047 | AÇAIZINHO      | PLANTA/VENENO    |  45  40  45  60  50  40
1048 | AÇAIZEIRO      | PLANTA/VENENO    |  80  70  80 100  85  50
1049 | GUARANINHO     | PLANTA/PSÍQUICO  |  50  40  50  70  70  60
1050 | VITORIRÉGIA    | PLANTA/ÁGUA      |  80  55  80  95  95  45
1051 | PIRANHITA      | ÁGUA/SOMBRIO     |  45  75  40  30  35  75
1052 | PIRANHORDA     | ÁGUA/SOMBRIO     |  70 115  60  55  60 110
1053 | CARANGUEJINHO  | ÁGUA/ELÉTRICO    |  45  60  70  45  40  40
1054 | MANGUEBIT      | ÁGUA/ELÉTRICO    |  75  95 105  85  70  50
1055 | BOTINHO        | ÁGUA/FADA        |  55  45  50  60  60  70
1056 | ENCANTADO      | ÁGUA/FADA        |  85  70  75 100  95  95
1057 | PIRARUCU       | ÁGUA/PEDRA       | 100  95 110  50  70  45
1058 | MACACOEIRA     | LUTADOR          |  50  70  45  30  45  80
1059 | GINGÃO         | LUTADOR/NORMAL   |  80 110  70  45  70 115
1060 | FOGUEIRINHA    | FOGO             |  45  55  40  60  45  55
1061 | FOGUEIRÃO      | FOGO/NORMAL      |  80  90  70 100  70  75
1062 | BALÃOZINHO     | FOGO/VOADOR      |  55  40  45  85  65  95
1063 | MANDACARU      | PLANTA/TERRA     |  75  85  95  55  75  40
1064 | GATONET        | ELÉTRICO/SOMBRIO |  60  80  50  80  50 100
1065 | GAMBIARRA      | ELÉTRICO/GLITCH  |  70  60  95 100  75  50
1066 | ORELHÃO        | ELÉTRICO/NORMAL  |  85  50 100  85  95  30
1067 | PENADINHA      | FANTASMA/FOGO    |  40  35  40  70  60  65
1068 | ASSOMBRAÇÃO   | FANTASMA/FOGO    |  65  55  65 110 100  90
1069 | LOBISOMEM      | SOMBRIO/LUTADOR  |  85 115  75  50  65  95
1070 | BEIJAFLORZINHA | FADA/VOADOR      |  40  35  35  60  50  90
1071 | PLUMÁRIO       | FADA/VOADOR      |  70  60  65 100  85 115
1072 | BRIGADEIRINHO  | FADA             |  75  50  65  80  80  40
1073 | CHUVISCO       | GLITCH/NORMAL    |  60  55  60  95  70  90
1074 | CONCRETÃO      | PEDRA/GLITCH     |  90 105 130  60  90  30
1075 | ARARAIO        | ELÉTRICO/VOADOR  |  65  75  55  95  60 105
1076 | BOITATÁ        | FOGO/FANTASMA    |  90  85  90 125 100  90
1077 | IARA           | ÁGUA/PSÍQUICO    |  95  70  90 120 115  90
1078 | CURUPIRA       | PLANTA/FANTASMA  |  90 115  90  85  90 110
1079 | BANTEVY        | NORMAL/VOADOR    |  45  55  40  45  40  75
1080 | BANGVEET       | NORMAL/VOADOR    |  75  95  65  90  65 110
1081 | LOROSÉ         | NORMAL/FADA      |  75  60  70  95  85  75
1082 | ZEROGLE        | FANTASMA         |  65  70  55  90  70 105
1083 | SANDBASH       | TERRA/NORMAL     | 100 115 125  45  80  70
1084 | SUBMARINUM     | ÁGUA/AÇO         |  90  85 110  80  90  60
1085 | CATORBIS       | VOADOR/AÇO       |  70  80  75  95  70 115
1086 | TRATORÃO       | TERRA/AÇO        | 110 110 115  50  70  45
1087 | BRITADEIRO     | PEDRA/AÇO        |  80 120 105  40  60  85
1088 | ROÇADOR        | PLANTA/AÇO       |  75 100  80  60  70 100
1089 | AMAZONIUM      | PLANTA/FADA      | 110  90 110 130 130 110
1090 | DESTROIUM      | SOMBRIO/AÇO      | 100 150 120 120  90 100
1091 | ENCONTRIUM     | ÁGUA/DRAGÃO      | 110 115 110 115 110 120
`;

const LORE_NOVAS = {
  diggle: "FILHOTE DE FARO BOM. CAVA ATRÁS DE OSSO E ACHA BRASA: A TERRA DE BRAGLITCH É QUENTE POR BAIXO.",
  tilapish: "VIVE EM QUALQUER AÇUDE, EM QUALQUER ÁGUA, EM QUALQUER CONDIÇÃO. NINGUÉM SABE DE ONDE VEIO — SÓ QUE CHEGOU E FICOU.",
  tronky: "MUDA DE PAU-BRASIL. POR BAIXO DA CASCA ESCURA O CERNE É VERMELHO, E FOI ESSA TINTA QUE DEU NOME À TERRA.",
  saci: "UMA PERNA SÓ, GORRO VERMELHO E UM REDEMOINHO NO LUGAR DO CHÃO. QUEM PEGA O GORRO DELE, MANDA NELE.",
  troncudo: "A CASCA ENGROSSOU E RACHOU. PELAS RACHADURAS ESCORRE UMA SEIVA VERMELHA QUE MANCHA TUDO O QUE ENCOSTA.",
  paubrasilisco: "OS ANTIGOS DERRUBARAM A MATA INTEIRA ATRÁS DA TINTA DELE. ELE LEMBRA DE CADA ÁRVORE, E NÃO PERDOA NENHUMA.",
  braseagle: "O FARO FICOU TÃO BOM QUE ELE SENTE O CHEIRO DA LAVA ANDANDO EMBAIXO DO CHÃO. CAVA ATÉ ACHAR.",
  magmastim: "CÃO DE GUARDA DOS VULCÕES APAGADOS. SE ELE LATE, A TERRA ESQUENTA UM GRAU.",
  tilapisco: "SOBE O RIO CONTRA A CORRENTE SÓ PRA PROVAR QUE CONSEGUE. QUASE SEMPRE CONSEGUE.",
  tilapiracu: "AÇU QUER DIZER GRANDE. AS BARBATANAS VIRARAM PUNHOS, E ELE DEFENDE O AÇUDE COMO SE FOSSE O MAR.",
  capivarinha: "SENTA NA BEIRA DO RIO E ESPERA. TODO BICHO QUE PASSA ACABA SENTANDO DO LADO.",
  capivarao: "A CAPIVARA MAIS CALMA DO MUNDO. JÁ VIRAM UM JACARÉ, UM MACACO E TRÊS PÁSSAROS DORMINDO NAS COSTAS DELE.",
  biquinho: "O BICO É MAIOR QUE O RESTO DO CORPO. ELE CAI DE CARA NO CHÃO TODA VEZ QUE PARA DE BATER ASA.",
  tucanacu: "O BICO É LEVE COMO ISOPOR E DURO COMO MADEIRA. ELE DESCASCA FRUTA E INIMIGO DO MESMO JEITO.",
  tatubola: "QUANDO SE ASSUSTA, FECHA A CASCA E VIRA UMA BOLA PERFEITA. NINGUÉM CONSEGUE ABRIR — NEM ELE, ÀS VEZES.",
  taturrao: "AS PLACAS VIRARAM AÇO. CAVA UM TÚNEL POR NOITE E NUNCA SAI NO MESMO LUGAR.",
  sauvinha: "CARREGA UMA FOLHA DEZ VEZES MAIOR QUE ELA. SE VOCÊ PEGAR A FOLHA, O FORMIGUEIRO INTEIRO VEM BUSCAR.",
  sauvarainha: "A RAINHA NÃO CARREGA FOLHA NENHUMA: ELA PLANTA UM JARDIM DE FUNGO COM O QUE AS OUTRAS TRAZEM.",
  acaizinho: "CACHINHO DE AÇAÍ. QUEM COME DEMAIS FICA COM A BOCA ROXA E UM SONO QUE DURA A TARDE INTEIRA.",
  acaizeiro: "A PALMEIRA DOS CACHOS ROXOS. CRESCE TÃO ALTO QUE SÓ QUEM SOBE COM A PECONHA ALCANÇA.",
  guaraninho: "O FRUTO ABRE E PARECE UM OLHO. DIZEM QUE É O OLHO DE UM MENINO QUE A MATA NÃO DEIXOU FECHAR.",
  vitoriregia: "A FOLHA AGUENTA UMA CRIANÇA EM PÉ. A FLOR SÓ ABRE DE NOITE, BRANCA, E AMANHECE ROSA.",
  piranhita: "SOZINHA É SÓ UM PEIXINHO BRAVO. O PROBLEMA É QUE ELA NUNCA ESTÁ SOZINHA.",
  piranhorda: "NÃO É UMA PIRANHA: É O CARDUME INTEIRO QUE RESOLVEU ANDAR JUNTO NUM CORPO SÓ.",
  caranguejinho: "MORA NA LAMA DO MANGUE. A ANTENINHA DA CABEÇA PEGA RÁDIO DE LONGE — QUASE SEMPRE MÚSICA.",
  manguebit: "UMA ANTENA PARABÓLICA ENFIADA NA LAMA. TRANSMITE O BATUQUE DO MANGUE PRO MUNDO INTEIRO.",
  botinho: "BOTO-COR-DE-ROSA FILHOTE. SEGUE OS BARCOS DE PESCA SÓ PRA OUVIR A CONVERSA.",
  encantado: "EM NOITE DE FESTA SAI DO RIO DE CHAPÉU BRANCO E DANÇA ATÉ O DIA NASCER. O CHAPÉU ESCONDE O FURO DA CABEÇA.",
  pirarucu: "O PEIXE MAIS GRANDE DO RIO. AS ESCAMAS SÃO TÃO DURAS QUE O POVO USA COMO LIXA DE UNHA.",
  macacoeira: "APRENDEU A GINGA OLHANDO A RODA DA PRAÇA. NUNCA PARA QUIETO: ESTÁ SEMPRE NO MEIO DE UM GOLPE.",
  gingao: "O CHUTE DELE PASSA A UM DEDO DA SUA CABEÇA. SE ELE QUISESSE ACERTAR, TINHA ACERTADO.",
  fogueirinha: "NASCE NA NOITE DE SÃO JOÃO E PULA DE FESTA EM FESTA. QUEM PASSA POR CIMA DELA GANHA SORTE — OU UMA QUEIMADURA.",
  fogueirao: "A FOGUEIRA DO ARRAIÁ. ENQUANTO ELE ESTÁ ACESO, A QUADRILHA NÃO PARA.",
  balaozinho: "SOBE DEVAGAR NA NOITE DE JUNHO. É PROIBIDO SOLTAR, E ELE SABE — POR ISSO SOBE SOZINHO.",
  mandacaru: "QUANDO O MANDACARU FLORA NA SECA, É SINAL QUE A CHUVA CHEGA NO SERTÃO. ELE FLORA DE TEIMOSO.",
  gatonet: "MORA NO FIO PUXADO DO POSTE PRO VIZINHO. TODA A RUA TEM TV A CABO, E NINGUÉM PAGA.",
  gambiarra: "TRÊS EXTENSÕES, DOIS BENJAMINS E FITA ISOLANTE. NÃO DEVIA FUNCIONAR. FUNCIONA.",
  orelhao: "O TELEFONE PÚBLICO QUE NINGUÉM MAIS USA. ÀS VEZES ELE TOCA SOZINHO NA MADRUGADA, E ALGUÉM ATENDE.",
  penadinha: "ALMA PENADA PEQUENA. CARREGA UMA VELA ACESA PROCURANDO ALGUÉM PRA TERMINAR UMA CONVERSA.",
  assombracao: "MORA NOS CASARÕES DE PEDRA. ARRASTA CORRENTE, ACENDE O LAMPIÃO E CONTA A MESMA HISTÓRIA HÁ TREZENTOS ANOS.",
  lobisomem: "NA LUA CHEIA DE SEXTA-FEIRA, O LOBO-GUARÁ DO CERRADO FICA DE PÉ. E NÃO FICA NADA CALMO.",
  beijaflorzinha: "BATE AS ASAS OITENTA VEZES POR SEGUNDO. PARA NO AR NA FRENTE DA SUA CARA SÓ PRA TE OLHAR.",
  plumario: "O DESTAQUE DA AVENIDA. AS PLUMAS PESAM MAIS QUE ELE, E MESMO ASSIM ELE SAMBA A NOITE INTEIRA.",
  brigadeirinho: "NASCEU NUMA FESTA DE ANIVERSÁRIO E NUNCA FOI COMIDO. TODO MUNDO TENTA. NINGUÉM TEM CORAGEM.",
  chuvisco: "TV DE TUBO COM ANTENA DE PALHA DE AÇO. MOSTRA CHUVISCO — E, NO MEIO DO CHUVISCO, COISAS QUE NÃO ESTÃO PASSANDO.",
  concretao: "FEITO DE CONCRETO E CURVA. DIZEM QUE A CAPITAL INTEIRA FOI DESENHADA EM CIMA DELE.",
  araraio: "ARARA-AZUL QUE DORMIU NUM FIO DE ALTA TENSÃO. ACORDOU CARREGADA E NUNCA MAIS DESCARREGOU.",
  boitata: "A COBRA DE FOGO QUE PROTEGE OS CAMPOS. QUEM OLHA NOS OLHOS DELA FICA CEGO DE LUZ — OU LOUCO DE MEDO.",
  iara: "A MÃE-D'ÁGUA DOS RIOS. CANTA NA BEIRA E QUEM ESCUTA ESQUECE O CAMINHO DE VOLTA PRA CASA.",
  bantevy: "FAZ UM BARULHO BAIXINHO AO PIAR.",
  bangveet: "FAZ UM ESTRONDO QUE DÁ PRA OUVIR POR 1 KM.",
  amazonium: "O ESPÍRITO DA FLORESTA INTEIRA NUMA ÁRVORE SÓ. DIZEM QUE CADA FOLHA DELE É UMA ÁRVORE QUE AINDA VAI NASCER.",
  destroium: "A MÁQUINA QUE O SERVIDOR USAVA PRA APAGAR DADO VELHO. ACORDOU NO APAGÃO E NÃO SABE MAIS O QUE É VELHO.",
  encontrium: "DUAS ÁGUAS CORREM NO SEU CORPO SEM SE MISTURAR. ONDE ELE NADA, A MATA E A MÁQUINA SÃO OBRIGADAS A FAZER TRÉGUA.",
  submarinum: "UM SUBMARINO QUE NASCEU NO FUNDO DO MAR E NUNCA QUIS VOLTAR. LEVA UMA PESSOA NA CABINE, E SÓ UMA.",
  catorbis: "VOOU PELA PRIMEIRA VEZ HÁ MAIS DE CEM ANOS, NUM CAMPO CHEIO DE GENTE DUVIDANDO. DESDE ENTÃO NÃO PAROU.",
  tratorao: "O TRATOR QUE SE CANSOU DE ARAR E FOI ARRASTAR PEDRA. NÃO TEM BLOCO QUE ELE NÃO EMPURRE.",
  britadeiro: "BATE NO CHÃO O DIA INTEIRO SEM PARAR. A PEDRA RACHA ANTES DELE CANSAR.",
  rocador: "APARA O MATO DA BEIRA DA ESTRADA E DEIXA TUDO RENTE. AS FOLHAS QUE VOAM VIRAM COMIDA PRA ELE.",
  sandbash: "O TATU-BOLA VIROU A BOLA DE VEZ. AS TRÊS CABEÇAS BRIGAM PRA DECIDIR PRA ONDE RODAR, E ELE ACABA INDO DIRETO PRO GOL.",
  zerogle: "UM BEAGLE QUE NUNCA PAROU DE PROCURAR O DONO. O NARIZ ACENDE PRA ACHAR O CAMINHO NO ESCURO.",
  lorose: "PAPAGAIO DE PROGRAMA DA MANHÃ. FALA MAIS QUE A APRESENTADORA, NUNCA PERDE A DEIXA E SEMPRE PEDE UM PEDAÇO DO BOLO.",
  curupira: "O GUARDIÃO DA MATA TEM OS PÉS VIRADOS PRA TRÁS. QUEM SEGUE O RASTRO DELE SE PERDE CADA VEZ MAIS FUNDO.",
};

// -------------------------------------------------- AS FORMAS BRAGLITCHIANAS
// O mesmo bicho, criado deste lado do mar. O sprite é o da base com a cor
// girada (a última coluna: matiz de destino em graus, saturação e luz), gravado
// por tools/braglitch_sprites.py com o número da segunda coluna.
//
//   Pokédex | sprite | NOME | TIPOS | HP ATK DEF SPA SPD SPE | cor
const FORMAS = `
 27 | 21001 | SANDSHREW-BRAG  | TERRA/NORMAL     |  55  70 100  15  35  25 | 28 0.45 0.85
 28 | 21002 | SANDSLASH-BRAG  | TERRA/NORMAL     |  80  95 130  35  60  50 | 28 0.45 0.85
 21 | 21003 | SPEAROW-BRAG    | VOADOR/SOMBRIO   |  40  65  30  31  31  65 | 30 0.55 0.75
 22 | 21004 | FEAROW-BRAG     | VOADOR/SOMBRIO   |  65 100  65  61  51 100 | 30 0.55 0.75
190 | 21005 | AIPOM-BRAG      | NORMAL/FOGO      |  55  60  55  45  55  90 | 40 1.2 1.1 de=275
424 | 21006 | AMBIPOM-BRAG    | NORMAL/FOGO      |  75  95  66  60  66 120 | 40 1.2 1.1 de=275
 46 | 21007 | PARAS-BRAG      | INSETO/LUTADOR   |  35  80  60  30  55  25 | 6 1.1 0.8
 47 | 21008 | PARASECT-BRAG   | INSETO/LUTADOR   |  60 110  85  50  75  25 | 6 1.1 0.8
 43 | 21009 | ODDISH-BRAG     | PLANTA/ÁGUA      |  45  45  55  75  65  35 | 330 0.9 1.1
 44 | 21010 | GLOOM-BRAG      | PLANTA/ÁGUA      |  60  60  70  85  75  45 | 330 0.9 1.1
 45 | 21011 | VILEPLUME-BRAG  | PLANTA/ÁGUA      |  75  75  90 110  90  50 | 330 0.9 1.1
963 | 21012 | FINIZEN-BRAG    | ÁGUA/FADA        |  70  45  45  55  45  75 | 335 0.75 1.15
964 | 21013 | PALAFIN-BRAG    | ÁGUA/FADA        | 100  70  72  70  75 100 | 335 0.75 1.15
 52 | 21014 | MEOWTH-BRAG     | SOMBRIO/LUTADOR  |  45  60  40  30  35  80 | 38 1.25 0.95 pintas
 53 | 21015 | PERSIAN-BRAG    | SOMBRIO/LUTADOR  |  70  95  65  45  55 110 | 38 1.25 0.95 pintas
399 | 21016 | BIDOOF-BRAG     | NORMAL/ÁGUA      |  60  40  45  30  45  30 | 22 0.7 0.85
400 | 21017 | BIBAREL-BRAG    | NORMAL/ÁGUA      |  85  80  65  55  70  55 | 22 0.7 0.85
 23 | 21018 | EKANS-BRAG      | ÁGUA/SOMBRIO     |  45  60  44  40  54  45 | 85 0.8 0.7
 24 | 21019 | ARBOK-BRAG      | ÁGUA/SOMBRIO     |  70  95  69  65  79  70 | 85 0.8 0.7
479 | 21020 | ROTOM-BRAG      | ELÉTRICO/GLITCH  |  50  65 107 105 107  86 | 95 1.2 1.0
118 | 21021 | GOLDEEN-BRAG    | ÁGUA/PEDRA       |  55  67  70  35  50  43 | 4 1.1 0.8
119 | 21022 | SEAKING-BRAG    | ÁGUA/PEDRA       |  90  92 100  65  75  28 | 4 1.1 0.8
`;

const LORE_FORMAS = {
  sandshrewbrag: "TATU-BOLA. FECHA A CASCA INTEIRA E VIRA UMA BOLA PERFEITA — OS MENINOS DA PRAIA JÁ TENTARAM CHUTAR.",
  sandslashbrag: "A CASCA VIROU ARMADURA DE PLACAS. ELE CAVA TÚNEL EMBAIXO DA BR-101 E NINGUÉM SABE ONDE SAI.",
  spearowbrag: "CARCARÁ PEQUENO. PEGA, MATA E COME — E O QUE NÃO COME, ESCONDE NUM REDEMOINHO PRA DEPOIS.",
  fearowbrag: "CARCARÁ DE VERDADE. VOA EM CÍRCULO EM CIMA DO APAGÃO ESPERANDO ALGUMA COISA CAIR DA TELA.",
  aipombrag: "MICO-LEÃO-DOURADO. A JUBA BRILHA TANTO QUE, DEPOIS DO APAGÃO, A MATA USA ELE COMO LANTERNA.",
  ambipombrag: "AS DUAS MÃOS DO RABO PEGAM FOGO QUANDO ELE BATE PALMA. ELE BATE PALMA PRA TUDO.",
  parasbrag: "SAÚVA. CARREGA UMA FOLHA DEZ VEZES MAIOR QUE ELA, E BRIGA COM QUEM TENTAR PEGAR DE VOLTA.",
  parasectbrag: "A RAINHA DO FORMIGUEIRO. O COGUMELO DAS COSTAS VIROU JARDIM: ELA PLANTA O QUE O BANDO TRAZ.",
  oddishbrag: "BROTO DE VITÓRIA-RÉGIA. DE DIA BOIA NO AÇUDE; DE NOITE ANDA PELA MARGEM PROCURANDO OUTRA LAGOA.",
  gloombrag: "A FLOR AINDA ESTÁ FECHADA. O CHEIRO É DE ÁGUA PARADA, E ATRAI TODO BICHO DO RIO.",
  vileplumebrag: "A FOLHA DELA AGUENTA UMA CRIANÇA EM PÉ. A FLOR SÓ ABRE UMA NOITE POR ANO, E A MATA INTEIRA VAI VER.",
  finizenbrag: "BOTO-COR-DE-ROSA. DIZEM QUE EM NOITE DE FESTA ELE SAI DO RIO DE CHAPÉU E DANÇA ATÉ O DIA NASCER.",
  palafinbrag: "O BOTO QUE VIROU HERÓI. SE ALGUÉM SOME NO RIO, É ELE QUE VAI BUSCAR — E VOLTA ASSOBIANDO.",
  meowthbrag: "FILHOTE DE ONÇA-PINTADA. BRINCA COM MOEDA COMO O PRIMO DE KANTO, MAS ENTERRA AS MOEDAS E NÃO LEMBRA ONDE.",
  persianbrag: "ONÇA-PINTADA. NÃO RUGE: ESTURRA. QUEM OUVE O ESTURRO NA MATA MUDA DE CAMINHO SEM PENSAR.",
  bidoofbrag: "FILHOTE DE CAPIVARA. SENTA NA BEIRA DO RIO E OS OUTROS BICHOS SENTAM NAS COSTAS DELE. ELE DEIXA.",
  bibarelbrag: "CAPIVARA ADULTA. É AMIGA DE TODO MUNDO, INCLUSIVE DE QUEM NÃO É AMIGO DE NINGUÉM.",
  ekansbrag: "FILHOTE DE SUCURI. NÃO TEM VENENO NENHUM — TEM PACIÊNCIA, E ISSO É PIOR.",
  arbokbrag: "SUCURI. O DESENHO DA BARRIGA É UM MAPA DO RIO, E ELA NUNCA ERRA O CAMINHO DE CASA.",
  rotombrag: "GATONET. MORA NO FIO PUXADO DO POSTE PRO VIZINHO. FOI ELE QUE CAIU A LUZ NO DIA DO APAGÃO — OU FOI ELE QUE SEGUROU O RESTO?",
  goldeenbrag: "FILHOTE DE PIRARUCU. RESPIRA AR: SOBE À TONA A CADA POUCO, E É AÍ QUE O PESCADOR ESPERA.",
  seakingbrag: "PIRARUCU. AS ESCAMAS SÃO TÃO DURAS QUE O POVO DO RIO USA AS QUE ELE SOLTA COMO LIXA.",
};

/** De que região é cada uma (entra no REGIAO, que é o rótulo da Pokédex). */
export const REGIAO_BRAGLITCH = "BRAGLITCH";

/** As espécies, no formato do DB.SPECIES. */
export const BRAGLITCH_ESPECIES = {};

/** id da forma -> ["matiz", "sat", "luz", opções...] (só pro tools/braglitch_sprites.py ler; o
 *  jogo não usa — ele pega o PNG pronto). */
export const COR_DAS_FORMAS = {};

function registrar(id, dex, nome, tipos, stats, extra = {}) {
  const [hp, atk, def, spa, spd, spe] = stats.split(/\s+/).map(Number);
  const base = { hp, atk, def, spa, spd, spe };
  const bst = hp + atk + def + spa + spd + spe;
  BRAGLITCH_ESPECIES[id] = {
    id, dex, name: nome, types: tipos.split("/"), base, bst,
    foreign: true, braglitch: true, regiao: REGIAO_BRAGLITCH,
    catchRate: bst >= 550 ? 45 : bst >= 450 ? 60 : 150,
    xpYield: Math.floor(bst / 4),
    ...extra,
  };
}

for (const linha of NOVAS.trim().split("\n")) {
  if (!linha.trim()) continue;
  const [dex, nome, tipos, stats] = linha.split("|").map((c) => c.trim());
  // TUCANAÇU -> tucanacu (o slugify sozinho comeria o Ç e sairia "tucanau")
  const id = slugify(nome.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
  registrar(id, +dex, nome, tipos, stats, { dexText: LORE_NOVAS[id] });
}
// os iniciais são como os de toda região: 45 de captura (nunca aparecem soltos
// mesmo), e o SACI é lendário mas se deixa pegar — ele é o fim da história
for (const id of BRAGLITCH.iniciais) BRAGLITCH_ESPECIES[id].catchRate = 45;
BRAGLITCH_ESPECIES.saci.catchRate = 45;
// o SACI aprende PEGA ALMA no nível 24: derruba qualquer FANTASMA num golpe só,
// e custa 14 de HP de quem usa (src/data/moves.js)
BRAGLITCH_ESPECIES.saci.learnsetExtra = [[24, "pegaalma"]];
// o BRASEAGLE aprende MORDIDA DE FOGO no nível 19 (src/data/moves.js)
BRAGLITCH_ESPECIES.braseagle.learnsetExtra = [[19, "mordidadefogo"]];
// as três lendas da mata, do rio e do campo: aparecem uma vez, depois da oitava
// insígnia (src/data/braglitch-mundo.js), e se deixam pegar com esforço
// e O TRIO LENDÁRIO da região: AMAZONIUM (a mata), DESTROIUM (a máquina) e
// ENCONTRIUM (o Encontro das Águas, o rio que corre entre os dois sem escolher lado)
const TRIO = ["amazonium", "destroium", "encontrium"];
for (const id of ["saci", "boitata", "iara", "curupira", ...TRIO]) BRAGLITCH_ESPECIES[id].lendario = true;
for (const id of ["boitata", "iara", "curupira", ...TRIO]) BRAGLITCH_ESPECIES[id].catchRate = 3;

for (const linha of FORMAS.trim().split("\n")) {
  if (!linha.trim()) continue;
  const [dex, sprite, nome, tipos, stats, cor] = linha.split("|").map((c) => c.trim());
  const id = slugify(nome);
  registrar(id, +dex, nome, tipos, stats, { spriteDex: +sprite, dexText: LORE_FORMAS[id] });
  COR_DAS_FORMAS[id] = cor.split(/\s+/);
}

// O VICTREEBEL DE BRAGLITCH é uma CUIA — e tem duas formas, como a bebida:
// CHIMARRÃO (quente, PLANTA/FOGO) e TERERÊ (gelado, PLANTA/GELO). O total de
// status é o do VICTREEBEL (490) nas duas; o que muda é pra onde ele pende: o
// quente é lento e pesado no ataque especial, o gelado é rápido. Quem troca uma
// pela outra é a CUIA TÉRMICA (`CUIA`, abaixo). Os sprites são desenhados em
// tools/braglitch_desenhos/lote_7.py.
registrar("victreebelchimarrao", 71, "VICTREEBEL-CHIMARRÃO", "PLANTA/FOGO", "80 100 70 115 75 50",
          { spriteDex: 21023, forma: "CHIMARRÃO",
            dexText: "UMA CUIA VIVA, CHEIA DE ERVA E ÁGUA QUENTE. A BOMBA É O CAULE: QUEM PUXA, TOMA — E ELE PUXA DE VOLTA." });
registrar("victreebelterere", 71, "VICTREEBEL-TERERÊ", "PLANTA/GELO", "80 95 65 95 70 85",
          { spriteDex: 21024, forma: "TERERÊ",
            dexText: "A MESMA CUIA, COM GELO E LIMÃO. NO CALOR DA FRONTEIRA ELE GELA O AR EM VOLTA E NINGUÉM RECLAMA." });

// O APPLIN DE BRAGLITCH não mora numa maçã: mora num COCO VERDE, daqueles de
// beira de praia, com o canudinho ainda espetado. Por isso é PLANTA/ÁGUA (água
// de coco) em vez de PLANTA/DRAGÃO; os atributos são os do APPLIN. Aparece no
// mato da PRAIA DO LARVANJAL (src/data/braglitch-sul.js). O sprite é desenhado
// em tools/braglitch_desenhos/ (21025).
registrar("applinbrag", 840, "APPLIN-BRAG", "PLANTA/ÁGUA", "40 40 80 40 40 20",
          { spriteDex: 21025, forma: "COCO",
            dexText: "MORA DENTRO DE UM COCO VERDE. QUANDO ESQUENTA, PUXA A ÁGUA DE COCO PELO CANUDINHO E SÓ BOTA A CARA PRA FORA DE NOITE." });

/** A CUIA TÉRMICA: usada no VICTREEBEL de Braglitch, troca a forma. Não gasta —
 *  é a mesma cuia pra vida toda, como a de verdade. */
export const CUIA = {
  item: "cuia térmica",
  troca: { victreebelchimarrao: "victreebelterere", victreebelterere: "victreebelchimarrao" },
  virou: {
    victreebelchimarrao: "A CUIA ESQUENTOU. SOBE VAPOR DA ERVA: {MON} VIROU A FORMA CHIMARRÃO!",
    victreebelterere: "A CUIA GELOU. ESTALA GELO LÁ DENTRO: {MON} VIROU A FORMA TERERÊ!",
  },
  nada: "{MON} NÃO É UMA CUIA. A CUIA TÉRMICA NÃO FAZ NADA.",
};

/** { id: "BRAGLITCH" } — colado no REGIAO de src/data/regionais.js. */
export const REGIAO_ESPECIES = Object.fromEntries(
  Object.keys(BRAGLITCH_ESPECIES).map((id) => [id, REGIAO_BRAGLITCH]));

/** As linhas evoluem dentro da forma, com o gatilho da base. O GLOOM-BRAG é a
 *  exceção: a vitória-régia abre com PEDRA DA ÁGUA, não com a da folha. */
export const EVO_BRAGLITCH = {
  // os iniciais: 16 e 36, como os de Kanto
  tronky: [{ lvl: 16, to: "troncudo" }],
  troncudo: [{ lvl: 36, to: "paubrasilisco" }],
  diggle: [{ lvl: 16, to: "braseagle" }],
  braseagle: [{ lvl: 36, to: "magmastim" }],
  tilapish: [{ lvl: 16, to: "tilapisco" }],
  tilapisco: [{ lvl: 36, to: "tilapiracu" }],
  // os bichos novos
  capivarinha: [{ lvl: 20, to: "capivarao" }],
  biquinho: [{ lvl: 18, to: "tucanacu" }],
  tatubola: [{ lvl: 24, to: "taturrao" }],
  sauvinha: [{ lvl: 22, to: "sauvarainha" }],
  acaizinho: [{ item: "pedra da folha", to: "acaizeiro" }],
  piranhita: [{ lvl: 30, to: "piranhorda" }],
  caranguejinho: [{ lvl: 28, to: "manguebit" }],
  botinho: [{ lvl: 34, to: "encantado" }],
  macacoeira: [{ lvl: 28, to: "gingao" }],
  fogueirinha: [{ lvl: 30, to: "fogueirao" }],
  penadinha: [{ lvl: 35, to: "assombracao" }],
  beijaflorzinha: [{ lvl: 32, to: "plumario" }],
  bantevy: [{ lvl: 28, to: "bangveet" }],
  // O WEEPINBELL com PEDRA DA FOLHA em Braglitch vira a cuia (sai quente).
  // Em Kanto continua virando o VICTREEBEL de sempre (a regra com lugar vem
  // na frente, como as das formas regionais).
  weepinbell: [{ item: "pedra da folha", onde: "braglitch", to: "victreebelchimarrao" }],
  // as formas -BRAG
  sandshrewbrag: [{ lvl: 22, to: "sandslashbrag" }],
  // o SANDSLASH-BRAG vira bola de vez: o SANDBASH (as três cabeças da linha)
  sandslashbrag: [{ lvl: 44, to: "sandbash" }],
  spearowbrag: [{ lvl: 20, to: "fearowbrag" }],
  aipombrag: [{ lvl: 32, to: "ambipombrag" }],
  parasbrag: [{ lvl: 24, to: "parasectbrag" }],
  oddishbrag: [{ lvl: 21, to: "gloombrag" }],
  gloombrag: [{ item: "pedra da água", to: "vileplumebrag" }],
  finizenbrag: [{ lvl: 38, to: "palafinbrag" }],
  meowthbrag: [{ lvl: 28, to: "persianbrag" }],
  bidoofbrag: [{ lvl: 15, to: "bibarelbrag" }],
  ekansbrag: [{ lvl: 22, to: "arbokbrag" }],
  goldeenbrag: [{ lvl: 33, to: "seakingbrag" }],
};

// ------------------------------------------------------------ OS MAPAS
// A PLANTA de cada mapa aberto, um caractere por tile. É daqui que saem a
// colisão (tags), as portas (warps) e o desenho (Assets.braglitchArt).
//
//   #  árvore        .  chão de grama    ,  mato alto (bicho)   P  caminho de terra
//   ~  água          =  píer de madeira  a  areia               F  canteiro de flor
//   Y  coqueiro      o  pedra            B  o barquinho (na água, não se pisa)
//   H  casa do jogador   h  casario colorido   L  laboratório   C  Centro Pokémon
//   M  loja          I  igrejinha        K  coreto da praça
//   D  porta (a do prédio logo acima)    1-9  placa (texto em `placas`)
//
// Prédio é bloco de uma letra só; a porta fica na linha de baixo dele.
const PLANTAS = {
  sao_lucario: [
    "##############PP##############",
    "#F...........,PP,...........F#",
    "#..hhhh.....,,PP,,...LLLLLL..#",
    "#..hhhh......,PP,....LLLLLL..#",
    "#..hhhh.......PP.....LLLLLL..#",
    "#...D...1.....PP.....LLLLLL..#",
    "#...PPPPPPPPPPPPPPPPPPPPDP...#",
    "#.............PP.............#",
    "#.HHHHH..FF...PP...CCCCC.MMMM#",
    "#.HHHHH..FF...PP...CCCCC.MMMM#",
    "#.HHHHH.......PP...CCCCC.MMMM#",
    "#...D.....2...PP.....D....D..#",
    "#...PPPPPPPPPPPPPPPPPPPPPPP..#",
    "#.............PP.............#",
    "#.hhhh..FFFF..PP..IIIII..hhhh#",
    "#.hhhh..FKKF..PP..IIIII..hhhh#",
    "#.hhhh..FKKF..PP..IIIII..hhhh#",
    "#..D....FFFF..PP....D.....D..#",
    "#..PPPPPPPPPPPPPPPPPPPPPPPP..#",
    "#aaaaaaaaaaaa3PPaaaaaaaaaaaaY#",
    "#Yaaa4aaaaaaaaPPaaaaaaaaaaaaa#",
    "~aaaaaaaaaaaaa==aaaaaaaaaaaaa~",
    "~~~~~~~~~~~~~~==~~~~~~~~~~~~~~",
    "~~~~~~~~~~~~~~==~~~~~~~~~~~~~~",
    "~~~~~~~~~~~~~~==BB~~~~~~~~~~~~",
    "~~~~~~~~~~~~~~==BB~~~~~~~~~~~~",
    "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
    "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
  ],
  rota_br101: [
    "##############PP##############",
    "####,,,,,,,,..PP..,,,,,,,,####",
    "###,,,,,,,,,..PP..,,,,,,,,,###",
    "##,,,,##,,,,..PP..,,,,##,,,,##",
    "##,,,,##......PP......##,,,,##",
    "##,,,,,,......PPPPPPPPP.,,,,##",
    "###,,,,,,.............P.,,,###",
    "####......oo.....o....P...####",
    "####..~~~~~.......,,,.P...####",
    "###..~~~~~~~.....,,,,.P....###",
    "###..~~~~~~~.....,,,,.P....###",
    "###...~~~~~......,,,,.P.1..###",
    "####.........PPPPPPPPPP...####",
    "#####........P.........,,,####",
    "####,,,,.....P........,,,,,###",
    "###,,,,,,....P.......,,,,,,,##",
    "###,,,,,,....P.......,,,,,,,##",
    "###,,,,,.....P.........,,,,###",
    "####.........PPPPPPPPP.....###",
    "####..oo.....,,,,,,,.P.....###",
    "###.........,,,,,,,,.P..oo..##",
    "##,,,,......,,,,,,,,.P......##",
    "##,,,,,,....,,,,,,,,.P..,,,,##",
    "##,,,,,,.............P.,,,,,##",
    "###,,,,....PPPPPPPPPPP.,,,,###",
    "####.......P...........,,,####",
    "####.......P.2........,,,,####",
    "#####......PPPPP.....,,,,#####",
    "######.........P.....,,,######",
    "#######,,,,,...P...,,,,#######",
    "#######,,,,,..PP...,,,,#######",
    "##############PP##############",
  ],
  mata_do_saci: [
    "##############PP##############",
    "######,,,,,,##PP##,,,,,,######",
    "####,,,,,,,,,#PP#,,,,,,,,,####",
    "###,,,,##..........##,,,,,,###",
    "###,,,##............##,,,,,###",
    "##,,,,#..............#,,,,,,##",
    "##,,,,................,,,,,,##",
    "##,,,,................,,,,,,##",
    "##,,,,#..............#,,,,,,##",
    "###,,,##............##,,,,,###",
    "###,,,,##....PP....##,,,,,,###",
    "####,,,,,##..PP..##,,,,,,,####",
    "####,,,,,,,..PP..,,,,,,,,,####",
    "#####,,,,,,..PP..,,,,,,,,#####",
    "######,,,,...PP...,,,,,,######",
    "########.....PP.....##########",
    "##############PP##############",
  ],
};

/** As ligações pela borda: sobe da cidade pra BR-101, da BR-101 pra mata. As
 *  três plantas têm a mesma largura, então o `offset` é zero. */
Object.assign(PLANTAS, mundo.PLANTAS_MUNDO);
// AS LIGAÇÕES: saem do mapa do Brasil (LAYOUT em src/data/braglitch-mundo.js),
// que também abre nas plantas as saídas que faltam e fecha as que sobram
const LIGACOES = mundo.montarLigacoes(PLANTAS);

/** Os interiores. Não há planta de casa por dentro pra desenhar do zero: eles
 *  usam a geometria e o desenho dos interiores de Kanto (`arte`), com as portas
 *  apontando pra cá. Uma casa por dentro é uma casa por dentro. */
const INTERIORES = {
  bra_casa: { de: "home", predio: "H" },
  bra_lab: { de: "lab", predio: "L" },
  sao_lucario_pokemon_center_1f: { de: "center", predio: "C" },
  bra_loja: { de: "mart", predio: "M" },
  ...mundo.INTERIORES_MUNDO,
};

/** A mensagem das portas que não abrem (casario e igreja). */
const PORTA_FECHADA = {
  h: ["NINGUÉM EM CASA. DEVE ESTAR TODO MUNDO NA PRAIA."],
  I: ["A IGREJINHA SÓ ABRE NO DOMINGO. NA PORTA TEM UM AVISO:", "\"QUERMESSE ADIADA ATÉ A LUZ VOLTAR DIREITO.\""],
};

const TAG_DE = {
  "#": 1, ".": 0, ",": 2, P: 0, "~": 3, "=": 0, a: 0, F: 0, Y: 1, o: 1, B: 1,
  H: 1, h: 1, L: 1, C: 1, M: 1, I: 1, K: 1, G: 1, D: 0,
  // o ARCEUS REDENTOR de RIO DE JANEEVEE (a base inteira segura)
  A: 1,
  // a serra: paredão de pedra, barranco que só se pula pra baixo (v) ou pra
  // cima (^, a serra de cabeça pra baixo) e escadaria
  R: 1, v: 4, "^": 7, e: 0,
};

/** Monta a geometria de Braglitch no formato de assets/maps/kanto.json.
 *  `kanto` é o JSON importado (de onde saem os interiores). */
export function montarBraglitch(kanto) {
  const out = {};
  const portas = {};                  // mapa -> [{ x, y, predio }]
  for (const [id, planta] of Object.entries(PLANTAS)) {
    const h = planta.length, w = planta[0].length;
    let tags = "";
    const warps = [];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const c = planta[y][x];
        tags += /[1-9]/.test(c) ? "1" : String(TAG_DE[c] ?? 0);
        if (c !== "D") continue;
        const predio = planta[y - 1]?.[x];
        // o interior é o daquele prédio NAQUELA cidade (todas têm Centro e loja)
        const dentro = Object.entries(INTERIORES).find(([, i]) => i.predio === predio
          && (i.cidade || "sao_lucario") === id)?.[0] || null;
        warps.push({ x, y, to: dentro, toWarp: 0, predio });
      }
    }
    portas[id] = warps;
    const signs = [];
    planta.forEach((linha, y) => [...linha].forEach((c, x) => {
      if (/[1-9]/.test(c)) signs.push({ x, y, n: c });
    }));
    // o ARCEUS REDENTOR (letra A): o retângulo da base, pro desenho da figura
    // e pra altura dela no isométrico
    const pedra = [];
    planta.forEach((linha, y) => [...linha].forEach((c, x) => { if (c === "A") pedra.push([x, y]); }));
    const estatua = pedra.length ? {
      x: Math.min(...pedra.map((p) => p[0])), y: Math.min(...pedra.map((p) => p[1])),
      w: Math.max(...pedra.map((p) => p[0])) - Math.min(...pedra.map((p) => p[0])) + 1,
      h: Math.max(...pedra.map((p) => p[1])) - Math.min(...pedra.map((p) => p[1])) + 1,
      arte: "arceus_redentor",
      // o RELEVO da cara, em formato de cabeça de cavalo: fatias empilhadas
      // (tools/estatua_camadas.py gera os PNGs arceus_redentor_cara_1..N),
      // cada uma um pixel pra frente; a fatia depois da última são os olhos,
      // que vão na altura `olhos` (o script diz qual)
      cara: { camadas: 7, olhos: 4, passo: [-1, 1] },
    } : null;
    out[id] = {
      ...(estatua ? { estatua } : {}),
      w, h, tags, warps, connections: LIGACOES[id] || [], signs: signs.map(({ x, y }) => ({ x, y })),
      objects: [], planta, braglitch: true, tema: TEMAS[id] || "mata",
      content: { name: id, music: "route", interior: false, npcs: [], encounters: [] },
      _placas: signs,
    };
  }
  // os interiores: cópia da geometria de Kanto, portas trocadas
  for (const [id, i] of Object.entries(INTERIORES)) {
    const geo = kanto?.[i.de];
    if (!geo) continue;
    const cidade = i.cidade || "sao_lucario";
    const saida = portas[cidade].findIndex((p) => p.to === id);
    out[id] = {
      ...geo,
      arte: i.de,
      braglitch: true,
      // a escada da casa (e qualquer outra porta interna) fica trancada: o
      // segundo andar daqui não foi desenhado
      warps: geo.warps.map((w) => (w.to === geo.warps[0].to
        ? { ...w, to: cidade, toWarp: saida }
        : { ...w, to: null })),
      connections: [],
      content: { ...(geo.content || {}), npcs: [], encounters: [] },
    };
  }
  return out;
}

/** O texto das placas e das portas trancadas, por mapa — src/data/index.js
 *  cola no conteúdo depois de montar a geometria. */
export function placasEPortas(geos, conteudo = {}) {
  const out = {};
  for (const [id, geo] of Object.entries(geos)) {
    const textos = PLACAS[id] || conteudo[id]?.placas || {};
    const signs = {};
    for (const p of geo._placas || []) if (textos[p.n]) signs[`${p.x},${p.y}`] = textos[p.n];
    const lockedWarps = {};
    for (const w of geo.warps || []) {
      if (!w.to && PORTA_FECHADA[w.predio]) lockedWarps[`${w.x},${w.y}`] = PORTA_FECHADA[w.predio];
    }
    out[id] = { signs, lockedWarps };
  }
  return out;
}

/** A cor do chão de cada estrada (o pintor lê `geo.tema`). */
const TEMAS = { ...Object.fromEntries([...mundo.ESTRADAS, mundo.FLORESTA, ...mundo.LUGARES_NOVOS].map((e) => [e.id, e.tema])), [mundo.SERRA.id]: mundo.SERRA.tema };

/** O conteúdo das cidades e estradas de cima (src/data/braglitch-mundo.js). */
export const conteudoDoMundo = mundo.conteudoDoMundo;
export const INSIGNIAS_BRAG = mundo.INSIGNIAS_BRAG;
/** O MAPA DA REGIÃO (a tela do menu em Braglitch): onde cada lugar fica no
 *  desenho do Brasil, com quem ele se liga, o contorno do país e o tipo. */
export const MAPA_REGIAO = { layout: mundo.LAYOUT, contorno: mundo.CONTORNO_BRASIL, tipos: mundo.TIPO_DO_LUGAR };
export const LENDAS = mundo.LENDAS_LUGAR;
/** As cidades onde dá pra pousar voando (o VOAR mostra só as da região em que
 *  você está). */
export const VOO_BRAGLITCH = {
  sao_lucario: "SÃO LUCARIO DO SUL",
  ...Object.fromEntries(mundo.CIDADES.map((c) => [c.id, c.nome])),
  // as cidades novas do mapa do Brasil (praia e rota não: VOAR é pra cidade)
  ...Object.fromEntries(mundo.LUGARES_NOVOS.filter((l) => l.tipo === "cidade").map((l) => [l.id, l.nome])),
};

const PLACAS = {
  sao_lucario: {
    1: "SÃO LUCARIO DO SUL — ONDE O MAR COMEÇA E O MAPA TERMINA.",
    2: "CASA DA FAMÍLIA. (É A SUA.)",
    3: "PÍER DO BARQUEIRO\nSAÍDAS PRA KANTO E PRAS ILHAS SEVII. É SÓ CHAMAR.",
    4: "PROIBIDO JOGAR BOLA NA AREIA.\n(ALGUÉM RISCOU O \"PROIBIDO\".)",
  },
  rota_br101: {
    1: "BR-101 — SÃO LUCARIO DO SUL AO SUL, MATA DO SACI AO NORTE.\nCUIDADO COM REDEMOINHO NA PISTA.",
    2: "AQUI A LUZ CAIU PRIMEIRO. DESDE O APAGÃO, O MATO NÃO É MAIS O MESMO.",
  },
};

// -------------------------------------------- O CONTEÚDO (NPCs, mato, nome)
// No mesmo formato de src/data/maps.js.
export const BRAGLITCH_MAPS = {
  sao_lucario: {
    name: "SÃO LUCARIO DO SUL", music: "saolucario",
    spawn: { x: 4, y: 12, dir: "down" },
    encounters: [],
    npcs: [
      {
        id: "pescador", x: 9, y: 20, dir: "down", sprite: "pescador",
        lines: ["DEPOIS DO APAGÃO O MAR FICOU ESQUISITO.", "ONTEM EU PESQUEI UM PEIXE QUE JÁ VEIO FRITO. JURO."],
      },
      {
        id: "menino_bola", x: 22, y: 20, dir: "left", sprite: "menino", wander: true,
        lines: ["O TATU-BOLA DA PRAIA É A MELHOR BOLA QUE TEM.", "...ELE NÃO GOSTA QUANDO A GENTE CHUTA, NÃO."],
      },
      {
        id: "seu_ze", x: 11, y: 16, dir: "left", sprite: "velho",
        lines: ["NESSE CORETO TOCAVA CHORINHO TODO SÁBADO.", "AÍ VEIO O APAGÃO, E A MÚSICA VOLTOU... MAS VOLTOU FORA DE ORDEM."],
      },
      {
        // o gaúcho da cidade: é ele quem dá a CUIA TÉRMICA
        id: "gaucho", x: 6, y: 13, dir: "down", sprite: "gentleman",
        lines: ["BAH, TCHÊ! AQUI É SÃO LUCARIO DO SUL, E NO SUL SE TOMA CHIMARRÃO.",
                "LEVA ESTA CUIA TÉRMICA. SE TU TIVER UM VICTREEBEL DAQUI, ELA TROCA ELE DE QUENTE PRA GELADO — E DE VOLTA.",
                "O WEEPINBELL VIRA CUIA SE TU USAR A PEDRA DA FOLHA DESTE LADO DO MAR."],
        afterLines: ["CHIMARRÃO DE MANHÃ, TERERÊ DE TARDE. É ASSIM QUE SE VIVE, GURI."],
        gift: { item: "cuia térmica", qty: 1 },
      },
      {
        id: "moca_acai", x: 18, y: 7, dir: "down", sprite: "garota",
        lines: ["A PROFESSORA IPÊ TÁ TE CHAMANDO! O LABORATÓRIO É AQUELE PRÉDIO BRANCO.", "EU SEI PORQUE ELA PEDIU AÇAÍ E DISSE: \"SE VIR O VIZINHO NOVO, MANDA ELE AQUI.\""],
      },
    ],
  },

  rota_br101: {
    name: "BR-101", music: "br101",
    encounters: [
      { id: "capivarinha", min: 2, max: 5, w: 24 },
      { id: "bantevy", min: 2, max: 5, w: 20 },
      { id: "biquinho", min: 2, max: 5, w: 18 },
      { id: "tatubola", min: 3, max: 6, w: 14 },
      { id: "sauvinha", min: 3, max: 6, w: 12 },
      { id: "bidoofbrag", min: 2, max: 5, w: 14 },
      { id: "spearowbrag", min: 2, max: 5, w: 12 },
      { id: "sandshrewbrag", min: 3, max: 6, w: 8 },
      { id: "oddishbrag", min: 3, max: 6, w: 6 },
      { id: "goldeenbrag", min: 4, max: 7, w: 4 },
    ],
    npcs: [
      {
        id: "capoeira", x: 9, y: 13, dir: "right", sprite: "lutador",
        lines: ["Ê, CAMARADA! QUEM PASSA NA MINHA RODA JOGA COMIGO!"],
        afterLines: ["NA CAPOEIRA A GENTE NÃO PERDE. A GENTE APRENDE A GINGA DO OUTRO."],
        trainer: { name: "CAPOEIRISTA ZÉ", prize: 120, sight: 4,
                   party: [{ id: "parasbrag", lvl: 5 }, { id: "sandshrewbrag", lvl: 6 }] },
      },
      {
        id: "sambista", x: 18, y: 23, dir: "up", sprite: "garota",
        lines: ["PAROU! ENSAIO DE BATERIA AQUI NA PISTA. QUER SAMBAR? SAMBA NA BATALHA!"],
        afterLines: ["PERDI O RITMO... MAS NÃO PERDI A POSE."],
        trainer: { name: "PASSISTA LU", prize: 140, sight: 4,
                   party: [{ id: "spearowbrag", lvl: 6 }, { id: "aipombrag", lvl: 7 }] },
      },
      {
        id: "caminhoneiro", x: 24, y: 10, dir: "down", sprite: "montanhista",
        lines: ["EU RODO ESSA BR HÁ TRINTA ANOS. NUNCA VI REDEMOINHO PARADO NO MEIO DA PISTA.",
                "ENTREI NUM COM O CAMINHÃO. SAÍ COM O CAMINHÃO... E COM UM PIRARUCU NO BANCO DO CARONA."],
      },
    ],
  },

  mata_do_saci: {
    name: "MATA DO SACI", music: "br101",
    // AS DUAS ARVOREZINHAS da saída norte: o caminho pras cidades só abre com
    // CORTE (ou o PANDEIRO DO MATO, que a IPÊ manda depois do SACI)
    arvores: ["14,2", "15,2"],
    encounters: [
      { id: "sauvinha", min: 7, max: 11, w: 16 },
      { id: "bantevy", min: 7, max: 11, w: 10 },
      { id: "acaizinho", min: 7, max: 11, w: 14 },
      { id: "guaraninho", min: 8, max: 12, w: 8 },
      { id: "macacoeira", min: 8, max: 12, w: 8 },
      { id: "penadinha", min: 9, max: 12, w: 4 },
      { id: "ekansbrag", min: 7, max: 11, w: 12 },
      { id: "aipombrag", min: 7, max: 11, w: 12 },
      { id: "parasbrag", min: 7, max: 11, w: 10 },
      { id: "meowthbrag", min: 8, max: 12, w: 6 },
      { id: "finizenbrag", min: 8, max: 12, w: 4 },
      { id: "rotombrag", min: 10, max: 13, w: 3 },
    ],
    npcs: [
      {
        id: "benzedeira", x: 9, y: 12, dir: "right", sprite: "velha",
        lines: ["VEIO ATRÁS DO SACI, FOI? ELE MORA NO MEIO DA CLAREIRA, DENTRO DO REDEMOINHO MAIOR.",
                "O SEGREDO É O GORRO: QUEM PEGA O GORRO VERMELHO, MANDA NELE.",
                "NUMA POKÉ BOLA DÁ NO MESMO. SÓ NÃO DEIXA ELE FUGIR ASSOBIANDO."],
      },
    ],
  },

  bra_casa: {
    name: "SUA CASA — SÃO LUCARIO", music: "casa", interior: true,
    spawn: { x: 5, y: 7, dir: "down" },
    signs: { "6,1": "A TV ESTÁ PASSANDO NOVELA. O CAPÍTULO DE HOJE É O MESMO DE ONTEM — DESDE O APAGÃO É ASSIM." },
    lockedWarps: { "10,2": "A ESCADA SOBE PRO SEU QUARTO. SUA MÃE ACABOU DE ARRUMAR, MELHOR NÃO." },
    encounters: [],
    npcs: [{
      id: "mae", x: 8, y: 4, dir: "down", sprite: "mae", heal: true, aniversario: true,
      lines: ["BOM DIA, QUERIDO! A PROFESSORA IPÊ PASSOU AQUI CEDINHO TE PROCURANDO.",
              "O LABORATÓRIO DELA É O PRÉDIO BRANCO NA RUA DE CIMA. LEVA UMA ÁGUA!"],
      afterLines: ["TODO MUNDO SAI DE CASA UM DIA. MAS VOLTA PRO ALMOÇO DE DOMINGO, VIU?"],
      semMon: ["VOCÊ NEM TEM UM POKÉMON AINDA, QUERIDO!", "VAI LÁ NA PROFESSORA IPÊ. EU FICO AQUI."],
    }],
  },

  bra_lab: {
    name: "LAB DA PROFA. IPÊ", music: "lab", interior: true,
    spawn: { x: 6, y: 12, dir: "up" },
    signs: {
      "9,1": "UM CADERNO: \"DIA DO APAGÃO — 3 REDEMOINHOS NA BR-101. TODOS GIRAM PRO NORTE.\"",
      "10,1": "LIVROS DE FOLCLORE AO LADO DE LIVROS DE INFORMÁTICA. ELES CONCORDAM EM MAIS COISA DO QUE PARECE.",
      "11,1": "FICHAS DE BICHO DE BRAGLITCH. METADE TEM O MESMO NOME DE BICHO DE KANTO, COM \"-BRAG\" NO FIM.",
      "12,1": "UM MAPA DO MAR. KANTO FICA AO NORTE, E UMA LINHA DE CANETA LIGA O PÍER A VERMILION.",
      "0,1": "UM NOBREAK PISCANDO. ELE APITA TODA VEZ QUE ALGUÉM FALA \"APAGÃO\".",
      "1,1": "MONITOR DE REDE. O GRÁFICO TEM TRÊS PICOS — E UM QUARTO, MAIOR, AO NORTE.",
    },
    encounters: [],
    labBraglitch: true,
    // o computador da IPÊ (mesmo lugar do do CARVALHO: a sala é a mesma planta)
    // também tem o 011GIVEGLITCH110 aberto
    profPC: ["2,1", "3,1"],
    npcs: [
      {
        id: "ipe", x: 6, y: 3, dir: "down", sprite: "tecnica",
        lines: [
          "AH, FINALMENTE! EU SOU A PROFESSORA IPÊ.",
          "TRÊS POKÉMON DE BRAGLITCH ESTÃO NAQUELA MESA. ESCOLHE UM PRA LEVAR.",
          "TRONKY, DE PLANTA; DIGGLE, DE FOGO; E TILAPISH, DE ÁGUA.",
        ],
      },
      { id: "ball0", x: 8, y: 4, sprite: "ball", starter: "tronky" },
      { id: "ball1", x: 9, y: 4, sprite: "ball", starter: "diggle" },
      { id: "ball2", x: 10, y: 4, sprite: "ball", starter: "tilapish" },
      {
        id: "assistente", x: 3, y: 11, dir: "right", sprite: "cientista",
        lines: ["A PROFESSORA ESTUDA POKÉMON E FOLCLORE. ELA DIZ QUE É A MESMA COISA, SÓ QUE UM TEM POKÉDEX."],
      },
      {
        id: "assistente2", x: 11, y: 10, dir: "left", sprite: "cientista",
        lines: ["O NOME DELA? IPÊ. O PROFESSOR DE KANTO SE CHAMA CARVALHO.", "PELO JEITO, PRA SER PROFESSOR DE POKÉMON TEM QUE TER NOME DE ÁRVORE."],
      },
    ],
  },

  sao_lucario_pokemon_center_1f: {
    name: "CENTRO POKÉMON — SÃO LUCARIO", music: "center", interior: true,
    spawn: { x: 7, y: 8, dir: "up" },
    signs: {},
    lockedWarps: { "1,6": "A ESCADA LEVA À SALA DE UNIÃO. ESTÁ FECHADA." },
    encounters: [],
    npcs: [
      {
        id: "enfermeira", x: 7, y: 2, dir: "down", sprite: "enfermeira", heal: true, tutor: true,
        lines: ["BEM-VINDO AO CENTRO POKÉMON DE SÃO LUCARIO!", "CURO SEUS POKÉMON E AJUSTO OS GOLPES DELES, SE QUISER."],
      },
      {
        // o técnico de eletrodoméstico: dá o CATÁLOGO ROTOM (src/data/rotom.js)
        id: "tecnico_rotom", x: 4, y: 7, dir: "up", sprite: "tecnico",
        lines: ["EU CONSERTO ELETRODOMÉSTICO. DESDE O APAGÃO NÃO FALTA SERVIÇO.",
                "ESTE CATÁLOGO AQUI É PRA QUEM TEM UM ROTOM: ELE ESCOLHE UM APARELHO E ENTRA DENTRO.",
                "FORNO, MÁQUINA DE LAVAR, GELADEIRA, VENTILADOR, CORTADOR DE GRAMA. LEVA, EU TENHO OUTRO."],
        afterLines: ["ROTOM DE VENTILADOR NO VERÃO DE SÃO LUCARIO É A MELHOR COISA QUE EXISTE."],
        gift: { item: "catálogo rotom", qty: 1 },
      },
      {
        id: "turista", x: 12, y: 5, dir: "left", sprite: "gentleman",
        lines: ["VIM DE KANTO NO BARCO DO PÍER.", "LÁ OS BICHOS SÃO OS MESMOS... MAS COM A COR CERTA. AQUI NADA TEM A COR CERTA, E EU ADORO."],
      },
    ],
  },

  bra_loja: {
    name: "LOJA — SÃO LUCARIO", music: "mart", interior: true,
    spawn: { x: 4, y: 7, dir: "up" },
    signs: {},
    encounters: [],
    npcs: [
      {
        id: "balconista", x: 2, y: 3, dir: "down", sprite: "balconista",
        lines: ["OPA! BEM-VINDO À LOJA. TEM DE TUDO — MENOS LUZ ESTÁVEL."],
        shop: [
          { item: "poké bola", price: 200 },
          { item: "poção", price: 300 },
          { item: "pedra da água", price: 2100 },
        ],
      },
    ],
  },
};

// --------------------------------------------------------- A HISTÓRIA
// O arco de Braglitch: O APAGÃO. Três redemoinhos na BR-101, e o que mora no
// quarto, na MATA DO SACI.
export const REDEMOINHOS = [
  { id: "r1", mapa: "rota_br101", x: 9, y: 17, bicho: "tatubola", lvl: 6 },
  { id: "r2", mapa: "rota_br101", x: 26, y: 21, bicho: "sauvinha", lvl: 7 },
  { id: "r3", mapa: "rota_br101", x: 19, y: 4, bicho: "biquinho", lvl: 8 },
];
export const SACI_NA_MATA = { mapa: "mata_do_saci", x: 15, y: 6, lvl: 15 };

export const BRAGLITCH_TEXTO = {
  pokedex: [
    "PROFA. IPÊ: AGORA QUE VOCÊ TEM UM POKÉMON, LEVA ISTO TAMBÉM.",
    "É UMA POKÉDEX. ELA ANOTA TODO BICHO QUE VOCÊ VIR E TODO QUE FOR SEU.",
    "AQUI ELA TRABALHA DOBRADO: METADE DOS BICHOS DE BRAGLITCH TEM PRIMO EM KANTO, E ELA ANOTA OS DOIS.",
  ],
  missao: [
    "PROFA. IPÊ: AGORA ESCUTA, QUE O ASSUNTO É SÉRIO.",
    "HÁ UM MÊS DEU UM APAGÃO NA REGIÃO INTEIRA. A LUZ VOLTOU — MAS OS DADOS DE BRAGLITCH VOLTARAM FORA DE ORDEM.",
    "DESDE ENTÃO APARECEM REDEMOINHOS NA BR-101. QUEM ENTRA NUM, SAI TROCADO. BICHO DE RIO NA ESTRADA, BICHO DE MATA NA PRAIA.",
    "O POVO DIZ QUE É O SACI. EU DIGO QUE É ERRO DE LEITURA. E EU DESCONFIO QUE A GENTE TÁ FALANDO DA MESMA COISA.",
    "SÃO TRÊS REDEMOINHOS. VAI LÁ, DESFAZ OS TRÊS — E ME CONTA PRA ONDE ELES APONTAM.",
  ],
  faltam: "PROFA. IPÊ: AINDA TEM {N} REDEMOINHO(S) NA BR-101. A ESTRADA É LOGO AO NORTE DA CIDADE.",
  todos: [
    "PROFA. IPÊ: OS TRÊS SE DESFIZERAM? E TODOS GIRAVAM PRO NORTE...",
    "PASSANDO A BR-101 TEM A MATA DO SACI. O MONITOR MOSTRA UM REDEMOINHO LÁ QUATRO VEZES MAIOR QUE OS OUTROS.",
    "VAI COM CALMA. E SE ELE ASSOBIAR, NÃO RESPONDE.",
  ],
  fim: [
    "PROFA. IPÊ: VOCÊ... PEGOU O SACI?!",
    "OLHA O MONITOR: A LINHA PAROU DE PULAR. OS DADOS DE BRAGLITCH VOLTARAM PRO LUGAR — QUASE TODOS.",
    "OS -BRAG FICARAM. ACHO QUE ELES NÃO ERAM ERRO: ERAM DAQUI MESMO, E O APAGÃO SÓ MOSTROU.",
    "MAS O MONITOR AINDA MOSTRA UMA COISA: O APAGÃO NÃO COMEÇOU AQUI. COMEÇOU LÁ EM CIMA, EM BASCULINHA, A CAPITAL.",
    "PASSANDO A MATA DO SACI, A MATA ATLÂNTICA LEVA ÀS OITO CIDADES DE BRAGLITCH. CADA UMA TEM UM GINÁSIO.",
    "JUNTA AS OITO INSÍGNIAS E VAI ATÉ A CAPITAL. LEVA ISTO, É O MÍNIMO.",
  ],
  premio: { item: "doce raro", qty: 5 },
  ganhou: "VOCÊ RECEBEU 5 DOCES RAROS!",
  depois: [
    "PROFA. IPÊ: SÃO OITO GINÁSIOS ATÉ BASCULINHA. VOCÊ TEM {N}.",
    "E O BARQUEIRO DO PÍER LEVA PRA KANTO E PRAS ILHAS SEVII, SE QUISER DAR UMA VOLTA.",
  ],
  campeao: [
    "PROFA. IPÊ: AS OITO! E A NIEMA CONTOU TUDO NO RÁDIO...",
    "BOITATÁ NA BR-324, IARA NA ESTRADA REAL, CURUPIRA NA MATA ATLÂNTICA. AS TRÊS LENDAS DE BRAGLITCH.",
    "NINGUÉM NUNCA PEGOU UMA. MAS NINGUÉM NUNCA PEGOU O SACI TAMBÉM, E OLHA VOCÊ AÍ.",
    "E TEM COISA MAIOR: O DESTROIUM SAIU DO SERVIDOR PELA BR-040, E O AMAZONIUM ACORDOU LÁ NO NORTE, NA FLORESTA AMAZÔNICA, PRA SEGURAR ELE.",
    "SE OS DOIS SE ENCONTRAREM, NÃO SOBRA MAPA. CHEGA ANTES DELES.",
  ],
  insignia: "VOCÊ RECEBEU A {NOME}!",
  lenda: "O DADO VOLTOU PRO LUGAR. {MON} AGORA É SEU.",
  // a lenda que apanhou e não foi pega não volta: ela aparece UMA vez
  lendaSumiu: "{MON} SE DESFEZ NO AR. NINGUÉM VAI VER ESSA LENDA DE NOVO.",
  // vencer uma lenda é capturar (src/scenes/overworld.js, conferirBraglitch)
  lendaCapturada: "{MON} CAIU... E NÃO FUGIU. UMA LENDA VENCIDA ESCOLHE QUEM A VENCEU.",
  lendaEquipe: "{MON} ENTROU NA SUA EQUIPE!",
  lendaBox: "A EQUIPE ESTÁ CHEIA: {MON} FOI PRA BOX.",
  // O LIVRO DAS COORDENADAS DA LENDA (no chão de SALVADITTO)
  livro: {
    abre: ["UM LIVRO DE CAPA DE COURO, JOGADO NO CHÃO. NA CAPA: \"COORDENADAS DA LENDA\".",
           "NA PRIMEIRA PÁGINA: \"X CONTA DA ESQUERDA PRA DIREITA, Y DE CIMA PRA BAIXO. O CANTO DE CIMA É O ZERO.\""],
    dorme: "\"ELAS SÓ ACORDAM DEPOIS DA OITAVA INSÍGNIA DE BRAGLITCH.\"",
    linha: "{MON} — {LUGAR}, X {X} Y {Y}.",
    pego: "{MON} — RISCADO À MÃO: \"CAPTURADO\".",
    sumiu: "{MON} — A TINTA DESBOTOU. SÓ SE LÊ: \"SUMIU\".",
    // as LENDAS DO VOID (src/data/void.js), nas últimas páginas. O caminho pro
    // preto vem num ENIGMA: bem difícil, mas resolvível — cada linha fala na
    // língua do próprio jogo (correr, cerca, mapa), e as iniciais das sete
    // formam ESBARRE pra quem desconfiar. A técnica (`tentarAtravessar` em
    // src/scenes/overworld.js) também dá sinal: a partir do segundo esbarrão
    // certo a tela pisca, cada vez mais.
    //   E — 5 vezes (os dedos de uma mão)
    //   S — segurando CORRER, parado contra a parede
    //   B — na cerca de árvore da borda do mapa, não numa parede do meio
    //   A — a mesma árvore, do mesmo lado
    //   R — a tela piscando é o sinal de que está certo
    //   R — do outro lado a coordenada fica negativa (ou passa do tamanho do mapa)
    //   E — pisar num chão de verdade te traz de volta
    void: [
      "AS ÚLTIMAS PÁGINAS SÃO DE OUTRA LETRA, TREMIDA:",
      "\"ESBARRE QUANTAS VEZES TIVER DE DEDOS NUMA MÃO. NEM UMA A MAIS, NEM UMA A MENOS.\"",
      "\"SEGURE A PRESSA DE QUEM CORRE, MESMO SEM TER PRA ONDE CORRER.\"",
      "\"BATA NA CERCA DE ÁRVORES QUE SEGURA O MAPA, LÁ ONDE ELE ACABA. PAREDE DO MEIO NÃO ABRE.\"",
      "\"A MESMA ÁRVORE, DO MESMO LADO, SEM DAR UM PASSO PRA TRÁS.\"",
      "\"REPARE QUANDO O MUNDO PISCAR: É ELE CEDENDO.\"",
      "\"RISQUE O ZERO DO CANTO: O QUE VEM ANTES DELE TAMBÉM É LUGAR.\"",
      "\"E QUEM CANSAR DO ESCURO, QUE PISE NUM CHÃO DE VERDADE.\"",
      "DEPOIS DISSO, MAIS TRÊS LINHAS NA MESMA LETRA TREMIDA:",
    ],
    fecha: "NO PÉ DA ÚLTIMA PÁGINA: \"CADA UMA APARECE UMA VEZ. PEGOU OU DERRUBOU, ACABOU.\"",
  },
  semPokemon: "VOCÊ NÃO TEM POKÉMON! FALE COM A PROFA. IPÊ PRIMEIRO.",
  // o 011GIVEGLITCH110 no computador dela (a primeira vez aqui)
  pc: [
    "O COMPUTADOR DA PROFA. IPÊ ESTÁ LIGADO, COM UM NOBREAK APITANDO DO LADO.",
    "NA TELA, O MESMO PROGRAMA DO LABORATÓRIO DE KANTO: 011GIVEGLITCH110.",
    "PELO JEITO O APAGÃO ESPALHOU ELE PELOS COMPUTADORES DE BRAGLITCH.",
    "A LISTA MOSTRA TODOS OS POKÉMON DO JOGO — OS DE LÁ E OS DAQUI.",
  ],
  redemoinho: [
    "UM REDEMOINHO DE POEIRA E PIXELS, PARADO NO MEIO DO CAMINHO.",
    "LÁ DENTRO, ALGUMA COISA ASSOBIA... E UM BICHO SAI GIRANDO PRA CIMA DE VOCÊ!",
  ],
  desfez: "O REDEMOINHO SE DESFEZ. SOBROU SÓ UM ASSOBIO, INDO PRO NORTE. ({N}/3)",
  semMissao: ["UM REDEMOINHO DE POEIRA E PIXELS.", "MELHOR FALAR COM A PROFA. IPÊ ANTES DE ENFIAR A MÃO NISSO."],
  saci: [
    "NO MEIO DA CLAREIRA, UM REDEMOINHO ENORME PARA DE GIRAR.",
    "DE DENTRO SAI UM BICHO DE UMA PERNA SÓ, GORRO VERMELHO, CACHIMBO NA BOCA.",
    "ELE TE OLHA, ASSOBIA... E O MUNDO EM VOLTA PISCA.",
  ],
  saciFugiu: ["O SACI GIROU NUM REDEMOINHO E SUMIU NO MATO.", "...MAS O ASSOBIO CONTINUA NA CLAREIRA. ELE VOLTA."],
  saciPego: "VOCÊ PEGOU O GORRO... E O SACI VEIO JUNTO. O ASSOBIO PAROU.",
  // O GLITCH CHEGA: com as seis lendas (DB.LENDAS_BRAG) na sua mão, o que
  // escapa não tem mais lenda pra virar — e chega do jeito que chega em Kanto
  // (src/scenes/overworld.js, `glitchChegaEmBraglitch`)
  glitchChegou: [
    "...O ASSOBIO PAROU. NÃO SÓ O DO SACI: O DE BRAGLITCH INTEIRA.",
    "AS SEIS LENDAS ESTÃO COM VOCÊ. O QUE ESCAPA DOS DADOS AGORA NÃO TEM MAIS LENDA PRA VIRAR.",
    "O CÉU DÁ UM ESTALO. UMA COLUNA DE QUADRADINHOS DESCE DO NADA E FICA.",
    "NINGUÉM PÕE NOME DE BICHO NISSO. NÃO É SACI, NÃO É BOITATÁ.",
    "É MISSINGNO. O GLITCH CHEGOU EM BRAGLITCH — E AQUI ELE CONTINUA SENDO GLITCH.",
  ],
  // pegar um MISSINGNO em Braglitch não conserta Kanto (é outro mundo quebrado)
  missingnoPego: "{MON} NÃO VIROU LENDA. CONTINUA GLITCH — SÓ QUE AGORA É SEU.",
};

// ------------------------------------------------- OS DOIS PROFESSORES
// CARVALHO e IPÊ se encontram em quatro pontos da história — dois em cada
// região. Um deles vem de visita e fica do lado do outro; falar com qualquer um
// dos dois abre a conversa, que acontece uma vez só (`flags.profs_<id>`). Quem
// visita some quando você sai do mapa.
//
// `requer`: o que precisa ter acontecido. `flags` e `semFlags` olham st.flags;
// `pegos`, st.caught; `kanto` e `braglitch`, quantas insígnias de cada lado.
// `visita`: quem é montado no mapa (o outro já mora lá, ou também é montado).
const C = "PROF. CARVALHO:", I = "PROFA. IPÊ:";
export const ENCONTROS_PROFS = [
  {
    // 1. A IPÊ ATRAVESSA O MAR: a primeira vez que você entra no laboratório de
    //    Kanto depois de conhecer as duas histórias
    id: "visita_kanto", mapa: "lab",
    requer: { flags: ["starterChosen", "bragMissao"] },
    visita: [{ id: "ipe_visita", quem: "ipe", x: 7, y: 3, dir: "down" }],
    conversa: [
      `${I} CARVALHO! OLHA QUEM EU ACHEI NO BARCO.`,
      `${C} IPÊ! VOCÊ ATRAVESSOU O MAR SÓ PRA ME VER?`,
      `${I} ATRAVESSEI PRA VER A SUA MÁQUINA. O MONITOR DE BRAGLITCH MOSTRA UM PICO TODA VEZ QUE ELA LIGA.`,
      `${C} A 011GLITCHDIMENSION110... ENTÃO O APAGÃO DE VOCÊS E A FENDA DE KANTO...`,
      `${I} ...PODEM SER O MESMO ERRO, LIDO DE DOIS LADOS DO MAR. É O QUE EU ACHO.`,
      `${C} CARVALHO E IPÊ ESTUDANDO O MESMO BUG. OS ALUNOS VÃO DIZER QUE É PESQUISA DE ÁRVORE.`,
      `${I} É PESQUISA DE RAIZ! TOMA, TREINADOR: PRA QUANDO VOCÊ ACHAR UM WEEPINBELL DO OUTRO LADO.`,
    ],
    premio: { item: "pedra da folha", qty: 1 },
    depois: [`${I} VOU FICAR ATÉ A MÁQUINA DELE LIGAR. OU ATÉ O CAFÉ ACABAR. O QUE VIER PRIMEIRO.`],
  },
  {
    // 2. O CARVALHO VEM VER O SACI: depois que ele é pego, no laboratório da IPÊ
    id: "visita_braglitch", mapa: "bra_lab",
    requer: { pegos: ["saci"] },
    visita: [{ id: "carvalho_visita", quem: "carvalho", x: 7, y: 3, dir: "down" }],
    conversa: [
      `${C} ENTÃO É ESTE O SACI. EU VIM NO PRIMEIRO BARCO QUANDO A IPÊ ME CONTOU.`,
      `${I} UMA PERNA SÓ, E MESMO ASSIM ANDA MAIS RÁPIDO QUE QUALQUER DADO DO SERVIDOR.`,
      `${C} EM KANTO O QUE ESCAPA PELA FENDA VIRA MISSINGNO. AQUI VIRA LENDA. INTERESSANTE...`,
      `${I} AQUI O POVO JÁ TINHA NOME PRA TUDO ISSO MUITO ANTES DE ALGUÉM FALAR EM GLITCH.`,
      `${C} QUEM PEGA O GORRO MANDA NELE, NÃO É? ENTÃO CUIDE BEM DESTE GORRO, TREINADOR.`,
      `${C} E ISTO É PRA ESTRADA. DAQUI ATÉ A CAPITAL SÃO OITO GINÁSIOS.`,
    ],
    premio: { item: "doce raro", qty: 3 },
    depois: [`${C} A IPÊ ME PROMETEU UM CHIMARRÃO. ESTOU ESPERANDO HÁ UMA HORA. DIZEM QUE É ASSIM MESMO.`],
  },
  {
    // 3. KANTO QUEBRA: com o mundo bugado (as oito insígnias de Kanto), a IPÊ
    //    volta ao laboratório do CARVALHO trazendo o que aprendeu com o apagão
    id: "fenda_aberta", mapa: "lab",
    requer: { flags: ["glitchWorld", "bragMissao"], semFlags: ["caughtMissingno"] },
    visita: [{ id: "ipe_visita", quem: "ipe", x: 7, y: 3, dir: "down" }],
    conversa: [
      `${I} O MONITOR DE BRAGLITCH DISPAROU. VIM NO BARCO DA MADRUGADA.`,
      `${C} A ÚLTIMA TRAVA CEDEU, IPÊ. A FENDA NÃO ESTÁ MAIS NA MÁQUINA — ESTÁ EM KANTO INTEIRA.`,
      `${I} FOI IGUAL NO APAGÃO. E A GENTE RESOLVEU SEM APAGAR NADA: DEU LUGAR PRO QUE ESTAVA SOLTO.`,
      `${C} DAR UM LUGAR PRO QUE NÃO TEM LUGAR... É EXATAMENTE O QUE A GLITCHBALL FAZ.`,
      `${I} ENTÃO VAI, TREINADOR. E LEVA ESTAS: NUM MUNDO QUEBRADO, BOLA NUNCA É DEMAIS.`,
    ],
    premio: { item: "poké bola", qty: 10 },
    depois: [`${I} SE O MISSINGNO ASSOBIAR, NÃO RESPONDE. ISSO VALE PRO SACI E VALE PRA ELE.`],
  },
  {
    // 4. A CAPITAL: depois da oitava insígnia de Braglitch, os dois esperam na
    //    porta do ginásio da NIEMA
    id: "capital", mapa: "brasilia",
    requer: { braglitch: 8 },
    visita: [
      { id: "carvalho_visita", quem: "carvalho", x: 7, y: 7, dir: "up" },
      { id: "ipe_visita", quem: "ipe", x: 8, y: 7, dir: "up" },
    ],
    conversa: [
      `${I} AS OITO DE BRAGLITCH! EU SABIA!`,
      `${C} EU TAMBÉM SABIA. EU SÓ NÃO FALEI PRA NÃO DAR AZAR.`,
      `${I} A NIEMA JÁ CONTOU TUDO. O APAGÃO FOI TESTE DELA... E SOLTOU AS TRÊS LENDAS.`,
      `${C} BOITATÁ, IARA E CURUPIRA. NA MINHA ÉPOCA A GENTE SÓ TINHA TRÊS PÁSSAROS PRA CORRER ATRÁS.`,
      `${I} A POKÉDEX VAI PRECISAR DE MAIS PÁGINA, CARVALHO.`,
      `${C} ENTÃO ELA GANHA MAIS PÁGINA. TREINADOR: DE DOIS PROFESSORES, OBRIGADO.`,
    ],
    premio: { item: "doce raro", qty: 5 },
    depois: [`${C} DEPOIS DAQUI EU VOLTO PRA KANTO. A IPÊ DIZ QUE O BARCO ENJOA. EU DIGO QUE É O CHIMARRÃO.`],
  },
];
/** Quem é quem na hora de desenhar a visita (o sprite de cada um). */
export const PROFS = { carvalho: { sprite: "prof", nome: "PROF. CARVALHO" }, ipe: { sprite: "tecnica", nome: "PROFA. IPÊ" } };

// ----------------------------------------------------------- AS MONTARIAS
// EM BRAGLITCH NINGUÉM USA GOLPE FORA DE BATALHA. Surfar, Corte, Quebra-Rocha,
// Força e Voar não funcionam do lado de cá do mar — o apagão levou isso junto.
// O que funciona é MONTARIA: cada ação tem a sua, uma espécie muito rara daqui.
//
// E QUEM CHAMA A MONTARIA É UM PANDEIRO. Os PANDEIROS DA TERRA são cinco, e a
// PROFA. IPÊ vai achando um por um conforme a história anda (`PANDEIROS`, logo
// abaixo): ela avisa pela Pokédex e o pandeiro cai na sua mochila. Tocou, a
// montaria vem — não precisa ter ela na equipe. Em Kanto vale o golpe OU o
// pandeiro. src/scenes/overworld.js (`quemSabe`) é quem decide.
export const MONTARIAS = {
  surfar: { pandeiro: "pandeiro do mar", especie: "submarinum", pergunta: "A ÁGUA É FUNDA. TOCAR O PANDEIRO DO MAR?",
            usando: "VOCÊ ENTROU NA CABINE DO {MON}. ESCOTILHA FECHADA, MOTOR LIGADO!",
            semNinguem: "A ÁGUA É FUNDA. EM BRAGLITCH SÓ SE ATRAVESSA DE SUBMARINUM — E ELE SÓ VEM COM O PANDEIRO DO MAR." },
  corte: { pandeiro: "pandeiro do mato", especie: "rocador", pergunta: "O MATO ESTÁ ALTO. TOCAR O PANDEIRO DO MATO?",
           usando: "{MON} LIGOU A LÂMINA E APAROU O MATO RENTE!",
           semNinguem: "GRAMA ALTA. ALGUMA COISA SE MEXEU LÁ DENTRO.",
           perguntaArvore: "UMA ARVOREZINHA FECHA O CAMINHO. TOCAR O PANDEIRO DO MATO?",
           usandoArvore: "O {MON} VEIO RONCANDO E DERRUBOU A ARVOREZINHA!",
           semArvore: "UMA ARVOREZINHA FECHA O CAMINHO. EM BRAGLITCH SÓ O ROÇADOR DERRUBA ISSO — E ELE SÓ VEM COM O PANDEIRO DO MATO." },
  quebrarocha: { pandeiro: "pandeiro da serra", especie: "britadeiro", pergunta: "UMA PEDRA RACHADA. TOCAR O PANDEIRO DA SERRA?",
                 usando: "{MON} BATEU NA PEDRA ATÉ ELA VIRAR CASCALHO!",
                 semNinguem: "UMA PEDRA RACHADA. EM BRAGLITCH SÓ O BRITADEIRO QUEBRA ISSO — E ELE SÓ VEM COM O PANDEIRO DA SERRA." },
  forca: { pandeiro: "pandeiro do sertão", especie: "tratorao", pergunta: "UM BLOCO PESADO. TOCAR O PANDEIRO DO SERTÃO?",
           usando: "VOCÊ SUBIU NO BANCO DO {MON}. AGORA DÁ PRA EMPURRAR O BLOCO!",
           semNinguem: "UM BLOCO DE PEDRA. EM BRAGLITCH SÓ O TRATORÃO EMPURRA ISSO — E ELE SÓ VEM COM O PANDEIRO DO SERTÃO." },
  voar: { pandeiro: "pandeiro do céu", especie: "catorbis", usando: "VOCÊ SENTOU NO ASSENTO DE VIME DO {MON}. DECOLAR!",
          semNinguem: "EM BRAGLITCH NINGUÉM VOA NA ASA DO PRÓPRIO POKÉMON. PRA ISSO TEM O CATORBIS, QUE VEM COM O PANDEIRO DO CÉU." },
};

/** Tocar um PANDEIRO pela MOCHILA (src/scenes/overworld.js): o do CÉU abre o
 *  VOAR; os outros funcionam de frente pro obstáculo, e aqui dizem onde. */
export const PANDEIRO_TEXTO = {
  foraDeBraglitch: "O PANDEIRO NÃO FAZ SOM NENHUM AQUI. ELE SÓ CHAMA QUEM MORA EM BRAGLITCH.",
  ondeGeral: "ESSE PANDEIRO SE TOCA DE FRENTE PRO QUE ESTÁ NO CAMINHO: CHEGUE PERTO E APERTE Z.",
  onde: {
    corte: "O PANDEIRO DO MATO SE TOCA DE FRENTE PRA ARVOREZINHA OU PRO MATO ALTO: CHEGUE PERTO E APERTE Z.",
    surfar: "O PANDEIRO DO MAR SE TOCA NA BEIRA DA ÁGUA: FIQUE DE FRENTE PRA ELA E APERTE Z.",
    quebrarocha: "O PANDEIRO DA SERRA SE TOCA DE FRENTE PRA PEDRA RACHADA: CHEGUE PERTO E APERTE Z.",
    forca: "O PANDEIRO DO SERTÃO SE TOCA DE FRENTE PRO BLOCO DE PEDRA: CHEGUE PERTO E APERTE Z.",
  },
};

/** OS PANDEIROS DA TERRA, na ordem em que a IPÊ acha. `requer` usa as mesmas
 *  chaves dos encontros dos professores: `pegos` e `braglitch` (insígnias). */
export const PANDEIROS = [
  { id: "mato", item: "pandeiro do mato", golpe: "corte", requer: { pegos: ["saci"] },
    fala: ["PROFA. IPÊ (PELA POKÉDEX): O SACI DEIXOU UMA COISA NA CLAREIRA QUANDO FOI PEGO!",
           "UM PANDEIRO VELHO, DE COURO E PLATINELA. OS ANTIGOS CHAMAVAM DE PANDEIRO DA TERRA.",
           "TOCA ELE PERTO DE MATO ALTO: O ROÇADOR VEM APARAR. EM BRAGLITCH É ASSIM QUE SE PASSA — GOLPE NENHUM FUNCIONA DESDE O APAGÃO.",
           "E DIZ A LENDA QUE SÃO CINCO. VOU PROCURAR OS OUTROS."] },
  { id: "mar", item: "pandeiro do mar", golpe: "surfar", requer: { braglitch: 2 },
    fala: ["PROFA. IPÊ (PELA POKÉDEX): ACHEI O SEGUNDO PANDEIRO DA TERRA! ESTAVA ENTERRADO NA AREIA DO PÍER.",
           "É O PANDEIRO DO MAR. TOCA NA BEIRA DA ÁGUA E O SUBMARINUM SOBE PRA TE BUSCAR."] },
  { id: "sertao", item: "pandeiro do sertão", golpe: "forca", requer: { braglitch: 4 },
    fala: ["PROFA. IPÊ (PELA POKÉDEX): O TERCEIRO VEIO DE CARUARU, NUMA CAIXA DE FORRÓ!",
           "É O PANDEIRO DO SERTÃO. COM ELE O TRATORÃO VEM EMPURRAR BLOCO DE PEDRA."] },
  { id: "ceu", item: "pandeiro do céu", golpe: "voar", requer: { braglitch: 5 },
    fala: ["PROFA. IPÊ (PELA POKÉDEX): O QUARTO CAIU DO CÉU. LITERALMENTE: EM CIMA DO MEU TELHADO.",
           "É O PANDEIRO DO CÉU. TOCA E O CATORBIS POUSA DO SEU LADO — ELE TE LEVA PRA QUALQUER CIDADE QUE VOCÊ JÁ CONHEÇA."] },
  { id: "serra", item: "pandeiro da serra", golpe: "quebrarocha", requer: { braglitch: 6 },
    fala: ["PROFA. IPÊ (PELA POKÉDEX): O ÚLTIMO! UM TROPEIRO TROUXE DO ALTO DO MONTE SERRA.",
           "É O PANDEIRO DA SERRA. O BRITADEIRO VEM QUEBRAR PEDRA RACHADA.",
           "OS CINCO PANDEIROS DA TERRA ESTÃO COM VOCÊ. BRAGLITCH INTEIRA ESTÁ ABERTA."] },
];
export const PANDEIRO_GANHOU = "VOCÊ RECEBEU O {ITEM}!";
/** Quem é montaria (pra Pokédex e pro check). */
export const EH_MONTARIA = new Set(Object.values(MONTARIAS).map((m) => m.especie));

// -------------------------------------------------------- O BARCO
// Uma linha só, com três pontas: KANTO (o cais de VERMILION), BRAGLITCH (o píer
// de SÃO LUCARIO) e as ILHAS SEVII. O marinheiro das SEVII e o barqueiro daqui
// são a mesma companhia — src/scenes/overworld.js (`pegarBalsa`).
export const BARCO = {
  kanto: "KANTO",
  braglitch: "BRAGLITCH",
  sevii: "ILHAS SEVII",
  pergunta: "PRA ONDE?",
  qualIlha: "QUAL ILHA?",
  aquiNao: "AGORA NÃO",
  fala: ["SOU O BARQUEIRO DE SÃO LUCARIO. LEVO PRA KANTO, PRAS ILHAS... PRA ONDE O MAR DEIXAR."],
  zarpou: "O BARQUINHO SAI DO PÍER. SÃO LUCARIO VAI FICANDO PEQUENA LÁ ATRÁS.",
  chegouKanto: "VOCÊ CHEGOU EM KANTO — CAIS DE VERMILION.",
  chegouBraglitch: "VOCÊ CHEGOU EM BRAGLITCH — PÍER DE SÃO LUCARIO DO SUL.",
};

// ------------------------------------------------------------ A TRILHA
// Original, como toda a trilha do jogo (a regra está no alto de
// src/data/music.js). SÃO LUCARIO é uma bossa: o baixo não cai no tempo, a
// melodia desce devagar. A BR-101 é um baião: zabumba no "tum-ta-tum", o
// triângulo nos contratempos e a sanfona (pulso cheio) fazendo a frase.
const melodia = (vol = 0.5) => ({ wave: "pulso", duty: 0.25, vol, detune: 6, eco: true,
                                  vibrato: { hz: 6.2, cents: 13 } });
const sanfona = (vol = 0.42) => ({ wave: "pulso", duty: 0.5, vol, detune: 9, eco: true,
                                   vibrato: { hz: 5.4, cents: 18 } });
const violao = (vol = 0.2) => ({ wave: "pulso", duty: 0.125, vol, legato: 0.5 });
const baixo = (vol = 0.55) => ({ wave: "triangle", vol, legato: 0.9 });

export const BRAGLITCH_MUSIC = {
  saolucario: {
    bpm: 92,
    tracks: [
      { ...melodia(0.46), notes: [
        ["E5", 1.5], ["D5", 0.5], ["B4", 1], ["A4", 1],
        ["B4", 0.5], ["C5", 1], ["B4", 0.5], ["G4", 2],
        ["A4", 1.5], ["G4", 0.5], ["E4", 1], ["G4", 1],
        ["F#4", 0.5], ["G4", 1], ["A4", 0.5], ["B4", 2],
        ["E5", 1.5], ["D5", 0.5], ["C5", 1], ["B4", 1],
        ["A4", 0.5], ["B4", 1], ["G4", 0.5], ["E4", 2],
        ["F#4", 1], ["A4", 1], ["G4", 1], ["F#4", 1],
        ["E4", 3], ["-", 1],
      ] },
      // a batida da bossa no violão: acorde picado fora do tempo
      { ...violao(0.2), notes: [
        ["E4", 0.5], ["-", 0.25], ["G4", 0.5], ["B4", 0.25], ["-", 0.5], ["G4", 0.5], ["-", 0.25], ["B4", 0.75], ["G4", 0.5],
        ["D4", 0.5], ["-", 0.25], ["F#4", 0.5], ["A4", 0.25], ["-", 0.5], ["F#4", 0.5], ["-", 0.25], ["A4", 0.75], ["F#4", 0.5],
      ] },
      { ...baixo(0.52), notes: [
        ["E2", 1.5], ["B2", 0.5], ["E2", 1], ["B2", 1],
        ["D2", 1.5], ["A2", 0.5], ["D2", 1], ["A2", 1],
        ["C2", 1.5], ["G2", 0.5], ["C2", 1], ["G2", 1],
        ["B1", 1.5], ["F#2", 0.5], ["B1", 1], ["F#2", 1],
      ] },
      { wave: "ruido", vol: 0.18, notes: [["x", 0.5], ["-", 0.25], ["x", 0.25], ["-", 0.5], ["x", 0.5], ["-", 0.25], ["x", 0.5], ["-", 0.25], ["x", 0.5], ["-", 0.5]] },
    ],
  },
  br101: {
    bpm: 128,
    tracks: [
      { ...sanfona(0.42), notes: [
        ["A4", 0.5], ["C5", 0.5], ["D5", 1], ["C5", 0.5], ["A4", 0.5], ["G4", 1],
        ["A4", 0.5], ["C5", 0.5], ["E5", 1], ["D5", 1], ["-", 1],
        ["E5", 0.5], ["G5", 0.5], ["E5", 0.5], ["D5", 0.5], ["C5", 1], ["A4", 1],
        ["G4", 0.5], ["A4", 0.5], ["C5", 0.5], ["G4", 0.5], ["A4", 2],
      ] },
      // o triângulo: tique no contratempo, abafado no tempo
      { wave: "pulso", duty: 0.125, vol: 0.1, legato: 0.2, notes: [
        ["A6", 0.5], ["E7", 0.5], ["A6", 0.5], ["E7", 0.5],
      ] },
      // zabumba: TUM - - ta TUM - ta -
      { ...baixo(0.58), notes: [
        ["A2", 0.75], ["-", 0.25], ["A2", 0.5], ["E2", 0.5], ["A2", 0.75], ["-", 0.25], ["G2", 1],
        ["D2", 0.75], ["-", 0.25], ["D2", 0.5], ["A2", 0.5], ["E2", 0.75], ["-", 0.25], ["E2", 1],
      ] },
      { wave: "ruido", vol: 0.3, notes: [["x", 0.75], ["-", 0.25], ["x", 0.5], ["x", 0.5], ["x", 0.75], ["-", 0.25], ["x", 1]] },
    ],
  },
};

// ------------------------------------------------------------ O BONDINHO
// A PRAIA DO LARVANJAL fica DEPOIS DA ÁGUA de CARVORIÚ, e não tem estrada: a
// única ligação é o BONDINHO, que sai da areia de Carvoriú, passa por cima do
// mar e desce na areia de lá (como o de Balneário Camboriú, que atravessa o
// morro). Uma estação em cada ponta; falar com ela é comprar a passagem. A
// viagem é desenhada (src/scenes/overworld.js, `drawBondinho`): a cabine anda
// pelo cabo, balançando, com o mar embaixo.
export const BONDINHO = {
  estacoes: [
    // `cabo`: pra que borda do mapa o cabo vai (é onde fica o mar)
    { mapa: "carvoriu", nome: "CARVORIÚ", x: 16, y: 9, chegada: { x: 16, y: 10 }, cabo: "up" },
    // a chegada é a mesma de src/data/braglitch-sul.js (larvanjal.chegada)
    { mapa: "larvanjal", nome: "PRAIA DO LARVANJAL", x: 17, y: 13, chegada: { x: 17, y: 12 }, cabo: "down" },
  ],
  pergunta: "BONDINHO — ESTAÇÃO {AQUI}. IR ATÉ {LA}?",
  opcoes: ["SIM", "NÃO"],
  partiu: "A CABINE BALANÇA, O CABO ESTALA... E LÁ VAI O BONDINHO!",
  chegou: "O BONDINHO PAROU. VOCÊ DESCEU EM {LA}.",
  ceu: "BONDINHO: {LA}",
};
