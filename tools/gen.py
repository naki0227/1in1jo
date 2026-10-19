import json, csv, math, statistics, collections
G = '/tmp/claude-0/-home-user/82a24972-4944-5bdc-8cfa-d1280dc6c5ee/scratchpad/gen/'
D = '/tmp/claude-0/-home-user/82a24972-4944-5bdc-8cfa-d1280dc6c5ee/scratchpad/dl/'
wd = json.load(open(G + 'wd.json'))
rows = {r['Genus'] + ' ' + r['Species']: r for r in csv.DictReader(open(D + 'anage_data.txt', encoding='latin-1'), delimiter='\t')}

def f(r, k):
    v = r.get(k, '').strip()
    try: return float(v) if v else None
    except: return None

# 手作りデータと重複する種は除外
HAND = {'Homo sapiens','Bos taurus','Sus scrofa','Canis familiaris','Canis lupus','Felis catus','Felis silvestris','Gallus gallus','Ovis aries','Capra hircus',
        'Anas platyrhynchos','Passer domesticus','Hirundo rustica','Larus delawarensis','Pygoscelis adeliae','Loxodonta africana','Megaptera novaeangliae',
        'Panthera leo','Pan troglodytes','Connochaetes taurinus','Rattus norvegicus','Oryctolagus cuniculus','Oncorhynchus keta','Gadus morhua','Caretta caretta',
        'Crocodylus niloticus','Prionace glauca','Engraulis japonicus','Octopus vulgaris','Apis mellifera','Bubo bubo_x'}
# 個体数が分かっている種（上書き）
OVR = {'Equus caballus':(5.8e7,'FAOSTAT 2023（ウマ 約5800万頭）'),'Equus asinus':(5.3e7,'FAOSTAT 2023（ロバ 約5300万頭）'),
       'Bubalus bubalis':(2.0e8,'FAOSTAT 2023（スイギュウ 約2億頭）'),'Camelus dromedarius':(3.5e7,'FAOSTAT 2023（ラクダ類 約3900万頭）の大半'),
       'Meleagris gallopavo':(4.5e8,'FAOSTAT 2023（シチメンチョウ 約4.5億羽、飼育個体）'),'Sturnus vulgaris':(1.3e9,'Callaghan et al. 2021（約13億羽）'),
       'Quelea quelea':(1.5e9,'しばしば最多の野鳥とされる（推計 約15億羽）'),'Columba livia':(4e8,'推計（ドバトを含む）'),
       'Odocoileus virginianus':(3e7,'推計（北米 約3000万頭）'),'Balaenoptera musculus':(1.5e4,'IUCN（約1万〜2.5万頭）'),
       'Ailuropoda melanoleuca':(1864,'中国政府調査 2014（1864頭）'),'Panthera tigris':(5574,'GTF 2022（約5500頭）'),
       'Gorilla gorilla':(3.6e5,'IUCN（約36万頭）'),'Pongo pygmaeus':(1.0e5,'IUCN（約10万頭）'),'Ursus maritimus':(2.6e4,'IUCN（約2.6万頭）'),
       'Elephas maximus':(5e4,'IUCN（約5万頭）'),'Ornithorhynchus anatinus':(3e5,'推計'),'Phascolarctos cinereus':(3e5,'推計（約30万頭）'),
       'Mus musculus':(2e9,'推計（家ネズミとして世界中に分布）'),'Aptenodytes forsteri':(5.9e5,'Fretwell et al. 2012（約59万羽）'),
       'Diomedea exulans':(2e4,'推計（約2万羽）'),'Struthio camelus':(2e6,'推計'),'Hippopotamus amphibius':(1.3e5,'IUCN（約13万頭）'),
       'Giraffa camelopardalis':(1.17e5,'GCF 2020（約11.7万頭）'),'Rangifer tarandus':(5e6,'推計（約500万頭、家畜トナカイを含む）')}

CAP = {'Aves':380,'Mammalia':310,'Reptilia':150,'Teleostei':110,'Amphibia':50,'Chondrichthyes':40,'Chondrostei':4,'Dipnoi':2,'Cephalaspidomorphi':2,'Coelacanthi':1,'Holostei':2}
cand = []
for n, d in wd.items():
    r = rows.get(n)
    if not r or not d.get('ja') or n in HAND or d.get('iucn') in ('EX','EW'): continue
    if r['Class'] not in CAP: continue
    if not f(r,'Maximum longevity (yrs)'): continue
    ja = d['ja']
    if any(ch.isascii() and ch.isalpha() for ch in ja): continue
    cand.append((r['Class'], (d.get('jawiki',0), d.get('links',0)), n, r, d))

