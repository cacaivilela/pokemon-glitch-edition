// O MUNDO — o servidor das fusões publicadas.
//
// POR QUE ELE EXISTE
// Publicar uma ficha em casa é escrever num arquivo (src/data/fusoes-feitas.js)
// e empurrar pro repositório: quem faz isso é o dev_server.py, que roda na SUA
// máquina e tem permissão no seu git. No jogo publicado (GitHub Pages) não
// existe nada disso — Pages só entrega arquivo pronto. Então quem joga pelo
// site não tinha como publicar nem receber o que os outros publicaram.
//
// Este arquivo é o lugar que faltava: um serviço minúsculo que guarda as fichas
// e devolve a lista. Duas rotas e mais nada:
//
//   GET  /fichas   -> { fichas: { "cabeca+corpo": [ficha, ...] }, total, atualizado }
//   POST /fichas   -> { chave, ficha }  publica uma
//
// (e DELETE /fichas/<chave>/<id> com o token de admin, pra tirar o que não devia
// estar lá.)
//
// COMO SUBIR (Deno Deploy, de graça, sem cartão)
//   1. https://dash.deno.com -> New Project -> ligue no repositório
//   2. aponte o "entrypoint" pra servidor/mundo.ts
//   3. em Settings -> Environment Variables, crie MUNDO_ADMIN com uma senha sua
//   4. copie a URL que ele te der e ponha em `servidor` no src/data/mundo.js
// Local, pra testar:  deno run -A --unstable-kv servidor/mundo.ts
//
// O QUE ELE RECUSA
// Tudo que não parece uma ficha: chave fora do formato, nome comprido demais,
// tipo que não existe, crescimento fora da faixa, desenho que não é PNG ou que
// passa do tamanho. Mais um limite por IP e um teto de fichas — o endereço é
// aberto pra qualquer um publicar, então ele precisa saber dizer não.

const kv = await Deno.openKv();

const TIPOS = new Set([
  "NORMAL", "LUTADOR", "VOADOR", "VENENO", "TERRA", "PEDRA", "INSETO", "FANTASMA",
  "AÇO", "FOGO", "ÁGUA", "PLANTA", "ELÉTRICO", "PSÍQUICO", "GELO", "DRAGÃO",
  "SOMBRIO", "FADA", "GLITCH",
]);
const STATS = ["hp", "atk", "def", "spa", "spd", "spe"];

const LIMITES = {
  nome: 11,
  autor: 10,
  sprite: 48 * 1024,      // o desenho é 64x64: 48 KB é folga de sobra
  lore: 200,
  fichasPorIp: 12,        // por hora
  total: 5000,            // teto do acervo inteiro
};

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Admin",
};

const json = (dado: unknown, status = 200) =>
  new Response(JSON.stringify(dado), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...cors },
  });

const erro = (motivo: string, status = 400) => json({ ok: false, erro: motivo }, status);

/** Deixa a ficha com a cara certa, ou devolve o motivo da recusa. */
function limpar(ficha: Record<string, unknown>): { ok: true; ficha: Record<string, unknown> } | { ok: false; erro: string } {
  if (!ficha || typeof ficha !== "object") return { ok: false, erro: "ficha vazia" };

  const id = String(ficha.id ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 24);
  if (!id) return { ok: false, erro: "ficha sem id" };

  const nome = String(ficha.nome ?? "").toUpperCase().slice(0, LIMITES.nome).trim();
  if (!nome) return { ok: false, erro: "ficha sem nome" };

  const tipos = (Array.isArray(ficha.tipos) ? ficha.tipos : [])
    .map((t) => String(t).toUpperCase())
    .filter((t) => TIPOS.has(t))
    .slice(0, 2);
  if (!tipos.length) return { ok: false, erro: "tipo que não existe" };

  const numeros = (fonte: unknown, min: number, max: number) => {
    const cru = (fonte ?? {}) as Record<string, unknown>;
    const out: Record<string, number> = {};
    for (const k of STATS) {
      const v = Number(cru[k]);
      if (Number.isFinite(v)) out[k] = Math.max(min, Math.min(max, Math.round(v * 10) / 10));
    }
    return out;
  };

  const sprite = typeof ficha.sprite === "string" ? ficha.sprite : "";
  if (sprite) {
    if (!sprite.startsWith("data:image/png;base64,")) return { ok: false, erro: "o desenho não é PNG" };
    if (sprite.length > LIMITES.sprite) return { ok: false, erro: "o desenho é grande demais" };
  }

  return {
    ok: true,
    ficha: {
      id,
      nome,
      autor: String(ficha.autor ?? "").toUpperCase().slice(0, LIMITES.autor),
      tipos,
      inicial: numeros(ficha.inicial, 0, 200),
      crescimento: numeros(ficha.crescimento, 0, 9),
      ...(sprite ? { sprite } : {}),
      ...(ficha.lore ? { lore: String(ficha.lore).slice(0, LIMITES.lore) } : {}),
      em: new Date().toISOString().slice(0, 10),
    },
  };
}

