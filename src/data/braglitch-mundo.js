// BRAGLITCH, DA MATA DO SACI PRA CIMA: oito cidades, oito ginásios, oito
// estradas e as lendas. (As ILHAS da PROFA. IPÊ correm junto: os chefes -BRAG
// e as formas moram lá, src/data/braglitch-ilhas.js.)
//
// O caminho é um só, subindo o mapa: SÃO LUCARIO → BR-101 → MATA DO SACI →
// MATA ATLÂNTICA → BELÉM DO PARASECT → ... → BASCULINHA, a capital, onde o
// APAGÃO começou. Cada cidade é um trocadilho com uma cidade de verdade (como
// SÃO LUCARIO DO SUL já era), e cada ginásio é de um tipo que tem a ver com o
// lugar: PLANTA na Amazônia, ÁGUA no mangue, LUTADOR na roda de capoeira...
//
// AS CIDADES usam duas plantas-molde (A e B, abaixo), com um marco próprio no
// lugar do X (coreto, igrejinha, lagoa, canteiro). AS ESTRADAS são geradas por
// semente: borda de mata, um caminho de terra serpenteando do sul pro norte,
// manchas de mato alto e uma lagoa ou outra — sempre o mesmo desenho pra mesma
// semente, e com o caminho garantido de uma ponta à outra.
//
// AS INSÍGNIAS DE BRAGLITCH moram à parte das de Kanto (`st.bragBadges`): a
// história de Kanto conta as oito dela (o professor, o AZUL, o final), e uma
// insígnia de Recife não pode fazer o CARVALHO achar que você venceu a MISTY.

// OS LUGARES NOVOS do mapa do Brasil (o formato está em dev/LUGARES.md): cidades
// sem ginásio, praias e rotas, cada região no seu arquivo
import { LUGARES as SUL } from "./braglitch-sul.js";
import { LUGARES as NORTE } from "./braglitch-norte.js";
import { LUGARES as CENTRO } from "./braglitch-centro.js";
import { LUGARES as LIGA } from "./braglitch-liga.js";
// AS CINCO ILHAS da história (src/data/braglitch-ilhas.js): só se chega na lancha da IPÊ
import { LUGARES as ILHAS, ILHAS as ILHAS_DA_HISTORIA } from "./braglitch-ilhas.js";
export const LUGARES_NOVOS = [...SUL, ...NORTE, ...CENTRO, ...ILHAS, ...LIGA];

// ------------------------------------------------------- as plantas-molde
const MOLDE_A = [
  "##############PP##############",
  "#F...........,PP,..........F.#",
  "#..hhhh.......PP.....GGGGGG..#",
  "#..hhhh.......PP.....GGGGGG..#",
  "#..hhhh.......PP.....GGGGGG..#",
  "#...D....1....PP.....GGGGGG..#",
  "#...PPPPPPPPPPPPPPPP2PPDPPP..#",
  "#.............PP.............#",
  "#.CCCCC..FF...PP....MMMM.hhhh#",
  "#.CCCCC..FF...PP....MMMM.hhhh#",
  "#.CCCCC.......PP....MMMM.hhhh#",
  "#...D.........PP.....D....D..#",
  "#...PPPPPPPPPPPPPPPPPPPPPPP..#",
  "#.............PP.............#",
  "#..XXXX..FFFF.PP.FFFF..YY....#",
  "#..XXXX..FFFF.PP.FFFF........#",
  "#.............PP.........YY..#",
  "##############PP##############",
];
const MOLDE_B = [
  "##############PP##############",
  "#..GGGGGG.....PP.....hhhh...F#",
  "#..GGGGGG.....PP.....hhhh....#",
  "#..GGGGGG.....PP.....hhhh....#",
  "#..GGGGGG.....PP..2...D......#",
  "#....D.....1..PP....PPPP.....#",
  "#....PPPPPPPPPPPPPPPP........#",
  "#.............PP.............#",
  "#.MMMM...XXXX.PP..CCCCC..hhhh#",
  "#.MMMM...XXXX.PP..CCCCC..hhhh#",
  "#.MMMM...XXXX.PP..CCCCC..hhhh#",
  "#..D..........PP....D.....D..#",
  "#..PPPPPPPPPPPPPPPPPPPPPPPP..#",
  "#.............PP.............#",
  "#.hhhh...FF...PP...FF..YY....#",
  "#.hhhh...FF...PP...FF........#",
  "#.hhhh........PP.........YY..#",
  "#..D..........PP.............#",
  "#..PPPPPPPPPPPPP.............#",
  "##############PP##############",
];

/** A PRAÇA DO ARCEUS REDENTOR, que RIO DE JANEEVEE ganha no pé da cidade: a base de
 *  pedra de 10x5 tiles (a letra A, que o pintor de src/core/assets.js desenha
 *  inteira) e, em cima dela, o ARCEUS de pedra branca com NOVE blocos de altura
 *  (assets/sprites/estatuas/arceus_redentor.png, desenhado por cima de tudo
 *  como um objeto em pé — ver `drawEstatua` em src/scenes/overworld.js). As
 *  sete fileiras livres de cima são o céu dele: a figura sobe por elas, e quem
 *  anda ali passa por TRÁS da estátua. Canteiros dos lados e a placa 3 na
 *  frente. Entra antes da última fileira (a saída de baixo). */
const PRACA_DO_REDENTOR = [
  "#.............PP.............#",
  "#.............PP.............#",
  "#.............PP.FF........FF#",
  "#.............PP.............#",
  "#.............PP.............#",
  "#.............PP.............#",
  "#.............PP.............#",
  "#.............PP.AAAAAAAAAA..#",
  "#.............PP.AAAAAAAAAA..#",
  "#.............PP.AAAAAAAAAA..#",
  "#.............PP.AAAAAAAAAA..#",
  "#.............PP.AAAAAAAAAA..#",
  "#.............PPPPPPP3.......#",
  "#.............PP.FF........FF#",
];

/** Monta a planta de uma cidade: o molde, o marco no lugar do X, e a saída de
 *  cima fechada na última (não tem nada depois da capital). */
function plantaDaCidade(c) {
  const molde = c.molde === "B" ? MOLDE_B : MOLDE_A;
  const linhas = molde.map((l, y) => {
    let linha = l.replace(/X/g, c.marco || "F");
    if (y === 0 && c.ultima) linha = "#".repeat(linha.length);
    return linha;
  });
  if (c.estatua) linhas.splice(linhas.length - 1, 0, ...PRACA_DO_REDENTOR);
  return linhas;
}

