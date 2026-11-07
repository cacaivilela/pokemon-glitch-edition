// KALOS: a LUMIOSE do jeito do Legends Z-A.
//
// Uma cidade grande, uma planta só (o mesmo construtor de Braglitch,
// `montarGeos` em src/data/braglitch.js, com `marca: { regiao: "kalos" }`):
// a TORRE PRISMA no meio da praça, o HOTEL Z (a sua base), a ZONA DE BATALHA
// (de noite, a Z-A ROYALE), o Centro, a loja, e as ZONAS SELVAGENS — os
// quatro cercados dos cantos, onde os Pokémon andam soltos pela cidade. É lá
// e só lá que tem mato alto.
//
// Chega-se de AVIÃO: o piloto fica em VERMILION (Kanto) e em SÃO LUCARIO
// (Braglitch), e o balcão do AEROPORTO DE LUMIOSE leva de volta. Basta ter
// um Pokémon (`AVIAO.pode`): cada ZONA SELVAGEM tem o seu nível, da 1 (5-10)
// à 4 (38-48).
//
// A PLANTA (os caracteres de Braglitch, ver dev/LUGARES.md, e os de Kalos):
//   P  calçada de pedra (no tema "lumiose" o pintor faz paralelepípedo)
//   h  prédio de Paris (parede creme, telhado de ardósia) — porta trancada
//   H  o HOTEL Z (tem interior)      L  o AEROPORTO (tem interior: o balcão)
//   T  a TORRE PRISMA                c  a cerca das ZONAS SELVAGENS
//   l  poste de luz                  ,  mato alto (só dentro das zonas)
import { montarGeos } from "./braglitch.js";
import { saidaDe } from "./braglitch-mundo.js";

const PLANTA_LUMIOSE = [
  "hhhhhhhhhhhhhhhhhhhhhhhPPhhhhhhhhhhhhhhhhhhhhhhh",
  "hhhhhhhhhhhhhhhhhhhhhhhPPhhhhhhhhhhhhhhhhhhhhhhh",
  "hhhhhhhhhhhhhhhhhhhhhhhPPhhhhhhhhhhhhhhhhhhhhhhh",
  "cccccccccccPPPPPPPPPPPPPPPPPPPPPPPPPPccccccccccc",
  "c,,,,..,,,cPPHHHHHHPPPPPPPPPPPPPPPPPPc,,,..,,,,c",
  "c,,,,,,,,,cPPHHHHHHPPPPPPPPPPPPPPPPPPc,,,,,,,,,c",
  "c,,.,,,,,,cPPHHHHHHPPPPPPPPPPPPPPPPPPc,,,,,,.,,c",
  "c,,,,,,,,,cP1PPDPPPPPPPPPPPPP2PPPPPPPc,,,,,,,,,c",
  "c,,,,,,,,,PPPPPPPPPPPPPPPPPPPPPPPPPPPP,,,,,,,,,c",
  "c,,..,,,,,c5PPPPPPPPPPPPPPPPPPPPPPPP6c,,,,,..,,c",
  "c,,,,,,,,,cPPPPPPPPPPPPPPPPPPPPPPPPPPc,,,,,,,,,c",
  "c,,,,,,,,,cPPPPPPPlFFFFPPFFFFlPPPPPPPc,,,,,,,,,c",
  "cccccccccccPPPPPPPFPPPPPPPPPPFPPPPPPPccccccccccc",
  "hhhhhhhhhPPPPPPPPPFPPTTTTTTPPFPPPPPPPPPhhhhhhhhh",
  "hhhhhhhhhPPPPPPPPPFPPTTTTTTPPFPPPPPPPPPhhhhhhhhh",
  "hhhhhhhhhPPPPPPPPPFPPTTTTTTPPFPPPPPPPPPhhhhhhhhh",
  "hhhhhhhhhPPPPPPPPPFPPTTTTTTPPFPPPPPPPPPhhhhhhhhh",
  "hhhhhhhhhPPPPPPPPPFPPTTTTTTPPFPPPPPPPPPhhhhhhhhh",
  "PPPPPPPPPPPPPPPPPPFPPTTTTTTPPFPPPPPPPPPPPPPPPPPP",
  "hhhhhhhhhPPPPPPPPPFPPPP3PPPPPFPPPPPPPPPhhhhhhhhh",
  "hhhhhhhhhPPPPPPPPPFPPPPPPPPPPFPPPPPPPPPhhhhhhhhh",
  "hhhhhhhhhPPPPPPPPPlFFFFPPFFFFlPPPPPPPPPhhhhhhhhh",
  "hhhhhhhhhPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPhhhhhhhhh",
  "hhhhhhhhhPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPhhhhhhhhh",
  "hhhhhhhhhPPPPCCCCCPPPPPPPPPPPPPMMMMMPPPhhhhhhhhh",
  "hhhhhhhhhPPPPCCCCCPPPPPPPPPPPPPMMMMMPPPhhhhhhhhh",
  "hhhhhhhhhPPPPCCCCCPPPPPPPPPPPPPMMMMMPPPhhhhhhhhh",
  "hhhhhhhhhPPPPPPDPPPPPPPPPPPPPPPPPDPPPPPhhhhhhhhh",
  "hhhhhhhhhPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPhhhhhhhhh",
  "hhhhhhhhhPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPhhhhhhhhh",
  "cccccccccccPPPPPPPPPLLLLLLLLPPPPPPPPPccccccccccc",
  "c,,,,,,,,,cPPPPPPPPPLLLLLLLLPPPPPPPPPc,,,,,,,,,c",
  "c,,.,,,,,,cPPPPPPPPPLLLLLLLLPPPPPPPPPc,,,,,,.,,c",
  "c,,,,,,,,,cPPPPPPPPP4PPDPPPPPPPPPPPPPc,,,,,,,,,c",
  "c,,,,,,,,,PPPPPPPPPPPPPPPPPPPPPPPPPPPP,,,,,,,,,c",
  "c,,,..,,,,c7PPPPPPPPPPPPPPPPPPPPPPPP8c,,,..,,,,c",
  "c,,,,,,,,,cPPlPPPPPPPPPPPPPPPPPPPPlPPc,,,,,,,,,c",
  "c,,,,,,,,,cPPPPPPPPPPPPPPPPPPPPPPPPPPc,,,,,,,,,c",
  "cccccccccccPPPPPPPPPPPPPPPPPPPPPPPPPPccccccccccc",
  "hhhhhhhhhhhhhhhhhhhhhhhPPhhhhhhhhhhhhhhhhhhhhhhh",
  "hhhhhhhhhhhhhhhhhhhhhhhPPhhhhhhhhhhhhhhhhhhhhhhh",
  "hhhhhhhhhhhhhhhhhhhhhhhPPhhhhhhhhhhhhhhhhhhhhhhh",
];

