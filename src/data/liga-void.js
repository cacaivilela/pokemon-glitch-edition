// A LIGA DO VOID (pedido do CAIO, nov/2026: "crie a liga do void uma liga que
// tbm se remonta mas se remonta de um jeito bugado"). Escolhas dele: fica NO
// PRETO, depois do SACI.EXE (a INSÍGNIA DO VOID abre); a sala se remonta
// DERRETENDO, pixel por pixel; os quatro e o campeão eu inventei.
//
// No preto à esquerda da MATA DO SACI, mais longe que o Ginásio do Void, tem o
// prédio da LIGA DE KANTO piscando, com a porta aberta. Lá dentro, uma sala
// só. Cada vez que você vence um, a sala DERRETE pra baixo (cada coluna de
// pixel no seu tempo) e a próxima PINGA de cima (src/systems/ligavoid.js).
// O campeão é VOCÊ.EXE: a cópia de você que ficou no preto, com o SEU time.

import { montarGeos } from "./braglitch.js";
import { predioDaPorta } from "./void.js";

export const LIGA_VOID = {
  mapa: "mata_do_saci",
  porta: { x: -26, y: 8 },             // no preto, mais longe que o ginásio (-12); o preto só deixa andar até 30 de fora
  fachada: "indigo_plateau_exterior",  // o prédio que aparece no preto é o da Liga de Kanto
  portaFachada: "indigo_plateau_pokemon_center_1f",
  meiaLargura: 9,
  sala: "void_liga_sala",
  chegada: { x: 7, y: 11, dir: "up" },
  requer: "insignia_void",
  fechada: ["A PORTA ESTÁ ABERTA, MAS LÁ DENTRO É SÓ PRETO.", "(PARECE QUE SÓ QUEM TEM A INSÍGNIA DO VOID CONSEGUE VER A SALA.)"],
  // os QUATRO DO VOID e o CAMPEÃO (o tema é o desenho da sala na vez dele)
  membros: [
    { nome: "NULO 0x00", sprite: "maniaco", tema: "nulo",
      time: [["missingno", 62], ["porygonhack", 63], ["porygon2hack", 63], ["missingnodomo", 64], ["porygonzhack", 65], ["missingnoambar", 66]],
      fala: ["0x00. 0x00. 0x00.", "EU SOU O QUE SOBRA QUANDO O JOGO APAGA UMA COISA. EU SOU O ZERO QUE FICOU."],
      perdeu: ["...0x01. VOCÊ CONTOU UM. A SALA VAI DERRETER AGORA. NÃO OLHA PRO CHÃO."] },
    { nome: "ERRO 404", sprite: "tecnica", tema: "erro",
      time: [["gengarhack", 63], ["spiritomb", 64], ["sableye", 64], ["mimikyu", 65], ["missingnofantasma", 65], ["decamark", 67]],
      fala: ["PÁGINA NÃO ENCONTRADA. POKÉMON NÃO ENCONTRADO. VOCÊ NÃO DEVIA SER ENCONTRADO.", "MAS AQUI ESTÁ VOCÊ. ENTÃO VAMOS VER O QUE FALTA EM VOCÊ."],
      perdeu: ["ERRO: DERROTA. ESSE ARQUIVO EU NÃO TINHA.", "A PRÓXIMA SALA JÁ ESTÁ PINGANDO DO TETO."] },
    { nome: "BUG.SPRITE", sprite: "cacador", tema: "bug",
      time: [["shedinja", 64], ["genesect", 65], ["golisopod", 65], ["scizor", 66], ["pheromosa", 66], ["mewhack", 68]],
      fala: ["CADA POKÉMON MEU TEM UM PIXEL NO LUGAR ERRADO. EU QUE BOTEI.", "QUER VER O QUE ACONTECE QUANDO O SPRITE NÃO CARREGA DIREITO?"],
      perdeu: ["...O SEU CARREGOU. QUE INVEJA.", "ELA ESTÁ ESPERANDO. A CORROMPIDA NÃO PERDOA NADA."] },
    { nome: "CORROMPIDA", sprite: "superf", tema: "corrompida",
      time: [["mewtwohack", 66], ["megam155ingno", 66], ["regiglitch", 67], ["rhyperiorhack", 67], ["alakazamhack", 68], ["mewthree", 70]],
      fala: ["EU ERA UMA TREINADORA COMUM. AÍ O MEU SAVE CORROMPEU.", "AGORA EU SOU METADE GENTE, METADE ARQUIVO. E A METADE ARQUIVO ESTÁ COM RAIVA."],
      perdeu: ["SALVANDO... NÃO DESLIGUE O CONSOLE...", "...O CAMPEÃO É VOCÊ. QUER DIZER: É UM VOCÊ. VAI LÁ VER."] },
  ],
  campeao: { nome: "{NOME}.EXE", sprite: "hero", tema: "espelho", acima: 3,
    fala: ["...", "OI. EU SOU VOCÊ. O VOCÊ QUE ESBARROU NA PAREDE E FICOU DO LADO DE CÁ.", "EU TENHO O SEU TIME. SÓ QUE UM POUCO MAIS FORTE. E UM POUCO MAIS ERRADO."],
    perdeu: ["...ENTÃO VOCÊ É O DE VERDADE.", "LEVA ISSO. VOCÊ É O CAMPEÃO DO VOID.", "E QUANDO ALGUÉM PERGUNTAR ONDE FICA ESTA LIGA... FALA QUE NÃO EXISTE."] },
  troca: "A SALA ESTÁ DERRETENDO! AGORA É {QUEM}.",
  venceu: ["VOCÊ É O CAMPEÃO DO VOID!", "(UMA INSÍGNIA PRETA APARECEU NO SEU BOLSO. ELA NÃO TEM DESENHO NENHUM.)"],
  premio: { dinheiro: 30000, item: "master ball", qtd: 1 },
};

