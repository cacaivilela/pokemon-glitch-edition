// OS GRITOS: cada Pokémon tem o seu, e ele tem a ver com o bicho — é a
// onomatopeia dele tocada pelo chip de som. O BANTEVY faz "TÍTÍWILL!": dois
// piados agudos e curtos e um trinado que desce.
//
//   bantevy: { som: "TÍTÍWILL!", s: [
//     [2200, 2600, 70, "f"],          // TÍ
//     [0, 0, 30, "_"],
//     [2200, 2600, 70, "f"],          // TÍ
//     [1800, 1100, 260, "p", 22],     // WILL! (descendo, tremido)
//   ] },
//
// `som` é como se escreve (aparece na POKÉDEX); `s` são as sílabas, cada uma
// [f0, f1, ms, onda, vibrato, ruído] — o formato completo está em
// Audio2.grito (src/core/audio.js). Quem toca é src/systems/gritos.js; bicho
// sem grito escrito ganha um tirado do nome, e a FUSÃO junta a cabeça de um
// com o fim do outro.
//
// As cinco partes foram escritas em paralelo, cada uma com linhas evolutivas
// inteiras (a evolução soa como o mesmo bicho, mais grave e mais forte).
// Conferir com: node tools/checa_gritos.mjs
import { GRITOS as P1 } from "./gritos/parte1.js";
import { GRITOS as P2 } from "./gritos/parte2.js";
import { GRITOS as P3 } from "./gritos/parte3.js";
import { GRITOS as P4 } from "./gritos/parte4.js";
import { GRITOS as P5 } from "./gritos/parte5.js";
import { GRITOS as P6 } from "./gritos/parte6.js";

export const GRITOS = { ...P1, ...P2, ...P3, ...P4, ...P5, ...P6 };
// as cores do PARASECTROM (src/data/secretas.js) gritam como ele
GRITOS.parasectromazul = GRITOS.parasectromamarelo = GRITOS.parasectrom;
