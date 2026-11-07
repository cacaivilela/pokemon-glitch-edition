"""O CATORBIS ANDANDO (rolando nas rodinhas), desenhado do zero (o CAIO,
nov/2026: "faz do zero"). A caixa de papelão viva: a caixinha da frente com a
carinha, a caixona de trás com a FITA e a etiqueta, e as rodinhas de carrinho
embaixo (o carrinho sacoleja no pulo).
  k contorno   c papelão   C papelão claro   d papelão escuro   D mais escuro
  f fita   F fita escura   g roda   G roda clara   e olho   p bochecha"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "c": (200, 182, 140), "C": (236, 222, 184), "d": (176, 136, 72), "D": (150, 136, 105),
    "f": (242, 232, 205), "F": (200, 150, 80), "g": (118, 116, 121), "G": (175, 164, 136), "e": (24, 20, 32),
    "p": (240, 170, 150),
}

FRENTE = [
    "....kkkkkkkkkk",
    "...kCCCCCCCCCdk",
    "...kCkekCCkekdk",
    "...kCCCCCCCCCdk",
    "...kCpCkkkCpCdk",
    "...kCCCCCCCCCdk",
    "..kkkkkkkkkkkkkk",
    "..kcffffffffffdk",
    "..kcFkkkkkkkkFdk",
    "..kcFkcccccckFdk",
    "..kcFkcFFFFckFdk",
    "..kcFkkkkkkkkFdk",
    "..kDDDDDDDDDDDDk",
    "..kkkkkkkkkkkkkk",
    "...kgk......kgk",
    "..kgGgk....kgGgk",
    "...kgk......kgk",
]

COSTAS = [
    "..kkkkkkkkkkkkkk",
    "..kCCCCCCCCCCCdk",
    "..kcccccFFccccdk",
    "..kcccccFFccccdk",
    "..kcccccFFccccdk",
    "..kffffffffffffk",
    "..kcccccFFccccdk",
    "..kcccccFFccccdk",
    "..kcckkkkkkkccdk",
    "..kcckCCCCCkccdk",
    "..kcckCdCdCkccdk",
    "..kcckkkkkkkccdk",
    "..kDDDDDDDDDDDDk",
    "..kkkkkkkkkkkkkk",
    "...kgk......kgk",
    "..kgGgk....kgGgk",
    "...kgk......kgk",
]

LADO = [
    "kkkkkkkk",
    "kCCCCCdk",
    "kkekCCdk",
    "kCCCCCdkkkkkkkkkkkkk",
    "kpCkkCdkCCCCCCCCCCCdk",
    "kCCCCCdkcccccFFccccdk",
    "kkkkkkkkcccccFFccccdk",
    ".kdk..kcffffffffffffk",
    ".kdkkkkcccccFFccccdk",
    "..kdddkcckkkkkkkccdk",
    "...kkkkcckCCCCCkccdk",
    "......kcckCdCdCkccdk",
    "......kDDDDDDDDDDDDk",
    "......kkkkkkkkkkkkkk",
    ".......kgk......kgk",
    "......kgGgk....kgGgk",
    ".......kgk......kgk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1085, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, previa=os.environ.get("PREVIA"), pulo=True)
    print("CATORBIS: andar feito")
