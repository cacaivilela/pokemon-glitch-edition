# Pokémon Glitch Edition

Fangame 2D de Pokémon FireRed em **Kanto**, com **só os 151 da primeira geração**.
Boilerplate próprio + live update: roda direto no navegador com ES modules
nativos — sem build, sem npm, sem dependências. O único requisito é Python 3
(serve os arquivos, empurra o live reload e roda os importadores de assets).

```bash
./run.sh              # http://localhost:5173
./run.sh 5178         # outra porta
```

Edite qualquer arquivo e salve: o navegador reage sozinho.

## Assets do FireRed

O jogo funciona sem baixar nada (usa arte provisória gerada em código), mas fica
igual ao original com três comandos:

```bash
python3 tools/fetch_sprites.py     # 151 Pokémon, frente e costas (64x64)
python3 tools/fetch_sprites.py --mega   # as 15 formas MEGA
python3 tools/fetch_overworld.py   # personagens do mapa (Red, Prof. Carvalho, enfermeira...)
python3 tools/fetch_maps.py        # os mapas de Kanto: desenho, colisão, grama, barrancos, portas
```

- `fetch_sprites.py` → `assets/sprites/pokemon/001.png` (+ `back/`)
- `fetch_overworld.py` → `assets/sprites/overworld/hero.png` etc., já convertidos
  pro formato do jogo (4 colunas x 3 linhas: baixo/cima/esquerda; a direita é
  espelhada, como no jogo original). `--list` mostra os 96 personagens disponíveis;
  `python3 tools/fetch_overworld.py chefe=giovanni` adiciona um novo papel.
- `fetch_maps.py` → `assets/maps/<mapa>.png` + `assets/maps/kanto.json`. Ele monta
  cada metatile 16x16 a partir dos tiles 8x8 + paletas do jogo e extrai colisão,
  comportamento (grama alta, barranco, água), portas e as conexões entre mapas.

Também dá pra usar arte própria: `tools/slice_sheet.py` fatia uma spritesheet, e
qualquer PNG colocado à mão nas pastas de `assets/sprites/` é usado no lugar.

> Arte e dados originais são da Nintendo / Creatures / Game Freak. Nada disso é
> redistribuído aqui: os importadores baixam para a **sua** máquina e o
> `.gitignore` impede que entrem no repositório. O código, os diálogos, o motor e
> a arte provisória são originais.

## Controles

| Tecla | Ação |
|---|---|
| Setas / WASD | andar |
| Z / Enter | A (confirmar, falar, atacar) |
| X / Esc | B (voltar, abrir o menu no mapa) |
| Shift | correr |
| F | HUD de debug (FPS, coordenadas) |
| C | na batalha: arma a MEGA EVOLUÇÃO |
| M | mudo |
| ENTER / ESC | no chat e no nome da sala: manda / desiste (ali o teclado vira texto) |

## O que dá pra jogar

Sua casa → **Vila Paleta** → laboratório do **Prof. Carvalho** (escolha entre
Bulbasaur, Charmander e Squirtle) → **Rota 1**, com grama alta, barrancos que só
descem e o Jovem Tiago pra batalhar → **Cidade Viridian**, com Centro Pokémon
(cura de graça), Loja Pokémon (compra) e o velhote que dá Poções. Os mapas são os
originais do FireRed, com as conexões de verdade entre eles.

Batalha por turnos completa: os 16 tipos de Kanto com a tabela do FireRed, STAB,
crítico, queimadura/paralisia/veneno, alterações de atributo, PP, XP, level up,
aprender golpe, troca de Pokémon, item e captura com a fórmula de chacoalhada.

**Animações**: transição de batalha com flashes e barras, sprites entrando
deslizando, avanço no golpe, piscada ao levar dano, queda ao desmaiar, barra de
HP animada, tufo de grama ao pisar na grama alta, caminhada de 4 quadros e Poké
Bola chacoalhando na captura.

## Mega evolução

As **15 MEGA de Kanto** existem aqui (VENUSAUR, CHARIZARD X e Y, BLASTOISE,
BEEDRILL, PIDGEOT, ALAKAZAM, SLOWBRO, GENGAR, KANGASKHAN, PINSIR, GYARADOS,
AERODACTYL, MEWTWO X e Y) — mais uma **décima sexta que não devia existir**.