// ------------------------------------------------------------ os bairros
/** OS QUATRO BAIRROS em volta do CENTRO (a planta de cima), ligados pelas
 *  avenidas: cada um com quatro ZONAS SELVAGENS nos cantos. Saem de um molde
 *  (`bairro`): a borda de prédios, a avenida pro centro (`saida` é o lado), os
 *  cercados com a entrada virada pro meio e a placa do lado, e um quarteirão
 *  com postes no meio. */
const BAIRROS = [
  { id: "lumiose_sul", nome: "LUMIOSE — BAIRRO SUL", saida: "up", zonas: [5, 6, 7, 8] },
  { id: "lumiose_leste", nome: "LUMIOSE — BAIRRO LESTE", saida: "left", zonas: [9, 10, 11, 12] },
  { id: "lumiose_oeste", nome: "LUMIOSE — BAIRRO OESTE", saida: "right", zonas: [13, 14, 15, 16] },
  { id: "lumiose_norte", nome: "LUMIOSE — BAIRRO NORTE", saida: "down", zonas: [17, 18, 19, 20] },
];
/** os cantos de um bairro: [x0, y0, x1, y1] da cerca, a entrada e a placa */
const CANTOS = [
  { r: [3, 3, 13, 12], porta: [13, 8], placa: [14, 9] },
  { r: [34, 3, 44, 12], porta: [34, 8], placa: [33, 9] },
  { r: [3, 29, 13, 38], porta: [13, 33], placa: [14, 34] },
  { r: [34, 29, 44, 38], porta: [34, 33], placa: [33, 34] },
];
function bairro(saida, semente) {
  const W = 48, H = 42;
  // prédios em cima e embaixo, árvores nos lados (o pintor junta letras iguais
  // em retângulo: uma borda inteira de prédio virava um prédio só do tamanho do mapa)
  const g = Array.from({ length: H }, (_, y) => Array.from({ length: W }, (_, x) =>
    (y < 3 || y >= H - 3 ? "h" : x < 3 || x >= W - 3 ? "#" : "P")));
  const abre = (x, y) => { if (g[y]?.[x]) g[y][x] = "P"; };
  for (let k = 0; k < 3; k++) {             // a avenida pro CENTRO
    if (saida === "up") { abre(23, k); abre(24, k); }
    if (saida === "down") { abre(23, H - 1 - k); abre(24, H - 1 - k); }
    if (saida === "left") { abre(k, 18); abre(k, 19); }
    if (saida === "right") { abre(W - 1 - k, 18); abre(W - 1 - k, 19); }
  }
  let r = semente;
  const sorte = () => { r = (r * 1103515245 + 12345) & 0x7fffffff; return r % 100; };
  CANTOS.forEach((c, n) => {
    const [x0, y0, x1, y1] = c.r;
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        g[y][x] = x === x0 || x === x1 || y === y0 || y === y1 ? "c" : sorte() < 12 ? "." : ",";
      }
    }
    g[c.porta[1]][c.porta[0]] = "P";        // a entrada da zona
    g[c.placa[1]][c.placa[0]] = String(n + 1);
  });
  // o quarteirão do meio, os postes e um canteiro (a avenida LESTE-OESTE, nas
  // fileiras 18-19, e a NORTE-SUL, nas colunas 23-24, ficam livres)
  for (let y = 14; y <= 16; y++) for (let x = 17; x <= 30; x++) if (x < 23 || x > 24) g[y][x] = "h";
  for (let y = 22; y <= 24; y++) for (let x = 17; x <= 30; x++) if (x < 23 || x > 24) g[y][x] = "h";
  for (const [x, y] of [[16, 13], [31, 13], [16, 25], [31, 25]]) g[y][x] = "l";
  for (let x = 18; x <= 29; x++) if (x < 22 || x > 25) g[20][x] = "F";
  g[17][25] = "5";                          // a placa do bairro, na esquina da avenida
  return g.map((l) => l.join(""));
}

