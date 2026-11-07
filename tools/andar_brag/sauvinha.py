"""A SAUVINHA ANDANDO, desenhada do zero (o CAIO, nov/2026: "faz do zero").
A saúva pequena carregando a FOLHA verde (maior que ela) em cima da cabeça,
presa pelo talo nas pinças: a cabeça com as antenas, os olhos, as pinças,
o corpo em três partes e as perninhas finas.
  k contorno   g folha   G folha escura   V a nervura   r formiga
  R formiga escura   L formiga clara   e olho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "g": (96, 176, 64), "G": (71, 130, 47), "V": (176, 222, 120),
    "r": (150, 44, 36), "R": (111, 33, 27), "L": (182, 107, 102), "e": (24, 20, 32),
}

FRENTE = [
    ".....kkkkkkkkkk",
    "...kkgggVggggggkk",
    "..kggggVgggggggggk",
    ".kgggVggVgggVggggGk",
    ".kggggVgVgVggggggGk",
    ".kgggggVVVgggggggGk",
    "..kGggggVgggggGGGk",
    "...kkGGGGVGGGGGkk",
    ".....kk.kVk.kk",
    "......kkkVkkk",
    ".....krrrrrrrk",
    "....krLkkrkkLrk",
    "....krrkkrkkrrk",
    ".....krrrrrrrk",
    "......kRkkkRk",
    ".kk...krrrrrk...kk",
    "..kkkkrrRRRrrkkkk",
    ".....krRRRRRrk",
    "...kkkrrrrrrrkkk",
    "..kk..kRRRRRk..kk",
    ".kk...krrrrrk...kk",
    "......kkkkkkk",
]

COSTAS = [
    ".....kkkkkkkkkk",
    "...kkgggVggggggkk",
    "..kggggVgggggggggk",
    ".kgggVggVgggVggggGk",
    ".kggggVgVgVggggggGk",
    ".kgggggVVVgggggggGk",
    "..kGggggVgggggGGGk",
    "...kkGGGGVGGGGGkk",
    ".....kk.kVk.kk",
    "......kkkkkkk",
    ".....krrrrrrrk",
    "....krLrrrrrLrk",
    "....krrrrrrrrrk",
    ".....krrrrrrrk",
    "......kkkkkkk",
    ".kk...krrrrrk...kk",
    "..kkkkrrRRRrrkkkk",
    ".....krRRRRRrk",
    "...kkkrrrrrrrkkk",
    "..kk.krRRRRRrk.kk",
    ".kk..krLrrrLrk..kk",
    ".....krrrrrrrk",
    "......kRRRRRk",
    ".......kkkkk",
]

LADO = [
    "....kkkkkkkkkk",
    "..kkgggVggggggkk",
    ".kggggVgggggggggk",
    "kgggVggVgggVggggGk",
    "kggggVgVgVggggggGk",
    "kgggggVVVgggggggGk",
    ".kGggggVgggggGGGk",
    "..kkGGGGVGGGGGkk",
    "......kkVk",
    ".kk..kkVkk",
    "..kkkrrrrrk",
    "...krLrrrrrk",
    "...krrkkrrrk",
    "..kRkrkkrrrk....kkkk",
    "..kRkrrrrrkkkkkkrrrrkk",
    "...kkkrrrkrrrrkrrLrrrrk",
    "......kkkrRRRrkrrrrrrrk",
    ".....kk.kkkkkkkkRRRRRk",
    "....kk.kk..kk..kkkkkk",
    "...kk.kk..kk..kk",
]

PATAS_FRENTE = ((0, 7), (12, 19), 19)
PATAS_LADO = ((3, 9), (9, 17), 18)

if __name__ == "__main__":
    from comum import salvar
    salvar(1045, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, previa=os.environ.get("PREVIA"))
    print("SAUVINHA: andar feito")
