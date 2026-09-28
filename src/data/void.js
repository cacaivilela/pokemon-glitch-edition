// O GINÁSIO DO VOID: o ginásio secreto que fica NO PRETO da MATA DO SACI.
//
// O preto em volta do mapa não é desenho de nada — é onde o jogo parou de
// desenhar. Só se chega lá com a técnica secreta (segurar CORRER e esbarrar
// cinco vezes na mesma parede da beirada; ver `tentarAtravessar` em
// src/scenes/overworld.js). E aí, andando no escuro à esquerda da mata, tem um
// prédio que não devia estar ali: o ginásio de Pewter, piscando, com a porta
// aberta. Lá dentro manda o SACI.EXE — a cópia do SACI que ficou presa no
// lugar onde o mapa acaba. Ele luta com o que achou no preto, e o SACI de
// verdade não está no time dele (esse é o da clareira, e só se pega lá).
//
// A INSÍGNIA DO VOID não entra na conta de ninguém: nem nas oito de Kanto nem
// nas oito de Braglitch (a história conta as duas). Ela mora numa flag do save,
// `insignia_void`, e é só de quem achou.

export const GINASIO_VOID = {
  mapa: "mata_do_saci",
  porta: { x: -12, y: 8 },           // no preto, doze tiles à esquerda da mata
  sala: "void_ginasio",
  de: "pewter_city_gym",             // a sala é a do ginásio de Pewter (desenho e parede)
  fachada: "pewter_city",            // e o prédio que aparece no preto é o de lá
  meiaLargura: 3,                    // até 3 tiles pra cada lado da porta: os arbustos
                                     // colados no ginásio de Pewter não vêm junto
  insignia: { id: "void", nome: "INSÍGNIA DO VOID" },
};

const time = (lista) => lista.map(([id, lvl]) => ({ id, lvl }));

/** O prédio em volta de uma porta, no mapa `geo`: os tiles de parede ligados a
 *  ela (até `meia` pra cada lado), relativos à porta. É o que aparece no preto. */
function predioDaPorta(geo, porta, meia = 10) {
  const { w, h, tags } = geo;
  const parede = (x, y) => x >= 0 && y >= 0 && x < w && y < h && tags[y * w + x] === "1";
  const visto = new Set([`${porta.x},${porta.y}`]);
  const fila = [[porta.x, porta.y]];
  for (let i = 0; i < fila.length; i++) {
    const [x, y] = fila[i];
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy, k = `${nx},${ny}`;
      if (visto.has(k) || !parede(nx, ny) || Math.abs(nx - porta.x) > meia || porta.y - ny > 10 || ny > porta.y) continue;
      visto.add(k);
      fila.push([nx, ny]);
    }
  }
  const xs = fila.map(([x]) => x), ys = fila.map(([, y]) => y);
  const x0 = Math.min(...xs), y0 = Math.min(...ys);
  return {
    // o retângulo do desenho, com a porta como origem
    dx0: x0 - porta.x, dy0: y0 - porta.y,
    w: Math.max(...xs) - x0 + 1, h: Math.max(...ys) - y0 + 1,
    // de onde recortar no desenho do mapa de origem
    sx: x0, sy: y0,
    // quais tiles seguram (a porta não: ela é a entrada)
    solidos: fila.filter(([x, y]) => x !== porta.x || y !== porta.y).map(([x, y]) => `${x - porta.x},${y - porta.y}`),
  };
}

/** Monta a geometria: a porta no preto da mata e a sala do ginásio. Mexe na
 *  geometria da MATA DO SACI que `montarBraglitch` acabou de criar. */
export function montarVoid(kanto, geos) {
  const G = GINASIO_VOID;
  const mata = geos?.[G.mapa], sala = kanto?.[G.de], fora = kanto?.[G.fachada];
  if (!mata || !sala || !fora) return {};
  const portaLa = (fora.warps || []).find((w) => w.to === G.de);
  if (!portaLa) return {};
  mata.warps = [...(mata.warps || []), { x: G.porta.x, y: G.porta.y, to: G.sala, toWarp: 0 }];
  const volta = mata.warps.length - 1;
  mata.vazio = [{ x: G.porta.x, y: G.porta.y, de: G.fachada, ...predioDaPorta(fora, portaLa, G.meiaLargura) }];
  return {
    [G.sala]: {
      ...sala,
      arte: G.de,
      braglitch: true,
      warps: sala.warps.map((w) => ({ ...w, to: G.mapa, toWarp: volta })),
      connections: [],
      content: { ...(sala.content || {}), npcs: [], encounters: [] },
    },
  };
}

