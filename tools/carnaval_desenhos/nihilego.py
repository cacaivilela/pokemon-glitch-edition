#!/usr/bin/env python3
"""NIHILEGO DE CARNAVAL: porta-bandeira. Segura com o tentáculo da direita a
BANDEIRA da escola, verde e rosa com a estrela no meio (grade feita à mão,
o mastro passa por trás do tentáculo), e a aba azul do chapéu vira rosa, tom
por tom.

    python3 tools/carnaval_desenhos/nihilego.py
"""
import comum

BANDEIRA = [
    "KKKKKKKKKKKKKKKKK...",
    "KVWVVVVVVVVVVVVVVKK.",
    "KVVVVVVVVPVVVVVVVVVK",
    "KVVVVVVVPGPVVVVVVVVK",
    "KPPPPPPPGGGPPPPPPPPK",
    "KPPPPGGGGWGGGGPPPPPK",
    "KPPPPPPGGGGGPPPPPPPK",
    "KPPPPPPGgPgGPPPPPPPK",
    "KVVVVVVgVVVgVVVVVVVK",
    "KvVVVVVVVVVVVVVVVVVK",
    "KvvVVVVVVVVVVVVVVVK.",
    ".KKKKKKKKKKKKKKKKKK.",
]
MASTRO = "KhgK"
X_MASTRO, TOPO, FIM = 66, 14, 74

# a aba do chapéu: os três azuis viram três rosas, do escuro pro claro
ABA = {(38, 80, 125): (122, 16, 80), (48, 142, 188): (208, 32, 122), (83, 176, 217): (255, 106, 213)}


def desenhar():
    t = comum.tela(793)
    comum.trocar(t, ABA)
    comum.grade(t, X_MASTRO, TOPO, [MASTRO] * (FIM - TOPO), so_vazio=True)
    comum.grade(t, X_MASTRO + 4, TOPO, BANDEIRA)
    # a ponta do mastro: uma lança dourada
    comum.grade(t, X_MASTRO, TOPO - 4, [".KK.", "KGgK", "KGgK", ".Kg."])
    return t


if __name__ == "__main__":
    comum.salvar(desenhar(), "nihilego")
