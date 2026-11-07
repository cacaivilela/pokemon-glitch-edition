// A LIGA POKÉMON DE KANTO (pedido do CAIO, nov/2026: "faz ter liga em kanto").
//
// Os mapas são os do FireRed (tools/fetch_maps.py, lista LIGA): a ROTA 23 sobe
// pro PLANALTO ÍNDIGO, o Centro Pokémon de lá tem a porta da ELITE 4 (só com as
// 8 insígnias), e as salas vão em fila: LORELEI → BRUNO → AGATHA → LANCE → o
// CAMPEÃO → o HALL DA FAMA. A porta pra frente só abre depois de vencer quem
// está na sala, e a de trás fecha (não tem volta no meio da Liga). Entrar de
// novo pela porta do Centro recomeça a Liga do zero (como no FireRed).
//
// O CAMPEÃO é o AZUL. Antes da luta ele JUNTA O TIME EM TRÊS FUSÕES e chama a
// fusão tripla ARTIDOLTRES (ARTICUNO + ZAPDOS + MOLTRES), que o CAIO desenhou
// no FUSIONGLITCH. Vencer ele = CAMPEÃO DE KANTO (`flags.kantoCampeao`), e a
// MASTER BALL passa a ser vendida nas lojas (src/data/bolas.js).
//
// Os times da Elite 4 são os do FireRed (a primeira vez).


const porTras = "A PORTA SE FECHOU ATRÁS DE VOCÊ. NA LIGA NÃO TEM VOLTA.";
const elite = (id, x, y, nome, falas, depois, party, premio) => ({
  id, x, y, dir: "down", sprite: id, lines: falas, afterLines: depois,
  trainer: { name: nome, prize: premio, lider: true, sight: 0, party },
});

/** OS CINCO DA SALA, na ordem. `pokebola`: a cor do centro do chão de cada um
 *  (a sala de cada um é o chão do FireRed: LORELEI, BRUNO, AGATHA; o LANCE e o
 *  CAMPEÃO têm o chão pintado a partir delas, `chao`). */