// ------------------------------------------------------ as estradas geradas
function hash2(x, y, seed) {
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(seed, 2654435761)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function blob(x, y, seed, escala) {
  const gx = Math.floor(x / escala), gy = Math.floor(y / escala);
  let v = 0;
  for (let dx = 0; dx <= 1; dx++) for (let dy = 0; dy <= 1; dy++) v += hash2(gx + dx, gy + dy, seed);
  return v / 4;
}

/** Uma estrada de 30 de largura: entra embaixo em x=14-15, sai em cima em
 *  x=14-15. O caminho anda em trechos (sobe, vira, sobe), e o resto é mato
 *  alto, árvore, pedra e às vezes uma lagoa — nunca em cima do caminho. */
function plantaDaEstrada(e) {
  // a rota DEITADA (corre de leste a oeste) é a de pé, virada de lado
  if (e.deitada) {
    const emPe = plantaDaEstrada({ ...e, deitada: false });
    return emPe[0].split("").map((_, x) => emPe.map((l) => l[x]).join(""));
  }
  const W = 30, H = e.altura || 30, seed = e.semente;
  const g = Array.from({ length: H }, () => Array(W).fill("."));
  const caminho = new Set();
  const pisa = (x, y) => { g[y][x] = "P"; caminho.add(`${x},${y}`); };
  // o caminho: de baixo pra cima, virando de lado a cada trecho
  let x = 14, y = H - 1;
  pisa(14, y); pisa(15, y);
  let k = 0;
  while (y > 3) {
    const sobe = 3 + Math.floor(hash2(k, 1, seed) * 4);
    for (let i = 0; i < sobe && y > 3; i++) { y--; pisa(x, y); }
    const alvo = 5 + Math.floor(hash2(k, 2, seed) * 20);
    const passo = alvo > x ? 1 : -1;
    while (x !== alvo && y > 3) { x += passo; pisa(x, y); }
    k++;
  }
  // volta pro meio e sai por cima
  const passo = 14 > x ? 1 : -1;
  while (x !== 14) { x += passo; pisa(x, y); }
  while (y > 0) { y--; pisa(14, y); pisa(15, y); }
  const pertoDoCaminho = (cx, cy) => {
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (caminho.has(`${cx + dx},${cy + dy}`)) return true;
    return false;
  };
  const tema = e.tema || "mata";
  for (let cy = 0; cy < H; cy++) {
    for (let cx = 0; cx < W; cx++) {
      if (g[cy][cx] === "P") continue;
      // a borda: mata fechada, mais grossa em uns trechos que em outros
      const borda = Math.min(cx, W - 1 - cx) < 2 + Math.floor(blob(cx, cy, seed + 5, 4) * 3)
        || cy === 0 || cy === H - 1;
      if (borda) { g[cy][cx] = "#"; continue; }
      if (pertoDoCaminho(cx, cy)) continue;
      if (e.lagoa && blob(cx, cy, seed + 13, 4) > 0.72) { g[cy][cx] = "~"; continue; }
      const arvore = blob(cx, cy, seed + 77, 3) > (tema === "sertao" ? 0.8 : e.fim ? 0.6 : 0.7);
      if (arvore) { g[cy][cx] = tema === "litoral" ? "Y" : "#"; continue; }
      if (hash2(cx, cy, seed + 3) < 0.025) { g[cy][cx] = "o"; continue; }
      if (blob(cx, cy, seed + 31, 2.5) > 0.56) g[cy][cx] = ",";
    }
  }
  // a placa na entrada de baixo, do lado do caminho
  for (const px of [16, 13, 17, 12]) {
    if (g[H - 3][px] !== "P" && !pertoDoCaminho(px, H - 3) || g[H - 3][px] === ".") {
      if (g[H - 3][px] !== "P") { g[H - 3][px] = "1"; break; }
    }
  }
  // o FIM do mundo (a floresta): nada sai por cima
  if (e.fim) g[0] = Array(W).fill("#");
  return g.map((l) => l.join(""));
}

/** Um tile de chão livre perto de (x0,y0), fora do caminho. */
function chaoPerto(planta, x0, y0, evita = new Set()) {
  for (let r = 0; r < 12; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        const x = x0 + dx, y = y0 + dy;
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        if (planta[y]?.[x] === "." && !evita.has(`${x},${y}`)) return { x, y };
      }
    }
  }
  return { x: x0, y: y0 };
}

/** Onde os treinadores da estrada ficam: do lado do caminho, olhando pra ele,
 *  em alturas espalhadas. */
function lugaresDeTreinador(planta, quantos) {
  const H = planta.length, out = [], usados = new Set();
  for (let i = 0; i < quantos; i++) {
    const y = Math.round(H * (0.25 + (0.5 * i) / Math.max(1, quantos - 1)));
    const xs = [...planta[y]].map((c, x) => (c === "P" ? x : -1)).filter((x) => x >= 0);
    if (!xs.length) continue;
    const xp = xs[Math.floor(xs.length / 2)];
    for (const [dx, dir] of [[2, "left"], [-2, "right"], [3, "left"], [-3, "right"]]) {
      const x = xp + dx;
      if (planta[y][x] === "." && !usados.has(`${x},${y}`)) {
        out.push({ x, y, dir });
        usados.add(`${x},${y}`);
        break;
      }
    }
  }
  return out;
}

