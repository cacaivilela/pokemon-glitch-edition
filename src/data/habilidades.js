// AS HABILIDADES. Toda espécie tem uma — escrita à mão aqui, ou a padrão do
// tipo primário dela. Nada disso vai pro save: a habilidade é da ESPÉCIE, e o
// jogo pergunta `habilidadeDe(mon.species)` na hora. Fusão usa a da CABEÇA;
// mega usa a da espécie de origem.
//
// O CLIMA: chuva e sol existem só dentro da batalha. Vêm de três lugares — o
// mapa (a TEMPESTADE chove sempre), uma habilidade de entrada (GAROA, SECA) e
// os golpes DANÇA DA CHUVA / DIA DE SOL (cinco turnos). Chuva: ÁGUA 1,5x e FOGO
// 0,5x. Sol: FOGO 1,5x e ÁGUA 0,5x. E a CHUVA DE LAVA do LAMPENT vira isso de
// cabeça pra baixo: na chuva, o FOGO dele bate 3x.
//
// O que cada campo faz (tudo opcional; o motor está em src/systems/habilidades.js):
//   entrada: { clima }            ao entrar em campo, muda o clima (5 turnos)
//   entrada: { intimidar: true }  ao entrar, ATAQUE do outro cai 1
//   dano(mv, user, target, clima) multiplicador nos golpes DELE
//   defesa(mv, user, target, clima) multiplicador nos golpes que ELE leva
//   imune: [tipos], cura          não leva dano daqueles tipos (e cura 1/4, se `cura`)
//   velocidade(clima)             multiplicador de velocidade
//   contato: { status, chance }   quem bate nele com golpe físico pode ganhar status
//   turno: fração                 cura essa fração do HP por turno
//   turnoNaChuva: fração          idem, só chovendo
//   semStatus, semCrit, semQueda  imune a status / a crítico / a queda de atributo
//   gosta: clima                  a IA abre com o golpe daquele clima quando tem ele
//   extra(mv, user, target, clima) dano SOMADO no fim da conta (o PAPA-MOSCA pesa o alvo)
//   aoCurar: n                    toda vez que recupera HP na batalha, os 5 atributos sobem n
//   contraAtaque                  guarda o dano que leva (DEFESA +1 a cada pancada) e
//                                 devolve no próximo golpe dele: até 2x, e zera
//   mordidaMata                   golpe de morder (mv.mordida) derruba ele na hora
import { effectiveness } from "./types.js";

const fraco = (mon) => mon.hp <= mon.maxHp / 3;

