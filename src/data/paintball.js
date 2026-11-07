// O PAINTBALL DE CELADON (ideia do CAIO): a LOJA DE DEPARTAMENTO virou uma
// arena de paintball. Você entra JUNTO com 2 Pokémon da sua equipe, contra um
// treinador com 2 Pokémon dele. Cada um aguenta `tiros` bolas de tinta; quem
// fica todo pintado sai. Ganha o time que sobrar. O prêmio é em FICHAS DO
// CASSINO (st.fichas), que se trocam na sala de prêmios do cassino ao lado.
// A arena é src/scenes/paintball.js; a porta e o balcão, src/data/maps.js.

export const PAINTBALL = {
  // as portas da loja de departamento de CELADON (as duas da frente)
  portas: ["11,14", "15,14"],
  tiros: 3,              // quantas bolas de tinta cada um aguenta
  tempo: 120,            // segundos de partida; acabou: ganha quem levou menos tiro
  premio: 50,            // fichas por vitória
  premioEmpate: 10,
  // os times
  corVoce: "#3a8cff",
  corEles: "#ff4a7a",
  // OS ADVERSÁRIOS: um é sorteado a cada partida
  rivais: [
    { nome: "PINTOR LUCAS", sprite: "garoto", mons: ["smeargle", "kecleon"] },
    { nome: "PINTORA BIA", sprite: "garota", mons: ["clefairy", "jigglypuff"] },
    { nome: "ROQUEIRO TINTA", sprite: "roqueiro", mons: ["grimer", "koffing"] },
    { nome: "MANÍACO DO SPLASH", sprite: "maniaco", mons: ["squirtle", "psyduck"] },
    { nome: "TÉCNICA PRISMA", sprite: "tecnica", mons: ["porygon", "magnemite"] },
  ],
  texto: {
    recepcao: [
      "BEM-VINDO À ARENA DE PAINTBALL DE CELADON!",
      "A LOJA FECHOU E A GENTE ENCHEU ELA DE CAIXOTE E TINTA.",
    ],
    pergunta: "VOCÊ E 2 POKÉMON DA SUA EQUIPE CONTRA UM TREINADOR E 2 POKÉMON DELE. JOGAR?",
    opcoes: ["JOGAR", "COMO JOGA?", "SAIR"],
    regras: [
      "SETAS ANDAM. Z ATIRA TINTA PRA ONDE VOCÊ ESTÁ OLHANDO.",
      "SEUS 2 POKÉMON JOGAM SOZINHOS DO SEU LADO.",
      "QUEM LEVA 3 BOLAS DE TINTA FICA TODO PINTADO E SAI.",
      "GANHA O TIME QUE SOBRAR. SE O TEMPO ACABAR, GANHA QUEM LEVOU MENOS TIRO.",
      "VENCEU? GANHA FICHAS DO CASSINO! TROCA NA SALA DE PRÊMIOS, AQUI DO LADO.",
    ],
    poucos: "VOCÊ PRECISA DE PELO MENOS 1 POKÉMON QUE NÃO DESMAIOU PRA JOGAR.",
    tchau: "VOLTA QUANDO QUISER SE SUJAR!",
    comeca: "{RIVAL} ENTROU NA ARENA! 3... 2... 1... TINTA!",
    venceu: "SEU TIME VENCEU! VOCÊ GANHOU {FICHAS} FICHAS DO CASSINO!",
    perdeu: "SEU TIME FICOU TODO PINTADO... {RIVAL} VENCEU!",
    empate: "ACABOU O TEMPO E DEU EMPATE! TOMA {FICHAS} FICHAS PELO ESFORÇO.",
    tempoVoce: "ACABOU O TEMPO! SEU TIME LEVOU MENOS TIRO E VENCEU! +{FICHAS} FICHAS!",
    tempoEles: "ACABOU O TEMPO! O TIME DE {RIVAL} LEVOU MENOS TIRO E VENCEU!",
    saiu: "{NOME} FOI PINTADO!",          // letreiro: cabe numa linha
    total: "VOCÊ TEM {FICHAS} FICHAS.",
  },
};

/** O BALCÃO DE PRÊMIOS do cassino de CELADON: os prêmios do FireRed, pelos
 *  preços do FireRed, pagos em fichas. */
export const PREMIOS_FICHAS = {
  premios: [
    { especie: "abra", nivel: 9, preco: 180 },
    { especie: "clefairy", nivel: 8, preco: 500 },
    { especie: "dratini", nivel: 18, preco: 2800 },
    { especie: "scyther", nivel: 25, preco: 5500 },
    { especie: "porygon", nivel: 26, preco: 9999 },
  ],
  texto: {
    oi: "AQUI SE TROCA FICHA DO CASSINO POR PRÊMIO. VOCÊ TEM {FICHAS} FICHAS.",
    qual: "QUAL PRÊMIO VOCÊ QUER?",
    sair: "SAIR",
    falta: "VOCÊ NÃO TEM FICHAS SUFICIENTES. O PAINTBALL AQUI DO LADO DÁ FICHAS!",
    confirma: "{MON} POR {PRECO} FICHAS. FECHADO?",
    sim: ["SIM", "NÃO"],
    ganhou: "VOCÊ GANHOU {MON}! (SE A EQUIPE ESTIVER CHEIA, ELE VAI PRO PC)",
  },
};
