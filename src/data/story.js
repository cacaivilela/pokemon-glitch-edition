// Arco principal: 011glitchdimension110.
// A cada insígnia o Prof. Carvalho chama o jogador no laboratório e conta mais
// um pedaço. Com as 8, MISSINGNO. atravessa e o mundo buga — aí o objetivo vira
// capturá-lo. Tudo aqui tem hot-swap: dá pra reescrever com o jogo aberto.
export const STORY = {
  /** Ao pisar em Viridian pela primeira vez: a Pokédex apita sozinha.
   *  É daqui em diante que os fragmentos de portal começam a aparecer. */
  pokedexAlert: {
    beep: "SUA POKÉDEX APITA SOZINHA E A TELA PISCA.",
    message: "NA TELA APARECE ESCRITO:\n\"BUG SE F09M4NDO, QUANDO V03Ê VNC4R G1NÁSIO DEV4 S0 FORW4D0\"",
    after: "A TELA VOLTA AO NORMAL COMO SE NADA TIVESSE ACONTECIDO.",
  },

  /** A TEMPESTADE QUE NÃO ACABA: o mar perto de BIRTH ISLAND onde moram as três
   *  forças da natureza. Só se chega de barco, com o marinheiro de VERMILION
   *  (as side quests em src/data/missoes.js). O mapa é gerado em código. */
  tempestade: {
    nome: "TEMPESTADE",
    nivel: 50,
    espera: [
      "EU FICO AQUI COM O BARCO. NÃO SAIO DELE NEM MORTO.",
      "QUANDO QUISER VOLTAR, É SÓ FALAR COMIGO.",
    ],
    encontro: {
      padrao: ["A CHUVA PAROU NUM CÍRCULO EM VOLTA DELE."],
      tornadus: [
        "O VENTO TODO DA TEMPESTADE ESTÁ SAINDO DAQUELE PONTO ALI.",
        "NÃO É QUE ELE VOA NO VENTO. O VENTO É O RABO DELE.",
      ],
      thundurus: [
        "O RAIO CAIU DE NOVO NO MESMO LUGAR. E DE NOVO. E DE NOVO.",
        "NÃO É O RAIO QUE ACHA ELE: É ELE QUE VOLTA PRO MESMO PONTO.",
      ],
      landorus: [
        "O RECIFE ESTÁ QUENTE E ELE ESTÁ NO MEIO, PARADO, COMO SE ESTIVESSE ESPERANDO.",
        "COM O VENTO E O RAIO FORA DAQUI, SOBROU O CHÃO. E O CHÃO VEIO VER.",
      ],
    },
  },

  /** COMANDOS, na tela de abertura. Fora do jogo eles ficam embaixo do canvas,
   *  mas quem abre o site no celular não vê aquela linha — e quem joga em tela
   *  cheia também não. Então eles moram aqui dentro também. */
  comandos: {
    titulo: "COMANDOS",
    ajuda: "CIMA/BAIXO ROLA   X VOLTA",
    // cada linha da direita cabe em 23 letras: mais que isso, some na borda
    lista: [
      ["SETAS / WASD", "ANDAR"],
      ["Z / ENTER", "CONFIRMAR E ATACAR"],
      ["X / ESC", "VOLTAR, ABRIR O MENU"],
      ["SHIFT", "CORRER"],
      ["C", "MEGA NA BATALHA"],
      ["C", "FERRAMENTA NA OFICINA"],
      ["MOUSE", "PINTAR NA OFICINA"],
      ["TAB", "TROCAR DE ABA"],
      ["Q / E     R", "ZOOM      PINCEL"],
      ["1-8  P  U  D", "COR PALETA DESFAZ LIMPA"],
      ["M", "MUDO"],
      ["F", "FPS E POSIÇÃO"],
      ["G", "SACUDIR O GLITCH"],
    ],
  },

  /** o professor confere se você entendeu antes de contar o capítulo */
  oakCheck: {
    ask: "CALCULEI CERTO O TEMPO. OBRIGADO, CONOR. {NOME}, VOCÊ RECEBEU MINHA MENSAGEM?",
    options: ["NÃO", "AQUELE CÓDIGO?"],
    replyNo: ["ERA O QUE EU IMAGINAVA. NINGUÉM ENTENDE DA PRIMEIRA VEZ.", "DEIXA EU EXPLICAR DO COMEÇO."],
    replyCode: [
      "AI NÃO...",
      "SE VOCÊ VIU O CÓDIGO, ENTÃO A MENSAGEM CHEGOU EMBARALHADA ATÉ AÍ TAMBÉM.",
      "EU MANDEI DE OUTRO APARELHO JUSTAMENTE PRA ISSO NÃO ACONTECER.",
      "O BUG ESTÁ MAIS FORTE DO QUE EU CALCULEI: ELE BAGUNÇOU A MENSAGEM MESMO ESTANDO EM UM OUTRO DISPOSITIVO.",
    ],
  },

  /** Como o professor te recebe a cada insígnia. Na primeira ele ainda pergunta
   *  da mensagem (oakCheck); daí em diante ele já entra direto no assunto, e
   *  nunca do mesmo jeito. */
  oakGreet: {
    2: [
      "VOCÊ CHEGOU. NÃO PRECISA SENTAR, ISSO É RÁPIDO.",
      "DESSA VEZ EU NÃO MANDEI MENSAGEM NENHUMA. NÃO CONFIO MAIS NO APARELHO.",
    ],
    3: [
      "FECHA A PORTA, MEU JOVEM.",
      "O QUE EU VOU TE CONTAR AGORA EU NÃO ESCREVI EM LUGAR NENHUM.",
    ],
    4: [
      "QUATRO. EU ANOTEI O QUE IA TE DIZER PORQUE ONTEM EU ESQUECI TUDO DE UMA VEZ.",
      "LI A MINHA PRÓPRIA LETRA E NÃO RECONHECI. MAS A INFORMAÇÃO ESTÁ CERTA.",
    ],
    5: [
      "EU SABIA A HORA QUE VOCÊ IA ENTRAR POR ESSA PORTA. NÃO ME PERGUNTE COMO.",
      "SENTA. ESSA PARTE É PESADA.",
    ],
    6: [
      "DESLIGUEI TODAS AS MÁQUINAS DAQUI, MENOS UMA. ELA NÃO DESLIGA.",
      "ELA ESTÁ IMPRIMINDO O SEU NOME DESDE ONTEM À NOITE, MEU JOVEM.",
    ],
    7: [
      "...",
      "OBRIGADO POR VIR. EU NÃO TINHA CERTEZA SE VOCÊ AINDA VIRIA.",
      "SETE INSÍGNIAS. NÓS DOIS SABEMOS O QUE FALTA.",
    ],
  },

  /** quando você fala com o professor sem ter nada pendente */
  oakIdle: {
    1: ["UMA INSÍGNIA. CONTINUE — E VOLTE AQUI A CADA UMA DELAS.",
        "VOCÊ TEM 1 DE 8."],
    2: ["DUAS. O SINAL DO OUTRO LADO FICA MAIS LIMPO A CADA UMA.",
        "VOCÊ TEM 2 DE 8."],
    3: ["TRÊS. EU AINDA ESTOU LENDO OS DADOS QUE VOCÊ TROUXE DA FENDA.",
        "VOCÊ TEM 3 DE 8."],
    4: ["QUATRO. NÃO GUARDE NADA NO PC SEM PRECISAR, MEU JOVEM.",
        "VOCÊ TEM 4 DE 8."],
    5: ["CINCO. HOJE A IMPRESSORA PAROU SOZINHA. ISSO ME ASSUSTOU MAIS QUE O BARULHO.",
        "VOCÊ TEM 5 DE 8."],
    6: ["SEIS TRAVAS ABERTAS. FALTAM DUAS.",
        "AINDA DÁ TEMPO DE TREINAR. NÃO DÁ TEMPO DE DESISTIR."],
    7: ["SETE. A OITAVA É COM O GIOVANNI, EM VIRIDIAN.",
        "QUANDO VOCÊ VENCER, VOLTE CORRENDO. EU VOU ESTAR AQUI."],
  },

  /** item que o Conor entrega: sem ele os fragmentos são invisíveis */
  detector: {
    item: "visor-g.l.i.t.c.h",
    give: [
      "CONOR: ANTES DE IR, PEGA ISSO AQUI.",
      "É O VISOR-G.L.I.T.C.H. O PROFESSOR MONTOU COM PEÇA DE POKÉDEX VELHA.",
      "SEM ELE OS FRAGMENTOS DE PORTAL FICAM INVISÍVEIS — SEU OLHO SIMPLESMENTE PULA POR CIMA.",
      "COM ELE VOCÊ ENXERGA OS FRAGMENTOS E AINDA LÊ O NÍVEL MÉDIO DO QUE MORA DO OUTRO LADO.",
    ],
    got: "VOCÊ RECEBEU O VISOR-G.L.I.T.C.H!",
    reading: "VISOR-G.L.I.T.C.H: NÍVEL MÉDIO DO OUTRO LADO = {MEDIA}.\nTERRA {TERRA} / ÁGUA {AGUA} / AR {AR}.",
  },

  /** O assistente do professor aparece e te leva até o laboratório.
   *  Cada bloco é indexado pelo número de insígnias: o CONOR nunca repete a
   *  mesma fala, e vai perdendo a coragem conforme o arco avança.
   *  (`porInsignia` no overworld cai na última variante escrita.) */
  escort: {
    found: {
      1: [
        "EI! ESPERA AÍ!",
        "DESCULPA A CORRERIA — EU SOU O CONOR, ASSISTENTE DO PROF. CARVALHO.",
        "ELE PEDIU PRA EU TE BUSCAR ASSIM QUE VOCÊ GANHASSE MAIS UMA INSÍGNIA.",
        "É URGENTE. VEM COMIGO PRA VILA PALETA!",
      ],
      2: [
        "DE NOVO EU! DESSA VEZ EU CORRI MAIS RÁPIDO.",
        "O PROFESSOR SOUBE DA SUA SEGUNDA INSÍGNIA ANTES DE MIM.",
        "ELE ESTÁ ANDANDO EM CÍRCULOS NO LABORATÓRIO DESDE ONTEM. VEM.",
      ],
      3: [
        "OI! ...VOCÊ NEM SE ASSUSTA MAIS QUANDO EU APAREÇO.",
        "TRÊS INSÍGNIAS. ELE MANDOU EU NÃO TE CONTAR NADA NO CAMINHO.",
        "EU NEM PERGUNTEI O QUE É DESSA VEZ. ACHO QUE NÃO QUERO SABER.",
      ],
      4: [
        "TE ACHEI PELA POKÉDEX — ELA MARCA ONDE VOCÊ ESTÁ.",
        "CALMA, ELE SÓ COMEÇOU A USAR ISSO ESSA SEMANA. EU ACHO.",
        "QUATRO INSÍGNIAS, {NOME}. ELE DORMIU NO LABORATÓRIO AS DUAS ÚLTIMAS NOITES.",
      ],
      5: [
        "EU IA TE ESPERAR NO CENTRO POKÉMON, MAS ELE MANDOU IR AGORA.",
        "CINCO INSÍGNIAS. A IMPRESSORA DELE NÃO PARA DE CUSPIR PAPEL.",
        "TEM A MESMA COISA ESCRITA EM TODAS AS FOLHAS. DEIXA ELE TE MOSTRAR.",
      ],
      6: [
        "...OI. DESCULPA, EU NÃO DORMI.",
        "SEIS INSÍGNIAS. ELE DESLIGOU TODOS OS COMPUTADORES DO LABORATÓRIO.",
        "TODOS MENOS UM. ESSE NÃO DESLIGA.",
        "VEM COMIGO. E NÃO ENCOSTA NA TELA QUANDO CHEGAR.",
      ],
      7: [
        "EU QUASE NÃO VIM TE BUSCAR DESSA VEZ.",
        "SETE INSÍGNIAS, {NOME}. SÓ FALTA UMA.",
        "O PROFESSOR ESCREVEU NA PORTA: \"TRAGA {NOME} ANTES DA OITAVA\".",
        "ENTÃO EU TÔ AQUI. VAMOS LOGO, ANTES QUE EU MUDE DE IDEIA.",
      ],
    },
    arrive: "VOCÊ SEGUE O ASSISTENTE ATÉ O LABORATÓRIO DO PROF. CARVALHO...",
    waiting: {
      1: [
        "CONOR: O PROFESSOR ESTÁ ALI. FALE COM ELE.",
        "QUANDO TERMINAR, FALE COMIGO QUE EU TE LEVO DE VOLTA.",
      ],
      2: [
        "CONOR: ELE JÁ ESTÁ FALANDO SOZINHO. PODE IR.",
        "EU ESPERO AQUI PERTO DA PORTA.",
      ],
      3: [
        "CONOR: VAI LÁ. EU JÁ OUVI ESSA PARTE E NÃO QUERO OUVIR DE NOVO.",
      ],
      4: [
        "CONOR: ELE ANOTOU O QUE IA TE FALAR NUMA FOLHA. ISSO É NOVO.",
        "PODE IR. EU FICO DE OLHO NA MÁQUINA DA CÚPULA.",
      ],
      5: [
        "CONOR: ELE ESTÁ TE ESPERANDO DE COSTAS PRA PORTA HÁ UMA HORA.",
        "EU NÃO SEI COMO ELE SABIA A HORA QUE A GENTE IA CHEGAR.",
      ],
      6: [
        "CONOR: FALA COM ELE. E SE ELE CHAMAR VOCÊ DE OUTRO NOME, NÃO RESPONDE.",
      ],
      7: [
        "CONOR: É A ÚLTIMA VEZ QUE EU TE TRAGO AQUI, NÉ?",
        "VAI LÁ. EU FICO ENTRE VOCÊ E A PORTA.",
      ],
    },
    offerReturn: {
      1: "CONOR: TERMINOU? POSSO TE LEVAR DE VOLTA PRO LUGAR ONDE TE ACHEI.",
      2: "CONOR: TERMINOU? EU JÁ SEI O CAMINHO DE VOLTA DE COR.",
      3: "CONOR: JÁ? EU NEM SENTEI. QUER CARONA DE VOLTA?",
      4: "CONOR: VAMOS SAIR DAQUI. TE DEIXO ONDE EU TE ACHEI?",
      5: "CONOR: EU TE LEVO DE VOLTA. SÓ NÃO ME PEÇA PRA REPETIR O QUE ELE DISSE.",
      6: "CONOR: ME LEVA JU— QUER DIZER: EU TE LEVO DE VOLTA. VAMOS?",
      7: "CONOR: VAMOS EMBORA. POR FAVOR. VOLTAR PRO LUGAR DE ANTES?",
    },
    returned: {
      1: "CONOR: PRONTO, MESMO LUGAR. BOA SORTE COM A PRÓXIMA INSÍGNIA, {NOME}!",
      2: "CONOR: MESMO LUGAR, MESMA HORA. VAI LÁ BUSCAR A TERCEIRA!",
      3: "CONOR: CHEGAMOS. DA PRÓXIMA VEZ EU TRAGO ALGO PRA COMER NA VIAGEM.",
      4: "CONOR: PRONTO. ...VOCÊ TAMBÉM ACHOU O LABORATÓRIO MAIS ESCURO HOJE?",
      5: "CONOR: É AQUI. EU VOU DORMIR EM CASA ESSA NOITE. ACHO.",
      6: "CONOR: CHEGAMOS. NÃO OLHA PRA TRÁS AGORA. DEPOIS EU EXPLICO.",
      7: "CONOR: É AQUI. {NOME}... SE VOCÊ NÃO FOR NO ÚLTIMO GINÁSIO, NÃO ACONTECE, NÉ?",
    },
  },

  /** fala do professor quando você aparece com N insígnias */
  chapters: {
    1: [
      "VOCÊ VENCEU UM GINÁSIO! MAS NÃO FOI POR ISSO QUE TE CHAMEI.",
      "OS COMPUTADORES DO LABORATÓRIO REGISTRARAM UM ENDEREÇO QUE NÃO DEVERIA EXISTIR.",
      "ELES O CHAMAM DE 011GLITCHDIMENSION110.",
      "ACHEI QUE FOSSE DEFEITO DA MÁQUINA. AGORA JÁ NÃO TENHO CERTEZA.",
    ],
    2: [
      "DUAS INSÍGNIAS. E O ENDEREÇO RESPONDEU.",
      "ELE DEVOLVEU OS DADOS DE UM POKÉMON QUE NUNCA FOI CAPTURADO POR NINGUÉM.",
      "ALTURA: 3 METROS. PESO: 0,0 KG. TIPO: ILEGÍVEL.",
      "E ACHEI UMA FRAQUEZA NO QUE ESTÁ CORROMPIDO DO OUTRO LADO.",
      "O DADO DELES ESTÁ QUEBRADO: ELES NÃO SABEM MAIS QUEM SÃO.",
      "SE UM DELES LEVAR UM GOLPE DE UM POKÉMON DA MESMA ESPÉCIE QUE A DELE, ELE SE VÊ.",
      "E O QUE ESTÁ CORROMPIDO NÃO SUPORTA SE VER. O DANO FICA OITO VEZES MAIOR.",
      "LEVE UM ESPELHO PRA FENDA, MEU JOVEM. É ASSIM QUE EU CHAMO ISSO.",
    ],
    3: [
      "DESCOBRI ONDE FICA ESSA DIMENSÃO: DO OUTRO LADO DO SISTEMA DE ARMAZENAMENTO.",
      "TODA VEZ QUE ALGUÉM GUARDA UM POKÉMON NO PC, ALGUMA COISA DO OUTRO LADO ESCUTA.",
      "TENHA CUIDADO AO SALVAR O JOGO, MEU JOVEM.",
    ],
    4: [
      "ACHEI UM REGISTRO ANTIGO NO ARQUIVO DA LIGA, DE 1996.",
      "UM POKÉMON FOI APAGADO DO CARTUCHO. NÃO MORREU: FOI MOVIDO.",
      "MOVIDO PRA 011GLITCHDIMENSION110.",
    ],
    5: [
      "ELE TEM NOME. OS TÉCNICOS DA ÉPOCA ESCREVERAM NA FICHA:",
      "MISSINGNO.",
      "E ELE ESTÁ TENTANDO VOLTAR.",
    ],
    6: [
      "SEIS INSÍGNIAS... EU PRECISO TE CONTAR UMA COISA QUE A LIGA ESCONDE.",
      "AS OITO INSÍGNIAS NÃO SÃO SÓ PERMISSÃO PRA DESAFIAR A LIGA.",
      "SÃO OITO TRAVAS. CADA LÍDER GUARDA UMA.",
      "CADA VITÓRIA SUA ABRE UMA FRESTA NA PAREDE ENTRE OS DOIS MUNDOS.",
    ],
    7: [
      "FALTA UMA TRAVA.",
      "SE VOCÊ VENCER O ÚLTIMO GINÁSIO, ELE ATRAVESSA. NÃO TEM COMO SER DIFERENTE.",
      "E MESMO ASSIM EU NÃO VOU TE PEDIR PRA PARAR. ALGUÉM PRECISA ESTAR LÁ QUANDO ACONTECER.",
      "LEVE POKÉ BOLAS. MUITAS.",
    ],
  },

  /** com as 8 insígnias, ao falar com o professor */
  finale: [
    "OITO INSÍGNIAS.",
    "...",
    "VOCÊ TAMBÉM ESTÁ OUVINDO ISSO?",
    "A ÚLTIMA TRAVA CEDEU. 011GLITCHDIMENSION110 ESTÁ ABERTA.",
    "MISSINGNO. ATRAVESSOU. OS DADOS DE KANTO ESTÃO SE MISTURANDO COM OS DELE.",
    "OLHE A SUA VOLTA: O MUNDO JÁ COMEÇOU A FALHAR.",
    "SÓ EXISTE UM JEITO DE FECHAR ISSO: UMA POKÉ BOLA.",
    "UM DADO QUE NÃO EXISTE PRECISA DE UM LUGAR PRA EXISTIR. DÊ UM A ELE.",
    "ELE VAI ESTAR EM TODO LUGAR E EM LUGAR NENHUM — NA GRAMA ALTA, EM QUALQUER ROTA.",
    "MAS SE EU FOSSE VOCÊ, EU COMEÇAVA PELO CANTEIRO DE FLORES DA VILA PALETA.",
    "AQUELAS FLORES ESTÃO NO CARTUCHO DESDE O PRIMEIRO DIA. É O PEDAÇO DE TELA MAIS GASTO QUE EXISTE.",
  ],

  /** O SISTEMA DE ARMAZENAMENTO: as boxes do PC. O que não cabe na equipe (e
   *  tudo o que você capturar com ela cheia) fica guardado aqui. */
  box: {
    titulo: "SISTEMA DE ARMAZENAMENTO",
    vazia: "ESTA BOX ESTÁ VAZIA.",
    equipeCheia: "SUA EQUIPE ESTÁ CHEIA.",
    ultimo: "VOCÊ NÃO PODE GUARDAR SEU ÚLTIMO POKÉMON.",
    semLutador: "PRECISA SOBRAR PELO MENOS UM POKÉMON EM CONDIÇÕES DE LUTAR.",
    boxCheia: "ESTA BOX ESTÁ CHEIA.",
    pcCheio: "O PC NÃO TEM MAIS NENHUMA VAGA!",
    guardou: "{MON} FOI GUARDADO EM {BOX}.",
    tirou: "{MON} ENTROU NA EQUIPE.",
    // menu que abre em cima de um Pokémon
    opcoes: ["MOVER", "RESUMO", "SOLTAR", "CANCELAR"],
    // menu da barra de cima (o nome da box)
    opcoesBox: ["TROCAR NOME", "PAPEL DE PAREDE", "CANCELAR"],
    soltar: "SOLTAR {MON} DE VERDADE?",
    soltarSim: ["SOLTAR", "DEIXA PRA LÁ"],
    soltou: "{MON} FOI SOLTO. ADEUS, {MON}!",
    naoSolta: "ESSE NÃO DÁ PRA SOLTAR.",
    nomeVazio: "A BOX PRECISA DE UM NOME.",
    ajuda: "Z PEGA   X VOLTA   SHIFT TROCA A BOX",
    ajudaMao: "Z SOLTA AQUI   X DEVOLVE",
    ajudaTopo: "LADOS TROCAM A BOX   Z ABRE O MENU",
    ajudaTeclado: "Z ESCREVE   SHIFT APAGA   X CANCELA",
  },

  /** O PC do Centro Pokémon: a máquina branca no canto do balcão. */
  pc: {
    liga: "VOCÊ LIGOU O PC.",
    menu: ["SISTEMA DE ARMAZENAMENTO", "DESLIGAR"],
    desliga: "VOCÊ DESLIGOU O PC.",
    semTime: "VOCÊ AINDA NÃO TEM NENHUM POKÉMON PRA GUARDAR.",
  },

  /** DECODIFICADOR DE GENOMA. O professor entrega na PRIMEIRA conversa, antes
   *  de qualquer insígnia: é o aparelho que ele usava pra ler genoma e que
   *  começou a devolver leitura de dois bichos ao mesmo tempo. Ele junta e
   *  separa — e o que ele junta continua junto depois de salvar. */
  fusao: {
    entrega: [
      "ESPERA UM POUCO. ANTES DE MAIS NADA, LEVA ISTO AQUI.",
      "É UM DECODIFICADOR DE GENOMA. VELHO, PESADO E, ATÉ SEMANA PASSADA, HONESTO.",
      "ELE LIA UM POKÉMON E ESCREVIA O GENOMA NA FITA. AGORA ELE LÊ DOIS E ESCREVE UM.",
      "EU NÃO PEDI ISSO A ELE. ELE COMEÇOU SOZINHO.",
    ],
    ganhou: "VOCÊ RECEBEU O DECODIFICADOR DE GENOMA!",
    explica: [
      "A CABEÇA QUE VOCÊ ESCOLHER DÁ O ROSTO, O PRIMEIRO TIPO E O LADO ESPECIAL.",
      "O CORPO DÁ O RESTO DO DESENHO, O SEGUNDO TIPO E A FORÇA BRUTA.",
      "E ELE DESFAZ. OS DOIS FICAM GUARDADOS INTEIROS LÁ DENTRO — NINGUÉM SOME.",
      "E TEM A BANCADA: DÁ PRA DESENHAR O BICHO, DAR NOME, ESCOLHER OS TIPOS E DIZER QUANTO ELE CRESCE POR NÍVEL.",
      "O QUE VOCÊ ESCREVER NA FICHA VALE MAIS QUE O QUE A MÁQUINA CALCULA. ELA ACEITA.",
      "ABRE PELA MOCHILA QUANDO QUISER. SÓ... NÃO MOSTRA ISSO PRA LIGA, POR FAVOR.",
    ],
    // a tela da máquina
    titulo: "DECODIFICADOR DE GENOMA",
    menu: ["FUNDIR", "SEPARAR", "TROCAR A VERSÃO", "OFICINA", "MUNDO", "DESLIGAR"],
    escolheCabeca: "QUEM ENTRA COMO CABEÇA?",
    escolheCorpo: "QUEM ENTRA COMO CORPO?",
    escolheFusao: "QUAL GENOMA EU ABRO?",
    // trocar a versão de quem já está fundido
    escolheTrocar: "QUAL FUSÃO VOU REESCREVER?",
    escolheVersao: "PARA QUAL VERSÃO?",
    trocou: "{MON} AGORA É {NOME} ({ROTULO}).",
    semOutraVersao: "SÓ EXISTE UMA VERSÃO DESSA DUPLA. FAÇA UMA NA OFICINA.",
    confirmaFundir: "GRAVAR {CABECA} + {CORPO} COMO {NOME}?",
    confirmaSeparar: "ABRIR {MON} E DEVOLVER OS DOIS?",
    sim: ["GRAVAR", "CANCELAR"],
    simSeparar: ["ABRIR", "CANCELAR"],
    // resultado
    fundindo: "A FITA CORRE NOS DOIS SENTIDOS AO MESMO TEMPO.",
    fundiu: "{CABECA} E {CORPO} VIRARAM {NOME}!",
    separando: "A FITA VOLTA, LETRA POR LETRA.",
    separou: "{NOME} SE ABRIU EM {CABECA} E {CORPO}!",
    foiProBox: "{MON} NÃO COUBE NA EQUIPE E FOI PRO BOX.",
    // shiny + comum: a cor rara pega nos dois, e não volta atrás
    brilhoPegou: "O BRILHO DE UM PASSOU PRO OUTRO! OS DOIS ESTÃO SHINY LÁ DENTRO AGORA.",
    saiuBrilhando: "OS DOIS SAÍRAM BRILHANDO.",
    // a ficha existe, mas ao contrário (fez A+B e está fundindo B+A)
    temFichaTag: "FICHA: {NOME}",
    fichaAoContrario: "FICHA AO CONTRÁRIO",
    perguntaInverter: "SUA FICHA É {NOME}, COM {CABECA} NA CABEÇA. E VOCÊ PEDIU {OUTRO} NA CABEÇA.",
    opcoesInverter: ["TROCAR OS LADOS", "FUNDIR DO MEU JEITO", "CANCELAR"],
    copiarInvertida: "COPIAR A FICHA AO CONTRÁRIO",
    publicar: "PUBLICAR NO CÓDIGO",
    confirmaPublicar: "PUBLICAR {NOME} NO CÓDIGO DO JOGO? ELA VIRA UMA VARIANTE DESSA DUPLA PRA QUALQUER PARTIDA DAQUI.",
    opcoesPublicar: ["PUBLICAR", "AINDA NÃO"],
    publicou: "{NOME} ENTROU NO CÓDIGO. AGORA ELA APARECE NO C DA MÁQUINA, COMO AS OUTRAS.",
    // O MUNDO: o repositório de onde todo mundo baixou este jogo. Publicar
    // deixa a ficha nesta casa; mandar pro mundo põe ela no próprio jogo.
    // o botão no menu do jogador: puxa tudo que foi publicado no mundo
    atualizar: "ATUALIZAR",
    mundoBuscando: "PROCURANDO O QUE PUBLICARAM POR AÍ...",
    mundoDesenhos: "{N} DELAS VIERAM COM O DESENHO DE QUEM FEZ.",
    semServidor: "ISTO SÓ FUNCIONA NO JOGO RODANDO EM CASA, COM O SERVIDOR LIGADO. AQUI NA WEB DÁ PRA FUNDIR E DESENHAR — MAS A FICHA FICA SÓ NESTE NAVEGADOR.",
    mundoChegou: "{N} FUSÃO(ÕES) NOVA(S) CHEGARAM DO MUNDO. JÁ ESTÃO NO C DA MÁQUINA.",
    mundoNada: "NADA NOVO POR LÁ. VOCÊ JÁ TEM TUDO QUE PUBLICARAM.",
    mundoFalhou: "NÃO DEU PRA FALAR COM O MUNDO: {ERRO}",
    mundoEnviou: "{NOME} SUBIU. QUEM BAIXAR OU ATUALIZAR O JOGO VAI PODER FUNDIR ESSA DUPLA ASSIM.",
    mundoRecusou: "O MUNDO NÃO ACEITOU: {ERRO}. A FICHA CONTINUA VALENDO AQUI E NA SUA REDE.",
    mandandoCodigo: "MANDANDO PRO CÓDIGO DO JOGO...",
    indoProCodigo: "E ELA JÁ ESTÁ INDO PRO CÓDIGO SOZINHA. QUEM BAIXAR O JOGO VAI TER ESSA FUSÃO.",
    publicouMundo: "ELA SUBIU PRO MUNDO. QUALQUER PESSOA QUE APERTAR ATUALIZAR VAI RECEBER — SÃO {N} FUSÕES LÁ AGORA.",
    publicouRede: "{N} APARELHO{S} LIGADO{S} NESTE SERVIDOR JÁ RECEBERAM — SEM RECARREGAR NADA. QUEM ENTRAR DEPOIS JÁ NASCE COM ELA.",
    falhouPublicar: "O SERVIDOR NÃO ACEITOU. ELE ESTÁ NO AR?",
    precisaGravar: "GRAVE A FICHA ANTES DE PUBLICAR.",
    copiou: "A FICHA DE {NOME} VEIO PRO OUTRO LADO. O DESENHO VEIO JUNTO.",
    // recusas
    poucos: "A MÁQUINA PRECISA DE DOIS POKÉMON NA EQUIPE.",
    semFusao: "VOCÊ NÃO TEM NENHUM GENOMA GRAVADO PRA ABRIR.",
    jaFundido: "ESSE JÁ É UMA FUSÃO. A FITA NÃO DOBRA DUAS VEZES.",
    naoDaParaFundir: "A LEITURA NÃO FECHOU. TENTE OUTRA DUPLA.",
    ajuda: "Z CONFIRMA   X VOLTA",
    ajudaCatalogo: "{TOTAL} COMBINAÇÕES   ENDEREÇO {CODIGO}",
    // a oficina: o editor de fusões (src/scenes/fusaoeditor.js)
    oficina: "OFICINA DE GENOMA",
    escolheOficina: "QUAL GENOMA VOU ABRIR NA BANCADA?",
    // dá pra desenhar uma dupla que você não tem: é só dizer quais são
    oficinaComo: "DE ONDE VÊM OS DOIS?",
    oficinaOpcoes: ["DA MINHA EQUIPE", "DIGITAR NÚMERO OU NOME", "IMPORTAR FICHA"],
    // ficha vinda do FUSIONGLITCH (o site de fazer fusão fora do jogo)
    importar: "ESCOLHA O ARQUIVO DA FICHA (.FUSAO.JSON).",
    importou: "{NOME} ENTROU NO JOGO! ELA JÁ ESTÁ NO C DA MÁQUINA, EM {CABECA} + {CORPO}.",
    importouErro: "ESSE ARQUIVO NÃO É UMA FICHA DE FUSÃO: {ERRO}",
    importouCancelou: "TUDO BEM. A BANCADA CONTINUA AQUI.",
    digitarTitulo: "BANCADA LIVRE",
    digitarCabeca: "CABEÇA",
    digitarCorpo: "CORPO",
    digitarAbrir: "ABRIR A BANCADA",
    digitarVazio: "— NÚMERO OU NOME —",
    digitarNaoAchou: "NÃO ACHEI NINGUÉM COM ESSE NÚMERO OU NOME.",
    digitarFaltam: "PRECISO DOS DOIS LADOS PRA ABRIR A BANCADA.",
    digitarAjuda: [
      "Z DIGITA   CIMA/BAIXO ESCOLHE   X SAI",
      "VALE O NÚMERO DA POKÉDEX (025) OU O NOME (PIKACHU)",
      "NÃO PRECISA TER OS DOIS: AQUI É SÓ O DESENHO",
    ],
    // a linha de baixo do editor: elas se revezam, porque não cabem juntas
    // cada linha cabe nos 40 caracteres da tela; elas se revezam sozinhas
    ajudaDesenho: [
      "MOUSE PINTA E CLICA  RODINHA = ZOOM",
      "SETAS MOVEM  Z PINTA  C FERRAMENTA",
      "PEÇA ENCAIXA O SPRITE  H VIRA DE LADO",
      "R PINCEL  1-8 COR  9 FILEIRA  P PALETA",
      "U DESFAZ  D APAGA TUDO  TAB ABA  X SAI",
    ],
    limparTudo: "APAGAR O DESENHO INTEIRO?",
    opcoesLimpar: ["APAGAR TUDO", "DEIXA PRA LÁ"],
    limpou: "A TELA FICOU EM BRANCO. (U TRAZ DE VOLTA)",
    ajudaFicha: [
      "SETAS ESCOLHEM  LADOS MUDAM O TIPO",
      "Z EDITA  C APAGA A FICHA  TAB ABA  X SAI",
    ],
    ajudaStats: [
      "LADOS MUDAM  SHIFT PULA DE 10 EM 10",
      "Z TROCA A COLUNA  C GRAVA  TAB ABA  X SAI",
    ],
    ajudaTeclado: "ENTER CONFIRMA   ESC CANCELA",
    gravarAoSair: "GRAVAR O QUE VOCÊ MEXEU?",
    opcoesSaida: ["GRAVAR", "JOGAR FORA", "VOLTAR"],
    gravou: "FICHA DE {NOME} GRAVADA. É ASSIM QUE ESSA DUPLA SAI DAQUI PRA SEMPRE.",
    apagarFicha: "APAGAR A FICHA E DEIXAR A MÁQUINA CALCULAR SOZINHA?",
    opcoesApagar: ["APAGAR", "DEIXA PRA LÁ"],
    apagou: "FICHA APAGADA. A MÁQUINA VOLTOU A CHUTAR.",
    // A FAXINA DA SEMANA: uma vez por semana a máquina aponta as fusões que MAL
    // SAÍRAM da montagem automática. O acervo protegido ela nem olha.
    faxinaTitulo: "FAXINA DA SEMANA",
    faxinaAviso: [
      "SEMANA NOVA. A MÁQUINA REVISOU O ACERVO SOZINHA.",
      "ELA MEDE UMA COISA SÓ: O QUANTO CADA DESENHO FOI FEITO À MÃO, EM CIMA DA MONTAGEM QUE ELA JÁ FAZ.",
      "O QUE JÁ ESTAVA AQUI ESTÁ PROTEGIDO: ELA SÓ ENCOSTA NO QUE CHEGOU DEPOIS.",
    ],
    faxinaPergunta: "{LISTA} MAL SAIU DA MONTAGEM AUTOMÁTICA. JOGAR FORA?",
    faxinaPerguntaVarias: "ESTES MAL SAÍRAM DA MONTAGEM AUTOMÁTICA: {LISTA}. JOGAR FORA?",
    faxinaOpcoes: ["JOGAR FORA", "DEIXAR FICAR"],
    faxinaFora: "{LISTA} SAIU DO ACERVO. (O HISTÓRICO GUARDA — DÁ PRA VOLTAR.)",
    faxinaFicou: "TUDO BEM. FICA — E A MÁQUINA SÓ PERGUNTA DE NOVO NA SEMANA QUE VEM.",
    faxinaErro: "NÃO DEU PRA APAGAR: {ERRO}",
    faxinaVazio: "NADA A JOGAR FORA ESTA SEMANA. TODO DESENHO NOVO SAIU DA MONTAGEM.",
    faxinaPensando: "MEDINDO OS DESENHOS...",
    // examinar o item fora do laboratório
    olha: "A FITA ESTÁ PARADA NO MEIO DE UMA PALAVRA QUE NÃO É NOME DE NINGUÉM.",
  },

  /** ACAMPAR (menu do mapa). A barraca, a panela e a bola. */
  acampamento: {
    montou: ["A BARRACA ESTÁ DE PÉ. TODO MUNDO SAIU DA BOLA."],
    naoPode: {
      semBarraca: "VOCÊ NÃO TEM UMA BARRACA. VENDEM NA LOJA POKÉMON.",
      dentro: "AQUI DENTRO NÃO CABE UMA BARRACA.",
      fenda: "MONTAR BARRACA AQUI? O CHÃO NEM É CHÃO.",
      semEquipe: "SEM NINGUÉM NA EQUIPE, ACAMPAR É SÓ DORMIR NO MATO.",
    },
    tabua: "O QUE VAI NO PÃO?",
    ajuda1: "Z PÕE NA TÁBUA",
    ajuda2: "C ACENDE O FOGO",
    semIngrediente: "NÃO TEM NADA PRA PÔR NO PÃO. A LOJA VENDE INGREDIENTE.",
    saiu: "SAIU UM {NOME} — {ESTRELA}!",
    valePor: "O EFEITO VALE POR {MIN} MINUTOS.",
    curou: "A EQUIPE INTEIRA ENCHEU A BARRIGA E VOLTOU AO NORMAL.",
    espere: "ESPERE O JÁ!",
    ja: "JÁ! APERTA!",
    bolaFim: "{N} DE 3. TODO MUNDO GANHOU {XP} DE EXPERIÊNCIA.",
    subiu: "{NOMES} SUBIU DE NÍVEL BRINCANDO!",
    descansou: "OS {N} DA EQUIPE DORMIRAM UM POUCO E ACORDARAM INTEIROS.",
  },

  /** OLHAR PRO CÉU (tecla O). O que se vê depende da hora do mundo
   *  (src/systems/ciclo.js) — e de ter céu pra ver. */
  ceu: {
    dia: [
      "O CÉU ESTÁ ABERTO E O SOL ESTÁ ALTO.",
      "OLHANDO ASSIM DE BAIXO, O SOL TEM CARA. É UM SOLROCK.",
      "ELE SEMPRE FOI. VOCÊ É QUE NUNCA TINHA OLHADO.",
    ],
    entardecer: [
      "O AZUL ESTÁ VIRANDO LARANJA NAS BORDAS.",
      "O SOLROCK ESTÁ ENCOSTANDO NO FIM DO MAPA.",
    ],
    noite: [
      "ESTÁ TUDO ESCURO. DÁ PRA CONTAR AS ESTRELAS.",
      "VOCÊ CONTA ATÉ ONZE E DESISTE.",
      "A LUA PISCOU. A LUA É UM LUNATONE.",
    ],
    amanhecer: [
      "UMA LINHA CLARA APARECEU NO FIM DO MAPA.",
      "O LUNATONE ESTÁ INDO EMBORA POR ALI, SEM PRESSA.",
    ],
    falta: "FALTAM {MIN} MINUTOS PRA ISSO VIRAR.",
    teto: "O TETO NÃO DEIXA VER O CÉU DAQUI.",
    fenda: [
      "O CÉU DA FENDA É O MESMO PEDAÇO DE CÉU, REPETIDO.",
      "SE VOCÊ OLHAR DEMAIS, DÁ PRA VER ONDE ELE EMENDA.",
    ],
  },

  /** MEGA EVOLUÇÃO. O ANEL MEGA sai da mão do professor; as megapedras estão
   *  espalhadas por Kanto (ver `gift` em src/data/maps.js). */
  mega: {
    anel: "anel mega",
    entrega: [
      "ESPERA. ANTES DE VOCÊ IR, PEGA ISTO AQUI.",
      "CHEGOU JUNTO COM A PRIMEIRA LEITURA ESTRANHA — E NÃO VEIO DE NENHUM LABORATÓRIO DAQUI.",
      "É UM ANEL COM UMA PEDRA LASCADA NO MEIO. ELA SÓ ACENDE PERTO DE OUTRAS IGUAIS.",
    ],
    ganhouAnel: "VOCÊ RECEBEU O ANEL MEGA!",
    explica: [
      "AS OUTRAS PEDRAS CAÍRAM ESPALHADAS POR KANTO. CADA UMA RESPONDE A UMA ESPÉCIE SÓ.",
      "COM O ANEL NO PULSO E A PEDRA CERTA NA MOCHILA, DÁ PRA IR ALÉM DA ÚLTIMA EVOLUÇÃO.",
      "UMA VEZ POR BATALHA, E SÓ ENQUANTO ELA DURAR. DEPOIS ELE VOLTA A SER ELE.",
    ],
    daPedra: "ESTA AQUI É DO SEU. GUARDE BEM: NÃO EXISTE OUTRA.",
    ganhouPedra: "VOCÊ RECEBEU A {PEDRA}!",
    daPedraDepois: [
      "VOCÊ ARRUMOU MAIS UM DA MINHA MESA. ENTÃO A PEDRA DELE É SUA TAMBÉM.",
    ],
    // dentro da batalha
    reagem: "O ANEL MEGA E A {PEDRA} REAGEM UM COM O OUTRO!",
    evoluiu: "{MON} MEGA EVOLUIU PARA {FORMA}!",
    voltou: "{MON} VOLTOU AO NORMAL.",
    jaUsou: "SÓ DÁ PRA MEGA EVOLUIR UM POKÉMON POR BATALHA.",
    // examinar a pedra na mochila
    olhaPedra: "A PEDRA TEM UM RISCO DE LUZ GIRANDO POR DENTRO. ELA SÓ REAGE COM {ESPECIE} POR PERTO.",
    olhaAnel: "A PEDRA DO ANEL ACENDE QUANDO VOCÊ CHEGA PERTO DE OUTRA IGUAL. EM BATALHA, APERTE C.",
    // o MISSINGNO. da luta final: ninguém deu pedra nenhuma pra ele
    missingno: [
      "O DADO DE MISSINGNO. ENCONTROU UMA PEDRA QUE NÃO EXISTE NA TABELA.",
      "ELE NÃO MEGA EVOLUIU: ELE SE SOBRESCREVEU.",
    ],
  },

  /** A GLITCHBALL: com o mundo bugado, o professor monta uma bola com um pedaço
   *  da própria fenda. Num MISSINGNO. ela não falha — a chance de falhar é a de
   *  achar cinquenta shinies seguidos (ver catchGlitchball em battle-engine). */
  glitchball: {
    item: "glitchball",
    lines: [
      "ESPERA! ANTES DE VOCÊ SAIR DE NOVO, LEVA ISTO AQUI.",
      "EU ABRI UMA POKÉ BOLA E TROQUEI O QUE TINHA DENTRO POR UM PEDAÇO DA FENDA.",
      "ELA NÃO PRENDE UM POKÉMON. ELA DÁ ENDEREÇO A UM DADO QUE NÃO TEM NENHUM.",
      "NUM MISSINGNO. ELA NÃO FALHA. QUER DIZER... ELA PODE FALHAR.",
      "EU FIZ A CONTA: É MAIS FÁCIL VOCÊ ACHAR CINQUENTA SHINIES SEGUIDOS NA GRAMA.",
    ],
    got: "VOCÊ RECEBEU A GLITCHBALL!",
    outra: [
      "VOCÊ GASTOU A OUTRA? ...EM QUÊ?",
      "TUDO BEM, TUDO BEM. AINDA TENHO PEDAÇO DE FENDA NA BANCADA. TOMA MAIS UMA.",
    ],
    jogou: "VOCÊ JOGOU A GLITCHBALL! ELA PISCA ENTRE ESTAR E NÃO ESTAR NA SUA MÃO.",
  },

  /** lembrete se você falar com o professor durante a caçada */
  hunting: [
    "AINDA ESTÁ LÁ FORA. EU SINTO O LABORATÓRIO INTEIRO TREMER.",
    "GRAMA ALTA, MEU JOVEM. E NÃO SALVE O JOGO ATÉ ACABAR.",
  ],

  /** ao capturar MISSINGNO. */
  ending: [
    "A POKÉ BOLA PARA DE CHACOALHAR.",
    "O CÉU VOLTA A SER CÉU. AS ÁRVORES VOLTAM A SER ÁRVORES.",
    "PROF. CARVALHO (PELA POKÉDEX): VOCÊ CONSEGUIU. ELE ESTÁ CONTIDO.",
    "MISSINGNO. NÃO FOI DELETADO DE NOVO. AGORA ELE TEM UM LUGAR: A SUA EQUIPE.",
    "011GLITCHDIMENSION110 ESTÁ VAZIA. E FECHADA.",
    "...POR ENQUANTO.",
    "FIM.",
  ],

  /** Missões dentro da 011GLITCHDIMENSION110.
   *  A cada insígnia o professor abre a fenda e manda você enfrentar o que
   *  está do outro lado: ora um pseudo-lendário, ora um dado corrompido. */
  missions: {
    1: { boss: { id: "rattata", lvl: 16, corrupt: true }, kind: "bugado",
         intro: ["ALGUMA COISA SE MEXE NO MEIO DO RUÍDO.",
                 "É UM RATTATA. OU ERA. OS DADOS DELE ESTÃO TROCADOS DE LUGAR.",
                 "VISOR-G.L.I.T.C.H.: DADO INSTÁVEL. ESTE NÃO PODE VER A SI MESMO."],
         win: ["O RATTATA SE DESFAZ EM BLOCOS E SOME.",
               "PROF. CARVALHO: CONSEGUI LER OS DADOS DELE. A FENDA FECHOU POR ORA."] },
    2: { boss: { id: "dratini", lvl: 22 }, kind: "pseudo",
         intro: ["UM DRATINI. INTEIRO, PERFEITO — E ELE NÃO DEVERIA ESTAR AQUI.",
                 "A DIMENSÃO ESTÁ COPIANDO POKÉMON RAROS DO NOSSO MUNDO."],
         win: ["O DRATINI VOLTA PRO LUGAR DE ONDE FOI COPIADO."] },
    3: { boss: { id: "gyarados", lvl: 30, corrupt: true }, kind: "bugado",
         intro: ["UM GYARADOS COM O CORPO PISCANDO ENTRE DUAS CORES.",
                 "ELE OCUPA MAIS ESPAÇO DO QUE A TELA CONSEGUE MOSTRAR.",
                 "VISOR-G.L.I.T.C.H.: DADO INSTÁVEL. ESTE NÃO PODE VER A SI MESMO."],
         win: ["O RUGIDO CONTINUA POR TRÊS SEGUNDOS DEPOIS DELE SUMIR."] },
    4: { boss: { id: "dragonair", lvl: 38 }, kind: "pseudo",
         intro: ["UM DRAGONAIR FLUTUA NO VAZIO, CALMO, COMO SE ESPERASSE VOCÊ."],
         win: ["ELE INCLINA A CABEÇA ANTES DE SUMIR. PARECIA AGRADECIDO."] },
    5: { boss: { id: "snorlax", lvl: 44, corrupt: true }, kind: "bugado",
         intro: ["UM SNORLAX DORME ATRAVESSADO NA FENDA.",
                 "METADE DELE ESTÁ AQUI. A OUTRA METADE... NÃO ESTÁ EM LUGAR NENHUM.",
                 "VISOR-G.L.I.T.C.H.: DADO INSTÁVEL. ESTE NÃO PODE VER A SI MESMO."],
         win: ["ELE ACORDA, BOCEJA E SE DESLIGA COMO UM APARELHO."] },
    6: { boss: { id: "dragonite", lvl: 52 }, kind: "pseudo",
         intro: ["UM DRAGONITE. O MAIS FORTE QUE JÁ SE VIU EM KANTO.",
                 "PROF. CARVALHO (PELO RÁDIO): NÃO É UMA CÓPIA. É O ORIGINAL, PRESO AQUI."],
         win: ["O DRAGONITE ABRE AS ASAS E VOLTA PRO CÉU DO NOSSO MUNDO."] },
    7: { boss: { id: "arcanine", lvl: 56, corrupt: true }, kind: "bugado",
         intro: ["UM ARCANINE FEITO DE FOGO E DE ERRO.",
                 "CADA PASSO DELE APAGA UM PEDAÇO DO CHÃO.",
                 "VISOR-G.L.I.T.C.H.: DADO INSTÁVEL. ESTE NÃO PODE VER A SI MESMO."],
         win: ["O FOGO APAGA. O CHÃO NÃO VOLTA."] },
    8: { boss: { id: "dragonite", lvl: 62, corrupt: true }, kind: "bugado",
         intro: ["O ÚLTIMO GUARDIÃO DA FENDA: UM DRAGONITE CORROMPIDO.",
                 "ATRÁS DELE DÁ PRA VER UMA SILHUETA ENORME, PARADA, ESPERANDO.",
                 "VISOR-G.L.I.T.C.H.: DADO INSTÁVEL. ESTE NÃO PODE VER A SI MESMO."],
         win: ["O GUARDIÃO CAI. A SILHUETA ATRÁS DELE DÁ UM PASSO À FRENTE.",
               "PROF. CARVALHO: SAIA DAÍ. AGORA!"] },
  },

  /** entrada e saída da dimensão */
  dimension: {
    name: "011GLITCHDIMENSION110",
    // também muda a cada insígnia: ele explica a máquina uma vez só
    enter: {
      1: [
        "PROF. CARVALHO: A FENDA ESTÁ ABERTA BEM AQUI, NO MEIO DO LABORATÓRIO.",
        "EU CONSIGO TE MANDAR PRA DENTRO E TE TRAZER DE VOLTA. UMA VEZ SÓ.",
        "DERROTE — OU CAPTURE — O QUE ESTIVER LÁ E EU PUXO VOCÊ NA HORA.",
        "AQUELA MÁQUINA DE CÚPULA VERMELHA, NA PAREDE. APERTE O BOTÃO QUANDO ESTIVER PRONTO.",
      ],
      2: [
        "A FENDA ABRIU DE NOVO, NO MESMO CANTO DA SALA.",
        "VOCÊ JÁ SABE ONDE FICA O BOTÃO. EU SEGURO A PORTA DESTE LADO.",
      ],
      3: [
        "A MÁQUINA LIGOU SOZINHA HOJE DE MANHÃ. ELA ESTAVA TE ESPERANDO.",
        "APERTE O BOTÃO QUANDO ESTIVER PRONTO — E SÓ QUANDO ESTIVER.",
      ],
      4: [
        "DESSA VEZ A FENDA ESTÁ MAIOR. EU MEDI: DOBROU DESDE A ÚLTIMA.",
        "ENTRE, RESOLVA E VOLTE. NÃO FIQUE OLHANDO O CHÃO LÁ DENTRO.",
      ],
      5: [
        "O BOTÃO ESTÁ QUENTE. EU NÃO ENCOSTO NELE DESDE TERÇA.",
        "SE EU PERDER O SINAL, EU PUXO VOCÊ DE QUALQUER JEITO. PODE DOER.",
      ],
      6: [
        "A MÁQUINA NÃO PRECISA MAIS DE MIM PRA ABRIR. ELA SÓ ME AVISA.",
        "VÁ AGORA, MEU JOVEM, ENQUANTO A PASSAGEM AINDA TEM BORDA.",
      ],
      7: [
        "É A ÚLTIMA VEZ QUE EU CONSIGO TE MANDAR E TE TRAZER.",
        "O QUE ESTIVER LÁ DENTRO É O GUARDIÃO. DEPOIS DELE NÃO TEM MAIS PORTA.",
        "APERTE O BOTÃO. E VOLTE, {NOME}.",
      ],
    },
    ask: "ENTRAR NA 011GLITCHDIMENSION110?",
    arrived: "O CHÃO NÃO TEM TEXTURA. O CÉU É A MESMA COISA REPETIDA.",
    exit: "PROF. CARVALHO PUXA VOCÊ DE VOLTA PRO LABORATÓRIO.",
    refuse: "TUDO BEM. A MÁQUINA FICA AQUI QUANDO VOCÊ ESTIVER PRONTO.",
    fragmentFound: "UM PEDAÇO DE TELA SOLTO, PISCANDO NO AR. DÁ PRA ENFIAR A MÃO DENTRO.",
    fragmentAsk: "ATRAVESSAR O FRAGMENTO DE PORTAL?",
    fragmentIn: "VOCÊ ATRAVESSA. O FRAGMENTO SE FECHA ATRÁS DE VOCÊ.\nELE NÃO VAI DURAR MUITO.",
    expiring: "O CHÃO COMEÇA A VOLTAR A SER CHÃO. A FENDA ESTÁ SE FECHANDO!",
    expired: "A DIMENSÃO SE DESFAZ E O MUNDO NORMAL VOLTA POR CIMA DELA.",
    freeAsk: "A MÁQUINA JÁ CONHECE O CAMINHO. ENTRAR NA 011GLITCHDIMENSION110?",
    arrivedFree: "VOCÊ ESTÁ DE VOLTA À DIMENSÃO. O BLOCO PISCANDO ATRÁS DE VOCÊ É A SAÍDA.",
    machineIdle: "UMA MÁQUINA ALTA COM UMA CÚPULA VERMELHA NO TOPO E UM BOTÃO ENORME. ESTÁ DESLIGADA.",
    machineOff: "A MÁQUINA ESTÁ MORTA. A FENDA NÃO ESTÁ MAIS AQUI DENTRO — ESTÁ EM TODO LUGAR.",
    caught: "A POKÉ BOLA PARA. O DADO AGORA TEM UM LUGAR PRA EXISTIR.",
    lootFound: "UMA POKÉ BOLA FECHADA, LARGADA NO CHÃO. ELA ABRE SOZINHA.",
    lootRare: "ISSO NÃO EXISTE EM KANTO. VEIO DE ONDE A FENDA VEIO.",
    lootGone: "AS BOLAS QUE SOBRARAM SE DESFAZEM JUNTO COM O CHÃO.",
  },

  /** Desafio de treinador: ele chama, mas quem decide é você.
   *  Recusar não some com ele — dá pra voltar e aceitar depois. */
  trainer: {
    ask: "{NOME} QUER BATALHAR. ACEITAR?",
    gymAsk: "{NOME} ESTÁ ESPERANDO NO FUNDO DO GINÁSIO. ENCARAR?",
    yes: "LUTAR",
    no: "AGORA NÃO",
    refuse: "VOCÊ DIZ QUE AINDA NÃO. ELE CONTINUA ESPERANDO NO MESMO LUGAR.",
    gymRefuse: "A PORTA DO GINÁSIO CONTINUA ABERTA PRA QUANDO VOCÊ ESTIVER PRONTO.",
    again: "DE VOLTA? ENTÃO É AGORA.",
  },

  /** 011GIVEGLITCH110: o programa que apareceu sozinho no PC do professor.
   *  É por ele que dá pra puxar qualquer Pokémon do jogo pra dentro do save. */
  giveglitch: {
    name: "011GIVEGLITCH110",
    first: [
      "O COMPUTADOR DO PROF. CARVALHO ESTÁ LIGADO.",
      "TEM UM PROGRAMA ABERTO QUE NÃO É DELE: 011GIVEGLITCH110.",
      "A LISTA MOSTRA TODOS OS POKÉMON DO JOGO — ATÉ OS QUE NÃO EXISTEM AQUI.",
      "DO LADO DE CADA UM, UM BOTÃO: BAIXAR.",
    ],
    again: ["011GIVEGLITCH110 AINDA ESTÁ ABERTO NO COMPUTADOR."],
    got: "{NOME} NV{NIVEL} FOI BAIXADO PRO SEU TIME.",
    gotBox: "{NOME} NV{NIVEL} FOI BAIXADO PRO SEU BOX (O TIME ESTÁ CHEIO).",
    hint: "CIMA/BAIXO ESCOLHE  LADOS NÍVEL  SHIFT +10  Z BAIXA  X SAI",
  },

  /** SRTA. JOY: cura e mexe nos golpes da equipe */
  joy: {
    menu: "O QUE VOCÊ PRECISA?",
    curar: "PRONTINHO! SEUS POKÉMON ESTÃO CURADOS.",
    quemMon: "QUAL POKÉMON VAI MUDAR DE GOLPE?",
    semGolpe: "{MON} NÃO TEM NENHUM GOLPE NOVO PRA APRENDER AGORA.",
    qualGolpe: "QUAL GOLPE {MON} VAI APRENDER?",
    qualSlot: "TROCAR QUAL GOLPE DE {MON}?",
    aprendeu: "{MON} APRENDEU {NOVO}!",
    trocou: "{MON} ESQUECEU {VELHO} E APRENDEU {NOVO}!",
    tchau: "VOLTE SEMPRE!",
  },

  /** A velha de Viridian, o BILHETE AURORA e a ilha do outro lado do mar. */
  aurora: {
    item: "bilhete aurora",
    velha: [
      "VOCÊ TAMBÉM VÊ AQUELA ILHA NO MAR? NINGUÉM MAIS VÊ.",
      "MEU MARIDO ERA MARINHEIRO. ELE VOLTOU DE LÁ FALANDO DE UMA PEDRA EM FORMA DE TRIÂNGULO.",
      "GUARDEI ESTE BILHETE A VIDA INTEIRA ESPERANDO ALGUÉM QUE ACREDITASSE.",
    ],
    entrega: "A VELHA TE ENTREGA O BILHETE AURORA!",
    depois: [
      "O BILHETE NÃO ROMPE E NÃO MOLHA. JÁ TENTEI OS DOIS.",
      "DOBRE ELE. VOCÊ VAI ENTENDER.",
    ],
  },

  /** Texto que vale pra qualquer bilhete: todos viram avião de papel. */
  bilhete: {
    dobrando: [
      "VOCÊ DOBRA O BILHETE AO MEIO. DEPOIS DE NOVO. DEPOIS MAIS UMA VEZ.",
      "O PAPEL VAI FICANDO LEVE DEMAIS PRA COISA DO TAMANHO DELE.",
      "NA ÚLTIMA DOBRA ELE VIRA UM AVIÃO DE PAPEL — E CRESCE.",
    ],
    subir: "SUBIR NO AVIÃO DE PAPEL?",
    voando: "O AVIÃO SOBE SOZINHO E ATRAVESSA O MAR EM LINHA RETA.",
    voandoKanto: "O AVIÃO SOBE ACIMA DAS NUVENS E CORTA KANTO EM LINHA RETA.",
    semDestino: "O AVIÃO SÓ SABE POUSAR EM CIDADE. VOCÊ JÁ ESTÁ NA ÚNICA QUE ELE CONHECE.",
    voltando: "O AVIÃO TE LEVA DE VOLTA PRO CONTINENTE.",
    dentro: "AQUI DENTRO NÃO TEM CÉU PRO AVIÃO SUBIR.",
    surfando: "DA ÁGUA NÃO DÁ PRA LANÇAR O AVIÃO.",
  },

  /** Cada bilhete: pra onde leva e se sobrevive à viagem. */
  bilhetes: {
    "bilhete aurora": {
      destino: "birth_island",
      chaveVolta: "bilheteVolta",
      gasta: false,
      pousando: "ELE POUSA NA AREIA E SE DESDOBRA. O BILHETE ESTÁ INTEIRO NA SUA MÃO.",
      chegou: "BIRTH ISLAND. SÓ AREIA, MAR E UMA PEDRA TRIANGULAR NO MEIO.",
    },
    // O BILHETE VOO não tem destino impresso: o avião leva pra qualquer cidade
    // de Kanto, até as que você nunca pisou, e se desdobra inteiro no pouso.
    "bilhete voo": {
      kanto: true,          // sem destino fixo: a lista abre na hora de subir
      gasta: false,
      pergunta: "VOAR PRA ONDE?",
      pousando: "O AVIÃO POUSA MACIO E SE DESDOBRA. O BILHETE ESTÁ INTEIRO NA SUA MÃO.",
    },
  },

  /** DEOXYS, esperando no monumento */
  deoxys: {
    intro: [
      "A PEDRA TRIANGULAR ESTÁ QUENTE.",
      "O AR NA FRENTE DELA SE DOBRA — E ALGUMA COISA SAI DE DENTRO DA DOBRA.",
      "DEOXYS OLHA PRA VOCÊ. ELE MUDA DE FORMA CONFORME TE LÊ.",
    ],
    ido: "A PEDRA ESTÁ FRIA AGORA. O QUE ESTAVA AQUI FOI EMBORA.",
    // ele não morre: se você derrubar sem capturar, ele volta com outro corpo
    volta: [
      "O AR SE DOBRA DE NOVO, EM OUTRO CANTO DA ILHA.",
      "ELE SE REMONTA COM AS PEÇAS EM ORDEM DIFERENTE.",
    ],
    formas: {
      deoxys: "A MESMA FORMA DE ANTES. ELE ESTÁ TE ESTUDANDO.",
      deoxysataque: "OS BRAÇOS VIRARAM LÂMINAS. ELE NÃO PRETENDE SE DEFENDER.",
      deoxysdefesa: "O CORPO ENGROSSOU E FECHOU. AGORA ELE É UMA PAREDE.",
      deoxysvelocidade: "O CORPO AFINOU. VOCÊ MAL CONSEGUE SEGUIR ELE COM OS OLHOS.",
    },
  },

  /** presente da mãe, na primeira vez que você sai de casa */
  momGift: {
    item: "doce raro", qty: 12,
    lines: [
      "MAMÃE: ESPERA, QUERIDO! VOCÊ IA SAIR SEM ISSO?",
      "EU GUARDEI DESDE QUE VOCÊ ERA PEQUENO, PRA QUANDO CHEGASSE A HORA.",
      "SÃO 12 DOCES RAROS. CADA UM FAZ UM POKÉMON CRESCER NA HORA.",
      "NÃO GASTE TUDO DE UMA VEZ. E VOLTE PRA JANTAR ALGUM DIA!",
    ],
    got: "VOCÊ RECEBEU 12 DOCES RAROS!",
  },

  /** GINÁSIO DE VERMILION: o painel de manutenção na parede troca o desafio das
   *  lixeiras por um quebra-cabeça de ligar a corrente até a barreira. */
  fios: {
    tela: "PAINEL DA BARREIRA",
    painel: [
      "UM PAINEL DE MANUTENÇÃO ABERTO NA PAREDE, DO LADO DO GERADOR.",
      "DENTRO DELE OS FIOS DA BARREIRA ESTÃO TODOS SOLTOS E FORA DE LUGAR.",
      "UMA ETIQUETA COLADA: \"BARREIRA — NÃO MEXER SEM AUTORIZAÇÃO\".",
    ],
    ask: "MEXER NOS FIOS?",
    dica: "LIGUE O GERADOR ATÉ A BARREIRA",
    ajuda: "Z GIRA O FIO   X FECHA O PAINEL",
    desistiu: "VOCÊ FECHA O PAINEL DO JEITO QUE ESTAVA.",
    ok: [
      "A CORRENTE ATRAVESSA OS FIOS DE UMA PONTA À OUTRA.",
      "A BARREIRA ELÉTRICA PISCA DUAS VEZES E ABRE NO MEIO.",
      "O CAMINHO ATÉ O TENENTE SURGE ESTÁ LIVRE.",
    ],
    jaAberto: "O PAINEL ESTÁ FECHADO E A BARREIRA, DESLIGADA. O CAMINHO ESTÁ LIVRE.",
  },

  /** O canteiro de flores da VILA PALETA depois que o mundo bugou: é ali que
   *  MISSINGNO. encosta com mais força (ver `flores` em src/data/maps.js). */
  flores: {
    primeira: [
      "AS FLORES DO CANTEIRO ESTÃO PISCANDO ENTRE DUAS CORES.",
      "DE FRENTE ELAS SÃO SÓ FLORES. DE CANTO DE OLHO, SÃO OUTRA COISA.",
      "TEM ALGUMA COISA SE MEXENDO AQUI DENTRO. ANDE POR CIMA DELAS.",
    ],
    encontrou: "AS FLORES SE DESFAZEM EM BLOCOS E ALGUMA COISA SOBE DE DENTRO DELAS!",
  },

  /** As máquinas de pergunta do GINÁSIO DE CINNABAR: cada porta trancada tem
   *  uma, e a resposta certa destrava a porta daquela sala (ver maps.js). */
  quiz: {
    maquina: "UMA MÁQUINA DE PERGUNTAS COM A VOZ GRAVADA DO BLAINE.",
    intro: "BLAINE (GRAVADO): ACERTE E A PORTA ABRE. ERRE E TENTE DE NOVO.",
    certo: [
      "BLAINE (GRAVADO): CORRETO!",
      "A TRAVA SOLTA COM UM ESTALO E A PORTA DESLIZA PRA DENTRO DA PAREDE.",
    ],
    errado: [
      "BLAINE (GRAVADO): ERRADO!",
      "A PORTA CONTINUA TRANCADA. A MÁQUINA ESPERA VOCÊ TENTAR DE NOVO.",
    ],
    aberta: "A PORTA DESTA SALA JÁ ESTÁ ABERTA.",
  },

  /** ordem das insígnias de Kanto */
  badges: [
    { id: "pedra", name: "INSÍGNIA PEDRA", city: "PEWTER" },
    { id: "cascata", name: "INSÍGNIA CASCATA", city: "CERULEAN" },
    { id: "trovao", name: "INSÍGNIA TROVÃO", city: "VERMILION" },
    { id: "arcoiris", name: "INSÍGNIA ARCO-ÍRIS", city: "CELADON" },
    { id: "alma", name: "INSÍGNIA ALMA", city: "FUCHSIA" },
    { id: "pantano", name: "INSÍGNIA PÂNTANO", city: "SAFFRON" },
    { id: "vulcao", name: "INSÍGNIA VULCÃO", city: "CINNABAR" },
    { id: "terra", name: "INSÍGNIA TERRA", city: "VIRIDIAN" },
  ],
};
