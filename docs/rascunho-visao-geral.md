# Rascunho: visão geral ditada pelo dono do produto

Status: **em captura** (iniciado em 2026-11-13). Registro bruto, em ordem, do que o dono descreve. Nada aqui é decisão final: depois do interrogatório (grill), o conteúdo migra para `visao-geral.md`, `GLOSSARY.md`, ADRs e `roadmap.md`, e este arquivo é removido.

## Ponto de retomada

Última posição (2026-11-13): captura nos Inputs 1 a 5; **grill ainda não iniciado**. Próximo passo: o dono descreve o que acontece na tela e no banco ao cadastrar uma pessoa em `cadastros` (ordem de preenchimento e o que grava em cada tabela), continuando a trilha do Input 5. Depois, o dono diz "pode grilar".

## Captura (fiel ao que foi dito)

### Input 1: objetivo do sistema (2026-11-13)

**Objetivo.** Controlar todos os processos de _qualquer_ empresa que presta serviços de **bordados e cortes a laser** e que também **terceiriza** fornecedores de outros serviços do ramo de confecção de moda (silkscreen, estamparia, colagem de adesivo sobre tecido etc.). Em desenvolvimento; partes já em elaboração; módulos serão feitos parte a parte.

**Acesso.** O sistema se divide em acessos conforme a necessidade do usuário, por liberação de senha. Segue os trâmites conforme o login. Precisa de **senha-master** para um usuário acessar conforme a necessidade (rotinas acessíveis pela Senha-Master e/ou pelos Setores, e por usuários logados conforme regras).

**Papéis de pessoa (os "módulos de acesso", em ordem):**
- **Visitantes**: sem acesso ao sistema; veem uma síntese do que o sistema faz, com exemplos e informações do momento. Sem bloqueio, pois não há como entrar no sistema por ali. Mostra também exemplos dos serviços prestados pela empresa.
- **Consumidores**: solicitam orçamentos e, depois, serviço; no futuro poderão consultar seu serviço já prestado. Cadastro mínimo: **nome e telefone**.
- **Clientes**: voltam a solicitar serviços várias vezes. Um Consumidor que quer virar Cliente preenche cadastro com os dados trazidos de "Visitantes para Clientes" mais documento, e-mail, endereço etc.
- **Fornecedores**: fornecem materiais e/ou prestam serviços à empresa. Mesmos requisitos de cadastro de Clientes.
- **Funcionários**: trabalham na empresa; podem ou não ter acesso ao sistema.
- **Usuários**: usam o sistema, com parâmetros por ação (o que podem ou não acessar).

**Execução e deploy.** O executável fica no terminal; futuramente roda em provedor de internet com domínio (ex.: `www.piratec.com.br`). Hoje, em loco (`localhost`), para desenvolvimento.

**Fluxo ao abrir o sistema.**
1. Se o backend não estiver no ar, emite aviso.
2. Se estiver, verifica se os bancos de dados estão liberados, faz o checking e mostra a lista que o backend enviou.
3. Libera a página **HOME**, com os setores: **Visitantes, Recepção, Produção, Acabamento, Expedição, Administração e Config**.
4. Todas as rotinas são acessadas pela Senha-Master e/ou pelos Setores; usuários logados conforme regras. Só **Visitantes** dispensa bloqueio.

### Input 2: fluxo do pedido e papel do Config (2026-11-13)

**Setores (ordem do fluxo):** Visitantes, Recepção, **Design** (esquecido na lista do Input 1; vem logo após a Recepção), Produção, Acabamento, Expedição, Administração, Config.

**Fluxo de uma solicitação:**
1. O cidadão solicita um **Serviço** e/ou **Orçamento** na **Recepção**.
2. O usuário da recepção preenche um **formulário** com as informações necessárias para a execução.
3. **Orçamento**: não vai ao Design. A recepção toma conhecimento do valor direto com o Design **ou** pela **Tabela** existente e cola o valor no orçamento.
4. **Serviço com criação**: vai ao **Design**, que desenvolve a arte; o próprio Design contata o solicitante, mostra e pede **autorização** do produto esperado. (Há também a decisão de valores, "desenvolvido ou não em questão de valores".)
5. Para **ambos** (orçamento e serviço), a **Ordem de Serviço (OS)** é gravada na Recepção em uma tabela com **código único**.
6. Após **aprovado**, segue para a **Produção**.
7. Ao término (ou parte do trabalho), segue para o **Acabamento**; do mesmo modo, ao término ou fase, para a **Expedição**.
8. A **Expedição** se comunica com o Cliente/Consumidor para **resgatar** o pedido.
9. **Pagamento:** Clientes de **baixo custo** pagam na Expedição. Os **faturados** vão direto para a **Administração**.
10. **Administração**: controles de **compras e vendas**; é ela quem faz **recebimentos e pagamentos** da empresa.

