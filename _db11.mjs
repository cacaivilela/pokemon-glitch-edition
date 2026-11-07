import fs from "fs";
globalThis.window = globalThis;
globalThis.document = { createElement: () => ({ getContext: () => ({}) }) };
const mem = {}; globalThis.localStorage = { getItem: (k) => mem[k] ?? null, setItem: (k, v) => (mem[k] = v), removeItem: (k) => delete mem[k] };
globalThis.location = { search: "", protocol: "file:", href: "file:///", hostname: "" };
globalThis.fetch = async (u) => { const p = String(u).replace(/^file:\/\//, "").replace(/\?.*$/, ""); const f = p.startsWith("/") && !fs.existsSync(p) ? process.cwd() + p : p;
  const b = fs.readFileSync(f); return { ok: true, json: async () => JSON.parse(b), text: async () => b.toString(), arrayBuffer: async () => b }; };
const { DB } = await import(process.cwd() + "/src/data/index.js");
for (const id of process.argv.slice(2)) { const s = DB.SPECIES[id]; console.log(id, s.name, s.types.join("/"), s.dex, s.spriteDex || "", s.spriteUrl || "", "|", (s.dexText || "").slice(0, 90)); }
