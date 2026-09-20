#!/usr/bin/env python3
"""Monta src/data/mais.js — as espécies que faltavam — a partir da PokeAPI.

    python3 tools/fetch_species.py            # todas as que o jogo não tem (até a 1025)
    python3 tools/fetch_species.py --n 200    # menos
    python3 tools/fetch_species.py --dex 152,153,154

Ele lê os números de Pokédex que já existem (gen1, extra, regionais, eras,
iniciais), pega os N primeiros que faltam a partir do 152, baixa nome, tipos,
atributos-base e a cadeia de evolução de cada um e escreve a tabela no mesmo
formato de src/data/extra.js. Só stdlib. Os sprites são de
tools/fetch_sprites.py --mais.
"""
import argparse
import json
import os
import re
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "src", "data")
API = "https://pokeapi.co/api/v2"
TIPO = {"normal": "NORMAL", "fighting": "LUTADOR", "flying": "VOADOR", "poison": "VENENO", "ground": "TERRA",
        "rock": "PEDRA", "bug": "INSETO", "ghost": "FANTASMA", "steel": "AÇO", "fire": "FOGO", "water": "ÁGUA",
        "grass": "PLANTA", "electric": "ELÉTRICO", "psychic": "PSÍQUICO", "ice": "GELO", "dragon": "DRAGÃO",
        "dark": "SOMBRIO", "fairy": "FADA"}
# as pedras que existem no jogo (src/data/evolution.js); o resto vira nível
PEDRA = {"fire-stone": "pedra do fogo", "water-stone": "pedra da água", "thunder-stone": "pedra do trovão",
         "leaf-stone": "pedra da folha", "moon-stone": "pedra da lua", "dusk-stone": "pedra do crepúsculo",
         "ice-stone": "pedra do gelo"}


def get(path, tentativas=4):
    req = urllib.request.Request(f"{API}/{path}", headers={"User-Agent": "pokemon-glitch-edition/1.0"})
    for i in range(tentativas):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.load(r)
        except Exception:                # a API engasga de vez em quando: tenta de novo
            if i == tentativas - 1:
                raise


def existentes():
    """Todo número de Pokédex que alguma tabela do jogo já tem."""
    dex = set()
    for f in ("gen1.js", "extra.js", "eras.js", "iniciais.js", "regionais.js"):   # mais.js é a saída
        p = os.path.join(DATA, f)
        if not os.path.exists(p):
            continue
        src = open(p, encoding="utf-8").read()
        # linhas de tabela: "152 CHIKORITA PLANTA ..." ou "128 | 10250 | TAUROS-PALDEA | ..."
        for m in re.finditer(r"^\s*(\d{1,4})\s+[A-Z]", src, re.M):
            dex.add(int(m.group(1)))
        # regionais.js: "199 | 10165 | SLOWKING-GALAR" é a FORMA, não a espécie
        # — o SLOWKING de verdade continua faltando. Só a linha com forma 0
        # (as bases de fora de Kanto: WOOPER, ZIGZAGOON...) conta como espécie.
        for m in re.finditer(r"^\s*(\d{1,4})\s*\|\s*(\d+)\s*\|", src, re.M):
            if int(m.group(2)) == 0:
                dex.add(int(m.group(1)))
        for m in re.finditer(r"dex:\s*(\d{1,4})", src):
            dex.add(int(m.group(1)))
    return dex


def slug(nome):
    return re.sub(r"[^a-z0-9]+", "", nome.lower())


def nome_jogo(sp):
    """O nome em maiúsculas como o jogo escreve: sem hífen de forma, com o
    apóstrofo e o ponto que a API tira (FARFETCH'D, MR. MIME)."""
    for n in sp["names"]:
        if n["language"]["name"] == "en":
            return n["name"].upper()
    return sp["name"].upper()


def baixar(dex):
    p = get(f"pokemon/{dex}")
    s = get(f"pokemon-species/{dex}")
    st = {x["stat"]["name"]: x["base_stat"] for x in p["stats"]}
    return {
        "dex": dex, "nome": nome_jogo(s), "id": slug(nome_jogo(s)),
        "tipos": [TIPO[t["type"]["name"]] for t in p["types"]],
        "base": [st["hp"], st["attack"], st["defense"], st["special-attack"], st["special-defense"], st["speed"]],
        "chain": s["evolution_chain"]["url"].rstrip("/").split("/")[-1],
        "api": s["name"],
    }