export const LIGA_ETAPAS = [
  { chao: { de: "pokemon_league_loreleis_room" },
    npc: elite("lorelei", 6, 5, "ELITE 4 LORELEI",
      ["BEM-VINDO À LIGA POKÉMON. EU SOU LORELEI, DA ELITE 4.", "NINGUÉM AGUENTA O MEU GELO. VOCÊ VAI CONGELAR AQUI MESMO!"],
      ["...VOCÊ É BOM. FIQUE NA POKÉBOLA DO CENTRO. A SALA VAI MUDAR."],
      [{ id: "dewgong", lvl: 52 }, { id: "cloyster", lvl: 51 }, { id: "slowbro", lvl: 52 }, { id: "jynx", lvl: 54 }, { id: "lapras", lvl: 54 }, { id: "fus-froslass-gyarados", lvl: 56 }], 5400) },
  { chao: { de: "pokemon_league_brunos_room" },
    npc: elite("bruno", 6, 5, "ELITE 4 BRUNO",
      ["EU SOU BRUNO, DA ELITE 4!", "ESSA SALA SUBIU DO CHÃO SÓ PRA MIM. TREINO MEUS POKÉMON NA FORÇA BRUTA. HUU-HAH!"],
      ["PERDI... TÁ. SEGURA FIRME, QUE O CHÃO VAI CAIR DE NOVO."],
      [{ id: "onix", lvl: 51 }, { id: "hitmonchan", lvl: 53 }, { id: "hitmonlee", lvl: 53 }, { id: "onix", lvl: 54 }, { id: "machamp", lvl: 56 }, { id: "fus-machamp-onix", lvl: 57 }], 5600) },
  { chao: { de: "pokemon_league_agathas_room" },
    npc: elite("agatha", 6, 5, "ELITE 4 AGATHA",
      ["EU SOU AGATHA, DA ELITE 4.", "O VELHO CARVALHO TE MANDOU? ELE JÁ FOI BOM, MAS HOJE SÓ CORRE ATRÁS DE BICHINHO.",
       "EU VOU TE MOSTRAR COMO UM TREINADOR DE VERDADE LUTA. COM FANTASMAS!"],
      ["HMPF. VOCÊ É DIFERENTE DO CARVALHO. A SALA DO LANCE JÁ ESTÁ SUBINDO."],
      [{ id: "gengar", lvl: 54 }, { id: "golbat", lvl: 54 }, { id: "haunter", lvl: 53 }, { id: "arbok", lvl: 56 }, { id: "gengar", lvl: 58 }, { id: "fus-gengar-arbok", lvl: 59 }], 5800) },
  { chao: { de: "pokemon_league_loreleis_room", filtro: "hue-rotate(170deg) saturate(1.3)" },
    npc: elite("lance", 6, 5, "ELITE 4 LANCE",
      ["ESTAVA TE ESPERANDO. EU SOU LANCE, O MESTRE DOS DRAGÕES.", "DRAGÕES SÃO QUASE INDESTRUTÍVEIS. QUASE.",
       "VAMOS VER SE VOCÊ É O 'QUASE'."],
      ["VOCÊ VENCEU A ELITE 4. MAS AINDA FALTA UM: O CAMPEÃO. A SALA DELE VEM AÍ."],
      [{ id: "gyarados", lvl: 56 }, { id: "dragonair", lvl: 54 }, { id: "dragonair", lvl: 54 }, { id: "aerodactyl", lvl: 58 }, { id: "dragonite", lvl: 60 }, { id: "fus-dragonite-gyarados", lvl: 62 }], 6000) },
  { chao: { de: "pokemon_league_brunos_room", filtro: "grayscale(0.85) brightness(1.15) contrast(1.1)" },
    npc: {
      id: "campeao", x: 6, y: 5, dir: "down", sprite: "rival",
      lines: [
        "AÍ ESTÁ VOCÊ. EU SOU O CAMPEÃO AGORA. CHEGUEI PRIMEIRO, COMO SEMPRE.",
        "E SABE O QUE EU APRENDI COM A MÁQUINA DE FUSÃO? QUE SEIS POKÉMON É DESPERDÍCIO.",
        "OLHA SÓ: PIDGEOT COM ALAKAZAM... GYARADOS COM ARCANINE... RHYDON COM O MEU INICIAL...",
        "TRÊS FUSÕES! E AINDA NÃO ACABOU.",
        "EU FUI ATRÁS DOS TRÊS PÁSSAROS LENDÁRIOS. E JUNTEI OS TRÊS NUM SÓ.",
        "ESTE É O ARTIDOLTRES. GELO, TROVÃO E FOGO. VAMOS VER QUEM É O MELHOR TREINADOR DO MUNDO!",
      ],
      afterLines: ["...EU PERDI. DE NOVO. PRA VOCÊ.", "A PORTA DE CIMA ABRIU. O HALL DA FAMA É SEU. VOCÊ É O CAMPEÃO."],
      trainer: {
        name: "CAMPEÃO AZUL", sprite: "azulcampeao", prize: 12000, lider: true, sight: 0, ligaKanto: true,
        party: [
          { id: "FUSAO:pidgeot+alakazam", lvl: 61 },
          { id: "FUSAO:gyarados+arcanine", lvl: 62 },
          { id: "FUSAO:rhydon+INICIAL", lvl: 63 },
          { id: "FUSAO:articuno+zapdos+moltres~artidoltres", lvl: 65 },
        ],
      },
    } },
];

