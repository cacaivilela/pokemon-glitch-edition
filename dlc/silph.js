// DLC: ARQUIVO DA SILPH.
//
// A Silph Co. abriu o depósito. O que era protótipo virou bicho solto: PORYGON
// e a família toda dos elétricos passam a nascer nas ruas de Saffron (a cidade
// não tinha tabela nenhuma — agora tem, e é toda de plástico e cobre), o ROTOM
// aparece na Usina, e um funcionário na praça distribui o que sobrou.
//
// Os nove cartões são o arquivo: as peças que fazem PORYGON evoluir, o próprio,
// os elétricos raros, bolas e doces do estoque, e a pedra que a empresa
// nunca devia ter guardado.
export default {
  id: "silph",
  nome: "ARQUIVO DA SILPH",

  encontros: {
    saffron_city: [
      { id: "porygon",   min: 18, max: 26, w: 8 },
      { id: "magnemite", min: 16, max: 24, w: 24 },
      { id: "voltorb",   min: 16, max: 24, w: 20 },
      { id: "magneton",  min: 26, max: 32, w: 6 },
      { id: "electrode", min: 28, max: 34, w: 4 },
      { id: "rotom",     min: 24, max: 30, w: 3 },
    ],
  },
  encontrosExtra: {
    power_plant: [{ id: "rotom", min: 24, max: 32, w: 5 }, { id: "porygon", min: 22, max: 30, w: 4 }],
  },

  itens: {
    "crachá da silph": "UM CRACHÁ DE FUNCIONÁRIO COM A FOTO RASPADA. ABRE PORTA NENHUMA, MAS IMPRESSIONA.",
  },

  npcs: {
    saffron_city: [
      { id: "dlc_funcionario", x: 40, y: 24, dir: "down", sprite: "tecnico",
        lines: [
          "A EMPRESA ABRIU O DEPÓSITO. VINTE ANOS DE PROTÓTIPO, E ELES ANDAM.",
          "OS PORYGON SAÍRAM PELA RUA. OS MAGNEMITE FORAM ATRÁS. O ROTOM ENTROU NA USINA E NINGUÉM TEVE CORAGEM DE TIRAR.",
          "SE ACHAR ALGUMA COISA COM O LOGO DA SILPH, É NOSSA. MAS PODE FICAR.",
          "TOMA. UM CRACHÁ. NÃO É DE NINGUÉM.",
        ],
        gift: { item: "crachá da silph", qty: 1 } },
    ],
  },

  placas: {
    saffron_city: { "29,14": "SILPH CO. — DEPÓSITO ABERTO. CUIDADO COM O QUE ANDA SOZINHO." },
  },

  presentes: {
    SILPH001: { titulo: "O PROTÓTIPO", texto: "PORYGON, UNIDADE 001. O PRIMEIRO QUE LIGOU.", de: "SILPH CO.", mons: [{ id: "porygon", nv: 20 }] },
    SILPH002: { titulo: "A PEÇA QUE FALTAVA", texto: "UM UP-GRADE, LACRADO. FAZ O PORYGON VIRAR O QUE ELE DEVIA SER.", de: "SILPH CO.", itens: [{ item: "up-grade", qtd: 1 }] },
    SILPH003: { titulo: "O DISCO SUSPEITO", texto: "UM DUBIOUS DISC. O RÓTULO DIZ PRA NÃO USAR. O MANUAL DIZ COMO.", de: "SILPH CO.", itens: [{ item: "dubious disc", qtd: 1 }] },
    SILPH004: { titulo: "O ÍMÃ TRIPLO", texto: "TRÊS MAGNEMITE QUE SE JUNTARAM NO DEPÓSITO E NÃO QUISERAM MAIS SE SEPARAR.", de: "SILPH CO.", mons: [{ id: "magneton", nv: 30 }] },
    SILPH005: { titulo: "O FANTASMA DA TOMADA", texto: "UM ROTOM. ELE ESTAVA NA MÁQUINA DE CAFÉ. O CAFÉ SAÍA ELÉTRICO.", de: "SILPH CO.", mons: [{ id: "rotom", nv: 25 }] },
    SILPH006: { titulo: "A CAIXA DE BOLAS", texto: "ESTOQUE DE ULTRA BALL. VINTE UNIDADES, TESTADAS.", de: "SILPH CO.", itens: [{ item: "ultra ball", qtd: 20 }] },
    SILPH007: { titulo: "OS DOCES DO ALMOXARIFADO", texto: "DEZ DOCES RAROS. ESTAVAM NA GAVETA DE ALGUÉM.", de: "SILPH CO.", itens: [{ item: "doce raro", qtd: 10 }] },
    SILPH008: { titulo: "O RATO ELÉTRICO DE OURO", texto: "UM PIKACHU SHINY QUE VIVIA NO GERADOR. NÃO ESTRANHE A COR: É A ELETRICIDADE.", de: "SILPH CO.", mons: [{ id: "pikachu", nv: 22, shiny: true }] },
    SILPH009: { titulo: "A PEDRA DO COFRE", texto: "UMA GENGARITA. A EMPRESA NEGA TER GUARDADO. O COFRE ESTAVA VAZIO DE MANHÃ.", de: "?", itens: [{ item: "gengarita", qtd: 1 }] },
  },
};