byc = collections.defaultdict(list)
for c in cand: byc[c[0]].append(c)
sel = []
for c, lst in byc.items():
    lst.sort(key=lambda x: x[1], reverse=True)
    sel += lst[:CAP[c]]

# 欠損値の補完：綱・目ごとの中央値と、体重との回帰
def median_by(key, cls, order=None):
    vals = [f(r, key) for (_, _, _, r, _) in cand if r['Class'] == cls and (order is None or r['Order'] == order) and f(r, key)]
    return statistics.median(vals) if len(vals) >= 3 else None
def regress(key, cls):
    pts = [(math.log(f(r,'Adult weight (g)')), math.log(f(r,key))) for (_,_,_,r,_) in cand if r['Class']==cls and f(r,'Adult weight (g)') and f(r,key)]
    if len(pts) < 5: return None
    mx = sum(p[0] for p in pts)/len(pts); my = sum(p[1] for p in pts)/len(pts)
    b = sum((x-mx)*(y-my) for x,y in pts)/max(1e-9,sum((x-mx)**2 for x,_ in pts))
    return (my - b*mx, b)
REG = {}
for cls in CAP:
    for key in ['Female maturity (days)','Gestation/Incubation (days)','Adult weight (g)']:
        REG[(cls,key)] = regress(key, cls) if key != 'Adult weight (g)' else None
DEFAULT_MASS = {'Aves':150,'Mammalia':3000,'Reptilia':800,'Teleostei':1500,'Amphibia':40,'Chondrichthyes':20000,'Chondrostei':30000,'Dipnoi':5000,'Cephalaspidomorphi':500,'Coelacanthi':90000,'Holostei':3000}

out = []
for (cls, pop, n, r, d) in sel:
    M = f(r,'Adult weight (g)') or f(r,'Body mass (g)') or DEFAULT_MASS[cls]
    imp = []
    def get(key, fallback_med=True):
        v = f(r, key)
        if v: return v
        reg = REG.get((cls,key))
        if reg: imp.append(key); return math.exp(reg[0] + reg[1]*math.log(M))
        m = median_by(key, cls, r['Order']) or median_by(key, cls)
        if m: imp.append(key)
        return m
    maxL = f(r,'Maximum longevity (yrs)')
    mat = get('Female maturity (days)') or 365
    inc = get('Gestation/Incubation (days)') or 30
    clutch = f(r,'Litter/Clutch size')
    if not clutch:
        imp.append('clutch')
        if cls in ('Teleostei','Chondrostei','Holostei','Dipnoi','Cephalaspidomorphi'): clutch = max(50, 300 * M**0.9)
        else: clutch = median_by('Litter/Clutch size', cls, r['Order']) or median_by('Litter/Clutch size', cls) or 2
    lpy = f(r,'Litters/Clutches per year')
    if not lpy:
        ib = f(r,'Inter-litter/Interbirth interval')
        lpy = 365/ib if ib else (2.0 if (cls=='Mammalia' and M < 500) else 1.0)
    wean = f(r,'Weaning (days)')
    bw = f(r,'Birth weight (g)')
    capt = r['Specimen origin'] == 'captivity'
    N, src = None, None
    if n in OVR: N, src = OVR[n]
    out.append(dict(sci=n, ja=d['ja'], cls=cls, order=r['Order'], fam=r['Family'], M=round(M,3), maxL=maxL, mat=round(mat), inc=round(inc), clutch=round(clutch,1),
                    lpy=round(lpy,2), wean=round(wean) if wean else None, bw=bw, capt=capt, iucn=d.get('iucn') or '', N=N, src=src, en=r['Common name'], imp=imp))

print(len(out), collections.Counter(o['cls'] for o in out))
# コンパクトな配列でJS化
keys = ['sci','ja','cls','order','fam','M','maxL','mat','inc','clutch','lpy','wean','bw','capt','iucn','N','src','en']
arr = [[o[k] for k in keys] + [1 if o['imp'] else 0] for o in out]
open(G + 'gen.js','w').write('const GEN_KEYS=' + json.dumps(keys+['imp']) + ';\nconst GEN=' + json.dumps(arr, ensure_ascii=False, separators=(',',':')) + ';\n')
import os; print(os.path.getsize(G+'gen.js'))
