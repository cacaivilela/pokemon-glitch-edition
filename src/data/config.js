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

  // Chance de encontro por passo na grama alta.
  //
  // SÓ VALE DENTRO DA 011GLITCHDIMENSION110. Em Kanto o encontro invisível
  // acabou: batalha selvagem começa ENCOSTANDO num bicho que está na tela (ver
  // `selvagens` aqui embaixo). Na fenda ele fica, porque lá o mapa é gerado por
  // terreno (ar / terra / água) e os bichos à vista não sabem ler isso — e
  // porque a fenda não é lugar de escolher com quem lutar.
  encounterRate: 0.11,

  // SELVAGENS À VISTA. Antes de existir isto, o mato de Kanto era um lugar
  // vazio que às vezes cuspia uma batalha: o bicho não estava lá, ele
  // acontecia. Agora alguns andam pela grama, na cara do jogador, e pisar em
  // cima começa a batalha com AQUELE. A grama continua sorteando encontro
  // invisível por passo (`encounterRate`) — os dois convivem: um é o susto de
  // sempre, o outro é poder escolher.
  selvagens: {
    quantos: 5,          // quantos ficam à vista de cada vez
    perto: 12,           // eles vivem neste raio de tiles em volta de você
    passo: 1.2,          // segundos entre um passinho e outro de cada um
    nascer: 2.0,         // segundos entre uma tentativa de nascer e outra
    some: 20,            // longe demais ou parado tempo demais, ele vai embora
    // BRAVOS: os que vêm PRA CIMA de você. O resto anda à toa e nunca encosta —
    // se todos atacassem, andar pela grama viraria correr de cinco perseguidores
    // ao mesmo tempo, e a escolha de com quem lutar acabaria.
    bravos: 0.3,         // parte deles que ataca
    persegue: 5,         // de quantos tiles um bravo enxerga você
    pressa: 0.55,        // o passo do bravo, em fração do passo normal
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
