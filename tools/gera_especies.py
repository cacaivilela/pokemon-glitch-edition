#!/usr/bin/env python3
"""Reescreve fusionglitch/especies.js a partir das tabelas do jogo.

A oficina de fora (fusionglitch/) nao importa o codigo do jogo: ela e uma pagina
solta, que precisa funcionar aberta pelo endereco publico, sem servidor. Entao a
lista de especies dela e uma COPIA — e copia feita a mao envelhece. Foi o que
aconteceu: RAMPARDOS e BASTIODON entraram no jogo e a oficina nao soube.

Este script e a resposta: a lista passa a ser GERADA do proprio DB.SPECIES
(tools/especies_do_jogo.mjs carrega o jogo no node; precisa do node). Tudo que
da pra fundir no jogo (especiePorTexto, em src/systems/fusao.js: qualquer
especie que nao seja MEGA nem fusao) esta aqui. Mexeu numa especie? Rode isto.

    python3 tools/gera_especies.py           # reescreve o arquivo
    python3 tools/gera_especies.py --ver     # so diz se esta desatualizado

Cada entrada tem `id`, `dex`, `nome`, `tipos` e, quando o sprite nao e o
numero da Pokedex, `sprite` (o nome do arquivo em assets/sprites/pokemon/, sem
o .png — e o `spriteDex` do jogo), `url` quando o desenho mora num caminho
proprio (a forma unica, o `spriteUrl` do jogo) e `regiao` (ALOLA, GALAR, HISUI,
PALDEA, HACK, BRAGLITCH, ou BONE pros PIKACHU de bone).
"""
import json
import os
import subprocess
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DESTINO = os.path.join(RAIZ, "fusionglitch", "especies.js")

CABECALHO = (
    "// As espécies que existem no POKÉMON GLITCH EDITION — tudo que o DECODIFICADOR\n"
    "// aceita: Kanto, o que vaza da fenda, as formas regionais, as hackeanas, as de\n"
    "// Braglitch, os PIKACHU de boné, o ?????????? e o MISSINGNO. (que não tem\n"
    "// arquivo de sprite: o desenho dele é feito em código, aqui e no jogo).\n"
    "// `sprite` é o arquivo em assets/sprites/pokemon/ quando não é o nº da Pokédex;\n"
    "// `url` é o caminho inteiro do desenho, quando ele mora em outro lugar.\n"
    "// Gerado a partir do DB do jogo (tools/gera_especies.py). Não edite à mão.\n"
)


def montar():
    # A lista sai do JOGO DE VERDADE: tools/especies_do_jogo.mjs carrega o DB no
    # node e devolve tudo que o DECODIFICADOR aceita, na ordem de DB.SPECIES.
    # (Antes era lida tabela por tabela, e cada tabela nova do jogo era uma que a
    # oficina não sabia — o ETERNATUS, de mais.js, foi um.)
    bruto = subprocess.run(["node", os.path.join(RAIZ, "tools", "especies_do_jogo.mjs")],
                           capture_output=True, text=True, check=True, cwd=RAIZ).stdout
    especies = json.loads(bruto)
    corpo = ",\n".join(json.dumps(e, ensure_ascii=False, separators=(",", ": ")) for e in especies)
    return CABECALHO + "export const ESPECIES = [\n" + corpo + "\n];\n", len(especies)


def main():
    novo, quantas = montar()
    velho = open(DESTINO, encoding="utf-8").read() if os.path.exists(DESTINO) else ""
    if "--ver" in sys.argv:
        igual = velho == novo
        print(f"{quantas} espécies — a oficina está "
              + ("em dia" if igual else "DESATUALIZADA (rode sem --ver)"))
        return sys.exit(0 if igual else 1)
    open(DESTINO, "w", encoding="utf-8").write(novo)
    print(f"{quantas} espécies -> fusionglitch/especies.js")


if __name__ == "__main__":
    main()
