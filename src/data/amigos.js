// ---------------------------------------------------------------- OS AMIGOS
// VÍTOR e ANDRÉ, os dois amigos de SÃO LUCARIO que vão atrás de você pela
// história de BRAGLITCH inteira (o sistema é src/systems/amigos.js; os
// desenhos, tools/sprite_vitor_andre.py).
//
//   VÍTOR  loiro, de óculos, vive desmontando coisa pra montar outra. Fez o
//          próprio DECODIFICADOR DE GENOMA com o rádio da avó e o primeiro
//          Pokémon dele saiu de lá: CATECHU, um CATERPIE na cabeça com um
//          PIKACHU no corpo (a fusão automática, `fus-caterpie-pikachu`). O
//          APPLIN ele não deixa evoluir ("se evoluir ele sai da maçã"), e os
//          outros dois são de metal: MAGNEMITE e KLINK, que ele chama de
//          "peças".
//   ANDRÉ  agitado, cabelo castanho, joga bola o dia inteiro e não guarda nome
//          de Pokémon nenhum: CINDERACE é "O COELHO ARTILHEIRO", HARIYAMA é "O
//          LUTADOR DE SUMÔ COM MÃO GIGANTE", HITMONLEE é "O PERNA DE MOLA" e
//          GUZZLORD é "O BOCÃO". O DRATINI que veio enrolado na bola é "A
//          MINHOCA AZUL", o DRAGONAIR "A COBRA DE LAÇO", e o DRAGONITE ele chama
//          de CHARIZARD (é dragão, é laranja, voa), por mais que o Vítor
//          corrija. O único que ele acerta é o RABOOT ("parece nome de
//          chuteira"); e GROOKEY ele fala "FROOKEY".
//
//          Quando ele erra o nome, aparece o BALÃO DE PENSAMENTO dele com o
//          Pokémon de verdade lá dentro: a fala começa com `[pensa:<espécie>]`
//          (src/systems/dialogue.js tira a marca e desenha o balão).
//
// Cada ENCONTRO acontece num lugar (`onde`) e destrava com `requer` (as mesmas
// regras do gêmeo: `ginasios` conta só os ginásios de Braglitch, `ilhas` conta
// as ilhas ENTREGUES pra IPÊ, `flag` é uma marca da história). Num encontro um
// dos dois LUTA (tem `time`) e o outro, quando está junto, só conversa.
//
// Eles andam junto com a história: cada um aparece no encontro mais novo que
// já destravou pra ele (o maior `etapa`; empatou, ele está nos dois lugares).
// Quando a história passa pra frente, eles saem dali — se você não lutou,
// perdeu aquela luta. Os lugares são um "perto de": o jogo acha o chão livre
// mais próximo na hora.
//
// `onde`: { mapa, x, y, dir }, ou { cidade } (do lado da porta do ginásio,
// onde o gêmeo fica nas cidades dele), ou { ilha: N } (perto de onde a lancha encosta).
//
// Fusão no time: o id `fus-<cabeça>-<corpo>` (src/systems/fusao.js).

const CATECHU = "fus-caterpie-pikachu";

