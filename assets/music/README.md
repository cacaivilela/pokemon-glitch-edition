# Música

O jogo toca as faixas chiptune de `src/data/music.js` por padrão. Se você
colocar um arquivo de áudio aqui com o nome da faixa, ele é usado no lugar —
sem mexer em código, só recarregar a página.

```
assets/music/pallet.ogg      route.ogg     viridian.ogg   lab.ogg
assets/music/casa.ogg        center.ogg    mart.ogg       cave.ogg
assets/music/gym.ogg         titulo.ogg    batalha.ogg    batalhaGlitch.ogg
```

Extensões aceitas, nessa ordem: `.ogg`, `.mp3`, `.wav`, `.m4a`. O arquivo toca
em loop; corte o começo e o fim onde o loop fecha bem.

Os nomes são as chaves de `src/data/music.js` — e `src/data/maps.js` diz qual
faixa cada mapa usa (campo `music`).

## Sobre direitos

A trilha do Pokémon FireRed é da Nintendo / Creatures / Game Freak (composição de
Junichi Masuda e equipe). Este repositório **não distribui** nenhuma faixa e o
`.gitignore` ignora esta pasta inteira: o que você puser aqui fica só na sua
máquina. As faixas que vêm no projeto (`src/data/music.js`) são originais,
escritas no estilo da época.
