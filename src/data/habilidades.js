// AS HABILIDADES. Toda espécie tem de 1 a 3 que PODE ter (nov/2026, pedido do
// CAIO): a escrita à mão aqui e a padrão de cada tipo dela, ou uma lista
// escrita inteira (`HABILIDADE_DE`). Cada Pokémon tem UMA, sorteada pelo seed
// dele — então nada disso vai pro save, e evoluir não troca (o jogo pergunta
// `habilidadeDoMon(mon)`, src/systems/habilidades.js). Fusão usa a lista da
// CABEÇA; mega usa a da espécie de origem.
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
//   bateria: tipo                 igual, mas sem subir a defesa, e só solta num golpe
//                                 DAQUELE tipo (a BATERIA VIVA do VOLTURG)
//   mordidaMata                   golpe de morder (mv.mordida) derruba ele na hora
//   dreno: [min, max]             todo golpe dele que acerta drena de min a max de HP
//                                 (sorteado) pra ele — o TEMPORAL bloqueia
//   entrada: { temporal: true }   O TEMPORAL: enquanto ele está em campo, cai uma
//                                 chuva que tira 1/16 do HP dos OUTROS por turno, e
//                                 ninguém recupera HP por golpe nem por habilidade
//   aoDerrubar: "atk" | "maior"   derrubou o outro com um golpe: aquele atributo
//                                 sobe 1 ("maior" = o mais alto dele)
//   quebraMolde                   os golpes dele passam por cima da habilidade do alvo
//                                 (imunidade, defesa, crítico, status, queda)
//   robustez                      com o HP cheio, o golpe que derrubaria deixa 1
//   adaptabilidade                golpe do próprio tipo bate 2x em vez de 1,5x
//   fimDoTurno: { atributo: n }   no fim de cada turno, o atributo sobe n
//   semGuarda                     todo golpe acerta — o dele e o que vem nele
//   mira: n                       a precisão dos golpes dele vezes n
//   peleAspera: fração            quem encosta (golpe físico) perde essa fração do HP
//
// O AVISO NA TELA: toda vez que uma habilidade faz alguma coisa, entra uma
// faixa do lado do Pokémon dizendo "<NOME> / HABILIDADE <NOME DA HABILIDADE>"
// (src/scenes/battle.js, `mostrarHabilidade`), como nos jogos novos.
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
  // O VOLTURG guarda o dano que leva como carga no casco e solta tudo no
  // próximo golpe ELÉTRICO (habilidade inventada pelo CAIO).
  bateriaviva: { nome: "BATERIA VIVA",
                 texto: "GUARDA O DANO QUE LEVA E SOLTA TUDO NO PRÓXIMO GOLPE ELÉTRICO.",
                 bateria: "ELÉTRICO" },
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
  // a linha do TILAPISH (src/data/braglitch.js): os peixes que chamam o temporal. A chuva
  // dura enquanto ele estiver em campo — saiu ou desmaiou, passou
  // a linha do TRONKY: a raiz do pau-brasil puxa a seiva de quem ele acerta
  dreno:       { nome: "DRENO", texto: "TODO GOLPE DELE QUE ACERTA DRENA DE 10 A 20 DE HP PRA ELE.",
                 dreno: [10, 20] },
  temporal:    { nome: "TEMPORAL", texto: "ENQUANTO ELE ESTÁ EM CAMPO, CAI UMA CHUVA QUE DÁ DANO NOS OUTROS. NINGUÉM RECUPERA HP POR GOLPE OU HABILIDADE.",
                 entrada: { temporal: true } },
  // ------------------------------------------------ as dos jogos novos (nov/2026)
  autoconfianca: { nome: "AUTOCONFIANÇA", texto: "DERRUBOU UM ADVERSÁRIO, O ATAQUE DELE SOBE.", aoDerrubar: "atk" },
  quebramolde: { nome: "QUEBRA-MOLDE", texto: "OS GOLPES DELE PASSAM POR CIMA DA HABILIDADE DO ALVO.",
                 quebraMolde: true, entrada: { anuncio: "{MON} QUEBRA O MOLDE!" } },
  robustez:    { nome: "ROBUSTEZ", texto: "COM O HP CHEIO, AGUENTA QUALQUER GOLPE E FICA COM 1.", robustez: true },
  multiescamas: { nome: "MULTIESCAMAS", texto: "COM O HP CHEIO, LEVA METADE DO DANO.",
                 defesa: (mv, u, t) => (t.hp >= t.maxHp ? 0.5 : 1) },
  adaptabilidade: { nome: "ADAPTABILIDADE", texto: "GOLPES DO PRÓPRIO TIPO BATEM 2X EM VEZ DE 1,5X.", adaptabilidade: true },
  tecnico:     { nome: "TÉCNICO", texto: "GOLPES DE PODER 60 OU MENOS BATEM 1,5X.",
                 dano: (mv) => (mv.power > 0 && mv.power <= 60 ? 1.5 : 1) },
  forcaenorme: { nome: "FORÇA ENORME", texto: "GOLPES FÍSICOS BATEM 2X.",
                 dano: (mv) => (mv.category === "fisico" ? 2 : 1) },
  garra:       { nome: "GARRA", texto: "COM STATUS, OS GOLPES FÍSICOS BATEM 1,5X.",
                 dano: (mv, u) => (mv.category === "fisico" && u.status ? 1.5 : 1) },
  acelerar:    { nome: "ACELERAR", texto: "NO FIM DE CADA TURNO, A VELOCIDADE SOBE.", fimDoTurno: { spe: 1 } },
  ferasuprema: { nome: "FERA SUPREMA", texto: "DERRUBOU UM ADVERSÁRIO, O MELHOR ATRIBUTO DELE SOBE.", aoDerrubar: "maior" },
  semguarda:   { nome: "SEM GUARDA", texto: "TODO GOLPE ACERTA: O DELE E O QUE VEM NELE.", semGuarda: true },
  olhoscompostos: { nome: "OLHOS COMPOSTOS", texto: "OS GOLPES DELE ERRAM MENOS (PRECISÃO 1,3X).", mira: 1.3 },
  peleaspera:  { nome: "PELE ÁSPERA", texto: "QUEM ENCOSTA NELE PERDE 1/8 DO HP.", peleAspera: 1 / 8 },
  garrasduras: { nome: "GARRAS DURAS", texto: "GOLPES FÍSICOS BATEM 1,3X.",
                 dano: (mv) => (mv.category === "fisico" ? 1.3 : 1) },
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