// --------------------------------------------------- as cidades e ginásios
// `ginasio`: qual interior de Kanto a sala do ginásio copia (só os três sem
// quebra-cabeça: pedra de Pewter, piscina de Cerulean, jardim de Celadon).
// Os ginásios VOLTARAM (out/2026) depois de um tempo só com as ilhas: as duas
// coisas existem juntas, cada uma com as insígnias dela.
export const CIDADES = [
  {
    id: "belem", nome: "BELÉM DO PARASECT", molde: "A", marco: "~", musica: "saolucario",
    tipo: "PLANTA", ginasio: "celadon_city_gym",
    lider: { nome: "JACIRA", sprite: "superf", titulo: "A GUARDIÃ DA MATA",
             fala: ["EU SOU JACIRA. CRESCI ENTRE SAMAÚMA E IGARAPÉ.", "AQUI A MATA LUTA JUNTO COMIGO. VAMOS VER SE VOCÊ AGUENTA A FLORESTA INTEIRA!"],
             depois: ["A MATA RESPEITA QUEM A ENFRENTA COM HONESTIDADE. LEVA A INSÍGNIA."],
             time: [["sauvinha", 12], ["acaizinho", 12], ["guaraninho", 14]] },
    insignia: { id: "samauma", nome: "INSÍGNIA SAMAÚMA" },
    treinadores: [["MATEIRA CIDA", "garota", [["sauvinha", 10], ["acaizinho", 11]]],
                  ["EXTRATIVISTA ZECA", "garoto", [["vitoriregia", 12]]]],
    placa: "BELÉM DO PARASECT — A PORTA DA AMAZÔNIA.\nPROVE O AÇAÍ. COM FARINHA.",
    povo: [
      ["velha", ["NO MERCADO DO VER-O-PESO TEM ERVA PRA TUDO.", "TEM ATÉ ERVA PRA ACHAR FORMA -BRAG. NÃO FUNCIONA: TEM QUE IR NAS ILHAS."]],
      ["pescador", ["DEPOIS DO APAGÃO, O RIO SUBIU SEM CHOVER.", "MINHA AVÓ DIZ QUE É A MATA RESPIRANDO. EU DIGO QUE É GLITCH."]],
    ],
  },
  {
    id: "recife", nome: "RECIFEEBAS", molde: "B", marco: "~", musica: "saolucario",
    tipo: "ÁGUA", ginasio: "cerulean_city_gym",
    lider: { nome: "CHICO MANGUE", sprite: "pescador", titulo: "O CARANGUEJO COM CÉREBRO",
             fala: ["EU SOU CHICO MANGUE. DA LAMA AO CAOS, DO CAOS À LAMA.", "MEUS POKÉMON SAEM DO MANGUE PRO MUNDO. BORA!"],
             depois: ["TU TEM SUINGUE. A INSÍGNIA É TUA, MAS O MANGUE CONTINUA MEU."],
             time: [["caranguejinho", 17], ["piranhita", 18], ["botinho", 20]] },
    insignia: { id: "mangue", nome: "INSÍGNIA MANGUE" },
    treinadores: [["NADADORA LIA", "garota", [["botinho", 16], ["piranhita", 16]]],
                  ["PESCADOR BIU", "pescador", [["caranguejinho", 17]]]],
    placa: "RECIFEEBAS — VENEZA BRASILEIRA.\nCUIDADO: TUBARÃO NA PRAIA, FEEBAS NO RIO.",
    povo: [
      ["garoto", ["TEM GENTE AQUI QUE FAZ SOM COM ANTENA ENFIADA NA LAMA.", "O CARANGUEJO PEGA RÁDIO DE PORTUGAL."]],
      ["velho", ["NO CARNAVAL O FREVO NÃO PARA NEM NO APAGÃO.", "A GENTE DANÇOU NO ESCURO. FOI O MELHOR ANO."]],
    ],
  },
  {
    id: "salvador", nome: "SALVADITTO", molde: "A", marco: "I", musica: "saolucario",
    tipo: "LUTADOR", ginasio: "pewter_city_gym",
    lider: { nome: "MESTRE GINGA", sprite: "lutador", titulo: "O MESTRE DA RODA",
             fala: ["IÊ! EU SOU MESTRE GINGA.", "CAPOEIRA É LUTA QUE PARECE DANÇA — E DANÇA QUE DERRUBA. ENTRA NA RODA!"],
             depois: ["CAMARADA, TU TEM GINGA. VOLTA QUANDO QUISER JOGAR."],
             time: [["macacoeira", 22], ["lobisomem", 23], ["gingao", 26]] },
    insignia: { id: "berimbau", nome: "INSÍGNIA BERIMBAU" },
    treinadores: [["CAPOEIRISTA DENDÊ", "lutador", [["macacoeira", 21], ["macacoeira", 21]]]],
    placa: "SALVADITTO — A PRIMEIRA CAPITAL.\nLADEIRAS, ACARAJÉ E UM DITTO EM CADA ESQUINA.",
    povo: [
      ["garota", ["O ACARAJÉ QUENTE OU FRIO? AQUI \"QUENTE\" QUER DIZER PIMENTA.", "O \"FRIO\" TAMBÉM TEM PIMENTA."]],
      ["gentleman", ["NO PELOURINHO OS CASARÕES TÊM CADA UM UMA COR.", "DEPOIS DO APAGÃO DOIS TROCARAM DE COR SOZINHOS."]],
    ],
  },
  {
    id: "caruaru", nome: "CARUARU DO MAGMAR", molde: "B", marco: "K", musica: "br101",
    tipo: "FOGO", ginasio: "celadon_city_gym",
    lider: { nome: "ZEFA DA FOGUEIRA", sprite: "tecnica", titulo: "A RAINHA DO ARRAIÁ",
             fala: ["OXE! EU SOU ZEFA, E AQUI TODO DIA É SÃO JOÃO.", "OLHA A COBRA! É MENTIRA! OLHA O FOGO! ESSE É VERDADE!"],
             depois: ["ANARRIÊ! PODE LEVAR A INSÍGNIA, E UM PEDAÇO DE PAMONHA."],
             time: [["balaozinho", 27], ["mandacaru", 28], ["fogueirinha", 28], ["fogueirao", 31]] },
    insignia: { id: "fogueira", nome: "INSÍGNIA FOGUEIRA" },
    treinadores: [["SANFONEIRO LUIZ", "gentleman", [["fogueirinha", 26], ["balaozinho", 26]]],
                  ["QUADRILHEIRA NINA", "garota", [["mandacaru", 27]]]],
    placa: "CARUARU DO MAGMAR — CAPITAL DO FORRÓ.\nO SÃO JOÃO AQUI DURA O ANO INTEIRO.",
    povo: [
      ["velho", ["O MANDACARU FLOROU ONTEM. VAI CHOVER NO SERTÃO.", "OU O APAGÃO DESREGULOU A PLANTA. UM DOS DOIS."]],
      ["menina", ["A ZEFA SOLTA BALÃO DENTRO DE CASA.", "É PROIBIDO LÁ FORA. DENTRO, NINGUÉM FALOU NADA."]],
    ],
  },
  {
    id: "sampa", nome: "SAMPIKACHU", molde: "A", marco: "F", musica: "br101",
    tipo: "ELÉTRICO", ginasio: "pewter_city_gym",
    lider: { nome: "GAMBI", sprite: "tecnico", titulo: "O ELETRICISTA DA GAMBIARRA",
             fala: ["EU SOU O GAMBI. CONSERTO QUALQUER COISA COM FITA ISOLANTE E FÉ.", "FOI UM CURTO NA MINHA OFICINA QUE... NÃO, ESQUECE. BORA LUTAR!"],
             depois: ["TÁ BOM, TÁ BOM, FUI EU QUE PUXEI O GATO DO POSTE. MAS O APAGÃO NÃO FOI SÓ ISSO — FOI LÁ EM CIMA, NA CAPITAL."],
             time: [["gatonet", 32], ["orelhao", 33], ["araraio", 34], ["gambiarra", 36]] },
    insignia: { id: "tomada", nome: "INSÍGNIA TOMADA" },
    treinadores: [["MOTOBOY RAFA", "motoqueiro", [["gatonet", 31], ["araraio", 31]]],
                  ["TÉCNICA SUELI", "tecnica", [["orelhao", 32]]]],
    placa: "SAMPIKACHU — A CIDADE QUE NÃO DORME.\n(DESDE O APAGÃO, NÃO DORME E NÃO TEM LUZ.)",
    povo: [
      ["garoto", ["AQUI TEM TRÂNSITO ATÉ NA CALÇADA.", "O PIKACHU DO MEU PRIMO ANDA DE METRÔ SOZINHO."]],
      ["tecnica", ["TODO ORELHÃO DA CIDADE TOCOU AO MESMO TEMPO NO DIA DO APAGÃO.", "QUEM ATENDEU OUVIU UM ASSOBIO."]],
    ],
  },
  {
    id: "ouropreto", nome: "OURO GASTLY", molde: "B", marco: "I", musica: "saolucario",
    tipo: "FANTASMA", ginasio: "cerulean_city_gym",
    lider: { nome: "LUZIA DAS ALMAS", sprite: "velha", titulo: "A CONTADORA DE CAUSOS",
             fala: ["BOA NOITE, MEU FILHO. EU SOU LUZIA.", "CADA CASARÃO DESTA CIDADE TEM UMA ALMA, E CADA ALMA TEM UM CAUSO. HOJE O CAUSO É VOCÊ."],
             depois: ["UAI... VOCÊ NÃO TEM MEDO DE ASSOMBRAÇÃO. TOMA A INSÍGNIA, E UM PÃO DE QUEIJO."],
             time: [["penadinha", 37], ["lobisomem", 39], ["assombracao", 41]] },
    insignia: { id: "lampiao", nome: "INSÍGNIA LAMPIÃO" },
    treinadores: [["ESTUDANTE TIÃO", "garoto", [["penadinha", 36], ["penadinha", 36]]],
                  ["BEATA DORINHA", "velha", [["assombracao", 38]]]],
    placa: "OURO GASTLY — LADEIRAS DE PEDRA E IGREJAS DE OURO.\nNÃO SUBA A LADEIRA DEPOIS DA MEIA-NOITE.",
    povo: [
      ["velho", ["AQUI TODO MUNDO TEM UM PARENTE QUE VIROU ASSOMBRAÇÃO.", "O MEU VEM TOMAR CAFÉ TODO DOMINGO."]],
      ["garota", ["A DONA LUZIA CONTA CAUSO NA PRAÇA.", "EU FUI OUVIR E ESQUECI DE VOLTAR PRA CASA."]],
      ["menino", ["DE NOITE, NA FERNÃO DIAS, TEM UM CACHORRINHO BRANCO FLUTUANDO COM O NARIZ ACESO.", "ELE NÃO MORDE. SÓ QUER QUE ALGUÉM JOGUE A BOLINHA."]],
    ],
  },
  {
    id: "rio", nome: "RIO DE JANEEVEE", molde: "A", marco: "K", musica: "saolucario",
    // a praça do ARCEUS REDENTOR (ver `plantaDaCidade` e `PRACA_DO_REDENTOR`) —
    // o Cristo fica no Rio, e o Arceus também
    estatua: true,
    placaEstatua: "ARCEUS REDENTOR.\nDE CABEÇA ERGUIDA E COM GLÓRIA NOS OLHOS, ELE OLHA POR RIO DE JANEEVEE DESDE O PRIMEIRO DIA.\nFOI ERGUIDO NA FUNDAÇÃO DA CIDADE, E A CIDADE CRESCEU EM VOLTA DELE.",
    tipo: "FADA", ginasio: "celadon_city_gym",
    lider: { nome: "RAINHA LUA", sprite: "superf", titulo: "A RAINHA DA BATERIA",
             fala: ["EU SOU LUA, RAINHA DA BATERIA DA ESCOLA MAIS BONITA DA AVENIDA!", "AQUI A BATALHA TEM SAMBA-ENREDO. SEGURA O RITMO!"],
             depois: ["NOTA DEZ! NOTA DEZ! A INSÍGNIA É SUA — E O DESFILE TAMBÉM."],
             time: [["brigadeirinho", 42], ["beijaflorzinha", 42], ["encantado", 45]] },
    insignia: { id: "pandeiro", nome: "INSÍGNIA TAMBORIM" },   // o id segue "pandeiro" (saves antigos)
    treinadores: [["PASSISTA JU", "garota", [["beijaflorzinha", 41], ["brigadeirinho", 41]]],
                  ["MESTRE-SALA JORGE", "gentleman", [["plumario", 43]]]],
    placa: "RIO DE JANEEVEE — A CIDADE MARAVILHOSA.\nO EEVEE AQUI EVOLUI PRA TUDO, MENOS PRA TRISTE.",
    povo: [
      ["garota", ["NA PRAIA TEM MATE, BISCOITO DE POLVILHO E UM ENCANTADO DE CHAPÉU.", "ELE DANÇA MELHOR QUE MEU NAMORADO."]],
      ["velho", ["O PÃO DE AÇÚCAR PISCOU NO DIA DO APAGÃO.", "PISCOU MESMO, COM A MONTANHA INTEIRA. EU VI."]],
      ["garoto", ["O LOROSÉ DO PROGRAMA DA MANHÃ FUGIU DO ESTÚDIO.", "DIZEM QUE ELE ESTÁ NA ESTRADA REAL, APRESENTANDO O MATO PROS OUTROS BICHOS."]],
    ],
  },
  {
    // a saída de cima da capital leva à FLORESTA AMAZÔNICA, o fim do mundo lá no norte
    id: "brasilia", nome: "BASCULINHA", molde: "B", marco: "K", musica: "br101",
    tipo: "GLITCH", ginasio: "pewter_city_gym",
    lider: { nome: "ENGENHEIRA NIEMA", sprite: "cientista", titulo: "A ARQUITETA DO SERVIDOR",
             fala: ["EU SOU NIEMA. EU DESENHEI O SERVIDOR CENTRAL DE BRAGLITCH — CURVA POR CURVA.",
                    "O APAGÃO? FOI UM TESTE. EU QUIS VER O QUE A REGIÃO FAZIA SEM A LEITURA CERTA DOS DADOS.",
                    "E A REGIÃO FEZ VOCÊ. VAMOS VER SE VOCÊ É ERRO OU É ATUALIZAÇÃO."],
             depois: ["...ATUALIZAÇÃO. A LEITURA VOLTOU PRO LUGAR.",
                      "MAS NO TESTE EU ACORDEI UMA COISA QUE NÃO DEVIA: O DESTROIUM, A MÁQUINA QUE O SERVIDOR USAVA PRA APAGAR DADO VELHO.",
                      "ELE ESTÁ DORMINDO EMBAIXO DA REGIÃO, E A MATA ESTÁ DE OLHO NELE.",
                      "DIZEM QUE AS LENDAS SÓ ACORDAM PRA QUEM FECHAR AS OITO ILHAS DA PROFA. IPÊ. EU ACREDITO."],
             time: [["chuvisco", 48], ["gambiarra", 49], ["concretao", 50], ["saci", 50]] },
    insignia: { id: "cupula", nome: "INSÍGNIA CÚPULA" },
    treinadores: [["SERVIDOR PÚBLICO RUI", "gentleman", [["chuvisco", 46], ["orelhao", 46]]],
                  ["ESTAGIÁRIA BIA", "tecnica", [["gambiarra", 47]]]],
    placa: "BASCULINHA — A CAPITAL.\nVISTA DE CIMA TEM FORMA DE AVIÃO. OU DE BASCULIN. DEPENDE DE QUEM DESENHOU O MAPA.",
    povo: [
      ["gentleman", ["AQUI TUDO É LONGE E TUDO É CURVO.", "O SERVIDOR CENTRAL FICA AQUI. A LUZ DE BRAGLITCH INTEIRA PASSA POR ELE."]],
      ["garoto", ["DIZEM QUE A ENGENHEIRA NIEMA DERRUBOU A LUZ DE PROPÓSITO.", "MINHA MÃE DIZ QUE É FOFOCA DE CORREDOR."]],
    ],
  },
];

