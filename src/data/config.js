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

  // Chance de encontro por passo na grama alta
  encounterRate: 0.11,

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
