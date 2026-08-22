// FUSÕES QUE JÁ EXISTEM NO JOGO.
//
// A máquina calcula qualquer dupla sozinha, mas algumas combinações são boas
// demais pra sair de uma média: essas estão escritas à mão aqui. Quando você
// funde uma dupla que tem ficha nesta lista, ela aparece como VARIANTE — dá pra
// alternar entre a fusão automática, as daqui e a sua (a da oficina) na hora de
// fundir, com C.
//
// Formato: "cabeça+corpo" -> [ficha, ...]. A ordem é a ordem em que elas
// aparecem no C. Campos: id (único na dupla), nome (até 11 letras), tipos,
// inicial/crescimento (o mesmo modelo da oficina: valor no nível 0 e quanto
// sobe por nível) e lore, que vira o texto da Pokédex.
//
// Nenhuma tem desenho: o sprite continua sendo a montagem automática dos dois.
// Quem quiser desenhar, desenha na oficina — e aí a ficha do jogador ganha
// desta, sempre.
//
// As fichas dos jogadores publicadas pelo jogo ficam em fusoes-feitas.js.

const g = (hp, atk, def, spa, spd, spe) => ({ hp, atk, def, spa, spd, spe });
const i0 = (hp = 10) => ({ hp, atk: 5, def: 5, spa: 5, spd: 5, spe: 5 });