/** A FLORESTA AMAZÔNICA, beeem no norte: depois da capital não tem mais cidade
 *  — tem a maior floresta do mundo. É gerada como as estradas (mesmo pintor,
 *  mesma semente fixa), só que com o dobro da altura, mata mais fechada,
 *  lagoa por todo lado e fechada em cima: é o fim de Braglitch. As duas lendas
 *  daqui moram nela (o AMAZONIUM e, no Encontro das Águas, o ENCONTRIUM). */
export const FLORESTA = {
  id: "floresta_amazonica", nome: "FLORESTA AMAZÔNICA", semente: 2020, tema: "mata", lagoa: true,
  altura: 60, fim: true, niveis: [50, 56],
  mato: [["sauvinha", 12], ["acaizinho", 12], ["guaraninho", 10], ["vitoriregia", 10], ["pirarucu", 10], ["tucanacu", 12],
         ["capivarao", 10], ["macacoeira", 10], ["biquinho", 8], ["piranhorda", 8], ["troncudo", 6], ["paubrasilisco", 2]],
  treinadores: [["RIBEIRINHA NAÍ", "garota", [["pirarucu", 52], ["vitoriregia", 53]]],
                ["SERINGUEIRO CHICO", "montanhista", [["troncudo", 53], ["tucanacu", 53], ["capivarao", 54]]]],
  placa: "FLORESTA AMAZÔNICA.\nDAQUI PRA CIMA NÃO TEM ESTRADA, NÃO TEM LUZ E NÃO TEM FIM.",
};

// As estradas entre uma cidade e a próxima (a primeira sai da MATA DO SACI).
// `tema` muda a cor do chão: mata, sertão, litoral e cerrado.
export const ESTRADAS = [
  // o id segue "transamazonica" (é o nome do mapa no save de quem já passou)
  { id: "transamazonica", nome: "MATA ATLÂNTICA", semente: 101, tema: "mata", lagoa: true, niveis: [9, 14],
    mato: [["sauvinha", 22], ["acaizinho", 18], ["guaraninho", 12], ["capivarinha", 16], ["vitoriregia", 6], ["biquinho", 14], ["bantevy", 10], ["weepinbell", 6], ["rocador", 1]],
    treinadores: [["MATEIRO JOÃO", "garoto", [["sauvinha", 11], ["biquinho", 12]]], ["BOTÂNICA ÉRICA", "tecnica", [["acaizinho", 13]]]] },
  { id: "br232", nome: "BR-232", semente: 232, deitada: true, tema: "litoral", lagoa: true, niveis: [14, 19],
    mato: [["caranguejinho", 18], ["piranhita", 16], ["capivarinha", 14], ["biquinho", 12], ["bantevy", 10], ["tatubola", 12], ["botinho", 6], ["submarinum", 1]],
    treinadores: [["SURFISTA GUGA", "garoto", [["botinho", 16], ["piranhita", 17]]], ["CATADORA DE SIRI", "garota", [["caranguejinho", 18]]]] },
  { id: "br101n", nome: "BR-101 NORTE", semente: 1012, tema: "litoral", niveis: [19, 24],
    mato: [["macacoeira", 18], ["tatubola", 14], ["beijaflorzinha", 12], ["caranguejinho", 12], ["piranhita", 10], ["biquinho", 10]],
    treinadores: [["CAPOEIRISTA NENEM", "lutador", [["macacoeira", 21]]], ["BAIANA DO ACARAJÉ", "velha", [["beijaflorzinha", 20], ["tatubola", 21]]]] },
  { id: "br324", nome: "BR-324", semente: 324, deitada: true, tema: "sertao", niveis: [23, 28],
    mato: [["fogueirinha", 18], ["balaozinho", 14], ["mandacaru", 14], ["tatubola", 12], ["macacoeira", 10], ["tratorao", 1]],
    treinadores: [["VAQUEIRO TONHO", "montanhista", [["tatubola", 25], ["mandacaru", 26]]], ["FORROZEIRA DIDA", "garota", [["fogueirinha", 26]]]] },
  { id: "br116", nome: "BR-116", semente: 116, tema: "cerrado", niveis: [28, 33],
    mato: [["gatonet", 16], ["orelhao", 12], ["araraio", 10], ["bantevy", 8], ["balaozinho", 10], ["capivarao", 8], ["tucanacu", 10], ["catorbis", 1]],
    treinadores: [["CAMINHONEIRA DEDÉ", "montanhista", [["capivarao", 30], ["tucanacu", 30]]], ["MOTOBOY KIKO", "motoqueiro", [["gatonet", 31]]]] },
  { id: "br381", nome: "FERNÃO DIAS", semente: 381, deitada: true, tema: "mata", niveis: [33, 38],
    mato: [["penadinha", 16], ["zerogle", 6], ["gatonet", 12], ["tucanacu", 12], ["taturrao", 10], ["lobisomem", 5], ["chuvisco", 5]],
    treinadores: [["GARIMPEIRO ZÉ", "montanhista", [["taturrao", 35], ["tatubola", 34]]], ["CAÇA-FANTASMA LU", "canalizadora", [["penadinha", 36]]]] },
  { id: "estrada_real", nome: "ESTRADA REAL", semente: 1700, tema: "mata", lagoa: true, niveis: [38, 43],
    mato: [["beijaflorzinha", 14], ["brigadeirinho", 10], ["botinho", 10], ["pirarucu", 6], ["tucanacu", 12], ["penadinha", 10],
           ["lorose", 4], ["bangveet", 6], ["zerogle", 3]],
    treinadores: [["TROPEIRO JUCA", "gentleman", [["capivarao", 40], ["tucanacu", 40]]], ["DANÇARINA MEL", "garota", [["beijaflorzinha", 41], ["botinho", 41]]]] },
  { id: "br040", nome: "BR-040", semente: 40, deitada: true, tema: "cerrado", niveis: [43, 48],
    mato: [["chuvisco", 14], ["gambiarra", 10], ["araraio", 12], ["lobisomem", 8], ["concretao", 4], ["taturrao", 10], ["bangveet", 8]],
    treinadores: [["ASSESSOR DUDU", "gentleman", [["chuvisco", 45], ["gambiarra", 45]]], ["ARQUITETA VERA", "tecnica", [["concretao", 46]]]] },
];

