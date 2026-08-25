#!/usr/bin/env python3
"""Reescreve fusionglitch/especies.js a partir das tabelas do jogo.

A oficina de fora (fusionglitch/) nao importa o codigo do jogo: ela e uma pagina
solta, que precisa funcionar aberta pelo endereco publico, sem servidor. Entao a
lista de especies dela e uma COPIA — e copia feita a mao envelhece. Foi o que
aconteceu: RAMPARDOS e BASTIODON entraram no jogo e a oficina nao soube.

Este script e a resposta: a lista passa a ser GERADA de src/data/gen1.js e
src/data/extra.js, que sao as tabelas de verdade. Mexeu numa espécie? Rode isto.

    python3 tools/gera_especies.py           # reescreve o arquivo
    python3 tools/gera_especies.py --ver     # so diz se esta desatualizado
"""
import json
import os
import re
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DESTINO = os.path.join(RAIZ, "fusionglitch", "especies.js")

CABECALHO = (
    "// As espécies que existem no POKÉMON GLITCH EDITION: os 151 de Kanto, as que\n"
    "// vazam de fora dele e o MISSINGNO., que não está em tabela nenhuma e não tem\n"
    "// arquivo de sprite — o desenho dele é feito em código, aqui e no jogo.\n"
    "// Gerado a partir de src/data/gen1.js e src/data/extra.js "
    "(tools/gera_especies.py).\n"
)


def tabela(arquivo):
    """As linhas `dex NOME TIPO1[/TIPO2] ...` daquele arquivo, em ordem."""
    texto = open(os.path.join(RAIZ, "src", "data", arquivo), encoding="utf-8").read()
    bruto = texto.split("const TABLE = `", 1)[1].split("`", 1)[0]
    saida = []
    for linha in bruto.strip().split("\n"):
        partes = linha.split()
        if len(partes) < 3:
            continue
        dex, nome, tipos = int(partes[0]), partes[1], partes[2]
        saida.append({
            "id": re.sub(r"[^a-z0-9]", "", nome.lower()),
            "dex": dex,
            "nome": nome,
            "tipos": tipos.split("/"),
        })
    return saida


def montar():
    # as tres formas do DEOXYS ja estao na TABLE do extra.js, cada uma na
    # propria linha: nao ha nada a acrescentar aqui
    especies = tabela("gen1.js") + tabela("extra.js")
    # o MISSINGNO. nao esta em tabela nenhuma, no jogo nem aqui: ele e o que
    # sobra quando nao ha espécie, e mesmo assim da pra fundir com ele
    especies.append({"id": "missingno", "dex": 0, "nome": "MISSINGNO.", "tipos": ["GLITCH"]})
    corpo = ",".join(json.dumps(e, ensure_ascii=False, separators=(",", ": ")) for e in especies)
    return CABECALHO + "export const ESPECIES = [" + corpo + "];\n", len(especies)


def main():
    novo, quantas = montar()
    velho = open(DESTINO, encoding="utf-8").read() if os.path.exists(DESTINO) else ""
    if "--ver" in sys.argv:
        igual = velho == novo
        return print(f"{quantas} espécies — a oficina está "
                     + ("em dia" if igual else "DESATUALIZADA (rode sem --ver)"))
    open(DESTINO, "w", encoding="utf-8").write(novo)
    print(f"{quantas} espécies -> fusionglitch/especies.js")


if __name__ == "__main__":
    main()
