// AS CUTSCENES DOS GOLPES.
//
// Até aqui todo golpe era a mesma coisa na tela: o sprite avançava, a tela
// tremia, o outro piscava. LANÇA-CHAMAS e RABO DE ABANO tinham exatamente a
// mesma cara.
//
// CADA GOLPE TEM A SUA. São 48 golpes no jogo e 48 cenas em `PORGOLPE`: nenhum
// cai na cena de outro. O que a cena conta é o que o NOME promete — ARRANHÃO são
// três riscos, MORDIDA são dois dentes que se fecham, ATAQUE RÁPIDO é um borrão
// que chega antes de você ver, ENCARAR são dois olhos abrindo no escuro.
//
// As tabelas por TIPO (17) e por CATEGORIA (2) continuam aqui embaixo, mas agora
// como REDE: golpe novo, escrito amanhã, já nasce com animação decente em vez de
// nascer sem nada. A ordem de escolha está em `cenaDoGolpe`, no fim do arquivo.
//
// COMO UMA CENA É ESCRITA
// Uma cena é uma função `async (c) => {...}`. O `c` é o palco que a batalha
// monta: onde está quem ataca, onde está quem apanha, e o que dá pra fazer —
// soltar efeito, esperar, tremer, piscar, clarear. A cena NÃO desenha: ela
// solta efeitos (`c.fx`) e o `src/scenes/battle.js` desenha e move todos do
// mesmo jeito. Assim uma cena nova são dez linhas, não um render novo.
//
// Formas que o desenhista entende (o resto do objeto é opcional):
//   { forma: "bola",   x, y, r, cor }            círculo cheio
//   { forma: "quadro", x, y, w, h, cor, ang }    retângulo (gira com `ang`)
//   { forma: "risco",  x, y, w, h, cor, ang }    traço de comprimento w
//   { forma: "anel",   x, y, r, h, cor, cresce }  círculo vazado
//   { forma: "raio",   x, y, x2, y2, h, cor }    zigue-zague de um ponto a outro
//   { forma: "barra",  x, y, w, h, cor }         faixa (o glitch)
// e o movimento: vx, vy (px/s), g (gravidade), vida (segundos), fade, gira.

const rnd = (a, b) => a + Math.random() * (b - a);
const escolha = (lista) => lista[Math.floor(Math.random() * lista.length)];

/** o caminho de quem ataca até quem apanha, já normalizado */
function rumo(c) {
  const dx = c.para.x - c.de.x, dy = c.para.y - c.de.y;
  const d = Math.hypot(dx, dy) || 1;
  return { ux: dx / d, uy: dy / d, d, ang: Math.atan2(dy, dx) };
}

/** N partículas saindo de quem ataca e indo até o alvo, em levas */
async function jato(c, { cores, n = 14, r = [2, 4], vel = 170, espalha = 14, g = 0, levas = 4 }) {
  const { ux, uy, d } = rumo(c);
  const vida = d / vel + 0.12;
  for (let l = 0; l < levas; l++) {
    for (let i = 0; i < Math.ceil(n / levas); i++) {
      const desvio = rnd(-espalha, espalha) / 100;
      c.fx({
        forma: "bola", cor: escolha(cores), r: rnd(r[0], r[1]),
        x: c.de.x + rnd(-4, 4), y: c.de.y + rnd(-6, 6),
        vx: (ux + desvio) * vel, vy: (uy - desvio) * vel, g, vida,
      });
    }
    c.som.tone(520 + l * 60, 0.04, "sawtooth", 0.4);
    await c.wait(0.05);
  }
  await c.wait(vida * 0.5);
}

/** estouro no alvo: bolinhas pra todo lado */
function estouro(c, cores, n = 12, forca = 90) {
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n + rnd(-0.2, 0.2);
    c.fx({
      forma: "bola", cor: escolha(cores), r: rnd(2, 4),
      x: c.para.x, y: c.para.y,
      vx: Math.cos(a) * rnd(forca * 0.4, forca), vy: Math.sin(a) * rnd(forca * 0.4, forca),
      g: 60, vida: rnd(0.25, 0.45),
    });
  }
}

/** coisas caindo do céu em cima do alvo */
async function chuva(c, { cores, n = 10, forma = "bola", r = 3, w = 4, h = 8, vel = 260, gap = 0.05 }) {
  for (let i = 0; i < n; i++) {
    c.fx({
      forma, cor: escolha(cores), r, w, h, ang: 0,
      x: c.para.x + rnd(-30, 30), y: -10,
      vy: vel, vida: (c.para.y + 20) / vel,
    });
    c.som.tone(300 + rnd(0, 400), 0.03, "square", 0.35);
    await c.wait(gap);
  }
}

const anel = (c, cor, r = 6, vida = 0.45, x = c.para.x, y = c.para.y) =>
  c.fx({ forma: "anel", cor, x, y, r, h: 2, cresce: 90, vida });