export const LIGA_KANTO_MAPAS = {
  indigo_plateau_exterior: {
    name: "PLANALTO ÍNDIGO", music: "route", interior: false,
    npcs: [],
  },
  indigo_plateau_pokemon_center_1f: {
    name: "CENTRO POKÉMON DO PLANALTO ÍNDIGO", music: "center", interior: true,
    npcs: [
      { id: "n1", x: 13, y: 10, dir: "down", sprite: "enfermeira", heal: true,
        lines: ["BEM-VINDO AO PLANALTO ÍNDIGO! VOU CUIDAR DOS SEUS POKÉMON ANTES DA LIGA."] },
      { id: "n0", x: 0, y: 7, dir: "right", sprite: "balconista",
        lines: ["A ÚLTIMA LOJA ANTES DA ELITE 4. COMPRA TUDO QUE PRECISAR."],
        shop: [{ item: "poké bola", price: 200 }, { item: "poção", price: 300 }] },
      { id: "guarda", x: 5, y: 3, dir: "down", sprite: "superf",
        lines: ["DEPOIS DESTA PORTA ESTÁ A ELITE 4.", "SÃO QUATRO TREINADORES E O CAMPEÃO, UM ATRÁS DO OUTRO. SEM VOLTA.",
                "SÓ ENTRA QUEM TEM AS OITO INSÍGNIAS DE KANTO."] },
    ],
    lockedWarps: { "1,14": "O ANDAR DE CIMA ESTÁ FECHADO PRA REFORMA." },
    // a porta da ELITE 4: só com as 8 insígnias (ela recomeça a Liga)
    trancaLiga: { "4,1": { insignias: 8, msg: "A PORTA NÃO ABRE. PRECISA DAS OITO INSÍGNIAS DE KANTO.", recomeca: true } },
  },

  // A SALA TECNOLÓGICA (pedido do CAIO, nov/2026: "faz a liga ser
  // tecnológica, vai ter uma sala só que vira a próxima"). É a sala da LORELEI
  // do FireRed; os cinco ficam nela, um de cada vez (`mostrar`, pela etapa).
  // Vencido um, ele sai pela porta, o chão inteiro CAI (menos a pokébola do
  // centro), o chão da próxima sala SOBE, a tela pisca e a pokébola fica da cor
  // do próximo (a cena é `desenharSalaDaLiga`/`trocaDaLiga` no overworld).
  pokemon_league_loreleis_room: {
    name: "SALA DA LIGA", music: "gym", interior: true, ligaTech: true,
    chegadaLiga: { porta: [6, 12], x: 6, y: 10 },
    npcs: LIGA_ETAPAS.map((e, i) => ({ ...e.npc, x: 6, y: 5, trainer: { ...e.npc.trainer, etapaLiga: i },
      mostrar: (st) => (st.flags?.ligaEtapa || 0) === i && !st.flags?.ligaTrocando })),
    // a porta de cima só abre pro campeão, e leva pro HALL DA FAMA
    trancaLiga: { "6,2": { campeao: true, msg: "A PORTA ESTÁ FECHADA. A SALA AINDA ESTÁ EM MODO DE BATALHA." }, "6,12": { volta: true, msg: porTras } },
    atalhoLiga: { "6,2": { mapa: "pokemon_league_hall_of_fame", x: 5, y: 10, dir: "up" } },
  },
  pokemon_league_hall_of_fame: {
    name: "HALL DA FAMA", music: "lab", interior: true,
    atalhoLiga: { "5,12": { mapa: "pokemon_league_loreleis_room", x: 6, y: 4, dir: "down" } },
    npcs: [{
      id: "carvalho_hall", x: 6, y: 4, dir: "down", sprite: "prof",
      lines: [
        "PARABÉNS! VOCÊ É O NOVO CAMPEÃO DA LIGA POKÉMON DE KANTO!",
        "ESTA SALA É O HALL DA FAMA. AQUI FICAM REGISTRADOS OS CAMPEÕES E OS POKÉMON DELES, PRA SEMPRE.",
        "...E O MEU NETO? ELE VAI APRENDER. ELE SEMPRE APRENDE PERDENDO PRA VOCÊ.",
        "AH, E EU LIGUEI PRAS LOJAS: AGORA ELAS VENDEM MASTER BALL PRA VOCÊ.",
      ],
    }],
  },
};

