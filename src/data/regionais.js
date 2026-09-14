// AS FORMAS REGIONAIS: ALOLA, GALAR, HISUI e PALDEA.
//
// O MESMO BICHO, CRIADO EM OUTRO LUGAR. Um VULPIX de Kanto é de FOGO; o de
// Alola nasceu na neve e é de GELO. Não é evolução e não é forma alternativa de
// batalha (como as MEGA, que só existem dentro da luta e não vão pro save):
// é uma espécie de verdade, que se captura, sobe de nível e evolui na linha
// dela.
//
// DE ONDE ELAS VÊM AQUI. Da 011GLITCHDIMENSION110, como todo o resto que não é
// de Kanto (src/data/extra.js). A fenda é um buraco pra outro LUGAR, e outro
// lugar é exatamente o que uma forma regional é: o mesmo dado lido numa região
// que não é esta. Elas entram nas tabelas de encontro da fenda por terreno.
//
// O NOME É `BASE-REGIÃO` (VULPIX-ALOLA, MEOWTH-GALAR), no mesmo formato que o
// jogo já usa pra DEOXYS-ATAQUE e NIDORAN-F. O painel de batalha corta em dez
// letras, então os nomes compridos aparecem cortados lá — como CHANDELURE e
// PORYGON-Z já aparecem hoje.
//
// O SPRITE não pode sair do número da Pokédex: um VULPIX-ALOLA é o nº 37, o
// mesmo do VULPIX comum, e os dois têm que desenhar diferente. Por isso a tabela
// tem uma coluna a mais — o id da FORMA na PokeAPI, que vira o arquivo
// assets/sprites/pokemon/10103.png e é achado pelo campo `spriteDex` (o mesmo
// caminho das MEGA). Zero nessa coluna quer dizer "usa o número da Pokédex".
//
//   Pokédex | sprite | NOME | TIPOS | HP ATK DEF SPA SPD SPE
import { slugify } from "./gen1.js";

// --------------------------------------------------------------------- ALOLA
// A região do vulcão e da neve no mesmo arquipélago. Os bichos de Kanto que
// foram parar lá viraram outra coisa pra caber no clima — e o EXEGGUTOR só
// cresceu, porque ninguém disse pra ele parar.
const ALOLA = `
 19 | 10091 | RATTATA-ALOLA   | SOMBRIO/NORMAL    |  30  56  35  25  35  72
 20 | 10092 | RATICATE-ALOLA  | SOMBRIO/NORMAL    |  75  71  70  40  80  77
 26 | 10100 | RAICHU-ALOLA    | ELÉTRICO/PSÍQUICO |  60  85  50  95  85 110
 27 | 10101 | SANDSHREW-ALOLA | GELO/AÇO          |  50  75  90  10  35  40
 28 | 10102 | SANDSLASH-ALOLA | GELO/AÇO          |  75 100 120  25  65  65
 37 | 10103 | VULPIX-ALOLA    | GELO              |  38  41  40  50  65  65
 38 | 10104 | NINETALES-ALOLA | GELO/FADA         |  73  67  75  81 100 109
 50 | 10105 | DIGLETT-ALOLA   | TERRA/AÇO         |  10  55  30  35  45  90
 51 | 10106 | DUGTRIO-ALOLA   | TERRA/AÇO         |  35 100  60  50  70 110
 52 | 10107 | MEOWTH-ALOLA    | SOMBRIO           |  40  35  35  50  40  90
 53 | 10108 | PERSIAN-ALOLA   | SOMBRIO           |  65  60  60  75  65 115
 74 | 10109 | GEODUDE-ALOLA   | PEDRA/ELÉTRICO    |  40  80 100  30  30  20
 75 | 10110 | GRAVELER-ALOLA  | PEDRA/ELÉTRICO    |  55  95 115  45  45  35
 76 | 10111 | GOLEM-ALOLA     | PEDRA/ELÉTRICO    |  80 120 130  55  65  45
 88 | 10112 | GRIMER-ALOLA    | VENENO/SOMBRIO    |  80  80  50  40  50  25
 89 | 10113 | MUK-ALOLA       | VENENO/SOMBRIO    | 105 105  75  65 100  50
103 | 10114 | EXEGGUTOR-ALOLA | PLANTA/DRAGÃO     |  95 105  85 125  75  45
105 | 10115 | MAROWAK-ALOLA   | FOGO/FANTASMA     |  60  80 110  50  80  45
`;