// --------------------------------------------------------------- por tipo
const PORTIPO = {
  // pancada seca: o avanço de sempre, agora com estrelinha de impacto
  NORMAL: async (c) => {
    await c.avanca();
    c.som.hit(); c.shake(0.25); c.piscaAlvo(0.45);
    estouro(c, ["#ffffff", "#ffe9a0", "#d8d8d8"], 10, 80);
    await c.wait(0.2);
  },

  FOGO: async (c) => {
    await jato(c, { cores: ["#ff8a3c", "#ffd166", "#e0524a"], n: 22, vel: 190, levas: 5 });
    c.flash(0.35); c.som.noise(0.18, 0.5); c.shake(0.3); c.piscaAlvo(0.45);
    estouro(c, ["#ff8a3c", "#ffd166"], 14, 110);
    await c.wait(0.25);
  },

  "ÁGUA": async (c) => {
    await jato(c, { cores: ["#4aa8f0", "#9fd8f0", "#ffffff"], n: 20, vel: 165, g: 90, levas: 5 });
    c.som.noise(0.2, 0.4); c.shake(0.22); c.piscaAlvo(0.4);
    estouro(c, ["#4aa8f0", "#ffffff"], 12, 95);
    await c.wait(0.22);
  },

  // o raio vem de cima: quem manda é o céu, não o bicho
  "ELÉTRICO": async (c) => {
    for (let i = 0; i < 3; i++) {
      c.fx({ forma: "raio", cor: "#ffe14a", h: 2, x: c.para.x + rnd(-14, 14), y: -6,
             x2: c.para.x + rnd(-6, 6), y2: c.para.y, vida: 0.16 });
      c.som.tone(1200 - i * 200, 0.05, "square", 0.5);
      await c.wait(0.09);
    }
    c.flash(0.5); c.som.noise(0.14, 0.7); c.shake(0.3); c.piscaAlvo(0.5);
    estouro(c, ["#ffe14a", "#ffffff"], 12, 100);
    await c.wait(0.2);
  },

  PLANTA: async (c) => {
    const { ux, uy, d } = rumo(c);
    for (let i = 0; i < 10; i++) {
      c.fx({ forma: "quadro", cor: escolha(["#5cc46a", "#8fd06a", "#2f8f4a"]),
             w: 7, h: 4, ang: rnd(0, 6.3), gira: 9,
             x: c.de.x, y: c.de.y + rnd(-10, 10),
             vx: ux * 180, vy: uy * 180 + rnd(-30, 30), vida: d / 180 + 0.1 });
      c.som.tone(700 + i * 30, 0.03, "triangle", 0.3);
      await c.wait(0.04);
    }
    await c.wait(0.15);
    c.som.hit(); c.shake(0.2); c.piscaAlvo(0.4);
    estouro(c, ["#5cc46a", "#8fd06a"], 10, 80);
    await c.wait(0.15);
  },

  GELO: async (c) => {
    await chuva(c, { cores: ["#bfefff", "#7fd4f0", "#ffffff"], n: 9, forma: "quadro", w: 5, h: 9, vel: 300, gap: 0.04 });
    anel(c, "#bfefff", 4, 0.4);
    c.flash(0.25); c.som.tone(1400, 0.12, "sine", 0.5); c.shake(0.18); c.piscaAlvo(0.45);
    await c.wait(0.25);
  },

  // três socos: o avanço acontece três vezes, cada um mais fundo
  LUTADOR: async (c) => {
    for (let i = 0; i < 3; i++) {
      await c.avanca();
      c.som.hit(); c.shake(0.2 + i * 0.08); c.piscaAlvo(0.2);
      c.fx({ forma: "quadro", cor: "#ffffff", w: 10, h: 10, ang: rnd(0, 1),
             x: c.para.x + rnd(-8, 8), y: c.para.y + rnd(-8, 8), vida: 0.12 });
      await c.wait(0.12);
    }
    estouro(c, ["#ffffff", "#e0524a"], 10, 100);
    await c.wait(0.15);
  },

  // veneno sobe, não voa reto
  VENENO: async (c) => {
    for (let i = 0; i < 14; i++) {
      c.fx({ forma: "bola", cor: escolha(["#a040a0", "#c86ad0", "#6b2a80"]), r: rnd(2, 5),
             x: c.para.x + rnd(-22, 22), y: c.para.y + rnd(0, 16),
             vy: -rnd(20, 45), vida: rnd(0.5, 0.9) });
      c.som.tone(200 + rnd(0, 120), 0.05, "sine", 0.3);
      await c.wait(0.045);
    }
    c.piscaAlvo(0.4); c.shake(0.15);
    await c.wait(0.2);
  },

  // a terra sobe do chão
  TERRA: async (c) => {
    c.shake(0.6);
    for (let i = 0; i < 12; i++) {
      c.fx({ forma: "quadro", cor: escolha(["#e0c068", "#a8823c", "#6b5228"]),
             w: rnd(4, 9), h: rnd(4, 9), ang: rnd(0, 6.3), gira: 6,
             x: c.para.x + rnd(-30, 30), y: c.para.y + 22,
             vy: -rnd(90, 160), g: 240, vida: rnd(0.5, 0.8) });
      c.som.tone(120 + rnd(0, 60), 0.05, "square", 0.5);
      await c.wait(0.04);
    }
    c.piscaAlvo(0.45);
    await c.wait(0.2);
  },

  // rajadas de vento em arco
  VOADOR: async (c) => {
    const { ang } = rumo(c);
    for (let i = 0; i < 8; i++) {
      c.fx({ forma: "risco", cor: "#ffffff", w: rnd(14, 26), h: 2, ang: ang + rnd(-0.3, 0.3),
             x: c.de.x + rnd(-6, 6), y: c.de.y + rnd(-14, 14),
             vx: Math.cos(ang) * 260, vy: Math.sin(ang) * 260, vida: 0.4 });
      c.som.tone(900 + i * 40, 0.03, "sine", 0.3);
      await c.wait(0.05);
    }
    c.som.hit(); c.shake(0.22); c.piscaAlvo(0.4);
    await c.wait(0.2);
  },

  // anéis por cima do alvo e a tela dando uma engasgada
  "PSÍQUICO": async (c) => {
    c.glitch(0.8);
    for (let i = 0; i < 5; i++) {
      anel(c, escolha(["#f85888", "#ffb0c8", "#a890f0"]), 4 + i * 3, 0.5);
      c.som.tone(300 + i * 140, 0.09, "sine", 0.4);
      await c.wait(0.09);
    }
    c.flash(0.25); c.piscaAlvo(0.5); c.shake(0.2);
    await c.wait(0.25);
  },

  // enxame: pontinhos em zigue-zague
  INSETO: async (c) => {
    const { ux, uy, d } = rumo(c);
    for (let i = 0; i < 16; i++) {
      const zig = Math.sin(i) * 60;
      c.fx({ forma: "bola", cor: escolha(["#a8b820", "#d8e04a", "#6b7a10"]), r: 2,
             x: c.de.x, y: c.de.y + rnd(-8, 8),
             vx: ux * 200, vy: uy * 200 + zig, vida: d / 200 + 0.1 });
      c.som.tone(1500 + rnd(0, 400), 0.02, "square", 0.2);
      await c.wait(0.03);
    }
    await c.wait(0.12);
    c.som.hit(); c.shake(0.18); c.piscaAlvo(0.35);
    await c.wait(0.15);
  },

  PEDRA: async (c) => {
    await chuva(c, { cores: ["#b8a038", "#8a7828", "#d8c068"], n: 8, forma: "quadro",
                     w: 8, h: 8, vel: 240, gap: 0.06 });
    c.som.hit(); c.shake(0.45); c.piscaAlvo(0.5);
    estouro(c, ["#b8a038", "#d8c068"], 12, 90);
    await c.wait(0.25);
  },

  // o vulto passa POR DENTRO do alvo
  FANTASMA: async (c) => {
    const { ux, uy, d } = rumo(c);
    for (let i = 0; i < 6; i++) {
      c.fx({ forma: "bola", cor: escolha(["#705898", "#b455ff", "#3a2b52"]), r: rnd(6, 11),
             x: c.de.x, y: c.de.y, vx: ux * 150, vy: uy * 150, vida: d / 150 + 0.35 });
      c.som.tone(180 - i * 15, 0.12, "sine", 0.35);
      await c.wait(0.07);
    }
    c.glitch(1); c.piscaAlvo(0.6); c.shake(0.25);
    anel(c, "#b455ff", 6, 0.5);
    await c.wait(0.3);
  },

  // espiral: os losangos giram em volta do alvo antes de fechar
  "DRAGÃO": async (c) => {
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 4;
      const raio = 34 - i * 1.6;
      c.fx({ forma: "quadro", cor: escolha(["#7038f8", "#a890f0", "#4a1fb0"]), w: 6, h: 6,
             ang: a, gira: 8,
             x: c.para.x + Math.cos(a) * raio, y: c.para.y + Math.sin(a) * raio * 0.6,
             vida: 0.35 });
      c.som.tone(240 + i * 25, 0.03, "sawtooth", 0.35);
      await c.wait(0.03);
    }
    c.flash(0.3); c.som.noise(0.16, 0.6); c.shake(0.35); c.piscaAlvo(0.5);
    await c.wait(0.25);
  },

  // metal: faísca e um corte brilhante
  "AÇO": async (c) => {
    await c.avanca();
    for (let i = 0; i < 3; i++) {
      c.fx({ forma: "risco", cor: "#ffffff", w: 30, h: 3, ang: -0.7 + i * 0.15,
             x: c.para.x - 14, y: c.para.y - 12 + i * 10, vida: 0.18 });
      c.som.tone(1800 - i * 300, 0.04, "square", 0.4);
      await c.wait(0.07);
    }
    c.flash(0.3); c.shake(0.28); c.piscaAlvo(0.45);
    estouro(c, ["#ffffff", "#c8d0e0", "#ffe14a"], 10, 110);
    await c.wait(0.2);
  },

  // o cartucho reclamando: faixas deslocadas e barulho
  GLITCH: async (c) => {
    c.glitch(2.2); c.som.glitch();
    for (let i = 0; i < 10; i++) {
      c.fx({ forma: "barra", cor: escolha(["#b455ff", "#ffffff", "#59d99b", "#e0524a"]),
             x: rnd(-10, 120), y: rnd(0, 104), w: rnd(40, 150), h: rnd(2, 7), vida: rnd(0.1, 0.3) });
      await c.wait(0.04);
    }
    c.flash(0.4); c.shake(0.4); c.piscaAlvo(0.6);
    await c.wait(0.25);
  },
};

