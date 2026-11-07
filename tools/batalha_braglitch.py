#!/usr/bin/env python3
"""A BATALHA DE BRAGLITCH, no chip do Game Boy (o mesmo das batalhas de Kanto,
src/core/gb.js), escrita no formato de música do pret/pokered — mas com cara
de BRASIL, não de Kanto. ORIGINAL: a melodia é daqui.

É um FORRÓ: a abertura é a sanfona subindo a escala correndo e um compasso só
de zabumba e triângulo; o tema é sincopado (as notas caem antes do tempo), em
ré mixolídio com o sol sustenido de passagem (a escala do baião); o canal 2
canta junto UMA TERÇA ABAIXO, como a sanfona faz; o canal de onda faz o baixo
do baião ("tum... ta-tum": 3 + 3 + 2 semicolcheias); e o canal 4, o chiado, é
a ZABUMBA (o chiado grave, no "tum... ta-tum" e o "bacalhau" no contratempo) e
o TRIÂNGULO (o chiado "afinado" de 7 bits, que soa metálico, em toda
semicolcheia, com o acento no fim de cada tempo).

Grava tools/musicas_proprias/braglitchbattle.asm, que o tools/musicas_gb.py lê.

    python3 tools/batalha_braglitch.py && python3 tools/musicas_gb.py
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NOMES = {"C": "C_", "C#": "C#", "D": "D_", "D#": "D#", "E": "E_", "F": "F_", "F#": "F#",
         "G": "G_", "G#": "G#", "A": "A_", "A#": "A#", "B": "B_"}

# o tema: [nota, semicolcheias], 16 compassos de 16
TEMA = [
    ["D5", 3], ["F#5", 3], ["A5", 2], ["G#5", 2], ["A5", 2], ["F#5", 4],
    ["E5", 3], ["D5", 3], ["C5", 2], ["A4", 4], ["F#4", 4],
    ["G4", 3], ["C5", 3], ["E5", 2], ["D5", 2], ["C5", 2], ["G4", 4],
    ["A4", 3], ["A4", 3], ["F#4", 2], ["D4", 8],
    ["D5", 2], ["D5", 1], ["E5", 3], ["F#5", 2], ["G#5", 3], ["A5", 3], ["F#5", 2],
    ["B5", 3], ["A5", 3], ["G5", 2], ["F#5", 2], ["E5", 2], ["D5", 4],
    ["C#5", 3], ["E5", 3], ["G5", 2], ["F#5", 2], ["E5", 2], ["C#5", 4],
    ["D5", 6], ["-", 2], ["A4", 2], ["B4", 2], ["C5", 4],
    ["B4", 3], ["D5", 3], ["G5", 2], ["F#5", 2], ["G5", 2], ["B5", 4],
    ["C6", 3], ["B5", 3], ["A5", 2], ["G5", 2], ["E5", 2], ["C5", 4],
    ["A5", 3], ["F#5", 3], ["D5", 2], ["E5", 2], ["F#5", 2], ["A5", 4],
    ["C6", 2], ["B5", 2], ["A5", 2], ["G#5", 2], ["A5", 8],
    ["G5", 3], ["F#5", 3], ["E5", 2], ["D5", 2], ["B4", 2], ["G4", 4],
    ["A4", 3], ["C#5", 3], ["E5", 2], ["G5", 4], ["F#5", 2], ["E5", 2],
    ["F#5", 3], ["E5", 3], ["D5", 2], ["C5", 2], ["A4", 2], ["F#4", 4],
    ["D5", 4], ["A4", 2], ["D5", 2], ["-", 8],
]
# a tônica e a quinta do baixo, compasso por compasso (D D C D D G A D G C D D G A D D)
BAIXO = [("D3", "A2"), ("D3", "A2"), ("C3", "G2"), ("D3", "A2"), ("D3", "A2"), ("G2", "D3"), ("A2", "E3"), ("D3", "A2"),
         ("G2", "D3"), ("C3", "G2"), ("D3", "A2"), ("D3", "A2"), ("G2", "D3"), ("A2", "E3"), ("D3", "A2"), ("D3", "A2")]
# a escala (ré mixolídio) pra achar a terça de baixo; o sol sustenido canta com o mi
ESCALA = ["D", "E", "F#", "G", "A", "B", "C"]
# o chiado: [duração, volume, fade, número do chiado]
ZABUMBA = (1, 13, 2, 0x64)       # grave e cheio
BACALHAU = (1, 9, 1, 0x32)       # o tapa seco no contratempo
TRIANGULO = (1, 6, 1, 0x0A)      # metálico (7 bits), fraquinho
TRIANGULO_ABERTO = (1, 9, 2, 0x0A)


def terca_abaixo(n):
    """a nota uma terça abaixo, dentro da escala do baião"""
    if n == "-":
        return n
    nome, oit = n[:-1], int(n[-1])
    if nome == "G#":
        nome = "G"
    if nome == "C#":
        return f"A{oit - 1}"
    k = ESCALA.index(nome)
    alvo = k - 2
    if alvo < 0:
        alvo += 7
    # desceu de oitava se passou do dó pra baixo (a escala começa em ré, a oitava em dó)
    ordem = ["C", "D", "E", "F#", "G", "A", "B"]
    novo = ESCALA[alvo]
    o2 = oit - (1 if ordem.index(novo) > ordem.index(nome) else 0)
    return f"{novo}{o2}"


def separa(n):
    nome, oit = n[:-1], int(n[-1])
    # a "octave N" do pokered é uma acima da notação de sempre (octave 4 = C5)
    return NOMES[nome], oit - 1


class Canal:
    def __init__(self):
        self.linhas, self.oitava = [], None

    def cmd(self, s):
        self.linhas.append("\t" + s)

    def nota(self, n, semis):
        """`semis` em semicolcheias; o pokered vai até 16 por comando"""
        while semis > 0:
            k = min(16, semis)
            if n == "-":
                self.cmd(f"rest {k}")
            else:
                nome, oit = separa(n)
                if oit != self.oitava:
                    self.cmd(f"octave {oit}")
                    self.oitava = oit
                self.cmd(f"note {nome}, {k}")
            semis -= k


def main():
    c1, c2, c3, c4 = Canal(), Canal(), Canal(), Canal()
    subida = ["D4", "E4", "F#4", "G4", "A4", "B4", "C5", "D5", "E5", "F#5", "G5", "A5", "B5", "C6", "D6", "-"]
    # ---------------- canal 1: a sanfona subindo, o compasso da zabumba, e o tema
    c1.cmd("tempo 104")
    c1.cmd("volume 7, 7")
    c1.cmd("duty_cycle 2")             # pulso cheio: sanfona, não o 75% de Kanto
    c1.cmd("vibrato 4, 2, 3")
    c1.cmd("note_type 12, 11, 2")
    for n in subida:
        c1.nota(n, 1)
    c1.nota("-", 16)
    c1.linhas.append(".tema")
    c1.cmd("note_type 12, 11, 3")
    for n, k in TEMA:
        c1.nota(n, k)
    c1.cmd("sound_loop 0, .tema")
    # ---------------- canal 2: a mesma coisa uma terça abaixo (a sanfona em terças)
    c2.cmd("duty_cycle 2")
    c2.cmd("vibrato 4, 2, 3")
    c2.cmd("note_type 12, 8, 2")
    for n in subida:
        c2.nota(terca_abaixo(n), 1)
    c2.nota("-", 16)
    c2.linhas.append(".tema")
    c2.cmd("note_type 12, 8, 3")
    for n, k in TEMA:
        c2.nota(terca_abaixo(n), k)
    c2.cmd("sound_loop 0, .tema")
    # ---------------- canal 3 (onda): calado na subida, o baixo do baião desde a zabumba
    c3.cmd("note_type 12, 1, 1")
    c3.nota("-", 16)
    for _ in range(2):
        c3.nota("D3", 3); c3.nota("A2", 3); c3.nota("D3", 2)
    c3.linhas.append(".tema")
    for r, q in BAIXO:
        for _ in range(2):
            c3.nota(r, 3); c3.nota(q, 3); c3.nota(r, 2)
    c3.cmd("sound_loop 0, .tema")
    # ---------------- canal 4 (chiado): triângulo na subida, zabumba sozinha, e os dois no tema
    c4.cmd("note_type 12, 0, 0")
    batida = lambda b: c4.cmd("noise_note {}, {}, {}, {}".format(*b))
    for k in range(16):
        batida(TRIANGULO_ABERTO if k % 4 == 3 else TRIANGULO)
    # meio compasso de forró (8 semicolcheias): zabumba no 1 e no "a" do 1
    # (o tum... ta-tum), bacalhau no 2, triângulo no resto, aberto no fim do tempo
    meio = [ZABUMBA, TRIANGULO, TRIANGULO, ZABUMBA, BACALHAU, TRIANGULO, ZABUMBA, TRIANGULO_ABERTO]
    for b in meio * 2:
        batida(b)
    c4.linhas.append(".tema")
    for _ in range(16):
        for b in meio * 2:
            batida(b)
    c4.cmd("sound_loop 0, .tema")

    rot = "Music_BraglitchBattle"
    texto = ["; A BATALHA DE BRAGLITCH (um forró) — composta aqui (não é do pokered), no formato dele.",
             "; GERADO por tools/batalha_braglitch.py: mude lá e gere de novo.", ""]
    for k, c in enumerate((c1, c2, c3, c4), 1):
        texto.append(f"{rot}_Ch{k}::")
        # os rótulos locais viram "Music_BraglitchBattle_ChN.tema"
        texto += [l if not l.startswith(".") else f"{l}:" for l in c.linhas]
        texto.append("")
    dest = os.path.join(ROOT, "tools", "musicas_proprias", "braglitchbattle.asm")
    open(dest, "w", encoding="utf-8").write("\n".join(texto))
    print("->", dest)


if __name__ == "__main__":
    main()
