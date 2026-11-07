"""A GAMBIARRA ANDANDO, desenhada do zero (o CAIO, nov/2026: "faz do zero").
O robô de gambiarra: as CAIXAS brancas empilhadas com fita, a cara de alto-
falante (dois olhos-tela), os braços de MANGUEIRA laranja, as faíscas
coloridas (elas piscam) e os pés de caixinha.
  k contorno   w caixa   W caixa clara   s caixa na sombra   S sombra escura
  d tela   o mangueira   O mangueira clara   f fita   y faísca"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "w": (236, 234, 224), "W": (242, 240, 233), "s": (190, 186, 176), "S": (141, 138, 130),
    "d": (60, 56, 64), "o": (244, 174, 104), "O": (250, 210, 160), "f": (210, 207, 200), "y": (255, 214, 60),
    "b": (80, 160, 230), "r": (230, 80, 80),
}

FRENTE = [
    ".......kkkkk..y",
    ".......kWwwk.kk",
    ".......kwwsk.k",
    ".....kkkkkkkkk",
    ".....kWwwwwwssk",
    ".....kwkkwwkksk",
    ".....kwkdwwkdsk",
    ".....kwwkkkkwsk",
    "..kk.kwwdddwwsk.kk",
    ".kOokkwwwwwwwskkoOk",
    ".kookkkkkkkkkkkkook",
    "..kokWwwwfwwwwskok",
    "..kokwwwwfwwwwskok",
    "..kkkwwwwfwwwwskkk",
    ".....wwwwfwwwwsk",
    ".....kssssssssSk",
    ".....kkkkkkkkkkk",
    "......kwsk.kwsk",
    ".....kwwsk.kwwsk",
    ".....kkkkk.kkkkk",
]

COSTAS = [
    ".......kkkkk..y",
    ".......kWwwk.kk",
    ".......kwwsk.k",
    ".....kkkkkkkkk",
    ".....kWwwwwwssk",
    ".....kwwwwwwwsk",
    ".....kwwwfwwwsk",
    ".....kwwwfwwwsk",
    "..kk.kwwwfwwwsk.kk",
    ".kOokkwwwwwwwskkoOk",
    ".kookkkkkkkkkkkkook",
    "..kokWwwwwwwwwskok",
    "..kokwwkkkkwwwskok",
    "..kkkwwkddkwwwskkk",
    ".....kwkkkkwwwsk",
    ".....kssssssssSk",
    ".....kkkkkkkkkkk",
    "......kwsk.kwsk",
    ".....kwwsk.kwwsk",
    ".....kkkkk.kkkkk",
]

LADO = [
    "......kkkkk..y",
    "......kWwwk.kk",
    "......kwwsk.k",
    "....kkkkkkkkk",
    "....kWwwwwwsk",
    "....kkkwwwwsk",
    "....kdkwwwwsk",
    "....kkkwwwwsk",
    "....kwwwwwwsk",
    "...kkkkkkkkkkk",
    "..kOkWwwwfwwskk",
    ".kOokwwwwfwwskok",
    "kook.wwwwfwwsk.ok",
    "kok..wwwwfwwsk..k",
    "kk...wwwwfwwsk",
    ".....kssssssSk",
    ".....kkkkkkkkk",
    "......kwsk.kwsk",
    ".....kwwsk.kwwsk",
    ".....kkkkk.kkkkk",
]

PATAS_FRENTE = ((5, 10), (11, 17), 17)
PATAS_LADO = ((5, 10), (11, 17), 17)

if __name__ == "__main__":
    from comum import salvar
    salvar(1065, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, fogo=[("y", "b")], previa=os.environ.get("PREVIA"))
    print("GAMBIARRA: andar feito")
