// Confere os gritos (src/data/gritos/parte*.js).
//   node tools/checa_gritos.mjs                      -> todas as partes, só o formato
//   node tools/checa_gritos.mjs 3 lista.json         -> a parte 3 contra a lista de ids
//   node tools/checa_gritos.mjs 3 --mais             -> e exige as 3 onomatopeias de cada um
// lista.json: [[{id,...}, ...], ...] (famílias) ou [{id}, ...]
import fs from "fs";
import path from "path";

const raiz = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const exigeMais = process.argv.includes("--mais");
const [, , so, lista] = process.argv.filter((a) => a !== "--mais");
const ONDAS = new Set(["q", "p", "f", "t", "s", "o", "n", "_"]);
let erros = 0;
const erro = (m) => { erros++; if (erros <= 60) console.log("ERRO", m); };

const partes = so ? [so] : [1, 2, 3, 4, 5, 6];
const vistos = new Map();
for (const n of partes) {
  const arq = path.join(raiz, "src/data/gritos", `parte${n}.js`);
  const { GRITOS } = await import(arq + "?t=" + Date.now());
  for (const [id, g] of Object.entries(GRITOS)) {
    if (vistos.has(id)) erro(`${id} está na parte ${vistos.get(id)} e na ${n}`);
    vistos.set(id, n);
    if (typeof g?.som !== "string" || !g.som.trim()) erro(`${id}: sem "som"`);
    // AS OUTRAS DUAS onomatopeias (opcional enquanto não estão todas escritas;
    // `--mais` exige): duas, diferentes entre si e da principal, até 24 letras
    if (g?.mais !== undefined || exigeMais) {
      const m = g?.mais;
      if (!Array.isArray(m) || m.length !== 2) erro(`${id}: "mais" precisa ser uma lista de 2`);
      else {
        for (const t of m) {
          if (typeof t !== "string" || !t.trim()) erro(`${id}: "mais" com texto vazio`);
          else if (t.length > 24) erro(`${id}: "${t}" tem ${t.length} letras (máx. 24)`);
          else if (t !== t.toUpperCase()) erro(`${id}: "${t}" precisa ser em MAIÚSCULAS`);
        }
        if (new Set([g.som, ...m]).size !== 3) erro(`${id}: as três onomatopeias precisam ser diferentes`);
      }
    }
    if (!Array.isArray(g?.s) || !g.s.length) { erro(`${id}: "s" vazio`); continue; }
    if (g.s.length > 12) erro(`${id}: ${g.s.length} sílabas (máx. 12)`);
    let total = 0;
    g.s.forEach((sil, i) => {
      if (!Array.isArray(sil) || sil.length < 4 || sil.length > 6) return erro(`${id}[${i}]: precisa ser [f0, f1, ms, onda, vib?, ruído?]`);
      const [f0, f1, ms, onda, vib = 0, ruido = 0] = sil;
      if (!ONDAS.has(onda)) erro(`${id}[${i}]: onda "${onda}"`);
      if (onda !== "_" && !(f0 >= 40 && f0 <= 8000 && f1 >= 40 && f1 <= 8000)) erro(`${id}[${i}]: frequência fora de 40..8000 (${f0}, ${f1})`);
      if (!(ms >= 15 && ms <= 1200)) erro(`${id}[${i}]: ms fora de 15..1200 (${ms})`);
      if (!(vib >= 0 && vib <= 60)) erro(`${id}[${i}]: vibrato fora de 0..60`);
      if (!(ruido >= 0 && ruido <= 1)) erro(`${id}[${i}]: ruído fora de 0..1`);
      total += ms;
    });
    if (total > 2500) erro(`${id}: ${total} ms no total (máx. 2500)`);
  }
}
if (lista) {
  const ids = JSON.parse(fs.readFileSync(lista, "utf8")).flat().map((e) => e.id);
  const falta = ids.filter((id) => !vistos.has(id));
  const sobra = [...vistos.keys()].filter((id) => !ids.includes(id));
  if (falta.length) erro(`faltam ${falta.length}: ${falta.slice(0, 40).join(", ")}${falta.length > 40 ? "..." : ""}`);
  if (sobra.length) erro(`ids que não são desta lista: ${sobra.slice(0, 20).join(", ")}`);
}
console.log(`${vistos.size} gritos, ${erros} erro(s)`);
process.exit(erros ? 1 : 0);