def regra(detalhe, de_existe, nivel_base):
    """Uma regra de evolução do jogo a partir da da API. Devolve um dict.
    `de_existe`: a espécie de origem JÁ estava no jogo (ONIX, EEVEE, GLOOM) —
    aí a regra nova não pode roubar a que existia: troca e afins viram nível
    FORA DE KANTO (é o que o jogo faz com o CUBONE → MAROWAK-ALOLA), e
    felicidade vira `amizade`. `nivel_base`: o nível da primeira ramificação,
    pra uma pedra que o jogo não tem virar nível igual ao do irmão."""
    t = detalhe["trigger"]["name"]
    item = (detalhe.get("item") or {}).get("name")
    if t == "use-item" and item in PEDRA:
        r = {"item": PEDRA[item]}
        if de_existe:
            r["onde"] = "fora"          # a pedra faz outra coisa fora de Kanto
        return r
    if t == "level-up" and detalhe.get("min_level"):
        r = {"lvl": detalhe["min_level"]}
        if de_existe:
            r["onde"] = "fora"
        return r
    if t == "level-up" and detalhe.get("min_happiness"):
        return {"amizade": 65}
    if de_existe:                        # troca, pedra que não existe, golpe...
        return {"lvl": max(36, nivel_base or 36), "onde": "fora"}
    if t == "trade":
        return {"lvl": max(36, nivel_base or 36)}
    return {"lvl": nivel_base or 32}


def js(r, para):
    partes = [f'{k}: {json.dumps(v, ensure_ascii=False)}' for k, v in r.items()]
    return "{ " + ", ".join(partes) + f', to: "{para}" }}'


def evolucoes(chain, novos, ids):
    """(de, regra js) pra cada elo cuja ponta está no jogo."""
    out = []

    def anda(no):
        de = slug(no["species"]["name"])
        ramos = []
        for ev in no["evolves_to"]:
            para = slug(ev["species"]["name"])
            if de in ids and para in ids and para in novos and ev["evolution_details"]:
                ramos.append((para, ev["evolution_details"][0]))
            anda(ev)
        if not ramos:
            return
        de_existe = de not in novos
        niveis = [d["min_level"] for _, d in ramos if d.get("min_level")]
        base = min(niveis) if niveis else None
        regras = []
        for i, (para, d) in enumerate(ramos):
            r = regra(d, de_existe, base)
            # ramificação: a segunda em diante só acontece NA FENDA, senão a
            # primeira ganharia sempre (WURMPLE, KIRLIA, SNORUNT...)
            if i > 0 and "item" not in r and not de_existe:
                r["onde"] = "fenda"
            regras.append((para, r))
        # a regra com lugar vem antes da geral, senão nunca é lida
        regras.sort(key=lambda pr: 0 if "onde" in pr[1] else 1)
        for para, r in regras:
            out.append((de, js(r, para)))
    anda(chain["chain"])
    return out