/** os interiores: cópia dos de Kanto, com a porta apontando pra LUMIOSE */
const INTERIORES = {
  lumiose_pokemon_center_1f: { de: "center", predio: "C", cidade: "lumiose" },
  lumiose_loja: { de: "mart", predio: "M", cidade: "lumiose" },
  lumiose_aeroporto: { de: "mart", predio: "L", cidade: "lumiose" },
  lumiose_hotel_z: { de: "home", predio: "H", cidade: "lumiose" },
};

/** As portas que não abrem: os prédios de apartamento. */
export const PORTA_FECHADA_KALOS = {
  h: ["UM PRÉDIO DE APARTAMENTOS. A PORTA SÓ ABRE COM O INTERFONE, E NINGUÉM ATENDE."],
};

/** Monta a geometria de Kalos (`kanto` é o kanto.json, de onde saem os interiores). */
export function montarKalos(kanto) {
  const plantas = { lumiose: PLANTA_LUMIOSE };
  BAIRROS.forEach((b, i) => { plantas[b.id] = bairro(b.saida, 77 + i * 31); });
  // as avenidas: o CENTRO liga em cada bairro pelo lado de lá
  const OPOSTO = { up: "down", down: "up", left: "right", right: "left" };
  const ligacoes = { lumiose: [] };
  for (const b of BAIRROS) {
    const ladoCentro = OPOSTO[b.saida];
    const a = saidaDe(plantas.lumiose, ladoCentro), c = saidaDe(plantas[b.id], b.saida);
    ligacoes.lumiose.push({ dir: ladoCentro, offset: a - c, to: b.id });
    ligacoes[b.id] = [{ dir: b.saida, offset: c - a, to: "lumiose" }];
  }
  return montarGeos(kanto, { plantas, interiores: INTERIORES, ligacoes,
                             temas: Object.fromEntries(Object.keys(plantas).map((id) => [id, "lumiose"])),
                             cidadePadrao: "lumiose", marca: { kalos: true, regiao: "kalos" } });
}

// ------------------------------------------------------------ o conteúdo
/** AS VINTE ZONAS SELVAGENS (como no Legends Z-A): quatro no CENTRO e quatro
 *  em cada bairro, cada uma com os bichos dela e um nível que sobe de três em
 *  três — a ZONA 1 começa no 4, a ZONA 20 chega no 66. src/systems/encounters.js
 *  lê o retângulo onde você pisa (`zonas` do mapa). */
const BICHOS_DA_ZONA = {
  1: "fletchling pidgey flabb bunnelby scatterbug", 2: "weedle caterpie spewpa pichu fletchling",
  3: "litleo skiddo pancham espurr", 4: "helioptile spritzee swirlix mareep",
  5: "honedge inkay dedenne klefki", 6: "phantump pumpkaboo gastly litwick",
  7: "binacle skrelp clauncher magikarp", 8: "noibat goomy hawlucha bagon",
  9: "fletchinder pidgeotto diggersby vivillon flaaffy", 10: "pyroar gogoat meowstic heliolisk riolu",
  11: "pangoro doublade malamar aromatisse slurpuff", 12: "barbaracle dragalge clawitzer gyarados",
  13: "trevenant gourgeist haunter sliggoo", 14: "amaura tyrunt bergmite carbink eevee",
  15: "talonflame pidgeot florges absol ampharos", 16: "aurorus tyrantrum avalugg noivern lucario",
  17: "aegislash goodra gabite axew", 18: "dratini dragonair fraxure larvitar",
  19: "pupitar gible haxorus sylveon", 20: "dragonite garchomp tyranitar goodra noivern",
};
const niveisDa = (n) => [4 + (n - 1) * 3, 9 + (n - 1) * 3];
const zona = (n, [x0, y0, x1, y1]) => ({ n, x0, y0, x1, y1, niveis: niveisDa(n),
  lista: BICHOS_DA_ZONA[n].split(" ").map((id) => [id, 10]) });
const placaDaZona = (n) => `ZONA SELVAGEM ${n}\nPOKÉMON DO NÍVEL ${niveisDa(n)[0]} AO ${niveisDa(n)[1]}.`;
/** as do CENTRO: 1 e 2 embaixo (do lado do aeroporto), 3 e 4 em cima */
const ZONAS = [zona(1, [0, 30, 10, 38]), zona(2, [37, 30, 47, 38]), zona(3, [0, 3, 10, 12]), zona(4, [37, 3, 47, 12])];

const LOJA = [
  { item: "poké bola", price: 200 }, { item: "great ball", price: 600 }, { item: "ultra ball", price: 1200 },
  { item: "poção", price: 300 },
];