// --------------------------------------------------------------------- GALAR
// A região industrial. Aqui o MEOWTH virou metal, o WEEZING virou chaminé de
// fábrica com cartola, e os três pássaros de Kanto viraram outra coisa inteira.
const GALAR = `
 52 | 10161 | MEOWTH-GALAR     | AÇO               |  50  65  55  40  40  40
 77 | 10162 | PONYTA-GALAR     | PSÍQUICO          |  50  85  55  65  65  90
 78 | 10163 | RAPIDASH-GALAR   | PSÍQUICO/FADA     |  65 100  70  80  80 105
 79 | 10164 | SLOWPOKE-GALAR   | PSÍQUICO          |  90  65  65  40  40  15
 80 | 10165 | SLOWBRO-GALAR    | VENENO/PSÍQUICO   |  95 100  95 100  70  30
 83 | 10166 | FARFETCHD-GALAR  | LUTADOR           |  52  95  55  58  62  55
110 | 10167 | WEEZING-GALAR    | VENENO/FADA       |  65  90 120  85  70  60
122 | 10168 | MR-MIME-GALAR    | GELO/PSÍQUICO     |  50  65  65  90  90 100
144 | 10169 | ARTICUNO-GALAR   | PSÍQUICO/VOADOR   |  90  85  85 125 100  95
145 | 10170 | ZAPDOS-GALAR     | LUTADOR/VOADOR    |  90 125  90  85  90 100
146 | 10171 | MOLTRES-GALAR    | SOMBRIO/VOADOR    |  90  85  90 100 125  90
199 | 10172 | SLOWKING-GALAR   | VENENO/PSÍQUICO   |  95  65  80 110 110  30
222 | 10173 | CORSOLA-GALAR    | FANTASMA          |  60  55 100  65 100  30
263 | 10174 | ZIGZAGOON-GALAR  | SOMBRIO/NORMAL    |  38  30  41  30  41  60
264 | 10175 | LINOONE-GALAR    | SOMBRIO/NORMAL    |  78  70  61  50  61 100
554 | 10176 | DARUMAKA-GALAR   | GELO              |  70  90  45  15  45  50
555 | 10177 | DARMANITAN-GALAR | GELO              | 105 140  55  30  55  95
562 | 10179 | YAMASK-GALAR     | TERRA/FANTASMA    |  38  55  85  30  65  30
618 | 10180 | STUNFISK-GALAR   | TERRA/AÇO         | 109  81  99  66  84  32
862 |     0 | OBSTAGOON        | SOMBRIO/NORMAL    |  93  90 101  60  81  95
863 |     0 | PERRSERKER       | AÇO               |  70 110 100  50  60  50
864 |     0 | CURSOLA          | FANTASMA          |  60  95  50 145 130  30
865 |     0 | SIRFETCHD        | LUTADOR           |  62 135  95  68  82  65
866 |     0 | MR-RIME          | GELO/PSÍQUICO     |  80  85  75 110 100  70
867 |     0 | RUNERIGUS        | TERRA/FANTASMA    |  58  95 145  50 105  30
`;

// --------------------------------------------------------------------- HISUI
// A mesma terra de Galar, séculos antes de virar Galar. É a região mais velha
// que o jogo alcança sem o CELEBI — e por isso as formas daqui são as mais
// ásperas: o ARCANINE ainda tem pedra no couro, e o SNEASEL ainda é veneno.
const HISUI = `
 58 | 10229 | GROWLITHE-HISUI  | FOGO/PEDRA        |  60  75  45  65  50  55
 59 | 10230 | ARCANINE-HISUI   | FOGO/PEDRA        |  95 115  80  95  80  90
100 | 10231 | VOLTORB-HISUI    | ELÉTRICO/PLANTA   |  40  30  50  55  55 100
101 | 10232 | ELECTRODE-HISUI  | ELÉTRICO/PLANTA   |  60  50  70  80  80 150
157 | 10233 | TYPHLOSION-HISUI | FOGO/FANTASMA     |  73  84  78 119  85  95
211 | 10234 | QWILFISH-HISUI   | SOMBRIO/VENENO    |  65  95  85  55  55  85
215 | 10235 | SNEASEL-HISUI    | LUTADOR/VENENO    |  55  95  55  35  75 115
503 | 10236 | SAMUROTT-HISUI   | ÁGUA/SOMBRIO      |  90 108  80 100  65  85
549 | 10237 | LILLIGANT-HISUI  | PLANTA/LUTADOR    |  70 105  75  50  75 105
550 | 10247 | BASCULIN-HISUI   | ÁGUA              |  70  92  65  80  55  98
570 | 10238 | ZORUA-HISUI      | NORMAL/FANTASMA   |  35  60  40  85  40  70
571 | 10239 | ZOROARK-HISUI    | NORMAL/FANTASMA   |  55 100  60 125  60 110
628 | 10240 | BRAVIARY-HISUI   | PSÍQUICO/VOADOR   | 110  83  70 112  70  65
705 | 10241 | SLIGGOO-HISUI    | AÇO/DRAGÃO        |  58  75  83  83 113  40
706 | 10242 | GOODRA-HISUI     | AÇO/DRAGÃO        |  80 100 100 110 150  60
713 | 10243 | AVALUGG-HISUI    | GELO/PEDRA        |  95 127 184  34  36  38
724 | 10244 | DECIDUEYE-HISUI  | PLANTA/LUTADOR    |  88 112  80  95  95  60
901 |     0 | URSALUNA         | TERRA/NORMAL      | 130 140 105  45  80  50
902 |     0 | BASCULEGION      | ÁGUA/FANTASMA     | 120 112  65  80  75  78
903 |     0 | SNEASLER         | LUTADOR/VENENO    |  80 130  60  40  80 120
904 |     0 | OVERQWIL         | SOMBRIO/VENENO    |  85 115  95  65  65  85
`;

