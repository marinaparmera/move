import json,re,sys,openpyxl
from collections import Counter,defaultdict
D=sys.argv[1]
rows=json.load(open(f'{D}/ctrl_rows.json'))
MES=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
def key(m): a,b=m.split('/'); return int(b)*100+MES.index(a)
HOJE=key('Out/26')
SEP=re.compile(r'reprovad|n[aã]o aceita|recusad|reserva|sugest',re.I)
out=[];cut=set()
for o in rows:
    t=(o['marca'],o['tab'])
    p=o['perfil'].strip()
    if SEP.search(p): cut.add(t); continue
    if t in cut: continue
    st=str(o['status'] or '').strip().lower()
    k=key(o['mes'])
    if k>HOJE: s='Em aprovação'
    elif 'postou' in st: s='Publicado'
    elif st=='.': s='Kit enviado'
    elif k==HOJE: s='Aprovado'
    else: continue  # mês passado sem envio registrado
    h=re.sub(r'^@','',p.split()[0]).strip().lower().rstrip('.,')
    if not re.match(r'^[a-z0-9._]{2,40}$',h): continue
    o2=dict(o); o2['handle']=h; o2['st']=s; out.append(o2)
# dedupe same brand/month/handle
seen=set();ded=[]
for o in out:
    k=(o['marca'],o['mes'],o['handle'],o['prescritor'])
    if k in seen: continue
    seen.add(k); ded.append(o)
json.dump(ded,open(f'{D}/ctrl_clean.json','w'),ensure_ascii=False,default=str)
# correios
wb=openpyxl.load_workbook(f'{D}/src/correios.xlsx',data_only=True,read_only=True)
cor=Counter()
for r in wb['BASE'].iter_rows(min_row=5,values_only=True):
    if len(r)>4 and r[2] and r[4]=='INFLUENCIADOR' and '/' in str(r[0]):
        m=r[0].title().replace('/','/'); a,b=r[0].split('/'); cor[(r[3].replace('ST. DALFOUR','ST. DALFOUR'),a.title()+'/'+b)]+=1
c=defaultdict(Counter)
for o in ded: c[(o['marca'],o['mes'])][o['st']+(' (presc)' if o['prescritor'] else '')]+=1
print(f"{'MARCA':12} {'MES':7} {'CRM(enviados)':>13} {'CORREIOS':>8}  detalhe")
for k in sorted(set(c)|set(x for x in cor if x[0] in ('ST. DALFOUR','KALASSI','SPLENDA','MAPED','JANOD')),key=lambda k:(k[0],key(k[1]))):
    env=sum(v for s,v in c[k].items() if s.startswith(('Publicado','Kit')))
    print(f"{k[0]:12} {k[1]:7} {env:>13} {cor.get(k,0):>8}  {dict(c[k])}")
print(len(ded))
