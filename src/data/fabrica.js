// A FÁBRICA DE POKÉBOLAS (pedido do CAIO, nov/2026): "faz a usina no pós game
// virar uma fábrica de pokébolas, que é furtada pela equipe rocket que vc
// derrota o giovanni junto com o gary e a equipe rocket se desfaz, o gary vira
// o líder de viridian e o giovanni vira o dono da fábrica de bolas e vc paga
// pra ele pra ele fabricar novas bolas". Escolhas dele: as bolas são as raras
// dos jogos E umas inventadas; pagando, a bola passa a ser VENDIDA NAS LOJAS;
// o GARY de líder conversa E luta.
//
// Depois da LIGA DE KANTO (`kantoCampeao`) a USINA vira a FÁBRICA. Lá dentro, os
// ROCKETS estão roubando as máquinas. No fundo, o GIOVANNI e um CAPANGA — e o
// AZUL (o GARY, o seu rival) aparece pra lutar do seu lado, em DUPLA. Vencidos:
// a EQUIPE ROCKET ACABA (`rocketDesfeita`), o AZUL vira o LÍDER DE VIRIDIAN e o
// GIOVANNI fica na fábrica, de dono. Pagando a ele, cada bola nova é fabricada
// UMA VEZ e daí em diante qualquer loja vende (`bola_<id>`).