/** O MONTE SERRA: a subida da ESTRADA REAL antes do RIO DE JANEEVEE. Não é
 *  estrada gerada — é desenhada à mão, em terraços: cada paredão de pedra (R)
 *  tem uma escadaria (e) numa ponta e barrancos (v) no meio. Subindo, o
 *  caminho vai em zigue-zague de escada em escada; descendo, os barrancos são
 *  o atalho (pulam pra baixo e não deixam voltar). No meio, um riacho que
 *  desce a serra em cachoeira, com uma ponte de madeira. O chão é de serra
 *  (tema "serra"): araucária no lugar de árvore de mata, e neblina em cima. */
const SERRA_DE_PE = {
  id: "monte_serra", nome: "MONTE SERRA", tema: "serra", niveis: [40, 44],
  planta: [
  "##############PP##############",
  "#####.......,,PP,,.......#####",
  "####..o....,,,PP,,,....o..####",
  "###....,,,,....P.....,,,,..###",
  "###..#.,,,,..PPP.....,,,,..###",
  "###.....1....P........o....###",
  "###..........PPPPPPPPPPPP..###",
  "###RRRRRRRvvvvRRRRRRRRRReeRR##",
  "###.,,,,..........,,,,..PP..##",
  "###.,,,,...o......,,,,..P...##",
  "##....#......~~~~.......P...##",
  "##..PPPPPPPPP====PPPPPPPP...##",
  "##..P........~~~~........o..##",
  "###.P..,,,,..~~~~..,,,,.....##",
  "###Ree.RRRRRR~~~~vvvvRRRRRR###",
  "###.PP...,,,,~~~~..,,,,.....##",
  "##..P....,,,,~~~~..,,,,..o..##",
  "##..PPPPPPPPPPPPPPPPPPPPPP..##",
  "##.....,,,,,.......,,,,,.P..##",
  "##..o..,,,,,...#...,,,,,.P..##",
  "###...............2.....PP.###",
  "###RRRRRRRRRRvvvvRRRRRRReeR###",
  "##..,,,,,...........,,,,.PP.##",
  "##..,,,,,..o........,,,,.P..##",
  "##...........PPPPPPPPPPPPP..##",
  "###..#.......P..........o..###",
  "###....,,,,..P..,,,,.......###",
  "####...,,,,..P..,,,,......####",
  "#####.........PP.........#####",
  "##############PP##############",
  ],
  mato: [["taturrao", 16], ["tucanacu", 14], ["araraio", 12], ["lobisomem", 8], ["zerogle", 6], ["penadinha", 8],
         ["concretao", 3], ["britadeiro", 1]],
  // os treinadores ficam fora do caminho (conferido em dev/braglitchcheck.html)
  treinadores: [
    { x: 8, y: 9, dir: "right", nome: "ALPINISTA TETÊ", sprite: "montanhista", time: [["taturrao", 41], ["tucanacu", 41]] },
    { x: 20, y: 19, dir: "left", nome: "ESCOTEIRA BEL", sprite: "garota", time: [["araraio", 42], ["tatubola", 42]] },
    { x: 10, y: 23, dir: "right", nome: "TROPEIRO NICO", sprite: "gentleman", time: [["capivarao", 40], ["lobisomem", 41]] },
  ],
  placas: {
    1: "MONTE SERRA — O ALTO DA ESTRADA REAL.\nDAQUI PRA FRENTE É SÓ DESCIDA ATÉ O RIO DE JANEEVEE.",
    2: "MIRANTE. EM DIA SEM NEBLINA DÁ PRA VER O MAR.\n(HOJE TEM NEBLINA.)",
  },
};

/** No mapa do Brasil a ESTRADA REAL desce de OURO GASTLY pro RIO, então a serra
 *  fica DE CABEÇA PRA BAIXO: a estrada chega por cima e o Rio fica embaixo. Os
 *  barrancos continuam sendo o atalho da volta — agora a volta é pra cima, e
 *  eles viram `^` (só se pulam pra cima). */
export const SERRA = {
  ...SERRA_DE_PE,
  planta: [...SERRA_DE_PE.planta].reverse().map((l) => l.replace(/v/g, "^")),
  treinadores: SERRA_DE_PE.treinadores.map((t) => ({ ...t, y: SERRA_DE_PE.planta.length - 1 - t.y })),
  placas: {
    ...SERRA_DE_PE.placas,
    1: "MONTE SERRA — O ALTO DA ESTRADA REAL.\nDAQUI PRA BAIXO É SÓ DESCIDA ATÉ O RIO DE JANEEVEE.",
  },
};

/** As lendas soltas quando as oito ilhas ficam completas (src/data/braglitch-ilhas.js). */
export const LENDAS = [
  // A DUPLA LENDÁRIA: a mata e a máquina, cada uma na ponta dela da região
  { id: "amazonium", estrada: "floresta_amazonica", lvl: 70, perto: [8, 10],
    fala: ["O MATO FICA EM SILÊNCIO. UMA ÁRVORE QUE NÃO ESTAVA ALI ONTEM ABRE OS OLHOS NO TRONCO.",
           "AS RAÍZES SE MEXEM COMO SE A TERRA INTEIRA RESPIRASSE."] },
  // O TERCEIRO DO TRIO: só aparece depois que a mata e a máquina estão com
  // você. É o Encontro das Águas — o rio que passa entre os dois, na beira da
  // lagoa da FLORESTA AMAZÔNICA
  { id: "encontrium", estrada: "floresta_amazonica", lvl: 75, perto: [20, 34], requer: { pegos: ["amazonium", "destroium"] },
    fala: ["NA BEIRA DA LAGOA A ÁGUA SE DIVIDE EM DUAS: UMA PRETA, OUTRA BARRENTA. ELAS CORREM LADO A LADO SEM SE MISTURAR.",
           "NO PONTO EXATO ONDE AS DUAS SE ENCOSTAM, UMA JOIA TURQUESA SOBE À TONA. E DEPOIS, O RESTO DELE."] },
  { id: "destroium", estrada: "br040", lvl: 70, perto: [8, 8],
    fala: ["O CHÃO TREME. UM RONCO DE MOTOR VEM DE TRÁS DAS ÁRVORES — E AS ÁRVORES CAEM.",
           "UM OLHO VERMELHO SE ACENDE NO MEIO DA FUMAÇA PRETA."] },
  { id: "boitata", estrada: "br324", lvl: 60, fala: ["O CAPIM SECO PEGA FOGO SOZINHO NUMA LINHA COMPRIDA.", "A LINHA LEVANTA A CABEÇA. SÃO DOIS OLHOS ENORMES, E O FOGO É AZUL."] },
  { id: "iara", estrada: "estrada_real", lvl: 60, fala: ["DA BEIRA DA LAGOA VEM UMA CANTORIA.", "VOCÊ ESQUECE POR UM MOMENTO PRA ONDE ESTAVA INDO..."] },
  { id: "curupira", estrada: "transamazonica", lvl: 60, fala: ["PEGADAS NO BARRO, TODAS VOLTANDO PRO LUGAR DE ONDE VOCÊ VEIO.", "UM ASSOBIO NO ALTO DAS ÁRVORES. OS PÉS DELE ESTÃO VIRADOS PRA TRÁS."] },
];

// ------------------------------------------------------------ a montagem

/** As plantas das cidades e estradas (as de src/data/braglitch.js juntam isto
 *  às dela). */
export const PLANTAS_MUNDO = {};
for (const c of CIDADES) PLANTAS_MUNDO[c.id] = plantaDaCidade(c);
for (const e of [...ESTRADAS, FLORESTA]) PLANTAS_MUNDO[e.id] = plantaDaEstrada(e);
for (const l of LUGARES_NOVOS) PLANTAS_MUNDO[l.id] = l.planta;
PLANTAS_MUNDO[SERRA.id] = SERRA.planta;

