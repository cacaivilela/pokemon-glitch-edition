# -*- coding: utf-8 -*-
"""SEIS FUSÕES DESENHADAS NO CÓDIGO, PRA PUBLICAR NO FUSIONGLITCH.

Cada uma é uma função que desenha o bicho em 64x64 com as ferramentas de
tools/pixelart.py, mais a ficha (nome, tipos, quanto sobe cada stat por nível).
A ordem de dentro de cada desenho é sempre a mesma: formas -> luz -> detalhes
-> contorno. Detalhe (olho, boca, chama) vem DEPOIS da luz pra não levar sombra.

  python3 tools/fusoes_iradas.py            # só mostra: escreve a folha de contato
  python3 tools/fusoes_iradas.py --publicar # manda pro dev_server, que grava no jogo
"""
import json
import math
import sys
import urllib.request

sys.path.insert(0, __file__.rsplit("/", 1)[0])
from pixelart import Tela, clarear                           # noqa: E402

clarear_bloco = lambda c: clarear(c, 0.25)

PRETO = (26, 22, 34, 255)
BRANCO = (255, 255, 255, 255)


# --------------------------------------------------------------------------
def bulbaceus(t):
    """BULBASAUR + ARCEUS. O bicho que criou o mundo, com uma semente nas
    costas — a roda de ouro virou uma coroa de folhas."""
    creme = (238, 232, 214, 255)
    verde = (112, 190, 120, 255)
    verde_e = (58, 132, 76, 255)
    ouro = (246, 198, 76, 255)

    # a roda, atrás de tudo, com folhas no lugar das pontas
    t.anel(36, 37, 20, 16, ouro, 3)
    for i in range(6):
        a = math.pi * 2 * i / 6 + 0.35
        x, y = 36 + math.cos(a) * 19, 37 + math.sin(a) * 15
        dx, dy = math.cos(a) * 8, math.sin(a) * 8
        t.poli([(x - dy * .35, y + dx * .35), (x + dx, y + dy),
                (x + dy * .35, y - dx * .35)], verde_e)

    t.elipse(35, 38, 15, 10, creme)                    # corpo
    t.poli([(25, 37), (20, 21), (12, 21), (22, 40)], creme)   # pescoço
    for x in (21, 28, 41, 47):                         # quatro patas
        t.ret(x, 43, x + 4, 57, creme)
        t.ret(x, 54, x + 4, 57, ouro)
    t.elipse(44, 27, 9, 8, verde)                      # a semente das costas
    t.elipse(15, 18, 9, 8, verde)                      # cabeça
    t.elipse(8, 21, 5, 4, verde)                       # focinho
    t.poli([(8, 11), (3, 4), (12, 10)], verde_e)       # orelhas
    t.poli([(19, 10), (23, 3), (23, 12)], verde_e)

    t.luz()

    for x in range(7, 23):                             # a faixa de ouro na testa
        t.px(x, 13 + (1 if x < 10 or x > 19 else 0), ouro)
        t.px(x, 14 + (1 if x < 10 or x > 19 else 0), ouro)
    for cx, cy in ((10, 17), (19, 16)):                # olhos vermelhos
        t.ret(cx, cy, cx + 2, cy + 2, (196, 48, 62, 255))
        t.px(cx, cy, BRANCO)
    t.linha([(4, 23), (13, 24)], (40, 90, 52, 255))    # a boca larga
    for cx, cy in ((40, 23), (47, 26), (43, 31)):      # manchas da semente
        t.elipse(cx, cy, 2, 2, verde_e)

    t.contorno()
    return t


