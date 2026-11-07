// QUAL MÚSICA TOCA NA BATALHA. Em Kanto, as do FireRed (src/data/musicas-frlg.js;
// as do Red/Blue, `kantoSelvagem` e as outras três, ficaram de reserva): selvagem, treinador, LÍDER DE GINÁSIO (quem
// dá insígnia) e a FINAL pros chefes e lendários. Em Braglitch, o baião dela
// (src/data/braglitch.js, `batalhaBraglitch`); em Kalos, a de Lumiose. A batalha
// glitch e a da mega descontrolada têm as delas, e quem chama resolve antes.
import { DB } from "../data/index.js";
import { regiaoDoMapa } from "./regionais.js";
import { LENDARIOS } from "../data/leilao.js";

/** O nome da música (uma chave de DB.MUSIC) pra uma batalha `b`: { trainer,
 *  boss, raid } e o mapa onde ela acontece. */
export function musicaDaBatalha(b, mapa) {
  const regiao = regiaoDoMapa(mapa);
  if (regiao === "braglitch" && DB.MUSIC?.batalhaBraglitch) return "batalhaBraglitch";
  if (regiao === "kalos" && DB.MUSIC?.batalhaLumiose) return "batalhaLumiose";
  if (regiao !== "kanto") return "batalha";
  // as do FIRERED (src/data/musicas-frlg.js); as do Red/Blue continuam no DB
  const fr = (k, gb) => (DB.MUSIC?.[k] ? k : gb);
  // os LENDÁRIOS têm as deles no FireRed: o MEWTWO, o DEOXYS e a dos outros
  const quem = b.boss?.id || b.foe?.species || "";
  if (b.boss && /^mewtwo/.test(quem) && DB.MUSIC?.frMewtwo) return "frMewtwo";
  if (b.boss && /^deoxys/.test(quem) && DB.MUSIC?.frDeoxys) return "frDeoxys";
  if (b.boss && LENDARIOS.has(quem) && DB.MUSIC?.frLenda) return "frLenda";
  if (b.boss || b.raid) return fr("frCampeao", "kantoFinal");
  if (b.trainer?.badge || b.trainer?.lider) return fr("frLider", "kantoLider");
  if (b.trainer) return fr("frTreinador", "kantoTreinador");
  return fr("frSelvagem", "kantoSelvagem");
}
