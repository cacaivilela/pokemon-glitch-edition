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

> Arte e dados originais são da Nintendo / Creatures / Game Freak. Os
> importadores continuam existindo pra quem clona o projeto, mas **a arte
> importada está versionada aqui** (`assets/`) para que a versão publicada na
> web funcione sem que ninguém precise rodar nada. O código, os diálogos, o
> motor, a trilha e a arte provisória são originais.

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
| X → OPÇÕES | velocidade do jogador e idioma |
| X → ATUALIZAR | baixa as fusões (e os desenhos) publicados no mundo |
| Mouse | na oficina de genoma: pinta, clica nos botões e a rodinha dá zoom |
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

## Configurações

No menu `X` → **OPÇÕES** (e o idioma também na tela de título, antes de começar
qualquer partida):

- **VELOCIDADE** — DEVAGAR, CALMA, NORMAL, RÁPIDA, TURBO. O jogo roda travado
  em 60fps: andar mais rápido é dar o passo em menos quadros, não acelerar o
  relógio. Um tile leva 32 quadros no DEVAGAR, 16 no NORMAL (o do FireRed) e 8
  no TURBO — a mesma velocidade de quando você segura SHIFT.
- **IDIOMA** — PORTUGUÊS, ENGLISH, ESPAÑOL.

As duas ficam no navegador (`localStorage`), não no save: são de quem está na
frente da tela. Apagar a partida não muda o idioma, e o idioma escolhido na tela
de título já vale antes de existir save nenhum.

### Como a tradução funciona

O jogo foi escrito em português e continua assim nos arquivos — trocar cada
frase por um código transformaria `story.js`, que hoje se lê como roteiro, numa
lista de identificadores. Então a tradução é **por frase e no último instante**:
`src/data/idiomas.js` tem um dicionário por idioma (português → outro), e o
texto passa por ele na hora de desenhar (`drawText`) e na hora de quebrar a
linha da caixa de diálogo.

Duas consequências: nenhum arquivo de dados precisa saber que existe tradução, e
**o que ainda não foi traduzido aparece em português** em vez de virar buraco na
tela — as opções avisam isso no rodapé. Hoje o dicionário cobre as telas, os
menus, os tipos, a máquina de fusão, a oficina e o concurso; os diálogos longos
seguem em português. Escrever mais tradução é acrescentar linha em
`src/data/idiomas.js`, com hot-swap: a tela muda com o jogo aberto.

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

## Fusão: o DECODIFICADOR DE GENOMA

O **PROF. CARVALHO** entrega a máquina na **primeira conversa**, antes do
inicial e de qualquer insígnia. Ela abre pela mochila (`Z` em cima do item) e
faz três coisas:

- **FUNDIR** — dois Pokémon da equipe viram um só. A **CABEÇA** dá o rosto, o
  tipo primário, o começo do nome e o lado especial (HP, ESP.ATK, ESP.DEF); o
  **CORPO** dá o resto do desenho, o tipo secundário, o fim do nome e a parte
  física (ATK, DEF, VELOCIDADE). Cada atributo é 2/3 de quem manda nele e 1/3
  do outro, e o learnset é o dos dois juntos.
- **O BRILHO PEGA** — fundir um **shiny** com um comum não deixa a cor rara pra
  trás: a fusão sai shiny e os **dois** que ficam guardados lá dentro saem shiny
  também, então separar depois devolve os dois brilhando. É a única coisa que a
  máquina escreve por cima do que entrou — e não tem volta.
- **SEPARAR** — desfaz. Os dois originais ficam **guardados inteiros** dentro da
  fusão (`mon.fusao`), então voltam com apelido, IVs e golpes que tinham — no
  nível que a fusão alcançou. Se a equipe estiver cheia, o segundo vai pro PC.
- **OFICINA** — o estúdio de sprite (abaixo).

