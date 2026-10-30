// AS ULTRA BEASTS DE CARNAVAL: as fantasias do CARNAVAL DAS ULTRA BEASTS
// (src/data/eventos.js, `carnaval_ultra`). Não são formas únicas: são formas
// do jogo, como a FORMA PURA dos fósseis — cada uma é a ultra beast de sempre
// (mesmos atributos, tipos, golpes e grito), com o desenho da fantasia.
//
// O desenho mora em assets/sprites/pokemon/carnaval/<bicho>.png. Sai do 1º
// quadro da animação do bicho, editado pixel por pixel
// (tools/carnaval_desenhos/); o XURKITREE foi o CAIO quem desenhou, de
// MARIO (no editor de pixel do jogo, 30/10/2026). Enquanto um desenho não está
// pronto (fora de PRONTAS), a forma usa o sprite de sempre.

/** [bicho, dex] — a ordem do desfile */
export const CARNAVAL = [
  ["pheromosa", 795], ["blacephalon", 806], ["xurkitree", 796], ["buzzwole", 794],
  ["nihilego", 793], ["poipole", 803], ["naganadel", 804], ["guzzlord", 799],
];

/** as que já têm o desenho da fantasia */
export const PRONTAS = new Set(["pheromosa", "blacephalon", "xurkitree", "buzzwole", "nihilego", "poipole", "naganadel", "guzzlord"]);

export const FANTASIA = {
  pheromosa: "VEIO DO ULTRA BURACO DIRETO PRO DESFILE. É DESTAQUE DE CARRO ALEGÓRICO: AS PLUMAS PESAM MAIS QUE ELA, E ELA NEM SUA.",
  blacephalon: "PALHAÇO DE BLOCO. A CABEÇA EXPLODE EM CONFETE EM VEZ DE FOGO, E O PÚBLICO PEDE MAIS.",
  xurkitree: "VEIO DE ENCANADOR: BONÉ VERMELHO E MACACÃO AZUL. PULA MAIS ALTO QUE O CARRO ALEGÓRICO, E QUANDO ELE SAMBA A LUZ DO BAIRRO PISCA.",
  buzzwole: "PUXA O BLOCO NA FORÇA DO BRAÇO. A FANTASIA RASGOU TRÊS VEZES NO ENSAIO.",
  nihilego: "VIROU PORTA-BANDEIRA. GIRA TÃO BONITO QUE NINGUÉM REPARA QUE ELA NÃO TEM PÉ.",
  poipole: "O MAIS NOVO DA ALA DAS CRIANÇAS. JOGA CONFETE EM TODO MUNDO E DEPOIS PEDE DESCULPA.",
  naganadel: "MESTRE DA BATERIA. O FERRÃO VIRA BAQUETA, E O SURDO DELE SE OUVE DO OUTRO LADO DO ULTRA BURACO.",
  guzzlord: "COMEU O CARRO ALEGÓRICO INTEIRO NO ENSAIO. AGORA DESFILA DENTRO DA FANTASIA DELE, QUE É UM CARRO ALEGÓRICO.",
};

/** As espécies, montadas das ultra beasts de sempre (`base`: as espécies do
 *  jogo antes do buildSpecies). Fica de fora a que o jogo não tiver. */
export function especiesCarnaval(base) {
  const out = {};
  for (const [bicho, dex] of CARNAVAL) {
    const sp = base[bicho];
    if (!sp) continue;
    const id = `${bicho}carnaval`;
    out[id] = {
      ...sp, id, name: `${sp.name}-CARNAVAL`,
      forma: "CARNAVAL", formaDe: bicho, learnsetDe: bicho,
      dexText: FANTASIA[bicho] || sp.dexText,
      ...(PRONTAS.has(bicho) ? { spriteUrl: `assets/sprites/pokemon/carnaval/${bicho}.png` } : { spriteDex: dex }),
    };
    delete out[id].learnset;
  }
  return out;
}

/** a fantasia evolui junto: o POIPOLE de Carnaval vira o NAGANADEL de Carnaval */
export const EVO_CARNAVAL = {
  poipolecarnaval: [{ lvl: 32, to: "naganadelcarnaval" }],
};
