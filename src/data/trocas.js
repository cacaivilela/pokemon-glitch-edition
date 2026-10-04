// AS TROCAS COM NPC: gente pelo mundo que troca um Pokémon seu por um dela,
// como as trocas de dentro do jogo do FireRed. Cada troca acontece UMA vez
// (a bandeira `troca_<id>` no save); o bicho que vem tem apelido e o nome de
// quem trocou como treinador original. O motor está em src/scenes/overworld.js
// (`trocarComNpc`).
//
//   pede      a espécie que ele quer (tem que estar na sua equipe)
//   da        o que ele dá: espécie, apelido, shiny; o nível é o do bicho que você deu
//   dono      o nome dele, que fica marcado no bicho (`ot`)
export const TROCAS = [
  {
    // o roqueiro da praça de VIRIDIAN: o RATTATA DE ALOLA dele se chama
    // BEGGIN', por causa da música — o refrão faz "RA-TA-TA-TA", que é o nome
    // do bicho cantado
    id: "beggin", mapa: "viridian", x: 39, y: 22, dir: "left", sprite: "roqueiro",
    pede: "spearow",
    da: { especie: "rattataalola", apelido: "BEGGIN'" },
    dono: "DIEGO",
    falas: {
      oferta: ["E AÍ! EU TÔ ATRÁS DE UM SPEAROW. ELE GRITA IGUALZINHO O VOCALISTA DA MINHA BANDA.",
               "TROCO PELO MEU RATTATA DE ALOLA. O NOME DELE É BEGGIN', QUE NEM A MÚSICA.",
               "SABE O PEDAÇO QUE FAZ RA-TA-TA-TA? É ELE. É O NOME DELE CANTADO."],
      pergunta: "TROCA SEU SPEAROW PELO BEGGIN'?",
      qual: "QUAL SPEAROW VOCÊ VAI MANDAR?",
      semBicho: ["VOCÊ NÃO TEM NENHUM SPEAROW NA EQUIPE.", "TEM UM MONTE NA ROTA 22, LOGO ALI À ESQUERDA. VOLTA QUANDO TIVER!"],
      recusou: ["TRANQUILO. O BEGGIN' FICA AQUI COMIGO, FAZENDO RA-TA-TA-TA."],
      feito: ["VALEU, VALEU! CUIDA BEM DO BEGGIN'.", "TOCA A MÚSICA PRA ELE DE VEZ EM QUANDO. NO RA-TA-TA-TA ELE ACHA QUE É PRA ELE."],
      depois: ["O SPEAROW JÁ APRENDEU O REFRÃO INTEIRO.", "E O BEGGIN'? AINDA DANÇA NO RA-TA-TA-TA?"],
    },
  },
  {
    // a criança de LAVENDER: achou um DRIFLOON perto da TORRE POKÉMON e ele
    // é AMARELO — o shiny dele é amarelo mesmo, não é defeito. Ela tem medo
    // de balão que aparece sozinho e quer um ABRA, que some quando quer
    id: "drifloon", mapa: "lavender_town", x: 20, y: 17, dir: "left", sprite: "menino",
    pede: "abra",
    da: { especie: "drifloon", shiny: true },
    dono: "TIAGUINHO",
    falas: {
      oferta: ["ESSE BALÃO AMARELO APARECEU NA JANELA DO MEU QUARTO. TODA NOITE.",
               "DIZEM QUE DRIFLOON É ROXO. O MEU É AMARELO. EU NÃO SEI SE ISSO É BOM OU PIOR.",
               "EU QUERIA UM ABRA. ELE DORME O DIA INTEIRO E, SE ALGUMA COISA ASSUSTAR, ELE SOME."],
      pergunta: "TROCA SEU ABRA PELO MEU DRIFLOON AMARELO?",
      qual: "QUAL ABRA VOCÊ VAI ME DAR?",
      semBicho: ["VOCÊ NÃO TEM NENHUM ABRA AÍ.", "ELES APARECEM NA ROTA 24, PERTO DA PONTE. MAS SOMEM RÁPIDO."],
      recusou: ["TÁ... ENTÃO ELE FICA. ELE TÁ OLHANDO PRA VOCÊ AGORA, SABIA?"],
      feito: ["OBRIGADO! AGORA EU VOU CONSEGUIR DORMIR.", "SE ELE PUXAR SUA MÃO PRA LEVAR VOCÊ PRA ALGUM LUGAR... NÃO DEIXA."],
      depois: ["O ABRA DORMIU A NOITE INTEIRA. EU TAMBÉM!", "O BALÃO AMARELO TÁ COM VOCÊ AINDA?"],
    },
  },
  {
    // o marinheiro do porto de VERMILION: o FARFETCH'D dele anda com um talo
    // de cebolinha em vez de alho-poró, porque foi isso que tinha no navio
    id: "cebolinha", mapa: "vermilion_city", x: 24, y: 17, dir: "down", sprite: "marinheiro",
    pede: "pidgey",
    da: { especie: "farfetchd", apelido: "CEBOLINHA" },
    dono: "SEU JOCA",
    falas: {
      oferta: ["ÔÔ, MARUJO! ESSE FARFETCH'D SUBIU NO MEU NAVIO EM ALGUM PORTO E NÃO DESCEU MAIS.",
               "ELE ANDA COM UM TALO DE CEBOLINHA. ERA O QUE TINHA NA COZINHA. ELE ADOTOU.",
               "EU QUERIA UM PIDGEY PRA LEVAR RECADO PRO PORTO. ELE NÃO SE DISTRAI COM TEMPERO."],
      pergunta: "TROCA UM PIDGEY PELO CEBOLINHA?",
      qual: "QUAL PIDGEY VAI EMBARCAR?",
      semBicho: ["CADÊ O PIDGEY? TEM EM QUALQUER MATO DAQUI ATÉ A ROTA 1.", "VOLTA QUANDO TIVER UM!"],
      recusou: ["TÁ BOM. O CEBOLINHA FICA NO CONVÉS, TEMPERANDO O VENTO."],
      feito: ["BOA VIAGEM PRA VOCÊS DOIS!", "SE ELE PERDER A CEBOLINHA, NÃO DEIXA ELE PEGAR OUTRA NA FEIRA. ELE PEGA SEM PAGAR."],
      depois: ["O PIDGEY JÁ LEVOU TRÊS RECADOS E TROUXE UM PEIXE.", "E O CEBOLINHA? AINDA CHEIRANDO A TEMPERO?"],
    },
  },
  {
    // a menina de CERULEAN: o PSYDUCK dela tem dor de cabeça o tempo todo
    id: "enxaqueca", mapa: "cerulean_city", x: 24, y: 22, dir: "down", sprite: "garota",
    pede: "poliwag",
    da: { especie: "psyduck", apelido: "ENXAQUECA" },
    dono: "LUANA",
    falas: {
      oferta: ["O MEU PSYDUCK SE CHAMA ENXAQUECA. NÃO FUI EU QUE ESCOLHI: ELE VIVE COM A MÃO NA CABEÇA.",
               "EU QUERIA UM POLIWAG. AQUELA ESPIRAL NA BARRIGA ME ACALMA. PRA ELE, ACHO QUE PIORA."],
      pergunta: "TROCA UM POLIWAG PELO ENXAQUECA?",
      qual: "QUAL POLIWAG VOCÊ ME DÁ?",
      semBicho: ["VOCÊ NÃO TEM POLIWAG. ELES MORAM NA ÁGUA: É SÓ JOGAR UMA VARA.", "MAS NÃO OLHA MUITO PRA ESPIRAL. DÁ TONTURA."],
      recusou: ["TUDO BEM... NÃO FALA ALTO PERTO DELE, TÁ?"],
      feito: ["OBRIGADA! FALA BAIXINHO COM ELE, E DEIXA ELE NO ESCURO DE VEZ EM QUANDO.",
              "QUANDO A DOR DE CABEÇA APERTA, ELE SOLTA UNS PODERES ESQUISITOS. É NORMAL."],
      depois: ["O POLIWAG DORME NO MEU COLO. A ESPIRAL RODA QUANDO ELE SONHA.", "O ENXAQUECA MELHOROU?"],
    },
  },
  {
    // o senhor da praça de CELADON: a TANGELA dele parece um miojo, e ele
    // quer um ODDISH pro canteiro de casa
    id: "miojo", mapa: "celadon_city", x: 30, y: 15, dir: "down", sprite: "gentleman",
    pede: "oddish",
    da: { especie: "tangela", apelido: "MIOJO" },
    dono: "SEU ARMANDO",
    falas: {
      oferta: ["BOA TARDE. ESTA TANGELA CHEGOU NA MINHA HORTA ENROLADA NUM PÉ DE CHUCHU.",
               "O MEU NETO CHAMOU ELA DE MIOJO. AGORA ELA SÓ ATENDE POR MIOJO.",
               "EU QUERIA UM ODDISH. ELE FICA QUIETINHO NO CANTEIRO, E NÃO ENROLA NO VARAL."],
      pergunta: "TROCA UM ODDISH PELA MIOJO?",
      qual: "QUAL ODDISH VAI PRO MEU CANTEIRO?",
      semBicho: ["VOCÊ NÃO TEM ODDISH. ELES DORMEM ENTERRADOS NO MATO, E DE NOITE SAEM ANDANDO.", "VOLTE QUANDO ACHAR UM."],
      recusou: ["SEM PROBLEMA. A MIOJO FICA, E EU TIRO ELA DO VARAL TODO DIA."],
      feito: ["MUITO OBRIGADO. CUIDE BEM DA MIOJO.", "ELA FICA PRONTA EM TRÊS MINUTOS. QUER DIZER... ELA SE DESENROLA EM TRÊS MINUTOS."],
      depois: ["O ODDISH JÁ ESCOLHEU O LUGAR DELE NO CANTEIRO.", "E A MIOJO, AINDA SE ENROLANDO EM TUDO?"],
    },
  },
  {
    // a cientista de CINNABAR: numa ilha de vulcão, ela quer um bicho de fogo;
    // o SEEL dela vive gelado e ela chama de PICOLÉ
    id: "picole", mapa: "cinnabar_island", x: 12, y: 5, dir: "down", sprite: "cientista",
    pede: "ponyta",
    da: { especie: "seel", apelido: "PICOLÉ" },
    dono: "DRA. NEVES",
    falas: {
      oferta: ["EU ESTUDO GELO. ME MANDARAM PRA UMA ILHA DE VULCÃO. FAZ SENTIDO PRA ALGUÉM?",
               "ESTE SEEL É O MEU PICOLÉ. ELE ESTÁ DERRETENDO DE CALOR, E EU TAMBÉM.",
               "SE EU TIVESSE UM PONYTA, PELO MENOS EU ESTUDARIA ALGUMA COISA DAQUI."],
      pergunta: "TROCA UM PONYTA PELO PICOLÉ?",
      qual: "QUAL PONYTA VOCÊ ME TRAZ?",
      semBicho: ["VOCÊ NÃO TEM NENHUM PONYTA.", "ELES CORREM PELO CAMINHO DE BICICLETA E PERTO DO VULCÃO. CUIDADO COM A CRINA."],
      recusou: ["ENTÃO O PICOLÉ E EU CONTINUAMOS DERRETENDO JUNTOS."],
      feito: ["OBRIGADA! LEVA O PICOLÉ PRA UM LUGAR FRIO, POR FAVOR.", "E NÃO DEIXA NINGUÉM TENTAR CHUPAR ELE. JÁ TENTARAM."],
      depois: ["O PONYTA ESQUENTA O MEU CAFÉ SÓ DE CHEGAR PERTO. É O MEU OBJETO DE ESTUDO PREFERIDO.", "O PICOLÉ ESTÁ GELADINHO?"],
    },
  },
  {
    // o pescador de SÃO LUCARIO DO SUL (BRAGLITCH): pescou um MAGIKARP
    // DOURADO — shiny — e acha que dá azar; quer uma PIRANHITA de volta
    id: "dourado", mapa: "sao_lucario", x: 15, y: 13, dir: "down", sprite: "pescador",
    pede: "piranhita",
    da: { especie: "magikarp", apelido: "DOURADO", shiny: true },
    dono: "SEU DITO",
    falas: {
      oferta: ["Ô, MOÇO! OLHA O QUE EU PESQUEI: UM MAGIKARP DOURADO. AMARELINHO QUE NEM O PEIXE DO RIO.",
               "O POVO DA VILA DIZ QUE PEIXE DESSA COR DÁ AZAR PRA QUEM PESCOU. E DÁ SORTE PRA QUEM GANHA.",
               "EU TROCO ELE POR UMA PIRANHITA. PIRANHA EU SEI LIDAR."],
      pergunta: "TROCA UMA PIRANHITA PELO DOURADO?",
      qual: "QUAL PIRANHITA VOCÊ ME DÁ?",
      semBicho: ["CADÊ A PIRANHITA? TEM NO MATO ALAGADO DA BR-232 E NA BEIRA DOS RIOS.", "SÓ NÃO BOTA A MÃO NA ÁGUA PRA PEGAR."],
      recusou: ["TÁ CERTO... ELE FICA AQUI NO BALDE. O BALDE JÁ FUROU DUAS VEZES."],
      feito: ["PRONTO! AGORA A SORTE É TUA.", "ELE NÃO FAZ NADA AINDA, SÓ PULA. MAS DIZEM QUE UM DIA ELE VIRA COISA GRANDE. E VERMELHA."],
      depois: ["A PIRANHITA JÁ MORDEU MEU CHINELO DUAS VEZES. TÔ FELIZ.", "E O DOURADO, JÁ PAROU DE SÓ PULAR?"],
    },
  },

  // ------------------------------------------------ AS TROCAS DE BRAGLITCH
  {
    // SALVADITTO tem um DITTO em cada esquina; o da baiana virou ACARAJÉ de
    // tanto ficar perto do tabuleiro
    id: "acaraje", mapa: "salvador", x: 16, y: 10, dir: "down", sprite: "velha",
    pede: "macacoeira",
    da: { especie: "ditto", apelido: "ACARAJÉ" },
    dono: "DONA DADÁ",
    falas: {
      oferta: ["Ô MEU REI! ESSE DITTO PASSOU TANTO TEMPO DO LADO DO MEU TABULEIRO QUE APRENDEU A VIRAR ACARAJÉ.",
               "O PROBLEMA É QUE OS FREGUESES COMPRAM ELE. TODO DIA EU TENHO QUE IR BUSCAR DE VOLTA.",
               "ME DÁ UMA MACACOEIRA? ELA ME AJUDA A ABANAR O FOGO, E NÃO SE DEIXA VENDER."],
      pergunta: "TROCA UMA MACACOEIRA PELO ACARAJÉ?",
      qual: "QUAL MACACOEIRA VOCÊ ME DÁ?",
      semBicho: ["CADÊ A MACACOEIRA, MEU FILHO? TEM NO MATO DA BR-101 NORTE, PULANDO DE GALHO EM GALHO.", "VOLTA COM UMA QUE EU TE ESPERO."],
      recusou: ["TÁ CERTO. O ACARAJÉ FICA. QUENTE OU FRIO?"],
      feito: ["AXÉ! CUIDA BEM DO ACARAJÉ.", "SE ALGUÉM PEDIR ELE COM VATAPÁ E CAMARÃO, FINGE QUE NÃO OUVIU."],
      depois: ["A MACACOEIRA ABANA O FOGO MELHOR QUE EU.", "E O ACARAJÉ? AINDA TÃO TENTANDO COMER ELE?"],
    },
  },
  {
    // RIO DE JANEEVEE: o EEVEE da passista evolui pra tudo, menos pra triste
    id: "carnaval", mapa: "rio", x: 16, y: 16, dir: "down", sprite: "garota",
    pede: "beijaflorzinha",
    da: { especie: "eevee", apelido: "CARNAVAL" },
    dono: "PASSISTA JU",
    falas: {
      oferta: ["ESTE EEVEE NASCEU NA QUADRA DA ESCOLA, NO MEIO DO ENSAIO. O NOME DELE SÓ PODIA SER CARNAVAL.",
               "ELE PODE VIRAR QUALQUER COISA: ÁGUA, FOGO, RAIO... SÓ NÃO VIRA TRISTE.",
               "EU QUERIA UMA BEIJAFLORZINHA PRA ABRIR O DESFILE NA COMISSÃO DE FRENTE."],
      pergunta: "TROCA UMA BEIJAFLORZINHA PELO CARNAVAL?",
      qual: "QUAL BEIJAFLORZINHA VAI DESFILAR?",
      semBicho: ["VOCÊ NÃO TEM NENHUMA BEIJAFLORZINHA.", "TEM NA BR-101 NORTE E NA ESTRADA REAL, ATRÁS DAS FLORES. ELAS NÃO PARAM QUIETAS."],
      recusou: ["TUDO BEM! O CARNAVAL CONTINUA SAMBANDO AQUI COMIGO."],
      feito: ["NOTA DEZ! CUIDA DO CARNAVAL.", "QUANDO ELE OUVIR UM TAMBORIM, ELE VAI SAMBAR. NÃO TEM COMO SEGURAR."],
      depois: ["A BEIJAFLORZINHA VAI ABRIR O DESFILE ESTE ANO!", "E O CARNAVAL, JÁ ESCOLHEU NO QUE VAI EVOLUIR?"],
    },
  },
  {
    // SAMPIKACHU: o PIKACHU do motoboy aprendeu a imitar buzina no trânsito
    id: "buzina", mapa: "sampa", x: 16, y: 9, dir: "down", sprite: "motoqueiro",
    pede: "gatonet",
    da: { especie: "pikachu", apelido: "BUZINA" },
    dono: "MOTOBOY RAFA",
    falas: {
      oferta: ["MANO, ESSE PIKACHU ANDA NA GARUPA COMIGO DESDE FILHOTE. NO CORREDOR DA MARGINAL ELE APRENDEU A IMITAR BUZINA.",
               "AGORA TODO MUNDO ABRE ESPAÇO PRA GENTE. MAS ELE BUZINA ATÉ DORMINDO.",
               "EU QUERIA UM GATONET. ELE PEGA SINAL EM QUALQUER LUGAR, E O APLICATIVO NÃO CAI MAIS."],
      pergunta: "TROCA UM GATONET PELO BUZINA?",
      qual: "QUAL GATONET VAI NA GARUPA?",
      semBicho: ["CADÊ O GATONET, MANO? TEM NA BR-116, PENDURADO NOS FIOS.", "VOLTA LOGO QUE EU TÔ COM ENTREGA ATRASADA."],
      recusou: ["SUAVE. O BUZINA CONTINUA NA GARUPA, BI-BI."],
      feito: ["VALEU, MANO! TOMA CONTA DO BUZINA.", "SE ELE BUZINAR PRA VOCÊ NO MEIO DA NOITE, É SAUDADE DO TRÂNSITO."],
      depois: ["O GATONET PEGA 5G ATÉ NO TÚNEL. MELHOR TROCA DA MINHA VIDA.", "E O BUZINA, AINDA BUZINANDO?"],
    },
  },
  {
    // CARUARU DO MAGMAR: o sanfoneiro tem uma FOGUEIRINHA que esquenta quentão
    id: "quentao", mapa: "caruaru", x: 16, y: 10, dir: "down", sprite: "gentleman",
    pede: "balaozinho",
    da: { especie: "fogueirinha", apelido: "QUENTÃO" },
    dono: "SANFONEIRO LUIZINHO",
    falas: {
      oferta: ["OXENTE! ESSA FOGUEIRINHA ACENDEU NO SÃO JOÃO E NÃO APAGOU MAIS. AQUI O SÃO JOÃO DURA O ANO INTEIRO.",
               "EU CHAMO ELA DE QUENTÃO: É ELA QUE ESQUENTA A BEBIDA DO ARRAIÁ.",
               "MAS EU QUERIA UM BALÃOZINHO. DIZEM QUE É PROIBIDO SOLTAR BALÃO... ELE SE SOLTA SOZINHO."],
      pergunta: "TROCA UM BALÃOZINHO PELA QUENTÃO?",
      qual: "QUAL BALÃOZINHO VAI SUBIR NO ARRAIÁ?",
      semBicho: ["NÃO TEM BALÃOZINHO? TEM NA BR-324, NO CAMINHO DO SERTÃO, BOIANDO NO CALOR.", "VOLTA DEPOIS QUE O FORRÓ TE ESPERA."],
      recusou: ["TÁ BOM, SÔ. A QUENTÃO CONTINUA AQUI, ESQUENTANDO O ARRAIÁ."],
      feito: ["ANARRIÊ! CUIDA BEM DA QUENTÃO.", "NÃO DEIXA ELA PERTO DE PALHA, DE BANDEIRINHA, NEM DE CHAPÉU DE QUADRILHA."],
      depois: ["O BALÃOZINHO SOBE TODA NOITE E VOLTA DE MANHÃ. NINGUÉM PODE FALAR NADA.", "E A QUENTÃO, AINDA ACESA?"],
    },
  },
  {
    // RECIFEEBAS: o menino do frevo e o BOTINHO que dança com a sombrinha
    id: "frevinho", mapa: "recife", x: 16, y: 10, dir: "down", sprite: "menino",
    pede: "caranguejinho",
    da: { especie: "botinho", apelido: "FREVINHO" },
    dono: "BIU",
    falas: {
      oferta: ["OLHA SÓ! O MEU BOTINHO DANÇA FREVO. SE TOCAR A ORQUESTRA, ELE SAI PULANDO DO RIO COM UMA SOMBRINHA.",
               "O NOME DELE É FREVINHO. NO CARNAVAL ELE NÃO DORME.",
               "EU QUERIA UM CARANGUEJINHO, LÁ DO MANGUE. É O BICHO MAIS ARRETADO QUE TEM."],
      pergunta: "TROCA UM CARANGUEJINHO PELO FREVINHO?",
      qual: "QUAL CARANGUEJINHO VEM PRO MANGUE?",
      semBicho: ["VOCÊ NÃO TEM CARANGUEJINHO. TEM NA BR-232, NA BEIRA DA LAMA.", "OLHA ONDE PISA, QUE ELE BELISCA."],
      recusou: ["TÁ, TÁ. O FREVINHO FICA AQUI DANÇANDO COMIGO."],
      feito: ["ARRETADO! CUIDA DO FREVINHO.", "SE ELE PULAR DA ÁGUA DO NADA, É PORQUE TÁ TOCANDO FREVO EM ALGUM LUGAR."],
      depois: ["O CARANGUEJINHO JÁ APRENDEU A ANDAR DE LADO NO RITMO.", "E O FREVINHO, AINDA DANÇANDO?"],
    },
  },
];
