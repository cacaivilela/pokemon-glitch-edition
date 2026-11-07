#!/usr/bin/env python3
"""OS POKÉMON ANDANDO NO MAPA, baixados do PMD SpriteCollab (os sprites do
Pokémon Mystery Dungeon, pixel art), pra quem ainda NÃO tem o andar desenhado à
mão (tools/desenha_andar.py — esses nunca são trocados).

Pedido do CAIO (nov/2026): "baixe os sprite". Sai no formato que o jogo lê
(src/core/sprites.js, `pedirAndar`):

    assets/sprites/pokemon/andar/162.png    4 linhas: baixo, cima, esquerda, direita
    assets/sprites/pokemon/andar/andar.json {"162": [w, h, quadros, [ms...]]}

    python3 tools/fetch_andar.py              # todo mundo de 1 a 1025 que falta
    python3 tools/fetch_andar.py --only 162,164

O Walk-Anim.png do SpriteCollab tem 8 linhas (baixo, baixo-direita, direita,
cima-direita, cima, cima-esquerda, esquerda, baixo-esquerda); aqui ficam as 4
retas. Os tempos vêm em "ticks" de 1/60 s. A arte é do PMD SpriteCollab (e da
Nintendo / Creatures / Game Freak): projeto pessoal, não redistribuir.
"""
import argparse
import io
import json
import os
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor

from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(RAIZ, "assets", "sprites", "pokemon", "andar")
INDICE = os.path.join(OUT, "andar.json")
BASE = "https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/sprite"
LINHAS = [0, 4, 6, 2]   # baixo, cima, esquerda, direita (no Walk-Anim.png)


def baixar(url):
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}), timeout=30) as r:
            return r.read()
    except Exception:
        return None


def voo_do_parado(linha, corte=0.55):
    """O VOO CRIADO pra quem o PMD não tem voo (o CHARIZARD): o parado do PMD
    mexe as asas, mas também os pés — e aí ele "anda no ar". Aqui cada quadro
    fica com a parte de CIMA do quadro parado dele (as asas batendo) e a de
    BAIXO (pernas, rabo) sempre a do primeiro: as asas batem e as pernas não
    andam. O jogo sobe e desce o corpo no ar."""
    base = linha[0]
    caixa = None
    for q in linha:
        b = q.getbbox()
        if b:
            caixa = b if not caixa else (min(caixa[0], b[0]), min(caixa[1], b[1]), max(caixa[2], b[2]), max(caixa[3], b[3]))
    if not caixa:
        return linha
    y = caixa[1] + round((caixa[3] - caixa[1]) * corte)
    w = base.width

    def faixa(img, y0, dx=0, dy=0):
        # a fileira de pixels perto do corte, deslocada (pra achar o quanto o corpo andou)
        return [img.getpixel((x - dx, y0 - dy)) if 0 <= x - dx < w and 0 <= y0 - dy < img.height else (0, 0, 0, 0)
                for x in range(w)]

    out = []
    # só os 2 primeiros quadros (asa baixa, asa alta), alternando: os outros do
    # parado do PMD às vezes viram o corpo, e emendados ficam tortos
    for q in [linha[i % 2] for i in range(len(linha))] if len(linha) > 1 else linha:
        # o corpo subiu/desceu/andou de lado nesse quadro? acha o deslocamento
        # que faz a cintura do quadro bater com a do primeiro
        melhor, dx, dy = None, 0, 0
        for ddy in range(-3, 4):
            for ddx in range(-2, 3):
                erro = 0
                for k in (-3, -2, -1):
                    a1, b1 = faixa(q, y + k), faixa(base, y + k, ddx, ddy)
                    erro += sum((p[3] > 0) != (r[3] > 0) or (p[3] and sum(abs(p[c] - r[c]) for c in range(3)) > 60)
                                for p, r in zip(a1, b1))
                if melhor is None or erro < melhor:
                    melhor, dx, dy = erro, ddx, ddy
        n = q.copy()
        corte_q = y + dy
        n.paste((0, 0, 0, 0), (0, corte_q, w, base.height))
        baixo = base.crop((0, y, w, base.height))
        n.alpha_composite(baixo, (dx, corte_q)) if dx >= 0 else n.alpha_composite(baixo.crop((-dx, 0, w, baixo.height)), (0, corte_q))
        out.append(n)
    return out


