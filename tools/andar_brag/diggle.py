"""O DIGGLE ANDANDO, desenhado do zero, pixel por pixel (o CAIO, nov/2026: "faz
do zero"). Três vistas — FRENTE (andando pra baixo), COSTAS (pra cima) e LADO
(pra esquerda; a direita é o espelho) — cada uma com os 4 quadros do passo.

Cada desenho é uma grade de letras (uma letra = um pixel):
  k contorno   c creme   C creme claro   s creme na sombra
  t caramelo   T caramelo claro   b marrom   B marrom escuro
  e a orelha (marrom acinzentado)   E a orelha no escuro
  o fogo laranja   y fogo amarelo   p a língua   w o brilho do olho
"""
CORES = {
    "k": (24, 20, 32), "c": (246, 232, 204), "C": (252, 246, 232), "s": (182, 172, 151),
    "t": (206, 140, 70), "T": (226, 178, 120), "b": (120, 72, 40), "B": (89, 53, 30),
    "e": (160, 127, 104), "E": (120, 92, 72), "o": (255, 120, 40), "y": (255, 214, 90),
    "p": (230, 90, 110), "w": (250, 250, 250),
}

# ------------------------------------------------------------------ DE FRENTE
# a cabeça grandona na frente, as orelhas caídas com a bolinha de fogo na
# ponta, o peito creme, as patinhas e o rabo de fogo aparecendo atrás
FRENTE = [
    "....................ky....",
    "...................kyok...",
    "...................koyk...",
    "......kkkkkkkkk....kook...",
    "....kkTTTTcTTTTkk...kok...",
    "...kTttttcCcttttTk..kck...",
    "..kETttttcCcttttTEk.kck...",
    "..kEbtttccCccttbbEk.kck...",
    ".kEEbtkkkcccckkkbEEkkck...",
    ".kEEbkkwkcccckwkkbEEkck...",
    ".kEEbkkkkcccckkkkbEEkk....",
    ".kEEbtkkcccccckktbEEk.....",
    ".kEEbtcccckkkcccctEEk.....",
    "kooEbtccccckccccctEook....",
    "kyooktcccckpkcccctkooyk...",
    "kooookcccccpccccckoook....",
    ".kook.kccccccccck.kook....",
    "..kk.ktkcccccccktk.kk.....",
    "....kttbcCcccCcbttk.......",
    "....ktbbcccccccbbtk.......",
    "....ktbbscccccsbbtk.......",
    "....kkcscskkkscsckk.......",
    ".....kcck.....kcck........",
    ".....kBBk.....kBBk........",
    ".....kkkk.....kkkk........",
    "..........................",
]

# ------------------------------------------------------------------ DE COSTAS
# a nuca caramelo com a listra creme, as orelhas, o lombo com a mancha marrom,
# a bolinha de fogo do quadril e o rabo de fogo em pé no meio
COSTAS = [
    "...........ky.............",
    "..........kyok............",
    "..........koyk............",
    "......kkkkkookkkk.........",
    "....kkTTTTkcCkTTTkk.......",
    "...kTttttckcCktttTTk......",
    "..kETtttckcCcktttTEk......",
    "..kEttttkcCcktttttEk......",
    ".kEEttttkcCcktttttEEk.....",
    ".kEEbtttkcCcktttbbEEk.....",
    ".kEEbbttkcCcktttbbEEk.....",
    ".kEEbbbtkcCckttbbbEEk.....",
    ".kEEkbbbkcCckbbbbkEEk.....",
    "kooEkkttkcCckttttkEook....",
    "kyookttttkcktttbbbkooyk...",
    "kooooktttttttbbbbbtkook...",
    ".kook.ktttttbbbbbbtk.kk...",
    "..kk.ktcttttbbbbbtck......",
    "....kttccttttbbbtcctk.....",
    "....ktbcccctttttccctk.....",
    "....ktbbscccccccsbbtk.....",
    "....kkcscskkkkkscsckk.....",
    ".....kcck.....kcck........",
    ".....kBBk.....kBBk........",
    ".....kkkk.....kkkk........",
    "..........................",
]

# ------------------------------------------------------------------ DE LADO
# virado pra esquerda: a cabeça na frente (o focinho, o olho, a orelha caída
# com o fogo), o corpo comprido de cachorro com a mancha, o rabo em pé com o
# fogo lá atrás e as quatro patinhas (as de lá mais escuras)
LADO = [
    "......................ky..",
    ".....................kyok.",
    ".....................koyk.",
    ".......kkkkkk........kook.",
    ".....kkTTcTTTkk.......kok.",
    "....kTttcCctttTk......kck.",
    "...kttttcctttttEk.....kck.",
    "..kcttkkcttttEEEk.....kck.",
    ".kcccckwkctttEEEEk....kck.",
    "kkccccckkctttEEEEk....kck.",
    "kkcccccccctbEEEEk....kcck.",
    ".kcccckkcctbEEEEkkkkkkcck.",
    "..kkpkcccbbEEEEkTTTTTtttk.",
    "....kkcccbbkooEktttttbbtk.",
    "......kccckyoookttbbbbbttk",
    "......kcccckoooktttbbbbbtk",
    "......kcccccckktttbbbbbbtk",
    "......kccccccctttttbbbbttk",
    ".......kcccccccccccccctttk",
    ".......kscccccccccccccstk.",
    ".......kssskkkkkkkksssssk.",
    "........ksck......kscsk...",
    "........kBBk.....kBBBk....",
    "........kkkk.....kkkkk....",
    "..........................",
    "..........................",
]

# ------------------------------------------------------------------ O PASSO
# de frente e de costas: as duas patas (a da esquerda nas colunas 5-8, a da
# direita 14-17). De lado: a pata da frente (8-11) e a de trás (17-21).
PATAS_FRENTE = ((4, 9), (13, 18))
PATAS_LADO = ((7, 12), (16, 24))


if __name__ == "__main__":
    import os
    import sys
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from comum import salvar
    salvar(1029, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, fogo=[("o", "y")],
           previa=os.environ.get("PREVIA"))
    print("DIGGLE: andar feito")
