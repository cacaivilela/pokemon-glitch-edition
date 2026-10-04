// Confere um arquivo de LUGARES NOVOS de Braglitch (o formato está em
// dev/LUGARES.md). Roda sem navegador:
//
//     gjs -m dev/checalugares.js src/data/braglitch-sul.js
//
// Olha: largura 30, caracteres conhecidos, as saídas declaradas na borda,
// dá pra andar de toda saída até toda outra e até toda porta, placa com
// chão do lado, prédio em retângulo com a porta embaixo, Centro e loja com
// uma porta só, NPC em chão, e as espécies do mato e dos treinadores existem.
import GLib from "gi://GLib";

const RAIZ = GLib.get_current_dir();
const arquivo = ARGV[0];
if (!arquivo) { print("uso: gjs -m dev/checalugares.js src/data/<arquivo>.js"); imports.system?.exit?.(1); }

const { LUGARES } = await import(`file://${RAIZ}/${arquivo}`);
const brag = await import(`file://${RAIZ}/src/data/braglitch.js`);
const mais = await import(`file://${RAIZ}/src/data/mais.js`);
const gen1 = await import(`file://${RAIZ}/src/data/gen1.js`);
// as regionais e as evoluções delas (ZIGZAGOON, LINOONE...) moram em regionais.js
const regionais = await import(`file://${RAIZ}/src/data/regionais.js`);
const ESPECIES = new Set([...Object.keys(brag.BRAGLITCH_ESPECIES), ...Object.keys(mais.MAIS), ...Object.keys(gen1.GEN1),
                          ...Object.keys(regionais.REGIONAIS), ...Object.keys(regionais.EVO_REGIONAIS)]);

const CONHECIDOS = "#.,P~=aFYoBHhLCMIKGDRvea123456789";
const ANDA = ".,PFDa=e";                  // onde se pisa (D é a porta: pisa e entra)
const PREDIO = "HhLCMIKG";
let erros = 0, avisos = 0;
const erro = (id, t) => { erros++; print(`  ERRO   [${id}] ${t}`); };
const aviso = (id, t) => { avisos++; print(`  aviso  [${id}] ${t}`); };

