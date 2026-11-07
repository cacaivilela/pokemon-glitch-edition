#!/usr/bin/env python3
"""POIPOLE DE CARNAVAL: o mais novo da ala das crianças, de MÁSCARA DE BAILE
(colombina) dourada, com os buracos certinhos nos dois olhos azuis dele e uma
pena rosa saindo da ponta da direita. Tudo grade feita à mão.

    python3 tools/carnaval_desenhos/poipole.py
"""
import comum

# canto de cima em (31, 63): os olhos ficam em x 37-42 e 45-51, y 69-72
MASCARA = [
    "KK........................KK",
    "KGK......................KGK",
    "KGGKK..................KKGGK",
    "KGGGGKKKKKKKKKKKKKKKKKKGGGGK",
    ".KGGWGGGGGGGPGGPGGGGGGGGGGK.",
    ".KGgGGGGGGGGGGGGGGGGGGGGGgK.",
    "..KGgG......GG.......GgGK...",
    "...KgG......Gg.......GgK....",
    "....KK......KK.......KK.....",
]
PENA = [
    "..KK.",
    ".KPWK",
    "KPPpK",
    "KPPpK",
    "KPpK.",
    "KppK.",
    "KpK..",
    "KK...",
]


def desenhar():
    t = comum.tela(803)
    comum.grade(t, 31, 63, MASCARA)
    comum.grade(t, 56, 56, PENA)
    return t


if __name__ == "__main__":
    comum.salvar(desenhar(), "poipole")
