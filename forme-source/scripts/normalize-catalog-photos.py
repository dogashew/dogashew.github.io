"""Normalize catalog framing using original pixels and deterministic masks only."""
import json
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

root=Path(__file__).resolve().parent.parent
items=json.loads((root/'references/catalog-photo-inputs.json').read_text(encoding='utf-8'))
output=root/'public/images/catalog'
output.mkdir(parents=True,exist_ok=True)

def cutout(image):
    if image.mode=='RGBA' and image.getchannel('A').getextrema()[0]<250:
        return image.convert('RGBA')
    image=image.convert('RGBA')
    arr=np.asarray(image).copy()
    rgb=arr[:,:,:3].astype(float)
    edges=np.concatenate([rgb[0],rgb[-1],rgb[:,0],rgb[:,-1]])
    background=np.median(edges,axis=0)
    candidate=np.max(np.abs(rgb-background),axis=2)<23
    binary=Image.fromarray(np.where(candidate,0,255).astype('uint8'))
    border=Image.new('L',(image.width+2,image.height+2),0)
    border.paste(binary,(1,1))
    ImageDraw.floodfill(border,(0,0),128)
    outside=np.asarray(border)[1:-1,1:-1]==128
    alpha=Image.fromarray(np.where(outside,0,255).astype('uint8')).filter(ImageFilter.GaussianBlur(.35))
    image.putalpha(alpha)
    return image

for item in items:
    image=cutout(Image.open(root/item['path']))
    box=image.getchannel('A').point(lambda v:255 if v>24 else 0).getbbox()
    if not box: raise ValueError(item['id'])
    image=image.crop(box)
    limits=(624,760)
    if item['category'] in ['Брюки','Джинсы']: limits=(520,800)
    if item['category']=='Комплекты': limits=(610,820)
    scale=min(limits[0]/image.width,limits[1]/image.height)
    image=image.resize((round(image.width*scale),round(image.height*scale)),Image.Resampling.LANCZOS)
    canvas=Image.new('RGBA',(720,900))
    canvas.alpha_composite(image,((720-image.width)//2,(900-image.height)//2))
    canvas.save(output/(item['id']+'.webp'),quality=92,method=6)

preview=Image.new('RGB',(1200,((len(items)+7)//8)*190),'#f4f3ef')
for i,item in enumerate(items):
    image=Image.open(output/(item['id']+'.webp'));image.thumbnail((144,166))
    x=(i%8)*150;y=(i//8)*190
    preview.paste(image,(x+(150-image.width)//2,y),image)
    ImageDraw.Draw(preview).text((x+2,y+168),item['id'][:23],fill='black')
preview.save(root.parent/'catalog-normalized-review.jpg')
print('Normalized',len(items),'catalog product photos.')