// ---------------------------------------------------------- por categoria
// Golpe de STATUS não bate em ninguém: dar a ele o avanço e a estrelinha de
// impacto é mentir na tela. ENDURECER não acerta o outro — ele acontece em quem
// usou. São duas cenas: a que sobe em quem usou e a que desce no alvo.
const PORCATEGORIA = {
  // buff: setas subindo em volta de quem usou, e o tom subindo junto
  proprio: async (c) => {
    for (let i = 0; i < 10; i++) {
      c.fx({ forma: "risco", cor: escolha(["#ffe14a", "#ffffff", "#8fd06a"]), w: 7, h: 3, ang: -1.57,
             x: c.de.x + rnd(-24, 24), y: c.de.y + rnd(0, 20), vy: -70, vida: 0.5 });
      c.som.tone(420 + i * 55, 0.05, "sine", 0.35);
      await c.wait(0.05);
    }
    anel(c, "#ffe14a", 8, 0.4, c.de.x, c.de.y);
    await c.wait(0.2);
  },

  // debuff: a onda desce em cima do alvo, sem baque nenhum
  alvo: async (c) => {
    for (let i = 0; i < 4; i++) {
      c.fx({ forma: "anel", cor: escolha(["#a99ec9", "#ffffff"]), x: c.para.x, y: c.para.y - 16 + i * 8,
             r: 16 - i * 2, h: 2, vida: 0.4 });
      c.som.tone(600 - i * 90, 0.07, "triangle", 0.35);
      await c.wait(0.08);
    }
    c.piscaAlvo(0.3);
    await c.wait(0.2);
  },
};

// ------------------------------------------------------- ajudantes de cena
/** riscos paralelos em cima do alvo: garra, corte, bicada */
function garras(c, cor, n = 3, ang = -0.6, comp = 34, gap = 9) {
  for (let i = 0; i < n; i++) {
    c.fx({ forma: "risco", cor, w: comp, h: 3, ang,
           x: c.para.x - Math.cos(ang) * comp / 2 + i * gap - gap,
           y: c.para.y - Math.sin(ang) * comp / 2 - 6 + i * 4, vida: 0.22 });
  }
}

/** feixe reto de quem ataca até o alvo, desenhado em pedaços */
function feixe(c, cores, grossura = 4, vida = 0.3) {
  const { ux, uy, d } = rumo(c);
  for (let i = 0; i < d / 6; i++) {
    c.fx({ forma: "bola", cor: escolha(cores), r: grossura / 2 + rnd(-0.5, 1),
           x: c.de.x + ux * i * 6, y: c.de.y + uy * i * 6, vida: vida + i * 0.004 });
  }
}

/** o borrão de quem sai correndo: riscos atrás do atacante */
function borrao(c, cor = "#ffffff", n = 6) {
  const { ux, uy, ang } = rumo(c);
  for (let i = 0; i < n; i++) {
    c.fx({ forma: "risco", cor, w: rnd(10, 20), h: 2, ang,
           x: c.de.x + ux * i * 12 + rnd(-4, 4), y: c.de.y + uy * i * 12 + rnd(-8, 8), vida: 0.2 });
  }
}