// -------------------------------------------------------------------- PALDEA
// A região mais nova. São poucas formas, e três delas são o mesmo TAUROS criado
// de três jeitos — o de briga, o de fogo e o de água.
const PALDEA = `
128 | 10250 | TAUROS-PALDEA  | LUTADOR           |  75 110 105  30  70 100
128 | 10251 | TAUROS-BRASA   | LUTADOR/FOGO      |  75 110 105  30  70 100
128 | 10252 | TAUROS-ONDA    | LUTADOR/ÁGUA      |  75 110 105  30  70 100
194 | 10253 | WOOPER-PALDEA  | VENENO/TERRA      |  55  45  45  25  25  15
901 | 10272 | URSALUNA-PALDEA| TERRA/NORMAL      | 113  70 120 135  65  52
980 |     0 | CLODSIRE       | VENENO/TERRA      | 130  75  60  45 100  20
`;

// ------------------------------------------------------------------- AS BASES
// As espécies COMUNS que faltavam pras linhagens acima fecharem. Meia linhagem é
// uma espécie que sobe de nível a vida toda esperando virar uma coisa que não
// existe — e o jogo cala, porque `evolutionFor` simplesmente não acha regra
// nenhuma (é a mesma lição do cabeçalho de src/data/extra.js).
//
// Elas entram como bicho de Kanto entra: número da Pokédex, sprite pelo número.
const BASES = `
194 |     0 | WOOPER       | ÁGUA/TERRA        |  55  45  45  25  25  15
195 |     0 | QUAGSIRE     | ÁGUA/TERRA        |  95  85  85  65  65  35
211 |     0 | QWILFISH     | ÁGUA/VENENO       |  65  95  85  55  55  85
216 |     0 | TEDDYURSA    | NORMAL            |  60  80  50  50  50  40
217 |     0 | URSARING     | NORMAL            |  90 130  75  75  75  55
222 |     0 | CORSOLA      | ÁGUA/PEDRA        |  65  55  95  65  95  35
263 |     0 | ZIGZAGOON    | NORMAL            |  38  30  41  30  41  60
264 |     0 | LINOONE      | NORMAL            |  78  70  61  50  61 100
548 |     0 | PETILIL      | PLANTA            |  45  35  50  70  50  30
549 |     0 | LILLIGANT    | PLANTA            |  70  60  75 110  75  90
550 |     0 | BASCULIN     | ÁGUA              |  70  92  65  80  55  98
554 |     0 | DARUMAKA     | FOGO              |  70  90  45  15  45  50
555 |     0 | DARMANITAN   | FOGO              | 105 140  55  30  55  95
562 |     0 | YAMASK       | FANTASMA          |  38  30  85  55  65  30
563 |     0 | COFAGRIGUS   | FANTASMA          |  58  50 145  95 105  30
570 |     0 | ZORUA        | SOMBRIO           |  40  65  40  80  40  65
571 |     0 | ZOROARK      | SOMBRIO           |  60 105  60 120  60 105
618 |     0 | STUNFISK     | TERRA/ELÉTRICO    | 109  66  84  81  99  32
627 |     0 | RUFFLET      | NORMAL/VOADOR     |  70  83  50  37  50  60
628 |     0 | BRAVIARY     | NORMAL/VOADOR     | 100 123  75  57  75  80
704 |     0 | GOOMY        | DRAGÃO            |  45  50  35  55  75  40
705 |     0 | SLIGGOO      | DRAGÃO            |  68  75  53  83 113  60
706 |     0 | GOODRA       | DRAGÃO            |  90 100  70 110 150  80
712 |     0 | BERGMITE     | GELO              |  55  69  85  32  35  28
713 |     0 | AVALUGG      | GELO              |  95 117 184  44  46  28
`;

