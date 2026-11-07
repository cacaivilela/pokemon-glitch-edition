#!/usr/bin/env python3
"""GUZZLORD DE CARNAVAL: o carro alegórico. Os dentes e as listras amarelas
viram LUZINHAS — em faixas, cada uma de uma cor de Carnaval, tom por tom (o
amarelo claro vira o claro da cor, o médio vira o escuro, o marrom do
contorno vira o mais escuro) — e atrás da cabeça abre um leque grande de
plumas (comum.PLUMA).

    python3 tools/carnaval_desenhos/guzzlord.py
"""
import comum

CIMA = 14
AMARELOS = [(253, 210, 60), (197, 148, 33), (106, 74, 15)]      # claro, médio, contorno
LUZES = [("P", "p", "q"), ("C", "c", "d"), ("V", "v", "w"), ("O", "o", "r"), ("G", "g", "h")]
FAIXA = 5                                    # largura de cada faixa de cor, em px
LEQUE = [(41, 10, ("V", "v"), -0.8), (44, 5, ("C", "c"), -0.5), (47, 1, ("P", "p"), -0.2),
         (50, 0, ("G", "g"), 0), (53, 1, ("P", "p"), 0.2), (56, 5, ("C", "c"), 0.5),
         (59, 10, ("V", "v"), 0.8)]
BASE_Y = 30 + CIMA                           # as plumas nascem atrás da cabeça


def desenhar():
    t = comum.tela(799, cima=CIMA)
    px = t.img.load()
    for y in range(t.lado):
        for x in range(t.lado):
            c = px[x, y]
            if not c[3] or c[:3] not in AMARELOS:
                continue
            luz = LUZES[(x // FAIXA) % len(LUZES)]
            px[x, y] = comum.CARNAVAL[luz[AMARELOS.index(c[:3])]] + (255,)
    for bx, topo, cores, inclina in LEQUE:
        comum.pluma(t, bx, topo, BASE_Y, cores, inclina)
    return t


if __name__ == "__main__":
    comum.salvar(desenhar(), "guzzlord")
