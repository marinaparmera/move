import json,re,os,unicodedata,openpyxl,glob
D=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def slug(s):
    s=unicodedata.normalize('NFD',str(s).lower()); s=''.join(c for c in s if unicodedata.category(c)!='Mn')
    return re.sub(r'[^a-z0-9._-]+','-',s).strip('-')[:120]
def seg(v):
    if v is None or v=='': return None
    if isinstance(v,(int,float)): return int(v)
    s=str(v).strip().lower().replace(' ','')
    m=re.match(r'^([\d.,]+)(k|mil|m|mi)?$',s)
    if not m: return None
    n,u=m.groups()
    try:
        if u: n=float(n.replace(',','.'))*(1000 if u in('k','mil') else 1e6)
        else: n=float(n.replace('.','').replace(',','.'))
    except ValueError: return None
    return int(round(n))
def eng(v):
    if v is None or v=='': return None
    if isinstance(v,(int,float)): return round(v*100 if v<1 else v,2)
    m=re.match(r'^([\d.,]+)\s*%?$',str(v).strip())
    try: return round(float(m.group(1).replace(',','.')),2) if m else None
    except ValueError: return None
ex_inf={os.path.basename(f)[:-5]:json.load(open(f)) for f in glob.glob(f'{D}/dbread/influenciadores/*.json')}
ex_ac={os.path.basename(f)[:-5]:json.load(open(f)) for f in glob.glob(f'{D}/dbread/acoes/*.json')}
def data(d): return d
W=[];newinf={};upd={}
def put_inf(h,seguid,engaj,nicho,grupo):
    if h in ex_inf:
        cur=data(ex_inf[h]); patch={}
        if cur.get('seguidores') in (None,'') and seguid: patch['seguidores']=seguid
        if cur.get('engajamento') in (None,'') and engaj is not None: patch['engajamento']=engaj
        if not cur.get('nicho') and nicho: patch['nicho']=nicho
        if patch: upd.setdefault(h,{}).update(patch)
    elif h in newinf:
        n=newinf[h]
        if seguid: n['seguidores']=seguid
        if engaj is not None: n['engajamento']=engaj
        if nicho and not n['nicho']: n['nicho']=nicho
    else:
        newinf[h]=dict(perfil='@'+h,nome='',seguidores=seguid,engajamento=engaj,grupo=grupo,nicho=nicho or '',cidade='',email='',whatsapp='',endereco='',notas='')
acoes={};acupd={}
def put_ac(marca,mes,h,status,tipo,camp,obs,valor=None,suffix=''):
    aid=slug(f'{marca}-{mes}-{h}{suffix}')
    doc=dict(inf=h,marca=marca,mes=mes,tipo=tipo,status=status,valor=valor,campanha=camp,obs=obs)
    if aid in ex_ac: acupd[aid]=doc
    else: acoes[aid]=doc
# 1. controles da Bia
for o in json.load(open(f'{D}/ctrl_clean.json')):
    h=o['handle']; n=(o['nicho'] or '').strip() if isinstance(o['nicho'],str) else ''
    put_inf(h,seg(o['seg']),eng(o['eng']),n,'Seeding '+o['marca'].title())
    camp=('Prescritores ' if o['prescritor'] else 'Seeding mensal ')+o['marca'].title()
    if re.search(r'm[aã]es|pais',o['tab'],re.I): camp+=' · '+('Dia das Mães' if 'ã' in o['tab'] or 'Mães' in o['tab'] else 'Dia dos Pais')
    just=(o['just'] or '').strip() if isinstance(o['just'],str) else ''
    put_ac(o['marca'],o['mes'],h,o['st'],'Seeding',camp,('Fonte: Controle/Status '+o['marca'].title()+', aba '+o['tab'].strip()+'. '+just)[:400],suffix='-presc' if o['prescritor'] else '')
# 2. De Cecco contratados
dc=[('dehwerneck','Jul/26',7500,224000,0.50,'Onda 1','Publicado'),('pietroferrari','Jul/26',2500,44300,0.97,'Onda 1','Publicado'),('cozinhandocomtalita','Jul/26',9000,939000,0.85,'Onda 1','Publicado'),
    ('nonnasantinha','Set/26',4000,56300,7.77,'Onda 2','Publicado'),('lucasalencar_blog','Set/26',7500,301400,0.87,'Onda 2','Publicado'),('rafaelferreirah','Set/26',7700,216000,1.01,'Onda 2','Publicado'),
    ('nossosdates_','Out/26',1900,56900,62.99,'Onda 3','Aprovado'),('nathalia.pianaro','Out/26',2000,150100,1.15,'Onda 3','Aprovado'),('chefraphavasconcellos','Out/26',6000,65300,2.06,'Onda 3','Aprovado'),('rafael_camatta','Out/26',9300,1600000,1.89,'Onda 3','Aprovado')]
for h,mes,v,s,e,onda,st in dc:
    put_inf(h,s,e,'Gastronomia','Campanha De Cecco')
    put_ac('DE CECCO',mes,h,st,'Pago','De Cecco · '+onda,'Valor negociado. Fonte: Mailling Campanha De Cecco (aba '+onda.upper()+') e e-mails da Bia com a Aurora.',v)
put_inf('oskherlakians',None,None,'','Campanha De Cecco')
put_ac('DE CECCO','Out/26','oskherlakians','Kit enviado','Seeding','De Cecco · Onda 3','Envio seeding listado na aba ONDA 3.')
# writes
for h,d in newinf.items(): W.append({'op':'set','collection':'influenciadores','doc_id':h,'data':d})
for h,p in upd.items(): W.append({'op':'update','collection':'influenciadores','doc_id':h,'data':p,'if_version':1})
for a,d in acoes.items(): W.append({'op':'set','collection':'acoes','doc_id':a,'data':d})
for a,d in acupd.items():
    old=data(ex_ac[a])
    R=['Prospect','Recusado','Em aprovação','Aprovado','Kit enviado','Publicado']
    if R.index(old.get('status','Prospect'))>R.index(d['status']): d['status']=old['status']
    d['obs']=(d['obs']+(' | Antes: '+old.get('obs','') if old.get('obs') else ''))[:500]
    W.append({'op':'update','collection':'acoes','doc_id':a,'data':d,'if_version':1})
print('novos infl',len(newinf),'upd infl',len(upd),'novas acoes',len(acoes),'upd acoes',len(acupd),'total',len(W))
os.makedirs(f'{D}/seed2',exist_ok=True)
for i in range(0,len(W),50): json.dump(W[i:i+50],open(f'{D}/seed2/b{i//50:02d}.json','w'),ensure_ascii=False)
print(sorted(acupd)[:40])
