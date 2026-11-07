// OS OUTROS CASOS DO BILL (pedido do CAIO, nov/2026: "faz o bill ter outros
// casos de virar pkmns constrangedores tipo ele virar uma ralts").
// Depois do SNORLAX (e do presente), toda vez que você VOLTA na casa do mar, o
// BILL testou o teleportador de novo e virou outro Pokémon — um de cada vez, na
// ordem desta lista. O jeito de salvar é o mesmo: apertar o botão vermelho do
// SEPARADOR DE CÉLULAS. A cena (overworld, andarCenaBill) é a do Snorlax, com
// este Pokémon no lugar; `cor` é a cor do bolo que passa no tubo, e `entala`
// diz se ele entala na boca do tubo (só os gordinhos).
export const BILL_CASOS = [
  { especie: "ralts", cor: "#e8f0f0", entala: false,
    lines: ["RALTS: AQUI EMBAIXO! NÃO, MAIS EMBAIXO! ISSO, AQUI!",
            "SOU EU, O BILL. FUI TESTAR O TELEPORTADOR DE NOVO E TINHA UMA RALTS NA OUTRA CÁPSULA.",
            "AGORA EU TENHO 40 CENTÍMETROS! QUARENTA!",
            "NÃO ALCANÇO A MESA, NÃO ALCANÇO A PIA, NÃO ALCANÇO NEM A MAÇANETA DA PORTA!",
            "ONTEM EU ME PERDI DENTRO DO MEU PRÓPRIO CHINELO.",
            "O BOTÃO DO SEPARADOR TÁ LÁ EM CIMA NA MESA... APERTA PRA MIM? EU PULO E SÓ CHEGO NO JOELHO DA CADEIRA."],
    afterLines: ["RALTS: (ELE ESTÁ NA PONTA DOS PÉS, ESTICANDO O BRAÇO PRA MESA. NÃO CHEGA NEM PERTO.)"],
    depois: ["BILL: OLHA SÓ! EU VEJO O TOPO DA GELADEIRA DE NOVO! ...TÁ CHEIO DE PÓ AQUI EM CIMA."] },
  // o 2º (pedido do CAIO): ele entrou com um WAILMER, o WAILMER EVOLUIU lá
  // dentro, e o BILL-WAILORD ficou ENTALADO DENTRO DO CANO entre as cápsulas.
  // `noCano`: ele não fica do lado do computador — fica no tubo, estufado.
  { especie: "wailord", cor: "#4870c8", entala: true, noCano: true,
    lines: ["(O CANO ENTRE AS CÁPSULAS ESTÁ ESTUFADO, IGUAL UMA SALSICHA. DE DENTRO, UMA VOZ ABAFADA...)",
            "BILL: SOCORRO! TÔ PRESO! NUNCA ME SENTI TÃO GORDO E ACHATADO!",
            "EU ENTREI NO TELEPORTADOR COM UM WAILMER PEQUENININHO, DESSES DE BOLSO...",
            "...E BEM NO MEIO DA VIAGEM ELE EVOLUIU! AGORA EU SOU UM WAILORD DE 14 METROS!",
            "E ESSE CANO TEM 30 CENTÍMETROS! EU TÔ ENTALADO! NÃO DÁ PRA IR NEM PRA FRENTE NEM PRA TRÁS!",
            "APERTA O BOTÃO VERMELHO DO SEPARADOR! E NÃO ACENDE O FOGÃO, QUE EU TÔ ESPREMIDO EM CIMA DO GÁS!"],
    afterLines: ["BILL (ABAFADO): O BOTÃO! O CANO TÁ FAZENDO \"CREC\"!"],
    depois: ["BILL: SER UM WAILORD ATÉ QUE É LEGAL, MAS...",
             "...ACHO QUE UNS 15 QUILOS DE GORDURA DAQUELE WAILORD FORAM PRA MIM."] },
  { especie: "mrmime", cor: "#f0a0b8", entala: false,
    lines: ["MR. MIME: ...",
            "(ELE FAZ MÍMICA DE UMA PAREDE INVISÍVEL. DEPOIS DE UMA CAIXA INVISÍVEL. ELE ESTÁ PRESO NA CAIXA.)",
            "(AGORA ELE APONTA PRA SI MESMO, FAZ UM ÓCULOS COM OS DEDOS E ESCREVE \"BILL\" NO AR.)",
            "(ELE APONTA PRO COMPUTADOR, FAZ CARA DE CHORO E APERTA UM BOTÃO INVISÍVEL.)"],
    afterLines: ["(MR. MIME APERTA O BOTÃO INVISÍVEL MAIS VINTE VEZES, CADA VEZ MAIS DESESPERADO.)"],
    depois: ["BILL: AAAAH! EU POSSO FALAR! EU FIQUEI TRÊS HORAS PRESO NUMA CAIXA QUE NEM EXISTE!"] },
  { especie: "slowpoke", cor: "#f0a0b0", entala: false,
    lines: ["SLOWPOKE: ...O...I...",
            "...EU...SOU...O...BILL...",
            "...VIREI...UM...SLOWPOKE...HÁ...UMA...SEMANA...",
            "...OU...FOI...ONTEM...?",
            "...APERTA...O...BOTÃO...ANTES...QUE...EU...ESQUEÇA...QUE...EU...SOU...GEN..."],
    afterLines: ["SLOWPOKE: ...ZZZ... OU... NÃO... ESQUECI..."],
    depois: ["BILL: ...NOSSA. O MUNDO TÁ RÁPIDO DEMAIS. ESPERA UM POUCO QUE EU AINDA TÔ NO \"OI\"."] },
  { especie: "magikarp", cor: "#f08040", entala: false,
    lines: ["MAGIKARP: SPLASH! SPLASH! AI! SPLASH!",
            "EU SOU O BILL! VIREI UM MAGIKARP E NÃO CONSIGO PARAR DE PULAR!",
            "JÁ BATI A CABEÇA NO TETO CINCO VEZES! SPLASH!",
            "E EU TÔ SECANDO! APERTA O BOTÃO, OU PELO MENOS ME BOTA NUM BALDE! SPLASH!"],
    afterLines: ["MAGIKARP: SPLASH! O BOTÃO! SPLASH! ANTES QUE EU EVOLUA E DESTRUA A CASA!"],
    depois: ["BILL: TERRA FIRME! NUNCA MAIS VOU COMER PEIXE. ...TALVEZ SÓ NO DOMINGO."] },
  { especie: "jigglypuff", cor: "#f8b8d0", entala: false,
    lines: ["JIGGLYPUFF: JIGGLYYYY~ PUFF~",
            "(ELE ESTÁ TENTANDO FALAR, MAS SÓ SAI MÚSICA. VOCÊ SENTE UM SONINHO...)",
            "JIGGLY... SOU O BILL... PUFF... NÃO DORME! TODO MUNDO QUE VEM ME AJUDAR DORME!",
            "E QUANDO DORMEM EU FICO BRAVO E RABISCO A CARA DELES. NÃO CONSIGO EVITAR!",
            "APERTA O BOTÃO ANTES DO REFRÃO! JIGGLYYY~"],
    afterLines: ["JIGGLYPUFF: (ELE ESTÁ COM UMA CANETA NA MÃO, OLHANDO PRA VOCÊ...)"],
    depois: ["BILL: OBRIGADO! E... DESCULPA PELO BIGODE QUE EU DESENHEI EM VOCÊ ENQUANTO VOCÊ PISCAVA."] },
  { especie: "ditto", cor: "#c0a0e0", entala: false,
    lines: ["DITTO: OI! SOU EU, O BILL! VIREI UM DITTO!",
            "JÁ TENTEI VIRAR EU MESMO DE VOLTA. SAIU UM BILL DE GELATINA, COM O NARIZ NO LUGAR ERRADO.",
            "DEPOIS TENTEI DE NOVO E VIREI O MEU PRÓPRIO COMPUTADOR. FIQUEI DUAS HORAS LIGADO.",
            "APERTA O BOTÃO VERMELHO. O DE VERDADE: O OUTRO SOU EU."],
    afterLines: ["DITTO: ESSE COMPUTADOR É O DE VERDADE! ...ACHO."],
    depois: ["BILL: ESTOU INTEIRO? O NARIZ TÁ NO MEIO? AI, QUE ALÍVIO."] },
  { especie: "luvdisc", cor: "#f87898", entala: false,
    lines: ["LUVDISC: EU SOU O BILL. EU VIREI UM CORAÇÃO. UM CORAÇÃO COM BARBATANA.",
            "OS CASAIS DA ROTA 25 VÊM ME PEGAR PRA DAR DE PRESENTE DE NAMORO!",
            "ONTEM UM GAROTO ME ENTREGOU PRA UMA MENINA DE JOELHOS. ELA DISSE \"NÃO\". EU CHOREI JUNTO.",
            "POR FAVOR, APERTA O BOTÃO. EU NÃO AGUENTO MAIS SER ROMÂNTICO."],
    afterLines: ["LUVDISC: O BOTÃO... E NÃO ME OLHA COM ESSA CARINHA, POR FAVOR."],
    depois: ["BILL: ...EU NUNCA MAIS VOU NO DIA DOS NAMORADOS DA ROTA 25."] },
];

/** quando os casos acabam, o BILL fala isto (ele finalmente aprendeu) */
export const BILL_FIM = ["BILL: TIREI A TOMADA DO TELEPORTADOR. ACABOU. NUNCA MAIS.",
  "...MAS SERÁ QUE SE EU ENTRASSE JUNTO COM UM DRAGONITE EU IA VOAR?"];
