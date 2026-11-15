# Usage: python3 scripts/crop_products.py  (run from repo root; SRC points at the AI showcase poster on the box)
# Crops individual colorways from the AI showcase poster (logo-free render) into product images.
from PIL import Image, ImageDraw, ImageFilter
SRC='/cursor/stores/user/grok-bot/agents/d8164ce4-1066-4f9d-b1b0-bb02f917ea8e/assets/dc0e7b0d3f570dcd5a3004df01139e8c2f6ed7f29cf0a4a5e357f9693b2872c7.jpg'
im=Image.open(SRC).convert('RGB')
s=864/768
rows=[((198,303),[(97,214),(212,332),(327,449),(442,558),(550,678)]),
((332,443),[(97,218),(218,340),(337,456),(452,562),(558,688)]),
((585,716),[(84,168),(182,268),(274,360),(369,455),(458,548),(544,628),(632,722)]),
((712,873),[(87,181),(195,291),(312,403),(422,515),(527,628),(627,734)])]
boxes=[(int(x0*s),int(y0*s),int(x1*s),int(y1*s)) for (y0,y1),xs in rows for x0,x1 in xs]
keep=[i for i in range(23) if i not in (17,20)]
for n,i in enumerate(keep):
  c=im.crop(boxes[i]); w,h=c.size; S=int(max(w,h)*1.2)
  bg=Image.new('RGB',(S,S),(241,242,245))
  mask=Image.new('L',(w,h),0); ImageDraw.Draw(mask).rectangle([10,10,w-11,h-11],fill=255)
  mask=mask.filter(ImageFilter.GaussianBlur(6))
  bg.paste(c,((S-w)//2,(S-h)//2),mask)
  bg.resize((600,600),Image.LANCZOS).save(f'site/img/products/cw{n+1:02d}.jpg',quality=86)
# hero
h=Image.open(SRC).convert('RGB'); h.save('site/img/hero.jpg',quality=85)
h.resize((1200,630)) if False else None
# OG image 1200x630 crop
w,hh=h.size; og=h.crop((0,int(hh*0.15),w,int(hh*0.15)+int(w*630/1200))).resize((1200,630)); og.save('site/img/og.jpg',quality=82)
print('ok')
# hero: drop poster title text (it says "22 Colorways"; site shows 21 after removing a duplicate + a monogram-pattern pair)
w,hh=h.size; h.crop((0,190,w,hh)).save('site/img/hero.jpg',quality=85)
h.crop((0,200,w,200+int(w*630/1200))).resize((1200,630)).save('site/img/og.jpg',quality=82)
