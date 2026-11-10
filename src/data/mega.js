// MEGA EVOLUÇÃO. Cada forma MEGA é uma espécie de verdade (entra no DB.SPECIES
// junto com as 151), mas ela só existe DENTRO da batalha: quem mega evolui
// guarda a espécie de origem em `mon.megaDe` e volta a ser ela no fim da luta
// (ver src/systems/mega.js). Nada disso é gravado no save.
//
// Precisa de duas coisas na mochila: o ANEL MEGA (o professor entrega) e a
// megapedra da espécie (espalhadas por Kanto — ver `gift` em src/data/maps.js).
//
// Tabela:  espécie de origem | NOME DA FORMA | megapedra | sprite | TIPOS | HP ATK DEF SPA SPD SPE
// O número do sprite é o id da PokeAPI da forma (baixe com
// `python3 tools/fetch_sprites.py --mega`); as MEGA de Kanto não existiam na
// geração III, então elas vêm com a arte moderna mesmo.
import { GEN1, slugify } from "./gen1.js";

const TABLE = `
venusaur   | MEGA VENUSAUR    | venusaurita     | 10033 | PLANTA/VENENO    |  80 100 123 122 120  80
charizard  | MEGA CHARIZARD X | charizardita x  | 10034 | FOGO/DRAGÃO      |  78 130 111 130  85 100
charizard  | MEGA CHARIZARD Y | charizardita y  | 10035 | FOGO/VOADOR      |  78 104  78 159 115 100
blastoise  | MEGA BLASTOISE   | blastoisita     | 10036 | ÁGUA             |  79 103 120 135 115  78
beedrill   | MEGA BEEDRILL    | beedrillita     | 10090 | INSETO/VENENO    |  65 150  40  15  80 145
pidgeot    | MEGA PIDGEOT     | pidgeotita      | 10073 | NORMAL/VOADOR    |  83  80  80 135  80 121
alakazam   | MEGA ALAKAZAM    | alakazita       | 10037 | PSÍQUICO         |  55  50  65 175 105 150
slowbro    | MEGA SLOWBRO     | slowbronita     | 10071 | ÁGUA/PSÍQUICO    |  95  75 180 130  80  30
gengar     | MEGA GENGAR      | gengarita       | 10038 | FANTASMA/VENENO  |  60  65  80 170  95 130
kangaskhan | MEGA KANGASKHAN  | kangaskhanita   | 10039 | NORMAL           | 105 125 100  60 100 100
pinsir     | MEGA PINSIR      | pinsirita       | 10040 | INSETO/VOADOR    |  65 155 120  65  90 105
gyarados   | MEGA GYARADOS    | gyaradosita     | 10041 | ÁGUA/SOMBRIO     |  95 155 109  70 130  81
aerodactyl | MEGA AERODACTYL  | aerodactylita   | 10042 | PEDRA/VOADOR     |  80 135  85  70  95 150
mewtwo     | MEGA MEWTWO X    | mewtwonita x    | 10043 | PSÍQUICO/LUTADOR | 106 190 100 154 100 130
mewtwo     | MEGA MEWTWO Y    | mewtwonita y    | 10044 | PSÍQUICO         | 106 150  70 194 120 140
// AS OUTRAS MEGAS (nov/2026, pedido do CAIO: "darkrai usando a gardevoirita"):
// vieram da tabela do POKÉMON MEGA CHAMPIONS (X/Y, ORAS e o Z-A com o DLC).
// As pedras novas se compram na LOJA DE MEGAPEDRAS de LUMIOSE (src/data/kalos.js).
raichu      | MEGA RAICHU X           | raichita x      | 10304 | ELÉTRICO         |  60 135  95  90  95 110
raichu      | MEGA RAICHU Y           | raichita y      | 10305 | ELÉTRICO         |  60 100  55 160  80 130
dragonite   | MEGA DRAGONITE          | dragonitita     | 10281 | DRAGÃO/VOADOR    |  91 124 115 145 125 100
tyranitar   | MEGA TYRANITAR          | tyranitarita    | 10049 | PEDRA/SOMBRIO    | 100 164 150  95 120  71
metagross   | MEGA METAGROSS          | metagrossita    | 10076 | AÇO/PSÍQUICO     |  80 145 150 105 110 110
garchomp    | MEGA GARCHOMP           | garchompita     | 10058 | DRAGÃO/TERRA     | 108 170 115 120  95  92
garchomp    | MEGA GARCHOMP Z         | garchompita z   | 10309 | DRAGÃO           | 108 130  85 141  85 151
lucario     | MEGA LUCARIO            | lucariita       | 10059 | LUTADOR/AÇO      |  70 145  88 140  70 112
lucario     | MEGA LUCARIO Z          | lucariita z     | 10310 | LUTADOR/AÇO      |  70 100  70 164  70 151
greninja    | MEGA GRENINJA           | greninjita      | 10294 | ÁGUA/SOMBRIO     |  72 125  77 133  81 142
gardevoir   | MEGA GARDEVOIR          | gardevoirita    | 10051 | PSÍQUICO/FADA    |  68  85  65 165 135 100
salamence   | MEGA SALAMENCE          | salamencita     | 10089 | DRAGÃO/VOADOR    |  95 145 130 120  90 120
scizor      | MEGA SCIZOR             | scizorita       | 10046 | INSETO/AÇO       |  70 150 140  65 100  75
ampharos    | MEGA AMPHAROS           | ampharosita     | 10045 | ELÉTRICO/DRAGÃO  |  90  95 105 165 110  45
heracross   | MEGA HERACROSS          | heracrossita    | 10047 | INSETO/LUTADOR   |  80 185 115  40 105  75
houndoom    | MEGA HOUNDOOM           | houndoomita     | 10048 | SOMBRIO/FOGO     |  75  90  90 140  90 115
absol       | MEGA ABSOL              | absolita        | 10057 | SOMBRIO          |  65 150  60 115  60 115
absol       | MEGA ABSOL Z            | absolita z      | 10307 | SOMBRIO/FANTASMA |  65 154  60  75  60 151
blaziken    | MEGA BLAZIKEN           | blazikenita     | 10050 | FOGO/LUTADOR     |  80 160  80 130  80 100
sceptile    | MEGA SCEPTILE           | sceptilita      | 10065 | PLANTA/DRAGÃO    |  70 110  75 145  85 145
swampert    | MEGA SWAMPERT           | swampertita     | 10064 | ÁGUA/TERRA       | 100 150 110  95 110  70
mawile      | MEGA MAWILE             | mawilita        | 10052 | AÇO/FADA         |  50 105 125  55  95  50
aggron      | MEGA AGGRON             | aggronita       | 10053 | AÇO              |  70 140 230  60  80  50
medicham    | MEGA MEDICHAM           | medichamita     | 10054 | LUTADOR/PSÍQUICO |  60 100  85  80  85 100
manectric   | MEGA MANECTRIC          | manectricita    | 10055 | ELÉTRICO         |  70  75  80 135  80 135
banette     | MEGA BANETTE            | banettita       | 10056 | FANTASMA         |  64 165  75  93  83  75
abomasnow   | MEGA ABOMASNOW          | abomasnowita    | 10060 | PLANTA/GELO      |  90 132 105 132 105  30
latias      | MEGA LATIAS             | latiasita       | 10062 | DRAGÃO/PSÍQUICO  |  80 100 120 140 150 110
latios      | MEGA LATIOS             | latiosita       | 10063 | DRAGÃO/PSÍQUICO  |  80 130 100 160 120 110
sableye     | MEGA SABLEYE            | sableyita       | 10066 | SOMBRIO/FANTASMA |  50  85 125  85 115  20
altaria     | MEGA ALTARIA            | altariita       | 10067 | DRAGÃO/FADA      |  75 110 110 110 105  80
gallade     | MEGA GALLADE            | galladita       | 10068 | PSÍQUICO/LUTADOR |  68 165  95  65 115 110
audino      | MEGA AUDINO             | audinita        | 10069 | NORMAL/FADA      | 103  60 126  80 126  50
sharpedo    | MEGA SHARPEDO           | sharpedita      | 10070 | ÁGUA/SOMBRIO     |  70 140  70 110  65 105
steelix     | MEGA STEELIX            | steelixita      | 10072 | AÇO/TERRA        |  75 125 230  55  95  30
glalie      | MEGA GLALIE             | glaliita        | 10074 | GELO             |  80 120  80 120  80 100
diancie     | MEGA DIANCIE            | dianciita       | 10075 | PEDRA/FADA       |  50 160 110 160 110 110
rayquaza    | MEGA RAYQUAZA           | rayquazita      | 10079 | DRAGÃO/VOADOR    | 105 180 100 180 100 115
camerupt    | MEGA CAMERUPT           | cameruptita     | 10087 | FOGO/TERRA       |  70 120 100 145 105  20
lopunny     | MEGA LOPUNNY            | lopunnyita      | 10088 | NORMAL/LUTADOR   |  65 136  94  54  96 135
clefable    | MEGA CLEFABLE           | clefablita      | 10278 | FADA/VOADOR      |  95  80  93 135 110  70
victreebel  | MEGA VICTREEBEL         | victreebelita   | 10279 | PLANTA/VENENO    |  80 125  85 135  95  70
starmie     | MEGA STARMIE            | starmiita       | 10280 | ÁGUA/PSÍQUICO    |  60 100 105 130 105 120
meganium    | MEGA MEGANIUM           | meganiumita     | 10282 | PLANTA/FADA      |  80  92 115 143 115  80
feraligatr  | MEGA FERALIGATR         | feraligatrita   | 10283 | ÁGUA/DRAGÃO      |  85 160 125  89  93  78
skarmory    | MEGA SKARMORY           | skarmoryita     | 10284 | AÇO/VOADOR       |  65 140 110  40 100 110
froslass    | MEGA FROSLASS           | froslassita     | 10285 | GELO/FANTASMA    |  70  80  70 140 100 120
emboar      | MEGA EMBOAR             | emboarita       | 10286 | FOGO/LUTADOR     | 110 148  75 110 110  75
excadrill   | MEGA EXCADRILL          | excadrillita    | 10287 | TERRA/AÇO        | 110 165 100  65  65 103
scolipede   | MEGA SCOLIPEDE          | scolipedita     | 10288 | INSETO/VENENO    |  60 140 149  75  99  62
scrafty     | MEGA SCRAFTY            | scraftyita      | 10289 | SOMBRIO/LUTADOR  |  65 130 135  55 135  68
eelektross  | MEGA EELEKTROSS         | eelektrossita   | 10290 | ELÉTRICO         |  85 145  80 135  90  80
chandelure  | MEGA CHANDELURE         | chandelurita    | 10291 | FANTASMA/FOGO    |  60  75 110 175 110  90
chesnaught  | MEGA CHESNAUGHT         | chesnaughtita   | 10292 | PLANTA/LUTADOR   |  88 137 172  74 115  44
delphox     | MEGA DELPHOX            | delphoxita      | 10293 | FOGO/PSÍQUICO    |  75  69  72 159 125 134
pyroar      | MEGA PYROAR             | pyroarita       | 10295 | FOGO/NORMAL      |  86  88  92 129  86 126
malamar     | MEGA MALAMAR            | malamarita      | 10297 | SOMBRIO/PSÍQUICO |  86 102  88  98 120  88
barbaracle  | MEGA BARBARACLE         | barbaraclita    | 10298 | PEDRA/LUTADOR    |  72 140 130  64 106  88
dragalge    | MEGA DRAGALGE           | dragalgita      | 10299 | VENENO/DRAGÃO    |  65  85 105 132 163  44
hawlucha    | MEGA HAWLUCHA           | hawluchita      | 10300 | LUTADOR/VOADOR   |  78 137 100  74  93 118
zygarde     | MEGA ZYGARDE            | zygardita       | 10120 | DRAGÃO/TERRA     | 216  70  91 216  85 100
drampa      | MEGA DRAMPA             | drampita        | 10302 | NORMAL/DRAGÃO    |  78  85 110 160 116  36
falinks     | MEGA FALINKS            | falinksita      | 10303 | LUTADOR          |  65 135 135  70  65 100
chimecho    | MEGA CHIMECHO           | chimechita      | 10306 | PSÍQUICO/AÇO     |  75  50 110 135 120  65
staraptor   | MEGA STARAPTOR          | staraptorita    | 10308 | LUTADOR/VOADOR   |  85 140 100  60  90 110
heatran     | MEGA HEATRAN            | heatranita      | 10311 | FOGO/AÇO         |  91 120 106 175 141  67
darkrai     | MEGA DARKRAI            | darkraita       | 10312 | SOMBRIO          |  70 120 130 165 130  85
golurk      | MEGA GOLURK             | golurkita       | 10313 | TERRA/FANTASMA   |  89 159 105  70 105  55
meowstic    | MEGA MEOWSTIC           | meowsticita     | 10314 | PSÍQUICO         |  74  48  76 143 101 124
crabominable| MEGA CRABOMINABLE       | crabominablita  | 10315 | LUTADOR/GELO     |  97 157 122  62 107  33
golisopod   | MEGA GOLISOPOD          | golisopodita    | 10316 | INSETO/AÇO       |  75 150 175  70 120  40
magearna    | MEGA MAGEARNA           | magearnita      | 10317 | AÇO/FADA         |  80 125 115 170 115  95
zeraora     | MEGA ZERAORA            | zeraorita       | 10319 | ELÉTRICO         |  88 157  75 147  80 153
scovillain  | MEGA SCOVILLAIN         | scovillainita   | 10320 | PLANTA/FOGO      |  65 138  85 138  85  75
glimmora    | MEGA GLIMMORA           | glimmorita      | 10321 | PEDRA/VENENO     |  83  90 105 150  96 101
tatsugiri   | MEGA TATSUGIRI          | tatsugirita     | 10322 | DRAGÃO/ÁGUA      |  68  65  90 135 125  92
baxcalibur  | MEGA BAXCALIBUR         | baxcaliburita   | 10325 | DRAGÃO/GELO      | 115 175 117 105 101  87
missingno  | MEGA M155INGNO.  | missingnita     |     0 | GLITCH           |  33 255   0 255   0 255
`;

