# Domínio: Recepção, OS e fluxo do pedido

Status (2026-11-13): captura concluída para o fluxo geral; **a OS não existe no banco**; **grill depois de Cadastros e Acesso**. `✔` = decisão do dono; `?` = lacuna; `[código]` = verificado.

## Setores (ordem do fluxo) ✔

Visitantes, Recepção, **Design** (logo após a Recepção), Produção, Acabamento, Expedição, Administração, Config. No código, esses setores são os `modulos`.

## Fluxo de uma solicitação ✔

1. O cidadão pede **Serviço** e/ou **Orçamento** na **Recepção**. O atendente preenche um **formulário** com o necessário para a execução.
2. **Orçamento**: não vai ao Design; a recepção obtém o valor com o Design **ou** na **Tabela** existente e cola no orçamento.
3. **Serviço com criação**: vai ao **Design**, que desenvolve a arte e envia ao cliente uma **foto para aprovação**. O Cliente só recebe o produto depois de aprovar; **não existe recusa** após isso.
4. A **OS** (orçamento e serviço) é gravada na Recepção em uma tabela com **código único**. A OS é **diferente por empresa**.
5. Após **aprovada**, vai para a **Produção**; ao término (ou parte), para o **Acabamento**; depois para a **Expedição**.
6. A **Expedição** recebe o material e contata o Cliente/Consumidor para **retirar e pagar** conforme a OS.
7. **Pagamento**: Clientes de **baixo custo** pagam na Expedição; os **faturados** vão direto para a **Administração**.
8. Serviços podem ser **terceirizados** a Fornecedores (silkscreen, estamparia, adesivo sobre tecido…).

## Atendimento na Page OS ✔

1. O atendente (logado na empresa A) conversa com o cliente e abre a **Page OS**.
2. Pode **oferecer o cadastro como Cliente** e explicar os motivos (o dono anunciará quais).
3. Registra o **telefone**; ao lado, botão que **pesquisa em `fones`**. Se achar, vê de quem é (por `id_cadastros`) e confere o nome.
4. Se não achar: o cliente escolhe ser atendido como **Consumidor** ou **Cliente**. Fornecedor, Usuário ou Funcionário que aparecer na busca pode ser incluído também como Cliente/Consumidor ([cadastros.md](cadastros.md)).

## Exceções ✔

- **Peça errada na Produção** (raro): pede-se ao cliente o mesmo material para refazer, **ou** a empresa repõe.
- **Cliente não retira o pedido**: risco do comércio de prestação de serviço. Segundo o dono, após **comunicar** o cliente e passados **90 dias**, a empresa pode **vender o produto feito**. (Entendimento do dono; **validar com assessoria jurídica** antes de implementar.)

## Verificado no código

- [código] **Não existe** tabela de OS, orçamento, preço ou linha. `servicos` e `grpservicos` (seeds) existem; `pages/tabela/{linha,preco}` está vazio.
- [código] Telas dos setores (`Recepcao.tsx`, `Design.tsx`…) são stubs de ~100 linhas, sem rota; as páginas de pesquisa estão comentadas.
- [código] Seeds de `modulos` (setores), `servicos` (Design, Bordados, DTF, Adesivo UV, Corte a Laser, Gravação, Silkscreen) e `grpservicos`.

## Lacunas abertas

1. **OS**: um registro serve Orçamento e Serviço? Como o orçamento aprovado vira serviço (mesmo código)? Formato do **código único**? **Status** e quem muda cada um? A OS aponta para o **cadastro** (recomendado) e guarda o papel.
2. **Parcial**: uma OS pode estar em dois setores (lote parcial)? Como registra a quantidade?
3. **Terceirizado**: em que etapa o Fornecedor entra e como a OS volta dele?
4. **Tabela de preços**: quem a mantém? É por empresa (sim, filiais e empresas do mesmo banco têm preços próprios)?
5. **Aprovação da arte**: canal (WhatsApp, e-mail, sistema), registro (quem, quando, imagem) e se é pré-requisito para liberar a Produção.
6. **Retrabalho**: registro na OS (peça refeita, material de quem, custo, quem arca)?
7. **Pedido abandonado**: registro das comunicações (data, canal), prazo de 90 dias, alerta, status "à venda". Validação jurídica.
8. **Baixo custo × faturado**: critério (campo no Cliente?). Consumidor sempre paga na Expedição?
9. **Telefone na OS sem cadastro**: guarda solto ou cria já um **Consumidor** (nome + telefone)?
10. **Motivos para virar Cliente**: o dono vai anunciar; viram texto de ajuda na Page OS? Configurável por empresa?
11. **Consentimento de exibição** da imagem na OS ([vitrine-visitante.md](vitrine-visitante.md)): campo da OS ou por imagem?
12. **Design** e demais setores: papel exato, quem usa, o que registram.
