#!/usr/bin/env python3
"""BLACEPHALON DE CARNAVAL: palhaço de frevo, com a SOMBRINHA na mão direita.

A sombrinha é uma grade feita à mão (gomos rosa, laranja, ouro, verde e azul,
cada um com o lado escuro à esquerda e as pontinhas embaixo), e o cabo passa
por TRÁS da luva — a mão é que segura.

    python3 tools/carnaval_desenhos/blacephalon.py
"""
import comum

# a sombrinha, de cima pra baixo (cada linha centrada no cabo)
SOMBRINHA = [
    "KGK",
    "KgWGK",
    "KOgGWGGVK",
    "KPoOgGGGGvVCK",
    "KpPoOOgGGGGvVVcCK",
    "KpPPoOOOgGGGGvVVVcCCK",
    "KppPPooOOggGGGvvVVccCCK",
    "KKKKKKKKKKKKKKKKKKKKKKK",
    ".KpK.KoK..KgK..KvK.KcK.",
]
CABO = "KgK"
MEIO_X, TOPO, MAO_Y = 72, 5, 51       # o cabo desce até a luva da direita


def desenhar():
    t = comum.tela(806)
    largura = max(len(l) for l in SOMBRINHA)
    linhas = [l.center(largura, ".") for l in SOMBRINHA]
    comum.grade(t, MEIO_X - largura // 2, TOPO, linhas)
    y0 = TOPO + len(SOMBRINHA)
    comum.grade(t, MEIO_X - 1, y0, [CABO] * (MAO_Y - y0), so_vazio=True)
    return t


if __name__ == "__main__":
    comum.salvar(desenhar(), "blacephalon")