# quem no PMD anda ESCONDIDO debaixo da terra (o "Walk" é só o montinho):
# no mapa vai a animação parado, com ele pra fora ("pq diglett, wiglett, dugtrio
# e wugtrio são só um monte de terra/pedra", CAIO, nov/2026)
ANDA_ESCONDIDO = {50, 51, 960, 961}


def andar(dex, nomes=("Walk",), saida=OUT):
    if dex in ANDA_ESCONDIDO and nomes == ("Walk",):
        nomes = ("Idle",)
    # a forma de sempre; sem ela, uma forma alternativa (sprite/0999/0001/...)
    for sub in ("", "/0001", "/0002", "/0003"):
        r = andar_de(dex, f"{BASE}/{dex:04d}{sub}", nomes, saida)
        if r:
            return r
    return None


def andar_de(dex, pasta, nomes=("Walk",), saida=OUT):
    xml = baixar(f"{pasta}/AnimData.xml")
    if not xml:
        return None
    anims = {a.findtext("Name"): a for a in ET.fromstring(xml).iter("Anim")}
    # a primeira das animações pedidas que ele tiver
    nome = next((n for n in nomes if anims.get(n) is not None), None)
    if nome is None:
        return None
    walk = anims[nome]
    # "CopyOf": a animação é a mesma de outra
    while walk is not None and walk.findtext("CopyOf"):
        walk = anims.get(walk.findtext("CopyOf"))
    if walk is None:
        return None
    fw, fh = int(walk.findtext("FrameWidth")), int(walk.findtext("FrameHeight"))
    ticks = [int(d.text) for d in walk.iter("Duration")]
    # (o "CopyOf" já levou pra animação de verdade)
    png = baixar(f"{pasta}/{walk.findtext('Name')}-Anim.png")
    if not png:
        return None
    folha = Image.open(io.BytesIO(png)).convert("RGBA")
    n = min(len(ticks), folha.width // fw)
    if folha.height < fh * 8 or n < 1:
        return None
    quadros = [[folha.crop((i * fw, l * fh, (i + 1) * fw, (l + 1) * fh)) for i in range(n)] for l in LINHAS]
    if nome == "Idle" and saida != OUT:
        quadros = [voo_do_parado(linha) for linha in quadros]
    # corta na caixa de todos os quadros juntos (os pés ficam no chão da folha)
    caixa = None
    for linha in quadros:
        for q in linha:
            b = q.getbbox()
            if b:
                caixa = b if not caixa else (min(caixa[0], b[0]), min(caixa[1], b[1]), max(caixa[2], b[2]), max(caixa[3], b[3]))
    if not caixa:
        return None
    w, h = caixa[2] - caixa[0], caixa[3] - caixa[1]
    out = Image.new("RGBA", (w * n, h * 4), (0, 0, 0, 0))
    for l, linha in enumerate(quadros):
        for i, q in enumerate(linha):
            out.paste(q.crop(caixa), (i * w, l * h))
    out.save(os.path.join(saida, f"{dex:03d}.png"), optimize=True)
    return [w, h, n, [round(t * 1000 / 60) for t in ticks[:n]]]


# O VOO (pedido do CAIO, nov/2026: "o charizard tá andando no ar"): a animação
# de voar de verdade do PMD (Hover, FlapAround); quem não tem, o parado (Idle),
# que no PMD bate as asas — o jogo põe o corpo subindo e descendo no ar.
VOO = os.path.join(OUT, "voo")
NOMES_VOO = ("Hover", "FlapAround", "Float", "Idle")


# AS FORMAS (regionais, megas, Rotom...): o nome da forma no SpriteCollab pelo
# fim do id do jogo. Salvas pelo número da forma do jogo (spriteDex: 10091.png).
# "e as formas regionais" (CAIO, nov/2026)
FORMA_PMD = [("megacharizardx", "Mega_X"), ("megacharizardy", "Mega_Y"), ("megamewtwox", "Mega_X"),
             ("megamewtwoy", "Mega_Y"), ("megafloette", "Mega"), ("mega", "Mega"),
             ("alola", "Alola"), ("galar", "Galar"), ("hisui", "Hisui"), ("taurosbrasa", "Paldea_Blaze"),
             ("taurosonda", "Paldea_Aqua"), ("ursalunapaldea", "Bloodmoon"), ("paldea", "Paldea"),
             ("calor", "Heat"), ("lavagem", "Wash"), ("rotomgelo", "Frost"), ("ventilador", "Fan"),
             ("rotomcorte", "Mow"), ("cardume", "School"), ("heroi", "Hero"), ("kyuremblack", "Black"), ("kyuremwhite", "White"), ("necrozmadusk", "Dusk_Mane"), ("necrozmadawn", "Dawn_Wings"), ("calyrexice", "Ice_Rider"), ("calyrexshadow", "Shadow_Rider"), ("eternamax", "Eternamax"), ("eterna", "Eternal"),
             ("zygarde10", "10"), ("zygardecompleto", "Complete"),
             ("deoxysataque", "Attack"), ("deoxysdefesa", "Defense"), ("deoxysvelocidade", "Speed")]


def formas(lista):
    """lista: [(id do jogo, dex, número da forma)] (sai do DB; ver --formas)"""
    tracker = json.loads(baixar("https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/tracker.json"))
    alvos = []
    for jid, dex, num in lista:
        nome = next((n for fim, n in FORMA_PMD if jid.endswith(fim) or jid.startswith(fim)), None)
        subs = tracker.get(f"{dex:04d}", {}).get("subgroups", {})
        sub = next((k for k, v in subs.items() if nome and v.get("name") == nome), None)
        if sub:
            alvos.append((jid, dex, num, sub))
        else:
            print("sem forma no PMD:", jid)
    for saida, nomes, arq in ((OUT, ("Walk",), INDICE), (VOO, NOMES_VOO, os.path.join(VOO, "voo.json"))):
        indice = json.load(open(arq, encoding="utf-8")) if os.path.exists(arq) else {}

        def uma(a, nomes=nomes, saida=saida):
            jid, dex, num, sub = a
            # o DIGLETT/DUGTRIO DE ALOLA também anda escondido na terra
            r = andar_de(num, f"{BASE}/{dex:04d}/{sub}", ("Idle",) if dex in ANDA_ESCONDIDO and nomes == ("Walk",) else nomes, saida)
            return a, r

        with ThreadPoolExecutor(12) as ex:
            for (jid, dex, num, sub), r in ex.map(uma, alvos):
                if r:
                    indice[str(num)] = r
                    print(jid, "voo" if saida == VOO else "andar", r[:3])
        with open(arq, "w", encoding="utf-8") as f:
            json.dump(indice, f, separators=(",", ":"), sort_keys=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only")
    ap.add_argument("--formas", help="arquivo JSON [[id, dex, número da forma], ...]")
    ap.add_argument("--voo", action="store_true", help="baixa a animação de VOAR (andar/voo/)")
    a = ap.parse_args()
    if a.formas:
        return formas(json.load(open(a.formas, encoding="utf-8")))
    if a.voo:
        os.makedirs(VOO, exist_ok=True)
        arq = os.path.join(VOO, "voo.json")
        indice = json.load(open(arq, encoding="utf-8")) if os.path.exists(arq) else {}
        alvos = [int(x) for x in a.only.split(",")] if a.only else [d for d in range(1, 1026) if f"{d:03d}" not in indice]
        with ThreadPoolExecutor(12) as ex:
            for dex, res in zip(alvos, ex.map(lambda d: andar(d, NOMES_VOO, VOO), alvos)):
                if res:
                    indice[f"{dex:03d}"] = res
        with open(arq, "w", encoding="utf-8") as f:
            json.dump(indice, f, separators=(",", ":"), sort_keys=True)
        return print(f"{len(indice)} com animação de voo")
    indice = json.load(open(INDICE, encoding="utf-8")) if os.path.exists(INDICE) else {}
    alvos = [int(x) for x in a.only.split(",")] if a.only else range(1, 1026)
    # quem já tem (os desenhados à mão) fica como está
    alvos = [d for d in alvos if f"{d:03d}" not in indice]
    feitos = 0
    with ThreadPoolExecutor(12) as ex:
        for dex, res in zip(alvos, ex.map(andar, alvos)):
            if res:
                indice[f"{dex:03d}"] = res
                feitos += 1
            else:
                print("sem andar:", dex)
    with open(INDICE, "w", encoding="utf-8") as f:
        json.dump(indice, f, separators=(",", ":"), sort_keys=True)
    print(f"{feitos} baixados; {len(indice)} andando no índice")


if __name__ == "__main__":
    sys.exit(main())
