"""O MANDACARU ANDANDO (pulando no pé de terra), desenhado do zero (o CAIO,
nov/2026: "faz do zero"). O cacto do sertão: o corpo verde com os gomos e os
espinhos brancos, os dois braços pra cima, a carinha, a FLOR branca no alto e
o montinho de terra embaixo.
  k contorno   g verde   G verde escuro   l verde claro   w espinho/flor
  y miolo da flor   t terra   T terra escura   e olho   p bochecha"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "g": (78, 140, 104), "G": (44, 92, 72), "l": (131, 174, 149), "w": (250, 250, 244),
    "y": (250, 236, 180), "t": (176, 120, 72), "T": (130, 89, 53), "e": (24, 20, 32), "p": (200, 160, 127),
}

FRENTE = [
    ".......kkk",
    "......kwywk",
    ".......kkk",
    "......kglgk",
    ".....kglgGgk",
    ".kk..kwlgGgk..kk",
    "kglk.kglgGwk.kglk",
    "kwlk.kglgGgk.kglk",
    "kglk.kgkgkgk.kgwk",
    "kglkkkgegegkkkglk",
    "kglgggglgGgggggGk",
    ".kGGgwglggGgwgGk",
    "..kkkkgpkkpgkkk",
    ".....kglgGgk",
    ".....kwlgGgk",
    ".....kglgGwk",
    ".....kglgGgk",
    "...kktttttttkk",
    "..kTtttttttttTk",
    "...kkkkkkkkkkk",
]

COSTAS = [
    ".......kkk",
    "......kwywk",
    ".......kkk",
    "......kglgk",
    ".....kglgGgk",
    ".kk..kwlgGgk..kk",
    "kglk.kglgGwk.kglk",
    "kwlk.kglgGgk.kglk",
    "kglk.kglgGgk.kgwk",
    "kglkkkglgGgkkkglk",
    "kglgggglgGgggggGk",
    ".kGGgwglggGgwgGk",
    "..kkkkglgGgkkkk",
    ".....kglgGgk",
    ".....kwlgGgk",
    ".....kglgGwk",
    ".....kglgGgk",
    "...kktttttttkk",
    "..kTtttttttttTk",
    "...kkkkkkkkkkk",
]

LADO = [
    "......kkk",
    ".....kwywk",
    "......kkk",
    ".....kglgk",
    "....kglgGgk",
    "....kwlgGgk..kk",
    "....kglgGwk.kglk",
    "....kgegGgk.kglk",
    "....kglgGgk.kgwk",
    "....kpkgGgkkkglk",
    "....kglgGgggggGk",
    "....kglgGgwgGkk",
    "....kglgGgkkk",
    "....kglgGgk",
    "....kwlgGgk",
    "....kglgGwk",
    "....kglgGgk",
    "..kktttttttkk",
    ".kTtttttttttTk",
    "..kkkkkkkkkkk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1063, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, previa=os.environ.get("PREVIA"), pulo=True)
    print("MANDACARU: andar feito")
