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

/** `url("assets/maps/kanto.json")` -> "/pokemon-glitch-edition/assets/maps/kanto.json" */
export const url = (caminho) => RAIZ + String(caminho).replace(/^\/+/, "");

/** true quando o jogo não está na raiz do site (ou seja, publicado numa pasta) */
export const emSubpasta = () => RAIZ !== "/";
