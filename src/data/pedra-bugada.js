// A PEDRA BUGADA: troca a forma do MISSINGNO. (src/data/species.js,
// FORMAS_MISSINGNO). Não se gasta, como o CATÁLOGO ROTOM. Vem junto, dentro
// da bola, na PRIMEIRA vez que você captura um MISSINGNO. de qualquer forma
// (src/scenes/battle.js, `guardarCapturado`).
export const PEDRA_BUGADA = {
  item: "pedra bugada",
  aceita: ["missingno", "missingnoambar", "missingnodomo", "missingnofantasma"],
  opcoes: [["missingno", "NORMAL"], ["missingnoambar", "ÂMBAR"], ["missingnodomo", "DOMO"], ["missingnofantasma", "FANTASMA"]],
  lore: "UMA PEDRA QUE NÃO RENDERIZA DIREITO: CADA VEZ QUE VOCÊ OLHA, ELA TEM OUTRO DESENHO.",
  pergunta: "{MON} ENCOSTA NA PEDRA. QUE DESENHO ELE VAI LER?",
  virou: "{MON} LEU O DESENHO ERRADO DE PROPÓSITO! AGORA É A FORMA {FORMA}.",
  normal: "{MON} VOLTOU A LER O PRÓPRIO DESENHO.",
  jaE: "{MON} JÁ ESTÁ NESSA FORMA.",
  nada: "{MON} OLHA PRA PEDRA E NÃO ENTENDE. SÓ UM MISSINGNO. LÊ ISSO.",
  ganhou: "DENTRO DA BOLA TINHA OUTRA COISA JUNTO: UMA PEDRA BUGADA!",
};
