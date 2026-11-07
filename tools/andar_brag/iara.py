"""A IARA ANDANDO (pulando no rabo), desenhada do zero (o CAIO, nov/2026: "faz do
zero"). A sereia do rio: o cabelo comprido verde-água, a pedra brilhante na
testa, os olhos roxos, o corpo e o RABO de peixe com as nadadeiras, e o anel
de água em volta.
  k contorno   t verde-água   T verde-água claro   d escuro   D mais escuro
  p pele clara   e olho   j pedra   a anel de água"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "t": (54, 170, 160), "T": (114, 196, 188), "d": (40, 126, 118), "D": (26, 72, 70),
    "p": (196, 238, 214), "e": (130, 90, 200), "j": (250, 250, 250), "a": (96, 170, 230), "A": (160, 226, 230),
}

FRENTE = [
    "......kkkkk",
    "....kkTTjTTkk",
    "...kTttttttttk",
    "..kTtkkpppkktdk",
    "..kttkepppekttdk",
    "..ktttpppppptttk",
    "..ktdtkpkkpktdtdk",
    ".ktdtkkpppppkktdtk",
    ".ktdk.kppppppk.kdtk",
    ".kdk.kTtppppTtk.kdk",
    "..k..kTttttttk...k",
    ".....kdtttttdk",
    "a.....kdtTtdk.....a",
    "Aa.....kdtdk.....aA",
    ".Aa...kdTtTdk...aA",
    "..Aa.kdtkkktdk.aA",
    "...AkTTk...kTTkA",
    "....kkk.....kkk",
]

COSTAS = [
    "......kkkkk",
    "....kkTTtTTkk",
    "...kTttttttttk",
    "..kTtttttttttdk",
    "..kttttttttttdk",
    "..ktttttttttttk",
    "..ktdttttttttdtdk",
    ".ktdttttttttttdtk",
    ".ktdtttttttttttdtk",
    ".kdttkTtttttTtkttdk",
    ".kdk.kTttttttk.kdk",
    "..k..kdtttttdk...k",
    "a.....kdtTtdk.....a",
    "Aa.....kdtdk.....aA",
    ".Aa...kdTtTdk...aA",
    "..Aa.kdtkkktdk.aA",
    "...AkTTk...kTTkA",
    "....kkk.....kkk",
]

LADO = [
    ".....kkkkk",
    "...kkTTjTkk",
    "..kTtttttttk",
    ".kkkpptttttdk",
    ".kepppttttttdk",
    "kpppppttttttdk",
    ".kkpppkttttdtdk",
    "...kppkkttdtdtk",
    "...kpppkktdtdtk",
    "...kTtpppkkdtdk",
    "...kTttttk.kdk",
    "....kdtttdk",
    "a....kdtTtk.......a",
    "Aa....kdtdtk.....aA",
    ".Aa....kdtTdk..kkaA",
    "..Aa....kdttdkkTTk",
    "...Aa....kkdttTk",
    ".........kkkkkk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1077, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, fogo=[("a", "A")], previa=os.environ.get("PREVIA"), pulo=True)
    print("IARA: andar feito")