const SALA = [
  "###############",
  "###############",
  "#.............#",
  "#.............#",
  "#.............#",
  "#.............#",
  "#.............#",
  "#.............#",
  "#.............#",
  "#.............#",
  "#.............#",
  "#.............#",
  "#######U#######",
];

/** a geometria da sala (o mesmo construtor de Braglitch, tema "ligavoid") */
export function montarSalaVoid(kanto) {
  return montarGeos(kanto, { plantas: { [LIGA_VOID.sala]: SALA }, interiores: {}, temas: { [LIGA_VOID.sala]: "ligavoid" },
                             cidadePadrao: LIGA_VOID.sala, marca: {} });
}

/** O conteúdo da sala (formato de src/data/maps.js): o da vez aparece (`mostrar`) */
export const CONTEUDO_LIGA_VOID = {
  [LIGA_VOID.sala]: {
    name: "LIGA DO VOID", music: "gym", interior: true, encounters: [], ligaVoid: true,
    spawn: { ...LIGA_VOID.chegada },
    npcs: [
      ...LIGA_VOID.membros.map((m, i) => ({
        id: `void_membro${i}`, x: 7, y: 3, dir: "down", sprite: m.sprite,
        mostrar: (st) => !!st.flags?.[LIGA_VOID.requer] && (st.flags?.ligaVoidEtapa || 0) === i && !st.flags?.ligaVoidTrocando,
        lines: m.fala, afterLines: m.perdeu,
        trainer: { name: m.nome, prize: 7000 + i * 1500, sight: 0, etapaLigaVoid: i, lider: true, party: m.time.map(([id, lvl]) => ({ id, lvl })) },
      })),
      { id: "void_campeao", x: 7, y: 3, dir: "down", sprite: LIGA_VOID.campeao.sprite, ligaVoidCampeao: true,
        mostrar: (st) => !!st.flags?.[LIGA_VOID.requer] && (st.flags?.ligaVoidEtapa || 0) === LIGA_VOID.membros.length && !st.flags?.ligaVoidTrocando && !st.flags?.campeaoVoid,
        lines: LIGA_VOID.campeao.fala, afterLines: LIGA_VOID.campeao.perdeu,
        trainer: { name: LIGA_VOID.campeao.nome, prize: 20000, sight: 0, etapaLigaVoid: LIGA_VOID.membros.length, lider: true, espelho: LIGA_VOID.campeao.acima, party: [] } },
      // quem não tem a insígnia vê só o preto
      { id: "void_porteiro", x: 7, y: 9, dir: "down", sprite: "gentleman", lines: LIGA_VOID.fechada,
        mostrar: (st) => !st.flags?.[LIGA_VOID.requer] },
    ],
  },
};

/** O PRÉDIO NO PRETO: a porta na MATA DO SACI (geometria de Braglitch já
 *  montada) e a saída da sala apontando de volta. Chamado no src/data/index.js. */
export function ligarLigaVoid(kanto, geosBrag, sala) {
  const L = LIGA_VOID, mata = geosBrag?.[L.mapa], fora = kanto?.[L.fachada], g = sala?.[L.sala];
  if (!mata || !fora || !g) return;
  const portaLa = (fora.warps || []).find((w) => w.to === L.portaFachada);
  const saida = (g.warps || []).findIndex((w) => w.predio === "U");
  if (!portaLa || saida < 0) return;
  mata.warps = [...(mata.warps || []), { x: L.porta.x, y: L.porta.y, to: L.sala, toWarp: saida }];
  const volta = mata.warps.length - 1;
  mata.vazio = [...(mata.vazio || []), { x: L.porta.x, y: L.porta.y, de: L.fachada, ...predioDaPorta(fora, portaLa, L.meiaLargura) }];
  g.warps[saida] = { ...g.warps[saida], to: L.mapa, toWarp: volta };
}
