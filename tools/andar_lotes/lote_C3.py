"""LOTE C3: Seadra, Seaking, Starmie, Mr. Mime, Jynx, Electabuzz, Magmar,
Pinsir, Tauros, Gyarados e Porygon andando no mapa."""
from andar_base import *  # noqa: F401,F403


def olho3(t, x, y, cor=P_):
    """o olho de 3 de altura (brilho em cima): não some quando o desenho encolhe"""
    t.pxs([(x, y + 1), (x, y + 2)], cor); t.px(x, y, BR)


# ------------------------------------------------------------------- SEADRA
SD, SD_C, SD_E = H("80b8c8"), H("a0d8e0"), H("688098")
SD_BARRIGA, SD_BARRIGA_E = H("f8f8a8"), H("d8c050")
SD_ESCURO = H("204058")


def seadra(t, lado):
    if lado in ("frente", "costas"):
        for d in (-1, 1):                                                   # as barbatanas espinhudas
            t.poli([(12 + 3 * d, 5), (12 + 9 * d, 1), (12 + 7 * d, 5), (12 + 10 * d, 7), (12 + 4 * d, 9)], SD_BARRIGA)
        t.anel(13, 18, 3, 3, SD, 2)                                         # o rabo enrolado
        t.elipse(12, 13, 4, 5, SD)                                          # o corpo
        t.elipse(12, 6, 4, 4, SD)                                           # a cabeça
        sombrear(t, {SD: (SD_C, SD_E), SD_BARRIGA: (SD_BARRIGA, SD_BARRIGA_E)})
        if lado == "frente":
            t.elipse(12, 14, 2, 3, SD_BARRIGA)                              # a barriga em gomos
            t.pxs([(11, 13), (13, 13), (11, 15), (13, 15)], SD_BARRIGA_E)
            t.elipse(12, 9, 1, 1, SD_ESCURO); t.px(12, 9, P_)               # a boca de canudo, de frente
            olho3(t, 10, 4); olho3(t, 14, 4)
        else:
            t.linha([(12, 3), (12, 17)], SD_E, 1)
            t.pxs([(11, 6), (13, 9), (11, 12), (13, 15)], SD_ESCURO)          # as escamas das costas
    else:
        t.poli([(13, 7), (21, 2), (18, 7), (22, 9), (16, 11), (21, 13), (14, 14)], SD_BARRIGA)   # as barbatanas
        t.anel(13, 18, 3, 3, SD, 2)
        t.elipse(12, 13, 4, 5, SD)
        t.elipse(10, 6, 4, 4, SD)
        t.ret(2, 6, 7, 8, SD)                                               # o focinho de canudo
        sombrear(t, {SD: (SD_C, SD_E), SD_BARRIGA: (SD_BARRIGA, SD_BARRIGA_E)})
        t.elipse(9, 13, 1, 3, SD_BARRIGA)
        t.pxs([(9, 12), (9, 14)], SD_BARRIGA_E)
        t.pxs([(2, 6), (2, 7), (2, 8)], SD_ESCURO)
        olho3(t, 9, 3)
    contorno_gba(t)


# ------------------------------------------------------------------ SEAKING
SK, SK_C, SK_E = H("f8f8f8"), H("f8f8f8"), H("a8b0b8")
SK_FIM, SK_FIM_E = H("d0d0d8"), H("808898")
SK_LARANJA, SK_LARANJA_C, SK_LARANJA_E = H("f07858"), H("f8a078"), H("d84020")
SK_BOCA, SK_CHIFRE = H("f8c0c8"), H("505050")


