# Domínio: Administração e Config

Status (2026-11-13): Administração **sem modelo e fora do MVP**; Config em uso pelo dono para validar tabelas. `✔` = decisão do dono; `?` = lacuna; `[código]` = verificado.

## Administração ✔

- Tem os controles de **compras e vendas** da empresa.
- É ela que faz **recebimentos e pagamentos**.
- Recebe direto os Clientes **faturados** ([recepcao-e-os.md](recepcao-e-os.md)).
- Cada pessoa com dois papéis tem **uma conta corrente por papel** (como Cliente e como Fornecedor).
- Gerentes de filial têm liberdade para faturar desde que sigam as normas acordadas com a matriz; **preços** são independentes por filial/empresa.

## Config ✔

- Hoje é o setor que o dono usa em desenvolvimento para testar se os campos gravados nas tabelas estão **corretos, fiéis e seguros** em **inclusão, alteração, exclusão, importação, listagem impressa em papel e visualização**.
- Receberá a **criação de bancos** das novas instalações ([multi-empresa-e-instalacao.md](multi-empresa-e-instalacao.md)).
- Terá a **listagem de registros arquivados** ([cadastros.md](cadastros.md)).

## Verificado no código

- [código] Não existem tabelas de conta corrente, lançamentos, compras, vendas, preços ou linhas.
- [código] `Config.tsx` (872 linhas) está roteado; telas `Cad*` de cada tabela existem (inclusão, alteração, exclusão, lista, pesquisa) mas **sem rota**; `BackupDB.tsx`, `RestoreDB.tsx`, `ExplorerDB.tsx` sem rota.

## Lacunas abertas

1. **Conta corrente**: entidades, lançamentos, saldo, quem lança; é aberta ao virar Cliente ou na primeira OS faturada? Pode compensar saldo Cliente × Fornecedor? **MVP ou depois?** (Recomendação: depois, na fase da Administração.)
2. **Compras e vendas, recebimentos e pagamentos**: quais entidades (contas a pagar/receber, notas)?
3. **Importação** no Config: o que importa (CSV, ZIP de imagens, outro) e para quais tabelas?
4. **Impressão em papel**: A4 simples ou relatórios formatados? Existe a função hoje?
5. **Tabela de preços**: quem mantém (Administração)? Por empresa.
6. **Quais cadastros de apoio o Config abre** e qual a ordem de validação dos campos (inclusão, alteração, exclusão, importação, impressão, visualização).