export const HABILIDADES = {
  // ------------------------------------------------ as de tipo (padrão)
  superacao:   { nome: "SUPERAÇÃO", texto: "COM POUCO HP, OS GOLPES DE PLANTA BATEM 1,5X.",
                 dano: (mv, u) => (mv.type === "PLANTA" && fraco(u) ? 1.5 : 1) },
  chama:       { nome: "CHAMA", texto: "COM POUCO HP, OS GOLPES DE FOGO BATEM 1,5X.",
                 dano: (mv, u) => (mv.type === "FOGO" && fraco(u) ? 1.5 : 1) },
  torrente:    { nome: "TORRENTE", texto: "COM POUCO HP, OS GOLPES DE ÁGUA BATEM 1,5X.",
                 dano: (mv, u) => (mv.type === "ÁGUA" && fraco(u) ? 1.5 : 1) },
  enxame:      { nome: "ENXAME", texto: "COM POUCO HP, OS GOLPES DE INSETO BATEM 1,5X.",
                 dano: (mv, u) => (mv.type === "INSETO" && fraco(u) ? 1.5 : 1) },
  estatica:    { nome: "ESTÁTICA", texto: "QUEM ENCOSTA NELE PODE FICAR PARALISADO.",
                 contato: { status: "paralisia", chance: 0.3 } },
  pontovenenoso: { nome: "PONTO VENENOSO", texto: "QUEM ENCOSTA NELE PODE SER ENVENENADO.",
                 contato: { status: "envenenado", chance: 0.3 } },
  corpoemchamas: { nome: "CORPO EM BRASA", texto: "QUEM ENCOSTA NELE PODE SE QUEIMAR.",
                 contato: { status: "queimadura", chance: 0.3 } },
  courogrosso: { nome: "COURO GROSSO", texto: "LEVA METADE DO DANO DE FOGO E DE GELO.",
                 defesa: (mv) => (mv.type === "FOGO" || mv.type === "GELO" ? 0.5 : 1) },
  levitar:     { nome: "LEVITAR", texto: "GOLPES DE TERRA NÃO ENCOSTAM NELE.", imune: ["TERRA"] },
  regeneracao: { nome: "REGENERAÇÃO", texto: "RECUPERA 1/16 DO HP A CADA TURNO.", turno: 1 / 16 },
  mentelimpa:  { nome: "MENTE LIMPA", texto: "O INIMIGO NÃO DERRUBA OS ATRIBUTOS DELE.", semQueda: true },
  corpogelado: { nome: "CORPO GELADO", texto: "NA CHUVA, RECUPERA 1/8 DO HP POR TURNO.", turnoNaChuva: 1 / 8 },
  punhodeferro: { nome: "PUNHO DE FERRO", texto: "GOLPES FÍSICOS BATEM 1,2X.",
                 dano: (mv) => (mv.category === "fisico" ? 1.2 : 1) },
  intimidar:   { nome: "INTIMIDAR", texto: "AO ENTRAR, O ATAQUE DO INIMIGO CAI.", entrada: { intimidar: true } },
  correntedear: { nome: "CORRENTE DE AR", texto: "COM CHUVA OU SOL, OS GOLPES DE VOADOR BATEM 1,5X.",
                 dano: (mv, u, t, clima) => (mv.type === "VOADOR" && clima ? 1.5 : 1) },
  semescrupulos: { nome: "SEM ESCRÚPULOS", texto: "BATE 1,3X EM QUEM JÁ TEM STATUS.",
                 dano: (mv, u, t) => (t.status ? 1.3 : 1) },
  semregistro: { nome: "SEM REGISTRO", texto: "NÃO EXISTE O BASTANTE PRA TER STATUS OU LEVAR CRÍTICO.",
                 semStatus: true, semCrit: true },

  // ------------------------------------------------ as escritas à mão
  // O BRIGADEIRINHO é doce: quem cuida dele deixa ele fortíssimo — e quem morde,
  // come. "Drasticamente" é +3, como nos jogos.
  // O SACI apronta com quem é de FADA: o golpe dele não respeita a resistência
  // do alvo (SOMBRIO em FADA, que era 0,5x, sai 1,5x) e ainda bate 1,5x a mais;
  // e golpe de FADA nele pega só metade. É o nó na crina, feito em Pokémon.
  travessura:  { nome: "TRAVESSURA",
                 texto: "APRONTA COM QUEM É DE FADA: BATE 1,5X NELES, SEM RESISTÊNCIA, E LEVA METADE DOS GOLPES DE FADA.",
                 dano: (mv, u, t) => (t.types.includes("FADA") ? 1.5 / Math.min(1, effectiveness(mv.type, t.types) || 1) : 1),
                 defesa: (mv) => (mv.type === "FADA" ? 0.5 : 1) },
  // O GINGÃO não foge da pancada: ele GUARDA. Cada golpe que leva sobe a defesa
  // dele e fica acumulado; no próximo golpe dele, volta tudo de uma vez.
  contraataque: { nome: "CONTRA-ATAQUE",
                 texto: "GUARDA O DANO QUE LEVA E DEVOLVE NO PRÓXIMO GOLPE. CADA PANCADA SOBE A DEFESA.",
                 contraAtaque: true },
  docedepokemon: { nome: "DOCE DE POKÉMON",
                 texto: "CURADO, TODOS OS ATRIBUTOS SOBEM DRASTICAMENTE. MAS UMA MORDIDA DERRUBA ELE NA HORA.",
                 aoCurar: 3, mordidaMata: true },
  chuvadelava: { nome: "CHUVA DE LAVA", texto: "NA CHUVA, OS GOLPES DE FOGO DELE BATEM 3X.", gosta: "chuva",
                 dano: (mv, u, t, clima) => (mv.type === "FOGO" && clima === "chuva" ? 3 : 1),
                 anuncia: (mv, clima) => (mv.type === "FOGO" && clima === "chuva" ? "A CHUVA VIRA LAVA!" : null) },
  garoa:       { nome: "GAROA", texto: "AO ENTRAR, COMEÇA A CHOVER.", entrada: { clima: "chuva" } },
  seca:        { nome: "SECA", texto: "AO ENTRAR, O SOL ABRE.", entrada: { clima: "sol" } },
  nadorapido:  { nome: "NADO RÁPIDO", texto: "NA CHUVA, A VELOCIDADE DOBRA.", gosta: "chuva", velocidade: (clima) => (clima === "chuva" ? 2 : 1) },
  clorofila:   { nome: "CLOROFILA", texto: "NO SOL, A VELOCIDADE DOBRA.", gosta: "sol", velocidade: (clima) => (clima === "sol" ? 2 : 1) },
  pararaios:   { nome: "PARA-RAIOS", texto: "ABSORVE GOLPES ELÉTRICOS E RECUPERA HP.", imune: ["ELÉTRICO"], cura: 0.25 },
  esponja:     { nome: "ESPONJA", texto: "ABSORVE GOLPES DE ÁGUA E RECUPERA HP.", imune: ["ÁGUA"], cura: 0.25 },
  chamaviva:   { nome: "CHAMA VIVA", texto: "ABSORVE GOLPES DE FOGO E RECUPERA HP.", imune: ["FOGO"], cura: 0.25 },
  ima:         { nome: "IMÃ", texto: "ABSORVE GOLPES DE AÇO E RECUPERA HP.", imune: ["AÇO"], cura: 0.25 },
  couraca:     { nome: "COURAÇA", texto: "NÃO LEVA ACERTO CRÍTICO.", semCrit: true },
  // O PAPA-MOSCA DO VICTREEBEL: quanto mais pesado o inseto, mais dá pra
  // comer. +5 de dano a cada meio quilo do alvo — um CATERPIE (2,9 kg) rende
  // +25; um PINSIR (55 kg) rende +550, que é o fim dele. O peso vem de
  // src/data/pesos.js e é lido por `pesoDe`, no motor.
  papamosca:   { nome: "PAPA-MOSCA", texto: "GOLPES EM INSETO DÃO +5 DE DANO A CADA MEIO QUILO DO ALVO.",
                 extra: (mv, u, t, clima, peso) => (t.types.includes("INSETO") ? Math.floor(peso / 0.5) * 5 : 0),
                 anuncia: (mv, clima, t) => (t?.types.includes("INSETO") ? "PAPA-MOSCA: ELE MEDE O INSETO... E ABRE A BOCA." : null) },
  // O "FICA!" da linha do DIGGLE (src/data/braglitch.js): o comando que todo
  // beagle conhece, gritado pro selvagem que está querendo sair da bola. Se a
  // captura falhou, ele late e o bicho fica lá dentro. O bônus é 25% do nível
  // de quem está em campo, SOMADO à chance da bola: nível 40 = +10%, então uma
  // bola de 30% vira 40%.
  fica:        { nome: "FICA!", texto: "SOMA 25% DO NÍVEL NA CHANCE DE CAPTURA: O SELVAGEM FICA NA BOLA.",
                 fica: 0.25 },
  mareaalta:   { nome: "MARÉ ALTA", texto: "NA CHUVA, OS GOLPES DE ÁGUA DELE BATEM 2X (EM VEZ DE 1,5X).", gosta: "chuva",
                 dano: (mv, u, t, clima) => (mv.type === "ÁGUA" && clima === "chuva" ? 2 / 1.5 : 1) },
};

