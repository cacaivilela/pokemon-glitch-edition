"""Baixa as animações de ANDAR e PARADO do Pokémon Mystery Dungeon (PMDCollab
SpriteCollab), pros bichos ficarem no jeito do PMD durante a LUTA NO MAPA
(src/systems/lutamapa.js). Mesma ideia de baixar_ataques.py:
  assets/sprites/pmd/anda/<dex>.png, assets/sprites/pmd/parado/<dex>.png
  assets/sprites/pmd/movimento.json   { dex: { anda: [l, a, [durações]], parado: [...] } }
python3 -I tools/pmd/baixar_movimento.py PASTA_BAIXADOS [primeiro] [último]"""
import json, os, re, sys, urllib.request
from concurrent.futures import ThreadPoolExecutor

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BAIXA = sys.argv[1]
A, B = (int(sys.argv[2]), int(sys.argv[3])) if len(sys.argv) > 3 else (1, 1025)
URL = "https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/sprite/{:04d}/{}"
PMD = os.path.join(RAIZ, "assets/sprites/pmd")
os.makedirs(BAIXA, exist_ok=True)
for d in ("anda", "parado"): os.makedirs(os.path.join(PMD, d), exist_ok=True)

def pega(url):
    with urllib.request.urlopen(url, timeout=30) as r: return r.read()

def anim(xml, nome, vistos=()):
    m = re.search(r"<Anim>\s*<Name>" + nome + r"</Name>(.*?)</Anim>", xml, re.S)
    if not m: return None
    g = m.group(1)
    copia = re.search(r"<CopyOf>(\w+)</CopyOf>", g)
    if copia and copia.group(1) not in vistos: return anim(xml, copia.group(1), vistos + (nome,))
    w, h = re.search(r"<FrameWidth>(\d+)", g), re.search(r"<FrameHeight>(\d+)", g)
    if not (w and h): return None
    return nome, int(w.group(1)), int(h.group(1)), [int(x) for x in re.findall(r"<Duration>(\d+)</Duration>", g)]

def um(n):
    try:
        sub = ""
        try: xml = pega(URL.format(n, "AnimData.xml")).decode("utf-8", "replace")
        except Exception:
            sub = "0001/"; xml = pega(URL.format(n, sub + "AnimData.xml")).decode("utf-8", "replace")
        out = {}
        for chave, nome in (("anda", "Walk"), ("parado", "Idle")):
            a = anim(xml, nome)
            if not a: continue
            png = pega(URL.format(n, f"{sub}{a[0]}-Anim.png"))
            arq = os.path.join(BAIXA, f"{chave}_{n}.png")
            open(arq, "wb").write(png)
            out[chave] = (arq, [a[1], a[2], a[3]])
        return n, out
    except Exception:
        return n, None

idx_arq = os.path.join(PMD, "movimento.json")
idx = json.load(open(idx_arq)) if os.path.exists(idx_arq) else {}
with ThreadPoolExecutor(8) as ex:
    for n, out in ex.map(um, [n for n in range(A, B + 1) if str(n) not in idx]):
        if not out: continue
        for chave, (arq, info) in out.items():
            dado = open(arq, "rb").read()
            if not dado.startswith(b"\x89PNG"): continue      # só PNG de verdade entra no jogo
            open(os.path.join(PMD, chave, f"{n}.png"), "wb").write(dado)
            idx.setdefault(str(n), {})[chave] = info
json.dump(idx, open(idx_arq, "w"), separators=(",", ":"))
print(len(idx), "Pokémon com movimento")
