# Domínio: Cadastros e papéis

Status (2026-11-13): captura do dono concluída; **grill em andamento** (começa por aqui). `✔` = decisão do dono; `?` = lacuna para o grill; `[código]` = verificado no código.

Ordem de implementação decidida pelo dono: **primeiro o cadastramento, depois login e acesso** ([login-e-acesso.md](login-e-acesso.md)).

## Papéis de pessoa

- **Consumidor** ✔: pede orçamento e, depois, serviço; no futuro consulta o serviço prestado. Cadastro mínimo: **nome e telefone**.
- **Cliente** ✔: volta várias vezes. Vira Cliente quem aceita e preenche o cadastro de cliente (endereço, documento CPF ou CNPJ, e-mail…).
- **Fornecedor** ✔: fornece material e/ou presta serviço à empresa. Mesmos requisitos de cadastro do Cliente.
- **Funcionário** ✔: trabalha na empresa; pode ou não ter acesso ao sistema.
- **Usuário** ✔: usa o sistema, com permissão por ação ([login-e-acesso.md](login-e-acesso.md)).
- **Visitante**: sem cadastro no MVP ([vitrine-visitante.md](vitrine-visitante.md)).

Um usuário, cliente, fornecedor ou consumidor pertence **a uma só empresa** (FK) ✔.

## Combinações de papéis ✔

- Funcionário pode ser também Fornecedor e Cliente. Fornecedor pode ser Cliente. Depois de Cliente, pode também ser Fornecedor.
- **Consumidor** é **estágio**: só vira Cliente, não coexiste com outro papel.
- Mecanismo: **um único registro em `cadastros`** com várias colunas de papel preenchidas (`id_clientes` e `id_fornecedores` ao mesmo tempo). Mesmos dados; na Administração, uma **conta corrente por papel** ([administracao-e-config.md](administracao-e-config.md)).
- [código] `utils/resolveCadastroOrigem.ts` devolve só **uma** origem (primeira FK > 0). Precisa listar todas.

## Consumidor → Cliente ✔

1. Só vira Cliente se aceitar; preenche o formulário de Cliente (local, CPF ou CNPJ escolhendo PF/PJ; o telefone já existe).
2. Cria-se o registro em `clientes`.
3. Em `cadastros`, o **mesmo registro** continua: `id_clientes` aponta o novo cliente e `id_consumidores` é **zerado**.
4. O registro em `consumidores` recebe uma **flag de arquivado** (não se apaga).
5. As telas e listagens de uso normal **escondem** arquivados; só o Config, quando o dono pede, **lista os arquivados**.

Como o cadastro é o mesmo, documentos, e-mails e telefones continuam ligados a ele: nenhuma transferência de OS se a OS apontar para o cadastro (ver `?` abaixo).

## Assistente de cadastro (modelo para todos os papéis) ✔

Primeira coisa ao instalar: cadastrar a **empresa**. O mesmo assistente (mesmos passos) vale para Cliente, Fornecedor, Funcionário e Consumidor.

1. **Empresa**: nome e **tipo de pessoa** (PF/PJ). Grava em `empresas`: `nome`, `fantasy` (nome fantasia/comercial), `id_pessoas`. Retorna sabendo o id da empresa.
2. **Sobre** (`formhlpemp`, `mediumtext`): texto "Sobre/Quem sou" (referências, objetivos, credenciais). Aparece ao clicar na **logo** no header.
3. **Endereço**: abre em `cadastros` um registro com `id_empresas` e campos limpos; o usuário informa endereço, complemento, bairro e CEP e continua (grava no registro aberto).
4. **Estado → Cidade**: dropdown de Estados (seed); ao escolher, filtra `cidades` por `id_estados`, só então libera o dropdown de Cidades; submete e atualiza `cadastros` (`id_cidades`).
5. **Logo (opcional)**: combobox "Deseja implementar uma logo?"; se sim, janela para pesquisar/selecionar a imagem. Ela substitui a logo nas páginas, listagens, formulários, relatórios e impressões quando logado.
6. **Documento**: PJ → CNPJ; PF → CPF; mais inscrição estadual e municipal. Grava em `docs`.
7. **Contatos**: telefone fixo, celular, contato e e-mail (e e-mail de resgate). Gravam em `fones` e `emails`.
8. **Flags** `has_doc`, `has_email`, `has_fone` em `cadastros` recebem 0/1 conforme o que foi informado.
9. **Antes de gravar**, o sistema pesquisa se já existe registro com o mesmo documento, telefone, celular e e-mail (nome, documento, telefone e e-mail iguais não podem coexistir na busca de um cadastro).

O que vem depois do contato (por exemplo, o primeiro usuário) o dono deixou **em aberto** para decidir no caminho.

## Importar ✔

