"""O PESO de cada Pokémon, da tabela da PokeAPI (pokemon.csv), em quilos.

Nenhuma habilidade precisava de peso até o PAPA-MOSCA do VICTREEBEL (+5 de
dano em INSETO a cada meio quilo do alvo). Escreve src/data/pesos.js: uma
tabela { id da PokeAPI: kg } — o mesmo número que o jogo já usa pro sprite
(`spriteDex` nas formas, `dex` no resto), então src/systems/habilidades.js
acha o peso de qualquer espécie sem coluna nova em tabela nenhuma.

    python3 tools/fetch_pesos.py
"""
import csv
import io
import os
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL = "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon.csv"
DEST = os.path.join(ROOT, "src", "data", "pesos.js")

with urllib.request.urlopen(URL, timeout=30) as r:
    texto = r.read().decode("utf-8")
linhas = list(csv.DictReader(io.StringIO(texto)))
pares = [(int(l["id"]), int(l["weight"]) / 10) for l in linhas if l["weight"]]
pares.sort()

out = ["// O PESO DE CADA POKÉMON, EM QUILOS. Gerado por tools/fetch_pesos.py a",
       "// partir da tabela da PokeAPI — a chave é o id de lá, o mesmo do sprite",
       "// (`spriteDex` ou `dex`). Quem lê é `pesoDe`, em src/systems/habilidades.js.",
       "export const PESOS = {"]
linha = " "
for n, kg in pares:
    peca = f" {n}: {kg:g},"
    if len(linha) + len(peca) > 98:
        out.append(linha)
        linha = " "
    linha += peca
out.append(linha)
out.append("};")
out.append("")
with open(DEST, "w") as f:
    f.write("\n".join(out))
print(f"{len(pares)} pesos em {os.path.relpath(DEST, ROOT)}")
