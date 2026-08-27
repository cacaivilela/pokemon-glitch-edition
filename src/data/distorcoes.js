// AS DISTORÇÕES ESPAÇO-TEMPO.
//
// Elas não moram num lugar. A cada `intervalo` minutos uma abre em algum canto
// de Kanto, o jogo AVISA ONDE, e ela fica lá até a próxima abrir — então existe
// sempre exatamente uma no mundo, e sempre dá pra saber onde.
//
// POR QUE AVISAR: a primeira versão era uma distorção parada no meio da FLORESTA
// VIRIDIAN, sem aviso nenhum. A tela mostra 10 tiles de altura e a floresta tem
// 69: quem estava a dezessete passos dela não tinha como saber que ela existia,
// e "procure no meio da floresta" não é uma pista, é um mapa que o jogador tem
// que desenhar sozinho. Um evento que acontece e não se anuncia é um evento que
// não acontece.
//
// O que sai delas é FÓSSIL VIVO, e essa escolha é o argumento da coisa: se
// saísse um bicho qualquer da fenda, seriam buracos pra outro LUGAR, e o jogo já
// tem de sobra. Saindo bicho que morreu há milhões de anos, são buracos pra
// outro TEMPO.
export const DISTORCOES = {
  /** minutos de relógio entre uma e a próxima */
  intervalo: 5,
  /** quantos fósseis saem quando você encosta */
  quantos: 4,
  nivel: [12, 20],
  saem: ["cranidos", "shieldon", "lileep", "anorith", "tirtouga", "archen"],
  /** Mapas onde ela NÃO abre. Dentro de casa não tem céu pra rasgar, e a fenda
   *  já é um rasgo — abrir um rasgo dentro do rasgo não quer dizer nada. */
  fora: ["glitchdim", "home"],
};
