#!/usr/bin/env python3
"""Reescreve fusionglitch/especies.js a partir das tabelas do jogo.

A oficina de fora (fusionglitch/) nao importa o codigo do jogo: ela e uma pagina
solta, que precisa funcionar aberta pelo endereco publico, sem servidor. Entao a
lista de especies dela e uma COPIA — e copia feita a mao envelhece. Foi o que
aconteceu: RAMPARDOS e BASTIODON entraram no jogo e a oficina nao soube.

Este script e a resposta: a lista passa a ser GERADA das tabelas de verdade —
as mesmas que src/data/index.js junta em DB.SPECIES: gen1.js, extra.js,
iniciais.js, eras.js, regionais.js, bones.js e decamark.js. Tudo que da pra
fundir no jogo (especiePorTexto, em src/systems/fusao.js: qualquer especie que
nao seja MEGA nem fusao) tem que estar aqui. Mexeu numa especie? Rode isto.

    python3 tools/gera_especies.py           # reescreve o arquivo
    python3 tools/gera_especies.py --ver     # so diz se esta desatualizado

Cada entrada tem `id`, `dex`, `nome`, `tipos` e, quando o sprite nao e o
numero da Pokedex, `sprite` (o nome do arquivo em assets/sprites/pokemon/, sem
o .png — e o `spriteDex` do jogo) e `regiao` (ALOLA, GALAR, HISUI, PALDEA, ou
BONE pros PIKACHU de bone).
"""
import json
import os
import re
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DESTINO = os.path.join(RAIZ, "fusionglitch", "especies.js")

CABECALHO = (
    "// As espécies que existem no POKÉMON GLITCH EDITION: os 151 de Kanto, as que\n"
    "// vazam de fora dele (iniciais, eras, formas regionais, os PIKACHU de boné, o\n"
    "// ??????????) e o MISSINGNO., que não está em tabela nenhuma e não tem arquivo\n"
    "// de sprite — o desenho dele é feito em código, aqui e no jogo.\n"
    "// `sprite` é o arquivo em assets/sprites/pokemon/ quando não é o nº da Pokédex.\n"
    "// Gerado a partir de src/data/ (tools/gera_especies.py). Não edite à mão.\n"
)


def ler(arquivo):
    return open(os.path.join(RAIZ, "src", "data", arquivo), encoding="utf-8").read()


def slug(nome):
    """O mesmo `slugify` de src/data/gen1.js: minúsculas, só [a-z0-9]."""
    return re.sub(r"[^a-z0-9]", "", nome.lower())


def tabela(arquivo, variavel="TABLE"):
    """As linhas `dex NOME TIPO1[/TIPO2] hp atk def spa spd spe` daquele
    arquivo, em ordem. O nome pode ter espaço (GREAT TUSK, nas eras): os tipos
    são sempre o 7º campo de trás pra frente, e o nome é o que sobra no meio."""
    texto = ler(arquivo)
    bruto = texto.split(f"const {variavel} = `", 1)[1].split("`", 1)[0]
    saida = []
    for linha in bruto.strip().split("\n"):
        partes = linha.split()
        if len(partes) < 9:
            continue
        dex, nome, tipos = int(partes[0]), " ".join(partes[1:-7]), partes[-7]
        saida.append({"id": slug(nome), "dex": dex, "nome": nome, "tipos": tipos.split("/")})
    return saida


def regionais():
    """As tabelas com `|` de src/data/regionais.js: ALOLA, GALAR, HISUI, PALDEA
    e as BASES (espécies comuns que vieram junto, sem região). A 2ª coluna é o
    id da forma na PokeAPI — o arquivo do sprite; zero = usa o nº da Pokédex."""
    texto = ler("regionais.js")
    saida = []
    for regiao in ["ALOLA", "GALAR", "HISUI", "PALDEA", "BASES"]:
        bruto = texto.split(f"const {regiao} = `", 1)[1].split("`", 1)[0]
        for linha in bruto.strip().split("\n"):
            if "|" not in linha:
                continue
            dex, sprite, nome, tipos, _stats = [c.strip() for c in linha.split("|")]
            e = {"id": slug(nome), "dex": int(dex), "nome": nome, "tipos": tipos.split("/")}
            if int(sprite):
                e["sprite"] = sprite
            if regiao != "BASES":
                e["regiao"] = regiao
            saida.append(e)
    return saida


def bones():
    """Os PIKACHU DE BONÉ de src/data/bones.js, e o PICHU e o RAICHU de cada um.
    O sprite do RAICHU é forma + RAI_SALTO, o do PICHU é forma + PICHU_SALTO —
    lidos do arquivo, pra não desandar se os números mudarem lá."""
    texto = ler("bones.js")
    salto = lambda nome: int(re.search(rf"const {nome} = (\d+);", texto).group(1))
    rai, pichu = salto("RAI_SALTO"), salto("PICHU_SALTO")
    alola = re.search(r'const ALOLA = \{\s*id: "(\w+)",\s*types: \[([^\]]+)\]', texto)
    alola_id = alola.group(1)
    alola_tipos = re.findall(r'"([^"]+)"', alola.group(2))
    saida = []
    for id_, nome, forma in re.findall(r'\["(pika\w+)",\s*"([^"]+)",\s*(\d+),', texto):
        forma = int(forma)
        rai_id = id_.replace("pika", "rai", 1)
        saida.append({"id": id_.replace("pika", "pichu", 1), "dex": 172,
                      "nome": nome.replace("PIKA", "PICHU", 1), "tipos": ["ELÉTRICO"],
                      "sprite": str(forma + pichu), "regiao": "BONÉ"})
        saida.append({"id": id_, "dex": 25, "nome": nome, "tipos": ["ELÉTRICO"],
                      "sprite": str(forma), "regiao": "BONÉ"})
        saida.append({"id": rai_id, "dex": 26, "nome": nome.replace("PIKA", "RAI", 1),
                      "tipos": alola_tipos if id_ == alola_id else ["ELÉTRICO"],
                      "sprite": str(forma + rai), "regiao": "BONÉ"})
    return saida


def decamark():
    """O ??????????: dex 0, sprite pelo id (assets/sprites/pokemon/decamark.png)."""
    texto = ler("decamark.js")
    m = re.search(r'id: ID, dex: 0, name: "([^"]+)", types: \[([^\]]+)\]', texto)
    id_ = re.search(r'const ID = "(\w+)"', texto).group(1)
    return [{"id": id_, "dex": 0, "nome": m.group(1), "tipos": re.findall(r'"([^"]+)"', m.group(2)),
             "sprite": id_}]


def montar():
    # a ordem é a de DB.SPECIES: quem vem antes ganha quando o id repete (as
    # BASES de regionais.js e as três formas do DEOXYS já estão em extra.js)
    fontes = (tabela("gen1.js") + tabela("extra.js") + tabela("iniciais.js")
              + tabela("eras.js", "TABELA") + regionais() + bones() + decamark())
    vistos, especies = set(), []
    for e in fontes:
        if e["id"] in vistos:
            continue
        vistos.add(e["id"])
        especies.append(e)
    # o MISSINGNO. nao esta em tabela nenhuma, no jogo nem aqui: ele e o que
    # sobra quando nao ha espécie, e mesmo assim da pra fundir com ele
    especies.append({"id": "missingno", "dex": 0, "nome": "MISSINGNO.", "tipos": ["GLITCH"]})
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
