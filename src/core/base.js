// Onde este jogo está pendurado.
//
// Rodando em casa, pelo dev_server.py, ele mora na raiz: `/src/main.js`,
// `/assets/...`, `/__save`. Publicado no GitHub Pages ele mora numa SUBPASTA
// (`/pokemon-glitch-edition/`), e todo caminho que começa com "/" passa a
// apontar pro lugar errado — pra fora do jogo.
//
// Então ninguém escreve caminho absoluto na mão: tudo que carrega arquivo ou
// fala com o servidor passa por `url()`, que gruda a raiz certa na frente. A
// raiz sai do endereço deste próprio módulo, que está sempre em `src/core/`.
export const RAIZ = new URL("../../", import.meta.url).pathname;

/** A VERSÃO DOS ARQUIVOS. Vai grudada (`?v=`) em todo arquivo de assets/: o
 *  navegador guarda imagem com o mesmo nome, e um sprite trocado (os do FireRed
 *  viraram os do Black/White) continuava aparecendo velho em quem já tinha
 *  jogado. Mudou arquivo de assets/ e vai publicar? Troque este número. */
export const VERSAO = "2026-10-15";

/** `url("assets/maps/kanto.json")` -> "/pokemon-glitch-edition/assets/maps/kanto.json?v=..." */
export const url = (caminho) => {
  const c = String(caminho).replace(/^\/+/, "");
  if (!c.startsWith("assets/")) return RAIZ + c;
  return RAIZ + c + (c.includes("?") ? "&" : "?") + "v=" + VERSAO;
};

/** true quando o jogo não está na raiz do site (ou seja, publicado numa pasta) */
export const emSubpasta = () => RAIZ !== "/";
