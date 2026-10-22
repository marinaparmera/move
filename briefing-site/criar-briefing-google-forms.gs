/**
 * Briefing de Site | Movementme
 * Cria o formulário completo no Google Forms e uma planilha de respostas.
 *
 * Como usar:
 * 1. Acesse https://script.google.com e clique em "Novo projeto".
 * 2. Apague o conteúdo do editor e cole este arquivo inteiro.
 * 3. Clique em Salvar e depois em Executar (função criarBriefing).
 * 4. Autorize o acesso à sua conta Google quando for pedido.
 * 5. Abra "Registro de execução": os links do formulário e da planilha aparecem lá.
 *    O formulário também fica salvo no seu Google Drive.
 */

const SN = ['Sim', 'Não', 'Não sei'];

function txt(f, t, o = {}) {
  const i = f.addTextItem().setTitle(t);
  if (o.h) i.setHelpText(o.h);
  if (o.req) i.setRequired(true);
  if (o.email) i.setValidation(FormApp.createTextValidation().requireTextIsEmail().build());
  return i;
}
function par(f, t, o = {}) {
  const i = f.addParagraphTextItem().setTitle(t);
  if (o.h) i.setHelpText(o.h);
  if (o.req) i.setRequired(true);
  return i;
}
function radio(f, t, opts, o = {}) {
  const i = f.addMultipleChoiceItem().setTitle(t).setChoiceValues(opts);
  if (o.h) i.setHelpText(o.h);
  if (o.req) i.setRequired(true);
  if (o.other) i.showOtherOption(true);
  return i;
}
function check(f, t, opts, o = {}) {
  const i = f.addCheckboxItem().setTitle(t).setChoiceValues(opts);
  if (o.h) i.setHelpText(o.h);
  if (o.req) i.setRequired(true);
  if (o.other) i.showOtherOption(true);
  return i;
}
function lista(f, t, opts, o = {}) {
  const i = f.addListItem().setTitle(t).setChoiceValues(opts);
  if (o.h) i.setHelpText(o.h);
  if (o.req) i.setRequired(true);
  return i;
}
function pagina(f, t, d) {
  const p = f.addPageBreakItem().setTitle(t);
  if (d) p.setHelpText(d);
  return p;
}
function aviso(f, t, d) {
  return f.addSectionHeaderItem().setTitle(t).setHelpText(d);
}

