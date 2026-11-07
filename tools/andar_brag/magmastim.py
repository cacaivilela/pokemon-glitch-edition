"""O MAGMASTIM ANDANDO, desenhado do zero (o CAIO, nov/2026: "faz do zero").
O cachorrão: pelo caramelo com RACHADURA DE LAVA (r), a COLEIRA de metal
cinza (g, G), as chamas grandes saindo das orelhas pra cima, o focinho e o
peito creme e as patonas creme. As letras de sempre (tools/andar_brag/diggle.py)
mais: m caramelo escuro, r a lava, g/G o metal da coleira."""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from diggle import CORES as BASE  # noqa: E402

CORES = {**BASE, "m": (175, 119, 60), "r": (255, 96, 30), "g": (150, 146, 142), "G": (92, 88, 86)}

FRENTE = [
    "...ky......................yk...",
    "..kyyk....................kyyk..",
    "..kyok....................koyk..",
    "..koyok..................koyok..",
    "..kooyk...kkkkkkkkkkk....kyook..",
    "..kbook.kkTTTTTTTTTTTkk..koobk..",
    "..kbbokkTttttttttttttttkkkobbk..",
    "..kbbbkTtttrtttttttrttttkkbbbk..",
    "..kbbbktttrrttttttttrtttttkbbk..",
    "..kbbkttttttttttttttttttttkbbk..",
    "...kbkttttkkktttttkkkttttttkk...",
    "...kkttttkkwkttttkkwktttttttk...",
    "....kttttkkkkcccckkkkttttttk....",
    "....ktttttccckkkkccctttttttk....",
    "....kttttcccckkkkcccctttttk.....",
    "....ktttccccccckcccccctttk......",
    ".....kttccckkkkkkkcccttk........",
    "....kGgggggggggggggggggGk.......",
    "....kGgGgGgGgGgGgGgGgGgGk.......",
    "...kttkGGGGGGGGGGGGGGGGkmk......",
    "..kttttcccCCCcccccccctttmk......",
    "..ktrtcccccCccccccccctrttmk.....",
    "..kttcccccccccccccccccttrtk.....",
    "..ktmccccccccccccccccctmttk.....",
    "..kttmcccccccccccccccmttmtk.....",
    "..kmttmmcccccccccccmmttmmk......",
    "..kmmttmmkkkkkkkkkmmttmmmk......",
    "...kccccck.......kccccck........",
    "..kcCcccCck.....kcCcccCck.......",
    "..kccscscck.....kccscscck.......",
    "..kkkkkkkkk.....kkkkkkkkk.......",
    "................................",
]

COSTAS = [
    "...ky......................yk...",
    "..kyyk....................kyyk..",
    "..kyok....................koyk..",
    "..koyok..................koyok..",
    "..kooyk...kkkkkkkkkkk....kyook..",
    "..kbook.kkTTTTTTTTTTTkk..koobk..",
    "..kbbokkTttttttrtttttttkkkobbk..",
    "..kbbbkTttttttrrtttttttTkkbbbk..",
    "..kbbbktttttttrtttttttttttkbbk..",
    "..kbbkttttttrrttttttttttttkbbk..",
    "...kbkttttttrtttttttttttttkk....",
    "...kkttttttttttttttttttttttk....",
    "....ktttttttttttttttttttttk.....",
    "....kmtttttttttttttttttttmk.....",
    "....kmmttttttttttttttttmmk......",
    "....kmmmttttttttttttttmmmk......",
    ".....kmmmmmmmmmmmmmmmmmmk.......",
    "....kGgggggggggggggggggGk.......",
    "....kGgGgGgGgGgGgGgGgGgGk.......",
    "...kttkGGGGGGGGGGGGGGGGkmk..kk..",
    "..kttttttttrtttttttrtttmk..kttk.",
    "..ktrtttttrrttttttrrttttmkkttk..",
    "..kttttttttrtttttttrtttttkttk...",
    "..ktmtttttttttttttttttttmttk....",
    "..kttmttttttttttttttttmttmtk....",
    "..kmttmmccccccccccccmmttmmk.....",
    "..kmmttmmkkkkkkkkkkmmttmmmk.....",
    "...kccccck.......kccccck........",
    "..kcCcccCck.....kcCcccCck.......",
    "..kccscscck.....kccscscck.......",
    "..kkkkkkkkk.....kkkkkkkkk.......",
    "................................",
]

LADO = [
    "...........ky...................",
    "..........kyyk..................",
    "..........kyok..................",
    ".........koyok..................",
    ".........kooyk..................",
    "......kkkkoobkk.................",
    "....kkTTTkkbbbbk................",
    "...kTttttttkbbbk................",
    "..kttttttrrtkbbk................",
    "..kttkkttttttkbk................",
    ".kcckwkttttttttk................",
    "kcccckkttttttttk..........kk....",
    "kkcccccctttttttk.........kttk...",
    "kkkcccccctttttGgk.......kttk....",
    ".kcccccccttttGgGk.......ktk.....",
    "..kkkcccctttGgGgkkkkkkkkktk.....",
    "....kkccctGgGgkmTTTTTTTTTtk.....",
    "......kcccGgGkttttrttttttttk....",
    "......kccccGkttttrrtttttrtttk...",
    "......kcccccttttttrttttrrtttk...",
    "......kccccccttttttttttrttttk...",
    ".......kcccccccccccccccttttmk...",
    ".......kmccccccccccccccmmttmk...",
    ".......kmmccccccccccccmmmtmmk...",
    ".......kmmmkkkkkkkkkkkkmmmmk....",
    "........kccck........kccck......",
    "........kccck........kccck......",
    ".......kcCcck.......kcCcck......",
    ".......kccsck.......kccsck......",
    ".......kkkkkk.......kkkkkk......",
    "................................",
    "................................",
]

PATAS_FRENTE = ((2, 12), (16, 26))
PATAS_LADO = ((7, 14), (20, 27))

if __name__ == "__main__":
    from comum import salvar
    salvar(1036, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, fogo=[("o", "y")], previa=os.environ.get("PREVIA"))
    print("MAGMASTIM: andar feito")
