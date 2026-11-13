# Roadmap

MVP definido **por módulo**. Módulos fora do MVP ficam em fases futuras. Cada tarefa tem critério de pronto verificável. Marque `[x]` e ligue ao commit ao concluir.

Ordem: Plataforma → Acesso → Visitante+Recepção. Acesso vem antes de Visitante porque protege as rotas que ele usa.

## MVP

### 1. Plataforma (Instalação + Master + Config)

Meta: subir o produto do zero e entrar como suporte.

- [ ] Documentar e validar `docker compose up` + `yarn dev` (backend e frontend) do zero. _Pronto:_ [como-rodar.md](como-rodar.md) executado por outra pessoa sem ajuda.
- [ ] Config abre todos os cadastros de apoio do MVP (cargos, ações, módulos, perguntas, estados, cidades, serviços). _Pronto:_ cada um lista, inclui, altera e exclui no navegador.
- [ ] Tirar `http://localhost:5000` fixo de `src/api/api.ts`, `Home.tsx`, `Config.tsx`, `InstallSys.tsx` (usar `/api`). _Pronto:_ nenhum `localhost:5000` em `src`.
- [ ] Caminho de imagens configurável por env (hoje `C:/imagens-sgv`). _Pronto:_ roda em container Linux.
- [ ] Rotas de sistema (`/api/system/*`) exigem token master.

### 2. Acesso (Usuários + permissões por módulo)

Meta: usuário entra com login simples e só vê o que seu Acesso permite. A master continua como suporte ([ADR 0001](adr/0001-chave-mestre-acesso-de-suporte.md)).

- [ ] `POST /api/auth/login` (identificador + senha → JWT de usuário com módulos e ações). Senha só como hash. _Pronto:_ login correto devolve token; errado devolve 401.
- [ ] Middleware `requireAuth` (aceita master ou usuário) e `requireAccess(modulo, acao)`. _Pronto:_ sem token → 401; sem permissão → 403; master passa.
- [ ] Aplicar middleware em todas as rotas, exceto `/auth/*` e `/system/health`.
- [ ] Frontend: rota `/login`, `Login.tsx` ligado ao endpoint, guardar token de usuário, `api` com interceptor `Bearer`.
- [ ] Fluxo de primeiro uso: master cria o 1º usuário Administrador. _Pronto:_ banco vazio → master → usuário → login.
- [ ] Telas de users, acessos, chaves, cargos, ações roteadas e funcionando.
- [ ] Logout registra `logins.dt_logout`.

### 3. Visitante + Recepção

Meta: registrar visitantes e visitas, atender na recepção (cadastros).

- [ ] Fluxo do Visitante ponta a ponta: cadastro → entrada → saída → histórico e tempo. _Pronto:_ roteiro manual no navegador sem erro.
- [ ] Cadastros de pessoa, empresa, visitante, cliente, consumidor com contatos (e-mail, doc, fone, CEP). Telas roteadas.
- [ ] Recepção: descomentar e rotear as páginas de pesquisa/cadastro do módulo; **sem** Ordem de Serviço.
- [ ] Validação de entrada em todos os POST/PATCH do MVP (zod já existe; conferir cobertura).

### Transversal MVP

- [ ] `.env.example` sem segredos.
- [ ] Testes mínimos (login, middleware, visita aberta única) e script `yarn test`.
- [ ] Desligar `synchronize: true` em produção (migrations ou flag por env).
- [ ] Remover `console.log` de depuração e o log de `MASTER_STATIC` em `index.ts`.

## Fases futuras (fora do MVP)

Cada fase vira um bloco de tarefas só quando for priorizada.

| Fase | Módulo | Conteúdo |
| ---- | ------ | -------- |
| 2 | Pedidos | Modelo de Ordem de Serviço (cliente, serviço, itens, status). Pré-requisito dos setores. |
| 3 | Design, Produção, Acabamento, Expedição | Fila e status por setor sobre a OS; telas dos módulos. |
| 4 | Administração | Relatórios, preços e linhas (`pages/tabela`). |
| 5 | Multi-tenant | Isolamento por cliente SaaS, **somente em tabelas extremamente necessárias** (lista a definir; ver [adr/0002-multi-tenant-pendente.md](adr/0002-multi-tenant-pendente.md)). Decidir a estratégia antes do 1º cliente além do JrBordados. |
| 6 | Resgate de acesso | Perguntas secretas (`pergsresps`) para recuperar acesso. |
| 7 | Nuvem | Imagens de produção, CORS por env, HTTPS, segredos, CI/CD, backup automatizado. |
