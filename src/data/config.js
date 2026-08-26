// Configuração do jogo (hot-swap: salvar aqui recarrega sem reiniciar a partida).
export const CONFIG = {
  // Modo "Glitch Edition": tela corrompida, corrupção no save, MISSINGNO. na grama.
  // Desligado — o jogo roda 100% limpo, sem nenhum efeito que pareça bug.
  glitchMode: false,

  // Velocidade das animações de batalha (1 = normal, 0 desliga)
  battleAnim: 1,

  // DIA E NOITE (src/systems/ciclo.js). A fase troca a cada `cicloMinutos`, e os
  // últimos `viradaMinutos` dela são a virada: de dia começa a escurecer, de
  // noite começa a amanhecer. `noiteMax` é o quanto o céu escurece na noite
  // fechada — em 0 o ciclo continua acontecendo, mas ninguém vê.
  cicloMinutos: 15,
  viradaMinutos: 5,
  noiteMax: 0.58,
  cavernaEscura: 0.82,     // caverna é escura o dia inteiro; a lanterna abre o buraco

  // SELVAGENS À VISTA. Antes de existir isto, o mato era um lugar vazio que às
  // vezes cuspia uma batalha: o bicho não estava lá, ele ACONTECIA.
  //
  // O ENCONTRO INVISÍVEL POR PASSO NÃO EXISTE MAIS EM LUGAR NENHUM — nem em
  // Kanto, nem dentro da fenda. Batalha selvagem começa ENCOSTANDO num bicho
  // que está na tela: você nele, ou um bravo em você. A antiga `encounterRate`
  // saiu daqui junto; quem manda na frequência agora é `nascer`.
  selvagens: {
    quantos: 5,          // quantos ficam à vista de cada vez
    perto: 12,           // eles vivem neste raio de tiles em volta de você
    passo: 1.2,          // segundos entre um passinho e outro de cada um
    nascer: 2.0,         // segundos entre uma tentativa de nascer e outra
    some: 20,            // longe demais ou parado tempo demais, ele vai embora
    // BRAVOS: os que vêm PRA CIMA de você. QUEM ATACA É DECIDIDO PELA ESPÉCIE,
    // e a lista está em src/data/bravos.js — era um sorteio de 30% em cima de
    // todos, e aí o mesmo pidgey atacava num dia e fugia no outro: a rota não
    // ganhava reputação nenhuma e não dava pra aprender nada andando por ela.
    persegue: 5,         // de quantos tiles um bravo enxerga você
    pressa: 0.55,        // o passo do bravo, em fração do passo normal
    // O BOTE, como nos LEGENDS: o bravo que te alcança NÃO abre batalha. Ele
    // bate ali mesmo, no mapa, e pula pra trás. Abrir batalha ao encostar
    // tirava do jogador a única coisa que ele ganhou quando os bichos ficaram
    // visíveis: decidir. Do jeito novo, tomar pancada é a consequência de não
    // ter corrido, e lutar continua sendo escolha sua — é você que encosta.
    dano: 0.12,          // fração do HP máximo do seu líder por pancada
    recuo: 3,            // tiles que ele salta pra trás depois do bote
    respiro: 2.2,        // segundos de carência antes de você poder tomar outra
  },

  // Shiny solto pela grama de Kanto: 1 em 1024 selvagens vem com a cor trocada.
  // (dentro da fenda a regra é outra: 1 a cada SHINY_EVERY vistos, em extra.js)
  shinyOdds: 1 / 1024,

  // Fragmentos de portal glitch espalhados pelo mundo
  fragmentChance: 0.3,     // chance de aparecer um ao entrar num mapa
  fragmentSeconds: 180,    // 3 minutos dentro da dimensão antes dela fechar

  // Fuga: multiplica a chance da fórmula clássica (1 = original).
  // Em 4, fugir de selvagem é bem mais fácil — chefes continuam sem saída.
  fleeBoost: 4,

  // XP dividido: vencer um Pokémon dá experiência pra equipe inteira,
  // não só pra quem estava lutando.
  shareXp: true,
};
