// Confere uma região criada (o formato do REGIOMAKER, src/data/regioes.js)
// montando ela no node, contra o banco de dados de verdade do jogo.
//   node dev/regioescheck.mjs                      -> a região de exemplo (dev/regiao-exemplo.json)
//   node dev/regioescheck.mjs minha.json           -> outra
// Diz quantos mapas e espécies saíram e acusa: warp ou ligação pra mapa que
// não existe, chegada/NPC em cima de parede, time vazio, campeão sem trava.
import fs from "fs";
import path from "path";

const raiz = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
// o jogo espera um navegador: o mínimo pra src/data/index.js carregar no node
globalThis.window = globalThis;
globalThis.document = { createElement: () => ({ getContext: () => ({}) }) };
const mem = {};
globalThis.localStorage = { getItem: (k) => mem[k] ?? null, setItem: (k, v) => { mem[k] = String(v); }, removeItem: (k) => { delete mem[k]; } };
globalThis.location = { search: "", protocol: "file:", href: "file:///x", pathname: "/" };
globalThis.fetch = async (u) => {
  const p = String(u).replace(/^file:\/\//, "").replace(/\?.*$/, "");
  const arq = fs.existsSync(p) ? p : path.join(raiz, p.replace(/^\//, ""));
  try { const t = fs.readFileSync(arq, "utf8"); return { ok: true, json: async () => JSON.parse(t), text: async () => t }; }
  catch { return { ok: false, json: async () => null, text: async () => "" }; }
};
const { DB } = await import(path.join(raiz, "src/data/index.js"));
const { montarRegioesCriadas } = await import(path.join(raiz, "src/data/regioes.js"));

const arq = process.argv[2] || path.join(raiz, "dev/regiao-exemplo.json");
const R = JSON.parse(fs.readFileSync(arq, "utf8"));
const kanto = JSON.parse(fs.readFileSync(path.join(raiz, "assets/maps/kanto.json"), "utf8"));
const rc = montarRegioesCriadas(kanto, { [R.id]: R }, {
  especie: (id) => !!DB.SPECIES[id] && !DB.SPECIES[id].megaDe && !DB.SPECIES[id].unicaDe && !DB.SPECIES[id].regiaoCriada,
  golpe: (id) => !!DB.MOVES[id], tipo: (t) => !!DB.TYPE_COLOR[t],
});
let erros = 0;
const erro = (m) => { erros++; console.log("ERRO", m); };
const meta = rc.lista[0];
if (!meta) { console.log("ERRO a região não montou"); process.exit(1); }
console.log(`${meta.nome} (${meta.id}): ${meta.mapas.length} mapas, ${meta.especies.length} espécies, ${meta.insignias.length} insígnias, início ${meta.inicio}`);
const anda = (geo, x, y) => { const t = geo.tags.charCodeAt(y * geo.w + x) - 48; return t === 0 || t === 2; };
for (const [id, geo] of Object.entries(rc.geos)) {
  const c = rc.conteudo[id];
  if (!c) erro(`${id}: sem conteúdo`);
  for (const w of geo.warps || []) if (w.to && !rc.geos[w.to]) erro(`${id}: porta (${w.x},${w.y}) pra ${w.to}, que não existe`);
  for (const l of geo.connections || []) if (!rc.geos[l.to]) erro(`${id}: ligação ${l.dir} pra ${l.to}, que não existe`);
  if (geo.planta) {
    if (c?.spawn && !anda(geo, c.spawn.x, c.spawn.y)) erro(`${id}: chegada (${c.spawn.x},${c.spawn.y}) em cima de parede`);
    for (const n of c?.npcs || []) if (!anda(geo, n.x, n.y)) erro(`${id}: ${n.id} em (${n.x},${n.y}), em cima de parede`);
  }
  for (const n of c?.npcs || []) {
    if (n.trainer && !n.trainer.party.length) erro(`${id}: ${n.id} com time vazio`);
    for (const m of n.trainer?.party || []) if (!DB.SPECIES[m.id] && !rc.especies[m.id]) erro(`${id}: ${n.id} tem ${m.id}, que não existe`);
  }
  const pessoas = (c?.npcs || []).map((n) => n.id + (n.trainer ? `[${n.trainer.party.map((m) => `${m.id}:${m.lvl}`).join(",")}]` : "")).join(" ");
  console.log(`  ${id} ${geo.w}x${geo.h} portas:${(geo.warps || []).filter((w) => w.to).length} ligações:${(geo.connections || []).map((l) => l.dir + "→" + l.to).join(",") || "-"} | ${pessoas}`);
}
const camp = Object.values(rc.conteudo).flatMap((c) => c.npcs || []).find((n) => n.campeaoDe);
if (R.campeao && !camp) erro("o campeão não entrou");
if (camp && meta.insignias.length && !camp.requerFlags?.length) erro("o campeão está sem trava de insígnias");
for (const [id, sp] of Object.entries(rc.especies)) {
  console.log(`  ${id}: ${sp.name} ${sp.types.join("/")} BST ${sp.bst} golpes ${(sp.learnset || []).map((g) => g[1]).join(",")} evolui ${JSON.stringify(rc.evolucoes[id] || null)}`);
}
console.log(`${erros} erro(s)`);
process.exit(erros ? 1 : 0);
