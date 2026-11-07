#!/usr/bin/env python3
"""NAGANADEL DE CARNAVAL: mestre da bateria. Usa a mesma MÁSCARA DOURADA do
POIPOLE de Carnaval (é a evolução dele): aqui ela é o aro em volta do olho
— cada pixel que encosta no olho vira ouro, com a ponta da máscara pra trás
— e atrás da crista abre um leque de três plumas (grade feita à mão).

    python3 tools/carnaval_desenhos/naganadel.py
"""
import comum

OLHO = (170, 234, 255)            # o azul do olho (m)
OURO, OURO_ESCURO = comum.CARNAVAL["G"], comum.CARNAVAL["g"]
PONTA = [                         # a ponta da máscara, pra trás do olho
    "KK..",
    "KGK.",
    "KGgK",
    ".KGK",
]
PLUMA = [
    "..KKK..",
    ".KAWAK.",
    "KAWAAaK",
    "KAWAAaK",
    "KAAgAaK",
    "KaAgAaK",
    ".KagaK.",
    ".KagaK.",
    "..KgK..",
    "..KgK..",
    "..KgK..",
]


def desenhar():
    t = comum.tela(804)
    # as plumas, atrás da crista
    for x, y, (a, b) in [(19, 13, ("V", "v")), (25, 9, ("G", "g")), (31, 11, ("P", "p"))]:
        comum.grade(t, x, y, [l.replace("A", a).replace("a", b) for l in PLUMA], so_vazio=True)
    # o aro dourado: o que encosta no olho (e não é olho nem contorno) vira ouro
    px = t.img.load()
    olho = {(x, y) for y in range(t.lado) for x in range(t.lado) if px[x, y][3] and px[x, y][:3] == OLHO}
    aro = set()
    for x, y in olho:
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                v = (x + dx, y + dy)
                if v in olho or not px[v][3] or px[v][:3] == (16, 16, 16):
                    continue
                aro.add(v)
    for x, y in aro:
        px[x, y] = (OURO if (x + y) % 3 else OURO_ESCURO) + (255,)
    comum.grade(t, 22, 26, PONTA)
    return t


if __name__ == "__main__":
    comum.salvar(desenhar(), "naganadel")