Precisa de duas coisas na mochila: o **ANEL MEGA**, que o PROF. CARVALHO entrega
na primeira volta ao laboratório depois da primeira insígnia (junto com a
megapedra do seu inicial — e a dos outros dois, se um dia eles caírem na sua
equipe), e a **megapedra** da espécie. Aí, dentro da batalha, `C` acende a marca
**MEGA** ao lado dos golpes; o golpe escolhido sai depois da transformação.
No CHARIZARD e no MEWTWO o `C` passa pelas duas formas (X e Y) antes de desligar.

Uma por batalha, e só enquanto ela dura: no fim da luta ele volta a ser o que
era. Nada disso vai pro save — quem fecha a aba no meio de uma batalha volta com
o Pokémon normal (`reverterTudo`, em `src/systems/mega.js`).

**As outras 11 pedras estão largadas por Kanto**, sempre num canto de chão limpo:
Floresta Viridian, Rota 3, Cidade Saffron, Rota 12, Vila Lavanda, Cidade Fuchsia,
Rota 13, Rota 25, Monte Lua B2F e os dois andares da Estrada da Vitória. As
coordenadas estão em `src/data/maps.js`, como qualquer outro item de chão.

A **MISSINGNITA** é a exceção: ela não caiu do céu com as outras, nasceu junto
com o canteiro de flores de **Vila Paleta** — o mesmo canteiro que o MISSINGNO.
usa pra encostar no mundo. É item escondido: nenhum sprite no chão, só acha quem
parar em cima e apertar `Z`. Ela não mega evolui coisa nenhuma: **sobrescreve**.
DEFESA 0, ESP.DEF 0, o resto em 255. E, na caçada final, o próprio MISSINGNO.
acha a pedra dele na metade da vida — ninguém precisou dar nada a ele.

Os dados ficam em `src/data/mega.js` (uma tabela: espécie de origem, nome da
forma, pedra, sprite e stats) e têm hot-swap como todo o resto de `src/data/`.
Atalho de dev: `?mega=1` na URL enche a mochila com o anel e as 16 pedras.

## Modo Glitch

`src/data/config.js` tem `glitchMode: false`. Desligado (o padrão), o jogo é 100%
limpo — nenhum efeito que pareça bug. Ligando, volta a identidade do projeto:
corrupção acumulada no save, distorção de tela e o **MISSINGNO.** aparecendo na
grama alta.

## 011GLITCHDIMENSION110

A fenda tem conteúdo que não existe em Kanto:

- **23 espécies exclusivas** (`src/data/extra.js`), divididas por terreno do tile
  — terra, água e o vazio no meio. São dados soltos (PORYGON2/-Z, UNOWN,
  SHEDINJA, ROTOM…), fósseis remontados errado (CRANIDOS, ARCHEN, DRACOVISH…) e
  coisas que não deviam caber ali (LUNATONE, CRYOGONAL, GOLETT).
- **Lendários**: o trio do clima aparece só no terreno dele (0,3%) e o DEOXYS
  pode vir de qualquer tufo, mais raro ainda (0,08%).
- **Pokébolas largadas no chão**: 3 a 6 por visita, sorteadas pela tabela de
  `src/data/loot.js`. A maioria é item comum, mas 1 em cada 9 traz **UP-GRADE**
  ou **DUBIOUS DISC** — que evoluem PORYGON → PORYGON2 → PORYGON-Z pela mochila.
  O que você não pegar some quando a fenda fecha.
- **Fragmentos de portal**: a chance de aparecer um sobe a cada mapa em que você
  entra (`SPOT_STEP` em `src/data/fragments.js`). Ao chegar em 100% o fragmento é
  garantido e a chance cai pra 49%, recomeçando o ciclo.

Os sprites das espécies de fora vêm com `python3 tools/fetch_sprites.py --extra`.

## Golpes fora da batalha

Não existe HM neste jogo: se o Pokémon sabe o golpe, ele usa (`src/data/field.js`).