/** De que região é cada forma. Vira o rótulo da Pokédex e é o que a fenda usa
 *  pra dizer de onde aquilo vazou. */
export const REGIAO = {};

/** As espécies deste arquivo (formas + bases), no formato do DB.SPECIES. */
export const REGIONAIS = {};

function ler(tabela, regiao) {
  for (const linha of tabela.trim().split("\n")) {
    if (!linha.trim()) continue;
    const [dex, sprite, nome, tipos, stats] = linha.split("|").map((c) => c.trim());
    const [hp, atk, def, spa, spd, spe] = stats.split(/\s+/).map(Number);
    const base = { hp, atk, def, spa, spd, spe };
    const bst = Object.values(base).reduce((a, b) => a + b, 0);
    const id = slugify(nome);
    REGIONAIS[id] = {
      id, dex: +dex, name: nome, types: tipos.split("/"), base, bst, foreign: true,
      // zero na coluna do sprite = usa o número da Pokédex (é o caso das bases
      // comuns, que não são forma de nada)
      ...(+sprite ? { spriteDex: +sprite } : {}),
      ...(regiao ? { regiao } : {}),
      catchRate: bst >= 600 ? 3 : bst >= 500 ? 45 : 120,
      xpYield: Math.floor(bst / 4),
    };
    if (regiao) REGIAO[id] = regiao;
  }
}

ler(ALOLA, "ALOLA");
ler(GALAR, "GALAR");
ler(HISUI, "HISUI");
ler(PALDEA, "PALDEA");
ler(BASES, null);

/** Os ids de forma da PokeAPI que precisam ser baixados
 *  (`python3 tools/fetch_sprites.py --regionais`). */
export const SPRITES_FORMA = Object.values(REGIONAIS)
  .map((sp) => sp.spriteDex).filter(Boolean);

/** E os números de Pokédex das bases novas, que vêm pelo caminho normal. */
export const SPRITES_BASE = Object.values(REGIONAIS)
  .filter((sp) => !sp.spriteDex).map((sp) => sp.dex);

