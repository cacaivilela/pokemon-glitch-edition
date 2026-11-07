// O CONECTADOR DE LENDAS (pedido do CAIO, nov/2026: "um item pra juntar
// lendários: calyrex com suas montarias, kyurem com reshiram e zekrom,
// necrozma com solgaleo e lunala, etc.").
//
// Um ITEM-CHAVE. Usado na mochila no lendário PRINCIPAL (CALYREX, KYUREM ou
// NECROZMA), ele pergunta com quem juntar — só aparece quem está na equipe. O
// PARCEIRO sai da equipe e fica GUARDADO dentro do lendário (`mon.conectado`:
// o Pokémon inteiro, com nível, golpes e apelido); a espécie vira a forma
// junta. Usado de novo no junto, SEPARA: o parceiro volta igualzinho (pra
// equipe, ou pro PC se a equipe estiver cheia).
//
// As formas são as oficiais (desenhos da PokeAPI pelo número da forma,
// tools/fetch_sprites.py; o andar do Mystery Dungeon, tools/fetch_andar.py).

const FORMA = (id, dex, name, types, spriteDex, [hp, atk, def, spa, spd, spe], dexText) => ({
  id, dex, name, types, spriteDex, foreign: true, base: { hp, atk, def, spa, spd, spe },
  bst: hp + atk + def + spa + spd + spe, catchRate: 3, xpYield: 340, conectada: true, dexText,
});

export const FORMAS_CONECTADAS = {
  calyrexice: FORMA("calyrexice", 898, "CALYREX CAVALEIRO DO GELO", ["PSÍQUICO", "GELO"], 10193, [100, 165, 150, 85, 130, 50],
    "O REI MONTADO NO GLASTRIER. O FRIO DO CAVALO E O PODER DO REI VIRAM UMA COISA SÓ."),
  calyrexshadow: FORMA("calyrexshadow", 898, "CALYREX CAVALEIRO SOMBRIO", ["PSÍQUICO", "FANTASMA"], 10194, [100, 85, 80, 165, 100, 150],
    "O REI MONTADO NO SPECTRIER. CORRE TÃO RÁPIDO QUE PARECE SUMIR ENTRE UM PASSO E OUTRO."),
  kyuremwhite: FORMA("kyuremwhite", 646, "KYUREM WHITE", ["DRAGÃO", "GELO"], 10023, [125, 120, 90, 170, 100, 95],
    "O KYUREM QUE ABSORVEU O RESHIRAM. O GELO DELE AGORA QUEIMA."),
  kyuremblack: FORMA("kyuremblack", 646, "KYUREM BLACK", ["DRAGÃO", "GELO"], 10022, [125, 170, 100, 120, 90, 95],
    "O KYUREM QUE ABSORVEU O ZEKROM. O GELO DELE AGORA SOLTA RAIO."),
  necrozmadusk: FORMA("necrozmadusk", 800, "NECROZMA JUBA DO CREPÚSCULO", ["PSÍQUICO", "AÇO"], 10155, [97, 157, 127, 113, 109, 77],
    "O NECROZMA QUE VESTIU O SOLGALEO COMO ARMADURA. ROUBA A LUZ DO SOL PRA SI."),
  necrozmadawn: FORMA("necrozmadawn", 800, "NECROZMA ASAS DA ALVORADA", ["PSÍQUICO", "FANTASMA"], 10156, [97, 113, 109, 157, 127, 77],
    "O NECROZMA QUE VESTIU A LUNALA COMO ARMADURA. ROUBA A LUZ DA LUA PRA SI."),
};
// as formas juntas aprendem o que o lendário principal aprende
for (const f of Object.values(FORMAS_CONECTADAS)) f.learnsetDe = { 898: "calyrex", 646: "kyurem", 800: "necrozma" }[f.dex];

export const CONECTADOR = {
  item: "conectador de lendas",
  // quem é o principal, com quem junta e no que vira
  pares: [
    { base: "calyrex", parceiro: "glastrier", forma: "calyrexice" },
    { base: "calyrex", parceiro: "spectrier", forma: "calyrexshadow" },
    { base: "kyurem", parceiro: "reshiram", forma: "kyuremwhite" },
    { base: "kyurem", parceiro: "zekrom", forma: "kyuremblack" },
    { base: "necrozma", parceiro: "solgaleo", forma: "necrozmadusk" },
    { base: "necrozma", parceiro: "lunala", forma: "necrozmadawn" },
  ],
  textos: {
    nada: "O CONECTADOR NÃO REAGE A {MON}. SÓ FUNCIONA NO CALYREX, NO KYUREM E NO NECROZMA.",
    semParceiro: "O CONECTADOR BRILHA... MAS NÃO TEM NINGUÉM NA EQUIPE PRA JUNTAR COM {MON}.",
    pergunta: "JUNTAR {MON} COM QUEM?",
    juntou: ["O CONECTADOR LIGA OS DOIS COM UM FIO DE LUZ!", "{PARCEIRO} E {MON} VIRARAM UM SÓ: {FORMA}!"],
    separar: "SEPARAR {MON}?",
    opcoesSeparar: ["SEPARAR", "DEIXAR JUNTO"],
    separou: "{MON} E {PARCEIRO} SE SEPARARAM.",
    proPc: "A EQUIPE ESTÁ CHEIA: {PARCEIRO} FOI PRO PC.",
    desmaiado: "{MON} ESTÁ DESMAIADO. O CONECTADOR PRECISA DE FORÇA PRA FUNCIONAR.",
  },
  // quem dá: o vigia da GARAGEM ZERO (src/data/area-zero.js)
  presente: [
    "ESPERA! LEVA ISTO. ACHARAM NO FUNDO DA CRATERA, PERTO DO CRISTAL GIGANTE.",
    "CHAMAM DE CONECTADOR DE LENDAS. DIZEM QUE JUNTA DOIS LENDÁRIOS NUM SÓ.",
  ],
};
