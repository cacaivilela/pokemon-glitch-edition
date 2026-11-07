// O FUNDO DO MAR (pedido do CAIO: "kanto e braglitch de baixo da água, e
// capricha"). Todo mapa aberto com mar, de Kanto e de Braglitch, ganha o
// mapa de BAIXO — `fundo_<id>`, do mesmo tamanho, gerado aqui:
//   - onde em cima é ÁGUA, embaixo é o CHÃO DE AREIA (dá pra andar);
//   - onde em cima é terra, embaixo é o PAREDÃO de pedra (não passa);
//   - no chão, manchas de ALGA: é nelas que os selvagens de lá vivem (os
//     selvagens à vista só nascem em mato — a alga é o mato do fundo);
//   - as ligações com os mapas vizinhos são as mesmas de cima, pros fundos
//     deles: dá pra atravessar o mar inteiro por baixo.
// Mergulha-se surfando, em QUALQUER água (src/scenes/overworld.js,
// `mergulhar`), e sobe-se de qualquer ponto: em cima é sempre água.
//
// Lá embaixo também tem os SEGREDOS (`SEGREDOS`): o navio afundado da ROTA 21,
// a ruína da ROTA 20 com o KYOGRE dormindo, a caravela de NORONHA guardada
// pelo boto ENCANTADO e a cidade afundada do ATOL. Cada um é uma planta
// desenhada em letras, carimbada no maior pedaço de chão livre do mapa.
//
// O desenho (a areia, as algas, as pedras, o casco, os pilares) é feito em
// código, em src/core/assets.js (`fundoArt`); a luz azul, os raios de sol e
// as bolhas são desenhados por cima no overworld.

export const PREFIXO = "fundo_";
export const fundoDe = (id) => PREFIXO + id;
export const superficieDe = (id) => (String(id).startsWith(PREFIXO) ? String(id).slice(PREFIXO.length) : null);
export const MUSICA = "fundoMar";

/** as falas do fundo do mar (src/scenes/overworld.js) */
export const FUNDO_TEXTO = {
  mergulhou: "{MON} PRENDEU A RESPIRAÇÃO E DESCEU COM VOCÊ!",
  achouVisor: [
    "TEM ALGUMA COISA PRESA NUMA ALGA, BRILHANDO...",
    "É UM VISOR DE MERGULHO! NA ALÇA ESTÁ ESCRITO \"DETECTOR DE CARDUMES\".",
    "VOCÊ GUARDOU O VISOR DE CARDUMES NA MOCHILA. É SÓ USAR PRA PÔR NA CARA.",
  ],
  botouVisor: "VOCÊ PÔS O VISOR NA CARA. NO FUNDO DO MAR, ELE MOSTRA ONDE ESTÃO OS CARDUMES.",
  tirouVisor: "VOCÊ TIROU O VISOR.",
  cardume: [
    "OS {BASE} DO CARDUME SE JUNTARAM...",
    "...E VIRARAM UM {BASE} GIGANTE, FEITO DE {BASE} PEQUENININHOS! É O {MON}!",
  ],
};

/** quem nada lá embaixo: [espécie, peso] (os raros pesam pouco) */
const SELVAGENS = {
  kanto: [
    ["magikarp", 18], ["tentacool", 20], ["shellder", 14], ["horsea", 14], ["staryu", 14], ["krabby", 12], ["chinchou", 14],
    ["goldeen", 10], ["corsola", 10], ["remoraid", 10], ["clamperl", 10], ["qwilfish", 8], ["luvdisc", 8],
    ["finneon", 8], ["frillish", 6], ["seadra", 5], ["lanturn", 5], ["tentacruel", 5], ["mantine", 4],
    ["octillery", 4], ["huntail", 3], ["gorebyss", 3], ["alomomola", 3], ["relicanth", 2], ["lapras", 1],
  ],
  braglitch: [
    ["tilapish", 20], ["magikarpbrag", 14], ["piranhita", 14], ["caranguejinho", 14], ["botinho", 10], ["staryubrag", 10],
    ["horseabrag", 10], ["chinchoubrag", 10], ["clamperlbrag", 8], ["luvdiscbrag", 8], ["remoraidbrag", 8],
    ["frillishbrag", 6], ["mantykebrag", 6], ["alomomolabrag", 5], ["tentacoolbrag", 8], ["finizenbrag", 6],
    ["tilapisco", 4], ["piranhorda", 3], ["manguebit", 3], ["pirarucu", 2], ["tilapiracu", 1],
  ],
};

