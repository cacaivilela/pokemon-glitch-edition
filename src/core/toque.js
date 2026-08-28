// OS BOTÕES DE TELA, pra jogar no celular.
//
// O jogo cabe em oito botões, e no computador eles são teclas. No celular não
// há teclas — então eles viram peças de HTML por cima da página, e entram no
// MESMO lugar que o teclado entra (`Toque`, em src/core/input.js). Nenhuma cena
// do jogo sabe da diferença.
//
// POR QUE HTML E NÃO DESENHO NO CANVAS: a tela do jogo tem 240x160 e é esticada
// em pixel inteiro pra não borrar. Botão desenhado ali dentro seria minúsculo
// num celular e ficaria refém dessa escala. Em HTML ele tem o tamanho do dedo
// de quem joga, e não o tamanho do pixel do GameBoy.
//
// O D-PAD ESCORREGA: o dedo entra no "pra cima" e desliza pro "pra esquerda"
// sem levantar, como num controle de verdade. É por isso que a direção sai da
// POSIÇÃO do dedo dentro da cruz, e não de qual peça recebeu o toque — quem vai
// jogar tem nove anos e não vai levantar o dedo pra virar a esquina.
import { Toque } from "./input.js";

/** Pra onde anda um dedo parado em (x, y) dentro da cruz, medido do CENTRO e
 *  em fração do tamanho dela (-0.5 a 0.5).
 *
 *  Fica solta e sem depender de tela nenhuma pra poder ser testada: é a única
 *  parte do arquivo que tem uma resposta CERTA e uma ERRADA. O resto é evento
 *  de navegador.
 *
 *  A ZONA MORTA do meio existe porque o polegar pousa no centro antes de
 *  escolher pra onde ir — sem ela, encostar já andava. */
export function direcaoNaCruz(x, y) {
  if (Math.hypot(x, y) < 0.14) return null;
  return Math.abs(x) > Math.abs(y) ? (x > 0 ? "right" : "left")
                                   : (y > 0 ? "down" : "up");
}

/** É um aparelho de dedo? Aponta grosso (dedo) e tela de toque. */
export const ehCelular = () =>
  matchMedia("(pointer: coarse)").matches && navigator.maxTouchPoints > 0;

/** Os botões de baixo: o que o jogo tem além de mover, confirmar e voltar. */
const EXTRAS = [
  ["run", "CORRER"],
  ["select", "MEGA"],
  ["z", "Z"],
  ["ceu", "CÉU"],
];

const CSS = `
#toque { position:fixed; inset:auto 0 0 0; z-index:8;
  display:flex; flex-direction:column; gap:10px;
  padding:8px 12px calc(10px + env(safe-area-inset-bottom));
  touch-action:none; user-select:none; -webkit-user-select:none; }
#linha { display:flex; align-items:flex-end; justify-content:space-between; gap:10px; }
#toque, #toque * { -webkit-tap-highlight-color:transparent; }
/* botão de verdade traz estilo de sistema junto; aqui ele é só uma peça */
#toque button { -webkit-appearance:none; appearance:none; margin:0; cursor:pointer; }
#cruz { position:relative; width:150px; height:150px; flex:none; }
#cruz i { position:absolute; display:block; background:#222833; border:2px solid #39414f;
  border-radius:9px; box-shadow:0 2px 0 #11151c; }
#cruz .cima  { left:50px; top:0;    width:50px; height:50px; }
#cruz .baixo { left:50px; top:100px;width:50px; height:50px; }
#cruz .esq   { left:0;    top:50px; width:50px; height:50px; }
#cruz .dir   { left:100px;top:50px; width:50px; height:50px; }
#cruz .meio  { left:50px; top:50px; width:50px; height:50px; border-radius:0; }
#cruz i.on { background:#4a5568; border-color:#6b7a90; }
#acoes { display:flex; align-items:center; gap:14px; flex:none; }
#acoes button { width:72px; height:72px; border-radius:50%; background:#2a2030;
  border:2px solid #4a3a58; box-shadow:0 3px 0 #150f1b;
  display:flex; align-items:center; justify-content:center;
  font:700 22px ui-monospace,monospace; color:#c9a7ff; }
#acoes button.on { background:#4a3a58; transform:translateY(2px); box-shadow:0 1px 0 #150f1b; }
/* Fileira DENTRO do controle, não flutuando: solto por cima da tela, o botão
   tapava justamente o cenário que a pessoa precisa ver pra decidir apertá-lo. */
#extras { display:flex; justify-content:center; gap:8px; }
#extras button { text-decoration:none; padding:7px 11px; border-radius:8px; background:#1b2029;
  border:1px solid #333c49; font:600 11px ui-monospace,monospace; color:#7f8b9c; text-align:center; }
#extras button.on { background:#333c49; color:#dfe6ef; }
/* Deitado sobra pouca altura: a cruz e os botões encolhem pra tela do jogo não
   virar uma tira. */
@media (orientation: landscape) {
  #cruz { width:120px; height:120px; }
  #cruz .cima{left:40px;top:0;width:40px;height:40px}
  #cruz .baixo{left:40px;top:80px;width:40px;height:40px}
  #cruz .esq{left:0;top:40px;width:40px;height:40px}
  #cruz .dir{left:80px;top:40px;width:40px;height:40px}
  #cruz .meio{left:40px;top:40px;width:40px;height:40px}
  #acoes button { width:60px; height:60px; font-size:19px; }
  #toque { padding-top:4px; gap:6px; }
}
`;

