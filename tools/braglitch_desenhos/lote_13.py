"""LOTE 13 — o terceiro lendário de Braglitch: Encontrium, a serpente do
Encontro das Águas, que corre entre a mata (Amazonium) e a máquina (Destroium).
Metade água preta do Rio Negro, metade barrenta do Solimões, lado a lado sem
se misturar."""
import math

from pixelart import Tela, clarear, escurecer  # noqa: F401

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)


def _caminho(pontos, passos=10):
    """Catmull-Rom: uma curva lisa passando por todos os `pontos`."""
    ext = [pontos[0]] + list(pontos) + [pontos[-1]]
    saida = []
    for i in range(1, len(ext) - 2):
        p0, p1, p2, p3 = ext[i - 1], ext[i], ext[i + 1], ext[i + 2]
        for k in range(passos):
            u = k / passos
            saida.append(tuple(
                0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * u
                       + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * u * u
                       + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * u ** 3)
                for j in range(len(p1))))
    saida.append(tuple(pontos[-1]))
    return saida


def _duas_aguas(t, marca, trilha, cor_esq, cor_dir):
    """Pinta os pixels `marca` de duas cores conforme o lado da `trilha`
    (esquerda de quem anda por ela = `cor_esq`)."""
    for y in range(t.lado):
        for x in range(t.lado):
            if t.cor(x, y)[:3] != marca[:3]:
                continue
            i = min(range(len(trilha)),
                    key=lambda k: (trilha[k][0] - x) ** 2 + (trilha[k][1] - y) ** 2)
            a = trilha[max(0, i - 1)]
            b = trilha[min(len(trilha) - 1, i + 1)]
            lado = (b[0] - a[0]) * (y - trilha[i][1]) - (b[1] - a[1]) * (x - trilha[i][0])
            t.px(x, y, cor_esq if lado < 0 else cor_dir)