export const FABRICA = {
  mapa: "power_plant",
  requer: "kantoCampeao",
  nome: "FÁBRICA DE POKÉBOLAS",
  // depois que a ROCKET acaba ela troca de nome (pedido do CAIO: "vira a fábrica
  // pocket, de foguete pra bolso!" — ROCKET é foguete, POCKET é bolso)
  nomeDepois: "FÁBRICA POCKET",
  // os ROCKETS roubando (somem quando a equipe acaba)
  rockets: [
    { x: 15, y: 10, dir: "down", nome: "RECRUTA ROCKET", time: [["golbat", 58], ["arbok", 59]],
      fala: ["ESTA FÁBRICA AGORA É DA EQUIPE ROCKET! CADA BOLA QUE SAI DAQUI VAI PRO CHEFE!"], depois: ["O CHEFE TÁ LÁ NO FUNDO... ELE NÃO VAI GOSTAR DE VOCÊ."] },
    { x: 31, y: 10, dir: "down", nome: "RECRUTA ROCKET", time: [["weezing", 59], ["raticate", 58]],
      fala: ["A GENTE TÁ LEVANDO AS MÁQUINAS. COM ELAS, O CHEFE FAZ MASTER BALL DE MONTE!"], depois: ["...NÃO CONTA PRA NINGUÉM QUE EU PERDI."] },
    { x: 11, y: 25, dir: "right", nome: "RECRUTA ROCKET", time: [["muk", 60], ["houndoom", 60]],
      fala: ["VOCÊ É O CAMPEÃO? E DAÍ? AQUI DENTRO MANDA A ROCKET!"], depois: ["TÁ BOM, TÁ BOM. VAI LÁ."] },
  ],
  // o GIOVANNI e o CAPANGA (do MÍSERO MEOWTH) no fundo, e o AZUL que chega pra ajudar
  chefe: { x: 28, y: 27, dir: "left" },
  azul: { x: 26, y: 27, dir: "right" },
  giovanni: {
    fala: ["ENTÃO É VOCÊ DE NOVO. O CAMPEÃO.", "A EQUIPE ROCKET VAI FABRICAR AS PRÓPRIAS BOLAS. QUEM TEM AS BOLAS, TEM OS POKÉMON.",
           "E QUEM TEM OS POKÉMON... TEM TUDO."],
    azulChega: ["???: ESPERA AÍ!", "{RIVAL}: ACHOU QUE IA FICAR COM A GLÓRIA SOZINHO, CAMPEÃO?", "{RIVAL}: EU TAMBÉM TENHO CONTAS PRA ACERTAR COM ESSE CARA. VAMOS JUNTOS!",
               "GIOVANNI: DOIS? QUE SEJA. CAPANGA, VEM!", "CAPANGA: E-EU, CHEFE?! MAS EU SÓ TENHO UM MEOWTH...", "GIOVANNI: VEM LOGO!"],
    time: [["nidoking", 66], ["rhyperior", 68], ["persian", 65], ["kangaskhan", 66], ["nidoqueen", 66], ["garchomp", 70]],
  },
  ariana: { nome: "CAPANGA ROCKET", sprite: "rocket", time: [["meowth", 8]] },   // o parceiro do GIOVANNI: um MÍSERO MEOWTH (pedido do CAIO)
  azulTime: [["pidgeot", 66], ["alakazam", 66], ["arcanine", 67], ["gyarados", 67], ["exeggutor", 66], ["machamp", 66]],
  // depois da luta
  fim: ["GIOVANNI: ...PERDI. PRA UMA CRIANÇA. DE NOVO.", "GIOVANNI: A EQUIPE ROCKET... ACABOU. EU ANUNCIO AGORA: ESTÁ DESFEITA.",
        "{RIVAL}: E O GINÁSIO DE VIRIDIAN? FICA SEM LÍDER?", "GIOVANNI: FICA COM VOCÊ, GAROTO. VOCÊ LUTA MELHOR DO QUE EU PENSAVA.",
        "GIOVANNI: E EU... FICO AQUI. ALGUÉM TEM QUE CUIDAR DESTA FÁBRICA. DE VERDADE, DESTA VEZ.",
        "GIOVANNI: E ELA PRECISA DE UM NOME NOVO. CHEGA DE ROCKET, DE FOGUETE...",
        "GIOVANNI: AGORA É POCKET. DE BOLSO. UMA POKÉBOLA CABE NO BOLSO, NÃO CABE?",
        "(A EQUIPE ROCKET ACABOU! O AZUL VIROU O LÍDER DE VIRIDIAN, E O GIOVANNI VIROU O DONO DA FÁBRICA POCKET!)"],
  // o GIOVANNI de dono: paga e ele fabrica
  dono: ["BEM-VINDO À FÁBRICA POCKET. EU SOU O DONO, GIOVANNI. SIM, ESSE GIOVANNI.",
         "EU TENHO OS MOLDES DE BOLAS QUE NENHUMA LOJA VENDE. PAGUE A FABRICAÇÃO, E EU MANDO PRA TODAS AS LOJAS."],
  pergunta: "QUAL BOLA FABRICAR?",
  fabricou: (b, preco) => [`FECHADO: ${preco} PELA FÁBRICA DA ${b}.`, "AS MÁQUINAS LIGARAM... A PRIMEIRA SAIU! DE AGORA EM DIANTE, TODA LOJA VENDE."],
  semDinheiro: "SEM DINHEIRO, SEM BOLA. VOLTE QUANDO TIVER.",
  jaTodas: ["TODAS AS BOLAS JÁ ESTÃO NAS LOJAS. ATÉ EU ESTOU IMPRESSIONADO."],
  // o AZUL de líder em VIRIDIAN
  lider: {
    fala: ["E AÍ, CAMPEÃO! VIU SÓ? AGORA EU SOU O LÍDER DE VIRIDIAN!", "ESTE GINÁSIO ERA DO GIOVANNI... MAS AGORA AQUI É SÓ POKÉMON, SEM ROCKET.",
           "QUER UMA REVANCHE? DESSA VEZ EU NÃO PERCO!"],
    depois: ["TÁ, PERDI. MAS OLHA: LÍDER BOM É O QUE PERDE E APRENDE.", "DICA DE LÍDER: AS BOLAS NOVAS DA FÁBRICA AJUDAM MUITO. A ROCKET BALL PEGA SOMBRIO RAPIDINHO."],
    time: [["pidgeot", 72], ["alakazam", 72], ["arcanine", 73], ["gyarados", 73], ["rhyperior", 72], ["exeggutor", 74]],
  },
  // os EX-ROCKETS, de uniforme novo da fábrica (vermelho e branco), trabalhando
  operarios: [
    { x: 15, y: 10, fala: ["EU ERA DA ROCKET. AGORA EU APERTO PARAFUSO DE POKÉBOLA. E SABE QUE EU GOSTO?"] },
    { x: 31, y: 10, fala: ["O UNIFORME NOVO É VERMELHO E BRANCO, QUE NEM UMA POKÉBOLA. O CHEFE QUE ESCOLHEU."] },
    { x: 11, y: 25, fala: ["O ESCONDERIJO DE CELADON VIROU O PARQUE DAS POKÉBOLAS! VAI LÁ VER."] },
  ],
};