def seaking(t, lado):
    if lado in ("frente", "costas"):
        t.poli([(7, 10), (1, 6), (2, 15)], SK_FIM); t.poli([(17, 10), (23, 6), (22, 15)], SK_FIM)   # as barbatanas véu
        t.poli([(10, 18), (8, 23), (12, 20), (16, 23), (14, 18)], SK_FIM)    # o rabo
        t.elipse(12, 12, 6, 7, SK)
        sombrear(t, {SK: (SK_C, SK_E), SK_FIM: (SK_FIM, SK_FIM_E)})
        t.poli([(11, 6), (12, 0), (13, 6)], SK_CHIFRE)                      # o chifre
        t.elipse(12, 8, 4, 2, SK_LARANJA); t.px(10, 7, SK_LARANJA_C)        # a mancha laranja da testa
        if lado == "frente":
            olho3(t, 9, 9); olho3(t, 15, 9)
            t.elipse(12, 14, 2, 1, SK_BOCA); t.px(12, 14, SK_LARANJA_E)     # o beição
            t.pxs([(8, 16), (16, 16)], SK_LARANJA)
        else:
            t.elipse(12, 13, 3, 3, SK_LARANJA); t.elipse(12, 13, 1, 1, SK_LARANJA_E)
    else:
        t.poli([(16, 12), (23, 5), (21, 12), (23, 20)], SK_FIM)             # o rabo grandão
        t.poli([(8, 6), (12, 1), (16, 6)], SK_FIM)                          # a barbatana de cima
        t.poli([(9, 16), (8, 21), (13, 17)], SK_FIM)
        t.elipse(10, 11, 7, 6, SK)
        sombrear(t, {SK: (SK_C, SK_E), SK_FIM: (SK_FIM, SK_FIM_E)})
        t.poli([(5, 6), (1, 1), (7, 5)], SK_CHIFRE)
        t.elipse(11, 9, 3, 2, SK_LARANJA); t.elipse(13, 14, 2, 2, SK_LARANJA)
        t.px(10, 8, SK_LARANJA_C)
        olho3(t, 6, 8)
        t.elipse(3, 12, 1, 1, SK_BOCA)
    contorno_gba(t)


# ------------------------------------------------------------------ STARMIE
SM, SM_C, SM_E = H("9060a0"), H("b890c8"), H("502060")
SM_OURO, SM_OURO_C, SM_OURO_E = H("c0a010"), H("f0d050"), H("685000")
SM_JOIA, SM_JOIA_C = H("c83058"), H("f8b8a0")


def estrela(t, cx, cy, r, giro, cor):
    import math
    pts = []
    for k in range(10):
        a = giro + k * math.pi / 5
        rr = r if k % 2 == 0 else r * 0.45
        pts.append((cx + rr * math.sin(a), cy - rr * math.cos(a)))
    t.poli(pts, cor)


def starmie(t, lado):
    import math
    estrela(t, 12, 11, 10, math.pi / 5, SM)                                 # a estrela de trás
    if lado == "lado":
        estrela(t, 10, 11, 9, 0.1, SM)
    else:
        estrela(t, 12, 11, 9, 0, SM)                                        # a da frente
    sombrear(t, {SM: (SM_C, SM_E)})
    cx = 10 if lado == "lado" else 12
    if lado == "costas":
        t.elipse(12, 11, 2, 2, SM_OURO); t.px(12, 11, SM_OURO_E)           # o miolo dourado de trás
    else:
        t.elipse(cx, 11, 3, 3, SM_OURO)                                    # a moldura dourada
        t.px(cx - 2, 9, SM_OURO_C); t.pxs([(cx + 2, 13), (cx + 3, 11)], SM_OURO_E)
        t.elipse(cx, 11, 1, 2, SM_JOIA); t.px(cx, 10, SM_JOIA_C)           # a jóia vermelha
    contorno_gba(t)


# ----------------------------------------------------------------- MR. MIME
MM, MM_C, MM_E = H("f8c8c0"), H("f8e0d8"), H("e0a098")
MM_VERM, MM_VERM_C, MM_VERM_E = H("e84838"), H("f87868"), H("b84838")
MM_AZUL, MM_AZUL_C = H("404878"), H("8080a8")
MM_LUVA, MM_LUVA_E = H("f8f8f8"), H("c8d0d8")