def gengalure(t):
    """GENGAR + CHANDELURE. O sorriso ficou; o resto virou lustre. As chamas
    são a mesma sombra dele, só que acesa."""
    roxo = (122, 84, 156, 255)
    roxo_e = (74, 48, 100, 255)
    chama = (206, 150, 255, 255)
    chama_c = (250, 240, 255, 255)

    t.elipse(32, 24, 14, 13, roxo)                     # cabeça
    for i in range(9):                                 # os espinhos do GENGAR
        a = math.pi * (0.08 + i / 9)
        x, y = 32 - math.cos(a) * 14, 24 - math.sin(a) * 13
        t.poli([(x - 3, y + 2), (x + math.cos(a) * -5, y - math.sin(a) * 5), (x + 3, y + 2)], roxo)
    t.poli([(26, 36), (38, 36), (36, 49), (28, 49)], roxo_e)   # o corpo do lustre
    t.poli([(28, 48), (36, 48), (34, 58), (32, 52), (30, 58)], roxo_e)  # a ponta de fantasma
    t.linha([(26, 39), (14, 35)], roxo_e, 2)           # os dois braços
    t.linha([(38, 39), (50, 35)], roxo_e, 2)
    t.elipse(13, 34, 3, 3, roxo_e)
    t.elipse(51, 34, 3, 3, roxo_e)

    t.luz(poupar=())

    for cx, cy in ((13, 30), (51, 30), (32, 7)):       # três chamas
        t.poli([(cx - 4, cy + 4), (cx, cy - 6), (cx + 4, cy + 4)], chama)
        t.poli([(cx - 2, cy + 4), (cx, cy - 2), (cx + 2, cy + 4)], chama_c)
    for cx, cy in ((25, 21), (39, 21)):                # olhos
        t.elipse(cx, cy, 3, 3, (240, 60, 70, 255))
        t.px(cx - 1, cy - 1, BRANCO)
    t.ret(21, 28, 43, 30, BRANCO)                      # o sorriso
    for x in range(22, 43, 3):
        t.ret(x, 30, x + 1, 31, BRANCO)
    for x in range(23, 43, 3):
        t.px(x, 29, roxo_e)

    t.contorno()
    return t


def arcados(t):
    """ARCANINE + ZAPDOS. Cachorro com asa de raio: a juba pegou eletricidade
    e ficou em pé pra sempre."""
    amarelo = (250, 206, 62, 255)
    laranja = (238, 138, 58, 255)
    creme = (250, 240, 214, 255)
    preto = (54, 46, 60, 255)

    for lado in (-1, 1):                               # asas de penas duras
        bx = 32 + lado * 13
        pontos = [(bx, 22), (bx + lado * 20, 14), (bx + lado * 14, 24),
                  (bx + lado * 22, 26), (bx + lado * 12, 32), (bx + lado * 18, 38),
                  (bx, 40)]
        t.poli(pontos, amarelo)
        for i in range(3):                             # recortes: pena, não mancha
            ax = bx + lado * (9 + i * 4)
            t.poli([(ax, 18 + i * 7), (ax + lado * 9, 21 + i * 7),
                    (ax, 24 + i * 7)], (0, 0, 0, 0))
    t.elipse(32, 38, 12, 12, amarelo)                  # corpo
    t.elipse(30, 42, 8, 7, creme)                      # peito
    t.poli([(42, 42), (56, 40), (50, 47), (60, 52), (46, 50)], amarelo)   # cauda-raio
    for x in (24, 36):                                 # patas
        t.ret(x, 47, x + 5, 58, laranja)
        t.ret(x, 55, x + 5, 58, creme)
    t.elipse(31, 18, 10, 9, laranja)                   # cabeça
    t.elipse(23, 21, 6, 5, laranja)                    # focinho
    for i in range(7):                                 # juba espetada
        a = math.pi * (0.15 + i / 7.5)
        x, y = 31 - math.cos(a) * 11, 18 - math.sin(a) * 10
        t.poli([(x - 3, y + 2), (x - math.cos(a) * 6, y - math.sin(a) * 6), (x + 3, y + 2)], creme)

    t.luz()

    t.ret(27, 11, 29, 15, preto)                       # as listras
    t.ret(33, 10, 35, 14, preto)
    t.ret(26, 46, 28, 50, preto)
    for cx, cy in ((26, 17), (35, 16)):                # olhos
        t.ret(cx, cy, cx + 2, cy + 2, preto)
        t.px(cx, cy, BRANCO)
    t.elipse(19, 20, 2, 2, preto)                      # nariz
    t.linha([(19, 23), (25, 24)], preto)               # boca
    t.pxs([(52, 44), (54, 43), (56, 45)], BRANCO)      # faísca na cauda

    t.contorno()
    return t