// -------------------------------------------------------------- por golpe
// UMA CENA POR GOLPE. São 48, e são 48 aqui embaixo: nenhum golpe do jogo cai
// na cena do tipo. O que a cena conta é o que o NOME promete — ARRANHÃO são três
// riscos, MORDIDA são dois dentes fechando, ATAQUE RÁPIDO é um borrão que chega
// antes de você ver. As tabelas por tipo e por categoria continuam existindo
// como rede: golpe novo, escrito amanhã, já nasce com animação.
const PORGOLPE = {
  // ----------------------------------------------------------- NORMAL
  // corre e bate: o rastro fica pra trás enquanto ele avança
  investida: async (c) => {
    borrao(c, "#ffffff", 6);
    await c.avanca();
    c.som.hit(); c.shake(0.28); c.piscaAlvo(0.4);
    estouro(c, ["#ffffff", "#ffe9a0"], 8, 80);
    await c.wait(0.18);
  },

  // três riscos, e só
  arranhao: async (c) => {
    await c.avanca();
    garras(c, "#ffffff");
    c.som.tone(1500, 0.05, "square", 0.4); c.som.hit();
    c.shake(0.22); c.piscaAlvo(0.35);
    await c.wait(0.28);
  },

  // chega antes de você ver: some, aparece do lado do alvo, volta
  ataquerapido: async (c) => {
    c.somem();
    borrao(c, "#cfe9ff", 9);
    c.som.tone(1700, 0.04, "sine", 0.4);
    await c.wait(0.12);
    c.voltam();
    c.som.hit(); c.shake(0.24); c.piscaAlvo(0.3);
    estouro(c, ["#ffffff", "#cfe9ff"], 8, 100);
    await c.wait(0.16);
  },

  // dois dentes fechando: dois quadros que vêm de cima e de baixo e se encontram
  mordida: async (c) => {
    for (const lado of [-1, 1]) {
      c.fx({ forma: "quadro", cor: "#ffffff", w: 20, h: 12, ang: lado * 0.25,
             x: c.para.x, y: c.para.y + lado * 20, vy: -lado * 130, vida: 0.22 });
    }
    c.som.tone(220, 0.09, "square", 0.5);
    await c.wait(0.2);
    c.som.hit(); c.shake(0.3); c.piscaAlvo(0.45);
    estouro(c, ["#ffffff", "#e0524a"], 8, 70);
    await c.wait(0.18);
  },

  // recua primeiro, e aí vai com tudo
  cabecada: async (c) => {
    c.fx({ forma: "risco", cor: "#ffe9a0", w: 16, h: 2, ang: rumo(c).ang + Math.PI,
           x: c.de.x, y: c.de.y, vida: 0.25 });
    c.som.tone(180, 0.12, "square", 0.4);
    await c.wait(0.22);
    await c.avanca();
    c.som.hit(); c.flash(0.25); c.shake(0.45); c.piscaAlvo(0.5);
    estouro(c, ["#ffffff", "#ffe9a0", "#e0524a"], 14, 120);
    await c.wait(0.22);
  },

  // levanta e larga: o vulto sobe e desce inteiro em cima do alvo
  forca: async (c) => {
    c.fx({ forma: "quadro", cor: "#d8d8d8", w: 26, h: 26, ang: 0,
           x: c.para.x, y: c.para.y - 40, vy: 40, vida: 0.3 });
    c.som.tone(150, 0.2, "square", 0.45);
    await c.wait(0.3);
    c.fx({ forma: "quadro", cor: "#ffffff", w: 30, h: 30, x: c.para.x, y: c.para.y, vida: 0.15 });
    c.som.hit(); c.shake(0.55); c.piscaAlvo(0.5);
    estouro(c, ["#d8d8d8", "#ffffff"], 12, 110);
    await c.wait(0.22);
  },

  // o grito é onda: sai da boca de quem usou e vai até o outro
  grito: async (c) => {
    const { ux, uy } = rumo(c);
    for (let i = 0; i < 5; i++) {
      c.fx({ forma: "anel", cor: "#ffffff", h: 2, r: 4,
             x: c.de.x + ux * 10, y: c.de.y + uy * 10,
             vx: ux * 200, vy: uy * 200, cresce: 40, vida: 0.5 });
      c.som.tone(900 - i * 120, 0.07, "square", 0.35);
      await c.wait(0.08);
    }
    c.piscaAlvo(0.3); c.shake(0.15);
    await c.wait(0.2);
  },

  // dois olhos abrem no escuro e o outro encolhe
  encarar: async (c) => {
    for (const dx of [-7, 7]) {
      c.fx({ forma: "bola", cor: "#ffffff", r: 4, x: c.de.x + dx, y: c.de.y - 6, vida: 0.7, fade: false });
      c.fx({ forma: "bola", cor: "#e0524a", r: 2, x: c.de.x + dx, y: c.de.y - 6, vida: 0.7, fade: false });
    }
    c.som.tone(120, 0.3, "sine", 0.4);
    await c.wait(0.45);
    c.piscaAlvo(0.5); c.shake(0.2);
    await c.wait(0.25);
  },

  // o rabo varre o chão e levanta poeirinha
  rabodeabano: async (c) => {
    for (let i = 0; i < 3; i++) {
      c.fx({ forma: "risco", cor: "#ffffff", w: 26, h: 2, ang: 0.2 - i * 0.2,
             x: c.de.x, y: c.de.y + 12, vida: 0.2 });
      for (let j = 0; j < 3; j++) {
        c.fx({ forma: "bola", cor: "#e0c068", r: 2, x: c.de.x + rnd(0, 26), y: c.de.y + 18,
               vy: -rnd(10, 30), vida: 0.4 });
      }
      c.som.tone(500 + i * 120, 0.05, "sine", 0.3);
      await c.wait(0.12);
    }
    c.piscaAlvo(0.25);
    await c.wait(0.18);
  },

  // um punhado de areia na cara do outro
  areianosolhos: async (c) => {
    const { ux, uy, d } = rumo(c);
    for (let i = 0; i < 18; i++) {
      c.fx({ forma: "bola", cor: escolha(["#e0c068", "#c8a850", "#f0e0b0"]), r: rnd(1, 3),
             x: c.de.x, y: c.de.y, vx: ux * rnd(120, 200) + rnd(-30, 30),
             vy: uy * rnd(120, 200) + rnd(-30, 30), g: 40, vida: d / 160 });
    }
    c.som.noise(0.18, 0.35);
    await c.wait(0.35);
    c.piscaAlvo(0.45); c.shake(0.12);
    await c.wait(0.18);
  },

  // a casca se fecha: quatro blocos encostam em quem usou
  endurecer: async (c) => {
    for (const [dx, dy] of [[-22, 0], [22, 0], [0, -22], [0, 22]]) {
      c.fx({ forma: "quadro", cor: "#c8d0e0", w: 12, h: 12,
             x: c.de.x + dx, y: c.de.y + dy, vx: -dx * 3, vy: -dy * 3, vida: 0.33 });
    }
    c.som.tone(300, 0.1, "square", 0.4);
    await c.wait(0.34);
    anel(c, "#ffffff", 12, 0.35, c.de.x, c.de.y);
    c.som.tone(700, 0.12, "sine", 0.4);
    await c.wait(0.25);
  },

  // ------------------------------------------------------------- FOGO
  // fagulha: pouca coisa, e apaga rápido
  brasa: async (c) => {
    await jato(c, { cores: ["#ff8a3c", "#ffd166"], n: 8, vel: 200, levas: 3, espalha: 22, g: -30 });
    c.som.noise(0.1, 0.35); c.shake(0.16); c.piscaAlvo(0.3);
    estouro(c, ["#ff8a3c", "#ffd166"], 6, 70);
    await c.wait(0.18);
  },

  // o jato não pára: sai contínuo e alarga no fim
  lancachamas: async (c) => {
    await jato(c, { cores: ["#ff8a3c", "#ffd166", "#e0524a", "#ffffff"], n: 40, vel: 210, levas: 8, espalha: 10 });
    c.flash(0.4); c.som.noise(0.3, 0.6); c.shake(0.4); c.piscaAlvo(0.6);
    for (let i = 0; i < 3; i++) { anel(c, "#ff8a3c", 5 + i * 4, 0.4); }
    estouro(c, ["#ff8a3c", "#ffd166", "#ffffff"], 18, 130);
    await c.wait(0.28);
  },

  // ------------------------------------------------------------- ÁGUA
  // um fio de água reto, fino
  pistoladagua: async (c) => {
    feixe(c, ["#4aa8f0", "#9fd8f0"], 4, 0.28);
    c.som.noise(0.14, 0.35);
    await c.wait(0.26);
    c.shake(0.2); c.piscaAlvo(0.35);
    estouro(c, ["#4aa8f0", "#ffffff"], 8, 80);
    await c.wait(0.18);
  },

  // bolhas grandes, devagar, subindo pelo caminho
  bolhas: async (c) => {
    const { ux, uy, d } = rumo(c);
    for (let i = 0; i < 12; i++) {
      c.fx({ forma: "anel", cor: escolha(["#9fd8f0", "#ffffff"]), r: rnd(3, 7), h: 2,
             x: c.de.x + rnd(-6, 6), y: c.de.y + rnd(-6, 6),
             vx: ux * 110, vy: uy * 110 - 25, vida: d / 110 });
      c.som.tone(600 + rnd(0, 500), 0.04, "sine", 0.25);
      await c.wait(0.055);
    }
    c.piscaAlvo(0.35); c.shake(0.15);
    await c.wait(0.2);
  },

  // ----------------------------------------------------------- PLANTA
  // a vinha estica, encosta e chicoteia
  chicotedevinha: async (c) => {
    const { ux, uy, d, ang } = rumo(c);
    for (let i = 0; i < 8; i++) {
      c.fx({ forma: "risco", cor: "#2f8f4a", w: d / 8 + 4, h: 3, ang: ang + Math.sin(i) * 0.12,
             x: c.de.x + ux * (i * d / 8), y: c.de.y + uy * (i * d / 8), vida: 0.35 });
      c.som.tone(400 + i * 60, 0.03, "triangle", 0.3);
      await c.wait(0.03);
    }
    c.som.hit(); c.shake(0.3); c.piscaAlvo(0.4);
    estouro(c, ["#5cc46a", "#8fd06a"], 8, 90);
    await c.wait(0.22);
  },

  // leque de folhas girando
  folhanavalha: async (c) => {
    const { ux, uy, d } = rumo(c);
    for (let i = 0; i < 12; i++) {
      const abre = (i - 6) * 0.09;
      c.fx({ forma: "quadro", cor: escolha(["#5cc46a", "#8fd06a", "#2f8f4a"]), w: 9, h: 3,
             ang: rnd(0, 6.3), gira: 16,
             x: c.de.x, y: c.de.y,
             vx: (ux + abre) * 210, vy: (uy - abre) * 210, vida: d / 210 + 0.1 });
      c.som.tone(1100 + i * 40, 0.02, "sawtooth", 0.25);
      await c.wait(0.035);
    }
    await c.wait(0.12);
    garras(c, "#5cc46a", 3, -0.5, 26, 7);
    c.som.hit(); c.shake(0.24); c.piscaAlvo(0.4);
    await c.wait(0.2);
  },

  // --------------------------------------------------------- ELÉTRICO
  // faísca curta: sai de quem usou e estala no outro
  choquedotrovao: async (c) => {
    c.fx({ forma: "raio", cor: "#ffe14a", h: 3, x: c.de.x, y: c.de.y, x2: c.para.x, y2: c.para.y, vida: 0.2 });
    c.som.tone(1400, 0.06, "square", 0.5);
    await c.wait(0.16);
    c.fx({ forma: "raio", cor: "#ffffff", h: 2, x: c.de.x, y: c.de.y, x2: c.para.x, y2: c.para.y, vida: 0.16 });
    c.flash(0.3); c.som.noise(0.1, 0.6); c.shake(0.25); c.piscaAlvo(0.45);
    estouro(c, ["#ffe14a", "#ffffff"], 10, 90);
    await c.wait(0.2);
  },

  // a onda sai em anéis do próprio alvo, sem raio nenhum
  ondadechoque: async (c) => {
    for (let i = 0; i < 4; i++) {
      c.fx({ forma: "anel", cor: escolha(["#ffe14a", "#ffffff"]), r: 3, h: 3,
             x: c.para.x, y: c.para.y, cresce: 130, vida: 0.42 });
      c.som.tone(700 + i * 180, 0.06, "square", 0.4);
      await c.wait(0.1);
    }
    c.flash(0.25); c.shake(0.28); c.piscaAlvo(0.45);
    await c.wait(0.2);
  },

  // ----------------------------------------------------------- INSETO
  // o fio amarra: riscos brancos cruzando o alvo
  fiodeseda: async (c) => {
    for (let i = 0; i < 7; i++) {
      c.fx({ forma: "risco", cor: "#ffffff", w: 34, h: 2, ang: i % 2 ? 0.5 : -0.5,
             x: c.para.x - 17, y: c.para.y - 12 + i * 4, vida: 0.6, fade: false });
      c.som.tone(1200 + i * 60, 0.03, "sine", 0.25);
      await c.wait(0.06);
    }
    c.piscaAlvo(0.3);
    await c.wait(0.3);
  },

  // o ferrão entra e sai, uma vez só
  picada: async (c) => {
    const { ang } = rumo(c);
    await c.avanca();
    c.fx({ forma: "risco", cor: "#d8e04a", w: 26, h: 3, ang,
           x: c.para.x - Math.cos(ang) * 26, y: c.para.y - Math.sin(ang) * 26, vida: 0.18 });
    c.som.tone(1900, 0.05, "square", 0.4); c.som.hit();
    c.shake(0.2); c.piscaAlvo(0.35);
    estouro(c, ["#d8e04a", "#ffffff"], 6, 70);
    await c.wait(0.22);
  },

  // ----------------------------------------------------------- VENENO
  // ferrão roxo, e a gota fica pingando depois
  picadadeveneno: async (c) => {
    const { ang } = rumo(c);
    await c.avanca();
    c.fx({ forma: "risco", cor: "#c86ad0", w: 24, h: 3, ang,
           x: c.para.x - Math.cos(ang) * 24, y: c.para.y - Math.sin(ang) * 24, vida: 0.18 });
    c.som.tone(1500, 0.05, "square", 0.35); c.som.hit();
    c.shake(0.2); c.piscaAlvo(0.35);
    await c.wait(0.16);
    for (let i = 0; i < 6; i++) {
      c.fx({ forma: "bola", cor: "#a040a0", r: 2, x: c.para.x + rnd(-8, 8), y: c.para.y,
             vy: 40, g: 60, vida: 0.5 });
      await c.wait(0.05);
    }
    await c.wait(0.15);
  },

  // ácido: cai por cima e borbulha
  poderdeacido: async (c) => {
    await chuva(c, { cores: ["#a040a0", "#c86ad0", "#6b2a80"], n: 10, r: 3, vel: 220, gap: 0.045 });
    for (let i = 0; i < 10; i++) {
      c.fx({ forma: "bola", cor: escolha(["#c86ad0", "#ffffff"]), r: rnd(1, 3),
             x: c.para.x + rnd(-18, 18), y: c.para.y + rnd(-6, 10), vy: -rnd(15, 35), vida: 0.6 });
    }
    c.som.noise(0.25, 0.4); c.shake(0.2); c.piscaAlvo(0.45);
    await c.wait(0.25);
  },

  // ----------------------------------------------------------- VOADOR
  // rajada: linhas horizontais varrendo a tela inteira
  rajadadevento: async (c) => {
    for (let i = 0; i < 14; i++) {
      c.fx({ forma: "risco", cor: escolha(["#ffffff", "#cfe9ff"]), w: rnd(20, 60), h: 2, ang: 0,
             x: c.dir > 0 ? -40 : 240, y: rnd(6, 104), vx: c.dir * rnd(300, 460), vida: 0.6 });
      c.som.tone(600 + rnd(0, 500), 0.02, "sine", 0.2);
      await c.wait(0.035);
    }
    c.shake(0.22); c.piscaAlvo(0.35);
    await c.wait(0.2);
  },

  // duas asas batendo em cima do alvo
  ataquedeasa: async (c) => {
    await c.avanca();
    for (const lado of [-1, 1]) {
      c.fx({ forma: "anel", cor: "#ffffff", r: 14, h: 3,
             x: c.para.x + lado * 12, y: c.para.y, cresce: -20, vida: 0.28 });
    }
    c.som.noise(0.12, 0.4); c.som.hit();
    c.shake(0.3); c.piscaAlvo(0.4);
    estouro(c, ["#ffffff", "#a890f0"], 8, 90);
    await c.wait(0.22);
  },

  // três bicadas secas, uma atrás da outra
  bicada: async (c) => {
    const { ang } = rumo(c);
    for (let i = 0; i < 3; i++) {
      await c.avanca();
      c.fx({ forma: "risco", cor: "#ffe9a0", w: 18, h: 4, ang,
             x: c.para.x - Math.cos(ang) * 18, y: c.para.y - Math.sin(ang) * 18 + (i - 1) * 6, vida: 0.14 });
      c.som.tone(1300 - i * 150, 0.04, "square", 0.4); c.som.hit();
      c.shake(0.18); c.piscaAlvo(0.18);
      await c.wait(0.1);
    }
    await c.wait(0.15);
  },

  // ------------------------------------------------------------ TERRA
  // bolotas de lama arremessadas em arco
  bofetadadelama: async (c) => {
    const { ux, uy, d } = rumo(c);
    for (let i = 0; i < 7; i++) {
      c.fx({ forma: "bola", cor: escolha(["#8a6a3c", "#6b5228", "#a8823c"]), r: rnd(3, 6),
             x: c.de.x, y: c.de.y, vx: ux * 150, vy: uy * 150 - 60, g: 200, vida: d / 150 + 0.1 });
      c.som.tone(220 + rnd(0, 80), 0.05, "square", 0.35);
      await c.wait(0.07);
    }
    await c.wait(0.1);
    c.som.hit(); c.shake(0.24); c.piscaAlvo(0.5);
    estouro(c, ["#8a6a3c", "#6b5228"], 8, 70);
    await c.wait(0.2);
  },

  // ------------------------------------------------------------ PEDRA
  // uma pedra só, grande, em arco alto
  jogarpedra: async (c) => {
    const { ux, uy, d } = rumo(c);
    const t = d / 160;
    c.fx({ forma: "quadro", cor: "#8a7828", w: 14, h: 14, ang: 0, gira: 7,
           x: c.de.x, y: c.de.y - 8, vx: ux * 160, vy: uy * 160 - 120, g: 260, vida: t });
    c.som.tone(260, 0.1, "square", 0.4);
    await c.wait(t);
    c.som.hit(); c.shake(0.4); c.piscaAlvo(0.5);
    estouro(c, ["#b8a038", "#8a7828", "#d8c068"], 12, 100);
    await c.wait(0.22);
  },

  // ---------------------------------------------------------- LUTADOR
  // um soco só, e a pedra racha: os cacos saem pros lados
  quebrarocha: async (c) => {
    await c.avanca();
    c.fx({ forma: "quadro", cor: "#ffffff", w: 14, h: 14, ang: 0.4, x: c.para.x, y: c.para.y, vida: 0.12 });
    c.som.hit(); c.shake(0.4); c.piscaAlvo(0.4);
    for (let i = 0; i < 8; i++) {
      const a = -Math.PI / 2 + rnd(-1.1, 1.1);
      c.fx({ forma: "quadro", cor: escolha(["#b8a038", "#8a7828"]), w: rnd(4, 8), h: rnd(4, 8),
             ang: rnd(0, 6.3), gira: 8, x: c.para.x, y: c.para.y,
             vx: Math.cos(a) * rnd(50, 110), vy: Math.sin(a) * rnd(50, 110), g: 220, vida: 0.6 });
    }
    await c.wait(0.28);
  },

  // o corte de mão: um risco vertical que desce inteiro
  golpecarate: async (c) => {
    await c.avanca();
    c.fx({ forma: "risco", cor: "#ffffff", w: 40, h: 4, ang: 1.5,
           x: c.para.x, y: c.para.y - 20, vida: 0.2 });
    c.som.tone(900, 0.07, "square", 0.45); c.som.hit();
    c.flash(0.2); c.shake(0.35); c.piscaAlvo(0.45);
    estouro(c, ["#ffffff", "#c03028"], 10, 95);
    await c.wait(0.26);
  },

  // dois chutes: um alto, um baixo
  chuteduplo: async (c) => {
    for (let i = 0; i < 2; i++) {
      await c.avanca();
      c.fx({ forma: "quadro", cor: "#ffffff", w: 12, h: 8, ang: i ? 0.5 : -0.5,
             x: c.para.x, y: c.para.y + (i ? 10 : -10), vida: 0.14 });
      c.som.hit(); c.som.tone(400 - i * 120, 0.05, "square", 0.4);
      c.shake(0.26); c.piscaAlvo(0.22);
      await c.wait(0.14);
    }
    estouro(c, ["#ffffff", "#c03028"], 8, 90);
    await c.wait(0.16);
  },

  // --------------------------------------------------------- PSÍQUICO
  // confusão: os anéis giram tortos em volta do alvo
  confusao: async (c) => {
    for (let i = 0; i < 10; i++) {
      const a = i * 0.9;
      c.fx({ forma: "anel", cor: escolha(["#f85888", "#ffb0c8"]), r: 5, h: 2,
             x: c.para.x + Math.cos(a) * 16, y: c.para.y + Math.sin(a) * 10,
             cresce: 20, vida: 0.4 });
      c.som.tone(500 + Math.sin(i) * 200, 0.06, "sine", 0.3);
      await c.wait(0.07);
    }
    c.glitch(0.6); c.piscaAlvo(0.4); c.shake(0.18);
    await c.wait(0.22);
  },

  // psíquico: a tela inteira distorce e o alvo é esmagado por anéis
  psiquico: async (c) => {
    c.glitch(1.6);
    for (let i = 0; i < 6; i++) {
      c.fx({ forma: "anel", cor: escolha(["#f85888", "#a890f0", "#ffffff"]), r: 30 - i * 4, h: 3,
             x: c.para.x, y: c.para.y, cresce: -40, vida: 0.4 });
      c.som.tone(240 + i * 160, 0.08, "sine", 0.4);
      await c.wait(0.08);
    }
    c.flash(0.45); c.shake(0.4); c.piscaAlvo(0.6);
    estouro(c, ["#f85888", "#a890f0"], 12, 110);
    await c.wait(0.28);
  },

  // ------------------------------------------------------------- GELO
  // rajada gelada varrendo o alvo
  ventogelado: async (c) => {
    for (let i = 0; i < 14; i++) {
      c.fx({ forma: "risco", cor: escolha(["#bfefff", "#ffffff", "#7fd4f0"]), w: rnd(16, 44), h: 2, ang: 0.15,
             x: c.dir > 0 ? -30 : 250, y: rnd(10, 90), vx: c.dir * rnd(280, 420), vida: 0.55 });
      c.som.tone(900 + rnd(0, 700), 0.02, "sine", 0.2);
      await c.wait(0.035);
    }
    c.piscaAlvo(0.4); c.shake(0.2);
    await c.wait(0.2);
  },

  // o feixe congela: vai reto e deixa cristais em pé no alvo
  raiodegelo: async (c) => {
    feixe(c, ["#bfefff", "#ffffff", "#7fd4f0"], 5, 0.32);
    c.som.tone(1600, 0.14, "sine", 0.45);
    await c.wait(0.3);
    for (let i = 0; i < 6; i++) {
      c.fx({ forma: "quadro", cor: "#bfefff", w: 5, h: 12, ang: rnd(-0.4, 0.4),
             x: c.para.x + rnd(-16, 16), y: c.para.y + rnd(-10, 10), vida: 0.55, fade: false });
    }
    c.flash(0.3); c.shake(0.22); c.piscaAlvo(0.5);
    await c.wait(0.3);
  },

  // ----------------------------------------------------------- DRAGÃO
  // a fúria é bola de energia: três, cada vez maior
  furiadragao: async (c) => {
    const { ux, uy, d } = rumo(c);
    for (let i = 0; i < 3; i++) {
      c.fx({ forma: "bola", cor: escolha(["#7038f8", "#a890f0"]), r: 5 + i * 2,
             x: c.de.x, y: c.de.y, vx: ux * 190, vy: uy * 190, vida: d / 190 });
      c.som.tone(200 + i * 70, 0.1, "sawtooth", 0.4);
      await c.wait(0.12);
    }
    await c.wait(0.2);
    c.flash(0.3); c.som.noise(0.18, 0.5); c.shake(0.35); c.piscaAlvo(0.5);
    estouro(c, ["#7038f8", "#a890f0", "#ffffff"], 14, 120);
    await c.wait(0.22);
  },

  // a garra: três riscos roxos, longos, atravessando o alvo
  garradragao: async (c) => {
    await c.avanca();
    garras(c, "#7038f8", 3, -0.7, 44, 11);
    c.som.tone(700, 0.08, "sawtooth", 0.45); c.som.hit();
    c.flash(0.2); c.shake(0.32); c.piscaAlvo(0.45);
    estouro(c, ["#a890f0", "#ffffff"], 10, 100);
    await c.wait(0.28);
  },

  // --------------------------------------------------------- FANTASMA
  // a língua estica, encosta e volta
  lambida: async (c) => {
    const { ux, uy, d, ang } = rumo(c);
    for (let i = 0; i < 6; i++) {
      c.fx({ forma: "risco", cor: "#f85888", w: (i + 1) * (d / 6), h: 5, ang,
             x: c.de.x, y: c.de.y, vida: 0.12 });
      c.som.tone(300 + i * 40, 0.04, "sine", 0.3);
      await c.wait(0.05);
    }
    c.piscaAlvo(0.4); c.shake(0.2); c.glitch(0.5);
    await c.wait(0.25);
  },

  // a bola de sombra voa devagar e estoura grande
  bolasombria: async (c) => {
    const { ux, uy, d } = rumo(c);
    const t = d / 130;
    c.fx({ forma: "bola", cor: "#3a2b52", r: 9, x: c.de.x, y: c.de.y, vx: ux * 130, vy: uy * 130, vida: t });
    c.fx({ forma: "anel", cor: "#b455ff", r: 11, h: 2, x: c.de.x, y: c.de.y, vx: ux * 130, vy: uy * 130, vida: t });
    c.som.tone(160, 0.25, "sine", 0.4);
    await c.wait(t);
    c.glitch(1.4); c.flash(0.3); c.som.noise(0.2, 0.6); c.shake(0.4); c.piscaAlvo(0.6);
    anel(c, "#b455ff", 6, 0.5);
    estouro(c, ["#705898", "#b455ff", "#3a2b52"], 16, 120);
    await c.wait(0.28);
  },

  // -------------------------------------------------------------- AÇO
  // garra de metal: os riscos brilham antes de cortar
  garrademetal: async (c) => {
    for (let i = 0; i < 3; i++) {
      c.fx({ forma: "bola", cor: "#ffffff", r: 2, x: c.de.x + rnd(-8, 8), y: c.de.y + rnd(-8, 8), vida: 0.25 });
      c.som.tone(2000 - i * 200, 0.03, "square", 0.3);
      await c.wait(0.06);
    }
    await c.avanca();
    garras(c, "#e8f0ff", 3, -0.5, 36, 10);
    c.som.tone(1800, 0.06, "square", 0.45); c.som.hit();
    c.flash(0.3); c.shake(0.3); c.piscaAlvo(0.45);
    estouro(c, ["#ffffff", "#c8d0e0", "#ffe14a"], 10, 110);
    await c.wait(0.26);
  },

  // ----------------------------------------------------------- GLITCH
  // corrompida: pedaços da tela saem do lugar
  corrompida: async (c) => {
    c.glitch(2); c.som.glitch();
    for (let i = 0; i < 12; i++) {
      c.fx({ forma: "barra", cor: escolha(["#b455ff", "#59d99b", "#e0524a", "#ffffff"]),
             x: rnd(-20, 140), y: rnd(0, 104), w: rnd(30, 120), h: rnd(2, 6), vida: rnd(0.1, 0.3) });
      c.som.tone(rnd(100, 1600), 0.02, "square", 0.3);
      await c.wait(0.04);
    }
    c.shake(0.35); c.piscaAlvo(0.5);
    await c.wait(0.22);
  },

  // ruído branco: a tela vira chuvisco e volta
  ruidobranco: async (c) => {
    c.som.glitch();
    for (let i = 0; i < 26; i++) {
      c.fx({ forma: "barra", cor: escolha(["#ffffff", "#d8d8d8", "#a99ec9"]),
             x: rnd(0, 220), y: rnd(0, 104), w: rnd(6, 30), h: rnd(1, 4), vida: 0.12 });
      if (i % 6 === 0) c.som.noise(0.05, 0.3);
      await c.wait(0.022);
    }
    c.flash(0.35); c.piscaAlvo(0.4); c.glitch(1.2);
    await c.wait(0.2);
  },

  // ------------------------------------------------- os seis de sempre
  // a tela inteira treme e o chão sobe: o golpe não tem alvo, tem lugar
  terremoto: async (c) => {
    c.shake(1.1);
    c.som.tone(70, 0.5, "square", 0.7);
    for (let i = 0; i < 22; i++) {
      c.fx({ forma: "quadro", cor: escolha(["#e0c068", "#a8823c", "#6b5228", "#8fd06a"]),
             w: rnd(5, 12), h: rnd(5, 12), ang: rnd(0, 6.3), gira: 5,
             x: rnd(0, 240), y: rnd(70, 110),
             vy: -rnd(70, 150), g: 260, vida: rnd(0.5, 0.9) });
      await c.wait(0.03);
    }
    c.piscaAlvo(0.6);
    await c.wait(0.35);
  },

  // uma onda só, atravessando a tela de um lado ao outro
  surfar: async (c) => {
    c.som.noise(0.6, 0.5);
    for (let i = 0; i < 26; i++) {
      const x = c.dir > 0 ? -20 + i * 11 : 260 - i * 11;
      for (let j = 0; j < 4; j++) {
        c.fx({ forma: "bola", cor: escolha(["#4aa8f0", "#9fd8f0", "#ffffff", "#2a6ab0"]),
               r: rnd(4, 9), x, y: rnd(40, 104),
               vx: c.dir * 120, vy: -rnd(10, 40), g: 70, vida: 0.5 });
      }
      await c.wait(0.022);
    }
    c.shake(0.4); c.piscaAlvo(0.5);
    await c.wait(0.25);
  },

  // some da tela, sobe, e cai em cima
  voar: async (c) => {
    c.somem(0.35);
    c.som.tone(900, 0.2, "sine", 0.35);
    await c.wait(0.45);
    for (let i = 0; i < 6; i++) {
      c.fx({ forma: "risco", cor: "#ffffff", w: 22, h: 2, ang: 1.2,
             x: c.para.x + rnd(-10, 10), y: -10 + i * 6, vy: 320, vida: 0.25 });
      await c.wait(0.03);
    }
    c.voltam();
    c.som.hit(); c.flash(0.3); c.shake(0.45); c.piscaAlvo(0.5);
    estouro(c, ["#ffffff", "#a890f0"], 12, 110);
    await c.wait(0.25);
  },

  // dois riscos em X, e o segundo mais fundo
  corte: async (c) => {
    await c.avanca();
    for (const a of [-0.8, 0.8]) {
      c.fx({ forma: "risco", cor: "#ffffff", w: 46, h: 3, ang: a,
             x: c.para.x - Math.cos(a) * 23, y: c.para.y - Math.sin(a) * 23, vida: 0.22 });
      c.som.tone(1600, 0.05, "square", 0.45);
      c.shake(0.22); c.piscaAlvo(0.25);
      await c.wait(0.13);
    }
    estouro(c, ["#ffffff", "#ffe9a0"], 8, 90);
    await c.wait(0.18);
  },

  // o céu carrega antes de descer
  trovoada: async (c) => {
    for (let i = 0; i < 5; i++) {
      c.fx({ forma: "bola", cor: "#ffe14a", r: 3, x: c.para.x + rnd(-40, 40), y: rnd(0, 30),
             vy: 20, vida: 0.3 });
      c.som.tone(400 + i * 90, 0.04, "square", 0.3);
      await c.wait(0.06);
    }
    c.flash(0.7);
    c.fx({ forma: "raio", cor: "#ffffff", h: 4, x: c.para.x, y: -8, x2: c.para.x, y2: c.para.y, vida: 0.22 });
    c.fx({ forma: "raio", cor: "#ffe14a", h: 2, x: c.para.x + 6, y: -8, x2: c.para.x, y2: c.para.y, vida: 0.22 });
    c.som.noise(0.25, 0.9); c.shake(0.5); c.piscaAlvo(0.6);
    estouro(c, ["#ffe14a", "#ffffff"], 16, 130);
    await c.wait(0.3);
  },

  // o golpe que escreve por cima: a tela vira texto e some
  sobrescrever: async (c) => {
    c.glitch(3); c.som.glitch();
    for (let i = 0; i < 16; i++) {
      c.fx({ forma: "barra", cor: escolha(["#b455ff", "#ffffff", "#120820"]),
             x: 0, y: (i * 7) % 108, w: 240, h: rnd(3, 8), vida: rnd(0.15, 0.4) });
      c.som.tone(rnd(80, 1800), 0.02, "square", 0.35);
      await c.wait(0.035);
    }
    c.flash(0.6); c.shake(0.5); c.piscaAlvo(0.7);
    await c.wait(0.3);
  },
};

