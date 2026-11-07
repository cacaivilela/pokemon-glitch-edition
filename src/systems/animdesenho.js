// AS ANIMAÇÕES DE GOLPE DESENHADAS (o CAIO desenha no dev/animgolpe.html; o
// SALVAR grava dev/captures/anim_<golpe>.png + .log, e eu copio pra
// assets/sprites/animgolpes/<golpe>.png + .json e ponho o nome em lista.json).
// O PNG são os quadros de 240x160 lado a lado; o JSON diz quanto cada um dura e
// os efeitos (treme, clarão, o alvo pisca, quem usou some).
import { url } from "../core/base.js";
import { loadImage } from "../core/sprites.js";

const prontas = new Map();   // golpe -> { img, quadros }

(async () => {
  try {
    const lista = await (await fetch(url("assets/sprites/animgolpes/lista.json"))).json();
    for (const id of lista) {
      const [img, info] = await Promise.all([
        loadImage(url(`assets/sprites/animgolpes/${id}.png`)),
        fetch(url(`assets/sprites/animgolpes/${id}.json`)).then((r) => r.json()).catch(() => null),
      ]);
      if (img && info?.quadros?.length) prontas.set(id, { img, quadros: info.quadros });
    }
  } catch { /* sem lista: os golpes ficam com a animação feita em código */ }
})();

/** a animação desenhada deste golpe, se tem e já carregou */
export const animDesenhada = (id) => prontas.get(id) || null;
