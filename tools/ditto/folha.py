"""Folha de conferir: até 9 sprites com a grade em PIXELS DO SPRITE (vermelho a
cada 16, azul a cada 8). O tamanho do sprite (96, 80, 64...) aparece no canto."""
import sys
from PIL import Image, ImageDraw
nums=[int(x) for x in sys.argv[1].split(',')]; out=sys.argv[2]
C=288; M=22
cols=3; rows=(len(nums)+cols-1)//cols
F=Image.new('RGB',(cols*(C+M)+M, rows*(C+M)+M),(255,255,255)); d=ImageDraw.Draw(F)
for k,n in enumerate(nums):
    ox=M+(k%cols)*(C+M); oy=M+(k//cols)*(C+M)
    im=Image.open(f'assets/sprites/pokemon/{n:03d}.png' if n<1000 else f'assets/sprites/pokemon/{n}.png').convert('RGBA')
    W=im.width; E=C/W
    bg=Image.new('RGBA',im.size,(225,235,225,255)); bg.alpha_composite(im)
    F.paste(bg.convert('RGB').resize((C,C),Image.NEAREST),(ox,oy))
    for v in range(0,W+1,8):
        cor=(255,0,0) if v%16==0 else (120,120,255); q=round(v*E)
        d.line([(ox+q,oy),(ox+q,oy+C)],fill=cor,width=1); d.line([(ox,oy+q),(ox+C,oy+q)],fill=cor,width=1)
        if v%16==0 and v<W: d.text((ox+q+1,oy-11),str(v),fill=(200,0,0)); d.text((ox-20,oy+q),str(v),fill=(200,0,0))
    d.text((ox+C-70,oy-11),f'#{n} ({W}px)',fill=(0,0,0))
F.save(out)