/** a padrão de cada tipo, pra quem não está na tabela de baixo */
export const HABILIDADE_POR_TIPO = {
  PLANTA: "superacao", FOGO: "chama", "ÁGUA": "torrente", INSETO: "enxame",
  "ELÉTRICO": "estatica", VENENO: "pontovenenoso", PEDRA: "courogrosso", TERRA: "courogrosso",
  "AÇO": "courogrosso", FANTASMA: "levitar", NORMAL: "regeneracao", "PSÍQUICO": "mentelimpa",
  GELO: "corpogelado", LUTADOR: "punhodeferro", "DRAGÃO": "intimidar", VOADOR: "correntedear",
  SOMBRIO: "semescrupulos", FADA: "regeneracao", GLITCH: "semregistro",
};

/** quem tem habilidade própria */
export const HABILIDADE_DE = {
  diggle: "fica", braseagle: "fica", magmastim: "fica",
  brigadeirinho: "docedepokemon",
  gingao: "contraataque",
  saci: "travessura",
  meltan: "ima", melmetal: "ima",
  litwick: "chuvadelava", lampent: "chuvadelava", chandelure: "chuvadelava",
  kyogre: "garoa", poliwrath: "garoa", politoed: "garoa", tentacruel: "garoa",
  groudon: "seca", ninetales: "seca", ninetalesalola: "corpogelado", charizard: "seca", torkoal: "seca",
  kingler: "nadorapido", golduck: "nadorapido", seaking: "nadorapido", kabutops: "nadorapido",
  omastar: "nadorapido", seadra: "nadorapido", magikarp: "nadorapido", gyarados: "intimidar",
  venusaur: "clorofila", ivysaur: "clorofila", bulbasaur: "superacao", exeggutor: "clorofila",
  victreebel: "papamosca", tangela: "clorofila", vileplume: "clorofila", bellsprout: "clorofila",
  jolteon: "pararaios", electrode: "pararaios", magneton: "pararaios", zapdos: "pararaios",
  vaporeon: "esponja", lapras: "esponja", poliwag: "esponja", poliwhirl: "esponja",
  flareon: "chamaviva", arcanine: "chamaviva", growlithe: "chamaviva", vulpix: "chamaviva",
  rapidash: "corpoemchamas", ponyta: "corpoemchamas", magmar: "corpoemchamas", moltres: "corpoemchamas",
  pikachu: "estatica", raichu: "estatica", electabuzz: "estatica",
  shellder: "couraca", cloyster: "couraca", kabuto: "couraca", omanyte: "couraca",
  gengar: "levitar", haunter: "levitar", gastly: "levitar", koffing: "levitar", weezing: "levitar",
  snorlax: "courogrosso", dewgong: "courogrosso", seel: "courogrosso", slowbro: "regeneracao", slowpoke: "regeneracao",
  tauros: "intimidar", arbok: "intimidar", persian: "intimidar", mightyena: "intimidar", salamence: "intimidar",
  blastoise: "mareaalta", wartortle: "torrente", squirtle: "torrente", kingdra: "mareaalta",
  articuno: "corpogelado", mewtwo: "mentelimpa", mew: "regeneracao",
  missingno: "semregistro", decamark: "semregistro",
  dragonite: "intimidar", aerodactyl: "intimidar", machamp: "punhodeferro", hitmonchan: "punhodeferro",
};

