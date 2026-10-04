// O FUNDO DA TELA DE TÍTULO (desde o VOL. 6): duas evoluções sorteadas
// acontecendo ao mesmo tempo, uma em cada metade da tela — e é a CUTSCENE DE
// VERDADE (src/scenes/evolution.js): o DNA girando, o bicho rachando de luz,
// os pixels voando, os raios, o BUUM e os fogos.
//
// Cada uma roda no MODO FUNDO da cena (`fundo: true`): muda, sem caixa de
// texto, sem evoluir bicho nenhum e sempre RETA — o isométrico não entra no
// fundo do título. Ela desenha num canvas do tamanho da tela, e daqui sai só
// o miolo (a faixa do meio, onde o bicho está) pra cada metade. Quando uma
// termina, outra sorteada entra no lugar; a da direita começa atrasada, pra
// as duas não estourarem juntas.
import { DB } from "../data/index.js";
import { Assets, makeCanvas } from "../core/assets.js";
import { EvolutionScene } from "./evolution.js";

const W = 240, H = 160;
const MIOLO = 120;                 // a largura da faixa do meio que vai pra cada metade
const ATRASO_DIREITA = 5;          // segundos até a da direita começar

/** todas as evoluções com as duas espécies de pé (fusão não entra) */
function todasAsEvolucoes() {
  const out = [];
  for (const [de, regras] of Object.entries(DB.EVOLUTIONS || {})) {
    for (const r of regras || []) {
      if (DB.SPECIES[de] && DB.SPECIES[r.to] && !DB.SPECIES[de].fusao && !DB.SPECIES[r.to].fusao) out.push([de, r.to]);
    }
  }
  return out;
}

export class FundoDeEvolucoes {
  constructor() {
    this.lista = todasAsEvolucoes();
    this.lados = [0, 1].map((i) => {
      const { cv, ctx } = makeCanvas(W, H);
      ctx.imageSmoothingEnabled = false;
      return { cv, ctx, x: i * MIOLO, espera: i ? ATRASO_DIREITA : 0, cena: null, proxima: this.sortear() };
    });
  }

  /** sorteia a próxima e já pede os dois desenhos: quando chegar a vez, a arte chegou */
  sortear() {
    if (!this.lista.length) return null;
    const [de, para] = this.lista[Math.floor(Math.random() * this.lista.length)];
    Assets.mon(de, 1);
    Assets.mon(para, 1);
    return { de, para };
  }

  comecar(l) {
    const e = l.proxima;
    l.proxima = this.sortear();
    if (!e) return;
    const cena = new EvolutionScene();
    const mon = { species: e.de, seed: 1, nickname: DB.SPECIES[e.de].name };
    cena.enter({ mon, to: e.para, fundo: true });
    l.cena = cena;
  }

  update(dt) {
    for (const l of this.lados) {
      if (l.espera > 0) { l.espera -= dt; continue; }
      if (!l.cena || l.cena.terminou) this.comecar(l);
      l.cena?.update(dt);
    }
  }

  render(ctx) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
    for (const l of this.lados) {
      if (!l.cena) continue;
      l.ctx.setTransform(1, 0, 0, 1, 0, 0);
      l.ctx.clearRect(0, 0, W, H);
      l.cena.render(l.ctx);
      // o miolo da cena (onde o bicho está) vai pra metade dela
      ctx.drawImage(l.cv, (W - MIOLO) / 2, 0, MIOLO, H, l.x, 0, MIOLO, H);
    }
    // a costura entre as duas, e um véu leve pro logo e o menu continuarem lidos
    ctx.fillStyle = "rgba(180,85,255,.5)";
    ctx.fillRect(MIOLO - 1, 0, 2, H);
    ctx.fillStyle = "rgba(10,6,24,.25)";
    ctx.fillRect(0, 0, W, H);
  }
}