/** Altura que os controles ocupam — o `resize` do jogo desconta isto. */
export const alturaDosBotoes = () =>
  document.getElementById("toque") ? document.getElementById("toque").offsetHeight + 12 : 0;

export function ligarToque() {
  if (document.getElementById("toque")) return;
  const est = document.createElement("style");
  est.textContent = CSS;
  document.head.appendChild(est);

  const pad = document.createElement("div");
  pad.id = "toque";
  pad.innerHTML =
    '<div id="extras">' + EXTRAS.map(([b, t]) => `<button type="button" data-b="${b}">${t}</button>`).join("") + '</div>' +
    '<div id="linha">' +
      '<div id="cruz"><i class="cima"></i><i class="esq"></i><i class="meio"></i>' +
      '<i class="dir"></i><i class="baixo"></i></div>' +
      '<div id="acoes"><button type="button" data-b="b">B</button>'
      + '<button type="button" data-b="a">A</button></div>' +
    '</div>';
  document.body.appendChild(pad);

  ligarCruz(document.getElementById("cruz"));
  for (const el of document.querySelectorAll("#toque button")) ligarBotao(el);

  // dedo que sai da tela, aba que perde o foco: solta tudo. Um botão que fica
  // preso apertado faz o personagem andar sozinho pra sempre.
  addEventListener("blur", () => Toque.soltaTudo());
  addEventListener("visibilitychange", () => { if (document.hidden) Toque.soltaTudo(); });
}

/** Um botão simples: aperta enquanto o dedo está nele. */
function ligarBotao(el) {
  const b = el.dataset.b;
  const liga = (e) => {
    e.preventDefault();
    el.classList.add("on");
    Toque.aperta(b);
    el.setPointerCapture?.(e.pointerId);
  };
  const desliga = (e) => {
    e.preventDefault();
    el.classList.remove("on");
    Toque.solta(b);
  };
  el.addEventListener("pointerdown", liga);
  el.addEventListener("pointerup", desliga);
  el.addEventListener("pointercancel", desliga);
}

/** A cruz direcional, com deslize: a direção sai de ONDE o dedo está. */
function ligarCruz(cruz) {
  const pecas = {
    up: cruz.querySelector(".cima"), down: cruz.querySelector(".baixo"),
    left: cruz.querySelector(".esq"), right: cruz.querySelector(".dir"),
  };
  let dedo = null;

  const direcaoEm = (e) => {
    const r = cruz.getBoundingClientRect();
    return direcaoNaCruz((e.clientX - r.left) / r.width - 0.5,
                         (e.clientY - r.top) / r.height - 0.5);
  };
  const aplicar = (novo) => {
    for (const [d, el] of Object.entries(pecas)) {
      if (d === novo) { el.classList.add("on"); Toque.aperta(d); }
      else { el.classList.remove("on"); Toque.solta(d); }
    }
  };

  cruz.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    dedo = e.pointerId;
    cruz.setPointerCapture?.(e.pointerId);
    aplicar(direcaoEm(e));
  });
  cruz.addEventListener("pointermove", (e) => {
    if (e.pointerId !== dedo) return;
    e.preventDefault();
    aplicar(direcaoEm(e));
  });
  const larga = (e) => {
    if (e.pointerId !== dedo) return;
    e.preventDefault();
    dedo = null;
    aplicar(null);
  };
  cruz.addEventListener("pointerup", larga);
  cruz.addEventListener("pointercancel", larga);
}