/** o impacto seco: quando o golpe não tem cena nem o tipo dele tem */
const PADRAO = PORTIPO.NORMAL;

/** A cena daquele golpe, nesta ordem: a própria dele, a da categoria (status não
 *  bate em ninguém, então não tem baque), a do tipo, e por fim a padrão. */
// ------------------------------------------------------------- O GOLPE Z
//
// Antes, o golpe mais forte do jogo usava A MESMA CENA de um lança-chamas
// qualquer: os Z caíam em `PORTIPO` como qualquer golpe do tipo deles. O que a
// tela mostrava não tinha nada a ver com o que o jogo tinha acabado de dizer.
//
// A cena Z ENVOLVE a cena do tipo em vez de trocar por outra: entra uma CARGA
// antes e um ESTRONDO depois, e no meio passa a cena do elemento, inteira. São
// vinte e cinco cristais no jogo — escrever vinte e cinco animações à mão daria
// vinte e cinco chances de uma sair pior que as outras. Assim todo Z é grande
// pelo mesmo motivo, e cada um continua parecendo o que ele é: o Z de FOGO
// queima, o de ÁGUA molha, o de PLANTA corta.
//
// A COR SAI DO TIPO, e vem pronta no palco (`c.cor`). Este arquivo não importa
// nada de propósito — ele desenha, não sabe de dados — e uma tabela de cores
// copiada pra cá seria uma segunda verdade sobre a mesma coisa.