function criarBriefing() {
  const f = FormApp.create('Briefing de Site | Movementme');
  f.setDescription(
    'Estas respostas mostram para a equipe da Move tudo o que o seu site precisa: objetivo, estrutura, conteúdo, produtos, integrações e acessos.\n\n' +
    'Responda o que souber. Se não souber alguma coisa, deixe em branco ou marque "Não sei", que a gente resolve junto na reunião.\n\n' +
    'Tempo médio: 20 a 30 minutos.'
  );
  f.setProgressBar(true);
  f.setConfirmationMessage('Obrigado! A equipe da Move recebeu o seu briefing e vai chamar você para a reunião de alinhamento.');

  // 1. Dados da empresa (primeira página)
  aviso(f, 'Dados da empresa', 'Informações que vão para o rodapé, a página de contato, as políticas e o Google.');
  txt(f, 'Razão social');
  txt(f, 'Nome fantasia (como a marca aparece no site)', { req: true });
  txt(f, 'CNPJ');
  txt(f, 'Inscrição estadual e municipal', { h: 'Se tiver' });
  par(f, 'Endereço completo');
  radio(f, 'O endereço deve aparecer no site?', ['Sim, completo', 'Só a cidade', 'Não']);
  txt(f, 'Horário de funcionamento');
  txt(f, 'Ramo de atuação e segmento');
  txt(f, 'Há quanto tempo a empresa existe?');
  txt(f, 'Link do cartão CNPJ', { h: 'Cole o link do arquivo no Google Drive ou Dropbox, ou envie depois pelo WhatsApp' });

  // 2. Contatos
  pagina(f, 'Responsáveis e contatos', 'Com quem a gente fala durante o projeto.');
  txt(f, 'Nome do responsável pelo projeto', { req: true });
  txt(f, 'Cargo');
  txt(f, 'WhatsApp', { req: true, h: '(00) 00000-0000' });
  txt(f, 'E-mail', { req: true, email: true });
  txt(f, 'Quem aprova o layout e o conteúdo, se for outra pessoa? (nome e contato)');
  txt(f, 'Responsável técnico ou TI atual (nome e contato)', { h: 'Se houver alguém que cuida de domínio, hospedagem ou sistemas' });
  check(f, 'Melhor canal para falar com vocês', ['WhatsApp', 'E-mail', 'Ligação', 'Reunião online']);

  // 3. Objetivo
  const objetivos = ['Vender online', 'Gerar contatos e orçamentos', 'Levar o cliente para o WhatsApp', 'Agendamentos', 'Captar leads (e-mails, cadastros)', 'Catálogo de produtos', 'Fortalecer a marca'];
  pagina(f, 'Objetivo e estratégia', 'A parte mais importante: é ela que define a estrutura do site.');
  radio(f, 'Qual é o principal objetivo do site?', objetivos, { req: true, other: true });
  check(f, 'Objetivos secundários', objetivos.concat(['Recrutar pessoas']));
  par(f, 'Quem é o seu público?', { h: 'Idade, perfil, região, se vende para empresas (B2B) ou para pessoas (B2C)' });
  txt(f, 'Qual é a principal ação que o visitante deve fazer no site?', { h: 'Exemplo: comprar, chamar no WhatsApp, pedir orçamento, agendar' });
  par(f, 'O que diferencia sua empresa da concorrência?');
  check(f, 'Como você vai medir se o site deu certo?', ['Vendas', 'Contatos e orçamentos', 'Mensagens no WhatsApp', 'Agendamentos', 'Visitas ao site', 'Cadastros de e-mail'], { other: true });

  // 4. Referências
  pagina(f, 'Referências e inspirações', 'Mostre sites que você gosta, de qualquer segmento. Para cada um, conte o que te chama atenção: cores, fotos, organização, textos, facilidade de navegar, animações ou a sensação que passa.');
  for (let n = 1; n <= 4; n++) {
    txt(f, `Referência ${n}: link do site`);
    par(f, `Referência ${n}: o que você gosta nele? Tem algo de que não gosta?`);
  }
  par(f, 'Tem algum site do seu segmento que você vê como referência?', { h: 'Cole o link e diga por quê' });
  par(f, 'Quais são os seus 3 principais concorrentes? O que eles fazem bem e o que fazem mal?', { h: 'Cole os links' });
  par(f, 'Tem algum site ou estilo que você NÃO quer de jeito nenhum? Por quê?');
  check(f, 'Que sensação o seu site deve passar?', ['Moderno', 'Clássico e elegante', 'Minimalista e clean', 'Colorido e divertido', 'Sofisticado ou premium', 'Acolhedor e afetivo', 'Tecnológico', 'Natural e orgânico', 'Ousado'], { other: true });
  radio(f, 'Prefere um site com mais imagens ou com mais texto?', ['Mais imagens', 'Equilibrado', 'Mais texto']);
  radio(f, 'Prefere tons claros ou escuros?', ['Claros', 'Escuros', 'Tanto faz']);
  par(f, 'Referências que não são sites', { h: 'Perfis do Instagram, embalagens, lojas físicas, revistas' });
  txt(f, 'Link de pasta ou painel com prints e inspirações', { h: 'Pinterest, Google Drive, Canva ou similar' });

  // 5. Situação atual (pula a página seguinte se o site for do zero)
  pagina(f, 'Situação atual');
  const tipo = radio(f, 'O projeto é:', ['Site do zero'], { req: true });

  const pgSiteAtual = pagina(f, 'Sobre o site atual', 'Para planejar a migração sem perder conteúdo nem posicionamento no Google.');
  txt(f, 'Link do site atual');
  lista(f, 'Em qual plataforma o site atual foi feito?', ['WordPress', 'WooCommerce', 'Shopify', 'Nuvemshop', 'Tray', 'Loja Integrada', 'Wix', 'VTEX', 'Outra', 'Não sei']);
  par(f, 'O que funciona e o que não funciona no site atual?');
  check(f, 'O que precisa ser migrado do site atual?', ['Textos e páginas', 'Produtos', 'Clientes', 'Pedidos', 'Posts do blog', 'Nada']);
  radio(f, 'O site atual recebe visitas relevantes vindas do Google?', SN);

  // 6. Domínio e hospedagem
  const pgDominio = pagina(f, 'Domínio, hospedagem e e-mail', 'Não envie senhas aqui. Vamos pedir acesso de forma segura depois.');
  radio(f, 'Já tem domínio registrado (exemplo: suaempresa.com.br)?', SN);
  txt(f, 'Se sim, qual é o domínio?');
  lista(f, 'Onde o domínio está registrado?', ['Registro.br', 'GoDaddy', 'Hostinger', 'HostGator', 'Locaweb', 'KingHost', 'Cloudflare', 'Outro', 'Não sei', 'Não tenho domínio']);
  txt(f, 'Quem tem acesso ao painel do domínio?');
  radio(f, 'Já tem servidor ou hospedagem contratada?', SN);
  txt(f, 'Se sim, qual empresa e qual plano?');
  radio(f, 'Quer que a Move contrate e gerencie a hospedagem?', ['Sim', 'Não', 'Quero conversar']);
  radio(f, 'Usa e-mail profissional?', ['Google Workspace', 'Microsoft 365', 'E-mail da hospedagem', 'Não uso', 'Não sei']);
  txt(f, 'Precisa criar e-mails novos? Quais?', { h: 'Exemplo: contato@, vendas@, financeiro@' });
  radio(f, 'O site atual tem o cadeado de segurança (https)?', ['Sim', 'Não', 'Não sei', 'Não tenho site']);

  // 7. Plataforma
  pagina(f, 'Plataforma e funcionalidades');
  lista(f, 'Tem preferência de plataforma?', ['Deixo a escolha com a Move', 'WordPress', 'Shopify', 'Nuvemshop', 'Tray', 'Wix', 'Webflow', 'Outra']);
  check(f, 'O que o site precisa ter?', ['Formulário de contato', 'Botão flutuante de WhatsApp', 'Blog', 'Agendamento online', 'Área de membros ou login', 'Chat', 'Pop-up de captura de e-mail', 'Mais de um idioma', 'Galeria ou portfólio', 'Depoimentos e avaliações', 'Mapa', 'Perguntas frequentes', 'Feed do Instagram', 'Calculadora ou simulador'], { other: true });
  par(f, 'Precisa integrar com algum sistema?', { h: 'CRM, ERP, agendamento, RD Station, HubSpot, Bling, Tiny, Omie, outro' });

  // 8. Identidade visual
  pagina(f, 'Identidade visual e conteúdo');
  radio(f, 'Já tem logotipo?', ['Sim, em vetor (SVG, AI, PDF)', 'Sim, só em imagem (PNG, JPG)', 'Não, precisa criar']);
  radio(f, 'Tem manual de marca com cores e fontes definidas?', SN);
  txt(f, 'Quais são as cores da marca?', { h: 'Nome ou código da cor, se souber' });
  radio(f, 'Tem fotos profissionais da empresa, equipe e produtos?', ['Sim, todas', 'Algumas', 'Não']);
  radio(f, 'Precisa de produção de fotos ou de banco de imagens?', ['Produção de fotos', 'Banco de imagens', 'Não preciso', 'Quero conversar']);
  radio(f, 'Quem vai escrever os textos do site?', ['Eu (cliente)', 'Move', 'Os dois juntos']);
  radio(f, 'Tem vídeos institucionais ou de produtos?', SN);
  check(f, 'Tom de voz da marca', ['Formal', 'Descontraído', 'Técnico', 'Acolhedor', 'Sofisticado', 'Divertido', 'Direto']);
  radio(f, 'Já tem por escrito a história, a missão e os valores da empresa?', SN);
  txt(f, 'Link da pasta com logo, manual, fotos e textos', { h: 'Google Drive, Dropbox ou WeTransfer' });

  // 9. Páginas (a última pergunta decide se mostra as seções de loja virtual)
  pagina(f, 'Estrutura de páginas');
  check(f, 'Quais páginas o site deve ter?', ['Início', 'Sobre', 'Serviços', 'Produtos ou loja', 'Blog', 'Contato', 'Perguntas frequentes', 'Trabalhe conosco', 'Depoimentos', 'Portfólio ou cases', 'Política de privacidade', 'Termos de uso'], { other: true });
  txt(f, 'Quantos serviços ou categorias precisam de página própria?');
  radio(f, 'Vai precisar de páginas separadas para campanhas (landing pages)?', SN);
  const vende = radio(f, 'O site vai vender produtos online, com carrinho e pagamento?', ['Não'], { req: true, h: 'Se marcar Sim ou Ainda não sei, aparecem as perguntas sobre produtos, pagamento e frete.' });

  // 10. Produtos (loja virtual)
  const pgProdutos = pagina(f, 'Loja virtual: produtos e catálogo', 'Quanto mais completas as fichas técnicas, mais rápido o cadastro e melhor o resultado no Google.');
  lista(f, 'Quantos produtos serão cadastrados no lançamento?', ['Até 20', '21 a 50', '51 a 200', '201 a 500', 'Mais de 500'], { req: true });
  par(f, 'Quantas categorias e subcategorias? Quais?');
  check(f, 'Os produtos têm variações?', ['Tamanho', 'Cor', 'Sabor', 'Peso ou volume', 'Voltagem', 'Não têm variações'], { other: true });
  radio(f, 'As fichas técnicas dos produtos estão prontas?', ['Sim, completas', 'Parcialmente', 'Não']);
  lista(f, 'Em qual formato estão as fichas?', ['Planilha (Excel ou Google Sheets)', 'PDF', 'No sistema ou ERP', 'No site atual', 'Outro']);
  check(f, 'O que cada ficha tem?', ['Nome', 'Descrição', 'Preço', 'Preço promocional', 'Código (SKU)', 'Código de barras (EAN)', 'Peso e dimensões', 'Fotos', 'Ingredientes ou composição', 'Tabela nutricional', 'Validade', 'Modo de uso', 'Alérgenos']);
  radio(f, 'Quem vai cadastrar os produtos?', ['Eu (cliente)', 'Move', 'Os dois juntos']);
  radio(f, 'Controla estoque?', ['Sim, em sistema', 'Sim, em planilha', 'Não controlo', 'Produção sob demanda']);
  lista(f, 'Usa algum ERP ou sistema de gestão?', ['Bling', 'Tiny (Olist)', 'Omie', 'Conta Azul', 'TOTVS', 'Outro', 'Não uso']);
  radio(f, 'Vende no atacado e no varejo com preços diferentes?', ['Só varejo', 'Só atacado', 'Os dois']);
  radio(f, 'Tem produtos sob encomenda ou personalizados?', SN);

  // 11. Pagamento e frete (loja virtual)
  pagina(f, 'Loja virtual: pagamento, frete e nota fiscal');
  check(f, 'Quais formas de pagamento?', ['Pix', 'Cartão de crédito', 'Parcelamento', 'Cartão de débito', 'Boleto', 'Pagamento na entrega']);
  lista(f, 'Já tem conta em algum intermediador de pagamento?', ['Mercado Pago', 'PagBank (PagSeguro)', 'Pagar.me', 'Stripe', 'Asaas', 'Cielo', 'Stone', 'Getnet', 'Outro', 'Não tenho']);
  check(f, 'Como faz as entregas?', ['Correios', 'Melhor Envio', 'Transportadora', 'Motoboy próprio', 'Aplicativo de entrega', 'Retirada no local'], { other: true });
  radio(f, 'Para onde entrega?', ['Só na minha cidade', 'Na minha região', 'No estado', 'Brasil todo']);
  txt(f, 'Oferece frete grátis? Com qual regra?', { h: 'Exemplo: acima de R$ 200 para a capital' });
  radio(f, 'O cliente precisa escolher data ou horário de entrega?', SN, { h: 'Importante para produtos perecíveis e encomendas' });
  txt(f, 'Emite nota fiscal eletrônica? Por qual sistema?');
  radio(f, 'Já tem política de troca e devolução escrita?', SN);

  // 12. Canais
  const pgCanais = pagina(f, 'Canais de venda e atendimento');
  check(f, 'Onde você vende hoje?', ['Loja física', 'WhatsApp', 'Instagram', 'iFood', 'Mercado Livre', 'Shopee', 'Amazon', 'Revendedores', 'Site próprio', 'Feiras e eventos'], { other: true });
  txt(f, 'Qual canal mais vende hoje?');
  radio(f, 'Usa WhatsApp Business?', ['Sim, o aplicativo', 'Sim, a API oficial', 'Não, uso o WhatsApp comum', 'Não uso WhatsApp']);
  txt(f, 'Número do WhatsApp que vai aparecer no site');
  lista(f, 'Usa alguma ferramenta de atendimento?', ['Não uso', 'Kommo', 'Blip', 'Zenvia', 'Z-API', 'Chatwoot', 'Octadesk', 'Outra']);
  radio(f, 'Tem catálogo cadastrado no WhatsApp ou loja no Instagram e Facebook?', SN);
  txt(f, 'Quem vai responder os contatos que chegarem pelo site?');

  // 13. Google e tags
  pagina(f, 'Google, tags e rastreamento', 'Marque o que já existe. Se não souber o que é, marque "Não sei": verificamos com você.');
  f.addGridItem().setTitle('Quais contas e ferramentas você já tem?')
    .setRows(['Conta Google da empresa (Gmail ou Workspace)', 'Google Analytics 4', 'Google Tag Manager', 'Google Search Console', 'Perfil da Empresa no Google (Google Meu Negócio)', 'Google Ads', 'Google Merchant Center', 'Meta Business (Gerenciador de Negócios)', 'Pixel da Meta', 'API de Conversões da Meta', 'Pixel do TikTok', 'LinkedIn Insight Tag'])
    .setColumns(SN);
  check(f, 'Anuncia ou pretende anunciar em:', ['Google', 'Instagram e Facebook', 'TikTok', 'LinkedIn', 'Pinterest', 'Ainda não anuncio']);
  lista(f, 'Usa ferramenta de e-mail marketing?', ['Não uso', 'RD Station', 'Mailchimp', 'Klaviyo', 'Brevo', 'E-goi', 'Outra']);
  check(f, 'O que precisamos rastrear como conversão?', ['Compra', 'Formulário enviado', 'Clique no WhatsApp', 'Clique no telefone', 'Agendamento', 'Cadastro de e-mail'], { other: true });
  aviso(f, 'Sobre acessos', 'Nunca envie senhas por formulário ou WhatsApp. Vamos te mandar o e-mail da Move para você adicionar como administrador em cada conta. Assim o acesso fica registrado e pode ser removido quando quiser.');
  radio(f, 'Você consegue adicionar o e-mail da Move como administrador nessas contas?', ['Sim, consigo sozinho(a)', 'Preciso de ajuda', 'Não sei onde fica']);

  // 14. SEO e redes
  pagina(f, 'Google e redes sociais');
  par(f, 'O que o seu cliente digita no Google para te encontrar?', { h: 'Exemplo: doces sem açúcar em Curitiba, consultoria de marketing para clínicas' });
  radio(f, 'Atende onde?', ['Na minha cidade', 'Na minha região ou estado', 'Brasil todo', 'Outros países também']);
  txt(f, 'Instagram', { h: '@ ou link' });
  txt(f, 'Facebook');
  txt(f, 'TikTok');
  txt(f, 'LinkedIn');
  txt(f, 'YouTube');
  txt(f, 'Outras redes');

  // 15. Jurídico
  pagina(f, 'Jurídico e LGPD');
  radio(f, 'Já tem Política de Privacidade?', SN);
  radio(f, 'Já tem Termos de Uso?', SN);
  aviso(f, 'Banner de cookies', 'Sites que usam Google Analytics, Pixel da Meta e outras tags precisam pedir consentimento ao visitante (LGPD). A Move inclui isso no projeto.');
  par(f, 'Tem registros ou selos que precisam aparecer no site?', { h: 'ANVISA, conselho profissional (CRM, CRN, OAB), Reclame Aqui, certificações' });
  radio(f, 'A marca está registrada no INPI?', ['Sim', 'Em andamento', 'Não', 'Não sei']);

  // 16. Prazos
  pagina(f, 'Prazos, investimento e manutenção');
  f.addDateItem().setTitle('Existe uma data limite para o lançamento?');
  txt(f, 'Por que essa data?', { h: 'Evento, campanha, data comemorativa' });
  lista(f, 'Quanto pretende investir no site?', ['Até R$ 3 mil', 'R$ 3 mil a R$ 6 mil', 'R$ 6 mil a R$ 10 mil', 'R$ 10 mil a R$ 20 mil', 'Acima de R$ 20 mil', 'Prefiro conversar']);
  radio(f, 'Depois de pronto, quem vai atualizar o site?', ['Eu ou minha equipe', 'Move', 'Os dois']);
  radio(f, 'Tem interesse em plano de manutenção mensal?', ['Sim', 'Não', 'Quero saber mais']);
  check(f, 'Tem interesse em outros serviços depois do lançamento?', ['Tráfego pago (anúncios)', 'SEO', 'Blog e conteúdo', 'Redes sociais', 'E-mail marketing', 'Automação de WhatsApp']);
  par(f, 'Tem algo que não perguntamos e que você quer contar?');

  // Lógica condicional (definida depois que todas as páginas existem)
  tipo.setChoices([
    tipo.createChoice('Site do zero', pgDominio),
    tipo.createChoice('Reformulação de um site existente', pgSiteAtual),
    tipo.createChoice('Troca de plataforma', pgSiteAtual)
  ]);
  vende.setChoices([
    vende.createChoice('Sim', pgProdutos),
    vende.createChoice('Ainda não sei', pgProdutos),
    vende.createChoice('Não', pgCanais)
  ]);

  // Planilha de respostas
  const ss = SpreadsheetApp.create('Respostas | Briefing de Site Movementme');
  f.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  Logger.log('Link para enviar ao cliente: ' + f.getPublishedUrl());
  Logger.log('Editar o formulário: ' + f.getEditUrl());
  Logger.log('Planilha de respostas: ' + ss.getUrl());
}