// ------------------------------------------------------------- OS SEGREDOS
// Letras das plantas: ' ' = deixa o chão de areia como está; '.' = chão (do
// navio, da ruína) livre; '#' = casco/parede; 'P' = pilar; 'M' = mastro;
// 'B' = baú; 'S' = placa; 'K' = quem dorme lá (o estático).
const NAVIO = [
  "   ##########   ",
  "  #..........#  ",
  " #.....M......# ",
  "#......M.......o",
  "#..B...M....S..#",
  " #............# ",
  "  #..........#  ",
  "   ##########   ",
];
const RUINA = [
  "P.P.P.P.P.P.P",
  ".............",
  "P..PPPPPPP..P",
  "...P.....P...",
  "P..P..K..P..P",
  "...P.....P...",
  "P..PP...PP..P",
  ".............",
  "P.P.PSB.P.P.P",
];
const CARAVELA = [
  "   ########   ",
  "  #...M....#  ",
  " #....M.....# ",
  "#..B..M..K...o",
  " #....M...S.# ",
  "  #........#  ",
  "   ########   ",
];
const CIDADE = [
  "PP.PP...PP.PP",
  "P...........P",
  "..PPP...PPP..",
  "..P.......P..",
  "......S......",
  "..P.......P..",
  "..PPP.B.PPP..",
  "P...........P",
  "PP.PP...PP.PP",
];

export const SEGREDOS = [
  {
    id: "navio", mapa: "route21_south", planta: NAVIO, estilo: "navio",
    placa: ["UMA PLACA DE BRONZE, VERDE DE TANTO MAR: \"S.S. ANNE I\".",
            "O PRIMEIRO S.S. ANNE NUNCA CHEGOU A VERMILION. O SEGUNDO GANHOU O NOME DELE."],
    bau: { item: "pepita grande", qty: 2,
           achado: ["O BAÚ DO CAPITÃO ABRIU COM UM ESTALO!", "DENTRO, DUAS PEPITAS GRANDES ENROLADAS NUM MAPA QUE A ÁGUA APAGOU."] },
  },
  {
    id: "ruina", mapa: "route20", planta: RUINA, estilo: "ruina",
    placa: ["LETRAS ANTIGAS NA PEDRA. DÁ PRA LER SÓ O FIM:",
            "\"...E O MAR VEIO DE BAIXO. QUEM DORME AQUI FEZ OS OCEANOS. NÃO ACORDE.\""],
    bau: { item: "doce raro", qty: 1, achado: ["ENTRE AS PEDRAS DA PORTA, UM DOCE RARO EMBRULHADO EM ALGA!"] },
    // o 'K' do meio é onde o KYOGRE e o GROUDON brigam no PÓS-PÓS-GAME (src/data/pos-pos.js)
  },
  {
    id: "caravela", mapa: "noronha", planta: CARAVELA, estilo: "navio",
    placa: ["NO CASCO, ENTALHADO À FACA: \"NAU DE BRAGLITCH — 1500 E POUCO\".",
            "DIZEM QUE O BOTO SUBIU NA CARAVELA NUMA NOITE DE FESTA E ELA NUNCA MAIS VOLTOU."],
    bau: { item: "pepita", qty: 5, achado: ["O BAÚ DA CARAVELA ESTAVA CHEIO DE MOEDAS DE OURO VIRADAS PEPITA!"] },
    estatico: { id: "encantado", nivel: 55, lines: [
      "UM BOTO COR-DE-ROSA NADA EM VOLTA DO MASTRO, DE CHAPÉU BRANCO.",
      "ELE TE OLHA COMO SE TE CONHECESSE DE ALGUMA FESTA.",
    ] },
  },
  {
    id: "cidade", mapa: "atol", planta: CIDADE, estilo: "ruina",
    placa: ["UMA PRAÇA DE PEDRA NO FUNDO DO ATOL. NO MEIO, UM MARCO:",
            "\"AQUI FOI A PRIMEIRA CIDADE DE BRAGLITCH. O MAR SUBIU E ELA FICOU.\""],
    bau: { item: "doce raro", qty: 2, achado: ["NO PÉ DO MARCO, DOIS DOCES RAROS QUE O MAR NÃO CONSEGUIU DERRETER!"] },
  },
];