def mewtwno(t):
    """MEWTWO + MISSINGNO. Metade dele é o experimento; a outra metade é o
    pedaço do jogo que nunca terminou de carregar.

    A corrupção não é um muro do lado: ela COME o bicho. As linhas do lado
    direito escorregam pro lado, como tela travada, e por cima entram os blocos
    cinzas — que é exatamente o que o MISSINGNO. é."""
    pele = (228, 224, 240, 255)
    pele_e = (176, 170, 200, 255)
    roxo = (146, 116, 180, 255)
    cinza = (176, 176, 184, 255)
    cinza_e = (72, 72, 82, 255)

    t.linha([(30, 46), (42, 50), (50, 58)], roxo, 4)   # o rabo grosso, atrás
    t.elipse(25, 34, 10, 9, pele)                      # peito
    t.elipse(25, 43, 7, 6, pele)                       # cintura
    t.elipse(25, 48, 9, 5, pele_e)                     # quadril
    for x in (18, 27):                                 # pernas grossas
        t.poli([(x, 48), (x + 7, 48), (x + 6, 58), (x - 1, 58)], pele)
        t.ret(x - 2, 56, x + 7, 59, pele_e)
    t.poli([(16, 30), (9, 39), (13, 47), (17, 45), (13, 39), (20, 33)], pele)   # braço
    t.poli([(34, 30), (41, 39), (37, 47), (33, 45), (37, 39), (30, 33)], pele)
    t.ret(22, 22, 28, 30, pele)                        # o tubo do pescoço
    t.linha([(28, 26), (34, 30), (32, 36)], pele_e, 3)  # o tubo que desce pras costas
    t.elipse(25, 15, 8, 9, pele)                       # cabeça
    t.poli([(19, 14), (8, 20), (12, 25), (20, 19)], pele_e)   # os dois chifres
    t.poli([(31, 14), (42, 20), (38, 25), (30, 19)], pele_e)

    t.luz()

    for cx, cy in ((21, 13), (28, 13)):                # olhos
        t.ret(cx, cy, cx + 2, cy + 2, (132, 96, 196, 255))
        t.px(cx, cy, BRANCO)
    t.linha([(23, 19), (27, 19)], pele_e)

    # A CORRUPÇÃO. Padrão fixo: o mesmo desenho tem que sair igual toda vez.
    for y, quanto in ((33, 6), (34, 6), (35, -4), (45, 7), (46, 7),
                      (52, 8), (53, 8)):
        linha = [t.cor(x, y) for x in range(t.lado)]
        for x in range(t.lado):
            c = linha[(x - quanto) % t.lado]
            if c[3]:
                t.px(x, y, c)
    # nenhum bloco em cima do rosto: a cara é o que faz reconhecer o MEWTWO
    blocos = [(36, 6, 12, 3), (44, 11, 15, 4), (36, 22, 12, 3), (46, 27, 13, 5),
              (32, 33, 20, 3), (48, 39, 11, 5), (30, 45, 18, 3), (52, 49, 8, 4),
              (8, 40, 8, 3), (34, 55, 13, 3)]
    for i, (x, y, w, h) in enumerate(blocos):
        t.ret(x, y, x + w, y + h, cinza if i % 2 else cinza_e)
        t.ret(x, y, x + w, y, clarear_bloco(cinza if i % 2 else cinza_e))
    for x, y in ((34, 11), (58, 21), (31, 41), (60, 45), (10, 30)):
        t.ret(x, y, x + 2, y + 1, BRANCO)              # ruído branco

    t.contorno()
    return t


