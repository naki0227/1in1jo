import csv, json, sys, time, urllib.request, urllib.parse
D='/tmp/claude-0/-home-user/82a24972-4944-5bdc-8cfa-d1280dc6c5ee/scratchpad/dl/'
rows=list(csv.DictReader(open(D+'anage_data.txt',encoding='latin-1'),delimiter='\t'))
cls={'Aves','Mammalia','Reptilia','Teleostei','Amphibia','Chondrichthyes','Chondrostei','Holostei','Dipnoi','Cephalaspidomorphi','Coelacanthi','Cladistei','Actinopterygii'}
names=sorted({r['Genus']+' '+r['Species'] for r in rows if r['Class'] in cls and r['Maximum longevity (yrs)']})
print(len(names), file=sys.stderr)
out={}
for i in range(0,len(names),250):
    chunk=names[i:i+250]
    vals=' '.join('"%s"'%n for n in chunk)
    q='''SELECT ?n ?ja ?st ?links ?jaw WHERE { VALUES ?n { %s } ?t wdt:P225 ?n .
      OPTIONAL { ?t rdfs:label ?ja FILTER(lang(?ja)="ja") }
      OPTIONAL { ?t wdt:P141 ?s . ?s wdt:P1543 ?st }  OPTIONAL { ?t wikibase:sitelinks ?links }
      OPTIONAL { ?jaw schema:about ?t ; schema:isPartOf <https://ja.wikipedia.org/> } }'''%vals
    for attempt in range(4):
        try:
            req=urllib.request.Request('https://query.wikidata.org/sparql?'+urllib.parse.urlencode({'query':q}),headers={'Accept':'application/sparql-results+json','User-Agent':'lifesim-research/0.1 (contact via claude)'})
            res=json.load(urllib.request.urlopen(req,timeout=90)); break
        except Exception as e:
            print('retry',i,e,file=sys.stderr); time.sleep(5)
    for b in res['results']['bindings']:
        n=b['n']['value']; d=out.setdefault(n,{})
        if 'ja' in b: d['ja']=b['ja']['value']
        if 'st' in b: d['iucn']=b['st']['value']
        if 'links' in b: d['links']=max(d.get('links',0),int(b['links']['value']))
        if 'jaw' in b: d['jawiki']=1
    print(i,len(out),file=sys.stderr); time.sleep(1)
json.dump(out,open('/tmp/claude-0/-home-user/82a24972-4944-5bdc-8cfa-d1280dc6c5ee/scratchpad/gen/wd.json','w'),ensure_ascii=False)