/** A CARGA: o cristal chama, e o mundo é sugado pra dentro de quem vai bater.
 *  Os anéis FECHAM (de grande pra pequeno) porque aqui a energia está entrando,
 *  não saindo — a que sai é a do estrondo, lá embaixo. */
async function cargaZ(c, cor) {
  c.som.tone(330, 0.10, "square", 0.35);
  for (let i = 0; i < 4; i++) {
    const r = 42 - i * 9;
    c.fx({ forma: "anel", cor, r, h: 2, x: c.de.x, y: c.de.y, vida: 0.34, fade: true });
    // faíscas caindo PRA DENTRO: nascem longe e são puxadas pro bicho
    for (let k = 0; k < 5; k++) {
      const a = rnd(0, 6.3), d = rnd(30, 46);
      c.fx({ forma: "bola", cor: escolha([cor, "#ffffff"]), r: rnd(1, 2),
             x: c.de.x + Math.cos(a) * d, y: c.de.y + Math.sin(a) * d,
             vx: -Math.cos(a) * d * 3.2, vy: -Math.sin(a) * d * 3.2, vida: 0.3 });
    }
    c.som.tone(520 + i * 160, 0.05, "square", 0.4);
    await c.wait(0.09);
  }
  c.flash(0.45);
  c.som.tone(1568, 0.14, "square", 0.5);
  await c.wait(0.12);
}