// ------------------------------------------------------------- a geração
const hash = (x, y, s) => {
  let h = (x * 374761393 + y * 668265263 + s * 2246822519) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
/** ruído suave (pra as manchas de alga sairem em grupo, não em pó) */
function ruido(x, y, s, escala = 4) {
  const fx = x / escala, fy = y / escala, x0 = Math.floor(fx), y0 = Math.floor(fy);
  const tx = fx - x0, ty = fy - y0, k = (t) => t * t * (3 - 2 * t);
  const a = hash(x0, y0, s), b = hash(x0 + 1, y0, s), c = hash(x0, y0 + 1, s), d = hash(x0 + 1, y0 + 1, s);
  return a + (b - a) * k(tx) + (c - a) * k(ty) + (a - b - c + d) * k(tx) * k(ty);
}
const semente = (id) => [...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7) >>> 0;

/** Quem ganha o fundo: mapa ABERTO com bastante mar. Cavernas, portos (o
 *  porto é um pedaço de cais), as eras e a tempestade ficam de fora. */
function temFundo(id, geo, mapa) {
  if (!geo?.tags || !mapa || mapa.interior || geo.submerso) return false;
  if (/^(era_|tempestade|glitch|void|lumiose|kalos)|cave|seafoam|harbor|safari|navel_rock_base/.test(id)) return false;
  if (geo.regiao && geo.regiao !== "braglitch" && geo.regiao !== "kanto") return false;
  let agua = 0;
  for (let i = 0; i < geo.tags.length; i++) if (geo.tags[i] === "3") agua++;
  return agua >= 20;
}

/** os selvagens do fundo, no nível do lugar de cima (ou um padrão) */
function tabela(regiao, mapaDeCima, especies) {
  const enc = mapaDeCima?.encounters || [];
  const topo = enc.length ? Math.max(...enc.map((e) => e.max || 0)) : 0;
  const base = Math.max(regiao === "braglitch" ? 28 : 22, topo + 4);
  return SELVAGENS[regiao].filter(([id]) => especies[id])
    .map(([id, w]) => ({ id, min: base, max: base + 8 + (w <= 3 ? 6 : 0), w }));
}

/** o maior retângulo de chão (onde dá pra carimbar uma planta de w x h),
 *  o mais perto do meio do mapa */
function lugarPra(tags, W, H, w, h) {
  let melhor = null, quase = null;
  const livre = (x, y) => tags[y * W + x] === "0" || tags[y * W + x] === "2";
  for (let y = 1; y + h < H; y++) {
    for (let x = 1; x + w < W; x++) {
      let n = 0;
      for (let j = -1; j <= h; j++) for (let i = -1; i <= w; i++) if (livre(x + i, y + j)) n++;
      const d = Math.abs(x + w / 2 - W / 2) + Math.abs(y + h / 2 - H / 2);
      if (n === (w + 2) * (h + 2)) { if (!melhor || d < melhor.d) melhor = { x, y, d }; continue; }
      // MAPA PEQUENO (as ilhas de Braglitch): o lugar com mais chão — a planta
      // cava o paredão que sobrar (`carimbar` abre o retângulo inteiro)
      if (!quase || n > quase.n || (n === quase.n && d < quase.d)) quase = { x, y, d, n, cava: true };
    }
  }
  if (melhor) return melhor;
  return quase && quase.n >= (w + 2) * (h + 2) * 0.45 ? quase : null;
}

function montarFundo(id, geo, mapa, especies) {
  const { w: W, h: H } = geo;
  const s = semente(id);
  const regiao = geo.braglitch || geo.regiao === "braglitch" ? "braglitch" : "kanto";
  const tags = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (geo.tags[y * W + x] !== "3") { tags.push("1"); continue; }
      // a alga: onde o ruído passa do corte, em manchas
      tags.push(ruido(x, y, s, 4) > 0.64 ? "2" : "0");
    }
  }
  const fid = fundoDe(id);
  const novo = {
    w: W, h: H, tags: tags.join(""), warps: [], connections: [], signs: [], objects: [],
    submerso: true, fundoDe: id, seed: s, decor: {},
    ...(geo.braglitch ? { braglitch: true } : {}), ...(geo.regiao ? { regiao: geo.regiao } : {}),
  };
  let spawn = null;
  for (let i = 0; i < tags.length && !spawn; i++) if (tags[i] !== "1") spawn = { x: i % W, y: (i / W) | 0, dir: "down" };
  const conteudo = {
    name: `${mapa.name || id.toUpperCase()} — FUNDO`,
    // o de BRAGLITCH tem a música de lá (src/data/musicas-braglitch.js)
    music: geo.braglitch ? "bragFundo" : MUSICA, interior: false, submerso: true, fundoDe: id,
    npcs: [], encounters: tabela(regiao, mapa, especies), lockedWarps: {}, signs: {},
    spawn: spawn || { x: 0, y: 0, dir: "down" },
  };
  return [fid, novo, conteudo];
}