def mr_mime(t, lado):
    if lado in ("frente", "costas"):
        t.linha([(8, 3), (5, 1), (3, 3)], MM_AZUL, 2); t.linha([(16, 3), (19, 1), (21, 3)], MM_AZUL, 2)   # o cabelo de chifre
        t.ret(9, 17, 10, 20, MM); t.ret(14, 17, 15, 20, MM)                  # as pernas
        t.elipse(12, 14, 4, 4, MM)                                          # o corpo
        t.elipse(12, 6, 4, 4, MM)                                           # a cabeça
        t.linha([(7, 11), (4, 9)], MM, 1); t.linha([(17, 11), (20, 9)], MM, 1)   # os braços abertos
        t.elipse(3, 8, 2, 2, MM_LUVA); t.elipse(21, 8, 2, 2, MM_LUVA)       # as luvas brancas
        t.elipse(7, 11, 2, 2, MM_VERM); t.elipse(17, 11, 2, 2, MM_VERM)     # as bolotas dos ombros
        t.pxs([(9, 18), (10, 18), (14, 18), (15, 18)], MM_VERM)              # e dos joelhos
        sombrear(t, {MM: (MM_C, MM_E), MM_VERM: (MM_VERM_C, MM_VERM_E), MM_LUVA: (MM_LUVA, MM_LUVA_E)})
        if lado == "frente":
            t.elipse(12, 14, 2, 2, MM_VERM); t.px(11, 13, MM_VERM_C)        # a bola do peito
            olho3(t, 10, 4); olho3(t, 14, 4)
            t.pxs([(9, 7), (15, 7)], MM_VERM)                               # as bochechas
            t.px(12, 8, MM_VERM_E)
        else:
            t.ret(9, 3, 15, 4, MM_AZUL); t.px(12, 3, MM_AZUL_C)
        pes(t, [(8, 21), (9, 21), (10, 21), (14, 21), (15, 21), (16, 21)], MM_AZUL)
    else:
        t.linha([(12, 3), (15, 1), (18, 3)], MM_AZUL, 2)
        t.ret(10, 17, 11, 20, MM); t.ret(14, 17, 15, 20, MM)
        t.elipse(12, 14, 4, 4, MM)
        t.elipse(10, 6, 4, 4, MM)
        t.linha([(10, 11), (5, 9)], MM, 1); t.elipse(4, 8, 2, 2, MM_LUVA)   # a mão de mímica pra frente
        t.elipse(11, 11, 2, 2, MM_VERM)
        t.pxs([(10, 18), (11, 18), (14, 18), (15, 18)], MM_VERM)
        sombrear(t, {MM: (MM_C, MM_E), MM_VERM: (MM_VERM_C, MM_VERM_E), MM_LUVA: (MM_LUVA, MM_LUVA_E)})
        t.ret(11, 3, 14, 4, MM_AZUL)
        olho3(t, 8, 4)
        t.px(7, 7, MM_VERM)
        pes(t, [(9, 21), (10, 21), (11, 21), (14, 21), (15, 21), (16, 21)], MM_AZUL)
    contorno_gba(t)


# --------------------------------------------------------------------- JYNX
JY, JY_C, JY_E = H("e84040"), H("f8a098"), H("b04848")
JY_CABELO, JY_CABELO_C, JY_CABELO_E = H("f8e850"), H("f8f0a8"), H("d0c038")
JY_PELE, JY_PELE_C, JY_PELE_E = H("9048a8"), H("c078d0"), H("683058")


