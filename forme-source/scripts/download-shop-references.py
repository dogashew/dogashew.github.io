import json, pathlib, urllib.request, concurrent.futures
from PIL import Image, ImageOps, ImageDraw
root=pathlib.Path(__file__).resolve().parent.parent
posts=json.loads((root/'references/shop-posts-session.json').read_text(encoding='utf-8'))
folder=root/'references/shop-thumbnails'
def get(p):
    name=p['url'].rstrip('/').split('/')[-1]
    target=folder/(name+'.jpg')
    if not target.exists():
        try:
            req=urllib.request.Request(p['src'],headers={'User-Agent':'Mozilla/5.0'})
            target.write_bytes(urllib.request.urlopen(req,timeout=25).read())
        except Exception as e: return name+': '+str(e)
    return name
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    results=list(pool.map(get,posts))
for start in range(45,len(posts),15):
    sheet=Image.new('RGB',(1000,1080),'#eeeeee'); draw=ImageDraw.Draw(sheet)
    for j,p in enumerate(posts[start:start+15]):
        name=p['url'].rstrip('/').split('/')[-1]; target=folder/(name+'.jpg')
        if not target.exists():continue
        im=Image.open(target).convert('RGB'); im.thumbnail((190,320))
        x=(j%5)*200+(200-im.width)//2;y=(j//5)*360
        sheet.paste(im,(x,y));draw.text(((j%5)*200+5,y+325),name,fill='black')
    sheet.save(folder/('extra-'+str(start)+'.jpg'))
print('References:',len(posts),'downloaded:',len(list(folder.glob('*.jpg'))))