O nome sai por sílaba: começo da cabeça + última sílaba do corpo. BULBASAUR +
CHARMANDER = **BULBANDER**; PIKACHU + SQUIRTLE = **PIKARTLE**; GENGAR +
MISSINGNO. = **GENGNO**.

Uma fusão é uma **espécie de verdade**, com id `fus-<cabeça>-<corpo>`, mas ela
não mora em `src/data/`: são 255x256 combinações no catálogo da máquina, e
guardar todas seria guardar um catálogo pra usar três linhas dele. Ela é montada
na hora e registrada em `DB.SPECIES` — como o id carrega os dois lados, dá pra
remontar a espécie só de olhar pro save (`registrarDoEstado`, em
`src/systems/fusao.js`, roda no boot, ao adotar um save de fora e a cada
hot-swap). O sprite também é montado na hora, sempre em **64x64** (o tamanho do
sprite do jogo): corpo inteiro recolorido com a cor da cabeça, e a cabeça por
cima até a linha do pescoço.

Diferente da MEGA, **a fusão fica**: ela é gravada no save e sobrevive à troca
online (do outro lado a espécie é remontada pelo id).

### A oficina (estúdio de sprite)

`OFICINA` na máquina pergunta de onde vêm os dois:

- **DA MINHA EQUIPE** — escolhe dois da equipe (ou uma fusão pronta, que abre a
  ficha dela).
- **DIGITAR NÚMERO OU NOME** — a **bancada livre**: você só diz quais são. Vale
  o número da Pokédex (`025`) ou o nome (`PIKACHU`, `mr. mime`, `PORYGON-Z`), e
  vale qualquer espécie do jogo, inclusive as de fora de Kanto. **Não precisa
  ter nenhum dos dois**: a oficina é sobre o desenho e a ficha, não sobre quem
  está na sua mochila. A tela mostra o sprite dos dois e a prévia da fusão
  enquanto você digita.

Três abas, trocadas com `TAB` ou clicando no nome:

- **DESENHO** — uma tela de **64x64**: o mesmo tamanho que a batalha desenha,
  então o que você pinta é pixel por pixel o que aparece no jogo, sem redução no
  meio. Ela abre inteira na tela (zoom 2x, indo até 16x). Dá pra **pintar com o
  mouse**, arrastando, e clicar nos botões da direita. Ferramentas: PINCEL (1 a
  8 pixels), BORRACHA, BALDE, PIPETA e **PEÇA** — os sprites da cabeça e do
  corpo, inteiros ou nas duas metades, pra **encaixar** onde você quiser, com a
  rodinha mudando o tamanho e `H` virando de lado. **Sete paletas** de 16 cores,
  e a primeira é montada na hora com as cores mais usadas nos sprites dos dois.
  `U` desfaz, `D` apaga tudo (o `U` traz de volta). Ficha antiga, desenhada
  quando a tela era 256x256, entra reduzida na primeira vez que você abre.
- **FICHA** — nome e os dois tipos.
- **STATS** — quanto cada atributo **vale no nível 0** e quanto ele **sobe por
  nível**. É essa conta que a batalha usa: `valor = inicial + crescimento x
  nível`, sem stats-base e sem IV. A tela mostra o resultado nos níveis 5, 50 e
  100 enquanto você mexe.

### Variantes: mais de uma fusão pra mesma dupla

A mesma dupla pode virar coisas diferentes, e na hora de fundir o **`C`** passa
por todas elas (a vitrine mostra qual está escolhida e quantas existem):

1. **AUTOMÁTICA** — o cálculo da máquina. Ou **SUA FICHA**, se você fez uma pra
   essa dupla na oficina.
