# Domínio: Como se entra no sistema (narrativa do contexto de acesso)

Status (2026-11-18): rascunho a partir do relato do dono. `✔` = decisão do dono; `?` = lacuna; `[código]` = verificado. Complementa [login-e-acesso.md](login-e-acesso.md) e [multi-empresa-e-instalacao.md](multi-empresa-e-instalacao.md). O estado que acompanha tudo isto é o `ContextAcesso` do frontend.

## Narrativa

### 0. Em desenvolvimento ✔

A **HOME** abre com **todos os módulos bloqueados, menos o Visitante**. Serve só para acompanhar a evolução do sistema.

### 1. Produto real: compra ou aluguel ✔

1. A pessoa compra ou aluga e recebe uma **chave de instalação**, gerada pelo **backend** (ainda não existe).
2. Depois de **ativar**, o sistema registra numa tabela **`installsys`** (a criar) os dados do cliente, a **chave randômica**, o **tempo de vida** do sistema, a situação "**em operação**" (que permite descarregar e instalar) e a **chave-mestre** daquele sistema.
3. O cliente descarrega e instala.

### 2. Primeira abertura ✔

1. Instalado e com as **tabelas checadas** (`initsys`, `chkdb`), o sistema abre a HOME.
2. Um **comando de tecla** (atalho de controle) leva o cliente a **editar a chave-mestre**.
3. Feito isso, o sistema **libera o Config**.

### 3. Config: montar a empresa ✔

Ordem: **`empresas` → `cadastros` → `users`** (o primeiro usuário). Depois o dono cadastra **funcionários** que vão usar o sistema, escolhendo para cada um **módulo, cargo e ações** (tabela `acessos`).

### 4. Resgate do acesso ✔

Ao salvar esses dados, o sistema pede que o usuário **aceite responder perguntas** de segurança:

1. Se aceitar, o sistema **sorteia 3 perguntas** da tabela `perguntas`.
2. As **3 respostas** são gravadas em **`pergsresps`**.

### 5. Volta à HOME para logar ✔

Terminado o Config, o sistema retorna à HOME e o usuário faz o **login**.

## Quem preenche cada parte do contexto

| Momento | Campos do `ContextAcesso` | Quem preenche |
| ------- | ------------------------- | ------------- |
| Abrir o app | `systemMode`, `initsys`, `chkdb`, `dataini` | Backend (health/init) e frontend |
| Empresa | `id_emp`, `nomeemp`, `fantemp`, `formhlpemp`, `id_logo_emp`, `logo_*` | Backend, a partir de `empresas` |
| Chave-mestre | `chvkey`, `ismaster`, `auth_admin` | Backend (`/api/auth/master`) |
| Login | `logado`, `auth`, `id_user`, `nomeuser`… | Backend (endpoint de login, **a criar**) |
| Permissões | `id_acesso`, `permissoes`, `key*`, `modulo`, `nivel`, `inctable`… | Backend devolve; frontend só escolhe o módulo aberto |

## Controle de etapas do cadastramento ✔

Campos do contexto que **controlam os assistentes de cadastro** (herdados do sistema anterior):

- `nrpg` / `nmpg` (antes `mdlogin` / `nmlogin`, renomeados em 2026-11-18): **número e nome da etapa** da página em cadastramento, de qualquer tabela (não é só `users` nem `cadastros`).
- `nrcont` / `nmcont`: **contador e nome da contagem de tentativas** (ver "PIN e limite de tentativas"); a confirmar.

Funcionamento: a página começa na etapa 0 (limpa ou já editada). Ao clicar em **Continuar**, o servidor verifica se o registro já existe. Se existir, é inválido e não avança; senão passa para a etapa 1, mostra os campos seguintes e assim até concluir. As etapas valem para as **folhas das páginas em cadastramento**.

## Campos `nome*` e `fant*` ✔

`nomeemp`, `fantemp`, `nomecli`, `fantcli`, `fantfor`, `fantcon`… (abreviam "nome fantasia do consumidor", "do cliente" etc.) guardam o **nome** e o **fantasy** (apelido ou nome de uso) do cadastro de cada papel. O `fantasy` é o nome que **aparece** ao imprimir, listar ou anunciar, e no **botão de login**. Depois de logado, o botão vira "logado" e abre uma **janela "quem sou"**: nome, quando entrou, quantas vezes entrou etc. (`qdd_acesso`, `ult_acesso`, `tempo`, `dataini`). `fantcom` no código é erro de grafia de `fantcon` (consumidor); manter por enquanto, como os demais nomes legados.

