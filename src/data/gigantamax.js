// GIGANTAMAX (pedido do CAIO, 08/nov/2026: "era pros 2 ficarem gigantamax,
// não dynamax", com o sprite oficial). Quem tomou a SOPA MAX (`mon.gmax`,
// src/scenes/overworld.js `usarSopaMax`) e é de uma espécie desta tabela,
// quando DYNAMAXA vira a forma GIGANTAMAX: o sprite oficial, as nuvens
// douradas no lugar das vermelhas e, nos golpes do tipo dele, o GOLPE G-MAX
// próprio no lugar do GOLPE MAX. O resto é o DYNAMAX de sempre (HP dobrado,
// 3 turnos) — ver src/systems/dynamax.js.
//
// A forma é uma espécie de verdade (`<espécie>gmax`, criada na hora em
// DB.SPECIES, com os mesmos atributos da espécie), como as MEGA; ela só existe
// dentro da batalha e volta a ser a espécie de origem quando o DYNAMAX acaba.
//
// Tabela: espécie | sprite (id de FORMA da PokeAPI) | GOLPE G-MAX | tipo do golpe
// Os sprites: `python3 tools/fetch_sprites.py --only 10195,...,10227`.
const TABELA = `
venusaur    | 10195 | G-MAX VINE LASH  | PLANTA
charizard   | 10196 | G-MAX WILDFIRE   | FOGO
blastoise   | 10197 | G-MAX CANNONADE  | ÁGUA
butterfree  | 10198 | G-MAX BEFUDDLE   | INSETO
pikachu     | 10199 | G-MAX VOLT CRASH | ELÉTRICO
meowth      | 10200 | G-MAX GOLD RUSH  | NORMAL
machamp     | 10201 | G-MAX CHI STRIKE | LUTADOR
gengar      | 10202 | G-MAX TERROR     | FANTASMA
kingler     | 10203 | G-MAX FOAM BURST | ÁGUA
lapras      | 10204 | G-MAX RESONANCE  | GELO
eevee       | 10205 | G-MAX CUDDLE     | NORMAL
snorlax     | 10206 | G-MAX REPLENISH  | NORMAL
garbodor    | 10207 | G-MAX MALODOR    | VENENO
melmetal    | 10208 | G-MAX MELTDOWN   | AÇO
rillaboom   | 10209 | G-MAX DRUM SOLO  | PLANTA
cinderace   | 10210 | G-MAX FIREBALL   | FOGO
inteleon    | 10211 | G-MAX HYDROSNIPE | ÁGUA
corviknight | 10212 | G-MAX WIND RAGE  | VOADOR
orbeetle    | 10213 | G-MAX GRAVITAS   | PSÍQUICO
drednaw     | 10214 | G-MAX STONESURGE | ÁGUA
coalossal   | 10215 | G-MAX VOLCALITH  | PEDRA
flapple     | 10216 | G-MAX TARTNESS   | PLANTA
appletun    | 10217 | G-MAX SWEETNESS  | PLANTA
sandaconda  | 10218 | G-MAX SANDBLAST  | TERRA
toxtricity  | 10219 | G-MAX STUN SHOCK | ELÉTRICO
centiskorch | 10220 | G-MAX CENTIFERNO | FOGO
hatterene   | 10221 | G-MAX SMITE      | FADA
grimmsnarl  | 10222 | G-MAX SNOOZE     | SOMBRIO
alcremie    | 10223 | G-MAX FINALE     | FADA
copperajah  | 10224 | G-MAX STEELSURGE | AÇO
duraludon   | 10225 | G-MAX DEPLETION  | DRAGÃO
urshifu     | 10226 | G-MAX ONE BLOW   | SOMBRIO
`;

/** { espécie: { sprite, golpe, tipo } } */
export const GIGANTAMAX = {};
for (const linha of TABELA.trim().split("\n")) {
  const [especie, sprite, golpe, tipo] = linha.split("|").map((s) => s.trim());
  GIGANTAMAX[especie] = { sprite: +sprite, golpe, tipo };
}
