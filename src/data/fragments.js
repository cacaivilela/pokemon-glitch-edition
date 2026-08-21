// Pontos de spawn dos fragmentos de portal.
//
// Regra: ao entrar num mapa, o jogo junta os pontos fixos daqui com os tiles
// ao lado de cada PLACA do mapa. Cada ponto sorteia pela chance atual; o
// primeiro que passar recebe o fragmento (só existe um por vez).
// Se o mapa não tiver nenhum ponto, cai no sorteio livre, bem mais raro.
//
// A chance NÃO é fixa: ela sobe SPOT_STEP a cada mapa em que você entra, então
// quanto mais tempo sem achar fragmento, mais fácil fica. Ao chegar em 100% o
// fragmento é garantido — e, assim que ele aparece nessa condição, a chance
// despenca pra SPOT_RESET e começa a subir tudo de novo.
export const SPOT_CHANCE = 0.5;      // chance inicial por ponto
export const SPOT_STEP = 0.07;       // quanto sobe por mapa visitado
export const SPOT_RESET = 0.49;      // pra onde cai depois do fragmento garantido
export const NEAR_SIGNS = true;      // usar os tiles ao lado das placas
export const FALLBACK_CHANCE = 0.08; // mapas sem ponto nenhum (o garantido vale aqui também)

/** pontos fixos, escritos à mão (x,y em tiles) */
export const FRAGMENT_SPOTS = {
  route2: [{ x: 15, y: 12 }, { x: 8, y: 73 }, { x: 12, y: 40 }],
  route1: [{ x: 10, y: 31 }, { x: 12, y: 12 }],
  viridian: [{ x: 21, y: 31 }, { x: 33, y: 10 }, { x: 24, y: 1 }],
  pewter_city: [{ x: 20, y: 7 }, { x: 12, y: 16 }],
  viridian_forest: [{ x: 16, y: 20 }, { x: 30, y: 40 }, { x: 8, y: 30 }],
  cerulean_city: [{ x: 20, y: 20 }],
  mt_moon_1f: [{ x: 12, y: 12 }],
  lab: [{ x: 3, y: 5 }],

  // --- pontos espalhados pelo resto de Kanto ---
  cinnabar_island: [{ x: 20, y: 7 }],         // ilha cinnabar, na frente do ginásio
  route23: [{ x: 9, y: 5 }],                  // entrada da liga pokémon
  saffron_city: [{ x: 43, y: 13 }],           // perto do 6º ginásio (saffron)
  celadon_city: [{ x: 33, y: 24 }],           // atrás do game corner
  lavender_town: [{ x: 13, y: 9 }],           // vila lavender, perto da torre
  vermilion_city: [{ x: 22, y: 30 }],         // doca de vermilion
  fuchsia_city: [{ x: 24, y: 8 }],            // entrada da zona safari
  rock_tunnel_1f: [{ x: 20, y: 20 }],         // dentro do túnel rocha
  mt_moon_b2f: [{ x: 15, y: 15 }],            // fundo do monte lua
  power_plant: [{ x: 21, y: 16 }],            // usina abandonada
};