/** Quantas fichas aquele IP publicou na última hora. */
async function passouDoLimite(ip: string) {
  const chave = ["ip", ip, new Date().toISOString().slice(0, 13)];   // por hora
  const atual = (await kv.get<number>(chave)).value ?? 0;
  if (atual >= LIMITES.fichasPorIp) return true;
  await kv.set(chave, atual + 1, { expireIn: 2 * 60 * 60 * 1000 });
  return false;
}

async function todas() {
  const fichas: Record<string, Record<string, unknown>[]> = {};
  let total = 0;
  for await (const linha of kv.list<Record<string, unknown>>({ prefix: ["ficha"] })) {
    const [, chave] = linha.key as [string, string, string];
    (fichas[chave] ||= []).push(linha.value);
    total++;
  }
  return { fichas, total };
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const rota = url.pathname.replace(/\/+$/, "") || "/";

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

  if (rota === "/" ) {
    const { total } = await todas();
    return json({ ok: true, servico: "o mundo — fusões do POKÉMON GLITCH EDITION", total });
  }

  if (rota === "/fichas" && req.method === "GET") {
    const { fichas, total } = await todas();
    return json({ ok: true, fichas, total, atualizado: new Date().toISOString() });
  }

  if (rota === "/fichas" && req.method === "POST") {
    let corpo: Record<string, unknown>;
    try {
      corpo = await req.json();
    } catch {
      return erro("isso não é JSON");
    }
    const chave = String(corpo.chave ?? "");
    if (!/^[a-z0-9]+\+[a-z0-9]+$/.test(chave)) return erro("chave fora do formato cabeca+corpo");

    const limpa = limpar(corpo.ficha as Record<string, unknown>);
    if (!limpa.ok) return erro(limpa.erro);

    const { total } = await todas();
    if (total >= LIMITES.total) return erro("o acervo está cheio", 507);

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "sem-ip";
    if (await passouDoLimite(ip)) return erro("muitas fichas em pouco tempo — espere um pouco", 429);

    await kv.set(["ficha", chave, String(limpa.ficha.id)], limpa.ficha);
    console.log(`[mundo] ${chave}: ${limpa.ficha.nome} por ${limpa.ficha.autor || "?"} (${ip})`);
    return json({ ok: true, ficha: limpa.ficha, total: total + 1 });
  }

  // moderação: tirar do ar o que não devia estar lá
  const apagar = rota.match(/^\/fichas\/([a-z0-9]+\+[a-z0-9]+)\/([a-z0-9]+)$/);
  if (apagar && req.method === "DELETE") {
    const senha = Deno.env.get("MUNDO_ADMIN");
    if (!senha || req.headers.get("X-Admin") !== senha) return erro("não é você", 403);
    await kv.delete(["ficha", apagar[1], apagar[2]]);
    return json({ ok: true, apagada: apagar[2] });
  }

  return erro("rota que não existe", 404);
});