def jynx(t, lado):
    if lado in ("frente", "costas"):
        t.poli([(9, 11), (15, 11), (19, 20), (5, 20)], JY)                  # o vestido vermelho
        t.elipse(12, 7, 7, 6, JY_CABELO)                                    # o cabelão loiro
        if lado == "costas":
            t.poli([(5, 8), (19, 8), (18, 17), (6, 17)], JY_CABELO)         # caindo nas costas
        t.linha([(8, 13), (4, 15)], JY_PELE, 1); t.linha([(16, 13), (20, 15)], JY_PELE, 1)   # os braços
        sombrear(t, {JY: (JY_C, JY_E), JY_CABELO: (JY_CABELO_C, JY_CABELO_E), JY_PELE: (JY_PELE_C, JY_PELE_E)})
        if lado == "frente":
            t.elipse(12, 8, 3, 3, JY_PELE); t.px(10, 6, JY_PELE_C)          # a cara roxa
            t.pxs([(11, 7), (11, 8), (13, 7), (13, 8)], BR); t.pxs([(11, 8), (13, 8)], P_)
            t.linha([(11, 10), (13, 10)], JY, 1)                             # o beiço
            t.elipse(12, 13, 2, 1, JY_E)                                    # o peito
            t.pxs([(4, 15), (20, 15)], JY_PELE_C)
        else:
            t.linha([(12, 3), (12, 16)], JY_CABELO_E, 1)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], JY_PELE_E)
    else:
        t.poli([(9, 11), (14, 11), (18, 20), (6, 20)], JY)
        t.elipse(13, 7, 6, 6, JY_CABELO)
        t.poli([(14, 8), (19, 8), (19, 17), (15, 16)], JY_CABELO)
        t.linha([(10, 13), (5, 15)], JY_PELE, 1)
        sombrear(t, {JY: (JY_C, JY_E), JY_CABELO: (JY_CABELO_C, JY_CABELO_E), JY_PELE: (JY_PELE_C, JY_PELE_E)})
        t.poli([(6, 5), (10, 4), (11, 11), (6, 10)], JY_PELE)                # o rosto de lado
        t.pxs([(7, 7), (7, 8)], BR); t.px(7, 8, P_)
        t.pxs([(6, 10), (7, 10)], JY)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], JY_PELE_E)
    contorno_gba(t)


# --------------------------------------------------------------- ELECTABUZZ
EZ, EZ_C, EZ_E = H("f8e038"), H("f8f8a8"), H("d8b850")
EZ_LISTRA = H("101010")


def electabuzz(t, lado):
    if lado in ("frente", "costas"):
        t.linha([(10, 3), (8, 0)], EZ, 1); t.linha([(14, 3), (16, 0)], EZ, 1)   # as anteninhas
        t.poli([(16, 17), (21, 19), (22, 15)], EZ)                          # o rabo
        t.ret(8, 17, 10, 20, EZ); t.ret(14, 17, 16, 20, EZ)
        t.elipse(12, 14, 6, 5, EZ)                                          # o corpão
        t.elipse(12, 6, 4, 4, EZ)
        t.elipse(5, 13, 2, 3, EZ); t.elipse(19, 13, 2, 3, EZ)               # os braços
        sombrear(t, {EZ: (EZ_C, EZ_E)})
        for y in (12, 15):                                                  # as listras de raio
            t.linha([(7, y), (9, y + 1), (11, y)], EZ_LISTRA, 1); t.linha([(13, y), (15, y + 1), (17, y)], EZ_LISTRA, 1)
        t.pxs([(4, 12), (20, 12), (4, 14), (20, 14)], EZ_LISTRA)
        if lado == "frente":
            for x, d in ((10, 1), (14, -1)):                                # o olhar bravo
                t.pxs([(x, 5), (x, 6), (x - d, 4)], P_)
            t.linha([(11, 8), (13, 8)], EZ_E, 1)
        else:
            t.pxs([(10, 4), (14, 4), (12, 6)], EZ_LISTRA)
        pes(t, [(8, 21), (9, 21), (10, 21), (14, 21), (15, 21), (16, 21)], EZ_E)
    else:
        t.linha([(10, 3), (9, 0)], EZ, 1); t.linha([(12, 3), (14, 0)], EZ, 1)
        t.poli([(16, 16), (23, 17), (21, 13)], EZ)
        t.ret(9, 17, 11, 20, EZ); t.ret(14, 17, 16, 20, EZ)
        t.elipse(13, 14, 5, 5, EZ)
        t.elipse(10, 6, 4, 4, EZ)
        t.elipse(8, 13, 2, 3, EZ)
        sombrear(t, {EZ: (EZ_C, EZ_E)})
        for y in (12, 15):
            t.linha([(12, y), (14, y + 1), (17, y)], EZ_LISTRA, 1)
        t.pxs([(7, 12), (7, 14)], EZ_LISTRA)
        t.pxs([(8, 5), (8, 6), (9, 4)], P_)
        t.px(6, 8, EZ_E)
        pes(t, [(9, 21), (10, 21), (11, 21), (14, 21), (15, 21), (16, 21)], EZ_E)
    contorno_gba(t)



