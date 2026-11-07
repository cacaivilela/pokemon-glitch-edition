// O QUE DÁ PRA FUNDIR, tirado do jogo de verdade: carrega src/data/index.js no
// node (com um navegador de mentira em volta) e imprime, em JSON, toda espécie
// que o DECODIFICADOR aceita — a mesma conta de `especiePorTexto` em
// src/systems/fusao.js. Quem chama é tools/gera_especies.py.
//
// Antes a lista era montada lendo as tabelas uma por uma, e quem entrava por
// uma tabela nova (src/data/mais.js, Braglitch, as hackeanas...) ficava de
// fora: em out/2026 eram 471 na oficina e 1400 no jogo, e o ETERNATUS não
// aparecia. Lendo o DB, não tem tabela pra esquecer.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const RAIZ = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

globalThis.window = globalThis;
globalThis.document = { createElement: () => ({ getContext: () => ({}) }), addEventListener() {}, body: {} };
const mem = {};
globalThis.localStorage = {
  getItem: (k) => mem[k] ?? null, setItem: (k, v) => { mem[k] = String(v); }, removeItem: (k) => { delete mem[k]; },
};
Object.defineProperty(globalThis, "location", {
  value: { search: "", protocol: "file:", href: `file://${RAIZ}/index.html`, pathname: `${RAIZ}/index.html`, hostname: "" },
  configurable: true,
});
globalThis.fetch = async (u) => {
  let p = String(u).replace(/\?v=.*$/, "").replace(/^file:\/\//, "");
  if (!p.startsWith("/")) p = path.join(RAIZ, p.replace(/^\.\//, ""));
  try {
    const t = fs.readFileSync(p, "utf8");
    return { ok: true, json: async () => JSON.parse(t), text: async () => t };
  } catch {
    return { ok: false, json: async () => ({}), text: async () => "" };
  }
};
// o jogo fala bastante enquanto carrega; aqui só o JSON pode sair
console.log = console.info = console.warn = () => {};

const { DB } = await import(path.join(RAIZ, "src/data/index.js"));
const { partes } = await import(path.join(RAIZ, "src/systems/fusao.js"));

const pad3 = (n) => String(n).padStart(3, "0");
const existe = (f) => fs.existsSync(path.join(RAIZ, "assets/sprites/pokemon", `${f}.png`));

const saida = [];
for (const sp of Object.values(DB.SPECIES)) {
  if (sp.mega || sp.vinculo || partes(sp.id)) continue;
  const e = { id: sp.id, dex: sp.dex || 0, nome: sp.name, tipos: sp.types };
  // o arquivo é o que o jogo pede (findMon em src/core/sprites.js): o nº com
  // três dígitos do `spriteDex || dex`, ou o id
  const num = sp.spriteDex || sp.dex;
  const arquivo = sp.spriteUrl ? null : num && existe(pad3(num)) ? pad3(num) : existe(sp.id) ? sp.id : null;
  if (sp.spriteUrl) e.url = sp.spriteUrl;
  else if (arquivo && arquivo !== pad3(sp.dex)) e.sprite = arquivo;
  const regiao = DB.REGIAO?.[sp.id] || (/^(PIKA|RAI|PICHU) /.test(sp.name) ? "BONÉ" : null);
  if (regiao) e.regiao = regiao;
  saida.push(e);
}
process.stdout.write(JSON.stringify(saida));
