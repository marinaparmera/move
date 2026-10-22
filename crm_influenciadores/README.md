# CRM Influenciadores Move

Página: https://claude.ai/artifact/J2vUzEgB1X2YtLt5kvgHgn (banco de dados da própria página).

## Coleções do banco
- `influenciadores`: um documento por @ (perfil, nome, seguidores, engajamento, grupo, nicho, contato).
- `acoes`: uma ação por marca, mês e perfil (`inf`, `marca`, `mes` no formato `Out/26`, `tipo`, `status`, `valor`, `campanha`, `obs`). Id: `slug(marca-mes-perfil)`.
- `validacao`: uma linha por marca e mês do serviço (contratado na emissão, NFs, postagens nos Correios).
- `base_historica`: blocos `b000`... com a Base Única de Influenciadores 2016-2026.

Status: Prospect, Em aprovação, Aprovado, Kit enviado, Publicado, Recusado.

## Fontes
- Controles mensais da Bia no Drive: "Controle/Status Influenciadores | St. Dalfour / Kalassi / Splenda / Maped", "Controle Influenciadores | Janod" (uma aba por mês, MMAA).
- Emissão: aba mensal do DRE (departamento INFLUENCIADORES) e "Emissão NF - Modelo MOVE". A NF do mês M cobre o serviço de M-1.
- Correios: "Conciliação Correios 2026 · SGP x Reembolsos x DRE", aba BASE.
- Histórico: "Move · Base Única de Influenciadores 2016-2026".

## Regras de leitura dos controles
- Status "postou" = Publicado; "." = Kit enviado; vazio em mês passado = não enviado (ignorar); meses futuros = Em aprovação.
- Linhas abaixo de "reprovados" / "não aceita seeding" ficam de fora.
- Nunca copiar CPF, RG, endereço, dados bancários ou contato pessoal para o banco.

## Scripts (`scripts/`)
Rodam com `python3 -I` numa pasta de trabalho com `src/*.xlsx` (planilhas exportadas do Drive) e `dbread/` (leitura atual do banco):
`parse_ctrl.py` → `classify.py` → `build.py` (gera lotes de gravação) e `valid.py` (validação mensal). `hist.py` monta os blocos da base histórica.