**Config (hoje).** É o setor que o dono mostra no desenvolvimento, porque nele testa se os campos gravados nas tabelas estão corretos em **inclusão, alteração, exclusão, importação, listagem impressa em papel e visualização**. Prioridade declarada: dados **corretos, fiéis e seguros**. O dono ajusta conforme for mais lógico e seguro.

### Input 3: correções e exceções (2026-11-13)

**Correção de "resgatar".** Na **Expedição**, ela recebe o material e contata o Cliente/Consumidor para **retirar e pagar** conforme a OS (o pagamento de baixo custo acontece aqui). **Resgate** no sistema = **recuperação de acesso do Usuário que esqueceu a senha**, por **e-mail e WhatsApp**, "como no Windows", conforme o cadastro do usuário.

**Exceções do fluxo:**
- **Cliente recusa a arte:** não ocorre. O Cliente só recebe o produto depois de **aprovar a arte em foto enviada** a ele (a aprovação precede a Produção).
- **Produção erra uma peça:** raro, mas possível. Solução: pedir ao cliente o mesmo material para refazer, **ou** a empresa repõe o material se necessário.
- **Cliente não retira o pedido:** risco inerente ao comércio de prestação de serviço (prejuízo da empresa). Segundo o dono, pela lei de prestadores de serviço, se o prejuízo for grande, após **comunicar o cliente** e passados **90 dias**, a empresa pode **vender o produto feito**. (Entendimento do dono; **validar com assessoria jurídica** antes de implementar.)

### Input 4: vitrine do Visitante e outras empresas (2026-11-13)

**Vitrine do Visitante.** O Visitante vê as **imagens de trabalhos já executados** pela empresa que **não têm registro próprio**. Na **OS**, o **cliente aceita ou não** a exibição da imagem (respeito às **grifes**/marcas). Só aparece o que foi autorizado.

**Outras empresas (SaaS).** Futuro, via internet: cada empresa terá **um DB próprio**, criado na aquisição do produto. Hoje o sistema só roda **em loco**, com o DB MySQL 8.1 local; a **criação automatizada de DB/instalação ainda não existe**. Depois que tudo funcionar, essas instalações entram no módulo **Config**, e também para a internet, "quando chegar a hora".

### Input 5: "tráfego" já definido: abertura e tabelas (2026-11-13)

Descrição do dono do que **já está determinado** (será a trilha de evolução):

1. Acesso: executa `localhost:porta` (Vite). O frontend recebe do backend o resultado (**ok ou falha**, com motivo).
2. O backend tem uma **lista de tabelas** que verifica, checa e/ou cria.
3. Dentro dela há uma **lista menor de tabelas com registros default**, necessários para o sistema funcionar.
4. A tabela principal que gerencia isso é **`systables`**.
5. Exemplos: `empresas` = só criada; `pessoas` = com default (`1 Pessoa Física/PF` e `2 Pessoa Jurídica/PJ`; o dono escreveu "FS" por engano, o seed usa **PF**).
6. **Regra de cascata (chave estrangeira):** tabelas com FK dependem de um registro-pai. Exemplo: ao cadastrar uma **empresa**, primeiro seleciona-se se é Pessoa Jurídica ou Física, e a empresa assume `id_pessoas` conforme a seleção.
7. Uma empresa pode vender **produto** e/ou prestar **serviço**; o cadastro determina qual (um, outro ou ambos). (Ver lacuna abaixo.)
8. O dono parou o desenho na tabela **`cadastros`**: a partir dela falta definir o tráfego.

