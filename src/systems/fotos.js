// A CÂMERA DO ROTOMFONE (pedido do CAIO, nov/2026: "a câmera que você fica com
// todas as fotos feitas com você e um líder, seus rivais/amigos/gêmeo").
// Ganhou de um deles: vocês tiram uma foto juntos, que fica guardada em
// st.fotos. Menu START → CÂMERA (src/scenes/fotos.js) mostra o álbum.
//
// A foto não é imagem gravada: é o que estava lá (quem, onde, quando) e a
// cena monta na hora — o retrato de batalha dos dois na frente do lugar.
import { DB } from "../data/index.js";
import { folhaDoJogador } from "./pokesave.js";
import { LENDARIOS } from "../data/leilao.js";

const MAX = 300;
const MAX_WEBCAM = 40;
// quem tira foto com você (o retrato de batalha, assets/sprites/trainers/)
const AMIGOS = new Set(["rival", "azulcampeao", "vitor", "andre", "hero_brag", "heroina_brag", "hero", "heroina",
  // e os da LIGA (src/data/liga-kanto.js) e o GIOVANNI
  "lorelei", "bruno", "agatha", "lance", "giovanni"]);

export const fotos = (st) => (st.fotos ||= []);

/** guarda uma foto: `retrato` de quem está com você, `nome`, e opcional `mon`
 *  (um Pokémon junto na foto, como o RATICATE do AZUL) */
export function tirarFoto(st, { retrato = null, nome = null, mon = null, ator = null, tipo = null, time = null, img = null, boneco = null, foto = null }) {
  const p = st.player || {};
  fotos(st).push({
    retrato, nome, mon, ator, tipo, time,
    ...(img ? { img } : {}),         // FOTO DE VERDADE antiga: a imagem pixelada da webcam
    ...(boneco ? { boneco } : {}),   // o BONEQUINHO (src/systems/boneco.js): as cores de cada parte
    ...(foto ? { foto } : {}),       // FOTO DE VERDADE: a foto normal da webcam com o Pokémon (JPEG)
    eu: folhaDoJogador(st),
    mapa: p.map, x: p.x, y: p.y,
    lugar: DB.MAPS?.[p.map]?.name || "",
    data: Date.now(),
  });
  if (st.fotos.length > MAX) st.fotos.splice(0, st.fotos.length - MAX);
  // a foto da webcam é pesada (~50 KB): o álbum guarda só as MAX_WEBCAM mais novas
  const comFoto = st.fotos.filter((f) => f.foto);
  if (comFoto.length > MAX_WEBCAM) { const fora = new Set(comFoto.slice(0, comFoto.length - MAX_WEBCAM)); st.fotos = st.fotos.filter((f) => !fora.has(f)); }
  return st.fotos[st.fotos.length - 1];
}

/** ganhou a luta: é alguém que vale foto? (líder, rival, amigo, gêmeo) */
export function fotoDaLuta(st, trainer) {
  if (!trainer) return null;
  const s = trainer.sprite;
  const lider = trainer.badge || trainer.bragBadge || trainer.lider || /^(LÍDER|ELITE|CAMPE)/.test(trainer.name || "");
  if (!lider && !AMIGOS.has(s)) return null;
  if (!s) return null;
  const nome = String(trainer.name || "").replace(/^(LÍDER|ELITE 4|CAMPEÃO|CAMPEÃ) /, "");
  // A FOTO DO CAMPEÃO (pedido do CAIO): VOCÊ no lugar onde o campeão fica, e o
  // campeão de antes indo embora, de costas, com os Pokémon dele atrás
  if (trainer.ligaKanto && /^CAMPE/.test(trainer.name || "")) {
    return tirarFoto(st, { tipo: "campeao", retrato: "rival", nome, time: (trainer.party || []).map((p) => p.id) });
  }
  return tirarFoto(st, { retrato: s, nome });
}

/** pegou um LENDÁRIO ou um SHINY: foto com ele (o álbum guarda os grandes momentos) */
export function fotoDaCaptura(st, mon) {
  if (!mon) return null;
  const sp = DB.SPECIES[mon.species];
  if (!(LENDARIOS.has(mon.species) || sp?.lendario || mon.shiny || mon.luminoso)) return null;
  return tirarFoto(st, { mon: mon.species, nome: mon.nickname || sp?.name });
}

/** evoluiu / nasceu: foto com ele, sem aviso (aparece no álbum) */
export function fotoDoMon(st, mon) {
  if (!mon || !st) return null;
  return tirarFoto(st, { mon: mon.species, nome: mon.nickname || DB.SPECIES[mon.species]?.name });
}

export const FOTO_TEXTO = {
  luta: "[foto]VOCÊS TIRARAM UMA FOTO JUNTOS! ELA FICOU NA CÂMERA DO ROTOMFONE.",
  campeao: "[foto]A FOTO DO NOVO CAMPEÃO! ...LÁ ATRÁS, {RIVAL} JÁ ESTÁ INDO EMBORA COM OS POKÉMON DELE.",
  captura: "[foto]QUE MOMENTO! VOCÊ TIROU UMA FOTO COM {MON}!",
  selfie: "[foto]*CLIQUE* FOTO SALVA NO ÁLBUM!",
  oQue: "CÂMERA:",
  opcoes: ["TIRAR FOTO", "FOTO DE VERDADE", "ÁLBUM", "SAIR"],
  vazio: ["NENHUMA FOTO AINDA.", "TIRE UMA NO MAPA, OU GANHE DE", "UM LÍDER, DO RIVAL OU DOS AMIGOS!"],
  titulo: "CÂMERA",
};