def lapracuno(t):
    """LAPRAS + ARTICUNO. O casco virou geleira e as asas viraram cristal.
    Onde ele passa, o mar fecha por cima."""
    azul = (128, 196, 236, 255)
    azul_e = (66, 120, 196, 255)
    casco = (226, 236, 246, 255)
    fita = (108, 176, 232, 255)

    for lado in (-1, 1):                               # asas de cristal
        bx = 32 + lado * 15
        t.poli([(bx, 40), (bx + lado * 8, 18), (bx + lado * 14, 30),
                (bx + lado * 16, 20), (bx + lado * 19, 40), (bx + lado * 10, 44)], azul)
    t.elipse(33, 44, 18, 12, casco)                    # casco
    t.elipse(33, 47, 15, 9, azul)                      # barriga
    t.poli([(24, 42), (18, 22), (12, 22), (20, 45)], azul)     # pescoço
    t.elipse(15, 18, 9, 8, azul)                       # cabeça
    t.elipse(8, 21, 5, 4, azul)                        # focinho
    t.poli([(10, 10), (8, 2), (14, 9)], fita)          # a crista de três pontas
    t.poli([(15, 9), (15, 1), (20, 8)], fita)
    t.poli([(20, 10), (23, 3), (24, 11)], fita)
    t.linha([(50, 46), (58, 40), (54, 52), (61, 50)], fita, 2)  # a fita da cauda

    t.luz()

    for cx, cy in ((36, 36), (44, 39), (28, 35), (50, 43)):    # picos do casco
        t.poli([(cx - 3, cy + 3), (cx, cy - 4), (cx + 3, cy + 3)], casco)
        t.px(cx, cy - 2, BRANCO)
    for cx, cy in ((10, 17), (19, 16)):                # olhos
        t.ret(cx, cy, cx + 2, cy + 2, (40, 60, 110, 255))
        t.px(cx, cy, BRANCO)
    t.linha([(4, 23), (12, 24)], azul_e)
    t.pxs([(6, 14), (22, 20), (40, 30)], BRANCO)       # brilho de gelo

    t.contorno()
    return t


def oniton(t):
    """ONIX + MAGNETON. A cobra de pedra pegou ímã no meio do corpo e agora
    anda grudando em tudo que é de metal."""
    pedra = (150, 148, 160, 255)
    pedra_e = (96, 94, 108, 255)
    aco = (186, 196, 208, 255)
    vermelho = (208, 66, 62, 255)
    azul = (72, 116, 200, 255)

    corpo = [(16, 58, 9), (14, 46, 8), (20, 36, 8), (30, 30, 8), (40, 26, 7)]
    for i, (x, y, r) in enumerate(corpo):              # os anéis do corpo
        t.elipse(x, y, r, r, aco if i in (1, 3) else pedra)
    t.elipse(46, 17, 10, 9, pedra)                     # cabeça
    t.poli([(44, 9), (48, -2), (52, 9)], pedra_e)      # o chifre
    for x, y in ((14, 46), (30, 30)):                  # os ímãs dos anéis de aço
        t.ret(x - 14, y - 3, x - 6, y + 3, vermelho)
        t.ret(x + 6, y - 3, x + 14, y + 3, azul)
        t.ret(x - 2, y - 11, x + 2, y - 6, aco)        # o parafuso de cima

    t.luz()

    for x, y in ((14, 46), (30, 30)):                  # o olho único do MAGNETON
        t.elipse(x, y, 3, 3, BRANCO)
        t.ret(x - 1, y - 1, x, y + 1, PRETO)
    t.ret(42, 15, 44, 18, BRANCO)                      # olhos do ONIX
    t.ret(49, 14, 51, 17, BRANCO)
    for x in range(40, 54, 3):                         # a boca de pedra
        t.poli([(x, 23), (x + 1, 21), (x + 2, 23)], pedra_e)
    for pontos in ([(24, 40), (21, 43), (25, 44), (22, 47)],
                   [(38, 26), (35, 29), (39, 30), (36, 33)]):
        t.linha(pontos, (255, 236, 120, 255))          # faísca entre os ímãs
    for x, y in ((20, 54), (10, 44), (34, 26)):
        t.elipse(x, y, 2, 2, pedra_e)                  # rachadura

    t.contorno()
    return t


