"""Baixa a animação de ATAQUE do Pokémon Mystery Dungeon (PMDCollab SpriteCollab,
github.com/PMDCollab/SpriteCollab) de cada Pokémon, pro COMPANHEIRO atacar no
mapa (pedido do CAIO, nov/2026). Os downloads vão primeiro pra uma pasta à parte
(PASTA_BAIXADOS) e só o PNG e os números entram no jogo:
  assets/sprites/pmd/ataque/<dex>.png   a folha (8 direções x quadros)
  assets/sprites/pmd/ataques.json       { dex: [largura, altura, [durações]] }
python3 -I tools/pmd/baixar_ataques.py PASTA_BAIXADOS [primeiro] [último]"""
import json, os, re, sys, urllib.request
from concurrent.futures import ThreadPoolExecutor

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BAIXA = sys.argv[1]
A, B = (int(sys.argv[2]), int(sys.argv[3])) if len(sys.argv) > 3 else (1, 1025)
URL = "https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/sprite/{:04d}/{}"
OUT = os.path.join(RAIZ, "assets/sprites/pmd/ataque")
os.makedirs(OUT, exist_ok=True); os.makedirs(BAIXA, exist_ok=True)

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
        # o Pokémon sem a pasta principal (o GIMMIGHOUL só tem a forma 0001): tenta a forma
        sub = ""
        try: xml = pega(URL.format(n, "AnimData.xml")).decode("utf-8", "replace")
        except Exception:
            sub = "0001/"; xml = pega(URL.format(n, sub + "AnimData.xml")).decode("utf-8", "replace")
        open(os.path.join(BAIXA, f"{n}.xml"), "w").write(xml)
        a = anim(xml, "Attack")
        if not a: return n, None
        nome, w, h, dur = a
        png = pega(URL.format(n, f"{sub}{nome}-Anim.png"))
        open(os.path.join(BAIXA, f"{n}.png"), "wb").write(png)
        return n, (w, h, dur)
    except Exception as e:
        return n, None

idx_arq = os.path.join(RAIZ, "assets/sprites/pmd/ataques.json")
idx = json.load(open(idx_arq)) if os.path.exists(idx_arq) else {}
# (o que já está no jogo não é baixado de novo)
with ThreadPoolExecutor(8) as ex:
    for n, info in ex.map(um, [n for n in range(A, B + 1) if str(n) not in idx]):
        if not info: continue
        # confere que é um PNG de verdade antes de pôr no jogo
        dado = open(os.path.join(BAIXA, f"{n}.png"), "rb").read()
        if not dado.startswith(b"\x89PNG"): continue
        open(os.path.join(OUT, f"{n}.png"), "wb").write(dado)
        idx[str(n)] = [info[0], info[1], info[2]]
json.dump(idx, open(idx_arq, "w"), separators=(",", ":"))
print(len(idx), "Pokémon com ataque")
