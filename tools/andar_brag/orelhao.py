"""O ORELHÃO ANDANDO (pulando no pé), desenhado do zero (o CAIO, nov/2026: "faz
do zero"). O telefone público laranja: a CONCHA em ovo, a carinha amarela
dentro, o aparelho cinza no meio dela, o pé de cano e o fone pendurado no fio.
  k contorno   o laranja   O laranja claro   d laranja escuro   y a cara
  Y a cara clara   g cinza   G cinza claro   D cinza escuro   e olho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "o": (244, 130, 32), "O": (247, 168, 99), "d": (196, 90, 24), "y": (255, 204, 96),
    "Y": (255, 219, 144), "g": (152, 152, 157), "G": (170, 176, 186), "D": (92, 96, 110), "e": (24, 20, 32),
}

FRENTE = [
    ".....kkkkkk",
    "...kkOOoooodkk",
    "..kOOoooooooddk",
    ".kOookkkkkkkoodk",
    ".kOokYYyyyyykodk",
    "kOokYYyyyyyyykodk",
    "kookYykeyyekyykodk",
    "kookyyyyyyyyyykodk",
    "kookyykGGGGkyykodk",
    "kookyykgDgDkyykodk",
    ".kokyykgDgDkyykok",
    ".kookyykkkkyyykodk",
    "..kookkkkkkkkoodk",
    "...kkdoooooddkk",
    ".....kkkkkkk",
    ".......kGgk",
    ".......kGgk.kk",
    ".......kGgkkDDk",
    ".......kGgk.kDk",
    "......kkGgkk",
    ".....kDDDDDDk",
    ".....kkkkkkkk",
]

COSTAS = [
    ".....kkkkkk",
    "...kkOOoooodkk",
    "..kOOoooooooddk",
    ".kOooooooooooodk",
    ".kOooooOoooooodk",
    "kOooooOOooooooodk",
    "koooooOoooooooodk",
    "kooooooooooooooddk",
    "kooooooooooooooddk",
    "kooooooooooooooddk",
    ".kooooooooooooodk",
    ".koooooooooooodk",
    "..koooooooooodk",
    "...kkdoooooddkk",
    ".....kkkkkkk",
    ".......kGgk",
    ".......kGgk",
    ".......kGgk",
    ".......kGgk",
    "......kkGgkk",
    ".....kDDDDDDk",
    ".....kkkkkkkk",
]

LADO = [
    "....kkkkkk",
    "..kkOOooodkk",
    ".kOOoooooodk",
    "kOooookkkkodk",
    "kOoookYyyykdk",
    "koooookYyyyk",
    "koooookyeyyk",
    "koooookyyyyk",
    "koooookGGGk",
    "koooookgDgk",
    "koooookgDgk",
    "kooooookkkk",
    ".koooooodk",
    "..kkdoodkk",
    "....kkkk",
    ".....kGgk",
    ".....kGgk.kk",
    ".....kGgkkDDk",
    ".....kGgk.kDk",
    "....kkGgkk",
    "...kDDDDDDk",
    "...kkkkkkkk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1066, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, previa=os.environ.get("PREVIA"), pulo=True)
    print("ORELHÃO: andar feito")