if (!Array.isArray(LUGARES)) { print("ERRO: o arquivo não exporta LUGARES (array)"); } else for (const L of LUGARES) {
  const id = L.id || "?";
  print(`${id} — ${L.nome} (${L.tipo})`);
  if (!/^[a-z0-9_]+$/.test(id)) erro(id, "id tem que ser só minúscula, número e _");
  if (!["cidade", "rota", "praia"].includes(L.tipo)) erro(id, `tipo "${L.tipo}" (cidade, rota ou praia)`);
  const P = L.planta || [];
  const H = P.length, W = 30;
  if (H < 16 || H > 60) erro(id, `altura ${H} (entre 16 e 60)`);
  P.forEach((l, y) => {
    if (l.length !== W) erro(id, `linha ${y} tem ${l.length} de largura (tem que ser 30)`);
    for (const c of l) if (!CONHECIDOS.includes(c)) erro(id, `linha ${y}: caractere desconhecido "${c}"`);
  });
  const at = (x, y) => P[y]?.[x] ?? "#";
  // as saídas
  const S = L.saidas || {};
  const pontas = [];
  for (const [dir, v] of Object.entries(S)) {
    const cel = dir === "up" ? [[v, 0], [v + 1, 0]] : dir === "down" ? [[v, H - 1], [v + 1, H - 1]]
      : dir === "left" ? [[0, v], [0, v + 1]] : dir === "right" ? [[W - 1, v], [W - 1, v + 1]] : null;
    if (!cel) { erro(id, `saída "${dir}" não existe (up, down, left, right)`); continue; }
    for (const [x, y] of cel) if (at(x, y) !== "P") erro(id, `saída ${dir}: (${x},${y}) tinha que ser P e é "${at(x, y)}"`);
    pontas.push({ nome: `saída ${dir}`, x: cel[0][0], y: cel[0][1] });
  }
  // lugar sem estrada (a PRAIA DO LARVANJAL, que só tem o BONDINHO): o ponto
  // onde se chega conta como ponta
  if (L.chegada) {
    if (!ANDA.includes(at(L.chegada.x, L.chegada.y))) erro(id, `chegada em (${L.chegada.x},${L.chegada.y}) não é chão`);
    pontas.push({ nome: "a chegada", x: L.chegada.x, y: L.chegada.y });
  }
  if (!pontas.length) erro(id, "nenhuma saída declarada");
  // bordas sem saída não podem deixar o jogador sair andando pro nada
  for (let x = 0; x < W; x++) for (const y of [0, H - 1]) {
    const dir = y === 0 ? "up" : "down";
    if (ANDA.includes(at(x, y)) && !(S[dir] !== undefined && (x === S[dir] || x === S[dir] + 1))) aviso(id, `borda ${dir} tem chão em (${x},${y}) sem ser saída`);
  }
  for (let y = 0; y < H; y++) for (const x of [0, W - 1]) {
    const dir = x === 0 ? "left" : "right";
    if (ANDA.includes(at(x, y)) && !(S[dir] !== undefined && (y === S[dir] || y === S[dir] + 1))) aviso(id, `borda ${dir} tem chão em (${x},${y}) sem ser saída`);
  }
  // os prédios: retângulo, e porta embaixo
  const visto = new Set();
  const portasDe = {};
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const c = at(x, y);
    if (!PREDIO.includes(c) || visto.has(`${x},${y}`)) continue;
    let x1 = x, y1 = y;
    while (at(x1 + 1, y) === c) x1++;
    while (at(x, y1 + 1) === c) y1++;
    for (let yy = y; yy <= y1; yy++) for (let xx = x; xx <= x1; xx++) {
      if (at(xx, yy) !== c) erro(id, `prédio "${c}" em (${x},${y}) não é retângulo`);
      visto.add(`${xx},${yy}`);
    }
    const portas = [];
    for (let xx = x; xx <= x1; xx++) if (at(xx, y1 + 1) === "D") portas.push(xx);
    (portasDe[c] ||= []).push(portas.length);
    if ("CM".includes(c) && portas.length !== 1) erro(id, `${c === "C" ? "Centro" : "loja"} tem ${portas.length} portas (tem que ser 1)`);
  }
  for (const c of "CM") if ((portasDe[c] || []).length > 1) erro(id, `mais de um ${c === "C" ? "Centro" : "loja"} no mapa`);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (at(x, y) === "D" && !PREDIO.includes(at(x, y - 1))) erro(id, `porta D em (${x},${y}) sem prédio logo em cima`);
  }
  // andar: de uma saída pra todo lado
  const alcanca = new Set();
  if (pontas.length) {
    const fila = [[pontas[0].x, pontas[0].y]];
    alcanca.add(`${pontas[0].x},${pontas[0].y}`);
    while (fila.length) {
      const [x, y] = fila.pop();
      if (at(x, y) === "D") continue;          // entrou na porta: não atravessa
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy, k = `${nx},${ny}`;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H || alcanca.has(k)) continue;
        const c = at(nx, ny);
        if (c === "v" && dy !== 1) continue;    // barranco só se pula pra baixo
        if (!ANDA.includes(c) && c !== "v") continue;
        alcanca.add(k);
        fila.push([nx, ny]);
      }
    }
    for (const p of pontas.slice(1)) if (!alcanca.has(`${p.x},${p.y}`)) erro(id, `não dá pra andar de ${pontas[0].nome} até ${p.nome}`);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (at(x, y) === "D" && !alcanca.has(`${x},${y}`)) erro(id, `a porta em (${x},${y}) não é alcançável`);
      if (/[1-9]/.test(at(x, y)) && ![[0, 1], [0, -1], [1, 0], [-1, 0]].some(([dx, dy]) => alcanca.has(`${x + dx},${y + dy}`)))
        erro(id, `a placa em (${x},${y}) não tem chão alcançável do lado`);
    }
  }
  // NPCs
  for (const n of L.npcs || []) {
    const c = at(n.x, n.y);
    if (!".,Fa".includes(c)) erro(id, `NPC ${n.id} em (${n.x},${n.y}) está em "${c}" (tem que ser chão: . , F a)`);
    else if (!alcanca.has(`${n.x},${n.y}`)) erro(id, `NPC ${n.id} em (${n.x},${n.y}) não é alcançável`);
    for (const m of n.trainer?.party || []) if (!ESPECIES.has(m.id)) erro(id, `NPC ${n.id}: espécie "${m.id}" não existe`);
  }
  // placas com texto
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const c = at(x, y);
    if (/[1-9]/.test(c) && !L.placas?.[c]) aviso(id, `placa ${c} em (${x},${y}) sem texto em "placas"`);
  }
  // o mato
  for (const [sp] of L.mato || []) if (!ESPECIES.has(sp)) erro(id, `mato: espécie "${sp}" não existe`);
  if ((L.mato || []).length && !P.some((l) => l.includes(","))) aviso(id, "tem mato na tabela mas nenhum , (mato alto) na planta");
  if (P.some((l) => l.includes(",")) && !(L.mato || []).length) erro(id, "tem mato alto (,) mas a tabela `mato` está vazia");
  if ((L.mato || []).length && !(Array.isArray(L.niveis) && L.niveis.length === 2)) erro(id, "falta `niveis: [min, max]`");
}
print(`\n${erros} erro(s), ${avisos} aviso(s)`);
