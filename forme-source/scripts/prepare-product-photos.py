"""Deterministic product masking and layout only; no generative/ML tools."""
from pathlib import Path
from PIL import Image, ImageFilter, ImageDraw
import numpy as np

root = Path(__file__).resolve().parent.parent
out = root / 'public/images'

def remove_neutral_background(image, pants=False):
    image = image.convert('RGBA')
    a = np.array(image)
    rgb = a[:,:,:3].astype(float)
    if pants:
        # The photographed brown fabric is chromatic; the studio backdrop is neutral.
        mask = np.clip((rgb[:,:,0]-rgb[:,:,2]-7)/9, 0, 1)
    else:
        # Dark garments on a light studio sweep; retain natural edge antialiasing.
        mask = np.clip((225-rgb.min(axis=2))/32, 0, 1)
    if pants:
        # Preserve buttons and other neutral details enclosed by the garment.
        binary=Image.fromarray((mask>.05).astype('uint8')*255)
        padded=Image.new('L',(image.width+2,image.height+2),0)
        padded.paste(binary,(1,1))
        ImageDraw.floodfill(padded,(0,0),128)
        enclosed=np.array(padded)[1:-1,1:-1]==0
        mask[enclosed]=1
    a[:,:,3] = (mask*255).astype('uint8')
    return Image.fromarray(a)

def trim(image):
    box=image.getchannel('A').point(lambda v: 255 if v>15 else 0).getbbox()
    return image.crop(box)

def save_product(name,image):
    image=trim(image)
    image.thumbnail((500,680),Image.Resampling.LANCZOS)
    canvas=Image.new('RGBA',(600,780))
    canvas.alpha_composite(image,((600-image.width)//2,(780-image.height)//2))
    canvas.save(out/(name+'-clean.webp'),quality=94,method=6)

for name in ['tf-cotton-hoodie','tf-cashmere-hoodie','tf-merino-hoodie','tf-cashmere-merino-hoodie']:
    image=Image.open(root/'references'/(name+'.jpg'))
    if image.mode!='RGBA': image=remove_neutral_background(image)
    save_product(name,image)

save_product('ps-13314033',remove_neutral_background(Image.open(root/'references/sweat-pants.jpg'),pants=True))
image=Image.open(root/'references/ea7-tracksuit.jpg')
top=trim(remove_neutral_background(image.crop((0,0,600,900))))
trousers=remove_neutral_background(image.crop((600,0,900,900)))
component=trousers.getchannel('A').point(lambda v:255 if v>32 else 0)
ImageDraw.floodfill(component,(150,450),128)
alpha=np.array(trousers.getchannel('A'))
alpha[np.array(component)!=128]=0
trousers.putalpha(Image.fromarray(alpha))
trousers=trim(trousers)
top.thumbnail((510,400),Image.Resampling.LANCZOS)
trousers.thumbnail((320,450),Image.Resampling.LANCZOS)
canvas=Image.new('RGBA',(600,900))
height=top.height+trousers.height+10
y=(900-height)//2
canvas.alpha_composite(top,((600-top.width)//2,y))
canvas.alpha_composite(trousers,((600-trousers.width)//2,y+top.height+10))
canvas.save(out/'ea7-tracksuit-clean.webp',quality=94,method=6)

names=['tf-cotton-hoodie','tf-cashmere-hoodie','tf-merino-hoodie','tf-cashmere-merino-hoodie','ps-13314033','ea7-tracksuit']
preview=Image.new('RGB',(1200,330),'#f4f3ef')
for i,name in enumerate(names):
    image=Image.open(out/(name+'-clean.webp'))
    image.thumbnail((195,300),Image.Resampling.LANCZOS)
    preview.paste(image,(i*200+(200-image.width)//2,0),image)
    ImageDraw.Draw(preview).text((i*200+2,310),name,fill='black')
preview.save(root.parent/'product-clean-review.jpg')
print('Prepared six transparent product photographs; source originals retained.')