/** o item que o professor entrega: sem ele nenhuma pedra reage */
export const ANEL = "anel mega";

/** Uma frase por forma — aparece na Pokédex e quando a pedra é examinada. */
export const MEGA_LORE = {
  megavenusaur: "A FLOR ABRIU DE VEZ. A PLANTA ENRAIZOU NELE E AGUENTA O QUE VIER.",
  megacharizardx: "A CHAMA VIROU AZUL E O CORPO ENDURECEU: O FOGO DELE VIROU DRAGÃO.",
  megacharizardy: "SUBIU ALTO DEMAIS. O CALOR QUE ELE SOLTA LÁ EM CIMA MUDA O TEMPO EMBAIXO.",
  megablastoise: "OS DOIS CANHÕES VIRARAM UM SÓ, E ESSE UM NÃO ERRA.",
  megabeedrill: "GANHOU UM FERRÃO EM CADA PERNA. ELE ATRAVESSA A TELA ANTES DE VOCÊ VER.",
  megapidgeot: "A CRISTA CRESCEU E O VENTO OBEDECE. ELE NEM PRECISA BATER ASA.",
  megaalakazam: "AS COLHERES VIRARAM CINCO. O CÉREBRO DELE JÁ NÃO CABE NUM CORPO SÓ.",
  megaslowbro: "O SHELLDER ENGOLIU ELE INTEIRO. LÁ DENTRO, ELE FINALMENTE ACORDOU.",
  megagengar: "SAIU METADE DO CHÃO. A OUTRA METADE FICOU DO LADO DE LÁ, E OLHA PRA VOCÊ.",
  megakangaskhan: "O FILHOTE SAIU DA BOLSA PRA LUTAR JUNTO. AGORA SÃO DOIS GOLPES POR VEZ.",
  megapinsir: "AS ASAS ESTAVAM DOBRADAS NAS COSTAS ESSE TEMPO TODO.",
  megagyarados: "A RAIVA DELE PAROU DE SER BARULHO E VIROU CÁLCULO.",
  megaaerodactyl: "A PEDRA VOLTOU PRO CORPO DELE. É ASSIM QUE ELE ERA ANTES DO FÓSSIL.",
  megamewtwox: "O EXPERIMENTO FOI REFEITO NA MARRA. DESSA VEZ ELE ESCOLHEU O RESULTADO.",
  megamewtwoy: "SOBROU SÓ O QUE PENSA. O RESTO DO CORPO VIROU DETALHE.",
  megam155ingno: "A PEDRA NÃO ENCAIXOU: ELA SOBRESCREVEU. DEFESA 0. ESPECIAL 0. O RESTO, 255.",
};

