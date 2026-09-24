# Sprites

O jogo funciona sem nenhum arquivo aqui: enquanto uma pasta estiver vazia ele
desenha a arte provisória gerada em `src/core/assets.js` (silhuetas tintadas com a
cor do tipo). Assim que um PNG aparecer com o nome certo, ele é usado no lugar —
não precisa mexer em código, só recarregar a página.

## Pokémon (frente)

```
assets/sprites/pokemon/001.png     ← número da Pokédex com 3 dígitos
assets/sprites/pokemon/bulbasaur.png   ← ou o slug do nome (as duas formas valem)
```

Tamanho recomendado: 64x64 com fundo transparente (é o tamanho dos sprites de
batalha do FireRed). O jogo escala pra caber sozinho.

## Pokémon (costas)

```
assets/sprites/pokemon/back/001.png
```

Sem isso, o sprite de frente é espelhado como provisório.

## Pokémon (shiny)

```
assets/sprites/pokemon/shiny/001.png
assets/sprites/pokemon/shiny/back/001.png
```

**Opcional, e é a cor certa.** Sem arquivo aqui, o shiny é o filtro de
`src/core/assets.js`: a mesma arte com o matiz girado. O filtro tem um limite
conhecido — girar o matiz não mexe em pixel cinza, então bicho preto-e-branco
sai igual ao comum, que é o mesmo que não ter shiny. Quando o PNG existe, ele
ganha do filtro.

Pra baixar a arte shiny oficial (mesma fonte dos sprites comuns, e da mesma
geração, pra não misturar traço):

```bash
python3 tools/fetch_sprites.py --shiny --only 95,112,201     # espécies escolhidas
python3 tools/fetch_sprites.py --shiny --to 151              # Kanto inteira
```

`dev/shinycheck.html` mede quanto o shiny de cada espécie muda de cor (ΔE) e
mostra comum e shiny lado a lado — é de lá que sai a lista de quem precisa de
PNG próprio.

## O SPINDA é diferente

`pokemon/327.png` e `pokemon/shiny/327.png` **não vêm da PokeAPI**: eles são o
desenho LIMPO, sem mancha nenhuma, porque as quatro manchas do SPINDA são
carimbadas em tempo de execução pelo valor de personalidade do bicho (a mesma
conta dos jogos de verdade — veja `src/data/spinda.js`). O sprite da PokeAPI
vem com as manchas de UM Spinda assadas dentro; usar ele faria todo Spinda do
jogo sair idêntico.

```bash
python3 tools/fetch_spinda.py    # monta o 327 limpo e a tabela das manchas
```

O `fetch_sprites.py` sabe disso e pula o 327 mesmo com `--force`.

## Personagens do mapa

Uma folha por personagem, **4 colunas x 3 linhas**, cada quadro do mesmo tamanho
(16x16 no padrão do jogo):

```
coluna:  parado | passo A | parado | passo B
linha:   virado pra BAIXO / pra CIMA / pro LADO (direita; a esquerda é espelhada)
```

```
assets/sprites/overworld/hero.png
assets/sprites/overworld/prof.png    mae.png  garoto.png  garota.png
assets/sprites/overworld/velho.png   enfermeira.png  balconista.png  rival.png
```

## Retratos de treinador (batalha)

Um PNG de 64x64 por papel, com o **mesmo nome do sprite de overworld do NPC**
(`sprite: "brock"` em `src/data/maps.js` → `brock.png`). Ele aparece no lugar do
Pokémon inimigo enquanto o treinador fala, e sai deslizando quando ele solta o
primeiro Pokémon. Sem arquivo, a batalha começa direto, como antes.

```
assets/sprites/trainers/brock.png    misty.png  surge.png  erika.png
assets/sprites/trainers/koga.png     sabrina.png  blaine.png  giovanni.png
assets/sprites/trainers/cacador.png  garoto.png  garota.png  rival.png
```

Pra baixar do decomp do FireRed:

```bash
python3 tools/fetch_trainers.py            # líderes + os papéis usados no jogo
python3 tools/fetch_trainers.py --leaders  # só os oito líderes
python3 tools/fetch_trainers.py --list     # ver tudo que existe no decomp
```

## Tiles (16x16)

```
assets/sprites/tiles/grama.png        grama_alta.png  caminho.png  arvore.png
assets/sprites/tiles/agua.png         parede.png      telhado.png  telhado_centro.png
assets/sprites/tiles/telhado_loja.png porta.png       placa.png    cerca.png
assets/sprites/tiles/flores.png       barranco.png    piso.png     parede_interna.png
assets/sprites/tiles/balcao.png       cama.png        pc.png       tv.png
assets/sprites/tiles/planta.png       escada.png
```

## Cortando uma spritesheet

Se você tiver uma folha com vários sprites em grade, use o utilitário:

```bash
python3 tools/slice_sheet.py folha.png 64 64 assets/sprites/pokemon --start 1
# corta em quadros de 64x64 e salva 001.png, 002.png, ...
```

## Sobre direitos

Os sprites originais de Pokémon FireRed são da Nintendo / Creatures / Game Freak.

**Atenção:** ao contrário do que este arquivo dizia antes, o `.gitignore` NÃO
cobre `assets/sprites/` — os PNGs baixados aqui entram no repositório quando
você commita (hoje são uns 2300 arquivos). Se a intenção for não distribuir a
arte, acrescente `assets/sprites/pokemon/` ao `.gitignore` e tire os arquivos do
índice com `git rm --cached -r assets/sprites/pokemon`.