# ------------------------------------------------------------------- MAGMAR
MA, MA_C, MA_E = H("f84808"), H("f8a040"), H("c82840")
MA_AMAR, MA_AMAR_C, MA_AMAR_E = H("f8d000"), H("f8f060"), H("d8a020")


def magmar(t, lado):
    if lado in ("frente", "costas"):
        t.poli([(10, 3), (9, 0), (12, 2), (15, 0), (14, 3)], MA_AMAR)       # a crista de fogo
        t.linha([(16, 18), (20, 17), (21, 13)], MA, 2)                      # o rabo
        t.poli([(20, 13), (19, 9), (23, 11), (22, 14)], MA_AMAR)            # a chaminha da ponta
        t.ret(8, 17, 10, 20, MA); t.ret(14, 17, 16, 20, MA)
        t.elipse(12, 14, 6, 5, MA)
        t.elipse(5, 13, 2, 3, MA); t.elipse(19, 13, 2, 3, MA)
        t.elipse(12, 6, 4, 4, MA)
        if lado == "frente":
            t.elipse(12, 9, 3, 1, MA_AMAR)                                  # o bico
        sombrear(t, {MA: (MA_C, MA_E), MA_AMAR: (MA_AMAR_C, MA_AMAR_E)})
        if lado == "frente":
            t.poli([(8, 12), (12, 10), (16, 12), (15, 18), (12, 16), (9, 18)], MA_AMAR)   # a barriga de chama
            t.pxs([(10, 13), (14, 13), (12, 12)], MA)
            for x, d in ((10, 1), (14, -1)):
                t.pxs([(x, 5), (x, 6), (x, 7), (x - d, 4)], P_); t.px(x, 5, BR)
        else:
            t.pxs([(10, 12), (14, 12), (12, 15), (9, 16), (15, 16)], MA_AMAR)   # as pintas
        pes(t, [(8, 21), (9, 21), (10, 21), (14, 21), (15, 21), (16, 21)], MA_E)
    else:
        t.poli([(11, 3), (11, 0), (14, 2), (17, 1), (15, 4)], MA_AMAR)
        t.linha([(17, 17), (21, 16), (22, 12)], MA, 2)
        t.poli([(21, 12), (20, 8), (23, 10), (23, 13)], MA_AMAR)
        t.ret(9, 17, 11, 20, MA); t.ret(14, 17, 16, 20, MA)
        t.elipse(13, 14, 5, 5, MA)
        t.elipse(10, 6, 4, 4, MA)
        t.elipse(5, 8, 2, 1, MA_AMAR)                                       # o bico pra frente
        t.elipse(9, 13, 2, 3, MA)
        sombrear(t, {MA: (MA_C, MA_E), MA_AMAR: (MA_AMAR_C, MA_AMAR_E)})
        t.poli([(9, 16), (10, 11), (13, 13), (12, 18)], MA_AMAR)
        t.pxs([(8, 5), (8, 6), (8, 7), (9, 4)], P_); t.px(8, 5, BR)
        pes(t, [(9, 21), (10, 21), (11, 21), (14, 21), (15, 21), (16, 21)], MA_E)
    contorno_gba(t)


# ------------------------------------------------------------------- PINSIR
PI, PI_C, PI_E = H("c8a080"), H("e0c098"), H("887058")
PI_CHIFRE, PI_CHIFRE_C, PI_CHIFRE_E = H("d0d0b0"), H("e8e8c8"), H("a8a880")
PI_BOCA = H("584028")