// ------------------------------------------------------------ a Z-A ROYALE
/** OS RANKS: do Z (quem acabou de chegar) ao A. Cada um é uma PROMOÇÃO: de
 *  noite, na ZONA DE BATALHA, aparece o adversário do rank seguinte; vencido,
 *  você sobe, e o próximo aparece no lugar. O rank não fica gravado: é contado
 *  das promoções vencidas (`npcState["lumiose.za_<LETRA>"]`). */
export const LETRAS = "ZYXWVUTSRQPONMLKJIHGFEDCBA";
const ONDE_PROMOCAO = { x: 33, y: 6 };
export function rankDe(st) {
  let n = 0;
  while (n < 25 && st?.npcState?.[`lumiose.za_${LETRAS[n + 1]}`]?.defeated) n++;
  return n;
}
const NOMES_ZA = ["JULIETTE", "PIERRE", "AMELIE", "LUC", "CAMILLE", "HUGO", "CHLOE", "THEO", "MANON", "LEO",
  "INES", "JULES", "ZOE", "LOUIS", "EMMA", "GABRIEL", "LEA", "ARTHUR", "ROSE", "PAUL", "ALICE", "VICTOR",
  "CLARA", "NOAH"];
const SPRITES_ZA = ["garota", "garoto", "lutador", "cientista", "montanhista", "cacador", "maniaco", "gentleman", "motoqueiro"];
/** os bichos de cada faixa de rank (os primeiros ranks são da ZONA 1, os
 *  últimos, dos dragões) */
const TIMES_ZA = [
  "fletchling litleo pancham espurr skiddo helioptile flabb bunnelby",
  "fletchinder pyroar meowstic gogoat heliolisk floette doublade malamar",
  "talonflame pangoro aromatisse slurpuff barbaracle dragalge clawitzer trevenant",
  "aegislash goodra noivern florges hawlucha tyrantrum aurorus avalugg",
].map((l) => l.split(" "));
function timeDoRank(k) {
  const lvl = Math.round(8 + k * 2.6);
  if (k === 25) return ["greninja", "delphox", "chesnaught", "goodra", "aegislash", "garchomp"].map((id) => ({ id, lvl: 72 }));
  const faixa = TIMES_ZA[Math.min(3, Math.floor((k - 1) / 6.5))];
  const quantos = k < 5 ? 2 : k < 15 ? 3 : 4;
  return Array.from({ length: quantos }, (_, i) => ({ id: faixa[(k * 3 + i * 5) % faixa.length], lvl: lvl - (quantos - 1 - i) }));
}
const ZA = {
  juiz: {
    oi: [
      "BEM-VINDO À Z-A ROYALE!",
      "AQUI EM LUMIOSE TODO TREINADOR TEM UM RANK, DO Z AO A. QUEM CHEGA COMEÇA NO Z.",
      "DE NOITE, A ZONA DE BATALHA ACENDE. O ADVERSÁRIO DA SUA PROMOÇÃO VAI ESTAR AQUI ESPERANDO.",
    ],
    pergunta: "ENTRAR NA Z-A ROYALE?",
    opcoes: ["ENTRAR!", "AGORA NÃO"],
    entrou: ["TOMA O SEU CARTÃO: RANK Z. BOA SORTE! E VOLTA DE NOITE."],
    depois: "TUDO BEM. A ROYALE NÃO FOGE.",
    status: (r) => r >= 25
      ? ["VOCÊ É RANK A. O TOPO DA Z-A ROYALE!", "AGORA LUMIOSE INTEIRA SABE O SEU NOME."]
      : [`O SEU RANK: ${LETRAS[r]}.`, `A PROMOÇÃO PRO RANK ${LETRAS[r + 1]} É DE NOITE, AQUI NA ZONA DE BATALHA.`],
  },
};
function falarJuiz(cena) {
  const st = cena.st, J = ZA.juiz;
  if (st.flags.zaInscrito) return void cena.dlg.say(J.status(rankDe(st)));
  cena.dlg.say(J.oi, () => cena.dlg.ask(J.pergunta, J.opcoes, (i) => {
    if (i !== 0) return void cena.dlg.say(J.depois);
    st.flags.zaInscrito = true;
    cena.game.autosave?.(true);
    cena.dlg.say(J.entrou);
  }));
}
/** os 25 adversários de promoção, um por rank, todos no mesmo lugar */
const PROMOCOES = Array.from({ length: 25 }, (_, i) => {
  const k = i + 1, L = LETRAS[k], campeao = k === 25;
  const nome = campeao ? "DAMIEN, O RANK A" : NOMES_ZA[i % NOMES_ZA.length];
  return {
    id: `za_${L}`, ...ONDE_PROMOCAO, dir: "left", sprite: campeao ? "lutador" : SPRITES_ZA[i % SPRITES_ZA.length], noite: true,
    mostrar: (st) => !!st.flags?.zaInscrito && rankDe(st) === i,
    lines: campeao
      ? ["ENTÃO É VOCÊ QUE SUBIU DO Z ATÉ AQUI.", "EU SOU O RANK A DE LUMIOSE. PRA SER O A, VAI TER QUE ME TIRAR DAQUI."]
      : [`PROMOÇÃO PRO RANK ${L}!`, `${nome}: EU SOU A SUA PROVA. PERDEU, CONTINUA NO ${LETRAS[i]}!`],
    afterLines: [`RANK ${L}. MERECIDO.`],
    trainer: { name: campeao ? "DAMIEN" : nome, prize: 300 + k * 120, sight: 0, party: timeDoRank(k) },
  };
});

