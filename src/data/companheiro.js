// FALAR COM O COMPANHEIRO: virar pro Pokémon que te segue e apertar A, como
// em HeartGold/SoulSilver. Ele vira pra você, solta o grito, um balãozinho
// aparece em cima dele e o jogo conta como ele está (src/scenes/overworld.js,
// `falarComCompanheiro`). A primeira linha que bater ganha; as do fim são
// sorteadas. {MON} é o apelido dele.
//
// O `tom` escolhe qual das três onomatopeias dele sai (src/data/gritos):
// "alegre" a alegre, "baixo" a do outro clima; sem `tom`, sorteia.
//
// O carinho aproxima: +1 de AMIZADE, no máximo uma vez a cada `intervalo`
// segundos — senão apertar A sem parar viraria a máquina de evoluir por
// amizade.
export const COMPANHEIRO = {
  intervalo: 300,
  // balões: ♥ coração, ♪ nota, ! susto/alegria, ? curiosidade, … cansaço, Z sono
  passandoMal: { tom: "baixo", emote: "…", texto: "{MON} ESTÁ PASSANDO MAL. MELHOR PASSAR NUM CENTRO POKÉMON." },
  cansado: { tom: "baixo", emote: "…", texto: "{MON} ESTÁ CANSADO, MAS CONTINUA FIRME DO SEU LADO." },
  corrompido: { emote: "?", texto: "{MON} PISCA... POR UM INSTANTE ELE PARECEU OUTRO BICHO." },
  sono: { tom: "baixo", emote: "Z", texto: "{MON} BOCEJA. JÁ ESTÁ TARDE..." },
  inseparavel: { tom: "alegre", emote: "♥", texto: "{MON} ESFREGA A CABEÇA EM VOCÊ. VOCÊS SÃO INSEPARÁVEIS!" },
  amigo: { tom: "alegre", emote: "♪", texto: "{MON} ESTÁ FELIZ DE ANDAR COM VOCÊ." },
  brilho: { tom: "alegre", emote: "!", texto: "O BRILHO DE {MON} REFLETE NA LUZ. ELE PARECE ORGULHOSO." },
  // quando nada de cima bate: uma destas
  qualquer: [
    { emote: "?", texto: "{MON} OLHA PRA VOCÊ, CURIOSO." },
    { emote: "!", texto: "{MON} PULA DE ALEGRIA!" },
    { emote: "♪", texto: "{MON} CANTAROLA BAIXINHO." },
    { emote: "?", texto: "{MON} FAREJA O CHÃO, ATRÁS DE ALGUMA COISA." },
    { emote: "♥", texto: "{MON} GOSTOU DO CARINHO!" },
  ],
};