export const FUSOES = {
  "gengar+rayquaza": [{
    id: "gengquaza", nome: "GENGQUAZA", tipos: ["FANTASMA", "DRAGÃO"],
    inicial: i0(12), crescimento: g(2.6, 2.2, 1.8, 3.4, 2.2, 3.2),
    lore: "A SOMBRA SUBIU ATÉ ONDE NÃO TEM AR E VOLTOU ENROLADA EM NUVEM. NÃO PROJETA SOMBRA NO CHÃO.",
  }],
  "rayquaza+gengar": [{
    id: "raygar", nome: "RAYGAR", tipos: ["DRAGÃO", "VENENO"],
    inicial: i0(13), crescimento: g(3, 3.4, 2.2, 2.6, 2, 2.6),
    lore: "A CABEÇA CONTINUA OLHANDO A ATMOSFERA. O CORPO JÁ ESTÁ DO OUTRO LADO.",
  }],
  "pikachu+bulbasaur": [{
    id: "pikasaur", nome: "PIKASAUR", tipos: ["ELÉTRICO", "PLANTA"],
    inicial: i0(11), crescimento: g(1.7, 1.4, 1.3, 1.8, 1.5, 2),
    lore: "A SEMENTE DAS COSTAS GUARDA CARGA EM VEZ DE LUZ. FLORESCE COM TROVOADA.",
  }],
  "bulbasaur+pikachu": [{
    id: "bulbachu", nome: "BULBACHU", tipos: ["PLANTA", "ELÉTRICO"],
    inicial: i0(12), crescimento: g(1.9, 1.3, 1.5, 1.7, 1.6, 1.6),
    lore: "AS BOCHECHAS VIRARAM DUAS FOLHAS QUE ESTALAM. ELE SE ASSUSTA E O JARDIM ACENDE.",
  }],
  "alakazam+gengar": [{
    id: "alakagar", nome: "ALAKAGAR", tipos: ["PSÍQUICO", "VENENO"],
    inicial: i0(9), crescimento: g(1.5, 1.1, 1.2, 3.6, 2.1, 3.4),
    lore: "PENSA DUAS VEZES AO MESMO TEMPO, E UMA DAS DUAS VEM DE BAIXO DO CHÃO.",
  }],
  "charmander+gyarados": [{
    id: "charados", nome: "CHARADOS", tipos: ["FOGO", "ÁGUA"],
    inicial: i0(12), crescimento: g(2.2, 2.8, 1.9, 2.2, 1.9, 2.2),
    lore: "A CHAMINHA DA CAUDA VIROU FAROL EM CIMA DE UM CORPO ENORME. ELA NÃO APAGA NEM DEBAIXO D'ÁGUA.",
  }],
  "charizard+gyarados": [{
    id: "charizados", nome: "CHARIZADOS", tipos: ["FOGO", "ÁGUA"],
    inicial: i0(13), crescimento: g(2.4, 3.1, 2, 2.6, 2, 2.2),
    lore: "O FOGO E A ÁGUA NO MESMO CORPO, SEM SE APAGAR. O VAPOR QUE ELE SOLTA DERRETE PEDRA.",
  }],
  "magikarp+gyarados": [{
    id: "magirados", nome: "MAGIRADOS", tipos: ["ÁGUA", "VOADOR"],
    inicial: i0(12), crescimento: g(2.2, 3.2, 1.8, 1.2, 2, 2.4),
    lore: "CARA DE QUEM NÃO SABE FAZER NADA, CORPO DE QUEM FAZ. NINGUÉM LEVA A SÉRIO DUAS VEZES.",
  }],
  "mewtwo+mew": [{
    id: "mewtwomew", nome: "MEWTWOMEW", tipos: ["PSÍQUICO"],
    inicial: i0(14), crescimento: g(3, 2.9, 2.2, 3.8, 2.6, 3.2),
    lore: "O EXPERIMENTO E O ORIGINAL NO MESMO CORPO. UM DOS DOIS PEDIU DESCULPA.",
  }],
  "mew+mewtwo": [{
    id: "mewtwo2", nome: "MEWTWO ZERO", tipos: ["PSÍQUICO", "SOMBRIO"],
    inicial: i0(13), crescimento: g(2.8, 3.2, 2.2, 3.4, 2.4, 3),
    lore: "DESSA VEZ QUEM MANDA É O ORIGINAL. ELE ESTÁ CALMO, E ISSO ASSUSTA MAIS.",
  }],
  "lapras+articuno": [{
    id: "lapracuno", nome: "LAPRACUNO", tipos: ["ÁGUA", "GELO"],
    inicial: i0(16), crescimento: g(3.4, 1.9, 2.3, 2.6, 2.6, 1.8),
    lore: "ATRAVESSA O MAR CONGELANDO O CAMINHO ATRÁS DE SI. QUEM SOBE NAS COSTAS DELE NÃO VOLTA A PÉ.",
  }],
  "snorlax+jigglypuff": [{
    id: "snorpuff", nome: "SNORPUFF", tipos: ["NORMAL"],
    inicial: i0(20), crescimento: g(5, 2.4, 1.8, 1.4, 2.2, 0.6),
    lore: "DORME CANTANDO. O CANTO DELE NÃO FAZ NINGUÉM DORMIR: FAZ TODO MUNDO SAIR DE PERTO.",
  }],
  "dragonite+charizard": [{
    id: "dragonzard", nome: "DRAGONZARD", tipos: ["DRAGÃO", "VOADOR"],
    inicial: i0(14), crescimento: g(2.8, 3.4, 2.4, 2.6, 2.4, 2.4),
    lore: "DUAS ASAS GRANDES DEMAIS PRA UM CORPO SÓ. ELE VOA DEVAGAR E MESMO ASSIM CHEGA ANTES.",
  }],
  "zapdos+pikachu": [{
    id: "zapachu", nome: "ZAPACHU", tipos: ["ELÉTRICO", "VOADOR"],
    inicial: i0(12), crescimento: g(2.2, 2.4, 1.8, 3, 2, 3),
    lore: "O RAIO SAI PEQUENO E CHEGA GRANDE. AS BOCHECHAS ACENDEM A TEMPESTADE INTEIRA.",
  }],
  "eevee+ditto": [{
    id: "eevitto", nome: "EEVITTO", tipos: ["NORMAL"],
    inicial: i0(12), crescimento: g(2.2, 2, 2, 2, 2, 2),
    lore: "NÃO ESCOLHEU NENHUMA EVOLUÇÃO PORQUE PODE SER TODAS. NUNCA É NENHUMA POR MUITO TEMPO.",
  }],
  "kabutops+aerodactyl": [{
    id: "kabudactyl", nome: "KABUDACTYL", tipos: ["PEDRA", "VOADOR"],
    inicial: i0(12), crescimento: g(2.2, 3.2, 2.4, 1.4, 1.8, 3),
    lore: "DUAS PEDRAS DE ERAS DIFERENTES, REMONTADAS NO MESMO DIA. AS LÂMINAS ABREM QUANDO ELE MERGULHA.",
  }],
  "groudon+kyogre": [{
    id: "groukyo", nome: "GROUKYO", tipos: ["TERRA", "ÁGUA"],
    inicial: i0(18), crescimento: g(3.6, 3.4, 3, 3.4, 3, 1.8),
    lore: "A SECA E O DILÚVIO NO MESMO ANIMAL. ONDE ELE PISA, O TEMPO NÃO SABE O QUE FAZER.",
  }],
  "rayquaza+deoxys": [{
    id: "raydeoxys", nome: "RAYDEOXYS", tipos: ["DRAGÃO", "PSÍQUICO"],
    inicial: i0(13), crescimento: g(2.8, 3, 2, 3.6, 2, 3.6),
    lore: "ELE SUBIU PRA EXPULSAR O QUE CAIU DO CÉU. VOLTARAM OS DOIS, EM UM.",
  }],
  "smeargle+missingno": [{
    id: "smeargno", nome: "SMEARGNO", tipos: ["NORMAL", "GLITCH"],
    inicial: i0(11), crescimento: g(1.8, 1.4, 1.4, 1.4, 1.6, 2.4),
    lore: "ELE PINTOU POR CIMA DO ERRO ATÉ O ERRO VIRAR DESENHO. A TINTA AINDA ESTÁ MOLHADA.",
  }],
  "missingno+porygon": [{
    id: "missigon", nome: "MISSIGON", tipos: ["GLITCH", "NORMAL"],
    inicial: { hp: 10, atk: 5, def: 0, spa: 5, spd: 0, spe: 5 },
    crescimento: g(2.4, 3.6, 0, 3.6, 0, 4.4),
    lore: "ALGUÉM DEU ENDEREÇO AO QUE NÃO TINHA. O ENDEREÇO ERA DE OUTRO.",
  }],
  "gyarados+lapras": [{
    id: "gyapras", nome: "GYAPRAS", tipos: ["ÁGUA", "GELO"],
    inicial: i0(15), crescimento: g(3.2, 3, 2.4, 2, 2.4, 1.8),
    lore: "A RAIVA DELE ESFRIOU E VIROU CORRENTE. O MAR ABRE QUANDO ELE PASSA.",
  }],
  "machamp+hitmonlee": [{
    id: "machonlee", nome: "MACHONLEE", tipos: ["LUTADOR"],
    inicial: i0(13), crescimento: g(2.4, 3.8, 2, 1.2, 1.8, 2.6),
    lore: "QUATRO BRAÇOS E DUAS PERNAS QUE ESTICAM. ELE ALCANÇA VOCÊ DE ONDE ESTIVER.",
  }],
};
