"""O BRIGADEIRINHO ANDANDO (pulando), desenhado do zero (o CAIO, nov/2026: "faz
do zero"). O brigadeiro: a bolinha de chocolate com os GRANULADOS coloridos,
a carinha de bochecha rosa e a forminha de papel rosa franzida embaixo.
  k contorno   c chocolate   C chocolate claro   d chocolate escuro
  f forminha   F forminha clara   R forminha escura   g granulado (cores)
  e olho   p bochecha   w brilho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "c": (122, 70, 44), "C": (162, 126, 107), "d": (90, 52, 33), "f": (230, 70, 110),
    "F": (240, 144, 168), "R": (180, 40, 80), "e": (20, 12, 10), "p": (238, 126, 154), "w": (250, 250, 250),
    "1": (250, 214, 60), "2": (120, 200, 255), "3": (120, 220, 120), "4": (250, 250, 250),
}

FRENTE = [
    ".....kkkkkkk",
    "...kkcC1cc2ckk",
    "..kcCCcc3cccc4k",
    ".kc2Cccc1cc3ccdk",
    ".kcCcckecckecc1dk",
    "kc3ccckwcckwcccdk",
    "kccpcccckkccccpdk",
    "kc1ccc4ccccc2ccdk",
    ".kfFkfFkfFkfFkfk",
    ".kfFfffFfffFfffRk",
    ".kfFfRfFfRfFfRfk",
    "..kfFfRfFfRfFfk",
    "..kRfRfRfRfRfRk",
    "...kkkkkkkkkkk",
]

COSTAS = [
    ".....kkkkkkk",
    "...kkcC1cc2ckk",
    "..kcCCcc3cccc4k",
    ".kc2Cccc1cc3ccdk",
    ".kcCccc4cccccc1dk",
    "kc3ccccc2ccc3ccdk",
    "kccc1cccccc4cccdk",
    "kc1ccc4ccccc2ccdk",
    ".kfFkfFkfFkfFkfk",
    ".kfFfffFfffFfffRk",
    ".kfFfRfFfRfFfRfk",
    "..kfFfRfFfRfFfk",
    "..kRfRfRfRfRfRk",
    "...kkkkkkkkkkk",
]

LADO = [
    "....kkkkkk",
    "..kkcC1cc2kk",
    ".kcCCcc3ccc4k",
    "kc2Cccc1cc3cdk",
    "kekcccccccc1dk",
    "kwkc4ccc3ccccdk",
    "kpccccccccc2dk",
    "kc1ccc4cc1ccdk",
    ".kfFkfFkfFkfk",
    ".kfFfffFfffRk",
    ".kfFfRfFfRfk",
    "..kfFfRfFfk",
    "..kRfRfRfRk",
    "...kkkkkkk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1072, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, previa=os.environ.get("PREVIA"), pulo=True)
    print("BRIGADEIRINHO: andar feito")
