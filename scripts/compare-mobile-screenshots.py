from PIL import Image,ImageDraw
from pathlib import Path
p=Path('previews/mobile-refinement'); out=p/'comparisons';out.mkdir(exist_ok=True)
for page in ['index','profil','pengajian','kemasukan','galeri','hubungi']:
 a=Image.open(p/'before'/f'{page}_UIUX-v1.0_390_Full.png').convert('RGB');b=Image.open(p/f'{page}_Mobile_390_Full.png').convert('RGB')
 a.thumbnail((390,9000));b.thumbnail((390,9000));c=Image.new('RGB',(800,max(a.height,b.height)+50),'#FBF8F0');d=ImageDraw.Draw(c);d.text((10,15),'UIUX-v1.0 | existing built artifact',fill='black');d.text((410,15),'Phase3 + Mobile | final',fill='black');c.paste(a,(0,50));c.paste(b,(410,50));c.save(out/f'{page}_v1.0_vs_Phase3-Mobile.png',optimize=True)
for name,a,b in [('hero','before/index_Phase3-78cfed2_390_Full.png','index_Mobile_390_Full.png'),('menu','before/menu_Phase3-78cfed2_390.png','menu-open_390.png')]:
 a=Image.open(p/a).convert('RGB').crop((0,0,390,844));b=Image.open(p/b).convert('RGB').crop((0,0,390,844));c=Image.new('RGB',(800,894),'#FBF8F0');d=ImageDraw.Draw(c);d.text((10,15),'Phase3 78cfed2 | before',fill='black');d.text((410,15),'Phase3 + Mobile | after',fill='black');c.paste(a,(0,50));c.paste(b,(410,50));c.save(out/f'{name}_Phase3-before_vs_Mobile-after.png',optimize=True)