// ------------------------------------------------------ O MAPA DO BRASIL
// Braglitch tem o formato do Brasil: cada lugar tem uma posição no desenho
// (`pos`, x e y de 0 a 100, oeste→leste e norte→sul — é o que a tela do MAPA
// DA REGIÃO mostra) e as ligações pelos quatro lados (`liga`). Quem anda pra
// direita numa cidade do litoral chega no que está a leste dela no desenho.
//
// A ordem da história continua a mesma (a MATA ATLÂNTICA leva a BELÉM, o
// primeiro ginásio); o que mudou é que agora ela corre pelo mapa do Brasil, e
// não mais numa fila só pra cima. Os lugares novos (src/data/braglitch-sul.js,
// -norte.js, -centro.js) entram aqui do mesmo jeito.
export const LAYOUT = {
  sao_lucario:        { pos: [57, 90], liga: { up: "rota_br101" } },
  rota_br101:         { pos: [60, 86], liga: { down: "sao_lucario", up: "mata_do_saci", right: "floripa" } },
  floripa:            { pos: [66, 85], liga: { left: "rota_br101", up: "carvoriu" } },
  carvoriu:           { pos: [68, 81], liga: { down: "floripa" } },
  // a PRAIA DO LARVANJAL fica DEPOIS DA ÁGUA de CARVORIÚ: não tem estrada, só
  // o BONDINHO que sai da praia de lá (src/data/braglitch.js, BONDINHO)
  larvanjal:          { pos: [71, 77], liga: {} },
  mata_do_saci:       { pos: [63, 80], liga: { down: "rota_br101", up: "transamazonica", left: "curitiba" } },
  curitiba:           { pos: [57, 78], liga: { right: "mata_do_saci" } },
  // a MATA ATLÂNTICA é comprida: no mapa ela faz a curva pelo meio do país
  // (`via`: os pontos da linha, saindo do lugar pra cada lado)
  transamazonica:     { pos: [57, 50], liga: { down: "mata_do_saci", up: "belem" }, via: { down: [[60, 66]], up: [[55, 38], [58, 27]] } },
  belem:              { pos: [63, 17], liga: { down: "transamazonica", right: "br232" } },
  br232:              { pos: [79, 24], liga: { left: "belem", right: "recife" } },
  recife:             { pos: [96, 33], liga: { left: "br232", down: "br101n", up: "natal" } },
  natal:              { pos: [95, 26], liga: { down: "recife", left: "fortaleza" } },
  fortaleza:          { pos: [87, 21], liga: { right: "natal" } },
  br101n:             { pos: [94, 39], liga: { up: "recife", down: "salvador" } },
  salvador:           { pos: [89, 46], liga: { up: "br101n", left: "br324" } },
  br324:              { pos: [82, 43], liga: { right: "salvador", left: "caruaru" } },
  caruaru:            { pos: [76, 40], liga: { right: "br324", down: "br116" } },
  br116:              { pos: [76, 53], liga: { up: "caruaru", down: "sampa" } },
  sampa:              { pos: [70, 72], liga: { up: "br116", right: "br381" } },
  br381:              { pos: [74, 68], liga: { left: "sampa", right: "ouropreto" } },
  ouropreto:          { pos: [78, 63], liga: { left: "br381", down: "estrada_real" } },
  estrada_real:       { pos: [79, 67], liga: { up: "ouropreto", down: "monte_serra" } },
  monte_serra:        { pos: [80, 70], liga: { up: "estrada_real", down: "rio" } },
  rio:                { pos: [81, 73], liga: { up: "monte_serra", left: "br040" } },
  br040:              { pos: [72, 61], liga: { right: "rio", left: "brasilia" } },
  brasilia:           { pos: [65, 53], liga: { right: "br040", up: "chapada", left: "pantanal", down: "esplanada" } },
  // a ESPLANADA DA LIGA (src/data/braglitch-liga.js): embaixo da capital, sem outra saída
  esplanada:          { pos: [65, 58], liga: { up: "brasilia" } },
  pantanal:           { pos: [48, 59], liga: { right: "brasilia", left: "cuiaba" } },
  cuiaba:             { pos: [39, 55], liga: { right: "pantanal" } },
  chapada:            { pos: [64, 44], liga: { down: "brasilia", up: "floresta_amazonica" } },
  floresta_amazonica: { pos: [38, 27], liga: { down: "chapada", left: "manaus" } },
  manaus:             { pos: [27, 23], liga: { right: "floresta_amazonica" } },
  // AS ILHAS: sem estrada nenhuma, só a lancha da PROFA. IPÊ (src/data/braglitch-ilhas.js)
  ilha_do_mel:        { pos: [67, 81], liga: {} },
  queimada_grande:    { pos: [74, 76], liga: {} },
  ilhabela:           { pos: [77, 76], liga: {} },
  ilha_grande:        { pos: [83, 75], liga: {} },
  itaparica:          { pos: [92, 47], liga: {} },
  atol:               { pos: [97, 30], liga: {} },
  marajo:             { pos: [64, 11], liga: {} },
  noronha:            { pos: [99, 22], liga: {} },
};
const OPOSTO = { up: "down", down: "up", left: "right", right: "left" };

/** O CONTORNO DO BRASIL, no mesmo 0..100 do LAYOUT (x = oeste→leste, y =
 *  norte→sul), a partir de longitude e latitude de verdade: de Roraima,
 *  descendo pelo litoral até o Chuí e voltando pelas fronteiras do oeste. */
export const CONTORNO_BRASIL = [
  [34, 0], [36, 9], [56, 2], [60, 13], [65, 15], [75, 19], [89, 22], [97, 27], [98, 33], [96, 38],
  [89, 46], [87, 51], [86, 61], [84, 65], [80, 72], [77, 72], [69, 74], [64, 79], [64, 84], [61, 87],
  [59, 92], [52, 99], [47, 92], [41, 90], [45, 85], [48, 78], [49, 74], [46, 70], [40, 69], [40, 64],
  [35, 54], [34, 47], [22, 41], [11, 41], [1, 31], [4, 26], [10, 24], [11, 15], [10, 10], [18, 10], [25, 4],
];

/** O que cada lugar é, pra tela do mapa: "cidade",
 *  "rota" ou "praia". */
export const TIPO_DO_LUGAR = {
  sao_lucario: "cidade", rota_br101: "rota", mata_do_saci: "rota",
  ...Object.fromEntries(CIDADES.map((c) => [c.id, "cidade"])),
  ...Object.fromEntries(ESTRADAS.map((e) => [e.id, "rota"])),
  [SERRA.id]: "rota", [FLORESTA.id]: "rota",
  ...Object.fromEntries(LUGARES_NOVOS.map((l) => [l.id, l.tipo])),
};

/** Onde fica a saída de um lado da planta: a primeira coluna (em cima/embaixo)
 *  ou fileira (esquerda/direita) de caminho colado na borda. */
export function saidaDe(planta, lado) {
  const H = planta.length, W = planta[0].length;
  const borda = lado === "up" ? planta[0] : lado === "down" ? planta[H - 1]
    : planta.map((l) => (lado === "left" ? l[0] : l[W - 1])).join("");
  const i = borda.indexOf("P");
  return i < 0 ? null : i;
}

/** Abre uma saída de 2 tiles num lado que não tinha: caminho da borda pra dentro
 *  até encontrar caminho (ou 16 tiles), sem atravessar prédio, água ou placa. */
function abrirSaida(planta, lado, pos) {
  const g = planta.map((l) => l.split(""));
  const H = g.length, W = g[0].length;
  const passa = (c) => "#.,FYo".includes(c);
  for (const k of [pos, pos + 1]) {
    for (let d = 0; d < 16; d++) {
      const x = lado === "left" ? d : lado === "right" ? W - 1 - d : k;
      const y = lado === "up" ? d : lado === "down" ? H - 1 - d : k;
      const c = g[y]?.[x];
      if (c === "P" || c === undefined || !passa(c)) break;
      g[y][x] = "P";
    }
  }
  return g.map((l) => l.join(""));
}

/** Fecha uma saída que não leva mais a lugar nenhum (vira mata). */
function fecharSaida(planta, lado) {
  const g = planta.map((l) => l.split(""));
  const H = g.length, W = g[0].length;
  for (let k = 0; k < (lado === "up" || lado === "down" ? W : H); k++) {
    const x = lado === "left" ? 0 : lado === "right" ? W - 1 : k;
    const y = lado === "up" ? 0 : lado === "down" ? H - 1 : k;
    if (g[y][x] === "P") g[y][x] = "#";
  }
  return g.map((l) => l.join(""));
}

/** Arruma as plantas pro LAYOUT (abre as saídas que faltam, fecha as que
 *  sobram) e devolve as ligações de cada mapa, com o `offset` certo: a
 *  fileira (ou coluna) da saída de um lado menos a do outro. `plantas` é o
 *  objeto de src/data/braglitch.js com TODAS as plantas; ele é alterado. */