// ---------------------------------------------------------------- AS EVOLUÇÕES
//
// Duas coisas acontecem aqui.
//
// 1. AS LINHAS DAS FORMAS, que são inteiras e independentes: um MEOWTH-ALOLA
//    vira PERSIAN-ALOLA, e nunca um PERSIAN de Kanto. Isso é só tabela.
//
// 2. AS BIFURCAÇÕES, que são o motivo deste bloco existir. Um PIKACHU pode
//    virar RAICHU **ou** RAICHU-ALOLA, e quem decide é O LUGAR onde a pedra é
//    usada. É a regra dos jogos de verdade — a forma regional é a criação
//    naquela região — traduzida pro mapa que este jogo tem:
//
//      onde: "sevii"   as ILHAS SEVII (é ali que o RAICHU-ALOLA sai, como pedido)
//      onde: "fenda"   dentro da 011GLITCHDIMENSION110
//      onde: "fora"    qualquer lugar que não seja Kanto (as duas de cima e as eras)
//
//    Regra SEM `onde` vale em qualquer lugar, e por isso ela é sempre a última
//    da lista: quem tem lugar é conferido primeiro (ver `evolucaoDe` em
//    src/systems/regionais.js). Sem essa ordem, o PIKACHU viraria RAICHU comum
//    na Ilha Cinco e a bifurcação não existiria.
//
// As regras entram em src/data/evolution.js por CONCATENAÇÃO, e não por cima:
// escrever de novo o `{ item: "pedra do trovão", to: "raichu" }` do PIKACHU aqui
// seria a mesma informação em dois arquivos, e um dos dois fica pra trás.
export const EVO_REGIONAIS = {
  // ------------------------------------------------------- as bifurcações
  // O PIKACHU nas ilhas. Em Kanto a pedra faz o RAICHU de sempre.
  pikachu: [{ item: "pedra do trovão", onde: "sevii", to: "raichualola" }],
  // O EXEGGUTOR que não parou de crescer, e o MAROWAK que pegou fogo: os dois
  // só saem assim do lado de lá.
  exeggcute: [{ item: "pedra da folha", onde: "fora", to: "exeggutoralola" }],
  cubone: [{ lvl: 28, onde: "fora", to: "marowakalola" }],

  // ------------------------------------------------------------ ALOLA
  rattataalola: [{ lvl: 20, to: "raticatealola" }],
  sandshrewalola: [{ item: "pedra do gelo", to: "sandslashalola" }],
  vulpixalola: [{ item: "pedra do gelo", to: "ninetalesalola" }],
  diglettalola: [{ lvl: 26, to: "dugtrioalola" }],
  meowthalola: [{ lvl: 28, to: "persianalola" }],
  geodudealola: [{ lvl: 25, to: "graveleralola" }],
  graveleralola: [{ lvl: 45, to: "golemalola" }],     // era por troca
  grimeralola: [{ lvl: 38, to: "mukalola" }],

  // ------------------------------------------------------------ GALAR
  meowthgalar: [{ lvl: 28, to: "perrserker" }],
  ponytagalar: [{ lvl: 40, to: "rapidashgalar" }],
  // as duas coroas do SLOWPOKE de Galar viraram duas pedras: a que já existe
  // aqui pro SLOWBRO e a da lua pro SLOWKING
  slowpokegalar: [{ item: "pedra da água", to: "slowbrogalar" },
                  { item: "pedra da lua", to: "slowkinggalar" }],
  farfetchdgalar: [{ lvl: 35, to: "sirfetchd" }],
  mrmimegalar: [{ lvl: 42, to: "mrrime" }],
  corsolagalar: [{ lvl: 38, to: "cursola" }],
  zigzagoongalar: [{ lvl: 20, to: "linoonegalar" }],
  linoonegalar: [{ lvl: 35, to: "obstagoon" }],
  darumakagalar: [{ item: "pedra do gelo", to: "darmanitangalar" }],
  yamaskgalar: [{ lvl: 34, to: "runerigus" }],

  // ------------------------------------------------------------ HISUI
  growlithehisui: [{ item: "pedra do fogo", to: "arcaninehisui" }],
  voltorbhisui: [{ item: "pedra da folha", to: "electrodehisui" }],
  qwilfishhisui: [{ lvl: 40, to: "overqwil" }],
  sneaselhisui: [{ lvl: 40, to: "sneasler" }],
  zoruahisui: [{ lvl: 30, to: "zoroarkhisui" }],
  sliggoohisui: [{ lvl: 50, to: "goodrahisui" }],
  basculinhisui: [{ lvl: 40, to: "basculegion" }],

  // ------------------------------------ as bases novas, e as bifurcações delas
  // Cada uma destas linhas existe nas duas versões: a comum, em qualquer lugar,
  // e a de HISUI, do lado de lá. É o mesmo bicho criado noutro século.
  wooper: [{ lvl: 20, to: "quagsire" }],
  wooperpaldea: [{ lvl: 20, to: "clodsire" }],
  qwilfish: [{ lvl: 40, onde: "fora", to: "overqwil" }],
  teddyursa: [{ lvl: 30, to: "ursaring" }],
  // O URSARING vira URSALUNA na lua cheia. Aqui é a PEDRA DA LUA — e do lado de
  // lá sai a LUA DE SANGUE de Paldea, que é a mesma lua vista de outro lugar.
  ursaring: [{ item: "pedra da lua", onde: "fora", to: "ursalunapaldea" },
             { item: "pedra da lua", to: "ursaluna" }],
  corsola: [{ lvl: 38, onde: "fora", to: "cursola" }],
  zigzagoon: [{ lvl: 20, to: "linoone" }],
  linoone: [{ lvl: 35, onde: "fora", to: "obstagoon" }],
  petilil: [{ item: "pedra da folha", onde: "fora", to: "lilliganthisui" },
            { item: "pedra da folha", to: "lilligant" }],
  darumaka: [{ lvl: 35, to: "darmanitan" }],
  yamask: [{ lvl: 34, to: "cofagrigus" }],
  zorua: [{ lvl: 30, to: "zoroark" }],
  rufflet: [{ lvl: 54, onde: "fora", to: "braviaryhisui" },
            { lvl: 54, to: "braviary" }],
  goomy: [{ lvl: 40, onde: "fora", to: "sliggoohisui" },
          { lvl: 40, to: "sliggoo" }],
  sliggoo: [{ lvl: 50, to: "goodra" }],
  bergmite: [{ lvl: 37, onde: "fora", to: "avalugghisui" },
             { lvl: 37, to: "avalugg" }],
};

