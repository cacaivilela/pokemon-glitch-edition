#!/usr/bin/env python3
"""OS SPRITES ANIMADOS DO BLACK/WHITE, prontos pro canvas.

O canvas não toca GIF (desenha só o primeiro quadro), então aqui cada GIF
animado do B/W (frente e costas) vira uma FOLHA de quadros em PNG, e o tempo
de cada quadro vai pra um índice só:

    assets/sprites/pokemon/anim/025.png        quadros da frente, em grade
    assets/sprites/pokemon/anim/back/025.png   quadros das costas
    assets/sprites/pokemon/anim/quadros.json   {"025": {"f": [w, h, colunas, [ms...]], "c": [...]}}

Só baixa quem já tem sprite em assets/sprites/pokemon/. Pokédex 1 a 649 vem
do B/W; o resto (gen VI+, MEGA, regionais) do gen5ani do Showdown (abaixo).

    python3 tools/fetch_bw_anim.py            # tudo que falta
    python3 tools/fetch_bw_anim.py --only 25,94 --force
    python3 tools/fetch_bw_anim.py --gen5ani      # só o 650 em diante, refazendo

DO 650 EM DIANTE (X/Y pra frente, MEGA, regionais) o "showdown" da PokeAPI é o
modelo 3D do X/Y encolhido — não é pixel art. O certo é o `gen5ani` do
Showdown: sprites animados feitos à mão no estilo do B/W. Quem não tem gen5ani
sai do índice e fica pro tools/anima_proprios.py animar a partir do sprite
parado do jogo (nunca o modelo 3D).

Precisa do Pillow (pra ler GIF). A arte é da Nintendo / Creatures / Game
Freak: use num projeto pessoal e não redistribua junto com o jogo.
"""
import argparse
import io
import json
import os
import re
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor

from PIL import Image, ImageSequence

BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPR = os.path.join(ROOT, "assets", "sprites", "pokemon")
OUT = os.path.join(SPR, "anim")
INDICE = os.path.join(OUT, "quadros.json")
COLUNAS = 16   # folha em grade: tira comprida demais estoura o limite do canvas
GEN5ANI = "https://play.pokemonshowdown.com/sprites/gen5ani"
NOMES_CSV = "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon.csv"


def baixar(url):
    try:
        # o servidor do Showdown recusa o User-Agent padrão do Python (403)
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (pokemon-glitch-edition)"})
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.read()
    except Exception:
        return None