# O EEVEE é caso à parte: cinco formas novas numa espécie que já tinha três.
EEVEE = [
    ("sylveon", {"amizade": 65, "onde": "sevii"}),
    ("umbreon", {"amizade": 65, "onde": "fenda"}),
    ("espeon", {"amizade": 65}),
    ("leafeon", {"item": "pedra da folha"}),
    ("glaceon", {"item": "pedra do gelo"}),
]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--n", type=int, default=2000)
    ap.add_argument("--dex", default="")
    ap.add_argument("--max", type=int, default=1025)
    a = ap.parse_args()
    tem = existentes()
    if a.dex:
        dexes = [int(x) for x in a.dex.split(",")]
    else:
        dexes = [d for d in range(152, a.max + 1) if d not in tem][:a.n]
    print(f"baixando {len(dexes)} espécies ({dexes[0]}..{dexes[-1]})", file=sys.stderr)
    with ThreadPoolExecutor(max_workers=6) as pool:
        sp = list(pool.map(baixar, dexes))
    ids = {s["id"] for s in sp} | {slug(x) for x in []}
    # as pontas que já existem no jogo também contam pra cadeia (ex.: um bebê novo de uma linha antiga)
    for f in ("gen1.js", "extra.js", "eras.js", "iniciais.js", "regionais.js"):
        src = open(os.path.join(DATA, f), encoding="utf-8").read()
        for m in re.finditer(r"^\s*\d{1,4}\s+([A-Z0-9'.\-]+)\s+[A-ZÁÉÍÓÚÇ]", src, re.M):
            ids.add(slug(m.group(1)))
    chains = sorted({s["chain"] for s in sp})
    with ThreadPoolExecutor(max_workers=6) as pool:
        cadeias = list(pool.map(lambda c: get(f"evolution-chain/{c}"), chains))
    novos = {s["id"] for s in sp}
    evos = {}
    for c in cadeias:
        for de, r in evolucoes(c, novos, ids):
            if de == "eevee":
                continue
            evos.setdefault(de, []).append(r)
    if any(para in novos for para, _ in EEVEE):
        evos["eevee"] = [js(r, para) for para, r in EEVEE if para in novos]

    linhas = [f'{s["dex"]} {s["nome"].replace(" ", "-")} {"/".join(s["tipos"])} ' + " ".join(map(str, s["base"])) for s in sp]
    evo_js = "\n".join(f"  {de}: [{', '.join(rs)}]," for de, rs in evos.items())
    out = f'''// AS QUE FALTAVAM: {len(sp)} espécies de Johto pra frente, montadas por
// tools/fetch_species.py a partir da PokeAPI (nome, tipos, atributos-base e
// evolução). Não são de Kanto: as de Johto moram no mato das ilhas SEVII —
// como no FireRed — e as outras vazam pela 011GLITCHDIMENSION110, por terreno
// (ver `MAIS_SEVII` e `MAIS_DIM`, montados em src/data/index.js).
// Formato igual ao de extra.js: dex NOME TIPO1[/TIPO2] HP ATK DEF SPA SPD SPE.
// Regenerar: python3 tools/fetch_species.py && python3 tools/fetch_sprites.py --mais
const TABLE = `
{chr(10).join(linhas)}
`;

/** As frases de Pokédex escritas à mão. O resto fica com o texto genérico —
 *  "dados ainda não carregados" é exatamente o que uma espécie que vazou é. */
const LORE = {{
  uxie: "O SER DO CONHECIMENTO. QUEM OLHA NOS OLHOS DELE ESQUECE TUDO — POR ISSO ELE NÃO ABRE OS OLHOS.",
  mesprit: "O SER DA EMOÇÃO. FOI ELE QUE ENSINOU AS PESSOAS A SENTIR ALEGRIA E TRISTEZA. DEPOIS FOI DORMIR NO FUNDO DE UM LAGO.",
  azelf: "O SER DA VONTADE. QUEM ENCOSTA NELE PERDE A VONTADE DE FAZER QUALQUER COISA, E FICA PARADO PRA SEMPRE.",
}};

export const MAIS = {{}};
for (const line of TABLE.trim().split("\\n")) {{
  if (!line.trim()) continue;
  const [dex, name, types, hp, atk, def, spa, spd, spe] = line.trim().split(/\\s+/);
  const base = {{ hp: +hp, atk: +atk, def: +def, spa: +spa, spd: +spd, spe: +spe }};
  const bst = Object.values(base).reduce((a, b) => a + b, 0);
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "");
  MAIS[id] = {{
    id, dex: +dex, name: name.replace(/-/g, " "), types: types.split("/"), base, bst, foreign: true,
    dexText: LORE[id],
    catchRate: bst >= 600 ? 3 : bst >= 500 ? 45 : bst >= 400 ? 90 : 160,
    xpYield: Math.floor(bst / 4),
  }};
}}

/** as regras de evolução (troca e felicidade viraram nível, como no resto do jogo) */
export const EVO_MAIS = {{
{evo_js}
}};

/** ONDE ELAS APARECEM. Johto (152-251) no mato das ilhas SEVII, como no
 *  FireRed; o resto vaza pela fenda, por terreno (quem nada vai pra água, quem
 *  voa ou flutua pro ar, o resto pro chão). Os lendários (BST 600+) não vêm no
 *  mato: ficam só na oficina, no leilão e na fusão. `w` sai fracionário de
 *  propósito — src/data/index.js reparte entre elas o mesmo peso que a tabela
 *  de origem já tinha, senão 350 espécies novas engoliam as de casa. */
const comuns = Object.values(MAIS).filter((s) => s.bst < 600);
const nivel = (s) => (s.bst >= 500 ? [34, 46] : s.bst >= 400 ? [24, 38] : [14, 28]);
const entrada = (s, [min, max]) => ({{ id: s.id, min, max, w: s.bst >= 560 ? 0.12 : s.bst >= 500 ? 0.4 : 1 }});
/** OS GUARDIÕES DO LAGO: UXIE, MESPRIT e AZELF não têm lago aqui — flutuam no
 *  vazio da fenda, os três, e são o encontro mais raro dela. */
export const GUARDIOES = ["uxie", "mesprit", "azelf"].filter((id) => MAIS[id]);
export const MAIS_SEVII = comuns.filter((s) => s.dex <= 251).map((s) => entrada(s, nivel(s)));
const voa = (s) => ["VOADOR", "FANTASMA", "PSÍQUICO", "ELÉTRICO"].some((t) => s.types.includes(t));
const nada = (s) => ["ÁGUA", "GELO"].some((t) => s.types.includes(t));
const fora = comuns.filter((s) => s.dex > 251);
export const MAIS_DIM = {{
  agua: fora.filter((s) => nada(s)).map((s) => entrada(s, [nivel(s)[0] + 6, nivel(s)[1] + 8])),
  ar: fora.filter((s) => !nada(s) && voa(s) && !GUARDIOES.includes(s.id)).map((s) => entrada(s, [nivel(s)[0] + 6, nivel(s)[1] + 8]))
    .concat(GUARDIOES.map((id) => ({{ id, min: 50, max: 50, w: 0.12 }}))),
  terra: fora.filter((s) => !nada(s) && !voa(s)).map((s) => entrada(s, [nivel(s)[0] + 6, nivel(s)[1] + 8])),
}};
'''
    with open(os.path.join(DATA, "mais.js"), "w", encoding="utf-8") as f:
        f.write(out)
    print(f"src/data/mais.js: {len(sp)} espécies, {sum(len(v) for v in evos.values())} evoluções", file=sys.stderr)
    print(",".join(str(s["dex"]) for s in sp))


if __name__ == "__main__":
    sys.exit(main())
