// DECODIFICADOR DE GENOMA — a máquina que o PROF. CARVALHO entrega na primeira
// conversa. Ela lê o genoma de dois Pokémon da equipe e escreve UM só, e desfaz
// o que escreveu: separar devolve os dois exatamente como entraram.
//
//   CABEÇA  dá o rosto, o tipo primário, o nome que vem na frente e a parte
//           especial dos atributos (HP, ESP.ATK, ESP.DEF).
//   CORPO   dá o resto do desenho, o tipo secundário, o fim do nome e a parte
//           física (ATK, DEF, VELOCIDADE).
//
// Não existe tabela de fusões e não existe arquivo de sprite: o nome, os
// atributos e o desenho são montados na hora (o desenho em `fusao()`, em
// src/core/assets.js). É por isso que as 255x256 combinações do catálogo cabem
// aqui sem um único PNG novo — e por isso mexer nas regras abaixo com o jogo
// aberto muda a próxima fusão na hora, como todo o resto de src/data/.

const VOGAIS = "AEIOUÁÂÃÉÊÍÓÔÕÚ";
const ehVogal = (c) => VOGAIS.includes(c);
const letras = (nome) => String(nome || "").toUpperCase().replace(/[^A-ZÁÂÃÉÊÍÓÔÕÚÇ0-9]/g, "");

/** Onde começa a última sílaba: as consoantes que atacam a última vogal.
 *  BULBASAUR -> 5 (BULBA|SAUR), CHARMANDER -> 6 (CHARMA|NDER). */
function ultimaSilaba(s) {
  let i = s.length - 1;
  while (i >= 0 && !ehVogal(s[i])) i--;   // consoantes do fim (…UR)
  while (i >= 0 && ehVogal(s[i])) i--;    // o grupo de vogais (…AU…)
  while (i >= 0 && !ehVogal(s[i])) i--;   // as consoantes antes dele (…S…)
  return i + 1;
}