def pinsir(t, lado):
    if lado in ("frente", "costas"):
        t.anel(12, 11, 8, 11, PI_CHIFRE, 3)                                 # as pinças: um arco grosso...
        t.ret(0, 10, 23, 23, (0, 0, 0, 0))                                  # ...só a metade de cima
        t.ret(11, 0, 13, 2, (0, 0, 0, 0))                                   # aberto no meio
        t.ret(8, 18, 10, 20, PI); t.ret(14, 18, 16, 20, PI)
        t.elipse(12, 15, 6, 4, PI)
        t.elipse(4, 14, 2, 3, PI); t.elipse(20, 14, 2, 3, PI)               # os braços
        t.elipse(12, 10, 4, 3, PI)
        sombrear(t, {PI: (PI_C, PI_E), PI_CHIFRE: (PI_CHIFRE_C, PI_CHIFRE_E)})
        for d in (-1, 1):
            t.pxs([(12 + 4 * d, 4), (12 + 5 * d, 7)], PI_CHIFRE)          # os espinhos de dentro
        if lado == "frente":
            for x, d in ((10, 1), (14, -1)):
                t.pxs([(x, 9), (x, 10), (x - d, 8)], P_)
            t.linha([(10, 12), (14, 12)], PI_BOCA, 1); t.pxs([(10, 11), (12, 11), (14, 11)], BR)   # a boca de dentes
            t.linha([(8, 15), (16, 15)], PI_E, 1); t.linha([(9, 17), (15, 17)], PI_E, 1)   # as listras da barriga
        else:
            t.linha([(12, 12), (12, 19)], PI_E, 1)
        pes(t, [(8, 21), (9, 21), (10, 21), (14, 21), (15, 21), (16, 21)], PI_E)
    else:
        t.anel(10, 10, 6, 10, PI_CHIFRE, 3)                                 # as pinças de lado: o arco
        t.ret(0, 9, 23, 23, (0, 0, 0, 0))
        t.ret(9, 0, 10, 2, (0, 0, 0, 0))
        t.ret(9, 18, 11, 20, PI); t.ret(14, 18, 16, 20, PI)
        t.elipse(13, 15, 5, 4, PI)
        t.elipse(10, 10, 4, 3, PI)
        t.elipse(8, 15, 2, 3, PI)
        sombrear(t, {PI: (PI_C, PI_E), PI_CHIFRE: (PI_CHIFRE_C, PI_CHIFRE_E)})
        t.pxs([(7, 4), (13, 4)], PI_CHIFRE)
        t.pxs([(8, 9), (8, 10), (9, 8)], P_)
        t.linha([(6, 12), (9, 12)], PI_BOCA, 1); t.px(7, 11, BR)
        t.linha([(12, 15), (16, 15)], PI_E, 1)
        pes(t, [(9, 21), (10, 21), (11, 21), (14, 21), (15, 21), (16, 21)], PI_E)
    contorno_gba(t)


# ------------------------------------------------------------------- TAUROS
TA, TA_C, TA_E = H("b87830"), H("e0a048"), H("705820")
TA_JUBA, TA_JUBA_C, TA_JUBA_E = H("705018"), H("988040"), H("483000")
TA_CHIFRE, TA_CHIFRE_C = H("90b0a8"), H("e0e0e8")
TA_CASCO = H("585068")


