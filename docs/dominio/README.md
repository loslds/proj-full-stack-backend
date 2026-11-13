# Domínio: visão do dono, por assunto

Visão do produto ditada pelo dono em 2026-11-13, dividida em um arquivo por assunto. Cada arquivo tem três partes: **decisões do dono** (✔), **verificado no código** e **lacunas abertas** para o interrogatório (grill). Depois do grill, o conteúdo migra para `visao-geral.md`, `GLOSSARY.md`, ADRs e `roadmap.md`, e estes arquivos são removidos ou reduzidos.

## Arquivos

| Assunto | Arquivo | Estado |
| ------- | ------- | ------ |
| Cadastros, papéis, assistente da empresa, importar | [cadastros.md](cadastros.md) | **Grill começa aqui** |
| Login, chave-master, resgate, permissões | [login-e-acesso.md](login-e-acesso.md) | Depois de Cadastros |
| Recepção, OS, fluxo do pedido, exceções | [recepcao-e-os.md](recepcao-e-os.md) | OS não existe no banco |
| Multiempresa, instalação, abertura do sistema | [multi-empresa-e-instalacao.md](multi-empresa-e-instalacao.md) | Direção definida |
| Visitante e vitrine | [vitrine-visitante.md](vitrine-visitante.md) | Cadastro de Visitante é futuro |
| Administração e Config | [administracao-e-config.md](administracao-e-config.md) | Administração fora do MVP |

## Ponto de retomada

Última posição (2026-11-13): captura concluída para cadastros, fluxo do pedido, multiempresa e visitante. **Grill iniciado por Cadastros**: o assistente montou quatro perguntas (unicidade por empresa, regra de duplicidade, flag de arquivado, OS aponta para o cadastro); o dono pediu antes **particionar o documento por assunto**, feito aqui. Próximo passo: o dono confirma o grill de [cadastros.md](cadastros.md) (as recomendações estão no fim do arquivo, na ordem de prioridade).

## Termos novos (vão para o GLOSSARY depois do grill)

- **Setor** (área da HOME) × **Módulo**: o dono diz "setor"; no código, `modulos`. Padronizar.
- **Senha-master** = chave-master (suporte permanente). **Chave de instalação** = licença por cliente (adiada).
- **Origem** de um cadastro = seus papéis (um cadastro pode ter vários; Consumidor é estágio).
- **Importar** = preencher novo formulário com dados existentes e editar.
- **Arquivado** = flag que esconde o registro do uso normal; listado só no Config.
- **Conta corrente** = saldo por papel (Cliente, Fornecedor), na Administração.
- **Resgate** = recuperação de acesso por e-mail/WhatsApp. **Retirada** = cliente busca o pedido na Expedição (não usar "resgatar").
- **OS**, **Orçamento** × **Serviço**, **Retrabalho**, **Pedido abandonado**, **Aprovação da arte**, **Tabela** (de preços), **Faturado** × **baixo custo**.
- **Vitrine**, **Consentimento de exibição** (grifes).
- **Instalação** (provisionar banco) × **Init** (criar tabelas/seed no banco existente). **Checking** (checagem do banco na abertura).

## Correções ao que já está nos outros docs

- `roadmap.md`, módulo "Visitante + Recepção": reescrever (Visitante é vitrine anônima; cadastro de Visitante é futuro; a Recepção depende da OS, que não existe).
- `visao-geral.md`: o produto atende **qualquer** empresa de bordado/laser com terceirização; setor **Design** vem logo após a Recepção; Administração faz compras, vendas, recebimentos e pagamentos.
- `ADR 0002`: isolamento por **instalação (banco)**, várias empresas dentro dele.