export const FUSAO = {
  /** o item-chave; abre a máquina pela mochila */
  item: "decodificador de genoma",

  /** o que a máquina anuncia no cabeçalho: 255 cabeças x 256 corpos.
   *  É o alcance do índice de um byte, não uma lista guardada em algum lugar —
   *  qualquer par que caiba nesses dois bytes ela escreve. */
  catalogo: { cabecas: 255, corpos: 256 },

  nomeMax: 11,          // cabe na lista da equipe e no balão da batalha
  corte: 0.46,          // altura do pescoço: daqui pra cima é a cabeça
  tintaCorpo: 0.5,      // quanto da cor da cabeça escorre no corpo (0 a 1)

  dexText: "GENOMA {CABECA}+{CORPO}, ESCRITO NO DECODIFICADOR. NÃO NASCEU ASSIM: FOI LIDO ASSIM.",

  /** total de combinações que o catálogo cobre */
  get combinacoes() { return this.catalogo.cabecas * this.catalogo.corpos; },

  /** o endereço da fusão dentro do catálogo, do jeito que a máquina mostra:
   *  um byte pra cabeça, um pro corpo. */
  codigo(cab, cor) {
    const b = (sp) => ((sp?.dex || 0) % 256).toString(16).toUpperCase().padStart(2, "0");
    return `0x${b(cab)}${b(cor)}`;
  },

  /** NOME: começo da cabeça + última sílaba do corpo.
   *  BULBASAUR + CHARMANDER = BULBANDER; PIKACHU + SQUIRTLE = PIKARTLE. */
  nome(nomeCab, nomeCor) {
    const A = letras(nomeCab), B = letras(nomeCor);
    if (!A || !B) return (A + B).slice(0, this.nomeMax) || "???";
    let corte = ultimaSilaba(A);
    if (corte < 2) corte = Math.max(2, Math.ceil(A.length / 2));
    let inicio = ultimaSilaba(B);
    if (B.length - inicio < 2) inicio = Math.max(0, B.length - Math.max(2, Math.floor(B.length / 2)));
    const fim = B.slice(inicio);
    let nome = A.slice(0, corte) + fim;
    if (nome.length > this.nomeMax) nome = A.slice(0, Math.max(2, this.nomeMax - fim.length)) + fim;
    return nome.slice(0, this.nomeMax) || "???";
  },

  /** ATRIBUTOS: 2/3 de quem manda naquele atributo, 1/3 do outro. */
  stats(cab, cor) {
    const mix = (dono, outro) => Math.floor((2 * dono + outro) / 3);
    return {
      hp:  mix(cab.hp,  cor.hp),
      atk: mix(cor.atk, cab.atk),
      def: mix(cor.def, cab.def),
      spa: mix(cab.spa, cor.spa),
      spd: mix(cab.spd, cor.spd),
      spe: mix(cor.spe, cab.spe),
    };
  },

  /** TIPOS: o primeiro da cabeça e o segundo do corpo (o único dele, se só tem
   *  um). Deu igual, a fusão sai com um tipo só. */
  tipos(cab, cor) {
    const t1 = cab.types[0];
    const t2 = cor.types[1] || cor.types[0];
    return t1 === t2 ? [t1] : [t1, t2];
  },

  /** O EDITOR (src/scenes/fusaoeditor.js). O desenho é 256x256: quatro vezes o
   *  sprite de 64x64 que a batalha usa. Dá pra desenhar com folga, e o jogo
   *  reduz na hora de mostrar — o arquivo do save guarda o desenho grande.
   *  Trocar `tamanho` aqui muda o editor inteiro; desenhos antigos continuam
   *  valendo, eles são redimensionados ao abrir. */
  editor: {
    // 64x64: o MESMO tamanho que a batalha desenha. O que você pinta aqui é
    // pixel por pixel o que aparece no jogo — sem redução no meio, que é o que
    // borrava o traço fino quando a tela era maior que o sprite.
    tamanho: 64,
    // pixels de tela por pixel do desenho. O 2 é o "cabe tudo": 64x64 inteiro
    // dentro da janela de 128x128 — é onde o editor abre.
    zooms: [2, 4, 8, 16],
    zoomInicial: 0,
    pinceis: [1, 2, 4, 8],
    undo: 12,                     // quantos passos dá pra voltar
    // Paletas do estúdio. A primeira é montada na hora com as cores dos DOIS
    // Pokémon que estão sendo fundidos (as mais usadas nos sprites deles) —
    // as outras são fixas. P passa pra próxima, ou clique nas setas.
    paletas: [
      { nome: "PADRÃO", cores: [
        "#000000", "#ffffff", "#5a6270", "#a8b0bc",
        "#e0524a", "#f5a05a", "#f0c419", "#8a5a2f",
        "#4cd06a", "#1f7a3a", "#4f8ce0", "#1c3f8a",
        "#b455ff", "#ff0066", "#00ffcc", "#f2d0b0",
      ] },
      { nome: "GAME BOY", cores: [
        "#0f380f", "#306230", "#8bac0f", "#9bbc0f",
        "#0f380f", "#1e5128", "#4b8a3a", "#c6de8a",
        "#081808", "#204020", "#68a038", "#d8e8a0",
        "#000000", "#2c4c2c", "#7ea850", "#e8f0c0",
      ] },
      { nome: "PELE E PELO", cores: [
        "#3a2418", "#5c3a24", "#8a5a34", "#b98a52",
        "#e0b98a", "#f2d0b0", "#fbe8d0", "#ffffff",
        "#2a1a12", "#4a2c1c", "#6e4526", "#9c6a3c",
        "#c99a62", "#e8c79a", "#3f3f46", "#12100e",
      ] },
      { nome: "FOGO E BRASA", cores: [
        "#2a0a06", "#5c1408", "#8c2408", "#c43c0c",
        "#e86818", "#f59c28", "#ffd35c", "#fff2b0",
        "#1a0a12", "#4a1030", "#8a1c4c", "#d43060",
        "#ff6a8a", "#ffffff", "#6a2a10", "#000000",
      ] },
      { nome: "ÁGUA E GELO", cores: [
        "#04121f", "#0a2440", "#124070", "#1c62a8",
        "#2f8ad4", "#5cb4ea", "#9adcf6", "#e6faff",
        "#0a2a2a", "#12484a", "#1c7a72", "#2fb09c",
        "#7fe0cc", "#ffffff", "#3a4a5a", "#000000",
      ] },
      { nome: "MATO E PEDRA", cores: [
        "#0c1a08", "#16300f", "#22521a", "#31782a",
        "#4c9c3c", "#79c45a", "#b2e68a", "#e8f8c8",
        "#241c14", "#3d3226", "#5e5040", "#877560",
        "#b0a088", "#d8ccb4", "#000000", "#ffffff",
      ] },
      { nome: "GLITCH", cores: [
        "#000000", "#101018", "#2a1040", "#5a1a86",
        "#b455ff", "#e0a0ff", "#00ffcc", "#7dffe8",
        "#ff0066", "#ff6a9c", "#ffffff", "#c8c8d8",
        "#ffd166", "#3f7dff", "#0a3a30", "#1a0a24",
      ] },
    ],
  },

  /** A ficha que a máquina calcularia sozinha, no modelo do editor: quanto cada
   *  atributo VALE no nível 0 e quanto ele SOBE por nível. Sai da fórmula
   *  normal do jogo, então uma fusão recém-criada nasce igualzinha à automática
   *  — o que você mexer daí em diante é seu. */
  ficha(sp) {
    const inicial = {}, crescimento = {};
    for (const k of ["hp", "atk", "def", "spa", "spd", "spe"]) {
      const porNivel = sp.base[k] / 50 + (k === "hp" ? 1 : 0);
      crescimento[k] = Math.round(porNivel * 10) / 10;
      inicial[k] = k === "hp" ? 10 : 5;
    }
    return { nome: sp.name, tipos: [...sp.types], inicial, crescimento };
  },

  /** O valor de um atributo num nível, no modelo do editor. */
  valor(ficha, k, level) {
    const v = Math.floor((ficha.inicial?.[k] ?? (k === "hp" ? 10 : 5))
      + (ficha.crescimento?.[k] ?? 1) * Math.max(1, level));
    return Math.max(1, Math.min(999, v));
  },

  /** GOLPES: o learnset dos dois, sem repetir, cada um no nível mais baixo em
   *  que aparece. A fusão aprende o que qualquer um dos lados aprenderia. */
  learnset(cab, cor) {
    const menor = new Map();
    for (const [lvl, id] of [...(cab.learnset || []), ...(cor.learnset || [])]) {
      if (!menor.has(id) || menor.get(id) > lvl) menor.set(id, lvl);
    }
    return [...menor].map(([id, lvl]) => [lvl, id]).sort((a, b) => a[0] - b[0]);
  },
};
