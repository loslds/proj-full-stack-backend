# Domínio: Cadastros e papéis

Status (2026-11-13): captura do dono concluída; **grill em andamento** (começa por aqui). `✔` = decisão do dono; `?` = lacuna para o grill; `[código]` = verificado no código.

Ordem de implementação decidida pelo dono: **primeiro o cadastramento, depois login e acesso** ([login-e-acesso.md](login-e-acesso.md)).

## Papéis de pessoa

- **Consumidor** ✔: pede orçamento e, depois, serviço; no futuro consulta o serviço prestado. Cadastro mínimo: **nome e telefone**. Não tem tipo de pessoa (PF/PJ) nem documento ao ser criado.
- **Cliente** ✔: volta várias vezes. Vira Cliente quem aceita e preenche o cadastro de cliente (endereço, documento CPF ou CNPJ, e-mail…).
- **Fornecedor** ✔: fornece material e/ou presta serviço à empresa. Mesmos requisitos de cadastro do Cliente.
- **Funcionário** ✔: trabalha na empresa; pode ou não ter acesso ao sistema.
- **Usuário** ✔: papel de **qualquer cadastro que obtém acesso** ao sistema (Funcionário, Cliente, Fornecedor…), não só de Funcionário. Tem permissão por ação ([login-e-acesso.md](login-e-acesso.md)).
- **Visitante**: sem cadastro no MVP ([vitrine-visitante.md](vitrine-visitante.md)).

Um usuário, cliente, fornecedor ou consumidor pertence **a uma só empresa** (FK) ✔.

## Combinações de papéis ✔

- **Cliente, Fornecedor e Usuário combinam livremente**, em qualquer ordem e em qualquer combinação (os três ao mesmo tempo, ou dois quaisquer) ✔ (confirmado em 2026-11-18). Funcionário também pode ser Fornecedor e Cliente.
- **Consumidor** é **estágio**: não coexiste com outro papel. Só pode virar **Cliente ou Fornecedor** e, **depois disso**, acumular outros papéis. **Nunca volta a ser Consumidor** (o registro de consumidor fica arquivado).
- Mecanismo: **um único registro em `cadastros`** com várias colunas de papel preenchidas (`id_clientes` e `id_fornecedores` ao mesmo tempo). Mesmos dados; na Administração, uma **conta corrente por papel** ([administracao-e-config.md](administracao-e-config.md)).
- [código] `utils/resolveCadastroOrigem.ts` devolve só **uma** origem (primeira FK > 0). Precisa listar todas.

## Nota fiscal para Consumidor ✔

- Dados fiscais só **no momento da emissão** da nota. Nesse momento o sistema pergunta o tipo de **Pessoa (PF ou PJ)**.
- Definido o tipo, os dados são gravados em `cadastros` e `docs` (CPF ou CNPJ) do mesmo cadastro, sem criar Cliente.
- [código] `consumidores.id_pessoas` hoje é **obrigatório** (`nullable: false`, FK `RESTRICT`, default 0). Isso conflita com esta regra: o Consumidor nasce sem tipo. Segue a convenção do dono: **`id = 0` é o valor padrão "não definido"** em todas as FKs (unsigned, sem bug de nulo e fácil de testar se existe vínculo). Consumidor nasce com `id_pessoas = 0`. [código] O seed de `pessoas` só tem PF e PJ, **sem linha `id = 0`**; com FK `RESTRICT` o MySQL recusaria o 0 (ver pergunta 17).

## Consumidor → Cliente ✔

> O mesmo fluxo vale para **Consumidor → Fornecedor** (troque Cliente por Fornecedor e `id_clientes` por `id_fornecedores`).
>
> Esse caminho é **raro**. Se um Consumidor quiser fornecer serviço (pós-trabalho) ou material à empresa, é cadastrado como **Fornecedor** na modalidade **terceirizado**; e, tendo crédito como Fornecedor, pode também **comprar produtos da empresa** abatendo desse crédito (conta corrente do papel Fornecedor, ver [administracao-e-config.md](administracao-e-config.md)).

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

## Decisões do grill (2026-11-13) ✔

1. **Unicidade por empresa**: documento, e-mail e telefone podem repetir entre empresas do mesmo banco, **não** dentro da mesma empresa. Troca o `UNIQUE` global por regra por empresa (`id_empresas` nas tabelas ou chave composta via `cadastros`; escolher na implementação).
2. **Duplicidade na mesma empresa**: **documento bloqueia** (mostrando de quem é); **telefone e e-mail avisam** e deixam seguir; nome só sugere.
3. **Arquivado** ✔ (decidido em 2026-11-18), em **todas** as tabelas de papel, com 4 campos: `arquivado` `TINYINT(1)` default 0 (como `is_actived` e `has_*`); **`arquivadoEm`** (`datetime`, nulo); **`userArquivador`** (string, sem FK): id do `users` sem zero à esquerda (`'1'`), `'master'` se foi a chave-mestre, vazio/nulo se não está arquivado; **`origem`** (`varchar(30)`): **destino da conversão** do Consumidor (`cliente` ou `fornecedor`), ou seja, onde se originou o novo registro; só preenchida em arquivados vindos de Consumidor; o **backend** filtra arquivados por padrão (hoje `/api/*` e `/api/grid/*` listam tudo); só a listagem de arquivados do Config os mostra.
4. **OS aponta para o cadastro** (`id_cadastros`, que não muda) e guarda o papel usado à parte.

