#!/usr/bin/env python3
"""O ANDAR NO MAPA DE QUEM O PMD NÃO TEM, dos SEGUIDORES feitos por fãs pro
Pokémon Essentials (pacote Gen 9: Azria, DarkusShadow, EduarPokeN, Carmanekko,
StarWolff, Caruban e outros — repositório Manurocker95/Pokemon-Essentials-21-
With-Unofficial-EBDX, Graphics/Characters/Followers). Pedido do CAIO (nov/2026):
"baixa mais de fã como o do gimmighoul".

Só completa quem falta no andar.json (o do PMD, tools/fetch_andar.py, fica).
A folha do Essentials é 4x4: linhas baixo, esquerda, direita, cima; 4 passos.

    python3 tools/fetch_seguidor.py
"""
import io
import json
import os
import re
import urllib.request

from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(RAIZ, "assets", "sprites", "pokemon", "andar")
INDICE = os.path.join(OUT, "andar.json")
BASE = "https://raw.githubusercontent.com/Manurocker95/Pokemon-Essentials-21-With-Unofficial-EBDX/master/Graphics/Characters/Followers"
NOMES_CSV = "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon.csv"
# ordem do jogo (andar.json): baixo, cima, esquerda, direita; no Essentials: baixo, esquerda, direita, cima
LINHAS = [0, 3, 1, 2]


def baixar(url):
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}), timeout=30) as r:
            return r.read()
    except Exception:
        return None


# nomes escritos diferente no pacote
TROCA = {"mabosstiff": "MABOSTIFF"}


def nome_essentials(nome):
    if nome in TROCA:
        return TROCA[nome]
    # "iron-boulder" -> IRONBOULDER; a forma padrão ("-male", "-incarnate") sai
    nome = re.sub(r"-(male|female|incarnate|average|normal|plant|altered|land|ordinary|aria|shield|red-meteor|midday|solo|disguised|amped|ice|full-belly|single-strike|zero|curly|family-of-four|green-plumage|two-segment|chest)$", "", nome)
    return re.sub(r"[^a-z0-9]", "", nome).upper()


def metade_se_dobrado(folha, limite=0.03):
    """o desenho do Essentials vem DOBRADO (cada pixel do desenho é um
    quadradinho 2x2): aí ele fica o dobro do tamanho dos outros no mapa (o
    CAIO: "o tamanho do bicho!"). Se for, volta pro tamanho certo pegando um
    pixel de cada quadradinho (não perde nada)."""
    p = folha.load()
    W, H = folha.size
    melhor, off = 1.0, None
    for ox, oy in ((0, 0), (1, 0), (0, 1), (1, 1)):
        ruim = tot = 0
        for y in range(oy, H - 1, 2):
            for x in range(ox, W - 1, 2):
                c = p[x, y]
                if c[3] == 0:
                    continue
                tot += 1
                ruim += not (p[x + 1, y] == c and p[x, y + 1] == c and p[x + 1, y + 1] == c)
        if tot and ruim / tot < melhor:
            melhor, off = ruim / tot, (ox, oy)
    if off is None or melhor > limite:
        return folha
    ox, oy = off
    out = Image.new("RGBA", ((W - ox) // 2, (H - oy) // 2), (0, 0, 0, 0))
    po = out.load()
    for y in range(out.height):
        for x in range(out.width):
            po[x, y] = p[ox + x * 2, oy + y * 2]
    # (a folha 4x4 continua 4x4: se o deslocamento comeu 1 pixel, o quadro fica 1 menor)
    return out


def converter(png, chave, indice, limite=0.03):
    """a folha 4x4 do Essentials (baixo, esquerda, direita, cima) -> a folha do
    jogo (baixo, cima, esquerda, direita), cortada no que tem desenho"""
    folha = metade_se_dobrado(Image.open(io.BytesIO(png)).convert("RGBA"), limite)
    fw, fh = folha.width // 4, folha.height // 4
    quadros = [[folha.crop((i * fw, l * fh, (i + 1) * fw, (l + 1) * fh)) for i in range(4)] for l in LINHAS]
    caixa = None
    for linha in quadros:
        for q in linha:
            b = q.getbbox()
            if b:
                caixa = b if not caixa else (min(caixa[0], b[0]), min(caixa[1], b[1]), max(caixa[2], b[2]), max(caixa[3], b[3]))
    if not caixa:
        return None
    w, h = caixa[2] - caixa[0], caixa[3] - caixa[1]
    out = Image.new("RGBA", (w * 4, h * 4), (0, 0, 0, 0))
    for l, linha in enumerate(quadros):
        for i, q in enumerate(linha):
            out.paste(q.crop(caixa), (i * w, l * h))
    out.save(os.path.join(OUT, f"{chave}.png"), optimize=True)
    indice[chave] = [w, h, 4, [150, 150, 150, 150]]
    return w, h


def formas(pares):
    """--formas: [[número da forma no jogo, NOME_DO_ESSENTIALS], ...]
    (as FORMAS juntas do CONECTADOR DE LENDAS: CALYREX_1 é o do GELO,
    CALYREX_2 o SOMBRIO, NECROZMA_1 a JUBA DO CREPÚSCULO, NECROZMA_2 as ASAS)"""
    indice = json.load(open(INDICE, encoding="utf-8"))
    for chave, nome in pares:
        png = baixar(f"{BASE}/{nome}.png")
        # (o CALYREX_1 tem uns detalhes finos no meio do dobrado: aceita até 25%)
        r = png and converter(png, str(chave), indice, limite=0.25)
        print(chave, nome, r or "não achei")
    with open(INDICE, "w", encoding="utf-8") as f:
        json.dump(indice, f, separators=(",", ":"), sort_keys=True)


def main():
    nomes = {}
    for linha in baixar(NOMES_CSV).decode().splitlines()[1:]:
        c = linha.split(",")
        nomes[int(c[0])] = c[1]
    indice = json.load(open(INDICE, encoding="utf-8"))
    feitos = 0
    for dex in range(1, 1026):
        if f"{dex:03d}" in indice or dex not in nomes:
            continue
        png = baixar(f"{BASE}/{nome_essentials(nomes[dex])}.png")
        if not png:
            print("sem seguidor:", dex, nomes[dex])
            continue
        r = converter(png, f"{dex:03d}", indice)
        if not r:
            continue
        feitos += 1
        print(dex, nomes[dex], *r)
    with open(INDICE, "w", encoding="utf-8") as f:
        json.dump(indice, f, separators=(",", ":"), sort_keys=True)
    print(f"{feitos} baixados; {len(indice)} andando")


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 2 and sys.argv[1] == "--formas":
        formas(json.load(open(sys.argv[2], encoding="utf-8")))
    else:
        main()
