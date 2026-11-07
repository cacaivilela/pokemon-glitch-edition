"""AS 8 INSÍGNIAS DE KANTO (pedido do CAIO, nov/2026: "vc desenha a de cada
insígnia e eu o que forma"), pixel por pixel em 16x16 (cada pixel vira 2x2 na
insígnia de 32x32, como as dele). Cores: k contorno, e os tons de cada uma.
Sai: dev/captures/insignia_<id>.png e assets/sprites/insignias/insignia_<id>.png"""
import os
from PIL import Image
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
D = {
 "pedra": (["......kkkk......", "....kkbbbbkk....", "...kbbwwbbbbk...", "..kbbwwbbbbbbk..", ".kbbwbbbbbbbbdk.", ".kbbbbbbbbbbbdk.",
            "kbbbbbbbbbbbbddk", "kbbbbbbbbbbbbddk", "kbbbbbbbbbbbbddk", "kbbbbbbbbbbbdddk", ".kbbbbbbbbbbddk.", ".kdbbbbbbbbdddk.",
            "..kddbbbbbdddk..", "...kddddddddk...", "....kkddddkk....", "......kkkk......"],
           {"k": (40, 40, 48), "b": (160, 160, 172), "w": (232, 232, 240), "d": (96, 96, 112)}),
 "cascata": ([".......kk.......", "......kwbk......", "......kwbk......", ".....kwbbbk.....", ".....kwbbbk.....", "....kwwbbbbk....",
              "....kwbbbbbk....", "...kwwbbbbbbk...", "...kwbbbbbbdk...", "..kwbbbbbbbbdk..", "..kwbbbbbbbbdk..", "..kbbbbbbbbddk..",
              "..kbbbbbbbbddk..", "...kbbbbbbddk...", "....kkddddkk....", "......kkkk......"],
             {"k": (16, 40, 96), "w": (200, 240, 255), "b": (72, 152, 232), "d": (32, 88, 176)}),
 "trovao": (["................", ".......kk.......", "......kyyk......", "......kyyk......", ".kkkkkkyykkkkkk.", ".koooooyyoooook.",
             "..koooyyyyoook..", "...koyyyyyyok...", "....koyyyyok....", "...koooyyoook...", "...kooodkoook...", "..koood..kdook..",
             "..kood....kdok..", ".kodk......kdok.", ".kkk........kkk.", "................"],
            {"k": (96, 40, 8), "o": (240, 140, 40), "y": (255, 232, 96), "d": (176, 80, 16)}),
 "arcoiris": (["................", ".....kkkkkk.....", "....krrrrrrk....", "...krroooorrk...", "..krooyyyyoork..", "..kroyggggyork..",
               ".kroygbbbbgyork.", ".kroygbwwbgyork.", ".kroygbwwbgyork.", ".kroygbbbbgyork.", "..kroyggggyork..", "..krooyyyyoork..",
               "...krroooorrk...", "....krrrrrrk....", ".....kkkkkk.....", "................"],
              {"k": (48, 24, 48), "r": (232, 64, 64), "o": (248, 152, 40), "y": (248, 232, 72), "g": (88, 200, 88), "b": (72, 128, 232), "w": (255, 255, 255)}),
 "alma": (["................", "................", "..kkkk....kkkk..", ".kppppk..kppppk.", "kpwwpppkkppppppk", "kpwppppppppppppk",
           "kppppppppppppppk", "kppppppppppppddk", ".kppppppppppddk.", "..kppppppppddk..", "...kppppppddk...", "....kppppddk....",
           ".....kppddk.....", "......kddk......", ".......kk.......", "................"],
          {"k": (96, 24, 56), "p": (240, 120, 176), "w": (255, 224, 240), "d": (192, 64, 120)}),
 "pantano": (["................", "...kkkk..kkkk...", "..kyyyyk kyyyyk.", ".kyywwyykyyyyyyk", ".kywkkwyykykkyyk", ".kyykkyykyykkyyk",
              ".kyyyyyykyyyyyyk", "..kyyyykkkyyyyk.", "...kkkkyyykkkk..", "......kywwyk....", ".....kywkkwyk...", ".....kyykkyyk...",
              ".....kyyyyyyk...", "......kyyyyk....", ".......kkkk.....", "................"],
             {"k": (96, 72, 8), "y": (232, 192, 40), "w": (255, 244, 176)}),
 "vulcao": (["................", ".......k........", "......krk.......", "......krrk..k...", ".....krrrk.krk..", "..k..krrork.krk.",
             ".krk.kroork.krk.", ".krrkrooorkkrrk.", ".krrroooyoorrrk.", ".kroooyyyyoorrk.", "..kooyyyyyyook..", "..kooyywwyyook..",
             "...koyywwyyok...", "....koyyyyok....", ".....kkkkkk.....", "................"],
            {"k": (96, 16, 8), "r": (208, 40, 32), "o": (248, 128, 32), "y": (255, 216, 72), "w": (255, 250, 220)}),
 "terra": (["................", ".......kk.......", "......kggk......", ".....kgwggk.....", "....kgwgggdk....", "...kgwggggggk...",
            "..kgggggggggdk..", ".kggggggdgggddk.", ".kggggggdgggggk.", "..kgggggdggggk..", "...kgggdgggdk...", "....kggdggdk....",
            ".....kgdgdk.....", "......kddk......", ".......kk.......", "................"],
           {"k": (16, 64, 24), "g": (80, 184, 72), "w": (200, 248, 168), "d": (40, 120, 48)}),
}
for nome, (rows, cores) in D.items():
    assert len(rows) == 16 and all(len(r) == 16 for r in rows), (nome, [len(r) for r in rows])
    im = Image.new("RGBA", (16, 16), (0, 0, 0, 0))
    for y, r in enumerate(rows):
        for x, ch in enumerate(r):
            if ch in cores: im.putpixel((x, y), cores[ch] + (255,))
    im = im.resize((32, 32), Image.NEAREST)
    for pasta in ("dev/captures", "assets/sprites/insignias"):
        os.makedirs(f"{R}/{pasta}", exist_ok=True)
        im.save(f"{R}/{pasta}/insignia_{nome}.png")
print("ok")
