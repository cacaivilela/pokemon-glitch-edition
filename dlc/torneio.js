// DLC: TORNEIO DE PALLET.
//
// Oito treinadores enfileirados na praia de Pallet, cada um com uma equipe de
// FUSÕES — as que jogadores publicaram pela oficina (src/data/fusoes-feitas.js).
// É o lugar onde essas fichas viram adversário, e não só bicho no PC de quem
// as fez. Eles não te veem passar (sight 0): fala com quem quiser, na ordem
// que quiser. O juiz, na frente da fila, só entrega o TROFÉU depois dos oito.
//
// Os ids das fusões são `fus-<cabeça>-<corpo>~<ficha>` (src/systems/fusao.js);
// a espécie é montada na hora por garantirEspecie, e de novo a cada hot-swap,
// porque o DB.SPECIES é remontado do zero e levaria elas junto.
import { garantirEspecie } from "../src/systems/fusao.js";

const F = (cab, cor, ficha) => `fus-${cab}-${cor}~${ficha}`;

const TREINADORES = [
  { id: "dlc_t1", x: 12, nome: "MENINO TÉO", sprite: "menino", prize: 800,
    lines: ["PRIMEIRA RODADA! EU FUNDI OS DOIS PRIMEIROS QUE PEGUEI.", "ELES NÃO SÃO FORTES. MAS SÃO MEUS."],
    after: ["FOI RÁPIDO. MAS A FILA SÓ PIORA DAQUI."],
    party: [[F("rattata", "pidgey", "rattadgey"), 28], [F("pikachu", "caterpie", "pikarpie"), 29]] },
  { id: "dlc_t2", x: 13, nome: "MENINA LIA", sprite: "menina", prize: 900,
    lines: ["SEGUNDA RODADA. AS MINHAS TÊM ASA.", "OU PELO MENOS METADE DELAS TEM."],
    after: ["VOAR NÃO ADIANTOU NADA. ANOTADO."],
    party: [[F("butterfree", "pikachu", "butterchuu"), 31], [F("pidgeotto", "clefairy", "pidgeotairy"), 32]] },
  { id: "dlc_t3", x: 14, nome: "PESCADOR NILO", sprite: "pescador", prize: 1000,
    lines: ["TERCEIRA. TUDO QUE EU FUNDO VEM DO MAR.", "MENOS O KRABBY COM PEDRA. ESSE VEIO DA PRAIA."],
    after: ["VOLTA PRO MAR, GENTE. A GENTE TENTA DE NOVO NO ANO QUE VEM."],
    party: [[F("krabby", "geodude", "krade"), 33], [F("magikarp", "gyarados", "magikyrados"), 34], [F("golduck", "poliwag", "gowag"), 33]] },
  { id: "dlc_t4", x: 15, nome: "TÉCNICA VERA", sprite: "tecnica", prize: 1200,
    lines: ["QUARTA RODADA. ROTOM EM TUDO. É UMA FILOSOFIA.", "SE TEM TOMADA, TEM ROTOM."],
    after: ["A GELADEIRA DESLIGOU. VOCÊ GANHOU."],
    party: [[F("rotom", "pikachu", "rochu"), 36], [F("rotom", "voltorb", "roltorb"), 36], [F("rotom", "lampent", "rompent"), 37]] },
  { id: "dlc_t5", x: 16, nome: "LUTADOR BRÁS", sprite: "lutador", prize: 1400,
    lines: ["QUINTA. EU SÓ FUNDO O QUE BATE.", "PUNHO COM PUNHO. É SIMPLES."],
    after: ["FOI UMA BOA LUTA. VOCÊ BATE FORTE."],
    party: [[F("primeape", "poliwhirl", "primeawhirl"), 39], [F("krabby", "hitmonchan", "krabbochan"), 39], [F("machamp", "electrode", "made"), 40]] },
  { id: "dlc_t6", x: 17, nome: "MONTANHISTA OTO", sprite: "montanhista", prize: 1600,
    lines: ["SEXTA RODADA. OS MEUS SÃO FÓSSEIS. LITERALMENTE.", "SESSENTA E SEIS MILHÕES DE ANOS DE TREINO."],
    after: ["EXTINTOS DE NOVO. QUE VERGONHA."],
    party: [[F("bastiodon", "rampardos", "bastiordos"), 42], [F("cranidos", "blastoise", "cranistoise"), 42], [F("kabutops", "kakuna", "kabuna"), 41]] },
  { id: "dlc_t7", x: 18, nome: "CIENTISTA IARA", sprite: "cientista", prize: 1900,
    lines: ["SÉTIMA. EU FUNDO COM MÉTODO. PORYGON É A BASE DE TUDO.", "O ÚLTIMO EU NÃO SEI EXPLICAR. ELE SÓ APARECEU."],
    after: ["OS DADOS NÃO BATEM. VOU REFAZER O EXPERIMENTO."],
    party: [[F("porygon", "psyduck", "poryduck"), 44], [F("rampardos", "porygonz", "ramparygonz"), 45], [F("porygon", "xerneas", "porygoneas"), 46]] },
  { id: "dlc_t8", x: 19, nome: "CAMPEÃO NEO", sprite: "superm", prize: 3000,
    lines: ["A FINAL. EU GANHEI ESTE TORNEIO TRÊS VEZES.", "MEUS TRÊS SÃO LENDAS COSTURADAS EM OUTRA COISA. VEM."],
    after: ["...TRÊS VEZES. AGORA SÃO TRÊS DERROTAS TAMBÉM. FALA COM O JUIZ."],
    party: [[F("articuno", "lapras", "laprocuno"), 48], [F("moltres", "chandelure", "more"), 49], [F("bulbasaur", "arceus", "bulbarceus"), 50]] },
];