2. **DO JOGO** — as fusões escritas à mão em `src/data/fusoes.js`. Algumas
   combinações são boas demais pra sair de uma média: GENGAR+RAYQUAZA vira
   **GENGQUAZA** (FANTASMA/DRAGÃO), ALAKAZAM+GENGAR vira **ALAKAGAR**,
   CHARMANDER+GYARADOS vira **CHARADOS**,
   PIKACHU+BULBASAUR vira **PIKASAUR** (ELÉTRICO/PLANTA), MEWTWO+MEW,
   GROUDON+KYOGRE, LAPRAS+ARTICUNO, SNORLAX+JIGGLYPUFF, MISSINGNO+PORYGON… são
   vinte e duas, com nome, tipos, crescimento e texto de Pokédex próprios. A
   ordem importa: RAYQUAZA+GENGAR é **RAYGAR**, outra fusão.
3. **DE \<NOME\>** — as fichas que jogadores publicaram (veja abaixo).

O id da espécie carrega qual é: `fus-gengar-rayquaza~gengquaza`. Separar
devolve os dois de sempre, não importa a variante.

E quem **já está fundido** não fica preso na versão que pegou: `TROCAR A VERSÃO`,
no menu da máquina, lista as versões daquela dupla (com a atual marcada) e
reescreve o Pokémon pra outra. Ele continua sendo ele — nível, HP, golpes e os
dois guardados lá dentro; o que muda é o que a versão manda: nome, tipos,
desenho e crescimento. É o caminho pra quando você desenha uma ficha **depois**
de já ter fundido aquela dupla.

### FUSIONGLITCH: fazer fusão fora do jogo