/** as formas MEGA como espécies (entram no DB.SPECIES) */
/** A MEGA EMPRESTADA (ideia do CAIO, nov/2026): quem MAIS pode usar cada
 *  pedra, além do dono. Vira a mistura do bicho com a mega da pedra, só
 *  durante a luta (src/systems/mega.js). Cada mistura daqui é DESENHADA à mão:
 *  o desenho mora em assets/fusoes/emprestadas/<id>.png (e _costas.png) e o id
 *  entra em EMPRESTADAS_DESENHADAS quando fica pronto. */
export const MEGAS_EMPRESTADAS = {
  blastoisita: ["charizard"],
  gardevoirita: ["darkrai"],
  darkraita: ["gardevoir"],
  aerodactylita: ["pidgeot"],
  dianciita: ["tatsugiri"],
  tatsugirita: ["diancie"],
  rayquazita: ["gyarados"],
  "raichita x": ["pikachu"],
  "raichita y": ["pikachu"],
  "mewtwonita x": ["lucario"],
  glimmorita: ["starmie"],
};
/** as páginas da Pokédex das misturas (aba FORMAS) */
export const EMPRESTADAS_DEX = {
  "fus-pidgeot-megaaerodactyl": "ENGOLIU UMA PEDRA QUE NÃO ERA DELE. AS PENAS DA CRISTA VIRARAM ROCHA AFIADA E O BICO ABRIU UMA BOCA CHEIA DE DENTES. VOA BAIXO, PESADO, E MORDE O QUE PASSA.",
  "fus-charizard-megablastoise": "O FOGO DO RABO VIROU ÁGUA E NÃO APAGA. DA ASA SAI UM CANHÃO QUE ATIRA VAPOR FERVENDO, E A PELE DAS ASAS ENDURECEU COMO CASCO.",
  "fus-darkrai-megagardevoir": "OS PESADELOS QUE ELE SOLTAVA VIRARAM SONHOS BONITOS. A FUMAÇA DA CABEÇA CRESCEU COMO CABELO E A CAPA RASGADA VIROU UM VESTIDO QUE DANÇA SOZINHO.",
  "fus-gardevoir-megadarkrai": "PROTEGIA O TREINADOR COM A VIDA. AGORA PROTEGE DENTRO DO SONHO: QUEM DORME PERTO DELA SONHA QUE ESTÁ SENDO VIGIADO.",
  "fus-tatsugiri-megadiancie": "VIROU CRISTAL ROSA. NENHUM DONDOZO CONSEGUE ENGOLIR — É DURO DEMAIS. ENTÃO ELE MANDA NELES SÓ COM O OLHAR.",
  "fus-gyarados-megarayquaza": "SUBIU TÃO ALTO DE RAIVA QUE CHEGOU NA CAMADA DE OZÔNIO. FICOU VERDE, E DA CABEÇA SAÍRAM FITAS DOURADAS QUE CORTAM AS NUVENS.",
  "fus-pikachu-megaraichux": "NEM PRECISOU EVOLUIR: A PEDRA FEZ O SERVIÇO. O RABO VIROU UM RAIO DEITADO DO TAMANHO DELE, E ATRÁS DA CABEÇA CRESCERAM ESPINHOS ESCUROS.",
  "fus-pikachu-megaraichuy": "DAS ORELHAS SAEM DOIS RAIOS QUE NÃO APAGAM NUNCA. O RABO VIROU UM FIO FININHO, E NA PONTA DELE MORA UM RAIO DE VERDADE.",
  "fus-lucario-megamewtwox": "A AURA DELE FICOU ROXA COMO A DE UM CLONE. GANHOU UM RABO GROSSO QUE SEGURA O PESO DOS SOCOS, E OS SOCOS AGORA AMASSAM PEDRA.",
  "fus-starmie-megaglimmora": "O NÚCLEO VERMELHO PEGOU A PEDRA E AS PONTAS DA ESTRELA VIRARAM CRISTAL QUE BRILHA NO ESCURO. GIRA TÃO RÁPIDO QUE SOLTA CAQUINHOS VENENOSOS PRA TODO LADO.",
  "fus-diancie-megatatsugiri": "OS CRISTAIS FICARAM DA COR DE OVA. ANDA EM CIMA DE UMA ONDA DE ARCO-ÍRIS E SE FINGE DE PEQUENA PRA NINGUÉM DESCONFIAR.",
};
export const EMPRESTADAS_DESENHADAS = [
  "fus-pidgeot-megaaerodactyl", "fus-charizard-megablastoise", "fus-darkrai-megagardevoir",
  "fus-gardevoir-megadarkrai", "fus-tatsugiri-megadiancie", "fus-diancie-megatatsugiri",
  "fus-gyarados-megarayquaza", "fus-pikachu-megaraichux", "fus-pikachu-megaraichuy", "fus-lucario-megamewtwox",
  "fus-starmie-megaglimmora",
];