## PIN e limite de tentativas ✔

- `pinnumber`: PIN **numérico**. `pinchar`: PIN com **letras, símbolos e números**.
- Os contadores `nr*` (`nrcont`, e o equivalente de login) também servem para saber, no login, se o usuário **passou do limite de tentativas**. O mesmo vale ao informar o **nome** e ao responder as **perguntas** de segurança.
- Haverá **limite de tentativas e tempo** para acessar, **inclusive no resgate da senha**.
- Regra de servidor: contagem, bloqueio e janela de tempo são aplicados no **backend** (o contador do contexto só mostra o estado; não é a barreira).

## Estado do CRUD de tabelas (grid) ✔

`nametable`, `regtable`, `vistable`, `listtable`, `filttable`, `inctable`, `alttable` e `exctable` descrevem **qual tabela e qual ação o usuário está usando agora** no Config (e na instalação). São **estado de interface**, não permissões.

- `nametable`: tabela escolhida. `regtable`: tabela aberta para uso.
- `vistable` / `listtable`: visualizar e listar. `filttable`: a tabela foi **filtrada** ao pedir ao backend que a mostre.
- `inctable` / `alttable` / `exctable`: incluir, alterar, excluir.
- [código] `BarMenuConfig.tsx` zera todas ao trocar de tabela e liga `regtable` (+ `vistable` ou `filttable`) ao escolher a ação; `Config.tsx` reage a elas.
- O modal `CardHlpStateContextPage.tsx` é **só de desenvolvimento** (controle do dono); não vai para produção. Por isso mostrar `senha` e tokens ali não é problema, desde que o modal saia do build final.
- **O módulo Config só é exibido** com a **chave-mestre** ou para um `users` cadastrado com **alto acesso** (administrador). Os demais módulos seguem `permissoes` (módulo + cargo + ação).
- Login e inicialização por aquisição do produto ficam **para o fim**, depois de refazer Cadastros e depurar.

## Verificado no código

- [código] Existem entities `acessos`, `chaves`, `perguntas`, `pergsresps`, `logins` e `users`. **Não existe `installsys`** nem endpoint de login de usuário.
- [código] `users` já tem `id_cadastros`.

## Lacunas abertas

1. **Comando de tecla**: qual atalho? Só existe antes de a chave-mestre ser editada, ou sempre?
2. **Editar a chave-mestre**: o cliente troca o PIN/senha gerado na instalação por um próprio? A regra atual (data do dia, PIN derivado, `MASTER_STATIC`) continua ou é substituída pela chave guardada em `installsys`? (ver [ADR 0001](../adr/0001-chave-mestre-acesso-de-suporte.md))
3. **`installsys`**: mora no servidor do fornecedor, no banco do cliente ou nos dois? Quem valida o "tempo de vida" e o que acontece ao vencer?
4. **Chave de instalação**: o que ela libera na prática (baixar, ativar, ambos)? Muda o que o doc `login-e-acesso.md` chamava de "adiada".
5. **Perguntas de segurança**: valem para o **primeiro usuário** ou para **cada funcionário** que ganhar acesso? Quem responde pelo funcionário?
6. **Primeiro usuário**: recebe todos os módulos e ações (dono)? Quem define identificador e senha dele?
7. **Persistência**: ao recarregar a página, o login se mantém (token guardado) ou volta à HOME?
8. **Saída**: o que zera no contexto e o que registra em `logins`?
9. **Contadores**: o mesmo `nrcont` conta etapas do cadastro **e** tentativas, ou são campos separados? Qual o limite de tentativas e o tempo de bloqueio (login, nome, perguntas, resgate)? O bloqueio vale por usuário, por máquina ou ambos?
10. **Senha no estado**: o campo `senha` não deve ficar guardado depois do envio do login (o modal de desenvolvimento é outro assunto).
11. **"Alto acesso"**: o que define um `users` administrador, para o Config aparecer? Um cargo específico, um nível mínimo em `acessos` ou um marcador no `users`?
