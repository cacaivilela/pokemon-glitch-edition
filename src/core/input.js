// Teclado -> botoes estilo GBA.
const MAP = {
  ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
  KeyW: "up", KeyS: "down", KeyA: "left", KeyD: "right",
  KeyZ: "a", Enter: "a", Space: "a",
  KeyX: "b", Backspace: "b", Escape: "b",
  ShiftLeft: "run", ShiftRight: "run",
  KeyF: "debug", KeyG: "glitch", KeyM: "mute", KeyC: "select",
};

const down = new Set();
const pressed = new Set();
const released = new Set();

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

export const Input = {
  held: (b) => down.has(b),
  pressed: (b) => pressed.has(b),
  released: (b) => released.has(b),
  /** Consome o "pressed" pra evitar o mesmo input em duas cenas. */
  consume: (b) => { const had = pressed.has(b); pressed.delete(b); return had; },
  dir() {
    if (down.has("up")) return "up";
    if (down.has("down")) return "down";
    if (down.has("left")) return "left";
    if (down.has("right")) return "right";
    return null;
  },
  endFrame() { pressed.clear(); released.clear(); },
};

export function initInput(target = window) {
  target.addEventListener("keydown", (e) => {
    if (digitando) {                 // digitando: o teclado é texto, não botão
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      e.preventDefault();
      down.clear(); pressed.clear();
      return tecla(e);
    }
    const b = MAP[e.code];
    if (!b) return;
    e.preventDefault();
    if (!down.has(b)) pressed.add(b);
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
