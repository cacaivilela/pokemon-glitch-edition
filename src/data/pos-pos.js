// O PÓS-PÓS-GAME (ideia do CAIO): depois do GIRATINA (com o DLC GLITCH
// DIMENSION EXTREMA) — ou, sem o DLC, depois do MISSINGNO pego ou do título de
// campeão de BRAGLITCH —, o KYOGRE e o GROUDON SURTAM: KANTO SECA (o mar vira
// lama rachada, dá pra andar onde era água e os MAGIKARP ficam pulando no
// seco) e BRAGLITCH ALAGA (água rasa por cima do chão, anda-se mais devagar e
// o mato vira de bicho de água). Os dois brigam numa ILHA que sobe em cima da
// RUÍNA AFUNDADA da ROTA 20 (src/data/fundo-do-mar.js) — e lá é a batalha
// dupla contra os dois. Acabou, o mundo volta, e em Braglitch abre o PORTAL
// PARADOXO.
//
// A mecânica está em src/systems/pospos.js e src/scenes/overworld.js.

export const POS_POS = {
  ilha: { mapa: "route20", ruina: "ruina" },          // a ruína do fundo (SEGREDOS) vira a ilha
  nivel: 72,                                          // KYOGRE e GROUDON
  // quanto mais devagar se anda na água rasa de Braglitch
  devagarNaCheia: 0.75,

  comeca: [
    "...",
    "O CHÃO TREME. LONGE, NO MAR, ALGUMA COISA RUGE — DUAS COISAS.",
    "TRIM! TRIM! É O PROF. CARVALHO NO TELEFONE:",
    "\"ALÔ?! O KYOGRE E O GROUDON ACORDARAM AO MESMO TEMPO, E ESTÃO BRIGANDO!\"",
    "\"O GROUDON ESTÁ SECANDO O MAR DE KANTO. O KYOGRE ESTÁ ALAGANDO BRAGLITCH INTEIRA!\"",
    "\"ELES ESTÃO NUMA ILHA QUE SUBIU DO NADA NA ROTA 20, BEM EM CIMA DAQUELA RUÍNA AFUNDADA.\"",
    "\"O MAR SECOU: DÁ PRA IR ANDANDO. VAI LÁ, ANTES QUE NÃO SOBRE MUNDO PRA CONTAR!\"",
  ],
  briga: [
    "EM CIMA DA RUÍNA, O KYOGRE E O GROUDON SE ENFRENTAM.",
    "DE UM LADO CAI UMA CHUVA QUE NÃO PARA. DO OUTRO, O SOL RACHA A PEDRA.",
    "QUANDO VOCÊ CHEGA PERTO, OS DOIS PARAM... E OLHAM PRA VOCÊ.",
  ],
  // o fim: os dois se acalmam e a água volta CORRENDO (a onda atrás de você)
  calmos: [
    "O KYOGRE E O GROUDON SE ACALMARAM.",
    "...A ILHA COMEÇA A AFUNDAR. LÁ LONGE, UM BARULHO DE MAR VOLTANDO.",
    "UMA ONDA! CORRE!!",
  ],
  // onde você aparece depois da onda: a ILHA das SEAFOAM, do lado da ruína
  salvo: { x: 76, y: 5 },
  // o BARCO do resgate chega (o ROBÔ do CARVALHO dirigindo, um NOSEPASS do lado)
  chegou: [
    "UM BARCO VEM CORTANDO A ÁGUA... QUEM DIRIGE É UM ROBÔ!",
    "ROBÔ: BIP. RESGATE DO PROF. CARVALHO. PASSAGEIROS A BORDO. O NOSEPASS ESTÁ APONTANDO PRO NORTE. BIP.",
  ],
  // o que cada um fala (pelo desenho de quem é)
  falas: {
    prof: "VOCÊ ESTÁ INTEIRO?! EU VI A ONDA DA PRAIA E QUASE CAÍ DA CADEIRA!",
    ipe: "EU QUERIA VIR NA MINHA LANCHA, MAS O CARVALHO INSISTIU NO ROBÔ DELE. É MAIS LENTO, MAS CABE TODO MUNDO.",
    vitor: "EU DESENHEI TUDO DAQUI DO BARCO! VAI VIRAR TIRINHA: \"A ONDA QUE CORRIA ATRÁS\".",
    andre: "A GENTE VEIO ASSIM QUE VIU A ÁGUA VOLTANDO. VOCÊ CORRE RÁPIDO, HEIN!",
    hero: "CHEGAMOS A TEMPO! SOBE AÍ.",
    heroina: "A ÁGUA DE KANTO VOLTOU TODA DE UMA VEZ. QUE SUSTO!",
    hero_brag: "LÁ EM BRAGLITCH A ÁGUA ESCORREU AGORA MESMO. A GENTE VEIO CORRENDO TE AGRADECER!",
    heroina_brag: "A CHUVA PAROU E O SOL APARECEU EM BRAGLITCH. FOI VOCÊ, NÉ?",
    padrao: "...",
  },
  sobe: ["VOCÊ SUBIU NO BARCO. O ROBÔ VIROU O LEME E O NOSEPASS APONTOU PRA CASA."],
  acabou: [
    "O MAR VOLTOU PRO LUGAR EM KANTO, E A ÁGUA DE BRAGLITCH ESCORREU DE VOLTA PROS RIOS.",
    "PROF. CARVALHO: \"CONSEGUIU! ...MAS TEM OUTRA COISA.\"",
    "\"COM TANTA ÁGUA E TANTO SOL JUNTOS, ALGUMA COISA SE ABRIU EM BRAGLITCH. CHAMAM DE PORTAL PARADOXO.\"",
  ],
  magikarpSeco: "UM MAGIKARP PULANDO NO SECO. ELE NÃO SABE O QUE ACONTECEU COM O MAR.",
};