- **SURFAR** — encoste na água e confirme. Você atravessa montado no Pokémon
  (o sprite dele aparece embaixo do herói) e desce sozinho ao pisar em terra.
- **CORTE** — usado no mato alto: o tufo fica aparado pra sempre naquele save,
  e ali não nasce mais encontro.
- **VOAR** — aparece no menu principal quando alguém da equipe sabe. Lista só as
  cidades onde você já pisou.

- **QUEBRA-ROCHA** — pedras rachadas espalhadas pelo mundo (Rota 1, Rota 2,
  Floresta Viridian, Monte Lua, Túnel Rocha). Quebrou, sumiu pra sempre.
- **FORÇA** — blocos de pedra: depois de usar o golpe uma vez, é só andar contra
  o bloco pra empurrar, um tile por vez, enquanto tiver chão livre do outro lado.

Os obstáculos ficam em `src/data/maps.js` (`pedras` e `blocos`, por mapa) e o que
você quebrou ou empurrou fica gravado no save.

O **LAPRAS aprende SURFAR no nível 70**, pelo learnset dele. Outros Pokémon de
água aprendem a partir do 40, e a regra por tipo nunca fura o nível da espécie.

## SRTA. JOY: trocar golpes

A enfermeira do Centro Pokémon agora pergunta o que você quer: **CURAR** ou
**TROCAR GOLPES**. No segundo caso ela lista o que aquele Pokémon pode aprender —
tudo do learnset da espécie até o nível atual, mais os golpes de campo que o tipo
dele permite (esses saem em roxo na lista). Com menos de 4 golpes ele só aprende;
com 4, ela pergunta qual sai.

## Trilha sonora

As músicas são **originais**, escritas no estilo das faixas de GBA — melodia em
onda quadrada, contracanto, baixo em triângulo e um chiado de percussão. Não são
as faixas do FireRed (essas são da Nintendo / Game Freak): a ideia é soar do mesmo
tempo e do mesmo aparelho.

Ficam em `src/data/music.js`, então dá pra reescrever uma melodia **com o jogo
rodando** — o hot-swap troca a trilha na hora. Formato:

```js
route: { bpm: 142, tracks: [
  { wave: "square",   vol: 0.5, notes: [["C5", 0.5], ["E5", 0.5], ["G5", 1]] },
  { wave: "triangle", vol: 0.6, notes: [["C3", 1], ["G2", 1]] },
  { wave: "ruido",    vol: 0.35, notes: [["x", 1], ["-", 1]] },
] }
```

Cada canal roda no próprio comprimento — com tamanhos diferentes, a repetição
demora a ficar óbvia. O agendamento usa o relógio do WebAudio (com 0,4 s de
antecedência), então a música não tropeça quando a aba engasga.

## BILHETE VOO

O **BILHETE VOO** (achado na fenda, ou no chão do laboratório) é um bilhete com o
campo "PARA" em branco: dobrado, ele vira avião de papel e pousa em **qualquer
cidade de Kanto** — inclusive nas que você ainda não visitou, e sem precisar de
ninguém na equipe que saiba **VOAR**. Ele se desdobra inteiro no pouso, então
serve pra sempre.

Usa da mochila (`Z` em cima do item), abre a lista de destinos de
`FLY_SPOTS` (`src/data/field.js`) e cai no `spawn` do mapa escolhido. O texto e as
regras de cada bilhete ficam em `STORY.bilhetes` (`src/data/story.js`); o
**BILHETE AURORA**, que leva pra BIRTH ISLAND e volta, continua igual.

Não dá pra usar dentro de casa nem surfando — o avião precisa de céu aberto.

## Online

O mesmo `dev_server.py` que serve o jogo também é o servidor da sala. Ele imprime
o endereço da rede ao ligar:

```
  ->  http://localhost:5173/
  na mesma rede, os outros entram por http://192.168.0.10:5173/
```

Quem abrir esse endereço está jogando **a partida dele**, no seu servidor. Sem
cadastro, sem npm e sem serviço de fora: é SSE pra receber (`/__net`) e POST pra
falar, o mesmo par que o live update já usava.