/** A PEDRA DO GELO. Ela não existe em Kanto: entra pelo mesmo caminho da PEDRA
 *  DO CREPÚSCULO, caindo na fenda (ver DIM_LOOT em src/data/loot.js). É ela que
 *  fecha as três linhas de gelo que vieram junto — VULPIX e SANDSHREW de Alola e
 *  o DARUMAKA de Galar. */
export const PEDRA_GELO = "pedra do gelo";

/** A frase de cada forma, pra Pokédex e pro primeiro encontro na fenda. Uma por
 *  espécie: texto genérico em bicho que a pessoa atravessou a fenda pra ver é o
 *  mesmo que não escrever nada. */
export const LORE = {
  rattataalola: "MUDOU PRO TURNO DA NOITE. AGORA ELE SÓ APARECE DEPOIS QUE A COZINHA APAGA.",
  raticatealola: "ELE NÃO CAÇA: ELE MANDA O BANDO CAÇAR E ESCOLHE O QUE CHEGA.",
  raichualola: "APRENDEU A SURFAR NO PRÓPRIO RABO. NINGUÉM ENSINOU E NINGUÉM PEDIU.",
  sandshrewalola: "A CASCA VIROU GELO E AÇO. ELE NÃO CAVA MAIS AREIA — ELE PATINA.",
  sandslashalola: "OS ESPINHOS SÃO ESTALACTITES. ELE SOBE A MONTANHA CRAVANDO ELES.",
  vulpixalola: "NASCEU NUM VULCÃO NEVADO E ESCOLHEU A NEVE. SOPRA GELO A MENOS VINTE.",
  ninetalesalola: "AS NOVE CAUDAS VIRARAM VENTO FRIO. ELE É TRATADO COMO DEUS NA MONTANHA.",
  diglettalola: "OS TRÊS FIOS DE CABELO SÃO BIGODES DE METAL. ELE SENTE O CHÃO POR ELES.",
  dugtrioalola: "AS TRÊS CABELEIRAS DE OURO SÃO SAGRADAS. ARRANCAR UMA É PROBLEMA SÉRIO.",
  meowthalola: "FOI CRIADO NA CASA DA REALEZA E FICOU MAL-ACOSTUMADO. GUARDA RANCOR.",
  persianalola: "A CARA REDONDA É CONSIDERADA A MAIS BONITA LÁ. ELE SABE DISSO.",
  geodudealola: "TEM LIMALHA DE FERRO NAS SOBRANCELHAS. ELE SOLTA FAÍSCA AO ROLAR.",
  graveleralola: "COME PEDRA COM IMÃ DENTRO. QUANDO BRIGA, OS DOIS SE ELETROCUTAM JUNTOS.",
  golemalola: "ATIRA PEDRA MAGNETIZADA PELAS COSTAS. A PEDRA VOLTA SOZINHA.",
  grimeralola: "COMEU LIXO DEMAIS E OS CRISTAIS DOS DENTES SÃO O QUE SOBROU.",
  mukalola: "A COR MUDA CONFORME O QUE ELE COMEU. SE ELE FICAR SEM LIXO, ELE ADOECE.",
  exeggutoralola: "NINGUÉM DISSE PRA ELE PARAR DE CRESCER. AGORA TEM UMA CABEÇA NO RABO.",
  marowakalola: "GIRA O OSSO EM CHAMAS PELOS QUE MORRERAM. É UMA DANÇA, NÃO UM GOLPE.",

  meowthgalar: "FOI CRIADO ENTRE GENTE QUE BRIGAVA POR METAL. O PELO ENDURECEU.",
  perrserker: "O CAPACETE NÃO É ENFEITE: CRESCEU ASSIM DE TANTO BATER CABEÇA.",
  ponytagalar: "A JUBA BRILHA COM UMA ENERGIA QUE NÃO É LUZ. SÓ CRIANÇA CONSEGUE VER.",
  rapidashgalar: "O CHIFRE ATRAVESSA QUALQUER COISA — INCLUSIVE O QUE VOCÊ ESTAVA PENSANDO.",
  slowpokegalar: "COMEU A ESPECIARIA ERRADA E ESTÁ ESPERANDO O EFEITO. FAZ ANOS.",
  slowbrogalar: "O SHELLDER MORDEU O BRAÇO E VIROU CANHÃO. O VENENO DELE VEM DAÍ.",
  slowkinggalar: "O SHELLDER NA CABEÇA É QUEM FALA. O SLOWKING SÓ ABRE A BOCA.",
  farfetchdgalar: "O ALHO-PORÓ ENGROSSOU DE TANTO SER USADO COMO LANÇA.",
  sirfetchd: "APOSENTOU O ALHO-PORÓ QUANDO ELE MURCHOU. O ESCUDO É A FOLHA.",
  weezinggalar: "FILTRA O AR SUJO DA FÁBRICA E DEVOLVE AR LIMPO. AS CARTOLAS SÃO CHAMINÉS.",
  mrmimegalar: "DANÇA NO GELO QUE ELE MESMO FAZ. A PAREDE INVISÍVEL VIROU PISTA.",
  mrrime: "O SAPATEADO DELE HIPNOTIZA QUEM OLHA. A GRAVATA É PARTE DO CORPO.",
  articunogalar: "A CALMA DELE É IMPOSTA: ELE LÊ A HESITAÇÃO E TRANSFORMA EM PESO.",
  zapdosgalar: "PAROU DE VOAR E APRENDEU A CORRER. AS PERNAS SÃO O RAIO AGORA.",
  moltresgalar: "A CHAMA VIROU FUMAÇA PRETA. QUEM OLHA DEMAIS PERDE A VONTADE DE LUTAR.",
  corsolagalar: "O MAR SECOU E ELE CONTINUOU. O QUE SOBROU É O ESQUELETO COM SAUDADE.",
  cursola: "A ALMA ESCAPA PELOS GALHOS. ENCOSTAR NELA ENDURECE O QUE ENCOSTOU.",
  zigzagoongalar: "O PRIMEIRO DE TODOS OS ZIGZAGOON. ANDA TORTO PORQUE NÃO SABE PARAR QUIETO.",
  linoonegalar: "CORRE EM LINHA RETA E SÓ. VIRAR É COM O CORPO INTEIRO, DERRAPANDO.",
  obstagoon: "APRENDEU A GRITAR E A LEVANTAR OS BRAÇOS. É INTIMIDAÇÃO PURA, E FUNCIONA.",
  darumakagalar: "O FOGO DELE APAGOU HÁ MUITO TEMPO. O QUE SOBROU CONGELA.",
  darmanitangalar: "CARREGA UMA BOLA DE NEVE E ARREMESSA A DUZENTOS POR HORA.",
  yamaskgalar: "SEGURA UM TABLETE DE BARRO COM O DESENHO DO QUE ELE ERA ANTES.",
  runerigus: "A PINTURA DA PEDRA CONTA COMO ELE MORREU. NÃO OLHE ATÉ O FIM.",
  stunfiskgalar: "FINGE SER ARMADILHA DE METAL NO CHÃO. E É EXATAMENTE ISSO.",

  growlithehisui: "TEM PEDRA CRESCIDA NO COURO. O ROSNADO SAI COM CASCALHO JUNTO.",
  arcaninehisui: "MUITO MAIOR DO QUE O DE HOJE. A ROCHA NAS COSTAS É PARTE DELE.",
  voltorbhisui: "É UMA POKÉ BOLA DE MADEIRA. ELE CUSPIU SEMENTE QUANDO ESTOUROU.",
  electrodehisui: "PARECE UM FRUTO. ELE EXPLODE DO MESMO JEITO, MAS ESPALHA SEMENTE.",
  typhlosionhisui: "AS CHAMAS DELE PURIFICAM ALMA. É UM TRABALHO, E ELE NÃO ESCOLHEU.",
  qwilfishhisui: "O VENENO DAQUELE MAR ERA MAIS FORTE. ELE FICOU PRETO DE TANTO GUARDAR.",
  sneaselhisui: "SOBE PENHASCO CRAVANDO A GARRA. O VENENO ESTÁ NA PONTA DELA.",
  sneasler: "SOBE A MONTANHA INTEIRA CARREGANDO GENTE. ELE DECIDE QUEM SOBE.",
  overqwil: "MIL ESPINHOS, E ELE COME OS PRÓPRIOS. FICOU COM RAIVA DE TUDO.",
  samurotthisui: "A CONCHA VIROU LÂMINA. ELE CORTA PRIMEIRO E NÃO AVISA.",
  lilliganthisui: "DANÇA DESCALÇA NA MONTANHA. AS PERNAS DELA SÃO O GOLPE.",
  basculinhisui: "SOBE O RIO CONTRA A CORRENTE CARREGANDO AS ALMAS DO CARDUME.",
  basculegion: "AS ALMAS DOS QUE NÃO CHEGARAM VIRARAM O CORPO DELE.",
  zoruahisui: "MORREU DE FRIO E VOLTOU COM RAIVA. A FORMA É A LEMBRANÇA DELE.",
  zoroarkhisui: "A ILUSÃO DELE É FEITA DE RANCOR. QUEM VÊ, VÊ O QUE MERECE.",
  braviaryhisui: "GRITA E O GRITO ABRE BURACO NO AR. ELE VOA POR DENTRO DELE.",
  sliggoohisui: "A CASCA DE METAL VEIO PRA AGUENTAR O QUE AQUELE TEMPO TINHA.",
  goodrahisui: "COURO POR FORA, GOSMA POR DENTRO. NADA ATRAVESSA OS DOIS.",
  avalugghisui: "A CABEÇA É UM ARIETE DE GELO. ELE ABRE CAMINHO BATENDO.",
  decidueyehisui: "TROCOU A FLECHA PELO PRÓPRIO CORPO. LUTA DE PERTO AGORA.",
  ursaluna: "SAIU DA LAMA NUMA NOITE DE LUA CHEIA E VOLTOU MAIOR.",
  ursalunapaldea: "A LUA ESTAVA VERMELHA NAQUELA NOITE. ELE VOLTOU CALADO E MAIS FORTE.",

  taurospaldea: "BRIGA POR ESPORTE. OS CHIFRES SÃO DE QUEM TREINA, NÃO DE QUEM SE DEFENDE.",
  taurosbrasa: "O SOPRO SAI QUENTE. ELE ACENDE O PRÓPRIO RASTRO CORRENDO.",
  taurosonda: "CORRE DENTRO D'ÁGUA COMO CORRE FORA. O JATO DELE DERRUBA PORTA.",
  wooperpaldea: "SAIU DA ÁGUA PORQUE PERDEU A BRIGA. CRIOU UM FILME DE VENENO PRA AGUENTAR O SECO.",
  clodsire: "ELE NÃO CORRE DE NADA. O QUE ENCOSTA NELE É QUEM SE ARREPENDE.",
};

