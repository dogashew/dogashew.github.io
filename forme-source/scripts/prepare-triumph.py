"""Apply reviewed clothing selections to original photo pixels; no generative edits."""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

root=Path(__file__).resolve().parent.parent
rows=json.loads((root/'references/triumph-inputs.json').read_text('utf-8'))
for row in rows:
    i=row['index']; src=root/'references/triumph'
    if i not in [20,54] and (root/f'public/images/catalog/triumph-{i}.webp').exists(): continue
    im=Image.open(src/f'{i}.jpg').convert('RGBA')
    mask=Image.open(src/f'{i}-mask.png').convert('L').resize(im.size)
    # Fill enclosed selection holes so zippers and dark fabric details survive.
    flood=mask.point(lambda v:255 if v>127 else 0)
    ImageDraw.floodfill(flood,(0,0),128)
    mask=Image.fromarray(np.where(np.asarray(flood)==128,0,255).astype('uint8'))
    mask=mask.filter(ImageFilter.GaussianBlur(.45))
    im.putalpha(mask); im=im.crop(mask.getbbox())
    im.save(src/f'{i}-cutout.png')
    bounds=(520,800) if i==0 else (624,760)
    im.thumbnail(bounds,Image.Resampling.LANCZOS)
    canvas=Image.new('RGBA',(720,900));canvas.alpha_composite(im,((720-im.width)//2,(900-im.height)//2))
    canvas.save(root/f'public/images/catalog/triumph-{i}.webp',quality=90,method=4)
preview=Image.new('RGB',(1200,((len(rows)+5)//6)*250),'white')
for j,row in enumerate(rows):
    im=Image.open(root/f"public/images/catalog/triumph-{row['index']}.webp");im.thumbnail((190,225));x=j%6*200;y=j//6*250
    preview.paste(im,(x,y),im);ImageDraw.Draw(preview).text((x+4,y+228),str(row['index']),fill='black')
preview.save(root/'references/triumph/cutouts-review.jpg')
print('Prepared',len(rows),'original-pixel product cutouts')