/** a porta `x,y` deste mapa está trancada pela Liga? devolve a mensagem (ou null) */
export function trancaDaLiga(st, mapa, x, y) {
  const t = LIGA_KANTO_MAPAS[mapa]?.trancaLiga?.[`${x},${y}`];
  if (!t) return null;
  if (t.insignias && (st.badges || []).length < t.insignias) return t.msg;
  if (t.npc && !st.npcState?.[`${mapa}.${t.npc}`]?.defeated) return t.msg;
  if (t.volta && !st.flags?.kantoCampeao) return t.msg;   // campeão anda livre pela Liga
  if (t.campeao && !st.flags?.kantoCampeao) return t.msg;
  return null;
}

/** entrar pela porta do Centro recomeça a Liga: a sala volta pra LORELEI e
 *  todo mundo pode lutar de novo (o campeão também pode desafiar de novo) */
export function recomecaLiga(st, mapa, x, y) {
  if (!LIGA_KANTO_MAPAS[mapa]?.trancaLiga?.[`${x},${y}`]?.recomeca) return false;
  st.flags ||= {};
  st.flags.ligaEtapa = 0; st.flags.ligaPendente = null; st.flags.ligaTrocando = false;
  st.flags.ligaEntrada = true;      // a sala começa vazia e se monta (a cena da ENTRADA)
  LIGA_ETAPAS.forEach((e) => { const k = `pokemon_league_loreleis_room.${e.npc.id}`; if (st.npcState?.[k]) st.npcState[k].defeated = false; });
  return true;
}

/** a porta `x,y` leva pra outro lugar (a sala única pula as salas do FireRed) */
export const atalhoDaLiga = (mapa, x, y) => LIGA_KANTO_MAPAS[mapa]?.atalhoLiga?.[`${x},${y}`] || null;

/** A ESTRADA DA VITÓRIA FICA PRA DEPOIS ("o jogador vai passar por cima da
 *  victory road pq ao tentar entrar arceus aparece e fala por telepatia",
 *  CAIO, nov/2026). Antes de ser campeão, entrar na caverna pela ROTA 23 chama
 *  o ARCEUS: ele fala na sua cabeça e te leva pelo alto até o PLANALTO ÍNDIGO.
 *  Campeão, a caverna abre — e lá dentro está a AVE DAS CHAMAS, à espreita. */
export const ARCEUS_VITORIA = {
  semInsignias: [
    "UMA VOZ ENORME FALA DENTRO DA SUA CABEÇA...",
    "ARCEUS: AINDA NÃO, TREINADOR. VOLTE QUANDO TIVER AS OITO INSÍGNIAS.",
  ],
  fala: [
    "UMA LUZ DOURADA ENCHE A ENTRADA DA CAVERNA. UMA VOZ ENORME FALA DENTRO DA SUA CABEÇA...",
    "ARCEUS: TREINADOR. EU VI AS SUAS OITO INSÍGNIAS.",
    "ARCEUS: ESTA CAVERNA NÃO É PRA VOCÊ AGORA. ALGO DORME LÁ DENTRO, E NÃO DEVE SER ACORDADO ANTES DA HORA.",
    "ARCEUS: SUBA. EU TE LEVO POR CIMA DELA.",
  ],
  chegou: "VOCÊ FLUTUA POR CIMA DAS MONTANHAS... E POUSA DEVAGAR NO PLANALTO ÍNDIGO.",
  destino: { mapa: "indigo_plateau_exterior", x: 11, y: 11, dir: "up" },
};

/** a AVE DAS CHAMAS: o MOLTRES, no fundo da ESTRADA DA VITÓRIA, só pro campeão (entra em DB.ESTATICOS) */
export const ESTATICO_VITORIA = {
  id: "moltres", mapa: "victory_road_3f", x: 24, y: 12, nivel: 60, aparece: "kantoCampeao", flagCaptura: "moltresVitoria",
  lines: ["NO FUNDO DA CAVERNA, O AR ESQUENTA DE REPENTE. AS PEDRAS ESTÃO VERMELHAS DE CALOR.",
          "UMA AVE DE FOGO ABRE AS ASAS. ERA ELA QUE O ARCEUS NÃO QUERIA QUE VOCÊ ACORDASSE ANTES DA HORA!"],
};

