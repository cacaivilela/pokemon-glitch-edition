"""O MEIO PASSO: um quadro novo de andar pra cada boneco do mapa (ideia do CAIO).

Cada folha de assets/sprites/overworld/<nome>.png tem 4 colunas x 3 linhas
(baixo/cima/esquerda): parado, passo A, parado de novo, passo B. Este script
faz assets/sprites/overworld/meio/<nome>.png com 2 colunas x 3 linhas:
MEIO A (entre o parado e o passo A) e MEIO B (entre o parado e o passo B).

O meio é o PARADO, pixel por pixel, com duas mudanças:
  - o corpo inteiro desce 1 pixel (a altura do passo — no passo o corpo desce)
  - o pé que vai sair do chão no passo sobe 1 pixel (o passo sobe ele mais)
Os braços ficam onde estavam: no meio passo ainda não balançaram.

Qual pé sobe sai do próprio passo: de frente e de costas, é a metade (esquerda
ou direita) em que o pé do passo está mais ALTO; de lado, a metade de trás no
A e a da frente no B.

Uso: python3 tools/andar_meio.py [nome ...]   (sem nome = todos)
"""
import sys, os
from PIL import Image

PASTA = os.path.join(os.path.dirname(__file__), "..", "assets", "sprites", "overworld")

def caixa(fr):
    return fr.getbbox()  # (x0, y0, x1, y1) do que não é transparente

def pe_mais_alto(passo, meio_x):
    """De frente/costas: em que metade o pé do passo está levantado (o fundo
    daquela metade mais alto). Devolve "esq" ou "dir"."""
    w, h = passo.size
    def fundo(x0, x1):
        for y in range(h - 1, -1, -1):
            if any(passo.getpixel((x, y))[3] for x in range(x0, x1)):
                return y
        return -1
    return "dir" if fundo(meio_x, w) < fundo(0, meio_x) else "esq"

def meio(parado, passo, linha, lado):
    w, h = parado.size
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    out.paste(parado.crop((0, 0, w, h - 1)), (0, 1))        # o corpo desce 1
    x0, y0, x1, y1 = caixa(out)
    alt_perna = max(2, round((y1 - y0) * 0.12))             # as linhas do pé
    topo = y1 - alt_perna
    meio_x = (x0 + x1) // 2
    if linha == 2:                                          # de lado
        metade = "dir" if lado == "A" else "esq"            # olhando pra esquerda: trás = direita
    else:
        metade = pe_mais_alto(passo, meio_x)
    xs = range(meio_x, w) if metade == "dir" else range(0, meio_x)
    perna = {(x, y): out.getpixel((x, y)) for x in xs for y in range(topo, y1)}
    for (x, y), p in perna.items():
        if p[3]:
            out.putpixel((x, y), (0, 0, 0, 0))
    for (x, y), p in perna.items():
        if p[3]:
            out.putpixel((x, y - 1), p)                     # o pé sobe 1
    return out

def fazer(nome):
    folha = Image.open(os.path.join(PASTA, nome + ".png")).convert("RGBA")
    fw, fh = folha.width // 4, folha.height // 3
    novo = Image.new("RGBA", (fw * 2, fh * 3), (0, 0, 0, 0))
    for linha in range(3):
        q = lambda c: folha.crop((c * fw, linha * fh, (c + 1) * fw, (linha + 1) * fh))
        for i, (col, lado) in enumerate(((1, "A"), (3, "B"))):
            novo.paste(meio(q(0), q(col), linha, lado), (i * fw, linha * fh))
    os.makedirs(os.path.join(PASTA, "meio"), exist_ok=True)
    novo.save(os.path.join(PASTA, "meio", nome + ".png"))

# de MOTO não tem pé pra levantar (subia meia roda): fica sem meio, e o jogo
# usa o passo no lugar
SEM_MEIO = {"motoqueiro"}

if __name__ == "__main__":
    nomes = sys.argv[1:] or sorted(f[:-4] for f in os.listdir(PASTA) if f.endswith(".png") and f[:-4] not in SEM_MEIO)
    for n in nomes:
        fazer(n)
        print("meio:", n)