def tauros(t, lado):
    if lado in ("frente", "costas"):
        t.linha([(17, 13), (21, 9), (22, 5)], TA_JUBA_E, 1); t.linha([(18, 14), (23, 12)], TA_JUBA_E, 1)   # os três rabos
        t.ret(6, 15, 8, 20, TA); t.ret(16, 15, 18, 20, TA)                  # as patas
        t.elipse(12, 14, 7, 5, TA)                                          # o corpão
        t.elipse(12, 9, 6, 5, TA_JUBA)                                      # a juba em volta da cara
        if lado == "frente":
            t.elipse(12, 10, 3, 3, TA)                                      # a cara
        sombrear(t, {TA: (TA_C, TA_E), TA_JUBA: (TA_JUBA_C, TA_JUBA_E)})
        for d in (-1, 1):                                                   # os chifres curvos
            t.linha([(12 + 4 * d, 6), (12 + 8 * d, 5), (12 + 9 * d, 2)], TA_CHIFRE, 2)
            t.px(12 + 8 * d, 4, TA_CHIFRE_C)
        if lado == "frente":
            t.pxs([(10, 9), (10, 10), (14, 9), (14, 10)], P_)                 # o olhar bravo
            t.pxs([(9, 8), (15, 8)], P_)
            t.elipse(12, 12, 1, 0, TA_E); t.pxs([(11, 12), (13, 12)], P_)   # as ventas
            t.pxs([(11, 6), (12, 7), (13, 6)], TA_CHIFRE)                    # as três bolinhas da testa
        else:
            t.linha([(12, 10), (12, 18)], TA_E, 1)
        pes(t, [(6, 21), (7, 21), (8, 21), (16, 21), (17, 21), (18, 21)], TA_CASCO)
    else:
        for y in (8, 10, 12):                                               # os rabos chicote
            t.linha([(19, 13), (22, y - 4), (23, y)], TA_JUBA_E, 1)
        t.ret(9, 15, 11, 20, TA); t.ret(17, 15, 19, 20, TA)
        t.elipse(14, 13, 7, 5, TA)
        t.elipse(8, 11, 5, 5, TA_JUBA)
        t.elipse(5, 12, 3, 3, TA)
        sombrear(t, {TA: (TA_C, TA_E), TA_JUBA: (TA_JUBA_C, TA_JUBA_E)})
        t.linha([(8, 8), (11, 5), (9, 2)], TA_CHIFRE, 2); t.px(10, 4, TA_CHIFRE_C)
        t.pxs([(5, 10), (5, 11), (4, 9)], P_)
        t.px(2, 13, P_)
        pes(t, [(9, 21), (10, 21), (11, 21), (17, 21), (18, 21), (19, 21)], TA_CASCO)
    contorno_gba(t)


# ----------------------------------------------------------------- GYARADOS
GY, GY_C, GY_E = H("7098e0"), H("88b8f8"), H("383860")
GY_BARRIGA, GY_BARRIGA_E = H("f8e098"), H("c0c078")
GY_CRISTA, GY_CRISTA_E = H("d8e0f0"), H("7880a0")
GY_BOCA = H("c83030")


def gyarados(t, lado):
    if lado in ("frente", "costas"):
        t.elipse(5, 17, 4, 4, GY); t.elipse(19, 15, 4, 4, GY)               # as voltas do corpo
        t.elipse(12, 19, 5, 3, GY)
        t.poli([(9, 3), (12, 0), (15, 3)], GY_CRISTA)                       # a crista
        t.elipse(12, 8, 6, 5, GY)                                           # a cabeçona
        sombrear(t, {GY: (GY_C, GY_E), GY_CRISTA: (GY_CRISTA, GY_CRISTA_E)})
        t.pxs([(4, 15), (7, 16), (17, 13), (20, 14), (10, 18), (14, 18)], GY_BARRIGA)   # as pintas amarelas
        if lado == "frente":
            t.poli([(8, 10), (16, 10), (14, 14), (10, 14)], GY_BOCA)         # a bocarra aberta
            t.pxs([(8, 10), (10, 10), (14, 10), (16, 10), (11, 14), (13, 14)], BR)   # as presas
            for x, d in ((8, 1), (16, -1)):
                t.pxs([(x, 6), (x, 7), (x, 8), (x - d, 5)], P_); t.px(x, 7, BR)
            t.linha([(6, 10), (2, 12)], GY_CRISTA, 1); t.linha([(18, 10), (22, 12)], GY_CRISTA, 1)   # os bigodes
        else:
            t.linha([(12, 3), (12, 12)], GY_CRISTA, 1)
            t.pxs([(12, 4), (12, 7), (12, 10)], GY_CRISTA_E)
    else:
        t.elipse(17, 14, 5, 4, GY); t.elipse(13, 19, 6, 3, GY)              # o corpo em S
        t.poli([(19, 10), (22, 6), (21, 11)], GY_CRISTA)                    # a barbatana das costas
        t.poli([(9, 2), (14, 0), (13, 5)], GY_CRISTA)
        t.elipse(9, 8, 6, 5, GY)
        t.poli([(4, 9), (1, 12), (6, 13)], GY)                              # o queixo aberto
        sombrear(t, {GY: (GY_C, GY_E), GY_CRISTA: (GY_CRISTA, GY_CRISTA_E)})
        t.poli([(2, 9), (8, 10), (5, 12)], GY_BOCA); t.pxs([(3, 9), (5, 9)], BR)
        t.pxs([(7, 5), (7, 6), (7, 7), (8, 4)], P_); t.px(7, 6, BR)
        t.linha([(4, 11), (1, 15)], GY_CRISTA, 1)
        t.pxs([(15, 17), (18, 14), (11, 19), (15, 20)], GY_BARRIGA)
    contorno_gba(t)


