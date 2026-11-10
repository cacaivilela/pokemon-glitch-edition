"""MARCA AS CORES DA FUSÃO de todos os sprites (o CAIO, 07/nov/2026: "vc marca").
O jeito do Japeal: 3 cores, cada uma com até 5 tons. Escolhe como uma pessoa
escolheria: junta os tons do mesmo matiz (a sombra puxada pro roxo continua da
mesma cor), joga fora o que é pequeno (olho, bochecha, brilho) e o contorno, e
pega 5 tons que vão do escuro ao claro.
Sai src/data/cores-fusao.json. O que a página dev/marcarcores.html salvou
(dev/captures/cores_fusao.log) ganha, porque o jogo lê ele depois."""
import colorsys, json, os, re, sys
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PASTA = os.path.join(RAIZ, "assets/sprites/pokemon")
CONTORNO = 46

def brilho(c): return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]

def neutro(h, s, v): return s < 0.16 or (v > 0.93 and s < 0.22)

def dist_h(a, b):
    d = abs(a - b) % 1
    return min(d, 1 - d)

def marcar(caminho):
    im = Image.open(caminho).convert("RGBA")
    conta = {}
    for r, g, b, a in im.getdata():
        if a <= 40 or brilho((r, g, b)) < CONTORNO: continue
        conta[(r, g, b)] = conta.get((r, g, b), 0) + 1
    total = sum(conta.values())
    if not total: return None
    # grupos: neutros num só; coloridos juntados por matiz (do mais comum pro menos)
    grupos = []          # {h, n, cores:{}} ; h=None = neutro
    for c, n in sorted(conta.items(), key=lambda x: -x[1]):
        h, s, v = colorsys.rgb_to_hsv(*(x / 255 for x in c))
        if neutro(h, s, v):
            alvo = next((g for g in grupos if g["h"] is None), None)
            if not alvo: alvo = {"h": None, "n": 0, "cores": {}}; grupos.append(alvo)
        else:
            # sombra escura é matiz que escorrega: mais tolerância no escuro
            tol = 0.06 if v > 0.45 else 0.09
            perto = [g for g in grupos if g["h"] is not None and dist_h(g["h"], h) <= tol]
            alvo = min(perto, key=lambda g: dist_h(g["h"], h)) if perto else None
            if not alvo: alvo = {"h": h, "n": 0, "cores": {}, "hx": 0.0, "hy": 0.0}; grupos.append(alvo)
        alvo["cores"][c] = n
        alvo["n"] += n
    # o pequeno não é uma cor do bicho (olho, bochecha, brilhinho)
    grupos = [g for g in grupos if g["n"] / total >= 0.04]
    # neutro só conta se for parte grande (barriga branca, bicho cinza)
    grupos = [g for g in grupos if g["h"] is not None or g["n"] / total >= 0.12]
    grupos.sort(key=lambda g: -g["n"])
    out = []
    for g in grupos[:3]:
        cores = sorted(g["cores"].items(), key=lambda x: brilho(x[0]))
        n = sum(x[1] for x in cores)
        # 5 pedaços de luz com o mesmo tanto de pixel; de cada um, a cor que mais aparece
        tons, acum, fatia = [], 0, []
        for c, k in cores:
            fatia.append((c, k)); acum += k
            if acum >= n * (len(tons) + 1) / 5 or (c, k) == cores[-1]:
                melhor = max(fatia, key=lambda x: x[1])[0]
                if melhor not in tons: tons.append(melhor)
                fatia = []
        out.append(["%02x%02x%02x" % t for t in tons[:5]])
    return out

def main():
    res = {}
    for nome in sorted(os.listdir(PASTA)):
        m = re.fullmatch(r"(\d+)\.png", nome)
        if not m: continue
        p = marcar(os.path.join(PASTA, nome))
        if p: res[str(int(m.group(1)))] = p
    dest = os.path.join(RAIZ, "src/data/cores-fusao.json")
    with open(dest, "w") as f: json.dump(res, f, separators=(",", ":"))
    print(len(res), "marcados ->", dest, os.path.getsize(dest), "bytes")

if __name__ == "__main__":
    main()
