// OS SELVAGENS 3D (pedido do CAIO, nov/2026: o WAILORD que ele fez na galeria
// do 3D INSTALLER, "selvagem no mar"). Um bicho de modelo 3D de verdade
// (src/core/modelo3d.js) nadando solto no mar de um mapa; encostou nele, é luta.
// Ganhou, perdeu ou fugiu, ele some até o dia seguinte (st.flags["selv3d_<id>"] = o dia).
export const SELVAGENS_3D = [
  {
    id: "wailord_mar", especie: "wailord", nivel: 40,
    mapa: "route21_north",
    modelo: "assets/modelos/wailord.glb",
    // GIGANTE (ele pediu: "isso não é gigante"): 11 tiles de ponta a ponta,
    // quase a tela inteira de largura
    comprimento: 176,
    // o RABO balança pra cima e pra baixo (as peças "Rabo" e "Ponta do rabo"
    // do modelo; o pivô é onde o rabo sai do corpo)
    mexe: { pecas: /^(Rabo|Ponta do rabo)/, pivo: [1.25, 0.95, 0], eixo: "z", amplitude: 0.32, vel: 2.2 },
    velocidade: 0.9,          // tiles por segundo, nadando à toa
    encosta: 4.5,             // tiles: mais perto que isto do meio dele, começa a luta
    aviso: "UM WAILORD GIGANTE ESTÁ NADANDO POR AQUI!",
  },
];