export function montarLigacoes(plantas) {
  const PADRAO = { up: 14, down: 14, left: 6, right: 6 };
  const ROTA = { left: 14, right: 14 };
  for (const [id, L] of Object.entries(LAYOUT)) {
    if (!plantas[id]) continue;
    for (const lado of ["up", "down", "left", "right"]) {
      const quer = L.liga[lado] && plantas[L.liga[lado]];
      const tem = saidaDe(plantas[id], lado) !== null;
      if (quer && !tem) {
        const pos = id === "floresta_amazonica" ? 20 : (ROTA_IDS.has(id) ? ROTA[lado] : null) ?? PADRAO[lado];
        plantas[id] = abrirSaida(plantas[id], lado, pos);
      } else if (!quer && tem) plantas[id] = fecharSaida(plantas[id], lado);
    }
  }
  const out = {};
  for (const [id, L] of Object.entries(LAYOUT)) {
    if (!plantas[id]) continue;
    out[id] = [];
    for (const [lado, para] of Object.entries(L.liga)) {
      if (!plantas[para]) continue;
      const a = saidaDe(plantas[id], lado), b = saidaDe(plantas[para], OPOSTO[lado]);
      if (a === null || b === null) continue;
      out[id].push({ dir: lado, offset: a - b, to: para });
    }
  }
  return out;
}
const ROTA_IDS = new Set([...ESTRADAS.map((e) => e.id), SERRA.id, FLORESTA.id]);

/** Os interiores de cada cidade: ginásio, Centro e loja. O `predio` é a letra
 *  da planta; o `de` é o interior de Kanto copiado. */
export const INTERIORES_MUNDO = {};
for (const c of CIDADES) {
  INTERIORES_MUNDO[`${c.id}_ginasio`] = { de: c.ginasio, predio: "G", cidade: c.id };
  INTERIORES_MUNDO[`${c.id}_pokemon_center_1f`] = { de: "center", predio: "C", cidade: c.id };
  INTERIORES_MUNDO[`${c.id}_loja`] = { de: "mart", predio: "M", cidade: c.id };
}
// as cidades novas: Centro e loja quando a planta tiver (ginásio não tem)
for (const l of LUGARES_NOVOS) {
  if (l.planta.some((f) => f.includes("C"))) INTERIORES_MUNDO[`${l.id}_pokemon_center_1f`] = { de: "center", predio: "C", cidade: l.id };
  if (l.planta.some((f) => f.includes("M"))) INTERIORES_MUNDO[`${l.id}_loja`] = { de: "mart", predio: "M", cidade: l.id };
}

/** Onde cada coisa fica dentro de cada sala de ginásio copiada — as posições
 *  são as dos treinadores de Kanto naquela mesma sala. */
const SALA = {
  pewter_city_gym: { lider: { x: 6, y: 5 }, treinadores: [{ x: 3, y: 8, dir: "right" }, { x: 9, y: 8, dir: "left" }], guia: { x: 9, y: 13 } },
  // na sala da piscina o caminho é um corredor de um tile só: o guia fica no
  // canto da entrada e o segundo treinador no bolsinho abaixo do corredor de
  // cima — em (9,16) e (10,10) os dois fechavam a passagem pro líder
  cerulean_city_gym: { lider: { x: 8, y: 6 }, treinadores: [{ x: 4, y: 7, dir: "right" }, { x: 8, y: 8, dir: "up" }], guia: { x: 6, y: 16 } },
  celadon_city_gym: { lider: { x: 6, y: 4 }, treinadores: [{ x: 3, y: 11, dir: "right" }, { x: 9, y: 10, dir: "left" }], guia: { x: 9, y: 17 } },
};

/** AS INSÍGNIAS DE BRAGLITCH, as dos oito ginásios, na ordem (o menu e a
 *  batalha leem daqui). Vencer o líder põe o id em `st.bragBadges`. */
export const INSIGNIAS_BRAG = CIDADES.map((c) => ({ id: c.insignia.id, name: c.insignia.nome, city: c.nome }));

/** AS ILHAS: completar uma (o chefe dela) também põe o id em `st.bragBadges`
 *  (src/scenes/overworld.js, `lanchaIpe`). O menu de INSÍGNIAS mostra as duas
 *  listas, uma em cada página. */
export const INSIGNIAS_ILHAS = ILHAS_DA_HISTORIA.map((l, i) => ({ id: `ilha_${l.id}`, name: l.nome, city: `ILHA ${i + 1}` }));

const time = (lista) => lista.map(([id, lvl]) => ({ id, lvl }));
const tabela = (lista, [min, max]) => lista.map(([id, w]) => ({ id, min, max, w }));

/** O conteúdo (nome, música, NPCs, mato) de cada mapa do mundo, no formato de
 *  src/data/maps.js. `geos` é o que `montarBraglitch` já montou — é de lá que
 *  saem os lugares livres pros NPCs. */