# ------------------------------------------------------------- ENCONTRIUM
def encontrium(t, costas=False):
    """ENCONTRIUM, a serpente do Encontro das Águas: sobe do rio num S enorme,
    o corpo dividido ao comprido em água preta e água barrenta que não se
    misturam, barbatanas de onda e olhos turquesa. ÁGUA/DRAGÃO, lendário."""
    negro = (70, 50, 46, 255)
    negro_e = (46, 34, 34, 255)
    negro_c = (112, 84, 72, 255)
    barro = (206, 150, 88, 255)
    barro_e = (160, 108, 60, 255)
    barro_c = (236, 200, 138, 255)
    espuma = (236, 248, 250, 255)
    turq = (90, 230, 210, 255)
    turq_c = (200, 255, 246, 255)
    glitch_m = (230, 40, 200, 255)
    glitch_c = (60, 220, 255, 255)
    nad = (80, 176, 184, 255)       # a água limpa das barbatanas
    nad_e = (44, 110, 128, 255)
    nad_c = (160, 230, 226, 255)
    rio = (70, 150, 176, 255)       # o rio largo embaixo
    rio_e = (34, 72, 104, 255)
    marca = (1, 2, 3, 255)

    # --- o rio, na base: metade preta, metade barrenta, costura ondulada
    t.elipse(32, 59, 30, 5, marca)
    for y in range(52, 64):
        for x in range(64):
            if t.cor(x, y)[:3] == marca[:3]:
                costura = 32 + 3 * math.sin((y - 52) * 1.1)
                t.px(x, y, rio_e if x < costura else rio)

    # --- barbatanas de onda, abertas dos dois lados: água limpa, verde-azulada
    t.poli([(22, 30), (4, 16), (1, 24), (6, 27), (1, 33), (7, 36), (3, 43), (20, 41)],
           nad_e)
    t.poli([(42, 30), (60, 16), (63, 24), (58, 27), (63, 33), (57, 36), (61, 43), (44, 41)],
           nad)

    # a volta de trás, uma corcova saindo da água à esquerda
    volta = _caminho([(6, 61, 3), (9, 53, 4), (15, 50, 4), (20, 55, 4), (21, 61, 3)])
    for x, y, r in volta:
        t.elipse(x, y, r, r, marca)
    _duas_aguas(t, marca, [(p[0], p[1]) for p in volta], barro, negro)

    # --- o corpo em S: sai do rio, curva, sobe até a cabeça
    trilha = _caminho([(50, 61, 5), (48, 52, 6), (38, 46, 7), (25, 42, 7),
                       (20, 34, 7), (26, 26, 6), (32, 22, 6)])
    for x, y, r in trilha:
        t.elipse(x, y, r, r, marca)

    # --- a cabeça: crânio largo, focinho de dragão, chifres que são ondas
    t.elipse(32, 12, 10, 8, marca)
    t.poli([(23, 13), (41, 13), (38, 23), (26, 23)], marca)
    t.elipse(32, 22, 6, 3, marca)
    t.poli([(24, 10), (16, 15), (24, 18)], marca)              # babados da bochecha
    t.poli([(40, 10), (48, 15), (40, 18)], marca)
    # chifres: cada um uma onda enrolando pra fora
    for lado in (-1, 1):
        cx = 32
        onda = [(cx + lado * 5, 7), (cx + lado * 9, 2), (cx + lado * 15, 1),
                (cx + lado * 19, 3), (cx + lado * 19, 7), (cx + lado * 16, 8)]
        t.linha(onda, marca, 3)
    # tudo que é marca vira duas águas: esquerda preta, direita barrenta
    eixo = [(32, -4), (32, 4), (32, 12), (32, 20)] + [(p[0], p[1]) for p in reversed(trilha)]
    _duas_aguas(t, marca, eixo, barro, negro)

    t.luz(forca=0.28, sombra=0.30, poupar=(espuma[:3], turq[:3], turq_c[:3]))

    # --- detalhes
    # a costura do encontro: um fio de espuma onde as águas se tocam
    for i in range(0, len(trilha) - 1):
        x, y, _ = trilha[i]
        t.px(round(x), round(y), espuma)
    # escamas em cada metade
    for i in range(3, len(trilha) - 6, 5):
        x, y, r = trilha[i]
        t.pxs([(round(x - 3), round(y - 1)), (round(x - 2), round(y + 2))], negro_c)
        t.pxs([(round(x + 3), round(y - 1)), (round(x + 2), round(y + 2))], barro_e)
    # raios das barbatanas
    for a, b in (((20, 32), (4, 19)), ((20, 35), (3, 29)), ((19, 38), (5, 40))):
        t.linha([a, b], nad, 1)
    for a, b in (((44, 32), (60, 19)), ((44, 35), (61, 29)), ((45, 38), (59, 40))):
        t.linha([a, b], nad_c, 1)
    # ondinhas no rio
    t.pxs([(8, 58), (9, 58), (14, 62), (15, 62), (26, 60), (27, 60)], rio)
    t.pxs([(38, 58), (39, 58), (56, 60), (57, 60), (58, 57), (59, 57)], nad_c)
    t.pxs([(43, 58), (44, 57), (45, 57), (54, 56), (55, 56), (3, 58), (4, 57),
           (24, 58), (25, 57)], espuma)
    # pintinhas do chifre, cada uma da cor da outra água
    t.pxs([(16, 2), (20, 3)], barro_e)
    t.pxs([(48, 2), (44, 3)], negro_c)
    if not costas:
        # a costura continua pela cara até a testa
        for y in range(6, 12):
            t.px(32, y, espuma)
        # olhos turquesa amendoados
        for ex, d in ((27, -1), (37, 1)):
            t.poli([(ex - 3 * d, 11), (ex + 3 * d, 13), (ex + 2 * d, 15), (ex - 2 * d, 14)], PRETO)
            t.ret(min(ex - d, ex + 2 * d), 13, max(ex - d, ex + 2 * d), 14, turq)
            t.px(ex, 13, turq_c)
        # narinas e boca com presas
        t.pxs([(30, 20), (34, 20)], PRETO)
        t.linha([(26, 22), (29, 23), (35, 23), (38, 22)], PRETO, 1)
        t.pxs([(29, 24), (35, 24)], BRANCO)
        # a joia no peito: o ponto exato do encontro
        jx, jy, _ = trilha[40]
        t.elipse(round(jx), round(jy), 2, 2, turq)
        t.px(round(jx) - 1, round(jy) - 1, turq_c)
    else:
        # nuca: a costura de espuma descendo o crânio inteiro
        for y in range(5, 23):
            t.px(32, y, espuma)
        t.pxs([(28, 10), (27, 14), (28, 18)], negro_c)
        t.pxs([(36, 10), (37, 14), (36, 18)], barro_e)
    # glitch: pixels fora do lugar, respingando do encontro
    for x, y, c in ((10, 12, glitch_m), (11, 12, glitch_c), (54, 10, glitch_c),
                    (60, 49, glitch_m), (2, 49, glitch_c), (56, 12, glitch_m),
                    (12, 44, glitch_m)):
        t.px(x, y, c)
    # e uma faixa da barbatana escorregou pro lado, como imagem de TV ruim
    for y in (27, 28):
        faixa = [t.cor(x, y) for x in range(44, 64)]
        for x in range(44, 64):
            t.px(x, y, (0, 0, 0, 0))
        for i, c in enumerate(faixa):
            if c[3]:
                t.px(44 + i + 2, y, c if i % 5 else glitch_c)
    t.contorno((20, 22, 34, 255))
    return t


DESENHOS = {1091: (encontrium, "encontrium")}