// ------------------------------------------------------------ a história
/** AS MEGAS DESCONTROLADAS DE LUMIOSE: uma por bairro, que acordam conforme o
 *  rank sobe (de noite, como as outras — src/data/descontroladas.js). A última
 *  é a MEGA FLOETTE do AZ, HIPER-DESCONTROLADA, na TORRE PRISMA. */
const DESC_LUMIOSE = [
  { id: "pidgeot", to: "megapidgeot", mapa: "lumiose_sul", perto: [24, 10], rank: 5, nivel: 32 },
  { id: "gengar", to: "megagengar", mapa: "lumiose_leste", perto: [24, 10], rank: 10, nivel: 44 },
  { id: "alakazam", to: "megaalakazam", mapa: "lumiose_oeste", perto: [24, 10], rank: 15, nivel: 56 },
  { id: "kangaskhan", to: "megakangaskhan", mapa: "lumiose_norte", perto: [24, 30], rank: 20, nivel: 66 },
];
const BAIRRO_DE = { lumiose_sul: "BAIRRO SUL", lumiose_leste: "BAIRRO LESTE", lumiose_oeste: "BAIRRO OESTE", lumiose_norte: "BAIRRO NORTE" };
const vencida = (st, d) => !!st?.npcState?.[`${d.mapa}.descontrolada_${d.to}`]?.defeated;
const FLOETTE_BOSS = {
  id: "floetteeterna", to: "megafloette", mapa: "lumiose", perto: [23, 12], nivel: 60, hpVezes: 3, furia: 1,   // era 80, 6x e 2: "bombada demais"
  textos: {
    aparece: [
      "A TORRE PRISMA APAGOU DE UMA VEZ... E ACENDEU VERMELHA.",
      "NO ALTO DELA, UMA FLOR ENORME, PRETA E VERMELHA, ABRIU NO AR.",
      "É A FLOETTE DO AZ. ELA MEGA EVOLUIU... E A LUZ DELA NÃO PARA DE CRESCER.",
      "A MEGA FLOETTE ESTÁ HIPER-DESCONTROLADA!",
    ],
    pergunta: "ENFRENTAR A MEGA FLOETTE HIPER-DESCONTROLADA?",
    entra: "A {MON} HIPER-DESCONTROLADA ABRE AS PÉTALAS! LUMIOSE INTEIRA FICA VERMELHA!",
    furia: "A LUZ DA FLOR ETERNA SOBE TUDO DELA!",
    acalmou: [
      "A LUZ VERMELHA SE FECHA DE VOLTA NA FLOR.",
      "A FLOETTE ETERNA VOLTOU AO NORMAL. ELA FLUTUA DEVAGAR ATÉ O CHÃO, CANSADA.",
      "A TORRE PRISMA ACENDE DE NOVO, DAS CORES DE SEMPRE.",
    ],
  },
};
const tudoPronto = (st) => rankDe(st) >= 25 && DESC_LUMIOSE.every((d) => vencida(st, d));
FLOETTE_BOSS.mostrar = tudoPronto;
for (const d of DESC_LUMIOSE) d.mostrar = (st) => !!st.flags?.zaInscrito && rankDe(st) >= d.rank;

/** O AZ: o homem alto do lado da TORRE PRISMA. Ele conta da FLOETTE, e no fim
 *  ela vai com você. */
const AZ = {
  antes: [
    "AZ: ...VOCÊ TAMBÉM SENTE? A TORRE PRISMA ESTÁ COM A LUZ ERRADA.",
    "AZ: A MINHA FLOETTE TEM UMA FLOR QUE NUNCA MURCHA. FAZ MUITO, MUITO TEMPO QUE ELA ESTÁ COMIGO.",
    "AZ: AS MEGAS DESCONTROLADAS DOS BAIRROS... TODA VEZ QUE UMA ACORDA, A FLOR DELA TREME.",
    "AZ: SOBE NA Z-A ROYALE. QUANDO VOCÊ CHEGAR NO A, EU VOU PRECISAR DE VOCÊ.",
  ],
  pronto: [
    "AZ: CHEGOU A HORA. A FLOETTE SUBIU NA TORRE E NÃO QUER DESCER.",
    "AZ: ESPERA A NOITE. QUANDO A TORRE FICAR VERMELHA... POR FAVOR, SALVA ELA.",
  ],
  depois: [
    "AZ: VOCÊ CONSEGUIU. ELA ESTÁ BEM.",
    "AZ: ...OLHA SÓ. ELA ESTÁ FLUTUANDO PERTO DE VOCÊ, E NÃO DE MIM.",
    "AZ: EU JÁ VIVI TEMPO DEMAIS. ELA MERECE UM TREINADOR QUE ESTÁ COMEÇANDO A JORNADA.",
    "AZ: LEVA ELA. E A PEDRA TAMBÉM: COM A FLOETTITA, ELA MEGA EVOLUI DO JEITO CERTO, COM VOCÊ.",
  ],
  ganhou: "VOCÊ RECEBEU A FLOETTE ETERNA!",
  semVaga: "AZ: A SUA EQUIPE E O SEU PC ESTÃO CHEIOS. ABRE UM ESPAÇO PRA ELA E VOLTA AQUI.",
  fim: ["AZ: CUIDA BEM DELA. E DE LUMIOSE TAMBÉM, RANK A."],
};
function falarAZ(cena) {
  const st = cena.st;
  const venceu = !!st.npcState?.["lumiose.descontrolada_megafloette"]?.defeated;
  if (!venceu) return void cena.dlg.say(tudoPronto(st) ? AZ.pronto : AZ.antes);
  if (st.flags.zaFloette) return void cena.dlg.say(AZ.fim);
  // mon.js e box.js na hora (importados em cima, eles fechariam um laço com
  // src/data/index.js, que ainda está montando o DB quando lê este arquivo)
  cena.dlg.say(AZ.depois, () => Promise.all([import("../systems/mon.js"), import("../systems/box.js")]).then(([M, B]) => {
    if (st.party.length >= 6 && B.cheio(st)) return void cena.dlg.say(AZ.semVaga);
    const mon = M.createMon("floetteeterna", 70);
    if (st.party.length < 6) st.party.push(mon);
    else B.guardar(st, mon);
    st.flags.zaFloette = true;
    st.seen.floetteeterna = st.caught.floetteeterna = true;
    st.items.floettita = Math.max(1, st.items.floettita || 0);
    cena.game.autosave?.(true);
    cena.dlg.say([AZ.ganhou, ...AZ.fim]);
  }));
}