export function conteudoDoMundo(geos) {
  const out = {};
  CIDADES.forEach((c, i) => {
    const planta = PLANTAS_MUNDO[c.id];
    const usados = new Set();
    const npcs = c.povo.map(([sprite, lines], k) => {
      const p = chaoPerto(planta, k ? 22 : 8, k ? 14 : 7, usados);
      usados.add(`${p.x},${p.y}`);
      return { id: `povo${k}`, x: p.x, y: p.y, dir: "down", sprite, lines, wander: k === 1 };
    });
    // O LIVRO DAS COORDENADAS DA LENDA, largado no chão de SALVADITTO (ver
    // `lerLivroDasLendas` em src/scenes/overworld.js)
    if (c.id === "salvador") {
      const p = chaoPerto(planta, 15, 9, usados);
      usados.add(`${p.x},${p.y}`);
      npcs.push({ id: "livro_lendas", x: p.x, y: p.y, dir: "down", sprite: "livro", livroLendas: true, lines: ["..."] });
    }
    // AOS PÉS DO ARCEUS REDENTOR: uma oferenda de 7 DOCES RAROS, no chão logo
    // abaixo da base, do lado da placa
    if (c.estatua) {
      const yBase = planta.reduce((u, l, y) => (l.includes("A") ? y : u), -1);
      const xMeio = Math.round((planta[yBase].indexOf("A") + planta[yBase].lastIndexOf("A")) / 2);
      const linha = planta[yBase + 1] || "";
      const x = [2, 3, 4, -2, -3].map((d) => xMeio + d).find((xx) => linha[xx] === "." && !usados.has(`${xx},${yBase + 1}`));
      if (x != null) {
        usados.add(`${x},${yBase + 1}`);
        npcs.push({ id: "doces_redentor", x, y: yBase + 1, dir: "down", sprite: "ball",
                    gift: { item: "doce raro", qty: 7 }, lines: ["..."],
                    achado: ["AOS PÉS DO ARCEUS REDENTOR, ALGUÉM DEIXOU UMA OFERENDA.", "VOCÊ PEGOU 7 DOCES RAROS!"] });
      }
    }
    const placa2 = `${c.lider.titulo.replace(/^O |^A /, "")}`;
    out[c.id] = {
      name: c.nome, music: c.musica, encounters: [], npcs,
      placas: {
        1: c.placa,
        2: `GINÁSIO DE ${c.nome}\nLÍDER: ${c.lider.nome}, ${placa2}. TIPO ${c.tipo}.`,
        ...(c.placaEstatua ? { 3: c.placaEstatua } : {}),
      },
    };
    // o ginásio
    const sala = SALA[c.ginasio];
    const gnpcs = [{
      id: "lider", ...sala.lider, dir: "down", sprite: c.lider.sprite,
      lines: c.lider.fala, afterLines: c.lider.depois,
      trainer: { name: `LÍDER ${c.lider.nome}`, prize: 1200 + i * 450, bragBadge: c.insignia.id,
                 party: time(c.lider.time) },
    }];
    c.treinadores.forEach(([nome, sprite, t], k) => {
      const lugar = sala.treinadores[k];
      if (!lugar) return;
      gnpcs.push({ id: `treinador${k}`, ...lugar, sprite,
                   lines: [`O GINÁSIO DE ${c.nome} É DE TIPO ${c.tipo}. PASSA POR MIM PRIMEIRO!`],
                   afterLines: ["A LÍDER... O LÍDER... BOM, QUEM MANDA AQUI É MAIS FORTE QUE EU."],
                   trainer: { name: nome, prize: 300 + i * 120, sight: 3, party: time(t) } });
    });
    gnpcs.push({ id: "guia", ...sala.guia, dir: "down", sprite: "gentleman",
                 lines: [`E AÍ, FUTURO CAMPEÃO! AQUI É TIPO ${c.tipo}.`, dicaDoTipo(c.tipo)] });
    out[`${c.id}_ginasio`] = {
      name: `GINÁSIO DE ${c.nome}`, music: "gym", interior: true, encounters: [], npcs: gnpcs,
      spawn: { x: geos[`${c.id}_ginasio`]?.warps?.[0]?.x ?? 6, y: (geos[`${c.id}_ginasio`]?.warps?.[0]?.y ?? 12) - 1, dir: "up" },
    };
    out[`${c.id}_pokemon_center_1f`] = {
      name: `CENTRO POKÉMON — ${c.nome}`, music: "center", interior: true, encounters: [],
      spawn: { x: 7, y: 8, dir: "up" },
      lockedWarps: { "1,6": "A ESCADA LEVA À SALA DE UNIÃO. ESTÁ FECHADA." },
      npcs: [{ id: "enfermeira", x: 7, y: 2, dir: "down", sprite: "enfermeira", heal: true, tutor: true,
               lines: [`BEM-VINDO AO CENTRO POKÉMON DE ${c.nome}!`, "CURO SEUS POKÉMON E AJUSTO OS GOLPES DELES, SE QUISER."] }],
    };
    out[`${c.id}_loja`] = {
      name: `LOJA — ${c.nome}`, music: "mart", interior: true, encounters: [],
      spawn: { x: 4, y: 7, dir: "up" },
      npcs: [{ id: "balconista", x: 2, y: 3, dir: "down", sprite: "balconista",
               lines: ["OPA! PODE ESCOLHER. PARCELA EM DEZ VEZES SEM JUROS."],
               shop: [{ item: "poké bola", price: 200 }, { item: "poção", price: 300 },
                      { item: "pedra da folha", price: 2100 }, { item: "pedra do fogo", price: 2100 },
                      { item: "pedra da água", price: 2100 }] }],
    };
  });
  [...ESTRADAS, FLORESTA].forEach((e) => {
    const planta = PLANTAS_MUNDO[e.id];
    const lugares = lugaresDeTreinador(planta, e.treinadores.length);
    out[e.id] = {
      name: e.nome, music: "br101",
      encounters: tabela(e.mato, e.niveis),
      npcs: e.treinadores.map(([nome, sprite, t], k) => ({
        id: `treinador${k}`, ...(lugares[k] || chaoPerto(planta, 8 + k * 12, 10)), dir: lugares[k]?.dir || "down",
        sprite, lines: [`EI! NA ${e.nome} QUEM CRUZA O MEU CAMINHO LUTA!`],
        afterLines: ["BOA LUTA. A ESTRADA É LONGA, VAI COM CALMA."],
        trainer: { name: nome, prize: 80 + e.niveis[0] * 12, sight: 4, party: time(t) },
      })),
      placas: { 1: e.placa || `${e.nome}\nPERIGO: BICHO NA PISTA.` },
    };
  });
  // OS LUGARES NOVOS: o conteúdo já vem pronto do arquivo de cada região
  for (const l of LUGARES_NOVOS) {
    out[l.id] = {
      name: l.nome, music: l.musica || (l.tipo === "rota" ? "br101" : "saolucario"),
      encounters: l.mato?.length ? tabela(l.mato, l.niveis) : [],
      npcs: l.npcs || [], placas: l.placas || {},
    };
    if (INTERIORES_MUNDO[`${l.id}_pokemon_center_1f`]) {
      out[`${l.id}_pokemon_center_1f`] = {
        name: `CENTRO POKÉMON — ${l.nome}`, music: "center", interior: true, encounters: [],
        spawn: { x: 7, y: 8, dir: "up" },
        lockedWarps: { "1,6": "A ESCADA LEVA À SALA DE UNIÃO. ESTÁ FECHADA." },
        npcs: [{ id: "enfermeira", x: 7, y: 2, dir: "down", sprite: "enfermeira", heal: true, tutor: true,
                 lines: [l.centro || `BEM-VINDO AO CENTRO POKÉMON DE ${l.nome}!`, "CURO SEUS POKÉMON E AJUSTO OS GOLPES DELES, SE QUISER."] }],
      };
    }
    if (INTERIORES_MUNDO[`${l.id}_loja`]) {
      out[`${l.id}_loja`] = {
        name: `LOJA — ${l.nome}`, music: "mart", interior: true, encounters: [],
        spawn: { x: 4, y: 7, dir: "up" },
        npcs: [{ id: "balconista", x: 2, y: 3, dir: "down", sprite: "balconista",
                 lines: ["OPA! PODE ESCOLHER. PARCELA EM DEZ VEZES SEM JUROS."],
                 shop: [{ item: "poké bola", price: 200 }, { item: "poção", price: 300 },
                        { item: "pedra da folha", price: 2100 }, { item: "pedra do fogo", price: 2100 }, { item: "pedra da água", price: 2100 }] }],
      };
    }
  }
  out[SERRA.id] = {
    name: SERRA.nome, music: "br101",
    encounters: tabela(SERRA.mato, SERRA.niveis),
    npcs: SERRA.treinadores.map((t, k) => ({
      id: `treinador${k}`, x: t.x, y: t.y, dir: t.dir, sprite: t.sprite,
      lines: ["UFA... SUBIR A SERRA CANSA. UMA BATALHA PRA DESCANSAR?"],
      afterLines: ["LÁ EM CIMA TEM O MIRANTE. SE A NEBLINA DEIXAR, DÁ PRA VER O MAR."],
      trainer: { name: t.nome, prize: 700, sight: 4, party: time(t.time) },
    })),
    placas: SERRA.placas,
  };
  return out;
}

/** Onde o GÊMEO (o rival de Braglitch, src/data/rival.js) espera em cada
 *  cidade: do lado da porta do ginásio, que é pra onde você está indo. A porta
 *  é o "D" logo embaixo do bloco "G" da planta. */
export const LUGAR_DO_GEMEO = Object.fromEntries(CIDADES.map((c) => {
  const planta = PLANTAS_MUNDO[c.id];
  const yG = planta.reduce((u, l, y) => (l.includes("G") ? y : u), -1);
  const x0 = planta[yG].indexOf("G"), x1 = planta[yG].lastIndexOf("G");
  const linha = planta[yG + 1] || "";
  let xd = [...linha].findIndex((ch, x) => ch === "D" && x >= x0 && x <= x1);
  if (xd < 0) xd = Math.round((x0 + x1) / 2);
  const p = chaoPerto(planta, xd + 2, yG + 2);
  return [c.id, { x: p.x, y: p.y, dir: "down" }];
}));

/** Onde cada lenda aparece: num chão livre no meio da estrada dela. */
export const LENDAS_LUGAR = LENDAS.map((l) => {
  const planta = PLANTAS_MUNDO[l.estrada];
  const [x0, y0] = l.perto || [22, Math.floor(planta.length / 2)];
  const p = chaoPerto(planta, x0, y0);
  return { ...l, mapa: l.estrada, x: p.x, y: p.y };
});

function dicaDoTipo(tipo) {
  const d = {
    PLANTA: "FOGO, GELO, VENENO E VOADOR QUEIMAM A MATA DELA. ÁGUA E TERRA SÓ REGAM.",
    ÁGUA: "PLANTA E ELÉTRICO SECAM O MANGUE. FOGO AQUI SÓ FAZ VAPOR.",
    LUTADOR: "VOADOR, PSÍQUICO E FADA TIRAM A GINGA DELE. PEDRA APANHA.",
    FOGO: "ÁGUA, TERRA E PEDRA APAGAM A FOGUEIRA. PLANTA VIRA LENHA.",
    ELÉTRICO: "TERRA ATERRA TUDO. ÁGUA E VOADOR LEVAM CHOQUE.",
    FANTASMA: "SOMBRIO E FANTASMA ASSUSTAM ASSOMBRAÇÃO. NORMAL E LUTADOR NEM ENCOSTAM.",
    FADA: "VENENO E AÇO ACABAM COM O CARNAVAL. DRAGÃO E LUTADOR PERDEM O RITMO.",
    GLITCH: "NINGUÉM SABE DIREITO O QUE FUNCIONA CONTRA GLITCH. LEVA UM TIME VARIADO.",
  };
  return d[tipo] || "TRAGA UM TIME EQUILIBRADO.";
}