A oficina também existe **fora do jogo**, numa página só:
[`fusionglitch/`](https://cacaivilela.github.io/pokemon-glitch-edition/fusionglitch/)
(o endereço curto **cacaivilela.github.io/fusionglitch** leva pra ela). Ali dá pra: escolhe os dois pelo número ou
pelo nome, monta a fusão automática, deixa desenhar por cima com o mouse (tela
grande, pincel de 1 a 8, balde, conta-gotas, sete paletas, desfazer), e a ficha
sai como um arquivo `.fusao.json` — o desenho vai dentro.

No jogo: `DECODIFICADOR` → `OFICINA` → **IMPORTAR FICHA**, e escolha o arquivo.
Ela é conferida antes de entrar (a dupla existe, o nome cabe, os tipos existem,
os números estão na faixa, o desenho é PNG) e vira uma variante daquela dupla,
com o `C` da máquina mostrando o nome de quem desenhou.

E tem o **PUBLICAR**, que grava direto sem arquivo no meio. Ele funciona porque
a página mora **dentro do jogo**: aberta em `localhost:5173/fusionglitch/` ela é
a mesma origem do `dev_server` e fala com ele sem pedir licença a ninguém.
Aberta pelo endereço público, ela procura o jogo nas portas de sempre (e a rota
`/__ficha` responde com CORS pra isso funcionar).

O site **não tem servidor próprio**: nada é enviado pra lugar nenhum, não existe
lista pública, e nada entra no seu jogo sem você escolher o arquivo ou apertar
publicar.

### Publicar uma ficha no código

Terminou a ficha na oficina? Grave e escolha **PUBLICAR NO CÓDIGO**. O jogo
manda ela pro `dev_server.py` (rota `/__ficha`), que escreve em
`src/data/fusoes-feitas.js` com o seu nome junto.

**Ela aparece em todos os aparelhos.** Quem joga pela rede (`http://192.168.0.10:5190/`)
está baixando o jogo **deste** servidor, e o arquivo caiu dentro de `src/data/`,
que é a pasta que o live update vigia: o watcher vê a mudança e o `broadcast`
avisa todos os clientes conectados de uma vez. Como só mudou dado, é hot-swap —
ninguém recarrega, ninguém perde o lugar, e a variante nova já está no `C` da
máquina deles. Quem entrar depois baixa o arquivo já com ela. O jogo diz quantos
aparelhos receberam na hora de publicar.

Ela vale pra **qualquer partida deste computador**, inclusive um jogo novo, do
mesmo jeito que as fusões que já vêm no jogo. O desenho vai junto, em PNG. Pra tirar uma, edite o
arquivo à mão; pra tirar todas, deixe `export const FUSOES_FEITAS = {};`.

### A faxina do mês

Uma vez por mês, ao abrir o DECODIFICADOR, a máquina revisa o acervo e aponta a
fusão mais fraca. "Fraca" não é gosto: é **o quanto o desenho difere da montagem
automática** — a montagem (corpo de um, cabeça do outro) é o ponto de partida da
oficina, e uma ficha que continua igual a ela é uma ficha que ninguém chegou a
fazer. A conta é feita com o código de verdade do jogo, comparando pixel a
pixel (`src/systems/faxina.js`).

**Ela não apaga sozinha**: mostra qual é, com o número na tela ("4% diferente da
montagem automática"), e pergunta. Jogar fora desenho — seu ou de outra pessoa —
sem perguntar é o tipo de coisa que um programa não deve fazer calado. Quem
recusa não é perguntado de novo até o mês virar.

O que sai vai pro git como qualquer outra mudança (`faxina: fora <NOME>`), então
nada se perde de verdade: dá pra voltar qualquer uma pelo histórico.

### Por que não existe um servidor de fusões

Existiu por um tempo um serviço aberto onde qualquer pessoa publicava, e ele foi
**tirado de propósito**. Endereço aberto é estranho mandando desenho pra dentro
do seu jogo, e alguém teria que ficar olhando o que chega — trabalho chato e
desagradável, e não é isso que este projeto é. Publicar acontece **no seu
aparelho**: o `dev_server.py` que roda aqui grava a ficha no arquivo, e o
`MANDAR PRO MUNDO` (que também é o seu computador, com o seu git) leva pro
repositório quando você quiser.

### Mandar pro mundo### Mandar pro mundo

Uma casa não é o mundo. Pra ir além do seu servidor existe um caminho só, e ele
já existia: **o arquivo das fichas é código, e o código deste jogo tem
endereço** — o repositório de onde todo mundo baixou ele.

- Logo depois de publicar, a oficina pergunta **MANDAR PRO MUNDO?**. Aceitando,
  o `dev_server.py` (rota `/__mundo`) faz `git add`, `git commit` **só de
  `src/data/fusoes-feitas.js`** e `git push origin HEAD:main`. Nenhum outro
  arquivo seu entra no commit. Precisa de permissão de escrita no repositório;
  sem ela o jogo diz o motivo e a ficha continua valendo aqui e na sua rede.
- No menu `X` do jogador tem **ATUALIZAR**: é o mesmo caminho, à mão de quem
  está jogando. Ele baixa **tudo que foi publicado no mundo** — as fichas e os
  desenhos que vieram com elas — e diz quantas chegaram e quantas trouxeram
  desenho. O que chega já está no `C` da máquina no quadro seguinte.
- Na máquina, **MUNDO → BAIXAR AS FUSÕES DO MUNDO** faz `git fetch` e **junta**
  o que os outros publicaram com o que você tem: ficha sua nunca é
  sobrescrita, e nenhum outro arquivo é tocado. O que chega entra no `C` na
  hora (é `src/data/`, então é hot-swap) e chega junto em todo aparelho ligado
  no seu servidor.
- Quem clonar o jogo depois já vem com todas elas dentro.

O nome de quem fez vai gravado na ficha (`autor`) e aparece na lista de
variantes como **DE \<NOME\>**.

A ficha é **por lado**: `PIDGEOT+CHARMANDER` e `CHARMANDER+PIDGEOT` são duas
fichas diferentes, porque o desenho de uma não serve pra outra. Fazer uma e
fundir na ordem contrária é o erro fácil daqui, então a máquina avisa: a vitrine
marca **FICHA AO CONTRÁRIO** em amarelo, e antes de gravar ela pergunta se você
quer **trocar os lados**. Na aba FICHA da oficina, `COPIAR A FICHA AO CONTRÁRIO`
traz a outra pra este lado, com desenho e tudo.

A ficha vale mais que o cálculo automático e vale **na hora de gravar**: quem já
é daquela dupla muda de nome, tipo e atributos na mesma hora. `C` na aba FICHA
apaga a ficha e devolve o par pro cálculo da máquina. O desenho é gravado no
save como PNG.

Atalho de dev: `?fusao=1` na URL põe a máquina na mochila.

## Os três parados em Kanto

**XERNEAS**, **YVELTAL** e **ZYGARDE** não aparecem na grama e não vêm da fenda:
eles estão **parados**, cada um num lugar, esperando você chegar e encostar.

| Quem | Onde | O que você vê antes |
|---|---|---|
| **XERNEAS** | fundo da **Floresta Viridian** (23,31) | uma clareira que ninguém abriu, com o mato mais verde em círculo |
| **YVELTAL** | **Usina** (24,16) | as asas abertas em cima do gerador morto, as pontas vermelhas — a única coisa com energia ali |
| **ZYGARDE** | **Túnel Rocha B1F** (24,20) | pontinhos verdes no chão que se juntam quando você chega perto |

Nível 60, batalha de chefe: dá pra capturar e não dá pra fugir. Capturou, some
pra sempre; **derrubou sem capturar, ele volta** — saia do mapa e volte, e ele
está de pé no mesmo lugar.

**Mas o lugar não se acha sozinho.** Cada um tem uma missão que conta onde
procurar, e enquanto o pedido não for aceito a clareira é só clareira, a usina é
só usina e o túnel é só túnel:

| Missão | Quem pede | Insígnias | Abre |
|---|---|---|---|
| **O X MARCA O LUGAR** | um cataloguista do museu de **Pewter**, com um mapa de 1802 que tem um X e nenhuma legenda | 4 | XERNEAS |
| **O Y DA MORTE** | um ex-técnico da usina, em **Cerulean**: no dia em que ela morreu ficou uma marca queimada do tamanho da parede | 5 | YVELTAL |
| **O Z DO DNA** | uma geneticista de **Cinnabar**: chegou uma amostra que não é fita dupla, é um Z — e ela se mexe sozinha no pote | 6 | ZYGARDE |

A ligação é o campo `missao` de cada entrada em `ESTATICOS`: é ela que decide se
o bicho está lá.

O **XERNEAS trouxe o tipo FADA** junto: ele não existe sem ela. A tabela entrou
inteira, dos dois lados — FADA bate em DRAGÃO, LUTADOR e SOMBRIO, apanha de
VENENO e AÇO, e **DRAGÃO não encosta nela** (0x). Nenhum dos 151 é FADA nem
SOMBRIO: esses dois tipos só encostam no jogo pelo que vem de fora.

Os três estão em `ESTATICOS`, no fim de `src/data/extra.js` — lugar, nível e as
falas, com hot-swap. Mover um deles é mudar dois números.

## Side quests

Catorze pedidos espalhados por Kanto, cada um com o NPC dele parado num mapa. Você
aceita, cumpre quando quiser e volta pra receber — e o menu `X` ganha um
**diário** assim que o primeiro pedido é aceito, com o estado de cada um
(EM ANDAMENTO / PRONTA — VOLTE LÁ / ENTREGUE) e o contador de quem pede mais de
um.

| Missão | Onde | O que ele quer |
|---|---|---|
| PESCADOR SEM ISCA | Rota 11 | ver um MAGIKARP de perto |
| O COLECIONADOR | Vila Paleta | os três iniciais de Kanto ao mesmo tempo |
| A DUPLA IMPOSSÍVEL | Cinnabar | aparecer com uma fusão pronta |
| O RETRATISTA | Celadon | uma fusão **desenhada por você** na oficina |
| O TROFÉU DE CINNABAR | Fuchsia | 20 de 30 no concurso de fusão |
| A COLEÇÃO DE INSETOS | Floresta Viridian | 5 espécies diferentes de INSETO |
| QUEM ESTÁ NO CORREDOR | Vila Lavanda | capturar um FANTASMA |
| O QUE NÃO ESTÁ NA POKÉDEX | Saffron | capturar uma espécie que não é das 151 |
| A TEMPESTADE SEM FIM (+2) | Vermilion | ir de barco à tempestade e capturar TORNADUS, THUNDURUS e LANDORUS |
| O X MARCA O LUGAR | Pewter | seguir o X do mapa até a clareira (XERNEAS) |
| O Y DA MORTE | Cerulean | entrar na usina e achar a marca em Y (YVELTAL) |
| O Z DO DNA | Cinnabar | seguir as células até o fundo do Túnel Rocha (ZYGARDE) |

### A tempestade que não acaba (as três forças da natureza)

Em **VERMILION** tem um marinheiro com um barco e sem coragem de ir sozinho.
Com **3 insígnias** ele te leva até uma tempestade no mar perto de **BIRTH
ISLAND** que nunca passa — nem de dia, nem no verão, nem quando o resto do mar
está liso. No meio dela tem um recife de pedra, e no recife tem alguém.

São três viagens, uma de cada vez:

| Missão | Quem está lá | Depois |
|---|---|---|
| A TEMPESTADE SEM FIM | **TORNADUS** — "não é que ele voa no vento: o vento é o rabo dele" | tirando o vento, sobra o raio |
| O RAIO QUE FICOU | **THUNDURUS** — cai sempre no mesmo ponto do recife | com os dois fora, o recife cresce |
| O CHÃO QUE RESPONDE | **LANDORUS** — o chão veio ver o que houve | o mar volta a ser só mar |

O mapa da tempestade **é gerado em código** (`stormMap`, em
`src/data/index.js`), como a fenda e a BIRTH ISLAND: mar bravo, chuva na
diagonal e o recife desenhado em runtime (`Assets.stormArt`). Não tem porta e
não tem caminho por terra — quem te leva e quem te traz é o marinheiro, que
fica no barco esperando.

O lendário é uma batalha de chefe: dá pra capturar e não dá pra fugir.
Derrubar sem capturar não resolve — ele só volta na **próxima viagem**, com o
mar inteiro entre você e a segunda chance. Os três entram na Pokédex como
espécies de fora de Kanto (`src/data/extra.js`), e os sprites vêm com
`python3 tools/fetch_sprites.py --extra`.

**Nenhuma missão tem gatilho espalhado pelo código.** Cada objetivo é uma
pergunta que se responde olhando o save agora — "você tem um MAGIKARP?", "já
capturou cinco insetos diferentes?" — e ela é feita quando você fala com o NPC
ou abre o diário. Duas consequências boas: dá pra cumprir uma missão **sem saber
que ela existe** (aí o NPC aceita e entrega na mesma conversa), e save de uma
versão antiga não quebra nada — a missão só fica esperando.

Os pedidos, as falas, o lugar e o prêmio ficam em `src/data/missoes.js`; os
tipos de objetivo (`tem-especie`, `capturou-tipo`, `tem-fusao`,
`tem-ficha-desenhada`, `recorde-concurso`…) estão em `src/systems/missoes.js`.
Escrever uma missão nova já põe o NPC no mundo: o fim de `src/data/maps.js`
percorre a lista e coloca cada um no mapa dele. Tudo com hot-swap.

## Concurso de fusão (CINNABAR)

Na praça do sul de **CINNABAR** — a ilha que ressuscita fóssil desde sempre —
três cientistas montaram um concurso pra julgar o que sai do decodificador. Fale
com a **DRA. CINÁBRIO** e inscreva uma dupla: você escolhe **cabeça e corpo** da
sua equipe (ou leva uma fusão pronta, que vale pela dupla dela).

**A dupla não é fundida de verdade.** A máquina do palco lê os dois, mostra o
que sairia e devolve — dá pra testar combinação a noite inteira sem mexer na
equipe.

Cada jurado olha uma coisa só, e dá de 0 a 10:

| Jurado | Nota | O que ele mede |
|---|---|---|
| DR. HÉLIX | HARMONIA | quantos dos 18 tipos a dupla resiste e quantos ela sofre (monotipo perde ponto) |
| DRA. CÚPULA | POTÊNCIA | a soma dos atributos **no nível 50** — a mesma conta que a batalha faz |
| DR. ÂMBAR | AUTORIA | o que veio da **sua** mão: desenho próprio, nome trocado, tipos, crescimento |

São 30 pontos. Sem ficha na oficina, a AUTORIA fica em 2: eles reconhecem o
cálculo automático da máquina de longe. Com desenho seu e nome seu, vai a 8.

Três rivais entram junto — cientistas do laboratório com as duplas de fóssil
deles — e a nota deles sai da **mesma** função que a sua, com um empurrão por
insígnia (o concurso acompanha o seu progresso). Primeiro lugar leva $5000 e 3
DOCE RARO na primeira vez, $3000 nas seguintes; segundo $2000, terceiro $800, e
quem fica fora do pódio leva $200 de ajuda de custo. O jogo guarda a sua melhor
nota (`flags.concursoRecorde`).

Jurados, falas, rivais, prêmios e o peso de cada critério estão em
`src/data/concurso.js`, com hot-swap: dá pra reescrever a nota de um jurado com
o concurso rolando. As contas ficam em `src/systems/concurso.js` e a tela em
`src/scenes/concurso.js`. Pra testar: `?map=cinnabar_island&party=gengar:40,onix:40`.

## Modo Glitch

`src/data/config.js` tem `glitchMode: false`. Desligado (o padrão), o jogo é 100%
limpo — nenhum efeito que pareça bug. Ligando, volta a identidade do projeto:
corrupção acumulada no save, distorção de tela e o **MISSINGNO.** aparecendo na
grama alta.

## 011GLITCHDIMENSION110

A fenda tem conteúdo que não existe em Kanto:

- **26 espécies exclusivas** (`src/data/extra.js`), divididas por terreno do tile
  — terra, água e o vazio no meio. São dados soltos (PORYGON2/-Z, UNOWN,
  SHEDINJA, ROTOM…), fósseis remontados errado (CRANIDOS, ARCHEN, DRACOVISH…) e
  coisas que não deviam caber ali (LUNATONE, CRYOGONAL, GOLETT). No **vazio**
  moram as velas — **LITWICK**, **LAMPENT** e **CHANDELURE** —, que só aparecem
  ali onde a chama é a única coisa que se vê; LITWICK vira LAMPENT no nível 41 e
  LAMPENT vira CHANDELURE com a PEDRA DA LUA.
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

## O tamanho dos arquivos

Quase tudo aqui é arte de Game Boy Advance: sprite de 64x64 e mapa de tile, com
pouquíssimas cores. Mas os arquivos chegam dos importadores como PNG de **cor
verdadeira** — quatro bytes por pixel antes de comprimir. `tools/compacta.py`
reescreve todos em **paleta**, com a menor profundidade que couber (1, 2, 4 ou 8
bits por pixel):

```bash
python3 tools/compacta.py            # tudo em assets/
python3 tools/compacta.py --ver      # só mostra quanto daria
```

Os 788 PNGs do jogo caíram de **3,11 MB para 1,56 MB** — metade. E é **sem
perder pixel**: a ferramenta lê cada arquivo de volta e compara com o original
antes de dar o resultado por bom. A única diferença que ela aceita é a cor
debaixo de um pixel invisível (a paleta junta todo transparente numa cor só, e
não existe jeito de isso mudar o que aparece na tela).

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
    idioma.js          o interruptor da tradução (drawText passa por ele)
    opcoes.js          velocidade e idioma, no navegador
    base.js            a raiz do jogo (`/` em casa, `/pokemon-glitch-edition/` na web)
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
    fusao.js           regras da fusão: nome, atributos, tipos, paletas, editor
    concurso.js        o concurso de Cinnabar: jurados, rivais, prêmios, critérios
    idiomas.js         os dicionários de tradução (pt -> en/es)
    missoes.js         as side quests: pedido, lugar, objetivo e prêmio
    fusoes.js          as fusões escritas à mão (GENGQUAZA, ALAKAGAR, PIKASAUR...)
    fusoes-feitas.js   as fichas que jogadores publicaram (escrito pelo jogo)
    online.js          sala, chat, emotes e as frases das funções online
    gifts.js           os códigos do PRESENTE MISTERIOSO
    index.js           monta o DB (inclui assets/maps/kanto.json)
  systems/
    mon.js  battle-engine.js  encounters.js  loot.js  dialogue.js  glitchfx.js
    mega.js            mega evoluir/desmegar (e a garantia de não gravar megado)
    fusao.js           fundir/separar, a espécie montada na hora e as fichas do jogador
    concurso.js        as notas dos três jurados e a rodada com os rivais
    missoes.js         estado das missões e os checadores de objetivo
    faxina.js          a revisão mensal do acervo de fusões
    online.js          presença, convites, chat e o filtro do que vem de fora
  scenes/
    title.js  overworld.js  battle.js
    fusion.js          a fusão e a separação acontecendo na tela
    concurso.js        o palco de Cinnabar: entradas, notas e o resultado
    fusaoeditor.js     a oficina: estúdio de sprite, ficha e crescimento por nível
    online.js          a sala e o PRESENTE MISTERIOSO
    trade.js           a troca entre dois jogadores
    linkbattle.js      a batalha link
assets/
  sprites/             PNGs externos (vazio por padrão): pokemon/, overworld/, trainers/, tiles/
  maps/                mapas renderizados + kanto.json (geometria e colisão)
tools/                 fetch_sprites / fetch_overworld / fetch_trainers / fetch_maps / slice_sheet / png_io
                       compacta.py — reescreve os PNGs em paleta, sem perder pixel
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

`dev/fusaocheck.html` roda a fusão sem o jogo (nomes, atributos, fundir,
separar, ficha do jogador e o registro a partir do save) e escreve o resultado
em `dev/captures/fusaocheck.log` — útil depois de mexer nas regras de
`src/data/fusao.js`.

Atalhos de dev na URL do jogo: `?map=route1&x=17&y=34&dir=up`,
`?battle=pidgey&lvl=6`, `?starter=squirtle`, `?debug=1`.

## Jogar no navegador

O jogo está publicado em
**[cacaivilela.github.io/pokemon-glitch-edition/](https://cacaivilela.github.io/pokemon-glitch-edition/)**,
direto do `main` (GitHub Pages). Ali não existe `dev_server.py`, então o jogo se
vira sozinho:

- **o save fica no navegador** (`localStorage`), em vez do `save/save.json`;
- **live update desligado** — não tem arquivo pra vigiar;
- **funções online fora do menu** — não tem servidor de sala;
- **PUBLICAR / MUNDO** avisam que só funcionam no jogo rodando em casa.

Todo caminho passa por `src/core/base.js`, que descobre a raiz pelo endereço do
próprio módulo: em casa é `/`, no Pages é `/pokemon-glitch-edition/`. Por isso
nada de caminho absoluto no código — um `/assets/...` quebraria a versão web.

## Aviso legal

Pokémon é marca registrada da Nintendo / Creatures / Game Freak. Este é um
fangame não oficial e sem fins lucrativos. A arte e os dados de mapa importados
do FireRed (`assets/`) **estão versionados neste repositório** para que a versão
web funcione — eles pertencem à Nintendo / Creatures / Game Freak, não a este
projeto. Se os detentores pedirem, é só apagar `assets/` e voltar a depender dos
importadores (`tools/fetch_*.py`), que baixam tudo para a máquina de quem joga.
