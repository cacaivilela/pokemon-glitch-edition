# Música

O jogo toca as faixas chiptune de `src/data/music.js` por padrão. Se você
colocar um arquivo de áudio aqui com o nome da faixa, ele é usado no lugar —
sem mexer em código, só recarregar a página.

```
assets/music/abertura.ogg    pallet.ogg    route.ogg      viridian.ogg
assets/music/lab.ogg         casa.ogg      center.ogg     mart.ogg
assets/music/cave.ogg        gym.ogg       titulo.ogg     batalha.ogg
assets/music/ilha.ogg        glitchdim.ogg batalhaGlitch.ogg
```

`abertura.ogg` é a faixa da cutscene de abertura. Ela tem 80 segundos e a
abertura inteira é cortada em cima dela — se você puser um arquivo aqui com
outra duração, a imagem continua rodando no tempo dela e as pancadas da tela
deixam de cair nas batidas. Vale a pena cortar a faixa em 80s, ou aceitar o
desencontro.

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