/** AS FALAS DO HALL DA FAMA (a cena é src/scenes/halldafama.js) */
export const HALL_TEXTO = {
  antes: [
    "PROF. CARVALHO: VOCÊ CONSEGUIU! VOCÊ É O NOVO CAMPEÃO DA LIGA POKÉMON!",
    "ESTA É A MÁQUINA DO HALL DA FAMA. ELA GUARDA OS CAMPEÕES E OS POKÉMON DELES, PRA SEMPRE.",
    "VAMOS REGISTRAR O SEU TIME!",
  ],
  depois: [
    "PROF. CARVALHO: PRONTO. AGORA VOCÊS ESTÃO NA HISTÓRIA DE KANTO.",
    "AH, E EU LIGUEI PRAS LOJAS: AGORA ELAS VENDEM MASTER BALL PRA VOCÊ.",
    "E DIZEM QUE A ESTRADA DA VITÓRIA ACORDOU... UMA AVE DE FOGO ESTÁ À ESPREITA LÁ DENTRO.",
    "AGORA VAI PRA CASA DESCANSAR. SUA MÃE DEVE ESTAR ORGULHOSA!",
  ],
  // A VOLTA PRA CASA ("mãe emocionada que vc voltou e ainda por cima é o
  // campeão, ela tem uma conversa com o jogador, depois tem um omelete de ovo
  // de chansey e uma conversa a mais", CAIO, nov/2026). {FILHO} vira FILHO/FILHA
  casa: { map: "home", x: 8, y: 6, dir: "up" },
  mae1: [
    "MÃE: ...É VOCÊ? É VOCÊ MESMO?! VOCÊ VOLTOU!",
    "MÃE: EU VI NA TV! \"O NOVO CAMPEÃO DA LIGA POKÉMON DE KANTO\"... É O MEU {FILHO}!",
    "MÃE: EU CHOREI TANTO QUE O MR. MIME DA VIZINHA VEIO ME TRAZER UM LENÇO.",
    "MÃE: QUANDO VOCÊ SAIU POR ESSA PORTA, ERA SÓ UMA CRIANÇA COM UM POKÉMON NA BOLA. E AGORA... OLHA SÓ PRA VOCÊ.",
    "MÃE: SENTA AÍ. EU FIZ UMA COISA ESPECIAL PRA COMEMORAR!",
    "MÃE: OMELETE DE OVO DE CHANSEY! A ENFERMEIRA JOY QUE ME DEU O OVO. DIZEM QUE É A COMIDA MAIS GOSTOSA DE KANTO.",
  ],
  comeu: "VOCÊ COMEU O OMELETE INTEIRINHO! O SEU TIME COMEU AS SOBRAS E FICOU CHEIO DE ENERGIA.",
  mae2: [
    "MÃE: E ENTÃO? TÁ GOSTOSO? VOCÊ COMEU TÃO RÁPIDO QUE NEM DEU PRA PERGUNTAR.",
    "MÃE: SEUS POKÉMON TAMBÉM ADORARAM. OLHA ELES, TODOS FELIZES.",
    "MÃE: AGORA QUE VOCÊ É CAMPEÃO, PROMETE QUE VEM ME VISITAR MAIS VEZES?",
    // (a mãe do ASH no 1º episódio do anime)
    "MÃE: E NÃO SE ESQUEÇA DE TROCAR A ROUPA DE BAIXO... TODOS OS DIAS!",
    "MÃE: AGORA VAI. O MUNDO É GRANDE, E AINDA TEM MUITO POKÉMON ESPERANDO POR VOCÊ.",
  ],
};