/** OS DOIS GOLPES DE CLIMA: dano zero, o clima muda. Entram em src/data/moves.js. */
export const GOLPES_DE_CLIMA = {
  dancadachuva: { name: "DANÇA DA CHUVA", type: "ÁGUA", power: 0, acc: 100, pp: 5, category: "status", clima: "chuva" },
  diadesol:     { name: "DIA DE SOL",     type: "FOGO", power: 0, acc: 100, pp: 5, category: "status", clima: "sol" },
};

export const CLIMA_TEXTO = {
  // o FICA! prendendo o selvagem na bola (src/scenes/battle.js)
  fica: "{MON} LATIU: FICA! E {FOE} FICOU NA BOLA.",
  chuva: { comeca: "COMEÇOU A CHOVER!", continua: "CONTINUA CHOVENDO.", para: "A CHUVA PAROU." },
  sol:   { comeca: "O SOL ABRIU FORTE!", continua: "O SOL ESTÁ FORTE.", para: "O SOL SE ESCONDEU." },
  turnos: 5,
  imune: "{HAB} DE {MON}: NÃO AFETA!",
  absorve: "{HAB} DE {MON}: ELE ABSORVEU O GOLPE!",
  contato: "{HAB} DE {MON}: {ALVO} FICOU {STATUS}!",
  intimidar: "{HAB} DE {MON}: O ATAQUE DE {ALVO} CAIU!",
  cura: "{HAB} DE {MON}: RECUPEROU HP.",
  statusNomes: { paralisia: "PARALISADO", envenenado: "ENVENENADO", queimadura: "QUEIMADO" },
};