/** O conteúdo da sala (no formato de src/data/maps.js). */
export const CONTEUDO_VOID = {
  [GINASIO_VOID.sala]: {
    name: "GINÁSIO DO VOID", music: "gym", interior: true, encounters: [],
    spawn: { x: 6, y: 13, dir: "up" },
    npcs: [
      {
        id: "lider", x: 6, y: 5, dir: "down", sprite: "mon:saci",
        lines: ["VOCÊ ANDOU ONDE O MAPA ACABA.", "AQUI O JOGO NÃO DESENHA. AQUI QUEM DESENHA SOU EU.",
                "EU SOU O SACI.EXE. O OUTRO SACI GANHOU O GORRO. EU FIQUEI COM O RESTO."],
        afterLines: ["QUEM ACHA O PRETO NÃO PRECISA DE MAPA.", "LEVA A INSÍGNIA. NINGUÉM VAI ACREDITAR EM VOCÊ."],
        trainer: {
          name: "LÍDER SACI.EXE", prize: 5000,
          insigniaSecreta: GINASIO_VOID.insignia,
          party: time([["tronky", 22], ["piranhita", 22], ["missingno", 24]]),
        },
      },
      {
        id: "treinador0", x: 3, y: 8, dir: "right", sprite: "garoto",
        lines: ["0x00 0x00 0x00... AH, ALGUÉM. FAZ TEMPO QUE NINGUÉM ESBARRA ATÉ AQUI."],
        afterLines: ["EU ENTREI PELA MESMA PAREDE QUE VOCÊ. NUNCA ACHEI A SAÍDA."],
        trainer: { name: "PERDIDO 0x01", prize: 900, sight: 3, party: time([["decamark", 20]]) },
      },
      {
        id: "treinador1", x: 9, y: 8, dir: "left", sprite: "garota",
        lines: ["O PRETO NÃO É VAZIO. ELE SÓ NÃO FOI CARREGADO AINDA."],
        afterLines: ["SE O MAPA TIVESSE BORDA DE VERDADE, VOCÊ NÃO ESTARIA AQUI."],
        trainer: { name: "PERDIDA 0x02", prize: 900, sight: 3, party: time([["troncudo", 21], ["piranhita", 21]]) },
      },
      {
        id: "guia", x: 9, y: 13, dir: "down", sprite: "gentleman",
        lines: ["E AÍ, FUTURO... HM. NÃO SEI O QUE VOCÊ É, AQUI.",
                "O LÍDER É TIPO SOMBRIO E GLITCH. GOLPE DE LUTADOR E DE FADA DOEM NELE — QUANDO ELE LEMBRA QUE TEM TIPO."],
      },
    ],
  },
};

// ------------------------------------------------ AS LENDAS DO VOID
// Três lendas que moram no preto de Braglitch, fora do desenho dos mapas. Elas
// estão no livro das COORDENADAS DA LENDA, em SALVADITTO, junto com as outras —
// e a coordenada é a pista: X negativo, ou maior que o mapa, é no preto. Pra
// chegar lá só com a técnica secreta. Diferente das lendas das estradas, estas
// não esperam insígnia nenhuma: quem acha o preto já provou o que tinha que
// provar. Como as outras, aparecem UMA vez: pegou ou derrubou, acabou.
export const LENDAS_VOID = [
  { id: "giratina", mapa: "mata_do_saci", x: 36, y: 8, lvl: 65, noPreto: true,
    fala: ["O PRETO À DIREITA DA MATA SE DOBRA, COMO PAPEL MOLHADO.",
           "DO OUTRO LADO DA DOBRA, UMA SOMBRA COM ASAS OLHA PRA VOCÊ DE CABEÇA PRA BAIXO."] },
  { id: "darkrai", mapa: "sao_lucario", x: -7, y: 20, lvl: 60, noPreto: true,
    fala: ["AQUI O ESCURO É MAIS ESCURO QUE O RESTO DO ESCURO.", "UM OLHO AZUL SE ABRE NO MEIO DELE. VOCÊ SENTE SONO."] },
  { id: "necrozma", mapa: "rota_br101", x: 37, y: 16, lvl: 65, noPreto: true,
    fala: ["UM CACO DE VIDRO FLUTUA NO PRETO. ELE PUXA A POUCA LUZ QUE SOBROU AQUI.",
           "O CACO CRESCE, SE ENCAIXA EM OUTROS... E TEM FOME."] },
];

// O GUIA DO VOID: na TORRE POKÉMON uma canalizadora tem medo do preto em volta
// do mapa. Traga um Pokémon de FOGO pra iluminar lá e ela te dá o guia —
// um livrinho que conta a técnica sem enigma (o de SALVADITTO conta em
// charada). A técnica é a de sempre (`tentarAtravessar` em
// src/scenes/overworld.js): segurar CORRER contra a cerca da beirada do mapa.
export const GUIA_VOID = {
  mapa: "pokemon_tower_1f",
  npc: { id: "guia_void", x: 5, y: 10, dir: "right", sprite: "canalizadora" },
  item: "guia do void",
  pede: [
    "O PRETO DO MAPA É SINISTRO...",
    "ESSE ESCURO EM VOLTA DE TUDO, ONDE O DESENHO ACABA. EU SINTO ALGUÉM ANDANDO LÁ.",
    "ME TRAGA UM POKÉMON PRA ILUMINAR LÁ! UM DE FOGO.",
  ],
  semFogo: "NENHUM DOS SEUS SOLTA FOGO... ASSIM NINGUÉM ENXERGA NADA NO PRETO.",
  comFogo: [
    "{MON}! ESSA CHAMA DÁ PRA VER DAQUI DE DENTRO DA TORRE.",
    "COM ELE DO SEU LADO, O ESCURO NÃO ME ASSUSTA MAIS. LEVA ISTO: EU NUNCA TIVE CORAGEM DE USAR.",
  ],
  ganhou: "VOCÊ RECEBEU O GUIA DO VOID!",
  depois: "LEU O GUIA? CUIDADO LÁ NO PRETO. E LEVA O {MON} JUNTO.",
  depoisSemNome: "LEU O GUIA? CUIDADO LÁ NO PRETO.",
  // o que está escrito nele (mochila → GUIA DO VOID)
  texto: [
    "GUIA DO VOID. A CAPA É PRETA, SEM TÍTULO NENHUM.",
    "\"FIQUE CORRENDO DE CARA EM UMA PAREDE POR 5 SEGUNDOS. O MUNDO VAI CEDER E VOCÊ VAI CHEGAR NESSA ESCURIDÃO.\"",
    "NA MARGEM, A LÁPIS: \"A PAREDE É A CERCA DA BEIRADA DO MAPA. PAREDE DO MEIO NÃO CEDE.\"",
    "\"PRA VOLTAR, É SÓ PISAR NUM CHÃO DE VERDADE.\"",
  ],
};
