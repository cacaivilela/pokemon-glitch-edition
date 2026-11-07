// O CAMINHÃO DO MEW (pedido do CAIO, nov/2026: "faz aquele mito do
// red/blue/green ser real... se empurrar o mew truck sai um mew"). O caminhão
// velho no cais do S.S. ANNE, em VERMILION: com FORÇA você empurra, e embaixo
// dele estava um MEW. Desenho de lado, 32x19, PIXEL POR PIXEL.
import { spriteFromRows } from "./assets.js";

// no fim do cais, à direita do navio, colado na água — onde ele ficava no RED/BLUE
export const CAMINHAO = { mapa: "vermilion_city", x: 36, y: 30, largura: 2 };

const LINHAS = [
  "........kkkkkkkkkkkkkkkkkkkkkkkk",
  "........kWWWWWWWWWWWWWWWWWWWWWWk",
  "........kWwwwwwwwwwwwwwwwwwwwwWk",
  ".kkkkkk.kWwwwwwrwwwwwwwwwwwwwwWk",
  "kBBBBBBkkWwwwwrrwwwwwwwwwwwrwwWk",
  "kBccccBBkWwwwwwwwwwwwwwwwwrrwwWk",
  "kBcCccBBkWwwwwwwwwwwwwwwwwwwwwWk",
  "kBccccBBkWwwwwwwwwwwwwwwwwwwwwWk",
  "kBBBBBBBkWwwwwwwwwwwwrwwwwwwwwWk",
  "kBBBBBBBkWwwwwwwwwwwrrwwwwwwwwWk",
  "kBBBBBBBkWWWWWWWWWWWWWWWWWWWWWWk",
  "kbbbbbbbkkkkkkkkkkkkkkkkkkkkkkkk",
  "kbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbk",
  "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
  "..kkkkkk..............kkkkkk....",
  ".kkggggkk............kkggggkk...",
  ".kkgkkgkk............kkgkkgkk...",
  ".kkggggkk............kkggggkk...",
  "..kkkkkk..............kkkkkk....",
];
const CORES = { k: "#202028", W: "#f0f0f0", w: "#d0d0d8", r: "#a06838", B: "#3858c8", c: "#a0e0f8", C: "#ffffff", b: "#283880", g: "#808088" };
let img = null;
export const desenhoCaminhao = () => (img ||= spriteFromRows(LINHAS, CORES));
