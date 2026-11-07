// OS MODELOS 3D DE VERDADE (pedido do CAIO, nov/2026: "bota esse modelo 3d no
// jogo" — o WAILORD que ele tem na galeria do 3D INSTALLER, ~/3d-installer).
// É um arquivo .glb (assets/modelos/), lido pelo three.js (src/vendor/three, só
// carregado quando um modelo aparece pela primeira vez). Cada quadro o modelo é
// desenhado PEQUENO numa tela à parte, vista de cima na diagonal como o mapa, e
// essa tela vai pro jogo sem suavizar — vira pixel, no estilo do resto.

const modelos = {};          // nome -> { objeto, raio } quando carregou; null = carregando
let T = null;                // o three.js
let palco = null;            // { renderer, cena, camera }

async function three() {
  return (T ||= await import("../vendor/three/three.module.min.js"));
}

/** começa a carregar o modelo `nome` de `url` (uma vez só). `mexe`: uma parte
 *  que BALANÇA — { pecas: /nome das peças/, pivo: [x, y, z] (onde ela gira, nas
 *  medidas do modelo), eixo: "x"|"y"|"z", amplitude (radianos), vel } */
export function pedirModelo(nome, url, mexe = null) {
  if (nome in modelos) return;
  modelos[nome] = null;
  (async () => {
    const THREE = await three();
    const { GLTFLoader } = await import("../vendor/three/GLTFLoader.js");
    const gltf = await new GLTFLoader().loadAsync(url);
    const objeto = gltf.scene;
    // A PARTE QUE MEXE (o rabo do WAILORD): as peças vão pra dentro de um pivô
    // no lugar em que elas se dobram, e é o pivô que balança
    let pivo = null;
    if (mexe) {
      objeto.updateMatrixWorld(true);
      pivo = new THREE.Group();
      pivo.position.set(...mexe.pivo);
      objeto.add(pivo);
      objeto.updateMatrixWorld(true);
      const pecas = [];
      objeto.traverse((o) => { if (o.isMesh && mexe.pecas.test(o.name || o.parent?.name || "")) pecas.push(o); });
      for (const p of pecas) pivo.attach(p);
    }
    // centraliza no chão: o meio do modelo no (0, ?, 0) e a base no y = 0
    const caixa = new THREE.Box3().setFromObject(objeto);
    const meio = caixa.getCenter(new THREE.Vector3());
    objeto.position.set(-meio.x, -caixa.min.y, -meio.z);
    const grupo = new THREE.Group();
    grupo.add(objeto);
    const tam = caixa.getSize(new THREE.Vector3());
    modelos[nome] = { objeto: grupo, comprimento: Math.max(tam.x, tam.z), altura: tam.y, pivo, mexe };
  })().catch((e) => { console.warn("[modelo3d]", nome, e); delete modelos[nome]; });
}

export const modeloPronto = (nome) => !!modelos[nome];

function prepararPalco(THREE) {
  if (palco) return palco;
  const cv = document.createElement("canvas");
  const renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: false, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  const cena = new THREE.Scene();
  cena.add(new THREE.HemisphereLight(0xffffff, 0x556677, 1.7));
  const sol = new THREE.DirectionalLight(0xffffff, 1.9);
  sol.position.set(-3, 6, 4);
  cena.add(sol);
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  palco = { cv, renderer, cena, camera, atual: null };
  return palco;
}

/** Desenha o modelo `nome` no jogo: o meio dele em (sx, sy) na tela, com
 *  `comprimento` pixels de ponta a ponta, virado `angulo` (0 = a cabeça pra
 *  esquerda, como o modelo foi feito). `boia`: sobe e desce em pixels. */
export function desenharModelo(ctx, nome, sx, sy, { comprimento = 64, angulo = 0, boia = 0, t = 0 } = {}) {
  const m = modelos[nome];
  if (!m || !T) return false;
  const P = prepararPalco(T);
  // o tamanho da tela à parte: o modelo inteiro cabe, de qualquer lado
  const L = Math.ceil(comprimento * 1.15), A = Math.ceil(comprimento * 0.9);
  if (P.cv.width !== L || P.cv.height !== A) P.renderer.setSize(L, A, false);
  if (P.atual !== m.objeto) {
    if (P.atual) P.cena.remove(P.atual);
    P.cena.add(m.objeto);
    P.atual = m.objeto;
  }
  m.objeto.rotation.y = angulo;
  if (m.pivo) m.pivo.rotation[m.mexe.eixo] = Math.sin(t * m.mexe.vel) * m.mexe.amplitude;
  // a câmera: de cima e um pouco de frente (o mapa é visto assim), em
  // perspectiva nenhuma — 1 unidade do modelo = comprimento / tamanho pixels
  const escala = m.comprimento / comprimento;      // unidades por pixel
  const cam = P.camera;
  cam.left = -L / 2 * escala; cam.right = L / 2 * escala;
  cam.top = A / 2 * escala; cam.bottom = -A / 2 * escala;
  cam.position.set(0, m.altura * 0.5 + 6, 6);
  cam.lookAt(0, m.altura * 0.3, 0);
  cam.updateProjectionMatrix();
  P.renderer.render(P.cena, cam);
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(P.cv, Math.round(sx - L / 2), Math.round(sy - A / 2 - boia));
  ctx.restore();
  return true;
}