// A frase entra na espécie depois que as duas tabelas existem: `buildSpecies`
// (src/data/species.js) lê `dexText`, e é ele que decide se o bicho tem texto
// próprio ou o genérico de "dados ainda não carregados".
for (const [id, frase] of Object.entries(LORE)) {
  if (REGIONAIS[id]) REGIONAIS[id].dexText = frase;
}

// ------------------------------------------------- ONDE ELAS APARECEM NA FENDA
//
// As formas entram nas tabelas de encontro da 011GLITCHDIMENSION110, por
// terreno, junto com o que já vaza pra lá (DIM_ENCOUNTERS em src/data/extra.js).
//
// A divisão é DERIVADA DO TIPO, e não escrita à mão espécie por espécie: são
// noventa e cinco entradas, e uma tabela escrita na mão desse tamanho é uma
// tabela que sai do ar no dia em que alguém acrescenta a nonagésima sexta e
// esquece de listar. Água na água, quem voa (e quem é psíquico, fantasma ou
// dragão — o que flutua na fenda) no ar, o resto no chão.
//
// O nível e a raridade saem do TOTAL DE STATUS: bicho fraco aparece cedo e
// muito, bicho forte aparece tarde e pouco. É a mesma curva das outras tabelas
// da fenda, só que calculada em vez de digitada.
const noAr = new Set(["VOADOR", "PSÍQUICO", "FANTASMA", "DRAGÃO"]);

function terrenoDe(sp) {
  if (sp.types.includes("ÁGUA")) return "agua";
  return sp.types.some((t) => noAr.has(t)) ? "ar" : "terra";
}

function faixaDe(sp) {
  if (sp.bst >= 530) return { min: 36, max: 48, w: 5 };
  if (sp.bst >= 460) return { min: 28, max: 42, w: 10 };
  if (sp.bst >= 380) return { min: 22, max: 36, w: 14 };
  return { min: 16, max: 30, w: 18 };
}

/** { terra: [...], agua: [...], ar: [...] } — o que src/data/index.js cola nas
 *  tabelas da fenda. */
export const DIM_REGIONAIS = { terra: [], agua: [], ar: [] };
for (const sp of Object.values(REGIONAIS)) {
  DIM_REGIONAIS[terrenoDe(sp)].push({ id: sp.id, ...faixaDe(sp) });
}