5. **Arquivar o Consumidor** serve só para **não deletar** o registro. Só se arquiva **depois de checado** que ele **virou Cliente**. Vale para qualquer registro **transferido (importado)** para outro papel (Cliente, Fornecedor etc.): o arquivado **mantém o id** (sem buraco de registro deletado na sequência) e **preserva o histórico**, para saber o que ocorreu.
6. **Desarquivar** só no **Config** e só para **reparar um erro** na mudança; exige **justificativa** (registrada: quem, quando, motivo).
7. **Rastro**: ao converter, guarda-se no cliente a **data e a origem** da conversão (o `id_consumidores` do cadastro zera).
8. **Flags `has_doc`, `has_email`, `has_fone`**: o **backend** as atualiza na **mesma transação** que grava documento ou contatos; o frontend nunca as envia.
9. **Assistente da empresa**: grava **passo a passo**, e o cadastro fica marcado **"incompleto"** até o fim, para o sistema **retomar** o assistente em vez de deixar registros órfãos.

10. **Duplicidade com ajuda**: se o documento já existe, o sistema mostra **o nome de quem tem** e oferece **reaproveitar esse cadastro** (acrescentando o papel, ex.: Fornecedor que vira também Cliente) em vez de só recusar.
11. **Validação no backend**: confere os **dígitos verificadores** de CPF e CNPJ e guarda **só os dígitos**; a formatação é só na tela (a busca por duplicata não erra por pontuação).
12. **Obrigatório por papel**: Consumidor = nome e telefone. Cliente e Fornecedor = documento, e-mail e endereço. Funcionário = igual a Cliente.
13. **Número do endereço**: nova coluna `numero` em `cadastros`, para a regra "complemento ou número diferente" funcionar.

14. **Endereço igual só avisa**; a regra "complemento ou número diferente" vale para **qualquer cadastro**.
15. **Telefone** guardado em **E.164** pelo backend (`libphonenumber-js`), para o mesmo número não entrar de dois jeitos.
16. **Assistente** = **componente único** parametrizado por papel (empresa, cliente, fornecedor, funcionário, consumidor); as telas `Cad*` atuais servem de base para listar e pesquisar.
17. **`formhlpemp`** em **texto simples**, limpo pelo backend antes de gravar. **Logo** por **upload**, com tipo e tamanho validados no servidor.

## Princípio de arquitetura (dono, 2026-11-13) ✔

**Todo processo é efetuado no servidor, para não sobrecarregar o cliente (frontend).** O frontend só apresenta e coleta; validação, busca de duplicidade, filtros (estado → cidade, arquivados), importação, cálculo das flags `has_*` e regras de papel rodam no **backend**. Registrado em [../regras-de-ouro.md](../regras-de-ouro.md).

## Lacunas abertas (grill, na ordem de prioridade)

1. ~~Arquivado, rastro, flags `has_*`, retomada do assistente~~ (decididos acima). Resta definir a **justificativa** do desarquivar (campo e tabela de auditoria) e como marcar **"incompleto"** (campo `status` do cadastro?).
5. ~~Mensagem da duplicata~~ (decisão 10).
6. Regra "complemento/número diferente": coluna `numero` decidida (13). Resta: vale só para o endereço da **empresa** ou qualquer cadastro? Endereço igual: recusa ou só avisa?
7. ~~Validação de documento~~ (decisão 11). Resta: telefone em formato internacional (`libphonenumber-js`, E.164) no backend?
8. ~~Obrigatoriedade~~ (decisão 12). Resta: obrigatório para a **empresa dona** (documento, endereço, logo opcional)?
10. ~~Padrão de `id_pessoas` do Consumidor~~ Pessoa é só o tipo PF/PJ (a `sigla` serve para listar nome + sigla). Decidido: o Consumidor **não tem tipo** até a emissão de nota fiscal ou virar Cliente (ver "Nota fiscal para Consumidor"). A entity já aceita 0 como padrão.
11. Assistente: **componente único** parametrizado por papel ou telas separadas (hoje há `Cad*` por domínio)? (Gravação passo a passo e retomada: decididos acima.)
12. `formhlpemp`: texto simples ou formatado? Sanitizar? Tamanho?
13. Logo: lista imagens do servidor ou faz upload? Tipos, tamanho, logo padrão, vale para outros papéis? Aparece antes do login?
14. Endereço: um só por cadastro ou vários (entrega)? CEP preenche automático (`cepRoutes`)? `cidades`: seed nacional ou parcial? Permitir cidade nova?
15. Importação: que campos copia (tudo, contato, endereço)? Guarda o cadastro de origem (rastro)?
16. ~~Usuário~~ ✔ é papel de qualquer cadastro com acesso. ✔ Consumidor vira só **Cliente ou Fornecedor**; **não vai direto a Funcionário** (o Funcionário já nasce com cadastro completo e pode também ser Fornecedor).
17. ✔ Convenção: `id = 0` é o padrão "não definido". [código] Falta garantir que a linha `id = 0` exista nas tabelas-pai (seed; `AUTO_INCREMENT` troca o 0 pelo próximo id, exige `NO_AUTO_VALUE_ON_ZERO`) ou que a FK não seja imposta. Verificar no banco real antes de mexer em `cadastros`.
18. Busca por telefone (Recepção): só na empresa A? Mostra nome completo de Usuário/Fornecedor? LGPD.
19. MEI: CPF **ou** CNPJ próprio, ou os dois? (O dono diz CPF; na prática o MEI costuma ter CNPJ.)
20. Matriz e filiais **não se ligam** ✔ (cada filial é uma empresa independente).
