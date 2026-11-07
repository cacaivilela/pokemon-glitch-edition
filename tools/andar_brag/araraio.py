"""O ARARAIO ANDANDO (voando aos pulinhos), desenhado do zero (o CAIO, nov/2026:
"faz do zero"). A arara-azul elétrica: o corpo azul, o bicão preto curvo, o
anel amarelo do olho e as ASAS abertas com as pontas de RAIO amarelo (o raio
pisca enquanto ela voa).
  k contorno   b azul   B azul claro   d azul escuro   y raio   Y raio claro
  g bico   G bico claro   e olho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "b": (40, 84, 196), "B": (100, 150, 240), "d": (30, 62, 145), "y": (252, 222, 50),
    "Y": (255, 250, 150), "g": (54, 50, 64), "G": (90, 90, 100), "e": (24, 20, 32),
}

FRENTE = [
    "ky..................yk",
    "kyyk......kkk.....kyyk",
    ".kYyk....kbbbk...kyYk",
    "..kyybk.kbyyybk.kbyyk",
    "..kdbbbkbykeykbkbbbdk",
    "...kdbbbbbgggbbbbbdk",
    "...kdbBbbkgGgkbbBbdk",
    "....kdbbbbkgkbbbbdk",
    ".....kkdbbBBBbbdkk",
    ".......kbBBBBBbk",
    ".......kbbBBBbbk",
    "........kdbbbdk",
    "........kdkkkdk",
    ".......kgk...kgk",
    ".......kk.....kk",
]

COSTAS = [
    "ky..................yk",
    "kyyk......kkk.....kyyk",
    ".kYyk....kbbbk...kyYk",
    "..kyybk.kbbbbbk.kbyyk",
    "..kdbbbkbbbbbbbkbbbdk",
    "...kdbbbbbbbbbbbbbdk",
    "...kdbBbbbbbbbbbBbdk",
    "....kdbbbbbbbbbbbdk",
    ".....kkdbbbbbbbdkk",
    ".......kbbbbbbbk",
    ".......kbbbbbbbk",
    "........kdbbbdk",
    "........kdbbbdk",
    ".........kdbdk",
    "..........kdk",
    "...........k",
]

LADO = [
    "..........ky",
    ".........kyyk",
    "....kkk..kYyk",
    "...kbbbk.kyybk",
    "..kbyyybkkdbbbk",
    "kgkykeybkkdbbbbk",
    "kGgbyyybbbkdbbbk",
    ".kgkbbbbbbbkdbbk",
    "..kkbBBBbbbbkddk",
    "....kBBBBbbbbkk",
    "....kbBBbbbbbbk",
    ".....kdbbbbbbbbkk",
    "......kdkkkkdbbdk",
    ".....kgk....kkddk",
    ".....kk.......kk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1075, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, fogo=[("y", "Y")], previa=os.environ.get("PREVIA"), pulo=True)
    print("ARARAIO: andar feito")
