// O MUNDO: onde as fusões publicadas moram quando não é aqui.
//
// Em casa, publicar escreve num arquivo e o dev_server empurra pro repositório.
// No jogo publicado na web não existe servidor nenhum — o GitHub Pages só
// entrega arquivo pronto — então quem joga pelo site não conseguia publicar nem
// receber o que os outros publicaram.
//
// `servidor` é o endereço do serviço que resolve isso (o código dele está em
// servidor/mundo.ts, e sobe de graça no Deno Deploy). Com ele preenchido:
//
//   PUBLICAR   manda a ficha pra lá, de qualquer lugar, inclusive do site;
//   ATUALIZAR  baixa o que todo mundo publicou, de qualquer lugar.
//
// Vazio, o jogo se vira como antes: publica no arquivo local e usa o git pra
// mandar pro mundo — o que só funciona na máquina de quem tem o repositório.
export const MUNDO = {
  servidor: "",          // ex.: "https://mundo-glitch.deno.dev"
  /** quanto tempo o que foi baixado vale antes de valer a pena buscar de novo */
  validadeMin: 10,
  /** teto do que o jogo guarda no navegador (o desenho de cada ficha pesa) */
  maxFichas: 400,
};
