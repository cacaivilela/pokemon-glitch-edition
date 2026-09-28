# Lugares novos de Braglitch — o formato

Cada grupo de lugares novos mora num arquivo próprio em `src/data/`
(`braglitch-sul.js`, `braglitch-norte.js`, `braglitch-centro.js`), que exporta:

```js
export const LUGARES = [
  {
    id: "curitiba",                 // minúsculo, sem acento: é o nome do mapa no save
    nome: "CURITYRANITAR",          // o que aparece na tela (MAIÚSCULO, com acento)
    tipo: "cidade",                 // "cidade" | "rota" | "praia"
    tema: "mata",                   // cor do chão: "mata" | "litoral" | "sertao" | "cerrado" | "serra"
    musica: "saolucario",           // "saolucario" (cidade/praia) | "br101" (rota)
    planta: [ /* strings de 30 caracteres, uma por fileira, 16 a 60 fileiras */ ],
    saidas: { right: 6 },           // ver "As saídas"
    niveis: [9, 14],                // nível do mato alto (obrigatório se tiver mato)
    mato: [["sauvinha", 20], ["acaizinho", 12]],   // [espécie, peso]
    npcs: [ /* ver "Os NPCs" */ ],
    placas: { 1: "CURITYRANITAR — ...\nSEGUNDA LINHA." },   // texto de cada dígito da planta
    centro: "BEM-VINDO AO CENTRO POKÉMON DE ...!",         // só cidade com C (fala da enfermeira)
  },
];
```

## A planta (um caractere por tile, largura SEMPRE 30)

| char | o que é | pisa? |
|---|---|---|
| `#` | árvore (borda do mapa, mata fechada) | não |
| `.` | grama | sim |
| `,` | mato alto (onde os selvagens aparecem) | sim |
| `P` | caminho de terra | sim |
| `a` | areia | sim |
| `F` | canteiro de flor | sim |
| `~` | água (só surfando) | não |
| `=` | píer / ponte de madeira | sim |
| `Y` | coqueiro | não |
| `o` | pedra | não |
| `R` | paredão de pedra | não |
| `v` | barranco (só se pula pra baixo) | só descendo |
| `e` | escadaria de pedra | sim |
| `1`–`9` | placa (texto em `placas`) | não |
| `h` | casa (porta fica trancada: "ninguém em casa") | não |
| `C` | CENTRO POKÉMON (tem interior de verdade) | não |
| `M` | LOJA (tem interior de verdade) | não |
| `I` | igrejinha (branca, com torre) | não |
| `K` | coreto da praça | não |
| `L` | prédio alto / laboratório (telhado cinza, antena) | não |
| `B` | barquinho (em cima da água) | não |
| `D` | a PORTA: logo ABAIXO da fileira de baixo de um prédio | sim (entra) |

**Prédio** = um retângulo de uma letra só (`hhhh` em 3–4 fileiras). A porta `D`
fica na fileira logo abaixo dele, e um caminho `P` chega até ela. Centro (`C`)
e loja (`M`): um de cada no máximo, com UMA porta. Cidade nova não tem ginásio.
Tamanhos que ficam bons: casa 4–5 de largura × 3 de altura; Centro/loja 5–6 × 3–4.

## As saídas

A borda do mapa é fechada (`#`), menos nas saídas, que são SEMPRE 2 tiles de
caminho `P` colados na borda:

- `up` / `down`: colunas **14 e 15** da primeira / última fileira → `saidas: { up: 14 }`
- `left` / `right`: DUAS fileiras seguidas na coluna 0 / 29 → `saidas: { left: 6 }`
  quer dizer fileiras 6 e 7. Use sempre o número que o pedido disser.

Só abra as saídas pedidas. De toda saída tem que dar pra andar até toda outra
saída e até toda porta.

## Os NPCs

```js
{ id: "povo0", x: 8, y: 9, dir: "down", sprite: "garoto",
  lines: ["FALA 1.", "FALA 2."], wander: true }                 // morador
{ id: "treinador0", x: 20, y: 12, dir: "left", sprite: "montanhista",
  lines: ["EI! ..."], afterLines: ["BOA LUTA."],
  trainer: { name: "PESCADOR BIU", prize: 400, sight: 4, party: [{ id: "piranhita", lvl: 14 }] } }
```

Sprites que existem: `garoto`, `garota`, `velha`, `velho`, `gentleman`, `pescador`,
`montanhista`, `lutador`, `tecnica`, `tecnico`, `motoqueiro`, `superf`,
`canalizadora`, `balconista`. NPC em chão (`.` `,` `F` `a`), fora do caminho
principal e sem fechar passagem. Texto: MAIÚSCULO, com acento, frases curtas
(cabe ~38 letras por linha na caixa; a caixa quebra sozinha).

## Conferir

```bash
gjs -m dev/checalugares.js src/data/braglitch-sul.js     # tem que dar 0 erro
```

E pra ver o desenho: com o servidor rodando (`python3 dev_server.py -p <porta>`),
`/dev/braglitcharte.html?arquivo=/src/data/braglitch-sul.js` pinta cada lugar e
grava em `dev/captures/braga_<id>.png`.