// ------------------------------------------------------------ as BOLAS NOVAS
// `regra`: o que faz a bola pegar melhor (o bônus sai de `bonusDaBola`, src/data/bolas.js)
export const BOLAS_NOVAS = [
  // AS RARAS DOS JOGOS
  { item: "net ball",     label: "NET BALL",     regra: "net",     preco: 1000, fabrica: 15000, lore: "UMA REDE NA BOLA: PEGA MUITO MELHOR POKÉMON DE ÁGUA E DE INSETO." },
  { item: "dive ball",    label: "DIVE BALL",    regra: "dive",    preco: 1000, fabrica: 15000, lore: "FEITA PRA ÁGUA: PEGA MELHOR QUEM VOCÊ ACHA SURFANDO OU MERGULHANDO." },
  { item: "nest ball",    label: "NEST BALL",    regra: "nest",    preco: 1000, fabrica: 12000, lore: "QUANTO MAIS BAIXO O NÍVEL DO POKÉMON, MAIS FÁCIL ELA PEGA." },
  { item: "repeat ball",  label: "REPEAT BALL",  regra: "repeat",  preco: 1000, fabrica: 15000, lore: "PEGA MUITO MELHOR UMA ESPÉCIE QUE VOCÊ JÁ PEGOU ANTES." },
  { item: "timer ball",   label: "TIMER BALL",   regra: "timer",   preco: 1000, fabrica: 18000, lore: "QUANTO MAIS TURNOS A BATALHA DURA, MELHOR ELA PEGA." },
  { item: "dusk ball",    label: "DUSK BALL",    regra: "dusk",    preco: 1000, fabrica: 18000, lore: "PEGA MUITO MELHOR DE NOITE E DENTRO DE CAVERNA." },
  { item: "quick ball",   label: "QUICK BALL",   regra: "quick",   preco: 1000, fabrica: 20000, lore: "JOGADA LOGO NO COMEÇO DA BATALHA, ELA QUASE SEMPRE PEGA." },
  { item: "fast ball",    label: "FAST BALL",    regra: "fast",    preco: 1000, fabrica: 15000, lore: "BOA PRA POKÉMON RÁPIDO, DAQUELES QUE FOGEM." },
  { item: "level ball",   label: "LEVEL BALL",   regra: "level",   preco: 1000, fabrica: 15000, lore: "QUANTO MAIOR O SEU NÍVEL PERTO DO DELE, MELHOR ELA PEGA." },
  { item: "heavy ball",   label: "HEAVY BALL",   regra: "heavy",   preco: 1000, fabrica: 15000, lore: "QUANTO MAIS PESADO O POKÉMON, MELHOR ELA PEGA." },
  { item: "moon ball",    label: "MOON BALL",    regra: "moon",    preco: 1000, fabrica: 15000, lore: "PEGA MELHOR OS QUE EVOLUEM COM A PEDRA DA LUA." },
  { item: "dream ball",   label: "DREAM BALL",   regra: "dream",   preco: 1500, fabrica: 20000, lore: "PEGA MUITO MELHOR UM POKÉMON QUE ESTÁ COM ALGUM PROBLEMA (ENVENENADO, PARALISADO, QUEIMADO)." },
  { item: "beast ball",   label: "BEAST BALL",   regra: "beast",   preco: 2000, fabrica: 40000, lore: "FEITA PRAS ULTRACRIATURAS. NOS OUTROS POKÉMON, QUASE NÃO FUNCIONA." },
  { item: "luxury ball",  label: "LUXURY BALL",  regra: "comum",   preco: 3000, fabrica: 10000, lore: "UMA BOLA CHIQUE, DE LUXO. O POKÉMON SE SENTE EM CASA DENTRO DELA." },
  { item: "premier ball", label: "PREMIER BALL", regra: "comum",   preco: 200,  fabrica: 5000,  lore: "UMA BOLA BRANCA DE COMEMORAÇÃO. PEGA IGUAL À COMUM." },
  { item: "friend ball",  label: "FRIEND BALL",  regra: "comum",   preco: 1000, fabrica: 8000,  lore: "QUEM ENTRA NELA JÁ SAI GOSTANDO MAIS DE VOCÊ." },
  // AS INVENTADAS DA FÁBRICA
  { item: "rocket ball",  label: "ROCKET BALL",  regra: "rocket",  preco: 1500, fabrica: 25000, lore: "A BOLA QUE A ROCKET ESTAVA FAZENDO ESCONDIDA. PEGA MUITO MELHOR SOMBRIO E VENENOSO." },
  { item: "alfa ball",    label: "ALFA BALL",    regra: "alfa",    preco: 3000, fabrica: 50000, lore: "FEITA PROS ALFAS: CONTRA UM POKÉMON ALFA, ELA PEGA QUATRO VEZES MELHOR." },
  { item: "bola lendária", label: "BOLA LENDÁRIA", regra: "lenda", preco: 8000, fabrica: 120000, lore: "O MOLDE MAIS CARO DA FÁBRICA. CONTRA UM LENDÁRIO, PEGA CINCO VEZES MELHOR." },
];