**Um save por computador continua valendo** — só que agora o servidor escolhe o
arquivo por quem pediu: esta máquina usa `save/save.json` e cada máquina que entra
pela rede ganha o `save/rede-<ip>.json` dela. Pra abrir dois jogadores no MESMO
computador (testar sem uma segunda máquina), use `?perfil=`:

```
http://localhost:5173/                 # você
http://localhost:5173/?perfil=amigo    # o outro, com save próprio
```

Tudo fica no menu `X` → **ONLINE**:

- **SALA** — abre o submenu da sala. Salas diferentes não se veem; a padrão,
  em que o jogo entra sozinho, é `kanto` (`salaPadrao` em `src/data/online.js`).
  - **CRIAR SALA** — sorteia um código de 5 letras (sem I, O, 0 e 1, que ninguém
    lê direito) e pergunta se ela é **ABERTA** — aparece pra quem procurar — ou
    **PRIVADA**, que só recebe quem sabe o código. Passe o código pro seu amigo.
  - **ENTRAR POR CÓDIGO** — digitou o código, entrou. Se a sala não existir, ela
    nasce ali: criar e entrar são a mesma coisa.
  - **SALAS ABERTAS** — a lista das salas públicas do servidor, com quanta gente
    tem em cada uma. Sala que fica vazia deixa de existir.
  - **SAIR DA SALA**.

  Só quem cria decide se a sala é privada: quem chega depois não muda isso,
  senão qualquer um escondia a sala dos outros.
- **QUEM ESTÁ AQUI** — quem está na sala, e quem está no seu mapa. Escolhendo
  alguém dá pra **chamar pra trocar** ou **desafiar**.
- **CONVERSAR** / **FRASES PRONTAS** / **EMOTE** — o que você fala aparece num
  balão em cima da sua cabeça, pra todo mundo da sala. As frases e os emotes
  ficam em `src/data/online.js` e têm hot-swap como o resto dos dados.

Na tela só aparece **o que veio de gente**: o balão de fala e a resposta de quem
você chamou pra trocar ou batalhar. Os recados do jogo sobre a sala — "FULANO
ENTROU", "A CONEXÃO CAIU" — são invisíveis, pra sala parecer o mapa de sempre e
não um chat de servidor. Pra vê-los (depurar a sala, por exemplo) é só ligar
`avisosDoSistema` em `src/data/online.js`.

Os outros **aparecem andando no seu mapa**, com o nome em cima, e entram na mesma
lista de atores que os NPCs — então passam por trás da copa das árvores e do
telhado igualzinho a você. A posição só vai pela rede quando muda, e o movimento
é suavizado do outro lado (`suavizacao`), então um passo não pula.

### Sinal (e por que ele não bloqueia nada)

**O online daqui não usa internet.** Ele fala com o `dev_server.py` — que é esta
máquina, ou a do lado. Dá pra trocar e batalhar com o roteador desligado do
mundo, num cabo entre dois computadores, ou sozinho com duas abas abertas aqui.
Por isso `minimoBarras` vem **0**: nada é bloqueado, nunca.

As barras aparecem no canto da tela enquanto você está numa sala, e são
**informação**: elas dizem se o servidor está respondendo rápido, não se você tem
permissão. A conta é o tempo de ida e volta até ele — o mesmo ping que já mantinha
a sala viva:

| Resposta | Barras |
|---|---|
| até 30 ms | 4 |
| até 90 ms | 3 |
| até 300 ms | 2 |
| até 1500 ms | 1 |
| mais que isso, ou ping que não voltou | 0 |

Quem medir é o ping e mais ninguém: o `navigator.onLine` do navegador fala do
mundo lá fora, que não tem nada a ver com quem está do outro lado da sala, e o
palpite dele sobre o tipo da rede erraria pra baixo num cabo entre duas máquinas.

Zero barra não tira nada de você. A única coisa que acontece sozinha é: **servidor
mudo por 10 segundos encerra a troca ou a batalha que estava aberta**, pra você
não ficar preso numa tela esperando alguém que não vem. A conexão continua
tentando voltar por conta própria e avisa quando volta.