def folha(gif_bytes, dest):
    """GIF -> folha PNG em grade; devolve [w, h, colunas, [ms por quadro]]."""
    im = Image.open(io.BytesIO(gif_bytes))
    quadros, tempos = [], []
    for q in ImageSequence.Iterator(im):
        quadros.append(q.convert("RGBA"))
        tempos.append(max(20, int(q.info.get("duration", 100) or 100)))
    # o gen5ani vem num quadro de 96x96 com sobra: corta na caixa de TODOS os
    # quadros juntos, pra o chão do desenho ser o chão da folha
    caixa = None
    for q in quadros:
        b = q.getbbox()
        if b:
            caixa = b if not caixa else (min(caixa[0], b[0]), min(caixa[1], b[1]), max(caixa[2], b[2]), max(caixa[3], b[3]))
    if caixa:
        quadros = [q.crop(caixa) for q in quadros]
    w, h = quadros[0].size
    col = min(COLUNAS, len(quadros))
    lin = (len(quadros) + col - 1) // col
    out = Image.new("RGBA", (w * col, h * lin), (0, 0, 0, 0))
    for i, q in enumerate(quadros):
        out.paste(q, ((i % col) * w, (i // col) * h))
    out.save(dest, optimize=True)
    return [w, h, col, tempos]


def um(dex, force):
    nome = f"{dex:03d}"
    res = {}
    for lado, sub, pasta in (("f", "", OUT), ("c", "/back", os.path.join(OUT, "back"))):
        dest = os.path.join(pasta, nome + ".png")
        if os.path.exists(dest) and not force:
            continue
        gif = baixar(f"{BASE}{sub}/{dex}.gif")
        if gif:
            res[lado] = folha(gif, dest)
    return nome, res


PADRAO = {"male", "shield", "average", "50", "standard", "ordinary", "normal",
          "altered", "land", "incarnate", "aria", "midday", "solo", "red",
          "meteor", "disguised", "amped", "full", "ice", "single", "zero",
          "curly", "family", "two", "green", "plant", "baile", "small", "red-meteor"}


def nomes_showdown(nome):
    """nome da PokeAPI -> os nomes que o Showdown pode usar (charizard-mega-x
    vira charizard-megax; tapu-koko vira tapukoko)"""
    # a forma PADRÃO (pyroar-male, aegislash-shield, zygarde-50...) no
    # Showdown é só o nome da espécie
    partes = nome.split("-")
    while len(partes) > 1 and partes[-1] in PADRAO:
        partes = partes[:-1]
    nome = "-".join(partes)
    cands = []
    if len(partes) > 1:
        cands.append(partes[0] + "-" + "".join(partes[1:]))
    cands += [nome.replace("-", ""), nome]
    return list(dict.fromkeys(cands))


def gen5ani(indice, dexes, force):
    nomes = {}
    for linha in baixar(NOMES_CSV).decode().splitlines()[1:]:
        c = linha.split(",")
        nomes[int(c[0])] = c[1]
    # o gerado (anima_proprios.py) é refeito só se agora apareceu um gen5ani
    alvos = [f"{d:03d}" for d in dexes if d > 649
             and (force or not indice.get(f"{d:03d}", {}).get("g5"))]

    def um5(chave):
        nome = nomes.get(int(chave))
        res = {}
        for lado, sub, pasta in (("f", "", OUT), ("c", "-back", os.path.join(OUT, "back"))):
            for n in (nomes_showdown(nome) if nome else []):
                gif = baixar(f"{GEN5ANI}{sub}/{n}.gif")
                if gif:
                    res[lado] = folha(gif, os.path.join(pasta, chave + ".png"))
                    break
        return chave, res

    trocados, fora = 0, 0
    with ThreadPoolExecutor(12) as ex:
        for chave, res in ex.map(um5, alvos):
            if "f" in res:
                indice[chave] = {**res, "g5": 1}
                trocados += 1
                print(chave, "gen5ani", "".join(res))
            elif chave in indice and not indice[chave].get("gerado"):
                # sem gen5ani: o modelo 3D sai, e o anima_proprios.py anima o parado
                for pasta in (OUT, os.path.join(OUT, "back")):
                    try:
                        os.remove(os.path.join(pasta, chave + ".png"))
                    except FileNotFoundError:
                        pass
                del indice[chave]
                fora += 1
    print(f"{trocados} trocados pelo gen5ani; {fora} sem gen5ani (rode tools/anima_proprios.py)")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", help="números da Pokédex separados por vírgula")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--gen5ani", action="store_true", help="do 650 em diante, troca o modelo 3D pelo gen5ani")
    a = ap.parse_args()
    os.makedirs(os.path.join(OUT, "back"), exist_ok=True)
    if a.only:
        alvos = [int(x) for x in a.only.split(",") if x.strip()]
    else:
        alvos = sorted({int(m.group(1)) for f in os.listdir(SPR)
                        if (m := re.fullmatch(r"(\d{3,5})\.png", f)) and int(m.group(1)) >= 1})
    indice = {}
    if os.path.exists(INDICE):
        with open(INDICE, encoding="utf-8") as f:
            indice = json.load(f)
    gen5ani(indice, alvos, a.force or a.gen5ani)
    alvos = [d for d in alvos if d <= 649]
    with ThreadPoolExecutor(12) as ex:
        for nome, res in ex.map(lambda d: um(d, a.force), alvos):
            if res:
                indice.setdefault(nome, {}).update(res)
                print(nome, " ".join(f"{k}:{len(v[3])}q" for k, v in res.items()))
    with open(INDICE, "w", encoding="utf-8") as f:
        json.dump(indice, f, separators=(",", ":"), sort_keys=True)
    print(f"{len(indice)} espécies animadas em {os.path.relpath(INDICE, ROOT)}")


if __name__ == "__main__":
    sys.exit(main())