/** O OBJETIVO em Kalos (src/systems/objetivo.js `DB.OBJETIVO_KALOS`) */
export function objetivoKalos(st) {
  const f = st.flags || {};
  if (!f.zaInscrito) return "FALE COM O JUIZ DA Z-A ROYALE, NA ZONA DE BATALHA (EM CIMA, À DIREITA DA TORRE PRISMA).";
  const r = rankDe(st);
  const acordada = DESC_LUMIOSE.find((d) => r >= d.rank && !vencida(st, d));
  if (acordada) return `UMA MEGA ${DB_NOME(acordada.id)} DESCONTROLADA ACORDOU NO ${BAIRRO_DE[acordada.mapa]}! (SÓ DE NOITE)`;
  if (r < 25) return `RANK ${LETRAS[r]}. DE NOITE, VENÇA A PROMOÇÃO PRO RANK ${LETRAS[r + 1]} NA ZONA DE BATALHA.`;
  if (!st.npcState?.["lumiose.descontrolada_megafloette"]?.defeated) return "RANK A! DE NOITE, VÁ À TORRE PRISMA: A FLOETTE DO AZ ESTÁ LÁ EM CIMA.";
  if (!f.zaFloette) return "FALE COM O AZ, DO LADO DA TORRE PRISMA.";
  return null;
}
const DB_NOME = (id) => id.toUpperCase();

/** os NPCs da história e da ROYALE no CENTRO */
const NPCS_ROYALE = [
  { id: "za_juiz", x: 31, y: 5, dir: "down", sprite: "tecnico", aoFalar: falarJuiz, lines: [] },
  { id: "az", x: 26, y: 19, dir: "down", sprite: "az", aoFalar: falarAZ, lines: [] },   // sprite: tools/az/sprite_az.py
  ...PROMOCOES,
];

/** A FLOETTE ETERNA e a MEGA FLOETTE (sprites oficiais da PokeAPI, 10061 e
 *  10296: tools/fetch_sprites.py --only 10061,10296), e o golpe dela. */
export const KALOS_ESPECIES = {
  floetteeterna: {
    id: "floetteeterna", dex: 670, name: "FLOETTE ETERNA", types: ["FADA"], spriteDex: 10061, foreign: true,
    formaDe: "floette", learnsetDe: "floette", learnsetExtra: [[1, "luzdaruina"]],
    base: { hp: 74, atk: 65, def: 67, spa: 125, spd: 128, spe: 92 }, bst: 551, catchRate: 3, xpYield: 243,
    dexText: "A FLOR DELA NUNCA MURCHA. DIZEM QUE FOI DE UM HOMEM MUITO ALTO, HÁ MUITO, MUITO TEMPO.",
  },
  megafloette: {
    id: "megafloette", dex: 670, name: "MEGA FLOETTE", types: ["FADA"], spriteDex: 10296, foreign: true,
    mega: true, megaDe: "floetteeterna", learnsetDe: "floette", learnsetExtra: [[1, "luzdaruina"]],
    base: { hp: 74, atk: 85, def: 87, spa: 155, spd: 148, spe: 102 }, bst: 651, catchRate: 3, xpYield: 300,
    dexText: "A FLOR ETERNA ABRIU INTEIRA. A LUZ QUE ELA SOLTA PODE ACENDER UMA CIDADE... OU APAGAR.",
  },
};
export const KALOS_GOLPES = {
  luzdaruina: { name: "LUZ DA RUÍNA", type: "FADA", power: 140, acc: 90, pp: 5, category: "especial" },
};
export const KALOS_LORE = {
  floettita: "UMA PEDRA MEGA COM UMA FLOR VERMELHA DENTRO. SÓ A FLOETTE ETERNA SABE O QUE FAZER COM ELA.",
  "cartão z-a": "O CARTÃO DA Z-A ROYALE. O RANK MUDA SOZINHO NELE.",
};