export default {
  id: "torneio",
  nome: "TORNEIO DE PALLET",

  itens: {
    "troféu de pallet": "UM TROFÉU DE LATA COM OITO NOMES RISCADOS E O SEU ESCRITO POR CIMA. NÃO SERVE PRA NADA. É SEU.",
  },

  npcs: {
    pallet: [
      ...TREINADORES.map((t) => ({
        id: t.id, x: t.x, y: 19, dir: "up", sprite: t.sprite,
        lines: t.lines, afterLines: t.after,
        trainer: { name: t.nome, prize: t.prize, sight: 0,
                   party: t.party.map(([id, lvl]) => ({ id, lvl })) },
      })),
      { id: "dlc_juiz", x: 16, y: 17, dir: "down", sprite: "gentleman",
        antes: [
          "BEM-VINDO AO TORNEIO DE PALLET. OITO TREINADORES, OITO EQUIPES DE FUSÃO.",
          "ESTÃO ALI NA AREIA, EM FILA. FALE COM CADA UM — NA ORDEM QUE QUISER.",
          "QUANDO OS OITO CAÍREM, VOLTE AQUI. O PRÊMIO É DE LATA, MAS É SÓ UM.",
        ],
        lines: ["OS OITO. NINGUÉM TINHA FEITO ISSO AINDA.", "O TROFÉU É SEU. EU RISCO O NOME DO NEO."],
        depoisDe: TREINADORES.map((t) => t.id),
        gift: { item: "troféu de pallet", qty: 1 } },
    ],
  },

  placas: {
    pallet: { "16,16": "TORNEIO DE PALLET — HOJE, NA PRAIA. INSCRIÇÕES ENCERRADAS. VOCÊ JÁ ESTÁ INSCRITO." },
  },

  aplicar(DB) {
    // as fusões dos oito viram espécie agora, antes de qualquer batalha
    for (const t of TREINADORES) {
      for (const [id] of t.party) {
        if (!garantirEspecie(id)) console.warn(`[dlc torneio] fusão sem ficha: ${id}`);
      }
    }
  },
};