**Verificado no código (2026-11-13):** o seed de `pessoas` e a FK `empresas.id_pessoas` conferem; `systables` guarda `nome`, `chkdb` e mais campos; `cadastros` tem uma coluna FK para cada papel (empresa, visitante, consumidor, cliente, fornecedor, funcionário) mais cidade e imagem.

## Lacunas anotadas durante a captura

Perguntas que surgem enquanto o dono fala; ficam para o grill.

- ~~Multi-tenant: estrutura~~ → direção do dono: **um DB por empresa** (ADR 0002, opção A), sem coluna de tenant. Resta: como a instalação provisiona o DB (ver abaixo).
- **Consentimento de imagem na OS**: campo na OS (sim/não) ou por imagem? Quem pergunta e quando (Recepção, na abertura)? Pode ser revogado depois? Imagens de **orçamento sem serviço** entram? A imagem exibida é a foto do produto pronto ou a arte do Design?
- **Vitrine**: ordem/curadoria (alguém escolhe destaques) ou automática? Marca d'água? Quem pode ocultar uma imagem? Armazenamento (hoje `imagens` + ZIPs; ver `userclients`).
- **Provisionamento de DB (Config)**: quem cria o DB de uma nova empresa e como (script, API, painel)? Onde fica o catálogo de clientes SaaS e suas conexões (um "banco mestre" além dos bancos dos clientes)? Como atualizar o schema em N bancos? Como funciona a chave mestre de suporte entre N bancos?
- **Domínio por empresa** (decisão **futura**, dono, 2026-11-13): cada empresa terá domínio/subdomínio próprio ou escolhe a empresa no login? Como o sistema escolhe o DB? Fica para a fase de nuvem; não bloqueia o MVP.
- **Empresa × produto/serviço**: onde fica a marcação de que a empresa vende produto, presta serviço ou ambos? Hoje `empresas` tem `nome`, `fantasy` e `id_pessoas`, sem esse campo. É a mesma `empresas` que representa **a empresa dona do sistema**, **fornecedores PJ** e **a empresa de um visitante**? Ou são conceitos separados?
- **FK com valor 0**: as colunas FK de `cadastros` têm `default: 0`, mas o relacionamento exige que o pai exista (`onDelete: RESTRICT`). Existe um registro de `id = 0` em cada tabela-pai (ou o banco não impõe a FK)? Qual a regra: um cadastro tem **exatamente um** papel preenchido ou pode ter vários ao mesmo tempo (ex.: Consumidor que virou Cliente)?
- **Cadastro PF × PJ**: o cadastro de uma **pessoa física** (cliente, consumidor) passa por `empresas` também? Como o `id_pessoas` (PF/PJ) chega a cada papel?
- **`systables`**: quais campos o dono considera essenciais (`chkdb`, contagem, última checagem)? A UI lista tabelas OK/ausentes; o que acontece quando uma tabela está ausente: o sistema bloqueia ou apenas avisa (hoje "modo DEV")?
- **Falha de abertura**: motivos a distinguir na UI (backend fora, banco fora, tabelas ausentes, seed falhou)? Hoje o backend aborta se o banco cai na subida.
- **Versão do MySQL**: dev usa MySQL 8.1 local; o `docker-compose.yml` usa `mysql:8`. Padronizar a versão antes de ir à nuvem.
- **Backup/restauração por empresa** (há `BackupDB.tsx`/`RestoreDB.tsx` sem rota): faz parte do Config?
- Papel exato de cada módulo (Visitante, Recepção, Design, Produção, Acabamento, Expedição, Administração).
- ~~Como o Visitante autentica; diferença Consumidor × Cliente~~ → respondido em parte no Input 1 (ver abaixo). Resta: sigla de Pessoa.
- **Conflito com o código:** o backend trata Visitante como quem registra **visita com entrada/saída e tempo** (`visitas`), e `Visitante.tsx` é um módulo com permissões. O Input 1 descreve Visitante como **vitrine pública sem login**. São o mesmo conceito? O controle de entrada/saída ainda vale?
- ~~Design fora da lista~~ → omissão; Design é setor após a Recepção (Input 2).
- **OS**: um mesmo registro serve Orçamento e Serviço? Como um Orçamento aprovado vira Serviço (mesmo código ou novo)? Qual o formato do código único? Quais são os **status** da OS e quem pode mudar cada um?
- **Parcial**: "término ou parte do mesmo": uma OS pode estar em dois setores ao mesmo tempo (lote parcial)? Como se registra a quantidade?
- **Terceirizado**: em que etapa o Fornecedor entra (Produção? Acabamento?) e como a OS volta dele?
- **Tabela de preços** (colada no orçamento): é a `pages/tabela/{linha,preco}` vazia do frontend? Quem a mantém (Administração)?
- **Aprovação**: o Design registra a autorização no sistema (data, quem aprovou, evidência da arte)? O que acontece se o cliente recusa?
- **Pagamento**: baixo custo × faturado: qual critério define cada um (campo no Cliente?)? Consumidor sempre paga na Expedição?
- **Administração**: compras e vendas, recebimentos e pagamentos: é MVP? (Hoje fora do MVP.) Quais entidades (contas a pagar/receber, notas)?
- **Importação**: o que é importado no Config (CSV? ZIP de imagens? outro)? Para quais tabelas?
- **Impressão em papel**: lista A4 simples ou relatórios formatados? Há a função hoje?
- ~~Resgate: dois conceitos~~ → resolvido: Resgate = recuperação de senha (Input 3); na Expedição o termo é **retirada**. Padronizar no glossário.
- **Resgate por e-mail/WhatsApp** conflita com o código: hoje há `perguntas`/`pergsresps` (perguntas secretas) e nenhum envio de e-mail/WhatsApp. Perguntas secretas continuam (como segunda via) ou são abandonadas? Qual provedor de e-mail e de WhatsApp (API oficial)? Custo e consentimento? Entra no MVP de Acesso ou depois?
- **Aprovação da arte por foto**: enviada por qual canal (WhatsApp, e-mail, sistema)? A aprovação fica registrada no sistema (quem, quando, imagem)? Como o cliente "aprova" (resposta de texto, link)? É requisito antes de liberar a OS para a Produção?
- **Retrabalho**: a OS precisa de status/registro de retrabalho (peça refeita, material de quem, custo)? Quem arca: empresa ou cliente?
- **Pedido abandonado**: registrar as comunicações ao cliente (data, canal) e um prazo de 90 dias, com alerta? Existe status "abandonado/à venda"? Validação jurídica pendente.
- "Senha-master para um usuário acessar conforme a necessidade": a master é **suporte com acesso total** (ADR 0001) ou também uma **autorização** que o usuário digita para liberar uma rotina específica?
- "Qualquer empresa" + "terceirizar fornecedores": a empresa terceiriza o serviço de uma OS para um Fornecedor? Isso exige modelo de OS com etapa externa (fase futura).
- Transição Visitante → Consumidor → Cliente: é uma promoção do mesmo Cadastro (um registro que ganha papéis) ou registros separados? O código tem um `cadastros` com colunas para cada papel.
- Senha-master e Setores são duas formas de acesso paralelas? ("Senha-Master e/ou Setores")
- Domínio de exemplo `www.piratec.com.br`: nome comercial do produto? (hoje o sistema se chama SGV/JrBordados no código).

## Termos novos ou ambíguos

- **Setor** (HOME) × **Módulo**: o dono usa "setores" para as áreas da HOME e "módulos" para os papéis de pessoa (Visitantes… Usuários). No código, "módulo" são os setores (`modulos`). Padronizar no glossário.
- **Senha-Master** (= Chave mestre).
- **Checking** (checagem de banco na abertura).
- **Terceirizar / Fornecedor de serviço**.
- **OS (Ordem de Serviço)** com **código único**; **Orçamento** × **Serviço**.
- **Faturado** × **baixo custo** (forma de pagamento do Cliente).
- **Resgate** = recuperação de acesso por e-mail/WhatsApp. **Retirada** = cliente busca o pedido na Expedição (não usar "resgatar").
- **Retrabalho**, **Pedido abandonado**, **Aprovação da arte**.
- **Vitrine** (galeria pública do Visitante), **Consentimento de exibição** (cliente autoriza mostrar o trabalho; grifes).
- **Instalação** (provisionar o DB de uma nova empresa) × **Init** (criar tabelas/seed no DB já existente).
- **Tabela** (de preços).
- **Importação** no Config.