export const KALOS_CONTEUDO = {
  lumiose: {
    name: "LUMIOSE", music: "lumioseCidade",
    encounters: [],          // montado embaixo, por zona (só com o que existe no DB)
    zonas: ZONAS,
    spawn: { x: 23, y: 34, dir: "down" },
    placas: {
      1: "HOTEL Z\nA BASE DE QUEM VEIO PRA LUMIOSE BATALHAR.",
      2: "ZONA DE BATALHA\nDE NOITE, A Z-A ROYALE COMEÇA AQUI.",
      3: "TORRE PRISMA\nO CORAÇÃO DE LUMIOSE. ACENDE TODA NOITE.",
      4: "AEROPORTO DE LUMIOSE\nVOOS PRA KANTO E BRAGLITCH.",
      5: placaDaZona(3), 6: placaDaZona(4), 7: placaDaZona(1), 8: placaDaZona(2),
    },
    npcs: [
      { id: "guia", x: 25, y: 35, dir: "left", sprite: "garota",
        lines: [
          "BONJOUR! BEM-VINDO A LUMIOSE!",
          "OS QUATRO CERCADOS DOS CANTOS SÃO AS ZONAS SELVAGENS. LÁ DENTRO OS POKÉMON ANDAM SOLTOS!",
          "SÃO VINTE ZONAS! A ZONA 1 É AQUI DO LADO, À ESQUERDA: A MAIS TRANQUILA.",
          "AS OUTRAS FICAM NOS BAIRROS: SUL (5 A 8), LESTE (9 A 12), OESTE (13 A 16) E NORTE (17 A 20), O MAIS FORTE.",
          "A TORRE PRISMA FICA NO MEIO DA CIDADE. E O HOTEL Z, LÁ EM CIMA, É ONDE OS TREINADORES FICAM.",
        ] },
      { id: "cafe", x: 30, y: 23, dir: "down", sprite: "gentleman",
        lines: ["UM CAFÉ, UM CROISSANT E UM POKÉMON SOLTO NA ZONA SELVAGEM. ISSO É LUMIOSE."] },
      ...NPCS_ROYALE,
      { id: "corredor", x: 14, y: 18, dir: "right", sprite: "menino",
        lines: ["EU DOU A VOLTA NA TORRE PRISMA TODA MANHÃ. JÁ SÃO TRÊS VOLTAS. EM DOIS ANOS."] },
    ],
  },
  ...Object.fromEntries(BAIRROS.map((b) => [b.id, {
    name: b.nome, music: "lumioseCidade", encounters: [],
    zonas: b.zonas.map((n, k) => zona(n, CANTOS[k].r)),
    placas: { ...Object.fromEntries(b.zonas.map((n, k) => [k + 1, placaDaZona(n)])),
              5: `${b.nome}\nZONAS SELVAGENS ${b.zonas[0]} A ${b.zonas[3]}.` },
    npcs: [],
  }])),
  lumiose_pokemon_center_1f: {
    name: "CENTRO POKÉMON — LUMIOSE", music: "center", interior: true, encounters: [],
    spawn: { x: 7, y: 8, dir: "up" },
    lockedWarps: { "1,6": "A ESCADA LEVA À SALA DE UNIÃO. ESTÁ FECHADA." },
    npcs: [{ id: "enfermeira", x: 7, y: 2, dir: "down", sprite: "enfermeira", heal: true, tutor: true,
             lines: ["BONJOUR! BEM-VINDO AO CENTRO POKÉMON DE LUMIOSE!", "CURO SEUS POKÉMON E AJUSTO OS GOLPES DELES, SE QUISER."] }],
  },
  lumiose_loja: {
    name: "LOJA — LUMIOSE", music: "mart", interior: true, encounters: [],
    spawn: { x: 4, y: 7, dir: "up" },
    npcs: [{ id: "balconista", x: 2, y: 3, dir: "down", sprite: "balconista",
             lines: ["BONJOUR! TUDO O QUE UM TREINADOR PRECISA PRA ZONA SELVAGEM."], shop: LOJA }],
  },
  lumiose_aeroporto: {
    name: "AEROPORTO DE LUMIOSE", music: "mart", interior: true, encounters: [],
    spawn: { x: 4, y: 7, dir: "up" },
    npcs: [{ id: "balcao_aviao", x: 2, y: 3, dir: "down", sprite: "balconista", aviao: true,
             lines: ["AEROPORTO DE LUMIOSE. PRA ONDE VAI?"] }],
  },
  lumiose_hotel_z: {
    name: "HOTEL Z", music: "casa", interior: true, encounters: [],
    npcs: [{ id: "recepcao", x: 4, y: 4, dir: "down", sprite: "garota", heal: true,
             lines: ["BEM-VINDO AO HOTEL Z! DESCANSA UM POUCO: A SUA EQUIPE FICA NOVINHA."] }],
  },
};

