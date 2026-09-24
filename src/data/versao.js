// A versão publicada.
//
// O GitHub Pages guarda cada arquivo por dez minutos no navegador de quem
// abriu, e cada um com uma idade diferente. Logo depois de uma publicação, um
// navegador pode ficar com METADE dos arquivos novos e metade velhos — e aí um
// arquivo novo chama uma função que o velho ainda não tem. O erro aparece na
// hora em que aquele caminho é usado (numa batalha, por exemplo), e some
// sozinho dez minutos depois. Não é bug do jogo, e é impossível de achar sem
// saber disso.
//
// O jogo compara este número com o do servidor (buscado sem cache) e avisa
// quando a página está velha, em vez de deixar o jogador achar que quebrou.
// Suba um número aqui a cada publicação que valha um aviso.
export const VERSAO = "2026-09-24.1";

/** O VOLUME do jogo, o que aparece na tela de título. Não é o número técnico
 *  de cima: aquele sobe a cada publicação; este sobe quando o jogo ganha uma
 *  leva grande de coisa nova. O VOL. 4 é o das BATALHAS EM GRUPO (duplas e
 *  trios), das PROVAÇÕES espalhadas por Kanto e do MEWTHREE. */
export const VOLUME = "VOL. 4";
