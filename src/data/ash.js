// O ASH: o CAMPEÃO SECRETO. Ele volta pra PALLET, a cidade dele, quando você
// fecha uma das histórias — vira CAMPEÃO DE BRAGLITCH (`flags.bragCampeao`, a
// LIGA de lá) ou pega o MISSINGNO. e conserta Kanto (`flags.caughtMissingno`)
// — e te desafia. O time é o do campeonato mundial, com o DRACOVISH no lugar
// do SCEPTILE. O lugar exato em PALLET é o chão livre mais perto de `perto`
// (src/scenes/overworld.js, `ashNpc`).
export const ASH = {
  nome: "ASH",
  sprite: "ash",
  mapa: "pallet",
  perto: [12, 12],
  requer: ["bragCampeao", "caughtMissingno"],     // basta UMA delas
  premio: 30000,
  time: [["dracovish", 82], ["lucario", 83], ["dragonite", 83], ["greninja", 84], ["charizard", 85], ["pikachu", 88]],
  antes: [
    "EI! VOCÊ É QUEM FECHOU A HISTÓRIA TODA, NÉ? O PROFESSOR CARVALHO NÃO PARA DE FALAR DE VOCÊ.",
    "EU SOU O ASH, AQUI DE PALLET MESMO. EU QUERO SER UM MESTRE POKÉMON!",
    "E PRA ISSO TEM QUE GANHAR DE QUEM É FORTE DE VERDADE. PIKACHU, TÁ PRONTO?",
    "PIKA PIKA!",
  ],
  depois: [
    "...UAU. FAZIA TEMPO QUE EU NÃO PERDIA ASSIM.",
    "MAS TUDO BEM! PERDER É SÓ O COMEÇO DA PRÓXIMA AVENTURA.",
    "O PIKACHU GOSTOU DE VOCÊ. E O PIKACHU NÃO GOSTA DE QUALQUER UM.",
  ],
  // falando com ele de novo, depois de dizer AGORA NÃO
  denovo: ["VOLTOU! O PIKACHU ESTAVA TE ESPERANDO.", "AGORA VAI?"],
};
