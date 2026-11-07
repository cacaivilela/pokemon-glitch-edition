"""O TILAPISCO ANDANDO, desenhado do zero (o CAIO, nov/2026: "faz do zero").
O TILAPISH crescido: a crista maior, as nadadeiras do peito compridas e
pontudas e o pé de rabo maior. Mesmas letras do TILAPISH."""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from tilapish import CORES  # noqa: E402

FRENTE = [
    "............k",
    ".......k...krk...k",
    ".......kk.krrk..krk",
    "....k...krkrrrkkrrk",
    "....kk..krrrrRrrrRk..k",
    ".....krkrrRRrrRRrrkkrk",
    ".....krrrRRRRRRRRrrrrk",
    "......kRRRRRRRRRRRRRk",
    "......kaaAAAAaaaaaaak",
    ".....kaAAAadaadaadaaak",
    ".....kAAAkkkdaakkkdaak",
    "....kaAAkeeekaakeeekaak",
    "....kaAAkeewkaakeewkaak",
    "....kaaakkkkdaakkkkdaak",
    ".kk.kaadaadakppkdaadaak.kk",
    "kppkkaadaadkpPPpkaadaakkppk",
    "kpPpkaadaadkpPPpkaadaakpPpk",
    ".kpPpkadaadakppkdaadakpPpk",
    "..kppkadaadaadaadaadakppk",
    "...kkkadaadaadaadaadakkk",
    "......kDdaadaadaadaaDk",
    ".......kDDdaadaadaDDk",
    "........kDDDDDDDDDDk",
    ".......kpprk....kpprk",
    "......kpPprk....kpPprk",
    ".....kppprrk....kppprrk",
    "....kpprrrrk....kpprrrrk",
    "....kkkkkkkk....kkkkkkkk",
]

COSTAS = [
    "............k",
    ".......k...krk...k",
    ".......kk.krrk..krk",
    "....k...krkrrrkkrrk",
    "....kk..krrrrRrrrRk..k",
    ".....krkrrRRrrRRrrkkrk",
    ".....krrrRRRRRRRRrrrrk",
    "......kRRRRRRRRRRRRRk",
    "......kaaaaaaaaaaaaak",
    ".....kaadaadaadaadaak",
    ".....kadaadaadaadaadk",
    "....kaadaadaadaadaadak",
    "....kadaadaadaadaadaak",
    "....kadaadaadaadaadaak",
    ".kk.kadaadaadaadaadaak.kk",
    "kppkkadaadaadaadaadaakkppk",
    "kpPpkadaadaadaadaadaakpPpk",
    ".kpPpkdaadaadaadaadakpPpk",
    "..kppkdaadaadaadaadakppk",
    "...kkkdaadaadaadaadakkk",
    "......kDdaadaadaadaDk",
    ".......kDDdaadaadDDk",
    "........kDDDDDDDDDk",
    ".......kpprk...kpprk",
    "......kpPprk...kpPprk",
    ".....kppprrk...kppprrk",
    "....kpprrrrk...kpprrrrk",
    "....kkkkkkkk...kkkkkkkk",
]

LADO = [
    ".........k",
    "........krk.k",
    ".......krrkkrk.k",
    "......krrrrrrkkrk",
    ".....krrRrrRrrrrk",
    ".....kRRRRRRRRRRk",
    "....kRRRRRRRRRRk",
    "....kaAAAAaaaaak",
    "...kaAAkkkaadaadk",
    "...kAAkeeekdaadak",
    "..kaAAkeewkdaadaak",
    "..kaaakkkkadaadaak",
    "kpkaaaadaadaadaadak",
    "kPpkaaadaadaadaadak",
    "kppkaaadaadaadaadak",
    ".kkaaadaakkkkdaadak",
    "..kaadaakpppPkkdaak",
    "..kaadaadkkpppPkdak",
    "...kadaadaadkkkkdak",
    "...kDdaadaadaadaDk",
    "....kDDdaadaadaDk",
    ".....kDDDDDDDDDk",
    "......kprk.kprk",
    ".....kpprk.kpprk",
    "....kpPprk.kpPprk",
    "...kpprrrkkpprrrk",
    "...kkkkkkkkkkkkkk",
]

PATAS_FRENTE = ((4, 12), (16, 25), 23)
PATAS_LADO = ((3, 10), (10, 18), 22)

if __name__ == "__main__":
    from comum import salvar
    salvar(1037, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, previa=os.environ.get("PREVIA"))
    print("TILAPISCO: andar feito")
