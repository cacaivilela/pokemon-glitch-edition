// A tradução, no último instante possível.
//
// O jogo é escrito em português e continua assim nos arquivos: os diálogos, os
// nomes, as telas. O idioma entra na hora de MOSTRAR — `drawText` e a caixa de
// diálogo passam o texto por aqui antes de desenhar. Quem não achou tradução
// mostra o original, então trocar de idioma nunca deixa buraco na tela.
//
// Os dicionários ficam em src/data/idiomas.js (e têm hot-swap). Este módulo é
// só o interruptor, e mora no core pra que a fonte possa usá-lo sem depender
// dos dados do jogo.
let dic = null;
let atual = "pt";

/** Liga o dicionário deste idioma (null = português, o texto como escrito). */
export function usarIdioma(id, dicionario) {
  atual = id || "pt";
  dic = dicionario || null;
}

export const idiomaAtual = () => atual;

/** Devolve a frase traduzida, ou ela mesma. A busca é em MAIÚSCULA porque a
 *  fonte do jogo é maiúscula — e porque assim "Poção" e "POÇÃO" são a mesma
 *  entrada no dicionário. */
export function traduz(texto) {
  if (!dic) return texto;
  const s = String(texto);
  return dic[s.toUpperCase()] ?? s;
}
