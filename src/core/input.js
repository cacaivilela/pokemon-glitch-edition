// Teclado -> botoes estilo GBA.
const MAP = {
  ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
  KeyW: "up", KeyS: "down", KeyA: "left", KeyD: "right",
  KeyZ: "a", Enter: "a", Space: "a",
  KeyX: "b", Backspace: "b", Escape: "b",
  ShiftLeft: "run", ShiftRight: "run",
  KeyF: "debug", KeyG: "glitch", KeyM: "mute", KeyC: "select",
  KeyQ: "z",            // arma o CRISTAL Z na batalha (o C arma a MEGA)
  KeyO: "ceu",          // olhar pro céu (D é o "direita" do WASD)
};

const down = new Set();
const pressed = new Set();
const released = new Set();
// Teclas que o mapa de botoes nao usa. O jogo inteiro cabe em 8 botoes; o
// editor de sprite (256x256, paleta, zoom, pincel) nao cabe. Elas ficam aqui,
// cruas, e so quem quiser le — o resto do jogo nunca olha.
const cruas = new Set();

// ------------------------------------------------------------------ texto
// O chat e o nome da sala precisam de teclado de verdade, e o resto do jogo
// não tem nada disso: são 8 botões. Enquanto a captura está ligada o mapa de
// botões é DESLIGADO — senão digitar "ZAS" andaria e abriria o menu junto.
// só entra o que a fonte bitmap sabe desenhar (src/core/font.js)
const OK_TEXTO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,!?'\"-_+/:;()[]*=%<>ÁÀÂÃÉÊÍÓÔÕÚÇ";
let digitando = null;

export const Texto = {
  ativo: () => !!digitando,
  /** começa a capturar. `max` corta o tamanho. */
  comeca(inicial = "", max = 24) { digitando = { buf: String(inicial).slice(0, max), max, fim: null }; },
  buf: () => digitando?.buf ?? "",
  /** null enquanto digita, "ok" no ENTER, "cancelou" no ESC. */
  estado: () => digitando?.fim ?? null,
  /** encerra e devolve o que foi digitado (ou null se cancelou) */
  termina() {
    const d = digitando;
    digitando = null;
    return d && d.fim !== "cancelou" ? d.buf : null;
  },
};

function tecla(e) {
  const d = digitando;
  if (e.key === "Enter") { d.fim = "ok"; return; }
  if (e.key === "Escape") { d.fim = "cancelou"; return; }
  if (e.key === "Backspace") { d.buf = d.buf.slice(0, -1); return; }
  const c = e.key.length === 1 ? e.key.toUpperCase() : "";
  if (c && OK_TEXTO.includes(c) && d.buf.length < d.max) d.buf += c;
}

// ------------------------------------------------------------------ mouse
// O jogo é de botão, mas o estúdio de sprite não: desenhar com seta é sofrido.
// O mouse só existe aqui — as coordenadas chegam já convertidas pros 240x160
// da tela do jogo, não importa em que tamanho o canvas está esticado.
export const Mouse = {
  x: -1, y: -1,
  dentro: false,
  botao: false,        // esquerdo segurado
  clicou: false,       // bateu neste quadro
  soltou: false,
  roda: 0,             // rolagem deste quadro (-1 pra cima, 1 pra baixo)
};

function ligaMouse(tela) {
  if (!tela) return;
  const converte = (e) => {
    const r = tela.getBoundingClientRect();
    if (!r.width || !r.height) return;
    Mouse.x = Math.floor((e.clientX - r.left) * (tela.width / r.width));
    Mouse.y = Math.floor((e.clientY - r.top) * (tela.height / r.height));
    Mouse.dentro = Mouse.x >= 0 && Mouse.y >= 0 && Mouse.x < tela.width && Mouse.y < tela.height;
  };
  tela.addEventListener("mousemove", converte);
  tela.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    converte(e);
    e.preventDefault();
    Mouse.botao = true;
    Mouse.clicou = true;
  });
  window.addEventListener("mouseup", (e) => {
    if (e.button !== 0) return;
    Mouse.botao = false;
    Mouse.soltou = true;
  });
  tela.addEventListener("mouseleave", () => { Mouse.dentro = false; Mouse.botao = false; });
  tela.addEventListener("wheel", (e) => {
    e.preventDefault();
    Mouse.roda = Math.sign(e.deltaY);
  }, { passive: false });
  tela.addEventListener("contextmenu", (e) => e.preventDefault());
}

export const Input = {
  held: (b) => down.has(b),
  pressed: (b) => pressed.has(b),
  released: (b) => released.has(b),
  /** Consome o "pressed" pra evitar o mesmo input em duas cenas. */
  consume: (b) => { const had = pressed.has(b); pressed.delete(b); return had; },
  /** Tecla crua deste quadro, pelo `code` do DOM ("KeyQ", "Digit3", "Tab"). */
  tecla: (code) => cruas.has(code),
  consomeTecla: (code) => { const had = cruas.has(code); cruas.delete(code); return had; },
  dir() {
    if (down.has("up")) return "up";
    if (down.has("down")) return "down";
    if (down.has("left")) return "left";
    if (down.has("right")) return "right";
    return null;
  },
  endFrame() {
    pressed.clear(); released.clear(); cruas.clear();
    Mouse.clicou = false; Mouse.soltou = false; Mouse.roda = 0;
  },
};

export function initInput(target = window) {
  ligaMouse(document.getElementById("screen"));
  target.addEventListener("keydown", (e) => {
    if (digitando) {                 // digitando: o teclado é texto, não botão
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      e.preventDefault();
      down.clear(); pressed.clear();
      return tecla(e);
    }
    const b = MAP[e.code];
    if (!b) {
      cruas.add(e.code);
      if (e.code === "Tab") e.preventDefault();   // senão o foco pula pra fora
      return;
    }
    e.preventDefault();
    // a tecla crua entra mesmo tendo botão: o editor de sprite usa D pra
    // limpar o desenho, e D também é "direita" no resto do jogo
    if (!down.has(b)) { pressed.add(b); cruas.add(e.code); }
    down.add(b);
  });
  target.addEventListener("keyup", (e) => {
    if (digitando) return;
    const b = MAP[e.code];
    if (!b) return;
    e.preventDefault();
    down.delete(b);
    released.add(b);
  });
  target.addEventListener("blur", () => { down.clear(); pressed.clear(); });
}
