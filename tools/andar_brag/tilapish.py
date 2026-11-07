"""O TILAPISH ANDANDO, desenhado do zero (o CAIO, nov/2026: "faz do zero").
A tilápia de pé: o corpo alto cinza-azulado com as listras, a CRISTA vermelha
espetada em cima, o olho vermelho, a boquinha rosa de peixe, a nadadeira do
peito e o rabo partido em dois, que são os pés.
  k contorno   a corpo   A corpo claro   d listra   D corpo no escuro
  r vermelho   R vermelho escuro   p rosa   P rosa claro   e olho   w brilho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "a": (164, 178, 190), "A": (191, 201, 210), "d": (110, 124, 140), "D": (90, 102, 120),
    "r": (226, 96, 88), "R": (167, 71, 65), "p": (235, 144, 138), "P": (250, 170, 140),
    "e": (220, 60, 50), "w": (250, 250, 250),
}

FRENTE = [
    "...........k",
    "......k...krk..k",
    "......kk.krrk.krk",
    ".......krkrrrkrrk",
    ".......krrrRrrrRk",
    "........kRRRRRRk",
    ".......kaAAAaaaak",
    "......kaAAadaadaak",
    "......kAAkkdaakkdak",
    ".....kaAkeekaakeekak",
    ".....kaAkewkaakewkak",
    ".....kaaakkdaadkkdak",
    "..kk.kaadaakppkadaak.kk",
    ".kppkkaadakpPPpkdaakkppk",
    ".kpPpkaadakpPPpkdaakpPpk",
    "..kppkaadaakppkadaakppk",
    "...kkkaadaadaadaadaakkk",
    "......kadaadaadaadak",
    "......kDdaadaadaaDk",
    ".......kDDdaadaDDk",
    "........kDDDDDDk",
    ".......kprk..kprk",
    "......kpprk..kpprk",
    ".....kpprrk..kpprrk",
    ".....kkkkkk..kkkkkk",
]

COSTAS = [
    "...........k",
    "......k...krk..k",
    "......kk.krrk.krk",
    ".......krkrrrkrrk",
    ".......krrrRrrrRk",
    "........kRRRRRRk",
    ".......kaaaaaaaak",
    "......kaadaadaadak",
    "......kadaadaadaak",
    ".....kaadaadaadaadk",
    ".....kadaadaadaadak",
    ".....kadaadaadaadak",
    "..kk.kadaadaadaadak.kk",
    ".kppkkadaadaadaadakkppk",
    ".kpPpkadaadaadaadakpPpk",
    "..kppkadaadaadaadakppk",
    "...kkkadaadaadaadakkk",
    "......kdaadaadaadk",
    "......kDdaadaadaDk",
    ".......kDDdaadDDk",
    "........kDDDDDDk",
    ".......kprk..kprk",
    "......kpprk..kpprk",
    ".....kpprrk..kpprrk",
    ".....kkkkkk..kkkkkk",
]

LADO = [
    "........k",
    ".......krk.k",
    "......krrkkrk",
    ".....krrrrrrk",
    "....krrRrrRrrk",
    "....kRRRRRRRk",
    "...kaAAAaaaak",
    "..kaAkkkaaadak",
    "..kAkeekadaadk",
    ".kaAkewkadaadak",
    "kpkakkkaadaadak",
    "kPpkaaadaadaadak",
    "kppkaadaadaadaak",
    ".kkaaadaakkkdaak",
    "..kaadaakppPkdak",
    "..kaadaadkkppkak",
    "...kadaadaadkkak",
    "...kDdaadaadaDk",
    "....kDDdaadaDk",
    ".....kDDDDDDk",
    "......kprkprk",
    ".....kpprkpprk",
    "....kpprrkpprrk",
    "....kkkkkkkkkkk",
]

PATAS_FRENTE = ((5, 12), (13, 20), 21)
PATAS_LADO = ((4, 10), (10, 16), 20)

if __name__ == "__main__":
    from comum import salvar
    salvar(1030, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, previa=os.environ.get("PREVIA"))
    print("TILAPISH: andar feito")
