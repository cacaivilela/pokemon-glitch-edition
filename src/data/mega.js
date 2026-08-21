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
