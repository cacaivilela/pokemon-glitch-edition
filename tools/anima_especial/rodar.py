#!/usr/bin/env python3
"""Roda os roteiros das animações especiais (ver base.py).

    python3 tools/anima_especial/rodar.py saci braseagle   # gera e grava no jogo
    python3 tools/anima_especial/rodar.py saci --ver       # só a prévia (dev/captures/anima_<id>.png)
    python3 tools/anima_especial/rodar.py saci --costas    # a DE COSTAS (o roteiro tem `quadros_costas(b)`,
                                                           # com o desenho de back/<chave>.png)
"""
import importlib
import os
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
import base  # noqa: E402

if __name__ == "__main__":
    ver = "--ver" in sys.argv
    costas = "--costas" in sys.argv
    for nome in [a for a in sys.argv[1:] if not a.startswith("--")]:
        r = importlib.import_module("roteiros." + nome)
        if costas:
            arq = getattr(r, "ARQUIVO_COSTAS", None) or os.path.join(base.SPR, "back", r.CHAVE + ".png")
            b = base.Base(arq, getattr(r, "MARGEM_COSTAS", getattr(r, "MARGEM", (12, 20, 12, 4))))
            fs = r.quadros_costas(b)
        else:
            arq = getattr(r, "ARQUIVO", None) or os.path.join(base.SPR, r.CHAVE + ".png")
            b = base.Base(arq, getattr(r, "MARGEM", (12, 20, 12, 4)))
            fs = r.quadros(b)
        dest = os.path.join(base.ROOT, "dev", "captures", f"anima_{nome}{'_costas' if costas else ''}.png")
        if not ver:
            fs_cortados = base.salvar(r.CHAVE, fs, "c" if costas else "f")
            fs = list(zip(fs_cortados, [ms for _, ms in fs]))
        base.previa(fs, dest)
        total = sum(ms for _, ms in fs)
        print(f"{nome}: {len(fs)} quadros, {total} ms{' (só prévia)' if ver else ''} -> {dest}")
