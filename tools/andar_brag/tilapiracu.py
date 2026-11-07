"""O TILAPIRAÇU ANDANDO, desenhado do zero (o CAIO, nov/2026: "faz do zero").
A tilápia lutadora: braço com punho (cinza), perna com pé de nadadeira, a
FAIXA AZUL amarrada na testa (as pontas voando pra trás), a crista, o olho
vermelho e a boca de peixe. As letras do TILAPISH mais: f a faixa, F a faixa
clara, u o punho."""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from tilapish import CORES as BASE  # noqa: E402

CORES = {**BASE, "f": (48, 96, 196), "F": (110, 160, 240), "u": (196, 206, 216), "D": BASE["D"]}

FRENTE = [
    "...........k...k",
    "......k...krk.krk...k",
    "......kk.krrkkrrk..krk",
    ".......krkrrrrrrkkkrrk",
    ".......krrrrRRrrrRrrrk",
    "........kRRRRRRRRRRRk",
    "......kFFFFFFFFFFFFFFFkkk",
    "......kffffffffffffffffFFk",
    "......kaaaaaaaaaaaaakkffk",
    ".....kaAAAkkkdaakkkdakkk",
    ".....kaAAkeeekaakeeekak",
    ".....kaAAkeewkaakeewkak",
    ".....kaaakkkkdaakkkkdak",
    "..kk.kaadaadakppkdaadak.kk",
    ".kuukkaadaadkpPPpkaadakkuuk",
    "kuAuukaadaadkpPPpkaadakuuAuk",
    "kuuuukadaadaakppkdaadakuuuuk",
    ".kuukkadaadaadaadaadakkuuk",
    "..kk.kadaadaadaadaadak.kk",
    "......kDdaadaadaadaaDk",
    ".......kDDdaadaadaDDk",
    ".......kaak......kaak",
    ".......kaak......kaak",
    "......kpprk......kpprk",
    ".....kpPprk......kpPprk",
    "....kppprrk......kppprrk",
    "...kpprrrrk......kpprrrrk",
    "...kkkkkkkk......kkkkkkkk",
]

COSTAS = [
    "...........k...k",
    "......k...krk.krk...k",
    "......kk.krrkkrrk..krk",
    ".......krkrrrrrrkkkrrk",
    ".......krrrrRRrrrRrrrk",
    "........kRRRRRRRRRRRk",
    "......kFFFFFFFFFFFFFFkFFk",
    "......kfffffffffffffkfffk",
    "......kaaaaaaaaaaaakkffFk",
    ".....kaadaadaadaadakkfk",
    ".....kadaadaadaadaadkk",
    ".....kadaadaadaadaadak",
    ".....kadaadaadaadaadak",
    "..kk.kadaadaadaadaadak.kk",
    ".kuukkadaadaadaadaadakkuuk",
    "kuAuukadaadaadaadaadakuuAuk",
    "kuuuukdaadaadaadaadaakuuuuk",
    ".kuukkdaadaadaadaadaakkuuk",
    "..kk.kdaadaadaadaadaak.kk",
    "......kDdaadaadaadaDk",
    ".......kDDdaadaadDDk",
    ".......kaak.....kaak",
    ".......kaak.....kaak",
    "......kpprk.....kpprk",
    ".....kpPprk.....kpPprk",
    "....kppprrk.....kppprrk",
    "...kpprrrrk.....kpprrrrk",
    "...kkkkkkkk.....kkkkkkkk",
]

LADO = [
    "..........k",
    ".........krk.k",
    "........krrkkrk.k",
    ".......krrrrrrkkrk",
    "......krrRrrRrrrrk",
    "......kRRRRRRRRRRk",
    ".....kFFFFFFFFFFFkkkk",
    ".....kffffffffffffFFFk",
    "....kaaAAAaaaaakkfffk",
    "...kaAAkkkaadaadkkFk",
    "...kAAkeeekdaadakk",
    "..kaAAkeewkdaadaak",
    "..kaaakkkkadaadaak",
    "kpkaaaadaadaadaadak",
    "kPpkaaadaadaadaadak",
    "kppkaaadaadaadaadak",
    ".kkkkkadaadaadaadak",
    "kuAAuukdaadaadaadak",
    "kAuuuukaadaadaadak",
    "kuuuuDkdaadaadaak",
    ".kkkkkDdaadaadaDk",
    "....kDDdaadaadaDDk",
    ".....kDDDDDDDDDDk",
    "......kaak..kaak",
    ".....kpprk..kpprk",
    "....kpPprk..kpPprk",
    "...kpprrrk.kpprrrk",
    "...kkkkkkk.kkkkkkk",
]

PATAS_FRENTE = ((3, 12), (17, 26), 21)
PATAS_LADO = ((3, 11), (11, 19), 23)

if __name__ == "__main__":
    from comum import salvar
    salvar(1038, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, previa=os.environ.get("PREVIA"))
    print("TILAPIRAÇU: andar feito")