// ------------------------------------------------------------ o avião
/** O AVIÃO: o piloto em Kanto e em Braglitch, o balcão em LUMIOSE. Leva
 *  pra qualquer região que não seja a de onde você está (src/scenes/overworld.js
 *  `pegarAviao`). `x, y` é onde você desce. */
export const AVIAO = {
  // basta ter um Pokémon: a ZONA SELVAGEM 1 é pra quem está começando
  pode: (st) => (st.party || []).some(Boolean),
  destinos: [
    { regiao: "kalos", nome: "LUMIOSE (KALOS)", mapa: "lumiose", x: 23, y: 34, dir: "down" },
    { regiao: "kanto", nome: "VERMILION (KANTO)", mapa: "vermilion_city", x: 18, y: 9, dir: "down" },
    { regiao: "braglitch", nome: "SÃO LUCARIO (BRAGLITCH)", mapa: "sao_lucario" },   // x, y: `porAeroportos`
  ],
  pergunta: "PRA ONDE VOCÊ QUER VOAR?",
  fechado: ["VIAJAR SEM NENHUM POKÉMON? NEM PENSAR! PEGA O SEU PRIMEIRO E VOLTA AQUI."],
  indo: (nome) => [`APERTEM OS CINTOS! DESTINO: ${nome}.`],
  chegou: (nome) => [`(O AVIÃO POUSOU. BEM-VINDO A ${nome}!)`],
  piloto: ["EU SOU PILOTO DA LINHA KANTO-BRAGLITCH-KALOS.", "O AVIÃO TÁ PRONTO. QUER VOAR?"],
};

/** O piloto em Kanto e em Braglitch: do lado do Centro Pokémon. Chamado no fim
 *  do `buildDB` (src/data/index.js), com os mapas já montados. */
export function porAeroportos(db) {
  const piloto = (x, y) => ({ id: "piloto_aviao", x, y, dir: "down", sprite: "gentleman", aviao: true, lines: AVIAO.piloto });
  // KANTO: VERMILION, na praça do Centro (a porta dele é em 15,6)
  const verm = db.MAPS.vermilion_city;
  if (verm) verm.npcs = [...(verm.npcs || []).filter((n) => n.id !== "piloto_aviao"), piloto(18, 8)];
  // BRAGLITCH: SÃO LUCARIO, o chão livre mais perto da porta do Centro
  const geo = db.KANTO.sao_lucario, sl = db.MAPS.sao_lucario;
  if (geo && sl) {
    const porta = geo.warps.find((w) => w.predio === "C") || geo.warps[0];
    const livre = chaoLivre(geo, porta.x + 3, porta.y + 1, sl.npcs || []);
    sl.npcs = [...(sl.npcs || []).filter((n) => n.id !== "piloto_aviao"), piloto(livre.x, livre.y)];
    const d = AVIAO.destinos.find((x) => x.regiao === "braglitch");
    Object.assign(d, { x: livre.x, y: livre.y + 1, dir: "down" });
  }
  // A HISTÓRIA: as megas descontroladas da LUMIOSE (e a MEGA FLOETTE), a pedra
  // da FLOETTE ETERNA e o objetivo de Kalos
  db.DESCONTROLADAS = { ...db.DESCONTROLADAS,
    lista: [...(db.DESCONTROLADAS?.lista || []).filter((d) => !d.mapa?.startsWith("lumiose")), ...DESC_LUMIOSE, FLOETTE_BOSS] };
  db.MEGAS = { ...db.MEGAS, floetteeterna: [{ pedra: "floettita", to: "megafloette", nome: "MEGA FLOETTE" }] };
  if (db.MEGA_PEDRAS) db.MEGA_PEDRAS.floettita = "megafloette";
  db.OBJETIVO_KALOS = objetivoKalos;
  // LUMIOSE: o mato de cada zona, só com quem existe (a primeira zona do mapa
  // vale pro mato que não estiver em zona nenhuma)
  for (const id of ["lumiose", ...BAIRROS.map((b) => b.id)]) {
    const m = db.MAPS[id];
    if (!m?.zonas) continue;
    m.zonas = m.zonas.map((z) => ({ ...z, encounters: z.lista.filter(([e]) => db.SPECIES[e])
      .map(([e, w]) => ({ id: e, min: z.niveis[0], max: z.niveis[1], w })) }));
    m.encounters = m.zonas[0].encounters;
  }
}

/** O chão livre (tag 0) mais perto de (x0, y0), sem NPC em cima e com chão embaixo. */
function chaoLivre(geo, x0, y0, npcs) {
  const ocupado = new Set(npcs.map((n) => `${n.x},${n.y}`));
  const livre = (x, y) => x >= 0 && y >= 0 && x < geo.w && y + 1 < geo.h && geo.tags[y * geo.w + x] === "0"
    && geo.tags[(y + 1) * geo.w + x] === "0" && !ocupado.has(`${x},${y}`) && !ocupado.has(`${x},${y + 1}`)
    && !geo.warps.some((w) => (w.x === x && (w.y === y || w.y === y + 1)));
  for (let r = 0; r < 12; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) === r && livre(x0 + dx, y0 + dy)) return { x: x0 + dx, y: y0 + dy };
      }
    }
  }
  return { x: x0, y: y0 };
}
