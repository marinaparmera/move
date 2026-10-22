import json,os,re,unicodedata,openpyxl
from collections import Counter,defaultdict
D=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def slug(s):
    s=unicodedata.normalize('NFD',str(s).lower()); s=''.join(c for c in s if unicodedata.category(c)!='Mn')
    return re.sub(r'[^a-z0-9._-]+','-',s).strip('-')[:120]
NB=lambda b:{'ST DALFOUR':'ST. DALFOUR'}.get(b,b)
MES=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
dre=json.load(open(f'{D}/dre_influ.json'))['rec']
ESC={  # escopo descrito na emissão 10-26
 'ST. DALFOUR':'15 envios seeding (R$ 2.449,30) + parceria paga com embaixadoras Ana Berg, Sofi e Vanessa Lino (R$ 3.000)',
 'KALASSI':'15 envios seeding (R$ 2.449,30)','MAPED':'7 seedings, MOVE envia (R$ 2.100)','JANOD':'3 seedings, MOVE envia (R$ 900)',
 'SPLENDA':'10 envios seeding (R$ 1.555,16) + 20 envios prescritores (R$ 2.625)','INSPIRITS':'5 seedings, MOVE envia (R$ 1.500)',
 'DE CECCO':'Gestão de influenciadores jun a out (R$ 5.800) + 1 envio','CASAS PEDRO':'Influenciadores (R$ 2.500), sem descritivo na base'}
FEE={2449.3:15,2332.67:15,2327.95:15,2625.0:20,2100.0:7,900.0:3,1555.16:10,1500.0:5}
docs={}
for k,v in dre.items():
    m,b=k.split('|'); b=NB(b); i={'JAN':1,'FEV':2,'MAR':3,'ABR':4,'MAI':5,'JUN':6,'JUL':7,'AGO':8,'SET':9,'OUT':10}[m[:3]]
    emis=MES[i-1]+'/'+m[-2:]
    mm=(MES[i-2]+'/'+m[-2:]) if i>1 else ('Dez/'+str(int(m[-2:])-1))
    d=docs.setdefault((b,mm),dict(marca=b,mes=mm,contratado=0,fee=0.0,outras=0.0,nfs=[],correios=0,escopo=ESC.get(b,'')))
    for nf,val in v:
        f=FEE.get(round(val,2))
        if b=='INSPIRITS' and val!=1500: f=None
        if b=='CASAS PEDRO': f=None
        if f and not (b=='ST. DALFOUR' and val==2625): d['contratado']+=f; d['fee']+=val
        elif b in('DE CECCO',) and val==5800: d['fee']+=val
        elif b=='ST. DALFOUR' and val in (3000.0,5250.0,750.0): d['fee']+=val
        else: d['outras']+=val
        d['mes_emissao']=emis
        d['nfs'].append(f"NF {int(nf)}: R$ {val:,.2f}".replace(',','X').replace('.',',').replace('X','.'))
wb=openpyxl.load_workbook(f'{D}/src/correios.xlsx',data_only=True,read_only=True)
for r in wb['BASE'].iter_rows(min_row=5,values_only=True):
    if len(r)>4 and r[2] and r[4]=='INFLUENCIADOR' and '/' in str(r[0]):
        a,y=r[0].split('/'); mm=a.title()+'/'+y; b=r[3]
        d=docs.setdefault((b,mm),dict(marca=b,mes=mm,contratado=0,fee=0.0,outras=0.0,nfs=[],correios=0,escopo=ESC.get(b,'')))
        d['correios']+=1
W=[]
for (b,m),d in docs.items():
    d['fee']=round(d['fee'],2); d['outras']=round(d['outras'],2); d['nfs']='; '.join(d['nfs'])
    d['fontes']='Emissão (DRE, departamento Influenciadores) · Conciliação Correios 2026 (SGPWeb) · escopo da emissão 10-26'
    W.append({'op':'set','collection':'validacao','doc_id':slug(f'{b}-{m}'),'data':d})
json.dump(W,open(f'{D}/seed2/validacao.json','w'),ensure_ascii=False)
print(len(W))
for w in sorted(W,key=lambda w:(w['data']['marca'],w['doc_id']))[:80]:
    d=w['data']; print(f"{d['marca']:12} {d['mes']} contr={d['contratado']:>3} correios={d['correios']:>3} fee={d['fee']:>8} outras={d['outras']:>8}")