/** AS DE ASSINATURA: inventadas pra um bicho só (ou uma linha) — quem tem uma
 *  dessas não ganha as do tipo junto (src/systems/habilidades.js, `habilidadesDe`) */
export const HABILIDADE_ASSINATURA = ["fica", "dreno", "temporal", "docedepokemon", "bateriaviva", "contraataque",
  "travessura", "chuvadelava", "papamosca", "mareaalta"];

/** quem tem habilidade própria. Texto = essa, mais as do tipo; LISTA = exatamente
 *  essas (de 1 a 3) — cada Pokémon pega uma (`habilidadeDoMon`) */
export const HABILIDADE_DE = {
  // o QUAQUAVAL (pedido do CAIO): TORRENTE ou AUTOCONFIANÇA, como nos jogos
  quaxly: ["torrente", "autoconfianca"], quaxwell: ["torrente", "autoconfianca"], quaquaval: ["torrente", "autoconfianca"],
  diggle: "fica", braseagle: "fica", magmastim: "fica",
  tronky: "dreno", troncudo: "dreno", paubrasilisco: "dreno",
  tilapish: "temporal", tilapisco: "temporal", tilapiracu: "temporal",
  brigadeirinho: "docedepokemon",
  volturg: "bateriaviva", voltabum: "bateriaviva",
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
  aerodactyl: "intimidar", hitmonchan: "punhodeferro",
  // as dos jogos novos (nov/2026), nos bichos que têm elas nos jogos — e uns de Braglitch
  pinsir: "autoconfianca", krookodile: "autoconfianca", krokorok: "autoconfianca", sandile: "autoconfianca",
  scrafty: "autoconfianca", scraggy: "autoconfianca", honchkrow: "autoconfianca", lobisomem: "autoconfianca",
  excadrill: "quebramolde", drilbur: "quebramolde", haxorus: "quebramolde", fraxure: "quebramolde", axew: "quebramolde",
  rampardos: "quebramolde", cranidos: "quebramolde", britadeiro: "quebramolde",
  geodude: "robustez", graveler: "robustez", golem: "robustez", onix: "robustez", steelix: "robustez",
  magnemite: "robustez", sudowoodo: "robustez", aron: "robustez", lairon: "robustez", aggron: "robustez",
  nosepass: "robustez", probopass: "robustez", concretao: "robustez",
  dragonite: "multiescamas", lugia: "multiescamas",
  eevee: "adaptabilidade", porygonz: "adaptabilidade", crawdaunt: "adaptabilidade", corphish: "adaptabilidade",
  scizor: "tecnico", scyther: "tecnico", meowth: "tecnico", aipom: "tecnico", ambipom: "tecnico",
  breloom: "tecnico", hitmontop: "tecnico", smeargle: "tecnico",
  marill: "forcaenorme", azumarill: "forcaenorme", azurill: "forcaenorme", mawile: "forcaenorme", diggersby: "forcaenorme",
  heracross: "garra", ursaring: "garra", teddiursa: "garra", conkeldurr: "garra", gurdurr: "garra", timburr: "garra",
  raticate: "garra", swellow: "garra", taillow: "garra",
  blaziken: "acelerar", combusken: "acelerar", torchic: "acelerar", ninjask: "acelerar", yanma: "acelerar", yanmega: "acelerar",
  nihilego: "ferasuprema", buzzwole: "ferasuprema", pheromosa: "ferasuprema", xurkitree: "ferasuprema",
  celesteela: "ferasuprema", kartana: "ferasuprema", guzzlord: "ferasuprema", naganadel: "ferasuprema",
  stakataka: "ferasuprema", blacephalon: "ferasuprema", poipole: "ferasuprema",
  machop: "semguarda", machoke: "semguarda", machamp: "semguarda", golett: "semguarda", golurk: "semguarda",
  honedge: "semguarda", doublade: "semguarda",
  butterfree: "olhoscompostos", venonat: "olhoscompostos", joltik: "olhoscompostos", galvantula: "olhoscompostos",
  nincada: "olhoscompostos", scatterbug: "olhoscompostos",
  carvanha: "peleaspera", sharpedo: "peleaspera", gible: "peleaspera", gabite: "peleaspera", garchomp: "peleaspera",
  druddigon: "peleaspera", piranhita: "peleaspera", piranhorda: "peleaspera",
  metagross: "garrasduras", binacle: "garrasduras", barbaracle: "garrasduras", tyrantrum: "garrasduras",
  caranguejinho: "garrasduras", manguebit: "garrasduras",
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
  temporal: {
    comeca: "TEMPORAL DE {MON}! O CÉU FECHOU E DESABOU UMA CHUVA PESADA!",
    dano: "{MON} APANHOU DA CHUVA DO TEMPORAL!",
    semCura: "O TEMPORAL NÃO DEIXA {MON} SE RECUPERAR!",
    dreno: "{HAB} DE {MON}: DRENOU {N} DE HP!",
    para: "{MON} SAIU DE CAMPO, E O TEMPORAL PASSOU.",
  },
  statusNomes: { paralisia: "PARALISADO", envenenado: "ENVENENADO", queimadura: "QUEIMADO" },
};