# ------------------------------------------------------------------ PORYGON
PG, PG_C, PG_E = H("f89088"), H("f8c0a0"), H("d86050")
PZ, PZ_C, PZ_E = H("38b8d0"), H("70d0f8"), H("289888")


def porygon(t, lado):
    if lado in ("frente", "costas"):
        t.poli([(7, 15), (5, 20), (10, 20), (10, 15)], PZ); t.poli([(14, 15), (14, 20), (19, 20), (17, 15)], PZ)   # as patas de bloco
        t.poli([(6, 10), (18, 10), (17, 16), (7, 16)], PG)                  # o corpo
        t.poli([(7, 3), (17, 3), (18, 9), (6, 9)], PG)                      # a cabeça
        if lado == "costas":
            t.poli([(10, 11), (14, 11), (13, 17), (11, 17)], PZ)            # o rabinho
        sombrear(t, {PG: (PG_C, PG_E), PZ: (PZ_C, PZ_E)})
        if lado == "frente":
            t.poli([(10, 8), (14, 8), (12, 12)], PZ)                        # o bico
            t.px(12, 9, PZ_C)
            for x in (8, 16):
                t.pxs([(x, 5), (x, 6), (x, 7)], P_); t.px(x, 5, BR)          # os olhos de lado
        t.linha([(6, 9), (18, 9)], PG_E, 1)
        pes(t, [(6, 21), (7, 21), (8, 21), (16, 21), (17, 21), (18, 21)], PZ_E)
    else:
        t.poli([(17, 11), (22, 8), (22, 13), (18, 15)], PZ)                 # o rabo de bloco
        t.poli([(8, 15), (7, 20), (12, 20), (12, 15)], PZ); t.poli([(14, 15), (14, 20), (19, 20), (18, 15)], PZ)
        t.poli([(7, 10), (19, 10), (18, 16), (8, 16)], PG)
        t.poli([(7, 3), (14, 3), (15, 10), (6, 10)], PG)
        t.poli([(6, 6), (1, 8), (6, 10)], PZ)                               # o bico pra frente
        sombrear(t, {PG: (PG_C, PG_E), PZ: (PZ_C, PZ_E)})
        t.pxs([(9, 5), (9, 6), (9, 7)], P_); t.px(9, 5, BR)
        t.linha([(7, 10), (15, 10)], PG_E, 1)
        pes(t, [(8, 21), (9, 21), (11, 21), (14, 21), (15, 21), (18, 21)], PZ_E)
    contorno_gba(t)


DESENHOS = {117: seadra, 119: seaking, 121: starmie, 122: mr_mime, 124: jynx, 125: electabuzz,
            126: magmar, 127: pinsir, 128: tauros, 130: gyarados, 137: porygon}
TAMANHO = {117: 0.85, 119: 0.9, 121: 0.9, 122: 1, 124: 1, 125: 1,
           126: 1, 127: 1, 128: 1, 130: 1, 137: 0.85}