export const AMIGOS = {
  nome: { vitor: "VÍTOR", andre: "ANDRÉ" },
  sprite: { vitor: "vitor", andre: "andre" },

  encontros: [
    {
      id: "saida", etapa: 0, onde: { mapa: "sao_lucario", x: 22, y: 7, dir: "right" },
      requer: { flag: "starterChosen" },
      vitor: {
        lado: { dx: 0, dy: 0 },
        fala: [
          "VÍTOR: OI! CUIDADO COM O FIO. ISSO AQUI É O MEU DECODIFICADOR DE GENOMA. CASEIRO.",
          "VÍTOR: O DO PROF. CARVALHO EU SÓ VI NA TV. ENTÃO EU DESMONTEI O RÁDIO DA MINHA VÓ E FIZ O MEU.",
          "VÍTOR: FUNCIONOU NA PRIMEIRA! QUER DIZER, NA SÉTIMA. O CATERPIE E O PIKACHU ENTRARAM, E SAIU O CATECHU.",
          "VÍTOR: ELE SOLTA CHOQUE PELA ANTENA. EU AINDA TÔ AJUSTANDO. A GENTE LUTA NA PRAIA, NA ILHA. PROMETO.",
        ],
      },
      andre: {
        lado: { dx: 5, dy: 0, dir: "left" },
        antes: [
          "ANDRÉ: ÊÊÊ! VOCÊ PEGOU O SEU! EU TAMBÉM PEGUEI O MEU! OLHA ELE AQUI, O... O...",
          "[pensa:scorbunny]ANDRÉ: O COELHINHO! O COELHINHO QUE CHUTA! ELE TEM NOME, MAS EU ESQUECI NO CAMINHO.",
          "[pensa:grookey]ANDRÉ: EU QUASE PEGUEI O FROOKEY, O MACAQUINHO DO GRAVETO. MAS ELE NÃO SABIA CHUTAR. SÓ BATUCAR.",
          "ANDRÉ: BORA! É PÊNALTI! VOCÊ DEFENDE, EU CHUTO!",
        ],
        depois: [
          "ANDRÉ: AAAH, NA TRAVE! FOI NA TRAVE!",
          "ANDRÉ: TUDO BEM, PRIMEIRO TEMPO. O SEGUNDO É MEU. E O VÍTOR AINDA TÁ LIGANDO A MÁQUINA DELE, OLHA...",
        ],
        time: [["scorbunny", 6]],
        premio: 300,
      },
    },
    {
      id: "ilha1", etapa: 0, onde: { ilha: 1 },
      requer: { flag: "starterChosen" },
      vitor: {
        antes: [
          "VÍTOR: CHEGOU! EU VIM NA FRENTE, NUMA BOIA COM MOTOR DE VENTILADOR. EU FIZ.",
          "VÍTOR: ELA AFUNDOU DUAS VEZES. O CATECHU SECOU TUDO COM CHOQUE. A GENTE NÃO CONTA PRA MINHA MÃE.",
          "VÍTOR: E OLHA ESSE APPLIN QUE EU ACHEI DENTRO DE UMA MAÇÃ NO MERCADO! AGORA SIM: LUTA DE VERDADE!",
        ],
        depois: [
          "VÍTOR: HUM. O CATECHU ESQUENTOU DEMAIS. VOU TROCAR O FUSÍVEL.",
          "VÍTOR: E O APPLIN EU NÃO VOU DEIXAR EVOLUIR, NÃO. SE EVOLUIR ELE SAI DA MAÇÃ. É A CASA DELE.",
        ],
        time: [["applin", 10], [CATECHU, 11]],
        premio: 500,
      },
      andre: {
        lado: { dx: 2, dy: 0, dir: "left" },
        fala: [
          "ANDRÉ: EU VIM NA BOIA DO VÍTOR. NUNCA MAIS. ELA ANDA DE LADO.",
          "ANDRÉ: E AQUI NÃO TEM CAMPO! SÓ AREIA, MATO E BICHO ESQUISITO. AQUELE ALI É UM... UM PATO? UM PASSARINHO-PATO?",
          "ANDRÉ: NÃO IMPORTA. FUTEBOL DE AREIA É FUTEBOL TAMBÉM!",
        ],
      },
    },
    {
      id: "recife", etapa: 2, onde: { cidade: "recife" },
      requer: { ginasios: 1 },
      andre: {
        antes: [
          "ANDRÉ: EI! EI! AQUI! O MEU COELHINHO EVOLUIU! AGORA ELE É O RABOOT! RABOOT! ESSE EU SEI, PARECE NOME DE CHUTEIRA.",
          "[pensa:makuhita]ANDRÉ: E ESSE OUTRO EU PEGUEI NA PRAIA: O BAIXINHO DO SUMÔ. ELE DÁ TAPA NO COQUEIRO ATÉ CAIR O COCO.",
          "ANDRÉ: O NOME DO BAIXINHO O VÍTOR JÁ FALOU UMAS DEZ VEZES. NÃO ENTROU. BORA JOGAR!",
        ],
        depois: [
          "ANDRÉ: VOCÊ JOGA MUITO, CARA.",
          "ANDRÉ: O RABOOT FICOU BRAVO. ELE TÁ CHUTANDO UMA PEDRA AGORA. É ASSIM QUE ELE TREINA.",
        ],
        time: [["makuhita", 17], ["raboot", 18]],
        premio: 900,
      },
      vitor: {
        lado: { dx: -1, dy: 0, dir: "right" },
        fala: [
          "VÍTOR: O RABOOT ELE ACERTA, PORQUE PARECE CHUTEIRA. O OUTRO É MAKUHITA, ANDRÉ. MA-KU-HI-TA.",
          "VÍTOR: E NÃO É FROOKEY, É GROOKEY. COM G. ...ELE NÃO ESCUTA. EU ESTOU FAZENDO UMA POKÉDEX DE BOLSO SÓ PRA ELE: APERTA O BOTÃO E ELA GRITA O NOME.",
        ],
      },
    },
    {
      id: "ilha3", etapa: 3, onde: { ilha: 3 },
      requer: { ilhas: 2 },
      vitor: {
        antes: [
          "VÍTOR: PSIU! FALA BAIXO. AQUI TEM MAIS COBRA DO QUE GENTE.",
          "VÍTOR: EU TROUXE UM DETECTOR DE COBRA. ELE APITA QUANDO TEM COBRA PERTO. ELE NÃO PAROU DE APITAR DESDE QUE EU DESCI.",
          "VÍTOR: E OLHA A PEÇA NOVA DO TIME: UM MAGNEMITE! ELE GRUDOU NO DETECTOR E NÃO SOLTOU MAIS. VEM!",
        ],
        depois: [
          "VÍTOR: O MAGNEMITE ESTÁ GIRANDO EM VOLTA DE MIM. ACHO QUE É UM PEDIDO DE DESCULPA.",
          "VÍTOR: VOU REGULAR O ÍMÃ DELE. MAIS QUATROCENTOS E VINTE GAUSS E NINGUÉM SEGURA.",
        ],
        time: [["applin", 21], ["magnemite", 21], [CATECHU, 23]],
        premio: 1400,
      },
      andre: {
        lado: { dx: 2, dy: 0, dir: "left" },
        fala: [
          "ANDRÉ: EU NÃO SAIO DESSA PEDRA. NÃO SAIO. PODE CHAMAR.",
          "[pensa:arbokbrag]ANDRÉ: TEM UMA MINHOCA DE ESCAMA DO TAMANHO DE UM GOL ALI ATRÁS. ELA ME OLHOU.",
          "ANDRÉ: VAI LÁ, VENCE O VÍTOR, E DEPOIS ME LEVA DE VOLTA PRA LANCHA NO COLO. BRINCADEIRA. MAIS OU MENOS.",
        ],
      },
    },
    {
      id: "caruaru", etapa: 4, onde: { cidade: "caruaru" },
      requer: { ginasios: 3 },
      andre: {
        antes: [
          "ANDRÉ: CARUARU TEM FORRÓ, TEM FEIRA E TEM UM CAMPINHO DE TERRA ATRÁS DA IGREJA! EU JÁ JOGUEI TRÊS JOGOS HOJE!",
          "[pensa:hariyama]ANDRÉ: O BAIXINHO DO SUMÔ CRESCEU! AGORA ELE É O LUTADOR DE SUMÔ COM MÃO GIGANTE. ELE TAMPA O GOL INTEIRO.",
          "[pensa:hitmonlee]ANDRÉ: E ESSE AQUI EU ACHEI NO CAMPINHO: O PERNA DE MOLA! ELE CHUTA MAIS ALTO QUE A TRAVE.",
          "[pensa:dratini]ANDRÉ: E A BOLA CAIU NO AÇUDE E VOLTOU COM UMA MINHOCA AZUL ENROLADA NELA. ELA NÃO QUIS SOLTAR. AGORA É DO TIME! VEM!",
        ],
        depois: [
          "ANDRÉ: HIT... HITMON... HITMONLÉ? O VÍTOR ME FALOU AGORA. JÁ ESQUECI.",
          "[pensa:hitmonlee]ANDRÉ: PERNA DE MOLA É MELHOR. ELE ATENDE PELOS DOIS.",
        ],
        time: [["dratini", 26], ["hariyama", 27], ["hitmonlee", 28], ["raboot", 28]],
        premio: 2000,
      },
      vitor: {
        lado: { dx: -1, dy: 0, dir: "right" },
        fala: [
          "VÍTOR: A POKÉDEX DE BOLSO DO ANDRÉ FICOU PRONTA. ELE USOU DE CANELEIRA.",
          "VÍTOR: AGORA EU ESTOU FAZENDO UMA SANFONA QUE TOCA SOZINHA. A FEIRA ME DEU AS PEÇAS. O DONO DA FEIRA NÃO SABE AINDA.",
        ],
      },
    },
    {
      id: "ilha5", etapa: 5, onde: { ilha: 5 },
      requer: { ilhas: 4 },
      vitor: {
        antes: [
          "VÍTOR: ITAPARICHU! AQUI A MARÉ ENCHE E ESVAZIA DUAS VEZES POR DIA. ENERGIA DE GRAÇA!",
          "VÍTOR: EU MONTEI UMA USINA DE MARÉ COM UMA RODA DE BICICLETA. ELA ACENDE UMA LÂMPADA. UMA.",
          "VÍTOR: O MAGNEMITE VIROU MAGNETON, E UM KLINK SAIU DE DENTRO DA RODA. ENGRENAGEM DE VERDADE! VEM VER!",
        ],
        depois: [
          "VÍTOR: A LÂMPADA APAGOU. FOI A LUTA OU FOI A MARÉ?",
          "VÍTOR: ...FOI A LUTA. VOCÊ É MAIS FORTE QUE UMA USINA. ISSO DÁ UM GRÁFICO.",
        ],
        time: [["applin", 31], ["klink", 30], ["magneton", 31], [CATECHU, 33]],
        premio: 2600,
      },
      andre: {
        lado: { dx: 2, dy: 0, dir: "left" },
        fala: [
          "ANDRÉ: NA MARÉ BAIXA APARECE UM CAMPO DE AREIA DURINHA DESSE TAMANHO! O MELHOR CAMPO DO MUNDO!",
          "ANDRÉ: AÍ A MARÉ SOBE E LEVA A BOLA. JÁ FORAM DUAS. O RABOOT FICOU OLHANDO O MAR.",
        ],
      },
    },
    {
      id: "ouropreto", etapa: 6, onde: { cidade: "ouropreto" },
      requer: { ginasios: 5 },
      andre: {
        antes: [
          "[pensa:cinderace]ANDRÉ: OLHA ELE! OLHA O MEU COELHO! AGORA ELE É O COELHO ARTILHEIRO! FAZ BOLA DE FOGO COM O PÉ!",
          "ANDRÉ: AQUI TEM LADEIRA, ENTÃO A BOLA SEMPRE ROLA PRO GOL DE BAIXO. EU SEMPRE JOGO NO GOL DE CIMA. É TREINO.",
          "[pensa:dragonair]ANDRÉ: E A MINHOCA AZUL CRESCEU! AGORA ELA TEM UM LAÇO NA CABEÇA E VOA SEM ASA. A COBRA DE LAÇO!",
          "ANDRÉ: COELHO ARTILHEIRO, LUTADOR DE SUMÔ COM MÃO GIGANTE, PERNA DE MOLA, COBRA DE LAÇO: TIME TITULAR! APITA, JUIZ!",
        ],
        depois: [
          "ANDRÉ: TOMEI DE VIRADA. DE NOVO.",
          "[pensa:cinderace]ANDRÉ: CINDER... CINDERELA? NÃO. O VÍTOR VAI RIR DE MIM. COELHO ARTILHEIRO E PRONTO.",
        ],
        time: [["dragonair", 38], ["hitmonlee", 39], ["hariyama", 38], ["cinderace", 40]],
        premio: 3400,
      },
      vitor: {
        lado: { dx: -1, dy: 0, dir: "right" },
        fala: [
          "VÍTOR: É CINDERACE, ANDRÉ. NÃO É CINDERELA. EU OUVI DAQUI.",
          "VÍTOR: OURO GASTLY É CHEIA DE LAMPIÃO VELHO. EU TROQUEI TRÊS POR LÂMPADA QUE ACENDE COM O MAGNETON. A PREFEITURA AINDA NÃO RESPONDEU.",
        ],
      },
    },
    {
      id: "ilha7", etapa: 7, onde: { ilha: 7 },
      requer: { ilhas: 6 },
      andre: {
        antes: [
          "ANDRÉ: VOCÊ NÃO VAI ACREDITAR. EU TAVA FAZENDO EMBAIXADINHA NA AREIA E UMA BOCA GIGANTE SAIU DO MAR E COMEU A MINHA BOLA.",
          "ANDRÉ: A BOLA, A REDE E O GOL. O GOL INTEIRO!",
          "[pensa:guzzlord]ANDRÉ: AÍ EU JOGUEI A POKÉ BOLA DE RAIVA... E ELE COMEU A POKÉ BOLA TAMBÉM. SÓ QUE POR DENTRO. AGORA ELE É MEU! O BOCÃO! ELE É O MEU GOLEIRO!",
        ],
        depois: [
          "[pensa:guzzlord]ANDRÉ: O BOCÃO TÁ COM FOME. ELE SEMPRE TÁ COM FOME.",
          "ANDRÉ: O VÍTOR DIZ QUE O NOME DELE É GUZZLORD E QUE ELE VEIO DE OUTRO MUNDO. PRA MIM ELE VEIO DO MAR. E COMEU O MEU GOL.",
        ],
        time: [["dragonair", 43], ["hariyama", 43], ["hitmonlee", 43], ["guzzlord", 44], ["cinderace", 45]],
        premio: 4400,
      },
      vitor: {
        lado: { dx: 2, dy: 0, dir: "left" },
        fala: [
          "VÍTOR: ESSE GUZZLORD NÃO DEVIA EXISTIR AQUI. ELE É UMA ULTRACRIATURA. EU MEDI: TEM UM BURACO NA REALIDADE EMBAIXO DO ATOL.",
          "VÍTOR: E O ANDRÉ PEGOU ELE COM UMA POKÉ BOLA COMUM. ARREMESSADA COM O PÉ.",
          "VÍTOR: EU NÃO SEI SE ISSO É CIÊNCIA OU FUTEBOL.",
        ],
      },
    },
    {
      id: "ilha8", etapa: 8, onde: { ilha: 8 },
      requer: { ilhas: 7 },
      vitor: {
        antes: [
          "VÍTOR: FERNANDO DE NOROWLET. A ÚLTIMA ILHA. EU TROUXE TUDO QUE EU FIZ ATÉ HOJE.",
          "VÍTOR: O MAGNETON VIROU MAGNEZONE AQUI, PERTO DO MORRO: TEM FERRO NA PEDRA. E O KLINK JÁ É KLINKLANG, TRÊS ENGRENAGENS GIRANDO JUNTAS.",
          "VÍTOR: O APPLIN CONTINUA NA MAÇÃ. E O CATECHU AINDA SOLTA CHOQUE PELA ANTENA. É O MEU TIME. É O MEU MELHOR PROJETO. VEM!",
        ],
        depois: [
          "VÍTOR: SABE O QUE EU APRENDI COM VOCÊ? QUE NÃO ADIANTA SÓ MONTAR. TEM QUE CONFIAR NO QUE MONTOU.",
          "VÍTOR: O CATECHU ACABOU DE ACENDER A ANTENA PRA MIM. ACHO QUE ELE CONCORDA.",
        ],
        time: [["applin", 48], ["klinklang", 49], ["magnezone", 49], [CATECHU, 50]],
        premio: 5200,
      },
      andre: {
        lado: { dx: 2, dy: 0, dir: "left" },
        fala: [
          "[pensa:guzzlord]ANDRÉ: O BOCÃO COMEU UMA PEDRA DO MORRO DO PICO. O PICO TÁ MENOR AGORA? ACHO QUE TÁ MENOR.",
          "ANDRÉ: QUANDO ACABAR AS ILHAS, A GENTE VAI JUNTO PRA LIGA. OS TRÊS. COMBINADO?",
        ],
      },
    },
    {
      id: "liga", etapa: 9, onde: { mapa: "esplanada", x: 11, y: 6, dir: "down" },
      requer: { flag: "bragMissingnoVencido" },
      andre: {
        antes: [
          "[pensa:missingno]ANDRÉ: CHEGOU! A GENTE VIU TUDO DA ESPLANADA! AQUELE BICHO QUEBRADO, O... O MISSINO? O MISTIGNO?",
          "ANDRÉ: ESQUECE O NOME. VOCÊ VENCEU ELE! E AGORA É A LIGA!",
          "[pensa:dragonite]ANDRÉ: E OLHA QUEM VIROU GENTE GRANDE: A COBRA DE LAÇO! AGORA É UM DRAGÃO LARANJA QUE VOA. É O CHARIZARD! ESSE NOME EU SEI!",
          "ANDRÉ: MAS ANTES DE ENTRAR, AQUECIMENTO. COELHO ARTILHEIRO, LUTADOR DE SUMÔ COM MÃO GIGANTE, PERNA DE MOLA, O BOCÃO E O CHARIZARD. TIME COMPLETO. APITA!",
        ],
        depois: [
          "ANDRÉ: AAAAH! VOCÊ TÁ PRONTO! TÁ MUITO PRONTO!",
          "ANDRÉ: VAI LÁ, PASSA NO QUIZ. E SE TIVER PERGUNTA DE NOME DE POKÉMON... NÃO ME CHAMA.",
          "[pensa:dragonite]ANDRÉ: O VÍTOR JURA QUE ELE É DRAGONITE E NÃO CHARIZARD. QUE CHARIZARD É OUTRO, QUE CUSPE FOGO.",
          "[pensa:dragonite]ANDRÉ: É DRAGÃO, É LARANJA, VOA. É CHARIZARD. O VÍTOR QUE ESTÁ CONFUNDINDO.",
        ],
        time: [["hitmonlee", 56], ["hariyama", 57], ["guzzlord", 57], ["dragonite", 57], ["cinderace", 58]],
        premio: 6000,
      },
      vitor: {
        lado: { dx: 6, dy: 0, dir: "down" },
        antes: [
          "VÍTOR: QUANDO O MISSINGNO APARECEU, TODAS AS MINHAS MÁQUINAS LIGARAM SOZINHAS. ATÉ A SANFONA.",
          "VÍTOR: EU ANOTEI TUDO. UM DIA EU ENTENDO. MAS HOJE NÃO É DIA DE ENTENDER: HOJE É DIA DE LUTAR.",
          "VÍTOR: A ÚLTIMA ANTES DA LIGA. APPLIN, KLINKLANG, MAGNEZONE, CATECHU. EU NÃO VOU SEGURAR NADA!",
        ],
        depois: [
          "VÍTOR: ...PERDI. E TÁ TUDO CERTO.",
          "VÍTOR: EU CONSERTEI O PLACAR DA ARENA ONTEM, SABIA? QUANDO ELE MOSTRAR O SEU NOME, FOI EU QUE ACENDI.",
        ],
        time: [["applin", 56], ["klinklang", 57], ["magnezone", 57], [CATECHU, 58]],
        premio: 6000,
      },
    },
    {
      id: "campeao", etapa: 10, onde: { mapa: "esplanada", x: 11, y: 6, dir: "down" },
      requer: { flag: "bragCampeao" },
      andre: {
        fala: [
          "ANDRÉ: CAMPEÃO! CAMPEÃO! É CAMPEÃO! ÔÔÔ!",
          "[pensa:guzzlord]ANDRÉ: EU GRITEI TANTO QUE O BOCÃO ACHOU QUE ERA COMIDA.",
          "ANDRÉ: E SABE O QUE EU DECOREI? O SEU NOME. DE PRIMEIRA. ESSE EU NUNCA ESQUEÇO.",
        ],
      },
      vitor: {
        lado: { dx: 6, dy: 0, dir: "down" },
        fala: [
          "VÍTOR: O PLACAR ACENDEU O SEU NOME. EU FIQUEI OLHANDO UNS DEZ MINUTOS.",
          "VÍTOR: AGORA EU VOU FAZER UMA COISA NOVA: UMA LANCHA PRA MIM. COM MOTOR DE VERDADE, NÃO DE VENTILADOR.",
          "VÍTOR: QUANDO FICAR PRONTA, A GENTE VAI ATRÁS DAS ILHAS QUE AINDA NÃO TÊM NOME. OS TRÊS.",
        ],
      },
    },
  ],
};