**Importar** = preencher o formulário novo com dados de um cadastro existente e **editar o que for diferente**. Não é sincronização. Entre empresas do mesmo banco, o cadastro é **copiado** e o complemento ou número do local deve ser diferente (mesmo prédio, unidades diferentes). Cada cadastro tem `id_empresas`; **empresas não compartilham cadastros** ([multi-empresa-e-instalacao.md](multi-empresa-e-instalacao.md)).

## Verificado no código

- [código] `docs` (`cpf`, `cnpj`, `inscr_estadual`, `inscr_municipal`), `emails` (`email`, `email_resgate`), `fones` (`fone_fixo`, `fone_celular`, `fone_contacto`), todos com `id_cadastros`. `UNIQUE` **global** em `cpf`, `cnpj`, as duas inscrições, `email`, `fone_fixo`, `fone_celular`.
- [código] `cadastros`: uma FK por papel (empresas, visitantes, consumidores, clientes, fornecedores, funcionários), `id_cidades`, `id_imagens`, `endereco`, `complemento`, `bairro`, `cep`, `has_*`. **Sem coluna de número.** FKs com `default: 0`.
- [código] `consumidores` e `clientes` têm `id_empresas`, `id_pessoas`, `nome`, `fantasy`. **Sem campo de arquivamento** (só `users` e `chaves` têm flag de ativo).
- [código] `cidades` única por (`nome`, `id_estados`). `empresas` única por (`nome`, `fantasy`, `id_pessoas`). Tabela é `emails`, flag é `has_email`.
- [código] Filiais têm CNPJ próprio (raiz comum, sufixo e dígitos diferentes): o `UNIQUE` em `cnpj` está correto.

## Lacunas abertas (grill, na ordem de prioridade)

1. **Unicidade por empresa × importação**: importar copia documento, e-mail e telefone para um 2º cadastro, mas o banco proíbe repetir. _Recomendação:_ unicidade **por empresa** (id_empresas nas três tabelas ou regra no backend).
2. **Regra de duplicidade na mesma empresa**: _recomendação:_ **documento bloqueia** (mostrando de quem é), **telefone e e-mail avisam**, nome só sugere. O dono descreveu "nome, documento, telefone e e-mail iguais não podem" (ambíguo: qualquer um ou todos?).
3. **Flag de arquivado**: _recomendação:_ `arquivado` (0/1) + data + quem, em **todas** as tabelas de papel; filtro **no backend** (hoje `/api/*` e `/api/grid/*` listam tudo). Recuperável? Rastro de "foi consumidor" (já que `id_consumidores` zera)?
4. **OS aponta para o cadastro** (não muda) e guarda o papel à parte. _Recomendação:_ sim.
5. Mensagem da duplicata: mostra **quem** tem o dado? Pode **reaproveitar** o cadastro existente?
6. Regra "complemento/número diferente": só para o endereço da empresa ou qualquer cadastro? Onde fica o **número**? Endereço igual: recusa ou só avisa?
7. Validação: dígito verificador de CPF/CNPJ; telefone com `libphonenumber-js`; guardar formatado ou só dígitos (afeta a busca por duplicata).
8. Obrigatoriedade por papel (Consumidor: nome+telefone; Cliente/Fornecedor: documento, e-mail, endereço; Funcionário? empresa?).
9. Flags `has_*`: derivadas ou mantidas? (Risco de dessincronizar; _recomendação:_ backend atualiza na mesma transação.)
10. Consumidor tem `id_pessoas` obrigatório: qual o padrão até virar Cliente (PF)?
11. Assistente: **componente único** parametrizado por papel ou telas separadas (hoje há `Cad*` por domínio)? Grava passo a passo (órfãos se abandonar) ou tudo numa transação? Retomar depois?
12. `formhlpemp`: texto simples ou formatado? Sanitizar? Tamanho?
13. Logo: lista imagens do servidor ou faz upload? Tipos, tamanho, logo padrão, vale para outros papéis? Aparece antes do login?
14. Endereço: um só por cadastro ou vários (entrega)? CEP preenche automático (`cepRoutes`)? `cidades`: seed nacional ou parcial? Permitir cidade nova?
15. Importação: que campos copia (tudo, contato, endereço)? Guarda o cadastro de origem (rastro)?
16. Combinações restantes: **Usuário** é papel ou acesso de um Funcionário? Consumidor pode virar Fornecedor/Funcionário direto?
17. FK com valor 0: existe registro `id = 0` nas tabelas-pai ou a FK não é imposta? Revisar antes de mexer em `cadastros`.
18. Busca por telefone (Recepção): só na empresa A? Mostra nome completo de Usuário/Fornecedor? LGPD.
19. MEI: CPF **ou** CNPJ próprio, ou os dois? (O dono diz CPF; na prática o MEI costuma ter CNPJ.)
20. Matriz e filiais **não se ligam** ✔ (cada filial é uma empresa independente).
