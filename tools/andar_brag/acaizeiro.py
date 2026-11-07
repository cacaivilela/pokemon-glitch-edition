"""O AÇAIZEIRO ANDANDO (pulando no pé de tronco), desenhado do zero (o CAIO,
nov/2026: "faz do zero"). O pé de açaí: as folhas de palmeira abertas em cima,
a cabeça verde com a carinha, o tronco fino com os anéis, os dois CACHOS de
açaí pendurados como braços e a raiz embaixo. Letras do AÇAIZINHO mais:
t tronco, T tronco escuro, A anel do tronco, v cabeça verde, V cabeça clara."""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from acaizinho import CORES as BASE  # noqa: E402

CORES = {**BASE, "t": (150, 132, 100), "T": (104, 90, 66), "A": (149, 140, 123), "v": (104, 150, 64), "V": (134, 188, 126)}

FRENTE = [
    "...k.......k.......k",
    "..kLk..k..kLk..k..kLk",
    ".kLlLk.kLkkLlkkLk.kLlLk",
    "kLlllLkkLlkllkLlkkLlllLk",
    ".kkllllkLllllllLkllllkk",
    "...kklllllllllllllllkk",
    ".....kkkGGkVVkGGkkk",
    "........kVVVVVVk",
    ".......kVvkkvkkVk",
    ".......kvvkwvwkvk",
    ".......kvvvvvvvvk",
    ".......kvvvkkvvvk",
    "........kkvvvvkk",
    "...kkk...kttTk...kkk",
    "..kbbbk..kAAAk..kbbbk",
    ".kbBbbbkkkttTkkkbbbBbk",
    ".kbbbbbbktttTkbbbbbbk",
    ".kbBbbBbkttTTkbBbbBbk",
    "..kbbbbbkAAAAkbbbbbk",
    "..kbbdbbkttTTkbbdbbk",
    "...kbbbkkttTTkkbbbk",
    "....kbk.kAAAAk.kbk",
    ".....k..kttTTk..k",
    "........kttTTk",
    ".......kTtttTTk",
    "......kTTkkkkTTk",
    "......kkk....kkk",
]

COSTAS = [
    "...k.......k.......k",
    "..kLk..k..kLk..k..kLk",
    ".kLlLk.kLkkLlkkLk.kLlLk",
    "kLlllLkkLlkllkLlkkLlllLk",
    ".kkllllkLllllllLkllllkk",
    "...kklllllllllllllllkk",
    ".....kkkGGkVVkGGkkk",
    "........kVVVVVVk",
    ".......kVvvvvvvVk",
    ".......kvvvvvvvvk",
    ".......kvvvvvvvvk",
    ".......kvvvvvvvvk",
    "........kkvvvvkk",
    "...kkk...kttTk...kkk",
    "..kbbbk..kAAAk..kbbbk",
    ".kbBbbbkkkttTkkkbbbBbk",
    ".kbbbbbbktttTkbbbbbbk",
    ".kbBbbBbkttTTkbBbbBbk",
    "..kbbbbbkAAAAkbbbbbk",
    "..kbbdbbkttTTkbbdbbk",
    "...kbbbkkttTTkkbbbk",
    "....kbk.kAAAAk.kbk",
    ".....k..kttTTk..k",
    "........kttTTk",
    ".......kTtttTTk",
    "......kTTkkkkTTk",
    "......kkk....kkk",
]

LADO = [
    ".....k.......k",
    "....kLk..k..kLk",
    "...kLlLk.kLkkLlk",
    "..kLlllLkkLlkllLk",
    "...kkllllkLllllllk",
    ".....kklllllllllkk",
    ".......kkGGkVVkk",
    "........kVVVVVk",
    ".......kVkkvvvVk",
    ".......kvkwvvvvk",
    ".......kvvvvvvvk",
    ".......kkvvvvvvk",
    "........kkvvvkk",
    "..........kttTk",
    "..........kAAAkkkk",
    ".........kkttTkbbbk",
    "........kbktttTkbBbk",
    ".......kbBkttTTkbbbbk",
    ".......kbbkAAAAkbBbbk",
    "........kbkttTTkbbdbk",
    ".........kkttTTkkbbk",
    "..........kAAAAk.kbk",
    "..........kttTTk..k",
    "..........kttTTk",
    ".........kTtttTTk",
    "........kTTkkkkTTk",
    "........kkk....kkk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1048, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, previa=os.environ.get("PREVIA"), pulo=True)
    print("AÇAIZEIRO: andar feito")