/** carimba um segredo no fundo: muda as tags, guarda o desenho (`decor`) e
 *  põe o baú, a placa e o estático */
function carimbar(seg, geo, mapa, estaticos) {
  const { planta } = seg;
  const h = planta.length, w = Math.max(...planta.map((l) => l.length));
  const lugar = lugarPra(geo.tags, geo.w, geo.h, w, h);
  if (!lugar) return false;
  const tags = geo.tags.split("");
  // cavou: o retângulo inteiro (com a beirada) vira chão de areia antes
  if (lugar.cava) {
    for (let j = -1; j <= h; j++) for (let i = -1; i <= w; i++) {
      const k = (lugar.y + j) * geo.w + lugar.x + i;
      if (tags[k] === "1") tags[k] = "0";
    }
  }
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const ch = planta[j][i] || " ";
      if (ch === " ") continue;
      const x = lugar.x + i, y = lugar.y + j, k = y * geo.w + x;
      const bloco = "#PMS".includes(ch);
      tags[k] = bloco ? "1" : "0";
      geo.decor[`${x},${y}`] = ch === "#" ? `${seg.estilo}-parede` : ch === "P" ? "pilar" : ch === "M" ? "mastro"
        : ch === "S" ? (seg.estilo === "navio" ? "placa-navio" : "placa-pedra") : `${seg.estilo}-chao`;
      if (ch === "S") mapa.signs[`${x},${y}`] = seg.placa;
      if (ch === "B") {
        mapa.npcs.push({ id: `bau_${seg.id}`, x, y, dir: "down", sprite: "bau", bau: true,
                         gift: { item: seg.bau.item, qty: seg.bau.qty }, achado: seg.bau.achado });
      }
      if (ch === "K" && seg.estatico) {
        estaticos.push({ id: seg.estatico.id, mapa: fundoDe(seg.mapa), x, y, nivel: seg.estatico.nivel, lines: seg.estatico.lines });
      }
    }
  }
  geo.tags = tags.join("");
  // onde ficou (o PÓS-PÓS-GAME levanta a ruína da ROTA 20 como ilha)
  const k = planta.findIndex((l) => l.includes("K"));
  (geo.segredos ||= {})[seg.id] = { x: lugar.x, y: lugar.y, w, h,
    k: k >= 0 ? { x: lugar.x + planta[k].indexOf("K"), y: lugar.y + k } : null };
  return true;
}

/** Gera os fundos de todos os mapas com mar e põe no DB (src/data/index.js,
 *  `buildDB`). */
export function gerarFundos(db) {
  const novos = [];
  for (const [id, geo] of Object.entries(db.KANTO || {})) {
    const mapa = db.MAPS?.[id];
    if (!temFundo(id, geo, mapa)) continue;
    novos.push(montarFundo(id, geo, mapa, db.SPECIES || {}));
  }
  for (const [fid, geo, conteudo] of novos) { db.KANTO[fid] = geo; db.MAPS[fid] = conteudo; }
  // as ligações: as mesmas de cima, pros fundos dos vizinhos
  for (const [fid, geo] of novos) {
    const cima = db.KANTO[superficieDe(fid)];
    geo.connections = (cima.connections || [])
      .filter((c) => c.to && db.KANTO[fundoDe(c.to)])
      .map((c) => ({ ...c, to: fundoDe(c.to) }));
  }
  db.ESTATICOS = [...(db.ESTATICOS || [])];   // cópia: o hot-swap monta o DB de novo
  for (const seg of SEGREDOS) {
    const fid = fundoDe(seg.mapa);
    if (db.KANTO[fid]) carimbar(seg, db.KANTO[fid], db.MAPS[fid], db.ESTATICOS);
  }
  return novos.length;
}