# --------------------------------------------------------------------------
g = lambda hp, atk, df, spa, spd, spe: {"hp": hp, "atk": atk, "def": df,
                                        "spa": spa, "spd": spd, "spe": spe}
i0 = lambda hp=10: {"hp": hp, "atk": 5, "def": 5, "spa": 5, "spd": 5, "spe": 5}

FUSOES = [
    dict(chave="bulbasaur+arceus", id="bulbaceus", nome="BULBACEUS", desenho=bulbaceus,
         tipos=["PLANTA", "NORMAL"], inicial=i0(14), crescimento=g(2.8, 2.2, 2.4, 2.6, 2.6, 2.0),
         lore="A SEMENTE DAS COSTAS É A PRIMEIRA QUE EXISTIU. TUDO QUE É VERDE NO MUNDO VEIO DELA."),
    dict(chave="gengar+chandelure", id="gengalure", nome="GENGALURE", desenho=gengalure,
         tipos=["FANTASMA", "FOGO"], inicial=i0(11), crescimento=g(2.0, 1.6, 1.8, 3.2, 2.0, 2.8),
         lore="AS TRÊS CHAMAS SÃO SOMBRAS ACESAS. QUEM OLHA MUITO TEMPO ESQUECE ONDE DEIXOU A PRÓPRIA."),
    dict(chave="arcanine+zapdos", id="arcados", nome="ARCADOS", desenho=arcados,
         tipos=["FOGO", "ELÉTRICO"], inicial=i0(13), crescimento=g(2.4, 2.8, 2.0, 2.6, 2.0, 3.0),
         lore="CORRE NA FRENTE DA TEMPESTADE E CHEGA ANTES DO TROVÃO. A JUBA NUNCA ABAIXA."),
    dict(chave="mewtwo+missingno", id="mewtwno", nome="MEWTWNO", desenho=mewtwno,
         tipos=["PSÍQUICO", "GLITCH"], inicial=i0(12), crescimento=g(2.2, 2.4, 1.8, 3.4, 2.0, 3.0),
         lore="O EXPERIMENTO DEU CERTO DEMAIS: METADE DELE SAIU DA FITA E NÃO VOLTOU."),
    dict(chave="lapras+articuno", id="lapracuno", nome="LAPRACUNO", desenho=lapracuno,
         tipos=["ÁGUA", "GELO"], inicial=i0(15), crescimento=g(3.0, 2.0, 2.4, 2.6, 2.8, 1.8),
         lore="ATRAVESSA O MAR CONGELANDO O CAMINHO ATRÁS DE SI. NINGUÉM CONSEGUE SEGUIR."),
    dict(chave="onix+magneton", id="oniton", nome="ONITON", desenho=oniton,
         tipos=["PEDRA", "AÇO"], inicial=i0(13), crescimento=g(2.4, 2.6, 3.6, 1.6, 1.8, 1.4),
         lore="OS ANÉIS DO MEIO VIRARAM ÍMÃ. TUDO QUE É DE METAL NA CAVERNA GRUDA NELE."),
]

AUTOR = "CAIO"


def desenhar_todas():
    return [(f, f["desenho"](Tela())) for f in FUSOES]


def main():
    feitas = desenhar_todas()
    if "--publicar" not in sys.argv:
        from pixelart import folha_de_contato
        saida = sys.argv[sys.argv.index("--folha") + 1] if "--folha" in sys.argv else "/tmp/fusoes.png"
        folha_de_contato([t.img for _, t in feitas]).save(saida)
        return print("folha:", saida)

    for f, tela in feitas:
        corpo = json.dumps({"chave": f["chave"], "ficha": {
            "id": f["id"], "nome": f["nome"], "autor": AUTOR, "tipos": f["tipos"],
            "inicial": f["inicial"], "crescimento": f["crescimento"],
            "sprite": tela.png64(), "lore": f["lore"],
        }}).encode()
        req = urllib.request.Request("http://localhost:5190/__ficha", data=corpo,
                                     headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=30) as r:
            print(f["nome"], r.status, r.read().decode())


if __name__ == "__main__":
    main()