export const MEGA_FORMS = {};
/** { espécie: [{ pedra, to }] } — CHARIZARD e MEWTWO têm duas */
export const MEGAS = {};
/** { pedra: id da forma } — pra mochila saber o que cada pedra é */
export const MEGA_PEDRAS = {};
/** frase de quando a pedra é achada no chão (entra no ITEM_LORE) */
export const PEDRA_LORE = {
  missingnita: "ESTA NÃO É LISA COMO AS OUTRAS. O DESENHO DE DENTRO NÃO PARA QUIETO — E NENHUMA DAS FORMAS ESTÁ NA TABELA.",
};

for (const linha of TABLE.trim().split("\n")) {
  if (linha.trim().startsWith("//")) continue;   // comentário no meio da tabela
  const [de, nome, pedra, sprite, tipos, stats] = linha.split("|").map((s) => s.trim());
  const [hp, atk, def, spa, spd, spe] = stats.split(/\s+/).map(Number);
  const base = { hp, atk, def, spa, spd, spe };
  const bst = Object.values(base).reduce((a, b) => a + b, 0);
  const id = slugify(nome);
  MEGA_FORMS[id] = {
    id,
    dex: GEN1[de]?.dex ?? 0,          // a Pokédex continua sendo a da espécie de origem
    spriteDex: +sprite || 0,          // arquivo do sprite (assets/sprites/pokemon/10033.png)
    name: nome,
    types: tipos.split("/"),
    base,
    bst,
    catchRate: GEN1[de]?.catchRate ?? 3,
    xpYield: Math.floor(bst / 4),
    mega: true,
    megaDe: de,
    dexText: MEGA_LORE[id],
    lore: true,
    ...(de === "missingno" ? { placeholder: { shape: "megaglitch" } } : {}),
  };
  (MEGAS[de] ||= []).push({ pedra, to: id, nome });
  MEGA_PEDRAS[pedra] = id;
  PEDRA_LORE[pedra] ||= `DENTRO DA PEDRA GIRA UM RISCO DE LUZ COM A FORMA DE ${GEN1[de]?.name || de.toUpperCase()}.`;
}