/** OS BONECOS DA FÁBRICA E DE VIRIDIAN, postos no fim do `buildDB` (src/data/index.js)
 *  — como o helicóptero da ÁREA ZERO: as regras `mostrar` são funções, e a
 *  montagem dos mapas copia os NPCs e perde função. Aqui eles entram já prontos. */
export function porFabrica(db) {
  const F = FABRICA;
  const fab = (st) => !!st.flags?.[F.requer];
  const rocket = (st) => fab(st) && !st.flags?.rocketDesfeita;
  const acabou = (st) => !!st.flags?.rocketDesfeita;
  const m = db.MAPS?.[F.mapa];
  if (m) {
    m.npcs = [...(m.npcs || []).filter((n) => !String(n.id).startsWith("fabrica_")),
      ...F.rockets.map((r, i) => ({ id: `fabrica_rocket${i}`, x: r.x, y: r.y, dir: r.dir, sprite: "rocket", mostrar: rocket,
        lines: r.fala, afterLines: r.depois, trainer: { name: r.nome, prize: 3500, sight: 4, party: r.time.map(([id, lvl]) => ({ id, lvl })) } })),
      { id: "fabrica_giovanni", ...F.chefe, sprite: "giovanni", mostrar: rocket, fabricaChefe: true, lines: F.giovanni.fala },
      ...F.operarios.map((o, i) => ({ id: `fabrica_operario${i}`, x: o.x, y: o.y, dir: "down", sprite: "operario", mostrar: acabou, lines: o.fala })),
      { id: "fabrica_dono", ...F.chefe, sprite: "giovanni", mostrar: acabou, fabricaDono: true, lines: F.dono }];
    // o nome do mapa: USINA antes, FÁBRICA depois da Liga
    const nomeUsina = m.name || "USINA";
    Object.defineProperty(m, "name", { configurable: true, enumerable: true,
      get: () => { const st = globalThis.game?.state || {}; return acabou(st) ? F.nomeDepois : fab(st) ? F.nome : nomeUsina; }, set: () => {} });
  }
  // VIRIDIAN: o GIOVANNI some do ginásio e o AZUL vira o líder (conversa e revanche)
  const g = db.MAPS?.viridian_city_gym;
  if (g) {
    g.npcs = (g.npcs || []).filter((n) => n.id !== "lider_azul").map((n) => (n.id === "lider" ? { ...n, mostrar: (st) => !acabou(st) } : n));
    g.npcs.push({ id: "lider_azul", x: 2, y: 2, dir: "down", sprite: "rival", mostrar: acabou,
      lines: F.lider.fala, afterLines: F.lider.depois,
      trainer: { name: "LÍDER {RIVAL}", prize: 9000, lider: true, sight: 0, party: F.lider.time.map(([id, lvl]) => ({ id, lvl })) } });
  }
}