Quer a porteira de volta? `sinal.minimoBarras: 1` (ou 2, ou 3) em
`src/data/online.js`. Vale na hora, com o jogo aberto — e aí o acesso ao online
passa a exigir aquele tanto de barra.

### Velocidade

O servidor responde um ping em **0,15 ms** e entrega uma sala inteira (abrir a
SSE, registrar o jogador e mandar quem já está lá) em **~1 ms**, medidos na
própria máquina. O que foi feito pra chegar nesses números:

- **HTTP/1.1 com keep-alive.** O `http.server` da stdlib fala HTTP/1.0 por
  padrão, e fechava a conexão a cada resposta — cada ping pagava um aperto de
  mão TCP novo. De graça na mesma máquina, um ida-e-volta inteiro no wifi.
  Ligar o keep-alive derrubou o ping de 0,31 ms pra 0,15 ms aqui, e economiza
  bem mais que isso na rede. O preço: toda resposta agora precisa dizer o
  tamanho do corpo, e quem não tem tamanho (a SSE, que é um cano aberto)
  fecha a conexão no fim.
- **TCP_NODELAY.** O algoritmo de Nagle junta pacotinhos antes de mandar: bom
  pra transferir arquivo, ruim pra mensagem curta de jogo, onde chega a segurar
  40 ms.
- **Religar quase na hora.** A primeira tentativa de reconexão saiu de 1,2 s pra
  150 ms: a maior parte das quedas é uma piscada, e esperar pra descobrir isso
  era tempo jogado fora.
- **Entrar na sala em que você já está não faz nada** — antes derrubava a
  conexão e abria outra.

Isso é o tempo do **servidor**. O navegador tem o custo dele por cima (o `fetch`
e o `EventSource` custam mais que isso sozinhos), e qualquer rede de verdade
soma a dela: no wifi de casa, o ping realista fica na casa dos milissegundos, não
dos décimos.

### Troca

Os dois escolhem um Pokémon, os dois veem as duas ofertas, os dois confirmam. A
troca só acontece com os **dois** PRONTOS na mesa; quem sai antes disso cancela
pros dois lados. Feita a troca, o save é gravado na hora.

Nada que chega pela rede entra no seu save sem passar pelo filtro
(`Online.sanea`): espécie que existe, nível de 1 a 100, HP que cabe, golpes que
existem e nenhuma forma MEGA (essas só existem dentro da batalha). Um cliente
adulterado até consegue mandar lixo — o que ele não consegue é gravar lixo no seu
arquivo.

### Batalha link

Quem convidou **manda** na batalha: é o único lado que roda as contas (dano,
acerto, ordem por velocidade, status). O outro escolhe o que fazer, manda a
escolha e desenha o que voltou.

Isso é escolha, não limitação da rede: pros dois lados calcularem o mesmo turno
eles teriam que sortear os MESMOS números, e o motor usa `Math.random` solto em
vários lugares. Ou eu mexia no motor inteiro — arriscando a batalha normal, de um
jogador só — ou deixava um lado mandando. Deixei um lado mandando: **a batalha de
sempre não foi tocada**.

Tem golpes, tipos, crítico, status, ordem por velocidade, troca de Pokémon e
desistência. Não tem item, captura, XP nem dinheiro: os dois lados lutam com
CÓPIAS da equipe, então ninguém sai daqui mais forte nem mais fraco e o save não é
tocado em momento nenhum. Quem desmaia troca numa rodada só de troca, sem dar um
golpe de graça pro outro lado.

## Presente misterioso

Na tela de título (com uma partida gravada) e no menu ONLINE. Dois caminhos, como
nos jogos de verdade:

- **POR CÓDIGO** — as cartas de `src/data/gifts.js`. Funcionam sem servidor
  nenhum e têm hot-swap: dá pra inventar um código com o jogo aberto. Já vêm
  seis, entre elas `GLITCHEDITION`, `PALETA1996` e `DOCEDOCEDOCE`.
- **PELO SERVIDOR** — os cartões que o dono do servidor publicou, em
  `online/cartoes.json`. O arquivo nasce sozinho com dois cartões e é só editar:
  item, quantidade, espécie, nível, shiny.
