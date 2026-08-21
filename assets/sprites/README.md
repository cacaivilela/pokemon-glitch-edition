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
Este repositório **não distribui** nenhum deles — se você colocar arquivos aqui,
eles ficam só na sua máquina, e o `.gitignore` já evita commitá-los sem querer.
