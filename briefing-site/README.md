# Briefing de Site | Movementme

Formulário que todo novo cliente de site da Move preenche antes do início do projeto. Aqui está tudo o que foi decidido e produzido na conversa com o Claude em outubro de 2026.

## Arquivos desta pasta

| Arquivo | O que é |
|---|---|
| `README.md` | Este resumo: decisões, como usar e próximos passos |
| `perguntas.md` | Lista completa das perguntas do briefing, por seção |
| `criar-briefing-google-forms.gs` | Script que cria o formulário inteiro no Google Forms, com a planilha de respostas |
| `formulario-artifact.html` | Versão em página web (publicada como Artifact no claude.ai), útil para preencher junto com o cliente na reunião |

## Decisões tomadas

1. **Ferramenta escolhida: Google Forms.** É gratuito, as respostas vão direto para uma planilha do Google e você recebe aviso por e-mail.
2. **Lovable descartado para este uso.** Ele consome créditos a cada criação ou ajuste, e o banco de dados pode ter custo de uso. Para um formulário, não compensa.
3. **Tally fica como alternativa.** Também é gratuito, tem visual mais bonito e aceita upload de arquivos sem login.
4. **Arquivos pedidos por link.** No Google Forms, o upload exige que o cliente faça login no Google. Por isso o formulário pede links de pastas (Drive, Dropbox, WeTransfer) para cartão CNPJ, logo, fotos e fichas técnicas.
5. **Nunca pedir senhas.** O formulário orienta o cliente a adicionar o e-mail da Move como administrador em cada conta (Google Analytics, Tag Manager, Search Console, Meta Business, domínio e hospedagem).
6. **Referências de sites** ganharam seção própria, com 4 campos de link, cada um com "o que você gosta nele".

## Como criar o formulário no Google Forms

1. Abra https://script.google.com no computador e clique em **Novo projeto**.
2. Apague o conteúdo do editor e cole o arquivo `criar-briefing-google-forms.gs` inteiro.
3. Clique em **Salvar** e depois em **Executar** (função `criarBriefing`).
4. Autorize o acesso à sua conta Google quando o Google pedir.
5. Abra o **Registro de execução**. Lá aparecem o link para mandar ao cliente, o link de edição e o link da planilha de respostas.

Depois de criar, faça dois ajustes à mão no Google Forms:

* Em **Respostas**, nos três pontinhos, ative **Receber notificações por e-mail para novas respostas**.
* Na **paleta** (ícone de personalizar tema), aplique as cores e a imagem de cabeçalho da Move.

## Lógica condicional do formulário

* **Situação atual:** quem marca "Site do zero" pula a página "Sobre o site atual".
* **Loja virtual:** a última pergunta da seção "Estrutura de páginas" é "O site vai vender produtos online?". Quem marca Sim ou "Ainda não sei" vê as seções de produtos, fichas técnicas, pagamento e frete. Quem marca Não pula direto para "Canais de venda".

## Versão Artifact (página web)

* Link: https://claude.ai/artifact/YMC9298h8GNXCdAdUmE1vR (privado; para outra pessoa abrir, compartilhe pelo menu Compartilhar).
* Só quem é da organização da Move consegue salvar as respostas no painel. Clientes de fora recebem uma tela com o botão **Copiar respostas** para colar no WhatsApp ou no e-mail.
* Melhor uso: a equipe preencher junto com o cliente na reunião de onboarding.

## Próximos passos

- [ ] Rodar o script e criar o formulário no Google Forms
- [ ] Ativar as notificações por e-mail e aplicar a identidade visual da Move
- [ ] Definir qual e-mail da Move os clientes vão adicionar como administrador nas contas
- [ ] Testar o formulário de ponta a ponta (um envio com loja virtual e outro sem)
- [ ] Decidir se a versão Artifact continua ou se deve ser apagada
