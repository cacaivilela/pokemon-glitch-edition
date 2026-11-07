"""O VOLTURG ANDANDO (pulando), desenhado do zero (o CAIO, nov/2026: "faz do
zero"; o desenho de batalha é dele). A planta elétrica laranja em forma de
chama: o corpo com o RAIO marcado, o broto verde de duas folhas em cima e as
mãozinhas redondas.
  k contorno   o laranja   O laranja claro   r laranja escuro   y raio
  g folha   G folha escura   e olho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (38, 47, 9), "o": (232, 139, 36), "O": (230, 198, 55), "r": (255, 115, 0), "y": (174, 255, 0),
    "g": (127, 159, 31), "G": (48, 51, 5), "e": (69, 41, 10),
}

FRENTE = [
    "...kk...kk",
    "..kggk.kggk",
    "...kgkkkgk",
    "....kkgkk",
    ".....kgk",
    "....kOOOk",
    "...kOooook",
    "...kOkookok",
    "..kOoooooook",
    "..kOooykooook",
    ".kOoooykyoooook",
    "kok.kooyykook.kok",
    "kook.kooooooko.kook",
    ".kk.kroooooork..kk",
    "...krrkrrkrrrk",
    "...kkk.kkk.kkk",
]

COSTAS = [
    "...kk...kk",
    "..kggk.kggk",
    "...kgkkkgk",
    "....kkgkk",
    ".....kgk",
    "....kOOOk",
    "...kOooook",
    "...kOooooook",
    "..kOoooooook",
    "..kOoooooooook",
    ".kOoooooooooook",
    "kok.kooooooook.kok",
    "kook.koooooooko.kook",
    ".kk.kroooooork..kk",
    "...krrkrrkrrrk",
    "...kkk.kkk.kkk",
]

LADO = [
    "...kk...kk",
    "..kggk.kggk",
    "...kgkkkgk",
    "....kkgkk",
    ".....kgk",
    "....kOOOk",
    "...kOooook",
    "...kkooooak",
    "..kOoooooook",
    "..kOyooooooook",
    ".kOyykoooooooook",
    "kokyykoooooooook",
    "kook.koooooooook",
    ".kk.kroooooooork",
    "...krrkrrkrrrrk",
    "...kkk.kkk.kkkk",
]

if __name__ == "__main__":
    from comum import salvar
    cores = {**CORES, "a": (69, 41, 10)}
    salvar(1101, FRENTE, COSTAS, LADO, cores, ((0, 0),) * 2, ((0, 0),) * 2, fogo=[("y", "O")], previa=os.environ.get("PREVIA"), pulo=True)
    print("VOLTURG: andar feito")