// ------------------------------------------------------- AS TIRINHAS DO VÍTOR
// Nas horas vagas (quando não está desmontando coisa) o VÍTOR desenha
// tirinha de Pokémon num caderno. Depois de conversar com ele (ou de vencer
// ele), ele pergunta se você quer ver uma — e mostra a próxima do caderno,
// em ordem; acabou, volta pra primeira. A tela é src/scenes/tirinha.js.
//
// Cada QUADRO: `legenda` (a caixinha amarela de cima), `bichos` — [espécie,
// x no quadro (0..224), opções] com `v` = virado pra direita, `s` = tamanho
// (64 é o normal), `dy` = sobe/desce — e `falas`: [índice do bicho, texto].
// `fx`: "flash" (clarão), "treme" (o quadro treme) ou "zzz" (sono).
// `fim` (na tirinha): o que o VÍTOR fala depois dela, no lugar da sorteada.
// Bicho que começa com `@` é gente: o retrato de batalha (`@vitor`, `@andre`).
// O site tirinhas.html mostra o caderno inteiro.
export const TIRINHAS = {
  pergunta: "VÍTOR: EI! QUER VER UMA TIRINHA QUE EU DESENHEI? É A MELHOR. TODAS SÃO A MELHOR.",
  opcoes: ["QUERO!", "AGORA NÃO"],
  nao: "VÍTOR: TUDO BEM. ELA VAI ESTAR AQUI. ESPERANDO. NO MEU CADERNO. SOZINHA.",
  depois: [
    "VÍTOR: KKKKKKKKK EU RIO TODA VEZ. E EU QUE FIZ.",
    "VÍTOR: ESSA EU DESENHEI NA AULA. A PROFESSORA RIU. DEPOIS ME DEU ADVERTÊNCIA.",
    "VÍTOR: O ANDRÉ NÃO ENTENDEU ESSA. ELE ACHOU QUE ERA SOBRE FUTEBOL.",
    "VÍTOR: SE VOCÊ NÃO RIU, É PORQUE A PIADA É INTELIGENTE DEMAIS. NÃO É CULPA SUA.",
  ],
  lista: [
    {
      titulo: "OS TRÊS IRMÃOS",
      quadros: [
        { bichos: [["groudon", 18, { v: true }], ["kyogre", 140]],
          falas: [[0, "O MUNDO É DE TERRA!"], [1, "O MUNDO É DE ÁGUA!"]], fx: "treme" },
        { legenda: "AÍ DESCEU DO CÉU...", bichos: [["rayquaza", 70, { s: 84, dy: -8 }]],
          falas: [[0, "PAREM COM ISSO AGORA!!!"]], fx: "flash" },
        { bichos: [["groudon", 6, { v: true }], ["rayquaza", 78], ["kyogre", 154]],
          falas: [[1, "O MUNDO É DE AR."]] },
        { legenda: "5 SEGUNDOS DEPOIS", bichos: [["arceus", 80, { s: 72 }]],
          falas: [[0, "QUEM COMEÇOU ESSA BRIGA?"]] },
        { bichos: [["groudon", 6, { v: true }], ["rayquaza", 78], ["kyogre", 154]],
          falas: [[0, "FOI ELE!"], [1, "FOI ELE!"], [2, "FOI ELE!"]] },
      ],
    },
    {
      titulo: "A GRANDE BATALHA",
      quadros: [
        { legenda: "A BATALHA MAIS ÉPICA DA HISTÓRIA", bichos: [["metapod", 30, { v: true }], ["metapod", 130]] },
        { bichos: [["metapod", 30, { v: true }], ["metapod", 130]],
          falas: [[0, "ENDURECER."], [1, "ENDURECER."]] },
        { legenda: "6 HORAS DEPOIS", bichos: [["metapod", 30, { v: true }], ["metapod", 130]],
          falas: [[0, "ENDURECER."], [1, "...ENDURECER."]], fx: "zzz" },
        { legenda: "3 SEMANAS DEPOIS", bichos: [["butterfree", 30, { v: true }], ["butterfree", 130]],
          falas: [[0, "...EMPATE?"], [1, "EMPATE."]] },
      ],
    },
    {
      titulo: "ACREDITE NOS SEUS SONHOS",
      quadros: [
        { bichos: [["magikarp", 24, { v: true }], ["goldeen", 140]],
          falas: [[0, "UM DIA EU VOU SER UM DRAGÃO GIGANTE!"], [1, "AHAM. CLARO."]] },
        { legenda: "NÍVEL 19", bichos: [["magikarp", 24, { v: true }], ["goldeen", 140]],
          falas: [[0, "SPLASH! SPLASH!"], [1, "KKKKKKK"]] },
        { legenda: "NÍVEL 20", bichos: [["gyarados", 14, { v: true, s: 80 }], ["goldeen", 150]],
          falas: [[0, "..."]], fx: "flash" },
        { bichos: [["gyarados", 14, { v: true, s: 80 }], ["goldeen", 150]],
          falas: [[1, "EU SEMPRE ACREDITEI EM VOCÊ, AMIGÃO!"]] },
      ],
    },
    {
      titulo: "REFLEXOS",
      quadros: [
        { bichos: [["slowpoke", 60, { v: true }], ["shellder", 132, { s: 44 }]],
          falas: [[1, "NHAC!"]] },
        { legenda: "3 DIAS DEPOIS", bichos: [["slowpoke", 60, { v: true }], ["shellder", 132, { s: 44 }]],
          falas: [[0, "..."]] },
        { legenda: "1 SEMANA DEPOIS", bichos: [["slowpoke", 60, { v: true }], ["shellder", 132, { s: 44 }]],
          falas: [[0, "AI."]] },
      ],
    },
    {
      titulo: "O PIKACHU VERDADEIRO",
      quadros: [
        { bichos: [["pikachu", 30, { v: true }], ["ditto", 136]],
          falas: [[1, "OLHA O QUE EU SEI FAZER!"]] },
        { bichos: [["pikachu", 30, { v: true }], ["pikachu", 136]],
          falas: [[1, "TCHARAM! QUAL DE NÓS É O VERDADEIRO?"]], fx: "flash" },
        { legenda: "O TREINADOR CHEGA", bichos: [["pikachu", 30, { v: true }], ["pikachu", 136]],
          falas: [[0, "PIKA PIKA!"], [1, "DITTO DITTO!"]] },
        { bichos: [["ditto", 136]],
          falas: [[0, "...POR QUE EU SEMPRE FAÇO ISSO?"]] },
      ],
    },
    {
      titulo: "A PROVA",
      quadros: [
        { legenda: "PROVA DE MATEMÁTICA", bichos: [["psyduck", 30, { v: true }], ["alakazam", 140]],
          falas: [[0, "?"]] },
        { bichos: [["psyduck", 30, { v: true }], ["alakazam", 140]],
          falas: [[0, "??"]] },
        { bichos: [["psyduck", 30, { v: true }], ["alakazam", 140]],
          falas: [[0, "??????"]], fx: "treme" },
        { legenda: "NOTA DO PSYDUCK: 10", bichos: [["psyduck", 30, { v: true }], ["alakazam", 140]],
          falas: [[1, "ELE COLOU DE MIM. PELA MENTE. DE NOVO."]] },
      ],
    },
    {
      titulo: "O EMPURRÃO",
      quadros: [
        { bichos: [["machamp", 10, { v: true }], ["snorlax", 120, { s: 80 }]],
          falas: [[0, "SAI DA ESTRADA, GORDÃO!"]], fx: "zzz" },
        { bichos: [["machamp", 60, { v: true }], ["snorlax", 120, { s: 80 }]],
          falas: [[0, "NHÉÉÉÉÉÉ!!!"]], fx: "treme" },
        { legenda: "2 HORAS DEPOIS", bichos: [["snorlax", 70, { s: 80 }], ["machamp", 84, { dy: -40, s: 52 }]],
          falas: [[1, "ZZZ..."]], fx: "zzz" },
      ],
    },
    {
      titulo: "BUUU",
      quadros: [
        { legenda: "O CEMITÉRIO, MEIA-NOITE", bichos: [["gengar", 24, { v: true }], ["wobbuffet", 140]],
          falas: [[0, "BUUUUUUU!!!"]] },
        { bichos: [["gengar", 24, { v: true }], ["wobbuffet", 140]],
          falas: [[1, "WOBBUFFET!"]], fx: "flash" },
        { bichos: [["gengar", 24, { v: true, dy: 20 }], ["wobbuffet", 140]],
          falas: [[0, "QUEM DEIXOU ESSE CARA ENTRAR NO CEMITÉRIO?"]] },
      ],
    },
    {
      titulo: "AMIGOS PRA SEMPRE",
      quadros: [
        { bichos: [["caterpie", 40, { v: true }], ["pikachu", 130]],
          falas: [[0, "VAMOS SER AMIGOS PRA SEMPRE!"], [1, "JUNTOS! PRA SEMPRE!"]] },
        { legenda: "AÍ O VÍTOR LIGOU A MÁQUINA", bichos: [["caterpie", 40, { v: true }], ["pikachu", 130]], fx: "flash" },
        { bichos: [[CATECHU, 80]],
          falas: [[0, "...NÃO ERA ESSE O JUNTOS QUE A GENTE QUERIA."]] },
      ],
    },
    {
      titulo: "A CAVERNA",
      quadros: [
        { legenda: "MONTE LUA, PASSO 1", bichos: [["zubat", 120]], falas: [[0, "OI!"]] },
        { legenda: "PASSO 2", bichos: [["zubat", 80]], falas: [[0, "OI DE NOVO!"]] },
        { legenda: "PASSO 3", bichos: [["zubat", 30], ["zubat", 100], ["zubat", 160]],
          falas: [[0, "OI!"], [1, "OI!"], [2, "OI!"]], fx: "treme" },
        { legenda: "PASSO 4", bichos: [["golbat", 80]],
          falas: [[0, "EU SOU O MESMO ZUBAT. CRESCI DE TANTO TE SEGUIR."]] },
      ],
    },
    {
      titulo: "CHARIZARD",
      quadros: [
        { bichos: [["@andre", 20, { v: true }], ["dragonite", 130]],
          falas: [[0, "VAI, CHARIZARD! USA O LANÇA-CHAMAS!"]] },
        { bichos: [["@andre", 20, { v: true }], ["dragonite", 130]],
          falas: [[1, "EU SOU UM DRAGONITE."]] },
        { bichos: [["@andre", 20, { v: true }], ["dragonite", 130]],
          falas: [[0, "ISSO, CHARIZARD! FALOU BONITO!"]] },
        { legenda: "NO DIA SEGUINTE", bichos: [["dragonite", 80]],
          falas: [[0, "...MEU NOME É CHARIZARD."]] },
      ],
    },
    {
      titulo: "A MAÇÃ",
      quadros: [
        { bichos: [["@vitor", 20, { v: true }], ["applin", 140, { s: 52 }]],
          falas: [[0, "NÃO EVOLUI, HEIN! SE EVOLUIR VOCÊ SAI DA MAÇÃ!"]] },
        { legenda: "3 ANOS DEPOIS", bichos: [["applin", 86, { s: 52 }]],
          falas: [[0, "VÍTOR."]] },
        { bichos: [["@vitor", 20, { v: true }], ["applin", 140, { s: 52 }]],
          falas: [[0, "QUE FOI?"], [1, "A MAÇÃ TÁ PODRE."]] },
      ],
      // a fala do VÍTOR depois desta (no lugar da sorteada de `depois`)
      fim: [
        "VÍTOR: ESSA FOI SÓ PRA DIZER QUE EU NÃO EVOLUO O APPLIN NEM A PAU.",
        "VÍTOR: MAS A MAÇÃ NÃO IA APODRECER, VIU? O APPLIN SOLTA UMA SUBSTÂNCIA NA MAÇÃ PRA ELA NÃO APODRECER.",
      ],
    },
    {
      titulo: "A ESPADA",
      quadros: [
        { bichos: [["farfetchd", 30, { v: true }], ["snorlax", 120, { s: 80 }]],
          falas: [[0, "ESTE ALHO-PORÓ É A MINHA ESPADA! EU SOU UM GUERREIRO!"]] },
        { bichos: [["farfetchd", 30, { v: true }], ["snorlax", 120, { s: 80 }]],
          falas: [[1, "NHAM."]], fx: "treme" },
        { bichos: [["farfetchd", 30, { v: true }], ["snorlax", 120, { s: 80 }]],
          falas: [[0, "AGORA EU SOU SÓ UM PATO."]] },
      ],
    },
    {
      titulo: "QUEM MANDA AQUI",
      quadros: [
        { bichos: [["magnemite", 20, { s: 48 }], ["magnemite", 88, { s: 48 }], ["magnemite", 156, { s: 48 }]],
          falas: [[1, "JUNTOS A GENTE VIRA UM MAGNETON!"]] },
        { bichos: [["magneton", 80]], fx: "flash" },
        { bichos: [["magneton", 80]],
          falas: [[0, "...QUEM TÁ DIRIGINDO O CORPO?"]] },
        { bichos: [["magneton", 80]],
          falas: [[0, "EU."], [0, "EU!"], [0, "EU!!!"]], fx: "treme" },
      ],
    },
    {
      titulo: "O SHOW",
      quadros: [
        { legenda: "O GRANDE SHOW DA JIGGLYPUFF", bichos: [["jigglypuff", 80]],
          falas: [[0, "LÁ LÁ LÁÁÁÁÁ ♥"]] },
        { bichos: [["pikachu", 20], ["snorlax", 120, { s: 80 }]], fx: "zzz" },
        { bichos: [["jigglypuff", 80]], falas: [[0, "DE NOVO?!"]], fx: "treme" },
        { legenda: "DEPOIS", bichos: [["snorlax", 20, { s: 80, v: true }], ["jigglypuff", 140]],
          falas: [[0, "QUE SONECA BOA! CANTA OUTRA?"]] },
      ],
    },
    {
      titulo: "O CLONE",
      quadros: [
        { bichos: [["mewtwo", 20, { v: true }], ["mew", 140, { s: 52 }]],
          falas: [[0, "EU SOU O SEU CLONE. EU SOU MELHOR."]] },
        { bichos: [["mewtwo", 20, { v: true }], ["mew", 140, { s: 52 }]],
          falas: [[1, "ENTÃO POR QUE O SEU NOME É O MEU COM UM 2?"]] },
        { bichos: [["mewtwo", 20, { v: true }], ["mew", 140, { s: 52 }]],
          falas: [[0, "..."]] },
        { legenda: "MEWTWO FOI PRO QUARTO E BATEU A PORTA", bichos: [["mew", 86, { s: 52 }]],
          falas: [[0, "HIHI."]] },
      ],
    },
    {
      titulo: "OS TRÊS FÓSSEIS",
      quadros: [
        { bichos: [["giganteeth", 70, { s: 80 }]],
          falas: [[0, "EU SOU O MAIOR CAÇADOR DE BRAGLITCH!"]] },
        { bichos: [["giganteeth", 6, { s: 80, v: true }], ["gallimirage", 130]],
          falas: [[1, "TCHAU, LERDO!"]], fx: "flash" },
        { bichos: [["giganteeth", 70, { s: 80 }]],
          falas: [[0, "...O MAIS FORTE, PELO MENOS."]] },
        { bichos: [["giganteeth", 6, { s: 80, v: true }], ["stegarmorex", 130, { s: 80 }]],
          falas: [[1, "NÃO."], [0, "VOCÊS SÃO MUITO CHATOS."]] },
      ],
    },
    {
      titulo: "UMA ÁRVORE NORMAL",
      quadros: [
        { legenda: "UMA ÁRVORE NORMAL", bichos: [["sudowoodo", 120]] },
        { bichos: [["growlithe", 40, { v: true }], ["sudowoodo", 120]],
          falas: [[0, "AH, UMA ÁRVORE! QUE ÓTIMO..."]] },
        { bichos: [["growlithe", 70, { v: true }], ["sudowoodo", 120]],
          falas: [[1, "NEM PENSE NISSO."]], fx: "treme" },
      ],
    },
    {
      titulo: "O CRAQUE",
      quadros: [
        { legenda: "UMA POKÉ BOLA NO MEIO DA RUA!", bichos: [["voltorb", 140, { s: 40 }]] },
        { bichos: [["@andre", 30, { v: true }], ["voltorb", 140, { s: 40 }]],
          falas: [[0, "OPA, UMA BOLA! OLHA O CHUTE!"]] },
        { legenda: "BUUUUUM", bichos: [["electrode", 140, { s: 48 }]], fx: "flash" },
        { bichos: [["@andre", 30, { v: true, dy: 30 }], ["voltorb", 140, { s: 40 }]],
          falas: [[0, "...FOI GOL?"], [1, "NÃO."]] },
      ],
    },
    {
      titulo: "O MENOR E O MAIOR",
      quadros: [
        { bichos: [["joltik", 30, { s: 28 }], ["wailord", 90, { s: 128, dy: 20 }]],
          falas: [[0, "SAI DA FRENTE, BALEIA!"]] },
        { bichos: [["wailord", 50, { s: 128, dy: 20 }]],
          falas: [[0, "QUEM FALOU ISSO?"]] },
        { legenda: "ATÉ HOJE ELE NÃO SABE", bichos: [["wailord", 50, { s: 128, dy: 20 }], ["joltik", 104, { s: 24, dy: -86 }]],
          falas: [[1, "HEHE."]] },
      ],
    },
  ],
};
