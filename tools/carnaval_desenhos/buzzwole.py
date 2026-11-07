#!/usr/bin/env python3
"""BUZZWOLE DE CARNAVAL: puxador de bloco. Um COLAR DE FLORES cruzando o
peito (cada flor é a grade FLOR, feita à mão, nas cores do bloco) e uma flor
na ponta de cada antena, como as tiaras de anteninha de bloco.

    python3 tools/carnaval_desenhos/buzzwole.py
"""
import comum

CIMA = 4                      # folga em cima, pras flores das antenas

FLOR = [                      # quatro pétalas e o miolo de ouro
    ".KK.KK.",
    "KXWKXXK",
    "KXXGXXK",
    ".KGgGK.",
    "KXXGXxK",
    "KXXKxxK",
    ".KK.KK.",
]
CORES_FLOR = ["P", "O", "C", "V", "G"]


def desenhar():
    t = comum.tela(794, cima=CIMA)
    # o colar: um U do ombro esquerdo ao direito, passando embaixo do peito
    escuro = {"P": "p", "O": "o", "C": "c", "V": "v", "G": "g"}
    for i, x in enumerate(range(24, 73, 6)):
        y = round(36 + (1 - ((x - 48) / 24) ** 2) * 12) + CIMA
        cor = CORES_FLOR[i % len(CORES_FLOR)]
        comum.grade(t, x - 3, y - 3, [l.replace("X", cor).replace("x", escuro[cor]) for l in FLOR])
    # a tiara de anteninha: uma flor na ponta de cada antena
    for x, y, cor in [(38, 2 + CIMA, "P"), (50, 2 + CIMA, "G")]:
        comum.grade(t, x - 3, y - 3, [l.replace("X", cor).replace("x", escuro[cor]) for l in FLOR])
    return t


if __name__ == "__main__":
    comum.salvar(desenhar(), "buzzwole")