/** O ESTRONDO: o que a carga juntou volta pra fora, em cima de quem apanhou. */
async function estrondoZ(c, cor) {
  c.flash(0.7); c.shake(0.5); c.piscaAlvo(0.7);
  c.som.noise(0.3, 0.8);
  c.som.tone(196, 0.28, "square", 0.55);
  // três anéis ABRINDO no alvo
  for (let i = 0; i < 3; i++) {
    c.fx({ forma: "anel", cor: i % 2 ? "#ffffff" : cor, r: 6 + i * 4, h: 3,
           x: c.para.x, y: c.para.y, vida: 0.5, cresce: 150 });
    await c.wait(0.06);
  }
  estouro(c, [cor, "#ffffff", cor], 22, 170);
  // riscos saindo em estrela
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * 6.28;
    c.fx({ forma: "risco", cor: i % 2 ? cor : "#ffffff", w: rnd(14, 26), h: 2, ang: a,
           x: c.para.x, y: c.para.y, vx: Math.cos(a) * 90, vy: Math.sin(a) * 90, vida: 0.42 });
  }
  await c.wait(0.3);
}

/** A cena de um golpe Z: carga, a cena do elemento, estrondo. */
const cenaZ = (mv) => async (c) => {
  const cor = c.cor || "#ffe14a";
  await cargaZ(c, cor);
  await (PORTIPO[mv?.type] || PADRAO)(c);
  await estrondoZ(c, cor);
};

export function cenaDoGolpe(id, mv) {
  // O Z VEM ANTES DE TUDO, inclusive de `PORGOLPE`: um golpe Z que caísse na
  // cena do golpe comum de mesmo nome perderia justamente o que o torna Z.
  if (mv?.z) return cenaZ(mv);
  if (PORGOLPE[id]) return PORGOLPE[id];
  // GLITCH fica de fora: a cena dele já é toda de tela, sem baque nenhum, e
  // RUÍDO BRANCO sem as faixas deixaria de parecer o que ele é.
  if (mv?.category === "status" && mv.type !== "GLITCH") {
    return mv.stat?.target === "foe" ? PORCATEGORIA.alvo : PORCATEGORIA.proprio;
  }
  return PORTIPO[mv?.type] || PADRAO;
}

export { PORTIPO, PORGOLPE, PORCATEGORIA };