- **MANDAR UM CARTÃO** — você publica um item da SUA mochila pra sala. O item sai
  da sua mochila: presente é presente.

Cada cartão entra **uma vez por save** (`flags.presentes`). Pokémon que chega com
o time cheio vai pro BOX.

## Save

**Um save por computador** (um por máquina — ver **Online**). Ele fica em `save/save.json`, gravado pelo próprio
`dev_server.py` na rota `/__save` — não no `localStorage` do navegador. O motivo:
`localStorage` é separado por origem, então abrir o jogo em `localhost:5173` e em
`localhost:5178` criava duas partidas paralelas sem ninguém perceber. Com o
arquivo, a porta (e a aba, e o navegador) não importam mais; no boot o jogo ainda
apaga qualquer `pge.save*` que tenha sobrado do esquema antigo.

Com as funções online passou a existir mais de um computador, então o servidor
escolhe o arquivo por quem está pedindo: `save/save.json` pra esta máquina,
`save/rede-<ip>.json` pra cada máquina da rede e `save/perfil-<nome>.json` pra
quem abriu com `?perfil=`. O aviso de "o save mudou por fora" só chega pra quem é
dono daquele arquivo.

O jogo **grava sozinho**: ao trocar de mapa, ao sair de uma batalha e ao fechar ou
esconder a aba (`sendBeacon`, que sobrevive ao unload). O `SALVAR` do menu
continua existindo e força a gravação na hora.

## 011GIVEGLITCH110 (o terminal do professor)

No laboratório, o **computador do Prof. Carvalho** — o monitor e a torre branca
ao lado dele, na parede do fundo (tiles `2,1` e `3,1`; encoste em `2,2` olhando
pra cima) — roda um programa que não é dele: uma lista com **todos** os
Pokémon do jogo e um botão de baixar. Cima/baixo escolhe, os lados mudam o nível
(SHIFT anda de 10 em 10), C liga o shiny, Z baixa pro time — box, se estiver
cheio — e X sai. As espécies da fenda aparecem em roxo.

A mesma coisa existe fora do jogo em `giveglitch/` (`/giveglitch/` no dev server),
útil quando o jogo nem está aberto: os dois escrevem no mesmo `save/save.json`.

## Live update

O `dev_server.py` observa o mtime dos arquivos e avisa o navegador por SSE (`/__hot`):

- **Mudou algo em `src/data/`** → *hot-swap*: o jogo **não recarrega**.
  `src/data/index.js` é reimportado com `?t=<timestamp>` (invalidando o cache dos
  filhos) e o objeto vivo `DB` é atualizado no lugar. Dá pra rebalancear um golpe,
  os stats de uma espécie ou a taxa de encontro **no meio de uma batalha**.
- **Mudou código, HTML, CSS, sprite ou mapa** → reload, mas o estado da partida é
  salvo em `sessionStorage` antes e restaurado depois: você volta no mesmo lugar.

Erros de runtime aparecem numa faixa vermelha na própria página.

## Estrutura

