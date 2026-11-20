"""Place downloaded product-only photographs on a consistent white canvas.

No image generation or inpainting: original garment pixels are retained.
Only plain studio background removal, proportional resizing and padding.
"""
import json
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

root = Path(__file__).resolve().parent.parent
folder = root / 'references/packshots'
rows = json.loads((folder / 'sources.json').read_text('utf-8'))
sheet = Image.new('RGB', (1200, 840), 'white')
draw = ImageDraw.Draw(sheet)
for n, row in enumerate(rows):
    im = Image.open(folder / row['original']).convert('RGB')
    pixels = np.asarray(im).astype(float)
    # Estimate the neutral studio background from both outer margins per row.
    edge = max(3, im.width // 35)
    left = np.median(pixels[:, :edge], axis=1)
    right = np.median(pixels[:, -edge:], axis=1)
    t = np.linspace(0, 1, im.width)[None, :, None]
    bg = left[:, None, :] * (1-t) + right[:, None, :] * t
    distance = np.max(np.abs(pixels-bg), axis=2)
    mask = Image.fromarray((distance > 23).astype('uint8')*255)
    # Fill tiny interior gaps, without inventing any garment texture.
    exterior = mask.copy()
    ImageDraw.floodfill(exterior, (0, 0), 128)
    mask = Image.fromarray(np.where(np.asarray(exterior)==128, 0, 255).astype('uint8'))
    mask = mask.filter(ImageFilter.GaussianBlur(.45))
    bbox = mask.getbbox()
    if not bbox:
        raise ValueError(f'Empty foreground: {row["id"]}')
    im = im.convert('RGBA'); im.putalpha(mask); im = im.crop(bbox)
    bounds = (520, 800) if row['category']=='Джинсы' else (624, 760)
    scale = min(bounds[0]/im.width, bounds[1]/im.height)
    im = im.resize((round(im.width*scale),round(im.height*scale)), Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA', (720, 900))
    canvas.alpha_composite(im, ((720-im.width)//2, (900-im.height)//2))
    canvas.save(root / ('public'+row['catalogPhoto']), quality=91, method=6)
    preview = Image.new('RGB', (720,900),'white');preview.paste(canvas, mask=canvas.getchannel('A'));preview.thumbnail((190,237))
    x=n%6*200; y=n//6*280; sheet.paste(preview,(x,y)); draw.text((x+6,y+245),row['id'], fill='black')
sheet.save(folder/'prepared-review.jpg', quality=94)