```
dev_server.py          servidor + live update + as rotas online (stdlib only)
online.py              salas, presença, relay e os cartões do presente
index.html             canvas 240x160 (resolução de GBA) + overlay de erro
src/
  main.js              boot, game loop, estado global, save/load
  core/
    assets.js          arte provisória gerada em runtime + animação de grama
    sprites.js         carregador de PNGs externos (Pokémon, personagens, mapas)
    font.js            fonte bitmap 5x7 desenhada à mão (acentos derivados)
    gfx.js             painéis, barras, cursor, fade — visual GBA
    net.js             a conexão com a sala (SSE pra receber, POST pra falar)
    input.js  audio.js  scene.js  save.js  hot.js  rng.js
  data/                <- tudo aqui tem hot-swap
    config.js          modo glitch, velocidade de animação, taxa de encontro
    gen1.js            a Pokédex de Kanto (151 linhas: tipos e stats-base)
    species.js         learnsets, texto da Pokédex, arte provisória
    types.js           os 16 tipos e a tabela de efetividade do FireRed
    moves.js           golpes
    maps.js            NPCs, diálogos, placas, encontros e lojas de cada mapa
    extra.js           espécies exclusivas da dimensão + tabelas por terreno
    fragments.js       pontos de fragmento e a chance que sobe a cada mapa
    loot.js            conteúdo das bolas largadas na dimensão + itens de evolução
    mega.js            as 16 formas MEGA, as megapedras e o ANEL MEGA
    online.js          sala, chat, emotes e as frases das funções online
    gifts.js           os códigos do PRESENTE MISTERIOSO
    index.js           monta o DB (inclui assets/maps/kanto.json)
  systems/
    mon.js  battle-engine.js  encounters.js  loot.js  dialogue.js  glitchfx.js
    mega.js            mega evoluir/desmegar (e a garantia de não gravar megado)
    online.js          presença, convites, chat e o filtro do que vem de fora
  scenes/
    title.js  overworld.js  battle.js
    online.js          a sala e o PRESENTE MISTERIOSO
    trade.js           a troca entre dois jogadores
    linkbattle.js      a batalha link
assets/
  sprites/             PNGs externos (vazio por padrão): pokemon/, overworld/, trainers/, tiles/
  maps/                mapas renderizados + kanto.json (geometria e colisão)
tools/                 fetch_sprites / fetch_overworld / fetch_trainers / fetch_maps / slice_sheet / png_io
dev/smoke.html         teste headless com roteiro de teclas
giveglitch/            versão web do mesmo terminal (fora do jogo)
save/save.json         o save (um por máquina; fora do git)
online/cartoes.json    os cartões que este servidor oferece (fora do git)
```

## Adicionando conteúdo

**NPCs, diálogos e encontros** ficam em `src/data/maps.js`, indexados pelo mesmo
id do mapa. As coordenadas são as do mapa original (x,y em tiles):

```js
viridian: {
  name: "CIDADE VIRIDIAN", music: "viridian",
  spawn: { x: 26, y: 27, dir: "up" },
  signs: { "20,16": "TEXTO DA PLACA." },
  lockedWarps: { "36,10": "O GINÁSIO ESTÁ TRANCADO." },
  encounters: [{ id: "nidoranm", min: 3, max: 5, w: 15 }],
  npcs: [{ id: "moca", x: 20, y: 12, dir: "down", sprite: "velha", lines: ["OI!"] }],
}
```

NPC com `trainer: {...}` vira batalha de treinador; `heal: true` cura a equipe (e
vira seu ponto de retorno); `shop: [{item, price}]` abre a loja; `gift: {item, qty}`
dá um item uma vez; `starter: "charmander"` vira uma Poké Bola na mesa. Quem está
atrás de um balcão é alcançado por cima dele, como no original.

**Um mapa novo de Kanto**: adicione o nome dele em `MAPS` e `DEST` no topo de
`tools/fetch_maps.py`, rode o script, e crie a entrada correspondente em
`src/data/maps.js`. As portas e conexões vêm prontas do jogo original.

**Qualquer um dos 151** já pode entrar numa tabela de encontros só pelo nome
(`{ id: "abra", min: 8, max: 12, w: 5 }`): quem não tem learnset escrito à mão em
`species.js` recebe um automático pelo tipo.

## Testes headless

`dev/smoke.html` roda o jogo num iframe, dispara um roteiro de teclas e devolve
canvas + diagnóstico pro servidor (`dev/captures/`):

```bash
firefox --headless --no-remote --profile /tmp/ffprof \
  "http://localhost:5173/dev/smoke.html?name=batalha&url=/%3Fmap%3Droute1%26battle%3Dpidgey&keys=z,z,z,z,z"
cat dev/captures/batalha.log     # frames, cena, posição, equipe, erros
```

Atalhos de dev na URL do jogo: `?map=route1&x=17&y=34&dir=up`,
`?battle=pidgey&lvl=6`, `?starter=squirtle`, `?debug=1`.

## Aviso legal

Pokémon é marca registrada da Nintendo / Creatures / Game Freak. Este é um fangame
não oficial, sem fins lucrativos e sem nenhum asset oficial versionado.
